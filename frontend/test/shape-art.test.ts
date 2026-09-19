// The shape buttons' drawings: a device outline with the shape lit where it
// lands, so "Corner" and "Inline" mean something before they are learned.
//
// There is no DOM under vitest here, so the templates are flattened to their
// text the way the other template tests in this suite do it, and the
// assertions are about what the SVG says rather than about a rendered box.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";

import { ALL_FAMILIES } from "../src/layouts.js";
import type { FamilyKind } from "../src/model.js";
import { controlDeviceArt, deviceShapeArt, shapeArtKinds } from "../src/shapeArt.js";
import type { DeviceKind } from "../src/version.js";

function flatten(node: unknown): string {
  if (node === undefined || node === null || node === nothing) return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (typeof node === "object" && "strings" in (node as Record<string, unknown>)) {
    const t = node as { strings: readonly string[]; values: unknown[] };
    return t.strings.map((s, i) => s + (i < t.values.length ? flatten(t.values[i]) : "")).join("");
  }
  return String(node);
}

const draw = (family: FamilyKind, device: DeviceKind, on = true) => flatten(deviceShapeArt(family, device, on));

/** How many shapes a drawing holds, outline included: the way to say "this one
 * is the outline and nothing else". */
const rects = (art: string) => art.split("<rect").length - 1;

const DEVICES: DeviceKind[] = ["watch", "iphone"];

describe("the device outline", () => {
  it("draws the watch case and its two band stubs around every watch shape", () => {
    for (const family of ["rectangular", "circular", "corner", "inline"] as FamilyKind[]) {
      const art = draw(family, "watch");
      expect(art).toContain(`x="8" y="4" width="16" height="20"`);
      expect(art).toContain(`stroke-opacity="0.45"`);
      expect(art).toContain(`x="12" y="1"`);
      expect(art).toContain(`x="12" y="24"`);
    }
  });

  it("draws the phone body around every phone shape", () => {
    for (const family of ["rectangular", "circular", "inline", "small", "large"] as FamilyKind[]) {
      expect(draw(family, "iphone")).toContain(`x="10" y="1" width="12" height="26"`);
    }
  });

  it("is one 32 by 28 box, hidden from a screen reader", () => {
    const art = draw("rectangular", "watch");
    expect(art).toContain("0 0 32 28");
    expect(art).toContain(`aria-hidden="true"`);
  });
});

describe("where each shape sits", () => {
  // The same design, two very different spots: low on the face, high under the
  // Lock Screen clock. Drawing it is the only way to say so.
  it("puts a shared shape where its device puts it", () => {
    expect(draw("rectangular", "watch")).toContain(`x="10" y="15"`);
    expect(draw("rectangular", "iphone")).toContain(`x="12" y="10"`);
    expect(draw("circular", "watch")).toContain(`cx="13" cy="10"`);
    expect(draw("circular", "iphone")).toContain(`cx="16" cy="12"`);
    expect(draw("inline", "watch")).toContain(`x="10" y="6"`);
    expect(draw("inline", "iphone")).toContain(`x="12" y="3"`);
  });

  it("draws corner as an arc into the face's top corner", () => {
    expect(draw("corner", "watch")).toContain(`d="M16 6.5a5.5 5.5 0 0 1 5.5 5.5"`);
    expect(draw("corner", "watch")).toContain(`stroke-width="2.4"`);
  });

  it("puts the clock under the two Lock Screen shapes and above Inline", () => {
    expect(draw("rectangular", "iphone")).toContain(`x="13" y=5`);
    expect(draw("circular", "iphone")).toContain(`x="13" y=5`);
    // Inline goes above the clock, so the clock moves down rather than the
    // shape moving off the top of the screen.
    expect(draw("inline", "iphone")).toContain(`x="13" y=6`);
    expect(draw("small", "iphone")).not.toContain(`x="13"`);
  });

  it("grows a Home Screen tile downward and keeps the icons beside it", () => {
    expect(draw("small", "iphone")).toContain("width=4 height=4");
    expect(draw("medium", "iphone")).toContain("width=8 height=4");
    expect(draw("large", "iphone")).toContain("width=8 height=8");
    expect(draw("xlarge", "iphone")).toContain("width=8 height=12");
    // One icon beside Small, a row under each of the full-width tiles.
    expect(draw("small", "iphone")).toContain("x=17 y=4 width=\"3\" height=\"3\"");
    expect(draw("medium", "iphone")).toContain("x=12 y=10 width=\"3\" height=\"3\"");
    expect(draw("large", "iphone")).toContain("x=12 y=14 width=\"3\" height=\"3\"");
    expect(draw("xlarge", "iphone")).toContain("x=12 y=18 width=\"3\" height=\"3\"");
  });
});

describe("lit and unlit", () => {
  it("dims the shape when it is not picked and leaves the outline alone", () => {
    expect(draw("rectangular", "watch", true)).toContain(`fill="currentColor" opacity=1`);
    expect(draw("rectangular", "watch", false)).toContain(`fill="currentColor" opacity=0.45`);
    expect(draw("rectangular", "watch", false)).toContain(`stroke-opacity="0.45"`);
  });

  it("dims the arc and the tile the same way", () => {
    expect(draw("corner", "watch", false)).toContain(`stroke-width="2.4" stroke-linecap="round" opacity=0.45`);
    expect(draw("large", "iphone", false)).toContain(`rx="1" fill="currentColor" opacity=0.45`);
  });
});

describe("a shape the device does not draw", () => {
  // The same button is drawn for every device in a row, so the one device that
  // cannot draw this shape has to come back blank rather than throw.
  it("gives the bare outline for corner on a phone", () => {
    const art = draw("corner", "iphone");
    expect(rects(art)).toBe(1);
    expect(art).not.toContain("<path");
    expect(art).not.toContain("<circle");
  });

  it("gives the bare outline for a Home Screen size on a watch", () => {
    for (const family of ["small", "medium", "large", "xlarge"] as FamilyKind[]) {
      // The case and the two band stubs, and nothing else.
      expect(rects(draw(family, "watch"))).toBe(3);
    }
  });

  it("never throws, whatever it is asked for", () => {
    for (const family of ALL_FAMILIES) {
      for (const device of DEVICES) {
        for (const on of [true, false]) {
          expect(() => deviceShapeArt(family, device, on)).not.toThrow();
        }
      }
    }
  });
});

describe("controlDeviceArt", () => {
  it("draws four tiles with the top left one yours", () => {
    const phone = flatten(controlDeviceArt("iphone", true));
    expect(rects(phone)).toBe(5);
    expect(phone).toContain("x=12 y=4 width=3.5 height=3.5 rx=1 fill=\"currentColor\" opacity=1");
    expect(phone).toContain("x=16.5 y=4 width=3.5 height=3.5 rx=1 fill=\"currentColor\" opacity=0.2");
  });

  it("draws the watch's own bigger grid", () => {
    const watch = flatten(controlDeviceArt("watch", true));
    expect(rects(watch)).toBe(7);
    expect(watch).toContain("x=10 y=8 width=5 height=5 rx=1.5 fill=\"currentColor\" opacity=1");
    expect(watch).toContain("x=17 y=15 width=5 height=5 rx=1.5 fill=\"currentColor\" opacity=0.2");
  });

  it("dims the tile that is yours when it is not picked", () => {
    expect(flatten(controlDeviceArt("iphone", false))).toContain("x=12 y=4 width=3.5 height=3.5 rx=1 fill=\"currentColor\" opacity=0.45");
  });
});

describe("shapeArtKinds", () => {
  it("draws both devices for a shape they both have", () => {
    expect(shapeArtKinds("rectangular")).toEqual(["watch", "iphone"]);
    expect(shapeArtKinds("circular")).toEqual(["watch", "iphone"]);
    expect(shapeArtKinds("inline")).toEqual(["watch", "iphone"]);
  });

  it("draws the one device that has the slot for everything else", () => {
    expect(shapeArtKinds("corner")).toEqual(["watch"]);
    for (const family of ["small", "medium", "large", "xlarge"] as FamilyKind[]) {
      expect(shapeArtKinds(family)).toEqual(["iphone"]);
    }
  });
});
