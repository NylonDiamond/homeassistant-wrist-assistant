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
import { readWatchHttpLibrary } from "../src/watch-pages/http-library.js";
import { readFileSync } from "node:fs";
import { join } from "node:path";

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

// ── the target: a pick list of the home's library ────────────────────────

describe("the Run an HTTP action target", () => {
  const PORCH = "A1B2C3D4-0000-4000-8000-0000000000A1";
  const BLANK = "A1B2C3D4-0000-4000-8000-0000000000A2";
  const LIBRARY = readWatchHttpLibrary({
    revision: 2,
    document: { actions: [{ id: PORCH, name: "Porch Temp", url: "http://porch.local" }, { id: BLANK.toLowerCase(), name: "Unfinished", url: "" }] },
  })!;
  const SAMPLE = JSON.parse(readFileSync(join(__dirname, "fixtures-transfer", "13-http-button-sample-rectangular.json"), "utf8")) as Record<string, unknown>;

  /** Keys sorted at every depth, so two encodings compare as bytes. */
  const canonical = (v: unknown): string => JSON.stringify(v, (_k, x: unknown) =>
    x !== null && typeof x === "object" && !Array.isArray(x) ? Object.fromEntries(Object.entries(x).sort(([a], [b]) => a.localeCompare(b))) : x);

  function withLibrary(cfg: CustomComplicationConfig, actions = LIBRARY.actions): EditorHost {
    return { ...host(cfg), httpActions: actions };
  }

  function pickHandler(view: unknown): (e: unknown) => void {
    const all: { strings: readonly string[]; values: unknown[] }[] = [];
    const walk = (n: unknown) => {
      if (Array.isArray(n)) n.forEach(walk);
      else if (n !== null && typeof n === "object" && "strings" in n && "values" in n) {
        all.push(n as { strings: readonly string[]; values: unknown[] });
        (n as { values: unknown[] }).values.forEach(walk);
      }
    };
    walk(view);
    const t = all.find((x) => x.strings.join("").includes("<span>HTTP action</span>"))!;
    const at = t.strings.findIndex((s) => s.trimEnd().endsWith("@change="));
    return t.values[at] as (e: unknown) => void;
  }

  it("is the plain target field with no library, or an empty one", () => {
    const cfg = newConfig("Gate", 0);
    cfg.tapAction = { ...HTTP };
    for (const h of [host(cfg), withLibrary(cfg, [])]) {
      const text = flatten(tapActionEditor(h, { action: cfg.tapAction }, () => {}, "tap"));
      expect(text).toContain("Target");
      expect(text).not.toContain("<span>HTTP action</span>");
    }
  });

  it("lists the library and selects a stored action in any case and either form, with no field under it", () => {
    const cfg = newConfig("Gate", 0);
    for (const entityId of [`http_action.${PORCH}`, `http_action.${PORCH.toLowerCase()}`, PORCH.toLowerCase()]) {
      cfg.tapAction = { type: "runHTTPAction", entityId, displayName: "Porch", domain: "http_action" };
      const text = flatten(tapActionEditor(withLibrary(cfg), { action: cfg.tapAction }, () => {}, "tap"));
      expect(text).toContain("<span>HTTP action</span>");
      expect(text).toContain(`?selected=true>Porch Temp</option>`);
      expect(text).toContain(">Unfinished (needs setup)</option>");
      expect(text).not.toContain("Not in the list");
      expect(text).not.toContain("<span>Target</span>");
    }
  });

  it("a library action that needs setup says so, with the way to the HTTP actions screen", () => {
    const cfg = newConfig("Gate", 0);
    cfg.tapAction = { type: "runHTTPAction", entityId: `http_action.${BLANK}`, displayName: "Unfinished", domain: "http_action" };
    const text = flatten(tapActionEditor(withLibrary(cfg), { action: cfg.tapAction }, () => {}, "tap"));
    expect(text).toContain("Needs setup.");
    expect(text).toContain("Open HTTP actions");
  });

  it("a stored action the library does not hold reads Not in the list and keeps the plain field", () => {
    const cfg = parseConfig(SAMPLE);
    const text = flatten(tapActionEditor(withLibrary(cfg), { action: cfg.tapAction }, () => {}, "tap"));
    expect(text).toContain(">Not in the list</option>");
    expect(text).toContain("Target");
    // Nothing stored yet: a prompt, and no field.
    cfg.tapAction = { type: "runHTTPAction", entityId: "", displayName: "", domain: "" };
    const blank = flatten(tapActionEditor(withLibrary(cfg), { action: cfg.tapAction }, () => {}, "tap"));
    expect(blank).toContain(">Pick an action</option>");
    expect(blank).not.toContain("Not in the list");
  });

  it("a pick stores http_action. and the id in upper case, the action's name and the domain", () => {
    const cfg = parseConfig(SAMPLE);
    const holder = { action: cfg.tapAction };
    const upd = (m: (p: typeof holder) => void) => m(holder);
    pickHandler(tapActionEditor(withLibrary(cfg), holder, upd, "tap"))({ target: { value: BLANK.toLowerCase() } });
    expect(holder.action).toEqual({ type: "runHTTPAction", entityId: `http_action.${BLANK}`, displayName: "Unfinished", domain: "http_action" });
  });

  it("is fed by the panel, which reads the library for an administrator", () => {
    const panel = readFileSync(join(__dirname, "..", "src", "panel.ts"), "utf8");
    expect(panel).toContain("if (this.hass.user?.is_admin) void this.loadHttpLibrary();");
    expect(panel).toContain("httpActions: this.httpLibrary?.actions,");
  });

  it("leaves the document's bytes as they were on load and on save, in the list or not", () => {
    const inList = { ...SAMPLE, tapAction: { displayName: "Porch", domain: "http_action", entityId: PORCH.toLowerCase(), type: "runHTTPAction" } };
    for (const raw of [SAMPLE, inList]) {
      const cfg = parseConfig(structuredClone(raw));
      const before = canonical(encodeConfig(cfg));
      expect(before).toBe(canonical(raw));
      let edits = 0;
      flatten(tapActionEditor(withLibrary(cfg), { action: cfg.tapAction }, () => { edits++; }, "tap"));
      flatten(generalEditor(withLibrary(cfg)));
      expect(edits).toBe(0);
      expect(canonical(encodeConfig(cfg))).toBe(before);
    }
  });
});
