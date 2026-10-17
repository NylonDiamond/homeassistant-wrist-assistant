// The menu editor's library parts, against a stand-in Home Assistant that
// works the library as the server does (`library-editor-home.ts`): the menu's
// name at the top of its settings, renamed once typing stops; Used by with a
// round tick per device; "Make a copy for this watch"; the menu's name on its
// row; the restore question naming the devices that use the menus it
// changes; and every save passing an old record's `linkIds` through
// untouched, as any key the editor does not know (Home Assistant ignores it).

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type { OwnerSummary } from "../src/ha-api.js";
import { forgetWatchMenusDraft, keptWatchMenusDraft, takeWatchMenusRecord } from "../src/watch-menus/draft.js";
import { MENU_RENAME_MS, menuUnitOf } from "../src/watch-menus/menu-editor.js";
import { type MenusViewHost, renderMenuInspector, renderMenusCard } from "../src/watch-menus/menu-view.js";
import { type MenusDocument, setWatchMenuStyle } from "../src/watch-menus/model.js";
import type { JsonObject } from "../src/watch-pages/model.js";
import { connectLibrary, flat, libraryHome, settle } from "./library-editor-home.js";

const DEFAULTS = JSON.parse(readFileSync(join(__dirname, "fixtures-menus", "01-defaults.json"), "utf8")) as MenusDocument;

const HOME = "CCCC1000-0000-4000-8000-000000000001";
const CHEN_MENU = "CCCC1000-0000-4000-8000-000000000002";
const QUICK = "CCCC1000-0000-4000-8000-000000000003";

/** The defaults with the link marks a record saved before the library may
 * still carry. */
const marked = (links: Record<string, string>): MenusDocument => ({ ...structuredClone(DEFAULTS), linkIds: links });

let made = 0;

/**
 * The menu editor on Jesse's Watch, which uses "Home menu" (with Jesse's
 * iPhone) and the Entity quick menu (with every device); Chen's Watch uses
 * its own Anywhere menu.
 */
async function editor(options: { library?: boolean; history?: Record<string, JsonObject> } = {}) {
  const n = ++made;
  const watch = `lm-w1-${n}`;
  const phone = `lm-p1-${n}`;
  const chen = `lm-w2-${n}`;
  const owners = [
    { owner_watch_id: watch, device_name: "Jesse's Watch", device_kind: "watch", paired_iphone_name: null },
    { owner_watch_id: chen, device_name: "Chen's Watch", device_kind: "watch", paired_iphone_name: null },
    { owner_watch_id: phone, device_name: "Jesse's iPhone", device_kind: "iphone", phone_pages: true },
  ] as unknown as OwnerSummary[];
  const ha = libraryHome({
    [`${watch}/menus`]: marked({ anywhere: HOME, entity: QUICK }),
    [`${phone}/menus`]: marked({ anywhere: HOME, entity: QUICK }),
    [`${chen}/menus`]: marked({ entity: QUICK }),
  }, {
    menus: {
      [HOME]: { name: "Home menu", kind: "anywhere", owners: [watch, phone] },
      [CHEN_MENU]: { name: "Chen's menu", kind: "anywhere", owners: [chen] },
      [QUICK]: { name: "Entity quick menu", kind: "entity", owners: [watch, phone, chen] },
    },
    ...(options.library === false ? { noLibrary: true } : {}),
    ...(options.history === undefined ? {} : { history: options.history }),
  });
  const Ctor = customElements.get("wa-menu-editor") as unknown as new () => Record<string, unknown>;
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
  forgetWatchMenusDraft(watch);
  const call = <T>(name: string, ...args: unknown[]): T => (el[name] as (...a: unknown[]) => T).apply(el, args);
  await call<Promise<void>>("load", watch);
  await connectLibrary(el);
  const host = () => call<MenusViewHost>("viewHost");
  const head = () => flat(call("libraryHead", "anywhere"));
  return { el, ha, watch, phone, chen, call, host, head };
}

describe("the menu editor's library menu", () => {
  it("puts the menu's name, Used by and the copy at the foot of its row in the Menus card, and nothing of it in the inspector", async () => {
    const { host } = await editor();
    const menus = flat(renderMenusCard(host()));
    const rows = menus.split(`class="layer me-menu-row`);
    expect(rows).toHaveLength(4);
    expect(rows[1]).toContain(`class="me-lib" role="group" aria-label=Anywhere menu`);
    expect(rows[1]).toMatch(/me-lib-input[\s\S]*Home menu/);
    // The ticks stand in the framed block that asks which devices use it.
    expect(rows[1]).toMatch(/lib-on card[\s\S]*Which devices should use this menu\?[\s\S]*lt-chip/);
    expect(rows[1]).not.toContain("lt-hint");
    expect(rows[2]).toContain(`aria-label=Entity quick menu`);
    // The page switcher has no menu of its own.
    expect(rows[3]).not.toContain("me-lib");
    const inspector = flat(renderMenuInspector(host()));
    expect(inspector).not.toContain("me-lib");
    expect(inspector).not.toContain("me-devices");
    expect(inspector).not.toContain("<span>Devices</span>");
    expect(inspector).toContain("me-menu-note");
  });

  it("draws a round tick per device, those that use it ticked and fixed", async () => {
    const { head } = await editor();
    const text = head();
    expect(text.match(/lt-chip on +rd/g)).toHaveLength(2);
    expect(text.match(/lt-chip off +rd/g)).toHaveLength(1);
    expect(text).toMatch(/lt-chip off +rd[^>]*title=Use this menu on Chen's Watch\.[^>]*aria-disabled=false/);
    expect(text).toMatch(/title=Jesse's iPhone uses this menu\. To change that, pick another Anywhere menu for it\.\s+aria-pressed=true aria-disabled=true/);
  });

  it("names the page switcher's menu as the Anywhere menu's, and the Entity quick menu its own", async () => {
    const { call } = await editor();
    expect(menuUnitOf("switcher")).toBe("anywhere");
    expect(flat(call("libraryHead", "switcher"))).toMatch(/me-lib-input[\s\S]*Home menu/);
    const entity = flat(call("libraryHead", "entity"));
    expect(entity).toMatch(/me-lib-input[\s\S]*Entity quick menu/);
    expect(entity.match(/lt-chip on +rd/g)).toHaveLength(3);
  });

  it("moves another device to this menu with library/pick", async () => {
    const { el, ha, chen } = await editor();
    const store = (el.lib as { store: { pickMenu(o: string, u: string, m: string): Promise<unknown> } }).store;
    await store.pickMenu(chen, "anywhere", HOME);
    expect(ha.of("library/pick").map((m) => [m.owner_id, m.kind, m.unit, m.item_id])).toEqual([[chen, "menus", "anywhere", HOME]]);
    expect(ha.summary().menus[HOME]!.owners).toContain(chen);
  });

  it("will not move a device whose menus editor holds unsaved edits", async () => {
    const { call, chen, watch } = await editor();
    takeWatchMenusRecord(chen, marked({ entity: QUICK }), 4);
    keptWatchMenusDraft(chen)!.apply(setWatchMenuStyle(marked({ entity: QUICK }), "quickAction", "beamIntensity", 0.9));
    expect(call("menuTickLocked", chen)).toBe("Save or discard the edits on Chen's Watch first.");
    expect(call("menuTickLocked", watch)).toBeUndefined();
    forgetWatchMenusDraft(chen);
  });

  it("badges the Menus card's row with the menu's own name", async () => {
    const { host } = await editor();
    const card = flat(renderMenusCard(host()));
    const anywhere = card.slice(card.indexOf("data-menu=anywhere"), card.indexOf("data-menu=entity"));
    expect(anywhere).toMatch(/badge me-named[^>]*>Home menu</);
    expect(anywhere).not.toContain("Also on");
    // The Entity quick menu goes by its unit's name: no badge.
    const entity = card.slice(card.indexOf("data-menu=entity"), card.indexOf("data-menu=switcher"));
    expect(entity).not.toContain("me-named");
  });

  it("renames the menu once typing stops, trimmed, and keeps the typed name shown until it lands", async () => {
    const { call, ha, el, head } = await editor();
    call("typeMenuName", HOME, "  Our menu ");
    expect(ha.of("library/menus/rename")).toEqual([]);
    expect(head()).toContain("  Our menu ");
    await new Promise((r) => setTimeout(r, MENU_RENAME_MS + 30));
    await settle();
    expect(ha.of("library/menus/rename").map((m) => [m.item_id, m.name])).toEqual([[HOME, "Our menu"]]);
    expect(el.naming).toBeUndefined();
    expect(head()).toMatch(/me-lib-input[\s\S]*Our menu/);
  });

  it("sends no empty name, and none that did not change", async () => {
    const { call, ha, el } = await editor();
    call("typeMenuName", HOME, "   ");
    call("flushRename");
    call("typeMenuName", HOME, "Home menu");
    call("flushRename");
    await settle();
    expect(ha.of("library/menus/rename")).toEqual([]);
    expect(el.naming).toBeUndefined();
  });

  it("makes a copy for this watch, named after it, and shows the copy", async () => {
    const { call, ha, el, watch, head } = await editor();
    expect(head()).toContain("Make a copy for this watch");
    expect(head()).toContain("An edit here changes it on Jesse's iPhone too.");
    await call<Promise<void>>("makeCopy", { id: HOME, name: "Home menu", unit: "anywhere", sections: {}, owners: [] });
    expect(ha.of("library/menus/copy").map((m) => [m.owner_id, m.unit, m.name])).toEqual([[watch, "anywhere", "Jesse's Watch's menu"]]);
    expect((el.libNote as { text: string }).text).toBe(`This watch uses its own copy now, "Jesse's Watch's menu". Edits here change only this watch.`);
    const after = head();
    expect(after).toMatch(/me-lib-input[\s\S]*Jesse's Watch's menu/);
    expect(after).not.toContain("Make a copy for this watch");
  });

  it("will not copy over unsaved edits", async () => {
    const { el, call, ha, head } = await editor();
    const draft = el.draft as { apply(d: MenusDocument): boolean; document: MenusDocument };
    draft.apply(setWatchMenuStyle(draft.document, "quickAction", "beamIntensity", 0.9));
    expect(head()).toMatch(/me-copy[^>]*disabled=true[^>]*title=Save or discard your edits first\. The copy is made from the menu as saved on this watch\./);
    await call<Promise<void>>("makeCopy", { id: HOME, name: "Home menu", unit: "anywhere", sections: {}, owners: [] });
    expect(ha.of("library/menus/copy")).toEqual([]);
  });

  it("saves the menus with an old record's linkIds untouched, never reading or dropping it", async () => {
    const { el, call, ha, watch } = await editor();
    const draft = el.draft as { apply(d: MenusDocument): boolean; document: MenusDocument };
    draft.apply(setWatchMenuStyle(draft.document, "quickAction", "beamIntensity", 0.9));
    await call<Promise<unknown>>("saveMenus", el.hass, watch, draft);
    const saved = ha.of("watch_config/save").find((m) => m.owner_watch_id === watch)!.document as MenusDocument;
    expect(saved.linkIds).toEqual({ anywhere: HOME, entity: QUICK });
  });

  it("names in the restore question the devices that use a menu it changes", async () => {
    const n = made + 1;
    const restored = setWatchMenuStyle(marked({ anywhere: HOME, entity: QUICK }), "quickAction", "beamIntensity", 0.2);
    const { el, call } = await editor({ history: { [`lm-w1-${n}/menus/2`]: restored as JsonObject } });
    call("askRestore", { revision: 2, updated_at: null, updated_by: "panel", size: 10 });
    await settle();
    expect((el.restoreAsk as { links: string[] }).links).toEqual([`It also changes the Anywhere menu "Home menu" on Jesse's iPhone, which uses it too.`]);
    expect(flat(call("renderRestoreAsk", el.restoreAsk))).toContain(`It also changes the Anywhere menu "Home menu" on Jesse's iPhone, which uses it too.`);
  });

  it("is all off on an integration with no library", async () => {
    const { host, head } = await editor({ library: false });
    expect(head()).toBe("");
    expect(flat(renderMenusCard(host()))).not.toContain("me-named");
  });
});
