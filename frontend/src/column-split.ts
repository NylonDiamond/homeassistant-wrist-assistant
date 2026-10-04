// Side columns a person can widen by dragging the gutter beside them, as the
// complication editor's columns are (panel.ts keeps its own copy of these
// few lines). Three columns: a left one and a right one of a set width, the
// middle one taking what is left. The widths are a preference kept in
// localStorage; what is shown is that preference fitted to the measured width,
// so a narrower window squeezes the side columns rather than clipping one.

/** The limits one editor's columns keep. */
export interface ColumnLimits {
  /** The narrowest a side column may be dragged, CSS px. */
  min: number;
  /** The widest a side column may be dragged, CSS px. */
  max: number;
  /** The middle column never goes below this while three are shown. */
  middleMin: number;
}

export interface ColumnWidths {
  left: number;
  right: number;
}

/** The smallest of localStorage: what the load and the save use. */
export type ColumnStorage = Pick<Storage, "getItem" | "setItem">;

/** A width kept within the limits, in whole pixels. */
export function clampColumnWidth(n: number, limits: Pick<ColumnLimits, "min" | "max">): number {
  return Math.max(limits.min, Math.min(limits.max, Math.round(n)));
}

/**
 * How wide the side columns may actually be in `available` px: the width of
 * the grid less its gaps and gutters. The asked-for widths stand when they
 * fit beside a middle column of `middleMin`; otherwise both shrink by the same
 * factor, neither below `min`. Before the first measurement (`available` of
 * zero or less) the asked-for widths stand: the observer corrects them on the
 * same frame.
 */
export function fitColumnWidths(available: number, want: ColumnWidths, limits: ColumnLimits): ColumnWidths {
  if (available <= 0) return { left: want.left, right: want.right };
  const budget = available - limits.middleMin;
  let left = want.left;
  let right = want.right;
  if (left + right <= budget) return { left, right };
  if (budget <= limits.min * 2) return { left: limits.min, right: limits.min };
  const factor = budget / (left + right);
  left = Math.max(limits.min, Math.floor(left * factor));
  right = Math.max(limits.min, Math.floor(right * factor));
  // Flooring at the minimum can put the pair back over; take the rest off
  // whichever side still has slack.
  const over = left + right - budget;
  if (over > 0) {
    if (left >= right) left = Math.max(limits.min, left - over);
    else right = Math.max(limits.min, right - over);
  }
  return { left, right };
}

/** The browser's localStorage, or undefined where there is none (storage off,
 * or a test outside a browser). */
export function browserStorage(): ColumnStorage | undefined {
  try {
    return globalThis.localStorage ?? undefined;
  } catch {
    return undefined;
  }
}

/** The widths saved under `key`, each clamped; `defaults` for any side that
 * was never saved or does not read. */
export function loadColumnWidths(
  key: string,
  defaults: ColumnWidths,
  limits: Pick<ColumnLimits, "min" | "max">,
  storage: ColumnStorage | undefined = browserStorage(),
): ColumnWidths {
  const out = { left: defaults.left, right: defaults.right };
  try {
    const raw = storage?.getItem(key);
    if (!raw) return out;
    const saved = JSON.parse(raw) as { left?: unknown; right?: unknown } | null;
    if (typeof saved?.left === "number" && Number.isFinite(saved.left)) out.left = clampColumnWidth(saved.left, limits);
    if (typeof saved?.right === "number" && Number.isFinite(saved.right)) out.right = clampColumnWidth(saved.right, limits);
  } catch {
    /* Storage off or a value that does not read: the defaults. */
  }
  return out;
}

export function saveColumnWidths(key: string, widths: ColumnWidths, storage: ColumnStorage | undefined = browserStorage()): void {
  try {
    storage?.setItem(key, JSON.stringify({ left: widths.left, right: widths.right }));
  } catch {
    /* Storage off: the widths still hold for this visit. */
  }
}

export interface ColumnDrag {
  side: "left" | "right";
  /** The width on screen when the press began. Start from that, not the
   * stored preference: on a squeezed grid the two differ, and starting from
   * the stored one makes the bar jump away from the pointer. */
  base: number;
  limits: Pick<ColumnLimits, "min" | "max">;
  /** Each new width while the pointer moves. */
  onWidth(width: number): void;
  /** The drag is over: save. */
  onEnd(): void;
}

/** Drag a gutter from the press `start` on it. The right column grows as the
 * pointer moves left, so both gutters push the middle column rather than the
 * page. The gutter wears `dragging` until the press ends. */
export function beginColumnDrag(start: PointerEvent, drag: ColumnDrag): void {
  if (start.button !== 0) return;
  start.preventDefault();
  const bar = start.currentTarget as HTMLElement;
  const startX = start.clientX;
  bar.setPointerCapture(start.pointerId);
  bar.classList.add("dragging");
  const move = (ev: PointerEvent) => {
    if (ev.pointerId !== start.pointerId) return;
    const dx = ev.clientX - startX;
    drag.onWidth(clampColumnWidth(drag.side === "left" ? drag.base + dx : drag.base - dx, drag.limits));
  };
  const finish = (ev: PointerEvent) => {
    if (ev.pointerId !== start.pointerId) return;
    cleanup();
    drag.onEnd();
  };
  const cleanup = () => {
    bar.classList.remove("dragging");
    bar.removeEventListener("pointermove", move);
    bar.removeEventListener("pointerup", finish);
    bar.removeEventListener("pointercancel", finish);
    try {
      bar.releasePointerCapture(start.pointerId);
    } catch {
      /* already released */
    }
  };
  bar.addEventListener("pointermove", move);
  bar.addEventListener("pointerup", finish);
  bar.addEventListener("pointercancel", finish);
}
