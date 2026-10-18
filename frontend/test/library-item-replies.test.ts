// The server's own `library/item` replies through the three editors' library
// mode. `fixtures-library/item-replies.json` is what Home Assistant answered
// for the app's own pages, status pages and menus documents
// (tests/test_library_store.py checks the server still answers exactly that).
// Here each reply is handed, untouched, to the editor of its kind: it must be
// read whole, drawn, and saved back as a document the server takes, the same
// rules `library/item/save` applies: a page document holding exactly this one
// page, a menus document holding all three sections as objects with slot ids
// that are set and never repeat.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type { OwnerSummary } from "../src/ha-api.js";
import { libraryDraftKey } from "../src/library/item-mode.js";
import { forgetWatchMenusDraft, keptWatchMenusDraft } from "../src/watch-menus/draft.js";
import "../src/watch-menus/menu-editor.js";
import { type MenusViewHost, renderMenusCard, shownMenu } from "../src/watch-menus/menu-view.js";
import { type MenusDocument, setWatchMenuStyle } from "../src/watch-menus/model.js";
import { forgetWatchPagesDraft, keptWatchPagesDraft } from "../src/watch-pages/kept.js";
import type { JsonObject, WatchPagesDocument } from "../src/watch-pages/model.js";
import "../src/watch-pages/page-editor.js";
import { forgetStatusPagesDraft, keptStatusPagesDraft } from "../src/watch-status-pages/draft.js";
import { renameStatusPage, statusPagesOf } from "../src/watch-status-pages/model.js";
import "../src/watch-status-pages/status-pages-editor.js";
import { type StatusPagesViewHost, renderPagesCard } from "../src/watch-status-pages/view.js";
import { connectLibrary, flat, libraryHome, settle } from "./library-editor-home.js";

interface Reply {
  document: JsonObject;
  revision: number;
  name?: string;
}

const REPLIES = JSON.parse(readFileSync(join(__dirname, "fixtures-library", "item-replies.json"), "utf8")) as Record<
  "pages" | "status_pages" | "menus_anywhere" | "menus_entity",
  Reply
>;
const MENUS = JSON.parse(readFileSync(join(__dirname, "fixtures-menus", "01-defaults.json"), "utf8")) as MenusDocument;

const SECTION_KEYS = ["quickAction", "entityRadial", "pageSwitcher"] as const;

const isObject = (v: unknown): v is JsonObject => v !== null && typeof v === "object" && !Array.isArray(v);

/** `library/item/save`'s page rule: the list holds this one page and no other. */
function takenAsPage(document: JsonObject, key: "pages" | "statusPages", id: string): JsonObject {
  const list = document[key];
  expect(Array.isArray(list), `${key} is a list`).toBe(true);
  expect((list as unknown[]).length).toBe(1);
  const page = (list as JsonObject[])[0]!;
  expect(page.id).toBe(id);
  return page;
}

/** `library/item/save`'s menus rule (`_check_menus` on the server). */
function takenAsMenus(document: JsonObject): void {
  for (const key of SECTION_KEYS) expect(isObject(document[key]), key).toBe(true);
  const lists: unknown[] = [(document.quickAction as JsonObject).slots];
  for (const [key, value] of Object.entries(document.entityRadial as JsonObject)) if (key.endsWith("Slots")) lists.push(value);
  for (const slots of lists) {
    if (slots === undefined) continue;
    expect(Array.isArray(slots)).toBe(true);
    const ids = (slots as JsonObject[]).map((s) => String(s.id ?? "").toUpperCase());
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  }
}

const WATCH = "fixture-watch";
const owners = [{
  owner_watch_id: WATCH, device_name: "Jesse's Watch", device_kind: "watch", paired_iphone_name: null, app_version: "3.0.0",
  screen_size: null, complication_count: 0, token: 3, applied_token: 3, is_orphan: false, main_house: true,
} as unknown as OwnerSummary];

/** A home whose `library/item` answers the server's reply for `id` as it
 * came, and keeps every save sent. The preview watch has its own records. */
function home(kind: "pages" | "status_pages" | "menus", id: string, reply: Reply, unit?: "anywhere" | "entity") {
  const ha = libraryHome({
    [`${WATCH}/pages`]: { schemaVersion: 1, pages: [{ id: "PREVIEW-PAGE", name: "Preview", items: [] }] },
    [`${WATCH}/status_pages`]: { schemaVersion: 1, statusPages: [] },
    [`${WATCH}/menus`]: structuredClone(MENUS),
  }, {
    ...(kind === "pages" ? { unpicked: { [id]: (reply.document.pages as JsonObject[])[0]! } } : {}),
    ...(kind === "status_pages" ? { unpickedStatus: { [id]: (reply.document.statusPages as JsonObject[])[0]! } } : {}),
    ...(kind === "menus" ? { menus: { [id]: { name: reply.name!, kind: unit!, owners: [], sections: {} } } } : {}),
  });
  const saved: JsonObject[] = [];
  const send = ha.hass.connection.sendMessagePromise.bind(ha.hass.connection);
  (ha.hass.connection as { sendMessagePromise: unknown }).sendMessagePromise = (msg: JsonObject) => {
    const type = msg.type as string;
    if (type === "wrist_assistant/library/item") return Promise.resolve(structuredClone(reply));
    if (type === "wrist_assistant/library/item/save") {
      saved.push(msg);
      return Promise.resolve({ revision: reply.revision + 1 });
    }
    return send(msg);
  };
  return { ha, saved };
}

async function standUp(tag: string, kind: "pages" | "status_pages" | "menus", id: string, reply: Reply, unit?: "anywhere" | "entity") {
  const h = home(kind, id, reply, unit);
  const Ctor = customElements.get(tag) as unknown as new () => Record<string, unknown>;
  const el = new Ctor();
  const ref = { kind, id };
  el.hass = h.ha.hass;
  el.owners = owners;
  el.phones = true;
  el.libraryItem = ref;
  el.openedItem = ref;
  el.watchId = WATCH;
  el.renderRoot = { activeElement: null, querySelector: () => null };
  el.renderInspector = () => "";
  el.leaveTile = () => undefined;
  el.endScrub = () => undefined;
  el.pollIfWaiting = () => undefined;
  Object.defineProperty(el, "updateComplete", { value: Promise.resolve(true) });
  const call = <T>(name: string, ...args: unknown[]): T => (el[name] as (...a: unknown[]) => T).apply(el, args);
  const key = libraryDraftKey(ref);
  forgetWatchPagesDraft(key);
  forgetStatusPagesDraft(key);
  forgetWatchMenusDraft(key);
  await call<Promise<void>>("load", key);
  await connectLibrary(el);
  if (kind === "menus") {
    call("followLibraryItem", ref);
    await settle();
  }
  return { ...h, el, call, key };
}

describe("the server's library/item replies in the editors", () => {
  it("a page reply is read whole, drawn, and saved back as this one page", async () => {
    const reply = REPLIES.pages;
    const id = (reply.document.pages as JsonObject[])[0]!.id as string;
    const e = await standUp("wa-page-editor", "pages", id, reply);
    const draft = keptWatchPagesDraft(e.key)!;
    expect(draft.revision).toBe(reply.revision);
    expect(draft.document).toEqual(reply.document);
    const page = (reply.document.pages as JsonObject[])[0]!;
    // The ticks stand in the strip under the canvas head, in library mode too.
    expect(flat(e.call("renderPageTicks", page))).toContain("Jesse's Watch");
    draft.apply({ ...draft.document, pages: [{ ...page, name: "Renamed" }] } as WatchPagesDocument);
    await e.call<Promise<unknown>>("save");
    await settle();
    expect(e.saved).toHaveLength(1);
    expect(e.saved[0]).toMatchObject({ kind: "pages", item_id: id, base_revision: reply.revision });
    const sent = takenAsPage(e.saved[0]!.document as JsonObject, "pages", id);
    expect(sent).toEqual({ ...page, name: "Renamed" });
  });

  it("a status page reply is read whole, drawn, and saved back as this one page", async () => {
    const reply = REPLIES.status_pages;
    const page = (reply.document.statusPages as JsonObject[])[0]!;
    const id = page.id as string;
    const e = await standUp("wa-status-pages-editor", "status_pages", id, reply);
    const draft = keptStatusPagesDraft(e.key)!;
    expect(draft.revision).toBe(reply.revision);
    expect(draft.document).toEqual(reply.document);
    expect(statusPagesOf(draft.document).map((p) => p.id)).toEqual([id]);
    expect(flat(renderPagesCard(e.call<StatusPagesViewHost>("viewHost")))).toContain(`Delete ${page.name as string}`);
    draft.apply(renameStatusPage(draft.document, id, "Renamed"));
    await e.call<Promise<void>>("save");
    await settle();
    expect(e.saved).toHaveLength(1);
    expect(e.saved[0]).toMatchObject({ kind: "status_pages", item_id: id, base_revision: reply.revision });
    expect(takenAsPage(e.saved[0]!.document as JsonObject, "statusPages", id).name).toBe("Renamed");
  });

  it("an Anywhere menu reply opens on its own rows and saves back a menus document the server takes", async () => {
    const reply = REPLIES.menus_anywhere;
    expect(reply.document.entityRadial).toEqual({});
    const e = await standUp("wa-menu-editor", "menus", "FIXTURE-ANYWHERE", reply, "anywhere");
    const draft = keptWatchMenusDraft(e.key)!;
    expect(draft.revision).toBe(reply.revision);
    expect(draft.document).toEqual(reply.document);
    const host = e.call<MenusViewHost>("viewHost");
    expect(shownMenu(host)).toBe("anywhere");
    const card = flat(renderMenusCard(host));
    expect(card).toContain("data-menu=anywhere");
    expect(card).not.toContain("data-menu=entity");
    expect(flat(e.call("libraryHead", "anywhere"))).toContain(reply.name!);
    draft.apply(setWatchMenuStyle(draft.document, "quickAction", "beamIntensity", 0.9));
    await e.call<Promise<void>>("save");
    await settle();
    expect(e.saved).toHaveLength(1);
    expect(e.saved[0]).toMatchObject({ kind: "menus", item_id: "FIXTURE-ANYWHERE", base_revision: reply.revision });
    const sent = e.saved[0]!.document as JsonObject;
    takenAsMenus(sent);
    expect((sent.quickAction as JsonObject).beamIntensity).toBe(0.9);
    expect(sent.pageSwitcher).toEqual(reply.document.pageSwitcher);
  });

  it("an Entity quick menu reply opens on its row and saves back a menus document the server takes", async () => {
    const reply = REPLIES.menus_entity;
    expect(reply.document.quickAction).toEqual({});
    expect(reply.document.pageSwitcher).toEqual({});
    const e = await standUp("wa-menu-editor", "menus", "FIXTURE-ENTITY", reply, "entity");
    const draft = keptWatchMenusDraft(e.key)!;
    expect(draft.document).toEqual(reply.document);
    const host = e.call<MenusViewHost>("viewHost");
    expect(shownMenu(host)).toBe("entity");
    const card = flat(renderMenusCard(host));
    expect(card).toContain("data-menu=entity");
    expect(card).not.toContain("data-menu=anywhere");
    const doc = draft.document;
    draft.apply({ ...doc, entityRadial: { ...(doc.entityRadial as JsonObject), fixtureMark: 1 } } as MenusDocument);
    await e.call<Promise<void>>("save");
    await settle();
    expect(e.saved).toHaveLength(1);
    const sent = e.saved[0]!.document as JsonObject;
    takenAsMenus(sent);
    expect((sent.entityRadial as JsonObject).fixtureMark).toBe(1);
  });
});
