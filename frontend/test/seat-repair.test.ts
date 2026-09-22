// Two documents in one seat: finding them, and working out where the younger
// one should go instead.

import { describe, expect, it } from "vitest";

import { MAX_SLOTS } from "../src/model.js";
import {
  type SeatDevice,
  type SeatRecord,
  findSeatClashes,
  planSeatRepair,
  seatClashMessage,
  seatRepairSummary,
} from "../src/seatRepair.js";

const rec = (over: Partial<SeatRecord> & Pick<SeatRecord, "id">): SeatRecord => ({
  name: over.id,
  slotIndex: 0,
  families: ["circular"],
  control: false,
  token: 1,
  ...over,
});

const device = (records: SeatRecord[], over: Partial<SeatDevice> = {}): SeatDevice => ({
  ownerId: "w1",
  label: "Jesse's Watch",
  records,
  ...over,
});

describe("findSeatClashes", () => {
  it("finds nothing when every document has a seat of its own", () => {
    const d = device([
      rec({ id: "Kitchen", slotIndex: 0 }),
      rec({ id: "Hallway", slotIndex: 1 }),
      rec({ id: "Study", slotIndex: 2 }),
    ]);
    expect(findSeatClashes([d])).toEqual([]);
  });

  it("finds two documents of one shape in one seat", () => {
    const d = device([
      rec({ id: "Kitchen", slotIndex: 3, token: 10 }),
      rec({ id: "Hallway", slotIndex: 3, token: 20 }),
    ]);
    const clashes = findSeatClashes([d]);
    expect(clashes).toHaveLength(1);
    expect(clashes[0]!.slotIndex).toBe(3);
    expect(clashes[0]!.records.map((r) => r.id)).toEqual(["Kitchen", "Hallway"]);
  });

  it("finds all three when three of one shape pile into one seat", () => {
    const d = device([
      rec({ id: "Kitchen", slotIndex: 0, token: 1 }),
      rec({ id: "Hallway", slotIndex: 0, token: 2 }),
      rec({ id: "Study", slotIndex: 0, token: 3 }),
    ]);
    const clashes = findSeatClashes([d]);
    expect(clashes).toHaveLength(1);
    expect(clashes[0]!.records.map((r) => r.id)).toEqual(["Kitchen", "Hallway", "Study"]);
  });

  // The whole point of sharing a seat: a face resolves it by the shape it is
  // drawing, so these two never collide.
  it("leaves two shapes sharing one seat alone", () => {
    const d = device([
      rec({ id: "Kitchen", slotIndex: 3, families: ["circular"] }),
      rec({ id: "Hallway", slotIndex: 3, families: ["rectangular"] }),
    ]);
    expect(findSeatClashes([d])).toEqual([]);
  });

  it("leaves a control sitting beside a shape alone", () => {
    const d = device([
      rec({ id: "Kitchen", slotIndex: 2, families: ["circular"] }),
      rec({ id: "Lights", slotIndex: 2, families: [], control: true }),
    ]);
    expect(findSeatClashes([d])).toEqual([]);
  });

  it("counts two controls in one seat as a clash", () => {
    const d = device([
      rec({ id: "Lights", slotIndex: 2, families: [], control: true, token: 5 }),
      rec({ id: "Locks", slotIndex: 2, families: [], control: true, token: 9 }),
    ]);
    const clashes = findSeatClashes([d]);
    expect(clashes).toHaveLength(1);
    expect(clashes[0]!.records.map((r) => r.id)).toEqual(["Lights", "Locks"]);
  });

  it("puts the oldest write first, whatever order the list came in", () => {
    const d = device([
      rec({ id: "Study", slotIndex: 0, token: 30 }),
      rec({ id: "Kitchen", slotIndex: 0, token: 10 }),
      rec({ id: "Hallway", slotIndex: 0, token: 20 }),
    ]);
    expect(findSeatClashes([d])[0]!.records.map((r) => r.id)).toEqual(["Kitchen", "Hallway", "Study"]);
  });

  it("ignores a document that has never been placed", () => {
    const d = device([
      rec({ id: "Kitchen", slotIndex: -1 }),
      rec({ id: "Hallway", slotIndex: -1 }),
    ]);
    expect(findSeatClashes([d])).toEqual([]);
  });

  it("ignores a document that draws nowhere at all", () => {
    const d = device([
      rec({ id: "Kitchen", slotIndex: 0, families: [] }),
      rec({ id: "Hallway", slotIndex: 0, families: [] }),
    ]);
    expect(findSeatClashes([d])).toEqual([]);
  });

  it("keeps each device's clashes to itself", () => {
    const watch = device([
      rec({ id: "Kitchen", slotIndex: 0 }),
      rec({ id: "Hallway", slotIndex: 0 }),
    ]);
    const phone = device([rec({ id: "Porch", slotIndex: 0 })], { ownerId: "p1", label: "Jesse's iPhone" });
    const clashes = findSeatClashes([watch, phone]);
    expect(clashes).toHaveLength(1);
    expect(clashes[0]!.ownerId).toBe("w1");
  });
});

describe("planSeatRepair", () => {
  it("leaves the oldest write where it is and moves the rest", () => {
    const d = device([
      rec({ id: "Kitchen", slotIndex: 0, token: 10 }),
      rec({ id: "Hallway", slotIndex: 0, token: 20 }),
    ]);
    const plan = planSeatRepair([d]);
    expect(plan.stuck).toEqual([]);
    expect(plan.moves).toHaveLength(1);
    expect(plan.moves[0]!.recordId).toBe("Hallway");
    expect(plan.moves[0]!.from).toBe(0);
    expect(plan.moves[0]!.to).toBe(1);
  });

  it("gives each of three a seat of its own", () => {
    const d = device([
      rec({ id: "Kitchen", slotIndex: 0, token: 10 }),
      rec({ id: "Hallway", slotIndex: 0, token: 20 }),
      rec({ id: "Study", slotIndex: 0, token: 30 }),
    ]);
    const plan = planSeatRepair([d]);
    expect(plan.moves.map((m) => [m.recordId, m.to])).toEqual([["Hallway", 1], ["Study", 2]]);
  });

  // A seat someone else's shape holds is still free for this one.
  it("shares a seat with another shape rather than skipping it", () => {
    const d = device([
      rec({ id: "Kitchen", slotIndex: 0, token: 10 }),
      rec({ id: "Hallway", slotIndex: 0, token: 20 }),
      rec({ id: "Porch", slotIndex: 1, families: ["rectangular"] }),
    ]);
    expect(planSeatRepair([d]).moves[0]!.to).toBe(1);
  });

  it("steps over a seat its own shape already holds", () => {
    const d = device([
      rec({ id: "Kitchen", slotIndex: 0, token: 10 }),
      rec({ id: "Hallway", slotIndex: 0, token: 20 }),
      rec({ id: "Porch", slotIndex: 1, families: ["circular"] }),
    ]);
    expect(planSeatRepair([d]).moves[0]!.to).toBe(2);
  });

  // An older app picks the first document at a slot whatever shape it draws,
  // so nothing may share a seat there.
  it("never shares a seat on a device whose app cannot resolve by shape", () => {
    const d = device([
      rec({ id: "Kitchen", slotIndex: 0, token: 10 }),
      rec({ id: "Hallway", slotIndex: 0, token: 20 }),
      rec({ id: "Porch", slotIndex: 1, families: ["rectangular"] }),
    ], { canShare: false });
    expect(planSeatRepair([d]).moves[0]!.to).toBe(2);
  });

  it("steps over a seat an iPhone preset holds", () => {
    const d = device([
      rec({ id: "Kitchen", slotIndex: 0, token: 10 }),
      rec({ id: "Hallway", slotIndex: 0, token: 20 }),
    ], { blocked: [{ slot: 1 }] });
    expect(planSeatRepair([d]).moves[0]!.to).toBe(2);
  });

  it("gives a control a seat nothing at all holds", () => {
    const d = device([
      rec({ id: "Lights", slotIndex: 0, families: [], control: true, token: 10 }),
      rec({ id: "Locks", slotIndex: 0, families: [], control: true, token: 20 }),
      rec({ id: "Porch", slotIndex: 1, families: ["rectangular"] }),
    ]);
    expect(planSeatRepair([d]).moves[0]!.to).toBe(2);
  });

  it("leaves a document put when the device has no free seat", () => {
    const full: SeatRecord[] = [];
    for (let i = 1; i < MAX_SLOTS; i++) full.push(rec({ id: `Filler${i}`, slotIndex: i }));
    const d = device([
      rec({ id: "Kitchen", slotIndex: 0, token: 10 }),
      rec({ id: "Hallway", slotIndex: 0, token: 20 }),
      ...full,
    ]);
    const plan = planSeatRepair([d]);
    expect(plan.moves).toEqual([]);
    expect(plan.stuck.map((s) => s.recordId)).toEqual(["Hallway"]);
    expect(plan.stuck[0]!.label).toBe("Jesse's Watch");
  });

  it("moves what it can on a device where one document is stuck", () => {
    const full: SeatRecord[] = [];
    for (let i = 2; i < MAX_SLOTS; i++) full.push(rec({ id: `Filler${i}`, slotIndex: i }));
    const d = device([
      rec({ id: "Kitchen", slotIndex: 0, token: 10 }),
      rec({ id: "Hallway", slotIndex: 0, token: 20 }),
      rec({ id: "Study", slotIndex: 0, token: 30 }),
      ...full,
    ]);
    const plan = planSeatRepair([d]);
    expect(plan.moves.map((m) => [m.recordId, m.to])).toEqual([["Hallway", 1]]);
    expect(plan.stuck.map((s) => s.recordId)).toEqual(["Study"]);
  });

  it("plans each device on its own", () => {
    const watch = device([
      rec({ id: "Kitchen", slotIndex: 0, token: 10 }),
      rec({ id: "Hallway", slotIndex: 0, token: 20 }),
    ]);
    const phone = device([
      rec({ id: "Porch", slotIndex: 4, token: 10 }),
      rec({ id: "Garage", slotIndex: 4, token: 20 }),
    ], { ownerId: "p1", label: "Jesse's iPhone" });
    const plan = planSeatRepair([watch, phone]);
    expect(plan.moves.map((m) => [m.ownerId, m.recordId, m.to]))
      .toEqual([["w1", "Hallway", 1], ["p1", "Garage", 0]]);
  });

  it("plans nothing when nothing clashes", () => {
    const d = device([rec({ id: "Kitchen", slotIndex: 0 }), rec({ id: "Hallway", slotIndex: 1 })]);
    expect(planSeatRepair([d])).toEqual({ moves: [], stuck: [] });
  });
});

describe("seatClashMessage", () => {
  it("says nothing when nothing clashes", () => {
    expect(seatClashMessage([])).toBe("");
  });

  it("names the documents, the seat and the device", () => {
    const d = device([
      rec({ id: "k", name: "Kitchen", slotIndex: 3, token: 10 }),
      rec({ id: "h", name: "Hallway", slotIndex: 3, token: 20 }),
    ], { label: "Roel's iPhone" });
    expect(seatClashMessage(findSeatClashes([d])))
      .toBe("Kitchen and Hallway share seat 3 on Roel's iPhone. Only one of them can be placed.");
  });

  it("puts two clashes in one line", () => {
    const watch = device([
      rec({ id: "k", name: "Kitchen", slotIndex: 3, token: 10 }),
      rec({ id: "h", name: "Hallway", slotIndex: 3, token: 20 }),
    ], { label: "Roel's iPhone" });
    const phone = device([
      rec({ id: "d", name: "Den", slotIndex: 0, token: 10 }),
      rec({ id: "s", name: "Study", slotIndex: 0, token: 20 }),
    ], { ownerId: "p1", label: "Jesse's Watch" });
    expect(seatClashMessage(findSeatClashes([watch, phone]))).toBe(
      "Kitchen and Hallway share seat 3 on Roel's iPhone. "
      + "Den and Study share seat 0 on Jesse's Watch. Only one of each can be placed.",
    );
  });

  it("stops naming after three and counts the rest", () => {
    const records: SeatRecord[] = [];
    for (let seat = 0; seat < 5; seat++) {
      records.push(rec({ id: `a${seat}`, name: `A${seat}`, slotIndex: seat, token: 10 }));
      records.push(rec({ id: `b${seat}`, name: `B${seat}`, slotIndex: seat, token: 20 }));
    }
    const words = seatClashMessage(findSeatClashes([device(records)]));
    expect(words).toContain("A0 and B0 share seat 0");
    expect(words).toContain("2 more seats clash the same way.");
    expect(words).not.toContain("A4");
  });
});

describe("seatRepairSummary", () => {
  it("names the one thing that moved", () => {
    const plan = planSeatRepair([device([
      rec({ id: "k", name: "Kitchen", slotIndex: 0, token: 10 }),
      rec({ id: "h", name: "Hallway", slotIndex: 0, token: 20 }),
    ])]);
    expect(seatRepairSummary(plan)).toBe("Hallway moved to seat 1 on Jesse's Watch.");
  });

  it("counts them once there are several", () => {
    const plan = planSeatRepair([device([
      rec({ id: "k", name: "Kitchen", slotIndex: 0, token: 10 }),
      rec({ id: "h", name: "Hallway", slotIndex: 0, token: 20 }),
      rec({ id: "s", name: "Study", slotIndex: 0, token: 30 }),
    ])]);
    expect(seatRepairSummary(plan)).toBe("2 complications moved to seats of their own.");
  });

  it("says which one stayed put and why", () => {
    const full: SeatRecord[] = [];
    for (let i = 1; i < MAX_SLOTS; i++) full.push(rec({ id: `f${i}`, name: `F${i}`, slotIndex: i }));
    const plan = planSeatRepair([device([
      rec({ id: "k", name: "Kitchen", slotIndex: 0, token: 10 }),
      rec({ id: "h", name: "Hallway", slotIndex: 0, token: 20 }),
      ...full,
    ])]);
    expect(seatRepairSummary(plan))
      .toBe("Hallway stayed put: Jesse's Watch has no free seat. Delete something there first.");
  });

  it("says so when there was nothing to move", () => {
    expect(seatRepairSummary({ moves: [], stuck: [] })).toBe("Nothing to move.");
  });
});
