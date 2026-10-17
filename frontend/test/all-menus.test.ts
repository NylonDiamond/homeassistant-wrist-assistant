// The Menus tab, drawn from the library: one card per menu in two sections,
// its name, its slots, its picture and a round tick per device; a tick moves
// that device onto the menu. A device's tab shows its two menus with a pick
// of another, then the rest. New menu makes a menu no device uses, the app's
// own for its kind, and moves no device; a menu no device uses can be
// deleted. Plus the menu editor's ask that opens it on one menu.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { libraryOf, type LibraryMenu } from "../src/library/model.js";
import "../src/watch-menus/all-menus.js";
import {
  ALL_MENUS_LEAD,
  MENU_NO_USER_TEXT,
  MENU_SECTION_TITLES,
  MENUS_FOOT,
  allMenusLead,
  deviceMenuMeta,
  deviceMenuRows,
  menuDetail,
  menuFilterChips,
  menuKindOptions,
  menuSections,
  menusDeviceFoot,
  menusEmptyText,
  NEW_MENU_ADMIN_TEXT,
  newMenuMadeText,
  newMenuName,
  newMenuSections,
  newMenuText,
  openMenuDevice,
  restMenus,
  shownMenus,
} from "../src/watch-menus/all-menus-model.js";
import { askWatchMenu, dropAllWatchMenus, takeWatchMenuAsk } from "../src/watch-menus/draft.js";
import { shownMenu, showMenuSettings, selectedMenuSlot } from "../src/watch-menus/menu-view.js";
import { type MenusDocument, watchMenusDefaults } from "../src/watch-menus/model.js";
import { ALL_FILTER } from "../src/watch-pages/all-pages-model.js";
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
    expect(menuSections(shownMenus(lib(), "chen", "all", DEVICES)).map((s) => s.menus.map((m) => m.id))).toEqual([[CHEN_MENU], [QUICK]]);
    expect(menuSections(shownMenus(lib(), "home")).map((s) => s.menus.length)).toEqual([1, 0]);
    expect(menuSections([]).map((s) => s.unit)).toEqual(["anywhere", "entity"]);
  });

  it("count their slots as the editor's Menus row does", () => {
    expect(menuDetail(menu(HOME_MENU))).toBe("0 slots");
    const full: LibraryMenu = { ...menu(HOME_MENU), sections: { quickAction: DEFAULTS.quickAction } };
    expect(menuDetail(full)).toMatch(/^\d+ slots$/);
  });

  it("are found by the menu's name or a device that uses it, and kept to one kind of device", () => {
    expect(shownMenus(lib(), "home").map((m) => m.id)).toEqual([HOME_MENU]);
    expect(shownMenus(lib(), "iphone 15", "all", DEVICES).map((m) => m.id)).toEqual([HOME_MENU, QUICK]);
    expect(shownMenus(lib(), "", "iphone", DEVICES).map((m) => m.id)).toEqual([HOME_MENU, QUICK]);
    expect(menuKindOptions(shownMenus(lib()), DEVICES).map((o) => [o.label, o.count])).toEqual([["All", 4], ["Watches", 3], ["iPhones", 2]]);
  });

  it("open on the device tab's device when it uses the menu, else the first watch", () => {
    expect(openMenuDevice(menu(HOME_MENU), PHONE, "all", DEVICES)?.ownerId).toBe(PHONE);
    expect(openMenuDevice(menu(HOME_MENU), CHEN, "all", DEVICES)?.ownerId).toBe(JESSE);
    expect(openMenuDevice(menu(HOME_MENU), ALL_FILTER, "iphone", DEVICES)?.ownerId).toBe(PHONE);
    expect(openMenuDevice(menu(SPARE), ALL_FILTER, "all", DEVICES)).toBeUndefined();
  });

  it("count every menu on All, and each device's two", () => {
    expect(menuFilterChips(DEVICES, lib()).map((c) => [c.label, c.count])).toEqual([["All", 4], ["Chen Watch", 2], ["Jesse Apple Watch", 2], ["iPhone 15 Pro", 2]]);
  });
});

describe("a device's menus", () => {
  it("are its Anywhere menu and Entity quick menu, each with the others it could use", () => {
    const rows = deviceMenuRows(lib(), CHEN);
    expect(rows.map((r) => [r.title, r.menu?.name, r.others.map((m) => m.id)])).toEqual([
      ["Anywhere menu", "Chen's menu", [HOME_MENU]],
      ["Entity quick menu", "Entity quick menu", [SPARE]],
    ]);
    expect(deviceMenuMeta(menu(HOME_MENU), JESSE, DEVICES)).toBe("Home menu · 0 slots · also on iPhone 15 Pro");
    expect(deviceMenuMeta(menu(CHEN_MENU), CHEN, DEVICES)).toBe("Chen's menu · 0 slots · only here");
  });

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
    expect(newMenuText("entity")).toBe("It starts as the app's own Entity quick menu. No device uses it until you tick one on its card.");
    expect(newMenuMadeText("Kitchen menu")).toBe("Made Kitchen menu. Tick a device on its card to use it there.");
  });
});

describe("the tab's words", () => {
  it("count the menus in the home and say what a device uses", () => {
    expect(allMenusLead(4)).toBe("4 menus in your home. Each device uses one Anywhere menu and one Entity quick menu.");
    expect(allMenusLead(1)).toBe(`1 menu in your home. ${ALL_MENUS_LEAD}`);
    expect(MENUS_FOOT).toBe("Click a menu to edit it. Pick a device on a card and that device uses this menu from now on. New menu makes one no device uses yet.");
    expect(menusDeviceFoot(PHONE_D)).toBe("Pick which menu this iPhone uses. Click a menu to edit it.");
    expect(menusEmptyText([], "")).toBe("No watch or iPhone has connected yet. Pair one on the Home tab.");
    expect(menusEmptyText(DEVICES, "zz")).toBe("No menu or device has that name.");
    for (const text of [allMenusLead(2), MENUS_FOOT, menusDeviceFoot(JESSE_D), MENU_NO_USER_TEXT, newMenuText("anywhere"), newMenuMadeText("A"), NEW_MENU_ADMIN_TEXT]) {
      expect(text).not.toMatch(/[–—]| - /);
      expect(text).not.toMatch(/[Ll]ink|Same as/);
    }
  });
});

describe("the Menus tab", () => {
  function tab(admin = true) {
    const home = fakeHome(admin);
    const opened: [string, string][] = [];
    const t = standUp("wa-all-menus", home, { onOpen: (o: string, k: string) => opened.push([o, k]) });
    const sentOf = (type: string) => home.sent.filter((m) => m.type === `wrist_assistant/${type}`);
    const libNow = () => (t.el.lib as { library: { menus: LibraryMenu[] } }).library;
    return { ...t, home, opened, sentOf, libNow };
  }

  it("draws a card per menu with its name and round ticks under Used by, and no Devices, Link or Same as", async () => {
    const t = tab();
    t.call("setFilter", ALL_FILTER);
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
    // Only the menu no device uses can be deleted from its card.
    expect(text.split(">Delete<").length - 1).toBe(1);
  });

  it("moves a device onto a menu with a tick, with item_id and its unit", async () => {
    const t = tab();
    t.call("setFilter", ALL_FILTER);
    await t.ready();
    t.call("use", t.libNow().menus.find((m) => m.id === HOME_MENU), CHEN);
    await t.lib.store?.refresh();
    expect(t.sentOf("library/pick").at(-1)).toEqual({ type: "wrist_assistant/library/pick", owner_id: CHEN, kind: "menus", unit: "anywhere", item_id: HOME_MENU });
    expect(t.home.lib.menus[HOME_MENU]!.owners).toContain(CHEN);
    // No menus record is ever saved for a tick.
    expect(t.sentOf("watch_config/save")).toEqual([]);
  });

  it("opens a card's menu in a device's editor, on that menu; a menu no device uses says so", async () => {
    const t = tab();
    t.call("setFilter", ALL_FILTER);
    await t.ready();
    t.call("open", t.libNow().menus.find((m) => m.id === QUICK));
    expect(t.opened.at(-1)).toEqual([CHEN, "watch"]);
    expect(takeWatchMenuAsk(CHEN)).toBe("entity");
    t.call("open", t.libNow().menus.find((m) => m.id === SPARE));
    expect(t.opened).toHaveLength(1);
    expect(t.whole()).toContain(MENU_NO_USER_TEXT);
  });

  it("has one New menu, in the tab's head, and none in the sections", async () => {
    const t = tab();
    t.call("setFilter", ALL_FILTER);
    await t.ready();
    const text = t.whole();
    expect(text.split("<span>New menu</span>").length - 1).toBe(1);
    const head = text.slice(text.indexOf(`<div class="ap-head">`), text.indexOf(`class="pk-surface`));
    expect(head).toContain("<span>New menu</span>");
  });

  it("makes a menu no device uses with library/menus/create, and moves no device", async () => {
    const t = tab();
    t.call("setFilter", ALL_FILTER);
    await t.ready();
    const before = structuredClone(t.home.lib.picks);
    t.call("toggleNew");
    expect(t.whole()).toContain("It starts as the app's own Anywhere menu. No device uses it until you tick one on its card.");
    // For picks the kind of menu, never a device.
    expect(t.whole()).toContain(`<option value=entity ?selected=false>Entity quick menu</option>`);
    t.call("setNewUnit", t.el.newForm, "entity");
    expect((t.el.newForm as { name: string }).name).toBe("New quick menu");
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
    const text = t.whole();
    expect(text).toContain("Made Kitchen menu. Tick a device on its card to use it there.");
    // The library was read again: the new card is there, with no device ticked.
    const card = text.slice(text.indexOf(`data-card=${made[0]}`));
    expect(card).toContain(`<b class="ap-name">Kitchen menu</b>`);
    expect(t.libNow().menus.find((m) => m.id === made[0])?.owners).toEqual([]);
  });

  it("asks for a name, and keeps the form open with the refusal", async () => {
    const t = tab();
    t.call("setFilter", ALL_FILTER);
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
    t.call("setFilter", ALL_FILTER);
    await t.ready();
    expect(t.whole()).toContain(NEW_MENU_ADMIN_TEXT);
  });

  it("puts a new menu on a device with a tick", async () => {
    const t = tab();
    t.call("setFilter", ALL_FILTER);
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
    t.call("setFilter", ALL_FILTER);
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
    t.call("setFilter", ALL_FILTER);
    await t.ready();
    t.el.deleteAsk = SPARE;
    expect(t.whole()).toContain("No device uses it. This cannot be undone.");
    await t.call("deleteMenu", t.libNow().menus.find((m) => m.id === SPARE));
    expect(t.sentOf("library/delete").at(-1)).toEqual({ type: "wrist_assistant/library/delete", kind: "menus", item_id: SPARE });
    expect(t.home.lib.menus[SPARE]).toBeUndefined();
  });

  it("shows a device's two menus with a pick of another, then the rest dimmed with Add chips", async () => {
    const t = tab();
    t.call("setFilter", CHEN);
    await t.ready();
    const text = t.whole();
    expect(text).toContain("On Chen Watch");
    expect(text).toContain("Chen's menu · 0 slots · only here");
    expect(text).toContain("Entity quick menu · 0 slots · also on Jesse Apple Watch and iPhone 15 Pro");
    expect(text).toContain("lt-pick-sel");
    expect(text).toContain(`<option value=${HOME_MENU} ?selected=false>Home menu</option>`);
    expect(text).toContain(`<option value=${CHEN_MENU} ?selected=true>Chen's menu</option>`);
    expect(text).toContain("Not on this watch");
    expect(text).toContain("Add to this watch");
    expect(text).toContain("Pick which menu this watch uses. Click a menu to edit it.");
  });
});

describe("opening a card in the menu editor", () => {
  it("asks once per device, and a dropped draft set drops the ask", () => {
    askWatchMenu("watch-a", "entity");
    expect(takeWatchMenuAsk("watch-a")).toBe("entity");
    expect(takeWatchMenuAsk("watch-a")).toBeUndefined();
    askWatchMenu("watch-b", "anywhere");
    dropAllWatchMenus();
    expect(takeWatchMenuAsk("watch-b")).toBeUndefined();
  });

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
