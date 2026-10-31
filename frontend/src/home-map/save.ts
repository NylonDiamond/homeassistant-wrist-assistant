// One edit of the Home map page saved to Home Assistant, the store's way
// (`home_map_store.py`): the whole map, made from the rev it was read at.
// The iPhone can move pins too, so a save may be refused `conflict`: the map
// is read again, the same edit is put on top of it, and that is saved once
// more. When the edit no longer fits the map read (its room was deleted on
// the iPhone, say), or the second save is refused as well, nothing is saved
// and the page says so, with the map Home Assistant holds now. The change is
// a plain edit (`HomeMapEdit`) or any of the map editor's edits by ids
// (`edit-ops.ts`), which can be made again on the newer map the same way.
//
// The home's first map is saved the same way, from rev 0: before it, the
// edit is made on an empty map (`homeMapEmpty`), so the page's Start a map
// by hand is an ordinary edit that adds a floor.
//
// A save that never reached Home Assistant, or whose answer never came back
// (the socket dropped, Home Assistant restarting, no answer in
// `HOME_MAP_SAVE_TIMEOUT_MS`), is not a refusal: it says `retry`, and the
// session keeps the edit and sends it again. Such a save may have landed
// all the same, so the session names the map it sent (`sent`) on the next
// try; when that try is refused `conflict` and the map read again is the
// one sent, it did land, and is not made a second time on top of itself (a
// room moved by a metre must not move by two).

import type { HassLike } from "../ha-api.js";
import { fetchHomeMap, saveHomeMap } from "../ha-api.js";
import { watchCommandError } from "../watch-pages/save-note.js";
import {
  type HomeMapDocument,
  type HomeMapEdit,
  type HomeMapRead,
  HOME_MAP_VERSION,
  applyHomeMapEdit,
  checkHomeMap,
  homeMapProblemOf,
  homeMapProblemText,
  readHomeMap,
} from "./model.js";

/** The two commands a save uses, so a test can stand them in. */
export interface HomeMapApi {
  get(): Promise<HomeMapRead>;
  save(doc: HomeMapDocument, baseRev: number): Promise<{ rev: number }>;
}

export function homeMapApi(hass: HassLike): HomeMapApi {
  return {
    get: () => fetchHomeMap(hass),
    save: (doc, baseRev) => saveHomeMap(hass, doc, baseRev),
  };
}

/**
 * What a save came to. Saved: the map now held and its rev, and whether it
 * went on top of a map someone else saved meanwhile (`merged`). Not saved:
 * why, in plain words, and the map Home Assistant holds when it was read
 * again along the way, which the page then shows. Not saved yet (`retry`):
 * Home Assistant could not be reached or did not answer, so nothing is
 * known to have changed; `sent` is the map the try sent, if it got that
 * far, for the next try to know it by.
 */
export type HomeMapSaveOutcome =
  | { ok: true; read: { doc: HomeMapDocument; rev: number }; merged: boolean }
  | { ok: false; retry: true; text: string; sent: HomeMapDocument | undefined }
  | { ok: false; retry?: undefined; text: string; read?: HomeMapRead };

/** The line when the map changed on another device and the edit was put on
 * top of it. */
export const HOME_MAP_MERGED_TEXT = "The map had changed on another device. Your change was saved on top of it.";
/** The line when the edit no longer fits the map Home Assistant holds. */
export const HOME_MAP_GONE_TEXT = "The map changed on another device, and your change no longer fits it. It now shows the map as saved there.";
/** The line when the second save was refused too. */
export const HOME_MAP_AGAIN_TEXT = "The map changed again while saving, so your change was not saved. Try it once more.";
/** The line while a save waits to be sent again. */
export const HOME_MAP_RETRY_TEXT = "Not saved yet. Trying again.";

/** How long a save may wait for Home Assistant's answer before it counts as
 * not sent. A socket that drops mid save can leave the answer pending until
 * it reconnects, which may be never. */
export const HOME_MAP_SAVE_TIMEOUT_MS = 20_000;

/** The map before the home's first save: no floors. A new one each time,
 * so no edit can change the next one's. */
export function homeMapEmpty(): HomeMapDocument {
  return { v: HOME_MAP_VERSION, floors: [] };
}

/** The refusals that mean the save never got to Home Assistant's store, so
 * sending it again is right: `unavailable` (the integration is starting, or
 * Home Assistant is restarting) and a save that timed out here. */
const RETRY_CODES: ReadonlySet<string> = new Set(["unavailable", "timeout"]);

/**
 * Whether a save that failed with `err` should be sent again rather than
 * given up: anything Home Assistant did not refuse in words. A refusal from
 * the integration always has a code (`conflict`, `invalid`, `too_large`,
 * `unauthorized`); the socket library's own failures (`Connection lost`,
 * code 3) carry a number, and a socket that is closed throws a plain error
 * with none.
 */
export function homeMapSaveCanRetry(err: unknown): boolean {
  const code = watchCommandError(err).code;
  return code === undefined || RETRY_CODES.has(code);
}

/**
 * A refusal from Home Assistant in plain words, for the page, starting "Not
 * saved." The code and the store's own message, with its path into the map,
 * go to the console, so a bug can still be traced. `doc` is the map that
 * was sent, by which an `invalid` refusal names the room or device it is
 * about. The codes are the store's (`invalid`, `too_large`, `conflict`,
 * `unavailable`), the socket API's for a connection with no user
 * (`unauthorized`) and for a message it could not read (`invalid_format`),
 * `unknown_command` from an integration too old to save maps, and Home
 * Assistant's own catch-alls.
 */
export function homeMapRefusalText(err: unknown, doc?: HomeMapDocument): string {
  const { code, message } = watchCommandError(err);
  console.warn(`Home map: Home Assistant refused the save (${code ?? "no code"}): ${message}`);
  switch (code) {
    case "invalid": {
      const { path, problem } = homeMapProblemOf(message);
      return `Not saved. ${homeMapProblemText(doc, path, problem)}`;
    }
    case "too_large":
      return "Not saved. The map is too big to save. Take out some rooms or things.";
    case "conflict":
      return HOME_MAP_AGAIN_TEXT;
    case "unauthorized":
      return "Not saved. Home Assistant did not let this login save the map. Sign in again and try once more.";
    case "invalid_format":
      return "Not saved. Home Assistant could not read the map sent. Reload the page and try again.";
    case "unknown_command":
      return "Not saved. Update the Wrist Assistant integration to save the map here.";
    case "unavailable":
    case "timeout":
      return "Not saved. Home Assistant could not be reached. Try again in a moment.";
    default:
      return "Not saved. Home Assistant did not take the change. Try again.";
  }
}

/** Why the map could not be read, in plain words, as `homeMapRefusalText`
 * says why it could not be saved, the code and message going to the
 * console. */
export function homeMapReadFailText(err: unknown): string {
  const { code, message } = watchCommandError(err);
  console.warn(`Home map: the map could not be read (${code ?? "no code"}): ${message}`);
  switch (code) {
    case "unauthorized":
      return "Home Assistant did not let this login read it. Sign in again.";
    case "unavailable":
      return "Wrist Assistant is still starting. Try again in a moment.";
    case undefined:
      return "Home Assistant could not be reached. Check the connection and try again.";
    default:
      return "Home Assistant could not send it. Try again.";
  }
}

function read(raw: HomeMapRead): HomeMapRead {
  return { doc: readHomeMap(raw?.doc) ?? null, rev: typeof raw?.rev === "number" ? raw.rev : 0 };
}

/** The text of a map with its keys in one order, so two maps are compared
 * by what they hold. */
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>).filter(([, v]) => v !== undefined).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

/** Whether two maps hold the same. */
export function sameHomeMapDocument(a: HomeMapDocument | null | undefined, b: HomeMapDocument | null | undefined): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  return canonical(a) === canonical(b);
}

/** A save that gives up waiting after `HOME_MAP_SAVE_TIMEOUT_MS`, refused
 * `timeout`. */
function timed<T>(work: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const late = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject({ code: "timeout", message: "Home Assistant did not answer." }), HOME_MAP_SAVE_TIMEOUT_MS);
  });
  return Promise.race([work, late]).finally(() => clearTimeout(timer));
}

/** What a save puts on the map: a plain edit, or a change made by a
 * function of the map that names what it changes by id. */
export type HomeMapChange = HomeMapEdit | ((doc: HomeMapDocument) => HomeMapDocument | undefined);

/** The edit on `doc`, checked as the store checks it; a reason when it
 * cannot be saved. */
function edited(doc: HomeMapDocument, edit: HomeMapChange): { doc: HomeMapDocument } | { text: string } | undefined {
  const next = typeof edit === "function" ? edit(doc) : applyHomeMapEdit(doc, edit);
  if (next === undefined) return undefined;
  const checked = checkHomeMap(next);
  if (checked.ok) return { doc: checked.doc };
  console.warn(`Home map: not saved, as the store would refuse it: ${checked.message}`);
  return { text: `Not saved. ${checked.text}` };
}

/** Save one edit made on `from` (the empty map before the first save), with
 * one more try on top of a newer map after a `conflict`. `sent` is the map
 * an earlier try of this same edit sent without hearing back: found stored,
 * that try landed. */
export async function saveHomeMapEdit(api: HomeMapApi, from: HomeMapRead, edit: HomeMapChange, sent?: HomeMapDocument): Promise<HomeMapSaveOutcome> {
  const first = edited(from.doc ?? homeMapEmpty(), edit);
  if (first === undefined) return { ok: false, text: "That is no longer on the map." };
  if ("text" in first) return { ok: false, text: first.text };
  try {
    const reply = await timed(api.save(first.doc, from.rev));
    return { ok: true, read: { doc: first.doc, rev: reply.rev }, merged: false };
  } catch (err) {
    if (homeMapSaveCanRetry(err)) return { ok: false, retry: true, text: HOME_MAP_RETRY_TEXT, sent: first.doc };
    if (watchCommandError(err).code !== "conflict") return { ok: false, text: homeMapRefusalText(err, first.doc) };
  }
  let now: HomeMapRead;
  try {
    now = read(await timed(api.get()));
  } catch (err) {
    if (homeMapSaveCanRetry(err)) return { ok: false, retry: true, text: HOME_MAP_RETRY_TEXT, sent: sent ?? first.doc };
    return { ok: false, text: `Not saved. The map changed on another device and could not be read again. ${homeMapReadFailText(err)}` };
  }
  // The earlier try that never heard back did land: this edit is in the map
  // already, as it was sent.
  for (const landed of [sent, first.doc]) {
    if (landed !== undefined && now.doc !== null && sameHomeMapDocument(now.doc, landed)) {
      return { ok: true, read: { doc: now.doc, rev: now.rev }, merged: false };
    }
  }
  const again = edited(now.doc ?? homeMapEmpty(), edit);
  if (again === undefined) return { ok: false, text: HOME_MAP_GONE_TEXT, read: now };
  if ("text" in again) return { ok: false, text: again.text, read: now };
  try {
    const reply = await timed(api.save(again.doc, now.rev));
    return { ok: true, read: { doc: again.doc, rev: reply.rev }, merged: true };
  } catch (err) {
    if (homeMapSaveCanRetry(err)) return { ok: false, retry: true, text: HOME_MAP_RETRY_TEXT, sent: again.doc };
    return { ok: false, text: homeMapRefusalText(err, again.doc), read: now };
  }
}
