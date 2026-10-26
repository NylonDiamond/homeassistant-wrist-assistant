// The page editor element itself, where it can be read without a page: the
// keys it leaves to a focused field, and the stage's tiles, which stand on
// the page's own background rather than on a patch of its color. Then the
// page's head with its page picker, the stage that stands in for the old
// Pages and Tiles lists (hidden tiles, spacers, a tile with no id, Tab, Add
// tile), the canvas head, the Live strip and the zoom. The editor is stood
// up in library mode, its only mode, on one library page.

import { html } from "lit";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { HassLike, OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import type { LibrarySummary } from "../src/library/client.js";
import { libraryDraftKey } from "../src/library/item-mode.js";
import { libraryOf } from "../src/library/model.js";
import { REFERENCE_CASE } from "../src/renderer.js";
import { arrangePickedPart, setArrangeFreePicked, setArrangePickedPart } from "../src/watch-pages/arrange-model.js";
import { type WatchCatalog, readWatchCatalog } from "../src/watch-pages/catalog.js";
import { giveWatchTileId } from "../src/watch-pages/edit.js";
import { watchKeysTypeText } from "../src/watch-pages/editor-host.js";
import { forgetWatchPagesDraft, takeWatchPagesRecord } from "../src/watch-pages/kept.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { pageDevicesText, stageHiddenReason, stageHiddenText, watchPageCopy } from "../src/watch-pages/page-editor.js";
import {
  STAGE_ZOOM_KEY,
  loadStageZoom,
  saveStageZoom,
  stageFitZoom,
  stageZoomIn,
  stageZoomLabel,
  stageZoomOut,
} from "../src/watch-pages/stage.js";

function sheet(): string {
  const element = customElements.get("wa-page-editor") as unknown as { styles: unknown };
  const flat = (s: unknown): string => (Array.isArray(s) ? s.map(flat).join("\n") : String((s as { cssText?: string } | undefined)?.cssText ?? ""));
  return flat(element.styles);
}

/** The declarations of the first rule whose selector is exactly `selector`. */
function rule(css: string, selector: string): string {
  const at = css.search(new RegExp(`(^|[}\\s])${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{`));
  if (at < 0) return "";
  const open = css.indexOf("{", at);
  return css.slice(open + 1, css.indexOf("}", open));
}

describe("keys", () => {
  it("leave only text-like fields to themselves; Cmd+Z on a slider or a menu is the editor's", () => {
    for (const type of ["text", "number", "search", ""]) expect(watchKeysTypeText("INPUT", type, false), type).toBe(true);
    expect(watchKeysTypeText("TEXTAREA", undefined, false)).toBe(true);
    expect(watchKeysTypeText("DIV", undefined, true)).toBe(true);
    for (const type of ["range", "color", "checkbox", "radio", "button"]) expect(watchKeysTypeText("INPUT", type, false), type).toBe(false);
    expect(watchKeysTypeText("SELECT", undefined, false)).toBe(false);
    expect(watchKeysTypeText("BUTTON", undefined, false)).toBe(false);
  });
});

describe("the stage", () => {
  it("draws no ground under a tile: the screen's background shows through", () => {
    const tile = rule(sheet(), ".pe-tile");
    expect(tile).toContain("position: absolute");
    expect(tile).toMatch(/background:\s*transparent/);
    expect(sheet()).not.toContain("--pe-base");
  });
});

// ── the chrome ──────────────────────────────────────────────────────────

/** A template flattened to its markup, values in place (a bound attribute
 * comes out unquoted, a boolean as true or false). A `repeat()` is drawn
 * with its own template, so its rows are there too. */
const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  if (v !== null && typeof v === "object" && "_$litDirective$" in v && "values" in v) {
    const [items, second, third] = (v as { values: unknown[] }).values;
    const draw = (third ?? second) as unknown;
    if (Array.isArray(items) && typeof draw === "function") return items.map((item, i) => flat((draw as (x: unknown, i: number) => unknown)(item, i))).join("");
    return "";
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

/** One page whose tiles are stored out of reading order: Gap (row 6),
 * Bottom (row 3), Right (row 0, column 6), Left (row 0, column 0). Left has
 * state icons, Right a tap of its own; Gap is a spacer, which may repeat. */
const HALL: WatchPagesDocument = {
  schemaVersion: 1,
  pages: [
    {
      id: "P-HALL", name: "Hall", items: [
        { id: "T-GAP", entityId: "spacer.5A17E000-0000-4000-8000-0000000000AA", gridRow: 6, gridCol: 0, colSpan: 2, rowSpan: 2, showLabel: false },
        { id: "T-BOTTOM", entityId: "light.bottom", customLabel: "Bottom", gridRow: 3, gridCol: 0, colSpan: 4, rowSpan: 3 },
        { id: "T-RIGHT", entityId: "light.right", customLabel: "Right", gridRow: 0, gridCol: 6, colSpan: 6, rowSpan: 3, singleTapAction: "moreInfo" },
        { id: "T-LEFT", entityId: "switch.left", customLabel: "Left", gridRow: 0, gridCol: 0, colSpan: 6, rowSpan: 3, stateIcons: { on: "bolt.fill" } },
      ],
    },
    { id: "P-YARD", name: "Yard", items: [] },
  ],
} as unknown as WatchPagesDocument;

const WATCHES = [
  { owner_watch_id: "chrome-w1", device_name: "Jesse's Watch", device_kind: "watch", paired_iphone_name: null },
  { owner_watch_id: "chrome-w2", device_name: "Chen's Watch", device_kind: "watch", paired_iphone_name: null },
] as unknown as OwnerSummary[];

let editors = 0;

/** The editor with `document` (HALL unless given) open in the library as
 * its first page, previewed on the first watch, an administrator's hass,
 * and a button for the bar's right end handed in. HALL's draft also holds
 * Yard, an empty page, for the tests that need one. */
function editor(selectedTileId?: string, document: WatchPagesDocument = HALL, states: Record<string, unknown> = {}) {
  const watchId = `${WATCHES[0]!.owner_watch_id}-${++editors}`;
  const owners = [{ ...WATCHES[0]!, owner_watch_id: watchId }, WATCHES[1]!] as OwnerSummary[];
  const Ctor = customElements.get("wa-page-editor") as unknown as new () => Record<string, unknown>;
  const el = new Ctor();
  el.hass = {
    user: { is_admin: true },
    states: { "light.right": { entity_id: "light.right", state: "on", attributes: { friendly_name: "Right lamp" } }, ...states },
  } as unknown as HassLike;
  el.owners = owners;
  const pageId = ((document.pages as { id: string }[])[0]!).id;
  const ref = { kind: "pages", id: pageId };
  el.libraryItem = ref;
  // As `followLibraryItem` leaves it once it opened the item.
  el.openedItem = ref;
  el.watchId = watchId;
  el.record = {
    kind: "pages", revision: 4, hash: null, updated_at: new Date(Date.now() - 2 * 60_000).toISOString(), updated_by: "panel",
    delivered_revision: 4, delivered_at: null, document,
  } as unknown as WatchConfigRecord;
  el.barActions = html`<button class="tb-btn tb-watch">Watch settings</button>`;
  // The inspector's own markup is not what these tests read, and its field
  // rows ask the document what has focus, which Node does not have.
  el.renderInspector = () => html`<div class="insp-stub"></div>`;
  const key = libraryDraftKey(ref as { kind: "pages"; id: string });
  forgetWatchPagesDraft(key);
  takeWatchPagesRecord(key, document, 4);
  el.selectedPageId = pageId;
  el.selectedTileId = selectedTileId;
  return {
    el,
    owners,
    whole: () => flat((el.render as () => unknown).call(el)),
    body: () => flat((el.renderBody as (w: readonly OwnerSummary[]) => unknown).call(el, owners)),
    draft: () => (el as unknown as { draft: { document: WatchPagesDocument; canUndo: boolean; undo(): boolean } }).draft,
    call: (name: string, ...args: unknown[]) => (el[name] as (...a: unknown[]) => unknown).call(el, ...args),
  };
}

/** Stand-ins for what a key, a press and a selection reach for in a
 * browser: the window's listeners, the element classes, the focused element
 * and the render root. Undone after each test that uses them. */
function stubBrowser(el: Record<string, unknown>): { Element: new () => object } {
  vi.stubGlobal("window", { addEventListener() {}, removeEventListener() {} });
  const Element = ((globalThis as { HTMLElement?: unknown }).HTMLElement ?? class {}) as new () => object;
  vi.stubGlobal("HTMLElement", Element);
  vi.stubGlobal("HTMLInputElement", (globalThis as { HTMLInputElement?: unknown }).HTMLInputElement ?? class extends Element {});
  vi.stubGlobal("document", { activeElement: null });
  el.leaveTile = () => undefined;
  el.renderRoot = { activeElement: null, querySelector: () => null, querySelectorAll: () => [] };
  // Node has no CSS.escape to look a tile's button up by.
  el.tileButton = () => null;
  return { Element };
}

/** An element of the stub's class that has `classes`. */
function nodeOf(Element: new () => object, ...classes: string[]): object {
  return Object.assign(new Element(), { tagName: "DIV", classList: { contains: (c: string) => classes.includes(c) } });
}

/** A key as the window's listener hears it, its path from `from` up through
 * the editor. */
function keyEvent(el: object, key: string, from: object, mods: Record<string, boolean> = {}) {
  let prevented = false;
  return {
    event: { key, defaultPrevented: false, altKey: false, shiftKey: false, metaKey: false, ctrlKey: false, ...mods,
      composedPath: () => [from, el], preventDefault: () => { prevented = true; }, stopPropagation: () => undefined },
    prevented: () => prevented,
  };
}

/** The stage's button for one tile, up to its face. */
function stageTile(text: string, id: string): string {
  const at = text.search(new RegExp(`data-tile=${id}\\s`));
  if (at < 0) return "";
  return text.slice(text.lastIndexOf(`<button type="button" class="pe-tile`, at), text.indexOf("</button>", at));
}

/** A library of three pages: Hall on the first watch, Yard on no device,
 * Porch on both watches. */
function library(owners: readonly OwnerSummary[]) {
  const [w1, w2] = owners.map((o) => o.owner_watch_id) as [string, string];
  const summary = {
    pages: {
      "P-HALL": { item: (HALL.pages as WatchPage[])[0], owners: [w1] },
      "P-YARD": { item: (HALL.pages as WatchPage[])[1], owners: [] },
      "P-PORCH": { item: { id: "P-PORCH", name: "Porch", items: [] }, owners: [w1, w2] },
    },
    status_pages: {}, menus: {}, picks: {},
  } as unknown as LibrarySummary;
  return libraryOf(summary);
}

/** The editor with `library` read, and a store that makes every page it is
 * asked to (each create kept in `made`) and opens nothing. */
function withLibrary(made: unknown[] = [], opened: string[] = []) {
  const e = editor();
  const lib = library(e.owners);
  e.el.lib = {
    library: lib,
    store: {
      library: lib, pending: new Map(), noteFor: () => undefined, savedStamp: () => undefined,
      createItem: async (_kind: string, document: unknown) => {
        made.push(document);
        return { ok: true, reply: { id: `MADE-${made.length}`, revision: 1 } };
      },
    },
  };
  e.el.onOpenItem = (id: string) => { opened.push(id); };
  return { ...e, made, opened };
}

describe("the page's head", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("puts All pages, the page picker and the devices over the stage and the inspector, with no list beside them", () => {
    const { body } = editor();
    const text = body();
    const head = text.slice(text.indexOf(`<div class="pe-head"`), text.indexOf(`<div class="layout pe-layout`));
    expect(head).toContain(`class="pe-btn pe-head-back" title="Back to the Pages board"`);
    expect(head).toContain("<span>All pages</span>");
    expect(text.indexOf(`<div class="pe-head"`)).toBeLessThan(text.indexOf(`<div class="column canvas">`));
    expect(text).toContain(`<div class="layout pe-layout pe-wide">`);
    for (const gone of ["pe-pages-card", "pe-tiles-card", "pe-list-split", "pe-tile-row", "pe-page-row", `class="gutter`, "column left", "--wa-left"]) {
      expect(text, gone).not.toContain(gone);
    }
  });

  it("draws the page picker as one large button: picture, Editing page, name, tiles and devices, Switch page", () => {
    const { body } = editor();
    const text = body();
    const button = text.slice(text.indexOf(`<button type="button" class="pe-pp"`), text.indexOf("</button>", text.indexOf(`class="pe-pp-switch"`)));
    expect(button).toContain(`aria-haspopup="dialog" aria-expanded=false`);
    expect(button).toMatch(/<span class="pe-pic" style=width:46px;height:\d+px;/);
    expect(button).toContain(`<span class="pe-pp-label">Editing page</span>`);
    expect(button).toContain(`>Hall</span>`);
    expect(button).toContain(`<span class="pe-pp-sub">4 tiles · On no device yet</span>`);
    expect(button).toContain(`<span class="pe-pp-switch">Switch page`);
    expect(text).not.toContain("pe-pp-pop");
  });

  it("moves the devices to the head's right, and the bar's own way back only while there is no head", () => {
    const { el, body, owners } = withLibrary();
    const text = body();
    const head = text.slice(text.indexOf(`<div class="pe-head"`), text.indexOf(`<div class="layout pe-layout`));
    expect(head).toContain(`<div class="pe-head-ticks"><div class="lib-on over-stage`);
    expect(head).toContain(`4 tiles · On ${owners[0]!.device_name}`);
    // Not between the canvas head and the stage any more.
    const canvas = text.slice(text.indexOf(`<div class="card canvas-card`));
    expect(canvas).not.toContain("lib-on");
    expect(rule(sheet(), ".pe-head-ticks")).toContain("margin-left: auto");
    const bar = () => flat((el.renderTopBar as (d: unknown) => unknown).call(el, (el as unknown as { draft: unknown }).draft));
    expect(bar()).not.toContain("tb-back");
    el.loading = true;
    expect(bar()).toContain(`class="tb-btn tb-back"`);
  });

  it("says where a page is in a few words", () => {
    expect(pageDevicesText([])).toBe("On no device yet");
    expect(pageDevicesText(["Jesse's Watch"])).toBe("On Jesse's Watch");
    expect(pageDevicesText(["Jesse's Watch", "Kitchen"])).toBe("On Jesse's Watch and Kitchen");
    expect(pageDevicesText(["a", "b", "c"])).toBe("On 3 devices");
  });
});

describe("the page picker", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const cards = (text: string) => [...text.matchAll(/class="pe-pp-card[^"]*" data-pick-page=([^\s]+)/g)].map((m) => m[1]);

  it("opens a popover of every page in the library as a card with its picture, the open one tagged Editing, then New page", () => {
    const { el, body, call } = withLibrary();
    call("togglePicker");
    expect(el.pickerOpen).toBe(true);
    // The find field takes focus once drawn.
    expect(el.focusAfter).toBe(".pe-pp-find");
    const text = body();
    const pop = text.slice(text.indexOf(`<div class="pe-pp-pop"`));
    expect(pop).toContain(`role="dialog" aria-label="Switch page"`);
    expect(pop).toContain("<strong>Pick a page to edit</strong>");
    expect(pop).toContain(`<span class="pe-pp-count">3 pages</span>`);
    expect(pop).toContain(`placeholder="Find a page"`);
    expect(cards(pop)).toEqual(["P-HALL", "P-YARD", "P-PORCH"]);
    expect(pop.match(/<span class="pe-pic"/g)).toHaveLength(3);
    expect(pop).toMatch(/class="pe-pp-card on" data-pick-page=P-HALL[\s\S]*?<span class="pe-pp-tag">Editing<\/span>/);
    expect(pop.match(/pe-pp-tag/g)).toHaveLength(1);
    // Porch is on both watches.
    expect(pop).toContain(`<span class="pe-pp-card-sub">On Jesse's Watch and Chen's Watch</span>`);
    expect(pop).toMatch(/class="pe-pp-card pe-pp-new" \?disabled=false[\s\S]*New page/);
    expect(pop).toContain(`class="pe-btn pe-pp-rename"`);
    expect(pop).toContain(`class="pe-btn pe-pp-dup"`);
    expect(pop).toContain(">Open the Pages board</button>");
    // A second press of the button shuts it, focus back on the button.
    call("togglePicker");
    expect(el.pickerOpen).toBe(false);
    expect(el.focusAfter).toBe(".pe-pp");
    expect(body()).not.toContain("pe-pp-pop");
  });

  it("filters the cards by name as the find field is typed in", () => {
    const { el, body, call } = withLibrary();
    call("togglePicker");
    el.pickerFind = "YA";
    expect(cards(body())).toEqual(["P-YARD"]);
    // New page stays, whatever is typed.
    expect(body()).toContain("pe-pp-new");
    el.pickerFind = "o";
    expect(cards(body())).toEqual(["P-PORCH"]);
    el.pickerFind = "zzz";
    expect(cards(body())).toEqual([]);
    expect(body()).toContain(`No page's name has "zzz" in it.`);
    // Opening it again starts with every page.
    call("togglePicker");
    call("togglePicker");
    expect(el.pickerFind).toBe("");
  });

  it("switches page: a card opens that page in this editor and shuts the popover, the open page's card only shuts it", () => {
    const { el, call, opened, whole } = withLibrary();
    stubBrowser(el);
    call("togglePicker");
    const drawn = (el.render as () => unknown).call(el);
    const card = findTemplate(drawn, (t) => t.strings[0]!.includes(`class="pe-pp-card`) && t.values.includes("P-YARD"));
    expect(card).toBeDefined();
    listener(card!, "click")({} as Event);
    expect(opened).toEqual(["P-YARD"]);
    expect(el.pickerOpen).toBe(false);
    call("togglePicker");
    call("openPickedPage", "p-hall");
    expect(opened).toEqual(["P-YARD"]);
    expect(el.pickerOpen).toBe(false);
    expect(whole()).not.toContain("pe-pp-pop");
  });

  it("shuts on Escape, from its find field too, and on a press outside it, not inside", () => {
    const { el, call } = withLibrary();
    const { Element } = stubBrowser(el);
    call("togglePicker");
    const find = Object.assign(new Element(), { tagName: "INPUT", type: "search", classList: { contains: () => false } });
    const esc = keyEvent(el, "Escape", find);
    call("onKeyDown", esc.event);
    expect(esc.prevented()).toBe(true);
    expect(el.pickerOpen).toBe(false);
    expect(el.focusAfter).toBe(".pe-pp");
    call("togglePicker");
    call("onWindowPointerDown", { composedPath: () => [nodeOf(Element, "pe-pp-card"), nodeOf(Element, "pe-pp-wrap")] });
    expect(el.pickerOpen).toBe(true);
    call("onWindowPointerDown", { composedPath: () => [nodeOf(Element, "pe-screen")] });
    expect(el.pickerOpen).toBe(false);
  });

  it("renames the open page in its foot, Enter keeping the name and Escape dropping it", () => {
    const { el, body, call, draft } = withLibrary();
    stubBrowser(el);
    call("togglePicker");
    call("startRename", "P-HALL");
    expect(body()).toMatch(/<div class="pe-pp-foot">\s*<input class="pe-rename" aria-label="Page name" \.value=Hall/);
    (el.renaming as { value: string }).value = "Hallway";
    call("commitRename");
    expect(((draft().document.pages as WatchPage[])[0]!).name).toBe("Hallway");
    expect(draft().canUndo).toBe(true);
    call("startRename", "P-HALL");
    (el.renaming as { value: string }).value = "Nope";
    call("cancelRename");
    expect(((draft().document.pages as WatchPage[])[0]!).name).toBe("Hallway");
    expect(el.focusAfter).toBe(".pe-pp-rename");
  });

  it("makes a New page and a Duplicate in the library and opens them; only for an administrator", async () => {
    const { el, call, made, opened } = withLibrary();
    stubBrowser(el);
    call("togglePicker");
    await call("newPickedPage");
    const fresh = ((made[0] as WatchPagesDocument).pages as WatchPage[])[0]!;
    expect(fresh.name).toBe("New Page 1");
    expect(fresh.items).toEqual([]);
    expect(opened).toEqual(["MADE-1"]);
    expect(el.pickerOpen).toBe(false);
    await call("duplicatePage");
    const copy = ((made[1] as WatchPagesDocument).pages as WatchPage[])[0]!;
    expect(copy.name).toBe("Hall copy");
    expect(copy.id).not.toBe("P-HALL");
    expect(opened).toEqual(["MADE-1", "MADE-2"]);
    // Not an administrator: neither makes a page, and both say why.
    el.hass = { ...(el.hass as object), user: { is_admin: false } };
    expect(call("pickerMakeRefusal")).toBe("Only an administrator can make a page.");
    call("togglePicker");
    expect(flat((el.renderBody as (w: unknown) => unknown).call(el, el.owners))).toMatch(/class="pe-pp-card pe-pp-new" \?disabled=true\s+title=Only an administrator can make a page\./);
    await call("duplicatePage");
    expect(made).toHaveLength(2);
  });

  it("copies a page with new ids for every tile and a spacer's own id, keeping its groups", () => {
    const hall = { ...(HALL.pages as WatchPage[])[0]!, groups: [{ id: "G1" }] } as WatchPage;
    (hall.items as WatchPageTile[])[1] = { ...(hall.items as WatchPageTile[])[1]!, groupId: "G1" };
    const copy = watchPageCopy(hall, "p-new", "Hall copy");
    expect(copy.id).toBe("P-NEW");
    expect(copy.name).toBe("Hall copy");
    const before = hall.items as WatchPageTile[];
    const after = copy.items as WatchPageTile[];
    expect(after).toHaveLength(before.length);
    for (let i = 0; i < after.length; i++) expect(after[i]!.id).not.toBe(before[i]!.id);
    expect(after[0]!.entityId).toMatch(/^spacer\./);
    expect(after[0]!.entityId).not.toBe(before[0]!.entityId);
    expect(after[1]!.entityId).toBe("light.bottom");
    expect(after[1]!.groupId).toBe("G1");
    expect(copy.groups).toEqual([{ id: "G1" }]);
    // The page it was made from is untouched.
    expect(before[0]!.id).toBe("T-GAP");
  });

  it("reads clearly at 4K and 100%: a big name, the popover on the editor's tokens", () => {
    const css = sheet();
    expect(rule(css, ".pe-pp-name")).toContain("font-size: 18px");
    expect(rule(css, ".pe-pp-switch")).toContain("var(--wa-primary-bg)");
    expect(rule(css, ".pe-pp-pop")).toContain("var(--wa-shadow-pop)");
    expect(rule(css, ".pe-pp-card.on")).toContain("var(--wa-sel-ring)");
  });
});

// ── the stage, where the lists were ─────────────────────────────────────

describe("the stage's quiet tiles", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /** HALL with Left hidden while its switch is off, and Right shown only
   * while the sun is up. */
  const RULED = {
    ...HALL,
    pages: [{
      ...(HALL.pages as WatchPage[])[0]!,
      items: (HALL.pages as { items: WatchPageTile[] }[])[0]!.items.map((t) =>
        t.id === "T-LEFT" ? { ...t, hideWhenInactive: true }
        : t.id === "T-RIGHT" ? { ...t, showWhen: { entityId: "sun.sun", comparisonOperator: "eq", state: "above_horizon" } }
        : t),
    }],
  } as unknown as WatchPagesDocument;
  const STATES = {
    "switch.left": { entity_id: "switch.left", state: "off", attributes: {} },
    "sun.sun": { entity_id: "sun.sun", state: "below_horizon", attributes: {} },
  };

  it("fades a tile its Show tile rule hides, with a dashed edge and a tag saying why, and keeps it a button to pick", () => {
    const { el, body } = editor(undefined, RULED, STATES);
    el.liveStates = true;
    const text = body();
    const left = stageTile(text, "T-LEFT");
    expect(left).toMatch(/^<button type="button" class="pe-tile  faded /);
    expect(left).toContain(`<span class="pe-hid-tag">Hidden while off</span>`);
    expect(left).toContain("@click=");
    const right = stageTile(text, "T-RIGHT");
    expect(right).toMatch(/class="pe-tile  faded /);
    expect(right).toContain(`<span class="pe-hid-tag">Hidden by a rule</span>`);
    expect(right).toContain("Hidden by a rule");
    expect(stageTile(text, "T-BOTTOM")).not.toContain("faded");
    // Off Live preview every tile is drawn on: none is hidden.
    el.liveStates = false;
    expect(body()).not.toContain("pe-hid-tag");
    // Faded with a dashed edge, the tag at full strength.
    const css = sheet();
    expect(rule(css, ".pe-tile.spacer::before, .pe-tile.faded::before")).toContain("dashed");
    expect(rule(css, ".pe-tile.faded > :not(.pe-hid-tag):not(.pe-spacer-word)")).toContain("opacity: .38");
  });

  it("says why a tile is hidden: its own state off, or a rule", () => {
    const tile = (t: Record<string, unknown>) => ({ id: "T", entityId: "light.a", ...t }) as WatchPageTile;
    const states = { "light.a": { state: "off" }, "sun.sun": { state: "below_horizon" } } as never;
    expect(stageHiddenReason(tile({}), states)).toBeUndefined();
    expect(stageHiddenReason(tile({ hideWhenInactive: true }), states)).toBe("off");
    expect(stageHiddenReason(tile({ hideWhenInactive: true }), { "light.a": { state: "on" } } as never)).toBeUndefined();
    expect(stageHiddenReason(tile({ showWhen: { entityId: "sun.sun", comparisonOperator: "eq", state: "above_horizon" } }), states)).toBe("rule");
    // On again, but its condition still hides it.
    expect(stageHiddenReason(tile({ hideWhenInactive: true, showWhen: { entityId: "sun.sun", comparisonOperator: "eq", state: "above_horizon" } }),
      { "light.a": { state: "on" }, "sun.sun": { state: "below_horizon" } } as never)).toBe("rule");
    expect(stageHiddenText("off")).toBe("Hidden while off");
    expect(stageHiddenText("rule")).toBe("Hidden by a rule");
  });

  it("outlines a spacer with a dashed edge and its word, so it can be picked", () => {
    const text = editor().body();
    const gap = stageTile(text, "T-GAP");
    expect(gap).toMatch(/^<button type="button" class="pe-tile spacer /);
    expect(gap).toContain(`<span class="pe-spacer-word" aria-hidden="true">Spacer</span>`);
    expect(stageTile(text, "T-LEFT")).not.toContain("pe-spacer-word");
  });

  it("picks a tile stored with no id with a click, which gives it an id in one undo step", () => {
    const NOID = {
      schemaVersion: 1,
      pages: [{ id: "P-OLD", name: "Old", items: [
        { id: "T-ONE", entityId: "light.right", gridRow: 0, gridCol: 0, colSpan: 6, rowSpan: 3 },
        { entityId: "switch.lost", customLabel: "Lost", gridRow: 0, gridCol: 6, colSpan: 6, rowSpan: 3 },
      ] }],
    } as unknown as WatchPagesDocument;
    const { el, body, draft } = editor(undefined, NOID);
    stubBrowser(el);
    const text = body();
    expect(text).toMatch(/<button type="button" class="pe-tile noid [^"]*"[^>]*aria-label=Lost, Switch, with no id/);
    const drawn = (el.renderBody as (w: unknown) => unknown).call(el, el.owners);
    const lost = findTemplate(drawn, (t) => t.strings[0]!.includes(`class="pe-tile noid`));
    expect(lost).toBeDefined();
    listener(lost!, "click")({ stopPropagation: () => undefined } as unknown as Event);
    const items = (draft().document.pages as { items: WatchPageTile[] }[])[0]!.items;
    const id = items[1]!.id as string;
    expect(id).toMatch(/^[0-9A-F-]{36}$/);
    expect(el.selectedTileId).toBe(id);
    expect(draft().canUndo).toBe(true);
    expect(body()).toMatch(new RegExp(`class="pe-tile [^"]*\\bsel\\b[^"]*"\\s+data-tile=${id}`));
    draft().undo();
    expect((draft().document.pages as { items: WatchPageTile[] }[])[0]!.items[1]!.id).toBeUndefined();
    // A tile with an id, or one not on the page, is left as it is.
    const doc = draft().document;
    expect(giveWatchTileId(doc, "P-OLD", items[0]!).document).toBe(doc);
    expect(giveWatchTileId(doc, "P-OLD", { entityId: "x.y" } as WatchPageTile).id).toBeUndefined();
  });

  it("puts + Add tile under the watch, opening the Add tile dialog; under the edited one side by side; none on a smart page", () => {
    const { el, body, owners } = editor();
    stubBrowser(el);
    const text = body();
    const side = text.slice(text.indexOf(`<div class="lib-duo-side`));
    expect(side.indexOf(`class="pe-stage-add"`)).toBeGreaterThan(side.indexOf("</div>", side.indexOf(`class="wp-screen pe-screen`)));
    expect(text.match(/class="pe-stage-add"/g)).toHaveLength(1);
    const drawn = (el.renderBody as (w: unknown) => unknown).call(el, owners);
    const add = findTemplate(drawn, (t) => t.strings[0]!.includes(`class="pe-stage-add"`));
    listener(add!, "click")({} as Event);
    expect(el.addTileOpen).toBe(true);
    el.addTileOpen = false;
    // Side by side: under the edited preview, not the other.
    el.phones = true;
    el.sideBySide = true;
    const both = body();
    expect(both.match(/class="pe-stage-add"/g)).toHaveLength(1);
    expect(both.indexOf(`class="pe-stage-add"`)).toBeLessThan(both.indexOf(`class="lib-duo-other"`));
    // A smart page fills itself.
    const smart = editor(undefined, { schemaVersion: 1, pages: [{ id: "P-SMART", name: "Lights on", dynamicConfig: { rules: [] } }] } as unknown as WatchPagesDocument);
    expect(smart.body()).not.toContain("pe-stage-add");
  });

  it("picks the next tile in reading order with Tab and the one before with Shift-Tab, letting go past either end", () => {
    const { el, call, draft } = editor("T-LEFT");
    const { Element } = stubBrowser(el);
    const screen = nodeOf(Element, "pe-screen");
    const tab = (shiftKey = false) => {
      const k = keyEvent(el, "Tab", screen, { shiftKey });
      call("onKeyDown", k.event);
      return k.prevented();
    };
    expect(tab()).toBe(true);
    expect(el.selectedTileId).toBe("T-RIGHT");
    expect(tab()).toBe(true);
    expect(el.selectedTileId).toBe("T-BOTTOM");
    expect(tab(true)).toBe(true);
    expect(el.selectedTileId).toBe("T-RIGHT");
    el.selectedTileId = "T-GAP";
    expect(tab()).toBe(false);
    expect(el.selectedTileId).toBe("T-GAP");
    el.selectedTileId = "T-LEFT";
    expect(tab(true)).toBe(false);
    // From nothing picked on the stage, the first tile; with nothing picked
    // and nothing focused, Tab stays the browser's.
    el.selectedTileId = undefined;
    expect(tab()).toBe(true);
    expect(el.selectedTileId).toBe("T-LEFT");
    el.selectedTileId = undefined;
    const loose = keyEvent(el, "Tab", el);
    call("onKeyDown", loose.event);
    expect(loose.prevented()).toBe(false);
    expect(el.selectedTileId).toBeUndefined();
    // The arrow keys still move the picked tile (down past the spacer under
    // it, which swaps up), not the pick.
    el.selectedTileId = "T-BOTTOM";
    const arrow = keyEvent(el, "ArrowDown", screen);
    call("onKeyDown", arrow.event);
    expect(arrow.prevented()).toBe(true);
    expect(el.selectedTileId).toBe("T-BOTTOM");
    const rows = (draft().document.pages as { items: { id: string; gridRow: number }[] }[])[0]!.items;
    expect(rows.find((t) => t.id === "T-BOTTOM")!.gridRow).toBeGreaterThan(3);
  });

  it("tints the tile under the pointer, and lets the tint go with its own leave", () => {
    const { el, body } = editor();
    expect(stageTile(body(), "T-RIGHT")).toContain("@pointerenter=");
    expect(stageTile(body(), "T-RIGHT")).toContain("@pointerleave=");
    const peek = el.peekStageTile as (id: string, on: boolean) => void;
    peek.call(el, "T-RIGHT", true);
    const text = body();
    expect(text).toMatch(/class="pe-tile [^"]*\bhov\b[^"]*"\s+data-tile=T-RIGHT/);
    expect(text).not.toMatch(/class="pe-tile [^"]*\bhov\b[^"]*"\s+data-tile=T-LEFT/);
    peek.call(el, "T-LEFT", false);
    expect(el.stageHoverTileId).toBe("T-RIGHT");
    peek.call(el, "T-RIGHT", false);
    expect(el.stageHoverTileId).toBeUndefined();
    expect(body()).not.toMatch(/\bhov\b/);
    const css = rule(sheet(), ".pe-tile.hov::after");
    expect(css).toContain("inset: 0");
    expect(css).toContain("22%");
  });
});

// ── templates and their listeners ───────────────────────────────────────

interface Tpl { strings: readonly string[]; values: unknown[] }

/** The first template in a drawn tree that `match` picks, `repeat()` rows
 * included. */
function findTemplate(v: unknown, match: (t: Tpl) => boolean): Tpl | undefined {
  if (Array.isArray(v)) {
    for (const item of v) {
      const found = findTemplate(item, match);
      if (found) return found;
    }
    return undefined;
  }
  if (v === null || typeof v !== "object") return undefined;
  if ("strings" in v && "values" in v) {
    const t = v as Tpl;
    if (match(t)) return t;
    return findTemplate(t.values, match);
  }
  if ("_$litDirective$" in v && "values" in v) {
    const [items, second, third] = (v as { values: unknown[] }).values;
    const draw = (third ?? second) as unknown;
    if (Array.isArray(items) && typeof draw === "function") return findTemplate(items.map((item, i) => (draw as (x: unknown, i: number) => unknown)(item, i)), match);
  }
  return undefined;
}

/** The listener a template binds to `event` on its outer element. */
function listener(t: Tpl, event: string): (e: Event) => void {
  const at = t.strings.findIndex((s) => s.trimEnd().endsWith(`@${event}=`));
  expect(at, `@${event} bound`).toBeGreaterThan(-1);
  return t.values[at] as (e: Event) => void;
}

// ── picking several tiles ───────────────────────────────────────────────

describe("picking several tiles", () => {
  type Mods = { shiftKey?: boolean; metaKey?: boolean; ctrlKey?: boolean };
  type Draft = { document: WatchPagesDocument; canUndo: boolean; undo(): boolean };

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /** The editor, with no focused field to let go of and a stand-in render
   * root, and its clicks and keys. A selection that goes ends a drag on a
   * number at the window, and a key asks whether it was typed in a field. */
  function picker(selectedTileId?: string) {
    const made = editor(selectedTileId);
    const { el } = made;
    stubBrowser(el);
    return {
      ...made,
      click: (id: string, mods: Mods = {}) =>
        (el.clickTile as (i: string, e: Required<Mods>) => void).call(el, id, { shiftKey: false, metaKey: false, ctrlKey: false, ...mods }),
      picked: () => [...(el.multi as ReadonlySet<string>)],
      draft: () => (el as unknown as { draft: Draft }).draft,
      ids: () => ((el as unknown as { draft: Draft }).draft.document.pages as { items: { id: string }[] }[])[0]!.items.map((t) => t.id),
      call: (name: string, ...args: unknown[]) => (el[name] as (...a: unknown[]) => unknown).call(el, ...args),
    };
  }

  it("adds a tile with Cmd or Ctrl-click, takes it out again, and collapses to one", () => {
    const { el, click, picked } = picker("T-LEFT");
    click("T-BOTTOM", { metaKey: true });
    expect(picked()).toEqual(["T-LEFT", "T-BOTTOM"]);
    expect(el.selectedTileId).toBe("T-BOTTOM");
    click("T-RIGHT", { ctrlKey: true });
    expect(picked()).toEqual(["T-LEFT", "T-BOTTOM", "T-RIGHT"]);
    expect(el.selectedTileId).toBe("T-RIGHT");
    // The primary taken out: the last picked in reading order takes over.
    click("T-RIGHT", { metaKey: true });
    expect(picked()).toEqual(["T-LEFT", "T-BOTTOM"]);
    expect(el.selectedTileId).toBe("T-BOTTOM");
    // Down to one: a plain selection of it.
    click("T-LEFT", { metaKey: true });
    expect(picked()).toEqual([]);
    expect(el.selectedTileId).toBe("T-BOTTOM");
    // Down to none.
    click("T-BOTTOM", { metaKey: true });
    expect(el.selectedTileId).toBeUndefined();
    // From nothing, Cmd-click selects the one.
    click("T-GAP", { metaKey: true });
    expect(picked()).toEqual([]);
    expect(el.selectedTileId).toBe("T-GAP");
  });

  it("picks a run in reading order with Shift-click, from the anchor, and a plain click collapses it", () => {
    const { el, click, picked } = picker("T-RIGHT");
    click("T-GAP", { shiftKey: true });
    expect(picked()).toEqual(["T-RIGHT", "T-BOTTOM", "T-GAP"]);
    expect(el.selectedTileId).toBe("T-RIGHT");
    // The anchor stays: a Shift-click the other way runs from it again.
    click("T-LEFT", { shiftKey: true });
    expect(picked()).toEqual(["T-LEFT", "T-RIGHT"]);
    expect(el.selectedTileId).toBe("T-RIGHT");
    click("T-BOTTOM");
    expect(picked()).toEqual([]);
    expect(el.selectedTileId).toBe("T-BOTTOM");
    // With nothing selected, Shift-click selects the one clicked.
    const other = picker();
    other.click("T-BOTTOM", { shiftKey: true });
    expect(other.el.selectedTileId).toBe("T-BOTTOM");
    expect(other.picked()).toEqual([]);
  });

  it("picks every tile with Select all and with Cmd or Ctrl+A, not from a text field", () => {
    const { el, picked, call } = picker();
    call("selectAll");
    expect(picked()).toEqual(["T-LEFT", "T-RIGHT", "T-BOTTOM", "T-GAP"]);
    call("selectTile", undefined);
    expect(picked()).toEqual([]);
    let prevented = 0;
    const key = (mods: Mods, from: unknown = el) => ({ key: "a", defaultPrevented: false, altKey: false, shiftKey: false, metaKey: false, ctrlKey: false, ...mods,
      composedPath: () => [from, el], preventDefault: () => { prevented++; } });
    // In a text field Cmd+A is the field's own.
    const Input = (globalThis as unknown as { HTMLInputElement: new () => object }).HTMLInputElement;
    call("onKeyDown", key({ metaKey: true }, Object.assign(new Input(), { tagName: "INPUT", type: "text", isContentEditable: false })));
    expect(picked()).toEqual([]);
    expect(prevented).toBe(0);
    call("onKeyDown", key({ metaKey: true }));
    expect(picked()).toHaveLength(4);
    expect(prevented).toBe(1);
    call("selectTile", undefined);
    call("onKeyDown", key({ ctrlKey: true }));
    expect(picked()).toHaveLength(4);
    // A plain "a" picks nothing.
    call("selectTile", undefined);
    call("onKeyDown", key({}));
    expect(picked()).toEqual([]);
    expect(prevented).toBe(2);
    // An empty page has nothing to pick.
    el.selectedPageId = "P-YARD";
    call("selectAll");
    expect(picked()).toEqual([]);
    expect(el.selectedTileId).toBeUndefined();
  });

  it("rings every picked tile on the stage, with no resize handles", () => {
    const { el, body, click } = picker("T-RIGHT");
    expect(body()).toContain(`<div class="pe-sel `);
    click("T-BOTTOM", { metaKey: true });
    const text = body();
    for (const id of ["T-RIGHT", "T-BOTTOM"]) {
      expect(stageTile(text, id), id).toMatch(/class="pe-tile [^"]*\bsel\b[^"]*\bmulti"/);
      expect(stageTile(text, id), id).toContain("aria-pressed=true");
    }
    for (const id of ["T-LEFT", "T-GAP"]) {
      expect(stageTile(text, id), id).not.toMatch(/\bsel\b/);
      expect(stageTile(text, id), id).toContain("aria-pressed=false");
    }
    expect(text).not.toContain(`<div class="pe-sel `);
    // The canvas head's buttons and the Live strip speak of both.
    expect(text).toContain("aria-label=Duplicate 2 tiles");
    expect(text).toContain("title=Delete 2 tiles (Delete or Backspace)");
    expect(text).toContain(`<span class="vb-empty">2 tiles picked. Pick one to try its states.</span>`);
    // A press on the screen lets them all go.
    el.selectedTileId = "T-BOTTOM";
    (el.selectTile as (id: string | undefined) => void).call(el, undefined);
    expect((el.multi as ReadonlySet<string>).size).toBe(0);
  });

  it("deletes every picked tile in one undo step", () => {
    const { el, click, draft, ids, call } = picker("T-LEFT");
    click("T-BOTTOM", { metaKey: true });
    expect(draft().canUndo).toBe(false);
    call("deleteTile");
    expect(ids()).toEqual(["T-GAP", "T-RIGHT"]);
    call("reconcileSelection");
    expect((el.multi as ReadonlySet<string>).size).toBe(0);
    expect(el.selectedTileId).toBeUndefined();
    expect(draft().canUndo).toBe(true);
    draft().undo();
    expect(ids()).toEqual(["T-GAP", "T-BOTTOM", "T-RIGHT", "T-LEFT"]);
    expect(draft().canUndo).toBe(false);
  });

  it("copies the picked tiles that may be copied, in one step, and picks the copies", () => {
    const { el, click, draft, ids, call } = picker("T-GAP");
    // A second light has nowhere to go; the spacer copies.
    click("T-BOTTOM", { metaKey: true });
    call("duplicateTile");
    expect(ids()).toHaveLength(5);
    const copy = ids()[4]!;
    expect(copy).not.toBe("T-GAP");
    expect(el.selectedTileId).toBe(copy);
    expect((el.multi as ReadonlySet<string>).size).toBe(0);
    draft().undo();
    expect(ids()).toHaveLength(4);
    expect(draft().canUndo).toBe(false);
  });

  it("moves every picked tile one step, all or nothing", () => {
    const { click, draft, call } = picker("T-BOTTOM");
    const rows = () => Object.fromEntries((draft().document.pages as { items: { id: string; gridRow: number }[] }[])[0]!.items.map((t) => [t.id, t.gridRow]));
    // The Gap sits right under Bottom: it goes first, so the two do not swap.
    click("T-GAP", { metaKey: true });
    call("nudge", "down");
    expect(rows()).toEqual({ "T-GAP": 7, "T-BOTTOM": 4, "T-RIGHT": 0, "T-LEFT": 0 });
    draft().undo();
    expect(draft().canUndo).toBe(false);
    // Left is at the top already, so Bottom does not move up either.
    click("T-LEFT");
    click("T-BOTTOM", { metaKey: true });
    const before = draft().document;
    call("nudge", "up");
    expect(draft().document).toBe(before);
    expect(draft().canUndo).toBe(false);
  });

  describe("dragged by one of them", () => {
    type Rect = { col: number; row: number; colSpan: number; rowSpan: number };
    type Move = {
      tileId: string; started: boolean; left: number; top: number; rect: Rect;
      cell?: { col: number; row: number }; outcome?: { kind: string };
      group?: { id: string; rect: Rect }[];
    };

    /** The picker, with no screen to measure and no pointer to capture, and a
     * plain press on a tile. */
    function dragger(selectedTileId?: string) {
      const made = picker(selectedTileId);
      const { el } = made;
      el.screenEl = () => null;
      el.capture = () => undefined;
      const press = (id: string, pointerType = "mouse") =>
        made.call("onTilePointerDown", {
          button: 0, isPrimary: true, metaKey: false, ctrlKey: false, shiftKey: false, pointerType, pointerId: 7, clientX: 5, clientY: 5,
          currentTarget: { getBoundingClientRect: () => ({ left: 0, top: 0 }) },
        }, id);
      const gesture = () => el.gesture as Move | undefined;
      /** The pointer has travelled: the grabbed tile is aimed at `cell`. */
      const aim = (cell: { col: number; row: number }) => {
        const g = gesture()!;
        g.started = true;
        g.cell = cell;
        g.outcome = made.call("groupDropOutcome", g, cell) as Move["outcome"];
        return g;
      };
      const rows = () => Object.fromEntries((made.draft().document.pages as { items: { id: string; gridRow: number; gridCol: number }[] }[])[0]!.items.map((t) => [t.id, `${t.gridCol},${t.gridRow}`]));
      return { ...made, press, gesture, aim, rows };
    }

    it("keeps the pick on a plain press of a picked tile and takes every picked tile along", () => {
      const { el, call, press, gesture, picked } = dragger();
      call("selectAll");
      press("T-BOTTOM");
      expect(picked()).toEqual(["T-LEFT", "T-RIGHT", "T-BOTTOM", "T-GAP"]);
      const g = gesture()!;
      expect(g.tileId).toBe("T-BOTTOM");
      expect(g.group).toEqual([
        { id: "T-LEFT", rect: { col: 0, row: 0, colSpan: 6, rowSpan: 3 } },
        { id: "T-RIGHT", rect: { col: 6, row: 0, colSpan: 6, rowSpan: 3 } },
        { id: "T-BOTTOM", rect: { col: 0, row: 3, colSpan: 4, rowSpan: 3 } },
        { id: "T-GAP", rect: { col: 0, row: 6, colSpan: 2, rowSpan: 2 } },
      ]);
      call("endGesture");
      // A press on a tile outside the pick lets the pick go and drags it alone.
      call("selectTile", undefined);
      call("selectTile", "T-LEFT");
      (el.clickTile as (i: string, e: object) => void).call(el, "T-RIGHT", { shiftKey: false, metaKey: true, ctrlKey: false });
      press("T-GAP");
      expect(picked()).toEqual([]);
      expect(el.selectedTileId).toBe("T-GAP");
      expect(gesture()!.group).toBeUndefined();
      call("endGesture");
    });

    it("lets a finger drag a picked tile, and not one outside the pick", () => {
      const { el, call, press, gesture } = dragger("T-LEFT");
      (el.clickTile as (i: string, e: object) => void).call(el, "T-RIGHT", { shiftKey: false, metaKey: true, ctrlKey: false });
      press("T-BOTTOM", "touch");
      expect(gesture()).toBeUndefined();
      press("T-LEFT", "touch");
      expect(gesture()!.group?.map((m) => m.id)).toEqual(["T-LEFT", "T-RIGHT"]);
      call("endGesture");
      // A picked tile no longer leaves a finger to scroll.
      expect(sheet()).not.toMatch(/\.pe-tile\.sel\.multi\s*\{[^}]*touch-action/);
    });

    it("moves every picked tile by the grabbed tile's delta, with a ghost for each, in one undo step", () => {
      const { el, body, call, press, aim, rows, picked, draft } = dragger();
      call("selectAll");
      press("T-LEFT");
      // No delta yet: the same place, no ghosts.
      expect(aim({ col: 0, row: 0 }).outcome!.kind).toBe("same");
      const g = aim({ col: 0, row: 2 });
      expect(g.outcome!.kind).toBe("move");
      g.left = 0;
      g.top = 40;
      const text = body();
      expect(text.match(/class="pe-ghost ok"/g)).toHaveLength(4);
      for (const id of ["T-LEFT", "T-RIGHT", "T-BOTTOM", "T-GAP"]) expect(text, id).toMatch(new RegExp(`class="pe-ghost ok" data-ghost-tile=${id} `));
      // Every picked tile follows the pointer by the same shift.
      const shifts = ["T-LEFT", "T-RIGHT", "T-BOTTOM", "T-GAP"].map((id) => {
        const button = stageTile(text, id);
        expect(button, id).toMatch(/class="pe-tile [^"]*\bmoving\b/);
        return /transform:translate\(([^)]*)\)/.exec(button)?.[1];
      });
      expect(shifts[0]).toBeDefined();
      expect(new Set(shifts).size).toBe(1);
      expect(draft().canUndo).toBe(false);
      call("onPointerUp", { pointerId: 7 });
      expect(rows()).toEqual({ "T-GAP": "0,8", "T-BOTTOM": "0,5", "T-RIGHT": "6,2", "T-LEFT": "0,2" });
      // The pick stays, the grabbed tile its primary; the click the drag ends
      // with is swallowed, so it does not collapse the pick.
      call("reconcileSelection");
      expect(picked()).toEqual(["T-LEFT", "T-RIGHT", "T-BOTTOM", "T-GAP"]);
      expect(el.selectedTileId).toBe("T-LEFT");
      expect(el.swallowTileClick).toBe(true);
      draft().undo();
      expect(rows()).toEqual({ "T-GAP": "0,6", "T-BOTTOM": "0,3", "T-RIGHT": "6,0", "T-LEFT": "0,0" });
      expect(draft().canUndo).toBe(false);
    });

    it("refuses a drop where a picked tile would land on one outside the pick, keeping the pick", () => {
      const { el, body, call, press, aim, picked, draft } = dragger("T-LEFT");
      (el.clickTile as (i: string, e: object) => void).call(el, "T-RIGHT", { shiftKey: false, metaKey: true, ctrlKey: false });
      press("T-RIGHT");
      // One row down puts Left on Bottom: nothing goes, and nothing swaps.
      const g = aim({ col: 6, row: 1 });
      expect(g.outcome!.kind).toBe("none");
      const text = body();
      expect(text.match(/class="pe-ghost no"/g)).toHaveLength(2);
      expect(text).not.toContain("pe-ghost swap");
      const before = draft().document;
      call("onPointerUp", { pointerId: 7 });
      expect(draft().document).toBe(before);
      expect(picked()).toEqual(["T-LEFT", "T-RIGHT"]);
      expect(el.selectedTileId).toBe("T-RIGHT");
    });
  });

  it("offers Select all tiles in the ··· menu while the page has two tiles or more", () => {
    const { el, whole } = picker();
    el.topMenuOpen = true;
    expect(whole()).toMatch(/<button class="row pe-select-all" role="menuitem" \?disabled=false[^>]*>Select all tiles<\/button>/);
    el.selectedPageId = "P-YARD";
    expect(whole()).toMatch(/<button class="row pe-select-all" role="menuitem" \?disabled=true/);
  });

  it("drops a picked tile that went away", () => {
    const { el, click, call, picked } = picker("T-LEFT");
    click("T-BOTTOM", { metaKey: true });
    click("T-GAP", { metaKey: true });
    call("deleteTile", "T-GAP");
    call("reconcileSelection");
    expect(picked()).toEqual(["T-LEFT", "T-BOTTOM"]);
    expect(el.selectedTileId).toBe("T-BOTTOM");
  });
});

describe("the stacked layout", () => {
  it("sticks no column, so the inspector never slides over the stage", () => {
    const css = sheet();
    const stacked = rule(css, ".layout.pe-layout.cols-1 > .column.canvas, .layout.pe-layout.cols-1 > .column.inspector");
    expect(stacked).toMatch(/position:\s*static/);
    expect(stacked).toMatch(/max-height:\s*none/);
    // Beside the watch nothing sticks either: each part scrolls in its own box.
    // (Its edge fades, ::before and ::after, still stick inside its box.)
    expect(css).not.toMatch(/\.column\.inspector\s*\{[^}]*position:\s*sticky/);
    expect(editor().body()).toContain(`<div class="layout pe-layout pe-wide"`);
    // Wide, two columns with no gutter to drag.
    expect(rule(css, ".layout.pe-layout.pe-wide")).toMatch(/grid-template-columns:\s*minmax\(0, 1fr\) clamp\(/);
  });
});

describe("the canvas head", () => {
  it("reads watch / facts: the open watch's name as words, no watch chips, the page's name in the picker over it", () => {
    const { body } = editor();
    const text = body();
    // The head ends where the stage starts: no page strip between them.
    const stage = text.indexOf(`<div class="stage-area`);
    expect(stage).toBeGreaterThan(text.indexOf(`<div class="cv-head">`));
    expect(text).not.toContain("pe-pstrip");
    const head = text.slice(text.indexOf(`<div class="cv-head">`), stage);
    expect(head).not.toContain("tb-name-input");
    expect(head).not.toContain("doc-chip");
    expect(head).toContain(`<span class="cv-shape pe-watch-crumb">Jesse's Watch</span>`);
    expect(head).not.toContain("Chen's Watch");
    expect(head).toContain(`4 tiles · 8 rows · ${REFERENCE_CASE.label}`);
    const parts = ["pe-watch-crumb", "4 tiles · 8 rows"].map((p) => head.indexOf(p));
    expect([...parts].sort((a, b) => a - b)).toEqual(parts);
    expect(head).toContain(`aria-label="Undo"`);
    expect(head).toContain(`aria-label="Redo"`);
  });

  it("offers Duplicate and Delete for the selected tile only, and Duplicate only where the copy may go", () => {
    const head = (text: string) => text.slice(text.indexOf(`<div class="cv-head">`), text.indexOf(`<div class="stage-area`));
    const none = head(editor().body());
    expect(none).toContain(`?disabled=true title=Select a tile to duplicate it.`);
    expect(none).toMatch(/<button class="cv-act icon danger" \?disabled=true/);
    // A spacer may repeat on a page: it copies.
    const gap = head(editor("T-GAP").body());
    expect(gap).toContain(`?disabled=false title=Duplicate the selected tile`);
    expect(gap).toMatch(/<button class="cv-act icon danger" \?disabled=false/);
    // A page holds one tile per light: a second one has nowhere to go.
    const light = head(editor("T-BOTTOM").body());
    expect(light).toContain(`?disabled=true title=This page already has a tile for that entity.`);
    expect(light).toContain(`title=Delete the selected tile (Delete or Backspace)`);
  });

  it("copies a spacer onto the page and selects the copy", () => {
    const { el } = editor("T-GAP");
    // Not in a document: there is no focused field to let go of.
    el.leaveTile = () => undefined;
    (el.duplicateTile as () => void).call(el);
    const draft = (el as unknown as { draft: { document: WatchPagesDocument } }).draft;
    const items = (draft.document.pages as { id: string; items: { id: string; entityId: string; gridRow: number }[] }[])[0]!.items;
    expect(items).toHaveLength(5);
    const copy = items[4]!;
    expect(copy.id).not.toBe("T-GAP");
    expect(copy.entityId).toMatch(/^spacer\./);
    expect(copy.entityId).not.toBe(items[0]!.entityId);
    expect(el.selectedTileId).toBe(copy.id);
  });
});

/** The state chips in a strip's markup, in order: each one's word and
 * whether it is the kept one. */
function stateChips(strip: string): { word: string; on: boolean }[] {
  return [...strip.matchAll(/<button type="button" class="pe-state-chip (on)?"[^>]*>([^<]*)/g)].map((m) => ({ word: m[2]!, on: m[1] !== undefined }));
}

describe("the Live strip", () => {
  const stripOf = (text: string): string => text.slice(text.indexOf(`<div class="values-foot">`));

  it("names the selected tile and lays out its entity's states, or asks for a tile", () => {
    expect(editor().body()).toContain("Select a tile to try its states here.");
    const strip = stripOf(editor("T-RIGHT").body());
    expect(strip).toContain(`<div class="vchip vpill`);
    expect(strip).toContain(`<b>Right</b>`);
    // A light's states, every one a chip in a row, none kept.
    expect(stateChips(strip)).toEqual(["on", "off", "unavailable", "unknown"].map((word) => ({ word, on: false })));
    expect(strip).not.toContain("<select");
    // Home Assistant's state now is marked.
    expect(strip).toMatch(/title=Home Assistant's state now[^>]*>on<i class="pe-state-live"/);
    expect(strip).toContain(`<span class="live-reset-slot"`);
    // No Live, All on or Testing word, and no button to switch them.
    for (const gone of ["vb-live", "vb-head", "All on", "Show live", "Show all on", "Back to live", "Testing"]) expect(strip, gone).not.toContain(gone);
    // A spacer has no entity to try a state on.
    expect(stripOf(editor("T-GAP").body())).toContain(`<span class="val">No entity</span>`);
  });

  it("previews a hovered state, keeps a clicked one, never in Home Assistant's states, and leaves Live preview alone", () => {
    const { el, body } = editor("T-RIGHT");
    el.liveStates = false;
    const setTestValue = (id: string, value: string | undefined) => (el.setTestValue as (i: string, v: string | undefined) => void).call(el, id, value);
    const previewStates = () => (el.previewStates as () => Record<string, { state: string }>).call(el);
    const testedIds = () => (el.testedIds as () => ReadonlySet<string> | undefined).call(el);
    const strip = (): string => stripOf(body());
    expect(strip()).toContain(`class="vchip vpill ctl pe-states "`);
    expect(testedIds()).toBeUndefined();

    setTestValue("light.right", "off");
    const after = strip();
    expect(stateChips(after).filter((c) => c.on).map((c) => c.word)).toEqual(["off"]);
    expect(after).toContain(`class="vchip vpill ctl pe-states testing"`);
    expect(after).toContain(`<button type="button" class="live-reset" title="Back to Home Assistant's state"`);
    expect(el.liveStates).toBe(false);
    expect(previewStates()["light.right"]!.state).toBe("off");
    expect([...testedIds()!]).toEqual(["light.right"]);
    expect((el.hass as HassLike).states["light.right"]!.state).toBe("on");

    // The chip under the pointer draws over the kept one, and goes with it.
    el.hoverState = { entityId: "light.right", state: "unavailable" };
    expect(previewStates()["light.right"]!.state).toBe("unavailable");
    expect((el.testStates as Map<string, string>).get("light.right")).toBe("off");
    el.hoverState = undefined;
    expect(previewStates()["light.right"]!.state).toBe("off");

    setTestValue("light.right", undefined);
    expect((el.testStates as Map<string, string>).size).toBe(0);
    expect(previewStates()).toBe((el.hass as HassLike).states);
    expect(strip()).not.toContain(`class="live-reset"`);
    expect(el.liveStates).toBe(false);
  });

  it("keeps Home Assistant's own state as a test only while Live preview is off, where it would draw lit", () => {
    const { el } = editor("T-RIGHT");
    const setTestValue = (id: string, value: string | undefined) => (el.setTestValue as (i: string, v: string | undefined) => void).call(el, id, value);
    el.liveStates = true;
    setTestValue("light.right", "on");
    expect((el.testStates as Map<string, string>).size).toBe(0);
    el.liveStates = false;
    setTestValue("light.right", "on");
    expect((el.testStates as Map<string, string>).get("light.right")).toBe("on");
  });
});

describe("the Live preview switch", () => {
  const tools = (text: string): string => text.slice(text.indexOf(`<div class="stage-tools"`), text.indexOf(`<div class="pe-stage-body">`));

  it("is a switch over the stage with an instant hint, off by default, saying what off draws", () => {
    const { el, body } = editor();
    el.liveStates = false;
    const off = tools(body());
    expect(off).toContain(`<label class="pe-switch pe-live pe-tip"`);
    expect(off).toMatch(/data-tip=Live preview: off\.[^>]*everything active/);
    expect(off).toContain(`<input type="checkbox" role="switch"`);
    expect(off).toContain("Live preview</span>");
    expect(off).not.toContain("pe-live-dot");
    expect(off).not.toContain(`class="tb pe-live`);
    el.liveStates = true;
    expect(tools(body())).toMatch(/data-tip=Live preview: on\. The tiles are drawn with Home Assistant's real states/);
  });

  it("lets its hint hang below the tool strip", () => {
    const css = sheet();
    expect(rule(css, ".pe-stage-area > .stage-tools")).toContain("overflow: visible");
    expect(css).toMatch(/\.pe-state-chips\s*\{[^}]*flex-wrap: wrap/);
    expect(css).toMatch(/button\.pe-state-chip\.on\s*\{[^}]*var\(--wa-testing\) 18%/);
  });
});

describe("the zoom", () => {
  it("steps through 100% to 200%, fits at 150% or 125% narrow, and is remembered", () => {
    expect(STAGE_ZOOM_KEY).toBe("wrist-assistant-panel.pages.zoom.v1");
    expect(stageFitZoom(false)).toBe(1.5);
    expect(stageFitZoom(true)).toBe(1.25);
    expect(stageZoomIn(1.5)).toBe(2);
    expect(stageZoomIn(2)).toBe(2);
    expect(stageZoomOut(1.5)).toBe(1.25);
    expect(stageZoomOut(1)).toBe(1);
    expect(stageZoomIn(1.3)).toBe(1.5);
    expect([1, 1.25, 1.5, 2].map(stageZoomLabel)).toEqual(["100%", "125%", "150%", "200%"]);
    const store = new Map<string, string>();
    const storage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => { store.set(k, v); } };
    expect(loadStageZoom(storage)).toBeUndefined();
    saveStageZoom(2, storage);
    expect(store.get(STAGE_ZOOM_KEY)).toBe("2");
    expect(loadStageZoom(storage)).toBe(2);
    saveStageZoom(undefined, storage);
    expect(loadStageZoom(storage)).toBeUndefined();
    store.set(STAGE_ZOOM_KEY, "3");
    expect(loadStageZoom(storage)).toBeUndefined();
  });

  it("changes the stage's scale from the strip's buttons, and Fit goes back", () => {
    const { el, body } = editor();
    const width = (scale: number) => `width:${REFERENCE_CASE.screen.width * scale}px;`;
    let text = body();
    expect(text).toContain(`aria-label=Zoom 150%. Back to fit`);
    expect(text).toContain(">150%</button>");
    expect(text).toContain(width(1.5));
    const setZoom = el.setZoom as (scale: number | undefined) => void;
    setZoom.call(el, stageZoomIn(1.5));
    expect(el.zoom).toBe(2);
    text = body();
    expect(text).toContain(">200%</button>");
    expect(text).toContain(width(2));
    expect(text).toContain(`<button class="tb icon pe-zoom-in" ?disabled=true`);
    expect(text).toContain(`<button class="tb icon pe-zoom-out" ?disabled=false`);
    setZoom.call(el, undefined);
    expect(el.zoom).toBeUndefined();
    expect(body()).toContain(">150%</button>");
  });
});

describe("the pickers' HTTP actions", () => {
  const CATALOG = readWatchCatalog({ httpActions: [
    { id: "4F7A2C1E-9B3D-4E5F-8A6B-1C2D3E4F5A6B", name: "Open Gate" },
    { id: "6A0B3C2D-1E4F-4A5B-9C8D-7E6F5A4B3C2D", name: "Outdoor Temp", hasReply: true },
  ] }, { revision: 2 });
  const PORCH = "A1B2C3D4-0000-4000-8000-0000000000A1";

  it("lead with the home's library once it is read, and fall back to the catalog alone", async () => {
    const { el } = editor();
    el.catalog = CATALOG;
    const picker = () => el.pickerCatalog as WatchCatalog | undefined;
    expect(picker()).toBe(CATALOG);
    let answer: () => Promise<unknown> = async () => ({
      revision: 3,
      document: { actions: [{ id: PORCH, name: "Porch Temp", url: "x" }, { id: "4f7a2c1e-9b3d-4e5f-8a6b-1c2d3e4f5a6b", name: "Gate", url: "" }] },
    });
    el.hass = { user: { is_admin: true }, states: {}, connection: { sendMessagePromise: (m: { type: string }) => (m.type === "wrist_assistant/http_actions/get" ? answer() : Promise.reject(new Error("no"))) } } as unknown as HassLike;
    await (el.loadHttpLibrary as () => Promise<void>).call(el);
    expect(picker()!.httpActions.map((a) => [a.name, a.source, a.needsSetup])).toEqual([
      ["Porch Temp", "home", false], ["Gate", "home", true], ["Outdoor Temp", "iphone", false],
    ]);
    // The same object while nothing changed.
    expect(picker()).toBe(picker());
    // An integration older than the library: the catalog alone again.
    answer = () => Promise.reject(Object.assign(new Error("Unknown command."), { code: "unknown_command" }));
    await (el.loadHttpLibrary as () => Promise<void>).call(el);
    expect(picker()).toBe(CATALOG);
  });
});


describe("dragging a tile's own parts (Arrangement, Free)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /** Big, a lamp laid out centred (6 by 4), so Free can place its parts;
   * Strip, a lamp 3 rows high, laid out in a row, so it cannot. */
  const ROOM = {
    schemaVersion: 1,
    pages: [{
      id: "P-ROOM", name: "Room", items: [
        { id: "T-BIG", entityId: "light.big", customLabel: "Big", gridRow: 0, gridCol: 0, colSpan: 6, rowSpan: 4 },
        { id: "T-STRIP", entityId: "light.strip", customLabel: "Strip", gridRow: 4, gridCol: 0, colSpan: 6, rowSpan: 3 },
      ],
    }],
  } as unknown as WatchPagesDocument;
  const STATES = {
    "light.big": { entity_id: "light.big", state: "on", attributes: { brightness: 200 } },
    "light.strip": { entity_id: "light.strip", state: "on", attributes: { brightness: 200 } },
  };
  type Arr = { v: 1; parts: Record<string, Record<string, unknown>> } | undefined;
  type PartMove = { kind: string; part?: string; started: boolean; width?: number; height?: number; arrange?: Arr };

  /** The editor on Room with `selected` picked, Free picked on it when
   * `free`, drawn once, with no pointer to capture. */
  function stage(selected: string, free = true) {
    const made = editor(selected, ROOM, STATES);
    const { el } = made;
    const { Element } = stubBrowser(el);
    el.capture = () => undefined;
    const ui = el.uiState as Map<string, unknown>;
    if (free) setArrangeFreePicked(ui, selected, true);
    made.body();
    const screen = nodeOf(Element, "pe-screen");
    const tileOf = (id: string) => ((made.draft().document.pages as { items: (WatchPageTile & { id: string })[] }[])[0]!.items.find((t) => t.id === id))!;
    const press = (part: string, tileId = selected, mods: Record<string, boolean> = {}) => {
      let stopped = false;
      made.call("onPartPointerDown", {
        button: 0, isPrimary: true, metaKey: false, ctrlKey: false, shiftKey: false, ...mods, pointerType: "mouse", pointerId: 7, clientX: 100, clientY: 100,
        currentTarget: null, stopPropagation: () => { stopped = true; },
      }, tileId, part, el.stageArrange);
      return stopped;
    };
    const pressTile = (tileId = selected) => made.call("onTilePointerDown", {
      button: 0, isPrimary: true, metaKey: false, ctrlKey: false, shiftKey: false, pointerType: "mouse", pointerId: 7, clientX: 100, clientY: 100,
      currentTarget: { getBoundingClientRect: () => ({ left: 0, top: 0 }) },
    }, tileId);
    const move = (dx: number, dy: number) => made.call("onPointerMove", { pointerId: 7, clientX: 100 + dx, clientY: 100 + dy, preventDefault: () => undefined });
    const up = () => made.call("onPointerUp", { pointerId: 7 });
    const key = (name: string, mods: Record<string, boolean> = {}) => {
      const k = keyEvent(el, name, screen, mods);
      made.call("onKeyDown", k.event);
      return k.prevented();
    };
    const click = (tileId = selected) => made.call("takePressedPart", tileId, { shiftKey: false, metaKey: false, ctrlKey: false });
    return { ...made, ui, tileOf, press, pressTile, move, up, key, click, gesture: () => el.gesture as PartMove | undefined };
  }

  it("outlines the picked part of the selected Free tile, and boxes its other parts to pick", () => {
    const { body } = stage("T-BIG");
    const big = stageTile(body(), "T-BIG");
    expect(big).toMatch(/<span class="pe-part on [^"]*" data-part=icon /);
    expect(big).toMatch(/<span class="pe-part  [^"]*" data-part=name /);
    expect(big).toMatch(/<span class="pe-part  [^"]*" data-part=state /);
    expect(big).toContain("Drag to move the icon. Arrow keys nudge it, Escape lets it go.");
    expect(sheet()).toMatch(/\.pe-part\.on\s*\{[^}]*outline: 1px solid var\(--pe-mark\)/);
  });

  it("draws no parts with Free off, on a tile Free cannot place, or with several tiles picked", () => {
    expect(stageTile(stage("T-BIG", false).body(), "T-BIG")).not.toContain("pe-part");
    const strip = stage("T-STRIP");
    expect(stageTile(strip.body(), "T-STRIP")).not.toContain("pe-part");
    expect(strip.el.stageArrange).toBeUndefined();
    const several = stage("T-BIG");
    (several.el.clickTile as (i: string, e: object) => void).call(several.el, "T-STRIP", { shiftKey: false, metaKey: true, ctrlKey: false });
    expect(several.body()).not.toContain("pe-part");
  });

  it("drags the picked part by shares of the tile, live, and writes dx and dy once, clamped, as one undo step", () => {
    const { el, body, press, move, up, gesture, tileOf, draft } = stage("T-BIG");
    // A press on the picked part is the part's, not the tile's.
    expect(press("icon")).toBe(true);
    const g = gesture()!;
    expect(g.kind).toBe("part");
    expect(g.part).toBe("icon");
    const before = draft().document;
    move(13, -7);
    const across = Math.round((13 / g.width!) * 1000) / 1000;
    const down = Math.round((-7 / g.height!) * 1000) / 1000;
    expect(gesture()!.arrange).toEqual({ v: 1, parts: { icon: { dx: across, dy: down } } });
    // Drawn where the pointer puts it, nothing written yet.
    expect(draft().document).toBe(before);
    expect(body()).toMatch(/class="pe-part on dragging" data-part=icon /);
    // Far past the tile: half the tile at most.
    move(5000, -5000);
    expect(gesture()!.arrange).toEqual({ v: 1, parts: { icon: { dx: 0.5, dy: -0.5 } } });
    move(13, -7);
    up();
    expect(el.gesture).toBeUndefined();
    expect(tileOf("T-BIG").arrange).toEqual({ v: 1, parts: { icon: { dx: across, dy: down } } });
    // The tile did not move.
    expect(tileOf("T-BIG")).toMatchObject({ gridRow: 0, gridCol: 0 });
    draft().undo();
    expect(Object.hasOwn(tileOf("T-BIG"), "arrange")).toBe(false);
    expect(draft().canUndo).toBe(false);
  });

  it("draws the parts on the inspector head's larger tile too, and drags them by shares of that tile", () => {
    const { el, body, move, up, tileOf } = stage("T-BIG");
    body();
    // The inspector is stubbed here: the head's live tile is drawn on its own.
    const page = (el.currentPage as () => WatchPage).call(el);
    const headTile = flat((el.renderTileHeadPicture as (p: WatchPage, t: WatchPageTile) => unknown).call(el, page, tileOf("T-BIG")));
    expect(headTile).toContain(`class="pe-head-tile arr"`);
    expect(headTile).toMatch(/<span class="pe-part on [^"]*" data-part=icon /);
    const head = el.headArrange as { scale: number; stage: { size: { width: number; height: number } } };
    const onStage = el.stageArrange as { scale: number };
    expect(head.scale).toBeGreaterThan(onStage.scale);
    (el.onPartPointerDown as (...a: unknown[]) => void).call(el, {
      button: 0, isPrimary: true, metaKey: false, ctrlKey: false, shiftKey: false, pointerType: "mouse", pointerId: 7, clientX: 100, clientY: 100,
      currentTarget: null, stopPropagation: () => undefined,
    }, "T-BIG", "icon", head);
    const g = el.gesture as PartMove;
    expect(g.width).toBeCloseTo(head.stage.size.width * head.scale, 5);
    move(20, 0);
    up();
    expect(tileOf("T-BIG").arrange).toEqual({ v: 1, parts: { icon: { dx: Math.round((20 / g.width!) * 1000) / 1000 } } });
  });

  it("keeps a part's spot when it is dragged, and a press with no travel writes nothing", () => {
    const made = editor("T-BIG", {
      ...ROOM,
      pages: [{ ...(ROOM.pages as WatchPage[])[0]!, items: (ROOM.pages as { items: WatchPageTile[] }[])[0]!.items.map((t) => t.id === "T-BIG" ? { ...t, arrange: { v: 1, parts: { name: { spot: "bl" } } } } : t) }],
    } as unknown as WatchPagesDocument, STATES);
    stubBrowser(made.el);
    made.el.capture = () => undefined;
    setArrangePickedPart(made.el.uiState as Map<string, unknown>, "T-BIG", "name");
    made.body();
    const ev = { button: 0, isPrimary: true, metaKey: false, ctrlKey: false, shiftKey: false, pointerId: 7, clientX: 50, clientY: 50, currentTarget: null, stopPropagation: () => undefined };
    made.call("onPartPointerDown", ev, "T-BIG", "name", made.el.stageArrange);
    const before = made.draft().document;
    made.call("onPointerUp", { pointerId: 7 });
    expect(made.draft().document).toBe(before);
    made.call("onPartPointerDown", ev, "T-BIG", "name", made.el.stageArrange);
    made.call("onPointerMove", { pointerId: 7, clientX: 50, clientY: 90, preventDefault: () => undefined });
    made.call("onPointerUp", { pointerId: 7 });
    const arrange = ((made.draft().document.pages as { items: WatchPageTile[] }[])[0]!.items.find((t) => t.id === "T-BIG")!.arrange as Arr)!;
    expect(arrange.parts.name!.spot).toBe("bl");
    expect(arrange.parts.name!.dy).toBeGreaterThan(0);
  });

  it("picks a part with a click on it, in the card's view state too", () => {
    const { ui, press, click, gesture, body } = stage("T-BIG");
    // Another part's press is the tile's: no part drag, and its click picks it.
    expect(press("state")).toBe(false);
    expect(gesture()).toBeUndefined();
    expect(click()).toBe(true);
    expect(arrangePickedPart(ui, "T-BIG")).toBe("state");
    expect(stageTile(body(), "T-BIG")).toMatch(/<span class="pe-part on [^"]*" data-part=state /);
    // A click with no press on a part picks nothing, and a press that became
    // a drag of the tile picks nothing either.
    expect(click()).toBe(false);
    press("name");
    expect(click("T-STRIP")).toBe(false);
    expect(arrangePickedPart(ui, "T-BIG")).toBe("state");
  });

  it("nudges the picked part 1% a key, 5% with Shift, one undo step each, and Escape lets it go so the arrows move the tile", () => {
    const { el, ui, key, tileOf, draft, body } = stage("T-BIG");
    expect(key("ArrowRight")).toBe(true);
    expect(tileOf("T-BIG").arrange).toEqual({ v: 1, parts: { icon: { dx: 0.01 } } });
    expect(key("ArrowDown", { shiftKey: true })).toBe(true);
    expect(tileOf("T-BIG").arrange).toEqual({ v: 1, parts: { icon: { dx: 0.01, dy: 0.05 } } });
    expect(tileOf("T-BIG")).toMatchObject({ gridRow: 0, gridCol: 0 });
    draft().undo();
    expect(tileOf("T-BIG").arrange).toEqual({ v: 1, parts: { icon: { dx: 0.01 } } });
    // Escape lets the part go, and the tile stays selected.
    expect(key("Escape")).toBe(true);
    expect(arrangePickedPart(ui, "T-BIG")).toBeUndefined();
    expect(el.selectedTileId).toBe("T-BIG");
    body();
    expect(stageTile(body(), "T-BIG")).not.toContain("pe-part on");
    key("ArrowRight");
    expect(tileOf("T-BIG").arrange).toEqual({ v: 1, parts: { icon: { dx: 0.01 } } });
    expect(tileOf("T-BIG").gridCol).toBe(1);
    // A second Escape lets the tile go.
    key("Escape");
    expect(el.selectedTileId).toBeUndefined();
  });

  it("moves the tile as before with no part picked, with Free off, and on a tile Free cannot place", () => {
    const loose = stage("T-BIG");
    setArrangePickedPart(loose.ui, "T-BIG", undefined);
    loose.body();
    expect(loose.press("icon")).toBe(false);
    expect(loose.gesture()).toBeUndefined();
    loose.pressTile();
    expect(loose.gesture()!.kind).toBe("move");
    loose.call("endGesture");

    const off = stage("T-BIG", false);
    off.pressTile();
    expect(off.gesture()!.kind).toBe("move");
    off.call("endGesture");
    off.key("ArrowRight");
    expect(off.tileOf("T-BIG").gridCol).toBe(1);
    expect(Object.hasOwn(off.tileOf("T-BIG"), "arrange")).toBe(false);

    const strip = stage("T-STRIP");
    expect(strip.press("icon")).toBe(false);
    expect(strip.gesture()).toBeUndefined();
    strip.key("ArrowRight");
    expect(Object.hasOwn(strip.tileOf("T-STRIP"), "arrange")).toBe(false);
    expect(strip.tileOf("T-STRIP").gridCol).toBe(1);
  });
});
