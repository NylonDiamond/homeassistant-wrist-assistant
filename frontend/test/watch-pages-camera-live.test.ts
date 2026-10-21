// The editor's live camera helpers: which entities are a camera's SD and HD
// streams, which the Add tile list leaves out, and how a playing stream is
// described and turned.

import { describe, expect, it } from "vitest";
import type { CameraFraming } from "../src/ha-api.js";
import {
  watchCameraLiveEntity,
  watchCameraLiveFactsText,
  watchCameraLiveTurns,
  watchCameraStreamsFrom,
  watchCodecName,
  watchHiddenCameraIds,
} from "../src/watch-pages/camera-live.js";
import { watchAddPool } from "../src/watch-pages/add-tile-list.js";

const SD = "camera.front_yard_fluent";
const HD = "camera.front_yard_clear";
const SNAP = "camera.front_yard_snapshots_fluent";

function row(entityId: string, all: string[], streams?: { sd: string | null; hd: string | null }): CameraFraming {
  return {
    entity_id: entityId,
    name: entityId,
    all_entity_ids: all,
    viewport: null,
    open_zoomed: false,
    stream: { override: null, auto: null },
    stream_choices: all,
    ...(streams === undefined ? {} : { streams }),
  };
}

const ROWS = [
  row(HD, [SD, HD, SNAP], { sd: SD, hd: HD }),
  row("camera.garage", ["camera.garage"], { sd: null, hd: null }),
];

describe("a camera's streams", () => {
  it("are found from any entity of the device", () => {
    expect(watchCameraStreamsFrom(ROWS, SD)).toEqual({ sd: SD, hd: HD });
    expect(watchCameraStreamsFrom(ROWS, SNAP)).toEqual({ sd: SD, hd: HD });
    expect(watchCameraStreamsFrom(ROWS, "camera.garage")).toEqual({ sd: undefined, hd: undefined });
    expect(watchCameraStreamsFrom(ROWS, "camera.none")).toBeUndefined();
    // An integration older than `streams` names none.
    expect(watchCameraStreamsFrom([row(HD, [SD, HD])], SD)).toEqual({ sd: undefined, hd: undefined });
  });

  it("play the SD stream in the editor's live tiles", () => {
    expect(watchCameraLiveEntity(ROWS, HD)).toBe(SD);
    expect(watchCameraLiveEntity(ROWS, "camera.garage")).toBe("camera.garage");
    expect(watchCameraLiveEntity(undefined, HD)).toBe(HD);
  });
});

describe("the Add tile list", () => {
  const states = { [SD]: {}, [HD]: {}, [SNAP]: {}, "camera.garage": {} };

  it("leaves out a camera's other streams, keeping its SD stream", () => {
    expect([...watchHiddenCameraIds(ROWS, states)].sort()).toEqual([HD, SNAP].sort());
    // An SD stream with no state (disabled) hides nothing.
    expect(watchHiddenCameraIds(ROWS, { [HD]: {} }).size).toBe(0);
  });

  it("drops them from the pool unless on the page or kept", () => {
    const hass = { states: Object.fromEntries(Object.keys(states).map((id) => [id, { entity_id: id, state: "idle", attributes: {} }])) } as unknown as Parameters<typeof watchAddPool>[0]["hass"];
    const hidden = watchHiddenCameraIds(ROWS, states);
    const ids = (onPage: string[], keep: string[]) =>
      watchAddPool({ hass, onPage: new Set(onPage), keep: new Set(keep), hidden }).candidates.map((c) => c.entityId).sort();
    expect(ids([], [])).toEqual(["camera.garage", SD].sort());
    expect(ids([], [HD])).toEqual(["camera.garage", HD, SD].sort());
  });
});

describe("a playing stream", () => {
  it("is described as size, codec and frame rate", () => {
    expect(watchCodecName("video/H265")).toBe("H.265");
    expect(watchCodecName("video/H264")).toBe("H.264");
    expect(watchCodecName("video/VP8")).toBe("VP8");
    expect(watchCodecName(undefined)).toBeUndefined();
    expect(watchCameraLiveFactsText({ width: 7680, height: 2160, codec: "H.265", fps: 19.6 })).toBe("7680×2160 · H.265 · 20 fps");
    expect(watchCameraLiveFactsText({ width: 640, height: 360, codec: undefined, fps: undefined })).toBe("640×360");
  });

  it("turns a quarter left when it is the other shape from the camera", () => {
    // A Duo 3's HD stream comes tall for a wide camera.
    expect(watchCameraLiveTurns(2160, 7680, true)).toBe(true);
    expect(watchCameraLiveTurns(7680, 2160, true)).toBe(false);
    expect(watchCameraLiveTurns(1920, 1080, false)).toBe(true);
    // Square-ish, or no ratio known: as it comes.
    expect(watchCameraLiveTurns(1000, 1100, true)).toBe(false);
    expect(watchCameraLiveTurns(2160, 7680, undefined)).toBe(false);
  });
});
