// How much of a tile the page editor shows: Simple, Advanced or Expert, a
// switch in the canvas head beside Undo and Redo.
//
// Simple shows what a tile needs to work and look like itself: its name,
// size, icon, solid color, what its state shows and its tap. Advanced shows
// every tile setting, as the editor always has, with the layers kept out of
// sight. Expert adds the layers: the rows under a tile in the Tiles list,
// their rules, tap zones, templates and dragging a layer on the stage.
//
// The level is a preference of this browser, never part of a page: it
// changes only what the editor shows, and never a stored key. A setting the
// level hides that holds a value of its own is never hidden in silence: its
// card says so with a way to Advanced (`tile-settings.ts`).

import { type ColumnStorage, browserStorage } from "../column-split.js";

/** How much the editor shows. */
export type EditorLevel = "simple" | "advanced" | "expert";

/** The switch's choices, in order. */
export const EDITOR_LEVELS: readonly [EditorLevel, string][] = [
  ["simple", "Simple"],
  ["advanced", "Advanced"],
  ["expert", "Expert"],
];

/** The line beside the switch, one per level. */
export const EDITOR_LEVEL_HINTS: Readonly<Record<EditorLevel, string>> = {
  simple: "Name, size, icon, color, state and tap. No layers.",
  advanced: "Every tile setting. Layers stay hidden.",
  expert: "Every setting, plus layers, rules, templates and tap zones.",
};

/** A browser that never picked a level starts with the fewest controls. */
export const DEFAULT_EDITOR_LEVEL: EditorLevel = "simple";

/** localStorage: the level's name. */
export const EDITOR_LEVEL_KEY = "wrist-assistant-panel.pages.level.v1";

/** Whether a value is one of the levels. */
export function isEditorLevel(value: unknown): value is EditorLevel {
  return EDITOR_LEVELS.some(([level]) => level === value);
}

/** The level this browser picked, else the default: storage off, nothing
 * saved, or a value that is no level. */
export function loadEditorLevel(storage: ColumnStorage | undefined = browserStorage()): EditorLevel {
  try {
    const raw = storage?.getItem(EDITOR_LEVEL_KEY);
    return isEditorLevel(raw) ? raw : DEFAULT_EDITOR_LEVEL;
  } catch {
    return DEFAULT_EDITOR_LEVEL;
  }
}

/** Remember the level for the next visit. */
export function saveEditorLevel(level: EditorLevel, storage: ColumnStorage | undefined = browserStorage()): void {
  try {
    storage?.setItem(EDITOR_LEVEL_KEY, level);
  } catch {
    // Private windows and full storage keep the level for this visit only.
  }
}

/** Whether the level shows a tile's layers: their rows, rules, tap zones,
 * the layer editor and dragging a layer on the stage. */
export function levelShowsLayers(level: EditorLevel): boolean {
  return level === "expert";
}

/** What the page editor hands the tile settings about the level, on the
 * host as `editorLevel` (`extendHost`): the level shown, and a way to show
 * another (a card's "Show", a layer link that needs Expert). */
export interface EditorLevelLink {
  readonly level: EditorLevel;
  show(level: EditorLevel): void;
}
