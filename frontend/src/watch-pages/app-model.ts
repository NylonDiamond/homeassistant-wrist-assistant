// The app kinds of part 3f batch 2 (template, music hub, assist, speak
// message, point control, webhook inbox), without any drawing: the rules the
// page editor, the preview and the settings read about them.
//
// The plumbing first: what the element asks Home Assistant for the whole
// home (is Music Assistant set up, can Home Assistant Cloud speak), which
// templates of the shown page it renders, and which speaker a music hub tile
// shows. Then the edits of the Template, Music, Assist and Speak tasks, the
// lists their pickers offer, the words their rows show, the Pointer
// section's read only switches, the webhook inbox's words and the two save
// warnings: the pure functions of the app's `AppTileRules.swift`.
//
// The setters follow `tile-settings-model.ts`: the raw document, a page id
// and a tile id in, only the objects on the path changed, exactly what the
// phone writes (a new key at its sorted place, a removed key deleted), and
// the document they were given back for a refusal. Every list, word and
// limit comes from `tile-app.json`, the panel's own table; the
// settings case files in `test/fixtures-pages/settings` pin each setter.
// Fetched values come in as plain values.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md, "3f batch 2 build
// contract".

import type { HassEntityState, RenderResult } from "../ha-api.js";
import tileApp from "./tile-app.json";
import { type WatchEditOptions, randomWatchId } from "./edit.js";
import { REMOVE, editTile, isBool, setKey, withKey, withoutKey } from "./tile-settings-model.js";
import { sameWatchPagesJson } from "./merge.js";
import {
  type WatchPage,
  type WatchPageTile,
  type WatchPagesDocument,
  isJsonObject,
  isSmartWatchPage,
  tileEntityId,
  tileKind,
  tileTarget,
  watchInboxFallbackLabel,
  watchPageId,
  watchPageTiles,
  watchPagesOf,
} from "./model.js";
import { watchCapitalized } from "./tile-new.js";

// ── the home ─────────────────────────────────────────────────────────────

/** What the element knows of the home beyond its states, for the Add task
 * and the voice pickers. Each field is undefined until its answer is in,
 * and stays so when the call failed: undefined means "not known", never
 * "no". */
export interface WatchHomeData {
  /** Music Assistant has a config entry here, in any state (the phone's
   * rule: an entry that failed to set up still counts). */
  musicAssistant: boolean | undefined;
  /** Home Assistant Cloud is logged in and connected, so `tts.cloud` is one
   * of the voice engines. */
  cloudTTS: boolean | undefined;
}

/** The Music Assistant integration's domain. */
export const MUSIC_ASSISTANT_DOMAIN = "music_assistant";

/** Whether `config_entries/get` listed an entry of `domain`: any entry, in
 * any state, as the phone counts them. A reply that is no list is none. */
export function watchHasConfigEntry(entries: unknown, domain: string): boolean {
  return Array.isArray(entries) && entries.some((e) => isJsonObject(e) && e.domain === domain);
}

/** Whether `cloud/status` says Home Assistant Cloud can speak: logged in,
 * and its link `connected`. */
export function watchCloudTTSAvailable(status: unknown): boolean {
  return isJsonObject(status) && status.logged_in === true && status.cloud === "connected";
}

// ── template renders ─────────────────────────────────────────────────────

/** How long the preview waits after the shown page's templates change
 * before it asks, and how often it asks again: the watch keeps a rendered
 * value 30 seconds. */
export const WATCH_TEMPLATE_DEBOUNCE_MS = 500;
export const WATCH_TEMPLATE_REFRESH_MS = 30_000;

/** Whether a tile is a template tile (`template.<UUID>`). */
export function isWatchTemplateTile(tile: WatchPageTile): boolean {
  return tileKind(tileEntityId(tile)) === "template";
}

/** A template tile's text as stored, or "" for none. */
export function watchTemplateText(tile: WatchPageTile): string {
  return typeof tile.templateString === "string" ? tile.templateString : "";
}

/**
 * What the preview asks `render_values` for on one page: each template
 * tile's id and text, for every template tile with an id and a text that is
 * not blank (Home Assistant refuses a blank one; the preview draws it
 * without asking). A tile listed twice under one id is asked once, its
 * first text.
 */
export function watchTemplateRequests(page: WatchPage | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  for (const tile of watchPageTiles(page)) {
    if (!isWatchTemplateTile(tile) || typeof tile.id !== "string" || tile.id === "") continue;
    const text = watchTemplateText(tile);
    if (text.trim() === "" || Object.hasOwn(out, tile.id)) continue;
    out[tile.id] = text;
  }
  return out;
}

/** One string for a set of requests: equal exactly when the same tiles ask
 * for the same texts, whatever their order on the page. */
export function watchTemplateSignature(requests: Readonly<Record<string, string>>): string {
  return JSON.stringify(Object.keys(requests).sort().map((id) => [id, requests[id]]));
}

/** One template tile's render with the text it was asked for. */
export interface WatchTemplateRender {
  text: string;
  result: RenderResult;
}

/** The renders after an answer to `requests`: the earlier ones with the
 * answer's laid over them, each with the text it was asked for, so a tile
 * the answer leaves out keeps its last value (shown only while its text is
 * still that one). */
export function watchMergedRenders(
  held: ReadonlyMap<string, WatchTemplateRender>,
  requests: Readonly<Record<string, string>>,
  answer: Readonly<Record<string, RenderResult>>,
): Map<string, WatchTemplateRender> {
  const out = new Map(held);
  for (const [id, result] of Object.entries(answer)) {
    if (!Object.hasOwn(requests, id)) continue;
    if (isJsonObject(result) && (result.ok === true ? typeof result.value === "string" : result.ok === false)) out.set(id, { text: requests[id]!, result });
  }
  return out;
}

/** A template tile's render for its text as it stands, as the watch shows
 * the last value only for the same text: undefined when there is none, or
 * when the last answer was for another text (the tile then draws "..."). */
export function watchTemplateRender(
  renders: ReadonlyMap<string, WatchTemplateRender> | undefined,
  tile: WatchPageTile,
): RenderResult | undefined {
  if (typeof tile.id !== "string") return undefined;
  const held = renders?.get(tile.id);
  return held !== undefined && held.text === watchTemplateText(tile) ? held.result : undefined;
}

// ── music hub ────────────────────────────────────────────────────────────

/** The speaker a music hub tile shows, as the watch picks it. */
export interface WatchMusicHubSpeaker {
  entityId: string;
  state: "playing" | "paused" | "idle";
  /** The media title, when the player has one. */
  title?: string;
  /** The player's `entity_picture` (album art), when it has one. */
  picture?: string;
}

/** A music hub tile's speaker ids as stored: strings only. */
export function watchMusicHubSpeakerIds(tile: WatchPageTile): string[] {
  return Array.isArray(tile.musicHubSpeakerIds) ? tile.musicHubSpeakerIds.filter((id): id is string => typeof id === "string") : [];
}

/**
 * The listed speaker the tile shows: the first that is playing, else the
 * first paused, else the first idle (`SimpleMusicHubTile.activeSpeaker`).
 * A speaker Home Assistant does not have drops out. Undefined when none is
 * in one of those states: the tile is at rest.
 */
export function watchMusicHubActiveSpeaker(
  tile: WatchPageTile,
  states: Readonly<Record<string, HassEntityState>> | undefined,
): WatchMusicHubSpeaker | undefined {
  if (states === undefined) return undefined;
  const players = watchMusicHubSpeakerIds(tile)
    .filter((id) => Object.hasOwn(states, id))
    .map((id) => ({ id, entity: states[id]!, state: String(states[id]!.state ?? "").toLowerCase() }));
  for (const want of ["playing", "paused", "idle"] as const) {
    const found = players.find((p) => p.state === want);
    if (found === undefined) continue;
    const attrs = found.entity.attributes ?? {};
    const out: WatchMusicHubSpeaker = { entityId: found.id, state: want };
    if (typeof attrs.media_title === "string" && attrs.media_title !== "") out.title = attrs.media_title;
    if (typeof attrs.entity_picture === "string" && attrs.entity_picture !== "") out.picture = attrs.entity_picture;
    return out;
  }
  return undefined;
}

// ── the table ────────────────────────────────────────────────────────────

/** A value and the phone's words for it. */
export interface WatchAppChoice {
  value: string;
  label: string;
  /** The longer line under a radio row (Assist Mode, Reply Speaker, Speech
   * Volume). */
  detail?: string;
  /** The help under the Speak tile's Speaker picker. */
  help?: string;
  /** The Speak tile's sliding picker words (Speech Volume). */
  shortLabel?: string;
}

/** One of the template task's example chips. */
export interface WatchTemplatePreset {
  id: string;
  label: string;
  icon: string;
  template: string;
}

/** A point control switch of the `behavior` document. */
interface BehaviorSwitchSpec {
  key: string;
  label: string;
  onDetail: string;
  offDetail: string;
  absent: boolean;
}

interface AppTable {
  version: number;
  template: {
    add: { addPreset: string };
    presets: WatchTemplatePreset[];
    richText: {
      samples: { input: string; segments: ({ icon: string; color: string | null } | { text: string })[] }[];
      colorSamples: { spec: string; color: { name: string } | { hex: string } | null }[];
      colorNames: string[];
    };
  };
  musicHub: {
    groupingBit: number;
    groupingSample: { players: { entityId: string; supportedFeatures: number }[]; speakers: string[] };
    maxPresets: number;
    minSpeakersForPresets: number;
    presetName: string;
    words: Record<
      "albumArt" | "albumArtDetail" | "speakersHeader" | "speakersFooter" | "speakerList" | "noSpeakers" | "addSpeaker" | "presetsHeader" | "presets" | "presetCount" | "addPreset",
      string
    >;
    musicAssistant: { domain: string; title: string; message: string };
  };
  assist: {
    modes: WatchAppChoice[];
    modeAbsent: string;
    replySpeakers: WatchAppChoice[];
    replySpeakerAbsent: string;
    replySpeakerShownWith: string;
    watchSpeakerNote: string;
    listenAbsent: boolean;
    agent: { help: string; useDefault: string };
  };
  speak: {
    outputs: WatchAppChoice[];
    outputAbsent: string;
    watchSpeakerNote: string;
    warnings: { chooseEachTimeEmptyList: string; chooseEachTimeNoEngine: string };
    listenAbsent: boolean;
  };
  voice: {
    volume: {
      min: number;
      max: number;
      step: number;
      absent: number;
      presets: { label: string; value: number }[];
      readSamples: { stored: number | null; shows: number }[];
    };
    volumeModes: WatchAppChoice[];
    volumeModeAbsent: string;
    speakers: {
      countSamples: { ids: string[]; shows: string }[];
      listSamples: { ids: string[]; shows: string }[];
    };
    engine: {
      help: string;
      useDefault: string;
      displaySamples: { tileEngine: string | null; defaultEngine: string; shows: string; configured: boolean }[];
    };
    agentSamples: { tileAgent: string | null; defaultAgent: string; shows: string }[];
    lists: {
      engineSample: {
        states: { entityId: string; friendlyName: string | null }[];
        services: string[];
        cloudOff: { entityId: string; name: string }[];
        cloudOn: { entityId: string; name: string }[];
      };
      announceBit: number;
      speakerSample: { players: { entityId: string; name: string; supportedFeatures: number }[]; order: string[] };
    };
  };
  checks: {
    title: string;
    saveAnyway: string;
    cancel: string;
    messages: Record<"speakOne" | "speakMany" | "assistOne" | "assistMany", string>;
    samples: { name: string; tile: WatchPageTile; speakMissing: boolean; assistMissing: boolean }[];
  };
  pointControl: { switches: BehaviorSwitchSpec[]; readOnlyLine: string };
  webhookInbox: {
    setUpLine: string;
    samples: { entityId: string; customLabel: string | null; topic: string; label: string }[];
  };
}

/** The app tile table as the app wrote it (`tile-app.json`). */
export const WATCH_APP: Readonly<AppTable> = tileApp as unknown as AppTable;
const A = WATCH_APP;

// ── small readers ────────────────────────────────────────────────────────

type Setter<V> = (document: WatchPagesDocument, pageId: string, tileId: string, value: V) => WatchPagesDocument;

function kindOf(tile: WatchPageTile): string {
  return tileKind(tileEntityId(tile));
}

function isKind(kind: string): (tile: WatchPageTile) => boolean {
  return (tile) => kindOf(tile) === kind;
}

const isTemplate = isKind("template");
const isMusicHub = isKind("music_hub");
const isAssist = isKind("assist");
const isSpeak = isKind("speak_message");

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

function index(value: unknown, length: number): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value < length;
}

/** Swift's `trimmingCharacters(in: .whitespacesAndNewlines)`, then nil for
 * blank (`AppTileRules.trimmedId`). */
function trimmedId(value: unknown): string | undefined {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed === "" ? undefined : trimmed;
}

/** A list with one entry moved from `from` to the place of `to`, or
 * undefined when either is out of range or they are the same. */
function moved<T>(list: readonly T[], from: unknown, to: unknown): T[] | undefined {
  if (from === to || !index(from, list.length) || !index(to, list.length)) return undefined;
  const out = list.slice();
  const [item] = out.splice(from, 1);
  out.splice(to, 0, item!);
  return out;
}

/** Text for `{n}`-style holes. */
function fill(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (all, key: string) => (Object.hasOwn(values, key) ? String(values[key]) : all));
}

function friendlyName(states: Readonly<Record<string, HassEntityState>> | undefined, entityId: string): string | undefined {
  const name = states !== undefined && Object.hasOwn(states, entityId) ? states[entityId]?.attributes?.friendly_name : undefined;
  return typeof name === "string" && name.trim() !== "" ? name : undefined;
}

function features(state: HassEntityState | undefined): number {
  const value = state?.attributes?.supported_features;
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

/** Foundation's `localizedCaseInsensitiveCompare`, near enough for names. */
function compareNames(a: string, b: string): number {
  return a.localeCompare(b, undefined, { sensitivity: "accent" });
}

/** The object id with `_` as spaces, in Foundation's `capitalized`. */
function readable(entityId: string, prefix: string): string {
  return watchCapitalized(entityId.replaceAll(prefix, "").replaceAll("_", " "));
}

// ── Template ─────────────────────────────────────────────────────────────

/** The template a new template tile gets: the Home Status preset's text. */
export function watchTemplateAddText(): string {
  return A.template.presets.find((p) => p.id === A.template.add.addPreset)?.template ?? "";
}

/** A preset chip is selected only while the tile's text is the preset's,
 * character for character. */
export function watchTemplatePresetSelected(tile: WatchPageTile, preset: WatchTemplatePreset): boolean {
  return tile.templateString === preset.template;
}

/** The editor: the text as typed, no trim; an emptied editor writes `""`,
 * the key is never removed. */
export function setWatchTemplateText(document: WatchPagesDocument, pageId: string, tileId: string, text: string): WatchPagesDocument {
  if (typeof text !== "string") return document;
  return setKey(document, pageId, tileId, "templateString", (tile) => (isTemplate(tile) ? text : undefined));
}

/** A preset chip: writes the preset's text over the tile's. */
export function setWatchTemplatePreset(document: WatchPagesDocument, pageId: string, tileId: string, presetId: string): WatchPagesDocument {
  const preset = A.template.presets.find((p) => p.id === presetId);
  return preset === undefined ? document : setWatchTemplateText(document, pageId, tileId, preset.template);
}

// ── Music hub ────────────────────────────────────────────────────────────

/** A music hub preset as stored. */
export interface WatchMusicHubPreset {
  id: string;
  name: string;
  speakerIds: string[];
}

/** The players a new music hub lists: every `media_player` with the
 * grouping bit, sorted by entity id; `[]` when there are none. The Music
 * Hub add writes this (`AppTileRules.groupingSpeakers`). */
export function watchMusicHubGroupingSpeakers(states: Readonly<Record<string, HassEntityState>> | undefined): string[] {
  return Object.keys(states ?? {})
    .filter((id) => tileKind(id) === "media_player" && (features(states![id]) & A.musicHub.groupingBit) !== 0)
    .sort();
}

/** The hub's presets as stored: a preset that is no object, or misses a
 * field, reads with what it has. */
export function watchMusicHubPresets(tile: WatchPageTile): WatchMusicHubPreset[] {
  const list = Array.isArray(tile.musicHubGroupPresets) ? tile.musicHubGroupPresets : [];
  return list.map((p) => {
    const o = isJsonObject(p) ? p : {};
    return { id: typeof o.id === "string" ? o.id : "", name: typeof o.name === "string" ? o.name : "", speakerIds: strings(o.speakerIds) };
  });
}

function presetsOf(tile: WatchPageTile): unknown[] {
  return Array.isArray(tile.musicHubGroupPresets) ? tile.musicHubGroupPresets : [];
}

/** The presets written: none removes the key. */
function withPresets(tile: WatchPageTile, presets: unknown[]): WatchPageTile {
  return presets.length === 0 ? withoutKey(tile, "musicHubGroupPresets") : withKey(tile, "musicHubGroupPresets", presets);
}

/** One preset changed by `change`, the rest as stored. */
function editPreset(
  document: WatchPagesDocument,
  pageId: string,
  tileId: string,
  at: number,
  change: (preset: Record<string, unknown>) => Record<string, unknown>,
): WatchPagesDocument {
  return editTile(document, pageId, tileId, (tile) => {
    const presets = presetsOf(tile);
    if (!isMusicHub(tile) || !index(at, presets.length)) return tile;
    const preset = presets[at];
    // A preset that is not an object is left alone rather than rebuilt as a
    // partial one the watch could not read.
    if (!isJsonObject(preset)) return tile;
    const next = presets.slice();
    next[at] = change(preset);
    return withPresets(tile, next);
  });
}

/** "Show Album Art": written true or false, never removed. */
export const setWatchMusicHubAlbumArt: Setter<boolean> = (document, pageId, tileId, on) =>
  isBool(on) ? setKey(document, pageId, tileId, "showAlbumArt", (tile) => (isMusicHub(tile) ? on : undefined)) : document;

/** "Add Speaker": the picks appended in the order given, an id already
 * listed skipped. Unpicking removes nothing. */
export function addWatchMusicHubSpeakers(document: WatchPagesDocument, pageId: string, tileId: string, ids: readonly string[]): WatchPagesDocument {
  return editTile(document, pageId, tileId, (tile) => {
    if (!isMusicHub(tile) || !Array.isArray(ids)) return tile;
    const list = strings(tile.musicHubSpeakerIds);
    for (const id of ids) if (typeof id === "string" && !list.includes(id)) list.push(id);
    return withKey(tile, "musicHubSpeakerIds", list);
  });
}

/** A speaker's remove: the id leaves the list (the last one leaves `[]`)
 * and every preset; presets stay even when emptied. */
export function removeWatchMusicHubSpeaker(document: WatchPagesDocument, pageId: string, tileId: string, at: number): WatchPagesDocument {
  return editTile(document, pageId, tileId, (tile) => {
    const list = strings(tile.musicHubSpeakerIds);
    if (!isMusicHub(tile) || !index(at, list.length)) return tile;
    const [id] = list.splice(at, 1);
    const presets = presetsOf(tile).map((p) =>
      isJsonObject(p) && Array.isArray(p.speakerIds) ? { ...p, speakerIds: p.speakerIds.filter((s) => s !== id) } : p,
    );
    return withPresets(withKey(tile, "musicHubSpeakerIds", list), presets);
  });
}

/** A speaker moved to the place of the row it is dropped on. */
export function moveWatchMusicHubSpeaker(document: WatchPagesDocument, pageId: string, tileId: string, from: number, to: number): WatchPagesDocument {
  return editTile(document, pageId, tileId, (tile) => {
    const list = isMusicHub(tile) ? moved(strings(tile.musicHubSpeakerIds), from, to) : undefined;
    return list === undefined ? tile : withKey(tile, "musicHubSpeakerIds", list);
  });
}

/** "Add Preset" shows while there are fewer than 3 presets and the hub
 * lists 2 or more speakers. */
export function watchMusicHubCanAddPreset(tile: WatchPageTile): boolean {
  return presetsOf(tile).length < A.musicHub.maxPresets && strings(tile.musicHubSpeakerIds).length >= A.musicHub.minSpeakersForPresets;
}

/** The name a new preset gets: "Preset <count + 1>" (it can repeat after a
 * delete). */
export function watchMusicHubPresetName(count: number): string {
  return fill(A.musicHub.presetName, { n: count + 1 });
}

/** "Add Preset": `{id, name, speakerIds: []}` appended, the id a new upper
 * case UUID. Refused while the button would be hidden. */
export function addWatchMusicHubPreset(document: WatchPagesDocument, pageId: string, tileId: string, options?: WatchEditOptions): WatchPagesDocument {
  return editTile(document, pageId, tileId, (tile) => {
    if (!isMusicHub(tile) || !watchMusicHubCanAddPreset(tile)) return tile;
    const presets = presetsOf(tile);
    const id = (options?.newId ?? randomWatchId)().toUpperCase();
    return withPresets(tile, [...presets, { id, name: watchMusicHubPresetName(presets.length), speakerIds: [] }]);
  });
}

/** A preset's remove; no preset left removes the key. */
export function removeWatchMusicHubPreset(document: WatchPagesDocument, pageId: string, tileId: string, at: number): WatchPagesDocument {
  return editTile(document, pageId, tileId, (tile) => {
    const presets = presetsOf(tile);
    if (!isMusicHub(tile) || !index(at, presets.length)) return tile;
    return withPresets(tile, presets.filter((_, i) => i !== at));
  });
}

/** A preset moved to the place of the row it is dropped on. */
export function moveWatchMusicHubPreset(document: WatchPagesDocument, pageId: string, tileId: string, from: number, to: number): WatchPagesDocument {
  return editTile(document, pageId, tileId, (tile) => {
    const presets = isMusicHub(tile) ? moved(presetsOf(tile), from, to) : undefined;
    return presets === undefined ? tile : withPresets(tile, presets);
  });
}

/** A preset's name as typed: no trim, `""` allowed. */
export function renameWatchMusicHubPreset(document: WatchPagesDocument, pageId: string, tileId: string, at: number, name: string): WatchPagesDocument {
  if (typeof name !== "string") return document;
  return editPreset(document, pageId, tileId, at, (p) => (p.name === name ? p : { ...p, name }));
}

/** A speaker's row in an open preset: appended when it is not in the
 * preset, removed when it is; the order is tap order. */
export function toggleWatchMusicHubPresetSpeaker(document: WatchPagesDocument, pageId: string, tileId: string, at: number, speakerId: string): WatchPagesDocument {
  if (typeof speakerId !== "string") return document;
  return editPreset(document, pageId, tileId, at, (p) => {
    const ids = strings(p.speakerIds);
    return { ...p, speakerIds: ids.includes(speakerId) ? ids.filter((s) => s !== speakerId) : [...ids, speakerId] };
  });
}

// ── Assist and Speak ─────────────────────────────────────────────────────

/** The voice tile a key belongs to. */
const VOICE_KEY_KIND: Readonly<Record<string, (tile: WatchPageTile) => boolean>> = {
  assistAgentId: isAssist,
  assistTTSEngine: isAssist,
  assistTargetSpeakerIds: isAssist,
  assistSpeechVolumePercent: isAssist,
  speakMessageTTSEngine: isSpeak,
  speakMessageTargetSpeakerIds: isSpeak,
  speakMessageChooseListSpeakerIds: isSpeak,
  speakMessageSpeechVolumePercent: isSpeak,
};

export type WatchVoiceIdKey = "assistAgentId" | "assistTTSEngine" | "speakMessageTTSEngine";
export type WatchSpeakerListKey = "assistTargetSpeakerIds" | "speakMessageTargetSpeakerIds" | "speakMessageChooseListSpeakerIds";
export type WatchVolumePercentKey = "assistSpeechVolumePercent" | "speakMessageSpeechVolumePercent";

function voiceGate(key: string): ((tile: WatchPageTile) => boolean) | undefined {
  return Object.hasOwn(VOICE_KEY_KIND, key) ? VOICE_KEY_KIND[key] : undefined;
}

/** "Conversation Agent" and "Voice Engine": a pick written trimmed; blank or
 * null (Clear, "Use Default ...") removes the key. */
export function setWatchVoiceId(document: WatchPagesDocument, pageId: string, tileId: string, key: WatchVoiceIdKey, value: string | null): WatchPagesDocument {
  const shows = voiceGate(key);
  if (shows === undefined || (value !== null && typeof value !== "string") || key.endsWith("SpeakerIds")) return document;
  const id = trimmedId(value);
  return setKey(document, pageId, tileId, key, (tile) => (shows(tile) ? (id ?? REMOVE) : undefined));
}

/** A speaker list: the picks sorted by id, without repeats; none removes the
 * key. */
export function setWatchVoiceSpeakers(document: WatchPagesDocument, pageId: string, tileId: string, key: WatchSpeakerListKey, ids: readonly string[]): WatchPagesDocument {
  const shows = voiceGate(key);
  if (shows === undefined || !key.endsWith("SpeakerIds") || !Array.isArray(ids)) return document;
  const sorted = [...new Set(ids.filter((id): id is string => typeof id === "string"))].sort();
  return setKey(document, pageId, tileId, key, (tile) => (shows(tile) ? (sorted.length === 0 ? REMOVE : sorted) : undefined));
}

/** "Target Volume": rounded to a whole percent and held to 0...100. */
export function setWatchVoiceVolume(document: WatchPagesDocument, pageId: string, tileId: string, key: WatchVolumePercentKey, value: number): WatchPagesDocument {
  const shows = voiceGate(key);
  const v = A.voice.volume;
  if (shows === undefined || !key.endsWith("VolumePercent") || typeof value !== "number" || !Number.isFinite(value)) return document;
  const percent = Math.min(v.max, Math.max(v.min, Math.round(value)));
  return setKey(document, pageId, tileId, key, (tile) => (shows(tile) ? percent : undefined));
}

/** A choice key written raw, on the tiles of one kind. */
function choiceSetter(key: string, choices: readonly WatchAppChoice[], shows: (tile: WatchPageTile) => boolean): Setter<string> {
  return (document, pageId, tileId, value) =>
    choices.some((c) => c.value === value) ? setKey(document, pageId, tileId, key, (tile) => (shows(tile) ? value : undefined)) : document;
}

/** A switch written true or false, never removed. */
function boolSetter(key: string, shows: (tile: WatchPageTile) => boolean): Setter<boolean> {
  return (document, pageId, tileId, on) => (isBool(on) ? setKey(document, pageId, tileId, key, (tile) => (shows(tile) ? on : undefined)) : document);
}

/** A choice that also removes a stored `assistReplyOutputMode`, which would
 * otherwise override the visible controls on the watch. */
function assistChoiceSetter(key: string, choices: readonly WatchAppChoice[]): Setter<string> {
  return (document, pageId, tileId, value) => {
    if (!choices.some((c) => c.value === value)) return document;
    return editTile(document, pageId, tileId, (tile) => (isAssist(tile) ? withoutKey(withKey(tile, key, value), "assistReplyOutputMode") : tile));
  };
}

/** "Assist Mode". */
export const setWatchAssistMode = assistChoiceSetter("assistPrimaryAction", A.assist.modes);
/** "Reply Speaker". */
export const setWatchAssistReplySpeaker = assistChoiceSetter("assistSpeakTargetMode", A.assist.replySpeakers);
/** The Speak tile's "Speaker". */
export const setWatchSpeakOutput = choiceSetter("speakMessageOutputMode", A.speak.outputs, isSpeak);
export const setWatchAssistVolumeMode = choiceSetter("assistSpeechVolumeMode", A.voice.volumeModes, isAssist);
export const setWatchSpeakVolumeMode = choiceSetter("speakMessageSpeechVolumeMode", A.voice.volumeModes, isSpeak);
/** "Start Listening Immediately": written true or false, never removed. */
export const setWatchAssistListen = boolSetter("assistImmediateListen", isAssist);
export const setWatchSpeakListen = boolSetter("speakMessageImmediateListen", isSpeak);

/** The slider's value: absent reads 70, a stored value is held to 0...100. */
export function watchShownVolumePercent(stored: unknown): number {
  const v = A.voice.volume;
  return typeof stored === "number" && Number.isFinite(stored) ? Math.min(v.max, Math.max(v.min, stored)) : v.absent;
}

function choiceOr(value: unknown, choices: readonly WatchAppChoice[], absent: string): string {
  return typeof value === "string" && choices.some((c) => c.value === value) ? value : absent;
}

/** An Assist tile's rows as the watch reads them. */
export interface WatchAssistSettings {
  /** The tile's own agent, trimmed. */
  agent: string | undefined;
  /** `assistOnly` or `assistAndSpeakReply`; absent and `speakOnly` read
   * Silent Reply. */
  mode: string;
  replySpeaker: string;
  speakers: string[];
  engine: string | undefined;
  volumeMode: string;
  volumePercent: number;
  listen: boolean;
  /** A stored `assistReplyOutputMode` overrides the mode and the speaker on
   * the watch until an Assist Mode or Reply Speaker edit removes it. */
  replyOutputMode: string | undefined;
}

export function watchAssistSettings(tile: WatchPageTile): WatchAssistSettings {
  return {
    agent: trimmedId(tile.assistAgentId),
    mode: tile.assistPrimaryAction === "assistAndSpeakReply" ? "assistAndSpeakReply" : A.assist.modeAbsent,
    replySpeaker: choiceOr(tile.assistSpeakTargetMode, A.assist.replySpeakers, A.assist.replySpeakerAbsent),
    speakers: strings(tile.assistTargetSpeakerIds),
    engine: trimmedId(tile.assistTTSEngine),
    volumeMode: choiceOr(tile.assistSpeechVolumeMode, A.voice.volumeModes, A.voice.volumeModeAbsent),
    volumePercent: watchShownVolumePercent(tile.assistSpeechVolumePercent),
    listen: isBool(tile.assistImmediateListen) ? tile.assistImmediateListen : A.assist.listenAbsent,
    replyOutputMode: typeof tile.assistReplyOutputMode === "string" ? tile.assistReplyOutputMode : undefined,
  };
}

/** A Speak tile's rows as the watch reads them. */
export interface WatchSpeakSettings {
  output: string;
  speakers: string[];
  watchList: string[];
  engine: string | undefined;
  volumeMode: string;
  volumePercent: number;
  listen: boolean;
}

export function watchSpeakSettings(tile: WatchPageTile): WatchSpeakSettings {
  return {
    output: choiceOr(tile.speakMessageOutputMode, A.speak.outputs, A.speak.outputAbsent),
    speakers: strings(tile.speakMessageTargetSpeakerIds),
    watchList: strings(tile.speakMessageChooseListSpeakerIds),
    engine: trimmedId(tile.speakMessageTTSEngine),
    volumeMode: choiceOr(tile.speakMessageSpeechVolumeMode, A.voice.volumeModes, A.voice.volumeModeAbsent),
    volumePercent: watchShownVolumePercent(tile.speakMessageSpeechVolumePercent),
    listen: isBool(tile.speakMessageImmediateListen) ? tile.speakMessageImmediateListen : A.speak.listenAbsent,
  };
}

// ── words ────────────────────────────────────────────────────────────────

/** An agent's name as the phone's row reads it: the object id made
 * readable, `home_assistant` read as "Home Assistant". */
export function watchAgentName(entityId: string): string {
  const trimmed = entityId.trim();
  if (trimmed === "") return "Home Assistant default";
  const id = trimmed.replaceAll("conversation.", "");
  return id === "home_assistant" ? "Home Assistant" : watchCapitalized(id.replaceAll("_", " "));
}

/** The Conversation Agent row: the tile's agent, else "Global: <the default
 * agent>", else "Home Assistant default". `name` names an agent (the panel
 * passes Home Assistant's friendly names). */
export function watchAgentDisplay(tileAgent: unknown, defaultAgent: string | undefined, name: (id: string) => string = watchAgentName): string {
  const own = trimmedId(tileAgent);
  if (own !== undefined) return name(own);
  const fallback = trimmedId(defaultAgent);
  return fallback !== undefined ? `Global: ${name(fallback)}` : "Home Assistant default";
}

/** An engine's name as the phone reads it: the object id made readable. */
export function watchEngineName(entityId: string): string {
  return readable(entityId, "tts.");
}

/** The Voice Engine row: the tile's engine, else the default engine, else
 * "Not set" (`configured` false: drawn as a warning). */
export function watchEngineDisplay(
  tileEngine: unknown,
  defaultEngine: string | undefined,
  name: (id: string) => string = watchEngineName,
): { text: string; configured: boolean } {
  const engine = trimmedId(tileEngine) ?? trimmedId(defaultEngine);
  return engine === undefined ? { text: "Not set", configured: false } : { text: name(engine), configured: true };
}

/** Assist's Choose Speakers row: "None selected", "1 selected", "<n>
 * selected". The default speakers never count. */
export function watchSpeakerCountSummary(ids: readonly string[]): string {
  if (ids.length === 0) return "None selected";
  return ids.length === 1 ? "1 selected" : `${ids.length} selected`;
}

/** The Speak rows: "None selected", else each speaker by `name` (the
 * phone's: the object id made readable), joined with ", ". */
export function watchSpeakerListSummary(ids: readonly string[], name: (id: string) => string = (id) => readable(id, "media_player.")): string {
  return ids.length === 0 ? "None selected" : ids.map(name).join(", ");
}

// ── lists ────────────────────────────────────────────────────────────────

/** One entry of a voice picker. `missing` marks a stored id the list does
 * not have (a list that did not load, or an entity that is gone). */
export interface WatchVoiceChoice {
  entityId: string;
  name: string;
  missing?: boolean;
}

/** The agents: every `conversation.` state, by name. */
export function watchConversationAgents(states: Readonly<Record<string, HassEntityState>> | undefined): WatchVoiceChoice[] {
  return Object.keys(states ?? {})
    .filter((id) => tileKind(id) === "conversation" && tileTarget(id) !== "")
    .map((id) => ({ entityId: id, name: friendlyName(states, id) ?? watchAgentName(id) }))
    .sort((a, b) => compareNames(a.name, b.name) || (a.entityId < b.entityId ? -1 : 1));
}

/** The voice engines (`AppTileRules.ttsEngines`): every `tts.` state, named
 * by its friendly name, else its id made readable; plus `tts.<platform>`
 * for every `tts` service named `<platform>_say` not listed yet; without
 * `tts.cloud` unless Home Assistant Cloud is logged in and connected.
 * Sorted by name ignoring case, then by id. */
export function watchTTSEngines(
  states: Readonly<Record<string, HassEntityState>> | undefined,
  ttsServices: readonly string[],
  cloudConnected: boolean | undefined,
): WatchVoiceChoice[] {
  const byId = new Map<string, WatchVoiceChoice>();
  for (const id of Object.keys(states ?? {})) {
    if (id.startsWith("tts.")) byId.set(id, { entityId: id, name: friendlyName(states, id) ?? watchEngineName(id) });
  }
  for (const service of ttsServices) {
    if (!service.endsWith("_say")) continue;
    const platform = service.slice(0, -4);
    if (platform === "") continue;
    const id = `tts.${platform}`;
    if (!byId.has(id)) byId.set(id, { entityId: id, name: watchEngineName(id) });
  }
  if (cloudConnected !== true) byId.delete("tts.cloud");
  return [...byId.values()].sort((a, b) => compareNames(a.name, b.name) || (a.entityId < b.entityId ? -1 : a.entityId > b.entityId ? 1 : 0));
}

/** The speakers of the three voice lists: every `media_player`, those with
 * the announce bit first, then by name ignoring case. */
export function watchSpeakerChoices(states: Readonly<Record<string, HassEntityState>> | undefined): (WatchVoiceChoice & { announces: boolean })[] {
  return Object.keys(states ?? {})
    .filter((id) => tileKind(id) === "media_player")
    .map((id) => ({
      entityId: id,
      name: friendlyName(states, id) ?? readable(id, "media_player."),
      announces: (features(states![id]) & A.voice.lists.announceBit) !== 0,
    }))
    .sort((a, b) => (a.announces !== b.announces ? (a.announces ? -1 : 1) : compareNames(a.name, b.name)));
}

/** The music hub's Add Speaker list: the players with the grouping bit,
 * sorted by id, each by its friendly name. */
export function watchMusicHubSpeakerChoices(states: Readonly<Record<string, HassEntityState>> | undefined): WatchVoiceChoice[] {
  return watchMusicHubGroupingSpeakers(states).map((id) => ({ entityId: id, name: friendlyName(states, id) ?? readable(id, "media_player.") }));
}

/** A picker's entries: the list, with a stored id it does not hold added at
 * the end and marked, so a list that failed to load still shows what is
 * stored and nothing blocks. */
export function watchVoiceMenu(choices: readonly WatchVoiceChoice[], stored: readonly string[]): WatchVoiceChoice[] {
  const out = choices.slice();
  for (const id of stored) if (id !== "" && !out.some((c) => c.entityId === id)) out.push({ entityId: id, name: id, missing: true });
  return out;
}

// ── save checks ──────────────────────────────────────────────────────────

/** A Speak tile in Choose Speakers with no speakers, or in Choose on Watch
 * with an empty watch list (absent reads Apple Watch). */
export function watchSpeakTileMissingSpeakers(tile: WatchPageTile): boolean {
  if (!tileEntityId(tile).startsWith("speak_message.")) return false;
  const s = watchSpeakSettings(tile);
  if (s.output === "configuredSpeakers") return s.speakers.length === 0;
  if (s.output === "chooseEachTime") return s.watchList.length === 0;
  return false;
}

/** The Assist tile in Speak Reply with Choose Speakers and no speakers. A
 * Silent Reply tile never counts, whatever its hidden rows hold. */
export function watchAssistTileMissingSpeakers(tile: WatchPageTile): boolean {
  if (tileEntityId(tile) !== "assist.voice_hub") return false;
  const s = watchAssistSettings(tile);
  return s.mode === "assistAndSpeakReply" && s.replySpeaker === "configuredSpeakers" && s.speakers.length === 0;
}

/** The save warning's message for `count` tiles of a kind, the phone's
 * words. */
export function watchMissingSpeakersMessage(kind: "speak" | "assist", count: number): string {
  const m = A.checks.messages;
  const text = kind === "speak" ? (count === 1 ? m.speakOne : m.speakMany) : count === 1 ? m.assistOne : m.assistMany;
  return fill(text, { count });
}

/** A tile a save warning names. */
export interface WatchSpeakerWarningTile {
  kind: "speak" | "assist";
  page: WatchPage;
  tile: WatchPageTile;
  /** A Speak tile in Choose on Watch: it has no fallback, the watch shows
   * an error until its list holds a speaker. */
  chooseOnWatch: boolean;
}

/** The save warning's line for Choose on Watch tiles, which never fall back
 * to the default speakers (the watch says "No watch speaker list configured
 * for this tile."). */
export const WATCH_CHOOSE_ON_WATCH_WARNING_TEXT =
  "A Speak tile set to Choose on Watch shows an error on the watch until speakers are listed for it.";

/** What the save asks about before it sends: the tiles, the phone's
 * messages (Speak first, then Assist), the default speakers the Choose
 * Speakers tiles fall back to when the catalog lists some, and the line for
 * Choose on Watch tiles. */
export interface WatchSaveSpeakerWarning {
  title: string;
  messages: string[];
  tiles: WatchSpeakerWarningTile[];
  /** The phone's default speakers, in its order, which the listed Choose
   * Speakers tiles fall back to; empty when it has none, the catalog cannot
   * say, or every listed tile is a Choose on Watch one. */
  fallback: string[];
  /** `WATCH_CHOOSE_ON_WATCH_WARNING_TEXT` when a listed tile is a Choose on
   * Watch one. */
  chooseOnWatch?: string;
  saveAnyway: string;
  cancel: string;
}

/** The pages a save warning looks at: every page that is new or differs
 * from the page of the same id in `base`, as the phone checks the page it
 * saves. Without a base, every page. */
function changedWatchPages(document: WatchPagesDocument, base: WatchPagesDocument | null | undefined): WatchPage[] {
  const pages = watchPagesOf(document);
  if (base === null || base === undefined) return pages;
  const before = new Map<string, WatchPage>();
  for (const page of watchPagesOf(base)) {
    const id = watchPageId(page);
    if (id !== "" && !before.has(id)) before.set(id, page);
  }
  return pages.filter((page) => {
    const old = before.get(watchPageId(page));
    return old === undefined || (old !== page && !sameWatchPagesJson(old, page));
  });
}

/**
 * The two checks over every tile of the pages a person edited since `base`
 * (a smart page's tiles are made by its rules, and stand in for tiles
 * elsewhere): undefined when no tile trips them. A page left as it was in
 * `base` is never asked about, so a tile someone left that way does not ask
 * on every later save. A warning, never a refusal.
 */
export function watchSaveSpeakerWarning(
  document: WatchPagesDocument,
  voice?: { defaultSpeakers?: readonly string[] },
  base?: WatchPagesDocument | null,
): WatchSaveSpeakerWarning | undefined {
  const tiles: WatchSpeakerWarningTile[] = [];
  const pages = changedWatchPages(document, base);
  for (const kind of ["speak", "assist"] as const) {
    const trips = kind === "speak" ? watchSpeakTileMissingSpeakers : watchAssistTileMissingSpeakers;
    for (const page of pages) {
      if (isSmartWatchPage(page)) continue;
      for (const tile of watchPageTiles(page)) {
        if (!trips(tile)) continue;
        const chooseOnWatch = kind === "speak" && watchSpeakSettings(tile).output === "chooseEachTime";
        tiles.push({ kind, page, tile, chooseOnWatch });
      }
    }
  }
  if (tiles.length === 0) return undefined;
  const count = (kind: "speak" | "assist") => tiles.filter((t) => t.kind === kind).length;
  const messages = (["speak", "assist"] as const).filter((k) => count(k) > 0).map((k) => watchMissingSpeakersMessage(k, count(k)));
  const fallsBack = tiles.some((t) => !t.chooseOnWatch);
  return {
    title: A.checks.title,
    messages,
    tiles,
    fallback: fallsBack ? (voice?.defaultSpeakers?.slice() ?? []) : [],
    ...(tiles.some((t) => t.chooseOnWatch) ? { chooseOnWatch: WATCH_CHOOSE_ON_WATCH_WARNING_TEXT } : {}),
    saveAnyway: A.checks.saveAnyway,
    cancel: A.checks.cancel,
  };
}

/** A warning tile's key, for lists: page id and tile id. */
export function watchSpeakerWarningKey(t: WatchSpeakerWarningTile): string {
  return `${watchPageId(t.page)}:${String(t.tile.id)}`;
}

// ── Point control ────────────────────────────────────────────────────────

/** A point control switch as the `behavior` document holds it. */
export interface WatchPointControlSwitch {
  key: string;
  label: string;
  on: boolean;
  detail: string;
}

/** The Pointer section's two lines: each switch from the `behavior`
 * document, its absent value (off) when the document or the key is
 * missing. Read only: they are watch settings, not tile keys. */
export function watchPointControlSwitches(behavior: unknown): WatchPointControlSwitch[] {
  const doc = isJsonObject(behavior) ? behavior : {};
  return A.pointControl.switches.map((s) => {
    const on = isBool(doc[s.key]) ? (doc[s.key] as boolean) : s.absent;
    return { key: s.key, label: s.label, on, detail: on ? s.onDetail : s.offDetail };
  });
}

// ── Webhook inbox ────────────────────────────────────────────────────────

/** The topic an inbox tile's id names: "All topics", or "#<topic>". */
export function watchInboxTopicWords(entityId: string): string {
  const topic = tileTarget(entityId);
  return topic === "" || topic === "all" ? "All topics" : `#${topic}`;
}

/** The label the watch draws: `customLabel` when set (even empty), else
 * "#<topic>", else "Inbox". */
export function watchInboxLabel(tile: WatchPageTile): string {
  if (typeof tile.customLabel === "string") return tile.customLabel;
  return watchInboxFallbackLabel(tileEntityId(tile));
}

// ── the setters by key ───────────────────────────────────────────────────

/** The setter of every app row that writes one key, by that key (the case
 * files' `set` op). */
export const WATCH_APP_SETTERS: Readonly<Record<string, Setter<never>>> = {
  showAlbumArt: setWatchMusicHubAlbumArt,
  assistSpeechVolumeMode: setWatchAssistVolumeMode,
  assistImmediateListen: setWatchAssistListen,
  speakMessageOutputMode: setWatchSpeakOutput,
  speakMessageSpeechVolumeMode: setWatchSpeakVolumeMode,
  speakMessageImmediateListen: setWatchSpeakListen,
};

/** Every tile key an app setter here writes or removes. */
export const WATCH_APP_SETTING_KEYS: readonly string[] = [
  ...Object.keys(WATCH_APP_SETTERS),
  "templateString",
  "musicHubSpeakerIds",
  "musicHubGroupPresets",
  "assistAgentId",
  "assistPrimaryAction",
  "assistSpeakTargetMode",
  "assistReplyOutputMode",
  "assistTargetSpeakerIds",
  "assistTTSEngine",
  "assistSpeechVolumePercent",
  "speakMessageTargetSpeakerIds",
  "speakMessageChooseListSpeakerIds",
  "speakMessageTTSEngine",
  "speakMessageSpeechVolumePercent",
];
