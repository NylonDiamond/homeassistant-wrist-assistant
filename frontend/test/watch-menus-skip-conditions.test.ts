// Skip conditions on an Entity quick menu slot that triggers an automation
// (`automationSkipConditionOverride`), as the phone's slot editor had it:
// Default leaves the key out, Skip writes `true`, Don't skip `false`, shown
// only for `automationTrigger` and never in the Anywhere menu.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { HassLike } from "../src/ha-api.js";
import { SymbolBrowser } from "../src/symbols.js";
import { type MenusViewHost, menuSlotChanged, renderMenuInspector, selectMenu } from "../src/watch-menus/menu-view.js";
import {
  ANYWHERE,
  type MenuListRef,
  type MenusDocument,
  setWatchMenuSlotSkipConditions,
  watchMenuSlotHasSkipConditions,
  watchMenuSlotSkipConditions,
  watchMenuSlots,
  withWatchMenuSlots,
} from "../src/watch-menus/model.js";
import menuKeys from "../src/watch-menus/menu-keys.json";

type Json = Record<string, unknown>;

const DEFAULTS = JSON.parse(readFileSync(join(__dirname, "fixtures-menus", "01-defaults.json"), "utf8")) as MenusDocument;

/** The defaults' Trigger slot of the automation menu. */
const TRIGGER = "3E4D0000-0000-4000-8000-00000000003C";
const AUTOMATION: MenuListRef = { list: "domain", domain: "automation" };

const slotOf = (d: MenusDocument, ref: MenuListRef, id: string): Json => watchMenuSlots(d, ref).find((s) => s.id === id)!;

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

/** Every template under `v`. */
function templates(v: unknown, out: { strings: readonly string[]; values: unknown[] }[] = []) {
  if (Array.isArray(v)) for (const x of v) templates(x, out);
  else if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const t = v as { strings: readonly string[]; values: unknown[] };
    out.push(t);
    for (const x of t.values) templates(x, out);
  }
  return out;
}

const NO_ICONS = { render: () => undefined, available: () => false, names: () => [] } as unknown as MenusViewHost["icons"];

/** A host on the Entity quick menu's automation list with the Trigger slot
 * selected; `edits` collects what each edit makes of the document. */
function host(document: MenusDocument) {
  const edits: MenusDocument[] = [];
  const h: MenusViewHost = {
    hass: { states: {} } as unknown as HassLike,
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    document,
    targets: { pages: [], statusPages: [], httpActions: [] },
    catalogKnown: true,
    busy: false,
    uiState: new Map(),
    screen: { width: 208, height: 248 },
    scale: 1.5,
    switcherPages: [],
    edit: (change: (d: MenusDocument) => MenusDocument) => {
      edits.push(change(document));
      return true;
    },
    endCoalesce: () => undefined,
    requestUpdate: () => undefined,
  } as unknown as MenusViewHost;
  selectMenu(h, "entity");
  h.uiState.set("me:er:domain", "automation");
  h.uiState.set("me:sel:domain:automation", TRIGGER);
  return { h, edits };
}

/** Press a choice of the Skip conditions control, by its words. */
function press(h: MenusViewHost, words: string): void {
  const field = templates(renderMenuInspector(h)).filter((t) => flat(t).includes("aria-label=Skip conditions"))
    .sort((a, b) => flat(a).length - flat(b).length)[0]!;
  const buttons = templates(field).filter((t) => t.strings.join("").includes("<button") && t.values.some((v) => typeof v === "function"));
  const button = buttons.find((t) => flat(t).includes(`>${words}</button>`));
  if (button === undefined) throw new Error(`no button for ${words}`);
  (button.values.find((v) => typeof v === "function") as (e: unknown) => void)({ currentTarget: null });
}

describe("the slot key", () => {
  it("is listed for an entity menu slot and an Anywhere slot in menu-keys.json", () => {
    const types = (menuKeys as unknown as { types: Record<string, { keys: Record<string, Json> }> }).types;
    const holding = Object.entries(types).filter(([, t]) => Object.hasOwn(t.keys, "automationSkipConditionOverride")).map(([n]) => n);
    expect(holding.length).toBeGreaterThanOrEqual(2);
    for (const name of holding) expect(types[name]!.keys.automationSkipConditionOverride!.type).toBe("bool");
  });
});

describe("setWatchMenuSlotSkipConditions", () => {
  it("Skip writes true, Don't skip writes false, Default removes the key", () => {
    const skip = setWatchMenuSlotSkipConditions(DEFAULTS, AUTOMATION, TRIGGER, true);
    expect(slotOf(skip, AUTOMATION, TRIGGER).automationSkipConditionOverride).toBe(true);
    const dont = setWatchMenuSlotSkipConditions(skip, AUTOMATION, TRIGGER, false);
    expect(slotOf(dont, AUTOMATION, TRIGGER).automationSkipConditionOverride).toBe(false);
    const back = setWatchMenuSlotSkipConditions(dont, AUTOMATION, TRIGGER, null);
    expect(Object.hasOwn(slotOf(back, AUTOMATION, TRIGGER), "automationSkipConditionOverride")).toBe(false);
    expect(slotOf(back, AUTOMATION, TRIGGER)).toEqual(slotOf(DEFAULTS, AUTOMATION, TRIGGER));
    // Default with no key: the document as given.
    expect(setWatchMenuSlotSkipConditions(DEFAULTS, AUTOMATION, TRIGGER, null)).toBe(DEFAULTS);
  });

  it("keeps the slot's other keys, unknown ones too", () => {
    const slots = watchMenuSlots(DEFAULTS, AUTOMATION).map((s) => (s.id === TRIGGER ? { ...s, zzFuture: { a: 1 } } : s));
    const d = withWatchMenuSlots(DEFAULTS, AUTOMATION, slots);
    const next = slotOf(setWatchMenuSlotSkipConditions(d, AUTOMATION, TRIGGER, false), AUTOMATION, TRIGGER);
    expect(next.zzFuture).toEqual({ a: 1 });
    const { automationSkipConditionOverride: _o, ...rest } = next;
    expect(rest).toEqual(slotOf(d, AUTOMATION, TRIGGER));
  });

  it("reads Default for an absent key or one that is not a boolean", () => {
    expect(watchMenuSlotSkipConditions({})).toBeNull();
    expect(watchMenuSlotSkipConditions({ automationSkipConditionOverride: "yes" })).toBeNull();
    expect(watchMenuSlotSkipConditions({ automationSkipConditionOverride: false })).toBe(false);
  });

  it("refuses a slot that is not an automation trigger, an Anywhere slot, and a value that is not a boolean", () => {
    const other = watchMenuSlots(DEFAULTS, AUTOMATION).find((s) => (s.action as Json).type !== "automationTrigger")!;
    expect(setWatchMenuSlotSkipConditions(DEFAULTS, AUTOMATION, other.id as string, true)).toBe(DEFAULTS);
    const anywhere = watchMenuSlots(DEFAULTS, ANYWHERE)[0]!;
    expect(setWatchMenuSlotSkipConditions(DEFAULTS, ANYWHERE, anywhere.id as string, true)).toBe(DEFAULTS);
    expect(watchMenuSlotHasSkipConditions(ANYWHERE, { action: { type: "automationTrigger" } })).toBe(false);
    expect(setWatchMenuSlotSkipConditions(DEFAULTS, AUTOMATION, TRIGGER, "yes" as unknown as boolean)).toBe(DEFAULTS);
  });
});

describe("the Slot card", () => {
  it("shows Skip conditions for the Trigger slot, at Default", () => {
    const text = flat(renderMenuInspector(host(DEFAULTS).h));
    expect(text).toContain("Skip conditions");
    expect(text).toContain(">Default<");
    expect(text).toContain(">Skip<");
    expect(text).toContain(">Don't skip<");
    const hint = text.slice(text.indexOf("Whether running the automation from this menu"));
    expect(hint.slice(0, hint.indexOf("</div>"))).not.toMatch(/[\u2013\u2014]| - /);
  });

  it("not for another action, nor in the Anywhere menu", () => {
    const { h } = host(DEFAULTS);
    const other = watchMenuSlots(DEFAULTS, AUTOMATION).find((s) => (s.action as Json).type !== "automationTrigger")!;
    h.uiState.set("me:sel:domain:automation", other.id);
    expect(flat(renderMenuInspector(h))).not.toContain("Skip conditions");
    selectMenu(h, "anywhere");
    h.uiState.set("me:sel:anywhere", watchMenuSlots(DEFAULTS, ANYWHERE)[0]!.id);
    expect(flat(renderMenuInspector(h))).not.toContain("Skip conditions");
  });

  it("each choice writes its value, Default removes the key", () => {
    const { h, edits } = host(DEFAULTS);
    press(h, "Skip");
    expect(slotOf(edits.at(-1)!, AUTOMATION, TRIGGER).automationSkipConditionOverride).toBe(true);
    press(h, "Don't skip");
    expect(slotOf(edits.at(-1)!, AUTOMATION, TRIGGER).automationSkipConditionOverride).toBe(false);
    const held = host(setWatchMenuSlotSkipConditions(DEFAULTS, AUTOMATION, TRIGGER, true));
    press(held.h, "Default");
    expect(Object.hasOwn(slotOf(held.edits.at(-1)!, AUTOMATION, TRIGGER), "automationSkipConditionOverride")).toBe(false);
  });

  it("marks the Slot card changed while the slot holds its own choice", () => {
    expect(menuSlotChanged(slotOf(DEFAULTS, AUTOMATION, TRIGGER), AUTOMATION)).toBe(false);
    const d = setWatchMenuSlotSkipConditions(DEFAULTS, AUTOMATION, TRIGGER, false);
    expect(menuSlotChanged(slotOf(d, AUTOMATION, TRIGGER), AUTOMATION)).toBe(true);
  });
});
