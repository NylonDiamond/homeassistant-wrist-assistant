// Home's lineup for one device (plan step 6): what is on it, in its order,
// a group per kind, Edit on each line and Change on each group; and Home's
// "All devices", the boards as one table.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

import { libraryOf } from "../src/library/model.js";
import { lineupGroups } from "../src/home-lineup.js";
import { LINEUP_HIDDEN_TAG, LINEUP_OWN_TAG, renderLineupGroup } from "../src/home-lineup-look.js";
import type { LibraryKind } from "../src/library/client.js";
import { CHEN, CHEN_MENU, JESSE, PAGE1, SMART, summary } from "./library-fixture.js";
import { flat } from "./library-editor-home.js";

const PANEL = readFileSync(new URL("../src/panel.ts", import.meta.url), "utf8");

function groups(ownerId: string, kind: "watch" | "iphone" = "watch") {
  const calls: string[] = [];
  const out = lineupGroups(libraryOf(summary()), ownerId, kind, {
    onEdit: (k: LibraryKind, id: string) => calls.push(`edit:${k}:${id}`),
    onChange: (k: LibraryKind) => calls.push(`change:${k}`),
  });
  return { out, calls };
}

describe("a device's lineup on Home", () => {
  it("lists its pages in its swipe order, its status pages, then the two menus it uses", () => {
    const { out } = groups(CHEN);
    expect(out.map((g) => g.title)).toEqual(["Pages", "Status pages", "Menus"]);
    expect(out[0]!.lines.map((l) => l.name)).toEqual(["Camera", "Lights"]);
    expect(out[1]!.lines.map((l) => l.name)).toEqual(["Lights"]);
    expect(out[2]!.lines.map((l) => l.name)).toEqual(["Anywhere menu: Chen's menu", "Entity quick menu: Entity quick menu"]);
  });

  it("fades a page hidden on the device, and leaves out the watch's own system pages", () => {
    const pages = groups(JESSE).out[0]!.lines;
    expect(pages.map((l) => [l.name, l.hidden === true])).toEqual([["Smart", false], ["New Page 1", true]]);
  });

  it("opens a line in its tab's editor and a group's Change on its board", () => {
    const { out, calls } = groups(CHEN);
    out[0]!.lines[0]!.action!.onClick();
    out[2]!.lines[0]!.action!.onClick();
    out[1]!.change!.onClick();
    expect(calls).toEqual(["edit:pages:AAAA0000-0000-4000-8000-000000000002", `edit:menus:${CHEN_MENU}`, "change:status_pages"]);
    expect(out[2]!.lines[1]!.action!.title).toBe("Edit Entity quick menu");
    expect(out[2]!.lines.map((l) => l.key)).toEqual(["anywhere", "entity"]);
  });

  it("names the device kind in its empty lines and its sub line", () => {
    const { out } = groups("nobody", "iphone");
    expect(out.map((g) => g.lines.length)).toEqual([0, 0, 0]);
    expect(out.map((g) => g.empty)).toEqual(["No pages on this iPhone yet.", "No status pages on this iPhone yet.", "This iPhone uses no menu yet."]);
    expect(out[0]!.sub).toBe("in the order the iPhone swipes them");
  });

  it("draws a group with its count, its Change, and a tag on a hidden line", () => {
    const text = flat(renderLineupGroup(groups(JESSE).out[0]!));
    expect(text).toContain(`<h3 class="hl-title">Pages</h3>`);
    expect(text).toContain(`<span class="hl-n">2</span>`);
    expect(text).toContain(">Change");
    expect(text).toContain(`<em class="hl-tag">${LINEUP_HIDDEN_TAG}</em>`);
    expect(text).toContain(`data-line=${SMART}`);
    expect(text).toContain(`data-line=${PAGE1}`);
  });

  it("tags a device's own screens Not shared", () => {
    const text = flat(renderLineupGroup({
      key: "own", title: "This watch's own", icon: "sliders", hue: "grey", noCount: true, empty: "",
      lines: [{ key: "settings", name: "Settings", tag: LINEUP_OWN_TAG, action: { label: "Open", title: "Settings", href: "/x", onClick: () => undefined } }],
    }));
    expect(text).toContain(`<em class="hl-tag own">Not shared</em>`);
    expect(text).not.toContain(`class="hl-n"`);
    expect(text).toContain(`<a class="hl-edit" href=/x`);
  });
});

describe("Home's All devices", () => {
  it("stacks the tabs' own boards, embedded under one search, then complications, every-device and own parts", () => {
    const all = PANEL.slice(PANEL.indexOf("  private renderHomeAll() {"), PANEL.indexOf("  private renderHomeAllTable("));
    const order = [`part("Pages"`, `part("Status pages"`, `part("Menus"`, `part("Complications and widgets"`, "part(HOME_LIBRARY_TITLE", `part("Each device's own"`];
    const at = order.map((p) => all.indexOf(p));
    for (const [i, n] of at.entries()) expect(n, order[i]).toBeGreaterThan(-1);
    expect([...at].sort((a, b) => a - b)).toEqual(at);
    expect(all).toContain("embedded: true, searchText: q,");
    expect(all).toContain(`placeholder="Find a thing"`);
  });

  it("puts a lock in every box of what is on every device, and watch only for an iPhone's Voice", () => {
    expect(PANEL).toContain(`title="On every device. Nothing to pick.">\${uiIcon("lock")}</span>`);
    expect(PANEL).toContain(`const why = id === "voice" ? "watch only" : "in the app";`);
  });
});
