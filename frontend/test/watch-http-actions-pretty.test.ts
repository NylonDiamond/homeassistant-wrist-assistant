import { describe, expect, it } from "vitest";
import { piecesText, prettyJson, sizeText } from "../src/watch-http-actions/pretty.js";

describe("the formatted body", () => {
  it("indents JSON and keeps every value as the server wrote it", () => {
    const pieces = prettyJson(`{"a":12345678901234567890,"b":["x\\u00e9",true,null,{}],"c":[],"d":{"e":-1.50e3}}`)!;
    expect(piecesText(pieces)).toBe(
      `{\n  "a": 12345678901234567890,\n  "b": [\n    "x\\u00e9",\n    true,\n    null,\n    {}\n  ],\n  "c": [],\n  "d": {\n    "e": -1.50e3\n  }\n}`,
    );
  });

  it("tells a key from a text value, a number and a literal", () => {
    const kinds = (text: string) => prettyJson(text)!.filter((p) => p.kind !== "ws" && p.kind !== "punct").map((p) => `${p.kind}:${p.text}`);
    expect(kinds(`{"k":"v","n":1,"t":false,"s":"a:b, {c}"}`)).toEqual([`key:"k"`, `str:"v"`, `key:"n"`, "num:1", `key:"t"`, "lit:false", `key:"s"`, `str:"a:b, {c}"`]);
  });

  it("formats a bare value and refuses what is not JSON", () => {
    expect(piecesText(prettyJson(` "on" `)!)).toBe(`"on"`);
    expect(prettyJson("<html></html>")).toBeUndefined();
    expect(prettyJson(`{"a":1`)).toBeUndefined();
    expect(prettyJson("")).toBeUndefined();
  });

  it("says a size in words", () => {
    expect([sizeText(1), sizeText(812), sizeText(1638), sizeText(262144 * 4)]).toEqual(["1 byte", "812 bytes", "1.6 KB", "1.00 MB"]);
  });
});
