// The three-way merge of the watch's Control Center list.
//
// The grain is the document's top-level keys, each one value, except
// `entities`, which is matched by `entityId`. The iPhone used to run the same
// rule (`WatchConfigMirror`, merge whole by id) with itself as the local side;
// in the panel the local side is the draft. So each side keeps its own copy of
// an entry both changed.
//
// Entries, in detail:
// - An entry both sides hold is local's whole when local changed it since
//   the base (an entry the base has none of counts as changed), else the
//   server's whole. Its keys are never mixed: a name, an icon and a tint
//   belong together.
// - An entry one side deleted is gone when the other side left it as it was
//   in the base, and stays, as that side has it, when that side changed it.
// - An entry only one side added stays.
// - Order: local's when local moved the entries it shares with the base,
//   with what only the server holds after it; else the server's, with what
//   only local holds after it.
// - With no base nothing says which side deleted an entry, so nothing is
//   deleted: the base is the entries both sides hold, as the server has
//   them.
// - A list with an entry that has no entity id, or two entries with one,
//   cannot be matched and is one value again: local's when local changed
//   it, else the server's.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 5 build
// contract", items 2 and 5).

import { mergeWatchPagesByKey, sameWatchPagesJson } from "../watch-pages/merge.js";
import { type JsonObject, isJsonObject } from "../watch-pages/model.js";
import { CONTROL_CENTER_KEY, type ControlCenterDocument } from "./model.js";

function own(object: JsonObject | null | undefined, key: string): unknown {
  return object !== null && object !== undefined && Object.hasOwn(object, key) ? object[key] : undefined;
}

/** The entries by entity id, in order; undefined when the value is not a
 * list of objects with distinct, non-empty string entity ids. */
function byEntity(value: unknown): [string, JsonObject][] | undefined {
  if (!Array.isArray(value)) return undefined;
  const seen = new Set<string>();
  const out: [string, JsonObject][] = [];
  for (const e of value) {
    if (!isJsonObject(e) || typeof e.entityId !== "string" || e.entityId === "") return undefined;
    if (seen.has(e.entityId)) return undefined;
    seen.add(e.entityId);
    out.push([e.entityId, e]);
  }
  return out;
}

/** The server's entries whose entity local holds too, in the server's order:
 * the list base when there is no base. The server's list as it is when
 * either cannot be matched. */
function sharedEntries(server: unknown, local: unknown): unknown {
  const s = byEntity(server);
  const l = byEntity(local);
  if (s === undefined || l === undefined) return server;
  const held = new Set(l.map(([id]) => id));
  return s.filter(([id]) => held.has(id)).map(([, e]) => e);
}

/** An entry both sides changed since the base, each to something else: the
 * merge kept local's. */
export interface ControlCenterClash {
  entityId: string;
  name: string;
}

interface ListMerge {
  entities: unknown;
  clashes: ControlCenterClash[];
}

function entryName(entry: JsonObject | undefined): string {
  if (entry === undefined) return "";
  const custom = entry.customDisplayName;
  if (typeof custom === "string" && custom !== "") return custom;
  return typeof entry.displayName === "string" ? entry.displayName : "";
}

function mergeEntryList(base: unknown, local: unknown, server: unknown): ListMerge {
  const b = base === null ? undefined : base;
  const l = local === null ? undefined : local;
  const s = server === null ? undefined : server;
  const baseList = b === undefined ? [] : byEntity(b);
  const localList = l === undefined ? undefined : byEntity(l);
  const serverList = s === undefined ? undefined : byEntity(s);
  if (baseList === undefined || localList === undefined || serverList === undefined) {
    return { entities: sameWatchPagesJson(l, b) ? s : l, clashes: [] };
  }
  const baseById = new Map(baseList);
  const localById = new Map(localList);
  const serverById = new Map(serverList);
  const clashes: ControlCenterClash[] = [];
  const changed = (id: string, entry: JsonObject) => {
    const was = baseById.get(id);
    return was === undefined || !sameWatchPagesJson(entry, was);
  };
  const both = (id: string, mine: JsonObject, theirs: JsonObject): JsonObject => {
    if (!changed(id, mine)) return theirs;
    if (changed(id, theirs) && !sameWatchPagesJson(mine, theirs)) clashes.push({ entityId: id, name: entryName(mine) || entryName(theirs) });
    return mine;
  };
  // An entry only one side holds: gone when the other side deleted it and
  // this side left it as it was.
  const alone = (id: string, entry: JsonObject) => (baseById.has(id) && !changed(id, entry) ? undefined : entry);

  const localShared = localList.map(([id]) => id).filter((id) => baseById.has(id));
  const baseShared = baseList.map(([id]) => id).filter((id) => localById.has(id));
  const reordered = localShared.length !== baseShared.length || localShared.some((id, i) => id !== baseShared[i]);

  const out: JsonObject[] = [];
  if (reordered) {
    for (const [id, entry] of localList) {
      const theirs = serverById.get(id);
      if (theirs !== undefined) out.push(both(id, entry, theirs));
      else {
        const kept = alone(id, entry);
        if (kept !== undefined) out.push(kept);
      }
    }
    for (const [id, entry] of serverList) {
      if (localById.has(id)) continue;
      const kept = alone(id, entry);
      if (kept !== undefined) out.push(kept);
    }
  } else {
    for (const [id, entry] of serverList) {
      const mine = localById.get(id);
      if (mine !== undefined) out.push(both(id, mine, entry));
      else {
        const kept = alone(id, entry);
        if (kept !== undefined) out.push(kept);
      }
    }
    for (const [id, entry] of localList) {
      if (serverById.has(id)) continue;
      const kept = alone(id, entry);
      if (kept !== undefined) out.push(kept);
    }
  }
  const same = (side: unknown) => Array.isArray(side) && side.length === out.length && out.every((e, i) => e === side[i]);
  if (same(s)) return { entities: s, clashes };
  if (same(l)) return { entities: l, clashes };
  return { entities: out, clashes };
}

function listBase(base: ControlCenterDocument | null | undefined, local: ControlCenterDocument, server: ControlCenterDocument): unknown {
  return base === null || base === undefined ? sharedEntries(own(server, CONTROL_CENTER_KEY), own(local, CONTROL_CENTER_KEY)) : own(base, CONTROL_CENTER_KEY);
}

/**
 * The entries both sides changed since `base`, each to something else: the
 * merge keeps local's copy there. In the merged order.
 */
export function controlCenterClashes(base: ControlCenterDocument | null | undefined, local: ControlCenterDocument, server: ControlCenterDocument): ControlCenterClash[] {
  return mergeEntryList(listBase(base, local, server), own(local, CONTROL_CENTER_KEY), own(server, CONTROL_CENTER_KEY)).clashes;
}

/**
 * The merge of `local` (the draft) and `server` (the newer document Home
 * Assistant holds) against `base` (what the draft was made from). A `null`
 * at the top reads as absent and is left out.
 */
export function mergeControlCenter(base: ControlCenterDocument | null | undefined, local: ControlCenterDocument, server: ControlCenterDocument): ControlCenterDocument {
  const merged = mergeWatchPagesByKey(base, local, server);
  const entities = mergeEntryList(listBase(base, local, server), own(local, CONTROL_CENTER_KEY), own(server, CONTROL_CENTER_KEY)).entities;
  const current = own(merged, CONTROL_CENTER_KEY);
  if (entities === current) return merged;
  if (entities === undefined) {
    if (!Object.hasOwn(merged, CONTROL_CENTER_KEY)) return merged;
    const { [CONTROL_CENTER_KEY]: _gone, ...rest } = merged;
    return rest;
  }
  if (merged === server || merged === local) return { ...merged, [CONTROL_CENTER_KEY]: entities };
  merged[CONTROL_CENTER_KEY] = entities;
  return merged;
}
