"""Unit tests for ``http_actions.py``, the rules of the home's HTTP action
library (step 4d batch 4).

The module imports nothing from Home Assistant, so it is loaded straight from
its file. Each test pins one Swift rule from the app's
``Shared/HTTPActionConfig.swift`` or ``Shared/HTTPResponseExtractor.swift``:
the global and variable passes, every row of the escaping table, the URL
parse, header order and the automatic Content-Type, the body rules, the
reply sources, the snippet, the public list and its hash, the validator, and
the hand-over merge. The app's own case files run in
``test_http_actions_cases.py``.
"""

from __future__ import annotations

import base64
import importlib.util
import json
import sys
from pathlib import Path
from typing import Any

import pytest

_PATH = (
    Path(__file__).resolve().parents[1]
    / "custom_components"
    / "wrist_assistant"
    / "http_actions.py"
)


def load_http_actions():
    """The module, loaded from its file under a private name."""
    name = "wa_http_actions_under_test"
    if name in sys.modules:
        return sys.modules[name]
    spec = importlib.util.spec_from_file_location(name, _PATH)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


ha = load_http_actions()

ID_A = "4F7A2C1E-9B3D-4E5F-8A6B-1C2D3E4F5A6B"
ID_B = "6A0B1C2D-3E4F-4A5B-8C6D-7E8F9A0B1C2D"
ID_C = "7C1D2E3F-4A5B-4C6D-9E7F-8A9B0C1D2E3F"


def action(**fields: Any) -> dict[str, Any]:
    base: dict[str, Any] = {
        "id": ID_A,
        "name": "Notify",
        "method": "POST",
        "url": "https://example.com/hook",
        "headers": [],
        "bodyContentType": "none",
        "variables": [],
    }
    base.update(fields)
    return base


def variable(key: str, kind: str = "text", presets: list[str] | None = None, **extra: Any) -> dict:
    return {
        "id": f"V-{key}",
        "key": key,
        "prompt": extra.pop("prompt", ""),
        "kind": kind,
        "presetValues": presets or [],
        "presetsOnly": extra.pop("presetsOnly", False),
    }


def header(name: str, value: str) -> dict:
    return {"id": f"H-{name}", "name": name, "value": value}


def library(*actions: dict, globals_: list[dict] | None = None) -> dict:
    return {"schemaVersion": 1, "actions": list(actions), "globalVariables": globals_ or []}


def build(act: dict, values: dict | None = None, audio: bytes | None = None, globals_=None):
    return ha.build_request(library(act, globals_=globals_), act["id"], values or {}, audio)


# ── globals and variables ────────────────────────────────────────────────


def test_globals_expand_raw_before_variables_and_win_over_a_prompt() -> None:
    act = action(
        url="{{haurl}}/api/{{ token }}?q={{q}}",
        variables=[variable("token"), variable("q")],
    )
    built = build(
        act,
        {"token": "ignored", "q": "a b"},
        globals_=[{"id": "G1", "key": "haurl", "value": "http://10.0.0.2:8123"},
                  {"id": "G2", "key": "token", "value": "s/e cret"}],
    )
    # The global value lands raw (the space is then encoded by the URL
    # parse, the slash is not); the variable is percent-encoded.
    assert built.url == "http://10.0.0.2:8123/api/s/e%20cret?q=a%20b"


def test_a_blank_global_key_never_substitutes() -> None:
    act = action(url="http://h/{{ }}")
    built = build(act, globals_=[{"id": "G", "key": "  ", "value": "x"}])
    assert built.url == "http://h/%7B%7B%20%7D%7D"


def test_an_undefined_token_stays_literal_and_a_missing_value_uses_the_first_preset() -> None:
    act = action(
        method="POST",
        bodyContentType="text",
        body="{{a}} {{b}} {{c}} {{nope}}",
        variables=[variable("a", presets=["first", "second"]), variable("b"), variable("c")],
    )
    built = build(act, {"c": "given"})
    assert built.body == b"first  given {{nope}}"


def test_a_value_is_not_scanned_for_its_own_token_but_later_variables_see_it() -> None:
    """Swift runs one pass per variable, in order: a value is never scanned
    again for the token it replaced, but the passes after it read it."""
    act = action(
        bodyContentType="text",
        body="{{a}}|{{b}}",
        variables=[variable("a"), variable("b")],
    )
    assert build(act, {"a": "{{a}}", "b": "B"}).body == b"{{a}}|B"
    assert build(act, {"a": "{{b}}", "b": "B"}).body == b"B|B"


# ── the escaping table ───────────────────────────────────────────────────


@pytest.mark.parametrize(
    ("value", "expected"),
    [
        ("a b", "a%20b"),
        ("x&y=z", "x%26y%3Dz"),
        ("-._~", "-._~"),
        ("José", "Jos%C3%A9"),
        ("100%", "100%25"),
        ("a/b?c#d", "a%2Fb%3Fc%23d"),
    ],
)
def test_a_value_in_the_url_is_percent_encoded(value: str, expected: str) -> None:
    built = build(action(url="http://h/x?v={{v}}", variables=[variable("v")]), {"v": value})
    assert built.url == f"http://h/x?v={expected}"


def test_a_value_in_a_header_loses_its_line_breaks_only() -> None:
    act = action(
        headers=[header("X-{{n}}", "Bearer {{v}}")],
        variables=[variable("n"), variable("v")],
    )
    built = build(act, {"n": "A\r\nB", "v": " to\nken\r "})
    assert built.headers == [("X-AB", "Bearer  token ")]


@pytest.mark.parametrize(
    ("kind", "value", "expected"),
    [
        ("text", 'say "hi"\\\n\r\t\x01', 'say \\"hi\\"\\\\\\n\\r\\t\\u0001'),
        ("text", "é ✓", "é ✓"),
        ("number", "42", "42"),
        ("number", " -1.5e3 ", "-1.5e3"),
        ("number", "007", '"007"'),
        ("number", "1,5", '"1,5"'),
        ("number", "+1", '"+1"'),
        ("number", "inf", '"inf"'),
        ("number", 'x"y', '"x\\"y"'),
    ],
)
def test_a_value_in_a_json_body(kind: str, value: str, expected: str) -> None:
    act = action(bodyContentType="json", body="{{v}}", variables=[variable("v", kind)])
    assert build(act, {"v": value}).body == expected.encode()


def test_a_json_number_may_end_in_one_line_break_as_icu_reads_dollar() -> None:
    act = action(bodyContentType="json", body="{{v}}", variables=[variable("v", "number")])
    assert build(act, {"v": "5\n"}).body == b"5\n"


def test_a_value_in_a_form_body_is_percent_encoded() -> None:
    act = action(bodyContentType="form", body="a={{v}}", variables=[variable("v")])
    assert build(act, {"v": "x y&z"}).body == b"a=x%20y%26z"


@pytest.mark.parametrize("body_type", ["text", "none"])
def test_a_value_in_a_text_or_plain_body_is_raw(body_type: str) -> None:
    act = action(bodyContentType=body_type, body="m={{v}}", variables=[variable("v")])
    assert build(act, {"v": 'a "b"\n&'}).body == b'm=a "b"\n&'


# ── the URL ──────────────────────────────────────────────────────────────


@pytest.mark.parametrize(
    ("url", "code"),
    [
        ("", "emptyURL"),
        ("   \n", "emptyURL"),
        ("{{haurl}}/api", "invalidURL"),
        ("ftp://example.com/x", "invalidURL"),
        ("file:///etc/passwd", "invalidURL"),
        ("http://example.com:port/", "invalidURL"),
        ("example.com/hook", "invalidURL"),
    ],
)
def test_a_url_that_cannot_be_sent_is_a_named_error(url: str, code: str) -> None:
    with pytest.raises(ha.RequestError) as caught:
        build(action(url=url))
    assert caught.value.code == code
    assert url.strip() == "" or url not in caught.value.message


@pytest.mark.parametrize(
    ("url", "expected"),
    [
        ("  https://example.com/a b ", "https://example.com/a%20b"),
        ("http://h/?level=50%", "http://h/?level=50%25"),
        ("http://h/?u=José", "http://h/?u=Jos%C3%A9"),
        ("http://h/a%20b", "http://h/a%20b"),
        ("HTTPS://Example.com/x|y", "HTTPS://Example.com/x%7Cy"),
        ("http://[::1]:8123/x", "http://[::1]:8123/x"),
    ],
)
def test_the_url_is_encoded_as_foundation_encodes_it(url: str, expected: str) -> None:
    assert build(action(url=url)).url == expected


def test_the_method_is_trimmed_and_upper_cased_and_the_timeout_defaults() -> None:
    built = build(action(method=" get ", url="http://h/"))
    assert built.method == "GET"
    assert built.timeout == 10
    assert build(action(timeout=2.5)).timeout == 2.5


# ── headers and the body ─────────────────────────────────────────────────


def test_headers_keep_their_order_and_a_repeat_joins_the_first() -> None:
    act = action(
        headers=[header("X-A", "1"), header(" ", "skipped"), header("x-b", "2"), header("X-a", "3")],
        bodyContentType="json",
        body="{}",
    )
    assert build(act).headers == [
        ("X-A", "1,3"),
        ("x-b", "2"),
        ("Content-Type", "application/json"),
    ]


def test_a_user_content_type_suppresses_the_automatic_one() -> None:
    act = action(headers=[header("content-type", "text/csv")], bodyContentType="json", body="{}")
    assert build(act).headers == [("content-type", "text/csv")]


@pytest.mark.parametrize(
    ("body_type", "content_type"),
    [("json", "application/json"), ("form", "application/x-www-form-urlencoded"),
     ("text", "text/plain"), ("audio", "audio/mp4")],
)
def test_the_automatic_content_type_rides_even_an_empty_body(body_type, content_type) -> None:
    built = build(action(bodyContentType=body_type, body="  "))
    assert built.body is None
    assert built.headers == [("Content-Type", content_type)]


def test_a_get_sends_no_body_and_no_automatic_content_type() -> None:
    built = build(action(method="GET", bodyContentType="json", body='{"a":1}'))
    assert built.body is None
    assert built.headers == []


def test_a_plain_body_with_no_type_has_no_content_type() -> None:
    built = build(action(bodyContentType="none", body="hello"))
    assert built.body == b"hello"
    assert built.headers == []


def test_a_voice_action_sends_the_clip_raw_or_nothing() -> None:
    act = action(bodyContentType="audio", body="{{v}}", variables=[variable("v")])
    clip = bytes(range(256))
    assert build(act, audio=clip).body == clip
    assert build(act, audio=b"").body is None
    assert build(act).body is None


def test_an_unknown_id_is_refused() -> None:
    with pytest.raises(ha.HTTPActionsInvalid):
        ha.build_request(library(action()), ID_B, {})


def test_an_action_is_found_without_regard_to_case() -> None:
    assert ha.build_request(library(action()), ID_A.lower(), {}).method == "POST"


# ── the reply ────────────────────────────────────────────────────────────


@pytest.mark.parametrize(
    ("config", "status", "headers", "body", "expected"),
    [
        (None, 200, {}, b"x", None),
        ({"source": "statusCode"}, 204, {}, b"", "204"),
        ({"source": "statusCode", "unit": " ok"}, 201, {}, b"", "201 ok"),
        ({"source": "statusCode"}, None, {}, b"", None),
        ({"source": "bodyText"}, 200, {}, b"  hi\n there ", "hi there"),
        ({"source": "bodyText"}, 200, {}, b"", None),
        ({"source": "jsonField", "jsonPath": "result.price"}, 200, {}, b'{"result":{"price":12.5}}', "12.5"),
        ({"source": "jsonField", "jsonPath": "data.0.temp", "unit": "°"}, 200, {}, b'{"data":[{"temp":21.0}]}', "21°"),
        ({"source": "jsonField", "jsonPath": "a..b"}, 200, {}, b'{"a":{"b":true}}', "true"),
        ({"source": "jsonField"}, 200, {}, b"104231", "104231"),
        ({"source": "jsonField", "jsonPath": "a"}, 200, {}, b'{"a":null}', None),
        ({"source": "jsonField", "jsonPath": "a"}, 200, {}, b'{"a":[1]}', None),
        ({"source": "jsonField", "jsonPath": "a.5"}, 200, {}, b'{"a":[1]}', None),
        ({"source": "jsonField", "jsonPath": "a"}, 200, {}, b"not json", None),
        ({"source": "jsonField", "jsonPath": "n"}, 200, {}, b'{"n":1.1}', "1.1"),
        ({"source": "jsonField", "jsonPath": "n"}, 200, {}, b'{"n":1e20}', "1e+20"),
        ({"source": "jsonField", "jsonPath": "n"}, 200, {}, b'{"n":NaN}', None),
        ({"source": "header", "headerName": "etag"}, 200, {"ETag": '"v1"'}, b"", '"v1"'),
        ({"source": "header", "headerName": " "}, 200, {"ETag": "x"}, b"", None),
        ({"source": "header", "headerName": "X-Gone"}, 200, {}, b"", None),
        ({"source": "regex", "pattern": "temp=([0-9.]+)"}, 200, {}, b"temp=72.4 F", "72.4"),
        ({"source": "regex", "pattern": "[0-9.]+°"}, 200, {}, "at 72.4° now".encode(), "72.4°"),
        ({"source": "regex", "pattern": "<t>(.*?)</t>"}, 200, {}, b"<t>a\nb</t>", "a\nb"),
        ({"source": "regex", "pattern": "(?<v>[0-9]+)"}, 200, {}, b"n=7", "7"),
        ({"source": "regex", "pattern": "(unclosed"}, 200, {}, b"x", None),
        ({"source": "regex", "pattern": "x(y)?"}, 200, {}, b"x", None),
        ({"source": "future"}, 200, {}, b"x", None),
    ],
)
def test_extract_reply(config, status, headers, body, expected) -> None:
    assert ha.extract_reply(config, status, headers, body) == expected


def test_a_regex_reads_only_the_first_256_kb() -> None:
    body = b"a" * ha.REGEX_BODY_BYTE_CAP + b"needle"
    assert ha.extract_reply({"source": "regex", "pattern": "needle"}, 200, {}, body) is None
    assert ha.extract_reply({"source": "regex", "pattern": "a+"}, 200, {}, body) == "a" * ha.REGEX_BODY_BYTE_CAP


def test_the_snippet() -> None:
    assert ha.snippet(b"") == ""
    assert ha.snippet(b"\xff\xfe\x00binary") == ""
    long_text = ("word " * 40).encode()
    cut = ha.snippet(long_text)
    assert cut.endswith("…") and len(cut) == 119 + 1
    # A character split by the 2048 byte cut is not "binary".
    split = b"a" * 2047 + "é".encode()
    assert ha.snippet(split, limit=5000) == "a" * 2047
    # An emoji with a skin tone counts as one character.
    emoji = "\U0001F44D\U0001F3FD" * 121
    assert ha.snippet(emoji.encode()) == "\U0001F44D\U0001F3FD" * 120 + "…"


def test_discover_paths() -> None:
    body = json.dumps({"b": [{"x": 1}, {"x": 2}], "a": "s", "n": None, "e": []}).encode()
    assert ha.discover_paths(body) == [
        {"path": "a", "value": "s"},
        {"path": "b.0.x", "value": "1"},
    ]
    assert ha.discover_paths(b"12") == [{"path": "", "value": "12"}]
    assert ha.discover_paths(b"<html>") == []
    many = json.dumps({f"k{i:03}": i for i in range(100)}).encode()
    assert len(ha.discover_paths(many)) == 40


# ── the public list ──────────────────────────────────────────────────────


def test_the_public_list_carries_no_request_detail() -> None:
    doc = library(
        action(
            name="  ",
            url="{{haurl}}/x?t={{token}}",
            headers=[header("Authorization", "Bearer secret")],
            body="secret body",
            bodyContentType="audio",
            timeout=15.0,
            icon="bell.fill",
            iconColor="#A0C8FF",
            variables=[variable("token"), variable("level", "number", ["1", "2"], presetsOnly=True)],
            responseConfig={"source": "jsonField", "jsonPath": "a"},
            allowsUntrustedCertificate=True,
        ),
        action(id=ID_B, name="Setup me", url=" ", method="GET"),
        globals_=[{"id": "G", "key": "token", "value": "t0p"}, {"id": "H", "key": "haurl", "value": "http://h"}],
    )
    public = ha.public_list(doc)
    assert public == {
        "schemaVersion": 1,
        "actions": [
            {
                "id": ID_A,
                "name": "HTTP Action",
                "icon": "bell.fill",
                "iconColor": "#A0C8FF",
                "variables": [
                    {"id": "V-level", "key": "level", "prompt": "", "kind": "number",
                     "presetValues": ["1", "2"], "presetsOnly": True},
                ],
                "needsAudio": True,
                "hasReply": True,
                "timeout": 15,
            },
            {"id": ID_B, "name": "Setup me", "variables": [], "needsSetup": True},
        ],
    }
    text = json.dumps(public)
    for secret in ("secret", "t0p", "http://h", "Authorization", "jsonPath"):
        assert secret not in text


def test_a_get_with_an_audio_body_does_not_need_audio() -> None:
    public = ha.public_list(library(action(method="GET", bodyContentType="audio")))
    assert "needsAudio" not in public["actions"][0]


def test_the_public_hash_is_the_canonical_hash() -> None:
    public = ha.public_list(library(action()))
    assert ha.canonical_hash(public) == ha.canonical_hash(json.loads(json.dumps(public)))
    assert len(ha.canonical_hash(public)) == 64


# ── the validator ────────────────────────────────────────────────────────


def test_a_phone_library_is_valid() -> None:
    doc = library(
        action(variables=[variable("msg")], responseConfig={"source": "regex", "pattern": "x"},
               timeout=5, allowsUntrustedCertificate=True, presentsClientCertificate=True,
               headers=[header("A", "b")], body="x", icon="bell"),
        action(id=ID_B, method="get"),
        globals_=[{"id": "G", "key": "haurl", "value": ""}],
    )
    assert ha.validate_document(doc) is doc


@pytest.mark.parametrize(
    ("doc", "words"),
    [
        ([], "document must be an object"),
        ({"actions": {}}, "actions must be a list"),
        ({"actions": [], "schemaVersion": "1"}, "schemaVersion"),
        (library(action(id="not-a-uuid")), "actions[0].id must be a UUID"),
        (library(action(), action(id=ID_A.lower())), "action ids must be unique"),
        (library(action(method="HEAD")), "actions[0].method"),
        (library(action(name=3)), "actions[0].name must be a string"),
        (library(action(url=None)), "actions[0].url must be a string"),
        (library(action(bodyContentType="xml")), "bodyContentType"),
        (library(action(timeout="10")), "timeout must be a number"),
        (library(action(timeout=True)), "timeout must be a number"),
        (library(action(headers=[{"name": "a"}])), "headers[0].value must be a string"),
        (library(action(variables=[variable("a b")])), "variables[0].key must match"),
        (library(action(variables=[variable("")])), "variables[0].key must match"),
        (library(action(variables=[variable("a", "date")])), "variables[0].kind"),
        (library(action(responseConfig={"source": "xpath"})), "responseConfig.source"),
        (library(action(responseConfig={"source": "regex", "pattern": 1})), "pattern must be a string"),
        (library(action(allowsUntrustedCertificate="yes")), "allowsUntrustedCertificate"),
        (library(globals_=[{"key": " ", "value": "x"}]), "globalVariables[0].key must be a non-empty"),
        (library(globals_=[{"key": "a", "value": "1"}, {"key": " a", "value": "2"}]), "global keys must be unique"),
        ({"actions": [], "globalVariables": {}}, "globalVariables must be a list"),
    ],
)
def test_the_validator_refuses(doc, words) -> None:
    with pytest.raises(ha.HTTPActionsInvalid) as caught:
        ha.validate_document(doc)
    assert words in caught.value.message


def test_the_size_cap() -> None:
    big = library(action(body="x" * ha.MAX_DOCUMENT_BYTES))
    with pytest.raises(ha.HTTPActionsInvalid) as caught:
        ha.validate_document(big)
    assert "the limit is 262144" in caught.value.message


def test_unknown_keys_are_kept() -> None:
    doc = library(action(futureKey={"a": 1}))
    doc["futureTop"] = True
    assert ha.validate_document(doc)["actions"][0]["futureKey"] == {"a": 1}


# ── the hand-over merge ──────────────────────────────────────────────────


def test_a_first_hand_over_adds_everything() -> None:
    incoming = library(action(), globals_=[{"id": "G", "key": "k", "value": "v"}])
    merged, added, changed = ha.merge_hand_over(None, incoming)
    assert (added, changed) == (1, True)
    assert merged == {
        "schemaVersion": 1,
        "actions": [action()],
        "globalVariables": [{"id": "G", "key": "k", "value": "v"}],
    }


def test_a_stored_id_is_left_alone_and_a_new_one_is_added() -> None:
    stored = library(action(name="Stored"))
    incoming = library(action(id=ID_A.lower(), name="Phone"), action(id=ID_B, name="New"))
    merged, added, _ = ha.merge_hand_over(stored, incoming)
    assert added == 1
    assert [a["name"] for a in merged["actions"]] == ["Stored", "New"]


def test_globals_are_added_dropped_or_renamed_and_tokens_follow() -> None:
    stored = library(
        action(),
        globals_=[
            {"id": "S1", "key": "haurl", "value": "http://a"},
            {"id": "S2", "key": "token", "value": "one"},
            {"id": "S3", "key": "token_2", "value": "taken"},
        ],
    )
    incoming = library(
        action(id=ID_B, url="{{haurl}}/x/{{ token }}",
               headers=[header("Authorization", "Bearer {{token}}")],
               body="{{token}}{{token_3}}"),
        action(id=ID_A, url="{{token}}"),
        globals_=[
            {"id": "S1", "key": "haurl", "value": "http://a"},
            {"id": "P2", "key": "token", "value": "two"},
            {"id": "P3", "key": "token_3", "value": "mine"},
            {"id": "S2", "key": "new", "value": "n"},
        ],
    )
    merged, added, changed = ha.merge_hand_over(stored, incoming)
    assert (added, changed) == (1, True)
    keys = [(g["key"], g["value"]) for g in merged["globalVariables"]]
    assert keys == [
        ("haurl", "http://a"),
        ("token", "one"),
        ("token_2", "taken"),
        ("token_4", "two"),
        ("token_3", "mine"),
        ("new", "n"),
    ]
    added_action = merged["actions"][1]
    assert added_action["url"] == "{{haurl}}/x/{{token_4}}"
    assert added_action["headers"][0]["value"] == "Bearer {{token_4}}"
    assert added_action["body"] == "{{token_4}}{{token_3}}"
    # The stored action is untouched, and no two globals share an id.
    assert merged["actions"][0] == action()
    ids = [g["id"] for g in merged["globalVariables"]]
    assert len(set(ids)) == len(ids)
    ha.validate_document(merged)
    # Built against the merged library, the added action reads its own value.
    assert ha.build_request(merged, ID_B, {}).url == "http://a/x/two"


def test_a_hand_over_of_what_is_stored_changes_nothing() -> None:
    stored = library(action(), globals_=[{"id": "G", "key": "k", "value": "v"}])
    merged, added, changed = ha.merge_hand_over(stored, json.loads(json.dumps(stored)))
    assert (added, changed) == (0, False)
    assert merged == stored


def test_decode_audio() -> None:
    assert ha.decode_audio(None) is None
    assert ha.decode_audio(base64.b64encode(b"clip").decode()) == b"clip"
    with pytest.raises(ha.HTTPActionsInvalid):
        ha.decode_audio("not base64!")
