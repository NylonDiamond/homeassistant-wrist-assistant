// What a pin shows, by its own keys over its entity's (app repo
// docs/home_map_plan_2026-10.md, "Editor keys"): its icon (`pin.icon`, else
// the one its entity's kind picks), the words in its pill (`pin.reading`:
// the reading, its name or none), and for a light how far its pool of light
// reaches (`pin.glow`, else by its brightness) and in what colour
// (`pin.glowColor`: a `#RRGGBB` tints it, warm and no colour draw the warm
// lamplight every light had before). The tiles' art (`tile-art.ts`) and the
// map editor's Devices mode both read these, so a pin looks the same on the
// stage, on a tile's face and in the apps.
//
// The sixteen icons are drawn twice: as the SF Symbol the apps draw (through
// the panel's symbol provider, `HOME_MAP_PIN_ICON_SYMBOLS`), and as a small
// line drawing of our own (`homeMapPinGlyph`) for the editor's icon menu and
// its pins, which must show every icon even with no symbols loaded.

import { type SVGTemplateResult, svg } from "lit";
import { homePinSymbol } from "./draw.js";
import { homeGlowRadius, homePinReading } from "./geometry.js";
import { type HomeMapPin, type HomeMapPinIcon, type HomeMapStates, homeMapPinName } from "./model.js";

/** Each icon's SF Symbol, the apps' own (`HomeMapDocument.Pin.Icon.symbol`).
 * A lock is drawn open when its entity is unlocked. */
export const HOME_MAP_PIN_ICON_SYMBOLS: Readonly<Record<HomeMapPinIcon, string>> = {
  bulb: "lightbulb.fill",
  lamp: "lamp.floor.fill",
  ceiling: "lamp.ceiling.fill",
  strip: "light.strip.2.fill",
  plug: "powerplug.fill",
  fan: "fan.fill",
  tv: "tv.fill",
  speaker: "hifispeaker.fill",
  thermostat: "thermometer.medium",
  sensor: "sensor.fill",
  motion: "figure.walk.motion",
  door: "door.left.hand.closed",
  lock: "lock.fill",
  camera: "video.fill",
  blinds: "blinds.horizontal.closed",
  vacuum: "robotic.vacuum.fill",
};

/** Each icon's name in the editor's menu. */
export const HOME_MAP_PIN_ICON_NAMES: Readonly<Record<HomeMapPinIcon, string>> = {
  bulb: "Bulb",
  lamp: "Floor lamp",
  ceiling: "Ceiling light",
  strip: "Light strip",
  plug: "Plug",
  fan: "Fan",
  tv: "TV",
  speaker: "Speaker",
  thermostat: "Thermostat",
  sensor: "Sensor",
  motion: "Motion",
  door: "Door",
  lock: "Lock",
  camera: "Camera",
  blinds: "Blinds",
  vacuum: "Vacuum",
};

/** Each icon as lines on a 24 unit square, drawn with a round pen. */
const GLYPHS: Readonly<Record<HomeMapPinIcon, string>> = {
  bulb: "M8.6 15.4C6.6 13.9 5.6 12 5.6 9.9a6.4 6.4 0 0 1 12.8 0c0 2.1-1 4-3 5.5v1.8H8.6ZM9.6 20.4h4.8",
  lamp: "M8 3.6h8l2.6 7H5.4ZM12 10.6v9.6M8.4 20.2h7.2",
  ceiling: "M12 3v4.2M5.6 13.6a6.4 6.4 0 0 1 12.8 0ZM10.2 17h3.6",
  strip: "M3 9.6h18v4.8H3ZM7 12h.01M12 12h.01M17 12h.01",
  plug: "M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0ZM12 17v4",
  fan: "M12 12c-.6-3.6.4-7.6 3.4-7.6 2.6 0 3 3.6-3.4 7.6ZM12 12c3.4 1.4 6 4.6 4.4 7.2-1.3 2.2-4.6.6-4.4-7.2ZM12 12c-2.8 2.2-6.8 3-8.2.4-1.2-2.3 1.8-4.4 8.2-.4Z",
  tv: "M3 5.6h18v11H3ZM8 20.4h8",
  speaker: "M6.6 3h10.8v18H6.6ZM12 7.4h.01M12 13.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 1 0 0-5.6Z",
  thermostat: "M10 14.2V5a2 2 0 0 1 4 0v9.2a4 4 0 1 1-4 0ZM12 9.4v7.4",
  sensor: "M12 10a2 2 0 1 0 0 4 2 2 0 1 0 0-4ZM7.4 7.4a6.5 6.5 0 0 0 0 9.2M16.6 7.4a6.5 6.5 0 0 1 0 9.2M4.6 4.6a10.5 10.5 0 0 0 0 14.8M19.4 4.6a10.5 10.5 0 0 1 0 14.8",
  motion: "M13.2 3.2a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 1 0 0-3.2ZM9.4 21l2.4-6.2 3 3V21M11.8 14.8l1.4-6.2-3.8 1.8-1.2 3M13.2 8.6l2 3.2h3.2",
  door: "M6 21V3h12v18M3.6 21h16.8M14.4 12.2h.01",
  lock: "M5.8 10.8h12.4v10H5.8ZM8.4 10.8V7.6a3.6 3.6 0 0 1 7.2 0v3.2",
  camera: "M3 6.8h12.4v10.4H3ZM15.4 10.4 21 7.4v9.2l-5.6-3",
  blinds: "M3.6 4h16.8M5 4v12.4M19 4v12.4M5 8h14M5 12h14M5 16.4h14M12 16.4V20",
  vacuum: "M12 4a8 8 0 1 0 0 16 8 8 0 1 0 0-16ZM12 9.4a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 1 0 0-5.2ZM7 6.6l2.2 2.2",
};

/** An icon drawn as lines in `color`, `size` units square, its top left at
 * 0, 0 (place it with a transform). */
export function homeMapPinGlyph(icon: HomeMapPinIcon, color: string, size = 24, width = 1.8): SVGTemplateResult {
  const k = size / 24;
  return svg`<path d=${GLYPHS[icon]} transform=${k === 1 ? "" : `scale(${Math.round(k * 1000) / 1000})`} fill="none" stroke=${color}
    stroke-width=${Math.round((width / k) * 100) / 100} stroke-linecap="round" stroke-linejoin="round" />`;
}

/** A word in an entity's name or id, as a whole word or part of a longer one
 * joined by an underscore. */
function says(words: string, ...any: string[]): boolean {
  return any.some((w) => words.includes(w));
}

/**
 * The icon a pin with no `icon` shows in the editor, by its entity's kind,
 * device class and name: a light a bulb, unless it says lamp, strip or
 * ceiling; a switch a plug; a TV or a speaker by its class; a thermostat; a
 * binary sensor for motion, a door or a sensor; a cover blinds, or a door
 * for a garage door; and so on, a sensor for anything else.
 */
export function homeMapAutoPinIcon(entityId: string, deviceClass?: string, name?: string): HomeMapPinIcon {
  const domain = entityId.slice(0, entityId.indexOf("."));
  const words = `${name ?? ""} ${entityId}`.toLowerCase();
  switch (domain) {
    case "light":
      if (says(words, "strip", "led_strip", "lightstrip")) return "strip";
      if (says(words, "lamp")) return "lamp";
      if (says(words, "ceiling", "pendant", "downlight", "spot")) return "ceiling";
      return "bulb";
    case "switch":
    case "input_boolean":
      return says(words, "fan") ? "fan" : "plug";
    case "fan":
      return "fan";
    case "media_player":
      return deviceClass === "speaker" || says(words, "speaker", "sonos", "homepod", "soundbar") ? "speaker" : "tv";
    case "climate":
    case "water_heater":
    case "humidifier":
      return "thermostat";
    case "binary_sensor":
      if (deviceClass === "motion" || deviceClass === "occupancy" || deviceClass === "presence") return "motion";
      if (deviceClass === "door" || deviceClass === "garage_door" || deviceClass === "window" || deviceClass === "opening") return "door";
      return says(words, "motion", "presence", "occupancy") ? "motion" : says(words, "door") ? "door" : "sensor";
    case "lock":
      return "lock";
    case "camera":
      return "camera";
    case "cover":
    case "valve":
      return deviceClass === "garage" || deviceClass === "door" || deviceClass === "gate" ? "door" : "blinds";
    case "vacuum":
      return "vacuum";
    case "remote":
      return "tv";
    default:
      return "sensor";
  }
}

/** The SF Symbol a pin draws on the tiles: its own icon's, a lock's open
 * when its entity is unlocked, else its kind's tile icon (`homePinSymbol`). */
export function homeMapPinSymbol(pin: Pick<HomeMapPin, "entityId" | "icon">, states?: HomeMapStates): string | undefined {
  if (pin.icon === undefined) return homePinSymbol(pin.entityId);
  if (pin.icon === "lock") {
    const state = states?.[pin.entityId]?.state;
    return state === undefined || state === "locked" ? "lock.fill" : "lock.open.fill";
  }
  return HOME_MAP_PIN_ICON_SYMBOLS[pin.icon];
}

/** How far a light's pool of light reaches, in meters: the pin's own
 * `glow`, else by its brightness (`homeGlowRadius`). */
export function homeMapPinGlowRadius(pin: Pick<HomeMapPin, "glow">, brightness: number | undefined): number {
  return pin.glow !== undefined && Number.isFinite(pin.glow) ? Math.min(Math.max(pin.glow, 0.2), 10) : homeGlowRadius(brightness);
}

/** A light's own glow colour as `#rrggbb`, or undefined for the warm
 * lamplight (`warm`, or no colour). */
export function homeMapGlowHex(pin: Pick<HomeMapPin, "glowColor">): string | undefined {
  const c = pin.glowColor;
  return typeof c === "string" && /^#[0-9A-Fa-f]{6}$/.test(c) ? c.toLowerCase() : undefined;
}

/** A `#rrggbb` colour at `alpha`, as CSS takes it. */
export function homeMapHexAlpha(hex: string, alpha: number): string {
  const v = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(v >> 16) & 255},${(v >> 8) & 255},${v & 255},${Math.round(alpha * 1000) / 1000})`;
}

/** The words in a pin's pill: none for `reading` none, its name for
 * `reading` name, else its reading (21.5°, 52%, 627 W) when it has one. */
export function homeMapPinPill(pin: Pick<HomeMapPin, "entityId" | "name" | "reading">, states: HomeMapStates | undefined): string | undefined {
  if (pin.reading === "none") return undefined;
  if (pin.reading === "name") return homeMapPinName(pin, { states });
  return homePinReading(pin.entityId, states);
}
