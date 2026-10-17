// Linked phrases: one phrase library on several watches.
//
// A watch's phrases and the defaults they fall back to (the conversation
// agent, the text to speech engine, the speakers) link as one unit: Home
// Assistant copies them onto another watch and marks both documents with a
// top-level `linkIds` that maps the unit, `phrases`, to its link id. Every
// save of one copy is then written to the others by Home Assistant itself,
// so the editor saves its own watch as always. The watch's own speech
// settings (Speak even in Silent Mode, the watch voice) never travel: a voice
// is installed on one watch. Only watches hold voice, so no iPhone is ever a
// target.
//
// Unlinking is an ordinary save: the watch's copy saved without the link
// keeps its phrases and stops following the others. A link left on one
// watch only is dropped there by Home Assistant.
//
// This module is the pure part the voice editor draws from: which watches
// hold the phrases, the switches of the Devices menu, the badge on the
// Phrases card, when a tick must ask before it replaces a watch's own
// phrases, Start fresh, and the one write the panel makes on another watch
// (unlinking it). Server side: `page_links.py`, `LINK_UNITS["voice"]`.

import type { WatchConfigRecord, WatchUnitPlace } from "../ha-api.js";
import { type LinkDevice, type PageDevicePlace, joinWords } from "../watch-pages/links.js";
import { isJsonObject } from "../watch-pages/model.js";
import { watchCommandError } from "../watch-pages/save-note.js";
import { WAIT_FOR_IPHONE_TEXT } from "../watch-settings.js";
import { type VoiceDocument, asWatchVoiceDocument, watchVoiceDefaults, watchVoicePhrases, withVoiceKey, withoutVoiceKey } from "./model.js";

/** The top-level key Home Assistant writes the link ids under. */
export const VOICE_LINK_IDS_KEY = "linkIds";

/** The one unit a watch's voice settings link as. */
export const VOICE_PHRASES_UNIT = "phrases";

/** The keys the unit carries, as `page_links.LINK_UNITS["voice"]` names
 * them: the phrase library and the defaults a phrase or a slot falls back
 * to, so a linked phrase plays the same on every watch. */
export const VOICE_PHRASES_UNIT_KEYS: readonly string[] = ["defaultAssistAgentId", "defaultSpeakers", "defaultTTSEngine", "phrases"];

/** The watch's own speech settings, which stay on each watch
 * (`page_links.UNIT_DEVICE_KEYS["voice"]`). */
export const VOICE_WATCH_OWN_KEYS: readonly string[] = ["watchSpeakReplyInSilentMode", "watchSpeechVoiceIdentifier"];

/** The unit's name in the editor. */
export const VOICE_PHRASES_UNIT_NAME = "Phrases and defaults";

/** The phrases' link id, or undefined for phrases on this watch alone. */
export function voicePhrasesLinkId(document: VoiceDocument | undefined): string | undefined {
  const ids = document?.[VOICE_LINK_IDS_KEY];
  const link = isJsonObject(ids) ? ids[VOICE_PHRASES_UNIT] : undefined;
  return typeof link === "string" && link !== "" ? link : undefined;
}

/** The voice links of a `watch_pages/places` reply, or undefined from an
 * integration that does not link voice (no Devices menu then). Entries that
 * are not a unit with owners are skipped. */
export function voiceLinkPlaces(reply: unknown): Record<string, WatchUnitPlace> | undefined {
  const voice = isJsonObject(reply) ? reply.voice : undefined;
  if (!isJsonObject(voice)) return undefined;
  const out: Record<string, WatchUnitPlace> = {};
  for (const [link, place] of Object.entries(voice)) {
    if (!isJsonObject(place) || typeof place.unit !== "string" || !Array.isArray(place.owners)) continue;
    out[link] = { unit: place.unit, owners: place.owners.filter((o): o is string => typeof o === "string") };
  }
  return out;
}

/**
 * The watches that hold the phrases, `here` first: for linked phrases every
 * watch `places` lists for the link, for any other only `here`. `places`
 * undefined (not read yet, or an integration without voice links) knows of
 * no other watch.
 */
export function voicePhrasesHolders(document: VoiceDocument | undefined, here: string, places: Readonly<Record<string, WatchUnitPlace>> | undefined): string[] {
  const link = voicePhrasesLinkId(document);
  const listed = link === undefined ? [] : (places?.[link]?.owners ?? []);
  return [here, ...listed.filter((id) => id !== here)];
}

/** The switch of the watch the editor is on, which never goes off. */
export const VOICE_DEVICES_HERE_TEXT = "These are this watch's phrases. Switch off another watch to unlink it.";
/** A watch that waits for its iPhone. */
export const VOICE_DEVICES_WAIT_TEXT = `${WAIT_FOR_IPHONE_TEXT} Phrases can go on this watch after that.`;
export const VOICE_DEVICES_WAIT_TAG = "waiting for iPhone";

/** The Devices menu's head and foot. */
export const VOICE_DEVICES_HEAD = "Phrases and defaults are on";
export const VOICE_DEVICES_NOTE = "On means the watch has these phrases and defaults. An edit on one watch shows on all of them. Each watch keeps its own watch voice and Silent Mode setting.";

/** A switch's hover text. */
export function voiceDeviceTitle(place: PageDevicePlace): string {
  const name = place.device.name;
  return place.on
    ? `Unlink ${name}. It keeps a copy of the phrases as they are now.`
    : `Put them on ${name}. An edit on one watch then shows on both.`;
}

/**
 * The Devices menu for the phrases: a switch per watch (the devices handed
 * in are the watches; an iPhone keeps no phrases), on where they are. The
 * watch the editor is on cannot be switched off. A watch in `waiting`
 * (`awaitingMove` with its voice records) cannot take them yet.
 */
export function voiceDevicePlaces(
  devices: readonly LinkDevice[],
  document: VoiceDocument | undefined,
  here: string,
  places: Readonly<Record<string, WatchUnitPlace>> | undefined,
  waiting: ReadonlySet<string> = new Set(),
): PageDevicePlace[] {
  const holders = new Set(voicePhrasesHolders(document, here, places));
  return devices.filter((d) => d.kind === "watch").map((device) => {
    const isHere = device.ownerId === here;
    const on = holders.has(device.ownerId);
    if (isHere) return { device, on: true, here: true, stuck: VOICE_DEVICES_HERE_TEXT };
    if (!on && waiting.has(device.ownerId)) return { device, on, here: false, stuck: VOICE_DEVICES_WAIT_TEXT, tag: VOICE_DEVICES_WAIT_TAG };
    return { device, on, here: false };
  });
}

/** The small badge on the Phrases card: "Also on Jesse's Watch", or "On 3
 * watches" once there are more than two. Undefined for phrases on this
 * watch alone. */
export function voiceLinkBadgeText(holders: readonly string[], here: string, devices: readonly LinkDevice[]): string | undefined {
  const others = holders.filter((id) => id !== here);
  if (others.length === 0) return undefined;
  if (others.length === 1) {
    const name = devices.find((d) => d.ownerId === others[0])?.name;
    return name === undefined ? "On 2 watches" : `Also on ${name}`;
  }
  return `On ${holders.length} watches`;
}

/** The badge's hover text: every watch named. */
export function voiceLinkBadgeTitle(holders: readonly string[], here: string, devices: readonly LinkDevice[]): string | undefined {
  const others = holders.filter((id) => id !== here);
  if (others.length === 0) return undefined;
  const names = others.map((id) => devices.find((d) => d.ownerId === id)?.name ?? "another watch");
  return `Also on ${joinWords(names)}. An edit here shows there too.`;
}

/**
 * Whether a tick onto `target` writes over phrases of its own, and so asks
 * first: it holds a voice document with phrases, or with a phrase link of
 * its own, and is not on `linkId` already. Home Assistant refuses such a
 * link (`unit_taken`) unless it is sent with `replace`. A target with no
 * voice document, or none read, asks nothing.
 */
export function voiceLinkNeedsReplace(target: VoiceDocument | undefined, linkId: string | undefined): boolean {
  if (target === undefined) return false;
  const own = voicePhrasesLinkId(target);
  if (own !== undefined && own === linkId) return false;
  return own !== undefined || watchVoicePhrases(target).length > 0;
}

/** The question before such a tick. */
export function voiceReplaceQuestion(name: string): string {
  return `Replace the phrases on ${name}? Its own are lost.`;
}

/** What a tick that replaced a watch's own phrases says it left there. */
export const VOICE_REPLACE_KEEPS_TEXT = "Its watch voice and Silent Mode setting stay as they were.";

/** A link refusal in the editor's words. */
export function voiceLinkErrorText(err: unknown): string {
  const { code, message } = watchCommandError(err);
  switch (code) {
    case "unknown_device": return "That watch is not paired with this Home Assistant any more.";
    case "not_found": return "This watch's voice settings are not saved yet. Save first, then try again.";
    case "unit_taken": return "That watch has phrases of its own.";
    case "not_for_iphone": return "An iPhone keeps no phrases.";
    case "awaiting_move": return `${WAIT_FOR_IPHONE_TEXT} Try again after that.`;
    case "unknown_command": return "This version of the integration cannot share phrases between watches. Update it first.";
    default: return message;
  }
}

/** The document without its phrase link, the `linkIds` key gone once it
 * holds nothing else. The document itself when it had none. */
export function withoutVoicePhrasesLink(document: VoiceDocument): VoiceDocument {
  const ids = document[VOICE_LINK_IDS_KEY];
  if (!isJsonObject(ids) || !Object.hasOwn(ids, VOICE_PHRASES_UNIT)) return document;
  const { [VOICE_PHRASES_UNIT]: _gone, ...rest } = ids;
  return Object.keys(rest).length === 0 ? withoutVoiceKey(document, VOICE_LINK_IDS_KEY) : withVoiceKey(document, VOICE_LINK_IDS_KEY, rest);
}

/**
 * Start fresh: the phrases and their defaults back to a new watch's (no
 * phrases, no agent, no engine, no speakers), the watch's own speech
 * settings left alone. With `unlink` the phrase link goes too, so this watch
 * starts alone and the others keep theirs; without it, a save hands the
 * empty library to every linked watch.
 */
export function startFreshVoicePhrases(document: VoiceDocument, unlink = false): VoiceDocument {
  const defaults = watchVoiceDefaults();
  let next = document;
  for (const key of VOICE_PHRASES_UNIT_KEYS) {
    next = Object.hasOwn(defaults, key) ? withVoiceKey(next, key, defaults[key]) : withoutVoiceKey(next, key);
  }
  return unlink ? withoutVoicePhrasesLink(next) : next;
}

/** Whether Start fresh has anything to do. */
export function voicePhrasesAreFresh(document: VoiceDocument): boolean {
  return startFreshVoicePhrases(document) === document;
}

/** Start fresh's two answers for phrases on several watches, or undefined
 * for phrases on this watch alone, which need no question. */
export function startFreshChoices(holders: readonly string[]): { question: string; here: string; all: string; count: number } | undefined {
  if (holders.length < 2) return undefined;
  return {
    question: `These phrases and defaults are on ${holders.length} watches.`,
    here: "Here only",
    all: `On all ${holders.length} watches`,
    count: holders.length,
  };
}

// ── unlinking another watch ───────────────────────────────────────────────

/** The calls `unlinkVoiceFrom` needs. */
export interface VoiceUnlinkIO {
  read(owner: string): Promise<Pick<WatchConfigRecord, "revision" | "document">>;
  save(owner: string, baseRevision: number, document: VoiceDocument): Promise<{ revision: number }>;
}

/** The most times one unlink is sent before conflicts end it. */
export const VOICE_UNLINK_ATTEMPTS = 3;

export type VoiceUnlinkResult = { ok: true; unlinked: boolean } | { ok: false; code: string; message: string };

/**
 * Unlink another watch's phrases: read its voice settings, save them without
 * the phrase link over the revision read, and read again on a conflict. The
 * phrases stay there as they are. `unlinked` false: it held no link.
 */
export async function unlinkVoiceFrom(io: VoiceUnlinkIO, owner: string): Promise<VoiceUnlinkResult> {
  for (let attempt = 1; ; attempt++) {
    let record: Pick<WatchConfigRecord, "revision" | "document">;
    try {
      record = await io.read(owner);
    } catch (err) {
      const { code = "unknown", message } = watchCommandError(err);
      return { ok: false, code, message };
    }
    const doc = record.revision > 0 ? asWatchVoiceDocument(record.document) : undefined;
    if (doc === undefined) return { ok: true, unlinked: false };
    const next = withoutVoicePhrasesLink(doc);
    if (next === doc) return { ok: true, unlinked: false };
    try {
      await io.save(owner, record.revision, next);
      return { ok: true, unlinked: true };
    } catch (err) {
      const { code = "unknown", message } = watchCommandError(err);
      if (code !== "conflict" || attempt >= VOICE_UNLINK_ATTEMPTS) return { ok: false, code, message };
    }
  }
}
