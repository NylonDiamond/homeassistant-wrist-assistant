// Linked status pages, the cards of the Status pages tab: the link call's
// kind, the status page editor's Devices menu, its Not on this list, taking
// a status page off another device, and the tab's New status page as the
// editor takes it.

import { describe, expect, it } from "vitest";

import { type HassLike, type WatchPagesPlaces, linkWatchPages } from "../src/ha-api.js";
import { DEVICES_HERE_TEXT, DEVICES_WAIT_TAG, type LinkDevice, type ListRemoveIO } from "../src/watch-pages/links.js";
import type { JsonObject } from "../src/watch-pages/model.js";
import {
  STATUS_OWN_COPY_TAG,
  elsewhereStatusPages,
  removeStatusPagesFrom,
  starterCopiesElsewhere,
  statusPageDevicePlaces,
  statusPageLinkId,
} from "../src/watch-status-pages/links.js";
import { askNewStatusPage } from "../src/watch-status-pages/draft.js";
import { type StatusPagesDocument, removeStatusPage, statusPagesOf } from "../src/watch-status-pages/model.js";
import "../src/watch-status-pages/status-pages-editor.js";
import { type StatusPagesViewHost, renderPagesCard } from "../src/watch-status-pages/view.js";

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

  it("tags a device that holds its own copy of a starter page, off and free to tick", () => {
    const docs = new Map<string, StatusPagesDocument>([
      ["w1", sdoc(sp(SYSTEM, "Lights On"))],
      ["w2", sdoc(sp(SYSTEM, "Lights On"), sp(HOUSE, "House"))],
      ["p1", sdoc(sp(SYSTEM, "Lights On", { linkId: "S9" }), sp(HOUSE, "Other house"))],
    ]);
    const own = starterCopiesElsewhere(sp(SYSTEM, "Lights On"), "w1", docs);
    // The iPhone's copy is linked elsewhere, so it is not this device's to take.
    expect([...own]).toEqual(["w2"]);
    const rows = statusPageDevicePlaces(DEVICES, sp(SYSTEM, "Lights On"), "w1", places, new Set(), own);
    expect(rows.map((r) => [r.device.ownerId, r.on, r.tag, r.stuck])).toEqual([
      ["w1", true, undefined, DEVICES_HERE_TEXT],
      ["w2", false, STATUS_OWN_COPY_TAG, undefined],
      ["p1", false, undefined, undefined],
    ]);
    // Any other page with the same id elsewhere is another page.
    expect([...starterCopiesElsewhere(sp(HOUSE, "House"), "p1", docs)]).toEqual([]);
    // A starter by its flag counts too, on either side.
    expect([...starterCopiesElsewhere(sp(MINE, "Who's Home", { isSystemDefault: true }), "w1", new Map([["w2", sdoc(sp(MINE, "Who's Home"))]]))]).toEqual(["w2"]);
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

  it("leaves out the ids this device holds, a starter page too", () => {
    const ids = elsewhereStatusPages("w1", here, DEVICES, docs).flatMap((g) => g.pages.map((p) => p.pageId));
    expect(ids).not.toContain(SYSTEM);
    expect(ids).not.toContain(CLASH);
    expect(ids).not.toContain(HOUSE);
  });

  it("lists a starter page this device lacks, once, under the first device holding it", () => {
    const groups = elsewhereStatusPages("p1", sdoc(sp(MINE, "Mine")), DEVICES, new Map([
      ["w1", sdoc(sp(SYSTEM, "Lights On"))],
      ["w2", sdoc(sp(SYSTEM, "Lights On"), sp(DOORS, "Doors"))],
    ]));
    expect(groups.map((g) => [g.device.ownerId, g.pages.map((p) => p.name)])).toEqual([
      ["w1", ["Lights On"]],
      ["w2", ["Doors"]],
    ]);
  });

  it("lists a starter under the first device that holds it linked, when one does", () => {
    // w1 holds its own copy; w2 and p1 share theirs. Adding from w1 would
    // start a second link that could never join the first.
    const groups = elsewhereStatusPages("w9", undefined, DEVICES, new Map([
      ["w1", sdoc(sp(SYSTEM, "Lights On"), sp(DOORS, "Doors"))],
      ["w2", sdoc(sp(SYSTEM, "Lights On", { linkId: "S5" }))],
      ["p1", sdoc(sp(SYSTEM, "Lights On", { linkId: "S5" }))],
    ]));
    expect(groups.map((g) => [g.device.ownerId, g.pages.map((p) => [p.name, p.linkId])])).toEqual([
      ["w1", [["Doors", undefined]]],
      ["w2", [["Lights On", "S5"]]],
    ]);
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

describe("the status pages editor's linked pages", () => {
  const flat = (v: unknown): string => {
    if (Array.isArray(v)) return v.map(flat).join("");
    if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
      const r = v as { strings: readonly string[]; values: unknown[] };
      return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
    }
    if (v !== null && typeof v === "object" && "_$litDirective$" in v && "values" in v) return flat((v as { values: unknown[] }).values[0]);
    return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
  };
  let made = 0;

  /** The editor on a watch with House (linked to the iPhone), Doors and a
   * starter page; the iPhone holds House and its own Phone page. With
   * `newPage`, the Status pages tab asked for a new page there first; with
   * `phoneStarter` the iPhone holds its own copy of the starter page too. */
  async function editor(newPage = false, phoneStarter = false) {
    const n = ++made;
    const watch = `sl-w1-${n}`;
    const phone = `sl-p1-${n}`;
    const owners = [
      { owner_watch_id: watch, device_name: "Jesse's Watch", device_kind: "watch" },
      { owner_watch_id: phone, device_name: "Jesse's iPhone", device_kind: "iphone", phone_pages: true },
    ] as unknown as import("../src/ha-api.js").OwnerSummary[];
    const held = new Map<string, { revision: number; document: JsonObject }>([
      [`${watch}/status_pages`, { revision: 5, document: sdoc(sp(SYSTEM, "Lights On"), sp(HOUSE, "House", { linkId: "S1" }), sp(DOORS, "Doors")) }],
      [`${phone}/status_pages`, { revision: 4, document: sdoc(...(phoneStarter ? [sp(SYSTEM, "Lights On")] : []), sp(HOUSE, "House", { linkId: "S1" }), sp(MINE, "Phone")) }],
    ]);
    const sent: JsonObject[] = [];
    const hass = {
      states: {},
      connection: {
        sendMessagePromise: (msg: JsonObject) => {
          sent.push(msg);
          const type = msg.type as string;
          const at = `${msg.owner_watch_id as string}/${msg.kind as string}`;
          if (type.endsWith("watch_config/get")) {
            const r = held.get(at) ?? { revision: 0, document: null };
            return Promise.resolve({ kind: msg.kind, revision: r.revision, document: r.document });
          }
          if (type.endsWith("watch_config/save")) {
            const now = held.get(at)?.revision ?? 0;
            if (msg.base_revision !== now) return Promise.reject({ code: "conflict", message: "conflict" });
            held.set(at, { revision: now + 1, document: msg.document as JsonObject });
            return Promise.resolve({ revision: now + 1 });
          }
          if (type.endsWith("watch_config/history")) return Promise.resolve({ entries: [] });
          if (type.endsWith("watch_pages/places")) return Promise.resolve({ pages: {}, status_pages: { S1: [watch, phone] } });
          if (type.endsWith("watch_pages/link")) return Promise.resolve({ targets: {}, link_ids: {} });
          return Promise.reject({ code: "unknown_command", message: type });
        },
        subscribeMessage: () => Promise.resolve(() => Promise.resolve()),
      },
    } as unknown as HassLike;
    const Ctor = customElements.get("wa-status-pages-editor") as unknown as new () => Record<string, unknown>;
    const el = new Ctor();
    el.hass = hass;
    el.owners = owners;
    el.phones = true;
    el.watchId = watch;
    el.renderRoot = { querySelector: () => null };
    // Never connected, so it never draws: its next draw is now.
    Object.defineProperty(el, "updateComplete", { value: Promise.resolve(true) });
    const call = <T>(name: string, ...args: unknown[]): T => (el[name] as (...a: unknown[]) => T).apply(el, args);
    if (newPage) askNewStatusPage(watch);
    await call<Promise<void>>("load", watch);
    await call<Promise<void>>("loadPlaces", watch);
    const host = () => call<StatusPagesViewHost>("viewHost");
    const page = (id: string) => statusPagesOf(host().document).find((p) => p.id === id)!;
    return { el, watch, phone, held, sent, call, host, page };
  }

  it("has a Devices menu on every page, the starter pages too, on the row and in the Page card", async () => {
    const { host, page, el } = await editor();
    expect(host().devices?.(page(SYSTEM))).toBeDefined();
    expect(flat(renderPagesCard(host()))).toContain("Devices for Lights On");
    const doors = host().devices?.(page(DOORS));
    expect(doors).toBeDefined();
    expect(flat(renderPagesCard(host()))).toContain("Devices for Doors");
    doors!.toggle("row");
    expect(el.devicesMenu).toEqual({ pageId: DOORS, where: "row" });
    const menu = flat(host().devices!(page(DOORS))!.menu("row"));
    expect(menu).toContain("This page is on");
    expect(menu).toContain("Jesse's iPhone");
    expect(menu).toContain("this watch");
    expect(menu).toContain("Done");
  });

  it("ticks a device with a status_pages link, and unticks it by taking the page off there", async () => {
    const { call, watch, phone, sent, held, el } = await editor();
    await call<Promise<void>>("toggleDevice", DOORS, { device: { ownerId: phone, name: "Jesse's iPhone", kind: "iphone" }, on: false, here: false });
    expect(sent.filter((m) => (m.type as string).endsWith("watch_pages/link")).map((m) => [m.source_id, m.page_ids, m.targets, m.kind]))
      .toEqual([[watch, [DOORS], [phone], "status_pages"]]);
    expect((el.devicesNote as { text: string }).text).toBe("Added to Jesse's iPhone.");
    await call<Promise<void>>("toggleDevice", HOUSE, { device: { ownerId: phone, name: "Jesse's iPhone", kind: "iphone" }, on: true, here: false });
    expect((held.get(`${phone}/status_pages`)!.document.statusPages as JsonObject[]).map((p) => p.name)).toEqual(["Phone"]);
    expect((el.devicesNote as { text: string }).text).toBe("Taken off Jesse's iPhone.");
  });

  it("marks the iPhone's own copy of a starter page, and ticking it links the two", async () => {
    const { call, host, page, watch, phone, sent, el } = await editor(false, true);
    host().devices!(page(SYSTEM))!.toggle("row");
    const menu = flat(host().devices!(page(SYSTEM))!.menu("row"));
    expect(menu).toContain("own copy");
    expect(flat(renderPagesCard(host()))).not.toContain("Add Lights On here");
    await call<Promise<void>>("toggleDevice", SYSTEM, { device: { ownerId: phone, name: "Jesse's iPhone", kind: "iphone" }, on: false, here: false, tag: STATUS_OWN_COPY_TAG });
    expect(sent.filter((m) => (m.type as string).endsWith("watch_pages/link")).map((m) => [m.source_id, m.page_ids, m.targets, m.kind]))
      .toEqual([[watch, [SYSTEM], [phone], "status_pages"]]);
    expect((el.devicesNote as { text: string }).text).toBe("Linked with Jesse's iPhone. Its own copy is now this one.");
  });

  it("lists what the iPhone holds and this watch does not, and adds it here linked", async () => {
    const { call, host, watch, phone, sent, el } = await editor();
    const card = flat(renderPagesCard(host()));
    expect(card).toContain("Not on this watch");
    expect(card).toContain("Add Phone here");
    expect(card).not.toContain("Add House here");
    await call<Promise<void>>("addHere", { ownerId: phone, pageId: MINE, name: "Phone", page: sp(MINE, "Phone") });
    expect(sent.filter((m) => (m.type as string).endsWith("watch_pages/link")).map((m) => [m.source_id, m.page_ids, m.targets, m.kind]))
      .toEqual([[phone, [MINE], [watch], "status_pages"]]);
    expect((el.elsewhereNote as { text: string }).text).toBe("Added Phone from Jesse's iPhone.");
  });

  it("deletes a page on this device alone at once, and asks for a linked one", async () => {
    const { call, el, host } = await editor();
    call("askDelete", DOORS);
    expect(el.deleteAsk).toBeUndefined();
    expect(statusPagesOf(host().document).map((p) => p.name)).toEqual(["Lights On", "House"]);
    call("askDelete", HOUSE);
    expect(el.deleteAsk).toEqual({ pageId: HOUSE });
    const ask = flat(call("renderDeleteAsk", el.deleteAsk));
    expect(ask).toContain("It is also on Jesse's iPhone.");
    expect(ask).toContain("Delete on this watch");
    expect(ask).toContain("Delete on all 2 devices");
  });

  it("deletes everywhere: off the iPhone at once, then here as an edit", async () => {
    const { call, el, held, phone, host } = await editor();
    call("askDelete", HOUSE);
    await call<Promise<void>>("deleteEverywhere");
    expect((held.get(`${phone}/status_pages`)!.document.statusPages as JsonObject[]).map((p) => p.name)).toEqual(["Phone"]);
    expect(statusPagesOf(host().document).map((p) => p.name)).toEqual(["Lights On", "Doors"]);
    expect((el.note as { text: string }).text).toBe("Deleted on the other devices. Save to finish the delete on this watch.");
  });

  it("will not link over unsaved edits", async () => {
    const { call, host, sent, phone } = await editor();
    host().edit((d) => removeStatusPage(d, DOORS));
    const blocked = flat(host().devices!(statusPagesOf(host().document).find((p) => p.id === HOUSE)!)!.menu("card"));
    expect(blocked).toContain("Save or discard your edits first.");
    await call<Promise<void>>("toggleDevice", HOUSE, { device: { ownerId: phone, name: "Jesse's iPhone", kind: "iphone" }, on: true, here: false });
    expect(sent.some((m) => (m.type as string).endsWith("watch_config/save"))).toBe(false);
  });

  it("adds a page as it opens when the Status pages tab asked for one, and only once", async () => {
    const { call, host, watch, el } = await editor(true);
    const pages = statusPagesOf(host().document);
    expect(pages.map((p) => p.name).slice(0, 3)).toEqual(["Lights On", "House", "Doors"]);
    expect(pages).toHaveLength(4);
    expect((el.draft as { dirty: boolean }).dirty).toBe(true);
    await call<Promise<void>>("load", watch);
    await Promise.resolve();
    expect(statusPagesOf(host().document)).toHaveLength(4);
  });

  it("adds nothing when no page was asked for", async () => {
    const { host } = await editor();
    expect(statusPagesOf(host().document)).toHaveLength(3);
  });
});
