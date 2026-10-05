// The watch's status pages document: the phone's fixtures open and save back
// as the same bytes, the defaults are the table's, the no-record starts, the
// page and row setters, the merge by page id, the draft and its save, and the
// save notes.

import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import type { JsonObject } from "../src/watch-pages/model.js";
import { StatusPagesDraft, saveStatusPagesDraft, startStatusPages, takeStatusPagesRecord, forgetStatusPagesDraft } from "../src/watch-status-pages/draft.js";
import { mergeStatusPages, statusPagesClashes } from "../src/watch-status-pages/merge.js";
import {
  type StatusPagesDocument,
  STATUS_PAGE_KEYS,
  addStatusPage,
  addStatusRow,
  asStatusPagesDocument,
  checkStatusPages,
  findStatusPage,
  findStatusRow,
  isSystemStatusPage,
  moveStatusPage,
  moveStatusRow,
  newStatusDynamicListRow,
  newStatusEntityRow,
  newStatusGroupCountRow,
  newStatusHeaderRow,
  nextStatusPageName,
  removeStatusPage,
  removeStatusRow,
  renameStatusPage,
  resetStatusPageStyle,
  setStatusPageStyle,
  setStatusRowKey,
  statusDeviceClassChoices,
  statusDynamicListTiles,
  statusEntityChoices,
  statusGroupCountPresets,
  statusPageRows,
  statusPageStyleChanged,
  statusPagesDefaults,
  statusPagesEmpty,
  statusPagesOf,
  statusPagesReadMeansUnsupported,
  statusPagesSize,
  statusPagesSummary,
  statusStyleFields,
  statusStyleValue,
} from "../src/watch-status-pages/model.js";
import { statusPagesKeptText, statusPagesSaveNote } from "../src/watch-status-pages/save-note.js";
import defaultsTable from "../src/watch-status-pages/status-page-defaults.json";

const DIR = join(__dirname, "fixtures-status-pages");
const FILES = readdirSync(DIR, { withFileTypes: true }).filter((e) => e.isFile() && e.name.endsWith(".json")).map((e) => e.name).sort();

function read(name: string): { text: string; doc: StatusPagesDocument } {
  const text = readFileSync(join(DIR, name), "utf8");
  return { text, doc: JSON.parse(text) as StatusPagesDocument };
}

function deepFreeze<T>(value: T): T {
  if (typeof value === "object" && value !== null && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as object)) deepFreeze(child);
  }
  return value;
}

/** Ids from a counter, as the phone writes them: upper case. */
function ids(prefix = "AB"): () => string {
  let n = 0;
  return () => `${prefix}000000-0000-4000-8000-${String(++n).padStart(12, "0")}`.toLowerCase();
}

const UUID_UPPER = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/;

describe("the phone's status pages documents", () => {
  it("are there: the defaults, a configured one and an empty one", () => {
    expect(FILES).toEqual(["01-defaults.json", "02-configured.json", "03-empty.json"]);
  });

  for (const file of FILES) {
    describe(file, () => {
      it("saves back as the same bytes with no edit", () => {
        const { text, doc } = read(file);
        const draft = new StatusPagesDraft(asStatusPagesDocument(doc)!, 4);
        expect(draft.dirty).toBe(false);
        expect(draft.document).toBe(doc);
        expect(JSON.stringify(draft.document)).toBe(text.trimEnd());
        expect(statusPagesSize(draft.document)).toBe(Buffer.byteLength(text.trimEnd(), "utf8"));
      });

      it("passes the shape check Home Assistant runs", () => {
        expect(checkStatusPages(read(file).doc)).toEqual([]);
      });

      it("keeps every key it does not model as it came through an edit and its undo", () => {
        const { text, doc } = read(file);
        deepFreeze(doc);
        const draft = new StatusPagesDraft(doc, 1);
        const page = statusPagesOf(doc)[0];
        if (page === undefined) return;
        draft.apply(renameStatusPage(doc, String(page.id), "Changed"));
        expect(draft.dirty).toBe(true);
        draft.undo();
        expect(JSON.stringify(draft.document)).toBe(text.trimEnd());
      });
    });
  }
});

describe("the defaults and the starts", () => {
  it("are the table's document, the five system pages with their fixed ids", () => {
    expect(statusPagesDefaults()).toEqual((defaultsTable as { document: unknown }).document);
    expect(JSON.stringify(statusPagesDefaults())).toBe(read("01-defaults.json").text.trimEnd());
    const pages = statusPagesOf(statusPagesDefaults());
    expect(pages.map((p) => p.id)).toEqual(STATUS_PAGE_KEYS.systemDefaultIds);
    expect(pages.every(isSystemStatusPage)).toBe(true);
    // A fresh copy each call.
    expect(statusPagesDefaults()).not.toBe(statusPagesDefaults());
  });

  it("an empty list is the empty fixture", () => {
    expect(JSON.stringify(statusPagesEmpty())).toBe(read("03-empty.json").text.trimEnd());
  });

  it("start over revision 0, with the defaults or the empty list", async () => {
    const sent: [number, unknown][] = [];
    const ok = await startStatusPages(statusPagesDefaults(), async (base, document) => {
      sent.push([base, document]);
      return { revision: 1 };
    });
    expect(ok).toEqual({ ok: true, revision: 1 });
    expect(sent).toEqual([[0, statusPagesDefaults()]]);
    const empty = await startStatusPages(statusPagesEmpty(), async (base, document) => {
      sent.push([base, document]);
      return { revision: 1 };
    });
    expect(empty.ok).toBe(true);
    expect(sent[1]).toEqual([0, { schemaVersion: 1, statusPages: [] }]);
  });

  it("say why a start was refused", async () => {
    const refuse = (code: string) => async () => {
      throw { code, message: `said ${code}` };
    };
    expect(await startStatusPages(statusPagesEmpty(), refuse("no_record"))).toEqual({ ok: false, code: "no_record", message: "said no_record" });
    expect(await startStatusPages(statusPagesEmpty(), refuse("conflict"))).toMatchObject({ ok: false, code: "conflict" });
    expect(await startStatusPages(statusPagesEmpty(), refuse("unknown_command"))).toMatchObject({ ok: false, code: "unsupported" });
    expect(await startStatusPages(statusPagesEmpty(), refuse("invalid"))).toMatchObject({ ok: false, code: "error", message: "said invalid" });
  });

  it("an integration older than the kind refuses the read", () => {
    expect(statusPagesReadMeansUnsupported({ code: "invalid" })).toBe(true);
    expect(statusPagesReadMeansUnsupported({ code: "unknown_command" })).toBe(true);
    expect(statusPagesReadMeansUnsupported({ code: "timeout" })).toBe(false);
  });

  it("a record with no revision leaves a kept draft as it is, and a read makes one", () => {
    const watch = "SP-TEST-WATCH";
    forgetStatusPagesDraft(watch);
    const first = takeStatusPagesRecord(watch, statusPagesDefaults(), 2);
    expect(first.draft.revision).toBe(2);
    first.draft.apply(renameStatusPage(first.draft.document, STATUS_PAGE_KEYS.systemDefaultIds[0]!, "Mine"));
    const again = takeStatusPagesRecord(watch, statusPagesEmpty(), 0);
    expect(again.draft).toBe(first.draft);
    expect(again.draft.dirty).toBe(true);
    forgetStatusPagesDraft(watch);
  });
});

describe("pages", () => {
  it("are named New Page N as the phone names them", () => {
    expect(nextStatusPageName(statusPagesEmpty())).toBe("New Page 1");
    const named = (...names: string[]) => ({ schemaVersion: 1, statusPages: names.map((name, i) => ({ id: `P${i}`, name, rows: [] })) });
    expect(nextStatusPageName(named("New Page"))).toBe("New Page 2");
    expect(nextStatusPageName(named("New Page 3", "New Page 1", "Lights"))).toBe("New Page 4");
    expect(nextStatusPageName(named("New Page x", "New Page 2b", "New Page"))).toBe("New Page 2");
  });

  it("a new page holds every key at its default, sorted, with an upper case id", () => {
    const { document, id } = addStatusPage(statusPagesEmpty(), ids());
    expect(id).toMatch(UUID_UPPER);
    const page = statusPagesOf(document)[0]!;
    expect(Object.keys(page)).toEqual([...Object.keys(page)].sort());
    expect(page).toMatchObject({ id, name: "New Page 1", rows: [], isSystemDefault: false, schemaVersion: 1, roundNumericValues: true, rowStyle: "plain" });
    // Its keys are those of a page the phone wrote.
    const phonePage = statusPagesOf(read("01-defaults.json").doc)[0]!;
    expect(Object.keys(page)).toEqual(Object.keys(phonePage));
    expect(checkStatusPages(document)).toEqual([]);
  });

  it("rename, move and delete, leaving the document alone when nothing changes", () => {
    const doc = deepFreeze(statusPagesDefaults());
    const [a, b, c] = STATUS_PAGE_KEYS.systemDefaultIds as [string, string, string];
    const renamed = renameStatusPage(doc, a, "Lamps");
    expect(findStatusPage(renamed, a)!.name).toBe("Lamps");
    expect(renameStatusPage(doc, a, "Lights")).toBe(doc);
    const moved = moveStatusPage(doc, c, 0);
    expect(statusPagesOf(moved).map((p) => p.id).slice(0, 3)).toEqual([c, a, b]);
    expect(moveStatusPage(doc, a, 0)).toBe(doc);
    expect(moveStatusPage(doc, "nope", 0)).toBe(doc);
    const removed = removeStatusPage(doc, b);
    expect(statusPagesOf(removed).length).toBe(4);
    expect(findStatusPage(removed, b)).toBeUndefined();
    expect(removeStatusPage(doc, "nope")).toBe(doc);
    // Ids compare ignoring case.
    expect(findStatusPage(doc, a.toLowerCase())).toBeDefined();
  });

  it("style keys hold to their type, cases and steps, and reset to the defaults", () => {
    const doc = deepFreeze(statusPagesDefaults());
    const id = STATUS_PAGE_KEYS.systemDefaultIds[0]!;
    expect(statusStyleFields().map((f) => f.key)).toEqual([
      "rowStyle", "columnLayout", "textSize", "fontWeight", "fontDesign", "iconPosition", "backgroundMaterial", "showDividers", "roundNumericValues", "rowSpacing", "horizontalPadding",
    ]);
    let next = setStatusPageStyle(doc, id, "rowStyle", "pillFilled");
    next = setStatusPageStyle(next, id, "horizontalPadding", 7);
    next = setStatusPageStyle(next, id, "rowSpacing", 40);
    next = setStatusPageStyle(next, id, "showDividers", true);
    expect(setStatusPageStyle(next, id, "rowStyle", "fancy")).toBe(next);
    expect(setStatusPageStyle(next, id, "showDividers", "yes")).toBe(next);
    expect(setStatusPageStyle(next, id, "isSystemDefault", false)).toBe(next);
    const page = findStatusPage(next, id)!;
    expect(page).toMatchObject({ rowStyle: "pillFilled", horizontalPadding: 8, rowSpacing: 12, showDividers: true });
    expect(statusPageStyleChanged(page)).toBe(true);
    const reset = resetStatusPageStyle(next, id);
    expect(statusPageStyleChanged(findStatusPage(reset, id)!)).toBe(false);
    expect(JSON.stringify(reset)).toBe(JSON.stringify(doc));
    // A value the watch cannot read draws as the default.
    const odd = { id: "X", name: "x", rows: [], textSize: "huge", rowSpacing: "3" };
    expect(statusStyleValue(odd, statusStyleFields().find((f) => f.key === "textSize")!)).toBe("medium");
    expect(statusStyleValue(odd, statusStyleFields().find((f) => f.key === "rowSpacing")!)).toBe(2);
  });
});

describe("rows", () => {
  const states = {
    "light.kitchen": { state: "on", attributes: { friendly_name: "Kitchen" } },
    "light.porch": { state: "off", attributes: {} },
    "sensor.door_battery": { state: "15", attributes: { device_class: "battery", friendly_name: "Door Battery" } },
    "sensor.temp": { state: "21", attributes: { device_class: "temperature", friendly_name: "Temp" } },
    "binary_sensor.door": { state: "on", attributes: { device_class: "door", friendly_name: "A Door" } },
  };

  it("are added with an upper case id, as the phone writes each kind", () => {
    const start = addStatusPage(statusPagesEmpty(), ids("CD"));
    const pageId = start.id;
    let doc = start.document;
    const make = ids("EF");
    const add = (row: JsonObject) => {
      const out = addStatusRow(doc, pageId, row, make);
      doc = out.document;
      return out.id!;
    };
    const entity = add(newStatusEntityRow("light.kitchen", states));
    const header = add(newStatusHeaderRow());
    const batteries = statusGroupCountPresets().find((p) => p.label === "Batteries")!;
    const count = add(newStatusGroupCountRow(batteries, ["sensor.door_battery"]));
    const lights = statusGroupCountPresets().find((p) => p.label === "Lights")!;
    const lightCount = add(newStatusGroupCountRow(lights, ["light.kitchen", "light.porch"]));
    const doors = statusDynamicListTiles().find((t) => t.label === "Doors")!;
    const listAll = add(newStatusDynamicListRow(doors));
    const listPicked = add(newStatusDynamicListRow(doors, ["binary_sensor.door"]));
    for (const id of [entity, header, count, lightCount, listAll, listPicked]) expect(id).toMatch(UUID_UPPER);
    const page = findStatusPage(doc, pageId)!;
    const rows = statusPageRows(page);
    for (const row of rows) expect(Object.keys(row)).toEqual([...Object.keys(row)].sort());
    expect(rows[0]).toEqual({ displayName: "Kitchen", domain: "light", entityId: "light.kitchen", iconName: "lightbulb.fill", id: entity, rowType: "entity" });
    expect(rows[1]).toEqual({ displayName: "Header", domain: "", entityId: "", iconName: "line.horizontal.3", id: header, rowType: "sectionHeader" });
    expect(rows[2]).toEqual({
      deviceClassFilter: ["battery"], displayName: "Batteries", domain: "sensor", entityId: "", groupEntityIds: ["sensor.door_battery"],
      iconName: "battery.25percent", id: count, maxNumericValue: 20, rowType: "groupCount",
    });
    expect(rows[3]).not.toHaveProperty("deviceClassFilter");
    expect(rows[4]).toEqual({ deviceClassFilter: ["door"], displayName: "Doors", domain: "binary_sensor", dynamicMode: "all", entityId: "", iconName: "door.left.hand.open", id: listAll, rowType: "dynamicList" });
    expect(rows[5]).toMatchObject({ dynamicMode: "specific", groupEntityIds: ["binary_sensor.door"] });
    expect(checkStatusPages(doc)).toEqual([]);
    expect(addStatusRow(doc, "no-page", newStatusHeaderRow()).document).toBe(doc);
  });

  it("move, set and remove, keeping keys they do not model", () => {
    const { doc } = read("02-configured.json");
    deepFreeze(doc);
    const page = statusPagesOf(doc)[0]!;
    const pageId = String(page.id);
    const [first, second] = statusPageRows(page).map((r) => String(r.id)) as [string, string];
    const moved = moveStatusRow(doc, pageId, first, 1);
    expect(statusPageRows(findStatusPage(moved, pageId)!).map((r) => r.id).slice(0, 2)).toEqual([second, first]);
    expect(moveStatusRow(doc, pageId, first, 0)).toBe(doc);
    const hidden = setStatusRowKey(doc, pageId, second, "isHidden", true);
    expect(findStatusRow(findStatusPage(hidden, pageId), second)).toMatchObject({ isHidden: true });
    // A new key goes in at its sorted place.
    expect(Object.keys(findStatusRow(findStatusPage(hidden, pageId), second)!)).toEqual([...Object.keys(findStatusRow(findStatusPage(hidden, pageId), second)!)].sort());
    const cleared = setStatusRowKey(doc, pageId, "5A7E0000-0000-4000-9000-000000000005", "maxNumericValue", undefined);
    expect(findStatusRow(findStatusPage(cleared, pageId), "5A7E0000-0000-4000-9000-000000000005")).not.toHaveProperty("maxNumericValue");
    expect(setStatusRowKey(doc, pageId, second, "displayName", undefined)).toBe(doc);
    expect(setStatusRowKey(doc, pageId, second, "headerAlignment", "middle")).toBe(doc);
    expect(setStatusRowKey(doc, pageId, second, "isHidden", "yes")).toBe(doc);
    expect(setStatusRowKey(doc, pageId, second, "rowType", "groupCount")).toBe(doc);
    // An entity row's Entity field moves it to another entity and domain;
    // neither can be removed, as the app requires both.
    const repointed = setStatusRowKey(setStatusRowKey(doc, pageId, second, "entityId", "lock.front_door"), pageId, second, "domain", "lock");
    expect(findStatusRow(findStatusPage(repointed, pageId), second)).toMatchObject({ entityId: "lock.front_door", domain: "lock" });
    expect(setStatusRowKey(doc, pageId, second, "entityId", undefined)).toBe(doc);
    expect(setStatusRowKey(doc, pageId, second, "domain", undefined)).toBe(doc);
    const removed = removeStatusRow(doc, pageId, first);
    expect(statusPageRows(findStatusPage(removed, pageId)!).length).toBe(statusPageRows(page).length - 1);
    // The other pages are the same objects.
    expect(statusPagesOf(removed)[1]).toBe(statusPagesOf(doc)[1]);
  });

  it("offer the entities of their domain and classes, sensors with binary sensors", () => {
    expect(statusEntityChoices("light", undefined, states)).toEqual(["light.kitchen", "light.porch"]);
    expect(statusEntityChoices("sensor", ["battery"], states)).toEqual(["sensor.door_battery"]);
    expect(statusEntityChoices("binary_sensor", undefined, states)).toEqual(["binary_sensor.door", "sensor.door_battery", "sensor.temp"]);
    expect(statusEntityChoices("light", undefined, states, ["light.gone"])).toContain("light.gone");
    expect(statusDeviceClassChoices("sensor", states, ["energy"])).toEqual(["battery", "energy", "temperature"]);
  });

  it("the add lists are the phone's", () => {
    expect(statusGroupCountPresets().length).toBe(28);
    expect(statusDynamicListTiles().length).toBe(27);
  });
});

describe("the shape check", () => {
  it("names what Home Assistant would refuse", () => {
    expect(checkStatusPages([])).toEqual(["The status pages are not an object."]);
    expect(checkStatusPages({})).toEqual(["The status page list is missing."]);
    const bad = {
      statusPages: [
        { id: "A", name: "One", rows: [{ id: "R" }, { id: "r" }] },
        { id: "a", name: "Two", rows: [] },
        { name: "Three", rows: [{}] },
        { id: "C", rows: "x" },
      ],
    };
    expect(checkStatusPages(bad)).toEqual([
      'Two rows of "One" share an id.',
      '"Two" has the id of another page.',
      '"Three" has no id.',
      'A row of "Three" has no id.',
      "Status page 4 has no name.",
      "Status page 4 has no row list.",
    ]);
  });

  it("a restore says how many pages and rows", () => {
    expect(statusPagesSummary(statusPagesDefaults())).toBe("5 status pages, 5 rows in all.");
    expect(statusPagesSummary(undefined)).toBe("0 status pages, 0 rows in all.");
  });
});

// ── the merge ────────────────────────────────────────────────────────────

function page(id: string, name: string, extra: JsonObject = {}): JsonObject {
  return { id, name, rows: [], ...extra };
}

function doc(...pages: JsonObject[]): StatusPagesDocument {
  return { schemaVersion: 1, statusPages: pages };
}

const names = (d: StatusPagesDocument) => statusPagesOf(d).map((p) => `${String(p.id)}:${String(p.name)}`);

describe("the merge by page id", () => {
  const base = deepFreeze(doc(page("A", "a"), page("B", "b"), page("C", "c")));

  it("takes each side's change to a page the other left alone", () => {
    const local = doc(page("A", "a2"), page("B", "b"), page("C", "c"));
    const server = doc(page("A", "a"), page("B", "b"), page("C", "c3"));
    expect(names(mergeStatusPages(base, local, server))).toEqual(["A:a2", "B:b", "C:c3"]);
    expect(statusPagesClashes(base, local, server)).toEqual([]);
  });

  it("keeps the server's whole page when both changed it, and names it", () => {
    const local = doc(page("A", "mine", { rowStyle: "pillFilled" }), page("B", "b"), page("C", "c"));
    const server = doc(page("A", "theirs"), page("B", "b"), page("C", "c"));
    const merged = mergeStatusPages(base, local, server);
    expect(names(merged)).toEqual(["A:theirs", "B:b", "C:c"]);
    expect(statusPagesOf(merged)[0]).not.toHaveProperty("rowStyle");
    expect(statusPagesClashes(base, local, server)).toEqual([{ id: "A", name: "theirs" }]);
  });

  it("both making the same change is no clash", () => {
    const same = doc(page("A", "same"), page("B", "b"), page("C", "c"));
    expect(statusPagesClashes(base, same, structuredClone(same))).toEqual([]);
  });

  it("deletes and adds on either side; a delete against a change keeps the server's", () => {
    const local = doc(page("A", "a"), page("C", "c"), page("D", "new here"));
    const server = doc(page("A", "a"), page("B", "b"), page("C", "c"), page("E", "new there"));
    expect(names(mergeStatusPages(base, local, server))).toEqual(["A:a", "C:c", "D:new here", "E:new there"]);
    // The draft removed B while the iPhone changed it: the iPhone's B stays.
    const changedThere = doc(page("A", "a"), page("B", "b2"), page("C", "c"));
    expect(names(mergeStatusPages(base, local, changedThere))).toEqual(["A:a", "B:b2", "C:c", "D:new here"]);
    expect(statusPagesClashes(base, local, changedThere)).toEqual([{ id: "B", name: "b2" }]);
    // The iPhone removed C while the draft changed it: gone, and named.
    const removedThere = doc(page("A", "a"), page("B", "b"));
    const changedHere = doc(page("A", "a"), page("B", "b"), page("C", "c4"));
    expect(names(mergeStatusPages(base, changedHere, removedThere))).toEqual(["A:a", "B:b"]);
    expect(statusPagesClashes(base, changedHere, removedThere)).toEqual([{ id: "C", name: "c4" }]);
  });

  it("follows the draft's order when the draft moved pages, else the server's", () => {
    const moved = doc(page("C", "c"), page("A", "a"), page("B", "b"));
    const serverMoved = doc(page("B", "b"), page("A", "a"), page("C", "c"), page("E", "e"));
    expect(names(mergeStatusPages(base, moved, doc(page("A", "a"), page("B", "b2"), page("C", "c"))))).toEqual(["C:c", "A:a", "B:b2"]);
    expect(names(mergeStatusPages(base, doc(page("A", "a2"), page("B", "b"), page("C", "c")), serverMoved))).toEqual(["B:b", "A:a2", "C:c", "E:e"]);
  });

  it("merges every other top-level key by key, and gives a side back when it is the result", () => {
    const local = { ...doc(page("A", "a"), page("B", "b"), page("C", "c")), newKey: 1 };
    const server = { ...doc(page("A", "a"), page("B", "b"), page("C", "c2")), schemaVersion: 2 };
    const merged = mergeStatusPages(base, local, server);
    expect(merged).toMatchObject({ schemaVersion: 2, newKey: 1 });
    expect(names(merged)).toEqual(["A:a", "B:b", "C:c2"]);
    const untouched = doc(page("A", "a"), page("B", "b"), page("C", "c"));
    const theirs = doc(page("A", "a"), page("B", "b9"), page("C", "c"));
    expect(mergeStatusPages(base, untouched, theirs)).toBe(theirs);
  });

  it("with no base keeps the server's version of every page the two hold differently", () => {
    const merged = mergeStatusPages(undefined, doc(page("A", "mine"), page("X", "only mine")), doc(page("A", "theirs")));
    expect(names(merged)).toEqual(["A:theirs", "X:only mine"]);
  });
});

describe("the draft and its save", () => {
  const base = () => doc(page("A", "a"), page("B", "b"));

  it("rebases its edits onto a newer server copy; a page both changed is the server's", () => {
    const draft = new StatusPagesDraft(base(), 3);
    draft.apply(renameStatusPage(draft.document, "A", "mine"));
    draft.apply(renameStatusPage(draft.document, "B", "mine too"));
    const changed = draft.rebase(doc(page("A", "theirs"), page("B", "b")), 4);
    expect(changed).toBe(true);
    expect(names(draft.document)).toEqual(["A:theirs", "B:mine too"]);
    expect(draft.kept).toEqual([{ id: "A", name: "theirs" }]);
    expect(draft.revision).toBe(4);
    // Undo walks back over the merged steps, never over the server's change.
    draft.undo();
    expect(names(draft.document)).toEqual(["A:theirs", "B:b"]);
  });

  it("a conflict reads, merges and saves again, and the note names the page kept", async () => {
    const draft = new StatusPagesDraft(base(), 3);
    draft.apply(renameStatusPage(draft.document, "A", "mine"));
    draft.apply(renameStatusPage(draft.document, "B", "renamed"));
    let calls = 0;
    const sent: unknown[] = [];
    const result = await saveStatusPagesDraft(draft, {
      save: async (rev, document) => {
        calls++;
        if (calls === 1) throw { code: "conflict", message: "newer" };
        sent.push([rev, document]);
        return { revision: rev + 1 };
      },
      fetch: async () => ({ revision: 5, document: doc(page("A", "theirs"), page("B", "b")) }),
    });
    expect(result).toMatchObject({ ok: true, revision: 6, merged: true, kept: [{ id: "A", name: "theirs" }] });
    expect(sent).toEqual([[5, doc(page("A", "theirs"), page("B", "renamed"))]]);
    expect(draft.dirty).toBe(false);
    expect(statusPagesSaveNote(result)).toEqual({ kind: "warn", text: 'Saved. The iPhone also changed "theirs". The iPhone\'s version was kept.' });
  });

  it("does not send what Home Assistant would refuse, and one save runs at a time", async () => {
    const draft = new StatusPagesDraft(base(), 1);
    draft.apply({ schemaVersion: 1, statusPages: [page("A", "a"), page("a", "dup")] });
    const result = await saveStatusPagesDraft(draft, { save: async () => ({ revision: 2 }), fetch: async () => ({ revision: 1, document: base() }) });
    expect(result).toMatchObject({ ok: false, code: "invalid" });
    expect(statusPagesSaveNote(result)!.text).toBe('Not saved. Something in the status pages is not right: "dup" has the id of another page.');
    const ok = new StatusPagesDraft(base(), 1);
    ok.apply(renameStatusPage(ok.document, "A", "x"));
    let release!: () => void;
    const first = saveStatusPagesDraft(ok, { save: () => new Promise((r) => { release = () => r({ revision: 2 }); }), fetch: async () => ({ revision: 1, document: base() }) });
    const second = await saveStatusPagesDraft(ok, { save: async () => ({ revision: 9 }), fetch: async () => ({ revision: 1, document: base() }) });
    expect(second).toMatchObject({ ok: false, code: "busy" });
    release();
    expect(await first).toMatchObject({ ok: true, revision: 2 });
  });
});

describe("the save notes", () => {
  it("say nothing for a plain save, and name what happened otherwise", () => {
    expect(statusPagesSaveNote({ ok: true, revision: 2, merged: false })).toBeUndefined();
    expect(statusPagesSaveNote({ ok: true, revision: 2, merged: true })!.text).toBe("Saved. Changes from the iPhone were merged in.");
    expect(statusPagesSaveNote({ ok: true, revision: 7, merged: true, alreadySaved: true })!.text).toBe("Nothing left to save. The iPhone saved the same changes, as revision 7.");
    expect(statusPagesSaveNote({ ok: false, revision: 2, merged: false, code: "no_record" })!.kind).toBe("warn");
    expect(statusPagesSaveNote({ ok: false, revision: 2, merged: false, code: "boom", message: "it broke" })).toEqual({ kind: "err", text: "Not saved: it broke" });
  });

  it("name several kept pages in one line", () => {
    expect(statusPagesKeptText([{ id: "A", name: "House" }, { id: "B", name: "" }, { id: "C", name: "Lights" }]))
      .toBe('The iPhone also changed "House", a status page and "Lights". The iPhone\'s versions were kept.');
    expect(statusPagesKeptText([])).toBe("");
  });

  it("never use a spaced hyphen or a dash to break a sentence", () => {
    const texts = [
      statusPagesKeptText([{ id: "A", name: "x" }]),
      ...["conflict", "no_record", "invalid", "busy", "unavailable", "x"].map((code) => statusPagesSaveNote({ ok: false, revision: 1, merged: false, code })!.text),
    ];
    for (const t of texts) expect(t).not.toMatch(/ - |—|–/);
  });
});
