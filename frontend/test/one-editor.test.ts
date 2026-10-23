// Plan step 4, one editor per page: what the library editor is handed when
// a board opens it from one device (the device ringed in the strip, the
// preview on its kind), "Saved" beside the strip after a tick, and New page
// on a focused device adding the page to that device's own record.

import { nothing } from "lit";
import { describe, expect, it } from "vitest";
import type { OwnerSummary } from "../src/ha-api.js";
import { libraryOf } from "../src/library/model.js";
import { previewOwner, renderStripSaved, startPreviewKind } from "../src/library/item-mode.js";
import { renderTicks } from "../src/library/ticks.js";
import { NO_RECORD_TEXT, changeDevicePicks, changedPicks } from "../src/watch-pages/all-pages-picks.js";
import { duplicateMenuTitle, duplicatedMenuText } from "../src/watch-menus/all-menus-model.js";
import { CHEN, DEVICES, JESSE, LIGHTS, PAGE1, summary } from "./library-fixture.js";
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
