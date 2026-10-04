// The menu editor in the complication editor's chrome, as the page editor
// wears it: the top bar, the Menus card that picks the one menu the canvas
// and the inspector show, the Slots card, the canvas with its watch chips,
// facts, zoom and hint, and the inspector's crumbs and cards. Then the watch
// screen itself: the ring placed on a screen of the watch's real proportions,
// and the page switcher drawn from the pages record.

import { html } from "lit";
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { HassLike, OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import { SECTION_COLOR } from "../src/kinds.js";
import { REFERENCE_CASE } from "../src/renderer.js";
import { SymbolBrowser } from "../src/symbols.js";
import { takeWatchMenusRecord } from "../src/watch-menus/draft.js";
import { PAGES_PATH_FROM_MENUS, WATCH_MENUS_HELP_URL } from "../src/watch-menus/hook.js";
import { ME_COLUMNS_KEY, WATCH_SWITCHER_COLORS, watchSwitcherPages } from "../src/watch-menus/menu-editor.js";
import {
  MENUS_SECTIONS,
  MENUS_ZOOM_KEY,
  MENU_CHIP_COLOR,
  MENU_SECTION_BADGES,
  MENU_STAGE_HINT,
  type MenuSwitcherPage,
  type MenusViewHost,
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
  shownMenu,
  switcherRingPoint,
} from "../src/watch-menus/menu-view.js";
import {
  ANYWHERE,
  type MenusDocument,
  setWatchMenuSlotColor,
  setWatchMenuSlotVisible,
  setWatchMenuStyle,
  watchMenuRingPoint,
  watchMenuSlots,
} from "../src/watch-menus/model.js";
import { WATCH_PAGES_PATH } from "../src/watch-pages/hook.js";
import { STAGE_ZOOM_KEY } from "../src/watch-pages/stage.js";

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

  it("says which list the Entity quick menu shows, and lists the switcher's pages read only", () => {
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
    });
    const h = host(DEFAULTS);
    h.uiState.set("me:sel:anywhere", REFRESH);
    const text = flat(renderMenuInspector(h));
    const card = (id: string) => text.slice(text.lastIndexOf("<section", text.indexOf(`data-sec=menu-editor:${id}`)));
    expect(card("slot")).toMatch(new RegExp(`^<section class="sec" data-sec=menu-editor:slot data-open=true data-help="on" style=--c:${SECTION_COLOR.content}`));
    expect(card("look")).toMatch(new RegExp(`^<section class="sec" data-sec=menu-editor:look data-open=true data-help="on" style=--c:${SECTION_COLOR.look}`));
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
    expect(bar).toContain(">Collected</span>");
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
    expect(out).toContain('class="me-dot me-page-dot"');
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
