"""Offline tests for Light Look on the server side: the light the iPhone
saves in a tile's icon photo is a PNG ``tEXt`` chunk (keyword
``WristAssistantGlow``) right after ``IHDR`` (app repo
docs/photo_tiles_plan_2026-10.md, "Light Look"). A light's photo may also
carry a second, whole PNG taken with the light on in a ``waOn`` chunk right
before ``IEND`` ("On photo"). The store never reads either; it must take
such a PNG and keep it byte for byte, so a device reading the photo back
finds the light and the On photo where they were put. Through the phone's op
and the panel's WebSocket upload alike.

Nothing here talks to a live Home Assistant.
"""

from __future__ import annotations

import base64
import json
import struct
import zlib

from test_page_images_ops import b64, env, op, ws_call  # noqa: F401 (env: fixture)
from test_page_images_store import ICON_UUID

RECIPE = {"v": 1, "dir": "up", "glow": 0.8}


def _chunk(kind: bytes, body: bytes) -> bytes:
    return struct.pack(">I", len(body)) + kind + body + struct.pack(">I", zlib.crc32(kind + body))


def lit_png(width: int = 240, height: int = 180) -> bytes:
    """A PNG as the iPhone writes one with a light: the signature, ``IHDR``,
    the ``tEXt`` chunk with the recipe, an ``IDAT`` and ``IEND``."""
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    text = b"WristAssistantGlow\x00" + json.dumps(RECIPE, separators=(",", ":")).encode("latin-1")
    return (
        b"\x89PNG\r\n\x1a\n"
        + _chunk(b"IHDR", ihdr)
        + _chunk(b"tEXt", text)
        + _chunk(b"IDAT", zlib.compress(bytes(16)))
        + _chunk(b"IEND", b"")
    )


def test_the_phones_put_of_a_lit_photo_is_kept_byte_for_byte(env) -> None:  # noqa: F811
    data = lit_png()
    reply = op(env, "_op_page_image_put", {"image_id": ICON_UUID, "data": b64(data), "kind": "icon"})
    assert (reply.status, reply.body) == (200, {"ok": True, "status": "stored"})
    entry = env.store.entry(ICON_UUID)
    assert (entry["format"], entry["width"], entry["height"], entry["bytes"]) == ("png", 240, 180, len(data))
    got = op(env, "_op_page_image_get", {"image_id": ICON_UUID})
    assert (got.status, got.content_type, got.body) == (200, "image/png", data)
    assert (env.base.folder / f"{ICON_UUID}.png").read_bytes() == data


def test_the_panels_upload_and_get_keep_the_light(env) -> None:  # noqa: F811
    data = lit_png(64, 64)
    image_id = ws_call(env, env.ws.ws_page_images_upload, data=b64(data), kind="icon").results[1]["image_id"]
    got = ws_call(env, env.ws.ws_page_images_get, image_id=image_id).results[1]
    assert got["content_type"] == "image/png"
    assert base64.b64decode(got["data"]) == data
    assert b"WristAssistantGlow\x00" in base64.b64decode(got["data"])


def test_the_phones_put_of_a_photo_with_an_on_photo_is_kept_byte_for_byte(env) -> None:  # noqa: F811
    lit = lit_png(48, 32)
    on = lit_png(48, 32)
    data = lit[:-12] + _chunk(b"waOn", on) + lit[-12:]
    assert data.endswith(_chunk(b"IEND", b""))
    reply = op(env, "_op_page_image_put", {"image_id": ICON_UUID, "data": b64(data), "kind": "icon"})
    assert (reply.status, reply.body) == (200, {"ok": True, "status": "stored"})
    entry = env.store.entry(ICON_UUID)
    assert (entry["format"], entry["width"], entry["height"], entry["bytes"]) == ("png", 48, 32, len(data))
    got = op(env, "_op_page_image_get", {"image_id": ICON_UUID})
    assert (got.status, got.content_type, got.body) == (200, "image/png", data)
    assert b"waOn" + on in got.body
