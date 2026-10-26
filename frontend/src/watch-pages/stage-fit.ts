// The stage's Fit, held to the room it has. While no zoom is picked, the
// page, status page and menu editors draw the watch at `stageFitZoom`; beside
// the two side columns on a laptop that watch was wider than the stage and
// hung off its edges. This watches the stage's box and gives the largest
// scale whose drawing fits its width, so Fit always fits. A zoom the person
// picked is theirs and is never held.
//
// The page editor asks for more (`fill`): its stage is one screen tall and
// does not grow with the watch, so its Fit is the largest scale at which the
// device fits the stage's width and its height both, up to
// `STAGE_FILL_MAX` (Jesse, 2026-10-26: on a 4K screen at 100% the watch at
// 200% stood small in a mostly empty stage). That is worked out from the
// box's size and the drawing's own size per unit of zoom
// (`stageFillZoom`). A page longer than the device's screen draws the device
// taller, and Fit once left that run below the stage ("Fit doesn't fit",
// Jesse, 2026-10-26): the drawing's height is measured after each draw, per
// unit of zoom, and Fit fits all of it, down to `STAGE_FILL_FLOOR`. The
// other editors pass no `fill` and fit as before.
//
// Measuring what was drawn feeds back into the next draw, and that once
// froze the browser (Jesse, 2026-10-26: dragging the settings gutter all the
// way left, or dragging a tile): the parts of the drawing that do not grow
// with the zoom made each draw's height per unit differ from the last by a
// pixel or two, every draw asked for another, and Lit's updates ran on
// without ever letting the page paint. So a new height counts only past
// `DRAWN_SLACK` of the old one; the box's room is its layout size, which a
// scrollbar coming or going does not change; no more than `CHAIN_MAX` draws
// in a row are asked for by measuring alone; and while `held` says so (a
// tile being dragged) the fit holds where it was.

import type { ReactiveController, ReactiveControllerHost } from "lit";

/** The least scale the fit goes down to: past it the stage scrolls. */
export const STAGE_FIT_FLOOR = 0.75;

/** A stage at least this wide, in a window at least `STAGE_ROOMY_TALL`
 * tall (a big screen at normal zoom), fits at `STAGE_ROOMY_ZOOM`: the watch
 * at 150% stood small in a mostly empty stage there. */
export const STAGE_ROOMY_WIDE = 1000;
export const STAGE_ROOMY_TALL = 1100;
export const STAGE_ROOMY_ZOOM = 2;

/** The most a filled stage (`fill`) draws a watch at: 300% of its points. */
export const STAGE_FILL_MAX = 3;

/** The least a filled stage fits a long page at: past it the stage scrolls. */
export const STAGE_FILL_FLOOR = 0.5;

/** How much the drawing's height per unit of zoom must move, as a share of
 * it, to be measured again: less is the fixed parts' rounding. */
const DRAWN_SLACK = 0.02;

/** The most draws in a row a measurement alone asks for. */
const CHAIN_MAX = 3;

/** What a stage that fills its box needs to know of its drawing, in CSS
 * pixels: the part that grows with the zoom, at zoom 1, the room around it
 * that does not (a label over the device, the gap between two), and the
 * largest zoom it may reach. */
export interface StageFillDrawing {
  width: number;
  height: number;
  fixedWidth: number;
  fixedHeight: number;
  max: number;
}

/**
 * The largest zoom at which `drawing` fits a box `room` big, to the hundredth
 * and rounded down so it never runs over; never past the drawing's own
 * `max`, and never under `floor`, past which the stage scrolls instead.
 */
export function stageFillZoom(room: { width: number; height: number }, drawing: StageFillDrawing, floor = STAGE_FIT_FLOOR): number {
  const across = (room.width - drawing.fixedWidth) / Math.max(1, drawing.width);
  const down = (room.height - drawing.fixedHeight) / Math.max(1, drawing.height);
  const zoom = Math.floor(Math.min(across, down, drawing.max) * 100 + 1e-6) / 100;
  return Math.max(floor, zoom);
}

export class StageFitWatch implements ReactiveController {
  /** The largest scale that fits the stage's width, or Infinity while
   * everything fits. */
  cap = Number.POSITIVE_INFINITY;
  private seen?: ResizeObserver;
  private box?: HTMLElement;
  private width = 0;
  /** The box's room inside its padding, for `fill`: zero until measured. */
  private room = { width: 0, height: 0 };
  /** For `fill`: how tall the drawing stood per unit of zoom when last
   * drawn, past its fixed room; a page longer than the screen makes it more
   * than the device alone. Zero until measured. */
  private drawn = 0;
  /** The last fit given, which a held fit keeps. */
  private last?: number;
  /** Draws in a row asked for by measuring alone, reset once a draw
   * measures nothing new. */
  private chained = 0;

  /** `selector` finds the stage's box in the host's shadow root, and
   * `scaleNow` is the scale the host drew at. `fill`, when given, sizes the
   * drawing to the box's height too while it returns one (undefined falls
   * back to the width alone, as on a stacked editor whose stage grows with
   * what it holds, where filling the height would never settle). */
  constructor(
    private readonly host: ReactiveControllerHost & HTMLElement & { renderRoot: ParentNode },
    private readonly selector: string,
    private readonly scaleNow: () => number,
    private readonly fill?: () => StageFillDrawing | undefined,
    private readonly held: () => boolean = () => false,
  ) {
    host.addController(this);
  }

  /** `base`, raised on a roomy stage, then held to the stage's width; or,
   * filling, the zoom that fills the box. */
  fit(base: number): number {
    if (this.last !== undefined && this.held()) return this.last;
    const filled = this.filled();
    this.last = filled ?? Math.min(this.roomy() ? Math.max(base, STAGE_ROOMY_ZOOM) : base, this.cap);
    return this.last;
  }

  /** Ask the host to draw again for a measurement, unless measuring alone
   * has asked `CHAIN_MAX` times in a row. */
  private again(): void {
    if (this.chained >= CHAIN_MAX) return;
    this.chained += 1;
    this.host.requestUpdate();
  }

  /** The filling zoom, or undefined when this stage does not fill (no
   * `fill`, or it said no) or its box is not measured yet. */
  private filled(): number | undefined {
    if (this.fill === undefined || this.room.width <= 0 || this.room.height <= 0) return undefined;
    const drawing = this.fill();
    if (drawing === undefined) return undefined;
    return stageFillZoom(this.room, { ...drawing, height: Math.max(drawing.height, this.drawn) }, STAGE_FILL_FLOOR);
  }

  /** How tall the drawing (the box's first child) stood per unit of zoom,
   * kept when it moved by more than a pixel, which draws again. Its layout
   * height, so a scroll or a transform never counts. */
  private measureDrawn(): boolean {
    const drawing = this.fill?.();
    const child = this.box?.firstElementChild as HTMLElement | null | undefined;
    const scale = this.scaleNow();
    if (drawing === undefined || typeof child?.offsetHeight !== "number" || scale <= 0) return false;
    const unit = Math.max(0, (child.offsetHeight - drawing.fixedHeight) / scale);
    if (Math.abs(unit - this.drawn) <= Math.max(1 / scale, this.drawn * DRAWN_SLACK)) return false;
    this.drawn = unit;
    return true;
  }

  /** The box's content size, inside its padding (the lit stage keeps room
   * at its foot for the watch's reflection). True when it changed. */
  private measureRoom(): boolean {
    const box = this.box;
    let width = 0;
    let height = 0;
    if (box !== undefined) {
      const pad = typeof getComputedStyle === "function" ? getComputedStyle(box) : undefined;
      const px = (v: string | undefined) => parseFloat(v ?? "") || 0;
      // The layout size, scrollbars and all: one coming or going never
      // changes the room, so it cannot start a loop.
      width = (box.offsetWidth ?? box.clientWidth) - px(pad?.paddingLeft) - px(pad?.paddingRight) - px(pad?.borderLeftWidth) - px(pad?.borderRightWidth);
      height = (box.offsetHeight ?? box.clientHeight) - px(pad?.paddingTop) - px(pad?.paddingBottom) - px(pad?.borderTopWidth) - px(pad?.borderBottomWidth);
    }
    if (Math.abs(width - this.room.width) < 1 && Math.abs(height - this.room.height) < 1) return false;
    this.room = { width, height };
    return true;
  }

  /** Whether the stage is big enough to draw the watch bigger. */
  private roomy(): boolean {
    return this.width >= STAGE_ROOMY_WIDE && (globalThis.innerHeight ?? 0) >= STAGE_ROOMY_TALL;
  }

  hostUpdated(): void {
    const box = this.host.renderRoot.querySelector<HTMLElement>(this.selector) ?? undefined;
    if (box !== this.box) {
      this.seen?.disconnect();
      this.box = box;
      const was = this.roomy();
      this.width = box?.clientWidth ?? 0;
      if (box !== undefined && typeof ResizeObserver !== "undefined") {
        this.seen = new ResizeObserver(() => this.resized());
        this.seen.observe(box);
      }
      if (this.fill !== undefined && this.measureRoom()) {
        this.host.requestUpdate();
        return;
      }
      if (this.roomy() !== was) {
        this.host.requestUpdate();
        return;
      }
    }
    // A held fit measures nothing: a tile dragged across the page must not
    // move the zoom under the pointer.
    if (this.held()) return;
    if (this.fill !== undefined && this.measureDrawn()) {
      this.again();
      return;
    }
    this.chained = 0;
    this.measure();
  }

  hostDisconnected(): void {
    this.seen?.disconnect();
    this.seen = undefined;
    this.box = undefined;
  }

  /** A wider box may fit more: try the full scale again, then measure. A
   * filling stage draws again whenever its box changes size either way. */
  private resized(): void {
    if (this.fill !== undefined && this.measureRoom()) this.host.requestUpdate();
    const width = this.box?.clientWidth ?? 0;
    if (Math.abs(width - this.width) < 1) return;
    const grew = width > this.width;
    const was = this.roomy();
    this.width = width;
    if ((grew && this.cap !== Number.POSITIVE_INFINITY) || this.roomy() !== was) {
      this.cap = Number.POSITIVE_INFINITY;
      this.host.requestUpdate();
      return;
    }
    this.measure();
  }

  /** When the drawing runs past the box's width, the scale that would just
   * fit it. */
  private measure(): void {
    const box = this.box;
    // A filled drawing is sized to the box already; measuring what it drew
    // would hold it to a long page's length.
    if (box === undefined || this.filled() !== undefined) return;
    const room = box.clientWidth;
    const used = box.scrollWidth;
    if (room <= 0 || used <= room + 1) return;
    const cap = Math.max(STAGE_FIT_FLOOR, Math.floor((this.scaleNow() * room / used) * 100) / 100);
    if (cap >= this.cap) return;
    this.cap = cap;
    this.host.requestUpdate();
  }
}
