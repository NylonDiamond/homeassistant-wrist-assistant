// Quick add: the buttons under a template tile's code that put a piece in at
// the caret. Style (an icon, colored words), Taps (a row's `[tap:` marker)
// and Logic (if, a loop, a count, an attribute). The Values row beside them is
// the shared recipes (`template-help.ts`). This file only works out the edit;
// `template-editor.ts` makes it in the code box as one undo step and opens the
// code box's own suggestions where the edit asks for them.

import { insideBlock } from "../template-help.js";

export type QuickAddGroup = "style" | "taps" | "logic";

export interface QuickAdd {
  id: string;
  group: QuickAddGroup;
  label: string;
  /** The button's tooltip: one line on what it puts in. */
  title: string;
}

export const QUICK_ADD_GROUPS: readonly { group: QuickAddGroup; label: string }[] = [
  { group: "style", label: "Style" },
  { group: "taps", label: "Taps" },
  { group: "logic", label: "Logic" },
];

export const QUICK_ADDS: readonly QuickAdd[] = [
  { id: "icon", group: "style", label: "Icon", title: "Adds an icon. Pick one from the list." },
  { id: "color", group: "style", label: "Color text", title: "Colors the selected words, or adds colored words." },
  { id: "maps", group: "taps", label: "Maps", title: "A tap on the row opens a place in Maps. Pick an entity with a location." },
  { id: "toggle", group: "taps", label: "Toggle", title: "A tap on the row turns an entity on or off." },
  { id: "script", group: "taps", label: "Script", title: "A tap on the row runs a script." },
  { id: "scene", group: "taps", label: "Scene", title: "A tap on the row turns a scene on." },
  { id: "page", group: "taps", label: "Page", title: "A tap on the row goes to one of your pages." },
  { id: "link", group: "taps", label: "Link", title: "A tap on the row opens a web page, on iPhone only." },
  { id: "refresh", group: "taps", label: "Refresh", title: "A tap on the row refreshes the tile." },
  { id: "ifElse", group: "logic", label: "If / else", title: "Shows one thing while an entity is on, another while it is off." },
  { id: "forEach", group: "logic", label: "For each", title: "One row for each light that is on. Change light to another domain." },
  { id: "countOn", group: "logic", label: "Count on", title: "How many lights are on. Change light to another domain." },
  { id: "attribute", group: "logic", label: "Attribute", title: "One attribute of an entity, like its brightness." },
];

/** The edit a quick add makes: replace `from`..`to` with `insert`, then
 * select `anchor`..`head`, and open the code box's suggestions there when
 * `suggest` is set. */
export interface QuickAddEdit {
  from: number;
  to: number;
  insert: string;
  anchor: number;
  head: number;
  suggest: boolean;
}

/** Where the caret is. Undefined when the author has not put it in the code
 * yet: the piece then goes at the end. */
export interface QuickAddCaret {
  from: number;
  to: number;
}

/** Whether `at` sits inside a `[icon:` or `[tap:`-like marker on its line. */
function insideMarker(text: string, at: number): boolean {
  const line = text.slice(text.lastIndexOf("\n", at - 1) + 1, at);
  return line.lastIndexOf("[") > line.lastIndexOf("]");
}

/** The end of the line `at` is on. */
function lineEnd(text: string, at: number): number {
  const end = text.indexOf("\n", at);
  return end === -1 ? text.length : end;
}

/** Where a piece that must stand outside Jinja and other markers goes: the
 * caret, or the end of its line when the caret is inside one. */
function outsidePlace(text: string, at: number): number {
  return insideBlock(text, at) || insideMarker(text, at) ? lineEnd(text, at) : at;
}

/** A piece put in at `at`, with the selection given relative to its start. */
function placed(at: number, insert: string, anchor: number, head = anchor, suggest = false): QuickAddEdit {
  return { from: at, to: at, insert, anchor: at + anchor, head: at + head, suggest };
}

/**
 * The edit quick add `id` makes in `text`. Every piece goes in at the caret
 * (at the end when there is none), moved to the end of the line when the
 * caret is inside a `{{ }}`, a `{% %}` or another marker; For each starts and
 * ends a line of its own. Undefined for an id that is not a quick add.
 */
export function quickAddEdit(id: string, text: string, caret: QuickAddCaret | undefined): QuickAddEdit | undefined {
  const sel = caret === undefined
    ? { from: text.length, to: text.length }
    : { from: Math.max(0, Math.min(caret.from, text.length)), to: Math.max(0, Math.min(caret.to, text.length)) };
  const at = outsidePlace(text, sel.to);
  const tap = (action: string): QuickAddEdit => {
    const insert = `[tap:${action} ]`;
    return placed(at, insert, insert.length - 1, insert.length - 1, true);
  };
  switch (id) {
    case "icon":
      return placed(at, "[icon:]", 6, 6, true);
    case "color": {
      const words = sel.from < sel.to && !insideBlock(text, sel.from) && !insideBlock(text, sel.to) ? text.slice(sel.from, sel.to) : "";
      if (words !== "" && !words.includes("\n")) {
        // The words chosen: wrap them, and select the color to change it.
        return { from: sel.from, to: sel.to, insert: `[color:red]${words}[/color]`, anchor: sel.from + 7, head: sel.from + 10, suggest: false };
      }
      // No words chosen: put some in, selected, to type over.
      return placed(at, "[color:red]Text[/color]", 11, 15);
    }
    case "maps": case "toggle": case "script": case "scene": case "page":
      return tap(id);
    case "link": {
      const insert = "[tap:link https://]";
      return placed(at, insert, insert.length - 1);
    }
    case "refresh":
      return placed(at, "[tap:refresh]", 13);
    case "ifElse": {
      const insert = "{% if states('') == 'on' %}On{% else %}Off{% endif %}";
      return placed(at, insert, 14, 14, true);
    }
    case "forEach": {
      const before = at > 0 && text[at - 1] !== "\n" ? "\n" : "";
      const after = at < text.length && text[at] !== "\n" ? "\n" : "";
      const body = "{% for e in states.light | selectattr('state', 'eq', 'on') %}\n{{ e.name }}\n{% endfor %}";
      const light = before.length + "{% for e in states.".length;
      return placed(at, `${before}${body}${after}`, light, light + "light".length);
    }
    case "countOn": {
      const insert = "{{ states.light | selectattr('state', 'eq', 'on') | list | count }}";
      const light = "{{ states.".length;
      return placed(at, insert, light, light + "light".length);
    }
    case "attribute": {
      const insert = "{{ state_attr('', '') }}";
      return placed(at, insert, 15, 15, true);
    }
    default:
      return undefined;
  }
}

/** The text after a quick add's edit. */
export function applyQuickAdd(text: string, edit: QuickAddEdit): string {
  return text.slice(0, edit.from) + edit.insert + text.slice(edit.to);
}
