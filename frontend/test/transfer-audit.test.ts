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
      // The Swift side stamps the same slot → schemaVersion rule the panel uses.
      expect(raw.schemaVersion).toBe(schemaVersionFor(raw.slotIndex));
      // An Open Page tap keeps its page through parse (and the editor's save
      // path re-encodes it — see encode.test.ts).
      if (typeof raw.openPageId === "string") {
        expect(config.openPageId).toBe(raw.openPageId);
        expect(config.openPageName).toBe(raw.openPageName);
      }
    });
  }
});
