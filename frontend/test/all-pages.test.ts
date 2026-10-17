// The Pages tab's and the Status pages tab's rules: every page as cards (a linked page once), the
// device tabs and their colors, the Device menu, what a tab, a search and
// the menu show, which device a card opens
// on, its Devices menu, where a link copies from, and its words. Plus the
// page editor's one line in place of the Not on this list.

import { describe, expect, it } from "vitest";

import {
  ALL_FILTER,
  DEVICES_LAST_TEXT,
  STATUS_DEVICES_DIRTY_TEXT,
  STATUS_DEVICES_LAST_TEXT,
  aCard,
  allPagesLead,
  cardDetail,
  cardDevicePlaces,
  cardNoun,
  cardsOfKind,
  cardsTitle,
  devicesDirtyText,
  emptyText,
  filterChips,
  hasBothKinds,
  kindOptions,
  linkSource,
  openCopy,
  pageCards,
  resolveFilter,
  resolveKind,
  shownCards,
} from "../src/watch-pages/all-pages-model.js";
import type { StatusPagesDocument } from "../src/watch-status-pages/model.js";
import { DEVICES_SYSTEM_TEXT, DEVICES_WAIT_TAG, DEVICES_WAIT_TEXT, type LinkDevice, elsewhereLine, elsewherePages, linkDevicesOf } from "../src/watch-pages/links.js";
import type { WatchPage, WatchPagesDocument } from "../src/watch-pages/model.js";
import type { OwnerSummary } from "../src/ha-api.js";
import { deviceColor, deviceColors } from "../src/device-colors.js";

const U = (n: number) => `5A17E000-0000-4000-8000-${n.toString(16).toUpperCase().padStart(12, "0")}`;
const HALL = U(1), YARD = U(2), DEN = U(3), MINE = U(4), SYS = U(5), SMART = U(6);

const W1: LinkDevice = { ownerId: "w1", name: "Jesse's Watch", kind: "watch" };
const W2: LinkDevice = { ownerId: "w2", name: "Chen's Watch", kind: "watch" };
const P1: LinkDevice = { ownerId: "p1", name: "Jesse's iPhone", kind: "iphone" };
const DEVICES = [W1, W2, P1];

const tile = (n: number) => ({ id: U(100 + n), entityId: `light.l${n}`, gridCol: 0, gridRow: n * 3, colSpan: 6, rowSpan: 3 });
const page = (id: string, name: string, extra: Partial<WatchPage> = {}): WatchPage => ({ id, name, items: [], ...extra });
const doc = (...pages: WatchPage[]): WatchPagesDocument => ({ schemaVersion: 1, pages });

/** Hall linked on all three (hidden on the phone), Yard linked on the
 * first watch and the phone, Den on the first watch alone, Mine on the
 * phone alone, a system page on the second watch, and a smart page there. */
const DOCS = new Map<string, WatchPagesDocument>([
  ["w1", doc(page(HALL, "Hall", { linkId: "L1", items: [tile(1), tile(2)] }), page(YARD, "Yard", { linkId: "L2" }), page(DEN, "Den", { items: [tile(1)] }))],
  ["w2", doc(page(SYS, "Now playing", { isSystemPage: true }), page(HALL, "Hall", { linkId: "L1", items: [tile(1), tile(2)] }), page(SMART, "Lights on", { dynamicConfig: {} }))],
  ["p1", doc(page(MINE, "Mine"), page(YARD, "Yard", { linkId: "L2" }), page(HALL, "Hall", { linkId: "L1", isHidden: true, items: [tile(1), tile(2)] }))],
]);

describe("the cards", () => {
  const cards = pageCards(DEVICES, DOCS);

  it("are one per page, a linked page once, in device order then page order", () => {
    expect(cards.map((c) => c.name)).toEqual(["Hall", "Yard", "Den", "Lights on", "Mine"]);
  });

  it("carry a copy per device that holds the page, in device order, hidden where that device hides it", () => {
    const hall = cards[0]!;
    expect(hall.linkId).toBe("L1");
    expect(hall.copies.map((c) => [c.device.ownerId, c.hidden, c.index])).toEqual([["w1", false, 0], ["w2", false, 0], ["p1", true, 2]]);
    expect(cards[2]!.copies.map((c) => c.device.ownerId)).toEqual(["w1"]);
    expect(cards[2]!.linkId).toBeUndefined();
  });

  it("leave system pages out, as the page editor lists none", () => {
    expect(cards.some((c) => c.pageId === SYS)).toBe(false);
  });

  it("keep two unlinked pages with one id apart: only a link joins pages", () => {
    const docs = new Map([["w1", doc(page(DEN, "Den"))], ["w2", doc(page(DEN, "Den"))]]);
    expect(pageCards(DEVICES, docs).map((c) => c.copies.length)).toEqual([1, 1]);
  });

  it("are none for a device not read", () => {
    expect(pageCards([P1], new Map())).toEqual([]);
  });

  it("say their tiles, or Smart page", () => {
    expect(cardDetail(cards[0]!)).toBe("2 tiles");
    expect(cardDetail(cards[2]!)).toBe("1 tile");
    expect(cardDetail(cards[1]!)).toBe("0 tiles");
    expect(cardDetail(cards[3]!)).toBe("Smart page");
  });
});

describe("the filter", () => {
  const cards = pageCards(DEVICES, DOCS);

  it("has All, then a tab per device, each with its color and its count", () => {
    const colors = new Map([["w1", "var(--wa-person-1)"], ["w2", "var(--wa-person-2)"], ["p1", "var(--wa-person-3)"]]);
    expect(filterChips(DEVICES, cards, (id) => colors.get(id))).toEqual([
      { id: "all", label: "All", count: 5 },
      { id: "w1", label: "Jesse's Watch", kind: "watch", color: "var(--wa-person-1)", count: 3 },
      { id: "w2", label: "Chen's Watch", kind: "watch", color: "var(--wa-person-2)", count: 2 },
      { id: "p1", label: "Jesse's iPhone", kind: "iphone", color: "var(--wa-person-3)", count: 3 },
    ]);
  });

  it("shows one device's pages in that device's own order", () => {
    expect(shownCards(cards, "p1").map((c) => c.name)).toEqual(["Mine", "Yard", "Hall"]);
    expect(shownCards(cards, ALL_FILTER).map((c) => c.name)).toEqual(["Hall", "Yard", "Den", "Lights on", "Mine"]);
  });

  it("finds a page by name in any case, under the filter too", () => {
    expect(shownCards(cards, ALL_FILTER, "  ha ").map((c) => c.name)).toEqual(["Hall"]);
    expect(shownCards(cards, "w2", "yard")).toEqual([]);
  });

  it("keeps the pages on one kind of device under the Device menu, counted for the menu", () => {
    expect(shownCards(cards, ALL_FILTER, "", "iphone").map((c) => c.name)).toEqual(["Hall", "Yard", "Mine"]);
    expect(shownCards(cards, ALL_FILTER, "", "watch").map((c) => c.name)).toEqual(["Hall", "Yard", "Den", "Lights on"]);
    expect(shownCards(cards, "w1", "", "iphone").map((c) => c.name)).toEqual(["Hall", "Yard"]);
    expect(kindOptions(cards)).toEqual([
      { key: "all", label: "All", count: 5 },
      { key: "watch", label: "Watches", count: 4 },
      { key: "iphone", label: "iPhones", count: 3 },
    ]);
  });

  it("has a Device menu only on a home with watches and iPhones", () => {
    expect(hasBothKinds(DEVICES)).toBe(true);
    expect(hasBothKinds([W1, W2])).toBe(false);
    expect(resolveKind("iphone", DEVICES)).toBe("iphone");
    expect(resolveKind("iphone", [W1, W2])).toBe("all");
    expect(resolveKind(undefined, DEVICES)).toBe("all");
  });

  it("goes back to All when its device is gone", () => {
    expect(resolveFilter("p1", DEVICES)).toBe("p1");
    expect(resolveFilter("gone", DEVICES)).toBe("all");
    expect(resolveFilter(undefined, DEVICES)).toBe("all");
  });
});

describe("which device a card opens on", () => {
  const cards = pageCards(DEVICES, DOCS);
  const [hall, yard, , , mine] = cards;

  it("is the filtered device when the page is there", () => {
    expect(openCopy(hall!, "p1").device.ownerId).toBe("p1");
    expect(openCopy(hall!, "w2").device.ownerId).toBe("w2");
  });

  it("is the Device menu's kind next, when the page is on one", () => {
    expect(openCopy(hall!, ALL_FILTER, "iphone").device.ownerId).toBe("p1");
    expect(openCopy(hall!, "w2", "iphone").device.ownerId).toBe("w2");
  });

  it("is otherwise the first watch, else the first device", () => {
    expect(openCopy(yard!, ALL_FILTER).device.ownerId).toBe("w1");
    expect(openCopy(yard!, "w2").device.ownerId).toBe("w1");
    expect(openCopy(mine!, ALL_FILTER).device.ownerId).toBe("p1");
    const phoneFirst = pageCards([P1, W1], new Map([["p1", doc(page(HALL, "Hall", { linkId: "L1" }))], ["w1", doc(page(HALL, "Hall", { linkId: "L1" }))]]));
    expect(openCopy(phoneFirst[0]!, ALL_FILTER).device.ownerId).toBe("w1");
  });
});

describe("each device's color", () => {
  const owner = (id: string, kind: string): OwnerSummary =>
    ({ owner_watch_id: id, device_name: id, device_kind: kind, phone_pages: kind === "iphone", is_orphan: false }) as unknown as OwnerSummary;
  const owners = [owner("p1", "iphone"), owner("w1", "watch"), owner("w2", "watch")];

  it("is the shared device color, in the device tabs' order", () => {
    const colors = deviceColors(owners);
    const devices = linkDevicesOf(owners, true);
    const chips = filterChips(devices, [], (id) => deviceColor(colors, id)).slice(1);
    expect(chips.map((c) => [c.id, c.color])).toEqual([
      ["w1", "var(--wa-person-1)"], ["w2", "var(--wa-person-2)"], ["p1", "var(--wa-person-3)"],
    ]);
  });

  it("leaves a tab plain with no colors given", () => {
    expect(filterChips(DEVICES, []).every((c) => c.color === undefined)).toBe(true);
  });
});

describe("a card's Devices menu", () => {
  const cards = pageCards(DEVICES, DOCS);

  it("has a switch per device, on where the page is, none of them this device", () => {
    const places = cardDevicePlaces(DEVICES, cards[1]!);
    expect(places.map((p) => [p.device.ownerId, p.on, p.here, p.stuck])).toEqual([
      ["w1", true, false, undefined], ["w2", false, false, undefined], ["p1", true, false, undefined],
    ]);
  });

  it("greys out a watch that waits for its iPhone, unless the page is on it", () => {
    const places = cardDevicePlaces(DEVICES, cards[1]!, new Set(["w2", "p1"]));
    expect(places.map((p) => [p.device.ownerId, p.stuck, p.tag])).toEqual([
      ["w1", undefined, undefined], ["w2", DEVICES_WAIT_TEXT, DEVICES_WAIT_TAG], ["p1", undefined, undefined],
    ]);
  });

  it("cannot switch off a page's only device", () => {
    const places = cardDevicePlaces(DEVICES, cards[2]!);
    expect(places.map((p) => p.stuck)).toEqual([DEVICES_LAST_TEXT, undefined, undefined]);
  });

  it("moves nothing for a system page", () => {
    const sys = pageCards([W1], new Map([["w1", doc(page(SYS, "Now playing", { isSystemPage: true }))]]));
    expect(sys).toEqual([]);
    const card = { ...cards[2]!, copies: [{ ...cards[2]!.copies[0]!, page: page(SYS, "Now playing", { isSystemPage: true }) }] };
    expect(cardDevicePlaces(DEVICES, card).every((p) => p.stuck === DEVICES_SYSTEM_TEXT)).toBe(true);
  });

  it("links from the first device with no unsaved edits, or from none", () => {
    const hall = cards[0]!;
    expect(linkSource(hall, () => false)).toBe("w1");
    expect(linkSource(hall, (id) => id === "w1")).toBe("w2");
    expect(linkSource(hall, () => true)).toBeUndefined();
  });
});

describe("the tab's words", () => {
  it("say why there is nothing to show", () => {
    expect(emptyText(ALL_FILTER, [], "")).toBe("No watch or iPhone has connected yet. Pair one on the Home tab.");
    expect(emptyText(ALL_FILTER, DEVICES, "")).toBe("No device has pages yet. Open a device's Pages to make one.");
    expect(emptyText("p1", DEVICES, "")).toBe("No pages on Jesse's iPhone yet.");
    expect(emptyText("p1", DEVICES, "zz")).toBe("No page has that name.");
    expect(emptyText("w2", DEVICES, "", "iphone")).toBe("No page here is on an iPhone.");
  });

  it("count the pages in the line under the title", () => {
    expect(allPagesLead(1)).toBe("1 page on your watches and iPhones. A page on more than one device is the same page: an edit shows on all of them.");
    expect(allPagesLead(4)).toMatch(/^4 pages on/);
  });

  it("never break a sentence with a dash", async () => {
    const model = await import("../src/watch-pages/all-pages-model.js");
    for (const text of [model.allPagesLead(2), model.DEVICES_LAST_TEXT, model.DEVICES_DIRTY_TEXT, model.emptyText("w1", DEVICES, "", "watch")]) {
      expect(text).not.toMatch(/[–—]| - /);
    }
  });
});

describe("the page editor's line for the other devices' pages", () => {
  it("counts the pages this device does not hold, a linked page once", () => {
    const groups = elsewherePages("p1", DOCS.get("p1"), DEVICES, DOCS);
    expect(elsewhereLine(groups)).toBe("2 pages on other devices.");
    const one = elsewherePages("w2", DOCS.get("w2"), DEVICES, new Map([["w1", doc(page(DEN, "Den"))]]));
    expect(elsewhereLine(one)).toBe("1 page on other devices.");
    expect(elsewhereLine([])).toBeUndefined();
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

describe("status pages", () => {
  const SP = (n: number) => `5A7E0000-0000-4000-8000-${n.toString(16).toUpperCase().padStart(12, "0")}`;
  const HOUSE = SP(1), DOORS = SP(2), PHONE = SP(3);
  const STARTER = "00000000-0000-0000-0000-000000000001";
  const sp = (id: string, name: string, extra: Record<string, unknown> = {}) => ({ id, name, rows: [], ...extra });
  const sdoc = (...pages: Record<string, unknown>[]): StatusPagesDocument => ({ schemaVersion: 1, statusPages: pages });
  /** House linked on the first watch and the phone, with two rows; Doors on
   * the first watch alone; the phone's own one; a starter page on two. */
  const STATUS = new Map<string, StatusPagesDocument>([
    ["w1", sdoc(sp(STARTER, "Lights On"), sp(HOUSE, "House", { linkId: "S1", rows: [{ id: "r1" }, { id: "r2" }] }), sp(DOORS, "Doors"))],
    ["w2", sdoc(sp(STARTER, "Lights On"))],
    ["p1", sdoc(sp(PHONE, ""), sp(HOUSE, "House", { linkId: "S1", rows: [{ id: "r1" }, { id: "r2" }] }))],
  ]);
  const cards = pageCards(DEVICES, DOCS, STATUS);
  const statuses = cardsOfKind(cards, "status_pages");

  it("are cards of their own kind after the pages, a linked one once, the starter pages left out", () => {
    expect(cardsOfKind(cards, "pages").map((c) => c.name)).toEqual(["Hall", "Yard", "Den", "Lights on", "Mine"]);
    expect(statuses.map((c) => [c.name, c.copies.map((p) => p.device.ownerId)])).toEqual([
      ["House", ["w1", "p1"]],
      ["Doors", ["w1"]],
      ["Untitled page", ["p1"]],
    ]);
    expect(statuses.every((c) => c.kind === "status_pages")).toBe(true);
    expect(statuses[0]!.key).toBe("status-link:S1");
    expect(cards.some((c) => c.pageId === STARTER)).toBe(false);
  });

  it("count their rows, and have no Hidden", () => {
    expect(cardDetail(statuses[0]!)).toBe("2 rows");
    expect(cardDetail(statuses[1]!)).toBe("0 rows");
    expect(statuses[0]!.copies.every((c) => !c.hidden)).toBe(true);
  });

  it("name the tab and a card by their kind", () => {
    expect(cardsTitle("pages")).toBe("Pages");
    expect(cardsTitle("status_pages")).toBe("Status pages");
    expect([cardNoun("status_pages"), cardNoun("status_pages", 2), aCard("status_pages")]).toEqual(["status page", "status pages", "a status page"]);
    expect([cardNoun("pages"), cardNoun("pages", 2), aCard("pages")]).toEqual(["page", "pages", "a page"]);
  });

  it("go through the device tabs, the search and the Device menu as pages do", () => {
    expect(filterChips(DEVICES, statuses).map((c) => [c.id, c.count])).toEqual([["all", 3], ["w1", 2], ["w2", 0], ["p1", 2]]);
    expect(shownCards(statuses, "p1").map((c) => c.name)).toEqual(["Untitled page", "House"]);
    expect(shownCards(statuses, ALL_FILTER, "door").map((c) => c.name)).toEqual(["Doors"]);
    expect(shownCards(statuses, ALL_FILTER, "", "iphone").map((c) => c.name)).toEqual(["House", "Untitled page"]);
  });

  it("have a Devices menu whose last switch says to delete in the status pages editor", () => {
    const doors = statuses[1]!;
    const rows = cardDevicePlaces(DEVICES, doors, new Set(["w2"]));
    expect(rows.map((r) => [r.device.ownerId, r.on, r.stuck])).toEqual([
      ["w1", true, STATUS_DEVICES_LAST_TEXT],
      ["w2", false, DEVICES_WAIT_TEXT],
      ["p1", false, undefined],
    ]);
  });

  it("ask the status pages editors about unsaved edits for the link's source", () => {
    const house = statuses[0]!;
    expect(linkSource(house, (id, kind) => kind === "status_pages" && id === "w1")).toBe("p1");
    expect(devicesDirtyText("status_pages")).toBe(STATUS_DEVICES_DIRTY_TEXT);
  });

  it("have their own words", () => {
    expect(allPagesLead(1, "status_pages")).toBe("1 status page on your watches and iPhones. A status page is a read-only screen of rows that a tile or a menu slot opens.");
    expect(emptyText(ALL_FILTER, DEVICES, "zz", "all", "status_pages")).toBe("No status page has that name.");
    expect(emptyText("w2", DEVICES, "", "all", "status_pages")).toMatch(/^No status pages on Chen's Watch yet\./);
    expect(emptyText("w2", DEVICES, "", "iphone", "status_pages")).toBe("No status page here is on an iPhone.");
    expect(emptyText(ALL_FILTER, DEVICES, "", "all", "status_pages")).toBe("No device has status pages of its own yet. Use New status page to make one.");
    for (const text of [allPagesLead(2, "status_pages"), STATUS_DEVICES_LAST_TEXT, STATUS_DEVICES_DIRTY_TEXT, emptyText(ALL_FILTER, DEVICES, "", "all", "status_pages")]) {
      expect(text).not.toMatch(/[–—]| - /);
      expect(text).not.toMatch(/info page/i);
    }
  });
});
