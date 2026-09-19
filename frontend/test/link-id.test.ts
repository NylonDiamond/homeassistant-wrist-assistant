// `linkId` joins the linked copies of one complication across owners. It is one
// optional string on the document, omitted when the complication lives on a
// single device, kept through a parse and encode, and accepted by the key audit.

import { describe, expect, it } from "vitest";

import { encodeConfig, newConfig, parseConfig } from "../src/model.js";

describe("linkId on the document", () => {
  it("round trips and is omitted when absent", () => {
    const cfg = newConfig("Porch", 0);
    expect("linkId" in encodeConfig(cfg)).toBe(false);

    cfg.linkId = "8B1C2D3E-0000-4000-8000-000000000001";
    const encoded = encodeConfig(cfg);
    expect(encoded.linkId).toBe(cfg.linkId);
    expect(parseConfig(encoded).linkId).toBe(cfg.linkId);
  });

  it("reads only a non-empty string, upper-cased like every other id", () => {
    const base = encodeConfig(newConfig("Porch", 0));
    expect(parseConfig({ ...base, linkId: "abc" }).linkId).toBe("ABC");
    expect(parseConfig({ ...base, linkId: "" }).linkId).toBeUndefined();
    expect(parseConfig({ ...base, linkId: 7 }).linkId).toBeUndefined();
    expect(parseConfig({ ...base, linkId: null }).linkId).toBeUndefined();
  });
});
