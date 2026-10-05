"""Tests for ``http_actions_runner.py``, the sender, with a fake session.

The runner reaches the network only through ``session_for(verify_ssl)``,
so each test hands it a scripted session that answers by URL and records
every request. Covered: a run's reply shape, the refusals (not found, needs
setup, missing or malformed audio, busy), the timeout and its clamp, every
row of the redirect rule (GET follows, a body verb follows only 307 and 308,
at most 5 hops, a redirect off the first host drops Authorization and checks
the certificate again, none to loopback), the 256 KB read cap, the regex in
the executor, the URL sent as built, and the panel's Test.
"""

from __future__ import annotations

import asyncio
import base64
import types
from typing import Any

import pytest
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

    def for_verify(self, verify: bool) -> FakeSession:
        self.verify = verify
        return self

    def request(self, method, url, *, headers, data, allow_redirects, skip_auto_headers):
        assert allow_redirects is False
        assert url.is_absolute()
        self.calls.append(
            {"method": method, "url": str(url), "headers": list(headers), "data": data,
             "verify": self.verify}
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

    async def async_add_executor_job(self, fn, *args):
        self.executor_calls.append(fn.__name__)
        return await asyncio.get_running_loop().run_in_executor(None, fn, *args)


@pytest.fixture
def env():
    with loaded_package() as loaded:
        runner_mod = loaded.load("http_actions_runner")
        yield types.SimpleNamespace(mod=runner_mod)


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


def test_leaving_the_host_drops_authorization_and_checks_the_certificate(env) -> None:
    runner, session, _ = make_runner(
        env,
        {
            "https://self.example/a": _redirect(302, "/b"),
            "https://self.example/b": _redirect(302, "https://other.example/c"),
            "https://other.example/c": FakeResponse(200),
        },
    )
    doc = library(action(method="GET", url="https://self.example/a",
                         headers=[header("Authorization", "Bearer x"), header("X-Keep", "1")],
                         allowsUntrustedCertificate=True))
    run(env, runner, doc, {"id": ID_A})
    assert [(c["verify"], [h[0] for h in c["headers"]]) for c in session.calls] == [
        (False, ["Authorization", "X-Keep"]),
        (False, ["Authorization", "X-Keep"]),
        (True, ["X-Keep"]),
    ]


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
    }


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
