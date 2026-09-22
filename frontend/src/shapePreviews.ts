// The live picture on the shape tab: the complication's shape, drawn by the
// same renderer the big one uses, off the same resolved values.
//
// The bar used to carry one tab per shape, because a document held up to eight
// of them and the row of tabs was the answer to "what does this design look
// like everywhere". A complication is one shape now, so the tab is a picture
// of the thing being edited rather than a way to move between shapes.

import { type TemplateResult, nothing } from "lit";

import {
  DESIGN_BOX,
  type CustomComplicationConfig,
  type DrawableFamily,
  type FamilyKind,
  hasCanvas,
  isAttachedTap,
  ownedElements,
} from "./model.js";
import { type ResolvedAll, type ResolvedLayout, type CanvasSize } from "./resolver.js";
import { type IconProvider, estimateTextWidth, renderLayout } from "./renderer.js";
import { type ImageSizeProvider } from "./image-sizes.js";

// ── how big each preview is drawn ─────────────────────────────────────────

/** The box one tab's picture may take, in CSS pixels. Small enough that a
 * complication with five shapes is still one row on a laptop, big enough that
 * Rectangular reads as a layout rather than a smudge. */
export const PREVIEW_ROOM = { width: 100, height: 66 };

/**
 * One preview's drawn size: its own shape, as big as the room allows.
 *
 * Each shape is fitted to the same box rather than the whole set being drawn
 * to one scale. To one scale, a set holding Extra Large (557 pt tall against
 * Rectangular's 65) shrinks every other shape to a smear; fitted, a tall shape
 * is narrow and a wide one is short, and each is legible. How the shapes
 * compare against the device is the stage's job, not the tabs'.
 */
export function previewBox(family: DrawableFamily, room: { width: number; height: number } = PREVIEW_ROOM): { width: number; height: number; scale: number } {
  const box = DESIGN_BOX[family];
  const scale = Math.min(room.width / box.width, room.height / box.height);
  return { width: box.width * scale, height: box.height * scale, scale };
}

// ── what is wrong with a shape ────────────────────────────────────────────

/** Half a percent of the canvas: a layer sat exactly on the edge is not a
 * problem, and rounding a frame through the editor's own fields lands a
 * fraction either side of it. */
const EDGE_TOLERANCE = 0.005;

/** Whether a frame's farthest corner falls outside the circle the system masks
 * a round shape to. The design box is the square around that circle, so a
 * layout that runs the full width has its ends cut off. */
function outsideRim(frame: { x: number; y: number; width: number; height: number }): boolean {
  const dx = Math.max(Math.abs(frame.x - 0.5), Math.abs(frame.x + frame.width - 0.5));
  const dy = Math.max(Math.abs(frame.y - 0.5), Math.abs(frame.y + frame.height - 0.5));
  return Math.hypot(dx, dy) > 0.5 + EDGE_TOLERANCE;
}

/** The longest run of characters with no space in it: the part of a string
 * that cannot be wrapped onto another line. */
function longestWord(text: string): string {
  let longest = "";
  for (const word of text.split(/\s+/)) if (word.length > longest.length) longest = word;
  return longest;
}

/**
 * What is worth warning about on one shape, as short lines for its badge.
 *
 * Read off what the shape actually draws, so a layer a rule hid, or a shape
 * whose layers were refitted onto a canvas too small for them, is judged on
 * the drawing rather than on the document. Every test is conservative: it says
 * something only when the shape is certainly wrong, because a badge that cries
 * wolf is worse than no badge.
 *
 * Text is the one kind of clipping the panel can see without laying the string
 * out: a word with no space in it cannot be wrapped, so when it is wider than
 * its layer even shrunk as far as the layer allows, the watch truncates it.
 */
export function previewWarnings(layout: ResolvedLayout): string[] {
  const family = (hasCanvas(layout.family) ? layout.family : "rectangular") as DrawableFamily;
  const box = DESIGN_BOX[family];
  const round = family === "circular" || family === "corner";
  const drawn = layout.elements.filter((el) => !el.isHidden && el.kind !== "tap");
  let off = 0;
  let rim = 0;
  let cut = 0;
  for (const el of drawn) {
    const f = el.frame;
    if (f.x < -EDGE_TOLERANCE || f.y < -EDGE_TOLERANCE
      || f.x + f.width > 1 + EDGE_TOLERANCE || f.y + f.height > 1 + EDGE_TOLERANCE) off++;
    else if (round && outsideRim(f)) rim++;
    if (el.kind !== "text" || el.arc || el.parts || el.countdownEnd !== undefined) continue;
    const word = longestWord(el.text);
    if (word === "") continue;
    const smallest = el.fontSize * Math.min(1, Math.max(0.1, el.minimumScale));
    if (estimateTextWidth(word, smallest) > f.width * box.width) cut++;
  }
  const lines: string[] = [];
  if (off > 0) lines.push(`${off} ${off === 1 ? "layer hangs" : "layers hang"} off the edge.`);
  if (rim > 0) lines.push(`${rim} ${rim === 1 ? "layer runs" : "layers run"} under the rim.`);
  if (cut > 0) lines.push(`Text is cut short on ${cut} ${cut === 1 ? "layer" : "layers"}.`);
  return lines;
}

// ── the selected layer, on the other shapes ───────────────────────────────

// ── how a preview is tinted ───────────────────────────────────────────────

/**
 * The tint a preview is drawn under, and which surface it stands for.
 *
 * An iPhone draws its Lock Screen complications the way a tinted watch face
 * does: color dropped, every layer painted white through its own alpha. So a
 * phone owner's Lock Screen shapes preview in white unless the tint tool is
 * asking for another color, and the Home Screen tiles preview in full color,
 * since that is what the phone really draws there.
 */
export function previewTintFor(family: DrawableFamily, phone: boolean, override: string | undefined): { tint?: string; tintSurface?: "watch" | "phone" } {
  const home = family === "small" || family === "medium" || family === "large" || family === "xlarge";
  if (home) return override === undefined ? {} : { tint: override, tintSurface: "phone" };
  const tint = override ?? (phone ? "#FFFFFF" : undefined);
  return tint === undefined ? {} : { tint, tintSurface: "watch" };
}

// ── one tab's picture ─────────────────────────────────────────────────────

export interface ShapeArtState {
  config: CustomComplicationConfig;
  /** The same layouts the canvas draws: one resolve per render, shared. */
  layouts: ResolvedAll;
  icons: IconProvider;
  imageSizes?: ImageSizeProvider;
  /** The selected layer, so it outlines in the tab's picture too. */
  highlightId?: string;
  /** The device being previewed as, for the Lock Screen's white. */
  phone: boolean;
  /** The tint tool's color, when it is on. */
  tint?: string;
  /** The real slot each shape is drawn in, from the Preview as case. */
  slotFor?: (family: DrawableFamily) => CanvasSize;
}

/**
 * The complication's shape, drawn small for its tab: the same layout the stage
 * would draw, under the same tint, with the selected layer outlined.
 *
 * Inline has no canvas of its own, so the panel draws that one: this is the
 * shapes that resolve to a layout.
 */
export function renderShapeArt(state: ShapeArtState, family: FamilyKind): TemplateResult | typeof nothing {
  if (!hasCanvas(family)) return nothing;
  const layout = state.layouts[family];
  if (layout === undefined) return nothing;
  const highlight = state.highlightId;
  const slot = state.slotFor?.(family);
  return renderLayout(layout, {
    icons: state.icons,
    ...(state.imageSizes ? { imageSizes: state.imageSizes } : {}),
    ...(slot ? { slot } : {}),
    ...(highlight !== undefined ? { highlightId: highlight } : {}),
    ...previewTintFor(family, state.phone, state.tint),
  });
}

