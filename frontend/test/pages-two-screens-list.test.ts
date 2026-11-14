// The Pages tab's two screens, apart from the element: the one line under a
// page's name, the Screens differ filter, the update card's memory, New
// page's devices and rooms, and Make a copy's ticks, name and refusals.

import { describe, expect, it } from "vitest";

import { pageScreensDiffer, pageScreensLine, twoScreensCardDismissed, dismissTwoScreensCard, resetTwoScreensCardForTest, TWO_SCREENS_CARD_KEY, userOffTiles } from "../src/watch-pages/all-pages-screens.js";
import { copyLines, copyNameFor, copyRefusal, newCopyForm, tickCopyForm } from "../src/watch-pages/make-copy.js";
import { lastNewPageDevices, keepNewPageDevices, newPageOwners, resetNewPageDevicesForTest, roomAreas, roomEntities, roomPicked, tickRoomEntity, newPageForm, newPageRefusal } from "../src/watch-pages/new-page-sheet.js";
import { renderTicks, CHIP_COPY_HINT } from "../src/library/ticks.js";
import type { WatchPage } from "../src/watch-pages/model.js";
import type { NewPageForm } from "../src/watch-pages/new-page-sheet.js";
import { libraryOf } from "../src/library/model.js";
import { CHEN, DEVICES, JESSE, PAGE1, PHONE, summary } from "./library-fixture.js";
import { flat } from "./library-tab-fake.js";

const tile = (id: string, entityId: string, row: number) => ({ id, entityId, gridCol: 0, gridRow: row, colSpan: 6, rowSpan: 2 });

const plain: WatchPage = { id: "P", name: "Hall", items: [tile("a", "light.a", 0), tile("b", "light.b", 2)] };

function store() {
  const held = new Map<string, string>();
  return { getItem: (k: string) => held.get(k) ?? null, setItem: (k: string, v: string) => { held.set(k, v); } };
}

describe("the line under a page's name", () => {
  it("says nothing when both screens match, and never counts a tile the watch cannot draw", () => {
    expect(pageScreensLine(plain, [JESSE, PHONE], DEVICES)).toBeUndefined();
    const withMap: WatchPage = { ...plain, items: [...(plain.items as unknown[]), tile("m", "map.M", 4)] as WatchPage["items"] };
    expect(userOffTiles(withMap, "watch")).toBe(0);
    expect(pageScreensLine(withMap, [JESSE, PHONE], DEVICES)).toBeUndefined();
    expect(pageScreensDiffer(withMap)).toBe(false);
  });

  it("says Watch only or iPhone only in a home with both kinds", () => {
    expect(pageScreensLine(plain, [JESSE], DEVICES)).toBe("Watch only");
    expect(pageScreensLine(plain, [PHONE], DEVICES)).toBe("iPhone only");
    // A home of watches alone: no such line.
    expect(pageScreensLine(plain, [JESSE], DEVICES.filter((d) => d.kind === "watch"))).toBeUndefined();
    // A page on no device: nothing either.
    expect(pageScreensLine(plain, [], DEVICES)).toBeUndefined();
  });

  it("counts tiles off on the watch, then on the iPhone, then says the iPhone is arranged differently", () => {
    const offWatch: WatchPage = { ...plain, screens: { watch: { a: { col: 0, row: 0, colSpan: 6, rowSpan: 2 } }, iphone: { a: { col: 0, row: 0, colSpan: 6, rowSpan: 2 }, b: { col: 0, row: 2, colSpan: 6, rowSpan: 2 } } } };
    expect(pageScreensLine(offWatch, [JESSE, PHONE], DEVICES)).toBe("1 tile off on the watch");
    const offPhone: WatchPage = { ...plain, screens: { watch: { a: { col: 0, row: 0, colSpan: 6, rowSpan: 2 }, b: { col: 0, row: 2, colSpan: 6, rowSpan: 2 } }, iphone: { b: { col: 0, row: 0, colSpan: 6, rowSpan: 2 } } } };
    expect(pageScreensLine(offPhone, [JESSE, PHONE], DEVICES)).toBe("1 tile off on the iPhone");
    const apart: WatchPage = { ...plain, screens: { watch: { a: { col: 0, row: 0, colSpan: 6, rowSpan: 2 }, b: { col: 0, row: 2, colSpan: 6, rowSpan: 2 } }, iphone: { b: { col: 0, row: 0, colSpan: 6, rowSpan: 2 }, a: { col: 0, row: 2, colSpan: 6, rowSpan: 2 } } } };
    expect(pageScreensLine(apart, [JESSE, PHONE], DEVICES)).toBe("iPhone arranged differently");
    for (const page of [offWatch, offPhone, apart]) expect(pageScreensDiffer(page)).toBe(true);
    expect(pageScreensDiffer(plain)).toBe(false);
  });
});

describe("the update card", () => {
  it("is remembered as dismissed in storage", () => {
    resetTwoScreensCardForTest();
    const s = store();
    expect(twoScreensCardDismissed(s)).toBe(false);
    dismissTwoScreensCard(s);
    expect(s.getItem(TWO_SCREENS_CARD_KEY)).toBe("1");
    expect(twoScreensCardDismissed(s)).toBe(true);
    resetTwoScreensCardForTest();
  });
});

describe("New page", () => {
  it("ticks every device the first time, then the last new page's that are still here", () => {
    resetNewPageDevicesForTest();
    const s = store();
    expect(newPageOwners(DEVICES, lastNewPageDevices(s))).toEqual([CHEN, JESSE, PHONE]);
    keepNewPageDevices([PHONE, "gone-watch"], s);
    expect(newPageOwners(DEVICES, lastNewPageDevices(s))).toEqual([PHONE]);
    // A watch still waiting for its iPhone is never ticked.
    expect(newPageOwners(DEVICES, undefined, (id) => id === CHEN)).toEqual([JESSE, PHONE]);
    resetNewPageDevicesForTest();
  });

  it("lists a room's controls ticked and the rest under More, skipping hidden and diagnostic entities", () => {
    const hass = {
      states: {
        "light.k": { state: "on", attributes: { friendly_name: "Ceiling" } },
        "scene.k": { state: "", attributes: { friendly_name: "Cook" } },
        "sensor.k": { state: "20", attributes: { friendly_name: "Air" } },
        "sensor.hidden": { state: "1", attributes: {} },
        "switch.diag": { state: "on", attributes: {} },
      },
      entities: { "light.k": { area_id: "k" }, "scene.k": { area_id: "k" }, "sensor.k": { area_id: "k" }, "sensor.hidden": { area_id: "k", hidden: true }, "switch.diag": { area_id: "k", entity_category: "config" } },
      areas: { k: { name: "Kitchen" }, x: { name: "Empty" } },
    } as never;
    expect(roomAreas(hass)).toEqual([{ id: "k", name: "Kitchen" }]);
    const room = roomEntities(hass, "k");
    expect(room.controls.map((e) => e.name)).toEqual(["Ceiling", "Cook"]);
    expect(room.more.map((e) => e.name)).toEqual(["Air"]);
    let form: NewPageForm = { ...newPageForm("Kitchen", []), start: "room", areaId: "k" };
    expect(roomPicked(form, room)).toEqual(["light.k", "scene.k"]);
    form = tickRoomEntity(form, room, "sensor.k", true);
    form = tickRoomEntity(form, room, "light.k", false);
    expect(roomPicked(form, room)).toEqual(["scene.k", "sensor.k"]);
    expect(newPageRefusal(tickRoomEntity(tickRoomEntity(form, room, "scene.k", false), room, "sensor.k", false), { hass, pages: [] })).toBe("Tick something in the room.");
  });
});

describe("Make a copy", () => {
  const holders = DEVICES.filter((d) => d.ownerId !== CHEN);

  it("names the copy for the kind ticked until the name is typed", () => {
    expect(copyNameFor("Lights", DEVICES.filter((d) => d.kind === "iphone"))).toBe("Lights (iPhone)");
    expect(copyNameFor("Lights", DEVICES.filter((d) => d.kind === "watch"))).toBe("Lights (Watch)");
    expect(copyNameFor("Lights", DEVICES)).toBe("Lights (copy)");
    let form = newCopyForm(PAGE1, "Lights", holders);
    expect(form.owners).toEqual([]);
    form = tickCopyForm(form, holders, PHONE, true);
    expect(form.copyName).toBe("Lights (iPhone)");
    form = tickCopyForm({ ...form, copyName: "Phone lights", named: true }, holders, JESSE, true);
    expect(form.copyName).toBe("Phone lights");
    expect(form.owners).toEqual([JESSE, PHONE]);
  });

  it("refuses no device, every device, and an empty name", () => {
    const form = newCopyForm(PAGE1, "Lights", holders);
    expect(copyRefusal(form, holders)).toBe("Tick the devices that get the copy.");
    expect(copyRefusal({ ...form, owners: [JESSE, PHONE] }, holders)).toBe("Leave Lights on at least one device. To change it everywhere, just edit it.");
    expect(copyRefusal({ ...form, owners: [PHONE], copyName: " " }, holders)).toBe("Give the copy a name.");
    expect(copyRefusal({ ...form, owners: [PHONE] }, holders)).toBeUndefined();
  });

  it("names the device before each line the reply gives", () => {
    expect(copyLines([{ owner_id: PHONE, what: "menu slot Up in Anywhere menu" }, { owner_id: "gone", what: "complication Kitchen" }], DEVICES))
      .toEqual(["iPhone 15 Pro: menu slot Up in Anywhere menu", "complication Kitchen"]);
  });

  it("opens from a right click on a ticked page chip, and says so in its tooltip", () => {
    const library = libraryOf(summary());
    const drawn = flat(renderTicks({ library, kind: "pages", itemId: PAGE1, devices: DEVICES, colorOf: () => undefined, onCopy: () => undefined }, () => undefined));
    // The page is on Jesse's watch and the iPhone: their chips say it, Chen's does not.
    expect(drawn.split(CHIP_COPY_HINT).length - 1).toBe(4); // two inline chips and the fold's two
    expect(drawn).toMatch(/Not on Chen Watch\. Tick to put the page there\.(?! Right-click)/);
    const without = flat(renderTicks({ library, kind: "pages", itemId: PAGE1, devices: DEVICES, colorOf: () => undefined }, () => undefined));
    expect(without).not.toContain(CHIP_COPY_HINT);
  });
});
