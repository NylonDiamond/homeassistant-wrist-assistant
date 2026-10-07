// The Watch settings view's thinking, without its drawing.
//
// A watch's behavior settings are one JSON document, the app's
// `WCBehaviorPreferences`. Home Assistant keeps it: the iPhone app moves its
// copy here once, or the panel makes the first one (`watchBehaviorDefaults`),
// and the watch reads it from there. The panel is the only editor: this page
// edits the keys the catalog lists, and Rooms edits the room keys. The
// catalog (`watch-settings-catalog.json`) is shared with the app, whose test
// checks every key and option in it against the Swift types. This file knows
// the kinds of row; the few keys it names are the watch's own rules beside a
// row (`FALLBACKS`, `formLinks`, `linkedWrites`).
//
// Three rules hold for every write, and they are the reason this is its own
// module with its own tests rather than a few lines in the view:
//
// - An absent key means the watch's default. The form shows the default for
//   it, and leaves the key absent unless someone changes it.
// - A key the panel does not show is written back exactly as it was read.
//   The document has room detection and debug flags in it that this page
//   never touches.
// - Nothing is ever written as null.
//
// Plan: app repo docs/pages_in_home_assistant_step2.md.

import catalogJson from "./watch-settings-catalog.json";
import type { OwnerSummary, WatchConfigRecord } from "./ha-api.js";
import { deviceKindOf } from "./version.js";
import { watchCommandError } from "./watch-pages/save-note.js";

/**
 * The wrist twists' row as the form holds it: the three maps behind the
 * document's three JSON strings, gesture to action, gesture to scene and
 * gesture to script, each read the way the watch reads it.
 */
export interface MotionActions {
  actions: Readonly<Record<string, string>>;
  scenes: Readonly<Record<string, string>>;
  scripts: Readonly<Record<string, string>>;
}

export type SettingValue = string | boolean | number | readonly string[] | MotionActions;

export interface SettingOption {
  value: string;
  label: string;
}

/**
 * One row of the form. `bool` is a switch, `enum` a choice of `options`,
 * `color` a `#RRGGBB` string, `entity` an entity id of `domain` and `number`
 * a number from `min` to `max`. `domains` is a list of Home Assistant
 * domains, each of `options`, stored sorted. `motionGestures` is the wrist
 * twists' row: an action of `options` for each of `gestures`, kept as a JSON
 * string under `key`, with the scene and script targets as JSON strings
 * under `sceneKey` and `scriptKey`.
 */
export interface CatalogSetting {
  key: string;
  type: "bool" | "enum" | "color" | "entity" | "number" | "domains" | "motionGestures";
  label: string;
  help?: string;
  /** What the watch does when the key is absent. "" for an `entity` or
   * `motionGestures` row means nothing stored. */
  default: SettingValue;
  /** What a new watch's first document holds, where that is not what an
   * absent key means (`watchBehaviorDefaults`). */
  initial?: SettingValue;
  options?: SettingOption[];
  domain?: string;
  min?: number;
  max?: number;
  step?: number;
  gestures?: SettingOption[];
  sceneKey?: string;
  scriptKey?: string;
  /** Hide the row unless another key, after defaults, holds this value, or
   * holds anything but `notEquals`. */
  showIf?: { key: string; equals?: SettingValue; notEquals?: SettingValue };
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

export const WATCH_SETTINGS_CATALOG = catalogJson as unknown as WatchSettingsCatalog;

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
    case "number":
      return typeof raw === "number" && Number.isFinite(raw) ? raw : setting.default;
    case "domains":
      return Array.isArray(raw) && raw.every((d) => typeof d === "string") ? domainList(raw) : domainList(setting.default);
    case "motionGestures":
      return readMotionActions(setting, document);
    case "enum": {
      // A key the watch reads from older keys when it holds nothing the
      // watch knows shows what the watch falls back to.
      const fallback = FALLBACKS[setting.key];
      if (fallback !== undefined) {
        const known = typeof raw === "string" && (setting.options ?? []).some((o) => o.value === raw.trim());
        return known ? (raw as string).trim() : fallback(document ?? {});
      }
      // An enum value the catalog does not list is still the watch's value,
      // so it is shown as it is rather than as the default (see `optionsFor`).
      return typeof raw === "string" ? raw.trim() : setting.default;
    }
    case "entity":
      return typeof raw === "string" ? raw.trim() : setting.default;
  }
}

/**
 * The watch's own fallbacks, for a key it reads from older keys when the key
 * itself is absent or holds no value the watch knows.
 *
 * - `pageTitleMode`: `WCBehaviorPreferences.resolvedPageTitleMode`, read the
 *   same way in `EntityStateViewModel`. The older `showPageTitle` false is
 *   Off, the older `pageTitleStyle` "Auto" is Auto, anything else is On.
 * - `topSectionDoubleTapAction`: `ConnectionManager.topSectionDoubleTapAction`.
 *   The older room quick jump switch, on, is Room jump; else Disabled.
 */
const FALLBACKS: Readonly<Record<string, (doc: BehaviorDocument) => string>> = {
  pageTitleMode: (doc) => (doc.showPageTitle === false ? "Off" : doc.pageTitleStyle === "Auto" ? "Auto" : "On"),
  topSectionDoubleTapAction: (doc) => (doc.roomQuickJumpEnabled === true ? "Room Jump" : "Disabled"),
};

/** A list of domains as the phone stores it: each once, sorted. */
export function domainList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((d): d is string => typeof d === "string"))].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

/** Whether two form values say the same. Lists and the twists' maps are
 * compared by what they hold. */
export function sameValue(a: SettingValue | undefined, b: SettingValue | undefined): boolean {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object") return false;
  return canonical(a) === canonical(b);
}

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (typeof value === "object" && value !== null) {
    const entries = Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${canonical((value as Record<string, unknown>)[k])}`);
    return `{${entries.join(",")}}`;
  }
  return JSON.stringify(value);
}

// ── the wrist twists ─────────────────────────────────────────────────────
//
// Three JSON strings in the document, each an object of gesture to string:
// `motionGestureActionsJSON` (the action, a `MotionGestureActionType`),
// and the scene and script targets. The watch reads each with
// `JSONSerialization` as `[String: String]` and takes anything else as
// empty (`EntityStateViewModel.applyBehaviorPreferencesFromiOS`); the phone's
// editor (`MotionGestureSettingsView`, deleted) wrote them with
// `JSONSerialization`, which writes no spaces and escapes `/`.

/** The phone's old name for toggling the aimed entity, which it read as the
 * new one. The watch runs both the same. */
const LEGACY_AIMED_ACTION = "Point Control Toggle";
const AIMED_ACTION = "Toggle Aimed Entity";

/** One of the twists' strings as the watch reads it: an object whose values
 * are all strings, else empty. */
export function decodeMotionMap(raw: unknown): Record<string, string> {
  if (typeof raw !== "string" || raw === "") return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {};
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
  const entries = Object.entries(parsed as Record<string, unknown>);
  if (!entries.every(([, v]) => typeof v === "string")) return {};
  return Object.fromEntries(entries) as Record<string, string>;
}

/** A map as the phone wrote it: keys sorted, no spaces, `/` as `\/`. */
export function encodeMotionMap(map: Readonly<Record<string, string>>): string {
  const sorted: Record<string, string> = {};
  for (const key of Object.keys(map).sort()) sorted[key] = map[key]!;
  return JSON.stringify(sorted).replace(/\//g, "\\/");
}

/** The twists' row read from a document. An action stored under the phone's
 * old name reads as the new one, as the phone's editor read it. */
export function readMotionActions(setting: CatalogSetting, document: BehaviorDocument | undefined): MotionActions {
  const actions = decodeMotionMap(document?.[setting.key]);
  for (const [gesture, action] of Object.entries(actions)) if (action === LEGACY_AIMED_ACTION) actions[gesture] = AIMED_ACTION;
  return {
    actions,
    scenes: setting.sceneKey === undefined ? {} : decodeMotionMap(document?.[setting.sceneKey]),
    scripts: setting.scriptKey === undefined ? {} : decodeMotionMap(document?.[setting.scriptKey]),
  };
}

/** One gesture's action, Disabled when none is stored. */
export function motionAction(value: MotionActions, gesture: string): string {
  return value.actions[gesture] ?? "Disabled";
}

/** The row with one gesture's action picked. Its targets are kept, as the
 * phone kept them. */
export function withMotionAction(value: MotionActions, gesture: string, action: string): MotionActions {
  return { ...value, actions: { ...value.actions, [gesture]: action } };
}

/** The row with one gesture's scene or script picked; an empty one removes
 * the gesture's target, as the phone did. */
export function withMotionTarget(value: MotionActions, kind: "scenes" | "scripts", gesture: string, entityId: string): MotionActions {
  const id = entityId.trim();
  const targets = { ...value[kind] };
  if (id === "") delete targets[gesture];
  else targets[gesture] = id;
  return { ...value, [kind]: targets };
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
  const showIf = setting.showIf;
  if (showIf === undefined) return true;
  if (!values.has(showIf.key)) return false;
  const value = values.get(showIf.key);
  if (showIf.notEquals !== undefined) return !sameValue(value, showIf.notEquals);
  return sameValue(value, showIf.equals);
}

/** A value as it is kept: a color as `#RRGGBB`, a list of domains sorted. */
function cleanValue(setting: CatalogSetting, value: SettingValue): SettingValue {
  if (setting.type === "color" && typeof value === "string") return normalizeColor(value) ?? value;
  if (setting.type === "domains") return domainList(value);
  return value;
}

function putEdit(next: Map<string, SettingValue>, document: BehaviorDocument | undefined, setting: CatalogSetting, value: SettingValue): void {
  const clean = cleanValue(setting, value);
  if (sameValue(clean, settingValue(setting, document))) next.delete(setting.key);
  else next.set(setting.key, clean);
}

/**
 * The edits after one row changes, with the rows the phone moved beside it
 * (`formLinks`). A row set back to what the document already says is no
 * edit at all, so the form stops being dirty when every change has been
 * undone by hand.
 */
export function withEdit(
  edits: SettingEdits,
  document: BehaviorDocument | undefined,
  setting: CatalogSetting,
  value: SettingValue,
  catalog: WatchSettingsCatalog = WATCH_SETTINGS_CATALOG,
): Map<string, SettingValue> {
  const next = new Map(edits);
  putEdit(next, document, setting, value);
  const byKey = new Map(catalogSettings(catalog).map((s) => [s.key, s]));
  for (const [key, linked] of formLinks(setting.key, value, formValues(document, next, catalog))) {
    const other = byKey.get(key);
    if (other !== undefined) putEdit(next, document, other, linked);
  }
  return next;
}

/** The phone's twist strengths as fine tune levels, and back: Low, Medium
 * and High set 4, 6 and 8, and a level takes the strength nearest it
 * (`tierPresets` and `closestTier` in the phone's deleted
 * `MotionGestureSettingsView`). The watch tells twists apart by the level
 * alone; the strength only turns them on or off. */
export const TWIST_LEVELS: Readonly<Record<string, number>> = { Low: 4, Medium: 6, High: 8 };

export function twistStrength(level: number): string {
  return level < 5 ? "Low" : level < 7 ? "Medium" : "High";
}

/**
 * Rows the phone moved beside one row, inside the form so the page shows
 * them at once: picking a twist strength sets the fine tune to its level,
 * and moving the fine tune picks the strength nearest it while twists are
 * on. Off leaves the fine tune alone.
 */
function formLinks(key: string, value: SettingValue, values: ReadonlyMap<string, SettingValue>): [string, SettingValue][] {
  if (key === "motionGestureSensitivity" && typeof value === "string" && TWIST_LEVELS[value] !== undefined) {
    return [["motionGestureSensitivityLevel", TWIST_LEVELS[value]!]];
  }
  if (key === "motionGestureSensitivityLevel" && typeof value === "number" && values.get("motionGestureSensitivity") !== "Off") {
    return [["motionGestureSensitivity", twistStrength(value)]];
  }
  return [];
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
      return setting !== undefined && !sameValue(settingValue(setting, document), value);
    })
    .map(([key]) => key);
}

/**
 * Writes the phone makes beside a setting, which the panel has to make too or
 * the watch reads the result differently.
 *
 * - Picking any top-section double-tap other than Room jump turns the older
 *   room quick jump switch off on the phone. The watch still treats that
 *   switch as Room jump for a double-tap with no action of its own, so
 *   leaving it on would make Disabled jump to a room. Only a switch that is
 *   on is touched: the panel changes as little of the document as it can.
 *   Switch house counts as any other action.
 * - The page title is `pageTitleMode`, and the older `showPageTitle` and
 *   `pageTitleStyle` are what the watch reads when it is absent. Picking a
 *   mode writes them as the app's own `setPageTitleMode` does (Off: no
 *   title; On: a title, and an Auto style becomes Pill; Auto: a title in the
 *   Auto style), so the old keys never say something else.
 */
function linkedWrites(key: string, value: SettingValue, doc: Record<string, unknown>): void {
  if (key === "topSectionDoubleTapAction" && value !== "Room Jump" && doc.roomQuickJumpEnabled === true) {
    doc.roomQuickJumpEnabled = false;
  }
  if (key === "pageTitleMode" && (value === "Off" || value === "On" || value === "Auto")) {
    doc.showPageTitle = value !== "Off";
    if (value === "Auto") doc.pageTitleStyle = "Auto";
    else if (value === "On" && doc.pageTitleStyle === "Auto") doc.pageTitleStyle = "Pill";
  }
}

/** The twists' strings a save writes: only a map that changed, and an empty
 * one as no key, as the watch's own encoder stores none. */
function writeMotion(setting: CatalogSetting, document: BehaviorDocument, value: SettingValue, out: Record<string, unknown>): void {
  if (typeof value !== "object" || Array.isArray(value)) return;
  const motion = value as MotionActions;
  const before = readMotionActions(setting, document);
  const parts: [string | undefined, keyof MotionActions][] = [[setting.key, "actions"], [setting.sceneKey, "scenes"], [setting.scriptKey, "scripts"]];
  for (const [key, part] of parts) {
    if (key === undefined || canonical(before[part]) === canonical(motion[part])) continue;
    if (Object.keys(motion[part]).length === 0) delete out[key];
    else out[key] = encodeMotionMap(motion[part]);
  }
}

/**
 * The document a save sends: the whole loaded document, every key kept as it
 * was read, with only the edited keys changed.
 *
 * An entity left empty removes its key, which is how the phone stores "no
 * target", and so does a list of domains left empty, as the phone's encoder
 * did. The twists' row writes only the strings that changed
 * (`writeMotion`). Every other edit is written as its value, a default
 * included: a key set back to its default may be written explicitly.
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
    } else if (setting.type === "domains") {
      const list = domainList(value);
      if (list.length === 0) delete out[key];
      else out[key] = list;
    } else if (setting.type === "motionGestures") {
      writeMotion(setting, document, value, out);
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

/** A device has a revision once the watch's own signed read has carried it
 * there, or the watch's iPhone wrote it in its one-time move, which the
 * store records as `delivered_revision`. */
export function deliveryState(record: Pick<WatchConfigRecord, "revision" | "delivered_revision"> | undefined): DeliveryState {
  if (record === undefined || record.revision <= 0) return "none";
  return record.delivered_revision >= record.revision ? "delivered" : "waiting";
}

/** Whether a device said it could not decode the revision the store holds
 * now. An older rejection is history: a later save replaced what it was
 * about. False on an integration that does not send the field. */
export function rejectedNow(record: Pick<WatchConfigRecord, "revision" | "rejected_revision"> | undefined): boolean {
  if (record === undefined || record.revision <= 0) return false;
  return record.rejected_revision === record.revision;
}

/** Who saved a record, for the head lines: "saved here" for the panel, else
 * "from the watch" (the writer signed as the watch's own pair, whether the
 * watch or its iPhone sent it). Lower case; the caller capitalises. */
export function savedByWords(updatedBy: string | null | undefined): string {
  return updatedBy === "panel" ? "saved here" : "from the watch";
}

/** The pill and its help line while a save waits for a device. */
export const WAITING_PILL_TEXT = "Waiting to be collected";
export const COLLECTED_PILL_TEXT = "Collected";
export const WAITING_HELP_TEXT = "The watch picks it up the next time it checks.";

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

/** A watch's name in the tabs and the head. Both real watches report
 * themselves as "Apple Watch", so a name two watches share takes the paired
 * phone's, the way the panel's device list tells them apart. */
export function watchName(watch: OwnerSummary, watches: readonly OwnerSummary[]): string {
  const name = watch.device_name ?? watch.owner_watch_id;
  const shared = watches.filter((w) => (w.device_name ?? w.owner_watch_id) === name).length > 1;
  return shared && watch.paired_iphone_name ? `${name} (${watch.paired_iphone_name})` : name;
}

// ── the main house ───────────────────────────────────────────────────────
//
// A watch with several homes takes its watch settings and notification style
// from one, its main house, and the integration marks the watch on any other
// (`main_house: false` on the owner row). There the page says where to change
// them instead of offering an editor the watch would never read. Plan: app
// repo docs/pages_in_home_assistant_step5_settings_owner.md.

/** What Watch settings shows, in place of both editors, on a home that is not
 * the watch's main house. */
export const SETTINGS_MAIN_HOUSE_TEXT = "This watch takes its settings from your main house. Change them there.";

/** Whether `owner` takes its watch settings and notification style from
 * another home. Only an explicit `false` does: an older integration, and a
 * watch with one home, send nothing. */
export function takesSettingsFromAnotherHome(owner: Pick<OwnerSummary, "main_house"> | undefined): boolean {
  return owner?.main_house === false;
}

// ── no record yet ────────────────────────────────────────────────────────
//
// Home Assistant holds nothing of a kind for the watch yet. The panel can
// make the first record itself (a save over revision 0, which the
// integration takes for a paired watch), or the iPhone app moves its own
// copy here once, the first time the updated app opens. That move sends a
// kind only while Home Assistant holds none, so a start here first would
// leave the iPhone's setup behind for good. While an iPhone may still send
// it (`has_iphone` on the owner row) every watch editor waits instead, and
// the start becomes a small link that asks first. Plans: app repo
// docs/pages_in_home_assistant_step4.md, "4e build contract", and
// docs/phone_watch_link_removal_2026-10.md, step 6, "Panel waits for the
// move".

/** What a watch editor offers when Home Assistant holds no record of its
 * kind. `wait`: an iPhone may still move the watch's setup here, so the text
 * says so and the start is a small link that asks first. `start`: the
 * editor's own Start button, as before. */
export type NoRecordStart = "wait" | "start";

/** The no-record state for the watch being edited. Only an explicit `true`
 * waits: a watch with no iPhone, and an integration older than the field,
 * keep the Start button, so old data meets no new block. */
export function noRecordStart(owner: Pick<OwnerSummary, "has_iphone"> | undefined): NoRecordStart {
  return owner?.has_iphone === true ? "wait" : "start";
}

/** The no-record line while the iPhone's move may still come. */
export const WAIT_FOR_IPHONE_TEXT =
  "Waiting for your iPhone. Update Wrist Assistant on your iPhone and open it once. Your watch setup moves here by itself.";

/** The small link that starts anyway while the move may still come. */
export const START_FRESH_BUTTON = "Start fresh instead";

/** What the link asks before it starts. */
export const START_FRESH_CONFIRM_TEXT = "Your iPhone's setup will not move. Start fresh?";

/** The no-record line for `state`: the wait text, or the editor's own. */
export function noRecordText(state: NoRecordStart, startText: string): string {
  return state === "wait" ? WAIT_FOR_IPHONE_TEXT : startText;
}

/** Whether a start may go ahead. While waiting it asks first, with the one
 * modal the panel uses (`window.confirm`); tests pass their own `ask`. */
export function mayStart(
  state: NoRecordStart,
  ask: (text: string) => boolean = (text) => window.confirm(text),
): boolean {
  return state === "start" || ask(START_FRESH_CONFIRM_TEXT);
}

/** What the page editor says when Home Assistant holds no pages from the
 * watch yet and no iPhone will send any. */
export const PAGES_NO_RECORD_TEXT = "Start with an empty page to begin.";

/** What Watch settings says when Home Assistant holds no settings from the
 * watch yet and no iPhone will send any. */
export const SETTINGS_NO_RECORD_TEXT = "Start with the defaults to begin.";

/** The page editor's button that makes the first pages record. */
export const PAGES_START_BUTTON = "Start with an empty page";

/** Watch settings' button that makes the first settings record. */
export const SETTINGS_START_BUTTON = "Start with the defaults";

/** What the page editor says when Home Assistant holds a pages record this
 * panel cannot read, such as one from a newer schema. There is no Start: a
 * save over revision 0 would only meet a conflict. */
export const PAGES_UNREADABLE_TEXT = "Home Assistant holds pages for this watch that this panel cannot read. Update the integration.";

/** The same for Watch settings. */
export const SETTINGS_UNREADABLE_TEXT = "Home Assistant holds settings for this watch that this panel cannot read. Update the integration.";

/** Whether Home Assistant holds a record (revision above 0) whose document
 * `read` cannot take: not "no record yet", so no Start is offered. */
export function watchRecordUnreadable(record: WatchConfigRecord | undefined, read: (document: unknown) => unknown): boolean {
  return record !== undefined && record.revision > 0 && read(record.document) === undefined;
}

/** A start refused as `no_record`: the integration makes a first record only
 * for a watch it has a key for. The path is the one the panel shows: the
 * Watch app tab, its Settings page, the Pair a watch card. */
export const PAIR_FIRST_TEXT = "Pair this watch first. Go to Watch app, Settings, Pair a watch.";

/** The same, said inside Watch settings, whose pairing card is below. */
export const SETTINGS_PAIR_FIRST_TEXT = "Pair this watch first, under Pair a watch on this page.";

/** A start refused as `conflict`: a record came in meanwhile (the iPhone's
 * one-time move, or another panel) and is shown. */
export const PAGES_START_CONFLICT_TEXT = "Pages for this watch arrived meanwhile, so those are shown.";
export const SETTINGS_START_CONFLICT_TEXT = "Settings for this watch arrived meanwhile, so those are shown.";

/** `WCBehaviorPreferences.currentSchemaVersion` in the app. */
export const BEHAVIOR_SCHEMA_VERSION = 1;

/**
 * Keys the app's decoder needs that the catalog does not show, each at the
 * app's own default (`WCBehaviorPreferences.init`). They are not optional in
 * Swift, so a document without them does not decode at all. The watch reads
 * none of the four any more (the crown no longer turns pages, and the grid
 * takes neither the double-tap speed nor the haptic strength), so they have
 * no row.
 */
const BEHAVIOR_APP_DEFAULTS: Readonly<Record<string, unknown>> = {
  crownSensitivity: "Normal",
  crownSwitchesPages: false,
  doubleTapSpeed: "Fast",
  hapticIntensity: "Medium",
};

/**
 * The first behavior document of a watch, which "Start with the defaults"
 * saves: `schemaVersion`, every catalog setting at its `initial` value or
 * else its default, and the keys the app's decoder needs beside them
 * (`BEHAVIOR_APP_DEFAULTS`). A row whose default is nothing stored (an
 * entity with no target, no twist actions) is left out, as the phone stores
 * none. Keys in sorted order, as the phone's encoder writes them. A new
 * object on every call.
 */
export function watchBehaviorDefaults(catalog: WatchSettingsCatalog = WATCH_SETTINGS_CATALOG): BehaviorDocument {
  const fields: Record<string, unknown> = { schemaVersion: BEHAVIOR_SCHEMA_VERSION };
  for (const setting of catalogSettings(catalog)) {
    if ((setting.type === "entity" || setting.type === "motionGestures") && setting.default === "") continue;
    fields[setting.key] = structuredClone(setting.initial ?? setting.default);
  }
  for (const [key, value] of Object.entries(BEHAVIOR_APP_DEFAULTS)) {
    if (!Object.hasOwn(fields, key)) fields[key] = structuredClone(value);
  }
  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(fields).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))) sorted[key] = fields[key];
  return sorted;
}

/** How "Start with the defaults" ended in Watch settings. */
export type WatchBehaviorStartResult =
  | { ok: true; revision: number; document: BehaviorDocument }
  | { ok: false; code: "no_record" | "conflict" | "unsupported" | "error"; message: string };

/**
 * Create the watch's behavior record from `watchBehaviorDefaults()`: a save
 * over revision 0. `no_record` back means the watch is not paired,
 * `conflict` that a record came meanwhile (the caller reads it),
 * `unknown_command` an integration too old to keep watch config. Any other
 * refusal is an error in Home Assistant's own words.
 */
export async function createWatchBehavior(
  save: (baseRevision: number, document: BehaviorDocument) => Promise<{ revision: number }>,
): Promise<WatchBehaviorStartResult> {
  const document = watchBehaviorDefaults();
  try {
    const { revision } = await save(0, document);
    return { ok: true, revision, document };
  } catch (err) {
    const { code, message } = watchCommandError(err);
    if (code === "no_record" || code === "conflict") return { ok: false, code, message };
    if (code === "unknown_command") return { ok: false, code: "unsupported", message };
    return { ok: false, code: "error", message };
  }
}

// ── pairing a watch by its code ──────────────────────────────────────────
//
// A watch with no iPhone asks Home Assistant for a pairing and shows a six
// character code; an administrator types it into the Settings page's "Pair a watch"
// card. Plan: app repo docs/pages_in_home_assistant_step4.md, 4c.

/** A pairing code's length. */
export const PAIR_CODE_LENGTH = 6;

/** What the card says when no watch is waiting on the code typed. */
export const PAIR_NOT_FOUND_TEXT = "No pairing with that code. Codes last 10 minutes.";

/** The warning under a watch that already has a key here. */
export const PAIR_ALREADY_PAIRED_TEXT = "This watch is already paired. Pairing again gives it a new key.";

/** The warning under a watch whose key another user made. */
export const PAIR_OTHER_USER_TEXT = "This watch was paired by another user.";

/** A code as the server compares it: trimmed, upper-case, without the spaces
 * and hyphens people type to group it, and nothing that is not a letter or
 * a digit from 2 to 9 (the code's alphabet has no 0 or 1). */
export function normalizePairCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/[\s-]+/g, "").replace(/[^A-Z2-9]/g, "");
}

/** Whether a normalized code is whole and worth looking up. */
export function pairCodeIsComplete(code: string): boolean {
  return code.length === PAIR_CODE_LENGTH && /^[A-Z2-9]+$/.test(code);
}

/** The fields of a found pairing that the card describes. */
export interface PairLookupFacts {
  device_name?: string | null;
  app_version?: string | null;
  app_build?: string | null;
  already_paired?: boolean;
  paired_by_other_user?: boolean;
}

function present(value: string | null | undefined): string | undefined {
  const text = value?.trim();
  return text ? text : undefined;
}

/** The watch a code belongs to, as "Apple Watch Series 11, app 3.0.1 (2)".
 * A watch with no name is "Apple Watch"; with no app version the app part is
 * left out, and with no build only the version is given. */
export function pairLookupLine(lookup: PairLookupFacts): string {
  const name = present(lookup.device_name) ?? "Apple Watch";
  const version = present(lookup.app_version);
  if (version === undefined) return name;
  const build = present(lookup.app_build);
  return `${name}, app ${version}${build === undefined ? "" : ` (${build})`}`;
}

/** The warnings to read before pairing, in the order the card shows them. */
export function pairLookupWarnings(lookup: PairLookupFacts): string[] {
  const out: string[] = [];
  if (lookup.already_paired === true) out.push(PAIR_ALREADY_PAIRED_TEXT);
  if (lookup.paired_by_other_user === true) out.push(PAIR_OTHER_USER_TEXT);
  return out;
}

/** The warning under a request from an address outside the home network. */
export const PAIR_REMOTE_WARNING_TEXT = "The request came from outside your network. Only pair a watch you expect.";

/** When and from where the watch asked: "Requested 12 s ago from
 * 172.16.43.50", or "Requested 2 min ago" past 90 seconds and without an
 * address. Undefined when the reply carries neither, as an integration from
 * before these fields sends. */
export function pairRequestLine(lookup: { remote?: string | null; age_seconds?: number | null }): string | undefined {
  const remote = present(lookup.remote);
  const age = lookup.age_seconds;
  let when = "";
  if (typeof age === "number" && Number.isFinite(age)) {
    const seconds = Math.max(0, Math.round(age));
    when = seconds > 90 ? ` ${Math.floor(seconds / 60)} min ago` : ` ${seconds} s ago`;
  }
  if (when === "" && remote === undefined) return undefined;
  return `Requested${when}${remote === undefined ? "" : ` from ${remote}`}`;
}

/** Whether an address is on the home network or the machine itself:
 * 10/8, 172.16/12, 192.168/16 and loopback for IPv4, loopback, link local
 * and unique local for IPv6. An IPv4 address written in IPv6 form counts as
 * its IPv4 self. */
export function isPrivateAddress(address: string): boolean {
  let a = address.trim().toLowerCase();
  if (a.startsWith("[") && a.endsWith("]")) a = a.slice(1, -1);
  if (a.startsWith("::ffff:") && a.includes(".")) a = a.slice("::ffff:".length);
  if (a.startsWith("10.") || a.startsWith("192.168.") || a.startsWith("127.")) return true;
  const v4 = /^172\.(\d{1,3})\./.exec(a);
  if (v4) {
    const second = Number(v4[1]);
    return second >= 16 && second <= 31;
  }
  return a === "::1" || a.startsWith("fe80:") || (a.includes(":") && (a.startsWith("fc") || a.startsWith("fd")));
}

/** The warning for a request from outside the home network. An unknown
 * address gets none: there is nothing to say about it. */
export function pairRemoteWarning(remote: string | null | undefined): string | undefined {
  const address = present(remote);
  if (address === undefined || isPrivateAddress(address)) return undefined;
  return PAIR_REMOTE_WARNING_TEXT;
}

/** What the card says once a watch is paired, naming the person when it was
 * paired for someone other than the administrator at the card. */
export function pairedText(deviceName: string | null | undefined, forWhom?: string): string {
  const whom = present(forWhom);
  return `Paired ${present(deviceName) ?? "Apple Watch"}${whom === undefined ? "" : ` for ${whom}`}.`;
}

/** The title of the card's user menu. */
export const PAIR_USER_TITLE = "Whose watch is this?";

/** The line under the user menu: what the answer decides. */
export const PAIR_USER_HINT = "The watch runs with this person's rights, and their iPhone gets its Fast alerts.";

/** The user fields the menu reads, as `config/auth/list` reports them. */
export interface PairUserFacts {
  id: string;
  name?: string | null;
  username?: string | null;
  is_active?: boolean;
  system_generated?: boolean;
}

/** One entry in the "Whose watch is this?" menu. */
export interface PairUserChoice {
  id: string;
  label: string;
}

/** The people a watch can be paired for: active users Home Assistant did not
 * make for itself (the server refuses the others), the administrator at the
 * card first as "Name (you)", then the rest by name. */
export function pairUserChoices(users: readonly PairUserFacts[], adminId: string | undefined): PairUserChoice[] {
  const people = users.filter((u) => u.is_active !== false && u.system_generated !== true);
  const label = (u: PairUserFacts) => present(u.name) ?? present(u.username) ?? u.id;
  const you = people.filter((u) => u.id === adminId).map((u) => ({ id: u.id, label: `${label(u)} (you)` }));
  const rest = people
    .filter((u) => u.id !== adminId)
    .map((u) => ({ id: u.id, label: label(u) }))
    .sort((a, b) => a.label.localeCompare(b.label));
  return [...you, ...rest];
}

/** Who the menu starts on: the user a known watch is bound to, so pairing it
 * again does not quietly hand it to the administrator, else the
 * administrator, else the first choice. */
export function pairDefaultUser(
  choices: readonly PairUserChoice[],
  adminId: string | undefined,
  boundUserId: string | null | undefined,
): string | undefined {
  const has = (id: string | null | undefined) => id != null && choices.some((c) => c.id === id);
  if (has(boundUserId)) return boundUserId ?? undefined;
  if (has(adminId)) return adminId;
  return choices[0]?.id;
}

/** The `user_id` the confirm sends: none for the administrator at the card,
 * which is the server's default and the only form an older integration
 * takes. */
export function pairUserToSend(picked: string | undefined, adminId: string | undefined): string | undefined {
  return picked === undefined || picked === adminId ? undefined : picked;
}

/** The card's line for a refusal. An integration from before pairing does
 * not know the command at all, which HA reports as `unknown_command`. */
export function pairErrorText(err: unknown, step: "lookup" | "confirm"): string {
  if (errorCode(err) === "unknown_command") return "Update the Wrist Assistant integration to pair a watch with a code.";
  const message = String((err as { message?: string } | null | undefined)?.message ?? err);
  return step === "lookup" ? `Could not look up that code: ${message}` : `Could not pair: ${message}`;
}

/** The watch the view opens on: the one being edited when it is a watch,
 * else the first. Undefined when the home has none. */
export function initialWatch(watches: readonly OwnerSummary[], current: string | undefined): string | undefined {
  return watches.find((w) => w.owner_watch_id === current)?.owner_watch_id ?? watches[0]?.owner_watch_id;
}

/**
 * The watch a watch screen should open next, or undefined to stay on the one
 * it shows.
 *
 * With none shown, or one that has left the list, it opens the one the panel
 * hands it (`ownerId`), else the first, as `initialWatch` decides. Once a
 * listed watch is open it moves only when asked to follow the panel's choice
 * (`follow`), and then only to a listed watch: a screen whose own picker the
 * panel has taken over follows every change, and one with its own picker
 * follows a new `ownerId` but keeps a watch the person picked in it. Kept
 * drafts are per watch, so moving loses nothing.
 */
export function followWatch(
  watches: readonly OwnerSummary[],
  shown: string | undefined,
  ownerId: string | undefined,
  follow: boolean,
): string | undefined {
  if (shown === undefined || !watches.some((w) => w.owner_watch_id === shown)) {
    const id = initialWatch(watches, ownerId);
    return id !== shown ? id : undefined;
  }
  if (!follow || ownerId === undefined || ownerId === shown) return undefined;
  return watches.some((w) => w.owner_watch_id === ownerId) ? ownerId : undefined;
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
