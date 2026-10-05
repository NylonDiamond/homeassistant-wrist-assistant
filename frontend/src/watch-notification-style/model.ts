// The notification style's thinking, without its drawing.
//
// A watch's notification style is one JSON document, the app's
// `NotificationStyleConfig`: how the Long Look draws a notification's
// buttons, the watch app's sounds and their volume, the delivery route and
// the Wrist Webhooks button size. Home Assistant keeps it as the kind
// `notification_style`, beside `behavior`, and the Watch settings page edits
// both behind one Save. Plan: app repo docs/pages_in_home_assistant_step4.md,
// "4d batch 2 build contract", items 10 to 12.
//
// Everything here is read from `notification-style-keys.json`, which the
// app's test builds from the Swift types: the keys, their enums and the
// phone's labels for them, the sound list, the volume range. Nothing names a
// value the table does not, because the watch's decoder fails the whole
// document on an enum value it does not know.
//
// The same three rules as the behavior settings (`watch-settings.ts`):
//
// - An absent key means the watch's default. The form shows the default and
//   leaves the key absent unless someone changes it.
// - A key the panel does not show (none today, but a newer app may add one)
//   is written back exactly as it was read.
// - Nothing is ever written as null. An optional key that should say "the
//   default" is left out instead.

import table from "./notification-style-keys.json";
import { watchCommandError } from "../watch-pages/save-note.js";
import type { WatchConfigRecord } from "../ha-api.js";
import type { TileChoice } from "../watch-settings-look.js";

/** The kind Home Assistant keeps the document under. */
export const NOTIFICATION_STYLE_KIND = "notification_style";

/** A sound key's value for "no sound". */
export const SILENT_SOUND: string = table.sounds.silentKey;

/** The form's value for an optional key that is left out: a sound that
 * falls back to the watch's own choice. Never written. */
export const ABSENT = "";

export type StyleValue = string | boolean | number;

/** A notification style document as stored: a plain JSON object. */
export type StyleDocument = Record<string, unknown>;

/** What the form holds that differs from the loaded document, by key. */
export type StyleEdits = ReadonlyMap<string, StyleValue>;

export interface StyleOption {
  value: string;
  label: string;
}

/** One row of the form. */
export interface StyleRow {
  key: string;
  type: "bool" | "enum" | "number" | "sound";
  label: string;
  help?: string;
  /** What the form shows while the key is absent. For a sound that is
   * `ABSENT` ("Default"). */
  default: StyleValue;
  /** Where the reset dot goes: the value a fresh install writes. */
  resetTo: StyleValue;
  /** An enum's choices with the phone's labels, in the Swift order. */
  options?: StyleOption[];
  /** Hide the row unless another key, after defaults, holds this value. */
  showIf?: { key: string; equals: StyleValue };
  /** The SF Symbol beside the title, the phone's where it has one. */
  icon: string;
}

export interface StyleGroup {
  label: string;
  rows: StyleRow[];
}

export interface StyleSection {
  id: "notifications" | "sounds" | "wristWebhooks";
  title: string;
  groups: StyleGroup[];
}

interface TableKey {
  type: string;
  enum?: string;
  optional?: boolean;
  required?: boolean;
  strict?: boolean;
  default: unknown;
  section?: string;
  group?: string;
  label?: string;
  help?: string;
  shownWhen?: string;
}

const KEYS = table.keys as Record<string, TableKey>;
const ENUMS = table.enums as Record<string, string[]>;
const LABELS = table.labels as Record<string, Record<string, string>>;
const SOUND_KEYS = table.sounds.keys as Record<string, { defaultLabel: string; silentOffered: boolean; absentPlays: string }>;

/** The volume slider: range, step, the phone's presets and the level at or
 * below which it reads "Silent". */
export const VOLUME = table.volume;

/** Each delivery choice's line, the phone's own. */
export const DELIVERY_DETAILS: Readonly<Record<string, string>> = table.delivery.details;

/** The icon beside each row's title. The phone's own where its screens draw
 * one (`NotificationStyleSettingsView`, `SoundSettingsView`); the rest are the
 * panel's, in the same spirit. Every one is in the symbol file the panel
 * ships, which a test checks. */
export const NOTIFICATION_STYLE_ICONS: Readonly<Record<string, string>> = {
  backgroundStyle: "rectangle.fill",
  buttonFill: "rectangle.grid.1x2.fill",
  buttonSize: "arrow.up.left.and.arrow.down.right",
  cornerStyle: "square.on.square", // panel's own; the phone's is not shipped
  useEntityTintColor: "paintpalette.fill",
  accentColor: "paintbrush.fill", // panel's own
  showButtonIcons: "photo",
  showStateBadge: "text.badge.checkmark",
  stateBadgePosition: "square.and.arrow.down",
  stateBadgeSize: "textformat.size",
  stateBadgePill: "capsule", // panel's own
  tapAnimation: "sparkles", // panel's own; the phone's is not shipped
  storedDeliveryMode: "paperplane.fill", // panel's own
  soundVolume: "speaker.wave.2.fill",
  buttonPressSound: "speaker.wave.2.fill",
  tileTapSound: "speaker.wave.2.fill",
  menuOpenSound: "speaker.wave.2.fill",
  slideToIconSound: "speaker.wave.2.fill",
  arcSlideTickSound: "speaker.wave.2.fill",
  successSound: "speaker.wave.2.fill",
  cancelSound: "speaker.wave.2.fill",
  storedWebhookButtonSize: "arrow.up.left.and.arrow.down.right",
};

/** `"useEntityTintColor is false"` as a condition on another key. */
function parseShownWhen(text: string | undefined): StyleRow["showIf"] {
  const m = text === undefined ? null : /^(\w+) is (true|false)$/.exec(text.trim());
  return m ? { key: m[1]!, equals: m[2] === "true" } : undefined;
}

/** What the form shows for an absent key: the table's default, an optional
 * enum's `absentReadsAs`, and "Default" for a sound. */
function absentValue(key: string, entry: TableKey): StyleValue {
  if (entry.type === "sound") return ABSENT;
  if (key === table.delivery.key) return table.delivery.absentReadsAs;
  if (key === table.webhookButtonSize.key) return table.webhookButtonSize.absentReadsAs;
  return entry.default as StyleValue;
}

function rowFor(key: string): StyleRow {
  const entry = KEYS[key];
  if (entry === undefined) throw new Error(`notification-style-keys.json has no key ${key}`);
  const type = entry.type as StyleRow["type"];
  const fallback = absentValue(key, entry);
  const showIf = parseShownWhen(entry.shownWhen);
  const options = entry.enum === undefined
    ? undefined
    : (ENUMS[entry.enum] ?? []).map((value) => ({ value, label: LABELS[entry.enum!]?.[value] ?? value }));
  return {
    key,
    type,
    label: entry.label ?? key,
    ...(entry.help === undefined ? {} : { help: entry.help }),
    default: fallback,
    resetTo: entry.default === null || entry.default === undefined ? fallback : (entry.default as StyleValue),
    ...(options === undefined ? {} : { options }),
    ...(showIf === undefined ? {} : { showIf }),
    icon: NOTIFICATION_STYLE_ICONS[key] ?? "questionmark.circle",
  };
}

function tableGroup(sectionId: string, label: string): string[] {
  const section = table.sections.find((s) => s.id === sectionId);
  return section?.groups.find((g) => g.label === label)?.keys ?? [];
}

function tableGroups(sectionId: string): { label: string; keys: string[] }[] {
  return table.sections.find((s) => s.id === sectionId)?.groups ?? [];
}

/**
 * The dialog's three sections, in the phone's order and grouping:
 *
 * - **Notifications**: the phone's Notification Style screen (Style, Color,
 *   Content, Animation), then Delivery from its Notifications screen.
 * - **Sounds**: Volume, then the seven sounds. The Button Press Sound sits
 *   on the phone's Style screen; here it leads the other six, so every sound
 *   is in one place.
 * - **Wrist Webhooks**: the webhook button size.
 */
function buildSections(): StyleSection[] {
  const groups = (sectionId: string, skip: readonly string[] = []) =>
    tableGroups(sectionId)
      .filter((g) => !skip.includes(g.label))
      .map((g) => ({ label: g.label, rows: g.keys.map(rowFor) }));
  const pressSound = tableGroup("notifications", "Sound");
  return [
    {
      id: "notifications",
      title: "Notifications",
      groups: [...groups("notifications", ["Sound"]), ...groups("delivery")],
    },
    {
      id: "sounds",
      title: "Sounds",
      groups: tableGroups("sounds").map((g) => ({
        label: g.label,
        rows: (g.label === "Sounds" ? [...pressSound, ...g.keys] : g.keys).map(rowFor),
      })),
    },
    { id: "wristWebhooks", title: "Wrist Webhooks", groups: groups("wristWebhooks") },
  ];
}

export const NOTIFICATION_STYLE_SECTIONS: readonly StyleSection[] = buildSections();

export function styleRows(sections: readonly StyleSection[] = NOTIFICATION_STYLE_SECTIONS): StyleRow[] {
  return sections.flatMap((s) => s.groups.flatMap((g) => g.rows));
}

const ROWS_BY_KEY = new Map(styleRows().map((r) => [r.key, r]));

export function styleRow(key: string): StyleRow | undefined {
  return ROWS_BY_KEY.get(key);
}

// ── values ───────────────────────────────────────────────────────────────

/** The decimals of a step, so 0.05 steps land on 0.35 and not on
 * 0.35000000000000003. */
function decimals(step: number): number {
  const text = String(step);
  const dot = text.indexOf(".");
  return dot < 0 ? 0 : text.length - dot - 1;
}

/** A number put into `min`..`max` and onto the nearest step from `min`. */
export function clampStep(value: number, min: number, max: number, step: number): number {
  if (!Number.isFinite(value)) return min;
  const clamped = Math.min(max, Math.max(min, value));
  if (!(step > 0)) return clamped;
  const stepped = min + Math.round((clamped - min) / step) * step;
  return Number(Math.min(max, Math.max(min, stepped)).toFixed(decimals(step)));
}

/** The volume as the phone labels it: "Silent" at or below `silentBelow`,
 * else the whole percent. */
export function volumeText(value: number): string {
  return value <= VOLUME.silentBelow ? "Silent" : `${Math.round(value * 100)}%`;
}

/**
 * One row's value as the form shows it: what the document holds when it is
 * of the right kind, else the row's default. A stored value of the wrong
 * kind is shown as the default but not rewritten unless the row changes.
 * An enum or sound value the table does not list is shown as it is.
 */
export function styleValue(row: StyleRow, document: StyleDocument | undefined): StyleValue {
  const raw = document !== undefined && Object.hasOwn(document, row.key) ? document[row.key] : undefined;
  switch (row.type) {
    case "bool":
      return typeof raw === "boolean" ? raw : row.default;
    case "number":
      return typeof raw === "number" && Number.isFinite(raw) ? raw : row.default;
    case "enum":
    case "sound":
      return typeof raw === "string" ? raw : row.default;
  }
}

/** Every row's value with the edits laid over the document. */
export function styleFormValues(document: StyleDocument | undefined, edits: StyleEdits = new Map()): Map<string, StyleValue> {
  const out = new Map<string, StyleValue>();
  for (const row of styleRows()) out.set(row.key, edits.has(row.key) ? edits.get(row.key)! : styleValue(row, document));
  return out;
}

/** Whether a row is drawn, given the form's values after defaults. */
export function styleRowShown(row: StyleRow, values: ReadonlyMap<string, StyleValue>): boolean {
  return row.showIf === undefined || values.get(row.showIf.key) === row.showIf.equals;
}

/** The visible rows of one group cut into runs: a row, and the rows that
 * show only because of it, which the view draws in one box under it. */
export function styleRuns(group: StyleGroup, values: ReadonlyMap<string, StyleValue>): { row: StyleRow; dependents: StyleRow[] }[] {
  const runs: { row: StyleRow; dependents: StyleRow[] }[] = [];
  for (const row of group.rows) {
    if (!styleRowShown(row, values)) continue;
    const parent = runs[runs.length - 1];
    if (row.showIf !== undefined && parent !== undefined && row.showIf.key === parent.row.key) parent.dependents.push(row);
    else runs.push({ row, dependents: [] });
  }
  return runs;
}

/** A value as the form keeps it: a number clamped and stepped. */
function cleanValue(row: StyleRow, value: StyleValue): StyleValue {
  if (row.type === "number" && typeof value === "number") return clampStep(value, VOLUME.min, VOLUME.max, VOLUME.step);
  return value;
}

/** The edits after one row changes. A row set back to what the document
 * already says is no edit at all. */
export function withStyleEdit(edits: StyleEdits, document: StyleDocument | undefined, row: StyleRow, value: StyleValue): Map<string, StyleValue> {
  const next = new Map(edits);
  const clean = cleanValue(row, value);
  if (clean === styleValue(row, document)) next.delete(row.key);
  else next.set(row.key, clean);
  return next;
}

/** The keys whose edited value differs from the loaded one. */
export function styleDirtyKeys(document: StyleDocument | undefined, edits: StyleEdits): string[] {
  return [...edits.entries()]
    .filter(([key, value]) => {
      const row = ROWS_BY_KEY.get(key);
      return row !== undefined && styleValue(row, document) !== value;
    })
    .map(([key]) => key);
}

const BUNDLED_SOUNDS: ReadonlySet<string> = new Set(table.sounds.bundled);

/** Whether a value may be written for a row: only what the table lists, so
 * the watch can always decode what the panel sends. */
export function writableStyleValue(row: StyleRow, value: StyleValue): boolean {
  switch (row.type) {
    case "bool":
      return typeof value === "boolean";
    case "number":
      return typeof value === "number" && Number.isFinite(value) && value >= VOLUME.min && value <= VOLUME.max;
    case "enum":
      return typeof value === "string" && (row.options ?? []).some((o) => o.value === value);
    case "sound": {
      if (value === ABSENT) return true;
      if (value === SILENT_SOUND) return SOUND_KEYS[row.key]?.silentOffered === true;
      return typeof value === "string" && BUNDLED_SOUNDS.has(value);
    }
  }
}

/**
 * The document a save sends: the whole loaded document, every key kept as
 * it was read, with only the edited keys changed. A sound set to "Default"
 * removes its key. A value the table does not list is never written.
 */
export function buildStyleSaveDocument(document: StyleDocument, edits: StyleEdits): StyleDocument {
  const out: StyleDocument = structuredClone(document);
  for (const [key, value] of edits) {
    const row = ROWS_BY_KEY.get(key);
    if (row === undefined || !writableStyleValue(row, value)) continue;
    if (row.type === "sound" && value === ABSENT) delete out[key];
    else out[key] = cleanValue(row, value);
  }
  return out;
}

/** An enum's choices, plus a stored value the table does not list, so it is
 * shown as what it is and kept unless someone picks another. */
export function styleOptionsFor(row: StyleRow, value: StyleValue): StyleOption[] {
  const options = row.options ?? [];
  if (typeof value !== "string" || value === "" || options.some((o) => o.value === value)) return options;
  return [...options, { value, label: value }];
}

/** The most choices drawn as tiles; a longer list (the accent colors) is a
 * menu. The same limit as the behavior rows. */
export const STYLE_MAX_TILES = 5;

export function styleUsesTiles(row: StyleRow): boolean {
  return row.type === "enum" && (row.options?.length ?? 0) > 0 && row.options!.length <= STYLE_MAX_TILES;
}

/** The tiles of an enum row, in the table's order, each wearing the row's
 * icon. Delivery's tiles carry the phone's line for each choice. */
export function styleTileChoices(row: StyleRow, value: StyleValue): TileChoice[] {
  const details = row.key === table.delivery.key ? DELIVERY_DETAILS : {};
  return styleOptionsFor(row, value).map((o) => ({
    value: o.value,
    name: o.label,
    ...(details[o.value] === undefined ? {} : { detail: details[o.value] }),
    icon: row.icon,
    on: o.value === value,
  }));
}

// ── sounds ───────────────────────────────────────────────────────────────

const SOUND_LABELS = new Map(table.sounds.categories.flatMap((c) => c.sounds.map((s) => [s.file, s.label] as const)));

/** A sound file's name as the phone shows it, else the file name. */
export function soundLabel(file: string): string {
  return SOUND_LABELS.get(file) ?? file;
}

export interface SoundChoices {
  /** "Default" and "None" first, and a stored value that is not offered. */
  lead: StyleOption[];
  /** The phone's Short and Longer lists. */
  groups: { label: string; options: StyleOption[] }[];
}

/**
 * A sound row's menu. "None" is no sound (`__silent__`) where the phone
 * offers it. "Default" leaves the key out, and says what the watch plays
 * then. The Button Press Sound offers no silent key, and left out it plays
 * nothing, so for it "None" is the key left out.
 */
export function soundChoices(row: StyleRow, value: StyleValue): SoundChoices {
  const facts = SOUND_KEYS[row.key];
  const lead: StyleOption[] = [];
  if (facts?.absentPlays === "nothing") {
    lead.push({ value: ABSENT, label: "None" });
  } else {
    const plays = facts?.absentPlays ?? "";
    const fallsBack = plays.startsWith("buttonPressSound");
    lead.push({ value: ABSENT, label: fallsBack ? "Default (Button Press Sound)" : `Default (${soundLabel(plays)})` });
  }
  if (facts?.silentOffered === true) lead.push({ value: SILENT_SOUND, label: "None" });
  const groups = table.sounds.categories.map((c) => ({ label: c.label, options: c.sounds.map((s) => ({ value: s.file, label: s.label })) }));
  const known = typeof value !== "string" || lead.some((o) => o.value === value) || SOUND_LABELS.has(value);
  if (!known) lead.push({ value: String(value), label: String(value) });
  return { lead, groups };
}

/** A sound value's words: "None", "Default (…)", or the sound's name. */
export function soundValueText(row: StyleRow, value: StyleValue): string {
  const choices = soundChoices(row, value);
  return choices.lead.find((o) => o.value === value)?.label ?? soundLabel(String(value));
}

// ── the first record ─────────────────────────────────────────────────────

/**
 * The first notification style of a watch, which "Start with the defaults"
 * saves: every key the app writes on a fresh install, at its default, in
 * sorted order as the phone's encoder writes them. The two optional keys
 * whose default is "absent" (delivery and the webhook button size) are left
 * out. The app's `01-defaults.json` fixture, byte for byte. A new object on
 * every call.
 */
export function notificationStyleDefaults(): StyleDocument {
  const out: StyleDocument = {};
  for (const key of Object.keys(KEYS).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))) {
    const value = KEYS[key]!.default;
    if (value !== null && value !== undefined) out[key] = value;
  }
  return out;
}

/** A stored document the panel can read: a JSON object. */
export function readStyleDocument(document: unknown): StyleDocument | undefined {
  return typeof document === "object" && document !== null && !Array.isArray(document) ? (document as StyleDocument) : undefined;
}

/** Whether a failed read means this integration does not keep the kind:
 * one older than it refuses it as `invalid`, one older than the store does
 * not know the command. The dialog then leaves the three sections out. */
export function notificationStyleReadMeansUnsupported(error: unknown): boolean {
  const code = watchCommandError(error).code;
  return code === "invalid" || code === "unknown_command";
}

// ── saving ───────────────────────────────────────────────────────────────

/** How many sends a save makes at most when it keeps meeting conflicts. */
export const STYLE_SAVE_ATTEMPTS = 3;

export interface StyleSaveIO {
  save(baseRevision: number, document: StyleDocument): Promise<{ revision: number }>;
  fetch(): Promise<WatchConfigRecord>;
}

export type StyleSaveResult =
  | {
      ok: true;
      revision: number;
      document: StyleDocument;
      /** A conflict was met and the edits were laid over the newer copy. */
      merged: boolean;
      /** The newer copy already held every edit, so nothing was sent. */
      alreadySaved: boolean;
      /** The record read on a conflict, which the caller shows. */
      fresh?: WatchConfigRecord;
    }
  | {
      ok: false;
      code: string;
      message: string;
      /** The newest record read, when a conflict read one: the caller shows it
       * and keeps the edits on top. */
      fresh?: WatchConfigRecord;
    };

/**
 * Save the edits over `record`. On a conflict the newest record is read and
 * the edits are laid over it key by key (a key edited here keeps the edit,
 * every other key takes the newer copy), then sent again, at most
 * `STYLE_SAVE_ATTEMPTS` sends in all. This is the phone's `.mergeByKey` with
 * the panel as the local side.
 */
export async function saveNotificationStyle(io: StyleSaveIO, record: { revision: number; document: StyleDocument }, edits: StyleEdits): Promise<StyleSaveResult> {
  let base = record;
  let fresh: WatchConfigRecord | undefined;
  for (let attempt = 1; ; attempt++) {
    if (attempt > 1 && styleDirtyKeys(base.document, edits).length === 0) {
      return { ok: true, revision: base.revision, document: base.document, merged: true, alreadySaved: true, ...(fresh ? { fresh } : {}) };
    }
    const document = buildStyleSaveDocument(base.document, edits);
    try {
      const { revision } = await io.save(base.revision, document);
      return { ok: true, revision, document, merged: attempt > 1, alreadySaved: false, ...(fresh ? { fresh } : {}) };
    } catch (error) {
      const { code = "unknown", message } = watchCommandError(error);
      if (code !== "conflict" || attempt >= STYLE_SAVE_ATTEMPTS) return { ok: false, code, message, ...(fresh ? { fresh } : {}) };
      try {
        fresh = await io.fetch();
      } catch (fetchError) {
        const e = watchCommandError(fetchError);
        return { ok: false, code: e.code ?? "unknown", message: e.message };
      }
      const document = readStyleDocument(fresh.document);
      if (!(fresh.revision > 0) || document === undefined) {
        return { ok: false, code: "no_record", message: "Home Assistant holds no notification style for this watch.", fresh };
      }
      base = { revision: fresh.revision, document };
    }
  }
}

/** How "Start with the defaults" ended. */
export type StyleStartResult =
  | { ok: true; revision: number; document: StyleDocument }
  | { ok: false; code: "no_record" | "conflict" | "unsupported" | "error"; message: string };

/** Create the watch's notification style from `notificationStyleDefaults()`:
 * a save over revision 0, taken only for a paired watch with no record. */
export async function startNotificationStyle(save: (baseRevision: number, document: StyleDocument) => Promise<{ revision: number }>): Promise<StyleStartResult> {
  const document = notificationStyleDefaults();
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

// ── words ────────────────────────────────────────────────────────────────

export const STYLE_NO_RECORD_TITLE = "No notification style from this watch yet.";
export const STYLE_NO_RECORD_TEXT =
  "Start with the defaults here, or open the iPhone app and turn on Edit pages in Home Assistant under Settings, Pages in Home Assistant.";
export const STYLE_START_BUTTON = "Start with the defaults";
export const STYLE_START_CONFLICT_TEXT = "The iPhone sent its notification style meanwhile, so that is shown.";
export const STYLE_UNREADABLE_TEXT =
  "Home Assistant holds a notification style for this watch that this panel cannot read. Update the integration.";
