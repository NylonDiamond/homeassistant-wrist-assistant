// Find a setting: the tile inspector head's field that lists the settings
// matching what is typed, each as its label with its group and section in
// grey ("Glow color · Look · Glow"), and goes to the one picked.
//
// The index is read from what the inspector drew (`readSettingFindSections`):
// each group panel (`.ts-grp`, its title in `.ts-grp-t`), each section in it
// (`.ts-sec[data-part]`, its heading the `h4`) and each row of that section
// (a `.field`, its label the row's first span). So it can never drift from
// the real settings: a row hidden because it does nothing for this tile
// (the line that says why stands in its place) is not drawn, so it is not
// offered either. The matching (`findSettings`) is plain text work, with no
// DOM, and the page editor does the going there.

/** A row of a section, as the index reads it. */
export interface SettingFindRow {
  label: string;
}

/** One section of the inspector as drawn: its group's and its own title, the
 * part it draws (`data-part`) and its rows in order. */
export interface SettingFindSection {
  group: string;
  section: string;
  part: string;
  rows: readonly SettingFindRow[];
}

/** One thing the field offers: a section (`row` -1) or one of its rows (its
 * place among the section's rows, as `settingFindRows` reads them). */
export interface SettingFindEntry {
  label: string;
  group: string;
  section: string;
  part: string;
  row: number;
}

/** Folded for matching: lower case, one space between words, and the marks
 * a label may carry (a trailing ellipsis, a colon) gone. */
function fold(text: string): string {
  return text.toLowerCase().replace(/[…:·•()]/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Every section and every row of `sections` as the field offers them, in
 * the inspector's reading order. A row with no label, a row named as its
 * section is (the section stands for it) and a second row of the same name
 * in one section are left out.
 */
export function settingFindIndex(sections: readonly SettingFindSection[]): SettingFindEntry[] {
  const out: SettingFindEntry[] = [];
  for (const s of sections) {
    const section = s.section.trim();
    if (section === "") continue;
    out.push({ label: section, group: s.group, section, part: s.part, row: -1 });
    const seen = new Set<string>([fold(section)]);
    s.rows.forEach((r, row) => {
      const label = r.label.trim();
      const key = fold(label);
      if (key === "" || seen.has(key)) return;
      seen.add(key);
      out.push({ label, group: s.group, section, part: s.part, row });
    });
  }
  return out;
}

/** Where an entry sits, the grey words after its label: the group for a
 * section, the group and the section for a row. */
export function settingFindWhere(entry: SettingFindEntry): string {
  return entry.row < 0 ? entry.group : `${entry.group} · ${entry.section}`;
}

/** How well `entry` answers `query` (already folded and split into words):
 * lower is better, undefined for no match. The label said in full first,
 * then a label that starts with it, then one whose words each start with a
 * word typed, then a label that holds the words anywhere, then the words
 * found across the label, the section and the group ("glow color" finds
 * Color in the Glow section). */
function rank(entry: SettingFindEntry, query: string, words: readonly string[]): number | undefined {
  const label = fold(entry.label);
  if (label === query) return 0;
  if (label.startsWith(query)) return 1;
  const labelWords = label.split(" ");
  const starts = (pool: readonly string[]) => words.every((w) => pool.some((p) => p.startsWith(w)));
  if (starts(labelWords)) return 2;
  if (words.every((w) => label.includes(w))) return 3;
  const pool = [...labelWords, ...fold(entry.section).split(" "), ...fold(entry.group).split(" ")];
  if (starts(pool)) return 4;
  return undefined;
}

/**
 * The entries of `index` that match `query`, best first, at most `limit`.
 * Every word typed must start a word of the entry (its label, or its
 * section and group) or sit inside its label. A tie keeps the inspector's
 * reading order, so a section comes before its rows. Nothing for an empty
 * query.
 */
export function findSettings(index: readonly SettingFindEntry[], query: string, limit = 8): SettingFindEntry[] {
  const q = fold(query);
  if (q === "") return [];
  const words = q.split(" ");
  return index
    .map((entry, at) => ({ entry, at, score: rank(entry, q, words) }))
    .filter((m): m is { entry: SettingFindEntry; at: number; score: number } => m.score !== undefined)
    .sort((a, b) => a.score - b.score || a.at - b.at)
    .slice(0, Math.max(0, limit))
    .map((m) => m.entry);
}

// ── reading the drawn inspector ──────────────────────────────────────────

/** What the reader needs of an element: a DOM element has all of it. */
export interface SettingFindElement {
  readonly tagName: string;
  readonly textContent: string | null;
  readonly children: ArrayLike<SettingFindElement>;
  readonly childNodes: ArrayLike<{ readonly nodeType: number; readonly textContent: string | null }>;
  readonly classList: { contains(name: string): boolean };
  getAttribute(name: string): string | null;
}

const TEXT_NODE = 3;

/** The elements under `root` (not `root` itself) for which `take` says yes,
 * in document order; a taken element's own children are not searched. */
function collect(root: SettingFindElement, take: (el: SettingFindElement) => boolean): SettingFindElement[] {
  const out: SettingFindElement[] = [];
  const walk = (el: SettingFindElement): void => {
    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i]!;
      if (take(child)) out.push(child);
      else walk(child);
    }
  };
  walk(root);
  return out;
}

/** The first element under `root` for which `take` says yes. */
function first(root: SettingFindElement, take: (el: SettingFindElement) => boolean): SettingFindElement | undefined {
  for (let i = 0; i < root.children.length; i++) {
    const child = root.children[i]!;
    if (take(child)) return child;
    const found = first(child, take);
    if (found !== undefined) return found;
  }
  return undefined;
}

/** An element's own text, without its children's (a label's reset dot or
 * button). */
function ownText(el: SettingFindElement): string {
  let text = "";
  for (let i = 0; i < el.childNodes.length; i++) {
    const node = el.childNodes[i]!;
    if (node.nodeType === TEXT_NODE) text += node.textContent ?? "";
  }
  return text.replace(/\s+/g, " ").trim();
}

/** The rows of a drawn section: each `.field` in it, outermost only (a
 * field inside another is part of that row). The page editor reads them the
 * same way to find the row an entry names. */
export function settingFindRows(section: SettingFindElement): SettingFindElement[] {
  return collect(section, (el) => el.classList.contains("field"));
}

/** A row's label: its first span's own text, else its `aria-label`, else
 * the first `aria-label` inside it (a row of pictures names its group). */
function rowLabel(row: SettingFindElement): string {
  const lead = row.children[0];
  const text = lead !== undefined && lead.tagName.toLowerCase() === "span" ? ownText(lead) : "";
  if (text !== "") return text;
  const own = row.getAttribute("aria-label")?.trim() ?? "";
  if (own !== "") return own;
  return first(row, (el) => (el.getAttribute("aria-label")?.trim() ?? "") !== "")?.getAttribute("aria-label")?.trim() ?? "";
}

/** The sections the tile inspector drew under `root` (its `.ts-groups`),
 * group by group, each with its rows' labels. */
export function readSettingFindSections(root: SettingFindElement): SettingFindSection[] {
  const out: SettingFindSection[] = [];
  for (const grp of collect(root, (el) => el.classList.contains("ts-grp"))) {
    const group = (first(grp, (el) => el.classList.contains("ts-grp-t"))?.textContent ?? "").trim();
    for (const sec of collect(grp, (el) => el.classList.contains("ts-sec") && el.getAttribute("data-part") !== null)) {
      const head = first(sec, (el) => el.classList.contains("ts-sec-h"));
      const h4 = head === undefined ? undefined : first(head, (el) => el.tagName.toLowerCase() === "h4");
      out.push({
        group,
        section: (h4?.textContent ?? "").trim(),
        part: sec.getAttribute("data-part") ?? "",
        rows: settingFindRows(sec).map((row) => ({ label: rowLabel(row) })),
      });
    }
  }
  return out;
}
