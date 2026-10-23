// The stage's Fit, held to the room it has. While no zoom is picked, the
// page, status page and menu editors draw the watch at `stageFitZoom`; beside
// the two side columns on a laptop that watch was wider than the stage and
// hung off its edges. This watches the stage's box and gives the largest
// scale whose drawing fits its width, so Fit always fits. A zoom the person
// picked is theirs and is never held.

import type { ReactiveController, ReactiveControllerHost } from "lit";

/** The least scale the fit goes down to: past it the stage scrolls. */
export const STAGE_FIT_FLOOR = 0.75;

export class StageFitWatch implements ReactiveController {
  /** The largest scale that fits the stage's width, or Infinity while
   * everything fits. */
  cap = Number.POSITIVE_INFINITY;
  private seen?: ResizeObserver;
  private box?: HTMLElement;
  private width = 0;

  /** `selector` finds the stage's box in the host's shadow root, and
   * `scaleNow` is the scale the host drew at. */
  constructor(
    private readonly host: ReactiveControllerHost & HTMLElement & { renderRoot: ParentNode },
    private readonly selector: string,
    private readonly scaleNow: () => number,
  ) {
    host.addController(this);
  }

  /** `base` held to the stage's width. */
  fit(base: number): number {
    return Math.min(base, this.cap);
  }

  hostUpdated(): void {
    const box = this.host.renderRoot.querySelector<HTMLElement>(this.selector) ?? undefined;
    if (box !== this.box) {
      this.seen?.disconnect();
      this.box = box;
      this.width = box?.clientWidth ?? 0;
      if (box !== undefined && typeof ResizeObserver !== "undefined") {
        this.seen = new ResizeObserver(() => this.resized());
        this.seen.observe(box);
      }
    }
    this.measure();
  }

  hostDisconnected(): void {
    this.seen?.disconnect();
    this.seen = undefined;
    this.box = undefined;
  }

  /** A wider box may fit more: try the full scale again, then measure. */
  private resized(): void {
    const width = this.box?.clientWidth ?? 0;
    if (Math.abs(width - this.width) < 1) return;
    const grew = width > this.width;
    this.width = width;
    if (grew && this.cap !== Number.POSITIVE_INFINITY) {
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
    if (box === undefined) return;
    const room = box.clientWidth;
    const used = box.scrollWidth;
    if (room <= 0 || used <= room + 1) return;
    const cap = Math.max(STAGE_FIT_FLOOR, Math.floor((this.scaleNow() * room / used) * 100) / 100);
    if (cap >= this.cap) return;
    this.cap = cap;
    this.host.requestUpdate();
  }
}
