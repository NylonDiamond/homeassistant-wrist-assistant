// The automatic merge of complications built twice, once on a watch and once
// on an iPhone. See src/linkMerge.ts and, in the app repo,
// docs/complication_one_design_everywhere.md, "Merging existing pairs".

import { describe, expect, it } from "vitest";

import {
  type CustomComplicationConfig,
  type FamilyKind,
  encodeConfig,
  literal,
  newConfig,
  newElement,
} from "../src/model.js";
import type { ComplicationRecord, HassLike, OwnerSummary } from "../src/ha-api.js";
import {
  type LinkPair,
  type LinkMergeNotice,
  type OwnerRecords,
  ambiguousLine,
  autoLinkMerge,
  findLinkPairs,
  joinedLine,
  linkedCopy,
  linkedPairCopies,
  mergeForLink,
  mergePair,
} from "../src/linkMerge.js";

// ── fixtures ──────────────────────────────────────────────────────────────

function owner(id: string, kind: "watch" | "iphone", version = "2.8.0"): OwnerSummary {
  return {
    owner_watch_id: id,
    device_name: kind === "iphone" ? "Jesse's iPhone" : "Jesse's Watch",
    device_kind: kind,
    paired_iphone_name: null,
    app_version: version,
    screen_size: null,
    complication_count: 0,
    token: 1,
    is_orphan: false,
  };
}

/** A document with the given shapes, and one named text layer on each. */
function doc(name: string, families: FamilyKind[], text = "watch"): CustomComplicationConfig {
  const cfg = newConfig(name, 0, families);
  for (const family of families) {
    if (family === "inline") continue;
    const el = newElement("text");
    el.payload.name = `${text} ${family}`;
    if (el.kind === "text") el.payload.value = literal(`${text} ${family}`);
    cfg.elements.push(el);
    cfg.perFamily[family]!.placements[el.payload.id] = {
      frame: { ...el.payload.frame },
      isHidden: false,
    };
  }
  return cfg;
}

function record(cfg: CustomComplicationConfig, ownerId: string, revision = 3): ComplicationRecord {
  return {
    id: cfg.id,
    ownerWatchId: ownerId,
    revision,
    token: 10,
    updatedAt: "2026-09-18T00:00:00+00:00",
    updatedBy: "ha-panel:Jesse",
    deleted: false,
    document: encodeConfig(cfg),
  };
}

function loadedFrom(...sides: [OwnerSummary, CustomComplicationConfig[]][]): OwnerRecords[] {
  return sides.map(([o, configs]) => ({ owner: o, records: configs.map((c) => record(c, o.owner_watch_id)) }));
}

const WATCH = owner("watch-1", "watch");
const PHONE = owner("phone-1", "iphone");

// ── pairing ───────────────────────────────────────────────────────────────

describe("findLinkPairs", () => {
  it("pairs one watch copy with one iPhone copy of the same name", () => {
    const watch = doc("Kitchen", ["rectangular", "circular"]);
    const phone = doc("  kitchen ", ["circular", "small"], "phone");
    const { pairs, ambiguous } = findLinkPairs(loadedFrom([WATCH, [watch]], [PHONE, [phone]]));
    expect(ambiguous).toEqual([]);
    expect(pairs).toHaveLength(1);
    // The name is the watch copy's spelling, trimmed.
    expect(pairs[0]!.name).toBe("Kitchen");
    expect(pairs[0]!.watch.owner.owner_watch_id).toBe("watch-1");
    expect(pairs[0]!.phone.owner.owner_watch_id).toBe("phone-1");
  });

  it("leaves a name alone once any copy carries a linkId", () => {
    const watch = doc("Kitchen", ["rectangular"]);
    watch.linkId = "AAAA-BBBB";
    const phone = doc("Kitchen", ["circular"], "phone");
    expect(findLinkPairs(loadedFrom([WATCH, [watch]], [PHONE, [phone]]))).toEqual({
      pairs: [],
      ambiguous: [],
    });
  });

  it("calls a name ambiguous when one device holds two of it", () => {
    const a = doc("Kitchen", ["rectangular"]);
    const b = doc("kitchen", ["circular"]);
    const phone = doc("Kitchen", ["circular"], "phone");
    const { pairs, ambiguous } = findLinkPairs(loadedFrom([WATCH, [a, b]], [PHONE, [phone]]));
    expect(pairs).toEqual([]);
    expect(ambiguous).toEqual(["Kitchen"]);
  });

  it("calls a name ambiguous when two watches hold it", () => {
    const second = owner("watch-2", "watch");
    const { pairs, ambiguous } = findLinkPairs(
      loadedFrom([WATCH, [doc("Kitchen", ["rectangular"])]], [second, [doc("Kitchen", ["circular"])]],
        [PHONE, [doc("Kitchen", ["circular"], "phone")]]),
    );
    expect(pairs).toEqual([]);
    expect(ambiguous).toEqual(["Kitchen"]);
  });

  it("says nothing about a name only one kind of device holds", () => {
    const { pairs, ambiguous } = findLinkPairs(
      loadedFrom([WATCH, [doc("Porch", ["rectangular"]), doc("Porch ", ["circular"])]], [PHONE, []]),
    );
    expect(pairs).toEqual([]);
    expect(ambiguous).toEqual([]);
  });

  it("ignores tombstones, empty names and documents it cannot read", () => {
    const watch = doc("Kitchen", ["rectangular"]);
    const deleted = record(doc("Kitchen", ["circular"], "phone"), PHONE.owner_watch_id);
    deleted.deleted = true;
    deleted.document = null;
    const junk: ComplicationRecord = { ...record(doc("Kitchen", ["circular"]), PHONE.owner_watch_id), document: { id: "X" } };
    const blank = doc("   ", ["circular"], "phone");
    const loaded: OwnerRecords[] = [
      { owner: WATCH, records: [record(watch, WATCH.owner_watch_id)] },
      { owner: PHONE, records: [deleted, junk, record(blank, PHONE.owner_watch_id)] },
    ];
    expect(findLinkPairs(loaded)).toEqual({ pairs: [], ambiguous: [] });
  });

  it("lists pairs and ambiguous names by name", () => {
    const loaded = loadedFrom(
      [WATCH, [doc("Porch", ["rectangular"]), doc("Attic", ["rectangular"]), doc("Zoo", ["rectangular"]), doc("zoo", ["circular"])]],
      [PHONE, [doc("Porch", ["circular"], "phone"), doc("Attic", ["circular"], "phone"), doc("Zoo", ["circular"], "phone")]],
    );
    const { pairs, ambiguous } = findLinkPairs(loaded);
    expect(pairs.map((p) => p.name)).toEqual(["Attic", "Porch"]);
    expect(ambiguous).toEqual(["Zoo"]);
  });
});

// ── content ───────────────────────────────────────────────────────────────

describe("mergeForLink", () => {
  it("keeps the watch design and adds the shapes only the phone had", () => {
    const watch = doc("Kitchen", ["rectangular", "circular"]);
    const phone = doc("Kitchen", ["circular", "small", "medium"], "phone");
    const merged = mergeForLink(watch, phone);

    expect(merged.supportedFamilies).toEqual(["rectangular", "circular", "small", "medium"]);
    // The shared shape is the watch's, layout and layers.
    expect(merged.perFamily.circular).toEqual(watch.perFamily.circular);
    // The phone-only shapes arrive with their layers.
    expect(merged.perFamily.small).toEqual(phone.perFamily.small);
    const names = merged.elements.map((el) => el.payload.name);
    expect(names).toContain("watch circular");
    expect(names).toContain("phone small");
    expect(names).toContain("phone medium");
    // The phone's copy of the shared shape is not carried over.
    expect(names).not.toContain("phone circular");
  });

  it("changes neither document it was given", () => {
    const watch = doc("Kitchen", ["rectangular"]);
    const phone = doc("Kitchen", ["small"], "phone");
    const watchBefore = structuredClone(watch);
    const phoneBefore = structuredClone(phone);
    mergeForLink(watch, phone);
    expect(watch).toEqual(watchBefore);
    expect(phone).toEqual(phoneBefore);
  });

  it("takes the phone's Inline text when the watch has no Inline", () => {
    const watch = doc("Kitchen", ["rectangular"]);
    const phone = doc("Kitchen", ["rectangular", "inline"], "phone");
    phone.inline = { value: literal("phone inline") };
    const merged = mergeForLink(watch, phone);
    expect(merged.supportedFamilies).toContain("inline");
    expect(merged.inline).toEqual(phone.inline);
  });

  it("keeps the watch's Inline text when both have one", () => {
    const watch = doc("Kitchen", ["rectangular", "inline"]);
    watch.inline = { value: literal("watch inline") };
    const phone = doc("Kitchen", ["rectangular", "inline"], "phone");
    phone.inline = { value: literal("phone inline") };
    expect(mergeForLink(watch, phone).inline).toEqual(watch.inline);
  });

  it("brings the shared values and the layer groups the copied layers use", () => {
    const watch = doc("Kitchen", ["rectangular"]);
    const phone = doc("Kitchen", ["small"], "phone");
    phone.values = [{ id: "V1", name: "Temp", value: literal("21") }];
    phone.groups = [{ id: "G1", name: "Tiles", locked: true }, { id: "G2", name: "Unused", locked: true }];
    phone.elements[0]!.payload.groupId = "G1";
    const merged = mergeForLink(watch, phone);
    expect(merged.values).toEqual(phone.values);
    expect(merged.groups).toEqual([{ id: "G1", name: "Tiles", locked: true }]);
  });

  it("takes a Control Center control only when the watch has none", () => {
    const watch = doc("Kitchen", ["rectangular"]);
    const phone = doc("Kitchen", ["small"], "phone");
    phone.control = {
      kind: "toggle",
      title: literal("Phone control"),
      symbol: "lightbulb",
      coloring: "uniform",
      bands: [],
      action: { type: "refresh" },
    };
    expect(mergeForLink(watch, phone).control).toEqual(phone.control);

    const owned = structuredClone(watch);
    owned.control = { ...phone.control, title: literal("Watch control") };
    expect(mergeForLink(owned, phone).control).toEqual(owned.control);
  });

  it("keeps one copy of a layer the two documents share by id", () => {
    const watch = doc("Kitchen", ["rectangular"]);
    const shared = watch.elements[0]!;
    const phone = doc("Kitchen", ["small"], "phone");
    // The phone's small tile places the same layer id, with its own frame and
    // its own idea of what the layer says.
    const theirs = structuredClone(shared);
    theirs.payload.name = "phone rectangular";
    phone.elements = [theirs];
    phone.perFamily.small!.placements = {
      [shared.payload.id]: { frame: { x: 0.1, y: 0.1, width: 0.2, height: 0.2, rotationDegrees: 0 }, isHidden: false },
    };
    const merged = mergeForLink(watch, phone);
    expect(merged.elements).toHaveLength(1);
    expect(merged.elements[0]!.payload.name).toBe("watch rectangular");
    expect(merged.perFamily.small!.placements[shared.payload.id]!.frame.x).toBe(0.1);
  });

  it("unpins a copied layer from a page the merged document does not have", () => {
    const watch = doc("Kitchen", ["rectangular"]);
    const phone = doc("Kitchen", ["small"], "phone");
    phone.pages = { count: 3, mode: "tap", dwell: [] };
    phone.elements[0]!.payload.page = 3;
    const merged = mergeForLink(watch, phone);
    expect(merged.elements[1]!.payload.page).toBeUndefined();
  });

  it("keeps a page pin the merged document can still draw", () => {
    const watch = doc("Kitchen", ["rectangular"]);
    watch.pages = { count: 3, mode: "tap", dwell: [] };
    const phone = doc("Kitchen", ["small"], "phone");
    phone.elements[0]!.payload.page = 2;
    const merged = mergeForLink(watch, phone);
    expect(merged.elements[1]!.payload.page).toBe(2);
  });
});

// ── the per device copies ─────────────────────────────────────────────────

describe("linkedCopy", () => {
  const merged = () => {
    const cfg = mergeForLink(
      doc("Kitchen", ["rectangular", "circular", "corner"]),
      doc("Kitchen", ["circular", "small", "medium"], "phone"),
    );
    return cfg;
  };

  it("gives each device its own id, slot and hidden flag, and both the link", () => {
    const cfg = merged();
    const own = { id: "REC-1", slotIndex: 4, hidden: true as const };
    const copy = linkedCopy(cfg, own, "watch", "LINK-1", "2.8.0");
    expect(copy.id).toBe("REC-1");
    expect(copy.slotIndex).toBe(4);
    expect(copy.hidden).toBe(true);
    expect(copy.linkId).toBe("LINK-1");

    const shown = linkedCopy(cfg, { id: "REC-2", slotIndex: 0 }, "iphone", "LINK-1");
    expect(shown.hidden).toBeUndefined();
    expect(shown.linkId).toBe("LINK-1");
  });

  it("never gives the iPhone Corner", () => {
    const copy = linkedCopy(merged(), { id: "REC-2", slotIndex: 0 }, "iphone", "LINK-1", "2.8.0");
    expect(copy.supportedFamilies).toEqual(["rectangular", "circular", "small", "medium"]);
    expect(copy.perFamily.corner).toBeUndefined();
    expect(copy.elements.map((el) => el.payload.name)).not.toContain("watch corner");
  });

  it("gives a 2.8.0 watch the Home Screen shapes and an older one none", () => {
    const cfg = merged();
    const current = linkedCopy(cfg, { id: "REC-1", slotIndex: 0 }, "watch", "LINK-1", "2.8.0");
    expect(current.supportedFamilies).toEqual(["rectangular", "circular", "corner", "small", "medium"]);

    for (const version of ["2.7.9", null]) {
      const old = linkedCopy(cfg, { id: "REC-1", slotIndex: 0 }, "watch", "LINK-1", version);
      expect(old.supportedFamilies).toEqual(["rectangular", "circular", "corner"]);
      expect(old.perFamily.small).toBeUndefined();
      expect(old.elements.map((el) => el.payload.name)).not.toContain("phone small");
    }
  });

  it("changes nothing in the merged document it copies", () => {
    const cfg = merged();
    const before = structuredClone(cfg);
    linkedCopy(cfg, { id: "REC-2", slotIndex: 0 }, "iphone", "LINK-1");
    expect(cfg).toEqual(before);
  });
});

// ── the notice's words ────────────────────────────────────────────────────

describe("the notice", () => {
  it("counts what it joined", () => {
    expect(joinedLine(["Kitchen"])).toBe(
      "Joined 1 complication that had the same name on your watch and iPhone: Kitchen.",
    );
    expect(joinedLine(["Kitchen", "Porch"])).toBe(
      "Joined 2 complications that had the same name on your watch and iPhone: Kitchen, Porch.",
    );
  });

  it("points an ambiguous name at the manual menu item", () => {
    expect(ambiguousLine(["Zoo", "Attic"])).toBe(
      "Not joined, two share a name on one device: Zoo, Attic. Use Link with... in the complication menu.",
    );
  });
});

// ── writing ───────────────────────────────────────────────────────────────

const D = "wrist_assistant/complications";

interface FakeOptions {
  /** Records per owner id. */
  records: Record<string, ComplicationRecord[]>;
  /** Owner ids whose history command fails. */
  noHistory?: string[];
  /** Owner ids whose save is refused. */
  noSave?: string[];
  admin?: boolean;
}

interface Fake {
  hass: HassLike;
  sent: Record<string, unknown>[];
}

function fakeHass(options: FakeOptions): Fake {
  const sent: Record<string, unknown>[] = [];
  // The store's own copies, so a save here never edits the record object the
  // test still holds. The real server behaves the same way.
  const store: Record<string, ComplicationRecord[]> = {};
  for (const [owner, records] of Object.entries(options.records)) store[owner] = records.map((r) => ({ ...r }));
  const find = (owner: string, id: string) =>
    (store[owner] ?? []).find((r) => r.id.toUpperCase() === String(id).toUpperCase());
  const replace = (owner: string, next: ComplicationRecord) => {
    store[owner] = (store[owner] ?? []).map((r) => (r.id === next.id ? next : r));
    return next;
  };
  const hass = {
    user: { is_admin: options.admin !== false },
    states: {},
    connection: {
      async sendMessagePromise<T>(message: Record<string, unknown>): Promise<T> {
        sent.push(message);
        const owner = String(message.owner_watch_id ?? "");
        switch (message.type) {
          case `${D}/list`:
            return { records: store[owner] ?? [], token: 1, max_schema_version: 9 } as T;
          case `${D}/history`: {
            if (options.noHistory?.includes(owner)) throw new Error("history unavailable");
            const record = find(owner, String(message.complication_id));
            if (!record) throw new Error("not_found");
            return {
              owner_watch_id: owner,
              complication_id: record.id,
              revision: record.revision,
              entries: [],
            } as T;
          }
          case `${D}/save`: {
            if (options.noSave?.includes(owner)) return { ok: false, error: "conflict", message: "no free slot" } as T;
            const document = message.document as Record<string, unknown>;
            const record = find(owner, String(document.id));
            if (!record) throw new Error("not_found");
            const next = replace(owner, { ...record, revision: record.revision + 1, document });
            return { ok: true, record: next } as T;
          }
          case `${D}/history_restore`: {
            const record = find(owner, String(message.complication_id));
            if (!record) throw new Error("not_found");
            const next = replace(owner, { ...record, revision: record.revision + 1 });
            return { ok: true, record: next, restored_revision: message.revision } as T;
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
  return { hass, sent };
}

function pairOf(watch: CustomComplicationConfig, phone: CustomComplicationConfig): LinkPair {
  return {
    name: watch.name,
    watch: { owner: WATCH, record: record(watch, WATCH.owner_watch_id), config: watch },
    phone: { owner: PHONE, record: record(phone, PHONE.owner_watch_id, 5), config: phone },
  };
}

describe("mergePair", () => {
  it("writes both copies on the revisions they were read at", async () => {
    const watch = doc("Kitchen", ["rectangular"]);
    const phone = doc("Kitchen", ["small"], "phone");
    const pair = pairOf(watch, phone);
    const { hass, sent } = fakeHass({
      records: {
        "watch-1": [pair.watch.record],
        "phone-1": [pair.phone.record],
      },
    });

    const { writes, problem } = await mergePair(hass, pair);
    expect(problem).toBeUndefined();
    expect(writes).toHaveLength(2);
    expect(writes.map((w) => w.previous)).toEqual([3, 5]);
    expect(writes.map((w) => w.current)).toEqual([4, 6]);

    // Both history checks come before either save.
    const kinds = sent.map((m) => String(m.type));
    expect(kinds).toEqual([`${D}/history`, `${D}/history`, `${D}/save`, `${D}/save`]);

    const saves = sent.filter((m) => m.type === `${D}/save`);
    const documents = saves.map((m) => m.document as Record<string, unknown>);
    // One link on both, the ids and slots kept, and the shapes cut per device.
    expect(documents[0]!.linkId).toBe(documents[1]!.linkId);
    expect(String(documents[0]!.linkId ?? "")).not.toBe("");
    expect(documents[0]!.id).toBe(watch.id);
    expect(documents[1]!.id).toBe(phone.id);
    expect(documents[0]!.supportedFamilies).toEqual(["rectangular", "small"]);
    expect(documents[1]!.supportedFamilies).toEqual(["rectangular", "small"]);
    expect(saves[0]!.base_revision).toBe(3);
    expect(saves[1]!.base_revision).toBe(5);
  });

  it("writes nothing at all when either side cannot prove a backup", async () => {
    for (const broken of ["watch-1", "phone-1"]) {
      const pair = pairOf(doc("Kitchen", ["rectangular"]), doc("Kitchen", ["small"], "phone"));
      const { hass, sent } = fakeHass({
        records: { "watch-1": [pair.watch.record], "phone-1": [pair.phone.record] },
        noHistory: [broken],
      });
      const { writes, problem } = await mergePair(hass, pair);
      expect(writes).toEqual([]);
      expect(problem).toContain("save history could not be read");
      expect(sent.some((m) => m.type === `${D}/save`)).toBe(false);
    }
  });

  it("writes nothing when a record moved under the panel", async () => {
    const pair = pairOf(doc("Kitchen", ["rectangular"]), doc("Kitchen", ["small"], "phone"));
    const moved = { ...pair.phone.record, revision: 9 };
    const { hass, sent } = fakeHass({
      records: { "watch-1": [pair.watch.record], "phone-1": [moved] },
    });
    const { writes, problem } = await mergePair(hass, pair);
    expect(writes).toEqual([]);
    expect(problem).toContain("changed on the server");
    expect(sent.some((m) => m.type === `${D}/save`)).toBe(false);
  });

  it("stops at the refused save and keeps what it already wrote for Undo", async () => {
    const pair = pairOf(doc("Kitchen", ["rectangular"]), doc("Kitchen", ["small"], "phone"));
    const { hass } = fakeHass({
      records: { "watch-1": [pair.watch.record], "phone-1": [pair.phone.record] },
      noSave: ["phone-1"],
    });
    const { writes, problem } = await mergePair(hass, pair);
    expect(problem).toContain("no free slot");
    expect(writes).toHaveLength(1);
    expect(writes[0]!.owner).toBe("watch-1");
  });
});

describe("autoLinkMerge", () => {
  const noticesFrom = async (fake: Fake, owners: OwnerSummary[]) => {
    const notices: (LinkMergeNotice | undefined)[] = [];
    await autoLinkMerge(fake.hass, owners, (n) => notices.push(n));
    return notices;
  };

  /** Wait for the notice callback to have been called `count` times. The Undo
   * runs on its own after the click, reporting busy and then done. */
  const until = async (notices: unknown[], count: number) => {
    for (let i = 0; i < 200 && notices.length < count; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1));
    }
  };

  it("joins every pair, then undoes them all", async () => {
    const watchA = doc("Kitchen", ["rectangular"]);
    const phoneA = doc("Kitchen", ["small"], "phone");
    const watchB = doc("Porch", ["circular"]);
    const phoneB = doc("Porch", ["medium"], "phone");
    const lone = doc("Zoo", ["circular"], "phone");
    const fake = fakeHass({
      records: {
        "watch-1": [record(watchA, "watch-1"), record(watchB, "watch-1")],
        "phone-1": [record(phoneA, "phone-1"), record(phoneB, "phone-1"), record(lone, "phone-1")],
      },
    });

    const notices: (LinkMergeNotice | undefined)[] = [];
    await autoLinkMerge(fake.hass, [WATCH, PHONE], (n) => notices.push(n));
    expect(notices).toHaveLength(1);
    const notice = notices[0]!;
    expect(notice.lines).toEqual([joinedLine(["Kitchen", "Porch"])]);
    expect(notice.busy).toBe(false);
    expect(notice.undo).toBeTypeOf("function");
    expect(fake.sent.filter((m) => m.type === `${D}/save`)).toHaveLength(4);

    notice.undo!();
    await until(notices, 3);
    expect(notices).toHaveLength(3);
    expect(notices[1]!.busy).toBe(true);
    expect(notices[2]!.busy).toBe(false);
    expect(notices[2]!.undo).toBeUndefined();
    expect(notices[2]!.lines).toEqual(["Undone. Those complications are back the way they were."]);

    // One restore per record written, each back to the revision the merge
    // based its save on.
    const restores = fake.sent.filter((m) => m.type === `${D}/history_restore`);
    expect(restores).toHaveLength(4);
    expect(restores.map((m) => m.revision)).toEqual([3, 3, 3, 3]);
    expect(restores.map((m) => m.base_revision)).toEqual([4, 4, 4, 4]);
  });

  it("says nothing when there is no iPhone owner", async () => {
    const fake = fakeHass({ records: { "watch-1": [record(doc("Kitchen", ["rectangular"]), "watch-1")] } });
    expect(await noticesFrom(fake, [WATCH])).toEqual([]);
    expect(fake.sent).toEqual([]);
  });

  it("says nothing to a non-admin", async () => {
    const fake = fakeHass({ records: {}, admin: false });
    expect(await noticesFrom(fake, [WATCH, PHONE])).toEqual([]);
    expect(fake.sent).toEqual([]);
  });

  it("reports ambiguous names without writing anything", async () => {
    const fake = fakeHass({
      records: {
        "watch-1": [record(doc("Zoo", ["rectangular"]), "watch-1"), record(doc("zoo", ["circular"]), "watch-1")],
        "phone-1": [record(doc("Zoo", ["small"], "phone"), "phone-1")],
      },
    });
    const notices = await noticesFrom(fake, [WATCH, PHONE]);
    expect(notices).toHaveLength(1);
    expect(notices[0]!.lines).toEqual([ambiguousLine(["Zoo"])]);
    expect(notices[0]!.undo).toBeUndefined();
    expect(fake.sent.some((m) => m.type === `${D}/save`)).toBe(false);
  });
});

describe("linkedPairCopies", () => {
  it("gives the two copies one link", () => {
    const pair = pairOf(doc("Kitchen", ["rectangular", "corner"]), doc("Kitchen", ["small"], "phone"));
    const { watch, phone } = linkedPairCopies(pair, "LINK-9");
    expect(watch.linkId).toBe("LINK-9");
    expect(phone.linkId).toBe("LINK-9");
    expect(watch.supportedFamilies).toContain("corner");
    expect(phone.supportedFamilies).not.toContain("corner");
  });
});
