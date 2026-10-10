// The menu editor in the complication editor's chrome, as the page editor
// wears it: the top bar, the Menus card that picks the one menu the canvas
// and the inspector show, the Slots card, the canvas with its watch chips,
// facts, zoom and hint, and the inspector's crumbs and cards. Then the watch
// screen itself: the ring placed on a screen of the watch's real proportions,
// and the page switcher drawn from the pages record.

import { html } from "lit";
import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { HassLike, OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import { SECTION_COLOR } from "../src/kinds.js";
import { REFERENCE_CASE } from "../src/renderer.js";
import { SymbolBrowser } from "../src/symbols.js";
import { takeWatchMenusRecord } from "../src/watch-menus/draft.js";
import { PAGES_PATH_FROM_MENUS, WATCH_MENUS_HELP_URL, dropWatchMenusDrafts, watchMenusDirty } from "../src/watch-menus/hook.js";
import {
  ME_COLUMNS_KEY,
  WATCH_SWITCHER_COLORS,
  WATCH_SWITCHER_LEFT_OUT_COLOR,
  joinSaveNotes,
  watchSwitcherPages,
  watchSwitcherRows,
} from "../src/watch-menus/menu-editor.js";
import {
  MENUS_SECTIONS,
  MENUS_ZOOM_KEY,
  MENU_CHIP_COLOR,
  MENU_PAGE_CHIP_COLOR,
  MENU_SECTION_BADGES,
  MENU_STAGE_HINT,
  type MenuSwitcherPage,
  type MenusViewHost,
  SWITCHER_LINE,
  SWITCHER_PICK_NOTE,
  deselectMenuSlot,
  loadMenusZoom,
  menuScreenPoint,
  menuSlotChanged,
  menuSlotLookChanged,
  menuStyleChanged,
  renderMenuInspector,
  renderMenuScreen,
  renderMenusCard,
  renderSlotsCard,
  saveMenusZoom,
  selectMenu,
  selectSwitcherPage,
  selectedSwitcherPage,
  shownMenu,
  switcherRingPoint,
} from "../src/watch-menus/menu-view.js";
import {
  ANYWHERE,
  type MenuTargets,
  type MenusDocument,
  NO_MENU_TARGETS,
  PHONE_NO_PHRASES_TEXT,
  setWatchMenuActionKey,
  setWatchMenuSlotColor,
  setWatchMenuSlotVisible,
  setWatchMenuStyle,
  watchMenuRingPoint,
  watchMenuSlots,
} from "../src/watch-menus/model.js";
import { readWatchCatalog } from "../src/watch-pages/catalog.js";
import { WatchPagesDraft } from "../src/watch-pages/draft.js";
import { readWatchHttpLibrary, watchCatalogWithHttpLibrary } from "../src/watch-pages/http-library.js";
import { findWatchPage } from "../src/watch-pages/edit.js";
import { WATCH_PAGES_PATH } from "../src/watch-pages/hook.js";
import { takeWatchPagesRecord } from "../src/watch-pages/kept.js";
import type { WatchPagesDocument } from "../src/watch-pages/model.js";
import { WATCH_PAGE_CHIP_COLOR } from "../src/watch-pages/page-settings.js";
import { setWatchPageHideFromSwitcher, setWatchPageSwitcherText } from "../src/watch-pages/page-settings-model.js";
import { STAGE_ZOOM_KEY } from "../src/watch-pages/stage.js";
import type { SwitcherSettingsHost } from "../src/watch-pages/switcher-settings.js";

const DEFAULTS = JSON.parse(readFileSync(join(__dirname, "fixtures-menus", "01-defaults.json"), "utf8")) as MenusDocument;
const ANYWHERE_COUNT = watchMenuSlots(DEFAULTS, ANYWHERE).length;

/** The fixture's Refresh slot, top left, and its Info slot, right centre. */
const REFRESH = "3E4D0000-0000-4000-8000-000000000001";
const INFO = "3E4D0000-0000-4000-8000-000000000005";

/** A template flattened to its markup, values in place (a bound attribute
 * comes out unquoted). */
const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

const NO_ICONS = { render: () => undefined, available: () => false, names: () => [] } as unknown as MenusViewHost["icons"];

function host(document: MenusDocument, switcherPages: readonly MenuSwitcherPage[] = [], scale = 1.5): MenusViewHost {
  return {
    hass: { states: {} } as unknown as HassLike,
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    document,
    targets: { pages: [], statusPages: [], httpActions: [] },
    catalogKnown: true,
    busy: false,
    uiState: new Map(),
    screen: { width: 208, height: 248 },
    scale,
    switcherPages,
    edit: () => false,
    endCoalesce: () => undefined,
    requestUpdate: () => undefined,
  };
}

const count = (text: string, part: string) => text.split(part).length - 1;

/** The markup of one row of a list, from its opening tag to the next row's. */
function row(text: string, attr: string, value: string, cls: string): string {
  const at = text.search(new RegExp(`${attr}=${value}\\s`, "i"));
  if (at < 0) return "";
  const start = text.lastIndexOf(`<div class="layer ${cls}`, at);
  const next = text.indexOf(`<div class="layer ${cls}`, at);
  return text.slice(start, next < 0 ? undefined : next);
}

const KITCHEN: MenuSwitcherPage = { id: "a", name: "Kitchen", text: "Kitchen", icon: "house", color: "#FF0000" };

describe("the Menus card", () => {
  it("has three rows, the shown menu lit, and the canvas shows only the selected menu", () => {
    const h = host(DEFAULTS, [KITCHEN]);
    let card = flat(renderMenusCard(h));
    expect(card).toContain(`<span class="lc-title">Menus</span>`);
    expect(card).toContain("--c: var(--wa-lc-pages, #26a69a)");
    expect(count(card, `<div class="layer me-menu-row`)).toBe(3);
    const at = MENUS_SECTIONS.map(([id, label]) => {
      expect(card).toContain(`>${label}</span></b>`);
      return card.indexOf(`data-menu=${id} `);
    });
    expect(at.every((p) => p > -1)).toBe(true);
    expect([...at].sort((a, b) => a - b)).toEqual(at);
    // The Anywhere menu is shown first, and only it is lit.
    expect(row(card, "data-menu", "anywhere", "me-menu-row")).toMatch(/^<div class="layer me-menu-row hl"/);
    expect(row(card, "data-menu", "switcher", "me-menu-row")).toMatch(/^<div class="layer me-menu-row "/);
    // Each row has a small ring and a line under its name.
    expect(count(card, `class="thumb me-ring-thumb"`)).toBe(3);
    expect(card).toContain(`<small>${ANYWHERE_COUNT} slots</small>`);
    expect(card).toContain("<small>By type · Light</small>");
    expect(card).toContain("<small>1 page</small>");
    // One watch on the canvas, the shown menu's.
    let screen = flat(renderMenuScreen(h));
    expect(count(screen, `class="wa-watch"`)).toBe(1);
    expect(screen).toContain("aria-label=Anywhere menu on the watch");
    selectMenu(h, "switcher");
    expect(shownMenu(h)).toBe("switcher");
    card = flat(renderMenusCard(h));
    expect(row(card, "data-menu", "switcher", "me-menu-row")).toMatch(/^<div class="layer me-menu-row hl"/);
    expect(row(card, "data-menu", "anywhere", "me-menu-row")).toMatch(/^<div class="layer me-menu-row "/);
    screen = flat(renderMenuScreen(h));
    expect(count(screen, `class="wa-watch"`)).toBe(1);
    expect(screen).toContain("aria-label=Page switcher on the watch");
    expect(screen).not.toContain("Anywhere menu on the watch");
  });
});

describe("the Slots card", () => {
  it("lists the shown menu's slots in ring order, each with its icon, name, place and action", () => {
    const text = flat(renderSlotsCard(host(DEFAULTS)));
    expect(text).toContain(`<span class="lc-title">Slots</span>`);
    expect(text).toContain("--c: var(--wa-lc-layers, #4a7fe8)");
    expect(text).toContain(`class="lc-btn pri me-add-slot" aria-label="Add slot"`);
    expect(count(text, `<div class="layer me-slot-row`)).toBe(ANYWHERE_COUNT);
    const refresh = row(text, "data-slot", REFRESH, "me-slot-row");
    expect(refresh).toContain(`<span class="nm-t">Refresh</span>`);
    expect(refresh).toContain("<small>Top Left · Refresh</small>");
    expect(refresh).toContain(`class="thumb me-thumb" style=--c:#4DBFE0`);
    expect(refresh).toContain("aria-label=Remove Refresh");
    expect(refresh).not.toContain(">hidden</span>");
    // Ring order: top left before right centre.
    expect(text.search(new RegExp(`data-slot=${REFRESH}\\s`, "i"))).toBeLessThan(text.search(new RegExp(`data-slot=${INFO}\\s`, "i")));
  });

  it("lights the selected slot's row and no other, and marks a hidden slot", () => {
    const h = host(setWatchMenuSlotVisible(DEFAULTS, ANYWHERE, INFO, false));
    h.uiState.set("me:sel:anywhere", REFRESH);
    const text = flat(renderSlotsCard(h));
    expect(row(text, "data-slot", REFRESH, "me-slot-row")).toMatch(/^<div class="layer me-slot-row hl /);
    expect(row(text, "data-slot", INFO, "me-slot-row")).toMatch(/^<div class="layer me-slot-row  dim"/);
    expect(row(text, "data-slot", INFO, "me-slot-row")).toContain(`<span class="badge">hidden</span>`);
    // The ring lights the same slot.
    expect(flat(renderMenuScreen(h))).toMatch(/class="me-dot  on "/);
  });

  it("says which list the Entity quick menu shows, and lists the switcher's pages with no Add", () => {
    const h = host(DEFAULTS, [KITCHEN]);
    selectMenu(h, "entity");
    const entity = flat(renderSlotsCard(h));
    expect(entity).toContain(`class="lc-filter me-filter"`);
    expect(entity).toContain("Light menu, by type");
    expect(entity).toContain("me-slot-row");
    selectMenu(h, "switcher");
    const switcher = flat(renderSlotsCard(h));
    expect(switcher).toContain(`<span class="lc-title">Pages</span>`);
    expect(switcher).toContain("<small>Shown by name</small>");
    expect(switcher).not.toContain("me-add-slot");
    expect(switcher).not.toContain(`class="acts"`);
  });
});

describe("the inspector", () => {
  it("names the menu with no slot selected, and shows its own settings", () => {
    const text = flat(renderMenuInspector(host(DEFAULTS)));
    const head = text.slice(text.indexOf(`<div class="insp-head">`), text.indexOf(`<div class="insp-body">`));
    expect(head).toContain(`<span class="kchip" style=--k:${MENU_CHIP_COLOR}>Menu</span><span class="nm" title=Anywhere menu>Anywhere menu</span>`);
    expect(head).toContain(">Collapse all</button>");
    expect(text).toContain("data-sec=menu-editor:style-anywhere");
    expect(text).toContain(`style=--c:${SECTION_COLOR.look}`);
    expect(text).not.toContain("name-sec");
  });

  it("crumbs a selected slot as Menu › SLOT › name, in the slot's color, over its Name, Slot and Look cards", () => {
    const h = host(DEFAULTS);
    h.uiState.set("me:sel:anywhere", REFRESH);
    const text = flat(renderMenuInspector(h));
    const head = text.slice(text.indexOf(`<div class="insp-head">`), text.indexOf(`<div class="insp-body">`));
    expect(head).toContain(`<button class="root" title="Edit the menu"`);
    expect(head).toContain(">Anywhere menu</button><span class=\"sep\">›</span><span class=\"kchip\" style=--k:#4DBFE0>Slot</span><span class=\"nm\" title=Refresh>Refresh</span>");
    const name = text.indexOf(`class="sec name-sec"`);
    const slot = text.indexOf("data-sec=menu-editor:slot");
    const look = text.indexOf("data-sec=menu-editor:look");
    expect(name).toBeGreaterThan(-1);
    expect(slot).toBeGreaterThan(name);
    expect(look).toBeGreaterThan(slot);
    expect(text).toContain(`<span class="me-name" title="A slot is named by what it runs, else by its action">Refresh</span>`);
    // The slot's controls, every one kept.
    for (const label of [">Place<", ">Shown<", ">Action<", ">Show for<", ">Icon<", ">Color<", ">Remove</span>"]) expect(text, label).toContain(label);
    // Escape, or the crumb, lets go of the slot.
    expect(deselectMenuSlot(h)).toBe(true);
    expect(flat(renderMenuInspector(h))).toContain("data-sec=menu-editor:style-anywhere");
    expect(deselectMenuSlot(h)).toBe(false);
  });

  it("gives each card the complication editor's badge", () => {
    expect(MENU_SECTION_BADGES).toEqual({
      name: { color: SECTION_COLOR.place, icon: "text" },
      slot: { color: SECTION_COLOR.content, icon: "content" },
      look: { color: SECTION_COLOR.look, icon: "look" },
      menu: { color: SECTION_COLOR.content, icon: "content" },
      style: { color: SECTION_COLOR.look, icon: "look" },
      switcherPage: { color: SECTION_COLOR.content, icon: "watch" },
    });
    const h = host(DEFAULTS);
    h.uiState.set("me:sel:anywhere", REFRESH);
    const text = flat(renderMenuInspector(h));
    const card = (id: string) => text.slice(text.lastIndexOf("<section", text.indexOf(`data-sec=menu-editor:${id}`)));
    // The colors are token names, var(...), which a pattern would read as a
    // group, so the openings are compared as plain text.
    expect(card("slot").startsWith(`<section class="sec" data-sec=menu-editor:slot data-open=true data-help="on" style=--c:${SECTION_COLOR.content}`)).toBe(true);
    expect(card("look").startsWith(`<section class="sec" data-sec=menu-editor:look data-open=true data-help="on" style=--c:${SECTION_COLOR.look}`)).toBe(true);
    expect(text).toContain(`<section class="sec name-sec" data-open="true" style=--c:${SECTION_COLOR.place}>`);
  });

  it("holds the Entity quick menu's type and the switcher's style in their own cards", () => {
    const h = host(DEFAULTS);
    selectMenu(h, "entity");
    const entity = flat(renderMenuInspector(h));
    expect(entity).toContain("data-sec=menu-editor:menu");
    expect(entity).toContain(`style=--c:${SECTION_COLOR.content}`);
    expect(entity).toContain("By type");
    expect(entity).toContain(">Type<");
    expect(entity).toContain("Add the All slots");
    selectMenu(h, "switcher");
    const switcher = flat(renderMenuInspector(h));
    expect(switcher).toContain("data-sec=menu-editor:style-switcher");
    expect(switcher).toContain("Glow");
    expect(switcher).toContain("Selected Scale");
  });

  it("marks a card changed where a value is away from its default", () => {
    expect(menuStyleChanged(DEFAULTS, "pageSwitcher")).toBe(false);
    expect(menuStyleChanged(setWatchMenuStyle(DEFAULTS, "pageSwitcher", "selectedScale", 1.3), "pageSwitcher")).toBe(true);
    const slot = (d: MenusDocument) => watchMenuSlots(d, ANYWHERE).find((s) => s.id === REFRESH)!;
    expect(menuSlotChanged(slot(DEFAULTS), ANYWHERE)).toBe(false);
    expect(menuSlotChanged(slot(setWatchMenuSlotVisible(DEFAULTS, ANYWHERE, REFRESH, false)), ANYWHERE)).toBe(true);
    expect(menuSlotLookChanged(slot(DEFAULTS))).toBe(false);
    expect(menuSlotLookChanged(slot(setWatchMenuSlotColor(DEFAULTS, ANYWHERE, REFRESH, "#123456")))).toBe(true);
  });
});

// ── the element ─────────────────────────────────────────────────────────

const WATCHES = [
  { owner_watch_id: "menus-w1", device_name: "Jesse's Watch", device_kind: "watch", paired_iphone_name: null },
  { owner_watch_id: "menus-w2", device_name: "Chen's Watch", device_kind: "watch", paired_iphone_name: null },
] as unknown as OwnerSummary[];

let editors = 0;

/** The editor with the defaults open on the first watch, an administrator's
 * hass, and the panel's Watch settings button handed in. */
function editor(revision = 4) {
  const watchId = `${WATCHES[0]!.owner_watch_id}-${++editors}`;
  const owners = [{ ...WATCHES[0]!, owner_watch_id: watchId }, WATCHES[1]!] as OwnerSummary[];
  const Ctor = customElements.get("wa-menu-editor") as unknown as new () => Record<string, unknown>;
  const el = new Ctor();
  el.hass = { user: { is_admin: true }, states: {} } as unknown as HassLike;
  el.owners = owners;
  el.watchId = watchId;
  el.record = {
    kind: "menus", revision, hash: null, updated_at: new Date(Date.now() - 2 * 60_000).toISOString(), updated_by: "panel",
    delivered_revision: revision, delivered_at: null, document: revision > 0 ? DEFAULTS : null,
  } as unknown as WatchConfigRecord;
  el.barActions = html`<button class="tb-btn tb-watch">Watch settings</button>`;
  if (revision > 0) takeWatchMenusRecord(watchId, DEFAULTS, revision);
  return {
    el,
    owners,
    whole: () => flat((el.render as () => unknown).call(el)),
    body: () => flat((el.renderBody as (w: readonly OwnerSummary[]) => unknown).call(el, owners)),
  };
}

describe("the top bar", () => {
  it("has the way back, the sync pill, ···, Save, when it was saved, Pages, Watch settings and the help", () => {
    const text = editor().whole();
    const bar = text.slice(text.indexOf(`<div class="wa-bar`), text.indexOf(`<div class="layout`));
    const order = [
      `class="tb-btn tb-back"`, `class="picker me-watch-picker"`, `class="tb-sync ok"`, `class="tb-btn tb-more"`,
      `class="primary save `, `<span class="tb-saved"`, `class="tb-btn tb-pages"`, `class="tb-btn tb-watch"`, `class="help"`,
    ];
    for (const part of order) expect(bar, part).toContain(part);
    const places = order.map((part) => bar.indexOf(part));
    expect([...places].sort((a, b) => a - b)).toEqual(places);
    expect(bar).toContain(">Complications</span>");
    expect(bar).toContain(">Synced</span>");
    expect(bar).toContain(">Saved 2 min ago</span>");
    expect(bar).toContain(">Pages</span>");
    expect(bar).toContain(`aria-label="Watch menus"`);
    // Undo and Redo are in the canvas head; the old title and toolbar are gone.
    expect(bar).not.toContain(`aria-label="Undo"`);
    expect(text).not.toContain(`class="pe-tools"`);
    expect(text).not.toContain("Watch menus</h2>");
    expect(WATCH_MENUS_HELP_URL).toBe("https://docs.wrist-assistant.com/watch-app/quick-menu-editor/");
    expect(PAGES_PATH_FROM_MENUS).toBe(WATCH_PAGES_PATH);
  });

  it("says Waiting while no device has collected the save, and opens the ··· menu with Discard edits", () => {
    const { el, whole } = editor();
    el.record = { ...(el.record as WatchConfigRecord), delivered_revision: 3 };
    el.topMenuOpen = true;
    const text = whole();
    expect(text).toContain(`class="tb-sync warn"`);
    expect(text).toContain(">Waiting to be collected</span>");
    expect(text).toContain(">Discard edits</button>");
  });

  it("picks the watch from the bar: the shown one's name, and a menu of every watch with a check on it", () => {
    const { el, whole } = editor();
    let text = whole();
    const picker = (t: string) => t.slice(t.indexOf(`<span class="picker me-watch-picker">`), t.indexOf(`class="tb-sync`));
    expect(picker(text)).toContain(`<span class="tb-browse-l">Jesse's Watch</span>`);
    expect(picker(text)).toContain(`aria-expanded=false`);
    expect(picker(text)).not.toContain("me-watch-menu");
    el.watchMenuOpen = true;
    text = whole();
    const menu = picker(text);
    expect(menu).toContain(`aria-expanded=true`);
    expect(count(menu, `class="row me-watch-row"`)).toBe(2);
    expect(menu).toMatch(/aria-checked=true\s+@click=>\s*<span class="pe-chip-glyph"[^]*?>Jesse's Watch<\/span>\s*<span class="me-watch-check" aria-hidden="true"><svg/);
    expect(menu).toMatch(/aria-checked=false\s+@click=>\s*<span class="pe-chip-glyph"[^]*?>Chen's Watch<\/span>\s*<span class="me-watch-check" aria-hidden="true"><\/span>/);
  });

  it("shows the picker in every state of the body, and not for a single watch", () => {
    const bar = (t: string) => t.slice(t.indexOf(`<div class="wa-bar`), t.indexOf(`</div>`, t.indexOf(`class="help"`)));
    // No menus yet: only the empty card, and the picker is the way out.
    expect(bar(editor(0).whole())).toContain(`class="picker me-watch-picker"`);
    const loading = editor();
    loading.el.loading = true;
    expect(loading.whole()).toContain(`class="picker me-watch-picker"`);
    const unsupported = editor();
    unsupported.el.unsupported = true;
    expect(unsupported.whole()).toContain(`class="picker me-watch-picker"`);
    const failed = editor();
    failed.el.loadError = "boom";
    expect(failed.whole()).toContain(`class="picker me-watch-picker"`);
    const single = editor();
    single.el.owners = [(single.owners as OwnerSummary[])[0]!];
    expect(single.whole()).not.toContain("me-watch-picker");
  });

  it("offers Start with the defaults in the ··· menu for a watch with no menus yet", () => {
    const { el, whole } = editor(0);
    el.topMenuOpen = true;
    const text = whole();
    const bar = text.slice(text.indexOf(`<div class="wa-bar`), text.indexOf(`<div class="pe-empty`));
    expect(bar).toContain(">Start with the defaults</button>");
    expect(bar).not.toContain(">Discard edits</button>");
    expect(bar).not.toContain(`class="primary save`);
    expect(bar).not.toContain("tb-sync");
  });
});

describe("the canvas", () => {
  it("reads menu / watch / facts as text, with Undo and Redo, and no watch chips", () => {
    const { body } = editor();
    const text = body();
    const head = text.slice(text.indexOf(`<div class="cv-head">`), text.indexOf(`<div class="stage-area`));
    expect(head).toContain(`<span class="cv-title" title=Anywhere menu>Anywhere menu</span>`);
    expect(head).not.toContain("tb-name-input");
    expect(head).not.toContain("doc-chip");
    expect(head).not.toContain("Chen's Watch");
    // "Anywhere menu / Jesse's Watch / 8 slots · 46 mm", in that order.
    const title = head.indexOf(">Anywhere menu</span>");
    const watch = head.indexOf(`<span class="cv-watch">Jesse's Watch</span>`);
    const facts = head.indexOf(`${ANYWHERE_COUNT} slots · ${REFERENCE_CASE.label}`);
    expect(title).toBeGreaterThan(-1);
    expect(watch).toBeGreaterThan(title);
    expect(facts).toBeGreaterThan(watch);
    expect(head).toContain(`aria-label="Undo"`);
    expect(head).toContain(`aria-label="Redo"`);
    // The hint under the watch, and no Live strip: menus have no live state.
    expect(text).toContain(`<div class="under"><span class="tail">${MENU_STAGE_HINT}</span></div>`);
    expect(text).not.toContain(`class="values-foot"`);
    // The three columns, with the gutters between them.
    expect(text).toContain(`<div class="layout pe-layout cols-3"`);
    expect(count(text, `class="gutter `)).toBe(2);
    expect(text).toContain(`class="card lc me-menus-card"`);
    expect(text).toContain(`class="card lc me-slots-card"`);
    expect(text).toContain(`<div class="column inspector card">`);
  });

  it("zooms the watch with the strip's buttons, and Fit goes back", () => {
    const { el, body } = editor();
    const width = (scale: number) => `width:${Math.round(REFERENCE_CASE.screen.width * scale)}px;height:${Math.round(REFERENCE_CASE.screen.height * scale)}px;--me-s:${scale}`;
    const setZoom = el.setZoom as (scale: number | undefined) => void;
    setZoom.call(el, undefined);
    let text = body();
    expect(text).toContain(`aria-label=Zoom 150%. Back to fit`);
    expect(text).toContain(">150%</button>");
    expect(text).toContain(`<span class="word keep">${REFERENCE_CASE.label}</span>`);
    expect(text).toContain(width(1.5));
    setZoom.call(el, 2);
    expect(el.zoom).toBe(2);
    text = body();
    expect(text).toContain(">200%</button>");
    expect(text).toContain(width(2));
    expect(text).toContain(`<button class="tb icon me-zoom-in" ?disabled=true`);
    expect(text).toContain(`<button class="tb icon me-zoom-out" ?disabled=false`);
    setZoom.call(el, undefined);
    expect(el.zoom).toBeUndefined();
    expect(body()).toContain(">150%</button>");
  });

  it("remembers the zoom under the menus' own key, and the column widths under theirs", () => {
    expect(MENUS_ZOOM_KEY).toBe("wrist-assistant-panel.menus.zoom.v1");
    expect(MENUS_ZOOM_KEY).not.toBe(STAGE_ZOOM_KEY);
    expect(ME_COLUMNS_KEY).toBe("wrist-assistant-panel.menus.columns.v1");
    const store = new Map<string, string>();
    const storage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => { store.set(k, v); } };
    expect(loadMenusZoom(storage)).toBeUndefined();
    saveMenusZoom(1.25, storage);
    expect(store.get(MENUS_ZOOM_KEY)).toBe("1.25");
    expect(store.has(STAGE_ZOOM_KEY)).toBe(false);
    expect(loadMenusZoom(storage)).toBe(1.25);
    saveMenusZoom(undefined, storage);
    expect(loadMenusZoom(storage)).toBeUndefined();
    store.set(MENUS_ZOOM_KEY, "3");
    expect(loadMenusZoom(storage)).toBeUndefined();
  });
});

describe("the watch screen", () => {
  it("draws at the watch's proportions, at the stage's scale", () => {
    const out = flat(renderMenuScreen(host(DEFAULTS)));
    expect(out).toContain("width:312px;height:372px;--me-s:1.5");
    expect(out).toContain("viewBox=0 0 208 248");
    expect(flat(renderMenuScreen(host(DEFAULTS, [], 1.25)))).toContain("width:260px;height:310px;--me-s:1.25");
  });

  it("lists the page switcher's pages on its screen, or says there are none", () => {
    const pages: MenuSwitcherPage[] = [KITCHEN, { id: "b", name: "Garden", icon: "leaf", color: "#00FF00" }];
    const h = host(DEFAULTS, pages);
    selectMenu(h, "switcher");
    const out = flat(renderMenuScreen(h));
    expect(out).toContain("title=Kitchen>Kitchen</span>");
    expect(out).toContain('class="me-dot me-page-dot ');
    const none = host(DEFAULTS);
    selectMenu(none, "switcher");
    expect(flat(renderMenuScreen(none))).toContain("No pages in the switcher yet.");
  });

  it("keeps the ring round on a screen taller than wide", () => {
    const screen = { width: 208, height: 248 };
    const top = menuScreenPoint(screen, watchMenuRingPoint("topCenter")!);
    expect(top.x).toBe(0.5);
    expect(top.y).toBeCloseTo(0.5 - (0.36 * 208) / 248, 4);
    expect(menuScreenPoint(screen, watchMenuRingPoint("rightCenter")!)).toEqual({ x: 0.86, y: 0.5 });
    // On a square screen the unit square is the screen.
    expect(menuScreenPoint({ width: 100, height: 100 }, { x: 0.2, y: 0.7 })).toEqual({ x: 0.2, y: 0.7 });
  });

  it("places switcher pages from top centre, counterclockwise and evenly", () => {
    expect(switcherRingPoint(0, 4)).toEqual(watchMenuRingPoint("topCenter"));
    expect(switcherRingPoint(1, 4)).toEqual(watchMenuRingPoint("leftCenter"));
    expect(switcherRingPoint(2, 4)).toEqual(watchMenuRingPoint("bottomCenter"));
    expect(switcherRingPoint(1, 8)).toEqual(watchMenuRingPoint("topLeft"));
    expect(switcherRingPoint(0, 1)).toEqual(watchMenuRingPoint("topCenter"));
  });
});

describe("the page switcher's pages", () => {
  it("are the pages the watch's switcher shows, as it draws them", () => {
    const doc = {
      pages: [
        { id: "1", name: "Settings", isSystemPage: true },
        { id: "2", name: "Secret", isHidden: true },
        { id: "3", name: "Skipped", hideFromSwitcher: true },
        { id: "4", name: "Kitchen", switcherText: "Kit", switcherColor: "#123456" },
        { id: "5", name: "Lights", switcherDisplayMode: "icon", items: [{ icon: "lightbulb" }] },
        { id: "6", name: "Smart", switcherDisplayMode: "icon", dynamicConfig: {} },
        { id: "7", name: "", switcherText: "" },
        "not a page",
      ],
    };
    expect(watchSwitcherPages(doc)).toEqual([
      { id: "4", name: "Kitchen", text: "Kit", icon: "square.grid.2x2.fill", color: "#123456" },
      { id: "5", name: "Lights", icon: "lightbulb", color: WATCH_SWITCHER_COLORS[1] },
      { id: "6", name: "Smart", icon: "bolt.fill", color: WATCH_SWITCHER_COLORS[2] },
      { id: "7", name: "Untitled page", text: "Untitled page", icon: "square.grid.2x2.fill", color: WATCH_SWITCHER_COLORS[3] },
    ]);
    expect(watchSwitcherPages(undefined)).toEqual([]);
  });
});

// ── a page's switcher settings ───────────────────────────────────────────

const PAGES = JSON.parse(readFileSync(join(__dirname, "fixtures-pages", "05-pages.json"), "utf8")) as WatchPagesDocument;
/** The fixture's first page, its Living room, and its Guest page, which is
 * hidden on the watch and so never in the switcher. */
const HOME = "5A17E000-0000-4000-8000-00000000000A";
const LIVING = "5A17E000-0000-4000-8000-00000000000C";
const GUEST = "5A17E000-0000-4000-8000-00000000000D";

interface Tpl {
  strings: readonly string[];
  values: unknown[];
}

function templates(node: unknown, out: Tpl[] = []): Tpl[] {
  if (Array.isArray(node)) for (const n of node) templates(n, out);
  else if (node !== null && typeof node === "object" && "strings" in node && "values" in node) {
    const t = node as Tpl;
    out.push(t);
    for (const v of t.values) templates(v, out);
  }
  return out;
}

/** The `event` handler of the smallest template whose text holds `marker`
 * and binds that event to a function itself. */
function handler(root: unknown, marker: string, event: "click" | "change" | "keydown"): (e: unknown) => void {
  const found = templates(root)
    .map((t) => {
      let text = "";
      let fn: unknown;
      t.strings.forEach((part, i) => {
        text += part;
        if (i >= t.values.length) return;
        const v = t.values[i];
        if (typeof v === "function" && part.trimEnd().endsWith(`@${event}=`)) fn ??= v;
        text += flat(v);
      });
      return { text, fn };
    })
    .filter((c) => c.text.includes(marker) && c.fn !== undefined)
    .sort((a, b) => a.text.length - b.text.length);
  if (found.length === 0) throw new Error(`no @${event} handler near ${marker}`);
  return found[0]!.fn as (e: unknown) => void;
}

/** A view host as the element builds one, over a page draft: the switcher's
 * pages and rows read from the draft on every read, and a page's switcher
 * settings editing it. */
function switcherView(pages: WatchPagesDocument) {
  const draft = new WatchPagesDraft(pages, 3);
  const h = host(DEFAULTS) as MenusViewHost & Record<string, unknown>;
  Object.defineProperties(h, {
    switcherPages: { get: () => watchSwitcherPages(draft.document) },
    switcherRows: { get: () => watchSwitcherRows(draft.document) },
  });
  h.switcherSettings = (pageId: string): SwitcherSettingsHost | undefined => findWatchPage(draft.document, pageId) === undefined ? undefined : {
    pageId,
    icons: NO_ICONS,
    symbols: h.symbols,
    uiState: h.uiState,
    get page() { return findWatchPage(draft.document, pageId)!; },
    busy: false,
    edit: (change, opts) => { draft.apply(change(draft.document), opts?.typing === true ? { coalesce: "t" } : undefined); },
    endCoalesce: () => draft.endCoalesce(),
    requestUpdate: () => undefined,
  };
  selectMenu(h, "switcher");
  return { h: h as MenusViewHost, draft };
}

describe("the switcher's Pages card", () => {
  it("lists every page the switcher could show, those left out dimmed with a badge, and the ring leaves them out", () => {
    const { h } = switcherView(setWatchPageHideFromSwitcher(PAGES, LIVING, true));
    const text = flat(renderSlotsCard(h));
    expect(text).toContain(`<span class="lc-title">Pages</span>`);
    expect(text).not.toContain("read only");
    expect(text).toContain(`<span class="lc-sub">4 pages, 1 hidden</span>`);
    expect(count(text, `<div class="layer me-page-row`)).toBe(4);
    const living = row(text, "data-page", LIVING, "me-page-row");
    expect(living).toMatch(/^<div class="layer me-page-row  dim"/);
    expect(living).toContain(`<span class="badge">hidden</span>`);
    expect(living).toContain("<small>Not in the switcher</small>");
    expect(living).toContain(`--k:${WATCH_SWITCHER_LEFT_OUT_COLOR}`);
    const home = row(text, "data-page", HOME, "me-page-row");
    expect(home).toMatch(/^<div class="layer me-page-row  "/);
    expect(home).not.toContain(">hidden</span>");
    expect(home).toContain(`role="listitem" tabindex="0" aria-current=false`);
    // A page hidden on the watch is not the switcher's at all.
    expect(text).not.toContain(GUEST);
    // In watch order: Home before Living room.
    expect(text.indexOf(HOME)).toBeLessThan(text.indexOf(LIVING));
    // The watch draws only the pages it shows.
    expect(h.switcherPages.map((p) => p.id)).not.toContain(LIVING);
    expect(flat(renderMenuScreen(h))).not.toContain("title=Living room");
  });

  it("picks a row with a click or Enter, lights it here and on the watch, and lets go when another menu is shown", () => {
    const { h } = switcherView(PAGES);
    expect(selectedSwitcherPage(h)).toBeUndefined();
    const key = { key: "Enter", target: "row", currentTarget: "row", preventDefault() {} };
    handler(renderSlotsCard(h), `data-page=${LIVING}`, "keydown")(key);
    expect(selectedSwitcherPage(h)?.id).toBe(LIVING);
    const text = flat(renderSlotsCard(h));
    expect(row(text, "data-page", LIVING, "me-page-row")).toMatch(/^<div class="layer me-page-row hl /);
    expect(row(text, "data-page", LIVING, "me-page-row")).toContain("aria-current=true");
    expect(row(text, "data-page", HOME, "me-page-row")).toMatch(/^<div class="layer me-page-row  /);
    expect(flat(renderMenuScreen(h))).toMatch(/class="me-page on" style=[^>]*title=Living room>/);
    selectMenu(h, "anywhere");
    selectMenu(h, "switcher");
    expect(selectedSwitcherPage(h)).toBeUndefined();
  });
});

describe("the inspector for a picked page", () => {
  it("shows the switcher's Style with a note while no page is picked", () => {
    const { h } = switcherView(PAGES);
    const text = flat(renderMenuInspector(h));
    expect(text).toContain("data-sec=menu-editor:style-switcher");
    expect(text).toContain(`<p class="me-menu-note me-pick-note">${SWITCHER_PICK_NOTE}</p>`);
    expect(text.indexOf(SWITCHER_PICK_NOTE)).toBeGreaterThan(text.indexOf("data-sec=menu-editor:style-switcher"));
    expect(text).not.toContain("switcher-page");
    expect(SWITCHER_LINE).toBe("Each page's icon, color and name are set here: pick a page in the Pages card.");
    expect(SWITCHER_PICK_NOTE).not.toMatch(/ - |\u2013|\u2014/);
  });

  it("crumbs Page switcher › PAGE › name over the page's one card, which edits the page draft", () => {
    const { h, draft } = switcherView(PAGES);
    selectSwitcherPage(h, HOME);
    let text = flat(renderMenuInspector(h));
    const head = text.slice(text.indexOf(`<div class="insp-head">`), text.indexOf(`<div class="insp-body">`));
    expect(head).toContain(`<button class="root" title="The switcher's own style"`);
    expect(head).toContain(`>Page switcher</button><span class="sep">›</span><span class="kchip" style=--k:${MENU_PAGE_CHIP_COLOR}>Page</span><span class="nm" title=Home>Home</span>`);
    expect(MENU_PAGE_CHIP_COLOR).toBe(WATCH_PAGE_CHIP_COLOR);
    expect(text).toContain(`<section class="sec" data-sec=menu-editor:switcher-page data-open=true data-help="on" style=--c:${SECTION_COLOR.content}>`);
    expect(text).toContain("<h4>In the page switcher</h4>");
    expect(text).toContain(`<span class="sum">Shown</span>`);
    expect(text).toContain(`<fieldset class="ts-body me-body" ?disabled=false`);
    for (const label of [">Hidden<", ">Show as<", ">Name<", "Automatic icon", ">Color<"]) expect(text, label).toContain(label);
    expect(text).not.toContain("style-switcher");
    // Its rows edit the page draft, and the card and the list follow.
    handler(renderMenuInspector(h), ">Hidden<", "change")({ target: { checked: true } });
    expect(findWatchPage(draft.document, HOME)?.hideFromSwitcher).toBe(true);
    text = flat(renderMenuInspector(h));
    expect(text).toContain(`<h4>In the page switcher<span class="sec-dot" aria-hidden="true"></span></h4><span class="sum">Hidden</span>`);
    expect(row(flat(renderSlotsCard(h)), "data-page", HOME, "me-page-row")).toContain(`<span class="badge">hidden</span>`);
    // Collapse all folds the one card.
    handler(renderMenuInspector(h), "Collapse all", "click")({});
    expect(flat(renderMenuInspector(h))).toContain("data-sec=menu-editor:switcher-page data-open=false");
    // The crumb's root, or Escape, goes back to the switcher's Style.
    expect(deselectMenuSlot(h)).toBe(true);
    expect(flat(renderMenuInspector(h))).toContain("data-sec=menu-editor:style-switcher");
    expect(deselectMenuSlot(h)).toBe(false);
  });

  it("shows the Style while there is no page draft to edit in", () => {
    const h = host(DEFAULTS, [KITCHEN]);
    selectMenu(h, "switcher");
    selectSwitcherPage(h, "a");
    expect(selectedSwitcherPage(h)?.id).toBe("a");
    expect(flat(renderMenuInspector(h))).toContain("data-sec=menu-editor:style-switcher");
  });
});

describe("the switcher's rows", () => {
  it("are every page the switcher could show, those left out marked, colored by place among the shown", () => {
    const doc = setWatchPageHideFromSwitcher(PAGES, HOME, true);
    const rows = watchSwitcherRows(doc);
    expect(rows.map((r) => [r.id, r.hidden])).toEqual([
      [HOME, true],
      ["5A17E000-0000-4000-8000-00000000000B", false],
      [LIVING, false],
      ["5A17E000-0000-4000-8000-00000000000E", false],
    ]);
    expect(rows[0]!.color).toBe(WATCH_SWITCHER_LEFT_OUT_COLOR);
    // The first shown page takes the first color, as on the watch, and the
    // pages the watch draws are the rows not left out.
    const { hidden: _, ...first } = rows[1]!;
    expect(first.color).toBe(WATCH_SWITCHER_COLORS[0]);
    expect(watchSwitcherPages(doc)[0]).toEqual(first);
    expect(watchSwitcherPages(doc)).toHaveLength(3);
  });
});

// ── the element's two drafts ─────────────────────────────────────────────

describe("the element with a page draft", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /** The editor with the pages record read into a page draft, and a hass
   * whose connection records every command and saves at revision 9. */
  function withPages() {
    const e = editor();
    const watchId = e.el.watchId as string;
    const sent: Record<string, unknown>[] = [];
    e.el.hass = {
      user: { is_admin: true },
      states: {},
      connection: {
        sendMessagePromise: async (message: Record<string, unknown>) => {
          sent.push(message);
          if (String(message.type).endsWith("/save")) return { revision: 9 };
          throw Object.assign(new Error("not here"), { code: "unknown_command" });
        },
      },
    } as unknown as HassLike;
    e.el.pagesRecord = { revision: 3, document: PAGES };
    const { draft: pages } = takeWatchPagesRecord(watchId, PAGES, 3);
    vi.stubGlobal("window", { addEventListener() {}, removeEventListener() {}, setTimeout, clearTimeout });
    return { ...e, watchId, sent, pages };
  }

  const call = (el: Record<string, unknown>, name: string) => (el[name] as () => unknown).call(el);

  it("counts a page edit as unsaved: Save lit, Unsaved changes, Discard edits on, and the panel's guard", () => {
    dropWatchMenusDrafts();
    expect(watchMenusDirty()).toBe(false);
    const { el, whole, pages } = withPages();
    expect(whole()).toContain(`class="primary save "`);
    pages.apply(setWatchPageSwitcherText(PAGES, HOME, "Front"));
    el.topMenuOpen = true;
    const text = whole();
    expect(text).toContain(`class="primary save dirty"`);
    expect(text).toContain(`<span class="tb-saved" title=Unsaved changes>`);
    expect(text).toMatch(/<button class="row" role="menuitem" \?disabled=false\s+title="Go back to the copy Home Assistant holds/);
    expect(watchMenusDirty()).toBe(true);
    // Leaving the panel anyway drops the page draft too.
    dropWatchMenusDrafts();
    expect(watchMenusDirty()).toBe(false);
  });

  it("shows a page draft's edit in the switcher at once", () => {
    const { el, body, pages } = withPages();
    (el.uiState as Map<string, unknown>).set("me:menu", "switcher");
    pages.apply(setWatchPageSwitcherText(PAGES, HOME, "Front"));
    const text = body();
    expect(text).toContain("title=Home>Front</span>");
    expect(text).toContain("<small>Shown as Front</small>");
  });

  it("saves only the pages when only they hold edits", async () => {
    const { el, sent, pages } = withPages();
    pages.apply(setWatchPageSwitcherText(PAGES, HOME, "Front"));
    await call(el, "save");
    const saves = sent.filter((m) => String(m.type).endsWith("/save"));
    expect(saves.map((m) => m.kind)).toEqual(["pages"]);
    expect(saves[0]!.base_revision).toBe(3);
    expect(findWatchPage(saves[0]!.document as WatchPagesDocument, HOME)?.switcherText).toBe("Front");
    expect(pages.dirty).toBe(false);
    expect(pages.revision).toBe(9);
  });

  it("saves the menus and then the pages when both hold edits", async () => {
    const { el, sent, pages, watchId } = withPages();
    const menus = takeWatchMenusRecord(watchId, DEFAULTS, 4).draft;
    menus.apply(setWatchMenuStyle(DEFAULTS, "pageSwitcher", "selectedScale", 1.3));
    pages.apply(setWatchPageSwitcherText(PAGES, HOME, "Front"));
    await call(el, "save");
    expect(sent.filter((m) => String(m.type).endsWith("/save")).map((m) => m.kind)).toEqual(["menus", "pages"]);
    expect(menus.dirty).toBe(false);
    expect(pages.dirty).toBe(false);
  });

  it("discards both drafts", () => {
    const { el, pages, watchId } = withPages();
    const menus = takeWatchMenusRecord(watchId, DEFAULTS, 4).draft;
    menus.apply(setWatchMenuStyle(DEFAULTS, "pageSwitcher", "selectedScale", 1.3));
    pages.apply(setWatchPageSwitcherText(PAGES, HOME, "Front"));
    call(el, "discard");
    expect(menus.dirty).toBe(false);
    expect(pages.dirty).toBe(false);
    expect((el.note as { text: string }).text).toBe("Edits discarded. Undo brings them back.");
  });

  it("undoes the pages while a page is picked in the switcher, else the menus", () => {
    const { el, pages, watchId } = withPages();
    const menus = takeWatchMenusRecord(watchId, DEFAULTS, 4).draft;
    menus.apply(setWatchMenuStyle(DEFAULTS, "pageSwitcher", "selectedScale", 1.3));
    pages.apply(setWatchPageSwitcherText(PAGES, HOME, "Front"));
    const ui = el.uiState as Map<string, unknown>;
    ui.set("me:menu", "switcher");
    ui.set("me:sw:page", HOME);
    call(el, "undo");
    expect(pages.dirty).toBe(false);
    expect(menus.dirty).toBe(true);
    ui.delete("me:sw:page");
    call(el, "undo");
    expect(menus.dirty).toBe(false);
  });
});

describe("the note after saving both", () => {
  it("joins the two notes, once when they say the same, in the graver kind", () => {
    expect(joinSaveNotes(undefined, undefined)).toBeUndefined();
    expect(joinSaveNotes({ kind: "ok", text: "A." }, undefined)).toEqual({ kind: "ok", text: "A." });
    expect(joinSaveNotes(undefined, { kind: "warn", text: "B." })).toEqual({ kind: "warn", text: "B." });
    expect(joinSaveNotes({ kind: "ok", text: "A." }, { kind: "err", text: "B." })).toEqual({ kind: "err", text: "A. B." });
    expect(joinSaveNotes({ kind: "ok", text: "Same." }, { kind: "ok", text: "Same." })).toEqual({ kind: "ok", text: "Same." });
  });
});

// ── the hints on an iPhone ───────────────────────────────────────────────

describe("the Speak Phrase and Show Status Page hints on an iPhone", () => {
  const CONFIGURED = JSON.parse(readFileSync(join(__dirname, "fixtures-menus", "02-configured.json"), "utf8")) as MenusDocument;
  /** The fixture's Anywhere slots that speak a phrase and show a status page. */
  const SPEAK_SLOT = "3E4D1000-0000-4000-8000-000000000005";
  const STATUS_SLOT = "3E4D1000-0000-4000-8000-000000000004";

  function inspector(slot: string, patch: Partial<MenusViewHost> = {}): string {
    const h = { ...host(CONFIGURED), catalogKnown: false, ...patch } as MenusViewHost;
    h.uiState.set("me:sel:anywhere", slot);
    return flat(renderMenuInspector(h));
  }

  it("says a phone has no voice phrases under Speak Phrase", () => {
    const phone = inspector(SPEAK_SLOT, { device: "iphone" });
    expect(phone).toContain(PHONE_NO_PHRASES_TEXT);
    expect(phone).not.toContain("No voice settings from this watch yet.");
    const watch = inspector(SPEAK_SLOT);
    expect(watch).toContain("No voice settings from this watch yet. Add phrases in Voice.");
    expect(watch).not.toContain(PHONE_NO_PHRASES_TEXT);
    expect(PHONE_NO_PHRASES_TEXT).not.toMatch(new RegExp(" - |\\u2013|\\u2014"));
  });

  it("names the iPhone when it has no status pages", () => {
    expect(inspector(STATUS_SLOT, { device: "iphone" })).toContain("No status pages on this iPhone yet. Add them in Status pages.");
    expect(inspector(STATUS_SLOT)).toContain("No status pages from this watch yet. Add them in Status pages.");
  });
});

// ── Run HTTP Action over the home's library ──────────────────────────────

describe("the Run HTTP Action target", () => {
  const CONFIGURED = JSON.parse(readFileSync(join(__dirname, "fixtures-menus", "02-configured.json"), "utf8")) as MenusDocument;
  const CATALOG = readWatchCatalog(JSON.parse(readFileSync(join(__dirname, "fixtures-catalog", "catalog.json"), "utf8")), { revision: 3 });
  /** The fixture's Anywhere slot that runs an HTTP action, and its target. */
  const HTTP_SLOT = "3E4D1000-0000-4000-8000-000000000002";
  const STORED = "3E4D1000-0000-4000-8000-000000000384";
  const PORCH = "A1B2C3D4-0000-4000-8000-0000000000A1";
  const BLANK = "A1B2C3D4-0000-4000-8000-0000000000A2";
  const LIBRARY = readWatchHttpLibrary({
    revision: 5,
    document: { actions: [
      { id: STORED.toLowerCase(), name: "Gate", url: "https://gate.local" },
      { id: PORCH, name: "Porch Temp", url: "http://porch.local", responseConfig: { source: "bodyText" } },
      { id: BLANK, name: "Unfinished", url: "" },
    ] },
  })!;

  function inspector(targets: MenusViewHost["targets"], patch: Partial<MenusViewHost> = {}): string {
    const h = { ...host(CONFIGURED), targets, ...patch } as MenusViewHost;
    h.uiState.set("me:sel:anywhere", HTTP_SLOT);
    return flat(renderMenuInspector(h));
  }

  /** The text of the HTTP action field: its select and the lines under it. */
  function field(text: string): string {
    const at = text.indexOf("<span>HTTP action</span>");
    return at < 0 ? "" : text.slice(at, text.indexOf("</label>", text.indexOf("</select>", at)) + 300);
  }

  it("lists the library first, then the iPhone's own, each marked", () => {
    const joined = watchCatalogWithHttpLibrary(CATALOG, LIBRARY)!;
    const text = field(inspector({ ...NO_MENU_TARGETS, httpActions: joined.httpActions }, { catalogKnown: true, httpLibrary: "held" }));
    const options = [...text.matchAll(/<option value=[^ ]+ \?selected=(?:true|false)>([^<]*)<\/option>/g)].map((m) => m[1]);
    expect(options).toEqual([
      "Gate",
      "Porch Temp",
      "Unfinished (needs setup)",
      "Open Gate (on the iPhone)",
      "Outdoor Temp (on the iPhone)",
      "HTTP Action (on the iPhone)",
      "Garage Door (needs setup on the iPhone)",
    ]);
    // The stored id is the library's Gate, in another case: picked, not missing.
    expect(text).toMatch(/<option value=3e4d1000-0000-4000-8000-000000000384 \?selected=true>Gate<\/option>/);
    expect(text).not.toContain("Not on the iPhone");
  });

  it("a library action that needs setup says so, with the way to the HTTP actions screen", () => {
    const h = { ...host(CONFIGURED), targets: { ...NO_MENU_TARGETS, httpActions: LIBRARY.actions }, httpLibrary: "held" as const };
    h.uiState.set("me:sel:anywhere", HTTP_SLOT);
    const blank = setWatchMenuActionKey(CONFIGURED, ANYWHERE, HTTP_SLOT, "entityId", BLANK);
    const view = renderMenuInspector({ ...h, document: blank });
    expect(flat(view)).toContain(`<div class="hint warn ts-under">Needs setup. <button type="button" class="link"`);
    const pushed: string[] = [];
    vi.stubGlobal("window", { location: { pathname: "/wrist-assistant/menus/w1" }, dispatchEvent: () => true });
    vi.stubGlobal("history", { state: null, pushState: (_s: unknown, _t: string, url: string) => { pushed.push(url); } });
    try {
      handler(view, "Open HTTP actions", "click")({});
    } finally {
      vi.unstubAllGlobals();
    }
    expect(pushed).toEqual(["/wrist-assistant/http-actions"]);
  });

  it("a stored action the library alone does not hold is not in the list; beside a catalog, not on the iPhone", () => {
    const gone = setWatchMenuActionKey(CONFIGURED, ANYWHERE, HTTP_SLOT, "entityId", "C3A0E000-0000-4000-8000-0000000000FF");
    const alone = watchCatalogWithHttpLibrary(undefined, LIBRARY)!;
    const only = { ...host(gone), targets: { ...NO_MENU_TARGETS, httpActions: alone.httpActions }, catalogKnown: false, httpLibrary: "held" as const };
    only.uiState.set("me:sel:anywhere", HTTP_SLOT);
    const text = flat(renderMenuInspector(only));
    expect(text).toContain(">Not in the list</option>");
    // With the library held, the iPhone's line is not asked for.
    expect(text).not.toContain("Open the iPhone app to list its HTTP actions here.");
    const both = { ...only, catalogKnown: true };
    expect(flat(renderMenuInspector(both))).toContain(">Not on the iPhone</option>");
  });

  it("an empty list points at the HTTP actions screen; an older integration keeps the iPhone's line", () => {
    const empty = field(inspector(NO_MENU_TARGETS, { catalogKnown: true, httpLibrary: "empty" }));
    expect(empty).toContain("No HTTP actions yet. Add one on the HTTP actions screen.");
    expect(empty).toContain("Open HTTP actions");
    const old = field(inspector(NO_MENU_TARGETS, { catalogKnown: false }));
    expect(old).toContain("Open the iPhone app to list its HTTP actions here.");
    expect(old).not.toContain("Open HTTP actions");
    // The catalog alone: the same list, no iPhone marks, only the phone's
    // own warning as the page editor shows it.
    const before = field(inspector({ ...NO_MENU_TARGETS, httpActions: CATALOG.httpActions }, { catalogKnown: true }));
    expect(before).toContain(">Outdoor Temp</option>");
    expect(before).toContain(">Garage Door (needs setup on the iPhone)</option>");
    expect(before).not.toContain("(on the iPhone)");
  });

  it("is read when a watch opens, which a return to the editor does too, and on a reconnect", () => {
    const source = readFileSync(join(__dirname, "..", "src", "watch-menus", "menu-editor.ts"), "utf8");
    expect(source.match(/void this\.loadHttpLibrary\(\);/g)).toHaveLength(2);
    expect(source).toMatch(/connectedCallback\(\): void \{[\s\S]*?this\.openWatch\(this\.watchId, true\)/);
  });

  it("the element lists the joined list, and reads the library with the integration's answer", async () => {
    const { el } = editor();
    el.catalog = CATALOG;
    const targets = () => (el.targets as () => MenuTargets).call(el);
    expect(targets().httpActions).toBe(CATALOG.httpActions);
    expect((el.viewHost as () => MenusViewHost).call(el)!.httpLibrary).toBeUndefined();
    let answer: () => Promise<unknown> = async () => ({ revision: 5, document: { actions: [{ id: PORCH, name: "Porch Temp", url: "x" }] } });
    el.hass = { user: { is_admin: true }, states: {}, connection: { sendMessagePromise: (m: { type: string }) => (m.type === "wrist_assistant/http_actions/get" ? answer() : Promise.reject(new Error("no"))) } } as unknown as HassLike;
    await (el.loadHttpLibrary as () => Promise<void>).call(el);
    expect(targets().httpActions.map((a) => a.name)).toEqual(["Porch Temp", "Open Gate", "Outdoor Temp", "HTTP Action", "Garage Door"]);
    expect((el.viewHost as () => MenusViewHost).call(el)!.httpLibrary).toBe("held");
    // A dropped socket keeps what is shown; an integration older than the
    // library has none.
    answer = () => Promise.reject(new Error("socket closed"));
    await (el.loadHttpLibrary as () => Promise<void>).call(el);
    expect(targets().httpActions[0]!.name).toBe("Porch Temp");
    answer = () => Promise.reject(Object.assign(new Error("Unknown command."), { code: "unknown_command" }));
    await (el.loadHttpLibrary as () => Promise<void>).call(el);
    expect(targets().httpActions).toBe(CATALOG.httpActions);
    answer = async () => ({ revision: 0 });
    await (el.loadHttpLibrary as () => Promise<void>).call(el);
    expect(targets().httpActions).toBe(CATALOG.httpActions);
    expect((el.viewHost as () => MenusViewHost).call(el)!.httpLibrary).toBe("empty");
  });
});
