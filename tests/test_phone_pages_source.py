"""Whose pages an iPhone draws (``phone_pages_source.py``), with no Home
Assistant: the default pick, the phone's own choice, and what a choice the
phone sends may be.

The module is loaded beside a stubbed ``notifications`` (the package the
notification tests build), so its relative import resolves without the real
package ``__init__``.
"""

from __future__ import annotations

import ast
import contextlib
import importlib.util
import sys
import types
from pathlib import Path
from typing import Any

import pytest
from test_notification_tokens import _PKG, _loaded_notifications

_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"

PHONE = "iphone-1"
OTHER_PHONE = "iphone-2"
WATCH_A = "watch-A"
WATCH_B = "watch-B"
STRANGER = "watch-C"


@contextlib.contextmanager
def loaded_source():
    """``phone_pages_source`` loaded in the notification tests' package."""
    with _loaded_notifications():
        spec = importlib.util.spec_from_file_location(
            f"{_PKG}.phone_pages_source", _PKG_DIR / "phone_pages_source.py"
        )
        module = importlib.util.module_from_spec(spec)
        sys.modules[f"{_PKG}.phone_pages_source"] = module
        spec.loader.exec_module(module)
        yield module


def _device(
    kind: str,
    user_id: str | None = "alice",
    owner: str | None = None,
    name: str | None = None,
    pages_from: str | None = None,
) -> Any:
    return types.SimpleNamespace(
        device_kind=kind,
        user_id=user_id,
        owner_iphone_id=owner,
        device_name=name,
        label=None,
        pages_from=pages_from,
    )


class _Store:
    """The two reads the module makes: one owner's pages record."""

    def __init__(self) -> None:
        self.pages: dict[str, Any] = {}
        self.unreadable: set[str] = set()

    def save(self, owner: str, revision: int, updated_at: str) -> None:
        self.pages[owner] = types.SimpleNamespace(revision=revision, updated_at=updated_at)

    def get(self, owner: str, kind: str) -> Any:
        assert kind == "pages"
        if owner in self.unreadable:
            raise RuntimeError("unreadable")
        return self.pages.get(owner)


@pytest.fixture
def mod():
    with loaded_source() as module:
        yield module


@pytest.fixture
def secrets() -> dict[str, Any]:
    return {
        PHONE: _device("iphone"),
        WATCH_A: _device("watch", name="Jesse's Apple Watch"),
        WATCH_B: _device("watch", name="Spare Watch"),
        STRANGER: _device("watch", user_id="bob"),
    }


def test_a_phone_draws_the_watch_whose_pages_were_saved_last(mod, secrets) -> None:
    store = _Store()
    store.save(WATCH_A, 4, "2026-10-01T10:00:00+00:00")
    store.save(WATCH_B, 1, "2026-10-02T10:00:00+00:00")
    assert mod.pages_owner(secrets, store, PHONE) == WATCH_B


def test_the_watch_this_phone_paired_comes_first(mod, secrets) -> None:
    secrets[WATCH_A].owner_iphone_id = PHONE
    store = _Store()
    store.save(WATCH_A, 4, "2026-10-01T10:00:00+00:00")
    store.save(WATCH_B, 1, "2026-10-02T10:00:00+00:00")
    assert mod.pages_owner(secrets, store, PHONE) == WATCH_A


def test_a_watch_with_no_pages_is_never_drawn(mod, secrets) -> None:
    secrets[WATCH_A].owner_iphone_id = PHONE
    store = _Store()
    store.save(WATCH_B, 1, "2026-10-02T10:00:00+00:00")
    assert mod.pages_owner(secrets, store, PHONE) == WATCH_B


def test_with_no_watch_pages_the_phone_draws_its_own(mod, secrets) -> None:
    store = _Store()
    store.save(PHONE, 2, "2026-10-02T10:00:00+00:00")
    store.save(STRANGER, 9, "2026-10-03T10:00:00+00:00")
    assert mod.pages_owner(secrets, store, PHONE) == PHONE


def test_another_user_s_watch_is_never_drawn(mod, secrets) -> None:
    store = _Store()
    store.save(STRANGER, 9, "2026-10-03T10:00:00+00:00")
    assert mod.pages_owner(secrets, store, PHONE) == PHONE
    assert STRANGER not in mod.follow_candidates(secrets, PHONE)


def test_an_unreadable_watch_is_skipped(mod, secrets) -> None:
    store = _Store()
    store.save(WATCH_A, 4, "2026-10-01T10:00:00+00:00")
    store.save(WATCH_B, 1, "2026-10-02T10:00:00+00:00")
    store.unreadable.add(WATCH_B)
    assert mod.pages_owner(secrets, store, PHONE) == WATCH_A


def test_a_phone_that_chose_its_own_draws_its_own(mod, secrets) -> None:
    secrets[PHONE].pages_from = "own"
    store = _Store()
    store.save(WATCH_A, 4, "2026-10-01T10:00:00+00:00")
    assert mod.pages_owner(secrets, store, PHONE) == PHONE


def test_a_phone_that_picked_a_watch_draws_it(mod, secrets) -> None:
    secrets[PHONE].pages_from = WATCH_A
    store = _Store()
    store.save(WATCH_A, 4, "2026-10-01T10:00:00+00:00")
    store.save(WATCH_B, 1, "2026-10-02T10:00:00+00:00")
    assert mod.pages_owner(secrets, store, PHONE) == WATCH_A


def test_a_picked_watch_that_went_falls_back_to_the_default(mod, secrets) -> None:
    secrets[PHONE].pages_from = WATCH_A
    del secrets[WATCH_A]
    store = _Store()
    store.save(WATCH_B, 1, "2026-10-02T10:00:00+00:00")
    assert mod.pages_owner(secrets, store, PHONE) == WATCH_B


def test_a_watch_and_an_unknown_id_read_their_own(mod, secrets) -> None:
    store = _Store()
    store.save(WATCH_B, 1, "2026-10-02T10:00:00+00:00")
    assert mod.pages_owner(secrets, store, WATCH_A) == WATCH_A
    assert mod.pages_owner(secrets, store, "nobody") == "nobody"


def test_only_the_followed_kinds_read_the_watch(mod, secrets) -> None:
    store = _Store()
    store.save(WATCH_A, 4, "2026-10-01T10:00:00+00:00")
    for kind in ("pages", "status_pages", "menus"):
        assert mod.read_owner(secrets, store, PHONE, kind) == WATCH_A
    for kind in ("behavior", "rooms"):
        assert mod.read_owner(secrets, store, PHONE, kind) == PHONE


def test_the_reply_names_the_choice_the_owner_and_the_watches(mod, secrets) -> None:
    store = _Store()
    store.save(WATCH_A, 4, "2026-10-01T10:00:00+00:00")
    assert mod.source_reply(secrets, store, PHONE) == {
        "choice": "auto",
        "pages_from": WATCH_A,
        "watches": [
            {"id": WATCH_A, "name": "Jesse's Apple Watch", "has_pages": True},
            {"id": WATCH_B, "name": "Spare Watch", "has_pages": False},
        ],
    }


def test_a_watch_with_no_name_is_named_by_its_id(mod, secrets) -> None:
    secrets[WATCH_B].device_name = None
    assert mod.watch_name(secrets, WATCH_B) == "Watch watch-B"


@pytest.mark.parametrize(
    ("raw", "expected"),
    [
        ("auto", (True, None)),
        ("own", (True, "own")),
        (WATCH_A, (True, WATCH_A)),
        (STRANGER, (False, None)),
        ("", (False, None)),
        (None, (False, None)),
        (3, (False, None)),
    ],
)
def test_a_choice_must_be_auto_own_or_one_of_the_phone_s_watches(mod, secrets, raw, expected) -> None:
    assert mod.parse_choice(secrets, PHONE, raw) == expected


def test_the_coordinator_follows_the_same_kinds() -> None:
    """api.py keeps its own copy of FOLLOWED_KINDS, so it imports nothing."""
    tree = ast.parse((_PKG_DIR / "api.py").read_text())
    copy = next(
        node.value
        for node in tree.body
        if isinstance(node, ast.Assign)
        and any(getattr(t, "id", None) == "FOLLOWED_KINDS" for t in node.targets)
    )
    with loaded_source() as module:
        assert set(ast.literal_eval(copy.args[0])) == set(module.FOLLOWED_KINDS)
