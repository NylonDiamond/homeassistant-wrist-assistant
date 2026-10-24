"""Stand-ins for the views' capped body readers and the signed header
precheck, for tests that pull views out of ``wa_v2_views.py`` with fake
requests handing over a parsed payload through ``json()`` (or bytes through
``read()``) rather than a body stream. The real readers and the real
precheck are tested in test_capped_body.py and test_widget_hmac.py."""

from __future__ import annotations

from typing import Any


class BodyTooLarge(ValueError):
    pass


async def read_capped_json(request: Any, _limit: int) -> Any:
    return await request.json()


async def read_capped_body(request: Any, _limit: int) -> bytes:
    return await request.read()


def precheck(*_args: Any, **_kwargs: Any) -> None:
    return None


CAPPED_BODY_NAMES: dict[str, Any] = {
    "_BodyTooLarge": BodyTooLarge,
    "_read_capped_json": read_capped_json,
    "_read_capped_body": read_capped_body,
    "precheck_wa_request": precheck,
    "PAIR_MAX_BODY_BYTES": 16 * 1024,
    "ACTION_MAX_BODY_BYTES": 3 * 1024 * 1024,
}
