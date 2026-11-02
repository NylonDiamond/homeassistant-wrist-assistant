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
  TILE_INSPECTOR_GROUP_WORDS,
  TILE_INSPECTOR_GROUPS,
  TILE_INSPECTOR_PARTS,
  type TileInspectorGroup,
  type TileInspectorPart,
  renderTileInspector,
  renderTileSettings,
  tileInspectorParts,
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
  "camera.porch": { entity_id: "camera.porch", state: "idle", attributes: { friendly_name: "Porch" } },
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

/** One section of the settings, in the top card or in a card, from its heading
 * to the next section. */
function part(text: string, id: string): string {
  const at = text.search(new RegExp(`<section class="ts-sec( ts-top-part)?" data-part=${id} `));
  if (at < 0) throw new Error(`no ${id} section`);
  const next = text.slice(at + 1).search(/<section class="ts-(sec|grp)/);
  return text.slice(at, next < 0 ? undefined : at + 1 + next);
}

/** The top card of a markup, to the first card under it. */
const topCard = (text: string): string => text.slice(text.indexOf(`<section class="ts-top" `), text.indexOf(`<div class="ts-groups">`));

/** The cards under the top card. */
const cards = (text: string): string => text.slice(text.indexOf(`<div class="ts-groups">`));

/** The part ids of a markup, in the order they stand. */
const partIds = (text: string): string[] => [...text.matchAll(/<section class="ts-sec[^"]*" data-part=(\w+) /g)].map((m) => m[1]!);

const changed = (t: WatchPageTile, p: TileInspectorPart) => watchTileInspectorPartChanged(tileHost(t).host, p);

// ── the kind's card ──────────────────────────────────────────────────────

describe("the tile's own kind's card", () => {
  /** The kind card of a markup, to the first section after it. */
  const kindCard = (text: string): string => {
    const at = text.indexOf(`<section class="ts-kind" `);
    if (at < 0) throw new Error("no kind card");
    const end = text.indexOf(`<section class="ts-sec" data-part=action `, at);
    return text.slice(at, end < 0 ? undefined : end);
  };

  it("leads What it does on a camera, titled Camera and tagged, its iPhone key under a smaller heading of its own", () => {
    const { host } = tileHost(tile("camera.porch"));
    const iphone = Object.create(host, { device: { value: "iphone" } }) as TileSettingsHost;
    const text = flat(renderTileInspector(iphone));
    const does = text.slice(text.indexOf(`<section class="ts-grp" data-group=does `));
    const card = kindCard(does);
    expect(card).toMatch(/^<section class="ts-kind" data-kind=camera aria-label=Camera>\s*<div class="ts-sec-h ts-kind-h"><h4>Camera<\/h4><span class="ts-kind-tag">This tile<\/span>/);
    // The Camera task stands under the card's own heading; the iPhone key
    // keeps a smaller one, with its iPhone tag.
    expect(card).toMatch(/<section class="ts-sec" data-part=special aria-label=Camera>\s*<div class="sec-b ts-sec-b">/);
    expect(card).toMatch(/<section class="ts-sec" data-part=phone aria-label=[^>]+>\s*<div class="ts-sec-h ts-sec-sub"><h5>[^<]+<\/h5><span class="ts-dev-tag"/);
    // What it controls and the tap stand in the top card; the rest of What it
    // does comes after the kind's card.
    expect(does).not.toContain("data-part=entity");
    expect(does).not.toContain("data-part=tap ");
    expect(does.indexOf("data-part=action ")).toBeGreaterThan(does.indexOf(`class="ts-kind"`));
    expect(does.indexOf("data-part=tapAnimation ")).toBeGreaterThan(does.indexOf("data-part=action "));
  });

  it("is left out where the tile's kind holds nothing of its own", () => {
    expect(flat(renderTileInspector(tileHost(tile("light.desk")).host))).not.toContain(`class="ts-kind"`);
  });
});

// ── what reads as changed ────────────────────────────────────────────────

describe("a section that differs from its defaults", () => {
  it("is none on a light as the iPhone app saves one", () => {
    const light = tile("light.desk", { showLabel: true, labelShadow: true, labelFontWeight: "light", iconShadow: false, iconTapAnimation: "replace" });
    for (const p of ["color", "icon", "glow", "whenOff", "tapAnimation", "text", "state", "border", "background", "action", "visibility", "size"] as const) {
      expect(changed(light, p), p).toBe(false);
    }
  });

  it("splits Icon and color: Color, Icon, Icon look, Glow, When it is off and Tap animation each count only their own keys", () => {
    expect(changed(tile("light.desk", { color: "#FF0000" }), "color")).toBe(true);
    expect(changed(tile("light.desk", { color: "#FF0000" }), "icon")).toBe(false);
    expect(changed(tile("light.desk", { icon: "star.circle" }), "icon")).toBe(true);
    expect(changed(tile("light.desk", { icon: "star.circle" }), "color")).toBe(false);
    expect(changed(tile("light.desk", { icon: "star.circle" }), "iconLook")).toBe(false);
    expect(changed(tile("light.desk", { iconPhotoId: "photo-1" }), "icon")).toBe(true);
    expect(changed(tile("light.desk", { iconPhotoId: "photo-1" }), "iconLook")).toBe(false);
    expect(changed(tile("light.desk", { iconSizeOverride: 24 }), "iconLook")).toBe(true);
    expect(changed(tile("light.desk", { iconSizeOverride: 24 }), "icon")).toBe(false);
    expect(changed(tile("light.desk", { stateColors: { on: "#FF0000" } }), "iconLook")).toBe(true);
    expect(changed(tile("light.desk", { stateColors: { on: "#FF0000" } }), "icon")).toBe(false);
    expect(changed(tile("light.desk", { iconGlow: { mode: "off" } }), "glow")).toBe(true);
    expect(changed(tile("light.desk", { dimWhenOff: false }), "whenOff")).toBe(true);
    expect(changed(tile("light.desk", { dimWhenOff: true }), "whenOff")).toBe(false);
    expect(changed(tile("light.desk", { iconTapAnimation: "bounce" }), "tapAnimation")).toBe(true);
    expect(changed(tile("light.desk", { iconTapAnimation: "bounce" }), "glow")).toBe(false);
  });

  it("splits the tap: the single tap counts for Tap, the rest for Hold and slide", () => {
    expect(changed(tile("light.desk", { singleTapAction: "openControl" }), "tap")).toBe(true);
    expect(changed(tile("light.desk", { singleTapAction: "openControl" }), "action")).toBe(false);
    expect(changed(tile("light.desk", { requiresConfirmation: true }), "action")).toBe(true);
    expect(changed(tile("light.desk", { requiresConfirmation: true }), "tap")).toBe(false);
  });

  it("counts a State, Border or Background key only when the rows read other than they would after Reset", () => {
    // Plain is what an absent value reads already: no change.
    expect(changed(tile("light.desk", { stateValueLabelStyle: "Plain" }), "state")).toBe(false);
    expect(changed(tile("light.desk", { stateValueLabelStyle: "Pill" }), "state")).toBe(true);
    expect(changed(tile("light.desk", { borderStyle: "line" }), "border")).toBe(true);
    expect(changed(tile("light.desk", { backgroundPattern: "dots" }), "background")).toBe(true);
  });

  it("marks the section with the dot and Reset, and its card with the count", () => {
    const { host } = tileHost(tile("light.desk", { iconSizeOverride: 30, borderStyle: "line", iconTapAnimation: "bounce" }));
    const text = flat(renderTileInspector(host));
    expect(part(text, "iconLook")).toContain(`<h4>Icon</h4><span class="ts-dot"`);
    expect(part(text, "border")).toContain(`>Reset</button>`);
    expect(part(text, "glow")).not.toContain("ts-dot");
    const count = (id: string, n: number) => new RegExp(`data-group=${id} [^]*?<div class="ts-grp-h"><h3 class="ts-grp-t">[^<]+</h3><span class="ts-grp-n"><i aria-hidden="true"></i>${n} changed</span>`);
    expect(text).toMatch(count("color", 1));
    expect(text).toMatch(count("surface", 1));
    expect(text).toMatch(count("does", 1));
    expect(text).toMatch(/data-group=text [^]*?<div class="ts-grp-h"><h3 class="ts-grp-t">Text<\/h3><\/div>/);
    // The border's own Reset at the foot of its rows is the heading's now.
    expect(part(text, "border")).toContain(`class="ts-after ts-reset"`);
  });

  it("marks a part of the top card with a dot that puts it back, and only a changed one", () => {
    const { host } = tileHost(tile("light.desk", { color: "#FF0000" }));
    const text = flat(renderTileInspector(host));
    expect(part(text, "color")).toContain(`class="ts-dot ts-dot-btn" title=Put color back to its default`);
    expect(part(text, "icon")).not.toContain("ts-dot");
    fire(renderTileInspector(host), "title=Put color back to its default");
    expect(host.tile.color).not.toBe("#FF0000");
  });
});

// ── Reset puts back that section only ────────────────────────────────────

describe("a section's Reset", () => {
  const busy = { color: "#FF0000", icon: "star.circle", iconPhotoId: "photo-1", iconSizeOverride: 30, iconShadow: true, iconGlow: { mode: "off" }, dimWhenOff: false,
    iconTapAnimation: "bounce", labelFontWeight: "bold", labelShadow: false, borderStyle: "line", backgroundPattern: "dots",
    singleTapAction: "openControl", requiresConfirmation: true, hideWhenInactive: true, stateIcons: { on: "bolt" }, stateColors: { on: "#00FF00" } };

  it("puts each section back and leaves the others as they are, required keys at their defaults", () => {
    const cases: [TileInspectorPart, (t: WatchPageTile) => void][] = [
      ["color", (t) => { expect(t.color).not.toBe("#FF0000"); expect(t.iconSizeOverride).toBe(30); }],
      ["icon", (t) => { expect(t.icon).not.toBe("star.circle"); expect(t.iconPhotoId).toBeUndefined(); expect(t.iconSizeOverride).toBe(30); expect(t.iconShadow).toBe(true); expect(t.color).toBe("#FF0000"); }],
      ["iconLook", (t) => { expect(t.iconSizeOverride).toBeUndefined(); expect(t.iconShadow).toBe(false); expect(t.stateIcons).toBeUndefined(); expect(t.stateColors).toBeUndefined(); expect(t.icon).toBe("star.circle"); expect(t.iconPhotoId).toBe("photo-1"); expect(t.color).toBe("#FF0000"); }],
      ["glow",(t) => { expect(t.iconGlow).toBeUndefined(); expect(t.dimWhenOff).toBe(false); }],
      ["whenOff", (t) => { expect(t.dimWhenOff).toBeUndefined(); expect(t.iconGlow).toEqual({ mode: "off" }); }],
      ["tapAnimation", (t) => { expect(t.iconTapAnimation).toBe("replace"); expect(t.iconShadow).toBe(true); }],
      ["text", (t) => { expect(t.labelFontWeight).toBeUndefined(); expect(t.labelShadow).toBe(true); expect(t.borderStyle).toBe("line"); }],
      ["border", (t) => { expect(t.borderStyle ?? "none").toBe("none"); expect(t.backgroundPattern).toBe("dots"); }],
      ["background", (t) => { expect(t.backgroundPattern ?? "none").toBe("none"); expect(t.borderStyle).toBe("line"); }],
      ["tap", (t) => { expect(t.singleTapAction).toBeUndefined(); expect(t.requiresConfirmation).toBe(true); expect(t.hideWhenInactive).toBe(true); }],
      ["action", (t) => { expect(t.requiresConfirmation).toBeUndefined(); expect(t.singleTapAction).toBe("openControl"); expect(t.hideWhenInactive).toBe(true); }],
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
    const look = part(text, "iconLook");
    expect(look).toContain(NO_ICON_NOTE);
    expect(look).not.toContain("Icon size");
    expect(look).not.toContain("Icon shadow");
    // The state icons stay: a state's own icon still draws on a No icon tile.
    expect(look).toContain("State icons and colors");
    const glow = part(text, "glow");
    expect(glow).toContain(NO_ICON_GLOW_NOTE);
    expect(glow).not.toContain(`role="radiogroup" aria-label=Glow`);
    expect(text).not.toContain("Animate while on");
  });

  it("keeps them while a state has an icon of its own, which the renderer draws first", () => {
    const stateIcon = tile("light.desk", { icon: "", stateIcons: { on: "lightbulb.fill" } });
    expect(watchTileDrawsNoIcon(stateIcon)).toBe(false);
    const text = flat(renderTileInspector(tileHost(stateIcon).host));
    expect(part(text, "iconLook")).toContain("Icon size");
    expect(part(text, "glow")).toContain("Glow icon when on");
  });

  it("Show name off hides the label's size, weight, design, shadow and color, with one line", () => {
    const hidden = tile("light.desk", { showLabel: false });
    expect(watchTileLabelDrawn(hidden)).toBe(false);
    const text = part(flat(renderTileInspector(tileHost(hidden).host)), "text");
    expect(text).toContain("Show name");
    expect(text).toContain(LABEL_HIDDEN_NOTE);
    for (const row of ["Font size", "aria-label=Weight", "aria-label=Design", "Name shadow", "Name color"]) expect(text, row).not.toContain(row);
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

  it("leave Glow and When it is off no picture of the tile: the selected tile on the stage is the preview", () => {
    const text = flat(renderTileInspector(tileHost(tile("light.desk")).host));
    expect(part(text, "glow")).not.toContain(`class="pc-tile"`);
    expect(part(text, "glow")).not.toContain("ts-big-pic");
    expect(part(text, "whenOff")).not.toContain(`class="pc-tile"`);
    expect(part(text, "whenOff")).toContain(`class="field pc-seg-field"`);
    expect(part(text, "whenOff")).toContain("<h4>When it is off</h4>");
    expect(part(text, "whenOff")).toContain("aria-label=When off");
  });
});

// ── the top card ─────────────────────────────────────────────────────────

describe("the top card", () => {
  it("draws its parts in order, Controls, Tap, Icon, Color and Inside the tile, and none of them in the cards", () => {
    const text = flat(renderTileInspector(tileHost(tile("light.desk")).host));
    const top = partIds(topCard(text));
    expect(top).toEqual(["entity", "tap", "icon", "color", "arrange"]);
    const rest = partIds(cards(text));
    for (const id of top) expect(rest, id).not.toContain(id);
    for (const [id, title] of [["entity", "Controls"], ["tap", "Tap"], ["icon", "Icon"], ["color", "Color"], ["arrange", "Inside the tile"]] as const) {
      expect(part(text, id)).toMatch(new RegExp(`<section class="ts-sec ts-top-part" data-part=${id} aria-label=${title}>\\s*<div class="ts-top-lab">`));
    }
  });

  it("stands Controls beside Tap and Icon beside Color, and Inside the tile on its own", () => {
    const text = topCard(flat(renderTileInspector(tileHost(tile("light.desk")).host)));
    const rows = text.split(`<div class="ts-top-row `).slice(1).map((r) => partIds(r.slice(0, r.indexOf(`<section class="ts-sec ts-top-part" data-part=arrange `) >= 0 ? r.indexOf(`<section class="ts-sec ts-top-part" data-part=arrange `) : undefined)));
    expect(rows).toEqual([["entity", "tap"], ["icon", "color"]]);
  });

  it("puts the head first, as the page editor hands it in", () => {
    const text = flat(renderTileInspector(tileHost(tile("light.desk")).host, { head: { strings: [`<div class="the-head"></div>`], values: [] } as never }));
    expect(topCard(text).indexOf(`class="the-head"`)).toBeLessThan(topCard(text).indexOf("data-part=entity"));
  });

  it("holds No icon and Default inside the icon's dropdown, its switch to a photo beside it", () => {
    const { host } = tileHost(tile("light.desk"));
    const closed = part(flat(renderTileInspector(host)), "icon");
    expect(closed).toContain(`<div class="ts-top-src">`);
    expect(closed).not.toContain(">No icon</button>");
    expect(closed).not.toContain(">Default</button>");
    host.symbols.toggle("pe:ts:symbol");
    const open = part(flat(renderTileInspector(host)), "icon");
    const at = open.indexOf(`class="sym-browse sym-menu"`);
    expect(at).toBeGreaterThan(-1);
    const menu = open.slice(at);
    expect(menu.indexOf(">No icon</button>")).toBeGreaterThan(-1);
    expect(menu.indexOf(">Default</button>")).toBeGreaterThan(menu.indexOf(">No icon</button>"));
    expect(open.slice(0, at)).not.toContain(">No icon</button>");
  });

  it("offers the Rainbow swatch only while the tile holds a gradient or the rainbow", () => {
    const color = (extra: Record<string, unknown>) => part(flat(renderTileInspector(tileHost(tile("light.desk", extra)).host)), "color");
    expect(color({ color: "#FF0000" })).not.toContain("aria-label=Rainbow");
    expect(color({ color: "GRADIENT|#FF0000|#0000FF" })).toContain("aria-label=Rainbow");
  });

  it("leads the swatch row with Solid and Gradient, a hairline, then Default", () => {
    const color = part(flat(renderTileInspector(tileHost(tile("light.desk", { color: "#FF0000" })).host)), "color");
    const order = [`class="ts-swatches"`, ">Solid<", ">Gradient<", `class="ts-color-rule"`, ">Default</button>", "title=#"].map((m) => color.indexOf(m));
    expect(order.every((at) => at >= 0)).toBe(true);
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it("names the single tap Tap, the menu's own label kept but hidden by the card", () => {
    const tap = part(flat(renderTileInspector(tileHost(tile("light.desk")).host)), "tap");
    expect(tap).toContain(`<div class="ts-top-lab"><span>Tap</span></div>`);
    expect(tap).toContain("<span>Single tap</span>");
  });
});

// ── the cards under it ───────────────────────────────────────────────────

describe("the cards under the top card", () => {
  const GROUP_OF: Readonly<Record<string, TileInspectorGroup>> = {
    entity: "top", tap: "top", icon: "top", color: "top", arrange: "top",
    removed: "color", header: "color", iconLook: "color", whenOff: "color", glow: "color",
    background: "surface", border: "surface",
    text: "text", state: "text",
    phoneTile: "does", special: "does", phone: "does", target: "does", opens: "does", request: "does", action: "does", tapAnimation: "does",
    visibility: "where", size: "where", phoneExtras: "where",
  };

  it("hold each part in one group, by the table", () => {
    expect(Object.fromEntries(TILE_INSPECTOR_PARTS)).toEqual(GROUP_OF);
    expect(TILE_INSPECTOR_PARTS).toHaveLength(Object.keys(GROUP_OF).length);
    expect(TILE_INSPECTOR_GROUPS).toEqual(["top", "color", "surface", "text", "does", "where"]);
  });

  it("are titled Look, Background and border, Text, What it does and Where it shows, in that order and always open", () => {
    const text = cards(flat(renderTileInspector(tileHost(tile("lock.front_door")).host)));
    const drawn = [...text.matchAll(/<section class="ts-grp" data-group=(\w+) aria-label=([^>]+)>\s*<div class="ts-grp-h"><h3 class="ts-grp-t">([^<]+)<\/h3>/g)];
    expect(drawn.map((m) => m[3])).toEqual(["Look", "Background and border", "Text", "What it does", "Where it shows"]);
    for (const m of drawn) expect(TILE_INSPECTOR_GROUP_WORDS[m[1] as Exclude<TileInspectorGroup, "top">].title).toBe(m[3]);
    // Nothing folds, nothing is summed up.
    for (const gone of ["ts-grp-tog", "ts-grp-row", "ts-grp-rest", "ts-grp-btn", "ts-grp-d"]) expect(flat(renderTileInspector(tileHost(tile("light.desk")).host)), gone).not.toContain(gone);
  });

  it("draw every part of the groups for a light, in the table's order", () => {
    const { host } = tileHost(tile("light.desk"));
    const text = flat(renderTileInspector(host));
    expect(partIds(cards(text))).toEqual(
      tileInspectorParts(host).filter((g) => g.group !== "top").flatMap((g) => g.parts).filter((p) => p !== "size"),
    );
    expect(partIds(cards(text))).toEqual(["iconLook", "whenOff", "glow", "background", "border", "text", "state", "action", "tapAnimation", "visibility"]);
  });

  it("count a changed part on the card, the top card's parts on none", () => {
    const text = flat(renderTileInspector(tileHost(tile("lock.front_door", { borderStyle: "line", color: "#FF0000" })).host));
    expect(topCard(text)).not.toContain("ts-grp-n");
    expect(text).toMatch(/<h3 class="ts-grp-t">Background and border<\/h3><span class="ts-grp-n"><i aria-hidden="true"><\/i>1 changed<\/span>/);
    expect(text).toMatch(/<h3 class="ts-grp-t">Look<\/h3><\/div>/);
  });
});

// ── the Solid and Gradient switch ────────────────────────────────────────

describe("the Solid and Gradient switch", () => {
  it("writes a gradient on Solid to Gradient, and a solid color on the way back", () => {
    const { host } = tileHost(tile("light.desk", { color: "#FF0000" }));
    const row = () => part(flat(renderTileInspector(host)), "color");
    expect(row()).toContain("Solid");
    expect(row()).toContain("Gradient");
    fire(renderTileInspector(host), ">Gradient</button>");
    const color = host.tile.color as string;
    expect(color).toMatch(/^GRADIENT\|#FF0000\|/);
    fire(renderTileInspector(host), ">Solid</button>");
    expect(host.tile.color).toBe("#FF0000");
  });

  it("is not on a Clear photo tile, unless it holds a gradient so it can be put back", () => {
    const clear = { iconPhotoId: "photo-1", iconPhotoLook: "clear" };
    const color = (extra: Record<string, unknown>) => part(flat(renderTileInspector(tileHost(tile("light.desk", extra)).host)), "color");
    expect(color({ ...clear, color: "#FF0000" })).not.toContain("ts-color-form");
    expect(color({ ...clear, color: "GRADIENT|#FF0000|#0000FF" })).toContain("ts-color-form");
    // Any other photo look, and a tile with no photo, keep it.
    expect(color({ iconPhotoId: "photo-1", color: "#FF0000" })).toContain("ts-color-form");
    expect(color({ color: "#FF0000" })).toContain("ts-color-form");
  });
});

