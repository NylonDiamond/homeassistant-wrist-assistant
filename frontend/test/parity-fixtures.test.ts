// The parity fixtures (`fixtures-parity/`, README there): a real home's pages,
// made anonymous, laid out on the 46 mm watch and on a 393 pt phone exactly as the
// panel's previews lay them out, against how the app lays out the same
// tiles. The panel writes `tiles.json` (every One Look tile on every page,
// what it says and where the panel puts it); the app reads it, lays each
// tile out through `OneLookTileModel.kindLayout` with its real Inter and its
// real SF Symbol sizes, and writes `app.json`; this test then holds every
// number of the panel's to the app's, within half a point.
//
// To write `tiles.json` after changing `pages.json` or the panel's layout:
// WA_WRITE_PARITY_FIXTURES=1 npx vitest run test/parity-fixtures.test.ts,
// then the app's `./scripts/sync-complication-fixtures.sh --pull`,
// `TEST_RUNNER_WA_UPDATE_FIXTURES=1 ./scripts/test.sh OneLookParityTests`
// and `--push`.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";
import { svg } from "lit";
import { describe, expect, it, vi } from "vitest";

import type { HassEntityState } from "../src/ha-api.js";
import type { IconProvider } from "../src/renderer.js";
import { phoneModelForScreenSize, phonePagesLayout, phonePagesScreen } from "../src/phone-frame.js";
import { type WatchTemplateRender, watchTemplateColumns } from "../src/watch-pages/app-model.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { tileEntityId, tileKind } from "../src/watch-pages/model.js";
import {
  type WatchPagePreviewInput,
  watchPreviewLayout,
  watchPreviewSideInset,
  watchPreviewTopInset,
  watchReflowPage,
  watchTemplateTextScale,
  watchTemplateTileLook,
  watchTileOneLookModel,
} from "../src/watch-pages/preview.js";
import { TEMPLATE_FIT_METRICS, templateTextFit } from "../src/watch-pages/template-fit.js";
import { templateColumnRows, templateColumnsFontSize } from "../src/watch-pages/template-rows.js";
import { oneLookArrangeContent } from "../src/watch-pages/one-look/arrange.js";
import type { OneLookRect } from "../src/watch-pages/one-look/layout.js";
import { oneLookZoomFactor, oneLookZoomedCornerRadius } from "../src/watch-pages/one-look/metrics.js";
import { type OneLookPreviewModel, oneLookGlyphInkRect, oneLookPreviewMeasurer } from "../src/watch-pages/one-look/render.js";
import { SymbolSizes } from "../src/symbol-sizes.js";

const dir = join(__dirname, "fixtures-parity");
const WRITE = process.env.WA_WRITE_PARITY_FIXTURES === "1";
const TOLERANCE = 0.5;

interface Inputs {
  /** When the states were read. */
  snapshotAt: string;
  document: WatchPagesDocument;
  states: Record<string, { state: string; attributes: Record<string, unknown> }>;
  templates: Record<string, string>;
  photos: Record<string, { width: number; height: number }>;
  watch: { screen: { width: number; height: number } };
  /** The phone's screen, and whether it draws the iPhone look (else the
   * watch look). */
  phone: { screenSize: string; homeLook: boolean };
}

const inputs = JSON.parse(readFileSync(join(dir, "pages.json"), "utf8")) as Inputs;

// The states are a snapshot: a state read against the time ("Ran 5h ago")
// reads at the snapshot's time, so the files do not drift with the clock.
vi.useFakeTimers({ toFake: ["Date"] });
vi.setSystemTime(new Date(inputs.snapshotAt));

const shipped = join(__dirname, "..", "..", "custom_components", "wrist_assistant", "frontend");

/** The panel's own SF Symbols, as the panel's picture draws them, with the
 * devices' sizes it ships (`symbol-sizes.json.gz`, `SymbolSizes`). */
function bundledIcons(): IconProvider {
  const data = JSON.parse(gunzipSync(readFileSync(join(shipped, "symbol-icons.json.gz"))).toString("utf8")) as Record<string, [string, string]>;
  const sizes = new SymbolSizes(() => {});
  const sizesFile = join(shipped, "symbol-sizes.json.gz");
  sizes.fill(existsSync(sizesFile) ? JSON.parse(gunzipSync(readFileSync(sizesFile)).toString("utf8")) : {});
  return {
    imageSize: (name: string) => sizes.get(name),
    render: (name: string, size: number, colorHex: string) => {
      const icon = data[name.trim()];
      return icon === undefined ? undefined
        : svg`<svg x="0" y="0" width=${size} height=${size} viewBox=${icon[1]}><path d=${icon[0]} fill=${colorHex} /></svg>`;
    },
    available: () => true,
    names: () => Object.keys(data),
  } as unknown as IconProvider;
}

const icons = bundledIcons();

function statesOf(): Record<string, HassEntityState> {
  const out: Record<string, HassEntityState> = {};
  for (const [id, s] of Object.entries(inputs.states)) out[id] = { entity_id: id, state: s.state, attributes: s.attributes, last_changed: "", last_updated: "" };
  return out;
}

function templatesOf(): Map<string, WatchTemplateRender> {
  const pages = inputs.document.pages as WatchPage[];
  const map = new Map<string, WatchTemplateRender>();
  for (const page of pages) {
    for (const tile of page.items as WatchPageTile[]) {
      const value = typeof tile.id === "string" ? inputs.templates[tile.id] : undefined;
      if (value !== undefined && typeof tile.templateString === "string") map.set(tile.id as string, { text: tile.templateString, result: { ok: true, value } });
    }
  }
  return map;
}

type Device = "watch" | "iphone";
/** How the files name a device. */
const fileDevice = (device: Device) => (device === "iphone" ? "phone" : "watch");

/** The preview's input for a page on a device, as the page editor builds it. */
function inputFor(page: WatchPage, device: Device): WatchPagePreviewInput {
  const pages = inputs.document.pages as WatchPage[];
  const base = {
    page, pages, states: statesOf(), icons, scale: 1, appVersion: "3.2.0", stateMode: "live" as const,
    templates: templatesOf(),
    photo: (id: string) => (inputs.photos[id] === undefined ? undefined : `blob:${id}`),
    photoSize: (id: string) => inputs.photos[id],
  };
  if (device === "watch") return { ...base, screen: inputs.watch.screen } as WatchPagePreviewInput;
  const phone = phonePagesLayout(phoneModelForScreenSize(inputs.phone.screenSize), { look: inputs.phone.homeLook ? "iphone" : "watch" });
  return { ...base, screen: phonePagesScreen(phone), phone } as WatchPagePreviewInput;
}

interface Entry {
  key: string;
  page: string;
  device: "watch" | "phone";
  tile: WatchPageTile;
  unit: number;
  cell: { width: number; height: number };
  drawn: { width: number; height: number };
  /** The page look the old sizes are read in: the phone's own look, or the
   * watch's. */
  homeLook: boolean;
  model: Record<string, unknown>;
}

const r4 = (v: number) => Math.round(v * 10000) / 10000;
const rect4 = (r: OneLookRect | undefined) => r === undefined ? undefined : { x: r4(r.x), y: r4(r.y), width: r4(r.width), height: r4(r.height) };
const up = (r: OneLookRect | undefined, z: number) => r === undefined ? undefined : rect4({ x: r.x * z, y: r.y * z, width: r.width * z, height: r.height * z });

/** Every One Look tile the previews draw, with the model the app is given. */
function entries(): { entry: Entry; model: OneLookPreviewModel; input: WatchPagePreviewInput }[] {
  const out: { entry: Entry; model: OneLookPreviewModel; input: WatchPagePreviewInput }[] = [];
  for (const page of inputs.document.pages as WatchPage[]) {
    for (const device of ["watch", "iphone"] as const) {
      const input = inputFor(page, device);
      const packed = watchReflowPage(page, input.states, 12, input.templates, device);
      const layout = watchPreviewLayout(packed, input.screen, { sideInset: watchPreviewSideInset(input), topInset: watchPreviewTopInset(input) });
      for (const placed of layout.tiles) {
        const cell = { width: placed.width, height: placed.height };
        const model = watchTileOneLookModel(placed.tile, cell, input, layout.unit);
        if (model === undefined) continue;
        const z = model.zoom;
        const ks = model.kind;
        const entry: Entry = {
          key: `${String(page.id)}/${String(placed.tile.id)}/${fileDevice(device)}`,
          page: String(page.id), device: fileDevice(device), tile: placed.tile,
          unit: r4(layout.unit), cell: { width: r4(cell.width), height: r4(cell.height) },
          drawn: { width: r4(model.layout.size.width * z), height: r4(model.layout.size.height * z) },
          homeLook: device === "iphone" && inputs.phone.homeLook,
          // What the tile says, from the panel's kind rules (`oneLookTileState`):
          // the app lays out exactly this.
          model: {
            name: model.name, icon: model.baseIcon, filled: ks.filled,
            // The symbol as drawn (its fill, outline or slashed form).
            drawnIcon: model.icon,
            state: ks.state, stateHidden: ks.stateHidden,
            ...(ks.stateWithoutBig === undefined ? {} : { stateWithoutBig: ks.stateWithoutBig }),
            ...(ks.bigValue === undefined ? {} : { bigValue: ks.bigValue }),
            accessory: ks.accessory, role: ks.role, keepsBarRoom: ks.keepsBarRoom,
            ...(ks.barLevel === undefined ? {} : { barLevel: ks.barLevel }),
            isUnavailable: ks.isUnavailable, isCalm: ks.isCalm,
            picture: model.picture, photo: model.photo !== undefined,
            ...(model.cutout === undefined ? {} : { cutoutAspect: model.cutout.aspect ?? null }),
            chart: model.chart !== undefined,
            ...(ks.stateKey === undefined ? {} : { stateKey: ks.stateKey }),
          },
        };
        out.push({ entry, model, input });
      }
    }
  }
  return out;
}

/** The numbers compared, in the drawn tile's points. */
function numbers(model: OneLookPreviewModel, input: WatchPagePreviewInput, unit: number) {
  const z = model.zoom;
  const l = model.layout;
  const platform = model.platform;
  const measurer = oneLookPreviewMeasurer(model.device, icons);
  const arranged: Record<string, unknown> = {};
  for (const [part, placed] of Object.entries(model.arrange ?? {})) {
    if (placed !== undefined) arranged[part] = { rect: up(placed.rect, z), scale: placed.scale, hidden: placed.hidden };
  }
  void input;
  // Where the glyph's ink is drawn, as the picture draws it (`discLayer`,
  // `glyphMark`): only a symbol glyph, not a photo or a picture.
  let drawnInk: Record<string, number> | undefined;
  const placed = model.arrange?.icon;
  if (model.icon !== "" && model.photo === undefined && model.cutout === undefined && model.picture === "none" && l.glyphSize > 0 && placed?.hidden !== true) {
    const rect = placed?.rect ?? l.discRect;
    const g = l.glyphSize * (placed?.scale ?? 1);
    const fit = oneLookGlyphInkRect(icons, model.icon, g, { oldPlace: l.glyphAtOldPlace, extent: l.glyphExtent });
    if (fit !== undefined) {
      const x0 = rect.x + rect.width / 2 - g / 2;
      const y0 = rect.y + rect.height / 2 - g / 2;
      drawnInk = up({ x: x0 + fit.ink.x, y: y0 + fit.ink.y, width: fit.ink.width, height: fit.ink.height }, z);
    }
  }
  return {
    drawnInk,
    mode: l.mode,
    size: { width: r4(l.size.width * z), height: r4(l.size.height * z) },
    disc: up(l.discRect, z), ink: up(l.glyphInk, z), glyphSize: r4(l.glyphSize * z),
    text: up({ x: l.textOrigin.x, y: l.textOrigin.y, width: l.textWidth, height: l.textHeight }, z),
    nameSize: r4(l.name.size * z), nameLines: l.name.lines,
    state: up(l.stateRect, z), stateSize: l.state === undefined ? undefined : r4(l.state.size * z),
    bar: up(l.barRect, z), accessory: l.accessory, accessoryRect: up(l.accessoryRect, z),
    content: up(oneLookArrangeContent(l), z),
    radius: r4(oneLookZoomedCornerRadius(platform, { width: l.size.width * z, height: l.size.height * z }, unit)),
    arranged,
    glyph: model.baseIcon === "" ? undefined : { aspect: r4(measurer.glyphAspect?.(model.baseIcon) ?? 1), extent: r4(measurer.glyphExtent?.(model.baseIcon) ?? 1.25) },
  };
}

describe("the parity fixtures: the previews draw a real home's tiles as the devices do", () => {
  const all = entries();

  it("finds One Look tiles on both devices", () => {
    expect(all.filter((e) => e.entry.device === "watch").length).toBeGreaterThan(20);
    expect(all.filter((e) => e.entry.device === "phone").length).toBeGreaterThan(20);
  });

  it("fits a template on the iPhone as the watch does, at the tile's room over the zoom", () => {
    let checked = 0;
    for (const page of inputs.document.pages as WatchPage[]) {
      const input = inputFor(page, "iphone");
      const packed = watchReflowPage(page, input.states, 12, input.templates, "iphone");
      const layout = watchPreviewLayout(packed, input.screen, { sideInset: watchPreviewSideInset(input), topInset: watchPreviewTopInset(input) });
      for (const placed of layout.tiles) {
        if (tileKind(tileEntityId(placed.tile)) !== "template") continue;
        const look = watchTemplateTileLook(placed.tile, input);
        if (look.kind !== "text" || look.pending) continue;
        const z = oneLookZoomFactor("phone", layout.unit);
        expect(z).toBeGreaterThan(1.5);
        const lines = typeof placed.tile.templateLines === "number" ? Math.min(8, Math.max(1, Math.round(placed.tile.templateLines))) : 5;
        const rows = templateColumnRows(look.text, watchTemplateColumns(placed.tile))?.slice(0, lines);
        const body = TEMPLATE_FIT_METRICS.watch;
        const want = rows === undefined
          ? templateTextFit(look.text, placed.width / z - 8, placed.height / z, lines, "watch").size / body.body
          : templateColumnsFontSize(rows, placed.width / z - 8, placed.height / z, body.columnsBody, "watch") / body.columnsBody;
        expect(watchTemplateTextScale(placed.tile, placed.width, placed.height, input, layout.unit)).toBeCloseTo(want, 6);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  if (WRITE) {
    it("writes tiles.json", () => {
      const tiles = all.map(({ entry, model, input }) => ({ ...entry, panel: numbers(model, input, entry.unit) }));
      writeFileSync(join(dir, "tiles.json"), `${JSON.stringify({ tiles }, null, 1)}\n`);
      // Every symbol the panel ships and every one these tiles name, for the
      // app to measure (`symbol-sizes.json`, `build-symbol-sizes.mjs`).
      const data = JSON.parse(gunzipSync(readFileSync(join(shipped, "symbol-icons.json.gz"))).toString("utf8")) as Record<string, unknown>;
      const names = new Set([...Object.keys(data), ...all.map((e) => String(e.entry.model.icon ?? "")).filter((n) => n !== "")]);
      writeFileSync(join(dir, "symbols.json"), `${JSON.stringify([...names].sort(), null, 0)}\n`);
    });
    return;
  }

  const appFile = join(dir, "app.json");
  const app = existsSync(appFile) ? (JSON.parse(readFileSync(appFile, "utf8")) as { tiles: Record<string, ReturnType<typeof numbers>> }).tiles : undefined;

  it("has the app's layout of every tile", () => {
    expect(app, "app.json: run the app's OneLookParityTests with TEST_RUNNER_WA_UPDATE_FIXTURES=1, then --push").toBeDefined();
    for (const { entry } of all) expect(app?.[entry.key], entry.key).toBeDefined();
  });

  const close = (got: unknown, want: unknown, what: string) => {
    if (want === undefined || want === null) {
      expect(got ?? undefined, what).toBeUndefined();
      return;
    }
    if (typeof want === "number") {
      expect(typeof got, what).toBe("number");
      expect(Math.abs((got as number) - want), `${what}: panel ${String(got)}, app ${want}`).toBeLessThanOrEqual(TOLERANCE);
      return;
    }
    if (typeof want === "object" && !Array.isArray(want)) {
      expect(got, what).toBeDefined();
      for (const [k, v] of Object.entries(want as Record<string, unknown>)) close((got as Record<string, unknown>)[k], v, `${what}.${k}`);
      return;
    }
    expect(got, what).toEqual(want);
  };

  for (const { entry, model, input } of all) {
    const kind = tileKind(tileEntityId(entry.tile));
    it(`${entry.device} ${kind} "${String(model.name)}" (${entry.tile.colSpan}x${entry.tile.rowSpan}) matches the app`, () => {
      const want = app?.[entry.key];
      if (want === undefined) return;
      const got = numbers(model, input, entry.unit);
      close(got, want, entry.key);
    });
  }
});
