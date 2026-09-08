// Panel-safety of the iPhone's preset transfer. Every JSON under
// test/fixtures-transfer/ is a real Swift-encoded document produced by
// PresetCustomConverter (regenerate with the app's emitTransferFixtures test).
// Each one must pass auditUnknownKeys with no findings — a finding means the
// panel would open the transferred document read-only — and must parse into a
// config the editor can round-trip.

import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { auditUnknownKeys, parseConfig, schemaVersionFor } from "../src/model.js";

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
