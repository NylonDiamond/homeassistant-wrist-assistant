import { EditorState } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import { describe, expect, it } from "vitest";
import { entityThenAttribute, templateAttributeCompletion } from "../src/watch-pages/template-code.js";
import { applyQuickAdd, QUICK_ADD_GROUPS, QUICK_ADDS, quickAddEdit } from "../src/watch-pages/template-quick-add.js";

/** The text after quick add `id`, with the selection marked: `|` for a
 * caret, `«…»` for a selected range. */
function after(id: string, text: string, caret?: { from: number; to: number }): { text: string; suggest: boolean } {
  const edit = quickAddEdit(id, text, caret)!;
  const next = applyQuickAdd(text, edit);
  const [a, h] = [Math.min(edit.anchor, edit.head), Math.max(edit.anchor, edit.head)];
  const marked = a === h ? `${next.slice(0, a)}|${next.slice(a)}` : `${next.slice(0, a)}«${next.slice(a, h)}»${next.slice(h)}`;
  return { text: marked, suggest: edit.suggest };
}

const at = (n: number) => ({ from: n, to: n });

describe("Quick add", () => {
  it("has Style, Taps and Logic, with short words and a tooltip for each", () => {
    expect(QUICK_ADD_GROUPS.map((g) => g.label)).toEqual(["Style", "Taps", "Logic"]);
    expect(QUICK_ADDS.filter((q) => q.group === "taps").map((q) => q.label)).toEqual(["Maps", "Toggle", "Script", "Scene", "Page", "Link", "Refresh"]);
    expect(QUICK_ADDS.filter((q) => q.group === "logic").map((q) => q.label)).toEqual(["If / else", "For each", "Count on", "Attribute"]);
    for (const q of QUICK_ADDS) {
      expect(q.title.length).toBeGreaterThan(10);
      // No dashes that break a sentence in words people read.
      expect(`${q.label} ${q.title}`).not.toMatch(/[–—]| - /);
    }
    expect(quickAddEdit("nope", "", undefined)).toBeUndefined();
  });

  it("puts a tap marker in at the caret and asks for its value", () => {
    expect(after("toggle", "Desk lamp", at(9))).toEqual({ text: "Desk lamp[tap:toggle |]", suggest: true });
    expect(after("maps", "A\nB", at(1))).toEqual({ text: "A[tap:maps |]\nB", suggest: true });
    for (const id of ["script", "scene", "page"]) expect(after(id, "", undefined)).toEqual({ text: `[tap:${id} |]`, suggest: true });
  });

  it("goes at the end when the caret was never put in the code", () => {
    expect(after("toggle", "Row one\nRow two", undefined).text).toBe("Row one\nRow two[tap:toggle |]");
  });

  it("moves a marker out of Jinja and other markers to the end of the line", () => {
    expect(after("toggle", "{{ states('light.desk') }} on\nNext", at(5)).text).toBe("{{ states('light.desk') }} on[tap:toggle |]\nNext");
    expect(after("refresh", "[icon:lock.fill] Door", at(8)).text).toBe("[icon:lock.fill] Door[tap:refresh]|");
  });

  it("Link waits for its address and Refresh needs none", () => {
    expect(after("link", "Docs", at(4))).toEqual({ text: "Docs[tap:link https://|]", suggest: false });
    expect(after("refresh", "Now", at(3))).toEqual({ text: "Now[tap:refresh]|", suggest: false });
  });

  it("Icon opens the symbol list, Color text wraps the chosen words", () => {
    expect(after("icon", "Door", at(0))).toEqual({ text: "[icon:|]Door", suggest: true });
    expect(after("color", "Door open", { from: 5, to: 9 }).text).toBe("Door [color:«red»]open[/color]");
    expect(after("color", "Door ", at(5)).text).toBe("Door [color:red]«Text»[/color]");
    // Words over two lines are not wrapped: a new line ends a color.
    expect(after("color", "A\nB", { from: 0, to: 3 }).text).toBe("A\nB[color:red]«Text»[/color]");
  });

  it("If / else asks for its entity in the code box", () => {
    expect(after("ifElse", "", undefined)).toEqual({ text: "{% if states('|') == 'on' %}On{% else %}Off{% endif %}", suggest: true });
  });

  it("For each stands on lines of its own, with the domain chosen to type over", () => {
    expect(after("forEach", "Lights:", at(7)).text).toBe("Lights:\n{% for e in states.«light» | selectattr('state', 'eq', 'on') %}\n{{ e.name }}\n{% endfor %}");
    expect(after("forEach", "A\nB", at(2)).text).toBe("A\n{% for e in states.«light» | selectattr('state', 'eq', 'on') %}\n{{ e.name }}\n{% endfor %}\nB");
  });

  it("Count on counts a domain's entities that are on", () => {
    expect(after("countOn", "💡 ", at(3)).text).toBe("💡 {{ states.«light» | selectattr('state', 'eq', 'on') | list | count }}");
  });

  it("Attribute asks for the entity, then its attribute", () => {
    expect(after("attribute", "Bright ", at(7))).toEqual({ text: "Bright {{ state_attr('|', '') }}", suggest: true });
  });
});

describe("Attribute suggestions in the code box", () => {
  const context = { attributes: (id: string) => (id === "light.desk" ? ["brightness", "color_mode"] : []).map((label) => ({ label, type: "attribute" })) };

  it("suggests the entity's attributes inside state_attr's second quotes", () => {
    const before = "{{ state_attr('light.desk', 'bri";
    const r = templateAttributeCompletion(before, before.length, context)!;
    expect(r.from).toBe(before.length - 3);
    expect(r.options.map((o) => o.label)).toEqual(["brightness", "color_mode"]);
    expect(templateAttributeCompletion("{{ state_attr('light.desk'", 26, context)).toBeNull();
    expect(templateAttributeCompletion("{{ state_attr('light.desk', '", 29, {})).toBeNull();
  });

  it("an entity picked in state_attr moves the caret into the attribute's quotes", () => {
    let state = EditorState.create({ doc: "{{ state_attr('li', '') }}" });
    const view = { get state() { return state; }, dispatch: (spec: object) => { state = state.update(spec).state; } } as unknown as EditorView;
    const option = entityThenAttribute({ label: "light.desk" });
    (option.apply as (v: EditorView, c: typeof option, from: number, to: number) => void)(view, option, 15, 17);
    expect(state.doc.toString()).toBe("{{ state_attr('light.desk', '') }}");
    expect(state.selection.main.head).toBe(29);
  });
});
