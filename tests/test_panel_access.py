"""In-process tests for who may do what through the panel.

The panel is open to every signed-in user (``complication_panel.py``), and
``panel_access.py`` decides per command. These run the rule itself and a few
commands of each kind against it, as an administrator, as the owner of a
device and as another household member:

* ``may_manage_owner`` and ``require_owner``, directly.
* ``complications/owners`` and ``watch_config/summary``, which answer a
  non-admin about their own devices and the Library only.
* Owner scoped commands (``complications/get``, ``save``, ``subscribe``,
  ``move_owner``, ``devices/forget``, ``watch_config/get``,
  ``watch_voices/get``), refused for another person's device and allowed for
  the caller's own.
* The pairing commands' inner checks: a Replace offer, and another user's
  QR offers.

The modules are loaded the way ``test_complication_ws.py`` and
``test_pairing_ws.py`` load them, with stubbed Home Assistant modules over
the real stores. ``test_ws_command_registration.py`` pins statically which
command is in which group.
"""

from __future__ import annotations

import asyncio
import sys
import types
import uuid
from typing import Any

import pytest

import test_complication_ws as cws
from test_pairing_ws import _call as _pair_call
from test_pairing_ws import _ok as _pair_ok
from test_pairing_ws import pairing_env
from test_widget_secret_user_binding import _User

DOMAIN = cws.DOMAIN
LIBRARY = cws.LIBRARY


def _user(user_id: str, *, is_admin: bool = False) -> Any:
    return types.SimpleNamespace(id=user_id, name=user_id.title(), is_admin=is_admin)


ROOT = _user("root", is_admin=True)
ALICE = _user("alice")
BOB = _user("bob")


class _Connection(cws._LiveConnection):
    def __init__(self, user: Any) -> None:
        super().__init__()
        self.user = user


class _HTTPActions:
    """The two things the summary reads from the HTTP action library."""

    available = True
    revision = 3

    def __init__(self, delivered: dict[str, int]) -> None:
        self._delivered = delivered

    def delivered(self) -> dict[str, int]:
        return dict(self._delivered)


class _Voices:
    def get(self, _watch_id: str) -> None:
        return None

    def forget(self, _watch_id: str) -> None:
        return None


def _document(env) -> dict:
    """A fresh design, not saved anywhere yet."""
    env.base._slot += 1
    return {
        "schemaVersion": 4,
        "id": str(uuid.uuid4()).upper(),
        "name": "Porch",
        "slotIndex": env.base._slot,
        "supportedFamilies": ["rectangular", "circular", "corner"],
        "perFamily": {},
        "elements": [{"kind": "text"}],
        "tapAction": {"type": "refresh"},
    }


@pytest.fixture
def env():
    """Alice's watch and phone, Bob's watch, a watch bound to no one, and a
    watch of Alice's whose recorded phone is Bob's."""
    with cws._loaded_modules() as (ws, store_mod, secrets_mod, watch_config_mod):
        store = store_mod.ComplicationStore(object())
        asyncio.run(store.async_load())
        secrets = secrets_mod.WidgetSecretStore(object())
        coordinator = cws._Coordinator()
        push = cws._Push()
        domain_data = cws._DomainData(store, secrets, coordinator, push, None)
        hass = cws._Hass(domain_data)
        watch_config = watch_config_mod.WatchConfigStore(hass)
        asyncio.run(watch_config.async_load())
        domain_data.watch_config_store = watch_config
        domain_data.watch_voices_store = _Voices()
        base = cws._Env(ws, store, secrets, coordinator, hass, secrets_mod, push)
        base.add_watch("watch-alice", device_name="Alice Watch", user_id="alice")
        base.add_phone("phone-alice", device_name="Alice Phone", user_id="alice")
        base.add_phone("phone-bob", device_name="Bob Phone", user_id="bob")
        base.add_watch("watch-bob", device_name="Bob Watch", user_id="bob")
        base.add_watch("watch-legacy", device_name="Old Watch")
        base.add_watch(
            "watch-alice-2",
            device_name="Alice Spare",
            user_id="alice",
            owner_iphone_id="phone-bob",
        )
        yield types.SimpleNamespace(
            base=base,
            ws=ws,
            wc=cws._load("watch_config_ws"),
            access=sys.modules[f"{cws._PKG}.panel_access"],
            store=store,
            hass=hass,
            watch_config=watch_config,
        )


def _run(env, command, user: Any, **msg) -> _Connection:
    connection = _Connection(user)
    command(env.hass, connection, {"id": 1, **msg})
    return connection


def _refused(connection: _Connection) -> bool:
    return connection.results == {} and [code for _id, code, _m in connection.errors] == [
        "unauthorized"
    ]


def _ok(connection: _Connection) -> Any:
    assert connection.errors == [], connection.errors
    return connection.results[1]


def _save_pages(env, owner: str) -> None:
    env.watch_config.put(
        owner,
        "pages",
        {"pages": [{"id": f"page-{owner}", "name": owner}]},
        document_hash="a" * 64,
        base_revision=0,
        updated_by=owner,
    )


# ── the rule ─────────────────────────────────────────────────────────────


@pytest.mark.parametrize(
    "owner",
    ["watch-alice", "watch-bob", "watch-legacy", "no-such-device", LIBRARY],
)
def test_an_admin_may_manage_any_owner(env, owner) -> None:
    assert env.access.may_manage_owner(env.hass, _Connection(ROOT), owner)


@pytest.mark.parametrize(
    ("owner", "allowed"),
    [
        ("watch-alice", True),
        ("phone-alice", True),
        (LIBRARY, True),
        ("watch-bob", False),
        ("phone-bob", False),
        ("watch-legacy", False),
        ("no-such-device", False),
    ],
)
def test_a_member_may_manage_their_own_devices_and_the_library(env, owner, allowed) -> None:
    assert env.access.may_manage_owner(env.hass, _Connection(ALICE), owner) is allowed


def test_no_user_may_manage_nothing_not_even_the_library(env) -> None:
    for owner in ("watch-alice", LIBRARY):
        assert not env.access.may_manage_owner(env.hass, _Connection(None), owner)


def test_require_owner_sends_unauthorized_and_says_no(env) -> None:
    connection = _Connection(ALICE)
    assert env.access.require_owner(env.hass, connection, {"id": 4}, "watch-alice")
    assert connection.errors == []
    assert not env.access.require_owner(env.hass, connection, {"id": 5}, "watch-bob")
    assert connection.errors == [(5, "unauthorized", "not a device paired to this user")]


def test_require_owner_needs_every_owner_it_is_given(env) -> None:
    connection = _Connection(ALICE)
    assert env.access.require_owner(env.hass, connection, {"id": 1}, LIBRARY, "watch-alice")
    assert not env.access.require_owner(env.hass, connection, {"id": 2}, "watch-alice", "watch-bob")
    assert not env.access.require_owner(env.hass, connection, {"id": 3}, "watch-bob", "watch-alice")


def test_the_live_lines_follow_the_same_rule(env) -> None:
    for check in (env.ws.may_follow_owner, env.wc._may_follow_owner):
        assert check(env.hass, _Connection(ALICE), "watch-alice")
        assert check(env.hass, _Connection(ALICE), LIBRARY)
        assert not check(env.hass, _Connection(ALICE), "watch-bob")
        assert check(env.hass, _Connection(ROOT), "watch-bob")


# ── owners ───────────────────────────────────────────────────────────────


def _owner_ids(env, user: Any) -> list[str]:
    return [row["owner_watch_id"] for row in _ok(_run(env, env.ws.ws_owners, user))["owners"]]


def test_owners_lists_everything_to_an_admin(env) -> None:
    env.base.save_document("watch-gone")
    ids = _owner_ids(env, ROOT)
    assert set(ids) == {
        "watch-alice",
        "watch-alice-2",
        "watch-bob",
        "watch-legacy",
        "phone-alice",
        "phone-bob",
        LIBRARY,
    }


def test_owners_lists_only_a_member_s_own_devices_and_the_library(env) -> None:
    # Watches by name ("Alice Spare" before "Alice Watch"), then phones.
    assert _owner_ids(env, ALICE) == ["watch-alice-2", "watch-alice", "phone-alice", LIBRARY]
    assert _owner_ids(env, BOB) == ["watch-bob", "phone-bob", LIBRARY]


def test_a_member_s_owners_never_names_a_phone_that_is_not_in_it(env) -> None:
    """Alice's spare watch records Bob's phone; to her it names none, so the
    reply never points at a row it leaves out."""
    rows = {
        row["owner_watch_id"]: row for row in _ok(_run(env, env.ws.ws_owners, ALICE))["owners"]
    }
    assert rows["watch-alice-2"]["paired_iphone_id"] is None
    assert rows["watch-alice-2"]["paired_iphone_name"] is None
    assert rows["watch-alice-2"]["user_id"] == "alice"
    admin_rows = {
        row["owner_watch_id"]: row for row in _ok(_run(env, env.ws.ws_owners, ROOT))["owners"]
    }
    assert admin_rows["watch-alice-2"]["paired_iphone_id"] == "phone-bob"


def test_a_member_never_sees_an_orphan_but_its_designs_still_go_to_the_library(env) -> None:
    env.base.save_document("watch-gone")
    assert "watch-gone" not in _owner_ids(env, ALICE)
    # The sweep ran on her call all the same.
    assert len(env.store.list(LIBRARY)) == 1


# ── owner scoped complication commands ───────────────────────────────────


def test_get_refuses_another_person_s_device_and_serves_your_own(env) -> None:
    mine = env.base.save_document("watch-alice")
    theirs = env.base.save_document("watch-bob")
    record = _ok(
        _run(env, env.ws.ws_get, ALICE, owner_watch_id="watch-alice", complication_id=mine["id"])
    )["record"]
    assert record["id"] == mine["id"]
    assert _refused(
        _run(env, env.ws.ws_get, ALICE, owner_watch_id="watch-bob", complication_id=theirs["id"])
    )
    assert _ok(
        _run(env, env.ws.ws_get, ROOT, owner_watch_id="watch-bob", complication_id=theirs["id"])
    )["record"]["id"] == theirs["id"]


def test_a_member_saves_to_their_own_device_and_the_library_and_nowhere_else(env) -> None:
    for owner in ("watch-alice", LIBRARY):
        result = _ok(
            _run(env, env.ws.ws_save, ALICE, owner_watch_id=owner, document=_document(env))
        )
        assert result["ok"] is True
        assert result["record"]["updatedBy"] == "ha-panel:Alice"
    before = env.store.owner_token("watch-bob")
    assert _refused(
        _run(env, env.ws.ws_save, ALICE, owner_watch_id="watch-bob", document=_document(env))
    )
    assert env.store.owner_token("watch-bob") == before
    assert env.store.list("watch-bob") == []


def test_list_and_status_refuse_another_person_s_device(env) -> None:
    for command in (env.ws.ws_list, env.ws.ws_watch_status, env.ws.ws_nudge):
        # `include_deleted` is the list's schema default, which the stubbed
        # schema does not fill in; the other two ignore it.
        assert _refused(
            _run(env, command, ALICE, owner_watch_id="watch-bob", include_deleted=False)
        )
        _ok(_run(env, command, ALICE, owner_watch_id="watch-alice", include_deleted=False))
    assert ("watch-bob", True) not in env.base.coordinator.woken


def test_a_move_needs_both_sides_to_be_the_member_s(env) -> None:
    alice_doc = env.base.save_document("watch-alice")
    bob_doc = env.base.save_document("watch-bob")

    def move(source: str, target: str, user: Any = ALICE) -> _Connection:
        return _run(
            env,
            env.ws.ws_move_owner,
            user,
            source_owner_watch_id=source,
            target_owner_watch_id=target,
        )

    assert _refused(move("watch-alice", "watch-bob"))
    assert _refused(move("watch-bob", "watch-alice"))
    assert [r.id for r in env.store.list("watch-bob")] == [bob_doc["id"]]
    assert [r.id for r in env.store.list("watch-alice")] == [alice_doc["id"]]

    _ok(move("watch-alice", "watch-alice-2"))
    assert [r.id for r in env.store.list("watch-alice-2")] == [alice_doc["id"]]


def test_a_member_moves_the_library_s_designs_onto_their_own_watch(env) -> None:
    doc = env.base.save_document(LIBRARY)
    _ok(
        _run(
            env,
            env.ws.ws_move_owner,
            ALICE,
            source_owner_watch_id=LIBRARY,
            target_owner_watch_id="watch-alice",
        )
    )
    assert [r.id for r in env.store.list("watch-alice")] == [doc["id"]]


def test_a_member_forgets_only_their_own_device(env) -> None:
    assert _refused(_run(env, env.ws.ws_forget_device, ALICE, watch_id="watch-bob", force=True))
    assert env.base.secrets.get("watch-bob") is not None
    _ok(_run(env, env.ws.ws_forget_device, ALICE, watch_id="watch-alice", force=True))
    assert env.base.secrets.get("watch-alice") is None


def test_subscribe_to_another_person_s_device_is_refused(env) -> None:
    connection = _run(env, env.ws.ws_subscribe, ALICE, owner_watch_id="watch-bob")
    assert _refused(connection)
    assert connection.subscriptions == {}


def test_subscribe_with_no_filter_tells_a_member_only_about_their_own(env) -> None:
    mine = _run(env, env.ws.ws_subscribe, ALICE)
    everything = _run(env, env.ws.ws_subscribe, ROOT)
    env.base.save_document("watch-bob")
    env.base.save_document("watch-alice")
    env.base.save_document(LIBRARY)
    heard = [event["event"]["owner_watch_id"] for event in mine.events]
    assert heard == ["watch-alice", LIBRARY]
    assert [event["event"]["owner_watch_id"] for event in everything.events] == [
        "watch-bob",
        "watch-alice",
        LIBRARY,
    ]


# ── watch config ─────────────────────────────────────────────────────────


def _pages_get(env, user: Any, owner: str) -> _Connection:
    return _run(env, env.wc.ws_watch_config_get, user, owner_watch_id=owner, kind="pages")


def test_watch_config_get_refuses_another_person_s_watch(env) -> None:
    _save_pages(env, "watch-alice")
    _save_pages(env, "watch-bob")
    assert _refused(_pages_get(env, ALICE, "watch-bob"))
    mine = _ok(_pages_get(env, ALICE, "watch-alice"))
    assert mine["document"]["pages"][0]["name"] == "watch-alice"
    assert _ok(_pages_get(env, ROOT, "watch-bob"))["revision"] == 1


def test_watch_config_writes_to_another_person_s_watch_are_refused(env) -> None:
    _save_pages(env, "watch-bob")
    assert _refused(
        _run(
            env,
            env.wc.ws_watch_config_save,
            ALICE,
            owner_watch_id="watch-bob",
            kind="pages",
            base_revision=1,
            document={"pages": []},
        )
    )
    assert _refused(
        _run(
            env,
            env.wc.ws_watch_config_restore,
            ALICE,
            owner_watch_id="watch-bob",
            kind="pages",
            revision=1,
            base_revision=1,
        )
    )
    assert env.watch_config.get("watch-bob", "pages").revision == 1


def test_watch_voices_refuse_another_person_s_watch(env) -> None:
    assert _refused(_run(env, env.wc.ws_watch_voices_get, ALICE, watch_id="watch-bob"))
    assert _ok(_run(env, env.wc.ws_watch_voices_get, ALICE, watch_id="watch-alice")) == {
        "voices": [],
        "updated_at": None,
    }


def test_the_summary_tells_a_member_only_about_their_own_watches(env) -> None:
    for owner in ("watch-alice", "watch-bob", "watch-legacy"):
        _save_pages(env, owner)
    env.hass.data[DOMAIN].http_actions_store = _HTTPActions(
        {"watch-alice": 3, "watch-bob": 2, "watch-legacy": 1}
    )
    mine = _ok(_run(env, env.wc.ws_watch_config_summary, ALICE))
    assert set(mine["owners"]) == {"watch-alice"}
    assert mine["http_actions"] == {"revision": 3, "delivered": {"watch-alice": 3}}
    everyone = _ok(_run(env, env.wc.ws_watch_config_summary, ROOT))
    assert set(everyone["owners"]) == {"watch-alice", "watch-bob", "watch-legacy"}
    assert everyone["http_actions"]["delivered"] == {
        "watch-alice": 3,
        "watch-bob": 2,
        "watch-legacy": 1,
    }


# ── pairing: the admin-only parts inside open commands ───────────────────


@pytest.fixture
def pairing():
    with pairing_env() as loaded:
        yield loaded


CHEN = _User("chen")
PAT = _User("pat")


def test_a_member_may_make_an_offer_for_their_own_phone(pairing) -> None:
    result = _pair_ok(pairing, pairing.ws.ws_pair_offer, user=CHEN)
    offer = pairing.offer_store.get(result["offer_id"])
    assert (offer.user_id, offer.admin_id, offer.replace) == ("chen", "chen", False)


def test_only_an_admin_may_make_a_replace_offer(pairing) -> None:
    connection = _pair_call(pairing, pairing.ws.ws_pair_offer, user=CHEN, replace=True)
    [(_id, code, _message)] = connection.errors
    assert code == "unauthorized"
    assert len(pairing.offer_store) == 0


def test_a_member_sees_and_cancels_only_their_own_offers(pairing) -> None:
    offer_id = _pair_ok(pairing, pairing.ws.ws_pair_offer, user=CHEN)["offer_id"]
    # Another member is told nothing and cancels nothing.
    assert _pair_ok(
        pairing, pairing.ws.ws_pair_offer_status, user=PAT, offer_id=offer_id
    ) == {"state": "expired"}
    assert _pair_ok(
        pairing, pairing.ws.ws_pair_offer_cancel, user=PAT, offer_id=offer_id
    ) == {"ok": True, "cancelled": False}
    assert _pair_ok(
        pairing, pairing.ws.ws_pair_offer_status, user=CHEN, offer_id=offer_id
    ) == {"state": "open"}
    # Its maker and an admin see it.
    assert _pair_ok(pairing, pairing.ws.ws_pair_offer_status, offer_id=offer_id) == {
        "state": "open"
    }
    assert _pair_ok(
        pairing, pairing.ws.ws_pair_offer_cancel, user=CHEN, offer_id=offer_id
    ) == {"ok": True, "cancelled": True}


def test_a_member_cannot_see_an_admin_s_offer(pairing) -> None:
    offer_id = _pair_ok(pairing, pairing.ws.ws_pair_offer, user_id="chen")["offer_id"]
    assert _pair_ok(
        pairing, pairing.ws.ws_pair_offer_status, user=CHEN, offer_id=offer_id
    ) == {"state": "expired"}
