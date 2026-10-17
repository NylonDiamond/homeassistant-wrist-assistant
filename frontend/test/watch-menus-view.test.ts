// The menu editor in the complication editor's chrome, as the page editor
// wears it: the top bar, the Menus card that picks the one menu the canvas
// and the inspector show, the labels around the watch that stand for the
// slots, the canvas with its watch chips, facts, tools, zoom and hint, and
// the inspector's crumbs and cards. Then the watch screen itself: the ring
// placed on a screen of the watch's real proportions with the menu's look,
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
  MENU_ROW_LINES,
  MENU_SECTION_BADGES,
  MENU_PICK_NOTE,
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
  MENUS_INTRO,
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
  beamArt,
  menuLook,
  playMenuOpening,
  renderMenuScreen,
  renderMenuStage,
  renderMenuStageFoot,
  renderMenuStageTools,
  switcherLook,
  switcherBubbleText,
  switcherTrackPoint,
  MENU_HOW_TO,
  renderMenuHowTo,
} from "../src/watch-menus/menu-stage.js";
import {
  ANYWHERE,
  type MenuTargets,
  type MenusDocument,
  NO_MENU_TARGETS,
  PHONE_NO_PHRASES_TEXT,
  addWatchMenuSlot,
  removeWatchMenuSlot,
  setWatchMenuActionKey,
  setWatchMenuInherits,
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
import { NEW_WATCH_TEXT, NOTHING_TO_SAVE_TEXT, START_FRESH_BUTTON } from "../src/watch-settings.js";

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
      expect(card).toContain(`>${label}</span><span class="me-menu-count">`);
      return card.indexOf(`data-menu=${id} `);
    });
    expect(at.every((p) => p > -1)).toBe(true);
    expect([...at].sort((a, b) => a - b)).toEqual(at);
    // The Anywhere menu is shown first, and only it is lit.
    expect(row(card, "data-menu", "anywhere", "me-menu-row")).toMatch(/^<div class="layer me-menu-row hl"/);
    expect(row(card, "data-menu", "switcher", "me-menu-row")).toMatch(/^<div class="layer me-menu-row "/);
    // Each row has a small ring, its count beside its name and one plain
    // line saying when it opens.
    expect(count(card, `class="thumb me-ring-thumb"`)).toBe(3);
    expect(card).toContain(`<span class="me-menu-count">${ANYWHERE_COUNT} slots</span>`);
    expect(card).toContain(`<span class="me-menu-count">5 slots</span>`);
    expect(card).toContain(`<span class="me-menu-count">1 page</span>`);
    expect(card).toContain("<small>Opens on any screen. Your shortcuts for the whole watch.</small>");
    expect(card).toContain("<small>Opens over a tile. Controls for that kind of thing.</small>");
    expect(card).toContain("<small>Jumps to another page. Set how each page shows.</small>");
    expect(Object.values(MENU_ROW_LINES).every((line) => card.includes(`<small>${line}</small>`))).toBe(true);
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

describe("the labels around the watch", () => {
  /** The markup of one place's label, by its place. */
  const place = (text: string, position: string) => {
    const at = text.search(new RegExp(`data-place=${position}\\s`));
    if (at < 0) return "";
    const start = text.lastIndexOf(`<div class=ms-place`, at);
    const next = text.indexOf(`<div class=ms-place`, at);
    return text.slice(start, next < 0 ? undefined : next);
  };

  it("replace the Slots card: one label per place, each slot a button with its color, name and action", () => {
    const h = host(DEFAULTS);
    expect(flat(renderSlotsCard(h))).toBe("");
    const text = flat(renderMenuStage(h));
    expect(count(text, "<div class=ms-place ")).toBe(8);
    expect(count(text, "<button type=\"button\" class=ms-label")).toBe(ANYWHERE_COUNT);
    const refresh = place(text, "topLeft");
    expect(refresh).toContain("ms-at-topLeft ms-left");
    expect(refresh).toContain(`data-slot=${REFRESH}`);
    expect(refresh).toContain("style=--k:#4DBFE0");
    expect(refresh).toContain("<b>Refresh</b><small>Refresh</small>");
    expect(place(text, "topCenter")).toContain("ms-at-topCenter ms-top");
    expect(place(text, "rightCenter")).toContain("ms-at-rightCenter ms-right");
    expect(place(text, "bottomCenter")).toContain("ms-at-bottomCenter ms-bottom");
    // The watch itself sits in the same grid.
    expect(text).toContain(`<div class="ms-watch">`);
    expect(count(text, `class="wa-watch"`)).toBe(1);
  });

  it("light the selected slot's label and its dot, mark a hidden slot, and pick a slot with a click", () => {
    const h = host(setWatchMenuSlotVisible(DEFAULTS, ANYWHERE, INFO, false));
    h.uiState.set("me:sel:anywhere", REFRESH);
    const text = flat(renderMenuStage(h));
    expect(place(text, "topLeft")).toMatch(/class=ms-label on data-slot=/);
    expect(place(text, "topLeft")).toContain("aria-pressed=true");
    expect(place(text, "rightCenter")).toMatch(/class=ms-label off data-slot=/);
    expect(place(text, "rightCenter")).toContain(", hidden</small>");
    // The ring lights the same slot.
    expect(flat(renderMenuScreen(h))).toMatch(/class=me-dot on ms-active style=/);
    handler(renderMenuStage(h), `data-slot=${INFO}`, "click")(new Event("click"));
    expect(h.uiState.get("me:sel:anywhere")).toBe(INFO);
  });

  it("offer Add a slot at a free place, and say which places come from the All menu", () => {
    const edits: string[] = [];
    const free = removeWatchMenuSlot(DEFAULTS, ANYWHERE, REFRESH);
    const h = { ...host(free), edit: () => { edits.push("add"); return true; } } as MenusViewHost;
    const text = flat(renderMenuStage(h));
    const left = place(text, "topLeft");
    expect(left).toContain("class=\"ms-label ms-add\"");
    expect(left).toContain("aria-label=Add a slot at Top Left");
    expect(left).toContain("<b>Add a slot</b>");
    handler(renderMenuStage(h), "Add a slot at Top Left", "click")(new Event("click"));
    expect(edits).toEqual(["add"]);
    // The Light menu with the All slots: an All slot at a place it leaves
    // free is a dashed label, not a button.
    const all = addWatchMenuSlot(DEFAULTS, { list: "domain", domain: "all" }, { position: "rightCenter" }).document;
    const light = host(setWatchMenuInherits(all, "light", true));
    selectMenu(light, "entity");
    const entity = place(flat(renderMenuStage(light)), "rightCenter");
    expect(entity).toContain(`<span class="ms-label ms-inh"`);
    expect(entity).toContain("<small>From the All menu</small>");
    expect(entity).not.toContain("<button");
  });

  it("keep the Entity quick menu's list in the head facts and its Change under the hint, and the switcher's Pages card on the left", () => {
    const h = host(DEFAULTS, [KITCHEN]);
    selectMenu(h, "entity");
    expect(flat(renderSlotsCard(h))).toBe("");
    expect(flat(renderMenuStageFoot(h))).toBe("");
    const light = watchMenuSlots(DEFAULTS, { list: "domain", domain: "light" })[0]!;
    h.uiState.set("me:sel:domain:light", light.id as string);
    const foot = flat(renderMenuStageFoot(h));
    expect(foot).toContain("Change the type or entity</button>");
    handler(renderMenuStageFoot(h), "Change the type", "click")(new Event("click"));
    expect(h.uiState.get("me:sel:domain:light")).toBeUndefined();
    selectMenu(h, "switcher");
    const switcher = flat(renderSlotsCard(h));
    expect(switcher).toContain(`<span class="lc-title">Pages</span>`);
    expect(switcher).toContain("<small>Shown by name</small>");
    expect(switcher).not.toContain(`class="acts"`);
    // The switcher has no labels round its watch: its pages are picked in
    // the card.
    expect(flat(renderMenuStage(h))).not.toContain("ms-place");
  });

  it("put Add and Play opening in the stage tools, Add off with the same reasons as before", () => {
    const h = host(DEFAULTS);
    let tools = flat(renderMenuStageTools(h));
    expect(tools).toContain(`<button class="tb ms-add-slot" aria-label="Add slot" ?disabled=true`);
    expect(tools).toContain("title=Every place around the ring is taken.");
    // The defaults open with no entrance: nothing to play.
    expect(tools).not.toContain("Play opening");
    const free = host(setWatchMenuStyle(removeWatchMenuSlot(DEFAULTS, ANYWHERE, REFRESH), "quickAction", "entranceStyle", "spring"));
    tools = flat(renderMenuStageTools(free));
    expect(tools).toContain(`aria-label="Add slot" ?disabled=false`);
    expect(tools).toContain("title=Add a slot at the first free place");
    expect(tools).toContain(`<span class="word">Play opening</span>`);
    selectMenu(free, "switcher");
    tools = flat(renderMenuStageTools(free));
    expect(tools).not.toContain("ms-add-slot");
    expect(tools).toContain("Play opening");
  });
});

describe("the menu's look on the watch", () => {
  const styled = (changes: Record<string, unknown>, section: "quickAction" | "pageSwitcher" = "quickAction") =>
    Object.entries(changes).reduce((d, [k, v]) => setWatchMenuStyle(d, section, k, v), DEFAULTS);
  const screenTag = (text: string) => text.slice(text.indexOf("<div class=me-screen"), text.indexOf("<div class=\"ms-backdrop\""));

  it("reads the style keys as the watch does, defaults filled in and numbers held to their range", () => {
    expect(menuLook(DEFAULTS)).toEqual({
      glass: false, neon: false, labels: false, finger: true, entrance: "none", dim: 1,
      beam: "none", beamColor: "#FFFFFF", beamIntensity: 0.5, glow: 0.5,
    });
    const look = menuLook(styled({ showIconBubble: true, showNeonOutline: true, showContextLabel: true, entranceStyle: "popIn", backgroundDim: 0.3, beamStyle: "auroraWash", beamColor: "#E76F51", glowIntensity: 1 }));
    expect(look).toMatchObject({ glass: true, neon: true, labels: true, entrance: "popIn", dim: 0.3, beam: "auroraWash", beamColor: "#E76F51", glow: 1 });
    expect(switcherLook(DEFAULTS)).toEqual({ glow: 0.5, scale: 1.2 });
    expect(switcherLook(styled({ selectedScale: 1.5, glowIntensity: 0 }, "pageSwitcher"))).toEqual({ glow: 0, scale: 1.5 });
  });

  it("draws the stand-in page under a veil as dark as Background Dim, and switches each effect on the screen", () => {
    let tag = screenTag(flat(renderMenuScreen(host(DEFAULTS))));
    expect(tag).toContain("ms-enter-none ms-finger");
    expect(tag).not.toContain("ms-neon");
    expect(tag).toContain("--ms-veil:0.85");
    expect(flat(renderMenuScreen(host(DEFAULTS)))).toContain(`<svg class="ms-page"`);
    tag = screenTag(flat(renderMenuScreen(host(styled({ backgroundDim: 0.4, showIconBubble: true, showNeonOutline: true, showFingerShadow: false, glowIntensity: 1 })))));
    expect(tag).toContain("ms-glass ms-neon");
    expect(tag).not.toContain("ms-finger");
    expect(tag).toContain("--ms-veil:0.34");
    expect(tag).toContain("--ms-g-r:15px;--ms-g-a:60%");
  });

  it("names each slot under its dot with Icon Labels, and casts each dot's shadow away from the finger", () => {
    const plain = flat(renderMenuScreen(host(DEFAULTS)));
    expect(plain).not.toContain(`class="ms-name"`);
    // Finger Shadow is on by default: the top left dot's shadow falls up
    // and to the left.
    expect(plain).toMatch(/--sx:-\d[\d.]*px;--sy:-\d[\d.]*px/);
    const named = flat(renderMenuScreen(host(styled({ showContextLabel: true, showFingerShadow: false }))));
    expect(count(named, `class="ms-name"`)).toBe(ANYWHERE_COUNT);
    expect(named).toContain(">Refresh</span>");
    expect(named).not.toContain("--sx:");
  });

  it("points the beam at the selected slot, else the top one, in its color and intensity", () => {
    expect(flat(renderMenuScreen(host(DEFAULTS)))).not.toContain(`class="ms-beam"`);
    const screen = { width: 200, height: 200 };
    const look = (beam: string) => ({ ...menuLook(DEFAULTS), beam, beamColor: "#E76F51", beamIntensity: 1 }) as ReturnType<typeof menuLook>;
    const wedge = flat(beamArt(look("sectorWedge"), screen, { x: 100, y: 28 }));
    expect(count(wedge, "<polygon")).toBe(2);
    expect(wedge).toContain("fill=#E76F51 fill-opacity=0.5");
    expect(count(flat(beamArt(look("ripplePulse"), screen, { x: 100, y: 28 })), "fill=\"none\" stroke=#E76F51")).toBe(2);
    expect(flat(beamArt(look("radiantBloom"), screen, { x: 100, y: 28 }))).toContain(`fill="url(#ms-bloom)"`);
    expect(flat(beamArt(look("auroraWash"), screen, { x: 100, y: 28 }))).toContain(`fill="url(#ms-wash)"`);
    expect(flat(beamArt(look("wakeWave"), screen, { x: 100, y: 28 }))).toContain("<line x1=100 y1=100 x2=100 y2=28");
    expect(flat(beamArt(look("none"), screen, { x: 100, y: 28 }))).toBe("");
    // On the watch: toward the top slot, then toward the selected one.
    const h = host(styled({ beamStyle: "sectorWedge" }), [], 1);
    const top = watchMenuRingPoint("topCenter")!;
    expect(flat(renderMenuScreen(h))).toMatch(new RegExp(`class=me-dot ms-active style=left:50%;top:${Math.round(menuScreenPoint({ width: 208, height: 248 }, top).y * 10000) / 100}%`));
    h.uiState.set("me:sel:anywhere", REFRESH);
    expect(flat(renderMenuScreen(h))).toMatch(/class=me-dot on ms-active style=left:2/);
  });

  it("replays the opening on every Play, flipping between two equal animations, and only for a while", () => {
    const h = host(styled({ entranceStyle: "spring" }));
    expect(screenTag(flat(renderMenuScreen(h)))).toContain("ms-enter-spring");
    expect(screenTag(flat(renderMenuScreen(h)))).not.toContain("ms-play-");
    playMenuOpening(h);
    expect(screenTag(flat(renderMenuScreen(h)))).toContain("ms-play-a");
    playMenuOpening(h);
    expect(screenTag(flat(renderMenuScreen(h)))).toContain("ms-play-b");
    // Another menu does not play the Anywhere menu's opening.
    selectMenu(h, "switcher");
    expect(screenTag(flat(renderMenuScreen(h)))).not.toContain("ms-play-");
    selectMenu(h, "anywhere");
    vi.useFakeTimers();
    try {
      vi.setSystemTime(Date.now() + 5000);
      expect(screenTag(flat(renderMenuScreen(h)))).not.toContain("ms-play-");
    } finally {
      vi.useRealTimers();
    }
    // With no entrance there is nothing to play.
    const none = host(DEFAULTS);
    playMenuOpening(none);
    expect(screenTag(flat(renderMenuScreen(none)))).not.toContain("ms-play-");
  });

  it("draws the switcher's pages with their Glow, the picked page (else the first) at Selected Scale", () => {
    const pages: MenuSwitcherPage[] = [KITCHEN, { id: "b", name: "Garden", icon: "leaf", color: "#00FF00" }];
    const h = host(styled({ selectedScale: 1.5, glowIntensity: 1 }, "pageSwitcher"), pages);
    selectMenu(h, "switcher");
    let out = flat(renderMenuScreen(h));
    expect(out).toContain("ms-switcher");
    // The page the finger points at: 70% of Glow, the wider glow, Selected
    // Scale. The rest: 15%.
    expect(out).toMatch(/class=ms-sw ms-active style=[^>]*--ms-ga:70%;--ms-gr:45;--ms-k:1.5[^>]*title=Kitchen/);
    expect(out).toMatch(/class=ms-sw style=[^>]*--ms-ga:15%;--ms-gr:30;--ms-k:1[^>]*title=Garden/);
    selectSwitcherPage(h, "b");
    out = flat(renderMenuScreen(h));
    expect(out).toMatch(/class=ms-sw ms-active style=[^>]*title=Garden/);
    // The page you are on (the first) keeps its ring and 40% of Glow.
    expect(out).toMatch(/class=ms-sw ms-current style=[^>]*--ms-ga:40%[^>]*title=Kitchen/);
    // Its name at the top of the screen.
    expect(out).toContain(">Garden</span>");
  });
});

describe("the inspector", () => {
  it("names the menu with no slot selected, and shows its own settings", () => {
    const text = flat(renderMenuInspector(host(DEFAULTS)));
    const head = text.slice(text.indexOf(`<div class="insp-head">`), text.indexOf(`<div class="insp-body">`));
    expect(head).toContain(`<span class="kchip" style=--k:${MENU_CHIP_COLOR}>Menu</span><span class="nm" title=Anywhere menu>Anywhere menu</span>`);
    expect(head).toContain(">Collapse all</button>");
    expect(text).toContain("data-sec=menu-editor:style-anywhere");
    expect(text).toContain("data-sec=menu-editor:motion-anywhere");
    expect(text.indexOf("<h4>Look</h4>")).toBeLessThan(text.indexOf("<h4>Motion</h4>"));
    expect(text).toContain(`style=--c:${SECTION_COLOR.look}`);
    expect(text).not.toContain("name-sec");
    expect(text).toContain(`<p class="me-menu-note me-pick-note">${MENU_PICK_NOTE}</p>`);
    expect(MENU_PICK_NOTE).toBe("Click a slot on the watch to change what it does.");
  });

  it("crumbs a selected slot as Menu › SLOT › name, in the slot's color, over its Name, What it does, Where, Icon and color and Shows on cards", () => {
    const h = host(DEFAULTS);
    h.uiState.set("me:sel:anywhere", REFRESH);
    const text = flat(renderMenuInspector(h));
    const head = text.slice(text.indexOf(`<div class="insp-head">`), text.indexOf(`<div class="insp-body">`));
    expect(head).toContain(`<button class="root" title="Edit the menu"`);
    expect(head).toContain(">Anywhere menu</button><span class=\"sep\">›</span><span class=\"kchip\" style=--k:#4DBFE0>Slot</span><span class=\"nm\" title=Refresh>Refresh</span>");
    const order = [`class="sec name-sec"`, "data-sec=menu-editor:slot ", "data-sec=menu-editor:where ", "data-sec=menu-editor:look ", "data-sec=menu-editor:shows ", ">Remove</span>"]
      .map((part) => text.indexOf(part));
    expect(order.every((p) => p > -1)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    for (const title of ["What it does", "Where", "Icon and color", "Shows on"]) expect(text, title).toContain(`<h4>${title}</h4>`);
    expect(text).toContain(`<span class="me-name" title="A slot is named by what it runs, else by its action">Refresh</span>`);
    // The slot's controls, every one kept: the action tiles, the place grid
    // and Shown, the icon and color, the types it shows over.
    for (const label of [`role="group" aria-label="Place on the ring"`, ">Shown on the watch<", "data-action=refresh", ">Icon<", ">Color<", ">Show on<", ">Remove</span>"]) {
      expect(text, label).toContain(label);
    }
    // Escape, or the crumb, lets go of the slot.
    expect(deselectMenuSlot(h)).toBe(true);
    expect(flat(renderMenuInspector(h))).toContain("data-sec=menu-editor:style-anywhere");
    expect(deselectMenuSlot(h)).toBe(false);
  });

  it("gives each card the complication editor's badge", () => {
    expect(MENU_SECTION_BADGES).toEqual({
      name: { color: SECTION_COLOR.place, icon: "text" },
      slot: { color: SECTION_COLOR.content, icon: "content" },
      where: { color: SECTION_COLOR.position, icon: "place" },
      look: { color: SECTION_COLOR.look, icon: "look" },
      shows: { color: SECTION_COLOR.states, icon: "states" },
      menu: { color: SECTION_COLOR.content, icon: "content" },
      style: { color: SECTION_COLOR.look, icon: "look" },
      motion: { color: SECTION_COLOR.look, icon: "radial" },
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
    expect(card("where").startsWith(`<section class="sec" data-sec=menu-editor:where data-open=true data-help="on" style=--c:${SECTION_COLOR.position}`)).toBe(true);
    expect(card("shows").startsWith(`<section class="sec" data-sec=menu-editor:shows data-open=true data-help="on" style=--c:${SECTION_COLOR.states}`)).toBe(true);
    expect(text).toContain(`<section class="sec name-sec" data-open="true" style=--c:${SECTION_COLOR.place}>`);
  });

  it("holds the Entity quick menu's type and the switcher's style in their own cards", () => {
    const h = host(DEFAULTS);
    selectMenu(h, "entity");
    const entity = flat(renderMenuInspector(h));
    expect(entity).toContain("data-sec=menu-editor:menu");
    expect(entity).toContain(`style=--c:${SECTION_COLOR.content}`);
    expect(entity).toContain("<h4>Which menu</h4>");
    expect(entity).toContain("By type");
    expect(entity).toContain(">More types<");
    expect(entity).toContain(">Fill gaps with the All menu<");
    selectMenu(h, "switcher");
    const switcher = flat(renderMenuInspector(h));
    expect(switcher).toContain("data-sec=menu-editor:style-switcher");
    expect(switcher).toContain("<h4>Look</h4>");
    expect(switcher).toContain(">Glow<");
    expect(switcher).toContain(">Picked page size<");
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
  it("has the way back, the sync pill, ···, Save, when it was saved, Pages and Watch settings, and no ?", () => {
    const text = editor().whole();
    const bar = text.slice(text.indexOf(`<div class="wa-bar`), text.indexOf(`<div class="layout`));
    const order = [
      `class="tb-btn tb-back"`, `class="picker me-watch-picker"`, `class="tb-sync ok"`, `class="tb-btn tb-more"`,
      `class="primary save `, `<span class="tb-saved"`, `class="tb-btn tb-pages"`, `class="tb-btn tb-watch"`,
    ];
    for (const part of order) expect(bar, part).toContain(part);
    const places = order.map((part) => bar.indexOf(part));
    expect([...places].sort((a, b) => a - b)).toEqual(places);
    expect(bar).toContain(">Complications</span>");
    expect(bar).toContain(">Synced</span>");
    expect(bar).toContain(">Saved 2 min ago</span>");
    expect(bar).toContain(">Pages</span>");
    expect(bar).toContain(`aria-label="Watch menus"`);
    // The panel's Help sheet links the screen's guide; the bar has no ?.
    expect(bar).not.toContain(`class="help"`);
    // Undo and Redo are in the canvas head; the old title and toolbar are gone.
    expect(bar).not.toContain(`aria-label="Undo"`);
    expect(text).not.toContain(`class="pe-tools"`);
    expect(text).not.toContain("Watch menus</h2>");
    expect(WATCH_MENUS_HELP_URL).toBe("https://docs.wrist-assistant.com/watch-app/quick-menu/");
    expect(PAGES_PATH_FROM_MENUS).toBe(WATCH_PAGES_PATH);
  });

  it("says Waiting while no device has collected the save, and opens the ··· menu with Discard edits", () => {
    const { el, whole } = editor();
    el.record = { ...(el.record as WatchConfigRecord), delivered_revision: 3 };
    el.topMenuOpen = true;
    const text = whole();
    expect(text).toContain(`class="tb-sync warn"`);
    expect(text).toContain(">Waiting for the watch</span>");
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
    const bar = (t: string) => t.slice(t.indexOf(`<div class="wa-bar`), t.indexOf(`</div>`, t.indexOf(`class="tb-btn tb-watch"`)));
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

  it("offers no Start for a watch with no menus yet: Save is greyed out and says why", () => {
    const { el, whole } = editor(0);
    el.topMenuOpen = true;
    const text = whole();
    const bar = text.slice(text.indexOf(`<div class="wa-bar`), text.indexOf(`<div class="pe-note nw-banner`));
    expect(bar).not.toContain("Start with");
    expect(bar).not.toContain(START_FRESH_BUTTON);
    expect(bar).toMatch(/<button class="row" role="menuitem" \?disabled=true\s+title=Go back to the defaults/);
    expect(bar).toContain(`class="primary save " ?disabled=true`);
    expect(bar).toContain(`<span>${NOTHING_TO_SAVE_TEXT}</span>`);
    expect(bar).not.toContain("tb-sync");
    expect(text).toContain(NEW_WATCH_TEXT);
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
    // No Slots card: the slots are the labels around the watch.
    expect(text).not.toContain(`class="card lc me-slots-card"`);
    expect(text).toContain("<div class=ms-place ");
    expect(text).toContain(`<button class="tb ms-add-slot"`);
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
    // The size is said in the head over the stage, not in the strip.
    expect(text).toContain(`8 slots · ${REFERENCE_CASE.label}`);
    expect(text).not.toContain(`<span class="word keep">${REFERENCE_CASE.label}</span>`);
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

describe("a click on the blank stage", () => {
  /** A stand-in element: matches the selector when it names `tag` or `cls`. */
  const node = (tag: string, cls = "") => ({ matches: (sel: string) => sel.split(",").map((x) => x.trim()).some((x) => x === tag || (cls !== "" && x === `.${cls}`)) });
  const click = (path: object[]) => {
    const stage = node("div", "stage-area");
    return { composedPath: () => [...path, stage, node("div", "canvas-card")], currentTarget: stage } as unknown as MouseEvent;
  };

  it("lets go of the slot on the watch's screen or the ground, and keeps it on a dot or a tool", () => {
    const { el } = editor();
    const host = (el.viewHost as () => MenusViewHost).call(el);
    const onStageClick = el.onStageClick as (e: MouseEvent) => void;
    const picked = () => host.uiState.get("me:sel:anywhere");
    host.uiState.set("me:sel:anywhere", REFRESH);
    onStageClick(click([node("button", "me-dot")]));
    expect(picked()).toBe(REFRESH);
    onStageClick(click([node("svg"), node("div", "stage-tools"), node("div", "me-stage-body")].map((n, i) => i === 1 ? { matches: (sel: string) => sel.includes("[role=toolbar]") } : n)));
    expect(picked()).toBe(REFRESH);
    onStageClick(click([node("svg", "me-screen-bg"), node("div", "me-screen"), node("div", "me-stage-body")]));
    expect(picked()).toBeUndefined();
    host.uiState.set("me:sel:anywhere", REFRESH);
    onStageClick(click([]));
    expect(picked()).toBeUndefined();
  });
});

describe("how each menu opens", () => {
  it("says above the watch how the shown menu opens and what it is for, and the Menus card says what the page is for", () => {
    const h = host(DEFAULTS);
    let out = flat(renderMenuHowTo(h));
    expect(out).toContain("How it opens");
    expect(out).toContain(MENU_HOW_TO.anywhere.open);
    expect(out).toContain(MENU_HOW_TO.anywhere.use);
    selectMenu(h, "entity");
    expect(flat(renderMenuHowTo(h))).toContain("Touch and hold a tile");
    selectMenu(h, "switcher");
    out = flat(renderMenuHowTo(h));
    expect(out).toContain("slide to its Pages slot");
    expect(out).not.toMatch(/pull down/i);
    expect(flat(renderMenusCard(host(DEFAULTS)))).toContain(`<p class="me-intro">${MENUS_INTRO}</p>`);
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
    // A page by text shows its first four letters; a page by icon, its icon.
    expect(out).toMatch(/title=Kitchen[^>]*>[\s\S]*?<span class="ms-sw-text">Kitc<\/span>/);
    expect(out).toMatch(/title=Garden[^>]*>\s*<i class="ms-sw-glow"><\/i><i class="ms-sw-disc"><\/i>(?!<span class="ms-sw-text">)/);
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

  it("places the switcher's pages on the watch's track near the screen's edge", () => {
    // The 45 mm screen the watch measures from: scales of 1.
    const screen = { width: 198, height: 242 };
    expect(switcherTrackPoint(screen, 0, 1)).toEqual({ x: 99, y: 38 });
    expect(switcherTrackPoint(screen, 0, 8)).toEqual({ x: 99, y: 38 });
    // Counterclockwise: the second of four is on the left, the fourth on the right.
    const left = switcherTrackPoint(screen, 1, 4);
    const right = switcherTrackPoint(screen, 3, 4);
    expect(left.x).toBeLessThan(99);
    expect(right.x).toBeGreaterThan(99);
    expect(left.y).toBeCloseTo(right.y, 5);
    // The bottom of four sits under the centre, near the bottom edge.
    const bottom = switcherTrackPoint(screen, 2, 4);
    expect(bottom.x).toBeCloseTo(99, 5);
    expect(bottom.y).toBeCloseTo(242 - 30 + 8, 5);
    expect(switcherBubbleText("New Page 1")).toBe("New");
    expect(switcherBubbleText("Lights")).toBe("Ligh");
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
    expect(flat(renderMenuScreen(h))).toMatch(/class=ms-sw ms-active style=[^>]*title=Living room /);
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
    expect(text).toMatch(/<button class="row" role="menuitem" \?disabled=false\s+title=Go back to the copy Home Assistant holds/);
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
    expect(text).toMatch(/title=Home[^>]*>[\s\S]*?<span class="ms-sw-text">Fron<\/span>/);
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
