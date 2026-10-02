// The Add tile dialog's entity list, without any drawing: which entities can
// still be added to a page, ranked by the panel's own entity search, filtered
// by kind, shown a page of rows at a time, and the words the dialog says.
//
// Home Assistant hands the panel a new `hass` several times a second, each
// with new state objects. Nothing in the list depends on a state's value, so
// the pool is rebuilt only when what it is made of changes: the entity ids,
// their friendly names, the registries the area comes from, the entity ids
// on the page and the rows kept after an add (`WatchAddListCache`). A tick
// then hands back the very same arrays, and the rows neither move nor lose
// the highlight.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md ("3c build contract").

import { type EntityChoice, areaLookup, entityChoices, searchEntities } from "../editors.js";
import type { HassEntityState, HassLike } from "../ha-api.js";
import { type WatchAddRefusal, watchAddableDomain } from "./tile-new.js";

/** One row: the panel's search row, plus the plain name of the entity's kind
 * as the phone's add names it ("Lights", "Media Players"). */
export interface WatchAddCandidate extends EntityChoice {
  kind: string;
}

/** One choice of the kind filter: its plain name and how many entities of
 * that kind can still be added. */
export interface WatchAddKind {
  name: string;
  count: number;
}

export interface WatchAddPool {
  /** Every entity that can still be added, and the kept rows, by name. */
  candidates: readonly WatchAddCandidate[];
  /** The entities on the page already (not kept), so a search that finds
   * only those can say so. */
  onPage: readonly WatchAddCandidate[];
  /** The kinds among the candidates, by name. */
  kinds: readonly WatchAddKind[];
  /** Entities whose kind the watch has no tile for. */
  leftOut: number;
}

/** What the pool is made of. */
export interface WatchAddPoolInput {
  hass: Pick<HassLike, "entities" | "devices" | "areas"> & {
    states: Readonly<Record<string, HassEntityState | undefined>>;
  };
  /** The entity ids of the page's tiles. */
  onPage: ReadonlySet<string>;
  /** Entities added during this search: they stay in the list, marked added,
   * until the search changes, so the row a person just used does not vanish
   * from under the pointer. */
  keep: ReadonlySet<string>;
}

function byName(a: WatchAddKind, b: WatchAddKind): number {
  return a.name.localeCompare(b.name);
}

/**
 * The pool: every entity in `states` whose domain the watch has a tile for
 * (`watchAddableDomain`) and that is not on the page yet, plus the kept
 * ones, as the panel's search builds its rows (`entityChoices`: friendly
 * name, else the id; the area from the registries; sorted by name). The
 * kinds count only what can still be added.
 */
export function watchAddPool(input: WatchAddPoolInput): WatchAddPool {
  const { hass, onPage, keep } = input;
  const listed: Record<string, HassEntityState> = {};
  const already: Record<string, HassEntityState> = {};
  const kindOf = new Map<string, string>();
  let leftOut = 0;
  for (const [id, state] of Object.entries(hass.states)) {
    if (state === undefined) continue;
    const addable = watchAddableDomain(id);
    if (addable === undefined) {
      leftOut += 1;
      continue;
    }
    kindOf.set(id, addable.name);
    if (onPage.has(id) && !keep.has(id)) already[id] = state;
    else listed[id] = state;
  }
  // The lookup reads only the three registries.
  const areaOf = areaLookup(hass as HassLike);
  const withKind = (c: EntityChoice): WatchAddCandidate => ({ ...c, kind: kindOf.get(c.entityId) ?? "" });
  const candidates = entityChoices(listed, undefined, areaOf).map(withKind);
  const counts = new Map<string, number>();
  for (const c of candidates) {
    if (onPage.has(c.entityId)) continue;
    counts.set(c.kind, (counts.get(c.kind) ?? 0) + 1);
  }
  const kinds = [...counts].map(([name, count]) => ({ name, count })).sort(byName);
  return { candidates, onPage: entityChoices(already, undefined, areaOf).map(withKind), kinds, leftOut };
}

/**
 * The rows for a search: the pool narrowed to one kind (`""` for all), then
 * ranked by the panel's entity search (`searchEntities`) with no limit; the
 * dialog pages through them itself. An empty search keeps the pool's order,
 * by name.
 */
export function watchAddResults(
  candidates: readonly WatchAddCandidate[],
  query: string,
  kind: string,
): WatchAddCandidate[] {
  const pool = kind === "" ? candidates : candidates.filter((c) => c.kind === kind);
  return searchEntities(pool, query, Number.POSITIVE_INFINITY) as WatchAddCandidate[];
}

/**
 * The pool and the rows, built again only when what they are made of
 * changed. Keep one per dialog (`uiState`): the arrays it hands back are the
 * same objects for as long as nothing that matters moved.
 */
export class WatchAddListCache {
  private ids: string[] = [];
  private names: unknown[] = [];
  private registries: readonly unknown[] = [];
  private pageKey = "";
  private keepKey = "";
  private pool: WatchAddPool | undefined;
  private resultsFor: { pool: WatchAddPool; query: string; kind: string } | undefined;
  private results: WatchAddCandidate[] = [];

  /** The pool for this input: the last one when the entity ids, their
   * friendly names, the registry objects, the page's entity ids and the
   * kept rows are as they were. State values never count. */
  poolFor(input: WatchAddPoolInput): WatchAddPool {
    const { hass } = input;
    const ids: string[] = [];
    const names: unknown[] = [];
    for (const id in hass.states) {
      ids.push(id);
      names.push(hass.states[id]?.attributes?.friendly_name);
    }
    const registries = [hass.entities, hass.devices, hass.areas];
    const pageKey = [...input.onPage].sort().join("\n");
    const keepKey = [...input.keep].sort().join("\n");
    const same =
      this.pool !== undefined &&
      pageKey === this.pageKey &&
      keepKey === this.keepKey &&
      sameItems(ids, this.ids) &&
      sameItems(names, this.names) &&
      sameItems(registries, this.registries);
    if (!same) {
      this.pool = watchAddPool(input);
      this.ids = ids;
      this.names = names;
      this.registries = registries;
      this.pageKey = pageKey;
      this.keepKey = keepKey;
    }
    return this.pool!;
  }

  /** The rows of `pool` for a search and a kind: the last ones when all
   * three are as they were. */
  resultsOf(pool: WatchAddPool, query: string, kind: string): WatchAddCandidate[] {
    const last = this.resultsFor;
    if (last === undefined || last.pool !== pool || last.query !== query || last.kind !== kind) {
      this.results = watchAddResults(pool.candidates, query, kind);
      this.resultsFor = { pool, query, kind };
    }
    return this.results;
  }
}

function sameItems(a: readonly unknown[], b: readonly unknown[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) return false;
  return true;
}

// ── paging and the highlight ─────────────────────────────────────────────

/** How many rows the list draws at first, and how many more each "Show
 * more" adds. A home can hold thousands of entities; drawing them all on
 * every keystroke is what makes a list slow to type in. */
export const WATCH_ADD_ROWS = 60;

/** How many rows to draw: at least one page, at most all, and always far
 * enough to include the highlighted row. */
export function watchAddRowCount(total: number, shown: number, highlight: number): number {
  const wanted = Math.max(shown, WATCH_ADD_ROWS);
  const reach = highlight >= 0 ? Math.ceil((highlight + 1) / WATCH_ADD_ROWS) * WATCH_ADD_ROWS : 0;
  return Math.min(total, Math.max(wanted, reach));
}

/** Where the highlight is: the row of the highlighted entity, else the first
 * row; -1 when there are no rows. The entity, not the place, is what is
 * kept, so a row added or removed above it does not move it to another. */
export function watchAddHighlightIndex(results: readonly EntityChoice[], highlighted: string | undefined): number {
  if (results.length === 0) return -1;
  if (highlighted === undefined) return 0;
  const at = results.findIndex((c) => c.entityId === highlighted);
  return at < 0 ? 0 : at;
}

/** The highlight moved by `delta` rows, held inside the list (no wrap: the
 * last row of a long list is not a step away from the first). */
export function watchAddStep(index: number, delta: number, length: number): number {
  if (length === 0) return -1;
  return Math.max(0, Math.min(length - 1, index + delta));
}

/** The row to highlight after the one at `index` was added: the next one
 * that can still be added, else the one before it, else the same row. */
export function watchAddNextOpen(
  results: readonly EntityChoice[],
  index: number,
  isAdded: (entityId: string) => boolean,
): number {
  for (let i = index + 1; i < results.length; i += 1) if (!isAdded(results[i]!.entityId)) return i;
  for (let i = index - 1; i >= 0; i -= 1) if (!isAdded(results[i]!.entityId)) return i;
  return index;
}

// ── words ────────────────────────────────────────────────────────────────

/** Why an add was refused, in plain words. `name` is what was being added,
 * for the entity already on the page. */
export function watchAddRefusalText(refusal: WatchAddRefusal, name?: string): string {
  switch (refusal) {
    case "onPage":
      return name ? `${name} is already on this page.` : "That entity is already on this page.";
    case "smartPage":
      return "This page fills itself with tiles, so none can be added by hand.";
    case "systemPage":
      return "This page belongs to the app, so no tiles can be added to it.";
    case "noPage":
      return "This page is gone. It may have been deleted on the iPhone.";
    case "badItems":
      return "The tiles on this page could not be read, so adding one would lose them.";
  }
}

/** The words while the editor refuses every edit (a save is out). */
export const WATCH_ADD_BUSY_TEXT = "Wait a moment: the page is being saved.";

/** The foot line: how many tiles this visit added. */
export function watchAddedCountText(count: number): string {
  if (count <= 0) return "No tiles added yet.";
  return count === 1 ? "1 tile added." : `${count} tiles added.`;
}

/** The line under the list about entities the watch has no tile for, or
 * undefined when there are none. */
export function watchLeftOutText(count: number): string | undefined {
  if (count <= 0) return undefined;
  return count === 1
    ? "1 entity is left out: the watch has no tile for its kind."
    : `${count} entities are left out: the watch has no tile for their kind.`;
}

/** The "Show more" row: how many the next press adds, of how many left. */
export function watchAddMoreText(left: number): string {
  const next = Math.min(left, WATCH_ADD_ROWS);
  return next === left ? `Show ${left} more` : `Show ${next} more (${left} left)`;
}

/** The words when the list has no rows. `onPage` is what the same search
 * finds among the page's own entities: a person looking for a light that is
 * on the page already learns that it is, rather than that it does not
 * exist. */
export function watchAddEmptyText(
  query: string,
  kind: string,
  poolSize: number,
  onPage: readonly { name: string }[] = [],
): string {
  if (poolSize === 0) return "Every entity the watch has a tile for is on this page already.";
  if (query.trim() !== "" && onPage.length > 0) {
    return onPage.length === 1
      ? `${onPage[0]!.name} is already on this page.`
      : `The ${onPage.length} entities that match are already on this page.`;
  }
  // The kind's plain name is a plural ("Lights") for most kinds and not for
  // some ("Climate", "Weather"), so the words never put it in a sentence.
  if (query.trim() !== "") return kind === "" ? "Nothing matches that search." : "Nothing of that kind matches the search.";
  return kind === "" ? "Nothing left to add." : "Nothing of that kind is left to add.";
}
