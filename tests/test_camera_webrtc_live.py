"""The webrtc_* ops end to end, against a live Home Assistant.

Skips without HA_URL (conftest). Drives the real endpoint with an ephemeral
signed identity, the way the iPhone does:

* `webrtc_cameras` answers for every camera entity, and names at least one
  that plays WebRTC when go2rtc is running (the dev box has several);
* a receive-only video offer to such a camera comes back with an answer SDP
  in one round trip, and the session can be swapped candidates on, kept and
  closed;
* a session closed is gone, and an unknown camera or a camera with no
  WebRTC is refused with a reason, not an error.

The offer is a hand-written SDP: go2rtc answers it, which is all the
signaling needs. No media flows, since nothing here speaks DTLS.

    .venv-test/bin/python -m pytest -v tests/test_camera_webrtc_live.py
"""

from __future__ import annotations

import hashlib
import hmac
import json
import secrets
import time
from collections.abc import Callable

import pytest
import requests

WA_PROTOCOL_VERSION = 2

OFFER = "\r\n".join(
    [
        "v=0",
        "o=- 4611731400430051336 2 IN IP4 127.0.0.1",
        "s=-",
        "t=0 0",
        "a=group:BUNDLE 0",
        "a=msid-semantic: WMS",
        "m=video 9 UDP/TLS/RTP/SAVPF 102",
        "c=IN IP4 0.0.0.0",
        "a=rtcp:9 IN IP4 0.0.0.0",
        "a=ice-ufrag:wa1x",
        "a=ice-pwd:wristassistanticepasswordx",
        "a=ice-options:trickle",
        "a=fingerprint:sha-256 "
        + ":".join(["AB"] * 32),
        "a=setup:actpass",
        "a=mid:0",
        "a=recvonly",
        "a=rtcp-mux",
        "a=rtpmap:102 H264/90000",
        "a=rtcp-fb:102 nack",
        "a=rtcp-fb:102 nack pli",
        "a=fmtp:102 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f",
        "",
    ]
)


def _call(base_url: str, watch_id: str, secret: bytes, op: str, payload: dict) -> requests.Response:
    body = json.dumps(payload).encode()
    ts = int(time.time())
    nonce = secrets.token_hex(16)
    canonical = f"v{WA_PROTOCOL_VERSION}|{op}|{watch_id}|{ts}|{nonce}".encode() + b"\n" + body
    return requests.post(
        f"{base_url}/api/wrist_assistant/v2/action",
        data=body,
        headers={
            "Content-Type": "application/json",
            "X-WA-Version": str(WA_PROTOCOL_VERSION),
            "X-WA-Op": op,
            "X-WA-Watch": watch_id,
            "X-WA-Ts": str(ts),
            "X-WA-Nonce": nonce,
            "X-WA-Sig": hmac.new(secret, canonical, hashlib.sha256).hexdigest(),
        },
        timeout=20,
        verify=False,
    )


@pytest.fixture
def phone(base_url: str, register_secret: Callable[..., bytes]):
    watch_id = f"iphone:test-webrtc-{secrets.token_hex(6)}"
    secret = register_secret(watch_id, label="pytest camera_webrtc")

    def call(op: str, payload: dict) -> requests.Response:
        r = _call(base_url, watch_id, secret, op, payload)
        if r.status_code == 400 and "Unknown op" in r.text:
            pytest.skip("the instance predates the webrtc ops; deploy first")
        return r

    return call


def _camera_ids(base_url: str, session: requests.Session) -> list[str]:
    states = session.get(f"{base_url}/api/states", timeout=10).json()
    return [s["entity_id"] for s in states if s["entity_id"].startswith("camera.")]


def test_cameras_offer_candidates_keepalive_close(phone, base_url, session) -> None:
    cameras = _camera_ids(base_url, session)
    if not cameras:
        pytest.skip("no camera entities on this instance")

    r = phone("webrtc_cameras", {"entity_ids": cameras, "quality_level": "sd"})
    assert r.status_code == 200, r.text
    answers = r.json()["cameras"]
    assert set(answers) == set(cameras)
    playable = [cid for cid, a in answers.items() if a["webrtc"]]
    if not playable:
        pytest.skip("no camera here plays WebRTC (is go2rtc running?)")
    assert all("configuration" in answers[cid]["client"] for cid in playable)

    # Try each camera: one that is offline answers with go2rtc's error, which
    # is a refusal with a reason (`ok: false`), not a failure of the op.
    offer = None
    for cid in playable:
        source = answers[cid]["source"]
        start = time.monotonic()
        r = phone("webrtc_offer", {"entity_id": source, "offer": OFFER})
        elapsed_ms = (time.monotonic() - start) * 1000
        assert r.status_code == 200, r.text
        reply = r.json()
        if not reply["ok"]:
            assert reply["error"] and "message" in reply
            print(f"\n{source}: refused in {elapsed_ms:.0f} ms ({reply['error']})")
            continue
        print(f"\n{source}: answer in {elapsed_ms:.0f} ms, {len(reply['candidates'])} candidates with it")
        if offer is None:
            offer = reply
        else:
            phone("webrtc_close", {"session_ids": [reply["session_id"]]})
    if offer is None:
        pytest.skip("every WebRTC camera here refused (all offline?)")
    assert offer["answer"].startswith("v=0")
    assert "a=mid:0" in offer["answer"]
    session_id = offer["session_id"]

    r = phone("webrtc_candidates", {"session_id": session_id, "candidates": []})
    assert r.status_code == 200 and r.json()["ok"], r.text

    r = phone("webrtc_keepalive", {"session_ids": [session_id, "nope"]})
    assert r.json()["alive"] == [session_id]

    r = phone("webrtc_close", {"session_ids": [session_id]})
    assert r.json()["closed"] == 1
    r = phone("webrtc_candidates", {"session_id": session_id, "candidates": []})
    assert r.json() == {"ok": False, "error": "gone"}


def test_refusals_carry_a_reason(phone) -> None:
    r = phone("webrtc_offer", {"entity_id": "camera.__wa_no_such_camera__", "offer": OFFER})
    assert r.status_code == 404
    r = phone("webrtc_offer", {"entity_id": "light.kitchen", "offer": OFFER})
    assert r.status_code == 400
    r = phone("webrtc_cameras", {"entity_ids": "camera.x"})
    assert r.status_code == 400


def test_main_streams_answer_an_h264_offer(phone, base_url, session) -> None:
    """The main stream a big iPhone tile swaps up to (`quality_level: hd`).

    Prints, per camera with a separate main stream, whether go2rtc answers
    the phone's H.264-only offer for it. A main stream in H.265 is turned
    down (`m=video 0`) or refused: the phone's WebRTC build cannot decode
    it, and the tile stays on its sub stream.
    """
    cameras = _camera_ids(base_url, session)
    if not cameras:
        pytest.skip("no camera entities on this instance")
    sub = phone("webrtc_cameras", {"entity_ids": cameras, "quality_level": "sd"}).json()["cameras"]
    main = phone("webrtc_cameras", {"entity_ids": cameras, "quality_level": "hd"}).json()["cameras"]
    separate = [cid for cid in cameras if main[cid]["webrtc"] and main[cid]["source"] != sub[cid]["source"]]
    if not separate:
        pytest.skip("no camera here has a main stream apart from its sub stream")
    for cid in separate:
        source = main[cid]["source"]
        start = time.monotonic()
        reply = phone("webrtc_offer", {"entity_id": source, "offer": OFFER}).json()
        elapsed_ms = (time.monotonic() - start) * 1000
        if not reply["ok"]:
            print(f"\n{cid}: main {source} refused in {elapsed_ms:.0f} ms ({reply['error']}: {reply.get('message', '')})")
            continue
        turned_down = any(line.startswith("m=video 0 ") for line in reply["answer"].splitlines())
        print(f"\n{cid}: main {source} answered in {elapsed_ms:.0f} ms{', video turned down' if turned_down else ''}")
        phone("webrtc_close", {"session_ids": [reply["session_id"]]})
