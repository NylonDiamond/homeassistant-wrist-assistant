// Owned base layers placed on the native parts (round two of tile layers).
//
// A base layer is built from the watch's One Look layout at the tile's design
// box, but each device lays a tile out its own way: the iPhone's layout is not
// the watch's scaled up, and watches of other sizes differ a little too. So an
// owned base layer is not drawn by fitting the design box into the tile, as an
// added layer is. When a role becomes owned the panel keeps its anchor (the
// native part's rect and size the layer was built from, `TileAnchor`), and
// every device draws the role's elements through a map from that anchor to its
// own native part (`placeDesignDoc`): an unmoved owned part lands exactly on
// the native one, and a moved one is off it by the same share of the part on
// every device.
//
// App repo docs/tile_layers_contract_2026-10.md, sections 13.1 and 13.2. The
// app's `TileNativeFrames` and `TileAnchorMap` mirror this file.

import {
  type CustomComplicationConfig,
  type Element,
  type LayerShadow,
  type NormalizedFrame,
  type Rule,
  type StyleChange,
  type TextPart,
} from "../model.js";
import { fitBox } from "../renderer.js";
import type { OneLookDevice } from "./one-look/metrics.js";
import { type OneLookLayout, type OneLookRect, ONE_LOOK_GLYPH_INK_SHARE, oneLookLayoutMetrics } from "./one-look/layout.js";
import { type TileAnchor, type TileAnchorKey, type TileAnchors, TILE_DESIGN_FAMILY, anchorKeyOf } from "./tile-design-core.js";

/** A native part of a laid out tile: its rect in the drawn tile, in points,
 * and its size (what `TileAnchor.size` records for that role). */
export interface TilePartFrame {
  rect: OneLookRect;
  size: number;
  /** The state only: the fitted size of the line shown, the unit's and the
   * tail's. */
  textSize?: number;
  unitSize?: number;
  tailSize?: number;
}

/** Each role's native part in one laid out tile; a part the layout does not
 * have (or that has no area) is absent. */
export interface TileNativeFrames {
  icon?: TilePartFrame;
  photo?: TilePartFrame;
  name?: TilePartFrame;
  state?: TilePartFrame;
  /** The glyph box the glow is drawn on (section 14.6): a square of side
   * `glyphSize` on the glyph's centre, whether or not a disc is drawn. */
  glow?: TilePartFrame;
}

const hasArea = (r: OneLookRect): boolean => r.width > 0 && r.height > 0;

/**
 * Each role's native part in a laid out One Look tile, the same rects the
 * base layers are built from (section 2.3: the glyph's frame, the name's
 * room, the state line before widening): used at build time on the
 * reference watch layout to make anchors, and at draw time on the device's
 * own layout to place them, so the two always mean the same part. Hidden
 * parts are still laid out, so their rects are here.
 */
export function tileNativeFrames(layout: OneLookLayout, device: OneLookDevice): TileNativeFrames {
  const out: TileNativeFrames = {};
  const disc = layout.discRect;
  if (disc.width > 0 && disc.height > 0) {
    const rect = layout.glyphInk ?? disc;
    if (hasArea(rect)) {
      out.icon = { rect, size: (layout.glyphSize * ONE_LOOK_GLYPH_INK_SHARE) / Math.max(0.5, layout.glyphExtent) };
      out.photo = { rect, size: layout.glyphSize };
    }
    const g = layout.glyphSize;
    if (g > 0) {
      const cx = disc.x + disc.width / 2;
      const cy = disc.y + disc.height / 2;
      out.glow = { rect: { x: cx - g / 2, y: cy - g / 2, width: g, height: g }, size: g };
    }
  }
  const lines = layout.name.lines.length;
  if (lines > 0) {
    const rect = { x: layout.textOrigin.x, y: layout.textOrigin.y, width: layout.textWidth, height: lines * layout.nameLineHeight };
    if (hasArea(rect)) out.name = { rect, size: layout.name.size };
  }
  const state = layout.state;
  if (state !== undefined) {
    const rect = layout.mode === "centred" && layout.stateRect !== undefined
      ? layout.stateRect
      : { x: layout.textOrigin.x, y: layout.textOrigin.y + lines * layout.nameLineHeight, width: layout.textWidth, height: layout.stateLineHeight };
    if (hasArea(rect)) {
      out.state = {
        rect,
        size: oneLookLayoutMetrics(layout, device).figureSize,
        textSize: state.size,
        unitSize: state.unitSize,
        tailSize: state.tailSize,
      };
    }
  }
  return out;
}

const round = (v: number, places: number): number => {
  const k = 10 ** places;
  return Math.round(v * k) / k;
};

/** A native part as an anchor: its rect as fractions of the design box to 4
 * places and its sizes to 2, rounded exactly as the base layers' frames and
 * sizes are, so an unmoved base layer equals its anchor. */
export function anchorOf(part: TilePartFrame, box: { width: number; height: number }): TileAnchor {
  const out: TileAnchor = {
    x: round(part.rect.x / box.width, 4),
    y: round(part.rect.y / box.height, 4),
    width: round(part.rect.width / box.width, 4),
    height: round(part.rect.height / box.height, 4),
    size: round(part.size, 2),
  };
  if (part.textSize !== undefined && part.unitSize !== undefined && part.tailSize !== undefined) {
    out.textSize = round(part.textSize, 2);
    out.unitSize = round(part.unitSize, 2);
    out.tailSize = round(part.tailSize, 2);
  }
  return out;
}

const positive = (v: number | undefined): v is number => v !== undefined && Number.isFinite(v) && v > 0;

/** The factors one role's elements are mapped by: `pos` for place, frame and
 * every size but the state's text; `text`, `unit` and `tail` for the State
 * layer's own size and its parts'. */
interface Factors {
  pos: number;
  text: number;
  unit: number;
  tail: number;
}

/** The factors for a role with this anchor on this native part, or
 * undefined when the role falls back to the box fit (a size not above 0). */
function factorsFor(role: TileAnchorKey, a: TileAnchor, n: TilePartFrame): Factors | undefined {
  if (!positive(a.size) || !positive(n.size)) return undefined;
  const pos = n.size / a.size;
  if (role !== "state") return { pos, text: pos, unit: pos, tail: pos };
  if (!positive(a.textSize) || !positive(a.unitSize) || !positive(a.tailSize)) return undefined;
  if (!positive(n.textSize) || !positive(n.unitSize) || !positive(n.tailSize)) return undefined;
  return { pos, text: n.textSize / a.textSize, unit: n.unitSize / a.unitSize, tail: n.tailSize / a.tailSize };
}

/** The factor a text part's own size takes: the unit's and the tail's for
 * the parts reading those pieces of the state, the State layer's otherwise. */
function partFactor(part: TextPart | undefined, k: Factors): number {
  const kind = part?.value.kind;
  if (kind?.kind === "tileState" && kind.part === "unit") return k.unit;
  if (kind?.kind === "tileState" && kind.part === "tail") return k.tail;
  return k.text;
}

function scaledShadow(shadow: LayerShadow, by: number): LayerShadow {
  return { ...shadow, radius: shadow.radius * by, dx: shadow.dx * by, dy: shadow.dy * by };
}

/** A rule with its `setFontSize` numbers scaled by the factor of what it
 * sets (the layer's, or the aimed part's) and its `setBorderWidth` numbers
 * by `pos`, all over `f`. */
function scaledRule(rule: Rule, layerFactor: number, parts: readonly TextPart[] | undefined, k: Factors, f: number): Rule {
  const target = rule.partId === undefined ? undefined : parts?.find((p) => p.id.toUpperCase() === rule.partId!.toUpperCase());
  const fontFactor = rule.partId !== undefined && target !== undefined ? partFactor(target, k) : layerFactor;
  const change = (c: StyleChange): StyleChange => {
    if (c.number === undefined) return c;
    if (c.kind === "setFontSize") return { ...c, number: (c.number * fontFactor) / f };
    if (c.kind === "setBorderWidth") return { ...c, number: (c.number * k.pos) / f };
    return c;
  };
  const out: Rule = { ...rule, cases: rule.cases.map((rc) => ({ ...rc, then: rc.then.map(change) })) };
  if (rule.otherwise !== undefined) out.otherwise = rule.otherwise.map(change);
  return out;
}

type Frame = { x: number; y: number; width: number; height: number };

/** A design frame mapped from the anchor `a` to the native part `n`, a move
 * scaled by `pos`, written back as fractions of the box for the box fit. */
function placedFrame<T extends Frame>(F: T, a: TileAnchor, n: TilePartFrame, pos: number, fit: { scale: number; x: number; y: number }, box: { width: number; height: number }): T {
  const f = fit.scale;
  const bw = box.width;
  const bh = box.height;
  const x = n.rect.x + (F.x * bw - a.x * bw) * pos;
  const y = n.rect.y + (F.y * bh - a.y * bh) * pos;
  const w = Math.max(0, n.rect.width + (F.width * bw - a.width * bw) * pos);
  const h = Math.max(0, n.rect.height + (F.height * bh - a.height * bh) * pos);
  return { ...F, x: (x - fit.x) / (f * bw), y: (y - fit.y) / (f * bh), width: w / (f * bw), height: h / (f * bh) };
}

/** How one layer is placed on a drawn tile, for the page editor's outline,
 * corner handles and drag of it. */
export interface TileLayerPlacementMap {
  /** A design frame to the frame the renderer's box fit draws: mapped from
   * the role's anchor to its native part, as `placeDesignDoc` places it, or
   * the frame itself where the layer keeps the box fit. */
  frame<T extends Frame>(frame: T): T;
  /** How far the drawn frame moves, in fractions of the box, per fraction a
   * design frame moves (1 for the box fit): a drag on the drawn tile divided
   * by it is the design frame's change. */
  scale: number;
}

const BOX_FIT: TileLayerPlacementMap = Object.freeze({ frame: <T extends Frame>(frame: T): T => frame, scale: 1 });

/**
 * The map `placeDesignDoc` places the layer `elementId` by on a drawn tile
 * `slot` (points, with `native` its layout's parts and `box` the design
 * box), as a function of its frame, so the editor's outline and handles sit
 * on the layer as drawn and a drag follows the pointer on every watch size
 * and the iPhone. The box fit, unchanged, under the same conditions as
 * there: an added layer or tap zone, no usable anchor, no native part.
 */
export function layerPlacementMap(
  elementId: string,
  anchors: TileAnchors,
  native: TileNativeFrames,
  slot: { width: number; height: number },
  box: { width: number; height: number },
): TileLayerPlacementMap {
  const role = anchorKeyOf(elementId);
  if (role === undefined) return BOX_FIT;
  const a = anchors[role];
  const n = native[role];
  if (a === undefined || n === undefined) return BOX_FIT;
  const k = factorsFor(role, a, n);
  const fit = fitBox(slot, TILE_DESIGN_FAMILY, box);
  if (k === undefined || !(fit.scale > 0) || !(box.width > 0) || !(box.height > 0)) return BOX_FIT;
  return { frame: (frame) => placedFrame(frame, a, n, k.pos, fit, box), scale: k.pos / fit.scale };
}

/** One element of a mapped role, placed: its frame mapped from the anchor to
 * the native part, its sizes scaled so they draw at the native ones. */
function placed(el: Element, role: TileAnchorKey, a: TileAnchor, n: TilePartFrame, k: Factors, fit: { scale: number; x: number; y: number }, box: { width: number; height: number }): Element {
  const f = fit.scale;
  const out = structuredClone(el);
  out.payload.frame = placedFrame(el.payload.frame, a, n, k.pos, fit, box);
  const pos = k.pos / f;
  if (out.payload.shadow !== undefined) out.payload.shadow = scaledShadow(out.payload.shadow, pos);
  // The State text layer's own size follows the native fit of the line; every
  // other element of every role follows the part.
  const layerFactor = out.kind === "text" && role === "state" ? k.text : k.pos;
  switch (out.kind) {
    case "text": {
      const p = out.payload;
      p.fontSize = (p.fontSize * layerFactor) / f;
      if (p.parts !== undefined) {
        p.parts = p.parts.map((part) => (part.fontSize === undefined ? part : { ...part, fontSize: (part.fontSize * (role === "state" ? partFactor(part, k) : k.pos)) / f }));
      }
      break;
    }
    case "icon":
      out.payload.size = out.payload.size * pos;
      break;
    case "image":
      out.payload.cornerRadius = out.payload.cornerRadius * pos;
      break;
    case "shape": {
      const p = out.payload;
      p.cornerRadius = p.cornerRadius * pos;
      p.borderWidth = p.borderWidth * pos;
      p.thickness = p.thickness * pos;
      break;
    }
    default:
      break;
  }
  const parts = out.kind === "text" ? out.payload.parts : undefined;
  out.payload.rules = out.payload.rules.map((r) => scaledRule(r, layerFactor, role === "state" ? parts : undefined, k, f));
  return out;
}

/**
 * A copy of a design's drawn document with each element of an owned role
 * placed by its anchor on this device's native part (section 13.2): its
 * frame mapped so the anchor's top left lands on the part's, a move scaled
 * by the part's size, and its sizes scaled to draw at the native ones; the
 * frame is written back as fractions of the box, so the renderer's own box
 * fit (`slot` the drawn tile, `box` the design box) puts it there. An
 * element keeps the box fit (unchanged) when it is an added layer or a tap
 * zone, its role has no usable anchor, this layout has no native part for
 * it, or a size is not above 0. Only resolved and drawn, never compiled: the
 * template comes from the unplaced document.
 */
export function placeDesignDoc(
  doc: CustomComplicationConfig,
  anchors: TileAnchors,
  native: TileNativeFrames,
  slot: { width: number; height: number },
  box: { width: number; height: number },
): CustomComplicationConfig {
  const fit = fitBox(slot, TILE_DESIGN_FAMILY, box);
  if (!(fit.scale > 0) || !(box.width > 0) || !(box.height > 0)) return doc;
  let changed = false;
  const elements = doc.elements.map((el) => {
    if (el.kind === "tap") return el;
    const role = anchorKeyOf(el.payload.id);
    if (role === undefined) return el;
    const a = anchors[role];
    const n = native[role];
    if (a === undefined || n === undefined) return el;
    const k = factorsFor(role, a, n);
    if (k === undefined) return el;
    changed = true;
    return placed(el, role, a, n, k, fit, box);
  });
  return changed ? { ...doc, elements } : doc;
}
