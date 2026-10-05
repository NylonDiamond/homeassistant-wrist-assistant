// A menu slot's voice routing (`VoiceRoutingConfig`, the slot's
// `voiceConfig`) and its phrase lists, as `voice-keys.json`'s `routing`
// section lists them: which keys each action reads, their types, defaults and
// labels, when a row shows, which default from the voice settings stands
// behind a key, and which phrases a Pick from List slot shows. No drawing.
//
// `voiceConfig` is kept raw, as the menu editor keeps every slot key: a
// setter changes one key and leaves every other key as it came, a key this
// table does not know included. Setting a key to the value the watch already
// reads (its stored value, else its default) changes nothing, so a slot's
// empty `voiceConfig` stays `{}` until a value really changes. Clearing an
// entity or a speaker list removes its key, which reads as its default.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 2 build
// contract", item 22).

import { sameWatchPagesJson } from "../watch-pages/merge.js";
import { type JsonObject, isJsonObject } from "../watch-pages/model.js";
import { VOICE_KEYS, withVoiceKey, withoutVoiceKey } from "./model.js";

export interface VoiceRoutingKeySpec {
  type: "enum" | "array" | "entity" | "int" | "bool";
  enum?: string;
  items?: { type: string; domain?: string };
  domain?: string;
  optional?: boolean;
  default: unknown;
  clamp?: [number, number];
  /** The voice settings key that stands behind an empty value. */
  fallsBackTo?: string;
  /** The output modes in which it does; every mode when not given. */
  fallsBackWhen?: string[];
  whenBlank?: string;
  label?: string;
  shownWhen?: string;
  /** False for a key the phone has no control for. */
  phone?: boolean;
}

export interface VoiceRoutingAction {
  action: string;
  label: string;
  keys: string[];
  slotKeys?: string[];
  slotLabel?: string;
  payloadKeys?: string[];
  phraseVisibility?: {
    rule: string;
    newPhrases: string;
    cases: { phrases: string[]; hiddenPhraseIds?: string[]; knownPhraseIds?: string[]; visible: string[] }[];
  };
}

export interface VoiceRoutingTable {
  slotKey: string;
  enums: Record<string, string[]>;
  labels: Record<string, Record<string, string>>;
  offered: Record<string, string[]>;
  legacy: Record<string, string>;
  keys: Record<string, VoiceRoutingKeySpec>;
  actions: VoiceRoutingAction[];
}

export const VOICE_ROUTING = VOICE_KEYS.routing as VoiceRoutingTable;

/** The routing of one action: the keys it reads. Undefined for an action
 * that reads none. */
export function voiceRoutingAction(raw: string): VoiceRoutingAction | undefined {
  return VOICE_ROUTING.actions.find((a) => a.action === raw);
}

/** The keys a slot of this action shows, in the table's order: Assist,
 * Speak Message and Broadcast. Empty for any other action. */
export function voiceRoutingKeys(raw: string): string[] {
  return voiceRoutingAction(raw)?.keys ?? [];
}

export function voiceRoutingSpec(key: string): VoiceRoutingKeySpec | undefined {
  return Object.hasOwn(VOICE_ROUTING.keys, key) ? VOICE_ROUTING.keys[key] : undefined;
}

/** A slot's `voiceConfig`, or an empty object when it holds none. Never
 * written back as it is. */
export function slotVoiceConfig(slot: JsonObject): JsonObject {
  return isJsonObject(slot.voiceConfig) ? slot.voiceConfig : {};
}

/** The legacy value an enum value reads as (`assistReplyOutputMode`'s
 * `defaultSpeakers` reads as `configuredSpeakers`). */
function legacyAs(key: string, value: string): string {
  const note = VOICE_ROUTING.legacy[`${key}.${value}`];
  if (note === undefined) return value;
  const m = /reads as (\w+)/.exec(note);
  return m?.[1] ?? value;
}

/**
 * A key as the watch reads it: the stored value when it is of the key's
 * type (an enum one the table names, read through its legacy meaning; a
 * number held to its range), else the key's default.
 */
export function voiceRoutingValue(config: JsonObject, key: string): unknown {
  const spec = voiceRoutingSpec(key);
  if (spec === undefined) return undefined;
  const stored = Object.hasOwn(config, key) ? config[key] : undefined;
  switch (spec.type) {
    case "enum": {
      const values = VOICE_ROUTING.enums[spec.enum ?? ""] ?? [];
      return typeof stored === "string" && values.includes(stored) ? legacyAs(key, stored) : spec.default;
    }
    case "bool":
      return typeof stored === "boolean" ? stored : spec.default;
    case "int": {
      if (typeof stored !== "number" || !Number.isFinite(stored)) return spec.default;
      const [min, max] = spec.clamp ?? [-Infinity, Infinity];
      return Math.min(max, Math.max(min, Math.round(stored)));
    }
    case "entity":
      return typeof stored === "string" ? stored.trim() : spec.default;
    case "array":
      return Array.isArray(stored) ? stored.filter((s): s is string => typeof s === "string") : spec.default;
  }
}

/**
 * Whether a row shows, by its `shownWhen`: "<key> is <a>", "<key> is <a>
 * or <b>", "<key> is not <a>", read against the values the watch reads. A
 * key with no rule always shows.
 */
export function voiceRoutingShown(config: JsonObject, key: string): boolean {
  const rule = voiceRoutingSpec(key)?.shownWhen;
  if (rule === undefined) return true;
  const m = /^(\w+) is (not )?(.+)$/.exec(rule.trim());
  if (m === null) return true;
  const value = voiceRoutingValue(config, m[1]!);
  const values = m[3]!.split(/\s+or\s+/).map((v) => v.trim());
  const hit = typeof value === "string" && values.includes(value);
  return m[2] === undefined ? hit : !hit;
}

/** The enum values a row offers, with their labels: the phone's offer,
 * and the stored value too when it is one the phone no longer offers. */
export function voiceRoutingChoices(config: JsonObject, key: string): [string, string][] {
  const spec = voiceRoutingSpec(key);
  if (spec?.type !== "enum") return [];
  const labels = VOICE_ROUTING.labels[spec.enum ?? ""] ?? {};
  const offered = VOICE_ROUTING.offered[key] ?? VOICE_ROUTING.enums[spec.enum ?? ""] ?? [];
  const current = voiceRoutingValue(config, key);
  const values = typeof current === "string" && !offered.includes(current) ? [current, ...offered] : offered;
  return values.map((v) => [v, labels[v] ?? v]);
}

/** A row's label from the table, else its key. */
export function voiceRoutingLabel(key: string): string {
  return voiceRoutingSpec(key)?.label ?? VOICE_ROUTING_HIDDEN_LABELS[key] ?? key;
}

/** Labels for the keys the phone has no control for. */
const VOICE_ROUTING_HIDDEN_LABELS: Readonly<Record<string, string>> = {
  assistAutoSendOnPause: "Send When I Pause",
  broadcastImmediateListen: "Start Listening Immediately",
};

/**
 * The slot's `voiceConfig` with one key set, or the same object when the
 * value is refused or changes nothing. An entity that is
 * blank and a speaker list that is empty remove the key (its default); an
 * enum must be one the row offers; a number is held to its range and made
 * whole. Unknown keys stay as they came.
 */
export function setVoiceRoutingKey(config: JsonObject, key: string, value: unknown): JsonObject {
  const spec = voiceRoutingSpec(key);
  if (spec === undefined) return config;
  let v: unknown;
  switch (spec.type) {
    case "enum":
      if (typeof value !== "string" || !voiceRoutingChoices(config, key).some(([c]) => c === value)) return config;
      v = value;
      break;
    case "bool":
      if (typeof value !== "boolean") return config;
      v = value;
      break;
    case "int": {
      if (typeof value !== "number" || !Number.isFinite(value)) return config;
      const [min, max] = spec.clamp ?? [-Infinity, Infinity];
      v = Math.min(max, Math.max(min, Math.round(value)));
      break;
    }
    case "entity": {
      if (value !== undefined && typeof value !== "string") return config;
      const t = (value ?? "").trim();
      if (t === "") return withoutVoiceKey(config, key);
      v = t;
      break;
    }
    case "array": {
      if (!Array.isArray(value) || !value.every((s) => typeof s === "string")) return config;
      const list = [...new Set((value as string[]).map((s) => s.trim()).filter((s) => s !== ""))];
      if (list.length === 0) return withoutVoiceKey(config, key);
      v = list;
      break;
    }
  }
  // Absent, the key reads as its default: setting that changes nothing.
  // Stored, only the very value is no change; a stored value of another form
  // (a legacy enum value, a number out of range) is written out, as the
  // phone's picker writes it.
  const same = Object.hasOwn(config, key) ? sameWatchPagesJson(config[key], v) : sameWatchPagesJson(voiceRoutingValue(config, key), v);
  return same ? config : withVoiceKey(config, key, v);
}

/** A speaker ticked or unticked in a slot's speaker list. */
export function toggleVoiceRoutingSpeaker(config: JsonObject, key: string, entityId: string, on: boolean): JsonObject {
  const stored = voiceRoutingValue(config, key);
  const list = Array.isArray(stored) ? (stored as string[]) : [];
  if (on === list.includes(entityId)) return config;
  return setVoiceRoutingKey(config, key, on ? [...list, entityId] : list.filter((s) => s !== entityId));
}

/** The defaults from the voice settings a slot falls back to. */
export interface VoiceFallbacks {
  agent?: string | undefined;
  engine?: string | undefined;
  speakers?: readonly string[] | undefined;
}

/** The voice settings key a routing key falls back to, read out of the
 * defaults. */
function fallbackValue(spec: VoiceRoutingKeySpec, defaults: VoiceFallbacks | undefined): string | readonly string[] | undefined {
  switch (spec.fallsBackTo) {
    case "defaultAssistAgentId":
      return defaults?.agent;
    case "defaultTTSEngine":
      return defaults?.engine;
    case "defaultSpeakers":
      return defaults?.speakers;
    default:
      return undefined;
  }
}

/**
 * Whether the key falls back to the voice settings now: it names a default,
 * and the output mode its `fallsBackWhen` names is the one set (any mode
 * when it names none).
 */
export function voiceRoutingFallsBack(config: JsonObject, key: string): boolean {
  const spec = voiceRoutingSpec(key);
  if (spec?.fallsBackTo === undefined) return false;
  const when = spec.fallsBackWhen;
  if (when === undefined) return true;
  const modeKey = key.startsWith("assist") ? "assistReplyOutputMode" : key.startsWith("speakMessage") ? "speakMessageOutputMode" : "broadcastTargetMode";
  const mode = voiceRoutingValue(config, modeKey);
  return typeof mode === "string" && when.includes(mode);
}

/**
 * The words of an empty entity or speaker row: "Default (<name>)" with the
 * default the voice settings hold, named by `name`, when the key falls back
 * now. Without voice settings, "Default". When the key falls back to nothing
 * set, the agent says Home Assistant's own default, the others "Not set".
 * A key with no default says "None", a speaker list with the table's own
 * words for a blank one when it has them.
 */
export function voiceRoutingDefaultLabel(
  config: JsonObject,
  key: string,
  defaults: VoiceFallbacks | undefined,
  name: (id: string) => string,
): string {
  const spec = voiceRoutingSpec(key);
  if (spec === undefined) return "None";
  if (!voiceRoutingFallsBack(config, key)) return spec.type === "array" ? "None" : "Not set";
  if (defaults === undefined) return "Default";
  const value = fallbackValue(spec, defaults);
  if (typeof value === "string" && value.trim() !== "") return `Default (${name(value.trim())})`;
  if (Array.isArray(value) && value.length > 0) return `Default (${value.map(name).join(", ")})`;
  return spec.fallsBackTo === "defaultAssistAgentId" ? "Default (Home Assistant default)" : "Default (Not set)";
}

// ── phrases on a slot ────────────────────────────────────────────────────

function ids(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((s): s is string => typeof s === "string") : [];
}

function has(list: readonly string[], id: string): boolean {
  const up = id.toUpperCase();
  return list.some((s) => s.toUpperCase() === up);
}

/**
 * The phrases a Pick from List slot shows, in the library's order, by the
 * table's rule: with `knownPhraseIds` not empty, the phrases in it and not in
 * `hiddenPhraseIds`; otherwise every phrase not in `hiddenPhraseIds`. So a
 * phrase added to the library after the slot recorded its known phrases
 * stays hidden there until the slot is edited.
 */
export function visibleSlotPhraseIds(library: readonly string[], hidden: unknown, known: unknown): string[] {
  const h = ids(hidden);
  const k = ids(known);
  return library.filter((id) => !has(h, id) && (k.length === 0 || has(k, id)));
}

/**
 * The two lists a Pick from List slot holds after its phrases were picked,
 * as the phone's picker writes them: `knownPhraseIds` every phrase of the
 * library, `hiddenPhraseIds` those not picked, each in the library's order.
 */
export function slotPhraseLists(library: readonly string[], visible: readonly string[]): { hiddenPhraseIds: string[]; knownPhraseIds: string[] } {
  return {
    hiddenPhraseIds: library.filter((id) => !has(visible, id)),
    knownPhraseIds: library.slice(),
  };
}

/** The slot with one phrase shown or hidden on it, both lists written. The
 * slot itself when nothing changes. */
export function setSlotPhraseShown(slot: JsonObject, library: readonly string[], phraseId: string, shown: boolean): JsonObject {
  if (!has(library, phraseId)) return slot;
  const visible = visibleSlotPhraseIds(library, slot.hiddenPhraseIds, slot.knownPhraseIds);
  if (has(visible, phraseId) === shown) return slot;
  const next = shown ? library.filter((id) => has(visible, id) || id.toUpperCase() === phraseId.toUpperCase()) : visible.filter((id) => id.toUpperCase() !== phraseId.toUpperCase());
  const lists = slotPhraseLists(library, next);
  return withVoiceKey(withVoiceKey(slot, "hiddenPhraseIds", lists.hiddenPhraseIds), "knownPhraseIds", lists.knownPhraseIds);
}
