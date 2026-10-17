// A device tab's own two changes on the Pages and Status pages tabs: Hide
// here (or Show here) and the order. Both are the device's picks, and Home
// Assistant has no library op for them: they are that device's record. So
// each is a save of the device's `pages` (or `status_pages`) record as just
// read, with only `isHidden` or the order changed, over the revision read,
// and read again on a conflict, as taking a page off a device always did
// (`removeListedFrom`). Home Assistant maps the save back onto the picks.
//
// Everything else in the record stays as loaded, the `linkId` keys
// included: a page's own content is never touched here, and a system page
// keeps its place in the list.

import type { WatchConfigRecord } from "../ha-api.js";
import { sameId } from "../library/model.js";
import { asStatusPagesDocument } from "../watch-status-pages/model.js";
import { setWatchPageHidden } from "./edit.js";
import { type JsonObject, asWatchPagesDocument, isJsonObject, isSystemWatchPage } from "./model.js";
import { watchCommandError } from "./save-note.js";
import type { CardKind } from "./all-pages-model.js";

/** One change to a device's picks. `before` names the pick to put `id` in
 * front of, null for the end. */
export type PickChange =
  | { hidden: boolean; id: string }
  | { id: string; before: string | null };

/** The list key of a kind's document. */
function listKey(kind: CardKind): "pages" | "statusPages" {
  return kind === "status_pages" ? "statusPages" : "pages";
}

/** A pick the order moves: any page but a system page, any status page. */
function movable(kind: CardKind, entry: unknown): entry is JsonObject {
  if (!isJsonObject(entry) || typeof entry.id !== "string") return false;
  return kind === "status_pages" ? true : !isSystemWatchPage(entry);
}

/**
 * The document with one change made, or the very same document when it
 * changes nothing (the page is not there, or already so). A move takes the
 * movable entries' places in turn, so a system page, and anything in the
 * list that is not a page, stays where it was.
 */
export function changedPicks(kind: CardKind, document: JsonObject, change: PickChange): JsonObject {
  if ("hidden" in change) {
    // Status pages have no Hide here.
    return kind === "status_pages" ? document : setWatchPageHidden(document, change.id, change.hidden);
  }
  const list = document[listKey(kind)];
  if (!Array.isArray(list)) return document;
  const slots: number[] = [];
  list.forEach((entry, i) => {
    if (movable(kind, entry)) slots.push(i);
  });
  const entries = slots.map((i) => list[i] as JsonObject);
  const from = entries.findIndex((e) => sameId(e.id as string, change.id));
  if (from < 0) return document;
  const moved = entries[from]!;
  const rest = entries.filter((_, i) => i !== from);
  const at = change.before === null ? -1 : rest.findIndex((e) => sameId(e.id as string, change.before as string));
  if (change.before !== null && at < 0) return document;
  const next = at < 0 ? [...rest, moved] : [...rest.slice(0, at), moved, ...rest.slice(at)];
  if (next.every((e, i) => e === entries[i])) return document;
  const out = list.slice();
  slots.forEach((slot, k) => {
    out[slot] = next[k];
  });
  return { ...document, [listKey(kind)]: out };
}

/** The calls `changeDevicePicks` makes. */
export interface PicksIO {
  read(ownerId: string, kind: CardKind): Promise<Pick<WatchConfigRecord, "revision" | "document">>;
  save(ownerId: string, kind: CardKind, baseRevision: number, document: JsonObject): Promise<{ revision: number }>;
}

/** The most times one change is sent before conflicts end it. */
export const PICKS_ATTEMPTS = 3;

export type PicksResult = { ok: true; changed: boolean } | { ok: false; code: string; message: string };

/**
 * Make one change on a device's record: read it, change it, save it over
 * the revision read, and on a conflict read again and make it again. A
 * change that changes nothing is not saved (`changed` false).
 */
export async function changeDevicePicks(io: PicksIO, ownerId: string, kind: CardKind, change: PickChange): Promise<PicksResult> {
  for (let attempt = 1; ; attempt++) {
    let record: Pick<WatchConfigRecord, "revision" | "document">;
    try {
      record = await io.read(ownerId, kind);
    } catch (err) {
      const { code = "unknown", message } = watchCommandError(err);
      return { ok: false, code, message };
    }
    const doc = record.revision > 0
      ? (kind === "status_pages" ? asStatusPagesDocument(record.document) : asWatchPagesDocument(record.document))
      : undefined;
    if (doc === undefined) return { ok: true, changed: false };
    const next = changedPicks(kind, doc, change);
    if (next === doc) return { ok: true, changed: false };
    try {
      await io.save(ownerId, kind, record.revision, next);
      return { ok: true, changed: true };
    } catch (err) {
      const { code = "unknown", message } = watchCommandError(err);
      if (code !== "conflict" || attempt >= PICKS_ATTEMPTS) return { ok: false, code, message };
    }
  }
}

/** What a change says when the device's editor holds unsaved edits: the
 * save would land under them. */
export function picksDirtyText(kind: CardKind, name: string): string {
  return kind === "status_pages"
    ? `${name}'s status pages have unsaved edits. Save or discard them first.`
    : `${name}'s pages have unsaved edits. Save or discard them first.`;
}
