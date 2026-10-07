// How a camera is framed in alert pictures, as plain numbers: the crop box
// the Cameras screen drags, the edit it keeps, and what a save sends.
//
// A crop is four fractions of the full frame (`x`, `y`, `w`, `h`, each 0..1),
// the same shape Home Assistant stores. The full frame is no crop at all, and
// a save sends null for it. The rules for dragging are the iPhone app's Camera
// Framing screen's: a corner moves its two edges and the opposite corner stays
// put, a drag inside moves the whole box, nothing leaves the frame, and no
// side goes below `MIN_CROP` so the box stays big enough to grab.
//
// Nothing here touches the DOM, so all of it is tested on its own.

import type { CameraFraming, CameraFramingSave, CameraTestReply, CameraViewport } from "../ha-api.js";

/** The smallest side of a crop, as a fraction of the frame. */
export const MIN_CROP = 0.12;

/** How close to the edge still counts as the edge, so a box dragged back
 * out to the corners by hand is the full frame again. */
const EDGE = 0.001;

export const FULL_FRAME: CameraViewport = { x: 0, y: 0, w: 1, h: 1 };

export type CropCorner = "nw" | "ne" | "sw" | "se";
export const CROP_CORNERS: readonly CropCorner[] = ["nw", "ne", "sw", "se"];

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const finite = (n: unknown, fallback: number) => (typeof n === "number" && Number.isFinite(n) ? n : fallback);
const round4 = (n: number) => Math.round(n * 10_000) / 10_000;

/** A crop as Home Assistant may hand it (or null), made one the box can
 * show: inside the frame, no side under `MIN_CROP`. Null is the full frame. */
export function clampViewport(v: CameraViewport | null | undefined): CameraViewport {
  if (v === null || v === undefined) return { ...FULL_FRAME };
  const w = clamp(finite(v.w, 1), MIN_CROP, 1);
  const h = clamp(finite(v.h, 1), MIN_CROP, 1);
  const x = clamp(finite(v.x, 0), 0, 1 - w);
  const y = clamp(finite(v.y, 0), 0, 1 - h);
  return { x, y, w, h };
}

/** Whether a crop covers the whole frame, which is the same as none. */
export function isFullFrame(v: CameraViewport | null | undefined): boolean {
  if (v === null || v === undefined) return true;
  return v.x <= EDGE && v.y <= EDGE && v.x + v.w >= 1 - EDGE && v.y + v.h >= 1 - EDGE;
}

/** Resize by dragging one corner by `dx`, `dy` (fractions of the frame).
 * The opposite corner stays fixed; each moved edge stays inside the frame
 * and at least `MIN_CROP` from its partner. */
export function resizeViewport(base: CameraViewport, corner: CropCorner, dx: number, dy: number): CameraViewport {
  let left = base.x;
  let top = base.y;
  let right = base.x + base.w;
  let bottom = base.y + base.h;
  if (corner === "nw" || corner === "sw") left = Math.min(Math.max(0, base.x + dx), right - MIN_CROP);
  if (corner === "ne" || corner === "se") right = Math.max(Math.min(1, base.x + base.w + dx), left + MIN_CROP);
  if (corner === "nw" || corner === "ne") top = Math.min(Math.max(0, base.y + dy), bottom - MIN_CROP);
  if (corner === "sw" || corner === "se") bottom = Math.max(Math.min(1, base.y + base.h + dy), top + MIN_CROP);
  return { x: left, y: top, w: right - left, h: bottom - top };
}

/** Move the whole box by `dx`, `dy`, kept inside the frame. */
export function moveViewport(base: CameraViewport, dx: number, dy: number): CameraViewport {
  return {
    x: clamp(base.x + dx, 0, 1 - base.w),
    y: clamp(base.y + dy, 0, 1 - base.h),
    w: base.w,
    h: base.h,
  };
}

/** One camera's framing as the editor changes it. `stream` is the override:
 * null means Auto. */
export interface CameraEdit {
  viewport: CameraViewport;
  openZoomed: boolean;
  stream: string | null;
}

/** The edit a camera starts from: what Home Assistant holds. */
export function cameraEditOf(camera: Pick<CameraFraming, "viewport" | "open_zoomed" | "stream">): CameraEdit {
  return {
    viewport: clampViewport(camera.viewport),
    openZoomed: camera.open_zoomed === true,
    stream: camera.stream?.override ?? null,
  };
}

/** The zoomed live view only means something with a crop to zoom to. */
export function effectiveOpenZoomed(edit: CameraEdit): boolean {
  return edit.openZoomed && !isFullFrame(edit.viewport);
}

function sameViewport(a: CameraViewport, b: CameraViewport): boolean {
  if (isFullFrame(a) && isFullFrame(b)) return true;
  return round4(a.x) === round4(b.x) && round4(a.y) === round4(b.y) && round4(a.w) === round4(b.w) && round4(a.h) === round4(b.h);
}

/** Whether two edits would save the same thing. */
export function sameCameraEdit(a: CameraEdit, b: CameraEdit): boolean {
  return sameViewport(a.viewport, b.viewport) && effectiveOpenZoomed(a) === effectiveOpenZoomed(b) && a.stream === b.stream;
}

/** What Save sends for an edit: every entity of the camera, the crop (null
 * for the full frame), the zoomed live view, and the stream override only
 * when it changed from `base`, so a pick made elsewhere is left alone. */
export function cameraSavePayload(
  camera: Pick<CameraFraming, "entity_id" | "all_entity_ids">,
  edit: CameraEdit,
  base: CameraEdit,
): CameraFramingSave {
  const ids = camera.all_entity_ids.length > 0 ? [...camera.all_entity_ids] : [camera.entity_id];
  const full = isFullFrame(edit.viewport);
  const v = edit.viewport;
  const payload: CameraFramingSave = {
    entity_ids: ids,
    viewport: full ? null : { x: round4(v.x), y: round4(v.y), w: round4(v.w), h: round4(v.h) },
    open_zoomed: effectiveOpenZoomed(edit),
  };
  if (edit.stream !== base.stream) payload.stream_entity = edit.stream;
  return payload;
}

/** A camera as the list shows it once an edit is saved, before the list is
 * read again. */
export function cameraWithEdit(camera: CameraFraming, edit: CameraEdit): CameraFraming {
  const payload = cameraSavePayload(camera, edit, edit);
  return {
    ...camera,
    viewport: payload.viewport,
    open_zoomed: payload.open_zoomed === true,
    stream: { ...camera.stream, override: edit.stream },
  };
}

/** The first choice of the stream picker. */
export function autoStreamLabel(auto: string | null | undefined): string {
  return auto ? `Auto (detected: ${auto})` : "Auto";
}

/** An entity without its `camera.` prefix, for a short line on a card. */
export function shortCameraId(entityId: string): string {
  return entityId.startsWith("camera.") ? entityId.slice("camera.".length) : entityId;
}

/** A test alert's answer in plain words, and whether it went. */
export function cameraTestWords(reply: CameraTestReply): { ok: boolean; text: string } {
  if (reply.ok && reply.sent > 0) return { ok: true, text: `Sent to ${reply.sent} ${reply.sent === 1 ? "device" : "devices"}.` };
  switch (reply.reason) {
    case "no_devices": return { ok: false, text: "No device of yours is paired with this Home Assistant." };
    case "no_push_token": return { ok: false, text: "Your devices have no push token yet. Open the app once." };
    case undefined:
    case "": return { ok: false, text: "Not sent. No device took the alert." };
    default: return { ok: false, text: `Not sent: ${reply.reason}` };
  }
}

/** The crop's own proportions (width over height) on a frame of
 * `imageAspect`. */
export function cropAspect(v: CameraViewport, imageAspect: number): number {
  const a = imageAspect > 0 && Number.isFinite(imageAspect) ? imageAspect : 16 / 9;
  return (v.w * a) / Math.max(v.h, 0.0001);
}

/** A box of proportions `inner` fitted inside one of `outer`, centred, as
 * percentages of the outer box: the way a picture shows with letterboxing. */
export function fitAspect(inner: number, outer: number): { width: number; height: number } {
  if (!(inner > 0) || !(outer > 0)) return { width: 100, height: 100 };
  return inner >= outer ? { width: 100, height: (outer / inner) * 100 } : { width: (inner / outer) * 100, height: 100 };
}

/** Where the full frame goes inside a box that shows only the crop, as
 * percentages of that box. The box must have the crop's own proportions
 * (`cropAspect`) for the picture to keep its shape. */
export function cropImagePlacement(v: CameraViewport): { width: number; height: number; left: number; top: number } {
  const w = Math.max(v.w, 0.0001);
  const h = Math.max(v.h, 0.0001);
  return { width: 100 / w, height: 100 / h, left: (-v.x / w) * 100, top: (-v.y / h) * 100 };
}
