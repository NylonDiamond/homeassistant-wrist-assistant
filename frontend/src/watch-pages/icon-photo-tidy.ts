// A tile's icon photo made ready to store: the automatic tidy, the crop to
// what is drawn, and the size steps of the PNG the panel uploads. Pure, on
// RGBA bytes, so it can be checked against known pixels; the canvas work
// that feeds it is `encodeIconPhotoFile` in `page-photo-store.ts`.
//
// The iPhone runs the same steps on a photo it sends, so a photo looks the
// same wherever it was made. Plan: app repo docs/photo_tiles_plan_2026-10.md,
// "Tidy".

import { pagePhotoSize } from "./page-photo.js";

/** Only pixels at least this opaque count toward the tidy's means. */
const COUNTED_ALPHA = 0.5;

/** The white balance's gain on one channel, at most this far either way. */
export const ICON_TIDY_BALANCE_RANGE: readonly [number, number] = [0.8, 1.25];

/** The mean luma the exposure step aims for, and its gain's range. */
export const ICON_TIDY_TARGET_LUMA = 0.55;
export const ICON_TIDY_GAIN_RANGE: readonly [number, number] = [0.75, 1.6];

/** How much of each pixel's color is kept against its luma. */
export const ICON_TIDY_SATURATION = 0.85;

/** Pixels more opaque than this are the photo's bounds. */
const BOUNDS_ALPHA = 0.1;

/** The padding round the bounds, as a share of their width (left and
 * right) and height (top and bottom). */
export const ICON_PHOTO_PADDING = 0.06;

/** The longest side an icon photo is stored at, at most, and the smallest
 * the size steps go to. */
export const ICON_PHOTO_MAX_SIDE = 384;
export const ICON_PHOTO_MIN_SIDE = 128;

/** The most bytes the store takes. */
export const ICON_PHOTO_MAX_BYTES = 256 * 1024;

function clamp(v: number, [lo, hi]: readonly [number, number]): number {
  return Math.min(hi, Math.max(lo, v));
}

function luma(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** A gain of `target / mean` held in `range`: a mean of 0 with a target
 * above it is the range's top, nothing over nothing is 1. */
function gain(target: number, mean: number, range: readonly [number, number]): number {
  if (mean > 0) return clamp(target / mean, range);
  return target > 0 ? range[1] : 1;
}

/** What the tidy worked out: each channel's white balance gain and the
 * exposure gain, for tests and the record. */
export interface IconTidyGains {
  balance: [number, number, number];
  exposure: number;
}

/**
 * The tidy, in place on RGBA bytes (canvas `ImageData` order, alpha not
 * premultiplied), values read as sRGB 0 to 1. Only pixels with alpha 0.5 or
 * more count toward the means. 1. White balance: each channel times
 * `gray / its mean`, gray the three means' average, held to 0.8 to 1.25.
 * 2. Exposure: every channel times `0.55 / mean luma` (Rec. 709 luma of the
 * balanced pixels), held to 0.75 to 1.6. 3. Saturation 0.85: each channel
 * mixed toward the pixel's luma. 4. Clamped to 0 to 1. Alpha is never
 * changed. With no pixel counted, nothing changes.
 */
export function tidyIconPixels(data: Uint8ClampedArray): IconTidyGains {
  const n = Math.floor(data.length / 4);
  let count = 0;
  let sr = 0;
  let sg = 0;
  let sb = 0;
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    if (data[o + 3]! / 255 < COUNTED_ALPHA) continue;
    count++;
    sr += data[o]! / 255;
    sg += data[o + 1]! / 255;
    sb += data[o + 2]! / 255;
  }
  if (count === 0) return { balance: [1, 1, 1], exposure: 1 };
  const means = [sr / count, sg / count, sb / count] as const;
  const gray = (means[0] + means[1] + means[2]) / 3;
  const balance: [number, number, number] = [
    gain(gray, means[0], ICON_TIDY_BALANCE_RANGE),
    gain(gray, means[1], ICON_TIDY_BALANCE_RANGE),
    gain(gray, means[2], ICON_TIDY_BALANCE_RANGE),
  ];
  // The mean luma after the balance, over the same pixels.
  let sl = 0;
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    if (data[o + 3]! / 255 < COUNTED_ALPHA) continue;
    sl += luma((data[o]! / 255) * balance[0], (data[o + 1]! / 255) * balance[1], (data[o + 2]! / 255) * balance[2]);
  }
  const exposure = gain(ICON_TIDY_TARGET_LUMA, sl / count, ICON_TIDY_GAIN_RANGE);
  const k = ICON_TIDY_SATURATION;
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    const r = (data[o]! / 255) * balance[0] * exposure;
    const g = (data[o + 1]! / 255) * balance[1] * exposure;
    const b = (data[o + 2]! / 255) * balance[2] * exposure;
    const y = luma(r, g, b);
    // A Uint8ClampedArray rounds and clamps what it is given.
    data[o] = Math.min(1, Math.max(0, y + k * (r - y))) * 255;
    data[o + 1] = Math.min(1, Math.max(0, y + k * (g - y))) * 255;
    data[o + 2] = Math.min(1, Math.max(0, y + k * (b - y))) * 255;
  }
  return { balance, exposure };
}

/** A rectangle in whole pixels. */
export interface IconPhotoRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Where to crop: the bounds of the pixels with alpha above 0.1, grown by 6%
 * of their width on the left and the right and 6% of their height on the
 * top and the bottom, each rounded to a whole pixel. The grown box may reach
 * past the picture; what lies there is clear. The whole picture when no
 * pixel is that opaque.
 */
export function iconPhotoCrop(data: Uint8ClampedArray, width: number, height: number): IconPhotoRect {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3]! / 255 <= BOUNDS_ALPHA) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < 0) return { x: 0, y: 0, width, height };
  const w = maxX - minX + 1;
  const h = maxY - minY + 1;
  const padX = Math.round(w * ICON_PHOTO_PADDING);
  const padY = Math.round(h * ICON_PHOTO_PADDING);
  return { x: minX - padX, y: minY - padY, width: w + 2 * padX, height: h + 2 * padY };
}

/**
 * The first PNG that is 256 KiB or less: at the crop's size with its
 * longest side 384 px or less (never scaled up), then at four fifths of the
 * size each time, down to a longest side of 128. Undefined when nothing
 * fits.
 */
export async function stepDownIconPhoto<T extends { readonly size: number }>(
  width: number,
  height: number,
  encode: (width: number, height: number) => Promise<T | undefined>,
  maxBytes = ICON_PHOTO_MAX_BYTES,
): Promise<{ result: T; width: number; height: number } | undefined> {
  let size = pagePhotoSize(width, height, ICON_PHOTO_MAX_SIDE);
  for (;;) {
    const result = await encode(size.width, size.height);
    if (result !== undefined && result.size <= maxBytes) return { result, ...size };
    const longest = Math.max(size.width, size.height);
    if (longest <= ICON_PHOTO_MIN_SIDE) return undefined;
    size = pagePhotoSize(size.width, size.height, Math.max(ICON_PHOTO_MIN_SIDE, Math.floor(longest * 0.8)));
  }
}
