// The board from the 2026-10-31 review: one Focus pill per column, sticky heads
// apart from the table, a density remembered per browser, a legend, numbers in
// the focused column, an "Update app" badge with dashes, greyed columns with one
// line under the heading, and the words a box's tooltip and a big picture say.

import { afterEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

import {
  BOARD_DENSITY_STORE_KEY,
  type BoardColumn,
  type BoardInput,
  boardBoxTitle,
  boardColumnBlock,
  boardDensity,
  boardStyles,
  columnsPastEdge,
  moreDevicesText,
  renderBoard,
  renderDensitySwitch,
  renderFocusBanner,
  resetBoardDensity,
  setBoardDensity,
} from "../src/library/board.js";
import type { TickChip } from "../src/library/ticks.js";
import { ordinalText, peekWhereText, restHint, restTitle } from "../src/watch-pages/all-pages-model.js";
import type { LinkDevice } from "../src/watch-pages/devices.js";
import { flat } from "./library-editor-home.js";

const WATCH: LinkDevice = { ownerId: "w1", name: "Apple Watch", kind: "watch" };
const CHEN: LinkDevice = { ownerId: "w2", name: "Chen Watch", kind: "watch" };
const PHONE: LinkDevice = { ownerId: "p1", name: "iPhone 17 Pro", kind: "iphone" };

const column = (device: LinkDevice, count = 0): BoardColumn => ({ device, color: "var(--wa-person-1)", count });

const chip = (over: Partial<TickChip> = {}): TickChip => ({
  ownerId: "w2", name: "Chen Watch", device: "watch", color: undefined, shape: "square", on: false, hidden: false, busy: false, add: false,
  label: "Chen Watch", title: "Not on Chen Watch. Tick to put the page there.", next: true, ...over,
});

const input = (over: Partial<BoardInput> = {}): BoardInput => ({
  label: "Pages on each device", thing: "Page", columns: [column(WATCH, 9), column(CHEN, 2)], onFocus: () => {}, focusTitle: (d) => `Show ${d.name}'s pages first`,
  sections: [{ key: "all", rows: [] }], density: "compact", ...over,
});

afterEach(() => resetBoardDensity());

describe("a board's density", () => {
  const store = (held?: string) => {
    let now = held;
    return { getItem: () => now ?? null, setItem: (_k: string, v: string) => { now = v; } };
  };

  it("is Compact unless Large was picked in this browser", () => {
    expect(boardDensity(() => store())).toBe("compact");
    resetBoardDensity();
    expect(boardDensity(() => store("large"))).toBe("large");
    resetBoardDensity();
    expect(boardDensity(() => store("nonsense"))).toBe("compact");
  });

  it("is remembered when picked, and holds with storage off", () => {
    const held = store();
    setBoardDensity("large", () => held);
    expect(held.getItem()).toBe("large");
    resetBoardDensity();
    expect(boardDensity(() => held)).toBe("large");
    setBoardDensity("compact", () => { throw new Error("off"); });
    expect(boardDensity(() => { throw new Error("off"); })).toBe("compact");
    expect(BOARD_DENSITY_STORE_KEY).toBe("wrist-assistant-panel.board-density.v1");
  });

  it("draws Compact and Large as a switch, the one in use pressed", () => {
    const text = flat(renderDensitySwitch("compact", () => {}));
    expect(text).toMatch(/bd-view-opt on"[^>]*aria-pressed=true[\s\S]*<span>Compact<\/span>/);
    expect(text).toMatch(/aria-pressed=false[\s\S]*<span>Large<\/span>/);
  });

  it("marks both the frame and the table, and in Compact leaves the big-screen look out", () => {
    expect(flat(renderBoard(input({ wide: true })))).toMatch(/class="bd-frame compact\s+"/);
    expect(flat(renderBoard(input({ density: "large", wide: true })))).toMatch(/class="bd-frame large\s+wide"/);
    expect(flat(renderBoard(input()))).toContain(`<table class="bd compact`);
  });

  it("caps Compact's first column at 320 px and draws 46 px rows", () => {
    const sheet = boardStyles.cssText;
    expect(sheet).toMatch(/\.bd-frame\.compact \{[^}]*--bd-first-track: 320px/);
    expect(sheet).toContain(".compact .bd-row { height: 46px; }");
  });
});

describe("a board's column heads", () => {
  it("are apart from the table, in a strip that sticks, with the names still in the table for a screen reader", () => {
    const text = flat(renderBoard(input()));
    expect(text.indexOf(`class="bd-pin"`)).toBeLessThan(text.indexOf(`class="bd-scroll"`));
    expect(text).toContain(`<wa-board-frame`);
    expect(text).toMatch(/<thead class="bd-thead">[\s\S]*bd-sr">Apple Watch</);
    expect(boardStyles.cssText).toMatch(/\.bd-pin \{ position: sticky; top: var\(--bd-pin-top/);
  });

  it("have one Focus pill each, with no chevron, and the focused one filled with a way out", () => {
    const text = flat(renderBoard(input({ focus: "w1" })));
    expect(text.match(/class="bd-focus-pill /g)).toHaveLength(2);
    expect(text).toContain("<span>Focused</span>");
    expect(text).toContain("aria-label=Stop focusing Apple Watch");
    expect(text).toContain("aria-label=Focus Chen Watch");
    expect(text).toContain("title=Show every device");
    expect(text).toContain("title=Show Chen Watch's pages first");
    expect(text).not.toContain("bd-col-go");
  });

  it("say Update app on a device that cannot take any, with why", () => {
    const blocked = boardColumnBlock("1.0.0", "Needs a newer app.");
    expect(blocked).toEqual({ badge: "Update app", text: "Needs a newer app." });
    expect(boardColumnBlock("9.0.0", "Waiting for your iPhone.").badge).toBe("Waiting");
    const text = flat(renderBoard(input({ columns: [{ ...column(CHEN), blocked }] })));
    expect(text).toContain(`class="bd-upd" title=Needs a newer app.`);
    expect(text).toMatch(/Update app/);
  });

  it("count the columns past a narrow board's right edge, those more than half gone", () => {
    const cols = [{ left: 300, right: 400 }, { left: 400, right: 500 }, { left: 460, right: 560 }, { left: 520, right: 620 }, { left: 620, right: 720 }];
    expect(columnsPastEdge(cols, 500)).toBe(3);
    expect(columnsPastEdge(cols, 520)).toBe(2);
    expect(columnsPastEdge(cols, 800)).toBe(0);
    expect(moreDevicesText(2)).toBe("+2 devices");
    expect(moreDevicesText(1)).toBe("+1 device");
  });
});

describe("a board's legend", () => {
  it("says what the box, Focus and the eye do, under the heads and only when asked", () => {
    expect(flat(renderBoard(input()))).not.toContain("bd-legend\"");
    const text = flat(renderBoard(input({
      legend: { tick: "on that device", focus: "a device to order its pages", eye: "hide but keep its place", saves: "Ticks save at once, with Undo" },
    })));
    expect(text).toContain("on that device");
    expect(text).toContain("<b>Focus</b> a device to order its pages");
    expect(text).toContain("hide but keep its place");
    expect(text).toContain("Ticks save at once, with Undo");
    expect(text.indexOf("bd-pin")).toBeLessThan(text.indexOf("bd-legend"));
    expect(text.indexOf("bd-legend")).toBeLessThan(text.indexOf(`class="bd-scroll"`));
  });
});

describe("a board's boxes", () => {
  const row = (cells: BoardInput["sections"][number]["rows"][number]["cells"]) => ({
    key: "a", name: "New Page 3", detail: "8 tiles", openTitle: "Open", onOpen: () => {}, cells,
  });

  it("name the device in a tooltip that says what one click does", () => {
    expect(boardBoxTitle(chip())).toBe("Put on Chen Watch");
    expect(boardBoxTitle(chip({ on: true, next: false }))).toBe("Take off Chen Watch");
    expect(boardBoxTitle(chip({ on: true, next: false, hidden: true }))).toBe("Take off Chen Watch. It is hidden there.");
    expect(boardBoxTitle(chip({ on: true, next: false, skips: { text: "skips 2", title: "Chen Watch skips Map." } }))).toBe("Take off Chen Watch. Chen Watch skips Map.");
    // What a click cannot do keeps its own words, and a menu's dot says its own.
    expect(boardBoxTitle(chip({ next: undefined, title: "Saving…" }))).toBe("Saving…");
    expect(boardBoxTitle(chip({ shape: "round", title: "Use this menu on Chen Watch." }))).toBe("Use this menu on Chen Watch.");
  });

  it("are checkboxes a screen reader can name, with a tick when on", () => {
    const text = flat(renderBoard(input({ columns: [column(CHEN)], sections: [{ key: "all", rows: [row([{ chip: chip({ on: true, next: false }) }])] }] })));
    expect(text).toContain(`role="checkbox"`);
    expect(text).toContain("aria-checked=true");
    expect(text).toContain("aria-label=New Page 3 on Chen Watch");
    expect(text).toContain("lt-tick");
  });

  it("number the focused column's ticks when the device keeps an order, and only there", () => {
    const cells = [{ chip: chip({ ownerId: "w1", name: "Apple Watch", on: true, next: false }), order: 3 }, { chip: chip() }];
    const text = flat(renderBoard(input({ focus: "w1", ordered: true, sections: [{ key: "all", rows: [row(cells)] }] })));
    expect(text).toMatch(/bd-ord" title=Number 3 on Apple Watch>3</);
    expect(text.match(/class="bd-ord"/g)).toHaveLength(1);
    expect(flat(renderBoard(input({ focus: "w1", sections: [{ key: "all", rows: [row(cells)] }] })))).not.toContain("bd-ord");
  });

  it("draw a dash, or grey with no dash, and keep why as the tooltip", () => {
    const text = flat(renderBoard(input({ columns: [column(WATCH), column(PHONE)], sections: [{
      key: "all", title: "Watch face", note: "Watch designs cannot go on an iPhone.",
      rows: [row([{ dashTitle: "Needs a newer app." }, { dashTitle: "A watch complication.", grey: true }])],
    }] })));
    expect(text).toContain(`class=bd-dash role="img" aria-label=Needs a newer app.`);
    expect(text).toContain(`class=bd-grey role="img" aria-label=A watch complication.`);
    expect(text).toContain("Watch designs cannot go on an iPhone.");
  });
});

describe("a board row's hover tools", () => {
  it("wraps Delete and ... so they show only on the row under the pointer or the keyboard", () => {
    const text = flat(renderBoard(input({ columns: [], sections: [{ key: "all", rows: [{
      key: "a", name: "Kitchen", detail: "", openTitle: "Open", onOpen: () => {}, cells: [], more: [{ label: "Open", onPick: () => {} }],
    }] }] })));
    expect(text).toContain("bd-row-acts");
    expect(text).toContain("aria-label=More for Kitchen");
    const sheet = boardStyles.cssText;
    expect(sheet).toMatch(/\.bd-row-acts \{[^}]*opacity: 0/);
    expect(sheet).toContain(".bd-row:hover .bd-row-acts, .bd-row:focus-within .bd-row-acts");
    expect(sheet).toContain("@media (hover: none) { .bd-row-acts { opacity: 1; } }");
  });
});

describe("a complication's box on the board", () => {
  const panel = readFileSync(new URL("../src/panel.ts", import.meta.url), "utf8");

  it("offers Undo after a write that landed, in the toast every tick uses", () => {
    expect(panel).toContain("offerUndo({ text: tickDoneText(name, device, true), undo: () => this.undoCompPutOn(");
    expect(panel).toContain("offerUndo({ text: tickDoneText(name, device, false), undo: () => this.undoCompTakeOff(");
  });

  it("brings an unticked copy back under its own id, from the tombstone's revision", () => {
    expect(panel).toContain("saveRecord(this.hass, ownerId, was.document, was.revision + 1)");
  });

  it("stays out of Home, which keeps its own way back", () => {
    expect(panel).toContain("await this.compBoardTick(it, place, false, false);");
    expect(panel).toContain("await this.compBoardTick(it, place, true, false);");
  });
});

describe("a focused device's banner", () => {
  it("says it comes first, what it has, and the way back to every device", () => {
    const text = flat(renderFocusBanner({ device: WATCH, color: "var(--wa-person-1)", text: "9 pages, in the order the watch shows them", onOwn: () => {}, onAll: () => {} }));
    expect(text).toContain("<b>Showing Apple Watch first</b>");
    expect(text).toContain("9 pages, in the order the watch shows them");
    expect(text).toContain("Also on this watch:");
    expect(text).toContain("<span>Show every device</span>");
    expect(text).toContain("Voice");
    const phone = flat(renderFocusBanner({ device: PHONE, color: undefined, text: "", onAll: () => {} }));
    expect(phone).not.toContain("Also on this");
  });
});

describe("the words about where a thing is", () => {
  const devices = [WATCH, CHEN, PHONE];

  it("count in ordinals", () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 23, 101, 111].map(ordinalText)).toEqual(["1st", "2nd", "3rd", "4th", "11th", "12th", "13th", "21st", "22nd", "23rd", "101st", "111th"]);
  });

  it("say where a row comes on the focused device, and who else has it", () => {
    expect(peekWhereText({ owners: ["w1", "p1"] }, devices, { device: WATCH, at: 2 })).toBe("3rd on Apple Watch, also on iPhone 17 Pro");
    expect(peekWhereText({ owners: ["w1"] }, devices, { device: WATCH, at: 0 })).toBe("1st on Apple Watch");
  });

  it("say which devices have it with none focused, or none", () => {
    expect(peekWhereText({ owners: ["W1", "w2"] }, devices)).toBe("On Apple Watch and Chen Watch");
    expect(peekWhereText({ owners: [] }, devices)).toBe("On no device yet");
    const many: LinkDevice[] = ["a", "b", "c", "d"].map((id) => ({ ownerId: id, name: id.toUpperCase(), kind: "watch" }));
    expect(peekWhereText({ owners: ["a", "b", "c", "d"] }, many)).toBe("On A, B and 2 more");
  });

  it("name the device in the second heading and its line", () => {
    expect(restTitle(WATCH)).toBe("Not on Apple Watch");
    expect(restHint(WATCH)).toBe("Tick Apple Watch to add one to the end of its order.");
  });
});
