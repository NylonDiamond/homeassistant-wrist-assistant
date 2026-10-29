// On photo tint: the On photo is taken in white at full brightness, so on a
// tile it would look white and bright whatever the light is set to. The
// tint makes its lit part follow the light's real colour and brightness.
// Everything here is pure, the same numbers the watch and the iPhone use:
//
// - the glow mask `W`, made once per photo from the On photo's bright, lit
//   parts, which the photo store turns into a mask image
//   (`page-photo-store.ts`);
// - the tint colour `C` and the level `k` from the light's live state,
//   which also colour and scale the Clear look's glow (`render.ts`).
//
// `render.ts` draws the layers: the Off photo, the On photo at opacity `k`,
// then `C` multiply blended through `W` at opacity `k`. With `C` white that
// last layer changes nothing, so a white light at full brightness looks as
// it did before the tint.
//
// Plan: app repo docs/photo_tiles_plan_2026-10.md, "On photo tint".

import { type OneLookLightMask, type OneLookLightPixels, oneLookBoxBlur, oneLookSmoothstep } from "./glow.js";

/** The tint's numbers: the glow mask's smoothstep edges on the On photo's
 * luma and its blur radius against the photo's long side; the colour
 * temperature the On photo is taken at; how much of the light's colour the
 * tint keeps; and the level's floor and span. */
export const ONE_LOOK_TINT = Object.freeze({
  maskLow: 0.38,
  maskHigh: 0.8,
  blurShare: 0.04,
  whiteKelvin: 4000,
  saturation: 0.85,
  levelFloor: 0.35,
  levelSpan: 0.65,
});

/** Rec. 709 luma of straight sRGB values, each 0 to 1. */
export function oneLookTintLuma(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** The blur radius of a photo's glow mask, in pixels: 4% of its long side,
 * rounded, at least 1. */
export function oneLookOnMaskRadius(width: number, height: number): number {
  return Math.max(1, Math.round(ONE_LOOK_TINT.blurShare * Math.max(width, height)));
}

/**
 * The glow mask `W` from the On photo alone (straight RGBA; contract
 * revision 2): per pixel `smoothstep(0.38, 0.80, lumaOn)` times its alpha,
 * then box blurred (three passes each way, the edge pixels repeating) with
 * radius `oneLookOnMaskRadius`, clamped 0 to 1. Every bright, lit part of
 * the lamp takes the colour evenly; dark parts (a black base, a metal
 * stem) keep their own. The Off photo is not read: the camera exposes it on
 * its own, so a shade is already bright in it and a difference found only
 * the hot spot. Undefined when the pixels are short of the size.
 */
export function oneLookOnGlowMask(on: OneLookLightPixels): OneLookLightMask | undefined {
  const { width, height } = on;
  if (on.data.length < width * height * 4) return undefined;
  const raw = new Float32Array(width * height);
  for (let i = 0; i < raw.length; i++) {
    const o = i * 4;
    const alpha = on.data[o + 3]! / 255;
    if (alpha === 0) continue;
    const luma = oneLookTintLuma(on.data[o]! / 255, on.data[o + 1]! / 255, on.data[o + 2]! / 255);
    raw[i] = oneLookSmoothstep(ONE_LOOK_TINT.maskLow, ONE_LOOK_TINT.maskHigh, luma) * alpha;
  }
  const blurred = oneLookBoxBlur({ width, height, data: raw }, oneLookOnMaskRadius(width, height), "repeat");
  for (let i = 0; i < blurred.data.length; i++) blurred.data[i] = Math.min(1, Math.max(0, blurred.data[i]!));
  return blurred;
}

/**
 * The mask the tint layer is drawn through: `W` clipped to the On photo's
 * alpha, which is `W` times that alpha per pixel (the blur reaches past the
 * lamp's edge). Baking the clip in keeps the layer to one mask image.
 */
export function oneLookOnTintMask(on: OneLookLightPixels): OneLookLightMask | undefined {
  const w = oneLookOnGlowMask(on);
  if (w === undefined) return undefined;
  for (let i = 0; i < w.data.length; i++) w.data[i] = w.data[i]! * (on.data[i * 4 + 3]! / 255);
  return w;
}

/** An RGB colour with each channel 0 to 1. */
export type OneLookTintRGB = readonly [number, number, number];

const clamp255 = (v: number) => Math.min(255, Math.max(0, v));

/** Tanner Helland's approximation of a colour temperature's RGB, each
 * channel 0 to 255. */
export function oneLookKelvinRGB(kelvin: number): OneLookTintRGB {
  const t = kelvin / 100;
  const r = t <= 66 ? 255 : 329.698727446 * (t - 60) ** -0.1332047592;
  const g = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * (t - 60) ** -0.0755148492;
  const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  return [clamp255(r), clamp255(g), clamp255(b)];
}

/** The colour modes whose `rgb_color` is the light's own colour. */
const RGB_MODES = new Set(["hs", "rgb", "rgbw", "rgbww", "xy"]);

const finite = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** A light's colour temperature in kelvin: `color_temp_kelvin`, else
 * `1e6 / color_temp` (mireds); undefined when neither is a positive
 * number. */
function kelvinOf(attributes: Readonly<Record<string, unknown>>): number | undefined {
  const kelvin = attributes.color_temp_kelvin;
  if (finite(kelvin) && kelvin > 0) return kelvin;
  const mireds = attributes.color_temp;
  if (finite(mireds) && mireds > 0) return 1e6 / mireds;
  return undefined;
}

/** A light's tint: the colour `C` (0 to 1, its largest channel 1 before the
 * saturation cap), whether it came from the light's own colour (an RGB
 * mode with `rgb_color`, or colour temperature mode with a temperature)
 * rather than the white stand in, and the level `k`. */
export interface OneLookTint {
  colour: OneLookTintRGB;
  known: boolean;
  level: number;
}

/**
 * The tint colour `C` from a light's attributes:
 * - an `rgb_color` in colour mode hs, rgb, rgbw, rgbww or xy: `rgb / 255`;
 * - colour mode `color_temp` with a kelvin (or mireds): `kelvinRGB(k) /
 *   kelvinRGB(4000)` channel by channel;
 * - anything else: white.
 * Then divided by its largest channel (0 is white) and mixed 85% from white
 * toward it.
 */
export function oneLookTintColour(attributes: Readonly<Record<string, unknown>> | undefined): { colour: OneLookTintRGB; known: boolean } {
  const a = attributes ?? {};
  const mode = typeof a.color_mode === "string" ? a.color_mode : undefined;
  let c: [number, number, number] = [1, 1, 1];
  let known = false;
  const rgb = a.rgb_color;
  if (mode !== undefined && RGB_MODES.has(mode) && Array.isArray(rgb) && rgb.length >= 3 && rgb.slice(0, 3).every(finite)) {
    c = [clamp255(rgb[0] as number) / 255, clamp255(rgb[1] as number) / 255, clamp255(rgb[2] as number) / 255];
    known = true;
  } else if (mode === "color_temp") {
    const kelvin = kelvinOf(a);
    if (kelvin !== undefined) {
      const at = oneLookKelvinRGB(kelvin);
      const white = oneLookKelvinRGB(ONE_LOOK_TINT.whiteKelvin);
      c = [at[0] / white[0], at[1] / white[1], at[2] / white[2]];
      known = true;
    }
  }
  const top = Math.max(c[0], c[1], c[2]);
  if (!(top > 0)) c = [1, 1, 1];
  else c = [c[0] / top, c[1] / top, c[2] / top];
  const s = ONE_LOOK_TINT.saturation;
  return { colour: [1 + (c[0] - 1) * s, 1 + (c[1] - 1) * s, 1 + (c[2] - 1) * s], known };
}

/** The level `k`: `0.35 + 0.65 b`, `b` the brightness over 255 (clamped 0
 * to 1) when known, else 1. */
export function oneLookTintLevel(brightness: unknown): number {
  const b = finite(brightness) ? Math.min(1, Math.max(0, brightness / 255)) : 1;
  return ONE_LOOK_TINT.levelFloor + ONE_LOOK_TINT.levelSpan * b;
}

/** A light's whole tint from its attributes. */
export function oneLookTintOf(attributes: Readonly<Record<string, unknown>> | undefined): OneLookTint {
  return { ...oneLookTintColour(attributes), level: oneLookTintLevel(attributes?.brightness) };
}

/** A tint colour as 8 bit channels, for CSS. */
export function oneLookTintRGB8(colour: OneLookTintRGB): readonly [number, number, number] {
  return [Math.round(colour[0] * 255), Math.round(colour[1] * 255), Math.round(colour[2] * 255)];
}

/** Whether a tint colour is white, so its multiply layer changes nothing. */
export function oneLookTintIsWhite(colour: OneLookTintRGB): boolean {
  return colour[0] >= 1 && colour[1] >= 1 && colour[2] >= 1;
}
