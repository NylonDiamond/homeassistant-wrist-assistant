"""In-process tests for the iPhone's two linked pages ops,
``phone_pages_offer`` and ``phone_pages_link_watch``.

The same approach as ``test_watch_config_ops_inprocess.py``: the handlers are
pulled out of ``wa_v2_views.py`` by name and run in a namespace of stand-ins,
against a real ``WatchConfigStore`` whose pairing checks know the devices
below. The wire shapes the app is built against are asserted whole. The
static half (both ops in the dispatch table, the capability advertised) sits
at the bottom.
"""

from __future__ import annotations

import __future__
import ast
import asyncio
import copy
import types
from pathlib import Path
from typing import Any

import pytest

from device_lookup_loader import paired_device_name
from platform_names import PLATFORM_HELPERS, platform_namespace
from test_notification_tokens import _loaded_notifications
from test_watch_config_store import _Hass, _loaded_module

_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_MODULE = _PKG_DIR / "wa_v2_views.py"

_NAMES = (
    "_watch_config_refusal",
    "_caller_is_iphone",
    "_not_an_iphone",
    "_owner_has_pages",
    "_owner_shown_page_count",
    "_home_name",
    "_op_phone_pages_offer",
    "_op_phone_pages_link_watch",
    *PLATFORM_HELPERS,
)

PHONE = "iphone:1"
WATCH = "watch-A"
OTHER = "watch-B"
STRANGER = "watch-C"
HOME = "AAAAAAAA-0000-4000-8000-000000000001"
LIGHTS = "AAAAAAAA-0000-4000-8000-000000000002"
SYSTEM = "AAAAAAAA-0000-4000-8000-0000000000FF"
DOORS = "BBBBBBBB-0000-4000-8000-000000000001"


class _Response:
    def __init__(self, status: int, body: Any) -> None:
        self.status = status
        self.body = body


def _device(
    kind: str,
    user_id: str | None,
    device_name: str | None = None,
    label: str | None = None,
    app_version: str | None = None,
    app_build: str | None = None,
) -> Any:
    return types.SimpleNamespace(
        device_kind=kind,
        user_id=user_id,
        owner_iphone_id=None,
        device_name=device_name,
        label=label,
        app_version=app_version,
        app_build=app_build,
    )


class _DeviceRegistry:
    """Device pages by watch id; a test renames one by adding it here."""

    def __init__(self) -> None:
        self.names: dict[str, tuple[str | None, str | None]] = {}

    def async_get_device(self, identifiers):
        for domain, identifier in identifiers:
            if domain == "wrist_assistant" and identifier.startswith("watch_"):
                names = self.names.get(identifier.removeprefix("watch_"))
                if names is not None:
                    return types.SimpleNamespace(name_by_user=names[0], name=names[1])
        return None


class _Secrets:
    def __init__(self, entries: dict[str, Any]) -> None:
        self.entries = entries

    def get(self, watch_id: str) -> Any:
        return self.entries.get(watch_id)

    @property
    def all_entries(self) -> dict[str, Any]:
        return dict(self.entries)


class _Ctx:
    def __init__(self, store: Any, secrets: Any, watch_id: str, payload: dict) -> None:
        self.hass = None
        self.watch_id = watch_id
        self.payload = payload
        self.domain_data = types.SimpleNamespace(
            watch_config_store=store, widget_secret_store=secrets
        )

    def signed_json(self, payload: dict, status: int = 200) -> _Response:
        return _Response(status=status, body=payload)


def _handlers(store_mod: Any, notif_mod: Any, registry: _DeviceRegistry) -> dict[str, Any]:
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
        "WatchConfigLinkError": store_mod.WatchConfigLinkError,
        "WatchConfigStoreError": store_mod.WatchConfigStoreError,
        "WatchConfigUnavailableError": store_mod.WatchConfigUnavailableError,
        "listed_page_ids": store_mod.listed_page_ids,
        "is_iphone_entry": notif_mod.is_iphone_entry,
        "phone_watch_ids": notif_mod.phone_watch_ids,
        "dr": types.SimpleNamespace(async_get=lambda _hass: registry),
        "paired_device_name": paired_device_name,
        **platform_namespace(),
    }
    exec(code, namespace)  # noqa: S102
    return namespace


@pytest.fixture
def env():
    with _loaded_module() as store_mod, _loaded_notifications() as notif_mod:
        secrets = _Secrets(
            {
                PHONE: _device("iphone", "user-1"),
                WATCH: _device(
                    "watch",
                    "user-1",
                    device_name="Jesse's Apple Watch",
                    app_version="3.1.0",
                    app_build="4",
                ),
                OTHER: _device("watch", "user-1", label="watch-code-pair"),
                STRANGER: _device("watch", "user-2"),
            }
        )
        store = store_mod.WatchConfigStore(
            _Hass(),
            is_paired=lambda owner: owner in {WATCH, OTHER, STRANGER},
            is_iphone=lambda owner: owner == PHONE,
        )
        asyncio.run(store.async_load())
        store.panel_save(
            WATCH,
            "pages",
            {
                "schemaVersion": 1,
                "pages": [
                    {"id": SYSTEM, "name": "Settings", "isSystemPage": True, "items": []},
                    {"id": HOME, "name": "Home", "items": []},
                    {"id": LIGHTS, "name": "Lights", "isHidden": True, "items": []},
                ],
            },
            base_revision=0,
        )
        store.panel_save(
            WATCH,
            "status_pages",
            {"schemaVersion": 1, "statusPages": [{"id": DOORS, "name": "Doors", "rows": []}]},
            base_revision=0,
        )
        store.panel_save(
            OTHER,
            "pages",
            {"schemaVersion": 1, "pages": [{"id": SYSTEM, "name": "S", "isSystemPage": True}]},
            base_revision=0,
        )
        registry = _DeviceRegistry()
        yield types.SimpleNamespace(
            store=store,
            secrets=secrets,
            registry=registry,
            views=_handlers(store_mod, notif_mod, registry),
        )


def _op(env, name: str, payload: dict, signer: str = PHONE) -> _Response:
    return asyncio.run(env.views[name](_Ctx(env.store, env.secrets, signer, payload)))


# ── phone_pages_offer ────────────────────────────────────────────────────


def test_offer_lists_the_user_s_watches_with_names_and_pages(env) -> None:
    reply = _op(env, "_op_phone_pages_offer", {})
    assert reply.status == 200
    assert reply.body == {
        "ok": True,
        "has_pages": False,
        "home_name": None,
        "watches": [
            {
                "id": WATCH,
                "name": "Jesse's Apple Watch",
                "has_pages": True,
                "last_seen_seconds": None,
                "app_version": "3.1.0",
                "app_build": "4",
                # Home shows; Lights is hidden and Settings is a system page.
                "shown_pages": 1,
                "platform": "watchos",
            },
            {
                "id": OTHER,
                "name": f"Watch {OTHER[:8]}",
                "has_pages": False,
                "last_seen_seconds": None,
                "app_version": None,
                "app_build": None,
                "shown_pages": 0,
                "platform": "watchos",
            },
        ],
    }


@pytest.mark.parametrize(
    ("location_name", "expected"),
    [("Skelton Home", "Skelton Home"), ("  Cabin \n", "Cabin"), ("", None), ("   ", None), (None, None), (7, None)],
)
def test_offer_gives_the_home_s_own_name(env, location_name, expected) -> None:
    """The iPhone's Settings names the home by what Home Assistant calls itself."""
    ctx = _Ctx(env.store, env.secrets, PHONE, {})
    ctx.hass = types.SimpleNamespace(config=types.SimpleNamespace(location_name=location_name))
    reply = asyncio.run(env.views["_op_phone_pages_offer"](ctx))
    assert reply.body["home_name"] == expected


def test_offer_names_a_wear_watch_by_its_platform(env) -> None:
    """An Android phone's offer tells a Wear OS watch from an Apple Watch."""
    env.secrets.entries[OTHER].platform = "wearos"
    rows = {w["id"]: w["platform"] for w in _op(env, "_op_phone_pages_offer", {}).body["watches"]}
    assert rows == {WATCH: "watchos", OTHER: "wearos"}


def test_a_wear_watch_is_refused_in_a_phone_s_words(env) -> None:
    """The refusal's words name an Android phone to an Android device; an
    Apple Watch keeps the iPhone words it always had."""
    apple = _op(env, "_op_phone_pages_offer", {}, signer=WATCH)
    assert apple.status == 403
    assert apple.body["message"] == "Only an iPhone takes a watch's pages."
    env.secrets.entries[WATCH].platform = "wearos"
    wear = _op(env, "_op_phone_pages_offer", {}, signer=WATCH)
    assert wear.body == {"ok": False, "error": "not_an_iphone", "message": "Only a phone takes a watch's pages."}


def test_an_android_phone_reads_phone_words_for_a_watch_it_cannot_link(env) -> None:
    env.secrets.entries[PHONE].platform = "android"
    reply = _op(env, "_op_phone_pages_link_watch", {"watch_id": STRANGER})
    assert reply.status == 400
    assert reply.body["message"] == "watch_id must be one of this phone's watches"


def test_offer_never_names_a_watch_by_how_it_paired(env) -> None:
    """OTHER paired by code: its label is ``watch-code-pair``, not a name."""
    names = [w["name"] for w in _op(env, "_op_phone_pages_offer", {}).body["watches"]]
    assert "watch-code-pair" not in names
    assert names[1] == f"Watch {OTHER[:8]}"


def test_offer_names_a_watch_as_renamed_on_its_device_page(env) -> None:
    env.registry.names[WATCH] = ("Kitchen watch", "Jesse's Apple Watch")
    env.registry.names[OTHER] = (None, "Apple Watch Ultra")
    names = [w["name"] for w in _op(env, "_op_phone_pages_offer", {}).body["watches"]]
    assert names == ["Kitchen watch", "Apple Watch Ultra"]


def test_offer_says_when_the_phone_has_pages_of_its_own(env) -> None:
    env.store.panel_save(
        PHONE, "pages", {"schemaVersion": 1, "pages": [{"id": "P1", "name": "Mine", "items": []}]},
        base_revision=0,
    )
    assert _op(env, "_op_phone_pages_offer", {}).body["has_pages"] is True


@pytest.mark.parametrize("name", ["_op_phone_pages_offer", "_op_phone_pages_link_watch"])
def test_a_watch_is_refused(env, name) -> None:
    reply = _op(env, name, {"watch_id": WATCH}, signer=WATCH)
    assert reply.status == 403
    assert reply.body["error"] == "not_an_iphone"
    assert reply.body["ok"] is False


# ── phone_pages_link_watch ───────────────────────────────────────────────


def test_link_watch_links_every_page_and_status_page(env) -> None:
    menus = {"quickAction": {"slots": []}, "entityRadial": {}, "pageSwitcher": {}}
    env.store.panel_save(WATCH, "menus", menus, base_revision=0)
    reply = _op(env, "_op_phone_pages_link_watch", {"watch_id": WATCH})
    assert (reply.status, reply.body) == (200, {"ok": True, "pages": 2})
    phone = env.store.get(PHONE, "pages")
    assert [p["id"] for p in phone.document["pages"]] == [HOME, LIGHTS]
    assert phone.document["pages"][1]["isHidden"] is True
    assert phone.updated_by == PHONE
    assert all("linkId" not in p for p in phone.document["pages"])
    picks = env.store.library_summary()["picks"]
    assert [p["id"] for p in picks[PHONE]["pages"]] == [HOME, LIGHTS], "the same library pages"
    assert env.store.get(PHONE, "status_pages").document["statusPages"][0]["id"] == DOORS
    # The phone uses the watch's menus: the same library menus, no marks.
    assert env.store.get(PHONE, "menus").document == menus
    assert picks[PHONE]["menus"] == picks[WATCH]["menus"]
    assert env.store.get(PHONE, "rooms") is None, "the watch has no rooms to copy"


@pytest.mark.parametrize("watch_id", [STRANGER, "nobody", None, 7])
def test_link_watch_refuses_a_watch_that_is_not_the_phone_s(env, watch_id) -> None:
    reply = _op(env, "_op_phone_pages_link_watch", {"watch_id": watch_id})
    assert reply.status == 400
    assert reply.body["error"] == "invalid_watch"
    assert env.store.get(PHONE, "pages") is None


def test_link_watch_beside_a_phone_page_under_the_same_id(env) -> None:
    """The phone's own page under one of the watch's ids, with other
    content, got an id of its own when it arrived: the link no longer
    answers id_taken, it puts the watch's pages beside it."""
    env.store.panel_save(
        PHONE, "pages", {"schemaVersion": 1, "pages": [{"id": LIGHTS, "name": "Mine", "items": []}]},
        base_revision=0,
    )
    reply = _op(env, "_op_phone_pages_link_watch", {"watch_id": WATCH})
    assert (reply.status, reply.body) == (200, {"ok": True, "pages": 2})
    names = [p["name"] for p in env.store.get(PHONE, "pages").document["pages"]]
    assert names == ["Mine", "Home", "Lights"]
    owners = env.store.library_summary()["pages"][LIGHTS]["owners"]
    assert owners == sorted([PHONE, WATCH])


def test_a_first_link_is_on_disk_before_the_reply_and_a_later_one_keeps_the_debounce(env) -> None:
    written: list[str] = []
    real = env.store.async_save_first_record

    async def spy(owner: str) -> bool:
        written.append(owner)
        return await real(owner)

    env.store.async_save_first_record = spy
    reply = _op(env, "_op_phone_pages_link_watch", {"watch_id": WATCH})
    assert (reply.status, reply.body) == (200, {"ok": True, "pages": 2})
    assert written == [PHONE]
    assert PHONE not in env.store._pending_owners
    assert env.store._library_save_pending is False

    again = _op(env, "_op_phone_pages_link_watch", {"watch_id": WATCH})
    assert again.status == 200
    assert written == [PHONE]


def test_a_first_link_write_that_raised_is_a_signed_503_and_is_tried_again(env) -> None:
    async def boom(_owner: str) -> None:
        raise OSError("disk full")

    env.store.async_save_first_record = boom
    reply = _op(env, "_op_phone_pages_link_watch", {"watch_id": WATCH})
    assert reply.status == 503
    assert PHONE in env.store._pending_owners
    assert env.store._library_save_pending is True


def test_a_slow_first_link_write_is_a_signed_503_and_is_tried_again(env, monkeypatch) -> None:
    """The phone takes a 200 as its choice made and never offers the link
    again, so a link not yet on disk is answered as one to ask again."""
    async def slow(_owner: str) -> None:
        await asyncio.sleep(30)

    monkeypatch.setitem(type(env.store).async_save_before_reply.__globals__, "_SAVE_BEFORE_REPLY_SECONDS", 0.01)
    env.store.async_save_first_record = slow
    reply = _op(env, "_op_phone_pages_link_watch", {"watch_id": WATCH})
    assert reply.status == 503
    assert reply.body["error"] == "unavailable"
    assert PHONE in env.store._pending_owners


def test_a_first_link_the_disk_refused_is_a_signed_503_not_a_link(env) -> None:
    """Home Assistant logs a write it could not make and returns. The phone
    takes a 200 as its choice made, so the refusal must reach it."""
    async def refused(_owner: str) -> bool:
        return False

    env.store.async_save_first_record = refused
    reply = _op(env, "_op_phone_pages_link_watch", {"watch_id": WATCH})
    assert reply.status == 503
    assert reply.body["error"] == "unavailable"


def test_every_link_is_a_signed_503_until_the_phone_s_record_is_on_disk(env) -> None:
    """The retry finds the first attempt's record in memory and is no longer
    a first link: it must still wait for the disk, or a restart leaves the
    phone with no pages and a choice it never makes again."""
    phone_file = env.store._file(PHONE)
    disk = {"full": True, "writes": 0}

    async def async_save(_data: Any) -> None:
        disk["writes"] += 1
        phone_file.write_failed = disk["full"]

    phone_file.async_save = async_save
    phone_file.async_delay_save = lambda *_a, **_k: None
    assert _op(env, "_op_phone_pages_link_watch", {"watch_id": WATCH}).status == 503
    assert _op(env, "_op_phone_pages_link_watch", {"watch_id": WATCH}).status == 503
    assert disk["writes"] >= 2, "the retry wrote the file again"
    disk["full"] = False
    reply = _op(env, "_op_phone_pages_link_watch", {"watch_id": WATCH})
    assert reply.status == 200
    assert PHONE not in env.store._unconfirmed
    # Landed: later links write nothing more at once.
    writes = disk["writes"]
    assert _op(env, "_op_phone_pages_link_watch", {"watch_id": WATCH}).status == 200
    assert disk["writes"] == writes


def test_a_phone_whose_first_link_the_disk_refused_is_offered_the_watch_again(env) -> None:
    """Its pages are in memory only, so the offer says it has none: the phone
    keeps the question and its error line, not "No pages yet"."""
    phone_file = env.store._file(PHONE)

    async def refused(_data: Any) -> None:
        phone_file.write_failed = True

    phone_file.async_save = refused
    phone_file.async_delay_save = lambda *_a, **_k: None
    assert _op(env, "_op_phone_pages_link_watch", {"watch_id": WATCH}).status == 503
    offer = _op(env, "_op_phone_pages_offer", {}).body
    assert offer["has_pages"] is False
    assert any(w["id"] == WATCH and w["has_pages"] for w in offer["watches"])


def test_a_link_retried_after_a_slow_first_write_waits_for_the_disk(env, monkeypatch) -> None:
    """A first write that outlasted the wait is still unconfirmed: the retry
    writes the file itself before it answers linked."""
    async def slow(_owner: str) -> None:
        await asyncio.sleep(30)

    monkeypatch.setitem(type(env.store).async_save_before_reply.__globals__, "_SAVE_BEFORE_REPLY_SECONDS", 0.01)
    real = env.store.async_save_first_record
    env.store.async_save_first_record = slow
    assert _op(env, "_op_phone_pages_link_watch", {"watch_id": WATCH}).status == 503
    env.store.async_save_first_record = real
    phone_file = env.store._file(PHONE)
    written: list[Any] = []

    async def async_save(data: Any) -> None:
        written.append(data)

    phone_file.async_save = async_save
    reply = _op(env, "_op_phone_pages_link_watch", {"watch_id": WATCH})
    assert reply.status == 200
    assert written, "the retry wrote the phone's file before answering"


def test_a_watch_record_the_disk_refused_is_not_linked(env) -> None:
    """While the watch's own file cannot be written, its pages live in memory
    only: a link would copy them onto the phone's record, and a restart would
    leave the phone with pages the watch lost."""
    watch_file = env.store._file(WATCH)

    async def refused(_data: Any) -> None:
        watch_file.write_failed = True

    watch_file.write_failed = True
    watch_file.async_save = refused
    reply = _op(env, "_op_phone_pages_link_watch", {"watch_id": WATCH})
    assert reply.status == 503
    assert reply.body["error"] == "unavailable"
    assert env.store.get(PHONE, "pages") is None


def test_a_watch_record_the_disk_refused_offers_no_pages(env) -> None:
    """The phone then says the move is still running, not a link error."""
    env.store._file(WATCH).write_failed = True
    row = next(w for w in _op(env, "_op_phone_pages_offer", {}).body["watches"] if w["id"] == WATCH)
    assert row["has_pages"] is False
    assert row["shown_pages"] == 0
    env.store._file(WATCH).write_failed = False
    row = next(w for w in _op(env, "_op_phone_pages_offer", {}).body["watches"] if w["id"] == WATCH)
    assert row["has_pages"] is True


def _hide_every_page(env) -> None:
    record = env.store.get(WATCH, "pages")
    document = copy.deepcopy(record.document)
    for page in document["pages"]:
        page["isHidden"] = True
    env.store.panel_save(WATCH, "pages", document, base_revision=record.revision)


def test_a_watch_that_shows_no_page_is_not_linked(env) -> None:
    """Every page hidden: a link would leave the phone with nothing to show,
    taken as its choice made."""
    _hide_every_page(env)
    reply = _op(env, "_op_phone_pages_link_watch", {"watch_id": WATCH})
    assert reply.status == 400
    assert reply.body["error"] == "no_pages"
    assert env.store.get(PHONE, "pages") is None


def test_a_watch_whose_pages_went_since_the_offer_is_not_linked(env) -> None:
    record = env.store.get(WATCH, "pages")
    env.store.panel_save(
        WATCH, "pages", {"schemaVersion": 1, "pages": []}, base_revision=record.revision
    )
    reply = _op(env, "_op_phone_pages_link_watch", {"watch_id": WATCH})
    assert reply.status == 400
    assert reply.body["error"] == "no_pages"
    assert env.store.get(PHONE, "pages") is None


# ── static: dispatch table, capability ───────────────────────────────────


def test_both_ops_are_in_the_dispatch_table() -> None:
    from test_watch_config_ops_inprocess import _op_table

    table = _op_table()
    assert table["phone_pages_offer"] == "_op_phone_pages_offer"
    assert table["phone_pages_link_watch"] == "_op_phone_pages_link_watch"
    assert "phone_pages_source_get" not in table
    assert "phone_pages_source_set" not in table


def test_the_link_capability_is_advertised_and_follow_is_gone() -> None:
    init = (_PKG_DIR / "__init__.py").read_text()
    const = (_PKG_DIR / "const.py").read_text()
    assert "register_capability(PHONE_PAGES_LINK_CAPABILITY)" in init
    assert 'PHONE_PAGES_LINK_CAPABILITY = "phone_pages_link"' in const
    assert "phone_pages_follow" not in const
    assert not (_PKG_DIR / "phone_pages_source.py").exists()
