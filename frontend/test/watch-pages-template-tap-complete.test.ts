import { EditorState } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import { describe, expect, it } from "vitest";
import { templateTapCompletion } from "../src/watch-pages/template-code.js";

const context = {
  entities: () => ["light.desk", "scene.evening", "script.night", "sensor.power"].map((label) => ({ label, type: "entity" })),
  rowActions: () => ["maps", "link", "page", "refresh", "toggle", "script", "scene", "control", "service", "http"].map((label) => ({ label, type: "action" })),
  pages: () => [{ label: "Living room", apply: "Living room", type: "page" }],
  httpActions: () => [{ label: "Garage (on iPhone)", apply: "Garage", type: "http" }],
  services: () => ["light.turn_on", "light.toggle"].map((label) => ({ label, type: "service" })),
};
const at = (before: string) => {
  const r = templateTapCompletion(before, before.length, context);
  return r === null ? null : { from: r.from, labels: r.options.map((o) => o.label) };
};

describe("[tap: suggestions in the code box", () => {
  it("suggests the actions after [tap:", () => {
    expect(at("A [tap:")).toEqual({ from: 7, labels: context.rowActions().map((o) => o.label) });
    expect(at("A [tap:to")!.from).toBe(7);
    // Each action but refresh types a space after it and asks for its value.
    const r = templateTapCompletion("[tap:", 5, context)!;
    expect(r.options.filter((o) => o.apply !== undefined).map((o) => o.label)).not.toContain("refresh");
    expect(r.options.find((o) => o.label === "toggle")!.apply).toBeTypeOf("function");
  });

  it("types the picked action and a space", () => {
    let state = EditorState.create({ doc: "A [tap:tog]" });
    const view = { get state() { return state; }, dispatch: (spec: object) => { state = state.update(spec).state; } } as unknown as EditorView;
    const toggle = templateTapCompletion("A [tap:tog", 10, context)!.options.find((o) => o.label === "toggle")!;
    (toggle.apply as (v: EditorView, c: typeof toggle, from: number, to: number) => void)(view, toggle, 7, 10);
    expect(state.doc.toString()).toBe("A [tap:toggle ]");
    expect(state.selection.main.head).toBe(14);
  });

  it("suggests each action's value", () => {
    expect(at("[tap:toggle ")!.labels).toEqual(["light.desk"]);
    expect(at("[tap:control li")).toEqual({ from: 13, labels: ["light.desk", "scene.evening", "script.night", "sensor.power"] });
    expect(at("[tap:maps ")!.labels).toEqual([]);
    expect(at("[tap:script ")!.labels).toEqual(["script.night"]);
    expect(at("[TAP:Scene ")!.labels).toEqual(["scene.evening"]);
    expect(at("[tap:service li")).toEqual({ from: 13, labels: ["light.turn_on", "light.toggle"] });
    expect(at("[tap:service light.turn_on de")).toEqual({ from: 27, labels: ["light.desk", "scene.evening", "script.night", "sensor.power"] });
    expect(at("[tap:page Living r")).toEqual({ from: 10, labels: ["Living room"] });
    expect(at("[tap:http ")).toEqual({ from: 10, labels: ["Garage (on iPhone)"] });
  });

  it("says nothing where no value is listed", () => {
    expect(at("[tap:maps 52.1,")).toBeNull();
    expect(at("[tap:link https")).toBeNull();
    expect(at("[tap:refresh ")).toBeNull();
    expect(at("[tap:nope ")).toBeNull();
    expect(at("[tap:toggle light.desk] next")).toBeNull();
    expect(at("[icon:")).toBeNull();
  });
});
