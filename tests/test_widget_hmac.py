"""In-process tests for ``widget_hmac.validate_wa_request``.

The validator is loaded for real into a throwaway package over stubbed Home
Assistant modules, and fed a stand-in request whose headers are plain strings,
the way aiohttp hands them over. aiohttp decodes header bytes as UTF-8 with
surrogate escapes, so a header can arrive as non-ASCII text or carry a lone
surrogate for a byte that is not UTF-8. Every such header must be refused with
``WAHMACError``, which the views turn into the uniform 401, never let through
as a ``TypeError`` or ``UnicodeEncodeError`` that becomes a 500.
"""

from __future__ import annotations

import contextlib
import hashlib
import hmac
import importlib.util
import sys
import types
from pathlib import Path

import pytest

_SRC = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"
_PKG = "wa_widget_hmac_test_pkg"

WATCH = "0123456789abcdef0123456789abcdef"
SECRET = b"k" * 32
NOW = 1_800_000_000


@contextlib.contextmanager
def _loaded_hmac():
    saved = dict(sys.modules)
    try:
        for name, attrs in (
            ("homeassistant", {}),
            ("homeassistant.core", {"HomeAssistant": type("HomeAssistant", (), {})}),
            ("homeassistant.helpers", {}),
            ("homeassistant.helpers.storage", {"Store": object}),
            ("homeassistant.util", {}),
            ("homeassistant.util.dt", {"parse_datetime": lambda v: None, "utcnow": lambda: None}),
        ):
            module = sys.modules.get(name) or types.ModuleType(name)
            for key, value in attrs.items():
                if not hasattr(module, key):
                    setattr(module, key, value)
            sys.modules[name] = module
        pkg = types.ModuleType(_PKG)
        pkg.__path__ = []
        sys.modules[_PKG] = pkg
        loaded = None
        for name in ("const", "widget_secret_store", "widget_hmac"):
            spec = importlib.util.spec_from_file_location(f"{_PKG}.{name}", _SRC / f"{name}.py")
            loaded = importlib.util.module_from_spec(spec)
            sys.modules[f"{_PKG}.{name}"] = loaded
            spec.loader.exec_module(loaded)
        yield loaded
    finally:
        for key in list(sys.modules):
            if key not in saved:
                del sys.modules[key]
        sys.modules.update(saved)


class _SecretStore:
    def get(self, watch_id: str):
        if watch_id != WATCH:
            return None
        return types.SimpleNamespace(secret_bytes=SECRET, algo="hmac-sha256")


def _headers(body: bytes, **overrides: str) -> dict[str, str]:
    nonce = overrides.get("X-WA-Nonce", "00112233445566778899aabbccddeeff")
    # Signed over the raw bytes, so a nonce with an escaped byte still carries
    # the signature a client sending that byte would compute.
    canonical = f"v2|delta|{WATCH}|{NOW}|{nonce}".encode("utf-8", "surrogateescape") + b"\n" + body
    headers = {
        "X-WA-Version": "2",
        "X-WA-Op": "delta",
        "X-WA-Watch": WATCH,
        "X-WA-Ts": str(NOW),
        "X-WA-Nonce": nonce,
        "X-WA-Sig": hmac.new(SECRET, canonical, hashlib.sha256).hexdigest(),
    }
    headers.update(overrides)
    return headers


def _validate(mod, headers: dict[str, str], body: bytes = b"{}"):
    request = types.SimpleNamespace(headers=headers)
    cache = mod.WANonceCache(ttl_seconds=90)
    return mod.validate_wa_request(request, body, _SecretStore(), cache, now=NOW)


# A byte that is not UTF-8, as aiohttp's surrogateescape decoding hands it over.
_RAW_FF = b"\xff".decode("utf-8", "surrogateescape")


def test_a_well_formed_request_still_passes() -> None:
    with _loaded_hmac() as mod:
        validated = _validate(mod, _headers(b"{}"))
        assert validated.watch_id == WATCH
        assert validated.op == "delta"


@pytest.mark.parametrize(
    "header, value",
    [
        ("X-WA-Sig", "é"),
        ("X-WA-Sig", "a" * 63 + "é"),
        ("X-WA-Nonce", _RAW_FF),
        ("X-WA-Nonce", "nonce-é"),
        ("X-WA-Op", "delta" + _RAW_FF),
        ("X-WA-Watch", WATCH + "é"),
        ("X-WA-Ts", "١٨٠٠٠٠٠٠٠٠"),
    ],
)
def test_a_non_ascii_header_is_refused_like_any_other_bad_request(header, value) -> None:
    with _loaded_hmac() as mod:
        with pytest.raises(mod.WAHMACError) as raised:
            _validate(mod, _headers(b"{}", **{header: value}))
        assert raised.value.reason == "invalid_header"


def test_a_non_ascii_signature_for_a_known_watch_is_refused_not_crashed() -> None:
    """The audit's sequence: a current timestamp, a known watch id, a valid
    looking nonce, and a signature of one accented letter. Before the fix the
    secret lookup passed and ``hmac.compare_digest`` raised ``TypeError``."""
    with _loaded_hmac() as mod:
        headers = _headers(b"{}", **{"X-WA-Sig": "é"})
        with pytest.raises(mod.WAHMACError):
            _validate(mod, headers)
