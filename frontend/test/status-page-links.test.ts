// Linked status pages, the Info pages of the Pages tab: the link call's
// kind, the status page editor's Devices menu, its Not on this list, and
// taking a status page off another device.

import { describe, expect, it } from "vitest";

import { type HassLike, type WatchPagesPlaces, linkWatchPages } from "../src/ha-api.js";
import { DEVICES_HERE_TEXT, DEVICES_WAIT_TAG, type LinkDevice, type ListRemoveIO } from "../src/watch-pages/links.js";
import type { JsonObject } from "../src/watch-pages/model.js";
import {
  elsewhereStatusPages,
  removeStatusPagesFrom,
  statusPageDevicePlaces,
  statusPageLinkId,
  statusPageMayLink,
} from "../src/watch-status-pages/links.js";
import type { StatusPagesDocument } from "../src/watch-status-pages/model.js";

const U = (n: number) => `5A7E0000-0000-4000-8000-${n.toString(16).toUpperCase().padStart(12, "0")}`;
const HOUSE = U(1), DOORS = U(2), MINE = U(3), CLASH = U(4);
const SYSTEM = "00000000-0000-0000-0000-000000000001";

const W1: LinkDevice = { ownerId: "w1", name: "Jesse's Watch", kind: "watch" };
const W2: LinkDevice = { ownerId: "w2", name: "Chen's Watch", kind: "watch" };
const P1: LinkDevice = { ownerId: "p1", name: "Jesse's iPhone", kind: "iphone" };
const DEVICES = [W1, W2, P1];

const sp = (id: string, name: string, extra: JsonObject = {}): JsonObject => ({ id, name, rows: [], ...extra });
const sdoc = (...pages: JsonObject[]): StatusPagesDocument => ({ schemaVersion: 1, statusPages: pages });

function recorder() {
  const sent: JsonObject[] = [];
  const hass = {
    connection: {
      sendMessagePromise: (msg: JsonObject) => {
        sent.push(msg);
        return Promise.resolve({ targets: {}, link_ids: {} });
      },
    },
  } as unknown as HassLike;
  return { hass, sent };
}

describe("the link call", () => {
  it("sends no kind for pages, as it always did", async () => {
    const { hass, sent } = recorder();
    await linkWatchPages(hass, "w1", ["A"], ["p1"]);
    expect(sent[0]).toEqual({ type: "wrist_assistant/watch_pages/link", source_id: "w1", page_ids: ["A"], targets: ["p1"] });
  });

  it("names the kind for status pages", async () => {
    const { hass, sent } = recorder();
    await linkWatchPages(hass, "w1", ["S"], ["p1", "w2"], "status_pages");
    expect(sent[0]).toEqual({ type: "wrist_assistant/watch_pages/link", source_id: "w1", page_ids: ["S"], targets: ["p1", "w2"], kind: "status_pages" });
  });
});

describe("a status page's Devices menu", () => {
  const places: WatchPagesPlaces = { pages: {}, status_pages: { S1: ["w1", "p1"] } };

  it("is on where the linked page is, this device stuck on", () => {
    const rows = statusPageDevicePlaces(DEVICES, sp(HOUSE, "House", { linkId: "S1" }), "w1", places);
    expect(rows.map((r) => [r.device.ownerId, r.on, r.here, r.stuck])).toEqual([
      ["w1", true, true, DEVICES_HERE_TEXT],
      ["w2", false, false, undefined],
      ["p1", true, false, undefined],
    ]);
  });

  it("knows only this device for a page with no link, or before the places are read", () => {
    expect(statusPageDevicePlaces(DEVICES, sp(DOORS, "Doors"), "w1", places).filter((r) => r.on).map((r) => r.device.ownerId)).toEqual(["w1"]);
    expect(statusPageDevicePlaces(DEVICES, sp(HOUSE, "House", { linkId: "S1" }), "w1", undefined).filter((r) => r.on).map((r) => r.device.ownerId)).toEqual(["w1"]);
  });

  it("greys a watch that waits for its iPhone to move its status pages", () => {
    const row = statusPageDevicePlaces(DEVICES, sp(DOORS, "Doors"), "w1", places, new Set(["w2"])).find((r) => r.device.ownerId === "w2")!;
    expect(row.tag).toBe(DEVICES_WAIT_TAG);
    expect(row.stuck).toBeDefined();
  });

  it("is not for a system status page", () => {
    expect(statusPageMayLink(sp(SYSTEM, "Lights On"))).toBe(false);
    expect(statusPageMayLink(sp(HOUSE, "House"))).toBe(true);
  });

  it("reads the link id only when it is a string", () => {
    expect(statusPageLinkId(sp(HOUSE, "House", { linkId: "S1" }))).toBe("S1");
    expect(statusPageLinkId(sp(HOUSE, "House", { linkId: "" }))).toBeUndefined();
    expect(statusPageLinkId(sp(HOUSE, "House", { linkId: 3 }))).toBeUndefined();
  });
});

describe("the Not on this list", () => {
  const here = sdoc(sp(SYSTEM, "Lights On"), sp(HOUSE, "House", { linkId: "S1" }), sp(CLASH, "Mine too"));
  const docs = new Map<string, StatusPagesDocument>([
    ["w2", sdoc(sp(SYSTEM, "Lights On"), sp(DOORS, "Doors", { linkId: "S2" }), sp(HOUSE, "House", { linkId: "S1" }), sp(CLASH, "Clash"))],
    ["p1", sdoc(sp(DOORS, "Doors", { linkId: "S2" }), sp(MINE, ""))],
  ]);

  it("lists what the other devices hold and this one does not, a linked one once", () => {
    const groups = elsewhereStatusPages("w1", here, DEVICES, docs);
    expect(groups.map((g) => [g.device.ownerId, g.pages.map((p) => [p.name, p.linkId])])).toEqual([
      ["w2", [["Doors", "S2"]]],
      ["p1", [["Untitled page", undefined]]],
    ]);
  });

  it("leaves out system pages and ids this device holds", () => {
    const ids = elsewhereStatusPages("w1", here, DEVICES, docs).flatMap((g) => g.pages.map((p) => p.pageId));
    expect(ids).not.toContain(SYSTEM);
    expect(ids).not.toContain(CLASH);
    expect(ids).not.toContain(HOUSE);
  });

  it("lists nothing for a device not read", () => {
    expect(elsewhereStatusPages("w1", here, DEVICES, new Map())).toEqual([]);
  });
});

describe("taking status pages off a device", () => {
  function store(document: StatusPagesDocument, conflicts = 0) {
    let revision = 4;
    let doc = document;
    let left = conflicts;
    const saves: StatusPagesDocument[] = [];
    const io: ListRemoveIO<StatusPagesDocument> = {
      read: () => Promise.resolve({ revision, document: doc }),
      save: (_owner, base, next) => {
        if (left > 0) {
          left--;
          revision++;
          return Promise.reject({ code: "conflict", message: "conflict" });
        }
        if (base !== revision) return Promise.reject({ code: "conflict", message: "conflict" });
        doc = next;
        saves.push(next);
        return Promise.resolve({ revision: ++revision });
      },
    };
    return { io, saves, now: () => doc };
  }

  it("saves the record without them, in one save, naming them as stored", async () => {
    const s = store(sdoc(sp(HOUSE, "House"), sp(DOORS, "Doors"), sp(MINE, "Mine")));
    expect(await removeStatusPagesFrom(s.io, "w2", [HOUSE.toLowerCase(), MINE])).toEqual({ ok: true, removed: [HOUSE, MINE] });
    expect(s.saves).toHaveLength(1);
    expect((s.now().statusPages as JsonObject[]).map((p) => p.name)).toEqual(["Doors"]);
  });

  it("saves nothing when none is there", async () => {
    const s = store(sdoc(sp(DOORS, "Doors")));
    expect(await removeStatusPagesFrom(s.io, "w2", [HOUSE])).toEqual({ ok: true, removed: [] });
    expect(s.saves).toHaveLength(0);
  });

  it("reads again after a conflict", async () => {
    const s = store(sdoc(sp(HOUSE, "House"), sp(DOORS, "Doors")), 1);
    expect(await removeStatusPagesFrom(s.io, "w2", [HOUSE])).toEqual({ ok: true, removed: [HOUSE] });
    expect(s.saves).toHaveLength(1);
  });
});
