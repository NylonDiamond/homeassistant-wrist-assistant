// "Show the reply": one optional `httpShowResult: true` on the document. An HTTP
// action tap (the whole tap or a tap layer) then opens the watch app to show the
// server's reply instead of firing in the background. Writers omit it when off.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import {
  type CustomComplicationConfig,
  type Element,
  auditUnknownKeys,
  encodeConfig,
  hasHTTPTap,
  newConfig,
  newElement,
  parseConfig,
} from "../src/model.js";
import { type EditorHost, generalEditor, tapActionEditor } from "../src/editors.js";
import type { HassLike } from "../src/ha-api.js";
import type { IconProvider } from "../src/renderer.js";
import { SymbolBrowser } from "../src/symbols.js";

const noIcons: IconProvider = { render: () => undefined, available: () => false, names: () => undefined };
const HTTP = { type: "runHTTPAction", entityId: "http_action.0B7C", displayName: "Gate", domain: "http_action" } as const;

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

function host(cfg: CustomComplicationConfig): EditorHost {
  return {
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
    openSections: new Set<string>(),
    toggleSection: () => {},
    helpSections: new Set<string>(),
    toggleHelp: () => {},
    selectLayer: () => {},
    peekLayer: () => {},
    selectValue: () => {},
    beginGesture: () => {},
    copyPosition: () => {},
    setRowEdit: () => {},
  } as unknown as EditorHost;
}

function tapLayer(action: CustomComplicationConfig["tapAction"]): Extract<Element, { kind: "tap" }> {
  const tap = newElement("tap") as Extract<Element, { kind: "tap" }>;
  tap.payload.action = action;
  return tap;
}

describe("httpShowResult on the document", () => {
  it("round trips true, omits the key when off, and passes the audit", () => {
    const cfg = newConfig("Gate", 0);
    cfg.httpShowResult = true;
    const encoded = encodeConfig(cfg);
    expect(encoded.httpShowResult).toBe(true);
    expect(parseConfig(encoded).httpShowResult).toBe(true);
    expect(auditUnknownKeys(encoded)).toEqual([]);

    delete cfg.httpShowResult;
    expect("httpShowResult" in encodeConfig(cfg)).toBe(false);
    expect(parseConfig({ ...encoded, httpShowResult: false }).httpShowResult).toBeUndefined();
    expect(parseConfig({ ...encoded, httpShowResult: "yes" }).httpShowResult).toBeUndefined();
  });

  it("knows when the document has an HTTP tap, whole or layer", () => {
    const cfg = newConfig("Gate", 0);
    expect(hasHTTPTap(cfg)).toBe(false);
    cfg.elements = [tapLayer({ type: "openApp" })];
    expect(hasHTTPTap(cfg)).toBe(false);
    cfg.elements.push(tapLayer({ ...HTTP }));
    expect(hasHTTPTap(cfg)).toBe(true);
    cfg.elements = [];
    cfg.tapAction = { ...HTTP };
    expect(hasHTTPTap(cfg)).toBe(true);
  });
});

describe("the Show the reply switch", () => {
  it("shows on the Complication card only when some tap runs an HTTP action", () => {
    const cfg = newConfig("Gate", 0);
    expect(flatten(generalEditor(host(cfg)))).not.toContain("Show the reply");
    cfg.elements = [tapLayer({ ...HTTP })];
    expect(flatten(generalEditor(host(cfg)))).toContain("Show the reply");
    cfg.elements = [];
    cfg.tapAction = { ...HTTP };
    expect(flatten(generalEditor(host(cfg)))).toContain("Show the reply");
  });

  it("shows on a tap layer that runs an HTTP action, never on the control", () => {
    const cfg = newConfig("Gate", 0);
    const layer = tapLayer({ ...HTTP });
    cfg.elements = [layer];
    const upd = () => {};
    expect(flatten(tapActionEditor(host(cfg), layer.payload, upd, "tap-1"))).toContain("Show the reply");
    expect(flatten(tapActionEditor(host(cfg), layer.payload, upd, "control"))).not.toContain("Show the reply");
    const other = tapLayer({ type: "openApp" });
    expect(flatten(tapActionEditor(host(cfg), other.payload, upd, "tap-2"))).not.toContain("Show the reply");
  });
});
