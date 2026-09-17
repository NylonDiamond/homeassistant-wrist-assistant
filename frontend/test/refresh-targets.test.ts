// Which complications a "Refresh multiple complications" tap reaches.
//
// Two halves, both pure. `refreshTargetsWith` in the model is the whole rule
// for one box being ticked, so the dedupe and the "never write an empty list"
// rule are tested there rather than through a rendered checkbox. The picker
// itself is read out of `tapActionEditor`, which is exported for exactly this:
// the list it offers, the order it offers it in, and the document it leaves
// out are decisions worth pinning down.

import { describe, expect, it } from "vitest";
import { html, nothing } from "lit";
import {
  type CustomComplicationConfig,
  type RefreshAllAction,
  newConfig,
  refreshTargetsWith,
} from "../src/model.js";
import { type EditorHost, type TapActionHolder, tapActionEditor } from "../src/editors.js";
import { SymbolBrowser } from "../src/symbols.js";
import type { HassLike } from "../src/ha-api.js";
import type { IconProvider } from "../src/renderer.js";

const namedIcons: IconProvider = {
  render: (name: string, size: number) => html`<svg data-symbol=${name} data-size=${size}></svg>`,
  available: () => true,
  names: () => undefined,
};

/** Everything a rendered template says in words, so a test can read the picker
 * without a DOM. Handlers are functions and flatten to nothing. */
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

function host(cfg: CustomComplicationConfig, documents?: { id: string; name: string }[]): EditorHost {
  return {
    hass: { states: {} } as HassLike,
    config: cfg,
    icons: namedIcons,
    symbols: new SymbolBrowser(() => {}),
    pages: [],
    ...(documents === undefined ? {} : { documents }),
    update: (m: (c: CustomComplicationConfig) => void) => m(cfg),
    endGesture: () => {},
    resolve: () => undefined,
    canCountDown: () => false,
    historySeries: () => undefined,
    evaluateTest: () => false,
    liveBranch: () => "none",
    forced: new Map(),
    setForced: () => {},
    activeFamily: "circular" as const,
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

/** The tap editor's words, for a tap layer carrying this action. */
function picker(action: RefreshAllAction, documents?: { id: string; name: string }[], selfId = "SELF"): string {
  const cfg = newConfig("Edited", 0);
  cfg.id = selfId;
  const holder: TapActionHolder = { action };
  return flatten(tapActionEditor(host(cfg, documents), holder, (m) => m(holder), "tap"));
}

const OTHERS = [
  { id: "B2", name: "kitchen" },
  { id: "A1", name: "Bedroom" },
  { id: "SELF", name: "Edited" },
];

describe("ticking one complication", () => {
  it("adds an id once, uppercased, in the order it was picked", () => {
    let action: RefreshAllAction = { type: "refreshAll" };
    action = refreshTargetsWith(action, "b2", true);
    expect(action).toEqual({ type: "refreshAll", targets: ["B2"] });
    action = refreshTargetsWith(action, "a1", true);
    expect(action).toEqual({ type: "refreshAll", targets: ["B2", "A1"] });
    // Already there, so nothing changes and nothing doubles up.
    expect(refreshTargetsWith(action, "B2", true)).toEqual({ type: "refreshAll", targets: ["B2", "A1"] });
  });

  it("drops the key rather than writing an empty list", () => {
    const one: RefreshAllAction = { type: "refreshAll", targets: ["A1"] };
    expect(refreshTargetsWith(one, "A1", false)).toEqual({ type: "refreshAll" });
    // Unticking something that was never picked is not an error either.
    expect(refreshTargetsWith(one, "ZZ", false)).toEqual({ type: "refreshAll", targets: ["A1"] });
  });

  it("leaves the old action alone", () => {
    const before: RefreshAllAction = { type: "refreshAll", targets: ["A1"] };
    refreshTargetsWith(before, "B2", true);
    expect(before).toEqual({ type: "refreshAll", targets: ["A1"] });
  });

  it("changes nothing while all placed is on, because that key wins", () => {
    const all: RefreshAllAction = { type: "refreshAll", allPlaced: true };
    expect(refreshTargetsWith(all, "A1", true)).toEqual({ type: "refreshAll", allPlaced: true });
  });
});

describe("the picker under the tap", () => {
  it("lists the other complications by name, ignoring case in the order", () => {
    const text = picker({ type: "refreshAll" }, OTHERS);
    expect(text).toContain("All placed complications");
    expect(text.indexOf("Bedroom")).toBeGreaterThan(-1);
    expect(text.indexOf("Bedroom")).toBeLessThan(text.indexOf("kitchen"));
  });

  it("heads the list with the document being edited, marked and stuck on", () => {
    const text = picker({ type: "refreshAll" }, OTHERS);
    expect(text).toContain("Edited (current)");
    expect(text).toContain("always refreshes itself");
    // Its own row comes before the others, and the watch's copy of it is not
    // offered a second time further down.
    expect(text.indexOf("Edited (current)")).toBeLessThan(text.indexOf("Bedroom"));
    expect(text.split("Edited").length - 1).toBe(1);
  });

  it("hides the list while all placed is on, and warns about the wait", () => {
    const text = picker({ type: "refreshAll", allPlaced: true }, OTHERS);
    expect(text).toContain("All placed complications");
    expect(text).toContain("can take a while");
    expect(text).not.toContain("Bedroom");
    expect(text).not.toContain("kitchen");
  });

  it("keeps a picked id the watch no longer has, so it can be unticked", () => {
    const text = picker({ type: "refreshAll", targets: ["GONE"] }, OTHERS);
    expect(text).toContain("Unknown complication (deleted)");
  });

  it("says so when there is nothing else on the watch", () => {
    expect(picker({ type: "refreshAll" }, [])).toContain("No other complications on this watch yet.");
    // A host with no document list at all reads the same way.
    expect(picker({ type: "refreshAll" })).toContain("No other complications on this watch yet.");
  });
});
