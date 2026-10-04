// The bundled SF Symbols' half circles, drawn where the symbol has them.
//
// The symbol file was squeezed at two decimals, which leaves a circle's two
// arcs a hair short of its diameter, and SVG then puts each arc's centre well
// off the chord's middle: `button.programmable` drew its ring thick on one
// side and its gap closed there. `snapHalfCircleArcs` puts the centre back.

import { describe, expect, it } from "vitest";
import { snapHalfCircleArcs } from "../src/icons.js";

/** `button.programmable` as the bundled file has it: a ring (outer edge, then
 * the hole) and a disc, all three circles of two arcs each. */
const BUTTON_PROGRAMMABLE =
  "M10.09 20.18a10.1 10.1 0 1 0 0-20.19 10.1 10.1 0 0 0 0 20.19m0-2A8.1 8.1 0 1 1 10.07 2a8.1 8.1 0 0 1 .02 16.19 M10.08 16.63a6.54 6.54 0 1 0 .01-13.07 6.54 6.54 0 0 0-.01 13.07";

/** Each arc's centre as SVG draws it (F.6.5 and F.6.6), for a path of `M`,
 * `m` and circular `A`/`a` commands with separated flags, which is all these
 * tests write. */
function arcCentres(d: string): { x: number; y: number }[] {
  const tokens = d.match(/[MmAa]|[+-]?(?:\d+\.?\d*|\.\d+)/g)!;
  const out: { x: number; y: number }[] = [];
  let x = 0;
  let y = 0;
  let cmd = "";
  for (let i = 0; i < tokens.length; ) {
    if (/[MmAa]/.test(tokens[i]!)) cmd = tokens[i++]!;
    const n = () => Number(tokens[i++]);
    if (cmd === "M" || cmd === "m") {
      const [a, b] = [n(), n()];
      [x, y] = cmd === "M" ? [a, b] : [x + a, y + b];
      continue;
    }
    let r = n();
    n();
    n();
    const large = n();
    const sweep = n();
    const [ex, ey] = [n(), n()];
    const [x2, y2] = cmd === "A" ? [ex, ey] : [x + ex, y + ey];
    const hx = (x - x2) / 2;
    const hy = (y - y2) / 2;
    const half = Math.hypot(hx, hy);
    if (half > r) r = half;
    const k = Math.sqrt(Math.max(0, r * r - half * half)) / half * (large === sweep ? -1 : 1);
    out.push({ x: (x + x2) / 2 + k * hy, y: (y + y2) / 2 - k * hx });
    [x, y] = [x2, y2];
  }
  return out;
}

const spread = (centres: { x: number; y: number }[]) =>
  Math.max(...centres.map((a) => Math.max(...centres.map((b) => Math.hypot(a.x - b.x, a.y - b.y)))));

describe("half circle arcs in the symbol file", () => {
  it("draws the ring and the disc of button.programmable round one centre", () => {
    // As shipped, the hole sits about 0.7 units off the outer edge's centre.
    expect(spread(arcCentres(BUTTON_PROGRAMMABLE))).toBeGreaterThan(0.5);
    const fixed = snapHalfCircleArcs(BUTTON_PROGRAMMABLE);
    expect(spread(arcCentres(fixed))).toBeLessThan(0.02);
  });

  it("keeps the radii within a rounding of the shipped ones", () => {
    const radii = (d: string) => [...d.matchAll(/[Aa]\s*([\d.]+)/g)].map((m) => Number(m[1]));
    const before = radii(BUTTON_PROGRAMMABLE);
    const after = radii(snapHalfCircleArcs(BUTTON_PROGRAMMABLE));
    expect(after).toHaveLength(before.length);
    after.forEach((r, i) => expect(Math.abs(r - before[i]!)).toBeLessThan(0.015));
  });

  it("puts every circle of a dot in a ring on one centre (record.circle)", () => {
    const record = "M10.09 20.18a10.1 10.1 0 1 0 0-20.19 10.1 10.1 0 0 0 0 20.19m0-2A8.1 8.1 0 1 1 10.07 2a8.1 8.1 0 0 1 .02 16.19 M10.08 13.9a3.84 3.84 0 0 0 0-7.66 3.83 3.83 0 0 0 0 7.66";
    expect(spread(arcCentres(record))).toBeGreaterThan(0.3);
    // What is left is the two decimals' own rounding of the ends.
    expect(spread(arcCentres(snapHalfCircleArcs(record)))).toBeLessThan(0.03);
  });

  it("leaves a quarter circle and a true off-centre arc alone", () => {
    const quarter = "M0 10A10 10 0 0 1 10 0";
    expect(snapHalfCircleArcs(quarter)).toBe(quarter);
    // 150 degrees between the ends: a chord well short of the diameter.
    const wide = "M0 0a10 10 0 0 1 19.32 0";
    expect(snapHalfCircleArcs(wide)).toBe(wide);
  });

  it("reads svgo's packed flags and implicit repeats", () => {
    // `01` is two flags, and the second arc repeats the command.
    const packed = "M0 0a1 1 0 01 1.99 0 1 1 0 01-1.99 0z";
    const fixed = snapHalfCircleArcs(packed);
    expect(fixed).not.toBe(packed);
    const centres = arcCentres(fixed.replace(/0 01/g, "0 0 1").replace(/z$/, ""));
    expect(spread(centres)).toBeLessThan(0.01);
  });

  it("keeps the position after other commands, so an arc after them is read where it is", () => {
    // A line, a curve and a close before the half circle.
    const d = "M2 2h4v4c1 1 2 2 3 3zM5 5a3 3 0 0 0 5.99 0";
    const fixed = snapHalfCircleArcs(d);
    expect(fixed.startsWith("M2 2h4v4c1 1 2 2 3 3zM5 5a")).toBe(true);
    expect(fixed).not.toBe(d);
  });

  it("returns a path it cannot read unchanged", () => {
    expect(snapHalfCircleArcs("M0 0 Q")).toBe("M0 0 Q");
    expect(snapHalfCircleArcs("")).toBe("");
  });
});
