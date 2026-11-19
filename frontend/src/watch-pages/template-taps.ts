// A template tile's tap areas (`templateTaps`): boxes drawn by hand on the
// tile's picture, each with one action. The app's `TemplateTileTaps` reads
// the key by the same rule, and both pass `tile-app.json` `template.taps`
// `samples`. The contract is "Tap areas (2026-11-18)" in the app repo's
// `docs/template_tile_links_2026-11.md`, with the six Home Assistant
// actions of "Tap area actions, round 2 (2026-11-18)" and the `confirm` key
// of "Round 3: ask first, and refresh on a timer (2026-11-18)".
//
// No DOM here: the reader, and the small edits the editor makes to a list.

import tileApp from "./tile-app.json";

const T = tileApp.template.taps;

/** The ten actions, in the table's order. */
export type TemplateTapAction = "maps" | "link" | "refresh" | "page" | "toggle" | "script" | "scene" | "service" | "http" | "control";

/** The text field an action can need. */
export type TemplateTapField = "place" | "url" | "page" | "entity" | "service" | "http";

/** One area as stored: top left and size as fractions of the tile's drawn
 * face, and the action's one text field, if it has one. A `service` area
 * may also hold `entity` and `data`. */
export interface TemplateTapArea {
  x: number;
  y: number;
  w: number;
  h: number;
  action: TemplateTapAction;
  place?: string;
  url?: string;
  page?: string;
  entity?: string;
  service?: string;
  http?: string;
  data?: Record<string, unknown>;
  /** Ask before running: a first tap shows the tile's question, a second
   * runs the action. Only `true` is kept, always last. */
  confirm?: true;
}

/** The key, the limits and the actions, from the shared table. */
export const TEMPLATE_TAPS = {
  key: T.key,
  max: T.max,
  minSize: T.minSize,
  maxText: T.maxText,
  actions: T.actions as readonly TemplateTapAction[],
} as const;

/** The text field an action needs, or undefined for none. */
export function templateTapField(action: TemplateTapAction): TemplateTapField | undefined {
  switch (action) {
    case "maps": return "place";
    case "link": return "url";
    case "page": return "page";
    case "toggle": case "script": case "scene": case "control": return "entity";
    case "service": return "service";
    case "http": return "http";
    default: return undefined;
  }
}

/** A text field read by the rule: trimmed, a string, not empty, at most
 * `maxText` UTF-16 units. Undefined when it does not read. */
function readText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const text = value.trim();
  return text === "" || text.length > TEMPLATE_TAPS.maxText ? undefined : text;
}

/** A plain JSON object: not an array, not null. */
export function isTemplateTapData(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAction(value: unknown): value is TemplateTapAction {
  return typeof value === "string" && (TEMPLATE_TAPS.actions as readonly string[]).includes(value);
}

function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function clamp(value: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, value));
}

function round(value: number): number {
  return Math.round(value * 10000) / 10000;
}

/** One item read by the contract's rule, or undefined when it is dropped. */
function readArea(raw: unknown): TemplateTapArea | undefined {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return undefined;
  const item = raw as Record<string, unknown>;
  const { x, y, w, h, action } = item;
  if (!finite(x) || !finite(y) || !finite(w) || !finite(h)) return undefined;
  if (!isAction(action)) return undefined;
  const field = templateTapField(action);
  let text: string | undefined;
  if (field !== undefined) {
    text = readText(item[field]);
    if (text === undefined) return undefined;
  }
  const min = TEMPLATE_TAPS.minSize;
  const cx = clamp(x, 0, 1 - min);
  const cy = clamp(y, 0, 1 - min);
  const cw = clamp(w, min, 1 - cx);
  const ch = clamp(h, min, 1 - cy);
  const area: TemplateTapArea = { x: round(cx), y: round(cy), w: round(cw), h: round(ch), action };
  if (field !== undefined) area[field] = text;
  if (action === "service") {
    // Only a service keeps an entity and data, and neither drops the area.
    const entity = readText(item["entity"]);
    if (entity !== undefined) area.entity = entity;
    if (isTemplateTapData(item["data"])) area.data = item["data"];
  }
  // Any action may ask first; only exactly true counts, and it goes last.
  if (item["confirm"] === true) area.confirm = true;
  return area;
}

/** The tile's areas by the shared rule: each item read on its own, the
 * dropped ones left out, then the first `max` kept. Not an array is none. */
export function normalizeTemplateTaps(raw: unknown): TemplateTapArea[] {
  if (!Array.isArray(raw)) return [];
  const out: TemplateTapArea[] = [];
  for (const item of raw) {
    const area = readArea(item);
    if (area !== undefined) out.push(area);
    if (out.length === TEMPLATE_TAPS.max) break;
  }
  return out;
}

/** A new area in the middle of the tile, a quarter of its face. */
export function newTemplateTapArea(): TemplateTapArea {
  return { x: 0.25, y: 0.25, w: 0.5, h: 0.5, action: "refresh" };
}

/** The area with another action. The new action's text is `text` when given,
 * else the one the area held for that action. An action that needs text and
 * gets none keeps the area as it was, since the rule would drop it. */
export function withTemplateTapAction(area: TemplateTapArea, action: TemplateTapAction, text?: string): TemplateTapArea {
  const field = templateTapField(action);
  const { x, y, w, h } = area;
  const ask = area.confirm === true ? { confirm: true as const } : {};
  if (field === undefined) return { x, y, w, h, action, ...ask };
  const value = (text ?? area[field] ?? "").trim();
  return value === "" ? area : { x, y, w, h, action, [field]: value, ...ask };
}

/** The area with Ask before running on (`confirm: true`, last) or off (no
 * key). */
export function withTemplateTapConfirm(area: TemplateTapArea, on: boolean): TemplateTapArea {
  const { confirm: _confirm, ...rest } = area;
  return on ? { ...rest, confirm: true } : rest;
}

/** A service area with its entity and data set: an empty or blank entity,
 * or undefined data, removes the key. Any other action is returned as is. */
export function withTemplateTapServiceExtras(area: TemplateTapArea, extras: { entity?: string | undefined; data?: Record<string, unknown> | undefined }): TemplateTapArea {
  if (area.action !== "service") return area;
  const { entity: _entity, data: _data, ...rest } = area;
  const next: TemplateTapArea = { ...rest };
  const entity = ("entity" in extras ? extras.entity : area.entity)?.trim();
  if (entity !== undefined && entity !== "") next.entity = entity;
  const data = "data" in extras ? extras.data : area.data;
  if (data !== undefined) next.data = data;
  return withTemplateTapConfirm(next, area.confirm === true);
}

/** The area moved to `x`, `y`, its size kept, inside the face. */
export function movedTemplateTapArea(area: TemplateTapArea, x: number, y: number): TemplateTapArea {
  return { ...area, x: round(clamp(x, 0, 1 - area.w)), y: round(clamp(y, 0, 1 - area.h)) };
}

/** The area with its bottom right corner taken to `right`, `bottom`. */
export function resizedTemplateTapArea(area: TemplateTapArea, right: number, bottom: number): TemplateTapArea {
  const min = TEMPLATE_TAPS.minSize;
  return { ...area, w: round(clamp(right - area.x, min, 1 - area.x)), h: round(clamp(bottom - area.y, min, 1 - area.y)) };
}

/** The box two corners span, at least the smallest size, inside the face. */
export function spannedTemplateTapArea(from: { x: number; y: number }, to: { x: number; y: number }, action: TemplateTapAction = "refresh"): TemplateTapArea {
  const min = TEMPLATE_TAPS.minSize;
  const x = clamp(Math.min(from.x, to.x), 0, 1 - min);
  const y = clamp(Math.min(from.y, to.y), 0, 1 - min);
  const w = clamp(Math.abs(to.x - from.x), min, 1 - x);
  const h = clamp(Math.abs(to.y - from.y), min, 1 - y);
  return { x: round(x), y: round(y), w: round(w), h: round(h), action };
}

/** The topmost area under a point of the face: the last one that holds it,
 * as on the devices. */
export function templateTapAt(areas: readonly TemplateTapArea[], x: number, y: number): number | undefined {
  for (let i = areas.length - 1; i >= 0; i--) {
    const a = areas[i]!;
    if (x >= a.x && x <= a.x + a.w && y >= a.y && y <= a.y + a.h) return i;
  }
  return undefined;
}
