// The Dashboard shape in the editor and on the card: picking it in the New
// dialog, sizing its canvas, its picture in the picker, a copy made from
// another shape, and the grid size the card asks a dashboard for.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { nothing } from "lit";
import { describe, expect, it, vi } from "vitest";

import type { CardDesign } from "../src/card-api.js";
import { duplicateAs } from "../src/copies.js";
import { cardSizeFor, gridOptionsFor, parseCardConfig, withCanvasHint, type CardConfig } from "../src/dashboard-card-config.js";
import { designGroups, filterDesigns } from "../src/dashboard-card-editor.js";
import { DASHBOARD_GRID as GRID_DIRECT } from "../src/dashboard-grid.js";
import type { HassLike } from "../src/ha-api.js";
import { addFamily } from "../src/layouts.js";
import {
  DASHBOARD_CANVAS_MAX,
  DASHBOARD_CANVAS_MIN,
  DASHBOARD_DEFAULT_CANVAS,
  DASHBOARD_GRID,
  DASHBOARD_PRESETS,
  DESIGN_BOX,
  newElement,
  dashboardCanvasFor,
  dashboardCanvasLike,
  dashboardPresetOf,
  designBox,
  newConfig,
  parseConfig,
  setDashboardCanvas,
  snapDashboardCanvas,
} from "../src/model.js";
import { kindChoices, kindOwners, newReady, newSummary, shapeGroups, shapeOffered } from "../src/newComplication.js";
import type { DeviceOwner } from "../src/copies.js";
import { deviceCropArt, deviceShapeArt, shapeOnlyArt } from "../src/shapeArt.js";

const fixture = JSON.parse(
  readFileSync(join(__dirname, "fixtures-dashboard", "kitchen-card.json"), "utf8"),
) as Record<string, unknown>;

const WATCH: DeviceOwner = {
  ownerId: "w1", label: "Watch", kind: "watch", families: ["rectangular", "circular", "corner", "inline"],
  comingSoon: [], controls: true,
} as unknown as DeviceOwner;

/** A Lit template as text, its values written in where they go. */
function markup(node: unknown): string {
  if (node === undefined || node === null || node === nothing) return "";
  if (Array.isArray(node)) return node.map(markup).join("");
  if (typeof node === "object" && "strings" in (node as Record<string, unknown>)) {
    const t = node as { strings: readonly string[]; values: unknown[] };
    return t.strings.map((str, i) => str + (i < t.values.length ? markup(t.values[i]) : "")).join("");
  }
  return String(node);
}

describe("the New dialog", () => {
  it("offers Dashboard last, and only in a home with a Library", () => {
    expect(kindChoices([WATCH])).not.toContain("dashboard");
    expect(kindChoices([WATCH], { library: true })).toEqual(["watch", "control", "dashboard"]);
    expect(kindChoices([], { library: true })).toEqual(["watch", "iphone", "dashboard"]);
  });

  it("has one shape, and no device to tick", () => {
    expect(shapeGroups("dashboard", [WATCH])).toEqual([
      { key: "dashboard", title: "Home Assistant dashboard", families: ["dashboard"], comingSoon: [] },
    ]);
    expect(shapeOffered("dashboard", [WATCH], "dashboard")).toBe(true);
    expect(shapeOffered("watch", [WATCH], "dashboard")).toBe(false);
    expect(kindOwners([WATCH], "dashboard")).toEqual([]);
  });

  it("says where the card goes, and is ready with no device", () => {
    const state = { named: true, kind: "dashboard" as const, family: "dashboard" as const, devices: 0 };
    expect(newReady(state)).toBe(true);
    expect(newSummary(state)).toMatch(/^A Dashboard card, kept in Unassigned\./);
  });
});

describe("the canvas size", () => {
  it("names a preset only when the canvas is exactly one", () => {
    for (const p of DASHBOARD_PRESETS) expect(dashboardPresetOf(dashboardCanvasFor(p.columns, p.rows))).toBe(p.id);
    expect(dashboardPresetOf(DASHBOARD_DEFAULT_CANVAS)).toBe("2x1");
    expect(dashboardPresetOf({ width: 300, height: 120 })).toBeUndefined();
  });

  it("writes one side at a time, clamped to what the store keeps", () => {
    const cfg = parseConfig(fixture);
    setDashboardCanvas(cfg, { width: 400 });
    expect(designBox(cfg, "dashboard")).toEqual({ width: 400, height: 120 });
    setDashboardCanvas(cfg, { height: 5000 });
    expect(designBox(cfg, "dashboard").height).toBe(DASHBOARD_CANVAS_MAX);
    setDashboardCanvas(cfg, { width: 1 });
    expect(designBox(cfg, "dashboard").width).toBe(DASHBOARD_CANVAS_MIN);
  });

  it("keeps every layer where it was as a share of the card", () => {
    const cfg = parseConfig(fixture);
    const before = JSON.stringify(cfg.perFamily.dashboard?.placements);
    setDashboardCanvas(cfg, dashboardCanvasFor(12, 4));
    expect(JSON.stringify(cfg.perFamily.dashboard?.placements)).toBe(before);
  });

  it("does nothing to a document without the shape", () => {
    const cfg = newConfig("Watch", 0, "rectangular");
    setDashboardCanvas(cfg, { width: 400 });
    expect(cfg.perFamily.dashboard).toBeUndefined();
    expect("canvas" in (cfg.perFamily.rectangular ?? {})).toBe(false);
  });

  it("is one grid, read from its own module or the model", () => {
    expect(DASHBOARD_GRID).toBe(GRID_DIRECT);
  });

  it("snaps a dragged edge to whole cells, past one section's twelve columns too", () => {
    expect(snapDashboardCanvas({ width: 250, height: 130 })).toEqual(dashboardCanvasFor(6, 2));
    expect(snapDashboardCanvas({ width: 700, height: 10 })).toEqual(dashboardCanvasFor(17, 1));
    expect(snapDashboardCanvas({ width: 5000, height: 5000 })).toEqual({ width: DASHBOARD_CANVAS_MAX, height: DASHBOARD_CANVAS_MAX });
  });
});

describe("a Dashboard copy of another shape", () => {
  it("snaps the source's box to whole cells of the grid", () => {
    expect(dashboardCanvasLike({ width: 329, height: 155.33 })).toEqual(dashboardCanvasFor(8, 3));
    expect(dashboardCanvasLike({ width: 10, height: 10 })).toEqual(dashboardCanvasFor(1, 1));
  });

  it("starts the shape with a canvas when it is added", () => {
    const cfg = newConfig("Watch", 0, "rectangular");
    addFamily(cfg, "dashboard");
    expect(cfg.perFamily.dashboard?.canvas).toEqual(DASHBOARD_DEFAULT_CANVAS);
  });

  it("takes about its source's proportions and lands at schema 11", () => {
    const cfg = newConfig("Phone", 0, "medium");
    const text = newElement("text");
    cfg.elements.push(text);
    cfg.perFamily.medium!.placements[text.payload.id] = { frame: { ...text.payload.frame }, isHidden: false };
    const copy = duplicateAs(cfg, "dashboard", { id: "NEW", slotIndex: 0 });
    expect(copy.supportedFamilies).toEqual(["dashboard"]);
    expect(copy.schemaVersion).toBe(11);
    expect(copy.perFamily.dashboard?.canvas).toEqual(dashboardCanvasLike(DESIGN_BOX.medium));
    // The layer came over, refitted, under an id of its own.
    expect(Object.keys(copy.perFamily.dashboard?.placements ?? {})).toHaveLength(1);
  });

  it("takes the default canvas from a source with nothing drawn on it", () => {
    const copy = duplicateAs(newConfig("Blank", 0, "medium"), "dashboard", { id: "NEW", slotIndex: 0 });
    expect(copy.perFamily.dashboard?.canvas).toEqual(DASHBOARD_DEFAULT_CANVAS);
  });
});

describe("the picture of a Dashboard design", () => {
  it("is a screen of cards, whichever device a row asks for", () => {
    const watch = markup(deviceShapeArt("dashboard", "watch", true));
    expect(markup(deviceShapeArt("dashboard", "iphone", true))).toBe(watch);
    // No watch band and no phone outline.
    expect(watch).not.toContain('rx="4"');
    expect(watch).toContain('class="shape-art"');
  });

  it("draws the card alone, at its own proportions, in both picker views", () => {
    const live = { dashboard: { art: deviceShapeArt("rectangular", "watch", true), width: 496, height: 120 } };
    for (const art of [deviceCropArt("dashboard", "watch", live, { shelved: true }), shapeOnlyArt("dashboard", "watch", live)]) {
      const html = markup(art);
      expect(html).toContain("pk-crop bare dashboard");
      // The frame is the card plus a tenth of its shorter side all round.
      expect(html).toContain("viewBox=-12 -12 520 144");
    }
  });

  it("stands in at the default size when there is nothing to draw", () => {
    expect(markup(shapeOnlyArt("dashboard", "watch", {}))).toContain("viewBox=-12 -12 268 144");
  });
});

describe("the card on a dashboard", () => {
  it("starts at the cells its canvas covers, down to one", () => {
    expect(gridOptionsFor("dashboard", dashboardCanvasFor(12, 4))).toEqual({ columns: 12, rows: 4, min_columns: 1, min_rows: 1 });
    expect(gridOptionsFor("dashboard", dashboardCanvasFor(3, 2))).toMatchObject({ columns: 3, rows: 2 });
    // No hint yet: the panel's default size.
    expect(gridOptionsFor("dashboard")).toMatchObject({ columns: 6, rows: 2 });
    // A canvas with no shape named is a Dashboard design's.
    expect(gridOptionsFor(undefined, dashboardCanvasFor(4, 3))).toMatchObject({ columns: 4, rows: 3 });
    // Another shape ignores a stray canvas.
    expect(gridOptionsFor("circular", dashboardCanvasFor(12, 4))).toMatchObject({ columns: 3, rows: 2 });
  });

  it("is as tall in a masonry column as its proportions make it", () => {
    expect(cardSizeFor("dashboard", dashboardCanvasFor(12, 2))).toBe(3);
    expect(cardSizeFor("dashboard", dashboardCanvasFor(6, 2))).toBe(5);
    expect(cardSizeFor("dashboard", dashboardCanvasFor(12, 4))).toBeGreaterThan(cardSizeFor("dashboard", dashboardCanvasFor(12, 2)));
  });

  it("accepts a canvas hint and refuses a broken one", () => {
    expect(parseCardConfig({ complication: "A", shape: "dashboard", canvas: { width: 244, height: 120 } }).canvas)
      .toEqual({ width: 244, height: 120 });
    expect(() => parseCardConfig({ complication: "A", canvas: { width: 0, height: 120 } })).toThrow(/canvas/);
    expect(() => parseCardConfig({ complication: "A", canvas: "big" })).toThrow(/canvas/);
  });
});

describe("the card editor", () => {
  const design = (id: string, families: string[], extra: Partial<CardDesign> = {}): CardDesign => ({
    owner_watch_id: "library", owner_name: "Unassigned", complication_id: id, name: id, families, revision: 1, ...extra,
  });

  it("lists Dashboard designs first, in their own group", () => {
    const groups = designGroups([
      design("A", ["rectangular"], { owner_watch_id: "w1", owner_name: "Watch" }),
      design("B", ["dashboard"], { canvas: { width: 244, height: 120 } }),
      design("C", ["small"]),
    ]);
    expect(groups.map(([name, list]) => [name, list.map((d) => d.complication_id)])).toEqual([
      ["Made for dashboards", ["B"]],
      ["Watch", ["A"]],
      ["Unassigned", ["C"]],
    ]);
  });

  it("copies a Dashboard design's canvas into the config, and drops it for another shape", () => {
    const base: CardConfig = { type: "custom:wrist-assistant-card", owner: "library", complication: "B", shape: "dashboard" };
    const dash = design("B", ["dashboard"], { canvas: { width: 496, height: 248 } });
    const hinted = withCanvasHint(base, dash);
    expect(hinted.canvas).toEqual({ width: 496, height: 248 });
    // Up to date already: the same object back, so nothing is sent.
    expect(withCanvasHint(hinted, dash)).toBe(hinted);
    const watch = withCanvasHint({ ...hinted, shape: "rectangular" }, design("A", ["rectangular"]));
    expect("canvas" in watch).toBe(false);
  });

  it("filters by name, ignoring case", () => {
    const list = [design("Kitchen", ["dashboard"]), design("Garage", ["small"]), design("", ["small"])];
    expect(filterDesigns(list, "  kit ").map((d) => d.complication_id)).toEqual(["Kitchen"]);
    expect(filterDesigns(list, "untitled").map((d) => d.complication_id)).toEqual([""]);
    expect(filterDesigns(list, "")).toHaveLength(3);
  });

  /** The editor element with designs handed in and a connection that answers
   * each picture read after `release` is called. */
  function pictured(designs: CardDesign[], refuse: Set<string> = new Set()) {
    let running = 0;
    let most = 0;
    const waiting: (() => void)[] = [];
    const sendMessagePromise = vi.fn(async (message: Record<string, unknown>) => {
      running++;
      most = Math.max(most, running);
      await new Promise<void>((resolve) => waiting.push(resolve));
      running--;
      if (refuse.has(String(message.complication_id))) throw { code: "not_found", message: "gone" };
      return { revision: message.revision, png: btoa("png") };
    });
    const Ctor = customElements.get("wa-dashboard-card-editor") as unknown as new () => Record<string, unknown>;
    const el = new Ctor();
    el.hass = { connection: { sendMessagePromise } } as unknown as HassLike;
    const done = (el.loadThumbs as (d: CardDesign[]) => Promise<void>).call(el, designs);
    const release = async () => {
      while (waiting.length > 0 || running > 0) {
        waiting.splice(0).forEach((r) => r());
        await new Promise((r) => setTimeout(r, 0));
      }
      await done;
    };
    return { el, sendMessagePromise, release, most: () => most, thumbs: () => el.thumbs as Map<string, string> };
  }

  const PREVIEW = { revision: 1, family: "small", device: "iphone", width: 170, height: 170 } as const;

  it("fetches each design's picture through the panel's read, three at a time, and skips one with none", async () => {
    const designs = ["A", "B", "C", "D", "E"].map((id) => design(id, ["small"], { preview: { ...PREVIEW } }));
    designs.push(design("F", ["small"], { preview: null }));
    const t = pictured(designs);
    await t.release();
    expect(t.most()).toBe(3);
    expect(t.sendMessagePromise).toHaveBeenCalledTimes(5);
    expect(t.sendMessagePromise.mock.calls[0]![0]).toEqual({
      type: "wrist_assistant/complications/preview_get", owner_watch_id: "library", complication_id: "A", revision: 1,
    });
    expect([...t.thumbs().keys()].sort()).toEqual(["A", "B", "C", "D", "E"].map((id) => `library|${id}|1`));
  });

  it("leaves a tile with its name when its picture is refused, and lets the URLs go when it closes", async () => {
    const revoke = vi.spyOn(URL, "revokeObjectURL");
    const designs = ["A", "B"].map((id) => design(id, ["small"], { preview: { ...PREVIEW } }));
    const t = pictured(designs, new Set(["B"]));
    await t.release();
    expect([...t.thumbs().keys()]).toEqual(["library|A|1"]);
    (t.el.disconnectedCallback as () => void).call(t.el);
    expect(revoke).toHaveBeenCalledTimes(1);
    expect(t.thumbs().size).toBe(0);
    revoke.mockRestore();
  });

  it("draws a corner's tile as its disc, a picture as an image, and a design with none as its shape's name", () => {
    const flat = (v: unknown): string => {
      if (Array.isArray(v)) return v.map(flat).join("");
      if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
        const r = v as { strings: readonly string[]; values: unknown[] };
        return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
      }
      return typeof v === "string" || typeof v === "number" ? String(v) : "";
    };
    const Ctor = customElements.get("wa-dashboard-card-editor") as unknown as new () => Record<string, unknown>;
    const el = new Ctor();
    const tile = (d: CardDesign) => flat((el.renderTile as (d: CardDesign, c: string) => unknown).call(el, d, "library|C"));
    const corner = design("C", ["corner"], {
      preview: { revision: 1, family: "corner", device: "watch", width: 200, height: 200, focus: { cx: 60, cy: 70, diameter: 40 } },
    });
    const plain = design("P", ["small"], { preview: { ...PREVIEW } });
    (el.thumbs as Map<string, string>).set("library|C|1", "blob:c");
    (el.thumbs as Map<string, string>).set("library|P|1", "blob:p");
    expect(tile(corner)).toContain("viewBox=40 50 40 40");
    expect(tile(corner)).toContain("aria-pressed=true");
    expect(tile(plain)).toContain(`<img class="pic" src=blob:p`);
    expect(tile(plain)).toContain("aria-pressed=false");
    expect(tile(design("N", ["small"]))).toContain("Small tile");
  });
});
