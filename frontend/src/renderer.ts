// SVG renderer for a resolved layout. Draws at canonical watch point sizes
// (docs/custom_complication_schema_v4.md §4.4 and §9) and lets CSS scale the
// result; every absolute size (font, stroke, radius) is in watch points so a
// 160x62 rectangle scaled 2x looks like the native editor.

import { svg, nothing, type TemplateResult } from "lit";
import {
  DESIGN_BOX,
  describeTapAction,
  type FamilyKind,
  type ImageContentMode,
  type ImageSource,
} from "./model.js";
import type { ImageSizeProvider } from "./image-sizes.js";
import {
  countdownRemainingString,
  type ResolvedBezelGauge,
  type ResolvedElement,
  type ResolvedLayout,
} from "./resolver.js";

export interface CanvasSize {
  width: number;
  height: number;
}

// The design box: the real WidgetKit slot on a 46 mm watch, measured 2026-08-30
// (app repo docs/custom_complication_design_box.md). Every watch draws a uniformly
// scaled copy of this box. It lives in model.ts because growing a tap area needs
// it too, and one copy cannot drift from the other.
export const CANVAS: Record<"rectangular" | "circular" | "corner", CanvasSize> = DESIGN_BOX;

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
  /** More elements to outline, without handles: the members of a selected
   * group, which move together and are not resized together. */
  highlightIds?: readonly string[];
  /** Editor affordance: the layer the pick-mode pointer is over, filled and
   * outlined the way a browser inspector shades the node under the cursor. */
  hoverId?: string;
  /** More layers to tint the same way: the members of a group row the pointer
   * rests on in the Layers list. */
  hoverIds?: readonly string[];
  /** Draw resize handles on the highlighted element (active family only). */
  handles?: boolean;
  /** Editor affordance: outline tap layers, which the watch never draws. */
  tapAreas?: boolean;
  /**
   * Review mode: answer "what happens if I tap here?" and nothing else. Every
   * tap area draws, attached ones included, each labelled with what it does,
   * and everything that is not a tap dims out of the way. Implies `tapAreas`.
   */
  tapReview?: boolean;
  /**
   * Review mode narrowed to one tap: only this tap area draws, with the
   * highlight and handles that `highlightId` and `handles` would give a layer,
   * so it can be dragged out to size. Every other tap hides (attached) or dims
   * with the drawing (free-standing). Only read when `tapReview` is on.
   */
  tapFocusId?: string;
  /** The image layer whose timestamp chip is selected: it draws a selection
   * box and corner handles (`data-ts-corner`) so it reads as movable. */
  timestampActiveId?: string;
  /** Natural sizes of the camera pictures, so a layer can be cropped the way
   * the watch crops it. Absent falls back to the browser's own fitting. */
  imageSizes?: ImageSizeProvider;
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
  // Live countdown: the preview shows the remaining time at render; the panel
  // re-renders once a second while any countdown is live, so it ticks too.
  if (el.countdownEnd !== undefined && el.countdownEnd > Date.now()) {
    el = { ...el, text: countdownRemainingString((el.countdownEnd - Date.now()) / 1000) };
  }
  // lineLimit(1) + minimumScaleFactor(0.5): shrink to fit the box width down
  // to half size; when the half-size floor still overflows, SwiftUI truncates
  // the tail with an ellipsis, so emulate that too instead of overflowing the
  // box. 0.55 em per glyph is the same heuristic the shrink step always used.
  const charW = (size: number) => size * 0.55;
  const approxWidth = el.text.length * charW(el.fontSize);
  const scale = approxWidth > box.w && box.w > 0 ? Math.max(0.5, box.w / approxWidth) : 1;
  const fontSize = el.fontSize * scale;
  let text = el.text;
  if (box.w > 0 && text.length * charW(fontSize) > box.w) {
    const budget = box.w - 0.8 * fontSize; // ellipsis width
    const keep = Math.max(1, Math.floor(budget / charW(fontSize)));
    text = `${text.slice(0, keep).replace(/\s+$/, "")}…`;
  }
  return svg`<text x=${box.cx} y=${box.cy} text-anchor="middle" dominant-baseline="central"
    font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size=${fontSize} font-weight=${FONT_WEIGHT[el.fontWeight] ?? 400}
    fill=${c.fill} fill-opacity=${c["fill-opacity"]}>${text}</text>`;
}

/** The gap between two dots of a `dots` gauge, in watch points. Mirrors the fixed
 * gap in `GaugeDotsView` in the app repo. */
const GAUGE_DOT_GAP = 2;

function renderGauge(el: Extract<ResolvedElement, { kind: "gauge" }>, box: Box) {
  const fill = colorAttrs(el.colorHex, "stroke");
  const track = colorAttrs(el.trackColorHex, "stroke", "#FFFFFF");
  const tick = colorAttrs(el.thresholdColorHex, "stroke", "#FFFFFF");
  const lw = el.lineWidth;
  if (el.style === "dots") {
    // One dot per unit along the long side, the first `filledCount` filled. The
    // diameter is the smaller of the short side and one dot's share of the long
    // side, so a wide frame spreads them and a tall one stacks them.
    const horizontal = box.w >= box.h;
    const count = Math.max(1, el.dotCount);
    const long = horizontal ? box.w : box.h;
    const short = horizontal ? box.h : box.w;
    const d = Math.max(1, Math.min(short, long / count - GAUGE_DOT_GAP));
    const span = count * d + (count - 1) * GAUGE_DOT_GAP;
    const first = (horizontal ? box.cx : box.cy) - span / 2 + d / 2;
    return svg`${Array.from({ length: count }, (_, i) => {
      const at = first + i * (d + GAUGE_DOT_GAP);
      const paint = i < el.filledCount ? fill : track;
      return svg`<circle cx=${horizontal ? at : box.cx} cy=${horizontal ? box.cy : at} r=${d / 2}
        fill=${paint.stroke} fill-opacity=${paint["stroke-opacity"]} />`;
    })}`;
  }
  if (el.style === "bar") {
    const w = box.w;
    const fillW = Math.max(lw, w * el.fraction);
    const tickW = 1;
    return svg`
      <rect x=${box.x} y=${box.cy - lw / 2} width=${w} height=${lw} rx=${lw / 2}
        fill=${track.stroke} fill-opacity=${track["stroke-opacity"]} />
      <rect x=${box.x} y=${box.cy - lw / 2} width=${fillW} height=${lw} rx=${lw / 2}
        fill=${fill.stroke} fill-opacity=${fill["stroke-opacity"]} />
      ${el.thresholdFraction === undefined
        ? nothing
        : svg`<rect x=${box.x + Math.min(w - tickW, Math.max(0, w * el.thresholdFraction - tickW / 2))}
            y=${box.cy - lw / 2} width=${tickW} height=${lw}
            fill=${tick.stroke} fill-opacity=${tick["stroke-opacity"]} />`}`;
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
      ${el.thresholdFraction === undefined ? nothing : gaugeTick(box, r, lw, sweep * 360 * el.thresholdFraction, el.thresholdColorHex)}
    </g>`;
}

/** The mark a ring or arc puts on its scale at the threshold: a short radial line
 * across the stroke, drawn inside the same rotated group as the track so one
 * rotation places both. Mirrors `GaugeThresholdTick` in the app repo. */
function gaugeTick(box: Box, r: number, lw: number, degrees: number, colorHex: string) {
  const tick = colorAttrs(colorHex, "stroke", "#FFFFFF");
  const radians = (degrees * Math.PI) / 180;
  const dx = Math.cos(radians);
  const dy = Math.sin(radians);
  const half = lw / 2 + 1;
  return svg`<line x1=${box.cx + dx * (r - half)} y1=${box.cy + dy * (r - half)}
    x2=${box.cx + dx * (r + half)} y2=${box.cy + dy * (r + half)}
    stroke-width="1" stroke=${tick.stroke} stroke-opacity=${tick["stroke-opacity"]} />`;
}

/** Height of the band a chart reserves along its top for markers, in watch points.
 * Mirrors `CustomComplicationChartGeometry.markerHeight` in Swift. */
const CHART_MARKER_BAND = 5;

/** Where every mark of a chart lands inside its frame.
 *
 * Pure geometry, no colours: mirrors `CustomComplicationChartGeometry` in the app
 * repo, at scale 1 because the panel already draws in watch points. */
function chartGeometry(el: Extract<ResolvedElement, { kind: "chart" }>, box: Box) {
  const values = el.values;
  const n = Math.max(values.length, 1);
  const marks = el.highIndex !== undefined || el.lowIndex !== undefined;
  const band = el.marker === "none" || !marks ? 0 : CHART_MARKER_BAND;
  // Line and area are stroked on the value itself, so half the stroke would fall
  // outside a plot sized to the frame. Bars are filled inside theirs.
  const inset = el.style === "bars" ? 0 : el.lineWidth / 2;

  // The plot takes the whole frame. A chart's numbers are text layers of their
  // own, so nothing here reserves room for them; the author resizes the chart.
  const plotX = box.x;
  const plotW = Math.max(box.w, 0);

  const top = box.y + band + inset;
  const height = Math.max(box.h - band - inset * 2, 1);
  const bottom = top + height;

  const span = Math.max(el.domainMax - el.domainMin, Number.EPSILON);
  const growsFromBottom = el.baseline === "lowest";
  const minimumBar = growsFromBottom ? height * 0.12 : 0;

  // Cap the gap so bars never starve, whatever the author typed.
  const gap = Math.min(Math.max(el.barGap, 0), plotW / (n * 2));
  const barWidth = Math.max((plotW - gap * (n - 1)) / n, 0.5);

  const fraction = (v: number) => Math.min(1, Math.max(0, (v - el.domainMin) / span));
  const y = (v: number) => bottom - fraction(v) * height;

  return {
    count: values.length,
    barWidth,
    plotTop: top,
    plotBottom: bottom,
    plotLeft: plotX,
    plotRight: plotX + plotW,
    baselineY: growsFromBottom ? bottom : y(0),
    /** Where a 0…1 fraction of the domain lands, 1 being the top of the plot.
     * The resolver hands the threshold over as a fraction so the renderer never
     * has to know what the domain was. */
    yAtFraction(f: number) {
      return bottom - Math.min(Math.max(f, 0), 1) * height;
    },
    barRect(index: number) {
      const x = plotX + index * (barWidth + gap);
      const value = values[index]!;
      let hi: number;
      let lo: number;
      if (growsFromBottom) {
        // The lowest reading would otherwise be a zero-height sliver, and a run of
        // equal readings would vanish entirely. Every bar keeps a visible stub.
        const h = minimumBar + fraction(value) * (height - minimumBar);
        hi = bottom - h;
        lo = bottom;
      } else {
        hi = y(value);
        lo = growsFromBottom ? bottom : y(0);
        if (hi > lo) [hi, lo] = [lo, hi]; // negative reading, hanging below zero
      }
      return { x, y: hi, w: barWidth, h: Math.max(lo - hi, 0.5) };
    },
    point(index: number) {
      const usable = Math.max(plotW - inset * 2, 0);
      const x = values.length > 1
        ? plotX + inset + (usable * index) / (values.length - 1)
        : plotX + plotW / 2;
      return { x, y: y(values[index]!) };
    },
    markerCenter(index: number, bars: boolean) {
      const r = bars ? this.barRect(index) : undefined;
      return { x: r ? r.x + r.w / 2 : this.point(index).x, y: box.y + band / 2 };
    },
  };
}

function renderChart(el: Extract<ResolvedElement, { kind: "chart" }>, box: Box) {
  if (el.values.length === 0) return nothing;
  const g = chartGeometry(el, box);
  const base = colorAttrs(el.colorHex, "fill");
  const high = colorAttrs(el.highColorHex, "fill", el.colorHex);
  const low = colorAttrs(el.lowColorHex, "fill", el.colorHex);

  const dot = (c: { x: number; y: number }, colour: ReturnType<typeof colorAttrs>) =>
    svg`<circle cx=${c.x} cy=${c.y} r="1.7" fill=${colour.fill} fill-opacity=${colour["fill-opacity"]} />`;

  const body: TemplateResult[] = [];

  // One colour per reading when the chart is banded, otherwise the series colour.
  const banded = el.pointColorHexes.length === g.count;
  const bandAt = (i: number) => (banded ? colorAttrs(el.pointColorHexes[i]!, "fill", el.colorHex) : base);

  if (el.style === "bars") {
    for (let i = 0; i < g.count; i++) {
      const r = g.barRect(i);
      // The highlight is the more specific statement, so it paints over its band.
      const colour = i === el.highIndex ? high : i === el.lowIndex ? low : bandAt(i);
      const radius = Math.min(1.2, r.w / 2, r.h / 2);
      body.push(svg`<rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx=${radius}
        fill=${colour.fill} fill-opacity=${colour["fill-opacity"]} />`);
    }
  } else {
    const points = Array.from({ length: g.count }, (_, i) => g.point(i));
    const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
    if (el.style === "area") {
      if (el.fillBands && banded && g.count > 1) {
        // One quad per leg, each under its own stretch of line. No clipping and no
        // gradient: the quads share their edges, so they read as one wash.
        for (let i = 0; i < g.count - 1; i++) {
          const a = points[i]!;
          const b = points[i + 1]!;
          const colour = bandAt(i + 1);
          const quad = `M${a.x} ${a.y} L${b.x} ${b.y} L${b.x} ${g.baselineY} L${a.x} ${g.baselineY} Z`;
          body.push(svg`<path d=${quad} fill=${colour.fill}
            fill-opacity=${(colour["fill-opacity"] as number) * 0.28} stroke="none" />`);
        }
      } else {
        const area = `${line} L${points[points.length - 1]!.x} ${g.baselineY} L${points[0]!.x} ${g.baselineY} Z`;
        body.push(svg`<path d=${area} fill=${base.fill}
          fill-opacity=${(base["fill-opacity"] as number) * 0.28} stroke="none" />`);
      }
    }
    if (banded && g.count > 1) {
      // A stroke cannot change colour halfway, so a banded line is drawn one
      // segment at a time. Each segment takes the band of the reading it arrives
      // at, which puts the newest reading's colour on the last segment.
      for (let i = 0; i < g.count - 1; i++) {
        const a = points[i]!;
        const b = points[i + 1]!;
        const colour = bandAt(i + 1);
        body.push(svg`<path d=${`M${a.x} ${a.y} L${b.x} ${b.y}`} fill="none"
          stroke=${colour.fill} stroke-opacity=${colour["fill-opacity"]}
          stroke-width=${el.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`);
      }
    } else {
      body.push(svg`<path d=${line} fill="none" stroke=${base.fill} stroke-opacity=${base["fill-opacity"]}
        stroke-width=${el.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`);
    }
    // A single stroke cannot change colour halfway without splitting into two
    // paths, so line and area put the highlight on a dot at the reading.
    if (el.highIndex !== undefined) body.push(dot(points[el.highIndex]!, high));
    if (el.lowIndex !== undefined) body.push(dot(points[el.lowIndex]!, low));
  }

  if (el.marker !== "none") {
    const bars = el.style === "bars";
    if (el.highIndex !== undefined) {
      const c = g.markerCenter(el.highIndex, bars);
      body.push(el.marker === "pointer"
        ? svg`<path d=${`M${c.x} ${c.y - 1.8} L${c.x + 2.2} ${c.y + 1.8} L${c.x - 2.2} ${c.y + 1.8} Z`}
            fill=${high.fill} fill-opacity=${high["fill-opacity"]} />`
        : dot(c, high));
    }
    if (el.lowIndex !== undefined) body.push(dot(g.markerCenter(el.lowIndex, bars), low));
  }

  // The two lines that are about the plot rather than about a reading: a dashed
  // horizontal one at the threshold, and a vertical one standing on "now". Both
  // are one point thick, so they read as annotation over the series rather than
  // as another series.
  if (el.thresholdY !== undefined) {
    const y = g.yAtFraction(el.thresholdY);
    const colour = colorAttrs(el.thresholdColorHex, "fill", el.colorHex);
    body.push(svg`<path d=${`M${g.plotLeft} ${y} L${g.plotRight} ${y}`} fill="none"
      stroke=${colour.fill} stroke-opacity=${colour["fill-opacity"]}
      stroke-width="1" stroke-dasharray="2 2" />`);
  }
  if (el.nowIndex !== undefined && el.nowIndex < g.count) {
    const x = g.markerCenter(el.nowIndex, el.style === "bars").x;
    const colour = colorAttrs(el.nowColorHex, "fill", el.colorHex);
    body.push(svg`<path d=${`M${x} ${g.plotTop} L${x} ${g.plotBottom}`} fill="none"
      stroke=${colour.fill} stroke-opacity=${colour["fill-opacity"]} stroke-width="1" />`);
  }

  return svg`${body}`;
}

function renderShape(el: Extract<ResolvedElement, { kind: "shape" }>, box: Box) {
  const fill = colorAttrs(el.fillColorHex, "fill");
  const border = el.borderColorHex ? parseColor(el.borderColorHex) : undefined;
  const bw = border ? el.borderWidth : 0;
  // strokeBorder draws inside the bounds: inset by half the stroke.
  const inset = bw / 2;
  const stroke = border ? border.color : "none";
  const strokeOpacity = border ? border.opacity : 0;
  // The paint attributes are written out on every element rather than shared
  // through a nested template: Lit does not splice a template into the middle
  // of a tag, so a shared fragment silently drops every attribute in it and the
  // shape draws in SVG's default paint, which is black (seen 2026-09-05).
  switch (el.shapeKind) {
    case "circle": {
      const r = Math.min(box.w, box.h) / 2 - inset;
      return svg`<circle cx=${box.cx} cy=${box.cy} r=${Math.max(0, r)}
        fill=${fill.fill} fill-opacity=${fill["fill-opacity"]}
        stroke=${stroke} stroke-opacity=${strokeOpacity} stroke-width=${bw} />`;
    }
    case "capsule": {
      const r = Math.min(box.w, box.h) / 2;
      return svg`<rect x=${box.x + inset} y=${box.y + inset} width=${Math.max(0, box.w - bw)} height=${Math.max(0, box.h - bw)} rx=${r}
        fill=${fill.fill} fill-opacity=${fill["fill-opacity"]}
        stroke=${stroke} stroke-opacity=${strokeOpacity} stroke-width=${bw} />`;
    }
    case "roundedRectangle":
      return svg`<rect x=${box.x + inset} y=${box.y + inset} width=${Math.max(0, box.w - bw)} height=${Math.max(0, box.h - bw)} rx=${el.cornerRadius}
        fill=${fill.fill} fill-opacity=${fill["fill-opacity"]}
        stroke=${stroke} stroke-opacity=${strokeOpacity} stroke-width=${bw} />`;
    case "rectangle":
      return svg`<rect x=${box.x + inset} y=${box.y + inset} width=${Math.max(0, box.w - bw)} height=${Math.max(0, box.h - bw)}
        fill=${fill.fill} fill-opacity=${fill["fill-opacity"]}
        stroke=${stroke} stroke-opacity=${strokeOpacity} stroke-width=${bw} />`;
    case "line": {
      // A bar down the middle of the frame's long side. The border is not drawn:
      // a line's colour is its fill, and a stroke around a 1 pt bar would only
      // thicken it. Thicker than the short side is clamped to it, as in Swift.
      const along = box.w >= box.h;
      const t = Math.max(0, Math.min(el.thickness, along ? box.h : box.w));
      const x = along ? box.x : box.cx - t / 2;
      const y = along ? box.cy - t / 2 : box.y;
      return svg`<rect x=${x} y=${y} width=${along ? box.w : t} height=${along ? t : box.h}
        fill=${fill.fill} fill-opacity=${fill["fill-opacity"]} stroke="none" />`;
    }
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

/**
 * Where a picture's pixels land inside its layer frame, in that frame's own
 * points with the frame's top-left as the origin.
 *
 * `fill` scales until the frame is covered and throws the overflow away; `fit`
 * scales until the whole picture is inside and leaves the spare edges empty.
 * `zoom` multiplies whichever was chosen: above 1 even a fitted picture starts
 * to crop, below 1 even a filled one pulls away from the frame and leaves the
 * spare edges empty. `panX`/`panY` then slide the frame
 * over the picture: 0 centred, -1 the picture's left (or top) edge against the
 * frame's, 1 the right (or bottom) one. An axis with nothing to spare cannot
 * move, because its overflow is zero.
 *
 * This is a port of `CustomComplication.pictureRect` in the app
 * (Shared/CustomComplicationRendering.swift). The numbers are pinned on both
 * sides; change one and change the other.
 */
/** The zoom range the editor offers and the drawing clamps to. Below 1 is
 * allowed on purpose: shrinking a filled picture away from the frame's edges is
 * a look, not a mistake to prevent. Mirrors `CustomComplication.minimumZoom`. */
export const MIN_ZOOM = 0.25;
export const MAX_ZOOM = 8;

export function pictureRect(
  boxWidth: number,
  boxHeight: number,
  imageWidth: number,
  imageHeight: number,
  contentMode: ImageContentMode,
  zoom: number,
  panX: number,
  panY: number,
): { x: number; y: number; width: number; height: number } {
  const whole = { x: 0, y: 0, width: boxWidth, height: boxHeight };
  if (!(boxWidth > 0) || !(boxHeight > 0) || !(imageWidth > 0) || !(imageHeight > 0)) return whole;
  const z = Math.min(Math.max(Number.isFinite(zoom) ? zoom : 1, MIN_ZOOM), MAX_ZOOM);
  const cover = Math.max(boxWidth / imageWidth, boxHeight / imageHeight);
  const contain = Math.min(boxWidth / imageWidth, boxHeight / imageHeight);
  const scale = (contentMode === "fit" ? contain : cover) * z;
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  const px = Math.min(Math.max(Number.isFinite(panX) ? panX : 0, -1), 1);
  const py = Math.min(Math.max(Number.isFinite(panY) ? panY : 0, -1), 1);
  // `+ 0` turns a negative zero back into zero: Swift's == does not tell them
  // apart and neither should a test comparing the two ports.
  return {
    x: (-(width - boxWidth) / 2) * (1 + px) + 0,
    y: (-(height - boxHeight) / 2) * (1 + py) + 0,
    width,
    height,
  };
}

/** Camera snapshot preview: HA's entity_picture cropped into the frame the same
 * way the watch crops it, clipped to the layer's own rounded rectangle. No URL
 * (entity not found, or a non-camera entity) draws the placeholder the watch
 * shows before its first fetch. The timestamp chip mirrors the watch's overlay
 * with the current time, since the preview picture is always live. */
/** The chip's text: 12-hour with seconds and no AM/PM, matching
 * `ImageElementView.clockFormatter` on the watch. */
export function timestampLabel(d: Date): string {
  const hour12 = d.getHours() % 12 || 12;
  const two = (n: number) => String(n).padStart(2, "0");
  return `${hour12}:${two(d.getMinutes())}:${two(d.getSeconds())}`;
}

/** Distance from the picture's edge to a cornered chip. Free placement ignores
 * it: an author who dragged the chip to the edge meant the edge. */
const TIMESTAMP_PAD = 4;

/**
 * Where the timestamp chip sits inside an image layer's box.
 *
 * The size is computed, never measured. A widget render may not get a second
 * layout pass, and the panel and the watch have to clamp to the same numbers or
 * a chip dragged to the edge lands in two different places. The label is always
 * `h:mm:ss`, so its width has only two possible values for a given text size and
 * the formula below is exact enough to agree across both ports.
 *
 * Free placement treats the pair as the chip's centre and keeps the whole chip
 * inside the picture. A chip wider than the picture it sits on cannot obey that,
 * so it centres on the overflowing axis instead of hanging off one side.
 */
export function timestampChipRect(
  el: { timestampSize: number; timestampCorner: string; timestampX?: number; timestampY?: number },
  box: Box,
  label: string,
): { x: number; y: number; w: number; h: number; size: number; label: string } {
  const size = Math.min(Math.max(el.timestampSize, 4), 40);
  const w = label.length * size * 0.578 + size * 0.89;
  const h = size * 1.25;
  const free = Number.isFinite(el.timestampX) && Number.isFinite(el.timestampY);
  if (!free) {
    const x = el.timestampCorner.endsWith("Leading") ? box.x + TIMESTAMP_PAD : box.x + box.w - TIMESTAMP_PAD - w;
    const y = el.timestampCorner.startsWith("top") ? box.y + TIMESTAMP_PAD : box.y + box.h - TIMESTAMP_PAD - h;
    return { x, y, w, h, size, label };
  }
  const fit = (centre: number, origin: number, extent: number, chip: number) => {
    if (chip >= extent) return origin + (extent - chip) / 2;
    return Math.min(origin + extent - chip, Math.max(origin, centre - chip / 2));
  };
  return {
    x: fit(box.x + el.timestampX! * box.w, box.x, box.w, w),
    y: fit(box.y + el.timestampY! * box.h, box.y, box.h, h),
    w, h, size, label,
  };
}

/** What an unfetched picture stands in as, mirroring `ImageElementView` on the
 * watch. A camera layer keeps the camera glyph it has always shown; an entity
 * picture follows the entity's domain, so a person tile reads as a missing
 * avatar rather than a missing camera. */
export function imagePlaceholderSymbol(source: ImageSource, entityId: string): string {
  if (source === "camera") return "camera.fill";
  switch (entityId.split(".")[0]) {
    case "camera": return "camera.fill";
    case "person": return "person.crop.circle";
    case "media_player": return "music.note";
    default: return "photo";
  }
}

function renderImage(el: Extract<ResolvedElement, { kind: "image" }>, box: Box, options: RenderOptions) {
  const icons = options.icons;
  const clipId = `imgclip-${el.id}`;
  const r = Math.max(0, el.cornerRadius);
  const c = el.showTimestamp && el.url ? timestampChipRect(el, box, timestampLabel(new Date())) : undefined;
  const chip = c
    ? svg`
        <rect data-ts-handle="1" x=${c.x} y=${c.y} width=${c.w} height=${c.h} rx=${c.h / 2}
          fill="#000000" fill-opacity="0.55" />
        <text data-ts-handle="1" x=${c.x + c.w / 2} y=${c.y + c.h / 2} text-anchor="middle" dominant-baseline="central"
          font-size=${c.size} font-weight="600" fill="#FFFFFF"
          font-family="-apple-system, 'SF Pro Rounded', Helvetica, Arial, sans-serif">${c.label}</text>`
    : nothing;
  // The selected chip gets the same dashed box and corner handles a selected
  // layer gets, drawn outside the picture's clip so a chip on the edge still
  // shows all four. The corners resize the text; the chip itself moves.
  const hs = 3;
  const chipSelection = c && options.timestampActiveId === el.id
    ? svg`
        <rect x=${c.x} y=${c.y} width=${c.w} height=${c.h} fill="none" stroke="#0A84FF" stroke-width="0.75"
          stroke-dasharray="2 1" vector-effect="non-scaling-stroke" pointer-events="none" />
        ${[["nw", c.x, c.y], ["ne", c.x + c.w, c.y], ["sw", c.x, c.y + c.h], ["se", c.x + c.w, c.y + c.h]].map(
          ([corner, x, y]) => svg`<rect data-ts-corner=${corner} x=${(x as number) - hs / 2} y=${(y as number) - hs / 2} width=${hs} height=${hs}
            fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${corner}-resize" />`,
        )}`
    : nothing;
  // The crop needs the picture's own pixel size. Until the browser reports it,
  // fall back to its own fitting, which is exactly right at the default
  // settings and one render out of date for the rest.
  const natural = el.url ? options.imageSizes?.size(el.url) : undefined;
  let content;
  if (el.url && natural) {
    const p = pictureRect(box.w, box.h, natural.width, natural.height, el.contentMode, el.zoom, el.panX, el.panY);
    content = svg`<image href=${el.url} x=${box.x + p.x} y=${box.y + p.y} width=${p.width} height=${p.height}
      preserveAspectRatio="none" />`;
  } else if (el.url) {
    content = svg`<image href=${el.url} x=${box.x} y=${box.y} width=${box.w} height=${box.h}
      preserveAspectRatio=${el.contentMode === "fit" ? "xMidYMid meet" : "xMidYMid slice"} />`;
  } else {
    content = svg`
      <rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} rx=${r} fill="#FFFFFF" fill-opacity="0.18" />
      <g transform="translate(${box.cx - 7} ${box.cy - 7})">${icons.render(imagePlaceholderSymbol(el.source, el.entityId), 14, "#FFFFFF99") ?? nothing}</g>`;
  }
  return svg`
    <defs><clipPath id=${clipId}><rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} rx=${r} /></clipPath></defs>
    <g clip-path=${`url(#${clipId})`}>${content}${chip}</g>${chipSelection}`;
}

/** Tap area, editor only: a faint dashed box with a small hand glyph so the
 * author can see and grab what the watch never draws. Off (nothing) unless the
 * caller asked for tap areas. */
function renderTap(
  el: Extract<ResolvedElement, { kind: "tap" }>,
  box: Box,
  icons: IconProvider,
  show: boolean,
  label?: string,
) {
  if (!show) return nothing;
  const glyph = Math.min(10, box.w * 0.5, box.h * 0.5);
  const text = label !== undefined ? tapLabelText(label, box) : undefined;
  return svg`
    <rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} rx="2" fill="#FFD60A" fill-opacity="0.08"
      stroke="#FFD60A" stroke-opacity="0.8" stroke-width="0.6" stroke-dasharray="1.5 1" vector-effect="non-scaling-stroke" />
    ${text !== undefined
      ? svg`<text x=${box.cx} y=${box.cy} text-anchor="middle" dominant-baseline="central"
          font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size=${TAP_LABEL_SIZE} font-weight="600" fill="#FFD60A" fill-opacity="0.95">${text}</text>`
      : glyph >= 5
        ? svg`<g transform="translate(${box.cx - glyph / 2} ${box.cy - glyph / 2})" opacity="0.8">${icons.render("hand.tap.fill", glyph, "#FFD60A") ?? nothing}</g>`
        : nothing}`;
}

/** Design-box points. Small enough that a 24 pt target still fits a word or
 * two, large enough to read at the preview's own scale. */
const TAP_LABEL_SIZE = 5;

/**
 * The action label trimmed to the tap's box, or `undefined` when the box is too
 * small to hold any of it. A box that cannot show a label keeps the hand glyph:
 * half a truncated word says less than a finger does.
 */
function tapLabelText(label: string, box: Box): string | undefined {
  const charW = TAP_LABEL_SIZE * 0.55;
  const budget = box.w - 2;
  if (box.h < TAP_LABEL_SIZE * 1.6 || budget < charW * 4) return undefined;
  if (label.length * charW <= budget) return label;
  const keep = Math.max(1, Math.floor(budget / charW) - 1);
  return `${label.slice(0, keep).replace(/\s+$/, "")}…`;
}

function renderElement(el: ResolvedElement, canvas: CanvasSize, options: RenderOptions) {
  if (el.isHidden && !options.showHidden) return nothing;
  const review = options.tapReview === true;
  const showTaps = options.tapAreas === true || review;
  // Review narrowed to one tap: that tap is the whole point of the picture, and
  // every other tap steps back with the drawing.
  const focus = review ? options.tapFocusId : undefined;
  const focused = focus !== undefined && el.id === focus;
  const inFocusView = focus !== undefined;
  // A tap layer draws nothing on the watch. Outside the editor it takes no space
  // and no clicks either, so the preview matches the watch.
  if (el.kind === "tap" && !showTaps) return nothing;
  // An attached tap holds its layer's frame, so normally its dashed box and its
  // finger would sit on top of something already drawn and say nothing the
  // layer's own "tap" chip does not. Only a free-standing tap needs to be shown,
  // because nothing else marks where it is. Review mode is the exception: there
  // the question is where the targets are, and a pushed-out attached tap is
  // exactly the target that reaches past what you can see.
  if (el.kind === "tap" && el.attachedTo !== undefined && (!review || (inFocusView && !focused))) return nothing;
  const box = frameBox(el, canvas);
  const labelled = review && (!inFocusView || focused);
  let body;
  switch (el.kind) {
    case "text": body = renderText(el, box); break;
    case "icon": body = renderIcon(el, box, options.icons); break;
    case "gauge": body = renderGauge(el, box); break;
    case "chart": body = renderChart(el, box); break;
    case "shape": body = renderShape(el, box); break;
    case "image": body = renderImage(el, box, options); break;
    case "tap": body = renderTap(el, box, options.icons, showTaps, labelled ? describeTapAction(el.action) : undefined); break;
  }
  // Review mode pushes the drawing back so the tap boxes are the thing you read.
  const dim = review && (el.kind !== "tap" || (inFocusView && !focused)) ? 0.35 : 1;
  const opacity = Math.min(1, Math.max(0, el.opacity)) * (el.isHidden ? 0.35 : 1) * dim;
  const primary = options.highlightId === el.id;
  const selected = primary || options.highlightIds?.includes(el.id) === true;
  // In the focus view only the focused tap is a thing you drag, so only it gets
  // the move cursor and the handles.
  const draggable = options.handles === true && (!inFocusView || focused);
  const highlight = selected
    ? svg`<rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} fill="none" stroke="#0A84FF" stroke-width="0.75" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" />`
    : nothing;
  // Solid tint rather than the selection's dashes, so the two never read as the
  // same state when the pointer happens to rest on the selected layer.
  const hover = options.hoverId === el.id || options.hoverIds?.includes(el.id) === true
    ? svg`<rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} fill="#0A84FF" fill-opacity="0.22"
        stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`
    : nothing;
  // An invisible hit box so empty text and thin gauges are still grabbable.
  const hit = svg`<rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} fill="transparent" stroke="none" />`;
  const hs = 3;
  const handles = primary && draggable
    ? [["nw", box.x, box.y], ["ne", box.x + box.w, box.y], ["sw", box.x, box.y + box.h], ["se", box.x + box.w, box.y + box.h]].map(
        ([corner, x, y]) => svg`<rect data-handle=${corner} x=${(x as number) - hs / 2} y=${(y as number) - hs / 2} width=${hs} height=${hs}
          fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${corner}-resize" />`,
      )
    : nothing;
  return svg`<g data-element-id=${el.id} opacity=${opacity} style=${draggable ? "cursor:move" : nothing}
    transform="rotate(${el.frame.rotationDegrees} ${box.cx} ${box.cy})">${hit}${body}${hover}${highlight}${handles}</g>`;
}

/**
 * Corner preview geometry, in 46 mm reference points multiplied by `s` (the
 * design-box scale of the previewed case). The corner slot is a small upright
 * square near the screen corner that watchOS never rotates; the curved part is
 * the system bezel label. All numbers below were measured off a 46 mm watch
 * screenshot on 2026-08-30 (app repo docs/custom_complication_design_box.md,
 * corner addendum). The preview shows the top-right screen quadrant.
 */
export function cornerContext(s: number, hasBezel: boolean) {
  return {
    /** Top-right quarter of the 208x248 pt 46 mm screen. */
    quad: { width: 104 * s, height: 124 * s },
    /** Screen shell corner radius. */
    cornerRadius: 52 * s,
    /**
     * Content-disc centre. Measured: with a bezel label 29.75 pt in from the
     * right edge and 24 pt down; without one the bigger disc sits 34 pt in and
     * 29.5 pt down (the outer margin to the screen edges stays put, the disc
     * grows inward).
     */
    tile: hasBezel
      ? { cx: (104 - 29.75) * s, cy: 24 * s }
      : { cx: (104 - 34) * s, cy: 29.5 * s },
    /** Bezel-label baseline circle, centred on the dial (the quadrant's bottom-left). */
    dial: { cx: 0, cy: 124 * s, r: 100.5 * s },
    /** Label arc region for a top-right corner, degrees (0 = right, -90 = up). */
    labelArc: { start: -90, end: -24 },
  };
}

/**
 * Diameter of the visible corner content disc, in 46 mm reference points times
 * the case scale. watchOS always hands the widget a 34x34 slot (the probe
 * shows 34 in both states) and masks the result to a circle; without a bezel
 * label it composites 1:1 (a full 34 pt disc, measured), with one it scales
 * the render down to ~23.5 pt to make room for the curved text.
 */
export function cornerTileSide(caseScale: number, hasBezel: boolean): number {
  return (hasBezel ? 23.5 : 34) * caseScale;
}

const BEZEL_FONT = 10.5; // cap height measured 7.5 pt; SF cap ratio ~0.71

/**
 * Emulates the watch's bezel-label typesetting: watchOS uppercases the text
 * and truncates it with an ellipsis when it overruns the label arc. Widths are
 * a per-glyph heuristic (em fractions of SF Semibold), good to about one
 * character against the device photo.
 */
/** Per-glyph width heuristic (em fractions of SF Semibold), good to about one
 * character against the device photos. */
function glyphWidth(ch: string, fontSize: number): number {
  return (ch === " " ? 0.35 : /[ILJ1.,:;'!|]/.test(ch) ? 0.34 : /[MW]/.test(ch) ? 0.92 : 0.66) * fontSize;
}

function estimateTextWidth(text: string, fontSize: number): number {
  let total = 0;
  for (const ch of text) total += glyphWidth(ch, fontSize);
  return total;
}

export function bezelDisplayText(text: string, arcLen: number, fontSize: number): string {
  const up = text.toUpperCase();
  const w = (ch: string) => glyphWidth(ch, fontSize);
  const ellipsis = 0.9 * fontSize;
  let total = 0;
  for (const ch of up) total += w(ch);
  if (total <= arcLen) return up;
  let used = 0;
  let out = "";
  for (const ch of up) {
    if (used + w(ch) + ellipsis > arcLen) break;
    out += ch;
    used += w(ch);
  }
  return `${out.replace(/\s+$/, "")}…`;
}

function arcPointXY(dial: { cx: number; cy: number }, r: number, deg: number): { x: number; y: number } {
  const rad = (deg * Math.PI) / 180;
  return { x: dial.cx + r * Math.cos(rad), y: dial.cy + r * Math.sin(rad) };
}

function arcPathD(dial: { cx: number; cy: number }, r: number, a0: number, a1: number): string {
  const p0 = arcPointXY(dial, r, a0);
  const p1 = arcPointXY(dial, r, a1);
  return `M ${p0.x} ${p0.y} A ${r} ${r} 0 0 1 ${p1.x} ${p1.y}`;
}

function cornerArc(s: number, id: string, radius: number, arc: { start: number; end: number }) {
  const { dial } = cornerContext(s, true);
  const sweepRad = ((arc.end - arc.start) * Math.PI) / 180;
  return { id, d: arcPathD(dial, radius, arc.start, arc.end), length: radius * sweepRad };
}

function cornerLabelArc(s: number, id: string) {
  // Baseline arc for the top-right corner. Measured: the label starts at
  // 12 o'clock (-90) and the truncation ellipsis lands at about -25, so the
  // reserved region is [-90, -24]; text is centred in it (a truncated label
  // fills it edge to edge, matching the photo).
  const ctx = cornerContext(s, true);
  return cornerArc(s, id, ctx.dial.r, ctx.labelArc);
}

/**
 * Big curved main text (`widgetCurvesContent` on the watch), the stock
 * Calendar "SUN" / Weather "86°" look. Measured off a 46 mm watch screenshot
 * 2026-08-30: caps ~13.1 pt tall (so ~18.5 pt SF Semibold), baseline on a
 * 113 pt circle (outside the widget label, per Apple's "content on the
 * outside of the curve"), uppercased, ellipsis-truncated to roughly
 * [-71°, -36°] for a top-right corner.
 */
const CURVED_FONT = 18.5;
const CURVED_BASELINE_R = 113;
const CURVED_ARC = { start: -71, end: -36 };

/**
 * Bezel gauge geometry, measured off the same screenshot: 6.2 pt stroke
 * centred on a 104 pt circle spanning about [-77°, -30.5°], sitting inside
 * the curved content.
 */
const GAUGE_R = 104;
const GAUGE_W = 6.2;
const GAUGE_ARC = { start: -77, end: -30.5 };

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const v = (i: number) => parseInt(h.slice(i, i + 2), 16) || 0;
  return [v(0), v(2), v(4)];
}

/** Piecewise-linear interpolation across the gauge's gradient stops. */
function gaugeColorAt(colors: string[], t: number): string {
  if (colors.length === 0) return "#34C759";
  if (colors.length === 1) return colors[0]!;
  const pos = Math.min(1, Math.max(0, t)) * (colors.length - 1);
  const i = Math.min(colors.length - 2, Math.floor(pos));
  const f = pos - i;
  const a = hexToRgb(colors[i]!);
  const b = hexToRgb(colors[i + 1]!);
  const mix = (x: number, y: number) => Math.round(x + (y - x) * f);
  return `rgb(${mix(a[0], b[0])}, ${mix(a[1], b[1])}, ${mix(a[2], b[2])})`;
}

/**
 * Bezel gauge preview: a gradient arc along the system label curve with an
 * indicator dot at the current value and optional end numbers, emulating a
 * `Gauge` in the corner's `.widgetLabel`. Segmented strokes approximate the
 * gradient (SVG cannot run a linearGradient along an arc).
 */
/** End-number typography, measured 2026-08-30: caps ~7.75 pt on the gauge
 * circle, so ~11 pt semibold, curved along the same arc. */
const GAUGE_LABEL_FONT = 11;

function cornerGaugeSvg(g: ResolvedBezelGauge, s: number, uid: string): TemplateResult {
  const { dial } = cornerContext(s, true);
  const r = GAUGE_R * s;
  // Measured with labels on: the colored arc retreats from each end by about
  // the label's angular width minus ~1.8 degrees (so "0" barely moves the
  // start while "100" pulls the end from -30.5 to -38.2), and the numbers sit
  // just past the arc ends on the same circle.
  const degPerPt = 180 / (Math.PI * GAUGE_R);
  const wMin = g.minLabel !== undefined ? estimateTextWidth(g.minLabel, GAUGE_LABEL_FONT) * degPerPt : 0;
  const wMax = g.maxLabel !== undefined ? estimateTextWidth(g.maxLabel, GAUGE_LABEL_FONT) * degPerPt : 0;
  const a0 = GAUGE_ARC.start + (wMin > 0 ? Math.max(0, wMin - 1.8) : 0);
  const a1 = GAUGE_ARC.end - (wMax > 0 ? Math.max(0, wMax - 1.8) : 0);
  const span = a1 - a0;
  const segs = 24;
  const parts: TemplateResult[] = [];
  for (let i = 0; i < segs; i++) {
    const b0 = a0 + (span * i) / segs;
    const b1 = Math.min(a1, a0 + (span * (i + 1)) / segs + 0.4);
    parts.push(svg`<path d=${arcPathD(dial, r, b0, b1)} fill="none"
      stroke=${gaugeColorAt(g.colorHexes, (i + 0.5) / segs)} stroke-width=${GAUGE_W * s}
      stroke-linecap=${i === 0 || i === segs - 1 ? "round" : "butt"} />`);
  }
  const frac = (g.value - g.minValue) / (g.maxValue - g.minValue);
  const dot = arcPointXY(dial, r, a0 + span * frac);
  const gap = 1.5;
  const curvedLabel = (id: string, from: number, to: number, text: string) => svg`
    <defs><path id=${id} d=${arcPathD(dial, r, from, to)} /></defs>
    <text font-size=${GAUGE_LABEL_FONT * s} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
      <textPath href="#${id}" startOffset="50%" text-anchor="middle">${text}</textPath></text>`;
  return svg`${parts}
    <circle cx=${dot.x} cy=${dot.y} r=${3.2 * s} fill=${gaugeColorAt(g.colorHexes, frac)}
      stroke="#000000" stroke-width=${1.2 * s} />
    ${g.minLabel !== undefined ? curvedLabel(`${uid}-gmin`, a0 - gap - Math.max(wMin, 3), a0 - gap, g.minLabel) : nothing}
    ${g.maxLabel !== undefined ? curvedLabel(`${uid}-gmax`, a1 + gap, a1 + gap + Math.max(wMax, 3), g.maxLabel) : nothing}`;
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
    // Watch-corner context preview: black screen quadrant, the content disc
    // where the real face puts it, and the bezel label on the system's curve.
    // The widget always draws into a 34 pt square, but watchOS masks the
    // composite to a circle and, when a bezel label is present, scales it
    // down to make room for the curved text, so the design box gets an extra
    // uniform scale here. interact.ts drags stay correct because panel.ts
    // passes the tile side as the gesture canvas for corner.
    const s = fit.scale; // corner slots are square, so fit.x = fit.y = 0
    const hasBezel = !!layout.bezelText || !!layout.bezelGauge;
    const curved = layout.curvedText ?? "";
    const curvedMode = curved !== "";
    const ctx = cornerContext(s, hasBezel);
    const tile = cornerTileSide(s, hasBezel);
    const tileScale = tile / (design.width * s);
    const slotX = ctx.tile.cx - tile / 2;
    const slotY = ctx.tile.cy - tile / 2;
    const shell = `M 0 0 H ${ctx.quad.width - ctx.cornerRadius} A ${ctx.cornerRadius} ${ctx.cornerRadius} 0 0 1 ${ctx.quad.width} ${ctx.cornerRadius} V ${ctx.quad.height} H 0 Z`;
    let bezel: TemplateResult | typeof nothing = nothing;
    if (layout.bezelGauge) {
      bezel = cornerGaugeSvg(layout.bezelGauge, s, uid);
    } else if (layout.bezelText) {
      const arc = cornerLabelArc(s, `${uid}-bezel`);
      const bezelStr = layout.bezelCountdownEnd !== undefined && layout.bezelCountdownEnd > Date.now()
        ? countdownRemainingString((layout.bezelCountdownEnd - Date.now()) / 1000)
        : layout.bezelText;
      bezel = svg`<defs><path id=${arc.id} d=${arc.d} /></defs>
        <text font-size=${BEZEL_FONT * s} font-weight="600" fill="#FFFFFF" font-family="-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${arc.id}" startOffset="50%" text-anchor="middle">${bezelDisplayText(bezelStr, arc.length, BEZEL_FONT * s)}</textPath></text>`;
    }
    // Curved main text replaces the canvas disc entirely (the system curves a
    // single Text along the corner; there is no disc in that mode).
    let main: TemplateResult | typeof nothing = nothing;
    if (curvedMode) {
      const curvedColor = parseColor(layout.curvedColorHex ?? "#FFFFFF") ?? { color: "#FFFFFF", opacity: 1 };
      const arc = cornerArc(s, `${uid}-curved`, CURVED_BASELINE_R * s, CURVED_ARC);
      // The 0.88 narrows the glyph-width model only (not the drawn size): SF
      // tracks tighter at ~18.5 pt than at the 10.5 pt the widths were tuned
      // for, and without it the preview truncates one glyph earlier than the
      // watch ("TEXT…" where the wrist shows "TEXT 1…").
      main = svg`<defs><path id=${arc.id} d=${arc.d} /></defs>
        <text font-size=${CURVED_FONT * s} font-weight="600" fill=${curvedColor.color} fill-opacity=${curvedColor.opacity}
          font-family="-apple-system, 'SF Pro Rounded', 'SF Pro Text', Helvetica, Arial, sans-serif">
          <textPath href="#${arc.id}" startOffset="50%" text-anchor="middle">${bezelDisplayText(curved, arc.length, CURVED_FONT * s * 0.88)}</textPath></text>`;
    } else {
      const tileBW = layout.borderWidth * fit.scale * tileScale;
      // The watch strokes the border as a circle ring (the shape the system
      // mask leaves visible), inscribed in the slot square.
      const chrome = border
        ? svg`<circle cx=${tile / 2} cy=${tile / 2} r=${tile / 2 - tileBW / 2} fill="none" stroke=${border.color} stroke-opacity=${border.opacity} stroke-width=${tileBW} />`
        : nothing;
      main = svg`<g transform="translate(${slotX} ${slotY})">
        <g clip-path=${`url(#${uid})`}>
          ${bg ? svg`<rect width=${tile} height=${tile} fill=${bg.color} fill-opacity=${bg.opacity} />` : nothing}
          <g data-design-box transform="scale(${fit.scale * tileScale})">
            ${layout.elements.map((el) => renderElement(el, design, options))}
          </g>
        </g>
        <circle cx=${tile / 2} cy=${tile / 2} r=${tile / 2} fill="none"
          stroke="rgba(255,255,255,0.22)" stroke-width=${0.75 * s} stroke-dasharray=${`${2 * s} ${2 * s}`} />
        ${chrome}
      </g>`;
    }
    return svg`<svg viewBox=${`0 0 ${ctx.quad.width} ${ctx.quad.height}`} xmlns="http://www.w3.org/2000/svg" class="complication corner"
        width=${ctx.quad.width} height=${ctx.quad.height}>
      <defs><clipPath id=${uid}><circle cx=${tile / 2} cy=${tile / 2} r=${tile / 2} /></clipPath></defs>
      <path d=${shell} fill="#000000" />
      ${bezel}
      ${main}
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

export interface ThumbOptions {
  icons: IconProvider;
  imageSizes?: ImageSizeProvider;
  /** CSS size of the thumbnail box. The crop takes this aspect ratio. */
  width: number;
  height: number;
}

/** Padding around the cropped layers, as a share of the crop's longer side. */
const THUMB_PAD = 0.14;

/**
 * Where a layer's ink is, in design-box points. Most kinds fill their frame.
 * Text is drawn centred in a frame that is usually much wider than the
 * words, so a crop to the frame would leave "1 open" as a speck; this narrows
 * the box to the words themselves, using the same width model the renderer
 * shrinks with, so the thumbnail shows the words big.
 */
function inkBox(el: ResolvedElement, canvas: CanvasSize): Box {
  const b = frameBox(el, canvas);
  if (el.kind !== "text" || el.text === "") return b;
  const w = Math.min(b.w, Math.max(el.fontSize, el.text.length * el.fontSize * 0.55));
  const h = Math.min(b.h, el.fontSize * 1.3);
  return { x: b.cx - w / 2, y: b.cy - h / 2, w, h, cx: b.cx, cy: b.cy };
}

/**
 * The crop a layer thumbnail shows, in design-box points: the union of the
 * layers' frames, padded, then widened or heightened to the thumbnail's own
 * aspect ratio so the picture never squashes. Empty `ids` mean the whole
 * canvas, which is what the background row shows.
 */
export function thumbCrop(layout: ResolvedLayout, ids: readonly string[], aspect: number): { x: number; y: number; w: number; h: number } {
  const family = (layout.family in CANVAS ? layout.family : "rectangular") as DrawableFamily;
  const design = CANVAS[family];
  const picked = layout.elements.filter((el) => ids.includes(el.id));
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const el of picked) {
    const b = inkBox(el, design);
    // A rotated layer sweeps a bigger box; take its bounding circle's box so
    // no corner of it falls outside the crop.
    const r = el.frame.rotationDegrees % 180 === 0 ? 0 : Math.hypot(b.w, b.h) / 2;
    x0 = Math.min(x0, r ? b.cx - r : b.x);
    y0 = Math.min(y0, r ? b.cy - r : b.y);
    x1 = Math.max(x1, r ? b.cx + r : b.x + b.w);
    y1 = Math.max(y1, r ? b.cy + r : b.y + b.h);
  }
  let w = x1 - x0;
  let h = y1 - y0;
  if (picked.length === 0 || !(w > 0) || !(h > 0)) {
    x0 = 0; y0 = 0; w = design.width; h = design.height;
  } else {
    const pad = Math.max(2, Math.max(w, h) * THUMB_PAD);
    x0 -= pad; y0 -= pad; w += 2 * pad; h += 2 * pad;
  }
  // Grow the short side to the thumbnail's aspect, keeping the centre.
  if (w / h < aspect) {
    const nw = h * aspect;
    x0 -= (nw - w) / 2;
    w = nw;
  } else {
    const nh = w / aspect;
    y0 -= (nh - h) / 2;
    h = nh;
  }
  return { x: x0, y: y0, w, h };
}

/**
 * One layer, or a group's layers, drawn alone the way a painting app's layer
 * list shows each layer's own pixels. Cropped to the layers with a little
 * room, so a 10 pt icon reads as an icon rather than a dot, on the black face
 * and the shape's own background. Hidden layers draw dimmed, like the big
 * preview. Empty `ids` draw just the canvas: background and border.
 */
export function renderLayerThumb(layout: ResolvedLayout, ids: readonly string[], options: ThumbOptions): TemplateResult {
  const family = (layout.family in CANVAS ? layout.family : "rectangular") as DrawableFamily;
  const design = CANVAS[family];
  const crop = thumbCrop(layout, ids, options.width / options.height);
  const bg = parseColor(layout.backgroundColorHex);
  const border = parseColor(layout.borderColorHex);
  const bw = layout.borderWidth;
  const render: RenderOptions = { icons: options.icons, showHidden: true, tapAreas: true, ...(options.imageSizes ? { imageSizes: options.imageSizes } : {}) };
  const picked = layout.elements.filter((el) => ids.includes(el.id));
  const chrome = border && bw > 0
    ? (family === "rectangular"
      ? svg`<rect x=${bw / 2} y=${bw / 2} width=${design.width - bw} height=${design.height - bw} fill="none" stroke=${border.color} stroke-opacity=${border.opacity} stroke-width=${bw} />`
      : svg`<circle cx=${design.width / 2} cy=${design.height / 2} r=${design.width / 2 - bw / 2} fill="none" stroke=${border.color} stroke-opacity=${border.opacity} stroke-width=${bw} />`)
    : nothing;
  const face = family === "rectangular"
    ? svg`<rect width=${design.width} height=${design.height} fill=${bg ? bg.color : "#000000"} fill-opacity=${bg ? bg.opacity : 1} />`
    : svg`<circle cx=${design.width / 2} cy=${design.height / 2} r=${design.width / 2} fill=${bg ? bg.color : "#000000"} fill-opacity=${bg ? bg.opacity : 1} />`;
  return svg`<svg viewBox=${`${crop.x} ${crop.y} ${crop.w} ${crop.h}`} xmlns="http://www.w3.org/2000/svg" class="thumb ${family}"
      width=${options.width} height=${options.height} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect x=${crop.x} y=${crop.y} width=${crop.w} height=${crop.h} fill="#000000" />
    ${face}
    ${picked.map((el) => renderElement(el, design, render))}
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
