// The Dashboard shape: a card on a Home Assistant dashboard, sized by its
// author and kept in the Library. Its fixture lives in its own folder because
// the two shared fixture folders are byte copies of the app repo's, and the
// app's decoder refuses a shape it does not know.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { familiesKeptFor } from "../src/copies.js";
import { galleryBlockers, galleryRefusal } from "../src/gallery.js";
import { familiesFor, placeOf, placeTitle } from "../src/layouts.js";
import {
  DASHBOARD_CANVAS_MAX,
  DASHBOARD_CANVAS_MIN,
  DASHBOARD_DEFAULT_CANVAS,
  DASHBOARD_PRESETS,
  DESIGN_BOX,
  auditUnknownKeys,
  clampDashboardCanvas,
  dashboardCanvasFor,
  dashboardGridFor,
  designBox,
  encodeConfig,
  newConfig,
  parseConfig,
  refitPlacement,
  schemaVersionFor,
} from "../src/model.js";
import { type IconProvider, familyTitle, renderLayout } from "../src/renderer.js";
import { resolveAll } from "../src/resolver.js";
import { nothing } from "lit";

const fixture = JSON.parse(
  readFileSync(join(__dirname, "fixtures-dashboard", "kitchen-card.json"), "utf8"),
) as Record<string, unknown>;

const emptyContext = () => ({
  entityStates: new Map(),
  templateResults: new Map(),
  namedValues: [],
});

describe("a Dashboard document on the wire", () => {
  it("parses its canvas and reads its box from it", () => {
    const cfg = parseConfig(fixture);
    expect(cfg.supportedFamilies).toEqual(["dashboard"]);
    expect(cfg.perFamily.dashboard?.canvas).toEqual({ width: 244, height: 120 });
    expect(designBox(cfg, "dashboard")).toEqual({ width: 244, height: 120 });
  });

  it("saves back byte for byte", () => {
    expect(encodeConfig(parseConfig(fixture))).toEqual(fixture);
  });

  it("opens editable: the audit knows the canvas on Dashboard", () => {
    expect(auditUnknownKeys(fixture)).toEqual([]);
  });

  it("refuses a canvas on any other shape, and stray keys inside one", () => {
    const wrong = structuredClone(fixture);
    (wrong.perFamily as unknown[])[0] = "rectangular";
    wrong.supportedFamilies = ["rectangular"];
    expect(auditUnknownKeys(wrong)).toEqual(["$.perFamily.rectangular.canvas"]);
    const stray = structuredClone(fixture);
    ((stray.perFamily as Record<string, Record<string, unknown>>[])[1]!.canvas as Record<string, unknown>).depth = 3;
    expect(auditUnknownKeys(stray)).toEqual(["$.perFamily.dashboard.canvas.depth"]);
  });

  it("clamps a canvas outside the bounds as it parses", () => {
    const big = structuredClone(fixture);
    (big.perFamily as Record<string, Record<string, unknown>>[])[1]!.canvas = { width: 99999, height: 2 };
    expect(parseConfig(big).perFamily.dashboard?.canvas).toEqual({ width: DASHBOARD_CANVAS_MAX, height: DASHBOARD_CANVAS_MIN });
  });
});

describe("schema 11", () => {
  it("is stamped on a document that names Dashboard and no other", () => {
    const dash = newConfig("Card", 0, "dashboard");
    expect(dash.schemaVersion).toBe(11);
    expect(schemaVersionFor(dash)).toBe(11);
    expect(encodeConfig(dash).schemaVersion).toBe(11);
    for (const family of ["rectangular", "circular", "corner", "inline", "small", "medium", "large", "xlarge"] as const) {
      expect(schemaVersionFor(newConfig("X", 0, family))).toBeLessThanOrEqual(10);
    }
  });

  it("starts a new Dashboard design at the default canvas", () => {
    const cfg = newConfig("Card", 0, "dashboard");
    expect(cfg.perFamily.dashboard?.canvas).toEqual(DASHBOARD_DEFAULT_CANVAS);
    expect(newConfig("X", 0, "rectangular").perFamily.rectangular?.canvas).toBeUndefined();
  });
});

describe("the canvas and the sections grid", () => {
  it("measures grid cells the way Home Assistant lays them out", () => {
    expect(dashboardCanvasFor(1, 1)).toEqual({ width: 34, height: 56 });
    expect(dashboardCanvasFor(12, 1).width).toBe(12 * 34 + 11 * 8);
    expect(dashboardCanvasFor(3, 2)).toEqual({ width: 118, height: 120 });
  });

  it("reads every preset back as the cells it was made from", () => {
    for (const p of DASHBOARD_PRESETS) {
      expect(dashboardGridFor(dashboardCanvasFor(p.columns, p.rows))).toEqual({ columns: p.columns, rows: p.rows });
    }
    expect(DASHBOARD_PRESETS.map((p) => p.id)).toEqual(["1x1", "2x1", "4x2", "full"]);
  });

  it("keeps a typed size inside the grid", () => {
    expect(dashboardGridFor({ width: 5000, height: 10 })).toEqual({ columns: 12, rows: 1 });
  });

  it("clamps a canvas and falls back to the default for a side that is not a number", () => {
    expect(clampDashboardCanvas({ width: 10, height: 5000 })).toEqual({ width: DASHBOARD_CANVAS_MIN, height: DASHBOARD_CANVAS_MAX });
    expect(clampDashboardCanvas({ width: "wide", height: Number.NaN })).toEqual(DASHBOARD_DEFAULT_CANVAS);
    expect(clampDashboardCanvas(undefined)).toEqual(DASHBOARD_DEFAULT_CANVAS);
  });

  it("gives every fixed shape its measured box", () => {
    expect(designBox(undefined, "rectangular")).toBe(DESIGN_BOX.rectangular);
    expect(designBox(newConfig("X", 0, "dashboard"), "medium")).toBe(DESIGN_BOX.medium);
  });

  it("refits a layer between Dashboard and another shape by the document's canvas", () => {
    const p = { frame: { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 }, isHidden: false, size: 20 };
    const down = refitPlacement(p, "dashboard", "rectangular", "text", { from: { width: 362, height: 131 } });
    expect(down.size).toBe(10);
  });
});

describe("Dashboard stays off devices", () => {
  it("is offered only in the Library", () => {
    expect(familiesFor({ device_kind: "library" })).toContain("dashboard");
    expect(familiesFor({ device_kind: "watch" })).not.toContain("dashboard");
    expect(familiesFor({ device_kind: "iphone", app_version: "9.9.9" })).not.toContain("dashboard");
  });

  it("is trimmed from any copy a device carries", () => {
    expect(familiesKeptFor({ kind: "library", appVersion: null })).toContain("dashboard");
    expect(familiesKeptFor({ kind: "watch", appVersion: "9.9.9" })).not.toContain("dashboard");
    expect(familiesKeptFor({ kind: "iphone", appVersion: "9.9.9" })).not.toContain("dashboard");
  });

  it("is a place of its own", () => {
    expect(placeOf("dashboard", { device_kind: "library" })).toBe("dashboard");
    expect(placeTitle("dashboard")).toBe("Dashboard");
    expect(familyTitle("dashboard")).toBe("Dashboard");
  });
});

describe("Dashboard and the gallery", () => {
  it("is refused with one plain reason", () => {
    const cfg = parseConfig(fixture);
    const reason = galleryRefusal(cfg);
    expect(reason).toMatch(/Dashboard designs cannot go to the gallery/);
    const meta = { title: "Kitchen", description: "", authorName: "", tags: [], panelVersion: "0" };
    expect(galleryBlockers(cfg, [], meta)).toEqual([reason]);
    expect(galleryRefusal(newConfig("X", 0, "rectangular"))).toBeUndefined();
  });
});

describe("drawing a Dashboard design", () => {
  it("resolves and draws at the document's canvas", () => {
    const cfg = parseConfig(fixture);
    const layout = resolveAll(cfg, emptyContext()).dashboard;
    expect(layout?.canvas).toEqual({ width: 244, height: 120 });
    const text = flatten(renderLayout(layout!, { icons: noIcons }));
    expect(text).toContain("<svg viewBox=0 0 244 120 ");
  });
});

const noIcons: IconProvider = { render: () => undefined, available: () => false, names: () => undefined };

function flatten(node: unknown): string {
  if (node === undefined || node === null || node === nothing) return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (typeof node === "object" && "strings" in (node as Record<string, unknown>)) {
    const t = node as { strings: readonly string[]; values: unknown[] };
    return t.strings.map((str, i) => str + (i < t.values.length ? flatten(t.values[i]) : "")).join("");
  }
  return String(node);
}
