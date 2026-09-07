// Which edges of a scroll box have more content behind them.
//
// The panel is one viewport tall and each column scrolls on its own, so a list
// that runs past the bottom of its box looks exactly like a list that ends
// there. This marks the boxes with `data-more-above` / `data-more-below`; the
// stylesheet draws a short fade in the box's own ground at that edge.
//
// Kept out of the component so the answer to "is there more" is measured in
// one place rather than repeated per column, and so it can be torn down in one
// call on disconnect.

export class ScrollFades {
  /** Every watched box, with the children whose size is being watched under it. */
  private readonly watched = new Map<HTMLElement, Set<Element>>();
  private readonly observer: ResizeObserver;
  private readonly onScroll = (e: Event) => this.mark(e.currentTarget as HTMLElement);

  constructor() {
    // The box growing, and the content inside it growing, both change the
    // answer without a scroll event ever firing.
    this.observer = new ResizeObserver(() => {
      for (const box of this.watched.keys()) this.mark(box);
    });
  }

  /**
   * Point the helper at this render's scroll boxes. Safe to call after every
   * update: a box already watched keeps its listener, a box that is gone is
   * dropped, and the children being measured are reconciled with what the box
   * holds now.
   */
  refresh(boxes: readonly (HTMLElement | null | undefined)[]) {
    const live = new Set(boxes.filter((b): b is HTMLElement => b != null));
    for (const [box, kids] of [...this.watched]) {
      if (live.has(box)) continue;
      this.drop(box, kids);
    }
    for (const box of live) {
      let kids = this.watched.get(box);
      if (!kids) {
        kids = new Set();
        this.watched.set(box, kids);
        box.addEventListener("scroll", this.onScroll, { passive: true });
        this.observer.observe(box);
      }
      // Deleting the element the loop is on is safe on a Set.
      for (const kid of kids) {
        if (kid.parentElement === box) continue;
        this.observer.unobserve(kid);
        kids.delete(kid);
      }
      for (const kid of box.children) {
        if (kids.has(kid)) continue;
        kids.add(kid);
        this.observer.observe(kid);
      }
      this.mark(box);
    }
  }

  disconnect() {
    for (const [box, kids] of [...this.watched]) this.drop(box, kids);
    this.observer.disconnect();
  }

  private drop(box: HTMLElement, kids: Set<Element>) {
    box.removeEventListener("scroll", this.onScroll);
    this.observer.unobserve(box);
    for (const kid of kids) this.observer.unobserve(kid);
    this.watched.delete(box);
  }

  /** A pixel of slack either way, so a box scrolled to its end is not still
   * claiming there is more under a rounding error. */
  private mark(box: HTMLElement) {
    const slack = box.scrollHeight - box.clientHeight;
    const scrolls = slack > 1;
    box.toggleAttribute("data-more-above", scrolls && box.scrollTop > 1);
    box.toggleAttribute("data-more-below", scrolls && box.scrollTop < slack - 1);
  }
}
