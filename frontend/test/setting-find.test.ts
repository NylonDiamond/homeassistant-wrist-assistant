// Find a setting (`setting-find.ts`): the index read from the inspector as
// drawn, and the matching that orders what the field lists.
//
// No DOM: the reader is handed small element stand-ins with the few
// properties it reads.

import { describe, expect, it } from "vitest";

import {
  type SettingFindElement,
  type SettingFindSection,
  findSettings,
  readSettingFindSections,
  settingFindIndex,
  settingFindRows,
  settingFindWhere,
} from "../src/watch-pages/setting-find.js";

// ── element stand-ins ────────────────────────────────────────────────────

type Child = SettingFindElement | string;

function el(tag: string, attrs: Record<string, string>, ...kids: Child[]): SettingFindElement {
  const classes = (attrs.class ?? "").split(" ").filter((c) => c !== "");
  const children = kids.filter((k): k is SettingFindElement => typeof k !== "string");
  const childNodes = kids.map((k) => (typeof k === "string" ? { nodeType: 3, textContent: k } : { nodeType: 1, textContent: k.textContent }));
  return {
    tagName: tag.toUpperCase(),
    get textContent() { return kids.map((k) => (typeof k === "string" ? k : k.textContent ?? "")).join(""); },
    children,
    childNodes,
    classList: { contains: (name: string) => classes.includes(name) },
    getAttribute: (name: string) => (Object.hasOwn(attrs, name) ? attrs[name]! : null),
  };
}

const field = (label: string, ...rest: Child[]) => el("label", { class: "field" }, el("span", {}, label, el("button", { title: "Back to Off" }, "•")), ...rest);
const sec = (part: string, title: string, ...rows: Child[]) =>
  el("section", { class: "ts-sec", "data-part": part }, el("div", { class: "ts-sec-h" }, el("h4", {}, title)), el("div", { class: "sec-b" }, el("fieldset", { class: "ts-body" }, ...rows)));
const grp = (title: string, ...secs: SettingFindElement[]) =>
  el("section", { class: "ts-grp" }, el("div", { class: "ts-grp-h" }, el("h3", { class: "ts-grp-t" }, title), el("span", { class: "ts-grp-d" }, "words")), ...secs);

// ── the index ────────────────────────────────────────────────────────────

describe("the index read from the drawn inspector", () => {
  const drawn = el("div", { class: "ts-root ts-groups" },
    grp("Look",
      sec("glow", "Glow",
        field("Glow"),
        field("Glow color"),
        field("Glow size"),
        // A row of pictures names itself on its group.
        el("div", { class: "field pc-field" }, el("div", { class: "pc-group", "aria-label": "Glow brightness" })),
        // The line that stands where rows that do nothing were.
        el("div", { class: "hint keep ts-gone" }, "No icon, so there is nothing to glow.")),
      sec("icon", "Icon", field("Icon", field("Inner"))),
    ),
    el("div", { class: "ts-g2" }, grp("Tap", sec("visibility", "Show tile", field("Show tile")))),
  );

  it("reads each group's sections, their headings and their rows' labels, outer rows only", () => {
    expect(readSettingFindSections(drawn)).toEqual([
      { group: "Look", section: "Glow", part: "glow", rows: [{ label: "Glow" }, { label: "Glow color" }, { label: "Glow size" }, { label: "Glow brightness" }] },
      { group: "Look", section: "Icon", part: "icon", rows: [{ label: "Icon" }] },
      { group: "Tap", section: "Show tile", part: "visibility", rows: [{ label: "Show tile" }] },
    ]);
  });

  it("finds a row again by its place among the section's rows", () => {
    const glow = (drawn.children[0]!.children[1]!);
    const rows = settingFindRows(glow);
    expect(rows).toHaveLength(4);
    expect(rows[1]!.textContent).toContain("Glow color");
  });

  it("offers each section and each row once, never a row named as its section", () => {
    const index = settingFindIndex(readSettingFindSections(drawn));
    expect(index.map((e) => [e.label, settingFindWhere(e), e.part, e.row])).toEqual([
      ["Glow", "Look", "glow", -1],
      ["Glow color", "Look · Glow", "glow", 1],
      ["Glow size", "Look · Glow", "glow", 2],
      ["Glow brightness", "Look · Glow", "glow", 3],
      ["Icon", "Look", "icon", -1],
      ["Show tile", "Tap", "visibility", -1],
    ]);
  });

  it("leaves out a section with no heading, a row with no label and a second row of one name", () => {
    const sections: SettingFindSection[] = [
      { group: "Look", section: "", part: "removed", rows: [{ label: "Kind" }] },
      { group: "Text", section: "Name", part: "text", rows: [{ label: "" }, { label: "Size" }, { label: "size" }, { label: "Weight" }] },
    ];
    expect(settingFindIndex(sections).map((e) => `${e.label}@${e.row}`)).toEqual(["Name@-1", "Size@1", "Weight@3"]);
  });
});

// ── the matching ─────────────────────────────────────────────────────────

describe("the matching", () => {
  const index = settingFindIndex([
    { group: "Look", section: "Color", part: "color", rows: [{ label: "Fill" }, { label: "Color" }] },
    { group: "Look", section: "Glow", part: "glow", rows: [{ label: "Glow" }, { label: "Color" }, { label: "Size" }] },
    { group: "Look", section: "Background", part: "background", rows: [{ label: "Pattern" }, { label: "Background color" }] },
    { group: "Text", section: "Name", part: "text", rows: [{ label: "Show label" }, { label: "Size" }] },
    { group: "Tap", section: "Show tile", part: "visibility", rows: [{ label: "Show tile" }] },
    { group: "Layout", section: "Size", part: "size", rows: [{ label: "Preset" }] },
  ]);
  const found = (q: string, limit?: number) => findSettings(index, q, limit).map((e) => `${e.label} · ${settingFindWhere(e)}`);

  it("lists nothing for nothing typed", () => {
    expect(findSettings(index, "")).toEqual([]);
    expect(findSettings(index, "   ")).toEqual([]);
  });

  it("puts the label said in full first, then labels that start with it, then the rest in reading order", () => {
    expect(found("glow")).toEqual(["Glow · Look", "Color · Look · Glow", "Size · Look · Glow"]);
    expect(found("size")).toEqual(["Size · Look · Glow", "Size · Text · Name", "Size · Layout", "Preset · Layout · Size"]);
    expect(found("color")).toEqual(["Color · Look", "Color · Look · Glow", "Background color · Look · Background", "Fill · Look · Color"]);
  });

  it("takes several words, each the start of a word of the label, its section or its group, in any case", () => {
    expect(found("GLOW col")).toEqual(["Color · Look · Glow"]);
    expect(found("show")).toEqual(["Show label · Text · Name", "Show tile · Tap"]);
    expect(found("back col")).toEqual(["Background color · Look · Background"]);
    expect(found("tap")).toEqual(["Show tile · Tap"]);
  });

  it("finds words inside a label too, and nothing that does not match", () => {
    expect(found("ground")).toEqual(["Background · Look", "Background color · Look · Background"]);
    expect(found("zebra")).toEqual([]);
  });

  it("stops at the limit", () => {
    expect(found("s", 2)).toHaveLength(2);
  });
});
