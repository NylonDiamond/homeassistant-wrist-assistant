// A text layer's colour by value: the chart's band table and highlight, read
// against the numbers inside the text. The shared fixture
// (fixtures/text_value_colors.json) pins the resolved runs on both sides; this
// file pins the wire shape, the tokenizer's ranges, and the edges the fixture
// does not spell out.

import { describe, expect, it } from "vitest";
import {
  auditUnknownKeys,
  CHART_DEFAULT_BAND_HIGH_HEX,
  CHART_DEFAULT_HIGH_HEX,
  CHART_DEFAULT_LOW_HEX,
  encodeConfig,
  newConfig,
  newElement,
  parseConfig,
  textColorsByValue,
  type Element,
  type TextElement,
} from "../src/model.js";
import { chartNumbers, numberTokens, resolveAll, textValueSpans, type ResolvedText } from "../src/resolver.js";

const VALUE_COLOUR_KEYS = ["coloring", "bands", "bandAboveColorHex", "highlight", "highColorHex", "lowColorHex"];

function textConfig(tweak: (p: TextElement) => void) {
  const cfg = newConfig("Text", 0);
  const el = newElement("text") as Extract<Element, { kind: "text" }>;
  tweak(el.payload);
  cfg.elements = [el];
  return cfg;
}

function encodedPayload(cfg: ReturnType<typeof newConfig>): Record<string, unknown> {
  const enc = encodeConfig(cfg) as Record<string, unknown>;
  return (enc.elements as Record<string, unknown>[])[0]!.payload as Record<string, unknown>;
}

function resolvedText(tweak: (p: TextElement) => void): ResolvedText {
  const cfg = textConfig(tweak);
  const layout = resolveAll(cfg, {
    entityStates: new Map(),
    templateResults: new Map(),
    historySeries: new Map(),
    namedValues: cfg.values,
  }).rectangular!;
  return layout.elements[0] as ResolvedText;
}

describe("text colour by value on the wire", () => {
  it("round-trips every key and writes them after alignment, in the key table's order", () => {
    const cfg = textConfig((p) => {
      p.alignment = "leading";
      p.coloring = "bands";
      p.bands = [{ id: "B0000000-0000-4000-8000-000000000001", upTo: 35, colorHex: "#32D74B" }];
      p.bandAboveColorHex = "#FF9F0A";
      p.highlight = "both";
      p.highColorHex = "#FF3B30";
      p.lowColorHex = "#34FF6A";
    });
    const payload = encodedPayload(cfg);
    const keys = Object.keys(payload);
    expect(keys.slice(keys.indexOf("alignment"))).toEqual(["alignment", ...VALUE_COLOUR_KEYS]);
    expect(auditUnknownKeys(encodeConfig(cfg))).toEqual([]);

    const back = parseConfig(encodeConfig(cfg)).elements[0] as Extract<Element, { kind: "text" }>;
    expect(back.payload.coloring).toBe("bands");
    expect(back.payload.bands).toEqual([{ id: "B0000000-0000-4000-8000-000000000001", upTo: 35, colorHex: "#32D74B" }]);
    expect(back.payload.bandAboveColorHex).toBe("#FF9F0A");
    expect(back.payload.highlight).toBe("both");
    expect(back.payload.highColorHex).toBe("#FF3B30");
    expect(back.payload.lowColorHex).toBe("#34FF6A");
    expect(encodedPayload(parseConfig(encodeConfig(cfg)))).toEqual(payload);
  });

  it("writes none of the keys for a plain text layer", () => {
    const payload = encodedPayload(textConfig(() => {}));
    for (const key of VALUE_COLOUR_KEYS) expect(payload, key).not.toHaveProperty(key);
  });

  it("writes none of the keys when each is set to its default", () => {
    const payload = encodedPayload(textConfig((p) => {
      p.coloring = "uniform";
      p.bands = [];
      p.bandAboveColorHex = CHART_DEFAULT_BAND_HIGH_HEX;
      p.highlight = "none";
      p.highColorHex = CHART_DEFAULT_HIGH_HEX;
      p.lowColorHex = CHART_DEFAULT_LOW_HEX;
    }));
    for (const key of VALUE_COLOUR_KEYS) expect(payload, key).not.toHaveProperty(key);
  });

  it("keeps a table when the layer is back on One colour, as a chart does", () => {
    const payload = encodedPayload(textConfig((p) => {
      p.bands = [{ id: "B0000000-0000-4000-8000-000000000002", upTo: 10, colorHex: "#0A84FF" }];
    }));
    expect(payload).not.toHaveProperty("coloring");
    expect(payload.bands).toEqual([{ id: "B0000000-0000-4000-8000-000000000002", upTo: 10, colorHex: "#0A84FF" }]);
  });

  it("reads explicit defaults and unknown spellings as absent", () => {
    const cfg = textConfig(() => {});
    const enc = encodeConfig(cfg) as Record<string, unknown>;
    const payload = (enc.elements as Record<string, unknown>[])[0]!.payload as Record<string, unknown>;
    Object.assign(payload, {
      coloring: "gradient",
      bands: [],
      bandAboveColorHex: CHART_DEFAULT_BAND_HIGH_HEX,
      highlight: "middle",
      highColorHex: CHART_DEFAULT_HIGH_HEX,
      lowColorHex: CHART_DEFAULT_LOW_HEX,
    });
    const back = (parseConfig(enc).elements[0] as Extract<Element, { kind: "text" }>).payload;
    for (const key of VALUE_COLOUR_KEYS) expect(back, key).not.toHaveProperty(key);
  });
});

describe("numberTokens", () => {
  const ranges = (raw: string) => numberTokens(raw).map((t) => [t.value, raw.slice(t.start, t.end)]);

  it("returns where each number sits, not only its value", () => {
    expect(numberTokens("32 36")).toEqual([{ value: 32, start: 0, end: 2 }, { value: 36, start: 3, end: 5 }]);
    expect(ranges("Now 32 ct, next 36 ct")).toEqual([[32, "32"], [36, "36"]]);
  });

  it("covers the sign and the decimal point it read", () => {
    expect(ranges("-3.5 to 12.25, 5-2")).toEqual([[-3.5, "-3.5"], [12.25, "12.25"], [5, "5"], [2, "2"]]);
    expect(ranges("+5")).toEqual([[5, "+5"]]);
    expect(ranges("2026-09-05")).toEqual([[2026, "2026"], [9, "09"], [5, "05"]]);
  });

  it("ends a token at a second dot, and the dot starts the next", () => {
    expect(ranges("1.2.3")).toEqual([[1.2, "1.2"], [0.3, ".3"]]);
  });

  it("skips a lone sign or dot", () => {
    expect(numberTokens("a - b . c")).toEqual([]);
  });

  it("counts offsets in code units past characters wider than one", () => {
    const raw = "\u{1F525}13 \u{1F525}14";
    expect(numberTokens(raw)).toEqual([{ value: 13, start: 2, end: 4 }, { value: 14, start: 7, end: 9 }]);
  });

  it("stops at the limit, the same one the chart reads with", () => {
    expect(numberTokens("1 2 3", 2).map((t) => t.value)).toEqual([1, 2]);
    const long = Array.from({ length: 300 }, (_, i) => String(i)).join(" ");
    expect(numberTokens(long)).toHaveLength(240);
  });

  it("gives the chart exactly the values it read before", () => {
    for (const raw of ["13,14,16", "€13; €14; €16", "1.2.3", "-3.5 to 12.25, 5-2", "2026-09-05", ""]) {
      expect(chartNumbers(raw)).toEqual(numberTokens(raw).map((t) => t.value));
    }
  });
});

describe("text colour by value resolution", () => {
  const table = (p: TextElement) => {
    p.coloring = "bands";
    p.bands = [{ id: "B0000000-0000-4000-8000-000000000003", upTo: 35, colorHex: "#32D74B" }];
  };

  it("applies only with a non-empty table or a highlight, and never to a countdown", () => {
    const base = (newElement("text") as Extract<Element, { kind: "text" }>).payload;
    expect(textColorsByValue(base)).toBe(false);
    expect(textColorsByValue({ ...base, coloring: "bands" })).toBe(false);
    expect(textColorsByValue({ ...base, bands: [{ id: "x", upTo: 1, colorHex: "#FFFFFF" }] })).toBe(false);
    expect(textColorsByValue({ ...base, coloring: "bands", bands: [{ id: "x", upTo: 1, colorHex: "#FFFFFF" }] })).toBe(true);
    expect(textColorsByValue({ ...base, highlight: "lowest" })).toBe(true);
    expect(textColorsByValue({ ...base, highlight: "both", countdown: true })).toBe(false);
  });

  it("leaves resolved text untouched when it does not apply", () => {
    const plain = resolvedText((p) => { p.value = { kind: { kind: "literal", value: "32 36" } }; });
    expect(plain).not.toHaveProperty("spans");
  });

  it("merges an unmarked number into the text around it under highlight alone", () => {
    const r = resolvedText((p) => {
      p.value = { kind: { kind: "literal", value: "a 1 b 2 c" } };
      p.highlight = "highest";
    });
    expect(r.spans).toEqual([
      { text: "a 1 b ", colorHex: "#FFFFFF" },
      { text: "2", colorHex: CHART_DEFAULT_HIGH_HEX },
      { text: " c", colorHex: "#FFFFFF" },
    ]);
  });

  it("gives a number past the last band the colour of the rest, never the layer colour", () => {
    const r = resolvedText((p) => {
      p.value = { kind: { kind: "literal", value: "a 40 b" } };
      table(p);
    });
    expect(r.spans).toEqual([
      { text: "a ", colorHex: "#FFFFFF" },
      { text: "40", colorHex: CHART_DEFAULT_BAND_HIGH_HEX },
      { text: " b", colorHex: "#FFFFFF" },
    ]);
  });

  it("merges a band colour that happens to be the layer colour", () => {
    const r = resolvedText((p) => {
      p.value = { kind: { kind: "literal", value: "x 10 y" } };
      p.colorSlot.baseColorHex = "#32D74B";
      table(p);
    });
    expect(r.spans).toEqual([{ text: "x 10 y", colorHex: "#32D74B" }]);
  });

  it("gives text with no numbers one run in the layer colour, and empty text no runs", () => {
    const el = (newElement("text") as Extract<Element, { kind: "text" }>).payload;
    el.highlight = "both";
    expect(textValueSpans("Off", "#FFFFFF", el)).toEqual([{ text: "Off", colorHex: "#FFFFFF" }]);
    expect(textValueSpans("", "#FFFFFF", el)).toEqual([]);
  });

  it("ends a coloured number at its last digit, leaving a trailing dot in the layer colour", () => {
    const el = (newElement("text") as Extract<Element, { kind: "text" }>).payload;
    el.highlight = "highest";
    // The token still covers the dot; only the coloured run stops short of it.
    expect(numberTokens("costs 5.")).toEqual([{ value: 5, start: 6, end: 8 }]);
    expect(textValueSpans("costs 5.", "#FFFFFF", el)).toEqual([
      { text: "costs ", colorHex: "#FFFFFF" },
      { text: "5", colorHex: CHART_DEFAULT_HIGH_HEX },
      { text: ".", colorHex: "#FFFFFF" },
    ]);
    expect(textValueSpans("-5. and 7.5.", "#FFFFFF", el)).toEqual([
      { text: "-5. and ", colorHex: "#FFFFFF" },
      { text: "7.5", colorHex: CHART_DEFAULT_HIGH_HEX },
      { text: ".", colorHex: "#FFFFFF" },
    ]);
  });

  it("marks the lowest only, first occurrence, with the default colour", () => {
    const el = (newElement("text") as Extract<Element, { kind: "text" }>).payload;
    el.highlight = "lowest";
    expect(textValueSpans("3 1 1", "#FFFFFF", el)).toEqual([
      { text: "3 ", colorHex: "#FFFFFF" },
      { text: "1", colorHex: CHART_DEFAULT_LOW_HEX },
      { text: " 1", colorHex: "#FFFFFF" },
    ]);
  });
});
