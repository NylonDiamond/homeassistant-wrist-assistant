// What the tile settings view shows, without any drawing: which sections a
// tile gets, the menus with their "Default (...)" first entries, the words
// under a field, and the short reasons a typed value is refused for.
//
// `tile-settings.ts` draws from these and writes only through the setters
// in `tile-settings-model.ts`. Kept apart so every list and every sentence
// here can be tested without a DOM.
//
// Plan: app repo docs/pages_in_home_assistant_step3.md ("3c build contract").

import {
  type WatchChoice,
  type WatchSlideDirection,
  WATCH_FONT_SIZE_RANGE,
  WATCH_HEADER_TEXT_SIZE_RANGE,
  WATCH_ICON_SIZE_RANGE,
  WATCH_LABEL_FONT_DESIGNS,
  WATCH_LABEL_FONT_WEIGHTS,
  isWatchLibraryAction,
  isWatchUUID,
  watchColorInMode,
  watchColorMode,
  watchHoldSlideSettings,
  watchPageLinkTarget,
  watchSingleTapSettings,
  watchStoredPageName,
  watchTileActionSettings,
  watchTileIconSettings,
  watchTileIconSizeTop,
  watchTileIconSizeValue,
  watchTapActionLabel,
  watchTileKindEntry,
  watchTileKindName,
  watchTriggerModes,
} from "./tile-settings-model.js";
import {
  type WatchCatalog,
  type WatchCatalogEntry,
  type WatchCatalogHTTPAction,
  type WatchLibraryKind,
  WATCH_LIBRARY_WORDS,
  WATCH_NOT_IN_LIST_TEXT,
  WATCH_NO_HTTP_ACTIONS_TEXT,
  findWatchCatalogEntry,
  watchCatalogEntries,
  watchCatalogMark,
  watchCatalogSubtitle,
  watchHttpScreenOffered,
  watchLibraryLister,
  watchLibraryMissingText,
  watchLibraryTarget,
  watchLibraryTileFallbackName,
} from "./catalog.js";
import { sameWatchId, findWatchPage } from "./edit.js";
import { watchTileHasStateTask } from "./styling-model.js";
import { type WatchSpecialStates, watchSpecialTask } from "./special-model.js";
import {
  type WatchPhoneKey,
  WATCH_CAMERA_FULL_SCREEN_ABSENT,
  WATCH_CAMERA_TILE_STREAM_ABSENT,
  WATCH_MEDIA_CONTROLS_MIN_COLUMNS,
  WATCH_SENSOR_CHART_CHOICES,
  WATCH_SENSOR_CHART_MIN_ROWS,
  WATCH_TEMPLATE_LINES,
  watchCameraFullScreenStream,
  watchCameraTileLive,
  watchCameraTileStream,
  watchMediaArtwork,
  watchPhoneKeysOf,
  watchSensorChart,
  watchTemplateLines,
} from "./phone-keys-model.js";
import { isWatchPhoneTileKind } from "./phone-tiles-model.js";
import {
  type WatchPage,
  type WatchPageTile,
  type WatchPagesDocument,
  WATCH_KIND_FALLBACK_LABELS,
  isWatchRemovedTileKind,
  tileEntityId,
  tileKind,
  tileLabel,
  watchPageId,
  watchPageName,
} from "./model.js";
import type { HassEntityState } from "../ha-api.js";
import { SECTION_COLOR } from "../kinds.js";
import type { UiIconName } from "../ui-icons.js";
import { type SettingDevice, deviceNoun } from "../watch-settings.js";
import { type WatchHTTPRefresh, WATCH_HTTP_REFRESH_SECONDS } from "./library-model.js";

// ── sections ─────────────────────────────────────────────────────────────

/** The folding sections of the Tile card, in the order they are drawn. */
export type WatchTileSettingsSection =
  | "opens"
  | "target"
  | "request"
  // A removed kind's tile (a macro): one line in place of every task.
  | "removed"
  | "header"
  | "special"
  | "icon"
  | "state"
  | "text"
  | "border"
  | "action"
  // Show tile: Always, Only while on, Only when, Template.
  | "visibility"
  // A tile's place and size, and a smart page rule's own tile size (part 3f
  // batch 3): drawn only when the caller hands the section's rows in.
  | "size"
  | "background"
  // The keys only the iPhone reads (`phone-keys-model.ts`): on an iPhone's
  // editor in their natural place, titled by the key; on a watch's editor
  // all of them in one folded card at the end (`watchTileSectionsFor`).
  | "phone"
  | "phoneExtras"
  // The task of a kind only the iPhone draws (`phone-tiles-model.ts`): a
  // map's places, a chart's series, a text field's target, a web card's
  // address. Before Icon, titled by the kind, tagged iPhone.
  | "phoneTile";

export const WATCH_TILE_SETTINGS_SECTION_TITLES: Readonly<Record<WatchTileSettingsSection, string>> = {
  opens: "Opens",
  target: "Target",
  request: "Request",
  removed: "Removed",
  header: "Header",
  // Drawn under the task's own title (`watchSpecialTask`).
  special: "Special",
  icon: "Icon and color",
  state: "State",
  text: "Text",
  border: "Border",
  action: "Action",
  visibility: "Visibility",
  size: "Size",
  background: "Background",
  // Drawn under the key's own title (`WATCH_PHONE_KEY_WORDS`).
  phone: "iPhone",
  phoneExtras: "iPhone extras",
  // Drawn under the kind's own title (`watchPhoneTileTitle`).
  phoneTile: "iPhone",
};

/** A section card's mark: the inspector color it is tinted with and the
 * glyph in its badge. */
export interface WatchSectionBadge {
  color: string;
  icon: UiIconName;
}

/**
 * Each tile section's badge, in the complication editor's colors, so a card
 * that does the same job looks the same in both editors: what the tile is
 * about (its target, request, header, special task) is Content, its
 * look is Look, its words are Extras (teal), the per-state look is States,
 * the tap is Tap, when it shows at all is Visibility and the place on the
 * page is Position.
 */
export const WATCH_TILE_SECTION_BADGES: Readonly<Record<WatchTileSettingsSection, WatchSectionBadge>> = {
  size: { color: SECTION_COLOR.position, icon: "place" },
  opens: { color: SECTION_COLOR.content, icon: "content" },
  target: { color: SECTION_COLOR.content, icon: "content" },
  request: { color: SECTION_COLOR.content, icon: "content" },
  removed: { color: SECTION_COLOR.content, icon: "content" },
  header: { color: SECTION_COLOR.content, icon: "content" },
  special: { color: SECTION_COLOR.content, icon: "content" },
  icon: { color: SECTION_COLOR.look, icon: "look" },
  background: { color: SECTION_COLOR.look, icon: "shape" },
  border: { color: SECTION_COLOR.look, icon: "shape" },
  text: { color: SECTION_COLOR.numbers, icon: "text" },
  state: { color: SECTION_COLOR.states, icon: "states" },
  action: { color: SECTION_COLOR.tap, icon: "tap" },
  visibility: { color: SECTION_COLOR.visibility, icon: "show" },
  phone: { color: SECTION_COLOR.content, icon: "phone" },
  phoneExtras: { color: SECTION_COLOR.place, icon: "phone" },
  phoneTile: { color: SECTION_COLOR.content, icon: "phone" },
};

/** The pinned Name card's badge, a tile's and a page's alike. */
export const WATCH_NAME_BADGE: WatchSectionBadge = { color: SECTION_COLOR.place, icon: "text" };

/** The breadcrumb chip's color per tile kind: one hue per family of
 * entity, so the chip reads before its word does. */
const KIND_CHIP_COLORS: Readonly<Record<string, string>> = {
  light: "#ffb300",
  switch: "#26a69a",
  input_boolean: "#26a69a",
  fan: "#26a69a",
  sensor: "#78909c",
  binary_sensor: "#78909c",
  cover: "#5c6bc0",
  climate: "#ec407a",
  water_heater: "#ec407a",
  media_player: "#ab47bc",
  scene: "#fb8c00",
  script: "#43a047",
  automation: "#43a047",
  lock: "#c9a227",
  page: "#5c6bc0",
  show_page: "#5c6bc0",
  http_action: "#90a4ae",
  webhook_inbox: "#90a4ae",
};

/** Every kind the table does not name: a quiet grey. */
const KIND_CHIP_OTHER = "#90a4ae";

/** The breadcrumb chip's color for a tile kind (`tileKind`). */
export function watchTileKindColor(kind: string): string {
  return Object.hasOwn(KIND_CHIP_COLORS, kind) ? KIND_CHIP_COLORS[kind]! : KIND_CHIP_OTHER;
}

/** The tile sections that can hold a smart page rule's style (part 3f
 * batch 3), in the order they are drawn: no Opens, Target, Request,
 * Header or special task, which a rule's `tileStyle` has no key of; State
 * only where the domain has it; Size before Background. */
export function watchDomainStyleSections(stateTask: boolean): WatchTileSettingsSection[] {
  return ["icon", ...(stateTask ? (["state"] as const) : []), "text", "border", "action", "size", "background"];
}

/**
 * The sections a tile gets, in the order of the phone's tasks: Border and
 * Background only for a spacer (it has no icon or words); Header, Action and
 * Visibility for a header, whose look is on the Header task; Opens first for a go to
 * page or peek tile; Target first for an HTTP action or status page tile,
 * then Request (an HTTP action); only the line that says why for a tile of
 * a removed kind (a macro), which the panel keeps as stored; Icon and color,
 * State (for the domains the phone shows it for), Text, Border, Action,
 * Visibility (Show tile, which the phone kept in Action) and Background for
 * everything else. A smart page never gets here.
 *
 * A header has no Border or Background, a departure from the phone, which
 * shows both: the watch's `DividerTile` reads none of their keys.
 *
 * A special tile (remote, vacuum, mower, camera, camera group, calendar,
 * weather, person, alarm panel) gets its kind's task as `special`, before
 * Icon, as on the phone (`special-model.ts`). A TV media player is a remote,
 * which only the states can tell.
 */
export function watchTileSettingsSections(tile: WatchPageTile, states?: WatchSpecialStates): WatchTileSettingsSection[] {
  const kind = tileKind(tileEntityId(tile));
  if (kind === "spacer") return ["border", "background"];
  if (kind === "divider") return ["header", "action", "visibility"];
  if (isWatchRemovedTileKind(kind)) return ["removed"];
  // A kind only the iPhone draws: its own task, then the look and when it
  // shows. No Action: the iPhone gives each its own tap (a marker, the field,
  // the page full screen).
  if (isWatchPhoneTileKind(kind)) return ["phoneTile", "icon", "text", "border", "visibility", "background"];
  const out: WatchTileSettingsSection[] = [];
  if (watchPageLinkTarget(tile) !== undefined) out.push("opens");
  const library = watchLibraryTarget(tileEntityId(tile));
  if (library !== undefined) {
    out.push("target");
    if (library.kind === "httpAction") out.push("request");
  }
  if (watchSpecialTask(tile, states) !== undefined) out.push("special");
  out.push("icon");
  if (watchTileHasStateTask(tile)) out.push("state");
  out.push("text", "border", "action", "visibility", "background");
  return out;
}

/**
 * The sections a tile gets on `device`'s editor: `watchTileSettingsSections`
 * with the keys only the iPhone reads (`watchPhoneKeysOf`), when the tile
 * has any. On an iPhone they are one card in their natural place: after the
 * kind's task (a camera's Live video, a template's Lines), else after State
 * (a sensor's Chart, a media player's Artwork), else before Icon. On a watch
 * they sit together in the folded "iPhone extras" card, last.
 */
export function watchTileSectionsFor(tile: WatchPageTile, states: WatchSpecialStates | undefined, device: SettingDevice): WatchTileSettingsSection[] {
  const out = watchTileSettingsSections(tile, states);
  if (watchPhoneKeysOf(tile, states).length === 0) return out;
  if (device === "watch") return [...out, "phoneExtras"];
  const after = ["state", "special"].map((s) => out.indexOf(s as WatchTileSettingsSection)).find((i) => i >= 0);
  const at = after !== undefined ? after + 1 : Math.max(0, out.indexOf("icon"));
  return [...out.slice(0, at), "phone", ...out.slice(at)];
}

// ── the keys only the iPhone reads ──────────────────────────────────────

/** The folded card's title on a watch's editor, and the line it shows. */
export const WATCH_PHONE_EXTRAS_TITLE = "iPhone extras";
export const WATCH_PHONE_EXTRAS_HINT = "The watch ignores these";

/** Each phone key's card or group title, its row's label, and the line
 * under the row. */
export const WATCH_PHONE_KEY_WORDS: Readonly<Record<WatchPhoneKey, { title: string; label: string; help: string }>> = {
  cameraTileLive: {
    title: "Live video",
    label: "Live video in the tile",
    help: "Off by default, so the tile shows snapshots. On, it plays live video while it is on screen. Up to 12 cameras play at once; the rest show snapshots.",
  },
  cameraTileStream: {
    title: "Stream",
    label: "Stream",
    help: "HD starts on SD so video shows at once, then switches to HD when the tile is big enough to show more. SD starts fastest and uses the least data.",
  },
  cameraFullScreenStream: {
    title: "Full screen",
    label: "Full screen",
    help: "The stream a tap opens. SD by default: it starts fastest. HD starts on SD for a moment, then switches. A double tap on the iPhone switches between SD and HD.",
  },
  sensorChart: {
    title: "Chart",
    label: "Chart under the value",
    help: `Needs a tile at least ${WATCH_SENSOR_CHART_MIN_ROWS} rows tall.`,
  },
  mediaArtwork: {
    title: "Artwork",
    label: "Artwork and controls",
    help: `Shows the album art, title and artist, with previous, play and next on tiles ${WATCH_MEDIA_CONTROLS_MIN_COLUMNS} columns and wider.`,
  },
  templateLines: {
    title: "Lines",
    label: "Lines",
    help: "The most lines the iPhone shows of the result.",
  },
};

/** The chart menu: Off, then the ranges; a stored value the panel does not
 * offer is shown first, disabled (the iPhone reads it as 24 hours). */
export function watchSensorChartMenu(tile: WatchPageTile): WatchMenu {
  const choices = WATCH_SENSOR_CHART_CHOICES.map((c) => ({ value: c.value ?? WATCH_DEFAULT_CHOICE, label: c.label }));
  return watchChoiceMenu(choices, watchSensorChart(tile) ?? WATCH_DEFAULT_CHOICE);
}

/** The line under the chart menu when the chart is on and the tile is too
 * short for it, naming its height. Undefined otherwise. */
export function watchSensorChartShortNote(tile: WatchPageTile): string | undefined {
  if (watchSensorChart(tile) === undefined) return undefined;
  const rows = Number(tile.rowSpan);
  if (!Number.isFinite(rows) || rows >= WATCH_SENSOR_CHART_MIN_ROWS) return undefined;
  return `This tile is ${rows} ${rows === 1 ? "row" : "rows"} tall, so the iPhone shows no chart. Make it ${WATCH_SENSOR_CHART_MIN_ROWS} or taller.`;
}

/** The Lines menu: 1 to 8, the absent value marked as the default; a stored
 * value off the range shown first, disabled. */
export function watchTemplateLinesMenu(tile: WatchPageTile): WatchMenu {
  const { min, max, absent } = WATCH_TEMPLATE_LINES;
  const choices = Array.from({ length: max - min + 1 }, (_, i) => {
    const n = min + i;
    return { value: String(n), label: n === absent ? `${n} (default)` : String(n) };
  });
  const stored = watchTemplateLines(tile);
  return watchChoiceMenu(choices, stored === undefined ? String(absent) : String(stored));
}

/** What a folded phone card says it holds. */
export function watchPhoneKeySummary(tile: WatchPageTile, key: WatchPhoneKey): string {
  switch (key) {
    case "cameraTileLive":
      return watchCameraTileLive(tile) ? "Live" : "";
    case "cameraTileStream": {
      const stream = watchCameraTileStream(tile);
      if (stream === WATCH_CAMERA_TILE_STREAM_ABSENT || !watchCameraTileLive(tile)) return "";
      return "SD";
    }
    case "cameraFullScreenStream":
      return watchCameraFullScreenStream(tile) === WATCH_CAMERA_FULL_SCREEN_ABSENT ? "" : "Full screen HD";
    case "mediaArtwork":
      return watchMediaArtwork(tile) ? "On" : "";
    case "sensorChart": {
      const stored = watchSensorChart(tile);
      if (stored === undefined) return "";
      return WATCH_SENSOR_CHART_CHOICES.find((c) => c.value === stored)?.label ?? stored;
    }
    case "templateLines": {
      const n = watchTemplateLines(tile);
      return n === undefined ? "" : `${String(n)} lines`;
    }
  }
}

// ── menus ────────────────────────────────────────────────────────────────

/** One entry of a select. `disabled` marks a stored value shown as it is
 * and offered nowhere else. */
export interface WatchMenuOption {
  value: string;
  label: string;
  disabled?: boolean;
  /** Options next to each other with the same group are drawn under one
   * heading (an `optgroup`). */
  group?: string;
}

/** A select's entries, which one is current, and a line for under it. */
export interface WatchMenu {
  options: WatchMenuOption[];
  selected: string;
  note?: string;
}

/** The value of every menu's "Default (...)" entry: the key removed. */
export const WATCH_DEFAULT_CHOICE = "";

/** The value prefix of a stored entry the menu shows and does not offer, so
 * it never equals an offered value. */
const STORED = "stored:";

/** What a stored action the panel does not offer says under its menu. */
export const WATCH_NOT_OFFERED_NOTE = "Not one the panel offers. Picking another action here replaces it.";

/** Whether a menu value is the shown, not offered, stored entry. */
export function isWatchStoredChoice(value: string): boolean {
  return value.startsWith(STORED);
}

/**
 * The Single tap menu, or undefined for a kind that has none. "Default
 * (words)" first, naming what the watch does with no action stored, then the
 * kind's actions in the phone's order with the kind's words. A stored action
 * the menu does not have (a library action, an unknown string) is shown as
 * the current entry, disabled, under the default.
 */
export function watchSingleTapMenu(tile: WatchPageTile): WatchMenu | undefined {
  const now = watchSingleTapSettings(tile);
  if (!now.picker) return undefined;
  const absent = watchSingleTapSettings({ ...tile, singleTapAction: undefined });
  const options: WatchMenuOption[] = [{ value: WATCH_DEFAULT_CHOICE, label: `Default (${absent.resolvedLabel})` }];
  let selected = now.stored ?? WATCH_DEFAULT_CHOICE;
  let note: string | undefined;
  if (now.storedNotOffered && now.stored !== undefined) {
    selected = STORED + now.stored;
    options.push({ value: selected, label: now.storedLabel ?? now.stored, disabled: true });
    note = WATCH_NOT_OFFERED_NOTE;
  }
  options.push(...now.offered);
  return note === undefined ? { options, selected } : { options, selected, note };
}

/** The words the four directions go by. */
export const WATCH_SLIDE_DIRECTION_TITLES: Readonly<Record<WatchSlideDirection, string>> = {
  up: "Up",
  down: "Down",
  left: "Left",
  right: "Right",
};

/** A direction set to Trigger entity: what it runs and how. */
export interface WatchTriggerRow {
  /** The stored target's entity, `""` while none is picked. */
  entityId: string;
  friendlyName: string | undefined;
  /** The mode menu, undefined while no entity is picked. */
  modes: WatchMenu | undefined;
}

/** A direction set to Run HTTP Action: which action, and its banner. */
export interface WatchHTTPSlideRow {
  /** The stored target id, `""` when none is stored. */
  targetId: string;
  /** The catalog's entry for it, when the catalog lists it. */
  entry: WatchCatalogHTTPAction | undefined;
  /** The banner switch: on unless `false` is stored. */
  banner: boolean;
  /** The banner's seconds, 1, 2, 3 or 5. */
  seconds: WatchMenu;
}

/** One hold and slide direction's row. */
export interface WatchHoldSlideRow extends WatchMenu {
  direction: WatchSlideDirection;
  title: string;
  trigger: WatchTriggerRow | undefined;
  /** Set while the direction is stored as Run HTTP Action. */
  http: WatchHTTPSlideRow | undefined;
}

/** The value prefix of a Run HTTP Action entry of a direction's menu: the
 * action's id follows. */
const HTTP_SLIDE = "http:";

/** The HTTP action a direction's menu value picks, or undefined for any
 * other value. */
export function watchHTTPSlideChoice(value: string): string | undefined {
  return value.startsWith(HTTP_SLIDE) ? value.slice(HTTP_SLIDE.length) : undefined;
}

/** An HTTP action as a menu names it: its name, and its warning or "on the
 * iPhone" (`watchCatalogMark`). */
function httpActionLabel(action: WatchCatalogHTTPAction): string {
  const mark = watchCatalogMark("httpAction", action);
  return mark === undefined ? action.name : `${action.name} (${mark.charAt(0).toLowerCase()}${mark.slice(1)})`;
}

/** A number of seconds in words ("1 second", "6 seconds"), or the stored
 * text as it is when it is no number. */
export function watchSecondsText(value: string, every = false): string {
  const n = Number(value);
  if (value.trim() === "" || !Number.isFinite(n)) return value;
  if (every) return n === 1 ? "Every second" : `Every ${n} seconds`;
  return n === 1 ? "1 second" : `${n} seconds`;
}

/** The banner seconds menu: 1, 2, 3 (the standard, stored as nothing) and
 * 5; a stored value the phone does not offer shown first, disabled, in the
 * same words. */
export function watchHTTPBannerSecondsMenu(stored: unknown): WatchMenu {
  const choices: WatchChoice[] = [1, 2, 3, 5].map((s) => ({ value: String(s), label: watchSecondsText(String(s)) }));
  const value = stored === undefined || stored === null ? "3" : String(stored);
  return watchChoiceMenu(choices, value, (v) => watchSecondsText(v));
}

/** The Hold and slide card, or undefined for a kind that has none. */
export interface WatchHoldSlideMenus {
  rows: WatchHoldSlideRow[];
  /** Any direction is stored: offer Reset all. */
  anyStored: boolean;
  /** A stored array that does not parse: the card is shown, not editable. */
  readable: boolean;
}

/**
 * The four hold and slide menus. Each has "Default (words)" first, naming
 * what the direction does with nothing stored (most kinds have a default
 * only for Down), then the kind's actions, then "None" last, which stores
 * `"none"` and so turns a default off. A stored library action or unknown
 * string is the current entry, disabled. A direction set to Trigger entity
 * carries its target and the target domain's modes.
 *
 * With a catalog that lists an HTTP action, Run HTTP Action is offered as
 * one entry per action, under a "Run HTTP Action" heading, so one pick sets
 * the action and its target together (`watchHTTPSlideChoice`). A direction
 * stored as Run HTTP Action selects its action's entry, or shows its target
 * as not on the iPhone, and carries its banner settings. Without a catalog a
 * stored Run HTTP Action is shown, not offered. The notes name `device`,
 * the device showing the page.
 */
export function watchHoldSlideMenus(tile: WatchPageTile, catalog?: WatchCatalog, device: SettingDevice = "watch"): WatchHoldSlideMenus | undefined {
  const shows = `the ${deviceNoun(device)}`;
  // A slide's target is typed `UUID` on the phone: an entry whose id is not
  // one could never be stored.
  const actions = (catalog?.httpActions ?? []).filter((a) => isWatchUUID(a.id));
  const now = watchHoldSlideSettings(tile, { httpActions: actions.length > 0 });
  if (!now.picker) return undefined;
  const absent = watchHoldSlideSettings({
    ...tile,
    holdSlideActions: undefined,
    holdSlideTriggerTargets: undefined,
    holdSlideHTTPActionTargets: undefined,
  });
  const runLabel = watchTapActionLabel(watchTileKindEntry(tile), "httpAction");
  const rows = now.directions.map((d, i): WatchHoldSlideRow => {
    const defaultLabel = absent.directions[i]!.resolvedLabel;
    const options: WatchMenuOption[] = [{ value: WATCH_DEFAULT_CHOICE, label: `Default (${defaultLabel})` }];
    // A library action needs a catalog entry: Run HTTP Action is offered
    // only with an action to run.
    const offered = d.offered.filter((c) => !isWatchLibraryAction(c.value) || (c.value === "httpAction" && actions.length > 0));
    const none = offered.filter((c) => c.value === "none");
    let selected = d.stored ?? WATCH_DEFAULT_CHOICE;
    let note: string | undefined;
    const storedHTTP = d.stored === "httpAction" && offered.some((c) => c.value === "httpAction");
    const targetId = typeof d.httpTarget === "string" ? d.httpTarget : "";
    const entry = storedHTTP ? findWatchCatalogEntry(catalog, "httpAction", targetId) : undefined;
    if (storedHTTP) {
      if (entry !== undefined) {
        selected = HTTP_SLIDE + entry.id;
      } else {
        // "not on the iPhone", or "not in the list" when the home's library
        // is the only list.
        const missing = watchLibraryMissingText(catalog, "httpAction", device);
        const inList = missing === WATCH_NOT_IN_LIST_TEXT;
        selected = STORED + "httpAction";
        options.push({ value: selected, label: `${runLabel} (${targetId === "" ? "no action picked" : missing.charAt(0).toLowerCase() + missing.slice(1)})`, disabled: true });
        note = targetId === ""
          ? `No action is picked, so ${shows} shows Sync Needed. Pick one.`
          : inList
            ? `This action is no longer in the list. Pick another, or ${shows} fails the slide.`
            : `The iPhone no longer lists this action. Pick another, or ${shows} fails the slide.`;
      }
    } else if (d.stored !== undefined && !offered.some((c) => c.value === d.stored)) {
      selected = STORED + d.stored;
      options.push({ value: selected, label: d.storedLabel ?? d.stored, disabled: true });
      note = WATCH_NOT_OFFERED_NOTE;
    }
    for (const c of offered) {
      if (c.value === "none") continue;
      if (c.value !== "httpAction") {
        options.push(c);
        continue;
      }
      options.push(...actions.map((a) => ({ value: HTTP_SLIDE + a.id, label: httpActionLabel(a), group: c.label })));
    }
    options.push(...none);
    let trigger: WatchTriggerRow | undefined;
    if (d.stored === "triggerEntity") {
      const target = d.target;
      if (target === undefined) {
        trigger = { entityId: "", friendlyName: undefined, modes: undefined };
      } else {
        const modes: WatchMenuOption[] = watchTriggerModes(tileKind(target.entityId)).map((m) => ({ ...m }));
        if (!target.modeOffered) {
          modes.unshift({ value: STORED + target.mode, label: target.mode, disabled: true });
        }
        trigger = {
          entityId: target.entityId,
          friendlyName: target.friendlyName,
          modes: {
            options: modes,
            selected: target.modeOffered ? target.mode : STORED + target.mode,
            ...(target.modeOffered ? {} : { note: "This entity does not offer the stored mode. Pick one it has." }),
          },
        };
      }
    }
    const http: WatchHTTPSlideRow | undefined = d.stored === "httpAction"
      ? { targetId, entry, banner: d.httpBanner, seconds: watchHTTPBannerSecondsMenu(d.httpBannerSeconds) }
      : undefined;
    return {
      direction: d.direction,
      title: WATCH_SLIDE_DIRECTION_TITLES[d.direction],
      options,
      selected,
      ...(note === undefined ? {} : { note }),
      trigger,
      http,
    };
  });
  return { rows, anyStored: now.anyStored, readable: now.parses };
}

/** What the icon does while on, by kind, as the phone's Icon task said it. */
const ACTIVE_ANIMATION_WORDS: Readonly<Record<string, string>> = {
  fan: "Spins the icon while the fan runs.",
  light: "Pulses the icon while the light is on.",
  climate: "Pulses the icon while heating or cooling.",
  media_player: "Pulses the icon while media plays.",
  timer: "Pulses the icon while the timer runs.",
  vacuum: "Spins the icon while the vacuum cleans.",
};

/** The line under Animate while on: what the icon does, and the kind's
 * default, so a person knows what the switch overrides. */
export function watchActiveAnimationNote(tile: WatchPageTile): string {
  const a = watchTileIconSettings(tile).activeAnimation;
  const what = ACTIVE_ANIMATION_WORDS[watchTileKindName(tileEntityId(tile))] ?? "Animates the icon while on.";
  const which = a.default ? "on" : "off";
  return a.stored === undefined
    ? `${what} The default for this kind of tile: ${which}.`
    : `${what} Set on this tile. The default for this kind of tile is ${which}.`;
}

/** The line under Ask before running: the kind's default, so a person knows
 * what "off" overrides. */
export function watchAskBeforeRunningNote(tile: WatchPageTile): string {
  const ask = watchTileActionSettings(tile).askBeforeRunning;
  const which = ask.default ? "on" : "off";
  return ask.stored === undefined
    ? `The default for this kind of tile: ${which}.`
    : `Set on this tile. The default for this kind of tile is ${which}.`;
}

/** The Skip conditions choice, as the segmented control's value. */
export type WatchSkipChoice = "default" | "skip" | "dontSkip";

export const WATCH_SKIP_CHOICES: readonly [WatchSkipChoice, string][] = [
  ["default", "Default"],
  ["skip", "Skip"],
  ["dontSkip", "Don't skip"],
];

export function watchSkipChoice(value: boolean | null): WatchSkipChoice {
  return value === null ? "default" : value ? "skip" : "dontSkip";
}

export function watchSkipValue(choice: WatchSkipChoice): boolean | null {
  return choice === "default" ? null : choice === "skip";
}

/** A menu of fixed choices with a stored value it may not have: that value
 * is shown first, disabled. */
export function watchChoiceMenu(choices: readonly WatchChoice[], value: string, storedLabel?: (value: string) => string): WatchMenu {
  const options: WatchMenuOption[] = choices.map((c) => ({ value: c.value, label: c.label }));
  if (choices.some((c) => c.value === value)) return { options, selected: value };
  const stored = STORED + value;
  return {
    options: [{ value: stored, label: value === "" ? "(empty)" : (storedLabel?.(value) ?? value), disabled: true }, ...options],
    selected: stored,
    note: "Not one the panel offers. Picking another replaces it.",
  };
}

export function watchFontWeightMenu(value: string): WatchMenu {
  return watchChoiceMenu(WATCH_LABEL_FONT_WEIGHTS, value);
}

export function watchFontDesignMenu(value: string): WatchMenu {
  return watchChoiceMenu(WATCH_LABEL_FONT_DESIGNS, value);
}

// ── page links ───────────────────────────────────────────────────────────

/** The Opens menu: the pages a link may point at, by id, and the old
 * target's name for the label rule. */
export interface WatchLinkTargetMenu extends WatchMenu {
  kind: "page" | "show_page";
  /** The target page as the document has it now, when it is there. */
  current: WatchPage | undefined;
  /** The current target's name now, for `setWatchPageLinkTarget`. */
  oldTargetName: string | undefined;
}

/**
 * The Opens menu for a go to page or peek tile, or undefined for any other
 * tile. `targets` is `watchLinkTargetPages` for the tile's kind. A target
 * that is not among them (a page since deleted, or hidden while the link
 * goes to it) is shown first, disabled, with a line that says why.
 */
export function watchLinkTargetMenu(
  document: WatchPagesDocument,
  tile: WatchPageTile,
  targets: readonly WatchPage[],
): WatchLinkTargetMenu | undefined {
  const link = watchPageLinkTarget(tile);
  if (link === undefined) return undefined;
  const current = findWatchPage(document, link.targetId);
  const options: WatchMenuOption[] = targets.map((p) => ({ value: watchPageId(p), label: watchPageName(p) }));
  const offered = targets.find((p) => sameWatchId(p.id, link.targetId));
  const base = {
    kind: link.kind,
    current,
    // A page with no name is "Page" to the phone, and so is a label that
    // followed it.
    oldTargetName: current === undefined ? undefined : watchStoredPageName(current),
  };
  if (offered !== undefined) return { ...base, options, selected: watchPageId(offered) };
  const selected = STORED + link.targetId;
  const missing = current === undefined;
  return {
    ...base,
    options: [{ value: selected, label: missing ? "A page that is gone" : watchPageName(current), disabled: true }, ...options],
    selected,
    note: missing
      ? "The page this tile opened is no longer there. Pick another."
      : link.kind === "page" && current.isHidden === true
        ? "A go to page tile cannot open a hidden page. Pick another, or show the page again."
        : "This tile cannot open that page. Pick another.",
  };
}

// ── library targets ──────────────────────────────────────────────────────

/** The Target menu of an HTTP action or status page tile. */
export interface WatchLibraryTargetMenu extends WatchMenu {
  kind: WatchLibraryKind;
  /** The id the tile stores, as stored. */
  targetId: string;
  /** The catalog's entry for it, undefined when the catalog does not list
   * it. */
  current: WatchCatalogEntry | undefined;
  /** The current entry's name in the catalog now, for the label rule;
   * `null` when the catalog does not list it. */
  oldTargetName: string | null;
}

/** An entry as a menu names it: its name, its subtitle and its warning or
 * "On the iPhone" (`watchCatalogMark`). */
function libraryEntryLabel(kind: WatchLibraryKind, entry: WatchCatalogEntry): string {
  const extra = [watchCatalogSubtitle(kind, entry), watchCatalogMark(kind, entry)].filter((t) => t !== undefined);
  return extra.length === 0 ? entry.name : `${entry.name} (${extra.join(", ")})`;
}

/**
 * The Target menu for a library tile with a catalog, or undefined for any
 * other tile. The catalog's entries of the tile's kind in library order. A
 * target the catalog does not list is shown first, disabled, with the
 * tile's stored label and "Not on the iPhone"; picking another retargets
 * the tile, and nothing rewrites it on its own. The notes name `device`,
 * the device showing the page.
 */
export function watchLibraryTargetMenu(tile: WatchPageTile, catalog: WatchCatalog, device: SettingDevice = "watch"): WatchLibraryTargetMenu | undefined {
  const target = watchLibraryTarget(tileEntityId(tile));
  if (target === undefined) return undefined;
  const entries = watchCatalogEntries(catalog, target.kind);
  const options: WatchMenuOption[] = entries.map((e) => ({ value: e.id, label: libraryEntryLabel(target.kind, e) }));
  const current = findWatchCatalogEntry(catalog, target.kind, target.id);
  const base = { kind: target.kind, targetId: target.id, current, oldTargetName: current?.name ?? null };
  if (current !== undefined) return { ...base, options, selected: current.id };
  const selected = STORED + target.id;
  // With no label of its own, what the watch shows: "Action" or "Status
  // Page" (the catalog has no name for it).
  const label = typeof tile.customLabel === "string" && tile.customLabel.trim() !== ""
    ? tile.customLabel
    : (watchLibraryTileFallbackName(tileEntityId(tile), catalog) ?? WATCH_LIBRARY_WORDS[target.kind].one);
  // "Not on the iPhone", for the watch's own status pages "Not in this
  // watch's status pages", and "Not in the list" when the home's HTTP action
  // library is the only list.
  // With nothing else to pick, the HTTP actions screen can add one.
  const missing = watchLibraryMissingText(catalog, target.kind, device);
  const lister = watchLibraryLister(catalog, target.kind, device);
  const screen = target.kind === "httpAction" && watchHttpScreenOffered(catalog);
  return {
    ...base,
    options: [{ value: selected, label: `${label} (${missing})`, disabled: true }, ...options],
    selected,
    note: entries.length === 0
      ? screen
        ? `${missing}. ${WATCH_NO_HTTP_ACTIONS_TEXT}`
        : `${missing}, and ${lister === "The iPhone" ? "the iPhone lists" : `this ${deviceNoun(device)} has`} no other ${WATCH_LIBRARY_WORDS[target.kind].many}. The tile stays as it is.`
      : `${missing}. The tile stays as it is until another is picked.`,
  };
}

/** The Auto-refresh menu of a Tile Value tile: Off, On open, then the
 * ladder's seconds; a stored interval off the ladder shown first, disabled,
 * in the same words ("Every 60 seconds"). */
export function watchHTTPRefreshMenu(refresh: WatchHTTPRefresh): WatchMenu {
  const choices: WatchChoice[] = [
    { value: "off", label: "Off" },
    { value: "onOpen", label: "On open" },
    ...WATCH_HTTP_REFRESH_SECONDS.map((s) => ({ value: String(s), label: watchSecondsText(String(s), true) })),
  ];
  return watchChoiceMenu(choices, String(refresh), (v) => watchSecondsText(v, true));
}

/** The Show reply menu's value for Off (no key). */
export const WATCH_HTTP_REPLY_OFF = "off";

/**
 * The Show reply menu of an HTTP action tile: Off, Banner, Tile value. Tile
 * value is offered only when the list says the action has a Reply Value
 * (`hasReply`), as the phone enables it; while it is stored it stays
 * selectable. A stored string the watch does not know reads as Off, as on
 * the watch, and is named under the menu. The notes name where the action
 * is kept: Home Assistant for one of the home's library (or one missing
 * when that library is the only list), else the iPhone. `device` is the
 * device showing the page.
 */
export function watchHTTPReplyMenu(tile: WatchPageTile, action: WatchCatalogHTTPAction | undefined, catalog?: WatchCatalog, device: SettingDevice = "watch"): WatchMenu {
  const reply = tile.httpResponseDisplay === "toast" || tile.httpResponseDisplay === "tileValue" ? tile.httpResponseDisplay : undefined;
  const tileValue = action?.hasReply === true || reply === "tileValue";
  const options: WatchMenuOption[] = [
    { value: WATCH_HTTP_REPLY_OFF, label: "Off" },
    { value: "toast", label: "Banner" },
    { value: "tileValue", label: "Tile value", ...(tileValue ? {} : { disabled: true }) },
  ];
  const menu: WatchMenu = { options, selected: reply ?? WATCH_HTTP_REPLY_OFF };
  const unknown = typeof tile.httpResponseDisplay === "string" && reply === undefined ? tile.httpResponseDisplay : undefined;
  const home = action === undefined ? watchLibraryMissingText(catalog, "httpAction") === WATCH_NOT_IN_LIST_TEXT : action.source === "home";
  if (unknown !== undefined) menu.note = `Stored as "${unknown}", which the ${deviceNoun(device)} reads as Off.`;
  else if (!tileValue && action === undefined) {
    menu.note = home
      ? "This action is not in the list, so Tile value cannot be offered."
      : "The iPhone has not listed this action here, so Tile value cannot be offered.";
  } else if (!tileValue) {
    menu.note = home
      ? "Tile value needs a Reply Value on this action, set on the HTTP actions screen."
      : "Tile value needs a Reply Value, and the iPhone's list shows none for this action.";
  } else if (reply === "tileValue" && action !== undefined && !action.hasReply) {
    menu.note = home
      ? "This action has no Reply Value, so the tile shows a dash."
      : "The iPhone does not list a Reply Value for this action, so the tile shows a dash.";
  }
  return menu;
}

// ── text ─────────────────────────────────────────────────────────────────

/** The name a tile shows with no label of its own: Home Assistant's name
 * for an entity, the target's name for a page link; for the library tiles
 * the watch's own fallbacks ("Action" on an HTTP action tile, the library
 * name of a status page). The label field's placeholder. */
export function watchTileFallbackName(
  tile: WatchPageTile,
  states?: Readonly<Record<string, HassEntityState>>,
  pages?: readonly WatchPage[],
  catalog?: WatchCatalog,
): string {
  const library = watchLibraryTileFallbackName(tileEntityId(tile), catalog);
  if (library !== undefined) return library;
  const rest = { ...tile };
  delete rest.customLabel;
  return tileLabel(rest, states, pages);
}

/** The line under the label field, naming `device`, the device showing the
 * page. */
export function watchLabelNote(tile: WatchPageTile, device: SettingDevice = "watch"): string {
  if (watchPageLinkTarget(tile) !== undefined) return "Leave it empty to show the name of the page it opens.";
  const library = watchLibraryTarget(tileEntityId(tile))?.kind;
  if (library === "httpAction") return `Leave it empty and the ${deviceNoun(device)} shows "Action".`;
  if (library === "statusPage") return "Leave it empty to show the status page's name.";
  const kind = tileKind(tileEntityId(tile));
  if (kind === "webhook_inbox") return "Leave it empty to show the topic, or \"Inbox\" for every topic.";
  const fallback = WATCH_KIND_FALLBACK_LABELS[kind];
  if (fallback !== undefined) return `Leave it empty and the ${deviceNoun(device)} shows "${fallback}".`;
  return "Leave it empty to show the name Home Assistant has.";
}

// ── colors ───────────────────────────────────────────────────────────────

/** The color mode control's value: a stored mode, or `none` for a tile with
 * no color (or one the palette cannot show). */
export type WatchColorModeChoice = "solid" | "gradient" | "rainbow" | "none";

/** The tile color's forms. A rainbow is no form of its own: it is the last
 * of the Gradient swatches (`color-picker.ts`). */
export const WATCH_COLOR_MODES: readonly ["solid" | "gradient", string][] = [
  ["solid", "Solid"],
  ["gradient", "Gradient"],
];

export function watchColorModeChoice(color: unknown): WatchColorModeChoice {
  return watchColorMode(color) ?? "none";
}

/** Whether the swatches show their gradient form: the stored color is a
 * gradient or the rainbow (the last of the gradient swatches), or, with no
 * color, the page adds in gradients. */
export function watchSwatchesInGradient(color: unknown, pageUsesGradient: boolean): boolean {
  const mode = watchColorMode(color);
  return mode === "gradient" || mode === "rainbow" || (mode === undefined && pageUsesGradient);
}

/**
 * What picking Solid or Gradient writes. A color in the other form is
 * converted (`watchColorInMode`); from a rainbow or no color the tile's
 * default color is taken in that form, else the first swatch. Undefined when
 * there is nothing to write.
 */
export function watchColorForMode(
  color: string | undefined,
  mode: "solid" | "gradient",
  fallback: string | undefined,
  gradientOf: (hex: string) => string,
): string | undefined {
  const current = watchColorMode(color);
  if (current === mode) return undefined;
  if (current === "solid" || current === "gradient") return watchColorInMode(color, mode, gradientOf);
  if (fallback === undefined || watchColorMode(fallback) === undefined || watchColorMode(fallback) === "rainbow") {
    return undefined;
  }
  return watchColorInMode(fallback, mode, gradientOf);
}

/** A color's two ends for a swatch or a preview: the same hex twice for a
 * solid color. Undefined for a rainbow or a value that is no color. */
export function watchColorEnds(color: unknown): { from: string; to: string } | undefined {
  const mode = watchColorMode(color);
  if (mode === undefined || mode === "rainbow") return undefined;
  const text = String(color).trim();
  if (mode === "gradient") {
    const [, a = "", b = ""] = text.split("|");
    return { from: hex6(a), to: hex6(b) };
  }
  const h = hex6(text);
  return { from: h, to: h };
}

function hex6(text: string): string {
  const t = text.trim().replace(/^#/, "").toUpperCase();
  return `#${t}`;
}

/** The solid color the custom color box shows: the color itself, a
 * gradient's first color, nothing for a rainbow or no color. */
export function watchCustomBoxColor(color: unknown): string | undefined {
  return watchColorEnds(color)?.from;
}

/** Whether two stored colors are the same, ignoring case and a missing
 * `#`. */
export function sameWatchColor(a: unknown, b: unknown): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const norm = (s: string) => s.trim().toUpperCase().replace(/^(?!GRADIENT)#?/, "#");
  return norm(a) === norm(b);
}

/** Why a typed color is refused: the device showing the page (`device`) has
 * no opacity, and only six hex digits. Undefined for a color the field
 * takes. */
export function watchColorRefusal(value: string | undefined, device: SettingDevice = "watch"): string | undefined {
  if (value === undefined) return undefined;
  const t = value.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{8}$/.test(t)) return `The ${deviceNoun(device)} has no opacity. Use six digits, #RRGGBB.`;
  if (!/^[0-9a-fA-F]{6}$/.test(t)) return "Use six hex digits, #RRGGBB.";
  return undefined;
}

// ── numbers ──────────────────────────────────────────────────────────────

/** Why a typed number is refused, for a whole number from `min` to `max`.
 * Undefined when it is one. */
export function watchWholeRefusal(value: number, min: number, max: number): string | undefined {
  if (!Number.isFinite(value)) return `Use a number from ${min} to ${max}.`;
  const n = Math.round(value);
  if (n < min || n > max) {
    return min === max ? `This tile takes only ${min}.` : `Use a number from ${min} to ${max}.`;
  }
  return undefined;
}

/** Why an icon size is refused, naming what limits it. Up to the next
 * whole number above the tile's largest size is taken, as that largest
 * size (`watchTileIconSizeValue`). */
export function watchIconSizeRefusal(value: number, max: number): string | undefined {
  if (watchTileIconSizeValue(value, max) !== undefined) return undefined;
  const top = watchTileIconSizeTop(max);
  const reason = watchWholeRefusal(value, WATCH_ICON_SIZE_RANGE.min, top);
  return Number.isFinite(value) && Math.round(value) > top
    ? `At this tile's size an icon stops growing at ${watchIconSizeWords(max)}. Use 8 to ${top}, or make the tile bigger.`
    : (reason ?? `Use a number from ${WATCH_ICON_SIZE_RANGE.min} to ${top}.`);
}

/** A tile's largest icon size in words: the whole number, or the number
 * with its two decimals ("23.76"). */
export function watchIconSizeWords(max: number): string {
  return Number.isInteger(max) ? String(max) : String(Math.round(max * 100) / 100);
}

/** The line under the icon size field. A largest size with a fraction is
 * what the next whole number up stores, as the phone's slider does at its
 * end. The line gives only the whole range: the refusal names the fraction
 * when someone goes past it. */
export function watchIconSizeHint(max: number): string {
  const top = watchTileIconSizeTop(max);
  return `Leave empty for Auto, or pick 8 to ${top} pt. ${top} is the biggest this tile allows.`;
}

export function watchFontSizeRefusal(value: number): string | undefined {
  return watchWholeRefusal(value, WATCH_FONT_SIZE_RANGE.min, WATCH_FONT_SIZE_RANGE.max);
}

export function watchHeaderTextSizeRefusal(value: number): string | undefined {
  return watchWholeRefusal(value, WATCH_HEADER_TEXT_SIZE_RANGE.min, WATCH_HEADER_TEXT_SIZE_RANGE.max);
}

/** A header's glow in whole percent, as the slider shows it. */
export function watchGlowPercent(glow: number): number {
  return Math.round(Math.max(0, Math.min(1, glow)) * 100);
}

/** The words for a trigger's entity: its friendly name, else the stored
 * one, else the id. */
export function watchTriggerEntityName(
  entityId: string,
  stored: string | undefined,
  states?: Readonly<Record<string, HassEntityState>>,
): string {
  const live = states?.[entityId]?.attributes?.friendly_name;
  if (typeof live === "string" && live.trim() !== "") return live.trim();
  return stored !== undefined && stored !== "" ? stored : entityId;
}
