// The row of small live previews under the canvas: every other shape of the
// complication, drawn by the same renderer the big one uses, off the same
// resolved values.
//
// The middle column used to be one shape and a lot of empty space, so a
// complication with five shapes was five trips round the tabs to see what a
// change did. The previews are view-only on purpose: a click picks the shape
// up into the canvas rather than editing it where it stands, which keeps one
// set of drag handles on screen and one shape being edited at a time.

import { type TemplateResult, html, nothing } from "lit";

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
import { type IconProvider, estimateTextWidth, familyTitle, renderLayout } from "./renderer.js";
import { type ImageSizeProvider } from "./image-sizes.js";
import { uiIcon } from "./ui-icons.js";

// ── which shapes are listed ───────────────────────────────────────────────

/** What the row draws, and in which order.
 *
 * `order` is the shape bar's own order (biggest canvas first), so the row and
 * the tabs above it never disagree about where a shape sits. The shape being
 * edited is left out because it is the big one at the top, and a shape the
 * device cannot draw is left out because the bar never offered it either.
 *
 * Inline has no canvas, so it is listed only when the caller has a way to draw
 * it: the panel passes its own inline strip in.
 */
export function previewFamilies(opts: {
  order: readonly FamilyKind[];
  supported: readonly FamilyKind[];
  editing: FamilyKind;
  hidden: ReadonlySet<FamilyKind>;
  inline?: boolean;
}): FamilyKind[] {
  return opts.order.filter((f) =>
    f !== opts.editing
    && opts.supported.includes(f)
    && !opts.hidden.has(f)
    && (hasCanvas(f) || opts.inline === true));
}

/** Flip one shape's preview on or off, as a new set: the panel holds the old
 * one as state, so it is never edited in place. */
export function togglePreviewHidden(hidden: ReadonlySet<FamilyKind>, family: FamilyKind): Set<FamilyKind> {
  const next = new Set(hidden);
  if (next.has(family)) next.delete(family);
  else next.add(family);
  return next;
}

// ── the choice, remembered per complication ───────────────────────────────

/** Every key this module writes starts with it, so one complication's choice
 * is found and cleared without touching the panel's other stored settings. */
export const PREVIEW_STORE_PREFIX = "wa.previews.";

export function previewStoreKey(configId: string): string {
  return `${PREVIEW_STORE_PREFIX}${configId}`;
}

/** Which shapes the reader switched off for this complication.
 *
 * In the browser, never in the document: it is which previews one person wants
 * to look at while they work, not something the watch or another editor should
 * ever see. What is stored is the shapes that are off, so a shape added later
 * starts shown rather than hidden by a list written before it existed.
 *
 * A browser with storage off, or a key another version wrote, reads as "none
 * hidden", which is the state the row starts in anyway.
 */
export function loadPreviewHidden(configId: string, storage?: Storage): Set<FamilyKind> {
  const store = storage ?? safeStorage();
  if (!store) return new Set();
  try {
    const raw = store.getItem(previewStoreKey(configId));
    if (!raw) return new Set();
    const saved = JSON.parse(raw) as { hidden?: unknown };
    if (!Array.isArray(saved.hidden)) return new Set();
    return new Set(saved.hidden.filter((f): f is FamilyKind => typeof f === "string") as FamilyKind[]);
  } catch {
    return new Set();
  }
}

export function savePreviewHidden(configId: string, hidden: ReadonlySet<FamilyKind>, storage?: Storage): void {
  const store = storage ?? safeStorage();
  if (!store) return;
  try {
    const key = previewStoreKey(configId);
    if (hidden.size === 0) store.removeItem(key);
    else store.setItem(key, JSON.stringify({ hidden: [...hidden] }));
  } catch {
    /* Storage off: the choice still holds for this visit. */
  }
}

function safeStorage(): Storage | undefined {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}

// ── how big each preview is drawn ─────────────────────────────────────────

/** The box one preview may take, in CSS pixels. Wide enough that Rectangular
 * stays readable, short enough that three rows of previews fit under the
 * canvas without the column scrolling on a laptop. */
export const PREVIEW_ROOM = { width: 208, height: 168 };

/**
 * One preview's drawn size: its own shape, as big as the room allows.
 *
 * Each shape is fitted to the same box rather than the whole set being drawn
 * to one scale. To one scale, a set holding Extra Large (557 pt tall against
 * Rectangular's 65) shrinks every other shape to a smear; fitted, a tall shape
 * is narrow and a wide one is short, and each is legible. The tabs above the
 * canvas are where the shapes are compared against the device.
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

/**
 * The layer on `family` that stands where the selected one stands on the shape
 * being edited, so selecting a layer shows where it sits on every shape.
 *
 * Every layer belongs to one shape, so a shape seeded from another holds
 * copies under ids of their own and there is nothing to look the selection up
 * by. What the two shapes do share, until somebody adds or removes a layer, is
 * the stack: the copies arrived in order and kept it. So the twin is the layer
 * at the same place in the stack, and only while the two shapes still hold the
 * same kinds of layer in the same order. A shape that has since gone its own
 * way highlights nothing, which is honest: there is no twin any more.
 */
export function twinLayerId(
  cfg: CustomComplicationConfig,
  editing: FamilyKind,
  family: FamilyKind,
  id: string | undefined,
): string | undefined {
  if (id === undefined || family === editing) return id;
  const here = ownedElements(cfg, editing).filter((el) => !isAttachedTap(cfg, el));
  const there = ownedElements(cfg, family).filter((el) => !isAttachedTap(cfg, el));
  if (here.length === 0 || here.length !== there.length) return undefined;
  if (here.some((el, i) => el.kind !== there[i]!.kind)) return undefined;
  const at = here.findIndex((el) => el.payload.id === id);
  return at < 0 ? undefined : there[at]!.payload.id;
}

// ── how a preview is tinted ───────────────────────────────────────────────

/**
 * The tint a preview is drawn under, and which surface it stands for.
 *
 * An iPhone draws its Lock Screen complications the way a tinted watch face
 * does: colour dropped, every layer painted white through its own alpha. So a
 * phone owner's Lock Screen shapes preview in white unless the tint tool is
 * asking for another colour, and the Home Screen tiles preview in full colour,
 * since that is what the phone really draws there.
 */
export function previewTintFor(family: DrawableFamily, phone: boolean, override: string | undefined): { tint?: string; tintSurface?: "watch" | "phone" } {
  const home = family === "small" || family === "medium" || family === "large" || family === "xlarge";
  if (home) return override === undefined ? {} : { tint: override, tintSurface: "phone" };
  const tint = override ?? (phone ? "#FFFFFF" : undefined);
  return tint === undefined ? {} : { tint, tintSurface: "watch" };
}

// ── the row itself ────────────────────────────────────────────────────────

export interface ShapePreviewsState {
  config: CustomComplicationConfig;
  /** The shape in the big canvas. It is never in the row. */
  editing: FamilyKind;
  /** The shape bar's order, which is this device's shapes, biggest first. */
  order: readonly FamilyKind[];
  /** The same layouts the canvas draws: one resolve per render, shared. */
  layouts: ResolvedAll;
  /** Shapes switched off for this complication. */
  hidden: ReadonlySet<FamilyKind>;
  icons: IconProvider;
  imageSizes?: ImageSizeProvider;
  /** The selected layer on the shape being edited, so its twin outlines here. */
  highlightId?: string;
  /** The device being previewed as, for the Lock Screen's white. */
  phone: boolean;
  /** The tint tool's colour, when it is on. */
  tint?: string;
  /** The real slot each shape is drawn in, from the Preview as case. */
  slotFor?: (family: DrawableFamily) => CanvasSize;
  /** The Inline strip, drawn by the panel, when Inline is one of the shapes. */
  inline?: () => unknown;
  /** Take this shape into the canvas. The one it replaces joins the row. */
  onEdit: (family: FamilyKind) => void;
}

/**
 * Every other shape of the complication, under the canvas.
 *
 * Nothing at all when there is one shape, or when every other one is switched
 * off: an empty strip with a heading on it is worse than the space it fills.
 */
export function renderShapePreviews(state: ShapePreviewsState): TemplateResult | typeof nothing {
  const families = previewFamilies({
    order: state.order,
    supported: state.config.supportedFamilies,
    editing: state.editing,
    hidden: state.hidden,
    inline: state.inline !== undefined,
  });
  if (families.length === 0) return nothing;
  return html`<div class="shape-previews" aria-label="The other shapes">
    ${families.map((f) => renderOne(state, f))}
  </div>`;
}

function renderOne(state: ShapePreviewsState, family: FamilyKind): TemplateResult {
  const title = familyTitle(family);
  const art = hasCanvas(family) ? renderCanvasPreview(state, family) : state.inline?.() ?? nothing;
  const layout = hasCanvas(family) ? state.layouts[family] : undefined;
  const warnings = layout === undefined ? [] : previewWarnings(layout);
  const size = hasCanvas(family) ? previewBox(family) : { width: PREVIEW_ROOM.width, height: 0 };
  return html`<button type="button" class=${`shape-preview ${family}`}
    style=${`--pw:${Math.round(size.width)}px`}
    title=${`Edit the ${title} shape`}
    @click=${() => state.onEdit(family)}>
    <span class="art">${art}</span>
    <span class="cap">
      <span class="name">${title}</span>
      ${warnings.length === 0 ? nothing : html`<span class="warn" role="img"
        aria-label=${`Worth a look: ${warnings.join(" ")}`}
        title=${warnings.join("\n")}>${uiIcon("info")}</span>`}
    </span>
  </button>`;
}

function renderCanvasPreview(state: ShapePreviewsState, family: FamilyKind) {
  if (!hasCanvas(family)) return nothing;
  const layout = state.layouts[family];
  if (layout === undefined) return nothing;
  const highlight = twinLayerId(state.config, state.editing, family, state.highlightId);
  const slot = state.slotFor?.(family);
  return renderLayout(layout, {
    icons: state.icons,
    ...(state.imageSizes ? { imageSizes: state.imageSizes } : {}),
    ...(slot ? { slot } : {}),
    ...(highlight !== undefined ? { highlightId: highlight } : {}),
    ...previewTintFor(family, state.phone, state.tint),
  });
}

/**
 * The row's own styles, injected into the panel's sheet the way the Layers
 * rows' container queries are. Each preview is as wide as its shape wants
 * (`--pw`, from `previewBox`), and the row wraps and scrolls rather than
 * squeezing a tall tile into a line of thumbnails.
 */
export function shapePreviewCss(): string {
  return `
    .shape-previews {
      display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-end; gap: 14px 16px;
      width: 100%; max-height: ${PREVIEW_ROOM.height * 2 + 90}px; overflow: auto; padding: 2px;
    }
    .shape-preview {
      font: inherit; background: none; border: 0; padding: 0; cursor: pointer;
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      width: var(--pw, ${PREVIEW_ROOM.width}px); max-width: 100%; color: var(--wa-muted);
    }
    .shape-preview:hover { color: var(--wa-ink); }
    .shape-preview:focus-visible { outline: none; }
    .shape-preview .art { display: block; width: 100%; border-radius: 10px; }
    .shape-preview .art svg {
      display: block; width: 100%; height: auto; background: #000;
      box-shadow: 0 0 0 1px rgba(255,255,255,.08), 0 8px 20px rgba(0,0,0,.4);
    }
    .shape-preview.circular .art svg, .shape-preview.corner .art svg { border-radius: 50%; }
    .shape-preview.rectangular .art svg { border-radius: 10px; }
    .shape-preview.small .art svg { border-radius: 16.3%; }
    .shape-preview.medium .art svg { border-radius: 7.7% / 16.3%; }
    .shape-preview.large .art svg { border-radius: 7.7% / 7.4%; }
    .shape-preview.xlarge .art svg { border-radius: 7.7% / 4.8%; }
    .shape-preview:hover .art svg, .shape-preview:focus-visible .art svg {
      box-shadow: 0 0 0 2px var(--wa-accent), 0 8px 20px rgba(0,0,0,.4);
    }
    /* Inline has no canvas: the panel hands its own strip over, and it is
       drawn here the way it is drawn on the stage, a size down. */
    .shape-preview .art .inline-line {
      display: inline-flex; align-items: center; justify-content: center; gap: 5px;
      padding: 6px 14px; border-radius: 999px; background: #000; color: #fff; font-size: 12px;
    }
    .shape-preview .art .inline-line svg {
      display: inline-block; width: auto; height: auto; background: transparent; border-radius: 0; box-shadow: none;
    }
    .shape-preview .art .inline-line.missing { color: #999; font-style: italic; }
    .shape-preview .cap { display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; font-weight: 600; }
    .shape-preview .warn { display: inline-flex; color: var(--wa-val); }
    .shape-preview .warn svg { width: 14px; height: 14px; }
  `;
}
