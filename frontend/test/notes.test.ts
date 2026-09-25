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
  insertNoteLink,
  insertNoteUrl,
  noteUrlFromInput,
  safeHref,
  toggleNoteHeading,
  toggleNoteList,
  toggleNoteMark,
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
      "## Set up",
      "1. Point [Kitchen light] at your light.",
      "2) Open [Readings]",
      "   and set the sensors.",
      "- a bullet",
      "",
      "Tap a window to toggle it.",
      "Tap the arrow to refresh.",
    ].join("\n"), resolve);
    expect(blocks.map((b) => b.kind)).toEqual(["para", "heading", "list", "list", "para"]);
    expect(blocks[1]).toEqual({ kind: "heading", level: 2, spans: [{ kind: "text", text: "Set up" }] });
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

  it("takes only a # line for a heading", () => {
    expect(parseNotes("Set up", resolve)[0]!.kind).toBe("para");
    expect(parseNotes("#nospace", resolve)[0]!.kind).toBe("para");
    expect(parseNotes("# One\n### Three ##", resolve)).toEqual([
      { kind: "heading", level: 1, spans: [{ kind: "text", text: "One" }] },
      { kind: "heading", level: 3, spans: [{ kind: "text", text: "Three" }] },
    ]);
  });

  it("reads bold, italic and both, leaving a lone mark and snake_case alone", () => {
    expect(noteSpans("a **b** *c* _d_ ***e***", resolve)).toEqual([
      { kind: "text", text: "a " },
      { kind: "strong", spans: [{ kind: "text", text: "b" }] },
      { kind: "text", text: " " },
      { kind: "em", spans: [{ kind: "text", text: "c" }] },
      { kind: "text", text: " " },
      { kind: "em", spans: [{ kind: "text", text: "d" }] },
      { kind: "text", text: " " },
      { kind: "strong", spans: [{ kind: "em", spans: [{ kind: "text", text: "e" }] }] },
    ]);
    expect(noteSpans("2 * 3 and light_kitchen_main and ** x **", resolve))
      .toEqual([{ kind: "text", text: "2 * 3 and light_kitchen_main and ** x **" }]);
    expect(noteSpans("\\*not italic\\*", resolve)).toEqual([{ kind: "text", text: "*not italic*" }]);
    expect(noteSpans("**Set [Kitchen light]**", resolve)).toEqual([{ kind: "strong", spans: [
      { kind: "text", text: "Set " },
      { kind: "link", text: "Kitchen light", target: { kind: "value", id: "V1" } },
    ] }]);
  });

  it("opens web links to http and https only", () => {
    expect(noteSpans("See [the guide](https://example.com/a?b=1).", resolve)).toEqual([
      { kind: "text", text: "See " },
      { kind: "url", text: "the guide", href: "https://example.com/a?b=1" },
      { kind: "text", text: "." },
    ]);
    expect(noteSpans("[x](javascript:alert(1))", resolve)).toEqual([{ kind: "text", text: "[x](javascript:alert(1))" }]);
    expect(safeHref("data:text/html,hi")).toBeUndefined();
    expect(safeHref("https://a.b/\"onmouseover")).toBeUndefined();
    expect(noteUrlFromInput("example.com/x")).toBe("https://example.com/x");
    expect(noteUrlFromInput("ftp://example.com")).toBeUndefined();
    expect(noteUrlFromInput("not a link")).toBeUndefined();
  });

  it("previews the first line and summarises the first paragraph", () => {
    expect(notesPreview("\n1. Set [Kitchen light]\n2. Go")).toBe("Set Kitchen light");
    expect(notesPreview("## **Set** up")).toBe("Set up");
    expect(notesSummary("## Set up\n\nA [house] that *lights*\nup with your home.\n\n1. Step", 500))
      .toBe("A house that lights up with your home.");
    const long = notesSummary(`${"word ".repeat(40)}end.`, 30);
    expect(long.length).toBeLessThanOrEqual(30);
    expect(long.endsWith("…")).toBe(true);
  });
});

describe("the notes toolbar", () => {
  it("numbers the picked lines, carries on a list above, and takes the numbers off again", () => {
    const text = "Steps\n1. First\nSecond\nThird";
    const start = text.indexOf("Second");
    const on = toggleNoteList(text, start, text.length, true);
    expect(on.text).toBe("Steps\n1. First\n2. Second\n3. Third");
    expect(on.text.slice(on.start, on.end)).toBe("2. Second\n3. Third");
    const off = toggleNoteList(on.text, on.start, on.end, true);
    expect(off.text).toBe("Steps\n1. First\nSecond\nThird");
  });

  it("turns bullets into numbers rather than stacking markers", () => {
    expect(toggleNoteList("- a\n- b", 0, 7, true).text).toBe("1. a\n2. b");
    expect(toggleNoteList("1. a\n2. b", 0, 9, false).text).toBe("- a\n- b");
  });

  it("puts a marker on an empty line and leaves the caret after it", () => {
    const edit = toggleNoteList("Intro\n", 6, 6, false);
    expect(edit.text).toBe("Intro\n- ");
    expect(edit.start).toBe(8);
    expect(toggleNoteList("", 0, 0, true)).toEqual({ text: "1. ", start: 3, end: 3 });
  });

  it("puts ## on the caret's line and takes it off again", () => {
    const text = "Intro.\n1. Set up\nMore text.";
    const on = toggleNoteHeading(text, text.indexOf("Set"));
    expect(on.text).toBe("Intro.\n## Set up\nMore text.");
    expect(on.start).toBe(on.text.indexOf("\nMore"));
    expect(parseNotes(on.text, () => undefined)[1]).toEqual({ kind: "heading", level: 2, spans: [{ kind: "text", text: "Set up" }] });
    expect(toggleNoteHeading(on.text, on.start).text).toBe("Intro.\nSet up\nMore text.");
    expect(toggleNoteHeading("", 0)).toEqual({ text: "## ", start: 3, end: 3 });
  });

  it("wraps the selection in bold or italic, and unwraps it", () => {
    const bold = toggleNoteMark("tap it now", 4, 7, "**");
    expect(bold).toEqual({ text: "tap **it** now", start: 6, end: 8 });
    expect(toggleNoteMark(bold.text, bold.start, bold.end, "**").text).toBe("tap it now");
    // Italic inside bold is bold italic, and comes off again on its own.
    const both = toggleNoteMark(bold.text, bold.start, bold.end, "*");
    expect(both.text).toBe("tap ***it*** now");
    expect(toggleNoteMark(both.text, both.start, both.end, "*").text).toBe("tap **it** now");
    // Nothing selected: the pair, with the caret between.
    expect(toggleNoteMark("a ", 2, 2, "*")).toEqual({ text: "a **", start: 3, end: 3 });
    // A trailing space picked up by a double-click stays outside.
    expect(toggleNoteMark("tap it now", 4, 7, "*").text).toBe("tap *it* now");
  });

  it("inserts a web link with the selected words, or the address", () => {
    expect(insertNoteUrl("See the guide.", 4, 13, "https://x.io").text).toBe("See [the guide](https://x.io).");
    expect(insertNoteUrl("See", 3, 3, "https://x.io/a").text).toBe("See [x.io/a](https://x.io/a)");
  });

  it("inserts a link spaced off the words around it", () => {
    expect(insertNoteLink("Setthen", 3, 3, "Weather")).toEqual({ text: "Set [Weather] then", start: 14, end: 14 });
    expect(insertNoteLink("Set X.", 4, 5, "Weather").text).toBe("Set [Weather].");
    expect(insertNoteLink("", 0, 0, "Weather")).toEqual({ text: "[Weather]", start: 9, end: 9 });
  });
});
