// A template tile's rich text (part 3f batch 2): the port of the app's
// `TemplateRichText`, on the cases of `TemplateRichTextTests.swift`, and the
// colors the preview draws for its names and hex codes.

import { describe, expect, it } from "vitest";

import { templateIconColor, templateRichTextSegments } from "../src/watch-pages/rich-text.js";

const text = (t: string) => ({ kind: "text", text: t });
const icon = (symbol: string, color?: string) => ({ kind: "icon", symbol, color });

describe("segments, as TemplateRichTextTests.swift", () => {
  it("keeps a plain icon in the text's color", () => {
    expect(templateRichTextSegments("[icon:power] Off")).toEqual([icon("power"), text(" Off")]);
  });

  it("reads an icon's color", () => {
    expect(templateRichTextSegments("[icon:snowflake color:blue] Woonkamer 21°")).toEqual([icon("snowflake", "blue"), text(" Woonkamer 21°")]);
  });

  it("reads the color option in any case and with extra spaces", () => {
    expect(templateRichTextSegments("[icon:flame.fill   Color:#FF8800 ]")).toEqual([icon("flame.fill", "#FF8800")]);
  });

  it("gives an empty color none", () => {
    expect(templateRichTextSegments("[icon:drop.fill color:]")).toEqual([icon("drop.fill")]);
  });

  it("keeps a blank marker as text", () => {
    expect(templateRichTextSegments("a[icon: ]b")).toEqual([text("a"), text("[icon: ]"), text("b")]);
  });

  it("reads several lines", () => {
    expect(templateRichTextSegments("[icon:snowflake color:blue] A\n[icon:power color:gray] B")).toEqual([
      icon("snowflake", "blue"),
      text(" A\n"),
      icon("power", "gray"),
      text(" B"),
    ]);
  });
});

describe("segments, beyond the Swift cases", () => {
  it("takes the first color option, keeps its case, and ignores other words", () => {
    expect(templateRichTextSegments("[icon:bolt size:2 COLOR:Red color:blue]")).toEqual([icon("bolt", "Red")]);
  });

  it("leaves text with no marker whole, and gives an empty text nothing", () => {
    expect(templateRichTextSegments("21 °C")).toEqual([text("21 °C")]);
    expect(templateRichTextSegments("")).toEqual([]);
  });

  it("reads markers side by side, and leaves an unclosed one as text", () => {
    expect(templateRichTextSegments("[icon:a][icon:b] [icon:c")).toEqual([icon("a"), icon("b"), text(" [icon:c")]);
  });

  it("reads the same text the same way twice (the walk starts over)", () => {
    const once = templateRichTextSegments("x [icon:a] y");
    expect(templateRichTextSegments("x [icon:a] y")).toEqual(once);
  });
});

describe("icon colors", () => {
  it("resolve the Swift test's known colors", () => {
    for (const spec of ["blue", "Orange", "grey", "#F80", "FF8800", "#FF880080"]) expect(templateIconColor(spec), spec).toBeDefined();
  });

  it("are none for the Swift test's unknown ones", () => {
    for (const spec of ["blu", "#GG0000", "#12345", ""]) expect(templateIconColor(spec), spec).toBeUndefined();
  });

  it("match their components, as the Swift test checks", () => {
    expect(templateIconColor("#FF8800")).toEqual({ hex: "#FF8800", alpha: 1 });
    expect(templateIconColor("F80")).toEqual({ hex: "#FF8800", alpha: 1 });
  });

  it("read eight digits as RRGGBBAA", () => {
    expect(templateIconColor("#FF880080")).toEqual({ hex: "#FF8800", alpha: 0.502 });
    expect(templateIconColor("ffffffff")).toEqual({ hex: "#FFFFFF", alpha: 1 });
  });

  it("know all sixteen names in any case, gray and grey alike", () => {
    const names = ["red", "orange", "yellow", "green", "mint", "teal", "cyan", "blue", "indigo", "purple", "pink", "brown", "gray", "grey", "white", "black"];
    for (const name of names) expect(templateIconColor(name.toUpperCase())?.hex, name).toMatch(/^#[0-9A-F]{6}$/);
    expect(templateIconColor("gray")).toEqual(templateIconColor("grey"));
    // The panel's own named colors.
    expect(templateIconColor("blue")?.hex).toBe("#007AFF");
    expect(templateIconColor("yellow")?.hex).toBe("#FFCC00");
  });

  it("take a leading plus as Swift's integer reader does, and nothing else", () => {
    expect(templateIconColor("+F8")).toEqual({ hex: "#00FF88", alpha: 1 });
    for (const spec of ["##F80", "0xF80", " F80", "F80 ", "-F8"]) expect(templateIconColor(spec), spec).toBeUndefined();
  });
});
