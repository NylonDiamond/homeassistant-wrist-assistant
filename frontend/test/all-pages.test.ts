// The Pages tab's and the Status pages tab's rules, drawn from the library:
// one card per library item, the device tabs and their counts, the Device
// menu, the search, which device a card opens on, a device tab's two lists
// and its order, and the tab's words.

import { describe, expect, it } from "vitest";

import type { OwnerSummary } from "../src/ha-api.js";
import { libraryOf } from "../src/library/model.js";
import {
  ALL_FILTER,
  REST_HINT,
  aCard,
  allPagesLead,
  cardDetail,
  cardNoun,
  cardsTitle,
  deviceView,
  dropBefore,
  dropChange,
  emptyText,
  filterChips,
  footText,
  hasBothKinds,
  inOrder,
  kindOptions,
  movedOrder,
  noOwnerText,
  noPicksText,
  onDeviceTitle,
  openDevice,
  orderHint,
  resolveFilter,
  resolveKind,
  restTitle,
  shownItems,
} from "../src/watch-pages/all-pages-model.js";
import { linkDevicesOf } from "../src/watch-pages/links.js";
import { CAMERA, CHEN, DEVICES, DOORS, JESSE, LIGHTS, LONELY, PAGE1, PHONE, SMART, STARTER, summary } from "./library-fixture.js";

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

  it("are found by name in any case, and kept to one kind of device by the Device menu", () => {
    expect(shownItems(lib(), "pages", "LIGHT").map((e) => e.id)).toEqual([LIGHTS]);
    expect(shownItems(lib(), "pages", "", "iphone", DEVICES).map((e) => e.id)).toEqual([PAGE1]);
    // An item no device has is on no kind of device.
    expect(shownItems(lib(), "pages", "", "watch", DEVICES).map((e) => e.id)).toEqual([LIGHTS, CAMERA, PAGE1, SMART]);
    expect(kindOptions(shownItems(lib(), "pages"), DEVICES).map((o) => [o.label, o.count])).toEqual([["All", 5], ["Watches", 4], ["iPhones", 1]]);
  });
});

describe("the device tabs", () => {
  it("count every item on All, and each device's own picks, system pages left out", () => {
    expect(filterChips(DEVICES, lib(), "pages").map((c) => [c.label, c.count])).toEqual([
      ["All", 5], ["Chen Watch", 2], ["Jesse Apple Watch", 2], ["iPhone 15 Pro", 1],
    ]);
    expect(filterChips(DEVICES, lib(), "status_pages").map((c) => [c.label, c.count])).toEqual([
      ["All", 2], ["Chen Watch", 1], ["Jesse Apple Watch", 2], ["iPhone 15 Pro", 1],
    ]);
    expect(filterChips(DEVICES, undefined, "pages").every((c) => c.count === 0)).toBe(true);
  });

  it("wear each device's color, and none on All", () => {
    const chips = filterChips(DEVICES, lib(), "pages", (o) => (o === JESSE ? "var(--wa-person-2)" : undefined));
    expect(chips[0]!.color).toBeUndefined();
    expect(chips[2]!.color).toBe("var(--wa-person-2)");
    expect(chips[1]).not.toHaveProperty("color");
  });

  it("go back to All once their device is gone, and the Device menu to All without both kinds", () => {
    expect(resolveFilter(JESSE, DEVICES)).toBe(JESSE);
    expect(resolveFilter("gone", DEVICES)).toBe(ALL_FILTER);
    expect(resolveFilter(undefined, DEVICES)).toBe(ALL_FILTER);
    expect(hasBothKinds(DEVICES)).toBe(true);
    expect(hasBothKinds([CHEN_D, JESSE_D])).toBe(false);
    expect(resolveKind("iphone", DEVICES)).toBe("iphone");
    expect(resolveKind("iphone", [CHEN_D])).toBe("all");
  });
});

describe("a device's tab", () => {
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
    expect(REST_HINT).toBe("The rest of your home. Add one here with a tick.");
    expect(noPicksText(CHEN_D, "pages", "")).toBe("No pages on Chen Watch yet. Tick one below, or make a new one.");
    expect(noPicksText(CHEN_D, "status_pages", "zz")).toBe("No status page on Chen Watch has that name.");
  });
});

describe("which device a card opens on", () => {
  const entry = (id: string) => shownItems(lib(), "pages").find((e) => e.id === id)!;

  it("is the device tab's when it has the item, else the Device menu's kind, else the first watch", () => {
    expect(openDevice(entry(PAGE1), PHONE, "all", DEVICES)?.ownerId).toBe(PHONE);
    expect(openDevice(entry(PAGE1), CHEN, "all", DEVICES)?.ownerId).toBe(JESSE);
    expect(openDevice(entry(PAGE1), ALL_FILTER, "iphone", DEVICES)?.ownerId).toBe(PHONE);
    expect(openDevice(entry(PAGE1), ALL_FILTER, "all", DEVICES)?.ownerId).toBe(JESSE);
    expect(openDevice(entry(LIGHTS), ALL_FILTER, "iphone", DEVICES)?.ownerId).toBe(CHEN);
  });

  it("is none for an item no device has, and the card says so", () => {
    expect(openDevice(entry(LONELY), ALL_FILTER, "all", DEVICES)).toBeUndefined();
    expect(noOwnerText("pages")).toBe("No device has this page. Tick one to edit it there.");
  });
});

describe("the tab's words", () => {
  it("count the items in the home in the line under the title", () => {
    expect(allPagesLead(12)).toBe("12 pages in your home. Tick a device and the page is on it.");
    expect(allPagesLead(1)).toBe("1 page in your home. Tick a device and the page is on it.");
    expect(allPagesLead(5, "status_pages")).toBe("5 status pages in your home. A status page is a read-only screen of rows that a tile or a menu slot opens.");
  });

  it("say in the foot what a click and a tick do, as the mock does", () => {
    expect(footText("pages", undefined)).toBe("Click a page to edit it. Tick a device to show the page there. One page, the same everywhere.");
    expect(footText("status_pages", undefined)).toBe("Click a status page to edit it. Tick a device to put it there.");
    expect(footText("pages", JESSE_D)).toContain("Hide here");
    expect(footText("status_pages", JESSE_D)).not.toContain("Hide here");
    expect(footText("pages", undefined, true)).toBe("Click pages to pick them. Shift+click picks every page between two.");
  });

  it("say why there is nothing to show", () => {
    expect(emptyText([], "")).toBe("No watch or iPhone has connected yet. Pair one on the Home tab.");
    expect(emptyText(DEVICES, "")).toBe("Your home has no pages yet. Use New page to make one.");
    expect(emptyText(DEVICES, "zz")).toBe("No page has that name.");
    expect(emptyText(DEVICES, "", "iphone")).toBe("No page here is on an iPhone.");
    expect(emptyText(DEVICES, "", "all", "status_pages")).toBe("Your home has no status pages yet. Use New status page to make one.");
  });

  it("name the tab and a card by their kind", () => {
    expect(cardsTitle("pages")).toBe("Pages");
    expect(cardsTitle("status_pages")).toBe("Status pages");
    expect(cardNoun("status_pages", 2)).toBe("status pages");
    expect(aCard("status_pages")).toBe("a status page");
  });

  it("never break a sentence with a dash, and never speak of links", () => {
    const texts = [
      allPagesLead(2), allPagesLead(2, "status_pages"), footText("pages", JESSE_D), footText("pages", undefined), REST_HINT,
      orderHint(CHEN_D), noOwnerText("status_pages"), noPicksText(PHONE_D, "pages", ""), emptyText(DEVICES, ""),
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
