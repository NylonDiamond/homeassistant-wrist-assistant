// The pictures that go with a gallery upload: each canvas shape of the shared
// document, drawn the way the panel draws it, as a PNG.
//
// What is drawn is the scrubbed document, the one the gallery will hold, so a
// friendly name a layer prints is the slot label and never the entity's own
// name. Only the author's live values are copied across, onto the placeholder
// ids, so the picture shows real numbers instead of dashes.
//
// Picture layers draw as a stand-in: a small drawn landscape for a camera or a
// photo, and the watch's faint glyph box for a person or media. A picture is a camera
// frame, a person's avatar or album art from this house, served from this Home
// Assistant with an access token in its address. Drawing it would put a
// private photo into a public preview, and the canvas would refuse to export
// it anyway, since the image comes from another origin. The copied states
// carry no picture address, so the renderer falls back to the stand-in.

import { html, render, svg, type TemplateResult } from "lit";
import {
  type CustomComplicationConfig,
  type DrawableFamily,
  type Value,
  DESIGN_BOX,
  DRAWABLE_FAMILIES,
  chartHistoryKey,
  chartStatisticsKey,
  forEachValue,
  imageTimestampLayersOf,
  inlineRuns,
  timelineHistoryKey,
} from "./model.js";
import { keyFor, listExpressionKey, listKey } from "./compiler.js";
import { type EntityState, type ResolveContext, type ResolvedInline, type ResolvedLayout, resolveAll } from "./resolver.js";
import { type IconProvider, renderLayout } from "./renderer.js";
import { type ShareSlot, scrubForShare } from "./transfer.js";
import { GALLERY_LIMITS, type GalleryPreview } from "./gallery.js";
import { INLINE_MAX_CHARS } from "./shapeArt.js";

/** Pixels per design point. Tried first; smaller scales follow only when a
 * busy picture comes out over the gallery's size limit. */
export const PREVIEW_SCALE = 2;
const SCALES = [PREVIEW_SCALE, 1.5, 1];

/** What the panel knows live about the author's house. */
export interface PreviewSource {
  entityState(entityId: string): EntityState | undefined;
  templateResults: ReadonlyMap<string, string>;
  historySeries: ReadonlyMap<string, string>;
  /** The replies the service-backed lists came back with, by their readable
   * key. Absent draws those lists empty, which is what a document whose items
   * have not arrived yet draws anyway. */
  listItems?: ReadonlyMap<string, string>;
}

/** The scrubbed document ready for a public picture: picture layers stay, to
 * be drawn as stand-ins, but the timestamps on them go, since a stand-in has
 * no time to show. A timestamp is an old `imageTime` layer, or a text reading
 * a picture's time with the capsule grouped behind it. */
export function withPicturePlaceholders(cfg: CustomComplicationConfig): CustomComplicationConfig {
  const next = structuredClone(cfg);
  const gone = new Set<string>();
  for (const el of next.elements) {
    if (el.kind === "imageTime") gone.add(el.payload.id);
    if (el.kind === "image") for (const t of imageTimestampLayersOf(next, el.payload.id)) gone.add(t.payload.id);
  }
  next.elements = next.elements.filter((el) => !gone.has(el.payload.id));
  return next;
}

/**
 * A resolve context for the scrubbed document, holding the author's live
 * values under the ids and keys the scrubbed document uses.
 *
 * `scrubbed` must be `scrubForShare(cfg, slots)` itself, before anything is
 * removed from it: the scrub keeps the document's shape, so the nth value and
 * the nth layer on each side are the same one, and that pairing is how a
 * template result or a history series finds its new key.
 *
 * No `page`: a paged document is previewed on page 1 here, whatever page its
 * author happened to be editing. A share or a gallery picture is the first
 * thing the complication shows, and page 1 is that.
 */
export function galleryPreviewContext(
  cfg: CustomComplicationConfig,
  scrubbed: CustomComplicationConfig,
  slots: readonly ShareSlot[],
  source: PreviewSource,
): ResolveContext {
  const entityStates = new Map<string, EntityState>();
  for (const slot of slots) {
    const live = source.entityState(slot.originalId);
    if (!live) continue;
    // Values only. The icon and the picture address stay behind.
    const copy: EntityState = { ...live, entityId: slot.placeholderId, iconName: "" };
    delete copy.entityPicture;
    entityStates.set(slot.placeholderId, copy);
  }

  const from: Value[] = [];
  const to: Value[] = [];
  forEachValue(cfg, (v) => { from.push(v); });
  forEachValue(scrubbed, (v) => { to.push(v); });
  const templateResults = new Map<string, string>();
  for (let i = 0; i < Math.min(from.length, to.length); i++) {
    const oldKey = keyFor(from[i]!, cfg.values);
    const newKey = keyFor(to[i]!, scrubbed.values);
    if (oldKey === undefined || newKey === undefined) continue;
    const result = source.templateResults.get(oldKey);
    if (result !== undefined) templateResults.set(newKey, result);
  }

  const historySeries = new Map<string, string>();
  const listItems = new Map<string, string>();
  const copy = (from: ReadonlyMap<string, string>, into: Map<string, string>) =>
    (oldKey: string | undefined, newKey: string | undefined) => {
      if (oldKey === undefined || newKey === undefined) return;
      const text = from.get(oldKey);
      if (text !== undefined) into.set(newKey, text);
    };
  const copySeries = copy(source.historySeries, historySeries);
  const copyListText = copy(source.templateResults, templateResults);
  const copyListReply = copy(source.listItems ?? new Map(), listItems);
  for (let i = 0; i < Math.min(cfg.elements.length, scrubbed.elements.length); i++) {
    const a = cfg.elements[i]!;
    const b = scrubbed.elements[i]!;
    if (a.kind === "chart" && b.kind === "chart") {
      copySeries(chartHistoryKey(a.payload), chartHistoryKey(b.payload));
      copySeries(chartStatisticsKey(a.payload), chartStatisticsKey(b.payload));
    } else if (a.kind === "timeline" && b.kind === "timeline") {
      copySeries(timelineHistoryKey(a.payload), timelineHistoryKey(b.payload));
    } else if (a.kind === "list" && b.kind === "list") {
      // A list's items are not a value, so the pairing above cannot carry them:
      // a Jinja source is keyed by its own expression, which the scrub rewrote,
      // and a service source by its readable key, which names the entities the
      // scrub replaced. Both are paired here so the picture shows the rows the
      // author is looking at rather than an empty frame.
      copyListText(listExpressionKey(a.payload.source, a.payload.rows), listExpressionKey(b.payload.source, b.payload.rows));
      copyListReply(listKey(a.payload.source), listKey(b.payload.source));
    }
  }

  return { entityStates, templateResults, historySeries, listItems, namedValues: scrubbed.values };
}

/**
 * The document's picture, drawn at its shape's own design box, so a Home
 * Screen tile comes out at the tile's proportions and a watch shape at the
 * watch's. A paged design gets one picture per page.
 *
 * A complication is one shape, so there is one picture. A document an older
 * panel wrote can still carry several shapes and still be shared: it is drawn
 * in the first, which is the shape the upload is filed under. Inline has no
 * canvas, so its picture is the line itself, words and icons, drawn by
 * `inlineLineSvg`: the gallery has no icon pack, so an icon part would
 * otherwise reach it as a bare symbol name. Browser only.
 */
export async function renderGalleryPreviews(
  cfg: CustomComplicationConfig,
  slots: readonly ShareSlot[],
  source: PreviewSource,
  icons: IconProvider,
): Promise<GalleryPreview[]> {
  const plan = galleryPreviewPlan(cfg, slots, source);
  if (plan.kind === "inline") {
    const line = inlineLineSvg(plan.inline, icons, measureWith(INLINE_FONT));
    return line ? [{ family: "inline", png: await templateToPng(line) }] : [];
  }
  if (plan.kind === "none") return [];
  const out: GalleryPreview[] = [];
  for (const { page, layout } of plan.pages) {
    const png = await templateToPng(renderLayout(layout, { icons, slot: DESIGN_BOX[plan.family], pictureScene: true }));
    out.push(page === undefined ? { family: plan.family, png } : { family: plan.family, page, png });
  }
  return out;
}

/** What the upload's pictures show, before anything is drawn: the inline
 * line, or the shape's layout once per page (`page` left off for a design
 * without pages). */
export type GalleryPreviewPlan =
  | { kind: "none" }
  | { kind: "inline"; inline: ResolvedInline }
  | { kind: "canvas"; family: DrawableFamily; pages: { page?: number; layout: ResolvedLayout }[] };

export function galleryPreviewPlan(
  cfg: CustomComplicationConfig,
  slots: readonly ShareSlot[],
  source: PreviewSource,
): GalleryPreviewPlan {
  const scrubbed = scrubForShare(cfg, slots);
  const ctx = galleryPreviewContext(cfg, scrubbed, slots, source);
  const drawn = withPicturePlaceholders(scrubbed);
  const layouts = resolveAll(drawn, ctx);
  const family = DRAWABLE_FAMILIES.find((f) => layouts[f]);
  if (family === undefined) return layouts.inline ? { kind: "inline", inline: layouts.inline } : { kind: "none" };
  const count = scrubbed.pages?.count ?? 1;
  if (count <= 1) return { kind: "canvas", family, pages: [{ layout: layouts[family]! }] };
  // A paged design is still one upload: one picture per page, page 1 first,
  // each drawn from only the layers that page shows.
  const pages: { page: number; layout: ResolvedLayout }[] = [];
  for (let page = 1; page <= count; page += 1) {
    const layout = resolveAll(drawn, { ...ctx, page })[family];
    if (layout) pages.push({ page, layout });
  }
  return { kind: "canvas", family, pages };
}

/** The inline line's type, the size the panel's own inline preview uses. */
const INLINE_SIZE = 15;
const INLINE_FONT = `600 ${INLINE_SIZE}px -apple-system, "SF Pro Text", system-ui, sans-serif`;
const INLINE_HEIGHT = 20;
/** The space between an icon and the words beside it. */
const INLINE_GAP = 3;
/** A guard only: the line is already cut to what the watch shows. */
const INLINE_MAX_WIDTH = 480;

function measureWith(font: string): (text: string) => number {
  const g = document.createElement("canvas").getContext("2d");
  if (!g) return (text) => text.length * INLINE_SIZE * 0.6;
  g.font = font;
  return (text) => g.measureText(text).width;
}

type InlineRun = { text: string } | { symbol: string };

/**
 * The line cut where the watch cuts it, by the panel's own rule
 * (`INLINE_MAX_CHARS`, `inlineShown` in shapeArt.ts): whole when it fits,
 * else the first characters and an ellipsis. An icon counts as one character.
 */
export function inlineRunsShown(runs: readonly InlineRun[]): InlineRun[] {
  const trimmed = runs.map((r) => ({ ...r }));
  const first = trimmed[0];
  if (first && "text" in first) first.text = first.text.trimStart();
  const last = trimmed[trimmed.length - 1];
  if (last && "text" in last) last.text = last.text.trimEnd();
  const kept = trimmed.filter((r) => !("text" in r) || r.text !== "");
  const size = (r: InlineRun) => ("text" in r ? [...r.text].length : 1);
  if (kept.reduce((n, r) => n + size(r), 0) <= INLINE_MAX_CHARS) return kept;
  const out: InlineRun[] = [];
  let room = INLINE_MAX_CHARS - 1;
  for (const run of kept) {
    if (room <= 0) break;
    if ("symbol" in run) {
      out.push(run);
      room -= 1;
    } else {
      const chars = [...run.text].slice(0, room);
      out.push({ text: chars.join("") });
      room -= chars.length;
    }
  }
  const end = out[out.length - 1];
  if (end && "text" in end) end.text = `${end.text.trimEnd()}…`;
  else out.push({ text: "…" });
  return out;
}

/**
 * The inline line as one SVG: the symbol, then `label: value`, with each icon
 * part drawn where it sits, white on clear, as the panel's inline preview
 * draws it, and cut where the watch cuts it. A countdown shows its fallback text, since a picture cannot tick.
 * Undefined when there is nothing to draw. `measure` gives a run's width in
 * the line's font; a test passes its own.
 */
export function inlineLineSvg(
  inline: ResolvedInline,
  icons: IconProvider,
  measure: (text: string) => number,
): TemplateResult | undefined {
  const whole: InlineRun[] = [];
  if (inline.symbol) whole.push({ symbol: inline.symbol });
  whole.push(...inlineRuns(`${inline.label ? `${inline.label}: ` : ""}${inline.text}`));
  const runs = inlineRunsShown(whole);
  const pieces: TemplateResult[] = [];
  const baseline = INLINE_HEIGHT / 2 + INLINE_SIZE * 0.36;
  const iconTop = (INLINE_HEIGHT - INLINE_SIZE) / 2;
  let x = 0;
  let last: "text" | "symbol" | undefined;
  for (const run of runs) {
    if ("symbol" in run) {
      const glyph = icons.render(run.symbol, INLINE_SIZE, "#FFFFFF");
      if (!glyph) continue;
      if (last === "text") x += INLINE_GAP;
      pieces.push(svg`<g transform="translate(${x} ${iconTop})">${glyph}</g>`);
      x += INLINE_SIZE + INLINE_GAP;
      last = "symbol";
    } else {
      pieces.push(svg`<text x=${x} y=${baseline} style="white-space: pre" font-family="-apple-system, 'SF Pro Text', system-ui, sans-serif"
        font-size=${INLINE_SIZE} font-weight="600" fill="#FFFFFF">${run.text}</text>`);
      x += measure(run.text);
      last = "text";
    }
  }
  if (pieces.length === 0) return undefined;
  if (last === "symbol") x -= INLINE_GAP;
  const width = Math.min(INLINE_MAX_WIDTH, Math.max(1, Math.ceil(x)));
  return html`<svg xmlns="http://www.w3.org/2000/svg" width=${width} height=${INLINE_HEIGHT}
    viewBox="0 0 ${width} ${INLINE_HEIGHT}">${pieces}</svg>`;
}

/**
 * Draw one rendered SVG onto a canvas and read it back as base64 PNG.
 *
 * The canvas takes the SVG's own size, which is the design box for every
 * shape but the corner, whose picture is its piece of watch face. Every icon
 * is already a path inside the SVG, so nothing outside it is needed to draw
 * it.
 */
async function templateToPng(template: TemplateResult): Promise<string> {
  const host = document.createElement("div");
  render(template, host);
  const svgEl = host.querySelector("svg");
  if (!svgEl) throw new Error("nothing was drawn");
  const width = Number(svgEl.getAttribute("width"));
  const height = Number(svgEl.getAttribute("height"));
  if (!(width > 0) || !(height > 0)) throw new Error("the drawing has no size");
  const markup = new XMLSerializer().serializeToString(svgEl);
  const image = await loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`);
  for (const scale of SCALES) {
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const g = canvas.getContext("2d");
    if (!g) throw new Error("no canvas");
    g.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (blob && blob.size <= GALLERY_LIMITS.pngBytes) return base64(blob);
  }
  throw new Error("the picture is too large");
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("the drawing could not be loaded"));
    image.src = src;
  });
}

async function base64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}
