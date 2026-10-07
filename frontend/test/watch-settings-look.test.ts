// The Watch settings dialog's look: the panel's own map of icons, tile names,
// detail lines and pictures (`watch-settings-look.ts`), held against the
// catalog it shares with the iPhone app so the two cannot drift, against the
// symbol file the panel ships, and against the dialog as it draws: tiles for
// a choice of up to five, a dropdown past that, an icon beside every title,
// and tiles that edit the form like the buttons they replaced.
//
// No DOM: the dialog's templates are flattened to text, and its tiles' click
// handlers are read out of the templates and called.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";

import { html } from "lit";
import { describe, expect, it } from "vitest";

import type { HassLike, OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import type { IconProvider } from "../src/renderer.js";
import { WatchSettings, watchSettingsStyles } from "../src/watch-settings-view.js";
import {
  type CatalogSetting,
  WATCH_SETTINGS_CATALOG,
  catalogSettings,
  dirtyKeys,
  optionsFor,
  watchBehaviorDefaults,
} from "../src/watch-settings.js";
import {
  MAX_TILES,
  WATCH_SETTING_LOOK,
  optionPreview,
  settingIcon,
  tileChoices,
  usesTiles,
} from "../src/watch-settings-look.js";

const settings = catalogSettings();
const byKey = (key: string): CatalogSetting => {
  const s = settings.find((x) => x.key === key);
  if (s === undefined) throw new Error(`no setting ${key}`);
  return s;
};

// ── reading templates ────────────────────────────────────────────────────

interface Tpl {
  strings: readonly string[];
  values: unknown[];
}

function isTpl(node: unknown): node is Tpl {
  return typeof node === "object" && node !== null && "strings" in node && "values" in node;
}

function flatten(node: unknown): string {
  if (node === undefined || node === null || typeof node === "symbol") return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (isTpl(node)) return node.strings.map((s, i) => s + (i < node.values.length ? flatten(node.values[i]) : "")).join("");
  if (typeof node === "function" || typeof node === "object") return "";
  return String(node);
}

/** Every template under `node` whose first string has `marker` in it. */
function templates(node: unknown, marker: string, out: Tpl[] = []): Tpl[] {
  if (Array.isArray(node)) for (const n of node) templates(n, marker, out);
  else if (isTpl(node)) {
    if (node.strings[0]!.includes(marker)) out.push(node);
    for (const v of node.values) templates(v, marker, out);
  }
  return out;
}

/** The function bound to `attr` in a template, such as `@click`. */
function bound(tpl: Tpl, attr: string): (...args: unknown[]) => unknown {
  const at = tpl.strings.findIndex((s) => s.trimEnd().endsWith(`${attr}=`));
  const fn = tpl.values[at];
  if (typeof fn !== "function") throw new Error(`no ${attr} in the template`);
  return fn as (...args: unknown[]) => unknown;
}

// ── the map against the catalog ──────────────────────────────────────────

describe("the look map", () => {
  it("has an entry for every catalog setting, and none for a setting the catalog does not have", () => {
    expect(Object.keys(WATCH_SETTING_LOOK).sort()).toEqual(settings.map((s) => s.key).sort());
  });

  it("has an entry for every choice of every enum setting, and none for a choice the catalog does not have", () => {
    for (const setting of settings) {
      const look = WATCH_SETTING_LOOK[setting.key]!;
      if (setting.type === "motionGestures") {
        expect(look.options, setting.key).toBeUndefined();
        expect(Object.keys(look.gestures ?? {}).sort(), setting.key).toEqual((setting.gestures ?? []).map((g) => g.value).sort());
        continue;
      }
      expect(look.gestures, setting.key).toBeUndefined();
      if (setting.type !== "enum" && setting.type !== "domains") {
        expect(look.options, setting.key).toBeUndefined();
        continue;
      }
      expect(Object.keys(look.options ?? {}).sort(), setting.key).toEqual((setting.options ?? []).map((o) => o.value).sort());
    }
  });

  it("names only symbols the panel ships", () => {
    const file = join(__dirname, "..", "..", "custom_components", "wrist_assistant", "frontend", "symbol-icons.json.gz");
    const shipped = new Set(Object.keys(JSON.parse(gunzipSync(readFileSync(file)).toString("utf8")) as Record<string, unknown>));
    const named = Object.values(WATCH_SETTING_LOOK).flatMap((l) => [
      l.icon, ...Object.values(l.options ?? {}).map((o) => o.icon), ...Object.values(l.gestures ?? {}).map((o) => o.icon),
    ]);
    const missing = [...new Set(named)].filter((n) => !shipped.has(n));
    expect(missing).toEqual([]);
  });

  it("keeps tile names short: no parenthesis, which the detail line is for", () => {
    for (const setting of settings.filter(usesTiles)) {
      for (const tile of tileChoices(setting, setting.options!, String(setting.default))) {
        expect(tile.name, `${setting.key} ${tile.value}`).not.toMatch(/[()]/);
      }
    }
  });

  it("copies the app's detail lines", () => {
    const details = (key: string) => tileChoices(byKey(key), byKey(key).options!, "").map((t) => t.detail);
    expect(details("longPressDuration")).toEqual(["75ms", "150ms", "200ms", "300ms", "1s"]);
    expect(details("entityRadialVerticalQuickRadialGestureSpeed")).toEqual(["0.35s", "0.45s", "0.60s", "0.80s"]);
    expect(details("entityRadialVerticalQuickRadialGestureTrigger")).toEqual([
      "Double vertical oscillation", "Swipe past center & back", "Circle gesture around center",
    ]);
    expect(details("popupBackgroundMaterial")).toEqual(["Most transparent", "Slightly opaque", "Balanced", "More opaque", "Most opaque"]);
  });
});

// ── tiles or a dropdown ──────────────────────────────────────────────────

describe("tiles", () => {
  it("draws a choice of up to five as tiles and a longer one as a dropdown", () => {
    for (const setting of settings) {
      const n = setting.options?.length ?? 0;
      expect(usesTiles(setting), setting.key).toBe(setting.type === "enum" && n <= MAX_TILES);
    }
    expect(usesTiles(byKey("longPressDuration"))).toBe(true);
    expect(usesTiles(byKey("popupBackgroundMaterial"))).toBe(true);
    expect(usesTiles(byKey("topSectionDoubleTapAction"))).toBe(false);
    expect(usesTiles(byKey("pullDownAction"))).toBe(false);
  });

  it("names a tile shortly and keeps the catalog's whole label for its tooltip", () => {
    const setting = byKey("longPressDuration");
    const tiles = tileChoices(setting, setting.options!, "Short");
    expect(tiles.map((t) => t.name)).toEqual(["Super fast", "Short", "Normal", "Long", "Extra long"]);
    expect(tiles[1]).toMatchObject({ value: "Short", title: "Short (150 ms)", icon: "hare.fill", on: true });
    expect(tiles.filter((t) => t.on)).toHaveLength(1);
  });

  it("gives a stored value the catalog does not list a tile of its own, picked, with the row's icon", () => {
    const setting = byKey("pageIndicatorStyle");
    const tiles = tileChoices(setting, optionsFor(setting, "Bars"), "Bars");
    expect(tiles.at(-1)).toEqual({ value: "Bars", name: "Bars", icon: settingIcon(setting), on: true });
    expect(tiles.slice(0, -1).every((t) => t.preview === "indicatorStyle" && !t.on)).toBe(true);
  });

  it("draws a different picture for each choice of a setting that has pictures", () => {
    for (const setting of settings.filter((s) => WATCH_SETTING_LOOK[s.key]!.preview !== undefined)) {
      const kind = WATCH_SETTING_LOOK[setting.key]!.preview!;
      const drawn = setting.options!.map((o) => flatten(optionPreview(kind, o.value)));
      expect(new Set(drawn).size, setting.key).toBe(drawn.length);
      // In the tile's own color, nothing literal.
      for (const d of drawn) expect(d).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    }
  });
});

// ── the dialog as it draws ───────────────────────────────────────────────

/** A provider that draws every name as a marked path, and remembers what
 * it was asked for. */
function fakeIcons() {
  const asked: string[] = [];
  const provider: IconProvider = {
    render: (name) => { asked.push(name); return html`<svg data-sf=${name}><path d="M0 0" /></svg>`; },
    available: () => true,
    names: () => [],
  };
  return { provider, asked };
}

const owner = (id: string): OwnerSummary => ({
  owner_watch_id: id,
  device_name: "Apple Watch",
  device_kind: "watch",
  paired_iphone_name: null,
  app_version: "3.1.0",
  screen_size: null,
  complication_count: 0,
  token: 1,
  is_orphan: false,
} as OwnerSummary);

interface Inside {
  open: boolean;
  ownerId?: string;
  record?: WatchConfigRecord;
  edits: ReadonlyMap<string, unknown>;
  helpOff: ReadonlySet<string>;
}

function dialog(document: Record<string, unknown> = watchBehaviorDefaults(), icons?: IconProvider) {
  const host = {
    addController: () => undefined,
    removeController: () => undefined,
    requestUpdate: () => undefined,
    updateComplete: Promise.resolve(true),
    renderRoot: { querySelector: () => null },
  };
  const ws = new WatchSettings(host as unknown as ConstructorParameters<typeof WatchSettings>[0], undefined, icons ? () => icons : undefined);
  const inside = ws as unknown as Inside;
  inside.open = true;
  inside.ownerId = "w1";
  inside.record = {
    kind: "behavior", revision: 3, hash: null, updated_at: null, updated_by: "panel",
    delivered_revision: 3, delivered_at: null, document,
  };
  const hass = { states: {}, user: { is_admin: true } } as unknown as HassLike;
  const owners = [owner("w1")];
  const tree = () => ws.render(hass, owners);
  return { ws, inside, tree, text: () => flatten(tree()) };
}

function tilesOf(tree: unknown, key: string): Tpl[] {
  const row = templates(tree, "ws-tile-row").find((t) => t.values.includes(key));
  if (row === undefined) throw new Error(`no tile row for ${key}`);
  return templates(row, `class="ws-tile `);
}

describe("the dialog", () => {
  it("draws every enum of up to five as a row of tile buttons, the rest as menus", () => {
    const { tree, text } = dialog({ ...watchBehaviorDefaults(), cameraRefreshOnOpen: true, showPageIndicator: true });
    const shown = text();
    const tiled = settings.filter(usesTiles).map((s) => s.key);
    // The bounce domains' strip is a tile row too, of switches rather than choices.
    const rows = templates(tree(), "ws-tile-row")
      .filter((t) => !t.values.includes("pendingAnimationDisabledDomains"))
      .map((t) => t.values.find((v) => typeof v === "string" && tiled.includes(v)));
    expect(rows.sort()).toEqual([...tiled].sort());
    // Three menus are left: the double-tap, double pinch and pull down
    // actions. The twists' menus are hidden while twists are off.
    expect(shown.match(/<select\b/g)).toHaveLength(3);
    expect(shown).not.toContain('class="seg wide"');
    const longPress = tilesOf(tree(), "longPressDuration").map(flatten);
    expect(longPress).toHaveLength(5);
    expect(longPress.every((t) => t.startsWith('<button type="button" class="ws-tile'))).toBe(true);
    expect(longPress.filter((t) => t.includes("aria-pressed=true"))).toHaveLength(1);
    expect(longPress[1]).toContain("aria-pressed=true");
    expect(longPress[1]).toContain('<span class="ws-tile-name">Short</span>');
    expect(longPress[1]).toContain('<span class="ws-tile-detail">150ms</span>');
    expect(shown).toContain('role="group" aria-label=Long press');
  });

  it("puts a fixed icon box in front of every title, filled once the symbols can draw", () => {
    const bare = dialog().text();
    const boxes = bare.match(/<span class=ws-ic aria-hidden="true">/g) ?? [];
    expect(boxes.length).toBeGreaterThan(0);
    const icons = fakeIcons();
    const drawn = dialog(watchBehaviorDefaults(), icons.provider).text();
    // The same boxes, now holding a symbol each: nothing moves when the
    // symbol file arrives.
    expect(drawn.match(/<span class=ws-ic aria-hidden="true">/g)).toHaveLength(boxes.length);
    for (const key of ["longPressDuration", "showPendingAnimation", "topSectionDoubleTapAction", "pageIndicatorColorHex"]) {
      expect(icons.asked).toContain(WATCH_SETTING_LOOK[key]!.icon);
    }
    expect(drawn).toContain("data-sf=hand.tap.fill");
  });

  it("draws a picture instead of an icon on the page indicator's tiles", () => {
    const { tree } = dialog({ ...watchBehaviorDefaults(), showPageIndicator: true });
    for (const key of ["pageIndicatorStyle", "pageIndicatorOpacity", "pageIndicatorPosition", "pageIndicatorSize", "popupBackgroundMaterial", "pageTransitionStyle"]) {
      for (const tile of tilesOf(tree(), key)) expect(flatten(tile), key).toContain('<svg class="ws-pv"');
    }
  });

  it("keeps the page indicator's rows in their box under Page dots", () => {
    const shown = dialog({ ...watchBehaviorDefaults(), showPageIndicator: true }).text();
    const parent = shown.indexOf("data-key=showPageIndicator");
    const open = shown.indexOf('<div class="fgroup">', parent);
    const next = shown.indexOf("data-key=pullDownAction", parent);
    expect(parent).toBeGreaterThan(0);
    expect(open).toBeGreaterThan(parent);
    for (const key of ["pageIndicatorStyle", "pageIndicatorOpacity", "pageIndicatorPosition", "pageIndicatorSize", "pageIndicatorColorHex"]) {
      const at = shown.indexOf(`data-key=${key}`);
      expect(at > open && at < next, key).toBe(true);
    }
  });

  it("edits the form when a tile is pressed, and undoes it when the saved choice is pressed again", () => {
    const { inside, tree } = dialog();
    const press = (key: string, value: string) => {
      const tile = tilesOf(tree(), key).find((t) => flatten(t).includes(`>${value}</span>`));
      if (tile === undefined) throw new Error(`no tile ${value}`);
      bound(tile, "@click")();
    };
    press("longPressDuration", "Long");
    expect(inside.edits.get("longPressDuration")).toBe("Long");
    expect(dirtyKeys(inside.record!.document, inside.edits as ReadonlyMap<string, string>)).toEqual(["longPressDuration"]);
    expect(flatten(tilesOf(tree(), "longPressDuration")[3])).toContain("aria-pressed=true");
    // The reset dot is offered while the row is away from its default.
    const row = flatten(templates(tree(), "ws-tile-row").find((t) => t.values.includes("longPressDuration")));
    expect(row).toContain("reset-dot");
    expect(row).toContain("Back to Short (150 ms)");
    press("longPressDuration", "Short");
    expect(inside.edits.size).toBe(0);
  });

  it("draws the bounce domains as tiles that each turn on and off, lit while they bounce", () => {
    const { inside, tree } = dialog({ ...watchBehaviorDefaults(), pendingAnimationDisabledDomains: ["fan", "scene"] });
    const row = templates(tree(), "ws-tile-row").find((t) => t.values.includes("pendingAnimationDisabledDomains"))!;
    const tiles = templates(row, `class="ws-tile `);
    // The catalog's fifteen, and a stored domain it does not list, unlit.
    expect(tiles).toHaveLength(16);
    const tile = (name: string) => tiles.find((t) => flatten(t).includes(`>${name}</span>`))!;
    expect(flatten(tile("Lights"))).toContain("aria-pressed=true");
    expect(flatten(tile("Fans"))).toContain("aria-pressed=false");
    expect(flatten(tile("scene"))).toContain("aria-pressed=false");
    bound(tile("Lights"), "@click")();
    expect(inside.edits.get("pendingAnimationDisabledDomains")).toEqual(["fan", "light", "scene"]);
    const again = templates(templates(tree(), "ws-tile-row").find((t) => t.values.includes("pendingAnimationDisabledDomains"))!, `class="ws-tile `);
    bound(again.find((t) => flatten(t).includes(">Lights</span>"))!, "@click")();
    expect(inside.edits.size).toBe(0);
    // Off with Pending animation.
    expect(dialog({ ...watchBehaviorDefaults(), showPendingAnimation: false }).text()).not.toContain("data-key=pendingAnimationDisabledDomains");
  });

  it("draws the wrist twists only while they are on: the fine tune, then a menu per twist and its scene", () => {
    expect(dialog().text()).not.toContain("data-key=motionGestureActionsJSON");
    const shown = dialog({
      ...watchBehaviorDefaults(),
      motionGestureSensitivity: "Medium",
      motionGestureSensitivityLevel: 6,
      motionGestureActionsJSON: '{"Twist Clockwise":"Activate Scene"}',
      motionGestureSceneTargetsJSON: '{"Twist Clockwise":"scene.evening"}',
    }).text();
    const parent = shown.indexOf("data-key=motionGestureSensitivity>");
    const open = shown.indexOf('<div class="fgroup">', parent);
    expect(parent).toBeGreaterThan(0);
    expect(open).toBeGreaterThan(parent);
    for (const key of ["motionGestureSensitivityLevel", "motionGestureActionsJSON:Twist Clockwise", "motionGestureActionsJSON:Twist Clockwise:scene", "motionGestureActionsJSON:Twist Counter-Clockwise"]) {
      expect(shown.indexOf(`data-key=${key}`), key).toBeGreaterThan(open);
    }
    expect(shown).not.toContain("data-key=motionGestureActionsJSON:Twist Counter-Clockwise:scene");
    expect(shown).toContain('type="range" min=1 max=10 step=0.5');
  });

  it("hides the tiles' help with the rest of the card's help, keeping it in the tile row", () => {
    const { inside, text } = dialog();
    inside.helpOff = new Set(["interaction"]);
    const shown = text();
    expect(shown).toContain('data-sec=ws-interaction data-open="true" data-help=off');
    const row = shown.slice(shown.indexOf("data-key=longPressDuration"));
    expect(row.indexOf('<div class="hint">Hold to open quick actions.</div>')).toBeLessThan(row.indexOf('class="ws-tiles"'));
  });
});

// ── the sheet ────────────────────────────────────────────────────────────

describe("the tiles' look", () => {
  const sheet = (watchSettingsStyles as unknown as { cssText: string }).cssText.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules = [...sheet.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ selector: m[1]!.trim(), body: m[2]! }));
  const tileRules = rules.filter((r) => /ws-(tile|tiles|head|ic|row)/.test(r.selector));

  it("is neutral: tokens only, no accent and no literal color", () => {
    expect(tileRules.length).toBeGreaterThan(5);
    for (const r of tileRules) {
      expect(r.body, r.selector).not.toMatch(/accent|teal|#[0-9a-f]{3,8}\b|rgba?\(/i);
    }
  });

  it("outlines the strip of choices and lifts the picked one to a raised grey with the brighter line", () => {
    const strip = tileRules.find((r) => r.selector === ".ws-tiles")!.body;
    expect(strip).toContain("border: 1px solid var(--wa-line-strong)");
    expect(strip).toContain("border-radius: 8px");
    const tile = tileRules.find((r) => r.selector === "button.ws-tile")!.body;
    expect(tile).toContain("--ws-tile-bg: var(--wa-field)");
    const on = tileRules.find((r) => r.selector === "button.ws-tile.on")!.body;
    expect(on).toContain("--ws-tile-bg: color-mix(in srgb, var(--ws-hue, var(--wa-ink)) 16%, var(--wa-seg-on))");
    expect(on).toContain("color: var(--wa-ink)");
    expect(on).toContain("box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ws-hue, var(--wa-ink)) 45%, var(--wa-seg-on))");
  });
});

// The catalog is the shared one, untouched in shape.
it("leaves the shared catalog's shape alone", () => {
  for (const section of WATCH_SETTINGS_CATALOG.sections) {
    for (const s of section.settings) {
      expect(Object.keys(s).every((k) => [
        "key", "type", "label", "help", "default", "initial", "options", "domain", "min", "max", "step", "gestures", "sceneKey", "scriptKey", "showIf",
      ].includes(k)), s.key).toBe(true);
    }
  }
});
