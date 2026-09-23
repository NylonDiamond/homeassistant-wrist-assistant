// How long each page shows during Play all pages. The times sit under that
// tap, the one action that reads them, with one field that sets every page at
// once. They belong to the document, so every Play all pages tap shares them.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import {
  type CustomComplicationConfig,
  type Element,
  legacyConfig,
  literal,
  newElement,
  playTourTapCount,
  setAllPageDwells,
  setPageDwell,
  sharedDwell,
  startPages,
} from "../src/model.js";
import { type EditorHost, generalEditor, tapActionEditor } from "../src/editors.js";
import type { HassLike } from "../src/ha-api.js";
import type { IconProvider } from "../src/renderer.js";
import { SymbolBrowser } from "../src/symbols.js";

const noIcons: IconProvider = { render: () => undefined, available: () => false, names: () => undefined };

function flatten(node: unknown): string {
  if (node === undefined || node === null || node === nothing) return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (typeof node === "object" && "strings" in (node as Record<string, unknown>)) {
    const t = node as { strings: readonly string[]; values: unknown[] };
    return t.strings.map((s, i) => s + (i < t.values.length ? flatten(t.values[i]) : "")).join("");
  }
  if (typeof node === "function") return "";
  return String(node);
}


function host(cfg: CustomComplicationConfig, over: Partial<EditorHost> = {}): EditorHost {
  const base = {
    hass: { states: {} } as HassLike,
    config: cfg,
    icons: noIcons,
    symbols: new SymbolBrowser(() => {}),
    pages: [],
    watchAppVersion: "2.8.0",
    update: (m: (c: CustomComplicationConfig) => void) => m(cfg),
    endGesture: () => {},
    resolve: () => undefined,
    canCountDown: () => false,
    historySeries: () => undefined,
    evaluateTest: () => false,
    liveBranch: () => "none",
    forced: new Map(),
    setForced: () => {},
    activeFamily: "rectangular" as const,
    setActiveFamily: () => {},
    addFamily: () => {},
    tapAreaShown: false,
    showTapArea: () => {},
    openSections: new Set(["control"]),
    toggleSection: () => {},
    helpSections: new Set<string>(),
    toggleHelp: () => {},
    selectLayer: () => {},
    peekLayer: () => {},
    selectValue: () => {},
    beginGesture: () => {},
    copyPosition: () => {},
    setRowEdit: () => {},
  };
  return { ...base, ...over } as unknown as EditorHost;
}

/** A two-page document whose whole-complication tap is `tap`. */
function paged(tap: CustomComplicationConfig["tapAction"]): CustomComplicationConfig {
  const cfg = legacyConfig("Tour", 0, ["rectangular"]);
  const text = newElement("text") as Extract<Element, { kind: "text" }>;
  text.payload.value = literal("One");
  cfg.elements = [text];
  startPages(cfg);
  cfg.tapAction = tap;
  return cfg;
}

describe("the page holds", () => {
  it("sets every page at once, and clears them all back to the default", () => {
    const cfg = paged({ type: "playTour" });
    setAllPageDwells(cfg, 1.5);
    expect(cfg.pages?.dwell).toEqual([1.5, 1.5]);
    expect(sharedDwell(cfg.pages!)).toBe(1.5);
    setAllPageDwells(cfg, 99);
    expect(cfg.pages?.dwell).toEqual([10, 10]);
    setAllPageDwells(cfg, undefined);
    expect(cfg.pages?.dwell).toEqual([]);
    expect(sharedDwell(cfg.pages!)).toBeUndefined();
  });

  it("shows no shared time while the pages differ", () => {
    const cfg = paged({ type: "playTour" });
    setPageDwell(cfg, 1, 1);
    setPageDwell(cfg, 2, 3);
    expect(sharedDwell(cfg.pages!)).toBeUndefined();
  });

  it("counts every tap that plays the tour", () => {
    const cfg = paged({ type: "playTour" });
    expect(playTourTapCount(cfg)).toBe(1);
    const tap = newElement("tap") as Extract<Element, { kind: "tap" }>;
    tap.payload.action = { type: "playTour" };
    cfg.elements.push(tap);
    expect(playTourTapCount(cfg)).toBe(2);
    cfg.tapAction = { type: "nextPage" };
    expect(playTourTapCount(cfg)).toBe(1);
  });
});

describe("where the page holds are edited", () => {
  it("is under a Play all pages tap, and no longer in the Pages card", () => {
    const cfg = paged({ type: "playTour" });
    const general = flatten(generalEditor(host(cfg)));
    expect(general).toContain("Same for every page");
    expect(general).toContain("Page 2 hold");
    expect(general).toContain("Tour lasts");
    expect(general).not.toContain("shared by every");
  });

  it("is not under any other tap", () => {
    for (const tap of [{ type: "nextPage" }, { type: "showPage", page: 2 }, { type: "refresh" }] as const) {
      expect(flatten(generalEditor(host(paged(tap)))), tap.type).not.toContain("Same for every page");
    }
  });

  it("is under a tap layer that plays the tour too, and says the times are shared", () => {
    const cfg = paged({ type: "playTour" });
    const tap = newElement("tap") as Extract<Element, { kind: "tap" }>;
    tap.payload.action = { type: "playTour" };
    cfg.elements.push(tap);
    const layer = flatten(tapActionEditor(host(cfg), tap.payload, (m) => m(tap.payload), "t"));
    expect(layer).toContain("Same for every page");
    expect(layer).toContain("These times are shared by every Play all pages tap.");
  });
});

describe("the Test on canvas button", () => {
  it("sits under a Play all pages tap, and plays or stops the tour", () => {
    const cfg = paged({ type: "playTour" });
    let presses = 0;
    const idle = flatten(generalEditor(host(cfg, { tour: { playing: false, toggle: () => { presses++; } } })));
    expect(idle).toContain("Test on canvas");
    const playing = flatten(generalEditor(host(cfg, { tour: { playing: true, toggle: () => {} } })));
    expect(playing).toContain(">Stop<");
    expect(playing).not.toContain("Test on canvas");
  });

  it("is missing where there is no canvas, and under any other tap", () => {
    expect(flatten(generalEditor(host(paged({ type: "playTour" }))))).not.toContain("Test on canvas");
    const tour = { playing: false, toggle: () => {} };
    expect(flatten(generalEditor(host(paged({ type: "nextPage" }), { tour })))).not.toContain("Test on canvas");
  });
});
