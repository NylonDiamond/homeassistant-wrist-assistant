// The settings form cases shared with the app
// (docs/device_settings_edit_plan_2026-11.md in the app repo).
//
// `fixtures-settings-form/cases.json` is a copy of the app repo's
// `WristAssistantTests/Fixtures/settings-form`, which is canonical: edit it
// there and `--push` with that repo's `scripts/sync-complication-fixtures.sh`.
// The app's `SettingsFormTests` runs the same cases against its own reader, so
// a row reads, shows and saves the same in the panel, on the iPhone and on the
// watch.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  type BehaviorDocument,
  type SettingValue,
  buildSaveDocument,
  catalogFor,
  catalogSettings,
  formValues,
  isShown,
  sameValue,
  withEdit,
} from "../src/watch-settings.js";

interface Cases {
  values: { name: string; document: BehaviorDocument; expect: Record<string, SettingValue> }[];
  shown: { name: string; device: "watch" | "iphone"; document: BehaviorDocument; key: string; shown: boolean }[];
  edits: { name: string; document: BehaviorDocument; key: string; value: SettingValue; expect: BehaviorDocument }[];
}

const cases = JSON.parse(readFileSync(join(__dirname, "fixtures-settings-form", "cases.json"), "utf8")) as Cases;
const byKey = new Map(catalogSettings().map((s) => [s.key, s]));

describe("settings form cases shared with the app", () => {
  for (const c of cases.values) {
    it(`values: ${c.name}`, () => {
      const values = formValues(c.document);
      for (const [key, expected] of Object.entries(c.expect)) {
        expect(sameValue(values.get(key), expected), key).toBe(true);
      }
    });
  }

  for (const c of cases.shown) {
    it(`shown: ${c.name}`, () => {
      const setting = catalogFor(c.device).flatMap((s) => s.settings).find((s) => s.key === c.key);
      expect(setting).toBeDefined();
      expect(isShown(setting!, formValues(c.document))).toBe(c.shown);
    });
  }

  for (const c of cases.edits) {
    it(`edits: ${c.name}`, () => {
      const setting = byKey.get(c.key);
      expect(setting).toBeDefined();
      const edits = withEdit(new Map(), c.document, setting!, c.value);
      expect(buildSaveDocument(c.document, edits)).toEqual(c.expect);
    });
  }
});
