"""``/v2/pair/start`` with no Home Assistant.

``WAPairStartView`` is pulled out of ``wa_v2_views.py`` by name, beside
``WARegisterSecretView``, the way ``test_widget_secret_user_binding.py`` does
it, and run over a real ``WidgetSecretStore`` and a real ``PairRequestStore``.
The device registry and the Logbook helpers raise if touched. Pinned:

* the reply shape (code, ``expires_in`` 600, ``poll_after`` 3);
* the request is only stored: the secret store, the device registry and the
  Logbook are never touched;
* every refusal matches ``register_secret`` for the same body, status and
  text, since both go through one validator;
* 429 ``too_many_pending`` when the store is full, 503 while not loaded.
"""

from __future__ import annotations

import __future__
import ast
import asyncio
import base64
import logging
import types
from typing import Any

import pytest

from test_pair_requests import loaded_pair_module
from test_widget_secret_user_binding import (
    _SRC,
    ALICE,
    _loaded_store,
    _Request,
    _Response,
    _View,
)

DOMAIN = "wrist_assistant"
SECRET = base64.b64encode(b"p" * 32).decode()


def _untouchable(name: str):
    def _fail(*_args: Any, **_kwargs: Any) -> Any:
        raise AssertionError(f"pair/start touched {name}")

    return _fail


def _view_classes(pair_mod) -> dict[str, type]:
    path = _SRC / "wa_v2_views.py"
    tree = ast.parse(path.read_text(), filename=str(path))
    names = {"WAPairStartView", "WARegisterSecretView"}
    wanted = [node for node in tree.body if isinstance(node, ast.ClassDef) and node.name in names]
    assert sorted(node.name for node in wanted) == sorted(names)
    code = compile(
        ast.Module(body=wanted, type_ignores=[]),
        str(path),
        "exec",
        flags=__future__.annotations.compiler_flag,
        dont_inherit=True,
    )
    namespace: dict[str, Any] = {
        "Any": Any,
        "Response": _Response,
        "HomeAssistantView": _View,
        "DOMAIN": DOMAIN,
        "WA_PROTOCOL_VERSION": 2,
        "_LOGGER": logging.getLogger("test_pair_start_view"),
        "validate_pair_fields": pair_mod.validate_pair_fields,
        "PAIR_START_FIELDS": pair_mod.PAIR_START_FIELDS,
        "PAIR_POLL_AFTER_SECONDS": pair_mod.PAIR_POLL_AFTER_SECONDS,
        "log_secret_registered": _untouchable("the Logbook"),
        "log_secret_reprovisioned": _untouchable("the Logbook"),
        "dr": types.SimpleNamespace(async_get=_untouchable("the device registry")),
    }
    exec(code, namespace)  # noqa: S102
    return {name: namespace[name] for name in names}


@pytest.fixture
def env():
    with _loaded_store() as store_mod, loaded_pair_module() as pair_mod:
        secret_store = store_mod.WidgetSecretStore(object())
        asyncio.run(secret_store.async_load())
        pair_store = pair_mod.PairRequestStore(clock=lambda: 5_000.0)
        hass = types.SimpleNamespace(
            data={
                DOMAIN: types.SimpleNamespace(
                    widget_secret_store=secret_store, pair_request_store=pair_store
                )
            }
        )
        classes = _view_classes(pair_mod)
        yield types.SimpleNamespace(
            hass=hass,
            secret_store=secret_store,
            pair_store=pair_store,
            pair_mod=pair_mod,
            start=classes["WAPairStartView"](hass),
            register=classes["WARegisterSecretView"](hass),
        )


def _body(**overrides: Any) -> dict:
    body = {
        "watch_id": "watch-code-1",
        "secret_b64": SECRET,
        "device_name": "Test Watch",
        "screen_size": "208x248",
        "app_version": "3.0.1",
        "app_build": "2",
    }
    body.update(overrides)
    return {key: value for key, value in body.items() if value is not None}


def _start(env, body: dict) -> _Response:
    return asyncio.run(env.start.post(_Request(body, None)))


def _assert_nothing_written(env) -> None:
    assert env.secret_store.all_watch_ids == []
    assert env.secret_store._store.saved is None


# ── the reply ────────────────────────────────────────────────────────────


def test_a_start_returns_a_code_and_stores_only_the_request(env) -> None:
    reply = _start(env, _body())
    assert reply.status == 200, reply.body
    assert set(reply.body) == {"ok", "code", "expires_in", "poll_after"}
    assert reply.body["ok"] is True
    assert reply.body["expires_in"] == 600
    assert reply.body["poll_after"] == 3
    code = reply.body["code"]
    assert len(code) == 6 and set(code) <= set(env.pair_mod.PAIR_CODE_ALPHABET)

    pending = env.pair_store.get(code)
    assert pending.watch_id == "watch-code-1"
    assert pending.fields.secret_b64 == SECRET
    assert pending.fields.device_name == "Test Watch"
    assert pending.fields.app_version == "3.0.1"
    assert pending.fields.app_build == "2"
    _assert_nothing_written(env)


def test_a_label_and_an_owner_in_the_body_are_ignored(env) -> None:
    reply = _start(env, _body(label="iphone-self-provision", owner_iphone_id="iphone-x"))
    assert reply.status == 200, reply.body
    fields = env.pair_store.get(reply.body["code"]).fields
    assert fields.label is None
    assert fields.owner_iphone_id is None


def test_a_second_start_replaces_the_first_code(env) -> None:
    first = _start(env, _body()).body["code"]
    second = _start(env, _body()).body["code"]
    assert len(env.pair_store) == 1
    assert env.pair_store.get(second) is not None
    if first != second:
        assert env.pair_store.get(first) is None


# ── refusals ─────────────────────────────────────────────────────────────


@pytest.mark.parametrize(
    "overrides",
    [
        {"watch_id": None},
        {"watch_id": "library"},
        {"watch_id": "w" * 129},
        {"device_name": "n" * 257},
        {"screen_size": "s" * 257},
        {"app_version": "v" * 257},
        {"app_build": "b" * 257},
        {"secret_b64": None},
        {"secret_b64": "not base64!"},
        {"secret_b64": base64.b64encode(b"short").decode()},
        {"algo": "hmac-md5"},
    ],
)
def test_each_refusal_matches_register_secret(env, overrides) -> None:
    body = _body(**overrides)
    started = _start(env, body)
    registered = asyncio.run(env.register.post(_Request(body, ALICE)))
    assert started.status == 400
    assert (started.status, started.body) == (registered.status, registered.body)
    assert len(env.pair_store) == 0
    _assert_nothing_written(env)


def test_a_body_that_is_not_an_object_is_refused(env) -> None:
    reply = _start(env, ["watch-code-1"])  # type: ignore[arg-type]
    assert reply.status == 400
    assert reply.body == {"message": "Expected JSON object body"}


def test_bad_json_is_refused(env) -> None:
    class _BadJSON(_Request):
        async def json(self) -> dict:
            raise ValueError("bad json")

    reply = asyncio.run(env.start.post(_BadJSON({}, None)))
    assert reply.status == 400
    assert reply.body == {"message": "Invalid JSON body"}


def test_a_full_store_answers_429(env) -> None:
    for index in range(env.pair_mod.PairRequestStore._MAX_ENTRIES):
        assert _start(env, _body(watch_id=f"watch-{index}")).status == 200
    reply = _start(env, _body(watch_id="one-too-many"))
    assert reply.status == 429
    assert reply.body == {"ok": False, "error": "too_many_pending"}
    _assert_nothing_written(env)


def test_503_while_the_integration_is_not_loaded(env) -> None:
    env.hass.data.clear()
    reply = _start(env, _body())
    assert reply.status == 503
    assert reply.body == {"message": "Integration not loaded"}

    env.hass.data[DOMAIN] = types.SimpleNamespace(widget_secret_store=env.secret_store)
    assert _start(env, _body()).status == 503
