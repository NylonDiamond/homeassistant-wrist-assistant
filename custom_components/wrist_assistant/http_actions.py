"""HTTP actions: the rules for the home's library, with no Home Assistant in it.

Step 4d batch 4 (``docs/pages_in_home_assistant_step4.md`` in the app repo).
The library of HTTP requests a watch can fire used to live only on the
iPhone, in its Keychain, and every device sent its requests itself. Home
Assistant now keeps one library for the whole home and sends the request on
a device's behalf (``http_actions_store.py`` keeps it,
``http_actions_runner.py`` sends it). This module is the part both of those
and the tests share: plain functions over plain JSON.

The stored document is the phone's own ``HTTPActionConfig`` JSON, unchanged:
``{"schemaVersion": 1, "actions": [HTTPAction], "globalVariables":
[HTTPGlobalVariable]}``. Everything here follows the Swift rules in the app's
``Shared/HTTPActionConfig.swift`` (``makeURLRequest``, ``applyingGlobals``,
the escaping table, ``responseSnippet``, ``promptVariables``) and
``Shared/HTTPResponseExtractor.swift`` case for case. The app writes case
files from the live Swift code and the tests run every one of them against
this module, so a change to either side shows up as a failing case.

Reading a document is as forgiving as the Swift decoder: a missing field
takes the decoder's fallback (``method`` POST, ``bodyContentType`` none, a
variable's ``kind`` text), and a reply setting with an unknown ``source`` is
no reply setting at all. :func:`validate_document` is the strict check a save
must pass; the readers never need it.
"""

from __future__ import annotations

import base64
import hashlib
import json
import re
import unicodedata
import uuid
from dataclasses import dataclass, field
from typing import Any

# ── the shape ────────────────────────────────────────────────────────────

SCHEMA_VERSION = 1
METHODS = ("GET", "POST", "PUT", "PATCH", "DELETE")
# Verbs that carry a body and an automatic Content-Type.
BODY_METHODS = frozenset({"POST", "PUT", "PATCH", "DELETE"})
# Body type to the Content-Type it implies (`HTTPBodyType.contentType`).
BODY_CONTENT_TYPES: dict[str, str | None] = {
    "none": None,
    "json": "application/json",
    "form": "application/x-www-form-urlencoded",
    "text": "text/plain",
    "audio": "audio/mp4",
}
VARIABLE_KINDS = ("text", "number")
REPLY_SOURCES = ("statusCode", "bodyText", "jsonField", "header", "regex")
# Seconds, when an action sets none (`HTTPAction.defaultTimeout`).
DEFAULT_TIMEOUT = 10
# Compact UTF-8 JSON size the stored document may reach.
MAX_DOCUMENT_BYTES = 256 * 1024
# The token charset of a variable key (`HTTPAction.tokenRegex`).
KEY_RE = re.compile(r"[A-Za-z0-9_]+")
# How much of a body the snippet reads, and how long it may be in characters.
SNIPPET_READ_BYTES = 2048
SNIPPET_LIMIT = 120
# How much of a body a regex reply reads (`regexBodyByteCap`).
REGEX_BODY_BYTE_CAP = 256 * 1024
# How many JSON leaves the test command lists (`discoverPaths` default).
DISCOVER_LIMIT = 40
# The name a nameless action goes by (`HTTPAction.labelName`). Never the URL,
# which can carry a token.
FALLBACK_NAME = "HTTP Action"

_UUID_RE = re.compile(
    r"[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}"
)


class HTTPActionsInvalid(Exception):
    """A document, an action or a request that breaks the rules."""

    code = "invalid"

    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message


class RequestError(Exception):
    """``HTTPAction.RequestError``: the URL is empty, or not an http(s) URL.

    ``code`` is the case's name in Swift (``emptyURL`` or ``invalidURL``) and
    ``message`` the words a device shows. The words leave the URL out, since
    it may hold a token.
    """

    def __init__(self, code: str) -> None:
        self.code = code
        self.message = (
            "The URL is empty." if code == "emptyURL" else "The URL is not valid."
        )
        super().__init__(self.message)


# ── Swift's character classes ────────────────────────────────────────────

# `CharacterSet.whitespacesAndNewlines`: tab, the line breaks, U+0085 and
# every Z category character. `CharacterSet.whitespaces` is tab and Zs only.
_LINE_BREAKS = "\n\x0b\x0c\r\x85"


def _is_whitespace(char: str) -> bool:
    return char == "\t" or unicodedata.category(char) == "Zs"


def _is_whitespace_or_newline(char: str) -> bool:
    return (
        char == "\t"
        or char in _LINE_BREAKS
        or unicodedata.category(char) in ("Zs", "Zl", "Zp")
    )


def trim(text: str) -> str:
    """``trimmingCharacters(in: .whitespacesAndNewlines)``."""
    start, end = 0, len(text)
    while start < end and _is_whitespace_or_newline(text[start]):
        start += 1
    while end > start and _is_whitespace_or_newline(text[end - 1]):
        end -= 1
    return text[start:end]


def _trim_spaces(text: str) -> str:
    """``trimmingCharacters(in: .whitespaces)``: line breaks stay."""
    start, end = 0, len(text)
    while start < end and _is_whitespace(text[start]):
        start += 1
    while end > start and _is_whitespace(text[end - 1]):
        end -= 1
    return text[start:end]


# ICU's `\s`, the Unicode White_Space property, which the snippet collapses.
_WHITE_SPACE_RUN = re.compile(
    "[\t\n\x0b\x0c\r \x85\xa0  -     　]+"
)


def _graphemes(text: str) -> list[str]:
    """Split text into what Swift counts as characters, near enough.

    ``String.count`` counts grapheme clusters, so an emoji with a skin tone
    or a letter with a combining accent is one character there and two or
    more code points here. This keeps the common joiners with the character
    before them: combining marks, variation selectors, skin tones, tags, the
    zero width joiner and what follows it, a regional indicator pair and
    CR LF. It is not the full Unicode segmentation, which matters only to
    where a long snippet is cut.
    """
    clusters: list[str] = []
    joined = False
    for char in text:
        code = ord(char)
        extends = bool(clusters) and (
            joined
            or unicodedata.category(char) in ("Mn", "Mc", "Me")
            or code == 0x200D
            or 0xFE00 <= code <= 0xFE0F
            or 0xE0100 <= code <= 0xE01EF
            or 0x1F3FB <= code <= 0x1F3FF
            or 0xE0020 <= code <= 0xE007F
            or (char == "\n" and clusters[-1] == "\r")
            or (
                0x1F1E6 <= code <= 0x1F1FF
                and len(clusters[-1]) == 1
                and 0x1F1E6 <= ord(clusters[-1]) <= 0x1F1FF
            )
        )
        if extends:
            clusters[-1] += char
        else:
            clusters.append(char)
        joined = code == 0x200D
    return clusters


# ── reading a document the way the Swift decoder does ────────────────────


def _string(raw: Any, fallback: str = "") -> str:
    return raw if isinstance(raw, str) else fallback


def _number(raw: Any) -> float | int | None:
    if isinstance(raw, bool) or not isinstance(raw, (int, float)):
        return None
    return raw


@dataclass
class Variable:
    """``HTTPActionVariable`` as the decoder reads it."""

    id: str
    key: str
    prompt: str
    kind: str
    preset_values: list[str]
    presets_only: bool

    @classmethod
    def read(cls, raw: Any) -> Variable:
        raw = raw if isinstance(raw, dict) else {}
        kind = raw.get("kind")
        presets = raw.get("presetValues")
        return cls(
            id=_string(raw.get("id")),
            key=_string(raw.get("key")),
            prompt=_string(raw.get("prompt")),
            kind=kind if kind in VARIABLE_KINDS else "text",
            preset_values=(
                list(presets)
                if isinstance(presets, list) and all(isinstance(p, str) for p in presets)
                else []
            ),
            presets_only=raw.get("presetsOnly") is True,
        )

    def public(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "key": self.key,
            "prompt": self.prompt,
            "kind": self.kind,
            "presetValues": list(self.preset_values),
            "presetsOnly": self.presets_only,
        }


@dataclass
class Action:
    """``HTTPAction`` as the decoder reads it, with the derived flags."""

    id: str
    name: str
    method: str
    url: str
    headers: list[tuple[str, str]]
    body: str | None
    body_type: str
    timeout: float | int | None
    variables: list[Variable]
    reply: dict[str, Any] | None
    allows_untrusted: bool
    icon: str | None = None
    icon_color: str | None = None
    raw: dict[str, Any] = field(default_factory=dict)

    @classmethod
    def read(cls, raw: Any) -> Action:
        raw = raw if isinstance(raw, dict) else {}
        headers: list[tuple[str, str]] = []
        raw_headers = raw.get("headers")
        if isinstance(raw_headers, list) and all(isinstance(h, dict) for h in raw_headers):
            headers = [
                (_string(h.get("name")), _string(h.get("value"))) for h in raw_headers
            ]
        raw_variables = raw.get("variables")
        variables = (
            [Variable.read(v) for v in raw_variables]
            if isinstance(raw_variables, list)
            and all(isinstance(v, dict) for v in raw_variables)
            else []
        )
        body_type = raw.get("bodyContentType")
        body = raw.get("body")
        icon = raw.get("icon")
        icon_color = raw.get("iconColor")
        return cls(
            id=_string(raw.get("id")),
            name=_string(raw.get("name")),
            method=_string(raw.get("method"), "POST"),
            url=_string(raw.get("url")),
            headers=headers,
            body=body if isinstance(body, str) else None,
            body_type=body_type if body_type in BODY_CONTENT_TYPES else "none",
            timeout=_number(raw.get("timeout")),
            variables=variables,
            reply=read_reply_config(raw.get("responseConfig")),
            allows_untrusted=raw.get("allowsUntrustedCertificate") is True,
            icon=icon if isinstance(icon, str) else None,
            icon_color=icon_color if isinstance(icon_color, str) else None,
            raw=raw,
        )

    @property
    def label_name(self) -> str:
        """``labelName``: the trimmed name, else "HTTP Action"."""
        return trim(self.name) or FALLBACK_NAME

    @property
    def verb(self) -> str:
        return trim(self.method).upper()

    @property
    def needs_setup(self) -> bool:
        return trim(self.url) == ""

    @property
    def needs_audio(self) -> bool:
        return self.body_type == "audio" and self.verb in BODY_METHODS

    @property
    def resolved_timeout(self) -> float | int:
        return DEFAULT_TIMEOUT if self.timeout is None else self.timeout


def read_reply_config(raw: Any) -> dict[str, Any] | None:
    """``HTTPResponseConfig``, strict the way Swift is: an unknown or missing
    ``source`` (or a field of the wrong type) drops the whole setting."""
    if not isinstance(raw, dict) or raw.get("source") not in REPLY_SOURCES:
        return None
    config: dict[str, Any] = {"source": raw["source"]}
    for key in ("jsonPath", "headerName", "pattern", "unit"):
        value = raw.get(key)
        if value is None:
            continue
        if not isinstance(value, str):
            return None
        config[key] = value
    return config


def global_pairs(raw: Any) -> list[tuple[str, str]]:
    """The globals that substitute: (trimmed key, value), blank keys dropped."""
    pairs: list[tuple[str, str]] = []
    if not isinstance(raw, list):
        return pairs
    for entry in raw:
        if not isinstance(entry, dict):
            continue
        key = trim(_string(entry.get("key")))
        if key:
            pairs.append((key, _string(entry.get("value"))))
    return pairs


def _actions(document: Any) -> list[Any]:
    if not isinstance(document, dict):
        return []
    actions = document.get("actions")
    return actions if isinstance(actions, list) else []


def find_action(document: Any, action_id: Any) -> Action | None:
    """The action with this id, compared the way two UUIDs compare: case
    does not matter."""
    if not isinstance(action_id, str) or not action_id:
        return None
    wanted = action_id.upper()
    for raw in _actions(document):
        if isinstance(raw, dict) and _string(raw.get("id")).upper() == wanted:
            return Action.read(raw)
    return None


def prompt_variables(action: Action, document: Any) -> list[Variable]:
    """``promptVariables(for:)``: the variables a person is asked for, which
    is every one whose key does not name a global."""
    global_keys = {key for key, _ in library_globals(document)}
    if not global_keys:
        return list(action.variables)
    return [v for v in action.variables if trim(v.key) not in global_keys]


def _globals_of(document: Any) -> Any:
    return document.get("globalVariables") if isinstance(document, dict) else None


def library_globals(document: Any) -> list[tuple[str, str]]:
    """The library's globals that substitute, as (trimmed key, value)."""
    return global_pairs(_globals_of(document))


# ── the hash ─────────────────────────────────────────────────────────────


def canonical_json(value: Any) -> str:
    """Compact, sorted-key JSON with non-ASCII written as itself."""
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def canonical_hash(value: Any) -> str:
    """SHA-256 of :func:`canonical_json` as UTF-8, in lowercase hex. The same
    rule as ``watch_config_store.canonical_hash``."""
    return hashlib.sha256(canonical_json(value).encode("utf-8")).hexdigest()


def document_size(document: Any) -> int:
    return len(canonical_json(document).encode("utf-8"))


# ── the strict check a save must pass ────────────────────────────────────


def _check_string(value: Any, where: str, *, optional: bool = False) -> None:
    if value is None and optional:
        return
    if not isinstance(value, str):
        raise HTTPActionsInvalid(f"{where} must be a string")


def validate_action(raw: Any, where: str) -> None:
    """One action's shape. Keys this build does not know are kept as sent."""
    if not isinstance(raw, dict):
        raise HTTPActionsInvalid(f"{where} must be an object")
    action_id = raw.get("id")
    if not isinstance(action_id, str) or not _UUID_RE.fullmatch(action_id):
        raise HTTPActionsInvalid(f"{where}.id must be a UUID")
    for key in ("name", "url"):
        _check_string(raw.get(key), f"{where}.{key}")
    method = raw.get("method")
    if not isinstance(method, str) or trim(method).upper() not in METHODS:
        raise HTTPActionsInvalid(f"{where}.method must be one of {', '.join(METHODS)}")
    for key in ("body", "icon", "iconColor"):
        _check_string(raw.get(key), f"{where}.{key}", optional=True)
    body_type = raw.get("bodyContentType", "none")
    if body_type not in BODY_CONTENT_TYPES:
        raise HTTPActionsInvalid(
            f"{where}.bodyContentType must be one of {', '.join(BODY_CONTENT_TYPES)}"
        )
    timeout = raw.get("timeout")
    if timeout is not None and _number(timeout) is None:
        raise HTTPActionsInvalid(f"{where}.timeout must be a number")
    for key in ("allowsUntrustedCertificate", "presentsClientCertificate"):
        value = raw.get(key)
        if value is not None and not isinstance(value, bool):
            raise HTTPActionsInvalid(f"{where}.{key} must be true, false or absent")
    headers = raw.get("headers", [])
    if not isinstance(headers, list):
        raise HTTPActionsInvalid(f"{where}.headers must be a list")
    for index, header in enumerate(headers):
        at = f"{where}.headers[{index}]"
        if not isinstance(header, dict):
            raise HTTPActionsInvalid(f"{at} must be an object")
        _check_string(header.get("id"), f"{at}.id", optional=True)
        _check_string(header.get("name"), f"{at}.name")
        _check_string(header.get("value"), f"{at}.value")
    variables = raw.get("variables", [])
    if not isinstance(variables, list):
        raise HTTPActionsInvalid(f"{where}.variables must be a list")
    for index, variable in enumerate(variables):
        at = f"{where}.variables[{index}]"
        if not isinstance(variable, dict):
            raise HTTPActionsInvalid(f"{at} must be an object")
        _check_string(variable.get("id"), f"{at}.id", optional=True)
        key = variable.get("key")
        if not isinstance(key, str) or not KEY_RE.fullmatch(key):
            raise HTTPActionsInvalid(f"{at}.key must match [A-Za-z0-9_]+")
        _check_string(variable.get("prompt", ""), f"{at}.prompt")
        if variable.get("kind", "text") not in VARIABLE_KINDS:
            raise HTTPActionsInvalid(f"{at}.kind must be text or number")
        presets = variable.get("presetValues", [])
        if not isinstance(presets, list) or not all(isinstance(p, str) for p in presets):
            raise HTTPActionsInvalid(f"{at}.presetValues must be a list of strings")
        if not isinstance(variable.get("presetsOnly", False), bool):
            raise HTTPActionsInvalid(f"{at}.presetsOnly must be true or false")
    reply = raw.get("responseConfig")
    if reply is not None:
        at = f"{where}.responseConfig"
        if not isinstance(reply, dict):
            raise HTTPActionsInvalid(f"{at} must be an object")
        if reply.get("source") not in REPLY_SOURCES:
            raise HTTPActionsInvalid(
                f"{at}.source must be one of {', '.join(REPLY_SOURCES)}"
            )
        for key in ("jsonPath", "headerName", "pattern", "unit"):
            _check_string(reply.get(key), f"{at}.{key}", optional=True)


def validate_globals(raw: Any, where: str = "globalVariables") -> None:
    if not isinstance(raw, list):
        raise HTTPActionsInvalid(f"{where} must be a list")
    seen: dict[str, int] = {}
    for index, entry in enumerate(raw):
        at = f"{where}[{index}]"
        if not isinstance(entry, dict):
            raise HTTPActionsInvalid(f"{at} must be an object")
        _check_string(entry.get("id"), f"{at}.id", optional=True)
        key = entry.get("key")
        if not isinstance(key, str) or trim(key) == "":
            raise HTTPActionsInvalid(f"{at}.key must be a non-empty string")
        _check_string(entry.get("value"), f"{at}.value")
        trimmed = trim(key)
        if trimmed in seen:
            raise HTTPActionsInvalid(
                f'{at} has the key "{trimmed}" of {where}[{seen[trimmed]}]; '
                "global keys must be unique"
            )
        seen[trimmed] = index


def validate_document(document: Any) -> dict[str, Any]:
    """The whole library's shape and size, or :class:`HTTPActionsInvalid`.

    Action ids must be UUIDs (a tile points at ``http_action.<UUID>``) and
    unique, compared without case. Methods, body types, variable kinds and
    reply sources must be ones the apps know. Variable keys must match
    ``[A-Za-z0-9_]+`` and global keys must be non-empty and unique. Keys the
    rules do not name are kept as sent, so a newer app can add some.
    """
    if not isinstance(document, dict):
        raise HTTPActionsInvalid("document must be an object")
    version = document.get("schemaVersion")
    if version is not None and (isinstance(version, bool) or not isinstance(version, int)):
        raise HTTPActionsInvalid("schemaVersion must be an integer")
    actions = document.get("actions")
    if not isinstance(actions, list):
        raise HTTPActionsInvalid("actions must be a list")
    seen: dict[str, int] = {}
    for index, action in enumerate(actions):
        where = f"actions[{index}]"
        validate_action(action, where)
        folded = action["id"].upper()
        if folded in seen:
            raise HTTPActionsInvalid(
                f'{where} has the id "{action["id"]}" of actions[{seen[folded]}]; '
                "action ids must be unique"
            )
        seen[folded] = index
    validate_globals(document.get("globalVariables", []))
    size = document_size(document)
    if size > MAX_DOCUMENT_BYTES:
        raise HTTPActionsInvalid(
            f"the library is {size} bytes; the limit is {MAX_DOCUMENT_BYTES}"
        )
    return document


# ── the public list ──────────────────────────────────────────────────────


def _plain_number(value: float | int) -> float | int:
    """15.0 as 15, the way Swift's encoder writes a whole Double."""
    if isinstance(value, float) and value.is_integer() and abs(value) < 2**53:
        return int(value)
    return value


def public_list(document: Any) -> dict[str, Any]:
    """What a device is told about the library: ids, names, the questions
    to ask, and nothing that sends a request.

    ``{"schemaVersion": 1, "actions": [{"id", "name", "icon"?,
    "iconColor"?, "variables", "needsAudio"?, "hasReply"?, "needsSetup"?,
    "timeout"?}]}``. ``name`` is ``labelName``. ``variables`` is
    ``promptVariables``: a variable whose key names a global is left out. The
    three flags appear only when true. No URL, header, body, global or reply
    setting is ever in it.
    """
    actions: list[dict[str, Any]] = []
    for raw in _actions(document):
        if not isinstance(raw, dict):
            continue
        action = Action.read(raw)
        entry: dict[str, Any] = {"id": action.id, "name": action.label_name}
        if action.icon is not None:
            entry["icon"] = action.icon
        if action.icon_color is not None:
            entry["iconColor"] = action.icon_color
        entry["variables"] = [v.public() for v in prompt_variables(action, document)]
        if action.needs_audio:
            entry["needsAudio"] = True
        if action.reply is not None:
            entry["hasReply"] = True
        if action.needs_setup:
            entry["needsSetup"] = True
        if action.timeout is not None:
            entry["timeout"] = _plain_number(action.timeout)
        actions.append(entry)
    return {"schemaVersion": SCHEMA_VERSION, "actions": actions}


# ── building the request ─────────────────────────────────────────────────


@dataclass
class BuiltRequest:
    """``URLRequest`` as ``makeURLRequest`` leaves it.

    ``headers`` is in sending order, a repeated name kept as a pair of its
    own (``URLRequest.addValue`` joins them with a comma on the wire, which
    means the same to a server); the automatic Content-Type comes last.
    ``timeout`` is the action's own, not yet held to the sender's range.
    """

    method: str
    url: str
    headers: list[tuple[str, str]]
    body: bytes | None
    timeout: float | int


def _replace_token(key: str, replacement: str, text: str) -> str:
    """Every ``{{ key }}`` (inner whitespace allowed) becomes ``replacement``,
    which is never scanned again (``replaceToken``)."""
    pattern = re.compile(r"\{\{\s*" + re.escape(key) + r"\s*\}\}")
    return pattern.sub(lambda _m: replacement, text)


def _expand_globals(text: str, globals_: list[tuple[str, str]]) -> str:
    for key, value in globals_:
        text = _replace_token(key, value, text)
    return text


def _url_encode(value: str) -> str:
    """Percent-encode everything but ASCII letters, digits and ``-._~``.

    Swift allows ``CharacterSet.alphanumerics``, which holds letters of
    every script, but ``addingPercentEncoding`` ignores allowed characters
    outside ASCII, so those are encoded too.
    """
    out: list[str] = []
    for char in value:
        if char.isascii() and (char.isalnum() or char in "-._~"):
            out.append(char)
        else:
            out.extend(
                f"%{byte:02X}" for byte in char.encode("utf-8", errors="surrogatepass")
            )
    return "".join(out)


_JSON_NUMBER = re.compile(
    r"-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?"
    # ICU's `$` also matches just before one line break that ends the input.
    "(?:\r\n|[\n\x0b\x0c\r\x85  ])?\\Z"
)


def _json_string_escape(value: str) -> str:
    out: list[str] = []
    for char in value:
        if char == '"':
            out.append('\\"')
        elif char == "\\":
            out.append("\\\\")
        elif char == "\n":
            out.append("\\n")
        elif char == "\r":
            out.append("\\r")
        elif char == "\t":
            out.append("\\t")
        elif ord(char) < 0x20:
            out.append(f"\\u{ord(char):04x}")
        else:
            out.append(char)
    return "".join(out)


def _escape(value: str, kind: str, context: str, body_type: str) -> str:
    """The escaping table: where a value lands decides how it is written."""
    if context == "url":
        return _url_encode(value)
    if context == "header":
        return value.replace("\r", "").replace("\n", "")
    if body_type == "json":
        if kind == "number":
            trimmed = _trim_spaces(value)
            if _JSON_NUMBER.match(trimmed):
                return trimmed
            return '"' + _json_string_escape(value) + '"'
        return _json_string_escape(value)
    if body_type == "form":
        return _url_encode(value)
    return value


def _substitute(
    text: str,
    action: Action,
    values: dict[str, str],
    context: str,
) -> str:
    """Each defined ``{{key}}`` becomes its value, escaped for ``context``.
    A value not given falls back to the first quick value, then to "". A
    token no variable defines is left as typed."""
    for variable in action.variables:
        key = trim(variable.key)
        if not key:
            continue
        raw = values.get(variable.key)
        if raw is None:
            raw = variable.preset_values[0] if variable.preset_values else ""
        escaped = _escape(raw, variable.kind, context, action.body_type)
        text = _replace_token(key, escaped, text)
    return text


# RFC 3986 sets, as Foundation's parser uses them to percent-encode a
# component that holds characters it may not.
_UNRESERVED = frozenset(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
)
_SUB_DELIMS = frozenset("!$&'()*+,;=")
_USER_ALLOWED = _UNRESERVED | _SUB_DELIMS
_HOST_ALLOWED = _UNRESERVED | _SUB_DELIMS
_PATH_ALLOWED = _UNRESERVED | _SUB_DELIMS | frozenset(":@/")
_QUERY_ALLOWED = _PATH_ALLOWED | frozenset("?")
_HEX = frozenset("0123456789ABCDEFabcdef")
_SCHEME_RE = re.compile(r"[A-Za-z][A-Za-z0-9+\-.]*")
_IP_LITERAL_RE = re.compile(r"\[(?:[0-9A-Fa-f:.]+|v[0-9A-Fa-f]+\.[A-Za-z0-9\-._~!$&'()*+,;=:]+)\]")


def _encode_component(text: str, allowed: frozenset[str]) -> str:
    """Percent-encode what ``allowed`` does not hold. A ``%`` that starts a
    valid triplet stays; a lone one becomes ``%25``."""
    out: list[str] = []
    index = 0
    while index < len(text):
        char = text[index]
        if (
            char == "%"
            and index + 2 < len(text)
            and text[index + 1] in _HEX
            and text[index + 2] in _HEX
        ):
            out.append(text[index : index + 3])
            index += 3
            continue
        if char in allowed:
            out.append(char)
        else:
            out.extend(
                f"%{byte:02X}" for byte in char.encode("utf-8", errors="surrogatepass")
            )
        index += 1
    return "".join(out)


def _punycode_host(host: str) -> str:
    """A host with letters outside ASCII in its ``xn--`` form, label by
    label, as Foundation writes it. A label IDNA refuses is left for the
    percent-encoding after."""
    if host.isascii():
        return host
    labels: list[str] = []
    for label in host.split("."):
        if label.isascii():
            labels.append(label)
            continue
        try:
            labels.append(label.encode("idna").decode("ascii"))
        except UnicodeError:
            labels.append(label)
    return ".".join(labels)


def foundation_url(text: str) -> tuple[str, str | None] | None:
    """``URL(string:encodingInvalidCharacters: true)``: the URL string it
    keeps, and its scheme. None when Foundation would refuse the string.

    Split as RFC 3986 splits a URL, then each part that holds a character it
    may not is percent-encoded with that part's allowed set, so a space, a
    lone ``%`` or a non-ASCII letter typed into the URL is encoded and an
    already encoded triplet is left alone. A bad port or a malformed IP
    literal is refused. The scheme is None for a string with none, which
    the caller refuses.
    """
    first_delimiter = re.search(r"[:/?#]", text)
    scheme: str | None = None
    rest = text
    if first_delimiter is not None and first_delimiter.group() == ":":
        candidate = text[: first_delimiter.start()]
        if _SCHEME_RE.fullmatch(candidate):
            scheme = candidate
            rest = text[first_delimiter.end() :]
    out = f"{scheme}:" if scheme is not None else ""

    fragment: str | None = None
    if "#" in rest:
        rest, fragment = rest.split("#", 1)
    query: str | None = None
    if "?" in rest:
        rest, query = rest.split("?", 1)

    if rest.startswith("//"):
        authority_end = rest.find("/", 2)
        if authority_end == -1:
            authority, path = rest[2:], ""
        else:
            authority, path = rest[2:authority_end], rest[authority_end:]
        userinfo: str | None = None
        hostport = authority
        if "@" in authority:
            userinfo, hostport = authority.rsplit("@", 1)
        port: str | None = None
        if hostport.startswith("["):
            close = hostport.find("]")
            if close == -1:
                return None
            host = hostport[: close + 1]
            tail = hostport[close + 1 :]
            if tail:
                if not tail.startswith(":"):
                    return None
                port = tail[1:]
            if not _IP_LITERAL_RE.fullmatch(host):
                return None
        else:
            host = hostport
            if ":" in hostport:
                host, port = hostport.split(":", 1)
            host = _encode_component(_punycode_host(host), _HOST_ALLOWED)
        if port is not None and not all(c in "0123456789" for c in port):
            return None
        out += "//"
        if userinfo is not None:
            if ":" in userinfo:
                user, password = userinfo.split(":", 1)
                out += (
                    _encode_component(user, _USER_ALLOWED)
                    + ":"
                    + _encode_component(password, _USER_ALLOWED)
                )
            else:
                out += _encode_component(userinfo, _USER_ALLOWED)
            out += "@"
        out += host
        if port is not None:
            out += ":" + port
    else:
        path = rest
    out += _encode_component(path, _PATH_ALLOWED)
    if query is not None:
        out += "?" + _encode_component(query, _QUERY_ALLOWED)
    if fragment is not None:
        out += "#" + _encode_component(fragment, _QUERY_ALLOWED)
    return out, scheme


def build_request(
    document: Any,
    action_id: Any,
    values: dict[str, str] | None = None,
    audio: bytes | None = None,
) -> BuiltRequest:
    """``makeURLRequest`` over ``resolved(action)``, for the action with this
    id in the library.

    Globals first, raw, in the URL, header names and values and the body;
    then each variable, escaped for where it lands. Raises
    :class:`HTTPActionsInvalid` for an id the library does not hold and
    :class:`RequestError` (``emptyURL`` or ``invalidURL``) for a URL that
    cannot be sent.
    """
    action = find_action(document, action_id)
    if action is None:
        raise HTTPActionsInvalid("no action has that id")
    return build_action_request(action, library_globals(document), values, audio)


def build_action_request(
    action: Action,
    globals_: list[tuple[str, str]],
    values: dict[str, str] | None = None,
    audio: bytes | None = None,
) -> BuiltRequest:
    """:func:`build_request` for one action and the globals given."""
    values = {
        key: value
        for key, value in (values or {}).items()
        if isinstance(key, str) and isinstance(value, str)
    }
    url = action.url
    headers = action.headers
    body = action.body
    if globals_:
        url = _expand_globals(url, globals_)
        headers = [
            (_expand_globals(name, globals_), _expand_globals(value, globals_))
            for name, value in headers
        ]
        if body is not None:
            body = _expand_globals(body, globals_)

    final_url = trim(_substitute(url, action, values, "url"))
    if not final_url:
        raise RequestError("emptyURL")
    parsed = foundation_url(final_url)
    if parsed is None or parsed[1] is None or parsed[1].lower() not in ("http", "https"):
        raise RequestError("invalidURL")

    verb = action.verb
    sent: list[list[str]] = []
    user_content_type = False
    for raw_name, raw_value in headers:
        name = trim(_substitute(raw_name, action, values, "header"))
        if not name:
            continue
        if name.lower() == "content-type":
            # URLRequest writes its own spelling of this one name.
            name = "Content-Type"
            user_content_type = True
        sent.append([name, _substitute(raw_value, action, values, "header")])

    body_bytes: bytes | None = None
    if verb in BODY_METHODS:
        if action.body_type == "audio":
            if audio:
                body_bytes = bytes(audio)
        else:
            text = _substitute(body or "", action, values, "body")
            if trim(text):
                body_bytes = text.encode("utf-8", errors="replace")
        content_type = BODY_CONTENT_TYPES[action.body_type]
        if not user_content_type and content_type is not None:
            sent.append(["Content-Type", content_type])

    return BuiltRequest(
        method=verb,
        url=parsed[0],
        headers=[(name, value) for name, value in sent],
        body=body_bytes,
        timeout=action.resolved_timeout,
    )


# ── reading the reply ────────────────────────────────────────────────────


def snippet(body: bytes, limit: int = SNIPPET_LIMIT) -> str:
    """``responseSnippet``: the first 2048 bytes as one line of text.

    Whitespace runs collapse to one space, the ends are trimmed, and a line
    longer than ``limit`` characters is cut and ends in an ellipsis. A body
    that is not text comes back empty; a character split by the 2048 byte
    cut does not count as "not text".
    """
    if not body or limit <= 0:
        return ""
    decoded = bytes(body[:SNIPPET_READ_BYTES]).decode("utf-8", errors="replace")
    while decoded.endswith("�"):
        decoded = decoded[:-1]
    if "�" in decoded:
        return ""
    collapsed = _trim_spaces(_WHITE_SPACE_RUN.sub(" ", decoded))
    clusters = _graphemes(collapsed)
    if len(clusters) <= limit:
        return collapsed
    return _trim_spaces("".join(clusters[:limit])) + "…"


def _parse_json(body: bytes) -> tuple[bool, Any]:
    """``JSONSerialization`` with fragments allowed: (parsed, value)."""
    if not body:
        return False, None

    def _refuse(_constant: str) -> Any:
        raise ValueError("not JSON")

    try:
        return True, json.loads(bytes(body), parse_constant=_refuse)
    except (ValueError, UnicodeDecodeError, RecursionError):
        return False, None


def _swift_double(value: float) -> str:
    """``String(Double)``: the shortest round trip digits, as Python finds
    them. Swift turns to the exponent form from 2^53 up where Python waits
    for 1e16, so ``9100000000000000`` reads ``9.1e+15`` here too."""
    if value != value:
        return "nan"
    if value in (float("inf"), float("-inf")):
        return "inf" if value > 0 else "-inf"
    text = repr(value)
    if abs(value) < 2**53 or "e" in text:
        return text
    sign = "-" if value < 0 else ""
    whole, _, fraction = text.lstrip("-").partition(".")
    digits = (whole + fraction).lstrip("0").rstrip("0") or "0"
    mantissa = digits[0] + ("." + digits[1:] if len(digits) > 1 else "")
    return f"{sign}{mantissa}e+{len(whole) - 1:02d}"


def format_leaf(value: Any) -> str | None:
    """``formatLeaf``: strings as they are, whole numbers without ``.0``,
    booleans as words; containers and null have no value."""
    if isinstance(value, str):
        return value
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, int):
        if abs(value) < 10**15:
            return str(value)
        try:
            return _swift_double(float(value))
        except OverflowError:
            return str(value)
    if isinstance(value, float):
        if value == round(value) and abs(value) < 1e15:
            return str(int(value))
        return _swift_double(value)
    return None


def json_field_value(body: bytes, path: str) -> str | None:
    """Walk a dot path ("result.price", "data.0.temp") into a JSON body."""
    ok, current = _parse_json(body)
    if not ok:
        return None
    trimmed = trim(path)
    for segment in (s for s in trimmed.split(".") if s):
        if isinstance(current, dict):
            if segment not in current:
                return None
            current = current[segment]
        elif isinstance(current, list):
            if not re.fullmatch(r"[+-]?[0-9]+", segment):
                return None
            index = int(segment)
            if index < 0 or index >= len(current):
                return None
            current = current[index]
        else:
            return None
    return format_leaf(current)


def header_value(name: Any, headers: dict[str, str]) -> str | None:
    """A reply header by name, without regard to case."""
    if not isinstance(name, str):
        return None
    wanted = trim(name)
    if not wanted:
        return None
    if wanted in headers:
        return headers[wanted]
    folded = wanted.lower()
    for key, value in headers.items():
        if key.lower() == folded:
            return value
    return None


# ICU spells a named group `(?<name>...)`, Python `(?P<name>...)`.
_ICU_NAMED_GROUP = re.compile(r"(?<!\\)\(\?<(?=[A-Za-z])")


def regex_capture(body: bytes, pattern: Any) -> str | None:
    """Group 1 of the first match when the pattern has a group, else the
    whole match. Reads at most the first 256 KB of the body, with ``.``
    spanning lines."""
    if not body or not isinstance(pattern, str):
        return None
    pattern = trim(pattern)
    if not pattern:
        return None
    text = bytes(body[:REGEX_BODY_BYTE_CAP]).decode("utf-8", errors="replace")
    if not text:
        return None
    try:
        compiled = re.compile(_ICU_NAMED_GROUP.sub("(?P<", pattern), re.DOTALL)
    except (re.error, OverflowError, RecursionError):
        return None
    match = compiled.search(text)
    if match is None:
        return None
    return match.group(1) if compiled.groups >= 1 else match.group(0)


def extract_reply(
    config: Any,
    status: int | None,
    headers: dict[str, str] | None,
    body: bytes,
) -> str | None:
    """``HTTPResponseExtractor.extract``: the reply value with its unit, or
    None when there is nothing to show. ``config`` is the action's raw
    ``responseConfig``; one that Swift would not decode extracts nothing."""
    config = read_reply_config(config)
    if config is None:
        return None
    source = config["source"]
    raw: str | None
    if source == "statusCode":
        raw = None if status is None else str(status)
    elif source == "bodyText":
        raw = snippet(body) or None
    elif source == "jsonField":
        raw = json_field_value(body, config.get("jsonPath") or "")
    elif source == "header":
        raw = header_value(config.get("headerName"), headers or {})
    else:
        raw = regex_capture(body, config.get("pattern"))
    if raw is None:
        return None
    unit = config.get("unit")
    return raw + unit if unit else raw


def discover_paths(body: bytes, limit: int = DISCOVER_LIMIT) -> list[dict[str, str]]:
    """``discoverPaths``: the JSON leaves of a body, keys sorted per level
    and an array's first item only, as ``{"path", "value"}``."""
    ok, root = _parse_json(body)
    if not ok:
        return []
    found: list[dict[str, str]] = []

    def walk(node: Any, path: str) -> None:
        if len(found) >= limit:
            return
        if isinstance(node, dict):
            for key in sorted(node):
                walk(node[key], key if not path else f"{path}.{key}")
        elif isinstance(node, list):
            if node:
                walk(node[0], "0" if not path else f"{path}.0")
        else:
            value = format_leaf(node)
            if value is not None:
                found.append({"path": path, "value": value})

    walk(root, "")
    return found


def decode_audio(raw: Any) -> bytes | None:
    """The base64 clip a run carries, or None for none. Raises
    :class:`HTTPActionsInvalid` for text that is not base64."""
    if raw is None:
        return None
    if not isinstance(raw, str):
        raise HTTPActionsInvalid("audio must be base64 text")
    try:
        return base64.b64decode(raw, validate=True)
    except ValueError as err:
        raise HTTPActionsInvalid("audio must be base64 text") from err


# ── the hand-over merge ──────────────────────────────────────────────────


def empty_document() -> dict[str, Any]:
    return {"schemaVersion": SCHEMA_VERSION, "actions": [], "globalVariables": []}


def _rewrite_tokens(raw: dict[str, Any], renames: dict[str, str]) -> dict[str, Any]:
    """An incoming action with every renamed global's token rewritten in its
    URL, header names and values, and body."""
    if not renames:
        return raw
    action = dict(raw)

    def rewrite(text: Any) -> Any:
        if not isinstance(text, str):
            return text
        for old, new in renames.items():
            text = _replace_token(old, "{{" + new + "}}", text)
        return text

    action["url"] = rewrite(action.get("url"))
    if "body" in action:
        action["body"] = rewrite(action["body"])
    headers = action.get("headers")
    if isinstance(headers, list):
        action["headers"] = [
            {**h, "name": rewrite(h.get("name")), "value": rewrite(h.get("value"))}
            if isinstance(h, dict)
            else h
            for h in headers
        ]
    return action


def merge_hand_over(
    stored: dict[str, Any] | None, incoming: dict[str, Any]
) -> tuple[dict[str, Any], int, bool]:
    """Fold a phone's library into the stored one, adding and never changing.

    Returns (merged document, actions added, whether anything changed).

    * An action whose id is not stored is added; a stored id is left alone.
    * A global whose key is not stored is added. The same key with the same
      value is dropped. The same key with another value is added as
      ``<key>_2`` (or ``_3`` and on, the first that no stored or incoming
      global and no stored action's variable uses), and every ``{{key}}`` in
      the incoming actions that are added is rewritten to the new name, so
      each action keeps the value it was written against.
    * A global whose key is the key of a variable of a stored action clashes
      too, and is renamed the same way. Added under that key it would fill
      the stored action's token raw in place of the escaped value a person
      types, which is a change to a stored action.

    ``incoming`` must already have passed :func:`validate_document`.
    """
    merged = json.loads(json.dumps(stored)) if stored else empty_document()
    merged.setdefault("actions", [])
    merged.setdefault("globalVariables", [])
    changed = False

    stored_globals = {
        trim(_string(g.get("key"))): _string(g.get("value"))
        for g in merged["globalVariables"]
        if isinstance(g, dict)
    }
    stored_variable_keys = {
        trim(variable.key)
        for raw in merged["actions"]
        if isinstance(raw, dict)
        for variable in Action.read(raw).variables
    }
    stored_variable_keys.discard("")
    taken = (
        set(stored_globals)
        | stored_variable_keys
        | {
            trim(_string(g.get("key")))
            for g in incoming.get("globalVariables", [])
            if isinstance(g, dict)
        }
    )
    global_ids = {_string(g.get("id")).upper() for g in merged["globalVariables"] if isinstance(g, dict)}
    renames: dict[str, str] = {}
    for raw in incoming.get("globalVariables", []):
        key = trim(_string(raw.get("key")))
        value = _string(raw.get("value"))
        entry = dict(raw)
        if key in stored_globals and stored_globals[key] == value:
            continue
        if key in stored_globals or key in stored_variable_keys:
            suffix = 2
            while f"{key}_{suffix}" in taken:
                suffix += 1
            new_key = f"{key}_{suffix}"
            taken.add(new_key)
            renames[key] = new_key
            entry["key"] = new_key
            stored_globals[new_key] = value
        else:
            stored_globals[key] = value
        if _string(entry.get("id")).upper() in global_ids:
            entry["id"] = str(uuid.uuid4()).upper()
        global_ids.add(_string(entry.get("id")).upper())
        merged["globalVariables"].append(entry)
        changed = True

    stored_ids = {
        _string(a.get("id")).upper() for a in merged["actions"] if isinstance(a, dict)
    }
    added = 0
    for raw in incoming.get("actions", []):
        folded = _string(raw.get("id")).upper()
        if folded in stored_ids:
            continue
        merged["actions"].append(_rewrite_tokens(raw, renames))
        stored_ids.add(folded)
        added += 1
        changed = True
    return merged, added, changed
