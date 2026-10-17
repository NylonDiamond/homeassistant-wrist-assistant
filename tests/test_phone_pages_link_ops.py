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
import types
from pathlib import Path
from typing import Any

import pytest

from device_lookup_loader import paired_device_name
from test_notification_tokens import _loaded_notifications
from test_watch_config_store import _Hass, _loaded_module

_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_MODULE = _PKG_DIR / "wa_v2_views.py"

_NAMES = (
    "_watch_config_refusal",
    "_caller_is_iphone",
    "_not_an_iphone",
    "_owner_has_pages",
    "_op_phone_pages_offer",
    "_op_phone_pages_link_watch",
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
    kind: str, user_id: str | None, device_name: str | None = None, label: str | None = None
) -> Any:
    return types.SimpleNamespace(
        device_kind=kind,
        user_id=user_id,
        owner_iphone_id=None,
        device_name=device_name,
        label=label,
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
    }
    exec(code, namespace)  # noqa: S102
    return namespace


@pytest.fixture
def env():
    with _loaded_module() as store_mod, _loaded_notifications() as notif_mod:
        secrets = _Secrets(
            {
                PHONE: _device("iphone", "user-1"),
                WATCH: _device("watch", "user-1", device_name="Jesse's Apple Watch"),
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
        "watches": [
            {"id": WATCH, "name": "Jesse's Apple Watch", "has_pages": True},
            {"id": OTHER, "name": f"Watch {OTHER[:8]}", "has_pages": False},
        ],
    }


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
    watch = env.store.get(WATCH, "pages").document["pages"]
    assert phone.document["pages"][0]["linkId"] == watch[1]["linkId"]
    assert env.store.get(PHONE, "status_pages").document["statusPages"][0]["id"] == DOORS
    # The phone uses the watch's menus, marked as shared while it does.
    phone_menus = env.store.get(PHONE, "menus").document
    assert {k: v for k, v in phone_menus.items() if k != "linkIds"} == menus
    assert phone_menus["linkIds"] == env.store.get(WATCH, "menus").document["linkIds"]
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
    lights = next(p for p in env.store.get(WATCH, "pages").document["pages"] if p["id"] == LIGHTS)
    assert lights["linkId"] == LIGHTS


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
