// The tile inspector's groups (`renderTileInspector`, tile-settings.ts):
// which section reads as changed from its defaults (the blue dot, Reset, and
// its group's count), what each section's Reset puts back and what it
// leaves, the rows hidden where they cannot do anything, and the light
// pictures of choices that are not about the tile's color.
//
// No DOM: the settings are drawn to their Lit templates and read as text,
// and a button is pressed by calling the handler its template holds.

import { describe, expect, it } from "vitest";

import { SymbolBrowser } from "../src/symbols.js";
import { WatchPagesDraft } from "../src/watch-pages/draft.js";
import { NO_ICONS, type TileSettingsHost } from "../src/watch-pages/editor-host.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { PATTERN_GROUND } from "../src/watch-pages/picture-choice.js";
import {
  LABEL_HIDDEN_NOTE,
  NO_ICON_GLOW_NOTE,
  NO_ICON_NOTE,
  type TileInspectorPart,
  renderTileInspector,
  renderTileSettings,
  watchTileDrawsNoIcon,
  watchTileInspectorPartChanged,
  watchTileInspectorPartReset,
  watchTileLabelDrawn,
} from "../src/watch-pages/tile-settings.js";

(globalThis as { document?: unknown }).document ??= { activeElement: null };
(globalThis as { HTMLElement?: unknown }).HTMLElement ??= class {};
(globalThis as { HTMLInputElement?: unknown }).HTMLInputElement ??= class {};

// ── reading templates ────────────────────────────────────────────────────

interface Tpl {
  strings: readonly string[];
  values: unknown[];
}

function isTpl(node: unknown): node is Tpl {
  return typeof node === "object" && node !== null && "strings" in node && "values" in node;
}

function flat(node: unknown): string {
  if (node === undefined || node === null || typeof node === "symbol") return "";
  if (Array.isArray(node)) return node.map(flat).join("");
  if (isTpl(node)) return node.strings.map((s, i) => s + (i < node.values.length ? flat(node.values[i]) : "")).join("");
  if (typeof node === "function" || typeof node === "object") return "";
  return String(node);
}

function templates(node: unknown, out: Tpl[] = []): Tpl[] {
  if (Array.isArray(node)) for (const n of node) templates(n, out);
  else if (isTpl(node)) {
    out.push(node);
    for (const v of node.values) templates(v, out);
  }
  return out;
}

/** The `event` handler (`@click=`, `@pointerenter=`...) of the smallest
 * template whose text holds `marker` and binds that event itself. */
function handler(root: unknown, marker: string, event = "@click="): (e: unknown) => void {
  const found = templates(root)
    .map((t) => {
      let text = "";
      let fn: unknown;
      t.strings.forEach((s, i) => {
        text += s;
        if (i >= t.values.length) return;
        const v = t.values[i];
        if (typeof v === "function" && s.trimEnd().endsWith(event)) fn ??= v;
        text += flat(v);
      });
      return { text, fn };
    })
    .filter((c) => c.text.includes(marker) && c.fn !== undefined)
    .sort((a, b) => a.text.length - b.text.length);
  if (found.length === 0) throw new Error(`no ${event} handler near ${marker}`);
  return found[0]!.fn as (e: unknown) => void;
}

const fire = (root: unknown, marker: string, event = "@click=") => handler(root, marker, event)({ currentTarget: null, stopPropagation() {}, preventDefault() {} });

// ── a tile host ──────────────────────────────────────────────────────────

const PAGE_ID = "C3A0E000-0000-4000-8000-0000000000AA";
const TILE_ID = "C3A0E000-0000-4000-8000-000000000001";

const tile = (entityId: string, extra: Record<string, unknown> = {}): WatchPageTile => ({
  id: TILE_ID, entityId, gridCol: 0, gridRow: 0, colSpan: 6, rowSpan: 4, ...extra,
});

const STATES = {
  "light.desk": { entity_id: "light.desk", state: "on", attributes: { friendly_name: "Desk", brightness: 128 } },
  "switch.fan": { entity_id: "switch.fan", state: "on", attributes: { friendly_name: "Fan" } },
};

/** A tile host as the page editor builds one, One Look on. */
function tileHost(t: WatchPageTile): { host: TileSettingsHost; draft: WatchPagesDraft; updates: () => number } {
  const draft = new WatchPagesDraft({ schemaVersion: 1, pages: [{ id: PAGE_ID, name: "Living", items: [t] }] }, 1);
  const pageNow = () => (draft.document.pages as WatchPage[])[0]!;
  let updates = 0;
  const host = {
    hass: { states: STATES },
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    get document() { return draft.document; },
    pageId: PAGE_ID,
    get page() { return pageNow(); },
    otherPages: [],
    catalog: undefined,
    cameraRefreshDefaults: { on: true, debounce: "5" },
    behavior: undefined,
    musicAssistant: undefined,
    cloudTTS: undefined,
    templateRenders: new Map(),
    deviceSiblings: () => ({ selects: [], switches: [], sensors: [], all: [] }),
    smartRuleId: undefined,
    busy: false,
    uiState: new Map<string, unknown>(),
    apply: (next: WatchPagesDocument) => draft.apply(next),
    endCoalesce: () => draft.endCoalesce(),
    selectTile: () => undefined,
    requestUpdate: () => { updates += 1; },
    tileId: TILE_ID,
    get tile() { return ((pageNow().items as WatchPageTile[] | undefined) ?? []).find((x) => x.id === TILE_ID) ?? ({} as WatchPageTile); },
    oneLook: true,
  } as unknown as TileSettingsHost;
  return { host, draft, updates: () => updates };
}

/** One section of the groups, from its heading to the next section. */
function part(text: string, id: string): string {
  const at = text.indexOf(`<section class="ts-sec" data-part=${id} `);
  if (at < 0) throw new Error(`no ${id} section`);
  const next = text.slice(at + 1).search(/<section class="ts-(sec|grp)"/);
  return text.slice(at, next < 0 ? undefined : at + 1 + next);
}

const changed = (t: WatchPageTile, p: TileInspectorPart) => watchTileInspectorPartChanged(tileHost(t).host, p);

// ── what reads as changed ────────────────────────────────────────────────

describe("a section that differs from its defaults", () => {
  it("is none on a light as the iPhone app saves one", () => {
    const light = tile("light.desk", { showLabel: true, labelShadow: true, labelFontWeight: "light", iconShadow: false, iconTapAnimation: "replace" });
    for (const p of ["color", "icon", "glow", "whenOff", "tapAnimation", "text", "state", "border", "background", "action", "visibility", "size"] as const) {
      expect(changed(light, p), p).toBe(false);
    }
  });

  it("splits Icon and color: Color, Icon, Glow, When it is off and Tap animation each count only their own keys", () => {
    expect(changed(tile("light.desk", { color: "#FF0000" }), "color")).toBe(true);
    expect(changed(tile("light.desk", { color: "#FF0000" }), "icon")).toBe(false);
    expect(changed(tile("light.desk", { icon: "star.circle" }), "icon")).toBe(true);
    expect(changed(tile("light.desk", { icon: "star.circle" }), "color")).toBe(false);
    expect(changed(tile("light.desk", { iconSizeOverride: 24 }), "icon")).toBe(true);
    expect(changed(tile("light.desk", { stateColors: { on: "#FF0000" } }), "icon")).toBe(true);
    expect(changed(tile("light.desk", { iconGlow: { mode: "off" } }), "glow")).toBe(true);
    expect(changed(tile("light.desk", { dimWhenOff: false }), "whenOff")).toBe(true);
    expect(changed(tile("light.desk", { dimWhenOff: true }), "whenOff")).toBe(false);
    expect(changed(tile("light.desk", { iconTapAnimation: "bounce" }), "tapAnimation")).toBe(true);
    expect(changed(tile("light.desk", { iconTapAnimation: "bounce" }), "glow")).toBe(false);
  });

  it("counts a State, Border or Background key only when the rows read other than they would after Reset", () => {
    // Plain is what an absent value reads already: no change.
    expect(changed(tile("light.desk", { stateValueLabelStyle: "Plain" }), "state")).toBe(false);
    expect(changed(tile("light.desk", { stateValueLabelStyle: "Pill" }), "state")).toBe(true);
    expect(changed(tile("light.desk", { borderStyle: "line" }), "border")).toBe(true);
    expect(changed(tile("light.desk", { backgroundPattern: "dots" }), "background")).toBe(true);
  });

  it("marks the section with the dot and Reset, and its group with the count", () => {
    const { host } = tileHost(tile("light.desk", { color: "#FF0000", borderStyle: "line", iconTapAnimation: "bounce" }));
    const text = flat(renderTileInspector(host));
    expect(part(text, "color")).toContain(`<h4>Color</h4><span class="ts-dot"`);
    expect(part(text, "border")).toContain(`>Reset</button>`);
    expect(part(text, "icon")).not.toContain("ts-dot");
    expect(text).toMatch(/data-group=look [^]*?<span class="ts-grp-n"><i aria-hidden="true"><\/i>2 changed<\/span>/);
    expect(text).toMatch(/data-group=tap [^]*?<span class="ts-grp-n"><i aria-hidden="true"><\/i>1 changed<\/span>/);
    // The border's own Reset at the foot of its rows is the heading's now.
    expect(part(text, "border")).toContain(`class="ts-after ts-reset"`);
  });
});

// ── Reset puts back that section only ────────────────────────────────────

describe("a section's Reset", () => {
  const busy = { color: "#FF0000", iconSizeOverride: 30, iconShadow: true, iconGlow: { mode: "off" }, dimWhenOff: false,
    iconTapAnimation: "bounce", labelFontWeight: "bold", labelShadow: false, borderStyle: "line", backgroundPattern: "dots",
    singleTapAction: "openControl", hideWhenInactive: true };

  it("puts each section back and leaves the others as they are, required keys at their defaults", () => {
    const cases: [TileInspectorPart, (t: WatchPageTile) => void][] = [
      ["color", (t) => { expect(t.color).not.toBe("#FF0000"); expect(t.iconSizeOverride).toBe(30); }],
      ["icon", (t) => { expect(t.iconSizeOverride).toBeUndefined(); expect(t.iconShadow).toBe(false); expect(t.color).toBe("#FF0000"); }],
      ["glow", (t) => { expect(t.iconGlow).toBeUndefined(); expect(t.dimWhenOff).toBe(false); }],
      ["whenOff", (t) => { expect(t.dimWhenOff).toBeUndefined(); expect(t.iconGlow).toEqual({ mode: "off" }); }],
      ["tapAnimation", (t) => { expect(t.iconTapAnimation).toBe("replace"); expect(t.iconShadow).toBe(true); }],
      ["text", (t) => { expect(t.labelFontWeight).toBeUndefined(); expect(t.labelShadow).toBe(true); expect(t.borderStyle).toBe("line"); }],
      ["border", (t) => { expect(t.borderStyle ?? "none").toBe("none"); expect(t.backgroundPattern).toBe("dots"); }],
      ["background", (t) => { expect(t.backgroundPattern ?? "none").toBe("none"); expect(t.borderStyle).toBe("line"); }],
      ["action", (t) => { expect(t.singleTapAction).toBeUndefined(); expect(t.hideWhenInactive).toBe(true); }],
      ["visibility", (t) => { expect(t.hideWhenInactive ?? false).toBe(false); expect(t.singleTapAction).toBe("openControl"); }],
    ];
    for (const [p, check] of cases) {
      const { host, draft } = tileHost(tile("light.desk", busy));
      expect(watchTileInspectorPartChanged(host, p), p).toBe(true);
      const edit = watchTileInspectorPartReset(host, p)!;
      draft.apply(edit(draft.document));
      check(host.tile);
      expect(watchTileInspectorPartChanged(host, p), p).toBe(false);
    }
  });

  it("is offered nowhere a section has no way back", () => {
    const { host } = tileHost(tile("light.desk"));
    for (const p of ["size", "opens", "target", "special", "header", "phone", "phoneTile", "phoneExtras", "removed"] as const) {
      expect(watchTileInspectorPartReset(host, p), p).toBeUndefined();
    }
  });

  it("is one undo step from the heading", () => {
    const { host, draft } = tileHost(tile("light.desk", busy));
    fire(renderTileInspector(host), "title=Put border back to its defaults");
    expect(host.tile.borderStyle ?? "none").toBe("none");
    draft.undo();
    expect(host.tile.borderStyle).toBe("line");
  });
});

// ── rows that do nothing ─────────────────────────────────────────────────

describe("rows that cannot do anything", () => {
  it("No icon hides the icon's size, shadow, glow and animation, each with one line saying why", () => {
    const none = tile("light.desk", { icon: "" });
    expect(watchTileDrawsNoIcon(none)).toBe(true);
    const text = flat(renderTileInspector(tileHost(none).host));
    const icon = part(text, "icon");
    expect(icon).toContain(NO_ICON_NOTE);
    expect(icon).not.toContain("Icon size");
    expect(icon).not.toContain("Icon shadow");
    // The state icons stay: a state's own icon still draws on a No icon tile.
    expect(icon).toContain("State icons and colors");
    const glow = part(text, "glow");
    expect(glow).toContain(NO_ICON_GLOW_NOTE);
    expect(glow).not.toContain(`role="radiogroup" aria-label=Glow`);
    expect(text).not.toContain("Animate while on");
  });

  it("keeps them while a state has an icon of its own, which the renderer draws first", () => {
    const stateIcon = tile("light.desk", { icon: "", stateIcons: { on: "lightbulb.fill" } });
    expect(watchTileDrawsNoIcon(stateIcon)).toBe(false);
    const text = flat(renderTileInspector(tileHost(stateIcon).host));
    expect(part(text, "icon")).toContain("Icon size");
    expect(part(text, "glow")).toContain("Glow icon when on");
  });

  it("Show label off hides the label's size, weight, design, shadow and color, with one line", () => {
    const hidden = tile("light.desk", { showLabel: false });
    expect(watchTileLabelDrawn(hidden)).toBe(false);
    const text = part(flat(renderTileInspector(tileHost(hidden).host)), "text");
    expect(text).toContain("Show label");
    expect(text).toContain(LABEL_HIDDEN_NOTE);
    for (const row of ["Font size", "aria-label=Weight", "aria-label=Design", "Text shadow", "Label color"]) expect(text, row).not.toContain(row);
    // The same in a card.
    expect(flat(renderTileSettings(tileHost(hidden).host, { sections: ["text"] }))).toContain(LABEL_HIDDEN_NOTE);
  });

  it("keeps the label's rows for an HTTP action showing its reply, which names itself by Show Name", () => {
    expect(watchTileLabelDrawn(tile("http_action.x", { showLabel: false, httpResponseDisplay: "tileValue" }))).toBe(true);
    expect(watchTileLabelDrawn(tile("http_action.x", { showLabel: false }))).toBe(false);
  });
});

// ── light pictures ───────────────────────────────────────────────────────

describe("the pictures of a choice that is not about color", () => {
  it("draw a state value, a state bar and a border style as small neutral samples, not as the tile", () => {
    const text = flat(renderTileInspector(tileHost(tile("light.desk", { stateValueLabelStyle: "Pill" })).host));
    const state = part(text, "state");
    const value = state.slice(state.indexOf("aria-label=Value"), state.indexOf("</div>\n  </div>", state.indexOf("aria-label=Value")));
    expect(value).not.toContain("pc-tile");
    expect(value).toContain(`<span class="pc-mini"><span class="pc-val ">80%</span></span>`);
    expect(value).toContain(`<span class="pc-mini"><span class="pc-val pill">80%</span></span>`);
    expect(state).toContain(`<span class="pc-bar top"></span>`);
    expect(state).toContain(`<span class="pc-bar fill"></span>`);
    expect(state).toContain(`class="field pc-field pc-size-mini"`);
    const border = part(text, "border");
    expect(border).not.toContain("pc-tile");
    expect(border).toContain(`class="pc-mini pc-anim"`);
    expect(border).toMatch(/<span class="pc-mini" style=outline:\d+(\.\d+)?px solid/);
  });

  it("draw the pattern gallery on one neutral gray, whatever the tile's color", () => {
    const text = part(flat(renderTileInspector(tileHost(tile("light.desk", { color: "#FF0000" })).host)), "background");
    const swatches = [...text.matchAll(/class="pc-swatch" style=background:([^>]+)>/g)].map((m) => m[1]!);
    expect(swatches.length).toBeGreaterThan(15);
    for (const s of swatches) expect(s.trim().endsWith(PATTERN_GROUND)).toBe(true);
    expect(text).not.toContain("#FF0000");
  });

  it("keep the real tile, large, for Glow (one, on) and When it is off (two, off)", () => {
    const text = flat(renderTileInspector(tileHost(tile("light.desk")).host));
    expect(part(text, "glow").match(/<span class="pc-tile"/g)?.length).toBe(1);
    expect(part(text, "glow")).toContain(`<div class="ts-big-pic" aria-hidden="true">`);
    expect(part(text, "whenOff")).toContain(`class="field pc-field pc-size-large"`);
    expect(part(text, "whenOff").match(/<span class="pc-tile"/g)?.length).toBe(2);
  });
});
