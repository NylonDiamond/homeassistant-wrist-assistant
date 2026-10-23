// The menu editor's library parts, against a stand-in Home Assistant that
// works the library as the server does (`library-editor-home.ts`), with a
// library menu open (`library/item-mode.ts`): the menu's name at the foot of
// its row, renamed once typing stops; a round tick per device in the strip
// under the canvas head; and the menu's name on its row.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type { OwnerSummary } from "../src/ha-api.js";
import { libraryDraftKey } from "../src/library/item-mode.js";
import { forgetWatchMenusDraft, keptWatchMenusDraft, takeWatchMenusRecord } from "../src/watch-menus/draft.js";
import { MENU_RENAME_MS, menuUnitOf } from "../src/watch-menus/menu-editor.js";
import { type MenusViewHost, renderMenuInspector, renderMenusCard } from "../src/watch-menus/menu-view.js";
import { type MenusDocument, setWatchMenuStyle } from "../src/watch-menus/model.js";
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
 * The menu editor on one library menu (Home menu unless named), opened from
 * Jesse's Watch. Jesse's Watch and Jesse's iPhone use "Home menu" and the
 * Entity quick menu; Chen's Watch uses its own Anywhere menu and the Entity
 * quick menu.
 */
async function editor(id = HOME) {
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
  });
  const ref = { kind: "menus" as const, id, from: watch };
  const Ctor = customElements.get("wa-menu-editor") as unknown as new () => Record<string, unknown>;
  const el = new Ctor();
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
  const key = libraryDraftKey(ref);
  forgetWatchMenusDraft(key);
  const call = <T>(name: string, ...args: unknown[]): T => (el[name] as (...a: unknown[]) => T).apply(el, args);
  await call<Promise<void>>("load", key);
  await connectLibrary(el);
  // The summary is in: the Menus card turns to the menu's own unit.
  call("followLibraryItem", ref);
  await settle();
  const host = () => call<MenusViewHost>("viewHost");
  const head = () => flat(call("libraryHead", "anywhere"));
  return { el, ha, watch, phone, chen, call, host, head };
}

describe("the menu editor's library menu", () => {
  it("puts the menu's name at the foot of its row in the Menus card, and nothing of it in the inspector", async () => {
    const { host } = await editor();
    const menus = flat(renderMenusCard(host()));
    const rows = menus.split(`class="layer me-menu-row`);
    expect(rows).toHaveLength(3);
    expect(rows[1]).toContain(`class="me-lib" role="group" aria-label=Anywhere menu`);
    expect(rows[1]).toMatch(/me-lib-input[\s\S]*Home menu/);
    // The ticks are not in the row: they stand in the framed strip under
    // the canvas head that asks which devices use it.
    expect(rows[1]).not.toContain("lib-on");
    expect(rows[1]).not.toContain("lt-chip");
    // The page switcher has no menu of its own.
    expect(rows[2]).not.toContain("me-lib");
    const inspector = flat(renderMenuInspector(host()));
    expect(inspector).not.toContain("me-lib");
    expect(inspector).not.toContain("me-devices");
    expect(inspector).not.toContain("<span>Devices</span>");
  });

  it("draws a round tick per device under the canvas head, those that use it ticked and fixed", async () => {
    const { call, el, host } = await editor();
    const text = flat(call("renderStageDevices"));
    expect(text).toContain("lib-on over-stage");
    expect(text).not.toContain("lt-hint");
    expect(flat(call("renderStage", host(), el.owners))).toMatch(/cv-head[\s\S]*lib-on over-stage[\s\S]*lt-chip[\s\S]*class="stage-area/);
    // The inline chips; the fold's popover after them holds the same again.
    const inline = text.split("<details")[0]!;
    expect(inline.match(/lt-chip on +rd/g)).toHaveLength(2);
    expect(inline.match(/lt-chip off +rd/g)).toHaveLength(1);
    expect(text).toMatch(/lt-chip off +rd[^>]*title=Use this menu on Chen's Watch\.[^>]*aria-disabled=false/);
    expect(text).toMatch(/title=Jesse's iPhone uses this menu\. To change that, pick another Anywhere menu for it\.\s+aria-pressed=true aria-disabled=true/);
  });

  it("names the page switcher's menu as the Anywhere menu's, and the Entity quick menu its own", async () => {
    const { call } = await editor();
    expect(menuUnitOf("switcher")).toBe("anywhere");
    expect(flat(call("libraryHead", "switcher"))).toMatch(/me-lib-input[\s\S]*Home menu/);
    expect(flat(call("libraryHead", "entity"))).toBe("");
    const quick = await editor(QUICK);
    expect(flat(quick.call("libraryHead", "entity"))).toMatch(/me-lib-input[\s\S]*Entity quick menu/);
    expect(flat(quick.call("renderStageDevices")).match(/lt-chip on +rd/g)).toHaveLength(3);
  });

  it("moves another device to this menu with library/pick", async () => {
    const { el, ha, chen } = await editor();
    const store = (el.lib as { store: { pickMenu(o: string, u: string, m: string): Promise<unknown> } }).store;
    await store.pickMenu(chen, "anywhere", HOME);
    expect(ha.of("library/pick").map((m) => [m.owner_id, m.kind, m.unit, m.item_id])).toEqual([[chen, "menus", "anywhere", HOME]]);
    expect(ha.summary().menus[HOME]!.owners).toContain(chen);
  });

  it("will not move a device whose kept menus draft holds unsaved edits", async () => {
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
    const anywhere = card.slice(card.indexOf("data-menu=anywhere"), card.indexOf("data-menu=switcher"));
    expect(anywhere).toMatch(/badge me-named[^>]*>Home menu</);
    expect(anywhere).not.toContain("Also on");
    // The Entity quick menu goes by its unit's name: no badge.
    const quick = await editor(QUICK);
    expect(flat(renderMenusCard(quick.host()))).not.toContain("me-named");
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
});
