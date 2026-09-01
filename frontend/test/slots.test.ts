// The auto-assigner and the "Send to watch" button, as pure functions.

import { describe, expect, it } from "vitest";
import { MAX_SLOTS, freeSlotFrom, type OccupiedSlot } from "../src/model.js";
import { describeSend, sendState } from "../src/send-state.js";

const occ = (slot: number, kind: OccupiedSlot["kind"] = "preset", home = ""): OccupiedSlot => ({
  slot,
  name: `s${slot}`,
  kind,
  home,
});

describe("freeSlotFrom", () => {
  it("returns the first slot nothing holds", () => {
    expect(freeSlotFrom([], [])).toBe(0);
    expect(freeSlotFrom([0, 1], [])).toBe(2);
  });

  it("skips presets and other homes' customs alike", () => {
    expect(freeSlotFrom([0], [occ(1), occ(2, "custom", "Cabin")])).toBe(3);
  });

  it("fills a hole below the highest slot", () => {
    expect(freeSlotFrom([0, 2], [occ(3)])).toBe(1);
  });

  it("returns -1 when every slot is taken", () => {
    const records = Array.from({ length: MAX_SLOTS / 2 }, (_, i) => i);
    const occupied = Array.from({ length: MAX_SLOTS / 2 }, (_, i) => occ(i + MAX_SLOTS / 2));
    expect(freeSlotFrom(records, occupied)).toBe(-1);
  });
});

describe("sendState", () => {
  it("is not offered when the integration has no ack", () => {
    expect(sendState({ token: 3, appliedToken: undefined, polling: true, pending: true }).kind).toBe("unsupported");
    expect(describeSend({ kind: "unsupported" }).label).toBe("");
  });

  it("is green only when the applied token equals the store token", () => {
    expect(sendState({ token: 3, appliedToken: 3, polling: false, pending: false }).kind).toBe("sent");
    expect(sendState({ token: 3, appliedToken: 3, polling: true, pending: true }).kind).toBe("sent");
  });

  it("shows sending while a wait is open and the watch is polling", () => {
    expect(sendState({ token: 4, appliedToken: 3, polling: true, pending: true }).kind).toBe("sending");
  });

  it("offers a re-send once the wait has run out on a connected watch", () => {
    const s = sendState({ token: 4, appliedToken: 3, polling: true, pending: false });
    expect(s.kind).toBe("waiting");
    expect(describeSend(s).disabled).toBe(false);
  });

  it("explains when the watch is not connected to this home", () => {
    const s = sendState({ token: 4, appliedToken: 3, polling: false, pending: true });
    expect(s.kind).toBe("offline");
    expect(describeSend(s).title).toContain("Sync now");
  });
});
