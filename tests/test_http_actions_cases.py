"""The shared HTTP action cases, run against ``http_actions.py``.

The app writes three case files from its live Swift rules (rule 21 of the
batch 4 contract) and the fixtures script copies them to
``tests/fixtures-http-actions/``. Every case found there runs here, so a rule
that reads differently in Python and in Swift fails a named case:

* ``request-cases.json``: a library, an action id, the values and the clip,
  and what ``makeURLRequest`` built (method, URL, headers in sending order
  with the automatic Content-Type, body, timeout) or the error it threw.
* ``reply-cases.json``: a reply setting, a status, headers and a body, and
  the value ``HTTPResponseExtractor.extract`` read and the snippet.
* ``public-cases.json``: a library and the public list made from it.

``tests/fixtures-http-actions-local/`` holds a few cases of the same format
written by hand, so the loader runs before the app's files arrive. A shared
folder that is missing or empty is a skip, not a pass.
"""

from __future__ import annotations

import base64
import json
from pathlib import Path
from typing import Any

import pytest

from test_http_actions import load_http_actions

ha = load_http_actions()

_TESTS = Path(__file__).resolve().parent
SHARED = _TESTS / "fixtures-http-actions"
LOCAL = _TESTS / "fixtures-http-actions-local"
FILES = ("request-cases.json", "reply-cases.json", "public-cases.json")


def _cases(folder: Path, file_name: str) -> list[Any]:
    path = folder / file_name
    if not path.is_file():
        return []
    data = json.loads(path.read_text())
    assert data.get("version") == 1, f"{path}: unknown version {data.get('version')}"
    cases = data.get("cases")
    assert isinstance(cases, list), f"{path}: no case list"
    return [
        pytest.param(case, id=f"{folder.name}/{file_name}:{case.get('name')}")
        for case in cases
    ]


def _params(file_name: str) -> list[Any]:
    found = _cases(SHARED, file_name) + _cases(LOCAL, file_name)
    if not _cases(SHARED, file_name):
        found.append(
            pytest.param(
                None,
                id=f"{SHARED.name}/{file_name}",
                marks=pytest.mark.skip(reason=f"no shared {file_name} copied yet"),
            )
        )
    return found


def test_the_local_cases_are_there() -> None:
    """The hand-made cases are what keeps the loader honest until the app's
    arrive; losing them would leave every test here a skip."""
    for file_name in FILES:
        assert _cases(LOCAL, file_name), f"no local {file_name}"


@pytest.mark.parametrize("case", _params("request-cases.json"))
def test_request_case(case: dict[str, Any]) -> None:
    expect = case["expect"]
    audio = case.get("audioBase64")
    clip = base64.b64decode(audio) if audio else None
    if expect.get("error"):
        with pytest.raises(ha.RequestError) as caught:
            ha.build_request(case["library"], case["actionId"], case.get("values") or {}, clip)
        assert caught.value.code == expect["error"]
        return
    built = ha.build_request(case["library"], case["actionId"], case.get("values") or {}, clip)
    assert built.method == expect["method"]
    assert built.url == expect["url"]
    assert [list(pair) for pair in built.headers] == [list(pair) for pair in expect["headers"]]
    if expect.get("bodyBase64") is not None:
        assert built.body == base64.b64decode(expect["bodyBase64"])
    elif expect.get("bodyUTF8") is not None:
        assert built.body is not None
        assert built.body.decode("utf-8") == expect["bodyUTF8"]
    else:
        assert built.body is None
    assert built.timeout == expect["timeout"]


@pytest.mark.parametrize("case", _params("reply-cases.json"))
def test_reply_case(case: dict[str, Any]) -> None:
    body = base64.b64decode(case.get("bodyBase64") or "")
    expect = case["expect"]
    assert ha.extract_reply(case.get("config"), case.get("status"), case.get("headers") or {}, body) == expect["value"]
    assert ha.snippet(body) == expect["snippet"]


@pytest.mark.parametrize("case", _params("public-cases.json"))
def test_public_case(case: dict[str, Any]) -> None:
    assert ha.public_list(case["library"]) == case["expect"]
