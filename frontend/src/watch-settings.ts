// The Watch settings view's thinking, without its drawing.
//
// A watch's behavior settings are one JSON document, the one the iPhone app
// encodes for `WCBehaviorPreferences` and keeps a copy of in Home Assistant.
// The panel edits a few of its keys: the simple ones the catalog lists. The
// catalog (`watch-settings-catalog.json`) is shared with the app, whose test
// checks every key and option in it against the Swift types, so this file
// never names a setting itself. It only knows the four kinds of row.
//
// Three rules hold for every write, and they are the reason this is its own
// module with its own tests rather than a few lines in the view:
//
// - An absent key means the watch's default. The form shows the default for
//   it, and leaves the key absent unless someone changes it.
// - A key the panel does not show is written back exactly as it was read.
//   The document has room detection, motion gestures and debug flags in it
//   that only the phone edits.
// - Nothing is ever written as null.
//
// Plan: app repo docs/pages_in_home_assistant_step2.md.

import catalogJson from "./watch-settings-catalog.json";
import type { OwnerSummary, WatchConfigRecord } from "./ha-api.js";
import { deviceKindOf } from "./version.js";

export type SettingValue = string | boolean;

export interface SettingOption {
  value: string;
  label: string;
}

/** One row of the form. `bool` is a switch, `enum` a choice of `options`,
 * `color` a `#RRGGBB` string and `entity` an entity id of `domain`. */
export interface CatalogSetting {
  key: string;
  type: "bool" | "enum" | "color" | "entity";
  label: string;
  help?: string;
  /** What the watch does when the key is absent. */
  default: SettingValue;
  options?: SettingOption[];
  domain?: string;
  /** Hide the row unless another key, after defaults, holds this value. */
  showIf?: { key: string; equals: SettingValue };
}

export interface CatalogSection {
  id: string;
  title: string;
  settings: CatalogSetting[];
}

export interface WatchSettingsCatalog {
  version: number;
  sections: CatalogSection[];
}

export const WATCH_SETTINGS_CATALOG = catalogJson as WatchSettingsCatalog;

/** A behavior document as stored: a plain JSON object. */
export type BehaviorDocument = Record<string, unknown>;

/** What the form holds that differs from the loaded document, by key. */
export type SettingEdits = ReadonlyMap<string, SettingValue>;

export function catalogSettings(catalog: WatchSettingsCatalog = WATCH_SETTINGS_CATALOG): CatalogSetting[] {
  return catalog.sections.flatMap((s) => s.settings);
}

const HEX_COLOR = /^#?[0-9a-fA-F]{6}$/;

/** A color as the watch stores it: `#` and six upper-case digits. Anything
 * longer is cut to its first six digits, since the indicator has no opacity
 * and a stored alpha would only be read as a different color. */
export function normalizeColor(value: string): string | undefined {
  const digits = value.trim().replace(/^#/, "").slice(0, 6);
  return HEX_COLOR.test(digits) ? `#${digits.toUpperCase()}` : undefined;
}

/**
 * One setting's value as the form shows it: what the document holds when it
 * holds something of the right kind, else the default.
 *
 * A stored value of the wrong kind (a string where a switch belongs, a color
 * that is not a color) is shown as the default but is not rewritten: the key
 * keeps what it had unless someone changes this row.
 */
export function settingValue(setting: CatalogSetting, document: BehaviorDocument | undefined): SettingValue {
  const raw = document?.[setting.key];
  switch (setting.type) {
    case "bool":
      return typeof raw === "boolean" ? raw : setting.default;
    case "color":
      return typeof raw === "string" && normalizeColor(raw) !== undefined ? normalizeColor(raw)! : setting.default;
    case "enum":
    case "entity":
      // An enum value the catalog does not list is still the watch's value,
      // so it is shown as it is rather than as the default (see `optionsFor`).
      return typeof raw === "string" ? raw.trim() : setting.default;
  }
}

/** Every catalog setting's value with the edits laid over the document. */
export function formValues(
  document: BehaviorDocument | undefined,
  edits: SettingEdits = new Map(),
  catalog: WatchSettingsCatalog = WATCH_SETTINGS_CATALOG,
): Map<string, SettingValue> {
  const out = new Map<string, SettingValue>();
  for (const setting of catalogSettings(catalog)) {
    out.set(setting.key, edits.has(setting.key) ? edits.get(setting.key)! : settingValue(setting, document));
  }
  return out;
}

/** Whether a row is drawn, given the form's values after defaults. A row
 * whose `showIf` names a key the form has no value for stays hidden. */
export function isShown(setting: CatalogSetting, values: ReadonlyMap<string, SettingValue>): boolean {
  if (setting.showIf === undefined) return true;
  return values.get(setting.showIf.key) === setting.showIf.equals;
}

/**
 * The edits after one row changes. A row set back to what the document
 * already says is no edit at all, so the form stops being dirty when every
 * change has been undone by hand.
 */
export function withEdit(
  edits: SettingEdits,
  document: BehaviorDocument | undefined,
  setting: CatalogSetting,
  value: SettingValue,
): Map<string, SettingValue> {
  const next = new Map(edits);
  const clean = setting.type === "color" && typeof value === "string" ? (normalizeColor(value) ?? value) : value;
  if (clean === settingValue(setting, document)) next.delete(setting.key);
  else next.set(setting.key, clean);
  return next;
}

/** The keys whose edited value differs from the loaded one. Empty means
 * there is nothing to save. */
export function dirtyKeys(
  document: BehaviorDocument | undefined,
  edits: SettingEdits,
  catalog: WatchSettingsCatalog = WATCH_SETTINGS_CATALOG,
): string[] {
  const byKey = new Map(catalogSettings(catalog).map((s) => [s.key, s]));
  return [...edits.entries()]
    .filter(([key, value]) => {
      const setting = byKey.get(key);
      return setting !== undefined && settingValue(setting, document) !== value;
    })
    .map(([key]) => key);
}

/**
 * Writes the phone makes beside a setting, which the panel has to make too or
 * the watch reads the result differently.
 *
 * Picking any top-section double-tap other than Room jump turns the older
 * room quick jump switch off on the phone. The watch still treats that switch
 * as Room jump for a double-tap set to Disabled, so leaving it on would make
 * Disabled jump to a room. Only a switch that is on is touched: the panel
 * changes as little of the document as it can.
 */
function linkedWrites(key: string, value: SettingValue, doc: Record<string, unknown>): void {
  if (key === "topSectionDoubleTapAction" && value !== "Room Jump" && doc.roomQuickJumpEnabled === true) {
    doc.roomQuickJumpEnabled = false;
  }
}

/**
 * The document a save sends: the whole loaded document, every key kept as it
 * was read, with only the edited keys changed.
 *
 * An entity left empty removes its key, which is how the phone stores "no
 * target". Every other edit is written as its value, a default included: a
 * key set back to its default may be written explicitly.
 */
export function buildSaveDocument(
  document: BehaviorDocument,
  edits: SettingEdits,
  catalog: WatchSettingsCatalog = WATCH_SETTINGS_CATALOG,
): BehaviorDocument {
  const out: Record<string, unknown> = structuredClone(document);
  const byKey = new Map(catalogSettings(catalog).map((s) => [s.key, s]));
  for (const [key, value] of edits) {
    const setting = byKey.get(key);
    if (setting === undefined) continue;
    if (setting.type === "entity" && typeof value === "string" && value.trim() === "") {
      delete out[key];
    } else if (setting.type === "color" && typeof value === "string") {
      const color = normalizeColor(value);
      if (color !== undefined) out[key] = color;
    } else {
      out[key] = typeof value === "string" ? value.trim() : value;
    }
    linkedWrites(key, value, out);
  }
  return out;
}

/** An enum's choices, plus the stored value when it is not among them, so a
 * value from a newer or older app is shown as what it is and kept unless
 * someone picks another. */
export function optionsFor(setting: CatalogSetting, value: SettingValue): SettingOption[] {
  const options = setting.options ?? [];
  if (typeof value !== "string" || value === "" || options.some((o) => o.value === value)) return options;
  return [...options, { value, label: value }];
}

/** Where a saved document has got to. `none`: the watch has no record. */
export type DeliveryState = "none" | "waiting" | "delivered";

/** The phone has a revision once a signed read has carried it to the phone
 * (or the phone wrote it), which the store records as `delivered_revision`. */
export function deliveryState(record: Pick<WatchConfigRecord, "revision" | "delivered_revision"> | undefined): DeliveryState {
  if (record === undefined || record.revision <= 0) return "none";
  return record.delivered_revision >= record.revision ? "delivered" : "waiting";
}

/** The code of a WebSocket error, such as `conflict` or `no_record`. */
export function errorCode(err: unknown): string | undefined {
  const code = (err as { code?: unknown } | null | undefined)?.code;
  return typeof code === "string" ? code : undefined;
}

/**
 * The revision the store holds, read from a `conflict` error.
 *
 * The integration's error carries only a code and a message, and the message
 * begins "stored revision is N". A `revision` field is read first, so a later
 * integration that sends one is understood without a change here. Undefined
 * when neither says.
 */
export function conflictRevision(err: unknown): number | undefined {
  const e = err as { revision?: unknown; data?: { revision?: unknown }; message?: unknown } | null | undefined;
  for (const candidate of [e?.revision, e?.data?.revision]) {
    if (typeof candidate === "number" && Number.isInteger(candidate) && candidate >= 0) return candidate;
  }
  const m = typeof e?.message === "string" ? /stored revision is (\d+)/i.exec(e.message) : null;
  return m ? Number(m[1]) : undefined;
}

/**
 * The devices whose settings this view edits: watches only. A phone has no
 * watch behavior of its own, the Library is not a device, and an orphan is
 * an id no watch answers for any more, so nothing saved under it would ever
 * be read.
 */
export function settingsWatches(owners: readonly OwnerSummary[]): OwnerSummary[] {
  return owners.filter((o) => deviceKindOf(o) === "watch" && !o.is_orphan);
}

/** The watch the view opens on: the one being edited when it is a watch,
 * else the first. Undefined when the home has none. */
export function initialWatch(watches: readonly OwnerSummary[], current: string | undefined): string | undefined {
  return watches.find((w) => w.owner_watch_id === current)?.owner_watch_id ?? watches[0]?.owner_watch_id;
}

/**
 * The visible rows of one section, cut into runs: a row on its own, or the
 * rows that show only because of the row just before them, which the view
 * draws in one box under their parent (the page indicator's five settings
 * under Page dots, a scene under Activate scene).
 */
export function sectionRuns(
  section: CatalogSection,
  values: ReadonlyMap<string, SettingValue>,
): { setting: CatalogSetting; dependents: CatalogSetting[] }[] {
  const runs: { setting: CatalogSetting; dependents: CatalogSetting[] }[] = [];
  for (const setting of section.settings) {
    if (!isShown(setting, values)) continue;
    const parent = runs[runs.length - 1];
    if (setting.showIf !== undefined && parent !== undefined && setting.showIf.key === parent.setting.key) {
      parent.dependents.push(setting);
    } else {
      runs.push({ setting, dependents: [] });
    }
  }
  return runs;
}
