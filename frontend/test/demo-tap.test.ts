// Demo mode: which tap a press lands on, and what running that tap does.
//
// The hit test is the part worth pinning down. It has to agree with the watch
// on three things people get wrong: the topmost tap wins, a hidden tap is not a
// button at all, and a tap inside a list row is measured against its row rather
// than against the face.

import { describe, expect, it } from "vitest";
import type { NormalizedFrame, TapAction } from "../src/model.js";
import { newConfig } from "../src/model.js";
import type { ResolvedElement, ResolvedLayout, ResolvedTap } from "../src/resolver.js";
import { actionAt, hitAt, runTapAction, tapAt, type DemoHooks } from "../src/demo.js";
import type { HassLike } from "../src/ha-api.js";

function frame(x: number, y: number, width: number, height: number): NormalizedFrame {
  return { x, y, width, height, rotationDegrees: 0 };
}

function tap(id: string, f: NormalizedFrame, action: TapAction, isHidden = false): ResolvedTap {
  return { kind: "tap", id, isHidden, frame: f, opacity: 1, action };
}

function layout(elements: ResolvedElement[]): ResolvedLayout {
  return { family: "rectangular", elements, cornerBodyShape: "circle", borderWidth: 0 };
}

/** A connection that records what it was asked to send, and can be told to
 * fail, so the runner's success and failure lines are both testable. */
function fakeHass(fail?: string) {
  const sent: Record<string, unknown>[] = [];
  const hass = {
    connection: {
      sendMessagePromise: (message: Record<string, unknown>) => {
        sent.push(message);
        return fail === undefined ? Promise.resolve({}) : Promise.reject(new Error(fail));
      },
      subscribeMessage: () => Promise.resolve(() => Promise.resolve()),
    },
    states: {},
  } as unknown as HassLike;
  return { hass, sent };
}

function hooks(hass: HassLike, over: Partial<DemoHooks> = {}): DemoHooks {
  return {
    hass,
    refresh: () => undefined,
    stepPage: () => true,
    playTour: () => true,
    ...over,
  };
}

describe("the tap under a press", () => {
  it("finds the tap whose frame holds the point", () => {
    const l = layout([tap("t1", frame(0, 0, 0.5, 0.5), { type: "refresh" })]);
    expect(tapAt(l, { x: 0.25, y: 0.25 })?.id).toBe("t1");
    expect(tapAt(l, { x: 0.75, y: 0.75 })).toBeUndefined();
  });

  it("counts the edge of a tap as inside it", () => {
    const l = layout([tap("t1", frame(0.25, 0.25, 0.5, 0.5), { type: "refresh" })]);
    expect(tapAt(l, { x: 0.25, y: 0.25 })?.id).toBe("t1");
    expect(tapAt(l, { x: 0.75, y: 0.75 })?.id).toBe("t1");
  });

  it("gives the topmost tap when two overlap", () => {
    // Last in the list is drawn last, so it is the one on top.
    const l = layout([
      tap("under", frame(0, 0, 1, 1), { type: "refresh" }),
      tap("over", frame(0.4, 0.4, 0.2, 0.2), { type: "openApp" }),
    ]);
    expect(tapAt(l, { x: 0.5, y: 0.5 })?.id).toBe("over");
    expect(tapAt(l, { x: 0.1, y: 0.1 })?.id).toBe("under");
  });

  it("ignores a hidden tap, which the watch never draws as a button", () => {
    const l = layout([
      tap("under", frame(0, 0, 1, 1), { type: "refresh" }),
      tap("gone", frame(0.4, 0.4, 0.2, 0.2), { type: "openApp" }, true),
    ]);
    expect(tapAt(l, { x: 0.5, y: 0.5 })?.id).toBe("under");
  });

  it("finds a tap inside a list row, measured against its row", () => {
    // The list fills the bottom half. Two rows inside it, and the row tap
    // covers the whole row, so a press in the second row is the second cell.
    const rowTap = (id: string) => tap(id, frame(0, 0, 1, 1), { type: "toggleEntity", entityId: `light.${id}`, displayName: id, domain: "light" });
    const list: ResolvedElement = {
      kind: "list",
      id: "list",
      isHidden: false,
      opacity: 1,
      frame: frame(0, 0.5, 1, 0.5),
      cells: [
        { frame: frame(0, 0, 1, 0.5), elements: [rowTap("one")] },
        { frame: frame(0, 0.5, 1, 0.5), elements: [rowTap("two")] },
      ],
    };
    const l = layout([list]);
    expect(tapAt(l, { x: 0.5, y: 0.6 })?.id).toBe("one");
    expect(tapAt(l, { x: 0.5, y: 0.9 })?.id).toBe("two");
    // Above the list there is no tap at all.
    expect(tapAt(l, { x: 0.5, y: 0.2 })).toBeUndefined();
  });

  it("falls back to the document's whole-complication action", () => {
    const cfg = newConfig("demo", 0);
    cfg.tapAction = { type: "openApp" };
    const l = layout([tap("t1", frame(0, 0, 0.2, 0.2), { type: "refresh" })]);
    expect(actionAt(cfg, l, { x: 0.1, y: 0.1 })).toEqual({
      action: { type: "refresh" }, tapId: "t1", frame: frame(0, 0, 0.2, 0.2),
    });
    // Nothing to ring: the watch flashes the whole complication instead.
    expect(actionAt(cfg, l, { x: 0.9, y: 0.9 })).toEqual({ action: { type: "openApp" } });
  });
});

describe("the box the success flash rings", () => {
  it("is the tap's own frame for a tap on the face", () => {
    const l = layout([tap("t1", frame(0.1, 0.2, 0.3, 0.4), { type: "refresh" })]);
    expect(hitAt(l, { x: 0.2, y: 0.3 })?.frame).toEqual(frame(0.1, 0.2, 0.3, 0.4));
  });

  it("is the pressed row's own box, not the row layer's box in its cell", () => {
    // The list fills the bottom half. Two rows. The row's button is inset in
    // its row, so the flash has to land on that row and nowhere else. The
    // numbers are the watch's `listRowFrame` worked by hand.
    const rowTap = (id: string) => tap(id, frame(0.1, 0.25, 0.8, 0.5),
      { type: "toggleEntity", entityId: `light.${id}`, displayName: id, domain: "light" });
    const list: ResolvedElement = {
      kind: "list", id: "list", isHidden: false, opacity: 1,
      frame: frame(0, 0.5, 1, 0.5),
      cells: [
        { frame: frame(0, 0, 1, 0.5), elements: [rowTap("one")] },
        { frame: frame(0, 0.5, 1, 0.5), elements: [rowTap("two")] },
      ],
    };
    const l = layout([list]);
    // Second row: y = 0.5 + (0.5 + 0.25 * 0.5) * 0.5 = 0.8125, height = 0.5 * 0.5 * 0.5.
    expect(hitAt(l, { x: 0.5, y: 0.85 })?.frame).toEqual(frame(0.1, 0.8125, 0.8, 0.125));
    // First row: same box half a list higher.
    expect(hitAt(l, { x: 0.5, y: 0.6 })?.frame).toEqual(frame(0.1, 0.5625, 0.8, 0.125));
  });
});

describe("running a tap", () => {
  it("toggles through the entity's own domain, the way the widget intent does", async () => {
    const { hass, sent } = fakeHass();
    const out = await runTapAction(
      { type: "toggleEntity", entityId: "light.kitchen", displayName: "Kitchen", domain: "light" },
      hooks(hass),
    );
    expect(out.kind).toBe("did");
    expect(sent).toEqual([{
      type: "call_service",
      domain: "light",
      service: "toggle",
      service_data: { entity_id: "light.kitchen" },
    }]);
  });

  it("turns a scene and a script on", async () => {
    const { hass, sent } = fakeHass();
    await runTapAction({ type: "runScene", entityId: "scene.evening", displayName: "Evening", domain: "scene" }, hooks(hass));
    await runTapAction({ type: "runScript", entityId: "script.bedtime", displayName: "Bedtime", domain: "script" }, hooks(hass));
    expect(sent.map((m) => `${String(m.domain)}.${String(m.service)}`)).toEqual(["scene.turn_on", "script.turn_on"]);
  });

  it("sends a raw service call with its data and target", async () => {
    const { hass, sent } = fakeHass();
    const out = await runTapAction({
      type: "callService",
      serviceDomain: "light",
      serviceName: "turn_on",
      serviceDataJSON: '{"brightness_pct": 40}',
      target: { entityId: "light.hall", displayName: "Hall", domain: "light" },
    }, hooks(hass));
    expect(out.kind).toBe("did");
    expect(sent[0]?.service_data).toEqual({ entity_id: "light.hall", brightness_pct: 40 });
  });

  it("refuses service data that is not an object, the way the watch does", async () => {
    const { hass, sent } = fakeHass();
    const out = await runTapAction({
      type: "callService", serviceDomain: "light", serviceName: "turn_on", serviceDataJSON: "[1,2]",
    }, hooks(hass));
    expect(out.kind).toBe("failed");
    expect(sent).toEqual([]);
  });

  it("reports a failed call instead of throwing", async () => {
    const { hass } = fakeHass("Entity not found");
    const out = await runTapAction(
      { type: "toggleEntity", entityId: "light.nope", displayName: "Nope", domain: "light" },
      hooks(hass),
    );
    expect(out.kind).toBe("failed");
    expect(out.text).toContain("Entity not found");
  });

  it("moves the page, and says so when there is nowhere to move", async () => {
    const { hass } = fakeHass();
    const moved: number[] = [];
    const on = await runTapAction({ type: "nextPage" }, hooks(hass, { stepPage: (by) => { moved.push(by); return true; } }));
    expect(on.kind).toBe("did");
    expect(moved).toEqual([1]);
    const stuck = await runTapAction({ type: "previousPage" }, hooks(hass, { stepPage: () => false }));
    expect(stuck.kind).toBe("none");
  });

  it("refreshes rather than calling a service", async () => {
    const { hass, sent } = fakeHass();
    let refreshed = 0;
    const out = await runTapAction({ type: "refresh" }, hooks(hass, { refresh: () => { refreshed++; } }));
    expect(out.kind).toBe("did");
    expect(refreshed).toBe(1);
    expect(sent).toEqual([]);
  });

  it("says what the watch would do for the actions a browser cannot do", async () => {
    const { hass, sent } = fakeHass();
    for (const action of [
      { type: "openApp" }, { type: "openPage" }, { type: "openRoomPage" },
      { type: "timerStartPause" }, { type: "timerCancel" },
    ] as TapAction[]) {
      const out = await runTapAction(action, hooks(hass));
      expect(out.kind, action.type).toBe("would");
    }
    expect(sent).toEqual([]);
  });

  it("does nothing for a Nothing tap", async () => {
    const { hass, sent } = fakeHass();
    const out = await runTapAction({ type: "none" }, hooks(hass));
    expect(out.kind).toBe("none");
    expect(sent).toEqual([]);
  });
});
