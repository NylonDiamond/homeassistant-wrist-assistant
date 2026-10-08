"""The panel's client certificate commands, with no Home Assistant.

Loads ``client_certificate_ws.py`` with stubbed Home Assistant modules over
the real ``client_certificate_store.py`` (and its ``FakeStore``), using the
package loader, the real ``.p12`` maker and the signed op extraction of
``test_client_certificate.py``, so the phone's ``client_certificate_put``
and the watch's ``client_certificate_get`` run against the same store the
panel writes. ``test_ws_command_registration.py`` covers the registration
and the (deliberately absent) admin gate statically.
"""

from __future__ import annotations

import asyncio
import base64
import hashlib
import json
import logging
import sys
import types
from typing import Any

import pytest
from test_client_certificate import (
    KEY,
    MAX_P12,
    OTHER_USER,
    PASSWORD,
    USER,
    WATCH,
    WATCH_SECRET,
    FakeStore,
    _ops,
    call,
    cert_body,
    loaded_package,
    make_p12,
    new_store,
    sealed_put,
)

DOMAIN = "wrist_assistant"


class _User:
    def __init__(
        self,
        user_id: str,
        *,
        is_admin: bool = False,
        is_active: bool = True,
        system_generated: bool = False,
    ) -> None:
        self.id = user_id
        self.is_admin = is_admin
        self.is_active = is_active
        self.system_generated = system_generated


ADMIN = "user-admin"
MEMBER = "user-member"
RETIRED = "user-retired"
SUPERVISOR = "user-supervisor"


class _Auth:
    """The few users ``hass.auth.async_get_user`` knows."""

    def __init__(self) -> None:
        self.users = {
            u.id: u
            for u in (
                _User(USER, is_admin=True),
                _User(OTHER_USER),
                _User(ADMIN, is_admin=True),
                _User(MEMBER),
                _User(RETIRED, is_active=False),
                _User(SUPERVISOR, is_admin=True, system_generated=True),
            )
        }

    async def async_get_user(self, user_id: str) -> _User | None:
        return self.users.get(user_id)


class _Connection:
    def __init__(self, user: _User | None) -> None:
        self.user = user
        self.results: dict[int, Any] = {}
        self.errors: list[tuple[int, str, str]] = []

    def send_result(self, msg_id: int, payload: Any) -> None:
        # Through JSON, as the wire would.
        self.results[msg_id] = json.loads(json.dumps(payload))

    def send_error(self, msg_id: int, code: str, message: str) -> None:
        self.errors.append((msg_id, code, message))


def _stub(name: str, **attrs: object) -> None:
    module = sys.modules.get(name) or types.ModuleType(name)
    for key, value in attrs.items():
        setattr(module, key, value)
    sys.modules[name] = module


@pytest.fixture
def env(tmp_path):
    with loaded_package() as pkg:
        _stub("homeassistant.components")
        _stub(
            "homeassistant.components.websocket_api",
            ActiveConnection=type("ActiveConnection", (), {}),
            async_register_command=lambda hass, func: None,
            require_admin=lambda func: func,
            websocket_command=lambda schema: (lambda func: func),
            async_response=lambda func: func,
        )
        _stub("voluptuous", Required=lambda *a, **k: a[0], Optional=lambda *a, **k: a[0])
        ws = pkg.load("client_certificate_ws")
        store = new_store(pkg, tmp_path)
        domain = types.SimpleNamespace(client_certificate_store=store)
        hass = types.SimpleNamespace(data={DOMAIN: domain}, auth=_Auth())
        changes: list[str] = []
        store.async_add_listener(changes.append)
        yield types.SimpleNamespace(
            pkg=pkg, ws=ws, store=store, domain=domain, hass=hass, changes=changes,
            ops=_ops(pkg),
        )


def _call(env, command, user: str | None = USER, *, admin: bool = False, **msg) -> _Connection:
    connection = _Connection(_User(user, is_admin=admin) if user is not None else None)
    outcome = command(env.hass, connection, {"id": 1, **msg})
    if asyncio.iscoroutine(outcome):
        asyncio.run(outcome)
    return connection


def _ok(env, command, **msg) -> Any:
    connection = _call(env, command, **msg)
    assert connection.errors == [], connection.errors
    return connection.results[1]


def _error(env, command, **msg) -> tuple[str, str]:
    connection = _call(env, command, **msg)
    assert connection.results == {}
    [(_id, code, message)] = connection.errors
    return code, message


def _upload(p12: bytes | None = None, passphrase: str = PASSWORD) -> dict[str, str]:
    p12 = make_p12() if p12 is None else p12
    return {"pkcs12": base64.b64encode(p12).decode(), "passphrase": passphrase}


def _fp(p12: bytes) -> str:
    return hashlib.sha256(p12).hexdigest()


EMPTY = {
    "present": False,
    "fingerprint": None,
    "updated_at": None,
    "revision": 0,
    "source": None,
}


# ── status ───────────────────────────────────────────────────────────────


def test_status_with_nothing_stored(env) -> None:
    assert _ok(env, env.ws.ws_client_certificate_status) == EMPTY


def test_a_record_saved_before_the_source_field_reads_as_iphone(env, tmp_path) -> None:
    FakeStore.files[KEY] = {
        "users": {
            USER: {"revision": 3, "updated_at": "2026-10-06T10:00:00Z", "certificate": cert_body()}
        }
    }
    env.domain.client_certificate_store = new_store(env.pkg, tmp_path)
    assert _ok(env, env.ws.ws_client_certificate_status) == {
        "present": True,
        "fingerprint": _fp(make_p12()),
        "updated_at": "2026-10-06T10:00:00Z",
        "revision": 3,
        "source": "iphone",
    }


@pytest.mark.parametrize(
    "command",
    ["ws_client_certificate_status", "ws_client_certificate_put", "ws_client_certificate_delete"],
)
def test_no_store_or_an_unreadable_one_is_unavailable(env, command) -> None:
    env.domain.client_certificate_store = None
    assert _error(env, getattr(env.ws, command), **_upload())[0] == "unavailable"
    env.store._load_failed = True
    env.domain.client_certificate_store = env.store
    assert _error(env, getattr(env.ws, command), **_upload())[0] == "unavailable"


@pytest.mark.parametrize(
    "command",
    ["ws_client_certificate_status", "ws_client_certificate_put", "ws_client_certificate_delete"],
)
def test_a_connection_with_no_user_is_refused(env, command) -> None:
    assert _error(env, getattr(env.ws, command), user=None, **_upload())[0] == "unauthorized"
    assert env.store.get(USER) is None


# ── put ──────────────────────────────────────────────────────────────────


def test_put_stores_the_certificate_for_the_caller(env) -> None:
    status = _ok(env, env.ws.ws_client_certificate_put, **_upload())
    assert status == {
        "present": True,
        "fingerprint": _fp(make_p12()),
        "updated_at": status["updated_at"],
        "revision": 1,
        "source": "panel",
    }
    assert isinstance(status["updated_at"], str) and status["updated_at"].endswith("Z")
    assert _ok(env, env.ws.ws_client_certificate_status) == status
    record = env.store.get(USER)
    assert record.certificate.pkcs12 == make_p12()
    assert record.certificate.passphrase == PASSWORD
    # Stored exactly as the signed put stores it, plus the source.
    assert FakeStore.files[KEY]["users"][USER] == {
        "revision": 1,
        "updated_at": status["updated_at"],
        "certificate": cert_body(),
        "source": "panel",
    }
    # The revision moved, which is what wakes the user's devices.
    assert env.changes == [USER] and env.store.revision(USER) == 1


def test_the_same_certificate_again_changes_nothing(env) -> None:
    first = _ok(env, env.ws.ws_client_certificate_put, **_upload())
    again = _ok(env, env.ws.ws_client_certificate_put, **_upload())
    assert again == first and env.changes == [USER]


def test_a_new_certificate_adds_one_to_the_revision(env) -> None:
    _ok(env, env.ws.ws_client_certificate_put, **_upload())
    other = make_p12(common_name="wa-other")
    status = _ok(env, env.ws.ws_client_certificate_put, **_upload(other))
    assert status["revision"] == 2 and status["fingerprint"] == _fp(other)
    assert env.changes == [USER, USER]


def test_a_p12_with_no_password_takes_an_empty_passphrase(env) -> None:
    p12 = make_p12(password="")
    status = _ok(env, env.ws.ws_client_certificate_put, **_upload(p12, passphrase=""))
    assert status["present"] and status["fingerprint"] == _fp(p12)


def test_put_with_the_wrong_passphrase_is_refused(env) -> None:
    code, message = _error(env, env.ws.ws_client_certificate_put, **_upload(passphrase="wrong"))
    assert code == "bad_passphrase" and "password" in message
    assert env.store.get(USER) is None and env.changes == []


@pytest.mark.parametrize(
    ("upload", "code"),
    [
        ({"pkcs12": "not base64!", "passphrase": ""}, "invalid"),
        ({"pkcs12": "", "passphrase": ""}, "invalid"),
        (_upload(b"garbage, not a certificate"), "invalid_pkcs12"),
        (_upload(b"\x30\x82" + b"\x00" * 64), "invalid_pkcs12"),
        (_upload(make_p12(with_key=False)), "invalid_pkcs12"),
        (_upload(b"\x00" * (MAX_P12 + 1)), "too_large"),
        ({**_upload(), "passphrase": "p" * 1025}, "invalid"),
    ],
    ids=["not base64", "empty", "garbage", "not a pfx", "no key", "too big", "long password"],
)
def test_put_of_something_that_is_not_a_usable_p12_is_refused(env, upload, code) -> None:
    _ok(env, env.ws.ws_client_certificate_put, **_upload())
    kept = env.store.get(USER)
    got, message = _error(env, env.ws.ws_client_certificate_put, **upload)
    assert got == code and message
    assert env.store.get(USER) is kept and env.changes == [USER]


def test_a_truncated_p12_reads_as_a_wrong_password_only_when_its_header_holds() -> None:
    with loaded_package() as pkg:
        looks = pkg.store_mod.looks_like_pkcs12
        p12 = make_p12()
        assert looks(p12) and looks(make_p12(password=""))
        assert not looks(p12[:-1]) and not looks(b"garbage") and not looks(b"")


# ── delete ───────────────────────────────────────────────────────────────


def test_delete_clears_the_caller_s_certificate(env) -> None:
    _ok(env, env.ws.ws_client_certificate_put, **_upload())
    status = _ok(env, env.ws.ws_client_certificate_delete)
    assert status == {
        "present": False,
        "fingerprint": None,
        "updated_at": status["updated_at"],
        "revision": 2,
        "source": "panel",
    }
    assert FakeStore.files[KEY]["users"][USER]["certificate"] is None
    assert env.changes == [USER, USER]
    # Again: nothing changes.
    assert _ok(env, env.ws.ws_client_certificate_delete) == status
    assert env.changes == [USER, USER]


def test_delete_with_nothing_stored(env) -> None:
    assert _ok(env, env.ws.ws_client_certificate_delete) == EMPTY
    assert env.changes == []


# ── per user ─────────────────────────────────────────────────────────────


def test_each_user_sees_and_manages_only_their_own(env) -> None:
    mine = _ok(env, env.ws.ws_client_certificate_put, **_upload())
    assert _ok(env, env.ws.ws_client_certificate_status, user=OTHER_USER) == EMPTY
    guest_p12 = make_p12(common_name="guest")
    theirs = _ok(env, env.ws.ws_client_certificate_put, user=OTHER_USER, **_upload(guest_p12))
    assert theirs["fingerprint"] == _fp(guest_p12) and theirs["revision"] == 1
    _ok(env, env.ws.ws_client_certificate_delete, user=OTHER_USER)
    assert _ok(env, env.ws.ws_client_certificate_status) == mine
    assert env.store.get(OTHER_USER).present is False
    assert env.store.get(USER).certificate.pkcs12 == make_p12()


# ── the signed ops beside the panel ──────────────────────────────────────


def test_a_watch_fetches_what_the_panel_stored(env) -> None:
    _ok(env, env.ws.ws_client_certificate_put, **_upload())
    reply = call(env, "_op_client_certificate_get", {}, watch_id=WATCH, secret=WATCH_SECRET)
    assert reply.status == 200 and reply.body["present"] is True
    assert reply.body["revision"] == 1 and reply.body["fingerprint"] == _fp(make_p12())
    opened = env.pkg.sealed.open_box(
        WATCH_SECRET, WATCH, "client_certificate_get", reply.body["sealed"]
    )
    assert json.loads(opened) == cert_body()


def test_a_phone_put_does_not_overwrite_the_panel_s_certificate(env, caplog) -> None:
    panel = _ok(env, env.ws.ws_client_certificate_put, **_upload())
    phone_p12 = make_p12(common_name="phone")
    with caplog.at_level(logging.INFO):
        for _ in range(2):
            reply = call(
                env, "_op_client_certificate_put", sealed_put(env, cert_body(phone_p12))
            )
            # The reply the phone takes as settled.
            assert (reply.status, reply.body) == (
                200,
                {"ok": True, "revision": 1, "changed": False, "fingerprint": panel["fingerprint"]},
            )
    assert env.store.get(USER).certificate.pkcs12 == make_p12()
    assert _ok(env, env.ws.ws_client_certificate_status) == panel
    assert env.changes == [USER]
    kept = [r for r in caplog.records if "Kept the client certificate" in r.getMessage()]
    assert len(kept) == 1


def test_a_phone_delete_does_not_clear_the_panel_s_certificate(env) -> None:
    panel = _ok(env, env.ws.ws_client_certificate_put, **_upload())
    reply = call(env, "_op_client_certificate_delete", {})
    assert reply.body == {"ok": True, "revision": 1, "changed": False}
    assert _ok(env, env.ws.ws_client_certificate_status) == panel


def test_a_phone_put_after_a_removal_in_the_panel_changes_nothing(env) -> None:
    _ok(env, env.ws.ws_client_certificate_put, **_upload())
    removed = _ok(env, env.ws.ws_client_certificate_delete)
    reply = call(env, "_op_client_certificate_put", sealed_put(env, cert_body()))
    assert reply.body == {"ok": True, "revision": 2, "changed": False, "fingerprint": None}
    assert _ok(env, env.ws.ws_client_certificate_status) == removed


def test_a_phone_put_over_an_empty_store_or_its_own_record_works_as_before(env) -> None:
    reply = call(env, "_op_client_certificate_put", sealed_put(env, cert_body()))
    assert reply.body == {
        "ok": True, "revision": 1, "changed": True, "fingerprint": _fp(make_p12()),
    }
    other = make_p12(common_name="phone-2")
    reply = call(env, "_op_client_certificate_put", sealed_put(env, cert_body(other)))
    assert reply.body == {"ok": True, "revision": 2, "changed": True, "fingerprint": _fp(other)}
    assert _ok(env, env.ws.ws_client_certificate_status)["source"] == "iphone"


def test_the_panel_takes_over_the_phone_s_record_of_the_same_certificate(env) -> None:
    call(env, "_op_client_certificate_put", sealed_put(env, cert_body()))
    status = _ok(env, env.ws.ws_client_certificate_put, **_upload())
    # The watches already hold it: no new revision, no wake.
    assert status["revision"] == 1 and status["source"] == "panel"
    assert env.changes == [USER]
    assert FakeStore.files[KEY]["users"][USER]["source"] == "panel"
    other = make_p12(common_name="phone-3")
    reply = call(env, "_op_client_certificate_put", sealed_put(env, cert_body(other)))
    assert reply.body["changed"] is False and reply.body["fingerprint"] == _fp(make_p12())


def test_the_panel_replaces_a_phone_s_certificate(env) -> None:
    call(env, "_op_client_certificate_put", sealed_put(env, cert_body()))
    other = make_p12(common_name="panel")
    status = _ok(env, env.ws.ws_client_certificate_put, **_upload(other))
    assert status["revision"] == 2 and status["fingerprint"] == _fp(other)
    assert status["source"] == "panel"


# ── an administrator acting for another user ─────────────────────────────


def test_an_admin_stores_a_certificate_a_member_s_watch_fetches(env) -> None:
    status = _ok(
        env, env.ws.ws_client_certificate_put, user=ADMIN, admin=True, user_id=MEMBER, **_upload()
    )
    assert status["present"] is True and status["revision"] == 1 and status["source"] == "panel"
    # Stored under the member, not the administrator.
    assert env.store.get(MEMBER).certificate.pkcs12 == make_p12()
    assert env.store.get(ADMIN) is None
    # The change names the member, which is what wakes their devices.
    assert env.changes == [MEMBER]
    # A watch bound to the member fetches it, sealed with its own secret.
    reply = call(
        env, "_op_client_certificate_get", {}, watch_id=WATCH, secret=WATCH_SECRET, user_id=MEMBER
    )
    assert reply.status == 200 and reply.body["present"] is True
    assert reply.body["fingerprint"] == _fp(make_p12())
    opened = env.pkg.sealed.open_box(
        WATCH_SECRET, WATCH, "client_certificate_get", reply.body["sealed"]
    )
    assert json.loads(opened) == cert_body()
    # A device of the administrator still has none.
    mine = call(
        env, "_op_client_certificate_get", {}, watch_id=WATCH, secret=WATCH_SECRET, user_id=ADMIN
    )
    assert mine.body == {"ok": True, "revision": 0, "present": False}


def test_an_admin_reads_and_removes_a_member_s_certificate(env) -> None:
    stored = _ok(
        env, env.ws.ws_client_certificate_put, user=ADMIN, admin=True, user_id=MEMBER, **_upload()
    )
    assert _ok(env, env.ws.ws_client_certificate_status, user=ADMIN, admin=True) == EMPTY
    assert (
        _ok(env, env.ws.ws_client_certificate_status, user=ADMIN, admin=True, user_id=MEMBER)
        == stored
    )
    # The member sees the same record as their own.
    assert _ok(env, env.ws.ws_client_certificate_status, user=MEMBER) == stored
    removed = _ok(
        env, env.ws.ws_client_certificate_delete, user=ADMIN, admin=True, user_id=MEMBER
    )
    assert removed["present"] is False and removed["revision"] == 2
    assert env.store.get(MEMBER).present is False
    assert env.changes == [MEMBER, MEMBER]


def test_naming_yourself_is_the_same_as_naming_nobody(env) -> None:
    status = _ok(env, env.ws.ws_client_certificate_put, user=MEMBER, user_id=MEMBER, **_upload())
    assert status["present"] is True and env.store.get(MEMBER).present
    assert env.changes == [MEMBER]


@pytest.mark.parametrize(
    "command",
    ["ws_client_certificate_status", "ws_client_certificate_put", "ws_client_certificate_delete"],
)
def test_a_user_who_is_not_an_admin_cannot_name_another_user(env, command) -> None:
    _ok(env, env.ws.ws_client_certificate_put, user=ADMIN, admin=True, **_upload())
    kept = env.store.get(ADMIN)
    code, message = _error(
        env, getattr(env.ws, command), user=MEMBER, user_id=ADMIN, **_upload(make_p12(common_name="x"))
    )
    assert code == "unauthorized" and "administrator" in message
    assert env.store.get(ADMIN) is kept and env.store.get(MEMBER) is None
    assert env.changes == [ADMIN]


@pytest.mark.parametrize("target", ["user-nobody", RETIRED, SUPERVISOR])
@pytest.mark.parametrize(
    "command",
    ["ws_client_certificate_status", "ws_client_certificate_put", "ws_client_certificate_delete"],
)
def test_an_unknown_inactive_or_system_user_is_refused(env, command, target) -> None:
    code, _message = _error(
        env, getattr(env.ws, command), user=ADMIN, admin=True, user_id=target, **_upload()
    )
    assert code == "invalid_user"
    assert env.store.get(target) is None and env.store.get(ADMIN) is None
    assert env.changes == []
