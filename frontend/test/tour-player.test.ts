// The editor's tour player.
//
// The numbers here are the watch's numbers: `tourSteps` is shared with the app,
// so a boundary that lands a tick early in the panel is a preview that lies
// about the timing the author is tuning. Each instant is written out by hand
// rather than read back from the code, and the pages are held for different
// lengths on purpose, because equal dwells would pass even if the player were
// playing the wrong page at every boundary but one.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { type PagesSpec } from "../src/model.js";
import { TourPlayer } from "../src/tour-player.js";

/** Three pages, page 1 held 1 s, page 2 held 3 s, page 3 on the 2 s default:
 * boundaries at 0, 1000 and 4000, and back to page 1 at 6000. */
function threePages(): PagesSpec {
  return { count: 3, mode: "tour", dwell: [1, 3] };
}

describe("TourPlayer", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  /** Every page the player showed, with the millisecond it showed it. */
  function record() {
    const start = Date.now();
    const shown: { at: number; page: number }[] = [];
    let ended = 0;
    const player = new TourPlayer({
      show: (page) => { shown.push({ at: Date.now() - start, page }); },
      done: () => { ended++; },
    });
    return { player, shown, ended: () => ended };
  }

  it("changes the page at the boundaries the watch uses", () => {
    const { player, shown, ended } = record();
    player.play(threePages());
    // Page 1 goes up on the press itself, not one tick later.
    expect(shown).toEqual([{ at: 0, page: 1 }]);
    expect(player.playing).toBe(true);
    vi.advanceTimersByTime(999);
    expect(shown).toHaveLength(1);
    vi.advanceTimersByTime(1);
    expect(shown.at(-1)).toEqual({ at: 1000, page: 2 });
    vi.advanceTimersByTime(3000);
    expect(shown.at(-1)).toEqual({ at: 4000, page: 3 });
    expect(player.playing).toBe(true);
    expect(ended()).toBe(0);
    // The end is the return to page 1, and the tour is over the instant it
    // lands: nothing is left to clear.
    vi.advanceTimersByTime(2000);
    expect(shown.at(-1)).toEqual({ at: 6000, page: 1 });
    expect(player.playing).toBe(false);
    expect(ended()).toBe(1);
    vi.advanceTimersByTime(10_000);
    expect(shown).toHaveLength(4);
  });

  it("leaves the page where it was when it is stopped part way", () => {
    const { player, shown, ended } = record();
    player.play(threePages());
    vi.advanceTimersByTime(1000);
    expect(shown.at(-1)).toEqual({ at: 1000, page: 2 });
    player.stop();
    expect(player.playing).toBe(false);
    vi.advanceTimersByTime(10_000);
    // No return to page 1 and no `done`: a stopped tour is the user taking the
    // wheel, which is the watch's rule too.
    expect(shown).toHaveLength(2);
    expect(ended()).toBe(0);
  });

  it("starts over on a second play rather than resuming", () => {
    const { player, shown } = record();
    player.play(threePages());
    vi.advanceTimersByTime(1000);
    player.play(threePages());
    expect(shown.at(-1)).toEqual({ at: 1000, page: 1 });
    vi.advanceTimersByTime(1000);
    expect(shown.at(-1)).toEqual({ at: 2000, page: 2 });
    vi.advanceTimersByTime(5000);
    expect(shown.at(-1)).toEqual({ at: 7000, page: 1 });
    expect(player.playing).toBe(false);
    // One first page per play, never two from the first tour's leftovers.
    expect(shown.filter((s) => s.page === 1)).toHaveLength(3);
  });

  it("plays nothing for a document with one page", () => {
    const { player, shown } = record();
    player.play({ count: 1, mode: "tour", dwell: [] });
    expect(shown).toEqual([]);
    expect(player.playing).toBe(false);
    expect(player.lengthMs).toBe(0);
  });

  it("takes its clock and its timers from the caller", () => {
    const pending: { fn: () => void; ms: number }[] = [];
    const shown: number[] = [];
    let cleared = 0;
    const player = new TourPlayer({
      show: (page) => { shown.push(page); },
      now: () => 10_000,
      setTimer: (fn, ms) => { pending.push({ fn, ms }); return pending.length as unknown as ReturnType<typeof setTimeout>; },
      clearTimer: () => { cleared++; },
    });
    player.play(threePages());
    expect(shown).toEqual([1]);
    // Delays are measured from the start instant, so a clock parked at 10 s
    // gives the same 1000, 4000 and 6000 as one starting at zero.
    expect(pending.map((p) => p.ms)).toEqual([1000, 4000, 6000]);
    expect(player.startInstant).toBe(10_000);
    expect(player.lengthMs).toBe(6000);
    player.stop();
    expect(cleared).toBe(3);
    expect(player.startInstant).toBeUndefined();
  });
});
