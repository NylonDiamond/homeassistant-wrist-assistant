// The line of device chips in a tick row (`renderTickChips`), as a small
// element that only watches its own size. Inside the device strip over the
// stage (`.lib-on`) it folds the unticked chips into "+ Add to a device"
// only when every chip really cannot fit on one line of the strip, however
// many devices there are (Jesse, 2026-10-17: a count rule and a width query
// folded chips that would have fit, and he wants to see every device's color
// whenever they do). On a library card it never folds: the cards wrap their
// chips on purpose.
//
// It has no shadow root and draws nothing: the chips and the fold stay light
// DOM children, so the host's sheet styles them. The fold is the `folded`
// attribute, which `libraryTicksStyles` reads.

/** Node has no HTMLElement, and the tests import this through the tick row;
 * there the element is defined but never made. */
const Base = (typeof HTMLElement === "undefined" ? class {} : HTMLElement) as typeof HTMLElement;

/**
 * Whether chips of these widths, `gap` apart, overflow a line `limit` wide.
 * The gap only counts between chips, so one chip needs only its own width.
 */
export function chipsFold(widths: readonly number[], gap: number, limit: number): boolean {
  if (widths.length === 0) return false;
  const need = widths.reduce((sum, w) => sum + w, 0) + gap * (widths.length - 1);
  return need > limit;
}

export class WaChipRow extends Base {
  private sizes: ResizeObserver | undefined;
  private kids: MutationObserver | undefined;
  /** The row's gap between chips, read once on the first measurement. */
  private gap: number | undefined;

  connectedCallback(): void {
    const strip = this.closest<HTMLElement>(".lib-on");
    if (strip === null || typeof ResizeObserver === "undefined") {
      if (this.hasAttribute("folded")) this.removeAttribute("folded");
      return;
    }
    const sizes = new ResizeObserver(() => this.measure(strip));
    sizes.observe(this);
    sizes.observe(strip);
    // The chips too: a folded chip is out of the flow, so its name or tag
    // changing, or a device coming or going, never resizes the row itself.
    // Observing a chip again only asks for one more measurement.
    const watchChips = () => {
      for (const chip of this.chips()) sizes.observe(chip);
    };
    watchChips();
    this.kids = new MutationObserver(watchChips);
    this.kids.observe(this, { childList: true });
    this.sizes = sizes;
  }

  disconnectedCallback(): void {
    this.sizes?.disconnect();
    this.kids?.disconnect();
    this.sizes = undefined;
    this.kids = undefined;
  }

  /** The device chips: every chip child, the dashed add chip included. The
   * fold's own chip sits inside its details, so it is never one of them. */
  private chips(): HTMLElement[] {
    return Array.from(this.children).filter((c): c is HTMLElement => c.classList.contains("lt-chip"));
  }

  /**
   * Only ever called by the observer, so layout is read once it is settled.
   * The limit is the strip's whole content width, not the row's: unfolded,
   * the row wraps under the question onto a line of its own, and the row's
   * width while folded is only the ticked chips and the fold, which would
   * keep it folded for good. Folded chips keep their width (see the sheet),
   * so the sum is the same either way and the answer cannot flip back.
   */
  private measure(strip: HTMLElement): void {
    let folded = false;
    // With nothing off there is no fold to fold into.
    if (this.querySelector(":scope > .lt-fold") !== null) {
      this.gap ??= parseFloat(getComputedStyle(this).columnGap) || 0;
      const pad = getComputedStyle(strip);
      const limit = strip.clientWidth - (parseFloat(pad.paddingLeft) || 0) - (parseFloat(pad.paddingRight) || 0);
      folded = chipsFold(this.chips().map((c) => c.offsetWidth), this.gap, limit);
    }
    if (folded !== this.hasAttribute("folded")) this.toggleAttribute("folded", folded);
  }
}

if (typeof customElements !== "undefined" && !customElements.get("wa-chip-row")) {
  customElements.define("wa-chip-row", WaChipRow);
}

declare global {
  interface HTMLElementTagNameMap {
    "wa-chip-row": WaChipRow;
  }
}
