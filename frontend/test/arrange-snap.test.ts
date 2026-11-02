import { describe, expect, it } from "vitest";
import { ARRANGE_GRID, type ArrangeSnapInput, snappedArrangePart } from "../src/watch-pages/arrange-snap.js";
import { arrangePartRect } from "../src/watch-pages/one-look/arrange.js";

const TILE = { width: 180, height: 120 };
const CONTENT = { x: 12, y: 12, width: 156, height: 96 };
const ICON = { x: 70, y: 40, width: 40, height: 40 };

/** A drag of the icon from the middle of the tile, unless told otherwise. */
function drag(moveX: number, moveY: number, over: Partial<ArrangeSnapInput> = {}) {
  return snappedArrangePart({ tile: TILE, content: CONTENT, native: ICON, part: "icon", entry: undefined, drawn: ICON, others: [], threshold: 4, free: false, ...over }, moveX, moveY);
}

describe("where a dragged part lands", () => {
  it("lands exactly on a spot at the content box's corners and middle, with no offset, so it holds on every device", () => {
    expect(drag(-500, -500).entry).toEqual({ spot: "tl" });
    expect(drag(500, -500).entry).toEqual({ spot: "tr" });
    expect(drag(-500, 500).entry).toEqual({ spot: "bl" });
    expect(drag(500, 500).entry).toEqual({ spot: "br" });
    expect(drag(1, -1).entry).toEqual({ spot: "mc" });
  });

  it("names the content box's line it landed on, for the amber line", () => {
    expect(drag(-500, 0).guides.x).toBe(CONTENT.x);
    expect(drag(1, 0).guides.x).toBe(90);
    expect(drag(0, -500).guides.y).toBe(CONTENT.y);
  });

  it("lands on the grid away from any line, and a stored place draws where it landed", () => {
    const step = CONTENT.width / ARRANGE_GRID.across;
    const { entry, guides } = drag(-37, 0);
    expect(guides.x).toBeUndefined();
    const placed = arrangePartRect(TILE, CONTENT, ICON, "icon", entry).rect;
    const onGrid = [placed.x, placed.x + placed.width / 2, placed.x + placed.width]
      .map((n) => (n - CONTENT.x) / step)
      .some((cells) => Math.abs(cells - Math.round(cells)) < 0.03);
    expect(onGrid).toBe(true);
  });

  it("lines up with another part's edge or middle while one is near", () => {
    const other = { x: 20, y: 90, width: 30, height: 14 };
    const { guides, entry } = drag(0, 12, { others: [other] });
    expect(guides.y).toBe(other.y);
    const placed = arrangePartRect(TILE, CONTENT, ICON, "icon", entry).rect;
    expect(placed.y + placed.height).toBeCloseTo(other.y, 0);
  });

  it("stores the spot nearest where it lands and only a small offset from it", () => {
    const { entry } = drag(-40, 0);
    expect(entry.spot).toBe("ml");
    expect(Math.abs(entry.dx ?? 0)).toBeLessThan(0.25);
  });

  it("goes where the pointer puts it with Option or Alt, up to the tile's edge", () => {
    const { entry, guides } = drag(-37, 3, { free: true });
    expect(guides).toEqual({});
    const placed = arrangePartRect(TILE, CONTENT, ICON, "icon", entry).rect;
    expect(placed.x).toBeCloseTo(33, 0);
    expect(placed.y).toBeCloseTo(43, 0);
    const edge = arrangePartRect(TILE, CONTENT, ICON, "icon", drag(-500, -500, { free: true }).entry).rect;
    expect(edge.x).toBeCloseTo(0, 0);
    expect(edge.y).toBeCloseTo(0, 0);
  });

  it("keeps a part's size and whether it is hidden", () => {
    expect(drag(-500, -500, { entry: { scale: 1.2, hidden: true } }).entry).toMatchObject({ scale: 1.2, hidden: true, spot: "tl" });
  });

  it("aligns the name's text to the side it lands on, through its spot", () => {
    const box = { x: 8, y: 90, width: 164, height: 18 };
    const text = { x: 60, y: 90, width: 60, height: 18 };
    const name = (moveX: number) => drag(moveX, 0, { part: "name", native: box, drawn: text });
    expect(name(-500).entry.spot).toBe("bl");
    expect(name(-500).entry.dx).toBeUndefined();
    expect(name(500).entry.spot).toBe("br");
    expect(name(500).entry.dx).toBeUndefined();
    expect(name(0).entry.spot).toBe("bc");
  });
});
