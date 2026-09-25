// A complication's notes: stored trimmed and only when there is something to
// say, carried by Share and the gallery (or not, when the author says so),
// with the author's entity ids swapped for slot labels, and read into
// headings, lists and links for the card on top of the Layers list.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  type CustomComplicationConfig,
  auditUnknownKeys,
  documentEntityUses,
  encodeConfig,
  parseConfig,
} from "../src/model.js";
import { exportText, parseImportText, shareSlots } from "../src/transfer.js";
import { buildGallerySubmission } from "../src/gallery.js";
import {
  NOTES_MAX,
  type NoteTarget,
  cleanNotes,
  noteSpans,
  notesPreview,
  notesSummary,
  parseNotes,
} from "../src/notes.js";

function livingRoom(): CustomComplicationConfig {
  const parsed = parseImportText(readFileSync(join(__dirname, "fixtures-share", "living-room-backup.json"), "utf8"), 6);
  if (!parsed.ok) throw new Error(parsed.error);
  const cfg = parsed.config;
  cfg.supportedFamilies = ["rectangular"];
  return cfg;
}

const NAMES: Record<string, NoteTarget> = {
  "kitchen light": { kind: "value", id: "V1" },
  readings: { kind: "group", id: "G1" },
};
const resolve = (name: string) => NAMES[name.toLowerCase()];

describe("notes on the document", () => {
  it("round-trips, trimmed, and stays off a document without any", () => {
    const cfg = livingRoom();
    expect(encodeConfig(cfg)).not.toHaveProperty("notes");
    cfg.notes = "  Set it up.\r\n\n1. Pick a light.  ";
    const encoded = encodeConfig(cfg);
    expect(encoded.notes).toBe("Set it up.\n\n1. Pick a light.");
    expect(parseConfig(encoded).notes).toBe("Set it up.\n\n1. Pick a light.");
    expect(auditUnknownKeys(encoded)).toEqual([]);
  });

  it("drops blank notes and caps long ones", () => {
    expect(cleanNotes("   \n ")).toBeUndefined();
    expect(cleanNotes(42)).toBeUndefined();
    expect(cleanNotes("x".repeat(NOTES_MAX + 50))).toHaveLength(NOTES_MAX);
    const cfg = livingRoom();
    cfg.notes = "  ";
    expect(encodeConfig(cfg)).not.toHaveProperty("notes");
  });

  it("travels in the Share text, with the author's entity ids swapped for slot labels", () => {
    const cfg = livingRoom();
    const known = new Set(documentEntityUses(cfg).map((u) => u.entityId.split(".")[0] ?? ""));
    const slots = shareSlots(cfg, known).map((s, i) => ({ ...s, label: `Thing ${i + 1}` }));
    const first = slots[0]!;
    cfg.notes = `Point it at ${first.originalId} or similar.`;
    const text = exportText(cfg, "share", slots);
    expect(text).not.toContain(first.originalId);
    const parsed = parseImportText(text, 99);
    if (!parsed.ok) throw new Error(parsed.error);
    expect(parsed.config.notes).toBe("Point it at Thing 1 or similar.");
  });

  it("goes to the gallery unless the author turns it off", () => {
    const cfg = livingRoom();
    cfg.notes = "Tap to toggle.";
    const meta = { title: "Room", description: "", authorName: "", tags: [], panelVersion: "1" };
    expect(buildGallerySubmission(cfg, [], meta).shareText).toContain("Tap to toggle.");
    expect(buildGallerySubmission(cfg, [], { ...meta, includeNotes: true }).shareText).toContain("Tap to toggle.");
    const without = buildGallerySubmission(cfg, [], { ...meta, includeNotes: false }).shareText;
    expect(without).not.toContain("Tap to toggle.");
    expect(JSON.parse(without)).not.toHaveProperty("notes");
    // The author's own document keeps its notes either way.
    expect(cfg.notes).toBe("Tap to toggle.");
  });
});

describe("reading notes", () => {
  it("turns a known [Name] into a link and leaves an unknown one as typed", () => {
    expect(noteSpans("Set [Kitchen light] and [Nope].", resolve)).toEqual([
      { kind: "text", text: "Set " },
      { kind: "link", text: "Kitchen light", target: { kind: "value", id: "V1" } },
      { kind: "text", text: " and [Nope]." },
    ]);
  });

  it("finds headings, numbered and bulleted lists, and paragraphs", () => {
    const blocks = parseNotes([
      "A house that lights up.",
      "",
      "Set up:",
      "1. Point [Kitchen light] at your light.",
      "2) Open [Readings]",
      "   and set the sensors.",
      "- a bullet",
      "",
      "Tap a window to toggle it.",
      "Tap the arrow to refresh.",
    ].join("\n"), resolve);
    expect(blocks.map((b) => b.kind)).toEqual(["para", "heading", "list", "list", "para"]);
    expect(blocks[1]).toEqual({ kind: "heading", spans: [{ kind: "text", text: "Set up" }] });
    const steps = blocks[2]!;
    if (steps.kind !== "list") throw new Error("not a list");
    expect(steps.ordered).toBe(true);
    expect(steps.items).toHaveLength(2);
    expect(steps.items[1]).toEqual([
      { kind: "text", text: "Open " },
      { kind: "link", text: "Readings", target: { kind: "group", id: "G1" } },
      { kind: "text", text: " and set the sensors." },
    ]);
    const bullets = blocks[3]!;
    expect(bullets.kind === "list" && !bullets.ordered).toBe(true);
    const last = blocks[4]!;
    expect(last.kind === "para" && last.spans[0]?.kind === "text" && last.spans[0].text)
      .toBe("Tap a window to toggle it.\nTap the arrow to refresh.");
  });

  it("does not take a sentence for a heading", () => {
    expect(parseNotes("Works on its own.", resolve)[0]!.kind).toBe("para");
    expect(parseNotes("x ".repeat(30).trim(), resolve)[0]!.kind).toBe("para");
  });

  it("previews the first line and summarises the first paragraph", () => {
    expect(notesPreview("\n1. Set [Kitchen light]\n2. Go")).toBe("Set Kitchen light");
    expect(notesSummary("Set up\n\nA [house] that lights\nup with your home.\n\n1. Step", 500))
      .toBe("A house that lights up with your home.");
    const long = notesSummary(`${"word ".repeat(40)}end.`, 30);
    expect(long.length).toBeLessThanOrEqual(30);
    expect(long.endsWith("…")).toBe(true);
  });
});
