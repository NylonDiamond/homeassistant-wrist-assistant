// The menu inspector's pictures: the Anywhere menu's Look and Motion cards,
// the page switcher's Look, the Entity quick menu's Which menu with its type
// tiles, and a picked slot's action tiles, Where grid and Shows on. Each
// writes the same key, in the same range, as the control it replaced.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { HassLike } from "../src/ha-api.js";
import { SymbolBrowser } from "../src/symbols.js";
import {
  ANYWHERE_LOOK_KEYS,
  ANYWHERE_MOTION_KEYS,
  MENU_TYPE_TILES,
  SWITCHER_LOOK_KEYS,
  beamPicture,
  menuInspectorLookStyles,
  menuStyleKeysChanged,
  whereCellLabel,
} from "../src/watch-menus/menu-inspector-look.js";
import {
  type MenusViewHost,
  menuActionTileGroups,
  menuSlotActionChanged,
  menuSlotShowsOnChanged,
  menuSlotWhereChanged,
  menuWhereCells,
  renderMenuInspector,
  selectMenu,
} from "../src/watch-menus/menu-view.js";
import {
  ANYWHERE,
  type MenuListRef,
  type MenusDocument,
  NO_MENU_TARGETS,
  moveWatchMenuSlot,
  setWatchMenuInherits,
  setWatchMenuSlotEntityTypes,
  setWatchMenuSlotVisible,
  setWatchMenuStyle,
  watchMenuShowForTypes,
  watchMenuSlots,
  watchMenuStyleFields,
} from "../src/watch-menus/model.js";

const DEFAULTS = JSON.parse(readFileSync(join(__dirname, "fixtures-menus", "01-defaults.json"), "utf8")) as MenusDocument;

/** The defaults' Anywhere slots: Refresh top left, Server Mode top right,
 * App Info right centre. */
const REFRESH = "3E4D0000-0000-4000-8000-000000000001";
const SERVER = "3E4D0000-0000-4000-8000-000000000003";
const INFO = "3E4D0000-0000-4000-8000-000000000005";
const CLIMATE: MenuListRef = { list: "domain", domain: "climate" };

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

interface Tpl {
  strings: readonly string[];
  values: unknown[];
}

function templates(node: unknown, out: Tpl[] = []): Tpl[] {
  if (Array.isArray(node)) for (const n of node) templates(n, out);
  else if (node !== null && typeof node === "object" && "strings" in node && "values" in node) {
    const t = node as Tpl;
    out.push(t);
    for (const v of t.values) templates(v, out);
  }
  return out;
}

/** The `event` handler of the smallest template whose text holds `marker`
 * and binds that event itself. */
function handler(root: unknown, marker: string, event: "click" | "change"): (e: unknown) => void {
  const found = templates(root)
    .map((t) => {
      let text = "";
      let fn: unknown;
      t.strings.forEach((part, i) => {
        text += part;
        if (i >= t.values.length) return;
        const v = t.values[i];
        if (typeof v === "function" && part.trimEnd().endsWith(`@${event}=`)) fn ??= v;
        text += flat(v);
      });
      return { text, fn };
    })
    .filter((c) => c.text.includes(marker) && c.fn !== undefined)
    .sort((a, b) => a.text.length - b.text.length);
  if (found.length === 0) throw new Error(`no @${event} handler near ${marker}`);
  return found[0]!.fn as (e: unknown) => void;
}

const NO_ICONS = { render: () => undefined, available: () => false, names: () => [] } as unknown as MenusViewHost["icons"];

/** A host whose edits apply to its document, so a draw after an edit reads
 * the edit; `edits` keeps each document an edit made. */
function host(start: MenusDocument, targets = NO_MENU_TARGETS) {
  const edits: MenusDocument[] = [];
  let document = start;
  const h = {
    hass: { states: {} } as unknown as HassLike,
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    get document() { return document; },
    targets,
    catalogKnown: true,
    busy: false,
    uiState: new Map<string, unknown>(),
    screen: { width: 208, height: 248 },
    scale: 1.5,
    switcherPages: [],
    edit: (change: (d: MenusDocument) => MenusDocument) => {
      document = change(document);
      edits.push(document);
      return true;
    },
    endCoalesce: () => undefined,
    requestUpdate: () => undefined,
  } as unknown as MenusViewHost;
  return { h, edits, doc: () => document };
}

const quick = (d: MenusDocument) => d.quickAction as Record<string, unknown>;
const slotOf = (d: MenusDocument, ref: MenuListRef, id: string) => watchMenuSlots(d, ref).find((s) => s.id === id)!;

describe("the Anywhere menu's Look and Motion", () => {
  it("hold every style key between them, each once", () => {
    const keys = watchMenuStyleFields("quickAction").map((f) => f.key).sort();
    expect([...ANYWHERE_LOOK_KEYS, ...ANYWHERE_MOTION_KEYS].sort()).toEqual(keys);
    expect(ANYWHERE_LOOK_KEYS.filter((k) => ANYWHERE_MOTION_KEYS.includes(k))).toEqual([]);
    expect([...SWITCHER_LOOK_KEYS].sort()).toEqual(watchMenuStyleFields("pageSwitcher").map((f) => f.key).sort());
  });

  it("draws Look as pictures, steps and switches in plain words", () => {
    const text = flat(renderMenuInspector(host(DEFAULTS).h));
    const look = text.slice(text.indexOf("<h4>Look</h4>"), text.indexOf("<h4>Motion</h4>"));
    expect(look).toContain(`<span class="sum">Solid, Plain buttons</span>`);
    for (const part of [">Behind the ring<", "aria-label=Behind the ring: Solid", "aria-label=Behind the ring: Glass", ">How dark<",
      ">Light</button>", ">Medium</button>", ">Full</button>", ">Exact<", ">Buttons<", "aria-label=Buttons: Plain", "aria-label=Buttons: Neon",
      ">Names under the buttons<", "Each slot's name shows under its button.", ">Glow<"]) expect(look, part).toContain(part);
    // Solid and Plain are lit at the defaults, and Full for a dim of 1.
    expect(look).toMatch(/class="mi-pic on" aria-pressed=true aria-label=Behind the ring: Solid/);
    expect(look).toMatch(/aria-checked=true\s+class=on[^>]*>Full<\/button>/);
    expect(look).not.toContain("sec-dot");
  });

  it("writes the same keys: Glass, a dim step, Neon, names under the buttons", () => {
    const { h, doc } = host(DEFAULTS);
    handler(renderMenuInspector(h), "aria-label=Behind the ring: Glass", "click")({});
    expect(quick(doc()).showIconBubble).toBe(true);
    handler(renderMenuInspector(h), ">Medium</button>", "click")({ currentTarget: null });
    expect(quick(doc()).backgroundDim).toBe(0.65);
    handler(renderMenuInspector(h), ">Light</button>", "click")({ currentTarget: null });
    expect(quick(doc()).backgroundDim).toBe(0.4);
    handler(renderMenuInspector(h), "aria-label=Buttons: Neon", "click")({});
    expect(quick(doc()).showNeonOutline).toBe(true);
    handler(renderMenuInspector(h), ">Names under the buttons<", "change")({ target: { checked: true } });
    expect(quick(doc()).showContextLabel).toBe(true);
    const text = flat(renderMenuInspector(h));
    expect(text).toContain(`<h4>Look<span class="sec-dot" aria-hidden="true"></span></h4><span class="sum">Glass, Neon buttons</span>`);
    expect(text).toMatch(/class="mi-pic on" aria-pressed=true aria-label=Behind the ring: Glass/);
  });

  it("lights no dim step for a value between them, and the slider keeps the whole range", () => {
    const text = flat(renderMenuInspector(host(setWatchMenuStyle(DEFAULTS, "quickAction", "backgroundDim", 0.5)).h));
    const dim = text.slice(text.indexOf(">How dark<"), text.indexOf(">Buttons<"));
    expect(dim).not.toMatch(/aria-checked=true/);
    expect(dim).toContain("<input type=\"range\" min=0.3 max=1 step=0.05 .value=0.5");
  });

  it("draws Motion: Opening, six beams with None first, and the beam's color and strength only with a beam", () => {
    const { h, doc } = host(DEFAULTS);
    let text = flat(renderMenuInspector(h));
    const motion = () => text.slice(text.indexOf("<h4>Motion"));
    expect(motion()).toContain(`<span class="sum">Opening none, no beam</span>`);
    for (const word of ["Spring", "Pop", "Fade", "None"]) expect(motion(), word).toContain(`>${word}</button>`);
    const beams = [...motion().matchAll(/aria-label=Beam from your finger to the slot: (\w+)/g)].map((m) => m[1]);
    expect(beams).toEqual(["None", "Wedge", "Aurora", "Bloom", "Ripple", "Wake"]);
    expect(motion()).not.toContain(">Beam color<");
    expect(motion()).not.toContain(">Beam strength<");
    expect(motion()).toContain(">Finger shadow<");
    expect(motion()).toContain("A soft dark spot where your finger rests.");
    handler(renderMenuInspector(h), "aria-label=Beam from your finger to the slot: Bloom", "click")({});
    expect(quick(doc()).beamStyle).toBe("radiantBloom");
    handler(renderMenuInspector(h), ">Pop</button>", "click")({ currentTarget: null });
    expect(quick(doc()).entranceStyle).toBe("popIn");
    text = flat(renderMenuInspector(h));
    expect(motion()).toContain(">Beam color<");
    expect(motion()).toContain(">Beam strength<");
    expect(motion()).toContain(`<span class="sum">Opening pop, bloom beam</span>`);
    // Look stays at its defaults: each card has its own dot.
    expect(menuStyleKeysChanged(doc(), "quickAction", ANYWHERE_MOTION_KEYS)).toBe(true);
    expect(menuStyleKeysChanged(doc(), "quickAction", ANYWHERE_LOOK_KEYS)).toBe(false);
  });

  it("draws each beam differently, between the same two dots", () => {
    const drawn = ["none", "sectorWedge", "auroraWash", "radiantBloom", "ripplePulse", "wakeWave"].map((s) => flat(beamPicture(s)));
    expect(new Set(drawn).size).toBe(6);
    for (const d of drawn) expect(d.match(/class="dot"/g)).toHaveLength(2);
  });
});

describe("the page switcher's Look", () => {
  it("shows the picked page's size as a percent and writes the scale", () => {
    const { h, doc } = host(DEFAULTS);
    selectMenu(h, "switcher");
    const text = flat(renderMenuInspector(h));
    expect(text).toContain(`<span class="sum">Picked page 120%</span>`);
    expect(text).toContain("<input type=\"range\" min=100 max=150 step=5 .value=120");
    const input = templates(renderMenuInspector(h)).find((t) => flat(t).includes("min=100 max=150") && t.strings.join("").includes("@input="))!;
    const onInput = input.values[input.strings.findIndex((s) => s.trimEnd().endsWith("@input="))] as (e: unknown) => void;
    onInput({ target: { value: "135" } });
    expect((doc().pageSwitcher as Record<string, unknown>).selectedScale).toBe(1.35);
  });
});

describe("the Entity quick menu's Which menu", () => {
  it("draws six type tiles, the rest in More types, which names a type that is not a tile", () => {
    const { h } = host(DEFAULTS);
    selectMenu(h, "entity");
    let text = flat(renderMenuInspector(h));
    expect(text).toContain("Each kind of thing gets its own menu. Pick one to edit it.");
    expect([...text.matchAll(/data-type=(\w+)/g)].map((m) => m[1])).toEqual([...MENU_TYPE_TILES]);
    expect(text).toMatch(/class="mi-pic mi-type on" aria-pressed=true data-type=light/);
    expect(text).toContain(">Media player</span>");
    expect(text).toContain(`<option value= ?selected=true>Pick another type</option>`);
    handler(renderMenuInspector(h), "data-type=climate", "click")({});
    expect(h.uiState.get("me:er:domain")).toBe("climate");
    h.uiState.set("me:er:domain", "fan");
    text = flat(renderMenuInspector(h));
    expect(text).not.toContain("Pick another type");
    expect(text).toContain(`<option value=fan ?selected=true>Fan</option>`);
    expect(text).not.toMatch(/mi-type on/);
  });

  it("fills a type's gaps with the All menu through its switch", () => {
    const { h, doc } = host(DEFAULTS);
    selectMenu(h, "entity");
    const text = flat(renderMenuInspector(h));
    expect(text).toContain("Its slots show in places this menu leaves free. They are dashed on the watch.");
    handler(renderMenuInspector(h), ">Fill gaps with the All menu<", "change")({ target: { checked: true } });
    expect(doc()).toEqual(setWatchMenuInherits(DEFAULTS, "light", true));
  });
});

describe("a slot's What it does", () => {
  it("draws the actions as tiles under plain headings, the current one lit, Pro marked, and one with no target off with its reason", () => {
    const { h } = host(DEFAULTS);
    h.uiState.set("me:sel:anywhere", SERVER);
    const text = flat(renderMenuInspector(h));
    const what = text.slice(text.indexOf("<h4>What it does</h4>"), text.indexOf("<h4>Where</h4>"));
    const headings = [...what.matchAll(/<div class="mi-act-h">([^<]*)<\/div>/g)].map((m) => m[1]);
    expect(headings).toEqual(["Go around", "Do something", "Show something"]);
    expect(what).toMatch(/class="mi-act on" aria-pressed=true \?disabled=false data-action=serverMode/);
    expect(what).toMatch(/data-action=runHTTPAction\s+title=No HTTP actions/);
    expect(what).toMatch(/\?disabled=true data-action=runHTTPAction/);
    expect(what).toContain(`<small class="mi-act-why">No HTTP actions</small>`);
    expect(what).toContain(`<span class="mi-pro" title="Needs Wrist Assistant Pro on the watch">Pro</span>`);
  });

  it("puts an action the list does not offer under Now, and heads an entity's own actions with its type", () => {
    const groups = menuActionTileGroups({ targets: NO_MENU_TARGETS }, ANYWHERE, slotOf(DEFAULTS, ANYWHERE, REFRESH));
    expect(groups[0]).toEqual({ heading: "Now", tiles: [expect.objectContaining({ raw: "refresh" })] });
    const light = menuActionTileGroups({ targets: NO_MENU_TARGETS }, { list: "domain", domain: "light" }, watchMenuSlots(DEFAULTS, { list: "domain", domain: "light" })[0]!);
    expect(light[0]!.heading).toBe("Light");
  });

  it("changes the action with a tile, as the list did", () => {
    const { h, doc } = host(DEFAULTS);
    h.uiState.set("me:sel:anywhere", SERVER);
    handler(renderMenuInspector(h), "data-action=peekAppInfo", "click")({});
    expect((slotOf(doc(), ANYWHERE, SERVER).action as Record<string, unknown>).type).toBe("peekAppInfo");
  });
});

describe("a slot's Where", () => {
  it("draws the eight places round the finger, each saying what a click does", () => {
    const { h } = host(DEFAULTS);
    const cells = menuWhereCells(h, ANYWHERE, slotOf(DEFAULTS, ANYWHERE, INFO));
    expect(cells.map(whereCellLabel)).toEqual([
      "Top left, swap with Refresh",
      "Top center, swap with Entity Settings",
      "Top right, swap with Server Mode",
      "Left center, swap with Page Switcher",
      "Right center, here now",
      "Bottom left, swap with A status page",
      "Bottom center, swap with A status page",
      "Bottom right, swap with A status page",
    ]);
    h.uiState.set("me:sel:anywhere", INFO);
    const text = flat(renderMenuInspector(h));
    expect(text.match(/class="mi-where-cell /g)).toHaveLength(8);
    expect(text).toContain(`<span class="mi-where-finger" aria-hidden="true">`);
    expect(text).toContain("Click a place to move it there. A place that holds another slot swaps with it.");
    expect(text).toMatch(/class="mi-where-cell here" data-place=rightCenter[^>]*aria-current=true/);
  });

  it("marks a free place and a shared one", () => {
    const free = removeAt(DEFAULTS, ANYWHERE, "bottomRight");
    const cells = menuWhereCells(host(free).h, ANYWHERE, slotOf(free, ANYWHERE, INFO));
    expect(whereCellLabel(cells[7]!)).toBe("Bottom right, move here");
    const climate = watchMenuSlots(DEFAULTS, CLIMATE);
    const target = climate.find((s) => (s.action as Record<string, unknown>).type === "targetTemperature")!;
    const shared = menuWhereCells(host(DEFAULTS).h, CLIMATE, target).find((c) => c.position === "topCenter")!;
    expect(whereCellLabel(shared)).toBe("Top center, here now, shared with HVAC Mode");
  });

  it("moves the slot with a click as the Place list did, swaps included, and the linked climate pair moves together", () => {
    const { h, doc } = host(DEFAULTS);
    h.uiState.set("me:sel:anywhere", INFO);
    handler(renderMenuInspector(h), "data-place=topLeft", "click")({});
    expect(doc()).toEqual(moveWatchMenuSlot(DEFAULTS, ANYWHERE, INFO, "topLeft"));
    expect(slotOf(doc(), ANYWHERE, REFRESH).position).toBe("rightCenter");
    // The heat setpoint and its linked cool setpoint.
    const climate = host(DEFAULTS);
    selectMenu(climate.h, "entity");
    climate.h.uiState.set("me:er:domain", "climate");
    const heat = watchMenuSlots(DEFAULTS, CLIMATE).find((s) => (s.action as Record<string, unknown>).type === "heatSetpoint")!;
    climate.h.uiState.set("me:sel:domain:climate", heat.id);
    handler(renderMenuInspector(climate.h), "data-place=leftCenter", "click")({});
    expect(climate.doc()).toEqual(moveWatchMenuSlot(DEFAULTS, CLIMATE, heat.id as string, "leftCenter"));
    const cool = watchMenuSlots(climate.doc(), CLIMATE).find((s) => (s.action as Record<string, unknown>).type === "coolSetpoint")!;
    expect(cool.position).toBe("rightCenter");
  });

  it("hides the slot with Shown on the watch, and marks the card", () => {
    const { h, doc } = host(DEFAULTS);
    h.uiState.set("me:sel:anywhere", INFO);
    handler(renderMenuInspector(h), ">Shown on the watch<", "change")({ target: { checked: false } });
    expect(doc()).toEqual(setWatchMenuSlotVisible(DEFAULTS, ANYWHERE, INFO, false));
    expect(menuSlotWhereChanged(slotOf(doc(), ANYWHERE, INFO))).toBe(true);
    expect(flat(renderMenuInspector(h))).toContain(`<h4>Where<span class="sec-dot" aria-hidden="true"></span></h4><span class="sum">Right Center, hidden</span>`);
  });
});

describe("a slot's Shows on", () => {
  it("is every screen until Only over some tiles, which brings the type chips", () => {
    const { h, doc } = host(DEFAULTS);
    h.uiState.set("me:sel:anywhere", INFO);
    let text = flat(renderMenuInspector(h));
    expect(text).toContain(`<span class="sum">Every screen</span>`);
    expect(text).not.toContain(`aria-label="Entity types"`);
    handler(renderMenuInspector(h), ">Only over some tiles</button>", "click")({ currentTarget: null });
    expect(doc()).toEqual(setWatchMenuSlotEntityTypes(DEFAULTS, INFO, watchMenuShowForTypes().slice(0, 1)));
    expect(menuSlotShowsOnChanged(slotOf(doc(), ANYWHERE, INFO))).toBe(true);
    text = flat(renderMenuInspector(h));
    expect(text).toContain(`role="group" aria-label="Entity types"`);
    expect(text).toContain("The slot shows only while the finger is over an entity of these types.");
    handler(renderMenuInspector(h), ">Every screen</button>", "click")({ currentTarget: null });
    expect(slotOf(doc(), ANYWHERE, INFO).entityTypes).toBeUndefined();
  });

  it("is only in the Anywhere menu", () => {
    const { h } = host(DEFAULTS);
    selectMenu(h, "entity");
    h.uiState.set("me:sel:domain:light", watchMenuSlots(DEFAULTS, { list: "domain", domain: "light" })[0]!.id);
    const text = flat(renderMenuInspector(h));
    expect(text).toContain("<h4>What it does</h4>");
    expect(text).not.toContain("<h4>Shows on</h4>");
    expect(menuSlotActionChanged(slotOf(DEFAULTS, ANYWHERE, INFO), ANYWHERE)).toBe(false);
  });
});

describe("the words and the rules", () => {
  it("never break a sentence with a dash or trail off", () => {
    const views: MenusViewHost[] = [];
    const anywhere = host(setWatchMenuStyle(DEFAULTS, "quickAction", "beamStyle", "wakeWave")).h;
    views.push(anywhere);
    const slot = host(DEFAULTS).h;
    slot.uiState.set("me:sel:anywhere", INFO);
    views.push(slot);
    const entity = host(DEFAULTS).h;
    selectMenu(entity, "entity");
    views.push(entity);
    for (const v of views) {
      const words = flat(renderMenuInspector(v)).replace(/<[^>]*>/g, " ");
      expect(words).not.toMatch(/ - |–|—|…|\.\.\./);
    }
  });

  it("draw the chrome from tokens only: no hex, no rgba, no purple", () => {
    const sheet = menuInspectorLookStyles.cssText;
    expect(sheet).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(sheet).not.toMatch(/rgba?\(/);
    expect(sheet).not.toMatch(/purple/);
    expect(sheet).not.toMatch(/font-style:\s*italic/);
    // The Menus hue shows only on a chip's outline.
    expect(sheet.match(/--wa-hue-orange/g)).toHaveLength(1);
  });
});

/** The document with the list's slot at `position` taken out. */
function removeAt(document: MenusDocument, ref: MenuListRef, position: string): MenusDocument {
  const q = document.quickAction as Record<string, unknown>;
  if (ref.list !== "anywhere") return document;
  return { ...document, quickAction: { ...q, slots: (q.slots as Record<string, unknown>[]).filter((s) => s.position !== position) } };
}
