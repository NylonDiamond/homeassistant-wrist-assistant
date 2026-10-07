// The shared behavior fixtures: documents the panel writes for the `behavior`
// kind (a watch's settings).
//
// `fixtures-behavior` is a copy of the app repo's `WristAssistantTests/
// Fixtures/behavior`. As for every shared fixture folder, the app's copy is
// canonical: the app repo's `scripts/sync-complication-fixtures.sh` checks
// the pair, and `--push` copies the app's files over these.
// `panel/defaults.json` is what "Start with the defaults" in Watch settings
// saves for a watch with no record yet, built here by
// `watchBehaviorDefaults()` and written with sorted keys, two space indent
// and a closing newline. The app decodes it as `BehaviorPreferences`. This
// is the one fixture the panel builds, so a change starts here: rebuild it
// with `WA_UPDATE_FIXTURES=1 npx vitest run test/watch-behavior-fixtures.test.ts`,
// bring it into the canonical copy with that script's `--pull`, and check the
// pair with the script.

import { describe, expect, it } from "vitest";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { watchBehaviorDefaults } from "../src/watch-settings.js";

const panelDir = join(__dirname, "fixtures-behavior", "panel");

/** A document as the fixture holds it: sorted keys at every level, two space
 * indent, one newline at the end. */
function fixtureText(document: unknown): string {
  const sorted = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(sorted);
    if (typeof value === "object" && value !== null) {
      const out: Record<string, unknown> = {};
      for (const key of Object.keys(value).sort()) out[key] = sorted((value as Record<string, unknown>)[key]);
      return out;
    }
    return value;
  };
  return `${JSON.stringify(sorted(document), null, 2)}\n`;
}

describe("panel-written behavior", () => {
  it("defaults.json is what Start with the defaults saves, byte for byte", () => {
    const text = fixtureText(watchBehaviorDefaults());
    if (process.env.WA_UPDATE_FIXTURES === "1") {
      mkdirSync(panelDir, { recursive: true });
      writeFileSync(join(panelDir, "defaults.json"), text);
    }
    expect(readFileSync(join(panelDir, "defaults.json"), "utf8")).toBe(text);
  });

  it("is already in the fixture's key order, so the bytes sent are the same document", () => {
    const built = watchBehaviorDefaults();
    expect(JSON.stringify(built, null, 2) + "\n").toBe(fixtureText(built));
    expect(JSON.parse(readFileSync(join(panelDir, "defaults.json"), "utf8"))).toEqual(built);
  });
});
