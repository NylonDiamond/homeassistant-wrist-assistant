// A tile's icon photo made ready to store (icon-photo-tidy.ts): the white
// balance, the exposure and the saturation on known pixels, alpha left
// alone, the crop to what is drawn with its padding, and the PNG size
// steps. The same steps run on the iPhone (app repo
// docs/photo_tiles_plan_2026-10.md, "Tidy").

import { describe, expect, it } from "vitest";

import {
  ICON_PHOTO_MAX_BYTES,
  iconPhotoCrop,
  stepDownIconPhoto,
  tidyIconPixels,
} from "../src/watch-pages/icon-photo-tidy.js";

/** RGBA bytes from [r, g, b, a] pixels, each 0 to 255. */
function pixels(...px: [number, number, number, number][]): Uint8ClampedArray {
  return new Uint8ClampedArray(px.flat());
}

const luma = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/** The tidy worked out by hand for one counted pixel (values 0 to 1). */
function byHand(r: number, g: number, b: number, balance: [number, number, number], exposure: number): [number, number, number] {
  const c = [r * balance[0] * exposure, g * balance[1] * exposure, b * balance[2] * exposure];
  const y = luma(c[0]!, c[1]!, c[2]!);
  return c.map((v) => Math.min(1, Math.max(0, y + 0.85 * (v - y)))) as [number, number, number];
}

describe("the tidy", () => {
  it("balances each channel toward gray, held to 0.8 to 1.25", () => {
    // Means 0.6, 0.4, 0.2: gray 0.4, so gains 0.667 (held to 0.8), 1, 2 (held to 1.25).
    const data = pixels([153, 102, 51, 255]);
    const { balance } = tidyIconPixels(data);
    expect(balance[0]).toBe(0.8);
    expect(balance[1]).toBeCloseTo(1, 10);
    expect(balance[2]).toBe(1.25);
  });

  it("a gentle cast is balanced fully", () => {
    // Means 128, 115, 102 (of 255): gray 115, gains 115/128, 1, 115/102.
    const { balance } = tidyIconPixels(pixels([128, 115, 102, 255]));
    expect(balance[0]).toBeCloseTo(115 / 128, 10);
    expect(balance[1]).toBeCloseTo(1, 10);
    expect(balance[2]).toBeCloseTo(115 / 102, 10);
  });

  it("sets the exposure to a mean luma of 0.55, held to 0.75 to 1.6", () => {
    // A dark gray: balance 1, mean luma 0.2, gain 2.75 held to 1.6.
    expect(tidyIconPixels(pixels([51, 51, 51, 255])).exposure).toBe(1.6);
    // A near white: mean luma 0.9, gain 0.61 held to 0.75.
    expect(tidyIconPixels(pixels([230, 230, 230, 255])).exposure).toBe(0.75);
    // A mid gray: mean luma 0.5, gain 1.1.
    expect(tidyIconPixels(pixels([127.5, 127.5, 127.5, 255])).exposure).toBeCloseTo(0.55 / (128 / 255), 10);
    // Black: nothing to measure, the top of the range.
    expect(tidyIconPixels(pixels([0, 0, 0, 255])).exposure).toBe(1.6);
  });

  it("mixes each channel toward the pixel's luma by 0.85, then clamps", () => {
    const data = pixels([200, 100, 50, 255], [60, 120, 180, 255]);
    const before = [...data].map((v) => v / 255);
    const { balance, exposure } = tidyIconPixels(data);
    for (let i = 0; i < 2; i++) {
      const want = byHand(before[i * 4]!, before[i * 4 + 1]!, before[i * 4 + 2]!, balance, exposure);
      for (let c = 0; c < 3; c++) expect(Math.abs(data[i * 4 + c]! - want[c]! * 255)).toBeLessThanOrEqual(0.5);
    }
  });

  it("counts only pixels with alpha 0.5 or more, and never changes alpha", () => {
    // A red cast in the clear pixels does not count: the counted pixel is gray.
    const data = pixels([128, 128, 128, 255], [255, 0, 0, 100], [255, 0, 0, 0], [128, 128, 128, 128]);
    const { balance } = tidyIconPixels(data);
    expect(balance.map((g) => Math.round(g * 1000) / 1000)).toEqual([1, 1, 1]);
    expect([data[3], data[7], data[11], data[15]]).toEqual([255, 100, 0, 128]);
  });

  it("leaves a picture with nothing counted as it is", () => {
    const data = pixels([255, 0, 0, 10], [0, 255, 0, 120]);
    const copy = [...data];
    expect(tidyIconPixels(data)).toEqual({ balance: [1, 1, 1], exposure: 1 });
    expect([...data]).toEqual(copy);
  });

  it("keeps every value in 0 to 1", () => {
    const data = pixels([255, 255, 10, 255], [250, 5, 5, 255]);
    tidyIconPixels(data);
    expect([...data].every((v) => v >= 0 && v <= 255)).toBe(true);
  });
});

/** A width by height picture, clear, with `fill` drawn at alpha `a`. */
function picture(width: number, height: number, fill: { x: number; y: number; w: number; h: number }, a = 255): Uint8ClampedArray {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = fill.y; y < fill.y + fill.h; y++) for (let x = fill.x; x < fill.x + fill.w; x++) data[(y * width + x) * 4 + 3] = a;
  return data;
}

describe("the crop", () => {
  it("is the drawn bounds plus 6% of their width and height a side", () => {
    // Drawn: 50 wide, 100 high at (20, 30): 3 px across, 6 px down.
    expect(iconPhotoCrop(picture(200, 200, { x: 20, y: 30, w: 50, h: 100 }), 200, 200)).toEqual({ x: 17, y: 24, width: 56, height: 112 });
  });

  it("may reach past the picture, where it is clear", () => {
    expect(iconPhotoCrop(picture(100, 100, { x: 0, y: 0, w: 100, h: 100 }), 100, 100)).toEqual({ x: -6, y: -6, width: 112, height: 112 });
  });

  it("counts pixels above alpha 0.1 only", () => {
    const data = picture(100, 100, { x: 40, y: 40, w: 10, h: 10 });
    // A faint haze round it (alpha 0.1 and under) is not the photo.
    for (let i = 0; i < 100; i++) if (data[i * 4 + 3] === 0) data[i * 4 + 3] = 25;
    expect(iconPhotoCrop(data, 100, 100)).toEqual({ x: 39, y: 39, width: 12, height: 12 });
    data[3] = 26;
    expect(iconPhotoCrop(data, 100, 100).x).toBeLessThan(0);
  });

  it("is the whole picture when nothing is drawn", () => {
    expect(iconPhotoCrop(new Uint8ClampedArray(30 * 20 * 4), 30, 20)).toEqual({ x: 0, y: 0, width: 30, height: 20 });
  });
});

describe("the size steps", () => {
  it("scales the long side to 384 or less, never up", async () => {
    const tried: [number, number][] = [];
    const out = await stepDownIconPhoto(1200, 600, async (w, h) => { tried.push([w, h]); return { size: 1000 }; });
    expect(out).toMatchObject({ width: 384, height: 192 });
    expect(tried).toEqual([[384, 192]]);
    expect(await stepDownIconPhoto(200, 300, async () => ({ size: 1 }))).toMatchObject({ width: 200, height: 300 });
  });

  it("over 256 KiB, four fifths again, down to 128", async () => {
    const sides: number[] = [];
    const out = await stepDownIconPhoto(384, 384, async (w) => { sides.push(w); return { size: w > 200 ? ICON_PHOTO_MAX_BYTES + 1 : ICON_PHOTO_MAX_BYTES }; });
    expect(sides).toEqual([384, 307, 245, 196]);
    expect(out).toMatchObject({ width: 196, height: 196 });
    const all: number[] = [];
    expect(await stepDownIconPhoto(384, 384, async (w) => { all.push(w); return { size: 10 ** 9 }; })).toBeUndefined();
    expect(all[all.length - 1]).toBe(128);
    expect(await stepDownIconPhoto(384, 384, async () => undefined)).toBeUndefined();
  });
});
