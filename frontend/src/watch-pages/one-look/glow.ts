// Light Look: a tile's icon photo, taken with the light off, plus a drawn
// light for On. The light is a few numbers saved inside the photo's PNG (a
// `tEXt` chunk, keyword `WristAssistantGlow`), never a second picture, so
// every device draws it live in the light's own colour and brightness.
//
//   {"v":1,"x":0.5,"y":0.5,"size":0.55,"glow":0.85,"spread":0.45,"rays":0,"shade":0.8}
//
// Only the iPhone edits it; the panel reads it here and draws it in
// `render.ts` (`cutoutLayer`). Everything in this file is pure: reading the
// recipe from the bytes, and the circles and alphas each layer takes, which
// the apps compute with the same math.
// Plan: app repo docs/photo_tiles_plan_2026-10.md, "Light Look".

import { type OneLookRGB, ONE_LOOK_AMBER, oneLookMix } from "./colour.js";
import type { OneLookRect } from "./layout.js";

/** The keyword of the `tEXt` chunk that holds the recipe. */
export const ONE_LOOK_GLOW_KEYWORD = "WristAssistantGlow";

/** The most text the chunk may carry; a longer one is ignored. */
export const ONE_LOOK_GLOW_MAX_TEXT = 1024;

/** A light drawn over an icon photo, every field 0 to 1. `x` and `y` are its
 * centre as a share of the photo's own width and height (0,0 top left); the
 * rest are the editor's sliders. */
export interface OneLookGlowRecipe {
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly glow: number;
  readonly spread: number;
  readonly rays: number;
  readonly shade: number;
}

/** The editor's presets (size, glow, spread, rays, shade). */
export const ONE_LOOK_GLOW_PRESETS = {
  soft: { size: 0.3, glow: 0.7, spread: 0.8, rays: 0, shade: 0.6 },
  bulb: { size: 0.55, glow: 0.85, spread: 0.45, rays: 0, shade: 0.8 },
  sparkle: { size: 0.4, glow: 0.75, spread: 0.55, rays: 0.7, shade: 0.7 },
} as const;

/** What a missing or bad field takes: the Bulb preset, centred. */
export const ONE_LOOK_GLOW_DEFAULT: OneLookGlowRecipe = { x: 0.5, y: 0.5, ...ONE_LOOK_GLOW_PRESETS.bulb };

const FIELDS = ["x", "y", "size", "glow", "spread", "rays", "shade"] as const;

/**
 * The recipe a parsed JSON value holds, or undefined: not an object, or a
 * `v` other than 1. Each field is a number clamped to 0 to 1; a missing or
 * bad one takes its default.
 */
export function oneLookGlowRecipeOf(value: unknown): OneLookGlowRecipe | undefined {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return undefined;
  const raw = value as Record<string, unknown>;
  if (raw.v !== 1) return undefined;
  const out: Record<string, number> = {};
  for (const key of FIELDS) {
    const n = raw[key];
    out[key] = typeof n === "number" && Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : ONE_LOOK_GLOW_DEFAULT[key];
  }
  return out as unknown as OneLookGlowRecipe;
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

/** What the panel reads from an icon photo's PNG bytes: its size from
 * `IHDR` and its light, when it carries one. */
export interface IconPngFacts {
  width: number;
  height: number;
  glow?: OneLookGlowRecipe;
}

/**
 * An icon photo's size and light from its PNG bytes, or undefined when they
 * are not a PNG whose first chunk is `IHDR`. The chunks are read up to
 * `IEND` (no CRC is checked) and the first `tEXt` with the keyword is the
 * light: text over 1024 bytes, text that is not a JSON object, or a `v`
 * other than 1 means none, as does no such chunk.
 */
export function readIconPng(bytes: Uint8Array): IconPngFacts | undefined {
  if (bytes.length < 24 || SIGNATURE.some((b, i) => bytes[i] !== b)) return undefined;
  if (u32(bytes, 8) !== 13 || ascii(bytes, 12, 16) !== "IHDR") return undefined;
  const facts: IconPngFacts = { width: u32(bytes, 16), height: u32(bytes, 20) };
  let at = 8;
  while (at + 8 <= bytes.length) {
    const length = u32(bytes, at);
    const type = ascii(bytes, at + 4, at + 8);
    const start = at + 8;
    const end = start + length;
    if (type === "IEND" || end > bytes.length) break;
    if (type === "tEXt") {
      const nul = bytes.subarray(start, end).indexOf(0);
      if (nul >= 0 && ascii(bytes, start, start + nul) === ONE_LOOK_GLOW_KEYWORD) {
        const glow = glowOfText(bytes, start + nul + 1, end);
        if (glow !== undefined) facts.glow = glow;
        break;
      }
    }
    at = end + 4;
  }
  return facts;
}

/** The recipe in a chunk's text (Latin-1, as `tEXt` is), or undefined. */
function glowOfText(bytes: Uint8Array, from: number, to: number): OneLookGlowRecipe | undefined {
  if (to - from > ONE_LOOK_GLOW_MAX_TEXT) return undefined;
  try {
    return oneLookGlowRecipeOf(JSON.parse(ascii(bytes, from, to)));
  } catch {
    return undefined;
  }
}

/** The light's colour: the tile's hue, else One Look amber, mixed 35% toward
 * white. */
export function oneLookGlowColour(hue: OneLookRGB | undefined): OneLookRGB {
  return oneLookMix(hue ?? ONE_LOOK_AMBER, [255, 255, 255], 0.35);
}

/** A circle in points. */
export interface OneLookGlowCircle {
  cx: number;
  cy: number;
  r: number;
}

/** Every layer of a light over a photo, in points and alphas (all screen
 * blended, in this order around the photo). */
export interface OneLookGlowLayers {
  colour: OneLookRGB;
  /** `lf`: 0.25 plus 0.75 of the palette's brightness. */
  level: number;
  /** Behind the photo: `colour` at `alpha` at 0, 0.45 of it at 0.35, clear
   * at 1. */
  halo: OneLookGlowCircle & { alpha: number };
  /** Over the photo, masked by its alpha: `colour` at 1 at 0, 0.55 at 0.45,
   * clear at 1, the whole layer at `opacity`. */
  shade: OneLookGlowCircle & { opacity: number };
  /** 15 spokes of `colour` at `alpha`, only when the recipe has rays. */
  rays?: OneLookGlowCircle & { alpha: number };
  /** White at `white` at 0, `colour` at `tint` at 0.45, clear at 1. */
  core: OneLookGlowCircle & { white: number; tint: number };
}

/** The rays: 15 spokes, each 2.4 deg wide, one every 24 deg, the first
 * starting 8 deg clockwise from up, faded by a radial mask opaque at 12%
 * and clear at 100%. */
export const ONE_LOOK_GLOW_RAYS = { count: 15, width: 2.4, every: 24, from: 8, maskFrom: 0.12 } as const;

/**
 * Where a light's layers go over the fitted photo rect `photo`
 * (`oneLookCutoutRect(...).photo`), for a palette `brightness` and the
 * light's `colour` (`oneLookGlowColour`). `L` is the rect's longer side and
 * every radius is a share of it, so the light grows with the photo.
 */
export function oneLookGlowLayers(photo: OneLookRect, recipe: OneLookGlowRecipe, brightness: number, colour: OneLookRGB): OneLookGlowLayers {
  const long = Math.max(photo.width, photo.height);
  const cx = photo.x + recipe.x * photo.width;
  const cy = photo.y + recipe.y * photo.height;
  const level = 0.25 + 0.75 * Math.min(1, Math.max(0, brightness));
  const at = (r: number): OneLookGlowCircle => ({ cx, cy, r });
  return {
    colour,
    level,
    halo: { ...at(long * (0.35 + 0.95 * recipe.spread)), alpha: recipe.glow * level },
    shade: { ...at(0.46 * long), opacity: recipe.shade * level },
    ...(recipe.rays > 0 ? { rays: { ...at(long * (0.45 + 0.7 * recipe.spread)), alpha: recipe.rays * 0.55 * level } } : {}),
    core: { ...at(long * (0.03 + 0.11 * recipe.size)), white: 0.95 * level, tint: 0.85 * level },
  };
}
