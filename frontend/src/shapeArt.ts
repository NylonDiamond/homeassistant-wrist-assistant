// A shape drawn where it sits on the device, for the buttons that offer it.
//
// The names alone say nothing to anyone who has not already learned them:
// "Corner" is a place rather than a shape, and Rectangular on a watch face and
// Rectangular on a Lock Screen are the same design in two very different spots.
// So every button carries a tiny outline of the device with the shape lit up
// where it lands, and a shared shape carries one outline per device, which is
// the whole of what makes one design on two screens readable at a glance.
//
// Deliberately smaller and plainer than the drawings the New dialog's place
// cards used to carry, which drew the device's furniture (a page of icons, a
// real clock, a dock) at four times the size. These sit inside a row of
// checkboxes, so everything but the outline and the shape is left out.
//
// The outline is `currentColor` at low opacity and the shape is `currentColor`
// too, so a button inherits one color and the drawing follows its state.

import { type TemplateResult, html, nothing, svg } from "lit";

import type { FamilyKind } from "./model.js";
import { isHomeFamily, isSharedFamily } from "./layouts.js";
import type { DeviceKind } from "./version.js";

/** Tall enough for a phone and wide enough for a watch's bands, with the two
 * devices drawn at the same scale so a row of them lines up. */
const VIEW_BOX = "0 0 32 28";

/** The unlit parts of a drawing: the outline, the clock, the neighbouring
 * tiles. Quiet enough to read as furniture rather than as a second shape. */
const FURNITURE = "0.25";
const GRID = "0.2";

/**
 * What color the furniture takes.
 *
 * A variable rather than `currentColor`, so a card can light its shape with
 * the accent without turning the device around it blue as well: the shape
 * stays on the button's own color and the outline follows this. Nobody has to
 * set it. Where it is unset the drawing is one color at two opacities, which
 * is what it was before the buttons grew big enough for the difference to
 * matter.
 */
const FURNITURE_COLOR = "var(--wa-shape-outline, currentColor)";

/** A watch: the case, with a stub of band above and below so it is not just a
 * rounded rectangle. */
const WATCH_OUTLINE = svg`<rect x="12" y="1" width="8" height="3" fill=${FURNITURE_COLOR} opacity=${GRID} />
  <rect x="12" y="24" width="8" height="3" fill=${FURNITURE_COLOR} opacity=${GRID} />
  <rect x="8" y="4" width="16" height="20" rx="4" fill="none" stroke=${FURNITURE_COLOR} stroke-opacity="0.45" />`;

/** A phone: one tall rounded rectangle. The clock goes on with the shape,
 * because only the Lock Screen shapes sit under one. */
const PHONE_OUTLINE = svg`<rect x="10" y="1" width="12" height="26" rx="3" fill="none" stroke=${FURNITURE_COLOR} stroke-opacity="0.45" />`;

/** The Lock Screen clock the three shared shapes sit around. Inline goes above
 * it, the other two below, so the clock moves rather than the shape: that is
 * where iOS puts them. */
const clock = (y: number) => svg`<rect x="13" y=${y} width="6" height="2" fill=${FURNITURE_COLOR} opacity=${FURNITURE} />`;

/** One app icon beside a Home Screen tile. What says the tile is a tile and
 * not a bar: Small against Large reads as how much of the page each one takes
 * only when the rest of the page is there. */
const stub = (x: number, y: number) => svg`<rect x=${x} y=${y} width="3" height="3" rx="0.6" fill=${FURNITURE_COLOR} opacity=${GRID} />`;

/** The row of icons under a full-width tile. */
const stubRow = (y: number) => svg`${stub(12, y)}${stub(17, y)}`;

function watchShape(family: FamilyKind, opacity: string): unknown {
  switch (family) {
    case "rectangular":
      return svg`<rect x="10" y="15" width="12" height="6" rx="1.5" fill="currentColor" opacity=${opacity} />`;
    // High and to one side, where a face puts it: the middle is the hands.
    case "circular":
      return svg`<circle cx="13" cy="10" r="3" fill="currentColor" opacity=${opacity} />`;
    case "inline":
      return svg`<rect x="10" y="6" width="12" height="3" rx="1.5" fill="currentColor" opacity=${opacity} />`;
    // The arc that gives the slot its name, curving into the top right corner.
    case "corner":
      return svg`<path d="M16 6.5a5.5 5.5 0 0 1 5.5 5.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" opacity=${opacity} />`;
    // The four Home Screen tiles, which no watch has.
    default:
      return nothing;
  }
}

function phoneShape(family: FamilyKind, opacity: string): unknown {
  const tile = (width: number, height: number) =>
    svg`<rect x="12" y="4" width=${width} height=${height} rx="1" fill="currentColor" opacity=${opacity} />`;
  switch (family) {
    case "rectangular":
      return svg`${clock(5)}<rect x="12" y="10" width="8" height="4" rx="1" fill="currentColor" opacity=${opacity} />`;
    case "circular":
      return svg`${clock(5)}<circle cx="16" cy="12" r="2.5" fill="currentColor" opacity=${opacity} />`;
    // Inline sits above the clock rather than below it, so the clock moves
    // down to make room instead of the shape moving off the screen.
    case "inline":
      return svg`${clock(6)}<rect x="12" y="3" width="8" height="1.6" rx="0.8" fill="currentColor" opacity=${opacity} />`;
    case "small":
      return svg`${tile(4, 4)}${stub(17, 4)}${stub(12, 10)}${stub(17, 10)}`;
    case "medium":
      return svg`${tile(8, 4)}${stubRow(10)}`;
    case "large":
      return svg`${tile(8, 8)}${stubRow(14)}`;
    case "xlarge":
      return svg`${tile(8, 12)}${stubRow(18)}`;
    // Corner, which is a watch face slot and nothing else.
    default:
      return nothing;
  }
}

/**
 * Fill the box rather than fit inside it, cropping the empty sides.
 *
 * The drawings are one 32 by 28 box so a watch and a phone line up, but every
 * one of them leaves the outer third of that box empty: the watch case spans 8
 * to 24 and the phone 10 to 22. A card that gives the art 48 px of height would
 * be 55 px wide per device fitting that whole box, and two of them do not fit
 * beside each other on a 96 px card. `slice` scales to the height and trims the
 * margins instead, which is why the box may be narrower than the viewBox. It is
 * never narrower than 21 units of it, which is what holds every drawing.
 */
function art(device: DeviceKind, inner: unknown): TemplateResult {
  return html`<svg class="shape-art" viewBox=${VIEW_BOX} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    ${device === "iphone" ? PHONE_OUTLINE : WATCH_OUTLINE}${inner}
  </svg>`;
}

/**
 * One device with one shape on it, lit or not.
 *
 * A family the device does not draw gives the bare outline rather than an
 * error: the same button is drawn for every device in a row, and a row that
 * throws on the one phone that cannot draw corner is worse than a row with a
 * blank phone in it. `shapeArtKinds` is what stops that being drawn at all.
 */
export function deviceShapeArt(family: FamilyKind, device: DeviceKind, on: boolean): TemplateResult {
  const opacity = on ? "1" : "0.45";
  return art(device, device === "iphone" ? phoneShape(family, opacity) : watchShape(family, opacity));
}

/**
 * The Control Center tile: a grid of controls with the top left one yours.
 *
 * Its neighbours are the whole drawing. One lit square on a phone says nothing
 * about Control Center; three grey ones beside it say where it is.
 */
export function controlDeviceArt(device: DeviceKind, on: boolean): TemplateResult {
  const opacity = on ? "1" : "0.45";
  const phone = device === "iphone";
  const side = phone ? 3.5 : 5;
  const radius = phone ? 1 : 1.5;
  const tile = (x: number, y: number, lit: boolean) =>
    svg`<rect x=${x} y=${y} width=${side} height=${side} rx=${radius} fill=${lit ? "currentColor" : FURNITURE_COLOR} opacity=${lit ? opacity : GRID} />`;
  const [x0, x1, y0, y1] = phone ? [12, 16.5, 4, 8.5] : [10, 17, 8, 15];
  return art(device, svg`${tile(x0, y0, true)}${tile(x1, y0, false)}${tile(x0, y1, false)}${tile(x1, y1, false)}`);
}

/**
 * Which device outlines a shape is worth drawing.
 *
 * The three shared shapes get both, because that is the point being made: one
 * design, a watch face and a Lock Screen. Corner is a watch face slot, and the
 * four tiles are a phone's Home Screen, so each of those gets the one device
 * that has it.
 */
export function shapeArtKinds(family: FamilyKind): DeviceKind[] {
  if (isHomeFamily(family)) return ["iphone"];
  return isSharedFamily(family) ? ["watch", "iphone"] : ["watch"];
}

// ── the picker card's device crop ─────────────────────────────────────────
//
// The drawings above answer "where does this one shape sit". A picker card
// asks the other question: here is one complication, show me it where it
// sits. So this is its own picture rather than a row of the buttons above,
// drawn eight times the size, with a real dark screen under it and a clock
// and an app grid for furniture. At 32x28 a watch face with a slot lit is a
// smudge.
//
// A card shows one shape on one device, so the whole device is more than it
// needs: a phone drawn to 96 units tall leaves a Home Screen tile nine units
// high. The device is laid out in full and the card is given a window onto
// the part that holds the slot, which is what `deviceCropArt` is.
//
// The colors are the panel's own tokens, so the lit shapes follow the accent
// and both skins work. The screen stays dark in either one, the way every
// other picture of a face in this panel does: a watch face is black.

/** The case, the screen and the furniture on it: the panel's own `--wa-art-*`
 * tokens, the same ones the New dialog's bigger drawings use, so a device is
 * the same object wherever this panel draws one and both skins already have
 * values for it. `--wa-art-off` is a slot the design does not fill: drawn
 * rather than left out, so the lit ones read as a choice among places rather
 * than as shapes floating on a black rectangle. */
const CASE = "var(--wa-art-case)";
const SCREEN = "var(--wa-art-screen)";
const DIM = "var(--wa-art-dim)";
const CLOCK = "var(--wa-art-clock)";
const OFF = "var(--wa-art-off)";
const ON = "var(--wa-accent)";

const lit = (on: boolean) => (on ? ON : OFF);

/**
 * One shape of the design, already drawn by the renderer at its device's real
 * slot size, to be set into the slot on the drawing in place of the lit fill.
 *
 * `width` and `height` are the size the renderer gave its `<svg>`: the slot it
 * was asked for. They are what the drawing scales by, since the picture itself
 * carries no hint of how big it was meant to be.
 */
export interface LiveShape {
  art: TemplateResult | typeof nothing;
  width: number;
  height: number;
  /** The part of the picture that is the shape, when the picture is bigger
   * than the shape: the corner's render is a whole screen quadrant with the
   * content disc somewhere in it, and this is that disc. The drawing shows
   * this part alone, masked to a circle. */
  focus?: { cx: number; cy: number; diameter: number };
  /** The inline line's words. Inline is not a picture: `art` is its symbol
   * when it has one (an svg `width` by `height` across) and this is the text
   * beside it, drawn by the watch drawing itself in the band over the clock. */
  text?: string;
}

/** The shapes drawn for one device's picture, by family, plus the Control
 * Center tile, which is drawn beside the devices rather than on one. A slot
 * that is missing keeps the plain lit fill. */
export type LiveShapes = Partial<Record<FamilyKind | "control", LiveShape>>;

/** The real complication as each kind of device draws it. One card uses one
 * half of this, since a complication is one shape on one device; both are
 * resolved together because the panel reads the document once. */
export interface LiveDesign {
  watch: LiveShapes;
  phone: LiveShapes;
}

/** The dashes a shelved design's case is drawn with: the library holds a
 * design that is on no device, so the device under it is an outline of one
 * rather than a device. */
const DASH = "4 3";

/**
 * A shape's picture set into its slot on the drawing.
 *
 * The renderer's `<svg>` is nested as it is and scaled with a group transform,
 * so the picture keeps its own clip, corner and background and nothing has to
 * be redrawn here. `fit` scales the whole picture into the slot and centres it,
 * which is right for a shape whose slot on the drawing has roughly its own
 * proportions. `cover` scales to the slot's width and clips the bottom off,
 * for the Large tile, whose slot on a 96 px phone is a sliver: the top of a
 * tall widget peeking out reads as that widget, and the whole of it squeezed
 * to nine pixels reads as nothing.
 *
 * A hairline ring goes round the picture. Its own well is black on a screen
 * that is all but black, so without the ring a design with a small layer in
 * the middle of a wide shape looked like a small shape.
 */
function placed(
  live: LiveShape | undefined,
  slot: { x: number; y: number; width: number; height: number },
  mode: "fit" | "cover",
  clipId: string,
  ring: { rx: number } | "circle" = { rx: 2 },
): unknown {
  if (live === undefined || live.art === nothing || live.width <= 0 || live.height <= 0) return undefined;
  if (live.focus) return disc(live, live.focus, slot, clipId);
  // Every picture is masked to its own outline: the renderer's picture is a
  // square with the shape painted in it, and on a face its corners showed.
  const id = clipId === "" ? clipKey() : clipId;
  const scale = mode === "fit"
    ? Math.min(slot.width / live.width, slot.height / live.height)
    : slot.width / live.width;
  const width = live.width * scale;
  const height = live.height * scale;
  const x = slot.x + (slot.width - width) / 2;
  const y = mode === "fit" ? slot.y + (slot.height - height) / 2 : slot.y;
  const inner = svg`<g class="pk-live" transform=${`translate(${x} ${y}) scale(${scale})`}>${live.art}</g>`;
  // A round slot masks its picture round. The renderer's circular picture is
  // a square with the circle painted in it, and the corners of that square,
  // black on a black face, still showed past the ring when the card sat on
  // a lighter well.
  if (ring === "circle") {
    const cx = x + width / 2;
    const cy = y + height / 2;
    const r = Math.min(width, height) / 2;
    return svg`<clipPath id=${id}><circle cx=${cx} cy=${cy} r=${r} /></clipPath>
      <g clip-path=${`url(#${id})`}>${inner}</g>
      <circle cx=${cx} cy=${cy} r=${r} fill="none" stroke=${RING} stroke-width="0.75" />`;
  }
  const ringed = svg`<rect x=${x} y=${y} width=${width} height=${mode === "fit" ? height : slot.height} rx=${ring.rx} fill="none" stroke=${RING} stroke-width="0.75" />`;
  if (mode === "fit") {
    return svg`<clipPath id=${id}><rect x=${x} y=${y} width=${width} height=${height} rx=${ring.rx} /></clipPath>
      <g clip-path=${`url(#${id})`}>${inner}</g>${ringed}`;
  }
  return svg`<clipPath id=${id}><rect x=${slot.x} y=${slot.y} width=${slot.width} height=${slot.height} rx="3" /></clipPath>
    <g clip-path=${`url(#${id})`}>${inner}</g>${ringed}`;
}

/**
 * One disc of a bigger picture, set into a round slot.
 *
 * The corner's render is the top right quarter of the screen with the content
 * disc near its corner and the bezel text curving past it. The drawing's
 * corner slot is top left and 13 px across, so the whole quadrant fitted in
 * was a smudge with the disc off to one side. This scales the disc alone to
 * the slot, moves its centre onto the slot's, and masks the rest away.
 */
function disc(
  live: LiveShape,
  focus: { cx: number; cy: number; diameter: number },
  slot: { x: number; y: number; width: number; height: number },
  clipId: string,
): unknown {
  const side = Math.min(slot.width, slot.height);
  const scale = side / focus.diameter;
  const cx = slot.x + slot.width / 2;
  const cy = slot.y + slot.height / 2;
  const x = cx - focus.cx * scale;
  const y = cy - focus.cy * scale;
  return svg`<clipPath id=${clipId}><circle cx=${cx} cy=${cy} r=${side / 2} /></clipPath>
    <g clip-path=${`url(#${clipId})`}><g class="pk-live" transform=${`translate(${x} ${y}) scale(${scale})`}>${live.art}</g></g>
    <circle cx=${cx} cy=${cy} r=${side / 2} fill="none" stroke=${RING} stroke-width="0.75" />`;
}

/** The hairline round a drawn-in picture: the same faint white the card's
 * own preview well wears, so the two read as one kind of thing. */
const RING = "rgba(255,255,255,.18)";

/** A clip id of this drawing's own, since a grid holds many of them. */
const clipKey = () => `pk-clip-${Math.random().toString(36).slice(2, 8)}`;

/** The clock each screen keeps, which is what makes the picture a face rather
 * than a diagram. Quiet enough not to compete with a lit slot. */
const faceClock = (x: number, y: number, size: number, text: string) =>
  svg`<text x=${x} y=${y} text-anchor="middle" font-size=${size} font-weight="700"
    fill=${CLOCK} font-family="system-ui, sans-serif">${text}</text>`;

/**
 * The watch: case, bands, crown, and the four face slots laid out the way the
 * Modular face lays them out. Corner arcing into the top left, the clock top
 * right, rectangular the full width of the screen under them, and circular
 * bottom left. Inline, which that face does not carry, sits as a line over
 * the clock.
 *
 * The parts rather than a finished drawing, so one layout serves both the
 * whole device and every window onto it.
 */
function watchBody(families: readonly FamilyKind[], live: LiveShapes, shelved: boolean): unknown {
  const has = (f: FamilyKind) => families.includes(f);
  // The real shape in its slot where there is one, the lit fill otherwise.
  // Rectangular and circular sit in the lower half of the face and corner and
  // inline in the upper one, so a window onto either half holds two shapes
  // and a slice of the band beyond the case: the crops are the two halves.
  //
  // The bottom of the face holds one of two things, never both: a rectangular
  // card's rectangle sits right at the bottom, and a circular card's circle
  // sits in the bottom row with its two neighbours, the way the Modular face
  // draws whichever of them it has there.
  const rect = placed(live.rectangular, { x: 14, y: 56, width: 58, height: 21 }, "fit", "", { rx: 3 });
  const circ = placed(live.circular, { x: 14, y: 65, width: 14, height: 14 }, "fit", clipKey(), "circle");
  const corner = placed(live.corner, { x: 14, y: 17, width: 13, height: 13 }, "fit", clipKey(), "circle");
  // Inline is a line of text rather than a canvas: the panel's own laid out
  // line, set into the band over the clock.
  const inline = placedInline(live.inline, { x: 14, y: 13, width: 58, height: 8 });
  // A shelved design has no watch: the case is drawn as a dashed outline, and
  // the bands and crown, which are the parts that make it a real object, are
  // left off.
  const shell = shelved
    ? svg`<rect x="11" y="13" width="64" height="70" rx="14" fill=${SCREEN} />
      <rect x="6" y="8" width="74" height="80" rx="18" fill="none" stroke=${CASE} stroke-width="3" stroke-dasharray=${DASH} />`
    : svg`<rect x="27" y="0" width="32" height="10" rx="3" fill=${CASE} />
      <rect x="27" y="86" width="32" height="10" rx="3" fill=${CASE} />
      <rect x="6" y="8" width="74" height="80" rx="18" fill=${CASE} />
      <rect x="82" y="30" width="4" height="12" rx="2" fill=${CASE} />
      <rect x="11" y="13" width="64" height="70" rx="14" fill=${SCREEN} />`;
  return svg`${shell}
    ${faceClock(56, 33, 13, "10:09")}
    ${has("inline") ? inline ?? svg`<rect x="28" y="15" width="30" height="3" rx="1.5" fill=${ON} />` : nothing}
    ${has("corner") ? corner ?? svg`<path d="M16 30 A 26 26 0 0 1 28 19" stroke=${ON} stroke-width="4" fill="none" stroke-linecap="round" />` : nothing}
    ${has("rectangular")
      ? rect ?? svg`<rect x="14" y="56" width="58" height="21" rx="5" fill=${ON} />`
      : svg`${circ ?? svg`<circle cx="21" cy="72" r="7" fill=${lit(has("circular"))} />`}
        <circle cx="43" cy="72" r="7" fill=${OFF} />
        <circle cx="65" cy="72" r="7" fill=${OFF} />`}`;
}

/** How many characters of an inline line the watch shows before it cuts the
 * rest and draws an ellipsis. Watched on a 45 mm face: "Front Yard test test"
 * came out as "FRONT YARD TEST…". */
export const INLINE_MAX_CHARS = 16;

/** The inline line as the watch would show it: whole when it fits, cut to
 * the first characters with an ellipsis when it does not. */
export function inlineShown(text: string): string {
  const trimmed = text.trim();
  return trimmed.length <= INLINE_MAX_CHARS ? trimmed : `${trimmed.slice(0, INLINE_MAX_CHARS - 1).trimEnd()}…`;
}

/** The watch band's text size, in the drawing's units. A character is taken
 * as 0.56 of it across: enough to centre the line without measuring it. */
const INLINE_FONT = 4.2;

/**
 * The inline line set into its band on the watch.
 *
 * Inline is not a picture the renderer drew: it is a symbol and a line of
 * text, and both are drawn here as the watch draws them, the symbol scaled
 * into the band's height and the text beside it, centred as a pair. Plain
 * svg rather than the panel's HTML line in a foreignObject, which WebKit
 * lays out at its own size whatever the drawing round it is scaled to. The
 * text is cut where the watch cuts it.
 */
function placedInline(
  live: LiveShape | undefined,
  slot: { x: number; y: number; width: number; height: number },
  font: number = INLINE_FONT,
): unknown {
  if (live === undefined || live.text === undefined) return undefined;
  const text = inlineShown(live.text);
  if (text === "") return undefined;
  const symbol = live.art !== nothing && live.width > 0 && live.height > 0;
  const side = font;
  const gap = font / INLINE_FONT;
  const textWidth = Math.min(text.length * font * 0.56, slot.width);
  const total = textWidth + (symbol ? side + gap : 0);
  const start = slot.x + (slot.width - total) / 2;
  const middle = slot.y + slot.height / 2;
  const baseline = middle + font * 0.36;
  // The text is anchored at its middle, so a guess at its width only moves
  // the symbol beside it and never pushes the words off centre.
  const textMiddle = start + (symbol ? side + gap : 0) + textWidth / 2;
  return svg`<g class="pk-live">
    ${symbol ? svg`<g transform=${`translate(${start} ${middle - side / 2}) scale(${side / live.width})`}>${live.art}</g>` : nothing}
    <text x=${textMiddle} y=${baseline} text-anchor="middle" font-size=${font} font-weight="600"
      fill="#fff" font-family="system-ui, sans-serif">${text}</text></g>`;
}

// ── the phone, to the iPhone 15 Pro's proportions ─────────────────────────
//
// The phone is 50 units wide with a 44 unit screen, so a unit is 393/44 of
// that phone's points, and every slot below is the phone's real slot at that
// scale: the sizes the renderer measured. The picture is then honest about
// size, which the older drawing was not: Large is a tile as tall as it is
// wide, Medium is half of it, Small a quarter, and Extra Large runs off the
// top of the window.
//
// One screen per picture rather than both stacked on one phone. A Home
// Screen shape is drawn on the Home Screen, at the bottom of the page over
// the dock, and a Lock Screen shape under the clock at the top. The window
// onto each is the same height, so every card shows a phone of the same
// width and the tiles can be compared across cards.

/** One unit for one of the iPhone 15 Pro's points. */
const PT = 44 / 393;
const pt = (points: number) => points * PT;

/** The case, and the screen inside it. */
export const PHONE_FRAME = { width: 50, height: 102 };
const PHONE_SCREEN = { x: 3, y: 3, width: 44, height: 96 };

/** How much of the phone a card's window shows: the top of it for a Lock
 * Screen shape, the bottom for a Home Screen one. Just tall enough for a
 * Large tile with the case's bottom edge under it: the tighter the window,
 * the bigger the phone draws in the well, and the edge of the case is what
 * says the picture is a phone. There is no dock: the tiles sit on the bottom
 * of the screen, which costs the page its dock and buys the tiles a third
 * more room. */
export const PHONE_WINDOW = 49;

/** How much of the phone a Lock Screen card's window shows: the top of it,
 * cut off just under the row of widget slots. The Home Screen window has to
 * be tall enough for a Large tile, and a Lock Screen shape sits in the top
 * third of the screen, so sharing that height left the bottom third of every
 * Lock Screen card as empty screen. A window of its own ends the picture a
 * little under the slot row, which draws the phone half again as wide in the
 * same well. The two windows are different heights, so a Lock Screen phone is
 * wider than a Home Screen one; nothing compares a slot with a tile, and the
 * tiles still share one scale with each other. */
export const PHONE_LOCK_WINDOW = 37;

/** The Home Screen grid: four columns of icons across the widget band, the
 * lowest row ending at the bottom of the screen. Rows are a little tighter
 * than the phone's, so a tile spans the rows it spans on the phone. */
const ICON = pt(60);
const HOME = { x: PHONE_SCREEN.x + pt(24.17), width: pt(344.67), bottom: PHONE_SCREEN.y + PHONE_SCREEN.height - 3 };
const COL = (HOME.width - ICON) / 3;
const ROW = 9.6;

/** The Lock Screen: the island, the date line, the clock, then the row of
 * widget slots under it, four circular ones or two rectangular ones wide. */
const LOCK_ROW = { y: 26, height: pt(72), rect: pt(160), circle: pt(58) };
const LOCK_ROW_WIDTH = 2 * LOCK_ROW.rect + 1.2;
const LOCK_ROW_X = PHONE_FRAME.width / 2 - LOCK_ROW_WIDTH / 2;
const LOCK_GAP = (LOCK_ROW_WIDTH - 4 * LOCK_ROW.height) / 3;
const LOCK_INLINE = { x: 11.5, y: 10.6, width: pt(240), height: 3.4 };

/** The corner the Lock Screen rectangle is drawn with, as the editor's stage
 * draws the same shape: an 18 px radius on a stage 900 px wide for a shape
 * 147.67 pt wide, which is 3 pt. A flat 2 units was a quarter of the drawn
 * height, so the card showed a pill where the editor showed a rectangle. */
const LOCK_RECT_RX = pt(3);
const LOCK_INLINE_FONT = 3.4;

type Slot = { x: number; y: number; width: number; height: number };

/** The x of the Lock Screen row's n-th slot, of four. */
const lockSlotX = (n: number) => LOCK_ROW_X + n * (LOCK_ROW.height + LOCK_GAP);

/**
 * Where a shape's slot sits on the phone, in the phone's units, as the
 * card draws it. The Home Screen tiles sit on the bottom row of the page, the
 * Lock Screen shapes in the first slot of the row under the clock, and
 * inline on the line above the clock. Corner has no slot on a phone.
 */
export function phoneSlot(family: FamilyKind): Slot | undefined {
  switch (family) {
    case "small":
      return { x: HOME.x, y: HOME.bottom - pt(162.67), width: pt(162.67), height: pt(162.67) };
    case "medium":
      return { x: HOME.x, y: HOME.bottom - pt(162.67), width: HOME.width, height: pt(162.67) };
    case "large":
      return { x: HOME.x, y: HOME.bottom - pt(360), width: HOME.width, height: pt(360) };
    case "xlarge":
      return { x: HOME.x, y: HOME.bottom - pt(557.33), width: HOME.width, height: pt(557.33) };
    case "rectangular":
      return { x: lockSlotX(0), y: LOCK_ROW.y, width: LOCK_ROW.rect, height: LOCK_ROW.height };
    case "circular": {
      const inset = (LOCK_ROW.height - LOCK_ROW.circle) / 2;
      return { x: lockSlotX(0) + inset, y: LOCK_ROW.y + inset, width: LOCK_ROW.circle, height: LOCK_ROW.circle };
    }
    case "inline":
      return LOCK_INLINE;
    default:
      return undefined;
  }
}

/** The case round the screen: solid with the island for a real phone, a
 * dashed outline for a shelved design that is on none. */
function phoneShell(shelved: boolean): unknown {
  const s = PHONE_SCREEN;
  return shelved
    ? svg`<rect x=${s.x} y=${s.y} width=${s.width} height=${s.height} rx="7" fill=${SCREEN} />
      <rect x="1" y="1" width=${PHONE_FRAME.width - 2} height=${PHONE_FRAME.height - 2} rx="9" fill="none" stroke=${CASE} stroke-width="2" stroke-dasharray=${DASH} />`
    : svg`<rect x="0" y="0" width=${PHONE_FRAME.width} height=${PHONE_FRAME.height} rx="9" fill=${CASE} />
      <rect x=${s.x} y=${s.y} width=${s.width} height=${s.height} rx="7" fill=${SCREEN} />
      <rect x="17" y="6" width="16" height="3" rx="1.5" fill=${DIM} />`;
}

/** Whether two boxes overlap, with a little air between them counted as
 * overlap, so no icon is drawn touching a tile. */
const touches = (a: Slot, b: Slot) =>
  a.x < b.x + b.width + 0.5 && a.x + a.width + 0.5 > b.x && a.y < b.y + b.height + 0.5 && a.y + a.height + 0.5 > b.y;

/**
 * The Home Screen with one tile on it, at the bottom of the page, and the
 * page's icons in every cell the tile leaves free. The icons are what say
 * how big the tile is: Small sits beside a two by two block of them, Medium
 * under two full rows, Large under none.
 */
function homeScreen(family: FamilyKind, live: LiveShapes, shelved: boolean): unknown {
  const slot = phoneSlot(family);
  const tile = slot === undefined ? undefined : placed(live[family], slot, "fit", "", { rx: 3 });
  const icons: unknown[] = [];
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const icon = { x: HOME.x + col * COL, y: HOME.bottom - ICON - row * ROW, width: ICON, height: ICON };
      if (slot !== undefined && touches(icon, slot)) continue;
      icons.push(svg`<rect x=${icon.x} y=${icon.y} width=${ICON} height=${ICON} rx="1.6" fill=${OFF} />`);
    }
  }
  return svg`${phoneShell(shelved)}${icons}
    ${tile ?? (slot === undefined ? nothing : svg`<rect x=${slot.x} y=${slot.y} width=${slot.width} height=${slot.height} rx="3" fill=${ON} />`)}`;
}

/**
 * The Lock Screen with one shape on it: the island, the date line, the
 * clock, and the row of slots under it with the shape in the first. A
 * rectangular shape takes two slots and leaves two round ones off beside it;
 * a circular one takes the first and leaves three. Inline takes the line
 * above the clock, where the date was.
 */
function lockScreen(family: FamilyKind | undefined, live: LiveShapes, shelved: boolean): unknown {
  const slot = family === undefined ? undefined : phoneSlot(family);
  const round = (n: number, on: boolean) => {
    const cx = lockSlotX(n) + LOCK_ROW.height / 2;
    const cy = LOCK_ROW.y + LOCK_ROW.height / 2;
    return svg`<circle cx=${cx} cy=${cy} r=${LOCK_ROW.circle / 2} fill=${lit(on)} />`;
  };
  let row: unknown;
  let line: unknown;
  if (family === "rectangular" && slot) {
    const rect = placed(live.rectangular, slot, "fit", clipKey(), { rx: LOCK_RECT_RX });
    row = svg`${rect ?? svg`<rect x=${slot.x} y=${slot.y} width=${slot.width} height=${slot.height} rx=${LOCK_RECT_RX} fill=${ON} />`}${round(2, false)}${round(3, false)}`;
  } else if (family === "circular" && slot) {
    const circ = placed(live.circular, slot, "fit", clipKey(), "circle");
    row = svg`${circ ?? round(0, true)}${round(1, false)}${round(2, false)}${round(3, false)}`;
  } else {
    row = svg`${round(0, false)}${round(1, false)}${round(2, false)}${round(3, false)}`;
  }
  if (family === "inline" && slot) {
    line = placedInline(live.inline, slot, LOCK_INLINE_FONT)
      ?? svg`<rect x=${slot.x} y=${slot.y + 0.6} width=${slot.width} height=${slot.height - 1.2} rx="1.1" fill=${ON} />`;
  } else {
    line = svg`<rect x="18" y="11.6" width="14" height="1.6" rx="0.8" fill=${CLOCK} />`;
  }
  return svg`${phoneShell(shelved)}
    ${line}
    ${faceClock(25, 24, 12, "9:41")}
    ${row}`;
}

/** The phone with one shape on it: the Home Screen for a Home Screen shape,
 * the Lock Screen for anything else. */
function phoneBody(family: FamilyKind | undefined, live: LiveShapes, shelved: boolean): unknown {
  return family !== undefined && isHomeFamily(family) ? homeScreen(family, live, shelved) : lockScreen(family, live, shelved);
}

/** How much room is left round the drawn control tile, as a share of its
 * longer side. The tile is the whole picture rather than a window onto one,
 * so it has to sit inside the well with air round it: filled edge to edge,
 * its rounded ends are the first thing the card cuts off. */
const CTL_PAD = 0.22;

/** The tile a card falls back to when it has no real one to draw: a lit pill,
 * in the proportions the watch gives a control. */
const CTL_STANDIN = { width: 30, height: 18 };

/**
 * The Control Center tile, on its own.
 *
 * Control Center is not a face or a Home Screen, so a tile drawn onto either
 * device would say it sat somewhere it does not: the tile is the whole
 * picture. The real one where the card has one, drawn as its own device draws
 * it (the watch's pill, the phone's circle), and a lit pill standing in for it
 * otherwise.
 *
 * A device crop fills its well and lets the edges be trimmed, because a window
 * onto a screen is only ever a piece of one anyway. A tile is the whole
 * object, so the drawn one does the opposite: its window is the pill plus a
 * margin on every side, and `meet` fits all of it in rather than trimming its
 * ends off against the sides of the card.
 *
 * The real tile is a laid-out box rather than a drawing, since that is the one
 * picture of a control this panel has and it is shared with the editor. It
 * keeps its own size and is centred in the well, which leaves the same margin
 * round it without a second copy of the tile to keep in step.
 */
function controlBeside(live: LiveShape | undefined): TemplateResult {
  if (live && live.art !== nothing) {
    return html`<span class="pk-card-ctl">${live.art}</span>`;
  }
  const { width, height } = CTL_STANDIN;
  const pad = Math.max(width, height) * CTL_PAD;
  return html`<svg class="pk-crop ctl" viewBox=${`0 0 ${width + pad * 2} ${height + pad * 2}`}
    preserveAspectRatio="xMidYMid meet" aria-hidden="true"><rect x=${pad} y=${pad}
    width=${width} height=${height} rx=${height / 2} fill=${ON} /></svg>`;
}

/** A window onto one device's drawing, in that drawing's own units. */
interface Crop {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Where on the watch each shape's window sits.
 *
 * Wide rather than square, at about two to one, which is the shape of the
 * well a card gives it: the window is filled and its edges trimmed, so a crop
 * of another shape would lose the part that matters.
 *
 * Two windows, the two halves of the watch. Rectangular and circular take the
 * lower half, corner and inline the upper one, each half running from the
 * middle of the face out past the case to a slice of the band, so every card
 * of one half shows the same piece of watch and the eye has one thing to
 * learn. A shape no watch draws falls back to the whole case rather than an
 * invented window.
 */
function watchCrop(family: FamilyKind): Crop {
  switch (family) {
    case "rectangular":
    case "circular":
      return { x: 0, y: 48, width: 86, height: 48 };
    case "corner":
    case "inline":
      return { x: 0, y: 0, width: 86, height: 48 };
    default:
      return { x: 0, y: 0, width: 86, height: 96 };
  }
}

/**
 * Where on the phone each shape's window sits.
 *
 * Two windows: the top of the phone for the Lock Screen shapes, with the
 * clock and the slot row under it, and the bottom of it for the Home Screen
 * sizes, with the tile at the bottom of the screen and the case's edge under
 * it. Every Home Screen window is the same height, so the phone is the same
 * width on each of those cards and a Large tile is visibly twice a Medium
 * one. The Lock Screen window is shorter, since its shapes all sit in the top
 * third of the screen and the rest of that height was empty. Both are taller
 * than the card's well is, so each is fitted in whole with the well's black
 * either side, rather than trimmed. A shape no phone draws falls back to the
 * whole case.
 */
function phoneCrop(family: FamilyKind): Crop {
  if (isHomeFamily(family)) return { x: 0, y: PHONE_FRAME.height - PHONE_WINDOW, width: PHONE_FRAME.width, height: PHONE_WINDOW };
  if (isSharedFamily(family)) return { x: 0, y: 0, width: PHONE_FRAME.width, height: PHONE_LOCK_WINDOW };
  return { x: 0, y: 0, width: PHONE_FRAME.width, height: PHONE_FRAME.height };
}

/**
 * One complication where it sits on its device, for a picker card.
 *
 * A card is about one shape on one device, so this draws that device and
 * shows the part of it holding the slot: a Home Screen tile at the size iOS
 * gives it, rather than a ninth of a phone. The slot carries the complication
 * itself where `live` has it, and the lit fill where it does not, which is
 * what a document this panel cannot draw still gets.
 *
 * No family at all is a design that is only a Control Center control, and its
 * tile is the whole picture: a control sits on neither screen.
 *
 * `shelved` is the library's, where a design is on no device: the case is
 * drawn as a dashed outline of one.
 */
export function deviceCropArt(
  family: FamilyKind | undefined,
  device: "watch" | "iphone",
  live: LiveShapes = {},
  opts: { shelved?: boolean } = {},
): TemplateResult {
  if (family === undefined) return controlBeside(live.control);
  const shelved = opts.shelved === true;
  const phone = device === "iphone";
  const box = phone ? phoneCrop(family) : watchCrop(family);
  const body = phone ? phoneBody(family, live, shelved) : watchBody([family], live, shelved);
  // The watch's window is the well's own shape and fills it; the phone's is
  // taller than the well and is fitted in whole, black either side.
  return html`<svg class="pk-crop" viewBox=${`${box.x} ${box.y} ${box.width} ${box.height}`}
    preserveAspectRatio=${phone ? "xMidYMid meet" : "xMidYMid slice"} aria-hidden="true">${body}</svg>`;
}

/** How much room is left round a shape drawn on its own, as a share of its
 * longer side. Without it the hairline ring sits on the edge of the drawing
 * and the well cuts half of it off. */
const BARE_PAD = 0.05;

/** The corner a shape drawn on its own is rounded by, as a share of its
 * shorter side. The real radius is the device's and is in the device's units,
 * which a picture drawn in the render's own units cannot borrow. */
const BARE_RX = 0.12;

/** The shape of one slot on the watch, which is the shape the drawing falls
 * back to for a document this panel cannot render. The numbers are the slots
 * `watchBody` lays out, so a stand-in is the same shape as the real thing. */
function watchSlotBox(family: FamilyKind): { width: number; height: number } {
  switch (family) {
    case "circular":
    case "corner":
      return { width: 14, height: 14 };
    case "inline":
      return { width: 58, height: 8 };
    default:
      return { width: 58, height: 21 };
  }
}

/**
 * The picture the shape is drawn in, in whatever units it is drawn in.
 *
 * A real render is its own answer: it was made at the device's real slot size,
 * so its width and height are the shape's true proportions. A corner's render
 * is a whole screen quadrant, so its answer is the disc inside it instead.
 * With no render at all the device's own slot says what shape to draw, and
 * inline always asks the slot, because an inline render is the symbol beside
 * the words rather than the line itself.
 */
function bareBox(
  family: FamilyKind,
  device: "watch" | "iphone",
  shape: LiveShape | undefined,
): { width: number; height: number } {
  if (family !== "inline" && shape) {
    if (shape.focus) return { width: shape.focus.diameter, height: shape.focus.diameter };
    if (shape.art !== nothing && shape.width > 0 && shape.height > 0) return { width: shape.width, height: shape.height };
  }
  const slot = device === "iphone" ? phoneSlot(family) : undefined;
  return slot ? { width: slot.width, height: slot.height } : watchSlotBox(family);
}

/** The lit fill a shape drawn on its own falls back to: the slot's own shape,
 * so a document this panel cannot draw still says which shape it is. */
function bareStandin(family: FamilyKind, slot: Slot, rx: number): unknown {
  if (family === "circular" || family === "corner") {
    return svg`<circle cx=${slot.x + slot.width / 2} cy=${slot.y + slot.height / 2}
      r=${Math.min(slot.width, slot.height) / 2} fill=${ON} />`;
  }
  return svg`<rect x=${slot.x} y=${slot.y} width=${slot.width} height=${slot.height} rx=${rx} fill=${ON} />`;
}

/**
 * The complication on its own, with no device round it.
 *
 * `deviceCropArt` answers "where does this sit", which is what somebody
 * placing a complication wants and is a lot of watch case for somebody
 * reading a list of thirty of them. This answers "what does it look like":
 * the shape fills the well, and the crown, the bands, the case, the home
 * screen icons and the clock are all left off.
 *
 * The whole shape is fitted in rather than trimmed. A window onto a screen
 * can lose its edges, because a window is a piece of something anyway; the
 * shape itself cannot, because its edges are part of what it is.
 *
 * A control is already drawn on its own, so it is the same picture either
 * way: Control Center is not a place on a device.
 */
export function shapeOnlyArt(
  family: FamilyKind | undefined,
  device: "watch" | "iphone",
  live: LiveShapes = {},
): TemplateResult {
  if (family === undefined) return controlBeside(live.control);
  const shape = live[family];
  const box = bareBox(family, device, shape);
  const pad = Math.max(box.width, box.height) * BARE_PAD;
  const slot = { x: pad, y: pad, width: box.width, height: box.height };
  const rx = Math.min(box.width, box.height) * BARE_RX;
  const round = family === "circular" || family === "corner";
  const drawn = family === "inline"
    ? placedInline(shape, slot, box.height * 0.55)
    : placed(shape, slot, "fit", clipKey(), round ? "circle" : { rx });
  return html`<svg class="pk-crop bare" viewBox=${`0 0 ${box.width + pad * 2} ${box.height + pad * 2}`}
    preserveAspectRatio="xMidYMid meet" aria-hidden="true">${drawn ?? bareStandin(family, slot, rx)}</svg>`;
}
