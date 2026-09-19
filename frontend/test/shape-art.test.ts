// The shape buttons' drawings: a device outline with the shape lit where it
// lands, so "Corner" and "Inline" mean something before they are learned.
//
// There is no DOM under vitest here, so the templates are flattened to their
// text the way the other template tests in this suite do it, and the
// assertions are about what the SVG says rather than about a rendered box.

import { describe, expect, it } from "vitest";
import { nothing, svg } from "lit";

import { ALL_FAMILIES } from "../src/layouts.js";
import type { FamilyKind } from "../src/model.js";
import { controlDeviceArt, designDeviceArt, deviceShapeArt, shapeArtKinds } from "../src/shapeArt.js";
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

/** What the furniture is painted with: a variable the card sets, so lighting a
 * shape with the accent leaves the device around it alone. */
const OUTLINE = "var(--wa-shape-outline, currentColor)";

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

  // Two colours in one drawing: the shape follows the button (accent on a card
  // that is ticked, or still addable), the device around it does not.
  it("paints the device in the furniture colour, not the button's own", () => {
    for (const device of DEVICES) {
      const art = draw("rectangular", device);
      expect(art).toContain(`stroke=${OUTLINE} stroke-opacity="0.45"`);
      // The shape itself is untouched: it is what the button lights.
      expect(art).toContain(`fill="currentColor" opacity=1`);
    }
    // The Lock Screen clock and the Home Screen's neighbouring icons are
    // furniture too.
    expect(draw("rectangular", "iphone")).toContain(`fill=${OUTLINE} opacity=0.25`);
    expect(draw("large", "iphone")).toContain(`fill=${OUTLINE} opacity=0.2`);
  });

  // The cards give the art 48 px of height and less than 36 px of width, which
  // the whole 32 by 28 box does not fit into. Slicing scales to the height and
  // trims the empty margins instead, so two devices fit beside each other on a
  // 96 px card; fitting would shrink the drawing back to a third of the space.
  it("fills its box and crops the margins rather than shrinking to fit", () => {
    for (const device of DEVICES) {
      expect(draw("rectangular", device)).toContain(`preserveAspectRatio="xMidYMid slice"`);
    }
    expect(flatten(controlDeviceArt("watch", true))).toContain(`preserveAspectRatio="xMidYMid slice"`);
  });

  // What the crop is allowed to take: at 36 by 48 the box shows 21 of the
  // viewBox's 32 units, centred, so nothing may sit outside 5.5 to 26.5. The
  // watch case is the widest thing drawn, at 8 to 24.
  it("keeps every drawing inside the 21 units a sliced box shows", () => {
    let checked = 0;
    for (const family of ALL_FAMILIES) {
      for (const device of DEVICES) {
        // Both spellings: an attribute written into the template is quoted, one
        // interpolated into it is not.
        for (const [, x, width] of draw(family, device).matchAll(/\bx="?([\d.]+)"?[^>]*?\bwidth="?([\d.]+)"?/g)) {
          expect(Number(x)).toBeGreaterThanOrEqual(5.5);
          expect(Number(x) + Number(width)).toBeLessThanOrEqual(26.5);
          checked += 1;
        }
      }
    }
    expect(checked).toBeGreaterThan(20);
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
  // The tile that is yours is drawn in the button's own colour; its three
  // neighbours are furniture, so they take the outline's colour instead and a
  // lit card turns one square accent rather than all four.
  it("draws four tiles with the top left one yours", () => {
    const phone = flatten(controlDeviceArt("iphone", true));
    expect(rects(phone)).toBe(5);
    expect(phone).toContain("x=12 y=4 width=3.5 height=3.5 rx=1 fill=currentColor opacity=1");
    expect(phone).toContain(`x=16.5 y=4 width=3.5 height=3.5 rx=1 fill=${OUTLINE} opacity=0.2`);
  });

  it("draws the watch's own bigger grid", () => {
    const watch = flatten(controlDeviceArt("watch", true));
    expect(rects(watch)).toBe(7);
    expect(watch).toContain("x=10 y=8 width=5 height=5 rx=1.5 fill=currentColor opacity=1");
    expect(watch).toContain(`x=17 y=15 width=5 height=5 rx=1.5 fill=${OUTLINE} opacity=0.2`);
  });

  it("dims the tile that is yours when it is not picked", () => {
    expect(flatten(controlDeviceArt("iphone", false))).toContain("x=12 y=4 width=3.5 height=3.5 rx=1 fill=currentColor opacity=0.45");
  });
});

describe("designDeviceArt", () => {
  const card = (families: FamilyKind[], control = false) => flatten(designDeviceArt(families, control));
  /** Whether a slot is lit: the accent, rather than the unlit token. */
  const litCount = (art: string) => art.split("var(--wa-accent)").length - 1;

  it("draws both devices whatever the design has, at the card's own size", () => {
    const art = card(["corner"]);
    expect(art).toContain("0 0 86 96");
    expect(art).toContain("0 0 50 96");
    // Both screens, so a phone with nothing on it says "not on your phone".
    expect(art.split("var(--wa-art-screen)").length - 1).toBe(2);
  });

  it("lights only the slots the design fills", () => {
    const art = card(["rectangular", "circular"]);
    // The two watch slots, and the phone's one Lock Screen slot.
    expect(litCount(art)).toBe(3);
    expect(card([])).not.toContain("var(--wa-accent)");
  });

  it("lights the phone's Lock Screen slot for any shape a Lock Screen draws", () => {
    for (const family of ["rectangular", "circular", "inline"] as FamilyKind[]) {
      expect(card([family])).toContain(`x="9" y="24" width="32" height="8" rx="2" fill=var(--wa-accent)`);
    }
    // Corner is a watch face slot and reaches no Lock Screen.
    expect(card(["corner"])).toContain(`x="9" y="24" width="32" height="8" rx="2" fill=var(--wa-art-off)`);
  });

  it("lights the Home Screen tile each size lands on", () => {
    expect(card(["small"])).toContain(`x="7" y="42" width="16" height="16" rx="3" fill=var(--wa-accent)`);
    expect(card(["medium"])).toContain(`x="7" y="62" width="36" height="14" rx="3" fill=var(--wa-accent)`);
    expect(card(["large"])).toContain(`x="7" y="80" width="36" height="9" rx="3" fill=var(--wa-accent)`);
  });

  // The drawing has three tiles and the Home Screen has four sizes, so the
  // tallest one answers for both. What a card is asked is whether the design
  // reaches the Home Screen at all.
  it("lets Extra Large light the tallest tile with Large", () => {
    expect(card(["xlarge"])).toContain(`x="7" y="80" width="36" height="9" rx="3" fill=var(--wa-accent)`);
  });

  it("draws the control beside the devices, not on one, and only when there is a control", () => {
    const art = card(["circular"], true);
    expect(art).toContain(`class="pk-card-ctl"`);
    // The stand-in pill sits after both device drawings.
    expect(art.indexOf("pk-card-ctl")).toBeGreaterThan(art.indexOf("0 0 50 96"));
    expect(card(["circular"], false)).not.toContain("pk-card-ctl");
  });

  it("draws only the devices the design is on, and both when it is on neither", () => {
    const watchOnly = flatten(designDeviceArt(["rectangular"], false, undefined, { watch: true, phone: false }));
    expect(watchOnly).toContain("0 0 86 96");
    expect(watchOnly).not.toContain("0 0 50 96");
    const phoneOnly = flatten(designDeviceArt(["rectangular"], false, undefined, { watch: false, phone: true }));
    expect(phoneOnly).not.toContain("0 0 86 96");
    expect(phoneOnly).toContain("0 0 50 96");
    const nowhere = flatten(designDeviceArt(["rectangular"], false, undefined, { watch: false, phone: false }));
    expect(nowhere).toContain("0 0 86 96");
    expect(nowhere).toContain("0 0 50 96");
  });

  it("puts the real control tile beside the devices in place of the stand-in", () => {
    const tile = { art: svg`<div data-tag="tile"></div>`, width: 48, height: 30 };
    const art = flatten(designDeviceArt([], true, { watch: { control: tile }, phone: {} }));
    expect(art).toContain(`data-tag="tile"`);
    expect(art).not.toContain(`width="40" height="24" rx="12"`);
  });

  it("shows the corner's content disc alone, centred in the slot and masked round", () => {
    // A 104 by 124 quadrant whose disc of 34 sits at (70, 29.5): the slot is
    // 13 across at (14, 17), so the disc scales by 13/34 and its centre
    // lands on the slot's centre.
    const corner = { art: svg`<svg class="complication corner" data-tag="c"></svg>`, width: 104, height: 124, focus: { cx: 70, cy: 29.5, diameter: 34 } };
    const art = flatten(designDeviceArt(["corner"], false, { watch: { corner }, phone: {} }));
    const scale = 13 / 34;
    expect(art).toContain(`translate(${20.5 - 70 * scale} ${23.5 - 29.5 * scale}) scale(${scale})`);
    expect(art).toContain(`<circle cx=20.5 cy=23.5 r=6.5 />`);
    expect(art).not.toContain("M16 30 A 26 26 0 0 1 28 19");
  });

  it("hides both drawings from a screen reader, the card's text saying it instead", () => {
    expect(card(["rectangular"]).split(`aria-hidden="true"`).length - 1).toBe(2);
  });

  it("never throws, whatever the design holds", () => {
    for (const family of ALL_FAMILIES) {
      for (const control of [true, false]) {
        expect(() => designDeviceArt([family], control)).not.toThrow();
      }
    }
    expect(() => designDeviceArt(ALL_FAMILIES, true)).not.toThrow();
  });

  // The real complication in its slot. The renderer's own svg stands in for
  // itself here: what matters is where it lands and how big it is drawn.
  describe("with the complication drawn in", () => {
    const picture = (tag: string) => ({ art: svg`<svg class="complication" data-tag=${tag}></svg>`, width: 181, height: 65.5 });

    it("sets the picture into the slot in place of the lit fill", () => {
      const art = flatten(designDeviceArt(["rectangular"], false, { watch: { rectangular: picture("w") }, phone: {} }));
      expect(art).toContain("data-tag=w");
      // The watch's rectangular fill is gone; the phone's Lock Screen slot is
      // still the lit fill, since no phone picture was given.
      expect(art).not.toContain(`x="14" y="38" width="58" height="21"`);
      expect(art).toContain(`x="9" y="24" width="32" height="8" rx="2" fill=var(--wa-accent)`);
    });

    it("scales the picture to fit the slot and centres it", () => {
      const art = flatten(designDeviceArt(["rectangular"], false, { watch: { rectangular: picture("w") }, phone: {} }));
      // The full 58 wide slot for a 181 wide picture, so 58/181; 65.5 tall
      // becomes 20.99, sat in the middle of the 21 tall slot.
      const scale = 58 / 181;
      const y = 38 + (21 - 65.5 * scale) / 2;
      expect(art).toContain(`translate(14 ${y}) scale(${scale})`);
    });

    it("draws the Large tile from the top and clips it, rather than squeezing it flat", () => {
      const tall = { art: svg`<svg class="complication" data-tag=L></svg>`, width: 344.67, height: 360 };
      const art = flatten(designDeviceArt(["large"], false, { watch: {}, phone: { large: tall } }));
      expect(art).toContain("data-tag=L");
      expect(art).toContain(`scale(${36 / 344.67})`);
      expect(art).toContain("clip-path=url(#pk-clip-");
    });

    it("quiets the second Small tile once the first holds the picture", () => {
      const small = { art: svg`<svg class="complication"></svg>`, width: 162.67, height: 162.67 };
      const art = flatten(designDeviceArt(["small"], false, { watch: {}, phone: { small } }));
      expect(art).toContain(`x="27" y="42" width="16" height="16" rx="3" fill=var(--wa-art-off)`);
    });

    it("keeps the lit fill for a slot with no picture", () => {
      const art = flatten(designDeviceArt(["rectangular", "circular"], false, { watch: { rectangular: picture("w") }, phone: {} }));
      expect(art).toContain(`cx="21" cy="71" r="8" fill=var(--wa-accent)`);
    });
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
