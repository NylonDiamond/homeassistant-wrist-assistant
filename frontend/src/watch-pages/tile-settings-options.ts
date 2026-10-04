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
  watchTileIconSizeTop,
  watchTileIconSizeValue,
  watchTapActionLabel,
  watchTileKindEntry,
  watchTriggerModes,
} from "./tile-settings-model.js";
import {
  type WatchCatalog,
  type WatchCatalogEntry,
  type WatchCatalogHTTPAction,
  type WatchLibraryKind,
  WATCH_LIBRARY_WORDS,
  WATCH_NOT_ON_IPHONE_TEXT,
  findWatchCatalogEntry,
  watchCatalogEntries,
  watchCatalogSubtitle,
  watchCatalogWarning,
  watchLibraryTarget,
  watchLibraryTileFallbackName,
} from "./catalog.js";
import { sameWatchId, findWatchPage } from "./edit.js";
import { watchTileHasStateTask } from "./styling-model.js";
import { type WatchSpecialStates, watchSpecialTask } from "./special-model.js";
import {
  type WatchPage,
  type WatchPageTile,
  type WatchPagesDocument,
  WATCH_KIND_FALLBACK_LABELS,
  tileEntityId,
  tileKind,
  tileLabel,
  watchPageId,
  watchPageName,
} from "./model.js";
import type { HassEntityState } from "../ha-api.js";
import { SECTION_COLOR } from "../kinds.js";
import type { UiIconName } from "../ui-icons.js";
import { type WatchHTTPRefresh, WATCH_HTTP_REFRESH_SECONDS } from "./library-model.js";

// ── sections ─────────────────────────────────────────────────────────────

/** The folding sections of the Tile card, in the order they are drawn. */
export type WatchTileSettingsSection =
  | "opens"
  | "target"
  | "request"
  | "macro"
  | "header"
  | "special"
  | "icon"
  | "state"
  | "text"
  | "border"
  | "action"
  // A tile's place and size, and a smart page rule's own tile size (part 3f
  // batch 3): drawn only when the caller hands the section's rows in.
  | "size"
  | "background";

export const WATCH_TILE_SETTINGS_SECTION_TITLES: Readonly<Record<WatchTileSettingsSection, string>> = {
  opens: "Opens",
  target: "Target",
  request: "Request",
  macro: "Macro",
  header: "Header",
  // Drawn under the task's own title (`watchSpecialTask`).
  special: "Special",
  icon: "Icon and color",
  state: "State",
  text: "Text",
  border: "Border",
  action: "Action",
  size: "Size",
  background: "Background",
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
 * about (its target, request, macro, header, special task) is Content, its
 * look is Look, its words are Extras (teal), the per-state look is States,
 * the tap is Tap and the place on the page is Position.
 */
export const WATCH_TILE_SECTION_BADGES: Readonly<Record<WatchTileSettingsSection, WatchSectionBadge>> = {
  size: { color: SECTION_COLOR.position, icon: "place" },
  opens: { color: SECTION_COLOR.content, icon: "content" },
  target: { color: SECTION_COLOR.content, icon: "content" },
  request: { color: SECTION_COLOR.content, icon: "content" },
  macro: { color: SECTION_COLOR.content, icon: "content" },
  header: { color: SECTION_COLOR.content, icon: "content" },
  special: { color: SECTION_COLOR.content, icon: "content" },
  icon: { color: SECTION_COLOR.look, icon: "look" },
  background: { color: SECTION_COLOR.look, icon: "shape" },
  border: { color: SECTION_COLOR.look, icon: "shape" },
  text: { color: SECTION_COLOR.numbers, icon: "text" },
  state: { color: SECTION_COLOR.states, icon: "states" },
  action: { color: SECTION_COLOR.tap, icon: "tap" },
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
  macro: "#90a4ae",
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
 * batch 3), in the order they are drawn: no Opens, Target, Request, Macro,
 * Header or special task, which a rule's `tileStyle` has no key of; State
 * only where the domain has it; Size before Background. */
export function watchDomainStyleSections(stateTask: boolean): WatchTileSettingsSection[] {
  return ["icon", ...(stateTask ? (["state"] as const) : []), "text", "border", "action", "size", "background"];
}

/**
 * The sections a tile gets, in the order of the phone's tasks: Border and
 * Background only for a spacer (it has no icon or words); Header and Action
 * for a header, whose look is on the Header task; Opens first for a go to
 * page or peek tile; Target first for an HTTP action, macro or status page
 * tile, then Request (an HTTP action) or Macro (a macro); Icon and color,
 * State (for the domains the phone shows it for), Text, Border, Action and
 * Background for everything else. A smart page never gets here.
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
  if (kind === "divider") return ["header", "action"];
  const out: WatchTileSettingsSection[] = [];
  if (watchPageLinkTarget(tile) !== undefined) out.push("opens");
  const library = watchLibraryTarget(tileEntityId(tile));
  if (library !== undefined) {
    out.push("target");
    if (library.kind === "httpAction") out.push("request");
    if (library.kind === "macro") out.push("macro");
  }
  if (watchSpecialTask(tile, states) !== undefined) out.push("special");
  out.push("icon");
  if (watchTileHasStateTask(tile)) out.push("state");
  out.push("text", "border", "action", "background");
  return out;
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
export const WATCH_NOT_OFFERED_NOTE = "Set in the iPhone app. Picking another action here replaces it.";

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

/** An HTTP action as a menu names it: its name, and the phone's warning. */
function httpActionLabel(action: WatchCatalogHTTPAction): string {
  const warning = watchCatalogWarning("httpAction", action);
  return warning === undefined ? action.name : `${action.name} (${warning.charAt(0).toLowerCase()}${warning.slice(1)})`;
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
 * stored Run HTTP Action is shown, not offered.
 */
export function watchHoldSlideMenus(tile: WatchPageTile, catalog?: WatchCatalog): WatchHoldSlideMenus | undefined {
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
    // only with an action to run, Run Macro never.
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
        selected = STORED + "httpAction";
        options.push({ value: selected, label: `${runLabel} (${targetId === "" ? "no action picked" : "not on the iPhone"})`, disabled: true });
        note = targetId === ""
          ? "No action is picked, so the watch shows Sync Needed. Pick one."
          : "The iPhone no longer lists this action. Pick another, or the watch fails the slide.";
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
    note: "Not one the iPhone app offers. Picking another replaces it.",
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

/** The Target menu of an HTTP action, macro or status page tile. */
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

/** An entry as a menu names it: its name, its subtitle and the phone's
 * warning. */
function libraryEntryLabel(kind: WatchLibraryKind, entry: WatchCatalogEntry): string {
  const extra = [watchCatalogSubtitle(kind, entry), watchCatalogWarning(kind, entry)].filter((t) => t !== undefined);
  return extra.length === 0 ? entry.name : `${entry.name} (${extra.join(", ")})`;
}

/**
 * The Target menu for a library tile with a catalog, or undefined for any
 * other tile. The catalog's entries of the tile's kind in library order. A
 * target the catalog does not list is shown first, disabled, with the
 * tile's stored label and "Not on the iPhone"; picking another retargets
 * the tile, and nothing rewrites it on its own.
 */
export function watchLibraryTargetMenu(tile: WatchPageTile, catalog: WatchCatalog): WatchLibraryTargetMenu | undefined {
  const target = watchLibraryTarget(tileEntityId(tile));
  if (target === undefined) return undefined;
  const entries = watchCatalogEntries(catalog, target.kind);
  const options: WatchMenuOption[] = entries.map((e) => ({ value: e.id, label: libraryEntryLabel(target.kind, e) }));
  const current = findWatchCatalogEntry(catalog, target.kind, target.id);
  const base = { kind: target.kind, targetId: target.id, current, oldTargetName: current?.name ?? null };
  if (current !== undefined) return { ...base, options, selected: current.id };
  const selected = STORED + target.id;
  // With no label of its own, what the watch shows: "Action", "Macro" or
  // "Status Page" (the catalog has no name for it).
  const label = typeof tile.customLabel === "string" && tile.customLabel.trim() !== ""
    ? tile.customLabel
    : (watchLibraryTileFallbackName(tileEntityId(tile), catalog) ?? WATCH_LIBRARY_WORDS[target.kind].one);
  return {
    ...base,
    options: [{ value: selected, label: `${label} (${WATCH_NOT_ON_IPHONE_TEXT})`, disabled: true }, ...options],
    selected,
    note: entries.length === 0
      ? `${WATCH_NOT_ON_IPHONE_TEXT}, and the iPhone lists no other ${WATCH_LIBRARY_WORDS[target.kind].many}. The tile stays as it is.`
      : `${WATCH_NOT_ON_IPHONE_TEXT}. The tile stays as it is until another is picked.`,
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
 * value is offered only when the catalog says the action has a Reply Value
 * (`hasReply`), as the phone enables it; while it is stored it stays
 * selectable. A stored string the watch does not know reads as Off, as on
 * the watch, and is named under the menu.
 */
export function watchHTTPReplyMenu(tile: WatchPageTile, action: WatchCatalogHTTPAction | undefined): WatchMenu {
  const reply = tile.httpResponseDisplay === "toast" || tile.httpResponseDisplay === "tileValue" ? tile.httpResponseDisplay : undefined;
  const tileValue = action?.hasReply === true || reply === "tileValue";
  const options: WatchMenuOption[] = [
    { value: WATCH_HTTP_REPLY_OFF, label: "Off" },
    { value: "toast", label: "Banner" },
    { value: "tileValue", label: "Tile value", ...(tileValue ? {} : { disabled: true }) },
  ];
  const menu: WatchMenu = { options, selected: reply ?? WATCH_HTTP_REPLY_OFF };
  const unknown = typeof tile.httpResponseDisplay === "string" && reply === undefined ? tile.httpResponseDisplay : undefined;
  if (unknown !== undefined) menu.note = `Stored as "${unknown}", which the watch reads as Off.`;
  else if (!tileValue && action === undefined) menu.note = "The iPhone has not listed this action here, so Tile value cannot be offered. Open the iPhone app to list it.";
  else if (!tileValue) menu.note = "Tile value needs a Reply Value on this action, set in the iPhone app.";
  else if (reply === "tileValue" && action !== undefined && !action.hasReply) menu.note = "The iPhone does not list a Reply Value for this action, so the tile shows a dash.";
  return menu;
}

// ── text ─────────────────────────────────────────────────────────────────

/** The name a tile shows with no label of its own: Home Assistant's name
 * for an entity, the target's name for a page link; for the library tiles
 * the watch's own fallbacks ("Action" on an HTTP action tile, the library
 * name of a macro or status page). The label field's placeholder. */
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

/** The line under the label field. */
export function watchLabelNote(tile: WatchPageTile): string {
  if (watchPageLinkTarget(tile) !== undefined) return "Leave it empty to show the name of the page it opens.";
  const library = watchLibraryTarget(tileEntityId(tile))?.kind;
  if (library === "httpAction") return "Leave it empty and the watch shows \"Action\".";
  if (library === "macro") return "Leave it empty to show the macro's name.";
  if (library === "statusPage") return "Leave it empty to show the status page's name.";
  const kind = tileKind(tileEntityId(tile));
  if (kind === "webhook_inbox") return "Leave it empty to show the topic, or \"Inbox\" for every topic.";
  const fallback = WATCH_KIND_FALLBACK_LABELS[kind];
  if (fallback !== undefined) return `Leave it empty and the watch shows "${fallback}".`;
  return "Leave it empty to show the name Home Assistant has.";
}

// ── colors ───────────────────────────────────────────────────────────────

/** The color mode control's value: a stored mode, or `none` for a tile with
 * no color (or one the palette cannot show). */
export type WatchColorModeChoice = "solid" | "gradient" | "rainbow" | "none";

export const WATCH_COLOR_MODES: readonly ["solid" | "gradient" | "rainbow", string][] = [
  ["solid", "Solid"],
  ["gradient", "Gradient"],
  ["rainbow", "Rainbow"],
];

export function watchColorModeChoice(color: unknown): WatchColorModeChoice {
  return watchColorMode(color) ?? "none";
}

/** Whether the swatches show their gradient form: the stored color is a
 * gradient, or, with no color or a rainbow, the page adds in gradients. */
export function watchSwatchesInGradient(color: unknown, pageUsesGradient: boolean): boolean {
  const mode = watchColorMode(color);
  return mode === "gradient" || ((mode === undefined || mode === "rainbow") && pageUsesGradient);
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

/** Why a typed color is refused: the watch has no opacity, and only six hex
 * digits. Undefined for a color the field takes. */
export function watchColorRefusal(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const t = value.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{8}$/.test(t)) return "The watch has no opacity. Use six digits, #RRGGBB.";
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
 * end. */
export function watchIconSizeHint(max: number): string {
  const top = watchTileIconSizeTop(max);
  if (Number.isInteger(max)) return `Empty is Auto. At this tile's size, 8 to ${top}.`;
  return `Empty is Auto. At this tile's size, 8 to ${top}; ${top} stores the largest, ${watchIconSizeWords(max)}.`;
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
