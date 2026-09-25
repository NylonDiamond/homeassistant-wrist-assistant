// A Browse card's picture of one complication, drawn once and kept as a PNG.
//
// The card draws one shape on one device. Drawing it live means resolving the
// document and fetching every picture layer's frame, on every render of the
// grid. So on save the panel draws the shape here, sends the PNG to Home
// Assistant, and the card shows that instead until the next save.
//
// The shape is the renderer's own SVG. It is drawn onto a canvas through an
// <img>, which loads nothing from outside the SVG, so each picture layer's
// frame is copied in as a data URL first. Every font the renderer names is a
// system font, so the text comes out the same as on the card.

import { html, render, type TemplateResult } from "lit";

/** Pixels per design point. A card shows a shape at up to about twice its
 * design size, on screens of up to two device pixels per CSS pixel. Smaller
 * scales follow only when a busy picture comes out over the limit. */
const SCALES = [3, 2, 1.5];

/** How cards are drawn now, saved with each picture. Version 1 drew a card
 * away from the editor with no templates, history or lists, so every value
 * they fill read "--" and every chart and list was empty. Version 2 could be
 * taken before the symbol catalogue had arrived, and then kept the dashed "?"
 * that stands in for a glyph not loaded yet. A picture older than this is
 * taken again. */
export const CARD_PREVIEW_VERSION = 3;

/** Under the server's 512 KB limit with room for base64 growth. */
export const CARD_PREVIEW_MAX_BYTES = 360 * 1024;

/**
 * Draw one shape's SVG as a PNG. `width` and `height` are the shape's own
 * size in design points, the same ones the card lays the picture out by.
 * Rejects when a picture layer's bytes cannot be read or the canvas refuses to
 * export, and the card then keeps drawing itself live.
 */
export async function shapeToPng(art: TemplateResult, width: number, height: number): Promise<Blob> {
  const host = document.createElement("div");
  render(html`<svg xmlns="http://www.w3.org/2000/svg" width=${width} height=${height}
    viewBox=${`0 0 ${width} ${height}`}>${art}</svg>`, host);
  const root = host.querySelector("svg");
  if (!root) throw new Error("nothing was drawn");
  await inlineImages(root);
  const markup = new XMLSerializer().serializeToString(root);
  const address = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml" }));
  try {
    const image = await loadImage(address);
    for (const scale of SCALES) {
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const g = canvas.getContext("2d");
      if (!g) throw new Error("no canvas");
      g.drawImage(image, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (blob && blob.size <= CARD_PREVIEW_MAX_BYTES) return blob;
    }
    throw new Error("the picture is too large");
  } finally {
    URL.revokeObjectURL(address);
  }
}

/** Every `<image>` in the drawing, its bytes copied in as a data URL. */
async function inlineImages(root: SVGSVGElement): Promise<void> {
  const XLINK = "http://www.w3.org/1999/xlink";
  await Promise.all([...root.querySelectorAll("image")].map(async (el) => {
    const href = el.getAttribute("href") ?? el.getAttributeNS(XLINK, "href");
    if (!href || href.startsWith("data:")) return;
    const reply = await fetch(href);
    if (!reply.ok) throw new Error(`picture HTTP ${reply.status}`);
    const data = await asDataUrl(await reply.blob());
    el.removeAttributeNS(XLINK, "href");
    el.setAttribute("href", data);
  }));
}

function asDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("could not read picture"));
    reader.readAsDataURL(blob);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("the drawing could not be loaded"));
    image.src = src;
  });
}

/** Base64 of a blob, for the WebSocket. */
export async function blobToBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

/** A blob of PNG bytes from base64. */
export function base64ToPng(data: string): Blob {
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: "image/png" });
}

/** The address the card-picture cache files one record's preview under. The
 * revision rides in the query, so a new revision is a new source and the
 * held picture of the old one is replaced (see `pictureSource`). */
export function cardPreviewAddress(ownerId: string, recordId: string, revision: number): string {
  return `card-preview:${encodeURIComponent(ownerId)}/${encodeURIComponent(recordId)}?rev=${revision}`;
}

/** The owner, record and revision back out of `cardPreviewAddress`. */
export function parseCardPreviewAddress(address: string): { ownerId: string; recordId: string; revision: number } | undefined {
  const match = /^card-preview:([^/?]*)\/([^?]*)\?rev=(\d+)$/.exec(address);
  if (!match) return undefined;
  return { ownerId: decodeURIComponent(match[1]!), recordId: decodeURIComponent(match[2]!), revision: Number(match[3]) };
}
