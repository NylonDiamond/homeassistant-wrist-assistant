// Library mode: a page, status page or menu no device has, edited in the
// library itself (`library/item-mode.ts`). Each editor is stood up with a
// `libraryItem` against the stand-in Home Assistant (`library-editor-home.ts`),
// which reads and saves one item as the server does. Checked: the one item
// document is what is edited, "Preview on" (a watch or an iPhone thumbnail)
// stands in the stage strip, the devices stand in the bar, nothing of a
// device's own is drawn (order, Hide here, history,
// delivery, Not on this watch), the ticks and Delete are there, a save is a
// `library/item/save` over the item's revision, and a conflict reads the
// item again and saves over the new revision. Then the addresses, the bar's
// tab, the kept drafts' keys and the tab fake's two new commands.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type { OwnerSummary } from "../src/ha-api.js";
import { fetchLibraryItem, saveLibraryItem } from "../src/library/client.js";
import { nothing } from "lit";
import { LIBRARY_PREVIEW_KEY, libraryDeleteText, libraryDraftKey, libraryRecord, onDevicesQuestion, onDevicesText, previewOwner, rememberPreview, renderPreviewPicker, sameLibraryItem, storedPreviewKind } from "../src/library/item-mode.js";
import { barTabOf, libraryItemPath, libraryRouteOf, panelPrefix, screenIdOf, swallowsSaveKey, tabOfRoute } from "../src/shell.js";
import { ALL_MENUS_PATH } from "../src/watch-menus/all-menus-hook.js";
import { forgetWatchMenusDraft, keptWatchMenusDraft } from "../src/watch-menus/draft.js";
import "../src/watch-menus/menu-editor.js";
import { type MenusViewHost, renderMenusCard, shownMenu } from "../src/watch-menus/menu-view.js";
import { type MenusDocument, setWatchMenuStyle } from "../src/watch-menus/model.js";
import { anyWatchPagesDirty, dropAllWatchPages, forgetWatchPagesDraft, keptWatchPagesDraft, takeWatchPagesRecord } from "../src/watch-pages/kept.js";
import type { JsonObject, WatchPagesDocument } from "../src/watch-pages/model.js";
import "../src/watch-pages/page-editor.js";
import { forgetStatusPagesDraft, keptStatusPagesDraft } from "../src/watch-status-pages/draft.js";
import { type StatusPagesDocument, renameStatusPage, statusPagesOf } from "../src/watch-status-pages/model.js";
import "../src/watch-status-pages/status-pages-editor.js";
import { type StatusPagesViewHost, renderPagesCard, renderStatusInspector } from "../src/watch-status-pages/view.js";
import { connectLibrary, flat, libraryHome, settle } from "./library-editor-home.js";
import { fakeHome } from "./library-tab-fake.js";
import { LONELY } from "./library-fixture.js";

const DEFAULTS = JSON.parse(readFileSync(join(__dirname, "fixtures-menus", "01-defaults.json"), "utf8")) as MenusDocument;

const U = (n: number) => `1AB0E000-0000-4000-8000-${n.toString(16).toUpperCase().padStart(12, "0")}`;
const HALL = U(1), SHED = U(2), HOUSE = U(3), LONE = U(4), HOME_MENU = U(5), SPARE = U(6), SOLO = U(7);
const tile = (n: number, entityId: string) => ({ id: U(100 + n), entityId, gridCol: 0, gridRow: n * 3, colSpan: 6, rowSpan: 3 });

const owner = (o: Partial<OwnerSummary>): OwnerSummary => ({
  owner_watch_id: "x", device_name: "Apple Watch", device_kind: "watch", paired_iphone_name: null, app_version: "3.0.0",
  screen_size: null, complication_count: 0, token: 3, applied_token: 3, is_orphan: false, ...o,
} as OwnerSummary);

let made = 0;

/** Two devices, Jesse's Watch and Jesse's iPhone, with Hall, House and the
 * Home menu on the watch; the library also holds Shed, Lone, the Spare
 * Anywhere menu and the Solo Entity quick menu, none on any device. */
function home() {
  const n = ++made;
  const watch = `lm-w-${n}`;
  const phone = `lm-p-${n}`;
  const owners = [
    owner({ owner_watch_id: watch, device_name: "Jesse's Watch", main_house: true }),
    owner({ owner_watch_id: phone, device_name: "Jesse's iPhone", device_kind: "iphone", phone_pages: true }),
  ];
  const { entityRadial, quickAction, pageSwitcher } = structuredClone(DEFAULTS);
  const ha = libraryHome({
    [`${watch}/pages`]: { schemaVersion: 1, pages: [{ id: HALL, name: "Hall", items: [tile(1, "light.hall")] }] },
    [`${watch}/status_pages`]: { schemaVersion: 1, statusPages: [{ id: HOUSE, name: "House", rows: [] }] },
    [`${watch}/menus`]: structuredClone(DEFAULTS),
  }, {
    unpicked: { [SHED]: { id: SHED, name: "Shed", items: [tile(1, "light.shed")] } },
    unpickedStatus: { [LONE]: { id: LONE, name: "Lone", rows: [] } },
    menus: {
      [HOME_MENU]: { name: "Home menu", kind: "anywhere", owners: [watch] },
      [SPARE]: { name: "Spare", kind: "anywhere", owners: [], sections: { quickAction, pageSwitcher } },
      [SOLO]: { name: "Solo", kind: "entity", owners: [], sections: { entityRadial } },
    },
  });
  return { ha, watch, phone, owners };
}

type Home = ReturnType<typeof home>;

/** One editor element in library mode on `id`, its preview the watch. */
function standUp(tag: string, h: Home, kind: "pages" | "status_pages" | "menus", id: string) {
  const Ctor = customElements.get(tag) as unknown as new () => Record<string, unknown>;
  const el = new Ctor();
  const ref = { kind, id };
  el.hass = h.ha.hass;
  el.owners = h.owners;
  el.phones = true;
  el.libraryItem = ref;
  // As `followLibraryItem` leaves it once it opened the item.
  el.openedItem = ref;
  el.watchId = h.watch;
  el.renderRoot = { activeElement: null, querySelector: () => null };
  el.renderInspector = () => "";
  el.leaveTile = () => undefined;
  el.endScrub = () => undefined;
  el.pollIfWaiting = () => undefined;
  Object.defineProperty(el, "updateComplete", { value: Promise.resolve(true) });
  const call = <T>(name: string, ...args: unknown[]): T => (el[name] as (...a: unknown[]) => T).apply(el, args);
  const key = libraryDraftKey(ref);
  return { el, call, key, ref };
}

async function statusEditor() {
  const h = home();
  const t = standUp("wa-status-pages-editor", h, "status_pages", LONE);
  forgetStatusPagesDraft(t.key);
  await t.call<Promise<void>>("load", t.key);
  await connectLibrary(t.el);
  const host = () => t.call<StatusPagesViewHost>("viewHost");
  return { ...h, ...t, host, draft: () => keptStatusPagesDraft(t.key)! };
}

async function pageEditor(id = SHED) {
  const h = home();
  const t = standUp("wa-page-editor", h, "pages", id);
  forgetWatchPagesDraft(t.key);
  await t.call<Promise<void>>("load", t.key);
  await connectLibrary(t.el);
  const draft = () => keptWatchPagesDraft(t.key)!;
  const page = () => (draft().document.pages as JsonObject[])[0]!;
  return { ...h, ...t, draft, page, body: () => flat(t.call("renderBody", h.owners)) };
}

async function menuEditor(id = SPARE) {
  const h = home();
  const t = standUp("wa-menu-editor", h, "menus", id);
  forgetWatchMenusDraft(t.key);
  await t.call<Promise<void>>("load", t.key);
  await connectLibrary(t.el);
  // The summary is in: the Menus card turns to the menu's own unit.
  t.call("followLibraryItem", t.ref);
  await settle();
  const host = () => t.call<MenusViewHost>("viewHost");
  return { ...h, ...t, host, draft: () => keptWatchMenusDraft(t.key)! };
}

describe("the status pages editor in library mode", () => {
  it("edits the one status page read with library/item, never the preview device's record", async () => {
    const e = await statusEditor();
    expect(e.ha.of("library/item")).toEqual([{ type: "wrist_assistant/library/item", kind: "status_pages", item_id: LONE }]);
    expect(e.ha.of("watch_config/get").filter((m) => m.kind === "status_pages")).toEqual([]);
    expect(statusPagesOf(e.draft().document).map((p) => p.id)).toEqual([LONE]);
    expect(e.draft().revision).toBe(1);
    // The device's own draft is untouched.
    expect(keptStatusPagesDraft(e.watch)).toBeUndefined();
  });

  it("draws Preview as, the ticks and Delete, and no Add, order, history or delivery", async () => {
    const e = await statusEditor();
    const bar = flat(e.call("renderTopBar", e.draft(), e.owners));
    expect(bar).toContain("Back to the Status pages tab");
    for (const gone of ["tb-sync", "Complications", "sp-watch-picker", "tb-saved", "Preview as"]) expect(bar).not.toContain(gone);
    // The devices stand in the strip under the canvas head, over the stage:
    // the question, a tick per device, then the count. Not in the bar, not
    // in the Page card.
    expect(bar).not.toContain("lib-on");
    const stage = flat(e.call("renderStage", e.host(), e.owners));
    expect(stage).toMatch(/cv-head[\s\S]*lib-on over-stage none[\s\S]*Which devices do you want this on\?[\s\S]*Jesse's Watch[\s\S]*Jesse's iPhone[\s\S]*On no device yet[\s\S]*class="stage-area/);
    expect(stage).not.toContain("On this watch.");
    expect(flat(renderStatusInspector(e.host()))).not.toContain("lib-on");
    // Preview on sits in the strip over the stage, beside the size and the
    // zoom: the watch and iPhone thumbnails, no device named.
    expect(stage).toMatch(/class="stage-tools"[\s\S]*Preview on[\s\S]*lib-preview-thumb watch on[\s\S]*lib-preview-thumb iphone /);
    expect(stage.slice(stage.indexOf("Preview on"), stage.indexOf("Preview on an iPhone"))).not.toContain("Jesse");
    const card = flat(renderPagesCard(e.host()));
    expect(e.host().single).toBe(true);
    for (const gone of ["sp-add-page", "Move up", "Move down"]) expect(card).not.toContain(gone);
    // The grip stays as an empty span: it holds the row's first grid column.
    expect(card).toContain(`<span class="grip" aria-hidden="true"></span>`);
    expect(card).toContain("Delete Lone");
    const body = flat(e.call("renderBody", e.owners));
    expect(body).not.toContain("cf-bar");
    expect(body).not.toContain("Not on this watch");
  });

  it("saves with library/item/save over the item's revision, and a conflict reads it again", async () => {
    const e = await statusEditor();
    e.draft().apply(renameStatusPage(e.draft().document, LONE, "Lone star"));
    await e.call<Promise<void>>("save");
    await settle();
    const first = e.ha.of("library/item/save");
    expect(first).toHaveLength(1);
    expect(first[0]).toMatchObject({ kind: "status_pages", item_id: LONE, base_revision: 1 });
    expect(statusPagesOf(first[0]!.document as StatusPagesDocument)[0]!.name).toBe("Lone star");
    expect(e.ha.of("watch_config/save")).toEqual([]);
    // Another save moved it on meanwhile: this one meets a conflict, reads the
    // item again and saves over its new revision.
    e.ha.bumpItem("status_pages", LONE);
    const draft = e.draft();
    draft.apply(renameStatusPage(draft.document, LONE, "Lone again"));
    const reads = e.ha.of("library/item").length;
    await e.call<Promise<void>>("save");
    await settle();
    expect(e.ha.of("library/item/save").slice(1).map((m) => m.base_revision)).toEqual([2, 3]);
    expect(e.ha.of("library/item").length).toBeGreaterThan(reads);
    expect(e.ha.summary().status_pages[LONE]!.revision).toBe(4);
  });

  it("asks Delete from the library alone, with no Remove from this watch", async () => {
    const e = await statusEditor();
    e.call("askDelete", LONE);
    const ask = flat(e.call("renderDeleteAsk", { pageId: LONE }));
    expect(ask).toContain("from the library?");
    expect(ask).toContain(libraryDeleteText(0));
    expect(ask).not.toContain("Remove from this");
  });
});

describe("the page editor in library mode", () => {
  it("edits the one page, drawn with Preview as and the ticks, and nothing of a device's own", async () => {
    const e = await pageEditor();
    expect(e.ha.of("library/item")).toEqual([{ type: "wrist_assistant/library/item", kind: "pages", item_id: SHED }]);
    expect((e.draft().document.pages as JsonObject[]).map((p) => p.id)).toEqual([SHED]);
    const bar = flat(e.call("renderTopBar", e.draft()));
    expect(bar).toContain("Back to the Pages tab");
    for (const gone of ["Add page", "tb-menus", "tb-sync", "pe-watch-picker", "Preview as"]) expect(bar).not.toContain(gone);
    // The devices stand in the strip under the canvas head, as on a device:
    // the question, a tick per device, then the count. Not in the bar, and
    // not in the inspector.
    expect(bar).not.toContain("lib-on");
    const ticks = flat(e.call("renderPageTicks", e.page()));
    expect(ticks).toMatch(/lib-on over-stage none[\s\S]*Which devices do you want this on\?[\s\S]*Jesse's Watch[\s\S]*Jesse's iPhone[\s\S]*On no device yet/);
    expect(ticks).not.toContain("On this watch.");
    expect(flat(e.call("renderPageCards", e.page(), undefined))).not.toContain("lib-on");
    const body = e.body();
    // Preview on sits in the strip over the stage, beside the size and the
    // zoom: the watch and iPhone thumbnails.
    const tools = flat(e.call("renderStageTools", e.page(), false, false));
    expect(tools).toMatch(/class="stage-tools"[\s\S]*Preview on[\s\S]*lib-preview-thumb watch on[\s\S]*lib-preview-thumb iphone [\s\S]*tint-dot[\s\S]*Zoom/);
    // The size label is gone from the strip: the head over the stage says it.
    expect(tools).not.toContain("46 mm");
    // The iPhone thumbnail draws the page on the home's iPhone; with the
    // watch thumbnail it is the watch again.
    e.call("pickPreview", "iphone");
    expect(e.el.watchId).toBe(e.phone);
    expect(e.el.device).toBe("iphone");
    e.call("pickPreview", "watch");
    expect(e.el.watchId).toBe(e.watch);
    for (const gone of ["Drag to move", "Add an empty page after the last one", "Hide Shed on the", "pe-linked", "cf-bar", "See all pages"]) {
      expect(body, gone).not.toContain(gone);
    }
    // Order and Hide here are a device's: neither moves the document.
    const before = e.draft().document;
    e.call("movePage", SHED, 0);
    e.call("setHidden", SHED, true);
    e.call("addPage");
    expect(e.draft().document).toBe(before);
  });

  it("saves with library/item/save, and asks Delete from the library alone", async () => {
    const e = await pageEditor();
    const draft = e.draft();
    draft.apply({ ...draft.document, pages: [{ ...e.page(), name: "Big shed" }] } as WatchPagesDocument);
    await e.call<Promise<unknown>>("save");
    await settle();
    const sent = e.ha.of("library/item/save");
    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({ kind: "pages", item_id: SHED, base_revision: 1 });
    expect(((sent[0]!.document as JsonObject).pages as JsonObject[])[0]!.name).toBe("Big shed");
    expect(e.ha.of("watch_config/save")).toEqual([]);
    e.call("askDelete", SHED);
    expect(e.el.deleteAsk).toBeUndefined();
    const ask = flat(e.call("renderLibraryDeleteAsk", SHED, e.draft().document));
    expect(ask).toContain(`Delete "Big shed" from the library?`);
    expect(ask).toContain(libraryDeleteText(0));
    // No device's menus, complications or rooms are read for it.
    expect(e.ha.of("watch_config/get").filter((m) => m.kind === "menus")).toEqual([]);
  });

  it("rewrites the record of every device that picks the page when it is saved in the library", async () => {
    const e = await pageEditor(HALL);
    const before = e.ha.held.get(`${e.watch}/pages`)!.revision;
    const draft = e.draft();
    draft.apply({ ...draft.document, pages: [{ ...e.page(), name: "Front hall" }] } as WatchPagesDocument);
    await e.call<Promise<unknown>>("save");
    await settle();
    const after = e.ha.held.get(`${e.watch}/pages`)!;
    expect(after.revision).toBe(before + 1);
    expect(((after.document as JsonObject).pages as JsonObject[])[0]!.name).toBe("Front hall");
    // The device's own kept draft was never this one.
    expect(keptWatchPagesDraft(e.watch)).toBeUndefined();
  });
});

describe("the menu editor in library mode", () => {
  it("shows only an Anywhere menu's rows: the menu and the page switcher", async () => {
    const e = await menuEditor(SPARE);
    expect(e.ha.of("library/item")).toEqual([{ type: "wrist_assistant/library/item", kind: "menus", item_id: SPARE }]);
    const card = flat(renderMenusCard(e.host()));
    expect(card.split(`class="layer me-menu-row`)).toHaveLength(3);
    expect(card).toContain("data-menu=anywhere");
    expect(card).toContain("data-menu=switcher");
    expect(card).not.toContain("data-menu=entity");
    expect(shownMenu(e.host())).toBe("anywhere");
    const head = flat(e.call("libraryHead", "anywhere"));
    expect(head).toMatch(/me-lib-input[\s\S]*Spare/);
    expect(head).toContain("Delete from the library");
    expect(head).not.toContain("Make a copy");
    // The row's foot keeps the name and Delete; the devices stand in the
    // strip under the canvas head, with a round tick per device.
    expect(head).not.toContain("lt-ticks");
    const bar = flat(e.call("renderTopBar", e.draft(), e.owners));
    expect(bar).toContain("Back to the Menus tab");
    for (const gone of ["tb-pages", "tb-sync", "me-watch-picker", "Preview as", "lt-hint", "lib-on"]) expect(bar).not.toContain(gone);
    const body = flat(e.call("renderBody", e.owners));
    expect(body).not.toContain("cf-bar");
    expect(body).toMatch(/cv-head[\s\S]*lib-on over-stage none[\s\S]*Which devices should use this menu\?[\s\S]*lt-chip off rd[\s\S]*Jesse's Watch[\s\S]*No device uses it yet[\s\S]*class="stage-area/);
    expect(body).not.toContain("lt-hint");
    // Preview on sits in the strip over the stage, beside the size and the zoom.
    expect(body).toMatch(/class="stage-tools"[\s\S]*Preview on[\s\S]*lib-preview-thumb watch on/);
  });

  it("shows only an Entity quick menu's row, and opens on it", async () => {
    const e = await menuEditor(SOLO);
    const card = flat(renderMenusCard(e.host()));
    expect(card.split(`class="layer me-menu-row`)).toHaveLength(2);
    expect(card).toContain("data-menu=entity");
    expect(shownMenu(e.host())).toBe("entity");
  });

  it("saves the menu with library/item/save over its revision, never a device's record", async () => {
    const e = await menuEditor(SPARE);
    const draft = e.draft();
    draft.apply(setWatchMenuStyle(draft.document, "quickAction", "beamIntensity", 0.9));
    await e.call<Promise<void>>("save");
    await settle();
    const sent = e.ha.of("library/item/save");
    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({ kind: "menus", item_id: SPARE, base_revision: 1 });
    expect(((sent[0]!.document as JsonObject).quickAction as JsonObject).beamIntensity).toBe(0.9);
    expect(e.ha.of("watch_config/save")).toEqual([]);
    expect(e.ha.menus[SPARE]!.sections?.quickAction).toMatchObject({ beamIntensity: 0.9 });
    // No page draft: the page switcher's pages are the preview device's, read only.
    expect(e.call("switcherSettingsHost", HALL)).toBeUndefined();
  });
});

describe("library mode's pieces", () => {
  it("keys a kept draft apart from every device's, and the leave guard still sees it", () => {
    dropAllWatchPages();
    const key = libraryDraftKey({ kind: "pages", id: SHED });
    expect(key).toBe(`library:pages:${SHED}`);
    expect(libraryDraftKey({ kind: "menus", id: SHED })).not.toBe(key);
    const doc = { schemaVersion: 1, pages: [{ id: SHED, name: "Shed", items: [] }] } as WatchPagesDocument;
    takeWatchPagesRecord(key, doc, 1);
    takeWatchPagesRecord("watch-1", { schemaVersion: 1, pages: [{ id: SHED, name: "Shed", isHidden: true, items: [] }] } as WatchPagesDocument, 4);
    expect(keptWatchPagesDraft(key)).not.toBe(keptWatchPagesDraft("watch-1"));
    expect(keptWatchPagesDraft(key)!.revision).toBe(1);
    expect(anyWatchPagesDirty()).toBe(false);
    keptWatchPagesDraft(key)!.apply({ ...doc, pages: [{ id: SHED, name: "Big shed", items: [] }] } as WatchPagesDocument);
    expect(anyWatchPagesDirty()).toBe(true);
    expect(keptWatchPagesDraft("watch-1")!.dirty).toBe(false);
    dropAllWatchPages();
    expect(keptWatchPagesDraft(key)).toBeUndefined();
  });

  it("previews on the home's first device of the kind picked, a watch unless the session remembers an iPhone", () => {
    const watch = owner({ owner_watch_id: "w" });
    const phone = owner({ owner_watch_id: "p", device_kind: "iphone", phone_pages: true });
    expect(previewOwner([phone, watch], "watch")).toBe("w");
    expect(previewOwner([phone, watch], "iphone")).toBe("p");
    // No device of the kind: none, and the editor draws on the reference device.
    expect(previewOwner([phone], "watch")).toBeUndefined();
    expect(previewOwner([watch], "iphone")).toBeUndefined();
    expect(previewOwner([], "watch")).toBeUndefined();
    const held = new Map<string, string>();
    const was = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");
    Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: { getItem: (k: string) => held.get(k) ?? null, setItem: (k: string, v: string) => held.set(k, v) } });
    try {
      expect(storedPreviewKind()).toBe("watch");
      rememberPreview("iphone");
      expect(held.get(LIBRARY_PREVIEW_KEY)).toBe("iphone");
      expect(storedPreviewKind()).toBe("iphone");
      held.set(LIBRARY_PREVIEW_KEY, "junk");
      expect(storedPreviewKind()).toBe("watch");
    } finally {
      if (was === undefined) delete (globalThis as { sessionStorage?: unknown }).sessionStorage;
      else Object.defineProperty(globalThis, "sessionStorage", was);
    }
    // Two thumbnails, the shown one pressed. No device is named.
    const picker = flat(renderPreviewPicker("iphone", () => undefined));
    expect(picker).toContain("Preview on");
    expect(picker).toMatch(/lib-preview-thumb watch "[\s\S]*aria-pressed=false[\s\S]*lib-preview-thumb iphone on[\s\S]*aria-pressed=true/);
    expect(picker).not.toContain("Jesse");
  });

  it("says in the bar how many devices have the item", () => {
    expect(onDevicesText("pages", 0)).toBe("On no device yet");
    expect(onDevicesText("status_pages", 1)).toBe("On 1 device");
    expect(onDevicesText("pages", 3)).toBe("On 3 devices");
    expect(onDevicesText("menus", 0)).toBe("No device uses it yet");
    expect(onDevicesText("menus", 2)).toBe("Used by 2 devices");
  });

  it("asks which devices the item goes on, over the ticks", () => {
    expect(onDevicesQuestion("pages")).toBe("Which devices do you want this on?");
    expect(onDevicesQuestion("status_pages")).toBe("Which devices do you want this on?");
    expect(onDevicesQuestion("menus")).toBe("Which devices should use this menu?");
  });

  it("reads an item as a record, and compares items ignoring case", () => {
    const record = libraryRecord("menus", { document: { schemaVersion: 1 }, revision: 3 });
    expect(record).toMatchObject({ kind: "menus", revision: 3, delivered_revision: 0, delivered_at: null });
    expect(sameLibraryItem({ kind: "pages", id: "ab" }, { kind: "pages", id: "AB" })).toBe(true);
    expect(sameLibraryItem({ kind: "pages", id: "ab" }, { kind: "status_pages", id: "ab" })).toBe(false);
    expect(sameLibraryItem(undefined, undefined)).toBe(true);
  });

  it("never breaks a sentence with a dash", () => {
    for (const text of [libraryDeleteText(0), libraryDeleteText(1), libraryDeleteText(3), onDevicesQuestion("pages"), onDevicesQuestion("menus"), onDevicesText("pages", 0), onDevicesText("menus", 2)]) {
      expect(text).not.toMatch(/[–—]| - /);
    }
  });
});

describe("the library's addresses", () => {
  const route = (path: string) => ({ prefix: "/wrist-assistant", path });

  it("name one item by kind and id, and read back", () => {
    expect(libraryItemPath("pages", "A B")).toBe("/library/pages/A%20B");
    expect(libraryItemPath("status_pages", SHED)).toBe(`/library/status-pages/${SHED}`);
    expect(libraryItemPath("menus", SPARE)).toBe(`/library/menus/${SPARE}`);
    expect(libraryRouteOf(route("/library/pages/A%20B"))).toEqual({ kind: "pages", id: "A B" });
    expect(libraryRouteOf(route(`/library/status-pages/${SHED}`))).toEqual({ kind: "status_pages", id: SHED });
    expect(libraryRouteOf(route(`/library/menus/${SPARE}/`))).toEqual({ kind: "menus", id: SPARE });
    for (const other of ["/library", "/library/pages", "/library/rooms/x", "/library/pages/x/y", "/pages/x", ALL_MENUS_PATH]) {
      expect(libraryRouteOf(route(other)), other).toBeUndefined();
    }
  });

  it("mark their kind's tab, count as their kind's editor for the leave question, and keep ⌘S", () => {
    expect(tabOfRoute(route(`/library/pages/${SHED}`))).toBe("pages");
    expect(barTabOf(route(`/library/status-pages/${SHED}`))).toBe("status-pages");
    expect(barTabOf(route(`/library/menus/${SPARE}`))).toBe("menus");
    expect(screenIdOf(route(`/library/pages/${SHED}`))).toBe("pages");
    expect(screenIdOf(route(`/library/status-pages/${SHED}`))).toBe("status-pages");
    expect(screenIdOf(route(`/library/menus/${SPARE}`))).toBe("menus");
    // Leaving for the tab is a move to another screen: the guard asks.
    expect(screenIdOf(route("/all-pages"))).toBe("all-pages");
    expect(swallowsSaveKey(route(`/library/pages/${SHED}`), false)).toBe(false);
    expect(swallowsSaveKey(route("/all-pages"), false)).toBe(true);
  });

  it("are no part of the panel's own address", () => {
    expect(panelPrefix(undefined, `/wrist-assistant/library/pages/${SHED}`)).toBe("/wrist-assistant");
    expect(panelPrefix(undefined, `/wrist-assistant/library/menus/${SPARE}`)).toBe("/wrist-assistant");
  });
});

describe("the tab stand-in's library item commands", () => {
  it("read an item, save it over its revision, and refuse as Home Assistant does", async () => {
    const h = fakeHome();
    const read = await fetchLibraryItem(h.hass, "pages", LONELY);
    expect(read.revision).toBe(1);
    expect((read.document.pages as JsonObject[]).map((p) => p.id)).toEqual([LONELY]);
    const page = { ...(read.document.pages as JsonObject[])[0]!, name: "Lonely" };
    expect(await saveLibraryItem(h.hass, "pages", LONELY, 1, { schemaVersion: 1, pages: [page] })).toEqual({ revision: 2 });
    expect(h.lib.pages[LONELY]!.item.name).toBe("Lonely");
    await expect(saveLibraryItem(h.hass, "pages", LONELY, 1, { schemaVersion: 1, pages: [page] })).rejects.toMatchObject({ code: "conflict", message: expect.stringContaining("stored revision is 2") });
    await expect(saveLibraryItem(h.hass, "pages", LONELY, 2, { schemaVersion: 1, pages: [{ id: SHED }] })).rejects.toMatchObject({ code: "invalid" });
    await expect(fetchLibraryItem(h.hass, "pages", SHED)).rejects.toMatchObject({ code: "not_found" });
    // Unchanged content is no write: the same revision back.
    expect(await saveLibraryItem(h.hass, "pages", LONELY, 2, { schemaVersion: 1, pages: [page] })).toEqual({ revision: 2 });
  });
});
