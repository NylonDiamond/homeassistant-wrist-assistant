// The page editor's library parts, against a stand-in Home Assistant that
// works the library as the server does (`library-editor-home.ts`): the tick
// row in a page's settings, the badge on a row, "Not on this watch" with its
// Add, the delete question ("Remove from this watch only" or "Delete from the
// library"), a page deleted on its only device staying in the library, an
// untick clearing that device's menu slots and taps, the restore question
// naming the other devices, and every save keeping the records' `linkId` as
// loaded.

import { describe, expect, it } from "vitest";

import type { OwnerSummary } from "../src/ha-api.js";
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
 * The page editor on Jesse's Watch. The watch has Hall (on the iPhone too,
 * with the server's link mark), Yard (on the iPhone too) and Mine (only
 * here); the iPhone has Hall, Yard and Den (only there). With `library`
 * false the integration has no library.
 */
async function editor(options: { library?: boolean; history?: Record<string, JsonObject>; complications?: Record<string, JsonObject[]> } = {}) {
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
    ...(options.library === false ? { noLibrary: true } : {}),
    unpicked: { [SHED]: { id: SHED, name: "Shed", items: [] } },
    ...(options.history === undefined ? {} : { history: options.history }),
    ...(options.complications === undefined ? {} : { complications: options.complications }),
  });
  const Ctor = customElements.get("wa-page-editor") as unknown as new () => Record<string, unknown>;
  const el = new Ctor();
  el.hass = ha.hass;
  el.owners = owners;
  el.phones = true;
  el.shellOwnsWatch = true;
  el.watchId = watch;
  forgetWatchPagesDraft(watch);
  el.renderInspector = () => "";
  el.renderRoot = { activeElement: null, querySelector: () => null };
  el.leaveTile = () => undefined;
  Object.defineProperty(el, "updateComplete", { value: Promise.resolve(true) });
  const call = <T>(name: string, ...args: unknown[]): T => (el[name] as (...a: unknown[]) => T).apply(el, args);
  await call<Promise<void>>("load", watch);
  await connectLibrary(el);
  const draft = () => keptWatchPagesDraft(watch)!;
  const page = (id: string) => (draft().document.pages as JsonObject[]).find((p) => p.id === id)!;
  return {
    el, ha, watch, phone, owners, call, draft, page,
    body: () => flat(call("renderBody", owners)),
    ticks: (id: string) => flat(call("renderPageTicks", page(id))),
  };
}

describe("the page editor's devices, from the library", () => {
  it("badges a page other devices have too, and not one only here", async () => {
    const { body } = await editor();
    const text = body();
    expect(text).toMatch(/pe-linked[^>]*>Also on Jesse's iPhone</);
    // Hall and Yard, not Mine.
    expect(text.match(/badge pe-linked/g)).toHaveLength(2);
  });

  it("draws a tick per device in the page's settings, this one locked on", async () => {
    const { ticks, phone } = await editor();
    const hall = ticks(HALL);
    expect(hall).toMatch(/lib-on card[\s\S]*Which devices do you want this on\?/);
    expect(hall).toContain("Jesse's Watch");
    expect(hall).toContain("Jesse's iPhone");
    expect(hall).toContain("On this watch. Delete takes the page off it.");
    expect(hall).toMatch(/lt-chip on[^>]*title=On Jesse's iPhone\. Untick to take the page off it\./);
    expect(hall).toMatch(/lt-chip on +stuck[^>]*title=On this watch\./);
    const mine = ticks(MINE);
    expect(mine).toMatch(/lt-chip off[^>]*title=Not on Jesse's iPhone\. Tick to put the page there\./);
    // Hidden on the iPhone: still ticked, dimmed.
    expect(ticks(YARD)).toContain("<em>hidden</em>");
    expect(phone).toBeDefined();
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

  it("will not untick a device whose page editor holds unsaved edits", async () => {
    const { call, phone, watch } = await editor();
    // The iPhone's draft, opened in this tab and edited.
    const { takeWatchPagesRecord } = await import("../src/watch-pages/kept.js");
    takeWatchPagesRecord(phone, pagesDoc({ id: HALL, name: "Hall", items: [] }), 4);
    keptWatchPagesDraft(phone)!.apply(pagesDoc({ id: HALL, name: "Hall here", items: [] }));
    expect(call("pageTickLocked", HALL, phone)).toBe("Save or discard the edits on Jesse's iPhone first.");
    // A device that does not have it can still take it.
    expect(call("pageTickLocked", MINE, phone)).toBeUndefined();
    expect(call("pageTickLocked", HALL, watch)).toBe("On this watch. Delete takes the page off it.");
    forgetWatchPagesDraft(phone);
  });

  it("says to save first for a page not in the library yet", async () => {
    const { call, draft, ticks } = await editor();
    call("addPage");
    const added = (draft().document.pages as JsonObject[]).at(-1)!;
    expect(ticks(added.id as string)).toContain("Save first, then tick a device to put the page there too.");
  });

  it("lists the library's rest under Not on this watch, with a picture and Add to this watch", async () => {
    const { body } = await editor();
    const text = body();
    expect(text).toContain("Not on this watch");
    expect(text).toContain("The rest of your home. Add one here with a tick.");
    expect(text).toMatch(/data-item=11B0E000-0000-4000-8000-000000000003[\s\S]*Den[\s\S]*1 tile · on Jesse's iPhone/);
    expect(text).toContain("Shed");
    expect(text).toContain("0 tiles · on no device");
    expect(text).toContain("Add to this watch");
    expect(text).toContain("lr-pic");
    expect(text).toContain(">See all pages</a>");
    expect(text).not.toContain("on other devices.");
  });

  it("adds one here with library/pick, then shows it", async () => {
    const { el, ha, call, watch, draft } = await editor();
    await call<Promise<void>>("addFromLibrary", DEN);
    expect(ha.of("library/pick").map((m) => [m.owner_id, m.kind, m.item_id, m.on])).toEqual([[watch, "pages", DEN, true]]);
    expect((draft().document.pages as JsonObject[]).map((p) => p.name)).toEqual(["Hall", "Yard", "Mine", "Den"]);
    expect(el.selectedPageId).toBe(DEN);
  });

  it("is all off on an integration with no library", async () => {
    const { body, ticks } = await editor({ library: false });
    const text = body();
    expect(text).not.toContain("Also on");
    expect(text).not.toContain("Not on this watch");
    expect(ticks(HALL)).toBe("");
  });
});

describe("deleting a page under the library", () => {
  it("asks for a page other devices have too: remove here only, or delete from the library", async () => {
    const { el, call, draft } = await editor();
    call("askDelete", HALL);
    await settle();
    // Its tiles sit on pages other devices may have too: kept unless asked.
    expect((el.deleteAsk as { removeLinks: boolean }).removeLinks).toBe(false);
    const text = flat(call("renderDeleteAsk", el.deleteAsk, draft().document));
    expect(text).toContain("It is also on Jesse's iPhone.");
    expect(text).toContain("Remove from this watch only");
    expect(text).toContain("Delete from the library (it is on 2 devices)");
    expect(text).not.toContain("Delete on all");
  });

  it("asks only Delete page for a page on this device alone", async () => {
    const { el, call, draft } = await editor();
    call("askDelete", MINE);
    await settle();
    expect((el.deleteAsk as { removeLinks: boolean }).removeLinks).toBe(true);
    const text = flat(call("renderDeleteAsk", el.deleteAsk, draft().document));
    expect(text).toContain(">Delete page<");
    expect(text).not.toContain("Delete from the library");
  });

  it("removes it from this watch only as an edit, and the save keeps every link mark as loaded", async () => {
    const { el, ha, call, watch, draft } = await editor();
    call("askDelete", HALL);
    await settle();
    call("deletePage");
    expect((draft().document.pages as JsonObject[]).map((p) => p.name)).toEqual(["Yard", "Mine"]);
    await call<Promise<unknown>>("save", true);
    const saved = ha.of("watch_config/save").find((m) => m.owner_watch_id === watch)!.document as WatchPagesDocument;
    expect((saved.pages as JsonObject[]).map((p) => [p.name, p.linkId])).toEqual([["Yard", YARD], ["Mine", undefined]]);
    // The iPhone still has it: nothing leaves the library.
    expect(ha.of("library/delete")).toEqual([]);
    expect(el.watchId).toBe(watch);
  });

  it("leaves a page in the library when the save takes it off its only device, and keeps the tiles the question kept", async () => {
    const { el, ha, call, watch } = await editor();
    // Hall has a tile that opens Yard; Yard goes, but its tiles are kept.
    call("askDelete", YARD);
    await settle();
    el.deleteAsk = { ...(el.deleteAsk as object), removeLinks: false };
    call("deletePage");
    await call<Promise<unknown>>("save", true);
    // The save removes the pick, never the item: no library/delete, which
    // would clear every tile that opened it on every page.
    expect(ha.of("library/delete")).toEqual([]);
    const saved = ha.of("watch_config/save").find((m) => m.owner_watch_id === watch)!.document as WatchPagesDocument;
    const hall = (saved.pages as JsonObject[]).find((p) => p.id === HALL)!;
    expect((hall.items as JsonObject[]).map((t) => t.entityId)).toContain(`page.${YARD}`);
    // Mine, on this watch alone, the same.
    call("askDelete", MINE);
    await settle();
    call("deletePage");
    await call<Promise<unknown>>("save", true);
    expect(ha.of("library/delete")).toEqual([]);
  });

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

  it("deletes from the library at once, clears the complication taps on every device that had it, and shows it gone", async () => {
    const tap = { name: "Hall tap", openPageId: HALL, tapAction: { type: "openPage" } };
    const { el, ha, call, watch, phone, draft } = await editor({ complications: { [`lp-p1-${made + 1}`]: [tap] } });
    call("askDelete", HALL);
    await settle();
    await call<Promise<void>>("deleteFromLibrary");
    await settle();
    expect(ha.of("library/delete").map((m) => [m.kind, m.item_id])).toEqual([["pages", HALL]]);
    expect([...new Set(ha.of("/list").map((m) => m.owner_watch_id))].sort()).toEqual([watch, phone].sort());
    expect(ha.of("/save").filter((m) => !(m.type as string).endsWith("watch_config/save")).map((m) => m.owner_watch_id)).toEqual([phone]);
    expect((draft().document.pages as JsonObject[]).map((p) => p.name)).toEqual(["Yard", "Mine"]);
    expect((el.note as { text: string }).text).toBe("Deleted from the library and from every device. Cleared the deleted page from the tap of 1 complication.");
    expect(el.deleteAsk).toBeUndefined();
  });
});

describe("restoring under the library", () => {
  it("names the other devices a restore changes, and not for a page only here", async () => {
    const changed = pagesDoc({ id: HALL, name: "Hall", items: [] }, { id: MINE, name: "Mine before", items: [] });
    const same = pagesDoc({ id: YARD, name: "Yard", isHidden: true, linkId: YARD, items: [tile(1, "light.yard")] });
    const n = made + 1;
    const { el, call } = await editor({ history: { [`lp-w1-${n}/pages/2`]: changed, [`lp-w1-${n}/pages/3`]: same } });
    call("askRestore", { revision: 2, updated_at: null, updated_by: "panel", size: 10 });
    await settle();
    expect((el.restoreAsk as { others?: string }).others).toBe(`It also changes "Hall" on Jesse's iPhone, which has it too.`);
    expect(flat(call("renderRestoreAsk", el.restoreAsk))).toContain(`It also changes "Hall" on Jesse's iPhone, which has it too.`);
    // The same content, its Hide here and link mark aside: nothing changes there.
    call("askRestore", { revision: 3, updated_at: null, updated_by: "panel", size: 10 });
    await settle();
    expect((el.restoreAsk as { others?: string }).others).toBeUndefined();
  });
});
