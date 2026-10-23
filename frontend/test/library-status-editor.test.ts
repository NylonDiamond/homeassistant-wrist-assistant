// The status pages editor's library parts, against a stand-in Home
// Assistant that works the library as the server does
// (`library-editor-home.ts`): the editor opened on a status page two devices
// have, from the watch. Checked: the tick strip under the canvas head with
// no device locked, an untick clearing that device's Status page slots and
// asking first, the delete question offering This device and Every device,
// and a delete from the library forgetting the draft and going back.

import { afterEach, describe, expect, it, vi } from "vitest";

import { laterHidden, laterToast, resetLaterForTest, sendLaterNow } from "../src/delete-later.js";
import type { OwnerSummary } from "../src/ha-api.js";
import { DELETE_EVERY_DEVICE, DELETE_THIS_DEVICE, libraryDraftKey } from "../src/library/item-mode.js";
import { libraryItem } from "../src/library/model.js";
import { tickItem } from "../src/watch-pages/library-editing-io.js";
import type { JsonObject } from "../src/watch-pages/model.js";
import { forgetStatusPagesDraft, keptStatusPagesDraft } from "../src/watch-status-pages/draft.js";
import { type StatusPagesDocument, statusPagesOf } from "../src/watch-status-pages/model.js";
import "../src/watch-status-pages/status-pages-editor.js";
import type { StatusPagesViewHost } from "../src/watch-status-pages/view.js";
import { connectLibrary, flat, libraryHome, settle } from "./library-editor-home.js";

const U = (n: number) => `5A7E1000-0000-4000-8000-${n.toString(16).toUpperCase().padStart(12, "0")}`;
const HOUSE = U(1), DOORS = U(2), PHONE_ONLY = U(3);

const sp = (id: string, name: string, extra: JsonObject = {}): JsonObject => ({ id, name, rows: [], ...extra });
const sdoc = (...pages: JsonObject[]): StatusPagesDocument => ({ schemaVersion: 1, statusPages: pages });

let made = 0;

/** The editor on House, opened from the watch: House is on the watch and the
 * iPhone, Doors only on the watch, Phone only on the iPhone. */
async function editor() {
  const n = ++made;
  const watch = `ls-w1-${n}`;
  const phone = `ls-p1-${n}`;
  const owners = [
    { owner_watch_id: watch, device_name: "Jesse's Watch", device_kind: "watch" },
    { owner_watch_id: phone, device_name: "Jesse's iPhone", device_kind: "iphone", phone_pages: true },
  ] as unknown as OwnerSummary[];
  const house = sp(HOUSE, "House", { linkId: HOUSE });
  const ha = libraryHome({
    [`${watch}/status_pages`]: sdoc(house, sp(DOORS, "Doors")),
    [`${phone}/status_pages`]: sdoc(house, sp(PHONE_ONLY, "Phone")),
  });
  const Ctor = customElements.get("wa-status-pages-editor") as unknown as new () => Record<string, unknown>;
  const el = new Ctor();
  const ref = { kind: "status_pages" as const, id: HOUSE, from: watch };
  const key = libraryDraftKey(ref);
  el.hass = ha.hass;
  el.owners = owners;
  el.phones = true;
  el.libraryItem = ref;
  // As `followLibraryItem` leaves it once it opened the item.
  el.openedItem = ref;
  el.watchId = watch;
  el.renderRoot = { querySelector: () => null };
  Object.defineProperty(el, "updateComplete", { value: Promise.resolve(true) });
  // Node has no window: no drag to end.
  el.endScrub = () => undefined;
  forgetStatusPagesDraft(key);
  const call = <T>(name: string, ...args: unknown[]): T => (el[name] as (...a: unknown[]) => T).apply(el, args);
  await call<Promise<void>>("load", key);
  await connectLibrary(el);
  const host = () => call<StatusPagesViewHost>("viewHost");
  const page = () => statusPagesOf(host().document)[0]!;
  return { el, ha, watch, phone, key, call, host, page };
}

describe("the status pages editor's devices, from the library", () => {
  afterEach(resetLaterForTest);

  it("draws a tick per device in the strip under the canvas head, none locked", async () => {
    const { call, el, host, page } = await editor();
    expect(statusPagesOf(host().document).map((p) => p.id)).toEqual([HOUSE]);
    const ticks = flat(call("renderStageDevices", page()));
    expect(ticks).toContain("lib-on over-stage");
    expect(ticks).toContain("Jesse's Watch");
    expect(ticks).toContain("Jesse's iPhone");
    expect(ticks).not.toContain("Delete takes the status page off it.");
    const stage = flat(call("renderStage", host(), el.owners));
    expect(stage).toMatch(/cv-head[\s\S]*lib-on over-stage[\s\S]*lt-ticks[\s\S]*class="stage-area/);
  });

  it("clears a device's Status page slots once an untick took a status page off it", async () => {
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

  it("asks before an untick that clears Status page slots, and says what it cleared after Remove", async () => {
    const n = made + 1;
    const phone = `ls-p1-${n}`;
    const show = (id: string, pageId: string) => ({ id, position: "topLeft", isVisible: true, action: { type: "showStatusPage", pageId } });
    const { el, ha, call } = await editor();
    ha.held.set(`${phone}/menus`, { revision: 2, document: { schemaVersion: 1, quickAction: { slots: [show("S1", HOUSE)] } } });
    ha.menus.PHONE = { name: "Anywhere menu", kind: "anywhere", owners: [phone] };
    const store = (el.lib as { store: Parameters<typeof tickItem>[1] }).store;
    await store.refresh();
    const house = libraryItem(store.library!, "status_pages", HOUSE);
    call("tickStatusPage", house, phone, false);
    await settle();
    await settle();
    expect(ha.of("library/pick")).toEqual([]);
    expect((el.untickAsk as { text: string }).text).toBe("Take House off Jesse's iPhone? 1 menu slot that opens it is cleared too.");
    await call<Promise<void>>("untickNow", el.untickAsk);
    expect(ha.of("library/pick").map((m) => [m.item_id, m.on])).toEqual([[HOUSE, false]]);
    expect(el.note).toEqual({ kind: "ok", text: "Took House off Jesse's iPhone and cleared 1 menu slot that opened it." });
  });

  it("asks This device or Every device for a page the device it was opened from shares", async () => {
    const { call, el } = await editor();
    call("askDelete", HOUSE);
    expect(el.deleteAsk).toEqual({ pageId: HOUSE });
    const ask = flat(call("renderDeleteAsk", el.deleteAsk));
    expect(ask).toContain(DELETE_THIS_DEVICE);
    expect(ask).toContain(DELETE_EVERY_DEVICE);
    expect(ask).toContain("Take it off Jesse's Watch only");
  });

  it("goes back at once with Undo, then deletes from the library and forgets its draft", async () => {
    const { call, el, ha, key, phone } = await editor();
    let back = 0;
    el.onBack = () => { back++; };
    call("askDelete", HOUSE);
    call("deleteFromLibrary");
    expect(back).toBe(1);
    expect(laterToast()?.undo).toBe(true);
    expect(ha.of("library/delete")).toEqual([]);
    sendLaterNow();
    await vi.waitFor(() => expect(laterHidden().size).toBe(0));
    await settle();
    expect(ha.of("library/delete").map((m) => [m.kind, m.item_id])).toEqual([["status_pages", HOUSE]]);
    expect(statusPagesOf(ha.held.get(`${phone}/status_pages`)!.document as StatusPagesDocument).map((p) => p.name)).toEqual(["Phone"]);
    expect(keptStatusPagesDraft(key)).toBeUndefined();
    expect(el.deleteAsk).toBeUndefined();
    expect(back).toBe(1);
  });
});
