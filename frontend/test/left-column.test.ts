// The editor's left column and top bar: the words a tap layer goes by, and
// the small decisions the Pages card, the Layers card and the Add sheet make.

import { describe, expect, it } from "vitest";

import { KIND_LABEL } from "../src/kinds.js";
import { type Element as CElement, parseConfig } from "../src/model.js";
import {
  ADD_SHEET_WIDTH,
  addGroupCards,
  addSheetPlace,
  backgroundRow,
  filterAddOffers,
  layerListSections,
  layersFilterLine,
  matchesAddSearch,
  savedCaption,
  sendTone,
  slashOpensAddSearch,
  tapBadge,
} from "../src/panel.js";
import { LAYER_PRESETS } from "../src/presets.js";
import pagesFixture from "./fixtures/pages.json" with { type: "json" };

const bare = { key: "/", metaKey: false, ctrlKey: false, altKey: false };

describe("the tap layer's name", () => {
  it("is a tap zone wherever the kind is named", () => {
    expect(KIND_LABEL.tap).toBe("Tap zone");
  });

  it("keeps no trace of the old word", () => {
    expect(Object.values(KIND_LABEL)).not.toContain("Tap area");
  });
});

describe("the / key", () => {
  it("opens the Add sheet's search when nothing is being typed and no dialog is up", () => {
    expect(slashOpensAddSearch(bare, false, false)).toBe(true);
  });

  it("stays a slash in a text field", () => {
    expect(slashOpensAddSearch(bare, true, false)).toBe(false);
  });

  it("leaves an open dialog its own keys", () => {
    expect(slashOpensAddSearch(bare, false, true)).toBe(false);
  });

  it("is the bare key only", () => {
    expect(slashOpensAddSearch({ ...bare, metaKey: true }, false, false)).toBe(false);
    expect(slashOpensAddSearch({ ...bare, ctrlKey: true }, false, false)).toBe(false);
    expect(slashOpensAddSearch({ ...bare, altKey: true }, false, false)).toBe(false);
    expect(slashOpensAddSearch({ ...bare, key: "?" }, false, false)).toBe(false);
  });
});

describe("the Add sheet's search", () => {
  const elements = [
    { title: "Text" }, { title: "Gauge" }, { title: "Chart" }, { title: "Camera" }, { title: "Invisible tap zone" },
  ];

  it("keeps everything while nothing is typed", () => {
    const found = filterAddOffers("  ", elements, LAYER_PRESETS);
    expect(found.elements).toHaveLength(elements.length);
    expect(found.presets).toHaveLength(LAYER_PRESETS.length);
  });

  it("narrows the elements and the presets by name, in either case", () => {
    const found = filterAddOffers("GAUGE", elements, LAYER_PRESETS);
    expect(found.elements.map((e) => e.title)).toEqual(["Gauge"]);
    expect(found.presets.map((p) => p.title)).toContain("Sensor gauge");
    expect(found.presets.every((p) => p.title.toLowerCase().includes("gauge"))).toBe(true);
  });

  it("needs every word typed, in any order", () => {
    expect(matchesAddSearch("Countdown timer", "timer count")).toBe(true);
    expect(matchesAddSearch("Countdown timer", "timer gauge")).toBe(false);
    expect(matchesAddSearch("Invisible tap zone", "tap")).toBe(true);
  });

  it("can find nothing", () => {
    const found = filterAddOffers("zzz", elements, LAYER_PRESETS);
    expect(found.elements).toEqual([]);
    expect(found.presets).toEqual([]);
  });
});

describe("the Add sheet's groups", () => {
  const cards = [
    { kind: "text" as const }, { kind: "icon" as const }, { kind: "icon" as const, variant: "iconSvg" as const },
    { kind: "gauge" as const }, { kind: "chart" as const }, { kind: "timeline" as const }, { kind: "list" as const },
    { kind: "shape" as const }, { kind: "image" as const, variant: "imageCamera" as const }, { kind: "tap" as const },
  ];

  it("shows a value in the sheet's order, the catalogue icon last", () => {
    expect(addGroupCards(cards, "value").map((c) => c.kind)).toEqual(["text", "gauge", "chart", "timeline", "list", "icon"]);
  });

  it("puts a pasted SVG with the pictures, after them", () => {
    expect(addGroupCards(cards, "pictures").map((c) => c.variant)).toEqual(["imageCamera", "iconSvg"]);
  });

  it("decorates with a shape and a tap zone", () => {
    expect(addGroupCards(cards, "decorate").map((c) => c.kind)).toEqual(["shape", "tap"]);
  });
});

describe("where the Add sheet opens", () => {
  const view = { width: 1600, height: 1000 };

  it("hangs under + Add when it fits", () => {
    const at = addSheetPlace({ left: 240, bottom: 100 }, view);
    expect(at).toEqual({ mode: "anchored", left: 240, top: 106, height: 700 });
  });

  it("is only as tall as the room under the button", () => {
    const at = addSheetPlace({ left: 240, bottom: 400 }, view);
    expect(at.mode).toBe("anchored");
    if (at.mode === "anchored") expect(at.top + at.height).toBeLessThanOrEqual(view.height);
  });

  it("goes to the middle of the window when the width does not fit", () => {
    expect(addSheetPlace({ left: 1600 - ADD_SHEET_WIDTH + 1, bottom: 100 }, view)).toEqual({ mode: "centered" });
    expect(addSheetPlace({ left: 10, bottom: 100 }, { width: 400, height: 900 })).toEqual({ mode: "centered" });
  });

  it("goes to the middle of the window when there is too little height under it", () => {
    expect(addSheetPlace({ left: 240, bottom: 700 }, view)).toEqual({ mode: "centered" });
  });
});

describe("the Background row", () => {
  const cfg = parseConfig(pagesFixture.config);

  it("selects the shape, the way the old shape row did", () => {
    expect(backgroundRow(cfg, "rectangular").inspect).toEqual({ kind: "family" });
  });

  it("is one row: the shape's ground and border, with the tap as its own strip", () => {
    const row = backgroundRow(cfg, "rectangular");
    expect(row.name).toBe("Background");
    expect(row.caption).toBe("always at the bottom");
    expect(row.meta).toBe("Transparent · no border");
  });

  it("names a ground and a border once there are some", () => {
    const filled = parseConfig(pagesFixture.config);
    filled.perFamily.rectangular = { ...filled.perFamily.rectangular!, backgroundColorHex: "#FF0000", borderColorHex: "#FFFFFF", borderWidth: 2 };
    const row = backgroundRow(filled, "rectangular");
    expect(row.meta).toContain("2 pt border");
    expect(row.meta.startsWith("Transparent")).toBe(false);
  });
});

describe("a tapped row's badge", () => {
  it("says which page a page turn lands on, wrapping", () => {
    expect(tapBadge({ type: "nextPage" }, 1, 4)).toBe("→ page 2");
    expect(tapBadge({ type: "nextPage" }, 4, 4)).toBe("→ page 1");
    expect(tapBadge({ type: "previousPage" }, 1, 4)).toBe("→ page 4");
    expect(tapBadge({ type: "previousPage" }, 3, 4)).toBe("→ page 2");
    expect(tapBadge({ type: "showPage", page: 3 }, 1, 4)).toBe("→ page 3");
  });

  it("is plain tap for anything else", () => {
    expect(tapBadge({ type: "openApp" }, 1, 4)).toBe("tap");
    expect(tapBadge({ type: "refresh" } as never, 1, 1)).toBe("tap");
  });
});

describe("the Layers filter line", () => {
  const cfg = parseConfig(pagesFixture.config);
  const rows: CElement[] = cfg.elements;

  it("counts the page's own layers apart from the ones on every page", () => {
    const here = rows.filter((el) => el.payload.page === 1).length;
    const every = rows.filter((el) => el.payload.page === undefined).length;
    const line = layersFilterLine(rows, true, 1, false);
    expect(line.lead).toBe("On page 1");
    expect(line.count).toBe(`${here} layer${here === 1 ? "" : "s"}, plus ${every} on every page`);
  });

  it("is a plain count without pages", () => {
    expect(layersFilterLine(rows, false, 1, false)).toEqual({ lead: "", count: `${rows.length} layers` });
  });

  it("lists every page's layers under Show all, page by page, then every page", () => {
    const sections = layerListSections(cfg, rows, 3);
    const labels = sections.map((s) => s.label);
    expect(labels[labels.length - 1]).toBe("Every page");
    const listed = sections.flatMap((s) => s.rows.map((r) => (r.kind === "layer" ? r.el.payload.id : r.group.id)));
    expect(new Set(listed).size).toBe(rows.length);
    for (const s of sections.filter((x) => x.page !== undefined)) {
      for (const r of s.rows) if (r.kind === "layer") expect(r.el.payload.page).toBe(s.page);
    }
  });
});

describe("the top bar", () => {
  const now = Date.parse("2026-09-23T12:00:00Z");

  it("says when the last save was, or that there has not been one", () => {
    expect(savedCaption(true, undefined, now)).toBe("Not saved yet");
    expect(savedCaption(false, "2026-09-23T11:58:00Z", now)).toBe("Saved 2 min ago");
    expect(savedCaption(false, "2026-09-23T11:59:40Z", now)).toBe("Saved just now");
    expect(savedCaption(false, "not a date", now)).toBe("Saved");
  });

  it("colors the sync pill green on the device, amber until then", () => {
    expect(sendTone("sent")).toBe("ok");
    for (const kind of ["waiting", "sending", "offline", "unsupported", "openApp"] as const) expect(sendTone(kind)).toBe("warn");
    expect(sendTone("library")).toBe("quiet");
  });
});
