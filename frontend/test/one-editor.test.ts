// Plan step 4, one editor per page: what the library editor is handed when
// a board opens it from one device (the device ringed in the strip, the
// preview on its kind), "Saved" beside the strip after a tick, and New page
// on a focused device adding the page to that device's own record.

import { nothing } from "lit";
import { describe, expect, it } from "vitest";
import type { OwnerSummary } from "../src/ha-api.js";
import { libraryOf } from "../src/library/model.js";
import { previewLabel, previewOwner, renderPreviewPicker, renderStripSaved, startPreviewKind, startSideBySide } from "../src/library/item-mode.js";
import { itemWhereText, listedItems } from "../src/library/item-list.js";
import { onEachDeviceLines, ordinal, placeText, syncText } from "../src/library/on-each-device.js";
import { libraryItems } from "../src/library/model.js";
import { deviceDifferenceText } from "../src/watch-pages/device-differences.js";
import type { WatchPage } from "../src/watch-pages/model.js";
import { renderTicks } from "../src/library/ticks.js";
import { NO_RECORD_TEXT, changeDevicePicks, changedPicks } from "../src/watch-pages/all-pages-picks.js";
import { duplicateMenuTitle, duplicatedMenuText } from "../src/watch-menus/all-menus-model.js";
import { CHEN, DEVICES, JESSE, LIGHTS, LONELY, PAGE1, PHONE, STARTER, summary } from "./library-fixture.js";
import { flat } from "./library-editor-home.js";

const owner = (o: Partial<OwnerSummary>): OwnerSummary => ({
  owner_watch_id: "x", device_name: "Apple Watch", device_kind: "watch", paired_iphone_name: null, app_version: "3.0.0",
  screen_size: null, complication_count: 0, token: 3, applied_token: 3, is_orphan: false, ...o,
} as OwnerSummary);

describe("the strip in the one editor", () => {
  it("rings the device the editor was opened from and says viewing", () => {
    const text = flat(renderTicks({
      library: libraryOf(summary()), kind: "pages", itemId: PAGE1, devices: DEVICES, colorOf: () => undefined, viewing: JESSE,
    }, () => undefined));
    const chips = text.split("<button").slice(1);
    const jesse = chips.find((c) => c.includes("Jesse Apple Watch"))!;
    expect(jesse).toContain("viewing");
    expect(jesse).toContain(`<em class="lt-viewing">viewing</em>`);
    expect(jesse).toContain("You came here from Jesse Apple Watch.");
    // Its chip inline and again in the fold's list: only ever Jesse's.
    expect(chips.filter((c) => c.includes(`class="lt-viewing"`)).every((c) => c.includes("Jesse Apple Watch"))).toBe(true);
  });

  it("flashes Saved for a moment after a write lands, and draws nothing once it is over", () => {
    expect(renderStripSaved(1000, 1200)).not.toBe(nothing);
    expect(renderStripSaved(1000, 1000 + 1800)).toBe(nothing);
    expect(renderStripSaved(undefined)).toBe(nothing);
  });
});

describe("the preview of an item opened from a board", () => {
  const watch = owner({ owner_watch_id: "w" });
  const other = owner({ owner_watch_id: "w2" });
  const phone = owner({ owner_watch_id: "p", device_kind: "iphone", phone_pages: true });
  const devices = [watch, other, phone];

  it("starts on the kind of the device it came from, else the one kind that has it", () => {
    expect(startPreviewKind(devices, { kind: "pages", id: "a", from: "p" }, ["w"])).toBe("iphone");
    expect(startPreviewKind(devices, { kind: "pages", id: "a", from: "W2" }, ["p"])).toBe("watch");
    expect(startPreviewKind(devices, { kind: "pages", id: "a" }, ["p"])).toBe("iphone");
    expect(startPreviewKind(devices, { kind: "pages", id: "a" }, ["w", "w2"])).toBe("watch");
  });

  it("draws on the device it came from, then a device that has it, then the first of the kind", () => {
    expect(previewOwner(devices, "watch", ["W2"])).toBe("w2");
    expect(previewOwner(devices, "watch", [undefined, "p", "w2"])).toBe("w2");
    expect(previewOwner(devices, "watch", ["p"])).toBe("w");
    expect(previewOwner(devices, "iphone", ["w"])).toBe("p");
  });
});

describe("New page on a focused device", () => {
  it("puts the new page last on that device, once", () => {
    const doc = { schemaVersion: 1, pages: [{ id: LIGHTS, name: "Lights", items: [] }] };
    const add = { id: "N1", name: "New Page 2", items: [] };
    const next = changedPicks("pages", doc, { add });
    expect((next.pages as { id: string }[]).map((p) => p.id)).toEqual([LIGHTS, "N1"]);
    expect(changedPicks("pages", next, { add })).toBe(next);
    expect(changedPicks("status_pages", { schemaVersion: 1 }, { add })).toEqual({ schemaVersion: 1, statusPages: [add] });
  });

  it("refuses a device with no record yet, which its app sets up first", async () => {
    const result = await changeDevicePicks({
      read: async () => ({ revision: 0, document: {} }),
      save: async () => { throw new Error("no save"); },
    }, CHEN, "pages", { add: { id: "N1", name: "New Page 2", items: [] } });
    expect(result).toEqual({ ok: false, code: "no_record", message: NO_RECORD_TEXT });
  });
});

describe("Duplicate on a focused device's shared menu", () => {
  it("names the device and what the copy does", () => {
    expect(duplicateMenuTitle("Home", "Jesse Apple Watch")).toBe("Duplicate Home for Jesse Apple Watch. The other devices keep this one.");
    expect(duplicatedMenuText("Jesse Apple Watch's menu", "Jesse Apple Watch")).toBe(`Jesse Apple Watch uses its own copy now, "Jesse Apple Watch's menu". Edits to it change only Jesse Apple Watch.`);
  });
});

describe("Side by side", () => {
  const watch = owner({ owner_watch_id: "w" });
  const phone = owner({ owner_watch_id: "p", device_kind: "iphone", phone_pages: true });

  it("opens Side by side for a page on both kinds or on none, alone for one kind", () => {
    expect(startSideBySide([watch, phone], ["w", "p"], true)).toBe(true);
    expect(startSideBySide([watch, phone], [], true)).toBe(true);
    expect(startSideBySide([watch, phone], ["w"], true)).toBe(false);
    expect(startSideBySide([watch, phone], ["p"], true)).toBe(false);
    // A home with no iPhone, or none kept: one preview.
    expect(startSideBySide([watch], [], true)).toBe(false);
    expect(startSideBySide([watch, phone], [], false)).toBe(false);
  });

  it("labels each preview with the devices of its kind that have it", () => {
    expect(previewLabel("watch", ["Jesse Apple Watch", "Chen Watch"])).toBe("Watch · Jesse Apple Watch, Chen Watch");
    expect(previewLabel("iphone", [])).toBe("iPhone · on no iPhone yet");
  });

  it("draws a third thumbnail only when asked", () => {
    expect(flat(renderPreviewPicker("watch", () => undefined))).not.toContain("Side by side");
    expect(flat(renderPreviewPicker("watch", () => undefined, { on: true, pick: () => undefined }))).toContain("Side by side");
  });
});

describe("the differences line under each preview", () => {
  const page: WatchPage = {
    id: "P",
    name: "Living",
    items: [
      { id: "a", entityId: "light.desk" },
      { id: "b", entityId: "map.AAAA0000-0000-4000-8000-0000000000A1" },
      { id: "c", entityId: "web.AAAA0000-0000-4000-8000-0000000000A2", customLabel: "Garden cam" },
      { id: "d", entityId: "camera.door", cameraTileLive: true },
      { id: "e", entityId: "sensor.temp", sensorChart: "24h" },
    ],
  };

  it("says only what each kind does otherwise", () => {
    expect(deviceDifferenceText(page, "watch")).toBe("Skips Map and Garden cam. The camera shows a still picture. The sensor shows no chart.");
    expect(deviceDifferenceText(page, "iphone")).toBe("Also shows Map and Garden cam. The camera plays live. The sensor shows a chart.");
  });

  it("has no line for a page both kinds draw the same", () => {
    const plain: WatchPage = { id: "Q", name: "Lights", items: [{ id: "a", entityId: "light.desk" }, { id: "b", entityId: "camera.door" }] };
    expect(deviceDifferenceText(plain, "watch")).toBe("");
    expect(deviceDifferenceText(plain, "iphone")).toBe("");
  });
});

describe("On each device", () => {
  const lib = libraryOf(summary());

  it("lists each device that has the page, with its place and Hide here", () => {
    const lines = onEachDeviceLines(lib, "pages", PAGE1, DEVICES);
    expect(lines.map((l) => [l.name, l.place, l.count, l.hidden])).toEqual([
      ["Jesse Apple Watch", 2, 2, true],
      ["iPhone 15 Pro", 1, 1, false],
    ]);
    expect(lines.every((l) => l.sync === undefined)).toBe(true);
    expect(placeText(lines[0]!, "pages")).toBe("2nd of 2 pages");
    expect(placeText(lines[1]!, "pages")).toBe("Its only page");
    expect(onEachDeviceLines(lib, "pages", LONELY, DEVICES)).toEqual([]);
  });

  it("reads the sync word from the summary's numbers", () => {
    const lines = onEachDeviceLines(lib, "status_pages", STARTER, DEVICES, {
      owners: {
        [CHEN]: { status_pages: { revision: 4, delivered_revision: 4 } },
        [JESSE]: { status_pages: { revision: 5, delivered_revision: 3 } },
      },
    } as never);
    expect(lines.map((l) => [l.ownerId, syncText(l)])).toEqual([[CHEN, "Synced"], [JESSE, "Waiting for the watch"], [PHONE, ""]]);
    expect(placeText(lines[1]!, "status_pages")).toBe("2nd of 2 status pages");
  });

  it("counts places as people say them", () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 103].map(ordinal)).toEqual(["1st", "2nd", "3rd", "4th", "11th", "12th", "13th", "21st", "22nd", "103rd"]);
  });
});

describe("the left list in the one editor", () => {
  const lib = libraryOf(summary());

  it("keeps every page, or with On no device only those and the open one", () => {
    const items = libraryItems(lib, "pages");
    expect(listedItems(items, PAGE1, "all")).toHaveLength(items.length);
    expect(listedItems(items, PAGE1, "none").map((e) => e.id).sort()).toEqual([LONELY, PAGE1].sort());
    expect(itemWhereText({ owners: [] })).toBe("On no device yet");
    expect(itemWhereText({ owners: [JESSE] })).toBe("On 1 device");
    expect(itemWhereText({ owners: [JESSE, PHONE] })).toBe("On 2 devices");
  });
});
