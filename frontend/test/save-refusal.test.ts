// A complication is one shape. A document an older panel wrote, with several
// of them, still opens and still draws; the save is what refuses.

import { describe, expect, it } from "vitest";
import { blankReferenceRefusal, saveRefusal } from "../src/draft.js";
import {
  type CustomComplicationConfig,
  type Element,
  type ValueKind,
  encodeConfig,
  encodeValue,
  legacyConfig,
  newConfig,
  newControlConfig,
  newElement,
  newId,
  parseConfig,
} from "../src/model.js";
import { footerStatus } from "../src/panel.js";

describe("saveRefusal", () => {
  it("lets a one-shape document through", () => {
    expect(saveRefusal(newConfig("Kitchen", 0, "rectangular"))).toBeUndefined();
    expect(saveRefusal(newConfig("Kitchen", 0, "inline"))).toBeUndefined();
  });

  it("lets a control with no shape through", () => {
    expect(saveRefusal(newControlConfig("Kettle", 0))).toBeUndefined();
  });

  it("refuses a document with two shapes, and says how many", () => {
    const refusal = saveRefusal(legacyConfig("Kitchen", 0, ["rectangular", "circular"]));
    expect(refusal).toContain("2 shapes");
    expect(refusal).toContain("one shape now");
  });

  it("refuses the three-shape document every older panel wrote", () => {
    expect(saveRefusal(legacyConfig("Kitchen", 0))).toContain("3 shapes");
  });

  it("refuses a control that also carries several shapes", () => {
    expect(saveRefusal(newControlConfig("Kettle", 0, "rectangular"))).toBeUndefined();
    const many = legacyConfig("Kettle", 0, ["rectangular", "circular"]);
    expect(saveRefusal(many)).toBeDefined();
  });
});

// A shared value, chart, list or picture left on "(choose)" is an empty id,
// which the watch cannot read: it drops the whole document, not the value.
describe("a reference nobody chose", () => {
  function withText(kind: ValueKind, name = "Temp"): CustomComplicationConfig {
    const cfg = newConfig("Kitchen", 0, "rectangular");
    const el = newElement("text") as Extract<Element, { kind: "text" }>;
    el.payload.name = name;
    el.payload.value = { kind };
    cfg.elements.push(el);
    return cfg;
  }

  it("refuses each of the four, naming the layer and what it reads", () => {
    expect(saveRefusal(withText({ kind: "chartStat", layer: "", stat: "latest" })))
      .toBe('Text layer "Temp" reads a chart that is not chosen. Choose one, or pick another source.');
    expect(saveRefusal(withText({ kind: "listStat", layer: "", stat: "count" }))).toContain("reads a list that is not chosen");
    expect(saveRefusal(withText({ kind: "imageTime", layer: "" }))).toContain("reads a picture that is not chosen");
    expect(saveRefusal(withText({ kind: "named", id: "" }))).toContain("reads a shared value that is not chosen");
  });

  it("lets a chosen reference through", () => {
    expect(saveRefusal(withText({ kind: "chartStat", layer: "0A3F2C1E-0000-4000-8000-000000000001", stat: "latest" }))).toBeUndefined();
    expect(blankReferenceRefusal(withText({ kind: "literal", value: "" }))).toBeUndefined();
  });

  it("finds one in a rule or a shared value, not only a layer's own text", () => {
    const cfg = withText({ kind: "literal", value: "21" });
    cfg.values.push({ id: newId(), name: "Peak", value: { kind: { kind: "chartStat", layer: "", stat: "latest" } } });
    expect(saveRefusal(cfg)).toBe('Shared value "Peak" reads a chart that is not chosen. Choose one, or pick another source.');
  });

  it("is written as empty text if it reaches the wire anyway", () => {
    for (const kind of [
      { kind: "chartStat", layer: "", stat: "latest" },
      { kind: "listStat", layer: " ", stat: "count" },
      { kind: "imageTime", layer: "" },
      { kind: "named", id: "" },
    ] as ValueKind[]) {
      expect(encodeValue({ kind })).toEqual({ kind: { kind: "literal", value: "" } });
    }
    const id = "0A3F2C1E-0000-4000-8000-000000000001";
    expect(encodeValue({ kind: { kind: "chartStat", layer: id, stat: "latest" } })).toEqual({ kind: { kind: "chartStat", layer: id, stat: "latest" } });
  });

  it("round-trips a whole document with one to a value every app decodes", () => {
    const cfg = withText({ kind: "chartStat", layer: "", stat: "latest" });
    const back = parseConfig(encodeConfig(cfg));
    const text = back.elements.find((e) => e.kind === "text") as Extract<Element, { kind: "text" }>;
    expect(text.payload.value.kind).toEqual({ kind: "literal", value: "" });
  });
});

describe("the footer while Save refuses", () => {
  it("says why, above the plain unsaved line", () => {
    expect(footerStatus({ revision: 4, dirty: true, updatedBy: "", refusal: "Pick a chart." }))
      .toEqual({ tone: "warn", text: "Cannot save yet: Pick a chart." });
  });

  it("gives way to a failed save and a template error", () => {
    expect(footerStatus({ revision: 4, dirty: true, updatedBy: "", refusal: "Pick a chart.", error: "offline" }).text).toBe("Not saved: offline");
  });
});
