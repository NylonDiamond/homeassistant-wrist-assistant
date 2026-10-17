// The six watch screens that follow a watch, when the panel's Watch app row
// owns the watch (`shellOwnsWatch`): the bar leaves out the screen's own
// watch picker, the way back to complications and the links to sibling
// screens, and the screen follows the watch the panel hands it. Left off,
// every bar is as it was, which the screens' own bar tests hold. The seventh,
// HTTP actions, is shared by every watch: it never has a picker or a way
// back, and follows no watch.

import { html } from "lit";
import { describe, expect, it } from "vitest";

import type { HassLike, OwnerSummary } from "../src/ha-api.js";
import "../src/watch-control-center/control-center-editor.js";
import "../src/watch-http-actions/http-actions-editor.js";
import "../src/watch-menus/menu-editor.js";
import "../src/watch-pages/page-editor.js";
import "../src/watch-rooms/rooms-editor.js";
import "../src/watch-status-pages/status-pages-editor.js";
import "../src/watch-voice/voice-editor.js";

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

/** The screen's bar, from its opening tag to its own closing one. */
function barOf(text: string): string {
  const at = text.indexOf(`<div class="wa-bar`);
  const tags = /<div\b|<\/div>/g;
  tags.lastIndex = at;
  let depth = 0;
  for (let m = tags.exec(text); m !== null; m = tags.exec(text)) {
    depth += m[0] === "</div>" ? -1 : 1;
    if (depth === 0) return text.slice(at, m.index + m[0].length);
  }
  return text.slice(at);
}

const TAGS = [
  "wa-page-editor",
  "wa-menu-editor",
  "wa-voice-editor",
  "wa-status-pages-editor",
  "wa-control-center-editor",
  "wa-rooms-editor",
] as const;

let made = 0;

/** An unconnected editor with two watches, the first shown, an
 * administrator's hass and the panel's Watch settings button handed in. Its
 * `openWatch` is recorded rather than run, so nothing is read. */
function editor(tag: (typeof TAGS)[number], shell: boolean) {
  const n = ++made;
  const owners = [
    { owner_watch_id: `shell-w1-${n}`, device_name: "Jesse's Watch", device_kind: "watch", paired_iphone_name: null, is_orphan: false },
    { owner_watch_id: `shell-w2-${n}`, device_name: "Chen's Watch", device_kind: "watch", paired_iphone_name: null, is_orphan: false },
    { owner_watch_id: `shell-p1-${n}`, device_name: "Jesse's iPhone", device_kind: "iphone", paired_iphone_name: null, is_orphan: false },
  ] as unknown as OwnerSummary[];
  const Ctor = customElements.get(tag) as unknown as new () => Record<string, unknown>;
  const el = new Ctor();
  el.hass = { user: { is_admin: true }, states: {} } as unknown as HassLike;
  el.owners = owners;
  el.watchId = owners[0]!.owner_watch_id;
  el.ownerId = owners[0]!.owner_watch_id;
  el.barActions = html`<button class="tb-btn tb-watch">Watch settings</button>`;
  el.shellOwnsWatch = shell;
  const opened: string[] = [];
  el.openWatch = (id: string) => { opened.push(id); el.watchId = id; };
  const bar = () => barOf(flat((el.render as () => unknown).call(el)));
  /** One update as Lit runs it, with the properties named as changed. */
  const update = (changed: Record<string, unknown> = {}) =>
    (el.willUpdate as (c: Map<string, unknown>) => void).call(el, new Map(Object.entries(changed)));
  return { el, owners, opened, bar, update };
}

describe("a watch screen's bar", () => {
  for (const tag of TAGS) {
    it(`${tag}: keeps its picker and the way back unless the shell owns the watch`, () => {
      const own = editor(tag, false).bar();
      expect(own).toContain(`class="tb-btn tb-back"`);
      expect(own).toMatch(/class="picker \w+-watch-picker"/);
      expect(own).toContain(`class="tb-btn tb-watch"`);

      const shell = editor(tag, true).bar();
      expect(shell).toContain(`class="wa-bar`);
      expect(shell).not.toContain("tb-back");
      expect(shell).not.toContain(">Complications</span>");
      expect(shell).not.toMatch(/-watch-picker/);
    });
  }

  it("leaves out Pages' link to Menus and Menus' link to Pages when the shell owns the watch", () => {
    expect(editor("wa-page-editor", false).bar()).toContain(`class="tb-btn tb-menus"`);
    expect(editor("wa-page-editor", true).bar()).not.toContain("tb-menus");
    expect(editor("wa-menu-editor", false).bar()).toContain(`class="tb-btn tb-pages"`);
    expect(editor("wa-menu-editor", true).bar()).not.toContain("tb-pages");
  });

  for (const tag of TAGS) {
    it(`${tag}: has no ? of its own, in or out of the shell: the panel's Help is the one help`, () => {
      for (const shell of [false, true]) {
        const bar = editor(tag, shell).bar();
        expect(bar).toContain(`class="wa-bar`);
        expect(bar).not.toContain(`class="help"`);
        expect(bar).not.toContain(">?</button>");
      }
    });
  }
});

describe("a watch screen following the panel's watch", () => {
  for (const tag of TAGS) {
    it(`${tag}: in the shell, opens whatever listed watch it is handed, on any update`, () => {
      const { el, owners, opened, update } = editor(tag, true);
      update();
      expect(opened).toEqual([]);
      el.ownerId = owners[1]!.owner_watch_id;
      update();
      expect(opened).toEqual([owners[1]!.owner_watch_id]);
      // A phone is no watch to show: the shown one stays.
      el.ownerId = owners[2]!.owner_watch_id;
      update({ ownerId: owners[1]!.owner_watch_id });
      expect(opened).toEqual([owners[1]!.owner_watch_id]);
    });

    it(`${tag}: with its own picker, follows a new ownerId but keeps a watch picked in it`, () => {
      const { el, owners, opened, update } = editor(tag, false);
      // Picked in its own picker: the panel's ownerId is still the first.
      el.watchId = owners[1]!.owner_watch_id;
      update({ hass: undefined });
      expect(opened).toEqual([]);
      update({ ownerId: owners[1]!.owner_watch_id });
      expect(opened).toEqual([owners[0]!.owner_watch_id]);
    });
  }
});

describe("the HTTP actions screen, shared by every watch", () => {
  function shared() {
    const Ctor = customElements.get("wa-http-actions-editor") as unknown as new () => Record<string, unknown>;
    const el = new Ctor();
    el.owners = [
      { owner_watch_id: "shared-w1", device_name: "Jesse's Watch", device_kind: "watch", paired_iphone_name: null, is_orphan: false },
      { owner_watch_id: "shared-w2", device_name: "Chen's Watch", device_kind: "watch", paired_iphone_name: null, is_orphan: false },
    ] as unknown as OwnerSummary[];
    return { el, bar: barOf(flat((el.render as () => unknown).call(el))) };
  }

  it("has no watch picker and no way back, and says it is shared", () => {
    const { bar } = shared();
    expect(bar).toContain(`class="wa-bar`);
    expect(bar).toContain("Shared by every watch.");
    expect(bar).not.toContain("tb-back");
    expect(bar).not.toContain(">Complications</span>");
    expect(bar).not.toMatch(/watch-picker/);
    expect(bar).not.toContain(`class="help"`);
  });

  it("says in its foot only what a first save does and the size: when it was saved and who has it are the header's", () => {
    const { el } = shared();
    const foot = (record: Record<string, unknown>) => flat((el.renderFoot as (r: unknown, d: unknown) => unknown).call(el, record, { document: { actions: [] } }));
    const saved = { revision: 3, hash: null, updated_at: new Date(Date.now() - 5 * 60_000).toISOString(), updated_by: "panel", handed_over: [], delivered: { "shared-w1": 3 } };
    const text = foot(saved);
    expect(text).toContain(`class="ha-foot"`);
    expect(text).toMatch(/of \d/);
    for (const said of ["Saved here", "5 min ago", "Waiting for", "ha-foot-dot"]) expect(text).not.toContain(said);
    expect(foot({ ...saved, revision: 0 })).toContain("Not saved yet. The first save makes the library.");
  });

  it("takes no watch from the panel", () => {
    const { el } = shared();
    expect("ownerId" in el).toBe(false);
    expect("shellOwnsWatch" in el).toBe(false);
    expect(typeof el.openWatch).toBe("undefined");
  });
});
