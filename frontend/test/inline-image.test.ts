// A picture the author uploaded, carried in the document itself.
//
// The wire is `source: "inline"` with the bytes in `data` and `format` for
// anything that is not PNG. There is no entity, nothing is fetched, and the
// preview draws the bytes straight. The resize arithmetic is pure and tested
// here; the canvas half of `encodeInlinePicture` needs a browser and is not.

import { describe, expect, it } from "vitest";
import {
  IMAGE_INLINE_MAX_BYTES,
  base64ByteLength,
  encodeConfig,
  inlineImageBytes,
  inlineImageUrl,
  newConfig,
  newElement,
  parseConfig,
  primaryValue,
  type Element,
  type ImageElement,
} from "../src/model.js";
import {
  IMAGE_MAX_PIXEL_SIDE,
  IMAGE_PIXELS_PER_POINT,
  fitWithin,
  formatKiB,
  inlineFits,
  inlineTargetPixels,
} from "../src/inline-image.js";
import { compile } from "../src/compiler.js";
import { resolveAll, type ResolvedImage } from "../src/resolver.js";

/** An 8x8 PNG, 74 bytes. The same picture the shared fixture carries. */
const TINY_PNG = "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAEUlEQVR42mP476CAFTEMLQkAgYZXwZM8C00AAAAASUVORK5CYII=";

function imageLayer(tweak: (p: ImageElement) => void): Extract<Element, { kind: "image" }> {
  const el = newElement("image") as Extract<Element, { kind: "image" }>;
  el.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
  tweak(el.payload);
  return el;
}

function resolvedImage(tweak: (p: ImageElement) => void): ResolvedImage {
  const cfg = newConfig("Picture", 0);
  cfg.elements.push(imageLayer(tweak));
  const layout = resolveAll(cfg, { entityStates: new Map(), templateResults: new Map(), namedValues: cfg.values }).rectangular!;
  const el = layout.elements.find((e) => e.kind === "image");
  if (!el || el.kind !== "image") throw new Error("no picture layer resolved");
  return el;
}

describe("base64ByteLength", () => {
  it("counts what the decoder would produce", () => {
    expect(base64ByteLength(TINY_PNG)).toBe(74);
    expect(base64ByteLength("")).toBe(0);
    expect(base64ByteLength("QQ==")).toBe(1);
    expect(base64ByteLength("QUJD")).toBe(3);
  });
});

describe("the resize arithmetic", () => {
  it("gives a layer two pixels per design point", () => {
    expect(inlineTargetPixels(80, 40)).toEqual({
      width: 80 * IMAGE_PIXELS_PER_POINT, height: 40 * IMAGE_PIXELS_PER_POINT,
    });
  });

  it("caps the longest side however big the layer is", () => {
    const big = inlineTargetPixels(400, 200);
    expect(Math.max(big.width, big.height)).toBe(IMAGE_MAX_PIXEL_SIDE);
    // The shape of the layer survives the cap.
    expect(big.width / big.height).toBeCloseTo(2, 6);
  });

  it("falls back to the cap for a layer with no size yet", () => {
    expect(inlineTargetPixels(0, 0)).toEqual({ width: IMAGE_MAX_PIXEL_SIDE, height: IMAGE_MAX_PIXEL_SIDE });
  });

  it("fits a picture inside a box without enlarging it", () => {
    expect(fitWithin(1000, 500, 200, 200)).toEqual({ width: 200, height: 100 });
    expect(fitWithin(40, 40, 400, 400)).toEqual({ width: 40, height: 40 });
    expect(fitWithin(0, 10, 100, 100)).toEqual({ width: 1, height: 1 });
  });

  it("knows what fits the per-picture cap", () => {
    expect(inlineFits(TINY_PNG)).toBe(true);
    expect(inlineFits("A".repeat(IMAGE_INLINE_MAX_BYTES * 2))).toBe(false);
  });

  it("prints a size the author can read", () => {
    expect(formatKiB(0)).toBe("0 KB");
    expect(formatKiB(74)).toBe("1 KB");
    expect(formatKiB(48 * 1024)).toBe("48 KB");
  });
});

describe("an inline picture on the wire", () => {
  it("writes the bytes, writes no entity, and leaves PNG off the wire", () => {
    const cfg = newConfig("Picture", 0);
    cfg.elements.push(imageLayer((p) => {
      p.source = "inline";
      p.data = TINY_PNG;
    }));
    const encoded = encodeConfig(cfg) as unknown as { elements: { payload: Record<string, unknown> }[] };
    const payload = encoded.elements[0]!.payload;
    expect(payload.source).toBe("inline");
    expect(payload.data).toBe(TINY_PNG);
    expect("format" in payload).toBe(false);
    expect("entity" in payload).toBe(false);

    const back = parseConfig(encoded as unknown as Record<string, unknown>);
    const first = back.elements[0]!;
    if (first.kind !== "image") throw new Error("expected a picture layer");
    expect(first.payload.source).toBe("inline");
    expect(first.payload.data).toBe(TINY_PNG);
    expect(first.payload.format).toBeUndefined();
    expect(first.payload.entity.entityId).toBe("");
  });

  it("writes JPEG when that is what fitted", () => {
    const cfg = newConfig("Picture", 0);
    cfg.elements.push(imageLayer((p) => {
      p.source = "inline";
      p.data = TINY_PNG;
      p.format = "jpeg";
    }));
    const encoded = encodeConfig(cfg) as unknown as { elements: { payload: Record<string, unknown> }[] };
    expect(encoded.elements[0]!.payload.format).toBe("jpeg");
    const back = parseConfig(encoded as unknown as Record<string, unknown>);
    const first = back.elements[0]!;
    if (first.kind !== "image") throw new Error("expected a picture layer");
    expect(first.payload.format).toBe("jpeg");
  });

  it("keeps a camera layer writing exactly the bytes it always did", () => {
    const cfg = newConfig("Picture", 0);
    cfg.elements.push(imageLayer((p) => {
      p.entity = { entityId: "camera.front", displayName: "Front", domain: "camera" };
    }));
    const payload = (encodeConfig(cfg) as unknown as { elements: { payload: Record<string, unknown> }[] }).elements[0]!.payload;
    expect(payload.entity).toEqual({ entityId: "camera.front", displayName: "Front", domain: "camera" });
    expect("source" in payload).toBe(false);
    expect("data" in payload).toBe(false);
    expect("format" in payload).toBe(false);
  });

  it("reads an empty data key as no picture", () => {
    const cfg = newConfig("Picture", 0);
    cfg.elements.push(imageLayer((p) => { p.source = "inline"; }));
    const raw = encodeConfig(cfg) as unknown as { elements: { payload: Record<string, unknown> }[] };
    raw.elements[0]!.payload.data = "";
    const back = parseConfig(raw as unknown as Record<string, unknown>);
    const first = back.elements[0]!;
    if (first.kind !== "image") throw new Error("expected a picture layer");
    expect(first.payload.data).toBeUndefined();
  });
});

describe("resolving an inline picture", () => {
  it("draws the bytes as a data URL and says how big they are", () => {
    const image = resolvedImage((p) => {
      p.source = "inline";
      p.data = TINY_PNG;
    });
    expect(image.url).toBe(`data:image/png;base64,${TINY_PNG}`);
    expect(image.imageBytes).toBe(74);
    expect(image.showTimestamp).toBe(false);
  });

  it("names the JPEG media type when that is the format", () => {
    const image = resolvedImage((p) => {
      p.source = "inline";
      p.data = TINY_PNG;
      p.format = "jpeg";
    });
    expect(image.url).toBe(`data:image/jpeg;base64,${TINY_PNG}`);
  });

  it("draws the placeholder when the upload is still empty", () => {
    const image = resolvedImage((p) => { p.source = "inline"; });
    expect(image.url).toBeUndefined();
    expect(image.imageBytes).toBe(0);
  });

  it("asks for nothing: no entity registers and no picture is fetched", () => {
    const cfg = newConfig("Picture", 0);
    cfg.elements.push(imageLayer((p) => {
      p.source = "inline";
      p.data = TINY_PNG;
      // A layer switched over from a camera can still name one. It must not
      // put that camera back on the fetch list.
      p.entity = { entityId: "camera.front", displayName: "Front", domain: "camera" };
    }));
    expect(primaryValue(cfg.elements[0]!)).toBeUndefined();
    expect([...compile(cfg).entities.keys()]).toEqual([]);
  });
});

describe("the layer helpers", () => {
  it("count and address only an inline picture", () => {
    const fetched = imageLayer((p) => { p.entity = { entityId: "camera.front", displayName: "", domain: "camera" }; });
    expect(inlineImageBytes(fetched.payload)).toBe(0);
    expect(inlineImageUrl(fetched.payload)).toBeUndefined();
  });
});
