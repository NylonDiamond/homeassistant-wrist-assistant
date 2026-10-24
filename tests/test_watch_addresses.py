"""Each watch's home network and internet address (watch_addresses.py).

No Home Assistant. Covered:

* The one URL cleaner every write path uses.
* The resolver: ``auto`` from the internal, external and cloud URLs, ``set``
  and ``none``, and the hash over the effective record (fixed vectors the
  watch's own tests can hold).
* The setting parser behind ``addresses_set`` and ``devices/set_addresses``.
* The secret store: old entries load as auto/auto, a set survives a save and
  load, a re-pair keeps it.
* The signed ``addresses_get`` and ``addresses_set`` ops, pulled out of
  ``wa_v2_views.py`` by name, wire shapes asserted whole.
* The delta poll: ``addresses`` on every watch reply with a body, lean like
  ``client_certificate``, a set waking the parked poll, a held hash that
  lags answered at once, once.
* The panel commands' owner check.
* The capability, the op table and the setup wiring, statically.
"""

from __future__ import annotations

import __future__
import ast
import asyncio
import base64
import contextlib
import sys
import types
from pathlib import Path
from typing import Any

import pytest

import test_complication_ws as cws
from test_delta_coordinator_inprocess import _poll, coordinator  # noqa: F401
from test_panel_access import ALICE, BOB, ROOT, _ok, _refused, _run
from test_panel_access import env as panel_env  # noqa: F401
from test_widget_secret_user_binding import _load, _loaded_store

_PKG = "custom_components.wrist_assistant"
_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_VIEWS = _PKG_DIR / "wa_v2_views.py"

SECRET = base64.b64encode(b"a" * 32).decode()
LOCAL = "http://homeassistant.local:8123"
EXTERNAL = "https://ha.example.com"
CLOUD = "https://abc123.ui.nabu.casa"


@contextlib.contextmanager
def _loaded(home_urls: Any = None):
    """The real secret store and watch_addresses, with a pairing_ws whose
    ``home_urls`` returns what the test says."""
    with _loaded_store() as store_mod:
        sys.modules[f"{_PKG}.pairing_ws"] = types.SimpleNamespace(
            home_urls=home_urls or (lambda _hass: (None, None, None))
        )
        yield store_mod, _load("watch_addresses")


@pytest.fixture
def wa():
    with _loaded() as (_store_mod, module):
        yield module


# ── the cleaner ──────────────────────────────────────────────────────────


@pytest.mark.parametrize(
    ("raw", "cleaned"),
    [
        ("http://homeassistant.local:8123", LOCAL),
        ("  http://homeassistant.local:8123/  ", LOCAL),
        ("HTTPS://HA.Example.COM", EXTERNAL),
        ("https://ha.example.com:443", "https://ha.example.com:443"),
        ("http://192.168.1.20:8123", "http://192.168.1.20:8123"),
        ("http://[fe80::1]:8123", "http://[fe80::1]:8123"),
        ("http://my_host:8123", "http://my_host:8123"),
    ],
)
def test_the_cleaner_takes_an_http_address(wa, raw: str, cleaned: str) -> None:
    assert wa.sanitize_url(raw) == cleaned


@pytest.mark.parametrize(
    "raw",
    [
        None,
        42,
        "",
        "   ",
        "homeassistant.local:8123",
        "ftp://ha.example.com",
        "javascript:alert(1)",
        "http://",
        "http://:8123",
        "https://ha.example.com/lovelace",
        "https://ha.example.com/?a=1",
        "https://ha.example.com?",
        "https://ha.example.com#top",
        "https://user:pass@ha.example.com",
        "https://ha.example.com:99999",
        "https://ha.example.com:0",
        "https://ha.example.com:",
        "https://ha example.com",
        "https://ha.exam\nple.com",
        "https://ha.example.com\t:8123",
        "https://ha..example.com",
        "https://-ha.example.com",
        "https://" + "a" * 600 + ".com",
    ],
)
def test_the_cleaner_refuses_anything_else(wa, raw: Any) -> None:
    assert wa.sanitize_url(raw) is None


def test_the_cap_is_512_characters(wa) -> None:
    host = "a" * (512 - len("https://") - len(".com"))
    assert wa.sanitize_url(f"https://{host}.com") == f"https://{host}.com"
    assert wa.sanitize_url(f"https://{host}x.com") is None


# ── the resolver and the hash ────────────────────────────────────────────


def _entry(local: str | None = None, remote: str | None = None) -> Any:
    return types.SimpleNamespace(local_url=local, remote_url=remote, device_kind="watch")


def test_auto_follows_home_assistant(wa) -> None:
    detected = wa.DetectedAddresses(internal=LOCAL, external=EXTERNAL, cloud=CLOUD)
    record = wa.effective_addresses(_entry(), detected)
    assert (record.local_url, record.remote_url) == (LOCAL, EXTERNAL)
    assert (record.local_source, record.remote_source) == ("auto", "auto")
    # No external URL: the internet address is the cloud one.
    record = wa.effective_addresses(_entry(), wa.DetectedAddresses(internal=LOCAL, cloud=CLOUD))
    assert record.remote_url == CLOUD
    # Nothing set in Home Assistant: auto with no address.
    record = wa.effective_addresses(_entry(), wa.DetectedAddresses())
    assert (record.local_url, record.remote_url) == (None, None)
    assert (record.local_source, record.remote_source) == ("auto", "auto")


def test_set_and_none_win_over_home_assistant(wa) -> None:
    detected = wa.DetectedAddresses(internal=LOCAL, external=EXTERNAL, cloud=CLOUD)
    record = wa.effective_addresses(_entry("http://10.0.0.5:8123", ""), detected)
    assert record.as_wire() == {
        "ok": True,
        "local_url": "http://10.0.0.5:8123",
        "remote_url": None,
        "local_source": "set",
        "remote_source": "none",
        "hash": record.hash,
    }
    # A stored value edited by hand into something that is no address puts
    # nothing on the wire.
    record = wa.effective_addresses(_entry("ftp://x"), detected)
    assert (record.local_url, record.local_source) == (None, "set")
    # An entry from before the fields existed reads as auto.
    record = wa.effective_addresses(types.SimpleNamespace(), detected)
    assert (record.local_source, record.remote_source) == ("auto", "auto")


def test_the_hash_is_fixed_by_the_effective_record(wa) -> None:
    def record(local, remote, ls, rs):
        return wa.AddressRecord(local, remote, ls, rs)

    # Vectors the watch's tests can hold: sha256 over
    # "local|remote|local_source|remote_source", null as "", first 16 hex.
    assert record(LOCAL, EXTERNAL, "auto", "set").hash == "685961f18551ab3f"
    assert record(None, None, "none", "none").hash == "86ed48ccccd3e52f"
    assert record(LOCAL, None, "auto", "auto").hash == "b4aba5f0f9dc934b"
    # Stable for the same record, moved by any part of it.
    a = wa.effective_addresses(_entry(), wa.DetectedAddresses(internal=LOCAL))
    b = wa.effective_addresses(_entry(), wa.DetectedAddresses(internal=LOCAL))
    assert a.hash == b.hash
    moved = wa.effective_addresses(_entry(), wa.DetectedAddresses(internal=LOCAL, external=EXTERNAL))
    assert moved.hash != a.hash
    same_url_set = wa.effective_addresses(_entry(LOCAL), wa.DetectedAddresses(internal=LOCAL))
    assert same_url_set.local_url == a.local_url and same_url_set.hash != a.hash


def test_detected_cleans_home_assistant_s_own_values(wa) -> None:
    with _loaded(lambda _hass: (LOCAL + "/", "ftp://nope", CLOUD)) as (_s, module):
        detected = module.detected_addresses(object())
        assert detected.as_dict() == {"internal": LOCAL, "external": None, "cloud": CLOUD}

    def broken(_hass):
        raise RuntimeError("no network")

    with _loaded(broken) as (_s, module):
        assert module.detected_addresses(object()).as_dict() == {
            "internal": None, "external": None, "cloud": None,
        }


# ── the parser ───────────────────────────────────────────────────────────


def test_the_parser_maps_null_empty_and_a_string(wa) -> None:
    assert wa.parse_address_update({}) == {}
    assert wa.parse_address_update({"local_url": None}) == {"local_url": None}
    assert wa.parse_address_update({"remote_url": ""}) == {"remote_url": ""}
    assert wa.parse_address_update({"remote_url": "   "}) == {"remote_url": ""}
    assert wa.parse_address_update(
        {"local_url": " http://homeassistant.local:8123/ ", "other": 1}
    ) == {"local_url": LOCAL}


@pytest.mark.parametrize(
    ("payload", "field"),
    [
        ({"local_url": "homeassistant.local"}, "local_url"),
        ({"remote_url": 7}, "remote_url"),
        ({"remote_url": ["x"]}, "remote_url"),
        ({"local_url": "nope", "remote_url": "nope"}, "local_url"),
        ({"local_url": LOCAL, "remote_url": "https://x.com/path"}, "remote_url"),
    ],
)
def test_the_parser_names_the_bad_slot(wa, payload: dict, field: str) -> None:
    with pytest.raises(wa.InvalidAddressError) as err:
        wa.parse_address_update(payload)
    assert err.value.field == field


# ── the secret store ─────────────────────────────────────────────────────


def _new_store(store_mod) -> Any:
    store = store_mod.WidgetSecretStore(object())
    asyncio.run(store.async_load())
    return store


def test_an_old_entry_loads_as_auto_and_saves_unchanged() -> None:
    with _loaded() as (store_mod, _wa):
        store = store_mod.WidgetSecretStore(object())
        old = {"secrets": {"w1": {"secret_b64": SECRET, "label": "watch-code-pair"}}}
        store._store.saved = old
        asyncio.run(store.async_load())
        entry = store.get("w1")
        assert (entry.local_url, entry.remote_url) == (None, None)
        written = store._serialize()["secrets"]["w1"]
        assert "local_url" not in written and "remote_url" not in written


def test_a_set_survives_a_save_and_load() -> None:
    with _loaded() as (store_mod, _wa):
        store = _new_store(store_mod)
        store.register("w1", SECRET, "watch-code-pair", user_id="alice")
        assert store.set_addresses("w1", {"local_url": LOCAL, "remote_url": ""}) is True
        # The same again changes nothing; an unknown key is ignored.
        assert store.set_addresses("w1", {"local_url": LOCAL, "bogus": "x"}) is False
        assert store.set_addresses("missing", {"local_url": LOCAL}) is None
        saved = store._store.saved
        assert saved["secrets"]["w1"]["local_url"] == LOCAL
        assert saved["secrets"]["w1"]["remote_url"] == ""

        again = store_mod.WidgetSecretStore(object())
        again._store.saved = saved
        asyncio.run(again.async_load())
        entry = again.get("w1")
        assert (entry.local_url, entry.remote_url) == (LOCAL, "")
        # Back to auto drops the keys from the file.
        assert again.set_addresses("w1", {"local_url": None, "remote_url": None}) is True
        assert "local_url" not in again._store.saved["secrets"]["w1"]


def test_junk_on_disk_reads_as_auto() -> None:
    with _loaded() as (store_mod, _wa):
        store = store_mod.WidgetSecretStore(object())
        store._store.saved = {
            "secrets": {"w1": {"secret_b64": SECRET, "label": None, "local_url": 5}}
        }
        asyncio.run(store.async_load())
        assert store.get("w1").local_url is None


def test_pairing_again_keeps_the_addresses() -> None:
    with _loaded() as (store_mod, _wa):
        store = _new_store(store_mod)
        store.register("w1", SECRET, "watch-code-pair", user_id="alice")
        store.set_addresses("w1", {"remote_url": EXTERNAL})
        other = base64.b64encode(b"b" * 32).decode()
        assert store.register("w1", other, "watch-code-pair", user_id="alice") == "rekey"
        assert store.get("w1").remote_url == EXTERNAL
        asyncio.run(store.async_replace_secret("w1", SECRET))
        assert store.get("w1").remote_url == EXTERNAL


# ── the signed ops ───────────────────────────────────────────────────────


class _Response:
    def __init__(self, status: int, body: Any) -> None:
        self.status = status
        self.body = body


class _Coord:
    def __init__(self) -> None:
        self.woken: list[str] = []

    def wake_watch(self, watch_id: str, *, renotify: bool = False) -> None:
        self.woken.append(watch_id)


class _Ctx:
    def __init__(self, secrets: Any, coord: Any, watch_id: str, payload: dict) -> None:
        self.hass = object()
        self.watch_id = watch_id
        self.payload = payload
        self.domain_data = types.SimpleNamespace(widget_secret_store=secrets, coordinator=coord)

    def signed_json(self, payload: dict, status: int = 200) -> _Response:
        return _Response(status=status, body=payload)


def _ops(wa_mod) -> dict[str, Any]:
    names = ("_op_addresses_get", "_op_addresses_set")
    tree = ast.parse(_VIEWS.read_text(), filename=str(_VIEWS))
    wanted = [
        node
        for node in tree.body
        if isinstance(node, ast.AsyncFunctionDef) and node.name in names
    ]
    assert sorted(n.name for n in wanted) == sorted(names)
    code = compile(
        ast.Module(body=wanted, type_ignores=[]),
        str(_VIEWS),
        "exec",
        flags=__future__.annotations.compiler_flag,
        dont_inherit=True,
    )
    namespace: dict[str, Any] = {
        "Any": Any,
        "Response": _Response,
        "INVALID_URL_ERROR": wa_mod.INVALID_URL_ERROR,
        "InvalidAddressError": wa_mod.InvalidAddressError,
        "device_addresses": wa_mod.device_addresses,
        "update_device_addresses": wa_mod.update_device_addresses,
    }
    exec(code, namespace)  # noqa: S102
    return {name: namespace[name] for name in names}


@pytest.fixture
def ops_env():
    with _loaded(lambda _hass: (LOCAL, None, CLOUD)) as (store_mod, wa_mod):
        store = _new_store(store_mod)
        store.register("w1", SECRET, "watch-code-pair", user_id="alice")
        yield types.SimpleNamespace(store=store, coord=_Coord(), ops=_ops(wa_mod), wa=wa_mod)


def _call(env, op: str, payload: dict, watch_id: str = "w1") -> _Response:
    return asyncio.run(env.ops[op](_Ctx(env.store, env.coord, watch_id, payload)))


def test_addresses_get_answers_the_contract_shape(ops_env) -> None:
    reply = _call(ops_env, "_op_addresses_get", {})
    assert reply.status == 200
    expected = ops_env.wa.AddressRecord(LOCAL, CLOUD, "auto", "auto")
    assert reply.body == {
        "ok": True,
        "local_url": LOCAL,
        "remote_url": CLOUD,
        "local_source": "auto",
        "remote_source": "auto",
        "hash": expected.hash,
    }
    assert _call(ops_env, "_op_addresses_get", {}, watch_id="gone").status == 410


def test_addresses_set_writes_the_slots_it_names(ops_env) -> None:
    before = _call(ops_env, "_op_addresses_get", {}).body["hash"]
    reply = _call(ops_env, "_op_addresses_set", {"remote_url": EXTERNAL + "/"})
    assert reply.status == 200
    assert reply.body["remote_url"] == EXTERNAL and reply.body["remote_source"] == "set"
    # The local slot was not named, so it stays on auto.
    assert reply.body["local_url"] == LOCAL and reply.body["local_source"] == "auto"
    assert reply.body["hash"] != before
    assert ops_env.coord.woken == ["w1"]
    assert reply.body == _call(ops_env, "_op_addresses_get", {}).body

    # "" is none, null is back to auto.
    body = _call(ops_env, "_op_addresses_set", {"local_url": ""}).body
    assert (body["local_url"], body["local_source"]) == (None, "none")
    body = _call(ops_env, "_op_addresses_set", {"local_url": None, "remote_url": None}).body
    assert (body["local_source"], body["remote_source"]) == ("auto", "auto")
    assert body["hash"] == before
    # Setting what is already there wakes nothing.
    woken = list(ops_env.coord.woken)
    _call(ops_env, "_op_addresses_set", {"local_url": None})
    assert ops_env.coord.woken == woken


def test_addresses_set_refuses_an_invalid_url_and_changes_nothing(ops_env) -> None:
    before = _call(ops_env, "_op_addresses_get", {}).body
    reply = _call(
        ops_env, "_op_addresses_set", {"local_url": "http://10.0.0.5:8123", "remote_url": "nope"}
    )
    assert reply.status == 400
    assert reply.body == {"ok": False, "error": "invalid_url", "field": "remote_url"}
    assert _call(ops_env, "_op_addresses_get", {}).body == before
    assert ops_env.coord.woken == []
    assert _call(ops_env, "_op_addresses_set", {"local_url": LOCAL}, watch_id="gone").status == 410


# ── the delta poll ───────────────────────────────────────────────────────


def _attach(coord, hashes: dict[str, str]) -> None:
    coord.attach_addresses(lambda watch_id: hashes.get(watch_id))


def test_every_watch_reply_with_a_body_carries_the_hash(coordinator) -> None:  # noqa: F811
    _module, hass, coord = coordinator
    ent = "light.addr1"
    hass.states.set(ent, "off")

    async def run() -> None:
        _s, body = await _poll(coord, entities=[ent])
        assert "addresses" not in body
        hashes = {"w1": "a" * 16}
        _attach(coord, hashes)
        _s, body = await _poll(coord, entities=[ent])
        assert body["addresses"] == "a" * 16
        # A device the lookup gives nothing for (an iPhone) hears nothing.
        _s, body = await _poll(coord, watch_id="iphone:1", entities=[ent])
        assert "addresses" not in body

    asyncio.run(run())


def test_a_lean_reply_drops_the_hash_the_watch_holds(coordinator) -> None:  # noqa: F811
    module, hass, coord = coordinator
    ent = "light.addr2"
    hass.states.set(ent, "off")
    hashes = {"w1": "a" * 16}
    _attach(coord, hashes)

    async def run() -> None:
        held = module.HeldConfig(addresses="a" * 16)
        _s, body = await _poll(coord, entities=[ent], lean=True, held=held)
        assert "addresses" not in body
        stale = module.HeldConfig(addresses="b" * 16)
        _s, body = await _poll(coord, entities=[ent], lean=True, held=stale, force_delta=True)
        assert body["addresses"] == "a" * 16
        # Not lean: always there.
        _s, body = await _poll(coord, entities=[ent], held=held, force_delta=True)
        assert body["addresses"] == "a" * 16

    asyncio.run(run())


def test_a_set_wakes_the_parked_poll_once(coordinator) -> None:  # noqa: F811
    _module, hass, coord = coordinator
    ent = "light.addr3"
    hass.states.set(ent, "off")
    hashes = {"w1": "a" * 16}
    _attach(coord, hashes)

    async def run() -> None:
        _s, body = await _poll(coord, entities=[ent])
        cursor = body["next_cursor"]
        parked = asyncio.create_task(_poll(coord, since=cursor, entities=[ent], timeout=10))
        await asyncio.sleep(0.05)
        assert "w1" in coord._waiters
        started = hass.loop.time()
        hashes["w1"] = "b" * 16
        coord.wake_watch("w1")
        status, body = await asyncio.wait_for(parked, timeout=3)
        assert status == 200 and body["events"] == [] and body["addresses"] == "b" * 16
        assert hass.loop.time() - started < 1.5
        # Told: the next poll parks and times out quietly.
        status, body = await asyncio.wait_for(
            _poll(coord, since=cursor, entities=[ent], timeout=1), timeout=3
        )
        assert status == 204 and body is None

    asyncio.run(run())


def test_a_hash_that_moves_on_its_own_is_found_by_the_next_poll(coordinator) -> None:  # noqa: F811
    """Home Assistant's Network settings changed: no wake, but the next poll
    sees a hash that is not the one last sent and answers at once."""
    _module, hass, coord = coordinator
    ent = "light.addr4"
    hass.states.set(ent, "off")
    hashes = {"w1": "a" * 16}
    _attach(coord, hashes)

    async def run() -> None:
        _s, body = await _poll(coord, entities=[ent])
        cursor = body["next_cursor"]
        hashes["w1"] = "c" * 16
        status, body = await asyncio.wait_for(
            _poll(coord, since=cursor, entities=[ent], timeout=5), timeout=2
        )
        assert status == 200 and body["addresses"] == "c" * 16

    asyncio.run(run())


def test_a_held_hash_that_lags_is_answered_at_once_once(coordinator) -> None:  # noqa: F811
    """The reply carrying the new hash was lost: the watch still reports the
    old one, so its next poll is answered at once, and only once."""
    module, hass, coord = coordinator
    ent = "light.addr5"
    hass.states.set(ent, "off")
    hashes = {"w1": "a" * 16}
    _attach(coord, hashes)

    async def run() -> None:
        _s, body = await _poll(coord, entities=[ent])
        cursor = body["next_cursor"]
        stale = module.HeldConfig(addresses="z" * 16)
        status, body = await asyncio.wait_for(
            _poll(coord, since=cursor, entities=[ent], timeout=5, held=stale), timeout=2
        )
        assert status == 200 and body["addresses"] == "a" * 16
        status, body = await asyncio.wait_for(
            _poll(coord, since=cursor, entities=[ent], timeout=1, held=stale), timeout=3
        )
        assert status == 204

    asyncio.run(run())


def test_the_view_reads_the_held_hash() -> None:
    tree = ast.parse(_VIEWS.read_text(), filename=str(_VIEWS))
    wanted = [
        node
        for node in tree.body
        if (isinstance(node, ast.FunctionDef) and node.name == "_held_hash")
        or (
            isinstance(node, ast.Assign)
            and isinstance(node.targets[0], ast.Name)
            and node.targets[0].id == "_DELTA_TOKEN_MAX_CHARS"
        )
    ]
    namespace: dict[str, Any] = {"Any": Any}
    exec(  # noqa: S102
        compile(
            ast.Module(body=wanted, type_ignores=[]),
            str(_VIEWS),
            "exec",
            flags=__future__.annotations.compiler_flag,
            dont_inherit=True,
        ),
        namespace,
    )
    held_hash = namespace["_held_hash"]
    assert held_hash("a" * 16) == "a" * 16
    for junk in (None, "", 5, True, ["a"], "x" * 65):
        assert held_hash(junk) is None
    source = _VIEWS.read_text()
    assert 'addresses=_held_hash(payload.get("addresses"))' in source


# ── the panel commands ───────────────────────────────────────────────────


def _panel_detects(urls: tuple) -> None:
    sys.modules[f"{cws._PKG}.pairing_ws"] = types.SimpleNamespace(home_urls=lambda _hass: urls)


def test_a_member_reads_and_sets_only_their_own_watch(panel_env) -> None:  # noqa: F811
    env = panel_env
    _panel_detects((LOCAL, EXTERNAL, CLOUD))
    ws = env.ws
    assert _refused(_run(env, ws.ws_device_addresses, ALICE, watch_id="watch-bob"))
    assert _refused(
        _run(env, ws.ws_set_device_addresses, ALICE, watch_id="watch-bob", local_url=LOCAL)
    )
    assert env.base.secrets.get("watch-bob").local_url is None

    reply = _ok(_run(env, ws.ws_device_addresses, ALICE, watch_id="watch-alice"))
    assert reply["watch_id"] == "watch-alice"
    assert reply["detected"] == {"internal": LOCAL, "external": EXTERNAL, "cloud": CLOUD}
    assert (reply["local_url"], reply["remote_url"]) == (LOCAL, EXTERNAL)
    assert (reply["local_source"], reply["remote_source"]) == ("auto", "auto")
    first = reply["hash"]

    reply = _ok(
        _run(env, ws.ws_set_device_addresses, ALICE, watch_id="watch-alice", remote_url="")
    )
    assert (reply["remote_url"], reply["remote_source"]) == (None, "none")
    assert reply["hash"] != first
    # The set moved the hash and woke the watch's poll.
    assert ("watch-alice", False) in env.base.coordinator.woken

    # An administrator sets anyone's.
    reply = _ok(
        _run(env, ws.ws_set_device_addresses, ROOT, watch_id="watch-bob", local_url="http://10.1.1.1")
    )
    assert reply["local_url"] == "http://10.1.1.1" and reply["local_source"] == "set"
    assert _refused(_run(env, ws.ws_device_addresses, BOB, watch_id="watch-alice"))


def test_the_panel_refuses_an_invalid_url(panel_env) -> None:  # noqa: F811
    env = panel_env
    connection = _run(
        env, env.ws.ws_set_device_addresses, ROOT, watch_id="watch-alice", local_url="nope"
    )
    assert connection.results == {}
    assert connection.errors[0][1] == "invalid_url"
    assert "local_url" in connection.errors[0][2]
    assert env.base.secrets.get("watch-alice").local_url is None
    missing = _run(env, env.ws.ws_device_addresses, ROOT, watch_id="watch-nobody")
    assert missing.errors[0][1] == "not_found"


# ── static: capability, op table, setup ──────────────────────────────────


def test_the_capability_is_advertised_and_wired() -> None:
    init = (_PKG_DIR / "__init__.py").read_text()
    const = (_PKG_DIR / "const.py").read_text()
    assert 'WATCH_ADDRESSES_CAPABILITY = "watch_addresses"' in const
    assert "register_capability(WATCH_ADDRESSES_CAPABILITY)" in init
    assert "coordinator.attach_addresses(" in init
    assert "addresses_hash_for(hass, widget_secret_store, watch_id)" in init


def test_both_ops_are_in_the_dispatch_table() -> None:
    tree = ast.parse(_VIEWS.read_text())
    table: dict[str, str] = {}
    for node in tree.body:
        target = getattr(node, "target", None) or (
            node.targets[0] if isinstance(node, ast.Assign) else None
        )
        if isinstance(target, ast.Name) and target.id == "_OP_HANDLERS":
            for key, value in zip(node.value.keys, node.value.values, strict=True):
                table[key.value] = value.id
    assert table["addresses_get"] == "_op_addresses_get"
    assert table["addresses_set"] == "_op_addresses_set"
