// Which layers a "Refresh this complication" tap fetches.
//
// Three halves, all pure. The wire is the interesting one: the tap is a plain
// `refresh` carrying a layer list, not a type of its own, so an older watch app
// that ignores the key refreshes everything instead of going dead. That means
// an empty list and an absent list mean the same thing to the watch and
// different things to the picker, which is the rule these tests pin down.
//
// The picker reaches the list through an "All layers" box under the row, the
// same gesture "All placed complications" uses one card down.

import { describe, expect, it } from "vitest";
import { html, nothing } from "lit";
import {
  type CustomComplicationConfig,
  type Element as CElement,
  type RefreshAction,
  type RefreshAllAction,
  type TapAction,
  TAP_ACTION_LABELS,
  auditUnknownKeys,
  describeTapAction,
  newConfig,
  newElement,
  parseConfig,
  encodeConfig,
  refreshLayersWith,
  refreshTargetAllLayersWith,
  refreshTargetLayersWith,
  refreshTargetsWith,
  tapActionLabel,
  tapActionNote,
} from "../src/model.js";
import { type EditorHost, type TapActionHolder, tapActionEditor, tapActionForType } from "../src/editors.js";
import { scrubForShare } from "../src/transfer.js";
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

/** One row of the host's document list: another complication on this watch,
 * with its own layers behind a thunk. */
type DocRow = { id: string; name: string; layers: () => CElement[] };

function host(cfg: CustomComplicationConfig, documents?: DocRow[]): EditorHost {
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

/** A document carrying one layer of each kind that matters here. */
function configWithLayers(): { cfg: CustomComplicationConfig; ids: Record<string, string> } {
  const cfg = newConfig("Edited", 0);
  const camera = newElement("image");
  const chart = newElement("chart");
  const text = newElement("text");
  const shape = newElement("shape");
  cfg.elements = [camera, chart, text, shape];
  return {
    cfg,
    ids: {
      camera: camera.payload.id,
      chart: chart.payload.id,
      text: text.payload.id,
      shape: shape.payload.id,
    },
  };
}

/** A document with no layers at all. */
function plainConfig(): CustomComplicationConfig {
  const cfg = newConfig("Edited", 0);
  cfg.id = "SELF";
  cfg.elements = [newElement("text"), newElement("shape")];
  return cfg;
}

/** Another complication on the watch, with layers of the kinds named. */
function otherDoc(id: string, name: string, kinds: CElement["kind"][]): { doc: DocRow; ids: string[] } {
  const layers = kinds.map((k) => newElement(k));
  return { doc: { id, name, layers: () => layers }, ids: layers.map((l) => l.payload.id) };
}

/** The tap editor's words, for a tap layer carrying this action. */
function picker(action: TapAction, cfg: CustomComplicationConfig, documents?: DocRow[]): string {
  const holder: TapActionHolder = { action };
  return flatten(tapActionEditor(host(cfg, documents), holder, (m) => m(holder), "tap"));
}

describe("the two refresh rows", () => {
  it("names them by how much each one reaches", () => {
    const rows = TAP_ACTION_LABELS.slice(0, 2);
    expect(rows).toEqual([
      ["refresh", "Refresh this complication"],
      ["refreshAll", "Refresh multiple complications"],
    ]);
  });

  it("gives a scoped refresh no row and no type of its own", () => {
    // Both shapes sit on the one row and are one wire type, which is the whole
    // point: an older watch app ignores the key and refreshes everything.
    expect(tapActionLabel({ type: "refresh", layerIds: [] })).toBe("Refresh this complication");
    expect(tapActionLabel({ type: "refresh" })).toBe("Refresh this complication");
    expect(TAP_ACTION_LABELS.some(([t]) => (t as string) === "refreshLayers")).toBe(false);
  });

  it("keeps the picks when the picker leaves the row and comes back", () => {
    const scoped: TapAction = { type: "refresh", layerIds: ["A", "B"] };
    // Re-picking the row it is already on changes nothing: the "All layers" box
    // is what clears the list, not the type picker.
    expect(tapActionForType("refresh", scoped)).toEqual({ type: "refresh", layerIds: ["A", "B"] });
    // Off to something unrelated and back: nothing to keep, so the box is on.
    expect(tapActionForType("refresh", { type: "openApp" })).toEqual({ type: "refresh" });
  });
});

describe("ticking one layer", () => {
  it("adds an id once, in the order it was picked", () => {
    let action: RefreshAction = { type: "refresh", layerIds: [] };
    action = refreshLayersWith(action, "A", true);
    expect(action).toEqual({ type: "refresh", layerIds: ["A"] });
    action = refreshLayersWith(action, "B", true);
    expect(action).toEqual({ type: "refresh", layerIds: ["A", "B"] });
    expect(refreshLayersWith(action, "A", true)).toEqual({ type: "refresh", layerIds: ["A", "B"] });
  });

  it("keeps an empty list rather than dropping the key", () => {
    // Dropping it would move the tap back to a plain refresh the moment the
    // last box was unticked, which is not what unticking a box means.
    const one: RefreshAction = { type: "refresh", layerIds: ["A"] };
    expect(refreshLayersWith(one, "A", false)).toEqual({ type: "refresh", layerIds: [] });
    expect(refreshLayersWith(one, "ZZ", false)).toEqual({ type: "refresh", layerIds: ["A"] });
  });

  it("leaves the old action alone", () => {
    const before: RefreshAction = { type: "refresh", layerIds: ["A"] };
    refreshLayersWith(before, "B", true);
    expect(before).toEqual({ type: "refresh", layerIds: ["A"] });
  });
});

describe("the picker under the tap", () => {
  it("lists only the layers that cost a fetch of their own", () => {
    const { cfg } = configWithLayers();
    const text = picker({ type: "refresh", layerIds: [] }, cfg);
    expect(text).toContain("(Picture)");
    expect(text).toContain("(Chart)");
    // Text and shapes ride on the one rendered document, so ticking them would
    // save nothing and only make the list longer.
    expect(text).not.toContain("(Text)");
    expect(text).not.toContain("(Shape)");
  });

  it("shows only the All layers box while the tap fetches everything", () => {
    const { cfg } = configWithLayers();
    const text = picker({ type: "refresh" }, cfg);
    expect(text).toContain("All layers");
    expect(text).toContain("every layer and every page");
    expect(text).not.toContain("(Picture)");
  });

  it("offers no All layers box when nothing on the face fetches", () => {
    // Nothing to narrow, so the box would be a control that does nothing.
    const cfg = newConfig("Edited", 0);
    cfg.elements = [newElement("text"), newElement("shape")];
    expect(picker({ type: "refresh" }, cfg)).not.toContain("All layers");
  });

  it("keeps the All layers box on top of the list once it is off", () => {
    const { cfg } = configWithLayers();
    expect(picker({ type: "refresh", layerIds: [] }, cfg)).toContain("All layers");
  });

  it("hangs the layers off the box that revealed them", () => {
    // Indented under a guide line, and each row peeks its layer on the preview.
    const { cfg } = configWithLayers();
    const text = picker({ type: "refresh", layerIds: [] }, cfg);
    expect(text).toContain("sub-checks");
    expect(text).toContain("peek-row");
  });

  it("says nothing ticked still refreshes everything", () => {
    const { cfg } = configWithLayers();
    const text = picker({ type: "refresh", layerIds: [] }, cfg);
    expect(text).toContain("still refreshes the whole complication");
    expect(text).toContain("refreshes everything instead");
  });

  it("keeps a ticked layer the document no longer has, so it can be unticked", () => {
    const { cfg } = configWithLayers();
    expect(picker({ type: "refresh", layerIds: ["GONE"] }, cfg)).toContain("Deleted layer");
  });

  it("says so when no layer fetches anything of its own", () => {
    const cfg = newConfig("Edited", 0);
    cfg.elements = [newElement("text"), newElement("shape")];
    expect(picker({ type: "refresh", layerIds: [] }, cfg)).toContain("nothing to narrow");
  });

  it("counts the picks in the one-line description", () => {
    expect(describeTapAction({ type: "refresh" })).toBe("Refresh this complication");
    expect(describeTapAction({ type: "refresh", layerIds: [] }))
      .toBe("Refresh this complication: none picked");
    expect(describeTapAction({ type: "refresh", layerIds: ["A", "B"] }))
      .toBe("Refresh this complication: 2 picked");
    expect(tapActionNote({ type: "refresh", layerIds: ["A"] })).toContain("Fetches only the 1 ticked below");
    expect(tapActionNote({ type: "refresh" })).toContain("every layer and every page");
  });
});

describe("the scoped refresh on the wire", () => {
  function roundTrip(action: TapAction): TapAction {
    const cfg = newConfig("Edited", 0);
    cfg.tapAction = action;
    return parseConfig(encodeConfig(cfg)).tapAction;
  }

  it("writes no key at all for a plain refresh", () => {
    const cfg = newConfig("Edited", 0);
    cfg.tapAction = { type: "refresh" };
    const encoded = encodeConfig(cfg) as { tapAction: Record<string, unknown> };
    expect(encoded.tapAction).toEqual({ type: "refresh" });
    expect(roundTrip({ type: "refresh" })).toEqual({ type: "refresh" });
  });

  it("writes the list, empty list included, and reads it back", () => {
    const cfg = newConfig("Edited", 0);
    cfg.tapAction = { type: "refresh", layerIds: [] };
    const encoded = encodeConfig(cfg) as { tapAction: Record<string, unknown> };
    expect(encoded.tapAction).toEqual({ type: "refresh", layerIds: [] });
    expect(roundTrip({ type: "refresh", layerIds: [] })).toEqual({ type: "refresh", layerIds: [] });

    const ids = ["1B0B0B0B-0B0B-4B0B-8B0B-0B0B0B0B0B0B"];
    expect(roundTrip({ type: "refresh", layerIds: ids })).toEqual({ type: "refresh", layerIds: ids });
  });

  it("cleans the ids the same way the document ids are cleaned", () => {
    const cfg = newConfig("Edited", 0);
    cfg.tapAction = { type: "refresh", layerIds: [" a1 ", "a1", "", "b2"] } as TapAction;
    const back = parseConfig(encodeConfig(cfg)).tapAction;
    expect(back).toEqual({ type: "refresh", layerIds: ["A1", "B2"] });
  });
});

// The same narrowing, one card down: which layers a "Refresh multiple
// complications" tap fetches from each complication it reaches. A document with
// no entry fetches all of its layers, which is why an entry is only ever
// written for one the author narrowed.
describe("narrowing one picked complication", () => {
  it("adds no entry when a complication is ticked", () => {
    // No entry already means every layer, so ticking writes nothing extra.
    expect(refreshTargetsWith({ type: "refreshAll" }, "a1", true))
      .toEqual({ type: "refreshAll", targets: ["A1"] });
  });

  it("drops the entry when the complication is unticked", () => {
    // The narrowing hangs off the tick, so a complication the tap no longer
    // reaches must not leave a list of its layers behind on the wire.
    const action: RefreshAllAction = {
      type: "refreshAll", targets: ["A1", "B2"], targetLayers: { A1: ["X1"], B2: [] },
    };
    expect(refreshTargetsWith(action, "A1", false))
      .toEqual({ type: "refreshAll", targets: ["B2"], targetLayers: { B2: [] } });
    // The last entry going leaves no key at all rather than an empty object.
    const one: RefreshAllAction = { type: "refreshAll", targets: ["A1"], targetLayers: { A1: ["X1"] } };
    expect(refreshTargetsWith(one, "A1", false)).toEqual({ type: "refreshAll" });
  });

  it("writes an empty list when All layers goes off, and drops it when it comes back on", () => {
    const picked: RefreshAllAction = { type: "refreshAll", targets: ["A1"] };
    const off = refreshTargetAllLayersWith(picked, "a1", false);
    expect(off).toEqual({ type: "refreshAll", targets: ["A1"], targetLayers: { A1: [] } });
    expect(refreshTargetAllLayersWith(off, "A1", true)).toEqual({ type: "refreshAll", targets: ["A1"] });
  });

  it("keeps the empty list as the last layer is unticked", () => {
    // Dropping it would tick the "All layers" box again the moment the last
    // layer went, which is not what unticking a layer means.
    const one: RefreshAllAction = { type: "refreshAll", targets: ["A1"], targetLayers: { A1: ["X1"] } };
    expect(refreshTargetLayersWith(one, "A1", "X1", false))
      .toEqual({ type: "refreshAll", targets: ["A1"], targetLayers: { A1: [] } });
  });

  it("adds a layer id once, in the order it was picked", () => {
    let action: RefreshAllAction = { type: "refreshAll", targets: ["A1"], targetLayers: { A1: [] } };
    action = refreshTargetLayersWith(action, "A1", "X1", true);
    action = refreshTargetLayersWith(action, "A1", "Y2", true);
    expect(action.targetLayers).toEqual({ A1: ["X1", "Y2"] });
    expect(refreshTargetLayersWith(action, "A1", "X1", true).targetLayers).toEqual({ A1: ["X1", "Y2"] });
    // Another complication narrows on its own without touching the first.
    expect(refreshTargetLayersWith(action, "B2", "Z3", true).targetLayers)
      .toEqual({ A1: ["X1", "Y2"], B2: ["Z3"] });
  });

  it("leaves the old action alone", () => {
    const before: RefreshAllAction = { type: "refreshAll", targets: ["A1"], targetLayers: { A1: ["X1"] } };
    refreshTargetLayersWith(before, "A1", "Y2", true);
    refreshTargetAllLayersWith(before, "A1", true);
    expect(before).toEqual({ type: "refreshAll", targets: ["A1"], targetLayers: { A1: ["X1"] } });
  });

  it("changes nothing while all placed is on, because that key wins", () => {
    // There is no list to narrow then, so neither control writes anything.
    const all: RefreshAllAction = { type: "refreshAll", allPlaced: true };
    expect(refreshTargetLayersWith(all, "A1", "X1", true)).toEqual({ type: "refreshAll", allPlaced: true });
    expect(refreshTargetAllLayersWith(all, "A1", false)).toEqual({ type: "refreshAll", allPlaced: true });
    expect(refreshTargetsWith({ ...all, targetLayers: { A1: [] } }, "A1", true))
      .toEqual({ type: "refreshAll", allPlaced: true });
  });
});

describe("the nested picker under the tap", () => {
  it("offers no layer box for a complication that is not ticked", () => {
    // Nothing reaches it, so there is nothing to narrow.
    const { doc } = otherDoc("A1", "Kitchen", ["image"]);
    const text = picker({ type: "refreshAll" }, plainConfig(), [doc]);
    expect(text).toContain("Kitchen");
    expect(text).not.toContain("All layers");
  });

  it("hangs an All layers box off each ticked complication", () => {
    const { doc } = otherDoc("A1", "Kitchen", ["image"]);
    const text = picker({ type: "refreshAll", targets: ["A1"] }, plainConfig(), [doc]);
    expect(text).toContain("All layers");
    // Indented under the row it belongs to, the same guide line the card above
    // hangs its layers from.
    expect(text).toContain("sub-checks");
  });

  it("gives the current complication the same box", () => {
    // It always refreshes itself, but how much of itself is still a choice.
    const { cfg } = configWithLayers();
    cfg.id = "SELF";
    expect(picker({ type: "refreshAll" }, cfg, [])).toContain("All layers");
  });

  it("offers no box for a complication with nothing that fetches", () => {
    const { doc } = otherDoc("A1", "Kitchen", ["text", "shape"]);
    const text = picker({ type: "refreshAll", targets: ["A1"] }, plainConfig(), [doc]);
    expect(text).toContain("Kitchen");
    expect(text).not.toContain("All layers");
  });

  it("lists that complication's layers once its box is off", () => {
    const { doc } = otherDoc("A1", "Kitchen", ["image", "chart", "text"]);
    const text = picker(
      { type: "refreshAll", targets: ["A1"], targetLayers: { A1: [] } }, plainConfig(), [doc],
    );
    expect(text).toContain("(Picture)");
    expect(text).toContain("(Chart)");
    // Text rides on the one rendered document, so ticking it would save nothing.
    expect(text).not.toContain("(Text)");
  });

  it("peeks the current complication's layers and nobody else's", () => {
    // Another complication is not on the preview, so its rows have nothing to
    // light up and stay plain.
    const { doc } = otherDoc("A1", "Kitchen", ["image"]);
    const cfg = configWithLayers().cfg;
    cfg.id = "SELF";
    const others = picker(
      { type: "refreshAll", targets: ["A1"], targetLayers: { A1: [] } }, cfg, [doc],
    );
    expect(others).not.toContain("peek-row");
    const own = picker({ type: "refreshAll", targetLayers: { SELF: [] } }, cfg, [doc]);
    expect(own).toContain("peek-row");
  });

  it("keeps a ticked layer the other complication no longer has", () => {
    const { doc } = otherDoc("A1", "Kitchen", ["image"]);
    const text = picker(
      { type: "refreshAll", targets: ["A1"], targetLayers: { A1: ["GONE"] } }, plainConfig(), [doc],
    );
    expect(text).toContain("Deleted layer");
  });

  it("hides the whole nesting while all placed is on", () => {
    const { doc } = otherDoc("A1", "Kitchen", ["image"]);
    const text = picker({ type: "refreshAll", allPlaced: true }, configWithLayers().cfg, [doc]);
    expect(text).not.toContain("All layers");
    expect(text).not.toContain("Kitchen");
  });

  it("counts the narrowing in the one-line description and the note", () => {
    const action: RefreshAllAction = {
      type: "refreshAll", targets: ["A1", "B2"], targetLayers: { A1: ["X1"] },
    };
    expect(describeTapAction(action)).toBe("Refresh multiple complications: 2 picked, 1 narrowed");
    expect(describeTapAction({ type: "refreshAll", targets: ["A1"] }))
      .toBe("Refresh multiple complications: 1 picked");
    expect(tapActionNote(action)).toContain("One complication is narrowed");
    expect(tapActionNote({ type: "refreshAll", targets: ["A1"] })).not.toContain("narrowed");
  });
});

describe("the narrowing on the wire", () => {
  function roundTrip(action: TapAction): TapAction {
    const cfg = newConfig("Edited", 0);
    cfg.tapAction = action;
    return parseConfig(encodeConfig(cfg)).tapAction;
  }

  it("leaves targets exactly as it found them", () => {
    // The watch decodes `targets` as a plain list of strings, and a throwing
    // decode would take the whole config sync down, so the shape never moves.
    const cfg = newConfig("Edited", 0);
    cfg.tapAction = { type: "refreshAll", targets: ["A1", "B2"], targetLayers: { A1: ["X1"] } };
    const encoded = encodeConfig(cfg) as { tapAction: Record<string, unknown> };
    expect(encoded.tapAction).toEqual({
      type: "refreshAll", targets: ["A1", "B2"], targetLayers: { A1: ["X1"] },
    });
  });

  it("writes no key at all when nothing is narrowed", () => {
    const cfg = newConfig("Edited", 0);
    cfg.tapAction = { type: "refreshAll", targets: ["A1"] };
    const encoded = encodeConfig(cfg) as { tapAction: Record<string, unknown> };
    expect(encoded.tapAction).toEqual({ type: "refreshAll", targets: ["A1"] });
    expect(roundTrip({ type: "refreshAll" })).toEqual({ type: "refreshAll" });
  });

  it("writes an empty list, and reads it back as one", () => {
    // Absent means every layer and empty means "narrowed, nothing ticked yet".
    // Both refresh that whole complication on the watch, so the empty state is
    // safe rather than broken, but the picker has to tell them apart.
    const action: TapAction = { type: "refreshAll", targets: ["A1"], targetLayers: { A1: [] } };
    const cfg = newConfig("Edited", 0);
    cfg.tapAction = action;
    const encoded = encodeConfig(cfg) as { tapAction: Record<string, unknown> };
    expect(encoded.tapAction).toEqual({ type: "refreshAll", targets: ["A1"], targetLayers: { A1: [] } });
    expect(roundTrip(action)).toEqual(action);
  });

  it("drops the narrowing when all placed is on", () => {
    const cfg = newConfig("Edited", 0);
    cfg.tapAction = { type: "refreshAll", allPlaced: true, targetLayers: { A1: ["X1"] } };
    const encoded = encodeConfig(cfg) as { tapAction: Record<string, unknown> };
    expect(encoded.tapAction).toEqual({ type: "refreshAll", allPlaced: true });
    // And a document saved with both keys reads back with only the one that wins.
    expect(parseConfig({
      ...(encodeConfig(cfg) as Record<string, unknown>),
      tapAction: { type: "refreshAll", allPlaced: true, targetLayers: { A1: ["X1"] } },
    }).tapAction).toEqual({ type: "refreshAll", allPlaced: true });
  });

  it("cleans both halves the way every other refresh id is cleaned", () => {
    // Read straight off the wire, where the keys are whatever was written: an
    // id needs trimming and uppercasing, a blank key names nothing, and a value
    // that is not a list of ids is not a narrowing anyone wrote.
    const cfg = newConfig("Edited", 0);
    const raw = {
      ...(encodeConfig(cfg) as Record<string, unknown>),
      tapAction: {
        type: "refreshAll",
        targets: [" a1 ", "a1", "", "b2"],
        targetLayers: { " a1 ": [" x1 ", "x1", "", "y2"], "  ": ["z3"], b2: "not a list" },
      },
    };
    expect(parseConfig(raw).tapAction).toEqual({
      type: "refreshAll", targets: ["A1", "B2"], targetLayers: { A1: ["X1", "Y2"] },
    });
  });

  it("does not travel on a shared document", () => {
    // The keys are document ids on one watch and the values are layer ids
    // inside documents the reader does not have, so they go with the picks.
    const cfg = newConfig("Edited", 0);
    cfg.tapAction = { type: "refreshAll", targets: ["A1"], targetLayers: { A1: ["X1"] } };
    expect(scrubForShare(cfg, []).tapAction).toEqual({ type: "refreshAll" });
    const narrowedOnly = newConfig("Edited", 0);
    narrowedOnly.tapAction = { type: "refreshAll", targetLayers: { A1: [] } };
    expect(scrubForShare(narrowedOnly, []).tapAction).toEqual({ type: "refreshAll" });
    // "All placed" names nothing local, so it carries over as it is.
    const all = newConfig("Edited", 0);
    all.tapAction = { type: "refreshAll", allPlaced: true };
    expect(scrubForShare(all, []).tapAction).toEqual({ type: "refreshAll", allPlaced: true });
  });

  it("passes the audit that guards against a stray key", () => {
    const cfg = newConfig("Edited", 0);
    cfg.tapAction = { type: "refreshAll", targets: ["A1"], targetLayers: { A1: ["X1"] } };
    expect(auditUnknownKeys(encodeConfig(cfg))).toEqual([]);
  });
});
