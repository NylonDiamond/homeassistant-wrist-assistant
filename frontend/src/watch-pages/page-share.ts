// Share a page: one page as text, to send to somebody else, and New page's
// "Paste a page" to make a page from that text on another home.
//
// The text is an exact copy of the page, tiles and both screens, with a list
// of the Home Assistant entities it names and their friendly names. Nothing
// else leaves: no states, no photos. On the way in, every entity the reader's
// home does not have is asked about once, with a pick of the reader's own
// entities of that domain, and the page is made under new ids like From a
// page's copy (`watchPageCopy`).
//
// What cannot travel is said, not hidden: a custom photo (background or tile
// icon) lives in the author's Home Assistant, so the copy drops it and the
// tile keeps its plain icon.
//
// The reason it exists: a person with a broken page sends it to support, and
// support makes the same page on a test home.

import { hasCssInAColor, stableStringify } from "../transfer.js";
import { replaceQuotedEntityIds, quotedEntityIds } from "../model.js";
import { isBuiltInPagePhoto } from "./page-photo.js";
import { type JsonObject, type WatchPage, isJsonObject, tileClass, watchPageName, watchPageTiles } from "./model.js";

/** The key and version that mark the text as a shared page. */
export const PAGE_SHARE_KEY = "houselitPage";
export const PAGE_SHARE_VERSION = 1;

/** The most text the paste box reads: a page is at most 700 KB on the
 * device, and the entity list and pretty print add to it. */
export const PAGE_SHARE_MAX_BYTES = 2 * 1024 * 1024;

/** A whole string that is one entity id: `light.kitchen`. A header's
 * `divider.label.light` has three parts and is not one. */
const ENTITY_ID_RE = /^[a-z0-9_]+\.[a-z0-9_]+$/;

/** Keys whose value is this page's own id, never an entity. */
const ID_KEYS: ReadonlySet<string> = new Set(["id"]);

type StatesLike = Readonly<Record<string, unknown>>;

function friendlyName(states: StatesLike, entityId: string): string {
  const state = states[entityId];
  if (!isJsonObject(state)) return "";
  const attributes = state.attributes;
  if (!isJsonObject(attributes)) return "";
  return typeof attributes.friendly_name === "string" ? attributes.friendly_name : "";
}

/** Every string in a JSON value, with the key it sits under. */
function eachString(value: unknown, visit: (text: string, key: string | undefined) => void, key?: string, depth = 0): void {
  if (depth > 64) return;
  if (typeof value === "string") {
    visit(value, key);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) eachString(item, visit, key, depth + 1);
    return;
  }
  if (isJsonObject(value)) for (const [k, v] of Object.entries(value)) eachString(v, visit, k, depth + 1);
}

/** A copy of a JSON value with each string passed through `map`, ids kept. */
function mapStrings(value: unknown, map: (text: string) => string, key?: string, depth = 0): unknown {
  if (depth > 64) return value;
  if (typeof value === "string") return key !== undefined && ID_KEYS.has(key) ? value : map(value);
  if (Array.isArray(value)) return value.map((item) => mapStrings(item, map, key, depth + 1));
  if (isJsonObject(value)) {
    const out: JsonObject = {};
    for (const [k, v] of Object.entries(value)) out[k] = mapStrings(v, map, k, depth + 1);
    return out;
  }
  return value;
}

/**
 * The entity ids a page names, in first-use order: a tile's own entity, any
 * other value that is a whole entity id (a tap's target, a show-when's
 * entity), and ids quoted inside a template. Only ids `known` says yes to,
 * so a quoted `'3.5'` is not taken for one.
 */
export function pageEntityIds(page: WatchPage, known: (entityId: string) => boolean): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const add = (id: string) => {
    if (seen.has(id) || !known(id)) return;
    seen.add(id);
    out.push(id);
  };
  eachString(page, (text, key) => {
    if (key !== undefined && ID_KEYS.has(key)) return;
    if (ENTITY_ID_RE.test(text)) add(text);
    else for (const id of quotedEntityIds(text)) add(id);
  });
  return out;
}

/** The shared object for one page. */
export interface PageShare {
  /** The page as it was, its ids included; an import gives it new ones. */
  page: WatchPage;
  /** Each entity the page names, to its friendly name on the author's home
   * ("" when it has none). */
  entities: Readonly<Record<string, string>>;
}

/** The text for one page: sorted, pretty JSON, so it reads and diffs. */
export function pageShareText(page: WatchPage, states: StatesLike): string {
  const entities: Record<string, string> = {};
  for (const id of pageEntityIds(page, (id) => Object.hasOwn(states, id))) entities[id] = friendlyName(states, id);
  return stableStringify({ [PAGE_SHARE_KEY]: PAGE_SHARE_VERSION, name: watchPageName(page), page, entities });
}

/** A file name somebody will know in their downloads a week later. */
export function pageShareFileName(page: WatchPage): string {
  const base = watchPageName(page).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
  return `houselit-page-${base === "" ? "page" : base}.json`;
}

export type PageShareParse = { ok: true; share: PageShare } | { ok: false; error: string };

export const PAGE_SHARE_NOT_A_PAGE = "This is not a shared page. In Pages, open a page's ··· and pick Share page, then copy all of the text.";

function asPage(value: unknown): WatchPage | undefined {
  if (!isJsonObject(value)) return undefined;
  if (!Array.isArray(value.items) && !isJsonObject(value.dynamicConfig)) return undefined;
  return value as WatchPage;
}

/**
 * Read pasted text back into a page. Takes the shared text, and for support
 * also a bare page object or a pages document with exactly one page in it.
 */
export function parsePageShare(text: string): PageShareParse {
  const trimmed = text.trim();
  if (trimmed === "") return { ok: false, error: "Paste the text of a shared page." };
  if (new TextEncoder().encode(trimmed).length > PAGE_SHARE_MAX_BYTES) return { ok: false, error: "This text is too big for one page." };
  let value: unknown;
  try {
    value = JSON.parse(trimmed);
  } catch {
    return { ok: false, error: "This text is cut short or changed. Copy all of it again." };
  }
  if (!isJsonObject(value)) return { ok: false, error: PAGE_SHARE_NOT_A_PAGE };
  let page: WatchPage | undefined;
  let entities: Record<string, string> = {};
  if (PAGE_SHARE_KEY in value) {
    const version = value[PAGE_SHARE_KEY];
    if (typeof version !== "number" || version > PAGE_SHARE_VERSION) return { ok: false, error: "This page was shared from a newer version. Update the integration, then paste it again." };
    page = asPage(value.page);
    if (isJsonObject(value.entities)) {
      for (const [id, name] of Object.entries(value.entities)) if (ENTITY_ID_RE.test(id)) entities[id] = typeof name === "string" ? name : "";
    }
  } else if (Array.isArray(value.pages)) {
    const pages = value.pages.filter((p) => asPage(p) !== undefined);
    if (pages.length > 1) return { ok: false, error: "This text has more than one page. Share one page at a time." };
    page = asPage(pages[0]);
  } else {
    page = asPage(value);
  }
  if (page === undefined) return { ok: false, error: PAGE_SHARE_NOT_A_PAGE };
  if (hasCssInAColor(page)) return { ok: false, error: "This page has a color in it that is not a color, so it was not read." };
  if (Object.keys(entities).length === 0) {
    // A bare page names no entity list: take every tile's entity and any
    // whole id that looks like one, by its domain.
    for (const id of pageEntityIds(page, (id) => tileClass(id) === "entity")) entities[id] = "";
  }
  return { ok: true, share: { page, entities } };
}

/** One entity the shared page names that this home does not have. */
export interface MissingEntity {
  entityId: string;
  domain: string;
  /** The author's name for it, "" when none came. */
  name: string;
  /** This home's entities of the same domain, by name, to pick from. */
  choices: readonly { entityId: string; name: string }[];
}

/** The shared entities this home lacks, in the share's order. */
export function missingEntities(share: PageShare, states: StatesLike): MissingEntity[] {
  const byDomain = new Map<string, { entityId: string; name: string }[]>();
  for (const id of Object.keys(states)) {
    const domain = id.split(".")[0] ?? "";
    const list = byDomain.get(domain) ?? [];
    list.push({ entityId: id, name: friendlyName(states, id) || id });
    byDomain.set(domain, list);
  }
  for (const list of byDomain.values()) list.sort((a, b) => a.name.localeCompare(b.name));
  return Object.entries(share.entities)
    .filter(([id]) => !Object.hasOwn(states, id))
    .map(([entityId, name]) => {
      const domain = entityId.split(".")[0] ?? "";
      return { entityId, domain, name, choices: byDomain.get(domain) ?? [] };
    });
}

/** First picks for the missing entities: one of this home's of the same
 * domain and the same name, when there is exactly one. */
export function autoPicks(missing: readonly MissingEntity[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const row of missing) {
    if (row.name === "") continue;
    const same = row.choices.filter((c) => c.name.toLowerCase() === row.name.toLowerCase());
    if (same.length === 1) out[row.entityId] = same[0]!.entityId;
  }
  return out;
}

/** What the paste turned into, for the line under the box. */
export interface PageShareFacts {
  name: string;
  tiles: number;
  entities: number;
  missing: number;
  /** Custom photos the copy leaves behind. */
  photos: number;
}

function customPhotoCount(page: WatchPage): number {
  let n = 0;
  const bg = page.backgroundImageId;
  if (typeof bg === "string" && bg.trim() !== "" && !isBuiltInPagePhoto(bg)) n += 1;
  for (const tile of watchPageTiles(page)) if (typeof tile.iconPhotoId === "string" && tile.iconPhotoId.trim() !== "") n += 1;
  return n;
}

export function pageShareFacts(share: PageShare, states: StatesLike): PageShareFacts {
  return {
    name: watchPageName(share.page),
    tiles: watchPageTiles(share.page).length,
    entities: Object.keys(share.entities).length,
    missing: missingEntities(share, states).length,
    photos: customPhotoCount(share.page),
  };
}

/** The line that says what was pasted. */
export function pageShareFactsText(facts: PageShareFacts): string {
  const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
  let line = `${facts.name}: ${plural(facts.tiles, "tile")}, ${plural(facts.entities, "entity", "entities")}.`;
  if (facts.missing > 0) line += ` ${facts.missing} ${facts.missing === 1 ? "is" : "are"} not in this home. Pick yours below, or leave ${facts.missing === 1 ? "it" : "them"}.`;
  if (facts.photos > 0) line += ` ${plural(facts.photos, "photo")} stay${facts.photos === 1 ? "s" : ""} behind.`;
  return line;
}

/**
 * The shared page, ready to make here: each picked entity swapped for this
 * home's (whole values and quoted ids in templates alike), and the custom
 * photos dropped. Ids are still the author's; `watchPageCopy` gives new ones.
 */
export function pageFromShare(share: PageShare, picks: Readonly<Record<string, string>>): WatchPage {
  const map = new Map<string, string>();
  for (const [from, to] of Object.entries(picks)) if (to !== "" && to !== from && ENTITY_ID_RE.test(to)) map.set(from, to);
  const page = (map.size === 0 ? structuredClone(share.page) : mapStrings(share.page, (text) => map.get(text) ?? replaceQuotedEntityIds(text, map))) as WatchPage;
  const bg = page.backgroundImageId;
  if (typeof bg === "string" && bg.trim() !== "" && !isBuiltInPagePhoto(bg)) delete page.backgroundImageId;
  if (Array.isArray(page.items)) {
    for (const tile of page.items) {
      if (!isJsonObject(tile)) continue;
      delete tile.iconPhotoId;
      delete tile.iconPhotoLook;
    }
  }
  return page;
}
