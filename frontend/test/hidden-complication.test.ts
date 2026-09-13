// Hiding a complication from the watch's picker: one optional `hidden: true` on
// the document. Writers omit it when shown, a share drops it, a backup keeps it,
// and an import always starts shown.

import { describe, expect, it } from "vitest";

import { encodeConfig, isHiddenDocument, newConfig, parseConfig, splitHidden, withHidden } from "../src/model.js";
import { exportText, parseImportText } from "../src/transfer.js";

const MAX_SCHEMA = 6;

function hiddenConfig() {
  const cfg = newConfig("Porch", 0);
  cfg.hidden = true;
  return cfg;
}

describe("hidden flag on the document", () => {
  it("round trips true and omits the key when shown", () => {
    const cfg = hiddenConfig();
    const encoded = encodeConfig(cfg);
    expect(encoded.hidden).toBe(true);
    expect(parseConfig(encoded).hidden).toBe(true);

    delete cfg.hidden;
    expect("hidden" in encodeConfig(cfg)).toBe(false);
    expect("hidden" in encodeConfig(parseConfig({ ...encoded, hidden: false }))).toBe(false);
    expect(parseConfig({ ...encoded, hidden: "yes" }).hidden).toBeUndefined();
  });

  it("reads only a literal true as hidden", () => {
    expect(isHiddenDocument({ hidden: true })).toBe(true);
    expect(isHiddenDocument({ hidden: false })).toBe(false);
    expect(isHiddenDocument({ hidden: "true" })).toBe(false);
    expect(isHiddenDocument({})).toBe(false);
    expect(isHiddenDocument(null)).toBe(false);
  });

  it("sets or clears the key without touching anything else", () => {
    const doc = { id: "A", name: "x", futureKey: [1] };
    const hidden = withHidden(doc, true);
    expect(hidden).toEqual({ id: "A", name: "x", futureKey: [1], hidden: true });
    expect("hidden" in doc).toBe(false);
    expect(withHidden(hidden, false)).toEqual(doc);
  });
});

describe("hidden flag in share, backup and import", () => {
  it("a share drops it and a backup keeps it", () => {
    const cfg = hiddenConfig();
    expect(JSON.parse(exportText(cfg, "share", [])).hidden).toBeUndefined();
    expect(JSON.parse(exportText(cfg, "backup")).hidden).toBe(true);
  });

  it("an import starts shown, even from a backup of a hidden one", () => {
    const text = exportText(hiddenConfig(), "backup");
    const parse = parseImportText(text, MAX_SCHEMA);
    expect(parse.ok).toBe(true);
    if (!parse.ok) return;
    expect(parse.config.hidden).toBeUndefined();
    expect("hidden" in encodeConfig(parse.config)).toBe(false);
  });
});

describe("hidden section of the picker", () => {
  const rows = [
    { id: "a", hidden: true },
    { id: undefined, hidden: false },
    { id: "b", hidden: true },
    { id: "c", hidden: false },
    { id: "d", hidden: true },
  ];
  const info = (r: (typeof rows)[number]) => (r.id === undefined ? undefined : { id: r.id, hidden: r.hidden });

  it("tucks hidden rows away in order, keeping the open one and locked slots in view", () => {
    const { shown, hidden } = splitHidden(rows, info, "b");
    expect(shown.map((r) => r.id)).toEqual([undefined, "b", "c"]);
    expect(hidden.map((r) => r.id)).toEqual(["a", "d"]);
  });

  it("hides nothing when no document says so", () => {
    const { shown, hidden } = splitHidden(rows.map((r) => ({ ...r, hidden: false })), info, undefined);
    expect(shown).toHaveLength(rows.length);
    expect(hidden).toHaveLength(0);
  });
});
