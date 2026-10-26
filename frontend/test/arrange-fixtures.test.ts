// The shared Arrangement fixtures (`fixtures-arrange/`, README there): each
// file holds a tile, the native rects of its icon, name and state that One
// Look's centred layout gave it, its `arrange` key, and where each part
// lands. The iPhone and watch apps copy the folder byte for byte and check
// the same placement math against it.
//
// Two checks per file: the pure math (`arrangePartRect`, `arrangeNameAlign`)
// gives the expected rects from the file's own inputs, which is what the
// apps check; and the panel's layout still gives the native rects the file
// says, and draws them where the file says, so a drift in either shows.
//
// To write the computed fields after changing a file's inputs (its tile,
// states or arrange) or the layout: WA_WRITE_ARRANGE_FIXTURES=1 npx vitest
// run test/arrange-fixtures.test.ts, then read the diff.

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type { HassEntityState } from "../src/ha-api.js";
import type { WatchPage, WatchPageTile } from "../src/watch-pages/model.js";
import { arrangeFrame } from "../src/watch-pages/arrange-model.js";
import {
  ARRANGE_PARTS,
  type ArrangePart,
  arrangeNameAlign,
  arrangePartRect,
  normalizeTileArrange,
  oneLookArrangeContent,
  oneLookArrangeNative,
} from "../src/watch-pages/one-look/arrange.js";
import type { OneLookRect } from "../src/watch-pages/one-look/layout.js";

const dir = join(__dirname, "fixtures-arrange");
const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
const WRITE = process.env.WA_WRITE_ARRANGE_FIXTURES === "1";

interface Rect { x: number; y: number; width: number; height: number }
interface Placed { rect: Rect; scale: number; hidden: boolean; align?: string }
interface Fixture {
  name: string;
  about: string;
  device: "watch" | "iphone";
  tile: WatchPageTile;
  states: Record<string, { state: string; attributes: Record<string, unknown> }>;
  arrange: unknown;
  cell?: { width: number; height: number };
  unit?: number;
  size?: { width: number; height: number };
  applies?: boolean;
  content?: Rect;
  native?: Partial<Record<ArrangePart, Rect>>;
  expected?: Partial<Record<ArrangePart, Placed>>;
}

const r4 = (v: number) => Math.round(v * 10000) / 10000;
const rect4 = (r: OneLookRect): Rect => ({ x: r4(r.x), y: r4(r.y), width: r4(r.width), height: r4(r.height) });

function closeRect(got: OneLookRect | undefined, want: Rect | undefined, what: string): void {
  expect(got, what).toBeDefined();
  expect(want, what).toBeDefined();
  for (const k of ["x", "y", "width", "height"] as const) expect(got![k], `${what}.${k}`).toBeCloseTo(want![k], 3);
}

/** The fixture's tile drawn on its own page, as the Arrangement card and the
 * stage lay it out, with live states. */
function frameOf(f: Fixture, withArrange: boolean) {
  const tile: WatchPageTile = withArrange ? { ...f.tile, arrange: f.arrange } : { ...f.tile };
  const page: WatchPage = { id: "A11A0000-0000-4000-8000-0000000000AA", name: "Arrange", items: [tile] };
  const states: Record<string, HassEntityState> = {};
  for (const [id, s] of Object.entries(f.states)) states[id] = { entity_id: id, state: s.state, attributes: s.attributes, last_changed: "", last_updated: "" };
  const frame = arrangeFrame({ page, pages: [page], device: f.device, states, stateMode: "live" }, tile);
  if (frame === undefined) throw new Error(`${f.name}: the tile is not on its page`);
  return frame;
}

/** What the file's computed fields are now. */
function computed(f: Fixture): Required<Pick<Fixture, "cell" | "unit" | "size" | "applies" | "content" | "native" | "expected">> {
  const { cell, unit, model } = frameOf(f, false);
  if (model === undefined) throw new Error(`${f.name}: not drawn in One Look`);
  const layout = model.layout;
  const applies = layout.mode === "centred";
  const read = normalizeTileArrange(f.arrange);
  const content = rect4(oneLookArrangeContent(layout));
  const native: Partial<Record<ArrangePart, Rect>> = {};
  const expected: Partial<Record<ArrangePart, Placed>> = {};
  if (applies) {
    const rects = oneLookArrangeNative(layout);
    for (const part of ARRANGE_PARTS) {
      const r = rects[part];
      if (r === undefined) continue;
      native[part] = rect4(r);
      const entry = read?.parts[part];
      const placed = arrangePartRect(layout.size, content, native[part]!, part, entry);
      expected[part] = {
        rect: rect4(placed.rect), scale: placed.scale, hidden: placed.hidden,
        ...(part === "name" ? { align: arrangeNameAlign(entry, "center") } : {}),
      };
    }
  }
  return {
    cell: { width: r4(cell.width), height: r4(cell.height) }, unit: r4(unit),
    size: { width: r4(layout.size.width), height: r4(layout.size.height) },
    applies, content, native, expected,
  };
}

describe("the shared Arrangement fixtures", () => {
  it("has the files the README lists", () => {
    expect(files.length).toBeGreaterThanOrEqual(8);
    const readme = readFileSync(join(dir, "README.md"), "utf8");
    for (const file of files) expect(readme, file).toContain(file);
  });

  for (const file of files) {
    const path = join(dir, file);
    const f = JSON.parse(readFileSync(path, "utf8")) as Fixture;

    if (WRITE) {
      it(`writes ${file}`, () => {
        const c = computed(f);
        // A tile Free does not place has no content box, native rects or
        // expected places: the apps only check that they ignore its key.
        const out = {
          name: f.name, about: f.about, device: f.device, tile: f.tile, states: f.states,
          cell: c.cell, unit: c.unit, size: c.size, applies: c.applies,
          ...(c.applies ? { content: c.content, native: c.native } : {}),
          arrange: f.arrange,
          ...(c.applies ? { expected: c.expected } : {}),
        };
        writeFileSync(path, `${JSON.stringify(out, null, 2)}\n`);
      });
      continue;
    }

    describe(file, () => {
      it("is named after its file", () => {
        expect(`${f.name}.json`).toBe(file);
      });

      it("places every part by the shared math, from the file's own inputs", () => {
        const read = normalizeTileArrange(f.arrange);
        expect(read, "the arrange key reads").toBeDefined();
        for (const part of ARRANGE_PARTS) {
          const native = f.native?.[part];
          const want = f.expected?.[part];
          if (native === undefined) {
            expect(want, part).toBeUndefined();
            continue;
          }
          const entry = read?.parts[part];
          const got = arrangePartRect(f.size!, f.content!, native, part, entry);
          closeRect(got.rect, want?.rect, `${part}.rect`);
          expect(got.scale, `${part}.scale`).toBe(want!.scale);
          expect(got.hidden, `${part}.hidden`).toBe(want!.hidden);
          if (part === "name") expect(arrangeNameAlign(entry, "center"), "name.align").toBe(want!.align);
        }
      });

      it("matches the panel's layout (native rects, content box, size)", () => {
        const c = computed(f);
        expect(c.applies).toBe(f.applies);
        expect(c.cell.width).toBeCloseTo(f.cell!.width, 3);
        expect(c.cell.height).toBeCloseTo(f.cell!.height, 3);
        expect(c.unit).toBeCloseTo(f.unit!, 3);
        expect(c.size.width).toBeCloseTo(f.size!.width, 3);
        expect(c.size.height).toBeCloseTo(f.size!.height, 3);
        if (f.applies !== true) {
          expect(f.content ?? f.native ?? f.expected).toBeUndefined();
          return;
        }
        closeRect(c.content, f.content, "content");
        expect(Object.keys(c.native).sort()).toEqual(Object.keys(f.native ?? {}).sort());
        for (const [part, r] of Object.entries(c.native)) closeRect(r, f.native![part as ArrangePart], `native.${part}`);
      });

      it("is drawn where the file says, or ignored where Free is not offered", () => {
        const model = frameOf(f, true).model!;
        if (f.applies !== true) {
          expect(model.arrange).toBeUndefined();
          return;
        }
        for (const part of ARRANGE_PARTS) {
          const want = f.expected?.[part];
          const got = model.arrange?.[part];
          const listed = normalizeTileArrange(f.arrange)?.parts[part] !== undefined;
          if (want === undefined || !listed) {
            expect(got, part).toBeUndefined();
            continue;
          }
          closeRect(got?.rect, want.rect, `drawn ${part}`);
          expect(got!.hidden).toBe(want.hidden);
        }
      });
    });
  }
});
