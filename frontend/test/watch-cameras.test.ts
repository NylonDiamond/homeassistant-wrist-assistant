// The Cameras screen's crop model (clamping, resizing from each corner,
// moving, the full frame, and what a save sends), its draft, and the route it
// answers to. The element itself is not mounted.

import { afterEach, describe, expect, it } from "vitest";
import type { CameraFraming } from "../src/ha-api.js";
import {
  cameraDraftDirty,
  discardCameraEdit,
  dropCameraDraft,
  editCameraDraft,
  openCameraDraft,
  rebaseCameraDraft,
  startCameraDraft,
} from "../src/watch-cameras/draft.js";
import { WATCH_CAMERAS_PATH, isWatchCamerasRoute } from "../src/watch-cameras/hook.js";
import {
  FULL_FRAME,
  MIN_CROP,
  autoStreamLabel,
  cameraEditOf,
  cameraSavePayload,
  cameraTestWords,
  cameraWithEdit,
  clampViewport,
  cropAspect,
  cropImagePlacement,
  effectiveOpenZoomed,
  fitAspect,
  isFullFrame,
  moveViewport,
  resizeViewport,
  sameCameraEdit,
  shortCameraId,
} from "../src/watch-cameras/model.js";

const at = (path: string) => ({ prefix: "/wrist-assistant", path });

const near = (v: { x: number; y: number; w: number; h: number }) => ({
  x: Math.round(v.x * 1e6) / 1e6, y: Math.round(v.y * 1e6) / 1e6, w: Math.round(v.w * 1e6) / 1e6, h: Math.round(v.h * 1e6) / 1e6,
});

const camera = (over: Partial<CameraFraming> = {}): CameraFraming => ({
  entity_id: "camera.door",
  name: "Front door",
  all_entity_ids: ["camera.door", "camera.door_fluent", "camera.door_snapshot"],
  viewport: null,
  open_zoomed: false,
  stream: { override: null, auto: "camera.door_fluent" },
  stream_choices: ["camera.door", "camera.door_fluent"],
  ...over,
});

describe("the route", () => {
  it("answers to /cameras and anything under it, and nothing else", () => {
    expect(WATCH_CAMERAS_PATH).toBe("/cameras");
    expect(isWatchCamerasRoute(at("/cameras"))).toBe(true);
    expect(isWatchCamerasRoute(at("/cameras/camera.door"))).toBe(true);
    expect(isWatchCamerasRoute(at("/camerasx"))).toBe(false);
    expect(isWatchCamerasRoute(at("/http-actions"))).toBe(false);
    expect(isWatchCamerasRoute(at(""))).toBe(false);
    expect(isWatchCamerasRoute(undefined)).toBe(false);
  });
});

describe("clampViewport", () => {
  it("makes no crop the full frame", () => {
    expect(clampViewport(null)).toEqual(FULL_FRAME);
    expect(clampViewport(undefined)).toEqual(FULL_FRAME);
  });

  it("keeps a crop inside the frame and no side under the minimum", () => {
    expect(clampViewport({ x: 0.2, y: 0.1, w: 0.5, h: 0.4 })).toEqual({ x: 0.2, y: 0.1, w: 0.5, h: 0.4 });
    expect(clampViewport({ x: -0.3, y: 1.4, w: 2, h: 0.01 })).toEqual({ x: 0, y: 1 - MIN_CROP, w: 1, h: MIN_CROP });
    expect(near(clampViewport({ x: 0.9, y: 0.95, w: 0.5, h: 0.5 }))).toEqual({ x: 0.5, y: 0.5, w: 0.5, h: 0.5 });
  });

  it("reads nonsense numbers as the full frame's", () => {
    expect(clampViewport({ x: Number.NaN, y: Infinity, w: Number.NaN, h: -Infinity })).toEqual(FULL_FRAME);
  });
});

describe("isFullFrame", () => {
  it("is true for no crop, the unit box, and a box a hair from the edges", () => {
    expect(isFullFrame(null)).toBe(true);
    expect(isFullFrame(FULL_FRAME)).toBe(true);
    expect(isFullFrame({ x: 0.0004, y: 0, w: 0.9995, h: 1 })).toBe(true);
  });

  it("is false for anything cut", () => {
    expect(isFullFrame({ x: 0.1, y: 0, w: 0.9, h: 1 })).toBe(false);
    expect(isFullFrame({ x: 0, y: 0, w: 1, h: 0.8 })).toBe(false);
  });
});

describe("resizeViewport", () => {
  const base = { x: 0.2, y: 0.2, w: 0.5, h: 0.5 };

  it("moves only the dragged corner's two edges, the opposite corner fixed", () => {
    expect(near(resizeViewport(base, "nw", -0.1, -0.05))).toEqual({ x: 0.1, y: 0.15, w: 0.6, h: 0.55 });
    expect(near(resizeViewport(base, "ne", 0.1, -0.05))).toEqual({ x: 0.2, y: 0.15, w: 0.6, h: 0.55 });
    expect(near(resizeViewport(base, "sw", -0.1, 0.05))).toEqual({ x: 0.1, y: 0.2, w: 0.6, h: 0.55 });
    expect(near(resizeViewport(base, "se", 0.1, 0.05))).toEqual({ x: 0.2, y: 0.2, w: 0.6, h: 0.55 });
  });

  it("stops each edge at the frame", () => {
    expect(near(resizeViewport(base, "nw", -1, -1))).toEqual({ x: 0, y: 0, w: 0.7, h: 0.7 });
    expect(near(resizeViewport(base, "ne", 1, -1))).toEqual({ x: 0.2, y: 0, w: 0.8, h: 0.7 });
    expect(near(resizeViewport(base, "sw", -1, 1))).toEqual({ x: 0, y: 0.2, w: 0.7, h: 0.8 });
    expect(near(resizeViewport(base, "se", 1, 1))).toEqual({ x: 0.2, y: 0.2, w: 0.8, h: 0.8 });
  });

  it("never shrinks a side below the minimum, however far a corner is pulled across", () => {
    for (const corner of ["nw", "ne", "sw", "se"] as const) {
      const sx = corner.includes("w") ? 1 : -1;
      const sy = corner.includes("n") ? 1 : -1;
      const v = resizeViewport(base, corner, sx, sy);
      expect(v.w, corner).toBeCloseTo(MIN_CROP, 9);
      expect(v.h, corner).toBeCloseTo(MIN_CROP, 9);
    }
    // The fixed corner stays where it was.
    const se = resizeViewport(base, "se", -1, -1);
    expect([se.x, se.y]).toEqual([0.2, 0.2]);
    const nw = resizeViewport(base, "nw", 1, 1);
    expect(nw.x + nw.w).toBeCloseTo(0.7, 9);
    expect(nw.y + nw.h).toBeCloseTo(0.7, 9);
  });
});

describe("moveViewport", () => {
  it("moves the box whole, kept inside the frame", () => {
    const base = { x: 0.2, y: 0.3, w: 0.5, h: 0.4 };
    expect(near(moveViewport(base, 0.1, -0.1))).toEqual({ x: 0.3, y: 0.2, w: 0.5, h: 0.4 });
    expect(near(moveViewport(base, 5, 5))).toEqual({ x: 0.5, y: 0.6, w: 0.5, h: 0.4 });
    expect(near(moveViewport(base, -5, -5))).toEqual({ x: 0, y: 0, w: 0.5, h: 0.4 });
  });

  it("leaves the full frame where it is", () => {
    expect(moveViewport(FULL_FRAME, 0.3, -0.2)).toEqual(FULL_FRAME);
  });
});

describe("the edit and what a save sends", () => {
  it("starts from what Home Assistant holds", () => {
    expect(cameraEditOf(camera())).toEqual({ viewport: FULL_FRAME, openZoomed: false, stream: null });
    const framed = camera({ viewport: { x: 0.1, y: 0.2, w: 0.5, h: 0.6 }, open_zoomed: true, stream: { override: "camera.door", auto: "camera.door_fluent" } });
    expect(cameraEditOf(framed)).toEqual({ viewport: { x: 0.1, y: 0.2, w: 0.5, h: 0.6 }, openZoomed: true, stream: "camera.door" });
  });

  it("sends every entity of the camera, the rounded crop and the zoomed live view, and leaves the stream alone when it did not change", () => {
    const base = cameraEditOf(camera());
    const edit = { ...base, viewport: resizeViewport(FULL_FRAME, "nw", 0.123456, 0.25), openZoomed: true };
    expect(cameraSavePayload(camera(), edit, base)).toEqual({
      entity_ids: ["camera.door", "camera.door_fluent", "camera.door_snapshot"],
      viewport: { x: 0.1235, y: 0.25, w: 0.8765, h: 0.75 },
      open_zoomed: true,
    });
  });

  it("sends null for the full frame, and never a zoomed live view without a crop", () => {
    const base = cameraEditOf(camera({ viewport: { x: 0.1, y: 0.1, w: 0.5, h: 0.5 }, open_zoomed: true }));
    const reset = { ...base, viewport: { ...FULL_FRAME } };
    expect(effectiveOpenZoomed(reset)).toBe(false);
    expect(cameraSavePayload(camera(), reset, base)).toEqual({
      entity_ids: ["camera.door", "camera.door_fluent", "camera.door_snapshot"],
      viewport: null,
      open_zoomed: false,
    });
  });

  it("sends the stream when it changed: an entity to override, null to go back to Auto", () => {
    const base = cameraEditOf(camera());
    expect(cameraSavePayload(camera(), { ...base, stream: "camera.door" }, base).stream_entity).toBe("camera.door");
    const overridden = { ...base, stream: "camera.door" };
    const back = cameraSavePayload(camera(), { ...overridden, stream: null }, overridden);
    expect("stream_entity" in back).toBe(true);
    expect(back.stream_entity).toBeNull();
  });

  it("falls back to the camera's own entity when it lists no others", () => {
    const lone = camera({ all_entity_ids: [] });
    expect(cameraSavePayload(lone, cameraEditOf(lone), cameraEditOf(lone)).entity_ids).toEqual(["camera.door"]);
  });

  it("calls two edits the same when they would save the same", () => {
    const a = cameraEditOf(camera());
    expect(sameCameraEdit(a, { ...a, viewport: { x: 0.0002, y: 0, w: 0.9998, h: 1 } })).toBe(true);
    // A zoomed live view on the full frame saves as off.
    expect(sameCameraEdit(a, { ...a, openZoomed: true })).toBe(true);
    expect(sameCameraEdit(a, { ...a, viewport: { x: 0.1, y: 0, w: 0.9, h: 1 } })).toBe(false);
    expect(sameCameraEdit(a, { ...a, stream: "camera.door" })).toBe(false);
    const framed = { ...a, viewport: { x: 0.1, y: 0.1, w: 0.5, h: 0.5 } };
    expect(sameCameraEdit(framed, { ...framed, openZoomed: true })).toBe(false);
  });

  it("shows a saved edit on the list before it is read again", () => {
    const edit = { viewport: { x: 0.1, y: 0.1, w: 0.5, h: 0.5 }, openZoomed: true, stream: "camera.door" };
    expect(cameraWithEdit(camera(), edit)).toEqual(camera({
      viewport: { x: 0.1, y: 0.1, w: 0.5, h: 0.5 }, open_zoomed: true, stream: { override: "camera.door", auto: "camera.door_fluent" },
    }));
  });
});

describe("words", () => {
  it("names Auto with what it detected", () => {
    expect(autoStreamLabel("camera.door_fluent")).toBe("Auto (detected: camera.door_fluent)");
    expect(autoStreamLabel(null)).toBe("Auto");
    expect(shortCameraId("camera.door")).toBe("door");
    expect(shortCameraId("door")).toBe("door");
  });

  it("says where a test went, or why it did not, in plain words", () => {
    expect(cameraTestWords({ ok: true, sent: 1 })).toEqual({ ok: true, text: "Sent to 1 device." });
    expect(cameraTestWords({ ok: true, sent: 3 })).toEqual({ ok: true, text: "Sent to 3 devices." });
    expect(cameraTestWords({ ok: false, sent: 0, reason: "no_devices" }).text).toBe("No device of yours is paired with this Home Assistant.");
    expect(cameraTestWords({ ok: false, sent: 0, reason: "no_push_token" }).text).toBe("Your devices have no push token yet. Open the app once.");
    expect(cameraTestWords({ ok: false, sent: 0, reason: "APNs said no" })).toEqual({ ok: false, text: "Not sent: APNs said no" });
    expect(cameraTestWords({ ok: false, sent: 0 }).ok).toBe(false);
  });
});

describe("drawing a crop over the full frame", () => {
  it("works out the crop's own proportions", () => {
    expect(cropAspect(FULL_FRAME, 16 / 9)).toBeCloseTo(16 / 9, 9);
    expect(cropAspect({ x: 0, y: 0, w: 0.5, h: 1 }, 2)).toBeCloseTo(1, 9);
  });

  it("letterboxes a box into a well of other proportions", () => {
    expect(fitAspect(2, 1)).toEqual({ width: 100, height: 50 });
    expect(fitAspect(0.5, 1)).toEqual({ width: 50, height: 100 });
    expect(fitAspect(16 / 9, 16 / 9)).toEqual({ width: 100, height: 100 });
  });

  it("places the full frame so only the crop shows", () => {
    expect(cropImagePlacement(FULL_FRAME)).toEqual({ width: 100, height: 100, left: -0, top: -0 });
    expect(cropImagePlacement({ x: 0.25, y: 0.5, w: 0.5, h: 0.25 })).toEqual({ width: 200, height: 400, left: -50, top: -200 });
  });
});

describe("the draft", () => {
  afterEach(() => dropCameraDraft());

  it("is clean when opened, dirty after a change, clean again on discard, and gone on drop", () => {
    const base = cameraEditOf(camera());
    startCameraDraft("camera.door", base);
    expect(cameraDraftDirty()).toBe(false);
    editCameraDraft({ ...base, viewport: { x: 0.1, y: 0.1, w: 0.5, h: 0.5 } });
    expect(cameraDraftDirty()).toBe(true);
    discardCameraEdit();
    expect(cameraDraftDirty()).toBe(false);
    expect(openCameraDraft()?.entityId).toBe("camera.door");
    dropCameraDraft();
    expect(openCameraDraft()).toBeUndefined();
    expect(cameraDraftDirty()).toBe(false);
  });

  it("takes a new base after a save, and keeps an edit when asked to", () => {
    const base = cameraEditOf(camera());
    const edit = { ...base, stream: "camera.door" };
    startCameraDraft("camera.door", base);
    editCameraDraft(edit);
    rebaseCameraDraft(base, true);
    expect(cameraDraftDirty()).toBe(true);
    rebaseCameraDraft(edit, false);
    expect(cameraDraftDirty()).toBe(false);
    expect(openCameraDraft()?.edit).toEqual(edit);
  });
});
