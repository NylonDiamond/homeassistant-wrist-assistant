// One Look's colours, copied from the app's `OneLookColour.swift`: a tile's
// colour string, role and flags in, hex and opacities out (the palette), and
// the fill the palette paints at a tile's drawn size (`OneLookFill`). Pure:
// nothing here draws, and nothing reads the DOM; the CSS helpers at the end
// only turn the results into strings a preview can set.
//
// Every step works in whole 8-bit channels and rounds back to them after
// each mix, as the app (and the mock it copied) does. The deepen and pearl
// loops depend on that rounding, so a port that kept fractions would land
// one code off. The app's tests (`OneLookColourTests.swift`) pin the hex;
// `test/one-look-colour.test.ts` repeats them.

/** An sRGB colour in whole 8-bit channels. */
export type OneLookRGB = readonly [number, number, number];

/** A colour at an opacity: a white disc at 30%, a hue disc at 20%, solid
 * at 1 (`OneLookInk`). */
export interface OneLookInk {
  readonly rgb: OneLookRGB;
  readonly opacity: number;
}

/** What a tile is, as far as its colour cares (`OneLookRole`). A light's
 * brightness is 0 to 1, absent for a light that does not dim. */
export type OneLookRole =
  | { readonly kind: "light"; readonly on: boolean; readonly brightness?: number }
  | { readonly kind: "media"; readonly playing: boolean }
  | { readonly kind: "plain" }
  | { readonly kind: "camera" };

/** `OneLookChoices` the colours read, as the app has them now. With no
 * colour a tile is graphite (the theme's colour never counts), an idle tile
 * keeps its colour, and an unavailable tile is the quiet flat ground. Read
 * from the app's source, never assumed. */
export const ONE_LOOK_COLOUR_CHOICES = {
  noColour: "graphite" as "graphite" | "themeDefault",
  calmWhenIdle: false,
  quietOffline: true,
} as const;

const W: OneLookRGB = [255, 255, 255];
const K: OneLookRGB = [0, 0, 0];

// ── constants ────────────────────────────────────────────────────────────

/** The ground a dimmed light's hue mixes toward, and what a tile's colour
 * opacity mixes toward. */
export const ONE_LOOK_GRAPHITE: OneLookRGB = [0x2a, 0x2b, 0x30];
/** A lit light (or playing media) with no colour set. */
export const ONE_LOOK_AMBER: OneLookRGB = [0xf2, 0xae, 0x4e];
/** The dot before an amber word, and a camera's error glyph. */
export const ONE_LOOK_AMBER_DOT: OneLookRGB = [0xff, 0xb3, 0x40];
/** The red dot of the LIVE and camera chips, on black at these opacities. */
export const ONE_LOOK_LIVE_DOT: OneLookRGB = [0xff, 0x45, 0x3a];
export const ONE_LOOK_LIVE_CHIP_OPACITY = 0.45;
export const ONE_LOOK_CAMERA_CHIP_OPACITY = 0.3;

/** The graphite fill: 135 deg from the light stop through the base at 55%
 * to the shade, with a 7% corner sheen gone by 55%. */
export const ONE_LOOK_GRAPHITE_LIGHT: OneLookRGB = [0x2d, 0x2e, 0x33];
export const ONE_LOOK_GRAPHITE_BASE: OneLookRGB = [0x20, 0x21, 0x25];
export const ONE_LOOK_GRAPHITE_SHADE: OneLookRGB = [0x19, 0x1a, 0x1d];
export const ONE_LOOK_GRAPHITE_STOP = 0.55;
export const ONE_LOOK_GRAPHITE_SHEEN = 0.07;
/** A camera tile's ground under its picture. */
export const ONE_LOOK_CAMERA_GROUND: OneLookRGB = [0x22, 0x22, 0x22];
/** A quiet offline tile's flat ground, under its content at half. */
export const ONE_LOOK_OFFLINE_GROUND: OneLookRGB = [0x18, 0x19, 0x1c];
/** The white edge where a Fill style fill ends: its opacity and width. */
export const ONE_LOOK_FILL_EDGE_OPACITY = 0.5;
export const ONE_LOOK_FILL_EDGE_WIDTH = 1.5;
/** The unfilled part of a Fill style tile: each stop this share of the way
 * from the graphite base to the colour. */
export const ONE_LOOK_FILL_TRACK_SHARE = 0.42;
/** The bridge look's bare glyph on a coloured tile: white with this share
 * of the tile's colour; warm white while a light is on or media plays. */
export const ONE_LOOK_BARE_GLYPH_SHARE = 0.14;
export const ONE_LOOK_LIT_BARE_GLYPH: OneLookRGB = [0xff, 0xf8, 0xea];
/** White on a coloured fill reaches this; the pearl glyph reaches the other
 * on its pearl. */
export const ONE_LOOK_WHITE_TARGET = 3.0;
export const ONE_LOOK_PEARL_TARGET = 3.5;
/** The unavailable hatch (drawn only with quiet offline off). */
export const ONE_LOOK_HATCH_STRIPE = 2;
export const ONE_LOOK_HATCH_PERIOD = 7;
export const ONE_LOOK_HATCH_OPACITY = 0.04;
/** Wrist down: one even black veil. A preview never draws it. */
export const ONE_LOOK_AOD_VEIL = 0.52;
/** An off light's disc: its hue at this opacity. */
export const ONE_LOOK_OFF_BULB_DISC_OPACITY = 0.2;
/** A camera's glass disc. */
export const ONE_LOOK_GLASS_DISC: OneLookRGB = [0x10, 0x10, 0x12];

/** The bar (`OneLookViews`): track white, fill at its opacity, its outline,
 * and the share of the tile's colour mixed into white for the fill. */
export const ONE_LOOK_BAR_TRACK_OPACITY = 0.16;
export const ONE_LOOK_BAR_FILL_OPACITY = 0.7;
export const ONE_LOOK_BAR_BORDER_OPACITY = 0.25;
export const ONE_LOOK_BAR_TINT_SHARE = 0.3;
/** The state's black capsule (the Pill value style). */
export const ONE_LOOK_PILL_OPACITY = 0.22;
/** The soft light behind a bare glyph, at rest and lit. */
export const ONE_LOOK_GLYPH_HALO_SHARE = 1.5;
export const ONE_LOOK_GLYPH_HALO_OPACITY = 0.14;
export const ONE_LOOK_GLYPH_HALO_LIT_OPACITY = 0.32;
/** A unit beside its figure, at this share of the ink's opacity. */
export const ONE_LOOK_UNIT_OPACITY = 0.84;

/** Rainbow's stops, red to purple (`RainbowHelper.colors`' order). */
export const ONE_LOOK_RAINBOW_STOPS: readonly OneLookRGB[] = [
  [0xff, 0x3b, 0x30], [0xff, 0x95, 0x00], [0xff, 0xcc, 0x00], [0x34, 0xc7, 0x59],
  [0x32, 0xad, 0xe6], [0x00, 0x7a, 0xff], [0xaf, 0x52, 0xde],
];

/** The named colours the app's colour strings take, any case. */
const NAMED_STOPS: Readonly<Record<string, OneLookRGB>> = {
  yellow: [0xff, 0xcc, 0x00], blue: [0x00, 0x7a, 0xff], red: [0xff, 0x3b, 0x30],
  green: [0x34, 0xc7, 0x59], purple: [0xaf, 0x52, 0xde], orange: [0xff, 0x95, 0x00],
  white: [0xff, 0xff, 0xff],
};

/** The rim light's 135 deg stops for its top left opacity: full, 30% of it
 * at 30%, clear at 58%, then 3% at the far corner. */
export function oneLookRimStops(opacity: number): { opacity: number; location: number }[] {
  return [{ opacity, location: 0 }, { opacity: opacity * 0.3, location: 0.3 }, { opacity: 0, location: 0.58 }, { opacity: 0.03, location: 1 }];
}

/** The black scrim over a picture, top to bottom. */
export const ONE_LOOK_CAMERA_SCRIM: readonly { opacity: number; location: number }[] = [
  { opacity: 0.34, location: 0 }, { opacity: 0, location: 0.32 }, { opacity: 0.2, location: 0.46 }, { opacity: 0.86, location: 1 },
];

// ── hex ──────────────────────────────────────────────────────────────────

/** A channel clamped to 0 to 255 and rounded half up, as the app's
 * `RGB8(rounding:)` takes it. */
function r8(v: number): number {
  return Math.floor(Math.max(0, Math.min(255, v)) + 0.5);
}

function ch(v: number): number {
  return Math.max(0, Math.min(255, Math.trunc(v)));
}

/** `#RRGGBB` or `#RRGGBBAA` (the alpha dropped), with or without the hash,
 * either case; undefined for anything else (`RGB8(hex:)`). */
export function oneLookParseHex(value: string): OneLookRGB | undefined {
  let body = value.trim();
  if (body.startsWith("#")) body = body.slice(1);
  if ((body.length !== 6 && body.length !== 8) || !/^[0-9a-fA-F]+$/.test(body)) return undefined;
  const n = parseInt(body.slice(0, 6), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

/** `#RRGGBB`, upper case. */
export function oneLookHex(c: OneLookRGB): string {
  return `#${c.map((v) => ch(v).toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

function same(a: OneLookRGB, b: OneLookRGB): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

function ink(rgb: OneLookRGB, opacity = 1): OneLookInk {
  return { rgb, opacity };
}

function white(opacity: number): OneLookInk {
  return ink(W, opacity);
}

// ── a tile's colour string ───────────────────────────────────────────────

/**
 * The stops of a tile's colour string (`OneLookColour.stops(from:)`): one
 * for a hex or named colour, both ends of a `GRADIENT|#a|#b` token (an end
 * that does not parse is dropped), seven for `#RAINBOW`. Undefined for no
 * colour and for anything that does not parse (a theme token, a short hex),
 * which then draws as no colour.
 */
export function oneLookColourStops(value: unknown): OneLookRGB[] | undefined {
  if (typeof value !== "string") return undefined;
  const raw = value.trim();
  if (raw === "") return undefined;
  if (raw.toUpperCase() === "#RAINBOW") return [...ONE_LOOK_RAINBOW_STOPS];
  if (raw.startsWith("GRADIENT|")) {
    // The token splits once: a third part stays on the end, which then
    // does not parse.
    const payload = raw.slice("GRADIENT|".length);
    const bar = payload.indexOf("|");
    if (bar >= 0) {
      const ends = [payload.slice(0, bar), payload.slice(bar + 1)]
        .map((end) => oneLookParseHex(end))
        .filter((end): end is OneLookRGB => end !== undefined);
      return ends.length === 0 ? undefined : ends;
    }
  }
  const solid = oneLookParseHex(raw);
  if (solid !== undefined) return [solid];
  const named = Object.hasOwn(NAMED_STOPS, raw.toLowerCase()) ? NAMED_STOPS[raw.toLowerCase()] : undefined;
  return named === undefined ? undefined : [named];
}

// ── the colour maths ─────────────────────────────────────────────────────

/** `mix(a, b, t)`: each channel moved `t` of the way from `a` to `b`,
 * rounded to 8 bits. */
export function oneLookMix(a: OneLookRGB, b: OneLookRGB, t: number): OneLookRGB {
  return [r8(a[0] + (b[0] - a[0]) * t), r8(a[1] + (b[1] - a[1]) * t), r8(a[2] + (b[2] - a[2]) * t)];
}

function linear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance. */
export function oneLookLuminance(c: OneLookRGB): number {
  return 0.2126 * linear(c[0]) + 0.7152 * linear(c[1]) + 0.0722 * linear(c[2]);
}

/** WCAG contrast ratio, 1 to 21. */
export function oneLookContrast(a: OneLookRGB, b: OneLookRGB): number {
  const x = oneLookLuminance(a);
  const y = oneLookLuminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** White text's contrast on this colour. */
export function oneLookWhiteContrast(c: OneLookRGB): number {
  return 1.05 / (oneLookLuminance(c) + 0.05);
}

/** Saturation as chroma over brightness (HSV): near 0 for white and grey. */
export function oneLookHSVSaturation(c: OneLookRGB): number {
  const mx = Math.max(c[0], c[1], c[2]);
  const mn = Math.min(c[0], c[1], c[2]);
  return mx === 0 ? 0 : (mx - mn) / mx;
}

/** Hue in degrees, saturation and lightness 0 to 1 (the mock's `toHsl`). */
export function oneLookHSL(c: OneLookRGB): [number, number, number] {
  const r = c[0] / 255;
  const g = c[1] / 255;
  const b = c[2] / 255;
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (mx + mn) / 2;
  if (mx !== mn) {
    const d = mx - mn;
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    if (mx === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, s, l];
}

/** The mock's `hsl2hex`. JS `%` truncates as Swift's `truncatingRemainder`. */
export function oneLookFromHSL(h: number, s: number, l: number): OneLookRGB {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [r8(f(0) * 255), r8(f(8) * 255), r8(f(4) * 255)];
}

/**
 * A fill too light for white text, deepened just enough
 * (`deepenForWhite`): same hue, saturation up 8 points, lightness stepped
 * down until white reaches the target. A nearly grey colour (HSV saturation
 * under 15%) darkens straight toward black instead, so it stays neutral. A
 * colour that already passes comes back unchanged.
 */
export function oneLookDeepenForWhite(c: OneLookRGB, target = ONE_LOOK_WHITE_TARGET): OneLookRGB {
  if (oneLookWhiteContrast(c) >= target) return c;
  if (oneLookHSVSaturation(c) < 0.15) {
    let k = 0;
    let out = c;
    while (oneLookWhiteContrast(out) < target && k < 0.9) {
      k += 0.004;
      out = oneLookMix(c, K, k);
    }
    return out;
  }
  const [h, s0, l0] = oneLookHSL(c);
  const s = Math.min(1, s0 + 0.08);
  let l = l0;
  let out = oneLookFromHSL(h, s, l);
  while (oneLookWhiteContrast(out) < target && l > 0.12) {
    l -= 0.004;
    out = oneLookFromHSL(h, s, l);
  }
  return out;
}

/** The pearl disc a lit tile carries: its base 95% toward white. */
export function oneLookPearl(base: OneLookRGB): OneLookRGB {
  return oneLookMix(base, W, 0.95);
}

/** The glyph on the pearl disc: the base darkened from 15% in 1% steps
 * (up to 60%) until it reaches 3.5:1 on the pearl. */
export function oneLookPearlGlyph(base: OneLookRGB): OneLookRGB {
  const disc = oneLookPearl(base);
  let k = 0.15;
  let glyph = oneLookMix(base, K, k);
  while (oneLookContrast(glyph, disc) < ONE_LOOK_PEARL_TARGET && k < 0.6) {
    k += 0.01;
    glyph = oneLookMix(base, K, k);
  }
  return glyph;
}

/** A dimmed light's hue: mixed toward graphite, the hue's share 55% plus
 * 45% of the brightness. Full brightness keeps the hue. */
export function oneLookBrightnessMixed(hue: OneLookRGB, brightness: number): OneLookRGB {
  return brightness < 1 ? oneLookMix(ONE_LOOK_GRAPHITE, hue, 0.55 + 0.45 * brightness) : hue;
}

/** An off light's outline bulb: its hue a quarter of the way to white. */
export function oneLookOffBulb(hue: OneLookRGB): OneLookRGB {
  return oneLookMix(hue, W, 0.25);
}

/** A fill stop's dark shade for the unfilled part of a Fill style tile. */
export function oneLookFillTrack(c: OneLookRGB): OneLookRGB {
  return oneLookMix(ONE_LOOK_GRAPHITE_BASE, c, ONE_LOOK_FILL_TRACK_SHARE);
}

/** The bridge look's bare glyph on a coloured tile at rest. */
export function oneLookBareGlyph(c: OneLookRGB): OneLookRGB {
  return oneLookMix(W, c, ONE_LOOK_BARE_GLYPH_SHARE);
}

// ── the palette ──────────────────────────────────────────────────────────

/** A tile's colours (`OneLookPalette`), resolved once from its role, colour
 * and flags. */
export interface OneLookPalette {
  /** Graphite: no colour, an off light, an unavailable tile. Coloured: the
   * user's hue. Camera: a picture over the camera ground. */
  readonly surface: "graphite" | "coloured" | "camera";
  /** The hue as set (its first stop), before any dimming or deepening:
   * amber for a lit tile with none, undefined with no colour. The bar's
   * tint and the bloom read it. */
  readonly hue: OneLookRGB | undefined;
  /** The fill's 0% stop, its hue stop and its 100% stop. */
  readonly light: OneLookRGB;
  readonly base: OneLookRGB;
  readonly shade: OneLookRGB;
  /** Every stop of the colour, dimmed and deepened, in order: one for a
   * solid colour, two for a gradient, seven for rainbow. Empty unless
   * coloured. */
  readonly bases: readonly OneLookRGB[];
  /** 1 unless a light is on and dimmed, to 1%. */
  readonly brightness: number;
  /** The share of the tile a Fill style fills from the left, the rest the
   * track; undefined fills the whole tile. */
  readonly fillShare: number | undefined;
  /** Whether the hue was deepened for white text. */
  readonly deepened: boolean;
  /** The corner sheen's white opacity, and where the elliptical sheen ends
   * in percent of its 1.2w x h ellipse. */
  readonly sheen: number;
  readonly sheenStop: number;
  readonly rimOpacity: number;
  /** The name and number ink, and the word and tail ink. */
  readonly ink: OneLookInk;
  readonly ink2: OneLookInk;
  /** The icon disc and its glyph (a disc is drawn only on chart and
   * picture tiles while the bridge look is on). */
  readonly disc: OneLookInk;
  readonly glyph: OneLookInk;
  /** The accessory disc and its glyph. */
  readonly accessoryDisc: OneLookInk;
  readonly accessoryGlyph: OneLookInk;
  /** A light on or media playing. */
  readonly isLit: boolean;
  /** The pearl disc's white halo. */
  readonly pearlGlow: boolean;
  /** The iPhone's under-glow colour, at `glowOpacity`. */
  readonly glow: OneLookRGB | undefined;
  readonly glowOpacity: number;
  readonly hatch: boolean;
  /** The bar, glyph, accessory and text draw at this. */
  readonly contentOpacity: number;
  /** Wrist down's black veil (0 otherwise). */
  readonly veil: number;
  /** Text on a coloured fill carries a soft shadow (the iPhone only). */
  readonly textShadow: boolean;
  readonly aod: boolean;
}

/** What `oneLookPalette` reads (`OneLookPalette.resolve`). */
export interface OneLookPaletteInput {
  readonly role: OneLookRole;
  /** The tile's colour string (hex, `GRADIENT|...`, `#RAINBOW`, a name). */
  readonly hue?: unknown;
  /** The colour set for the tile's current state, which wins over `hue`. */
  readonly stateHue?: unknown;
  /** The theme's colour for the kind; counts only with `noColour`
   * `themeDefault`, and never for a light. */
  readonly themeHue?: unknown;
  readonly unavailable?: boolean;
  /** Off or idle; read only with `calmWhenIdle`. */
  readonly calm?: boolean;
  /** False draws an off light coloured with the 30% disc. Default true. */
  readonly dimWhenOff?: boolean;
  /** Under 1 mixes the hue toward graphite by the share it leaves out,
   * before deepening. Default 1. */
  readonly colorOpacity?: number;
  readonly pressed?: boolean;
  readonly aod?: boolean;
  readonly noColour?: "graphite" | "themeDefault";
  readonly calmWhenIdle?: boolean;
  /** A dimmed light fills from the left to its brightness (Fill style). */
  readonly brightnessFill?: boolean;
  /** Another kind set to the Fill style fills from the left to this share;
   * undefined or 1 fills the whole tile. */
  readonly fillLevel?: number;
  readonly quietOffline?: boolean;
}

/** A value clamped to 0 to 1 and kept to 1%, as the app's cache key holds
 * it; the palette is made from the key, so this rounding shows. */
function hundredths(v: number): number {
  return Math.round(Math.max(0, Math.min(1, v)) * 100) / 100;
}

interface PaletteKey {
  role: OneLookRole;
  hue: unknown;
  stateHue: unknown;
  themeHue: unknown;
  unavailable: boolean;
  calm: boolean;
  dimWhenOff: boolean;
  colorOpacity: number;
  pressed: boolean;
  aod: boolean;
  noColour: "graphite" | "themeDefault";
  brightnessFill: boolean;
  fillLevel: number | undefined;
  quietOffline: boolean;
}

const PALETTE_CACHE = new Map<string, OneLookPalette>();
/** A runaway guard, not an eviction policy: a page has a few dozen. */
const PALETTE_CACHE_LIMIT = 512;

/**
 * A tile's palette, in the app's order: a camera, then unavailable, then an
 * off light, then (with calm when idle) an idle tile, then lit with no
 * colour as amber ("on" is checked before "no colour"), then no colour as
 * graphite, then coloured. A light's brightness, the colour opacity and the
 * fill level count to 1%. The deepen and pearl loops run up to about 200
 * steps, so each palette is kept once made.
 */
export function oneLookPalette(input: OneLookPaletteInput): OneLookPalette {
  const role: OneLookRole =
    input.role.kind === "light" && typeof input.role.brightness === "number"
      ? { kind: "light", on: input.role.on, brightness: hundredths(input.role.brightness) }
      : input.role;
  const calmWhenIdle = input.calmWhenIdle ?? ONE_LOOK_COLOUR_CHOICES.calmWhenIdle;
  const key: PaletteKey = {
    role,
    hue: input.hue,
    stateHue: input.stateHue,
    themeHue: input.themeHue,
    unavailable: input.unavailable === true,
    calm: input.calm === true && calmWhenIdle,
    dimWhenOff: input.dimWhenOff ?? true,
    colorOpacity: hundredths(input.colorOpacity ?? 1),
    pressed: input.pressed === true,
    aod: input.aod === true,
    noColour: input.noColour ?? ONE_LOOK_COLOUR_CHOICES.noColour,
    brightnessFill: input.brightnessFill === true,
    fillLevel: typeof input.fillLevel === "number" ? hundredths(input.fillLevel) : undefined,
    quietOffline: input.quietOffline ?? ONE_LOOK_COLOUR_CHOICES.quietOffline,
  };
  const id = JSON.stringify(key);
  const hit = PALETTE_CACHE.get(id);
  if (hit !== undefined) return hit;
  const palette = Object.freeze(makePalette(key));
  if (PALETTE_CACHE.size >= PALETTE_CACHE_LIMIT) PALETTE_CACHE.clear();
  PALETTE_CACHE.set(id, palette);
  return palette;
}

function stringOrUndefined(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function makePalette(key: PaletteKey): OneLookPalette {
  // The colour as set: the state's own wins.
  const stateHue = stringOrUndefined(key.stateHue);
  let stops = oneLookColourStops(stateHue ?? key.hue);
  if (stops === undefined && key.noColour === "themeDefault" && key.role.kind !== "light") {
    stops = oneLookColourStops(key.themeHue);
  }

  if (key.role.kind === "camera") {
    return graphite(key, { ink2: white(0.9), disc: ink(ONE_LOOK_GLASS_DISC, 0.5), glyph: white(1), rim: 0.28, surface: "camera" });
  }
  if (key.unavailable) {
    if (key.quietOffline) return graphite(key, { ink2: white(0.74), disc: white(0.08), glyph: white(0.75), rim: 0.1, quiet: true });
    return graphite(key, { ink2: white(0.74), disc: white(0.08), glyph: white(0.75), rim: 0.2, hatch: true });
  }

  let lit: boolean;
  let brightness = 1;
  const isLight = key.role.kind === "light";
  switch (key.role.kind) {
    case "light": {
      if (!key.role.on && key.dimWhenOff) {
        // Off: graphite, the outline bulb in the light's own hue.
        const hue = stops?.[0] ?? ONE_LOOK_AMBER;
        return graphite(key, { ink2: white(0.6), disc: ink(hue, ONE_LOOK_OFF_BULB_DISC_OPACITY), glyph: ink(oneLookOffBulb(hue)), rim: 0.2, hue });
      }
      lit = key.role.on;
      if (key.role.on) brightness = Math.max(0, Math.min(1, key.role.brightness ?? 1));
      break;
    }
    case "media":
      lit = key.role.playing;
      break;
    default:
      lit = false;
  }

  // Calm: an idle plain or media tile, graphite with its icon in its hue.
  const first = stops?.[0];
  if (key.calm && !isLight && !lit && key.dimWhenOff && stateHue === undefined && !key.pressed && first !== undefined) {
    return graphite(key, { ink2: white(0.6), disc: ink(first, ONE_LOOK_OFF_BULB_DISC_OPACITY), glyph: ink(oneLookOffBulb(first)), rim: 0.2, hue: first });
  }

  // "On" wins over "no colour".
  const hueStops = stops ?? (lit ? [ONE_LOOK_AMBER] : undefined);
  if (hueStops === undefined) return graphite(key, { ink2: white(0.74), disc: white(0.13), glyph: white(0.92), rim: 0.2 });

  // A Fill style fill draws its colours at full brightness; `tone` is the
  // brightness the colours are mixed for.
  let fillShare = key.brightnessFill && isLight && lit && brightness < 1 ? brightness : undefined;
  if (!isLight && key.fillLevel !== undefined && key.fillLevel < 1) fillShare = key.fillLevel;
  const tone = fillShare === undefined ? brightness : 1;
  const raws = hueStops.map((stop) => {
    const c = key.colorOpacity < 1 ? oneLookMix(stop, ONE_LOOK_GRAPHITE, 1 - key.colorOpacity) : stop;
    return oneLookBrightnessMixed(c, tone);
  });
  const bases = raws.map((c) => oneLookDeepenForWhite(c));
  const base = bases[0]!;
  const last = bases[bases.length - 1]!;
  const lastDeepened = !same(last, raws[raws.length - 1]!);
  const light = oneLookMix(base, W, 0.38 * tone);
  const shade = oneLookMix(last, K, lastDeepened ? 0.16 : 0.1);
  const press = key.pressed ? 1.6 : 1;
  const aod = key.aod;
  const glyph = lit ? oneLookPearlGlyph(base) : oneLookMix(base, K, 0.62);
  const disc = lit ? white(aod ? 0.62 : 0.95) : white(0.3);
  return {
    surface: "coloured",
    hue: hueStops[0],
    light,
    base,
    shade,
    bases,
    brightness,
    fillShare,
    deepened: !same(base, raws[0]!),
    sheen: aod ? 0 : Math.min(0.5, 0.26 * tone * press),
    sheenStop: 18 + 13 * tone + (key.pressed ? 5 : 0),
    rimOpacity: aod ? 0.12 : Math.min(0.9, 0.45 * press),
    ink: white(aod ? 0.86 : 1),
    ink2: white(aod ? 0.62 : 1),
    disc,
    glyph: ink(glyph),
    accessoryDisc: lit ? white(0.3) : disc,
    accessoryGlyph: ink(lit ? oneLookMix(base, K, 0.62) : glyph),
    isLit: lit,
    pearlGlow: lit && !aod,
    glow: lit && !aod ? base : undefined,
    glowOpacity: 0.72 * brightness,
    hatch: false,
    contentOpacity: 1,
    veil: aod ? ONE_LOOK_AOD_VEIL : 0,
    textShadow: true,
    aod,
  };
}

/** A graphite (or camera) palette with its disc and glyph. */
function graphite(
  key: PaletteKey,
  o: { ink2: OneLookInk; disc: OneLookInk; glyph: OneLookInk; rim: number; hatch?: boolean; quiet?: boolean; hue?: OneLookRGB; surface?: "graphite" | "camera" },
): OneLookPalette {
  const aod = key.aod;
  const camera = o.surface === "camera";
  const quiet = o.quiet === true;
  const hatch = o.hatch === true;
  // A quiet offline tile: one flat ground, no sheen, content at half.
  const flat = camera ? ONE_LOOK_CAMERA_GROUND : quiet ? ONE_LOOK_OFFLINE_GROUND : undefined;
  return {
    surface: o.surface ?? "graphite",
    hue: o.hue,
    light: flat ?? ONE_LOOK_GRAPHITE_LIGHT,
    base: flat ?? ONE_LOOK_GRAPHITE_BASE,
    shade: flat ?? ONE_LOOK_GRAPHITE_SHADE,
    bases: [],
    brightness: 1,
    fillShare: undefined,
    deepened: false,
    sheen: camera || quiet || aod ? 0 : ONE_LOOK_GRAPHITE_SHEEN,
    sheenStop: ONE_LOOK_GRAPHITE_STOP * 100,
    rimOpacity: aod ? 0.12 : o.rim,
    ink: white(aod ? 0.86 : 1),
    ink2: aod ? white(0.62) : o.ink2,
    disc: o.disc,
    glyph: o.glyph,
    accessoryDisc: o.disc,
    accessoryGlyph: o.glyph,
    isLit: false,
    pearlGlow: false,
    glow: undefined,
    glowOpacity: 0.72,
    hatch,
    contentOpacity: hatch || quiet ? 0.5 : 1,
    veil: aod ? ONE_LOOK_AOD_VEIL : 0,
    textShadow: false,
    aod,
  };
}

// ── what the views paint with the palette ────────────────────────────────

/** The bar's fill colour: white with the White bar style or no hue, else
 * the tile's colour mixed into white (a light with no colour tints from
 * its amber). */
export function oneLookBarColour(palette: OneLookPalette, whiteBar: boolean): OneLookRGB {
  if (whiteBar || palette.hue === undefined) return W;
  return oneLookMix(W, palette.base, ONE_LOOK_BAR_TINT_SHARE);
}

/** The glyph's ink. With no disc behind it on a coloured tile, the bridge
 * look's bare glyph (warm white while lit, else a pale tint of the colour),
 * or the plain ink outside the bridge look; everywhere else the palette's
 * glyph. */
export function oneLookGlyphInk(palette: OneLookPalette, drawsDisc: boolean, centred = true): OneLookInk {
  if (!drawsDisc && palette.surface === "coloured") {
    if (!centred) return palette.ink;
    return ink(palette.isLit ? ONE_LOOK_LIT_BARE_GLYPH : oneLookBareGlyph(palette.base));
  }
  return palette.glyph;
}

/** The soft light behind a bare glyph: on a coloured tile in the bridge
 * look, not over a picture, with an icon, not wrist down; brighter while
 * lit. Undefined when none draws. */
export function oneLookGlyphHaloOpacity(palette: OneLookPalette, o: { centred?: boolean; picture?: boolean; hasIcon?: boolean } = {}): number | undefined {
  return oneLookGlyphHalo(palette, o, ONE_LOOK_NATIVE_GLOW)?.opacity;
}

// ── the icon's glow setting (tile layers round three) ────────────────────

/** Where the glow draws: `auto` where One Look draws it on its own (a
 * coloured tile), `on` on a graphite tile too, `off` nowhere. */
export type OneLookGlowMode = "auto" | "on" | "off";
/** The glow's colour: white (One Look's own), the tile's colour as set, or
 * one of the user's. */
export type OneLookGlowColour = { readonly kind: "white" } | { readonly kind: "tile" } | { readonly kind: "custom"; readonly rgb: OneLookRGB };

/** A tile's `iconGlow` setting, read (app repo
 * docs/tile_layers_contract_2026-10.md section 14.2): the mode, the size as
 * a percent of the glyph box, the brightness as a percent of One Look's own
 * opacity, and the colour. */
export interface OneLookGlyphGlow {
  readonly mode: OneLookGlowMode;
  readonly size: number;
  readonly brightness: number;
  readonly colour: OneLookGlowColour;
}

/** No setting: One Look's own glow. */
export const ONE_LOOK_NATIVE_GLOW: OneLookGlyphGlow = Object.freeze({ mode: "auto", size: 150, brightness: 100, colour: Object.freeze({ kind: "white" }) });
export const ONE_LOOK_GLOW_SIZE_RANGE: readonly [number, number] = [50, 250];
export const ONE_LOOK_GLOW_BRIGHTNESS_RANGE: readonly [number, number] = [0, 300];

const GLOW_HEX = /^#[0-9A-Fa-f]{6}$/;

/** A finite number held in `range`, else `fallback` (JSON `true` is not a
 * number). */
function glowNumber(raw: unknown, range: readonly [number, number], fallback: number): number {
  if (typeof raw !== "number" || !Number.isFinite(raw)) return fallback;
  return Math.min(range[1], Math.max(range[0], raw));
}

/** The `iconGlow` key as stored, read tolerantly (section 14.2): anything
 * that is not an object, and `{}`, is One Look's own glow; a key of the
 * wrong type or value takes its default, numbers are clamped, unknown keys
 * are ignored. */
export function oneLookGlyphGlowOf(raw: unknown): OneLookGlyphGlow {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) return ONE_LOOK_NATIVE_GLOW;
  const o = raw as Record<string, unknown>;
  const mode: OneLookGlowMode = o.mode === "on" || o.mode === "off" || o.mode === "auto" ? o.mode : "auto";
  const size = glowNumber(o.size, ONE_LOOK_GLOW_SIZE_RANGE, ONE_LOOK_NATIVE_GLOW.size);
  const brightness = glowNumber(o.brightness, ONE_LOOK_GLOW_BRIGHTNESS_RANGE, ONE_LOOK_NATIVE_GLOW.brightness);
  let colour: OneLookGlowColour = ONE_LOOK_NATIVE_GLOW.colour;
  if (o.color === "tile") colour = { kind: "tile" };
  else if (typeof o.color === "string" && GLOW_HEX.test(o.color)) colour = { kind: "custom", rgb: oneLookParseHex(o.color)! };
  if (mode === "auto" && size === ONE_LOOK_NATIVE_GLOW.size && brightness === ONE_LOOK_NATIVE_GLOW.brightness && colour.kind === "white") return ONE_LOOK_NATIVE_GLOW;
  return { mode, size, brightness, colour };
}

/** The glow as the panel writes `iconGlow` (section 14.2): keys `mode, size,
 * brightness, color`, each only when not its default, a custom colour as
 * `#RRGGBB` upper case; undefined when every key is its default, so the key
 * is removed. */
export function encodeOneLookGlyphGlow(glow: OneLookGlyphGlow): Record<string, unknown> | undefined {
  const out: Record<string, unknown> = {};
  if (glow.mode !== "auto") out.mode = glow.mode;
  if (glow.size !== ONE_LOOK_NATIVE_GLOW.size) out.size = glow.size;
  if (glow.brightness !== ONE_LOOK_NATIVE_GLOW.brightness) out.brightness = glow.brightness;
  if (glow.colour.kind === "tile") out.color = "tile";
  else if (glow.colour.kind === "custom") out.color = oneLookHex(glow.colour.rgb);
  return Object.keys(out).length === 0 ? undefined : out;
}

/** Whether a glow is One Look's own (writes nothing). */
export function oneLookGlowIsNative(glow: OneLookGlyphGlow): boolean {
  return encodeOneLookGlyphGlow(glow) === undefined;
}

/** The glow One Look draws behind a bare glyph: its opacity at the centre,
 * its diameter as a share of the glyph box, and its colour. */
export interface OneLookGlyphHalo {
  readonly opacity: number;
  readonly share: number;
  readonly rgb: OneLookRGB;
}

/**
 * The soft light behind a bare glyph with a tile's glow setting (section
 * 14.3), the same formula as the app's `OneLookColour.glyphHalo`: none with
 * the mode off, outside the bridge look, over a picture, without an icon,
 * wrist down or on a camera surface; on a surface that is not coloured only
 * with the mode on and no photo showing; the opacity One Look's own (brighter
 * while lit) times the brightness, at most 1, none at 0. Undefined when none
 * draws.
 */
export function oneLookGlyphHalo(
  palette: OneLookPalette,
  o: { centred?: boolean; picture?: boolean; hasIcon?: boolean; photo?: boolean },
  glow: OneLookGlyphGlow,
): OneLookGlyphHalo | undefined {
  if (glow.mode === "off") return undefined;
  if (o.centred === false || o.picture === true || o.hasIcon === false || palette.aod) return undefined;
  if (palette.surface === "camera") return undefined;
  if (palette.surface !== "coloured" && (glow.mode === "auto" || o.photo === true)) return undefined;
  const opacity = Math.min(1, ((palette.isLit ? ONE_LOOK_GLYPH_HALO_LIT_OPACITY : ONE_LOOK_GLYPH_HALO_OPACITY) * glow.brightness) / 100);
  if (!(opacity > 0)) return undefined;
  const rgb = glow.colour.kind === "custom" ? glow.colour.rgb : glow.colour.kind === "tile" ? (palette.hue ?? W) : W;
  return { opacity, share: glow.size / 100, rgb };
}

// ── the fill ─────────────────────────────────────────────────────────────

export interface OneLookFillStop {
  readonly color: OneLookRGB;
  readonly location: number;
}

export type OneLookSheen =
  | { readonly kind: "none" }
  /** White at `opacity` in the top left of a 1.2w x h ellipse, gone by
   * `end` (0 to 1) of it. */
  | { readonly kind: "ellipse"; readonly opacity: number; readonly end: number }
  /** A strip's: a circle at the top left corner, gone at `radius` points. */
  | { readonly kind: "circle"; readonly opacity: number; readonly radius: number };

/** A tile's fill at its drawn size (`OneLookFill`): the 135 deg blend,
 * where a point's share is `(x + y) / (w + h)`, and the corner sheen. */
export interface OneLookFill {
  readonly size: { readonly width: number; readonly height: number };
  readonly stops: readonly OneLookFillStop[];
  /** Where the hue stop sits, 0 to 1 along the blend. */
  readonly baseStop: number;
  readonly sheen: OneLookSheen;
}

/**
 * The fill for a palette (`OneLookFill.stops`). The hue stop sits at 30%,
 * or earlier when the text starts earlier along the blend (`textStart`, the
 * top left of the text block), never before 6%, so every name and state
 * sits on the hue rather than on the lifted corner. A gradient keeps its
 * stops, the first at the hue stop and the rest spread to the end, where
 * the last one's shade sits. `discEdge` is a strip's sheen reach.
 */
export function oneLookFill(
  palette: OneLookPalette,
  size: { width: number; height: number },
  textStart: { x: number; y: number },
  strip = false,
  discEdge = 0,
): OneLookFill {
  const box = { width: size.width, height: size.height };
  if (palette.surface === "camera") {
    const ground = ONE_LOOK_CAMERA_GROUND;
    return { size: box, stops: [{ color: ground, location: 0 }, { color: ground, location: 1 }], baseStop: 0, sheen: { kind: "none" } };
  }
  if (palette.surface === "graphite") {
    return {
      size: box,
      stops: [
        { color: palette.light, location: 0 },
        { color: palette.base, location: ONE_LOOK_GRAPHITE_STOP },
        { color: palette.shade, location: 1 },
      ],
      baseStop: ONE_LOOK_GRAPHITE_STOP,
      sheen: palette.sheen > 0 ? { kind: "ellipse", opacity: palette.sheen, end: ONE_LOOK_GRAPHITE_STOP } : { kind: "none" },
    };
  }
  const sum = size.width + size.height;
  const textShare = sum > 0 ? (textStart.x + textStart.y) / sum : 0.3;
  const stop = Math.max(0.06, Math.min(0.3, textShare - 0.01));
  // Wrist down the corner is not lifted: the blend starts on the hue.
  const out: OneLookFillStop[] = [{ color: palette.aod ? palette.base : palette.light, location: 0 }];
  const bases = palette.bases.length === 0 ? [palette.base] : palette.bases;
  if (bases.length === 1) {
    out.push({ color: bases[0]!, location: stop });
  } else {
    for (let i = 0; i < bases.length - 1; i += 1) {
      out.push({ color: bases[i]!, location: stop + ((1 - stop) * i) / (bases.length - 1) });
    }
  }
  out.push({ color: palette.shade, location: 1 });
  let sheen: OneLookSheen;
  if (palette.sheen <= 0) sheen = { kind: "none" };
  else if (strip) sheen = { kind: "circle", opacity: palette.sheen, radius: discEdge * (0.75 + 0.25 * palette.brightness) };
  else sheen = { kind: "ellipse", opacity: palette.sheen, end: palette.sheenStop / 100 };
  return { size: box, stops: out, baseStop: stop, sheen };
}

/** The fill's colour at a point, sheen included (`OneLookFill.color(at:)`,
 * which the app's contrast checks read). */
export function oneLookFillColourAt(fill: OneLookFill, point: { x: number; y: number }): OneLookRGB {
  const w = fill.size.width;
  const h = fill.size.height;
  const sum = w + h;
  const t = sum > 0 ? Math.max(0, Math.min(1, (point.x + point.y) / sum)) : 0;
  let c = fill.stops[fill.stops.length - 1]?.color ?? K;
  for (let i = 0; i < fill.stops.length - 1; i += 1) {
    const a = fill.stops[i]!;
    const b = fill.stops[i + 1]!;
    if (t <= b.location) {
      const span = b.location - a.location;
      c = oneLookMix(a.color, b.color, span > 0 ? (t - a.location) / span : 1);
      break;
    }
  }
  let alpha = 0;
  if (fill.sheen.kind === "ellipse") {
    const d = Math.hypot(point.x / (1.2 * Math.max(w, 0.0001)), point.y / Math.max(h, 0.0001));
    alpha = fill.sheen.opacity * Math.max(0, 1 - d / fill.sheen.end);
  } else if (fill.sheen.kind === "circle") {
    alpha = fill.sheen.opacity * Math.max(0, 1 - Math.hypot(point.x, point.y) / Math.max(fill.sheen.radius, 0.0001));
  }
  return oneLookMix(c, W, alpha);
}

/** The Fill style's track: the same blend with every stop darkened toward
 * graphite (`fillTrack`), at the same locations. */
export function oneLookFillTrackStops(fill: OneLookFill): OneLookFillStop[] {
  return fill.stops.map((s) => ({ color: oneLookFillTrack(s.color), location: s.location }));
}

// ── as CSS ───────────────────────────────────────────────────────────────

function cssNumber(v: number): string {
  return String(Math.round(v * 10000) / 10000);
}

/** An ink as CSS: hex when solid, else `rgba(...)`. */
export function oneLookInkCss(value: OneLookInk | OneLookRGB, opacity?: number): string {
  const c = "rgb" in value ? value.rgb : value;
  const a = opacity ?? ("rgb" in value ? value.opacity : 1);
  if (a >= 1) return oneLookHex(c);
  return `rgba(${ch(c[0])}, ${ch(c[1])}, ${ch(c[2])}, ${cssNumber(Math.max(0, a))})`;
}

/** The 135 deg blend as a CSS gradient. CSS's 135 deg on any box puts a
 * point at `(x + y) / (w + h)` along it, as the app's blend does. */
export function oneLookBlendCss(stops: readonly OneLookFillStop[]): string {
  return `linear-gradient(135deg, ${stops.map((s) => `${oneLookHex(s.color)} ${cssNumber(s.location * 100)}%`).join(", ")})`;
}

/** The corner sheen as a CSS gradient, or undefined for none. `s` is the
 * preview's pixels per point, which only the strip's circle needs. */
export function oneLookSheenCss(sheen: OneLookSheen, s = 1): string | undefined {
  if (sheen.kind === "none") return undefined;
  const from = `rgba(255, 255, 255, ${cssNumber(sheen.opacity)})`;
  if (sheen.kind === "circle") {
    return `radial-gradient(circle ${cssNumber(sheen.radius * s)}px at 0 0, ${from} 0, rgba(255, 255, 255, 0) 100%)`;
  }
  return `radial-gradient(120% 100% at 0% 0%, ${from} 0%, rgba(255, 255, 255, 0) ${cssNumber(sheen.end * 100)}%)`;
}

/** The rim light's paint, a 135 deg white gradient for the inside stroke. */
export function oneLookRimCss(opacity: number): string {
  return `linear-gradient(135deg, ${oneLookRimStops(opacity).map((r) => `rgba(255, 255, 255, ${cssNumber(r.opacity)}) ${cssNumber(r.location * 100)}%`).join(", ")})`;
}

/** The scrim over a picture, as a CSS gradient. */
export function oneLookScrimCss(): string {
  return `linear-gradient(to bottom, ${ONE_LOOK_CAMERA_SCRIM.map((r) => `rgba(0, 0, 0, ${cssNumber(r.opacity)}) ${cssNumber(r.location * 100)}%`).join(", ")})`;
}

/** The iPhone's under-glow as a CSS box shadow at `s` pixels per point
 * (the app's rounded rect 12 in a side, 12 down, blur 15), or undefined
 * for a palette with no glow. The watch never draws it. */
export function oneLookUnderGlowCss(palette: OneLookPalette, s = 1): string | undefined {
  if (palette.glow === undefined) return undefined;
  return `0 ${cssNumber(12 * s)}px ${cssNumber(30 * s)}px ${cssNumber(-12 * s)}px ${oneLookInkCss(palette.glow, palette.glowOpacity)}`;
}
