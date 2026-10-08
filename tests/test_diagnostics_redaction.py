"""The second redaction pass a diagnostics download goes through, with no
Home Assistant.

``diagnostics.py`` promises that even an older or broken app cannot put a
token or a password into a file a user mails to support. These tests load
the module on its own under three small stubs (Home Assistant's core, and
the two names it reads from the integration) and drive ``redact_text`` and
``redact`` directly.
"""

from __future__ import annotations

import contextlib
import importlib.util
import sys
import types
from pathlib import Path

import pytest

_PKG = "custom_components.wrist_assistant"
_SRC = Path(__file__).resolve().parents[1] / "custom_components" / "wrist_assistant"

R = "**REDACTED**"


def _stub(name: str, **attrs: object) -> types.ModuleType:
    module = sys.modules.get(name) or types.ModuleType(name)
    for key, value in attrs.items():
        setattr(module, key, value)
    sys.modules[name] = module
    return module


@contextlib.contextmanager
def _loaded_diagnostics():
    saved = dict(sys.modules)
    try:
        if _PKG not in sys.modules:
            pkg = types.ModuleType(_PKG)
            pkg.__path__ = []
            sys.modules[_PKG] = pkg
        _stub("homeassistant")
        _stub("homeassistant.core", HomeAssistant=object)
        _stub(f"{_PKG}.api", MAX_EVENTS_BUFFER=1000)
        _stub(f"{_PKG}.const", DOMAIN="wrist_assistant", WristAssistantConfigEntry=object)
        name = f"{_PKG}.diagnostics"
        spec = importlib.util.spec_from_file_location(name, _SRC / "diagnostics.py")
        module = importlib.util.module_from_spec(spec)
        sys.modules[name] = module
        spec.loader.exec_module(module)
        yield module
    finally:
        for key in list(sys.modules):
            if key not in saved:
                del sys.modules[key]
        sys.modules.update(saved)


@pytest.fixture(scope="module")
def diag():
    with _loaded_diagnostics() as module:
        yield module


# ── the user and password in a URL ───────────────────────────────────────


@pytest.mark.parametrize(
    ("text", "expected"),
    [
        (
            "http://admin:hunter2@192.168.1.20:8123/api",
            f"http://{R}@192.168.1.20:8123/api",
        ),
        (
            "https://jesse:s3cret@ha.example.com/",
            f"https://{R}@ha.example.com/",
        ),
        (
            "ws://user:pw@homeassistant.local:8123/api/websocket",
            f"ws://{R}@homeassistant.local:8123/api/websocket",
        ),
        (
            "wss://user:pw@ha.example.com/api/websocket",
            f"wss://{R}@ha.example.com/api/websocket",
        ),
        (
            "rtsp://admin:cam-pass@10.0.0.5:554/stream1",
            f"rtsp://{R}@10.0.0.5:554/stream1",
        ),
    ],
)
def test_a_url_loses_its_user_and_password_but_keeps_scheme_and_host(
    diag, text: str, expected: str
) -> None:
    assert diag.redact_text(text) == expected


def test_the_password_never_survives_anywhere_in_a_log_line(diag) -> None:
    line = "Camera stream failed: rtsp://admin:cam-pass@10.0.0.5:554/s1 (timeout)"
    out = diag.redact_text(line)
    assert "cam-pass" not in out
    assert "admin" not in out
    assert out == f"Camera stream failed: rtsp://{R}@10.0.0.5:554/s1 (timeout)"


def test_a_user_with_no_password_is_redacted_too(diag) -> None:
    """A lone user part is often a token (`https://<token>@host`)."""
    assert diag.redact_text("https://ghp_abc123@github.com/x") == f"https://{R}@github.com/x"


def test_a_password_with_a_bare_at_sign_is_covered_whole(diag) -> None:
    out = diag.redact_text("http://me:p@ss@ha.local:8123/")
    assert out == f"http://{R}@ha.local:8123/"
    assert "ss@" not in out.replace(f"{R}@", "")


def test_an_at_sign_in_a_query_string_is_left_alone(diag) -> None:
    text = "https://ha.example.com/api/notify?to=someone@example.com&x=1"
    assert diag.redact_text(text) == text


def test_an_at_sign_in_a_path_or_fragment_is_left_alone(diag) -> None:
    for text in (
        "https://ha.example.com/users/@jesse/profile",
        "https://ha.example.com/page#me@there",
        "https://ha.example.com?q=@",
    ):
        assert diag.redact_text(text) == text


def test_a_url_with_no_user_is_left_alone(diag) -> None:
    text = "https://ha.example.com:8123/api/states then mail me@example.com"
    assert diag.redact_text(text) == text


def test_json_escaped_slashes_are_still_matched(diag) -> None:
    """Foundation's JSON writer escapes `/`, so a URL inside an embedded JSON
    log reads `http:\\/\\/user:pass@host`."""
    text = '{"url":"http:\\/\\/admin:pw@10.0.0.5:8123\\/api"}'
    assert diag.redact_text(text) == f'{{"url":"http:\\/\\/{R}@10.0.0.5:8123\\/api"}}'


def test_a_url_under_a_secret_looking_user_keeps_its_host(diag) -> None:
    """Without the URL rule first, `api_key:pass@host` would read as a
    `key: value` pair and take the host with it."""
    assert diag.redact_text("https://api_key:pass@host.example/x") == f"https://{R}@host.example/x"


def test_redacting_twice_changes_nothing_more(diag) -> None:
    once = diag.redact_text("rtsp://a:b@cam/1 and https://c:d@ha/")
    assert diag.redact_text(once) == once


def test_redact_reaches_a_url_nested_in_a_log_bundle(diag) -> None:
    bundle = {
        "entries": [
            {"message": "Opening rtsp://admin:cam-pass@10.0.0.5/stream"},
            {"message": "fine"},
        ],
        "settings": {"base_url": "https://jesse:s3cret@ha.example.com"},
    }
    out = diag.redact(bundle)
    assert out["entries"][0]["message"] == f"Opening rtsp://{R}@10.0.0.5/stream"
    assert out["entries"][1]["message"] == "fine"
    assert out["settings"]["base_url"] == f"https://{R}@ha.example.com"


# ── the rules that were there before still hold ───────────────────────────


def test_the_existing_rules_still_apply(diag) -> None:
    assert diag.redact_text("Authorization: Bearer abc.def") == f"Authorization: {R}"
    assert diag.redact_text("password=hunter2&x=1") == f"password={R}&x=1"
    assert diag.redact_text("/api/webhook/w/abcdefgh1234") == f"/api/webhook/w/{R}"
