// The Menus tab, drawn from the library: the board (a row per menu in two
// sections, a round dot per device) or one card per menu with its name, its
// slots, its picture and a round tick per device; a dot or a tick moves that
// device onto the menu. A focused device shows its two menus first, then the
// rest. New menu makes a menu no device uses, the app's
// own for its kind, and moves no device; a menu no device uses can be
// deleted. Plus the menu editor's ask that opens it on one menu.

import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { laterHidden, laterToast, resetLaterForTest, sendLaterNow, undoLater } from "../src/delete-later.js";

import { libraryOf, type LibraryMenu } from "../src/library/model.js";
import "../src/watch-menus/all-menus.js";
import {
  ALL_MENUS_LEAD,
  MENU_SECTION_TITLES,
  MENUS_BOARD_FOOT,
  MENUS_BOARD_HINT,
  MENUS_FOOT,
  allMenusLead,
  menuDetail,
  menuSections,
  menusDeviceFoot,
  menusEmptyText,
  NEW_MENU_ADMIN_TEXT,
  menuInUseText,
  newMenuMadeText,
  newMenuName,
  newMenuSections,
  newMenuText,
  openMenuDevice,
  restMenus,
  shownMenus,
} from "../src/watch-menus/all-menus-model.js";
import { shownMenu, showMenuSettings, selectedMenuSlot } from "../src/watch-menus/menu-view.js";
import { type MenusDocument, watchMenusDefaults } from "../src/watch-menus/model.js";
import { libraryEditTitle } from "../src/watch-pages/all-pages-model.js";
import { CHEN, CHEN_MENU, DEVICES, HOME_MENU, JESSE, PHONE, QUICK, SPARE, summary } from "./library-fixture.js";
import { fakeHome, standUp } from "./library-tab-fake.js";

const DEFAULTS = JSON.parse(readFileSync(join(__dirname, "fixtures-menus", "01-defaults.json"), "utf8")) as MenusDocument;
const lib = () => libraryOf(summary());
const menu = (id: string) => lib().menus.find((m) => m.id === id)!;
const [, JESSE_D, PHONE_D] = DEVICES as [typeof DEVICES[0], typeof DEVICES[0], typeof DEVICES[0]];

describe("the Menus tab's cards", () => {
  it("are one per library menu, each with its name, in two sections, Anywhere menus first", () => {
    const sections = menuSections(shownMenus(lib()));
    expect(sections.map((s) => [MENU_SECTION_TITLES[s.unit], s.menus.map((m) => m.name)])).toEqual([
      ["Anywhere menus", ["Home menu", "Chen's menu"]],
      ["Entity quick menus", ["Entity quick menu", "Entity quick menu"]],
    ]);
  });

  it("keep both sections when one has no menu", () => {
    // "chen" finds Chen's menu by name, and the Entity quick menu Chen Watch uses.
    expect(menuSections(shownMenus(lib(), "chen", DEVICES)).map((s) => s.menus.map((m) => m.id))).toEqual([[CHEN_MENU], [QUICK]]);
    expect(menuSections(shownMenus(lib(), "home")).map((s) => s.menus.length)).toEqual([1, 0]);
    expect(menuSections([]).map((s) => s.unit)).toEqual(["anywhere", "entity"]);
  });

  it("count their slots as the editor's Menus row does", () => {
    expect(menuDetail(menu(HOME_MENU))).toBe("0 slots");
    const full: LibraryMenu = { ...menu(HOME_MENU), sections: { quickAction: DEFAULTS.quickAction } };
    expect(menuDetail(full)).toMatch(/^\d+ slots$/);
  });

  it("are found by the menu's name or a device that uses it", () => {
    expect(shownMenus(lib(), "home").map((m) => m.id)).toEqual([HOME_MENU]);
    expect(shownMenus(lib(), "iphone 15", DEVICES).map((m) => m.id)).toEqual([HOME_MENU, QUICK]);
  });

  it("draw their picture for the first watch that uses the menu, else the first device", () => {
    expect(openMenuDevice(menu(HOME_MENU), DEVICES)?.ownerId).toBe(JESSE);
    expect(openMenuDevice(menu(SPARE), DEVICES)).toBeUndefined();
  });
});

describe("a device's menus", () => {
  it("leave the rest of the library for Not on this watch", () => {
    expect(restMenus(lib(), CHEN, "", DEVICES).map((m) => m.id)).toEqual([HOME_MENU, SPARE]);
    expect(restMenus(lib(), CHEN, "home", DEVICES).map((m) => m.id)).toEqual([HOME_MENU]);
  });
});

describe("New menu", () => {
  it("offers a name not taken yet for the kind of menu", () => {
    expect(newMenuName(lib(), "anywhere")).toBe("New menu");
    expect(newMenuName(lib(), "entity")).toBe("New quick menu");
    const withNew = summary();
    withNew.menus["X"] = { name: "New quick menu", kind: "entity", sections: {}, owners: [] };
    expect(newMenuName(libraryOf(withNew), "entity")).toBe("New quick menu 2");
  });

  it("starts as the app's own menu for the unit, exactly the keys a menus document holds for it", () => {
    const defaults = watchMenusDefaults();
    const anywhere = newMenuSections("anywhere");
    expect(Object.keys(anywhere).sort()).toEqual(["pageSwitcher", "quickAction"]);
    expect(anywhere.quickAction).toEqual(defaults.quickAction);
    expect(anywhere.pageSwitcher).toEqual(defaults.pageSwitcher);
    expect(newMenuSections("entity")).toEqual({ entityRadial: defaults.entityRadial });
    // A fresh copy each time, never the table itself.
    expect(newMenuSections("entity").entityRadial).not.toBe(newMenuSections("entity").entityRadial);
    // A key the defaults lack is left out, never sent empty.
    expect(newMenuSections("anywhere", { schemaVersion: 1, quickAction: { slots: [] } })).toEqual({ quickAction: { slots: [] } });
  });

  it("says no device uses it until one is ticked", () => {
    expect(newMenuText("entity")).toBe("It starts as the app's own Entity quick menu, on no device yet.");
    expect(newMenuMadeText("Kitchen menu")).toBe("Made Kitchen menu, on no device yet. Pick a device for it any time.");
  });
});

describe("the tab's words", () => {
  it("count the menus in the home and say what a device uses", () => {
    expect(allMenusLead(4)).toBe("4 menus in your home. Each device uses one Anywhere menu and one Entity quick menu.");
    expect(allMenusLead(1)).toBe(`1 menu in your home. ${ALL_MENUS_LEAD}`);
    expect(MENUS_FOOT).toBe("Click a menu to edit it. Tick a device on a card and that device uses this menu from now on. New menu starts on no device yet.");
    expect(MENUS_BOARD_FOOT).toBe("Click a menu to edit it. Pick a dot and that device uses this menu from now on. Click a device's name to see its menus first.");
    expect(MENUS_BOARD_HINT).toBe("Each device uses one of each kind. Pick a dot to switch.");
    expect(menusDeviceFoot(PHONE_D)).toBe("Pick which menu this iPhone uses. Click a menu to edit it.");
    expect(menusEmptyText([], "")).toBe("No watch or iPhone has connected yet. Pair one on the Home tab.");
    expect(menusEmptyText(DEVICES, "zz")).toBe("No menu or device has that name.");
    for (const text of [allMenusLead(2), MENUS_FOOT, MENUS_BOARD_FOOT, MENUS_BOARD_HINT, menusDeviceFoot(JESSE_D), libraryEditTitle("A"), newMenuText("anywhere"), newMenuMadeText("A"), NEW_MENU_ADMIN_TEXT]) {
      expect(text).not.toMatch(/[–—]| - /);
      expect(text).not.toMatch(/[Ll]ink|Same as/);
    }
  });
});

describe("the Menus tab", () => {
  afterEach(resetLaterForTest);

  function tab(admin = true) {
    const home = fakeHome(admin);
    const opened: [string, string][] = [];
    const library: (string | [string, string])[] = [];
    const t = standUp("wa-all-menus", home, {
      onOpen: (o: string, k: string) => opened.push([o, k]),
      onOpenLibrary: (id: string, from?: string) => library.push(from === undefined ? id : [id, from]),
    });
    const sentOf = (type: string) => home.sent.filter((m) => m.type === `wrist_assistant/${type}`);
    const libNow = () => (t.el.lib as { library: { menus: LibraryMenu[] } }).library;
    return { ...t, home, opened, library, sentOf, libNow };
  }

  /** Every device, on the board or as cards. The choice is kept across
   * tests, as in the panel. */
  function show(t: ReturnType<typeof tab>, view: "board" | "cards" = "cards", focus?: string) {
    t.el.focusOwner = undefined;
    t.call("setView", view);
    t.el.focusOwner = focus;
  }

  it("draws the board by default: a row per menu in two sections, a round dot per device, and Delete on every row", async () => {
    const t = tab();
    show(t, "board");
    await t.ready();
    const text = t.whole();
    expect(text).toContain(`<table class="bd `);
    expect(text.split(`<tr class=bd-row `).length - 1).toBe(4);
    expect(text).toContain("Anywhere menus");
    expect(text).toContain("Entity quick menus");
    expect(text).toContain(MENUS_BOARD_HINT);
    expect(text).toContain(MENUS_BOARD_FOOT);
    expect(text).toMatch(/bd-box ticked rd/);
    // A dot not taken says which menu it replaces there.
    expect(text).toContain("Use this menu on Chen Watch. Replaces Chen's menu there.");
    expect(text.split(`aria-label=Delete `).length - 1).toBe(4);
    for (const gone of ["pk-tab", ">Device<", "Link", "Same as"]) expect(text).not.toContain(gone);
  });

  it("draws a card per menu with its name and round ticks under Used by, and no Devices, Link or Same as", async () => {
    const t = tab();
    show(t);
    await t.ready();
    const text = t.whole();
    expect(text).toContain("4 menus in your home.");
    expect(text).toContain(`<b class="ap-name">Home menu</b>`);
    expect(text).toContain(`<b class="ap-name">Chen's menu</b>`);
    expect(text).toContain("Anywhere menus");
    expect(text).toContain("Entity quick menus");
    expect(text).toContain("Used by");
    expect(text).toContain(" rd ");
    expect(text).toContain("New menu");
    expect(text).toContain("Search by menu or device");
    expect(text).not.toContain("Multi select");
    for (const gone of ["ap-dev-open", ">Devices<", "Link", "Same as", "Not linked"]) expect(text).not.toContain(gone);
    // Delete on every card's name row, as a Complications card has it.
    expect(text.split(`class=ap-del`).length - 1).toBe(4);
  });

  it("asks before a delete, and says how to free a menu a device uses", async () => {
    const t = tab();
    show(t);
    await t.ready();
    t.el.deleteAsk = SPARE;
    expect(t.whole()).toContain("It is on no device yet. You can undo it for 10 seconds after.");
    expect(t.whole()).toContain(">Really delete<");
    t.el.deleteAsk = HOME_MENU;
    const busy = t.whole();
    expect(busy).toContain("Home menu is in use.");
    expect(busy).toMatch(/uses? it\. To delete it, pick another menu for (that device|each of them) first\./);
    expect(busy).not.toContain(">Really delete<");
    expect(busy).toContain(">Close<");
    expect(menuInUseText(["Chen Watch"])).toBe("Chen Watch uses it. To delete it, pick another menu for that device first.");
    expect(menuInUseText(["A", "B"])).toBe("A and B use it. To delete it, pick another menu for each of them first.");
  });

  it("moves a device onto a menu with a tick, with item_id and its unit", async () => {
    const t = tab();
    show(t);
    await t.ready();
    t.call("use", t.libNow().menus.find((m) => m.id === HOME_MENU), CHEN);
    await t.lib.store?.refresh();
    expect(t.sentOf("library/pick").at(-1)).toEqual({ type: "wrist_assistant/library/pick", owner_id: CHEN, kind: "menus", unit: "anywhere", item_id: HOME_MENU });
    expect(t.home.lib.menus[HOME_MENU]!.owners).toContain(CHEN);
    // No menus record is ever saved for a tick.
    expect(t.sentOf("watch_config/save")).toEqual([]);
  });

  it("opens every menu in the one editor, the library's, whichever devices use it, with the focused device", async () => {
    const t = tab();
    show(t);
    await t.ready();
    t.call("open", t.libNow().menus.find((m) => m.id === QUICK));
    t.call("open", t.libNow().menus.find((m) => m.id === SPARE));
    expect(t.opened).toHaveLength(0);
    expect(t.library).toEqual([QUICK, SPARE]);
    expect(t.whole()).not.toContain(" in the library");
    expect(t.whole()).not.toContain(" on Chen Watch\"");
    show(t, "board", CHEN);
    await t.ready();
    t.call("open", t.libNow().menus.find((m) => m.id === QUICK));
    expect(t.library.at(-1)).toEqual([QUICK, CHEN]);
  });

  it("has one New menu, in the tab's head, and none in the sections", async () => {
    const t = tab();
    show(t);
    await t.ready();
    const text = t.whole();
    expect(text.split("<span>New menu</span>").length - 1).toBe(1);
    const head = text.slice(text.indexOf(`<div class="ap-head">`), text.indexOf(`class="pk-surface`));
    expect(head).toContain("<span>New menu</span>");
  });

  it("makes a menu no device uses with library/menus/create, and moves no device", async () => {
    const t = tab();
    show(t);
    await t.ready();
    const before = structuredClone(t.home.lib.picks);
    t.call("toggleNew");
    // The New complication dialog's shape: a name, then which kind of menu.
    // The cards pick the kind of menu, never a device.
    const whole = t.whole();
    const dialog = whole.slice(whole.indexOf(`<dialog class="new-dialog lib-new"`), whole.indexOf("</dialog>"));
    expect(dialog).toContain("<h2>New menu</h2>");
    expect(dialog).toContain("Which kind");
    expect(dialog).toMatch(/shape-card lib-new-card on"[\s\S]*Anywhere menu/);
    expect(dialog).toMatch(/shape-card lib-new-card "[\s\S]*Entity quick menu/);
    expect(dialog).toContain("New menu, an Anywhere menu on no device yet. Tick a device any time.");
    expect(dialog).not.toContain("Chen Watch");
    t.call("setNewUnit", t.el.newForm, "entity");
    expect((t.el.newForm as { name: string }).name).toBe("New quick menu");
    expect(t.whole()).toContain("New quick menu, an Entity quick menu on no device yet.");
    t.el.newForm = { ...(t.el.newForm as object), name: "  Kitchen menu " };
    await t.call("makeMenu");
    expect(t.sentOf("library/menus/create")).toEqual([{
      type: "wrist_assistant/library/menus/create", unit: "entity", name: "Kitchen menu", sections: { entityRadial: watchMenusDefaults().entityRadial },
    }]);
    // Nothing else is written: no copy, no record saved, no tick.
    expect(t.sentOf("library/menus/copy")).toEqual([]);
    expect(t.sentOf("watch_config/save")).toEqual([]);
    expect(t.sentOf("library/pick")).toEqual([]);
    expect(t.home.lib.picks).toEqual(before);
    const made = Object.entries(t.home.lib.menus).find(([, m]) => m.name === "Kitchen menu")!;
    expect(made[1].owners).toEqual([]);
    expect(t.el.newForm).toBeUndefined();
    // Straight into the new menu, in the library, with no note left behind.
    expect(t.library).toEqual([made[0]]);
    const text = t.whole();
    expect(text).not.toContain("Made Kitchen menu.");
    // The library was read again: the new card is there, with no device ticked.
    const card = text.slice(text.indexOf(`data-card=${made[0]}`));
    expect(card).toContain(`<b class="ap-name">Kitchen menu</b>`);
    expect(t.libNow().menus.find((m) => m.id === made[0])?.owners).toEqual([]);
  });

  it("asks for a name, and keeps the form open with the refusal", async () => {
    const t = tab();
    show(t);
    await t.ready();
    t.call("toggleNew");
    t.el.newForm = { ...(t.el.newForm as object), name: "   " };
    await t.call("makeMenu");
    expect(t.sentOf("library/menus/create")).toEqual([]);
    expect(t.whole()).toContain("Give the menu a name.");
    t.home.refuse.set("wrist_assistant/library/menus/create", { code: "invalid", message: "Bad menu." });
    t.el.newForm = { ...(t.el.newForm as object), name: "Kitchen menu" };
    await t.call("makeMenu");
    expect(t.el.newForm).toBeDefined();
    expect(t.whole()).toContain("Not made. Bad menu.");
  });

  it("is greyed for anyone who is not an administrator", async () => {
    const t = tab(false);
    show(t);
    await t.ready();
    expect(t.whole()).toContain(NEW_MENU_ADMIN_TEXT);
  });

  it("puts a new menu on a device with a tick", async () => {
    const t = tab();
    show(t);
    await t.ready();
    t.call("toggleNew");
    await t.call("makeMenu");
    const id = Object.entries(t.home.lib.menus).find(([, m]) => m.name === "New menu")![0];
    t.call("use", t.libNow().menus.find((m) => m.id === id), CHEN);
    await t.lib.store?.refresh();
    expect(t.sentOf("library/pick").at(-1)).toEqual({ type: "wrist_assistant/library/pick", owner_id: CHEN, kind: "menus", unit: "anywhere", item_id: id });
    expect(t.home.lib.menus[id]!.owners).toEqual([CHEN]);
  });

  it("starts a device with no menus from the app's defaults when it ticks a new menu", async () => {
    const t = tab();
    // The iPhone never saved menus: the summary lists no menus for it.
    delete t.home.lib.picks[PHONE]!.menus;
    for (const m of Object.values(t.home.lib.menus)) m.owners = m.owners.filter((o) => o !== PHONE);
    show(t);
    await t.ready();
    t.call("toggleNew");
    t.call("setNewUnit", t.el.newForm, "entity");
    await t.call("makeMenu");
    const id = Object.entries(t.home.lib.menus).find(([, m]) => m.name === "New quick menu")![0];
    t.call("use", t.libNow().menus.find((m) => m.id === id), PHONE);
    await t.lib.store?.refresh();
    expect(t.sentOf("library/pick").at(-1)).toEqual({
      type: "wrist_assistant/library/pick", owner_id: PHONE, kind: "menus", unit: "entity", item_id: id, start: watchMenusDefaults(),
    });
    expect(t.home.lib.menus[id]!.owners).toEqual([PHONE]);
    const anywhere = t.home.lib.picks[PHONE]!.menus!.anywhere!;
    expect(t.home.lib.menus[anywhere]!.owners).toEqual([PHONE]);
    expect(t.whole()).not.toContain("cannot start this device's menus");
    // A device that holds menus is sent no start.
    t.call("use", t.libNow().menus.find((m) => m.id === id), CHEN);
    await t.lib.store?.refresh();
    expect(t.sentOf("library/pick").at(-1)).not.toHaveProperty("start");
  });

  it("deletes a menu no device uses after asking", async () => {
    const t = tab();
    show(t);
    await t.ready();
    t.el.deleteAsk = SPARE;
    expect(t.whole()).toContain("It is on no device yet. You can undo it for 10 seconds after.");
    await t.call("deleteMenu", t.libNow().menus.find((m) => m.id === SPARE));
    // Hidden at once, with Undo; nothing is sent until the toast goes.
    expect(laterToast()).toEqual({ text: "Deleted Entity quick menu.", tone: "ok", undo: true });
    expect(t.libNow().menus.some((m) => m.id === SPARE)).toBe(false);
    expect(t.sentOf("library/delete")).toEqual([]);
    sendLaterNow();
    await vi.waitFor(() => expect(laterHidden().size).toBe(0));
    expect(t.sentOf("library/delete").at(-1)).toEqual({ type: "wrist_assistant/library/delete", kind: "menus", item_id: SPARE });
    expect(laterToast()).toBeUndefined();
    expect(t.home.lib.menus[SPARE]).toBeUndefined();
  });

  it("puts a deleted menu back on Undo, and sends nothing", async () => {
    const t = tab();
    show(t);
    await t.ready();
    await t.call("deleteMenu", t.libNow().menus.find((m) => m.id === SPARE));
    expect(t.libNow().menus.some((m) => m.id === SPARE)).toBe(false);
    expect(undoLater()).toBe(true);
    expect(t.libNow().menus.some((m) => m.id === SPARE)).toBe(true);
    expect(laterToast()).toBeUndefined();
    expect(t.sentOf("library/delete")).toEqual([]);
  });

  it("shows a focused device's two menus first, then the rest dimmed", async () => {
    const t = tab();
    show(t, "board", CHEN);
    await t.ready();
    const text = t.whole();
    expect(text).toContain("<b>Chen Watch</b>");
    expect(text).toContain("uses Chen's menu and Entity quick menu");
    expect(text).toContain("On Chen Watch");
    expect(text).toContain("Not on this watch");
    expect(text).toContain("Pick its dot under Chen Watch to use it there.");
    expect(text).toMatch(/class=bd-row dim/);
    expect(text.indexOf(`data-row=${CHEN_MENU}`)).toBeLessThan(text.indexOf(`data-row=${HOME_MENU}`));
    expect(text).toContain("Pick which menu this watch uses. Click a menu to edit it.");
  });
});

describe("opening a card in the menu editor", () => {

  it("shows the menu on its own settings, letting go of a picked slot", () => {
    const slotId = (DEFAULTS.quickAction as { slots: { id: string }[] }).slots[0]!.id;
    const page = "5A17E000-0000-4000-8000-000000000001";
    const uiState = new Map<string, unknown>([["me:menu", "switcher"], ["me:sel:anywhere", slotId], ["me:sel:domain:light", "x"], ["me:sw:page", page]]);
    expect(selectedMenuSlot({ uiState, document: DEFAULTS }, { list: "anywhere" })).toBeDefined();
    const host = { uiState, requestUpdate: () => undefined };
    showMenuSettings(host, "anywhere");
    expect(shownMenu(host)).toBe("anywhere");
    expect(uiState.has("me:sw:page")).toBe(false);
    expect(uiState.has("me:sel:domain:light")).toBe(false);
    expect(selectedMenuSlot({ uiState, document: DEFAULTS }, { list: "anywhere" })).toBeUndefined();
  });
});
