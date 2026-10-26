// The page editor's library parts, against a stand-in Home Assistant that
// works the library as the server does (`library-editor-home.ts`): the tick
// row over the stage of a library page, a tick and an untick through
// `library/pick`, an untick clearing that device's menu slots and taps, and
// the lock on a device whose page draft holds unsaved edits.

import { describe, expect, it } from "vitest";

import type { OwnerSummary } from "../src/ha-api.js";
import { libraryDraftKey } from "../src/library/item-mode.js";
import { libraryItem } from "../src/library/model.js";
import { forgetWatchPagesDraft, keptWatchPagesDraft } from "../src/watch-pages/kept.js";
import { tickItem } from "../src/watch-pages/library-editing-io.js";
import type { JsonObject, WatchPagesDocument } from "../src/watch-pages/model.js";
import "../src/watch-pages/page-editor.js";
import { connectLibrary, flat, libraryHome, settle } from "./library-editor-home.js";

const U = (n: number) => `11B0E000-0000-4000-8000-${n.toString(16).toUpperCase().padStart(12, "0")}`;
const HALL = U(1), YARD = U(2), DEN = U(3), MINE = U(4), SHED = U(5);
const tile = (n: number, entityId: string) => ({ id: U(100 + n), entityId, gridCol: 0, gridRow: n * 3, colSpan: 6, rowSpan: 3 });

const owner = (o: Partial<OwnerSummary>): OwnerSummary => ({
  owner_watch_id: "x", device_name: "Apple Watch", device_kind: "watch", paired_iphone_name: null, app_version: "3.0.0",
  screen_size: null, complication_count: 0, token: 3, applied_token: 3, is_orphan: false, ...o,
} as OwnerSummary);

const pagesDoc = (...pages: JsonObject[]): WatchPagesDocument => ({ schemaVersion: 1, pages });

let made = 0;

/**
 * The page editor on Hall in the library, previewed on Jesse's Watch. The
 * watch has Hall (on the iPhone too, with the server's link mark), Yard (on
 * the iPhone too) and Mine (only here); the iPhone has Hall, Yard and Den
 * (only there).
 */
async function editor(options: { complications?: Record<string, JsonObject[]> } = {}) {
  const n = ++made;
  const watch = `lp-w1-${n}`;
  const phone = `lp-p1-${n}`;
  const owners = [
    owner({ owner_watch_id: watch, device_name: "Jesse's Watch", main_house: true }),
    owner({ owner_watch_id: phone, device_name: "Jesse's iPhone", device_kind: "iphone", phone_pages: true }),
  ];
  const hall = { id: HALL, name: "Hall", linkId: HALL, items: [tile(1, `page.${YARD}`), tile(2, "light.hall")] };
  const yard = { id: YARD, name: "Yard", linkId: YARD, items: [tile(1, "light.yard")] };
  const ha = libraryHome({
    [`${watch}/pages`]: pagesDoc(hall, yard, { id: MINE, name: "Mine", items: [tile(1, "light.mine")] }),
    [`${phone}/pages`]: pagesDoc(hall, { ...yard, isHidden: true }, { id: DEN, name: "Den", items: [tile(1, "light.den")] }),
  }, {
    unpicked: { [SHED]: { id: SHED, name: "Shed", items: [] } },
    ...(options.complications === undefined ? {} : { complications: options.complications }),
  });
  const Ctor = customElements.get("wa-page-editor") as unknown as new () => Record<string, unknown>;
  const el = new Ctor();
  const ref = { kind: "pages" as const, id: HALL };
  el.hass = ha.hass;
  el.owners = owners;
  el.phones = true;
  el.libraryItem = ref;
  // As `followLibraryItem` leaves it once it opened the item.
  el.openedItem = ref;
  el.watchId = watch;
  const key = libraryDraftKey(ref);
  forgetWatchPagesDraft(key);
  el.renderInspector = () => "";
  el.renderRoot = { activeElement: null, querySelector: () => null };
  el.leaveTile = () => undefined;
  Object.defineProperty(el, "updateComplete", { value: Promise.resolve(true) });
  const call = <T>(name: string, ...args: unknown[]): T => (el[name] as (...a: unknown[]) => T).apply(el, args);
  await call<Promise<void>>("load", key);
  await connectLibrary(el);
  const draft = () => keptWatchPagesDraft(key)!;
  const page = () => (draft().document.pages as JsonObject[])[0]!;
  return {
    el, ha, watch, phone, owners, call, draft, page,
    ticks: () => flat(call("renderBarTicks", page())),
  };
}

describe("the page editor's devices, from the library", () => {
  it("draws a tick per device in the editor bar, after a small On, with no device locked as this one", async () => {
    const { ticks } = await editor();
    const hall = ticks();
    expect(hall).toMatch(/class="pe-bar-on "[^>]*aria-label=Which devices do you want this on\?>\s*<span class="pe-bar-on-l">On<\/span>/);
    expect(hall).toContain("Jesse's Watch");
    expect(hall).toContain("Jesse's iPhone");
    expect(hall).not.toContain("On this watch. Delete takes the page off it.");
    expect(hall).toMatch(/lt-chip on[^>]*title=On Jesse's iPhone\. Untick to take the page off it\./);
  });

  it("counts on the watch's chip the tiles it skips, from the page as edited, before a save", async () => {
    const { ticks, draft } = await editor();
    expect(ticks()).not.toContain("lt-skips");
    const doc = structuredClone(draft().document);
    const hall = (doc.pages as JsonObject[])[0]!;
    hall.items = [...(hall.items as JsonObject[]), { id: U(200), entityId: `map.${U(201)}`, gridCol: 0, gridRow: 9, colSpan: 12, rowSpan: 4 }];
    draft().apply(doc);
    const strip = ticks();
    expect(strip).toContain(`Jesse's Watch</span><em class="lt-skips" title=Jesse's Watch skips Map: only an iPhone shows it.>skips 1</em></button>`);
    expect(strip).not.toMatch(/Jesse's iPhone<\/span><em class="lt-skips"/);
    // One row, still: the count is inside the chip.
    expect(strip.match(/class="pe-bar-on[ "]/g)).toHaveLength(1);
    expect(strip.match(/<wa-chip-row/g)).toHaveLength(1);
  });

  it("says to save first for a page the library does not list yet", async () => {
    const { call } = await editor();
    const text = flat(call("renderBarTicks", { id: U(999), name: "New", items: [] }));
    expect(text).toContain("Save first, then tick a device to put the page there too.");
  });

  it("puts a page on another device with library/pick, and takes it off again", async () => {
    const { el, ha, phone } = await editor();
    const store = (el.lib as { store: { pick(o: string, k: string, i: string, on: boolean): Promise<unknown> } }).store;
    await store.pick(phone, "pages", MINE, true);
    expect(ha.of("library/pick").map((m) => [m.owner_id, m.kind, m.item_id, m.on])).toEqual([[phone, "pages", MINE, true]]);
    expect(ha.summary().pages[MINE]!.owners).toContain(phone);
    await store.pick(phone, "pages", MINE, false);
    expect(ha.summary().pages[MINE]!.owners).not.toContain(phone);
  });

  it("will not untick a device whose page draft holds unsaved edits", async () => {
    const { call, phone, watch } = await editor();
    // The iPhone's draft, kept in this tab and edited.
    const { takeWatchPagesRecord } = await import("../src/watch-pages/kept.js");
    takeWatchPagesRecord(phone, pagesDoc({ id: HALL, name: "Hall", items: [] }), 4);
    keptWatchPagesDraft(phone)!.apply(pagesDoc({ id: HALL, name: "Hall here", items: [] }));
    expect(call("pageTickLocked", HALL, phone)).toBe("Save or discard the edits on Jesse's iPhone first.");
    // A device that does not have it can still take it.
    expect(call("pageTickLocked", MINE, phone)).toBeUndefined();
    // No device is "here": the preview device ticks as any.
    expect(call("pageTickLocked", HALL, watch)).toBeUndefined();
    forgetWatchPagesDraft(phone);
  });
});

describe("unticking a device under the library", () => {
  it("clears this device's menu slots to a page an untick took off it, and keeps a shared menu's slot another device needs", async () => {
    const n = made + 1;
    const watch = `lp-w1-${n}`;
    const phone = `lp-p1-${n}`;
    const go = (id: string, pageId: string) => ({ id, position: "topLeft", isVisible: true, action: { type: "navigateToPage", pageId } });
    const tap = { name: "Mine tap", openPageId: MINE, tapAction: { type: "openPage" } };
    const { el, ha } = await editor({ complications: { [watch]: [tap] } });
    // The watch's own Anywhere menu opens Mine and Hall.
    ha.held.set(`${watch}/menus`, { revision: 2, document: { schemaVersion: 1, quickAction: { slots: [go("S1", MINE), go("S2", HALL)] } } });
    ha.menus.OWN = { name: "Anywhere menu", kind: "anywhere", owners: [watch] };
    const store = (el.lib as { store: Parameters<typeof tickItem>[1] }).store;
    await store.refresh();
    const result = await tickItem(ha.hass, store, watch, "pages", MINE, false);
    expect(result.ok).toBe(true);
    const menusSaved = ha.of("watch_config/save").filter((m) => m.owner_watch_id === watch && m.kind === "menus");
    expect(menusSaved).toHaveLength(1);
    const slots = ((menusSaved[0]!.document as JsonObject).quickAction as { slots: JsonObject[] }).slots;
    expect(slots.map((s) => s.id)).toEqual(["S2"]);
    expect(ha.of("/save").filter((m) => !(m.type as string).endsWith("watch_config/save")).map((m) => m.owner_watch_id)).toEqual([watch]);
    // A menu the iPhone uses too keeps its slot to Hall, which the iPhone has.
    ha.held.set(`${watch}/menus`, { revision: 5, document: { schemaVersion: 1, quickAction: { slots: [go("S2", HALL)] } } });
    ha.menus.OWN!.owners.push(phone);
    await store.refresh();
    await tickItem(ha.hass, store, watch, "pages", HALL, false);
    expect(ha.of("watch_config/save").filter((m) => m.owner_watch_id === watch && m.kind === "menus")).toHaveLength(1);
    // Ticking on clears nothing.
    expect((await tickItem(ha.hass, store, watch, "pages", DEN, true)).ok).toBe(true);
    expect(ha.of("watch_config/save").filter((m) => m.owner_watch_id === watch && m.kind === "menus")).toHaveLength(1);
  });

  it("asks before an untick that clears menu slots and taps, and says what it cleared after Remove", async () => {
    const n = made + 1;
    const phone = `lp-p1-${n}`;
    const go = (id: string, pageId: string) => ({ id, position: "topLeft", isVisible: true, action: { type: "navigateToPage", pageId } });
    const tap = { name: "Den tap", openPageId: DEN, tapAction: { type: "openPage" } };
    const { el, ha, call } = await editor({ complications: { [phone]: [tap] } });
    ha.held.set(`${phone}/menus`, { revision: 2, document: { schemaVersion: 1, quickAction: { slots: [go("S1", DEN), go("S2", DEN), go("S3", HALL)] } } });
    ha.menus.PHONE = { name: "Anywhere menu", kind: "anywhere", owners: [phone] };
    const store = (el.lib as { store: Parameters<typeof tickItem>[1] }).store;
    await store.refresh();
    const den = libraryItem(store.library!, "pages", DEN);
    call("tickPage", den, phone, false);
    await settle();
    await settle();
    // Nothing taken off yet: the question is under the row.
    expect(ha.of("library/pick")).toEqual([]);
    const ask = el.untickAsk as { text: string } | undefined;
    expect(ask?.text).toBe("Take Den off Jesse's iPhone? 2 menu slots and 1 complication tap that open it are cleared too.");
    // Cancel leaves the page where it was.
    (el as Record<string, unknown>).untickAsk = undefined;
    expect(ha.of("library/pick")).toEqual([]);
    call("tickPage", den, phone, false);
    await settle();
    await settle();
    await call<Promise<void>>("untickNow", el.untickAsk);
    expect(ha.of("library/pick").map((m) => [m.item_id, m.on])).toEqual([[DEN, false]]);
    expect(el.untickAsk).toBeUndefined();
    expect(el.note).toEqual({ kind: "ok", text: "Took Den off Jesse's iPhone and cleared 2 menu slots and 1 complication tap that opened it." });
  });

  it("unticks at once when nothing there opens the page", async () => {
    const { el, ha, call, phone } = await editor();
    const store = (el.lib as { store: Parameters<typeof tickItem>[1] }).store;
    const den = libraryItem(store.library!, "pages", DEN);
    call("tickPage", den, phone, false);
    await settle();
    await settle();
    await settle();
    expect(el.untickAsk).toBeUndefined();
    expect(ha.of("library/pick").map((m) => [m.item_id, m.on])).toEqual([[DEN, false]]);
    expect(el.note).toBeUndefined();
  });
});
