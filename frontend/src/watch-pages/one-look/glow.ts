// Light Look: a tile's icon photo, taken with the light off, glows from
// within on its lit tile when the light is on. The look is a few settings
// saved inside the photo's PNG (a `tEXt` chunk, keyword
// `WristAssistantGlow`), never a second picture, so every device draws it
// live in the light's own colour and brightness.
//
//   {"v":1,"dir":"around","glow":0.8}
//
// Only the iPhone sets it; the panel reads it here. Each device makes three
// masks once per photo from the photo's own pixels: the emission (what the
// light comes through), the aura round it and, for an uplight or a
// downlight, the beam past it. Everything in this file is pure: reading the
// recipe from the bytes, and the masks as numbers, which the apps make with
// the same maths. The photo store turns the masks into images
// (`page-photo-store.ts`) and `render.ts` (`cutoutLayer`) lays them out.
//
// A light's photo may instead carry a real photo taken with the light on
// (the On photo): a whole PNG in a `waOn` chunk before `IEND`, read here
// too. Where there is one, it wins over the recipe.
// Plan: app repo docs/photo_tiles_plan_2026-10.md, "Light Look" and "On
// photo".

import { type OneLookRGB, ONE_LOOK_AMBER, oneLookMix } from "./colour.js";
import type { OneLookRect } from "./layout.js";

/** The keyword of the `tEXt` chunk that holds the recipe. */
export const ONE_LOOK_GLOW_KEYWORD = "WristAssistantGlow";

/** The most text the chunk may carry; a longer one is no light. */
export const ONE_LOOK_GLOW_MAX_TEXT = 1024;

/** Where the light goes past the lamp: an uplight throws it up, a downlight
 * down, a bare bulb or a lantern all around (no beam). */
export type OneLookLightDirection = "up" | "down" | "around";

/** The look saved in an icon photo. */
export interface OneLookLightRecipe {
  readonly dir: OneLookLightDirection;
  /** 0 to 1. */
  readonly glow: number;
}

/** What a missing or bad field takes. */
export const ONE_LOOK_LIGHT_DEFAULT: OneLookLightRecipe = { dir: "around", glow: 0.8 };

/**
 * The recipe a parsed JSON value holds, or undefined: not an object, or a
 * `v` other than 1 (missing included). `dir` other than up, down or around
 * is around; `glow` is clamped to 0 to 1, and is 0.8 when missing or not a
 * number. Other keys are ignored.
 */
export function oneLookLightRecipeOf(value: unknown): OneLookLightRecipe | undefined {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return undefined;
  const raw = value as Record<string, unknown>;
  if (raw.v !== 1) return undefined;
  const dir: OneLookLightDirection = raw.dir === "up" || raw.dir === "down" ? raw.dir : "around";
  const glow = typeof raw.glow === "number" && Number.isFinite(raw.glow) ? Math.min(1, Math.max(0, raw.glow)) : ONE_LOOK_LIGHT_DEFAULT.glow;
  return { dir, glow };
}

const SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function u32(bytes: Uint8Array, at: number): number {
  return ((bytes[at]! << 24) >>> 0) + (bytes[at + 1]! << 16) + (bytes[at + 2]! << 8) + bytes[at + 3]!;
}

function ascii(bytes: Uint8Array, from: number, to: number): string {
  let text = "";
  for (let i = from; i < to; i++) text += String.fromCharCode(bytes[i]!);
  return text;
}

/** The type of the chunk that holds the On photo. */
export const ONE_LOOK_ON_CHUNK = "waOn";

/** What the panel reads from an icon photo's PNG bytes: its size from
 * `IHDR`, its look, and the bytes of its On photo, when it carries them. */
export interface IconPngFacts {
  width: number;
  height: number;
  recipe?: OneLookLightRecipe;
  /** The first `waOn` chunk's data when it starts with the PNG signature;
   * whether it decodes, and to the photo's size, is the store's to check. */
  on?: Uint8Array;
}

/**
 * An icon photo's size, look and On photo from its PNG bytes, or undefined
 * when they are not a PNG whose first chunk is `IHDR`. The chunks are read
 * up to `IEND` (no CRC is checked). Only the first `tEXt` with the keyword
 * counts: text over 1024 bytes, text that is not a JSON object, or a `v`
 * other than 1 means no light, as does no such chunk. Only the first `waOn`
 * counts too: data that does not start with the PNG signature means no On
 * photo, as does no such chunk.
 */
export function readIconPng(bytes: Uint8Array): IconPngFacts | undefined {
  if (bytes.length < 24 || SIGNATURE.some((b, i) => bytes[i] !== b)) return undefined;
  if (u32(bytes, 8) !== 13 || ascii(bytes, 12, 16) !== "IHDR") return undefined;
  const facts: IconPngFacts = { width: u32(bytes, 16), height: u32(bytes, 20) };
  let seenLook = false;
  let seenOn = false;
  let at = 8;
  while (at + 8 <= bytes.length && !(seenLook && seenOn)) {
    const length = u32(bytes, at);
    const type = ascii(bytes, at + 4, at + 8);
    const start = at + 8;
    const end = start + length;
    if (type === "IEND" || end > bytes.length) break;
    if (type === "tEXt" && !seenLook) {
      const nul = bytes.subarray(start, end).indexOf(0);
      if (nul >= 0 && ascii(bytes, start, start + nul) === ONE_LOOK_GLOW_KEYWORD) {
        seenLook = true;
        const recipe = recipeOfText(bytes, start + nul + 1, end);
        if (recipe !== undefined) facts.recipe = recipe;
      }
    } else if (type === ONE_LOOK_ON_CHUNK && !seenOn) {
      seenOn = true;
      if (length >= SIGNATURE.length && SIGNATURE.every((b, i) => bytes[start + i] === b)) facts.on = bytes.subarray(start, end);
    }
    at = end + 4;
  }
  return facts;
}

/** The recipe in a chunk's text (Latin-1, as `tEXt` is), or undefined. */
function recipeOfText(bytes: Uint8Array, from: number, to: number): OneLookLightRecipe | undefined {
  if (to - from > ONE_LOOK_GLOW_MAX_TEXT) return undefined;
  try {
    return oneLookLightRecipeOf(JSON.parse(ascii(bytes, from, to)));
  } catch {
    return undefined;
  }
}

// ── the masks ────────────────────────────────────────────────────────────

/** A photo's own pixels, straight (not premultiplied) RGBA, 8 bits each. */
export interface OneLookLightPixels {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

/** One value 0 to 1 per pixel, row by row. */
export interface OneLookLightMask {
  width: number;
  height: number;
  data: Float32Array;
}

/** The sizes a photo of `width` by `height` pixels makes its masks with:
 * `L` its longer side, the emission's blur radius, the padding round the
 * aura and beam, the aura's blur radius, and the beam's rim offset, fade in
 * and fade length. */
export interface OneLookLightSizes {
  long: number;
  emitRadius: number;
  pad: number;
  auraRadius: number;
  rim: number;
  fadeIn: number;
  fadeLength: number;
}

export function oneLookLightSizes(width: number, height: number): OneLookLightSizes {
  const long = Math.max(width, height);
  return {
    long,
    emitRadius: Math.max(1, Math.round(0.006 * long)),
    pad: Math.round(0.47 * long),
    auraRadius: Math.round(0.057 * long),
    rim: 0.016 * long,
    fadeIn: 0.031 * long,
    fadeLength: 0.31 * long,
  };
}

/** `smoothstep(edge0, edge1, x)`: 0 below, 1 above, the cubic between. */
export function oneLookSmoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** The emission before its blur: per pixel `smoothstep(0.40, 0.80, luma)`
 * (Rec. 709 weights on the sRGB values, 0 to 1) where alpha is at least
 * 0.5 (128 of 255), else 0. */
export function oneLookEmitUnblurred(pixels: OneLookLightPixels): OneLookLightMask {
  const { width, height, data } = pixels;
  const out = new Float32Array(width * height);
  for (let i = 0; i < out.length; i++) {
    const o = i * 4;
    if (data[o + 3]! / 255 < 0.5) continue;
    const luma = (0.2126 * data[o]! + 0.7152 * data[o + 1]! + 0.0722 * data[o + 2]!) / 255;
    out[i] = oneLookSmoothstep(0.4, 0.8, luma);
  }
  return { width, height, data: out };
}

/** One box blur pass along a line of `n` values read by `get`, written by
 * `set`: the mean of the `2r + 1` values round each, past the ends either
 * the end value repeated or 0. */
function blurLine(n: number, r: number, edge: "repeat" | "zero", get: (i: number) => number, set: (i: number, v: number) => void): void {
  const at = edge === "repeat" ? (i: number) => get(i < 0 ? 0 : i >= n ? n - 1 : i) : (i: number) => (i < 0 || i >= n ? 0 : get(i));
  const line = new Float64Array(n);
  let sum = 0;
  for (let j = -r; j <= r; j++) sum += at(j);
  const size = 2 * r + 1;
  for (let i = 0; i < n; i++) {
    line[i] = sum / size;
    sum += at(i + r + 1) - at(i - r);
  }
  for (let i = 0; i < n; i++) set(i, line[i]!);
}

/**
 * A mask box blurred with radius `r`, three passes across then three down
 * (the two directions commute, so the order does not matter). Past the
 * mask's edge the edge values repeat (`repeat`) or read 0 (`zero`).
 */
export function oneLookBoxBlur(mask: OneLookLightMask, r: number, edge: "repeat" | "zero"): OneLookLightMask {
  const { width, height } = mask;
  const data = Float32Array.from(mask.data);
  if (r <= 0 || width === 0 || height === 0) return { width, height, data };
  for (let pass = 0; pass < 3; pass++) {
    for (let y = 0; y < height; y++) {
      const row = y * width;
      blurLine(width, r, edge, (i) => data[row + i]!, (i, v) => { data[row + i] = v; });
    }
  }
  for (let pass = 0; pass < 3; pass++) {
    for (let x = 0; x < width; x++) {
      blurLine(height, r, edge, (i) => data[i * width + x]!, (i, v) => { data[i * width + x] = v; });
    }
  }
  return { width, height, data };
}

/** The emission `E`, at the photo's size: the unblurred emission blurred
 * with radius `max(1, round(0.006 L))`, the photo's edge pixels repeating. */
export function oneLookEmitMask(pixels: OneLookLightPixels): OneLookLightMask {
  return oneLookBoxBlur(oneLookEmitUnblurred(pixels), oneLookLightSizes(pixels.width, pixels.height).emitRadius, "repeat");
}

/** The aura `A`, on the padded canvas (`W + 2p` by `H + 2p`, the photo at
 * `(p, p)`): `E` there, 0 round it, box blurred with radius
 * `round(0.057 L)`, 0 past the canvas edge. */
export function oneLookAuraMask(emit: OneLookLightMask): OneLookLightMask {
  const { pad, auraRadius } = oneLookLightSizes(emit.width, emit.height);
  const width = emit.width + 2 * pad;
  const height = emit.height + 2 * pad;
  const data = new Float32Array(width * height);
  for (let y = 0; y < emit.height; y++) data.set(emit.data.subarray(y * emit.width, (y + 1) * emit.width), (y + pad) * width + pad);
  return oneLookBoxBlur({ width, height, data }, auraRadius, "zero");
}

/**
 * The beam `B`, on the padded canvas, for an uplight or a downlight; none
 * all around, or when no pixel of `E` is over 0.3. From the box of those
 * pixels (top `t`, bottom `b`, left `l`, right `r`, in photo pixels):
 * `cx = (l + r) / 2`, `w = r − l`; `dy` is how far past the rim
 * (`0.016 L` inside the box's top for up, its bottom for down) a row is,
 * `spread = 0.5 w + 0.9 max(dy, 0)`, the fan `clamp(1 − |x − cx| /
 * max(spread, 1), 0, 1)^1.5`, the fade `clamp(dy / 0.031 L, 0, 1) *
 * exp(-max(dy, 0) / 0.31 L)`, and `B` their product. `x` and `y` are a
 * padded pixel's column and row less `p`.
 */
export function oneLookBeamMask(emit: OneLookLightMask, dir: OneLookLightDirection): OneLookLightMask | undefined {
  if (dir === "around") return undefined;
  const { width: W, height: H } = emit;
  let t = Infinity;
  let b = -Infinity;
  let l = Infinity;
  let r = -Infinity;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!(emit.data[y * W + x]! > 0.3)) continue;
      if (y < t) t = y;
      if (y > b) b = y;
      if (x < l) l = x;
      if (x > r) r = x;
    }
  }
  if (t === Infinity) return undefined;
  const { pad, rim, fadeIn, fadeLength } = oneLookLightSizes(W, H);
  const cx = (l + r) / 2;
  const w = r - l;
  const width = W + 2 * pad;
  const height = H + 2 * pad;
  const data = new Float32Array(width * height);
  for (let Y = 0; Y < height; Y++) {
    const y = Y - pad;
    const dy = dir === "up" ? t + rim - y : y - (b - rim);
    if (!(dy > 0)) continue;
    const spread = 0.5 * w + 0.9 * dy;
    const fade = Math.min(1, dy / fadeIn) * Math.exp(-dy / fadeLength);
    const reach = Math.max(spread, 1);
    for (let X = 0; X < width; X++) {
      const fan = Math.min(1, Math.max(0, 1 - Math.abs(X - pad - cx) / reach));
      if (fan > 0) data[Y * width + X] = fan ** 1.5 * fade;
    }
  }
  return { width, height, data };
}

/** All of a photo's masks for a direction, and the padding the aura and
 * beam reach past the photo. */
export interface OneLookLightMaskSet {
  pad: number;
  emit: OneLookLightMask;
  aura: OneLookLightMask;
  beam?: OneLookLightMask;
}

export function oneLookLightMasks(pixels: OneLookLightPixels, dir: OneLookLightDirection): OneLookLightMaskSet {
  const emit = oneLookEmitMask(pixels);
  const beam = oneLookBeamMask(emit, dir);
  return { pad: oneLookLightSizes(pixels.width, pixels.height).pad, emit, aura: oneLookAuraMask(emit), ...(beam === undefined ? {} : { beam }) };
}

/** A mask as 8 bit RGBA pixels: white, its value as the alpha, for a CSS
 * `mask-image`. */
export function oneLookMaskPixels(mask: OneLookLightMask): Uint8ClampedArray {
  const out = new Uint8ClampedArray(mask.width * mask.height * 4);
  for (let i = 0; i < mask.data.length; i++) {
    const o = i * 4;
    out[o] = 255;
    out[o + 1] = 255;
    out[o + 2] = 255;
    out[o + 3] = Math.round(Math.min(1, Math.max(0, mask.data[i]!)) * 255);
  }
  return out;
}

// ── drawing ──────────────────────────────────────────────────────────────

/** A photo's look with its masks made, as a picture draws it: the masks as
 * image URLs, the photo's own size in pixels and the padding. */
export interface OneLookPhotoLight {
  recipe: OneLookLightRecipe;
  width: number;
  height: number;
  pad: number;
  emit: string;
  aura: string;
  beam?: string;
}

/** The light's colour: the tile's hue, else One Look amber, mixed 35% toward
 * white, each channel rounded to 8 bits. */
export function oneLookGlowColour(hue: OneLookRGB | undefined): OneLookRGB {
  return oneLookMix(hue ?? ONE_LOOK_AMBER, [255, 255, 255], 0.35);
}

/** The shares of the level each layer is drawn at. */
export const ONE_LOOK_LIGHT_AURA = 0.95;
export const ONE_LOOK_LIGHT_BEAM = 0.9;
export const ONE_LOOK_LIGHT_EMIT = 0.85;

/** Where a look's layers go over the fitted photo rect `photo`
 * (`oneLookCutoutRect(...).photo`) and how strong each is: the emission on
 * the rect, the aura and beam reaching the padding (scaled by `P.w / W`)
 * past it on every side, each at its share of the level `g = glow × (0.25 +
 * 0.75 × brightness)`. */
export interface OneLookLightPlacement {
  colour: OneLookRGB;
  level: number;
  emit: { rect: OneLookRect; opacity: number };
  aura: { rect: OneLookRect; opacity: number };
  beam?: { rect: OneLookRect; opacity: number };
}

export function oneLookLightPlacement(
  photo: OneLookRect,
  light: Pick<OneLookPhotoLight, "recipe" | "width" | "pad" | "beam">,
  brightness: number,
  colour: OneLookRGB,
): OneLookLightPlacement {
  const level = light.recipe.glow * (0.25 + 0.75 * Math.min(1, Math.max(0, brightness)));
  const k = light.width > 0 ? photo.width / light.width : 0;
  const reach = light.pad * k;
  const padded = { x: photo.x - reach, y: photo.y - reach, width: photo.width + 2 * reach, height: photo.height + 2 * reach };
  return {
    colour,
    level,
    emit: { rect: photo, opacity: ONE_LOOK_LIGHT_EMIT * level },
    aura: { rect: padded, opacity: ONE_LOOK_LIGHT_AURA * level },
    ...(light.beam === undefined ? {} : { beam: { rect: padded, opacity: ONE_LOOK_LIGHT_BEAM * level } }),
  };
}
