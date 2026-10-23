// The Pages and Status pages tabs' element against a stand-in Home
// Assistant: it reads the library once, draws the board (a row per library
// item, a column per device) or a card per item with a tick per device,
// ticks a page on or off a device, opens a page on a device, draws a focused
// device (its picks in order with Hide here and a picture, then the rest of
// the home), saves Hide here and the order on that device's own record, and
// deletes from the library.

import { afterEach, describe, expect, it } from "vitest";

import "../src/watch-pages/all-pages.js";
import { pageCrop } from "../src/watch-pages/all-pages.js";
import type { UntickAsk } from "../src/watch-pages/library-editing-io.js";
import { forgetWatchPagesDraft, keptWatchPagesSelection, takeNewWatchPageAsk, takeWatchPagesRecord } from "../src/watch-pages/kept.js";
import type { JsonObject } from "../src/watch-pages/model.js";
import { takeStatusPageAsk } from "../src/watch-status-pages/draft.js";
import { LIBRARY_PREVIEW_KEY } from "../src/library/item-mode.js";
import { CAMERA, CHEN, CHEN_MENU, DOORS, JESSE, LIGHTS, LONELY, PAGE1, PHONE, SMART, STARTER, SYSTEM } from "./library-fixture.js";
import { type Msg, fakeHome, settle, standUp } from "./library-tab-fake.js";

function tab(kind: "pages" | "status_pages" = "pages", admin = true) {
  const home = fakeHome(admin);
  const opened: [string, string, string | undefined][] = [];
  const library: string[][] = [];
  const t = standUp("wa-all-pages", home, {
    kind,
    onOpen: (o: string, k: string, what?: string) => opened.push([o, k, what]),
    onOpenLibrary: (k: string, id: string, from?: string) => library.push(from === undefined ? [k, id] : [k, id, from]),
  });
  const sentOf = (type: string) => home.sent.filter((m) => m.type === `wrist_assistant/${type}`);
  return { ...t, home, opened, library, sentOf };
}

/** The board, focused on one device or on every device ("all"): the
 * address's focus, handed in by the panel. */
function showTab(t: ReturnType<typeof tab>, filter: string) {
  t.el.focusOwner = undefined;
  t.call("setView", "board");
  t.el.focusOwner = filter === "all" ? undefined : filter;
}

/** Every device, as cards. */
function showCards(t: ReturnType<typeof tab>) {
  showTab(t, "all");
  t.call("setView", "cards");
}

afterEach(() => {
  try {
    window.localStorage.clear();
  } catch {
    /* No storage here. */
  }
});

describe("the Pages tab", () => {
  it("draws the board by default: a row per page, a column per device, a box where the page is, and no Device menu or device tabs", async () => {
    const t = tab();
    showTab(t, "all");
    await t.ready();
    const text = t.whole();
    expect(text).toContain(`<table class="bd `);
    expect(text.split(`<tr class=bd-row `).length - 1).toBe(5);
    expect(text).toContain(`aria-pressed=true`);
    expect(text).toMatch(/bd-col-name">Jesse Apple Watch<\/span>[\s\S]*?bd-col-n">2</);
    expect(text).toMatch(/bd-col-name">iPhone 15 Pro<\/span>[\s\S]*?bd-col-n">1</);
    expect(text).toContain(">Order<");
    expect(text).toContain(">Board<");
    expect(text).toContain(">Cards<");
    expect(text).toContain("Click a page to edit it. Tick a box to show the page on that device. Click a device's name to order its pages.");
    for (const gone of ["pk-tab", ">Device<", "Watches (", "Link", "Not linked", "Same as"]) expect(text).not.toContain(gone);
  });

  it("focuses a device from its column head, through the host's address", async () => {
    const focused: (string | undefined)[] = [];
    const t = tab();
    t.el.onFocus = (o: string | undefined) => focused.push(o);
    showTab(t, "all");
    await t.ready();
    t.call("setFocus", CHEN);
    expect(focused).toEqual([CHEN]);
    // Cards leaves a focused device.
    showTab(t, CHEN);
    t.call("setView", "cards");
    expect(focused).toEqual([CHEN, undefined]);
  });

  it("says Saved beside the head for a moment after a box's write", async () => {
    const t = tab();
    showTab(t, "all");
    await t.ready();
    const entry = (t.el.lib as { library: { pages: { id: string }[] } }).library.pages.find((e) => e.id === LIGHTS)!;
    await t.call("tick", entry, JESSE, true);
    expect(t.whole()).toContain(`<span class="bd-saved" role="status">`);
  });

  it("reads the library once and draws a card per page with a tick per device, and no Devices, Link or Add to", async () => {
    const t = tab();
    showCards(t);
    await t.ready();
    expect(t.sentOf("library/summary").length).toBeGreaterThan(0);
    // No device's record is read to draw the cards.
    expect(t.sentOf("watch_config/get")).toEqual([]);
    const text = t.whole();
    expect(text).toContain("Your page library: 5 pages. Each watch and iPhone shows the pages ticked for it, and an edit shows everywhere.");
    expect(text.split(`class="ap-card `).length - 1).toBe(5);
    expect(text).toContain("lt-chip on");
    expect(text).toContain("lt-chip off");
    expect(text).toContain("<em>hidden</em>");
    expect(text).toContain("Multi select");
    expect(text).toContain("Search by name");
    expect(text).toContain("Click a page to edit it. Tick a device to show the page there. One page, the same everywhere.");
    for (const gone of ["ap-dev-open", ">Devices<", "Link", "Not linked", "Same as", "Add to…", "Remove from…", "Add all"]) expect(text).not.toContain(gone);
  });

  it("counts the tiles a watch skips on a page's ticked watch chips, never an unticked watch's or the iPhone's", async () => {
    const t = tab();
    const map = { id: "m", entityId: "map.C3A0E000-0000-4000-8000-0000000000B7", gridCol: 0, gridRow: 0, colSpan: 12, rowSpan: 4 };
    const web = { id: "w", entityId: "web.C3A0E000-0000-4000-8000-0000000000B8", customLabel: "Garden", gridCol: 0, gridRow: 4, colSpan: 6, rowSpan: 4 };
    const item = t.home.lib.pages[PAGE1]!.item;
    item.items = [...(item.items as unknown[]), map, web] as typeof item.items;
    showTab(t, "all");
    await t.ready();
    // The board says it under the watch's box.
    const board = t.whole();
    const row = board.slice(board.indexOf(`data-row=${PAGE1.toUpperCase()}`));
    expect(row.slice(0, row.indexOf("</tr>"))).toContain(`title=Jesse Apple Watch skips Map and Garden: only an iPhone shows them.>skips 2</em>`);
    showCards(t);
    const text = t.whole();
    const card = text.slice(text.indexOf(`data-card=${PAGE1}`));
    const ticks = card.slice(card.indexOf("lt-ticks"), card.indexOf("</wa-chip-row>"));
    // Chen Watch does not hold the page, so it skips nothing.
    expect(ticks).toContain(`Chen Watch</span></button>`);
    const skips = `<em class="lt-skips" title=Jesse Apple Watch skips Map and Garden: only an iPhone shows them.>skips 2</em>`;
    expect(ticks).toContain(`Jesse Apple Watch</span><em>hidden</em>${skips}</button>`);
    expect(ticks).not.toMatch(/iPhone 15 Pro<\/span><em class="lt-skips"/);
    // A page a watch draws whole says nothing.
    const lights = text.slice(text.indexOf(`data-card=${LIGHTS}`));
    expect(lights.slice(0, lights.indexOf("</wa-chip-row>"))).not.toContain("lt-skips");
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
    const picks = t.sentOf("library/pick").length;
    await t.call("tick", entry, CHEN, false);
    // It asks first, under the card's row, and takes nothing off yet.
    expect(t.sentOf("library/pick")).toHaveLength(picks);
    const ask = t.el.untickAsk as UntickAsk;
    expect(ask.text).toBe("Take Lights off Chen Watch? 1 menu slot and 1 complication tap that open it are cleared too.");
    await t.call("untickNow", ask);
    expect(t.sentOf("library/pick").at(-1)).toMatchObject({ owner_id: CHEN, on: false, item_id: LIGHTS });
    expect((t.el.tickNotes as ReadonlyMap<string, unknown>).get(LIGHTS.toUpperCase()))
      .toEqual({ kind: "ok", text: "Took Lights off Chen Watch and cleared 1 menu slot and 1 complication tap that opened it." });
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

  it("opens every page in the one editor, the library's, whichever devices have it, with the focused device", async () => {
    const t = tab();
    showTab(t, "all");
    await t.ready();
    const lib = (t.el.lib as { library: { pages: { id: string }[] } }).library;
    t.call("open", lib.pages.find((e) => e.id === PAGE1));
    t.call("open", lib.pages.find((e) => e.id === LONELY));
    expect(t.opened).toHaveLength(0);
    expect(t.library).toEqual([["pages", PAGE1], ["pages", LONELY]]);
    expect(keptWatchPagesSelection(JESSE).pageId).toBeUndefined();
    expect(t.whole()).not.toContain(" in the library");
    showTab(t, JESSE);
    await t.ready();
    t.call("open", lib.pages.find((e) => e.id === PAGE1));
    expect(t.library.at(-1)).toEqual(["pages", PAGE1, JESSE]);
  });

  it("has New page: on All it asks for a name and makes the page in the library, on a focused device it adds the page there and opens it", async () => {
    const t = tab();
    showTab(t, "all");
    await t.ready();
    expect(t.whole()).toContain("New page");
    expect(t.whole()).not.toContain("Add a page on");
    // Node has no sessionStorage; the editor's Preview on is remembered there.
    const held = new Map<string, string>();
    const was = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");
    Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: { getItem: (k: string) => held.get(k) ?? null, setItem: (k: string, v: string) => held.set(k, v) } });
    t.call("toggleNew");
    const form = t.el.newForm as { name: string; busy: boolean; preview?: string };
    expect(form.name).toBe("New Page 2"); // the library's pages are counted as a device's are
    expect(form.preview).toBe("watch");
    // The New complication dialog's shape: a name, then where to preview it,
    // since the home has a watch and an iPhone. No device is asked for.
    const whole = t.whole();
    const dialog = whole.slice(whole.indexOf(`<dialog class="new-dialog lib-new"`), whole.indexOf("</dialog>"));
    expect(dialog).toContain("<h2>New page</h2>");
    expect(dialog).toContain("Name it");
    expect(dialog).toContain("Preview on");
    expect(dialog).toContain("Nothing is put on a device; the ticks do that.");
    expect(dialog).toContain("New Page 2, a page no device has yet. Tick a device any time.");
    expect(dialog).not.toContain("Apple Watch");
    t.el.newForm = { ...form, name: " Garage ", preview: "iphone" };
    expect(t.whole()).toContain("Garage, a page no device has yet.");
    await t.call("makeCard");
    const sent = t.sentOf("library/item/create");
    expect(sent).toHaveLength(1);
    expect(sent[0]!.kind).toBe("pages");
    const page = (sent[0]!.document as { pages: JsonObject[] }).pages[0]!;
    expect(page.name).toBe("Garage");
    expect(page.id).toMatch(/^[0-9A-F-]{36}$/);
    expect(page.items).toEqual([]);
    expect(t.el.newForm).toBeUndefined();
    expect(t.library).toEqual([["pages", page.id]]);
    expect(t.opened).toHaveLength(0);
    // Preview on iPhone: the editor opens drawing on an iPhone.
    expect(held.get(LIBRARY_PREVIEW_KEY)).toBe("iphone");
    if (was) Object.defineProperty(globalThis, "sessionStorage", was);
    else delete (globalThis as { sessionStorage?: unknown }).sessionStorage;
    // On a focused device: a page saved last on that device's own record,
    // then open in the one editor with the device ringed. No ask is left
    // for a device editor.
    showTab(t, CHEN);
    await t.ready();
    await t.call("newPage", { ownerId: CHEN, name: "Chen Watch", kind: "watch" });
    const saved = t.sentOf("watch_config/save").at(-1)!;
    expect(saved.owner_watch_id).toBe(CHEN);
    const added = (saved.document as { pages: JsonObject[] }).pages.at(-1)!;
    expect(added.name).toMatch(/^New Page \d+$/);
    expect(t.library.at(-1)).toEqual(["pages", added.id, CHEN]);
    expect(takeNewWatchPageAsk(CHEN)).toBe(false);
    expect(t.opened).toHaveLength(0);
  });

  it("refuses an empty name and says why New page is greyed for anyone but an administrator", async () => {
    const t = tab();
    showTab(t, "all");
    await t.ready();
    t.call("toggleNew");
    t.el.newForm = { name: "  ", busy: false };
    expect(t.whole()).toContain("Type a name to start.");
    await t.call("makeCard");
    expect(t.sentOf("library/item/create")).toHaveLength(0);
    expect(t.whole()).toContain("Give the page a name.");
    const other = tab("pages", false);
    showTab(other, "all");
    await other.ready();
    expect(other.whole()).toContain("Only a Home Assistant administrator can make a new page.");
  });

  it("New status page makes a status page in the library the same way", async () => {
    const t = tab("status_pages");
    showTab(t, "all");
    await t.ready();
    t.call("toggleNew");
    const form = t.el.newForm as { name: string; busy: boolean };
    expect(form.name).toMatch(/^New Page \d+$/);
    expect(t.whole()).toContain("<h2>New status page</h2>");
    t.el.newForm = { ...form, name: "Gates" };
    expect(t.whole()).toContain("Gates, a status page no device has yet. Tick a device any time.");
    await t.call("makeCard");
    const sent = t.sentOf("library/item/create");
    expect(sent).toHaveLength(1);
    expect(sent[0]!.kind).toBe("status_pages");
    const page = (sent[0]!.document as { statusPages: JsonObject[] }).statusPages[0]!;
    expect(page.name).toBe("Gates");
    expect(page.rows).toEqual([]);
    expect(t.library).toEqual([["status_pages", page.id]]);
  });

  it("locks every tick of a page no device has for anyone but an administrator", async () => {
    const t = tab("pages", false);
    showTab(t, "all");
    await t.ready();
    expect(t.whole()).toContain("Only an administrator can put this on a device.");
  });
});

describe("a focused device", () => {
  it("lists the device's pages in its order, each with a picture and Hide here in its column, then the rest dimmed", async () => {
    const t = tab();
    showTab(t, JESSE);
    await t.ready();
    const text = t.whole();
    expect(text).toContain("<b>Jesse Apple Watch</b>");
    expect(text).toContain("2 pages, in the order the watch shows them");
    expect(text).toContain("On Jesse Apple Watch");
    expect(text).toContain("Drag to order. The order is this watch's own.");
    expect(text).toContain(`class="bd-col on"`);
    expect(text).toContain(`title=Hide here: keep Smart on Jesse Apple Watch without showing it`);
    expect(text).toContain(`title=Show New Page 1 on Jesse Apple Watch again`);
    expect(text).toContain("bd-eye hid");
    expect(text).toContain("lr-pic");
    expect(text).toContain(`draggable=true`);
    const smart = text.indexOf(`data-row=${SMART.toUpperCase()}`);
    expect(smart).toBeGreaterThan(0);
    expect(smart).toBeLessThan(text.indexOf(`data-row=${PAGE1.toUpperCase()}`));
    // The system page is the device's own, never a row.
    expect(text).not.toContain(`data-row=${SYSTEM.toUpperCase()}`);
    expect(text).toContain("Not on this watch");
    expect(text).toContain("Tick its box under Jesse Apple Watch to add it.");
    expect(text).toMatch(/class=bd-row dim/);
    expect(text).toContain(">All devices<");
    // No Multi select on a focused device.
    expect(text).not.toContain("Multi select");
  });

  it("draws an iPhone's rows as the iPhone's pages, and offers its own screens but no Voice", async () => {
    const t = tab();
    t.el.onOpenScreen = () => undefined;
    showTab(t, PHONE);
    await t.ready();
    const text = t.whole();
    expect(text).toContain("lr-pic ph");
    expect(text).toContain("Also on this iPhone:");
    expect(text).toContain(">Settings<");
    expect(text).toContain(">Rooms<");
    expect(text).not.toContain(">Voice<");
  });

  it("saves Hide here on the device's own record, keeping its system page and every other page as loaded", async () => {
    const t = tab();
    showTab(t, JESSE);
    await t.ready();
    const loaded = ((t.home.held.get(`${JESSE}/pages`)!.document.pages) as JsonObject[]).map((p) => structuredClone(p));
    const device = { ownerId: JESSE, name: "Jesse Apple Watch", kind: "watch" };
    await t.call("changePicks", device, { id: SMART, hidden: true });
    const save = t.sentOf("watch_config/save").at(-1)!;
    expect(save).toMatchObject({ owner_watch_id: JESSE, kind: "pages", base_revision: 1 });
    const pages = (save.document as JsonObject).pages as JsonObject[];
    expect(pages.map((p) => p.id)).toEqual([SYSTEM, SMART, PAGE1.toUpperCase()]);
    expect(pages[1]!.isHidden).toBe(true);
    expect(pages[0]).toEqual(loaded[0]);
    expect(pages[2]).toEqual(loaded[2]);
    expect(pages[2]!.isHidden).toBe(true);
    // Home Assistant writes no link marks, and the panel adds none.
    for (const page of pages) expect(page).not.toHaveProperty("linkId");
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
    // The old "Add to…" menu; a card's fold chip says "+ Add to a device".
    expect(ask).not.toContain("Add to…");
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
    showCards(t);
    await t.ready();
    const text = t.whole();
    expect(text).toContain("Your status page library: 2 status pages.");
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

  it("lists a device's status pages with no Hide here, and opens one in the one editor", async () => {
    const t = tab("status_pages");
    showTab(t, JESSE);
    await t.ready();
    const text = t.whole();
    expect(text).toContain("2 rows");
    expect(text).not.toContain("Hide here");
    expect(text).not.toContain("bd-eye");
    expect(text).toContain("Every status page in your library is on Jesse Apple Watch.");
    const lib = (t.el.lib as { library: { statusPages: { id: string }[] } }).library;
    t.call("open", lib.statusPages.find((e) => e.id === STARTER));
    expect(t.opened).toHaveLength(0);
    expect(t.library.at(-1)).toEqual(["status_pages", STARTER, JESSE]);
    expect(takeStatusPageAsk(JESSE)).toBeUndefined();
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
