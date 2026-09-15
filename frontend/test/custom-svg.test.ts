// A drawing the author pasted onto an icon layer.
//
// The wire is the icon layer's own `path`, with `symbol` set to the marker
// `svg:custom` and an optional `viewBox` for a drawing that is not authored in
// the catalogue's 24x24 box. The rules about when a path is drawn are the ones
// `icon.test.ts` pins for Material Design icons, and they are ported from
// `resolveIcon` in the app repo, so the marker must not need any of its own.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import {
  CUSTOM_SVG_SYMBOL,
  ICON_MAX_PATH_BYTES,
  encodeConfig,
  isCustomSvgIcon,
  literal,
  newConfig,
  newElement,
  newRule,
  normalizeViewBox,
  parseConfig,
  parseSvgPaste,
  parseViewBox,
  type Element,
  type IconElement,
} from "../src/model.js";
import { renderLayout, type IconProvider } from "../src/renderer.js";
import { resolveAll, type EntityState, type ResolvedLayout } from "../src/resolver.js";

const TRIANGLE = "M12 2 L22 22 L2 22 Z";
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

function iconLayout(tweak: (p: IconElement) => void): ResolvedLayout {
  const cfg = newConfig("Icon", 0);
  const el = newElement("icon") as Extract<Element, { kind: "icon" }>;
  el.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
  tweak(el.payload);
  cfg.elements.push(el);
  const entityStates = new Map<string, EntityState>([
    ["switch.charger", { entityId: "switch.charger", state: "off", domain: "switch", iconName: "powerplug" }],
  ]);
  return resolveAll(cfg, { entityStates, templateResults: new Map(), namedValues: cfg.values }).rectangular!;
}

function iconOf(tweak: (p: IconElement) => void) {
  const el = iconLayout(tweak).elements.find((e) => e.kind === "icon");
  if (!el || el.kind !== "icon") throw new Error("no icon layer resolved");
  return el;
}

describe("parseSvgPaste", () => {
  it("takes a bare path and leaves the box alone", () => {
    const result = parseSvgPaste(`  ${TRIANGLE}  `);
    expect(result).toEqual({ ok: true, path: TRIANGLE });
  });

  it("takes the path and the box out of whole markup", () => {
    const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48">
      <path d="${TRIANGLE}" fill="red"/></svg>`;
    expect(parseSvgPaste(markup)).toEqual({ ok: true, path: TRIANGLE, viewBox: "0 0 48 48" });
  });

  it("joins every path in the markup, in document order", () => {
    const markup = `<svg viewBox="0 0 24 24"><path d="M0 0 H4 Z"/><g><path d='M8 8 H12 Z'/></g></svg>`;
    const result = parseSvgPaste(markup);
    expect(result.ok && result.path).toBe("M0 0 H4 Z M8 8 H12 Z");
  });

  it("drops the catalogue box rather than writing it out", () => {
    const result = parseSvgPaste(`<svg viewBox="0 0 24 24"><path d="${TRIANGLE}"/></svg>`);
    expect(result).toEqual({ ok: true, path: TRIANGLE });
  });

  it("refuses markup with no path in it", () => {
    const result = parseSvgPaste(`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>`);
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error).toMatch(/no <path>/);
  });

  it("refuses a string that is not a path", () => {
    expect(parseSvgPaste("hello there").ok).toBe(false);
    expect(parseSvgPaste("").ok).toBe(false);
  });

  it("refuses a path that never moves anywhere", () => {
    expect(parseSvgPaste("H4 V4 Z").ok).toBe(false);
  });

  it("refuses a path past the size cap", () => {
    const long = `M0 0 ${"L1 1 ".repeat(ICON_MAX_PATH_BYTES / 4)}Z`;
    const result = parseSvgPaste(long);
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error).toMatch(/8 KB/);
  });
});

describe("parseViewBox", () => {
  it("reads four numbers, commas or spaces", () => {
    expect(parseViewBox("0 0 48 48")).toEqual({ minX: 0, minY: 0, width: 48, height: 48 });
    expect(parseViewBox("-2,-4, 10 , 20")).toEqual({ minX: -2, minY: -4, width: 10, height: 20 });
  });

  it("falls back to the catalogue box for anything it cannot use", () => {
    const fallback = { minX: 0, minY: 0, width: 24, height: 24 };
    expect(parseViewBox(undefined)).toEqual(fallback);
    expect(parseViewBox("0 0 48")).toEqual(fallback);
    expect(parseViewBox("0 0 0 10")).toEqual(fallback);
    expect(parseViewBox("a b c d")).toEqual(fallback);
  });

  it("treats the catalogue box as the default that is never written", () => {
    expect(normalizeViewBox("0 0 24 24")).toBeUndefined();
    expect(normalizeViewBox("  ")).toBeUndefined();
    expect(normalizeViewBox(" 0 0 48 48 ")).toBe("0 0 48 48");
  });
});

describe("the custom drawing on the wire", () => {
  it("round-trips the path and its box, and leaves the box off at its default", () => {
    const cfg = newConfig("Icon", 0);
    const boxed = newElement("icon") as Extract<Element, { kind: "icon" }>;
    boxed.payload.symbol = literal(CUSTOM_SVG_SYMBOL);
    boxed.payload.path = TRIANGLE;
    boxed.payload.viewBox = "0 0 48 48";
    const plain = newElement("icon") as Extract<Element, { kind: "icon" }>;
    plain.payload.symbol = literal(CUSTOM_SVG_SYMBOL);
    plain.payload.path = TRIANGLE;
    cfg.elements.push(boxed, plain);

    const encoded = encodeConfig(cfg) as unknown as { elements: { payload: Record<string, unknown> }[] };
    expect(encoded.elements[0]!.payload.viewBox).toBe("0 0 48 48");
    expect("viewBox" in encoded.elements[1]!.payload).toBe(false);

    const back = parseConfig(encoded as unknown as Record<string, unknown>);
    const first = back.elements[0]!;
    if (first.kind !== "icon") throw new Error("expected an icon layer");
    expect(first.payload.viewBox).toBe("0 0 48 48");
    expect(isCustomSvgIcon(first.payload)).toBe(true);
  });

  it("reads a spelled-out catalogue box as the default", () => {
    const cfg = newConfig("Icon", 0);
    cfg.elements.push(newElement("icon") as Extract<Element, { kind: "icon" }>);
    const raw = encodeConfig(cfg) as unknown as { elements: { payload: Record<string, unknown> }[] };
    raw.elements[0]!.payload.viewBox = "0 0 24 24";
    const back = parseConfig(raw as unknown as Record<string, unknown>);
    const first = back.elements[0]!;
    if (first.kind !== "icon") throw new Error("expected an icon layer");
    expect(first.payload.viewBox).toBeUndefined();
  });
});

describe("resolving a custom drawing", () => {
  it("draws the path and carries its box", () => {
    const icon = iconOf((p) => {
      p.symbol = literal(CUSTOM_SVG_SYMBOL);
      p.path = TRIANGLE;
      p.viewBox = "0 0 48 48";
    });
    expect(icon.path).toBe(TRIANGLE);
    expect(icon.viewBox).toBe("0 0 48 48");
  });

  it("shows the placeholder when the marker has no path", () => {
    const icon = iconOf((p) => { p.symbol = literal(CUSTOM_SVG_SYMBOL); });
    expect(icon.symbol).toBe("questionmark.circle");
    expect(icon.path).toBeUndefined();
  });

  it("drops the path and its box when a rule swaps the icon", () => {
    const icon = iconOf((p) => {
      p.symbol = literal(CUSTOM_SVG_SYMBOL);
      p.path = TRIANGLE;
      p.viewBox = "0 0 48 48";
      const rule = newRule();
      rule.cases[0]!.when.tests[0]!.value = {
        kind: { kind: "entityState", entityId: "switch.charger", displayName: "Charger", domain: "switch" },
      };
      rule.cases[0]!.when.tests[0]!.comparison = { kind: "isOff" };
      rule.cases[0]!.then = [{ kind: "setIcon", value: literal("bolt.slash") }];
      p.rules = [rule];
    });
    expect(icon.symbol).toBe("bolt.slash");
    expect(icon.path).toBeUndefined();
    expect(icon.viewBox).toBeUndefined();
  });
});

describe("drawing the custom path", () => {
  it("scales by the box the drawing names, not by 24", () => {
    // A 48 unit box drawn at a 16 pt size (times the MDI factor) is half the
    // scale a 24 unit box would get, which is the whole point of the key.
    const layout = iconLayout((p) => {
      p.symbol = literal(CUSTOM_SVG_SYMBOL);
      p.path = TRIANGLE;
      p.size = 16;
      p.viewBox = "0 0 48 48";
    });
    const wide = flatten(renderLayout(layout, { icons: noIcons }));
    const small = flatten(renderLayout(iconLayout((p) => {
      p.symbol = literal(CUSTOM_SVG_SYMBOL);
      p.path = TRIANGLE;
      p.size = 16;
    }), { icons: noIcons }));
    // The scale on the group the path itself sits in, not the design box's own.
    const scaleOf = (svg: string) => Number(/scale\(([-\d.]+)\)">\s*<path/.exec(svg)?.[1]);
    expect(scaleOf(wide)).toBeCloseTo(scaleOf(small) / 2, 6);
  });
});
