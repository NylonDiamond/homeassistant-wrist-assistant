// One edit of the Home map page saved to Home Assistant, the store's way
// (`home_map_store.py`): the whole map, made from the rev it was read at.
// The iPhone can move pins too, so a save may be refused `conflict`: the map
// is read again, the same edit is put on top of it, and that is saved once
// more. When the edit no longer fits the map read (its room was deleted on
// the iPhone, say), or the second save is refused as well, nothing is saved
// and the page says so, with the map Home Assistant holds now.

import type { HassLike } from "../ha-api.js";
import { fetchHomeMap, saveHomeMap } from "../ha-api.js";
import { watchCommandError } from "../watch-pages/save-note.js";
import { type HomeMapDocument, type HomeMapEdit, type HomeMapRead, applyHomeMapEdit, checkHomeMap, readHomeMap } from "./model.js";

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
 * again along the way, which the page then shows.
 */
export type HomeMapSaveOutcome =
  | { ok: true; read: { doc: HomeMapDocument; rev: number }; merged: boolean }
  | { ok: false; text: string; read?: HomeMapRead };

/** The line when the map changed on another device and the edit was put on
 * top of it. */
export const HOME_MAP_MERGED_TEXT = "The map had changed on another device. Your change was saved on top of it.";
/** The line when the edit no longer fits the map Home Assistant holds. */
export const HOME_MAP_GONE_TEXT = "The map changed on another device, and your change no longer fits it. It now shows the map as saved there.";
/** The line when the second save was refused too. */
export const HOME_MAP_AGAIN_TEXT = "The map changed again while saving, so your change was not saved. Try it once more.";

function read(raw: HomeMapRead): HomeMapRead {
  return { doc: readHomeMap(raw?.doc) ?? null, rev: typeof raw?.rev === "number" ? raw.rev : 0 };
}

/** The edit on `doc`, checked as the store checks it; a reason when it
 * cannot be saved. */
function edited(doc: HomeMapDocument, edit: HomeMapEdit): { doc: HomeMapDocument } | { text: string } | undefined {
  const next = applyHomeMapEdit(doc, edit);
  if (next === undefined) return undefined;
  const checked = checkHomeMap(next);
  return checked.ok ? { doc: checked.doc } : { text: `Not saved. ${checked.message}.` };
}

/** Save one edit made on `from`, with one more try on top of a newer map
 * after a `conflict`. */
export async function saveHomeMapEdit(api: HomeMapApi, from: HomeMapRead, edit: HomeMapEdit): Promise<HomeMapSaveOutcome> {
  if (from.doc === null) return { ok: false, text: "There is no map to change yet." };
  const first = edited(from.doc, edit);
  if (first === undefined) return { ok: false, text: "That is no longer on the map." };
  if ("text" in first) return { ok: false, text: first.text };
  try {
    const reply = await api.save(first.doc, from.rev);
    return { ok: true, read: { doc: first.doc, rev: reply.rev }, merged: false };
  } catch (err) {
    const { code, message } = watchCommandError(err);
    if (code !== "conflict") return { ok: false, text: `Not saved. ${message}` };
  }
  let now: HomeMapRead;
  try {
    now = read(await api.get());
  } catch (err) {
    return { ok: false, text: `Not saved. The map changed on another device and could not be read again: ${watchCommandError(err).message}` };
  }
  const again = now.doc === null ? undefined : edited(now.doc, edit);
  if (again === undefined) return { ok: false, text: HOME_MAP_GONE_TEXT, read: now };
  if ("text" in again) return { ok: false, text: again.text, read: now };
  try {
    const reply = await api.save(again.doc, now.rev);
    return { ok: true, read: { doc: again.doc, rev: reply.rev }, merged: true };
  } catch (err) {
    const { code, message } = watchCommandError(err);
    return { ok: false, text: code === "conflict" ? HOME_MAP_AGAIN_TEXT : `Not saved. ${message}`, read: now };
  }
}
