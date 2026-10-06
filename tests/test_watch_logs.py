"""In-process tests for the watch logs through Home Assistant (step 4 of the
phone watch link removal, batch A).

The real ``watch_logs_store.py`` over the index ``FakeStore`` with real
files under the test's folder, the signed ``watch_logs_put`` op pulled out
of ``wa_v2_views.py`` by name, and the real ``diagnostics.py``: the device
download (the upload, redacted once more) and the config entry download
(which devices sent logs, the certificate only as present or not).

Static checks at the bottom: the op in the dispatch table, the capability,
the setup wiring, and the logs dropped with the device and the entry.
"""

from __future__ import annotations

import asyncio
import json
import types
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import pytest
from test_client_certificate import (
    OTHER_USER,
    USER,
    _Ctx,
    _op_table,
    _ops,
    _stub,
    cert_body,
    loaded_package,
    new_store,
)
from test_http_actions_store import FakeStore
from test_page_images_store import FakeHass

_PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_PKG = "wa_client_certificate_test_pkg"
KEY = "wrist_assistant.watch_logs"
FOLDER = "wrist_assistant_watch_logs"
MAX_BODY = 2 * 1024 * 1024
WATCH = "0123456789abcdef0123456789abcdef"
OTHER = "fedcba9876543210fedcba9876543210"
PHONE = "iphone:phone-A"


def bundle(**extra: Any) -> dict[str, Any]:
    out: dict[str, Any] = {
        "source": "watch",
        "events": [{"t": "2026-10-06T10:00:00Z", "kind": "connect", "detail": "ok"}],
        "extraLogs": {"connection": "10:00 GET https://ha.example/api/ ok"},
    }
    out.update(extra)
    return out


@pytest.fixture
def pkg():
    with loaded_package() as loaded:
        yield loaded


def new_logs(pkg, tmp_path: Path):
    hass = FakeHass(tmp_path)
    store = pkg.logs_mod.WatchLogsStore(hass)
    asyncio.run(store.async_load())
    return store


def folder(tmp_path: Path) -> Path:
    return tmp_path / ".storage" / FOLDER


# ── the store ────────────────────────────────────────────────────────────


def test_a_put_writes_one_file_and_an_index_entry(pkg, tmp_path) -> None:
    store = new_logs(pkg, tmp_path)
    entry = asyncio.run(store.async_put(WATCH, bundle()))
    path = folder(tmp_path) / f"w-{WATCH}.json"
    on_disk = json.loads(path.read_text())
    encoded = json.dumps(bundle(), ensure_ascii=False, separators=(",", ":"))
    assert on_disk == {
        "watch_id": WATCH,
        "received_at": entry.received_at,
        "bytes": len(encoded.encode()),
        "bundle": bundle(),
    }
    assert entry.bytes == len(encoded.encode())
    assert entry.received_at.endswith("Z")
    datetime.fromisoformat(entry.received_at.replace("Z", "+00:00")).astimezone(UTC)
    assert FakeStore.files[KEY] == {
        "watches": {WATCH: {"received_at": entry.received_at, "bytes": entry.bytes}}
    }
    assert sorted(p.name for p in folder(tmp_path).iterdir()) == [f"w-{WATCH}.json"]


def test_an_id_that_is_not_a_safe_file_name_is_named_by_its_hash(pkg, tmp_path) -> None:
    store = new_logs(pkg, tmp_path)
    asyncio.run(store.async_put(PHONE, bundle()))
    [name] = [p.name for p in folder(tmp_path).iterdir()]
    assert name.startswith("h-") and len(name) == len("h-") + 64 + len(".json")
    upload = asyncio.run(store.async_read(PHONE))
    assert upload["watch_id"] == PHONE and upload["bundle"] == bundle()


def test_only_the_latest_upload_is_kept(pkg, tmp_path) -> None:
    store = new_logs(pkg, tmp_path)
    asyncio.run(store.async_put(WATCH, bundle(n=1)))
    asyncio.run(store.async_put(OTHER, bundle(n=9)))
    asyncio.run(store.async_put(WATCH, bundle(n=2)))
    assert asyncio.run(store.async_read(WATCH))["bundle"]["n"] == 2
    assert asyncio.run(store.async_read(OTHER))["bundle"]["n"] == 9
    assert len(list(folder(tmp_path).iterdir())) == 2
    assert [row["watch_id"] for row in store.listing()] == sorted(
        [WATCH, OTHER], key=lambda w: (store.entry(w).received_at, w), reverse=True
    )
    assert set(store.listing()[0]) == {"watch_id", "received_at", "bytes"}


def test_a_bundle_that_is_not_an_object_is_refused(pkg, tmp_path) -> None:
    store = new_logs(pkg, tmp_path)
    for bad in (None, [], "logs"):
        with pytest.raises(pkg.logs_mod.WatchLogsError, match="bundle must be an object") as exc:
            asyncio.run(store.async_put(WATCH, bad))
        assert exc.value.code == "invalid"
    assert store.listing() == [] and not folder(tmp_path).exists()


def test_the_uploads_survive_a_restart(pkg, tmp_path) -> None:
    store = new_logs(pkg, tmp_path)
    entry = asyncio.run(store.async_put(WATCH, bundle()))
    again = new_logs(pkg, tmp_path)
    assert again.entry(WATCH) == entry
    assert asyncio.run(again.async_read(WATCH))["bundle"] == bundle()


def test_the_start_drops_missing_files_and_stray_ones(pkg, tmp_path) -> None:
    store = new_logs(pkg, tmp_path)
    asyncio.run(store.async_put(WATCH, bundle()))
    asyncio.run(store.async_put(OTHER, bundle()))
    (folder(tmp_path) / f"w-{OTHER}.json").unlink()
    (folder(tmp_path) / "w-stray.json").write_text("{}")
    (folder(tmp_path) / f"w-{WATCH}.tmp").write_text("half")
    again = new_logs(pkg, tmp_path)
    asyncio.run(again.async_start())
    assert again.entry(OTHER) is None and again.entry(WATCH) is not None
    assert sorted(p.name for p in folder(tmp_path).iterdir()) == [f"w-{WATCH}.json"]
    assert list(FakeStore.files[KEY]["watches"]) == [WATCH]


def test_an_unreadable_index_starts_empty_and_the_next_put_writes(pkg, tmp_path) -> None:
    FakeStore.unreadable.add(KEY)
    store = new_logs(pkg, tmp_path)
    assert store.listing() == []
    FakeStore.unreadable.clear()
    asyncio.run(store.async_put(WATCH, bundle()))
    assert WATCH in FakeStore.files[KEY]["watches"]


def test_forget_drops_the_entry_and_the_file(pkg, tmp_path) -> None:
    store = new_logs(pkg, tmp_path)
    asyncio.run(store.async_put(WATCH, bundle()))
    asyncio.run(store.async_put(OTHER, bundle()))
    assert store.forget(WATCH) is True
    assert store.entry(WATCH) is None
    assert asyncio.run(store.async_read(WATCH)) is None
    assert sorted(p.name for p in folder(tmp_path).iterdir()) == [f"w-{OTHER}.json"]
    assert list(FakeStore.files[KEY]["watches"]) == [OTHER]
    assert store.forget(WATCH) is False


def test_async_remove_deletes_the_index_and_the_folder(pkg, tmp_path) -> None:
    store = new_logs(pkg, tmp_path)
    asyncio.run(store.async_put(WATCH, bundle()))
    asyncio.run(pkg.logs_mod.WatchLogsStore(FakeHass(tmp_path)).async_remove())
    assert KEY not in FakeStore.files and KEY in FakeStore.removed
    assert not folder(tmp_path).exists()


# ── the signed op ────────────────────────────────────────────────────────


@pytest.fixture
def env(pkg, tmp_path):
    store = new_logs(pkg, tmp_path)
    domain = types.SimpleNamespace(watch_logs_store=store)
    ops = _ops(pkg, names=("_op_watch_logs_put",), prefix="_WATCH_LOGS_NONE_")
    return types.SimpleNamespace(pkg=pkg, store=store, domain=domain, op=ops["_op_watch_logs_put"])


def put(env, payload: dict, *, watch_id: str = WATCH, body: bytes | None = None):
    return asyncio.run(
        env.op(_Ctx(env.domain, "watch_logs_put", payload, watch_id=watch_id, body=body))
    )


def test_the_op_stores_the_bundle_under_the_signing_id(env) -> None:
    reply = put(env, {"bundle": bundle(), "watch_id": OTHER})
    entry = env.store.entry(WATCH)
    assert (reply.status, reply.body) == (
        200, {"ok": True, "received_at": entry.received_at, "bytes": entry.bytes}
    )
    assert env.store.entry(OTHER) is None


def test_a_body_over_2_mib_is_a_signed_413(env) -> None:
    reply = put(env, {"bundle": {}}, body=b"x" * (MAX_BODY + 1))
    assert reply.status == 413
    assert reply.body == {"ok": False, "error": "too_large", "message": "logs are at most 2 MiB"}
    assert env.store.listing() == []


def test_a_body_of_exactly_2_mib_is_taken(env) -> None:
    filler = "a" * (MAX_BODY - 200)
    payload = {"bundle": {"extraLogs": {"connection": filler}}}
    body = json.dumps(payload).encode()
    assert len(body) <= MAX_BODY
    reply = put(env, payload, body=body)
    assert reply.status == 200 and reply.body["bytes"] > MAX_BODY - 300


def test_no_bundle_is_a_signed_400(env) -> None:
    reply = put(env, {"logs": {}})
    assert (reply.status, reply.body) == (
        400, {"ok": False, "error": "invalid", "message": "bundle must be an object"}
    )


def test_no_store_is_a_signed_503(env) -> None:
    env.domain.watch_logs_store = None
    reply = put(env, {"bundle": bundle()})
    assert (reply.status, reply.body) == (
        503, {"ok": False, "error": "unavailable", "message": "integration not ready"}
    )


# ── diagnostics ──────────────────────────────────────────────────────────


def _load_diagnostics(pkg):
    _stub(f"{_PKG}.api", MAX_EVENTS_BUFFER=100)
    return pkg.load("diagnostics")


class _Device:
    def __init__(self, *identifiers: tuple[str, str]) -> None:
        self.identifiers = set(identifiers)


@pytest.fixture
def diag(pkg, tmp_path):
    logs = new_logs(pkg, tmp_path)
    certs = new_store(pkg, tmp_path)
    secrets = {
        WATCH: types.SimpleNamespace(user_id=USER),
        OTHER: types.SimpleNamespace(user_id=None),
    }
    coordinator = types.SimpleNamespace(_sessions={}, _cursor=7, _generation=1, _events=[])
    data = types.SimpleNamespace(
        coordinator=coordinator,
        notification_store=types.SimpleNamespace(
            all_tokens={}, all_entries={}, ios_tokens_moved=True
        ),
        apns_client=None,
        watch_config_store=types.SimpleNamespace(diagnostics=dict),
        watch_logs_store=logs,
        client_certificate_store=certs,
        widget_secret_store=types.SimpleNamespace(get=secrets.get),
    )
    entry = types.SimpleNamespace(runtime_data=data)
    return types.SimpleNamespace(
        mod=_load_diagnostics(pkg), logs=logs, certs=certs, entry=entry
    )


LEAKY = {
    "source": "watch",
    "access_token": "eyJhbGciOiJIUzI1NiJ9.leak-access",
    "settings": {
        "password": "leak-password",
        "passphrase": "leak-passphrase",
        "pkcs12": "MIIleakpkcs12",
        "clientCertificate": {"p12": "MIIleakp12", "fingerprint": "ab" * 32},
        "secret_b64": "leak-secret-b64",
        "Authorization": "Bearer leak-header",
        "has_token": True,
        "token": None,
        "complications_token": 42,
        "passcode": 5464,
    },
    "events": [
        {"detail": "GET https://ha.example/api/states?access_token=leak-query&x=1"},
        {"detail": "header Authorization: Bearer leak-bearer-in-line"},
        {"detail": "sent bearer leak-bare-bearer-token-value"},
        {"detail": '{"password": "leak-embedded", "user": "jesse"}'},
        {"detail": "webhook https://relay.example/w/leakwebhooktoken123/alerts"},
        {"detail": "plain line with no secrets in it"},
    ],
    "extraLogs": {"connection": "10:00 POST passphrase=leak-kv&ok=1\n10:01 done"},
}


def test_the_device_download_carries_the_upload_redacted(diag) -> None:
    asyncio.run(diag.logs.async_put(WATCH, LEAKY))
    asyncio.run(diag.certs.async_put(USER, cert_body()))
    device = _Device(("wrist_assistant", f"watch_{WATCH}"), ("other", "x"))
    out = asyncio.run(diag.mod.async_get_device_diagnostics(None, diag.entry, device))
    text = json.dumps(out)
    assert "leak" not in text
    assert cert_body()["pkcs12"][:20] not in text and cert_body()["passphrase"] not in text
    redacted = out["logs"]["bundle"]
    settings = redacted["settings"]
    assert settings["password"] == settings["passphrase"] == settings["pkcs12"] == "**REDACTED**"
    assert settings["clientCertificate"]["p12"] == "**REDACTED**"
    assert settings["Authorization"] == "**REDACTED**"
    # Kept: flags, nulls and counters say nothing secret.
    assert settings["has_token"] is True and settings["token"] is None
    assert settings["complications_token"] == 42
    assert settings["passcode"] == "**REDACTED**"
    assert redacted["events"][5]["detail"] == "plain line with no secrets in it"
    assert "x=1" in redacted["events"][0]["detail"]
    assert "ok=1" in redacted["extraLogs"]["connection"]
    assert "/w/**REDACTED**/alerts" in redacted["events"][4]["detail"]
    assert '"user": "jesse"' in redacted["events"][3]["detail"]
    assert out["watch_id"] == WATCH and out["user_bound"] is True
    assert out["logs"]["received_at"] == diag.logs.entry(WATCH).received_at
    fp = cert_body()["fingerprint"]
    assert out["client_certificate"]["present"] is True
    assert out["client_certificate"]["fingerprint_prefix"] == fp[:8]
    assert fp not in text


def test_the_device_download_without_logs_or_user(diag) -> None:
    out = asyncio.run(
        diag.mod.async_get_device_diagnostics(
            None, diag.entry, _Device(("wrist_assistant", f"watch_{OTHER}"))
        )
    )
    assert out == {"watch_id": OTHER, "user_bound": False, "client_certificate": None, "logs": None}
    out = asyncio.run(
        diag.mod.async_get_device_diagnostics(None, diag.entry, _Device(("wrist_assistant", "entry-id")))
    )
    assert out == {"watch_id": None, "logs": None}


def test_a_bound_user_with_no_record_shows_absent(diag) -> None:
    out = asyncio.run(
        diag.mod.async_get_device_diagnostics(
            None, diag.entry, _Device(("wrist_assistant", f"watch_{WATCH}"))
        )
    )
    assert out["client_certificate"] == {"present": False, "revision": 0}


def test_the_entry_download_lists_logs_and_certificates_only(diag) -> None:
    asyncio.run(diag.logs.async_put(WATCH, LEAKY))
    asyncio.run(diag.certs.async_put(USER, cert_body()))
    asyncio.run(diag.certs.async_put(OTHER_USER, cert_body()))
    diag.certs.delete(OTHER_USER)
    out = asyncio.run(diag.mod.async_get_config_entry_diagnostics(None, diag.entry))
    entry = diag.logs.entry(WATCH)
    assert out["watch_logs"] == [
        {"watch_id": WATCH, "received_at": entry.received_at, "bytes": entry.bytes}
    ]
    users = out["client_certificates"]["users"]
    assert users[USER]["present"] is True and users[USER]["revision"] == 1
    assert users[USER]["fingerprint_prefix"] == cert_body()["fingerprint"][:8]
    assert users[OTHER_USER] == {
        "present": False,
        "revision": 2,
        "updated_at": users[OTHER_USER]["updated_at"],
        "fingerprint_prefix": None,
    }
    text = json.dumps(out)
    assert "leak" not in text and cert_body()["passphrase"] not in text
    assert cert_body()["fingerprint"] not in text


@pytest.mark.parametrize(
    ("line", "expected"),
    [
        ("Authorization: Basic dXNlcjpwYXNz", "Authorization: **REDACTED**"),
        ("token=abc123&page=2", "token=**REDACTED**&page=2"),
        ("refresh_token: 'abc'", "refresh_token: '**REDACTED**'"),
        ("Bearer   abc.def.ghi", "Bearer   **REDACTED**"),
        ("nothing to see", "nothing to see"),
    ],
)
def test_the_text_rules(diag, line, expected) -> None:
    assert diag.mod.redact_text(line) == expected


# ── static: dispatch, capability, setup, removal ─────────────────────────


def test_the_op_is_in_the_dispatch_table() -> None:
    assert _op_table()["watch_logs_put"] == "_op_watch_logs_put"


def test_the_watch_logs_capability_is_advertised() -> None:
    init = (_PKG_DIR / "__init__.py").read_text()
    const = (_PKG_DIR / "const.py").read_text()
    assert "register_capability(WATCH_LOGS_CAPABILITY)" in init
    assert 'WATCH_LOGS_CAPABILITY = "watch_logs"' in const
    assert f'WATCH_LOGS_STORAGE_KEY = "{KEY}"' in const
    assert "WATCH_LOGS_MAX_BODY_BYTES = 2 * 1024 * 1024" in const


def test_setup_loads_and_sweeps_the_store() -> None:
    init = (_PKG_DIR / "__init__.py").read_text()
    assert "await watch_logs_store.async_load()" in init
    assert "await watch_logs_store.async_start()" in init
    assert "watch_logs_store=watch_logs_store," in init
    assert f'_FOLDER = "{FOLDER}"' in (_PKG_DIR / "watch_logs_store.py").read_text()


def test_the_logs_go_with_the_device_the_forget_and_the_entry() -> None:
    init = (_PKG_DIR / "__init__.py").read_text()
    device_removal = init.split("async def async_remove_config_entry_device", 1)[1].split(
        "async def async_remove_entry", 1
    )[0]
    assert "domain_data.watch_logs_store.forget(watch_id)" in device_removal
    assert "await WatchLogsStore(hass).async_remove()" in init
    forget = (_PKG_DIR / "complication_ws.py").read_text()
    assert "logs_store.forget(watch_id)" in forget


def test_diagnostics_define_the_device_download() -> None:
    source = (_PKG_DIR / "diagnostics.py").read_text()
    assert "async def async_get_device_diagnostics(" in source
    assert '"client_certificates": data.client_certificate_store.diagnostics()' in source
    assert '"watch_logs": data.watch_logs_store.listing()' in source
