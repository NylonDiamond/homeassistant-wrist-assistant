// A tile's Arrangement (the tile key `arrange`), the one setting that moves
// a tile's own parts: the icon (its glow and a person's photo go with it),
// the name and the state. Absent is Default, every part in its native place.
//
//   "arrange": {"v": 1, "parts": {
//     "icon":  {"spot": "tr", "dx": 0, "dy": 0, "scale": 1.2, "hidden": false},
//     "name":  {"spot": "bl"},
//     "state": {"hidden": true}}}
//
// Everything here is pure: reading and writing the key, and where a part
// lands given its native rect. The iPhone and watch apps place the parts
// with the same math, checked against the shared fixtures in
// `frontend/test/fixtures-arrange/` (their README states the math in words).
// Plan: app repo docs/page_editor_calm_plan_2026-10.md, "The Arrangement key".

import type { OneLookLayout, OneLookRect, OneLookSize } from "./layout.js";

/** The parts a tile can arrange, in the order the card lists them. */
export const ARRANGE_PARTS = ["icon", "name", "state"] as const;
export type ArrangePart = (typeof ARRANGE_PARTS)[number];

/** The nine spots: row (top, middle, bottom) then column (left, centre,
 * right) of the tile's content box. */
export const ARRANGE_SPOTS = ["tl", "tc", "tr", "ml", "mc", "mr", "bl", "bc", "br"] as const;
export type ArrangeSpot = (typeof ARRANGE_SPOTS)[number];

/** How far a part may move from its spot or native place, as a share of
 * the tile's width (dx) and height (dy). */
export const ARRANGE_OFFSET_RANGE: readonly [number, number] = [-0.5, 0.5];
/** A part's size factor. For text it scales the font, for the icon its box. */
export const ARRANGE_SCALE_RANGE: readonly [number, number] = [0.8, 1.5];

/** One part's arrangement; every key optional, absent is native. */
export interface ArrangePartEntry {
  spot?: ArrangeSpot;
  dx?: number;
  dy?: number;
  scale?: number;
  hidden?: boolean;
}

/** The key as read: only parts with a change, at least one. */
export interface TileArrange {
  v: 1;
  parts: Partial<Record<ArrangePart, ArrangePartEntry>>;
}

const SPOTS: ReadonlySet<string> = new Set(ARRANGE_SPOTS);

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function finite(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

function clamp(v: number, range: readonly [number, number]): number {
  return Math.min(range[1], Math.max(range[0], v));
}

/** Float dust off a stored number (0.30000000000000004 is 0.3). */
function tidy(v: number): number {
  return Math.round(v * 10000) / 10000;
}

/** One part's entry read tolerantly and written sparsely: an unknown spot
 * is dropped, numbers are clamped to their range, defaults (no move, scale
 * 1, shown) are left out. Undefined when nothing is left. */
export function normalizeArrangePart(raw: unknown): ArrangePartEntry | undefined {
  if (!isObject(raw)) return undefined;
  const out: ArrangePartEntry = {};
  if (typeof raw.spot === "string" && SPOTS.has(raw.spot)) out.spot = raw.spot as ArrangeSpot;
  const dx = finite(raw.dx);
  if (dx !== undefined && tidy(clamp(dx, ARRANGE_OFFSET_RANGE)) !== 0) out.dx = tidy(clamp(dx, ARRANGE_OFFSET_RANGE));
  const dy = finite(raw.dy);
  if (dy !== undefined && tidy(clamp(dy, ARRANGE_OFFSET_RANGE)) !== 0) out.dy = tidy(clamp(dy, ARRANGE_OFFSET_RANGE));
  const scale = finite(raw.scale);
  if (scale !== undefined && tidy(clamp(scale, ARRANGE_SCALE_RANGE)) !== 1) out.scale = tidy(clamp(scale, ARRANGE_SCALE_RANGE));
  if (raw.hidden === true) out.hidden = true;
  return Object.keys(out).length === 0 ? undefined : out;
}

/**
 * The `arrange` key read tolerantly: unknown parts and keys dropped, each
 * part normalized (`normalizeArrangePart`), a part with no change dropped.
 * Undefined (Default) for anything that is not an object, a version other
 * than 1 (a newer panel's key this one cannot read), or no part left.
 */
export function normalizeTileArrange(raw: unknown): TileArrange | undefined {
  if (!isObject(raw)) return undefined;
  if (raw.v !== undefined && raw.v !== 1) return undefined;
  if (!isObject(raw.parts)) return undefined;
  const parts: Partial<Record<ArrangePart, ArrangePartEntry>> = {};
  for (const part of ARRANGE_PARTS) {
    const entry = normalizeArrangePart(raw.parts[part]);
    if (entry !== undefined) parts[part] = entry;
  }
  return Object.keys(parts).length === 0 ? undefined : { v: 1, parts };
}

/** The key as the panel writes it, or undefined to remove it (Default):
 * the parts in their fixed order, each with its keys in a fixed order. */
export function encodeTileArrange(arrange: TileArrange | undefined): Record<string, unknown> | undefined {
  const read = normalizeTileArrange(arrange);
  if (read === undefined) return undefined;
  const parts: Record<string, unknown> = {};
  for (const part of ARRANGE_PARTS) {
    const e = read.parts[part];
    if (e === undefined) continue;
    const out: Record<string, unknown> = {};
    if (e.spot !== undefined) out.spot = e.spot;
    if (e.dx !== undefined) out.dx = e.dx;
    if (e.dy !== undefined) out.dy = e.dy;
    if (e.scale !== undefined) out.scale = e.scale;
    if (e.hidden === true) out.hidden = true;
    parts[part] = out;
  }
  return { v: 1, parts };
}

/** `arrange` with one part's entry changed by `change` (which gets the
 * part's entry, `{}` when native), normalized: undefined once no part has a
 * change. */
export function withArrangePart(
  arrange: TileArrange | undefined,
  part: ArrangePart,
  change: (entry: ArrangePartEntry) => ArrangePartEntry,
): TileArrange | undefined {
  const parts = { ...(arrange?.parts ?? {}) };
  const next = normalizeArrangePart(change({ ...(parts[part] ?? {}) }));
  if (next === undefined) delete parts[part];
  else parts[part] = next;
  return normalizeTileArrange({ v: 1, parts });
}

// ── placement ────────────────────────────────────────────────────────────

/** A name's text alignment in its box. */
export type ArrangeAlign = "leading" | "center" | "trailing";

/** Where a part is drawn once arranged. */
export interface ArrangedPart {
  rect: OneLookRect;
  /** The factor its font (text) or glyph box (icon) is drawn at. */
  scale: number;
  hidden: boolean;
}

export interface ArrangedName extends ArrangedPart {
  align: ArrangeAlign;
}

/**
 * Where a part lands (the plan's math, which the apps share):
 *
 * 1. Its scaled size: the native rect's width and height times `scale`. The
 *    name keeps its native width; only its height (its font) scales.
 * 2. With a spot, the scaled rect is anchored to the content box `content`:
 *    column l / c / r puts its left edge at the box's left, its centre on
 *    the box's centre, or its right edge at the box's right; row t / m / b
 *    puts its top at the box's top, its middle on the box's middle, or its
 *    bottom at the box's bottom. Without a spot it stays centred on the
 *    native rect's centre.
 * 3. Then it moves by (dx times the tile's width, dy times its height).
 * 4. Hidden parts are not drawn; nothing else moves.
 */
export function arrangePartRect(
  tile: OneLookSize,
  content: OneLookRect,
  native: OneLookRect,
  part: ArrangePart,
  entry: ArrangePartEntry | undefined,
): ArrangedPart {
  const scale = entry?.scale ?? 1;
  const width = part === "name" ? native.width : native.width * scale;
  const height = native.height * scale;
  let x: number;
  let y: number;
  const spot = entry?.spot;
  if (spot !== undefined) {
    const row = spot[0];
    const col = spot[1];
    x = col === "l" ? content.x : col === "c" ? content.x + content.width / 2 - width / 2 : content.x + content.width - width;
    y = row === "t" ? content.y : row === "m" ? content.y + content.height / 2 - height / 2 : content.y + content.height - height;
  } else {
    x = native.x + native.width / 2 - width / 2;
    y = native.y + native.height / 2 - height / 2;
  }
  x += (entry?.dx ?? 0) * tile.width;
  y += (entry?.dy ?? 0) * tile.height;
  return { rect: { x, y, width, height }, scale, hidden: entry?.hidden === true };
}

/** The name's alignment: with a spot, its column (left leading, centre
 * centred, right trailing); without one, the native alignment. */
export function arrangeNameAlign(entry: ArrangePartEntry | undefined, native: ArrangeAlign): ArrangeAlign {
  const col = entry?.spot?.[1];
  return col === "l" ? "leading" : col === "c" ? "center" : col === "r" ? "trailing" : native;
}

// ── One Look's centred layout ────────────────────────────────────────────

/** The centred layout's content box: the tile less its native inset at the
 * sides (`insetH`) and at the top and bottom (`insetV`). */
export function oneLookArrangeContent(layout: Pick<OneLookLayout, "size" | "insetH" | "insetV">): OneLookRect {
  const { width, height } = layout.size;
  return {
    x: layout.insetH,
    y: layout.insetV,
    width: Math.max(0, width - 2 * layout.insetH),
    height: Math.max(0, height - 2 * layout.insetV),
  };
}

/** Each part's native rect in the centred layout, for the parts it draws:
 * the glyph's box (the photo's too), the name's text block, the state's
 * box. */
export function oneLookArrangeNative(layout: OneLookLayout): Partial<Record<ArrangePart, OneLookRect>> {
  const out: Partial<Record<ArrangePart, OneLookRect>> = {};
  if (layout.discRect.width > 0) out.icon = layout.discRect;
  if (layout.name.lines.length > 0) out.name = { x: layout.textOrigin.x, y: layout.textOrigin.y, width: layout.textWidth, height: layout.textHeight };
  if (layout.stateRect !== undefined) out.state = layout.stateRect;
  return out;
}

/** The parts of a tile as arranged, for the parts it draws. */
export interface OneLookArranged {
  icon?: ArrangedPart;
  name?: ArrangedName;
  state?: ArrangedPart;
}

/**
 * A tile's parts placed by its arrangement, or undefined when nothing
 * moves: no arrangement, or a layout other than the centred one (a picture
 * filling the tile, a chart, a stacked or strip tile), whose key is ignored.
 * Only the parts the key lists are placed; the rest stay native. The
 * centred layout's name is centred natively.
 */
export function oneLookArrangeLayout(layout: OneLookLayout, arrange: TileArrange | undefined): OneLookArranged | undefined {
  if (arrange === undefined || layout.mode !== "centred") return undefined;
  const content = oneLookArrangeContent(layout);
  const native = oneLookArrangeNative(layout);
  const out: OneLookArranged = {};
  for (const part of ARRANGE_PARTS) {
    const entry = arrange.parts[part];
    const rect = native[part];
    if (entry === undefined || rect === undefined) continue;
    const placed = arrangePartRect(layout.size, content, rect, part, entry);
    if (part === "name") out.name = { ...placed, align: arrangeNameAlign(entry, "center") };
    else out[part] = placed;
  }
  return Object.keys(out).length === 0 ? undefined : out;
}
