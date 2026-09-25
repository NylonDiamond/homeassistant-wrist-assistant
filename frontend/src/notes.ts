// A complication's notes: the author's words to whoever imports the design,
// shown on top of the Layers list. Editor-only, like layer groups: the watch
// and the iPhone never draw them, and a share or a gallery upload carries them
// so the reader finds them after import.
//
// The text is a small, safe part of Markdown, so it reads well as typed. The
// gallery page shows only the description, never the notes; they travel in
// the share text and open here after import:
//
//   - a blank line starts a new block;
//   - `#`, `##` or `###` and a space start a heading;
//   - lines starting "1." or "1)" are a numbered list, "-", "*" or "•" a
//     bulleted one;
//   - `**bold**`, `*italic*` or `_italic_`, and a backslash before a mark to
//     type it plainly;
//   - `[text](https://…)` is a link to a web page, http and https only;
//   - `[Name]` names a shared value, a group or a layer, and becomes a link to
//     it when one of them has that name.
//
// Left out on purpose: images and raw HTML. Notes come from strangers through
// the gallery, and a picture can report who opened it.

export const NOTES_MAX = 2000;

/** Where a `[Name]` in the notes points. */
export type NoteTarget =
  | { kind: "value"; id: string }
  | { kind: "group"; id: string }
  | { kind: "layer"; id: string };

export type NoteSpan =
  | { kind: "text"; text: string }
  | { kind: "link"; text: string; target: NoteTarget }
  | { kind: "url"; text: string; href: string }
  | { kind: "strong"; spans: NoteSpan[] }
  | { kind: "em"; spans: NoteSpan[] };

export type NoteBlock =
  | { kind: "heading"; level: 1 | 2 | 3; spans: NoteSpan[] }
  | { kind: "para"; spans: NoteSpan[] }
  | { kind: "list"; ordered: boolean; items: NoteSpan[][] };

type Resolve = (name: string) => NoteTarget | undefined;

const HEADING_RE = /^(#{1,3})\s+/;
const ORDERED_RE = /^\s*\d{1,3}[.)]\s+/;
const BULLET_RE = /^\s*[-*•]\s+/;
const ESCAPABLE = "\\*_[]()#`";

/** The notes as stored: trimmed, capped, and undefined when there is nothing
 * to say, so an emptied box takes the key off the document. */
export function cleanNotes(text: unknown): string | undefined {
  if (typeof text !== "string") return undefined;
  const trimmed = text.replace(/\r\n?/g, "\n").trim();
  return trimmed === "" ? undefined : trimmed.slice(0, NOTES_MAX);
}

/** What an empty notes box shows, as an example of the three things worth
 * saying. */
export const NOTES_PLACEHOLDER = "What it shows.\n\n# Set up\n1. Point [Kitchen light] at your own light.\n2. …\n\nTap it to …";

/** A web address a link may open: http or https, nothing else. */
export function safeHref(href: string): string | undefined {
  const h = href.trim();
  return /^https?:\/\/[^\s<>"']+$/i.test(h) ? h : undefined;
}

// ── reading ───────────────────────────────────────────────────────────────

/**
 * One line (or a joined paragraph) as spans. A `[Name]` nothing answers to
 * stays as typed, brackets and all, so the author sees it did not match; so
 * does a mark with no partner, and a web link to anything but http or https.
 */
export function noteSpans(line: string, resolve: Resolve): NoteSpan[] {
  const out: NoteSpan[] = [];
  const push = (text: string) => {
    if (text === "") return;
    const last = out.at(-1);
    if (last?.kind === "text") last.text += text;
    else out.push({ kind: "text", text });
  };
  let i = 0;
  while (i < line.length) {
    const c = line[i]!;
    if (c === "\\" && i + 1 < line.length && ESCAPABLE.includes(line[i + 1]!)) {
      push(line[i + 1]!);
      i += 2;
      continue;
    }
    if (c === "*" && line[i + 1] === "*") {
      let close = line.indexOf("**", i + 2);
      // `***both***`: the bold closes on the last pair, the italic inside it.
      while (close > 0 && line[close + 2] === "*") close += 1;
      const inner = close < 0 ? "" : line.slice(i + 2, close);
      if (inner.trim() !== "" && inner === inner.trim()) {
        out.push({ kind: "strong", spans: noteSpans(inner, resolve) });
        i = close + 2;
        continue;
      }
    }
    if ((c === "*" || c === "_") && line[i + 1] !== c) {
      // `_` only at a word's edge, so snake_case names stay whole.
      const edge = c === "*" || i === 0 || !/[\p{L}\p{N}]/u.test(line[i - 1]!);
      let close = line.indexOf(c, i + 1);
      while (close > 0 && c === "*" && line[close + 1] === "*") close = line.indexOf(c, close + 2);
      const inner = close < 0 ? "" : line.slice(i + 1, close);
      const after = line[close + 1];
      const shut = c === "*" || after === undefined || !/[\p{L}\p{N}]/u.test(after);
      if (edge && shut && inner.trim() !== "" && inner === inner.trim()) {
        out.push({ kind: "em", spans: noteSpans(inner, resolve) });
        i = close + 1;
        continue;
      }
    }
    if (c === "[") {
      const close = line.indexOf("]", i + 1);
      const label = close < 0 ? "" : line.slice(i + 1, close);
      if (close > 0 && label.length <= 80 && !label.includes("[")) {
        if (line[close + 1] === "(") {
          const end = line.indexOf(")", close + 2);
          const href = end < 0 ? undefined : safeHref(line.slice(close + 2, end));
          if (href && label.trim() !== "") {
            out.push({ kind: "url", text: label.trim(), href });
            i = end + 1;
            continue;
          }
        } else {
          const target = label.trim() === "" ? undefined : resolve(label.trim());
          if (target) {
            out.push({ kind: "link", text: label.trim(), target });
            i = close + 1;
            continue;
          }
        }
      }
    }
    push(c);
    i += 1;
  }
  return out;
}

/** The words of some spans, marks and links dropped. */
export function spansText(spans: readonly NoteSpan[]): string {
  return spans.map((s) => s.kind === "strong" || s.kind === "em" ? spansText(s.spans) : s.text).join("");
}

export function parseNotes(text: string, resolve: Resolve): NoteBlock[] {
  const blocks: NoteBlock[] = [];
  let para: string[] = [];
  let list: { ordered: boolean; items: string[] } | undefined;
  const flushPara = () => {
    if (para.length === 0) return;
    blocks.push({ kind: "para", spans: noteSpans(para.join("\n"), resolve) });
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
    const heading = HEADING_RE.exec(line);
    if (heading) {
      flushPara();
      flushList();
      const level = heading[1]!.length as 1 | 2 | 3;
      blocks.push({ kind: "heading", level, spans: noteSpans(line.slice(heading[0].length).replace(/\s+#+$/, ""), resolve) });
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

/** The first line, as words, for the folded row. */
export function notesPreview(text: string): string {
  const first = text.split("\n").map((l) => l.trim()).find((l) => l !== "") ?? "";
  const bare = first.replace(HEADING_RE, "").replace(ORDERED_RE, "").replace(BULLET_RE, "");
  return spansText(noteSpans(bare, () => undefined)).replace(/\[([^\[\]\n]{1,80})\]/g, "$1");
}

/**
 * The opening of the notes as one plain paragraph, for the gallery's
 * description: the first block of prose, marks and links as their words, cut
 * at a word before `max`. Lists and headings are skipped, since a description
 * is a sentence about the design and not its setup steps.
 */
export function notesSummary(text: string, max: number): string {
  const para = parseNotes(text, () => undefined).find((b) => b.kind === "para");
  const flat = para?.kind === "para"
    ? spansText(para.spans).replace(/\[([^\[\]\n]{1,80})\]/g, "$1").replace(/\s*\n\s*/g, " ").trim()
    : notesPreview(text);
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > max / 2 ? cut.slice(0, space) : cut).trimEnd()}…`;
}

/** A link's tooltip: what a click on it does. */
export function noteTargetTitle(target: NoteTarget): string {
  return target.kind === "value" ? "Open this shared value"
    : target.kind === "group" ? "Select this group"
    : "Select this layer";
}

// ── the editor's toolbar ──────────────────────────────────────────────────
//
// Each button writes the Markdown a person would type, so the toolbar is a
// shortcut and never a format of its own.

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
  return line.replace(HEADING_RE, "").replace(ORDERED_RE, "").replace(BULLET_RE, "").trimStart();
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
 * `# ` on the caret's line, or off it again when it is already that heading.
 * A smaller heading (`##`, `###`) or a list marker gives way to it. The caret
 * goes to the line's end, ready to type the heading or carry on after it.
 */
export function toggleNoteHeading(text: string, start: number): NoteEdit {
  const [from, to] = lineSpan(text, start, start);
  const line = text.slice(from, to);
  const next = /^#\s+/.test(line.trimStart()) ? stripMarker(line) : `# ${stripMarker(line)}`;
  const out = text.slice(0, from) + next + text.slice(to);
  return { text: out, start: from + next.length, end: from + next.length };
}

/**
 * `**` or `*` around the selection, or off it again when the selection already
 * sits between them. With nothing selected the pair goes in with the caret
 * between, to type into.
 */
export function toggleNoteMark(text: string, start: number, end: number, mark: "**" | "*"): NoteEdit {
  const before = text.slice(0, start);
  const after = text.slice(end);
  const inside = text.slice(start, end);
  const wrapped = before.endsWith(mark) && after.startsWith(mark)
    // `*` must not be half of a `**` around the selection.
    && (mark === "**" || !(before.endsWith("**") && after.startsWith("**")) || before.endsWith("***"));
  if (wrapped) {
    const out = before.slice(0, -mark.length) + inside + after.slice(mark.length);
    return { text: out, start: start - mark.length, end: end - mark.length };
  }
  // Spaces the selection picked up stay outside the marks, where Markdown
  // wants them.
  const lead = inside.length - inside.trimStart().length;
  const tail = inside.length - inside.trimEnd().length;
  const core = inside.trim();
  const out = `${before}${inside.slice(0, lead)}${mark}${core}${mark}${inside.slice(inside.length - tail)}${after}`;
  const s = start + lead + mark.length;
  return { text: out, start: s, end: s + core.length };
}

/** A link in place of the selection, spaced off the words around it, with
 * the caret after it. */
function insertSpaced(text: string, start: number, end: number, link: string): NoteEdit {
  const before = text.slice(0, start);
  const after = text.slice(end);
  const lead = before === "" || /\s$/.test(before) ? "" : " ";
  const tail = after === "" || /^[\s.,;:!?)]/.test(after) ? "" : " ";
  const put = `${lead}${link}${tail}`;
  const caret = start + put.length;
  return { text: before + put + after, start: caret, end: caret };
}

/** A `[Name]` link to a shared value, group or layer. */
export function insertNoteLink(text: string, start: number, end: number, name: string): NoteEdit {
  return insertSpaced(text, start, end, `[${name}]`);
}

/** A `[words](https://…)` link to a web page. The selected words are the
 * link's words; with none, the address is. */
export function insertNoteUrl(text: string, start: number, end: number, href: string): NoteEdit {
  const words = text.slice(start, end).replace(/[[\]\n]/g, " ").trim() || href.replace(/^https?:\/\//i, "");
  return insertSpaced(text, start, end, `[${words}](${href})`);
}

/** What was typed in the web link box, as an address, or undefined when it
 * is not one. `example.com/x` gains its `https://`. */
export function noteUrlFromInput(input: string): string | undefined {
  const t = input.trim();
  if (t === "") return undefined;
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(t) ? t : /^[^\s/]+\.[^\s/]+/.test(t) ? `https://${t}` : t;
  return safeHref(withScheme);
}
