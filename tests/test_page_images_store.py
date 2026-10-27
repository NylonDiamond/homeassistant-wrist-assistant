"""Unit tests for ``PageImagesStore``, the home's page background photos.

In-process with stubbed Home Assistant modules, the way
``test_http_actions_store.py`` loads its store: the package is a stand-in
holding the real ``const.py``, ``page_images.py`` and ``watch_config_store.py``,
the index ``Store`` keeps its payload in memory, and the photo files are
real files under the test's temporary folder.

Covered: upload (a new upper case UUID, the file and the entry, the sha256
dedupe and its fresh grace), put (stored, exists for a stored id and for a
built-in id, first write wins), the caps and refusals, reads of custom and
built-in photos, the list and its order, delete and its refusals, the sweep
(mark, clear, delete after seven days, nothing on unread pages) driven by real
pages writes of every kind (device put, panel save, restore, forget, move),
photos kept while a history revision names them and swept after the grace
once it is pushed out, the start of day sweep of missing and stray files, an unreadable index never
saved over, unload and removal.

Photo tiles: PNG files beside JPEGs, each photo's format, kind, label and
entity id (an index entry from before reads as a JPEG background), the dedupe
rule for a kind, a tile's ``iconPhotoId`` counted as a use for ``used_by``,
delete and the sweep, history revisions naming a tile photo, and the thirty
day grace of an icon photo.
"""

from __future__ import annotations

import asyncio
import base64
import contextlib
import importlib.util
import json
import sys
import types
from datetime import UTC, datetime, timedelta
from pathlib import Path
from typing import Any

import pytest
from test_http_actions_store import FakeStore
from test_page_images import UUID_UPPER, jpeg, png

_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_PKG = "wa_page_images_test_pkg"
KEY = "wrist_assistant.page_images"
FOLDER = "wrist_assistant_page_images"
OTHER_UUID = "11111111-2222-4333-8444-555555555555"
HASH = "a" * 64


class FakeHass:
    """A config path under the test's folder, an executor that runs at once,
    and tasks run to the end before the call returns (or on the running
    loop, when there is one)."""

    def __init__(self, root: Path) -> None:
        self.config = types.SimpleNamespace(path=lambda *parts: str(root.joinpath(*parts)))
        self.tasks: list[Any] = []

    async def async_add_executor_job(self, fn, *args):
        return fn(*args)

    def async_create_task(self, coro, name: str | None = None, **_kwargs: object):
        self.tasks.append(name)
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            return asyncio.run(coro)
        return loop.create_task(coro)


def _stub(name: str, **attrs: object) -> None:
    module = sys.modules.get(name) or types.ModuleType(name)
    for key, value in attrs.items():
        setattr(module, key, value)
    sys.modules[name] = module


def _load_into_pkg(name: str):
    spec = importlib.util.spec_from_file_location(f"{_PKG}.{name}", _PKG_DIR / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    sys.modules[f"{_PKG}.{name}"] = module
    spec.loader.exec_module(module)
    return module


@contextlib.contextmanager
def loaded_package():
    """The package with ``const``, the rules, the store and the watch config
    store loaded over stubbed Home Assistant modules. Dropped after."""
    saved = dict(sys.modules)
    FakeStore.files, FakeStore.writes, FakeStore.removed = {}, [], []
    FakeStore.unreadable = set()
    FakeStore.deferred, FakeStore.pending = False, {}
    try:
        _stub("homeassistant")
        _stub("homeassistant.helpers")
        _stub("homeassistant.helpers.storage", Store=FakeStore)
        _stub(
            "homeassistant.core",
            HomeAssistant=type("HomeAssistant", (), {}),
            callback=lambda f: f,
        )
        pkg = types.ModuleType(_PKG)
        pkg.__path__ = []
        sys.modules[_PKG] = pkg
        _load_into_pkg("const")
        rules = _load_into_pkg("page_images")
        store_mod = _load_into_pkg("page_images_store")
        _load_into_pkg("page_links")
        _load_into_pkg("library")
        wc_mod = _load_into_pkg("watch_config_store")
        yield types.SimpleNamespace(
            rules=rules, store_mod=store_mod, wc_mod=wc_mod, load=_load_into_pkg
        )
    finally:
        for key in list(sys.modules):
            if key not in saved:
                del sys.modules[key]
        sys.modules.update(saved)


def pages(*image_ids: str | None) -> dict[str, Any]:
    return {
        "pages": [
            {"id": f"p{i}", **({"backgroundImageId": image_id} if image_id else {})}
            for i, image_id in enumerate(image_ids)
        ]
    }


def tiles(*photo_ids: str | None) -> dict[str, Any]:
    """One page whose tiles name these photos as ``iconPhotoId``, a tile with
    none for each None."""
    return {
        "pages": [
            {
                "id": "p0",
                "items": [
                    {
                        "id": f"t{i}",
                        "entityId": "light.desk_lamp",
                        **({"iconPhotoId": photo_id} if photo_id else {}),
                    }
                    for i, photo_id in enumerate(photo_ids)
                ],
            }
        ]
    }


class Env:
    def __init__(self, loaded, root: Path) -> None:
        self.loaded = loaded
        self.root = root
        self.hass = FakeHass(root)
        self.folder = root / ".storage" / FOLDER
        self.clock = datetime(2026, 10, 5, 12, 0, tzinfo=UTC)
        loaded.store_mod._utcnow = lambda: self.clock
        self.watch_config = loaded.wc_mod.WatchConfigStore(
            self.hass, is_paired=lambda _owner: True
        )
        asyncio.run(self.watch_config.async_load())
        self._unlisten = None
        self.store = self.new_store()

    def new_store(self, *, start: bool = True):
        """A store as a restart makes it. Only the newest one hears the pages
        writes, as only the running instance does after a reload."""
        if self._unlisten is not None:
            self._unlisten()
        store = self.loaded.store_mod.PageImagesStore(
            self.hass,
            pages=lambda: self.watch_config.documents("pages"),
            history=lambda: self.watch_config.history_documents("pages"),
        )
        asyncio.run(store.async_load())
        if start:
            asyncio.run(store.async_start())
        self._unlisten = self.watch_config.async_add_listener(store.pages_changed)
        return store

    def advance(self, **delta: float) -> None:
        self.clock += timedelta(**delta)

    def put_pages(self, owner: str, document: dict[str, Any]) -> None:
        """A device's signed put, forced so a test need not track revisions."""
        self.watch_config.put(
            owner, "pages", document, document_hash=HASH, base_revision=0,
            force=True, updated_by=owner,
        )

    def clear_pages(self, owner: str) -> None:
        """Save pages with no photos often enough that neither the current
        document nor any history revision names one any more."""
        for _ in range(self.loaded.wc_mod.WATCH_CONFIG_HISTORY_LIMIT + 1):
            self.put_pages(owner, pages())

    def upload(self, data: bytes | None = None, **details: Any) -> dict[str, Any]:
        return asyncio.run(self.store.async_upload(data or jpeg(), **details))

    def files(self) -> list[str]:
        return sorted(p.name for p in self.folder.iterdir()) if self.folder.exists() else []

    def index(self) -> dict[str, Any]:
        return FakeStore.files[KEY]["images"]


@pytest.fixture
def env(tmp_path):
    with loaded_package() as loaded:
        yield Env(loaded, tmp_path)


def _refused(env, coro_or_call, code: str) -> str:
    with pytest.raises(env.loaded.store_mod.PageImagesError) as err:
        result = coro_or_call()
        if asyncio.iscoroutine(result):
            asyncio.run(result)
    assert err.value.code == code, err.value.message
    return err.value.message


# ── upload ───────────────────────────────────────────────────────────────


def test_an_upload_gets_a_new_upper_case_uuid_a_file_and_an_entry(env) -> None:
    data = jpeg(300, 200)
    reply = env.upload(data)
    image_id = reply["image_id"]
    assert env.loaded.rules.normalize_id(image_id) == image_id
    assert image_id == image_id.upper() and not env.loaded.rules.is_preset(image_id)
    assert reply == {"image_id": image_id, "width": 300, "height": 200, "bytes": len(data)}
    assert env.files() == [f"{image_id}.jpg"]
    assert (env.folder / f"{image_id}.jpg").read_bytes() == data
    entry = env.index()[image_id]
    assert entry["sha256"] == __import__("hashlib").sha256(data).hexdigest()
    assert entry["added_at"] == "2026-10-05T12:00:00Z"
    # No page names it yet, so its grace starts now.
    assert entry["unused_since"] == "2026-10-05T12:00:00Z"


def test_the_same_bytes_answer_the_stored_photo_and_restart_its_grace(env) -> None:
    first = env.upload(jpeg(64, 64))
    env.advance(days=6)
    again = env.upload(jpeg(64, 64))
    assert again == first
    assert env.files() == [f"{first['image_id']}.jpg"]
    assert env.index()[first["image_id"]]["unused_since"] == "2026-10-11T12:00:00Z"
    other = env.upload(jpeg(65, 64))
    assert other["image_id"] != first["image_id"]


def test_a_dedupe_of_a_photo_in_use_leaves_it_in_use(env) -> None:
    first = env.upload()
    env.put_pages("watch-A", pages(first["image_id"]))
    assert env.upload() == first
    assert env.index()[first["image_id"]]["unused_since"] is None


@pytest.mark.parametrize(
    ("data", "code"),
    [
        (b"\x89PNG\r\n\x1a\n" + bytes(64), "invalid"),
        (jpeg(8, 8), "invalid"),
        (jpeg(2000, 100), "invalid"),
        (jpeg() + bytes(256 * 1024), "too_large"),
    ],
)
def test_upload_refusals_write_nothing(env, data, code) -> None:
    _refused(env, lambda: env.store.async_upload(data), code)
    assert env.files() == []
    assert KEY not in FakeStore.files


def test_the_home_holds_at_most_500_photos(env, monkeypatch) -> None:
    monkeypatch.setattr(env.loaded.store_mod, "MAX_CUSTOM_IMAGES", 3)
    for width in (100, 101, 102):
        env.upload(jpeg(width, 100))
    message = _refused(env, lambda: env.store.async_upload(jpeg(103, 100)), "full")
    assert "3 photos" in message
    # A dedupe is not a new photo, and a put of a stored id is not either.
    env.upload(jpeg(100, 100))
    assert len(env.files()) == 3
    _refused(env, lambda: env.store.async_put(UUID_UPPER, jpeg()), "full")


def test_the_real_cap_is_500() -> None:
    with loaded_package() as loaded:
        assert loaded.rules.MAX_CUSTOM_IMAGES == 500
        assert loaded.store_mod.MAX_CUSTOM_IMAGES == 500


# ── put ──────────────────────────────────────────────────────────────────


def test_put_stores_under_the_phones_id_in_upper_case(env) -> None:
    data = jpeg(200, 300)
    assert asyncio.run(env.store.async_put(UUID_UPPER.lower(), data)) == "stored"
    assert env.files() == [f"{UUID_UPPER}.jpg"]
    assert asyncio.run(env.store.async_read(UUID_UPPER.lower())) == (UUID_UPPER, data)


def test_put_of_a_stored_id_is_exists_and_the_first_write_wins(env) -> None:
    asyncio.run(env.store.async_put(UUID_UPPER, jpeg(200, 300)))
    assert asyncio.run(env.store.async_put(UUID_UPPER, jpeg(500, 500))) == "exists"
    # Not even checked: the stored photo is what the id means.
    assert asyncio.run(env.store.async_put(UUID_UPPER, b"not a jpeg")) == "exists"
    assert asyncio.run(env.store.async_read(UUID_UPPER))[1] == jpeg(200, 300)


def test_put_of_a_built_in_id_is_exists_and_stores_nothing(env) -> None:
    assert asyncio.run(env.store.async_put("preset_ocean", jpeg())) == "exists"
    assert env.files() == []


def test_put_keeps_the_same_bytes_under_two_ids(env) -> None:
    """The pages name the phone's id, so a put is never answered with
    another photo's id the way an upload is."""
    asyncio.run(env.store.async_put(UUID_UPPER, jpeg()))
    assert asyncio.run(env.store.async_put(OTHER_UUID, jpeg())) == "stored"
    assert len(env.files()) == 2


def test_a_put_the_pages_already_name_is_in_use_at_once(env) -> None:
    env.put_pages("watch-A", pages(UUID_UPPER))
    asyncio.run(env.store.async_put(UUID_UPPER, jpeg()))
    assert env.index()[UUID_UPPER]["unused_since"] is None


@pytest.mark.parametrize("image_id", ["preset_stars", "x", "", None, 3, "../" + UUID_UPPER])
def test_put_refuses_an_id_that_is_not_a_photo_id(env, image_id) -> None:
    _refused(env, lambda: env.store.async_put(image_id, jpeg()), "invalid")
    assert env.files() == []


# ── read and list ────────────────────────────────────────────────────────


def test_a_built_in_photo_reads_from_the_integrations_folder(env) -> None:
    image_id, data = asyncio.run(env.store.async_read("preset_waves"))
    assert image_id == "preset_waves"
    assert data == (_PKG_DIR / "page_image_presets" / "preset_waves.jpg").read_bytes()


@pytest.mark.parametrize(("raw", "code"), [(UUID_UPPER, "not_found"), ("preset_stars", "invalid"), (None, "invalid")])
def test_read_refusals(env, raw, code) -> None:
    _refused(env, lambda: env.store.async_read(raw), code)


def test_a_photo_whose_file_went_is_not_found(env) -> None:
    image_id = env.upload()["image_id"]
    (env.folder / f"{image_id}.jpg").unlink()
    _refused(env, lambda: env.store.async_read(image_id), "not_found")


def test_list_has_the_presets_in_order_and_the_photos_newest_first(env) -> None:
    first = env.upload(jpeg(100, 100))["image_id"]
    env.advance(minutes=1)
    second = env.upload(jpeg(101, 100))["image_id"]
    # Two in the same second: the later one first.
    third = env.upload(jpeg(102, 100))["image_id"]
    env.put_pages("watch-B", pages(first, "preset_sand"))
    env.put_pages("watch-A", pages(first))
    listed = env.store.list()
    assert set(listed) == {"presets", "images"}
    assert [p["id"] for p in listed["presets"]] == list(env.loaded.rules.PRESET_IDS)
    assert listed["presets"][0] == {"id": "preset_waves", "name": "Waves", "width": 314, "height": 416}
    assert [i["id"] for i in listed["images"]] == [third, second, first]
    assert listed["images"][2] == {
        "id": first,
        "width": 100,
        "height": 100,
        "bytes": len(jpeg(100, 100)),
        "added_at": "2026-10-05T12:00:00Z",
        "used_by": ["watch-A", "watch-B"],
        "format": "jpeg",
        "kind": "background",
        "label": None,
        "entity_id": None,
    }
    assert listed["images"][0]["used_by"] == []


# ── delete ───────────────────────────────────────────────────────────────


def test_delete_removes_the_entry_and_the_file(env) -> None:
    image_id = env.upload()["image_id"]
    assert asyncio.run(env.store.async_delete(image_id.lower())) == image_id
    assert env.files() == []
    assert env.index() == {}
    _refused(env, lambda: env.store.async_read(image_id), "not_found")


def test_delete_refusals(env) -> None:
    image_id = env.upload()["image_id"]
    env.put_pages("watch-A", {"pages": [{"id": "p", "isHidden": True, "backgroundImageId": image_id}]})
    message = _refused(env, lambda: env.store.async_delete(image_id), "in_use")
    assert "watch-A" in message
    _refused(env, lambda: env.store.async_delete("preset_waves"), "invalid")
    _refused(env, lambda: env.store.async_delete(OTHER_UUID), "not_found")
    _refused(env, lambda: env.store.async_delete("nope"), "invalid")
    assert env.files() == [f"{image_id}.jpg"]


def test_delete_waits_while_some_pages_cannot_be_read(env) -> None:
    image_id = env.upload()["image_id"]
    env.watch_config._failed_owners.add("watch-Z")
    _refused(env, lambda: env.store.async_delete(image_id), "unavailable")
    assert env.files() == [f"{image_id}.jpg"]


# ── the sweep, driven by real pages writes ───────────────────────────────


def test_a_device_put_marks_and_clears(env) -> None:
    image_id = env.upload()["image_id"]
    env.put_pages("watch-A", pages(image_id))
    assert env.index()[image_id]["unused_since"] is None
    env.advance(days=1)
    env.clear_pages("watch-A")
    assert env.index()[image_id]["unused_since"] == "2026-10-06T12:00:00Z"
    env.advance(days=1)
    env.put_pages("watch-A", pages(image_id))
    assert env.index()[image_id]["unused_since"] is None


def test_a_photo_unused_for_over_seven_days_goes_at_the_next_pages_write(env) -> None:
    image_id = env.upload()["image_id"]
    kept = env.upload(jpeg(99, 99))["image_id"]
    env.put_pages("watch-A", pages(kept))
    env.advance(days=7)
    env.put_pages("watch-B", pages())
    assert image_id in env.index()
    env.advance(seconds=1)
    env.put_pages("watch-B", pages(None))
    assert set(env.index()) == {kept}
    assert env.files() == [f"{kept}.jpg"]
    assert "wrist_assistant_page_images_sweep" in env.hass.tasks


def test_other_kinds_do_not_sweep(env) -> None:
    image_id = env.upload()["image_id"]
    env.advance(days=8)
    env.watch_config.put(
        "watch-A", "behavior", {}, document_hash=HASH, base_revision=0, updated_by="watch-A"
    )
    assert image_id in env.index()


def test_a_panel_save_and_a_restore_sweep(env) -> None:
    image_id = env.upload()["image_id"]
    record = env.watch_config.panel_save("watch-A", "pages", pages(image_id), base_revision=0)
    assert env.index()[image_id]["unused_since"] is None
    record = env.watch_config.panel_save("watch-A", "pages", pages(), base_revision=record.revision)
    # The older revision still names it, so it stays in use.
    assert env.index()[image_id]["unused_since"] is None
    stale = env.upload(jpeg(99, 99))["image_id"]
    env.advance(days=8)
    env.watch_config.restore("watch-A", "pages", 1, base_revision=record.revision)
    assert env.index()[image_id]["unused_since"] is None
    # The restore swept: the photo nothing ever named went.
    assert stale not in env.index()


def test_forget_and_move_sweep(env) -> None:
    image_id = env.upload()["image_id"]
    env.put_pages("watch-A", pages(image_id))
    env.watch_config.move_owner("watch-A", "watch-B", updated_by="test")
    assert env.index()[image_id]["unused_since"] is None
    assert env.store.list()["images"][0]["used_by"] == ["watch-B"]
    env.watch_config.forget_owner("watch-B")
    assert env.index()[image_id]["unused_since"] == "2026-10-05T12:00:00Z"


def test_a_photo_only_a_history_revision_names_is_kept_for_a_restore(env) -> None:
    old = env.upload(jpeg(100, 100))["image_id"]
    new = env.upload(jpeg(101, 100))["image_id"]
    record = env.watch_config.panel_save("watch-A", "pages", pages(old), base_revision=0)
    record = env.watch_config.panel_save(
        "watch-A", "pages", pages(new), base_revision=record.revision
    )
    # Only revision 1, now in the history, names the old photo.
    assert env.watch_config.documents("pages")[0]["watch-A"] == pages(new)
    assert env.index()[old]["unused_since"] is None
    env.advance(days=8)
    env.put_pages("watch-B", pages())
    assert env.store.sweep() == ()
    # A restart's sweep keeps it too.
    env.new_store()
    assert env.index()[old]["unused_since"] is None
    assert f"{old}.jpg" in env.files()
    # A current page is what counts as in use for the panel.
    assert {i["id"]: i["used_by"] for i in env.store.list()["images"]}[old] == []
    env.watch_config.restore("watch-A", "pages", 1, base_revision=record.revision)
    assert asyncio.run(env.store.async_read(old)) == (old, jpeg(100, 100))
    assert {i["id"]: i["used_by"] for i in env.store.list()["images"]}[old] == ["watch-A"]


def test_a_photo_dropped_from_the_history_is_swept_after_the_grace(env) -> None:
    limit = env.loaded.wc_mod.WATCH_CONFIG_HISTORY_LIMIT
    old = env.upload(jpeg(100, 100))["image_id"]
    new = env.upload(jpeg(101, 100))["image_id"]
    record = env.watch_config.panel_save("watch-A", "pages", pages(old), base_revision=0)
    # The history holds the last few replaced documents, so revision 1 is
    # pushed out by the save after the one that fills it.
    for _ in range(limit + 1):
        env.advance(days=1)
        record = env.watch_config.panel_save(
            "watch-A", "pages", pages(new), base_revision=record.revision
        )
        if record.history_entry(1) is not None:
            assert env.index()[old]["unused_since"] is None
    # The last save pushed revision 1 out, and its photo's grace starts then.
    with pytest.raises(env.loaded.wc_mod.WatchConfigNotFoundError):
        env.watch_config.history_entry("watch-A", "pages", 1)
    dropped_at = env.clock
    assert env.index()[old]["unused_since"] == dropped_at.isoformat().replace("+00:00", "Z")
    env.advance(days=7)
    env.put_pages("watch-B", pages())
    assert old in env.index()
    env.advance(seconds=1)
    env.put_pages("watch-B", pages())
    assert old not in env.index()
    assert env.files() == [f"{new}.jpg"]


def test_unread_pages_stop_the_sweep_marking_or_deleting(env) -> None:
    unused = env.upload()["image_id"]
    used = env.upload(jpeg(99, 99))["image_id"]
    env.put_pages("watch-A", pages(used))
    env.clear_pages("watch-A")
    assert env.index()[used]["unused_since"] is not None
    env.watch_config._failed_owners.add("watch-Z")
    env.advance(days=30)
    env.put_pages("watch-A", pages(used))
    assert set(env.index()) == {unused, used}
    # The clearing half still runs.
    assert env.index()[used]["unused_since"] is None


def test_built_in_photos_are_never_in_the_index(env) -> None:
    env.put_pages("watch-A", pages("preset_ocean"))
    env.advance(days=30)
    env.put_pages("watch-A", pages())
    assert FakeStore.files.get(KEY, {"images": {}})["images"] == {}
    assert asyncio.run(env.store.async_read("preset_ocean"))[0] == "preset_ocean"


def test_a_swept_file_is_kept_when_the_id_is_handed_over_again_first(env) -> None:
    """The sweep drops the entry at once and unlinks under the lock, only for
    ids still not stored, so a put that lands in between keeps its file."""
    asyncio.run(env.store.async_put(UUID_UPPER, jpeg()))
    env.advance(days=8)

    async def race() -> None:
        env.put_pages("watch-A", pages())  # schedules the unlink task
        await env.store.async_put(UUID_UPPER, jpeg(77, 77))
        await asyncio.sleep(0)

    asyncio.run(race())
    assert env.files() == [f"{UUID_UPPER}.jpg"]
    assert env.index()[UUID_UPPER]["width"] == 77


# ── start, restart, unreadable, unload, removal ──────────────────────────


def test_the_index_survives_a_restart(env) -> None:
    image_id = env.upload()["image_id"]
    env.put_pages("watch-A", pages(image_id))
    again = env.new_store()
    assert [i["id"] for i in again.list()["images"]] == [image_id]
    assert again.entry(image_id)["unused_since"] is None


def test_start_drops_entries_with_no_file_and_files_with_no_entry(env) -> None:
    kept = env.upload()["image_id"]
    gone = env.upload(jpeg(99, 99))["image_id"]
    (env.folder / f"{gone}.jpg").unlink()
    (env.folder / f"{OTHER_UUID}.jpg").write_bytes(jpeg())
    (env.folder / f"{kept}.tmp").write_bytes(b"half")
    again = env.new_store()
    assert [i["id"] for i in again.list()["images"]] == [kept]
    assert env.files() == [f"{kept}.jpg"]


def test_start_sweeps_against_the_pages_as_loaded(env) -> None:
    image_id = env.upload()["image_id"]
    env.advance(days=8)
    env.new_store()
    assert image_id not in env.index()
    assert env.files() == []


def test_bad_index_entries_are_dropped_on_load(env) -> None:
    good = env.upload()["image_id"]
    FakeStore.files[KEY]["images"].update(
        {
            "preset_waves": dict(FakeStore.files[KEY]["images"][good]),
            "not-an-id": dict(FakeStore.files[KEY]["images"][good]),
            OTHER_UUID: {"bytes": "many"},
        }
    )
    again = env.new_store(start=False)
    assert [i["id"] for i in again.list()["images"]] == [good]


def test_an_unreadable_index_is_refused_and_never_saved_over(env) -> None:
    env.upload()
    saved = json.dumps(FakeStore.files[KEY], sort_keys=True)
    FakeStore.unreadable.add(KEY)
    store = env.new_store()
    assert not store.available
    for call in (
        store.list,
        lambda: store.async_read("preset_waves"),
        lambda: store.async_upload(jpeg()),
        lambda: store.async_put(UUID_UPPER, jpeg()),
        lambda: store.async_delete(UUID_UPPER),
    ):
        _refused(env, call, "unavailable")
    env.advance(days=30)
    env.put_pages("watch-A", pages())
    assert store.sweep() == ()
    asyncio.run(store.async_shutdown())
    assert json.dumps(FakeStore.files[KEY], sort_keys=True) == saved


def test_shutdown_writes_a_pending_save_and_then_saves_nothing(env) -> None:
    FakeStore.deferred = True
    image_id = env.upload()["image_id"]
    assert KEY in FakeStore.pending
    asyncio.run(env.store.async_shutdown())
    assert image_id in FakeStore.files[KEY]["images"]
    FakeStore.files.pop(KEY)
    env.put_pages("watch-A", pages())
    env.upload(jpeg(99, 99))
    FakeStore.fire_pending()
    assert KEY not in FakeStore.files


def test_remove_deletes_the_index_and_the_folder_from_a_fresh_instance(env) -> None:
    env.upload()
    store = env.loaded.store_mod.PageImagesStore(env.hass)
    asyncio.run(store.async_remove())
    assert KEY in FakeStore.removed and KEY not in FakeStore.files
    assert not env.folder.exists()
    assert (_PKG_DIR / "page_image_presets" / "preset_waves.jpg").exists()


# ── photo tiles: PNG, details, tile use, the icon grace ──────────────────

ICON_UUID = "A1B2C3D4-E5F6-4A7B-8C9D-0E1F2A3B4C5D"


def test_a_png_upload_is_kept_as_a_png_file(env) -> None:
    data = png(120, 90)
    reply = env.upload(data)
    image_id = reply["image_id"]
    assert reply == {"image_id": image_id, "width": 120, "height": 90, "bytes": len(data)}
    assert env.files() == [f"{image_id}.png"]
    assert env.index()[image_id]["format"] == "png"
    assert asyncio.run(env.store.async_read(image_id.lower())) == (image_id, data)
    assert env.store.list()["images"][0]["format"] == "png"


def test_an_upload_keeps_its_kind_label_and_entity_id(env) -> None:
    image_id = env.upload(png(), kind="icon", label="  Desk lamp ", entity_id="light.desk_lamp")["image_id"]
    entry = env.index()[image_id]
    assert (entry["format"], entry["kind"], entry["label"], entry["entity_id"]) == (
        "png", "icon", "Desk lamp", "light.desk_lamp"
    )
    listed = env.store.list()["images"][0]
    assert {k: listed[k] for k in ("format", "kind", "label", "entity_id")} == {
        "format": "png", "kind": "icon", "label": "Desk lamp", "entity_id": "light.desk_lamp",
    }
    # With no details a photo is a background with neither of the others, and
    # an empty label is no label.
    plain = env.upload(jpeg(), label="   ")["image_id"]
    assert {k: env.index()[plain][k] for k in ("format", "kind", "label", "entity_id")} == {
        "format": "jpeg", "kind": "background", "label": None, "entity_id": None,
    }


@pytest.mark.parametrize(
    "details",
    [
        {"kind": "photo"},
        {"kind": "Icon"},
        {"kind": 1},
        {"label": "x" * 61},
        {"label": 5},
        {"entity_id": "Desk Lamp"},
        {"entity_id": "light"},
        {"entity_id": ["light.x"]},
    ],
)
def test_upload_and_put_refuse_bad_details_and_write_nothing(env, details) -> None:
    _refused(env, lambda: env.store.async_upload(png(), **details), "invalid")
    _refused(env, lambda: env.store.async_put(UUID_UPPER, png(), **details), "invalid")
    assert env.files() == []
    assert KEY not in FakeStore.files


@pytest.mark.parametrize(
    ("data", "code"),
    [
        (png(8, 8), "invalid"),
        (png(2000, 100), "invalid"),
        (png()[:20], "invalid"),
        (png()[:12] + b"IDAT" + png()[16:], "invalid"),
        (png(pad=256 * 1024), "too_large"),
    ],
)
def test_png_refusals_write_nothing(env, data, code) -> None:
    _refused(env, lambda: env.store.async_upload(data, kind="icon"), code)
    _refused(env, lambda: env.store.async_put(UUID_UPPER, data, kind="icon"), code)
    assert env.files() == []


def test_a_background_uploaded_again_as_an_icon_becomes_an_icon(env) -> None:
    """The dedupe answers the stored id. A background asked for as an icon
    becomes one (the longer grace is the safe side); an icon is never turned
    back; a label or entity id fills in only where the photo had none."""
    first = env.upload(png())
    assert env.index()[first["image_id"]]["kind"] == "background"
    again = env.upload(png(), kind="icon", label="Lamp", entity_id="light.lamp")
    assert again == first
    entry = env.index()[first["image_id"]]
    assert (entry["kind"], entry["label"], entry["entity_id"]) == ("icon", "Lamp", "light.lamp")
    third = env.upload(png(), kind="background", label="Other", entity_id="fan.other")
    assert third == first
    entry = env.index()[first["image_id"]]
    assert (entry["kind"], entry["label"], entry["entity_id"]) == ("icon", "Lamp", "light.lamp")
    assert env.files() == [f"{first['image_id']}.png"]


def test_put_keeps_a_phones_icon_photo_and_the_first_write_wins(env) -> None:
    data = png(256, 256)
    assert asyncio.run(
        env.store.async_put(ICON_UUID.lower(), data, kind="icon", label="Lamp", entity_id="light.lamp")
    ) == "stored"
    assert env.files() == [f"{ICON_UUID}.png"]
    entry = env.index()[ICON_UUID]
    assert (entry["format"], entry["kind"], entry["label"], entry["entity_id"]) == (
        "png", "icon", "Lamp", "light.lamp"
    )
    assert asyncio.run(
        env.store.async_put(ICON_UUID, jpeg(), kind="background", label="Other")
    ) == "exists"
    assert env.index()[ICON_UUID]["kind"] == "icon"
    assert asyncio.run(env.store.async_read(ICON_UUID)) == (ICON_UUID, data)
    # Details are checked even when the id is stored.
    _refused(env, lambda: env.store.async_put(ICON_UUID, data, kind="sticker"), "invalid")


def test_a_tiles_photo_is_in_use(env) -> None:
    image_id = env.upload(png(), kind="icon")["image_id"]
    env.put_pages("watch-A", tiles(image_id.lower(), None))
    assert env.index()[image_id]["unused_since"] is None
    assert env.store.list()["images"][0]["used_by"] == ["watch-A"]
    message = _refused(env, lambda: env.store.async_delete(image_id), "in_use")
    assert "watch-A" in message
    assert env.files() == [f"{image_id}.png"]
    # Off the tile and out of the history, it can go.
    env.clear_pages("watch-A")
    assert env.index()[image_id]["unused_since"] is not None
    assert asyncio.run(env.store.async_delete(image_id)) == image_id
    assert env.files() == []


def test_a_put_a_tile_already_names_is_in_use_at_once(env) -> None:
    env.put_pages("watch-A", tiles(ICON_UUID))
    asyncio.run(env.store.async_put(ICON_UUID, png(), kind="icon"))
    assert env.index()[ICON_UUID]["unused_since"] is None


def test_an_icon_photo_no_tile_names_stays_thirty_days(env) -> None:
    icon = env.upload(png(), kind="icon")["image_id"]
    background = env.upload(jpeg())["image_id"]
    env.advance(days=7, seconds=1)
    env.put_pages("watch-A", pages())
    assert set(env.index()) == {icon}
    env.advance(days=22, hours=23, minutes=59, seconds=59)
    env.put_pages("watch-A", pages())
    # Thirty days to the second since it was added.
    assert icon in env.index()
    env.advance(seconds=1)
    env.put_pages("watch-A", pages())
    assert icon not in env.index()
    assert env.files() == []
    assert background not in env.index()


def test_an_icon_photo_put_on_a_tile_is_kept_past_thirty_days(env) -> None:
    image_id = env.upload(png(), kind="icon")["image_id"]
    env.advance(days=20)
    env.put_pages("watch-A", tiles(image_id))
    env.advance(days=40)
    env.put_pages("watch-A", tiles(image_id))
    assert env.index()[image_id]["unused_since"] is None
    env.clear_pages("watch-A")
    # Its grace starts only when it falls off the tile, sixty days in.
    assert env.index()[image_id]["unused_since"] == "2026-12-04T12:00:00Z"


def test_a_tile_photo_only_a_history_revision_names_is_kept(env) -> None:
    """The history is read by the same rule as the current pages, so a tile
    photo an older revision names is kept for a restore."""
    old = env.upload(png(64, 64), kind="icon")["image_id"]
    record = env.watch_config.panel_save("watch-A", "pages", tiles(old), base_revision=0)
    record = env.watch_config.panel_save("watch-A", "pages", tiles(None), base_revision=record.revision)
    env.advance(days=60)
    env.put_pages("watch-B", pages())
    assert env.index()[old]["unused_since"] is None
    assert {i["id"]: i["used_by"] for i in env.store.list()["images"]}[old] == []
    env.watch_config.restore("watch-A", "pages", 1, base_revision=record.revision)
    assert {i["id"]: i["used_by"] for i in env.store.list()["images"]}[old] == ["watch-A"]


def test_a_library_page_tile_photo_is_kept(env) -> None:
    """``page_photo_history`` adds the library's pages, which the same rule
    reads, so a tile photo only a library page names is kept too."""
    image_id = env.upload(png(), kind="icon")["image_id"]
    # No page names it yet, so its grace started at the upload.
    assert env.index()[image_id]["unused_since"] is not None
    env.watch_config._library["pages"]["L1"] = tiles(image_id)["pages"][0]
    store = env.loaded.store_mod.PageImagesStore(
        env.hass,
        pages=lambda: env.watch_config.documents("pages"),
        history=env.watch_config.page_photo_history,
    )
    asyncio.run(store.async_load())
    asyncio.run(store.async_start())
    assert store.entry(image_id)["unused_since"] is None
    env.advance(days=60)
    assert store.sweep() == ()
    assert store.entry(image_id)["unused_since"] is None


def test_an_entry_from_before_photo_tiles_reads_as_a_jpeg_background(env) -> None:
    data = jpeg(300, 200)
    env.folder.mkdir(parents=True)
    (env.folder / f"{UUID_UPPER}.jpg").write_bytes(data)
    FakeStore.files[KEY] = {
        "images": {
            UUID_UPPER: {
                "bytes": len(data),
                "width": 300,
                "height": 200,
                "sha256": __import__("hashlib").sha256(data).hexdigest(),
                "added_at": "2026-10-01T12:00:00Z",
                "unused_since": None,
            }
        }
    }
    env.put_pages("watch-A", pages(UUID_UPPER))
    store = env.new_store()
    entry = store.entry(UUID_UPPER)
    assert (entry["format"], entry["kind"], entry["label"], entry["entity_id"]) == (
        "jpeg", "background", None, None
    )
    assert env.files() == [f"{UUID_UPPER}.jpg"]
    assert asyncio.run(store.async_read(UUID_UPPER)) == (UUID_UPPER, data)
    listed = store.list()["images"][0]
    assert {k: listed[k] for k in ("format", "kind", "label", "entity_id", "used_by")} == {
        "format": "jpeg", "kind": "background", "label": None, "entity_id": None, "used_by": ["watch-A"],
    }
    # Uploading its bytes again as an icon finds it and makes it one.
    assert asyncio.run(store.async_upload(data, kind="icon"))["image_id"] == UUID_UPPER
    assert store.entry(UUID_UPPER)["kind"] == "icon"


def test_bad_photo_tile_fields_in_the_index(env) -> None:
    """An unknown format or kind drops the entry, like any damaged field; a
    bad label or entity id only loses that detail."""
    good = env.upload(png(), kind="icon")["image_id"]
    entries = FakeStore.files[KEY]["images"]
    template = dict(entries[good])
    other = "22222222-3333-4444-8555-666666666666"
    entries.update(
        {
            OTHER_UUID: {**template, "format": "gif"},
            other: {**template, "kind": "sticker"},
            "33333333-4444-4555-8666-777777777777": {**template, "format": ["png"]},
            "44444444-5555-4666-8777-888888888888": {**template, "kind": ["icon"]},
            "55555555-6666-4777-8888-999999999999": {**template, "format": None},
        }
    )
    entries[good] = {**template, "label": "x" * 61, "entity_id": "Not An Id"}
    again = env.new_store(start=False)
    assert [i["id"] for i in again.list()["images"]] == [good]
    entry = again.entry(good)
    assert (entry["kind"], entry["label"], entry["entity_id"]) == ("icon", None, None)


def test_start_matches_png_files_to_their_entries(env) -> None:
    kept = env.upload(png(64, 64))["image_id"]
    gone = env.upload(png(65, 64))["image_id"]
    (env.folder / f"{gone}.png").unlink()
    # A file in the other format than its entry names is a stray.
    (env.folder / f"{kept}.jpg").write_bytes(jpeg())
    (env.folder / f"{OTHER_UUID}.png").write_bytes(png())
    again = env.new_store()
    assert [i["id"] for i in again.list()["images"]] == [kept]
    assert env.files() == [f"{kept}.png"]


def test_a_swept_png_file_goes_and_a_put_in_the_other_format_keeps_its_own(env) -> None:
    asyncio.run(env.store.async_put(UUID_UPPER, png()))
    env.advance(days=8)

    async def race() -> None:
        env.put_pages("watch-A", pages())  # schedules the unlink of the PNG
        await env.store.async_put(UUID_UPPER, jpeg(77, 77))
        await asyncio.sleep(0)

    asyncio.run(race())
    # The PNG went with its swept entry; the JPEG stored after it stays.
    assert env.files() == [f"{UUID_UPPER}.jpg"]
    assert env.index()[UUID_UPPER]["format"] == "jpeg"


def test_the_sweep_deletes_a_png_file(env) -> None:
    image_id = env.upload(png())["image_id"]
    env.advance(days=8)
    env.put_pages("watch-A", pages())
    assert image_id not in env.index()
    assert env.files() == []


# ── base64 ───────────────────────────────────────────────────────────────


def test_decode_data(env) -> None:
    decode = env.loaded.store_mod.decode_data
    data = jpeg()
    assert decode(base64.b64encode(data).decode()) == data
    for raw, code in (
        ("", "invalid"),
        (None, "invalid"),
        ("not base64!", "invalid"),
        ("QUJD\nREVG", "invalid"),
        ("A" * (360 * 1024), "too_large"),
    ):
        _refused(env, lambda raw=raw: decode(raw), code)
    # The longest text a photo at the cap encodes to is still decoded.
    at_cap = base64.b64encode(bytes(256 * 1024)).decode()
    assert len(decode(at_cap)) == 256 * 1024
