// Saving one complication to every device it lives on: what each copy carries,
// which seat it takes, what the save refuses before it writes anything, and
// what it says afterwards.

import { describe, expect, it } from "vitest";

import { type CustomComplicationConfig, type FamilyKind, defaultControlSpec, encodeConfig, literal, legacyConfig, newConfig, newElement } from "../src/model.js";
import { addFamily } from "../src/layouts.js";
import {
  type LinkOwner,
  type LinkRecordLike,
  copyFamilies,
  copyForOwner,
  familiesKeptFor,
  libraryComingSoon,
  libraryFamilies,
  linkIdOf,
  linkedCopies,
  linkedSaveStatus,
  mergeLinkedContent,
  openCopyOf,
  picksFromCopies,
  planLinkedSave,
} from "../src/linking.js";
import { familiesFor } from "../src/layouts.js";
import { LIBRARY_OWNER_ID } from "../src/version.js";

const LINK = "8B1C2D3E-0000-4000-8000-000000000001";

const owner = (over: Partial<LinkOwner> = {}): LinkOwner => ({
  ownerId: "w1",
  label: "Jesse's Watch",
  kind: "watch",
  families: familiesFor({ device_kind: "watch", app_version: "2.8.0" }),
  comingSoon: [],
  controls: true,
  appVersion: "2.8.0",
  ...over,
});

const WATCH = owner();
const PHONE = owner({ ownerId: "p1", label: "Jesse's iPhone", kind: "iphone", appVersion: "2.8.0", families: familiesFor({ device_kind: "iphone", app_version: "2.8.0" }) });
/** The shelf, which is not a device: every shape, no version, the control. */
const LIBRARY = owner({
  ownerId: LIBRARY_OWNER_ID,
  label: "Library",
  kind: "library",
  appVersion: null,
  families: libraryFamilies(),
  comingSoon: libraryComingSoon(),
});

/** A document with every shape on it, which is what a linked pair edits. */
function everything(): CustomComplicationConfig {
  const cfg = legacyConfig("Kitchen", 0, ["rectangular", "circular", "corner", "inline"]);
  addFamily(cfg, "small");
  addFamily(cfg, "medium");
  cfg.linkId = LINK;
  return cfg;
}

/** Put a layer on one shape, which is what makes it that shape's layer. */
function place(cfg: CustomComplicationConfig, family: FamilyKind, id: string) {
  const el = cfg.elements.find((e) => e.payload.id === id)!;
  cfg.perFamily[family]!.placements[id] = { frame: { ...el.payload.frame }, isHidden: false };
}

const record = (ownerId: string, cfg: CustomComplicationConfig, revision = 1): LinkRecordLike => ({
  ownerId,
  id: cfg.id,
  revision,
  deleted: false,
  document: encodeConfig(cfg),
});

describe("familiesKeptFor", () => {
  // Corner is a watch face slot: the phone widget has nothing to land it on.
  it("never lets a phone copy carry corner", () => {
    expect(familiesKeptFor(PHONE)).not.toContain("corner");
    expect(familiesKeptFor(PHONE)).toEqual(["rectangular", "circular", "inline", "small", "medium", "large", "xlarge"]);
  });

  // A watch on the per-shape release decodes all eight shapes and draws the
  // ones it has, so the copies stay one document.
  // A watch never draws a Home Screen size, and carrying one costs it: an older
  // app fails the whole document on a raw value it predates, a current one
  // resolves tiles it never draws on every timeline entry.
  it("keeps the Home Screen sizes away from every watch", () => {
    expect(familiesKeptFor(WATCH)).toEqual(["rectangular", "circular", "corner", "inline"]);
    expect(familiesKeptFor(owner({ appVersion: "2.7.2" }))).toEqual(["rectangular", "circular", "corner", "inline"]);
    expect(familiesKeptFor(owner({ appVersion: null }))).toEqual(["rectangular", "circular", "corner", "inline"]);
  });

  it("keeps the Home Screen sizes away from a phone below the Home Screen release", () => {
    expect(familiesKeptFor({ kind: "iphone", appVersion: "2.7.0" })).toEqual(["rectangular", "circular", "inline"]);
  });

  // None of the reasons above is about the shelf: no app decodes it, so a
  // shape trimmed off it would be lost for good rather than simply undrawn.
  it("lets the library keep every shape, whatever version it claims", () => {
    expect(familiesKeptFor(LIBRARY)).toEqual(libraryFamilies());
    expect(familiesKeptFor(LIBRARY)).toContain("corner");
    expect(familiesKeptFor(LIBRARY)).toContain("small");
    expect(familiesKeptFor({ kind: "library", appVersion: "1.0.0" })).toEqual(libraryFamilies());
  });
});

describe("copyFamilies", () => {
  const all: FamilyKind[] = ["rectangular", "circular", "corner", "inline", "small", "medium"];

  it("gives each device what it can draw when nobody has unticked anything", () => {
    expect(copyFamilies(all, WATCH, new Map(), "w1")).toEqual(["rectangular", "circular", "corner", "inline"]);
    expect(copyFamilies(all, PHONE, new Map(), "p1")).toEqual(["rectangular", "circular", "inline", "small", "medium"]);
  });

  it("drops a shape the author unticked for that device alone", () => {
    const document: FamilyKind[] = ["rectangular", "circular", "corner", "small"];
    const picks = new Map([
      ["w1", new Set<FamilyKind>(["rectangular", "circular", "corner"])],
      ["p1", new Set<FamilyKind>(["circular", "small"])],
    ]);
    expect(copyFamilies(document, WATCH, picks, "w1")).toEqual(["rectangular", "circular", "corner"]);
    expect(copyFamilies(document, PHONE, picks, "p1")).toEqual(["circular", "small"]);
  });

  // Otherwise a shape added after the picks were made would reach nobody.
  it("sends a shape nobody has an opinion about to every device that draws it", () => {
    const picks = new Map([["w1", new Set<FamilyKind>(["rectangular"])], ["p1", new Set<FamilyKind>(["rectangular"])]]);
    expect(copyFamilies(["rectangular", "medium"], WATCH, picks, "w1")).toEqual(["rectangular"]);
    expect(copyFamilies(["rectangular", "medium"], PHONE, picks, "p1")).toEqual(["rectangular", "medium"]);
  });
});

describe("copyForOwner", () => {
  it("strips the shapes this copy does not carry, layers and all", () => {
    const cfg = everything();
    const el = newElement("text");
    cfg.elements = [el];
    place(cfg, "corner", el.payload.id);
    const phone = copyForOwner(cfg, { id: "P", slotIndex: 3, hidden: false, families: copyFamilies(cfg.supportedFamilies, PHONE, new Map(), "p1") }, LINK);
    expect(phone.supportedFamilies).not.toContain("corner");
    expect(phone.perFamily.corner).toBeUndefined();
    expect(phone.elements).toHaveLength(0);
    // The document it was made from is untouched.
    expect(cfg.supportedFamilies).toContain("corner");
    expect(cfg.elements).toHaveLength(1);
  });

  it("wears this copy's identity and the link both copies share", () => {
    const cfg = everything();
    cfg.hidden = true;
    const copy = copyForOwner(cfg, { id: "P", slotIndex: 3, hidden: false, families: cfg.supportedFamilies }, LINK);
    expect(copy.id).toBe("P");
    expect(copy.slotIndex).toBe(3);
    expect(copy.hidden).toBeUndefined();
    expect(copy.linkId).toBe(LINK);
  });

  it("re-stamps the schema for the shapes it ends up with", () => {
    const cfg = everything();
    const watchOnly = copyForOwner(cfg, { id: "W", slotIndex: 0, hidden: false, families: ["rectangular", "circular", "corner", "inline"] }, LINK);
    // Home Screen sizes are what forces schema 7; without them this is 6.
    expect(watchOnly.schemaVersion).toBe(6);
    expect(copyForOwner(cfg, { id: "P", slotIndex: 0, hidden: false, families: cfg.supportedFamilies }, LINK).schemaVersion).toBe(7);
  });
});

describe("planLinkedSave", () => {
  const targets = (over: { watchSlots?: number[]; phoneSlots?: number[] } = {}) => [
    { owner: WATCH, usedSlots: over.watchSlots ?? [0] },
    { owner: PHONE, usedSlots: over.phoneSlots ?? [] },
  ];

  it("keeps each copy's own id, seat and hidden", () => {
    const cfg = everything();
    const plan = planLinkedSave(
      cfg,
      [
        { owner: WATCH, copy: { ownerId: "w1", id: cfg.id, revision: 4, slotIndex: 0, hidden: false, families: [], name: "Kitchen" }, usedSlots: [0] },
        { owner: PHONE, copy: { ownerId: "p1", id: "P", revision: 2, slotIndex: 5, hidden: true, families: [], name: "Kitchen" }, usedSlots: [5] },
      ],
      new Map(),
      { ownerId: "w1", baseRevision: 4 },
    );
    if (!plan.ok) throw new Error(plan.message);
    expect(plan.writes.map((w) => [w.ownerId, w.id, w.slotIndex, w.hidden, w.baseRevision]))
      .toEqual([["w1", cfg.id, 0, false, 4], ["p1", "P", 5, true, 2]]);
  });

  it("gives a device joining the link a new id and the lowest free seat there", () => {
    const cfg = everything();
    const plan = planLinkedSave(cfg, targets({ phoneSlots: [0, 1] }), new Map(), { ownerId: "w1", baseRevision: 1 }, () => "NEW");
    if (!plan.ok) throw new Error(plan.message);
    expect(plan.writes[1]).toMatchObject({ ownerId: "p1", id: "NEW", slotIndex: 2, hidden: false, baseRevision: null });
  });

  // The shelf is an ordinary target of the plan: it takes a free seat from its
  // own used slots, and it is refused when it has none, exactly like a device.
  // One set of rules for every owner is easier to trust than a second set that
  // applies to one of them.
  it("gives the library a free seat from its own slots", () => {
    const cfg = everything();
    const plan = planLinkedSave(
      cfg,
      [{ owner: LIBRARY, usedSlots: [0, 1, 3] }],
      new Map(),
      { ownerId: LIBRARY_OWNER_ID, baseRevision: null },
    );
    if (!plan.ok) throw new Error(plan.message);
    expect(plan.writes.map((w) => [w.ownerId, w.slotIndex])).toEqual([[LIBRARY_OWNER_ID, 2]]);
  });

  it("refuses a full library the same way it refuses a full device", () => {
    const cfg = everything();
    const full = Array.from({ length: 64 }, (_, i) => i);
    const plan = planLinkedSave(
      cfg,
      [{ owner: LIBRARY, usedSlots: full }],
      new Map(),
      { ownerId: LIBRARY_OWNER_ID, baseRevision: null },
    );
    expect(plan.ok).toBe(false);
    if (plan.ok) throw new Error("expected a refusal");
    expect(plan.message).toContain("Library");
    expect(plan.message).toContain("no free slot");
  });

  // Nothing draws the shelf, so no shape is trimmed off its copy: a design put
  // on a device later still has everything it was built with.
  it("writes the library a copy carrying every shape the document has", () => {
    const cfg = everything();
    const plan = planLinkedSave(
      cfg,
      [{ owner: LIBRARY, usedSlots: [] }, { owner: WATCH, usedSlots: [] }],
      new Map(),
      { ownerId: LIBRARY_OWNER_ID, baseRevision: null },
    );
    if (!plan.ok) throw new Error(plan.message);
    expect(plan.writes[0]!.families).toEqual(cfg.supportedFamilies);
    // The watch's copy is still trimmed of the Home Screen sizes, so the line
    // above is the library's doing rather than the plan trimming nothing.
    expect(plan.writes[1]!.families).not.toContain("small");
  });

  // Finding this out halfway through leaves the watch saved and the phone not.
  it("refuses before writing anything, naming the device with no seat", () => {
    const cfg = everything();
    const full = Array.from({ length: 64 }, (_, i) => i);
    const plan = planLinkedSave(cfg, targets({ phoneSlots: full }), new Map(), { ownerId: "w1", baseRevision: 1 });
    expect(plan.ok).toBe(false);
    if (plan.ok) throw new Error("expected a refusal");
    expect(plan.message).toContain("Jesse's iPhone");
    expect(plan.message).toContain("no free slot");
  });

  it("refuses a device that could draw none of these shapes", () => {
    const cfg = newConfig("Corner only", 0, "corner");
    cfg.linkId = LINK;
    const plan = planLinkedSave(cfg, targets(), new Map(), { ownerId: "w1", baseRevision: 1 });
    expect(plan.ok).toBe(false);
    if (plan.ok) throw new Error("expected a refusal");
    expect(plan.message).toContain("Jesse's iPhone");
  });

  it("lets a control-only complication through, shapes or no shapes", () => {
    const cfg = newConfig("Just a control", 0, "corner");
    cfg.linkId = LINK;
    cfg.control = defaultControlSpec(cfg);
    const plan = planLinkedSave(cfg, targets(), new Map(), { ownerId: "w1", baseRevision: 1 });
    expect(plan.ok).toBe(true);
  });
});

describe("reading the link off the devices", () => {
  it("groups the copies by linkId and never by record id", () => {
    const watch = everything();
    const phone = everything();
    phone.id = "P";
    phone.slotIndex = 5;
    phone.hidden = true;
    const stray = newConfig("Something else", 2);
    const copies = linkedCopies([record("w1", watch), record("p1", phone, 3), record("p1", stray)], LINK);
    expect(copies.map((c) => [c.ownerId, c.id, c.slotIndex, c.hidden, c.revision]))
      .toEqual([["w1", watch.id, 0, false, 1], ["p1", "P", 5, true, 3]]);
  });

  it("leaves a deleted copy out", () => {
    const watch = everything();
    const gone = { ...record("p1", watch), deleted: true, document: null };
    expect(linkedCopies([record("w1", watch), gone], LINK).map((c) => c.ownerId)).toEqual(["w1"]);
  });

  it("reads the link key off a document, whatever its case", () => {
    expect(linkIdOf({ linkId: "abc" })).toBe("ABC");
    expect(linkIdOf({})).toBeUndefined();
    expect(linkIdOf(null)).toBeUndefined();
  });

  // The phone copy is the one that is never trimmed.
  it("opens the phone copy when there is one", () => {
    const copies = linkedCopies([record("w1", everything()), record("p1", { ...everything(), id: "P" })], LINK);
    const kind = (ownerId: string) => (ownerId === "p1" ? "iphone" as const : "watch" as const);
    expect(openCopyOf(copies, kind)!.ownerId).toBe("p1");
    expect(openCopyOf([copies[0]!], kind)!.ownerId).toBe("w1");
  });

  // The library's copy is untrimmed too, so it would do, but a link that
  // reaches a device is a design about that device: the phone first, then a
  // watch, and the shelf only when there is nothing else.
  it("opens the library copy last, and alone when it is the only one", () => {
    const kind = (ownerId: string): "watch" | "iphone" | "library" =>
      ownerId === "p1" ? "iphone" : ownerId === LIBRARY_OWNER_ID ? "library" : "watch";
    const lib = record(LIBRARY_OWNER_ID, { ...everything(), id: "L" });
    const watch = record("w1", everything());
    const phone = record("p1", { ...everything(), id: "P" });

    expect(openCopyOf(linkedCopies([lib, watch, phone], LINK), kind)!.ownerId).toBe("p1");
    expect(openCopyOf(linkedCopies([lib, watch], LINK), kind)!.ownerId).toBe("w1");
    expect(openCopyOf(linkedCopies([lib], LINK), kind)!.ownerId).toBe(LIBRARY_OWNER_ID);
  });

  it("remembers what each copy carries, so a dropped shape stays dropped", () => {
    const watch = everything();
    const phone = copyForOwner(watch, { id: "P", slotIndex: 1, hidden: false, families: ["circular", "small"] }, LINK);
    const picks = picksFromCopies(linkedCopies([record("w1", watch), record("p1", phone)], LINK));
    expect([...picks.get("p1")!]).toEqual(["circular", "small"]);
  });
});

describe("linkedSaveStatus", () => {
  it("says which device has it and which is still to come", () => {
    expect(linkedSaveStatus([
      { label: "Jesse's Watch", state: "saved" },
      { label: "Jesse's iPhone", state: "waiting" },
    ])).toBe("Saved on Jesse's Watch, waiting for Jesse's iPhone.");
  });

  it("says nothing about a complication on one device", () => {
    expect(linkedSaveStatus([{ label: "Jesse's Watch", state: "saved" }])).toBeUndefined();
  });

  // A store refusal is about that device, not about the save.
  it("names a refusal against its own device and keeps the rest saved", () => {
    expect(linkedSaveStatus([
      { label: "Jesse's Watch", state: "saved" },
      { label: "Jesse's iPhone", state: "failed", message: "owner already has 20 complications" },
    ])).toBe("Saved on Jesse's Watch. Jesse's iPhone: owner already has 20 complications.");
  });

  it("names both when neither has synced yet", () => {
    expect(linkedSaveStatus([
      { label: "Jesse's Watch", state: "waiting" },
      { label: "Jesse's iPhone", state: "waiting" },
    ])).toBe("Saved, waiting for Jesse's Watch and Jesse's iPhone.");
  });
});

describe("mergeLinkedContent", () => {
  /** A watch design and a phone design of the same idea, built apart. */
  function pair() {
    const watch = legacyConfig("Kitchen", 0, ["rectangular", "circular", "corner"]);
    const wtext = newElement("text");
    watch.elements = [wtext];
    place(watch, "rectangular", wtext.payload.id);
    const phone = newConfig("Kitchen tiles", 3, "rectangular");
    addFamily(phone, "medium");
    const ptext = newElement("text");
    phone.elements = [ptext];
    place(phone, "medium", ptext.payload.id);
    return { watch, phone, wtext, ptext };
  }

  it("keeps the watch copy whole and brings over the shapes it lacks", () => {
    const { watch, phone, wtext, ptext } = pair();
    const merged = mergeLinkedContent(watch, phone);
    expect(merged.supportedFamilies).toEqual(["rectangular", "circular", "corner", "medium"]);
    expect(merged.perFamily.medium).toBeDefined();
    expect(merged.elements.map((e) => e.payload.id)).toEqual([wtext.payload.id, ptext.payload.id]);
    // The shape both of them draw keeps the watch's design.
    expect(Object.keys(merged.perFamily.rectangular!.placements)).toEqual([wtext.payload.id]);
  });

  it("keeps the primary's identity and leaves both arguments alone", () => {
    const { watch, phone } = pair();
    const merged = mergeLinkedContent(watch, phone);
    expect(merged.id).toBe(watch.id);
    expect(merged.slotIndex).toBe(0);
    expect(merged.name).toBe("Kitchen");
    expect(watch.supportedFamilies).toEqual(["rectangular", "circular", "corner"]);
    expect(phone.elements).toHaveLength(1);
  });

  it("takes the other copy's Inline when the primary has none", () => {
    const { watch, phone } = pair();
    addFamily(phone, "inline");
    phone.inline = { value: literal("Kitchen 21") };
    const merged = mergeLinkedContent(watch, phone);
    expect(merged.supportedFamilies).toContain("inline");
    expect(merged.inline).toEqual({ value: literal("Kitchen 21") });
  });

  it("takes a control the primary does not have, and never replaces one it has", () => {
    const { watch, phone } = pair();
    phone.control = { ...defaultControlSpec(phone), symbol: "lightbulb" };
    expect(mergeLinkedContent(watch, phone).control?.symbol).toBe("lightbulb");
    watch.control = { ...defaultControlSpec(watch), symbol: "fork.knife" };
    expect(mergeLinkedContent(watch, phone).control?.symbol).toBe("fork.knife");
  });

  // The pair the automatic merge is for began as copies of each other, so the
  // same layer id on both sides is one layer, not two.
  it("does not double a layer the two copies already share", () => {
    const { watch } = pair();
    const phone = structuredClone(watch);
    phone.id = "P";
    addFamily(phone, "small");
    place(phone, "small", phone.elements[0]!.payload.id);
    const merged = mergeLinkedContent(watch, phone);
    expect(merged.elements).toHaveLength(1);
    expect(merged.supportedFamilies).toContain("small");
  });

  it("brings a shared value a copied layer reads over with it", () => {
    const { watch, phone } = pair();
    phone.values = [{ id: "V1", name: "Target", value: literal("21") }];
    expect(mergeLinkedContent(watch, phone).values.map((v) => v.id)).toEqual(["V1"]);
  });

  it("changes nothing when the other copy has no shape the primary lacks", () => {
    const { watch } = pair();
    const phone = newConfig("Kitchen", 1, "rectangular");
    expect(mergeLinkedContent(watch, phone).supportedFamilies).toEqual(watch.supportedFamilies);
  });
});
