// Pointing a tile at another entity (`tile-entity.ts`): what stays, what
// follows the entity, and what goes with the old kind.

import { describe, expect, it } from "vitest";
import type { WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { type WatchEntityAdd, watchCalendarColor, watchEntityDefaults } from "../src/watch-pages/tile-new.js";
import { WATCH_TILE_ENTITY_DOMAINS, isWatchTileEntityChoice, setWatchTileEntity } from "../src/watch-pages/tile-entity.js";

const PAGE = "PAGE";
const TILE = "TILE";

function doc(tile: WatchPageTile): WatchPagesDocument {
  return { pages: [{ id: PAGE, name: "Hall", items: [{ id: TILE, gridCol: 2, gridRow: 4, colSpan: 6, rowSpan: 4, ...tile }] }] };
}

function tileOf(d: WatchPagesDocument): WatchPageTile {
  return (d.pages as { items: WatchPageTile[] }[])[0]!.items[0]!;
}

function swap(tile: WatchPageTile, next: WatchEntityAdd, old: WatchEntityAdd): WatchPageTile {
  return tileOf(setWatchTileEntity(doc(tile), PAGE, TILE, next, old));
}

const OLD_LAMP: WatchEntityAdd = { entityId: "light.lamp", friendlyName: "Lamp", state: "on" };
const NEW_DESK: WatchEntityAdd = { entityId: "light.desk", friendlyName: "Desk", state: "off" };

describe("another entity of the same kind", () => {
  it("moves the name, icon and color while they are the old entity's defaults", () => {
    const page = doc({}).pages as never;
    const look = watchEntityDefaults(OLD_LAMP, (page as never[])[0]);
    const out = swap({ entityId: OLD_LAMP.entityId, customLabel: "Lamp", icon: look.icon, color: look.color }, NEW_DESK, OLD_LAMP);
    expect(out.entityId).toBe("light.desk");
    expect(out.customLabel).toBe("Desk");
    expect(out.icon).toBe(look.icon);
    expect(out.color).toBe(look.color);
  });

  it("keeps a name, icon and color the user chose, and every other setting", () => {
    const out = swap({
      entityId: OLD_LAMP.entityId,
      customLabel: "Reading",
      icon: "star.fill",
      color: "#123456",
      singleTapAction: "toggle",
      holdSlideActions: { up: "toggle" },
      stateIcons: { on: "sun.max" },
      showWhen: { entityId: "person.alex", comparisonOperator: "eq", state: "home" },
    }, NEW_DESK, OLD_LAMP);
    expect(out).toMatchObject({
      id: TILE, gridCol: 2, gridRow: 4, colSpan: 6, rowSpan: 4,
      customLabel: "Reading", icon: "star.fill", color: "#123456",
      singleTapAction: "toggle", holdSlideActions: { up: "toggle" }, stateIcons: { on: "sun.max" },
      showWhen: { entityId: "person.alex" },
    });
  });

  it("leaves a tile with no label reading its entity's name", () => {
    expect(Object.hasOwn(swap({ entityId: OLD_LAMP.entityId }, NEW_DESK, OLD_LAMP), "customLabel")).toBe(false);
  });

  it("drops what described the old entity or its device", () => {
    const out = swap({ entityId: OLD_LAMP.entityId, capabilities: { brightness: true } }, NEW_DESK, OLD_LAMP);
    expect(Object.hasOwn(out, "capabilities")).toBe(false);
    const vacuum = swap(
      { entityId: "vacuum.a", vacuumBatteryEntityId: "sensor.a_battery", vacuumSwitchEntityIds: ["switch.a_mop"], singleTapAction: "start" },
      { entityId: "vacuum.b" },
      { entityId: "vacuum.a" },
    );
    expect(Object.hasOwn(vacuum, "vacuumBatteryEntityId")).toBe(false);
    expect(Object.hasOwn(vacuum, "vacuumSwitchEntityIds")).toBe(false);
    expect(vacuum.singleTapAction).toBe("start");
  });

  it("links a remote to the new device's media player", () => {
    const out = swap(
      { entityId: "remote.a", associatedMediaPlayerId: "media_player.a" },
      { entityId: "remote.b", deviceEntityIds: ["remote.b", "media_player.b"] },
      { entityId: "remote.a" },
    );
    expect(out.associatedMediaPlayerId).toBe("media_player.b");
    const none = swap({ entityId: "remote.a", associatedMediaPlayerId: "media_player.a" }, { entityId: "remote.b" }, { entityId: "remote.a" });
    expect(Object.hasOwn(none, "associatedMediaPlayerId")).toBe(false);
  });

  it("gives a calendar's first place to the new calendar", () => {
    const out = swap(
      {
        entityId: "calendar.a",
        additionalCalendarEntityIds: ["calendar.b", "calendar.c"],
        calendarSourceColors: { "calendar.a": "#111111", "calendar.b": "#222222", "calendar.c": "#333333" },
      },
      { entityId: "calendar.b" },
      { entityId: "calendar.a" },
    );
    expect(out.additionalCalendarEntityIds).toEqual(["calendar.c"]);
    expect(out.calendarSourceColors).toEqual({ "calendar.b": "#222222", "calendar.c": "#333333" });
    const fresh = swap({ entityId: "calendar.a" }, { entityId: "calendar.z" }, { entityId: "calendar.a" });
    expect(fresh.calendarSourceColors).toEqual({ "calendar.z": watchCalendarColor("calendar.z") });
  });
});

describe("an entity of another kind", () => {
  it("drops what only the old kind reads and keeps the look, place and visibility", () => {
    const out = swap({
      entityId: "camera.door",
      customLabel: "Front",
      icon: "star.fill",
      cameraDisplayMode: "preview",
      cameraFillMode: "fill",
      singleTapAction: "open",
      holdSlideActions: { up: "open" },
      stateIcons: { on: "sun.max" },
      borderColor: "#abcdef",
      arrange: { kind: "stack" },
      showWhen: { entityId: "person.alex", comparisonOperator: "eq", state: "home" },
      someKeyFromANewerApp: 1,
    }, NEW_DESK, { entityId: "camera.door", friendlyName: "Door" });
    expect(out).toMatchObject({
      id: TILE, entityId: "light.desk", gridCol: 2, gridRow: 4, colSpan: 6, rowSpan: 4,
      customLabel: "Front", icon: "star.fill", borderColor: "#abcdef", arrange: { kind: "stack" },
      showWhen: { entityId: "person.alex" }, someKeyFromANewerApp: 1,
    });
    for (const key of ["cameraFillMode", "singleTapAction", "holdSlideActions", "stateIcons"]) {
      expect(Object.hasOwn(out, key), key).toBe(false);
    }
    // Every new tile carries this key, at icon unless it is a camera.
    expect(out.cameraDisplayMode).toBe("icon");
  });

  it("takes the new kind's starting keys and its default look", () => {
    const page = (doc({}).pages as never[])[0];
    const lamp = watchEntityDefaults(OLD_LAMP, page);
    const door: WatchEntityAdd = { entityId: "camera.door", friendlyName: "Door" };
    const camera = watchEntityDefaults(door, page);
    const out = swap({ entityId: OLD_LAMP.entityId, customLabel: "Lamp", icon: lamp.icon, color: lamp.color }, door, OLD_LAMP);
    expect(out).toMatchObject({ entityId: "camera.door", customLabel: "Door", icon: camera.icon, color: camera.color, cameraDisplayMode: "preview" });
  });
});

describe("what is refused", () => {
  const start = doc({ entityId: OLD_LAMP.entityId });

  it("the app's own kinds, a broken id and a domain no tile is added for", () => {
    for (const id of ["spacer.ABC", "page.ABC", "assist.x", "light", "light.", "sun.sun"]) {
      expect(isWatchTileEntityChoice(id), id).toBe(false);
      expect(setWatchTileEntity(start, PAGE, TILE, { entityId: id }, OLD_LAMP)).toBe(start);
    }
    expect(isWatchTileEntityChoice("light.desk")).toBe(true);
  });

  it("the entity it already shows", () => {
    expect(setWatchTileEntity(start, PAGE, TILE, OLD_LAMP, OLD_LAMP)).toBe(start);
  });

  it("a tile of one of the app's own kinds", () => {
    const spacer = doc({ entityId: "spacer.ABC" });
    expect(setWatchTileEntity(spacer, PAGE, TILE, NEW_DESK, { entityId: "spacer.ABC" })).toBe(spacer);
  });

  it("offers no app kinds in the list", () => {
    expect(WATCH_TILE_ENTITY_DOMAINS).toContain("light");
    expect(WATCH_TILE_ENTITY_DOMAINS).not.toContain("spacer");
    expect(WATCH_TILE_ENTITY_DOMAINS).not.toContain("page");
  });
});
