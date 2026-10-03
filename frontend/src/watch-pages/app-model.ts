// The app kinds of part 3f batch 2 (template, music hub, assist, speak
// message, point control, webhook inbox), without any drawing: the rules the
// page editor, the preview and the settings read about them.
//
// This first part is the plumbing: what the element asks Home Assistant for
// the whole home (is Music Assistant set up, can Home Assistant Cloud speak),
// which templates of the shown page it renders, and which speaker a music
// hub tile shows. Fetched values come in as plain values.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md, "3f batch 2 build
// contract".

import type { HassEntityState, RenderResult } from "../ha-api.js";
import { type WatchPage, type WatchPageTile, isJsonObject, tileEntityId, tileKind, watchPageTiles } from "./model.js";

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

/** The renders after an answer: the earlier ones with the answer's laid
 * over them, so a tile the answer leaves out keeps its last value. */
export function watchMergedRenders(
  held: ReadonlyMap<string, RenderResult>,
  answer: Readonly<Record<string, RenderResult>>,
): Map<string, RenderResult> {
  const out = new Map(held);
  for (const [id, result] of Object.entries(answer)) {
    if (isJsonObject(result) && (result.ok === true ? typeof result.value === "string" : result.ok === false)) out.set(id, result);
  }
  return out;
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
