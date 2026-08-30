// SVG renderer for a resolved layout. Draws at canonical watch point sizes
// (docs/custom_complication_schema_v4.md §4.4 and §9) and lets CSS scale the
// result; every absolute size (font, stroke, radius) is in watch points so a
// 160x62 rectangle scaled 2x looks like the native editor.

import { svg, nothing, type TemplateResult } from "lit";
import type { FamilyKind } from "./model.js";
import type { ResolvedElement, ResolvedLayout } from "./resolver.js";

export interface CanvasSize {
  width: number;
  height: number;
}

// The design box: the real WidgetKit slot on a 46 mm watch, measured 2026-08-30
// (app repo docs/custom_complication_design_box.md). Every watch draws a uniformly
// scaled copy of this box. Mirrors `CustomComplication.DesignBox` in Swift; keep the
// two identical.
export const CANVAS: Record<"rectangular" | "circular" | "corner", CanvasSize> = {
  rectangular: { width: 181, height: 65.5 },
  circular: { width: 51, height: 51 },
  corner: { width: 34, height: 34 },
};

export type DrawableFamily = keyof typeof CANVAS;

/** A watch case the panel can preview as. Slots in points, from the design-box doc. */
export interface WatchCase {
  label: string;
  /** Screen size in points, as WKInterfaceDevice reports it. */
  screen: CanvasSize;
  slots: Record<DrawableFamily, CanvasSize>;
  /** Only the 46 mm row was read off a real watch; the rest are scaled by screen width. */
  measured: boolean;
}

export const CASES: WatchCase[] = [
  { label: "40 mm", screen: { width: 162, height: 197 }, slots: { rectangular: { width: 141, height: 51 }, circular: { width: 40, height: 40 }, corner: { width: 26, height: 26 } }, measured: false },
  { label: "41 mm", screen: { width: 176, height: 215 }, slots: { rectangular: { width: 153, height: 55.5 }, circular: { width: 43, height: 43 }, corner: { width: 29, height: 29 } }, measured: false },
  { label: "42 mm", screen: { width: 187, height: 223 }, slots: { rectangular: { width: 163, height: 59 }, circular: { width: 46, height: 46 }, corner: { width: 31, height: 31 } }, measured: false },
  { label: "44 mm", screen: { width: 184, height: 224 }, slots: { rectangular: { width: 160, height: 58 }, circular: { width: 45, height: 45 }, corner: { width: 30, height: 30 } }, measured: false },
  { label: "45 mm", screen: { width: 198, height: 242 }, slots: { rectangular: { width: 172, height: 62.5 }, circular: { width: 48.5, height: 48.5 }, corner: { width: 32, height: 32 } }, measured: false },
  { label: "46 mm", screen: { width: 208, height: 248 }, slots: CANVAS, measured: true },
  { label: "49 mm", screen: { width: 205, height: 251 }, slots: { rectangular: { width: 178.5, height: 64.5 }, circular: { width: 50, height: 50 }, corner: { width: 33.5, height: 33.5 } }, measured: false },
];

export const REFERENCE_CASE = CASES.find((c) => c.measured)!;

/**
 * The case matching a watch-reported `screen_size` string ("208x248", points,
 * from WKInterfaceDevice.screenBounds). Undefined when the string is missing,
 * malformed, or from a case this table doesn't know (a future watch model) —
 * callers keep their current default.
 */
export function caseForScreenSize(screenSize: string | null | undefined): WatchCase | undefined {
  if (!screenSize) return undefined;
  const match = /^(\d+)x(\d+)$/.exec(screenSize.trim());
  if (!match) return undefined;
  const width = Number(match[1]);
  const height = Number(match[2]);
  return CASES.find((c) => c.screen.width === width && c.screen.height === height);
}

export interface Fit {
  scale: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Uniform fit of the family's design box into a real slot, centred. Mirrors
 * `CustomComplication.DesignBox.fit` in Swift; the two must agree to the point.
 */
export function fitBox(slot: CanvasSize, family: DrawableFamily): Fit {
  const ref = CANVAS[family];
  if (slot.width <= 0 || slot.height <= 0) return { scale: 0, x: 0, y: 0, width: 0, height: 0 };
  const scale = Math.min(slot.width / ref.width, slot.height / ref.height);
  const width = ref.width * scale;
  const height = ref.height * scale;
  return { scale, x: (slot.width - width) / 2, y: (slot.height - height) / 2, width, height };
}

/** Draws an SF Symbol by name. Returns undefined when the symbol is unknown. */
export interface IconProvider {
  render(symbol: string, size: number, colorHex: string): TemplateResult | undefined;
  /** Whether this provider draws anything at all. */
  available(): boolean;
  /**
   * Every name this provider can draw, for the picker to browse, or `undefined`
   * while that is still being loaded. An empty array means the provider settled
   * on knowing no names, which is not the same as an absent icon pack: a pack
   * can draw perfectly well and still decline to enumerate itself.
   */
  names(): string[] | undefined;
}

export interface RenderOptions {
  icons: IconProvider;
  /** Editor affordance: hidden layers at 35% instead of invisible. */
  showHidden?: boolean;
  /** Element id to outline. */
  highlightId?: string;
  /** Draw resize handles on the highlighted element (active family only). */
  handles?: boolean;
  /**
   * The real slot to preview in. Defaults to the design box itself (the 46 mm
   * slot). Any other size draws the design box uniformly scaled and centred,
   * exactly as the watch does.
   */
  slot?: CanvasSize;
}

const FONT_WEIGHT: Record<string, number> = { regular: 400, medium: 500, semibold: 600, bold: 700 };

/** `#RRGGBB` or `#RRGGBBAA` (leading # optional) to an SVG colour + opacity. */
export function parseColor(hex: string | undefined): { color: string; opacity: number } | undefined {
  if (!hex) return undefined;
  const h = hex.startsWith("#") ? hex.slice(1) : hex;
  if (!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(h)) return undefined;
  const opacity = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
  return { color: `#${h.slice(0, 6)}`, opacity };
}

function colorAttrs(hex: string | undefined, attr: "fill" | "stroke", fallback = "#FFFFFF") {
  const c = parseColor(hex) ?? { color: fallback, opacity: 1 };
  return { [attr]: c.color, [`${attr}-opacity`]: c.opacity };
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
}

function frameBox(el: ResolvedElement, canvas: CanvasSize): Box {
  const w = Math.max(0, el.frame.width * canvas.width);
  const h = Math.max(0, el.frame.height * canvas.height);
  const cx = (el.frame.x + el.frame.width / 2) * canvas.width;
  const cy = (el.frame.y + el.frame.height / 2) * canvas.height;
  return { x: cx - w / 2, y: cy - h / 2, w, h, cx, cy };
}

function renderText(el: Extract<ResolvedElement, { kind: "text" }>, box: Box) {
  const c = colorAttrs(el.colorHex, "fill");
  // lineLimit(1) + minimumScaleFactor(0.5): shrink to fit the box width
  // down to half size. textLength is the closest SVG analogue without
  // measuring glyphs.
  const approxWidth = el.text.length * el.fontSize * 0.55;
  const scale = approxWidth > box.w && box.w > 0 ? Math.max(0.5, box.w / approxWidth) : 1;
  const fontSize = el.fontSize * scale;
  return svg`<text x=${box.cx} y=${box.cy} text-anchor="middle" dominant-baseline="central"
    font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size=${fontSize} font-weight=${FONT_WEIGHT[el.fontWeight] ?? 400}
    fill=${c.fill} fill-opacity=${c["fill-opacity"]}>${el.text}</text>`;
}

function renderGauge(el: Extract<ResolvedElement, { kind: "gauge" }>, box: Box) {
  const fill = colorAttrs(el.colorHex, "stroke");
  const track = colorAttrs(el.trackColorHex, "stroke", "#FFFFFF");
  const lw = el.lineWidth;
  if (el.style === "bar") {
    const w = box.w;
    const fillW = Math.max(lw, w * el.fraction);
    return svg`
      <rect x=${box.x} y=${box.cy - lw / 2} width=${w} height=${lw} rx=${lw / 2}
        fill=${track.stroke} fill-opacity=${track["stroke-opacity"]} />
      <rect x=${box.x} y=${box.cy - lw / 2} width=${fillW} height=${lw} rx=${lw / 2}
        fill=${fill.stroke} fill-opacity=${fill["stroke-opacity"]} />`;
  }
  const side = Math.min(box.w, box.h);
  const r = Math.max(0, side / 2 - lw / 2);
  const circumference = 2 * Math.PI * r;
  const sweep = el.style === "ring" ? 1 : 0.75;
  // ring starts at 12 o'clock; arc starts at 135deg from 3 o'clock (bottom-left).
  const rotate = el.style === "ring" ? -90 : 135;
  const trackLen = circumference * sweep;
  const fillLen = circumference * sweep * el.fraction;
  return svg`
    <g transform="rotate(${rotate} ${box.cx} ${box.cy})">
      <circle cx=${box.cx} cy=${box.cy} r=${r} fill="none" stroke-width=${lw} stroke-linecap="round"
        stroke=${track.stroke} stroke-opacity=${track["stroke-opacity"]}
        stroke-dasharray="${trackLen} ${circumference}" />
      ${el.fraction > 0
        ? svg`<circle cx=${box.cx} cy=${box.cy} r=${r} fill="none" stroke-width=${lw} stroke-linecap="round"
            stroke=${fill.stroke} stroke-opacity=${fill["stroke-opacity"]}
            stroke-dasharray="${fillLen} ${circumference}" />`
        : nothing}
    </g>`;
}

function renderShape(el: Extract<ResolvedElement, { kind: "shape" }>, box: Box) {
  const fill = colorAttrs(el.fillColorHex, "fill");
  const border = el.borderColorHex ? parseColor(el.borderColorHex) : undefined;
  const bw = border ? el.borderWidth : 0;
  // strokeBorder draws inside the bounds: inset by half the stroke.
  const inset = bw / 2;
  const strokeAttrs = border
    ? { stroke: border.color, "stroke-opacity": border.opacity, "stroke-width": bw }
    : { stroke: "none", "stroke-opacity": 0, "stroke-width": 0 };
  const common = svg`fill=${fill.fill} fill-opacity=${fill["fill-opacity"]}
    stroke=${strokeAttrs.stroke} stroke-opacity=${strokeAttrs["stroke-opacity"]} stroke-width=${strokeAttrs["stroke-width"]}`;
  switch (el.shapeKind) {
    case "circle": {
      const r = Math.min(box.w, box.h) / 2 - inset;
      return svg`<circle cx=${box.cx} cy=${box.cy} r=${Math.max(0, r)} ${common} />`;
    }
    case "capsule": {
      const r = Math.min(box.w, box.h) / 2;
      return svg`<rect x=${box.x + inset} y=${box.y + inset} width=${Math.max(0, box.w - bw)} height=${Math.max(0, box.h - bw)} rx=${r} ${common} />`;
    }
    case "roundedRectangle":
      return svg`<rect x=${box.x + inset} y=${box.y + inset} width=${Math.max(0, box.w - bw)} height=${Math.max(0, box.h - bw)} rx=${el.cornerRadius} ${common} />`;
    case "rectangle":
      return svg`<rect x=${box.x + inset} y=${box.y + inset} width=${Math.max(0, box.w - bw)} height=${Math.max(0, box.h - bw)} ${common} />`;
  }
}

function renderIcon(el: Extract<ResolvedElement, { kind: "icon" }>, box: Box, icons: IconProvider) {
  const glyph = icons.render(el.symbol, el.size, el.colorHex);
  if (glyph) return svg`<g transform="translate(${box.cx - el.size / 2} ${box.cy - el.size / 2})">${glyph}</g>`;
  // Missing-symbol placeholder: a dashed box with the name, so the layer is
  // still visible and the user can see which name failed to resolve.
  const c = colorAttrs(el.colorHex, "stroke");
  const s = el.size;
  return svg`
    <rect x=${box.cx - s / 2} y=${box.cy - s / 2} width=${s} height=${s} rx=${s * 0.2}
      fill="none" stroke=${c.stroke} stroke-opacity=${c["stroke-opacity"]} stroke-width="0.75" stroke-dasharray="1.5 1" />
    <text x=${box.cx} y=${box.cy} text-anchor="middle" dominant-baseline="central" font-size=${s * 0.5}
      fill=${c.stroke} fill-opacity=${c["stroke-opacity"]} font-family="sans-serif">?</text>`;
}

function renderElement(el: ResolvedElement, canvas: CanvasSize, options: RenderOptions) {
  if (el.isHidden && !options.showHidden) return nothing;
  const box = frameBox(el, canvas);
  let body;
  switch (el.kind) {
    case "text": body = renderText(el, box); break;
    case "icon": body = renderIcon(el, box, options.icons); break;
    case "gauge": body = renderGauge(el, box); break;
    case "shape": body = renderShape(el, box); break;
  }
  const opacity = Math.min(1, Math.max(0, el.opacity)) * (el.isHidden ? 0.35 : 1);
  const selected = options.highlightId === el.id;
  const highlight = selected
    ? svg`<rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} fill="none" stroke="#0A84FF" stroke-width="0.75" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" />`
    : nothing;
  // An invisible hit box so empty text and thin gauges are still grabbable.
  const hit = svg`<rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} fill="transparent" stroke="none" />`;
  const hs = 3;
  const handles = selected && options.handles
    ? [["nw", box.x, box.y], ["ne", box.x + box.w, box.y], ["sw", box.x, box.y + box.h], ["se", box.x + box.w, box.y + box.h]].map(
        ([corner, x, y]) => svg`<rect data-handle=${corner} x=${(x as number) - hs / 2} y=${(y as number) - hs / 2} width=${hs} height=${hs}
          fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${corner}-resize" />`,
      )
    : nothing;
  return svg`<g data-element-id=${el.id} opacity=${opacity} style=${options.handles ? "cursor:move" : nothing}
    transform="rotate(${el.frame.rotationDegrees} ${box.cx} ${box.cy})">${hit}${body}${highlight}${handles}</g>`;
}

/**
 * Corner preview geometry, in 46 mm reference points multiplied by `s` (the
 * design-box scale of the previewed case). The wedge body is gone: the device
 * test (app repo docs/custom_complication_design_box.md, corner addendum)
 * showed the corner slot is a small upright square near the screen corner that
 * watchOS never rotates, so the only honest corner look is Apple's own — a
 * disc at the corner plus a system-curved bezel label. The preview shows the
 * top-right quadrant of the watch screen with the disc where the real face
 * puts it (measured off a 46 mm watch photo).
 */
export function cornerContext(s: number) {
  return {
    /** Top-right quarter of the 208x248 pt 46 mm screen. */
    quad: { width: 104 * s, height: 124 * s },
    /** Screen shell corner radius. */
    cornerRadius: 52 * s,
    /** Slot disc centre: 24 pt in from the right edge, 29.5 pt down from the top. */
    disc: { cx: 80 * s, cy: 29.5 * s },
    /** Bezel-label baseline circle, centred on the dial (the quadrant's bottom-left). */
    dial: { cx: 0, cy: 124 * s, r: 96 * s },
  };
}

function cornerLabelArc(s: number, id: string) {
  const { dial } = cornerContext(s);
  // Baseline arc through the corner diagonal (-50 deg from the dial centre),
  // spanning [-90, -10] so centred text sits on the diagonal, inside the disc.
  const toXY = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return `${dial.cx + dial.r * Math.cos(rad)} ${dial.cy + dial.r * Math.sin(rad)}`;
  };
  return { id, d: `M ${toXY(-90)} A ${dial.r} ${dial.r} 0 0 1 ${toXY(-10)}` };
}

export function renderLayout(layout: ResolvedLayout, options: RenderOptions): TemplateResult {
  const family = (layout.family in CANVAS ? layout.family : "rectangular") as DrawableFamily;
  // `canvas` is the real slot: background, body clip, border and bezel fill it,
  // as on the watch. `design` is the box the layers were authored in; it lands
  // inside the slot through `fit` (docs/custom_complication_design_box.md).
  const canvas = options.slot ?? CANVAS[family];
  const design = CANVAS[family];
  const fit = fitBox(canvas, family);
  const uid = `clip-${family}-${Math.random().toString(36).slice(2, 8)}`;
  const bg = parseColor(layout.backgroundColorHex);
  const border = parseColor(layout.borderColorHex);
  const bw = layout.borderWidth * fit.scale;

  if (family === "corner") {
    // Watch-corner context preview: black screen quadrant, the slot disc where
    // the real face puts it, and the bezel label on the system's curve. The
    // slot content group is only translated (never scaled beyond `fit`), so
    // pointer deltas in interact.ts keep normalising against the fit box.
    const s = fit.scale; // corner slots are square, so fit.x = fit.y = 0
    const ctx = cornerContext(s);
    const r = Math.min(canvas.width, canvas.height) / 2;
    const slotX = ctx.disc.cx - canvas.width / 2;
    const slotY = ctx.disc.cy - canvas.height / 2;
    const shell = `M 0 0 H ${ctx.quad.width - ctx.cornerRadius} A ${ctx.cornerRadius} ${ctx.cornerRadius} 0 0 1 ${ctx.quad.width} ${ctx.cornerRadius} V ${ctx.quad.height} H 0 Z`;
    let bezel: TemplateResult | typeof nothing = nothing;
    if (layout.bezelText) {
      const arc = cornerLabelArc(s, `${uid}-bezel`);
      bezel = svg`<defs><path id=${arc.id} d=${arc.d} /></defs>
        <text font-size=${13 * s} font-weight="600" fill="#FFFFFF" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${arc.id}" startOffset="50%" text-anchor="middle">${layout.bezelText}</textPath></text>`;
    }
    const chrome = border
      ? svg`<circle cx=${canvas.width / 2} cy=${canvas.height / 2} r=${r - bw / 2} fill="none" stroke=${border.color} stroke-opacity=${border.opacity} stroke-width=${bw} />`
      : nothing;
    return svg`<svg viewBox=${`0 0 ${ctx.quad.width} ${ctx.quad.height}`} xmlns="http://www.w3.org/2000/svg" class="complication corner"
        width=${ctx.quad.width} height=${ctx.quad.height}>
      <defs><clipPath id=${uid}><circle cx=${canvas.width / 2} cy=${canvas.height / 2} r=${r} /></clipPath></defs>
      <path d=${shell} fill="#000000" />
      ${bezel}
      <g transform="translate(${slotX} ${slotY})">
        <g clip-path=${`url(#${uid})`}>
          ${bg ? svg`<rect width=${canvas.width} height=${canvas.height} fill=${bg.color} fill-opacity=${bg.opacity} />` : nothing}
          <g data-design-box transform="translate(${fit.x} ${fit.y}) scale(${fit.scale})">
            ${layout.elements.map((el) => renderElement(el, design, options))}
          </g>
        </g>
        <circle cx=${canvas.width / 2} cy=${canvas.height / 2} r=${r} fill="none"
          stroke="rgba(255,255,255,0.22)" stroke-width=${0.75 * s} stroke-dasharray=${`${2 * s} ${2 * s}`} />
        ${chrome}
      </g>
    </svg>`;
  }

  const clip = svg`<rect width=${canvas.width} height=${canvas.height} />`;
  const chrome = border
    ? svg`<rect x=${bw / 2} y=${bw / 2} width=${canvas.width - bw} height=${canvas.height - bw} fill="none" stroke=${border.color} stroke-opacity=${border.opacity} stroke-width=${bw} />`
    : nothing;
  // Editor affordance: a black well when there is no background so white
  // layers stay visible (the watch face itself is black).
  const well = svg`<rect width=${canvas.width} height=${canvas.height} fill="#000000" />`;
  const viewBox = `0 0 ${canvas.width} ${canvas.height}`;

  return svg`<svg viewBox=${viewBox} xmlns="http://www.w3.org/2000/svg" class="complication ${family}"
      width=${canvas.width} height=${canvas.height}>
    <defs><clipPath id=${uid}>${clip}</clipPath></defs>
    <g clip-path=${`url(#${uid})`}>
      ${well}
      ${bg ? svg`<rect width=${canvas.width} height=${canvas.height} fill=${bg.color} fill-opacity=${bg.opacity} />` : nothing}
      <g data-design-box transform="translate(${fit.x} ${fit.y}) scale(${fit.scale})">
        ${layout.elements.map((el) => renderElement(el, design, options))}
      </g>
    </g>
    ${chrome}
  </svg>`;
}

export function familyTitle(family: FamilyKind): string {
  switch (family) {
    case "rectangular": return "Rectangular";
    case "circular": return "Circular";
    case "corner": return "Corner";
    case "inline": return "Inline";
  }
}
