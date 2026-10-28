// The map editor's plain arithmetic and words, kept apart from the element
// so they can be tested without a browser: the stage's pan and zoom (a view
// is pixels per meter and where the plan's 0, 0 sits on the stage), which
// keys mean what and when a key belongs to a text field instead, and the
// sizes and names the editor writes ("4.10 m", "4.1 × 2.7 m", "Kitchen, top
// wall", "Washer dryer").

import { homeLabelPoint, homePolygonArea, homePolygonHolds, homeRoomDirection, homeRoomReach } from "./geometry.js";
import { homeMapRoomWalls } from "./edit-ops.js";
import { type HomeMapFloor, type HomeMapOpening, type HomeMapRoom, type HomePoint, homeMapBounds } from "./model.js";

// ── the stage's view ─────────────────────────────────────────────────────

/** How the plan sits on the stage: `scale` CSS pixels per meter, the plan's
 * 0, 0 at `ox`, `oy` pixels from the stage's top left. */
export interface HomeMapView {
  scale: number;
  ox: number;
  oy: number;
}

/** The zoom's reach, in pixels per meter. */
export const HOME_MAP_MIN_SCALE = 4;
export const HOME_MAP_MAX_SCALE = 2400;

/** A stage point (pixels) for a plan point (meters). */
export function homeMapToScreen(view: HomeMapView, p: readonly number[]): HomePoint {
  return [view.ox + p[0]! * view.scale, view.oy + p[1]! * view.scale];
}

/** The plan point (meters) under a stage point (pixels). */
export function homeMapToPlan(view: HomeMapView, s: readonly number[]): HomePoint {
  return [(s[0]! - view.ox) / view.scale, (s[1]! - view.oy) / view.scale];
}

/** The view that shows the whole floor in a stage `width` by `height`
 * pixels, `pad` pixels clear of the sides and `padY` of the top and bottom
 * (room for the pill and the dock), centred. A floor with no rooms shows
 * 10 meters across round 0, 0. */
export function homeMapFitView(floor: HomeMapFloor | undefined, width: number, height: number, pad = 56, padY = 96): HomeMapView {
  const empty = floor === undefined || (floor.rooms.length === 0 && floor.pins.length === 0);
  const b = empty ? { minX: -5, minY: -5, maxX: 5, maxY: 5 } : homeMapBounds(floor);
  const w = Math.max(b.maxX - b.minX, 1);
  const h = Math.max(b.maxY - b.minY, 1);
  const scale = clamp(Math.min(Math.max(width - pad * 2, 40) / w, Math.max(height - padY * 2, 40) / h), HOME_MAP_MIN_SCALE, HOME_MAP_MAX_SCALE);
  return { scale, ox: width / 2 - ((b.minX + b.maxX) / 2) * scale, oy: height / 2 - ((b.minY + b.maxY) / 2) * scale };
}

/** The view zoomed by `factor` about the stage point `at`, which stays
 * over the same plan point. */
export function homeMapZoomAt(view: HomeMapView, factor: number, at: readonly number[]): HomeMapView {
  const scale = clamp(view.scale * factor, HOME_MAP_MIN_SCALE, HOME_MAP_MAX_SCALE);
  const k = scale / view.scale;
  return { scale, ox: at[0]! - (at[0]! - view.ox) * k, oy: at[1]! - (at[1]! - view.oy) * k };
}

/** The zoom as the dock shows it: the fitted view is 100%. */
export function homeMapZoomPercent(view: HomeMapView, fit: HomeMapView): number {
  return Math.round((view.scale / fit.scale) * 100);
}

/** The zoom steps the dock's minus and plus buttons go through. */
export const HOME_MAP_ZOOM_STEP = 1.25;

// ── keys ─────────────────────────────────────────────────────────────────

/** An element that takes typing: a text field, a box of text, a menu, or
 * anything editable. Keys pressed there are its own, never the editor's. */
export function homeMapIsTypingTarget(el: unknown): boolean {
  if (typeof el !== "object" || el === null) return false;
  const node = el as { tagName?: unknown; type?: unknown; isContentEditable?: unknown };
  if (node.isContentEditable === true) return true;
  const tag = typeof node.tagName === "string" ? node.tagName.toUpperCase() : "";
  if (tag === "TEXTAREA" || tag === "SELECT") return true;
  if (tag !== "INPUT") return false;
  const type = typeof node.type === "string" ? node.type.toLowerCase() : "text";
  return !["button", "checkbox", "radio", "range", "color", "submit", "reset", "file", "image"].includes(type);
}

/** What a key press asks of the editor as a whole. A plain letter is left
 * for the mode (Shape's tools), as `{ letter }`. */
export type HomeMapShortcut =
  | "undo"
  | "redo"
  | "cancel"
  | "delete"
  | "enter"
  | "zoomIn"
  | "zoomOut"
  | "fit"
  | { letter: string }
  | { nudge: HomePoint };

/** The fields of a key press the editor reads. */
export interface HomeMapKey {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

/**
 * What a key press means, or undefined when it means nothing here or the
 * press is typing (`typing`, from `homeMapIsTypingTarget`): Cmd or Ctrl and
 * Z undoes, with Shift (or Ctrl Y) redoes; Escape cancels; Delete and
 * Backspace delete; Enter finishes; plus, minus and 0 zoom and fit; the
 * arrow keys nudge by a centimetre, ten with Shift; a lone letter is the
 * mode's.
 */
export function homeMapShortcut(e: HomeMapKey, typing: boolean): HomeMapShortcut | undefined {
  if (typing) return undefined;
  const command = e.metaKey === true || e.ctrlKey === true;
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (command) {
    if (key === "z") return e.shiftKey === true ? "redo" : "undo";
    if (key === "y") return "redo";
    return undefined;
  }
  if (e.altKey === true) return undefined;
  switch (key) {
    case "Escape": return "cancel";
    case "Delete":
    case "Backspace": return "delete";
    case "Enter": return "enter";
    case "+":
    case "=": return "zoomIn";
    case "-": return "zoomOut";
    case "0": return "fit";
  }
  const step = e.shiftKey === true ? 0.1 : 0.01;
  if (key === "ArrowLeft") return { nudge: [-step, 0] };
  if (key === "ArrowRight") return { nudge: [step, 0] };
  if (key === "ArrowUp") return { nudge: [0, -step] };
  if (key === "ArrowDown") return { nudge: [0, step] };
  if (/^[a-z]$/.test(key) && e.shiftKey !== true) return { letter: key };
  return undefined;
}

/** Whether this is a Mac, whose shortcuts use Cmd. */
export function homeMapOnMac(): boolean {
  const nav = (globalThis as { navigator?: { platform?: unknown; userAgent?: unknown } }).navigator;
  const text = `${typeof nav?.platform === "string" ? nav.platform : ""} ${typeof nav?.userAgent === "string" ? nav.userAgent : ""}`;
  return /Mac|iPhone|iPad/.test(text);
}

/** Undo's keys as this computer writes them. */
export function homeMapUndoKey(): string {
  return homeMapOnMac() ? "⌘Z" : "Ctrl+Z";
}

// ── words ────────────────────────────────────────────────────────────────

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/** A length as the editor writes it: "4.10 m". */
export function homeMapMeters(meters: number, digits = 2): string {
  return `${(Math.round(meters * 10 ** digits) / 10 ** digits).toFixed(digits)} m`;
}

/** A number as a field shows it: `digits` decimals, and never "-0". */
export function homeMapNumberText(value: number, digits = 2): string {
  const fixed = (Math.round(value * 10 ** digits) / 10 ** digits).toFixed(digits);
  return /^-0(\.0*)?$/.test(fixed) ? fixed.slice(1) : fixed;
}

/** A number typed in a field: a decimal point or comma, an optional unit
 * after it ("2,5 m"). Undefined for anything else. */
export function homeMapParseNumber(text: string): number | undefined {
  const cleaned = text.trim().replace(",", ".").replace(/\s*(m|cm|°|deg)$/i, "");
  if (cleaned === "" || !/^[-+]?(\d+\.?\d*|\.\d+)$/.test(cleaned)) return undefined;
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return undefined;
  return /cm$/i.test(text.trim()) ? value / 100 : value;
}

/** A room's size along its own walls (its longest wall's way, then square
 * to it) and its floor area in square meters. */
export function homeMapRoomSize(room: HomeMapRoom): { width: number; depth: number; area: number } {
  if (room.outline.length < 3) return { width: 0, depth: 0, area: 0 };
  const { a0, a1, c0, c1 } = homeRoomReach(room, homeRoomDirection(room));
  return { width: a1 - a0, depth: c1 - c0, area: Math.abs(homePolygonArea(room.outline)) };
}

/** A room's size as a label writes it: "4.1 × 2.7 m". */
export function homeMapRoomSizeText(room: HomeMapRoom): string {
  const { width, depth } = homeMapRoomSize(room);
  return `${width.toFixed(1)} × ${depth.toFixed(1)} m`;
}

/** The four corners of a room's box along its own walls, going round: the
 * box the editor draws round a picked room. */
export function homeMapRoomBox(room: HomeMapRoom): HomePoint[] {
  if (room.outline.length < 3) return room.outline.slice();
  const { a0, a1, c0, c1, point } = homeRoomReach(room, homeRoomDirection(room));
  return [point(a0, c0), point(a1, c0), point(a1, c1), point(a0, c1)];
}

/** Which side of its room a wall is, as seen on screen: by the way it faces
 * out of the room, or `inner` for a wall with room on both sides. */
export function homeMapWallSide(room: HomeMapRoom, wallIndex: number): "top" | "right" | "bottom" | "left" | "inner" {
  const wall = homeMapRoomWalls(room)[wallIndex];
  if (wall === undefined) return "inner";
  const length = Math.max(Math.hypot(wall.b[0] - wall.a[0], wall.b[1] - wall.a[1]), 1e-9);
  let nx = -(wall.b[1] - wall.a[1]) / length;
  let ny = (wall.b[0] - wall.a[0]) / length;
  const mid: HomePoint = [(wall.a[0] + wall.b[0]) / 2, (wall.a[1] + wall.b[1]) / 2];
  const probe = Math.max(wall.t, 0.1) + 0.1;
  const ahead = homePolygonHolds(room.outline, [mid[0] + nx * probe, mid[1] + ny * probe]);
  const behind = homePolygonHolds(room.outline, [mid[0] - nx * probe, mid[1] - ny * probe]);
  if (ahead && behind) return "inner";
  if (ahead) {
    nx = -nx;
    ny = -ny;
  } else if (!behind) {
    // Neither side reads as the room: face away from its middle.
    const inside = homeLabelPoint(room);
    if (inside !== undefined && (inside[0] - mid[0]) * nx + (inside[1] - mid[1]) * ny > 0) {
      nx = -nx;
      ny = -ny;
    }
  }
  if (Math.abs(nx) > Math.abs(ny)) return nx > 0 ? "right" : "left";
  return ny > 0 ? "bottom" : "top";
}

/** A wall's name in the editor's words: "Kitchen, top wall", "inner wall". */
export function homeMapWallName(room: HomeMapRoom, wallIndex: number, roomName: string): string {
  const side = homeMapWallSide(room, wallIndex);
  return `${roomName}, ${side} wall`;
}

/** An opening's kind as the editor names it, its style included. */
export function homeMapOpeningName(opening: Pick<HomeMapOpening, "kind" | "style">): string {
  if (opening.kind === "opening") return "Way through";
  if (opening.kind === "window") return opening.style === "sliding" ? "Sliding window" : "Window";
  return opening.style === "double" ? "Double door" : opening.style === "sliding" ? "Sliding door" : "Door";
}

/** The things RoomPlan finds, by their plain names. */
const OBJECT_NAMES: Readonly<Record<string, string>> = {
  sofa: "Sofa",
  table: "Table",
  chair: "Chair",
  bed: "Bed",
  storage: "Storage",
  television: "TV",
  bathtub: "Bath",
  sink: "Basin",
  toilet: "Toilet",
  stove: "Hob",
  oven: "Oven",
  refrigerator: "Fridge",
  dishwasher: "Dishwasher",
  washerDryer: "Washer dryer",
  fireplace: "Fireplace",
  stairs: "Stairs",
};

/** A thing's kind in plain words: its own name, or the camel case split
 * into words for a kind the editor does not know ("coffeeMachine" is
 * "Coffee machine"). */
export function homeMapObjectName(kind: string): string {
  const known = OBJECT_NAMES[kind];
  if (known !== undefined) return known;
  const words = kind.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** "1 room", "3 rooms". */
export function homeMapCount(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}
