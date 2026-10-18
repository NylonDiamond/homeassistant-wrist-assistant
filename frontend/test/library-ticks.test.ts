// The device ticks on a library card: square for pages and status pages,
// round for menus, "Add to this watch" on a device tab's rest, the asked
// state while a write is out, and the reasons a tick cannot be clicked.

import { describe, expect, it } from "vitest";

import { libraryOf } from "../src/library/model.js";
import { pendingKey } from "../src/library/store.js";
import { chipsFold } from "../src/library/chip-row.js";
import { TICK_ADMIN_TEXT, type TickChip, renderTickChips, renderTicks, tickChips, tickSkipsText, tickSkipsTitle, type TicksInput } from "../src/library/ticks.js";
import { CHEN, CHEN_MENU, DEVICES, HOME_MENU, JESSE, LIGHTS, LONELY, PAGE1, PHONE, QUICK, summary } from "./library-fixture.js";

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

const colors: Record<string, string> = { [CHEN]: "var(--wa-person-1)", [JESSE]: "var(--wa-person-2)", [PHONE]: "var(--wa-person-3)" };

function input(over: Partial<TicksInput>): TicksInput {
  return { library: libraryOf(summary()), kind: "pages", itemId: PAGE1, devices: DEVICES, colorOf: (o) => colors[o], admin: true, ...over };
}

describe("tickChips", () => {
  it("ticks the devices that have a page, square, with Hide here dimmed", () => {
    const chips = tickChips(input({}));
    expect(chips.map((c) => [c.label, c.on, c.hidden, c.shape, c.next])).toEqual([
      ["Chen Watch", false, false, "square", true],
      ["Jesse Apple Watch", true, true, "square", false],
      ["iPhone 15 Pro", true, false, "square", false],
    ]);
    expect(chips[0]!.title).toBe("Not on Chen Watch. Tick to put the page there.");
    expect(chips[1]!.title).toBe("On Jesse Apple Watch, hidden there. Untick to take the page off it.");
    expect(chips[2]!.color).toBe("var(--wa-person-3)");
  });

  it("makes menu ticks round: an unticked one moves the device, a ticked one does nothing", () => {
    const chips = tickChips(input({ kind: "menus", itemId: HOME_MENU }));
    expect(chips.map((c) => [c.name, c.on, c.shape, c.next])).toEqual([
      ["Chen Watch", false, "round", true],
      ["Jesse Apple Watch", true, "round", undefined],
      ["iPhone 15 Pro", true, "round", undefined],
    ]);
    expect(chips[0]!.title).toBe("Use this menu on Chen Watch.");
    expect(chips[1]!.title).toBe("Jesse Apple Watch uses this menu. To change that, pick another Anywhere menu for it.");
  });

  it("on a device tab's rest, shows the item's devices then Add to this watch", () => {
    const chips = tickChips(input({ itemId: LIGHTS, addFor: JESSE }));
    expect(chips.map((c) => [c.label, c.on, c.add, c.next])).toEqual([
      ["Chen Watch", true, false, false],
      ["Add to this watch", false, true, true],
    ]);
    const phone = tickChips(input({ itemId: LIGHTS, addFor: PHONE }));
    expect(phone[1]!.label).toBe("Add to this iPhone");
  });

  it("shows the state asked for while a write is out, and no click", () => {
    const pending = new Map([[pendingKey("pages", CHEN, PAGE1), { on: true }]]);
    const chip = tickChips(input({ pending }))[0]!;
    expect([chip.on, chip.busy, chip.next, chip.title]).toEqual([true, true, undefined, "Saving…"]);
  });

  it("moves a menu's tick to the asked menu while its write is out", () => {
    const pending = new Map([[pendingKey("menus", CHEN, "anywhere"), { menuId: HOME_MENU }]]);
    const target = tickChips(input({ kind: "menus", itemId: HOME_MENU, pending }))[0]!;
    const old = tickChips(input({ kind: "menus", itemId: CHEN_MENU, pending }))[0]!;
    const other = tickChips(input({ kind: "menus", itemId: QUICK, pending }))[0]!;
    expect([target.on, target.busy]).toEqual([true, true]);
    expect([old.on, old.busy]).toEqual([false, true]);
    expect([other.on, other.busy]).toEqual([true, false]);
  });

  it("locks a device the caller says cannot take it, and an unpicked item for anyone but an administrator", () => {
    const locked = tickChips(input({ locked: (o) => (o === CHEN ? "Waiting for the iPhone." : undefined) }));
    expect([locked[0]!.next, locked[0]!.stuck, locked[0]!.title]).toEqual([undefined, "Waiting for the iPhone.", "Waiting for the iPhone."]);
    expect(locked[1]!.next).toBe(false);
    const lonely = tickChips(input({ itemId: LONELY, admin: false }));
    expect(lonely.every((c) => c.next === undefined && c.stuck === TICK_ADMIN_TEXT)).toBe(true);
    expect(tickChips(input({ itemId: LONELY, admin: true })).every((c) => c.next === true)).toBe(true);
  });
});

describe("renderTicks", () => {
  it("draws a chip per device with its state classes and the item's note", () => {
    const text = flat(renderTicks(input({ note: "That is not in the library any more." }), () => undefined));
    expect(text).toContain("lt-chip off");
    expect(text).toContain("lt-chip on");
    expect(text).toContain("dim");
    expect(text).toContain("<em>hidden</em>");
    expect(text).toContain("--dc:var(--wa-person-1)");
    expect(text).toContain("That is not in the library any more.");
    expect(text).not.toContain("Used by");
  });

  it("puts Used by over a menu's round ticks", () => {
    const text = flat(renderTicks(input({ kind: "menus", itemId: QUICK }), () => undefined));
    expect(text).toContain("Used by");
    expect(text).toContain(" rd ");
    expect(flat(renderTicks(input({ kind: "menus", itemId: QUICK, hint: false }), () => undefined))).not.toContain("Used by");
  });

  it("asks for the tick's next state on a click, and nothing for a ticked menu", () => {
    const asked: [string, boolean][] = [];
    const clicks = (tpl: unknown): ((e: Event) => void)[] => {
      const out: ((e: Event) => void)[] = [];
      const walk = (v: unknown) => {
        if (Array.isArray(v)) v.forEach(walk);
        else if (v !== null && typeof v === "object" && "values" in v) (v as { values: unknown[] }).values.forEach(walk);
        else if (typeof v === "function") out.push(v as (e: Event) => void);
      };
      walk(tpl);
      return out;
    };
    const event = { stopPropagation: () => undefined } as unknown as Event;
    // The first handler is the row's own, which only stops the click; then
    // the three inline chips, the fold's toggle, and the fold's three.
    const all = clicks(renderTicks(input({}), (o, on) => asked.push([o, on])));
    expect(all).toHaveLength(8);
    all.slice(1, 4).forEach((fn) => fn(event));
    expect(asked).toEqual([[CHEN, true], [JESSE, false], [PHONE, false]]);
    asked.length = 0;
    all.slice(5).forEach((fn) => fn(event));
    expect(asked).toEqual([[CHEN, true], [JESSE, false], [PHONE, false]]);
    asked.length = 0;
    clicks(renderTicks(input({ kind: "menus", itemId: HOME_MENU }), (o, on) => asked.push([o, on]))).slice(1, 4).forEach((fn) => fn(event));
    expect(asked).toEqual([[CHEN, true]]);
  });
});

describe("renderTickChips", () => {
  const chip = (ownerId: string, on: boolean, over: Partial<TickChip> = {}): TickChip => ({
    ownerId, name: ownerId, device: "watch", color: undefined, shape: "square", on, hidden: false, busy: false, add: false,
    label: ownerId, title: ownerId, next: !on, ...over,
  });
  const opts = { foldLabel: "Add to a device" };
  /** The fold's popover markup: everything after the pop's opening tag. */
  const pop = (text: string) => text.slice(text.indexOf("lt-fold-pop"));

  it("keeps the fold in the DOM, inside the measuring row, while a device has it off", () => {
    const text = flat(renderTickChips([chip("a", true), chip("b", false), chip("c", true)], opts, () => undefined));
    expect(text).toContain(`<wa-chip-row class="lt-chips" role="group"`);
    expect(text).toContain(`<details class="lt-fold"`);
    expect(text.indexOf(`<details class="lt-fold"`)).toBeLessThan(text.indexOf("</wa-chip-row>"));
    expect(text).toContain("+ Add to a device");
    // However many devices there are, folding is the row's measurement,
    // never a count in the markup.
    const six = ["a", "b", "c", "d", "e", "f"].map((o, i) => chip(o, i === 0));
    expect(flat(renderTickChips(six, opts, () => undefined))).not.toContain("folded");
  });

  it("draws no fold when every device has it, or only the dashed Add chip is off", () => {
    expect(flat(renderTickChips([chip("a", true), chip("b", true)], opts, () => undefined))).not.toContain("lt-fold");
    expect(flat(renderTickChips([chip("a", true), chip("b", false, { add: true })], opts, () => undefined))).not.toContain("lt-fold");
  });

  it("holds every chip in the popover, on and off, with its tag", () => {
    const text = flat(renderTickChips([chip("a", true), chip("b", false, { tag: "full" }), chip("c", false)], opts, () => undefined));
    const inPop = pop(text);
    expect(inPop.match(/class="lt-chip /g)).toHaveLength(3);
    expect(inPop).toContain("lt-chip on");
    expect(inPop).toContain("lt-chip off");
    expect(inPop).toContain("<em>full</em>");
  });

  it("says Use on a device for menus and Add to a device for pages", () => {
    expect(flat(renderTicks(input({ kind: "menus", itemId: HOME_MENU }), () => undefined))).toContain("+ Use on a device");
    expect(flat(renderTicks(input({}), () => undefined))).toContain("+ Add to a device");
  });
});

describe("chipsFold", () => {
  it("keeps chips that fit the line exactly", () => {
    expect(chipsFold([100, 120, 80], 6, 312)).toBe(false);
  });

  it("folds one pixel over the line", () => {
    expect(chipsFold([100, 120, 80], 6, 311)).toBe(true);
  });

  it("never folds an empty row", () => {
    expect(chipsFold([], 6, 0)).toBe(false);
  });

  it("counts the gap between chips only, not before the first or after the last", () => {
    expect(chipsFold([200], 50, 200)).toBe(false);
    expect(chipsFold([100, 100], 10, 210)).toBe(false);
    expect(chipsFold([100, 100], 10, 209)).toBe(true);
  });
});

describe("the tiles a watch skips", () => {
  it("count on each ticked watch's chip, never an unticked watch's or the iPhone's, and the tooltip names them", () => {
    const chips = tickChips(input({ skips: ["Map", "Garden"] }));
    expect(chips.map((c) => [c.name, c.on, c.skips?.text])).toEqual([
      ["Chen Watch", false, undefined],
      ["Jesse Apple Watch", true, "skips 2"],
      ["iPhone 15 Pro", true, undefined],
    ]);
    expect(chips[1]!.skips!.title).toBe("Jesse Apple Watch skips Map and Garden: only an iPhone shows them.");
    // The chip's own tooltip keeps what a click does, then the tiles.
    expect(chips[1]!.title).toBe("On Jesse Apple Watch, hidden there. Untick to take the page off it. Jesse Apple Watch skips Map and Garden: only an iPhone shows them.");
    // A watch without the page skips nothing.
    expect(chips[0]!.title).toBe("Not on Chen Watch. Tick to put the page there.");
    expect(chips[2]!.title).toBe("On iPhone 15 Pro. Untick to take the page off it.");
    // Nor does a watch's "Add to this watch" chip; a tick asked for counts.
    const add = tickChips(input({ itemId: LIGHTS, addFor: JESSE, skips: ["Map"] }));
    expect(add.map((c) => [c.label, c.skips?.text])).toEqual([["Chen Watch", "skips 1"], ["Add to this watch", undefined]]);
    const pending = new Map([[pendingKey("pages", CHEN, PAGE1), { on: true }]]);
    expect(tickChips(input({ pending, skips: ["Map"] }))[0]!.skips?.text).toBe("skips 1");
  });

  it("add nothing for a page a watch draws whole, or for a menu or a status page", () => {
    expect(tickChips(input({})).every((c) => c.skips === undefined)).toBe(true);
    expect(tickChips(input({ skips: [] })).every((c) => c.skips === undefined)).toBe(true);
    expect(tickChips(input({ kind: "menus", itemId: HOME_MENU, skips: ["Map"] })).every((c) => c.skips === undefined)).toBe(true);
    expect(tickChips(input({ kind: "status_pages", itemId: PAGE1, skips: ["Map"] })).every((c) => c.skips === undefined)).toBe(true);
  });

  it("say the contract's words: skips and the count, the tiles in the tooltip, four at most", () => {
    expect(tickSkipsText(1)).toBe("skips 1");
    expect(tickSkipsText(2)).toBe("skips 2");
    expect(tickSkipsTitle("Den Watch", ["Map"])).toBe("Den Watch skips Map: only an iPhone shows it.");
    expect(tickSkipsTitle("Den Watch", ["Map", "Chart", "Notes", "Web card"])).toBe("Den Watch skips Map, Chart, Notes and Web card: only an iPhone shows them.");
    expect(tickSkipsTitle("Den Watch", ["Map", "Chart", "Notes", "Web card", "Garden"])).toBe("Den Watch skips Map, Chart, Notes and 2 more: only an iPhone shows them.");
  });

  it("draw the count inside the chip, in the strip's line and in the fold's popover, so the fold measures the wider chip", () => {
    const text = flat(renderTicks(input({ skips: ["Map", "Garden"] }), () => undefined));
    const em = `<em class="lt-skips" title=Jesse Apple Watch skips Map and Garden: only an iPhone shows them.>skips 2</em>`;
    // In the chip's button, after its name: the row measures each chip's
    // own width (chip-row.ts), so the count is part of what it adds up. A
    // hidden watch says both.
    expect(text).toContain(`Jesse Apple Watch</span><em>hidden</em>${em}</button>`);
    // The one ticked watch, in the line and in the popover.
    const line = text.slice(0, text.indexOf("lt-fold-pop"));
    expect(line.split(">skips 2</em></button>").length - 1).toBe(1);
    expect(text.slice(text.indexOf("lt-fold-pop")).split(">skips 2</em></button>").length - 1).toBe(1);
    // Chips that fit the strip without the count fold with it.
    expect(chipsFold([120, 140, 110], 6, 382)).toBe(false);
    expect(chipsFold([120 + 44, 140 + 44, 110], 6, 382)).toBe(true);
  });
});
