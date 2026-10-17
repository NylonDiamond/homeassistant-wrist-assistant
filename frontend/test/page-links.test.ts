// Linked pages: which devices hold a page, its Devices menu, the badge on
// its row, the Not on this list, the delete choices, what else a link
// added, and taking a page off another device.

import { describe, expect, it } from "vitest";

import type { OwnerSummary, WatchConfigRecord, WatchPagesPlaces } from "../src/ha-api.js";
import { WAIT_FOR_IPHONE_TEXT } from "../src/watch-settings.js";
import {
  DEVICES_HERE_TEXT,
  DEVICES_SYSTEM_TEXT,
  DEVICES_WAIT_TAG,
  DEVICES_WAIT_TEXT,
  type LinkDevice,
  type PageRemoveIO,
  type PagesRecordFacts,
  awaitingMove,
  deleteChoices,
  elsewherePages,
  elsewhereTitle,
  freePlanText,
  linkAlsoAddedText,
  linkBadgeText,
  linkErrorText,
  pageDevicePlaces,
  pageHolders,
  pageLinkId,
  pagesRecordFacts,
  removePageFrom,
  statusPageHolders,
  statusPagesSharedText,
} from "../src/watch-pages/links.js";
import type { WatchPage, WatchPagesDocument } from "../src/watch-pages/model.js";

const U = (n: number) => `5A17E000-0000-4000-8000-${n.toString(16).toUpperCase().padStart(12, "0")}`;
const HALL = U(1), YARD = U(2), DEN = U(3), MINE = U(4), SYS = U(5);

const W1: LinkDevice = { ownerId: "w1", name: "Jesse's Watch", kind: "watch" };
const W2: LinkDevice = { ownerId: "w2", name: "Chen's Watch", kind: "watch" };
const P1: LinkDevice = { ownerId: "p1", name: "Jesse's iPhone", kind: "iphone" };
const DEVICES = [W1, W2, P1];

const page = (id: string, name: string, extra: Partial<WatchPage> = {}): WatchPage => ({ id, name, items: [], ...extra });
const doc = (...pages: WatchPage[]): WatchPagesDocument => ({ schemaVersion: 1, pages });

const PLACES: WatchPagesPlaces = { pages: { L1: ["w1", "p1"], L2: ["w1", "w2", "p1"] }, status_pages: {} };

describe("which devices hold a page", () => {
  it("are the devices its link lists, this one first", () => {
    expect(pageHolders(page(HALL, "Hall", { linkId: "L1" }), "p1", PLACES)).toEqual(["p1", "w1"]);
    expect(pageHolders(page(HALL, "Hall", { linkId: "L2" }), "w1", PLACES)).toEqual(["w1", "w2", "p1"]);
  });

  it("is this device alone for a page with no link, an unknown link, or no places yet", () => {
    expect(pageHolders(page(HALL, "Hall"), "w1", PLACES)).toEqual(["w1"]);
    expect(pageHolders(page(HALL, "Hall", { linkId: "L9" }), "w1", PLACES)).toEqual(["w1"]);
    expect(pageHolders(page(HALL, "Hall", { linkId: "L1" }), "w1", undefined)).toEqual(["w1"]);
  });

  it("reads a link only from a string that is not empty", () => {
    expect(pageLinkId(page(HALL, "Hall", { linkId: "" }))).toBeUndefined();
    expect(pageLinkId(page(HALL, "Hall", { linkId: 4 }))).toBeUndefined();
    expect(pageLinkId(page(HALL, "Hall", { linkId: "L1" }))).toBe("L1");
  });
});

describe("the Devices menu", () => {
  it("has a switch per device, on where the page is, and this device's cannot go off", () => {
    const places = pageDevicePlaces(DEVICES, page(HALL, "Hall", { linkId: "L1" }), "w1", PLACES);
    expect(places.map((p) => [p.device.ownerId, p.on, p.here, p.stuck])).toEqual([
      ["w1", true, true, DEVICES_HERE_TEXT],
      ["w2", false, false, undefined],
      ["p1", true, false, undefined],
    ]);
  });

  it("moves nothing for a system page", () => {
    const places = pageDevicePlaces(DEVICES, page(SYS, "System", { isSystemPage: true }), "w1", PLACES);
    expect(places.every((p) => p.stuck === DEVICES_SYSTEM_TEXT)).toBe(true);
  });

  it("greys out a watch that waits for its iPhone, with the reason on its row", () => {
    const places = pageDevicePlaces(DEVICES, page(HALL, "Hall", { linkId: "L1" }), "p1", PLACES, new Set(["w2"]));
    expect(places.map((p) => [p.device.ownerId, p.stuck, p.tag])).toEqual([
      ["w1", undefined, undefined],
      ["w2", DEVICES_WAIT_TEXT, DEVICES_WAIT_TAG],
      ["p1", DEVICES_HERE_TEXT, undefined],
    ]);
    expect(DEVICES_WAIT_TEXT.startsWith(WAIT_FOR_IPHONE_TEXT)).toBe(true);
    expect(`${DEVICES_WAIT_TEXT} ${DEVICES_WAIT_TAG}`).not.toMatch(/ - |–|—/);
  });
});

describe("a watch that waits for its iPhone", () => {
  const owner = (id: string, has_iphone?: boolean): OwnerSummary => ({ owner_watch_id: id, has_iphone } as OwnerSummary);
  const OWNERS = [owner("w1", true), owner("w2", true), owner("w3", false), owner("w4", true)];
  const facts = new Map<string, PagesRecordFacts>([
    ["w1", { held: false, free: false }],
    ["w2", { held: true, free: false }],
    ["w3", { held: false, free: false }],
  ]);

  it("is one whose iPhone may still move its pages, while Home Assistant holds none", () => {
    // w2 holds pages already, w3 has no iPhone to wait for, w4 was not read.
    expect([...awaitingMove(OWNERS, facts)]).toEqual(["w1"]);
  });

  it("reads a record's facts: held from its revision, free only from an explicit false", () => {
    expect(pagesRecordFacts({ revision: 0 })).toEqual({ held: false, free: false });
    expect(pagesRecordFacts({ revision: 3, multiple_pages: null })).toEqual({ held: true, free: false });
    expect(pagesRecordFacts({ revision: 3, multiple_pages: true })).toEqual({ held: true, free: false });
    expect(pagesRecordFacts({ revision: 3, multiple_pages: false })).toEqual({ held: true, free: true });
  });
});

describe("the free plan line", () => {
  it("names the devices that show only their first page", () => {
    expect(freePlanText([])).toBeUndefined();
    expect(freePlanText(["Chen's Watch"])).toBe("On the free plan, Chen's Watch shows only its first page.");
    expect(freePlanText(["Chen's Watch", "Jesse's Watch"])).toBe("On the free plan, Chen's Watch and Jesse's Watch show only their first page.");
  });
});

describe("linked status pages", () => {
  const SP: WatchPagesPlaces = { pages: {}, status_pages: { S1: ["w1", "p1"], S2: ["w1", "w2", "gone"] } };
  const sp = (id: string, linkId?: string) => ({ id, name: id, rows: [], ...(linkId === undefined ? {} : { linkId }) });

  it("are held where their link's places say, this device first", () => {
    expect(statusPageHolders(sp("a", "S1"), "p1", SP)).toEqual(["p1", "w1"]);
    expect(statusPageHolders(sp("a"), "p1", SP)).toEqual(["p1"]);
    expect(statusPageHolders(sp("a", "S1"), "p1", undefined)).toEqual(["p1"]);
    // The link is a status page link: a page link of the same id counts for nothing.
    expect(statusPageHolders(sp("a", "S1"), "p1", { pages: { S1: ["w2"] }, status_pages: {} })).toEqual(["p1"]);
  });

  it("say on one line which other devices an edit here also changes", () => {
    expect(statusPagesSharedText([sp("a", "S1")], "p1", SP, DEVICES)).toBe("This status page is also on Jesse's Watch. An edit here shows there too.");
    expect(statusPagesSharedText([sp("a", "S1"), sp("b", "S1")], "p1", SP, DEVICES))
      .toBe("These status pages are also on Jesse's Watch. An edit here shows there too.");
    expect(statusPagesSharedText([sp("a", "S1"), sp("b"), sp("c", "S2")], "w1", SP, DEVICES))
      .toBe("2 of these status pages are also on Chen's Watch, Jesse's iPhone and another device. An edit here shows there too.");
    expect(statusPagesSharedText([sp("a"), sp("b", "S9")], "w1", SP, DEVICES)).toBeUndefined();
    expect(statusPagesSharedText([sp("a", "S1")], "w1", undefined, DEVICES)).toBeUndefined();
  });
});

describe("the badge on a page row", () => {
  it("names the one other device, or counts them all", () => {
    expect(linkBadgeText(["w1", "p1"], "w1", DEVICES)).toBe("Also on Jesse's iPhone");
    expect(linkBadgeText(["p1", "w1"], "p1", DEVICES)).toBe("Also on Jesse's Watch");
    expect(linkBadgeText(["w1", "w2", "p1"], "w1", DEVICES)).toBe("On 3 devices");
  });

  it("is none on one device, and counts a device the panel does not list", () => {
    expect(linkBadgeText(["w1"], "w1", DEVICES)).toBeUndefined();
    expect(linkBadgeText(["w1", "gone"], "w1", DEVICES)).toBe("On 2 devices");
  });
});

describe("the Not on this list", () => {
  const docs = new Map<string, WatchPagesDocument>([
    ["w1", doc(page(HALL, "Hall", { linkId: "L1" }), page(YARD, "Yard", { linkId: "L2" }), page(DEN, "Den"), page(SYS, "System", { isSystemPage: true }))],
    ["w2", doc(page(YARD, "Yard", { linkId: "L2" }), page(U(9), "Chen's"))],
  ]);

  it("lists the pages the others hold and this one does not, per device, each link once", () => {
    const here = doc(page(HALL, "Hall", { linkId: "L1" }), page(MINE, "Mine"));
    const groups = elsewherePages("p1", here, DEVICES, docs);
    expect(groups.map((g) => [g.device.ownerId, g.pages.map((p) => p.name)])).toEqual([
      ["w1", ["Yard", "Den"]],
      ["w2", ["Chen's"]],
    ]);
    expect(groups[0]!.pages[0]).toMatchObject({ ownerId: "w1", pageId: YARD, linkId: "L2" });
    expect(groups[0]!.pages[1]).not.toHaveProperty("linkId");
  });

  it("leaves out a page whose id this device holds, and every system page", () => {
    const here = doc(page(DEN.toLowerCase(), "Den"));
    const groups = elsewherePages("p1", here, DEVICES, docs);
    expect(groups.flatMap((g) => g.pages.map((p) => p.name))).toEqual(["Hall", "Yard", "Chen's"]);
  });

  it("lists everything for a device with no pages, and skips itself and a device not read", () => {
    const groups = elsewherePages("w2", undefined, DEVICES, docs);
    expect(groups.map((g) => g.device.ownerId)).toEqual(["w1"]);
    expect(groups[0]!.pages.map((p) => p.name)).toEqual(["Hall", "Yard", "Den"]);
  });

  it("is headed for the device on screen", () => {
    expect(elsewhereTitle("iphone")).toBe("Not on this iPhone");
    expect(elsewhereTitle("watch")).toBe("Not on this watch");
  });
});

describe("the delete choices", () => {
  it("are here or on every device, for a page on several", () => {
    expect(deleteChoices(["p1", "w1"], "iphone")).toEqual({ here: "Delete on this iPhone", all: "Delete on all 2 devices", count: 2 });
    expect(deleteChoices(["w1", "w2", "p1"], "watch")).toEqual({ here: "Delete on this watch", all: "Delete on all 3 devices", count: 3 });
  });

  it("are none for a page on one device", () => {
    expect(deleteChoices(["w1"], "watch")).toBeUndefined();
  });
});

describe("what else a link added", () => {
  const source = doc(page(HALL, "Hall"), page(YARD, "Yard"), page(DEN, "Den"));

  it("names the pages beside the one asked for, and counts the status pages", () => {
    const reply = { targets: { p1: { pages: [HALL, YARD, DEN], status_pages: [U(11)] } }, link_ids: {} };
    expect(linkAlsoAddedText(reply, "p1", [HALL.toLowerCase()], source)).toBe("Also added: Yard, Den and 1 status page.");
  });

  it("is nothing when only the page asked for went", () => {
    const reply = { targets: { p1: { pages: [HALL], status_pages: [] } }, link_ids: {} };
    expect(linkAlsoAddedText(reply, "p1", [HALL], source)).toBeUndefined();
    expect(linkAlsoAddedText(reply, "w2", [HALL], source)).toBeUndefined();
  });
});

describe("a refused link", () => {
  it("is said in the editor's words, by its code", () => {
    expect(linkErrorText({ code: "id_taken", message: "x" })).toBe("That device already has a page of its own with the same id, so it was not added.");
    expect(linkErrorText({ code: "system_page", message: "x" })).toBe(DEVICES_SYSTEM_TEXT);
    expect(linkErrorText({ code: "unknown_command", message: "x" })).toMatch(/Update it first\./);
    expect(linkErrorText({ code: "unavailable", message: "Not ready." })).toBe("Not ready.");
  });

  it("says a watch still waits for its iPhone in the page editor's wait words", () => {
    expect(linkErrorText({ code: "awaiting_move", message: "awaiting move" })).toBe(`${WAIT_FOR_IPHONE_TEXT} Try again after that.`);
  });

  it("never uses a dash to break a sentence", () => {
    for (const code of ["unknown_device", "not_found", "system_page", "id_taken", "unknown_command", "awaiting_move"]) {
      expect(linkErrorText({ code, message: "" })).not.toMatch(/ - |–|—/);
    }
  });
});

describe("taking a page off another device", () => {
  function device(pages: WatchPagesDocument | undefined, conflicts = 0) {
    let held: { revision: number; document?: unknown } = pages === undefined ? { revision: 0 } : { revision: 5, document: pages };
    const saves: { base: number; document: WatchPagesDocument }[] = [];
    let left = conflicts;
    const io: PageRemoveIO = {
      read: async () => held as Pick<WatchConfigRecord, "revision" | "document">,
      save: async (_owner, base, document) => {
        if (left > 0) {
          left--;
          held = { revision: held.revision + 1, document: held.document };
          throw { code: "conflict", message: "stored revision moved" };
        }
        if (base !== held.revision) throw { code: "conflict", message: "stale" };
        saves.push({ base, document });
        held = { revision: base + 1, document };
        return { revision: base + 1 };
      },
    };
    return { io, saves };
  }

  it("saves its pages without the page, keeping the tiles that opened it", async () => {
    const pages = doc(page(HALL, "Hall", { items: [{ id: U(100), entityId: `page.${YARD}`, gridCol: 0, gridRow: 0, colSpan: 6, rowSpan: 3 }] }), page(YARD, "Yard"));
    const d = device(pages);
    expect(await removePageFrom(d.io, "w2", YARD.toLowerCase())).toEqual({ ok: true, removed: true });
    expect(d.saves).toHaveLength(1);
    expect(d.saves[0]!.base).toBe(5);
    expect((d.saves[0]!.document.pages as WatchPage[]).map((p) => p.name)).toEqual(["Hall"]);
    expect(((d.saves[0]!.document.pages as WatchPage[])[0]!.items as unknown[]).length).toBe(1);
  });

  it("reads again on a conflict, and gives up after three tries", async () => {
    const once = device(doc(page(YARD, "Yard")), 1);
    expect(await removePageFrom(once.io, "w2", YARD)).toEqual({ ok: true, removed: true });
    expect(once.saves[0]!.base).toBe(6);
    const stuck = device(doc(page(YARD, "Yard")), 5);
    expect(await removePageFrom(stuck.io, "w2", YARD)).toMatchObject({ ok: false, code: "conflict" });
  });

  it("writes nothing where the page is not", async () => {
    const none = device(undefined);
    expect(await removePageFrom(none.io, "w2", YARD)).toEqual({ ok: true, removed: false });
    const other = device(doc(page(HALL, "Hall")));
    expect(await removePageFrom(other.io, "w2", YARD)).toEqual({ ok: true, removed: false });
    expect(other.saves).toEqual([]);
  });

  it("says why a read failed", async () => {
    const io: PageRemoveIO = { read: async () => { throw { code: "unavailable", message: "Not ready." }; }, save: async () => ({ revision: 1 }) };
    expect(await removePageFrom(io, "w2", YARD)).toEqual({ ok: false, code: "unavailable", message: "Not ready." });
  });
});
