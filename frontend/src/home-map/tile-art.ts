// The Home map tile's picture in each of its looks, in SVG, ported from the
// app's Swift so the page editor shows what the iPhone and the watch draw
// (`HomeMapFlatView.swift`, `HomeMapIsoArt.swift`, `HomeMapTileRules.swift`):
//
// - plan: the floor seen from above like the iPhone's Flat view. Each room's
//   floor laid in its material (boards, tiles, stone, carpet or a plain
//   floor, by the room's finish or else its name or its furniture) with a
//   gentle fall of light and a soft shade along its walls, a warm pool round
//   each light that is on kept inside its room,
//   the doorways' thresholds and the doors' dashed swings, the furniture
//   from above with a soft shadow, the walls near white with a dark edge,
//   blue window panes, the doors' leaves standing open (a sliding door or
//   window as two offset panes and no swing), and the room names on dark
//   pills. The map editor's stage draws this look at a fixed fit (`frame`)
//   so it can pan and zoom it.
// - night, warm, lines, clay, blueprint: the floor as a small model turned
//   (`homeMapTurn`) and tipped back 50 degrees. The far outside walls stand
//   full height so the rooms have a back, the walls between rooms are cut to
//   1 m and the near outside walls to a 0.4 m kerb, so nothing hides behind
//   them. Walls are split at their openings, with glass in each window's
//   hole, and cut into short stretches; furniture stands on the floor, cut at
//   1.2 m; everything is sorted far to near and each face shaded by which
//   way it faces. Night is dark rooms with warm pools of light, warm is wood
//   and lamplight, lines is thin glowing amber lines on black, clay a white
//   model with soft shadows in daylight, blueprint blue with pale lines, a
//   measuring grid and, for one room, its sizes.
// - dots: a plain gray plan with every light a dot, yellow when on and gray
//   when off. It draws no names, furniture or pools.
//
// Every look then draws the tile's devices (`homeMapDevices`): the lights
// that are on as glowing dots (and the lights that are off too with Tap
// lights, or in the dots look), every pin as a small smoked glass pin with
// its icon and reading, or none.
//
// It draws in the caller's own units (the tile's points on its face, CSS
// pixels in a picture button) inside a box `width` by `height`, working out
// the projection itself as the apps do (`HomeMapTileRules.tipped`), so text
// and line widths keep their size whatever the floor's. The caller puts the
// result in an `<svg>` whose viewBox is `0 0 width height`, over the look's
// ground (`homeTileGround`). Gradients, clips and filters go in the
// drawing's own `<defs>`; each id names what it holds (a clip's id is a hash
// of its outline), so the same id in two drawings always means the same
// thing.

import { type SVGTemplateResult, nothing, svg } from "lit";
import type { IconProvider } from "../renderer.js";
import { homePinPaint, homePinSymbol } from "./draw.js";
import { HOME_FURNITURE_DEFS, homeFurnitureArt, homeFurnitureOutline } from "./furniture-art.js";
import {
  type HomeBox,
  type HomeFloorKind,
  type HomeSegment,
  HOME_TOLERANCE,
  homeBackSign,
  homeBoxCorners,
  homeBoxOf,
  homeDoorSwings,
  homeFloorKind,
  homeFloorLines,
  homeFloorSpacing,
  homeGapSegments,
  homeGlowRadius,
  homeGridLines,
  homeLabelPoint,
  homePinReading,
  homePointBounds,
  homePolygonHolds,
  homeRoomDirection,
  homeRoomReach,
  homeRoomUnder,
  homeSlidingOpenings,
  homeSlidingPanes,
  homeWallSegments,
  homeWallsOf,
  homeWindowSegments,
  isGap,
  onWallLine,
  segmentLength,
} from "./geometry.js";
import {
  type HomeMapFloor,
  type HomeMapLook,
  type HomeMapOpening,
  type HomeMapPin,
  type HomeMapRoom,
  type HomeMapStates,
  type HomePoint,
  homeMapPinLook,
  homeMapPinRoom,
  homeMapShownFloor,
} from "./model.js";

/** A Home map tile's look (`homeMapLook`), as the home style names it. */
export type HomeTileLook = HomeMapLook;

/** The looks drawn as a small model turned and tipped back. */
export const HOME_TILE_MODEL_LOOKS: readonly HomeTileLook[] = ["night", "warm", "lines", "clay", "blueprint"];

/** Which devices a Home map tile draws (`homeMapDevices`). */
export type HomeTileDevices = "lights" | "all" | "none";

/** The model's turn when a tile names none, in degrees: as the iPhone's 3D
 * view first frames a floor. */
export const HOME_TILE_DEFAULT_TURN = -28;

/** What the tile draws and how. */
export interface HomeTileArtOptions {
  /** The floor, already cut to the tile's room. */
  floor: HomeMapFloor;
  states?: HomeMapStates | undefined;
  look: HomeTileLook;
  /** The model's turn in degrees; the plan and dots looks ignore it. */
  turn?: number;
  /** Room names on dark pills, where they fit. */
  names?: boolean;
  devices?: HomeTileDevices;
  furniture?: boolean;
  /** The pools of light, the lit room's tint and the wash up its walls. */
  glow?: boolean;
  /** The lights that are off show too, each something to tap. */
  tapLights?: boolean;
  /** The box drawn in, in the caller's units. */
  width: number;
  height: number;
  /** The whole tile's height, for the rule that names show only on a tile
   * taller than 90 points. Absent: `height`. */
  tileHeight?: number;
  /** Draws each pin's icon when every device shows. */
  icons?: IconProvider | undefined;
  /** The blueprint's sizes in meters, or in feet and inches. */
  metric?: boolean;
  /** A fixed fit for the flat looks in place of fitting the floor to the
   * box: `scale` units per meter, the plan's 0, 0 at `ox`, `oy`. The map
   * editor's stage draws with it, so a room dragged across the plan does
   * not move every other one with a new fit. The model looks ignore it. */
  frame?: { scale: number; ox: number; oy: number };
}

// ── colours ─────────────────────────────────────────────────────────────

/** A colour from 0 to 1 channels, as CSS takes it. */
function rgba(r: number, g: number, b: number, a = 1): string {
  const c = (v: number) => Math.round(Math.min(Math.max(v, 0), 1) * 255);
  return a >= 1 ? `rgb(${c(r)},${c(g)},${c(b)})` : `rgba(${c(r)},${c(g)},${c(b)},${Math.round(a * 1000) / 1000})`;
}

/** A colour that can be shaded. */
type Tone = readonly [number, number, number];
const toneColor = (t: Tone, shade = 1, opacity = 1) => rgba(t[0] * shade, t[1] * shade, t[2] * shade, opacity);
const scaled = (t: Tone, f: number): Tone => [Math.min(t[0] * f, 1), Math.min(t[1] * f, 1), Math.min(t[2] * f, 1)];

/** The plan's colours (`HomeMapFlatView.Palette`). */
const PLAN = {
  ground: rgba(0.07, 0.065, 0.06),
  wallFace: rgba(0.95, 0.93, 0.9),
  wallEdge: rgba(0, 0, 0, 0.55),
  window: rgba(0.56, 0.79, 0.97),
  lightOn: rgba(1, 0.83, 0.36),
  off: rgba(0.34, 0.34, 0.34),
  threshold: rgba(0.7, 0.66, 0.6),
  ink: rgba(0, 0, 0, 0.38),
  pill: rgba(0.05, 0.06, 0.07, 0.66),
  glass: rgba(0.09, 0.11, 0.13, 0.74),
  locked: rgba(0.3, 0.8, 0.45),
  unlocked: rgba(1, 0.58, 0.2),
};

const PLAN_FLOOR: Record<HomeFloorKind, string> = {
  wood: rgba(0.7, 0.54, 0.38),
  tile: rgba(0.8, 0.79, 0.76),
  stone: rgba(0.74, 0.76, 0.78),
  carpet: rgba(0.6, 0.57, 0.54),
  plain: rgba(0.66, 0.65, 0.63),
};

const PLAN_FLOOR_LINE: Record<HomeFloorKind, string> = {
  wood: rgba(0.42, 0.29, 0.18, 0.38),
  tile: rgba(0, 0, 0, 0.14),
  stone: rgba(0, 0, 0, 0.14),
  carpet: "none",
  plain: "none",
};

type ModelStyle = "night" | "warm" | "lines" | "clay" | "blueprint";

/** One model style's colours (`HomeMapIsoArt.Palette`). */
const MODEL = {
  floor(style: ModelStyle, kind: HomeFloorKind): Tone {
    switch (style) {
      case "night":
        return ({ wood: [0.29, 0.23, 0.17], tile: [0.23, 0.235, 0.25], stone: [0.23, 0.24, 0.25], carpet: [0.25, 0.23, 0.27], plain: [0.24, 0.24, 0.25] } as const)[kind];
      case "warm":
        return ({ wood: [0.42, 0.29, 0.2], tile: [0.36, 0.32, 0.28], stone: [0.33, 0.31, 0.29], carpet: [0.36, 0.2, 0.18], plain: [0.34, 0.31, 0.28] } as const)[kind];
      case "lines": return [0.043, 0.051, 0.07];
      case "clay": return [0.914, 0.902, 0.882];
      case "blueprint": return [0.09, 0.25, 0.5];
    }
  },
  floorLine(style: ModelStyle, kind: HomeFloorKind): string {
    switch (style) {
      case "night":
      case "warm": return rgba(0, 0, 0, kind === "wood" ? 0.28 : 0.22);
      case "lines": return rgba(1, 0.77, 0.42, 0.12);
      case "clay": return rgba(0, 0, 0, 0.05);
      case "blueprint": return rgba(0.24, 0.42, 0.72);
    }
  },
  stroke(style: ModelStyle): string | undefined {
    return style === "lines" ? rgba(1, 0.77, 0.42) : style === "blueprint" ? rgba(0.81, 0.89, 1) : undefined;
  },
  unlitShade(style: ModelStyle): number {
    return style === "night" ? 0.5 : style === "warm" ? 0.22 : 0;
  },
  lampCore(style: ModelStyle): string {
    return style === "clay" ? rgba(0.95, 0.62, 0.2) : style === "blueprint" ? "#FFFFFF" : rgba(1, 0.96, 0.86);
  },
  offLamp(style: ModelStyle): [string, string] {
    if (style === "clay") return [rgba(0.78, 0.78, 0.78), rgba(0.55, 0.55, 0.55)];
    if (style === "blueprint") return [rgba(0.12, 0.31, 0.63), rgba(0.81, 0.89, 1)];
    return [rgba(0.3, 0.3, 0.3), rgba(0.55, 0.55, 0.55)];
  },
  /** A piece of furniture's colour at night, by what it is made of. */
  furniture(kind: string): Tone {
    switch (kind) {
      case "bed": case "sofa": case "chair": return [0.35, 0.31, 0.27];
      case "table": case "storage": return [0.42, 0.31, 0.21];
      case "refrigerator": case "oven": case "stove": case "dishwasher": case "washerDryer": case "sink": case "bathtub": case "toilet": return [0.56, 0.52, 0.45];
      case "television": case "fireplace": return [0.14, 0.14, 0.16];
      case "stairs": return [0.4, 0.36, 0.3];
      default: return [0.38, 0.35, 0.32];
    }
  },
  /** A solid's top and sides, and how opaque. */
  tone(style: ModelStyle, solid: Solid, isLit: boolean): { top: Tone; side: Tone; opacity: number } {
    const glass = solid.part === "glass";
    switch (style) {
      case "lines":
        return { top: [0.043, 0.051, 0.07], side: [0.043, 0.051, 0.07], opacity: glass ? 0.6 : 1 };
      case "blueprint":
        return glass ? { top: [0.07, 0.21, 0.4], side: [0.07, 0.21, 0.4], opacity: 0.9 } : { top: [0.12, 0.31, 0.63], side: [0.09, 0.25, 0.5], opacity: 1 };
      case "clay":
        if (glass) return { top: [0.81, 0.88, 0.93], side: [0.81, 0.88, 0.93], opacity: 0.9 };
        if (solid.part === "wall") return { top: [1, 1, 1], side: [0.97, 0.96, 0.945], opacity: 1 };
        return { top: [0.97, 0.96, 0.94], side: [0.9, 0.88, 0.85], opacity: 1 };
      case "night":
      case "warm": {
        if (solid.part === "wall") {
          return style === "warm" ? { top: [0.3, 0.27, 0.24], side: [0.165, 0.145, 0.13], opacity: 1 } : { top: [0.29, 0.29, 0.32], side: [0.14, 0.14, 0.165], opacity: 1 };
        }
        if (glass) return { top: [0.36, 0.5, 0.72], side: [0.36, 0.5, 0.72], opacity: 0.35 };
        const base = scaled(MODEL.furniture(solid.kind ?? ""), isLit ? 1 : style === "night" ? 0.6 : 0.85);
        return { top: scaled(base, 1.35), side: base, opacity: 1 };
      }
    }
  },
};

/** The gradient stops of each look's pools of light and lamp halos, from
 * the middle out, spread evenly as SwiftUI spreads a gradient's colours. */
const POOL_STOPS: Partial<Record<HomeTileLook, string[]>> = {
  plan: [rgba(1, 0.83, 0.36, 0.55), rgba(1, 0.83, 0.36, 0.2), rgba(1, 0.83, 0.36, 0)],
  night: [rgba(1, 0.88, 0.66, 0.9), rgba(0.98, 0.72, 0.4, 0.45), rgba(0.96, 0.66, 0.3, 0)],
  warm: [rgba(1, 0.84, 0.56, 0.75), rgba(0.95, 0.65, 0.31, 0.25), rgba(0.95, 0.65, 0.31, 0)],
  lines: [rgba(1, 0.77, 0.42, 0.35), rgba(1, 0.77, 0.42, 0)],
};

const HALO_STOPS: Record<ModelStyle | "dot", string[]> = {
  night: [rgba(1, 0.94, 0.81, 0.9), rgba(1, 0.83, 0.54, 0.45), rgba(1, 0.83, 0.54, 0)],
  warm: [rgba(1, 0.94, 0.81, 0.9), rgba(1, 0.83, 0.54, 0.45), rgba(1, 0.83, 0.54, 0)],
  lines: [rgba(1, 0.94, 0.81, 0.9), rgba(1, 0.77, 0.42, 0.4), rgba(1, 0.77, 0.42, 0)],
  clay: [rgba(1, 0.78, 0.4, 0.55), rgba(1, 0.78, 0.4, 0)],
  blueprint: [rgba(1, 1, 1, 0.6), rgba(1, 1, 1, 0)],
  dot: [rgba(1, 0.83, 0.36, 0.45), rgba(1, 0.83, 0.36, 0)],
};

// ── the tile's ground and words ─────────────────────────────────────────

/** Whether a look is light, with dark words over it. */
export function homeTileLookIsLight(look: HomeTileLook): boolean {
  return look === "clay";
}

/**
 * The tile's ground under the picture, as a CSS background
 * (`HomeMapTilePlan.groundGradient` and `ground`): a soft light from the
 * upper middle for the four model looks, a flat colour for night and dots,
 * the plan's own dark ground for plan. `unit` is CSS pixels per point, for
 * the gradient's reach of 220 points.
 */
export function homeTileGround(look: HomeTileLook, unit = 1): string {
  const radial = (a: string, b: string) => `radial-gradient(circle ${Math.round(220 * unit * 10) / 10}px at 45% 40%, ${a}, ${b})`;
  switch (look) {
    case "warm": return radial(rgba(0.18, 0.14, 0.11), rgba(0.07, 0.055, 0.045));
    case "lines": return radial(rgba(0.07, 0.08, 0.1), rgba(0.02, 0.024, 0.03));
    case "clay": return radial(rgba(0.96, 0.95, 0.93), rgba(0.85, 0.84, 0.815));
    case "blueprint": return radial(rgba(0.1, 0.25, 0.48), rgba(0.05, 0.14, 0.31));
    case "night": return rgba(0.03, 0.035, 0.04);
    case "dots": return rgba(0.11, 0.12, 0.14);
    case "plan": return PLAN.ground;
  }
}

/** The tile's name over its ground. */
export function homeTileTitleColor(look: HomeTileLook): string {
  return homeTileLookIsLight(look) ? rgba(0, 0, 0, 0.78) : rgba(1, 1, 1, 0.9);
}

/** The tile's "N lights on" over its ground: the lamps' colour while one
 * is on. */
export function homeTileLightsColor(look: HomeTileLook, lit: boolean): string {
  if (homeTileLookIsLight(look)) return lit ? rgba(0.55, 0.32, 0.04) : rgba(0, 0, 0, 0.55);
  return lit ? PLAN.lightOn : rgba(1, 1, 1, 0.6);
}

/** Where the picture sits in a tile `width` by `height` points: inset 8 at
 * the sides and 26 above and below on a tile taller than 90, room for its
 * name and the lights line, else 8 all round (`HomeMapTileRules.planRect`). */
export function homeTilePlanRect(width: number, height: number): { x: number; y: number; width: number; height: number } {
  const vertical = height > 90 ? 26 : 8;
  return { x: 8, y: vertical, width: Math.max(width - 16, 0), height: Math.max(height - vertical * 2, 0) };
}

// ── the projection ──────────────────────────────────────────────────────

/** How far the model tips back from flat. */
const TILT = (50 * Math.PI) / 180;
/** The walls between rooms stand this tall, in meters. */
const LOW_WALL = 1.0;
/** The near outside walls: a kerb, so they hide nothing. */
const NEAR_WALL = 0.4;
/** Furniture taller than this is cut, so a wardrobe hides little. */
const FURNITURE_CAP = 1.2;
/** Walls are cut into stretches this long for the far to near sort. */
const STRETCH = 0.6;

const tallWall = (room: HomeMapRoom) => Math.min(Math.max(room.height, 2.0), 2.6);

/** Plan meters to drawing units: turned by `turn`, squashed top to bottom by
 * `squash`, a point `z` meters up standing `lift` units per meter above its
 * foot. A flat look has no turn, no squash and no lift. */
interface Projection {
  scale: number;
  ox: number;
  oy: number;
  turn: number;
  squash: number;
  lift: number;
}

function turned(p: readonly number[], angle: number): HomePoint {
  if (angle === 0) return [p[0]!, p[1]!];
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [p[0]! * c - p[1]! * s, p[0]! * s + p[1]! * c];
}

function project(P: Projection, p: readonly number[], z = 0): HomePoint {
  const t = turned(p, P.turn);
  return [P.ox + t[0] * P.scale, P.oy + t[1] * P.squash * P.scale - z * P.lift];
}

/** Where a light or device stands: at its own height, kept under the
 * tallest wall so it stays inside the fit (`HomeMapTileRules.lampHeight`).
 * A flat look has no lift, so it lands on the plan. */
function standingAt(P: Projection, floor: HomeMapFloor, pin: HomeMapPin): HomePoint {
  const tallest = floor.rooms.reduce((m, r) => Math.max(m, tallWall(r)), LOW_WALL);
  return project(P, pin.at, Math.min(Math.max(pin.at[2] ?? 0, 0), tallest));
}

/** The plan at `z` meters up as one SVG matrix, so a shape drawn in meters
 * lies on the floor, or on a piece's top, as the look sees it. */
function affine(P: Projection, z = 0): string {
  const c = Math.cos(P.turn);
  const s = Math.sin(P.turn);
  return `matrix(${[P.scale * c, P.squash * P.scale * s, -P.scale * s, P.squash * P.scale * c, P.ox, P.oy - z * P.lift].map(r3).join(" ")})`;
}

/** The flat looks' fit: the rooms' outlines filling the box, kept in
 * proportion and centred, at least a meter each way. */
function flatProjection(outline: HomePoint[], width: number, height: number): Projection | undefined {
  const b = homePointBounds(outline);
  if (b === undefined) return undefined;
  const scale = Math.max(0, Math.min(width / Math.max(b.maxX - b.minX, 1), height / Math.max(b.maxY - b.minY, 1)));
  return { scale, ox: width / 2 - ((b.minX + b.maxX) / 2) * scale, oy: height / 2 - ((b.minY + b.maxY) / 2) * scale, turn: 0, squash: 1, lift: 0 };
}

/** The model's fit (`HomeMapTileRules.tipped`): the outline turned by
 * `turn` and tipped back, with room above it for walls `wall` meters tall,
 * fitted to the box and centred. */
function tippedProjection(outline: HomePoint[], turn: number, wall: number, width: number, height: number): Projection | undefined {
  const squash = Math.cos(TILT);
  const lift = Math.sin(TILT);
  const rise = wall * lift;
  const b = homePointBounds(outline.map((p) => turned(p, turn)));
  if (b === undefined) return undefined;
  const minY = b.minY * squash;
  const maxY = b.maxY * squash;
  const scale = Math.max(0, Math.min(width / Math.max(b.maxX - b.minX, 1), height / Math.max(maxY - minY + rise, 1)));
  return {
    scale,
    ox: width / 2 - ((b.minX + b.maxX) / 2) * scale,
    // The walls' tops stand `rise` above the plan, so the plan sits that
    // much lower to centre both.
    oy: height / 2 - ((minY + maxY) / 2) * scale + (rise * scale) / 2,
    turn,
    squash,
    lift: lift * scale,
  };
}

// ── drawing helpers ─────────────────────────────────────────────────────

const r3 = (v: number) => Math.round(v * 1000) / 1000;
const r2 = (v: number) => Math.round(v * 100) / 100;
const pts = (points: readonly HomePoint[]) => points.map(([x, y]) => `${r2(x)},${r2(y)}`).join(" ");
const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif";

/** A short hash of some text, for an id that names its content. */
function hash(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

/** The `<defs>` of one drawing, each id once. */
class Defs {
  private readonly held = new Map<string, SVGTemplateResult>();

  /** A clip to a polygon, by the hash of its points. */
  clip(points: readonly HomePoint[]): string {
    const text = pts(points);
    const id = `wa-hmt-c-${hash(text)}`;
    if (!this.held.has(id)) this.held.set(id, svg`<clipPath id=${id}><polygon points=${text} /></clipPath>`);
    return `url(#${id})`;
  }

  /** A radial gradient of evenly spread stops, by name. */
  radial(name: string, stops: readonly string[]): string {
    const id = `wa-hmt-r-${name}`;
    if (!this.held.has(id)) {
      this.held.set(id, svg`<radialGradient id=${id}>${stops.map((c, i) => svg`<stop offset=${r3(i / Math.max(stops.length - 1, 1))} stop-color=${c} />`)}</radialGradient>`);
    }
    return `url(#${id})`;
  }

  /** A soft blur `std` units wide. */
  blur(std: number): string {
    const s = Math.max(Math.round(std * 10) / 10, 0.1);
    const id = `wa-hmt-b-${String(s).replace(".", "_")}`;
    if (!this.held.has(id)) this.held.set(id, svg`<filter id=${id} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation=${s} /></filter>`);
    return `url(#${id})`;
  }

  /** A soft shadow or glow round everything drawn in it. */
  shadow(std: number, dy: number, color: string): string {
    const s = Math.max(Math.round(std * 10) / 10, 0.1);
    const d = Math.round(dy * 10) / 10;
    const id = `wa-hmt-s-${hash(`${s}|${d}|${color}`)}`;
    if (!this.held.has(id)) {
      this.held.set(id, svg`<filter id=${id} x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy=${d} stdDeviation=${s} flood-color=${color} /></filter>`);
    }
    return `url(#${id})`;
  }

  /** A gradient made once by the caller, by its id. */
  own(id: string, def: SVGTemplateResult): string {
    if (!this.held.has(id)) this.held.set(id, def);
    return `url(#${id})`;
  }

  get all(): SVGTemplateResult {
    return svg`<defs>${[...this.held.values()]}</defs>`;
  }
}

function linePath(lines: readonly (readonly [HomePoint, HomePoint])[]): string {
  return lines.map(([a, b]) => `M${r2(a[0])} ${r2(a[1])}L${r2(b[0])} ${r2(b[1])}`).join("");
}

/** About how wide a line of bold text is, without a canvas to measure it:
 * a little over half its size per letter. */
function textWidth(text: string, size: number): number {
  return [...text].length * size * 0.6;
}

// ── what is lit ─────────────────────────────────────────────────────────

/** A light pin and whether it is on, with its brightness. */
interface Light {
  pin: HomeMapPin;
  on: boolean;
  brightness: number | undefined;
}

function lightsOf(floor: HomeMapFloor, states: HomeMapStates | undefined): Light[] {
  return floor.pins.flatMap((pin) => {
    if (pin.entityId.slice(0, pin.entityId.indexOf(".")) !== "light") return [];
    const look = homeMapPinLook(pin.entityId, states);
    return [{ pin, on: look.kind === "light" && look.on, brightness: look.kind === "light" && look.on ? look.brightness : undefined }];
  });
}

/** The rooms with a light on: each room a lit light pin stands in. */
function litRoomsOf(floor: HomeMapFloor, lights: readonly Light[]): Set<string> {
  const out = new Set<string>();
  for (const l of lights) {
    if (!l.on) continue;
    const room = homeMapPinRoom(floor, l.pin);
    if (room !== undefined) out.add(room.id);
  }
  return out;
}

// ── the picture ─────────────────────────────────────────────────────────

const memo = new WeakMap<HomeMapFloor, WeakMap<object, Map<string, SVGTemplateResult>>>();
const NO_STATES = {};

/**
 * The tile's picture in its look, in a box `width` by `height` of the
 * caller's units, as the children of an `<svg>` with that viewBox. The
 * outer group carries `data-look`. A floor with no rooms draws nothing.
 * Kept per floor, states and options, so a page that draws again with
 * nothing changed reuses the picture.
 */
export function homeTileArt(o: HomeTileArtOptions): SVGTemplateResult {
  // Only the glass pins draw icons, so only they depend on the provider;
  // those drawings are not kept.
  const icons = o.devices === "all" ? o.icons : undefined;
  const key = JSON.stringify([o.look, o.turn, o.names, o.devices, o.furniture, o.glow, o.tapLights, r2(o.width), r2(o.height), o.tileHeight, o.metric, o.frame]);
  let byStates = memo.get(o.floor);
  if (byStates === undefined) memo.set(o.floor, (byStates = new WeakMap()));
  const statesKey = (o.states ?? NO_STATES) as object;
  let drawn = byStates.get(statesKey);
  if (drawn === undefined) byStates.set(statesKey, (drawn = new Map()));
  const kept = icons === undefined ? drawn.get(key) : undefined;
  if (kept !== undefined) return kept;
  const out = draw({ ...o, icons });
  if (icons === undefined) drawn.set(key, out);
  return out;
}

function draw(o: HomeTileArtOptions): SVGTemplateResult {
  // A hidden object is drawn nowhere.
  const floor = homeMapShownFloor(o.floor);
  const outline = floor.rooms.flatMap((r) => r.outline);
  const model = HOME_TILE_MODEL_LOOKS.includes(o.look);
  const turn = (Math.max(-180, Math.min(180, Math.round(o.turn ?? HOME_TILE_DEFAULT_TURN))) * Math.PI) / 180;
  const tallest = floor.rooms.reduce((m, r) => Math.max(m, tallWall(r)), LOW_WALL);
  const P = model ? tippedProjection(outline, turn, tallest, o.width, o.height)
    : o.frame !== undefined ? { scale: o.frame.scale, ox: o.frame.ox, oy: o.frame.oy, turn: 0, squash: 1, lift: 0 }
    : flatProjection(outline, o.width, o.height);
  if (P === undefined || floor.rooms.length === 0) return svg`<g class="hmt" data-look=${o.look}></g>`;
  const defs = new Defs();
  const lights = lightsOf(floor, o.states);
  const lit = litRoomsOf(floor, lights);
  const ctx: Ctx = {
    o,
    P,
    defs,
    floor,
    lights,
    lit,
    glow: o.glow !== false,
    furniture: o.furniture !== false,
    devices: o.devices ?? "lights",
    names: o.names !== false && (o.tileHeight ?? o.height) > 90,
    dot: Math.min(Math.max(Math.min(o.width, o.height) * 0.028, 2.5), 6),
  };
  const body = o.look === "plan" ? drawPlan(ctx) : o.look === "dots" ? drawDots(ctx) : drawModel(ctx, o.look as ModelStyle);
  return svg`<g class="hmt" data-look=${o.look}>${defs.all}${body}</g>`;
}

interface Ctx {
  o: HomeTileArtOptions;
  P: Projection;
  defs: Defs;
  floor: HomeMapFloor;
  lights: Light[];
  lit: Set<string>;
  glow: boolean;
  furniture: boolean;
  devices: HomeTileDevices;
  /** Names, once the tile is tall enough for them. */
  names: boolean;
  /** A light's dot's radius. */
  dot: number;
}

const roomPoints = (ctx: Ctx, room: HomeMapRoom, z = 0) => room.outline.map((p) => project(ctx.P, p, z));

// ── plan ────────────────────────────────────────────────────────────────

function drawPlan(ctx: Ctx): SVGTemplateResult[] {
  const { P, defs, floor } = ctx;
  const len = (m: number) => m * P.scale;
  const out: SVGTemplateResult[] = [];
  const fall = defs.own("wa-hmt-fall", svg`<linearGradient id="wa-hmt-fall" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.1" /><stop offset="1" stop-color="#000000" stop-opacity="0.1" /></linearGradient>`);

  // Floors: each laid with what its room would have, a gentle fall of
  // light across it, and a soft shade where it meets its walls.
  const shade = Math.min(len(0.3), 14);
  for (const room of floor.rooms) {
    const points = roomPoints(ctx, room);
    const text = pts(points);
    const kind = homeFloorKind(room);
    out.push(svg`<polygon class="hmt-floor" data-room=${room.id} points=${text} fill=${PLAN_FLOOR[kind]} />`,
      svg`<polygon points=${text} fill=${fall} />`);
    const clip = defs.clip(points);
    const spacing = homeFloorSpacing(kind);
    const lines = spacing !== undefined && len(spacing) >= 3.5
      ? svg`<path d=${linePath(homeFloorLines(room, kind, homeRoomDirection(room)).map(([a, b]) => [project(P, a), project(P, b)] as const))}
        stroke=${PLAN_FLOOR_LINE[kind]} stroke-width=${kind === "wood" ? 0.75 : 1} fill="none" />`
      : nothing;
    out.push(svg`<g clip-path=${clip}>${lines}<polygon points=${text} fill="none" stroke="rgba(0,0,0,0.1)" stroke-width=${r2(shade * 2)} />
      <polygon points=${text} fill="none" stroke="rgba(0,0,0,0.1)" stroke-width=${r2(shade * 0.8)} /></g>`);
  }

  // The glow on the floor round each lit light, kept inside its room.
  if (ctx.glow) {
    const pool = defs.radial("plan", POOL_STOPS.plan!);
    for (const light of ctx.lights) {
      if (!light.on) continue;
      const room = homeMapPinRoom(floor, light.pin);
      const [x, y] = project(P, light.pin.at);
      const circle = svg`<circle class="hmt-pool" cx=${r2(x)} cy=${r2(y)} r=${r2(len(homeGlowRadius(light.brightness)))} fill=${pool} />`;
      out.push(room === undefined || room.outline.length < 3 ? circle : svg`<g clip-path=${defs.clip(roomPoints(ctx, room))}>${circle}</g>`);
    }
  }

  // Each doorway's threshold, the floor running through the wall, and the
  // faint quarter circle each door sweeps.
  for (const gap of homeGapSegments(floor)) {
    const [a, b] = [project(P, gap.a), project(P, gap.b)];
    out.push(svg`<line x1=${r2(a[0])} y1=${r2(a[1])} x2=${r2(b[0])} y2=${r2(b[1])} stroke=${PLAN.threshold} stroke-width=${r2(Math.max(len(gap.t), 1.5))} />`);
  }
  const doors = homeDoorSwings(floor).filter((d) => len(Math.hypot(d.shut[0] - d.hinge[0], d.shut[1] - d.hinge[1])) > 8);
  for (const door of doors) {
    const sweep = swingPoints(door).map((p) => project(P, p));
    const hinge = project(P, door.hinge);
    const d = sweep.map(([x, y], i) => `${i === 0 ? "M" : "L"}${r2(x)} ${r2(y)}`).join("");
    out.push(svg`<path d=${`${d}L${r2(hinge[0])} ${r2(hinge[1])}Z`} fill="rgba(0,0,0,0.05)" />`,
      svg`<path d=${d} fill="none" stroke=${PLAN.ink} stroke-width="1" stroke-dasharray="3 2.5" />`);
  }

  // Furniture, each piece drawn as itself with a soft shadow under it.
  if (ctx.furniture) {
    const allWalls = floor.rooms.flatMap(homeWallsOf);
    let any = false;
    for (const room of floor.rooms) {
      for (const object of room.objects) {
        const box = homeBoxOf(object);
        const w = len(box.width);
        const d = len(box.depth);
        if (w <= 0.5 || d <= 0.5) continue;
        any = true;
        const [cx, cy] = project(P, box.centre);
        const back = homeBackSign(object, room.objects, allWalls);
        // The art draws its back towards minus y.
        const place = `translate(${r2(cx)} ${r2(cy)}) rotate(${r3((box.angle * 180) / Math.PI)}) scale(1 ${back > 0 ? -1 : 1})`;
        const blur = Math.min(Math.max(Math.min(w, d) * 0.08, 1.5), 4);
        out.push(svg`<g class="hmt-piece" data-kind=${object.kind}>
          <g transform=${`translate(0 1.5) ${place}`} filter=${defs.blur(blur / 2)}>${homeFurnitureOutline(object.kind, w, d, "rgba(0,0,0,0.45)")}</g>
          <g transform=${place}>${homeFurnitureArt(object.kind, w, d, P.scale)}</g></g>`);
      }
    }
    if (any) defs.own("wa-hmf", HOME_FURNITURE_DEFS);
  }

  // Walls with their doors, openings and windows cut out: a dark line round
  // them all first, casting a soft shadow on the floor, then their pale
  // faces, so they read crisp and join cleanly at the corners.
  const walls = homeWallSegments(floor);
  const wallLine = (s: HomeSegment, stroke: string, width: number, cap: string) => {
    const [a, b] = [project(P, s.a), project(P, s.b)];
    return svg`<line x1=${r2(a[0])} y1=${r2(a[1])} x2=${r2(b[0])} y2=${r2(b[1])} stroke=${stroke} stroke-width=${r2(width)} stroke-linecap=${cap} />`;
  };
  const edge = defs.shadow(Math.min(Math.max(len(0.06), 1), 3) / 2, Math.min(Math.max(len(0.04), 0.5), 2), "rgba(0,0,0,0.45)");
  out.push(svg`<g class="hmt-walls" filter=${edge}>${walls.map((s) => {
    const w = Math.max(len(s.t), 1.5);
    return wallLine(s, PLAN.wallEdge, w + Math.min(Math.max(w * 0.3, 0.8), 2), "square");
  })}</g>`);
  out.push(svg`<g>${walls.map((s) => wallLine(s, PLAN.wallFace, Math.max(len(s.t), 1.5), "square"))}</g>`);
  // Windows: a pane of glass across the wall with its line of light; a
  // sliding one draws its two panes instead of the one line.
  const sliding = homeSlidingOpenings(floor);
  const slidingWindow = (s: HomeSegment) => sliding.some(({ opening: o }) => o.kind === "window" && o.a[0] === s.a[0] && o.a[1] === s.a[1] && o.b[0] === s.b[0] && o.b[1] === s.b[1]);
  for (const s of homeWindowSegments(floor)) {
    out.push(wallLine(s, "rgba(143,201,247,0.25)", Math.max(len(s.t), 1.5), "butt"));
    if (!slidingWindow(s)) out.push(wallLine(s, PLAN.window, Math.max(len(s.t) * 0.25, 1), "butt"));
  }
  // Sliding doors and windows: two offset panes, no swing.
  for (const { opening, t } of sliding) {
    for (const pane of homeSlidingPanes(opening, t)) {
      const w = Math.max(len(pane.t), 1);
      if (opening.kind === "window") out.push(wallLine(pane, PLAN.window, w, "butt"));
      else out.push(wallLine(pane, PLAN.wallEdge, w + 1.2, "butt"), wallLine(pane, PLAN.wallFace, w, "butt"));
    }
  }
  // The doors' leaves, standing open.
  for (const door of doors) {
    const w = Math.max(len(0.04), 1.5);
    const leaf = { a: door.hinge, b: door.open, t: 0 };
    out.push(wallLine(leaf, PLAN.wallEdge, w + 1.2, "round"), wallLine(leaf, PLAN.wallFace, w, "round"));
  }

  if (ctx.names) out.push(...names(ctx, () => ({ text: rgba(1, 1, 1), pill: PLAN.pill })));
  out.push(...devices(ctx, "plan"));
  return out;
}

/** The quarter circle a door's free end sweeps, from open to shut. */
function swingPoints(door: { hinge: HomePoint; shut: HomePoint; open: HomePoint }): HomePoint[] {
  const start = Math.atan2(door.open[1] - door.hinge[1], door.open[0] - door.hinge[0]);
  let sweep = Math.atan2(door.shut[1] - door.hinge[1], door.shut[0] - door.hinge[0]) - start;
  if (sweep > Math.PI) sweep -= 2 * Math.PI;
  if (sweep < -Math.PI) sweep += 2 * Math.PI;
  const radius = Math.hypot(door.shut[0] - door.hinge[0], door.shut[1] - door.hinge[1]);
  const out: HomePoint[] = [];
  for (let i = 0; i <= 16; i += 1) {
    const angle = start + (sweep * i) / 16;
    out.push([door.hinge[0] + Math.cos(angle) * radius, door.hinge[1] + Math.sin(angle) * radius]);
  }
  return out;
}

// ── dots ────────────────────────────────────────────────────────────────

function drawDots(ctx: Ctx): SVGTemplateResult[] {
  const { P, floor } = ctx;
  const out: SVGTemplateResult[] = floor.rooms.map((room) =>
    svg`<polygon class="hmt-floor" data-room=${room.id} points=${pts(roomPoints(ctx, room))} fill="rgb(38,42,48)" />`);
  const line = (s: HomeSegment, stroke: string, width: number, cap: string, opacity = 1) => {
    const [a, b] = [project(P, s.a), project(P, s.b)];
    return svg`<line x1=${r2(a[0])} y1=${r2(a[1])} x2=${r2(b[0])} y2=${r2(b[1])} stroke=${stroke} stroke-opacity=${opacity === 1 ? nothing : opacity} stroke-width=${r2(width)} stroke-linecap=${cap} />`;
  };
  for (const s of homeWallSegments(floor)) out.push(line(s, "rgb(135,135,135)", Math.max(s.t * P.scale * 0.7, 1), "square"));
  for (const s of homeWindowSegments(floor)) out.push(line(s, PLAN.window, Math.max(s.t * P.scale * 0.6, 1), "butt", 0.6));
  out.push(...devices(ctx, "dots"));
  return out;
}

// ── the model ───────────────────────────────────────────────────────────

/** One box of the model: a footprint of four corners going round, from `z0`
 * up to `z1`. A stretch of wall, a pane of glass, or a piece of furniture
 * with its kind, its back and its box. */
interface Solid {
  part: "wall" | "glass" | "piece";
  kind?: string;
  back?: number;
  box?: HomeBox;
  roomId: string;
  quad: HomePoint[];
  z0: number;
  z1: number;
  /** Edges (from corner i to i + 1) inside a longer wall, never drawn. */
  seams: Set<number>;
}

const middleOf = (quad: readonly HomePoint[]): HomePoint => [quad.reduce((s, p) => s + p[0], 0) / quad.length, quad.reduce((s, p) => s + p[1], 0) / quad.length];

/** Which way a wall of `room` faces out of it: the unit normal pointing away
 * from the room's middle. */
function outward(wall: HomeSegment, room: HomeMapRoom): HomePoint {
  const length = Math.max(segmentLength(wall), 1e-9);
  let n: HomePoint = [-(wall.b[1] - wall.a[1]) / length, (wall.b[0] - wall.a[0]) / length];
  const mid = [(wall.a[0] + wall.b[0]) / 2, (wall.a[1] + wall.b[1]) / 2];
  const inside = homeLabelPoint(room);
  if (inside !== undefined && (inside[0] - mid[0]!) * n[0] + (inside[1] - mid[1]!) * n[1] > 0) n = [-n[0], -n[1]];
  return n;
}

/** How tall a wall of `room` stands at `turn`: an outside wall facing away
 * stands full height, one facing near is a kerb, any other (a wall another
 * room lies behind) is cut low. */
function wallHeight(wall: HomeSegment, room: HomeMapRoom, floor: HomeMapFloor, turn: number): number {
  const n = outward(wall, room);
  const mid = [(wall.a[0] + wall.b[0]) / 2, (wall.a[1] + wall.b[1]) / 2];
  const probe = [mid[0]! + n[0] * (wall.t / 2 + 0.35), mid[1]! + n[1] * (wall.t / 2 + 0.35)];
  const outside = !floor.rooms.some((r) => r.id !== room.id && homePolygonHolds(r.outline, probe));
  if (!outside) return LOW_WALL;
  const facing = turned(n, turn)[1];
  if (facing < -0.2) return tallWall(room);
  if (facing > 0.2) return NEAR_WALL;
  return LOW_WALL;
}

/** One wall as boxes: split at every opening along it, each stretch
 * standing from the floor to `height` less its holes (a door or an opening
 * from the floor up, a window from its sill to its head), with glass in
 * each window's hole, and each stretch cut into short pieces. */
function wallParts(wall: HomeSegment, height: number, openings: readonly HomeMapOpening[], roomId: string): Solid[] {
  const length = segmentLength(wall);
  if (length <= HOME_TOLERANCE) return [];
  const ux = (wall.b[0] - wall.a[0]) / length;
  const uy = (wall.b[1] - wall.a[1]) / length;
  const nx = (-uy * wall.t) / 2;
  const ny = (ux * wall.t) / 2;
  const along = (p: HomePoint) => (p[0] - wall.a[0]) * ux + (p[1] - wall.a[1]) * uy;
  const point = (s: number): HomePoint => [wall.a[0] + ux * s, wall.a[1] + uy * s];
  const holes: { s0: number; s1: number; z0: number; z1: number; window: boolean }[] = [];
  for (const opening of openings) {
    if (!onWallLine(opening, wall)) continue;
    const s0 = Math.max(0, Math.min(along(opening.a), along(opening.b)));
    const s1 = Math.min(length, Math.max(along(opening.a), along(opening.b)));
    const z0 = isGap(opening) ? 0 : Math.max(0, Math.min(opening.z0, opening.z1));
    const z1 = isGap(opening) ? height : Math.min(height, Math.max(opening.z0, opening.z1));
    if (s1 - s0 <= 0.02 || z1 - z0 <= 0.02) continue;
    holes.push({ s0, s1, z0, z1, window: opening.kind === "window" });
  }
  const stops = [...new Set([0, length, ...holes.flatMap((h) => [h.s0, h.s1])])].sort((p, q) => p - q);
  const out: Solid[] = [];
  const add = (s0: number, s1: number, z0: number, z1: number, glass: boolean) => {
    const count = Math.max(1, Math.floor((s1 - s0) / STRETCH));
    const step = (s1 - s0) / count;
    const thin = glass ? 0.35 : 1;
    for (let i = 0; i < count; i += 1) {
      const p = point(s0 + step * i);
      const q = point(s0 + step * (i + 1));
      const seams = new Set<number>();
      if (i > 0) seams.add(3);
      if (i < count - 1) seams.add(1);
      out.push({
        part: glass ? "glass" : "wall",
        roomId,
        quad: [[p[0] - nx * thin, p[1] - ny * thin], [q[0] - nx * thin, q[1] - ny * thin], [q[0] + nx * thin, q[1] + ny * thin], [p[0] + nx * thin, p[1] + ny * thin]],
        z0,
        z1,
        seams,
      });
    }
  };
  for (let i = 0; i + 1 < stops.length; i += 1) {
    const p = stops[i]!;
    const q = stops[i + 1]!;
    if (q - p <= 0.02) continue;
    const mid = (p + q) / 2;
    const over = holes.filter((h) => h.s0 <= mid && mid <= h.s1);
    let start = 0;
    for (const hole of [...over].sort((a, b) => a.z0 - b.z0)) {
      if (hole.z0 - start > 0.02) add(p, q, start, Math.min(hole.z0, height), false);
      start = Math.max(start, hole.z1);
    }
    if (height - start > 0.02) add(p, q, start, height, false);
    for (const w of over) if (w.window) add(p, q, w.z0, w.z1, true);
  }
  return out;
}

/** The model's solids at `turn`, far to near: every stretch of wall and
 * pane of glass, and the furniture standing on the floor. */
function solidsOf(floor: HomeMapFloor, turn: number, furniture: boolean): Solid[] {
  const openings = floor.rooms.flatMap((r) => r.openings);
  const solids: Solid[] = floor.rooms.flatMap((room) => homeWallsOf(room).flatMap((w) => wallParts(w, wallHeight(w, room, floor, turn), openings, room.id)));
  if (furniture) {
    const allWalls = floor.rooms.flatMap(homeWallsOf);
    for (const room of floor.rooms) {
      for (const object of room.objects) {
        const box = homeBoxOf(object);
        if (box.width <= 0.02 || box.depth <= 0.02) continue;
        solids.push({
          part: "piece",
          kind: object.kind,
          back: homeBackSign(object, room.objects, allWalls),
          box,
          roomId: room.id,
          quad: homeBoxCorners(box),
          z0: 0,
          z1: Math.min(Math.max(object.size[2], 0.05), FURNITURE_CAP),
          seams: new Set(),
        });
      }
    }
  }
  const order = solids.map((s) => turned(middleOf(s.quad), turn)[1]);
  return solids.map((s, i) => ({ s, i })).sort((a, b) => (order[a.i] !== order[b.i] ? order[a.i]! - order[b.i]! : a.s.z0 - b.s.z0)).map((x) => x.s);
}

function drawModel(ctx: Ctx, style: ModelStyle): SVGTemplateResult[] {
  const { P, defs, floor, lit } = ctx;
  const out: SVGTemplateResult[] = [];
  const solids = solidsOf(floor, P.turn, ctx.furniture);
  const stroke = MODEL.stroke(style);

  // Floors: the blueprint's measuring grid, else each floor's own boards or
  // tiles where they sit far enough apart to read.
  for (const room of floor.rooms) {
    const points = roomPoints(ctx, room);
    const text = pts(points);
    const kind = homeFloorKind(room);
    out.push(svg`<polygon class="hmt-floor" data-room=${room.id} points=${text} fill=${toneColor(MODEL.floor(style, kind))} />`);
    const direction = homeRoomDirection(room);
    const spacing = style === "blueprint" ? 0.25 : homeFloorSpacing(kind) ?? 0;
    const lines = style === "blueprint" ? homeGridLines(room, 0.25, direction) : homeFloorLines(room, kind, direction);
    if (spacing > 0 && spacing * P.scale * P.squash >= 3.5 && lines.length > 0) {
      out.push(svg`<g clip-path=${defs.clip(points)}><path d=${linePath(lines.map(([a, b]) => [project(P, a), project(P, b)] as const))}
        fill="none" stroke=${MODEL.floorLine(style, kind)} stroke-width=${style === "blueprint" ? 0.6 : 0.75} /></g>`);
    }
    if (stroke !== undefined) out.push(svg`<polygon points=${text} fill="none" stroke=${stroke} stroke-width="1" />`);
  }

  // Clay casts soft shadows from everything standing up, onto the floor.
  if (style === "clay") {
    out.push(svg`<g class="hmt-shadows" opacity="0.22" filter=${defs.blur(Math.max(P.scale * 0.08, 1.5) / 2)}>${solids.map((s) => shadowOf(s, P))}</g>`);
  }

  // Pools of light on the floor, each kept inside its room.
  const pool = POOL_STOPS[style];
  if (ctx.glow && pool !== undefined) {
    const fill = defs.radial(style, pool);
    for (const light of ctx.lights) {
      if (!light.on) continue;
      const room = homeRoomUnder(floor, light.pin.at);
      if (room === undefined) continue;
      const radius = homeGlowRadius(light.brightness) * 1.15;
      out.push(svg`<g class="hmt-pool" clip-path=${defs.clip(roomPoints(ctx, room))} style=${style === "night" || style === "warm" ? "mix-blend-mode:screen" : nothing}>
        <circle cx=${r3(light.pin.at[0])} cy=${r3(light.pin.at[1])} r=${r3(radius)} fill=${fill} transform=${affine(P)} /></g>`);
    }
  }

  // The rooms with no light on sink into the dark.
  const unlit = MODEL.unlitShade(style);
  if (unlit > 0) {
    for (const room of floor.rooms) {
      if (!lit.has(room.id)) out.push(svg`<polygon points=${pts(roomPoints(ctx, room))} fill=${rgba(0.03, 0.03, 0.045, unlit)} />`);
    }
  }

  // Every solid, far to near. Lines glow, so its solids go in a group with
  // a soft amber light round every line.
  const drawn = solids.map((s) => drawSolid(ctx, s, style, lit.has(s.roomId)));
  if (style === "lines") {
    out.push(svg`<g class="hmt-solids" filter=${defs.shadow(Math.max(P.scale * 0.04, 1.2) / 2, 0, rgba(1, 0.77, 0.42, 0.7))}>${drawn}</g>`);
  } else {
    out.push(svg`<g class="hmt-solids">${drawn}</g>`);
  }
  if (solids.some((s) => s.part === "piece") && (style === "night" || style === "warm")) defs.own("wa-hmf", HOME_FURNITURE_DEFS);

  // The blueprint's measures along a lone room's two near sides.
  if (style === "blueprint" && floor.rooms.length === 1) out.push(measures(ctx, floor.rooms[0]!, stroke!));

  if (ctx.names) {
    out.push(...names(ctx, (room) => ({
      text: lit.has(room.id) ? rgba(1, 0.96, 0.9) : rgba(0.7, 0.7, 0.7),
      pill: rgba(0.05, 0.06, 0.07, 0.62),
    })));
  }
  out.push(...devices(ctx, style));
  return out;
}

function drawSolid(ctx: Ctx, solid: Solid, style: ModelStyle, isLit: boolean): SVGTemplateResult {
  const { P, defs } = ctx;
  const quad = solid.quad;
  const bottom = quad.map((p) => project(P, p, solid.z0));
  const top = quad.map((p) => project(P, p, solid.z1));
  const centre = middleOf(quad);
  const tone = MODEL.tone(style, solid, isLit);
  const stroke = MODEL.stroke(style);
  const width = style === "lines" ? 0.9 : 0.8;
  const out: SVGTemplateResult[] = [];

  // The sides that face the viewer, each shaded by which way it faces.
  for (let i = 0; i < 4; i += 1) {
    if (solid.seams.has(i)) continue;
    const j = (i + 1) % 4;
    const a = quad[i]!;
    const b = quad[j]!;
    let n: HomePoint = [b[1] - a[1], -(b[0] - a[0])];
    const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    if ((mid[0]! - centre[0]) * n[0] + (mid[1]! - centre[1]) * n[1] < 0) n = [-n[0], -n[1]];
    const length = Math.max(Math.hypot(n[0], n[1]), 1e-9);
    const facing = turned([n[0] / length, n[1] / length], P.turn);
    if (facing[1] <= 0.001) continue;
    const face = pts([bottom[i]!, bottom[j]!, top[j]!, top[i]!]);
    // Light falls from the upper left.
    out.push(svg`<polygon points=${face} fill=${toneColor(tone.side, 0.82 - 0.14 * facing[0], tone.opacity)} />`);
    if (ctx.glow && (style === "warm" || style === "night") && solid.part === "wall" && isLit && solid.z1 > LOW_WALL + 0.1) {
      // The lamplight washing up a tall wall of a lit room.
      const wash = defs.own("wa-hmt-wash", svg`<linearGradient id="wa-hmt-wash" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stop-color=${rgba(0.96, 0.72, 0.41)} stop-opacity="0.38" /><stop offset="1" stop-color=${rgba(0.96, 0.72, 0.41)} stop-opacity="0" /></linearGradient>`);
      out.push(svg`<polygon points=${face} fill=${wash} />`);
    }
    if (stroke !== undefined) {
      // A seam's own upright line would show the cut; leave it out.
      const segs: [HomePoint, HomePoint][] = [[bottom[i]!, bottom[j]!], [top[i]!, top[j]!]];
      if (!solid.seams.has((i + 3) % 4)) segs.push([bottom[i]!, top[i]!]);
      if (!solid.seams.has(j)) segs.push([bottom[j]!, top[j]!]);
      out.push(svg`<path d=${linePath(segs)} fill="none" stroke=${stroke} stroke-width=${width} />`);
    }
  }

  // The top.
  const lid = pts(top);
  out.push(svg`<polygon points=${lid} fill=${toneColor(tone.top, 1, tone.opacity)} />`);
  if (solid.part === "piece" && solid.box !== undefined && (style === "night" || style === "warm")) {
    const k = P.scale;
    const box = solid.box;
    if (box.width * k >= 8 && box.depth * k >= 8) {
      const place = `${affine(P, solid.z1)} translate(${r3(box.centre[0])} ${r3(box.centre[1])}) scale(${r3(1 / k)}) rotate(${r3((box.angle * 180) / Math.PI)}) scale(1 ${(solid.back ?? 1) > 0 ? -1 : 1})`;
      out.push(svg`<g clip-path=${defs.clip(top)}><g transform=${place}>${homeFurnitureArt(solid.kind ?? "", box.width * k, box.depth * k, k)}</g></g>`);
      const unlit = MODEL.unlitShade(style);
      if (!isLit && unlit > 0) out.push(svg`<polygon points=${lid} fill=${rgba(0, 0, 0, unlit * 0.8)} />`);
    }
  }
  if (stroke !== undefined) {
    const segs: [HomePoint, HomePoint][] = [];
    for (let i = 0; i < 4; i += 1) if (!solid.seams.has(i)) segs.push([top[i]!, top[(i + 1) % 4]!]);
    out.push(svg`<path d=${linePath(segs)} fill="none" stroke=${stroke} stroke-width=${width} />`);
  } else if (solid.part === "wall") {
    // A wall's top catches the light.
    out.push(svg`<path d=${linePath([[top[0]!, top[1]!], [top[2]!, top[3]!]])} fill="none" stroke=${style === "clay" ? "#FFFFFF" : "rgba(255,255,255,0.14)"} stroke-width="0.6" />`);
  }
  return svg`<g class=${`hmt-${solid.part}`}>${out}</g>`;
}

/** The shadow `solid` casts on the floor, with light from the upper left:
 * its footprint and its footprint moved by its height, joined. Drawn
 * opaque in a group whose opacity is the shadow's, so overlaps do not
 * darken twice. */
function shadowOf(solid: Solid, P: Projection): SVGTemplateResult {
  const h = solid.z1;
  const by = turned([0.35 * h, 0.5 * h], -P.turn);
  const moved: HomePoint[] = solid.quad.map((p) => [p[0] + by[0], p[1] + by[1]]);
  const fill = rgba(0.35, 0.32, 0.28);
  const parts = solid.quad.map((_, i) => {
    const j = (i + 1) % solid.quad.length;
    return svg`<polygon points=${pts([project(P, solid.quad[i]!), project(P, solid.quad[j]!), project(P, moved[j]!), project(P, moved[i]!)])} fill=${fill} />`;
  });
  return svg`${parts}<polygon points=${pts(moved.map((p) => project(P, p)))} fill=${fill} />`;
}

/** The blueprint's measure lines: the room's length and width along the two
 * sides nearest the viewer, each with its ends ticked and its size. */
function measures(ctx: Ctx, room: HomeMapRoom, color: string): SVGTemplateResult {
  const { P } = ctx;
  if (room.outline.length < 3) return svg``;
  const direction = homeRoomDirection(room);
  const { a0, a1, c0, c1, point } = homeRoomReach(room, direction);
  const ux = Math.cos(direction);
  const uy = Math.sin(direction);
  const near = (p: HomePoint) => turned(p, P.turn)[1];
  const gap = 0.35;
  const tick = 0.1;
  const cSide = near(point((a0 + a1) / 2, c1)) > near(point((a0 + a1) / 2, c0)) ? c1 + gap : c0 - gap;
  const aSide = near(point(a1, (c0 + c1) / 2)) > near(point(a0, (c0 + c1) / 2)) ? a1 + gap : a0 - gap;
  const segs: [HomePoint, HomePoint][] = [];
  const measure = (p: HomePoint, q: HomePoint, t: [number, number]) => {
    segs.push([project(P, p), project(P, q)]);
    for (const e of [p, q]) segs.push([project(P, [e[0] - t[0] * tick, e[1] - t[1] * tick]), project(P, [e[0] + t[0] * tick, e[1] + t[1] * tick])]);
  };
  const p1 = point(a0, cSide);
  const q1 = point(a1, cSide);
  const p2 = point(aSide, c0);
  const q2 = point(aSide, c1);
  measure(p1, q1, [-uy, ux]);
  measure(p2, q2, [ux, uy]);
  const size = Math.max(Math.min(P.scale * 0.22, 12), 8);
  const metric = ctx.o.metric !== false;
  const words = [[p1, q1, a1 - a0], [p2, q2, c1 - c0]] as const;
  return svg`<g class="hmt-measures"><path d=${linePath(segs)} fill="none" stroke=${color} stroke-opacity="0.85" stroke-width="0.8" />
    ${words.map(([p, q, length]) => {
      const [x, y] = project(P, [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]);
      return svg`<text x=${r2(x)} y=${r2(y + 1)} font-size=${r2(size)} font-weight="600" font-family=${FONT} fill=${color} text-anchor="middle" dominant-baseline="hanging">${homeLengthText(length, metric)}</text>`;
    })}</g>`;
}

/** One length as the blueprint writes it: "3.5 m", or "11′ 6″". */
export function homeLengthText(meters: number, metric: boolean): string {
  if (metric) return `${meters.toFixed(1)} m`;
  const inches = Math.round(meters / 0.0254);
  return `${Math.floor(inches / 12)}′ ${inches % 12}″`;
}

// ── names ───────────────────────────────────────────────────────────────

/** The size room names are drawn at, in the caller's units. */
const NAME_SIZE = 10.5;

/** Each room's name on a small dark pill, where the pill fits inside the
 * room's drawn width (90% of it). */
function names(ctx: Ctx, paint: (room: HomeMapRoom) => { text: string; pill: string }): SVGTemplateResult[] {
  return ctx.floor.rooms.flatMap((room) => {
    const name = room.name?.trim() ?? "";
    const at = homeLabelPoint(room);
    if (name === "" || at === undefined) return [];
    const drawnWidth = (() => {
      const b = homePointBounds(roomPoints(ctx, room));
      return b === undefined ? 0 : b.maxX - b.minX;
    })();
    const width = textWidth(name, NAME_SIZE) + 12;
    if (width > drawnWidth * 0.9) return [];
    const height = NAME_SIZE * 1.2 + 5;
    const [x, y] = project(ctx.P, at);
    const colors = paint(room);
    return [svg`<g class="hmt-name">
      <rect x=${r2(x - width / 2)} y=${r2(y - height / 2)} width=${r2(width)} height=${r2(height)} rx=${r2(height / 2)} fill=${colors.pill} />
      <text x=${r2(x)} y=${r2(y)} font-size=${NAME_SIZE} font-weight="700" font-family=${FONT} fill=${colors.text} text-anchor="middle" dominant-baseline="central">${name}</text></g>`];
  });
}

// ── devices ─────────────────────────────────────────────────────────────

/** The tile's devices in `look`: the lights as glowing dots, every pin as a
 * small glass pin, or none. */
function devices(ctx: Ctx, look: HomeTileLook): SVGTemplateResult[] {
  if (ctx.devices === "none") return [];
  const { P, defs, dot } = ctx;
  if (ctx.devices === "all") {
    if (!HOME_TILE_MODEL_LOOKS.includes(look)) return ctx.floor.pins.map((pin) => glassPin(ctx, pin));
    // In a model look each device stands at its own height on a faint stem
    // down to the floor, the far ones first.
    const pins = [...ctx.floor.pins].sort((a, b) => turned(a.at, P.turn)[1] - turned(b.at, P.turn)[1]);
    const stems = pins.filter((pin) => (pin.at[2] ?? 0) > 0.05).map((pin) => {
      const [x1, y1] = project(P, pin.at);
      const [x2, y2] = standingAt(P, ctx.floor, pin);
      return `M${r2(x1)} ${r2(y1)}L${r2(x2)} ${r2(y2)}`;
    }).join("");
    const ink = look === "clay" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)";
    return [
      ...(stems === "" ? [] : [svg`<path class="hmt-stems" d=${stems} stroke=${ink} stroke-width="0.8" stroke-dasharray="2 2" fill="none" />`]),
      ...pins.map((pin) => glassPin(ctx, pin)),
    ];
  }
  const showsOff = ctx.o.tapLights === true || look === "dots";
  const out: SVGTemplateResult[] = [];
  const disc = (at: HomePoint, r: number, fill: string, extra: { stroke?: string; cls?: string } = {}) =>
    svg`<circle class=${extra.cls ?? nothing} cx=${r2(at[0])} cy=${r2(at[1])} r=${r2(r)} fill=${fill} stroke=${extra.stroke ?? nothing} stroke-width=${extra.stroke === undefined ? nothing : 1} />`;
  if (HOME_TILE_MODEL_LOOKS.includes(look)) {
    // The lights themselves, glowing where they stand (`HomeMapIsoArt`).
    const style = look as ModelStyle;
    const [offFill, offRing] = MODEL.offLamp(style);
    if (showsOff) {
      for (const l of ctx.lights) if (!l.on) out.push(disc(standingAt(P, ctx.floor, l.pin), Math.max(P.scale * 0.06, 2.5), offFill, { stroke: offRing, cls: "hmt-dot-off" }));
    }
    const halo = defs.radial(`halo-${style}`, HALO_STOPS[style]);
    for (const l of ctx.lights) {
      if (!l.on) continue;
      const at = standingAt(P, ctx.floor, l.pin);
      out.push(disc(at, Math.max(P.scale * 0.55, 6), halo), disc(at, Math.max(P.scale * 0.07, 2), MODEL.lampCore(style), { cls: "hmt-dot" }));
    }
    return out;
  }
  if (showsOff) {
    const [fill, ring] = look === "dots" ? [rgba(0.36, 0.39, 0.42), rgba(0.62, 0.62, 0.62)] : [PLAN.off, rgba(1, 1, 1, 0.5)];
    for (const l of ctx.lights) if (!l.on) out.push(disc(project(P, l.pin.at), dot, fill, { stroke: ring, cls: "hmt-dot-off" }));
  }
  const halo = defs.radial("halo-dot", HALO_STOPS.dot);
  const r = look === "dots" ? dot * 1.1 : dot;
  for (const l of ctx.lights) {
    if (!l.on) continue;
    const at = project(P, l.pin.at);
    out.push(disc(at, r * 2.4, halo), disc(at, r, PLAN.lightOn, { cls: "hmt-dot" }));
  }
  return out;
}

/** A pin as smoked glass with its icon in its colour, a light that is on a
 * warm amber with a glow, and its reading hanging under it. */
function glassPin(ctx: Ctx, pin: HomeMapPin): SVGTemplateResult {
  const { P, defs, o } = ctx;
  const look = homeMapPinLook(pin.entityId, o.states);
  const litLight = look.kind === "light" && look.on;
  const d = Math.min(Math.max(Math.min(o.width, o.height) * 0.085, 9), 15);
  const [x, y] = standingAt(P, ctx.floor, pin);
  const iconColor = litLight ? rgba(0, 0, 0, 0.75)
    : look.kind === "light" ? rgba(0.8, 0.8, 0.8)
    : look.kind === "lock" ? (look.locked ? PLAN.locked : PLAN.unlocked)
    : look.kind === "other" ? (look.on ? homePinPaint(pin.entityId, o.states).fill : rgba(0.78, 0.78, 0.78))
    : rgba(0.5, 0.5, 0.5);
  const symbol = d >= 11 ? homePinSymbol(pin.entityId) : undefined;
  // Each glyph is drawn on a 24 point square, scaled down into the pin.
  const glyph = symbol === undefined ? undefined : o.icons?.render(symbol, 24, iconColor);
  const side = d * 0.52;
  const reading = homePinReading(pin.entityId, o.states);
  const readingSize = 8;
  const readingWidth = reading === undefined ? 0 : textWidth(reading, readingSize) + 8;
  return svg`<g class="hmt-pin" data-entity=${pin.entityId} transform=${`translate(${r2(x)} ${r2(y)})`}>
    ${litLight ? svg`<circle r=${r2(d)} fill=${defs.radial("pin-glow", [rgba(1, 0.83, 0.36, 0.6), rgba(1, 0.83, 0.36, 0)])} />` : nothing}
    <circle r=${r2(d / 2)} fill=${litLight ? PLAN.lightOn : PLAN.glass} stroke="rgba(255,255,255,0.45)" stroke-width="1" />
    ${glyph === undefined ? nothing : svg`<g transform=${`translate(${r2(-side / 2)} ${r2(-side / 2)}) scale(${r3(side / 24)})`}>${glyph}</g>`}
    ${reading === undefined ? nothing : svg`<g class="hmt-reading">
      <rect x=${r2(-readingWidth / 2)} y=${r2(d / 2 + 2)} width=${r2(readingWidth)} height=${r2(readingSize + 4)} rx=${r2((readingSize + 4) / 2)} fill=${PLAN.pill} />
      <text y=${r2(d / 2 + 2 + (readingSize + 4) / 2)} font-size=${readingSize} font-weight="700" font-family=${FONT} fill="#FFFFFF" text-anchor="middle" dominant-baseline="central">${reading}</text></g>`}
  </g>`;
}
