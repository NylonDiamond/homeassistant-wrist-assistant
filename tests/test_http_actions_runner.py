"""Tests for ``http_actions_runner.py``, the sender, with a fake session.

The runner reaches the network only through ``session_for(verify_ssl)``,
so each test hands it a scripted session that answers by URL and records
every request. Covered: a run's reply shape, the refusals (not found, needs
setup, missing or malformed audio, busy), the timeout and its clamp, every
row of the redirect rule (GET follows, a body verb follows only 307 and 308,
at most 5 hops, a redirect off the first origin drops every header the
action wrote and checks the certificate again, none from https to http,
none to loopback), the 256 KB read cap, a plain regex in
the executor and any other in a child process with a hard limit, the URL
sent as built, the panel's Test, and an action that presents the user's
client certificate (the refusals, the certificate reaching the seam on the
first origin only, a real context that presents it in a TLS handshake, the
private files it is loaded through, and the session cache). Every ``.p12``
is made here with ``cryptography``.
"""

from __future__ import annotations

import asyncio
import base64
import os
import ssl
import stat
import sys
import types
from datetime import UTC, datetime, timedelta
from typing import Any

import pytest
# Imported here, before the package fixture notes sys.modules: a module it
# sees arrive is dropped after the test, and a second import of
# cryptography's classes would not match the first.
from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.serialization import pkcs12
from cryptography.x509.oid import NameOID
from multidict import CIMultiDict

from test_http_actions import ID_A, ID_B, action, header, library, variable
from test_http_actions_store import loaded_package


class FakeContent:
    def __init__(self, body: bytes) -> None:
        self._body = body
        self.reads: list[int] = []

    async def read(self, n: int = -1) -> bytes:
        self.reads.append(n)
        # Hand out at most 1000 bytes at a time, as a socket would.
        size = min(n, 1000) if n >= 0 else len(self._body)
        chunk, self._body = self._body[:size], self._body[size:]
        return chunk


class FakeResponse:
    def __init__(self, status: int = 200, body: bytes = b"", headers: dict | list | None = None) -> None:
        self.status = status
        self.headers = CIMultiDict(headers or {})
        self.content = FakeContent(body)

    async def __aenter__(self):
        return self

    async def __aexit__(self, *exc: object) -> None:
        return None


class FakeSession:
    """Answers each URL from a script: a response, a list used in turn, an
    exception to raise, or a coroutine function to await (for timeouts)."""

    def __init__(self, script: dict[str, Any]) -> None:
        self.script = script
        self.calls: list[dict[str, Any]] = []
        self.closed = False

    def for_verify(self, verify: bool, certificate: Any = None) -> FakeSession:
        self.verify = verify
        self.certificate = certificate
        return self

    def request(self, method, url, *, headers, data, allow_redirects, skip_auto_headers):
        assert allow_redirects is False
        assert url.is_absolute()
        self.calls.append(
            {"method": method, "url": str(url), "headers": list(headers), "data": data,
             "verify": self.verify, "certificate": self.certificate}
        )
        answer = self.script.get(str(url), FakeResponse(404))
        if isinstance(answer, list):
            answer = answer.pop(0)
        if isinstance(answer, BaseException):
            raise answer
        if callable(answer):
            return _Awaiting(answer)
        return answer


class _Awaiting:
    def __init__(self, fn) -> None:
        self.fn = fn

    async def __aenter__(self):
        return await self.fn()

    async def __aexit__(self, *exc: object) -> None:
        return None


class FakeHass:
    def __init__(self) -> None:
        self.executor_calls: list[Any] = []
        self.tasks: list[asyncio.Task] = []

    async def async_add_executor_job(self, fn, *args):
        self.executor_calls.append(fn.__name__)
        return await asyncio.get_running_loop().run_in_executor(None, fn, *args)

    def async_create_task(self, coro):
        task = asyncio.get_running_loop().create_task(coro)
        self.tasks.append(task)
        return task


@pytest.fixture
def env():
    with loaded_package() as loaded:
        runner_mod = loaded.load("http_actions_runner")
        certs_mod = loaded.load("client_certificate_store")
        yield types.SimpleNamespace(mod=runner_mod, certs=certs_mod)


def make_runner(env, script: dict[str, Any]):
    session = FakeSession(script)
    hass = FakeHass()
    runner = env.mod.HTTPActionRunner(hass, session_for=session.for_verify)
    return runner, session, hass


def run(env, runner, doc, payload, device="watch-A"):
    return asyncio.run(runner.async_run(doc, payload, device=device))


URL_A = "https://example.com/hook"


# ── a run ────────────────────────────────────────────────────────────────


def test_a_run_answers_status_value_and_snippet(env) -> None:
    doc = library(
        action(
            url="{{base}}/hook?room={{room}}",
            headers=[header("Authorization", "Bearer {{token}}")],
            bodyContentType="json",
            body='{"m":"{{room}}"}',
            variables=[variable("room")],
            responseConfig={"source": "jsonField", "jsonPath": "temp", "unit": "°"},
        ),
        globals_=[{"id": "G", "key": "base", "value": "https://example.com"},
                  {"id": "T", "key": "token", "value": "s3cret"}],
    )
    runner, session, _ = make_runner(
        env, {"https://example.com/hook?room=living%20room": FakeResponse(200, b'{"temp": 21.5}\n')}
    )
    reply = run(env, runner, doc, {"id": ID_A, "values": {"room": "living room"}})
    assert reply == {"ok": True, "status": 200, "value": "21.5°", "snippet": '{"temp": 21.5}', "error": None}
    [call] = session.calls
    assert call["method"] == "POST"
    assert call["headers"] == [("Authorization", "Bearer s3cret"), ("Content-Type", "application/json")]
    assert call["data"] == b'{"m":"living room"}'
    assert call["verify"] is True
    assert runner.running("watch-A") == 0


def test_a_failed_status_still_reads_its_value(env) -> None:
    doc = library(action(responseConfig={"source": "statusCode"}))
    runner, _, _ = make_runner(env, {URL_A: FakeResponse(500, b"oops")})
    assert run(env, runner, doc, {"id": ID_A}) == {
        "ok": True, "status": 500, "value": "500", "snippet": "oops", "error": None,
    }


def test_the_url_goes_out_exactly_as_built(env) -> None:
    doc = library(action(method="GET", url="http://h.example/a%2Fb?x=50%&y=%7e"))
    runner, session, _ = make_runner(env, {})
    run(env, runner, doc, {"id": ID_A})
    assert session.calls[0]["url"] == "http://h.example/a%2Fb?x=50%25&y=%7e"


@pytest.mark.parametrize(
    ("url", "words"),
    [("{{nope}}/x", "The URL is not valid."), ("ftp://x.example", "The URL is not valid.")],
)
def test_a_url_that_cannot_be_built_is_an_answer_with_no_status(env, url, words) -> None:
    runner, session, _ = make_runner(env, {})
    reply = run(env, runner, library(action(url=url)), {"id": ID_A})
    assert reply == {"ok": True, "status": None, "value": None, "snippet": "", "error": words}
    assert session.calls == []


@pytest.mark.parametrize(
    ("raised", "words"),
    [
        (lambda m: m.aiohttp.ClientConnectorError(types.SimpleNamespace(ssl=None, host="h", port=1), OSError(61, "refused")), "Could not connect to the server."),
        (lambda m: m.aiohttp.ClientError("boom"), "The request failed."),
        (lambda m: ValueError("header with a line break"), "The request failed."),
    ],
)
def test_a_network_fault_is_an_answer_with_no_status(env, raised, words) -> None:
    runner, _, _ = make_runner(env, {URL_A: raised(env.mod)})
    reply = run(env, runner, library(action()), {"id": ID_A})
    assert reply["status"] is None and reply["error"] == words


# ── refusals ─────────────────────────────────────────────────────────────


@pytest.mark.parametrize(
    ("doc", "payload", "code", "status"),
    [
        (None, {"id": ID_A}, "not_found", 404),
        (library(action()), {"id": ID_B}, "not_found", 404),
        (library(action()), {}, "not_found", 404),
        (library(action(url="  ")), {"id": ID_A}, "needs_setup", 409),
        (library(action(bodyContentType="audio")), {"id": ID_A}, "missing_audio", 400),
        (library(action(bodyContentType="audio")), {"id": ID_A, "audio": ""}, "missing_audio", 400),
        (library(action(bodyContentType="audio")), {"id": ID_A, "audio": "%%%"}, "invalid", 400),
        (library(action()), {"id": ID_A, "audio": base64.b64encode(b"x" * (512 * 1024 + 1)).decode()}, "invalid", 400),
    ],
)
def test_refusals(env, doc, payload, code, status) -> None:
    runner, session, _ = make_runner(env, {})
    with pytest.raises(env.mod.HTTPActionRefusal) as caught:
        run(env, runner, doc, payload)
    assert (caught.value.code, caught.value.status) == (code, status)
    assert session.calls == []


def test_a_voice_run_sends_the_clip(env) -> None:
    runner, session, _ = make_runner(env, {URL_A: FakeResponse(201)})
    clip = b"\x00\x01aac"
    reply = run(env, runner, library(action(bodyContentType="audio")),
                {"id": ID_A, "audio": base64.b64encode(clip).decode()})
    assert reply["status"] == 201
    assert session.calls[0]["data"] == clip
    assert session.calls[0]["headers"] == [("Content-Type", "audio/mp4")]


def test_a_fifth_run_at_once_is_busy_and_other_devices_are_not(env) -> None:
    gate = asyncio.Event()

    async def slow():
        await gate.wait()
        return FakeResponse(200)

    runner, _, _ = make_runner(env, {URL_A: [slow, slow, slow, slow, FakeResponse(200), FakeResponse(200)]})
    doc = library(action())

    async def scenario():
        held = [asyncio.create_task(runner.async_run(doc, {"id": ID_A}, device="w")) for _ in range(4)]
        await asyncio.sleep(0.01)
        assert runner.running("w") == 4
        with pytest.raises(env.mod.HTTPActionRefusal) as caught:
            await runner.async_run(doc, {"id": ID_A}, device="w")
        assert caught.value.code == "busy" and caught.value.status == 429
        other = await runner.async_run(doc, {"id": ID_A}, device="other")
        assert other["status"] == 200
        gate.set()
        await asyncio.gather(*held)
        assert runner.running("w") == 0
        assert (await runner.async_run(doc, {"id": ID_A}, device="w"))["status"] == 200

    asyncio.run(scenario())


# ── timeout ──────────────────────────────────────────────────────────────


@pytest.mark.parametrize(
    ("given", "held"),
    [(None, 10.0), (0.25, 1.0), (2.5, 2.5), (120, 60.0), ("x", 10.0), (float("nan"), 10.0)],
)
def test_the_timeout_is_held_between_1_and_60_seconds(env, given, held) -> None:
    assert env.mod.clamp_timeout(given if given is not None else 10) == held


def test_a_slow_server_times_out(env) -> None:
    async def never():
        await asyncio.sleep(5)

    runner, _, _ = make_runner(env, {URL_A: never})
    doc = library(action(timeout=0.01))
    started = asyncio.new_event_loop()
    try:
        reply = started.run_until_complete(runner.async_run(doc, {"id": ID_A}, device="w"))
    finally:
        started.close()
    assert reply == {"ok": True, "status": None, "value": None, "snippet": "",
                     "error": "The request timed out."}


# ── redirects ────────────────────────────────────────────────────────────


def _redirect(status: int, location: str) -> FakeResponse:
    return FakeResponse(status, b"moved", {"Location": location})


@pytest.mark.parametrize("status", [301, 302, 303, 307, 308])
def test_a_get_follows_any_redirect(env, status) -> None:
    runner, session, _ = make_runner(
        env, {"http://h.example/a": _redirect(status, "/b"), "http://h.example/b": FakeResponse(200, b"done")}
    )
    reply = run(env, runner, library(action(method="GET", url="http://h.example/a")), {"id": ID_A})
    assert (reply["status"], reply["snippet"]) == (200, "done")
    assert [(c["method"], c["url"]) for c in session.calls] == [
        ("GET", "http://h.example/a"), ("GET", "http://h.example/b")]


@pytest.mark.parametrize("status", [307, 308])
def test_a_body_verb_follows_307_and_308_with_its_body(env, status) -> None:
    runner, session, _ = make_runner(
        env, {URL_A: _redirect(status, "https://example.com/new"), "https://example.com/new": FakeResponse(200)}
    )
    doc = library(action(method="PUT", bodyContentType="text", body="hello"))
    assert run(env, runner, doc, {"id": ID_A})["status"] == 200
    assert [(c["method"], c["data"]) for c in session.calls] == [("PUT", b"hello"), ("PUT", b"hello")]


@pytest.mark.parametrize("status", [301, 302, 303])
def test_a_body_verb_answers_with_any_other_redirect(env, status) -> None:
    runner, session, _ = make_runner(env, {URL_A: _redirect(status, "/login")})
    reply = run(env, runner, library(action(bodyContentType="json", body="{}")), {"id": ID_A})
    assert (reply["status"], reply["snippet"]) == (status, "moved")
    assert len(session.calls) == 1


def test_a_redirect_with_no_location_is_the_answer(env) -> None:
    runner, session, _ = make_runner(env, {URL_A: FakeResponse(302, b"")})
    assert run(env, runner, library(action(method="GET")), {"id": ID_A})["status"] == 302


def test_at_most_five_hops(env) -> None:
    script = {f"http://h.example/{i}": _redirect(302, f"/{i + 1}") for i in range(10)}
    runner, session, _ = make_runner(env, script)
    reply = run(env, runner, library(action(method="GET", url="http://h.example/0")), {"id": ID_A})
    assert reply["status"] is None and reply["error"] == "too many HTTP redirects"
    assert len(session.calls) == 6


def test_leaving_the_origin_drops_every_header_and_checks_the_certificate(env) -> None:
    runner, session, _ = make_runner(
        env,
        {
            "https://self.example/a": _redirect(302, "/b"),
            "https://self.example/b": _redirect(302, "https://other.example/c"),
            "https://other.example/c": _redirect(302, "https://self.example/d"),
            "https://self.example/d": FakeResponse(200),
        },
    )
    doc = library(action(method="GET", url="https://self.example/a",
                         headers=[header("Authorization", "Bearer x"), header("X-Api-Key", "k")],
                         allowsUntrustedCertificate=True))
    run(env, runner, doc, {"id": ID_A})
    assert [(c["verify"], [h[0] for h in c["headers"]]) for c in session.calls] == [
        (False, ["Authorization", "X-Api-Key"]),
        (False, ["Authorization", "X-Api-Key"]),
        (True, []),
        # Back on the first origin, the headers stay dropped.
        (False, []),
    ]


def test_another_port_is_another_origin(env) -> None:
    runner, session, _ = make_runner(
        env,
        {
            "https://self.example/a": _redirect(302, "https://self.example:8443/b"),
            "https://self.example:8443/b": FakeResponse(200),
        },
    )
    doc = library(action(method="GET", url="https://self.example/a",
                         headers=[header("X-Api-Key", "k")], allowsUntrustedCertificate=True))
    run(env, runner, doc, {"id": ID_A})
    assert [(c["verify"], c["headers"]) for c in session.calls] == [
        (False, [("X-Api-Key", "k")]),
        (True, []),
    ]


def test_a_default_port_written_out_is_the_same_origin(env) -> None:
    runner, session, _ = make_runner(
        env,
        {
            "https://self.example/a": _redirect(302, "https://SELF.example:443/b"),
            "https://self.example/b": FakeResponse(200),
        },
    )
    doc = library(action(method="GET", url="https://self.example/a",
                         headers=[header("X-Api-Key", "k")], allowsUntrustedCertificate=True))
    assert run(env, runner, doc, {"id": ID_A})["status"] == 200
    assert [(c["verify"], c["headers"]) for c in session.calls] == [
        (False, [("X-Api-Key", "k")]),
        (False, [("X-Api-Key", "k")]),
    ]


@pytest.mark.parametrize("status", [301, 302, 307, 308])
def test_https_to_http_is_never_followed(env, status) -> None:
    runner, session, _ = make_runner(
        env, {URL_A: _redirect(status, "http://example.com/hook"), "http://example.com/hook": FakeResponse(200)}
    )
    reply = run(env, runner, library(action(method="GET", headers=[header("X-Api-Key", "k")])), {"id": ID_A})
    assert (reply["status"], reply["snippet"]) == (status, "moved")
    assert len(session.calls) == 1


def test_a_kept_body_crosses_origins_with_only_the_automatic_content_type(env) -> None:
    runner, session, _ = make_runner(
        env, {URL_A: _redirect(307, "https://other.example/new"), "https://other.example/new": FakeResponse(200)}
    )
    doc = library(action(method="POST", bodyContentType="json", body='{"a":1}',
                         headers=[header("Authorization", "Bearer x")]))
    assert run(env, runner, doc, {"id": ID_A})["status"] == 200
    assert [(c["headers"], c["data"]) for c in session.calls] == [
        ([("Authorization", "Bearer x"), ("Content-Type", "application/json")], b'{"a":1}'),
        ([("Content-Type", "application/json")], b'{"a":1}'),
    ]


def test_a_user_content_type_does_not_cross_origins(env) -> None:
    runner, session, _ = make_runner(
        env, {URL_A: _redirect(308, "https://other.example/new"), "https://other.example/new": FakeResponse(200)}
    )
    doc = library(action(method="PUT", bodyContentType="text", body="hi",
                         headers=[header("content-type", "text/x-secret; key=1")]))
    run(env, runner, doc, {"id": ID_A})
    assert session.calls[1]["headers"] == [] and session.calls[1]["data"] == b"hi"


def test_a_redirect_to_loopback_from_elsewhere_is_the_answer(env) -> None:
    runner, session, _ = make_runner(env, {URL_A: _redirect(302, "http://127.0.0.1:8123/api")})
    assert run(env, runner, library(action(method="GET")), {"id": ID_A})["status"] == 302
    assert len(session.calls) == 1


def test_a_redirect_to_another_scheme_is_the_answer(env) -> None:
    runner, session, _ = make_runner(env, {URL_A: _redirect(302, "ftp://example.com/x")})
    assert run(env, runner, library(action(method="GET")), {"id": ID_A})["status"] == 302


@pytest.mark.parametrize(("method", "follows"), [("GET", True), ("POST", False), ("DELETE", False)])
def test_redirect_method(env, method, follows) -> None:
    assert (env.mod.redirect_method(method, 303) is not None) is follows
    assert env.mod.redirect_method(method, 308) == method
    assert env.mod.redirect_method(method, 200) is None


# ── the answer ───────────────────────────────────────────────────────────


def test_at_most_256_kb_of_an_answer_is_read(env) -> None:
    big = FakeResponse(200, b"x" * (300 * 1024))
    runner, _, _ = make_runner(env, {URL_A: big})
    reply = run(env, runner, library(action(responseConfig={"source": "regex", "pattern": "x+"})), {"id": ID_A})
    assert reply["value"] == "x" * (256 * 1024)
    assert sum(len(b"x") * min(n, 1000) for n in big.content.reads) >= 256 * 1024
    assert all(n <= 256 * 1024 for n in big.content.reads)


def test_a_regex_runs_in_the_executor_and_nothing_else_does(env) -> None:
    runner, _, hass = make_runner(env, {URL_A: [FakeResponse(200, b"t=1"), FakeResponse(200, b'{"a":1}')]})
    run(env, runner, library(action(responseConfig={"source": "regex", "pattern": "t=(\\d)"})), {"id": ID_A})
    run(env, runner, library(action(responseConfig={"source": "jsonField", "jsonPath": "a"})), {"id": ID_A})
    assert hass.executor_calls == ["extract_reply"]


class CountingSpawn:
    """``asyncio.create_subprocess_exec`` that counts its calls and checks
    that nothing from the pattern or the body is on the command line."""

    def __init__(self) -> None:
        self.calls: list[tuple] = []

    async def __call__(self, *args, **kwargs):
        self.calls.append(args)
        return await asyncio.create_subprocess_exec(*args, **kwargs)


def test_a_backtracking_pattern_is_stopped_and_the_loop_keeps_running(env) -> None:
    spawn = CountingSpawn()
    session = FakeSession({URL_A: FakeResponse(200, b"a" * 29 + b"!")})
    runner = env.mod.HTTPActionRunner(FakeHass(), session_for=session.for_verify, spawn=spawn)
    doc = library(action(responseConfig={"source": "regex", "pattern": "(a+)+$"}))
    ticks = 0

    async def ticker() -> None:
        nonlocal ticks
        while True:
            await asyncio.sleep(0.01)
            ticks += 1

    async def scenario():
        task = asyncio.create_task(ticker())
        started = asyncio.get_running_loop().time()
        reply = await runner.async_run(doc, {"id": ID_A}, device="w")
        took = asyncio.get_running_loop().time() - started
        task.cancel()
        return reply, took

    reply, took = asyncio.run(scenario())
    assert reply["status"] == 200 and reply["value"] is None
    assert took < 4
    # The loop ticked through the whole search, about 100 times a second.
    assert ticks > 50 * env.mod.REGEX_CHILD_TIMEOUT
    assert len(spawn.calls) == 1
    assert all("(a+)" not in str(arg) and "aaaa" not in str(arg) for arg in spawn.calls[0])
    assert runner.running("w") == 0


@pytest.mark.parametrize(
    "pattern", ["t=(\\d)", '"temp":\\s*(\\d+)', "^(\\d+)", "Version: ([0-9.]+)", ""]
)
def test_a_plain_pattern_never_starts_a_process(env, pattern) -> None:
    spawn = CountingSpawn()
    session = FakeSession({URL_A: FakeResponse(200, b'Version: 1.2 t=4 "temp": 21')})
    hass = FakeHass()
    runner = env.mod.HTTPActionRunner(hass, session_for=session.for_verify, spawn=spawn)
    doc = library(action(responseConfig={"source": "regex", "pattern": pattern}))
    run(env, runner, doc, {"id": ID_A})
    assert spawn.calls == []
    assert hass.executor_calls == ["extract_reply"]


# Patterns and bodies the two ways must read alike: named groups, a group
# that takes no part, no group, lines, text outside ASCII, bad patterns,
# and a body past the 256 KB a search reads.
_REGEX_TABLE = [
    ("(?<n>\\d+)°", "it is 21° out"),
    ("(?P<n>\\d+)x", "7x"),
    ("(a)|(b)", "b"),
    ("(a)?b", "b"),
    ("a.b", "a\nb"),
    ("Grüße (\\w+)", "Grüße Welt"),
    ("[", "x"),
    ("(", "x"),
    ("nothing", "here"),
    ("  (\\d+)  ", "n=5"),
    ("(x+)$", "x" * (300 * 1024)),
    ("<title>(.*?)</title>", "<html><title>Home</title>"),
    ('"state":\\s*"([^"]*)"', '{"state": "on"}'),
    ("é(.)", "café!"),
]


def test_the_child_reads_patterns_as_this_process_does(env) -> None:
    runner = env.mod.HTTPActionRunner(FakeHass(), session_for=FakeSession({}).for_verify)
    ha = sys.modules[f"{env.mod.__package__}.http_actions"]

    async def both():
        return [
            (
                ha.regex_capture(body.encode(), pattern),
                await runner.async_regex_in_child(body.encode(), pattern),
            )
            for pattern, body in _REGEX_TABLE
        ]

    results = asyncio.run(both())
    for (pattern, _body), (here, there) in zip(_REGEX_TABLE, results, strict=True):
        assert here == there, pattern
    # The child really searched: most rows find something.
    found = [there for _here, there in results if there is not None]
    assert len(found) >= 9
    assert results[0] == ("21", "21")
    assert results[10][1] == "x" * (256 * 1024)


class _StuckProcess:
    def __init__(self) -> None:
        self.returncode: int | None = None
        self.killed = False

    async def communicate(self, data: bytes) -> tuple[bytes, bytes]:
        await asyncio.sleep(3600)
        return b"", b""

    def kill(self) -> None:
        self.killed = True
        self.returncode = -9

    async def wait(self) -> int:
        return self.returncode


def test_a_child_that_never_answers_is_killed(env, monkeypatch) -> None:
    stuck = _StuckProcess()

    async def spawn(*args, **kwargs):
        return stuck

    monkeypatch.setattr(env.mod, "REGEX_CHILD_TIMEOUT", 0.05)
    runner = env.mod.HTTPActionRunner(FakeHass(), session_for=FakeSession({}).for_verify, spawn=spawn)
    assert asyncio.run(runner.async_regex_in_child(b"aaaa!", "(a+)+$")) is None
    assert stuck.killed


def test_a_child_that_cannot_start_reads_as_no_value(env) -> None:
    async def spawn(*args, **kwargs):
        raise OSError("no python")

    runner = env.mod.HTTPActionRunner(FakeHass(), session_for=FakeSession({}).for_verify, spawn=spawn)
    assert asyncio.run(runner.async_regex_in_child(b"aaaa!", "(a+)+$")) is None


def test_the_run_timeout_covers_reading_the_value(env, monkeypatch) -> None:
    async def slow_extract(config, answer):
        await asyncio.sleep(3600)

    runner, _, _ = make_runner(env, {URL_A: FakeResponse(200, b"x")})
    monkeypatch.setattr(runner, "_extract", slow_extract)
    monkeypatch.setattr(env.mod, "REGEX_CHILD_TIMEOUT", 0.05)
    doc = library(action(timeout=0.01))
    reply = run(env, runner, doc, {"id": ID_A}, device="w")
    assert reply["status"] == 200 and reply["value"] is None
    assert runner.running("w") == 0


class _HassSession:
    """A session from ``async_create_clientsession``: ``close`` is the call
    Home Assistant warns about, ``detach`` the one it asks for."""

    def __init__(self) -> None:
        self.closed = False
        self.detached = False

    async def close(self) -> None:
        raise AssertionError("closes the Home Assistant aiohttp session")

    def detach(self) -> None:
        self.detached = True
        self.closed = True

    def request(self, method, url, **kwargs):
        return FakeResponse(200)


def test_the_runner_owns_its_sessions_and_detaches_them_on_unload(env, monkeypatch) -> None:
    made: list[tuple[dict, _HassSession]] = []

    def create(hass, **kwargs):
        session = _HassSession()
        made.append((kwargs, session))
        return session

    monkeypatch.setitem(
        sys.modules,
        "homeassistant.helpers.aiohttp_client",
        types.SimpleNamespace(async_create_clientsession=create),
    )
    runner = env.mod.HTTPActionRunner(FakeHass())
    doc = library(action(), action(id=ID_B, allowsUntrustedCertificate=True))
    run(env, runner, doc, {"id": ID_A})
    run(env, runner, doc, {"id": ID_B})
    run(env, runner, doc, {"id": ID_A})
    assert [kwargs["verify_ssl"] for kwargs, _ in made] == [True, False]
    assert all(kwargs["auto_cleanup"] is False for kwargs, _ in made)
    # Unload, as a reload does: nothing is left attached.
    asyncio.run(runner.async_shutdown())
    assert all(session.detached for _, session in made)
    # The runner of the next setup makes its own.
    fresh = env.mod.HTTPActionRunner(FakeHass())
    run(env, fresh, doc, {"id": ID_A})
    assert len(made) == 3 and not made[2][1].detached
    asyncio.run(fresh.async_shutdown())
    assert made[2][1].detached


def test_a_header_reply_reads_joined_headers(env) -> None:
    answer = FakeResponse(200, b"", [("X-N", "1"), ("x-n", "2"), ("ETag", "e")])
    runner, _, _ = make_runner(env, {URL_A: answer})
    doc = library(action(responseConfig={"source": "header", "headerName": "X-N"}))
    assert run(env, runner, doc, {"id": ID_A})["value"] == "1, 2"


# ── the panel's Test ─────────────────────────────────────────────────────


def test_the_test_command_answers_headers_paths_and_time(env) -> None:
    runner, session, _ = make_runner(
        env, {"https://api.example/x?q=a%20b": FakeResponse(200, b'{"b":{"c":2},"a":"s"}', {"X-Rate": "9"})}
    )
    draft = action(method="GET", url="{{base}}/x?q={{q}}", variables=[variable("q")],
                   responseConfig={"source": "jsonField", "jsonPath": "b.c"})
    result = asyncio.run(runner.async_test(draft, [{"id": "G", "key": "base", "value": "https://api.example"}], {"q": "a b"}))
    elapsed = result.pop("elapsed_ms")
    assert isinstance(elapsed, int) and elapsed >= 0
    assert result == {
        "status": 200,
        "value": "2",
        "snippet": '{"b":{"c":2},"a":"s"}',
        "error": None,
        "headers": {"X-Rate": "9"},
        "paths": [{"path": "a", "value": "s"}, {"path": "b.c", "value": "2"}],
        "body": '{"b":{"c":2},"a":"s"}',
        "body_size": 21,
        "body_binary": False,
        "body_cut": False,
        "leaves": [{"path": "a", "value": "s"}, {"path": "b.c", "value": "2"}],
        "leaves_cut": False,
    }


def test_the_test_command_lists_every_leaf_with_the_value_its_path_reads(env) -> None:
    body = b'{"rows":[{"t":1.50,"ok":true},{"t":22,"name":"x","deep":[[null,"z"]]}],"n":null,"e":[],"s":"v"}'
    runner, _, _ = make_runner(env, {URL_A: FakeResponse(200, body)})
    result = asyncio.run(runner.async_test(action(url=URL_A), [], {}))
    leaves = {leaf["path"]: leaf["value"] for leaf in result["leaves"]}
    assert set(leaves) >= {"rows.0.t", "rows.0.ok", "rows.1.t", "rows.1.name", "rows.1.deep.0.1", "s"}
    assert not result["leaves_cut"]
    # The first-item list the phone's picker shows is unchanged.
    assert "rows.1.t" not in {p["path"] for p in result["paths"]}
    # Each listed value is what a reply value with that path reads.
    core = sys.modules[env.mod.__name__.rsplit(".", 1)[0] + ".http_actions"]
    for path, value in leaves.items():
        assert core.json_field_value(body, path) == value


def test_the_test_command_keeps_the_body_as_sent_and_sends_no_text_of_a_binary_one(env) -> None:
    text = b'{\n  "a": "caf\xc3\xa9"\n}\n'
    runner, _, _ = make_runner(env, {URL_A: FakeResponse(200, text), "https://example.com/png": FakeResponse(200, b"\x89PNG\x00\xff")})
    kept = asyncio.run(runner.async_test(action(url=URL_A), [], {}))
    assert kept["body"] == text.decode() and kept["body_size"] == len(text) and not kept["body_binary"]
    binary = asyncio.run(runner.async_test(action(url="https://example.com/png"), [], {}))
    assert binary["body"] == "" and binary["body_binary"] and binary["body_size"] == 6


def test_the_test_command_runs_a_draft_with_no_url(env) -> None:
    runner, _, _ = make_runner(env, {})
    result = asyncio.run(runner.async_test(action(url=""), [], {}))
    assert result["error"] == "The URL is empty." and result["status"] is None


@pytest.mark.parametrize(
    ("draft", "globals_"),
    [({"id": ID_A}, []), (action(method="HEAD"), []), (action(), [{"key": "", "value": ""}]), (action(), "x")],
)
def test_the_test_command_refuses_a_malformed_draft(env, draft, globals_) -> None:
    runner, _, _ = make_runner(env, {})
    with pytest.raises(env.mod.HTTPActionRefusal) as caught:
        asyncio.run(runner.async_test(draft, globals_, {}))
    assert caught.value.code == "invalid"


# ── the client certificate ───────────────────────────────────────────────

USER = "user-jesse"
OTHER = "user-guest"
CERT_PASSWORD = "p12 pässword"


def _self_signed(common_name: str):
    key = ec.generate_private_key(ec.SECP256R1())
    name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, common_name)])
    now = datetime.now(UTC)
    builder = (
        x509.CertificateBuilder()
        .subject_name(name)
        .issuer_name(name)
        .public_key(key.public_key())
        .serial_number(x509.random_serial_number())
        .not_valid_before(now - timedelta(days=1))
        .not_valid_after(now + timedelta(days=30))
    )
    if common_name == "localhost":
        builder = builder.add_extension(
            x509.SubjectAlternativeName([x509.DNSName("localhost")]), critical=False
        )
    return key, builder.sign(key, hashes.SHA256())


def make_p12(common_name: str = "wa-client", password: str = CERT_PASSWORD) -> bytes:
    """A throwaway self-signed EC certificate and its key as a .p12."""
    key, cert = _self_signed(common_name)
    encryption = (
        serialization.BestAvailableEncryption(password.encode())
        if password
        else serialization.NoEncryption()
    )
    return pkcs12.serialize_key_and_certificates(b"wa", key, cert, None, encryption)


def certificate(env, common_name: str = "wa-client", password: str = CERT_PASSWORD):
    return env.certs.certificate_from_upload(
        base64.b64encode(make_p12(common_name, password)).decode(), password
    )


def cert_store(env, hass, **held):
    """The real store over the fake ``Store``, holding ``{user: certificate}``."""
    store = env.certs.ClientCertificateStore(hass)

    async def put():
        for user, cert in held.items():
            await store.async_put_certificate(user, cert, source="panel")

    asyncio.run(put())
    return store


def cert_runner(env, script: dict[str, Any], **held):
    runner, session, hass = make_runner(env, script)
    store = cert_store(env, hass, **held)
    unsubscribe = runner.attach_client_certificate_store(store)
    return types.SimpleNamespace(
        runner=runner, session=session, hass=hass, store=store, unsubscribe=unsubscribe
    )


@pytest.mark.parametrize(
    ("user_id", "held", "words"),
    [
        (None, {"user-jesse": True}, "not bound to a Home Assistant user"),
        (USER, {}, "Home Assistant holds none for this user"),
        (USER, {"user-guest": True}, "Home Assistant holds none for this user"),
    ],
)
def test_a_run_that_presents_a_certificate_is_refused_without_one(env, user_id, held, words) -> None:
    setup = cert_runner(env, {URL_A: FakeResponse(200)}, **{u: certificate(env) for u in held})
    doc = library(action(presentsClientCertificate=True))
    with pytest.raises(env.mod.HTTPActionRefusal) as caught:
        asyncio.run(setup.runner.async_run(doc, {"id": ID_A}, device="w", user_id=user_id))
    refusal = caught.value
    assert (refusal.code, refusal.status) == ("client_certificate_missing", 409)
    assert words in refusal.message
    assert setup.session.calls == []
    assert setup.runner.running("w") == 0


def test_a_removed_certificate_is_refused_too(env) -> None:
    setup = cert_runner(env, {URL_A: FakeResponse(200)}, **{USER: certificate(env)})
    setup.store.delete(USER, source="panel")
    doc = library(action(presentsClientCertificate=True))
    with pytest.raises(env.mod.HTTPActionRefusal) as caught:
        asyncio.run(setup.runner.async_run(doc, {"id": ID_A}, device="w", user_id=USER))
    assert caught.value.code == "client_certificate_missing"
    assert caught.value.message == env.mod.NO_CLIENT_CERTIFICATE


def test_an_unreadable_store_is_unavailable(env) -> None:
    setup = cert_runner(env, {URL_A: FakeResponse(200)})
    setup.store._load_failed = True
    doc = library(action(presentsClientCertificate=True))
    with pytest.raises(env.mod.HTTPActionRefusal) as caught:
        asyncio.run(setup.runner.async_run(doc, {"id": ID_A}, device="w", user_id=USER))
    assert (caught.value.code, caught.value.status) == ("unavailable", 503)


def test_no_store_attached_is_unavailable_for_a_certificate_action_only(env) -> None:
    runner, session, _ = make_runner(env, {URL_A: FakeResponse(200)})
    with pytest.raises(env.mod.HTTPActionRefusal) as caught:
        asyncio.run(runner.async_run(library(action(presentsClientCertificate=True)),
                                     {"id": ID_A}, device="w", user_id=USER))
    assert caught.value.code == "unavailable"
    assert run(env, runner, library(action()), {"id": ID_A})["status"] == 200


def test_the_certificate_reaches_the_first_origin_only(env) -> None:
    mine = certificate(env)
    setup = cert_runner(
        env,
        {
            "https://home.example/a": _redirect(307, "/b"),
            "https://home.example/b": _redirect(307, "https://other.example/c"),
            "https://other.example/c": _redirect(307, "https://home.example/d"),
            "https://home.example/d": FakeResponse(200, b"ok"),
        },
        **{USER: mine, OTHER: certificate(env, "guest")},
    )
    doc = library(action(url="https://home.example/a", presentsClientCertificate=True,
                         allowsUntrustedCertificate=True))
    reply = asyncio.run(setup.runner.async_run(doc, {"id": ID_A}, device="w", user_id=USER))
    assert reply["status"] == 200
    presented = [c["certificate"] for c in setup.session.calls]
    assert [p.fingerprint if p else None for p in presented] == [
        mine.fingerprint, mine.fingerprint, None, mine.fingerprint,
    ]
    assert [c["verify"] for c in setup.session.calls] == [False, False, True, False]
    # The seam gets the certificate as stored; nothing is built for it.
    assert presented[0].pkcs12 == mine.pkcs12 and presented[0].passphrase == CERT_PASSWORD
    assert "client_ssl_context" not in setup.hass.executor_calls


def test_an_action_without_the_flag_presents_nothing(env) -> None:
    setup = cert_runner(env, {URL_A: FakeResponse(200)}, **{USER: certificate(env)})
    asyncio.run(setup.runner.async_run(library(action()), {"id": ID_A}, device="w", user_id=USER))
    assert setup.session.calls[0]["certificate"] is None


def test_the_panel_test_presents_the_signed_in_users_own(env) -> None:
    mine, theirs = certificate(env), certificate(env, "guest")
    setup = cert_runner(env, {URL_A: FakeResponse(200)}, **{USER: mine, OTHER: theirs})
    draft = action(presentsClientCertificate=True)
    result = asyncio.run(setup.runner.async_test(draft, [], {}, user_id=OTHER))
    assert result["status"] == 200
    assert setup.session.calls[0]["certificate"].fingerprint == theirs.fingerprint
    with pytest.raises(env.mod.HTTPActionRefusal) as caught:
        asyncio.run(setup.runner.async_test(draft, [], {}, user_id="user-nobody"))
    assert caught.value.code == "client_certificate_missing"
    assert caught.value.message == env.mod.NO_CLIENT_CERTIFICATE
    with pytest.raises(env.mod.HTTPActionRefusal) as caught:
        asyncio.run(setup.runner.async_test(draft, [], {}))
    assert caught.value.code == "client_certificate_missing"
    assert len(setup.session.calls) == 1
    assert setup.runner.running(env.mod.PANEL_DEVICE) == 0


# A real context: loaded through private files, and presented in a handshake.


def test_the_context_is_loaded_from_private_files_that_are_gone_after(env, monkeypatch, tmp_path) -> None:
    made: list[str] = []
    seen: dict[str, Any] = {}
    real_mkdtemp = env.mod.tempfile.mkdtemp
    real_load = ssl.SSLContext.load_cert_chain

    def mkdtemp(*args, **kwargs):
        made.append(real_mkdtemp(*args, dir=str(tmp_path), **kwargs))
        return made[-1]

    def load_cert_chain(self, certfile, keyfile=None, password=None):
        seen["folder"] = stat.S_IMODE(os.stat(os.path.dirname(certfile)).st_mode)
        seen["files"] = [stat.S_IMODE(os.stat(p).st_mode) for p in (certfile, keyfile)]
        with open(keyfile, "rb") as file:
            seen["key"] = file.read()
        return real_load(self, certfile, keyfile, password)

    monkeypatch.setattr(env.mod.tempfile, "mkdtemp", mkdtemp)
    monkeypatch.setattr(ssl.SSLContext, "load_cert_chain", load_cert_chain)
    checked = env.mod.client_ssl_context(certificate(env), True)
    unchecked = env.mod.client_ssl_context(certificate(env, password=""), False)
    assert (checked.verify_mode, checked.check_hostname) == (ssl.CERT_REQUIRED, True)
    assert (unchecked.verify_mode, unchecked.check_hostname) == (ssl.CERT_NONE, False)
    assert seen["folder"] == 0o700 and seen["files"] == [0o600, 0o600]
    # The key never sits on disk in the clear.
    assert seen["key"].startswith(b"-----BEGIN ENCRYPTED PRIVATE KEY-----")
    assert len(made) == 2 and not any(os.path.exists(path) for path in made)


@pytest.mark.parametrize(
    "p12",
    [b"not a p12", "wrong password", "no key"],
)
def test_a_p12_that_does_not_load_raises_and_leaves_no_files(env, monkeypatch, tmp_path, p12) -> None:
    if p12 == "wrong password":
        raw, password = make_p12(), "not it"
    elif p12 == "no key":
        _key, cert = _self_signed("bare")
        raw = pkcs12.serialize_key_and_certificates(b"x", None, cert, None, serialization.NoEncryption())
        password = ""
    else:
        raw, password = p12, ""
    cert = env.certs.ClientCertificate(pkcs12=raw, passphrase=password, fingerprint="0" * 64)
    monkeypatch.setattr(env.mod.tempfile, "tempdir", str(tmp_path))
    with pytest.raises(env.mod.ClientCertificateUnusable):
        env.mod.client_ssl_context(cert, True)
    assert os.listdir(tmp_path) == []


def _handshake(client_ctx, server_ctx) -> dict:
    """A TLS handshake over memory, no socket: the server's view of the
    client's certificate."""
    c_in, c_out, s_in, s_out = ssl.MemoryBIO(), ssl.MemoryBIO(), ssl.MemoryBIO(), ssl.MemoryBIO()
    client = client_ctx.wrap_bio(c_in, c_out, server_hostname="localhost")
    server = server_ctx.wrap_bio(s_in, s_out, server_side=True)
    done = {"client": False, "server": False}
    for _ in range(20):
        for name, end in (("client", client), ("server", server)):
            if not done[name]:
                try:
                    end.do_handshake()
                    done[name] = True
                except ssl.SSLWantReadError:
                    pass
        s_in.write(c_out.read())
        c_in.write(s_out.read())
        if all(done.values()):
            break
    assert all(done.values())
    return server.getpeercert()


def test_the_context_presents_the_certificate_in_a_handshake(env, tmp_path) -> None:
    server_key, server_cert = _self_signed("localhost")
    (tmp_path / "server.pem").write_bytes(
        server_cert.public_bytes(serialization.Encoding.PEM)
        + server_key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8,
                                   serialization.NoEncryption())
    )
    mine = certificate(env, "wa-presented")
    client_pem = pkcs12_cert_pem(mine)
    (tmp_path / "clients.pem").write_bytes(client_pem)
    server_ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    server_ctx.load_cert_chain(str(tmp_path / "server.pem"))
    server_ctx.verify_mode = ssl.CERT_REQUIRED
    server_ctx.load_verify_locations(str(tmp_path / "clients.pem"))
    # The server's certificate is self-signed: as an action that accepts
    # an untrusted server would see it.
    client_ctx = env.mod.client_ssl_context(mine, False)
    peer = _handshake(client_ctx, server_ctx)
    assert ((("commonName", "wa-presented"),),) == tuple(peer["subject"])


def pkcs12_cert_pem(cert) -> bytes:
    _key, leaf, _chain = pkcs12.load_key_and_certificates(cert.pkcs12, cert.passphrase.encode())
    return leaf.public_bytes(serialization.Encoding.PEM)


# The session cache, with the network replaced below the seam.


class ClosingSession(FakeSession):
    def __init__(self, script: dict[str, Any], context: Any) -> None:
        super().__init__(script)
        self.context = context
        self.verify = None
        self.certificate = None

    async def close(self) -> None:
        self.closed = True


def cached_runner(env, monkeypatch, script: dict[str, Any], **held):
    hass = FakeHass()
    runner = env.mod.HTTPActionRunner(hass)
    store = cert_store(env, hass, **held)
    runner.attach_client_certificate_store(store)
    made: list[ClosingSession] = []

    def new_session(context):
        made.append(ClosingSession(script, context))
        return made[-1]

    monkeypatch.setattr(runner, "_new_certificate_session", new_session)
    return types.SimpleNamespace(runner=runner, hass=hass, store=store, made=made)


def test_one_session_per_certificate_until_the_users_record_changes(env, monkeypatch) -> None:
    first, second = certificate(env), certificate(env, "renewed")
    setup = cached_runner(env, monkeypatch, {URL_A: FakeResponse(200)}, **{USER: first})
    doc = library(action(presentsClientCertificate=True))

    async def scenario():
        runner = setup.runner
        for _ in range(3):
            assert (await runner.async_run(doc, {"id": ID_A}, device="w", user_id=USER))["status"] == 200
        assert len(setup.made) == 1
        assert isinstance(setup.made[0].context, ssl.SSLContext)
        assert setup.made[0].context.verify_mode == ssl.CERT_REQUIRED
        # An import of a new certificate drops the old session.
        await setup.store.async_put_certificate(USER, second, source="panel")
        await asyncio.gather(*setup.hass.tasks)
        assert setup.made[0].closed
        await runner.async_run(doc, {"id": ID_A}, device="w", user_id=USER)
        assert len(setup.made) == 2 and not setup.made[1].closed
        # A removal drops it too, and the next run is refused.
        setup.store.delete(USER, source="panel")
        await asyncio.gather(*setup.hass.tasks)
        assert setup.made[1].closed
        with pytest.raises(env.mod.HTTPActionRefusal):
            await runner.async_run(doc, {"id": ID_A}, device="w", user_id=USER)
        assert len(setup.made) == 2

    asyncio.run(scenario())
    assert setup.hass.executor_calls.count("client_ssl_context") == 2


def test_another_users_change_keeps_the_session(env, monkeypatch) -> None:
    setup = cached_runner(env, monkeypatch, {URL_A: FakeResponse(200)},
                          **{USER: certificate(env), OTHER: certificate(env, "guest")})
    doc = library(action(presentsClientCertificate=True))

    async def scenario():
        await setup.runner.async_run(doc, {"id": ID_A}, device="w", user_id=USER)
        setup.store.delete(OTHER, source="panel")
        await asyncio.gather(*setup.hass.tasks)
        assert not setup.made[0].closed
        await setup.runner.async_run(doc, {"id": ID_A}, device="w", user_id=USER)
        assert len(setup.made) == 1

    asyncio.run(scenario())


def test_an_untrusted_server_gets_a_session_of_its_own(env, monkeypatch) -> None:
    setup = cached_runner(env, monkeypatch, {URL_A: FakeResponse(200)}, **{USER: certificate(env)})
    doc = library(action(presentsClientCertificate=True),
                  action(id=ID_B, presentsClientCertificate=True, allowsUntrustedCertificate=True))

    async def scenario():
        await setup.runner.async_run(doc, {"id": ID_A}, device="w", user_id=USER)
        await setup.runner.async_run(doc, {"id": ID_B}, device="w", user_id=USER)

    asyncio.run(scenario())
    assert [s.context.verify_mode for s in setup.made] == [ssl.CERT_REQUIRED, ssl.CERT_NONE]


def test_a_run_in_flight_keeps_its_session_until_it_ends(env, monkeypatch) -> None:
    gate = asyncio.Event()

    async def slow():
        await gate.wait()
        return FakeResponse(200, b"late")

    setup = cached_runner(env, monkeypatch, {URL_A: slow}, **{USER: certificate(env)})
    doc = library(action(presentsClientCertificate=True))

    async def scenario():
        nonlocal gate
        gate = asyncio.Event()
        task = asyncio.create_task(setup.runner.async_run(doc, {"id": ID_A}, device="w", user_id=USER))
        await asyncio.sleep(0.05)
        setup.store.delete(USER, source="panel")
        await asyncio.sleep(0)
        assert not setup.made[0].closed
        gate.set()
        reply = await task
        assert reply["snippet"] == "late"
        assert setup.made[0].closed

    asyncio.run(scenario())


def test_shutdown_closes_the_certificate_sessions(env, monkeypatch) -> None:
    setup = cached_runner(env, monkeypatch, {URL_A: FakeResponse(200)}, **{USER: certificate(env)})
    doc = library(action(presentsClientCertificate=True))

    async def scenario():
        await setup.runner.async_run(doc, {"id": ID_A}, device="w", user_id=USER)
        await setup.runner.async_shutdown()

    asyncio.run(scenario())
    assert setup.made[0].closed


def test_a_stored_p12_that_does_not_load_is_refused_unreadable(env, monkeypatch) -> None:
    setup = cached_runner(env, monkeypatch, {URL_A: FakeResponse(200)}, **{USER: certificate(env)})
    record = setup.store.get(USER)
    broken = env.certs.ClientCertificate(
        pkcs12=b"garbage", passphrase="", fingerprint=record.certificate.fingerprint
    )
    setup.store._users[USER] = env.certs.ClientCertificateRecord(
        revision=record.revision, updated_at=record.updated_at, certificate=broken, source="panel"
    )
    with pytest.raises(env.mod.HTTPActionRefusal) as caught:
        asyncio.run(setup.runner.async_run(library(action(presentsClientCertificate=True)),
                                           {"id": ID_A}, device="w", user_id=USER))
    assert (caught.value.code, caught.value.status) == ("client_certificate_unreadable", 409)
    assert caught.value.message == env.mod.UNREADABLE_CLIENT_CERTIFICATE
    assert setup.made == []
    assert setup.runner.running("w") == 0
