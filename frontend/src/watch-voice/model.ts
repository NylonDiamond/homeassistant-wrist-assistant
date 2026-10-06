// The watch's voice settings as Home Assistant keeps them (the `voice` watch
// config kind), without any drawing: the defaults an Assist or Speak slot
// falls back to (conversation agent, text to speech engine, speakers), the
// phrase library (at most eight phrases, which menus point at by id), and the
// two watch speech settings (Speak even in Silent Mode, the watch voice).
//
// The document is the app's `TTSConfiguration` as stored, kept raw as the
// menu editor keeps menus. Every setter takes the document and returns a new
// one in which only the objects on the path of the change are new; every key
// it does not model goes back as it came. A key the document did not have
// goes in at its sorted place, as the phone's sorted-key encoder writes it. A
// setter refuses by returning the document it was given, and so does an edit
// that changes nothing, a value set to what the watch already reads included.
//
// The table `voice-keys.json` is built from the app's Swift code by the app
// repo's `WatchVoiceDocumentTests`: every key with its type, default and
// labels, the phrase cap, the volume range, a new phrase's values, and the
// per slot routing the menu editor shows (`routing.ts`).
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 2 build
// contract", items 3 to 5).

import voiceKeys from "./voice-keys.json";
import { randomWatchId } from "../watch-pages/edit.js";
import { sameWatchPagesJson } from "../watch-pages/merge.js";
import { type JsonObject, WATCH_SYNC_LIMIT_BYTES, isJsonObject, sizeOf } from "../watch-pages/model.js";
import { watchCommandError } from "../watch-pages/save-note.js";

// ── the table ────────────────────────────────────────────────────────────

/** One key of the document or of a phrase, as `voice-keys.json` lists it. */
export interface VoiceKeySpec {
  type: "int" | "array" | "entity" | "bool" | "string" | "uuid" | "symbol" | "color" | "enum";
  domain?: string;
  enum?: string;
  items?: { type: string; domain?: string; ref?: string };
  required?: boolean;
  optional?: boolean;
  default?: unknown;
  effective?: { absent?: unknown; blank?: string; fallsBackTo?: string; when?: string; clamp?: [number, number] };
  section?: string;
  label?: string;
  /** False for a key the phone has no control for. */
  phone?: boolean;
}

export interface VoiceVolumeSpec {
  key: string;
  modeKey: string;
  min: number;
  max: number;
  step: number;
  default: number;
  unit: string;
  presets: { label: string; value: number }[];
}

export interface VoiceKeysTable {
  maxPhrases: number;
  enums: Record<string, string[]>;
  labels: Record<string, Record<string, string>>;
  types: { document: { keys: Record<string, VoiceKeySpec> }; phrase: { keys: Record<string, VoiceKeySpec> } };
  volume: VoiceVolumeSpec;
  newPhrase: { icon: string; color: string; displayMode: string; targetSpeakers: string[]; required: string[] };
  routing: unknown;
}

export const VOICE_KEYS = voiceKeys as unknown as VoiceKeysTable;

/** The phrase library's cap (`TTSConfiguration.maxPhrases`). */
export const WATCH_VOICE_MAX_PHRASES = VOICE_KEYS.maxPhrases;

const DOC_KEYS = VOICE_KEYS.types.document.keys;
const PHRASE_KEYS = VOICE_KEYS.types.phrase.keys;

/** An enum's values with their labels, in the table's order. */
export function watchVoiceEnumChoices(name: string): [string, string][] {
  const labels = VOICE_KEYS.labels[name] ?? {};
  return (VOICE_KEYS.enums[name] ?? []).map((v) => [v, labels[v] ?? v]);
}

// ── the document ─────────────────────────────────────────────────────────

/** The voice settings document, raw. */
export type VoiceDocument = JsonObject;

export function asWatchVoiceDocument(value: unknown): VoiceDocument | undefined {
  return isJsonObject(value) ? value : undefined;
}

/**
 * The document "Start with the defaults" saves: every key the app always
 * writes at its default, and `schemaVersion`, sorted as the phone's encoder
 * writes them. The same bytes as `test/fixtures-voice/01-defaults.json`. A
 * fresh copy each call.
 */
export function watchVoiceDefaults(): VoiceDocument {
  const out: VoiceDocument = {};
  for (const key of Object.keys(DOC_KEYS).sort()) {
    const spec = DOC_KEYS[key]!;
    if (spec.required === true || key === "schemaVersion") out[key] = structuredClone(spec.default);
  }
  return out;
}

/** The watch takes at most this much config in one sync. */
export const WATCH_VOICE_LIMIT_BYTES = WATCH_SYNC_LIMIT_BYTES;

export function watchVoiceSize(document: VoiceDocument): number {
  return sizeOf(document);
}

/** The budget line: the size, its share of the limit, and whether it is
 * close to it (over 80 percent). */
export function watchVoiceBudget(document: VoiceDocument): { size: number; limit: number; share: number; near: boolean } {
  const size = watchVoiceSize(document);
  const share = size / WATCH_VOICE_LIMIT_BYTES;
  return { size, limit: WATCH_VOICE_LIMIT_BYTES, share, near: share > 0.8 };
}

function put(object: JsonObject, key: string, value: unknown): void {
  if (key === "__proto__") Object.defineProperty(object, key, { value, enumerable: true, writable: true, configurable: true });
  else object[key] = value;
}

/** `object` with `key` set. A key it holds keeps its place; a new key goes at
 * its sorted place. The object itself when the value is the same JSON. */
export function withVoiceKey(object: JsonObject, key: string, value: unknown): JsonObject {
  if (Object.hasOwn(object, key)) {
    if (sameWatchPagesJson(object[key], value) && typeof object[key] === typeof value) return object;
    const out: JsonObject = {};
    for (const k of Object.keys(object)) put(out, k, k === key ? value : object[k]);
    return out;
  }
  const out: JsonObject = {};
  let placed = false;
  for (const k of Object.keys(object)) {
    if (!placed && k > key) {
      put(out, key, value);
      placed = true;
    }
    put(out, k, object[k]);
  }
  if (!placed) put(out, key, value);
  return out;
}

/** `object` without `key`, or the object itself when it has none. */
export function withoutVoiceKey(object: JsonObject, key: string): JsonObject {
  if (!Object.hasOwn(object, key)) return object;
  const out: JsonObject = {};
  for (const k of Object.keys(object)) if (k !== key) put(out, k, object[k]);
  return out;
}

function own(object: JsonObject, key: string): unknown {
  return Object.hasOwn(object, key) ? object[key] : undefined;
}

function trimmedId(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((s): s is string => typeof s === "string") : [];
}

// ── the defaults ─────────────────────────────────────────────────────────

/** The defaults as the watch reads them: each id trimmed, a blank one as
 * none; the speakers in stored order. */
export interface WatchVoiceDefaultsRead {
  agent: string | undefined;
  engine: string | undefined;
  speakers: string[];
}

export function watchVoiceDefaultsOf(document: VoiceDocument): WatchVoiceDefaultsRead {
  return {
    agent: trimmedId(own(document, "defaultAssistAgentId")),
    engine: trimmedId(own(document, "defaultTTSEngine")),
    speakers: stringList(own(document, "defaultSpeakers")),
  };
}

/** The conversation agent, or none (Home Assistant's own default agent):
 * none removes the key, as the phone's encoder leaves an absent optional
 * out. A blank stored one already reads as none, so none leaves it. */
export function setWatchVoiceAgent(document: VoiceDocument, entityId: string | undefined): VoiceDocument {
  const id = trimmedId(entityId);
  if (id === undefined) return trimmedId(own(document, "defaultAssistAgentId")) === undefined ? document : withoutVoiceKey(document, "defaultAssistAgentId");
  return withVoiceKey(document, "defaultAssistAgentId", id);
}

/** The text to speech engine; none writes the app's empty default, since the
 * key is not optional. */
export function setWatchVoiceEngine(document: VoiceDocument, entityId: string | undefined): VoiceDocument {
  const id = trimmedId(entityId) ?? "";
  if (id === "" && trimmedId(own(document, "defaultTTSEngine")) === undefined && Object.hasOwn(document, "defaultTTSEngine")) return document;
  return withVoiceKey(document, "defaultTTSEngine", id);
}

/** The default speakers, in the order given, each once. */
export function setWatchVoiceSpeakers(document: VoiceDocument, ids: readonly string[]): VoiceDocument {
  const list = [...new Set(ids.filter((s) => typeof s === "string" && s.trim() !== "").map((s) => s.trim()))];
  return withVoiceKey(document, "defaultSpeakers", list);
}

/** A speaker ticked or unticked in the Speakers checklist: added at the end,
 * or taken out. */
export function toggleWatchVoiceSpeaker(document: VoiceDocument, entityId: string, on: boolean): VoiceDocument {
  const stored = stringList(own(document, "defaultSpeakers"));
  if (on === stored.includes(entityId)) return document;
  return setWatchVoiceSpeakers(document, on ? [...stored, entityId] : stored.filter((s) => s !== entityId));
}

// ── on the watch ─────────────────────────────────────────────────────────

/** Speak even in Silent Mode, as the watch reads it: absent is on. */
export function watchVoiceSilentMode(document: VoiceDocument): boolean {
  const stored = own(document, "watchSpeakReplyInSilentMode");
  return typeof stored === "boolean" ? stored : DOC_KEYS.watchSpeakReplyInSilentMode?.effective?.absent !== false;
}

export function setWatchVoiceSilentMode(document: VoiceDocument, on: boolean): VoiceDocument {
  if (typeof on !== "boolean" || watchVoiceSilentMode(document) === on) return document;
  return withVoiceKey(document, "watchSpeakReplyInSilentMode", on);
}

/** The watch voice's id, or none (the system voice for the language). */
export function watchVoiceIdentifier(document: VoiceDocument): string | undefined {
  return trimmedId(own(document, "watchSpeechVoiceIdentifier"));
}

export function setWatchVoiceIdentifier(document: VoiceDocument, id: string | undefined): VoiceDocument {
  const value = trimmedId(id);
  if (value === undefined) return watchVoiceIdentifier(document) === undefined ? document : withoutVoiceKey(document, "watchSpeechVoiceIdentifier");
  return withVoiceKey(document, "watchSpeechVoiceIdentifier", value);
}

// ── the watch's voices ───────────────────────────────────────────────────

/** One voice installed on the watch, as `watch_voices/get` answers it
 * (`WatchVoiceInfo` in the app). `quality` is the raw value of
 * `AVSpeechSynthesisVoiceQuality`: 1 default, 2 enhanced, 3 premium. */
export interface WatchVoiceInfo {
  id: string;
  name: string;
  language: string;
  quality: number;
}

/** The entries of a reply that are voices; anything else is skipped. */
export function readWatchVoices(reply: unknown): WatchVoiceInfo[] {
  const list = isJsonObject(reply) && Array.isArray(reply.voices) ? reply.voices : [];
  return list.filter((v): v is WatchVoiceInfo =>
    isJsonObject(v) && typeof v.id === "string" && v.id !== "" && typeof v.name === "string"
    && typeof v.language === "string" && typeof v.quality === "number");
}

const QUALITY_WORDS: Readonly<Record<number, string>> = { 1: "Default", 2: "Enhanced", 3: "Premium" };

export function watchVoiceQualityWord(quality: number): string {
  return QUALITY_WORDS[quality] ?? "";
}

export interface WatchVoiceGroup {
  language: string;
  voices: WatchVoiceInfo[];
}

/**
 * The Watch voice picker's groups: one per language, the languages sorted,
 * and in each the best quality first, then by name ignoring case, then by id.
 */
export function groupWatchVoices(voices: readonly WatchVoiceInfo[]): WatchVoiceGroup[] {
  const byLanguage = new Map<string, WatchVoiceInfo[]>();
  for (const v of voices) {
    const list = byLanguage.get(v.language) ?? [];
    list.push(v);
    byLanguage.set(v.language, list);
  }
  return [...byLanguage.keys()].sort((a, b) => a.localeCompare(b, "en")).map((language) => ({
    language,
    voices: byLanguage.get(language)!.slice().sort((a, b) =>
      b.quality - a.quality || a.name.localeCompare(b.name, undefined, { sensitivity: "base" }) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)),
  }));
}

/** A voice's name in the picker: its name and, above the default quality,
 * the quality. */
export function watchVoiceLabel(voice: WatchVoiceInfo): string {
  return voice.quality > 1 && watchVoiceQualityWord(voice.quality) !== "" ? `${voice.name} (${watchVoiceQualityWord(voice.quality)})` : voice.name;
}

// ── phrases ──────────────────────────────────────────────────────────────

/** The phrases that are objects, in stored order. */
export function watchVoicePhrases(document: VoiceDocument): JsonObject[] {
  const list = own(document, "phrases");
  return Array.isArray(list) ? list.filter(isJsonObject) : [];
}

export function watchVoicePhraseId(phrase: JsonObject): string {
  return typeof phrase.id === "string" ? phrase.id : "";
}

function sameId(a: unknown, b: unknown): boolean {
  return typeof a === "string" && typeof b === "string" && a !== "" && a.toUpperCase() === b.toUpperCase();
}

export function findWatchVoicePhrase(document: VoiceDocument, id: string): JsonObject | undefined {
  return watchVoicePhrases(document).find((p) => sameId(p.id, id));
}

/** A phrase's name: its label, else its message, else "New phrase". */
export function watchVoicePhraseName(phrase: JsonObject): string {
  return trimmedId(phrase.label) ?? trimmedId(phrase.message) ?? "New phrase";
}

/** Whether the phrase library is full. */
export function watchVoicePhrasesFull(document: VoiceDocument): boolean {
  return watchVoicePhrases(document).length >= WATCH_VOICE_MAX_PHRASES;
}

function withPhrases(document: VoiceDocument, phrases: unknown[]): VoiceDocument {
  return withVoiceKey(document, "phrases", phrases);
}

/** Makes a new phrase id. Upper case, as the phone's encoder writes a UUID. */
export type VoiceIdMaker = () => string;

/**
 * A new phrase at the end of the library, with the table's new phrase values
 * and an empty message and label to fill in. Refused (no id back) when the
 * library is full.
 */
export function addWatchVoicePhrase(document: VoiceDocument, newId: VoiceIdMaker = randomWatchId): { document: VoiceDocument; id?: string } {
  if (watchVoicePhrasesFull(document)) return { document };
  const id = newId().toUpperCase();
  const n = VOICE_KEYS.newPhrase;
  const phrase: JsonObject = {
    color: n.color,
    displayMode: n.displayMode,
    icon: n.icon,
    id,
    label: "",
    message: "",
    targetSpeakers: [...n.targetSpeakers],
  };
  const list = own(document, "phrases");
  return { document: withPhrases(document, Array.isArray(list) ? [...list, phrase] : [phrase]), id };
}

export function removeWatchVoicePhrase(document: VoiceDocument, id: string): VoiceDocument {
  const list = own(document, "phrases");
  if (!Array.isArray(list)) return document;
  const kept = list.filter((p) => !(isJsonObject(p) && sameId(p.id, id)));
  return kept.length === list.length ? document : withPhrases(document, kept);
}

/** The phrase moved to `toIndex` in the library (held to the list). */
export function moveWatchVoicePhrase(document: VoiceDocument, id: string, toIndex: number): VoiceDocument {
  const list = own(document, "phrases");
  if (!Array.isArray(list)) return document;
  const from = list.findIndex((p) => isJsonObject(p) && sameId(p.id, id));
  if (from < 0 || !Number.isInteger(toIndex)) return document;
  const to = Math.max(0, Math.min(list.length - 1, toIndex));
  if (to === from) return document;
  const next = list.slice();
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return withPhrases(document, next);
}

/** The phrase keys the editor shows, in the table's order (not `id`). */
export function watchVoicePhraseFields(): [string, VoiceKeySpec][] {
  return Object.entries(PHRASE_KEYS).filter(([key]) => key !== "id");
}

export function watchVoicePhraseSpec(key: string): VoiceKeySpec | undefined {
  return key === "id" ? undefined : PHRASE_KEYS[key];
}

/** `#RRGGBB`, upper case, from what a color box gives; undefined otherwise.
 * The watch has no opacity, so `#RRGGBBAA` keeps its color only. */
export function normalizeVoiceColor(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const m = /^#?([0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/.exec(value.trim());
  return m ? `#${m[1]!.toUpperCase()}` : undefined;
}

/** Whether a stored phrase color is one the panel's color box can show: a
 * plain `#RRGGBB`. The phone also writes a gradient (`GRADIENT|#..|#..`) and
 * a rainbow (`#RAINBOW`), which are kept until a color is picked. */
export function isPlainVoiceColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
}

/** What a stored phrase color is, in words, for one the color box cannot
 * show. */
export function voiceColorWords(value: unknown): string | undefined {
  if (typeof value !== "string" || /^#[0-9a-fA-F]{6}$/.test(value)) return undefined;
  if (value.toUpperCase() === "#RAINBOW") return "Rainbow";
  if (value.toUpperCase().startsWith("GRADIENT|")) return "Gradient";
  return value;
}

/** The volume mode of a phrase as the watch reads it: absent keeps the
 * speakers' volume. */
export function watchVoicePhraseVolumeMode(phrase: JsonObject): string {
  const mode = phrase.speechVolumeMode;
  const spec = PHRASE_KEYS.speechVolumeMode;
  const values = VOICE_KEYS.enums[spec?.enum ?? ""] ?? [];
  return typeof mode === "string" && values.includes(mode) ? mode : String(spec?.effective?.absent ?? "keepCurrent");
}

/** The volume percent of a phrase as the watch reads it: absent is 70, held
 * to 0 to 100. */
export function watchVoicePhraseVolumePercent(phrase: JsonObject): number {
  const v = VOICE_KEYS.volume;
  const stored = phrase.speechVolumePercent;
  return typeof stored === "number" && Number.isFinite(stored) ? Math.min(v.max, Math.max(v.min, Math.round(stored))) : v.default;
}

/**
 * One phrase key written as the phone writes it, or undefined when the value
 * is refused. `undefined` removes an optional key. Text keys take the text as
 * typed; an icon is a name that is not blank; a color a `#RRGGBB`; an enum a
 * value the table names; the speakers a list of ids; an engine or language
 * that is blank is none; the volume a whole number from 0 to 100. Keep
 * Current, which an absent mode means, removes the mode.
 */
export function writeWatchVoicePhraseKey(phrase: JsonObject, key: string, value: unknown): JsonObject | undefined {
  const spec = watchVoicePhraseSpec(key);
  if (spec === undefined) return undefined;
  if (value === undefined || value === null) {
    if (spec.required === true) return undefined;
    return withoutVoiceKey(phrase, key);
  }
  let v: unknown = value;
  switch (spec.type) {
    case "string":
      if (typeof value !== "string") return undefined;
      if (spec.optional === true) {
        const t = value.trim();
        if (t === "") return withoutVoiceKey(phrase, key);
        v = t;
      }
      break;
    case "symbol":
      if (typeof value !== "string" || value.trim() === "") return undefined;
      v = value.trim();
      break;
    case "color":
      v = normalizeVoiceColor(value);
      if (v === undefined) return undefined;
      break;
    case "enum": {
      if (typeof value !== "string" || !(VOICE_KEYS.enums[spec.enum ?? ""] ?? []).includes(value)) return undefined;
      if (spec.optional === true && spec.effective?.absent === value) return withoutVoiceKey(phrase, key);
      break;
    }
    case "entity": {
      if (typeof value !== "string") return undefined;
      const t = value.trim();
      if (t === "") return spec.optional === true ? withoutVoiceKey(phrase, key) : withVoiceKey(phrase, key, "");
      v = t;
      break;
    }
    case "array":
      if (!Array.isArray(value) || !value.every((s) => typeof s === "string")) return undefined;
      v = [...new Set((value as string[]).map((s) => s.trim()).filter((s) => s !== ""))];
      break;
    case "int": {
      if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
      const [min, max] = spec.effective?.clamp ?? [-Infinity, Infinity];
      v = Math.min(max, Math.max(min, Math.round(value)));
      break;
    }
    default:
      return undefined;
  }
  return withVoiceKey(phrase, key, v);
}

/** One key of one phrase set (`writeWatchVoicePhraseKey`). The document when
 * the phrase is missing or the value refused or the same. */
export function setWatchVoicePhraseKey(document: VoiceDocument, id: string, key: string, value: unknown): VoiceDocument {
  const list = own(document, "phrases");
  if (!Array.isArray(list)) return document;
  const index = list.findIndex((p) => isJsonObject(p) && sameId(p.id, id));
  if (index < 0) return document;
  const phrase = list[index] as JsonObject;
  const next = writeWatchVoicePhraseKey(phrase, key, value);
  if (next === undefined || next === phrase) return document;
  const phrases = list.slice();
  phrases[index] = next;
  return withPhrases(document, phrases);
}

/** A speaker ticked or unticked in a phrase's own speakers. */
export function toggleWatchVoicePhraseSpeaker(document: VoiceDocument, id: string, entityId: string, on: boolean): VoiceDocument {
  const phrase = findWatchVoicePhrase(document, id);
  if (phrase === undefined) return document;
  const stored = stringList(phrase.targetSpeakers);
  if (on === stored.includes(entityId)) return document;
  return setWatchVoicePhraseKey(document, id, "targetSpeakers", on ? [...stored, entityId] : stored.filter((s) => s !== entityId));
}

/** What a phrase is missing that the phone asks for before it saves one: a
 * message, a label. Empty when nothing is. */
export function watchVoicePhraseMissing(phrase: JsonObject): string[] {
  return VOICE_KEYS.newPhrase.required.filter((key) => trimmedId(phrase[key]) === undefined);
}

/** Whether a phrase holds a value away from a new phrase's for any of its
 * own speakers, engine, language or volume: the Speech card's dot. */
export function watchVoicePhraseRouted(phrase: JsonObject): boolean {
  return stringList(phrase.targetSpeakers).length > 0 || trimmedId(phrase.ttsEngine) !== undefined
    || trimmedId(phrase.language) !== undefined || watchVoicePhraseVolumeMode(phrase) !== "keepCurrent";
}

// ── before a save ────────────────────────────────────────────────────────

/**
 * What Home Assistant's shape check (`_check_voice` in
 * `watch_config_store.py`) refuses, in plain words, so a save that cannot
 * land is not sent; and what the phone asks for before it keeps a phrase (a
 * message and a label). Empty when nothing is wrong.
 */
export function checkWatchVoice(document: unknown): string[] {
  if (!isJsonObject(document)) return ["The voice settings are not an object."];
  const problems: string[] = [];
  const phrases = own(document, "phrases");
  if (!Array.isArray(phrases)) {
    problems.push("The phrases are not a list.");
  } else {
    if (phrases.length > WATCH_VOICE_MAX_PHRASES) problems.push(`There are ${phrases.length} phrases. The watch takes at most ${WATCH_VOICE_MAX_PHRASES}.`);
    const seen = new Set<string>();
    let unnamed = false;
    for (const p of phrases) {
      if (!isJsonObject(p) || typeof p.id !== "string" || p.id === "") {
        problems.push("A phrase has no id.");
        break;
      }
      const folded = p.id.toUpperCase();
      if (seen.has(folded)) {
        problems.push("Two phrases share an id.");
        break;
      }
      seen.add(folded);
      if (watchVoicePhraseMissing(p).length > 0) unnamed = true;
    }
    if (unnamed) problems.push("Every phrase needs a message and a label.");
  }
  if (Object.hasOwn(document, "defaultSpeakers") && !(Array.isArray(document.defaultSpeakers) && document.defaultSpeakers.every((s) => typeof s === "string"))) {
    problems.push("The default speakers are not a list of names.");
  }
  if (Object.hasOwn(document, "defaultTTSEngine") && typeof document.defaultTTSEngine !== "string") problems.push("The text to speech engine is not a name.");
  return problems;
}

// ── no record ────────────────────────────────────────────────────────────

export const WATCH_VOICE_NO_RECORD_TITLE = "No voice settings from this watch yet.";

/** The no-record line when no iPhone will send voice settings. */
export const WATCH_VOICE_NO_RECORD_TEXT = "Start with the defaults to begin.";

export const WATCH_VOICE_START_BUTTON = "Start with the defaults";

export const WATCH_VOICE_PAIR_FIRST_TEXT = "Pair this watch first.";

export const WATCH_VOICE_UPDATE_TEXT = "Update the integration to edit voice settings here.";

/** The Watch voice picker's line when the watch has sent no voices. */
export const WATCH_VOICES_EMPTY_TEXT = "This watch has not sent its voices yet. Open Wrist Assistant on the watch.";

/** Whether a failed read of the voice settings means this integration does
 * not keep them: one older than the kind refuses it as `invalid`, one older
 * than the store does not know the command. */
export function watchVoiceReadMeansUnsupported(error: unknown): boolean {
  const code = watchCommandError(error).code;
  return code === "invalid" || code === "unknown_command";
}
