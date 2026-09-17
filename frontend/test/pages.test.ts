// Pages on one complication: the wire, the two readings the app shares with the
// panel, the tour arithmetic and the resolver's page filter.
//
// The bytes matter most. A Swift `PagesSpec` decodes the same object, so a key
// this side writes when it should be absent, or a clamp that lands a step away
// from Swift's, is a contract break rather than a cosmetic difference. The tour
// numbers are pinned against arithmetic done by hand rather than against what
// the code happens to return, because both sides have to agree about which page
// is on screen at a given instant and neither can be the other's oracle.

import { describe, expect, it } from "vitest";
import {
  type CustomComplicationConfig,
  type Element,
  type PagesSpec,
  PAGES_MAX_COUNT,
  PAGE_DEFAULT_DWELL,
  PAGE_DWELL_RANGE,
  auditUnknownKeys,
  describeTapAction,
  dwellForPage,
  elementsOnPage,
  encodeConfig,
  encodePagesSpec,
  hasPages,
  layerDrawsOnPage,
  literal,
  newConfig,
  newElement,
  nextPageAfter,
  pageCountMoveNote,
  pageMoverExists,
  pagesSpecOf,
  parseConfig,
  parseLayerPage,
  parsePagesSpec,
  schemaVersionFor,
  setPageCount,
  setPageDwell,
  tourDuration,
  tourPageAt,
  tourSteps,
  usesPages,
  writtenDwell,
} from "../src/model.js";
import { type EntityState, type ResolveContext, resolveAll } from "../src/resolver.js";
import { exportText, parseImportText } from "../src/transfer.js";

/** A document with three text layers: one on every page, one on page 1, one on
 * page 2. `pages` is set only when `spec` is given, so the same builder makes
 * both halves of the `usesPages` rule. */
function pagedConfig(spec?: PagesSpec): CustomComplicationConfig {
  const cfg = newConfig("Pages", 0, ["rectangular", "inline"]);
  cfg.inline = { value: literal("Inline") };
  const text = (words: string, page?: number): Element => {
    const el = newElement("text") as Extract<Element, { kind: "text" }>;
    el.payload.value = literal(words);
    if (page !== undefined) el.payload.page = page;
    return el;
  };
  cfg.elements = [text("Shared"), text("One", 1), text("Two", 2)];
  if (spec) cfg.pages = spec;
  cfg.schemaVersion = schemaVersionFor(cfg);
  return cfg;
}

function emptyContext(page?: number): ResolveContext {
  return {
    entityStates: new Map(),
    templateResults: new Map(),
    namedValues: [],
    ...(page !== undefined ? { page } : {}),
  };
}

/** The document's `pages` object as `encodeConfig` writes it, or undefined. */
function encodedPages(cfg: CustomComplicationConfig): unknown {
  return (encodeConfig(cfg) as Record<string, unknown>).pages;
}

describe("the pages spec on the wire", () => {
  it("reads count, mode and dwell", () => {
    expect(parsePagesSpec({ count: 3, mode: "tour", dwell: [1, 3] }))
      .toEqual({ count: 3, mode: "tour", dwell: [1, 3] });
  });

  it("clamps the count to the ceiling", () => {
    expect(parsePagesSpec({ count: 9 })?.count).toBe(PAGES_MAX_COUNT);
    expect(PAGES_MAX_COUNT).toBe(4);
  });

  it("reads a count of one, and anything below it, as no pages at all", () => {
    expect(parsePagesSpec({ count: 1, mode: "tour" })).toBeUndefined();
    expect(parsePagesSpec({ count: 0 })).toBeUndefined();
    expect(parsePagesSpec({})).toBeUndefined();
    expect(parsePagesSpec("pages")).toBeUndefined();
  });

  it("clamps every dwell and trims the list to the count", () => {
    const spec = parsePagesSpec({ count: 2, dwell: [0.1, 99, 4, 5] });
    expect(spec?.dwell).toEqual([PAGE_DWELL_RANGE.min, PAGE_DWELL_RANGE.max]);
  });

  it("reads a dwell that is not a finite number as the default", () => {
    expect(parsePagesSpec({ count: 2, dwell: ["nan", null] })?.dwell)
      .toEqual([PAGE_DEFAULT_DWELL, PAGE_DEFAULT_DWELL]);
  });

  it("reads a mode it does not know as tap", () => {
    expect(parsePagesSpec({ count: 2, mode: "carousel" })?.mode).toBe("tap");
    expect(parsePagesSpec({ count: 2 })?.mode).toBe("tap");
  });

  it("writes a spec of one page as nothing", () => {
    expect(encodePagesSpec(undefined)).toBeUndefined();
    expect(encodePagesSpec({ count: 1, mode: "tour", dwell: [3] })).toBeUndefined();
  });

  it("writes dwell only when it says something", () => {
    expect(encodePagesSpec({ count: 2, mode: "tap", dwell: [] }))
      .toEqual({ count: 2, mode: "tap" });
    expect(encodePagesSpec({ count: 2, mode: "tour", dwell: [1] }))
      .toEqual({ count: 2, mode: "tour", dwell: [1] });
  });

  it("round trips through a whole document", () => {
    const cfg = pagedConfig({ count: 3, mode: "tour", dwell: [1, 3] });
    const encoded = encodeConfig(cfg);
    expect((encoded as Record<string, unknown>).pages).toEqual({ count: 3, mode: "tour", dwell: [1, 3] });
    const back = parseConfig(encoded);
    expect(back.pages).toEqual({ count: 3, mode: "tour", dwell: [1, 3] });
    expect(encodeConfig(back)).toEqual(encoded);
  });

  it("never writes pages for a document that has none", () => {
    const plain = newConfig("Plain", 0);
    expect(encodedPages(plain)).toBeUndefined();
    plain.pages = { count: 1, mode: "tap", dwell: [] };
    expect(encodedPages(plain)).toBeUndefined();
  });
});

describe("a layer's page on the wire", () => {
  it("reads a page below one as absent", () => {
    expect(parseLayerPage(0)).toBeUndefined();
    expect(parseLayerPage(-2)).toBeUndefined();
    expect(parseLayerPage(undefined)).toBeUndefined();
    expect(parseLayerPage("2")).toBeUndefined();
  });

  it("leaves a page above the count alone, because the count can change", () => {
    expect(parseLayerPage(9)).toBe(9);
  });

  it("is written only by a layer that names one", () => {
    const cfg = pagedConfig({ count: 2, mode: "tap", dwell: [] });
    const payloads = (encodeConfig(cfg) as { elements: { payload: Record<string, unknown> }[] }).elements
      .map((e) => e.payload);
    expect("page" in payloads[0]!).toBe(false);
    expect(payloads[1]!.page).toBe(1);
    expect(payloads[2]!.page).toBe(2);
  });

  it("is not read on a row layer inside a list", () => {
    const cfg = newConfig("List", 0, ["rectangular"]);
    const list = newElement("list");
    const row = newElement("text");
    (list.payload as { template: Element[] }).template = [row];
    cfg.elements = [list];
    const encoded = encodeConfig(cfg) as { elements: { payload: { template: { payload: Record<string, unknown> }[] } }[] };
    // A page written into a row by hand is dropped on the way back in, and the
    // audit is what reports it rather than letting the save eat it.
    encoded.elements[0]!.payload.template[0]!.payload.page = 2;
    const back = parseConfig(encoded);
    const template = (back.elements[0]!.payload as { template: Element[] }).template;
    expect(template[0]!.payload.page).toBeUndefined();
    expect(auditUnknownKeys(encoded)).toEqual(["$.elements[0].payload.template[0].payload.page"]);
  });

  it("is a known key on a top-level layer", () => {
    const cfg = pagedConfig({ count: 2, mode: "tap", dwell: [] });
    expect(auditUnknownKeys(encodeConfig(cfg))).toEqual([]);
  });

  it("flags an unknown key inside the pages object", () => {
    const encoded = encodeConfig(pagedConfig({ count: 2, mode: "tap", dwell: [] })) as Record<string, unknown>;
    (encoded.pages as Record<string, unknown>).loop = true;
    expect(auditUnknownKeys(encoded)).toEqual(["$.pages.loop"]);
  });
});

describe("whether a document uses pages", () => {
  it("is true for a spec of more than one page alone", () => {
    const cfg = newConfig("Spec", 0);
    cfg.pages = { count: 2, mode: "tap", dwell: [] };
    expect(usesPages(cfg)).toBe(true);
  });

  it("is true for a pinned layer alone", () => {
    const cfg = newConfig("Pinned", 0);
    const el = newElement("text");
    el.payload.page = 2;
    cfg.elements = [el];
    expect(cfg.pages).toBeUndefined();
    expect(usesPages(cfg)).toBe(true);
  });

  it("is false for a document with neither", () => {
    expect(usesPages(newConfig("Plain", 0))).toBe(false);
  });

  it("is false for a spec of one page", () => {
    const cfg = newConfig("One", 0);
    cfg.pages = { count: 1, mode: "tour", dwell: [2] };
    expect(usesPages(cfg)).toBe(false);
    expect(hasPages(cfg.pages)).toBe(false);
  });
});

describe("the spec a document really has", () => {
  it("is the declared one when it has pages", () => {
    const cfg = pagedConfig({ count: 3, mode: "tour", dwell: [1] });
    expect(pagesSpecOf(cfg)).toEqual({ count: 3, mode: "tour", dwell: [1] });
  });

  it("counts the highest page its layers name when nothing is declared", () => {
    const cfg = newConfig("Pinned", 0);
    const el = newElement("text");
    el.payload.page = 3;
    cfg.elements = [el];
    expect(pagesSpecOf(cfg)).toEqual({ count: 3, mode: "tap", dwell: [] });
  });

  it("clamps a pinned page past the ceiling", () => {
    const cfg = newConfig("Pinned", 0);
    const el = newElement("text");
    el.payload.page = 9;
    cfg.elements = [el];
    expect(pagesSpecOf(cfg).count).toBe(PAGES_MAX_COUNT);
  });

  it("is one page for a document with no pages at all", () => {
    expect(pagesSpecOf(newConfig("Plain", 0))).toEqual({ count: 1, mode: "tap", dwell: [] });
  });
});

// Three pages at dwells of 1 s, 3 s and (unnamed, so the default) 2 s. Every
// number below is that sum done by hand: the boundaries fall at 0, 1, 4 and 6
// seconds, and the tour ends back on page 1 at 6.
describe("the tour arithmetic", () => {
  const spec: PagesSpec = { count: 3, mode: "tour", dwell: [1, 3] };
  const start = 1_700_000_000_000;

  it("falls back to the default for a page the dwell list does not reach", () => {
    expect(dwellForPage(spec, 1)).toBe(1);
    expect(dwellForPage(spec, 2)).toBe(3);
    expect(dwellForPage(spec, 3)).toBe(PAGE_DEFAULT_DWELL);
    expect(dwellForPage(spec, 0)).toBe(PAGE_DEFAULT_DWELL);
  });

  it("lasts the sum of its dwells", () => {
    expect(tourDuration(spec)).toBe(6);
  });

  it("puts a boundary at every page, plus the return to page 1", () => {
    expect(tourSteps(spec, start)).toEqual([
      { atMs: start, page: 1 },
      { atMs: start + 1000, page: 2 },
      { atMs: start + 4000, page: 3 },
      { atMs: start + 6000, page: 1 },
    ]);
  });

  it("has no steps for a document with no pages", () => {
    expect(tourSteps({ count: 1, mode: "tour", dwell: [] }, start)).toEqual([]);
  });

  it("says which page is on screen at an instant", () => {
    const at = (seconds: number) => tourPageAt(spec, start + seconds * 1000, start);
    expect(at(0)).toBe(1);
    expect(at(0.5)).toBe(1);
    expect(at(1)).toBe(2);
    expect(at(3.9)).toBe(2);
    expect(at(4)).toBe(3);
    expect(at(5.9)).toBe(3);
    expect(at(6)).toBeUndefined();
    expect(at(-1)).toBeUndefined();
  });

  it("wraps past the last page and pulls anything outside the range in", () => {
    expect(nextPageAfter(spec, 1)).toBe(2);
    expect(nextPageAfter(spec, 3)).toBe(1);
    expect(nextPageAfter(spec, 0)).toBe(2);
    expect(nextPageAfter(spec, 9)).toBe(1);
  });
});

describe("which layers draw on a page", () => {
  it("keeps a layer that names no page on every one", () => {
    const el = newElement("text");
    expect(layerDrawsOnPage(el, 1)).toBe(true);
    expect(layerDrawsOnPage(el, 4)).toBe(true);
  });

  it("keeps a pinned layer on its own page alone", () => {
    const el = newElement("text");
    el.payload.page = 2;
    expect(layerDrawsOnPage(el, 2)).toBe(true);
    expect(layerDrawsOnPage(el, 1)).toBe(false);
  });

  it("leaves a document with no pages whole", () => {
    const cfg = newConfig("Plain", 0);
    cfg.elements = [newElement("text"), newElement("icon")];
    expect(elementsOnPage(cfg, cfg.elements, 2)).toHaveLength(2);
  });
});

describe("the schema a paged document carries", () => {
  it("is 9 for a document with a spec", () => {
    expect(schemaVersionFor(pagedConfig({ count: 2, mode: "tap", dwell: [] }))).toBe(9);
  });

  it("is 9 for a pinned layer with no spec", () => {
    const cfg = newConfig("Pinned", 0);
    const el = newElement("text");
    el.payload.page = 2;
    cfg.elements = [el];
    expect(schemaVersionFor(cfg)).toBe(9);
  });

  it("is unchanged for a document with no pages", () => {
    expect(schemaVersionFor(newConfig("Plain", 0))).toBe(4);
  });
});

describe("resolving one page", () => {
  const cfg = pagedConfig({ count: 2, mode: "tap", dwell: [] });

  it("draws the shared layer and the page's own", () => {
    const layout = resolveAll(cfg, emptyContext(2)).rectangular;
    expect(layout!.elements.map((e) => (e as { text?: string }).text)).toEqual(["Shared", "Two"]);
  });

  it("reads no page as page 1", () => {
    const layout = resolveAll(cfg, emptyContext()).rectangular;
    expect(layout!.elements.map((e) => (e as { text?: string }).text)).toEqual(["Shared", "One"]);
  });

  it("drops the other page rather than hiding it", () => {
    const layout = resolveAll(cfg, emptyContext(2)).rectangular;
    expect(layout!.elements.some((e) => e.id === cfg.elements[1]!.payload.id)).toBe(false);
  });

  it("leaves a document with no pages alone whatever the page says", () => {
    const plain = newConfig("Plain", 0, ["rectangular"]);
    plain.elements = [newElement("text"), newElement("text")];
    expect(resolveAll(plain, emptyContext(3)).rectangular!.elements).toHaveLength(2);
  });

  it("feeds Inline every layer, because Inline has no pages", () => {
    // Inline is one line with no canvas, so a page filter would only make a
    // reading on another page read as missing.
    expect(resolveAll(cfg, emptyContext(2)).inline?.text).toBe("Inline");
  });
});

// A chart on page 2 and a text on every page that prints its newest reading.
// The watch settles the charts from the page's own layers, because the filter
// runs before `resolve(layout:elements:)` ever sees them, so the text reads the
// chart as missing on page 1. The panel has to do the same or the preview
// promises a number the wrist cannot draw.
describe("a text that reads a chart on another page", () => {
  function splitConfig(): CustomComplicationConfig {
    const cfg = newConfig("Split", 0, ["rectangular"]);
    const chart = newElement("chart") as Extract<Element, { kind: "chart" }>;
    // A new chart asks the recorder; this one draws the sensor's own numbers.
    chart.payload.historyMinutes = 0;
    chart.payload.value = { kind: { kind: "entityState", entityId: "sensor.prices", displayName: "Prices", domain: "sensor" } };
    chart.payload.page = 2;
    const text = newElement("text") as Extract<Element, { kind: "text" }>;
    text.payload.value = { kind: { kind: "chartStat", layer: chart.payload.id, stat: "latest" } };
    cfg.elements = [chart, text];
    cfg.pages = { count: 2, mode: "tap", dwell: [] };
    cfg.schemaVersion = schemaVersionFor(cfg);
    return cfg;
  }

  function printed(cfg: CustomComplicationConfig, page: number): string {
    const entityStates = new Map<string, EntityState>([
      ["sensor.prices", { entityId: "sensor.prices", state: "13, 20, 30", domain: "sensor", iconName: "chart.bar" }],
    ]);
    const layout = resolveAll(cfg, { ...emptyContext(page), entityStates }).rectangular!;
    const el = layout.elements.find((e) => e.kind === "text");
    if (!el || el.kind !== "text") throw new Error("no text layer resolved");
    return el.text;
  }

  it("prints the number on the page the chart is on", () => {
    expect(printed(splitConfig(), 2)).toBe("30");
  });

  it("reads the chart as missing on a page it is not on", () => {
    // What a text whose value settles on nothing prints, which is what the
    // watch draws for the same document on the same page.
    expect(printed(splitConfig(), 1)).toBe("--");
  });

  it("still prints it on a document with no pages", () => {
    const cfg = splitConfig();
    delete cfg.pages;
    delete cfg.elements[0]!.payload.page;
    expect(printed(cfg, 1)).toBe("30");
  });
});

describe("changing how many pages a document has", () => {
  it("writes a fresh spec when pages are turned on", () => {
    const cfg = newConfig("Plain", 0);
    setPageCount(cfg, 3);
    expect(cfg.pages).toEqual({ count: 3, mode: "tap", dwell: [] });
    expect(usesPages(cfg)).toBe(true);
  });

  it("keeps the mode and the dwells it already had", () => {
    const cfg = pagedConfig({ count: 4, mode: "tour", dwell: [1, 3, 4, 5] });
    setPageCount(cfg, 3);
    expect(cfg.pages).toEqual({ count: 3, mode: "tour", dwell: [1, 3, 4] });
  });

  it("takes a new mode when one is given", () => {
    const cfg = pagedConfig({ count: 2, mode: "tap", dwell: [] });
    setPageCount(cfg, 2, "tour");
    expect(cfg.pages?.mode).toBe("tour");
  });

  it("moves a layer past the new end onto the new last page", () => {
    const cfg = pagedConfig({ count: 4, mode: "tap", dwell: [] });
    cfg.elements[2]!.payload.page = 4;
    setPageCount(cfg, 3);
    // The shared layer stays shared, page 1 stays where it is, and the layer
    // that would have been left past the end lands on page 3 rather than
    // disappearing or quietly becoming a layer on every page.
    expect(cfg.elements.map((el) => el.payload.page)).toEqual([undefined, 1, 3]);
  });

  it("clamps the count to the ceiling", () => {
    const cfg = newConfig("Plain", 0);
    setPageCount(cfg, 9);
    expect(cfg.pages?.count).toBe(PAGES_MAX_COUNT);
  });

  it("turns pages off by taking the spec and every pin away", () => {
    const cfg = pagedConfig({ count: 3, mode: "tour", dwell: [1] });
    setPageCount(cfg, 1);
    expect(cfg.pages).toBeUndefined();
    expect(cfg.elements.every((el) => el.payload.page === undefined)).toBe(true);
    // Both halves of the rule, so the document really is back to one page.
    expect(usesPages(cfg)).toBe(false);
    // Off the page rung: what it lands on is whatever else the document uses.
    expect(schemaVersionFor(cfg)).toBeLessThan(9);
  });

  it("says what a smaller count would move, and nothing when it would move nothing", () => {
    const cfg = pagedConfig({ count: 4, mode: "tap", dwell: [] });
    cfg.elements[2]!.payload.page = 4;
    expect(pageCountMoveNote(cfg, 3)).toBe("Layers on page 4 move to page 3.");
    expect(pageCountMoveNote(cfg, 2)).toBe("Layers on page 4 move to page 2.");
    expect(pageCountMoveNote(cfg, 4)).toBeUndefined();
    expect(pageCountMoveNote(newConfig("Plain", 0), 1)).toBeUndefined();
  });

  it("names every stranded page, and calls turning pages off what it is", () => {
    const cfg = pagedConfig({ count: 4, mode: "tap", dwell: [] });
    cfg.elements[1]!.payload.page = 3;
    cfg.elements[2]!.payload.page = 4;
    expect(pageCountMoveNote(cfg, 2)).toBe("Layers on pages 3 and 4 move to page 2.");
    expect(pageCountMoveNote(cfg, 1)).toBe("Layers on pages 3 and 4 go back to every page.");
  });
});

describe("how long a tour holds each page", () => {
  it("shows nothing for a page held for the default", () => {
    const spec: PagesSpec = { count: 3, mode: "tour", dwell: [1] };
    expect(writtenDwell(spec, 1)).toBe(1);
    expect(writtenDwell(spec, 2)).toBeUndefined();
    expect(writtenDwell(spec, 0)).toBeUndefined();
  });

  it("writes the pages before the one set as the default they already had", () => {
    const cfg = pagedConfig({ count: 3, mode: "tour", dwell: [] });
    setPageDwell(cfg, 3, 5);
    // The wire has one entry per page in order, so there is no way to say
    // "page 3 only": pages 1 and 2 are written as the default they were
    // already being held for.
    expect(cfg.pages?.dwell).toEqual([PAGE_DEFAULT_DWELL, PAGE_DEFAULT_DWELL, 5]);
  });

  it("trims the list back from the end when a page goes back to the default", () => {
    const cfg = pagedConfig({ count: 3, mode: "tour", dwell: [1, 3, 5] });
    setPageDwell(cfg, 3, undefined);
    expect(cfg.pages?.dwell).toEqual([1, 3]);
    setPageDwell(cfg, 2, undefined);
    expect(cfg.pages?.dwell).toEqual([1]);
    setPageDwell(cfg, 1, undefined);
    expect(cfg.pages?.dwell).toEqual([]);
  });

  it("clamps what it is given", () => {
    const cfg = pagedConfig({ count: 2, mode: "tour", dwell: [] });
    setPageDwell(cfg, 1, 99);
    expect(cfg.pages?.dwell[0]).toBe(PAGE_DWELL_RANGE.max);
    setPageDwell(cfg, 1, 0.1);
    expect(cfg.pages?.dwell[0]).toBe(PAGE_DWELL_RANGE.min);
  });

  it("leaves a page the document does not have, and a document with no pages, alone", () => {
    const cfg = pagedConfig({ count: 2, mode: "tour", dwell: [] });
    setPageDwell(cfg, 4, 5);
    expect(cfg.pages?.dwell).toEqual([]);
    const plain = newConfig("Plain", 0);
    setPageDwell(plain, 1, 5);
    expect(plain.pages).toBeUndefined();
  });
});

describe("whether anything can move the page", () => {
  it("counts the whole-complication tap", () => {
    const cfg = pagedConfig({ count: 2, mode: "tap", dwell: [] });
    expect(pageMoverExists(cfg)).toBe(false);
    cfg.tapAction = { type: "nextPage" };
    expect(pageMoverExists(cfg)).toBe(true);
    cfg.tapAction = { type: "playTour" };
    expect(pageMoverExists(cfg)).toBe(true);
  });

  it("counts a tap layer", () => {
    const cfg = pagedConfig({ count: 2, mode: "tap", dwell: [] });
    const tap = newElement("tap") as Extract<Element, { kind: "tap" }>;
    tap.payload.action = { type: "refresh" };
    cfg.elements.push(tap);
    expect(pageMoverExists(cfg)).toBe(false);
    tap.payload.action = { type: "nextPage" };
    expect(pageMoverExists(cfg)).toBe(true);
  });

  it("counts nothing else, however many taps the document has", () => {
    const cfg = pagedConfig({ count: 2, mode: "tap", dwell: [] });
    cfg.tapAction = { type: "refresh" };
    for (const type of ["refresh", "openApp", "toggleEntity"] as const) {
      const tap = newElement("tap") as Extract<Element, { kind: "tap" }>;
      tap.payload.action = type === "toggleEntity"
        ? { type, entityId: "light.hall", displayName: "Hall", domain: "light" }
        : { type };
      cfg.elements.push(tap);
    }
    expect(pageMoverExists(cfg)).toBe(false);
  });
});

describe("the version gate a paged document meets", () => {
  // The panel has one gate, not two: a document's schema against the
  // integration's handshake ceiling. `schemaVersionFor` puts a paged document
  // at 9, so an integration that understands 8 refuses it on the way in the
  // same way it refuses any other document from a newer panel. Nothing about
  // pages needed a gate of its own.
  it("is refused whole by an integration that stops at 8", () => {
    const cfg = pagedConfig({ count: 2, mode: "tap", dwell: [] });
    const parsed = parseImportText(exportText(cfg, "backup"), 8);
    expect(parsed.ok).toBe(false);
    if (parsed.ok) return;
    expect(parsed.error).toContain("schema v9");
    expect(parsed.error).toContain("update the Wrist Assistant integration");
  });

  it("goes through once the integration understands 9", () => {
    const cfg = pagedConfig({ count: 2, mode: "tap", dwell: [] });
    const parsed = parseImportText(exportText(cfg, "backup"), 9);
    expect(parsed.ok).toBe(true);
  });
});

describe("what the review overlay calls the two page taps", () => {
  // "Show taps" labels every tap area with `describeTapAction`, so a page
  // action that fell out of the table would draw its raw type name on the face.
  it("names them in words", () => {
    expect(describeTapAction({ type: "nextPage" })).toBe("Next page");
    expect(describeTapAction({ type: "playTour" })).toBe("Play the page tour");
  });
});
