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

import { render, type TemplateResult } from "lit";
import {
  type CustomComplicationConfig,
  type Value,
  DESIGN_BOX,
  DRAWABLE_FAMILIES,
  chartHistoryKey,
  chartStatisticsKey,
  forEachValue,
  timelineHistoryKey,
} from "./model.js";
import { keyFor, listExpressionKey, listKey } from "./compiler.js";
import { type EntityState, type ResolveContext, resolveAll } from "./resolver.js";
import { type DrawableFamily, type IconProvider, renderLayout } from "./renderer.js";
import { type ShareSlot, scrubForShare } from "./transfer.js";
import { GALLERY_LIMITS, type GalleryPreview } from "./gallery.js";

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
 * no time to show. */
export function withPicturePlaceholders(cfg: CustomComplicationConfig): CustomComplicationConfig {
  const next = structuredClone(cfg);
  next.elements = next.elements.filter((el) => el.kind !== "imageTime");
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
 * One PNG per canvas shape the document has, at most the gallery's limit.
 * Each is drawn at its own design box, so a Home Screen tile comes out at the
 * tile's proportions and a watch shape at the watch's. Inline has no canvas,
 * so it has no picture. Browser only.
 */
export async function renderGalleryPreviews(
  cfg: CustomComplicationConfig,
  slots: readonly ShareSlot[],
  source: PreviewSource,
  icons: IconProvider,
): Promise<GalleryPreview[]> {
  const scrubbed = scrubForShare(cfg, slots);
  const ctx = galleryPreviewContext(cfg, scrubbed, slots, source);
  const layouts = resolveAll(withPicturePlaceholders(scrubbed), ctx);
  const out: GalleryPreview[] = [];
  for (const family of DRAWABLE_FAMILIES) {
    const drawable = family as DrawableFamily;
    const layout = layouts[drawable];
    if (!layout) continue;
    const png = await templateToPng(renderLayout(layout, { icons, slot: DESIGN_BOX[drawable], pictureScene: true }));
    out.push({ family, png });
    if (out.length === GALLERY_LIMITS.previews) break;
  }
  return out;
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
