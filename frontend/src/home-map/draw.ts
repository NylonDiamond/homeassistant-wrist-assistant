// The flat plan of one floor, drawn in SVG the way every device draws it
// (app repo docs/home_map_plan_2026-10.md, "Drawing"): each room's outline
// filled with a dark warm colour; walls as lines along it with gaps for
// doors and openings and a light blue line for windows; furniture as muted
// rounded boxes seen from above; pins as round buttons, a light that is on
// yellow with a soft glow on the floor sized by its brightness, a lock green
// when locked and orange when not, any other kind in its tile colour, and an
// entity that is gone gray. Room names sit in the middle of each room when
// the whole floor shows.
//
// The plan is drawn in meters: the caller puts `homePlan` in an `<svg>`
// whose viewBox is `homePlanViewBox`. Two callers: the Home map tile's face
// in the page editor (`preview.ts`), small, with a glow over each room with
// a light on and no buttons; and the Home map page, with names, buttons and
// icons. Pins and rooms carry `data-pin` and `data-room`, so the page finds
// what a press landed on without a handler on each.

import { type SVGTemplateResult, nothing, svg } from "lit";
import type { IconProvider } from "../renderer.js";
import { parseTileColor } from "../watch-pages/model.js";
import { watchEntityDefaults } from "../watch-pages/tile-new.js";
import {
  type HomeMapFloor,
  type HomeMapOpening,
  type HomeMapPin,
  type HomeMapRoom,
  type HomeMapStates,
  type HomeMapWall,
  type HomePoint,
  homeMapBounds,
  homeMapLitRooms,
  homeMapPinLook,
  homeMapRoomCenter,
  homeMapRoomName,
  sameHomeMapId,
} from "./model.js";

/** The plan's colours, the same on both skins: the plan is a dark picture,
 * as on the watch. */
export const HOME_PLAN_COLORS = {
  ground: "#1B1816",
  floor: "#3A2F28",
  wall: "#E6DED2",
  window: "#8CCBF0",
  furniture: "#6E645B",
  name: "#F2ECE4",
  lit: "#FFD60A",
  locked: "#30D158",
  unlocked: "#FF9F0A",
  gone: "#8E8E93",
  other: "#8E8E93",
  selected: "#0A84FF",
} as const;

/** The space round the plan, in meters. */
const PAD = 0.4;

/** The viewBox that shows the whole floor with a little room round it. */
export function homePlanViewBox(floor: HomeMapFloor, pad = PAD): { x: number; y: number; width: number; height: number } {
  const b = homeMapBounds(floor);
  return { x: b.minX - pad, y: b.minY - pad, width: Math.max(0.5, b.maxX - b.minX) + pad * 2, height: Math.max(0.5, b.maxY - b.minY) + pad * 2 };
}

/** The viewBox as the attribute takes it. */
export function homePlanViewBoxAttr(floor: HomeMapFloor, pad = PAD): string {
  const v = homePlanViewBox(floor, pad);
  return [v.x, v.y, v.width, v.height].map(r3).join(" ");
}

const r3 = (v: number) => Math.round(v * 1000) / 1000;

// ── walls ────────────────────────────────────────────────────────────────

/** A stretch of a wall, from one point to another. */
export type HomeWallPiece = [HomePoint, HomePoint];

/** Where an opening sits along a wall, from 0 at `a` to 1 at `b`, or
 * undefined when it is not on that wall: both its ends within the wall's
 * thickness (and 5 cm) of the wall's line. */
function spanOn(wall: HomeMapWall, opening: HomeMapOpening): [number, number] | undefined {
  const dx = wall.b[0] - wall.a[0];
  const dy = wall.b[1] - wall.a[1];
  const len2 = dx * dx + dy * dy;
  if (len2 < 1e-6) return undefined;
  const len = Math.sqrt(len2);
  const tolerance = Math.max(wall.t, 0.05) + 0.05;
  const along: number[] = [];
  for (const p of [opening.a, opening.b]) {
    const px = p[0] - wall.a[0];
    const py = p[1] - wall.a[1];
    if (Math.abs(dx * py - dy * px) / len > tolerance) return undefined;
    along.push((px * dx + py * dy) / len2);
  }
  const u0 = Math.max(0, Math.min(along[0]!, along[1]!));
  const u1 = Math.min(1, Math.max(along[0]!, along[1]!));
  return u1 - u0 > 1e-6 ? [u0, u1] : undefined;
}

/**
 * A wall cut by the room's openings: the solid stretches, with a gap where
 * a door, an opening or a window is, and the windows' stretches, which draw
 * as a light blue line in their gap.
 */
export function homeWallPieces(wall: HomeMapWall, openings: readonly HomeMapOpening[]): { solid: HomeWallPiece[]; windows: HomeWallPiece[] } {
  // To the tenth of a millimetre, so a gap's ends are the opening's own.
  const r4 = (v: number) => Math.round(v * 10_000) / 10_000;
  const at = (u: number): HomePoint => [r4(wall.a[0] + (wall.b[0] - wall.a[0]) * u), r4(wall.a[1] + (wall.b[1] - wall.a[1]) * u)];
  const gaps: [number, number][] = [];
  const windows: HomeWallPiece[] = [];
  for (const opening of openings) {
    const span = spanOn(wall, opening);
    if (span === undefined) continue;
    gaps.push(span);
    if (opening.kind === "window") windows.push([at(span[0]), at(span[1])]);
  }
  gaps.sort((p, q) => p[0] - q[0]);
  const solid: HomeWallPiece[] = [];
  let from = 0;
  for (const [u0, u1] of gaps) {
    if (u0 > from + 1e-6) solid.push([at(from), at(u0)]);
    from = Math.max(from, u1);
  }
  if (from < 1 - 1e-6) solid.push([at(from), at(1)]);
  return { solid, windows };
}

// ── pins ─────────────────────────────────────────────────────────────────

/** A pin's fill, by `homeMapPinLook`: yellow for a light that is on, green
 * or orange for a lock, the tile colour of its kind otherwise, gray when its
 * entity is gone. An off light or another kind that is off is drawn dim
 * (`dim`). */
export function homePinPaint(entityId: string, states: HomeMapStates | undefined): { fill: string; dim: boolean; glow: number | undefined } {
  const look = homeMapPinLook(entityId, states);
  switch (look.kind) {
    case "gone":
      return { fill: HOME_PLAN_COLORS.gone, dim: false, glow: undefined };
    case "lock":
      return { fill: look.locked ? HOME_PLAN_COLORS.locked : HOME_PLAN_COLORS.unlocked, dim: false, glow: undefined };
    case "light":
      return look.on
        ? { fill: HOME_PLAN_COLORS.lit, dim: false, glow: look.brightness ?? 1 }
        : { fill: HOME_PLAN_COLORS.lit, dim: true, glow: undefined };
    case "other":
      return { fill: kindColor(entityId), dim: !look.on, glow: undefined };
  }
}

/** The tile colour a new tile of the entity's kind gets, as one hex. */
function kindColor(entityId: string): string {
  const color = parseTileColor(watchEntityDefaults({ entityId }, undefined).color);
  if (color?.kind === "solid") return color.hex;
  if (color?.kind === "gradient") return color.from;
  return HOME_PLAN_COLORS.other;
}

/** The radius of a lit light's glow on the floor, in meters: from 0.8 m at
 * its dimmest to 2.2 m at full brightness. */
export function homePinGlowRadius(brightness: number): number {
  return 0.8 + 1.4 * Math.max(0, Math.min(1, brightness));
}

/** The SF Symbol a pin draws: its kind's tile icon. */
export function homePinSymbol(entityId: string): string | undefined {
  return watchEntityDefaults({ entityId }, undefined).icon;
}

// ── the plan ─────────────────────────────────────────────────────────────

export interface HomePlanOptions {
  states?: HomeMapStates;
  /** Draws each pin's icon in its button. */
  icons?: IconProvider;
  /** Room names in the middle of each room. */
  names?: boolean;
  /** `buttons`: a round button per pin, with its icon when there are icons
   * and the button is big enough; `lit`: a small dot for each light that is
   * on and nothing for the rest (the tile); `none`. */
  pins?: "buttons" | "lit" | "none";
  /** A glow over each room with a light on (the tile). */
  roomGlow?: boolean;
  /** A pin's radius in meters. */
  pinRadius?: number;
  /** The selected pin or room, ringed. */
  selected?: { kind: "pin" | "room"; id: string };
  /** A pin drawn somewhere else than stored, while it is dragged. */
  moving?: { pinId: string; at: HomePoint };
  /** The size room names are drawn at, in meters. */
  nameSize?: number;
  /** The Home map tile's look (`homeMapLook`), for the tile's face only:
   * it drops the furniture, keeps each glow nearer its light, and colours
   * the plan as the look does. Absent: the page's own plan. */
  look?: HomeTileLook;
}

/** A Home map tile's look, as the apps draw it (app repo
 * `HomeMapTileRules.Look`). */
export type HomeTileLook = "glow" | "dots" | "dollhouse" | "night";

/** The plan's colours in each tile look: the floor, the walls and how
 * strong they are, and the ground under the plan. */
export const HOME_TILE_LOOK_COLORS: Record<HomeTileLook, { floor: string; wall: string; wallOpacity: number; wallWidth: number; ground: string }> = {
  glow: { floor: HOME_PLAN_COLORS.floor, wall: HOME_PLAN_COLORS.wall, wallOpacity: 1, wallWidth: 1, ground: HOME_PLAN_COLORS.ground },
  dots: { floor: "#262A30", wall: "#80868F", wallOpacity: 1, wallWidth: 0.7, ground: "#1C1F24" },
  dollhouse: { floor: HOME_PLAN_COLORS.floor, wall: HOME_PLAN_COLORS.wall, wallOpacity: 1, wallWidth: 1.5, ground: HOME_PLAN_COLORS.ground },
  night: { floor: "#111316", wall: "#FFFFFF", wallOpacity: 0.16, wallWidth: 0.5, ground: "#08090B" },
};

const points = (outline: readonly HomePoint[]) => outline.map(([x, y]) => `${r3(x)},${r3(y)}`).join(" ");

function roomShape(room: HomeMapRoom, lit: boolean, options: HomePlanOptions): SVGTemplateResult {
  const selected = options.selected?.kind === "room" && sameHomeMapId(options.selected.id, room.id);
  const floor = options.look === undefined ? HOME_PLAN_COLORS.floor : HOME_TILE_LOOK_COLORS[options.look].floor;
  // A tile look tints a lit room only faintly: the light's own glow shows
  // where it is. Dots and night draw no tint.
  const tint = options.look === undefined ? 0.28 : options.look === "glow" || options.look === "dollhouse" ? 0.1 : 0;
  return svg`<polygon class="hm-room" data-room=${room.id} points=${points(room.outline)} fill=${floor}
    stroke=${selected ? HOME_PLAN_COLORS.selected : "none"} stroke-width=${selected ? 0.08 : 0} stroke-linejoin="round" />${lit && options.roomGlow === true && tint > 0
    ? svg`<polygon class="hm-room-glow" points=${points(room.outline)} fill=${HOME_PLAN_COLORS.lit} fill-opacity=${tint} pointer-events="none" />`
    : nothing}`;
}

function furniture(room: HomeMapRoom): SVGTemplateResult[] {
  return room.objects.map((o) => {
    const [w, d] = o.size;
    const rx = Math.min(w, d) * 0.18;
    return svg`<rect class="hm-object" x=${r3(o.c[0] - w / 2)} y=${r3(o.c[1] - d / 2)} width=${r3(w)} height=${r3(d)} rx=${r3(rx)}
      fill=${HOME_PLAN_COLORS.furniture} fill-opacity="0.85" pointer-events="none"
      transform=${o.turn === 0 ? nothing : `rotate(${r3(o.turn)} ${r3(o.c[0])} ${r3(o.c[1])})`} />`;
  });
}

function walls(room: HomeMapRoom, look: HomeTileLook | undefined): SVGTemplateResult[] {
  const paint = look === undefined ? undefined : HOME_TILE_LOOK_COLORS[look];
  return room.walls.map((wall) => {
    const { solid, windows } = homeWallPieces(wall, room.openings);
    const t = Math.max(0.05, wall.t) * (paint?.wallWidth ?? 1);
    const line = (piece: HomeWallPiece, stroke: string, width: number, cls: string, opacity: number) =>
      svg`<line class=${cls} x1=${r3(piece[0][0])} y1=${r3(piece[0][1])} x2=${r3(piece[1][0])} y2=${r3(piece[1][1])}
        stroke=${stroke} stroke-width=${r3(width)} stroke-opacity=${opacity === 1 ? nothing : opacity} stroke-linecap="square" pointer-events="none" />`;
    return svg`${solid.map((p) => line(p, paint?.wall ?? HOME_PLAN_COLORS.wall, t, "hm-wall", paint?.wallOpacity ?? 1))}${windows.map((p) => line(p, HOME_PLAN_COLORS.window, t * 0.6, "hm-window", look === "night" ? 0.3 : 1))}`;
  });
}

function pinAt(pin: HomeMapPin, options: HomePlanOptions): HomePoint {
  const moving = options.moving;
  return moving !== undefined && sameHomeMapId(moving.pinId, pin.id) ? moving.at : [pin.at[0], pin.at[1]];
}

function glows(floor: HomeMapFloor, options: HomePlanOptions): SVGTemplateResult[] {
  // The tile's glow stays near its light; night's pools are wide and warm;
  // dots draw none.
  if (options.look === "dots") return [];
  const scale = options.look === undefined ? 1 : options.look === "night" ? 0.9 : 0.6;
  const fill = options.look === "night" ? "url(#wa-hm-glow-night)" : "url(#wa-hm-glow)";
  return floor.pins.flatMap((pin) => {
    const paint = homePinPaint(pin.entityId, options.states);
    if (paint.glow === undefined) return [];
    const [x, y] = pinAt(pin, options);
    return [svg`<circle class="hm-glow" cx=${r3(x)} cy=${r3(y)} r=${r3(homePinGlowRadius(paint.glow) * scale)} fill=${fill} pointer-events="none" />`];
  });
}

function pinButton(pin: HomeMapPin, options: HomePlanOptions, r: number): SVGTemplateResult {
  const paint = homePinPaint(pin.entityId, options.states);
  const [x, y] = pinAt(pin, options);
  const selected = options.selected?.kind === "pin" && sameHomeMapId(options.selected.id, pin.id);
  const ink = paint.fill === HOME_PLAN_COLORS.lit && !paint.dim ? "#3A2A00" : "#FFFFFF";
  const symbol = homePinSymbol(pin.entityId);
  // Each glyph is drawn on a 24 point square, scaled down to the button.
  const px = 24;
  const glyph = symbol === undefined ? undefined : options.icons?.render(symbol, px, ink);
  const side = r * 1.2;
  return svg`<g class="hm-pin" data-pin=${pin.id} transform=${`translate(${r3(x)} ${r3(y)})`}>
    ${selected ? svg`<circle r=${r3(r * 1.32)} fill="none" stroke=${HOME_PLAN_COLORS.selected} stroke-width=${r3(r * 0.22)} />` : nothing}
    <circle r=${r3(r)} fill=${paint.fill} fill-opacity=${paint.dim ? 0.45 : 1} stroke="#000" stroke-opacity="0.45" stroke-width=${r3(r * 0.12)} />
    ${glyph === undefined ? nothing : svg`<g transform=${`translate(${r3(-side / 2)} ${r3(-side / 2)}) scale(${r3(side / px)})`} opacity=${paint.dim ? 0.7 : 1} pointer-events="none">${glyph}</g>`}
  </g>`;
}

function pinDots(floor: HomeMapFloor, options: HomePlanOptions, r: number): SVGTemplateResult[] {
  return floor.pins.flatMap((pin) => {
    const paint = homePinPaint(pin.entityId, options.states);
    const [x, y] = pinAt(pin, options);
    if (paint.glow === undefined) {
      // The dots look draws the lights that are off too, gray.
      if (options.look !== "dots" || homeMapPinLook(pin.entityId, options.states).kind !== "light") return [];
      return [svg`<circle class="hm-dot hm-dot-off" cx=${r3(x)} cy=${r3(y)} r=${r3(r)} fill="#5D636C" stroke="#9AA0A8" stroke-width=${r3(r * 0.25)} pointer-events="none" />`];
    }
    if (options.look === "night") {
      return [svg`<circle class="hm-dot" cx=${r3(x)} cy=${r3(y)} r=${r3(r * 0.6)} fill="#FFF6D6" pointer-events="none" />`];
    }
    return [svg`<circle class="hm-dot" cx=${r3(x)} cy=${r3(y)} r=${r3(r)} fill=${HOME_PLAN_COLORS.lit} pointer-events="none" />`];
  });
}

function names(floor: HomeMapFloor, size: number): SVGTemplateResult[] {
  return floor.rooms.map((room) => {
    const [x, y] = homeMapRoomCenter(room);
    return svg`<text class="hm-name" x=${r3(x)} y=${r3(y)} font-size=${r3(size)} text-anchor="middle" dominant-baseline="central"
      fill=${HOME_PLAN_COLORS.name} fill-opacity="0.82" pointer-events="none">${homeMapRoomName(room)}</text>`;
  });
}

/** The glow a lit light casts on the floor, once per drawing: yellow at its
 * middle, gone at its edge. */
const GLOW_DEFS = svg`<defs><radialGradient id="wa-hm-glow">
  <stop offset="0" stop-color=${HOME_PLAN_COLORS.lit} stop-opacity="0.5" />
  <stop offset="0.55" stop-color=${HOME_PLAN_COLORS.lit} stop-opacity="0.16" />
  <stop offset="1" stop-color=${HOME_PLAN_COLORS.lit} stop-opacity="0" />
</radialGradient><radialGradient id="wa-hm-glow-night">
  <stop offset="0" stop-color="#FFCF5A" stop-opacity="0.75" />
  <stop offset="0.45" stop-color="#F5A83A" stop-opacity="0.28" />
  <stop offset="1" stop-color="#F5A83A" stop-opacity="0" />
</radialGradient></defs>`;

/**
 * One floor's flat plan, in meters, as the children of an `<svg>` whose
 * viewBox is `homePlanViewBox(floor)`: the floors of the rooms (with the
 * lit rooms' glow when asked), the lights' glow on the floor, the
 * furniture, the walls and windows, the room names, then the pins on top.
 */
export function homePlan(floor: HomeMapFloor, options: HomePlanOptions = {}): SVGTemplateResult {
  const lit = options.roomGlow === true ? homeMapLitRooms(floor, options.states) : new Set<string>();
  const view = homePlanViewBox(floor);
  const span = Math.max(view.width, view.height);
  const r = options.pinRadius ?? Math.max(0.12, span / 48);
  const mode = options.pins ?? "buttons";
  return svg`${GLOW_DEFS}
    <g class="hm-floors">${floor.rooms.map((room) => roomShape(room, lit.has(room.id), options))}</g>
    <g class="hm-glows">${glows(floor, options)}</g>
    ${options.look === undefined ? svg`<g class="hm-objects">${floor.rooms.map((room) => furniture(room))}</g>` : nothing}
    <g class="hm-walls">${floor.rooms.map((room) => walls(room, options.look))}</g>
    ${options.names === true ? svg`<g class="hm-names">${names(floor, options.nameSize ?? Math.max(0.2, Math.min(0.5, span / 28)))}</g>` : nothing}
    <g class="hm-pins">${mode === "buttons" ? floor.pins.map((pin) => pinButton(pin, options, r)) : mode === "lit" ? pinDots(floor, options, r) : nothing}</g>`;
}
