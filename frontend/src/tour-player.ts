// The editor's tour player: the preview's stand-in for the watch playing a
// page tour from one tap.
//
// The watch does this with a timeline, one entry per page boundary, and never
// wakes up in between. The panel has no timeline, so it plays the same
// boundaries with one timer each. That is the reason this is a class rather
// than a frame loop: the pages have to change at exactly the instants
// `tourSteps` names, because those are the instants the watch will use, and a
// 60 fps loop would only ever approximate them while burning a frame budget to
// do it.
//
// The clock and the timers are injectable so the arithmetic can be tested
// without a browser. Nothing in here touches the document: it reads a
// `PagesSpec` and calls back with a page number.

import { type PagesSpec, tourDuration, tourSteps } from "./model.js";

/** A timer handle, whichever `setTimeout` is in play. */
type Handle = ReturnType<typeof setTimeout>;

export interface TourPlayerOptions {
  /** Draw this page. Called once per boundary, starting with page 1 at the
   * instant `play` is called. */
  show: (page: number) => void;
  /** The tour reached its end and put page 1 back. Not called for a `stop`:
   * a stopped tour leaves the page where the user took it. */
  done?: () => void;
  /** Epoch milliseconds. Defaults to the wall clock. */
  now?: () => number;
  setTimer?: (fn: () => void, ms: number) => Handle;
  clearTimer?: (handle: Handle) => void;
}

/**
 * One tour at a time, played by the boundaries of `tourSteps`.
 *
 * `play` always restarts: a second press is the author asking to watch it
 * again from page 1, not to resume. `stop` drops every pending boundary and
 * leaves the page alone, which is the editor's half of the watch rule that a
 * tap during a tour takes over from the page on screen.
 */
export class TourPlayer {
  private readonly opts: TourPlayerOptions;
  private timers: Handle[] = [];
  private startedAt?: number;
  private durationMs = 0;

  constructor(opts: TourPlayerOptions) {
    this.opts = opts;
  }

  private now(): number {
    return (this.opts.now ?? (() => Date.now()))();
  }

  private setTimer(fn: () => void, ms: number): Handle {
    return (this.opts.setTimer ?? ((f, m) => setTimeout(f, m)))(fn, ms);
  }

  private clearTimer(handle: Handle): void {
    (this.opts.clearTimer ?? ((h: Handle) => clearTimeout(h)))(handle);
  }

  /** Whether a tour is running right now. */
  get playing(): boolean {
    return this.timers.length > 0;
  }

  /** When the running tour started, in epoch milliseconds. */
  get startInstant(): number | undefined {
    return this.playing ? this.startedAt : undefined;
  }

  /** How long the running tour lasts, in milliseconds. What the progress bar
   * is drawn against. */
  get lengthMs(): number {
    return this.playing ? this.durationMs : 0;
  }

  /**
   * Play `spec` from page 1, whatever was playing before.
   *
   * The first page is shown at once rather than on a zero-length timer, so the
   * canvas never sits on the page the author was looking at for a frame after
   * the press.
   */
  play(spec: PagesSpec): void {
    this.stop();
    const start = this.now();
    const steps = tourSteps(spec, start);
    if (steps.length === 0) return;
    this.startedAt = start;
    this.durationMs = tourDuration(spec) * 1000;
    this.opts.show(steps[0]!.page);
    for (let i = 1; i < steps.length; i++) {
      const step = steps[i]!;
      const last = i === steps.length - 1;
      this.timers.push(this.setTimer(() => {
        this.opts.show(step.page);
        // The last boundary is the return to page 1, so the tour is over the
        // moment it fires: the timer list empties itself rather than waiting
        // for a stop that is never coming.
        if (last) {
          this.timers = [];
          this.startedAt = undefined;
          this.opts.done?.();
        }
      }, step.atMs - start));
    }
  }

  /** Drop every pending boundary. The page stays where it is. */
  stop(): void {
    for (const handle of this.timers) this.clearTimer(handle);
    this.timers = [];
    this.startedAt = undefined;
  }
}
