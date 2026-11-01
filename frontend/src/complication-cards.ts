// What the Complications list works out about its cards, apart from the panel
// so a test can reach it: which designs are empty, what a search can find in a
// design besides its name, how the device tabs fold, how the Not on a device
// designs fold, and the device ticks an editor holds until Save.

import { type CustomComplicationConfig, cornerHasContent } from "./model.js";
import type { PickerListRow, PickerTab } from "./pickerRows.js";
import { isShelvedRow } from "./pickerRows.js";

/** What a card with nothing on it says, in its dashed slot. */
export const EMPTY_DESIGN_TEXT = "Empty, no layers";

/** The search field's words: a design can be found by the entity it reads. */
export const COMP_SEARCH_PLACEHOLDER = "Search by name, person or entity";

/**
 * Whether a design holds nothing anyone made: no layers, no control, no curved
 * text or bezel, no line of its own, no ground, no tap of its own, no values,
 * no notes. Strict on purpose: "Delete empty…" goes by this, so a design with
 * only a background color or a tap set stays a design.
 */
export function isEmptyDesign(cfg: CustomComplicationConfig): boolean {
  if (cfg.elements.length > 0 || cfg.control !== undefined) return false;
  if (cfg.values.length > 0 || cfg.dataSources.length > 0) return false;
  if (cfg.notes !== undefined && cfg.notes.trim() !== "") return false;
  if (cfg.tapAction.type !== "refresh" && cfg.tapAction.type !== "openApp") return false;
  for (const layout of Object.values(cfg.perFamily)) {
    if (layout === undefined) continue;
    if (cornerHasContent(layout)) return false;
    if (layout.backgroundColorHex !== undefined || layout.backgroundFill !== undefined || layout.borderColorHex !== undefined) return false;
    if (layout.rules.length > 0) return false;
  }
  // An Inline shape is its one line, which is never empty as made.
  if (cfg.supportedFamilies.includes("inline")) return false;
  return true;
}

/** What a search can find in a design's document, beyond its name. */
export interface DesignSearchText {
  /** Every entity id it names, lower case. */
  entities: string[];
  /** The other text it keeps about those entities (stored names and
   * templates), lower case. */
  words: string[];
}

const ENTITY_KEYS = new Set(["entityId", "entity_id"]);
const NAME_KEYS = new Set(["displayName"]);
const ENTITY_IN_TEMPLATE = /\b[a-z_]+\.[a-z0-9_]+\b/g;

function isTemplate(text: string): boolean {
  return text.includes("{{") || text.includes("{%");
}

/**
 * Walk a stored document for what it reads: the entity ids in its values, taps
 * and rules, the names stored beside them, and its templates. Only these: plain
 * labels and icon names ("house.fill") would turn a search for an entity into
 * a search of everything.
 */
export function designSearchText(document: unknown): DesignSearchText {
  const entities = new Set<string>();
  const words = new Set<string>();
  const walk = (value: unknown, key: string | undefined) => {
    if (typeof value === "string") {
      if (value === "") return;
      const low = value.toLocaleLowerCase();
      if (key !== undefined && ENTITY_KEYS.has(key)) entities.add(low);
      else if (key !== undefined && NAME_KEYS.has(key)) words.add(low);
      else if (isTemplate(value)) {
        words.add(low);
        for (const hit of low.match(ENTITY_IN_TEMPLATE) ?? []) entities.add(hit);
      }
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value) walk(item, key);
      return;
    }
    if (value !== null && typeof value === "object") {
      for (const [k, v] of Object.entries(value)) walk(v, k);
    }
  };
  walk(document, undefined);
  return { entities: [...entities], words: [...words] };
}

/** Whether what was typed (lower case) is in a design's entities, in the text
 * it keeps about them, or in an entity's name as Home Assistant has it now. */
export function designTextMatches(text: DesignSearchText, query: string, friendlyOf: (entityId: string) => string | undefined): boolean {
  if (query === "") return false;
  if (text.entities.some((id) => id.includes(query))) return true;
  if (text.words.some((word) => word.includes(query))) return true;
  return text.entities.some((id) => friendlyOf(id)?.toLocaleLowerCase().includes(query) === true);
}

/** The device tabs, as the row draws them. */
export interface TabRow {
  all: PickerTab | undefined;
  /** The devices holding something, and the one on screen whatever it holds. */
  shown: PickerTab[];
  /** The devices holding nothing, behind "+N more". */
  more: PickerTab[];
  /** Not on a device: a state rather than a device, a chip of its own. */
  shelf: PickerTab | undefined;
}

/**
 * One row of tabs: All, the devices with something on them, "+N more" for the
 * rest, then Not on a device set apart. A device with nothing stays reachable,
 * and once it is picked it stands in the row with the others.
 */
export function splitPickerTabs(tabs: readonly PickerTab[], current: string): TabRow {
  const row: TabRow = { all: undefined, shown: [], more: [], shelf: undefined };
  for (const tab of tabs) {
    if (tab.kind === "all") row.all = tab;
    else if (tab.kind === "library") row.shelf = tab;
    else if (tab.count > 0 || tab.key === current) row.shown.push(tab);
    else row.more.push(tab);
  }
  return row;
}

/** The All tab cut in two: what is on a device, then what is not. */
export interface ShelfFold<T> {
  placed: PickerListRow<T>[];
  /** The designs on no device, real ones before empty ones. */
  shelved: PickerListRow<T>[];
  /** The empty ones among `shelved`. */
  empty: PickerListRow<T>[];
}

export function foldShelf<T>(rows: readonly PickerListRow<T>[], isEmpty: (row: PickerListRow<T>) => boolean): ShelfFold<T> {
  const placed: PickerListRow<T>[] = [];
  const real: PickerListRow<T>[] = [];
  const empty: PickerListRow<T>[] = [];
  for (const row of rows) {
    if (!isShelvedRow(row)) placed.push(row);
    else if (isEmpty(row)) empty.push(row);
    else real.push(row);
  }
  return { placed, shelved: [...real, ...empty], empty };
}

/** The closed row's count: "(50) · 48 empty", or "(2)" with none empty. */
export function shelfFoldCount(shelved: number, empty: number): string {
  return empty > 0 ? `(${shelved}) · ${empty} empty` : `(${shelved})`;
}

/** The question "Delete empty…" asks first. */
export function deleteEmptyAsk(count: number): string {
  return count === 1 ? "Delete 1 empty design?" : `Delete ${count} empty designs?`;
}

/** What the toast says once they have gone. */
export function deleteEmptyDone(count: number): string {
  return count === 1 ? "Deleted 1 empty design." : `Deleted ${count} empty designs.`;
}

/**
 * The device ticks an editor holds while its draft has unsaved work.
 *
 * A tick writes the design to that device, so ticking in the middle of an edit
 * would either send the edit with it or leave it behind. It waits for Save
 * instead, and ticking back to where it was takes it out of the queue.
 */
export function queueDeviceTick(queue: ReadonlyMap<string, boolean>, ownerId: string, want: boolean, isOn: boolean): Map<string, boolean> {
  const next = new Map(queue);
  if (want === isOn) next.delete(ownerId);
  else next.set(ownerId, want);
  return next;
}

/** The order the queue runs in: devices gained first, so taking the design off
 * its last device never sends it under Not on a device on the way. */
export function queueOrder(queue: ReadonlyMap<string, boolean>): [string, boolean][] {
  return [...queue].sort(([, a], [, b]) => Number(b) - Number(a));
}

/** What stays queued when the tick at `failedAt` in a run (`queueOrder`) fails:
 * that tick, so its chip still shows it, and the ones not reached. */
export function queueAfterFailure(run: readonly (readonly [string, boolean])[], failedAt: number): Map<string, boolean> {
  return new Map(run.slice(failedAt));
}

/** The line beside the editor's device question. */
export function deviceStripNote(input: { queued: number; on: number }): string {
  if (input.queued > 0) return input.queued === 1 ? "1 change waits for Save" : `${input.queued} changes wait for Save`;
  return input.on === 0 ? "On no device yet. Changes here apply at once" : "Changes here apply at once";
}
