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
// too, so a button inherits one colour and the drawing follows its state.

import { type TemplateResult, html, nothing, svg } from "lit";

import type { FamilyKind } from "./model.js";
import { isHomeFamily } from "./layouts.js";
import { isSharedFamily } from "./linking.js";
import type { DeviceKind } from "./version.js";

/** Tall enough for a phone and wide enough for a watch's bands, with the two
 * devices drawn at the same scale so a row of them lines up. */
const VIEW_BOX = "0 0 32 28";

/** The unlit parts of a drawing: the outline, the clock, the neighbouring
 * tiles. Quiet enough to read as furniture rather than as a second shape. */
const FURNITURE = "0.25";
const GRID = "0.2";

/**
 * What colour the furniture takes.
 *
 * A variable rather than `currentColor`, so a card can light its shape with
 * the accent without turning the device around it blue as well: the shape
 * stays on the button's own colour and the outline follows this. Nobody has to
 * set it. Where it is unset the drawing is one colour at two opacities, which
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

// ── the picker card's pair of devices ─────────────────────────────────────
//
// The drawings above answer "where does this one shape sit". A picker card
// asks the other question: here is a whole design, show me every slot it
// fills, on both devices at once. So this is its own pair of pictures rather
// than a row of the buttons above, drawn eight times the size, with a real
// dark screen under them and a clock and an app grid for furniture. At 32x28
// a watch face with four slots lit is a smudge.
//
// The colours are the panel's own tokens, so the lit shapes follow the accent
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
}

/** The shapes drawn for one device's picture, by family, plus the Control
 * Center tile, which is drawn beside the devices rather than on one. A slot
 * that is missing keeps the plain lit fill. */
export type LiveShapes = Partial<Record<FamilyKind | "control", LiveShape>>;

/** Which devices a card draws: the ones the design is on. A design on one
 * device draws that device alone, and bigger. */
export interface DevicesOn {
  watch: boolean;
  phone: boolean;
}

/** The real complication on both devices, when a card has one to show. */
export interface LiveDesign {
  watch: LiveShapes;
  phone: LiveShapes;
}

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
  const scale = mode === "fit"
    ? Math.min(slot.width / live.width, slot.height / live.height)
    : slot.width / live.width;
  const width = live.width * scale;
  const height = live.height * scale;
  const x = slot.x + (slot.width - width) / 2;
  const y = mode === "fit" ? slot.y + (slot.height - height) / 2 : slot.y;
  const inner = svg`<g class="pk-live" transform=${`translate(${x} ${y}) scale(${scale})`}>${live.art}</g>`;
  const ringed = ring === "circle"
    ? svg`<circle cx=${x + width / 2} cy=${y + height / 2} r=${Math.min(width, height) / 2} fill="none" stroke=${RING} stroke-width="0.75" />`
    : svg`<rect x=${x} y=${y} width=${width} height=${mode === "fit" ? height : slot.height} rx=${ring.rx} fill="none" stroke=${RING} stroke-width="0.75" />`;
  if (mode === "fit") return svg`${inner}${ringed}`;
  return svg`<clipPath id=${clipId}><rect x=${slot.x} y=${slot.y} width=${slot.width} height=${slot.height} rx="3" /></clipPath>
    <g clip-path=${`url(#${clipId})`}>${inner}</g>${ringed}`;
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
 */
function watchCard(families: readonly FamilyKind[], live: LiveShapes = {}): TemplateResult {
  const has = (f: FamilyKind) => families.includes(f);
  // The real shape in its slot where there is one, the lit fill otherwise.
  // Inline is a line of text rather than a canvas and has no picture to set.
  const rect = placed(live.rectangular, { x: 14, y: 38, width: 58, height: 21 }, "fit", "", { rx: 3 });
  const circ = placed(live.circular, { x: 13, y: 63, width: 16, height: 16 }, "fit", "", "circle");
  const corner = placed(live.corner, { x: 14, y: 17, width: 13, height: 13 }, "fit", clipKey(), "circle");
  return html`<svg class="pk-card-watch" width="86" height="96" viewBox="0 0 86 96" aria-hidden="true">
    <rect x="27" y="0" width="32" height="10" rx="3" fill=${CASE} />
    <rect x="27" y="86" width="32" height="10" rx="3" fill=${CASE} />
    <rect x="6" y="8" width="74" height="80" rx="18" fill=${CASE} />
    <rect x="82" y="30" width="4" height="12" rx="2" fill=${CASE} />
    <rect x="11" y="13" width="64" height="70" rx="14" fill=${SCREEN} />
    ${faceClock(56, 33, 13, "10:09")}
    <rect x="36" y="15" width="30" height="3" rx="1.5" fill=${lit(has("inline"))} />
    ${corner ?? svg`<path d="M16 30 A 26 26 0 0 1 28 19" stroke=${lit(has("corner"))} stroke-width="4" fill="none" stroke-linecap="round" />`}
    ${rect ?? svg`<rect x="14" y="38" width="58" height="21" rx="5" fill=${lit(has("rectangular"))} />`}
    ${circ ?? svg`<circle cx="21" cy="71" r="8" fill=${lit(has("circular"))} />`}
  </svg>`;
}

/**
 * The phone: the Lock Screen slot above the line and the Home Screen tiles
 * below it.
 *
 * One Lock Screen slot for all three shared shapes rather than three of them.
 * iOS gives the Lock Screen one widget area, and a card that drew rectangular,
 * circular and inline separately down a 50 px phone would be three smudges
 * saying what the watch beside it already said in full.
 *
 * Extra Large lights the tallest tile with Large. The Home Screen has four
 * sizes and this drawing has room for three, and the tile a card is asking
 * about is "does this reach the Home Screen", which either of them answers.
 */
function phoneCard(families: readonly FamilyKind[], live: LiveShapes = {}): TemplateResult {
  const has = (f: FamilyKind) => families.includes(f);
  const lockOn = families.some((f) => isSharedFamily(f));
  const small = lit(has("small"));
  // The Lock Screen slot shows the biggest shape a Lock Screen draws, since it
  // is one slot for all three. A live small tile takes the left tile and the
  // right one goes quiet, so the picture reads as the widget beside a
  // neighbour rather than as the same widget twice.
  const lock = placed(live.rectangular ?? live.circular, { x: 9, y: 22, width: 32, height: 13 }, "fit", "", live.rectangular ? { rx: 2 } : "circle");
  const tile = placed(live.small, { x: 7, y: 42, width: 16, height: 16 }, "fit", "", { rx: 3 });
  const medium = placed(live.medium, { x: 7, y: 62, width: 36, height: 14 }, "fit", "", { rx: 3 });
  const large = placed(live.large ?? live.xlarge, { x: 7, y: 80, width: 36, height: 9 }, "cover", clipKey(), { rx: 3 });
  return html`<svg class="pk-card-phone" width="50" height="96" viewBox="0 0 50 96" aria-hidden="true">
    <rect x="0" y="0" width="50" height="96" rx="9" fill=${CASE} />
    <rect x="3" y="3" width="44" height="90" rx="7" fill=${SCREEN} />
    <rect x="17" y="6" width="16" height="3" rx="1.5" fill=${DIM} />
    ${faceClock(25, 20, 9, "9:41")}
    ${lock ?? svg`<rect x="9" y="24" width="32" height="8" rx="2" fill=${lit(lockOn)} />`}
    <line x1="6" y1="38" x2="44" y2="38" stroke=${DIM} stroke-dasharray="2 2" />
    ${tile ?? svg`<rect x="7" y="42" width="16" height="16" rx="3" fill=${small} />`}
    <rect x="27" y="42" width="16" height="16" rx="3" fill=${tile ? OFF : small} />
    ${medium ?? svg`<rect x="7" y="62" width="36" height="14" rx="3" fill=${lit(has("medium"))} />`}
    ${large ?? svg`<rect x="7" y="80" width="36" height="9" rx="3" fill=${lit(has("large") || has("xlarge"))} />`}
  </svg>`;
}

/**
 * The Control Center tile, beside the devices rather than on one.
 *
 * Control Center is not a face or a Home Screen, so a tile drawn onto either
 * device said it sat somewhere it does not. It stands on its own at the right
 * end of the row: the real tile where the card has one, drawn as the first
 * device shown draws it (the watch's pill, the phone's circle), and a lit
 * pill standing in for it otherwise.
 */
function controlBeside(live: LiveShape | undefined): TemplateResult {
  if (live && live.art !== nothing) {
    return html`<span class="pk-card-ctl" title="Control Center">${live.art}</span>`;
  }
  return html`<span class="pk-card-ctl" title="Control Center"><svg width="40" height="24" viewBox="0 0 40 24" aria-hidden="true">
    <rect x="0" y="0" width="40" height="24" rx="12" fill=${ON} />
  </svg></span>`;
}

/**
 * One design on the devices it is on, side by side, for a picker card.
 *
 * Only the devices that hold a copy. Both used to be drawn always, a blank
 * phone saying "not on your phone yet", and a design on one device then spent
 * half its card on a blank drawing while the one that mattered was too small
 * to read. A card with one device draws it larger (`.pk-card-art.one`), and
 * the who line and Add to still say what the blank drawing said.
 *
 * With `live`, each slot the design fills shows the complication itself, drawn
 * small, instead of a lit fill: the card then says what it is and where it
 * sits in one picture. Without it the slots are lit, which is what a card
 * whose document this panel cannot draw still gets.
 */
export function designDeviceArt(
  families: readonly FamilyKind[],
  control: boolean,
  live?: LiveDesign,
  on: DevicesOn = { watch: true, phone: true },
): TemplateResult {
  // Nowhere at all draws both, so a card never shows an empty mat.
  const both = on.watch === on.phone;
  const watch = both || on.watch;
  const phone = both || on.phone;
  return html`${watch ? watchCard(families, live?.watch) : nothing}${phone ? phoneCard(families, live?.phone) : nothing}${control ? controlBeside(watch ? live?.watch.control : live?.phone.control) : nothing}`;
}
