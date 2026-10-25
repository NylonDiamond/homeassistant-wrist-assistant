// One Look's state lines, copied from the app's `OneLookState.swift`: what
// each kind says under its name, the accessory it carries top right and the
// role its colours resolve for. Pure: no drawing, no clock ("now" comes in
// as milliseconds), no device (the fitter decides what fits). No filler:
// "Scene", "Script", "Idle" and "--:--" never show, and a tile with nothing
// to say has no state line.
//
// The kind functions take plain values, as the app's do. `oneLookTileState`
// then reads a stored tile and Home Assistant's states the way each of the
// app's tile views hands them over (`SimpleTileViews.swift`, each kind's
// `oneLookBody`): the value labels and activity status switches that hide a
// state, a vacuum's or mower's battery, a fan's or player's bar level. The
// app's tests (`OneLookStateTests.swift`) pin the words;
// `test/one-look-state.test.ts` repeats them.

import type { HassEntityState } from "../../ha-api.js";
import { type WatchPageTile, tileEntityId, tileKind, tileTarget } from "../model.js";
import { watchMusicHubActiveSpeaker } from "../app-model.js";
import { isWatchTvRemote } from "../special-model.js";
import { watchStateDomains } from "../tile-styling.js";
import { watchRemotePlayerId, watchStateUnavailable, watchTileStateKey, watchTimerRemaining, watchValueLabelStyle } from "../preview.js";
import { ONE_LOOK_COLOUR_CHOICES, type OneLookRole } from "./colour.js";

/** A state line before it is fitted (`StateLine`): a number in bold
 * rounded with its unit glued on or after a space and a word after it
 * (the tail, which the watch drops under 8 columns unless `keepTail`); a
 * word with the short form tried before it shrinks and the amber dot before
 * it; or none. Unset flags read as false. */
export type OneLookStateLine =
  | { kind: "number"; figure: string; unit?: string; unitSpaced?: boolean; tail?: string; keepTail?: boolean }
  | { kind: "word"; word: string; short?: string; amber?: boolean }
  | { kind: "none" };

/** What sits in the tile's top right disc (`OneLookAccessory`). */
export type OneLookAccessory = "none" | "playPause" | "fan" | "live";

/** A number on the right of a wide tile in a disc layout (weather's
 * "62°"), with a line under it. */
export interface OneLookBigValue {
  figure: string;
  sub?: string;
}

/** What a tile says and carries (`OneLookTileState`). */
export interface OneLookTileState {
  state: OneLookStateLine;
  accessory: OneLookAccessory;
  role: OneLookRole;
  bigValue?: OneLookBigValue;
  /** The state to draw instead when the layout has no room for the big
   * value, so a narrow weather tile still shows its temperature. */
  stateWithoutBig?: OneLookStateLine;
  isUnavailable: boolean;
  /** Nothing is on and nothing needs the user. The palette reads it only
   * with calm when idle, which is off. */
  isCalm: boolean;
}

/** `OneLookChoices` the state lines read, as the app has them now: no
 * script "Ran" time until the integration sends one, a binary sensor's
 * change time from its `last_updated`, and "Offline" said quietly. */
export const ONE_LOOK_STATE_CHOICES = {
  missingData: "appSideNow" as "appSideNow" | "integrationFirst",
  binaryChangeTimes: true,
  quietOffline: ONE_LOOK_COLOUR_CHOICES.quietOffline,
} as const;

export const ONE_LOOK_OFFLINE_WORD = "Offline";
export const ONE_LOOK_ON_WORD = "On";
export const ONE_LOOK_OFF_WORD = "Off";
/** Between a label and what follows it: space, middle dot, space. */
export const ONE_LOOK_SEPARATOR = " · ";
/** What an HTTP action tile that cannot fire says, and a removed macro. */
export const ONE_LOOK_NEEDS_SETUP_WORD = "Needs setup";
export const ONE_LOOK_REMOVED_WORD = "Removed";
/** The state the grid assumes a tile takes before its entity loads, so a
 * placeholder keeps its room (`OneLookRowNames.assumedState`). */
export const ONE_LOOK_ASSUMED_STATE: OneLookStateLine = { kind: "number", figure: "100", unit: "%" };
/** A battery at or under this needs the user. */
export const ONE_LOOK_LOW_BATTERY_PERCENT = 20;

const PLAIN: OneLookRole = { kind: "plain" };
const NONE: OneLookStateLine = { kind: "none" };

// ── building blocks ──────────────────────────────────────────────────────

/** A number state line; unset parts are left out, so two equal lines
 * compare equal. */
export function oneLookNumber(figure: string, o: { unit?: string; unitSpaced?: boolean; tail?: string; keepTail?: boolean } = {}): OneLookStateLine {
  const line: OneLookStateLine = { kind: "number", figure };
  if (o.unit !== undefined) line.unit = o.unit;
  if (o.unitSpaced === true) line.unitSpaced = true;
  if (o.tail !== undefined) line.tail = o.tail;
  if (o.keepTail === true) line.keepTail = true;
  return line;
}

/** A word state line; unset parts are left out. */
export function oneLookWordLine(word: string, o: { short?: string; amber?: boolean } = {}): OneLookStateLine {
  const line: OneLookStateLine = { kind: "word", word };
  if (o.short !== undefined) line.short = o.short;
  if (o.amber === true) line.amber = true;
  return line;
}

function tileState(o: Partial<OneLookTileState> = {}): OneLookTileState {
  const out: OneLookTileState = {
    state: o.state ?? NONE,
    accessory: o.accessory ?? "none",
    role: o.role ?? PLAIN,
    isUnavailable: o.isUnavailable ?? false,
    isCalm: o.isCalm ?? false,
  };
  if (o.bigValue !== undefined) out.bigValue = o.bigValue;
  if (o.stateWithoutBig !== undefined) out.stateWithoutBig = o.stateWithoutBig;
  return out;
}

/** What every kind says when its entity is unavailable: "Offline", quiet,
 * or "Unavailable" with the amber dot and "Offline" as its short form. */
export function oneLookUnavailableLine(quiet: boolean = ONE_LOOK_STATE_CHOICES.quietOffline): OneLookStateLine {
  return quiet ? oneLookWordLine(ONE_LOOK_OFFLINE_WORD) : oneLookWordLine("Unavailable", { short: ONE_LOOK_OFFLINE_WORD, amber: true });
}

/** An unavailable tile: the word, no accessory (a play button on a player
 * that is not there does nothing), and the role switched off so a light is
 * not drawn lit. */
export function oneLookUnavailable(role: OneLookRole = PLAIN): OneLookTileState {
  let quiet: OneLookRole = role;
  if (role.kind === "light") quiet = { kind: "light", on: false };
  else if (role.kind === "media") quiet = { kind: "media", playing: false };
  return tileState({ state: oneLookUnavailableLine(), role: quiet, isUnavailable: true });
}

/** The state line for a layout that did or did not keep the big value. */
export function oneLookStateFor(s: OneLookTileState, bigValueDrawn: boolean): OneLookStateLine {
  return bigValueDrawn ? s.state : (s.stateWithoutBig ?? s.state);
}

/** With the tile's switch off: no state line, except the unavailable word,
 * which is the only one that says so. A big value stays. */
export function oneLookHidingState(s: OneLookTileState, hide: boolean): OneLookTileState {
  if (!hide || s.isUnavailable) return s;
  const copy = { ...s, state: NONE };
  delete copy.stateWithoutBig;
  return copy;
}

/** With a light's or fan's value label off: the "64%" becomes "On", as
 * the old setting hid only the badge. "On", "Off" and "Offline" stay. */
export function oneLookHidingNumber(s: OneLookTileState, hide: boolean): OneLookTileState {
  if (!hide || s.state.kind !== "number") return s;
  return { ...s, state: oneLookWordLine(ONE_LOOK_ON_WORD) };
}

/** A vacuum's or mower's battery after its state ("Docked · 82%", tried as
 * "Docked" on a tight tile), alone ("82%") when the state says nothing. No
 * battery, a number state or an unavailable tile is left as it is. */
export function oneLookWithBattery(s: OneLookTileState, battery: number | undefined): OneLookTileState {
  if (battery === undefined || s.isUnavailable) return s;
  const percent = Math.max(0, Math.min(100, Math.trunc(battery)));
  const line = s.state;
  if (line.kind === "word") {
    return { ...s, state: oneLookWordLine(`${line.word}${ONE_LOOK_SEPARATOR}${percent}%`, { short: line.short ?? line.word, amber: line.amber }) };
  }
  if (line.kind === "none") return { ...s, state: oneLookNumber(String(percent), { unit: "%" }) };
  return s;
}

// ── words, numbers and times ─────────────────────────────────────────────

/**
 * How long ago `date` was (both in milliseconds) in whole minutes, hours or
 * days: "2m ago", "3h ago", "4d ago", and "Just now" under a minute or for
 * a time a little in the future. `short` drops "ago".
 */
export function oneLookAgo(date: number, now: number): { long: string; short: string } {
  const seconds = (now - date) / 1000;
  if (!(seconds >= 60)) return { long: "Just now", short: "Just now" };
  const minutes = Math.trunc(Math.min(seconds / 60, 1_000_000_000));
  const amount = minutes < 60 ? `${minutes}m` : minutes < 60 * 24 ? `${Math.trunc(minutes / 60)}h` : `${Math.trunc(minutes / (60 * 24))}d`;
  return { long: `${amount} ago`, short: amount };
}

/** "Ran 2m ago", tried as "2m ago"; "Ran just now" under a minute. */
export function oneLookRanLine(date: number, now: number): OneLookStateLine {
  const when = oneLookAgo(date, now);
  if (when.long === "Just now") return oneLookWordLine("Ran just now", { short: "Just now" });
  return oneLookWordLine(`Ran ${when.long}`, { short: when.long });
}

/** Seconds as "4:32" or "1:04:32", never "--:--" (zero is "0:00"). */
export function oneLookClock(seconds: number): string {
  const total = Math.trunc(Math.min(Math.max(0, Number.isFinite(seconds) ? seconds : 0), 1_000_000_000));
  const minutes = Math.trunc(total / 60);
  const secs = String(total % 60).padStart(2, "0");
  if (minutes >= 60) return `${Math.trunc(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}:${secs}`;
  return `${minutes}:${secs}`;
}

/** A state code as a word: "not_home" is "Not home", "mowing" "Mowing".
 * Text with spaces, digits or capitals is the user's own and kept; "idle"
 * says nothing, so it is no state line. */
export function oneLookWord(state: string): OneLookStateLine {
  const trimmed = state.trim();
  if (trimmed === "" || trimmed.toLowerCase() === "idle") return NONE;
  if (!/^[\p{Ll}_-]+$/u.test(trimmed)) return oneLookWordLine(trimmed);
  const words = trimmed.replace(/[_-]/g, " ");
  return oneLookWordLine(words.slice(0, 1).toUpperCase() + words.slice(1));
}

/** A weather condition as words (`SensorEntity.weatherConditionText`). */
export function oneLookWeatherText(condition: string): string {
  switch (condition.toLowerCase()) {
    case "clear-night": return "Clear night";
    case "cloudy": return "Cloudy";
    case "fog": return "Fog";
    case "hail": return "Hail";
    case "lightning": return "Lightning";
    case "lightning-rainy": return "Thunderstorm";
    case "partlycloudy": return "Partly cloudy";
    case "pouring": return "Heavy rain";
    case "rainy": return "Rain";
    case "snowy": return "Snow";
    case "snowy-rainy": return "Sleet";
    case "sunny": return "Sunny";
    case "windy": case "windy-variant": return "Windy";
    case "exceptional": return "Exceptional";
    default: {
      const words = condition.replace(/[_-]/g, " ").toLowerCase();
      return words.slice(0, 1).toUpperCase() + words.slice(1);
    }
  }
}

/** A number as Swift's `Double(String)` reads it. */
const SWIFT_NUMBER = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;

function swiftNumber(value: string): number | undefined {
  return SWIFT_NUMBER.test(value) ? Number(value) : undefined;
}

/** The shortest decimal of a finite number's size, as two digit strings. */
function plainDigits(abs: number): { int: string; frac: string } {
  const text = String(abs);
  const e = text.indexOf("e");
  if (e < 0) {
    const dot = text.indexOf(".");
    return dot < 0 ? { int: text, frac: "" } : { int: text.slice(0, dot), frac: text.slice(dot + 1) };
  }
  const mantissa = text.slice(0, e).replace(".", "");
  const point = (text.indexOf(".") < 0 ? e : text.indexOf(".")) + Number(text.slice(e + 1));
  if (point <= 0) return { int: "0", frac: "0".repeat(-point) + mantissa };
  if (point >= mantissa.length) return { int: mantissa + "0".repeat(point - mantissa.length), frac: "" };
  return { int: mantissa.slice(0, point), frac: mantissa.slice(point) };
}

/**
 * A number as `NumberFormatter` writes it in the `.decimal` style: at most
 * `places` fraction digits, trailing zeros dropped, rounded on the
 * number's own shortest decimal (as ICU does, so 1.005 rounds up to 1.01),
 * half up or half to even, with or without the en-US grouping comma. A
 * negative that rounds to zero keeps its sign ("-0").
 */
export function oneLookFormatNumber(value: number, places: number, o: { mode?: "halfUp" | "halfEven"; grouping?: boolean } = {}): string {
  if (!Number.isFinite(value)) return String(value);
  const keep = Math.max(0, Math.trunc(places));
  const { int, frac } = plainDigits(Math.abs(value));
  let digits = int + frac.slice(0, keep).padEnd(keep, "0");
  const next = frac.charAt(keep);
  if (next !== "") {
    const rest = frac.slice(keep + 1);
    const odd = Number(digits.charAt(digits.length - 1)) % 2 === 1;
    const up = (o.mode ?? "halfUp") === "halfUp" ? next >= "5" : next > "5" || (next === "5" && (/[1-9]/.test(rest) || odd));
    if (up) digits = (BigInt(digits) + 1n).toString().padStart(digits.length, "0");
  }
  let whole = keep > 0 ? digits.slice(0, digits.length - keep) : digits;
  let fraction = keep > 0 ? digits.slice(digits.length - keep).replace(/0+$/, "") : "";
  whole = whole.replace(/^0+(?=\d)/, "");
  if (whole === "") whole = "0";
  if (o.grouping === true) whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  fraction = fraction === "" ? "" : `.${fraction}`;
  return `${value < 0 ? "-" : ""}${whole}${fraction}`;
}

/** A temperature rounded half up to `decimalPlaces`, with its degree. */
export function oneLookDegrees(value: number, decimalPlaces: number): string {
  return `${oneLookFormatNumber(value, Math.max(0, Math.min(decimalPlaces, 6)))}°`;
}

/**
 * A number as C's `printf` writes `%.0f` or `%.1f`, which the app's
 * thermostat uses: correctly rounded, an exact tie to even (72.5 is "72",
 * 21.25 is "21.2"), where JS `toFixed` rounds a tie up.
 */
export function oneLookPrintfFixed(value: number, digits: 0 | 1): string {
  const abs = Math.abs(value);
  const scaled = digits === 0 ? abs : abs * 10;
  // A tie at one digit is a quarter (4x odd), whose tenfold is exact.
  const tie = digits === 0 ? Number.isInteger(abs * 2) && !Number.isInteger(abs) : Number.isInteger(abs * 4) && !Number.isInteger(abs * 2);
  if (!tie) return value.toFixed(digits);
  let n = Math.floor(scaled);
  if (n % 2 === 1) n += 1;
  const text = digits === 0 ? String(n) : `${Math.trunc(n / 10)}.${n % 10}`;
  return value < 0 ? `-${text}` : text;
}

/** A thermostat's temperature as it writes it: one decimal when its step
 * is under 1, else none, then a degree sign (`formatTemperature`). */
export function oneLookClimateTemperature(value: number, step: number): string {
  return `${oneLookPrintfFixed(value, step > 0 && step < 1 ? 1 : 0)}°`;
}

// ── lights, toggles, locks and covers ────────────────────────────────────

/** A light: its brightness when on and dimmable ("64%"), "On" when on and
 * not, "Off" when off. `brightnessPercent` is undefined for a light that
 * does not dim. */
export function oneLookLight(isOn: boolean, brightnessPercent: number | undefined, isAvailable = true): OneLookTileState {
  if (!isAvailable) return oneLookUnavailable({ kind: "light", on: false });
  if (!isOn) return tileState({ state: oneLookWordLine(ONE_LOOK_OFF_WORD), role: { kind: "light", on: false } });
  if (brightnessPercent === undefined) return tileState({ state: oneLookWordLine(ONE_LOOK_ON_WORD), role: { kind: "light", on: true } });
  const clamped = Math.max(0, Math.min(100, brightnessPercent));
  return tileState({ state: oneLookNumber(String(clamped), { unit: "%" }), role: { kind: "light", on: true, brightness: clamped / 100 } });
}

/** A switch, input boolean, automation, remote or siren: "On" or "Off". */
export function oneLookToggle(isOn: boolean, isAvailable = true): OneLookTileState {
  if (!isAvailable) return oneLookUnavailable();
  return tileState({ state: oneLookWordLine(isOn ? ONE_LOOK_ON_WORD : ONE_LOOK_OFF_WORD), isCalm: !isOn });
}

/** A fan: its speed when on ("40%"), "On" when on with no speed, "Off". */
export function oneLookFan(isOn: boolean, percentage: number | undefined, isAvailable = true): OneLookTileState {
  if (!isAvailable) return oneLookUnavailable();
  if (!isOn) return tileState({ state: oneLookWordLine(ONE_LOOK_OFF_WORD), isCalm: true });
  if (percentage === undefined || !(percentage > 0)) return tileState({ state: oneLookWordLine(ONE_LOOK_ON_WORD) });
  return tileState({ state: oneLookNumber(String(Math.min(100, percentage)), { unit: "%" }) });
}

/** A lock: a moving or stuck state wins ("Locking", "Jammed", "Open"),
 * else "Locked" or "Unlocked". */
export function oneLookLock(rawState: string, isLocked: boolean, isAvailable = true): OneLookTileState {
  if (!isAvailable) return oneLookUnavailable();
  const words: Readonly<Record<string, string>> = { locking: "Locking", unlocking: "Unlocking", jammed: "Jammed", opening: "Opening", open: "Open" };
  const raw = rawState.toLowerCase();
  if (Object.hasOwn(words, raw)) return tileState({ state: oneLookWordLine(words[raw]!) });
  return tileState({ state: oneLookWordLine(isLocked ? "Locked" : "Unlocked"), isCalm: isLocked });
}

/** A cover or valve: "Opening" or "Closing" while it moves; else its
 * position, 0 as "Closed" and 100 as "Open"; with none, "Open" or
 * "Closed". */
export function oneLookCover(rawState: string, isOpen: boolean, position: number | undefined, isAvailable = true): OneLookTileState {
  if (!isAvailable) return oneLookUnavailable();
  const raw = rawState.toLowerCase();
  if (raw === "opening") return tileState({ state: oneLookWordLine("Opening") });
  if (raw === "closing") return tileState({ state: oneLookWordLine("Closing") });
  if (position === undefined) return tileState({ state: oneLookWordLine(isOpen ? "Open" : "Closed"), isCalm: !isOpen });
  if (position <= 0) return tileState({ state: oneLookWordLine("Closed"), isCalm: true });
  if (position >= 100) return tileState({ state: oneLookWordLine("Open") });
  return tileState({ state: oneLookNumber(String(position), { unit: "%" }) });
}

// ── climate ──────────────────────────────────────────────────────────────

export interface OneLookClimateInput {
  isOff: boolean;
  current?: number;
  target?: number;
  low?: number;
  high?: number;
  isDualSetpoint: boolean;
  supportsFanMode: boolean;
  showCurrent?: boolean;
  showTarget?: boolean;
  isAvailable?: boolean;
  /** The entity's temperature format (`oneLookClimateTemperature` at its
   * step). */
  format: (value: number) => string;
}

/**
 * A thermostat: the room's temperature as the number ("70°", degree at
 * full size), then the target ("to 72°") or the range (low to high, the degree
 * once) as the tail; "Off" as the tail while the HVAC is off. With the
 * room's temperature hidden the target is the number. A thermostat with fan
 * modes carries the fan.
 */
export function oneLookClimate(c: OneLookClimateInput): OneLookTileState {
  if (c.isAvailable === false) return oneLookUnavailable();
  const accessory: OneLookAccessory = c.supportsFanMode ? "fan" : "none";
  let targetText: string | undefined;
  let targetTail: string | undefined;
  if (c.showTarget !== false && !c.isOff) {
    if (c.isDualSetpoint && c.low !== undefined && c.high !== undefined) {
      const low = c.format(c.low);
      targetText = `${low.endsWith("°") ? low.slice(0, -1) : low}\u2013${c.format(c.high)}`;
      targetTail = targetText;
    } else if (c.target !== undefined) {
      targetText = c.format(c.target);
      targetTail = `to ${c.format(c.target)}`;
    }
  }
  let state: OneLookStateLine;
  if (c.showCurrent !== false && c.current !== undefined) state = oneLookNumber(c.format(c.current), { tail: c.isOff ? ONE_LOOK_OFF_WORD : targetTail });
  else if (targetText !== undefined) state = oneLookNumber(targetText);
  else if (c.isOff) state = oneLookWordLine(ONE_LOOK_OFF_WORD);
  else state = NONE;
  return tileState({ state, accessory, isCalm: c.isOff });
}

// ── sensors ──────────────────────────────────────────────────────────────

/** A binary sensor's words by device class (`binaryStateLabel`), on then
 * off. */
const BINARY_LABELS: Readonly<Record<string, readonly [string, string]>> = {
  battery: ["Low", "Normal"], battery_charging: ["Charging", "Not charging"],
  carbon_monoxide: ["Detected", "Clear"], gas: ["Detected", "Clear"], motion: ["Detected", "Clear"], smoke: ["Detected", "Clear"],
  sound: ["Detected", "Clear"], vibration: ["Detected", "Clear"], cold: ["Cold", "Normal"], heat: ["Hot", "Normal"],
  connectivity: ["Connected", "Disconnected"], door: ["Open", "Closed"], garage_door: ["Open", "Closed"], window: ["Open", "Closed"],
  opening: ["Open", "Closed"], lock: ["Open", "Closed"], light: ["Detected", "No light"], moisture: ["Wet", "Dry"],
  moving: ["Moving", "Stopped"], occupancy: ["Occupied", "Not occupied"], plug: ["Plugged in", "Unplugged"], power: ["Detected", "No power"],
  presence: ["Home", "Away"], problem: ["Detected", "OK"], running: ["Running", "Not running"], safety: ["Unsafe", "Safe"],
  tamper: ["Detected", "Clear"], update: ["Available", "Up-to-date"],
};

/** Short forms of the longer binary labels, only words that mean the same. */
const BINARY_SHORT: Readonly<Record<string, string>> = { "Not occupied": "Vacant", "Not running": "Stopped", "No light": "Dark" };

/** A binary state's label and short form, or undefined when the state is
 * not on or off (`binaryStateLabels`). */
export function oneLookBinaryLabels(state: string, deviceClass: unknown): { full: string; short?: string } | undefined {
  const s = state.toLowerCase();
  if (s !== "on" && s !== "off") return undefined;
  const dc = typeof deviceClass === "string" ? deviceClass.toLowerCase() : "";
  const pair = Object.hasOwn(BINARY_LABELS, dc) ? BINARY_LABELS[dc]! : (["On", "Off"] as const);
  const full = s === "on" ? pair[0] : pair[1];
  return Object.hasOwn(BINARY_SHORT, full) ? { full, short: BINARY_SHORT[full]! } : { full };
}

/** A sensor's number split into figure and unit (`displayValueParts`):
 * rounded half up to `decimalPlaces` (1 when unset, 0 to 6), the unit
 * spaced unless it starts with ° or %. Undefined when the state is not a
 * number. */
export function oneLookSensorParts(state: string, unit: unknown, decimalPlaces: number | undefined): { number: string; unit?: string; spaced: boolean } | undefined {
  const value = swiftNumber(state);
  if (value === undefined) return undefined;
  const number = oneLookFormatNumber(value, Math.max(0, Math.min(decimalPlaces ?? 1, 6)));
  const u = typeof unit === "string" ? unit : "";
  if (u === "") return { number, spaced: false };
  return { number, unit: u, spaced: !u.startsWith("°") && !u.startsWith("%") };
}

/** What `oneLookSensor` reads of a sensor family entity. */
export interface OneLookSensorInput {
  entityId: string;
  state: string;
  unit?: unknown;
  deviceClass?: unknown;
  /** Weather's `temperature`. */
  temperature?: number;
  /** An update's versions. */
  installedVersion?: unknown;
  latestVersion?: unknown;
  /** When it last changed, in milliseconds (Home Assistant's
   * `last_updated`). */
  lastChanged?: number;
}

function sensorAvailable(entityId: string, state: string): boolean {
  return !watchStateUnavailable(state, tileKind(entityId));
}

function updateAvailable(s: OneLookSensorInput): boolean {
  if (!s.entityId.startsWith("update.")) return false;
  if (s.state.toLowerCase() === "on") return true;
  const latest = typeof s.latestVersion === "string" ? s.latestVersion : "";
  const installed = typeof s.installedVersion === "string" ? s.installedVersion : "";
  return latest !== "" && installed !== "" && latest !== installed;
}

/**
 * A sensor, binary sensor, counter, weather, update, tracker, siren or any
 * other kind the sensor tile draws. A number splits into figure and unit; a
 * counter is its raw number; a binary state is its device class word, with
 * how long ago it changed when that is known ("Clear · 5m ago", short
 * "Clear"); anything else is its state as a word.
 */
export function oneLookSensor(
  s: OneLookSensorInput,
  o: { decimalPlaces?: number; now?: number; missingData?: "appSideNow" | "integrationFirst"; changeTimes?: boolean } = {},
): OneLookTileState {
  if (!sensorAvailable(s.entityId, s.state)) return oneLookUnavailable();
  const id = s.entityId;
  if (id.startsWith("weather.")) return { ...oneLookWeather(s.state, s.temperature, { decimalPlaces: o.decimalPlaces }), isCalm: true };
  if (id.startsWith("siren.")) return oneLookToggle(s.state.toLowerCase() === "on");
  if (id.startsWith("update.")) {
    const waiting = updateAvailable(s);
    return tileState({ state: waiting ? oneLookWordLine("Update available", { short: "Update" }) : oneLookWordLine("Up to date"), isCalm: !waiting });
  }
  if (id.startsWith("device_tracker.")) return oneLookLocation(s.state);
  if (id.startsWith("counter.")) return tileState({ state: oneLookNumber(s.state), isCalm: true });
  const parts = oneLookSensorParts(s.state, s.unit, o.decimalPlaces);
  if (parts !== undefined) {
    const low = typeof s.deviceClass === "string" && s.deviceClass.toLowerCase() === "battery" && Number(s.state) <= ONE_LOOK_LOW_BATTERY_PERCENT;
    return tileState({ state: oneLookNumber(parts.number, { unit: parts.unit, unitSpaced: parts.spaced }), isCalm: !low });
  }
  const labels = oneLookBinaryLabels(s.state, s.deviceClass);
  if (labels !== undefined) {
    const isOn = s.state.toLowerCase() === "on";
    const needsUser = typeof s.deviceClass === "string" && s.deviceClass.toLowerCase() === "connectivity" ? !isOn : isOn;
    const times = (o.changeTimes ?? ONE_LOOK_STATE_CHOICES.binaryChangeTimes) || (o.missingData ?? ONE_LOOK_STATE_CHOICES.missingData) === "integrationFirst";
    if (times && s.lastChanged !== undefined && o.now !== undefined) {
      const when = oneLookAgo(s.lastChanged, o.now).long.toLowerCase();
      return tileState({ state: oneLookWordLine(`${labels.full}${ONE_LOOK_SEPARATOR}${when}`, { short: labels.short ?? labels.full }), isCalm: !needsUser });
    }
    return tileState({ state: oneLookWordLine(labels.full, { short: labels.short }), isCalm: !needsUser });
  }
  return tileState({ state: oneLookWord(s.state), isCalm: true });
}

/** Weather: the condition as the state, the temperature as the big value
 * (with "H 68° L 51°" under it when both are known); without room for the
 * big value the temperature is the state and the condition its tail. */
export function oneLookWeather(condition: string, temperature: number | undefined, o: { high?: number; low?: number; decimalPlaces?: number } = {}): OneLookTileState {
  const text = oneLookWeatherText(condition);
  if (temperature === undefined) return tileState({ state: oneLookWordLine(text) });
  const figure = oneLookDegrees(temperature, o.decimalPlaces ?? 0);
  const big: OneLookBigValue = { figure };
  if (o.high !== undefined && o.low !== undefined) big.sub = `H ${oneLookDegrees(o.high, 0)}\u2002L ${oneLookDegrees(o.low, 0)}`;
  return tileState({ state: oneLookWordLine(text), bigValue: big, stateWithoutBig: oneLookNumber(figure, { tail: text }) });
}

// ── people, media, timers and the rest ───────────────────────────────────

/** A person or tracker: "Home", "Away", or the zone's name, with its
 * first word as the short form when that is a whole word of 6 letters or
 * fewer. */
export function oneLookLocation(state: string, isAvailable = true): OneLookTileState {
  if (!isAvailable) return oneLookUnavailable();
  const s = state.toLowerCase();
  if (s === "home") return tileState({ state: oneLookWordLine("Home") });
  if (s === "not_home") return tileState({ state: oneLookWordLine("Away"), isCalm: true });
  const zone = state.replace(/_/g, " ");
  const full = zone.slice(0, 1).toUpperCase() + zone.slice(1);
  const first = zone.split(" ").find((w) => w !== "") ?? zone;
  const badge = [...first].length <= 6 ? first.slice(0, 1).toUpperCase() + first.slice(1).toLowerCase() : undefined;
  return tileState({ state: oneLookWordLine(full, { short: badge === full ? undefined : badge }), isCalm: true });
}

/** A media player or the music hub: "Playing", "Paused", "Buffering",
 * "On"; idle, off and standby say nothing. The play/pause disc shows
 * unless the player is off or on standby. */
export function oneLookMedia(state: string, isAvailable = true): OneLookTileState {
  if (!isAvailable) return oneLookUnavailable({ kind: "media", playing: false });
  const s = state.toLowerCase();
  const words: Readonly<Record<string, string>> = { playing: "Playing", paused: "Paused", buffering: "Buffering", on: ONE_LOOK_ON_WORD };
  const playing = s === "playing";
  const off = s === "off" || s === "standby";
  return tileState({
    state: Object.hasOwn(words, s) ? oneLookWordLine(words[s]!) : NONE,
    accessory: off ? "none" : "playPause",
    role: { kind: "media", playing },
    isCalm: !playing,
  });
}

/** A player with what it plays: while playing or paused with a title, the
 * title and artist ("Blue in Green · Miles Davis", tried as the title
 * alone); otherwise as `oneLookMedia`. */
export function oneLookNowPlaying(state: string, title: unknown, artist: unknown, isAvailable = true): OneLookTileState {
  const out = oneLookMedia(state, isAvailable);
  const s = state.toLowerCase();
  const t = typeof title === "string" ? title.trim() : "";
  if (!isAvailable || (s !== "playing" && s !== "paused") || t === "") return out;
  const a = typeof artist === "string" ? artist.trim() : "";
  return { ...out, state: a !== "" ? oneLookWordLine(`${t}${ONE_LOOK_SEPARATOR}${a}`, { short: t }) : oneLookWordLine(t) };
}

/** A timer: "4:32 left" while it runs, "4:32 paused" while paused, the
 * time kept on the watch too; idle says nothing. */
export function oneLookTimer(state: string, secondsLeft: number | undefined, isAvailable = true): OneLookTileState {
  if (!isAvailable) return oneLookUnavailable();
  const s = state.toLowerCase();
  if (s === "active") return tileState({ state: oneLookNumber(oneLookClock(secondsLeft ?? 0), { tail: "left", keepTail: true }) });
  if (s === "paused") return tileState({ state: oneLookNumber(oneLookClock(secondsLeft ?? 0), { tail: "paused", keepTail: true }) });
  return tileState({ isCalm: true });
}

/** An `.withInternetDateTime` time, with or without fractional seconds,
 * in milliseconds; undefined for anything else. */
export function oneLookInternetDate(value: string): number | undefined {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})$/i.test(value)) return undefined;
  const t = Date.parse(value);
  return Number.isFinite(t) ? t : undefined;
}

/** A scene: "Ran 2m ago" from the time in its state, or nothing. */
export function oneLookScene(lastActivated: number | undefined, now: number, isAvailable = true): OneLookTileState {
  if (!isAvailable) return oneLookUnavailable();
  if (lastActivated === undefined) return tileState({ isCalm: true });
  return tileState({ state: oneLookRanLine(lastActivated, now), isCalm: true });
}

/** A script: only its name until the integration sends when it last ran. */
export function oneLookScript(o: { lastTriggered?: number; now?: number; isAvailable?: boolean; missingData?: "appSideNow" | "integrationFirst" } = {}): OneLookTileState {
  if (o.isAvailable === false) return oneLookUnavailable();
  if ((o.missingData ?? ONE_LOOK_STATE_CHOICES.missingData) !== "integrationFirst" || o.lastTriggered === undefined || o.now === undefined) return tileState({ isCalm: true });
  return tileState({ state: oneLookRanLine(o.lastTriggered, o.now), isCalm: true });
}

/** An input number: its value (two decimals for a step under 1, else
 * none, rounded half to even with grouping, as `NumberFormatter`'s
 * defaults), with its unit glued for ° and % and spaced otherwise. */
export function oneLookInputNumber(value: number, step: number, unit: unknown, isAvailable = true): OneLookTileState {
  if (!isAvailable) return oneLookUnavailable();
  const number = oneLookFormatNumber(value, step < 1 ? 2 : 0, { mode: "halfEven", grouping: true });
  const u = typeof unit === "string" ? unit : "";
  if (u === "") return tileState({ state: oneLookNumber(number), isCalm: true });
  return tileState({ state: oneLookNumber(number, { unit: u, unitSpaced: !u.startsWith("°") && !u.startsWith("%") }), isCalm: true });
}

/** An input select: the chosen option. */
export function oneLookInputSelect(option: string, isAvailable = true): OneLookTileState {
  if (!isAvailable) return oneLookUnavailable();
  const trimmed = option.trim();
  return tileState({ state: trimmed === "" ? NONE : oneLookWordLine(trimmed), isCalm: true });
}

/** An alarm panel's state's name and short name (`AlarmState`); an
 * unknown state reads as disarmed. */
const ALARM_NAMES: Readonly<Record<string, readonly [string, string]>> = {
  disarmed: ["Disarmed", "Off"], armed_home: ["Armed Home", "Home"], armed_away: ["Armed Away", "Away"],
  armed_night: ["Armed Night", "Night"], armed_vacation: ["Armed Vacation", "Vacation"], armed_custom_bypass: ["Custom Bypass", "Custom"],
  pending: ["Pending", "Pending"], arming: ["Arming", "Arming"], disarming: ["Disarming", "Disarming"],
};

/** An alarm panel: its state ("Armed Away"), tried as its short form
 * ("Away"); triggered says "Triggered", then "Alert". */
export function oneLookAlarm(state: string, isAvailable = true): OneLookTileState {
  if (!isAvailable) return oneLookUnavailable();
  if (state === "triggered") return tileState({ state: oneLookWordLine("Triggered", { short: "Alert" }) });
  const key = Object.hasOwn(ALARM_NAMES, state) ? state : "disarmed";
  const [full, short] = ALARM_NAMES[key]!;
  return tileState({ state: oneLookWordLine(full, { short: short === full ? undefined : short }), isCalm: key === "disarmed" });
}

/** A vacuum: "Cleaning", "Docked", "Returning", "Paused", "Error"; idle
 * and anything else say nothing. */
export function oneLookVacuum(state: string, isAvailable = true): OneLookTileState {
  if (!isAvailable) return oneLookUnavailable();
  switch (state.toLowerCase()) {
    case "cleaning": return tileState({ state: oneLookWordLine("Cleaning") });
    case "docked": return tileState({ state: oneLookWordLine("Docked"), isCalm: true });
    case "returning": return tileState({ state: oneLookWordLine("Returning") });
    case "paused": return tileState({ state: oneLookWordLine("Paused"), isCalm: true });
    case "error": return tileState({ state: oneLookWordLine("Error") });
    default: return tileState({ isCalm: true });
  }
}

/** A button, speak, page, status page: only the name. */
export function oneLookAction(isAvailable = true): OneLookTileState {
  return isAvailable ? tileState({ isCalm: true }) : oneLookUnavailable();
}

/** Point Control: only the name, and while it aims at something live,
 * that thing's name as the state. The tile's own tap is its action. */
export function oneLookPointControl(aimedAt?: string, isAvailable = true): OneLookTileState {
  if (!isAvailable) return oneLookUnavailable();
  const name = aimedAt?.trim() ?? "";
  return tileState({ state: name === "" ? NONE : oneLookWordLine(name), isCalm: true });
}

/** Assist: only the name. The tile's own tap is its action. */
export function oneLookAssist(isAvailable = true): OneLookTileState {
  return isAvailable ? tileState({ isCalm: true }) : oneLookUnavailable();
}

/** A camera or multicam tile. Showing its picture it takes the camera's
 * role and says nothing, LIVE only while live video plays; in icon mode it
 * is a plain tile, unavailable like any other kind. */
export function oneLookCameraTile(showsPicture: boolean, isLiveVideoPlaying: boolean, isAvailable = true): OneLookTileState {
  if (showsPicture) {
    if (!isAvailable) return oneLookUnavailable({ kind: "camera" });
    return tileState({ accessory: isLiveVideoPlaying ? "live" : "none", role: { kind: "camera" } });
  }
  return isAvailable ? tileState({ isCalm: true }) : oneLookUnavailable();
}

/** An HTTP action's value (a number or a word), or its warning in amber. */
export function oneLookHttpAction(value: string | undefined, warning?: string): OneLookTileState {
  if (warning !== undefined && warning !== "") return tileState({ state: oneLookWordLine(warning, { amber: true }) });
  const v = value?.trim() ?? "";
  if (v === "") return tileState({ isCalm: true });
  if (swiftNumber(v) !== undefined) return tileState({ state: oneLookNumber(v), isCalm: true });
  return tileState({ state: oneLookWordLine(v), isCalm: true });
}

/** An HTTP action tile. One that cannot fire is drawn unavailable and says
 * "Needs setup" in amber. In value mode a number is the big value (the
 * state where there is no room for it), a word (its first line) the state;
 * no value yet says nothing. */
export function oneLookHttpTile(needsAttention: boolean, showsValue: boolean, value: string | undefined): OneLookTileState {
  if (needsAttention) return { ...oneLookHttpAction(undefined, ONE_LOOK_NEEDS_SETUP_WORD), isUnavailable: true };
  if (!showsValue) return tileState({ isCalm: true });
  const firstLine = value?.split(/\r\n|[\n\r\u2028\u2029\u0085\u000B\u000C]/).find((line) => line.trim() !== "");
  const s = oneLookHttpAction(firstLine);
  if (s.state.kind !== "number") return s;
  return tileState({ bigValue: { figure: s.state.figure }, stateWithoutBig: s.state, isCalm: true });
}

/** A macro or webhook inbox tile kept from an old document: drawn
 * unavailable, saying "Removed" in amber. */
export function oneLookRemoved(): OneLookTileState {
  return tileState({ state: oneLookWordLine(ONE_LOOK_REMOVED_WORD, { amber: true }), isUnavailable: true });
}

// ── a stored tile ────────────────────────────────────────────────────────

/** A tile's state with what its view adds around it. */
export interface OneLookKindState extends OneLookTileState {
  /** The tile is drawn before its entity loads: graphite, no state drawn
   * (`stateHidden`) but the assumed state's room kept. */
  placeholder: boolean;
  stateHidden: boolean;
  /** A cover's position, a fan's speed or a player's volume, 0 to 1 (a
   * light's level is its role's brightness). */
  barLevel?: number;
  /** A light placeholder keeps the bar's room. */
  keepsBarRoom: boolean;
  /** Whether the symbol takes its fill variant; false draws it as stored
   * (the outline of an off light, switch or fan, a disabled automation, or
   * a state icon). */
  filled: boolean;
  /** The key the tile's `stateColors` (and `stateIcons`) are read under,
   * undefined for a kind that never reads them or a tile in Single mode. */
  stateKey?: string;
}

/** What only the caller knows about a tile (`oneLookTileState`). */
export interface OneLookTileStateOptions {
  /** An HTTP action that cannot fire (deleted, or never set up). */
  httpNeedsAttention?: boolean;
  /** An HTTP action's last reply, in value mode. */
  httpValue?: string;
  /** What a point control aims at while live (never in a preview). */
  aimedAt?: string;
  /** Whether a camera's live video plays (never in a preview). */
  liveVideo?: boolean;
}

/** The kinds that keep their own face under One Look. */
const OWN_FACE_KINDS: ReadonlySet<string> = new Set(["divider", "spacer", "template", "chart", "map", "web", "text_field"]);

/** The kinds the app draws with its sensor tile. */
const SENSOR_TILE_KINDS: ReadonlySet<string> = new Set([
  "sensor", "binary_sensor", "text", "input_text", "counter", "todo", "update", "water_heater", "lawn_mower", "humidifier",
  "device_tracker", "zone", "event", "calendar", "date", "time", "datetime", "input_datetime", "image", "weather", "siren",
  "assist_satellite", "conversation", "tts", "stt", "wake_word",
]);

/** The app's own kinds, drawn without an entity. */
const VIRTUAL_KINDS: ReadonlySet<string> = new Set([
  "assist", "speak_message", "http_action", "macro", "webhook_inbox", "point_control", "music_hub", "multicam", "page", "show_page", "status_page",
]);

function num(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function entityOf(states: Readonly<Record<string, HassEntityState>> | undefined, entityId: string): HassEntityState | undefined {
  return states !== undefined && Object.hasOwn(states, entityId) ? states[entityId] : undefined;
}

function stateIconSet(tile: WatchPageTile, key: string | undefined): boolean {
  if (key === undefined) return false;
  const icons = tile.stateIcons;
  if (icons === null || typeof icons !== "object" || Array.isArray(icons)) return false;
  return typeof (icons as Record<string, unknown>)[key] === "string";
}

/** The value labels switch: on for a kind that has value labels and is not
 * set to Off (`stateShowsValueLabels`). Every other kind reads it as off,
 * which hides the sensor tile's state on weather, update, tracker and the
 * rest, as the app's sensor tile does. */
function showsValueLabels(tile: WatchPageTile): boolean {
  const style = watchValueLabelStyle(tile);
  return style !== undefined && style !== "Off";
}

/** The activity status switch (`showsActivityStatus`). */
function showsActivityStatus(tile: WatchPageTile, kind: string): boolean {
  return watchStateDomains("activityStatus").includes(kind) && tile.showActivityStatus !== false;
}

function kindState(base: OneLookTileState, o: Partial<OneLookKindState> = {}): OneLookKindState {
  const out: OneLookKindState = { ...base, placeholder: false, stateHidden: false, keepsBarRoom: false, filled: o.filled ?? true };
  if (o.barLevel !== undefined) out.barLevel = o.barLevel;
  if (o.stateKey !== undefined) out.stateKey = o.stateKey;
  return out;
}

/** The tile drawn before its entity loads (`OneLookTileModel.placeholder`). */
function placeholderState(entityId: string): OneLookKindState {
  return {
    ...tileState({ state: ONE_LOOK_ASSUMED_STATE }),
    placeholder: true,
    stateHidden: true,
    keepsBarRoom: entityId.startsWith("light."),
    filled: true,
  };
}

/**
 * A stored tile's One Look state from Home Assistant's `states`, as the
 * app's tile view for its kind builds it: the kind's words, hidden by the
 * tile's value labels or activity status switch where that kind reads one,
 * a battery after a vacuum's or mower's state, the bar level, whether the
 * symbol takes its fill and the key its state colours are read under.
 * `now` is in milliseconds. A tile whose entity is missing is the
 * placeholder; a kind that keeps its own face (header, spacer, template,
 * chart, map, web, text field) is undefined.
 */
export function oneLookTileState(
  tile: WatchPageTile,
  states: Readonly<Record<string, HassEntityState>> | undefined,
  now: number,
  options: OneLookTileStateOptions = {},
): OneLookKindState | undefined {
  const entityId = tileEntityId(tile);
  let kind = tileKind(entityId);
  if (OWN_FACE_KINDS.has(kind)) return undefined;
  if (VIRTUAL_KINDS.has(kind)) return virtualKindState(tile, kind, states, options);

  const entity = entityOf(states, entityId);
  if (entity === undefined) return placeholderState(entityId);
  const raw = str(entity.state);
  const lower = raw.toLowerCase();
  const attrs = entity.attributes ?? {};
  const available = !watchStateUnavailable(raw, kind);
  const keyed = watchTileStateKey(tile, raw);
  const valueLabels = showsValueLabels(tile);
  const activity = showsActivityStatus(tile, kind);
  const outline = (on: boolean) => !stateIconSet(tile, keyed) && on;
  const fillUnlessIcon = !stateIconSet(tile, keyed);
  if (kind === "media_player" && isWatchTvRemote(entityId, states)) kind = "remote";
  if (kind === "number") kind = "input_number";
  if (kind === "select") kind = "input_select";
  if (SENSOR_TILE_KINDS.has(kind)) kind = "sensor_tile";

  switch (kind) {
    case "light": {
      const on = raw === "on";
      const b = num(attrs.brightness);
      const s = oneLookLight(on, b === undefined ? undefined : Math.round((b / 255) * 100), available);
      return kindState(oneLookHidingNumber(s, !valueLabels), { filled: outline(on), stateKey: keyed });
    }
    case "switch":
    case "input_boolean":
      return kindState(oneLookToggle(raw === "on", available), { filled: outline(raw === "on"), stateKey: keyed });
    case "lock":
      return kindState(oneLookLock(raw, raw === "locked", available), { filled: fillUnlessIcon, stateKey: keyed });
    case "cover":
    case "valve": {
      const p = num(attrs.current_position);
      const position = p === undefined ? undefined : Math.round(p);
      const s = oneLookCover(raw, raw === "open", position, available);
      return kindState(oneLookHidingState(s, !valueLabels), { filled: fillUnlessIcon, stateKey: keyed, barLevel: position === undefined ? undefined : position / 100 });
    }
    case "climate": {
      const sf = Math.trunc(num(attrs.supported_features) ?? 0);
      const step = num(attrs.target_temp_step) ?? 1;
      const isOff = lower === "off" || lower === "unavailable";
      const s = oneLookClimate({
        isOff,
        current: num(attrs.current_temperature),
        target: num(attrs.temperature),
        low: num(attrs.target_temp_low),
        high: num(attrs.target_temp_high),
        isDualSetpoint: lower === "heat_cool" || (sf !== 0 && (sf & 2) !== 0 && (sf & 1) === 0),
        supportsFanMode: (sf & 8) !== 0,
        showCurrent: tile.showCurrentTempOnTile !== false,
        showTarget: tile.showTargetTempOnTile !== false,
        isAvailable: available,
        format: (v) => oneLookClimateTemperature(v, step),
      });
      return kindState(oneLookHidingState(s, !valueLabels), { filled: outline(!isOff), stateKey: keyed });
    }
    case "button":
    case "input_button":
      return kindState(oneLookAction(available));
    case "remote": {
      const playerId = watchRemotePlayerId(tile);
      const player = entityOf(states, playerId);
      let s: OneLookTileState;
      if (player === undefined) s = oneLookToggle(lower === "on", available);
      else s = { ...oneLookMedia(str(player.state), available), accessory: "none", role: PLAIN };
      return kindState(oneLookHidingState(s, !activity));
    }
    case "sensor_tile": {
      const isMower = entityId.startsWith("lawn_mower.");
      const changed = Date.parse(entity.last_updated);
      let s = oneLookSensor(
        {
          entityId,
          state: raw,
          unit: attrs.unit_of_measurement,
          deviceClass: attrs.device_class,
          temperature: num(attrs.temperature),
          installedVersion: attrs.installed_version,
          latestVersion: attrs.latest_version,
          lastChanged: Number.isFinite(changed) ? changed : undefined,
        },
        { decimalPlaces: num(tile.decimalPlaces), now },
      );
      s = oneLookHidingState(s, !valueLabels || (isMower && !showsActivityStatus(tile, "lawn_mower")));
      if (tile.showBatteryOnTile !== false && isMower) s = oneLookWithBattery(s, mowerBattery(tile, entityId, states));
      return kindState(s, { filled: fillUnlessIcon, stateKey: keyed });
    }
    case "input_number": {
      const s = oneLookInputNumber(swiftNumber(raw) ?? 0, num(attrs.step) ?? 1, attrs.unit_of_measurement, available);
      return kindState(s);
    }
    case "input_select":
      return kindState(oneLookInputSelect(raw, available));
    case "automation":
      return kindState(oneLookHidingState(oneLookToggle(raw === "on", available), !activity), { filled: raw === "on" });
    case "alarm_control_panel":
      return kindState(oneLookHidingState(oneLookAlarm(raw, available), !activity), { filled: fillUnlessIcon, stateKey: keyed });
    case "scene": {
      const ran = oneLookInternetDate(raw);
      return kindState(oneLookScene(ran, now, available));
    }
    case "script":
      return kindState(oneLookScript({ isAvailable: available }));
    case "person":
      return kindState(oneLookHidingState(oneLookLocation(raw, available), !activity), { filled: fillUnlessIcon, stateKey: keyed });
    case "fan": {
      const on = lower === "on";
      const pct = num(attrs.percentage);
      const s = oneLookFan(on, pct ?? 0, available);
      return kindState(oneLookHidingNumber(s, !valueLabels), {
        filled: outline(on),
        stateKey: keyed,
        barLevel: pct === undefined ? undefined : on ? pct / 100 : 0,
      });
    }
    case "media_player": {
      const s = oneLookNowPlaying(raw, attrs.media_title, attrs.media_artist, available);
      const volume = num(attrs.volume_level);
      const active = lower !== "off" && lower !== "standby";
      return kindState(oneLookHidingState(s, !activity), {
        filled: fillUnlessIcon,
        stateKey: keyed,
        barLevel: volume === undefined ? undefined : active ? volume : 0,
      });
    }
    case "timer":
      return kindState(oneLookHidingState(oneLookTimer(raw, watchTimerRemaining(entity, now), available), !activity));
    case "vacuum": {
      let s = oneLookHidingState(oneLookVacuum(raw, available), !activity);
      if (tile.showBatteryOnTile !== false) {
        const level = num(attrs.battery_level);
        s = oneLookWithBattery(s, level === undefined ? undefined : Math.trunc(level));
      }
      return kindState(s);
    }
    case "camera": {
      const s = oneLookCameraTile(tile.cameraDisplayMode === "preview", options.liveVideo === true, available);
      return kindState(s, { filled: false, stateKey: keyed });
    }
    default:
      // The app draws any other kind through its light tile, which has no
      // light to show for it: the placeholder.
      return placeholderState(entityId);
  }
}

/** A lawn mower's battery: its own sensor, else `sensor.<id>_battery`,
 * truncated to a whole percent. */
function mowerBattery(tile: WatchPageTile, entityId: string, states: Readonly<Record<string, HassEntityState>> | undefined): number | undefined {
  const own = typeof tile.mowerBatteryEntityId === "string" ? tile.mowerBatteryEntityId : undefined;
  const sensor = entityOf(states, own ?? `sensor.${tileTarget(entityId)}_battery`);
  if (sensor === undefined) return undefined;
  const value = swiftNumber(str(sensor.state));
  return value === undefined ? undefined : Math.trunc(value);
}

function virtualKindState(
  tile: WatchPageTile,
  kind: string,
  states: Readonly<Record<string, HassEntityState>> | undefined,
  options: OneLookTileStateOptions,
): OneLookKindState {
  switch (kind) {
    case "assist":
      return kindState(oneLookAssist());
    case "http_action":
      return kindState(oneLookHttpTile(options.httpNeedsAttention === true, tile.httpResponseDisplay === "tileValue", options.httpValue));
    case "macro":
    case "webhook_inbox":
      return kindState(oneLookRemoved());
    case "point_control":
      return kindState(oneLookPointControl(options.aimedAt));
    case "music_hub": {
      const speaker = watchMusicHubActiveSpeaker(tile, states);
      const player = speaker === undefined ? undefined : entityOf(states, speaker.entityId);
      const s =
        player === undefined
          ? tileState({ role: { kind: "media", playing: false }, isCalm: true })
          : oneLookNowPlaying(str(player.state), player.attributes?.media_title, player.attributes?.media_artist);
      return kindState(oneLookHidingState(s, !showsActivityStatus(tile, "music_hub")));
    }
    case "multicam":
      // Each cell draws its own LIVE, so the tile never does.
      return kindState(oneLookCameraTile(tile.cameraDisplayMode === "preview", false));
    default:
      // Speak, a page, a peek page, a status page: only the name.
      return kindState(oneLookAction());
  }
}

/** The bar's value (`OneLookTileModel.barValue`): a light's brightness
 * while on, another kind's level while above 0; undefined draws no bar. */
export function oneLookBarValue(s: OneLookKindState): number | undefined {
  if (s.role.kind === "light") return s.role.on ? (s.role.brightness ?? undefined) : undefined;
  return s.barLevel !== undefined && s.barLevel > 0 ? s.barLevel : undefined;
}

/** The level a Fill style fills a kind other than a light to (the
 * palette's `fillLevel`); undefined with the Top style or no level. */
export function oneLookFillLevel(s: OneLookKindState, fillStyle: boolean): number | undefined {
  return fillStyle && s.role.kind !== "light" ? s.barLevel : undefined;
}
