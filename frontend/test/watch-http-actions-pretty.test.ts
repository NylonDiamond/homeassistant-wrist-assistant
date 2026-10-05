import { describe, expect, it } from "vitest";
import { colorBody, formatJsonBody, piecesText, prettyJson, sizeText } from "../src/watch-http-actions/pretty.js";

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

  it("gives each plain value the path to it, a key with an escape read as text", () => {
    const paths = prettyJson(`{"a":{"b\\u0041":[10,{"c":"x"},[true]],"e":{}},"z":null}`)!.filter((p) => p.path !== undefined).map((p) => `${p.path}=${p.text}`);
    expect(paths).toEqual(["a.bA.0=10", `a.bA.1.c="x"`, "a.bA.2.0=true", "z=null"]);
    expect(prettyJson(`"on"`)![0]!.path).toBeUndefined();
    expect(prettyJson(`[1,2]`)!.filter((p) => p.path !== undefined).map((p) => p.path)).toEqual(["0", "1"]);
  });

  it("formats a bare value and refuses what is not JSON", () => {
    expect(piecesText(prettyJson(` "on" `)!)).toBe(`"on"`);
    expect(prettyJson("<html></html>")).toBeUndefined();
    expect(prettyJson(`{"a":1`)).toBeUndefined();
    expect(prettyJson("")).toBeUndefined();
  });

  it("indents a body to send, a {{key}} kept where a value goes", () => {
    expect(formatJsonBody(`{"n":{{count}},"t":"{{msg}} now","l":[1,2]}`)).toBe(`{\n  "n": {{count}},\n  "t": "{{msg}} now",\n  "l": [\n    1,\n    2\n  ]\n}`);
    expect(formatJsonBody(`{"a":1`)).toBeUndefined();
    expect(formatJsonBody(`a=1&b=2`)).toBeUndefined();
    expect(formatJsonBody(`{"a": oops}`)).toBeUndefined();
    expect(formatJsonBody("  ")).toBeUndefined();
  });

  it("colors a body as typed and loses no character of it", () => {
    const typed = `{ "a" : "x", "n": {{n}},\n  "open": "not closed yet\n  "t": true, 4.5 junk }`;
    const pieces = colorBody(typed, true);
    expect(piecesText(pieces)).toBe(typed);
    const kinds = pieces.filter((p) => p.kind !== "ws" && p.kind !== "punct").map((p) => `${p.kind}:${p.text}`);
    expect(kinds).toEqual([`key:"a"`, `str:"x"`, `key:"n"`, "var:{{n}}", `key:"open"`, `str:"not closed yet`, `key:"t"`, "lit:true", "num:4.5"]);
    const form = colorBody("a={{a}}&b=2", false);
    expect(piecesText(form)).toBe("a={{a}}&b=2");
    expect(form.filter((p) => p.kind === "var").map((p) => p.text)).toEqual(["{{a}}"]);
  });

  it("says a size in words", () => {
    expect([sizeText(1), sizeText(812), sizeText(1638), sizeText(262144 * 4)]).toEqual(["1 byte", "812 bytes", "1.6 KB", "1.00 MB"]);
  });
});
