"""In-process tests for the two watch config ops, with no Home Assistant.

The same approach as ``test_v2_views_inprocess.py``: the handlers are pulled
out of ``wa_v2_views.py`` by name and run in a namespace of stand-ins, against
a real ``WatchConfigStore`` loaded the way ``test_watch_config_store.py`` loads
it. The fake op context's ``signed_json`` hands back the status and body, so
the wire shapes the app is built against are asserted here exactly:

* get with no record: ``revision: 0``, null ``hash`` and ``updated_at``, no
  document.
* get omits ``document`` when ``since_revision`` is the stored revision.
* put answers ``{"ok": true, "revision": N}``.
* a stale put answers a signed 409 ``{"ok": false, "error": "conflict",
  "revision": N, "hash": "..."}`` and nothing else.
* the owner is always the signing id; nothing a body says can change that.
* (step 2) ``behavior`` rides the same two ops, and every get about a stored
  record marks that revision delivered, with or without the document.
* (step 3) a put is refused for a page fault but never for a tile fault, and
  a get carrying ``unreadable_revision`` equal to the stored revision files
  the report instead of a delivery, with the same reply. A later get whose
  ``since_revision`` is that revision, with no report, clears it.
* (step 3e) ``catalog`` rides the same two ops, with its own shape guard.
* (step 4d) ``menus`` rides the same two ops, with its own shape guard.
* (step 4d batch 2) so do ``voice``, ``notification_style`` and
  ``status_pages``.

The static half (both ops in the dispatch table, the capabilities advertised)
sits at the bottom.
"""

from __future__ import annotations

import __future__
import ast
import asyncio
import types
from pathlib import Path
from typing import Any

import pytest

from test_notification_tokens import _loaded_notifications
from test_watch_config_store import _FakeStore, _Hass, _loaded_module

_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_MODULE = _PKG_DIR / "wa_v2_views.py"

_NAMES = (
    "_watch_config_refusal",
    "_note_main_house",
    "_caller_is_iphone",
    "_phone_style_record",
    "_op_watch_config_get",
    "_op_watch_config_put",
)

WATCH = "watch-A"
OTHER = "watch-B"
HASH_1 = "a" * 64
HASH_2 = "b" * 64


class _Response:
    def __init__(self, status: int, body: Any) -> None:
        self.status = status
        self.body = body


class _Secrets:
    """The widget secret store's calls the get makes, recorded.

    ``entries`` holds the devices the step 6 phone style read looks at; it is
    empty unless a test adds some, so every other get sees no iPhone signer.
    """

    def __init__(self) -> None:
        self.main_house: dict[str, bool] = {}
        self.entries: dict[str, Any] = {}

    def note_main_house(self, watch_id: str, main_house: bool) -> bool:
        changed = self.main_house.get(watch_id, True) != main_house
        self.main_house[watch_id] = main_house
        return changed

    def get(self, watch_id: str) -> Any:
        return self.entries.get(watch_id)

    @property
    def all_entries(self) -> dict[str, Any]:
        return dict(self.entries)


def _device(kind: str, user_id: str | None = None, owner: str | None = None) -> Any:
    return types.SimpleNamespace(device_kind=kind, user_id=user_id, owner_iphone_id=owner)


class _Ctx:
    def __init__(self, store: Any, watch_id: str, payload: dict, secrets: Any = None) -> None:
        self.watch_id = watch_id
        self.payload = payload
        self.domain_data = types.SimpleNamespace(
            watch_config_store=store,
            widget_secret_store=secrets if secrets is not None else _Secrets(),
        )

    def signed_json(self, payload: dict, status: int = 200) -> _Response:
        return _Response(status=status, body=payload)


def _handlers(store_mod: Any, notif_mod: Any = None) -> dict[str, Any]:
    if notif_mod is None:
        with _loaded_notifications() as loaded:
            return _handlers(store_mod, loaded)
    source = _MODULE.read_text()
    tree = ast.parse(source, filename=str(_MODULE))
    wanted = [
        node
        for node in tree.body
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name in _NAMES
    ]
    assert sorted(n.name for n in wanted) == sorted(_NAMES)
    code = compile(
        ast.Module(body=wanted, type_ignores=[]),
        str(_MODULE),
        "exec",
        flags=__future__.annotations.compiler_flag,
        dont_inherit=True,
    )
    namespace: dict[str, Any] = {
        "Any": Any,
        "Response": _Response,
        "WatchConfigConflictError": store_mod.WatchConfigConflictError,
        "WatchConfigStoreError": store_mod.WatchConfigStoreError,
        "WatchConfigUnavailableError": store_mod.WatchConfigUnavailableError,
        "WatchConfigValidationError": store_mod.WatchConfigValidationError,
        "short_hash": store_mod.short_hash,
        "is_iphone_entry": notif_mod.is_iphone_entry,
        "phone_watch_ids": notif_mod.phone_watch_ids,
    }
    exec(code, namespace)  # noqa: S102
    return namespace


@pytest.fixture
def env():
    with _loaded_module() as store_mod, _loaded_notifications() as notif_mod:
        store = store_mod.WatchConfigStore(_Hass())
        asyncio.run(store.async_load())
        yield types.SimpleNamespace(
            store=store,
            mod=store_mod,
            views=_handlers(store_mod, notif_mod),
            secrets=_Secrets(),
        )


def _get(env, payload: dict, watch_id: str = WATCH) -> _Response:
    return asyncio.run(
        env.views["_op_watch_config_get"](_Ctx(env.store, watch_id, payload, env.secrets))
    )


def _put(env, payload: dict, watch_id: str = WATCH) -> _Response:
    return asyncio.run(env.views["_op_watch_config_put"](_Ctx(env.store, watch_id, payload)))


def _doc(name: str = "Home") -> dict:
    return {
        "schemaVersion": 1,
        "pages": [{"id": "6F1C2D0E-0000-4000-8000-000000000001", "name": name, "items": []}],
    }


def _put_body(doc: dict | None = None, *, base: Any = 0, digest: str = HASH_1,
              force: Any = None, kind: Any = "pages") -> dict:
    body: dict[str, Any] = {
        "kind": kind,
        "base_revision": base,
        "hash": digest,
        "document": doc if doc is not None else _doc(),
    }
    if force is not None:
        body["force"] = force
    return body


# ── get ──────────────────────────────────────────────────────────────────


def test_get_with_no_record_is_revision_zero_and_no_document(env) -> None:
    reply = _get(env, {"kind": "pages"})
    assert reply.status == 200
    assert reply.body == {
        "ok": True,
        "kind": "pages",
        "revision": 0,
        "hash": None,
        "short_hash": None,
        "updated_at": None,
    }


def test_get_with_since_revision_zero_and_no_record_still_has_no_document(env) -> None:
    reply = _get(env, {"kind": "pages", "since_revision": 0})
    assert "document" not in reply.body
    assert reply.body["revision"] == 0


def test_put_then_get_round_trips_the_document_hash_and_time(env) -> None:
    doc = _doc("Kitchen")
    reply = _put(env, _put_body(doc))
    assert reply.status == 200
    assert reply.body == {"ok": True, "revision": 1}

    got = _get(env, {"kind": "pages"})
    record = env.store.get(WATCH, "pages")
    assert got.status == 200
    assert got.body == {
        "ok": True,
        "kind": "pages",
        "revision": 1,
        "hash": HASH_1,
        "short_hash": HASH_1[:16],
        "updated_at": record.updated_at,
        "document": doc,
    }
    assert record.updated_by == WATCH


def test_get_omits_the_document_only_when_since_revision_is_current(env) -> None:
    _put(env, _put_body(_doc("v1")))
    _put(env, _put_body(_doc("v2"), base=1, digest=HASH_2))

    current = _get(env, {"kind": "pages", "since_revision": 2})
    assert current.body["revision"] == 2
    assert current.body["hash"] == HASH_2
    assert "document" not in current.body

    behind = _get(env, {"kind": "pages", "since_revision": 1})
    assert behind.body["document"]["pages"][0]["name"] == "v2"

    # A phone ahead of the server (a Home Assistant backup was restored)
    # gets the document too, so it can see what it is about to overwrite.
    ahead = _get(env, {"kind": "pages", "since_revision": 9})
    assert ahead.body["revision"] == 2
    assert "document" in ahead.body


def test_get_never_carries_the_history(env) -> None:
    _put(env, _put_body(_doc("v1")))
    _put(env, _put_body(_doc("v2"), base=1, digest=HASH_2))
    reply = _get(env, {"kind": "pages"})
    assert set(reply.body) == {
        "ok", "kind", "revision", "hash", "short_hash", "updated_at", "document"
    }
    assert "v1" not in repr(reply.body)


@pytest.mark.parametrize("since", [-1, "1", True, 1.5])
def test_get_refuses_a_bad_since_revision(env, since) -> None:
    reply = _get(env, {"kind": "pages", "since_revision": since})
    assert reply.status == 400
    assert reply.body["ok"] is False
    assert reply.body["error"] == "invalid"


@pytest.mark.parametrize("payload", [{}, {"kind": "quick_actions"}, {"kind": 1}])
def test_get_refuses_an_unknown_or_missing_kind(env, payload) -> None:
    reply = _get(env, payload)
    assert reply.status == 400
    assert reply.body["error"] == "invalid"
    assert "kind" in reply.body["message"]


# ── put ──────────────────────────────────────────────────────────────────


def test_put_on_the_stored_revision_is_accepted(env) -> None:
    _put(env, _put_body())
    reply = _put(env, _put_body(_doc("v2"), base=1, digest=HASH_2))
    assert reply.status == 200
    assert reply.body == {"ok": True, "revision": 2}


def test_a_stale_put_is_a_409_with_exactly_the_conflict_shape(env) -> None:
    _put(env, _put_body())
    _put(env, _put_body(_doc("v2"), base=1, digest=HASH_2))

    reply = _put(env, _put_body(_doc("stale"), base=1, digest="c" * 64))
    assert reply.status == 409
    assert reply.body == {"ok": False, "error": "conflict", "revision": 2, "hash": HASH_2}
    assert env.store.get(WATCH, "pages").document["pages"][0]["name"] == "v2"


def test_a_put_based_on_a_record_that_is_gone_conflicts_at_zero(env) -> None:
    reply = _put(env, _put_body(base=5))
    assert reply.status == 409
    assert reply.body == {"ok": False, "error": "conflict", "revision": 0, "hash": None}


def test_a_lost_reply_retry_conflicts_with_the_client_s_own_hash(env) -> None:
    """The upload landed but its reply never arrived. The retry is stale, and
    the 409's hash is the one the client sent, which is how it can tell."""
    _put(env, _put_body(digest=HASH_1))
    reply = _put(env, _put_body(digest=HASH_1))
    assert reply.status == 409
    assert reply.body["hash"] == HASH_1


def test_force_overrides_a_stale_base_and_keeps_the_replaced_copy(env) -> None:
    server_copy = _doc("server")
    _put(env, _put_body(server_copy))
    reply = _put(env, _put_body(_doc("phone"), base=0, digest=HASH_2, force=True))
    assert reply.status == 200
    assert reply.body == {"ok": True, "revision": 2}
    record = env.store.get(WATCH, "pages")
    assert record.history[-1].document == server_copy


def test_force_false_is_the_same_as_no_force(env) -> None:
    _put(env, _put_body())
    assert _put(env, _put_body(base=0, force=False)).status == 409


@pytest.mark.parametrize(
    ("body", "word"),
    [
        (_put_body(kind="quick_actions"), "kind"),
        (_put_body(doc={"pages": {}}), "pages"),
        (_put_body(doc={"tiles": []}), "pages"),
        ({"kind": "pages", "base_revision": 0, "hash": HASH_1}, "object"),
        ({"kind": "pages", "base_revision": 0, "hash": HASH_1, "document": [1]}, "object"),
        (_put_body(digest="A" * 64), "hash"),
        ({"kind": "pages", "base_revision": 0, "document": _doc()}, "hash"),
        ({"kind": "pages", "hash": HASH_1, "document": _doc()}, "base_revision"),
        (_put_body(base=-1), "base_revision"),
        (_put_body(force="yes"), "force"),
    ],
)
def test_a_malformed_put_is_a_signed_400(env, body, word) -> None:
    reply = _put(env, body)
    assert reply.status == 400
    assert reply.body["ok"] is False
    assert reply.body["error"] == "invalid"
    assert word in reply.body["message"]
    assert env.store.get(WATCH, "pages") is None


def test_an_oversized_document_is_a_signed_400(env) -> None:
    doc = {"pages": [], "blob": "x" * (2 * 1024 * 1024)}
    reply = _put(env, _put_body(doc))
    assert reply.status == 400
    assert reply.body["error"] == "invalid"
    assert "limit" in reply.body["message"]
    assert env.store.get(WATCH, "pages") is None


def test_an_unreadable_file_answers_503_for_both_ops(env) -> None:
    _put(env, _put_body())
    _FakeStore.unreadable.add(env.mod._owner_key(WATCH))
    store = env.mod.WatchConfigStore(_Hass())
    asyncio.run(store.async_load())
    env.store = store

    for reply in (_get(env, {"kind": "pages"}), _put(env, _put_body(force=True))):
        assert reply.status == 503
        assert reply.body["ok"] is False
        assert reply.body["error"] == "unavailable"


# ── ownership ────────────────────────────────────────────────────────────


def test_the_owner_is_the_signer_and_a_body_cannot_name_another(env) -> None:
    body = _put_body(_doc("mine"))
    body["owner_watch_id"] = OTHER
    _put(env, body, watch_id=WATCH)

    assert _get(env, {"kind": "pages"}, watch_id=OTHER).body["revision"] == 0
    assert _get(env, {"kind": "pages", "owner_watch_id": WATCH}, watch_id=OTHER).body[
        "revision"
    ] == 0
    assert _get(env, {"kind": "pages"}, watch_id=WATCH).body["revision"] == 1
    assert env.store.get(WATCH, "pages").updated_by == WATCH


def test_two_watches_keep_separate_revisions(env) -> None:
    _put(env, _put_body(_doc("A")), watch_id=WATCH)
    _put(env, _put_body(_doc("A2"), base=1, digest=HASH_2), watch_id=WATCH)
    reply = _put(env, _put_body(_doc("B")), watch_id=OTHER)
    assert reply.body == {"ok": True, "revision": 1}
    assert _get(env, {"kind": "pages"}, watch_id=OTHER).body["document"]["pages"][0]["name"] == "B"


# ── step 2: behavior and delivery ────────────────────────────────────────


def test_behavior_rides_the_same_ops(env) -> None:
    settings = {"longPressDuration": "Short", "wrapPages": True}
    reply = _put(env, _put_body(settings, kind="behavior"))
    assert reply.status == 200
    assert reply.body == {"ok": True, "revision": 1}
    got = _get(env, {"kind": "behavior"})
    assert got.body["document"] == settings
    assert got.body["kind"] == "behavior"
    # The page record is untouched by it.
    assert _get(env, {"kind": "pages"}).body["revision"] == 0


def test_a_get_that_carries_the_document_marks_it_delivered(env) -> None:
    _put(env, _put_body({}, kind="behavior"))
    env.store.panel_save(WATCH, "behavior", {"wrapPages": True}, base_revision=1)
    record = env.store.get(WATCH, "behavior")
    assert (record.revision, record.delivered_revision) == (2, 1)

    reply = _get(env, {"kind": "behavior", "since_revision": 1})
    assert reply.body["document"] == {"wrapPages": True}
    assert record.delivered_revision == 2
    assert record.delivered_at


def test_a_get_that_says_already_there_marks_it_delivered(env) -> None:
    """The phone applied the save but its get reply was the one that got lost,
    or a record moved and the new id has not asked yet: the next "you already
    have it" settles it."""
    _put(env, _put_body({}, kind="behavior"))
    env.store.panel_save(WATCH, "behavior", {"wrapPages": True}, base_revision=1)
    record = env.store.get(WATCH, "behavior")
    record.delivered_revision, record.delivered_at = 0, None

    reply = _get(env, {"kind": "behavior", "since_revision": 2})
    assert "document" not in reply.body
    assert record.delivered_revision == 2


def test_an_up_to_date_get_writes_nothing(env) -> None:
    _put(env, _put_body())
    _FakeStore.writes.clear()
    for _ in range(3):
        _get(env, {"kind": "pages", "since_revision": 1})
    assert _FakeStore.writes == []


def test_a_get_with_no_record_or_a_bad_kind_marks_nothing(env) -> None:
    assert _get(env, {"kind": "behavior"}).body["revision"] == 0
    assert _get(env, {"kind": "nope"}).status == 400
    assert _FakeStore.writes == []


def test_a_signed_put_counts_as_delivered(env) -> None:
    _put(env, _put_body())
    assert env.store.get(WATCH, "pages").delivered_revision == 1


def test_another_owner_s_get_never_delivers_this_one(env) -> None:
    _put(env, _put_body({}, kind="behavior"))
    env.store.panel_save(WATCH, "behavior", {"wrapPages": True}, base_revision=1)
    _get(env, {"kind": "behavior"}, watch_id=OTHER)
    assert env.store.get(WATCH, "behavior").delivered_revision == 1


# ── step 3: the shape guard on a device put ──────────────────────────────


def test_a_put_with_duplicate_item_ids_is_accepted(env) -> None:
    """A device is never refused for a fault in its own tiles."""
    tile = {"id": "T1", "entityId": "light.made_up"}
    doc = {"pages": [{"id": "P1", "items": [tile, dict(tile)]}]}
    reply = _put(env, _put_body(doc))
    assert reply.body == {"ok": True, "revision": 1}
    assert _get(env, {"kind": "pages"}).body["document"] == doc


@pytest.mark.parametrize(
    ("pages", "message"),
    [
        (
            [{"id": "P1"}, {"id": "P1"}],
            'document.pages[1] has the page id "P1" of document.pages[0]; '
            "page ids must be unique",
        ),
        ([{"name": "no id"}], "document.pages[0].id must be a non-empty string"),
        ([3], "document.pages[0] must be an object"),
    ],
)
def test_a_put_with_a_page_fault_is_a_signed_400(env, pages, message) -> None:
    reply = _put(env, _put_body({"pages": pages}))
    assert reply.status == 400
    assert reply.body == {"ok": False, "error": "invalid", "message": message}
    assert env.store.get(WATCH, "pages") is None


# ── step 3: the unreadable report ────────────────────────────────────────


def _panel_saved(env) -> Any:
    """Revision 1 from the phone, revision 2 from the panel, not yet fetched."""
    _put(env, _put_body(_doc("phone")))
    env.store.panel_save(WATCH, "pages", _doc("panel"), base_revision=1)
    return env.store.get(WATCH, "pages")


def test_a_report_about_the_stored_revision_is_kept_and_is_not_a_delivery(env) -> None:
    record = _panel_saved(env)
    plain = _get(env, {"kind": "pages", "since_revision": 1})
    record.delivered_revision, record.delivered_at = 1, None

    reply = _get(env, {"kind": "pages", "since_revision": 1, "unreadable_revision": 2})
    # The reply is the same as without the field.
    assert reply.status == 200
    assert reply.body == plain.body
    assert (record.rejected_revision, record.delivered_revision) == (2, 1)
    assert record.rejected_at
    # A later plain fetch that carries the document delivers it but proves
    # nothing about reading it, so the report stands.
    _get(env, {"kind": "pages", "since_revision": 1})
    assert record.delivered_revision == 2
    assert record.rejected_revision == 2


def test_a_report_keeps_the_watch_s_reason(env) -> None:
    record = _panel_saved(env)
    plain = _get(env, {"kind": "pages", "since_revision": 1})
    reply = _get(
        env,
        {
            "kind": "pages",
            "since_revision": 1,
            "unreadable_revision": 2,
            "reason": "too large for the watch",
        },
    )
    # The reason changes nothing in the reply either.
    assert reply.status == 200
    assert reply.body == plain.body
    assert (record.rejected_revision, record.rejected_reason) == (2, "too large for the watch")
    # A repeat without one keeps it; the watch confirming the revision later
    # clears it with the report.
    _get(env, {"kind": "pages", "since_revision": 2, "unreadable_revision": 2})
    assert record.rejected_reason == "too large for the watch"
    _get(env, {"kind": "pages", "since_revision": 2})
    assert (record.rejected_revision, record.rejected_reason) == (0, None)


@pytest.mark.parametrize("reason", [None, 7, True, ["x"], {"a": 1}, "", "   ", "\n\t"])
def test_a_report_with_no_usable_reason_still_lands(env, reason) -> None:
    record = _panel_saved(env)
    reply = _get(
        env,
        {"kind": "pages", "since_revision": 1, "unreadable_revision": 2, "reason": reason},
    )
    assert reply.status == 200
    assert (record.rejected_revision, record.rejected_reason) == (2, None)


def test_a_reason_without_a_report_is_ignored(env) -> None:
    record = _panel_saved(env)
    _get(env, {"kind": "pages", "since_revision": 1, "reason": "too large for the watch"})
    assert (record.rejected_revision, record.rejected_reason) == (0, None)
    assert record.delivered_revision == 2


def test_asking_from_the_reported_revision_clears_the_report(env) -> None:
    """The watch could not read revision 2, read it later (after an app
    update, say) and now asks from it with no report. That is the watch
    saying it holds revision 2, so the panel must stop saying it could not
    read that save."""
    record = _panel_saved(env)
    _get(env, {"kind": "pages", "since_revision": 1})
    _get(env, {"kind": "pages", "since_revision": 1, "unreadable_revision": 2})
    assert record.rejected_revision == 2

    reply = _get(env, {"kind": "pages", "since_revision": 2})
    assert reply.status == 200
    assert "document" not in reply.body
    assert (record.rejected_revision, record.rejected_at) == (0, None)
    assert record.delivered_revision == 2


def test_the_immediate_report_asking_from_the_revision_is_still_a_report(env) -> None:
    """The watch's own report right after a failure names the revision it
    could not read as its since_revision too. The report wins: it must not
    read as the watch holding that revision."""
    record = _panel_saved(env)
    _get(env, {"kind": "pages", "since_revision": 1})
    _get(env, {"kind": "pages", "since_revision": 2, "unreadable_revision": 2})
    assert record.rejected_revision == 2
    _get(env, {"kind": "pages", "since_revision": 2, "unreadable_revision": 2})
    assert record.rejected_revision == 2


def test_an_observer_asking_from_the_revision_leaves_the_report(env) -> None:
    record = _panel_saved(env)
    _get(env, {"kind": "pages", "since_revision": 1, "unreadable_revision": 2})
    _get(env, {"kind": "pages", "since_revision": 2, "observer": True})
    assert record.rejected_revision == 2


def test_a_report_also_works_on_an_up_to_date_check(env) -> None:
    """The device that could not decode revision 2 still remembers its old
    revision, but may send either since_revision; neither delivers."""
    record = _panel_saved(env)
    record.delivered_revision, record.delivered_at = 1, None
    reply = _get(env, {"kind": "pages", "since_revision": 2, "unreadable_revision": 2})
    assert "document" not in reply.body
    assert (record.rejected_revision, record.delivered_revision) == (2, 1)


@pytest.mark.parametrize("reported", [0, 1, 3])
def test_a_stale_report_is_ignored_and_the_get_delivers_as_usual(env, reported) -> None:
    record = _panel_saved(env)
    reply = _get(env, {"kind": "pages", "since_revision": 1, "unreadable_revision": reported})
    assert reply.status == 200
    assert reply.body["revision"] == 2
    assert (record.rejected_revision, record.rejected_at) == (0, None)
    assert record.delivered_revision == 2


def test_a_report_with_no_record_is_ignored(env) -> None:
    reply = _get(env, {"kind": "pages", "unreadable_revision": 1})
    assert reply.status == 200
    assert reply.body["revision"] == 0
    assert _FakeStore.writes == []


@pytest.mark.parametrize("value", [-1, "2", True, 2.0, [2]])
def test_a_malformed_report_is_a_signed_400(env, value) -> None:
    record = _panel_saved(env)
    reply = _get(env, {"kind": "pages", "unreadable_revision": value})
    assert reply.status == 400
    assert reply.body == {
        "ok": False,
        "error": "invalid",
        "message": "unreadable_revision must be a non-negative integer",
    }
    assert (record.rejected_revision, record.delivered_revision) == (0, 1)


def test_a_null_report_is_the_same_as_none(env) -> None:
    record = _panel_saved(env)
    _get(env, {"kind": "pages", "unreadable_revision": None})
    assert (record.rejected_revision, record.delivered_revision) == (0, 2)


def test_a_report_is_about_the_signer_s_own_record(env) -> None:
    record = _panel_saved(env)
    _put(env, _put_body(_doc("other")), watch_id=OTHER)
    _put(env, _put_body(_doc("other 2"), base=1, digest=HASH_2), watch_id=OTHER)
    _get(env, {"kind": "pages", "unreadable_revision": 2}, watch_id=OTHER)
    assert record.rejected_revision == 0
    assert env.store.get(OTHER, "pages").rejected_revision == 2


def test_a_report_for_behavior(env) -> None:
    _put(env, _put_body({}, kind="behavior"))
    _get(env, {"kind": "behavior", "unreadable_revision": 1})
    record = env.store.get(WATCH, "behavior")
    assert record.rejected_revision == 1
    assert env.store.get(WATCH, "pages") is None


# ── step 3e: the catalog ─────────────────────────────────────────────────


def _catalog(name: str = "Open Gate") -> dict:
    return {
        "httpActions": [{"id": "6F1C2D0E-0000-4000-8000-0000000000A1", "name": name}],
        "macros": [],
        "schemaVersion": 1,
        "statusPages": [{"id": "00000000-0000-0000-0000-000000000001", "name": "Lights"}],
    }


def test_the_catalog_rides_the_same_ops(env) -> None:
    reply = _put(env, _put_body(_catalog(), kind="catalog"))
    assert reply.status == 200
    assert reply.body == {"ok": True, "revision": 1}
    got = _get(env, {"kind": "catalog"})
    assert got.body["kind"] == "catalog"
    assert got.body["document"] == _catalog()
    assert "document" not in _get(env, {"kind": "catalog", "since_revision": 1}).body
    assert env.store.get(WATCH, "catalog").delivered_revision == 1
    # A force upload over a stale base, the phone's only way to publish.
    forced = _put(env, _put_body(_catalog("Gate"), kind="catalog", digest=HASH_2, force=True))
    assert forced.body == {"ok": True, "revision": 2}
    assert _get(env, {"kind": "pages"}).body["revision"] == 0


def test_a_catalog_of_the_wrong_shape_is_a_signed_400(env) -> None:
    doc = {"macros": [{"id": "M1"}]}
    reply = _put(env, _put_body(doc, kind="catalog"))
    assert reply.status == 400
    assert reply.body == {
        "ok": False,
        "error": "invalid",
        "message": "document.macros[0].name must be a string",
    }
    assert env.store.get(WATCH, "catalog") is None


# ── step 4d: the menus ───────────────────────────────────────────────────


def _menus(display_mode: str = "icons") -> dict:
    return {
        "entityRadial": {
            "entityOverrides": {"light.made_up": [{"id": "6F1C2D0E-0000-4000-8000-0000000000C1"}]},
            "lightSlots": [{"id": "6F1C2D0E-0000-4000-8000-0000000000C1"}],
            "schemaVersion": 1,
        },
        "pageSwitcher": {"displayMode": display_mode, "schemaVersion": 1},
        "quickAction": {
            "schemaVersion": 1,
            "slots": [{"id": "6F1C2D0E-0000-4000-8000-0000000000C1", "position": "top"}],
        },
        "schemaVersion": 1,
    }


def test_the_menus_ride_the_same_ops(env) -> None:
    reply = _put(env, _put_body(_menus(), kind="menus"))
    assert reply.status == 200
    assert reply.body == {"ok": True, "revision": 1}
    got = _get(env, {"kind": "menus"})
    assert (got.body["kind"], got.body["revision"], got.body["hash"]) == ("menus", 1, HASH_1)
    assert got.body["document"] == _menus()
    assert "document" not in _get(env, {"kind": "menus", "since_revision": 1}).body
    assert env.store.get(WATCH, "menus").delivered_revision == 1
    again = _put(env, _put_body(_menus("text"), kind="menus", base=1, digest=HASH_2))
    assert again.body == {"ok": True, "revision": 2}


def test_menus_of_the_wrong_shape_are_a_signed_400(env) -> None:
    doc = _menus()
    doc["entityRadial"]["entityOverrides"]["light.made_up"].append({"id": ""})
    reply = _put(env, _put_body(doc, kind="menus"))
    assert reply.status == 400
    assert reply.body == {
        "ok": False,
        "error": "invalid",
        "message": 'document.entityRadial.entityOverrides["light.made_up"][1].id '
        "must be a non-empty string",
    }
    assert env.store.get(WATCH, "menus") is None


# ── step 4d batch 2: voice, notification style, status pages ─────────────


def _batch_2(kind: str, label: str = "Dinner") -> dict:
    return {
        "voice": {
            "defaultSpeakers": ["media_player.made_up_kitchen"],
            "defaultTTSEngine": "tts.made_up_engine",
            "phrases": [{"id": "6F1C2D0E-0000-4000-8000-0000000000D1", "label": label}],
            "schemaVersion": 1,
        },
        "notification_style": {"buttonFill": label, "schemaVersion": 1},
        "status_pages": {
            "schemaVersion": 1,
            "statusPages": [
                {
                    "id": "00000000-0000-0000-0000-000000000001",
                    "name": label,
                    "rows": [{"id": "6F1C2D0E-0000-4000-8000-0000000000E1"}],
                }
            ],
        },
    }[kind]


@pytest.mark.parametrize("kind", ["voice", "notification_style", "status_pages"])
def test_each_batch_2_kind_rides_the_same_ops(env, kind) -> None:
    reply = _put(env, _put_body(_batch_2(kind), kind=kind))
    assert reply.status == 200
    assert reply.body == {"ok": True, "revision": 1}
    got = _get(env, {"kind": kind})
    assert (got.body["kind"], got.body["revision"], got.body["hash"]) == (kind, 1, HASH_1)
    assert got.body["document"] == _batch_2(kind)
    assert "document" not in _get(env, {"kind": kind, "since_revision": 1}).body
    assert env.store.get(WATCH, kind).delivered_revision == 1
    again = _put(env, _put_body(_batch_2(kind, "Supper"), kind=kind, base=1, digest=HASH_2))
    assert again.body == {"ok": True, "revision": 2}
    # The watch reports a revision it could not decode, and keeps what it had.
    _get(env, {"kind": kind, "unreadable_revision": 2})
    assert env.store.get(WATCH, kind).rejected_revision == 2


@pytest.mark.parametrize(
    ("kind", "document", "message"),
    [
        ("voice", {"phrases": [{"id": f"P{i}"} for i in range(9)]},
         "document.phrases holds 9 phrases; the limit is 8"),
        ("notification_style", [], "document must be a JSON object"),
        ("status_pages", {"statusPages": [{"id": "SP1", "name": "A", "rows": [{"id": ""}]}]},
         "document.statusPages[0].rows[0].id must be a non-empty string"),
    ],
)
def test_a_batch_2_kind_of_the_wrong_shape_is_a_signed_400(env, kind, document, message) -> None:
    reply = _put(env, _put_body(document, kind=kind))
    assert reply.status == 400
    assert reply.body == {"ok": False, "error": "invalid", "message": message}
    assert env.store.get(WATCH, kind) is None


# ── step 4d batch 5: the Control Center list ─────────────────────────────


def _control_center(name: str = "Kitchen") -> dict:
    return {
        "schemaVersion": 1,
        "entities": [
            {
                "entityId": "light.made_up_kitchen",
                "displayName": name,
                "iconName": "lightbulb.fill",
                "domain": "light",
            },
            {
                "entityId": "sensor.made_up_temperature",
                "displayName": "Temperature",
                "iconName": "circle.fill",
                "domain": "sensor",
                "isHidden": True,
            },
        ],
    }


def test_the_control_center_list_rides_the_same_ops(env) -> None:
    reply = _put(env, _put_body(_control_center(), kind="control_center"))
    assert reply.status == 200
    assert reply.body == {"ok": True, "revision": 1}
    got = _get(env, {"kind": "control_center"})
    assert (got.body["kind"], got.body["revision"], got.body["hash"]) == (
        "control_center",
        1,
        HASH_1,
    )
    assert got.body["document"] == _control_center()
    assert "document" not in _get(env, {"kind": "control_center", "since_revision": 1}).body
    again = _put(
        env, _put_body(_control_center("Cooking"), kind="control_center", base=1, digest=HASH_2)
    )
    assert again.body == {"ok": True, "revision": 2}
    _get(env, {"kind": "control_center", "unreadable_revision": 2})
    assert env.store.get(WATCH, "control_center").rejected_revision == 2


def test_a_control_center_list_of_the_wrong_shape_is_a_signed_400(env) -> None:
    document = _control_center()
    document["entities"][1]["entityId"] = "light.made_up_kitchen"
    reply = _put(env, _put_body(document, kind="control_center"))
    assert reply.status == 400
    assert reply.body == {
        "ok": False,
        "error": "invalid",
        "message": 'document.entities[1] has the entity id "light.made_up_kitchen" of '
        "document.entities[0]; entity ids must be unique",
    }
    assert env.store.get(WATCH, "control_center") is None


# ── step 8: a second home's rooms ────────────────────────────────────────


def _rooms(source: str = "sensor.made_up_room") -> dict:
    return {
        "schemaVersion": 1,
        "roomQuickJumpSourceEntityId": source,
        "roomQuickJumpMappings": {"kitchen": "P1"},
        "roomAutoSwitchEnabled": True,
    }


def test_the_rooms_ride_the_same_ops(env) -> None:
    reply = _put(env, _put_body(_rooms(), kind="rooms"))
    assert reply.status == 200
    assert reply.body == {"ok": True, "revision": 1}
    got = _get(env, {"kind": "rooms", "main_house": False})
    assert (got.body["kind"], got.body["revision"], got.body["hash"]) == ("rooms", 1, HASH_1)
    assert got.body["document"] == _rooms()
    assert "document" not in _get(env, {"kind": "rooms", "since_revision": 1}).body
    again = _put(env, _put_body(_rooms("sensor.other"), kind="rooms", base=1, digest=HASH_2))
    assert again.body == {"ok": True, "revision": 2}
    _get(env, {"kind": "rooms", "unreadable_revision": 2})
    assert env.store.get(WATCH, "rooms").rejected_revision == 2


def test_rooms_over_their_cap_are_a_signed_400(env) -> None:
    document = {**_rooms(), "pointControlRoomMappingsJSON": "x" * (64 * 1024)}
    reply = _put(env, _put_body(document, kind="rooms"))
    assert reply.status == 400
    assert reply.body["error"] == "invalid"
    assert "the limit for rooms is 65536" in reply.body["message"]
    assert env.store.get(WATCH, "rooms") is None


def test_a_rooms_get_never_makes_the_watch_the_main_house(env) -> None:
    """Only a second home is asked for its rooms; a get without the field
    leaves the mark as it is, as for every kind but behavior."""
    _get(env, {"kind": "rooms", "main_house": False})
    assert env.secrets.main_house == {WATCH: False}
    _get(env, {"kind": "rooms"})
    assert env.secrets.main_house == {WATCH: False}


# ── step 5: the main house ───────────────────────────────────────────────


def test_a_get_saying_main_house_false_marks_the_watch(env) -> None:
    """The reply is the one any get has; only the watch's entry learns."""
    plain = _get(env, {"kind": "pages", "since_revision": 0})
    marked = _get(env, {"kind": "pages", "since_revision": 0, "main_house": False})
    assert marked.status == 200
    assert marked.body == plain.body
    assert env.secrets.main_house == {WATCH: False}


def test_a_behavior_get_without_the_field_is_the_main_house_again(env) -> None:
    _get(env, {"kind": "menus", "main_house": False})
    # Any other kind without the field says nothing: the iPhone's mirror
    # reads a second home's per-home kinds signed as the watch.
    _get(env, {"kind": "pages"})
    assert env.secrets.main_house == {WATCH: False}
    _get(env, {"kind": "behavior"})
    assert env.secrets.main_house == {WATCH: True}


def test_an_old_watch_with_one_home_is_always_the_main_house(env) -> None:
    for kind in ("pages", "behavior", "menus", "notification_style"):
        _get(env, {"kind": kind, "since_revision": 0})
    assert env.secrets.main_house == {WATCH: True}


def test_an_odd_main_house_value_is_ignored_not_refused(env) -> None:
    for value in (True, "false", 0, None):
        reply = _get(env, {"kind": "pages", "main_house": value})
        assert reply.status == 200
    assert env.secrets.main_house == {}


def test_a_refused_get_marks_nothing(env) -> None:
    reply = _get(env, {"kind": "nonsense", "main_house": False})
    assert reply.status != 200
    assert env.secrets.main_house == {}


# ── the iPhone's observer read ───────────────────────────────────────────


def test_an_observer_get_answers_the_same_and_leaves_no_trace(env) -> None:
    """The iPhone reads signed with its watch's key: same reply, but the
    panel must not see the save as collected by the watch, and the watch's
    main house must not move."""
    record = _panel_saved(env)
    assert record.delivered_revision == 1
    plain = _get(env, {"kind": "pages", "since_revision": 1})
    record.delivered_revision, record.delivered_at = 1, None

    seen = _get(env, {"kind": "pages", "since_revision": 1, "observer": True})
    assert seen.status == 200
    assert seen.body == plain.body
    assert seen.body["document"] == _doc("panel")
    assert (record.delivered_revision, record.delivered_at) == (1, None)

    # Already up to date: still no delivery.
    _get(env, {"kind": "pages", "since_revision": 2, "observer": True})
    assert record.delivered_revision == 1


def test_an_observer_get_files_no_report(env) -> None:
    record = _panel_saved(env)
    _get(env, {"kind": "pages", "since_revision": 1, "unreadable_revision": 2,
               "observer": True})
    assert (record.rejected_revision, record.rejected_at) == (0, None)
    assert record.delivered_revision == 1


def test_an_observer_get_never_touches_the_main_house(env) -> None:
    _get(env, {"kind": "behavior", "observer": True})
    _get(env, {"kind": "pages", "main_house": False, "observer": True})
    assert env.secrets.main_house == {}
    _get(env, {"kind": "menus", "main_house": False})
    _get(env, {"kind": "behavior", "observer": True})
    assert env.secrets.main_house == {WATCH: False}


def test_only_observer_true_counts(env) -> None:
    record = _panel_saved(env)
    record.delivered_revision, record.delivered_at = 1, None
    for value in ("true", 1, None, False):
        record.delivered_revision = 1
        _get(env, {"kind": "pages", "since_revision": 1, "observer": value})
        assert record.delivered_revision == 2


# ── step 6: the phone's notification style read ──────────────────────────

PHONE = "iphone-1"
STYLE = "notification_style"


def _style(env, watch_id: str, label: str, updated_at: str) -> None:
    """A style saved for one watch at a given time, not yet delivered."""
    assert _put(env, _put_body(_batch_2(STYLE, label), kind=STYLE), watch_id=watch_id).status == 200
    record = env.store.get(watch_id, STYLE)
    record.updated_at = updated_at
    record.delivered_revision, record.delivered_at = 0, None


@pytest.fixture
def household(env):
    env.secrets.entries.update(
        {
            PHONE: _device("iphone", "user-1"),
            WATCH: _device("watch", "user-1"),
            OTHER: _device("watch", "user-1"),
            "watch-C": _device("watch", "user-2"),
            "iphone-2": _device("iphone", "user-2"),
        }
    )
    _style(env, WATCH, "Older", "2026-10-06T08:00:00Z")
    _style(env, OTHER, "Newer", "2026-10-06T09:00:00Z")
    _style(env, "watch-C", "Someone else", "2026-10-06T10:00:00Z")
    return env


def test_a_phone_reads_the_newest_style_of_its_user_s_watches(household) -> None:
    reply = _get(household, {"kind": STYLE}, watch_id=PHONE)
    assert reply.status == 200
    assert reply.body["document"] == _batch_2(STYLE, "Newer")
    assert (reply.body["revision"], reply.body["hash"]) == (1, HASH_1)
    assert reply.body["updated_at"] == "2026-10-06T09:00:00Z"


def test_the_phone_s_read_marks_nothing_delivered_and_no_house(household) -> None:
    _get(household, {"kind": STYLE}, watch_id=PHONE)
    _get(household, {"kind": STYLE, "since_revision": 1}, watch_id=PHONE)
    for watch_id in (WATCH, OTHER, "watch-C"):
        assert household.store.get(watch_id, STYLE).delivered_revision == 0
    assert household.secrets.main_house == {}


def test_the_phone_s_read_files_no_unreadable_report(household) -> None:
    reply = _get(household, {"kind": STYLE, "unreadable_revision": 1}, watch_id=PHONE)
    assert reply.status == 200
    assert household.store.get(OTHER, STYLE).rejected_revision == 0


def test_the_phone_s_read_leaves_out_the_document_when_up_to_date(household) -> None:
    reply = _get(household, {"kind": STYLE, "since_revision": 1}, watch_id=PHONE)
    assert "document" not in reply.body
    assert reply.body["revision"] == 1


def test_a_tie_on_the_save_time_goes_to_the_higher_revision(household) -> None:
    _put(household, _put_body(_batch_2(STYLE, "Second"), kind=STYLE, base=1, digest=HASH_2))
    household.store.get(WATCH, STYLE).updated_at = "2026-10-06T09:00:00Z"
    reply = _get(household, {"kind": STYLE}, watch_id=PHONE)
    assert reply.body["document"] == _batch_2(STYLE, "Second")


def test_another_kind_from_a_phone_reads_the_phone_s_own_record(household) -> None:
    reply = _get(household, {"kind": "behavior"}, watch_id=PHONE)
    assert reply.body["revision"] == 0
    assert "document" not in reply.body


def test_a_phone_bound_to_no_user_reads_its_own_record(household) -> None:
    household.secrets.entries[PHONE] = _device("iphone", None)
    reply = _get(household, {"kind": STYLE}, watch_id=PHONE)
    assert reply.body["revision"] == 0


def test_a_phone_whose_watches_hold_no_style_reads_its_own_record(env) -> None:
    env.secrets.entries.update(
        {PHONE: _device("iphone", "user-1"), WATCH: _device("watch", "user-1")}
    )
    reply = _get(env, {"kind": STYLE}, watch_id=PHONE)
    assert reply.body == {
        "ok": True,
        "kind": STYLE,
        "revision": 0,
        "hash": None,
        "short_hash": None,
        "updated_at": None,
    }


def test_a_watch_still_reads_its_own_style_and_marks_it_delivered(household) -> None:
    reply = _get(household, {"kind": STYLE}, watch_id=WATCH)
    assert reply.body["document"] == _batch_2(STYLE, "Older")
    assert household.store.get(WATCH, STYLE).delivered_revision == 1


# ── static: dispatch and capability ──────────────────────────────────────


def _op_table() -> dict[str, str]:
    tree = ast.parse(_MODULE.read_text(), filename=str(_MODULE))
    for node in tree.body:
        target = None
        if isinstance(node, ast.AnnAssign) and isinstance(node.target, ast.Name):
            target, value = node.target.id, node.value
        elif isinstance(node, ast.Assign) and isinstance(node.targets[0], ast.Name):
            target, value = node.targets[0].id, node.value
        if target == "_OP_HANDLERS":
            assert isinstance(value, ast.Dict)
            return {
                k.value: v.id
                for k, v in zip(value.keys, value.values, strict=True)
                if isinstance(k, ast.Constant) and isinstance(v, ast.Name)
            }
    raise AssertionError("wa_v2_views.py has no _OP_HANDLERS table")


def test_both_ops_are_in_the_dispatch_table() -> None:
    table = _op_table()
    assert table["watch_config_get"] == "_op_watch_config_get"
    assert table["watch_config_put"] == "_op_watch_config_put"


def test_the_watch_config_capability_is_advertised() -> None:
    """The phone makes no watch_config request without it. Registered
    unconditionally at setup, like the complication capabilities."""
    init = (_PKG_DIR / "__init__.py").read_text()
    const = (_PKG_DIR / "const.py").read_text()
    assert "register_capability(WATCH_CONFIG_CAPABILITY)" in init
    assert 'WATCH_CONFIG_CAPABILITY = "watch_config"' in const


def test_the_reject_report_capability_is_advertised() -> None:
    """A device sends ``unreadable_revision`` only when it sees this."""
    init = (_PKG_DIR / "__init__.py").read_text()
    const = (_PKG_DIR / "const.py").read_text()
    assert "register_capability(WATCH_CONFIG_REJECT_REPORT_CAPABILITY)" in init
    assert 'WATCH_CONFIG_REJECT_REPORT_CAPABILITY = "watch_config_reject_report"' in const


def test_the_catalog_capability_is_advertised() -> None:
    """The phone publishes its catalog only when it sees this."""
    init = (_PKG_DIR / "__init__.py").read_text()
    const = (_PKG_DIR / "const.py").read_text()
    assert "register_capability(WATCH_CONFIG_CATALOG_CAPABILITY)" in init
    assert 'WATCH_CONFIG_CATALOG_CAPABILITY = "watch_config_catalog"' in const


def test_the_menus_capability_is_advertised() -> None:
    """The phone mirrors its menus, and the watch pulls them, only when it
    sees this."""
    init = (_PKG_DIR / "__init__.py").read_text()
    const = (_PKG_DIR / "const.py").read_text()
    assert "register_capability(WATCH_CONFIG_MENUS_CAPABILITY)" in init
    assert 'WATCH_CONFIG_MENUS_CAPABILITY = "watch_config_menus"' in const


@pytest.mark.parametrize(
    ("name", "value"),
    [
        ("WATCH_CONFIG_VOICE_CAPABILITY", "watch_config_voice"),
        ("WATCH_CONFIG_NOTIFICATION_STYLE_CAPABILITY", "watch_config_notification_style"),
        ("WATCH_CONFIG_STATUS_PAGES_CAPABILITY", "watch_config_status_pages"),
        ("WATCH_CONFIG_CONTROL_CENTER_CAPABILITY", "watch_config_control_center"),
        ("WATCH_CONFIG_ROOMS_CAPABILITY", "watch_config_rooms"),
    ],
)
def test_each_batch_2_capability_is_advertised(name, value) -> None:
    """The phone mirrors a batch 2 kind, and the watch pulls it, only when it
    sees that kind's capability."""
    init = (_PKG_DIR / "__init__.py").read_text()
    const = (_PKG_DIR / "const.py").read_text()
    assert f"register_capability({name})" in init
    assert f'{name} = "{value}"' in const


def test_setup_hands_the_store_its_pairing_check() -> None:
    """The panel's create path asks the secret store whether the owner is a
    paired watch. A setup that forgot to pass the check would build a store
    on which the panel can never create a record, and one that asked only
    whether the id is paired would let it make one under an iPhone."""
    init = (_PKG_DIR / "__init__.py").read_text()
    assert "is_paired=widget_secret_store.is_paired_watch," in init
