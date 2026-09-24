// SVG renderer for a resolved layout. Draws at canonical watch point sizes
// (docs/custom_complication_schema_v4.md §4.4 and §9) and lets CSS scale the
// result; every absolute size (font, stroke, radius) is in watch points so a
// 160x62 rectangle scaled 2x looks like the native editor.

import { svg, nothing, type TemplateResult } from "lit";
import { gridFor, type GuideLine } from "./interact.js";
import {
  DESIGN_BOX,
  TIMELINE_MAX_LABEL_SIZE,
  TIMELINE_MIN_LABEL_SIZE,
  describeTapAction,
  imageTimeTextSize,
  parseViewBox,
  HOME_FAMILIES,
  type DrawableFamily,
  type FamilyKind,
  type HomeFamily,
  type WatchCanvasFamily,
  type ImageContentMode,
  type ImageSource,
  type ChartAnchor,
  type ChartAnchorPoint,
  type LayerShadow,
  type NormalizedFrame,
  type Fill,
  type LevelDirection,
  fillColorAt,
  gaugeLabelText,
} from "./model.js";
import type { ImageSizeProvider } from "./image-sizes.js";
import type { GestureTarget } from "./interact.js";
import {
  countdownRemainingString,
  type ResolvedBezelGauge,
  type ResolvedElement,
  type ResolvedLayout,
  type ResolvedLevel,
  type ResolvedTextPart,
  type TextSpan,
  type TimelineLabel,
  type Box,
  type CanvasSize,
  frameBox,
  chartGeometry,
  chartLegs,
  chartRuns,
  chartGridYs,
  type ChartLeg,
  type ResolvedChart,
  timeLabelRowSplit,
} from "./resolver.js";

export type { CanvasSize } from "./resolver.js";

// The design box: the real WidgetKit slot on a 46 mm watch, measured 2026-08-30
// (app repo docs/custom_complication_design_box.md), and the real iPhone Home
// Screen tile, measured on an iPhone 15 Pro running iOS 26.6 with margins
// disabled. Every watch draws a uniformly scaled copy of the watch boxes. It
// lives in model.ts because growing a tap area needs it too, and one copy
// cannot drift from the other.
export const CANVAS: Record<DrawableFamily, CanvasSize> = DESIGN_BOX;

export type { DrawableFamily, WatchCanvasFamily, HomeFamily } from "./model.js";

/** The system's continuous corner on an iPhone Home Screen tile, in design-box
 * points. One radius for every tile size, since it belongs to the device and
 * not the widget. Preview chrome only: nothing about it is on the wire. */
export const HOME_TILE_CORNER_RADIUS = 26.5;

/** Whether this shape is one of the four iPhone Home Screen tiles. The same
 * answer as `layouts.isHomeFamily`, kept here so the renderer needs nothing
 * from the shape helpers. */
function isHomeTile(family: FamilyKind): family is HomeFamily {
  return (HOME_FAMILIES as FamilyKind[]).includes(family);
}

/** A watch case the panel can preview as. Slots in points, from the design-box doc. */
export interface WatchCase {
  label: string;
  /** Screen size in points, as WKInterfaceDevice reports it. */
  screen: CanvasSize;
  slots: Record<WatchCanvasFamily, CanvasSize>;
  /** Only the 46 mm row was read off a real watch; the rest are scaled by screen width. */
  measured: boolean;
}

/** The seven slots an iPhone can put a complication in: the three lock screen
 * shapes and the four Home Screen tiles. */
export type PhoneSlotFamily = "rectangular" | "circular" | "inline" | HomeFamily;

/** An iPhone the panel can preview as. Same idea as `WatchCase`: slot sizes in
 * points, and a flag saying whether they came off a real phone. */
export interface PhoneCase {
  label: string;
  /** Screen size in points, as UIScreen reports it. */
  screen: CanvasSize;
  slots: Record<PhoneSlotFamily, CanvasSize>;
  /** Only the iPhone 15 Pro row was read off a real phone; the rest are
   * estimated from Apple's published widget sizes. */
  measured: boolean;
}

/** The measured 46 mm slots, which are the watch design boxes themselves. Spelled
 * out rather than passed as `CANVAS`, so a watch case carries the three watch
 * shapes and nothing else now that `CANVAS` also holds the phone's tiles. */
const WATCH_46MM_SLOTS: Record<WatchCanvasFamily, CanvasSize> = {
  rectangular: CANVAS.rectangular,
  circular: CANVAS.circular,
  corner: CANVAS.corner,
};

export const CASES: WatchCase[] = [
  { label: "40 mm", screen: { width: 162, height: 197 }, slots: { rectangular: { width: 141, height: 51 }, circular: { width: 40, height: 40 }, corner: { width: 26, height: 26 } }, measured: false },
  { label: "41 mm", screen: { width: 176, height: 215 }, slots: { rectangular: { width: 153, height: 55.5 }, circular: { width: 43, height: 43 }, corner: { width: 29, height: 29 } }, measured: false },
  { label: "42 mm", screen: { width: 187, height: 223 }, slots: { rectangular: { width: 163, height: 59 }, circular: { width: 46, height: 46 }, corner: { width: 31, height: 31 } }, measured: false },
  { label: "44 mm", screen: { width: 184, height: 224 }, slots: { rectangular: { width: 160, height: 58 }, circular: { width: 45, height: 45 }, corner: { width: 30, height: 30 } }, measured: false },
  { label: "45 mm", screen: { width: 198, height: 242 }, slots: { rectangular: { width: 172, height: 62.5 }, circular: { width: 48.5, height: 48.5 }, corner: { width: 32, height: 32 } }, measured: false },
  { label: "46 mm", screen: { width: 208, height: 248 }, slots: WATCH_46MM_SLOTS, measured: true },
  { label: "49 mm", screen: { width: 205, height: 251 }, slots: { rectangular: { width: 178.5, height: 64.5 }, circular: { width: 50, height: 50 }, corner: { width: 33.5, height: 33.5 } }, measured: false },
];

export const REFERENCE_CASE = CASES.find((c) => c.measured)!;

/** The iPhone 15 Pro's own Home Screen tiles, measured 2026-09-14 on iOS 26.6
 * with margins disabled, and the lock screen circular slot measured at the
 * same time. `xlarge` is the placeholder box (see `DESIGN_BOX`).
 *
 * The lock screen rectangular slot was estimated from the watch's shapes at
 * 160 × 72 until 2026-09-21, which made the stage a good deal taller than the
 * real widget and cut the preview short of what the phone really crops. It is
 * now the app's own reading, 147.67 × 58, taken off Jesse's iPhone 15 Pro from
 * the widget's `GeometryReader` (`CustomComplicationSlotProbe`, Debug builds,
 * in the App Group defaults). Note the height equals the circular slot exactly:
 * both shapes sit in one Lock Screen row, so they share it.
 *
 * Inline is still estimated. It has no canvas, so the probe never sees it. */
const IPHONE_15_PRO_SLOTS: Record<PhoneSlotFamily, CanvasSize> = {
  rectangular: { width: 147.67, height: 58 },
  circular: { width: 58, height: 58 },
  inline: { width: 240, height: 20 },
  small: CANVAS.small,
  medium: CANVAS.medium,
  large: CANVAS.large,
  xlarge: CANVAS.xlarge,
};

/** An iPhone the panel can preview as. Only the iPhone 15 Pro row was read off
 * a real phone; every other row is scaled from Apple's published widget sizes
 * for that screen and is labelled "(estimated)", exactly like the watch cases.
 *
 * Apple's published table runs 5 to 7 points small against the real iOS 26
 * tile, so an estimated row is a guide to proportion, not a measurement.
 *
 * The estimated lock screen rectangles are the one exception to "scaled from
 * Apple's table": they are built from this file's own two measurements. The
 * height is that phone's circular slot, because the real phone reads the two
 * as one number, and the width is that height times the measured 147.67 / 58.
 * Apple publishes no lock screen sizes to scale from, and the table's Home
 * Screen numbers say nothing about a row the phone lays out on its own. */
export const PHONE_CASES: PhoneCase[] = [
  { label: "iPhone SE", screen: { width: 375, height: 667 }, slots: { rectangular: { width: 142.58, height: 56 }, circular: { width: 56, height: 56 }, inline: { width: 230, height: 19 }, small: { width: 148.33, height: 148.33 }, medium: { width: 321.67, height: 148.33 }, large: { width: 321.67, height: 324 }, xlarge: { width: 321.67, height: 499.67 } }, measured: false },
  { label: "iPhone 13 mini", screen: { width: 375, height: 812 }, slots: { rectangular: { width: 142.58, height: 56 }, circular: { width: 56, height: 56 }, inline: { width: 230, height: 19 }, small: { width: 155.33, height: 155.33 }, medium: { width: 329, height: 155.33 }, large: { width: 329, height: 345 }, xlarge: { width: 329, height: 534.67 } }, measured: false },
  { label: "iPhone 15 Pro", screen: { width: 393, height: 852 }, slots: IPHONE_15_PRO_SLOTS, measured: true },
  { label: "iPhone 15 Pro Max", screen: { width: 430, height: 932 }, slots: { rectangular: { width: 157.85, height: 62 }, circular: { width: 62, height: 62 }, inline: { width: 258, height: 21 }, small: { width: 170, height: 170 }, medium: { width: 364.33, height: 170 }, large: { width: 364.33, height: 382 }, xlarge: { width: 364.33, height: 592 } }, measured: false },
  { label: "iPhone 17 Pro Max", screen: { width: 440, height: 956 }, slots: { rectangular: { width: 160.4, height: 63 }, circular: { width: 63, height: 63 }, inline: { width: 264, height: 21 }, small: { width: 174, height: 174 }, medium: { width: 373, height: 174 }, large: { width: 373, height: 391 }, xlarge: { width: 373, height: 606 } }, measured: false },
];

export const REFERENCE_PHONE = PHONE_CASES.find((c) => c.measured)!;

/** A device the panel can preview as, whichever kind it is. The panel picks
 * the list by the owner's kind and holds one of these. */
export type PreviewCase = WatchCase | PhoneCase;

/** The real slot this device draws the shape in. A watch case carries the
 * three watch shapes and nothing else, so a Home Screen tile asked of a watch
 * falls back to its own design box rather than throwing: the panel never
 * offers a watch owner one, and a stray document is drawn at its box. */
export function slotFor(previewCase: PreviewCase, family: DrawableFamily): CanvasSize {
  const slots: Partial<Record<DrawableFamily, CanvasSize>> = previewCase.slots;
  return slots[family] ?? CANVAS[family];
}

/** The phone case matching a `screen_size` string ("393x852", points). The
 * phone does not report one yet, so this answers undefined for every owner
 * today and callers fall back to `REFERENCE_PHONE`. */
export function phoneCaseForScreenSize(screenSize: string | null | undefined): PhoneCase | undefined {
  if (!screenSize) return undefined;
  const match = /^(\d+)x(\d+)$/.exec(screenSize.trim());
  if (!match) return undefined;
  const width = Number(match[1]);
  const height = Number(match[2]);
  return PHONE_CASES.find((c) => c.screen.width === width && c.screen.height === height);
}

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
  /**
   * Every Material Design icon name this provider carries, prefix included
   * (`mdi:flash`), or `undefined` while the catalogue is still loading. Absent
   * on a provider that has no MDI at all, so call sites go through `?.()`.
   * Asking is what starts the load: the MDI file is big and only the picker's
   * MDI tab needs it.
   */
  mdiNames?(): string[] | undefined;
  /** The SVG `d` of one MDI name, or undefined when it is unknown or the
   * catalogue has not arrived yet. This is what the editor writes onto a layer. */
  mdiPath?(name: string): string | undefined;
}

export interface RenderOptions {
  icons: IconProvider;
  /** Smallest dot radius and grid stroke to draw, in design points. A layer
   * thumbnail shrinks a 181 pt chart into a few dozen pixels, where a real dot or
   * hairline vanishes and the row looks empty. */
  minDotRadius?: number;
  minGridStroke?: number;
  /** Editor affordance: hidden layers at 35% instead of invisible. */
  showHidden?: boolean;
  /** Element id to outline. */
  highlightId?: string;
  /** More elements to outline, without handles: the members of a selected
   * group. The group's own box carries the handles (`groupBox`). */
  highlightIds?: readonly string[];
  /** Editor affordance: the layer the pick-mode pointer is over, filled and
   * outlined the way a browser inspector shades the node under the cursor. */
  hoverId?: string;
  /** More layers to tint the same way: the members of a group row the pointer
   * rests on in the Layers list. */
  hoverIds?: readonly string[];
  /**
   * Dim everything except these layers, and ring each of them in the panel's
   * accent. The Share and gallery dialogs use it to show where an entity or a
   * name is used. The holes sit on the same outline box the selection and the
   * hit box use, turned the way the layer is, so they match what is drawn.
   */
  spotlightIds?: readonly string[];
  /**
   * Review mode for the whole complication's own tap: the parts of the face
   * where a tap runs it (everything outside every layer's tap zone) are washed
   * pink, and the tap zones are left as holes. Only read with `tapReview`.
   */
  groundTap?: boolean;
  /** Ring the whole face in the selection color: the Background row is
   * selected (or under the pointer), and the background is the whole face. */
  highlightSlot?: boolean;
  /** Draw resize handles on the highlighted element (active family only). */
  handles?: boolean;
  /**
   * A selected group's box, around every layer it moves: drawn with eight
   * handles in place of a layer's four. Its corners scale the group as one,
   * and its sides stretch it. Only read with `handles`.
   */
  groupBox?: NormalizedFrame;
  /** A square, canvas units, of invisible grab area centred on each handle,
   * for a finger. Without it only the drawn 3pt handle can be grabbed. */
  handleHit?: number;
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
  /** Natural sizes of the camera pictures, so a layer can be cropped the way
   * the watch crops it. Absent falls back to the browser's own fitting. */
  imageSizes?: ImageSizeProvider;
  /**
   * The real slot to preview in. Defaults to the design box itself (the 46 mm
   * slot). Any other size draws the design box uniformly scaled and centred,
   * exactly as the watch does.
   */
  slot?: CanvasSize;
  /** Editor affordance: the snap grid's step as a fraction of the face. Draws
   * faint lines over the layers, with the middle lines in the accent color. */
  grid?: number;
  /** Editor affordance: the smart guides the layer being dragged is sitting on
   * right now, drawn across the face and gone again on release. */
  guides?: readonly GuideLine[];
  /**
   * Preview a tinted surface in this color (`#RRGGBB`). Absent draws full
   * color. `tintSurface` says which surface; see `tintGroup` for what each
   * kind of layer turns into.
   */
  tint?: string;
  /**
   * Which tinted surface `tint` is previewing. "watch" (the default) is a
   * tinted watch face: color is dropped and only how see-through each part is
   * survives. "phone" is a tinted iPhone Home Screen, which is WidgetKit's
   * `accented` mode: the tile's own ground goes, and every layer is painted in
   * the tint at the brightness it was drawn in. "lock" is an iPhone Lock
   * Screen, which is `vibrant` mode: the ground stays, and every layer, ground
   * included, is painted in the tint at its own brightness, so a photo reads
   * as gray and a dark fill nearly vanishes. Ignored without `tint`.
   */
  tintSurface?: TintSurface;
  /**
   * Draw a camera or photo picture that has no address as a small drawn
   * landscape instead of the watch's faint glyph box. The gallery uses it,
   * where no real picture is ever drawn and a glyph box reads as broken.
   * People and media keep their glyph.
   */
  pictureScene?: boolean;
  /**
   * Demo mode: the success flash the watch paints once a tap's action lands.
   * Absent draws nothing, which is every other caller.
   */
  flash?: FlashSpec;
}

/**
 * The success flash, as the watch paints it: a stroke, not a wash. The app's
 * `customSuccessFlashIndicator` (app repo
 * `WristAssistant Widgets/CustomComplicationViewHelpers.swift`) rings the whole
 * complication in the flash color, or rings just the tap area that fired when
 * it knows which one it was. Nothing about it is on the wire; the panel plays
 * it so a demo tap looks like a watch tap.
 */
export interface FlashSpec {
  /** `#RRGGBB`. */
  color: string;
  /** The tap layer's frame, in design-box fractions of the whole face. A tap
   * inside a list row is mapped out of its row first, the way the watch's own
   * `tapFrame(layerId:)` does. Absent rings the whole complication. */
  frame?: NormalizedFrame;
}

/** The watch's flash sizes, in slot points, copied from the app's overlays so
 * the demo's line is the weight a wrist sees. */
const FLASH = {
  /** Circular and corner: a ring on the system's own circular mask. */
  circleStroke: 2.5,
  /** Rectangular: square since 2026-09-23, as the app draws it. The system's
   * own slot mask still rounds what the wrist sees. */
  rectRadius: 0,
  rectStroke: 1.5,
  /** The iPhone Home Screen tiles, where a hairline is lost across the tile.
   * Still rounded: the tile's own corner. */
  tileRadius: 22,
  tileStroke: 3,
  /** One tap area's box, square like the tap area itself (since 2026-09-23),
   * for both the tint and the ring. */
  tapRadius: 0,
  tapStroke: 1.5,
  /** Under this on its shorter side, a tap area is tinted as well as ringed,
   * because a hairline round a fingertip-sized box is easy to miss. */
  tapFillBelow: 20,
} as const;

/**
 * The ring around one tap area. `place` maps design-box points into the SVG:
 * the same offset and scale the drawing itself is placed with, so the ring
 * lands exactly on the area that was pressed.
 */
function flashTapRing(frame: NormalizedFrame, color: string, design: CanvasSize, place: { x: number; y: number; scale: number }) {
  const w = Math.max(0, frame.width * design.width * place.scale);
  const h = Math.max(0, frame.height * design.height * place.scale);
  const x = place.x + frame.x * design.width * place.scale;
  const y = place.y + frame.y * design.height * place.scale;
  const sw = FLASH.tapStroke * place.scale;
  const r = FLASH.tapRadius * place.scale;
  const turn = `rotate(${frame.rotationDegrees} ${x + w / 2} ${y + h / 2})`;
  return svg`<g class="wa-flash" pointer-events="none" transform=${turn}>
    ${Math.min(w, h) < FLASH.tapFillBelow * place.scale
      ? svg`<rect x=${x} y=${y} width=${w} height=${h} rx=${r} fill=${color} fill-opacity="0.3" />`
      : nothing}
    <rect x=${x + sw / 2} y=${y + sw / 2} width=${Math.max(0, w - sw)} height=${Math.max(0, h - sw)}
      rx=${Math.max(0, r - sw / 2)} fill="none" stroke=${color} stroke-width=${sw} />
  </g>`;
}

/**
 * The ring around the whole complication, in the shape the system masks that
 * family to. The stroke sits on the edge rather than inside it, the way
 * SwiftUI's `.stroke` does, so the outer half is clipped away exactly as it is
 * on the wrist.
 */
function flashShapeRing(family: DrawableFamily, color: string, canvas: CanvasSize, scale: number) {
  if (family === "circular" || family === "corner") {
    const side = Math.min(canvas.width, canvas.height);
    return svg`<circle class="wa-flash" pointer-events="none" cx=${canvas.width / 2} cy=${canvas.height / 2}
      r=${side / 2} fill="none" stroke=${color} stroke-width=${FLASH.circleStroke * scale} />`;
  }
  const tile = isHomeTile(family);
  return svg`<rect class="wa-flash" pointer-events="none" width=${canvas.width} height=${canvas.height}
    rx=${(tile ? FLASH.tileRadius : FLASH.rectRadius) * scale} fill="none" stroke=${color}
    stroke-width=${(tile ? FLASH.tileStroke : FLASH.rectStroke) * scale} />`;
}

/**
 * Which WidgetKit group a layer kind lands in on a tinted face, as the app's
 * views mark them (app repo `Shared/CustomComplicationViews.swift`). A tinted
 * face keeps only each pixel's alpha and repaints it:
 *
 * - `accent`: views marked `.widgetAccentable()` (shapes, icons, gauges, charts,
 *   timelines and their parts) take the face's tint color.
 * - `plain`: everything else (text, a picture's time chip, the background and
 *   border) is the default group, drawn in white.
 * - `picture`: a camera picture uses `.accentedDesaturated`, so its brightness
 *   becomes alpha in the tint color.
 *
 * Color is dropped either way, so an opaque black fill is as bright as white.
 *
 * A tinted iPhone Home Screen works the other way round and has its own two
 * groups. There the system keeps each pixel's brightness rather than its alpha,
 * so a black fill goes and a white one stays, and paints the default group
 * (`phonePrimary`) and the accentable group (`phoneAccent`) in two related
 * colors. Which group a layer lands in is the document's `accentGroup`, plus
 * the kinds the app already marks accentable for the watch.
 */
export type TintGroup = "accent" | "plain" | "picture" | "phoneAccent" | "phonePrimary" | "lock";

/** The surfaces a tinted preview can stand for. See `RenderOptions.tintSurface`. */
export type TintSurface = "watch" | "phone" | "lock";

/** The groups a surface draws with, which is the set of filters it needs. */
const TINT_GROUPS: Record<TintSurface, readonly TintGroup[]> = {
  watch: ["accent", "plain", "picture"],
  phone: ["phonePrimary", "phoneAccent"],
  lock: ["lock"],
};

/** Tints to preview with, a spread of the colors watch faces offer. */
export const FACE_TINTS: readonly { label: string; hex: string }[] = [
  { label: "Orange", hex: "#FF9F0A" },
  { label: "Red", hex: "#FF453A" },
  { label: "Green", hex: "#30D158" },
  { label: "Blue", hex: "#0A84FF" },
  { label: "Purple", hex: "#BF5AF2" },
  { label: "White", hex: "#FFFFFF" },
];

export function tintGroup(kind: ResolvedElement["kind"], surface: TintSurface = "watch", accented = false): TintGroup {
  const watchAccent = kind !== "text" && kind !== "imageTime" && kind !== "tap" && kind !== "image";
  // The Lock Screen draws every layer the same way, accent or not.
  if (surface === "lock") return "lock";
  if (surface === "phone") {
    // The app's `.widgetAccentable()` calls are not platform-gated, so the kinds
    // that are accentable on a watch face are accentable on a Home Screen too.
    // The document's own `accentGroup` only ever adds to that set.
    return accented || watchAccent ? "phoneAccent" : "phonePrimary";
  }
  if (watchAccent || accented) return "accent";
  return kind === "image" ? "picture" : "plain";
}

/**
 * The accent group's color on a tinted Home Screen, for a tint of `#RRGGBB`.
 *
 * The system derives two related colors from the one the user picked and paints
 * a group in each. The lighter of the two goes to the accentable group, which is
 * what a layer is put there for, so the preview lifts the tint halfway to white.
 * Nothing on the wire depends on the exact figure: it is the preview's stand-in
 * for a color only the device can mix.
 */
export function accentTint(tintHex: string): string {
  const c = parseColor(tintHex) ?? { color: "#FFFFFF", opacity: 1 };
  const lift = (i: number) => {
    const v = parseInt(c.color.slice(1 + i * 2, 3 + i * 2), 16);
    return Math.round(v + (255 - v) * 0.5).toString(16).padStart(2, "0").toUpperCase();
  };
  return `#${lift(0)}${lift(1)}${lift(2)}`;
}

/** The `feColorMatrix` values that repaint a group, for a tint of `#RRGGBB`. */
export function tintMatrix(group: TintGroup, tintHex: string): string {
  const hex = group === "phoneAccent" ? accentTint(tintHex) : tintHex;
  const c = parseColor(hex) ?? { color: "#FFFFFF", opacity: 1 };
  const ch = (i: number) => (parseInt(c.color.slice(1 + i * 2, 3 + i * 2), 16) / 255).toFixed(4);
  const [r, g, b] = group === "plain" ? ["1", "1", "1"] : [ch(0), ch(1), ch(2)];
  // A picture, the whole Home Screen and the whole Lock Screen keep brightness,
  // not alpha: a dark fill goes and a bright one stays, which is what
  // `accented` and `vibrant` modes do to a widget.
  const keepsBrightness = group === "picture" || group === "phoneAccent" || group === "phonePrimary" || group === "lock";
  const alpha = keepsBrightness ? "0.2126 0.7152 0.0722 0 0" : "0 0 0 1 0";
  return `0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} ${alpha}`;
}

/**
 * A filter's region, in user space: a square the size of the largest side the
 * drawing has, with an eighth of that spare on every edge.
 *
 * It is set in user space because the default bounding-box region is empty for
 * a flat line and would hide it. It is kept this small because WebKit renders a
 * filter into a buffer of limited size and shrinks the resolution to make a big
 * region fit. The old region of 20000 points came out at a few pixels across on
 * an iPhone, so every tinted preview, which is every Lock Screen preview, was a
 * blur. Nothing is drawn past the region anyway: the body is clipped to the slot.
 */
function filterRegion(extent: number): { x: number; y: number; size: number } {
  const side = Math.max(1, extent);
  const pad = side / 8;
  return { x: -pad, y: -pad, size: side + 2 * pad };
}

/** One filter per group the surface uses, over `extent` points (see
 * `filterRegion`). A brightness group is composited back through what it came
 * from, so a layer that was already see-through stays see-through. */
function tintDefs(prefix: string, tintHex: string, surface: TintSurface, extent: number): TemplateResult {
  const r = filterRegion(extent);
  return svg`${TINT_GROUPS[surface].map((g) => svg`<filter id=${`${prefix}-${g}`} filterUnits="userSpaceOnUse" x=${r.x} y=${r.y} width=${r.size} height=${r.size}
    color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=${tintMatrix(g, tintHex)} />${
      surface !== "watch" ? svg`<feComposite in2="SourceGraphic" operator="in" />` : nothing}</filter>`)}`;
}

/** Wraps a drawing in its tint filter, or returns it untouched in full color. */
function tinted<T>(body: T, group: TintGroup, prefix: string | undefined): T | TemplateResult {
  return prefix === undefined ? body : svg`<g filter=${`url(#${prefix}-${group})`}>${body}</g>`;
}

/**
 * A layer's drop shadow, as an `feDropShadow` filter wrapped around what the
 * layer draws.
 *
 * The filter sits inside the layer's group and around the drawing only, so the
 * selection outline, the hover tint and the hit box never pick it up. It also
 * sits inside the tint filter, which is what makes a shadow flatten on a tinted
 * face the way the watch flattens it: watchOS keeps only alpha, and a blurred
 * alpha is a soft edge in the face's tint.
 *
 * The region covers the design box, for the reasons `filterRegion` gives.
 */
let shadowSeq = 0;

function shadowed<T>(body: T, id: string, shadow: LayerShadow | undefined, extent: number): T | TemplateResult {
  if (shadow === undefined) return body;
  const c = parseColor(shadow.colorHex) ?? { color: "#000000", opacity: 1 };
  // SVG blurs by standard deviation; SwiftUI's radius is roughly twice that, so
  // halving it is what makes the preview read like the watch.
  const deviation = Math.max(0, shadow.radius) / 2;
  const r = filterRegion(extent);
  return svg`<filter id=${id} filterUnits="userSpaceOnUse" x=${r.x} y=${r.y} width=${r.size} height=${r.size}
      color-interpolation-filters="sRGB">
      <feDropShadow dx=${shadow.dx} dy=${shadow.dy} stdDeviation=${deviation}
        flood-color=${c.color} flood-opacity=${c.opacity} /></filter>
    <g filter=${`url(#${id})`}>${body}</g>`;
}

/**
 * The snap grid, in design points, over everything the layers draw. Lines are
 * hairlines at any zoom and take no pointer events, so a drag still reaches the
 * layer under them.
 */
function gridLines(design: CanvasSize, step: number | undefined): TemplateResult | typeof nothing {
  if (step === undefined || !(step > 0)) return nothing;
  // Square cells, counted out from the middle: the same spacing gesture
  // snapping uses (interact.ts gridFor), so a line drawn is a line snapped to.
  const g = gridFor(step, design);
  const lines: TemplateResult[] = [];
  // A fine grid (1%) would bury the face in lines, so its lines go fainter and
  // every tenth one keeps the usual weight as a guide to count by.
  const fine = step < 0.025;
  const strokeFor = (k: number) => k === 0
    ? "rgba(10,132,255,0.6)"
    : fine && k % 10 !== 0 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.14)";
  const kx = Math.floor(0.5 / g.x + 1e-6);
  for (let k = -kx; k <= kx; k++) {
    const x = (0.5 + k * g.x) * design.width;
    if (x <= 0 || x >= design.width) continue;
    lines.push(svg`<line x1=${x} y1="0" x2=${x} y2=${design.height} stroke=${strokeFor(k)} stroke-width="0.5" vector-effect="non-scaling-stroke" />`);
  }
  const ky = Math.floor(0.5 / g.y + 1e-6);
  for (let k = -ky; k <= ky; k++) {
    const y = (0.5 + k * g.y) * design.height;
    if (y <= 0 || y >= design.height) continue;
    lines.push(svg`<line x1="0" y1=${y} x2=${design.width} y2=${y} stroke=${strokeFor(k)} stroke-width="0.5" vector-effect="non-scaling-stroke" />`);
  }
  return svg`<g class="snap-grid" pointer-events="none">${lines}</g>`;
}

/**
 * The smart guides a drag is sitting on, right across the face. Pink rather
 * than the grid's blue and the selection's accent, so a line that says "this
 * edge meets that one" is never read as a grid line that happens to be there.
 */
function guideOverlay(design: CanvasSize, guides: readonly GuideLine[] | undefined): TemplateResult | typeof nothing {
  if (guides === undefined || guides.length === 0) return nothing;
  const lines = guides.map((g) => g.axis === "x"
    ? svg`<line x1=${g.at * design.width} y1="0" x2=${g.at * design.width} y2=${design.height}
        stroke="#FF375F" stroke-width="1" vector-effect="non-scaling-stroke" />`
    : svg`<line x1="0" y1=${g.at * design.height} x2=${design.width} y2=${g.at * design.height}
        stroke="#FF375F" stroke-width="1" vector-effect="non-scaling-stroke" />`);
  return svg`<g class="smart-guides" pointer-events="none">${lines}</g>`;
}

const FONT_WEIGHT: Record<string, number> = { regular: 400, medium: 500, semibold: 600, bold: 700 };

/**
 * The web font stack that comes closest to each `Font.Design`.
 *
 * Only `default` and `monospaced` have real twins in a browser: San Francisco
 * and SF Mono ship with macOS and iOS. SF Rounded and New York do not, so those
 * two rows are the nearest widely available shapes and the editor labels them a
 * close match rather than pretending otherwise.
 */
const FONT_FAMILY: Record<string, string> = {
  default: "-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  rounded: "'SF Pro Rounded', 'Varela Round', 'Trebuchet MS', -apple-system, 'Helvetica Neue', sans-serif",
  monospaced: "ui-monospace, 'SF Mono', Menlo, Monaco, 'Courier New', monospace",
  serif: "'New York', ui-serif, Georgia, 'Times New Roman', serif",
};

const fontFamilyFor = (design: string | undefined) => FONT_FAMILY[design ?? "default"] ?? FONT_FAMILY.default!;

/** `font-stretch` for each letter width, as CSS percentages. The numbers are the
 * standard widths those names carry in a variable font, which is the nearest a
 * browser gets to the system face's own condensed, compressed and expanded cuts.
 * Standard is left out so a layer that never asked writes no style at all. */
const FONT_STRETCH: Record<string, string> = {
  condensed: "75%",
  compressed: "62.5%",
  expanded: "125%",
};

/** The inline style a drawn run needs: fixed-width digits, a letter width, or
 * neither. `nothing` leaves the attribute off entirely. */
function textStyle(monospacedDigits: boolean, width: string | undefined) {
  const bits: string[] = [];
  if (monospacedDigits) bits.push("font-variant-numeric: tabular-nums");
  const stretch = FONT_STRETCH[width ?? "standard"];
  if (stretch !== undefined) bits.push(`font-stretch: ${stretch}`);
  return bits.length > 0 ? bits.join("; ") : nothing;
}

/**
 * How much bigger than its nominal size a Material Design icon is drawn.
 *
 * An SF Symbol's `size` is a font size and its glyph is drawn larger than that
 * number in every direction; MDI's is the side of a box the glyph sits inside
 * with a margin. Drawing both at the same number leaves MDI visibly the smaller,
 * so the box gets multiplied. Visual calibration, not arithmetic, and pinned to
 * `IconElementView.mdiSizeFactor` in the app.
 */
const MDI_SIZE_FACTOR = 1.15;

/** `#RRGGBB` or `#RRGGBBAA` (leading # optional) to an SVG color + opacity. */
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

/** One gradient's `<stop>` rows, in reading order. */
function fillStops(fill: Fill) {
  return [...fill.stops].sort((a, b) => a.at - b.at).map((s) => {
    const c = parseColor(s.colorHex) ?? { color: "#FFFFFF", opacity: 1 };
    return svg`<stop offset=${Math.max(0, Math.min(1, s.at))} stop-color=${c.color} stop-opacity=${c.opacity} />`;
  });
}

/**
 * A gradient as SVG: the `<defs>` entry to drop into the drawing and the paint
 * that references it.
 *
 * Both are written in bounding-box units, which is the same space SwiftUI's
 * `UnitPoint`s and `EllipticalGradient` work in, so the two sides run identical
 * arithmetic: a linear fill's angle names a direction, 0 running left to right
 * and 90 top to bottom, with the line crossing the box through its centre; a
 * radial fill is the ellipse that fits the box.
 */
function fillPaintDefs(fill: Fill): { defs: TemplateResult; paint: string } {
  const id = `wafill-${nextSvgIdPrefix()}`;
  const stops = fillStops(fill);
  if (fill.kind === "radial") {
    return {
      defs: svg`<radialGradient id=${id} cx="0.5" cy="0.5" r="0.5">${stops}</radialGradient>`,
      paint: `url(#${id})`,
    };
  }
  const radians = ((fill.angle ?? 0) * Math.PI) / 180;
  const dx = Math.cos(radians) / 2;
  const dy = Math.sin(radians) / 2;
  return {
    defs: svg`<linearGradient id=${id} x1=${0.5 - dx} y1=${0.5 - dy} x2=${0.5 + dx} y2=${0.5 + dy}>${stops}</linearGradient>`,
    paint: `url(#${id})`,
  };
}

/**
 * A gradient wrapped around a circular scale, for a ring or an arc gauge.
 *
 * SVG has no angular gradient, so the sweep is drawn as a fan of short arcs,
 * each in the color the fill shows at its own point along the scale. Same
 * trick the corner bezel gauge already uses, and the same look `AngularGradient`
 * gives on the watch.
 */
const GAUGE_GRADIENT_SEGMENTS = 48;

/** The paint attributes for a flat color, or a gradient over the given box. */
function fillOrColor(fill: Fill | undefined, hex: string) {
  if (fill === undefined) {
    const c = colorAttrs(hex, "fill");
    return { defs: nothing as TemplateResult | typeof nothing, fill: c.fill as string, opacity: c["fill-opacity"] as number };
  }
  const { defs, paint } = fillPaintDefs(fill);
  return { defs: defs as TemplateResult | typeof nothing, fill: paint, opacity: 1 };
}

/** Approximate glyph width, in points, at a given font size. The 0.55 em figure
 * is the heuristic the shrink step has always used; every width decision below
 * goes through it so one number governs wrapping, shrinking and truncation. */
const textCharWidth = (size: number) => size * 0.55;

// ── curved text ───────────────────────────────────────────────────────────
//
// Both renderers lay one glyph at a time along the circle rather than handing
// the string to a text-on-a-path primitive, because the reading direction and
// the way up are two settings here (`sweep`'s sign and `inside`), and SVG's
// `textPath` ties them together. `arcGlyphAngles` is the whole placement
// decision and is mirrored glyph for glyph by `CurvedTextLayout.place` in the
// app repo, so a curve drawn in the panel is the curve drawn on the wrist.

export interface ArcGlyphPlacement {
  /** Where the glyph's centre sits, in degrees, 0 at 12 o'clock, clockwise. */
  angle: number;
  /** The turn the glyph itself takes, in degrees clockwise. */
  rotation: number;
}

export interface ArcTextLayout {
  /** Shrink applied to every advance, 0.5 to 1, as `minimumScaleFactor` would. */
  scale: number;
  placements: ArcGlyphPlacement[];
}

/**
 * Where each glyph of a curved line sits.
 *
 * `advances` are the unscaled glyph widths in design points, in reading order,
 * and `spacing` is the extra room between neighbours. The line is centred on
 * `angle` and may spread `sweep` degrees around it; too long for that it shrinks
 * to at most half size, spacing included, and past that it spills over the sweep
 * rather than being cut: a slider that loses letters mid-drag reads as a bug,
 * and the sweep is the space the text may have, not a box it must fit. A glyph
 * sits with its centre on the circle, so `flip` only decides which way up it is:
 * feet toward the centre when false, away from it when true.
 */
export function arcGlyphAngles(
  advances: readonly number[],
  arc: { radius: number; angle: number; sweep: number; spacing: number; flip: boolean },
): ArcTextLayout {
  const empty: ArcTextLayout = { scale: 1, placements: [] };
  const r = arc.radius;
  if (r <= 0 || advances.length === 0) return empty;
  const sweep = arc.sweep;
  if (sweep === 0) return empty;
  const arcLength = (r * Math.abs(sweep) * Math.PI) / 180;
  const total = advances.reduce((a, b) => a + b, 0) + arc.spacing * (advances.length - 1);
  if (total <= 0) return empty;
  const scale = total > arcLength ? Math.max(0.5, arcLength / total) : 1;
  const widths = advances.map((a) => a * scale);
  const gap = arc.spacing * scale;
  const used = total * scale;
  const dir = sweep < 0 ? -1 : 1;
  // Degrees per point on this circle, so an advance becomes a turn.
  const perPoint = 180 / (Math.PI * r);
  let cursor = arc.angle - (dir * used * perPoint) / 2;
  const placements = widths.map((w) => {
    const angle = cursor + (dir * w * perPoint) / 2;
    cursor += dir * (w + gap) * perPoint;
    return { angle, rotation: arc.flip ? angle + 180 : angle };
  });
  return { scale, placements };
}

/** Where an angle lands on the circle, 0 at 12 o'clock and clockwise positive.
 * `+y` is down, as everywhere else here. */
export function arcPoint(cx: number, cy: number, r: number, degrees: number): { x: number; y: number } {
  const rad = (degrees * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

/** One glyph of a curved line: the character, its look, and its advance. */
interface ArcGlyph {
  text: string;
  look: PartLook;
}

/** The layer's text as glyphs, each carrying the look it is drawn in: a part's
 * size, weight and color where the layer draws parts, a span's color where it
 * colors its numbers, and the layer's own look everywhere else. */
function arcGlyphs(el: Extract<ResolvedElement, { kind: "text" }>): ArcGlyph[] {
  const layerLook: PartLook = {
    fontSize: el.fontSize, fontWeight: el.fontWeight, fontDesign: el.fontDesign,
    fontWidth: el.fontWidth, italic: el.italic, colorHex: el.colorHex,
  };
  const drawsParts = el.parts !== undefined && el.parts.map((p) => p.text).join("") === el.text;
  const looks = drawsParts ? partLooks(el.parts!) : undefined;
  const colors = drawsParts ? undefined : spanColors(el.text, el.spans);
  const out: ArcGlyph[] = [];
  let at = 0;
  for (const ch of el.text) {
    const look = looks?.[at] ?? (colors === undefined ? layerLook : { ...layerLook, colorHex: colors[at]! });
    out.push({ text: ch, look });
    at += ch.length;
  }
  return out;
}

/** Where the circle's centre sits: the middle of the text stays `anchor` points
 * from the frame's centre along `angle`, so the centre slides the other way as
 * the radius grows and the radius only bends the text. Mirrors
 * `CurvedTextLayout.centre` in the app repo. */
export function arcCentre(box: { cx: number; cy: number }, arc: { radius: number; angle: number; anchor: number }): { x: number; y: number } {
  const shift = arcPoint(0, 0, arc.anchor - arc.radius, arc.angle);
  return { x: box.cx + shift.x, y: box.cy + shift.y };
}

/** A curved layer's glyphs and where they land, or undefined when it draws
 * straight. The circle is sized by the frame and the text sits on the frame's
 * inscribed circle, so the frame itself is the selection outline: the box you
 * drag is the circle you get. */
function arcTextLayout(el: Extract<ResolvedElement, { kind: "text" }>, box: Box) {
  if (el.arc === undefined || el.text === "") return undefined;
  const glyphs = arcGlyphs(el);
  const advances = glyphs.map((g) => textCharWidth(g.look.fontSize) * g.text.length);
  const layout = arcGlyphAngles(advances, el.arc);
  if (layout.placements.length === 0) return undefined;
  const centre = arcCentre(box, el.arc);
  return { glyphs, layout, cx: centre.x, cy: centre.y, radius: el.arc.radius };
}

/** A curved line, one `<text>` per glyph, each turned to sit on the circle. */
function renderArcText(el: Extract<ResolvedElement, { kind: "text" }>, box: Box) {
  const drawn = arcTextLayout(el, box);
  if (drawn === undefined) return nothing;
  const { glyphs, layout, radius, cx, cy } = drawn;
  return svg`${layout.placements.map((p, i) => {
    const glyph = glyphs[i]!;
    const look = glyph.look;
    const a = colorAttrs(look.colorHex, "fill");
    const at = arcPoint(cx, cy, radius, p.angle);
    return svg`<text x="0" y="0" text-anchor="middle" dominant-baseline="central"
      transform=${`translate(${at.x} ${at.y}) rotate(${p.rotation})`}
      font-family=${fontFamilyFor(look.fontDesign)} font-style=${look.italic ? "italic" : "normal"}
      font-size=${look.fontSize * layout.scale} font-weight=${FONT_WEIGHT[look.fontWeight] ?? 400}
      style=${textStyle(el.monospacedDigits, look.fontWidth)}
      fill=${a.fill} fill-opacity=${a["fill-opacity"]}>${glyph.text}</text>`;
  })}`;
}

/** The anchor and the x a text layer draws from, per alignment. Mirrors the
 * app's `.frame(maxWidth: .infinity, alignment:)`: the box is the width, and
 * the text sits against one of its edges. */
function textAnchor(alignment: "leading" | "center" | "trailing", box: Box): { anchor: string; x: number } {
  switch (alignment) {
    case "leading":  return { anchor: "start", x: box.x };
    case "trailing": return { anchor: "end", x: box.x + box.w };
    default:         return { anchor: "middle", x: box.cx };
  }
}

/**
 * Greedy wrap onto at most `maxLines`, the way SwiftUI breaks lines: fill each
 * line with whole words while they fit, and what is left goes on the last one.
 * Returns a single line when there is no word boundary to break on, so a long
 * unbroken string shrinks instead of splitting mid-word.
 */
function wrapToLines(text: string, budgetChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter((w) => w !== "");
  const limit = Math.max(1, Math.min(maxLines, words.length));
  if (limit < 2) return [text];
  const lines: string[] = [];
  let from = 0;
  for (let n = 0; n < limit - 1; n++) {
    // Leave one word for each line still to come, so no line ends up empty.
    const last = words.length - (limit - 1 - n) - 1;
    let line = words[from]!;
    let taken = from + 1;
    for (let i = from + 1; i <= last; i++) {
      const next = `${line} ${words[i]!}`;
      if (next.length > budgetChars) break;
      line = next;
      taken = i + 1;
    }
    lines.push(line);
    from = taken;
  }
  lines.push(words.slice(from).join(" "));
  return lines;
}

/** Truncate one line with a tail ellipsis when it still overflows the box. */
function truncateToBox(line: string, fontSize: number, boxWidth: number): string {
  if (boxWidth <= 0 || line.length * textCharWidth(fontSize) <= boxWidth) return line;
  const budget = boxWidth - 0.8 * fontSize; // ellipsis width
  const keep = Math.max(1, Math.floor(budget / textCharWidth(fontSize)));
  return `${line.slice(0, keep).replace(/\s+$/, "")}…`;
}

/** The color of each code unit of `text`, from its spans. Undefined when the
 * layer draws in one color, and when the spans no longer spell the text (a
 * countdown the preview has ticked), which then draws in the layer color. */
function spanColors(text: string, spans: readonly TextSpan[] | undefined): string[] | undefined {
  if (!spans || spans.map((s) => s.text).join("") !== text) return undefined;
  const out: string[] = [];
  for (const s of spans) for (let i = 0; i < s.text.length; i++) out.push(s.colorHex);
  return out;
}

/** Where each drawn line starts in `text`. One line is the text itself; more are
 * whole words joined by single spaces, in order, so each starts at the first word
 * the lines above it did not take. A blank line takes no word. */
function lineStarts(text: string, lines: readonly string[]): number[] {
  if (lines.length < 2) return [0];
  const words = [...text.matchAll(/\S+/g)].map((m) => m.index);
  let taken = 0;
  return lines.map((line) => {
    const start = words[taken] ?? text.length;
    taken += line.split(/\s+/).filter((w) => w !== "").length;
    return start;
  });
}

/**
 * Text with line breaks of its own, laid out the way SwiftUI does: every break
 * starts a new line, a line too wide for the box wraps on word boundaries, and
 * at `maxLines` the rest is cut, the last line kept ending in an ellipsis. So a
 * one-line layer shows its first line and "…", which is what the watch draws.
 * `width` measures words joined by single spaces. Undefined when the text has no
 * break, which leaves it to the width-only wrap.
 */
function breakLines(
  text: string,
  maxLines: number,
  boxWidth: number,
  width: (words: readonly RegExpExecArray[]) => number,
): string[] | undefined {
  if (!text.includes("\n")) return undefined;
  const join = (list: readonly RegExpExecArray[]) => list.map((m) => m[0]).join(" ");
  const lines: string[] = [];
  let cut = false;
  let offset = 0;
  for (const para of text.split("\n")) {
    // Indexed into the whole text, which is what `width` looks sizes up by.
    const words = [...para.matchAll(/\S+/g)];
    for (const w of words) w.index += offset;
    offset += para.length + 1;
    if (lines.length === maxLines) {
      if (words.length > 0) cut = true;
      continue;
    }
    let from = 0;
    // The last line allowed keeps whatever is left, to shrink or truncate.
    for (let i = 1; i < words.length && lines.length < maxLines - 1; i++) {
      if (boxWidth > 0 && width(words.slice(from, i + 1)) > boxWidth) {
        lines.push(join(words.slice(from, i)));
        from = i;
      }
    }
    lines.push(join(words.slice(from)));
  }
  if (cut) lines[lines.length - 1] += "…";
  return lines;
}

/** One drawn line as runs of one look. The line is the text from `from` with
 * its whitespace folded and perhaps cut short with an ellipsis, so each character
 * is matched back in order: a character still there takes its own look, folded
 * whitespace takes the look of the whitespace it stands for, and anything the
 * text does not have (the ellipsis) takes the look of the character before it.
 * A look is a color for color by value and a whole part style for rich text;
 * neighbours merge when they hold the very same look. */
function paintLine<T>(line: string, from: number, text: string, looks: readonly T[], fallback: T): { text: string; look: T }[] {
  const runs: { text: string; look: T }[] = [];
  let at = from;
  let previous = fallback;
  const blank = (i: number) => i < text.length && /\s/.test(text[i]!);
  for (const ch of line) {
    let look = previous;
    if (/\s/.test(ch)) {
      if (blank(at)) look = looks[at]!;
      while (blank(at)) at++;
    } else {
      while (blank(at)) at++;
      if (text.startsWith(ch, at)) {
        look = looks[at]!;
        at += ch.length;
      }
    }
    previous = look;
    const last = runs.at(-1);
    if (last && last.look === look) last.text += ch;
    else runs.push({ text: ch, look });
  }
  return runs;
}

/** How one character of a rich text layer is drawn. */
interface PartLook {
  fontSize: number;
  fontWeight: string;
  fontDesign: string;
  fontWidth: string;
  italic: boolean;
  colorHex: string;
}

type PartRun = { text: string; look: PartLook };

/** The look of each code unit of the joined parts: the part's size and weight,
 * and its span's color when it colors by value. One object per span, so
 * `paintLine` merges exactly the characters that share a run. */
function partLooks(parts: readonly ResolvedTextPart[]): PartLook[] {
  const out: PartLook[] = [];
  for (const part of parts) {
    const runs = part.spans !== undefined && part.spans.map((s) => s.text).join("") === part.text
      ? part.spans
      : [{ text: part.text, colorHex: part.colorHex }];
    for (const run of runs) {
      const look: PartLook = {
        fontSize: part.fontSize, fontWeight: part.fontWeight,
        fontDesign: part.fontDesign, fontWidth: part.fontWidth,
        italic: part.italic, colorHex: run.colorHex,
      };
      for (let i = 0; i < run.text.length; i++) out.push(look);
    }
  }
  return out;
}

/** Width of drawn runs at `scale`, each character at its own size. */
function runsWidth(runs: readonly PartRun[], scale: number): number {
  return runs.reduce((w, r) => w + r.text.length * textCharWidth(r.look.fontSize * scale), 0);
}

/** `wrapToLines`, measured character by character, because the parts of one
 * line do not share a size. The gap a folded break leaves is one space in the
 * size of the character before the word. */
function wrapPartsToLines(text: string, looks: readonly PartLook[], boxWidth: number, maxLines: number): string[] {
  const words = [...text.matchAll(/\S+/g)];
  const limit = Math.max(1, Math.min(maxLines, words.length));
  if (limit < 2) return [text];
  const size = (i: number) => looks[i]?.fontSize ?? 0;
  const join = (list: RegExpExecArray[]) => list.map((m) => m[0]).join(" ");
  const lines: string[] = [];
  let from = 0;
  for (let n = 0; n < limit - 1; n++) {
    // Leave one word for each line still to come, so no line ends up empty. The
    // first word of a line is always taken, so a long unbroken one shrinks.
    const last = words.length - (limit - 1 - n) - 1;
    let used = 0;
    let taken = from;
    for (let i = from; i <= last; i++) {
      const start = words[i]!.index ?? 0;
      let add = i === from ? 0 : textCharWidth(size(start - 1));
      for (let j = start; j < start + words[i]![0].length; j++) add += textCharWidth(size(j));
      if (i > from && used + add > boxWidth) break;
      used += add;
      taken = i + 1;
    }
    lines.push(join(words.slice(from, taken)));
    from = taken;
  }
  lines.push(join(words.slice(from)));
  return lines;
}

/** `truncateToBox` over runs of mixed sizes: keep what fits beside an ellipsis
 * in the size of the character it follows, at least one character, then trim
 * trailing whitespace. The ellipsis joins the last run kept. */
function truncateRuns(runs: readonly PartRun[], scale: number, boxWidth: number): PartRun[] {
  if (boxWidth <= 0 || runsWidth(runs, scale) <= boxWidth) return [...runs];
  const out: PartRun[] = [];
  let used = 0;
  let kept = 0;
  cut: for (const run of runs) {
    const size = run.look.fontSize * scale;
    const budget = boxWidth - 0.8 * size;
    let text = "";
    for (const ch of run.text) {
      if (kept > 0 && used + ch.length * textCharWidth(size) > budget) {
        if (text !== "") out.push({ text, look: run.look });
        break cut;
      }
      text += ch;
      used += ch.length * textCharWidth(size);
      kept += 1;
    }
    out.push({ text, look: run.look });
  }
  while (out.length > 0) {
    const last = out.at(-1)!;
    last.text = last.text.replace(/\s+$/, "");
    if (last.text !== "") break;
    out.pop();
  }
  const tail = out.at(-1);
  if (tail) tail.text += "…";
  else if (runs[0]) out.push({ text: "…", look: runs[0].look });
  return out;
}

/**
 * A rich text layer: runs drawn as `<tspan>`s, each with its own size, weight
 * and fill. Wrapping, shrinking and truncation make the same decisions as a
 * plain layer, measured per character at each run's size, and a shrink scales
 * every run by the one factor so the parts keep their proportions.
 */
function renderTextParts(el: Extract<ResolvedElement, { kind: "text" }>, parts: readonly ResolvedTextPart[], box: Box) {
  const looks = partLooks(parts);
  const size = (i: number) => looks[i]?.fontSize ?? 0;
  const wordsWidth = (words: readonly RegExpExecArray[]) => words.reduce((w, m, k) => {
    let add = k === 0 ? 0 : textCharWidth(size(m.index - 1));
    for (let j = m.index; j < m.index + m[0].length; j++) add += textCharWidth(size(j));
    return w + add;
  }, 0);
  const lines = breakLines(el.text, el.lineLimit, box.w, wordsWidth)
    ?? (el.lineLimit > 1 && box.w > 0 ? wrapPartsToLines(el.text, looks, box.w, el.lineLimit) : [el.text]);
  const starts = lineStarts(el.text, lines);
  const painted = lines.map((line, i) => paintLine(line, starts[i] ?? 0, el.text, looks, looks[0]!));
  const widest = Math.max(...painted.map((runs) => runsWidth(runs, 1)));
  const scale = widest > box.w && box.w > 0 ? Math.max(el.minimumScale, box.w / widest) : 1;
  const drawn = painted.map((runs) => truncateRuns(runs, scale, box.w));
  const { anchor, x } = textAnchor(el.alignment, box);
  const tallest = Math.max(0, ...drawn.flat().map((r) => r.look.fontSize)) * scale || el.fontSize * scale;
  // The runs share the alphabetic baseline, as SwiftUI sets mixed sizes, rather
  // than each centring on its own size, which would float a small unit halfway
  // up a big number. Dropping the baseline a third of the tallest size keeps
  // the block on the frame's centre, as `dominant-baseline="central"` does for
  // a plain layer.
  const baseline = 0.35 * tallest;
  const step = tallest * 1.15;
  const lineBody = (runs: readonly PartRun[]) => runs.map((run) => {
    const a = colorAttrs(run.look.colorHex, "fill");
    return svg`<tspan font-size=${run.look.fontSize * scale} font-weight=${FONT_WEIGHT[run.look.fontWeight] ?? 400}
      font-family=${fontFamilyFor(run.look.fontDesign)} font-style=${run.look.italic ? "italic" : "normal"}
      style=${textStyle(false, run.look.fontWidth)}
      fill=${a.fill} fill-opacity=${a["fill-opacity"]}>${run.text}</tspan>`;
  });
  const c = colorAttrs(el.colorHex, "fill");
  const body = drawn.length > 1
    ? svg`${drawn.map((runs, i) => svg`<tspan x=${x} y=${box.cy + baseline + (i - (drawn.length - 1) / 2) * step}>${lineBody(runs)}</tspan>`)}`
    : lineBody(drawn[0]!);
  return svg`<text x=${x} y=${box.cy + baseline} text-anchor=${anchor}
    font-family=${fontFamilyFor(el.fontDesign)} font-style=${el.italic ? "italic" : "normal"}
    font-size=${el.fontSize * scale} font-weight=${FONT_WEIGHT[el.fontWeight] ?? 400}
    style=${textStyle(el.monospacedDigits, el.fontWidth)}
    fill=${c.fill} fill-opacity=${c["fill-opacity"]}>${body}</text>`;
}

function renderText(el: Extract<ResolvedElement, { kind: "text" }>, box: Box) {
  // Curved first: the resolver only leaves an arc on a shape that draws one and
  // never on a countdown, so everything below still reads as it did.
  if (el.arc !== undefined) return renderArcText(el, box);
  // Rich text, unless a countdown is ticking: the resolver never pairs the two,
  // and a stale pairing should still tick rather than freeze on its parts. Parts
  // that no longer spell the text draw as plain text, the way stale spans do.
  if (el.parts !== undefined && el.countdownEnd === undefined && el.parts.map((p) => p.text).join("") === el.text) {
    if (el.text === "") return nothing;
    return renderTextParts(el, el.parts, box);
  }
  const c = colorAttrs(el.colorHex, "fill");
  // Live countdown: the preview shows the remaining time at render; the panel
  // re-renders once a second while any countdown is live, so it ticks too.
  if (el.countdownEnd !== undefined && el.countdownEnd > Date.now()) {
    el = { ...el, text: countdownRemainingString((el.countdownEnd - Date.now()) / 1000) };
  }
  // lineLimit + minimumScaleFactor(0.5): wrap first when the layer allows two
  // lines, then shrink what is still too wide down to half size, then truncate
  // the tail with an ellipsis the way SwiftUI does instead of overflowing.
  const charWidth = textCharWidth(el.fontSize);
  const lines = breakLines(el.text, el.lineLimit, box.w, (words) => words.map((m) => m[0]).join(" ").length * charWidth)
    ?? (el.lineLimit > 1 && box.w > 0 ? wrapToLines(el.text, box.w / charWidth, el.lineLimit) : [el.text]);
  const widest = Math.max(...lines.map((l) => l.length)) * textCharWidth(el.fontSize);
  const scale = widest > box.w && box.w > 0 ? Math.max(el.minimumScale, box.w / widest) : 1;
  const fontSize = el.fontSize * scale;
  const drawn = lines.map((l) => truncateToBox(l, fontSize, box.w));
  const { anchor, x } = textAnchor(el.alignment, box);
  // Color by value paints runs inside each drawn line. Every width decision
  // above is made on the plain text, so the runs change color and nothing else.
  const colors = spanColors(el.text, el.spans);
  const starts = colors ? lineStarts(el.text, lines) : [];
  const lineBody = (line: string, i: number) => colors
    ? paintLine(line, starts[i] ?? 0, el.text, colors, el.colorHex).map((run) => {
      const a = colorAttrs(run.look, "fill");
      return svg`<tspan fill=${a.fill} fill-opacity=${a["fill-opacity"]}>${run.text}</tspan>`;
    })
    : line;
  // Two lines sit either side of the box centre, one line height apart, so the
  // block stays centred on the frame the way a SwiftUI text does.
  const step = fontSize * 1.15;
  const body = drawn.length > 1
    ? svg`${drawn.map((line, i) => svg`<tspan x=${x} y=${box.cy + (i - (drawn.length - 1) / 2) * step}>${lineBody(line, i)}</tspan>`)}`
    : lineBody(drawn[0]!, 0);
  return svg`<text x=${x} y=${box.cy} text-anchor=${anchor} dominant-baseline="central"
    font-family=${fontFamilyFor(el.fontDesign)} font-style=${el.italic ? "italic" : "normal"}
    font-size=${fontSize} font-weight=${FONT_WEIGHT[el.fontWeight] ?? 400}
    style=${textStyle(el.monospacedDigits, el.fontWidth)}
    fill=${c.fill} fill-opacity=${c["fill-opacity"]}>${body}</text>`;
}

/** The gap between two dots of a `dots` gauge, in watch points. Mirrors the fixed
 * gap in `GaugeDotsView` in the app repo. */
const GAUGE_DOT_GAP = 2;

/**
 * Where a dots gauge puts its dots: one per unit along the long side. The
 * diameter is the smaller of the short side and one dot's share of the long
 * side, so a wide frame spreads them and a tall one stacks them.
 */
function gaugeDotLayout(el: Extract<ResolvedElement, { kind: "gauge" }>, box: Box) {
  const horizontal = box.w >= box.h;
  const count = Math.max(1, el.dotCount);
  const long = horizontal ? box.w : box.h;
  const short = horizontal ? box.h : box.w;
  const d = Math.max(1, Math.min(short, long / count - GAUGE_DOT_GAP));
  const span = count * d + (count - 1) * GAUGE_DOT_GAP;
  return { horizontal, count, d, span };
}

/** Where a ring, arc or needle gauge's scale starts and how far it sweeps, in
 * the same screen-clockwise degrees the drawing is rotated by. A ring is a full
 * turn from 12 o'clock; the arc and the needle dial share the stock watch
 * gauge's 270 degrees with the gap at the bottom. Mirrors `gaugeDial` in the app
 * repo. */
export function gaugeDial(style: "ring" | "arc" | "needle"): { start: number; sweep: number } {
  return style === "ring" ? { start: -90, sweep: 360 } : { start: 135, sweep: 270 };
}

function renderGauge(el: Extract<ResolvedElement, { kind: "gauge" }>, box: Box) {
  const fill = colorAttrs(el.colorHex, "stroke");
  const track = colorAttrs(el.trackColorHex, "stroke", "#FFFFFF");
  const tick = colorAttrs(el.thresholdColorHex, "stroke", "#FFFFFF");
  const lw = el.lineWidth;
  if (el.style === "dots") {
    const { horizontal, count, d, span } = gaugeDotLayout(el, box);
    const first = (horizontal ? box.cx : box.cy) - span / 2 + d / 2;
    return svg`${Array.from({ length: count }, (_, i) => {
      const at = first + i * (d + GAUGE_DOT_GAP);
      // A gradient over a row of dots is one color per dot, sampled where that
      // dot sits along the row: a dot is one mark, and half a fade across it
      // would read as a rendering fault rather than as a scale.
      const paint = i < el.filledCount
        ? (el.fill === undefined ? fill : colorAttrs(fillColorAt(el.fill, count <= 1 ? 0 : i / (count - 1)), "stroke"))
        : track;
      return svg`<circle cx=${horizontal ? at : box.cx} cy=${horizontal ? box.cy : at} r=${d / 2}
        fill=${paint.stroke} fill-opacity=${paint["stroke-opacity"]} />`;
    })}${gaugeBarExtras(el, box)}`;
  }
  if (el.style === "bar") {
    const w = box.w;
    const fillW = Math.max(lw, w * el.fraction);
    const tickW = 1;
    // The gradient runs the whole bar, not the filled part, so the color at a
    // reading does not move as the reading does.
    const paint = fillOrColor(el.fill, el.colorHex);
    return svg`
      ${paint.defs === nothing ? nothing : svg`<defs>${paint.defs}</defs>`}
      <rect x=${box.x} y=${box.cy - lw / 2} width=${w} height=${lw} rx=${lw / 2}
        fill=${track.stroke} fill-opacity=${track["stroke-opacity"]} />
      <rect x=${box.x} y=${box.cy - lw / 2} width=${fillW} height=${lw} rx=${lw / 2}
        fill=${paint.fill} fill-opacity=${paint.opacity} />
      ${el.thresholdFraction === undefined
        ? nothing
        : svg`<rect x=${box.x + Math.min(w - tickW, Math.max(0, w * el.thresholdFraction - tickW / 2))}
            y=${box.cy - lw / 2} width=${tickW} height=${lw}
            fill=${tick.stroke} fill-opacity=${tick["stroke-opacity"]} />`}
      ${gaugeBarExtras(el, box)}`;
  }
  const side = Math.min(box.w, box.h);
  const r = Math.max(0, side / 2 - lw / 2);
  const circumference = 2 * Math.PI * r;
  const dial = gaugeDial(el.style);
  const sweep = dial.sweep / 360;
  const rotate = dial.start;
  const trackLen = circumference * sweep;
  const fillLen = circumference * sweep * el.fraction;
  const dialExtras = svg`${gaugeTicksSvg(el, box, r, lw)}${gaugeEndLabels(el, box, r, lw)}`;
  if (el.style === "needle") {
    return svg`
      <g transform="rotate(${rotate} ${box.cx} ${box.cy})">
        <circle cx=${box.cx} cy=${box.cy} r=${r} fill="none" stroke-width=${lw} stroke-linecap="round"
          stroke=${track.stroke} stroke-opacity=${track["stroke-opacity"]}
          stroke-dasharray="${trackLen} ${circumference}" />
        ${el.thresholdFraction === undefined ? nothing : gaugeTick(box, r, lw, dial.sweep * el.thresholdFraction, el.thresholdColorHex)}
      </g>
      ${gaugeNeedle(el, box, r, lw)}
      ${dialExtras}`;
  }
  // A ring or an arc paints its fill as a fan of short arcs when it carries a
  // gradient, which is how an angular gradient is drawn without one in SVG.
  const arcFill = el.fill === undefined
    ? svg`<circle cx=${box.cx} cy=${box.cy} r=${r} fill="none" stroke-width=${lw} stroke-linecap="round"
        stroke=${fill.stroke} stroke-opacity=${fill["stroke-opacity"]}
        stroke-dasharray="${fillLen} ${circumference}" />`
    : gaugeGradientArc(el.fill, box, r, lw, dial, el.fraction);
  return svg`
    <g transform="rotate(${rotate} ${box.cx} ${box.cy})">
      <circle cx=${box.cx} cy=${box.cy} r=${r} fill="none" stroke-width=${lw} stroke-linecap="round"
        stroke=${track.stroke} stroke-opacity=${track["stroke-opacity"]}
        stroke-dasharray="${trackLen} ${circumference}" />
      ${el.fraction > 0 ? arcFill : nothing}
      ${el.thresholdFraction === undefined ? nothing : gaugeTick(box, r, lw, dial.sweep * el.thresholdFraction, el.thresholdColorHex)}
    </g>
    ${dialExtras}`;
}

/** The filled part of a ring or arc, drawn as a fan of short arcs so a gradient
 * can run around it. The whole scale is sampled, not just the filled part, so
 * the color at a reading does not move as the reading does. Drawn inside the
 * rotated group, so the angles here start at 0. */
function gaugeGradientArc(fill: Fill, box: Box, r: number, lw: number, dial: { start: number; sweep: number }, fraction: number) {
  const shown = Math.max(0, Math.min(1, fraction));
  const segments = Math.max(1, Math.round(GAUGE_GRADIENT_SEGMENTS * shown));
  const step = (dial.sweep * shown) / segments;
  const at = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: box.cx + Math.cos(rad) * r, y: box.cy + Math.sin(rad) * r };
  };
  return svg`${Array.from({ length: segments }, (_, i) => {
    // Neighbouring pieces overlap by a hair so no seam shows between them.
    const from = at(i * step - (i === 0 ? 0 : 0.2));
    const to = at((i + 1) * step);
    const c = parseColor(fillColorAt(fill, ((i + 0.5) * step) / dial.sweep)) ?? { color: "#FFFFFF", opacity: 1 };
    return svg`<path d=${`M${from.x} ${from.y} A ${r} ${r} 0 0 1 ${to.x} ${to.y}`} fill="none"
      stroke-width=${lw} stroke-linecap=${i === 0 || i === segments - 1 ? "round" : "butt"}
      stroke=${c.color} stroke-opacity=${c.opacity} />`;
  })}`;
}

/** The marks around a ring, arc or needle scale. The first sits at the start of
 * the scale and the last at its end, so `count` marks cut it into `count - 1`
 * steps. Every `majorEvery`th mark draws 1.6 times as long. */
function gaugeTicksSvg(el: Extract<ResolvedElement, { kind: "gauge" }>, box: Box, r: number, lw: number) {
  if (el.tickCount <= 0) return nothing;
  const c = colorAttrs(el.tickColorHex, "stroke");
  const dial = gaugeDial(el.style === "ring" ? "ring" : el.style === "needle" ? "needle" : "arc");
  const count = el.tickCount;
  // A full ring's last mark would land on its first, so a ring spreads its marks
  // over the whole turn instead of over the turn's two ends.
  const steps = el.style === "ring" ? count : Math.max(1, count - 1);
  return svg`${Array.from({ length: count }, (_, i) => {
    const major = el.tickMajorEvery > 0 && i % el.tickMajorEvery === 0;
    const len = el.tickLength * (major ? 1.6 : 1);
    const rad = ((dial.start + (dial.sweep * i) / steps) * Math.PI) / 180;
    const dx = Math.cos(rad);
    const dy = Math.sin(rad);
    // Just inside the track, pointing at the centre, so a mark never sits on
    // the fill and hides part of the reading.
    const outer = r - lw / 2 - 0.5;
    const inner = Math.max(0, outer - len);
    return svg`<line x1=${box.cx + dx * inner} y1=${box.cy + dy * inner}
      x2=${box.cx + dx * outer} y2=${box.cy + dy * outer}
      stroke-width=${major ? 1.2 : 0.8} stroke-linecap="round"
      stroke=${c.stroke} stroke-opacity=${c["stroke-opacity"]} />`;
  })}`;
}

/** The min and max text at the two ends of a round scale, and the reading under
 * the pointer on a needle dial. */
function gaugeEndLabels(el: Extract<ResolvedElement, { kind: "gauge" }>, box: Box, r: number, lw: number) {
  if (!el.showsLabels) return nothing;
  const c = colorAttrs(el.labelColorHex, "fill");
  const dial = gaugeDial(el.style === "ring" ? "ring" : el.style === "needle" ? "needle" : "arc");
  const size = el.labelSize;
  const at = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    // Inside the track by the text's own height, so the ends read without
    // pushing the layer's box out.
    const radius = Math.max(0, r - lw / 2 - size * 0.7);
    return { x: box.cx + Math.cos(rad) * radius, y: box.cy + Math.sin(rad) * radius + size * 0.36 };
  };
  const ends = el.style === "ring"
    ? nothing
    : svg`${[[dial.start, gaugeLabelText(el.minValue)], [dial.start + dial.sweep, gaugeLabelText(el.maxValue)]].map(([deg, text]) => {
        const p = at(deg as number);
        return svg`<text x=${p.x} y=${p.y} text-anchor="middle" font-size=${size} font-family=${GAUGE_TEXT_FAMILY}
          fill=${c.fill} fill-opacity=${c["fill-opacity"]}>${text}</text>`;
      })}`;
  // The reading itself belongs to the needle dial: a ring or an arc already
  // shows it by how far it is filled, and the number would sit on the fill.
  const reading = el.style === "needle" && el.valueText !== ""
    ? svg`<text x=${box.cx} y=${box.cy + r * 0.55 + size * 0.36} text-anchor="middle" font-size=${size * 1.2} font-weight="600" font-family=${GAUGE_TEXT_FAMILY}
        fill=${c.fill} fill-opacity=${c["fill-opacity"]}>${el.valueText}</text>`
    : nothing;
  return svg`${ends}${reading}`;
}

/** The text a gauge's own labels are set in, matching the rest of the preview.
 * A plain string, written out on every `<text>`: Lit cannot splice a template
 * into the middle of a tag, and a shared fragment would silently drop it. */
const GAUGE_TEXT_FAMILY = "-apple-system, 'SF Pro Text', Helvetica, Arial, sans-serif";

/** The pointer of a needle dial: a line from the hub out to the reading's angle,
 * `lineWidth` wide, with a small hub dot over its root. */
function gaugeNeedle(el: Extract<ResolvedElement, { kind: "gauge" }>, box: Box, r: number, lw: number) {
  const dial = gaugeDial("needle");
  const rad = ((dial.start + dial.sweep * Math.max(0, Math.min(1, el.fraction))) * Math.PI) / 180;
  const reach = Math.max(0, r - lw / 2 - 1);
  // A gradient down a pointer a couple of points wide says nothing, so the
  // pointer takes the one color the gradient shows where it points, the way a
  // banded gauge takes its band's color.
  const paint = colorAttrs(el.fill === undefined ? el.colorHex : fillColorAt(el.fill, el.fraction), "fill");
  const hub = Math.max(1, lw * 0.8);
  return svg`
    <line x1=${box.cx} y1=${box.cy} x2=${box.cx + Math.cos(rad) * reach} y2=${box.cy + Math.sin(rad) * reach}
      stroke-width=${lw} stroke-linecap="round" stroke=${paint.fill} stroke-opacity=${paint["fill-opacity"]} />
    <circle cx=${box.cx} cy=${box.cy} r=${hub} fill=${paint.fill} fill-opacity=${paint["fill-opacity"]} />`;
}

/** What a bar or a row of dots adds: marks along the bar, and the two ends of
 * the scale written under it. A round dial's are drawn against its arc instead. */
function gaugeBarExtras(el: Extract<ResolvedElement, { kind: "gauge" }>, box: Box) {
  const lw = el.style === "dots" ? gaugeDotLayout(el, box).d : el.lineWidth;
  const marks = el.tickCount > 0
    ? svg`${(() => {
        const c = colorAttrs(el.tickColorHex, "stroke");
        const steps = Math.max(1, el.tickCount - 1);
        return Array.from({ length: el.tickCount }, (_, i) => {
          const major = el.tickMajorEvery > 0 && i % el.tickMajorEvery === 0;
          const len = el.tickLength * (major ? 1.6 : 1);
          const x = box.x + (box.w * i) / steps;
          const top = box.cy + lw / 2 + 0.5;
          return svg`<line x1=${x} y1=${top} x2=${x} y2=${top + len}
            stroke-width=${major ? 1.2 : 0.8} stroke-linecap="round"
            stroke=${c.stroke} stroke-opacity=${c["stroke-opacity"]} />`;
        });
      })()}`
    : nothing;
  if (!el.showsLabels) return svg`${marks}`;
  const c = colorAttrs(el.labelColorHex, "fill");
  const size = el.labelSize;
  const y = box.cy + lw / 2 + (el.tickCount > 0 ? el.tickLength * 1.6 : 0) + size;
  return svg`${marks}
    <text x=${box.x} y=${y} text-anchor="start" font-size=${size} font-family=${GAUGE_TEXT_FAMILY}
      fill=${c.fill} fill-opacity=${c["fill-opacity"]}>${gaugeLabelText(el.minValue)}</text>
    <text x=${box.x + box.w} y=${y} text-anchor="end" font-size=${size} font-family=${GAUGE_TEXT_FAMILY}
      fill=${c.fill} fill-opacity=${c["fill-opacity"]}>${gaugeLabelText(el.maxValue)}</text>`;
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

/**
 * A chart's marks, and the row of clock times when the layer asks for one.
 *
 * The times take a row of their own off the top or the bottom and the plot
 * takes what is left, the same split a timeline makes. A chart still waiting on
 * its history draws the row alone: the times are a fact about the window, not
 * about the readings.
 */
function renderChart(el: Extract<ResolvedElement, { kind: "chart" }>, box: Box) {
  const { labelSize, rowHeight, body: plot, showsLabels } = timeLabelRowSplit(el, box);
  const times = showsLabels ? renderTimeLabelRow(el, box, labelSize, rowHeight) : undefined;
  if (el.values.length === 0) return times === undefined ? nothing : svg`${times}`;
  const marks = renderChartMarks(el, plot);
  return times === undefined ? marks : svg`${marks}${times}`;
}

/** The SVG commands that continue a path along one leg, from its start (which
 * the path is already at) to its end. */
function chartLegCommands(leg: ChartLeg): string {
  switch (leg.kind) {
    case "smooth": return `C${leg.c1.x} ${leg.c1.y} ${leg.c2.x} ${leg.c2.y} ${leg.end.x} ${leg.end.y}`;
    case "step": return `L${leg.corner.x} ${leg.corner.y} L${leg.end.x} ${leg.end.y}`;
    case "straight": return `L${leg.end.x} ${leg.end.y}`;
  }
}

/** A serial that makes SVG ids unique per rendered drawing. Ids are global to
 * the page, so two previews drawing the same layer at different sizes would
 * otherwise both define `chartfade-<id>` and one would paint with the other's
 * gradient. */
let svgIdSerial = 0;
function nextSvgIdPrefix(): string {
  svgIdSerial += 1;
  return svgIdSerial.toString(36);
}

/** A bar with only the end away from the baseline rounded: the top, or the
 * bottom for a bar hanging below zero. `radius` is already clamped to the bar. */
export function chartBarPath(r: { x: number; y: number; w: number; h: number }, radius: number, roundBottom: boolean): string {
  const { x, y, w, h } = r;
  const k = Math.max(0, radius);
  if (k === 0) return `M${x} ${y} L${x + w} ${y} L${x + w} ${y + h} L${x} ${y + h} Z`;
  if (k > h) {
    // A bar shorter than its radius shows only the tip of the rounded end, the
    // way a taller bar would look cut off at this height: each corner arc runs
    // until it meets the baseline edge, so a short bar reads as a dome rather
    // than a flat slab with small corners.
    const s = Math.sqrt(h * (2 * k - h));
    const xl = x + k - s;
    const xr = x + w - k + s;
    if (roundBottom) {
      return `M${xl} ${y} L${xr} ${y} A${k} ${k} 0 0 1 ${x + w - k} ${y + h} `
        + `L${x + k} ${y + h} A${k} ${k} 0 0 1 ${xl} ${y} Z`;
    }
    return `M${xl} ${y + h} A${k} ${k} 0 0 1 ${x + k} ${y} `
      + `L${x + w - k} ${y} A${k} ${k} 0 0 1 ${xr} ${y + h} Z`;
  }
  if (roundBottom) {
    return `M${x} ${y} L${x + w} ${y} L${x + w} ${y + h - k} A${k} ${k} 0 0 1 ${x + w - k} ${y + h} `
      + `L${x + k} ${y + h} A${k} ${k} 0 0 1 ${x} ${y + h - k} Z`;
  }
  return `M${x} ${y + h} L${x} ${y + k} A${k} ${k} 0 0 1 ${x + k} ${y} `
    + `L${x + w - k} ${y} A${k} ${k} 0 0 1 ${x + w} ${y + k} L${x + w} ${y + h} Z`;
}

/** A bar border open at the baseline end: `inner` is the bar `r` inset by half
 * the stroke, `k` the far corners' eased radius. A bar that `hangs` below zero
 * has its baseline at the top, so the path turns across its bottom instead. */
export function chartOpenBarBorderPath(
  r: { x: number; y: number; w: number; h: number },
  inner: { x: number; y: number; w: number; h: number },
  k: number,
  hangs: boolean,
): string {
  const left = inner.x;
  const right = inner.x + inner.w;
  if (hangs) {
    const base = r.y;
    const far = inner.y + inner.h;
    if (k === 0) return `M${left} ${base} L${left} ${far} L${right} ${far} L${right} ${base}`;
    return `M${left} ${base} L${left} ${far - k} A${k} ${k} 0 0 0 ${left + k} ${far} `
      + `L${right - k} ${far} A${k} ${k} 0 0 0 ${right} ${far - k} L${right} ${base}`;
  }
  const base = r.y + r.h;
  const far = inner.y;
  if (k === 0) return `M${left} ${base} L${left} ${far} L${right} ${far} L${right} ${base}`;
  return `M${left} ${base} L${left} ${far + k} A${k} ${k} 0 0 1 ${left + k} ${far} `
    + `L${right - k} ${far} A${k} ${k} 0 0 1 ${right} ${far + k} L${right} ${base}`;
}

function renderChartMarks(el: Extract<ResolvedElement, { kind: "chart" }>, box: Box) {
  const g = chartGeometry(el, box);
  const idPrefix = nextSvgIdPrefix();
  const base = colorAttrs(el.colorHex, "fill");
  const high = colorAttrs(el.highColorHex, "fill", el.colorHex);
  const low = colorAttrs(el.lowColorHex, "fill", el.colorHex);

  const dot = (c: { x: number; y: number }, color: ReturnType<typeof colorAttrs>) =>
    svg`<circle cx=${c.x} cy=${c.y} r="1.7" fill=${color.fill} fill-opacity=${color["fill-opacity"]} />`;

  const body: TemplateResult[] = [];
  const defs = new Map<string, TemplateResult>();

  // One color per reading when the chart is banded, otherwise the series color.
  const banded = el.pointColorHexes.length === g.count;
  const bandAt = (i: number) => (banded ? colorAttrs(el.pointColorHexes[i]!, "fill", el.colorHex) : base);

  // An area's paint in one color: 28 % flat, or a fade from 28 % at the top of
  // the plot to clear at the baseline. The gradient runs in plot space, one per
  // color, so neighbouring band quads line up into one wash.
  const fillPaint = (hex: string) => {
    const c = parseColor(hex) ?? parseColor(el.colorHex) ?? { color: "#FFFFFF", opacity: 1 };
    if (el.fillStyle !== "fade") return { fill: c.color, opacity: c.opacity * 0.28 };
    const id = chartFadeId(idPrefix, el.id, hex);
    // Strongest away from the baseline: from the plot top down to it, or, when
    // the baseline sits at or above the top (every reading below zero), from
    // the plot bottom up to it.
    const strongY = g.baselineY <= g.plotTop ? g.plotBottom : g.plotTop;
    if (!defs.has(id)) {
      defs.set(id, svg`<linearGradient id=${id} gradientUnits="userSpaceOnUse" x1="0" y1=${strongY} x2="0" y2=${g.baselineY}>
        <stop offset="0" stop-color=${c.color} stop-opacity=${c.opacity * 0.28} />
        <stop offset="1" stop-color=${c.color} stop-opacity="0" /></linearGradient>`);
    }
    return { fill: `url(#${id})`, opacity: 1 };
  };

  // The area's gradient, made once and shared by every stretch of line that
  // draws under it, so a series broken by holes still reads as one wash.
  let areaFillPaintCache: { fill: string; opacity: number } | undefined;
  const areaFillPaint = (fill: Fill) => {
    if (areaFillPaintCache === undefined) {
      const made = fillPaintDefs(fill);
      defs.set("areaFill", made.defs);
      areaFillPaintCache = { fill: made.paint, opacity: 1 };
    }
    return areaFillPaintCache;
  };

  if (el.style === "bars") {
    for (let i = 0; i < g.count; i++) {
      // A hole draws no bar: the slot stays empty where the entity was unavailable.
      if (el.holes[i] === true) continue;
      const r = g.barRect(i);
      // The highlight is the more specific statement, so it paints over its band.
      // The resolver has already folded that in with the fill colors; a chart
      // resolved without them draws the way it always did.
      const fillHex = el.barFillColorHexes.length === g.count ? el.barFillColorHexes[i] : undefined;
      const color = fillHex !== undefined
        ? colorAttrs(fillHex, "fill", el.colorHex)
        : i === el.highIndex ? high : i === el.lowIndex ? low : bandAt(i);
      // A rounded top only needs the bar's width: a bar shorter than the radius
      // draws as a dome (see `chartBarPath`). Rounding both ends caps at half.
      const radius = el.barCorners === "top"
        ? Math.min(Math.max(el.barRadius, 0), r.w / 2)
        : Math.min(Math.max(el.barRadius, 0), r.w / 2, r.h / 2);
      const below = el.baseline === "zero" && el.values[i]! < 0;
      const hangs = el.barCorners === "top" && below;
      const borderHex = el.barBorderWidth > 0 && el.barBorderColorHexes.length === g.count ? el.barBorderColorHexes[i] : undefined;
      const bw = el.barBorderWidth;
      // A bar too thin or too short to hold its border on both sides is all border.
      const solid = borderHex !== undefined && (r.w <= 2 * bw || r.h <= 2 * bw);
      const paint = solid ? colorAttrs(borderHex, "fill", el.colorHex) : color;
      if (el.barCorners === "top") {
        body.push(svg`<path d=${chartBarPath(r, radius, hangs)}
          fill=${paint.fill} fill-opacity=${paint["fill-opacity"]} />`);
      } else {
        body.push(svg`<rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx=${radius}
          fill=${paint.fill} fill-opacity=${paint["fill-opacity"]} />`);
      }
      if (borderHex !== undefined && !solid) {
        // Stroked along a copy of the outline inset by half the width, with the
        // corners eased by the same amount, so the border sits inside the bar and
        // its outer edge follows the bar's own corners. Bars never grow.
        const stroke = colorAttrs(borderHex, "fill", el.colorHex);
        const inner = { x: r.x + bw / 2, y: r.y + bw / 2, w: r.w - bw, h: r.h - bw };
        const k = el.barCorners === "top"
          ? Math.min(Math.max(radius - bw / 2, 0), inner.w / 2)
          : Math.min(Math.max(radius - bw / 2, 0), inner.w / 2, inner.h / 2);
        if (el.barBorderOpenBase) {
          // Up one side, across the far end, down the other, with both sides
          // running on to the baseline edge. The bar's own outline clips them,
          // so rounded baseline corners trim the ends the way they trim the fill.
          const id = `${idPrefix}bb${i}`;
          const outline = el.barCorners === "top"
            ? svg`<path d=${chartBarPath(r, radius, hangs)} />`
            : svg`<rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} rx=${radius} />`;
          defs.set(id, svg`<clipPath id=${id}>${outline}</clipPath>`);
          body.push(svg`<path d=${chartOpenBarBorderPath(r, inner, k, below)} fill="none" stroke=${stroke.fill} stroke-opacity=${stroke["fill-opacity"]} stroke-width=${bw} clip-path=${`url(#${id})`} />`);
          continue;
        }
        const d = el.barCorners === "top"
          ? chartBarPath(inner, k, hangs)
          : chartBarPath(inner, 0, false);
        if (el.barCorners === "top" || k === 0) {
          body.push(svg`<path d=${d} fill="none" stroke=${stroke.fill} stroke-opacity=${stroke["fill-opacity"]} stroke-width=${bw} />`);
        } else {
          body.push(svg`<rect x=${inner.x} y=${inner.y} width=${inner.w} height=${inner.h} rx=${k}
            fill="none" stroke=${stroke.fill} stroke-opacity=${stroke["fill-opacity"]} stroke-width=${bw} />`);
        }
      }
    }
  } else {
    const points = Array.from({ length: g.count }, (_, i) => g.point(i));
    // Line and area never cross a hole: each run of real readings is its own
    // line with its own legs and its own fill, so a smooth or step curve
    // restarts after an outage. A lone reading between two holes draws nothing,
    // since a stroke or a fill needs two ends. Without holes the whole series is
    // one run and draws as it always has.
    const hasHoles = el.holes.length > 0;
    const runs = chartRuns(g.count, el.holes).filter((run) => !hasHoles || run.length > 1);
    const drawn = runs.map((run) => {
      const pts = run.map((i) => points[i]!);
      // Every stroke and fill below reads the same legs, so a smooth or step line,
      // its fill, and its banded pieces all follow one shape.
      const legs = chartLegs(pts, el.curve);
      const line = `M${pts[0]!.x} ${pts[0]!.y}${legs.map((leg) => ` ${chartLegCommands(leg)}`).join("")}`;
      return { run, pts, legs, line };
    });
    if (el.style === "area") {
      for (const { run, pts, legs, line } of drawn) {
        // A fill color of its own is one color, so it overrides band fill.
        if (el.fillBands && banded && run.length > 1 && el.fillColorHex === undefined) {
          // One quad per leg, each under its own stretch of line. No clipping: the
          // quads share their edges, so they read as one wash.
          for (let k = 0; k < legs.length; k++) {
            const a = pts[k]!;
            const b = pts[k + 1]!;
            const paint = fillPaint(el.pointColorHexes[run[k + 1]!]!);
            const quad = `M${a.x} ${a.y} ${chartLegCommands(legs[k]!)} L${b.x} ${g.baselineY} L${a.x} ${g.baselineY} Z`;
            body.push(svg`<path d=${quad} fill=${paint.fill} fill-opacity=${paint.opacity} stroke="none" />`);
          }
        } else {
          // A gradient under the area replaces the whole paint, `fillStyle` and
          // the flat 28 % included: its stops carry their own alpha, so fading
          // it again would take a color the author chose and dim it twice.
          const paint = el.areaFill === undefined
            ? fillPaint(el.fillColorHex ?? el.colorHex)
            : areaFillPaint(el.areaFill);
          const area = `${line} L${pts[pts.length - 1]!.x} ${g.baselineY} L${pts[0]!.x} ${g.baselineY} Z`;
          body.push(svg`<path d=${area} fill=${paint.fill} fill-opacity=${paint.opacity} stroke="none" />`);
        }
      }
    }
    for (const { run, pts, legs, line } of drawn) {
      if (banded && run.length > 1) {
        // A stroke cannot change color halfway, so a banded line is drawn one
        // segment at a time. Each segment takes the band of the reading it arrives
        // at, which puts the newest reading's color on the last segment.
        for (let k = 0; k < legs.length; k++) {
          const a = pts[k]!;
          const color = bandAt(run[k + 1]!);
          body.push(svg`<path d=${`M${a.x} ${a.y} ${chartLegCommands(legs[k]!)}`} fill="none"
            stroke=${color.fill} stroke-opacity=${color["fill-opacity"]}
            stroke-width=${el.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`);
        }
      } else {
        body.push(svg`<path d=${line} fill="none" stroke=${base.fill} stroke-opacity=${base["fill-opacity"]}
          stroke-width=${el.lineWidth} stroke-linecap="round" stroke-linejoin="round" />`);
      }
    }
    // A single stroke cannot change color halfway without splitting into two
    // paths, so line and area put the highlight on a dot at the reading.
    if (el.highIndex !== undefined) body.push(dot(points[el.highIndex]!, high));
    if (el.lowIndex !== undefined) body.push(dot(points[el.lowIndex]!, low));
  }

  // Each end draws its own mark in its own color. The color is the
  // highlight's either way, so an end with no mark is still painted.
  const endMark = (index: number | undefined, marker: typeof el.highMarker, color: typeof high, end: "high" | "low") => {
    if (index === undefined || marker === "none") return;
    const c = g.markerCenter(index, el.style === "bars", end);
    body.push(marker === "triangle"
      ? svg`<path d=${`M${c.x} ${c.y - 1.8} L${c.x + 2.2} ${c.y + 1.8} L${c.x - 2.2} ${c.y + 1.8} Z`}
          fill=${color.fill} fill-opacity=${color["fill-opacity"]} />`
      : dot(c, color));
  };
  endMark(el.highIndex, el.highMarker, high, "high");
  endMark(el.lowIndex, el.lowMarker, low, "low");

  // The two lines that are about the plot rather than about a reading: a dashed
  // horizontal one at the threshold, and a vertical one standing on "now". Both
  // are one point thick, so they read as annotation over the series rather than
  // as another series.
  // A line that has moved into a layer is drawn by that layer, not here.
  if (el.drawsThreshold && el.thresholdY !== undefined) {
    const y = g.yAtFraction(el.thresholdY);
    const color = colorAttrs(el.thresholdColorHex, "fill", el.colorHex);
    body.push(svg`<path d=${`M${g.plotLeft} ${y} L${g.plotRight} ${y}`} fill="none"
      stroke=${color.fill} stroke-opacity=${color["fill-opacity"]}
      stroke-width="1" stroke-dasharray="2 2" />`);
  }
  if (el.drawsNowLine && el.nowIndex !== undefined && el.nowIndex < g.count) {
    const x = g.markerCenter(el.nowIndex, el.style === "bars").x;
    const color = colorAttrs(el.nowColorHex, "fill", el.colorHex);
    body.push(svg`<path d=${`M${x} ${g.plotTop} L${x} ${g.plotBottom}`} fill="none"
      stroke=${color.fill} stroke-opacity=${color["fill-opacity"]} stroke-width="1" />`);
  }

  return defs.size === 0 ? svg`${body}` : svg`<defs>${[...defs.values()]}</defs>${body}`;
}

/** The id of a chart's fade gradient in one color: the drawing's own prefix,
 * the layer's id and the color's hex digits, so each color is defined once
 * per drawing and two drawings of one layer never share an id. */
export function chartFadeId(prefix: string, elementId: string, hex: string): string {
  return `chartfade-${prefix}-${elementId}-${hex}`.replace(/[^0-9A-Za-z_-]/g, "");
}

/** The row of clock times itself: the last hung off the right edge, the first
 * off the left, the rest centred on their own fraction of the frame. Drawn the
 * same way for a timeline and for a chart, so two layers on one face put their
 * times in the same places. */
function renderTimeLabelRow(
  el: { labels: TimelineLabel[]; labelColorHex: string; labelsAbove: boolean },
  box: Box,
  labelSize: number,
  rowHeight: number,
  font?: TimeRowFont,
) {
  const rowY = (el.labelsAbove ? box.y : box.y + box.h - rowHeight) + rowHeight / 2;
  const color = colorAttrs(el.labelColorHex, "fill");
  const family = font === undefined
    ? "-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    : fontFamilyFor(font.fontDesign);
  const style = font === undefined ? nothing : textStyle(font.monospacedDigits, font.fontWidth);
  return el.labels.map((label, i) => {
    // The last one is hung off the right edge before the first is hung off the
    // left, so a lone time (a count of 1, drawn at now) sits inside the frame
    // rather than running off it.
    const last = i === el.labels.length - 1;
    const anchor = last ? "end" : i === 0 ? "start" : "middle";
    const x = box.x + label.position * box.w;
    return svg`<text x=${x} y=${rowY} text-anchor=${anchor} dominant-baseline="central"
      font-family=${family} font-style=${font?.italic ? "italic" : "normal"} style=${style}
      font-size=${labelSize} font-weight=${font === undefined ? 400 : FONT_WEIGHT[font.fontWeight] ?? 400}
      fill=${color.fill} fill-opacity=${color["fill-opacity"]}>${label.text}</text>`;
  });
}

/** A clock times layer's own font. The chart's and the timeline's own rows
 * pass none and keep the plain face they have always drawn in. */
type TimeRowFont = Pick<Extract<ResolvedElement, { kind: "chartTimes" }>,
  "fontWeight" | "fontDesign" | "fontWidth" | "italic" | "monospacedDigits">;

/**
 * A strip of colored runs across the frame, oldest at the left.
 *
 * Every run is a rounded rectangle as wide as the time it covers. The gap is
 * taken off the right of each run except the last, so the strip still ends
 * flush with the frame and the newest state keeps the edge the eye goes to.
 * A run narrower than the gap keeps a sliver rather than disappearing: a state
 * that lasted ten seconds in an hour is exactly the thing somebody is looking
 * for when they add one of these.
 *
 * A layer asking for clock times gives them a row of their own off the top or
 * the bottom, and the strip takes what is left. The last time is hung off the
 * right edge and the first off the left, so the row spans the frame exactly the
 * way the strip does.
 */
function renderTimeline(el: Extract<ResolvedElement, { kind: "timeline" }>, box: Box) {
  if ((el.runs.length === 0 && el.labels.length === 0) || box.w <= 0 || box.h <= 0) return nothing;
  // The clock times take a row of their own off the top or the bottom, so the
  // strip shrinks rather than being drawn under them.
  const { labelSize, rowHeight, body: strip, showsLabels } = timeLabelRowSplit(el, box);
  const gap = Math.max(0, Math.min(el.gap, box.w / Math.max(1, el.runs.length)));
  const body = el.runs.map((run, i) => {
    const x = box.x + run.start * box.w;
    const full = (run.end - run.start) * box.w;
    const last = i === el.runs.length - 1;
    const w = Math.max(last ? full : Math.min(full, 0.5), full - (last ? 0 : gap));
    const radius = Math.max(0, Math.min(el.cornerRadius, w / 2, strip.h / 2));
    const color = colorAttrs(run.colorHex, "fill");
    return svg`<rect x=${x} y=${strip.y} width=${w} height=${strip.h} rx=${radius}
      fill=${color.fill} fill-opacity=${color["fill-opacity"]} />`;
  });
  if (!showsLabels) return svg`${body}`;
  return svg`${body}${renderTimeLabelRow(el, box, labelSize, rowHeight)}`;
}

/** A chart's clock times as their own layer: one row across the frame, centred
 * in its height, placed exactly the way the chart places its own row. */
function renderChartTimes(el: Extract<ResolvedElement, { kind: "chartTimes" }>, box: Box) {
  if (el.labels.length === 0 || box.w <= 0 || box.h <= 0) return nothing;
  const { labelSize, rowHeight } = timeLabelRowSplit({ labels: el.labels, labelSize: el.labelSize, labelsAbove: false }, box);
  const row: Box = { ...box, y: box.cy - rowHeight / 2, h: rowHeight };
  return svg`${renderTimeLabelRow({ labels: el.labels, labelColorHex: el.labelColorHex, labelsAbove: false }, row, labelSize, rowHeight, el)}`;
}

/** The chart a dots or grid layer draws on, and the plot inside its box: the
 * same split the chart itself makes for its own clock times. */
function chartPlotFor(chart: ResolvedChart | undefined, box: Box) {
  if (chart === undefined || box.w <= 0 || box.h <= 0) return undefined;
  return { chart, g: chartGeometry(chart, timeLabelRowSplit(chart, box).body) };
}

/**
 * A dot on each of the layer's `indices`, in the chart's box: in the layer's
 * color when it sets one, else the color the series has at that reading. One
 * path per color.
 */
export function renderChartDots(el: Extract<ResolvedElement, { kind: "chartDots" }>, box: Box, chart: ResolvedChart | undefined, selected = false, minR = 0) {
  const on = chartPlotFor(chart, box);
  if (el.indices.length === 0 || on === undefined) return nothing;
  const c = on.chart;
  const banded = c.pointColorHexes.length === c.values.length;
  const r = Math.max(el.diameter / 2, minR);
  const byColor = new Map<string, string>();
  // A selected dots layer rings every dot: the layer's box is the chart's, so
  // the usual dashed box would read as the chart being selected.
  const ringR = r + 1.2;
  let rings = "";
  for (const i of el.indices) {
    if (i >= c.values.length) continue;
    const p = on.g.point(i);
    const hex = el.colorHex ?? (banded ? c.pointColorHexes[i]! : c.colorHex);
    byColor.set(hex, `${byColor.get(hex) ?? ""}M${p.x - r} ${p.y} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`);
    if (selected) rings += `M${p.x - ringR} ${p.y} a${ringR} ${ringR} 0 1 0 ${2 * ringR} 0 a${ringR} ${ringR} 0 1 0 ${-2 * ringR} 0 Z`;
  }
  const ringPath = selected && rings !== ""
    ? svg`<path d=${rings} fill="none" stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`
    : nothing;
  return svg`${ringPath}${[...byColor].map(([hex, d]) => {
    const color = colorAttrs(hex, "fill", c.colorHex);
    // The clear stroke widens each dot's click target past its drawn size; the
    // layer has no other hit box (see `renderElement`).
    return svg`<path d=${d} fill=${color.fill} fill-opacity=${color["fill-opacity"]} stroke="transparent" stroke-width="3" />`;
  })}`;
}

/** The chart's grid lines, solid, across its plot in its box. */
export function renderChartGrid(el: Extract<ResolvedElement, { kind: "chartGrid" }>, box: Box, chart: ResolvedChart | undefined, selected = false, minStroke = 0) {
  const on = chartPlotFor(chart, box);
  if (!el.draws || on === undefined) return nothing;
  const color = parseColor(el.colorHex) ?? { color: "#FFFFFF", opacity: 0.2 };
  const ys = chartGridYs(on.g, el.lines);
  // Selected, each line gets a dashed blue copy over it, for the same reason the
  // dots get rings: the layer's box is the chart's.
  return svg`${ys.map((y) => svg`<path d=${`M${on.g.plotLeft} ${y} L${on.g.plotRight} ${y}`} fill="none"
    stroke=${color.color} stroke-opacity=${Math.max(color.opacity, minStroke > 0 ? 0.6 : 0)} stroke-width=${Math.max(el.thickness, minStroke)} />`)}${selected
    ? ys.map((y) => svg`<path d=${`M${on.g.plotLeft} ${y} L${on.g.plotRight} ${y}`} fill="none" stroke="#0A84FF"
        stroke-width="1" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" pointer-events="none" />`)
    : nothing}`;
}

/** The square a circle draws in: the frame's shorter side, centred in it. */
export function centredSquare(box: Box): Box {
  const side = Math.min(box.w, box.h);
  return { x: box.cx - side / 2, y: box.cy - side / 2, w: side, h: side, cx: box.cx, cy: box.cy };
}

/** Thinnest a line's selection box gets, in design points, so a 1 pt line is
 * still a thing you can hover and grab, and its handles do not sit on top of
 * each other. */
export const LINE_OUTLINE_MIN = 4;

/**
 * The box a line's selection sits on: its bar down the middle of the frame's
 * long side, as `renderShape` draws it, widened to `LINE_OUTLINE_MIN` but never
 * past the frame.
 */
export function lineOutline(box: Box, thickness: number): Box {
  const along = box.w >= box.h;
  const short = along ? box.h : box.w;
  const t = Math.min(short, Math.max(LINE_OUTLINE_MIN, Math.max(0, thickness)));
  return along
    ? { x: box.x, y: box.cy - t / 2, w: box.w, h: t, cx: box.cx, cy: box.cy }
    : { x: box.cx - t / 2, y: box.y, w: t, h: box.h, cx: box.cx, cy: box.cy };
}

/**
 * The box a layer's selection, hover tint, hit box and handles sit on: the part
 * of its frame it actually draws in. Layers that fill their frame use the frame.
 */
export function layerOutline(el: ResolvedElement, box: Box): Box {
  if (el.kind === "shape") {
    if (el.shapeKind === "circle") return centredSquare(box);
    if (el.shapeKind === "line") return lineOutline(box, el.thickness);
    return box;
  }
  if (el.kind === "icon") {
    // Drawn at its own size, centred, whatever the frame's size.
    const s = Math.max(LINE_OUTLINE_MIN, iconDrawnSide(el));
    return { x: box.cx - s / 2, y: box.cy - s / 2, w: s, h: s, cx: box.cx, cy: box.cy };
  }
  if (el.kind === "chartTimes") {
    if (el.labels.length === 0 || box.w <= 0 || box.h <= 0) return box;
    const { rowHeight } = timeLabelRowSplit({ labels: el.labels, labelSize: el.labelSize, labelsAbove: false }, box);
    const t = Math.max(LINE_OUTLINE_MIN, rowHeight);
    return { x: box.x, y: box.cy - t / 2, w: box.w, h: t, cx: box.cx, cy: box.cy };
  }
  if (el.kind === "imageTime") {
    const size = imageTimeTextSize(box.w, box.h);
    if (!el.linked || size <= 0) return box;
    const w = timestampLabel(new Date()).length * size * 0.578 + size * 0.89;
    const h = size * 1.25;
    return { x: box.cx - w / 2, y: box.cy - h / 2, w, h, cx: box.cx, cy: box.cy };
  }
  if (el.kind !== "gauge") return box;
  switch (el.style) {
    case "ring":
    case "arc":
      return centredSquare(box);
    case "bar": {
      // Always across the frame, a line width tall, whichever side is longer.
      const t = Math.max(LINE_OUTLINE_MIN, el.lineWidth);
      return { x: box.x, y: box.cy - t / 2, w: box.w, h: t, cx: box.cx, cy: box.cy };
    }
    case "dots": {
      const { horizontal, d, span } = gaugeDotLayout(el, box);
      const t = Math.max(LINE_OUTLINE_MIN, d);
      return horizontal
        ? { x: box.cx - span / 2, y: box.cy - t / 2, w: span, h: t, cx: box.cx, cy: box.cy }
        : { x: box.cx - t / 2, y: box.cy - span / 2, w: t, h: span, cx: box.cx, cy: box.cy };
    }
    default:
      return box;
  }
}

/**
 * How a corner drag resizes a layer whose outline is not its frame, so the
 * handle stays under the pointer. A circle, ring or arc resizes its square; a
 * line its length; a bar gauge its width; a row of dots starts from the box
 * around the dots rather than the empty frame around them.
 */
export function handleResize(el: ResolvedElement, frame: NormalizedFrame, canvas: CanvasSize): Pick<GestureTarget, "square" | "line" | "bar" | "outline"> {
  if (el.kind === "shape") {
    if (el.shapeKind === "circle") return { square: true };
    if (el.shapeKind === "line") return { line: true };
    return {};
  }
  if (el.kind === "chartTimes") return { bar: true };
  if (el.kind === "imageTime") return outlineFrame(el, frame, canvas);
  if (el.kind !== "gauge") return {};
  if (el.style === "ring" || el.style === "arc") return { square: true };
  if (el.style === "bar") return { bar: true };
  if (el.style !== "dots") return {};
  return outlineFrame(el, frame, canvas);
}

/** A layer's outline as a frame, for a corner drag that starts from it. */
function outlineFrame(el: ResolvedElement, frame: NormalizedFrame, canvas: CanvasSize): Pick<GestureTarget, "outline"> {
  if (canvas.width <= 0 || canvas.height <= 0) return {};
  const o = layerOutline({ ...el, frame }, frameBox({ ...el, frame }, canvas));
  return { outline: { ...frame, x: o.x / canvas.width, y: o.y / canvas.height, width: o.w / canvas.width, height: o.h / canvas.height } };
}

/** How wide and tall an icon draws, in design points. An outline icon draws a
 * little larger than its size, as MDI glyphs carry their own padding. */
export function iconDrawnSide(el: Extract<ResolvedElement, { kind: "icon" }>): number {
  return el.path !== undefined && el.path !== "" ? el.size * MDI_SIZE_FACTOR : el.size;
}

/** What one pass of a shape paints with. Three passes draw a shape that fills
 * by value: the track, the clipped body, and the border on top of both. */
interface ShapePaint {
  fill: string;
  fillOpacity: number;
  stroke: string;
  strokeOpacity: number;
}

/**
 * How far a level's clip reaches past the box it measures, in design points.
 *
 * Big enough that the level's own edge is the only one that ever cuts the
 * drawing: a glyph that overhangs its own box is still drawn wherever it sits
 * on the filled side of the line.
 */
export const LEVEL_CLIP_REACH = 1000;

/**
 * The rectangle a level clips its layer to: the part of `box` the reading
 * fills, measured from the edge its direction grows from. `up` fills from the
 * bottom edge upward, `left` from the right edge leftward.
 *
 * Mirrors `CustomComplicationLevelMask` in the app repo, arithmetic for
 * arithmetic.
 */
export function levelClipRect(
  box: Box,
  fraction: number,
  direction: LevelDirection,
): { x: number; y: number; w: number; h: number } {
  const f = Math.min(1, Math.max(0, fraction));
  const r = LEVEL_CLIP_REACH;
  switch (direction) {
    case "up":    return { x: box.x - r, y: box.y + box.h * (1 - f), w: box.w + r * 2, h: box.h * f + r };
    case "down":  return { x: box.x - r, y: box.y - r, w: box.w + r * 2, h: r + box.h * f };
    case "left":  return { x: box.x + box.w * (1 - f), y: box.y - r, w: box.w * f + r, h: box.h + r * 2 };
    case "right": return { x: box.x - r, y: box.y - r, w: r + box.w * f, h: box.h + r * 2 };
  }
}

/** One `<clipPath>` holding a level's rectangle, and the id to hand a `<g>`. */
function levelClip(el: ResolvedElement, box: Box, level: ResolvedLevel) {
  const id = `lv-${(levelSeq += 1).toString(36)}`;
  // The box the level is measured in is the part of the frame the layer draws
  // in, not the frame: a circle in a wide frame fills its own circle, and an
  // icon fills the square its glyph is drawn at.
  const r = levelClipRect(layerOutline(el, box), level.fraction, level.direction);
  return {
    id,
    defs: svg`<defs><clipPath id=${id}><rect x=${r.x} y=${r.y} width=${r.w} height=${r.h} /></clipPath></defs>`,
  };
}

let levelSeq = 0;

function renderShape(el: Extract<ResolvedElement, { kind: "shape" }>, box: Box) {
  const paint = fillOrColor(el.fill, el.fillColorHex);
  const border = el.borderColorHex ? parseColor(el.borderColorHex) : undefined;
  const bw = border ? el.borderWidth : 0;
  const body: ShapePaint = {
    fill: paint.fill,
    fillOpacity: paint.opacity,
    stroke: border ? border.color : "none",
    strokeOpacity: border ? border.opacity : 0,
  };
  const defs = paint.defs === nothing ? nothing : svg`<defs>${paint.defs}</defs>`;
  if (el.level === undefined) return svg`${defs}${shapeBody(el, box, bw, body)}`;
  // Three passes rather than two, so the border is stroked once and whole: on
  // the filled pass it would be cut off at the level, and on the track pass the
  // fill would be painted over it.
  const trackColor = colorAttrs(el.level.trackColorHex, "fill");
  const track: ShapePaint = {
    fill: trackColor.fill as string,
    fillOpacity: trackColor["fill-opacity"] as number,
    stroke: "none",
    strokeOpacity: 0,
  };
  const filled: ShapePaint = { ...body, stroke: "none", strokeOpacity: 0 };
  const outline: ShapePaint = { ...body, fill: "none", fillOpacity: 0 };
  const clip = levelClip(el, box, el.level);
  return svg`${defs}${clip.defs}
    ${shapeBody(el, box, bw, track)}
    <g clip-path=${`url(#${clip.id})`}>${shapeBody(el, box, bw, filled)}</g>
    ${border ? shapeBody(el, box, bw, outline) : nothing}`;
}

/**
 * One pass of a shape's body, at the geometry every pass shares.
 *
 * The paint attributes are written out on every element rather than shared
 * through a nested template: Lit does not splice a template into the middle of
 * a tag, so a shared fragment silently drops every attribute in it and the
 * shape draws in SVG's default paint, which is black (seen 2026-09-05).
 */
function shapeBody(el: Extract<ResolvedElement, { kind: "shape" }>, box: Box, bw: number, p: ShapePaint) {
  // strokeBorder draws inside the bounds: inset by half the stroke. The inset is
  // the border's whether or not this pass strokes one, so every pass of a
  // layer that fills by value lands on exactly the same outline.
  const inset = bw / 2;
  switch (el.shapeKind) {
    case "circle": {
      const r = Math.min(box.w, box.h) / 2 - inset;
      return svg`<circle cx=${box.cx} cy=${box.cy} r=${Math.max(0, r)}
        fill=${p.fill} fill-opacity=${p.fillOpacity}
        stroke=${p.stroke} stroke-opacity=${p.strokeOpacity} stroke-width=${bw} />`;
    }
    case "capsule": {
      const r = Math.min(box.w, box.h) / 2;
      return svg`<rect x=${box.x + inset} y=${box.y + inset} width=${Math.max(0, box.w - bw)} height=${Math.max(0, box.h - bw)} rx=${r}
        fill=${p.fill} fill-opacity=${p.fillOpacity}
        stroke=${p.stroke} stroke-opacity=${p.strokeOpacity} stroke-width=${bw} />`;
    }
    case "roundedRectangle":
      return svg`<rect x=${box.x + inset} y=${box.y + inset} width=${Math.max(0, box.w - bw)} height=${Math.max(0, box.h - bw)} rx=${el.cornerRadius}
        fill=${p.fill} fill-opacity=${p.fillOpacity}
        stroke=${p.stroke} stroke-opacity=${p.strokeOpacity} stroke-width=${bw} />`;
    case "rectangle":
      return svg`<rect x=${box.x + inset} y=${box.y + inset} width=${Math.max(0, box.w - bw)} height=${Math.max(0, box.h - bw)}
        fill=${p.fill} fill-opacity=${p.fillOpacity}
        stroke=${p.stroke} stroke-opacity=${p.strokeOpacity} stroke-width=${bw} />`;
    case "line": {
      // A bar down the middle of the frame's long side. The border is not drawn:
      // a line's color is its fill, and a stroke around a 1 pt bar would only
      // thicken it. Thicker than the short side is clamped to it, as in Swift.
      const along = box.w >= box.h;
      const t = Math.max(0, Math.min(el.thickness, along ? box.h : box.w));
      const x = along ? box.x : box.cx - t / 2;
      const y = along ? box.cy - t / 2 : box.y;
      return svg`<rect x=${x} y=${y} width=${along ? box.w : t} height=${along ? t : box.h}
        fill=${p.fill} fill-opacity=${p.fillOpacity} stroke="none" />`;
    }
  }
}

function renderIcon(el: Extract<ResolvedElement, { kind: "icon" }>, box: Box, icons: IconProvider) {
  if (el.level === undefined) return iconGlyph(el, box, icons, el.colorHex);
  // The whole glyph in the track color, then the same glyph again in its own,
  // cut off at the level.
  const clip = levelClip(el, box, el.level);
  return svg`${clip.defs}
    ${iconGlyph(el, box, icons, el.level.trackColorHex)}
    <g clip-path=${`url(#${clip.id})`}>${iconGlyph(el, box, icons, el.colorHex)}</g>`;
}

/** The icon's glyph in one color, centred in its frame. */
function iconGlyph(el: Extract<ResolvedElement, { kind: "icon" }>, box: Box, icons: IconProvider, colorHex: string) {
  // A Material Design icon travels as its own outline, so the preview draws
  // exactly what the document carries, the way the watch does. MDI's box is
  // always 24 units; a drawing the author pasted says its own in `viewBox`.
  // Fitted into the square and centred, which is what `SVGPathShape` does.
  if (el.path !== undefined && el.path !== "") {
    const c = colorAttrs(colorHex, "fill");
    const s = el.size * MDI_SIZE_FACTOR;
    const vb = parseViewBox(el.viewBox);
    const k = Math.min(s / vb.width, s / vb.height);
    const tx = box.cx - (vb.width * k) / 2 - vb.minX * k;
    const ty = box.cy - (vb.height * k) / 2 - vb.minY * k;
    return svg`<g transform="translate(${tx} ${ty}) scale(${k})">
      <path d=${el.path} fill=${c.fill} fill-opacity=${c["fill-opacity"]} /></g>`;
  }
  const glyph = icons.render(el.symbol, el.size, colorHex);
  if (glyph) return svg`<g transform="translate(${box.cx - el.size / 2} ${box.cy - el.size / 2})">${glyph}</g>`;
  // Missing-symbol placeholder: a dashed box with the name, so the layer is
  // still visible and the user can see which name failed to resolve.
  const c = colorAttrs(colorHex, "stroke");
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
  // An inline picture that draws nothing has bytes the decoder refused, not a
  // fetch that has not landed, so it stands in as a picture.
  if (source === "inline") return "photo";
  switch (entityId.split(".")[0]) {
    case "camera": return "camera.fill";
    case "person": return "person.crop.circle";
    case "media_player": return "music.note";
    default: return "photo";
  }
}

/** A calm stand-in photo for `pictureScene`: dusk sky, a low sun, two hills
 * and a strip of ground, drawn to the box so it crops like a real picture. */
function renderPictureScene(box: Box, skyId: string) {
  const { x, y, w, h } = box;
  const px = (f: number) => x + w * f;
  const py = (f: number) => y + h * f;
  const sun = Math.max(2, Math.min(w, h) * 0.11);
  return svg`
    <defs><linearGradient id=${skyId} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3B5B8C" /><stop offset="0.65" stop-color="#9DB4CF" /><stop offset="1" stop-color="#E8C9A0" />
    </linearGradient></defs>
    <rect x=${x} y=${y} width=${w} height=${h} fill=${`url(#${skyId})`} />
    <circle cx=${px(0.72)} cy=${py(0.36)} r=${sun} fill="#FFF3D6" fill-opacity="0.9" />
    <path d=${`M${px(0)} ${py(0.7)} L${px(0.22)} ${py(0.42)} L${px(0.4)} ${py(0.6)} L${px(0.58)} ${py(0.38)} L${px(0.86)} ${py(0.66)} L${px(1)} ${py(0.56)} L${px(1)} ${py(1)} L${px(0)} ${py(1)} Z`}
      fill="#5C7391" />
    <path d=${`M${px(0)} ${py(0.84)} Q${px(0.3)} ${py(0.62)} ${px(0.62)} ${py(0.8)} T${px(1)} ${py(0.74)} L${px(1)} ${py(1)} L${px(0)} ${py(1)} Z`}
      fill="#34475E" />
    <rect x=${x} y=${py(0.92)} width=${w} height=${h * 0.08} fill="#232F3E" />`;
}

function renderImage(el: Extract<ResolvedElement, { kind: "image" }>, box: Box, options: RenderOptions) {
  const icons = options.icons;
  // Unique per drawing, for the same reason as a chart's gradient ids.
  const clipId = `imgclip-${nextSvgIdPrefix()}-${el.id}`;
  const r = Math.max(0, el.cornerRadius);
  // A document opened in the editor never gets here with a chip: the timestamp
  // is converted to a "Timestamp" group (a capsule and a text reading the
  // picture's time) first. The chip is still drawn for a document rendered
  // straight from the wire, as the watch still draws it.
  const c = el.showTimestamp && el.url ? timestampChipRect(el, box, timestampLabel(new Date())) : undefined;
  const chip = c ? renderTimestampChip(c) : nothing;
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
  } else if (options.pictureScene && el.source !== "inline"
    && ["camera.fill", "photo"].includes(imagePlaceholderSymbol(el.source, el.entityId))) {
    content = renderPictureScene(box, `${clipId}-sky`);
  } else {
    content = svg`
      <rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} rx=${r} fill="#FFFFFF" fill-opacity="0.18" />
      <g transform="translate(${box.cx - 7} ${box.cy - 7})">${icons.render(imagePlaceholderSymbol(el.source, el.entityId), 14, "#FFFFFF99") ?? nothing}</g>`;
  }
  return svg`
    <defs><clipPath id=${clipId}><rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} rx=${r} /></clipPath></defs>
    <g clip-path=${`url(#${clipId})`}>${content}${chip}</g>`;
}

/** The timestamp capsule: `h:mm:ss` in white on a dark pill, as the watch's
 * `ImageElementView` draws it. */
function renderTimestampChip(c: { x: number; y: number; w: number; h: number; size: number; label: string }, opacity = 1) {
  return svg`<g opacity=${opacity}>
    <rect x=${c.x} y=${c.y} width=${c.w} height=${c.h} rx=${c.h / 2} fill="#000000" fill-opacity="0.55" />
    <text x=${c.x + c.w / 2} y=${c.y + c.h / 2} text-anchor="middle" dominant-baseline="central"
      font-size=${c.size} font-weight="600" fill="#FFFFFF"
      font-family="-apple-system, 'SF Pro Rounded', Helvetica, Arial, sans-serif">${c.label}</text></g>`;
}

/** A picture's timestamp as its own layer: the chip as big as fits the frame
 * and centred in it, with the time now, since the preview picture is always live. The watch draws
 * nothing until the picture has been fetched; the preview still draws a picture
 * with no URL yet, faded, so the layer can be seen and moved. Nothing at all
 * once the picture is gone. */
function renderImageTime(el: Extract<ResolvedElement, { kind: "imageTime" }>, box: Box) {
  if (!el.linked) return nothing;
  const label = timestampLabel(new Date());
  const size = imageTimeTextSize(box.w, box.h);
  if (size <= 0) return nothing;
  const w = label.length * size * 0.578 + size * 0.89;
  const h = size * 1.25;
  return renderTimestampChip({ x: box.cx - w / 2, y: box.cy - h / 2, w, h, size, label }, el.url === undefined && el.standIn !== true ? 0.5 : 1);
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
    <rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} rx="2" fill="#FF5C9A" fill-opacity="0.12"
      stroke="#FF5C9A" stroke-opacity="0.9" stroke-width="0.6" stroke-dasharray="1.5 1" vector-effect="non-scaling-stroke" />
    ${text !== undefined
      ? svg`<text x=${box.cx} y=${box.cy} text-anchor="middle" dominant-baseline="central"
          font-family="-apple-system, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size=${TAP_LABEL_SIZE} font-weight="600" fill="#FF5C9A" fill-opacity="0.95">${text}</text>`
      : glyph >= 5
        ? svg`<g transform="translate(${box.cx - glyph / 2} ${box.cy - glyph / 2})" opacity="0.8">${icons.render("hand.tap.fill", glyph, TAP_COLOR) ?? nothing}</g>`
        : nothing}`;
}

/** Design-box points. Small enough that a 24 pt target still fits a word or
 * two, large enough to read at the preview's own scale. */
const TAP_LABEL_SIZE = 5;

/** Tap boxes and the complication's own tap area wear the Layers list's tap
 * pink, so a tap strip in the list and its box on the face read as one thing.
 * A shade lighter than the list's #EC407A, to hold up on the dimmed face.
 * `renderTap` spells it out in its template, where tests read the markup. */
const TAP_COLOR = "#FF5C9A";

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

/**
 * A list's cells, and the row template drawn inside each one.
 *
 * The cell frames arrive normalised inside the list's own frame, so each cell
 * becomes a box in design points and the row layers are drawn against that box
 * as a canvas of its own: their frames are normalised 0...1 inside the cell,
 * exactly as the resolver says. The group only translates, never scales, so a
 * 12 pt font in a row is 12 pt whatever size the cell is, which is what the
 * app's own `ListElementView` does.
 *
 * Every row layer goes through `renderElement`, so a hidden row layer dims the
 * same way and each row layer carries its own tint group. Two things a cell
 * does not inherit:
 *
 * - The handles. A row layer is dragged in the row designer, against one cell,
 *   not in the face's own canvas, where the pointer maths would be against the
 *   wrong box. The cells do take the pointer, so a double click on a row can
 *   open the designer on the layer it landed on, and the editor sends a plain
 *   press on a row to the list itself: the cursor says move, and a drag moves
 *   the whole list. Review mode reads rather than moves, and there a row tap's
 *   box is a thing you click to see what it does.
 * - The tap boxes. A free-standing tap on the face is drawn because nothing
 *   else marks where it is, but a row tap is repeated in every cell, and a
 *   finger on every row hides the row. The Row card names it; the face shows
 *   it only in review mode, and the row designer draws it as any tap.
 */
function renderList(
  el: Extract<ResolvedElement, { kind: "list" }>,
  box: Box,
  options: RenderOptions,
  charts: ReadonlyMap<string, ResolvedChart>,
  tintPrefix?: string,
): TemplateResult | typeof nothing {
  if (el.cells.length === 0) return nothing;
  const review = options.tapReview === true;
  const cellOptions: RenderOptions = { ...options, handles: false, tapAreas: review };
  return svg`${el.cells.map((cell) => {
    const w = Math.max(0, cell.frame.width * box.w);
    const h = Math.max(0, cell.frame.height * box.h);
    if (w <= 0 || h <= 0) return nothing;
    const x = box.x + cell.frame.x * box.w;
    const y = box.y + cell.frame.y * box.h;
    const canvas: CanvasSize = { width: w, height: h };
    return svg`<g data-list-cell transform="translate(${x} ${y})" style=${review ? nothing : "cursor:move"}>
      ${cell.elements.map((row) => renderElement(row, canvas, cellOptions, charts, tintPrefix))}</g>`;
  })}`;
}

/** The charts of a layout by id, for the dots and grid layers that draw on one. */
function chartsById(elements: readonly ResolvedElement[]): Map<string, ResolvedChart> {
  const out = new Map<string, ResolvedChart>();
  for (const el of elements) if (el.kind === "chart") out.set(el.id, el);
  return out;
}

/**
 * One layer, or with `part` "handles" only its resize handles. The handles are
 * drawn in a pass of their own, above the slot clip, so a handle on a layer
 * that touches the slot edge still shows past that edge.
 */
function renderElement(el: ResolvedElement, canvas: CanvasSize, options: RenderOptions, charts: ReadonlyMap<string, ResolvedChart> = new Map(), tintPrefix?: string, part: "body" | "handles" = "body") {
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
  if (part === "body") switch (el.kind) {
    case "text": body = renderText(el, box); break;
    case "icon": body = renderIcon(el, box, options.icons); break;
    case "gauge": body = renderGauge(el, box); break;
    case "chart": body = renderChart(el, box); break;
    case "timeline": body = renderTimeline(el, box); break;
    case "chartTimes": body = renderChartTimes(el, box); break;
    case "imageTime": body = renderImageTime(el, box); break;
    case "chartDots": body = renderChartDots(el, box, charts.get(el.chart), options.highlightId === el.id || options.highlightIds?.includes(el.id) === true, options.minDotRadius); break;
    case "chartGrid": body = renderChartGrid(el, box, charts.get(el.chart), options.highlightId === el.id || options.highlightIds?.includes(el.id) === true, options.minGridStroke); break;
    case "shape": body = renderShape(el, box); break;
    case "image": body = renderImage(el, box, options); break;
    case "tap": body = renderTap(el, box, options.icons, showTaps, labelled ? describeTapAction(el.action) : undefined); break;
    case "list": body = renderList(el, box, options, charts, tintPrefix); break;
  }
  // A tap box is the editor's own mark, never drawn on the watch, so it keeps
  // its color on a tinted preview and casts no shadow.
  if (el.kind !== "tap") {
    // One id per drawing rather than per layer: the same layer is drawn more
    // than once on a page (every shape's preview), and two filters sharing an
    // id in one document is one filter.
    body = shadowed(body, `sh-${(shadowSeq += 1).toString(36)}`, el.shadow, Math.max(canvas.width, canvas.height));
    // A list draws nothing of its own, and its row layers have each already
    // joined their own group. One filter around the whole list would repaint
    // white row text in the accent color, so the list adds none.
    if (el.kind !== "list") {
      body = tinted(body, tintGroup(el.kind, options.tintSurface ?? "watch", el.accentGroup === "accent"), tintPrefix);
    }
  }
  // Review mode pushes the drawing back so the tap boxes are the thing you read.
  const dim = review && (el.kind !== "tap" || (inFocusView && !focused)) ? 0.35 : 1;
  const opacity = Math.min(1, Math.max(0, el.opacity)) * (el.isHidden ? 0.35 : 1) * dim;
  const primary = options.highlightId === el.id;
  const selected = primary || options.highlightIds?.includes(el.id) === true;
  // Dots and grid lines are drawn in their chart's whole box. Given the usual
  // hit box they would sit over the chart and swallow every click meant for it,
  // so they take no box: the grid takes no clicks at all, and the dots only
  // under a dot, through the wide clear stroke `renderChartDots` gives each one.
  // Neither is dragged, since they always sit on their chart.
  const onChart = el.kind === "chartDots" || el.kind === "chartGrid";
  // In the focus view only the focused tap is a thing you drag, so only it gets
  // the move cursor and the handles.
  // A line through a chart's plot is placed by its reading, so it is selected
  // but never dragged or resized.
  const chartLine = el.chartAnchor?.place === "through";
  const draggable = options.handles === true && (!inFocusView || focused) && !onChart && !chartLine;
  // The selection, the hover tint, the hit box and the corner handles sit on
  // what is drawn, not on the whole frame: boxed to the frame they floated far
  // outside a circle or ring in a wide frame, or a thin line or bar in a tall one.
  const outline = layerOutline(el, box);
  // Two colors, blue dashes over a white line, so the outline shows on any
  // picture: one of the two always stands out. A lone blue hairline vanished
  // on busy photos, and an inverted line vanishes on mid gray, which inverts
  // to itself.
  const highlight = selected && !onChart
    ? svg`<rect x=${outline.x} y=${outline.y} width=${outline.w} height=${outline.h} fill="none" stroke="#FFFFFF" stroke-width="1.5" vector-effect="non-scaling-stroke" />
      <rect x=${outline.x} y=${outline.y} width=${outline.w} height=${outline.h} fill="none" stroke="#0A84FF" stroke-width="1.5" stroke-dasharray="2 1" vector-effect="non-scaling-stroke" />`
    : nothing;
  // Solid tint rather than the selection's dashes, so the two never read as the
  // same state when the pointer happens to rest on the selected layer.
  const hover = options.hoverId === el.id || options.hoverIds?.includes(el.id) === true
    ? svg`<rect x=${outline.x} y=${outline.y} width=${outline.w} height=${outline.h} fill="#0A84FF" fill-opacity="0.22"
        stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />`
    : nothing;
  // An invisible hit box so empty text and thin gauges are still grabbable.
  const hit = onChart
    ? nothing
    : svg`<rect x=${outline.x} y=${outline.y} width=${outline.w} height=${outline.h} fill="transparent" stroke="none" />`;
  // Each handle sits just outside its corner, touching it, so a tiny layer is
  // never buried under its own four handles.
  const hs = 3;
  const o = outline;
  const grab = options.handleHit ?? 0;
  const handles = primary && draggable
    ? [["nw", o.x - hs, o.y - hs], ["ne", o.x + o.w, o.y - hs], ["sw", o.x - hs, o.y + o.h], ["se", o.x + o.w, o.y + o.h]].map(
        ([corner, x, y]) => svg`${grab > hs
          ? svg`<rect data-handle=${corner} x=${(x as number) + hs / 2 - grab / 2} y=${(y as number) + hs / 2 - grab / 2} width=${grab} height=${grab}
            fill="transparent" stroke="none" />`
          : nothing}<rect data-handle=${corner} x=${x} y=${y} width=${hs} height=${hs}
          fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${corner}-resize" />`,
      )
    : nothing;
  if (part === "handles") {
    return handles === nothing
      ? nothing
      : svg`<g data-element-id=${el.id} opacity=${opacity} transform="rotate(${el.frame.rotationDegrees} ${box.cx} ${box.cy})">${handles}</g>`;
  }
  return svg`<g data-element-id=${el.id} opacity=${opacity} style=${draggable ? "cursor:move" : el.kind === "chartDots" ? "cursor:pointer" : nothing}
    pointer-events=${el.kind === "chartGrid" ? "none" : nothing}
    transform="rotate(${el.frame.rotationDegrees} ${box.cx} ${box.cy})">${hit}${body}${hover}${highlight}</g>`;
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

/** How wide a string is drawn, near enough: the same per-glyph heuristic the
 * bezel label is typeset with. The shape previews read it to tell whether a
 * word can fit its layer at all, which is the one kind of clipping the panel
 * can see without laying the text out. */
export function estimateTextWidth(text: string, fontSize: number): number {
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
  // The background's gradient, over the whole slot, beating the flat color.
  const bgFill = layout.backgroundFill === undefined
    ? undefined
    : fillPaintDefs(layout.backgroundFill);
  const bgPaint = bgFill === undefined
    ? (bg === undefined ? undefined : { fill: bg.color, opacity: bg.opacity })
    : { fill: bgFill.paint, opacity: 1 };
  const border = parseColor(layout.borderColorHex);
  const bw = layout.borderWidth * fit.scale;
  const elements = layout.elements;
  const charts = chartsById(elements);
  const tint = options.tint === undefined ? undefined : `${uid}-tint`;
  // A Home Screen tile is only ever tinted the iPhone way, and a watch shape
  // only ever the watch way, so the shape settles the surface on its own.
  const surface: TintSurface = options.tintSurface ?? "watch";
  // The tint filters serve the slot, the design box and, on a corner, the
  // screen quadrant around it, so the region spans the largest of the three.
  const extent = Math.max(canvas.width, canvas.height, design.width, design.height,
    family === "corner" ? cornerContext(fit.scale, false).quad.height : 0);
  const defsTint = tint === undefined ? nothing : tintDefs(tint, options.tint!, surface, extent);
  // The group the tile's own chrome joins: its background, its border, and the
  // corner's bezel ring. It is the default group on both surfaces.
  const chromeGroup: TintGroup = surface === "phone" ? "phonePrimary" : surface === "lock" ? "lock" : "plain";
  // iOS drops the widget's container background in `accented` mode, so a tinted
  // Home Screen preview draws no background fill at all.
  const bgDrawn = bgPaint !== undefined && !(tint !== undefined && surface === "phone");
  // Review mode fades the shape's own background and border with the layers.
  // Left at full strength, a colored background showed through the faded
  // layers and tinted the whole face, so a red one read as one big pink tap.
  const chromeFade = options.tapReview === true ? 0.35 : 1;

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
          ${bgDrawn ? svg`<g opacity=${chromeFade}>${tinted(svg`${bgFill === undefined ? nothing : svg`<defs>${bgFill.defs}</defs>`}<rect width=${tile} height=${tile} fill=${bgPaint!.fill} fill-opacity=${bgPaint!.opacity} />`, chromeGroup, tint)}</g>` : nothing}
          <g data-design-box transform="scale(${fit.scale * tileScale})">
            ${elements.map((el) => renderElement(el, design, options, charts, tint))}
            ${gridLines(design, options.grid)}
            ${guideOverlay(design, options.guides)}
          </g>
          ${options.tapReview === true && options.groundTap === true
            ? groundTapWash(elements, design, `${uid}-ground`, tile, tile, `scale(${fit.scale * tileScale})`)
            : nothing}
        </g>
        ${options.highlightSlot === true
          // On the disc's own edge, as on the other shapes.
          ? svg`<circle cx=${tile / 2} cy=${tile / 2} r=${tile / 2} fill="none" stroke="#0A84FF" stroke-width="2"
              vector-effect="non-scaling-stroke" pointer-events="none" />`
          : nothing}
        <circle cx=${tile / 2} cy=${tile / 2} r=${tile / 2} fill="none"
          stroke="rgba(255,255,255,0.22)" stroke-width=${0.75 * s} stroke-dasharray=${`${2 * s} ${2 * s}`} />
        <g opacity=${chromeFade}>${tinted(chrome, chromeGroup, tint)}</g>
        <g transform="scale(${fit.scale * tileScale})">${handleLayer(elements, design, options, charts)}</g>
      </g>`;
    }
    return svg`<svg viewBox=${`0 0 ${ctx.quad.width} ${ctx.quad.height}`} xmlns="http://www.w3.org/2000/svg" class="complication corner"
        width=${ctx.quad.width} height=${ctx.quad.height}>
      <defs><clipPath id=${uid}><circle cx=${tile / 2} cy=${tile / 2} r=${tile / 2} /></clipPath>${defsTint}</defs>
      <path d=${shell} fill="#000000" />
      ${tinted(bezel, surface === "phone" ? "phoneAccent" : "accent", tint)}
      ${curvedMode ? tinted(main, surface === "phone" ? "phoneAccent" : "accent", tint) : main}
      ${curvedMode ? nothing : spotlight(elements, design, options.spotlightIds, `${uid}-spot`, ctx.quad.width, ctx.quad.height,
        `translate(${slotX} ${slotY}) scale(${fit.scale * tileScale})`)}
      ${options.flash === undefined
        ? nothing
        : options.flash.frame === undefined
          // The corner's flash rings the content disc, not the screen quadrant
          // the preview draws around it: the widget is only the disc.
          ? svg`<circle class="wa-flash" pointer-events="none" cx=${slotX + tile / 2} cy=${slotY + tile / 2}
              r=${tile / 2} fill="none" stroke=${options.flash.color} stroke-width=${FLASH.circleStroke * s} />`
          : flashTapRing(options.flash.frame, options.flash.color, design,
              { x: slotX, y: slotY, scale: fit.scale * tileScale })}
    </svg>`;
  }

  // A Home Screen tile is drawn inside the system's rounded corner, which is
  // where iOS clips the widget. The watch shapes have no corner of their own.
  const rx = isHomeTile(family) ? HOME_TILE_CORNER_RADIUS * fit.scale : 0;
  const clip = svg`<rect width=${canvas.width} height=${canvas.height} rx=${rx} />`;
  const chrome = border
    ? svg`<rect x=${bw / 2} y=${bw / 2} width=${canvas.width - bw} height=${canvas.height - bw} rx=${Math.max(0, rx - bw / 2)} fill="none" stroke=${border.color} stroke-opacity=${border.opacity} stroke-width=${bw} />`
    : nothing;
  // Editor affordance: a black well when there is no background so white
  // layers stay visible (the watch face itself is black).
  const well = svg`<rect width=${canvas.width} height=${canvas.height} rx=${rx} fill="#000000" />`;
  const viewBox = `0 0 ${canvas.width} ${canvas.height}`;

  return svg`<svg viewBox=${viewBox} xmlns="http://www.w3.org/2000/svg" class="complication ${family}"
      width=${canvas.width} height=${canvas.height}>
    <defs><clipPath id=${uid}>${clip}</clipPath>${defsTint}</defs>
    <g clip-path=${`url(#${uid})`}>
      ${well}
      ${bgDrawn ? svg`<g opacity=${chromeFade}>${tinted(svg`${bgFill === undefined ? nothing : svg`<defs>${bgFill.defs}</defs>`}<rect width=${canvas.width} height=${canvas.height} rx=${rx} fill=${bgPaint!.fill} fill-opacity=${bgPaint!.opacity} />`, chromeGroup, tint)}</g>` : nothing}
      <g data-design-box transform="translate(${fit.x} ${fit.y}) scale(${fit.scale})">
        ${elements.map((el) => renderElement(el, design, options, charts, tint))}
            ${gridLines(design, options.grid)}
            ${guideOverlay(design, options.guides)}
      </g>
      ${options.tapReview === true && options.groundTap === true
        ? groundTapWash(elements, design, `${uid}-ground`, canvas.width, canvas.height, `translate(${fit.x} ${fit.y}) scale(${fit.scale})`)
        : nothing}
    </g>
    ${options.highlightSlot === true
      // On the slot's own edge. The stroke is centred on it, and the svg cuts
      // off the outer half, so what shows is a 2px ring just inside the face.
      // An inset in design points moved with the zoom: at 6px a point it left
      // a band of face outside the ring that read as not part of it.
      ? svg`<rect width=${canvas.width} height=${canvas.height} rx=${rx}
          fill="none" stroke="#0A84FF" stroke-width="4" vector-effect="non-scaling-stroke" pointer-events="none" />`
      : nothing}
    <g opacity=${chromeFade}>${tinted(chrome, chromeGroup, tint)}</g>
    <g transform="translate(${fit.x} ${fit.y}) scale(${fit.scale})">${handleLayer(elements, design, options, charts)}</g>
    ${spotlight(elements, design, options.spotlightIds, `${uid}-spot`, canvas.width, canvas.height, `translate(${fit.x} ${fit.y}) scale(${fit.scale})`)}
    ${options.flash === undefined
      ? nothing
      : options.flash.frame === undefined
        ? flashShapeRing(family, options.flash.color, canvas, fit.scale)
        : flashTapRing(options.flash.frame, options.flash.color, design, { x: fit.x, y: fit.y, scale: fit.scale })}
  </svg>`;
}

/**
 * The boxes a spotlight cuts out, in design-box points: each named layer's
 * outline box (what its selection and hit box use) and the turn it is drawn
 * at. Layers the layout does not draw are skipped.
 */
export function spotlightBoxes(elements: readonly ResolvedElement[], design: CanvasSize, ids: readonly string[]): { box: Box; rotation: number }[] {
  return elements
    .filter((el) => ids.includes(el.id) && el.kind !== "tap")
    .map((el) => {
      const frame = frameBox(el, design);
      const box = layerOutline(el, frame);
      return { box: { ...box, cx: frame.cx, cy: frame.cy }, rotation: el.frame.rotationDegrees };
    });
}

/** Everything but the named layers pushed back under a dark veil, with an
 * accent ring round each one. `transform` maps design points into the SVG. */
function spotlight(elements: readonly ResolvedElement[], design: CanvasSize, ids: readonly string[] | undefined,
  maskId: string, width: number, height: number, transform: string) {
  if (ids === undefined || ids.length === 0) return nothing;
  const boxes = spotlightBoxes(elements, design, ids);
  const shape = (b: { box: Box; rotation: number }, attrs: "hole" | "ring") => {
    const { box, rotation } = b;
    const turn = `rotate(${rotation} ${box.cx} ${box.cy})`;
    return attrs === "hole"
      ? svg`<rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} rx="2" fill="#000000" transform=${turn} />`
      : svg`<rect x=${box.x} y=${box.y} width=${box.w} height=${box.h} rx="2" fill="none" transform=${turn}
          style="stroke: var(--wa-accent, #7b6cff)" stroke-width="2" vector-effect="non-scaling-stroke" />`;
  };
  return svg`<g class="spotlight" pointer-events="none">
    <defs><mask id=${maskId} maskUnits="userSpaceOnUse" x="0" y="0" width=${width} height=${height}>
      <rect width=${width} height=${height} fill="#ffffff" />
      <g transform=${transform}>${boxes.map((b) => shape(b, "hole"))}</g>
    </mask></defs>
    <rect width=${width} height=${height} fill="#000000" fill-opacity="0.62" mask=${`url(#${maskId})`} />
    <g transform=${transform}>${boxes.map((b) => shape(b, "ring"))}</g>
  </g>`;
}

/** A tap zone in design-box points. Upright: the watch tests a press against
 * a tap's frame as it is, without its turn (see `demo.ts`, which mirrors it). */
export interface TapZone { x: number; y: number; w: number; h: number }

function clipZone(a: TapZone, b: TapZone): TapZone | undefined {
  const x = Math.max(a.x, b.x);
  const y = Math.max(a.y, b.y);
  const w = Math.min(a.x + a.w, b.x + b.w) - x;
  const h = Math.min(a.y + a.h, b.y + b.h) - y;
  return w > 0 && h > 0 ? { x, y, w, h } : undefined;
}

/**
 * Where a press runs a layer's tap rather than the complication's own, in
 * design-box points, by the same rules as the watch's hit test (`hitAt` in
 * demo.ts): every tap layer the face draws, attached ones at their pushed-out
 * size, and every row tap of a list, once per row and only inside its row and
 * its list. Hidden layers take no presses.
 */
export function tapZones(elements: readonly ResolvedElement[], design: CanvasSize): TapZone[] {
  const out: TapZone[] = [];
  const rect = (f: { x: number; y: number; width: number; height: number }, into: TapZone): TapZone =>
    ({ x: into.x + f.x * into.w, y: into.y + f.y * into.h, w: f.width * into.w, h: f.height * into.h });
  const walk = (els: readonly ResolvedElement[], into: TapZone, clip: TapZone | undefined) => {
    for (const el of els) {
      if (el.isHidden) continue;
      const box = rect(el.frame, into);
      if (el.kind === "tap") {
        const zone = clip ? clipZone(box, clip) : box.w > 0 && box.h > 0 ? box : undefined;
        if (zone) out.push(zone);
        continue;
      }
      if (el.kind !== "list") continue;
      const listClip = clip ? clipZone(box, clip) : box;
      if (!listClip) continue;
      for (const cell of el.cells) {
        const cellBox = rect(cell.frame, box);
        const cellClip = clipZone(cellBox, listClip);
        if (cellClip) walk(cell.elements, cellBox, cellClip);
      }
    }
  };
  walk(elements, { x: 0, y: 0, w: design.width, h: design.height }, undefined);
  return out;
}

/** Pink stripes over where the complication's own tap runs, with a hole for
 * every tap zone. Stripes rather than a flat wash, so the area reads apart
 * from the tap boxes, which are pink too. `transform` maps design points into
 * the SVG. */
function groundTapWash(elements: readonly ResolvedElement[], design: CanvasSize, maskId: string,
  width: number, height: number, transform: string) {
  const zones = tapZones(elements, design);
  return svg`<g class="ground-tap" pointer-events="none">
    <defs><mask id=${maskId} maskUnits="userSpaceOnUse" x="0" y="0" width=${width} height=${height}>
      <rect width=${width} height=${height} fill="#ffffff" />
      <g transform=${transform}>${zones.map((z) => svg`<rect x=${z.x} y=${z.y} width=${z.w} height=${z.h} fill="#000000" />`)}</g>
    </mask>
    <pattern id=${`${maskId}-hatch`} width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="3" height="3" fill=${TAP_COLOR} fill-opacity="0.1" />
      <line x1="0" y1="0" x2="0" y2="3" stroke=${TAP_COLOR} stroke-opacity="0.45" stroke-width="0.5" />
    </pattern></defs>
    <rect width=${width} height=${height} fill=${`url(#${maskId}-hatch)`} mask=${`url(#${maskId})`} />
  </g>`;
}

/** The selected layer's resize handles, or the selected group's box and
 * its handles, for the pass drawn above the slot clip. */
function handleLayer(elements: readonly ResolvedElement[], design: CanvasSize, options: RenderOptions, charts: ReadonlyMap<string, ResolvedChart>) {
  if (options.handles !== true) return nothing;
  if (options.groupBox !== undefined) return groupBoxHandles(options.groupBox, design, options.handleHit ?? 0);
  if (options.highlightId === undefined) return nothing;
  const el = elements.find((e) => e.id === options.highlightId);
  return el === undefined ? nothing : renderElement(el, design, options, charts, undefined, "handles");
}

/**
 * A selected group's box: one solid line around every member, so it reads
 * apart from the members' own dashed outlines, and a handle at each corner
 * and in the middle of each side. The handles sit just outside the box, as a
 * layer's do. `data-group-box` is how a press tells them from a layer's.
 */
function groupBoxHandles(frame: NormalizedFrame, design: CanvasSize, grab: number) {
  const x = frame.x * design.width;
  const y = frame.y * design.height;
  const w = frame.width * design.width;
  const h = frame.height * design.height;
  const hs = 3;
  const mx = x + w / 2 - hs / 2;
  const my = y + h / 2 - hs / 2;
  const spots: [string, number, number][] = [
    ["nw", x - hs, y - hs], ["n", mx, y - hs], ["ne", x + w, y - hs],
    ["w", x - hs, my], ["e", x + w, my],
    ["sw", x - hs, y + h], ["s", mx, y + h], ["se", x + w, y + h],
  ];
  return svg`<g data-group-box="">
    <rect x=${x} y=${y} width=${w} height=${h} fill="none" stroke="#0A84FF" stroke-width="1" vector-effect="non-scaling-stroke" pointer-events="none" />
    ${spots.map(([spot, hx, hy]) => svg`${grab > hs
      ? svg`<rect data-handle=${spot} x=${hx + hs / 2 - grab / 2} y=${hy + hs / 2 - grab / 2} width=${grab} height=${grab} fill="transparent" stroke="none" />`
      : nothing}<rect data-handle=${spot} x=${hx} y=${hy} width=${hs} height=${hs}
      fill="#FFFFFF" stroke="#0A84FF" stroke-width="0.5" style="cursor:${spot}-resize" />`)}
  </g>`;
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
  // The background's gradient, over the whole face, beating the flat color.
  const bgFill = layout.backgroundFill === undefined
    ? undefined
    : fillPaintDefs(layout.backgroundFill);
  const faceFill = bgFill !== undefined ? bgFill.paint : bg ? bg.color : "#000000";
  const faceOpacity = bgFill !== undefined ? 1 : bg ? bg.opacity : 1;
  const border = parseColor(layout.borderColorHex);
  const bw = layout.borderWidth;
  const render: RenderOptions = {
    icons: options.icons, showHidden: true, tapAreas: true,
    minDotRadius: crop.w / 40, minGridStroke: crop.w / 110,
    ...(options.imageSizes ? { imageSizes: options.imageSizes } : {}),
  };
  const picked = layout.elements.filter((el) => ids.includes(el.id));
  // Three shapes of face, not two: a square one for rectangular, a disc for
  // the round watch shapes, and a rounded tile for the Home Screen sizes.
  const shape: "rect" | "circle" | "rounded" = family === "rectangular"
    ? "rect"
    : isHomeTile(family) ? "rounded" : "circle";
  const rx = shape === "rounded" ? HOME_TILE_CORNER_RADIUS : 0;
  const chrome = border && bw > 0
    ? (shape === "circle"
      ? svg`<circle cx=${design.width / 2} cy=${design.height / 2} r=${design.width / 2 - bw / 2} fill="none" stroke=${border.color} stroke-opacity=${border.opacity} stroke-width=${bw} />`
      : svg`<rect x=${bw / 2} y=${bw / 2} width=${design.width - bw} height=${design.height - bw} rx=${Math.max(0, rx - bw / 2)} fill="none" stroke=${border.color} stroke-opacity=${border.opacity} stroke-width=${bw} />`)
    : nothing;
  const face = shape === "circle"
    ? svg`<circle cx=${design.width / 2} cy=${design.height / 2} r=${design.width / 2} fill=${faceFill} fill-opacity=${faceOpacity} />`
    : svg`<rect width=${design.width} height=${design.height} rx=${rx} fill=${faceFill} fill-opacity=${faceOpacity} />`;
  return svg`<svg viewBox=${`${crop.x} ${crop.y} ${crop.w} ${crop.h}`} xmlns="http://www.w3.org/2000/svg" class="thumb ${family}"
      width=${options.width} height=${options.height} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <rect x=${crop.x} y=${crop.y} width=${crop.w} height=${crop.h} fill="#000000" />
    ${bgFill === undefined ? nothing : svg`<defs>${bgFill.defs}</defs>`}
    ${face}
    ${picked.map((el) => renderElement(el, design, render, chartsById(layout.elements)))}
    ${chrome}
  </svg>`;
}

export function familyTitle(family: FamilyKind): string {
  switch (family) {
    case "rectangular": return "Rectangular";
    case "circular": return "Circular";
    case "corner": return "Corner";
    case "inline": return "Inline";
    case "small": return "Small";
    case "medium": return "Medium";
    case "large": return "Large";
    case "xlarge": return "Extra Large";
  }
}
