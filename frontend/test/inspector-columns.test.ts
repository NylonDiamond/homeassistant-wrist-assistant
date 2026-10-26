import { describe, expect, it } from "vitest";

import { inspectorColumnCount } from "../src/watch-pages/inspector-columns.js";

describe("the inspector's column count", () => {
  it("fits columns of at least 360px with 14px between, one to three", () => {
    expect(inspectorColumnCount(0)).toBe(1);
    expect(inspectorColumnCount(Number.NaN)).toBe(1);
    expect(inspectorColumnCount(500)).toBe(1);
    expect(inspectorColumnCount(733)).toBe(1);
    expect(inspectorColumnCount(734)).toBe(2);
    expect(inspectorColumnCount(1107)).toBe(2);
    expect(inspectorColumnCount(1108)).toBe(3);
    expect(inspectorColumnCount(4000)).toBe(3);
  });
});
