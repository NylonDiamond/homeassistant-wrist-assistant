// The status page editor's views, flattened to text: the route and the top
// bar's button, the Status pages and Rows cards, the watch preview drawn from
// the states, the inspector's cards for a page, a row and an add, and the
// edits their buttons make.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { HassLike, OwnerSummary } from "../src/ha-api.js";
import { SymbolBrowser } from "../src/symbols.js";
import {
  WATCH_STATUS_PAGES_PATH,
  isWatchStatusPagesRoute,
  renderWatchStatusPagesButton,
  watchStatusPagesRouteOwner,
  watchStatusPagesUrl,
} from "../src/watch-status-pages/hook.js";
import { type StatusPagesDocument, findStatusPage, statusPageRows, statusPagesOf } from "../src/watch-status-pages/model.js";
import {
  type StatusPagesViewHost,
  addPage,
  deselectStatusRow,
  openStatusAddRow,
  renderPagesCard,
  renderRowsCard,
  renderStatusInspector,
  renderStatusPageScreen,
  selectStatusPage,
  selectStatusRow,
  selectedStatusRow,
  shownStatusPage,
  statusRowSubtitle,
  statusStageFacts,
} from "../src/watch-status-pages/view.js";

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

const NO_ICONS = { render: () => undefined, available: () => false, names: () => [] } as unknown as StatusPagesViewHost["icons"];

const CONFIGURED = JSON.parse(readFileSync(join(__dirname, "fixtures-status-pages", "02-configured.json"), "utf8")) as StatusPagesDocument;
const HOUSE = "5A7E0000-0000-4000-8000-000000000001";

const STATES = {
  "lock.front_door": { state: "locked", attributes: { friendly_name: "Front Door" } },
  "cover.garage_door": { state: "open", attributes: { current_position: 40 } },
  "light.kitchen": { state: "off", attributes: {} },
  "light.porch": { state: "off", attributes: {} },
  "light.office": { state: "on", attributes: {} },
  "sensor.door_battery": { state: "12", attributes: { device_class: "battery" } },
  "sensor.remote_battery": { state: "90", attributes: { device_class: "battery" } },
  "binary_sensor.front": { state: "on", attributes: { device_class: "door", friendly_name: "Front" } },
  "climate.upstairs": { state: "heat", attributes: { current_temperature: 20.5, friendly_name: "Upstairs" } },
  "climate.downstairs": { state: "off", attributes: { current_temperature: 19, friendly_name: "Downstairs" } },
  "sensor.outdoor_temperature": { state: "4", attributes: { unit_of_measurement: "°C" } },
};

function host(document: StatusPagesDocument): StatusPagesViewHost & { edits: number } {
  const h = {
    hass: { states: STATES } as unknown as HassLike,
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    document,
    busy: false,
    uiState: new Map<string, unknown>(),
    screen: { width: 208, height: 248 },
    scale: 1,
    edits: 0,
    edit(change: (d: StatusPagesDocument) => StatusPagesDocument) {
      const next = change(h.document);
      if (next === h.document) return false;
      h.document = next;
      h.edits++;
      return true;
    },
    endCoalesce: () => undefined,
    requestUpdate: () => undefined,
  };
  return h;
}

describe("the route and the button", () => {
  it("answers /status-pages and /status-pages/<owner>", () => {
    expect(WATCH_STATUS_PAGES_PATH).toBe("/status-pages");
    expect(isWatchStatusPagesRoute({ prefix: "/wrist-assistant", path: "/status-pages" })).toBe(true);
    expect(isWatchStatusPagesRoute({ prefix: "/wrist-assistant", path: "/status-pages/ABC" })).toBe(true);
    expect(isWatchStatusPagesRoute({ prefix: "/wrist-assistant", path: "/status-pagesx" })).toBe(false);
    expect(isWatchStatusPagesRoute({ prefix: "/wrist-assistant", path: "/pages" })).toBe(false);
    expect(watchStatusPagesRouteOwner({ prefix: "/wrist-assistant", path: "/status-pages/A%20B" })).toBe("A B");
    expect(watchStatusPagesRouteOwner({ prefix: "/wrist-assistant", path: "/status-pages/%E0" })).toBeUndefined();
    expect(watchStatusPagesUrl(undefined, false, "/wrist-assistant/status-pages/X")).toBe("/wrist-assistant");
    expect(watchStatusPagesUrl({ prefix: "/wa", path: "" }, true)).toBe("/wa/status-pages");
  });

  it("is drawn in a home with a watch, and not in one without", () => {
    const watch = { owner_watch_id: "W1", device_kind: "watch" } as unknown as OwnerSummary;
    expect(flat(renderWatchStatusPagesButton([watch], () => undefined))).toContain("Status pages");
    expect(renderWatchStatusPagesButton([], () => undefined)).not.toHaveProperty("strings");
  });
});

describe("the cards", () => {
  it("list the pages and the shown page's rows with the phone's subtitles", () => {
    const h = host(CONFIGURED);
    const pages = flat(renderPagesCard(h));
    expect(pages).toContain("House");
    expect(pages).toContain("Lights");
    expect(pages).toContain("starter");
    const rows = flat(renderRowsCard(h));
    expect(rows).toContain("Security");
    expect(rows).toContain("section header");
    expect(rows).toContain("3 entities · group count");
    expect(rows).toContain("all door/window sensors · dynamic list");
    expect(rows).toContain("hidden");
  });

  it("subtitles follow the phone's words", () => {
    expect(statusRowSubtitle({ rowType: "entity", entityId: "light.x" })).toBe("light.x");
    expect(statusRowSubtitle({ rowType: "dynamicList", dynamicMode: "all", domain: "person" })).toBe("all people · dynamic list");
    expect(statusRowSubtitle({ rowType: "dynamicList", dynamicMode: "all", domain: "cover", deviceClassFilter: ["garage"] })).toBe("all garage doors · dynamic list");
    expect(statusRowSubtitle({ rowType: "dynamicList", groupEntityIds: ["a"] })).toBe("1 entity · dynamic list");
  });

  it("add a page as New Page N and pick it", () => {
    const h = host(CONFIGURED);
    addPage(h);
    const pages = statusPagesOf(h.document);
    expect(pages[pages.length - 1]!.name).toBe("New Page 1");
    expect(shownStatusPage(h)).toBe(pages[pages.length - 1]);
  });
});

describe("the watch preview", () => {
  it("draws the shown page from the states, hidden rows left out", () => {
    const h = host(CONFIGURED);
    const text = flat(renderStatusPageScreen(h));
    expect(text).toContain("SECURITY");
    expect(text).toContain("Locked");
    expect(text).toContain("40%");
    expect(text).toContain("2 off");
    expect(text).toContain("1 low");
    expect(text).toContain("Upstairs");
    expect(text).not.toContain("Outside");
    expect(text).not.toContain("HIDDEN HEADER");
    expect(text).toContain("Done");
    expect(statusStageFacts(h)).toEqual(["9 rows, 2 hidden"]);
  });

  it("says Add entities on a page with no rows", () => {
    const h = host(CONFIGURED);
    addPage(h);
    expect(flat(renderStatusPageScreen(h))).toContain("Add entities");
  });
});

describe("the inspector", () => {
  it("shows the page's Page and Style cards with nothing picked", () => {
    const h = host(CONFIGURED);
    const text = flat(renderStatusInspector(h));
    expect(text).toContain("Page");
    expect(text).toContain("Style");
    expect(text).toContain("Select a row to edit it, or add one.");
  });

  it("shows a picked row's settings, the phone's controls by row type", () => {
    const h = host(CONFIGURED);
    selectStatusRow(h, "5A7E0000-0000-4000-9000-000000000005");
    expect(selectedStatusRow(h)?.displayName).toBe("Batteries");
    const text = flat(renderStatusInspector(h));
    expect(text).toContain("Group Count");
    expect(text).toContain("Max value (%)");
    expect(text).toContain("Edit Entities (2)");
    expect(text).not.toContain("Show State");
    selectStatusRow(h, "5A7E0000-0000-4000-9000-000000000004");
    const lights = flat(renderStatusInspector(h));
    expect(lights).toContain("Show State");
    expect(lights).toContain("Device classes");
    selectStatusRow(h, "5A7E0000-0000-4000-9000-000000000001");
    const header = flat(renderStatusInspector(h));
    expect(header).toContain("Alignment");
    expect(header).not.toContain("Device classes");
    expect(deselectStatusRow(h)).toBe(true);
    expect(deselectStatusRow(h)).toBe(false);
  });

  it("shows the Add a row card with the phone's lists", () => {
    const h = host(CONFIGURED);
    openStatusAddRow(h, "groupCount");
    const text = flat(renderStatusInspector(h));
    expect(text).toContain("Add a row");
    expect(text).toContain("Smoke & Gas");
    expect(text).toContain("Batteries");
    openStatusAddRow(h, "dynamicList");
    expect(flat(renderStatusInspector(h))).toContain("All matching");
  });

  it("follows the picked page", () => {
    const h = host(CONFIGURED);
    selectStatusPage(h, "00000000-0000-0000-0000-000000000001");
    expect(shownStatusPage(h)?.name).toBe("Lights");
    expect(statusPageRows(findStatusPage(h.document, HOUSE)!).length).toBe(9);
  });
});
