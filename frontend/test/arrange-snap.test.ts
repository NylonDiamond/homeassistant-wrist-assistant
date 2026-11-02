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
    expect(drag(CONTENT.x - ICON.x, CONTENT.y - ICON.y).entry).toEqual({ spot: "tl" });
    expect(drag(CONTENT.x + CONTENT.width - ICON.x - ICON.width, CONTENT.y - ICON.y).entry).toEqual({ spot: "tr" });
    expect(drag(CONTENT.x - ICON.x, CONTENT.y + CONTENT.height - ICON.y - ICON.height).entry).toEqual({ spot: "bl" });
    expect(drag(1, -1).entry).toEqual({ spot: "mc" });
  });

  it("names the line it landed on, of the tile or the content box, for the amber line", () => {
    expect(drag(CONTENT.x - ICON.x, 0).guides.x).toBe(CONTENT.x);
    expect(drag(-ICON.x + 2, 0).guides.x).toBe(0);
    expect(drag(1, 0).guides.x).toBe(90);
    expect(drag(0, -ICON.y + 1).guides.y).toBe(0);
    expect(drag(TILE.width - ICON.x - ICON.width - 2, 0).guides.x).toBe(TILE.width);
  });

  it("lands on a grid that runs from edge to edge of the tile, and a stored place draws where it landed", () => {
    const step = TILE.width / ARRANGE_GRID.across;
    const { entry, guides } = drag(-37, 0);
    expect(guides.x).toBeUndefined();
    const placed = arrangePartRect(TILE, CONTENT, ICON, "icon", entry).rect;
    const onGrid = [placed.x, placed.x + placed.width / 2, placed.x + placed.width]
      .map((n) => n / step)
      .some((cells) => Math.abs(cells - Math.round(cells)) < 0.03);
    expect(onGrid).toBe(true);
  });

  it("goes one grid cell past the tile's edge and no further, on every side", () => {
    const over = { x: TILE.width / ARRANGE_GRID.across, y: TILE.height / ARRANGE_GRID.down };
    const placed = (moveX: number, moveY: number) => arrangePartRect(TILE, CONTENT, ICON, "icon", drag(moveX, moveY).entry).rect;
    expect(placed(-500, 0).x).toBeCloseTo(-over.x, 0);
    expect(placed(500, 0).x + ICON.width).toBeCloseTo(TILE.width + over.x, 0);
    expect(placed(0, -500).y).toBeCloseTo(-over.y, 0);
    expect(placed(0, 500).y + ICON.height).toBeCloseTo(TILE.height + over.y, 0);
  });

  it("holds text at the same limit when it draws, and never lets more than half of it leave", () => {
    const state = { x: 20, y: 20, width: 40, height: 14 };
    const over = { x: TILE.width / ARRANGE_GRID.across, y: state.height / 2 };
    const move = (moveX: number, moveY: number) => arrangePartRect(TILE, CONTENT, state, "state", drag(moveX, moveY, { part: "state", native: state, drawn: state, free: true }).entry).rect;
    expect(move(-500, 0).x).toBeCloseTo(-over.x, 0);
    expect(move(500, 0).x + state.width).toBeCloseTo(TILE.width + over.x, 0);
    expect(move(0, -500).y).toBeCloseTo(-over.y, 0);
    expect(move(0, 500).y + state.height).toBeCloseTo(TILE.height + over.y, 0);
    // A stored move far past it is held there, on the device too.
    expect(arrangePartRect(TILE, CONTENT, state, "state", { spot: "tl", dx: -0.5, dy: -0.5 }).rect).toMatchObject({ x: -over.x, y: -over.y });
    const name = { x: 8, y: 90, width: 164, height: 18 };
    expect(arrangePartRect(TILE, CONTENT, name, "name", { spot: "bc", dy: 0.5 }).rect.y).toBeCloseTo(TILE.height - name.height / 2, 5);
  });

  it("moves the bar and the button like any part, with no limit when they draw", () => {
    const bar = { x: 6, y: 4, width: 168, height: 4 };
    const { entry } = drag(0, 100, { part: "bar", native: bar, drawn: bar });
    expect(entry.spot).toBe("bc");
    const placed = arrangePartRect(TILE, CONTENT, bar, "bar", entry).rect;
    expect(placed.y + placed.height).toBeGreaterThan(TILE.height - 20);
    expect(placed.width).toBe(bar.width);
    const button = { x: 140, y: 6, width: 30, height: 30 };
    expect(arrangePartRect(TILE, CONTENT, button, "button", { spot: "bl", dx: -0.5 }).rect.x).toBeCloseTo(CONTENT.x - TILE.width / 2, 5);
    expect(arrangePartRect(TILE, CONTENT, bar, "bar", { scale: 1.5 }).rect).toMatchObject({ width: 252, height: 6 });
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

  it("goes where the pointer puts it with Option or Alt, up to one cell past the tile's edge", () => {
    const { entry, guides } = drag(-37, 3, { free: true });
    expect(guides).toEqual({});
    const placed = arrangePartRect(TILE, CONTENT, ICON, "icon", entry).rect;
    expect(placed.x).toBeCloseTo(33, 0);
    expect(placed.y).toBeCloseTo(43, 0);
    const edge = arrangePartRect(TILE, CONTENT, ICON, "icon", drag(-500, -500, { free: true }).entry).rect;
    expect(edge.x).toBeCloseTo(-TILE.width / ARRANGE_GRID.across, 0);
    expect(edge.y).toBeCloseTo(-TILE.height / ARRANGE_GRID.down, 0);
  });

  it("keeps a part's size and whether it is hidden", () => {
    expect(drag(-500, -500, { entry: { scale: 1.2, hidden: true } }).entry).toMatchObject({ scale: 1.2, hidden: true, spot: "tl" });
  });

  it("aligns the name's text to the side it lands on, through its spot", () => {
    const box = { x: 8, y: 90, width: 164, height: 18 };
    const text = { x: 60, y: 90, width: 60, height: 18 };
    const name = (moveX: number) => drag(moveX, 0, { part: "name", native: box, drawn: text });
    const atLeft = text.x - CONTENT.x;
    expect(name(-atLeft).entry.spot).toBe("bl");
    expect(name(-atLeft).entry.dx).toBeUndefined();
    expect(name(500).entry.spot).toBe("br");
    expect(name(0).entry.spot).toBe("bc");
  });
});
