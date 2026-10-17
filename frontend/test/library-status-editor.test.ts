// The status pages editor's library parts, against a stand-in Home
// Assistant that works the library as the server does
// (`library-editor-home.ts`): the badges and the shared line, the tick row in
// the Page card, "Not on this watch" with its Add, the delete question, a
// status page deleted on its only device staying in the library, an untick
// clearing that device's Status page slots, the restore question naming the
// other devices, and the Status pages tab's New status page as the editor
// takes it.

import { describe, expect, it } from "vitest";

import type { OwnerSummary } from "../src/ha-api.js";
import { tickItem } from "../src/watch-pages/library-editing-io.js";
import type { JsonObject } from "../src/watch-pages/model.js";
import { askNewStatusPage, forgetStatusPagesDraft } from "../src/watch-status-pages/draft.js";
import { type StatusPagesDocument, statusPagesOf } from "../src/watch-status-pages/model.js";
import "../src/watch-status-pages/status-pages-editor.js";
import { type StatusPagesViewHost, renderPagesCard, renderStatusInspector } from "../src/watch-status-pages/view.js";
import { connectLibrary, flat, libraryHome, settle } from "./library-editor-home.js";

const U = (n: number) => `5A7E1000-0000-4000-8000-${n.toString(16).toUpperCase().padStart(12, "0")}`;
const HOUSE = U(1), DOORS = U(2), PHONE_ONLY = U(3);
const SYSTEM = "00000000-0000-0000-0000-000000000001";

const sp = (id: string, name: string, extra: JsonObject = {}): JsonObject => ({ id, name, rows: [], ...extra });
const sdoc = (...pages: JsonObject[]): StatusPagesDocument => ({ schemaVersion: 1, statusPages: pages });

let made = 0;

/** The editor on a watch with the starter page and House (both on the
 * iPhone too, with the server's link mark) and Doors (only here); the iPhone
 * has its own Phone page too. With `newPage`, the Status pages tab asked for
 * a new page there first. */
async function editor(options: { newPage?: boolean; history?: Record<string, JsonObject> } = {}) {
  const n = ++made;
  const watch = `ls-w1-${n}`;
  const phone = `ls-p1-${n}`;
  const owners = [
    { owner_watch_id: watch, device_name: "Jesse's Watch", device_kind: "watch" },
    { owner_watch_id: phone, device_name: "Jesse's iPhone", device_kind: "iphone", phone_pages: true },
  ] as unknown as OwnerSummary[];
  const starter = sp(SYSTEM, "Lights On", { linkId: SYSTEM });
  const house = sp(HOUSE, "House", { linkId: HOUSE });
  const ha = libraryHome({
    [`${watch}/status_pages`]: sdoc(starter, house, sp(DOORS, "Doors")),
    [`${phone}/status_pages`]: sdoc(starter, house, sp(PHONE_ONLY, "Phone")),
  }, options.history === undefined ? {} : { history: options.history });
  const Ctor = customElements.get("wa-status-pages-editor") as unknown as new () => Record<string, unknown>;
  const el = new Ctor();
  el.hass = ha.hass;
  el.owners = owners;
  el.phones = true;
  el.watchId = watch;
  el.renderRoot = { querySelector: () => null };
  Object.defineProperty(el, "updateComplete", { value: Promise.resolve(true) });
  // Node has no window: no drag to end, no delivery to poll for.
  el.endScrub = () => undefined;
  el.pollIfWaiting = () => undefined;
  forgetStatusPagesDraft(watch);
  const call = <T>(name: string, ...args: unknown[]): T => (el[name] as (...a: unknown[]) => T).apply(el, args);
  if (options.newPage === true) askNewStatusPage(watch);
  await call<Promise<void>>("load", watch);
  await connectLibrary(el);
  const host = () => call<StatusPagesViewHost>("viewHost");
  const page = (id: string) => statusPagesOf(host().document).find((p) => p.id === id)!;
  return { el, ha, watch, phone, call, host, page };
}

describe("the status pages editor's devices, from the library", () => {
  it("badges the pages other devices have too, and says so under the list", async () => {
    const { host, page } = await editor();
    expect(host().linkBadge?.(page(HOUSE))).toBe("Also on Jesse's iPhone");
    expect(host().linkBadge?.(page(DOORS))).toBeUndefined();
    expect(host().sharedLine).toBe("2 of these status pages are also on Jesse's iPhone. An edit here shows there too.");
    const card = flat(renderPagesCard(host()));
    expect(card).not.toContain("Devices for");
  });

  it("draws a tick per device in the Page card, this one locked on", async () => {
    const { host, page } = await editor();
    const ticks = flat(host().ticks?.(page(HOUSE)));
    expect(ticks).toContain("Jesse's Watch");
    expect(ticks).toContain("Jesse's iPhone");
    expect(ticks).toContain("On this watch. Delete takes the status page off it.");
    expect(flat(host().ticks?.(page(DOORS)))).toMatch(/lt-chip off[^>]*title=Not on Jesse's iPhone\. Tick to put the status page there\./);
    // The card shows it, with no Devices button.
    const inspector = flat(renderStatusInspector(host()));
    expect(inspector).toContain("lt-ticks");
    expect(inspector).not.toContain("sp-dev-open");
  });

  it("lists the library's rest under Not on this watch, and adds one here with library/pick", async () => {
    const { ha, call, host, watch } = await editor();
    const card = flat(renderPagesCard(host()));
    expect(card).toContain("Not on this watch");
    expect(card).toMatch(/Phone[\s\S]*0 rows · on Jesse's iPhone/);
    expect(card).toContain("Add to this watch");
    expect(card).not.toMatch(/data-item=5A7E1000-0000-4000-8000-000000000001/);
    await call<Promise<void>>("addHere", PHONE_ONLY);
    expect(ha.of("library/pick").map((m) => [m.owner_id, m.kind, m.item_id, m.on])).toEqual([[watch, "status_pages", PHONE_ONLY, true]]);
    expect(statusPagesOf(host().document).map((p) => p.name)).toEqual(["Lights On", "House", "Doors", "Phone"]);
  });

  it("deletes a page on this device alone at once, and asks for one other devices have too", async () => {
    const { call, el, host } = await editor();
    call("askDelete", DOORS);
    expect(el.deleteAsk).toBeUndefined();
    expect(statusPagesOf(host().document).map((p) => p.name)).toEqual(["Lights On", "House"]);
    call("askDelete", HOUSE);
    expect(el.deleteAsk).toEqual({ pageId: HOUSE });
    const ask = flat(call("renderDeleteAsk", el.deleteAsk));
    expect(ask).toContain("It is also on Jesse's iPhone.");
    expect(ask).toContain("Remove from this watch only");
    expect(ask).toContain("Delete from the library (it is on 2 devices)");
  });

  it("removes it from this watch only as an edit, and the save keeps the link marks as loaded", async () => {
    const { call, el, ha, host, watch } = await editor();
    call("askDelete", HOUSE);
    call("deleteHere");
    expect(statusPagesOf(host().document).map((p) => p.name)).toEqual(["Lights On", "Doors"]);
    await call<Promise<void>>("save");
    const saved = ha.of("watch_config/save").find((m) => m.owner_watch_id === watch)!.document as StatusPagesDocument;
    expect(statusPagesOf(saved).map((p) => [p.name, p.linkId])).toEqual([["Lights On", SYSTEM], ["Doors", undefined]]);
    expect(ha.of("library/delete")).toEqual([]);
    expect(el.watchId).toBe(watch);
  });

  it("deletes from the library at once, and the page goes here too", async () => {
    const { call, el, ha, host, phone } = await editor();
    call("askDelete", HOUSE);
    await call<Promise<void>>("deleteFromLibrary");
    await settle();
    expect(ha.of("library/delete").map((m) => [m.kind, m.item_id])).toEqual([["status_pages", HOUSE]]);
    expect(statusPagesOf(ha.held.get(`${phone}/status_pages`)!.document as StatusPagesDocument).map((p) => p.name)).toEqual(["Lights On", "Phone"]);
    expect(statusPagesOf(host().document).map((p) => p.name)).toEqual(["Lights On", "Doors"]);
    expect((el.note as { text: string }).text).toBe("Deleted from the library and from every device.");
  });

  it("leaves a status page in the library when the save takes it off its only device", async () => {
    const { call, ha } = await editor();
    call("askDelete", DOORS);
    await call<Promise<void>>("save");
    // The save removes the pick, never the item; a library/delete would
    // also clear every tile that opens it, on every page.
    expect(ha.of("library/delete")).toEqual([]);
  });

  it("clears this device's Status page slots once an untick took a status page off it", async () => {
    const n = made + 1;
    const watch = `ls-w1-${n}`;
    const show = (id: string, pageId: string) => ({ id, position: "topLeft", isVisible: true, action: { type: "showStatusPage", pageId } });
    const { el, ha } = await editor();
    ha.held.set(`${watch}/menus`, { revision: 2, document: { schemaVersion: 1, quickAction: { slots: [show("S1", DOORS), show("S2", HOUSE)] } } });
    ha.menus.OWN = { name: "Anywhere menu", kind: "anywhere", owners: [watch] };
    const store = (el.lib as { store: Parameters<typeof tickItem>[1] }).store;
    await store.refresh();
    expect((await tickItem(ha.hass, store, watch, "status_pages", DOORS, false)).ok).toBe(true);
    const saved = ha.of("watch_config/save").filter((m) => m.owner_watch_id === watch && m.kind === "menus");
    expect(saved).toHaveLength(1);
    expect(((saved[0]!.document as JsonObject).quickAction as { slots: JsonObject[] }).slots.map((s) => s.id)).toEqual(["S2"]);
  });

  it("names the other devices a restore changes", async () => {
    const n = made + 1;
    const { call, el } = await editor({ history: { [`ls-w1-${n}/status_pages/2`]: sdoc(sp(HOUSE, "House before"), sp(DOORS, "Doors before")) } });
    call("askRestore", { revision: 2, updated_at: null, updated_by: "panel", size: 10 });
    await settle();
    expect((el.restoreAsk as { others?: string }).others).toBe(`It also changes "House" on Jesse's iPhone, which has it too.`);
  });

  it("adds a page as it opens when the Status pages tab asked for one, and only once", async () => {
    const { call, host, watch, el } = await editor({ newPage: true });
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
