// The Pages and Status pages tabs' element against a stand-in Home
// Assistant: it reads the library once, draws a card per library item with
// a tick per device, ticks a page on or off a device, opens a page on a
// device, draws a device's tab (its picks in order with Hide here and a
// picture, then the rest of the home with Add chips), saves Hide here and the
// order on that device's own record, and deletes from the library.

import { afterEach, describe, expect, it } from "vitest";

import "../src/watch-pages/all-pages.js";
import { pageCrop } from "../src/watch-pages/all-pages.js";
import { forgetWatchPagesDraft, keptWatchPagesSelection, takeNewWatchPageAsk, takeWatchPagesRecord } from "../src/watch-pages/kept.js";
import type { JsonObject } from "../src/watch-pages/model.js";
import { takeStatusPageAsk } from "../src/watch-status-pages/draft.js";
import { CAMERA, CHEN, CHEN_MENU, DOORS, JESSE, LIGHTS, LONELY, PAGE1, PHONE, SMART, STARTER, SYSTEM } from "./library-fixture.js";
import { type Msg, fakeHome, settle, standUp } from "./library-tab-fake.js";

function tab(kind: "pages" | "status_pages" = "pages", admin = true) {
  const home = fakeHome(admin);
  const opened: [string, string, string | undefined][] = [];
  const t = standUp("wa-all-pages", home, { kind, onOpen: (o: string, k: string, what?: string) => opened.push([o, k, what]) });
  const sentOf = (type: string) => home.sent.filter((m) => m.type === `wrist_assistant/${type}`);
  return { ...t, home, opened, sentOf };
}

/** The view kept for each tab is kept across tests, as in the panel. */
function showTab(t: ReturnType<typeof tab>, filter: string) {
  t.call("setFilter", filter);
}

afterEach(() => {
  try {
    window.localStorage.clear();
  } catch {
    /* No storage here. */
  }
});

describe("the Pages tab", () => {
  it("reads the library once and draws a card per page with a tick per device, and no Devices, Link or Add to", async () => {
    const t = tab();
    showTab(t, "all");
    await t.ready();
    expect(t.sentOf("library/summary").length).toBeGreaterThan(0);
    // No device's record is read to draw the cards.
    expect(t.sentOf("watch_config/get")).toEqual([]);
    const text = t.whole();
    expect(text).toContain("5 pages in your home. Tick a device and the page is on it.");
    expect(text.split(`class="ap-card `).length - 1).toBe(5);
    expect(text).toContain("lt-chip on");
    expect(text).toContain("lt-chip off");
    expect(text).toContain("<em>hidden</em>");
    expect(text).toContain("Multi select");
    expect(text).toContain("Search by name");
    expect(text).toContain("Click a page to edit it. Tick a device to show the page there. One page, the same everywhere.");
    for (const gone of ["ap-dev-open", ">Devices<", "Link", "Not linked", "Same as", "Add to…", "Remove from…", "Add all"]) expect(text).not.toContain(gone);
  });

  it("counts every page on All and each device's own on its tab", async () => {
    const t = tab();
    showTab(t, "all");
    await t.ready();
    const text = t.whole();
    expect(text).toMatch(/pk-tab-name">All<\/span>\s*<span class="pk-tab-count">5</);
    expect(text).toMatch(/pk-tab-name">Jesse Apple Watch<\/span>\s*<span class="pk-tab-count">2</);
    expect(text).toMatch(/pk-tab-name">iPhone 15 Pro<\/span>\s*<span class="pk-tab-count">1</);
  });

  it("crops a page's picture to its tiles", async () => {
    const t = tab();
    await t.ready();
    const page = { id: LIGHTS, name: "Lights", items: [{ id: "t", entityId: "light.a", gridCol: 0, gridRow: 4, colSpan: 6, rowSpan: 2 }] };
    expect(pageCrop(page, undefined, undefined).height).toBeGreaterThan(0);
    expect(pageCrop({ ...page, items: [] }, undefined, undefined).top).toBe(0);
  });

  it("ticks a page onto a device and off one, with item_id, then reads the library again", async () => {
    const t = tab();
    showTab(t, "all");
    await t.ready();
    const lights = t.home.lib.pages[LIGHTS]!;
    const entry = (t.el.lib as { library: { pages: { id: string }[] } }).library.pages.find((e) => e.id === LIGHTS)!;
    const before = t.sentOf("library/summary").length;
    await t.call("tick", entry, JESSE, true);
    expect(t.sentOf("library/pick").at(-1)).toEqual({ type: "wrist_assistant/library/pick", owner_id: JESSE, kind: "pages", item_id: LIGHTS, on: true });
    expect(lights.owners).toContain(JESSE);
    expect(t.sentOf("library/summary").length).toBeGreaterThan(before);
    await t.call("tick", entry, CHEN, false);
    expect(t.sentOf("library/pick").at(-1)).toMatchObject({ owner_id: CHEN, on: false, item_id: LIGHTS });
    expect(t.home.lib.pages[LIGHTS]!.owners).toEqual([JESSE]);
  });

  it("clears the menu slots and complication taps that opened a page on the device an untick took it off", async () => {
    const t = tab();
    showTab(t, "all");
    await t.ready();
    // Chen's menu is Chen Watch's alone, with a Go to page slot to Lights,
    // and a complication there opens Lights.
    const go = (id: string, pageId: string) => ({ id, position: "topLeft", isVisible: true, action: { type: "navigateToPage", pageId } });
    t.home.lib.menus[CHEN_MENU]!.sections = { quickAction: { slots: [go("S1", LIGHTS), go("S2", CAMERA)] } };
    t.home.materialise(CHEN);
    t.home.complications.set(CHEN, [{ id: "c1", revision: 1, document: { id: "c1", name: "Lights tap", openPageId: LIGHTS, tapAction: { type: "openPage" } } }]);
    const entry = (t.el.lib as { library: { pages: { id: string }[] } }).library.pages.find((e) => e.id === LIGHTS)!;
    await t.call("tick", entry, CHEN, false);
    const saved = t.sentOf("watch_config/save").filter((m) => m.owner_watch_id === CHEN && m.kind === "menus");
    expect(saved).toHaveLength(1);
    expect(((saved[0]!.document as { quickAction: { slots: { id: string }[] } }).quickAction.slots).map((s) => s.id)).toEqual(["S2"]);
    expect(t.sentOf("complications/save").map((m) => m.owner_watch_id)).toEqual([CHEN]);
    // Ticking on writes nothing beside the pick.
    await t.call("tick", entry, CHEN, true);
    expect(t.sentOf("watch_config/save")).toHaveLength(1);
  });

  it("says a page ticked onto a device on the free plan shows only if it is first", async () => {
    const t = tab();
    showTab(t, "all");
    await t.ready();
    t.home.held.get(`${JESSE}/pages`)!.multiple_pages = false;
    const entry = (t.el.lib as { library: { pages: { id: string }[] } }).library.pages.find((e) => e.id === CAMERA)!;
    await t.call("tick", entry, JESSE, true);
    await settle();
    expect(t.whole()).toContain("Added to Jesse Apple Watch. On the free plan, Jesse Apple Watch shows only its first page.");
  });

  it("shows a refused tick on its card in plain words", async () => {
    const t = tab();
    showTab(t, "all");
    await t.ready();
    t.home.refuse.set("wrist_assistant/library/pick", { code: "awaiting_move", message: "awaiting" });
    const entry = (t.el.lib as { library: { pages: { id: string }[] } }).library.pages.find((e) => e.id === LIGHTS)!;
    await t.call("tick", entry, PHONE, true);
    expect(t.whole()).toMatch(/lt-note" role="alert">[^<]*Try again after that\./);
  });

  it("locks an untick on a device whose page editor holds unsaved edits", async () => {
    const t = tab();
    showTab(t, "all");
    await t.ready();
    const { draft } = takeWatchPagesRecord(CHEN, t.home.held.get(`${CHEN}/pages`)!.document, 9);
    draft.apply({ ...draft.document, pages: [] });
    try {
      expect(t.whole()).toContain("Chen Watch's pages have unsaved edits.");
    } finally {
      forgetWatchPagesDraft(CHEN);
    }
  });

  it("opens a page on the device that has it, picked in its page editor; a page no device has says so", async () => {
    const t = tab();
    showTab(t, "all");
    await t.ready();
    const lib = (t.el.lib as { library: { pages: { id: string }[] } }).library;
    t.call("open", lib.pages.find((e) => e.id === PAGE1));
    expect(t.opened.at(-1)).toEqual([JESSE, "watch", undefined]);
    expect(keptWatchPagesSelection(JESSE).pageId).toBe(PAGE1);
    t.call("open", lib.pages.find((e) => e.id === LONELY));
    expect(t.opened).toHaveLength(1);
    expect(t.whole()).toContain("No device has this page. Tick one to edit it there.");
  });

  it("has New page: on All it asks which device, on a device's tab it adds the page there", async () => {
    const t = tab();
    showTab(t, "all");
    await t.ready();
    expect(t.whole()).toContain("New page");
    showTab(t, CHEN);
    t.call("newPage", { ownerId: CHEN, name: "Chen Watch", kind: "watch" });
    expect(takeNewWatchPageAsk(CHEN)).toBe(true);
    expect(t.opened.at(-1)).toEqual([CHEN, "watch", undefined]);
  });

  it("locks every tick of a page no device has for anyone but an administrator", async () => {
    const t = tab("pages", false);
    showTab(t, "all");
    await t.ready();
    expect(t.whole()).toContain("Only an administrator can put this on a device.");
  });
});

describe("a device's tab", () => {
  it("lists the device's pages in its order, each with a picture, its facts and Hide here, then the rest with Add chips", async () => {
    const t = tab();
    showTab(t, JESSE);
    await t.ready();
    const text = t.whole();
    expect(text).toContain("On Jesse Apple Watch");
    expect(text).toContain("Drag to order. The order is this watch's own.");
    expect(text).toContain("Smart page · only here");
    expect(text).toContain("1 tile · hidden here");
    expect(text).toContain(">Hide here<");
    expect(text).toContain(">Show here<");
    expect(text).toContain("lt-row hid");
    expect(text).toContain("lr-pic");
    expect(text.indexOf("Smart page · only here")).toBeLessThan(text.indexOf("1 tile · hidden here"));
    // The system page is the device's own, never a row.
    expect(text).not.toContain("Settings");
    expect(text).toContain("Not on this watch");
    expect(text).toContain("The rest of your home. Add one here with a tick.");
    expect(text).toContain("Add to this watch");
    expect(text).toContain("ap-card lt-dim");
    // No Multi select on a device's tab.
    expect(text).not.toContain("Multi select");
  });

  it("draws an iPhone's rows as the iPhone's pages, and says Add to this iPhone", async () => {
    const t = tab();
    showTab(t, PHONE);
    await t.ready();
    const text = t.whole();
    expect(text).toContain("lr-pic ph");
    expect(text).toContain("Add to this iPhone");
    expect(text).toContain("1 tile · also on Jesse Apple Watch");
  });

  it("saves Hide here on the device's own record, keeping its system page and the linkId marks as loaded", async () => {
    const t = tab();
    showTab(t, JESSE);
    await t.ready();
    const device = { ownerId: JESSE, name: "Jesse Apple Watch", kind: "watch" };
    await t.call("changePicks", device, { id: SMART, hidden: true });
    const save = t.sentOf("watch_config/save").at(-1)!;
    expect(save).toMatchObject({ owner_watch_id: JESSE, kind: "pages", base_revision: 1 });
    const pages = (save.document as JsonObject).pages as JsonObject[];
    expect(pages.map((p) => p.id)).toEqual([SYSTEM, SMART, PAGE1.toUpperCase()]);
    expect(pages[1]!.isHidden).toBe(true);
    expect(pages[2]!.linkId).toBe(PAGE1);
    expect(pages[2]!.isHidden).toBe(true);
    // The library is read again after it.
    expect(t.sentOf("library/summary").length).toBeGreaterThan(1);
  });

  it("saves a drag's order on the device's own record, and shows it until the read after", async () => {
    const t = tab();
    showTab(t, CHEN);
    await t.ready();
    const device = { ownerId: CHEN, name: "Chen Watch", kind: "watch" };
    const run = t.call<Promise<void>>("changePicks", device, { id: LIGHTS, before: CAMERA }, [CAMERA, LIGHTS]);
    expect((t.el.orderAsked as { ids: string[] }).ids).toEqual([LIGHTS, CAMERA]);
    await run;
    const save = t.sentOf("watch_config/save").at(-1)!;
    expect(((save.document as JsonObject).pages as JsonObject[]).map((p) => p.id)).toEqual([LIGHTS, CAMERA]);
    expect(t.el.orderAsked).toBeUndefined();
  });

  it("will not save Hide here while the device's page editor holds unsaved edits", async () => {
    const t = tab();
    showTab(t, CHEN);
    await t.ready();
    const { draft } = takeWatchPagesRecord(CHEN, t.home.held.get(`${CHEN}/pages`)!.document, 9);
    draft.apply({ ...draft.document, pages: [] });
    try {
      await t.call("changePicks", { ownerId: CHEN, name: "Chen Watch", kind: "watch" }, { id: LIGHTS, hidden: true });
      expect(t.sentOf("watch_config/save")).toEqual([]);
      expect(t.whole()).toContain("pages have unsaved edits. Save or discard them first.");
    } finally {
      forgetWatchPagesDraft(CHEN);
    }
  });

  it("says when the device is on the free plan", async () => {
    const t = tab();
    t.home.held.get(`${CHEN}/pages`)!.multiple_pages = false;
    showTab(t, CHEN);
    await t.ready();
    t.call("willUpdate", new Map());
    await settle();
    expect(t.whole()).toContain("On the free plan, Chen Watch shows only its first page.");
  });
});

describe("Multi select", () => {
  it("deletes the picked pages from the library after asking, then clears the complication taps that opened them", async () => {
    const t = tab();
    showTab(t, "all");
    await t.ready();
    t.home.complications.set(JESSE, [{ id: "c1", revision: 2, document: { id: "c1", name: "Door", openPageId: PAGE1 } }]);
    const lib = (t.el.lib as { library: { pages: { id: string }[] } }).library;
    t.call("startSelect");
    t.call("pick", lib.pages.find((e) => e.id === PAGE1), false);
    t.call("toggleAsk");
    const ask = t.whole();
    expect(ask).toContain("Delete 1 page from the library?");
    expect(ask).toContain("It comes off Jesse Apple Watch and iPhone 15 Pro, with the tiles, menu slots and complication taps that open it.");
    expect(ask).not.toContain("Add to");
    await t.call("runDelete");
    expect(t.sentOf("library/delete")).toEqual([{ type: "wrist_assistant/library/delete", kind: "pages", item_id: PAGE1 }]);
    const tap = t.sentOf("complications/save").at(-1)!;
    expect(tap).toMatchObject({ owner_watch_id: JESSE, base_revision: 2 });
    expect((tap.document as Msg).openPageId).toBeUndefined();
    expect(t.home.lib.pages[PAGE1]).toBeUndefined();
    expect(t.whole()).toContain("Deleted New Page 1.");
  });
});

describe("the Status pages tab", () => {
  it("draws a card per status page, a starter once for every device, with ticks and no Hide here", async () => {
    const t = tab("status_pages");
    showTab(t, "all");
    await t.ready();
    const text = t.whole();
    expect(text).toContain("2 status pages in your home.");
    expect(text).toContain("1 row · starter");
    expect(text).toContain("Click a status page to edit it. Tick a device to put it there.");
    expect(text).not.toContain("Not linked");
    expect(text).not.toContain("<em>hidden</em>");
  });

  it("ticks a status page with the status_pages kind", async () => {
    const t = tab("status_pages");
    showTab(t, "all");
    await t.ready();
    const entry = (t.el.lib as { library: { statusPages: { id: string }[] } }).library.statusPages.find((e) => e.id === DOORS)!;
    await t.call("tick", entry, CHEN, true);
    expect(t.sentOf("library/pick").at(-1)).toEqual({ type: "wrist_assistant/library/pick", owner_id: CHEN, kind: "status_pages", item_id: DOORS, on: true });
  });

  it("lists a device's status pages with no Hide here, and opens one in its status pages editor", async () => {
    const t = tab("status_pages");
    showTab(t, JESSE);
    await t.ready();
    const text = t.whole();
    expect(text).toContain("2 rows · only here");
    expect(text).not.toContain("Hide here");
    expect(text).toContain("Every status page in your home is on Jesse Apple Watch.");
    const lib = (t.el.lib as { library: { statusPages: { id: string }[] } }).library;
    t.call("open", lib.statusPages.find((e) => e.id === STARTER));
    expect(t.opened.at(-1)).toEqual([JESSE, "watch", "status_pages"]);
    expect(takeStatusPageAsk(JESSE)).toBe(STARTER);
  });

  it("drops what was picked and typed when told to list the other kind", async () => {
    const t = tab();
    showTab(t, "all");
    await t.ready();
    t.call("startSelect");
    t.call("setSearch", "light");
    t.el.kind = "status_pages";
    t.call("willUpdate", new Map([["kind", "pages"]]));
    expect(t.el.selecting).toBe(false);
    expect(t.el.search).toBe("");
  });
});
