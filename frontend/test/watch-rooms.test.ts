// The Rooms editor: the rules against the app's table (`room-rules.json`,
// written by the app's RoomRulesTableTests), the key writes it makes, the
// room list, the save and its merge on a conflict, the draft, the route and
// the cards.

import { describe, expect, it } from "vitest";

import type { HassLike, OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import { RoomsDraft, saveRoomsDraft, takeRoomsRecord, forgetRoomsDraft } from "../src/watch-rooms/draft.js";
import {
  WATCH_ROOMS_PATH,
  isWatchRoomsRoute,
  renderWatchRoomsButton,
  watchRoomsRouteOwner,
  watchRoomsUrl,
} from "../src/watch-rooms/hook.js";
import {
  type BehaviorDocument,
  applyRoomEdits,
  areasFromReply,
  clearSensorWrites,
  fallbackChoice,
  fallbackWrites,
  historyFromReply,
  mergeRoomList,
  pointSwitchWrites,
  readRooms,
  roomDirtyKeys,
  roomPage,
  roomPageChoices,
  roomPageWrites,
  roomSwitchTrigger,
  roomSwitchingOn,
  roomZones,
  roomZonesWrites,
  roomsSaveNote,
  saveRooms,
  sensorWrites,
  switchingWritesFor,
  triggerWrites,
  withRoomWrites,
} from "../src/watch-rooms/model.js";
import {
  type PointRooms,
  type PointZone,
  POINT_CONTROL_DOMAINS,
  ROOM_RULES,
  cleanZones,
  compassPoint,
  decodeZones,
  encodeZones,
  isRoomValue,
  normalizedRoomKey,
  roomFromState,
  wrapHeading,
} from "../src/watch-rooms/rules.js";
import { type RoomsViewHost, headingAt, renderRoomsBody, sensorReading } from "../src/watch-rooms/view.js";

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

const roomsObject = (rooms: PointRooms): Record<string, PointZone[]> => Object.fromEntries(rooms);

const KITCHEN_PAGE = "6F1C2A10-0000-4000-8000-000000000001";
const DEN_PAGE = "6F1C2A10-0000-4000-8000-000000000002";

/** A behavior document as the phone writes one, with keys this editor never
 * touches and its own keys set. */
function behavior(extra: BehaviorDocument = {}): BehaviorDocument {
  return {
    crownSensitivity: "Normal",
    crownSwitchesPages: false,
    doubleTapSpeed: "Fast",
    hapticIntensity: "Medium",
    motionGestureActionsJSON: "{\"Twist Clockwise\":\"Toggle Aimed Entity\"}",
    pendingAnimationDisabledDomains: ["light", "switch"],
    someKeyFromANewerApp: { nested: [1, 2, 3] },
    roomQuickJumpSourceEntityId: "sensor.watch_area",
    roomQuickJumpEnabled: false,
    roomAutoSwitchEnabled: true,
    roomQuickJumpMappings: { kitchen: KITCHEN_PAGE, "Living-Room": DEN_PAGE },
    pointControlRoomMappingsJSON: "{\"kitchen\":[{\"centerHeading\":90,\"entityId\":\"light.kitchen\",\"label\":\"Pendant \\/ Bar\"}]}",
    topSectionDoubleTapAction: "Disabled",
    handGestureAction: "Refresh",
    schemaVersion: 1,
    ...extra,
  };
}

/** The document after some writes, the way a save would send it. */
function after(doc: BehaviorDocument, writes: ReadonlyMap<string, unknown>): BehaviorDocument {
  return applyRoomEdits(doc, withRoomWrites(doc, new Map(), writes));
}

function switchingState(doc: BehaviorDocument): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of ROOM_RULES.switching.keys) if (Object.hasOwn(doc, key)) out[key] = doc[key];
  return out;
}

describe("the rules match the app's table", () => {
  it("normalizes every room name as the watch does", () => {
    expect(ROOM_RULES.normalize.cases.length).toBeGreaterThan(10);
    for (const c of ROOM_RULES.normalize.cases) expect(normalizedRoomKey(c.input), JSON.stringify(c.input)).toBe(c.key);
  });

  it("tells a room from a state that is not one", () => {
    for (const c of ROOM_RULES.roomValue.cases) expect(isRoomValue(c.input), JSON.stringify(c.input)).toBe(c.room);
  });

  it("makes each When to Switch write, the switch and the sensor clear as the phone does", () => {
    expect(ROOM_RULES.switching.cases.length).toBe(36);
    for (const c of ROOM_RULES.switching.cases) {
      const doc = behavior();
      for (const key of ROOM_RULES.switching.keys) delete doc[key];
      Object.assign(doc, c.before);
      const writes = c.op.trigger !== undefined ? triggerWrites(doc, c.op.trigger)
        : c.op.switch !== undefined ? switchingWritesFor(doc, c.op.switch)
          : clearSensorWrites(doc);
      const out = after(doc, writes);
      expect(switchingState(out), JSON.stringify(c)).toEqual(c.after);
      // Nothing outside the five keys moves.
      for (const key of Object.keys(doc)) if (!ROOM_RULES.switching.keys.includes(key)) expect(out[key]).toEqual(doc[key]);
    }
  });

  it("reads Switch pages by room and When as the phone shows them", () => {
    for (const c of ROOM_RULES.switching.readCases) {
      expect(roomSwitchingOn(c.document), JSON.stringify(c)).toBe(c.on);
      expect(roomSwitchTrigger(c.document), JSON.stringify(c)).toBe(c.trigger);
    }
  });

  it("cleans the point control rooms as the phone does", () => {
    for (const c of ROOM_RULES.zones.cleanCases) {
      const cleaned = cleanZones(Object.entries(c.input));
      expect(cleaned === undefined ? null : roomsObject(cleaned), JSON.stringify(c.input)).toEqual(c.output);
    }
  });

  it("encodes rooms to a string that says what the phone's does, slashes and all", () => {
    for (const c of ROOM_RULES.zones.encodeCases) {
      const json = encodeZones(Object.entries(c.rooms));
      expect(JSON.parse(json)).toEqual(c.parsed);
      expect(json.includes("\\/")).toBe(c.slashEscaped);
    }
  });

  it("decodes a stored string as the phone and the watch do", () => {
    for (const c of ROOM_RULES.zones.decodeCases) {
      const read = decodeZones(c.json);
      expect(read.ok ? roomsObject(read.rooms) : {}, c.json).toEqual(c.rooms);
    }
  });

  it("offers the phone's point control domains and keeps the sentinel", () => {
    expect(POINT_CONTROL_DOMAINS).toEqual(["light", "switch", "fan", "cover", "scene", "script", "climate", "media_player", "lock", "input_boolean"]);
    expect(ROOM_RULES.fallback.stay).toBe("__stay__");
    expect(ROOM_RULES.fallback.firstAvailable).toBeNull();
  });
});

describe("reading a room from the sensor", () => {
  it("takes a state, else location_name, and a person's state only", () => {
    expect(roomFromState("sensor.area", { state: "Kitchen", attributes: {} })).toBe("Kitchen");
    expect(roomFromState("device_tracker.watch", { state: "home", attributes: { location_name: "Office" } })).toBe("Office");
    expect(roomFromState("person.jesse", { state: "home", attributes: { location_name: "Office" } })).toBeUndefined();
    expect(roomFromState("person.jesse", { state: "Garden", attributes: {} })).toBe("Garden");
    expect(roomFromState("sensor.area", { state: "unknown", attributes: {} })).toBeUndefined();
    expect(roomFromState("sensor.area", undefined)).toBeUndefined();
  });

  it("says what the sensor reads now", () => {
    const hass = { states: { "sensor.area": { state: "Living Room", attributes: {} }, "sensor.off": { state: "unavailable", attributes: {} } } } as unknown as HassLike;
    expect(sensorReading(hass, "sensor.area")).toEqual({ line: "Now in Living Room.", tone: "ok" });
    expect(sensorReading(hass, "sensor.off").tone).toBe("warn");
    expect(sensorReading(hass, "sensor.gone").line).toContain("no entity");
    expect(sensorReading(hass, "").tone).toBe("none");
  });
});

describe("a load and a save with no edit", () => {
  it("gives the very document that was read", () => {
    const doc = behavior();
    const bytes = JSON.stringify(doc);
    expect(JSON.stringify(applyRoomEdits(doc, new Map()))).toBe(bytes);
    const draft = new RoomsDraft(doc, 4);
    expect(draft.dirty).toBe(false);
    expect(JSON.stringify(draft.effective)).toBe(bytes);
    expect(roomDirtyKeys(doc, new Map())).toEqual([]);
  });

  it("drops an edit set back to what is stored, and never writes null", () => {
    const doc = behavior();
    let edits = withRoomWrites(doc, new Map(), pointSwitchWrites("pointControlTapToToggle", true));
    expect(roomDirtyKeys(doc, edits)).toEqual(["pointControlTapToToggle"]);
    edits = withRoomWrites(doc, edits, pointSwitchWrites("pointControlTapToToggle", false));
    expect(edits.has("pointControlTapToToggle")).toBe(false);
    // An absent switch reads as off; turning it off writes nothing.
    expect(withRoomWrites(doc, new Map(), new Map([["pointControlTapToToggle", undefined]])).size).toBe(0);
    const cleared = after(doc, sensorWrites(doc, ""));
    expect(JSON.stringify(cleared)).not.toContain("null");
    expect(Object.hasOwn(cleared, "roomQuickJumpSourceEntityId")).toBe(false);
  });

  it("keeps a key it does not know through an edit", () => {
    const doc = behavior();
    const out = after(doc, pointSwitchWrites("pointControlLiveTile", true));
    expect(out.someKeyFromANewerApp).toEqual({ nested: [1, 2, 3] });
    expect(out.motionGestureActionsJSON).toBe(doc.motionGestureActionsJSON);
    expect(out.pointControlLiveTile).toBe(true);
  });
});

describe("the writes", () => {
  it("picks a sensor by writing its id only", () => {
    const doc = behavior();
    expect([...sensorWrites(doc, " sensor.bermuda_area ")]).toEqual([["roomQuickJumpSourceEntityId", "sensor.bermuda_area"]]);
  });

  it("clears the sensor, turning off auto switch and any Room Jump gesture", () => {
    const doc = behavior({ handGestureAction: "Room Jump", topSectionDoubleTapAction: "Room Jump", roomAutoSwitchEnabled: true });
    const out = after(doc, sensorWrites(doc, ""));
    expect(out.roomAutoSwitchEnabled).toBe(false);
    expect(out.roomQuickJumpEnabled).toBe(false);
    expect(out.handGestureAction).toBe("Refresh");
    expect(out.topSectionDoubleTapAction).toBe("Disabled");
    expect(readRooms(out).switching).toBe(false);
  });

  it("writes each When as the phone does, the old quick jump always off", () => {
    const doc = behavior({ roomQuickJumpEnabled: true, roomAutoSwitchEnabled: false });
    const auto = after(doc, triggerWrites(doc, "Automatic"));
    expect([auto.roomAutoSwitchEnabled, auto.roomQuickJumpEnabled, auto.handGestureAction]).toEqual([true, false, "Refresh"]);
    const top = after(doc, triggerWrites(doc, "Double-Tap Top"));
    expect([top.roomAutoSwitchEnabled, top.topSectionDoubleTapAction, top.handGestureAction]).toEqual([false, "Room Jump", "Refresh"]);
    const pinch = after(top, triggerWrites(top, "Double Pinch"));
    expect([pinch.roomAutoSwitchEnabled, pinch.topSectionDoubleTapAction, pinch.handGestureAction]).toEqual([false, "Disabled", "Room Jump"]);
    expect(readRooms(pinch).trigger).toBe("Double Pinch");
  });

  it("stores each fallback", () => {
    const doc = behavior({ roomQuickJumpFallbackPageId: DEN_PAGE });
    expect(after(doc, fallbackWrites("__stay__")).roomQuickJumpFallbackPageId).toBe("__stay__");
    expect(Object.hasOwn(after(doc, fallbackWrites("")), "roomQuickJumpFallbackPageId")).toBe(false);
    expect(after(behavior(), fallbackWrites(KITCHEN_PAGE)).roomQuickJumpFallbackPageId).toBe(KITCHEN_PAGE);
    expect(fallbackChoice("")).toBe("first");
    expect(fallbackChoice("__stay__")).toBe("stay");
    expect(fallbackChoice(DEN_PAGE)).toBe("page");
    expect(readRooms(behavior({ roomQuickJumpFallbackPageId: " __stay__ " })).fallback).toBe("__stay__");
  });

  it("adds, changes and removes a room's page under its normalized name", () => {
    const doc = behavior();
    const view = readRooms(doc);
    expect(roomPage(view, "living room")).toBe(DEN_PAGE);
    // Changing a room stored under another spelling moves it to the normalized name.
    const changed = after(doc, roomPageWrites(doc, "living room", KITCHEN_PAGE));
    expect(changed.roomQuickJumpMappings).toEqual({ kitchen: KITCHEN_PAGE, "living room": KITCHEN_PAGE });
    const added = after(doc, roomPageWrites(doc, "office", DEN_PAGE));
    expect((added.roomQuickJumpMappings as Record<string, string>).office).toBe(DEN_PAGE);
    const removed = after(doc, roomPageWrites(doc, "kitchen", ""));
    expect(removed.roomQuickJumpMappings).toEqual({ "Living-Room": DEN_PAGE });
    const none = after(removed, roomPageWrites(removed, "living room", ""));
    expect(Object.hasOwn(none, "roomQuickJumpMappings")).toBe(false);
  });

  it("changes a room's targets and writes the string again only when it says something new", () => {
    const doc = behavior();
    const view = readRooms(doc);
    expect(view.zones.ok).toBe(true);
    if (!view.zones.ok) return;
    const zones = roomZones(view.zones.rooms, "kitchen");
    expect(zones).toEqual([{ entityId: "light.kitchen", centerHeading: 90, label: "Pendant / Bar" }]);
    // The same targets: nothing to write, the stored bytes stay.
    expect(roomZonesWrites(doc, "kitchen", zones)?.size).toBe(0);
    const turned = after(doc, roomZonesWrites(doc, "kitchen", [{ ...zones[0]!, centerHeading: 270 }])!);
    expect(turned.pointControlRoomMappingsJSON).toBe("{\"kitchen\":[{\"entityId\":\"light.kitchen\",\"centerHeading\":270,\"label\":\"Pendant \\/ Bar\"}]}");
    const two = after(doc, roomZonesWrites(doc, "den", [{ entityId: "fan.den", centerHeading: 10 }])!);
    expect(decodeZones(two.pointControlRoomMappingsJSON)).toEqual({ ok: true, rooms: [
      ["kitchen", zones],
      ["den", [{ entityId: "fan.den", centerHeading: 10 }]],
    ] });
    // The last target out of one of two rooms keeps that room, as the phone does.
    const emptied = decodeZones(after(two, roomZonesWrites(two, "den", [])!).pointControlRoomMappingsJSON);
    expect(emptied.ok && roomsObject(emptied.rooms)).toEqual({ kitchen: zones, den: [] });
    // No target left anywhere: no key at all.
    const gone = after(doc, roomZonesWrites(doc, "kitchen", [])!);
    expect(Object.hasOwn(gone, "pointControlRoomMappingsJSON")).toBe(false);
  });

  it("folds a room stored under another spelling into its normalized name", () => {
    const doc = behavior({ pointControlRoomMappingsJSON: "{\"living-room\":[{\"entityId\":\"light.a\",\"centerHeading\":0}]}" });
    const read = readRooms(doc).zones;
    expect(read.ok && roomZones(read.rooms, "living room")).toEqual([{ entityId: "light.a", centerHeading: 0 }]);
    const out = after(doc, roomZonesWrites(doc, "living room", [{ entityId: "light.a", centerHeading: 45 }])!);
    expect(out.pointControlRoomMappingsJSON).toBe("{\"living room\":[{\"entityId\":\"light.a\",\"centerHeading\":45}]}");
  });

  it("writes nothing over targets it cannot read", () => {
    const doc = behavior({ pointControlRoomMappingsJSON: "{\"den\":[{\"entityId\":\"light.a\"}]}" });
    expect(readRooms(doc).zones.ok).toBe(false);
    expect(roomZonesWrites(doc, "den", [])).toBeUndefined();
  });

  it("keeps headings whole degrees from 0 to 359", () => {
    expect(wrapHeading(360)).toBe(0);
    expect(wrapHeading(-1)).toBe(359);
    expect(wrapHeading(89.6)).toBe(90);
    expect(compassPoint(0)).toBe("N");
    expect(compassPoint(100)).toBe("E");
    expect(compassPoint(350)).toBe("N");
    expect(headingAt(32, 0, 32, 32)).toBe(0);
    expect(headingAt(64, 32, 32, 32)).toBe(90);
    expect(headingAt(32, 64, 32, 32)).toBe(180);
    expect(headingAt(0, 32, 32, 32)).toBe(270);
  });
});

describe("the pages and the room list", () => {
  it("offers the pages that are neither system nor hidden", () => {
    const pages = { pages: [
      { id: "A", name: "Home" },
      { id: "B", name: "Status", isSystemPage: true },
      { id: "C", name: "Secret", isHidden: true },
      { id: "D", name: " " },
    ] };
    expect(roomPageChoices(pages)).toEqual([{ id: "A", name: "Home" }, { id: "D", name: "Untitled page" }]);
    expect(roomPageChoices(undefined)).toEqual([]);
  });

  it("merges areas, aliases, stored rooms, the sensor's states and added names by normalized name", () => {
    const now = Date.parse("2026-10-05T12:00:00Z");
    const list = mergeRoomList({
      areas: [{ name: "Living Room", aliases: ["Lounge"] }, { name: "Kitchen" }, { name: "living_room" }],
      mappingKeys: ["kitchen", "Office"],
      zoneKeys: ["garage"],
      history: [
        { state: "Kitchen", at: now - 3_600_000 },
        { state: "kitchen", at: now - 60_000 },
        { state: "Bathroom", at: now - 7_200_000 },
        { state: "unavailable", at: now },
        { state: "42", at: now },
      ],
      added: ["Attic", "  "],
    });
    expect(list.map((r) => r.key)).toEqual(["kitchen", "bathroom", "attic", "garage", "living room", "lounge", "office"]);
    expect(list[0]).toEqual({ key: "kitchen", name: "Kitchen", area: true, lastSeen: now - 60_000 });
    expect(list.find((r) => r.key === "bathroom")?.name).toBe("Bathroom");
    expect(list.find((r) => r.key === "living room")).toEqual({ key: "living room", name: "Living Room", area: true });
    expect(list.find((r) => r.key === "office")?.name).toBe("Office");
  });

  it("reads Home Assistant's replies", () => {
    expect(areasFromReply([{ area_id: "k", name: "Kitchen", aliases: ["Cook", 3] }, { area_id: "x" }])).toEqual([{ name: "Kitchen", aliases: ["Cook"] }]);
    expect(areasFromReply(null)).toEqual([]);
    expect(historyFromReply({ "sensor.a": [{ s: "Kitchen", lu: 1700000000 }, { s: "Den", lu: 1700000100, lc: 1700000050 }] }, "sensor.a"))
      .toEqual([{ state: "Kitchen", at: 1700000000000 }, { state: "Den", at: 1700000050000 }]);
    expect(historyFromReply({ "sensor.a": [{ state: "Hall", last_changed: "2026-10-05T10:00:00Z" }] }, "sensor.a"))
      .toEqual([{ state: "Hall", at: Date.parse("2026-10-05T10:00:00Z") }]);
    expect(historyFromReply({}, "sensor.a")).toEqual([]);
  });
});

describe("saving", () => {
  function record(revision: number, document: BehaviorDocument): WatchConfigRecord {
    return { kind: "behavior", revision, hash: null, updated_at: null, updated_by: "W1", delivered_revision: revision, delivered_at: null, document };
  }

  it("sends the edits over the base revision", async () => {
    const doc = behavior();
    const sent: { base: number; doc: BehaviorDocument }[] = [];
    const result = await saveRooms({
      save: async (base, d) => { sent.push({ base, doc: d }); return { revision: base + 1 }; },
      fetch: async () => record(4, doc),
    }, { revision: 4, document: doc }, withRoomWrites(doc, new Map(), fallbackWrites("__stay__")));
    expect(result).toMatchObject({ ok: true, revision: 5, merged: false });
    expect(sent).toHaveLength(1);
    expect(sent[0]!.base).toBe(4);
    expect(sent[0]!.doc.roomQuickJumpFallbackPageId).toBe("__stay__");
  });

  it("merges by key on a conflict: the newer copy's other keys stay, the edits go on top", async () => {
    const doc = behavior();
    const fresh = { ...behavior(), hapticIntensity: "Strong", roomQuickJumpSourceEntityId: "sensor.other" };
    const edits = withRoomWrites(doc, new Map(), pointSwitchWrites("pointControlLiveTile", true));
    const sent: { base: number; doc: BehaviorDocument }[] = [];
    let first = true;
    const result = await saveRooms({
      save: async (base, d) => {
        sent.push({ base, doc: d });
        if (first) { first = false; throw { code: "conflict", message: "stored revision is 7" }; }
        return { revision: base + 1 };
      },
      fetch: async () => record(7, fresh),
    }, { revision: 4, document: doc }, edits);
    expect(result).toMatchObject({ ok: true, revision: 8, merged: true, alreadySaved: false });
    expect(sent[1]!.base).toBe(7);
    expect(sent[1]!.doc).toEqual({ ...fresh, pointControlLiveTile: true });
    expect(roomsSaveNote(result)?.text).toContain("changed elsewhere");
  });

  it("finds nothing left to save when the newer copy already has the edits", async () => {
    const doc = behavior();
    const edits = withRoomWrites(doc, new Map(), pointSwitchWrites("pointControlLiveTile", true));
    const result = await saveRooms({
      save: async () => { throw { code: "conflict", message: "stored revision is 9" }; },
      fetch: async () => record(9, { ...doc, pointControlLiveTile: true }),
    }, { revision: 4, document: doc }, edits);
    expect(result).toMatchObject({ ok: true, revision: 9, alreadySaved: true });
  });

  it("ends on any other refusal", async () => {
    const doc = behavior();
    const result = await saveRooms({
      save: async () => { throw { code: "unavailable", message: "busy" }; },
      fetch: async () => record(4, doc),
    }, { revision: 4, document: doc }, withRoomWrites(doc, new Map(), fallbackWrites("")));
    expect(result).toMatchObject({ ok: false, code: "unavailable" });
    expect(roomsSaveNote(result)?.kind).toBe("warn");
  });
});

describe("the draft", () => {
  it("undoes, redoes, and keeps its edits on top of a newer copy", () => {
    const doc = behavior();
    const draft = new RoomsDraft(doc, 3);
    expect(draft.apply(fallbackWrites("__stay__"))).toBe(true);
    expect(draft.apply(pointSwitchWrites("pointControlTapToToggle", true))).toBe(true);
    expect(draft.dirty).toBe(true);
    expect(draft.undo()).toBe(true);
    expect(draft.effective.pointControlTapToToggle).toBeUndefined();
    expect(draft.redo()).toBe(true);
    expect(draft.rebase({ ...doc, hapticIntensity: "Strong" }, 4)).toBe(true);
    expect(draft.effective).toMatchObject({ hapticIntensity: "Strong", roomQuickJumpFallbackPageId: "__stay__", pointControlTapToToggle: true });
    // A newer copy that already says the same leaves nothing to save.
    expect(draft.rebase({ ...doc, roomQuickJumpFallbackPageId: "__stay__", pointControlTapToToggle: true }, 5)).toBe(false);
    expect(draft.dirty).toBe(false);
  });

  it("keeps its undo and redo steps when asked for them during a save", () => {
    const draft = new RoomsDraft(behavior(), 3);
    draft.apply(fallbackWrites("__stay__"));
    draft.apply(pointSwitchWrites("pointControlTapToToggle", true));
    draft.undo();
    draft.saving = true;
    expect(draft.undo()).toBe(false);
    expect(draft.redo()).toBe(false);
    draft.saving = false;
    // A save that failed with no fresh copy leaves both steps where they were.
    expect(draft.undo()).toBe(true);
    expect(draft.dirty).toBe(false);
    expect(draft.redo()).toBe(true);
    expect(draft.redo()).toBe(true);
    expect(draft.effective.pointControlTapToToggle).toBe(true);
  });

  it("makes one undo step of a dial dragged round", () => {
    const doc = behavior();
    const draft = new RoomsDraft(doc, 3);
    for (const h of [10, 20, 30]) draft.apply(roomZonesWrites(draft.effective, "kitchen", [{ entityId: "light.kitchen", centerHeading: h, label: "Pendant / Bar" }])!, "dial");
    draft.endCoalesce();
    expect(draft.undo()).toBe(true);
    expect(draft.dirty).toBe(false);
  });

  it("is kept per watch and takes the saved copy as its base", async () => {
    forgetRoomsDraft("W9");
    const doc = behavior();
    const { draft } = takeRoomsRecord("W9", doc, 2);
    draft.apply(fallbackWrites("__stay__"));
    expect(takeRoomsRecord("W9", doc, 2).draft).toBe(draft);
    const result = await saveRoomsDraft(draft, {
      save: async (base) => ({ revision: base + 1 }),
      fetch: async () => { throw new Error("not asked"); },
    });
    expect(result.ok).toBe(true);
    expect(draft.revision).toBe(3);
    expect(draft.dirty).toBe(false);
    expect(draft.document.roomQuickJumpFallbackPageId).toBe("__stay__");
    forgetRoomsDraft("W9");
  });
});

describe("the route and the button", () => {
  it("answers /rooms and /rooms/<owner>", () => {
    expect(WATCH_ROOMS_PATH).toBe("/rooms");
    expect(isWatchRoomsRoute({ prefix: "/wrist-assistant", path: "/rooms" })).toBe(true);
    expect(isWatchRoomsRoute({ prefix: "/wrist-assistant", path: "/rooms/ABC" })).toBe(true);
    expect(isWatchRoomsRoute({ prefix: "/wrist-assistant", path: "/roomsx" })).toBe(false);
    expect(watchRoomsRouteOwner({ prefix: "/wrist-assistant", path: "/rooms/A%20B" })).toBe("A B");
    expect(watchRoomsRouteOwner({ prefix: "/wrist-assistant", path: "/rooms/%E0" })).toBeUndefined();
    expect(watchRoomsUrl(undefined, false, "/wrist-assistant/rooms/X")).toBe("/wrist-assistant");
    expect(watchRoomsUrl({ prefix: "/wa", path: "" }, true)).toBe("/wa/rooms");
  });

  it("is drawn for an administrator in a home with a watch", () => {
    const watch = { owner_watch_id: "W1", device_kind: "watch" } as unknown as OwnerSummary;
    const admin = { user: { is_admin: true } } as unknown as HassLike;
    expect(flat(renderWatchRoomsButton(admin, [watch], () => undefined))).toContain("Rooms");
    expect(renderWatchRoomsButton({ user: { is_admin: false } } as unknown as HassLike, [watch], () => undefined)).not.toHaveProperty("strings");
  });
});

describe("the cards", () => {
  function host(doc: BehaviorDocument): RoomsViewHost & { writes: ReadonlyMap<string, unknown>[] } {
    const writes: ReadonlyMap<string, unknown>[] = [];
    const view = readRooms(doc);
    const uiState = new Map<string, unknown>([["room:kitchen", true]]);
    return {
      hass: { states: { "sensor.watch_area": { state: "Kitchen", attributes: { friendly_name: "Watch area" } } } } as unknown as HassLike,
      document: doc,
      view,
      dirty: new Set(),
      pages: [{ id: KITCHEN_PAGE, name: "Kitchen page" }],
      rooms: mergeRoomList({ mappingKeys: Object.keys(view.mappings), zoneKeys: ["kitchen"] }),
      roomsState: "ready",
      busy: false,
      uiState,
      writes,
      write: (w) => { writes.push(w); },
      endCoalesce: () => undefined,
      addRoom: () => undefined,
      requestUpdate: () => undefined,
    };
  }

  it("draw the four cards with what the document says", () => {
    const text = flat(renderRoomsBody(host(behavior())));
    for (const title of ["Room sensor", "Switch pages by room", "Point control", "Your rooms"]) expect(text).toContain(title);
    expect(text).toContain("Now in Kitchen.");
    expect(text).toContain("Automatic");
    expect(text).toContain("Stay on current page");
    expect(text).toContain("First available page");
    expect(text).toContain("Kitchen page");
    expect(text).toContain("Tap to Toggle");
    expect(text).toContain("Live Point Control Tile");
    expect(text).toContain("Point control targets");
  });

  it("say so when the targets cannot be read", () => {
    const text = flat(renderRoomsBody(host(behavior({ pointControlRoomMappingsJSON: "not json" }))));
    expect(text).toContain("cannot be read");
  });
});
