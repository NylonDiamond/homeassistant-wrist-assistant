// The Watch settings view's thinking, without its drawing.
//
// A watch's behavior settings are one JSON document, the app's
// `WCBehaviorPreferences`. Home Assistant keeps it: the iPhone app sends its
// copy, or the panel makes the first one (`watchBehaviorDefaults`), and the
// watch reads it from there. The panel edits a few of its keys: the simple
// ones the catalog lists. The
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
import { watchCommandError } from "./watch-pages/save-note.js";

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

/** A device has a revision once a signed read has carried it there (the
 * watch's own check, or the iPhone's), or the iPhone wrote it, which the
 * store records as `delivered_revision`. */
export function deliveryState(record: Pick<WatchConfigRecord, "revision" | "delivered_revision"> | undefined): DeliveryState {
  if (record === undefined || record.revision <= 0) return "none";
  return record.delivered_revision >= record.revision ? "delivered" : "waiting";
}

/** Whether the phone said it could not decode the revision the store holds
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
export const WAITING_HELP_TEXT = "The watch picks it up the next time it checks, or the iPhone passes it on.";

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

// ── no record yet ────────────────────────────────────────────────────────
//
// Home Assistant holds nothing of a kind for the watch yet. The panel can
// make the first record itself (a save over revision 0, which the
// integration takes for a paired watch), or the iPhone app sends its own once
// its switch is on. Plan: app repo docs/pages_in_home_assistant_step4.md,
// "4e build contract".

/** Where the iPhone app's switch is, by its current name and place. */
const IPHONE_SWITCH_TEXT = "open the iPhone app and turn on Edit pages in Home Assistant under Settings, Pages in Home Assistant.";

/** What the page editor says when Home Assistant holds no pages from the
 * watch yet: the button, or the iPhone app's switch. */
export const PAGES_NO_RECORD_TEXT = `Start with an empty page here, or ${IPHONE_SWITCH_TEXT}`;

/** What Watch settings says when Home Assistant holds no settings from the
 * watch yet. */
export const SETTINGS_NO_RECORD_TEXT = `Start with the defaults here, or ${IPHONE_SWITCH_TEXT}`;

/** The page editor's button that makes the first pages record. */
export const PAGES_START_BUTTON = "Start with an empty page";

/** Watch settings' button that makes the first settings record. */
export const SETTINGS_START_BUTTON = "Start with the defaults";

/** The line under each Start button. A watch with an iPhone pulls only while
 * the iPhone's switch is on; with the switch off it keeps the iPhone's copy
 * and never sees what was started here. */
export const START_PHONE_FIRST_TEXT =
  "If this watch has an iPhone, turn on Edit pages in Home Assistant there first. Otherwise the watch keeps the iPhone's copy.";

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
 * for a watch it has a key for. */
export const PAIR_FIRST_TEXT = "Pair this watch first. Watch settings has Pair a watch.";

/** The same, said inside Watch settings, whose pairing card is below. */
export const SETTINGS_PAIR_FIRST_TEXT = "Pair this watch first, under Pair a watch below.";

/** A start refused as `conflict`: a record came in meanwhile and is shown. */
export const PAGES_START_CONFLICT_TEXT = "The iPhone sent pages meanwhile, so those are shown.";
export const SETTINGS_START_CONFLICT_TEXT = "The iPhone sent settings meanwhile, so those are shown.";

/** `WCBehaviorPreferences.currentSchemaVersion` in the app. */
export const BEHAVIOR_SCHEMA_VERSION = 1;

/**
 * Keys the app's decoder needs that the catalog does not show, each at the
 * app's own default (`WCBehaviorPreferences.init`). The first four are not
 * optional in Swift, so a document without them does not decode at all. The
 * list of domains that skip the pending bounce is what a fresh install of
 * the iPhone app writes; left out, the watch would bounce for every domain.
 */
const BEHAVIOR_APP_DEFAULTS: Readonly<Record<string, unknown>> = {
  crownSensitivity: "Normal",
  crownSwitchesPages: false,
  doubleTapSpeed: "Fast",
  hapticIntensity: "Medium",
  pendingAnimationDisabledDomains: [
    "automation",
    "fan",
    "input_boolean",
    "input_number",
    "input_select",
    "light",
    "media_player",
    "switch",
    "timer",
  ],
};

/**
 * The first behavior document of a watch, which "Start with the defaults"
 * saves: `schemaVersion`, every catalog setting at its default, and the keys
 * the app's decoder needs beside them (`BEHAVIOR_APP_DEFAULTS`). An entity
 * whose default is no target is left out, as the phone stores "no target".
 * Keys in sorted order, as the phone's encoder writes them. A new object on
 * every call.
 */
export function watchBehaviorDefaults(catalog: WatchSettingsCatalog = WATCH_SETTINGS_CATALOG): BehaviorDocument {
  const fields: Record<string, unknown> = { schemaVersion: BEHAVIOR_SCHEMA_VERSION };
  for (const setting of catalogSettings(catalog)) {
    if (setting.type === "entity" && setting.default === "") continue;
    fields[setting.key] = setting.default;
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
// character code; an administrator types it into the dialog's "Pair a watch"
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

/** What the card says once a watch is paired. */
export function pairedText(deviceName: string | null | undefined): string {
  return `Paired ${present(deviceName) ?? "Apple Watch"}.`;
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
