// Which settings sections a person folded, kept across reloads.
//
// Every section of the tile, page and smart settings starts open, so the
// controls are in view without a click. A fold is a way to put a section
// away, and it stays put: the choice is held in the editor's `uiState` for
// this visit and in localStorage for the next one. Only folded sections are
// stored; opening one again drops it. A watch switch clears `uiState`, and
// the stored folds still answer then.
//
// A module may start a section folded instead (`folded`). For those the
// store keeps the other choice: a section opened is stored as `false`, and
// folding it again drops it.

import { browserStorage, type ColumnStorage } from "../column-split.js";

/** One JSON object of section id to `true` for the folded ones, and `false`
 * for a section that starts folded and was opened. */
export const FOLD_STORE_KEY = "wrist-assistant-panel.pages.folds.v1";

type FoldStorage = ColumnStorage & Pick<Storage, "removeItem">;

/** The last string read, and the choices it parsed to: a draw asks once per
 * section, and the string rarely changes between draws. */
let parsed: { raw: string | null; stored: Map<string, boolean> } | undefined;

function storage(): FoldStorage | undefined {
  return browserStorage() as FoldStorage | undefined;
}

/** Each stored section id to whether it is folded. */
function storedFolds(): Map<string, boolean> {
  let raw: string | null = null;
  try {
    raw = storage()?.getItem(FOLD_STORE_KEY) ?? null;
  } catch {
    raw = null;
  }
  if (parsed !== undefined && parsed.raw === raw) return parsed.stored;
  const stored = new Map<string, boolean>();
  try {
    const map = raw ? (JSON.parse(raw) as unknown) : undefined;
    if (map !== null && typeof map === "object" && !Array.isArray(map)) {
      for (const [id, value] of Object.entries(map as Record<string, unknown>)) if (typeof value === "boolean") stored.set(id, value);
    }
  } catch {
    /* A value that does not read: nothing folded. */
  }
  parsed = { raw, stored };
  return stored;
}

/** The `uiState` key for a section: `<module>:open:<section>`. */
function stateKey(module: string, section: string): string {
  return `${module}:open:${section}`;
}

/** Whether the section is open: this visit's choice first, then the stored
 * one, else open (folded for a section that starts `folded`). */
export function sectionOpen(uiState: ReadonlyMap<string, unknown>, module: string, section: string, folded = false): boolean {
  const held = uiState.get(stateKey(module, section));
  if (typeof held === "boolean") return held;
  const stored = storedFolds().get(`${module}:${section}`);
  return stored === undefined ? !folded : !stored;
}

/** Open or fold the section, for this visit and the next. */
export function setSectionOpen(uiState: Map<string, unknown>, module: string, section: string, open: boolean, folded = false): void {
  setSectionsOpen(uiState, [{ module, section, folded }], open);
}

/** One section of one settings module, as the inspector's Collapse all
 * names it. `folded`: the section starts folded. */
export interface FoldId {
  module: string;
  section: string;
  folded?: boolean;
}

/** Whether any of the sections is open: what the inspector's head offers,
 * Collapse all while one is, Expand all once none is. */
export function anySectionOpen(uiState: ReadonlyMap<string, unknown>, ids: readonly FoldId[]): boolean {
  return ids.some((id) => sectionOpen(uiState, id.module, id.section, id.folded === true));
}

/** Open or fold every one of the sections, for this visit and the next, in
 * one write of the stored folds. Only a choice that differs from where the
 * section starts is stored. */
export function setSectionsOpen(uiState: Map<string, unknown>, ids: readonly FoldId[], open: boolean): void {
  const stored = new Map(storedFolds());
  for (const { module, section, folded } of ids) {
    uiState.set(stateKey(module, section), open);
    const id = `${module}:${section}`;
    if (open === (folded !== true)) stored.delete(id);
    else stored.set(id, !open);
  }
  try {
    const store = storage();
    if (!store) return;
    if (stored.size === 0) store.removeItem(FOLD_STORE_KEY);
    else store.setItem(FOLD_STORE_KEY, JSON.stringify(Object.fromEntries([...stored].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))));
  } catch {
    /* Storage off: the fold still holds for this visit. */
  }
}
