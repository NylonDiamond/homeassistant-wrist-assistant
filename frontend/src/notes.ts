// A complication's notes: plain text the author writes for whoever imports the
// design, shown on top of the Layers list. Editor-only, like layer groups: the
// watch and the iPhone never draw them, and a share or a gallery upload carries
// them so the reader finds them after import.
//
// The text stays plain on the wire. This file reads a little structure out of
// it for display, and nothing more:
//
//   - a blank line starts a new block;
//   - lines starting "1." or "1)" are a numbered list, "-", "*" or "•" a
//     bulleted one;
//   - a block that is one short line with no closing punctuation is a heading;
//   - `[Name]` names a shared value, a group or a layer, and becomes a link to
//     it when one of them has that name.

export const NOTES_MAX = 2000;

/** Where a `[Name]` in the notes points. */
export type NoteTarget =
  | { kind: "value"; id: string }
  | { kind: "group"; id: string }
  | { kind: "layer"; id: string };

export type NoteSpan =
  | { kind: "text"; text: string }
  | { kind: "link"; text: string; target: NoteTarget };

export type NoteBlock =
  | { kind: "heading"; spans: NoteSpan[] }
  | { kind: "para"; spans: NoteSpan[] }
  | { kind: "list"; ordered: boolean; items: NoteSpan[][] };

/** A heading is short. Past this it reads as a sentence that lost its stop. */
const HEADING_MAX = 40;
const ORDERED_RE = /^\s*\d{1,3}[.)]\s+/;
const BULLET_RE = /^\s*[-*•]\s+/;
const LINK_RE = /\[([^\[\]\n]{1,60})\]/g;

/** The notes as stored: trimmed, capped, and undefined when there is nothing
 * to say, so an emptied box takes the key off the document. */
export function cleanNotes(text: unknown): string | undefined {
  if (typeof text !== "string") return undefined;
  const trimmed = text.replace(/\r\n?/g, "\n").trim();
  return trimmed === "" ? undefined : trimmed.slice(0, NOTES_MAX);
}

/** What an empty notes box shows, as an example of the three things worth
 * saying. */
export const NOTES_PLACEHOLDER = "What it shows.\n\nSet up\n1. Point [Kitchen light] at your own light.\n2. …\n\nTap it to …";

/**
 * The opening of the notes as one plain paragraph, for the gallery's
 * description: the first block of prose, links as their names, cut at a word
 * before `max`. Lists and headings are skipped, since a description is a
 * sentence about the design and not its setup steps.
 */
export function notesSummary(text: string, max: number): string {
  const para = parseNotes(text, () => undefined).find((b) => b.kind === "para");
  const flat = para?.kind === "para"
    ? para.spans.map((s) => s.text).join("").replace(LINK_RE, "$1").replace(/\s*\n\s*/g, " ").trim()
    : notesPreview(text);
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > max / 2 ? cut.slice(0, space) : cut).trimEnd()}…`;
}

// ── the editor's toolbar ──────────────────────────────────────────────────
//
// Each button writes the same plain text a person would type, so the notes on
// the wire never change shape: the toolbar is a shortcut, not a format.

/** The text after a toolbar action, and the selection to put back. */
export interface NoteEdit {
  text: string;
  start: number;
  end: number;
}

/** The whole lines a selection touches, as offsets into the text. */
function lineSpan(text: string, start: number, end: number): [number, number] {
  const from = text.lastIndexOf("\n", start - 1) + 1;
  // A selection that ends just after a newline stops at the line above.
  const last = end > start && text[end - 1] === "\n" ? end - 1 : end;
  const nl = text.indexOf("\n", last);
  return [from, nl < 0 ? text.length : nl];
}

function stripMarker(line: string): string {
  return line.replace(ORDERED_RE, "").replace(BULLET_RE, "").trimStart();
}

/**
 * Numbered list or bullets on the lines the selection touches. When every one
 * of them already is that kind of list, they go back to plain lines; a
 * numbered list carries on from a numbered line just above.
 */
export function toggleNoteList(text: string, start: number, end: number, ordered: boolean): NoteEdit {
  const [from, to] = lineSpan(text, start, end);
  const lines = text.slice(from, to).split("\n");
  const marker = ordered ? ORDERED_RE : BULLET_RE;
  const filled = lines.filter((l) => l.trim() !== "");
  const off = filled.length > 0 && filled.every((l) => marker.test(l));
  const above = text.slice(0, Math.max(0, from - 1)).split("\n").at(-1) ?? "";
  let n = ordered ? Number(/^\s*(\d{1,3})[.)]\s+/.exec(above)?.[1] ?? 0) : 0;
  const next = lines.map((l) => {
    if (l.trim() === "" && filled.length > 0) return l;
    if (off) return stripMarker(l);
    n += 1;
    return `${ordered ? `${n}. ` : "- "}${stripMarker(l)}`;
  });
  const block = next.join("\n");
  const out = text.slice(0, from) + block + text.slice(to);
  // A caret stays a caret, at the end of its line; a selection keeps the
  // whole block selected, so a second press can undo the first.
  return start === end && lines.length === 1
    ? { text: out, start: from + block.length, end: from + block.length }
    : { text: out, start: from, end: from + block.length };
}

/**
 * The caret's line as a heading: on a line of its own, with a blank line on
 * each side, no list marker and no closing stop, which is what `parseNotes`
 * reads as one. An empty line becomes a heading to type over.
 */
export function makeNoteHeading(text: string, start: number): NoteEdit {
  const [from, to] = lineSpan(text, start, start);
  const words = stripMarker(text.slice(from, to)).trim().replace(/[.!?,;:]+$/, "") || "Set up";
  const before = text.slice(0, from).replace(/\n+$/, "");
  const after = text.slice(to).replace(/^\n+/, "");
  const head = before === "" ? "" : `${before}\n\n`;
  const out = `${head}${words}${after === "" ? "" : `\n\n${after}`}`;
  return { text: out, start: head.length, end: head.length + words.length };
}

/** A `[Name]` link in place of the selection, spaced off the words around
 * it, with the caret after it. */
export function insertNoteLink(text: string, start: number, end: number, name: string): NoteEdit {
  const before = text.slice(0, start);
  const after = text.slice(end);
  const lead = before === "" || /\s$/.test(before) ? "" : " ";
  const tail = after === "" || /^[\s.,;:!?)]/.test(after) ? "" : " ";
  const link = `${lead}[${name}]${tail}`;
  const caret = start + link.length;
  return { text: before + link + after, start: caret, end: caret };
}

/** A link's tooltip: what a click on it does. */
export function noteTargetTitle(target: NoteTarget): string {
  return target.kind === "value" ? "Open this shared value"
    : target.kind === "group" ? "Select this group"
    : "Select this layer";
}

/** The first line, for the folded row. */
export function notesPreview(text: string): string {
  const first = text.split("\n").map((l) => l.trim()).find((l) => l !== "") ?? "";
  return first.replace(ORDERED_RE, "").replace(BULLET_RE, "").replace(LINK_RE, "$1");
}

/** Split one line into text and links. A `[Name]` nothing answers to stays
 * as typed, brackets and all, so the author sees it did not match. */
export function noteSpans(line: string, resolve: (name: string) => NoteTarget | undefined): NoteSpan[] {
  const out: NoteSpan[] = [];
  let at = 0;
  const push = (text: string) => {
    if (text === "") return;
    const last = out.at(-1);
    if (last?.kind === "text") last.text += text;
    else out.push({ kind: "text", text });
  };
  for (const m of line.matchAll(LINK_RE)) {
    const name = m[1]!.trim();
    const target = name === "" ? undefined : resolve(name);
    push(line.slice(at, m.index));
    if (target) out.push({ kind: "link", text: name, target });
    else push(m[0]);
    at = m.index + m[0].length;
  }
  push(line.slice(at));
  return out;
}

export function parseNotes(text: string, resolve: (name: string) => NoteTarget | undefined): NoteBlock[] {
  const blocks: NoteBlock[] = [];
  let para: string[] = [];
  let list: { ordered: boolean; items: string[] } | undefined;
  const flushPara = () => {
    if (para.length === 0) return;
    const one = para.length === 1 ? para[0]! : undefined;
    const heading = one !== undefined && one.length <= HEADING_MAX && !/[.!?,;]$/.test(one);
    const joined = para.join("\n");
    blocks.push({ kind: heading ? "heading" : "para", spans: noteSpans(heading ? joined.replace(/:$/, "") : joined, resolve) });
    para = [];
  };
  const flushList = () => {
    if (!list) return;
    blocks.push({ kind: "list", ordered: list.ordered, items: list.items.map((item) => noteSpans(item, resolve)) });
    list = undefined;
  };
  for (const raw of text.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trim();
    if (line === "") {
      flushPara();
      flushList();
      continue;
    }
    const ordered = ORDERED_RE.test(line);
    const bullet = !ordered && BULLET_RE.test(line);
    if (ordered || bullet) {
      flushPara();
      if (list && list.ordered !== ordered) flushList();
      list ??= { ordered, items: [] };
      list.items.push(line.replace(ordered ? ORDERED_RE : BULLET_RE, ""));
      continue;
    }
    if (list) {
      // A line under a list item with no marker of its own carries on that
      // item, the way people wrap a long step.
      list.items[list.items.length - 1] += ` ${line}`;
      continue;
    }
    para.push(line);
  }
  flushPara();
  flushList();
  return blocks;
}
