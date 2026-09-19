// With two or more layers picked, the inspector shows what they agree on
// rather than the settings of whichever one happened to be selected first.
// pickedCommon is the whole of that reading, so this is where the "all", "none"
// and "mixed" answers are pinned down.

import { describe, expect, it } from "vitest";

import { type Element as CElement, newConfig, newElement } from "../src/model.js";
import { elementColor, flagAcross, pickedCommon, setPlacement } from "../src/editors.js";

function config(kinds: readonly CElement["kind"][]) {
  const cfg = newConfig("Test", 0);
  const els = kinds.map((kind) => {
    const el = newElement(kind);
    cfg.elements.push(el);
    return el;
  });
  return { cfg, els };
}

describe("flagAcross", () => {
  it("answers all, none or mixed", () => {
    expect(flagAcross([true, true])).toBe("all");
    expect(flagAcross([false, false])).toBe("none");
    expect(flagAcross([true, false])).toBe("mixed");
  });

  it("calls an empty pick off rather than on", () => {
    expect(flagAcross([])).toBe("none");
  });
});

describe("elementColor", () => {
  it("has none for the kinds that draw no color of their own", () => {
    expect(elementColor(newElement("text"))).toBe("#FFFFFF");
    expect(elementColor(newElement("shape"))).toBe("#FFFFFF33");
    expect(elementColor(newElement("image"))).toBeUndefined();
    expect(elementColor(newElement("tap"))).toBeUndefined();
  });
});

describe("pickedCommon", () => {
  it("shares the one color every picked layer already has", () => {
    const { cfg, els } = config(["text", "icon"]);
    const c = pickedCommon(cfg, "rectangular", els);
    expect(c.colorable).toBe(true);
    expect(c.color).toBe("#FFFFFF");
    expect(c.hiddenHere).toBe("none");
  });

  it("leaves the color blank when they differ", () => {
    const { cfg, els } = config(["text", "shape"]);
    const c = pickedCommon(cfg, "rectangular", els);
    expect(c.colorable).toBe(true);
    expect(c.color).toBeUndefined();
  });

  it("offers no color at all when one of them has none", () => {
    const { cfg, els } = config(["text", "image"]);
    const c = pickedCommon(cfg, "rectangular", els);
    expect(c.colorable).toBe(false);
    expect(c.color).toBeUndefined();
  });

  // Hidden is written on the placement, which is the shape's own record of the
  // layer. The layer's own flag is not a setting any more: it is what keeps a
  // shape from drawing a layer that is not its own.
  it("reads hidden from the shape's placement", () => {
    const { cfg, els } = config(["text", "icon"]);
    const [text, icon] = els as [CElement, CElement];
    setPlacement(cfg, "rectangular", text.payload.id, { isHidden: true });
    expect(pickedCommon(cfg, "rectangular", els).hiddenHere).toBe("mixed");
    setPlacement(cfg, "rectangular", icon.payload.id, { isHidden: true });
    expect(pickedCommon(cfg, "rectangular", els).hiddenHere).toBe("all");
  });
});
