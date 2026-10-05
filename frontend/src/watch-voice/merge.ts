// The three-way merge of the watch's voice settings.
//
// The grain is the document's top-level keys (the agent, the engine, the
// speakers, the two watch settings, any key a newer app adds), each one
// value, except `phrases`, which is matched by phrase id: menus point at a
// phrase by its id, so a phrase one side added and another the other side
// changed must both survive. A key or a phrase the local side changed since
// the base keeps the local value; everything else takes the server's. The
// iPhone runs the same rule (`WatchConfigMirror`, `.mergeByKey` with the
// phrases by id) with itself as the local side; in the panel the local side
// is the draft.
//
// Phrases, in detail:
// - A phrase both sides hold is local's when local changed it since the
//   base, else the server's. A phrase is one value: no merge inside it.
// - A phrase one side deleted is gone when the other side left it as it was
//   in the base, and stays, as that side has it, when that side changed it.
// - A phrase only one side added stays.
// - Order: local's when local moved the phrases it shares with the base,
//   with what only the server holds after it; else the server's, with what
//   only local holds after it.
// - Ids compare ignoring case, as the phone's `UUID(uuidString:)` reads
//   them. A list with a phrase that has no id, or two phrases with one id,
//   cannot be matched and is one value again.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 2 build
// contract", item 6).

import { mergeWatchPagesByKey, sameWatchPagesJson } from "../watch-pages/merge.js";
import { type JsonObject, isJsonObject } from "../watch-pages/model.js";
import type { VoiceDocument } from "./model.js";

const PHRASES = "phrases";

function own(object: JsonObject | null | undefined, key: string): unknown {
  return object !== null && object !== undefined && Object.hasOwn(object, key) ? object[key] : undefined;
}

/** The phrases by upper-case id, in order; undefined when the value is not a
 * list of objects with distinct, non-empty string ids. */
function byId(value: unknown): [string, JsonObject][] | undefined {
  if (!Array.isArray(value)) return undefined;
  const seen = new Set<string>();
  const out: [string, JsonObject][] = [];
  for (const p of value) {
    if (!isJsonObject(p) || typeof p.id !== "string" || p.id === "") return undefined;
    const key = p.id.toUpperCase();
    if (seen.has(key)) return undefined;
    seen.add(key);
    out.push([key, p]);
  }
  return out;
}

/** The three-way merge of the phrase lists. Undefined back means absent. */
export function mergeWatchVoicePhrases(base: unknown, local: unknown, server: unknown): unknown {
  const b = base === null ? undefined : base;
  const l = local === null ? undefined : local;
  const s = server === null ? undefined : server;
  const baseList = b === undefined ? [] : byId(b);
  const localList = l === undefined ? undefined : byId(l);
  const serverList = s === undefined ? undefined : byId(s);
  if (baseList === undefined || localList === undefined || serverList === undefined) {
    return sameWatchPagesJson(l, b) ? s : l;
  }
  const baseById = new Map(baseList);
  const localById = new Map(localList);
  const serverById = new Map(serverList);
  const changed = (id: string, phrase: JsonObject) => {
    const was = baseById.get(id);
    return was === undefined || !sameWatchPagesJson(phrase, was);
  };
  const both = (id: string, mine: JsonObject, theirs: JsonObject) => (changed(id, mine) ? mine : theirs);
  // A phrase only one side holds: gone when the other side deleted it and
  // this side left it as it was.
  const alone = (id: string, phrase: JsonObject) => (baseById.has(id) && !changed(id, phrase) ? undefined : phrase);

  const localShared = localList.map(([id]) => id).filter((id) => baseById.has(id));
  const baseShared = baseList.map(([id]) => id).filter((id) => localById.has(id));
  const reordered = localShared.length !== baseShared.length || localShared.some((id, i) => id !== baseShared[i]);

  const lead = reordered ? localList : serverList;
  const follow = reordered ? serverList : localList;
  const leadIsLocal = reordered;
  const out: JsonObject[] = [];
  for (const [id, phrase] of lead) {
    const other = (leadIsLocal ? serverById : localById).get(id);
    if (other !== undefined) {
      out.push(leadIsLocal ? both(id, phrase, other) : both(id, other, phrase));
    } else {
      const kept = alone(id, phrase);
      if (kept !== undefined) out.push(kept);
    }
  }
  for (const [id, phrase] of follow) {
    if ((leadIsLocal ? localById : serverById).has(id)) continue;
    const kept = alone(id, phrase);
    if (kept !== undefined) out.push(kept);
  }
  const same = (side: unknown) => Array.isArray(side) && side.length === out.length && out.every((p, i) => p === side[i]);
  if (same(s)) return s;
  if (same(l)) return l;
  return out;
}

/**
 * The merge of `local` (the draft) and `server` (the newer document Home
 * Assistant holds) against `base` (what the draft was made from). With no
 * base every key local holds counts as its own, its phrases too. A `null` at
 * the top reads as absent and is left out.
 */
export function mergeWatchVoice(base: VoiceDocument | null | undefined, local: VoiceDocument, server: VoiceDocument): VoiceDocument {
  const merged = mergeWatchPagesByKey(base, local, server);
  const phrases = mergeWatchVoicePhrases(base === null || base === undefined ? server[PHRASES] : own(base, PHRASES), own(local, PHRASES), own(server, PHRASES));
  const current = own(merged, PHRASES);
  if (phrases === current) return merged;
  if (phrases === undefined) {
    if (!Object.hasOwn(merged, PHRASES)) return merged;
    const { [PHRASES]: _gone, ...rest } = merged;
    return rest;
  }
  if (merged === server || merged === local) {
    return { ...merged, [PHRASES]: phrases };
  }
  merged[PHRASES] = phrases;
  return merged;
}

/** Whether both sides changed one top-level key since `base`, each to
 * something else, so the merge kept local's: for the save note. Phrases
 * count when a phrase both sides changed differently. In key order. */
export function watchVoiceClashes(base: VoiceDocument | null | undefined, local: VoiceDocument, server: VoiceDocument): string[] {
  const keys = new Set([...Object.keys(local), ...Object.keys(server)]);
  const out: string[] = [];
  for (const key of keys) {
    if (key === PHRASES) {
      const b = new Map(byId(own(base, PHRASES)) ?? []);
      const l = byId(own(local, PHRASES));
      const s = new Map(byId(own(server, PHRASES)) ?? []);
      if (l === undefined) continue;
      const clash = l.some(([id, phrase]) => {
        const theirs = s.get(id);
        const was = b.get(id);
        return theirs !== undefined && !sameWatchPagesJson(phrase, theirs)
          && (was === undefined || (!sameWatchPagesJson(phrase, was) && !sameWatchPagesJson(theirs, was)));
      });
      if (clash) out.push(key);
      continue;
    }
    const b = own(base, key);
    const l = own(local, key);
    const s = own(server, key);
    const changed = (x: unknown) => base === null || base === undefined || !sameWatchPagesJson(x, b);
    if (changed(l) && changed(s) && !sameWatchPagesJson(l, s)) out.push(key);
  }
  return out.sort();
}
