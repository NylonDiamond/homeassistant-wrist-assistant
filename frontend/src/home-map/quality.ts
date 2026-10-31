// How hard the map editor's 3D look works the graphics chip: High, every
// effect as tuned by eye on a real scanned room; Low, the effects a weak
// tablet or an old laptop cannot keep up with left out; Auto, the default,
// Low on weak hardware and High elsewhere. The choice is the person's, kept
// in this browser (`localStorage`), and named in the editor's View menu.
//
// This file knows nothing of three.js, so the editor can read and keep the
// choice without loading the 3D chunk, and the Auto rule can be tested.

/** What the View menu offers. */
export type HomeMapQualityChoice = "auto" | "high" | "low";

/** What the 3D look draws at. */
export type HomeMapQuality = "high" | "low";

export const HOME_MAP_QUALITY_CHOICES: readonly HomeMapQualityChoice[] = ["auto", "high", "low"];

/** Where the choice is kept, one for the browser, every map alike. */
export const HOME_MAP_QUALITY_KEY = "wa-home-map-3d-quality";

/** What Auto reads of the device. Each is optional, as a browser may not say
 * it (only Chromium tells `deviceMemory`). */
export interface HomeMapDeviceHints {
  /** `navigator.hardwareConcurrency`: the processor's threads. */
  cores?: number | undefined;
  /** `navigator.deviceMemory`: gigabytes, rounded down and capped at 8. */
  memory?: number | undefined;
  /** The main pointer is a finger (`(pointer: coarse)`): a phone or a
   * tablet, whose graphics chip shares a battery's budget. */
  coarse?: boolean | undefined;
  /** The 3D look's first frames came slowly (`HOME_MAP_SLOW_FRAME_MS`). */
  slow?: boolean | undefined;
}

/** A first frame slower than this, as the middle of several, says the
 * hardware cannot keep up with High: under 20 frames a second. */
export const HOME_MAP_SLOW_FRAME_MS = 50;

/**
 * Auto's pick: Low on weak hardware, which is 4 threads or fewer, 4 GB of
 * memory or less, a touch device, or first frames that came slowly; else
 * High. A hint the browser does not give counts for nothing either way.
 */
export function homeMapAutoQuality(hints: HomeMapDeviceHints): HomeMapQuality {
  const weak = (typeof hints.cores === "number" && hints.cores > 0 && hints.cores <= 4)
    || (typeof hints.memory === "number" && hints.memory > 0 && hints.memory <= 4)
    || hints.coarse === true
    || hints.slow === true;
  return weak ? "low" : "high";
}

/** What a choice draws at on this device. */
export function homeMapQualityOf(choice: HomeMapQualityChoice, hints: HomeMapDeviceHints): HomeMapQuality {
  return choice === "auto" ? homeMapAutoQuality(hints) : choice;
}

/** What this browser says of its device, for Auto. */
export function homeMapDeviceHints(slow = false): HomeMapDeviceHints {
  const nav = (globalThis as { navigator?: { hardwareConcurrency?: unknown; deviceMemory?: unknown } }).navigator;
  const cores = typeof nav?.hardwareConcurrency === "number" ? nav.hardwareConcurrency : undefined;
  const memory = typeof nav?.deviceMemory === "number" ? nav.deviceMemory : undefined;
  const match = (globalThis as { matchMedia?: (q: string) => { matches: boolean } }).matchMedia;
  const coarse = typeof match === "function" ? match("(pointer: coarse)").matches : undefined;
  return { cores, memory, coarse, slow };
}

/** The choice kept in this browser, Auto when none is or it cannot be
 * read (storage turned off, a private window). */
export function homeMapReadQualityChoice(storage: Pick<Storage, "getItem"> | undefined = homeMapStorage()): HomeMapQualityChoice {
  try {
    const kept = storage?.getItem(HOME_MAP_QUALITY_KEY);
    return HOME_MAP_QUALITY_CHOICES.includes(kept as HomeMapQualityChoice) ? (kept as HomeMapQualityChoice) : "auto";
  } catch {
    return "auto";
  }
}

/** Keep the choice in this browser; Auto, the default, is kept as no key.
 * A browser that will not keep it still uses it until the page closes. */
export function homeMapWriteQualityChoice(choice: HomeMapQualityChoice, storage: Pick<Storage, "setItem" | "removeItem"> | undefined = homeMapStorage()): void {
  try {
    if (choice === "auto") storage?.removeItem(HOME_MAP_QUALITY_KEY);
    else storage?.setItem(HOME_MAP_QUALITY_KEY, choice);
  } catch {
    // Storage turned off: the choice lasts this page only.
  }
}

function homeMapStorage(): Storage | undefined {
  try {
    return (globalThis as { localStorage?: Storage }).localStorage;
  } catch {
    return undefined;
  }
}

/** What each quality turns on in the 3D look (`scene3d.ts`). */
export interface HomeMapQualitySettings {
  /** Samples a pixel when the scene is drawn smoothed. */
  samples: number;
  /** Shading in the corners and under things (ambient occlusion). */
  ao: boolean;
  /** The bulbs' glow past their edges. */
  bloom: boolean;
  /** The most canvas pixels drawn for each CSS pixel. */
  pixelRatio: number;
  /** The sun's shadow map, a side in texels. */
  sunShadow: number;
  /** Shadow maps the lit lights may cost (a ceiling light one, a lamp six). */
  shadowBudget: number;
  /** At most this many lit lights cast a shadow. */
  shadowLights: number;
}

/** High is the look as tuned; Low leaves out the ambient occlusion and the
 * glow, smooths edges with two samples rather than four, draws one canvas
 * pixel for each CSS pixel, halves the sun's shadow map each way and lets at
 * most four lights cast, two lamps' worth of maps. */
export function homeMapQualitySettings(quality: HomeMapQuality, devicePixelRatio: number): HomeMapQualitySettings {
  const ratio = Number.isFinite(devicePixelRatio) && devicePixelRatio > 0 ? devicePixelRatio : 1;
  if (quality === "low") return { samples: 2, ao: false, bloom: false, pixelRatio: 1, sunShadow: 1024, shadowBudget: 12, shadowLights: 4 };
  return { samples: 4, ao: true, bloom: true, pixelRatio: Math.min(ratio, 2), sunShadow: 2048, shadowBudget: 24, shadowLights: 8 };
}

/** The middle of a few frame times, in milliseconds, for the slow check:
 * one stall (a model loading, a shader compiling) does not count. */
export function homeMapMedianFrame(times: readonly number[]): number {
  if (times.length === 0) return 0;
  const sorted = [...times].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
}
