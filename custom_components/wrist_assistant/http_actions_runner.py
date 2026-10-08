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
* An action with ``presentsClientCertificate`` presents the client
  certificate Home Assistant keeps for the Home Assistant user behind the
  run (``client_certificate_store.py``): the user a device is bound to, or
  the signed-in user for the panel's Test. With no bound user, or no
  certificate for that user, the run is refused
  ``client_certificate_missing``; a stored ``.p12`` that does not load is
  refused ``client_certificate_unreadable``. As on the watch, the
  certificate is offered only to the action's own origin, never after a
  redirect leaves it. The ``.p12`` is opened in the executor and its key and
  chain go to Python's ``ssl`` through files in a private temporary folder
  (the key encrypted with a one-time password), removed as soon as the
  context has read them. One session per certificate fingerprint and
  certificate check is kept, and a user's sessions are dropped when that
  user's record changes.
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

The network is behind ``session_for(verify_ssl, certificate)``, which tests
replace. ``certificate`` is the ``ClientCertificate`` a hop presents, or
None; a replaced network gets it as it is and no context is built.
"""

from __future__ import annotations

import asyncio
import ipaddress
import logging
import os
import secrets
import shutil
import ssl
import sys
import tempfile
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

    from .client_certificate_store import ClientCertificate, ClientCertificateStore

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

# Why an action that presents a client certificate was not sent. The watch
# and the panel show the message of a code they do not know as it is.
NO_BOUND_USER = (
    "This action presents a client certificate, and this device is not bound "
    "to a Home Assistant user. Pair it again to run this action."
)
NO_CLIENT_CERTIFICATE = (
    "This action presents a client certificate, and Home Assistant holds none "
    "for this user. Import one in the panel's Client certificate card."
)
UNREADABLE_CLIENT_CERTIFICATE = (
    "This action presents a client certificate, and the one Home Assistant "
    "holds for this user does not load. Import it again in the panel's Client "
    "certificate card."
)

SessionFor = Callable[[bool, Any], Any]
# ``asyncio.create_subprocess_exec``, which tests replace.
Spawn = Callable[..., Awaitable[Any]]


class HTTPActionRefusal(Exception):
    """A run that was not tried. ``code`` is what the op answers:
    ``not_found``, ``needs_setup``, ``missing_audio``, ``busy``,
    ``invalid``, ``unavailable``, ``client_certificate_missing`` or
    ``client_certificate_unreadable``; ``status`` its HTTP status."""

    _STATUS = {
        "not_found": 404,
        "needs_setup": 409,
        "client_certificate_missing": 409,
        "client_certificate_unreadable": 409,
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


class ClientCertificateUnusable(Exception):
    """A stored ``.p12`` that does not open, or holds no key or no
    certificate."""


def _open_pkcs12(pkcs12_bytes: bytes, passphrase: str) -> tuple[Any, Any, list[Any]]:
    """The key, the certificate and the rest of the chain of a ``.p12``.
    An empty password is tried as none and as the empty one, as
    ``client_certificate_store.check_opens`` does."""
    from cryptography.exceptions import UnsupportedAlgorithm
    from cryptography.hazmat.primitives.serialization import pkcs12

    passwords: tuple[bytes | None, ...] = (
        (passphrase.encode("utf-8"),) if passphrase else (None, b"")
    )
    for password in passwords:
        try:
            key, cert, chain = pkcs12.load_key_and_certificates(pkcs12_bytes, password)
        except (ValueError, TypeError, UnsupportedAlgorithm):
            continue
        if key is None or cert is None:
            break
        return key, cert, list(chain or [])
    raise ClientCertificateUnusable("the .p12 does not open or holds no key")


def _write_private(path: str, data: bytes) -> None:
    # O_EXCL: the folder is new and ours, so a file already there is not.
    fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, "wb") as file:
        file.write(data)


def _base_context(verify_ssl: bool) -> ssl.SSLContext:
    """A fresh client context that checks the server the way Home
    Assistant's own sessions do (certifi's roots), or not at all. Fresh,
    never Home Assistant's shared one, since a certificate is loaded into
    it."""
    if not verify_ssl:
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        return context
    try:
        import certifi

        cafile: str | None = certifi.where()
    except ImportError:
        cafile = None
    return ssl.create_default_context(ssl.Purpose.SERVER_AUTH, cafile=cafile)


def client_ssl_context(certificate: ClientCertificate, verify_ssl: bool) -> ssl.SSLContext:
    """A client context that presents the certificate, checking the server
    or not as ``verify_ssl`` says. Blocking: run it in the executor.

    ``load_cert_chain`` reads only files, so the chain and the key are
    written to a folder of their own (0700, each file 0600) and the folder
    is removed as soon as the context has read them; the context keeps
    what it needs in memory. The key is written encrypted with a password
    made for this one load, so it never sits on disk in the clear. Raises
    :class:`ClientCertificateUnusable`, ``ssl.SSLError`` or ``OSError``."""
    from cryptography.hazmat.primitives import serialization

    key, cert, chain = _open_pkcs12(certificate.pkcs12, certificate.passphrase)
    one_time = secrets.token_hex(32).encode("ascii")
    key_pem = key.private_bytes(
        serialization.Encoding.PEM,
        serialization.PrivateFormat.PKCS8,
        serialization.BestAvailableEncryption(one_time),
    )
    chain_pem = b"".join(
        item.public_bytes(serialization.Encoding.PEM) for item in (cert, *chain)
    )
    context = _base_context(verify_ssl)
    folder = tempfile.mkdtemp(prefix="wa-client-cert-")
    try:
        os.chmod(folder, 0o700)
        chain_path = os.path.join(folder, "chain.pem")
        key_path = os.path.join(folder, "key.pem")
        _write_private(chain_path, chain_pem)
        _write_private(key_path, key_pem)
        context.load_cert_chain(chain_path, key_path, password=one_time)
    finally:
        shutil.rmtree(folder, ignore_errors=True)
    return context


class _CertificateSession:
    """A session that presents one certificate: the users whose record it
    was made for, how many runs hold it, and whether a change of one of
    those records retired it (it is closed once no run holds it)."""

    def __init__(self, session: Any, user_id: str) -> None:
        self.session = session
        self.users = {user_id}
        self.holds = 0
        self.retired = False


async def async_send(
    built: BuiltRequest,
    *,
    allows_untrusted: bool,
    session_for: SessionFor,
    certificate: ClientCertificate | None = None,
) -> Answer:
    """Send a built request under the rules in the module docstring. Never
    raises for a network fault: the answer then carries the error.
    ``certificate`` is presented to the first origin only."""
    try:
        async with asyncio.timeout(clamp_timeout(built.timeout)):
            return await _send_hops(built, allows_untrusted, session_for, certificate)
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
    built: BuiltRequest,
    allows_untrusted: bool,
    session_for: SessionFor,
    certificate: ClientCertificate | None,
) -> Answer:
    method = built.method
    url = URL(built.url, encoded=True)
    first_origin = _origin(url)
    headers = list(built.headers)
    body = built.body
    left_first_origin = False
    hops = 0
    while True:
        home = _origin(url) == first_origin
        verify = not (allows_untrusted and home)
        # The watch offered its certificate to the action's own host only;
        # another origin a redirect leads to never sees it.
        session = session_for(verify, certificate if home else None)
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
        self._certificates: ClientCertificateStore | None = None
        # Keyed on the .p12's fingerprint and the server check, not on the
        # user: the same bytes open the same way for anyone, so a session
        # is never wrong for a fingerprint, and dropping one on a change is
        # only about letting go of a key no longer held.
        self._certificate_sessions: dict[tuple[str, bool], _CertificateSession] = {}

    def attach_client_certificate_store(
        self, store: ClientCertificateStore
    ) -> Callable[[], None]:
        """Read client certificates from ``store`` and drop a user's sessions
        when that user's record changes. Returns the unsubscribe."""
        self._certificates = store
        return store.async_add_listener(self.client_certificate_changed)

    def client_certificate_changed(self, user_id: str) -> None:
        """A user's record changed: the sessions made for it are let go.
        A run still holding one finishes on it, and it closes after."""
        for key, entry in list(self._certificate_sessions.items()):
            if user_id in entry.users:
                del self._certificate_sessions[key]
                entry.retired = True
                if entry.holds == 0 and not entry.session.closed:
                    self._hass.async_create_task(entry.session.close())

    def _certificate_for(self, action: Action, user_id: str | None) -> ClientCertificate | None:
        """The certificate the action presents, or None when it presents
        none. Refuses when it should and Home Assistant holds none."""
        if not action.presents_client_certificate:
            return None
        if not user_id:
            raise HTTPActionRefusal("client_certificate_missing", NO_BOUND_USER)
        store = self._certificates
        if store is None or not store.available:
            raise HTTPActionRefusal(
                "unavailable", "the stored client certificates could not be read"
            )
        record = store.get(user_id)
        if record is None or record.certificate is None:
            raise HTTPActionRefusal("client_certificate_missing", NO_CLIENT_CERTIFICATE)
        return record.certificate

    async def _async_hold_certificate_session(
        self, certificate: ClientCertificate, user_id: str, verify_ssl: bool
    ) -> _CertificateSession:
        key = (certificate.fingerprint, verify_ssl)
        entry = self._certificate_sessions.get(key)
        if entry is None or entry.session.closed:
            try:
                context = await self._hass.async_add_executor_job(
                    client_ssl_context, certificate, verify_ssl
                )
            except (ClientCertificateUnusable, OSError, ValueError, TypeError) as err:
                # The kind of fault only: the message may quote the file.
                _LOGGER.warning(
                    "The client certificate of user %s does not load (%s)",
                    user_id,
                    type(err).__name__,
                )
                raise HTTPActionRefusal(
                    "client_certificate_unreadable", UNREADABLE_CLIENT_CERTIFICATE
                ) from err
            # Another run may have made one while this context was built.
            entry = self._certificate_sessions.get(key)
            if entry is None or entry.session.closed:
                entry = _CertificateSession(self._new_certificate_session(context), user_id)
                self._certificate_sessions[key] = entry
        entry.users.add(user_id)
        entry.holds += 1
        return entry

    async def _async_release(self, entry: _CertificateSession) -> None:
        entry.holds -= 1
        if entry.retired and entry.holds == 0 and not entry.session.closed:
            await entry.session.close()

    def _new_certificate_session(self, context: ssl.SSLContext) -> Any:
        """A session of its own with a connector that presents the
        certificate. Not ``async_create_clientsession``: that one always
        uses Home Assistant's shared connector, which presents nothing.
        Same cookie rule, and Home Assistant's User-Agent when it has one,
        so an action reads the same to its server either way."""
        try:
            from homeassistant.helpers import aiohttp_client

            user_agent = getattr(aiohttp_client, "SERVER_SOFTWARE", None)
        except ImportError:
            user_agent = None
        return aiohttp.ClientSession(
            connector=aiohttp.TCPConnector(ssl=context),
            cookie_jar=aiohttp.DummyCookieJar(),
            headers={"User-Agent": user_agent} if isinstance(user_agent, str) else None,
        )

    def _session(self, verify_ssl: bool) -> Any:
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
        would report as closing Home Assistant's own session. A session that
        presents a certificate has a connector of its own and is closed."""
        sessions, self._sessions = list(self._sessions.values()), {}
        for session in sessions:
            if not session.closed:
                session.detach()
        entries = list(self._certificate_sessions.values())
        self._certificate_sessions = {}
        for entry in entries:
            entry.retired = True
            if not entry.session.closed:
                await entry.session.close()

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
        certificate: ClientCertificate | None = None,
        user_id: str | None = None,
    ) -> tuple[Answer, str | None, int]:
        started = time.monotonic()
        answer: Answer | None = None
        value: str | None = None
        held: _CertificateSession | None = None
        if certificate is not None and user_id and self._session_for is None:
            # Outside the run's timeout: an executor job cannot be stopped,
            # and a refusal here is a run not tried. A certificate goes to
            # the first origin only, where the check is the action's own.
            held = await self._async_hold_certificate_session(
                certificate, user_id, not action.allows_untrusted
            )

        def session_for(verify_ssl: bool, presented: ClientCertificate | None) -> Any:
            if self._session_for is not None:
                return self._session_for(verify_ssl, presented)
            if presented is not None and held is not None:
                return held.session
            return self._session(verify_ssl)

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
                        session_for=session_for,
                        certificate=certificate,
                    )
                value = await self._extract(action.raw.get("responseConfig"), answer)
        except TimeoutError:
            if answer is None:
                answer = Answer(error=TIMED_OUT)
        finally:
            if held is not None:
                await self._async_release(held)
        elapsed = int((time.monotonic() - started) * 1000)
        _LOGGER.debug(
            "HTTP action %s answered %s in %d ms",
            action.label_name,
            answer.status if answer.status is not None else "nothing",
            elapsed,
        )
        return answer, value, elapsed

    async def async_run(
        self,
        document: Any,
        payload: dict[str, Any],
        *,
        device: str,
        user_id: str | None = None,
    ) -> dict[str, Any]:
        """One run of a stored action for a device: the op's reply,
        ``{"ok": true, "status", "value", "snippet", "error"}``. Raises
        :class:`HTTPActionRefusal` when the run is not tried. ``user_id`` is
        the Home Assistant user the device is bound to, whose client
        certificate an action that presents one sends."""
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
        certificate = self._certificate_for(action, user_id)
        with self._slot(device):
            answer, value, _elapsed = await self._send(
                action, library_globals(document), values, audio, certificate, user_id
            )
        return {
            "ok": True,
            "status": answer.status,
            "value": value,
            "snippet": snippet(answer.body),
            "error": answer.error,
        }

    async def async_test(
        self,
        action: Any,
        global_variables: Any,
        values: Any,
        *,
        user_id: str | None = None,
    ) -> dict[str, Any]:
        """The panel's Test: a draft action, not saved, with the globals and
        values given. Answers ``{"status", "value", "snippet", "error",
        "headers", "paths", "elapsed_ms", "body", "body_size",
        "body_binary", "body_cut", "leaves", "leaves_cut"}``; ``paths`` are the JSON leaves of the
        body for the reply picker, and ``body`` is the whole text that was
        read, for the panel to format (empty when it is not text). Refuses a malformed draft, or values
        over a run's limits, ``invalid`` and a fifth run at once ``busy``.
        A draft that presents a client certificate sends the signed-in
        user's own (``user_id``), and is refused as a device's run is when
        that user has none."""
        problem = values_problem(values)
        if problem is not None:
            raise HTTPActionRefusal("invalid", problem)
        try:
            validate_action(action, "action")
            validate_globals(global_variables if global_variables is not None else [])
        except HTTPActionsInvalid as err:
            raise HTTPActionRefusal("invalid", err.message) from err
        draft = Action.read(action)
        certificate = self._certificate_for(draft, user_id)
        with self._slot(PANEL_DEVICE):
            answer, value, elapsed = await self._send(
                draft, global_pairs(global_variables), _values(values), None, certificate, user_id
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
