// Share links: the shared text packed into a URL hash and read back out. The
// panel only ever builds and reads the hash through these, so a link made in
// one browser opens in another.

import { describe, expect, it } from "vitest";
import { newConfig, newElement } from "../src/model.js";
import {
  base64UrlToBytes,
  bytesToBase64Url,
  decodeShareLink,
  encodeShareLink,
  exportText,
  importFacts,
  shareLinkInText,
  shareLinkPayload,
  shareLinkUrl,
  SHARE_LINK_SITE,
  type UnresolvedEntity,
} from "../src/transfer.js";

function sampleText(): string {
  const cfg = newConfig("Energy today", 0, ["rectangular", "circular"]);
  for (let i = 0; i < 4; i += 1) cfg.elements.push(newElement("text"));
  return exportText(cfg, "backup");
}

describe("base64url", () => {
  it("round trips every byte value", () => {
    const bytes = new Uint8Array(256).map((_, i) => i);
    expect(base64UrlToBytes(bytesToBase64Url(bytes))).toEqual(bytes);
  });

  it("uses only characters a URL keeps as they are", () => {
    const text = bytesToBase64Url(new Uint8Array([251, 255, 254, 62, 63]));
    expect(text).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("refuses characters outside the alphabet and impossible lengths", () => {
    expect(base64UrlToBytes("ab+c")).toBeUndefined();
    expect(base64UrlToBytes("abcde")).toBeUndefined();
  });
});

describe("encodeShareLink and decodeShareLink", () => {
  it("round trips a document through gzip", async () => {
    const text = sampleText();
    const payload = await encodeShareLink(text);
    expect(payload.startsWith("z")).toBe(true);
    expect(await decodeShareLink(payload)).toBe(text);
  });

  it("makes gzip shorter than the plain form for a real document", async () => {
    const text = sampleText();
    const zipped = await encodeShareLink(text);
    const plain = await encodeShareLink(text, { compress: false });
    expect(zipped.length).toBeLessThan(plain.length);
  });

  it("round trips the plain form, non-ASCII names included", async () => {
    const text = '{"name": "Küche · 温度"}\n';
    const payload = await encodeShareLink(text, { compress: false });
    expect(payload.startsWith("t")).toBe(true);
    expect(await decodeShareLink(payload)).toBe(text);
  });

  it("gives nothing back for a link cut short", async () => {
    const payload = await encodeShareLink(sampleText());
    expect(await decodeShareLink(payload.slice(0, payload.length / 2))).toBeUndefined();
  });

  it("gives nothing back for an unknown packing or garbage", async () => {
    expect(await decodeShareLink("qabcd")).toBeUndefined();
    expect(await decodeShareLink("t!!!")).toBeUndefined();
    expect(await decodeShareLink("")).toBeUndefined();
  });
});

describe("shareLinkUrl and shareLinkPayload", () => {
  it("puts the payload in the hash of the panel address", () => {
    expect(shareLinkUrl("http://ha.local:8123/wrist-assistant", "zabc")).toBe("http://ha.local:8123/wrist-assistant#import=zabc");
  });

  it("points copied links at the site page, which every home can open", async () => {
    const payload = await encodeShareLink(sampleText());
    const url = shareLinkUrl(SHARE_LINK_SITE, payload);
    expect(url.startsWith("https://wrist-assistant.com/import/#import=z")).toBe(true);
    // A link pasted into Import still opens, whatever address it points at.
    expect(shareLinkInText(url)).toBe(payload);
  });

  it("replaces a hash the address already had", () => {
    expect(shareLinkUrl("http://ha.local/wa#old", "tabc")).toBe("http://ha.local/wa#import=tabc");
  });

  it("reads the payload back, with or without the leading #", () => {
    expect(shareLinkPayload("#import=zabc")).toBe("zabc");
    expect(shareLinkPayload("import=zabc")).toBe("zabc");
  });

  it("ignores any other hash", () => {
    expect(shareLinkPayload("")).toBeUndefined();
    expect(shareLinkPayload("#other=zabc")).toBeUndefined();
    expect(shareLinkPayload("#import=")).toBeUndefined();
  });
});

describe("shareLinkInText", () => {
  it("finds the payload in a pasted link from any address", () => {
    expect(shareLinkInText("  https://someone-else.example/wrist-assistant#import=zabc\n")).toBe("zabc");
  });

  it("leaves documents and ordinary text alone", () => {
    expect(shareLinkInText('{"name": "#import=zabc"}')).toBeUndefined();
    expect(shareLinkInText("see #import=zabc here")).toBeUndefined();
    expect(shareLinkInText("https://example.com/page")).toBeUndefined();
  });
});

describe("importFacts", () => {
  const row = (entityId: string, required: boolean): UnresolvedEntity =>
    ({ entityId, domain: "light", label: entityId, where: [], required });

  it("counts layers, shapes, slots to pick and ids that are only missing", () => {
    const cfg = newConfig("Two", 0, ["circular", "rectangular"]);
    cfg.elements.push(newElement("text"), newElement("icon"));
    const facts = importFacts(cfg, [row("light.shared_1", true), row("light.shared_2", true), row("light.porch", false)]);
    expect(facts).toEqual({ layers: 2, families: ["Rectangular", "Circular"], slots: 2, missing: 1 });
  });
});
