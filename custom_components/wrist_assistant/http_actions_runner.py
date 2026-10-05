"""Sending an HTTP action from Home Assistant, for a device or for the panel.

Step 4d batch 4. A watch (or an iPhone with its own pair) asks for a run with
the signed ``http_action_run`` op; the panel's Test card asks with the
``wrist_assistant/http_actions/test`` WebSocket command. Either way the
request is built by ``http_actions.build_request`` from the home's library
and sent from here, and the answer is read with ``extract_reply`` and
``snippet``, so a device sees what it would have seen sending it itself.

The sending rules (contract rule 7):

* Timeout: the action's own, 10 s when it sets none, held between 1 and
  60 s. It covers the whole run, redirects and reading included.
* At most 256 KB of an answer is read; the rest is left unread.
* A self-signed server is accepted only when the action says so, and only
  for the action's own origin (scheme, host and port): a redirect anywhere
  else is checked as usual.
* No client certificate is sent. The flag stays in the document, unread.
* Redirects are followed by hand, at most 5 hops: a GET follows any
  redirect; a verb with a body follows only 307 and 308, which keep the
  verb and the body, and any other redirect is the answer, as on the watch.
  Origins are compared as scheme, host and port, a default port written or
  not. Once a redirect leaves the first origin, no header the action
  defined is sent again (they may carry its secrets); only the automatic
  Content-Type rides along with a kept body. A redirect from https to
  http is never followed and is the answer, and so is one from a host
  that is not this machine to one that is (loopback), the rule Home
  Assistant's own sessions keep.
* Cookies are neither kept nor sent: the sessions here have no cookie jar,
  as each run on the watch has a session of its own.
* At most 4 runs per device at a time; a fifth is refused ``busy``.
* A regex reply whose pattern is plain (``http_actions.regex_is_plain``,
  a search linear in the body) runs in the executor, off the event loop.
  Any other pattern runs in a child process killed after 2 s, since a
  search that backtracks badly holds the GIL and would freeze Home
  Assistant from a thread too; the value is then null.
* The whole run, reading the reply value included, ends within the
  action's timeout plus those 2 s, so a run always gives its slot back.
* Nothing secret is logged: a run writes the action's name, the status and
  the time it took to the debug log.

The network is behind ``session_for(verify_ssl)``, which tests replace.
"""

from __future__ import annotations

import asyncio
import ipaddress
import logging
import sys
import time
from collections.abc import Awaitable, Callable
from contextlib import contextmanager
from typing import TYPE_CHECKING, Any

import aiohttp
from yarl import URL

from .http_actions import (
    LEAVES_LIMIT,
    REGEX_CHILD_PATH,
    REGEX_CHILD_SCRIPT,
    Action,
    BuiltRequest,
    HTTPActionsInvalid,
    RequestError,
    build_action_request,
    decode_audio,
    discover_paths,
    extract_reply,
    find_action,
    global_pairs,
    library_globals,
    read_reply_config,
    regex_child_input,
    regex_child_output,
    regex_is_plain,
    snippet,
    validate_action,
    validate_globals,
)

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

MAX_RUNS_PER_DEVICE = 4
MIN_TIMEOUT = 1.0
MAX_TIMEOUT = 60.0
MAX_REPLY_BYTES = 256 * 1024
MAX_REDIRECTS = 5
# A watch records at most 30 s of 32 kbps AAC, about 120 KB. Four times that
# leaves room without letting one signed request carry anything large.
MAX_AUDIO_BYTES = 512 * 1024
# The longest base64 text such a clip can be, checked before decoding.
MAX_AUDIO_BASE64_CHARS = 4 * ((MAX_AUDIO_BYTES + 2) // 3)
# What one run may carry, checked before anything else is done with it.
MAX_RUN_BODY_BYTES = 1024 * 1024
MAX_VALUES = 64
MAX_VALUE_KEY_CHARS = 64
MAX_VALUE_CHARS = 4096
REDIRECT_STATUSES = frozenset({301, 302, 303, 307, 308})
# Seconds a pattern that is not plain may search for in its child process.
REGEX_CHILD_TIMEOUT = 2.0
# The device-key the panel's Test card counts its runs under.
PANEL_DEVICE = "panel"

# What a device shows when no answer came, in the words the watch's own
# URLSession errors use.
TIMED_OUT = "The request timed out."
NO_HOST = "A server with the specified hostname could not be found."
NO_CONNECTION = "Could not connect to the server."
BAD_CERTIFICATE = "The certificate for this server is invalid."
TOO_MANY_REDIRECTS = "too many HTTP redirects"
FAILED = "The request failed."

SessionFor = Callable[[bool], Any]
# ``asyncio.create_subprocess_exec``, which tests replace.
Spawn = Callable[..., Awaitable[Any]]


class HTTPActionRefusal(Exception):
    """A run that was not tried. ``code`` is what the op answers:
    ``not_found``, ``needs_setup``, ``missing_audio``, ``busy``,
    ``invalid`` or ``unavailable``; ``status`` its HTTP status."""

    _STATUS = {
        "not_found": 404,
        "needs_setup": 409,
        "missing_audio": 400,
        "invalid": 400,
        "busy": 429,
        "unavailable": 503,
    }

    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code
        self.message = message
        self.status = self._STATUS.get(code, 400)


class Answer:
    """What came back: the status, the headers (a repeated name joined with
    ", "), at most 256 KB of the body, or the error when nothing came."""

    def __init__(
        self,
        status: int | None = None,
        headers: dict[str, str] | None = None,
        body: bytes = b"",
        error: str | None = None,
    ) -> None:
        self.status = status
        self.headers = headers or {}
        self.body = body
        self.error = error


def values_problem(values: Any) -> str | None:
    """Why a run's values are too many or too long, or None. At most 64
    values, each key at most 64 characters and each value at most 4096."""
    if not isinstance(values, dict):
        return None
    if len(values) > MAX_VALUES:
        return f"a run may carry at most {MAX_VALUES} values"
    for key, value in values.items():
        if isinstance(key, str) and len(key) > MAX_VALUE_KEY_CHARS:
            return f"a value's key may be at most {MAX_VALUE_KEY_CHARS} characters"
        if isinstance(value, str) and len(value) > MAX_VALUE_CHARS:
            return f"a value may be at most {MAX_VALUE_CHARS} characters"
    return None


def run_input_problem(body_size: int, payload: Any) -> str | None:
    """Why a device's run request is too large to look at, or None: a raw
    body over 1 MB, values over :func:`values_problem`'s limits, or a clip
    whose base64 text is longer than the largest clip allowed (measured
    before it is decoded)."""
    if body_size > MAX_RUN_BODY_BYTES:
        return f"the request is over {MAX_RUN_BODY_BYTES} bytes"
    if not isinstance(payload, dict):
        return None
    problem = values_problem(payload.get("values"))
    if problem is not None:
        return problem
    audio = payload.get("audio")
    if isinstance(audio, str) and len(audio) > MAX_AUDIO_BASE64_CHARS:
        return f"the clip is over {MAX_AUDIO_BYTES} bytes"
    return None


def clamp_timeout(timeout: Any) -> float:
    """The action's timeout held between 1 and 60 s."""
    try:
        value = float(timeout)
    except (TypeError, ValueError):
        value = 10.0
    if value != value:
        value = 10.0
    return min(max(value, MIN_TIMEOUT), MAX_TIMEOUT)


def redirect_method(method: str, status: int) -> str | None:
    """The verb the next hop uses, or None when this redirect is the answer.

    A GET follows any redirect and stays a GET. A verb with a body follows
    only 307 and 308, which keep it; a 301, 302 or 303 would turn it into a
    bodyless GET, which the watch refuses, so the redirect is the answer.
    """
    if status not in REDIRECT_STATUSES:
        return None
    if method == "GET":
        return "GET"
    if status in (307, 308):
        return method
    return None


def _is_loopback(host: str | None) -> bool:
    if not host:
        return False
    host = host.lower().strip("[]")
    if host == "localhost" or host.endswith(".localhost"):
        return True
    try:
        ip = ipaddress.ip_address(host)
    except ValueError:
        return False
    return ip.is_loopback or ip.is_unspecified


async def _read_capped(response: Any, cap: int) -> bytes:
    chunks: list[bytes] = []
    total = 0
    while total < cap:
        chunk = await response.content.read(cap - total)
        if not chunk:
            break
        chunks.append(chunk)
        total += len(chunk)
    return b"".join(chunks)


def _joined_headers(raw: Any) -> dict[str, str]:
    """Response headers as one string per name, the casing of the first,
    the way URLSession hands them to the app."""
    joined: dict[str, str] = {}
    names: dict[str, str] = {}
    for name, value in raw.items():
        folded = name.lower()
        if folded in names:
            joined[names[folded]] = f"{joined[names[folded]]}, {value}"
        else:
            names[folded] = name
            joined[name] = value
    return joined


def _error_words(err: BaseException) -> str:
    if isinstance(err, (asyncio.TimeoutError, TimeoutError)):
        return TIMED_OUT
    if isinstance(err, aiohttp.ClientConnectorCertificateError) or isinstance(
        err, aiohttp.ClientSSLError
    ):
        return BAD_CERTIFICATE
    dns_error = getattr(aiohttp, "ClientConnectorDNSError", None)
    if dns_error is not None and isinstance(err, dns_error):
        return NO_HOST
    if isinstance(err, aiohttp.ClientConnectorError):
        return NO_CONNECTION
    return FAILED


async def async_send(
    built: BuiltRequest,
    *,
    allows_untrusted: bool,
    session_for: SessionFor,
) -> Answer:
    """Send a built request under the rules in the module docstring. Never
    raises for a network fault: the answer then carries the error."""
    try:
        async with asyncio.timeout(clamp_timeout(built.timeout)):
            return await _send_hops(built, allows_untrusted, session_for)
    except (TimeoutError, asyncio.TimeoutError) as err:
        return Answer(error=_error_words(err))
    except aiohttp.ClientError as err:
        return Answer(error=_error_words(err))
    except (ValueError, UnicodeError):
        # A header aiohttp will not write (a line break a global put there)
        # or a URL it cannot read.
        return Answer(error=FAILED)


def _origin(url: URL) -> tuple[str, str, int | None]:
    """Scheme, host and port, the port filled in when it is the default."""
    return (url.scheme.lower(), (url.host or "").lower(), url.port)


async def _send_hops(
    built: BuiltRequest, allows_untrusted: bool, session_for: SessionFor
) -> Answer:
    method = built.method
    url = URL(built.url, encoded=True)
    first_origin = _origin(url)
    headers = list(built.headers)
    body = built.body
    left_first_origin = False
    hops = 0
    while True:
        verify = not (allows_untrusted and _origin(url) == first_origin)
        session = session_for(verify)
        async with session.request(
            method,
            url,
            headers=headers,
            data=body,
            allow_redirects=False,
            skip_auto_headers=("Content-Type",),
        ) as response:
            status = response.status
            location = response.headers.get("Location")
            next_method = redirect_method(method, status) if location else None
            target: URL | None = None
            if next_method is not None:
                try:
                    target = url.join(URL(location))
                except (ValueError, TypeError):
                    target = None
                if (
                    target is None
                    or target.scheme not in ("http", "https")
                    or (url.scheme == "https" and target.scheme != "https")
                    or (_is_loopback(target.host) and not _is_loopback(url.host))
                ):
                    target = None
            if target is None:
                data = await _read_capped(response, MAX_REPLY_BYTES)
                return Answer(status=status, headers=_joined_headers(response.headers), body=data)
        hops += 1
        if hops > MAX_REDIRECTS:
            return Answer(error=TOO_MANY_REDIRECTS)
        if next_method != method:
            # A GET hop carries no body and no header that described one.
            body = None
            headers = [
                (n, v) for n, v in headers if n.lower() not in ("content-type", "content-length")
            ]
        if not left_first_origin and _origin(target) != first_origin:
            # Every header the action wrote may hold a secret meant for the
            # first origin only.
            left_first_origin = True
            headers = (
                [("Content-Type", built.auto_content_type)]
                if body is not None and built.auto_content_type is not None
                else []
            )
        method, url = next_method, target


class HTTPActionRunner:
    """Runs actions for devices and the panel, at most four per device."""

    def __init__(
        self,
        hass: HomeAssistant,
        session_for: SessionFor | None = None,
        spawn: Spawn | None = None,
    ) -> None:
        self._hass = hass
        self._session_for = session_for
        self._spawn = spawn or asyncio.create_subprocess_exec
        self._sessions: dict[bool, Any] = {}
        self._running: dict[str, int] = {}

    def _session(self, verify_ssl: bool) -> Any:
        if self._session_for is not None:
            return self._session_for(verify_ssl)
        session = self._sessions.get(verify_ssl)
        if session is None or session.closed:
            from homeassistant.helpers.aiohttp_client import async_create_clientsession

            # Made on a device's first run, not during setup, so Home
            # Assistant would let go of it only when it stops; a reload
            # would leave the old runner's sessions behind. This runner owns
            # them instead and detaches them on unload.
            session = async_create_clientsession(
                self._hass,
                verify_ssl=verify_ssl,
                auto_cleanup=False,
                cookie_jar=aiohttp.DummyCookieJar(),
            )
            self._sessions[verify_ssl] = session
        return session

    async def async_shutdown(self) -> None:
        """Let go of the sessions this runner made. Called on unload.

        ``detach`` is how a session from ``async_create_clientsession`` is
        given up: it shares Home Assistant's connector, which ``close``
        would report as closing Home Assistant's own session."""
        sessions, self._sessions = list(self._sessions.values()), {}
        for session in sessions:
            if not session.closed:
                session.detach()

    def running(self, device: str) -> int:
        return self._running.get(device, 0)

    @contextmanager
    def _slot(self, device: str):
        if self._running.get(device, 0) >= MAX_RUNS_PER_DEVICE:
            raise HTTPActionRefusal("busy", "this device already has 4 runs going")
        self._running[device] = self._running.get(device, 0) + 1
        try:
            yield
        finally:
            left = self._running.get(device, 1) - 1
            if left > 0:
                self._running[device] = left
            else:
                self._running.pop(device, None)

    async def _extract(self, config: Any, answer: Answer) -> str | None:
        if answer.status is None and answer.error is not None:
            return extract_reply(config, None, {}, b"")
        reply = read_reply_config(config)
        if reply is not None and reply["source"] == "regex":
            pattern = reply.get("pattern")
            if not answer.body or regex_is_plain(pattern):
                return await self._hass.async_add_executor_job(
                    extract_reply, config, answer.status, answer.headers, answer.body
                )
            captured = await self.async_regex_in_child(answer.body, pattern)
            return extract_reply(
                config,
                answer.status,
                answer.headers,
                answer.body,
                regex=lambda _body, _pattern: captured,
            )
        return extract_reply(config, answer.status, answer.headers, answer.body)

    async def async_regex_in_child(self, body: bytes, pattern: str) -> str | None:
        """``regex_capture`` in a child process of its own, killed after
        ``REGEX_CHILD_TIMEOUT``. None when it finds nothing, runs out of
        time or fails in any way. The pattern and the body go over stdin."""
        try:
            process = await self._spawn(
                sys.executable,
                "-I",
                "-c",
                REGEX_CHILD_SCRIPT,
                REGEX_CHILD_PATH,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.DEVNULL,
            )
        except (OSError, ValueError):
            _LOGGER.debug("The reply pattern could not be run in a child process")
            return None
        try:
            async with asyncio.timeout(REGEX_CHILD_TIMEOUT):
                out, _ = await process.communicate(regex_child_input(body, pattern))
        except TimeoutError:
            _LOGGER.debug("A reply pattern ran past %s s and was stopped", REGEX_CHILD_TIMEOUT)
            return None
        finally:
            if process.returncode is None:
                try:
                    process.kill()
                except ProcessLookupError:
                    pass
                await process.wait()
        if process.returncode != 0:
            return None
        return regex_child_output(out)

    async def _send(
        self,
        action: Action,
        globals_: list[tuple[str, str]],
        values: dict[str, str],
        audio: bytes | None,
    ) -> tuple[Answer, str | None, int]:
        started = time.monotonic()
        answer: Answer | None = None
        value: str | None = None
        try:
            # The send keeps its own timeout; this one also covers reading
            # the value, so the run's slot is always given back.
            async with asyncio.timeout(
                clamp_timeout(action.resolved_timeout) + REGEX_CHILD_TIMEOUT
            ):
                try:
                    built = build_action_request(action, globals_, values, audio)
                except RequestError as err:
                    answer = Answer(error=err.message)
                else:
                    answer = await async_send(
                        built,
                        allows_untrusted=action.allows_untrusted,
                        session_for=self._session,
                    )
                value = await self._extract(action.raw.get("responseConfig"), answer)
        except TimeoutError:
            if answer is None:
                answer = Answer(error=TIMED_OUT)
        elapsed = int((time.monotonic() - started) * 1000)
        _LOGGER.debug(
            "HTTP action %s answered %s in %d ms",
            action.label_name,
            answer.status if answer.status is not None else "nothing",
            elapsed,
        )
        return answer, value, elapsed

    async def async_run(
        self, document: Any, payload: dict[str, Any], *, device: str
    ) -> dict[str, Any]:
        """One run of a stored action for a device: the op's reply,
        ``{"ok": true, "status", "value", "snippet", "error"}``. Raises
        :class:`HTTPActionRefusal` when the run is not tried."""
        problem = run_input_problem(0, payload)
        if problem is not None:
            raise HTTPActionRefusal("invalid", problem)
        action = find_action(document, payload.get("id"))
        if action is None:
            raise HTTPActionRefusal("not_found", "no action has that id")
        if action.needs_setup:
            raise HTTPActionRefusal("needs_setup", "this action has no URL yet")
        values = _values(payload.get("values"))
        try:
            audio = decode_audio(payload.get("audio"))
        except HTTPActionsInvalid as err:
            raise HTTPActionRefusal("invalid", err.message) from err
        if audio is not None and len(audio) > MAX_AUDIO_BYTES:
            raise HTTPActionRefusal("invalid", f"the clip is over {MAX_AUDIO_BYTES} bytes")
        if action.needs_audio and not audio:
            raise HTTPActionRefusal("missing_audio", "this action sends a recording")
        with self._slot(device):
            answer, value, _elapsed = await self._send(
                action, library_globals(document), values, audio
            )
        return {
            "ok": True,
            "status": answer.status,
            "value": value,
            "snippet": snippet(answer.body),
            "error": answer.error,
        }

    async def async_test(
        self, action: Any, global_variables: Any, values: Any
    ) -> dict[str, Any]:
        """The panel's Test: a draft action, not saved, with the globals and
        values given. Answers ``{"status", "value", "snippet", "error",
        "headers", "paths", "elapsed_ms", "body", "body_size",
        "body_binary", "body_cut", "leaves", "leaves_cut"}``; ``paths`` are the JSON leaves of the
        body for the reply picker, and ``body`` is the whole text that was
        read, for the panel to format (empty when it is not text). Refuses a malformed draft, or values
        over a run's limits, ``invalid`` and a fifth run at once ``busy``."""
        problem = values_problem(values)
        if problem is not None:
            raise HTTPActionRefusal("invalid", problem)
        try:
            validate_action(action, "action")
            validate_globals(global_variables if global_variables is not None else [])
        except HTTPActionsInvalid as err:
            raise HTTPActionRefusal("invalid", err.message) from err
        with self._slot(PANEL_DEVICE):
            answer, value, elapsed = await self._send(
                Action.read(action), global_pairs(global_variables), _values(values), None
            )
        return {
            "status": answer.status,
            "value": value,
            "snippet": snippet(answer.body),
            "error": answer.error,
            "headers": dict(answer.headers),
            "paths": discover_paths(answer.body),
            "elapsed_ms": elapsed,
            **_body_text(answer.body),
            **_leaves(answer.body),
        }


def _leaves(body: bytes | None) -> dict[str, Any]:
    """Every JSON leaf of the answer with the value a JSON path to it reads,
    so the panel can show a path's value as it is typed or picked without
    sending again. ``leaves_cut`` says the list stopped at its limit."""
    leaves = discover_paths(bytes(body or b""), LEAVES_LIMIT, every_item=True)
    return {"leaves": leaves, "leaves_cut": len(leaves) >= LEAVES_LIMIT}


def _body_text(body: bytes | None) -> dict[str, Any]:
    """The answer's body for the panel's Test: its text, its size in bytes,
    whether it is not text (then no text is sent), and whether the read
    stopped at the size limit."""
    raw = bytes(body or b"")
    cut = len(raw) >= MAX_REPLY_BYTES
    text = raw.decode("utf-8", errors="replace")
    if cut:
        # The limit may have split the last character.
        text = text.rstrip("\ufffd")
    binary = "\x00" in text or "\ufffd" in text
    return {
        "body": "" if binary else text,
        "body_size": len(raw),
        "body_binary": binary,
        "body_cut": cut,
    }


def _values(raw: Any) -> dict[str, str]:
    """The run's values: string to string; anything else is not a value."""
    if not isinstance(raw, dict):
        return {}
    return {k: v for k, v in raw.items() if isinstance(k, str) and isinstance(v, str)}
