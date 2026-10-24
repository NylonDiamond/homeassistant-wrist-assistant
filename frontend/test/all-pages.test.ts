// The Pages tab's and the Status pages tab's rules, drawn from the library:
// one row or card per library item, the search, which device a row opens
// on, a focused device's two lists and its order, and the tab's words.

import { describe, expect, it } from "vitest";

import type { OwnerSummary } from "../src/ha-api.js";
import { libraryOf } from "../src/library/model.js";
import {
  ALL_FILTER,
  aCard,
  allPagesLead,
  cardDetail,
  cardNoun,
  cardsTitle,
  deviceView,
  dropBefore,
  dropChange,
  emptyLibraryText,
  emptyText,
  footText,
  inOrder,
  movedOrder,
  libraryEditTitle,
  noPicksText,
  onDeviceTitle,
  openDevice,
  orderHint,
  resolveFilter,
  restTitle,
  showsRest,
  shownItems,
} from "../src/watch-pages/all-pages-model.js";
import { linkDevicesOf } from "../src/watch-pages/devices.js";
import { CAMERA, CHEN, DEVICES, DOORS, JESSE, LIGHTS, LONELY, PAGE1, SMART, STARTER, summary } from "./library-fixture.js";

const lib = () => libraryOf(summary());
const [CHEN_D, JESSE_D, PHONE_D] = DEVICES as [typeof DEVICES[0], typeof DEVICES[0], typeof DEVICES[0]];

describe("the cards", () => {
  it("are one per library item, in the library's order, whoever has them", () => {
    expect(shownItems(lib(), "pages").map((e) => e.name)).toEqual(["Lights", "Camera", "New Page 1", "Smart", "Untitled page"]);
    expect(shownItems(lib(), "status_pages").map((e) => e.name)).toEqual(["Lights", "Doors"]);
  });

  it("say their tiles, Smart page, their rows, and starter", () => {
    const l = lib();
    const detail = (kind: "pages" | "status_pages", id: string) => cardDetail(shownItems(l, kind).find((e) => e.id === id)!);
    expect(detail("pages", LIGHTS)).toBe("11 tiles");
    expect(detail("pages", PAGE1)).toBe("1 tile");
    expect(detail("pages", SMART)).toBe("Smart page");
    expect(detail("status_pages", STARTER)).toBe("1 row · starter");
    expect(detail("status_pages", DOORS)).toBe("2 rows");
  });

  it("are found by name in any case", () => {
    expect(shownItems(lib(), "pages", "LIGHT").map((e) => e.id)).toEqual([LIGHTS]);
  });
});

describe("the focus", () => {
  it("goes back to every device once its device is gone", () => {
    expect(resolveFilter(JESSE, DEVICES)).toBe(JESSE);
    expect(resolveFilter("gone", DEVICES)).toBe(ALL_FILTER);
    expect(resolveFilter(undefined, DEVICES)).toBe(ALL_FILTER);
  });
});

describe("a focused device", () => {
  it("lists the device's picks in its own order with Hide here, then the rest of the library", () => {
    const view = deviceView(lib(), JESSE_D, "pages");
    expect(view.picks.map((p) => [p.entry.name, p.hidden])).toEqual([["Smart", false], ["New Page 1", true]]);
    expect(view.rest.map((e) => e.name)).toEqual(["Lights", "Camera", "Untitled page"]);
    expect(deviceView(lib(), CHEN_D, "pages").picks.map((p) => p.id)).toEqual([CAMERA, LIGHTS]);
    expect(deviceView(lib(), PHONE_D, "status_pages").rest.map((e) => e.id)).toEqual([DOORS]);
  });

  it("narrows both lists by the search", () => {
    const view = deviceView(lib(), JESSE_D, "pages", "cam");
    expect(view.picks).toEqual([]);
    expect(view.rest.map((e) => e.id)).toEqual([CAMERA]);
  });

  it("shows a drag's order until the read after its save, and keeps a pick the order does not name", () => {
    const picks = deviceView(lib(), CHEN_D, "pages").picks;
    expect(inOrder(picks, [LIGHTS]).map((p) => p.id)).toEqual([LIGHTS, CAMERA]);
    expect(inOrder(picks, undefined).map((p) => p.id)).toEqual([CAMERA, LIGHTS]);
    expect(inOrder(picks, ["gone", LIGHTS.toLowerCase(), CAMERA]).map((p) => p.id)).toEqual([LIGHTS, CAMERA]);
  });

  it("drops a row before its target dragging up, after it dragging down", () => {
    const order = ["a", "b", "c"];
    expect(dropBefore(order, "c", "a")).toBe("a");
    expect(dropBefore(order, "a", "b")).toBe("c");
    expect(dropBefore(order, "a", "c")).toBeNull();
    expect(dropBefore(order, "b", "B")).toBeUndefined();
    expect(dropBefore(order, "x", "a")).toBeUndefined();
    // The drop moves the dragged row, never the one it lands on.
    expect(dropChange(order, "c", "a")).toEqual({ id: "c", before: "a" });
    expect(dropChange(order, "a", "c")).toEqual({ id: "a", before: null });
    expect(dropChange(order, "a", "a")).toBeUndefined();
    expect(movedOrder(order, "a", null)).toEqual(["b", "c", "a"]);
    expect(movedOrder(order, "c", "a")).toEqual(["c", "a", "b"]);
    expect(movedOrder(order, "a", "c")).toEqual(["b", "a", "c"]);
  });

  it("names its two lists by the device", () => {
    expect(onDeviceTitle(JESSE_D)).toBe("On Jesse Apple Watch");
    expect(orderHint(JESSE_D)).toBe("Drag to order. The order is this watch's own.");
    expect(orderHint(PHONE_D)).toBe("Drag to order. The order is this iPhone's own.");
    expect(restTitle(JESSE_D)).toBe("Not on this watch");
    expect(restTitle(PHONE_D)).toBe("Not on this iPhone");
    // An empty home lists no rest: "every page is on it" says nothing there.
    expect(showsRest(0, 0, "")).toBe(false);
    expect(showsRest(2, 0, "")).toBe(true);
    expect(showsRest(0, 3, "")).toBe(true);
    expect(showsRest(0, 0, "zz")).toBe(true);
    expect(noPicksText(CHEN_D, "pages", "")).toBe("No pages on Chen Watch yet. Tick one below, or make a new one.");
    // Nothing below to tick: the library holds nothing this device lacks.
    expect(noPicksText(CHEN_D, "pages", "", 0)).toBe("No pages on Chen Watch yet. Use New page to make one.");
    expect(noPicksText(CHEN_D, "status_pages", "zz")).toBe("No status page on Chen Watch has that name.");
    // A user who cannot make a page is not sent to the New button.
    expect(noPicksText(CHEN_D, "pages", "", 0, false)).toBe("No pages on Chen Watch yet. Ask a Home Assistant administrator to make the first one.");
    expect(noPicksText(CHEN_D, "pages", "", 3, false)).toBe("No pages on Chen Watch yet. Tick one below.");
  });
});

describe("which device a card opens on", () => {
  const entry = (id: string) => shownItems(lib(), "pages").find((e) => e.id === id)!;

  it("is the first watch that has the item, else the first device that has it", () => {
    expect(openDevice(entry(PAGE1), DEVICES)?.ownerId).toBe(JESSE);
    expect(openDevice(entry(LIGHTS), DEVICES)?.ownerId).toBe(CHEN);
  });

  it("is none for an item no device has; every card says Edit, as it opens in the one editor", () => {
    expect(openDevice(entry(LONELY), DEVICES)).toBeUndefined();
    expect(libraryEditTitle("Shed")).toBe("Edit Shed");
  });
});

describe("the tab's words", () => {
  it("count the items in the library in the line under the title, and say what the library is", () => {
    expect(allPagesLead(12)).toBe("12 pages in your home. Each watch and iPhone shows the pages ticked for it, and an edit shows everywhere.");
    expect(allPagesLead(1)).toBe("1 page in your home. Each watch and iPhone shows the pages ticked for it, and an edit shows everywhere.");
    expect(allPagesLead(5, "status_pages")).toBe("5 status pages in your home. A status page is a read-only screen of rows that a tile or a menu slot opens.");
    expect(allPagesLead(0)).toBe("No pages yet.");
  });

  it("explain an empty library, and send anyone who may not make a page to an administrator", () => {
    expect(emptyLibraryText("pages", true)).toBe("Make a page once, then tick each watch or iPhone that should show it.");
    expect(emptyLibraryText("status_pages", true)).toBe("Make a status page once, then tick each watch or iPhone that should show it.");
    expect(emptyLibraryText("pages", false)).toBe("Ask a Home Assistant administrator to make the first page.");
  });

  it("say in the foot what a click and a tick do, as the mock does", () => {
    expect(footText("pages", undefined)).toBe("Click a page to edit it. Tick a box to show the page on that device. Click a device's name to order its pages.");
    expect(footText("status_pages", undefined)).toBe("Click a status page to edit it. Tick a box to put it on that device. Click a device's name to order its status pages.");
    expect(footText("pages", undefined, false, "cards")).toBe("Click a page to edit it. Tick a device to show the page there. One page, the same everywhere.");
    expect(footText("status_pages", undefined, false, "cards")).toBe("Click a status page to edit it. Tick a device to put it there.");
    expect(footText("pages", JESSE_D)).toContain("Hide here");
    expect(footText("status_pages", JESSE_D)).not.toContain("Hide here");
    expect(footText("pages", undefined, true)).toBe("Click pages to pick them. Shift+click picks every page between two.");
  });

  it("say why there is nothing to show", () => {
    expect(emptyText([], "")).toBe("No watch or iPhone has connected yet. Pair one on the Home tab.");
    expect(emptyText(DEVICES, "")).toBe("Your home has no pages yet. Use New page to make one.");
    expect(emptyText(DEVICES, "zz")).toBe("No page has that name.");
    expect(emptyText(DEVICES, "", "status_pages")).toBe("Your home has no status pages yet. Use New status page to make one.");
  });

  it("name the tab and a card by their kind", () => {
    expect(cardsTitle("pages")).toBe("Pages");
    expect(cardsTitle("status_pages")).toBe("Status pages");
    expect(cardNoun("status_pages", 2)).toBe("status pages");
    expect(aCard("status_pages")).toBe("a status page");
  });

  it("never break a sentence with a dash, and never speak of links", () => {
    const texts = [
      allPagesLead(2), allPagesLead(2, "status_pages"), footText("pages", JESSE_D), footText("pages", undefined), footText("pages", undefined, false, "cards"),
      orderHint(CHEN_D), libraryEditTitle("Shed"), noPicksText(PHONE_D, "pages", ""), emptyText(DEVICES, ""),
      allPagesLead(0), emptyLibraryText("pages", true), emptyLibraryText("pages", false), noPicksText(PHONE_D, "pages", "", 0),
    ];
    for (const text of texts) {
      expect(text).not.toMatch(/[–—]| - /);
      expect(text).not.toMatch(/[Ll]ink/);
    }
  });
});

describe("the devices a page can be on", () => {
  const owner = (id: string, kind: string, name: string, extra: Partial<OwnerSummary> = {}): OwnerSummary =>
    ({ owner_watch_id: id, device_name: name, device_kind: kind, phone_pages: kind === "iphone", ...extra }) as unknown as OwnerSummary;

  it("are the watches, then the iPhones on a home with phone pages", () => {
    const owners = [owner("p1", "iphone", "Jesse's iPhone"), owner("w1", "watch", "Apple Watch")];
    expect(linkDevicesOf(owners, true)).toEqual([
      { ownerId: "w1", name: "Apple Watch", kind: "watch" },
      { ownerId: "p1", name: "Jesse's iPhone", kind: "iphone" },
    ]);
    expect(linkDevicesOf(owners, false).map((d) => d.ownerId)).toEqual(["w1"]);
  });

  it("leave out an iPhone whose app is too old to show pages", () => {
    const owners = [owner("p1", "iphone", "Old iPhone", { phone_pages: false }), owner("w1", "watch", "Apple Watch")];
    expect(linkDevicesOf(owners, true).map((d) => d.ownerId)).toEqual(["w1"]);
  });
});

describe("a list tab's address", () => {
  it("names the focused device after the tab's own address, and nothing else", async () => {
    const { listFocusOf, listFocusPath } = await import("../src/watch-pages/all-pages-hook.js");
    expect(listFocusOf("/all-pages", "/all-pages")).toBeUndefined();
    expect(listFocusOf("/all-pages/", "/all-pages")).toBeUndefined();
    expect(listFocusOf("/all-pages/ab%20c", "/all-pages")).toBe("ab c");
    expect(listFocusOf("/all-pages-x/ab", "/all-pages")).toBeUndefined();
    expect(listFocusOf("/all-status-pages/W1", "/all-pages")).toBeUndefined();
    expect(listFocusOf("/all-menus/%E0%A4%A", "/all-menus")).toBeUndefined();
    expect(listFocusPath("/all-menus", "a/b")).toBe("/all-menus/a%2Fb");
    expect(listFocusPath("/all-menus", undefined)).toBe("/all-menus");
  });
});
