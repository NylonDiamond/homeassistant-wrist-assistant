// The Control Center list's model, merge and draft: a load and save with no
// edit gives the same bytes, what an add writes, duplicates refused,
// reorder, hide, reset, the merge by entity id, and the no-record path.

import { describe, expect, it } from "vitest";

import {
  ControlCenterDraft,
  forgetControlCenterDraft,
  keptControlCenterDraft,
  saveControlCenterDraft,
  startControlCenter,
  takeControlCenterRecord,
} from "../src/watch-control-center/draft.js";
import { controlCenterClashes, mergeControlCenter } from "../src/watch-control-center/merge.js";
import {
  type ControlCenterDocument,
  addControlCenterEntries,
  checkControlCenter,
  controlCenterEmpty,
  controlCenterEntries,
  controlCenterReadMeansUnsupported,
  controlCenterShown,
  controlCenterSummary,
  moveControlCenterEntry,
  newControlCenterEntry,
  readControlCenterEntry,
  removeControlCenterEntry,
  resetControlCenterEntry,
  setControlCenterHidden,
  setControlCenterIcon,
  setControlCenterName,
  setControlCenterTint,
} from "../src/watch-control-center/model.js";
import { CONTROL_CENTER_RULES, controlCenterDefaultIcon, controlCenterIsOn, controlCenterKind } from "../src/watch-control-center/rules.js";
import { controlCenterKeptText, controlCenterSaveNote } from "../src/watch-control-center/save-note.js";

/** A stored list as the phone writes it, with keys the editor does not
 * model on the document and on an entry. */
const STORED = `{"entities":[{"displayName":"Kitchen","domain":"light","entityId":"light.kitchen","iconName":"lightbulb","schemaVersion":1},{"customDisplayName":"Door","displayName":"Front Door","domain":"lock","entityId":"lock.front_door","futureKey":{"a":[1,2]},"iconName":"lock","isHidden":true,"schemaVersion":1,"tintColorHex":"#34D399"},{"displayName":"Movie","domain":"scene","entityId":"scene.movie","iconName":"play"},{"displayName":"Outside","domain":"sensor","entityId":"sensor.outside","iconName":"circle"}],"schemaVersion":1,"zNewer":"kept"}`;

function stored(): ControlCenterDocument {
  return JSON.parse(STORED) as ControlCenterDocument;
}

const STATES = {
  "light.kitchen": { state: "on", attributes: { friendly_name: "Kitchen Light" } },
  "light.porch": { state: "off", attributes: { friendly_name: "Porch" } },
  "switch.kettle": { state: "off", attributes: {} },
  "script.bedtime": { state: "off", attributes: { friendly_name: "Bedtime" } },
};

function ids(document: ControlCenterDocument): string[] {
  return controlCenterEntries(document).map((e) => e.entityId as string);
}

function entry(document: ControlCenterDocument, entityId: string) {
  return controlCenterEntries(document).find((e) => e.entityId === entityId)!;
}

describe("the rules table", () => {
  it("names the nine domains, the phone's icons and the keys", () => {
    expect(CONTROL_CENTER_RULES.toggleDomains).toEqual(["light", "switch", "fan", "input_boolean", "lock", "cover"]);
    expect(CONTROL_CENTER_RULES.actionDomains).toEqual(["scene", "script", "automation"]);
    expect(controlCenterDefaultIcon("cover")).toBe("blinds.horizontal.closed");
    expect(controlCenterDefaultIcon("input_boolean")).toBe("togglepower");
    expect(controlCenterDefaultIcon("sensor")).toBe("circle");
    expect(CONTROL_CENTER_RULES.requiredKeys).toEqual(["entityId", "displayName", "iconName", "domain"]);
    expect(controlCenterKind("lock")).toBe("toggle");
    expect(controlCenterKind("automation")).toBe("action");
    expect(controlCenterKind("sensor")).toBe("none");
  });

  it("reads a toggle's state as the watch does", () => {
    expect(controlCenterIsOn("lock", "unlocked")).toBe(true);
    expect(controlCenterIsOn("lock", "locked")).toBe(false);
    expect(controlCenterIsOn("cover", "open")).toBe(true);
    expect(controlCenterIsOn("cover", "closed")).toBe(false);
    expect(controlCenterIsOn("light", "ON")).toBe(true);
    expect(controlCenterIsOn("scene", "on")).toBeUndefined();
    expect(controlCenterIsOn("light", undefined)).toBeUndefined();
  });
});

describe("load and save", () => {
  it("gives the same bytes when nothing was edited", () => {
    const draft = new ControlCenterDraft(stored(), 4);
    expect(draft.dirty).toBe(false);
    expect(JSON.stringify(draft.document)).toBe(STORED);
  });

  it("keeps unknown keys on the document and on entries through an edit elsewhere", () => {
    const next = setControlCenterName(stored(), "light.kitchen", "Lamp");
    const out = JSON.parse(JSON.stringify(next));
    expect(out.zNewer).toBe("kept");
    expect(out.entities[1]).toEqual(JSON.parse(STORED).entities[1]);
    expect(JSON.stringify(out.entities[1])).toBe(JSON.stringify(JSON.parse(STORED).entities[1]));
    expect(out.entities[0].customDisplayName).toBe("Lamp");
  });

  it("reads entries, and knows which the watch leaves out", () => {
    const door = readControlCenterEntry(entry(stored(), "lock.front_door"));
    expect(door).toMatchObject({ entityId: "lock.front_door", customDisplayName: "Door", tintColorHex: "#34D399", isHidden: true });
    expect(controlCenterShown(readControlCenterEntry(entry(stored(), "sensor.outside")))).toBe(false);
    expect(controlCenterSummary(stored())).toBe("4 entities, 1 hidden.");
  });
});

describe("adding", () => {
  it("writes the entity's name, the domain's icon, the domain and the entry's schema stamp, keys sorted", () => {
    const fresh = newControlCenterEntry("light.porch", STATES);
    expect(JSON.stringify(fresh)).toBe(`{"displayName":"Porch","domain":"light","entityId":"light.porch","iconName":"lightbulb","schemaVersion":1}`);
    expect(newControlCenterEntry("switch.kettle", STATES)).toEqual({ displayName: "switch.kettle", domain: "switch", entityId: "switch.kettle", iconName: "switch.2", schemaVersion: 1 });
  });

  it("adds an entry the phone's stamped copy equals, so a deletion on a later merge is not undone", () => {
    // The panel adds and saves; the phone pulls, stores it stamped and
    // uploads that copy with another edit. A panel draft on the first save
    // that deletes the new entry must still delete it.
    const added = addControlCenterEntries(stored(), ["light.porch"], STATES).document;
    const stamped = {
      ...added,
      entities: controlCenterEntries(added).map((e) => (e["entityId"] === "light.porch" && e["schemaVersion"] === undefined ? { ...e, schemaVersion: 1 } : e)),
    };
    const phone = setControlCenterName(stamped, "light.kitchen", "Cooking");
    const local = removeControlCenterEntry(added, "light.porch");
    const merged = mergeControlCenter(added, local, phone);
    expect(ids(merged)).toEqual(["light.kitchen", "lock.front_door", "scene.movie", "sensor.outside"]);
  });

  it("adds at the end and refuses an entity on the list or named twice", () => {
    const out = addControlCenterEntries(stored(), ["light.porch", "light.kitchen", "script.bedtime", "light.porch", " "], STATES);
    expect(out.added).toEqual(["light.porch", "script.bedtime"]);
    expect(out.refused).toEqual(["light.kitchen", "light.porch", " "]);
    expect(ids(out.document)).toEqual(["light.kitchen", "lock.front_door", "scene.movie", "sensor.outside", "light.porch", "script.bedtime"]);
    expect(entry(out.document, "script.bedtime").iconName).toBe("scroll");
  });

  it("changes nothing when every one is refused", () => {
    const doc = stored();
    expect(addControlCenterEntries(doc, ["light.kitchen"]).document).toBe(doc);
  });

  it("starts an empty list with the schema stamped", () => {
    expect(controlCenterEmpty()).toEqual({ schemaVersion: 1, entities: [] });
    expect(checkControlCenter(controlCenterEmpty())).toEqual([]);
  });
});

describe("editing", () => {
  it("reorders, clamped", () => {
    expect(ids(moveControlCenterEntry(stored(), "scene.movie", 0))).toEqual(["scene.movie", "light.kitchen", "lock.front_door", "sensor.outside"]);
    expect(ids(moveControlCenterEntry(stored(), "light.kitchen", 99))).toEqual(["lock.front_door", "scene.movie", "sensor.outside", "light.kitchen"]);
    const doc = stored();
    expect(moveControlCenterEntry(doc, "light.kitchen", 0)).toBe(doc);
    expect(moveControlCenterEntry(doc, "light.none", 1)).toBe(doc);
  });

  it("removes", () => {
    expect(ids(removeControlCenterEntry(stored(), "lock.front_door"))).toEqual(["light.kitchen", "scene.movie", "sensor.outside"]);
  });

  it("hides with true and shows by leaving the key out", () => {
    const hidden = setControlCenterHidden(stored(), "light.kitchen", true);
    expect(entry(hidden, "light.kitchen").isHidden).toBe(true);
    const shown = setControlCenterHidden(stored(), "lock.front_door", false);
    expect(Object.hasOwn(entry(shown, "lock.front_door"), "isHidden")).toBe(false);
    expect(JSON.stringify(shown)).not.toContain("null");
  });

  it("sets the name, icon and tint, and leaves an empty one out", () => {
    let doc = setControlCenterName(stored(), "light.kitchen", "Lamp");
    doc = setControlCenterIcon(doc, "light.kitchen", "lamp.table.fill");
    doc = setControlCenterTint(doc, "light.kitchen", "#fbbf24");
    expect(entry(doc, "light.kitchen")).toMatchObject({ customDisplayName: "Lamp", customIconName: "lamp.table.fill", tintColorHex: "#FBBF24" });
    expect(Object.keys(entry(doc, "light.kitchen"))).toEqual(["customDisplayName", "customIconName", "displayName", "domain", "entityId", "iconName", "schemaVersion", "tintColorHex"]);
    doc = setControlCenterName(doc, "light.kitchen", "");
    expect(Object.hasOwn(entry(doc, "light.kitchen"), "customDisplayName")).toBe(false);
    const same = setControlCenterTint(doc, "light.kitchen", "not a colour");
    expect(same).toBe(doc);
  });

  it("resets to defaults by leaving every custom key out", () => {
    const doc = resetControlCenterEntry(stored(), "lock.front_door");
    const door = entry(doc, "lock.front_door");
    expect(door).toEqual({ displayName: "Front Door", domain: "lock", entityId: "lock.front_door", futureKey: { a: [1, 2] }, iconName: "lock", isHidden: true, schemaVersion: 1 });
    expect(resetControlCenterEntry(doc, "lock.front_door")).toBe(doc);
  });
});

describe("checks", () => {
  it("refuses what Home Assistant's shape check refuses", () => {
    expect(checkControlCenter({ entities: "no" })).toEqual(["The Control Center list is missing."]);
    const problems = checkControlCenter({ entities: [{ entityId: "light.a", displayName: "A", iconName: "x", domain: "light" }, { entityId: "light.a", displayName: "B", iconName: "x", domain: "light" }, { displayName: "C" }] });
    expect(problems).toEqual(["light.a is on the list twice.", "Entry 3 has no entity.", "Entry 3 has no iconName.", "Entry 3 has no domain."]);
    expect(controlCenterReadMeansUnsupported({ code: "invalid", message: "kind" })).toBe(true);
    expect(controlCenterReadMeansUnsupported({ code: "not_found", message: "x" })).toBe(false);
  });
});

describe("merge by entity id", () => {
  const base = (): ControlCenterDocument => stored();

  it("keeps this side's copy of an entry both sides changed, and names it", () => {
    const local = setControlCenterName(base(), "light.kitchen", "Mine");
    const server = setControlCenterName(base(), "light.kitchen", "Theirs");
    const merged = mergeControlCenter(base(), local, server);
    expect(entry(merged, "light.kitchen").customDisplayName).toBe("Mine");
    expect(controlCenterClashes(base(), local, server)).toEqual([{ entityId: "light.kitchen", name: "Mine" }]);
  });

  it("takes each side's change to different entries", () => {
    const local = setControlCenterHidden(base(), "light.kitchen", true);
    const server = setControlCenterTint(base(), "scene.movie", "#EF4444");
    const merged = mergeControlCenter(base(), local, server);
    expect(entry(merged, "light.kitchen").isHidden).toBe(true);
    expect(entry(merged, "scene.movie").tintColorHex).toBe("#EF4444");
    expect(controlCenterClashes(base(), local, server)).toEqual([]);
  });

  it("drops an entry deleted on one side the other left alone, and keeps one the other changed", () => {
    const local = removeControlCenterEntry(base(), "scene.movie");
    const server = setControlCenterName(removeControlCenterEntry(base(), "light.kitchen"), "lock.front_door", "Front");
    const merged = mergeControlCenter(base(), local, server);
    expect(ids(merged)).toEqual(["lock.front_door", "sensor.outside"]);
    const changedThere = mergeControlCenter(base(), local, setControlCenterName(base(), "scene.movie", "Film"));
    expect(ids(changedThere)).toContain("scene.movie");
    expect(entry(changedThere, "scene.movie").customDisplayName).toBe("Film");
  });

  it("keeps entries both sides added, the draft's after the server's", () => {
    const local = addControlCenterEntries(base(), ["light.porch"], STATES).document;
    const server = addControlCenterEntries(base(), ["script.bedtime"], STATES).document;
    expect(ids(mergeControlCenter(base(), local, server))).toEqual(["light.kitchen", "lock.front_door", "scene.movie", "sensor.outside", "script.bedtime", "light.porch"]);
  });

  it("takes the draft's order when the draft reordered", () => {
    const local = moveControlCenterEntry(base(), "sensor.outside", 0);
    const server = addControlCenterEntries(base(), ["light.porch"], STATES).document;
    expect(ids(mergeControlCenter(base(), local, server))).toEqual(["sensor.outside", "light.kitchen", "lock.front_door", "scene.movie", "light.porch"]);
  });

  it("deletes nothing with no base: the base is the entries both hold", () => {
    const local = addControlCenterEntries(removeControlCenterEntry(base(), "scene.movie"), ["light.porch"], STATES).document;
    const server = setControlCenterName(base(), "lock.front_door", "Theirs");
    const merged = mergeControlCenter(undefined, setControlCenterName(local, "lock.front_door", "Mine"), server);
    expect(ids(merged).sort()).toEqual(["light.kitchen", "light.porch", "lock.front_door", "scene.movie", "sensor.outside"]);
    expect(entry(merged, "lock.front_door").customDisplayName).toBe("Mine");
  });

  it("keeps the top-level keys by key", () => {
    const local = { ...base(), zNewer: "mine" };
    const server = { ...base(), other: 1 };
    const merged = mergeControlCenter(base(), local, server);
    expect(merged.zNewer).toBe("mine");
    expect(merged.other).toBe(1);
  });
});

describe("the draft", () => {
  it("rebases edits onto a newer record and keeps its own copy on a clash", () => {
    const draft = new ControlCenterDraft(stored(), 2);
    draft.apply(setControlCenterName(draft.document, "light.kitchen", "Mine"));
    draft.apply(setControlCenterHidden(draft.document, "scene.movie", true));
    const server = setControlCenterName(setControlCenterTint(stored(), "lock.front_door", "#FFFFFF"), "light.kitchen", "Theirs");
    expect(draft.rebase(server, 3)).toBe(true);
    expect(draft.kept).toEqual([{ entityId: "light.kitchen", name: "Mine" }]);
    expect(entry(draft.document, "light.kitchen").customDisplayName).toBe("Mine");
    expect(entry(draft.document, "scene.movie").isHidden).toBe(true);
    expect(draft.revision).toBe(3);
    // Undo walks back over the merged steps, never past the server's change.
    draft.undo();
    draft.undo();
    expect(entry(draft.document, "light.kitchen").customDisplayName).toBe("Theirs");
    expect(draft.dirty).toBe(false);
  });

  it("saves with the base revision and merges after a conflict", async () => {
    const draft = new ControlCenterDraft(stored(), 5);
    draft.apply(setControlCenterName(draft.document, "light.kitchen", "Mine"));
    const server = setControlCenterHidden(stored(), "scene.movie", true);
    const sent: number[] = [];
    let first = true;
    const result = await saveControlCenterDraft(draft, {
      save: async (rev) => {
        sent.push(rev);
        if (first) {
          first = false;
          throw Object.assign(new Error("conflict"), { code: "conflict" });
        }
        return { revision: 7 };
      },
      fetch: async () => ({ revision: 6, document: server }),
    });
    expect(sent).toEqual([5, 6]);
    expect(result).toMatchObject({ ok: true, revision: 7, merged: true });
    expect(draft.dirty).toBe(false);
    expect(entry(draft.document, "scene.movie").isHidden).toBe(true);
    expect(controlCenterSaveNote(result)?.text).toBe("Saved. Changes made somewhere else were merged in.");
  });

  it("does not send a list Home Assistant would refuse", async () => {
    const bad = { entities: [{ entityId: "light.a", displayName: "A", iconName: "x", domain: "light" }] };
    const draft = new ControlCenterDraft(bad, 1);
    draft.apply({ entities: [...bad.entities, { entityId: "light.a", displayName: "B", iconName: "x", domain: "light" }] });
    let called = false;
    const result = await saveControlCenterDraft(draft, { save: async () => { called = true; return { revision: 2 }; }, fetch: async () => ({ revision: 1, document: bad }) });
    expect(called).toBe(false);
    expect(result.code).toBe("invalid");
  });

  it("names a clash in the save note", () => {
    expect(controlCenterKeptText([{ entityId: "light.kitchen", name: "Kitchen" }])).toBe(`Another save also changed "Kitchen". Your version was kept.`);
    expect(controlCenterKeptText([{ entityId: "a.b", name: "" }, { entityId: "c.d", name: "D" }])).toBe(`Another save also changed "a.b" and "D". Your versions were kept.`);
  });
});

describe("no record", () => {
  it("starts with an empty list over revision 0", async () => {
    let sent: { rev: number; doc: ControlCenterDocument } | undefined;
    const result = await startControlCenter(controlCenterEmpty(), async (rev, doc) => {
      sent = { rev, doc };
      return { revision: 1 };
    });
    expect(result).toEqual({ ok: true, revision: 1 });
    expect(sent).toEqual({ rev: 0, doc: { schemaVersion: 1, entities: [] } });
  });

  it("says when the watch is not paired, a record came meanwhile, or the integration is too old", async () => {
    const fail = (code: string) => async () => { throw Object.assign(new Error(code), { code }); };
    expect(await startControlCenter(controlCenterEmpty(), fail("no_record"))).toMatchObject({ ok: false, code: "no_record" });
    expect(await startControlCenter(controlCenterEmpty(), fail("conflict"))).toMatchObject({ ok: false, code: "conflict" });
    expect(await startControlCenter(controlCenterEmpty(), fail("unknown_command"))).toMatchObject({ ok: false, code: "unsupported" });
    expect(await startControlCenter(controlCenterEmpty(), fail("invalid"))).toMatchObject({ ok: false, code: "unsupported" });
  });

  it("keeps an unsaved draft while the record is gone, and merges it back when one returns", () => {
    const watch = "test-watch-no-record";
    forgetControlCenterDraft(watch);
    const first = takeControlCenterRecord(watch, stored(), 3).draft;
    first.apply(setControlCenterName(first.document, "light.kitchen", "Mine"));
    expect(takeControlCenterRecord(watch, {}, 0).draft).toBe(first);
    expect(keptControlCenterDraft(watch)?.dirty).toBe(true);
    const back = takeControlCenterRecord(watch, setControlCenterHidden(stored(), "scene.movie", true), 4);
    expect(back.mergedIntoEdits).toBe(true);
    expect(entry(back.draft.document, "light.kitchen").customDisplayName).toBe("Mine");
    expect(entry(back.draft.document, "scene.movie").isHidden).toBe(true);
    forgetControlCenterDraft(watch);
  });
});
