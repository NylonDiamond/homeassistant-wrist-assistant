// Panel-safety of the iPhone's preset transfer. Every JSON under
// test/fixtures-transfer/ is a real Swift-encoded document produced by
// PresetCustomConverter (regenerate with the app's emitTransferFixtures test).
// Each one must pass auditUnknownKeys with no findings — a finding means the
// panel would open the transferred document read-only — and must parse into a
// config the editor can round-trip.

import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { auditUnknownKeys, encodeConfig, parseConfig, schemaVersionFor } from "../src/model.js";

const dir = join(__dirname, "fixtures-transfer");
const files = readdirSync(dir).filter((f) => f.endsWith(".json"));

describe("transferred preset documents", () => {
  it("has fixtures to check", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  // No preset converts to a Material Design icon, so no fixture above carries a
  // `path`. The audit still has to accept one, because a document the panel
  // itself wrote comes back through the same door.
  it("accepts an icon layer carrying a Material Design path", () => {
    const raw = JSON.parse(readFileSync(join(dir, files[0]!), "utf8")) as Record<string, unknown>;
    const doc = {
      ...raw,
      elements: [
        {
          kind: "icon",
          payload: {
            id: "EEEEEEEE-0000-4000-8000-0000000001FF",
            symbol: { kind: { kind: "literal", value: "mdi:flash" } },
            path: "M7 2v11h3v9l7-12h-4l4-8z",
            size: 16,
            colorSlot: { baseColorHex: "#FFFFFF" },
            rules: [],
            frame: { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 },
            isHidden: false,
          },
        },
      ],
    };
    expect(auditUnknownKeys(doc)).toEqual([]);
  });

  // A list carries whole elements inside its `template`, so the audit has to
  // walk them the way it walks `$.elements` or an unknown key in a row would
  // be lost on the next save with nothing said.
  describe("a document with a list", () => {
    const base = JSON.parse(readFileSync(join(dir, files[0]!), "utf8")) as Record<string, unknown>;
    const rowText = (extra: Record<string, unknown> = {}) => ({
      kind: "text",
      payload: {
        id: "EEEEEEEE-0000-4000-8000-000000000A01",
        value: { kind: { kind: "item", field: "name" } },
        fontSize: 12,
        fontWeight: "regular",
        colorSlot: { baseColorHex: "#FFFFFF" },
        rules: [],
        frame: { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 },
        isHidden: false,
        ...extra,
      },
    });
    const listDoc = (payload: Record<string, unknown>) => ({
      ...base,
      elements: [{
        kind: "list",
        payload: {
          id: "EEEEEEEE-0000-4000-8000-000000000A00",
          rules: [],
          frame: { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 },
          isHidden: false,
          ...payload,
        },
      }],
    });

    it("passes the audit with every source key the contract names", () => {
      for (const source of [
        { kind: "entities", scope: { kind: "filter", domains: ["light"], areaIds: ["a"], labelIds: [], floorIds: [] }, stateFilter: { kind: "isOn" }, sort: "state", descending: true, attributes: ["brightness"] },
        { kind: "attribute", entityId: "media_player.lounge", displayName: "Lounge", domain: "media_player", attribute: "source_list" },
        { kind: "template", value: "{{ [] | to_json }}" },
        { kind: "calendar", entities: [{ entityId: "calendar.work", displayName: "Work", domain: "calendar" }], hours: 48 },
        { kind: "todo", entities: [{ entityId: "todo.shopping", displayName: "Shopping", domain: "todo" }], status: "open", sort: "due" },
        { kind: "forecast", entityId: "weather.home", displayName: "Home", domain: "weather", type: "hourly" },
      ]) {
        const doc = listDoc({ source, rows: 4, direction: "down", columns: 2, gap: 3, template: [rowText()] });
        expect(auditUnknownKeys(doc), source.kind).toEqual([]);
      }
    });

    it("names an unknown key inside a row layer", () => {
      const doc = listDoc({ source: { kind: "template", value: "" }, template: [rowText({ nonesuch: 1 })] });
      expect(auditUnknownKeys(doc)).toEqual(["$.elements[0].payload.template[0].payload.nonesuch"]);
    });

    it("names an unknown key on the source", () => {
      const doc = listDoc({ source: { kind: "todo", entities: [], status: "open", hours: 3 }, template: [] });
      expect(auditUnknownKeys(doc)).toEqual(["$.elements[0].payload.source.hours"]);
    });

    it("refuses a row that nests a list or draws in a box of its own", () => {
      for (const kind of ["list", "chart", "timeline", "chartTimes", "chartDots", "chartGrid", "imageTime"]) {
        const doc = listDoc({ source: { kind: "template", value: "" }, template: [{ kind, payload: { id: "EEEEEEEE-0000-4000-8000-000000000A02" } }] });
        expect(auditUnknownKeys(doc), kind).toEqual(["$.elements[0].payload.template[0].kind"]);
      }
    });

    it("refuses a row of more than eight layers", () => {
      const doc = listDoc({ source: { kind: "template", value: "" }, template: Array.from({ length: 9 }, () => rowText()) });
      expect(auditUnknownKeys(doc)).toEqual(["$.elements[0].payload.template.length"]);
    });

    it("parses, drops the layers it refused, and keeps the rest", () => {
      const doc = listDoc({
        source: { kind: "calendar", entities: [{ entityId: "calendar.work", displayName: "Work", domain: "calendar" }], hours: 48 },
        rows: 40,
        columns: 9,
        direction: "sideways",
        template: [rowText(), { kind: "chart", payload: { id: "EEEEEEEE-0000-4000-8000-000000000A03" } }],
      });
      const cfg = parseConfig(doc);
      const list = cfg.elements[0]!;
      expect(list.kind).toBe("list");
      if (list.kind !== "list") return;
      expect(list.payload.rows).toBe(12);
      expect(list.payload.columns).toBe(4);
      expect(list.payload.direction).toBe("down");
      expect(list.payload.template.map((e) => e.kind)).toEqual(["text"]);
      expect(list.payload.source).toEqual({
        kind: "calendar",
        entities: [{ entityId: "calendar.work", displayName: "Work", domain: "calendar" }],
        hours: 48,
      });
      expect(schemaVersionFor(cfg)).toBe(8);
    });

    it("round-trips through encode with nothing unknown left behind", () => {
      const doc = listDoc({
        source: { kind: "entities", scope: { kind: "entities", entities: [{ entityId: "light.hall", displayName: "Hall", domain: "light" }] }, sort: "lastChanged", descending: true, attributes: ["brightness"] },
        rows: 6,
        direction: "across",
        gap: 4,
        template: [rowText()],
      });
      const back = encodeConfig(parseConfig(doc));
      expect(auditUnknownKeys(back)).toEqual([]);
      expect(back.schemaVersion).toBe(8);
      expect(parseConfig(back).elements).toEqual(parseConfig(doc).elements);
    });
  });

  for (const file of files) {
    const raw = JSON.parse(readFileSync(join(dir, file), "utf8"));

    it(`${file} passes the unknown-key audit`, () => {
      expect(auditUnknownKeys(raw)).toEqual([]);
    });

    it(`${file} parses and keeps its identity`, () => {
      const config = parseConfig(raw);
      expect(config.id).toBe(raw.id);
      expect(config.slotIndex).toBe(raw.slotIndex);
      expect(config.name).toBe(raw.name);
      expect(config.elements.length).toBeGreaterThan(0);
      expect(config.tapAction.type).toBe(
        typeof raw.tapAction === "string" ? raw.tapAction : raw.tapAction.type,
      );
      // The Swift side stamps the same content → schemaVersion rule the panel uses.
      expect(raw.schemaVersion).toBe(schemaVersionFor(config));
      // An Open Page tap keeps its page through parse (and the editor's save
      // path re-encodes it — see encode.test.ts).
      if (typeof raw.openPageId === "string") {
        expect(config.openPageId).toBe(raw.openPageId);
        expect(config.openPageName).toBe(raw.openPageName);
      }
    });
  }
});
