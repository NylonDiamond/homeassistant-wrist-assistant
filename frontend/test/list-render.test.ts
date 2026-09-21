// Drawing a list: the cells land where the resolver put them, the row template
// is drawn inside each cell in the cell's own coordinates, a row tap is
// outlined once per row, and a list with no items draws nothing at all.
//
// The row layers keep the face's own point sizes, so a 12 pt font in a row is
// 12 pt whatever size the cell is. That is why the cell group only translates:
// scaling it would shrink every font and stroke in the row, which is not what
// the watch does.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import {
  type CustomComplicationConfig,
  type Element,
  type ListElement,
  type ListSource,
  type NormalizedFrame,
  type Value,
  legacyConfig,
  newConfig,
  newElement,
} from "../src/model.js";
import { listExpressionKey } from "../src/compiler.js";
import { CANVAS, renderLayerThumb, renderLayout, spotlightBoxes, type IconProvider, type RenderOptions } from "../src/renderer.js";
import { resolveAll, type ResolveContext, type ResolvedLayout } from "../src/resolver.js";

const noIcons: IconProvider = { render: () => undefined, available: () => false, names: () => undefined };

function flatten(node: unknown): string {
  if (node === undefined || node === null || node === nothing) return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (typeof node === "object" && "strings" in (node as Record<string, unknown>)) {
    const t = node as { strings: readonly string[]; values: unknown[] };
    return t.strings.map((s, i) => s + (i < t.values.length ? flatten(t.values[i]) : "")).join("");
  }
  return String(node);
}

function uuid(n: number): string {
  return `0000000${n}-0000-4000-8000-000000000000`.toUpperCase();
}

const FULL_FRAME: NormalizedFrame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };

/** A raw-template source, which is the cheapest one to feed: its reply is a
 * plain JSON array under a key the compiler works out from the text itself. */
const SOURCE: ListSource = { kind: "template", value: "{{ rooms }}" };

function item(field: string): Value {
  return { kind: { kind: "item", field } };
}

function listLayer(edit: (l: ListElement) => void = () => {}): Extract<Element, { kind: "list" }> {
  const el = newElement("list") as Extract<Element, { kind: "list" }>;
  el.payload.id = uuid(1);
  el.payload.frame = { ...FULL_FRAME };
  el.payload.gap = 0;
  el.payload.rows = 2;
  el.payload.source = SOURCE;
  edit(el.payload);
  return el;
}

function rowText(id: number, field: string, frame: NormalizedFrame = { ...FULL_FRAME }): Element {
  const el = newElement("text") as Extract<Element, { kind: "text" }>;
  el.payload.id = uuid(id);
  el.payload.value = item(field);
  el.payload.frame = frame;
  el.payload.fontSize = 12;
  return el;
}

function rowTap(id: number): Element {
  const el = newElement("tap") as Extract<Element, { kind: "tap" }>;
  el.payload.id = uuid(id);
  el.payload.frame = { ...FULL_FRAME };
  el.payload.action = { type: "toggleEntity", entityId: "{item.entityId}", displayName: "{item.name}", domain: "" };
  return el;
}

const ITEMS = '[{"name": "Kitchen", "entityId": "light.kitchen"}, {"name": "Hall", "entityId": "light.hall"}]';

function context(rows = 2, text: string = ITEMS): ResolveContext {
  return {
    entityStates: new Map(),
    templateResults: new Map([[listExpressionKey(SOURCE, rows)!, text]]),
    namedValues: [],
  };
}

function layoutOf(cfg: CustomComplicationConfig, ctx: ResolveContext, family: "rectangular" | "large" = "rectangular"): ResolvedLayout {
  return resolveAll(cfg, ctx)[family]!;
}

function documentWith(...template: Element[]): CustomComplicationConfig {
  const cfg = legacyConfig("Rooms", 0, ["rectangular", "large"]);
  cfg.supportedFamilies = ["rectangular", "large"];
  cfg.elements = [listLayer((l) => { l.template = template; })];
  return cfg;
}

function draw(cfg: CustomComplicationConfig, ctx: ResolveContext, opts: Partial<RenderOptions> = {}): string {
  return flatten(renderLayout(layoutOf(cfg, ctx), { icons: noIcons, showHidden: true, ...opts }));
}

/** The `translate(x y)` of every cell group, in design points. */
function cellOrigins(svg: string): [number, number][] {
  return [...svg.matchAll(/data-list-cell transform="translate\((-?[\d.]+) (-?[\d.]+)\)"/g)]
    .map((m) => [Number(m[1]), Number(m[2])] as [number, number]);
}

const round = (n: number) => Math.round(n * 1000) / 1000;

describe("a list's cells", () => {
  it("stacks them down the list's own frame, one per item", () => {
    const svg = draw(documentWith(rowText(2, "name")), context());
    const box = CANVAS.rectangular;
    expect(cellOrigins(svg)).toEqual([[0, 0], [0, box.height / 2]]);
  });

  it("puts them where the list's frame is, not where the face is", () => {
    const cfg = documentWith(rowText(2, "name"));
    (cfg.elements[0]!.payload as ListElement).frame = { x: 0.25, y: 0.5, width: 0.5, height: 0.4, rotationDegrees: 0 };
    const box = CANVAS.rectangular;
    const origins = cellOrigins(draw(cfg, context()));
    expect(origins.map(([x, y]) => [round(x), round(y)])).toEqual([
      [round(0.25 * box.width), round(0.5 * box.height)],
      [round(0.25 * box.width), round((0.5 + 0.2) * box.height)],
    ]);
  });

  it("lays them across when the list runs across", () => {
    const cfg = documentWith(rowText(2, "name"));
    (cfg.elements[0]!.payload as ListElement).direction = "across";
    const box = CANVAS.rectangular;
    expect(cellOrigins(draw(cfg, context()))).toEqual([[0, 0], [box.width / 2, 0]]);
  });

  it("fills a grid row-major when the list has columns", () => {
    const four = '[{"name": "A"}, {"name": "B"}, {"name": "C"}, {"name": "D"}]';
    const cfg = documentWith(rowText(2, "name"));
    const list = cfg.elements[0]!.payload as ListElement;
    list.rows = 4;
    list.columns = 2;
    const box = CANVAS.rectangular;
    expect(cellOrigins(draw(cfg, context(4, four)))).toEqual([
      [0, 0], [box.width / 2, 0],
      [0, box.height / 2], [box.width / 2, box.height / 2],
    ]);
  });

  it("draws the same list on a Home Screen tile, at that tile's own box", () => {
    const svg = draw(documentWith(rowText(2, "name")), context(), { slot: CANVAS.large });
    // The large tile is much taller than the rectangular slot, so the second
    // cell starts much further down.
    expect(cellOrigins(svg)).toEqual([[0, 0], [0, CANVAS.rectangular.height / 2]]);
    const large = flatten(renderLayout(layoutOf(documentWith(rowText(2, "name")), context(), "large"), { icons: noIcons }));
    expect(cellOrigins(large)).toEqual([[0, 0], [0, CANVAS.large.height / 2]]);
  });
});

describe("a list's row layers", () => {
  it("draws every row layer once per cell", () => {
    const svg = draw(documentWith(rowText(2, "name"), rowText(3, "entityId")), context());
    expect([...svg.matchAll(new RegExp(`data-element-id=${uuid(2)}`, "g"))]).toHaveLength(2);
    expect([...svg.matchAll(new RegExp(`data-element-id=${uuid(3)}`, "g"))]).toHaveLength(2);
    expect(svg).toContain("Kitchen");
    expect(svg).toContain("Hall");
  });

  it("keeps the face's point sizes, so a cell never shrinks the type", () => {
    const svg = draw(documentWith(rowText(2, "name")), context());
    expect([...svg.matchAll(/font-size=12\b/g)].length).toBeGreaterThanOrEqual(2);
    // The cell group translates and nothing else: a scale would take the font
    // with it.
    expect(svg).not.toMatch(/data-list-cell transform="translate\([^"]*\) scale/);
  });

  it("places a row layer's frame inside its own cell", () => {
    // A text across the right-hand half of the cell: its centre is three
    // quarters of the way across the cell, not across the face.
    const right: NormalizedFrame = { x: 0.5, y: 0, width: 0.5, height: 1, rotationDegrees: 0 };
    const svg = draw(documentWith(rowText(2, "name", right)), context());
    const box = CANVAS.rectangular;
    const centres = [...svg.matchAll(/rotate\(0 ([\d.]+) ([\d.]+)\)/g)].map((m) => Number(m[1]));
    expect(centres).toContain(0.75 * box.width);
  });

  it("dims a row layer hidden on this shape, and drops it when hidden layers are off", () => {
    const cfg = documentWith(rowText(2, "name"));
    cfg.perFamily.rectangular!.placements[uuid(2)] = { frame: { ...FULL_FRAME }, isHidden: true };
    expect(draw(cfg, context())).toContain(`data-element-id=${uuid(2)} opacity=0.35`);
    expect(draw(cfg, context(), { showHidden: false })).not.toContain(`data-element-id=${uuid(2)}`);
  });
});

describe("a row tap", () => {
  it("is outlined once per row in review mode, and the cells then take clicks", () => {
    const svg = draw(documentWith(rowText(2, "name"), rowTap(3)), context(), { tapReview: true });
    expect([...svg.matchAll(new RegExp(`data-element-id=${uuid(3)}`, "g"))]).toHaveLength(2);
    expect([...svg.matchAll(/stroke="#FFD60A"/g)]).toHaveLength(2);
    // Review reads the face rather than moving it, so the cells drop the move
    // cursor: a tap box here is clicked to see what it does.
    expect(svg).not.toContain("cursor:move");
  });

  it("stays off the face with plain tap areas, so a finger is not stamped on every row", () => {
    // A free-standing tap on the face is drawn because nothing else marks it.
    // A row tap is repeated per cell, and the Row card already names it.
    const svg = draw(documentWith(rowText(2, "name"), rowTap(3)), context(), { tapAreas: true });
    expect(svg).not.toContain(`data-element-id=${uuid(3)}`);
    expect(svg).not.toContain("#FFD60A");
  });

  it("draws nothing at all without them, exactly as the watch does", () => {
    const svg = draw(documentWith(rowText(2, "name"), rowTap(3)), context());
    expect(svg).not.toContain(`data-element-id=${uuid(3)}`);
    expect(svg).not.toContain("#FFD60A");
  });

  it("marks every cell with the move cursor outside review mode", () => {
    // The cells take the pointer, so a double click on a row can open the row
    // designer on the layer it landed on. A plain press is sent to the list by
    // the editor, and the cursor says so before the press happens.
    const svg = draw(documentWith(rowText(2, "name")), context());
    // `flatten` pastes attribute values in unquoted.
    expect([...svg.matchAll(/data-list-cell [^>]*style=cursor:move/g)]).toHaveLength(2);
    expect(svg).not.toContain("pointer-events=none");
  });

  it("carries the row's own filled-in action into the review label", () => {
    const svg = draw(documentWith(rowTap(3)), context(), { tapReview: true });
    expect(svg).toContain("Kitchen");
    expect(svg).toContain("Hall");
    expect(svg).not.toContain("{item.");
  });
});

describe("a list with nothing in it", () => {
  it("draws no cells before the items arrive", () => {
    const ctx: ResolveContext = { entityStates: new Map(), templateResults: new Map(), namedValues: [] };
    const svg = draw(documentWith(rowText(2, "name")), ctx);
    expect(cellOrigins(svg)).toEqual([]);
    expect(svg).not.toContain(`data-element-id=${uuid(2)}`);
    // The list layer itself is still there, so it can be selected and moved.
    expect(svg).toContain(`data-element-id=${uuid(1)}`);
  });

  it("draws no cells when the reply holds no items", () => {
    const svg = draw(documentWith(rowText(2, "name")), context(2, "[]"));
    expect(cellOrigins(svg)).toEqual([]);
  });

  it("draws nothing for a hidden list", () => {
    const cfg = documentWith(rowText(2, "name"));
    cfg.elements[0]!.payload.isHidden = true;
    const svg = draw(cfg, context(), { showHidden: false });
    expect(svg).not.toContain(`data-element-id=${uuid(1)}`);
    expect(cellOrigins(svg)).toEqual([]);
  });
});

describe("a tinted face", () => {
  it("tints each row layer in its own group and adds nothing round the list", () => {
    const svg = draw(documentWith(rowText(2, "name")), context(), { tint: "#FF9F0A" });
    // Row text is plain on a tinted watch face, as any text is.
    expect([...svg.matchAll(/-tint-plain\)/g)].length).toBeGreaterThanOrEqual(2);
    // And the list adds none of its own: nothing between the list's group and
    // its first cell is a filter, so a row's white text is never repainted in
    // the accent by a filter wrapped round the whole list.
    const between = svg.slice(svg.indexOf(`data-element-id=${uuid(1)}`), svg.indexOf("data-list-cell"));
    expect(between).not.toContain("filter=");
  });
});

describe("a spotlight on a list", () => {
  it("cuts the list's whole frame out, which is where its rows are", () => {
    const cfg = documentWith(rowText(2, "name"));
    (cfg.elements[0]!.payload as ListElement).frame = { x: 0.1, y: 0.2, width: 0.5, height: 0.6, rotationDegrees: 0 };
    const layout = layoutOf(cfg, context());
    const box = CANVAS.rectangular;
    expect(spotlightBoxes(layout.elements, box, [uuid(1)]).map((b) => [round(b.box.x), round(b.box.y), round(b.box.w), round(b.box.h)]))
      .toEqual([[round(0.1 * box.width), round(0.2 * box.height), round(0.5 * box.width), round(0.6 * box.height)]]);
  });
});

describe("a list's thumbnail", () => {
  it("shows the whole list, cells and all", () => {
    const layout = layoutOf(documentWith(rowText(2, "name")), context());
    const svg = flatten(renderLayerThumb(layout, [uuid(1)], { icons: noIcons, width: 52, height: 36 }));
    expect(svg).toContain(`data-element-id=${uuid(1)}`);
    expect(cellOrigins(svg)).toHaveLength(2);
    expect(svg).toContain("Kitchen");
    expect(svg).toContain("Hall");
  });

  it("crops to the list's frame, which is the whole of what it draws", () => {
    const cfg = documentWith(rowText(2, "name"));
    (cfg.elements[0]!.payload as ListElement).frame = { x: 0.1, y: 0.1, width: 0.4, height: 0.8, rotationDegrees: 0 };
    const layout = layoutOf(cfg, context());
    const svg = flatten(renderLayerThumb(layout, [uuid(1)], { icons: noIcons, width: 52, height: 36 }));
    const box = CANVAS.rectangular;
    const viewBox = /viewBox=([-\d. ]+) /.exec(svg)?.[1]?.trim().split(" ").map(Number) ?? [];
    expect(viewBox[0]).toBeLessThan(0.1 * box.width);
    expect(viewBox[1]).toBeLessThan(0.1 * box.height);
    expect(viewBox[0]! + viewBox[2]!).toBeGreaterThan(0.5 * box.width);
  });
});
