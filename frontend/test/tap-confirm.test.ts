// "Ask before running" on a tap layer: the `confirm` key. A widget cannot show
// a question, so the app arms the layer on the first tap and runs it on the
// second. The panel only has to carry the key: read it, write it only when
// true, accept it in the unknown-key audit, and offer it for the actions that
// run something.

import { describe, expect, it } from "vitest";
import {
  type CustomComplicationConfig,
  type Element as CElement,
  type TapAction,
  type TapElement,
  attachTap,
  attachedTapsOf,
  auditUnknownKeys,
  encodeConfig,
  legacyConfig,
  newElement,
  parseConfig,
  setTapConfirm,
  tapActionCanConfirm,
} from "../src/model.js";
import { tapConfirmField } from "../src/editors.js";
import { nothing } from "lit";

type Encoded = { elements: { kind: string; payload: Record<string, unknown> }[] };

function withAttachedTap(): { cfg: CustomComplicationConfig; tap: TapElement } {
  const cfg = legacyConfig("Test", 0);
  const icon = newElement("icon");
  cfg.elements.push(icon);
  attachTap(cfg, icon.payload.id);
  const tap = attachedTapsOf(cfg, icon.payload.id)[0]!.payload as TapElement;
  tap.action = { type: "toggleEntity", entityId: "light.kitchen", displayName: "Kitchen", domain: "light" };
  return { cfg, tap };
}

function encodedTap(cfg: CustomComplicationConfig): Record<string, unknown> {
  return (encodeConfig(cfg) as Encoded).elements.find((e) => e.kind === "tap")!.payload;
}

describe("tap confirm key", () => {
  it("is written only when on, and survives a round trip", () => {
    const { cfg, tap } = withAttachedTap();
    expect("confirm" in encodedTap(cfg)).toBe(false);

    setTapConfirm(tap, true);
    expect(encodedTap(cfg).confirm).toBe(true);
    const back = parseConfig(encodeConfig(cfg));
    const backTap = back.elements.find((e) => e.kind === "tap")!.payload as TapElement;
    expect(backTap.confirm).toBe(true);
    expect(encodeConfig(back)).toEqual(encodeConfig(cfg));

    setTapConfirm(tap, false);
    expect("confirm" in tap).toBe(false);
    expect("confirm" in encodedTap(cfg)).toBe(false);
  });

  it("passes the unknown-key audit", () => {
    const { cfg, tap } = withAttachedTap();
    setTapConfirm(tap, true);
    expect(auditUnknownKeys(encodeConfig(cfg))).toEqual([]);
  });

  it("reads only a true boolean as on", () => {
    const { cfg } = withAttachedTap();
    const enc = encodeConfig(cfg) as Encoded;
    enc.elements.find((e) => e.kind === "tap")!.payload.confirm = "yes";
    const back = parseConfig(enc);
    expect((back.elements.find((e) => e.kind === "tap")!.payload as TapElement).confirm).toBeUndefined();
  });

  it("works on a free-standing tap layer too", () => {
    const cfg = legacyConfig("Test", 0);
    const tap = newElement("tap") as Extract<CElement, { kind: "tap" }>;
    tap.payload.action = { type: "runScene", entityId: "scene.movie", displayName: "Movie", domain: "scene" };
    setTapConfirm(tap.payload, true);
    cfg.elements.push(tap);
    expect(encodedTap(cfg).confirm).toBe(true);
    expect("attachedTo" in encodedTap(cfg)).toBe(false);
  });

  it("stays off the action and the document's own tap action", () => {
    const { cfg, tap } = withAttachedTap();
    setTapConfirm(tap, true);
    const enc = encodeConfig(cfg) as Encoded & { tapAction: Record<string, unknown> };
    expect("confirm" in (enc.elements.find((e) => e.kind === "tap")!.payload.action as Record<string, unknown>)).toBe(false);
    expect("confirm" in enc.tapAction).toBe(false);
  });
});

describe("which actions can ask first", () => {
  const ref = { entityId: "x.y", displayName: "Y", domain: "x" };
  const yes: TapAction[] = [
    { type: "toggleEntity", ...ref },
    { type: "runScene", ...ref },
    { type: "runScript", ...ref },
    { type: "runHTTPAction", ...ref },
    { type: "timerStartPause" },
    { type: "callService", serviceDomain: "light", serviceName: "turn_on" } as TapAction,
    { type: "refresh" } as TapAction,
    { type: "refreshAll" } as TapAction,
  ];
  const no: TapAction[] = [
    { type: "none" },
    { type: "openApp" },
    { type: "openPage" },
    { type: "nextPage" },
    { type: "openEntity", ...ref },
    { type: "addTodo", ...ref },
  ];

  it("offers it for actions that run something", () => {
    for (const a of yes) expect(tapActionCanConfirm(a), a.type).toBe(true);
  });

  it("hides it for page and open actions", () => {
    for (const a of no) expect(tapActionCanConfirm(a), a.type).toBe(false);
  });

  it("draws the checkbox only where it applies", () => {
    const { tap } = withAttachedTap();
    expect(tapConfirmField(tap, () => {})).not.toBe(nothing);
    tap.action = { type: "openApp" };
    expect(tapConfirmField(tap, () => {})).toBe(nothing);
  });
});
