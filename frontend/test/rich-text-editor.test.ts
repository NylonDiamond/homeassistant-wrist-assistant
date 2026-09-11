// What the Rich text editor says and offers: a part's chip, a rule's Changes
// menu, the Type row, the notes after leaving Rich, a band table's colour bar,
// and which changes a rule aimed at one part may add. The form itself needs a
// browser; these words and lists do not.

import { describe, expect, it } from "vitest";
import {
  literal,
  newConfig,
  newElement,
  type Element,
  type TextElement,
  type TextPart,
  type Value,
} from "../src/model.js";
import {
  bandScale,
  changeKindsFor,
  chipRuns,
  contentSummary,
  partChip,
  partColourMode,
  partDotBackground,
  richTextBlockedHint,
  richTextOffNote,
  rulePartLabel,
  rulePartOptions,
  textType,
  type EditorHost,
} from "../src/editors.js";
import { turnOffRichText } from "../src/rich-text.js";

const PART_A = "A0000000-0000-4000-8000-000000000001";
const PART_B = "A0000000-0000-4000-8000-000000000002";
const PART_C = "A0000000-0000-4000-8000-000000000003";
const BAND_1 = "B0000000-0000-4000-8000-000000000001";
const BAND_2 = "B0000000-0000-4000-8000-000000000002";

const price = (format?: Value["format"]): Value => ({
  kind: { kind: "entityState", entityId: "sensor.electricity_price", displayName: "Electricity price", domain: "sensor" },
  ...(format ? { format } : {}),
});

const part = (id: string, value: Value, extra: Partial<TextPart> = {}): TextPart => ({ id, value, ...extra });

/** The chip's text as drawn, spaces swapped for the faint dot. */
const drawn = (text: string) => chipRuns(text).map((r) => (r.space ? "·".repeat(r.text.length) : r.text)).join("");

describe("a part's chip", () => {
  it("cuts typed text at its spaces, so each one can be drawn as a dot", () => {
    expect(chipRuns("Now ")).toEqual([{ text: "Now", space: false }, { text: " ", space: true }]);
    expect(chipRuns("  €/kWh")).toEqual([{ text: "  ", space: true }, { text: "€/kWh", space: false }]);
    expect(chipRuns("")).toEqual([]);
    expect(drawn(" Car  battery ")).toBe("·Car··battery·");
  });

  it("shows typed words with their own prefix and suffix, a template as its source, and a value by name", () => {
    expect(partChip({ ...literal("kWh"), format: { prefix: " " } })).toEqual({ kind: "text", label: " kWh" });
    expect(partChip(price())).toEqual({ kind: "value", label: "Electricity price" });
    expect(partChip({ kind: { kind: "jinja", value: "{{ states('sensor.a') }}" } })).toEqual({ kind: "template", label: "{{ states('sensor.a') }}" });
    expect(partChip({ kind: { kind: "jinja", value: "" } })).toEqual({ kind: "template", label: "template" });
  });

  it("picks its colour choice from the keys the part holds", () => {
    expect(partColourMode(part(PART_A, literal("a")))).toBe("layer");
    expect(partColourMode(part(PART_A, literal("a"), { colorHex: "#64D2FF" }))).toBe("pick");
    expect(partColourMode(part(PART_A, price(), { coloring: "bands" }))).toBe("bands");
  });

  it("draws its dot in its colour, or as a wheel of its own bands in order", () => {
    expect(partDotBackground(part(PART_A, literal("a")), "#8E8E93")).toBe("#8E8E93");
    expect(partDotBackground(part(PART_A, literal("a"), { colorHex: "#64D2FF" }), "#8E8E93")).toBe("#64D2FF");
    const banded = part(PART_A, price(), {
      coloring: "bands",
      bands: [{ id: BAND_2, upTo: 30, colorHex: "#FFD60A" }, { id: BAND_1, upTo: 20, colorHex: "#30D158" }],
    });
    expect(partDotBackground(banded, "#FFFFFF")).toBe("conic-gradient(#30D158 0% 33.3%, #FFD60A 33.3% 66.7%, #FF453A 66.7% 100%)");
    // By value with no table yet colours nothing, so the dot says so.
    expect(partDotBackground(part(PART_A, price(), { coloring: "bands" }), "#FFFFFF")).toBe("#FFFFFF");
  });
});

describe("a text layer's Type row", () => {
  it("reads Countdown over any parts, Rich only with parts, and Plain otherwise", () => {
    expect(textType({})).toBe("plain");
    expect(textType({ parts: [] })).toBe("plain");
    expect(textType({ parts: [part(PART_A, literal("Now"))] })).toBe("rich");
    expect(textType({ parts: [part(PART_A, literal("Now"))], countdown: true })).toBe("countdown");
    expect(textType({ countdown: true })).toBe("countdown");
  });
});

describe("a band table's colour bar", () => {
  it("runs one typical band past each end of the table", () => {
    expect(bandScale([20, 10])).toEqual({ lo: 0, hi: 30 });
    expect(bandScale([4])).toEqual({ lo: 2, hi: 6 });
    expect(bandScale([0])).toEqual({ lo: -1, hi: 1 });
  });

  it("stretches to take in the current value", () => {
    expect(bandScale([10, 20], 50)).toEqual({ lo: 0, hi: 50 });
    expect(bandScale([10, 20], -5)).toEqual({ lo: -5, hi: 30 });
    expect(bandScale([10, 20], 15)).toEqual({ lo: 0, hi: 30 });
    expect(bandScale([], 7)).toEqual({ lo: 6, hi: 8 });
  });
});

describe("the Changes menu on a rich text layer's rule", () => {
  const parts = [
    part(PART_A, literal("  Now  ")),
    part(PART_B, literal("Electricity price right now")),
    part(PART_C, price({ decimals: 2 })),
  ];

  it("labels a part by number, then its words trimmed short or the value's name", () => {
    expect(rulePartLabel(parts[0]!, 0)).toBe(`Part 1: "Now"`);
    expect(rulePartLabel(parts[1]!, 1)).toBe(`Part 2: "Electricity price right…"`);
    expect(rulePartLabel(parts[2]!, 2)).toBe("Part 3: Electricity price");
    expect(rulePartLabel(part(PART_A, literal("   ")), 0)).toBe("Part 1: spaces");
    expect(rulePartLabel(part(PART_A, literal("")), 0)).toBe("Part 1: empty");
  });

  it("offers the whole text first, then every part, and keeps a part that has gone", () => {
    expect(rulePartOptions(parts, undefined).map(([id]) => id)).toEqual(["", PART_A, PART_B, PART_C]);
    expect(rulePartOptions(parts, undefined)[0]).toEqual(["", "Whole text"]);
    const gone = "C0000000-0000-4000-8000-000000000009";
    expect(rulePartOptions(parts, gone).at(-1)).toEqual([gone, "A part that is gone"]);
    expect(rulePartOptions(parts, PART_B)).toHaveLength(4);
  });

  it("offers only the changes a part reads once a part is picked", () => {
    expect(changeKindsFor("text", true)).toEqual(["setColor", "setText", "setFontSize", "setFontWeight", "hide", "show"]);
    expect(changeKindsFor("text")).toEqual(expect.arrayContaining(["setOpacity", "setRotation"]));
    expect(changeKindsFor("layout")).toEqual(changeKindsFor("layout", false));
  });
});

describe("the notes under the Rich text switch", () => {
  it("names each part that blocks turning it off, grouped by why", () => {
    expect(richTextBlockedHint([{ index: 1, partId: PART_B, reason: "kind" }])).toBe(
      "Rich text stays on, because the parts cannot join into one line. Part 2 shows a value a template cannot read, such as data age or a chart's number. Change or remove that part first.",
    );
    expect(richTextBlockedHint([
      { index: 0, partId: PART_A, reason: "kind" },
      { index: 2, partId: PART_C, reason: "kind" },
      { index: 3, partId: PART_B, reason: "format" },
    ])).toBe(
      "Rich text stays on, because the parts cannot join into one line. Parts 1 and 3 show a value a template cannot read, such as data age or a chart's number. Part 4 uses a relative time or duration format, which a template cannot print. Change or remove those parts first.",
    );
  });

  it("reads the blocked parts the join really reports", () => {
    const el = newElement("text") as Extract<Element, { kind: "text" }>;
    const t: TextElement = el.payload;
    t.parts = [part(PART_A, literal("Age ")), part(PART_B, { kind: { kind: "dataAge" } }), part(PART_C, price({ relativeTime: true }))];
    const result = turnOffRichText(t);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(richTextBlockedHint(result.blocked)).toContain("Part 2 shows a value a template cannot read");
    expect(richTextBlockedHint(result.blocked)).toContain("Part 3 uses a relative time or duration format");
    expect(t.parts).toHaveLength(3);
  });

  it("says what moved into Look, or how the parts joined", () => {
    expect(richTextOffNote({ joined: false, moved: [] })).toBe("Rich text is off.");
    expect(richTextOffNote({ joined: false, moved: ["fontSize", "color", "bands"] }))
      .toBe("Rich text is off. The part's font size, colour and colour bands moved into Look.");
    expect(richTextOffNote({ joined: true, template: false })).toBe("Rich text is off. The parts joined into one line of text.");
    expect(richTextOffNote({ joined: true, template: true }))
      .toBe("Rich text is off. The parts joined into one template, so the live values still update.");
  });
});

describe("the Content card's summary", () => {
  it("counts the parts of a rich text layer instead of naming its fallback value", () => {
    const cfg = newConfig("Rich", 0);
    const el = newElement("text") as Extract<Element, { kind: "text" }>;
    cfg.elements = [el];
    const host = { config: cfg, hass: { states: {} } } as unknown as EditorHost;
    el.payload.parts = [part(PART_A, literal("Now ")), part(PART_B, price())];
    expect(contentSummary(host, el)).toBe("Rich text, 2 parts");
    el.payload.parts = [part(PART_A, literal("Now"))];
    expect(contentSummary(host, el)).toBe("Rich text, 1 part");
    // A countdown never draws its parts, so it reads as the value it counts to.
    el.payload.countdown = true;
    expect(contentSummary(host, el)).not.toContain("Rich text");
  });
});
