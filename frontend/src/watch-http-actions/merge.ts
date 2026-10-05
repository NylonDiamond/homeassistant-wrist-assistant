// The three-way merge of the HTTP action library, for a save that met a
// newer copy (a phone that handed its library over, or another tab).
//
// The grain is the document's top-level keys, each one value, except the
// two lists: `actions`, matched by `id`, and `globalVariables`, matched by
// `key`. The rule for each list is the Control Center list's
// (`watch-control-center/merge.ts`), with the draft as the local side:
// - An element both sides hold is local's whole when local changed it since
//   the base (one the base has none of counts as changed), else the
//   server's whole. Its keys are never mixed: an action's URL, headers and
//   body belong together.
// - An element one side deleted is gone when the other side left it as it
//   was in the base, and stays, as that side has it, when that side changed
//   it.
// - An element only one side added stays.
// - Order: local's when local moved the elements it shares with the base,
//   with what only the server holds after it; else the server's, with what
//   only local holds after it.
// - With no base nothing says which side deleted an element, so nothing is
//   deleted: the base is the elements both sides hold, as the server has
//   them.
// - A list with an element that has no key, or two elements with one,
//   cannot be matched and is one value again: local's when local changed
//   it, else the server's.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 4 build
// contract", rule 10).

import { mergeWatchPagesByKey, sameWatchPagesJson } from "../watch-pages/merge.js";
import { type JsonObject, isJsonObject } from "../watch-pages/model.js";
import { HTTP_ACTIONS_KEY, HTTP_GLOBALS_KEY, type HttpActionsDoc } from "./model.js";

/** An element both sides changed since the base, each to something else:
 * the merge kept local's. */
export interface HttpActionsClash {
  list: "action" | "global";
  /** The action's id, or the global's key. */
  key: string;
  name: string;
}

interface ListRule {
  list: HttpActionsClash["list"];
  field: string;
  keyOf(element: JsonObject): string | undefined;
  nameOf(element: JsonObject): string;
}

const ACTIONS: ListRule = {
  list: "action",
  field: HTTP_ACTIONS_KEY,
  keyOf: (e) => (typeof e.id === "string" && e.id !== "" ? e.id : undefined),
  nameOf: (e) => (typeof e.name === "string" ? e.name.trim() : ""),
};

const GLOBALS: ListRule = {
  list: "global",
  field: HTTP_GLOBALS_KEY,
  keyOf: (e) => (typeof e.key === "string" && e.key.trim() !== "" ? e.key.trim() : undefined),
  nameOf: (e) => (typeof e.key === "string" ? `{{${e.key.trim()}}}` : ""),
};

function own(object: JsonObject | null | undefined, key: string): unknown {
  return object !== null && object !== undefined && Object.hasOwn(object, key) ? object[key] : undefined;
}

/** The elements by key, in order; undefined when the value is not a list of
 * objects with distinct keys. */
function byKey(value: unknown, rule: ListRule): [string, JsonObject][] | undefined {
  if (!Array.isArray(value)) return undefined;
  const seen = new Set<string>();
  const out: [string, JsonObject][] = [];
  for (const e of value) {
    if (!isJsonObject(e)) return undefined;
    const key = rule.keyOf(e);
    if (key === undefined || seen.has(key)) return undefined;
    seen.add(key);
    out.push([key, e]);
  }
  return out;
}

/** The server's elements local holds too, in the server's order: the list
 * base when there is no base. */
function sharedElements(server: unknown, local: unknown, rule: ListRule): unknown {
  const s = byKey(server, rule);
  const l = byKey(local, rule);
  if (s === undefined || l === undefined) return server;
  const held = new Set(l.map(([k]) => k));
  return s.filter(([k]) => held.has(k)).map(([, e]) => e);
}

interface ListMerge {
  value: unknown;
  clashes: HttpActionsClash[];
}

function mergeList(base: unknown, local: unknown, server: unknown, rule: ListRule): ListMerge {
  const b = base === null ? undefined : base;
  const l = local === null ? undefined : local;
  const s = server === null ? undefined : server;
  const baseList = b === undefined ? [] : byKey(b, rule);
  const localList = l === undefined ? undefined : byKey(l, rule);
  const serverList = s === undefined ? undefined : byKey(s, rule);
  if (baseList === undefined || localList === undefined || serverList === undefined) {
    return { value: sameWatchPagesJson(l, b) ? s : l, clashes: [] };
  }
  const baseByKey = new Map(baseList);
  const localByKey = new Map(localList);
  const serverByKey = new Map(serverList);
  const clashes: HttpActionsClash[] = [];
  const changed = (key: string, element: JsonObject) => {
    const was = baseByKey.get(key);
    return was === undefined || !sameWatchPagesJson(element, was);
  };
  const both = (key: string, mine: JsonObject, theirs: JsonObject): JsonObject => {
    if (!changed(key, mine)) return theirs;
    if (changed(key, theirs) && !sameWatchPagesJson(mine, theirs)) {
      clashes.push({ list: rule.list, key, name: rule.nameOf(mine) || rule.nameOf(theirs) });
    }
    return mine;
  };
  const alone = (key: string, element: JsonObject) => (baseByKey.has(key) && !changed(key, element) ? undefined : element);

  const localShared = localList.map(([k]) => k).filter((k) => baseByKey.has(k));
  const baseShared = baseList.map(([k]) => k).filter((k) => localByKey.has(k));
  const reordered = localShared.length !== baseShared.length || localShared.some((k, i) => k !== baseShared[i]);

  const out: JsonObject[] = [];
  const keep = (element: JsonObject | undefined) => {
    if (element !== undefined) out.push(element);
  };
  if (reordered) {
    for (const [key, element] of localList) {
      const theirs = serverByKey.get(key);
      keep(theirs !== undefined ? both(key, element, theirs) : alone(key, element));
    }
    for (const [key, element] of serverList) if (!localByKey.has(key)) keep(alone(key, element));
  } else {
    for (const [key, element] of serverList) {
      const mine = localByKey.get(key);
      keep(mine !== undefined ? both(key, mine, element) : alone(key, element));
    }
    for (const [key, element] of localList) if (!serverByKey.has(key)) keep(alone(key, element));
  }
  const same = (side: unknown) => Array.isArray(side) && side.length === out.length && out.every((e, i) => e === side[i]);
  if (same(s)) return { value: s, clashes };
  if (same(l)) return { value: l, clashes };
  return { value: out, clashes };
}

function listBase(base: HttpActionsDoc | null | undefined, local: HttpActionsDoc, server: HttpActionsDoc, rule: ListRule): unknown {
  return base === null || base === undefined ? sharedElements(own(server, rule.field), own(local, rule.field), rule) : own(base, rule.field);
}

function mergeField(base: HttpActionsDoc | null | undefined, local: HttpActionsDoc, server: HttpActionsDoc, rule: ListRule): ListMerge {
  return mergeList(listBase(base, local, server, rule), own(local, rule.field), own(server, rule.field), rule);
}

/** The actions and globals both sides changed since `base`, each to
 * something else: the merge keeps local's copy there. Actions first. */
export function httpActionsClashes(base: HttpActionsDoc | null | undefined, local: HttpActionsDoc, server: HttpActionsDoc): HttpActionsClash[] {
  return [...mergeField(base, local, server, ACTIONS).clashes, ...mergeField(base, local, server, GLOBALS).clashes];
}

/**
 * The merge of `local` (the draft) and `server` (the newer library Home
 * Assistant holds) against `base` (what the draft was made from). A `null`
 * at the top reads as absent and is left out.
 */
export function mergeHttpActions(base: HttpActionsDoc | null | undefined, local: HttpActionsDoc, server: HttpActionsDoc): HttpActionsDoc {
  let merged = mergeWatchPagesByKey(base, local, server);
  for (const rule of [ACTIONS, GLOBALS]) {
    const value = mergeField(base, local, server, rule).value;
    const current = own(merged, rule.field);
    if (value === current) continue;
    if (value === undefined) {
      if (!Object.hasOwn(merged, rule.field)) continue;
      const { [rule.field]: _gone, ...rest } = merged;
      merged = rest;
      continue;
    }
    if (merged === server || merged === local) merged = { ...merged };
    merged[rule.field] = value;
  }
  return merged;
}
