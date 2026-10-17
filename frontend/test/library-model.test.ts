// The library as the tabs read it, from one summary reply: items with their
// devices, each device's picks in its order with Hide here, the rest of the
// library, menus by unit, and the words of a device's row.

import { describe, expect, it } from "vitest";

import {
  alsoOnText,
  countFor,
  devicesFor,
  hasItem,
  holdsRecord,
  isHiddenOn,
  isShared,
  itemsFor,
  libraryItem,
  libraryItems,
  libraryMenu,
  libraryMenus,
  libraryOf,
  menuDocument,
  menuFor,
  menuName,
  otherMenus,
  ownerNames,
  pagesDocumentFor,
  pickMetaText,
  restFor,
} from "../src/library/model.js";
import {
  CAMERA, CHEN, CHEN_MENU, DEVICES, DOORS, HOME_MENU, JESSE, LIGHTS, LONELY, PAGE1, PHONE, QUICK, SMART, SPARE, STARTER, SYSTEM, summary,
} from "./library-fixture.js";

describe("libraryOf", () => {
  it("lists every item once in the summary's order, with names and details", () => {
    const lib = libraryOf(summary());
    expect(lib.pages.map((p) => p.name)).toEqual(["Lights", "Camera", "New Page 1", "Smart", "Untitled page"]);
    expect(lib.pages.map((p) => p.detail)).toEqual(["11 tiles", "4 tiles", "1 tile", "Smart page", "0 tiles"]);
    expect(lib.pages.find((p) => p.id === SMART)?.smart).toBe(true);
    expect(lib.statusPages.map((p) => [p.name, p.detail, p.starter])).toEqual([["Lights", "1 row", true], ["Doors", "2 rows", false]]);
  });

  it("names a menu after its unit when it has no name", () => {
    const lib = libraryOf(summary());
    expect(lib.menus.map((m) => [m.name, m.unit])).toEqual([
      ["Home menu", "anywhere"], ["Chen's menu", "anywhere"], ["Entity quick menu", "entity"], ["Entity quick menu", "entity"],
    ]);
    expect(menuName(lib, SPARE)).toBe("Entity quick menu");
    expect(menuName(lib, "nope")).toBeUndefined();
  });

  it("leaves out what is malformed rather than throwing", () => {
    const raw = { pages: { a: { item: "no" }, b: null }, status_pages: [], menus: { m: { name: "x", kind: "other", sections: {}, owners: [] } }, picks: null };
    const lib = libraryOf(raw as never);
    expect(lib.pages).toEqual([]);
    expect(lib.statusPages).toEqual([]);
    expect(lib.menus).toEqual([]);
    expect(itemsFor(lib, CHEN, "pages")).toEqual([]);
  });
});

describe("items and devices", () => {
  const lib = libraryOf(summary());

  it("finds an item by id ignoring case", () => {
    expect(libraryItem(lib, "pages", PAGE1.toLowerCase())?.name).toBe("New Page 1");
    expect(libraryItem(lib, "status_pages", PAGE1)).toBeUndefined();
    expect(libraryMenu(lib, HOME_MENU.toLowerCase())?.name).toBe("Home menu");
    expect(libraryItems(lib, "status_pages")).toBe(lib.statusPages);
  });

  it("says which devices have an item, and whether it is shared", () => {
    expect(devicesFor(lib, "pages", PAGE1)).toEqual([JESSE, PHONE]);
    expect(devicesFor(lib, "menus", QUICK)).toEqual([CHEN, JESSE, PHONE]);
    expect(devicesFor(lib, "pages", "missing")).toEqual([]);
    expect(isShared(lib, "pages", PAGE1)).toBe(true);
    expect(isShared(lib, "pages", SMART)).toBe(false);
    expect(hasItem(lib, PHONE.toUpperCase(), "pages", PAGE1)).toBe(true);
    expect(hasItem(lib, CHEN, "pages", PAGE1)).toBe(false);
  });

  it("gives a device's picks in its order with Hide here, skipping system pages", () => {
    expect(itemsFor(lib, JESSE, "pages").map((p) => [p.entry.name, p.hidden])).toEqual([["Smart", false], ["New Page 1", true]]);
    expect(itemsFor(lib, JESSE, "pages")[1]!.id).toBe(PAGE1);
    expect(itemsFor(lib, CHEN, "pages").map((p) => p.id)).toEqual([CAMERA, LIGHTS]);
    expect(itemsFor(lib, JESSE, "status_pages").map((p) => p.id)).toEqual([DOORS, STARTER]);
    expect(itemsFor(lib, "unknown", "pages")).toEqual([]);
    expect(isHiddenOn(lib, JESSE, "pages", PAGE1)).toBe(true);
    expect(isHiddenOn(lib, PHONE, "pages", PAGE1)).toBe(false);
    expect(countFor(lib, JESSE, "pages")).toBe(2);
    expect(countFor(lib, CHEN, "menus")).toBe(2);
  });

  it("gives the rest of the library a device does not pick", () => {
    expect(restFor(lib, JESSE, "pages").map((p) => p.id)).toEqual([LIGHTS, CAMERA, LONELY]);
    expect(restFor(lib, CHEN, "status_pages").map((p) => p.id)).toEqual([DOORS]);
  });

  it("knows which kinds a device holds a record of", () => {
    const raw = summary();
    delete raw.picks[PHONE]!.status_pages;
    const lib2 = libraryOf(raw);
    expect(holdsRecord(lib2, PHONE, "status_pages")).toBe(false);
    expect(holdsRecord(lib2, PHONE, "pages")).toBe(true);
    expect(holdsRecord(lib2, "nobody", "pages")).toBe(false);
  });
});

describe("menus", () => {
  const lib = libraryOf(summary());

  it("lists menus by unit and the one a device uses", () => {
    expect(libraryMenus(lib, "anywhere").map((m) => m.id)).toEqual([HOME_MENU, CHEN_MENU]);
    expect(menuFor(lib, CHEN, "anywhere")?.id).toBe(CHEN_MENU);
    expect(menuFor(lib, "nobody", "entity")).toBeUndefined();
    expect(otherMenus(lib, CHEN, "anywhere").map((m) => m.id)).toEqual([HOME_MENU]);
  });

  it("builds a menus document from a menu's sections, a fresh copy each time", () => {
    const menu = libraryMenu(lib, HOME_MENU)!;
    const doc = menuDocument(menu);
    expect(doc).toEqual({ schemaVersion: 1, quickAction: { slots: [] }, pageSwitcher: {} });
    (doc.quickAction as { slots: unknown[] }).slots.push(1);
    expect(menuDocument(menu)).toEqual({ schemaVersion: 1, quickAction: { slots: [] }, pageSwitcher: {} });
    expect("linkIds" in doc).toBe(false);
  });

  it("builds a device's pages document with its system pages and Hide here", () => {
    const doc = pagesDocumentFor(lib, JESSE);
    expect((doc.pages as { id: string; isHidden?: boolean }[]).map((p) => [p.id, p.isHidden === true])).toEqual([
      [SYSTEM, false], [SMART, false], [PAGE1, true],
    ]);
  });
});

describe("row words", () => {
  const lib = libraryOf(summary());

  it("names the other devices, or says only here", () => {
    expect(alsoOnText([JESSE, PHONE], JESSE, DEVICES)).toBe("also on iPhone 15 Pro");
    expect(alsoOnText([CHEN, JESSE, PHONE], JESSE, DEVICES)).toBe("also on Chen Watch and iPhone 15 Pro");
    expect(alsoOnText([JESSE], JESSE, DEVICES)).toBe("only here");
    expect(alsoOnText([JESSE, "gone-1", "gone-2"], JESSE, DEVICES)).toBe("also on 2 other devices");
  });

  it("puts the detail and the devices in a row's meta, hidden first", () => {
    const [smart, page1] = itemsFor(lib, JESSE, "pages");
    expect(pickMetaText(smart!, JESSE, DEVICES)).toBe("Smart page · only here");
    expect(pickMetaText(page1!, JESSE, DEVICES)).toBe("1 tile · hidden here");
    expect(pickMetaText(itemsFor(lib, PHONE, "pages")[0]!, PHONE, DEVICES)).toBe("1 tile · also on Jesse Apple Watch");
  });

  it("names the owners in device order", () => {
    expect(ownerNames([PHONE, CHEN], DEVICES)).toEqual(["Chen Watch", "iPhone 15 Pro"]);
  });
});
