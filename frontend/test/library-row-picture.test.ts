// The small row pictures: a page at the row's size, kept until what it was
// drawn with changes; a smart page as its glyph; a status page; and a menu's
// plain ring while the menu drawer loads.

import { describe, expect, it } from "vitest";

import type { HassLike } from "../src/ha-api.js";
import { libraryMenu, libraryOf } from "../src/library/model.js";
import {
  ROW_MENU_PICTURE_H,
  ROW_PICTURE_PHONE_W,
  ROW_PICTURE_W,
  renderMenuRowPicture,
  renderPageRowPicture,
  renderStatusRowPicture,
} from "../src/library/row-picture.js";
import { HOME_MENU, summary } from "./library-fixture.js";

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

const page = { id: "P", name: "Hall", items: [{ id: "t1", entityId: "light.hall", gridCol: 0, gridRow: 0, colSpan: 6, rowSpan: 2 }] };

describe("renderPageRowPicture", () => {
  it("draws the page's first screen at the row's width, and keeps it while nothing changes", () => {
    const states = {};
    const one = renderPageRowPicture({ page, states });
    expect(flat(one)).toContain(`width:${ROW_PICTURE_W}px`);
    expect(flat(one)).toContain("lr-tile");
    expect(renderPageRowPicture({ page, states })).toBe(one);
    expect(renderPageRowPicture({ page, states: {} })).not.toBe(one);
  });

  it("draws an iPhone's page narrower", () => {
    expect(flat(renderPageRowPicture({ page, iphone: true }))).toContain(`width:${ROW_PICTURE_PHONE_W}px`);
  });

  it("draws an iPhone's page in its Page look, as the stage does", () => {
    const black = { ...page, id: "B", backgroundColor: "#000000" };
    // The iPhone look, the default: the grouped background and 22 point corners.
    const ios = flat(renderPageRowPicture({ page: black, iphone: true }));
    expect(ios).toContain("background:var(--wa-phone-grouped");
    expect(flat(renderPageRowPicture({ page: black, iphone: true, look: "iphone" }))).toBe(ios);
    // The Watch look keeps the page's black and the watch's corners; a
    // watch's row never changes.
    const watchLook = flat(renderPageRowPicture({ page: black, iphone: true, look: "watch" }));
    expect(watchLook).not.toContain("wa-phone-grouped");
    const radius = (text: string): string | undefined => /border-radius:([^;"]+)/.exec(text)?.[1];
    expect(radius(ios)).toBeDefined();
    expect(radius(ios)).not.toBe(radius(watchLook));
    expect(flat(renderPageRowPicture({ page: black }))).not.toContain("wa-phone-grouped");
  });

  it("draws a smart page as its glyph", () => {
    const text = flat(renderPageRowPicture({ page: { id: "S", items: [], dynamicConfig: {} } }));
    expect(text).toContain("lr-smart");
    expect(text).not.toContain("lr-tile");
  });
});

describe("renderStatusRowPicture", () => {
  it("draws only the frame before hass is in, then the page", () => {
    const status = { id: "S1", name: "Doors", rows: [] };
    expect(flat(renderStatusRowPicture({ page: status, hass: undefined }))).toContain("lr-status");
    const hass = { states: {}, connection: {} } as unknown as HassLike;
    const text = flat(renderStatusRowPicture({ page: status, hass }));
    expect(text).toContain("Doors on the watch");
  });
});

describe("renderMenuRowPicture", () => {
  it("stands a plain ring in until the menu drawer is in", () => {
    const menu = libraryMenu(libraryOf(summary()), HOME_MENU)!;
    const text = flat(renderMenuRowPicture({ menu, hass: undefined, icons: undefined, onReady: () => undefined }));
    expect(text).toContain("lr-ring");
    expect(text).toContain(`width:${ROW_MENU_PICTURE_H}px`);
  });
});
