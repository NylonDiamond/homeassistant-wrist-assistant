// The library commands send the server's keys exactly: an item is
// `item_id`, never `id` (Home Assistant's message number), and nothing the
// schema does not list.

import { describe, expect, it } from "vitest";

import type { HassLike } from "../src/ha-api.js";
import {
  LIBRARY_UNSUPPORTED_TEXT,
  MENU_UNIT_SECTIONS,
  copyLibraryMenu,
  createLibraryMenu,
  deleteLibraryItem,
  deleteLibraryMenu,
  fetchLibrarySummary,
  libraryErrorCode,
  libraryErrorText,
  pickLibraryItem,
  pickLibraryMenu,
  renameLibraryMenu,
} from "../src/library/client.js";

function stand() {
  const sent: Record<string, unknown>[] = [];
  const hass = {
    states: {},
    connection: {
      sendMessagePromise: (msg: Record<string, unknown>) => {
        sent.push(msg);
        return Promise.resolve({ ok: true });
      },
      subscribeMessage: () => Promise.resolve(() => Promise.resolve()),
    },
  } as unknown as HassLike;
  return { hass, sent };
}

describe("library commands", () => {
  it("send the exact request shapes", async () => {
    const { hass, sent } = stand();
    await fetchLibrarySummary(hass);
    await pickLibraryItem(hass, "w1", "pages", "P1", true);
    await pickLibraryItem(hass, "w1", "status_pages", "S1", false);
    await pickLibraryMenu(hass, "w1", "entity", "M1");
    await copyLibraryMenu(hass, "w1", "anywhere", "Chen's menu");
    await createLibraryMenu(hass, "entity", "Kitchen menu", { entityRadial: { slots: [] } });
    await renameLibraryMenu(hass, "M1", "Home menu");
    await deleteLibraryMenu(hass, "M1");
    await deleteLibraryItem(hass, "status_pages", "S1");
    expect(sent).toEqual([
      { type: "wrist_assistant/library/summary" },
      { type: "wrist_assistant/library/pick", owner_id: "w1", kind: "pages", item_id: "P1", on: true },
      { type: "wrist_assistant/library/pick", owner_id: "w1", kind: "status_pages", item_id: "S1", on: false },
      { type: "wrist_assistant/library/pick", owner_id: "w1", kind: "menus", unit: "entity", item_id: "M1" },
      { type: "wrist_assistant/library/menus/copy", owner_id: "w1", unit: "anywhere", name: "Chen's menu" },
      // A new menu names no device: no device uses it until one is ticked.
      { type: "wrist_assistant/library/menus/create", unit: "entity", name: "Kitchen menu", sections: { entityRadial: { slots: [] } } },
      { type: "wrist_assistant/library/menus/rename", item_id: "M1", name: "Home menu" },
      { type: "wrist_assistant/library/menus/delete", item_id: "M1" },
      { type: "wrist_assistant/library/delete", kind: "status_pages", item_id: "S1" },
    ]);
    for (const msg of sent) expect(msg).not.toHaveProperty("id");
  });
});

describe("a menu's sections", () => {
  it("are the keys of a menus document each unit is made of, as the server names them", () => {
    expect(MENU_UNIT_SECTIONS).toEqual({ anywhere: ["quickAction", "pageSwitcher"], entity: ["entityRadial"] });
  });
});

describe("libraryErrorText", () => {
  it("puts the refusals in plain words", () => {
    expect(libraryErrorText({ code: "unknown_command", message: "Unknown command." })).toBe(LIBRARY_UNSUPPORTED_TEXT);
    expect(libraryErrorText({ code: "in_use", message: "menu in use" })).toBe("A device still uses this menu. Pick another menu for it first.");
    expect(libraryErrorText({ code: "awaiting_move", message: "x" })).toMatch(/^Waiting for your iPhone\..* Try again after that\.$/);
    expect(libraryErrorText({ code: "not_for_iphone", message: "x" })).toMatch(/^An iPhone keeps only/);
    expect(libraryErrorText({ error: { code: "invalid", message: "name is empty" } })).toBe("name is empty");
    expect(libraryErrorCode({ error: { code: "in_use", message: "" } })).toBe("in_use");
  });
});
