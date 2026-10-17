// The device ticks on a library card: square for pages and status pages,
// round for menus, "Add to this watch" on a device tab's rest, the asked
// state while a write is out, and the reasons a tick cannot be clicked.

import { describe, expect, it } from "vitest";

import { libraryOf } from "../src/library/model.js";
import { pendingKey } from "../src/library/store.js";
import { TICK_ADMIN_TEXT, renderTicks, tickChips, type TicksInput } from "../src/library/ticks.js";
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
    // The first handler is the row's own, which only stops the click.
    const page = clicks(renderTicks(input({}), (o, on) => asked.push([o, on]))).slice(1);
    page.forEach((fn) => fn(event));
    expect(asked).toEqual([[CHEN, true], [JESSE, false], [PHONE, false]]);
    asked.length = 0;
    clicks(renderTicks(input({ kind: "menus", itemId: HOME_MENU }), (o, on) => asked.push([o, on]))).slice(1).forEach((fn) => fn(event));
    expect(asked).toEqual([[CHEN, true]]);
  });
});
