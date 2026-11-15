"""The words of the notification service and its blueprint.

``services.yaml`` and the Watch Notification blueprint are what a person reads
in Home Assistant's action and blueprint editors. They speak to both families
of devices: an iPhone or an Android phone, an Apple Watch or a Wear OS watch,
and they say which parts only the Apple apps have (Fast delivery's mirroring
by the iPhone, the iPhone's long press, the named sounds) and what Android
does instead (docs/push.md in the Android repo).

Only words may change in them. Every field key, default, example, selector
and option keeps its exact value, so a saved script or automation validates
the same, which ``_shape`` pins by its digest. A change to a field is then a
deliberate edit of that digest here.

``subtitle``, ``entity_state`` and ``show_state`` were once named as keys of
``data`` but neither app reads them, so the text names them no more. ``data``
still takes any keys (the schema's ``dict``), so a saved automation that sends
them validates as before and they do nothing.
"""

from __future__ import annotations

import ast
import hashlib
import json
import re
from pathlib import Path
from typing import Any

import yaml

_ROOT = Path(__file__).resolve().parents[1]
_SRC = _ROOT / "custom_components" / "wrist_assistant"
_SERVICES = _SRC / "services.yaml"
_BLUEPRINT = _SRC / "blueprints" / "script" / "watch_notification.yaml"
_BLUEPRINT_COPY = _ROOT / "blueprints" / "script" / "wrist_assistant" / "watch_notification.yaml"

_WORD_KEYS = {"name", "description"}
_DEAD_KEYS = ("subtitle", "entity_state", "show_state")


class _BlueprintLoader(yaml.SafeLoader):
    """Reads ``!input name`` as a plain marker, as Home Assistant's loader keeps it."""


_BlueprintLoader.add_constructor(
    "!input", lambda loader, node: {"!input": loader.construct_scalar(node)}
)


def _load(path: Path) -> Any:
    return yaml.load(path.read_text(), Loader=_BlueprintLoader)  # noqa: S506 (a SafeLoader)


def _shape(value: Any) -> Any:
    """Everything but the words: every key, default, selector and option."""
    if isinstance(value, dict):
        return {k: _shape(v) for k, v in value.items() if k not in _WORD_KEYS}
    if isinstance(value, list):
        return [_shape(v) for v in value]
    return value


def _digest(path: Path) -> str:
    text = json.dumps(_shape(_load(path)), sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(text.encode()).hexdigest()


def _words(value: Any, path: str = "") -> list[tuple[str, str]]:
    """Every name and description, with where it sits."""
    found: list[tuple[str, str]] = []
    if isinstance(value, dict):
        for k, v in value.items():
            here = f"{path}.{k}" if path else str(k)
            if k in _WORD_KEYS and isinstance(v, str):
                found.append((here, v))
            else:
                found.extend(_words(v, here))
    elif isinstance(value, list):
        for i, v in enumerate(value):
            found.extend(_words(v, f"{path}[{i}]"))
    return found


def _text(path: Path) -> str:
    return "\n".join(words for _, words in _words(_load(path)))


# ── only words changed ───────────────────────────────────────────────────


SERVICES_SHAPE = "024d482db90c94e06c75361fc23f4290559ee182873aeaa1c6125cd673cbffec"
BLUEPRINT_SHAPE = "b5b4f1bfdbffd1ed3d86e1a9f87dcf17df1fb30e7171fa9e7918a36ed042fac1"


def test_the_service_keeps_every_field_default_and_selector() -> None:
    assert _digest(_SERVICES) == SERVICES_SHAPE


def test_the_blueprint_keeps_every_input_default_selector_and_step() -> None:
    assert _digest(_BLUEPRINT) == BLUEPRINT_SHAPE


def test_the_two_blueprint_copies_are_the_same_file() -> None:
    # The integration installs its own copy; the top level copy is the one a
    # person imports by its source_url.
    assert _BLUEPRINT.read_bytes() == _BLUEPRINT_COPY.read_bytes()


# ── both families ────────────────────────────────────────────────────────


def test_the_service_names_both_families() -> None:
    send = "\n".join(w for _, w in _words(_load(_SERVICES)["send_notification"]))
    for words in ("iPhone", "Android phone", "Apple Watch", "Wear OS"):
        assert words in send, words
    resync = _load(_SERVICES)["force_resync"]["description"]
    assert "iPhone" not in resync and "phone" in resync


def test_the_blueprint_names_both_families() -> None:
    text = _text(_BLUEPRINT)
    for words in ("iPhone", "Android phone", "Apple Watch", "Wear OS"):
        assert words in text, words


def test_icons_say_android_draws_a_material_icon() -> None:
    actions = _load(_SERVICES)["send_notification"]["fields"]["actions"]["description"]
    assert "SF Symbol" in actions
    assert "Material icon" in actions


def test_what_is_apple_only_says_so_and_says_what_android_does() -> None:
    fields = _load(_SERVICES)["send_notification"]["fields"]
    sound = fields["sound"]["description"]
    assert "Fast delivery" in sound and "Apple" in sound
    assert "Android" in sound and "Passive" in sound
    # Silent quiets an Android device too (no sound, still a buzz); Passive is the quiet priority.
    assert "Silent drops that sound there and keeps the buzz" in sound
    assert "once a button tap works" in fields["data"]["description"]
    priority = fields["priority"]["description"]
    assert "Android" in priority and "Do Not Disturb" in priority

    blueprint = _load(_BLUEPRINT)["blueprint"]
    intro = blueprint["description"]
    # The iPhone's long press stays, with what an Android phone does instead.
    assert "long press" in intro and "iPhone" in intro
    assert "Android phone" in intro
    settings = blueprint["input"]["section_settings"]["description"]
    assert "Fast" in settings and "Reliable" in settings
    assert "Wear OS" in settings and "Android" in settings
    bp_sound = blueprint["input"]["section_settings"]["input"]["sound"]["description"]
    assert "Android" in bp_sound and "Passive" in bp_sound
    assert "Silent drops" in bp_sound and "does not quiet" not in bp_sound


# ── data keys no app reads ───────────────────────────────────────────────


def test_no_text_names_a_data_key_no_app_reads() -> None:
    for path in (_SERVICES, _BLUEPRINT, _ROOT / "README.md"):
        text = path.read_text()
        for key in _DEAD_KEYS:
            assert key not in text, (path.name, key)
    data = _load(_SERVICES)["send_notification"]["fields"]["data"]["description"]
    for key in ("auto_dismiss", "live_stream", "live_stream_watch"):
        assert key in data, key


def _schema_value(key: str) -> ast.expr:
    tree = ast.parse((_SRC / "__init__.py").read_text())
    for node in ast.walk(tree):
        if (
            isinstance(node, ast.Assign)
            and any(isinstance(t, ast.Name) and t.id == "_SEND_NOTIFICATION_SCHEMA" for t in node.targets)
        ):
            mapping = node.value.args[0]
            assert isinstance(mapping, ast.Dict)
            for k, v in zip(mapping.keys, mapping.values, strict=True):
                if isinstance(k, ast.Call) and isinstance(k.args[0], ast.Constant) and k.args[0].value == key:
                    return v
    raise AssertionError(f"no {key} in _SEND_NOTIFICATION_SCHEMA")


def test_a_saved_automation_that_sends_them_still_validates() -> None:
    # `data` is a plain dict: any keys pass, the old ones included, and the
    # apps ignore what they do not read.
    value = _schema_value("data")
    assert isinstance(value, ast.Name) and value.id == "dict"


# ── outward words ────────────────────────────────────────────────────────


def test_no_dash_breaks_a_sentence() -> None:
    for path in (_SERVICES, _BLUEPRINT):
        raw = path.read_text()
        assert "—" not in raw and "–" not in raw, path.name
        for where, words in _words(_load(path)):
            for line in words.splitlines():
                assert not re.search(r"\S - ", line), (path.name, where, line)
