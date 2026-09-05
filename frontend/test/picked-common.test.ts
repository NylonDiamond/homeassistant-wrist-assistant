// With two or more layers picked, the inspector shows what they agree on
// rather than the settings of whichever one happened to be selected first.
// pickedCommon is the whole of that reading, so this is where the "all", "none"
// and "mixed" answers are pinned down.

import { describe, expect, it } from "vitest";

import { type Element as CElement, newConfig, newElement } from "../src/model.js";
import { elementColour, flagAcross, pickedCommon, setPlacement } from "../src/editors.js";

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

describe("elementColour", () => {
  it("has none for the kinds that draw no colour of their own", () => {
    expect(elementColour(newElement("text"))).toBe("#FFFFFF");
    expect(elementColour(newElement("shape"))).toBe("#FFFFFF33");
    expect(elementColour(newElement("image"))).toBeUndefined();
    expect(elementColour(newElement("tap"))).toBeUndefined();
  });
});

describe("pickedCommon", () => {
  it("shares the one colour every picked layer already has", () => {
    const { cfg, els } = config(["text", "icon"]);
    const c = pickedCommon(cfg, "rectangular", els);
    expect(c.colourable).toBe(true);
    expect(c.colour).toBe("#FFFFFF");
    expect(c.hiddenHere).toBe("none");
    expect(c.hiddenEverywhere).toBe("none");
  });

  it("leaves the colour blank when they differ", () => {
    const { cfg, els } = config(["text", "shape"]);
    const c = pickedCommon(cfg, "rectangular", els);
    expect(c.colourable).toBe(true);
    expect(c.colour).toBeUndefined();
  });

  it("offers no colour at all when one of them has none", () => {
    const { cfg, els } = config(["text", "image"]);
    const c = pickedCommon(cfg, "rectangular", els);
    expect(c.colourable).toBe(false);
    expect(c.colour).toBeUndefined();
  });

  it("reads hidden per shape, not from the shared flag", () => {
    const { cfg, els } = config(["text", "icon"]);
    const [text, icon] = els as [CElement, CElement];
    setPlacement(cfg, "rectangular", text.payload.id, { isHidden: true });
    expect(pickedCommon(cfg, "rectangular", els).hiddenHere).toBe("mixed");
    setPlacement(cfg, "rectangular", icon.payload.id, { isHidden: true });
    expect(pickedCommon(cfg, "rectangular", els).hiddenHere).toBe("all");
    // The per-shape placement never touched the layers' own flag.
    expect(pickedCommon(cfg, "rectangular", els).hiddenEverywhere).toBe("none");
    // Another shape has no placements of its own, so it still reads the flag.
    expect(pickedCommon(cfg, "circular", els).hiddenHere).toBe("none");
  });

  it("reads the shared flag across every shape", () => {
    const { cfg, els } = config(["text", "icon"]);
    els[0]!.payload.isHidden = true;
    expect(pickedCommon(cfg, "rectangular", els).hiddenEverywhere).toBe("mixed");
    els[1]!.payload.isHidden = true;
    expect(pickedCommon(cfg, "rectangular", els).hiddenEverywhere).toBe("all");
  });
});
