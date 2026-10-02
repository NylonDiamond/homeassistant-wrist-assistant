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
  watchColorInMode,
  watchColorMode,
  watchHoldSlideSettings,
  watchPageLinkTarget,
  watchSingleTapSettings,
  watchTileActionSettings,
  watchTriggerModes,
} from "./tile-settings-model.js";
import { sameWatchId, findWatchPage } from "./edit.js";
import {
  type WatchPage,
  type WatchPageTile,
  type WatchPagesDocument,
  tileEntityId,
  tileKind,
  tileLabel,
  watchPageId,
  watchPageName,
} from "./model.js";
import type { HassEntityState } from "../ha-api.js";

// ── sections ─────────────────────────────────────────────────────────────

/** The folding sections of the Tile card, in the order they are drawn. */
export type WatchTileSettingsSection = "opens" | "header" | "icon" | "text" | "action";

export const WATCH_TILE_SETTINGS_SECTION_TITLES: Readonly<Record<WatchTileSettingsSection, string>> = {
  opens: "Opens",
  header: "Header",
  icon: "Icon and color",
  text: "Text",
  action: "Action",
};

/**
 * The sections a tile gets: none for a spacer (the watch draws nothing in
 * it); Header and Action for a header, whose look is all on the Header task;
 * Opens first for a go to page or peek tile; Icon and color, Text and Action
 * for everything else. A smart page never gets here.
 */
export function watchTileSettingsSections(tile: WatchPageTile): WatchTileSettingsSection[] {
  const kind = tileKind(tileEntityId(tile));
  if (kind === "spacer") return [];
  if (kind === "divider") return ["header", "action"];
  const out: WatchTileSettingsSection[] = [];
  if (watchPageLinkTarget(tile) !== undefined) out.push("opens");
  out.push("icon", "text", "action");
  return out;
}

// ── menus ────────────────────────────────────────────────────────────────

/** One entry of a select. `disabled` marks a stored value shown as it is
 * and offered nowhere else. */
export interface WatchMenuOption {
  value: string;
  label: string;
  disabled?: boolean;
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

/** One hold and slide direction's row. */
export interface WatchHoldSlideRow extends WatchMenu {
  direction: WatchSlideDirection;
  title: string;
  trigger: WatchTriggerRow | undefined;
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
 */
export function watchHoldSlideMenus(tile: WatchPageTile): WatchHoldSlideMenus | undefined {
  const now = watchHoldSlideSettings(tile);
  if (!now.picker) return undefined;
  const absent = watchHoldSlideSettings({
    ...tile,
    holdSlideActions: undefined,
    holdSlideTriggerTargets: undefined,
    holdSlideHTTPActionTargets: undefined,
  });
  const rows = now.directions.map((d, i): WatchHoldSlideRow => {
    const defaultLabel = absent.directions[i]!.resolvedLabel;
    const options: WatchMenuOption[] = [{ value: WATCH_DEFAULT_CHOICE, label: `Default (${defaultLabel})` }];
    // Library actions need the library (part 3e): shown when stored, never
    // offered.
    const offered = d.offered.filter((c) => !isWatchLibraryAction(c.value));
    const none = offered.filter((c) => c.value === "none");
    let selected = d.stored ?? WATCH_DEFAULT_CHOICE;
    let note: string | undefined;
    if (d.stored !== undefined && !offered.some((c) => c.value === d.stored)) {
      selected = STORED + d.stored;
      options.push({ value: selected, label: d.storedLabel ?? d.stored, disabled: true });
      note = WATCH_NOT_OFFERED_NOTE;
    }
    options.push(...offered.filter((c) => c.value !== "none"), ...none);
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
    return {
      direction: d.direction,
      title: WATCH_SLIDE_DIRECTION_TITLES[d.direction],
      options,
      selected,
      ...(note === undefined ? {} : { note }),
      trigger,
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
export function watchChoiceMenu(choices: readonly WatchChoice[], value: string): WatchMenu {
  const options: WatchMenuOption[] = choices.map((c) => ({ value: c.value, label: c.label }));
  if (choices.some((c) => c.value === value)) return { options, selected: value };
  const stored = STORED + value;
  return {
    options: [{ value: stored, label: value === "" ? "(empty)" : value, disabled: true }, ...options],
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
    oldTargetName: typeof current?.name === "string" ? current.name : undefined,
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

// ── text ─────────────────────────────────────────────────────────────────

/** The name a tile shows with no label of its own: Home Assistant's name
 * for an entity, the target's name for a page link. The label field's
 * placeholder. */
export function watchTileFallbackName(
  tile: WatchPageTile,
  states?: Readonly<Record<string, HassEntityState>>,
  pages?: readonly WatchPage[],
): string {
  const rest = { ...tile };
  delete rest.customLabel;
  return tileLabel(rest, states, pages);
}

/** The line under the label field. */
export function watchLabelNote(tile: WatchPageTile): string {
  return watchPageLinkTarget(tile) !== undefined
    ? "Leave it empty to show the name of the page it opens."
    : "Leave it empty to show the name Home Assistant has.";
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

/** Why an icon size is refused, naming what limits it. */
export function watchIconSizeRefusal(value: number, max: number): string | undefined {
  const top = Math.max(WATCH_ICON_SIZE_RANGE.min, Math.floor(max));
  const reason = watchWholeRefusal(value, WATCH_ICON_SIZE_RANGE.min, top);
  if (reason === undefined) return undefined;
  return Math.round(value) > top
    ? `At this tile's size an icon stops growing at ${top}. Use 8 to ${top}, or make the tile bigger.`
    : reason;
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
