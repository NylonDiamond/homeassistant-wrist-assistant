import { describe, expect, it } from "vitest";
import { type CompCellFacts, COMP_VIEW_STORE_KEY, compCell, compLeftOutText, compNoun, compRowOrder, compWhere, readCompView, saveCompView } from "../src/complication-board.js";
import { readFileSync } from "node:fs";

const PANEL = readFileSync(new URL("../src/panel.ts", import.meta.url), "utf8");

const facts = (change: Partial<CompCellFacts> = {}): CompCellFacts => ({
  listed: true, on: false, draws: true, full: false, last: false,
  designKind: "watch", deviceKind: "watch", deviceName: "Chen Watch", lockShape: true, shelfName: "Not on a device",
  ...change,
});

describe("where a design sits on the Complications board", () => {
  it("puts a watch shape on a watch face, the same shape on an iPhone on its Lock Screen, and Home Screen sizes on the Home Screen", () => {
    expect(compWhere("watch", "rectangular", false)).toBe("face");
    expect(compWhere("watch", "corner", false)).toBe("face");
    expect(compWhere("iphone", "rectangular", false)).toBe("lock");
    expect(compWhere("iphone", "inline", false)).toBe("lock");
    expect(compWhere("iphone", "medium", false)).toBe("home");
    // On no device yet: it could go on a watch face or a Lock Screen, and
    // is filed under the watch face.
    expect(compWhere("library", "circular", false)).toBe("face");
    expect(compWhere("library", "small", false)).toBe("home");
  });

  it("puts a control with no shape under Control Center, and a design with neither apart", () => {
    expect(compWhere("watch", undefined, true)).toBe("control");
    expect(compWhere("iphone", undefined, false)).toBe("other");
  });

  it("orders a section's rows by shape, then by name without case", () => {
    const rows = [
      { family: "inline" as const, name: "a" },
      { family: "rectangular" as const, name: "porch" },
      { family: "rectangular" as const, name: "Kitchen" },
      { name: "control" },
    ];
    expect([...rows].sort(compRowOrder).map((r) => r.name)).toEqual(["Kitchen", "porch", "a", "control"]);
  });
});

describe("one box on the Complications board", () => {
  it("ticks a device the design is on, and a click takes it off, keeping the last copy under Not on a device", () => {
    expect(compCell(facts({ on: true }))).toEqual({ on: true, next: false, title: "Take it off Chen Watch. A face or widget already using it keeps it." });
    expect(compCell(facts({ on: true, last: true })).title).toBe("Take it off Chen Watch. It stays in your list, under Not on a device.");
  });

  it("puts it on a device that draws the shape, on an iPhone's Lock Screen for a design on no device", () => {
    expect(compCell(facts())).toEqual({ on: false, next: true, title: "Put it on Chen Watch." });
    expect(compCell(facts({ designKind: "library", deviceKind: "iphone", deviceName: "Jesse iPhone" })).title).toBe("Put it on Jesse iPhone's Lock Screen.");
    expect(compCell(facts({ designKind: "library", deviceKind: "iphone", lockShape: false })).title).toBe("Put it on Chen Watch.");
  });

  it("draws a dash for the other kind of device, saying Duplicate as is the way there", () => {
    const watchDesign = compCell(facts({ listed: false, deviceKind: "iphone", deviceName: "Jesse iPhone" }));
    expect(watchDesign.dash).toBe("A watch complication. To have it on Jesse iPhone, open it and use Duplicate as.");
    expect(watchDesign.next).toBeUndefined();
    expect(compCell(facts({ listed: false, designKind: "iphone" })).dash).toBe("An iPhone widget. To have it on Chen Watch, open it and use Duplicate as.");
  });

  it("says full, or update app, where a tick cannot land, and draws a dash where the app never draws the shape", () => {
    const full = compCell(facts({ full: true }));
    expect(full).toMatchObject({ on: false, note: "full", noteWarn: true });
    expect(full.next).toBeUndefined();
    const old = compCell(facts({ draws: false, tooOld: "Update the app on this watch." }));
    expect(old).toMatchObject({ note: "update app", noteWarn: true, title: "Update the app on this watch." });
    expect(old.next).toBeUndefined();
    expect(compCell(facts({ draws: false })).dash).toBe("Chen Watch does not draw this shape.");
  });
});

describe("a focused device on the Complications board", () => {
  it("counts complications on a watch and widgets on an iPhone", () => {
    expect(compNoun("watch", 1)).toBe("complication");
    expect(compNoun("watch", 3)).toBe("complications");
    expect(compNoun("iphone", 2)).toBe("widgets");
  });

  it("says how many of the other kind it leaves out, and nothing when none", () => {
    expect(compLeftOutText("watch", 0)).toBeUndefined();
    expect(compLeftOutText("watch", 1)).toBe("1 iPhone widget is not listed: a watch cannot show it.");
    expect(compLeftOutText("iphone", 2)).toBe("2 watch complications are not listed: an iPhone cannot show them.");
  });
});

describe("Board or Cards", () => {
  it("starts on the board and keeps Cards once picked", () => {
    const held = new Map<string, string>();
    const storage = () => ({ getItem: (k: string) => held.get(k) ?? null, setItem: (k: string, v: string) => { held.set(k, v); } }) as unknown as Storage;
    expect(readCompView(storage)).toBe("board");
    saveCompView(storage, "cards");
    expect(held.get(COMP_VIEW_STORE_KEY)).toBe("cards");
    expect(readCompView(storage)).toBe("cards");
    expect(readCompView(() => { throw new Error("off"); })).toBe("board");
  });
});

describe("the panel's Complications board", () => {
  it("draws the board on the list page unless Cards is picked, and always on a focused device", () => {
    expect(PANEL).toContain(`const board = focus !== undefined || this.compView === "board";`);
    expect(PANEL).toContain(`board ? this.renderCompBoard(focus) : this.renderPickerSurface("page")`);
  });

  it("ticks through the cards' own writes, quietly, and says Saved when nothing went wrong", () => {
    expect(PANEL).toContain("if (on) await this.addRowTo(it.row, place.owner, true);");
    expect(PANEL).toContain("else await this.removeRowFrom(it.row, place, true);");
    expect(PANEL).toContain("if (this.saveError === undefined && this.copyStatus === said) this.flashCompSaved();");
  });

  it("lists under a focused device only what could go on it: a box there, never a dash", () => {
    expect(PANEL).toContain("const fits = (it: CompBoardItem) => it.locked === undefined && this.compBoardCell(it, device, false).chip !== undefined;");
  });

  it("moves a watch's old Complications and Control Center addresses to its board column", () => {
    expect(PANEL).toContain(`if (screen.id === "watch-complications" || screen.id === "control-center") {`);
    expect(PANEL).toContain("return listFocusPath(COMPLICATIONS_PATH, this.sharedWatch);");
  });
});
