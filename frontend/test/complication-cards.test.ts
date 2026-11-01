// What the Complications list works out about its cards: which designs are
// empty, what a search finds beyond a name, how the device tabs and the designs
// on no device fold, and the device ticks an editor holds until Save.

import { describe, expect, it } from "vitest";
import { COMP_SEARCH_PLACEHOLDER, EMPTY_DESIGN_TEXT, deleteEmptyAsk, deleteEmptyDone, designSearchText, designTextMatches, deviceStripNote, foldShelf, isEmptyDesign, queueAfterFailure, queueDeviceTick, queueOrder, shelfFoldCount, splitPickerTabs } from "../src/complication-cards.js";
import { newConfig } from "../src/model.js";
import type { PickerListRow, PickerTab } from "../src/pickerRows.js";
import { LIBRARY_OWNER_ID } from "../src/version.js";

describe("the words", () => {
  it("say what the mock says, with no dash breaking a sentence", () => {
    expect(COMP_SEARCH_PLACEHOLDER).toBe("Search by name, person or entity");
    expect(EMPTY_DESIGN_TEXT).toBe("Empty, no layers");
    for (const line of [COMP_SEARCH_PLACEHOLDER, EMPTY_DESIGN_TEXT, deleteEmptyAsk(2), deleteEmptyDone(2), deviceStripNote({ queued: 0, on: 0 })]) {
      expect(line).not.toMatch(/ - |–|—/);
    }
  });
});

describe("isEmptyDesign", () => {
  const blank = () => newConfig("Doomed", 0, "rectangular");

  it("calls a design with nothing in it empty", () => {
    expect(isEmptyDesign(blank())).toBe(true);
  });

  it("keeps anything somebody made", () => {
    const withBackground = blank();
    withBackground.perFamily.rectangular!.backgroundColorHex = "#112233";
    expect(isEmptyDesign(withBackground)).toBe(false);

    const withTap = blank();
    withTap.tapAction = { type: "runScene", entityId: "scene.movie", displayName: "Movie", domain: "scene" };
    expect(isEmptyDesign(withTap)).toBe(false);

    const withNotes = blank();
    withNotes.notes = "Set the slot first.";
    expect(isEmptyDesign(withNotes)).toBe(false);
  });

  it("does not call a corner or an Inline line empty, since each is born with text", () => {
    expect(isEmptyDesign(newConfig("Corner", 0, "corner"))).toBe(false);
    expect(isEmptyDesign(newConfig("Line", 0, "inline"))).toBe(false);
  });
});

describe("the search text", () => {
  const doc = {
    name: "Comp 2",
    values: [{ kind: "state", entityId: "sensor.ecobee_temperature", displayName: "My ecobee Current Temperature", domain: "sensor" }],
    elements: [
      { kind: "icon", payload: { symbol: "house.fill" } },
      { kind: "text", payload: { value: { kind: "template", template: "{{ states('light.hue_color_1') }} on" } } },
      { kind: "text", payload: { value: { kind: "literal", text: "Kitchen label" } } },
    ],
    tapAction: { type: "toggleEntity", entityId: "switch.porch", displayName: "", domain: "switch" },
  };

  it("collects entity ids, stored names and templates", () => {
    const text = designSearchText(doc);
    expect(text.entities).toEqual(expect.arrayContaining(["sensor.ecobee_temperature", "switch.porch", "light.hue_color_1"]));
    expect(text.words).toEqual(expect.arrayContaining(["my ecobee current temperature"]));
    expect(text.words.some((w) => w.includes("hue_color_1"))).toBe(true);
  });

  it("leaves out plain labels and icon names", () => {
    const text = designSearchText(doc);
    expect(text.entities).not.toContain("house.fill");
    expect(designTextMatches(text, "kitchen", () => undefined)).toBe(false);
    expect(designTextMatches(text, "house", () => undefined)).toBe(false);
  });

  it("finds a design by id, stored name, template and live name", () => {
    const text = designSearchText(doc);
    expect(designTextMatches(text, "sensor.ecobee", () => undefined)).toBe(true);
    expect(designTextMatches(text, "ecobee current", () => undefined)).toBe(true);
    expect(designTextMatches(text, "hue_color", () => undefined)).toBe(true);
    const friendly = (id: string) => (id === "switch.porch" ? "Porch Fan" : undefined);
    expect(designTextMatches(text, "porch fan", friendly)).toBe(true);
    expect(designTextMatches(text, "garage", friendly)).toBe(false);
    expect(designTextMatches(text, "", friendly)).toBe(false);
  });

  it("reads a document that is not one without complaint", () => {
    expect(designSearchText(undefined)).toEqual({ entities: [], words: [] });
    expect(designSearchText("text")).toEqual({ entities: [], words: [] });
  });
});

describe("splitPickerTabs", () => {
  const tabs: PickerTab[] = [
    { key: "__all__", label: "All", kind: "all", count: 80 },
    { key: "w1", label: "Apple Watch", kind: "watch", count: 23 },
    { key: "w2", label: "Sim", kind: "watch", count: 0 },
    { key: "p1", label: "Chen Phone", kind: "iphone", count: 1 },
    { key: "p2", label: "iPhone 17 Pro", kind: "iphone", count: 0 },
    { key: LIBRARY_OWNER_ID, label: "Not on a device", kind: "library", count: 50 },
  ];

  it("folds the devices holding nothing, and sets the shelf apart", () => {
    const row = splitPickerTabs(tabs, "__all__");
    expect(row.all?.label).toBe("All");
    expect(row.shown.map((t) => t.key)).toEqual(["w1", "p1"]);
    expect(row.more.map((t) => t.key)).toEqual(["w2", "p2"]);
    expect(row.shelf?.label).toBe("Not on a device");
  });

  it("keeps the device on screen in the row whatever it holds", () => {
    const row = splitPickerTabs(tabs, "w2");
    expect(row.shown.map((t) => t.key)).toEqual(["w1", "w2", "p1"]);
    expect(row.more.map((t) => t.key)).toEqual(["p2"]);
  });
});

describe("foldShelf", () => {
  const row = (key: string, ownerId: string): PickerListRow<string> => ({
    key, name: key, copies: [{ ownerId, id: key, item: key }], open: { ownerId, id: key, item: key },
  } as unknown as PickerListRow<string>);
  const rows = [row("a", "w1"), row("e1", LIBRARY_OWNER_ID), row("r1", LIBRARY_OWNER_ID), row("b", "w1"), row("e2", LIBRARY_OWNER_ID)];
  const fold = foldShelf(rows, (r) => r.key.startsWith("e"));

  it("keeps what is on a device apart", () => {
    expect(fold.placed.map((r) => r.key)).toEqual(["a", "b"]);
  });

  it("puts real designs before empty ones", () => {
    expect(fold.shelved.map((r) => r.key)).toEqual(["r1", "e1", "e2"]);
    expect(fold.empty.map((r) => r.key)).toEqual(["e1", "e2"]);
  });

  it("counts the way the closed row says", () => {
    expect(shelfFoldCount(50, 48)).toBe("(50) · 48 empty");
    expect(shelfFoldCount(2, 0)).toBe("(2)");
    expect(deleteEmptyAsk(1)).toBe("Delete 1 empty design?");
    expect(deleteEmptyAsk(48)).toBe("Delete 48 empty designs?");
    expect(deleteEmptyDone(1)).toBe("Deleted 1 empty design.");
    expect(deleteEmptyDone(48)).toBe("Deleted 48 empty designs.");
  });
});

describe("the device ticks that wait for Save", () => {
  it("queues a change, and a tick back takes it out", () => {
    const one = queueDeviceTick(new Map(), "w1", true, false);
    expect([...one]).toEqual([["w1", true]]);
    expect(queueDeviceTick(one, "w1", false, false).size).toBe(0);
  });

  it("leaves the queue it was given alone", () => {
    const start = new Map([["w1", true]]);
    queueDeviceTick(start, "w2", false, true);
    expect(start.size).toBe(1);
  });

  it("runs the devices gained first, so the last copy never goes to the shelf on the way", () => {
    const queue = new Map([["off", false], ["on", true]]);
    expect(queueOrder(queue)).toEqual([["on", true], ["off", false]]);
  });

  it("keeps the tick that failed and the ones not reached, and drops those that landed", () => {
    const run: [string, boolean][] = [["landed", true], ["full", true], ["next", false]];
    expect([...queueAfterFailure(run, 1)]).toEqual([["full", true], ["next", false]]);
    expect([...queueAfterFailure(run, 2)]).toEqual([["next", false]]);
  });

  it("says what the strip is doing", () => {
    expect(deviceStripNote({ queued: 0, on: 2 })).toBe("Changes here apply at once");
    expect(deviceStripNote({ queued: 0, on: 0 })).toBe("On no device yet. Changes here apply at once");
    expect(deviceStripNote({ queued: 1, on: 2 })).toBe("1 change waits for Save");
    expect(deviceStripNote({ queued: 3, on: 2 })).toBe("3 changes wait for Save");
  });
});
