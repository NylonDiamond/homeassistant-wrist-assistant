// Which settings sections a person folded, kept across reloads.
//
// Every section of the tile, page and smart settings starts open, so the
// controls are in view without a click. A fold is a way to put a section
// away, and it stays put: the choice is held in the editor's `uiState` for
// this visit and in localStorage for the next one. Only folded sections are
// stored; opening one again drops it. A watch switch clears `uiState`, and
// the stored folds still answer then.

import { browserStorage, type ColumnStorage } from "../column-split.js";

/** One JSON object of section id to `true`, for the folded ones only. */
export const FOLD_STORE_KEY = "wrist-assistant-panel.pages.folds.v1";

type FoldStorage = ColumnStorage & Pick<Storage, "removeItem">;

/** The last string read, and the set it parsed to: a draw asks once per
 * section, and the string rarely changes between draws. */
let parsed: { raw: string | null; closed: Set<string> } | undefined;

function storage(): FoldStorage | undefined {
  return browserStorage() as FoldStorage | undefined;
}

function storedFolds(): Set<string> {
  let raw: string | null = null;
  try {
    raw = storage()?.getItem(FOLD_STORE_KEY) ?? null;
  } catch {
    raw = null;
  }
  if (parsed !== undefined && parsed.raw === raw) return parsed.closed;
  const closed = new Set<string>();
  try {
    const map = raw ? (JSON.parse(raw) as unknown) : undefined;
    if (map !== null && typeof map === "object" && !Array.isArray(map)) {
      for (const [id, value] of Object.entries(map as Record<string, unknown>)) if (value === true) closed.add(id);
    }
  } catch {
    /* A value that does not read: nothing folded. */
  }
  parsed = { raw, closed };
  return closed;
}

/** The `uiState` key for a section: `<module>:open:<section>`. */
function stateKey(module: string, section: string): string {
  return `${module}:open:${section}`;
}

/** Whether the section is open: this visit's choice first, then the stored
 * fold, else open. */
export function sectionOpen(uiState: ReadonlyMap<string, unknown>, module: string, section: string): boolean {
  const held = uiState.get(stateKey(module, section));
  if (typeof held === "boolean") return held;
  return !storedFolds().has(`${module}:${section}`);
}

/** Open or fold the section, for this visit and the next. */
export function setSectionOpen(uiState: Map<string, unknown>, module: string, section: string, open: boolean): void {
  uiState.set(stateKey(module, section), open);
  const id = `${module}:${section}`;
  const closed = new Set(storedFolds());
  if (open) closed.delete(id);
  else closed.add(id);
  try {
    const store = storage();
    if (!store) return;
    if (closed.size === 0) store.removeItem(FOLD_STORE_KEY);
    else store.setItem(FOLD_STORE_KEY, JSON.stringify(Object.fromEntries([...closed].sort().map((k) => [k, true]))));
  } catch {
    /* Storage off: the fold still holds for this visit. */
  }
}
