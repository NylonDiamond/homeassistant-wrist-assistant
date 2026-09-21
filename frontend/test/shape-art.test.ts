// The shape buttons' drawings: a device outline with the shape lit where it
// lands, so "Corner" and "Inline" mean something before they are learned.
//
// There is no DOM under vitest here, so the templates are flattened to their
// text the way the other template tests in this suite do it, and the
// assertions are about what the SVG says rather than about a rendered box.

import { describe, expect, it } from "vitest";
import { nothing, svg } from "lit";

import { ALL_FAMILIES, isHomeFamily } from "../src/layouts.js";
import type { FamilyKind } from "../src/model.js";
import { PHONE_FRAME, PHONE_LOCK_WINDOW, PHONE_WINDOW, controlDeviceArt, deviceCropArt, deviceShapeArt, inlineShown, phoneSlot, shapeArtKinds } from "../src/shapeArt.js";
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

  // Two colors in one drawing: the shape follows the button (accent on a card
  // that is ticked, or still addable), the device around it does not.
  it("paints the device in the furniture color, not the button's own", () => {
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
  // The tile that is yours is drawn in the button's own color; its three
  // neighbours are furniture, so they take the outline's color instead and a
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

describe("deviceCropArt", () => {
  const crop = (family: FamilyKind | undefined, device: "watch" | "iphone", live = {}, opts = {}) =>
    flatten(deviceCropArt(family, device, live, opts));
  /** The four numbers of the drawing's window, in the device's own units. */
  const viewBox = (art: string) => {
    const found = /viewBox=([\d.]+ [\d.]+ [\d.]+ [\d.]+)/.exec(art);
    expect(found, art.slice(0, 120)).not.toBeNull();
    const [x, y, width, height] = found![1]!.split(" ").map(Number) as [number, number, number, number];
    return { x, y, width, height };
  };
  /** The devices at the size they are laid out in. */
  const FRAME = { watch: { width: 86, height: 96 }, iphone: PHONE_FRAME };
  const phone = (family: FamilyKind) => phoneSlot(family)!;
  /** Where each shape's slot sits on its device, so a window can be asked
   * whether the thing it is a window onto is in it. */
  const SLOTS: [FamilyKind, "watch" | "iphone", { x: number; y: number; width: number; height: number }][] = [
    ["rectangular", "watch", { x: 14, y: 56, width: 58, height: 21 }],
    ["circular", "watch", { x: 14, y: 65, width: 14, height: 14 }],
    ["corner", "watch", { x: 14, y: 17, width: 13, height: 13 }],
    ["inline", "watch", { x: 28, y: 15, width: 30, height: 3 }],
    ["rectangular", "iphone", phone("rectangular")],
    ["circular", "iphone", phone("circular")],
    ["inline", "iphone", phone("inline")],
    ["small", "iphone", phone("small")],
    ["medium", "iphone", phone("medium")],
    ["large", "iphone", phone("large")],
  ];

  // The window is a window: a crop that reached outside the drawing would
  // show empty space where the card expects a device.
  it("keeps every shape's window inside its device's frame", () => {
    for (const [family, device] of [...SLOTS, ["xlarge", "iphone"] as const]) {
      const box = viewBox(crop(family, device));
      const frame = FRAME[device];
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(frame.width);
      expect(box.y + box.height).toBeLessThanOrEqual(frame.height);
    }
  });

  it("puts each shape's own slot inside its window", () => {
    for (const [family, device, slot] of SLOTS) {
      const box = viewBox(crop(family, device));
      expect(box.x, `${family} on ${device}`).toBeLessThanOrEqual(slot.x);
      expect(box.y, `${family} on ${device}`).toBeLessThanOrEqual(slot.y);
      expect(box.x + box.width).toBeGreaterThanOrEqual(slot.x + slot.width);
      expect(box.y + box.height).toBeGreaterThanOrEqual(slot.y + slot.height);
    }
  });

  // Extra Large is taller than the window on purpose: its bottom sits on the
  // page like the other tiles and its top runs off the window's top edge,
  // which is what says it is bigger than Large.
  it("lets the Extra Large tile run off the top of the window", () => {
    const box = viewBox(crop("xlarge", "iphone"));
    const slot = phone("xlarge");
    expect(slot.y).toBeLessThan(box.y);
    expect(slot.y + slot.height).toBeLessThan(box.y + box.height);
    expect(slot.y + slot.height).toBe(phone("large").y + phone("large").height);
  });

  // The watch's window is the well's own proportions (86 by 48, the half of
  // a watch) and fills it: a window of another shape would have its edges
  // trimmed to fit, and what was trimmed is the part that matters.
  it("cuts every watch window to the card's own proportions", () => {
    for (const [family, device] of SLOTS) {
      if (device !== "watch") continue;
      const box = viewBox(crop(family, device));
      expect(box.width / box.height, `${family} on ${device}`).toBeGreaterThan(1.7);
      expect(box.width / box.height, `${family} on ${device}`).toBeLessThan(2.1);
    }
    expect(crop("rectangular", "watch")).toMatch(/preserveAspectRatio="?xMidYMid slice"?/);
  });

  // The phone's window is taller than the well, so a Large tile can be shown
  // whole at its real proportions; it is fitted in rather than trimmed.
  it("fits the phone's taller window into the well whole", () => {
    for (const [family, device] of SLOTS) {
      if (device !== "iphone") continue;
      const box = viewBox(crop(family, device));
      expect(box.width, family).toBe(PHONE_FRAME.width);
      expect(box.height, family).toBe(isHomeFamily(family) ? PHONE_WINDOW : PHONE_LOCK_WINDOW);
      expect(crop(family, device)).toMatch(/preserveAspectRatio="?xMidYMid meet"?/);
    }
  });

  // The tiles are the phone's real sizes at the drawing's scale: Medium is
  // twice Small across, Large is twice Medium down, and all of them sit on
  // the same bottom line over the dock.
  it("draws the Home Screen tiles at the phone's real proportions", () => {
    const small = phone("small");
    const medium = phone("medium");
    const large = phone("large");
    expect(small.width).toBeCloseTo(small.height, 6);
    expect(medium.width / small.width).toBeGreaterThan(2);
    expect(medium.height).toBe(small.height);
    expect(large.width).toBe(medium.width);
    expect(large.height / medium.height).toBeGreaterThan(2);
    expect(large.height / large.width).toBeCloseTo(360 / 344.67, 3);
    expect(small.y + small.height).toBe(large.y + large.height);
    expect(medium.y + medium.height).toBe(large.y + large.height);
  });

  // The watch has two windows, its two halves: the lower one for rectangular
  // and circular, the upper one for corner and inline, each reaching past the
  // case to a slice of the band so the piece of watch reads as a watch.
  it("shows the lower half of the watch for rectangular and circular and the upper half for corner and inline", () => {
    const lower = { x: 0, y: 48, width: 86, height: 48 };
    const upper = { x: 0, y: 0, width: 86, height: 48 };
    expect(viewBox(crop("rectangular", "watch"))).toEqual(lower);
    expect(viewBox(crop("circular", "watch"))).toEqual(lower);
    expect(viewBox(crop("corner", "watch"))).toEqual(upper);
    expect(viewBox(crop("inline", "watch"))).toEqual(upper);
    // The band stubs sit at the top and bottom edges of the drawing.
    expect(crop("rectangular", "watch")).toContain(`x="27" y="86" width="32" height="10"`);
    expect(crop("corner", "watch")).toContain(`x="27" y="0" width="32" height="10"`);
  });

  // The phone has two windows too: the bottom of the page for every Home
  // Screen size, so the tiles can be compared card to card, and the top of
  // the Lock Screen for the three shapes that sit under its clock.
  it("shows the bottom of the phone for the Home Screen sizes and the top for the Lock Screen shapes", () => {
    const bottom = { x: 0, y: PHONE_FRAME.height - PHONE_WINDOW, width: PHONE_FRAME.width, height: PHONE_WINDOW };
    const top = { x: 0, y: 0, width: PHONE_FRAME.width, height: PHONE_LOCK_WINDOW };
    for (const family of ["small", "medium", "large", "xlarge"] as FamilyKind[]) {
      expect(viewBox(crop(family, "iphone")), family).toEqual(bottom);
    }
    for (const family of ["rectangular", "circular", "inline"] as FamilyKind[]) {
      expect(viewBox(crop(family, "iphone")), family).toEqual(top);
    }
    // The case's bottom edge is in the Home Screen window, the island in the
    // Lock Screen one, and the clock only on the Lock Screen.
    expect(crop("large", "iphone")).toContain(`height=${PHONE_FRAME.height} rx="9"`);
    expect(crop("rectangular", "iphone")).toContain(`x="17" y="6" width="16" height="3"`);
    expect(crop("rectangular", "iphone")).toContain(">9:41</text>");
    expect(crop("large", "iphone")).not.toContain(">9:41</text>");
    // The Lock Screen window ends a little under the slot row rather than at
    // the bottom of the screen, so the card is not a third empty black.
    const slot = phoneSlot("rectangular");
    if (slot === undefined) throw new Error("rectangular has no phone slot");
    const below = PHONE_LOCK_WINDOW - (slot.y + slot.height);
    expect(below).toBeGreaterThan(0);
    expect(below).toBeLessThan(slot.height / 2);
  });

  // The editor's stage draws the rectangle with a 3 pt corner, and the card
  // has to agree with it: a flat 2 units was a quarter of the drawn height,
  // which read as a pill rather than a Lock Screen widget.
  it("draws the Lock Screen rectangle with the editor's corner", () => {
    const slot = phoneSlot("rectangular");
    if (slot === undefined) throw new Error("rectangular has no phone slot");
    const rx = Number(/rx=([\d.]+) fill=var\(--wa-accent\)/.exec(crop("rectangular", "iphone"))?.[1]);
    expect(rx).toBeGreaterThan(0);
    expect(rx / slot.height).toBeLessThan(0.08);
  });

  // A shape the device has no slot for has no window worth inventing, so the
  // whole device is drawn rather than a piece of it chosen at random.
  it("falls back to the whole device for a shape it does not draw", () => {
    expect(viewBox(crop("corner", "iphone"))).toEqual({ x: 0, y: 0, width: 50, height: 102 });
    expect(viewBox(crop("small", "watch"))).toEqual({ x: 0, y: 0, width: 86, height: 96 });
  });

  // The bottom of the face holds one thing: a rectangular card's rectangle
  // sits where a circular card's row of circles would, so neither draws the
  // other's slot under or over its own.
  it("lights the shape's own slot and leaves its neighbours off", () => {
    const art = crop("rectangular", "watch");
    expect(art).toContain(`x="14" y="56" width="58" height="21" rx="5" fill=var(--wa-accent)`);
    expect(art).not.toContain(`cy="72"`);
    const circ = crop("circular", "watch");
    expect(circ).toContain(`cx="21" cy="72" r="7" fill=var(--wa-accent)`);
    expect(circ).toContain(`cx="43" cy="72" r="7" fill=var(--wa-art-off)`);
    expect(circ).toContain(`cx="65" cy="72" r="7" fill=var(--wa-art-off)`);
    expect(circ).not.toContain(`y="56" width="58"`);
  });

  it("hides the drawing from a screen reader, the card's text saying it instead", () => {
    expect(crop("circular", "watch")).toContain(`aria-hidden="true"`);
  });

  // A design in the library is on no device, so the case under it is an
  // outline of one: dashed, and without the bands and the crown that make a
  // watch an object.
  it("draws a shelved design's case with dashes", () => {
    const shelved = crop("rectangular", "watch", {}, { shelved: true });
    expect(shelved).toContain(`stroke-dasharray=4 3`);
    expect(shelved).not.toContain(`x="27" y="0" width="32" height="10"`);
    expect(crop("rectangular", "watch")).not.toContain(`stroke-dasharray=4 3`);
    const phone = crop("small", "iphone", {}, { shelved: true });
    expect(phone).toContain(`stroke-dasharray=4 3`);
    expect(crop("small", "iphone")).not.toContain(`stroke-dasharray=4 3`);
  });

  // The real complication in its slot. The renderer's own svg stands in for
  // itself here: what matters is that it lands in the slot the window is on.
  describe("with the complication drawn in", () => {
    const picture = (tag: string) => ({ art: svg`<svg class="complication" data-tag=${tag}></svg>`, width: 181, height: 65.5 });

    it("sets the picture into the slot in place of the lit fill", () => {
      const art = crop("rectangular", "watch", { rectangular: picture("w") });
      expect(art).toContain("data-tag=w");
      expect(art).not.toContain(`x="14" y="56" width="58" height="21"`);
    });

    it("scales the picture to fit the slot and centres it", () => {
      const art = crop("rectangular", "watch", { rectangular: picture("w") });
      // The full 58 wide slot for a 181 wide picture, so 58/181; 65.5 tall
      // becomes 20.99, sat in the middle of the 21 tall slot at the bottom.
      const scale = 58 / 181;
      const y = 56 + (21 - 65.5 * scale) / 2;
      expect(art).toContain(`translate(14 ${y}) scale(${scale})`);
    });

    // A rectangular picture is masked to a rounded rectangle, so the square
    // corners of the renderer's box never show past the slot's own.
    it("masks a rectangular picture to rounded corners", () => {
      const art = crop("rectangular", "watch", { rectangular: picture("r") });
      expect(art).toMatch(/<clipPath id=pk-clip-\w+><rect x=14 y=[\d.]+ width=58 height=[\d.]+ rx=3 \/><\/clipPath>/);
      expect(art).toContain("clip-path=url(#pk-clip-");
    });

    // The renderer's circular picture is a square with the circle painted in
    // it; the slot masks it round so the square's corners never show.
    it("masks a circular picture round", () => {
      const round = { art: svg`<svg class="complication" data-tag=c></svg>`, width: 100, height: 100 };
      const art = crop("circular", "watch", { circular: round });
      expect(art).toContain("data-tag=c");
      expect(art).toContain("clip-path=url(#pk-clip-");
      expect(art).toMatch(/<clipPath id=pk-clip-\w+><circle cx=21 cy=72 r=7(\.0+\d)? \/><\/clipPath>/);
    });

    it("writes the inline line into the band over the clock, symbol first", () => {
      const line = { art: svg`<svg data-tag=sym></svg>`, width: 11, height: 11, text: "Kitchen: 21" };
      const art = crop("inline", "watch", { inline: line });
      expect(art).toContain("<text");
      expect(art).toContain(">Kitchen: 21</text>");
      expect(art).toContain("data-tag=sym");
      // The symbol is scaled to the text's height, 4.2 of its 11.
      expect(art).toContain(`scale(${4.2 / 11})`);
      expect(art).toContain(`text-anchor="middle"`);
      // The corner's arc is not drawn on an inline card: the top of the face
      // shows the card's own shape and the clock, nothing else.
      expect(art).not.toContain("M16 30 A 26 26");
      expect(art).not.toContain("<foreignObject");
      expect(art).not.toContain(`x="28" y="15" width="30" height="3"`);
    });

    it("writes the inline line with no symbol when it has none", () => {
      const art = crop("inline", "watch", { inline: { art: nothing, width: 0, height: 0, text: "Kitchen: 21" } });
      expect(art).toContain(">Kitchen: 21</text>");
      expect(art).not.toContain("scale(");
    });

    // The watch cuts a long inline line and draws an ellipsis; the card does
    // the same rather than letting the words run past the band.
    it("cuts a long inline line where the watch cuts it", () => {
      expect(inlineShown("Front Yard test test")).toBe("Front Yard test…");
      expect(inlineShown("Kitchen: 21")).toBe("Kitchen: 21");
      expect(inlineShown("Sixteen chars!!!")).toBe("Sixteen chars!!!");
      const art = crop("inline", "watch", { inline: { art: nothing, width: 0, height: 0, text: "Front Yard test test" } });
      expect(art).toContain(">Front Yard test…</text>");
    });

    // A Large picture is the slot's own proportions, so it fills the slot
    // whole at the slot's width: nothing is squeezed or cut.
    it("draws the Large tile whole in its slot", () => {
      const tall = { art: svg`<svg class="complication" data-tag=L></svg>`, width: 344.67, height: 360 };
      const art = crop("large", "iphone", { large: tall });
      const slot = phone("large");
      expect(art).toContain("data-tag=L");
      expect(art).toContain(`translate(${slot.x} ${slot.y}) scale(${slot.width / 344.67})`);
      expect(art).toContain("clip-path=url(#pk-clip-");
      expect(art).not.toContain(`x=${slot.x} y=${slot.y} width=${slot.width} height=${slot.height} rx="3" fill=var(--wa-accent)`);
    });

    // The page's icons are what say how big a tile is, so they fill every
    // cell the tile leaves free and none the tile covers: a two by two block
    // beside Small, two rows over Medium, none over Large.
    it("keeps the page's icons beside a tile and never under it", () => {
      const icons = (art: string) => (art.match(/rx="1\.6" fill=var\(--wa-art-off\)/g) ?? []).length;
      expect(icons(crop("small", "iphone"))).toBe(12);
      expect(icons(crop("medium", "iphone"))).toBe(8);
      expect(icons(crop("large", "iphone"))).toBe(0);
      expect(icons(crop("xlarge", "iphone"))).toBe(0);
      const small = { art: svg`<svg class="complication"></svg>`, width: 162.67, height: 162.67 };
      expect(icons(crop("small", "iphone", { small }))).toBe(12);
    });

    it("shows the corner's content disc alone, centred in the slot and masked round", () => {
      // A 104 by 124 quadrant whose disc of 34 sits at (70, 29.5): the slot is
      // 13 across at (14, 17), so the disc scales by 13/34 and its centre
      // lands on the slot's centre.
      const corner = { art: svg`<svg class="complication corner" data-tag="c"></svg>`, width: 104, height: 124, focus: { cx: 70, cy: 29.5, diameter: 34 } };
      const art = crop("corner", "watch", { corner });
      const scale = 13 / 34;
      expect(art).toContain(`translate(${20.5 - 70 * scale} ${23.5 - 29.5 * scale}) scale(${scale})`);
      expect(art).toContain(`<circle cx=20.5 cy=23.5 r=6.5 />`);
      expect(art).not.toContain("M16 30 A 26 26 0 0 1 28 19");
    });
  });

  // A control sits on neither screen, so there is no device to crop: the tile
  // is the whole picture.
  describe("a design that is only a control", () => {
    /** Where the tile itself is in the drawing, which is the standin's own
     * size at the corner the padding puts it on. */
    const standin = (art: string) => {
      const found = /<rect\s+x=([\d.]+)\s+y=([\d.]+)\s+width=([\d.]+)\s+height=([\d.]+)/.exec(art);
      expect(found, art.slice(0, 120)).not.toBeNull();
      const [x, y, width, height] = found!.slice(1).map(Number) as [number, number, number, number];
      return { x, y, width, height };
    };

    it("draws the tile alone in place of a device", () => {
      const art = crop(undefined, "watch");
      expect(art).toContain(`class="pk-crop ctl"`);
      expect(art).toContain(`fill=var(--wa-accent)`);
    });

    // The whole tile, not a window onto one. A device crop fills its well and
    // lets the edges be trimmed; a tile trimmed that way loses its rounded
    // ends against the sides of the card, so this one is fitted instead.
    it("fits the whole tile in the well rather than trimming it", () => {
      expect(crop(undefined, "watch")).toContain(`preserveAspectRatio="xMidYMid meet"`);
      expect(crop(undefined, "watch")).not.toContain("slice");
    });

    it("keeps the whole tile inside the window, with room on every side", () => {
      const art = crop(undefined, "watch");
      const box = viewBox(art);
      const tile = standin(art);
      expect(box.x).toBe(0);
      expect(box.y).toBe(0);
      // Every edge of the tile is inside the window, with the same margin on
      // all four sides.
      expect(tile.x).toBeGreaterThan(0);
      expect(tile.y).toBeGreaterThan(0);
      expect(tile.x + tile.width).toBeLessThan(box.width);
      expect(tile.y + tile.height).toBeLessThan(box.height);
      expect(box.width - (tile.x + tile.width)).toBeCloseTo(tile.x, 6);
      expect(box.height - (tile.y + tile.height)).toBeCloseTo(tile.y, 6);
    });

    // The real tile is the editor's own laid-out box rather than a drawing,
    // so it is handed over as it is and the well centres it. Nothing wraps it
    // in a window: a box of HTML inside an svg viewBox is not a thing.
    it("draws the real tile where the card has one", () => {
      const tile = { art: svg`<div data-tag="tile"></div>`, width: 48, height: 30 };
      const art = crop(undefined, "iphone", { control: tile });
      expect(art).toContain(`data-tag="tile"`);
      expect(art).toContain(`class="pk-card-ctl"`);
      expect(art).not.toContain(`width="30" height="18" rx="9"`);
    });
  });

  it("never throws, whatever it is asked for", () => {
    for (const family of [...ALL_FAMILIES, undefined]) {
      for (const device of ["watch", "iphone"] as const) {
        for (const shelved of [true, false]) {
          expect(() => deviceCropArt(family, device, {}, { shelved })).not.toThrow();
        }
      }
    }
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
