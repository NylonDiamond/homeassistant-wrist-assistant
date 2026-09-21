// The one-time split of a multi-shape complication into one document per
// shape. See src/splitShapes.ts and, in the app repo,
// docs/complication_one_shape_per_document.md, "Migration".
//
// The multi-shape fixtures under test/fixtures are the input: they are the
// real documents the panel has been writing, byte for byte, so a split that
// works on them works on what people actually have.

import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  type CustomComplicationConfig,
  encodeConfig,
  ownedElements,
  parseConfig,
} from "../src/model.js";
import { supportedFamilies } from "../src/layouts.js";
import type { ComplicationRecord, HassLike, OwnerSummary } from "../src/ha-api.js";
import {
  type SplitNotice,
  SPLIT_GATE,
  autoSplitShapes,
  childFamily,
  documentParts,
  editBlockedBySplitGate,
  needsSplit,
  normalizedForSplit,
  ownerCanSplit,
  planFor,
  splitDocument,
  splitLine,
  splitOwner,
  targetsIn,
} from "../src/splitShapes.js";

// ── the fixtures ──────────────────────────────────────────────────────────

const dir = join(__dirname, "fixtures");

function fixture(name: string): CustomComplicationConfig {
  return parseConfig(JSON.parse(readFileSync(join(dir, name), "utf8")).config);
}

function rawFixture(name: string): Record<string, unknown> {
  return JSON.parse(readFileSync(join(dir, name), "utf8")).config as Record<string, unknown>;
}

/** Every fixture whose document draws more than one thing. */
const multiShapeFixtures = readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .filter((f) => {
    try {
      return needsSplit(fixture(f));
    } catch {
      return false;
    }
  });

/** New ids that read as new ids in a failure message, and never collide. */
function counter(prefix = "NEW"): () => string {
  let n = 0;
  return () => `${prefix}-${++n}`;
}

it("finds the multi-shape fixtures to split", () => {
  // A guard on the guard: if the fixtures are ever all single-shape, every
  // test below would pass by drawing no conclusions.
  expect(multiShapeFixtures.length).toBeGreaterThan(10);
  expect(multiShapeFixtures).toContain("living_room.json");
  expect(multiShapeFixtures).toContain("control.json");
  expect(multiShapeFixtures).toContain("single_shape_inline.json");
});

// ── what counts as a split ────────────────────────────────────────────────

describe("documentParts", () => {
  it("counts one per shape and one for the control", () => {
    expect(documentParts(fixture("living_room.json"))).toBe(3);
    expect(documentParts(fixture("home_screen_four_sizes.json"))).toBe(5);
    // A shape and a control is two documents, not one.
    expect(documentParts(fixture("control.json"))).toBe(2);
    expect(documentParts(fixture("control_only.json"))).toBe(1);
  });

  it("leaves a one-shape document alone", () => {
    expect(needsSplit(fixture("control_only.json"))).toBe(false);
    expect(planFor(fixture("control_only.json"))).toBe("none");
  });

  // A one-shape record's `linkId` is the link to the same design on another
  // device, which the panel writes on purpose. This run leaves it alone.
  it("leaves a one-shape document with a linkId alone", () => {
    const cfg = { ...fixture("control_only.json"), linkId: "AAAAAAAA-0000-4000-8000-00000000000A" };
    expect(planFor(cfg)).toBe("none");
  });
});

// ── the cut ───────────────────────────────────────────────────────────────

describe("splitDocument", () => {
  it.each(multiShapeFixtures)("gives every child of %s exactly one shape", (name) => {
    const parent = fixture(name);
    const children = splitDocument(parent, counter());
    expect(children).toHaveLength(documentParts(parent));
    const shapes = supportedFamilies(parent);
    shapes.forEach((family, i) => {
      expect(children[i]!.supportedFamilies).toEqual([family]);
      expect(childFamily(children[i]!)).toBe(family);
    });
    if (parent.control !== undefined) {
      const last = children[children.length - 1]!;
      expect(last.supportedFamilies).toEqual([]);
      expect(last.control).toEqual(parent.control);
      expect(childFamily(last)).toBeUndefined();
    }
  });

  it.each(multiShapeFixtures)("gives every child of %s the layers its shape owns", (name) => {
    const parent = fixture(name);
    const children = splitDocument(parent, counter());
    // Ownership is settled before the cut, because a document written before
    // per-shape ownership has one layer that several shapes all draw and the
    // cut has to give each of them a copy. The layers a shape ends up owning
    // are counted off the model's own heal rather than off the split's idea
    // of it; the copies get fresh ids, so the count is the comparable part
    // and the exact ids are checked below on a document that needs no heal.
    const settled = normalizedForSplit(parent);
    supportedFamilies(settled).forEach((family, i) => {
      const child = children[i]!;
      expect(child.elements).toHaveLength(
        family === "inline" ? 0 : ownedElements(settled, family).length,
      );
      // Nothing in the child belongs to any shape but the child's own.
      if (family !== "inline") {
        expect(ownedElements(child, family)).toHaveLength(child.elements.length);
      }
      expect(Object.keys(child.perFamily)).toEqual(family === "inline" ? [] : [family]);
    });
    // Nothing is lost: every layer the settled parent had is on exactly one
    // child, since each belongs to exactly one shape.
    const total = children.reduce((n, c) => n + c.elements.length, 0);
    expect(total).toBe(settled.elements.length);
  });

  it("moves each layer to the child of the shape that owned it, by id", () => {
    // A document whose ownership is already settled, so no layer is copied
    // and every id can be followed from the parent to the child.
    const parent = fixture("living_room.json");
    const settled = normalizedForSplit(parent);
    const children = splitDocument(settled, counter());
    supportedFamilies(settled).forEach((family, i) => {
      expect(children[i]!.elements.map((el) => el.payload.id)).toEqual(
        ownedElements(settled, family).map((el) => el.payload.id),
      );
    });
  });

  it("keeps the rules of each shape with that shape and no other", () => {
    const parent = fixture("rules.json");
    const children = splitDocument(parent, counter());
    supportedFamilies(parent).forEach((family, i) => {
      if (family === "inline") return;
      expect(children[i]!.perFamily[family]!.rules).toEqual(parent.perFamily[family]!.rules);
    });
  });

  it("puts inline on the inline child alone", () => {
    const parent = fixture("single_shape_inline.json");
    expect(parent.inline).toBeDefined();
    const children = splitDocument(parent, counter());
    expect(children.map((c) => c.supportedFamilies)).toEqual([["rectangular"], ["inline"]]);
    expect(children[0]!.inline).toBeUndefined();
    expect(children[1]!.inline).toEqual(parent.inline);
  });

  it("gives the first shape in family order the record id and the rest new ones", () => {
    const parent = fixture("text_arc.json");
    expect(supportedFamilies(parent)).toEqual(["rectangular", "circular", "small"]);
    const children = splitDocument(parent, counter());
    expect(children.map((c) => c.id)).toEqual([parent.id, "NEW-1", "NEW-2"]);
  });

  it("orders the children by the canonical family order, not the document's", () => {
    const parent = fixture("living_room.json");
    // The stored order happens to be canonical already, so scramble it and
    // prove the cut does not follow the document.
    parent.supportedFamilies = ["corner", "rectangular", "circular"];
    expect(splitDocument(parent, counter()).map((c) => c.supportedFamilies)).toEqual([
      ["rectangular"],
      ["circular"],
      ["corner"],
    ]);
  });

  it("makes a control its own document and takes it off every shape", () => {
    const parent = fixture("control.json");
    const children = splitDocument(parent, counter());
    expect(children).toHaveLength(2);
    expect(children[0]!.id).toBe(parent.id);
    expect(children[0]!.supportedFamilies).toEqual(["circular"]);
    expect(children[0]!.control).toBeUndefined();
    const control = children[1]!;
    expect(control.id).toBe("NEW-1");
    expect(control.supportedFamilies).toEqual([]);
    expect(control.perFamily).toEqual({});
    // A control has no canvas, so no layer rides along on it.
    expect(control.elements).toEqual([]);
    expect(control.groups).toBeUndefined();
    expect(control.control).toEqual(parent.control);
    // It is still a document the store will take.
    expect(encodeConfig(control).supportedFamilies).toEqual([]);
  });

  it.each(multiShapeFixtures)("keeps the whole envelope of %s on every child", (name) => {
    const parent = fixture(name);
    for (const child of splitDocument(parent, counter())) {
      expect(child.name).toBe(parent.name);
      expect(child.slotIndex).toBe(parent.slotIndex);
      expect(child.hidden).toEqual(parent.hidden);
      expect(child.dataSources).toEqual(parent.dataSources);
      expect(child.refreshMinutes).toEqual(parent.refreshMinutes);
      expect(child.tapAction).toEqual(parent.tapAction);
      expect(child.pages).toEqual(parent.pages);
    }
  });

  it("keeps the hidden flag rather than showing a hidden complication again", () => {
    const parent = fixture("hidden_complication.json");
    expect(parent.hidden).toBe(true);
    for (const child of splitDocument(parent, counter())) expect(child.hidden).toBe(true);
  });

  it("writes no linkId on any child", () => {
    expect(rawFixture("linked_complication.json").linkId).toBeDefined();
    const parent = fixture("linked_complication.json");
    for (const child of splitDocument(parent, counter())) {
      expect("linkId" in encodeConfig(child)).toBe(false);
    }
  });

  it("never touches the document it was handed", () => {
    const parent = fixture("living_room.json");
    const before = JSON.stringify(encodeConfig(parent));
    splitDocument(parent, counter());
    expect(JSON.stringify(encodeConfig(parent))).toBe(before);
  });

  it("hands back a one-shape document as itself", () => {
    const parent = fixture("control_only.json");
    const children = splitDocument(parent, counter());
    expect(children).toHaveLength(1);
    expect(children[0]!.id).toBe(parent.id);
    expect("linkId" in encodeConfig(children[0]!)).toBe(false);
    expect(children[0]!.control).toEqual(parent.control);
  });
});

// ── the gate ──────────────────────────────────────────────────────────────

function ownerRow(over: Partial<OwnerSummary> = {}): OwnerSummary {
  return {
    owner_watch_id: "watch-1",
    device_name: "Jesse's Watch",
    device_kind: "watch",
    paired_iphone_name: null,
    app_version: SPLIT_GATE.version,
    app_build: String(SPLIT_GATE.build),
    screen_size: null,
    complication_count: 0,
    token: 1,
    is_orphan: false,
    ...over,
  };
}

describe("ownerCanSplit", () => {
  it("is the 2.8.0 build 11 line", () => {
    expect(SPLIT_GATE).toEqual({ version: "2.8.0", build: 11 });
  });

  it("refuses a version below the line", () => {
    expect(ownerCanSplit(ownerRow({ app_version: "2.7.9", app_build: "99" }))).toBe(false);
  });

  it("refuses the gate version on an earlier build", () => {
    expect(ownerCanSplit(ownerRow({ app_version: "2.8.0", app_build: "10" }))).toBe(false);
  });

  it("allows the gate version on the gate build", () => {
    expect(ownerCanSplit(ownerRow({ app_version: "2.8.0", app_build: "11" }))).toBe(true);
  });

  it("allows a later build of the gate version", () => {
    expect(ownerCanSplit(ownerRow({ app_version: "2.8.0", app_build: "12" }))).toBe(true);
  });

  it("allows a later version whatever its build, since builds restart", () => {
    expect(ownerCanSplit(ownerRow({ app_version: "2.9.0", app_build: "1" }))).toBe(true);
  });

  it("refuses an owner that never reported a version", () => {
    expect(ownerCanSplit(ownerRow({ app_version: null, app_build: null }))).toBe(false);
    expect(ownerCanSplit(ownerRow({ app_version: "2.8.0", app_build: null }))).toBe(false);
    // An orphan: no entry left to ask.
    expect(ownerCanSplit(ownerRow({ device_kind: null, app_version: null, is_orphan: true }))).toBe(false);
    expect(ownerCanSplit(undefined)).toBe(false);
  });

  it("refuses an integration too old to send the build", () => {
    const row = ownerRow({ app_version: "2.8.0" });
    delete row.app_build;
    expect(ownerCanSplit(row)).toBe(false);
  });

  it("always splits the library, which has no app behind it", () => {
    expect(ownerCanSplit(ownerRow({
      owner_watch_id: "library",
      device_kind: "library",
      device_name: "Library",
      app_version: null,
      app_build: null,
    }))).toBe(true);
  });
});

describe("editBlockedBySplitGate", () => {
  const multi = fixture("living_room.json");
  const single = fixture("control_only.json");

  it("says nothing about a document that is already one shape", () => {
    expect(editBlockedBySplitGate(single, ownerRow({ app_version: "2.7.0" }))).toBeUndefined();
  });

  it("says nothing on a device that is new enough", () => {
    expect(editBlockedBySplitGate(multi, ownerRow())).toBeUndefined();
  });

  it("names the watch app on a watch", () => {
    expect(editBlockedBySplitGate(multi, ownerRow({ app_version: "2.7.0" })))
      .toBe("Update the watch app to edit this complication.");
  });

  it("names the iPhone app on a phone", () => {
    expect(editBlockedBySplitGate(multi, ownerRow({ device_kind: "iphone", app_version: "2.7.0" })))
      .toBe("Update the iPhone app to edit this complication.");
  });
});

// ── the run ───────────────────────────────────────────────────────────────

const D = "wrist_assistant/complications";

interface Row {
  record: ComplicationRecord;
  /** Every document a save replaced, under the revision it was saved as, the
   * way `ComplicationStore._remember` files them. */
  history: Map<number, Record<string, unknown>>;
}

interface FakeOptions {
  /** Raw stored documents per owner id, exactly as they sit on disk. */
  documents: Record<string, Record<string, unknown>[]>;
  /** Owner ids whose history command fails. */
  noHistory?: string[];
  /** Owner ids whose save is refused. */
  noSave?: string[];
  admin?: boolean;
}

interface Fake {
  hass: HassLike;
  sent: Record<string, unknown>[];
  rows: Record<string, Row[]>;
  live(owner: string): Record<string, unknown>[];
  document(owner: string, id: string): Record<string, unknown> | null | undefined;
}

/** A store that keeps save history the way the integration's does, so an Undo
 * can be asked to put a document back and checked byte for byte. */
function fakeHass(options: FakeOptions): Fake {
  const sent: Record<string, unknown>[] = [];
  const rows: Record<string, Row[]> = {};
  for (const [owner, documents] of Object.entries(options.documents)) {
    rows[owner] = documents.map((document, i) => ({
      record: {
        id: String(document.id),
        ownerWatchId: owner,
        revision: 3,
        token: 10 + i,
        updatedAt: "2026-09-20T00:00:00+00:00",
        updatedBy: "ha-panel:Jesse",
        deleted: false,
        document: structuredClone(document),
      },
      history: new Map(),
    }));
  }
  const find = (owner: string, id: string) =>
    (rows[owner] ?? []).find((r) => r.record.id.toUpperCase() === String(id).toUpperCase());

  const hass = {
    user: { is_admin: options.admin !== false },
    states: {},
    connection: {
      async sendMessagePromise<T>(message: Record<string, unknown>): Promise<T> {
        sent.push(structuredClone(message));
        const owner = String(message.owner_watch_id ?? "");
        switch (message.type) {
          case `${D}/list`:
            return { records: (rows[owner] ?? []).map((r) => ({ ...r.record })), token: 1, max_schema_version: 9 } as T;
          case `${D}/history`: {
            if (options.noHistory?.includes(owner)) throw new Error("history unavailable");
            const row = find(owner, String(message.complication_id));
            if (!row) throw new Error("not_found");
            return {
              owner_watch_id: owner,
              complication_id: row.record.id,
              revision: row.record.revision,
              entries: [...row.history.keys()].map((revision) => ({ revision })),
            } as T;
          }
          case `${D}/save`: {
            if (options.noSave?.includes(owner)) return { ok: false, error: "conflict", message: "the save was refused" } as T;
            const document = structuredClone(message.document as Record<string, unknown>);
            const row = find(owner, String(document.id));
            if (!row) {
              if (message.base_revision !== null && message.base_revision !== 0) {
                return { ok: false, error: "conflict", message: "no stored revision to base this save on" } as T;
              }
              const created: Row = {
                record: {
                  id: String(document.id),
                  ownerWatchId: owner,
                  revision: 1,
                  token: 99,
                  updatedAt: "2026-09-20T00:00:00+00:00",
                  updatedBy: "ha-panel:Jesse",
                  deleted: false,
                  document,
                },
                history: new Map(),
              };
              rows[owner] = [...(rows[owner] ?? []), created];
              return { ok: true, record: { ...created.record } } as T;
            }
            if (message.base_revision !== row.record.revision) {
              return { ok: false, error: "conflict", message: "stale revision" } as T;
            }
            if (row.record.document) row.history.set(row.record.revision, row.record.document);
            row.record = { ...row.record, revision: row.record.revision + 1, deleted: false, document };
            return { ok: true, record: { ...row.record } } as T;
          }
          case `${D}/history_restore`: {
            const row = find(owner, String(message.complication_id));
            if (!row) throw new Error("not_found");
            if (message.base_revision !== row.record.revision) {
              return { ok: false, error: "conflict", message: "stale revision" } as T;
            }
            const wanted = row.history.get(Number(message.revision));
            if (!wanted) return { ok: false, error: "not_found", message: "no such revision" } as T;
            if (row.record.document) row.history.set(row.record.revision, row.record.document);
            row.record = { ...row.record, revision: row.record.revision + 1, document: structuredClone(wanted) };
            return { ok: true, record: { ...row.record }, restored_revision: Number(message.revision) } as T;
          }
          case `${D}/delete`: {
            const row = find(owner, String(message.complication_id));
            if (!row) throw new Error("not_found");
            if (message.base_revision !== null && message.base_revision !== row.record.revision) {
              return { ok: false, error: "conflict", message: "stale revision" } as T;
            }
            row.record = { ...row.record, revision: row.record.revision + 1, deleted: true, document: null };
            return { ok: true, record: { ...row.record } } as T;
          }
          default:
            throw new Error(`unexpected ${String(message.type)}`);
        }
      },
      async subscribeMessage() {
        return async () => {};
      },
    },
  } as unknown as HassLike;

  return {
    hass,
    sent,
    rows,
    live: (owner) =>
      (rows[owner] ?? [])
        .filter((r) => !r.record.deleted && r.record.document)
        .map((r) => r.record.document as Record<string, unknown>),
    document: (owner, id) => find(owner, id)?.record.document,
  };
}

/** sessionStorage, which the once-per-owner marker reads. Each test gets a
 * fresh one so a marker from the last test cannot silence this one. */
function freshSessionStorage(): void {
  const data = new Map<string, string>();
  (globalThis as { sessionStorage?: Storage }).sessionStorage = {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (k: string) => data.get(k) ?? null,
    key: (i: number) => [...data.keys()][i] ?? null,
    removeItem: (k: string) => data.delete(k),
    setItem: (k: string, v: string) => {
      data.set(k, v);
    },
  } as Storage;
}

describe("targetsIn", () => {
  it("skips a deleted record and one this panel cannot read", () => {
    const fake = fakeHass({ documents: { "watch-1": [rawFixture("living_room.json")] } });
    const records = [
      { ...fake.rows["watch-1"]![0]!.record },
      { ...fake.rows["watch-1"]![0]!.record, id: "GONE", deleted: true, document: null },
      { ...fake.rows["watch-1"]![0]!.record, id: "JUNK", document: { nope: true } },
    ];
    const found = targetsIn(records);
    expect(found.split.map((t) => t.record.id)).toEqual([String(rawFixture("living_room.json").id)]);
  });
});

describe("splitOwner", () => {
  it("writes the parent first, then one new record per extra shape", async () => {
    const raw = rawFixture("living_room.json");
    const fake = fakeHass({ documents: { "watch-1": [raw] } });
    const result = await splitOwner(fake.hass, ownerRow(), fake.rows["watch-1"]!.map((r) => r.record), counter());

    expect(result.problem).toBeUndefined();
    expect(result.split).toEqual(["Living Room"]);
    expect(result.writes.map((w) => [w.kind, w.id])).toEqual([
      ["parent", String(raw.id)],
      ["child", "NEW-1"],
      ["child", "NEW-2"],
    ]);
    // The parent's save is based on the revision it was read at, which is what
    // files the pre-split document as the revision Undo restores.
    expect(result.writes[0]!.previous).toBe(3);
    const saves = fake.sent.filter((m) => m.type === `${D}/save`);
    expect(saves.map((m) => m.base_revision)).toEqual([3, null, null]);
    expect(fake.live("watch-1").map((d) => d.supportedFamilies)).toEqual([
      ["rectangular"],
      ["circular"],
      ["corner"],
    ]);
  });

  it("writes nothing at all when one record's history cannot be read", async () => {
    const fake = fakeHass({
      documents: { "watch-1": [rawFixture("living_room.json"), rawFixture("rules.json")] },
      noHistory: ["watch-1"],
    });
    const result = await splitOwner(fake.hass, ownerRow(), fake.rows["watch-1"]!.map((r) => r.record), counter());
    expect(result.writes).toEqual([]);
    expect(result.split).toEqual([]);
    expect(result.problem).toContain("its save history could not be read");
    expect(fake.sent.filter((m) => m.type === `${D}/save`)).toEqual([]);
  });

  it("writes nothing when a record moved on the server while it was reading", async () => {
    const fake = fakeHass({ documents: { "watch-1": [rawFixture("living_room.json")] } });
    const stale = fake.rows["watch-1"]!.map((r) => ({ ...r.record, revision: 2 }));
    const result = await splitOwner(fake.hass, ownerRow(), stale, counter());
    expect(result.writes).toEqual([]);
    expect(result.problem).toContain("it changed on the server while the panel was reading it");
  });

  it("reports a refused save and leaves the writes it did for Undo", async () => {
    const fake = fakeHass({ documents: { "watch-1": [rawFixture("living_room.json")] }, noSave: ["watch-1"] });
    const result = await splitOwner(fake.hass, ownerRow(), fake.rows["watch-1"]!.map((r) => r.record), counter());
    expect(result.split).toEqual([]);
    expect(result.writes).toEqual([]);
    expect(result.problem).toContain("Not split, Living Room on Jesse's Watch");
  });

  it("keeps the linkId on a record it does not have to split", async () => {
    const raw = { ...rawFixture("control_only.json"), linkId: "AAAAAAAA-0000-4000-8000-00000000000A" };
    const fake = fakeHass({ documents: { "watch-1": [raw] } });
    const result = await splitOwner(fake.hass, ownerRow(), fake.rows["watch-1"]!.map((r) => r.record), counter());
    expect(result.split).toEqual([]);
    expect(result.writes).toEqual([]);
    expect(fake.live("watch-1")).toHaveLength(1);
    expect(fake.live("watch-1")[0]!.linkId).toBe("AAAAAAAA-0000-4000-8000-00000000000A");
  });
});

describe("autoSplitShapes", () => {
  /** Wait for the notice callback to have been called `count` times. The Undo
   * runs on its own after the click, reporting busy and then done. */
  const until = async (notices: unknown[], count: number) => {
    for (let i = 0; i < 200 && notices.length < count; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1));
    }
  };

  const run = async (fake: Fake, owners: OwnerSummary[]) => {
    const notices: (SplitNotice | undefined)[] = [];
    await autoSplitShapes(fake.hass, owners, (n) => notices.push(n));
    return notices;
  };

  it("splits every owner's records and says so once", async () => {
    freshSessionStorage();
    const fake = fakeHass({
      documents: {
        "watch-1": [rawFixture("living_room.json"), rawFixture("text_arc.json")],
        "phone-1": [rawFixture("list_forecast.json")],
      },
    });
    const notices = await run(fake, [
      ownerRow(),
      ownerRow({ owner_watch_id: "phone-1", device_kind: "iphone", device_name: "Jesse's iPhone" }),
    ]);
    expect(notices).toHaveLength(1);
    expect(notices[0]!.lines).toEqual([splitLine(["Living Room", "Curved text", "Forecast list"])]);
    expect(notices[0]!.busy).toBe(false);
    expect(notices[0]!.undo).toBeTypeOf("function");
    expect(fake.live("watch-1")).toHaveLength(6);
    expect(fake.live("phone-1")).toHaveLength(2);
    for (const owner of ["watch-1", "phone-1"]) {
      for (const document of fake.live(owner)) {
        expect((document.supportedFamilies as string[]).length).toBe(1);
      }
    }
  });

  it("puts every record back byte for byte on Undo", async () => {
    freshSessionStorage();
    const raw = rawFixture("living_room.json");
    const before = JSON.parse(JSON.stringify(raw)) as Record<string, unknown>;
    const fake = fakeHass({ documents: { "watch-1": [raw] } });
    const notices: (SplitNotice | undefined)[] = [];
    await autoSplitShapes(fake.hass, [ownerRow()], (n) => notices.push(n));
    expect(fake.live("watch-1")).toHaveLength(3);

    notices[0]!.undo!();
    await until(notices, 3);
    expect(notices[1]!.busy).toBe(true);
    expect(notices[2]!.busy).toBe(false);
    expect(notices[2]!.undo).toBeUndefined();
    expect(notices[2]!.lines).toEqual(["Undone. Those complications are back the way they were."]);

    const live = fake.live("watch-1");
    expect(live).toHaveLength(1);
    expect(live[0]).toEqual(before);
    // The children are gone, not merely emptied.
    expect(fake.rows["watch-1"]!.filter((r) => r.record.deleted)).toHaveLength(2);
  });

  it("leaves an owner below the gate alone and unmarked", async () => {
    freshSessionStorage();
    const fake = fakeHass({ documents: { "watch-1": [rawFixture("living_room.json")] } });
    const old = ownerRow({ app_version: "2.8.0", app_build: "10" });
    expect(await run(fake, [old])).toEqual([]);
    expect(fake.sent).toEqual([]);
    // The same browser session, after the watch updates: it is split now.
    const notices = await run(fake, [ownerRow()]);
    expect(notices).toHaveLength(1);
    expect(notices[0]!.lines).toEqual([splitLine(["Living Room"])]);
  });

  it("never runs twice for one owner in a session", async () => {
    freshSessionStorage();
    const fake = fakeHass({ documents: { "watch-1": [rawFixture("living_room.json")] } });
    expect(await run(fake, [ownerRow()])).toHaveLength(1);
    const again = await run(fake, [ownerRow()]);
    expect(again).toEqual([]);
    expect(fake.live("watch-1")).toHaveLength(3);
  });

  it("finds nothing left to do in a fresh browser once the records are split", async () => {
    freshSessionStorage();
    const fake = fakeHass({ documents: { "watch-1": [rawFixture("living_room.json")] } });
    await run(fake, [ownerRow()]);
    // A second browser: no marker at all, and still nothing to write.
    freshSessionStorage();
    const before = fake.live("watch-1").map((d) => JSON.stringify(d));
    expect(await run(fake, [ownerRow()])).toEqual([]);
    expect(fake.live("watch-1").map((d) => JSON.stringify(d))).toEqual(before);
  });

  it("splits the library, which has no app to gate on", async () => {
    freshSessionStorage();
    const fake = fakeHass({ documents: { library: [rawFixture("living_room.json")] } });
    const notices = await run(fake, [ownerRow({
      owner_watch_id: "library",
      device_kind: "library",
      device_name: "Library",
      app_version: null,
      app_build: null,
    })]);
    expect(notices).toHaveLength(1);
    expect(fake.live("library")).toHaveLength(3);
  });

  it("says nothing to a non-admin", async () => {
    freshSessionStorage();
    const fake = fakeHass({ documents: { "watch-1": [rawFixture("living_room.json")] }, admin: false });
    expect(await run(fake, [ownerRow()])).toEqual([]);
    expect(fake.sent).toEqual([]);
  });

  it("says nothing when there is nothing to split", async () => {
    freshSessionStorage();
    const fake = fakeHass({ documents: { "watch-1": [rawFixture("control_only.json")] } });
    expect(await run(fake, [ownerRow()])).toEqual([]);
    expect(fake.sent.filter((m) => m.type === `${D}/save`)).toEqual([]);
  });

  it("skips a device whose list will not load and splits the rest", async () => {
    freshSessionStorage();
    const fake = fakeHass({ documents: { "watch-1": [rawFixture("living_room.json")] } });
    const notices = await run(fake, [
      ownerRow({ owner_watch_id: "gone-watch" }),
      ownerRow(),
    ]);
    expect(notices).toHaveLength(1);
    expect(notices[0]!.lines).toEqual([splitLine(["Living Room"])]);
  });

  it("reports a refusal with no Undo when nothing was written", async () => {
    freshSessionStorage();
    const fake = fakeHass({ documents: { "watch-1": [rawFixture("living_room.json")] }, noHistory: ["watch-1"] });
    const notices = await run(fake, [ownerRow()]);
    expect(notices).toHaveLength(1);
    expect(notices[0]!.undo).toBeUndefined();
    expect(notices[0]!.lines[0]).toContain("Not split, Living Room on Jesse's Watch");
  });
});

// ── the copy ──────────────────────────────────────────────────────────────

describe("the lines the panel shows", () => {
  it("counts in plain words", () => {
    expect(splitLine(["Kitchen"])).toBe("Split 1 complication into one per shape: Kitchen.");
    expect(splitLine(["Kitchen", "Porch", "Zoo", "Attic"]))
      .toBe("Split 4 complications into one per shape: Kitchen, Porch, Zoo, Attic.");
  });
});
