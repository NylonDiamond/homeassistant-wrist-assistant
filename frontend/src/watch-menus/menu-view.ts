// The menu editor's views, drawn from a host, in the complication editor's
// chrome (`editor-chrome.ts`) as the page editor wears it: the Menus card,
// which picks the menu the canvas and the inspector show (the Anywhere menu,
// the Entity quick menu, the page switcher); the Slots card, that menu's
// slots (or the switcher's pages, one picked at a time); the watch preview
// the canvas draws; and the inspector, a slot's Name, Slot and Look cards, a
// picked page's switcher settings, or with neither selected the menu's own
// settings. `<wa-menu-editor>` owns the drafts (the menus and, for a page's
// switcher settings, the pages) and hands a host in on every draw; nothing
// here keeps state of its own beyond `uiState`.
//
// Every edit is a setter of `model.ts` applied to the document as it is at
// the moment the edit commits (`host.edit`), never to the one drawn: one task
// can run two edits, and the second must start from what the first left.
//
// The fields are the panel's own (`editors.ts`), in the label-left rows of
// the page editor's inspector.
//
// Plan: app repo docs/pages_in_home_assistant_step4.md ("4d batch 1 build
// contract", item 7).

import { css, html, nothing, svg, type TemplateResult } from "lit";
import { live } from "lit/directives/live.js";
import { browserStorage, type ColumnStorage } from "../column-split.js";
import { sectionCard } from "../editor-chrome.js";
import { checkField, colorField, entityField, numberField, segField, selectField, sliderField, symbolField } from "../editors.js";
import type { HassLike } from "../ha-api.js";
import { SECTION_COLOR } from "../kinds.js";
import type { EntityRef } from "../model.js";
import type { IconProvider } from "../renderer.js";
import type { SymbolBrowser } from "../symbols.js";
import { type UiIconName, uiIcon } from "../ui-icons.js";
import { type PhonePagesLayout, renderDeviceFrame } from "../phone-frame.js";
import { type FoldId, anySectionOpen, sectionOpen, setSectionOpen, setSectionsOpen } from "../watch-pages/fold-memory.js";
import type { JsonObject } from "../watch-pages/model.js";
import { STAGE_ZOOM_STEPS } from "../watch-pages/stage.js";
import { WATCH_NOT_IN_LIST_TEXT, WATCH_NOT_ON_IPHONE_TEXT, WATCH_NO_HTTP_ACTIONS_TEXT } from "../watch-pages/catalog.js";
import { type WatchSkipChoice, WATCH_SKIP_CHOICES, watchSkipChoice, watchSkipValue } from "../watch-pages/tile-settings-options.js";
import { goToWatchHttpActions } from "../shell.js";
import { type SettingDevice, deviceNoun, noRecordTitle } from "../watch-settings.js";
import {
  SWITCHER_SECTION_TITLE,
  type SwitcherSettingsHost,
  renderSwitcherSettings,
  switcherSettingsSummary,
  watchPageSwitcherChanged,
} from "../watch-pages/switcher-settings.js";
import {
  ANYWHERE,
  MENU_ACTIONS,
  PHONE_NO_PHRASES_TEXT,
  type MenuHTTPTarget,
  type MenuListRef,
  type MenuPayloadSpec,
  type MenuStyleField,
  type MenuStyleSection,
  type MenuTargets,
  type MenusDocument,
  addWatchMenuOverride,
  addWatchMenuSlot,
  entityDomain,
  menuListKey,
  moveWatchMenuSlot,
  removeWatchMenuOverride,
  removeWatchMenuSlot,
  setWatchMenuActionKey,
  setWatchMenuInherits,
  setWatchMenuSlotAction,
  setWatchMenuSlotColor,
  setWatchMenuSlotEntityTypes,
  setWatchMenuSlotIcon,
  setWatchMenuSlotSkipConditions,
  setWatchMenuSlotVisible,
  setWatchMenuStyle,
  slotAction,
  slotActionType,
  watchMenuAction,
  watchMenuActionLabel,
  watchMenuActionNeedsInstances,
  watchMenuActionUnavailable,
  watchMenuActionValue,
  watchMenuCategoryLabel,
  watchMenuDomain,
  watchMenuDomains,
  watchMenuDomainsSharing,
  watchMenuEnumChoices,
  watchMenuFreePositions,
  watchMenuInheritedSlots,
  watchMenuInherits,
  watchMenuOfferedActions,
  watchMenuOverrideIds,
  watchMenuPositionLabel,
  watchMenuPositions,
  watchMenuReportsType,
  watchMenuRingPoint,
  watchMenuShowForTypes,
  watchMenuSlotEntityTypes,
  watchMenuSlotHasSkipConditions,
  watchMenuSlotId,
  watchMenuSlotSkipConditions,
  watchMenuSlots,
  watchMenuStyleFields,
  watchMenuStyleShown,
  watchMenuStyleValue,
  watchTriggerLook,
  watchTriggerModeLabel,
  watchTriggerModes,
  watchTriggerTargetDomains,
} from "./model.js";
import { type MenuVoiceContext, menuSlotHasVoice, menuSlotVoiceChanged, menuSlotVoiceSummary, renderSlotVoiceBody } from "./slot-voice.js";

/** What the views are handed on every draw. `document`, `targets` and
 * `busy` are read live. */
export interface MenusViewHost {
  readonly hass: HassLike;
  readonly icons: IconProvider;
  readonly symbols: SymbolBrowser;
  readonly document: MenusDocument;
  /** Pages, status pages and HTTP actions the pickers offer. */
  readonly targets: MenuTargets;
  /** Whether the iPhone has published its library (HTTP actions, status
   * pages) here. */
  readonly catalogKnown: boolean;
  /** Whether Home Assistant keeps the home's HTTP action library: "held"
   * when it holds one, and `targets.httpActions` lead with it; "empty" when
   * it holds none yet. Absent with an integration older than the library,
   * and in a test. */
  readonly httpLibrary?: "held" | "empty";
  /** Whether the watch's own status pages record loaded. Absent counts as
   * no (a test). */
  readonly statusPagesKnown?: boolean;
  /** The watch's voice settings as the slot editors read them: the phrases
   * and the defaults. Absent where nothing loaded them (a test). */
  readonly voice?: MenuVoiceContext | undefined;
  /** The device whose menus these are; a watch when absent. An iPhone has
   * no voice settings of its own. */
  readonly device?: SettingDevice;
  /** A save is out: every field is drawn off and every edit refused. */
  readonly busy: boolean;
  readonly uiState: Map<string, unknown>;
  /** The watch's screen in points: the owner's reported size, else the
   * 46 mm reference. */
  readonly screen: MenusScreen;
  /** Points to pixels for the canvas's watch: the stage's zoom. */
  readonly scale: number;
  /** The device is an iPhone: `screen` is its Pages tab's pages area, where
   * the phone opens its menus over the pages, and the menus are drawn in the
   * iPhone (`phone-frame.ts`). */
  readonly phone?: PhonePagesLayout;
  /** The pages the watch's page switcher shows, in its order. */
  readonly switcherPages: readonly MenuSwitcherPage[];
  /** Every page the switcher could show, in watch order: those it shows and
   * those left out of it (`hidden`), so a page left out can be shown again.
   * Without it, the pages it shows. */
  readonly switcherRows?: readonly MenuSwitcherRow[];
  /** The host of a page's switcher settings, editing the pages draft;
   * undefined while there is no pages draft or no such page. */
  switcherSettings?(pageId: string): SwitcherSettingsHost | undefined;
  /** Apply `change` to the document as it is now: one undo step, or with
   * `coalesce` a step the next edits with the same key replace. */
  edit(change: (document: MenusDocument) => MenusDocument, coalesce?: string): boolean;
  endCoalesce(): void;
  requestUpdate(): void;
}

export type MenusSection = "anywhere" | "entity" | "switcher";

/** The three menus, in the Menus card's order, with their names. */
export const MENUS_SECTIONS: readonly [MenusSection, string][] = [
  ["anywhere", "Anywhere menu"],
  ["entity", "Entity quick menu"],
  ["switcher", "Page switcher"],
];

export const SWITCHER_LINE = "Each page's icon, color and name are set here: pick a page in the Pages card.";

/** The note under the switcher's Style card while no page is picked. */
export const SWITCHER_PICK_NOTE = "Pick a page in the Pages card to set how it shows here.";

/** What each menu is, one line: the Menus row's tooltip and the inspector's
 * note over the menu's own settings. */
export const MENU_LINES: Readonly<Record<MenusSection, string>> = {
  anywhere: "Opens on any screen. Each place around the ring holds one slot.",
  entity: "Opens over a tile. Each type of entity has its own menu, and an entity can have a menu of its own.",
  switcher: SWITCHER_LINE,
};

/** What the editor edits, and when a save arrives: the Menus card's line. */
export const MENUS_CARD_LINE = "The Anywhere menu, the Entity quick menu and the page switcher. A save reaches the watch the next time it checks.";

/** The hint under the watch while a menu with slots is shown. */
export const MENU_STAGE_HINT = "Tap a slot on the watch or in the list to edit it.";

/** A watch screen's size in points. */
export interface MenusScreen {
  readonly width: number;
  readonly height: number;
}

/** A page as the watch's page switcher draws it: its switcher text (absent
 * when the page shows as an icon), its icon and its color. */
export interface MenuSwitcherPage {
  readonly id: string;
  readonly name: string;
  readonly text?: string;
  readonly icon: string;
  readonly color: string;
}

/** A row of the switcher's Pages card: a page the switcher could show, and
 * whether it is left out of it. A page left out has no place in the
 * switcher, so no color by place either. */
export interface MenuSwitcherRow extends MenuSwitcherPage {
  readonly hidden: boolean;
}

/** The ring's radius as a share of the screen's shorter side. */
const RING_RADIUS = 0.36;

/** The row thumbnails' box, CSS px: the page editor's and the complication
 * editor's layer thumbs. */
const THUMB_W = 44;
const THUMB_H = 22;

/**
 * Where a point of the unit square of `watchMenuRingPoint` lands on a screen
 * of `screen`'s proportions, as shares of its width and height: the square is
 * the screen's shorter side, centred, so the ring stays round on a screen
 * taller than it is wide.
 */
export function menuScreenPoint(screen: MenusScreen, point: { x: number; y: number }): { x: number; y: number } {
  const side = Math.min(screen.width, screen.height);
  const round = (n: number) => Math.round(n * 10000) / 10000;
  return {
    x: round(0.5 + ((point.x - 0.5) * side) / screen.width),
    y: round(0.5 + ((point.y - 0.5) * side) / screen.height),
  };
}

/** Where page `index` of `count` sits around the switcher's ring, in the
 * unit square: the first at top centre, the rest spread evenly
 * counterclockwise, as the watch places them. */
export function switcherRingPoint(index: number, count: number, radius = RING_RADIUS): { x: number; y: number } {
  const angle = ((270 - (index * 360) / Math.max(1, count)) * Math.PI) / 180;
  const round = (n: number) => Math.round(n * 10000) / 10000;
  return { x: round(0.5 + radius * Math.cos(angle)), y: round(0.5 + radius * Math.sin(angle)) };
}

// ── the zoom ─────────────────────────────────────────────────────────────

/** Where the menu stage's zoom is remembered: the scale stepped to, or
 * nothing while it fits. The page editor's pattern (`stage.ts`), its own key. */
export const MENUS_ZOOM_KEY = "wrist-assistant-panel.menus.zoom.v1";

/** The zoom stepped to last time, or undefined (fit) when there is none, it
 * is not one of the page editor's steps, or the browser keeps nothing. */
export function loadMenusZoom(storage: ColumnStorage | undefined = browserStorage()): number | undefined {
  try {
    const raw = storage?.getItem(MENUS_ZOOM_KEY);
    if (raw === null || raw === undefined || raw === "") return undefined;
    const scale = Number(raw);
    return STAGE_ZOOM_STEPS.includes(scale) ? scale : undefined;
  } catch {
    return undefined;
  }
}

/** Remember the zoom; undefined (fit) is kept as an empty value. */
export function saveMenusZoom(scale: number | undefined, storage: ColumnStorage | undefined = browserStorage()): void {
  try {
    storage?.setItem(MENUS_ZOOM_KEY, scale === undefined ? "" : String(scale));
  } catch {
    // Private windows and full storage keep the zoom for this visit only.
  }
}

// ── the inspector's badges ───────────────────────────────────────────────

/** A card of the inspector. */
export type MenuInspectorSection = "name" | "slot" | "look" | "menu" | "style" | "switcherPage";

/** A section card's mark: the color it is tinted with and the glyph in its
 * badge. */
export interface MenuSectionBadge {
  color: string;
  icon: UiIconName;
}

/**
 * Each inspector card's badge, in the complication editor's colors as the
 * page editor's tile cards have them (`WATCH_TILE_SECTION_BADGES`): the Name
 * card is Place grey, what a slot does and which list a menu shows are
 * Content blue, and how a slot or a menu looks is Look purple. A page's
 * place in the switcher is Content, with the watch glyph, as its chip was in
 * the page editor's strip.
 */
export const MENU_SECTION_BADGES: Readonly<Record<MenuInspectorSection, MenuSectionBadge>> = {
  name: { color: SECTION_COLOR.place, icon: "text" },
  slot: { color: SECTION_COLOR.content, icon: "content" },
  look: { color: SECTION_COLOR.look, icon: "look" },
  menu: { color: SECTION_COLOR.content, icon: "content" },
  style: { color: SECTION_COLOR.look, icon: "look" },
  switcherPage: { color: SECTION_COLOR.content, icon: "watch" },
};

/** The breadcrumb chip of a menu: the Menus card's hue. */
export const MENU_CHIP_COLOR = "#26a69a";

/** The breadcrumb chip of a page: the page editor's (`WATCH_PAGE_CHIP_COLOR`
 * in `page-settings.ts`, which this chunk does not import: it would bring
 * the page editor's views along). */
export const MENU_PAGE_CHIP_COLOR = SECTION_COLOR.complication;

/** The fold memory's module for the inspector's cards (`fold-memory.ts`). */
const FOLD_MODULE = "menu-editor";

// ── shared bits ──────────────────────────────────────────────────────────

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

function nameOf(hass: HassLike, entityId: string): string {
  const name = hass.states[entityId]?.attributes?.friendly_name;
  return typeof name === "string" && name.trim() !== "" ? name : entityId;
}

function refOf(hass: HassLike, entityId: string): EntityRef {
  return { entityId, displayName: entityId === "" ? "" : nameOf(hass, entityId), domain: entityDomain(entityId) };
}

function glyph(host: Pick<MenusViewHost, "icons">, icon: string, size: number, color: string): TemplateResult {
  return host.icons.render(icon, size, color) ?? html`<span class="me-glyph-dot" style=${`background:${color}`}></span>`;
}

/** The icon and color a slot is drawn with: a type this table does not know
 * draws the phone's "Sync Needed" look. */
function slotLook(slot: JsonObject): { icon: string; color: string } {
  if (watchMenuAction(slotActionType(slot)) === undefined) {
    return { icon: MENU_ACTIONS.unknownActionIcon, color: MENU_ACTIONS.unknownActionColor };
  }
  return {
    icon: typeof slot.icon === "string" && slot.icon !== "" ? slot.icon : "circle",
    color: typeof slot.color === "string" ? slot.color : "#FFFFFF",
  };
}

/** The icon and color a slot takes from its action: the action's own, or
 * for a trigger the look of its target's domain, as the phone gives them.
 * Undefined for an action this table does not know. */
export function menuSlotDefaultLook(slot: JsonObject): { icon: string; color: string } | undefined {
  const raw = slotActionType(slot);
  if (raw === "triggerEntity") {
    const target = slotAction(slot).entityId;
    return watchTriggerLook(entityDomain(typeof target === "string" ? target : ""));
  }
  const spec = watchMenuAction(raw);
  return spec === undefined ? undefined : { icon: spec.icon, color: spec.color };
}

function sameId(a: string, b: string): boolean {
  return a.toUpperCase() === b.toUpperCase();
}

function sameColor(a: string, b: string): boolean {
  return a.toUpperCase() === b.toUpperCase();
}

/** The slot's target in words, for the list: the entity's name, the page's,
 * the HTTP action's. */
function targetText(host: Pick<MenusViewHost, "hass" | "targets">, slot: JsonObject): string | undefined {
  const raw = slotActionType(slot);
  const action = slotAction(slot);
  const spec = watchMenuAction(raw);
  for (const p of spec?.payload ?? []) {
    const value = action[p.key];
    if (typeof value !== "string" || value === "") continue;
    if (p.type === "entity") return nameOf(host.hass, value);
    if (p.target === "page") return host.targets.pages.find((t) => sameId(t.id, value))?.name ?? "A page not in the pages";
    if (p.target === "statusPage") return host.targets.statusPages.find((t) => sameId(t.id, value))?.name ?? "A status page";
    if (p.target === "httpAction") return host.targets.httpActions.find((t) => sameId(t.id, value))?.name ?? "An HTTP action";
    if (p.target === "ttsPhrase") {
      const phrases = host.targets.phrases;
      return phrases?.find((t) => sameId(t.id, value))?.name ?? (phrases === undefined ? "A phrase" : "A phrase that is gone");
    }
  }
  return undefined;
}

/** A slot's name: what it runs (an entity, a page, an HTTP action) when it
 * names one, else its action. A slot keeps no label of its own. */
export function menuSlotName(host: Pick<MenusViewHost, "hass" | "targets">, slot: JsonObject): string {
  return targetText(host, slot) ?? watchMenuActionLabel(slotActionType(slot));
}

/** A slot's row line: its place around the ring and its action. */
export function menuSlotDetail(slot: JsonObject): string {
  return `${watchMenuPositionLabel(typeof slot.position === "string" ? slot.position : "")} · ${watchMenuActionLabel(slotActionType(slot))}`;
}

/** Slots in the order of the places around the ring. */
function byPlace(slots: JsonObject[]): JsonObject[] {
  const order = watchMenuPositions();
  const at = (s: JsonObject) => {
    const i = order.indexOf(typeof s.position === "string" ? s.position : "");
    return i < 0 ? order.length : i;
  };
  return slots.slice().sort((a, b) => at(a) - at(b));
}

/** An entity type's name, from the domain list. */
function typeLabel(type: string): string {
  return watchMenuDomain(type)?.label ?? type;
}

// ── which menu, which list, which slot ───────────────────────────────────

const MENU_KEY = "me:menu";
const ENTITY_MODE_KEY = "me:er:mode";
const ENTITY_DOMAIN_KEY = "me:er:domain";
const ENTITY_ID_KEY = "me:er:entity";
const ENTITY_ADD_KEY = "me:er:add";

type ViewState = Pick<MenusViewHost, "uiState" | "document">;

/** The menu the canvas and the inspector show: the one picked in the Menus
 * card, else the Anywhere menu. */
export function shownMenu(host: Pick<MenusViewHost, "uiState">): MenusSection {
  const stored = host.uiState.get(MENU_KEY);
  return stored === "entity" || stored === "switcher" ? stored : "anywhere";
}

/** Show `menu`. Another menu than the one shown lets go of the switcher's
 * picked page. */
export function selectMenu(host: Pick<MenusViewHost, "uiState" | "requestUpdate">, menu: MenusSection): void {
  if (menu !== shownMenu(host)) host.uiState.delete(SWITCHER_PAGE_KEY);
  host.uiState.set(MENU_KEY, menu);
  host.requestUpdate();
}

const SWITCHER_PAGE_KEY = "me:sw:page";

type SwitcherState = Pick<MenusViewHost, "uiState" | "switcherPages" | "switcherRows">;

/** The Pages card's rows: every page the switcher could show. */
function switcherRows(host: Pick<MenusViewHost, "switcherPages" | "switcherRows">): readonly MenuSwitcherRow[] {
  return host.switcherRows ?? host.switcherPages.map((p) => ({ ...p, hidden: false }));
}

/** The page picked in the switcher's Pages card, while the switcher is shown
 * and the page is still one of its rows. */
export function selectedSwitcherPage(host: SwitcherState): MenuSwitcherRow | undefined {
  if (shownMenu(host) !== "switcher") return undefined;
  const stored = host.uiState.get(SWITCHER_PAGE_KEY);
  if (typeof stored !== "string") return undefined;
  return switcherRows(host).find((p) => sameId(p.id, stored));
}

/** Pick a page in the switcher's Pages card, or none (back to the
 * switcher's own style). */
export function selectSwitcherPage(host: Pick<MenusViewHost, "uiState" | "requestUpdate">, id: string | undefined): void {
  if (id === undefined) host.uiState.delete(SWITCHER_PAGE_KEY);
  else host.uiState.set(SWITCHER_PAGE_KEY, id);
  host.requestUpdate();
}

/** The picked page's switcher settings host, when there is a page picked and
 * a pages draft to edit it in. */
export function selectedSwitcherSettings(host: SwitcherState & Pick<MenusViewHost, "switcherSettings">): SwitcherSettingsHost | undefined {
  const page = selectedSwitcherPage(host);
  return page === undefined ? undefined : host.switcherSettings?.(page.id);
}

export function menuSectionLabel(menu: MenusSection): string {
  return MENUS_SECTIONS.find(([id]) => id === menu)?.[1] ?? menu;
}

function entityMode(host: Pick<MenusViewHost, "uiState">): "domain" | "entity" {
  return host.uiState.get(ENTITY_MODE_KEY) === "entity" ? "entity" : "domain";
}

function shownDomain(host: Pick<MenusViewHost, "uiState">): string {
  const stored = host.uiState.get(ENTITY_DOMAIN_KEY);
  return typeof stored === "string" && watchMenuDomain(stored) !== undefined ? stored : "light";
}

function shownEntity(host: ViewState): string | undefined {
  const ids = watchMenuOverrideIds(host.document);
  const stored = host.uiState.get(ENTITY_ID_KEY);
  return typeof stored === "string" && ids.includes(stored) ? stored : ids[0];
}

/** The slot list the shown menu edits: the Anywhere menu's; the Entity quick
 * menu's type or entity; none for the page switcher, or By entity before an
 * entity has a menu of its own. */
export function shownMenuList(host: ViewState): MenuListRef | undefined {
  switch (shownMenu(host)) {
    case "anywhere":
      return ANYWHERE;
    case "entity":
      return entityList(host);
    case "switcher":
      return undefined;
  }
}

/** The Entity quick menu's list as its Menu card has it set: the type's, or
 * the shown entity's own, or none while no entity has one. */
function entityList(host: ViewState): MenuListRef | undefined {
  if (entityMode(host) === "domain") return { list: "domain", domain: shownDomain(host) };
  const id = shownEntity(host);
  return id === undefined ? undefined : { list: "entity", entityId: id };
}

/** A list's name on the watch: "Anywhere menu", "Light menu". */
function listLabel(host: Pick<MenusViewHost, "hass">, ref: MenuListRef): string {
  if (ref.list === "anywhere") return "Anywhere menu";
  if (ref.list === "domain") return `${typeLabel(ref.domain)} menu`;
  return `${nameOf(host.hass, ref.entityId)} menu`;
}

function selectionKey(ref: MenuListRef): string {
  return `me:sel:${menuListKey(ref)}`;
}

/** The selected slot of a list: the one picked last while it is still
 * there. None until one is picked, so the inspector shows the menu's own
 * settings, as the page editor shows a page's with no tile selected. */
export function selectedMenuSlot(host: ViewState, ref: MenuListRef): JsonObject | undefined {
  const stored = host.uiState.get(selectionKey(ref));
  if (typeof stored !== "string") return undefined;
  return watchMenuSlots(host.document, ref).find((s) => sameId(watchMenuSlotId(s), stored));
}

function select(host: Pick<MenusViewHost, "uiState" | "requestUpdate">, ref: MenuListRef, id: string | undefined): void {
  host.uiState.set(selectionKey(ref), id);
  host.requestUpdate();
}

/** Let go of the shown list's selected slot, or the switcher's picked page,
 * back to the menu's own settings. Whether there was one. */
export function deselectMenuSlot(host: Pick<MenusViewHost, "uiState" | "document" | "requestUpdate" | "switcherPages" | "switcherRows">): boolean {
  if (selectedSwitcherPage(host) !== undefined) {
    selectSwitcherPage(host, undefined);
    return true;
  }
  const ref = shownMenuList(host);
  if (ref === undefined || selectedMenuSlot(host, ref) === undefined) return false;
  select(host, ref, undefined);
  return true;
}

function addAt(host: MenusViewHost, ref: MenuListRef, position?: string): void {
  let added: string | undefined;
  host.edit((d) => {
    const result = addWatchMenuSlot(d, ref, { ...(position === undefined ? {} : { position }), targets: host.targets });
    added = result.id;
    return result.document;
  });
  if (added !== undefined) select(host, ref, added);
}

// ── the Menus card ───────────────────────────────────────────────────────

/** A ring drawn small, for a row's thumb: the guide ring and one dot per
 * point in its color. */
function ringThumb(dots: readonly { x: number; y: number; color: string }[]): TemplateResult {
  const r = 8;
  const at = (n: number, centre: number) => Math.round((centre + ((n - 0.5) / RING_RADIUS) * r) * 100) / 100;
  return html`<span class="thumb me-ring-thumb" aria-hidden="true"><svg viewBox=${`0 0 ${THUMB_W} ${THUMB_H}`}>
    <circle cx="22" cy="11" r=${r} class="me-thumb-track"></circle>
    ${dots.map((d) => svg`<circle cx=${at(d.x, 22)} cy=${at(d.y, 11)} r="2.2" fill=${d.color}></circle>`)}
  </svg></span>`;
}

/** A list's shown slots as thumb dots. */
function listDots(host: ViewState, ref: MenuListRef | undefined): { x: number; y: number; color: string }[] {
  if (ref === undefined) return [];
  return watchMenuSlots(host.document, ref).flatMap((slot) => {
    if (slot.isVisible === false) return [];
    const point = watchMenuRingPoint(typeof slot.position === "string" ? slot.position : "");
    return point === undefined ? [] : [{ ...point, color: slotLook(slot).color }];
  });
}

/** What a Menus row says under its name. */
export function menuRowDetail(host: Pick<MenusViewHost, "uiState" | "document" | "hass" | "switcherPages">, menu: MenusSection): string {
  if (menu === "anywhere") return plural(watchMenuSlots(host.document, ANYWHERE).length, "slot", "slots");
  if (menu === "switcher") return plural(host.switcherPages.length, "page", "pages");
  if (entityMode(host) === "domain") return `By type · ${typeLabel(shownDomain(host))}`;
  const id = shownEntity(host);
  return `By entity · ${id === undefined ? "none yet" : nameOf(host.hass, id)}`;
}

function menuThumb(host: MenusViewHost, menu: MenusSection): TemplateResult {
  if (menu === "switcher") {
    const pages = host.switcherPages;
    return ringThumb(pages.map((p, i) => ({ ...switcherRingPoint(i, pages.length), color: p.color })));
  }
  return ringThumb(listDots(host, menu === "anywhere" ? ANYWHERE : entityList(host)));
}

/** The Menus card: one row per menu, the shown one lit. A row picks the
 * menu the canvas and the inspector show. */
export function renderMenusCard(host: MenusViewHost): TemplateResult {
  const shown = shownMenu(host);
  return html`<section class="card lc me-menus-card" aria-label="Menus"
    style=${`--c: var(--wa-lc-pages, #26a69a); --thumb-w: ${THUMB_W}px; --thumb-h: ${THUMB_H}px`}>
    <div class="lc-head">
      <span class="swatch">${uiIcon("radial")}</span><span class="lc-title">Menus</span>
      <span class="lc-sub" title=${MENUS_CARD_LINE}>on the watch</span>
    </div>
    <div class="layers me-menu-list" role="list">
      ${MENUS_SECTIONS.map(([id, label]) => {
        const on = id === shown;
        const pick = () => { if (!on) selectMenu(host, id); };
        return html`<div class="layer me-menu-row ${on ? "hl" : ""}" data-menu=${id} role="listitem" tabindex="0"
          aria-current=${on ? "true" : "false"} aria-label=${label} title=${MENU_LINES[id]}
          @click=${pick}
          @keydown=${(e: KeyboardEvent) => {
            if (e.target !== e.currentTarget || (e.key !== "Enter" && e.key !== " ")) return;
            e.preventDefault();
            pick();
          }}>
          <span class="grip" aria-hidden="true"></span>
          ${menuThumb(host, id)}
          <span class="name"><b><span class="nm-t">${label}</span></b><small>${menuRowDetail(host, id)}</small></span>
          <span class="right"></span>
        </div>`;
      })}
    </div>
  </section>`;
}

// ── the Slots card ───────────────────────────────────────────────────────

function slotThumb(host: Pick<MenusViewHost, "icons">, icon: string, color: string): TemplateResult {
  return html`<span class="thumb me-thumb" style=${`--c:${color}`} aria-hidden="true"><span class="me-thumb-glyph">${glyph(host, icon, 14, color)}</span></span>`;
}

function slotRow(host: MenusViewHost, ref: MenuListRef, slot: JsonObject, selected: JsonObject | undefined): TemplateResult {
  const id = watchMenuSlotId(slot);
  const look = slotLook(slot);
  const on = selected !== undefined && sameId(id, watchMenuSlotId(selected));
  const hidden = slot.isVisible === false;
  const name = menuSlotName(host, slot);
  const detail = menuSlotDetail(slot);
  const pick = () => select(host, ref, id);
  return html`<div class="layer me-slot-row ${on ? "hl" : ""} ${hidden ? "dim" : ""}" data-slot=${id} style=${`--k:${look.color}`}
    role="listitem" tabindex="0" aria-current=${on ? "true" : "false"} aria-label=${name}
    title=${`${name} · ${detail}${hidden ? ", hidden" : ""}`}
    @click=${(e: Event) => { if (!(e.target instanceof Element && e.target.closest("button"))) pick(); }}
    @keydown=${(e: KeyboardEvent) => {
      if (e.target !== e.currentTarget || (e.key !== "Enter" && e.key !== " ")) return;
      e.preventDefault();
      pick();
    }}>
    <span class="grip" aria-hidden="true"></span>
    ${slotThumb(host, look.icon, look.color)}
    <span class="name"><b><span class="nm-t">${name}</span></b><small>${detail}</small></span>
    <span class="right">
      <span class="badges">${hidden ? html`<span class="badge">hidden</span>` : nothing}</span>
      <span class="acts">
        <button type="button" class="icon danger" ?disabled=${host.busy} title="Remove" aria-label=${`Remove ${name}`}
          @click=${() => host.edit((d) => removeWatchMenuSlot(d, ref, id))}>${uiIcon("delete")}</button>
      </span>
    </span>
  </div>`;
}

/** The line at the top of the Entity quick menu's Slots card: which list it
 * shows, and with a slot selected a way back to the menu's own settings,
 * where the type and the entity are picked. */
function entityFilter(host: MenusViewHost, ref: MenuListRef | undefined, selected: JsonObject | undefined): TemplateResult {
  const words = ref === undefined || ref.list === "anywhere" ? "By entity: none has a menu of its own yet."
    : ref.list === "domain" ? `${typeLabel(ref.domain)} menu, by type`
    : `${nameOf(host.hass, ref.entityId)}'s own menu`;
  return html`<div class="lc-filter me-filter"><span class="lc-sub">${words}</span>
    ${selected === undefined ? nothing : html`<button type="button" class="lc-ghost sm" title="Pick the type or the entity in the menu's settings"
      @click=${() => deselectMenuSlot(host)}>Change</button>`}
  </div>`;
}

/** How a page shows in the switcher, in words. */
function shownAs(page: MenuSwitcherRow): string {
  if (page.hidden) return "Not in the switcher";
  return page.text === undefined ? "Shown as its icon" : page.text === page.name ? "Shown by name" : `Shown as ${page.text}`;
}

function switcherPageRow(host: MenusViewHost, page: MenuSwitcherRow, selected: MenuSwitcherRow | undefined): TemplateResult {
  const on = selected !== undefined && sameId(selected.id, page.id);
  const detail = shownAs(page);
  const pick = () => selectSwitcherPage(host, page.id);
  return html`<div class="layer me-page-row ${on ? "hl" : ""} ${page.hidden ? "dim" : ""}" data-page=${page.id} style=${`--k:${page.color}`}
    role="listitem" tabindex="0" aria-current=${on ? "true" : "false"} aria-label=${page.name}
    title=${`${page.name} · ${detail}`}
    @click=${(e: Event) => { if (!(e.target instanceof Element && e.target.closest("button"))) pick(); }}
    @keydown=${(e: KeyboardEvent) => {
      if (e.target !== e.currentTarget || (e.key !== "Enter" && e.key !== " ")) return;
      e.preventDefault();
      pick();
    }}>
    <span class="grip" aria-hidden="true"></span>
    ${slotThumb(host, page.icon, page.color)}
    <span class="name"><b><span class="nm-t">${page.name}</span></b><small>${detail}</small></span>
    <span class="right"><span class="badges">${page.hidden ? html`<span class="badge">hidden</span>` : nothing}</span></span>
  </div>`;
}

/** The page switcher's Pages card: every page the switcher could show, in
 * watch order, those left out of it dimmed with a badge so they can be shown
 * again. A row picks the page whose switcher settings the inspector shows. */
function renderSwitcherPagesCard(host: MenusViewHost): TemplateResult {
  const pages = switcherRows(host);
  const selected = selectedSwitcherPage(host);
  const left = pages.filter((p) => p.hidden).length;
  return html`<section class="card lc me-slots-card" aria-label="Pages"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${THUMB_W}px; --thumb-h: ${THUMB_H}px`}>
    <div class="lc-head">
      <span class="swatch">${uiIcon("pages")}</span><span class="lc-title">Pages</span>
      <span class="lc-sub">${plural(pages.length, "page", "pages")}${left === 0 ? "" : `, ${left} hidden`}</span>
    </div>
    ${pages.length === 0
      ? html`<div class="lc-note">No page shows in the switcher.</div>`
      : html`<div class="layers me-page-list" role="list">${pages.map((page) => switcherPageRow(host, page, selected))}</div>`}
  </section>`;
}

/** The Slots card: the shown menu's slots around the ring, in ring order,
 * each with its icon in its color, its name over its place and action, and
 * on hover Remove; + Add puts one at the first free place. For the page
 * switcher, its pages, one picked at a time. */
export function renderSlotsCard(host: MenusViewHost): TemplateResult {
  const menu = shownMenu(host);
  if (menu === "switcher") return renderSwitcherPagesCard(host);
  const ref = shownMenuList(host);
  const slots = ref === undefined ? [] : byPlace(watchMenuSlots(host.document, ref));
  const selected = ref === undefined ? undefined : selectedMenuSlot(host, ref);
  const free = ref === undefined ? [] : watchMenuFreePositions(host.document, ref);
  const addTitle = ref === undefined ? "Add an entity first, in the menu's settings."
    : free.length === 0 ? "Every place around the ring is taken." : "Add a slot at the first free place";
  let body: TemplateResult;
  if (ref === undefined) body = html`<div class="lc-note">Add an entity to edit its menu.</div>`;
  else if (slots.length === 0) body = html`<div class="lc-note">No slots yet.</div>`;
  else body = html`<div class="layers me-slot-list" role="list">${slots.map((slot) => slotRow(host, ref, slot, selected))}</div>`;
  return html`<section class="card lc me-slots-card" aria-label="Slots"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${THUMB_W}px; --thumb-h: ${THUMB_H}px`}>
    <div class="lc-head">
      <span class="swatch">${uiIcon("layers")}</span><span class="lc-title">Slots</span>
      ${ref === undefined ? nothing : html`<span class="lc-sub">${plural(slots.length, "slot", "slots")}</span>`}
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri me-add-slot" aria-label="Add slot" ?disabled=${host.busy || ref === undefined || free.length === 0}
        title=${addTitle} @click=${() => { if (ref !== undefined) addAt(host, ref); }}>${uiIcon("plus")}<span>Add</span></button>
    </div>
    ${menu === "entity" ? entityFilter(host, ref, selected) : nothing}
    ${body}
  </section>`;
}

// ── the watch screen and the ring ────────────────────────────────────────

/** A point of the unit square placed on the screen, as a style. */
function screenStyle(screen: MenusScreen, point: { x: number; y: number }): string {
  const at = menuScreenPoint(screen, point);
  return `left:${at.x * 100}%;top:${at.y * 100}%`;
}

/** Where a dot sits on the ring preview, as a style. */
function pointStyle(screen: MenusScreen, position: string, radius?: number): string | undefined {
  const point = watchMenuRingPoint(position, radius ?? RING_RADIUS);
  return point === undefined ? undefined : screenStyle(screen, point);
}

/**
 * The watch screen in its case, at the screen's real proportions: black, a
 * dashed guide ring around the centre, a centre dot where the finger rests,
 * and `content` over them (dots placed in shares of the screen). The dots'
 * sizes follow the scale through `--me-s`.
 */
function renderScreen(host: MenusViewHost, label: string, content: unknown): TemplateResult {
  const { width, height } = host.screen;
  const scale = host.scale;
  const side = Math.min(width, height);
  const box = html`<div class="me-screen" role="group" aria-label=${label}
    style=${`width:${Math.round(width * scale)}px;height:${Math.round(height * scale)}px;--me-s:${scale}`}>
    <svg class="me-screen-bg" viewBox=${`0 0 ${width} ${height}`} aria-hidden="true">
      <circle cx=${width / 2} cy=${height / 2} r=${side * RING_RADIUS} class="me-track"></circle>
      <circle cx=${width / 2} cy=${height / 2} r=${side * 0.05} class="me-center"></circle>
    </svg>
    ${content}
  </div>`;
  return renderDeviceFrame(host.phone, { width, height }, scale, box, label, host.icons);
}

/** A glyph's size in pixels on the preview: `points` at the preview's scale. */
function dotGlyph(host: MenusViewHost, points: number): number {
  return Math.round(points * host.scale);
}

/**
 * The ring preview, one place at a time. The dot at a place is the first of
 * the list's own visible slots there; else a visible All slot the list takes
 * in (dashed, not a button); else the list's own hidden slot; else an add
 * button when the place is free. Any other slot of the list's own at that
 * place is drawn as a second, smaller dot nearer the center, and a main dot
 * of the list's own carries a count of the list's slots there (the phone's
 * climate defaults put two at top center).
 */
function renderRing(host: MenusViewHost, ref: MenuListRef, selected: JsonObject | undefined, label: string): TemplateResult {
  const screen = host.screen;
  const slots = watchMenuSlots(host.document, ref);
  const inherited = watchMenuInheritedSlots(host.document, ref);
  const free = new Set(watchMenuFreePositions(host.document, ref));
  const selectedId = selected === undefined ? undefined : watchMenuSlotId(selected);
  const ownDot = (slot: JsonObject, position: string, style: string, extra: string, count: number): TemplateResult => {
    const look = slotLook(slot);
    const id = watchMenuSlotId(slot);
    const on = selectedId !== undefined && sameId(id, selectedId);
    const label = `${watchMenuPositionLabel(position)}: ${watchMenuActionLabel(slotActionType(slot))}${slot.isVisible === false ? ", hidden" : ""}`;
    return html`<button type="button" class="me-dot ${extra} ${on ? "on" : ""} ${slot.isVisible === false ? "off" : ""}" style=${`${style};--c:${look.color}`}
      title=${label} aria-label=${label} aria-pressed=${on ? "true" : "false"} @click=${() => select(host, ref, id)}>
      ${glyph(host, look.icon, dotGlyph(host, extra === "" ? 15 : 11), look.color)}${count > 1 ? html`<span class="me-count" aria-hidden="true">${count}</span>` : nothing}</button>`;
  };
  return renderScreen(host, `${label} on the watch`, watchMenuPositions().map((position) => {
      const style = pointStyle(screen, position);
      if (style === undefined) return nothing;
      const here = slots.filter((s) => s.position === position);
      const shown = here.find((s) => s.isVisible !== false);
      const shared = shown === undefined ? inherited.find((s) => s.position === position && s.isVisible !== false) : undefined;
      const main = shown ?? (shared === undefined ? here[0] : undefined);
      const second = here.find((s) => s !== main);
      let dot: TemplateResult | typeof nothing;
      if (main !== undefined) {
        dot = ownDot(main, position, style, "", here.length);
      } else if (shared !== undefined) {
        const look = slotLook(shared);
        dot = html`<span class="me-dot inh" style=${`${style};--c:${look.color}`} title=${`${watchMenuPositionLabel(position)}: ${watchMenuActionLabel(slotActionType(shared))}, from All`}>
          ${glyph(host, look.icon, dotGlyph(host, 13), look.color)}</span>`;
      } else if (free.has(position)) {
        dot = html`<button type="button" class="me-dot free" style=${style} ?disabled=${host.busy}
          title=${`Add a slot at ${watchMenuPositionLabel(position)}`} aria-label=${`Add a slot at ${watchMenuPositionLabel(position)}`}
          @click=${() => addAt(host, ref, position)}>${uiIcon("plus")}</button>`;
      } else {
        dot = nothing;
      }
      const inner = second === undefined ? undefined : pointStyle(screen, position, 0.2);
      return html`${dot}${second === undefined || inner === undefined ? nothing : ownDot(second, position, inner, "two", 0)}`;
    }));
}

/** The page switcher as the watch draws it: each page the switcher shows,
 * spread around the ring from top centre, by its switcher text in its color,
 * or by its icon, the page picked in the Pages card lit. A page is picked in
 * that card, so nothing here is a button. A page left out of the switcher is
 * not drawn. */
function renderSwitcherScreen(host: MenusViewHost): TemplateResult {
  const pages = host.switcherPages;
  const screen = host.screen;
  const picked = selectedSwitcherPage(host);
  const content = pages.length === 0
    ? html`<p class="me-screen-note">No pages in the switcher yet.</p>`
    : pages.map((page, i) => {
      const style = `${screenStyle(screen, switcherRingPoint(i, pages.length))};--c:${page.color}`;
      const on = picked !== undefined && sameId(picked.id, page.id) ? "on" : "";
      return page.text === undefined
        ? html`<span class="me-dot me-page-dot ${on}" style=${style} title=${page.name}>${glyph(host, page.icon, dotGlyph(host, 14), page.color)}</span>`
        : html`<span class="me-page ${on}" style=${style} title=${page.name}>${page.text}</span>`;
    });
  return renderScreen(host, "Page switcher on the watch", content);
}

/** The shown menu on the watch, for the canvas: its ring with the selected
 * slot lit, or the page switcher. */
export function renderMenuScreen(host: MenusViewHost): TemplateResult {
  if (shownMenu(host) === "switcher") return renderSwitcherScreen(host);
  const ref = shownMenuList(host);
  if (ref === undefined) {
    return renderScreen(host, "Entity quick menu on the watch", html`<p class="me-screen-note">Add an entity to edit its menu.</p>`);
  }
  return renderRing(host, ref, selectedMenuSlot(host, ref), listLabel(host, ref));
}

/** What the canvas head says about the shown menu, before the watch's size:
 * "8 slots", "Light · 5 slots", "4 pages". */
export function menuStageFacts(host: Pick<MenusViewHost, "uiState" | "document" | "hass" | "switcherPages">): string[] {
  if (shownMenu(host) === "switcher") return [plural(host.switcherPages.length, "page", "pages")];
  const ref = shownMenuList(host);
  if (ref === undefined) return ["No entity yet"];
  const count = plural(watchMenuSlots(host.document, ref).length, "slot", "slots");
  if (ref.list === "anywhere") return [count];
  return [ref.list === "domain" ? typeLabel(ref.domain) : nameOf(host.hass, ref.entityId), count];
}

/** The hint under the watch. */
export function menuStageHint(host: ViewState): string {
  if (shownMenu(host) === "switcher") return SWITCHER_LINE;
  return shownMenuList(host) === undefined ? "Add an entity in the menu's settings to give it a menu of its own." : MENU_STAGE_HINT;
}

// ── the inspector ────────────────────────────────────────────────────────

function isOpen(host: Pick<MenusViewHost, "uiState">, section: string): boolean {
  return sectionOpen(host.uiState, FOLD_MODULE, section);
}

function toggle(host: Pick<MenusViewHost, "uiState" | "requestUpdate">, section: string): void {
  setSectionOpen(host.uiState, FOLD_MODULE, section, !isOpen(host, section));
  host.requestUpdate();
}

/** The cards drawn now that fold, for the inspector's Collapse all. */
export function menuInspectorFolds(host: ViewState & SwitcherState & Pick<MenusViewHost, "switcherSettings">): FoldId[] {
  if (selectedSwitcherSettings(host) !== undefined) return [{ module: FOLD_MODULE, section: "switcher-page" }];
  const ref = shownMenuList(host);
  const picked = ref === undefined ? undefined : selectedMenuSlot(host, ref);
  if (picked !== undefined) {
    return [
      { module: FOLD_MODULE, section: "slot" },
      ...(menuSlotHasVoice(picked) ? [{ module: FOLD_MODULE, section: "voice" }] : []),
      { module: FOLD_MODULE, section: "look" },
    ];
  }
  const menu = shownMenu(host);
  return [{ module: FOLD_MODULE, section: menu === "entity" ? "menu" : `style-${menu}` }];
}

/** One inspector card, in its badge's color. */
function card(
  host: MenusViewHost,
  badge: MenuInspectorSection,
  fold: string,
  title: string,
  body: TemplateResult,
  extra: { summary?: string; dot?: boolean } = {},
): TemplateResult {
  const open = isOpen(host, fold);
  const mark = MENU_SECTION_BADGES[badge];
  return sectionCard({
    color: mark.color,
    icon: uiIcon(mark.icon),
    title,
    open,
    onToggle: () => toggle(host, fold),
    ...(extra.summary === undefined || extra.summary === "" ? {} : { summary: extra.summary }),
    dot: extra.dot === true,
    id: `${FOLD_MODULE}:${fold}`,
  }, open ? body : html``);
}

/**
 * The inspector: a sticky head with the breadcrumb (the menu, then with a
 * slot selected the slot's chip in its color and its name; the menu's name
 * is the way back to its own settings) and Collapse all, then the cards. A
 * selected slot has its Name, Slot and Look cards and Remove; a page picked
 * in the switcher's Pages card has its "In the page switcher" card (the crumb
 * "Page switcher" is the way back); with neither, the menu's own: the
 * Anywhere menu's and the page switcher's Style, the Entity quick menu's
 * Menu (which type or entity it shows).
 */
export function renderMenuInspector(host: MenusViewHost): TemplateResult {
  const menu = shownMenu(host);
  const label = menuSectionLabel(menu);
  const ref = shownMenuList(host);
  const slot = ref === undefined ? undefined : selectedMenuSlot(host, ref);
  const folds = menuInspectorFolds(host);
  const anyOpen = anySectionOpen(host.uiState, folds);
  const picked = selectedSwitcherPage(host);
  const settings = selectedSwitcherSettings(host);
  let crumbs: TemplateResult;
  let body: TemplateResult;
  if (picked !== undefined && settings !== undefined) {
    crumbs = html`<div class="crumbs"><button class="root" title="The switcher's own style" @click=${() => selectSwitcherPage(host, undefined)}>${label}</button><span class="sep">›</span><span class="kchip" style=${`--k:${MENU_PAGE_CHIP_COLOR}`}>Page</span><span class="nm" title=${picked.name}>${picked.name}</span></div>`;
    body = renderSwitcherPageCard(host, settings);
  } else if (slot === undefined || ref === undefined) {
    crumbs = html`<div class="crumbs"><span class="kchip" style=${`--k:${MENU_CHIP_COLOR}`}>Menu</span><span class="nm" title=${label}>${label}</span></div>`;
    body = renderMenuSettings(host, menu);
  } else {
    const name = menuSlotName(host, slot);
    crumbs = html`<div class="crumbs"><button class="root" title="Edit the menu" @click=${() => select(host, ref, undefined)}>${label}</button><span class="sep">›</span><span class="kchip" style=${`--k:${slotLook(slot).color}`}>Slot</span><span class="nm" title=${name}>${name}</span></div>`;
    body = renderSlotInspector(host, ref, slot);
  }
  return html`<div class="insp-head">
      ${crumbs}
      <button class="expand" @click=${() => { setSectionsOpen(host.uiState, folds, !anyOpen); host.requestUpdate(); }}>${anyOpen ? "Collapse all" : "Expand all"}</button>
    </div>
    <div class="insp-body">${body}</div>`;
}

/** The picked page's one card: how it shows in the switcher, its rows in a
 * fieldset that switches every control off while a save is out. */
function renderSwitcherPageCard(host: MenusViewHost, settings: SwitcherSettingsHost): TemplateResult {
  const page = settings.page;
  return card(host, "switcherPage", "switcher-page", SWITCHER_SECTION_TITLE,
    html`<fieldset class="ts-body me-body" ?disabled=${host.busy} aria-label=${SWITCHER_SECTION_TITLE}>${renderSwitcherSettings(settings)}</fieldset>`,
    { summary: switcherSettingsSummary(page), dot: watchPageSwitcherChanged(page) });
}

// ── a slot's cards ───────────────────────────────────────────────────────

const PAYLOAD_LABELS: Readonly<Record<string, string>> = {
  triggerMode: "Mode",
  confirmOnRelease: "Confirm on release",
  showBanner: "Show banner",
  bannerSeconds: "Banner seconds",
  openOnRelease: "Open on release",
  instanceSwitchBehavior: "Behavior",
  phraseId: "Phrase",
};

function payloadLabel(raw: string, spec: MenuPayloadSpec): string {
  if (spec.key === "entityId") {
    if (spec.target === "httpAction") return "HTTP action";
    if (raw === "runScene") return "Scene";
    if (raw === "runScript") return "Script";
    return "Entity";
  }
  if (spec.key === "pageId") return spec.target === "statusPage" ? "Status page" : "Page";
  return PAYLOAD_LABELS[spec.key] ?? spec.key;
}

function actionSelect(host: MenusViewHost, ref: MenuListRef, slot: JsonObject): TemplateResult {
  const id = watchMenuSlotId(slot);
  const current = slotActionType(slot);
  const groups = watchMenuOfferedActions(ref);
  const offered = new Set(groups.flatMap((g) => g.actions));
  const option = (raw: string) => {
    const spec = watchMenuAction(raw);
    const why = raw === current ? undefined : watchMenuActionUnavailable(raw, host.targets);
    const label = `${spec?.label ?? watchMenuActionLabel(raw)}${spec?.requiresPremium ? " (Pro)" : ""}${why === undefined ? "" : ` (${why})`}`;
    return html`<option value=${raw} ?selected=${raw === current} ?disabled=${why !== undefined}>${label}</option>`;
  };
  const set = (raw: string) => host.edit((d) => setWatchMenuSlotAction(d, ref, id, raw, host.targets));
  // `.value` is the document's on every draw, so a refused pick goes back.
  return html`<label class="field"><span>Action</span>
    <select .value=${live(current)} @change=${(e: Event) => set((e.target as HTMLSelectElement).value)}>
      ${offered.has(current) ? nothing : html`<optgroup label="Now"><option value=${current} selected>${watchMenuActionLabel(current)}</option></optgroup>`}
      ${groups.map((g) => html`<optgroup label=${watchMenuCategoryLabel(g.category)}>${g.actions.map(option)}</optgroup>`)}
    </select></label>`;
}

/** An HTTP action as the picker names it: its name, then "needs setup"
 * (with "on the iPhone" for the phone's own) or "on the iPhone" for an
 * iPhone action in a list that leads with the home's. */
function httpTargetLabel(t: MenuHTTPTarget): string {
  if (t.needsSetup === true) return `${t.name} (${t.source === "home" ? "needs setup" : "needs setup on the iPhone"})`;
  return t.source === "iphone" ? `${t.name} (on the iPhone)` : t.name;
}

/** The way from an HTTP action slot to the HTTP actions screen. */
function httpActionsLink(): TemplateResult {
  return html`<button type="button" class="link" @click=${goToWatchHttpActions}>Open HTTP actions</button>`;
}

/** The lines under an HTTP action target: a home action that needs setup,
 * an empty list the HTTP actions screen can add to, or, with no list from
 * either side, where the iPhone's comes from. */
function httpTargetHints(host: MenusViewHost, list: readonly MenuHTTPTarget[], stored: string): TemplateResult | typeof nothing {
  const current = list.find((t) => sameId(t.id, stored));
  if (current?.source === "home" && current.needsSetup === true) {
    return html`<div class="hint warn ts-under">Needs setup. ${httpActionsLink()}</div>`;
  }
  if (host.httpLibrary !== undefined && list.length === 0) {
    return html`<div class="hint ts-under">${WATCH_NO_HTTP_ACTIONS_TEXT} ${httpActionsLink()}</div>`;
  }
  if (!host.catalogKnown && host.httpLibrary !== "held") {
    return html`<div class="hint ts-under">Open the iPhone app to list its HTTP actions here.</div>`;
  }
  return nothing;
}

function targetSelect(host: MenusViewHost, ref: MenuListRef, slot: JsonObject, raw: string, spec: MenuPayloadSpec): TemplateResult {
  const id = watchMenuSlotId(slot);
  const value = slotAction(slot)[spec.key];
  const stored = typeof value === "string" ? value : "";
  const list = spec.target === "page" ? host.targets.pages : spec.target === "statusPage" ? host.targets.statusPages
    : spec.target === "ttsPhrase" ? (host.targets.phrases ?? []) : host.targets.httpActions;
  const known = stored === "" || list.some((t) => sameId(t.id, stored));
  const set = (v: string) => host.edit((d) => setWatchMenuActionKey(d, ref, id, spec.key, v === "" ? undefined : v));
  const fromWatch = spec.target === "statusPage" && host.statusPagesKnown === true;
  // An HTTP action the home's library, the only list there is, does not hold
  // is "Not in the list".
  const httpOnlyHome = spec.target === "httpAction" && host.httpLibrary === "held" && !host.catalogKnown;
  const missing = spec.target === "page" ? "A page that is gone"
    : spec.target === "ttsPhrase" ? (host.targets.phrases === undefined ? "A phrase not listed here" : "A phrase that is gone")
    : fromWatch ? `Not in this ${deviceNoun(host.device ?? "watch")}'s status pages` : httpOnlyHome ? WATCH_NOT_IN_LIST_TEXT : WATCH_NOT_ON_IPHONE_TEXT;
  const label = (t: MenuHTTPTarget) => (spec.target === "httpAction" ? httpTargetLabel(t) : t.name);
  return html`<label class="field"><span>${payloadLabel(raw, spec)}</span>
    <select .value=${live(list.find((t) => sameId(t.id, stored))?.id ?? stored)} @change=${(e: Event) => set((e.target as HTMLSelectElement).value)}>
      ${spec.required === true ? nothing : html`<option value="" ?selected=${stored === ""}>None</option>`}
      ${known ? nothing : html`<option value=${stored} selected>${missing}</option>`}
      ${list.map((t) => html`<option value=${t.id} ?selected=${sameId(t.id, stored)}>${label(t)}</option>`)}
    </select></label>
    ${spec.target === "ttsPhrase"
      ? (host.device === "iphone" ? html`<div class="hint ts-under">${PHONE_NO_PHRASES_TEXT}</div>`
        : host.voice?.phrases === undefined ? html`<div class="hint ts-under">No voice settings from this watch yet. Add phrases in Voice.</div>` : nothing)
      : spec.target === "statusPage"
      ? (fromWatch || host.catalogKnown ? nothing : html`<div class="hint ts-under">${noRecordTitle("status pages", host.device ?? "watch")} Add them in Status pages.</div>`)
      : spec.target === "httpAction"
      ? httpTargetHints(host, host.targets.httpActions, stored)
      : nothing}`;
}

function payloadField(host: MenusViewHost, ref: MenuListRef, slot: JsonObject, raw: string, spec: MenuPayloadSpec): TemplateResult | typeof nothing {
  const id = watchMenuSlotId(slot);
  const action = slotAction(slot);
  const set = (value: unknown, coalesce?: string) => host.edit((d) => setWatchMenuActionKey(d, ref, id, spec.key, value), coalesce);
  const label = payloadLabel(raw, spec);
  const value = watchMenuActionValue(slot, spec);
  switch (spec.type) {
    case "entity": {
      const entityId = typeof action[spec.key] === "string" ? (action[spec.key] as string) : "";
      const domain = raw === "runScene" ? "scene" : raw === "runScript" ? "script" : watchTriggerTargetDomains();
      return html`<div class="ts-stack">${entityField({ hass: host.hass }, label, refOf(host.hass, entityId),
        (next) => set(next.entityId), `me:entity:${id}`, { domain, clearable: false, needed: entityId === "" })}</div>
        ${entityId === "" ? html`<div class="hint keep">Pick what it runs. A slot left without one is dropped when you save.</div>` : nothing}`;
    }
    case "uuid":
      return targetSelect(host, ref, slot, raw, spec);
    case "enum": {
      if (spec.key === "triggerMode") {
        const domain = entityDomain(typeof action.entityId === "string" ? action.entityId : "");
        const modes = watchTriggerModes(domain);
        const mode = typeof value === "string" ? value : modes[0] ?? "";
        const choices: [string, string][] = modes.map((m) => [m, watchTriggerModeLabel(m)]);
        if (!modes.includes(mode)) choices.unshift([mode, watchTriggerModeLabel(mode)]);
        return selectField(label, mode, choices, (v) => set(v), { snapBack: true });
      }
      const choices = watchMenuEnumChoices(spec.enum);
      const current = typeof value === "string" ? value : String(spec.default ?? "");
      return choices.length <= 4
        ? segField(label, current, choices, (v) => set(v))
        : selectField(label, current, choices, (v) => set(v), { snapBack: true });
    }
    case "bool":
      return checkField(label, value === true, (v) => set(v), spec.default as boolean | undefined);
    case "number": {
      // The banner's length matters only while the banner shows.
      if (spec.key === "bannerSeconds" && watchMenuActionValue(slot, { key: "showBanner", type: "bool", default: true }) === false) return nothing;
      const stored = typeof action[spec.key] === "number" ? (action[spec.key] as number) : undefined;
      return numberField(label, stored, (v) => set(v, `slot:${id}:${spec.key}`), {
        ...(spec.min === undefined ? {} : { min: spec.min }),
        ...(spec.max === undefined ? {} : { max: spec.max }),
        step: 1,
        optional: true,
        clampOnCommit: true,
        placeholder: typeof spec.absentMeans === "number" ? String(spec.absentMeans) : "",
        unit: "s",
        def: null,
      });
    }
  }
}

/** Skip Conditions on an automation trigger slot of the Entity quick menu:
 * Default removes the key, Skip and Don't skip write `true` and `false`. */
function renderSkipConditions(host: MenusViewHost, ref: MenuListRef, slot: JsonObject): TemplateResult | typeof nothing {
  if (!watchMenuSlotHasSkipConditions(ref, slot)) return nothing;
  const id = watchMenuSlotId(slot);
  return html`<div class="ts-stack">${segField<WatchSkipChoice>("Skip conditions", watchSkipChoice(watchMenuSlotSkipConditions(slot)),
      WATCH_SKIP_CHOICES as [WatchSkipChoice, string][], (v) => host.edit((d) => setWatchMenuSlotSkipConditions(d, ref, id, watchSkipValue(v))))}</div>
    <div class="hint ts-under">Whether running the automation from this menu skips its conditions. Default follows the tile, then "Skip conditions by default" in the watch's Settings.</div>`;
}

/**
 * The Anywhere slot's "show for" filter. Only the types the watch reports
 * under the finger are offered. A stored type it never reports is kept,
 * drawn as a chip with a note, and can be taken off. With every chip off the
 * list is empty, which the watch reads as "only where no entity is under the
 * finger".
 */
function renderShowFor(host: MenusViewHost, slot: JsonObject): TemplateResult {
  const id = watchMenuSlotId(slot);
  const types = watchMenuSlotEntityTypes(slot);
  const every = types === undefined;
  const set = (next: string[] | undefined) => host.edit((d) => setWatchMenuSlotEntityTypes(d, id, next));
  const offered = watchMenuShowForTypes();
  const unreported = (types ?? []).filter((t) => !watchMenuReportsType(t));
  const summary = every ? "Every screen" : types.length === 0 ? "No entity under the finger" : types.map(typeLabel).join(", ");
  return html`<details class="me-show-for">
    <summary><span>Show for</span><b>${summary}</b></summary>
    ${checkField("Every screen", every, (v) => set(v ? undefined : offered.slice(0, 1)), true)}
    ${every ? nothing : html`<div class="me-chips" role="group" aria-label="Entity types">
      ${[...offered, ...unreported].map((type) => {
        const on = types.includes(type);
        const odd = !watchMenuReportsType(type);
        return html`<button type="button" class="pe-chip ${on ? "on" : ""} ${odd ? "odd" : ""}" aria-pressed=${on ? "true" : "false"}
          title=${odd ? "Not reported by the watch" : nothing}
          @click=${() => set(on ? types.filter((t) => t !== type) : [...types, type])}>${typeLabel(type)}</button>`;
      })}
    </div>
    ${unreported.length === 0 ? nothing : html`<div class="hint warn">${unreported.map(typeLabel).join(", ")}: Not reported by the watch.</div>`}
    <div class="hint">The slot shows only while the finger is over an entity of these types. With none picked, it shows only where no entity is under the finger.</div>`}
  </details>`;
}

/** Whether the Slot card holds a value away from a new slot's: hidden,
 * shown only for some types, or its own Skip conditions. The place and the
 * action are always a choice. */
export function menuSlotChanged(slot: JsonObject, ref: MenuListRef): boolean {
  return slot.isVisible === false || (ref.list === "anywhere" && watchMenuSlotEntityTypes(slot) !== undefined)
    || (watchMenuSlotHasSkipConditions(ref, slot) && watchMenuSlotSkipConditions(slot) !== null);
}

/** Whether the Look card is away from the action's own icon and color. */
export function menuSlotLookChanged(slot: JsonObject): boolean {
  const def = menuSlotDefaultLook(slot);
  if (def === undefined) return false;
  const look = slotLook(slot);
  return look.icon !== def.icon || !sameColor(look.color, def.color);
}

/** The pinned Name card: a slot keeps no name of its own, so the name it is
 * listed by shows, read only, with Pro for an action that needs it. */
function renderNameCard(host: MenusViewHost, slot: JsonObject): TemplateResult {
  const mark = MENU_SECTION_BADGES.name;
  const spec = watchMenuAction(slotActionType(slot));
  return html`<section class="sec name-sec" data-open="true" style=${`--c:${mark.color}`}>
    <div class="sec-h pinned">
      <span class="swatch">${uiIcon(mark.icon)}</span>
      <h4>Name</h4>
      <span class="me-name" title="A slot is named by what it runs, else by its action">${menuSlotName(host, slot)}</span>
      ${spec?.requiresPremium ? html`<span class="pe-badge" title="Needs Wrist Assistant Pro on the watch">Pro</span>` : nothing}
    </div>
  </section>`;
}

function renderSlotInspector(host: MenusViewHost, ref: MenuListRef, slot: JsonObject): TemplateResult {
  const id = watchMenuSlotId(slot);
  const raw = slotActionType(slot);
  const spec = watchMenuAction(raw);
  const look = slotLook(slot);
  const def = menuSlotDefaultLook(slot);
  const position = typeof slot.position === "string" ? slot.position : "";
  // A place another slot of the list holds: picking it swaps the two. The
  // slot's own place says so when another slot shares it.
  const others = watchMenuSlots(host.document, ref).filter((s) => !sameId(watchMenuSlotId(s), id));
  const positions: [string, string][] = watchMenuPositions().map((p) => {
    const label = watchMenuPositionLabel(p);
    if (!others.some((s) => s.position === p)) return [p, label];
    return [p, p === position ? `${label} (shared)` : `${label} (swap)`];
  });
  const slotBody = html`<fieldset class="me-body" ?disabled=${host.busy} aria-label="Slot">
    ${spec === undefined ? html`<div class="hint warn">A newer app wrote this action. A watch with an older app shows Sync Needed for it until the app is updated. Pick another action to replace it.</div>` : nothing}
    ${selectField("Place", position, positions, (v) => host.edit((d) => moveWatchMenuSlot(d, ref, id, v)), { snapBack: true })}
    ${checkField("Shown", slot.isVisible !== false, (v) => host.edit((d) => setWatchMenuSlotVisible(d, ref, id, v)), true)}
    ${actionSelect(host, ref, slot)}
    ${spec?.description ? html`<div class="hint ts-under">${spec.description}</div>` : nothing}
    ${watchMenuActionNeedsInstances(raw) ? html`<div class="hint ts-under keep">Only for a watch with more than one Home Assistant.</div>` : nothing}
    ${(spec?.payload ?? []).map((p) => payloadField(host, ref, slot, raw, p))}
    ${renderSkipConditions(host, ref, slot)}
    ${ref.list === "anywhere" ? renderShowFor(host, slot) : nothing}
  </fieldset>`;
  const lookBody = html`<fieldset class="me-body" ?disabled=${host.busy} aria-label="Look">
    <div class="ts-stack">${symbolField({ icons: host.icons, symbols: host.symbols }, typeof slot.icon === "string" ? slot.icon : "",
      (v) => host.edit((d) => setWatchMenuSlotIcon(d, ref, id, v), `slot:${id}:icon`), `me:icon:${id}`, undefined, "Icon", false)}</div>
    <div class="ts-no-alpha">${colorField("Color", typeof slot.color === "string" ? slot.color : undefined,
      (v) => { if (v !== undefined) host.edit((d) => setWatchMenuSlotColor(d, ref, id, v), `slot:${id}:color`); }, false, def?.color)}</div>
  </fieldset>`;
  const voiceBody = renderSlotVoiceBody(host, ref, slot);
  return html`${renderNameCard(host, slot)}
    ${card(host, "slot", "slot", "Slot", slotBody, { summary: menuSlotDetail(slot), dot: menuSlotChanged(slot, ref) })}
    ${voiceBody === undefined ? nothing : card(host, "slot", "voice", "Voice",
      html`<fieldset class="me-body me-voice" ?disabled=${host.busy} aria-label="Voice">${voiceBody}</fieldset>`,
      { summary: menuSlotVoiceSummary(host, slot), dot: menuSlotVoiceChanged(slot) })}
    ${card(host, "look", "look", "Look", lookBody, { summary: look.icon, dot: menuSlotLookChanged(slot) })}
    <div class="me-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${host.busy} title="Remove this slot from the menu"
        @click=${() => host.edit((d) => removeWatchMenuSlot(d, ref, id))}>${uiIcon("delete")}<span>Remove</span></button>
    </div>`;
}

// ── a menu's own settings ────────────────────────────────────────────────

function renderStyleField(host: MenusViewHost, section: MenuStyleSection, field: MenuStyleField): TemplateResult | typeof nothing {
  if (!watchMenuStyleShown(host.document, section, field)) return nothing;
  const value = watchMenuStyleValue(host.document, section, field);
  const coalesce = `style:${section}:${field.key}`;
  const set = (v: unknown, typing = false) => host.edit((d) => setWatchMenuStyle(d, section, field.key, v), typing ? coalesce : undefined);
  switch (field.type) {
    case "bool":
      return checkField(field.label, value === true, (v) => set(v), field.default as boolean);
    case "enum": {
      const choices = watchMenuEnumChoices(field.enum);
      const current = String(value);
      return choices.length <= 4
        ? segField(field.label, current, choices, (v) => set(v), { def: String(field.default) })
        : selectField(field.label, current, choices, (v) => set(v), { def: String(field.default), snapBack: true });
    }
    case "number": {
      const n = typeof value === "number" ? value : Number(field.default);
      return html`${sliderField(field.label, n, (v) => set(v, true), {
        min: field.min ?? 0,
        max: field.max ?? 1,
        step: field.step ?? 0.01,
        def: Number(field.default),
      })}
      ${field.presets === undefined ? nothing : html`<div class="ts-after">${field.presets.map((p) => html`<button type="button"
        class="pe-chip ${p.value === n ? "on" : ""}" aria-pressed=${p.value === n ? "true" : "false"} @click=${() => set(p.value)}>${p.label}</button>`)}</div>`}`;
    }
    case "color": {
      const hex = typeof value === "string" ? value : String(field.default);
      return html`<div class="ts-no-alpha">${colorField(field.label, hex, (v) => { if (v !== undefined) set(v, true); }, false, String(field.default))}</div>
        ${field.swatches === undefined ? nothing : html`<div class="ts-swatch-row"><div class="ts-swatches" role="group" aria-label=${field.label}>
          ${field.swatches.map((s) => {
            const on = s.toUpperCase() === hex.toUpperCase();
            return html`<button type="button" class="ts-swatch ${on ? "on" : ""}" aria-pressed=${on ? "true" : "false"} title=${s} aria-label=${s}
              style=${`--sw:${s}`} @click=${() => set(s)}></button>`;
          })}</div></div>`}`;
    }
  }
}

function sameStyleValue(a: unknown, b: unknown): boolean {
  if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) < 1e-9;
  if (typeof a === "string" && typeof b === "string") return a.toUpperCase() === b.toUpperCase();
  return a === b;
}

/** Whether any style row shown reads other than its default: the Style
 * card's changed dot, the same rule as the rows' reset dots. */
export function menuStyleChanged(document: MenusDocument, section: MenuStyleSection): boolean {
  return watchMenuStyleFields(section).some((f) => watchMenuStyleShown(document, section, f)
    && !sameStyleValue(watchMenuStyleValue(document, section, f), f.default));
}

function renderStyleCard(host: MenusViewHost, section: MenuStyleSection, fold: string): TemplateResult {
  const changed = menuStyleChanged(host.document, section);
  return card(host, "style", fold, "Style", html`<fieldset class="me-body me-style" ?disabled=${host.busy} aria-label="Style">
    ${watchMenuStyleFields(section).map((f) => renderStyleField(host, section, f))}
  </fieldset>`, { summary: changed ? "Changed" : "Defaults", dot: changed });
}

/** The Entity quick menu's Menu card: by type or by entity; the type, and
 * whether its menu adds the All slots; or the entities with a menu of their
 * own, the one shown, and a way to add one. */
function renderEntityMenuCard(host: MenusViewHost): TemplateResult {
  const mode = entityMode(host);
  const setMode = (v: "domain" | "entity") => {
    host.uiState.set(ENTITY_MODE_KEY, v);
    host.requestUpdate();
  };
  const modeRow = segField("Edit", mode, [["domain", "By type"], ["entity", "By entity"]] as ["domain" | "entity", string][], (v) => setMode(v));
  let body: TemplateResult;
  let summary: string;
  let dot = false;
  if (mode === "domain") {
    const domain = shownDomain(host);
    const info = watchMenuDomain(domain);
    const sharing = watchMenuDomainsSharing(domain);
    const choices: [string, string][] = watchMenuDomains().map((d) => [d.domain, d.label]);
    const inherits = info?.inheritKey ? watchMenuInherits(host.document, domain) : false;
    dot = inherits;
    summary = `By type · ${info?.label ?? domain}`;
    body = html`${selectField("Type", domain, choices, (v) => {
        host.uiState.set(ENTITY_DOMAIN_KEY, v);
        host.requestUpdate();
      })}
      ${sharing.length > 0 ? html`<div class="hint ts-under keep">The same menu as ${sharing.map((d) => d.label).join(", ")}.</div>` : nothing}
      ${info?.inheritKey ? html`${checkField("Add the All slots", inherits, (v) => host.edit((d) => setWatchMenuInherits(d, domain, v)), false)}
        <div class="hint ts-under">The All menu's slots fill the places this menu leaves free.</div>` : nothing}`;
  } else {
    const ids = watchMenuOverrideIds(host.document);
    const shown = shownEntity(host);
    summary = `By entity · ${shown === undefined ? "none yet" : nameOf(host.hass, shown)}`;
    const add = (ref: EntityRef) => {
      const entityId = ref.entityId.trim();
      if (entityId === "") return;
      host.edit((d) => addWatchMenuOverride(d, entityId));
      host.uiState.set(ENTITY_ID_KEY, entityId);
      host.uiState.set(ENTITY_ADD_KEY, (Number(host.uiState.get(ENTITY_ADD_KEY) ?? 0) || 0) + 1);
      host.requestUpdate();
    };
    body = html`<div class="me-entities">
      ${ids.length === 0 ? html`<p class="hint keep">No entity has a menu of its own. Add one below: it starts as a copy of its type's menu.</p>` : nothing}
      ${ids.map((entityId) => {
        const on = entityId === shown;
        return html`<div class="me-entity ${on ? "on" : ""}">
          <button type="button" class="me-entity-pick" aria-pressed=${on ? "true" : "false"}
            @click=${() => { host.uiState.set(ENTITY_ID_KEY, entityId); host.requestUpdate(); }}>
            <b>${nameOf(host.hass, entityId)}</b><code>${entityId}</code></button>
          <button type="button" class="pe-btn pe-danger" title="Remove this entity's own menu. It follows its type's menu again."
            @click=${() => host.edit((d) => removeWatchMenuOverride(d, entityId))}>Remove</button>
        </div>`;
      })}
      <div class="ts-stack">
        ${entityField({ hass: host.hass }, "Add an entity", refOf(host.hass, ""), add, `me:er:add:${String(host.uiState.get(ENTITY_ADD_KEY) ?? 0)}`, { clearable: false })}
      </div>
    </div>`;
  }
  return card(host, "menu", "menu", "Menu", html`<fieldset class="me-body me-pick" ?disabled=${host.busy} aria-label="Menu">
    ${modeRow}${body}
  </fieldset>`, { summary, dot });
}

/** The shown menu's own settings, with no slot selected. */
function renderMenuSettings(host: MenusViewHost, menu: MenusSection): TemplateResult {
  const cards = menu === "anywhere" ? renderStyleCard(host, "quickAction", "style-anywhere")
    : menu === "switcher" ? renderStyleCard(host, "pageSwitcher", "style-switcher")
    : renderEntityMenuCard(host);
  return html`<p class="me-menu-note">${MENU_LINES[menu]}</p>${cards}
    <p class="me-menu-note me-pick-note">${menu === "switcher" ? SWITCHER_PICK_NOTE : "Select a slot to edit it, or add one."}</p>`;
}

/** The views' rules, after the shared chrome and the editor's own in the
 * editor's sheet. */
export const menuViewStyles = css`
  /* The Menus and Slots cards: the page editor's Pages and Tiles cards. */
  .me-menus-card > .layers, .me-slots-card > .layers { padding: 6px 8px 8px; overflow: visible; }
  .me-menus-card > .lc-note, .me-slots-card > .lc-note { margin: 8px 12px; color: var(--wa-muted); }
  .me-slots-card > .lc-filter { border-bottom: 0; }
  .layer .acts button.icon { display: inline-grid; place-items: center; padding: 0; }
  .layer .acts button.icon:disabled { opacity: .35; cursor: default; }
  /* A slot's or a page's icon in its color, on the black well. */
  .layer .thumb.me-thumb {
    display: grid; place-items: center;
    background: color-mix(in srgb, var(--c, #888) 22%, #000);
  }
  .layer .thumb .me-thumb-glyph { display: grid; place-items: center; width: 16px; height: 16px; }
  .layer .thumb .me-thumb-glyph svg { width: 14px; height: 14px; display: block; }
  .me-thumb-track { fill: none; stroke: rgba(255, 255, 255, .22); stroke-width: 1; stroke-dasharray: 2 2; }

  /* The watch screen on the stage. */
  .me-screen { position: relative; flex: none; background: #000; }
  .me-screen-bg { position: absolute; inset: 0; width: 100%; height: 100%; }
  .me-track { fill: none; stroke: rgba(255, 255, 255, .14); stroke-width: 1; stroke-dasharray: 3 3; }
  .me-center { fill: rgba(255, 255, 255, .35); }
  .me-screen-note {
    position: absolute; left: 14px; right: 14px; top: 62%; margin: 0;
    color: rgba(255, 255, 255, .6); font-size: 12px; line-height: 1.3; text-align: center;
  }
  /* Sizes on the screen are points times the stage's scale, --me-s. */
  .me-page {
    position: absolute; transform: translate(-50%, -50%); max-width: calc(68px * var(--me-s, 1));
    padding: calc(2px * var(--me-s, 1)) calc(6px * var(--me-s, 1));
    border: 1px solid var(--c, rgba(255, 255, 255, .3)); border-radius: 999px;
    background: color-mix(in srgb, var(--c, #888) 22%, #000); color: #fff;
    font-size: calc(9.5px * var(--me-s, 1)); font-weight: 600; line-height: 1.35;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .me-dot.me-page-dot { width: calc(28px * var(--me-s, 1)); height: calc(28px * var(--me-s, 1)); cursor: default; }
  .me-dot {
    position: absolute; width: calc(36px * var(--me-s, 1)); height: calc(36px * var(--me-s, 1));
    margin: 0; padding: 0; transform: translate(-50%, -50%);
    display: grid; place-items: center; border-radius: 50%; border: 1.5px solid var(--c, rgba(255, 255, 255, .3));
    background: color-mix(in srgb, var(--c, #888) 22%, #000); color: #fff; cursor: pointer;
  }
  .me-dot svg { display: block; }
  /* The marks on the black screen are a light form of the accent, as the
     page editor's are: the light skin's own accent is too dark there. */
  .me-screen { --me-mark: color-mix(in srgb, var(--wa-accent) 55%, #fff); }
  .me-dot.on, .me-page.on { box-shadow: 0 0 0 2px #000, 0 0 0 4px var(--me-mark); }
  .me-dot:focus-visible { outline: none; box-shadow: 0 0 0 2px #000, 0 0 0 4px var(--me-mark), var(--wa-ring); }
  .me-dot.off { opacity: .4; }
  .me-dot.two { width: calc(23px * var(--me-s, 1)); height: calc(23px * var(--me-s, 1)); border-width: 1px; z-index: 1; }
  .me-count {
    position: absolute; top: -5px; right: -5px; min-width: 16px; height: 16px; padding: 0 4px; border-radius: 999px;
    background: var(--wa-accent); color: #000; font-size: 10px; font-weight: 700; line-height: 16px; text-align: center;
  }
  .me-dot.inh { opacity: .45; border-style: dashed; cursor: default; width: calc(28px * var(--me-s, 1)); height: calc(28px * var(--me-s, 1)); }
  .me-dot.free {
    border: 1.5px dashed rgba(255, 255, 255, .28); background: transparent; color: rgba(255, 255, 255, .55);
    width: calc(28px * var(--me-s, 1)); height: calc(28px * var(--me-s, 1));
  }
  .me-dot.free:hover:not(:disabled) { color: #fff; border-color: rgba(255, 255, 255, .6); }
  .me-dot.free svg.ui-icon { width: calc(13px * var(--me-s, 1)); height: calc(13px * var(--me-s, 1)); }
  .me-glyph-dot { width: 10px; height: 10px; border-radius: 50%; }

  /* The inspector's cards. A fieldset only to switch every control off at
     once while a save is out; it draws nothing of its own. */
  fieldset.me-body { margin: 0; padding: 2px 0 0; border: 0; min-width: 0; display: flex; flex-direction: column; gap: 2px; --wa-lab: 96px; }
  .me-body .hint { margin: 0 0 4px; }
  .me-menu-note { margin: 6px 2px 2px; font-size: 12px; line-height: 1.4; color: var(--wa-muted); }
  .me-menu-note.me-pick-note { margin-top: 10px; }
  .name-sec .sec-h > .me-name {
    flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    font-size: 12.5px; font-weight: 600; color: var(--wa-ink);
  }
  .me-acts { display: flex; flex-wrap: wrap; gap: 6px; padding: 12px 0 0; }
  .me-readonly { font-size: 12px; color: var(--wa-muted); }
  .me-sub-h { margin: 8px 0 2px; font-size: 12px; font-weight: 600; color: var(--wa-muted); }
  .me-voice-list { display: flex; flex-direction: column; margin-bottom: 2px; }
  .me-body .hint.warn { color: var(--wa-amber); }
  .me-show-for { margin-top: 6px; border-top: 1px solid var(--wa-line); padding-top: 6px; }
  .me-show-for > summary { display: flex; gap: 8px; align-items: baseline; cursor: pointer; font-size: 12px; color: var(--wa-muted); padding: 4px 0; }
  .me-show-for > summary b { color: var(--wa-ink); font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .me-chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 4px 0; }
  .me-entities { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
  .me-entity { display: flex; align-items: center; gap: 8px; padding: 4px 6px; border: 1px solid transparent; border-radius: var(--wa-r-sm, 8px); }
  .me-entity.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); }
  .me-entity-pick { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; flex: 1; min-width: 0; border: 0; background: none; color: var(--wa-ink); font: inherit; text-align: left; cursor: pointer; padding: 2px; }
  .me-entity-pick:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
  .me-entity-pick code { color: var(--wa-muted); }
  .pe-chip {
    padding: 3px 10px; border: 1px solid var(--wa-line); border-radius: 999px; background: var(--wa-card); color: var(--wa-ink);
    font: inherit; font-size: 12px; cursor: pointer;
  }
  .pe-chip.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); font-weight: 600; }
  .pe-chip.odd { border-style: dashed; color: var(--wa-amber); }
  .pe-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .hint.ts-under { padding-left: calc(var(--wa-lab) + 8px); margin-top: -2px; }
  .ts-after { display: flex; flex-wrap: wrap; gap: 6px; padding: 2px 0 6px calc(var(--wa-lab) + 8px); }
  /* A picked page's Automatic icon chip, as the page editor drew it. */
  .ts-chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 2px 0 6px; }
  .ts-swatch-row { padding: 2px 0 4px calc(var(--wa-lab) + 8px); }
  .ts-swatches { display: flex; flex-wrap: wrap; gap: 6px; }
  .ts-swatch {
    width: 20px; height: 20px; padding: 0; border: 0; border-radius: 50%; cursor: pointer;
    background: var(--sw); box-shadow: inset 0 0 0 1px rgba(128, 128, 128, .45);
  }
  .ts-swatch.on { box-shadow: 0 0 0 2px var(--wa-card), 0 0 0 4px var(--wa-accent); }
  .ts-swatch:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--wa-card), 0 0 0 4px var(--wa-accent), var(--wa-ring); }
  .ts-no-alpha .color-box .alpha { display: none; }
  .ts-no-alpha .color-box { padding-right: 6px; }
  .ts-stack .field { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 2px 0; }
  .ts-stack .field.entity-field > :not(:first-child) { grid-column: 1; }
`;
