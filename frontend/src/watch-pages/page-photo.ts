// A page's background photo, without the network: how the watch draws it
// (`PageBackgroundWatchImage` in `TileGridPageView.swift`), the size a photo
// picked in the panel is scaled to, and the JPEG quality steps of its
// upload. The store that fetches and uploads the bytes is
// `page-photo-store.ts`.
//
// The watch: the picture resizable, aspect fill (Fill), aspect fit (Fit) or
// stretched (Stretch), in a frame of the whole screen, clipped, then its
// opacity, then its blur, under the pattern and the animation and under the
// tiles. The base color and its brightness lie under it.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md, "4d batch 6".

import type { WatchPage } from "./model.js";
import { watchPageValue } from "./page-settings-model.js";

/** How a photo fills the screen: the phone's `BackgroundImageFit`. */
export type WatchPagePhotoFit = "fill" | "fit" | "stretch";

/** A page's photo as the watch reads it. */
export interface WatchPagePhoto {
  id: string;
  /** 0 to 1. */
  opacity: number;
  /** In points, 0 to 20. */
  blur: number;
  fit: WatchPagePhotoFit;
}

const FITS: readonly WatchPagePhotoFit[] = ["fill", "fit", "stretch"];

function clamp(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

/** The page's photo, or undefined when it names none (an empty id is
 * none). Each value as the phone decodes it, its default when absent. */
export function watchPagePhoto(page: WatchPage): WatchPagePhoto | undefined {
  const id = page.backgroundImageId;
  if (typeof id !== "string" || id.trim() === "") return undefined;
  const fit = watchPageValue(page, "backgroundImageFit");
  return {
    id,
    opacity: clamp(watchPageValue(page, "backgroundImageOpacity"), 0, 1, 1),
    blur: clamp(watchPageValue(page, "backgroundImageBlur"), 0, 20, 0),
    fit: FITS.includes(fit as WatchPagePhotoFit) ? (fit as WatchPagePhotoFit) : "fill",
  };
}

/** The CSS `background-size` of each fit: aspect fill, aspect fit, and the
 * picture stretched to the frame. */
const FIT_SIZE: Readonly<Record<WatchPagePhotoFit, string>> = { fill: "cover", fit: "contain", stretch: "100% 100%" };

function px(value: number): string {
  return `${Math.round(value * 100) / 100}px`;
}

/**
 * The photo layer's style: a box the size of the watch's screen at `s`
 * pixels per point, at its top left, the picture centred in it at its fit,
 * then its opacity and its blur (a radius in points, so times `s`). The box
 * clips nothing itself: the screen around it does, as the watch's frame
 * does. `url` goes in as a CSS string.
 */
export function watchPagePhotoStyle(photo: WatchPagePhoto, url: string, s: number, screen: { width: number; height: number }): string {
  const parts = [
    `left:0`,
    `top:0`,
    `width:${px(screen.width * s)}`,
    `height:${px(screen.height * s)}`,
    `background-image:url(${JSON.stringify(url)})`,
    `background-size:${FIT_SIZE[photo.fit]}`,
    `background-position:center`,
    `background-repeat:no-repeat`,
  ];
  if (photo.opacity < 1) parts.push(`opacity:${Math.round(photo.opacity * 1000) / 1000}`);
  if (photo.blur > 0) parts.push(`filter:blur(${px(photo.blur * s)})`);
  return parts.join(";");
}

/** Whether an id names a built-in photo (`preset_<name>`). */
export function isBuiltInPagePhoto(id: string): boolean {
  return /^preset_[a-z0-9_]+$/.test(id);
}

/** Two photo ids are one: a custom id is a UUID compared without case. */
export function samePagePhotoId(a: string | undefined, b: string | undefined): boolean {
  return a !== undefined && b !== undefined && a.toUpperCase() === b.toUpperCase();
}

/** Every photo id the document's pages name, upper cased. */
export function pagePhotoIdsInUse(pages: unknown): Set<string> {
  const out = new Set<string>();
  if (!Array.isArray(pages)) return out;
  for (const page of pages) {
    const id = page !== null && typeof page === "object" ? (page as Record<string, unknown>).backgroundImageId : undefined;
    if (typeof id === "string" && id !== "") out.add(id.toUpperCase());
  }
  return out;
}

// ── upload sizing ────────────────────────────────────────────────────────

/** The longest side a photo picked in the panel is scaled to, at most. */
export const PAGE_PHOTO_MAX_SIDE = 512;

/** The most bytes the panel uploads; the store takes up to 256 KiB. */
export const PAGE_PHOTO_MAX_BYTES = 200 * 1024;

/** The JPEG qualities tried, in order: 0.8 first, then down. */
export const PAGE_PHOTO_QUALITIES: readonly number[] = [0.8, 0.7, 0.6, 0.5, 0.4];

/** The smallest longest side the step down goes to. */
const MIN_SIDE = 128;

/** A picture scaled so its longest side is `maxSide` or less, never up,
 * each side a whole number of pixels and at least 1. */
export function pagePhotoSize(width: number, height: number, maxSide = PAGE_PHOTO_MAX_SIDE): { width: number; height: number } {
  const w = Number.isFinite(width) && width > 0 ? width : 1;
  const h = Number.isFinite(height) && height > 0 ? height : 1;
  const k = Math.min(1, maxSide / Math.max(w, h));
  return { width: Math.max(1, Math.round(w * k)), height: Math.max(1, Math.round(h * k)) };
}

/** What one encode gave: anything with a size in bytes. */
export interface PagePhotoEncoded {
  readonly size: number;
}

/**
 * The first encode that is `maxBytes` or less: at the picture's size (its
 * longest side `PAGE_PHOTO_MAX_SIDE` or less) at each quality in turn, from
 * 0.8 down; when even the lowest is too big, the same again at four fifths
 * of the size, down to a longest side of 128. Undefined when nothing fits.
 */
export async function stepDownPagePhoto<T extends PagePhotoEncoded>(
  width: number,
  height: number,
  encode: (width: number, height: number, quality: number) => Promise<T | undefined>,
  maxBytes = PAGE_PHOTO_MAX_BYTES,
): Promise<{ result: T; width: number; height: number; quality: number } | undefined> {
  let size = pagePhotoSize(width, height);
  for (;;) {
    for (const quality of PAGE_PHOTO_QUALITIES) {
      const result = await encode(size.width, size.height, quality);
      if (result !== undefined && result.size <= maxBytes) return { result, ...size, quality };
    }
    const longest = Math.max(size.width, size.height);
    if (longest <= MIN_SIDE) return undefined;
    size = pagePhotoSize(size.width, size.height, Math.max(MIN_SIDE, Math.floor(longest * 0.8)));
  }
}

// ── words ────────────────────────────────────────────────────────────────

/** What a refusal of the photo store says, by its code. */
export function pagePhotoRefusalText(error: unknown): string {
  const code = error !== null && typeof error === "object" ? (error as Record<string, unknown>).code : undefined;
  switch (code) {
    case "too_large":
      return "That photo is too big for Home Assistant.";
    case "full":
      return "Home Assistant holds 500 photos already. Delete one first.";
    case "in_use":
      return "A page still uses that photo.";
    case "not_found":
      return "That photo is not in Home Assistant.";
    case "invalid":
      return "Home Assistant could not read that photo.";
    case "unknown_command":
      return "This version of the integration has no photo store. Update it first.";
    default:
      return "Home Assistant did not take that. Try again.";
  }
}

/** Shown when the browser cannot open a file (HEIC in Chrome). */
export const PAGE_PHOTO_UNREADABLE_TEXT = "This browser cannot open that file. Try a JPEG or PNG.";
