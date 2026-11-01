// What the Shared tab's cards say, worked out from what Home Assistant
// answers: the HTTP actions' count, size and whether every awake device has
// them; how many cameras are framed; the Home map's floors, rooms and pins.

import { describe, expect, it } from "vitest";

import type { CameraFraming, HttpActionsRecord, OwnerSummary } from "../src/ha-api.js";
import type { HomeMapDocument } from "../src/home-map/model.js";
import { CAMERA_CARD_THUMBS, HTTP_CARD_ROWS, cameraCardFacts, httpCardFacts, mapCardFacts } from "../src/shared-tab/model.js";

const DAY = 86_400;

const owner = (id: string, over: Partial<OwnerSummary> = {}): OwnerSummary => ({
  owner_watch_id: id, device_name: id, device_kind: "watch", is_orphan: false, last_seen_seconds: 60, ...over,
}) as OwnerSummary;

const record = (over: Partial<HttpActionsRecord> = {}): HttpActionsRecord => ({
  revision: 3, delivered: { w1: 3 }, hash: null, updated_at: null, updated_by: null, handed_over: [],
  document: { schemaVersion: 1, actions: [
    { id: "a", name: "Status", method: "get" }, { id: "b", name: "Ping", method: "GET" }, { id: "c", name: " ", method: "POST" }, { id: "d", name: "Say" },
  ] },
  ...over,
});

describe("the HTTP actions card", () => {
  it("says how many, how big, and Synced, and lists the first few", () => {
    const facts = httpCardFacts(record(), [owner("w1")]);
    expect(facts.words).toMatch(/^4 actions · \d+ bytes of 262 KB · Synced$/);
    expect(facts.rows).toHaveLength(HTTP_CARD_ROWS);
    expect(facts.rows).toEqual([{ method: "GET", name: "Status" }, { method: "GET", name: "Ping" }, { method: "POST", name: "Unnamed action" }]);
  });

  it("counts the watches that have not collected it, as its screen does, leaving out the asleep and the gone", () => {
    const owners = [
      owner("w1"), owner("w2"), owner("w3", { last_seen_seconds: 8 * DAY }), owner("w4", { is_orphan: true }),
      owner("lib", { device_kind: "library" }), owner("p1", { device_kind: "iphone" }), owner("w5", { polling: true, last_seen_seconds: 9 * DAY }),
    ];
    expect(httpCardFacts(record(), owners).words).toMatch(/· 2 waiting$/);
    expect(httpCardFacts(record(), [owner("w1"), owner("p1", { device_kind: "iphone" })]).words).toMatch(/· Synced$/);
  });

  it("says one action in the singular, and the empty library plainly", () => {
    expect(httpCardFacts(record({ document: { actions: [{ id: "a", name: "One" }] } }), []).words).toMatch(/^1 action · /);
    expect(httpCardFacts(record({ revision: 0 }), []).words).toBe("No actions yet");
    expect(httpCardFacts(undefined, []).words).toBe("No actions yet");
  });

  it("reads the public list for a person who is not an administrator, with no method, size or sync", () => {
    const { document: _left, ...rest } = record();
    const facts = httpCardFacts({ ...rest, public: { actions: [{ id: "a", name: "Status" }] } }, [owner("w1")]);
    expect(facts.words).toBe("1 action");
    expect(facts.rows).toEqual([{ name: "Status" }]);
  });
});

describe("the Camera framing card", () => {
  const camera = (id: string, framed: boolean): CameraFraming => ({
    entity_id: `camera.${id}`, name: id, all_entity_ids: [], viewport: framed ? { x: 0, y: 0, w: 1, h: 1 } : null,
    open_zoomed: false, stream: { override: null, auto: null }, stream_choices: [],
  });

  it("says how many are framed, and shows the framed ones first", () => {
    const facts = cameraCardFacts([camera("a", false), camera("b", true), camera("c", false), camera("d", true), camera("e", false)]);
    expect(facts.words).toBe("2 of 5 cameras framed · how each picture is cut in alerts");
    expect(facts.thumbs).toHaveLength(CAMERA_CARD_THUMBS);
    expect(facts.thumbs.map((t) => [t.entityId, t.framed])).toEqual([["camera.b", true], ["camera.d", true], ["camera.a", false], ["camera.c", false]]);
  });

  it("speaks of one camera in the singular, and of none plainly", () => {
    expect(cameraCardFacts([camera("a", true)]).words).toBe("1 of 1 camera framed · how each picture is cut in alerts");
    expect(cameraCardFacts([]).words).toBe("No cameras in Home Assistant yet");
    expect(cameraCardFacts(undefined).thumbs).toEqual([]);
  });
});

describe("the Home map card", () => {
  const room = (id: string, x: number) => ({ id, name: `Room ${id}`, outline: [[x, 0], [x + 4, 0], [x + 4, 3], [x, 3]], height: 2.5, walls: [], openings: [], objects: [] });
  const doc = (floors: unknown[]) => ({ v: 1, floors }) as unknown as HomeMapDocument;

  it("says the floor, the rooms and the devices, and draws the floor", () => {
    const facts = mapCardFacts(doc([{ id: "f", name: "Upstairs", story: 1, rooms: [room("a", 0)], pins: [{ id: "p", entityId: "light.a", at: [1, 1, 0] }, { id: "q", entityId: "light.b", at: [2, 2, 0] }, { id: "r", entityId: "light.c", at: [3, 2, 0] }] }]));
    expect(facts.words).toBe("1 floor (Upstairs) · 1 room · 3 devices");
    expect(facts.plan?.rooms).toHaveLength(1);
    expect(facts.plan?.pins).toEqual([{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 2 }]);
    expect(facts.plan?.viewBox.split(" ")).toHaveLength(4);
  });

  it("counts several floors, and names none of them", () => {
    const facts = mapCardFacts(doc([
      { id: "f", name: "Up", story: 1, rooms: [room("a", 0), room("b", 5)], pins: [] },
      { id: "g", name: "Down", story: 0, rooms: [room("c", 0)], pins: [{ id: "p", entityId: "light.a", at: [1, 1, 0] }] },
    ]));
    expect(facts.words).toBe("2 floors · 3 rooms · 1 device");
  });

  it("says plainly when there is no map yet", () => {
    for (const none of [null, undefined, doc([]), doc([{ id: "f", name: "Home", story: 0, rooms: [], pins: [] }])]) {
      expect(mapCardFacts(none)).toEqual({ words: "No map yet. Scan your home with the iPhone app." });
    }
  });
});
