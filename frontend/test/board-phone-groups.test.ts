// A list tab on a phone shows Cards unless Board is picked by hand, and a
// board section draws a heading over each run of rows of one kind (a
// complication's shape).

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

import { type BoardRow, noteViewPick, phoneView, renderBoard } from "../src/library/board.js";
import { flat } from "./library-editor-home.js";

describe("Board or Cards on a phone", () => {
  it("shows Cards on a narrow screen, the kept view elsewhere", () => {
    expect(phoneView("t1", "board", true)).toBe("cards");
    expect(phoneView("t1", "board", false)).toBe("board");
    expect(phoneView("t1", "cards", false)).toBe("cards");
  });

  it("keeps Board on a phone once it is picked by hand, for that tab only", () => {
    noteViewPick("t2", "board");
    expect(phoneView("t2", "board", true)).toBe("board");
    expect(phoneView("t3", "board", true)).toBe("cards");
    noteViewPick("t2", "cards");
    expect(phoneView("t2", "board", true)).toBe("cards");
  });

  it("is what each list tab draws", () => {
    const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
    expect(read("../src/watch-pages/all-pages.ts")).toContain("phoneView(this.kind, keptView(this.kind).view)");
    expect(read("../src/watch-menus/all-menus.ts")).toContain(`phoneView("menus", keptView().view)`);
    expect(read("../src/panel.ts")).toContain(`phoneView("complications", this.compView)`);
  });
});

describe("a board section's groups", () => {
  const row = (key: string, group?: string): BoardRow => ({
    key, name: key, detail: "", openTitle: "Open", onOpen: () => {}, cells: [], ...(group === undefined ? {} : { group }),
  });

  it("heads each run of rows of one kind, with how many it has", () => {
    const text = flat(renderBoard({
      label: "x", thing: "Complication", columns: [], onFocus: () => {}, focusWord: "Focus", focusTitle: () => "",
      sections: [{ key: "face", title: "Watch face", rows: [row("a", "Rectangular"), row("b", "Rectangular"), row("c", "Circular")] }],
    }));
    expect(text.match(/class="bd-group"/g)?.length).toBe(2);
    expect(text).toMatch(/Rectangular <small>2<\/small>/);
    expect(text).toMatch(/Circular <small>1<\/small>/);
  });

  it("draws no heading for rows with no kind", () => {
    const text = flat(renderBoard({
      label: "x", thing: "Page", columns: [], onFocus: () => {}, focusWord: "Order", focusTitle: () => "",
      sections: [{ key: "on", rows: [row("a"), row("b")] }],
    }));
    expect(text).not.toContain(`class="bd-group"`);
  });
});

describe("Home's drag", () => {
  const source = readFileSync(new URL("../src/home-lineup.ts", import.meta.url), "utf8");

  it("orders pages only: a status page's order shows nowhere on the device", () => {
    expect(source).toContain(`drag: (kind, pick, index, ids) => (kind === "pages" ? this.lineDrag(kind, pick, index, ids) : undefined),`);
  });

  it("draws the lines in the order the drag would land in, and saves that order on a drop", () => {
    expect(source).toContain("order: (kind) => (this.drag?.kind === kind && this.drag.order !== undefined ? this.drag.order");
    expect(source).toContain("void this.move(held.kind, { id: held.id, before: held.order[at + 1] ?? null }, held.from);");
  });
});
