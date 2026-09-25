// The 3D layer stack: the face taken apart into one clear sheet per layer,
// floating over each other, turned by dragging. It only shows; nothing in it
// edits, apart from a click selecting the layer on a sheet.
//
// The view is four numbers. Turning and spreading write them straight into
// the rig's style (see `stackRigStyle`), so a drag never re-renders the panel.

/** Where the stack is looked at from. `yaw` turns it round, `pitch` tips it
 * back from facing you, both in degrees. `spread` is how far apart the sheets
 * float, 0 (flat, the face as drawn) to 1. `zoom` scales the whole stack. */
export interface StackView {
  yaw: number;
  pitch: number;
  spread: number;
  zoom: number;
}

/** The view it opens to: tipped back and turned, the classic exploded look. */
export const STACK_HOME: StackView = { yaw: -32, pitch: 58, spread: 0.6, zoom: 1 };

/** The view it animates out of: the face as the editor draws it. */
export const STACK_FLAT: StackView = { yaw: 0, pitch: 0, spread: 0, zoom: 1 };

export const STACK_PITCH_MAX = 85;
export const STACK_ZOOM_MIN = 0.4;
export const STACK_ZOOM_MAX = 2.5;

/** Degrees turned per pixel dragged. */
const TURN_PER_PX = 0.35;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** A drag of `dx`, `dy` pixels: across turns the stack round, down tips it
 * further back. Tipping stops short of edge-on, where every sheet is a line. */
export function turnStack(view: StackView, dx: number, dy: number): StackView {
  return {
    ...view,
    yaw: view.yaw + dx * TURN_PER_PX,
    pitch: clamp(view.pitch - dy * TURN_PER_PX, 0, STACK_PITCH_MAX),
  };
}

/** A wheel step. A positive `deltaY` (scrolling down) moves away. */
export function zoomStack(view: StackView, deltaY: number): StackView {
  return { ...view, zoom: clamp(view.zoom * Math.exp(-deltaY * 0.0015), STACK_ZOOM_MIN, STACK_ZOOM_MAX) };
}

/** Extra room, in sheet steps, where one group ends and the next begins, so
 * the groups read as clusters. */
export const GROUP_GAP = 0.8;

/**
 * Each sheet's height in the stack, in steps, back to front, centred on 0 so
 * the stack turns round its middle. One step between neighbours, and
 * `GROUP_GAP` more where the group changes. `groupIds` is one entry per sheet
 * in drawing order, undefined for a sheet in no group.
 */
export function sheetUnits(groupIds: readonly (string | undefined)[]): number[] {
  const units: number[] = [];
  let u = 0;
  groupIds.forEach((g, i) => {
    if (i > 0) u += 1 + (g !== groupIds[i - 1] ? GROUP_GAP : 0);
    units.push(u);
  });
  const mid = u / 2;
  return units.map((v) => v - mid);
}

/**
 * The height of one step as a share of the face's width. A full spread puts
 * the whole stack about 1.3 faces tall, but a few sheets never fly further
 * apart than a quarter of a face each.
 */
export function stepFactor(spread: number, units: readonly number[]): number {
  const span = units.length < 2 ? 0 : units[units.length - 1]! - units[0]!;
  const per = span === 0 ? 0.25 : Math.min(0.25, 1.3 / span);
  return clamp(spread, 0, 1) * per;
}

/** The rig's inline style for a view: the turn, and the step each sheet's
 * `--u` is multiplied by. */
export function stackRigStyle(view: StackView, units: readonly number[]): string {
  return `transform: scale(${view.zoom}) rotateX(${view.pitch}deg) rotateZ(${view.yaw}deg); --k: ${stepFactor(view.spread, units)}`;
}
