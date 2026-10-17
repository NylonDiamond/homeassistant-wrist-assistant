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
import { checkField, colorField, entityField, numberField, segField, selectField, symbolField } from "../editors.js";
import type { HassLike } from "../ha-api.js";
import { SECTION_COLOR } from "../kinds.js";
import type { EntityRef } from "../model.js";
import type { IconProvider } from "../renderer.js";
import type { SymbolBrowser } from "../symbols.js";
import { type UiIconName, uiIcon } from "../ui-icons.js";
import type { PhonePagesLayout } from "../phone-frame.js";
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
  type MenuStyleSection,
  type MenuTargets,
  type MenusDocument,
  addWatchMenuOverride,
  addWatchMenuSlot,
  entityDomain,
  menuListDomain,
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
  watchTriggerLook,
  watchTriggerModeLabel,
  watchTriggerModes,
  watchTriggerTargetDomains,
} from "./model.js";
import { type MenuVoiceContext, menuSlotHasVoice, menuSlotVoiceChanged, menuSlotVoiceSummary, renderSlotVoiceBody } from "./slot-voice.js";
import {
  ANYWHERE_LOOK_KEYS,
  ANYWHERE_MOTION_KEYS,
  MENU_TYPE_TILES,
  type MenuActionTile,
  type MenuActionTileGroup,
  type MenuTypeChoice,
  type MenuWhereCell,
  SWITCHER_LOOK_KEYS,
  actionTiles,
  anywhereLookSummary,
  anywhereMotionSummary,
  menuStyleKeysChanged,
  renderAnywhereLookBody,
  renderAnywhereMotionBody,
  renderSwitcherLookBody,
  switchRow,
  switcherLookSummary,
  typeTiles,
  whereGrid,
} from "./menu-inspector-look.js";

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
  /** The foot of a menu's row in the Menus card: which library menu this
   * device uses for it, its name, Used by with a tick per device, and Make
   * a copy for this watch (the editor's `libraryHead`). Absent, or nothing,
   * before the library is read, and for the page switcher. */
  menuFoot?(menu: MenusSection): TemplateResult | typeof nothing;
  /** The badge on a menu's row, after its count: the library menu's own
   * name, "Home menu". */
  menuBadge?(menu: MenusSection): string | undefined;
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

/** When each menu opens, in one plain line: what its Menus row says under
 * its name. */
export const MENU_ROW_LINES: Readonly<Record<MenusSection, string>> = {
  anywhere: "Opens on any screen. Your shortcuts for the whole watch.",
  entity: "Opens over a tile. Controls for that kind of thing.",
  switcher: "Jumps to another page. Set how each page shows.",
};

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
export const MENU_STAGE_HINT = "Click a slot or its label to edit it. Click anywhere else for the menu's look.";

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
export type MenuInspectorSection = "name" | "slot" | "where" | "look" | "shows" | "menu" | "style" | "motion" | "switcherPage";

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
 * Content blue, how a slot or a menu looks and moves is Look, where a slot
 * sits is Position, and the tiles an Anywhere slot shows over are States,
 * as a layer's rules are. A page's place in the switcher is Content, with
 * the watch glyph, as its chip was in the page editor's strip.
 */
export const MENU_SECTION_BADGES: Readonly<Record<MenuInspectorSection, MenuSectionBadge>> = {
  name: { color: SECTION_COLOR.place, icon: "text" },
  slot: { color: SECTION_COLOR.content, icon: "content" },
  where: { color: SECTION_COLOR.position, icon: "place" },
  look: { color: SECTION_COLOR.look, icon: "look" },
  shows: { color: SECTION_COLOR.states, icon: "states" },
  menu: { color: SECTION_COLOR.content, icon: "content" },
  style: { color: SECTION_COLOR.look, icon: "look" },
  motion: { color: SECTION_COLOR.look, icon: "radial" },
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

/** Show `menu` on its own settings, where its Devices line is: no slot of
 * any list picked, and no switcher page. A card on the Menus tab opens the
 * editor this way. */
export function showMenuSettings(host: Pick<MenusViewHost, "uiState" | "requestUpdate">, menu: MenusSection): void {
  for (const key of [...host.uiState.keys()]) if (key.startsWith(SELECTION_PREFIX)) host.uiState.delete(key);
  host.uiState.delete(SWITCHER_PAGE_KEY);
  selectMenu(host, menu);
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

const SELECTION_PREFIX = "me:sel:";

function selectionKey(ref: MenuListRef): string {
  return `${SELECTION_PREFIX}${menuListKey(ref)}`;
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

/** What the stage (`menu-stage.ts`) draws with: the watch, its dots and the
 * labels around it pick, add and look up slots the way the cards do. */
export {
  RING_RADIUS as MENU_RING_RADIUS,
  addAt as addMenuSlotAt,
  glyph as menuGlyph,
  listLabel as menuListLabel,
  plural as menuPlural,
  sameId as sameMenuId,
  select as selectMenuSlotOf,
  slotLook as menuSlotLook,
};

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

/** What a Menus row counts beside its name: the Anywhere menu's slots, the
 * Entity quick menu's shown list's slots, the switcher's pages. */
export function menuRowCount(host: Pick<MenusViewHost, "uiState" | "document" | "switcherPages">, menu: MenusSection): string {
  if (menu === "switcher") return plural(host.switcherPages.length, "page", "pages");
  const ref = menu === "anywhere" ? ANYWHERE : entityList(host);
  return ref === undefined ? "none yet" : plural(watchMenuSlots(host.document, ref).length, "slot", "slots");
}

function menuThumb(host: MenusViewHost, menu: MenusSection): TemplateResult {
  if (menu === "switcher") {
    const pages = host.switcherPages;
    return ringThumb(pages.map((p, i) => ({ ...switcherRingPoint(i, pages.length), color: p.color })));
  }
  return ringThumb(listDots(host, menu === "anywhere" ? ANYWHERE : entityList(host)));
}

/** What the Menus page is for, at the top of its Menus card, for someone
 * who has never opened one of these menus. */
export const MENUS_INTRO = "Round shortcut menus on your watch. Each opens with its own gesture. Pick one to see how it opens, then click its slots to choose what they do.";

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
    <p class="me-intro">${MENUS_INTRO}</p>
    <div class="layers me-menu-list" role="list">
      ${MENUS_SECTIONS.map(([id, label]) => {
        const on = id === shown;
        const pick = () => { if (!on) selectMenu(host, id); };
        const named = host.menuBadge?.(id);
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
          <span class="name"><b><span class="nm-t">${label}</span><span class="me-menu-count">${menuRowCount(host, id)}</span>${named === undefined
            ? nothing : html`<span class="badge me-named" title=${`This device uses "${named}"`}>${named}</span>`}</b><small>${MENU_ROW_LINES[id]}</small>
            ${host.menuFoot?.(id) ?? nothing}</span>
        </div>`;
      })}
    </div>
  </section>`;
}

// ── the Slots card ───────────────────────────────────────────────────────

function slotThumb(host: Pick<MenusViewHost, "icons">, icon: string, color: string): TemplateResult {
  return html`<span class="thumb me-thumb" style=${`--c:${color}`} aria-hidden="true"><span class="me-thumb-glyph">${glyph(host, icon, 14, color)}</span></span>`;
}

/** Which list the Entity quick menu shows, in words: the canvas head's fact
 * where the Slots card's filter line used to say it. */
export function entityMenuWords(host: Pick<MenusViewHost, "hass">, ref: MenuListRef | undefined): string {
  return ref === undefined || ref.list === "anywhere" ? "By entity: none has a menu of its own yet"
    : ref.list === "domain" ? `${typeLabel(ref.domain)} menu, by type`
    : `${nameOf(host.hass, ref.entityId)}'s own menu`;
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

/** The left column's second card: the page switcher's Pages card. The
 * Anywhere menu and the Entity quick menu have none: their slots are the
 * labels around the watch on the stage (`menu-stage.ts`). */
export function renderSlotsCard(host: MenusViewHost): TemplateResult | typeof nothing {
  return shownMenu(host) === "switcher" ? renderSwitcherPagesCard(host) : nothing;
}

/** What the canvas head says about the shown menu, before the watch's size:
 * "8 slots", "Light menu, by type · 5 slots", "4 pages". */
export function menuStageFacts(host: Pick<MenusViewHost, "uiState" | "document" | "hass" | "switcherPages">): string[] {
  if (shownMenu(host) === "switcher") return [plural(host.switcherPages.length, "page", "pages")];
  const ref = shownMenuList(host);
  if (ref === undefined) return [entityMenuWords(host, ref)];
  const count = plural(watchMenuSlots(host.document, ref).length, "slot", "slots");
  if (ref.list === "anywhere") return [count];
  return [entityMenuWords(host, ref), count];
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
      { module: FOLD_MODULE, section: "where" },
      ...(menuSlotHasVoice(picked) ? [{ module: FOLD_MODULE, section: "voice" }] : []),
      { module: FOLD_MODULE, section: "look" },
      ...(ref?.list === "anywhere" ? [{ module: FOLD_MODULE, section: "shows" }] : []),
    ];
  }
  const menu = shownMenu(host);
  if (menu === "anywhere") return [{ module: FOLD_MODULE, section: "style-anywhere" }, { module: FOLD_MODULE, section: "motion-anywhere" }];
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

/** The action categories in plain words. The entity's own actions are
 * headed by its type. */
const CATEGORY_HEADINGS: Readonly<Record<string, string>> = {
  navigation: "Go around",
  quickAction: "Do something",
  information: "Show something",
  remote: "Remote control",
};

/** An action's name as the inspector prints it: the table's "Speak Message
 * - TTS" reads "Speak Message (TTS)", with no dash breaking it. */
export function menuActionWords(raw: string): string {
  return watchMenuActionLabel(raw).replace(/ - (.+)$/, " ($1)");
}

function categoryHeading(ref: MenuListRef, category: string): string {
  if (category === "entityControl") {
    const domain = menuListDomain(ref) ?? "all";
    return domain === "all" ? "Any entity" : typeLabel(domain);
  }
  return CATEGORY_HEADINGS[category] ?? watchMenuCategoryLabel(category);
}

/** The actions the slot can take, as tiles under their headings: those its
 * list offers, after the action it holds when the list does not offer it.
 * One that needs a target the panel has none of says so and cannot be
 * picked. */
export function menuActionTileGroups(host: Pick<MenusViewHost, "targets">, ref: MenuListRef, slot: JsonObject): MenuActionTileGroup[] {
  const current = slotActionType(slot);
  const groups = watchMenuOfferedActions(ref);
  const tile = (raw: string): MenuActionTile => {
    const spec = watchMenuAction(raw);
    const look = spec === undefined ? { icon: MENU_ACTIONS.unknownActionIcon, color: MENU_ACTIONS.unknownActionColor } : spec;
    const why = raw === current ? undefined : watchMenuActionUnavailable(raw, host.targets);
    return { raw, label: menuActionWords(raw), icon: look.icon, color: look.color, ...(why === undefined ? {} : { why }) };
  };
  const offered = groups.some((g) => g.actions.includes(current));
  return [
    ...(offered ? [] : [{ heading: "Now", tiles: [tile(current)] }]),
    ...groups.map((g) => ({ heading: categoryHeading(ref, g.category), tiles: g.actions.map(tile) })),
  ];
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

/** The Shows on card's summary: every screen, or the types it shows over. */
function showsOnSummary(slot: JsonObject): string {
  const types = watchMenuSlotEntityTypes(slot);
  return types === undefined ? "Every screen" : types.length === 0 ? "No entity under the finger" : types.map(typeLabel).join(", ");
}

/**
 * The Anywhere slot's Shows on: every screen, or only over some tiles. Only
 * the types the watch reports under the finger are offered. A stored type it
 * never reports is kept, drawn as a chip with a note, and can be taken off.
 * With every chip off the list is empty, which the watch reads as "only
 * where no entity is under the finger".
 */
function renderShowsOnBody(host: MenusViewHost, slot: JsonObject): TemplateResult {
  const id = watchMenuSlotId(slot);
  const types = watchMenuSlotEntityTypes(slot);
  const every = types === undefined;
  const set = (next: string[] | undefined) => host.edit((d) => setWatchMenuSlotEntityTypes(d, id, next));
  const offered = watchMenuShowForTypes();
  const unreported = (types ?? []).filter((t) => !watchMenuReportsType(t));
  return html`<div class="mi-wrap">${segField("Show on", every ? "every" : "some", [["every", "Every screen"], ["some", "Only over some tiles"]] as ["every" | "some", string][],
      (v) => set(v === "every" ? undefined : offered.slice(0, 1)), { def: "every" })}</div>
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
    <div class="hint">The slot shows only while the finger is over an entity of these types. With none picked, it shows only where no entity is under the finger.</div>`}`;
}

/** Whether the slot holds a value away from a new slot's: hidden, shown
 * only for some types, or its own Skip conditions. The place and the action
 * are always a choice. */
export function menuSlotChanged(slot: JsonObject, ref: MenuListRef): boolean {
  return menuSlotWhereChanged(slot) || (ref.list === "anywhere" && menuSlotShowsOnChanged(slot)) || menuSlotActionChanged(slot, ref);
}

/** What it does: away from the slot's default only by its Skip conditions. */
export function menuSlotActionChanged(slot: JsonObject, ref: MenuListRef): boolean {
  return watchMenuSlotHasSkipConditions(ref, slot) && watchMenuSlotSkipConditions(slot) !== null;
}

/** Where: hidden on the watch. */
export function menuSlotWhereChanged(slot: JsonObject): boolean {
  return slot.isVisible === false;
}

/** Shows on: only over some tiles. */
export function menuSlotShowsOnChanged(slot: JsonObject): boolean {
  return watchMenuSlotEntityTypes(slot) !== undefined;
}

/** Whether the Look card is away from the action's own icon and color. */
export function menuSlotLookChanged(slot: JsonObject): boolean {
  const def = menuSlotDefaultLook(slot);
  if (def === undefined) return false;
  const look = slotLook(slot);
  return look.icon !== def.icon || !sameColor(look.color, def.color);
}

/** The pinned Name card: a slot keeps no name of its own, so the name it is
 * listed by shows, read only. */
function renderNameCard(host: MenusViewHost, slot: JsonObject): TemplateResult {
  const mark = MENU_SECTION_BADGES.name;
  return html`<section class="sec name-sec" data-open="true" style=${`--c:${mark.color}`}>
    <div class="sec-h pinned">
      <span class="swatch">${uiIcon(mark.icon)}</span>
      <h4>Name</h4>
      <span class="me-name" title="A slot is named by what it runs, else by its action">${menuSlotName(host, slot)}</span>
    </div>
  </section>`;
}

/** A place's name in sentence case, "Top right", for the Where grid's
 * words. */
function placeWords(position: string): string {
  const label = watchMenuPositionLabel(position);
  return label.charAt(0) + label.slice(1).toLowerCase();
}

/** The eight places as the Where grid draws them: the slot's own, and for
 * each other the slot of the list that holds it (a click there swaps the
 * two, as the old Place list did), or none. */
export function menuWhereCells(host: Pick<MenusViewHost, "document" | "hass" | "targets">, ref: MenuListRef, slot: JsonObject): MenuWhereCell[] {
  const id = watchMenuSlotId(slot);
  const others = watchMenuSlots(host.document, ref).filter((s) => !sameId(watchMenuSlotId(s), id));
  return watchMenuPositions().map((p) => {
    const holder = others.find((s) => s.position === p);
    const cell: MenuWhereCell = { position: p, label: placeWords(p), here: slot.position === p };
    if (holder !== undefined) cell.holder = { name: menuSlotName(host, holder), ...slotLook(holder) };
    return cell;
  });
}

function renderSlotInspector(host: MenusViewHost, ref: MenuListRef, slot: JsonObject): TemplateResult {
  const id = watchMenuSlotId(slot);
  const raw = slotActionType(slot);
  const spec = watchMenuAction(raw);
  const look = slotLook(slot);
  const def = menuSlotDefaultLook(slot);
  const position = typeof slot.position === "string" ? slot.position : "";
  const whatBody = html`<fieldset class="me-body" ?disabled=${host.busy} aria-label="What it does">
    ${spec === undefined ? html`<div class="hint warn">A newer app wrote this action. A watch with an older app shows Sync Needed for it until the app is updated. Pick another action to replace it.</div>` : nothing}
    ${actionTiles(host.icons, raw, menuActionTileGroups(host, ref, slot), (next) => host.edit((d) => setWatchMenuSlotAction(d, ref, id, next, host.targets)))}
    ${spec?.description ? html`<div class="mi-desc">${spec.description}</div>` : nothing}
    ${watchMenuActionNeedsInstances(raw) ? html`<div class="hint keep">Only for a watch with more than one Home Assistant.</div>` : nothing}
    ${(spec?.payload ?? []).map((p) => payloadField(host, ref, slot, raw, p))}
    ${renderSkipConditions(host, ref, slot)}
  </fieldset>`;
  const whereBody = html`<fieldset class="me-body" ?disabled=${host.busy} aria-label="Where">
    ${whereGrid(host.icons, look, menuWhereCells(host, ref, slot), (p) => host.edit((d) => moveWatchMenuSlot(d, ref, id, p)))}
    ${checkField("Shown on the watch", slot.isVisible !== false, (v) => host.edit((d) => setWatchMenuSlotVisible(d, ref, id, v)), true)}
  </fieldset>`;
  const lookBody = html`<fieldset class="me-body" ?disabled=${host.busy} aria-label="Icon and color">
    <div class="ts-stack">${symbolField({ icons: host.icons, symbols: host.symbols }, typeof slot.icon === "string" ? slot.icon : "",
      (v) => host.edit((d) => setWatchMenuSlotIcon(d, ref, id, v), `slot:${id}:icon`), `me:icon:${id}`,
      { tint: typeof slot.color === "string" ? slot.color : def?.color })}</div>
    <div class="ts-no-alpha">${colorField("Color", typeof slot.color === "string" ? slot.color : undefined,
      (v) => { if (v !== undefined) host.edit((d) => setWatchMenuSlotColor(d, ref, id, v), `slot:${id}:color`); }, false, def?.color)}</div>
  </fieldset>`;
  const voiceBody = renderSlotVoiceBody(host, ref, slot);
  return html`${renderNameCard(host, slot)}
    ${card(host, "slot", "slot", "What it does", whatBody, { summary: menuActionWords(raw), dot: menuSlotActionChanged(slot, ref) })}
    ${card(host, "where", "where", "Where", whereBody, {
      summary: `${watchMenuPositionLabel(position)}${slot.isVisible === false ? ", hidden" : ""}`, dot: menuSlotWhereChanged(slot) })}
    ${voiceBody === undefined ? nothing : card(host, "slot", "voice", "Voice",
      html`<fieldset class="me-body me-voice" ?disabled=${host.busy} aria-label="Voice">${voiceBody}</fieldset>`,
      { summary: menuSlotVoiceSummary(host, slot), dot: menuSlotVoiceChanged(slot) })}
    ${card(host, "look", "look", "Icon and color", lookBody, { summary: look.icon, dot: menuSlotLookChanged(slot) })}
    ${ref.list === "anywhere" ? card(host, "shows", "shows", "Shows on",
      html`<fieldset class="me-body" ?disabled=${host.busy} aria-label="Shows on">${renderShowsOnBody(host, slot)}</fieldset>`,
      { summary: showsOnSummary(slot), dot: menuSlotShowsOnChanged(slot) }) : nothing}
    <div class="me-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${host.busy} title="Remove this slot from the menu"
        @click=${() => host.edit((d) => removeWatchMenuSlot(d, ref, id))}>${uiIcon("delete")}<span>Remove</span></button>
    </div>`;
}

// ── a menu's own settings ────────────────────────────────────────────────

/** Whether any style row shown reads other than its default, across the
 * section's cards. */
export function menuStyleChanged(document: MenusDocument, section: MenuStyleSection): boolean {
  return menuStyleKeysChanged(document, section, watchMenuStyleFields(section).map((f) => f.key));
}

/** The Anywhere menu's two cards: Look (what is behind the ring, how dark,
 * the buttons, the glow) and Motion (how it opens, the beam, the finger's
 * shadow). */
function renderAnywhereStyleCards(host: MenusViewHost): TemplateResult {
  const lookChanged = menuStyleKeysChanged(host.document, "quickAction", ANYWHERE_LOOK_KEYS);
  const motionChanged = menuStyleKeysChanged(host.document, "quickAction", ANYWHERE_MOTION_KEYS);
  return html`${card(host, "style", "style-anywhere", "Look", html`<fieldset class="me-body me-style" ?disabled=${host.busy} aria-label="Look">
      ${renderAnywhereLookBody(host)}
    </fieldset>`, { summary: anywhereLookSummary(host.document), dot: lookChanged })}
    ${card(host, "motion", "motion-anywhere", "Motion", html`<fieldset class="me-body me-style" ?disabled=${host.busy} aria-label="Motion">
      ${renderAnywhereMotionBody(host)}
    </fieldset>`, { summary: anywhereMotionSummary(host.document), dot: motionChanged })}`;
}

/** The page switcher's Look: its glow and how big the picked page grows. */
function renderSwitcherStyleCard(host: MenusViewHost): TemplateResult {
  const changed = menuStyleKeysChanged(host.document, "pageSwitcher", SWITCHER_LOOK_KEYS);
  return card(host, "style", "style-switcher", "Look", html`<fieldset class="me-body me-style" ?disabled=${host.busy} aria-label="Look">
    ${renderSwitcherLookBody(host)}
  </fieldset>`, { summary: switcherLookSummary(host.document), dot: changed });
}

/** The Entity quick menu's Which menu card: by type or by entity; the type,
 * as tiles and a list, and whether its menu fills its gaps with the All
 * menu's slots; or the entities with a menu of their own, the one shown,
 * and a way to add one. */
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
    const tiles: MenuTypeChoice[] = MENU_TYPE_TILES.flatMap((t) => {
      const d = watchMenuDomain(t);
      return d === undefined ? [] : [{ domain: d.domain, label: d.label, icon: d.icon, color: watchTriggerLook(d.domain).color }];
    });
    const inherits = info?.inheritKey ? watchMenuInherits(host.document, domain) : false;
    dot = inherits;
    summary = `By type · ${info?.label ?? domain}`;
    body = html`<p class="hint keep">Each kind of thing gets its own menu. Pick one to edit it.</p>
      ${typeTiles(host.icons, domain, tiles, choices, (v) => {
        host.uiState.set(ENTITY_DOMAIN_KEY, v);
        host.requestUpdate();
      })}
      ${sharing.length > 0 ? html`<div class="hint ts-under keep">The same menu as ${sharing.map((d) => d.label).join(", ")}.</div>` : nothing}
      ${info?.inheritKey ? switchRow("Fill gaps with the All menu", inherits, (v) => host.edit((d) => setWatchMenuInherits(d, domain, v)), false,
        "Its slots show in places this menu leaves free. They are dashed on the watch.") : nothing}`;
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
  return card(host, "menu", "menu", "Which menu", html`<fieldset class="me-body me-pick" ?disabled=${host.busy} aria-label="Which menu">
    ${modeRow}${body}
  </fieldset>`, { summary, dot });
}

/** The line under a menu's own cards that has slots. */
export const MENU_PICK_NOTE = "Click a slot on the watch to change what it does.";

/** The shown menu's own settings, with no slot selected: what it is and its
 * cards. Which library menu it is (its name, Used by and the copy) is the
 * editor's card under the Menus list on the left. */
function renderMenuSettings(host: MenusViewHost, menu: MenusSection): TemplateResult {
  const cards = menu === "anywhere" ? renderAnywhereStyleCards(host)
    : menu === "switcher" ? renderSwitcherStyleCard(host)
    : renderEntityMenuCard(host);
  return html`<p class="me-menu-note">${MENU_LINES[menu]}</p>${cards}
    <p class="me-menu-note me-pick-note">${menu === "switcher" ? SWITCHER_PICK_NOTE : MENU_PICK_NOTE}</p>`;
}

/** The views' rules, after the shared chrome and the editor's own in the
 * editor's sheet. */
export const menuViewStyles = css`
  /* The Menus and Slots cards: the page editor's Pages and Tiles cards. */
  .me-menus-card > .layers, .me-slots-card > .layers { padding: 6px 8px 8px; overflow: visible; }
  .me-intro { margin: 2px 12px 4px; font-size: 12.5px; line-height: 1.45; color: var(--wa-label); }
  .me-menus-card > .lc-note, .me-slots-card > .lc-note { margin: 8px 12px; color: var(--wa-muted); }
  /* A Menus row: its name and count over the line that says when it
     opens, which wraps rather than being cut. */
  .me-menu-row { padding-top: 6px; padding-bottom: 6px; align-items: start; }
  .me-menu-row > .thumb { margin-top: 1px; }
  .me-menu-row .name b { white-space: normal; flex-wrap: wrap; column-gap: 8px; row-gap: 0; }
  .me-menu-row .name b .nm-t { white-space: normal; overflow: visible; }
  .me-menu-row .name .me-menu-count { font-size: 12px; font-weight: 500; color: var(--wa-muted); white-space: nowrap; }
  .me-menu-row .name small { white-space: normal; overflow: visible; line-height: 1.35; }
  .me-menu-row .name .me-lib { margin-top: 6px; }
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
    flex: 1 1 auto; min-width: 0; overflow-wrap: anywhere;
    font-size: 12.5px; font-weight: 600; color: var(--wa-ink);
  }
  .me-acts { display: flex; flex-wrap: wrap; gap: 6px; padding: 12px 0 0; }
  .me-readonly { font-size: 12px; color: var(--wa-muted); }
  .me-sub-h { margin: 8px 0 2px; font-size: 12px; font-weight: 600; color: var(--wa-muted); }
  .me-voice-list { display: flex; flex-direction: column; margin-bottom: 2px; }
  .me-body .hint.warn { color: var(--wa-amber); }
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
