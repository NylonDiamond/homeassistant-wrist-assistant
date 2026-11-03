// The real sun over the Home map's 3D view (`docs/home_map_plan_2026-10.md`,
// "The real sun"). Pure, so the words of the rule stand apart from three.js. The
// iPhone's `HomeMapSun` is the same rule; change both together.
//
// Home Assistant's `sun.sun` says where the sun is: its azimuth, in degrees
// clockwise from north, and its elevation, in degrees over the horizon. The
// map's `north` says where north is on the base floor's plan, in degrees
// clockwise from the top of the plan. So the sun's bearing on a plan is their
// sum, with a floor's own turn over the base floor. The plan's x is the
// world's x, the plan's y (down the screen) is the world's z, and up is y.
//
// `sun` is the direct light's strength: nothing at the horizon, full by 12
// degrees up. `sky` is the sky's: it comes earlier and goes later, as
// twilight does. `warm` is how orange the direct light is, full at the horizon
// and none by 25 degrees up.

import { type HomeMapDocument, type HomeMapFloor, type HomeMapStates } from "./model.js";

export interface HomeMapSky {
  /** The way to the sun, one unit long: x, up, z. */
  dir: readonly [number, number, number];
  sun: number;
  sky: number;
  warm: number;
}

/** Where the sun is. */
export interface HomeMapSunPlace {
  azimuth: number;
  elevation: number;
}

/** What the 3D view shows: the sun as it is now, the fixed Daylight or the
 * dark that only the lights light. */
export type HomeMapSkyChoice = "now" | "day" | "night";

/** Night: no sun and a faint sky. */
export const HOME_MAP_NIGHT: HomeMapSky = { dir: [0, 1, 0], sun: 0, sky: 0, warm: 0 };

/** Daylight, whatever the time: a high sun from the front left. */
export const HOME_MAP_DAY: HomeMapSky = (() => {
  const [x, y, z] = [-2, 6.5, 8];
  const size = Math.hypot(x, y, z);
  return { dir: [x / size, y / size, z / size], sun: 1, sky: 1, warm: 0 };
})();

function smooth(from: number, to: number, value: number): number {
  const t = Math.max(0, Math.min(1, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
}

/** Where `sun.sun` says the sun is, or undefined with no such entity or
 * numbers. */
export function homeMapSunPlace(states: HomeMapStates | undefined): HomeMapSunPlace | undefined {
  const attributes = states?.["sun.sun"]?.attributes;
  const azimuth = attributes?.azimuth;
  const elevation = attributes?.elevation;
  if (typeof azimuth !== "number" || !Number.isFinite(azimuth) || typeof elevation !== "number" || !Number.isFinite(elevation)) return undefined;
  return { azimuth, elevation };
}

/** The sky with the sun at `place`, `north` degrees clockwise from the top
 * of the plan. */
export function homeMapSkyOf(place: HomeMapSunPlace, north: number): HomeMapSky {
  const bearing = ((place.azimuth + north) * Math.PI) / 180;
  const up = (Math.max(place.elevation, 0) * Math.PI) / 180;
  return {
    dir: [Math.cos(up) * Math.sin(bearing), Math.sin(up), -Math.cos(up) * Math.cos(bearing)],
    sun: smooth(0, 12, place.elevation),
    sky: smooth(-6, 10, place.elevation),
    warm: 1 - smooth(2, 25, place.elevation),
  };
}

/** Where north is on `floor`'s own plan: the map's `north`, stored against the
 * base floor (the lowest `story`, the first of them on a tie), and the
 * floor's turn over it. */
export function homeMapFloorNorth(doc: Pick<HomeMapDocument, "north" | "floors"> | null | undefined, floor: HomeMapFloor): number {
  const north = doc?.north ?? 0;
  const base = doc?.floors.reduce<HomeMapFloor | undefined>((low, f) => (low === undefined || f.story < low.story ? f : low), undefined);
  const turn = base === undefined || base.id.toUpperCase() === floor.id.toUpperCase() ? 0 : (floor.place?.turn ?? 0);
  return ((north + turn) % 360 + 360) % 360;
}

/** The sky `choice` shows. Now with no sun known is the night. */
export function homeMapSkyFor(choice: HomeMapSkyChoice, place: HomeMapSunPlace | undefined, north: number): HomeMapSky {
  if (choice === "day") return HOME_MAP_DAY;
  if (choice === "now" && place !== undefined) return homeMapSkyOf(place, north);
  return HOME_MAP_NIGHT;
}
