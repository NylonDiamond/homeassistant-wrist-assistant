// The whole-home backup: one file with every design, read back into
// Unassigned. The rules that matter are that a backup round trips exactly,
// that linked copies are written once, that one bad design does not stop the
// rest, and that a restore never gives two designs one seat or one name.

import { describe, expect, it } from "vitest";
import { newConfig } from "../src/model.js";
import {
  BACKUP_KIND,
  backupFileName,
  backupText,
  exportText,
  parseBackupText,
  parseImportText,
  planRestore,
} from "../src/transfer.js";

const MAX = 99;
const when = new Date(2026, 8, 22, 10, 0, 0);

function sequence() {
  let n = 0;
  return () => `00000000-0000-4000-8000-${String(++n).padStart(12, "0")}`;
}

describe("backupText", () => {
  it("writes each design once, with every device it was on", () => {
    const kitchen = newConfig("Kitchen", 3);
    const onPhone = { ...structuredClone(kitchen), id: "OTHER", slotIndex: 7, linkId: "L1" };
    const porch = newConfig("Porch", 0, "circular");
    const text = backupText([
      { device: "Watch", config: kitchen },
      { device: "iPhone", config: onPhone },
      { device: "Watch", config: porch },
    ], when);
    const raw = JSON.parse(text);
    expect(raw.kind).toBe(BACKUP_KIND);
    expect(raw.complications).toHaveLength(2);
    expect(raw.complications[0].devices).toEqual(["Watch", "iPhone"]);
    expect(raw.complications[0].document.id).toBeUndefined();
    expect(raw.complications[0].document.linkId).toBeUndefined();
  });

  it("names the file by day", () => {
    expect(backupFileName(when)).toBe("Wrist-Assistant-complications-2026-09-22.json");
  });
});

describe("parseBackupText", () => {
  it("reads each design exactly as a single backup export would", () => {
    const kitchen = newConfig("Kitchen", 3);
    const parse = parseBackupText(backupText([{ device: "Watch", config: kitchen }], when), MAX);
    expect(parse?.ok).toBe(true);
    if (!parse?.ok) return;
    const single = parseImportText(exportText(kitchen, "backup"), MAX);
    expect(single.ok).toBe(true);
    if (!single.ok) return;
    expect(parse.entries[0]!.config).toEqual(single.config);
    expect(parse.entries[0]!.devices).toEqual(["Watch"]);
    expect(parse.createdAt).toBe(when.toISOString());
  });

  it("is not a backup when the text is one complication or not JSON", () => {
    expect(parseBackupText(exportText(newConfig("Kitchen", 0), "backup"), MAX)).toBeUndefined();
    expect(parseBackupText("hello", MAX)).toBeUndefined();
    expect(parseBackupText("[]", MAX)).toBeUndefined();
  });

  it("keeps the good designs when one is damaged", () => {
    const text = backupText([{ device: "Watch", config: newConfig("Kitchen", 0) }], when);
    const raw = JSON.parse(text);
    raw.complications.push({ devices: ["Watch"], document: { name: "Broken" } });
    const parse = parseBackupText(JSON.stringify(raw), MAX);
    expect(parse?.ok).toBe(true);
    if (!parse?.ok) return;
    expect(parse.entries).toHaveLength(1);
    expect(parse.problems.map((p) => p.name)).toEqual(["Broken"]);
  });

  it("refuses a backup from a newer panel", () => {
    const parse = parseBackupText(JSON.stringify({ kind: BACKUP_KIND, version: 2, complications: [] }), MAX);
    expect(parse?.ok).toBe(false);
  });

  it("refuses a backup with no list", () => {
    const parse = parseBackupText(JSON.stringify({ kind: BACKUP_KIND, version: 1 }), MAX);
    expect(parse?.ok).toBe(false);
  });
});

describe("planRestore", () => {
  const entries = (...names: [string, "rectangular" | "circular"][]) =>
    names.map(([name, family]) => ({ devices: [], config: newConfig(name, 0, family) }));

  it("gives every design its own seat per shape and a free name", () => {
    const plan = planRestore(
      entries(["Kitchen", "rectangular"], ["Kitchen", "rectangular"], ["Porch", "circular"]),
      [{ slotIndex: 0, families: ["rectangular"] }],
      [],
      new Set(["kitchen"]),
      sequence(),
    );
    expect(plan.full).toEqual([]);
    expect(plan.writes.map((c) => c.name)).toEqual(["Kitchen 2", "Kitchen 3", "Porch"]);
    expect(plan.writes.map((c) => c.slotIndex)).toEqual([1, 2, 0]);
    expect(new Set(plan.writes.map((c) => c.id)).size).toBe(3);
  });

  it("stays clear of blocked seats", () => {
    const plan = planRestore(entries(["A", "rectangular"]), [], [{ slot: 0 }, { slot: 1 }], new Set(), sequence());
    expect(plan.writes[0]!.slotIndex).toBe(2);
  });

  it("lists what has no seat left", () => {
    const held = Array.from({ length: 64 }, (_, i) => ({ slotIndex: i, families: ["rectangular" as const] }));
    const plan = planRestore(entries(["A", "rectangular"], ["B", "circular"]), held, [], new Set(), sequence());
    expect(plan.full).toEqual(["A"]);
    expect(plan.writes.map((c) => c.name)).toEqual(["B"]);
  });
});
