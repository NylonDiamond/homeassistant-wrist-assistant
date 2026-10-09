// What else points at a watch page, and how a deleted page is cleared from
// it: the menu slots that go to it and the complication taps that open it
// (the test bed's A7, where both kept naming a deleted page).

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { ComplicationRecord } from "../src/ha-api.js";
import {
  clearPageFromComplication,
  clearPageFromMenus,
  complicationsOpeningPage,
  deletedPageIds,
  menuSlotsOpeningPage,
} from "../src/watch-pages/page-refs.js";

const LIVING = "C30E7CBF-E53A-4A00-90EF-07A0CC51B374";
const BEDROOM = "6F1C2D0E-0000-4000-8000-000000000001";

const goTo = (id: string, pageId: string, position = "topLeft") => ({
  id, position, isVisible: true, icon: "arrow.right.square", color: "#2F79B6",
  action: { type: "navigateToPage", pageId },
});

function menus(): Record<string, unknown> {
  return {
    schemaVersion: 1,
    quickAction: {
      schemaVersion: 1,
      slots: [
        goTo("S1", LIVING, "topLeft"),
        { id: "S2", position: "topRight", action: { type: "toggleFlashlight" } },
        // The id as another writer may spell it.
        goTo("S3", LIVING.toLowerCase(), "bottomCenter"),
        goTo("S4", BEDROOM, "bottomLeft"),
      ],
    },
    entityRadial: {
      schemaVersion: 1,
      lightSlots: [goTo("L1", LIVING, "rightCenter")],
      entityOverrides: { "light.bed": [goTo("O1", LIVING, "leftCenter")] },
    },
    pageSwitcher: { schemaVersion: 1, displayMode: "icons" },
  };
}

function record(id: string, document: Record<string, unknown> | null, deleted = false): ComplicationRecord {
  return { id, ownerWatchId: "watch-A", revision: 3, token: 9, updatedAt: "", updatedBy: "panel", deleted, document };
}

function gauge(): Record<string, unknown> {
  return {
    schemaVersion: 6, id: "A1", name: "E2E Humidity gauge",
    tapAction: { type: "openPage" }, openPageId: LIVING, openPageName: "Living",
    elements: [
      { kind: "gauge", payload: { id: "G1" } },
      { kind: "tap", payload: { id: "T1", action: { type: "openPage" }, openPageId: LIVING, openPageName: "Living" } },
      { kind: "tap", payload: { id: "T2", action: { type: "openPage" }, openPageId: BEDROOM, openPageName: "Bedroom" } },
    ],
  };
}

describe("menu slots that go to a page", () => {
  it("finds them in every list, the id compared without case", () => {
    const found = menuSlotsOpeningPage(menus(), LIVING);
    expect(found.map((f) => f.slotId)).toEqual(["S1", "S3", "L1", "O1"]);
    expect(found[0]).toMatchObject({ where: "Anywhere menu", position: "Top Left" });
    expect(found[2]!.where).toBe("Entity quick menu, Light");
    expect(found[3]!.where).toBe("Entity quick menu for light.bed");
    expect(menuSlotsOpeningPage(undefined, LIVING)).toEqual([]);
  });

  it("takes those slots out and leaves everything else as it was", () => {
    const before = menus();
    const after = clearPageFromMenus(before, [LIVING]);
    expect(menuSlotsOpeningPage(after, LIVING)).toEqual([]);
    const qa = after.quickAction as { slots: { id: string }[] };
    expect(qa.slots.map((s) => s.id)).toEqual(["S2", "S4"]);
    const radial = after.entityRadial as Record<string, unknown>;
    expect(radial.lightSlots).toEqual([]);
    expect(radial.entityOverrides).toEqual({ "light.bed": [] });
    expect(after.pageSwitcher).toEqual(before.pageSwitcher);
    // The document read is not changed in place.
    expect(menuSlotsOpeningPage(before, LIVING)).toHaveLength(4);
  });

  it("hands back the same document when nothing goes to the page, so nothing is saved", () => {
    const doc = menus();
    expect(clearPageFromMenus(doc, ["0000-NOT-A-PAGE"])).toBe(doc);
  });
});

describe("complications that open a page", () => {
  it("finds a whole-complication tap and tap layers, skipping deleted records", () => {
    const found = complicationsOpeningPage([
      record("A1", gauge()),
      record("A2", { name: "Other", tapAction: { type: "none" }, elements: [] }),
      record("A3", gauge(), true),
      record("A4", null),
    ], LIVING);
    expect(found).toEqual([{ id: "A1", name: "E2E Humidity gauge", whole: true, layers: 1 }]);
    expect(complicationsOpeningPage([record("A1", gauge())], BEDROOM)).toEqual([
      { id: "A1", name: "E2E Humidity gauge", whole: false, layers: 1 },
    ]);
  });

  it("makes those taps do nothing and keeps the rest of the design", () => {
    const before = gauge();
    const after = clearPageFromComplication(before, [LIVING])!;
    expect(after).toBeDefined();
    expect(after.tapAction).toEqual({ type: "none" });
    expect("openPageId" in after).toBe(false);
    expect("openPageName" in after).toBe(false);
    const [g, t1, t2] = after.elements as { payload: Record<string, unknown> }[];
    expect(g).toEqual({ kind: "gauge", payload: { id: "G1" } });
    expect(t1!.payload).toEqual({ id: "T1", action: { type: "none" } });
    // A tap opening another page is left alone.
    expect(t2!.payload).toEqual({ id: "T2", action: { type: "openPage" }, openPageId: BEDROOM, openPageName: "Bedroom" });
    expect(after.name).toBe("E2E Humidity gauge");
    // The record read is not changed in place.
    expect(before.openPageId).toBe(LIVING);
    expect(complicationsOpeningPage([record("A1", after)], LIVING)).toEqual([]);
  });

  it("says undefined when nothing in the design opens the page", () => {
    expect(clearPageFromComplication(gauge(), ["0000-NOT-A-PAGE"])).toBeUndefined();
  });
});

describe("the pages a save deletes", () => {
  it("are the ids the base lists and the saved pages do not", () => {
    const base = [{ id: LIVING }, { id: BEDROOM }, { id: "SYS" }];
    expect(deletedPageIds(base, [{ id: BEDROOM.toLowerCase() }, { id: "SYS" }])).toEqual([LIVING]);
    expect(deletedPageIds(base, base)).toEqual([]);
    expect(deletedPageIds([{}], [])).toEqual([]);
  });
});

describe("the page editor's delete", () => {
  // No test mounts the editor's delete dialog, so its wiring is read from
  // the source, the way the panel's Home is (panel-home-source.test.ts).
  const source = readFileSync(join(__dirname, "..", "src", "watch-pages", "page-editor.ts"), "utf8");

  it("names the menu slots and complication taps instead of saying the list leaves them out", () => {
    expect(source).not.toContain("This list does not include those.");
    expect(source).toContain(`fetchWatchConfig(hass, watchId, "menus")`);
    expect(source).toContain("fetchList(hass, watchId)");
    expect(source).toContain("menuSlotsOpeningPage(ask.menus, ask.pageId)");
    expect(source).toContain("complicationsOpeningPage(ask.complications ?? [], ask.pageId)");
  });

  it("clears them once the save that deletes the page has landed", () => {
    expect(source).toContain("const deleted = deletedPageIds(watchPagesOf(draft.base), watchPagesOf(draft.document));");
    expect(source).toContain("if (result.ok && deleted.length > 0) {");
    expect(source).toContain(`await saveWatchConfig(hass, watchId, "menus", record.revision, next);`);
    expect(source).toContain("await saveRecord(hass, watchId, next, record.revision);");
  });
});
