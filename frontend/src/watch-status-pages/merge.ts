// The three-way merge of the watch's status pages.
//
// The grain is the page, matched by `id`. A page one side changed since the
// base (its keys, its rows, or removed) takes that side's version; a page
// both sides changed, each to something else, takes the server's whole: the
// incoming copy wins, and the save note names the page. The iPhone used to
// run the same grain with itself as the winning side (`WatchConfigMirror`,
// merge by page id, the phone's page whole), so the two agreed on the
// phone's version.
//
// Every top-level key but `statusPages` merges by key, the draft's value
// where the draft changed it. The order of the pages is the draft's when the
// draft moved pages it shares with the base, else the server's; a page only
// one side added keeps its place after the page it followed there.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 2 build
// contract", items 16 and 20).

import { mergeWatchPagesByKey, sameWatchPagesJson } from "../watch-pages/merge.js";
import { type JsonObject, isJsonObject } from "../watch-pages/model.js";
import { STATUS_PAGES_KEY, type StatusPagesDocument } from "./model.js";

function present(value: unknown): unknown {
  return value === null ? undefined : value;
}

function own(object: JsonObject | null | undefined, key: string): unknown {
  return object !== null && object !== undefined && Object.hasOwn(object, key) ? object[key] : undefined;
}

/** The pages of a list by id (upper case), in order, or undefined when the
 * value is not a list of objects with distinct non-empty string ids. */
function identified(value: unknown): Array<[string, JsonObject]> | undefined {
  if (!Array.isArray(value)) return undefined;
  const seen = new Set<string>();
  const out: Array<[string, JsonObject]> = [];
  for (const item of value) {
    if (!isJsonObject(item) || typeof item.id !== "string" || item.id === "") return undefined;
    const key = item.id.toUpperCase();
    if (seen.has(key)) return undefined;
    seen.add(key);
    out.push([key, item]);
  }
  return out;
}

function sameOrder(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((id, i) => id === b[i]);
}

/** What a page became on one side since the base: kept as it was, changed
 * (to a page), or removed. */
type Change = { kind: "same" } | { kind: "changed"; page: JsonObject | undefined };

function changeOf(base: JsonObject | undefined, side: JsonObject | undefined): Change {
  if (base === undefined && side === undefined) return { kind: "same" };
  if (base !== undefined && side !== undefined && sameWatchPagesJson(base, side)) return { kind: "same" };
  return { kind: "changed", page: side };
}

interface PagesMerge {
  pages: unknown;
  /** The pages both sides changed, each differently: the server's version
   * stayed. Names as the server has them (the draft's for one the server
   * removed). */
  clashes: { id: string; name: string }[];
}

function pageName(page: JsonObject | undefined): string {
  return page !== undefined && typeof page.name === "string" ? page.name : "";
}

/** The page list three ways, by page id. */
function mergePageList(base: unknown, local: unknown, server: unknown): PagesMerge {
  const b = present(base);
  const l = present(local);
  const s = present(server);
  const baseList = b === undefined ? [] : identified(b);
  const localList = l === undefined ? undefined : identified(l);
  const serverList = s === undefined ? undefined : identified(s);
  if (baseList === undefined || localList === undefined || serverList === undefined) {
    // Not a list of pages on some side: one value, the draft's when it
    // changed it, else the server's.
    return { pages: sameWatchPagesJson(l, b) ? s : l, clashes: [] };
  }
  const baseById = new Map(baseList);
  const localById = new Map(localList);
  const serverById = new Map(serverList);
  const clashes: { id: string; name: string }[] = [];

  // Each id's page in the result, or undefined when it is gone.
  const pick = (id: string): JsonObject | undefined => {
    const basePage = baseById.get(id);
    const localPage = localById.get(id);
    const serverPage = serverById.get(id);
    const lc = changeOf(basePage, localPage);
    const sc = changeOf(basePage, serverPage);
    if (lc.kind === "same") return serverPage;
    if (sc.kind === "same") return localPage;
    // Both changed. Alike: either. Otherwise the server's whole.
    if (localPage !== undefined && serverPage !== undefined && sameWatchPagesJson(localPage, serverPage)) return serverPage;
    if (localPage !== undefined || serverPage !== undefined) {
      const name = pageName(serverPage) || pageName(localPage) || pageName(basePage);
      clashes.push({ id: (serverPage?.id ?? localPage?.id ?? basePage?.id) as string, name });
    }
    return serverPage;
  };

  const localShared = localList.map(([id]) => id).filter((id) => baseById.has(id));
  const baseShared = baseList.map(([id]) => id).filter((id) => localById.has(id));
  const localReordered = !sameOrder(localShared, baseShared);
  const [lead, follow] = localReordered ? [localList, serverList] : [serverList, localList];

  const order: string[] = lead.map(([id]) => id);
  const placed = new Set(order);
  // A page only the following side holds goes after the page before it there
  // that is placed, else first.
  follow.forEach(([id], index) => {
    if (placed.has(id)) return;
    let at = 0;
    for (let i = index - 1; i >= 0; i--) {
      const before = order.indexOf(follow[i]![0]);
      if (before >= 0) {
        at = before + 1;
        break;
      }
    }
    order.splice(at, 0, id);
    placed.add(id);
  });

  const result: JsonObject[] = [];
  for (const id of order) {
    const page = pick(id);
    if (page !== undefined) result.push(page);
  }
  const same = (list: unknown[]) => list.length === result.length && result.every((p, i) => p === list[i]);
  if (same(s as unknown[])) return { pages: s, clashes };
  if (same(l as unknown[])) return { pages: l, clashes };
  return { pages: result, clashes };
}

/**
 * The pages both sides changed since `base`, each to something else: the
 * merge keeps the server's version there and drops the draft's change. In
 * the server's order. With no base, every page the two hold differently.
 */
export function statusPagesClashes(base: StatusPagesDocument | null | undefined, local: StatusPagesDocument, server: StatusPagesDocument): { id: string; name: string }[] {
  return mergePageList(base === null || base === undefined ? [] : own(base, STATUS_PAGES_KEY), own(local, STATUS_PAGES_KEY), own(server, STATUS_PAGES_KEY)).clashes;
}

/**
 * The merge of `local` (the draft) and `server` (the newer document Home
 * Assistant holds) against `base` (what the draft was made from). With no
 * base, every page the two hold differently counts as changed on both
 * sides, and the server's stays.
 */
export function mergeStatusPages(base: StatusPagesDocument | null | undefined, local: StatusPagesDocument, server: StatusPagesDocument): StatusPagesDocument {
  const merged = mergeWatchPagesByKey(base, local, server);
  const pages = mergePageList(base === null || base === undefined ? [] : own(base, STATUS_PAGES_KEY), own(local, STATUS_PAGES_KEY), own(server, STATUS_PAGES_KEY)).pages;
  if (pages === undefined) {
    if (!Object.hasOwn(merged, STATUS_PAGES_KEY)) return merged;
    const out: JsonObject = {};
    for (const key of Object.keys(merged)) if (key !== STATUS_PAGES_KEY) out[key] = merged[key];
    return out;
  }
  if (merged[STATUS_PAGES_KEY] === pages) return merged;
  if (merged === server || merged === local) {
    const copy: JsonObject = { ...merged };
    copy[STATUS_PAGES_KEY] = pages;
    return sameShape(copy, server) ? server : sameShape(copy, local) ? local : copy;
  }
  merged[STATUS_PAGES_KEY] = pages;
  return sameShape(merged, server) ? server : sameShape(merged, local) ? local : merged;
}

/** Whether `merged` holds exactly `side`'s keys, each the very same value. */
function sameShape(merged: JsonObject, side: JsonObject): boolean {
  const keys = Object.keys(merged);
  if (keys.length !== Object.keys(side).length) return false;
  return keys.every((k) => Object.hasOwn(side, k) && side[k] === merged[k]);
}
