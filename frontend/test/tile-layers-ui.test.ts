// A page tile's layers in the page editor, without a DOM: the words the
// rows and cards use, the rows under a tile with and without a design, the
// status line of a picked layer, the simple settings' "Changed in the X
// layer" rows, the layer host owning a base layer on its first change, a
// simple edit building the followers again and keeping an owned layer, the
// tap zone presets and the 40 pt rule, the preview drawing a design tile from
// its layers, and the design tiles' templates in the preview's requests.

import { afterEach, describe, expect, it, vi } from "vitest";

import type { HassEntityState } from "../src/ha-api.js";
import { REFERENCE_CASE } from "../src/renderer.js";
import { SymbolBrowser } from "../src/symbols.js";
import { watchTemplateRequests, watchTileDesignRender } from "../src/watch-pages/app-model.js";
import { type WatchPagesApplyOptions, WatchPagesDraft } from "../src/watch-pages/draft.js";
import { NO_ICONS, type TileSettingsHost, extendHost } from "../src/watch-pages/editor-host.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { renderWatchTileFace } from "../src/watch-pages/preview.js";
import {
  BASE_LAYER_IDS,
  type TileDesign,
  readTileDesign,
  syncTileDesigns,
  tileTemplateKey,
} from "../src/watch-pages/tile-design.js";
import { tileDesignNow, tileLayerContext, tileLayerEdits, tileLayerHost } from "../src/watch-pages/tile-layer-host.js";
import {
  LAYER_STATUS_TEXT,
  type TileLayersView,
  addLayerChoices,
  layersSummaryText,
  pickedZoneAction,
  renderTileLayerInspector,
  renderTileLayerRows,
  renderTileLayersCard,
  tileLayerCrumb,
  tileLayerRows,
  tileRowDesignNote,
  tooOldForLayers,
  watchSizeLabel,
  zoneActionLabel,
  zonePresetChoices,
} from "../src/watch-pages/tile-layers-ui.js";
import { type TileLayerLinks, renderTileSettings } from "../src/watch-pages/tile-settings.js";
import { editTile } from "../src/watch-pages/tile-settings-model.js";
import { flat } from "./library-editor-home.js";

const PAGE_ID = "7A1E0000-0000-4000-8000-000000000001";
const LIGHT = "7A1E0000-0000-4000-8000-0000000000A1";
const SWITCH = "7A1E0000-0000-4000-8000-0000000000A2";

const entity = (id: string, state: string, attributes: Record<string, unknown> = {}): HassEntityState =>
  ({ entity_id: id, state, attributes, last_changed: "", last_updated: "" });

const STATES: Record<string, HassEntityState> = {
  "light.office": entity("light.office", "on", { friendly_name: "Office", brightness: 209 }),
  "switch.porch": entity("switch.porch", "on", { friendly_name: "Porch" }),
};

const page = (): WatchPage => ({
  id: PAGE_ID, name: "Hall",
  items: [
    { id: LIGHT, entityId: "light.office", gridCol: 0, gridRow: 0, colSpan: 6, rowSpan: 4, color: "#F2AE4E" },
    { id: SWITCH, entityId: "switch.porch", gridCol: 6, gridRow: 0, colSpan: 6, rowSpan: 6, color: "#34C759" },
  ],
});

/** A tile settings host over a draft, whose apply builds the base layers of
 * a simple edit again as the page editor's `edit()` does. */
function draftHost(tileId = LIGHT, first: WatchPage = page()) {
  const draft = new WatchPagesDraft({ schemaVersion: 1, pages: [first] }, 1);
  const pageNow = () => (draft.document.pages as WatchPage[])[0]!;
  const uiState = new Map<string, unknown>();
  const base = {
    hass: { states: STATES },
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    get document() { return draft.document; },
    pageId: PAGE_ID,
    get page() { return pageNow(); },
    otherPages: [],
    catalog: undefined,
    templateRenders: new Map(),
    busy: false,
    uiState,
    apply: (next: WatchPagesDocument, options?: WatchPagesApplyOptions) =>
      draft.apply(syncTileDesigns(draft.document, next, { states: STATES, icons: NO_ICONS }), options),
    endCoalesce: () => draft.endCoalesce(),
    selectTile: () => undefined,
    requestUpdate: () => undefined,
    tileId,
    get tile() { return ((pageNow().items as WatchPageTile[] | undefined) ?? []).find((t) => t.id === tileId) ?? ({} as WatchPageTile); },
  } as unknown as TileSettingsHost;
  return { draft, host: base, tile: () => base.tile };
}

function view(host: TileSettingsHost, selected?: string): TileLayersView & { picked: (string | undefined)[] } {
  const picked: (string | undefined)[] = [];
  return { host, selected, pick: (id) => picked.push(id), off: false, picked };
}

describe("words", () => {
  it("sums a tile's layers as the Layers card says it", () => {
    expect(layersSummaryText({ layers: 6, changed: 2, added: 2, zones: 2 })).toBe("6 layers: 2 changed, 2 added, 2 tap zones");
    expect(layersSummaryText({ layers: 1, changed: 0, added: 0, zones: 1 })).toBe("1 layer: 0 changed, 0 added, 1 tap zone");
  });

  it("has a status line for each kind of layer", () => {
    expect(LAYER_STATUS_TEXT.follows).toBe("Follows the tile's simple settings. Change anything here and this layer takes over.");
    expect(LAYER_STATUS_TEXT.changed).toBe("Changed here. The simple setting now points to this layer.");
    expect(LAYER_STATUS_TEXT.added).toBe("Added layer. The simple settings do not touch it.");
  });

  it("names a zone's action in the tile's words, a trigger with what it runs", () => {
    const tile = (page().items as WatchPageTile[])[1]!;
    expect(zoneActionLabel(tile, { action: "toggle" })).toBe("Toggle switch");
    expect(zoneActionLabel(tile, { action: "triggerEntity", triggerTarget: { entityId: "script.ring", mode: "run", friendlyName: "Ring Chen's phone" } }))
      .toMatch(/: Ring Chen's phone$/);
  });

  it("names the devices too old to draw a tile's layers", () => {
    expect(tooOldForLayers([{ name: "Chen Watch", version: "3.1.0" }, { name: "Jesse Watch", version: "3.2.0" }, { name: "New", version: null }])).toEqual(["Chen Watch"]);
    expect(watchSizeLabel(162)).toBe("40 mm");
  });

  it("keeps a zone's ask first when its action changes, and its target only while it stays a trigger", () => {
    const before = { action: "triggerEntity", triggerTarget: { entityId: "script.a", mode: "run" }, requiresConfirmation: true };
    expect(pickedZoneAction(before, "toggle")).toEqual({ action: "toggle", requiresConfirmation: true });
    expect(pickedZoneAction(before, "triggerEntity")).toEqual(before);
    expect(pickedZoneAction({ action: "none" }, "http:ABC")).toEqual({ action: "httpAction", httpActionId: "ABC" });
  });
});

describe("tap zone presets", () => {
  it("refuses a preset whose zones are under 40 pt on the smallest watch", () => {
    const medium = (page().items as WatchPageTile[])[0]!; // 6x4
    const on162 = zonePresetChoices(medium, 162);
    expect(on162.find((c) => c.preset === "leftRight")?.reason).toBe("Too small on a 40 mm watch");
    expect(on162.find((c) => c.preset === "whole")?.reason).toBeUndefined();
    const on208 = zonePresetChoices(medium, 208);
    expect(on208.find((c) => c.preset === "leftRight")?.reason).toBeUndefined();
    expect(on208.find((c) => c.preset === "topBottom")?.reason).toBe("Too small on a 46 mm watch");
    const tall = (page().items as WatchPageTile[])[1]!; // 6x6
    expect(zonePresetChoices(tall, 208).every((c) => c.reason === undefined)).toBe(true);
  });
});

describe("the rows under a tile", () => {
  it("lists a tile with no design by its base layers, all following, top first", () => {
    const { host } = draftHost();
    const design = tileLayerHost(host, () => undefined).config;
    const rows = tileLayerRows(host.tile, undefined, { v: 1, doc: design, owned: [], anchors: {}, zones: {} });
    expect(rows.layers.map((r) => r.title)).toEqual(["Name", "State", "Icon", "Glow"]);
    expect(rows.layers.every((r) => r.status === "follows")).toBe(true);
    expect(rows.layers[0]).toMatchObject({ up: false, down: true });
    expect(rows.zones).toEqual([]);
    expect(tileRowDesignNote(undefined, host.tile)).toBe("");
    const text = flat(renderTileLayerRows(view(host)));
    expect(text).toContain(`data-layer-row=${BASE_LAYER_IDS.name}`);
    expect(text).not.toContain("tl-dot");
    expect(text).not.toContain(`class="tl-added"`);
  });

  it("marks a changed layer with a dot, an added one with its tag, and lists tap zones after them", () => {
    const { host, tile } = draftHost(SWITCH);
    const edits = tileLayerEdits(host);
    expect(edits.doc((c) => {
      const name = c.elements.find((e) => e.payload.id === BASE_LAYER_IDS.name)!;
      if (name.kind === "text") name.payload.fontSize = 14;
    })).toBe(true);
    const added = edits.add("gauge");
    expect(added).not.toBe("");
    expect(edits.preset("leftRight")).toBe(true);
    const stored = readTileDesign(tile())!;
    expect(stored.owned).toEqual(["name"]);
    expect(tileRowDesignNote(stored, tile())).toBe("1 changed, 1 added");
    const rows = tileLayerRows(tile(), stored, stored);
    expect(rows.layers[0]).toMatchObject({ id: added, status: "added", kind: "gauge" });
    expect(rows.layers.find((r) => r.id === BASE_LAYER_IDS.name)?.status).toBe("changed");
    expect(rows.zones.map((z) => z.label)).toEqual(["Tap zone 1 · Toggle switch", "Tap zone 2 · None"]);
    const text = flat(renderTileLayerRows(view(host)));
    expect(text).toContain(`class="tl-dot"`);
    expect(text).toContain(`<span class="tl-added">added</span>`);
    expect(text.indexOf("data-zone-row")).toBeGreaterThan(text.lastIndexOf("data-layer-row"));
  });
});

describe("the picked layer", () => {
  it("starts with the status line: follows, changed with Reset layer, added with Delete", () => {
    const { host } = draftHost();
    const follows = flat(renderTileLayerInspector(view(host, BASE_LAYER_IDS.name), 208));
    expect(follows).toContain(LAYER_STATUS_TEXT.follows);
    expect(tileLayerCrumb(view(host, BASE_LAYER_IDS.name))).toMatchObject({ kind: "Text layer", name: "Name" });
    tileLayerEdits(host).doc((c) => {
      const el = c.elements.find((e) => e.payload.id === BASE_LAYER_IDS.state)!;
      el.payload.frame = { ...el.payload.frame, y: 0.5 };
    });
    const changed = flat(renderTileLayerInspector(view(host, BASE_LAYER_IDS.state), 208));
    expect(changed).toContain(LAYER_STATUS_TEXT.changed);
    expect(changed).toContain(">Reset layer</button>");
    const id = tileLayerEdits(host).add("text");
    const added = flat(renderTileLayerInspector(view(host, id), 208));
    expect(added).toContain(LAYER_STATUS_TEXT.added);
    expect(added).toContain(">Delete</button>");
    // A zone gets its own card, not the layer cards.
    tileLayerEdits(host).preset("leftRight");
    const zone = readTileDesign(host.tile)!.doc.elements.find((e) => e.kind === "tap")!.payload.id;
    const card = flat(renderTileLayerInspector(view(host, zone.toUpperCase()), 162));
    expect(card).toContain("<h4>Tap zone");
    expect(card).toMatch(/disabled=true title=Too small on a 40 mm watch/);
  });

  it("is gone once the layer is: the inspector falls back to the tile", () => {
    const { host } = draftHost();
    expect(renderTileLayerInspector(view(host, "NOT-A-LAYER"), 208)).toBeUndefined();
  });
});

describe("the layer host", () => {
  it("owns a base layer on its first change, in one undo step", () => {
    const { host, draft, tile } = draftHost();
    const lh = tileLayerHost(host, () => undefined);
    expect(lh.designBox).toEqual({ width: 100.5, height: 66 });
    expect(lh.tileValueKinds).toBe(true);
    expect(lh.resolve({ kind: { kind: "tileName" } })).toBe("Office");
    lh.update((c) => {
      const name = c.elements.find((e) => e.payload.id === BASE_LAYER_IDS.name)!;
      if (name.kind === "text") name.payload.fontWeight = "bold";
    });
    const design = readTileDesign(tile())!;
    expect(design.owned).toEqual(["name"]);
    expect(draft.canUndo).toBe(true);
    draft.undo();
    expect(readTileDesign(tile())).toBeUndefined();
  });

  it("rebuilds a following layer after a simple edit and keeps an owned one", () => {
    const { host, tile } = draftHost();
    tileLayerEdits(host).doc((c) => {
      const name = c.elements.find((e) => e.payload.id === BASE_LAYER_IDS.name)!;
      name.payload.frame = { x: 0.1, y: 0.6, width: 0.8, height: 0.3, rotationDegrees: 0 };
    });
    const frameOf = (d: TileDesign, id: string) => d.doc.elements.find((e) => e.payload.id === id)!.payload.frame;
    const before = readTileDesign(tile())!;
    // A simple edit: the tile goes from 6 to 12 columns.
    const next = structuredClone(host.document) as WatchPagesDocument;
    (((next.pages as WatchPage[])[0]!.items as WatchPageTile[])[0]!).colSpan = 12;
    host.apply(next);
    const after = readTileDesign(tile())!;
    expect(frameOf(after, BASE_LAYER_IDS.name)).toEqual(frameOf(before, BASE_LAYER_IDS.name));
    expect(frameOf(after, BASE_LAYER_IDS.state)).not.toEqual(frameOf(before, BASE_LAYER_IDS.state));
    expect(after.owned).toEqual(["name"]);
  });

  it("gives a layer back with Reset, and Reset all goes back to the plain tile", () => {
    const { host, tile } = draftHost();
    const edits = tileLayerEdits(host);
    edits.doc((c) => { c.elements.find((e) => e.payload.id === BASE_LAYER_IDS.name)!.payload.isHidden = true; });
    expect(readTileDesign(tile())?.owned).toEqual(["name"]);
    expect(edits.reset("name")).toBe(true);
    expect(readTileDesign(tile())).toBeUndefined();
    edits.add("shape");
    expect(readTileDesign(tile())).toBeDefined();
    expect(edits.resetAll()).toBe(true);
    expect(tile().design).toBeUndefined();
  });

  it("refuses a layer over the cap", () => {
    const { host, tile } = draftHost();
    const edits = tileLayerEdits(host);
    // The light's four base layers (the glow among them) leave room for four.
    for (let i = 0; i < 4; i++) expect(edits.add("text")).not.toBe("");
    expect(edits.add("text")).toBe("");
    const choices = addLayerChoices(tile(), readTileDesign(tile())!);
    expect(choices.find((c) => c.kind === "text")?.reason).toBe("A tile holds 8 layers at most.");
    expect(choices.find((c) => c.kind === "tap")?.reason).toBeUndefined();
    expect(choices.some((c) => c.kind === "chart")).toBe(false);
  });
});

describe("the simple settings", () => {
  // The settings ask the page what has focus, which Node does not have.
  afterEach(() => vi.unstubAllGlobals());
  it("show Changed in the Name layer in place of the Text rows once the Name layer is owned", () => {
    const { host } = draftHost();
    tileLayerEdits(host).doc((c) => {
      const name = c.elements.find((e) => e.payload.id === BASE_LAYER_IDS.name)!;
      if (name.kind === "text") name.payload.fontSize = 13;
    });
    const picked: string[] = [];
    const links: TileLayerLinks = {
      get design() { return readTileDesign(host.tile); },
      zones: 0,
      pickLayer: (role) => picked.push(role),
      reset: () => undefined,
      pickZones: () => undefined,
    };
    const withLinks = extendHost(host, { tileLayers: () => links });
    vi.stubGlobal("document", { activeElement: null });
    vi.stubGlobal("HTMLElement", class {});
    for (const section of ["text", "icon", "action"]) withLinks.uiState.set(`tile-settings:open:${section}`, true);
    const text = flat(renderTileSettings(withLinks, { sections: ["text", "icon"] }));
    expect(text).toContain(`data-taken=name`);
    expect(text).toContain(">Name</button> layer");
    expect(text).not.toContain(`data-taken=icon`);
    expect(text).toContain("Color fills the tile.");
  });

  it("show the split into tap zones in place of the single tap", () => {
    const { host } = draftHost(SWITCH);
    const links: TileLayerLinks = { design: undefined, zones: 2, pickLayer: () => undefined, reset: () => undefined, pickZones: () => undefined };
    const withLinks = extendHost(host, { tileLayers: () => links });
    vi.stubGlobal("document", { activeElement: null });
    vi.stubGlobal("HTMLElement", class {});
    withLinks.uiState.set("tile-settings:open:action", true);
    const text = flat(renderTileSettings(withLinks, { sections: ["action"] }));
    expect(text).toContain("Split into 2 tap zones");
    expect(text).not.toContain("<span>Single tap</span>\n      <select");
  });
});

describe("a layer row's template badge", () => {
  it("marks a layer whose value needs a template, and not the base layers", () => {
    const { host, tile } = draftHost();
    const edits = tileLayerEdits(host);
    const id = edits.add("text");
    edits.doc((c) => {
      const el = c.elements.find((e) => e.payload.id.toUpperCase() === id);
      if (el?.kind === "text") el.payload.value = { ...el.payload.value, kind: { kind: "jinja", value: "{{ relative_time(states.light.office.last_changed) }}" } };
    });
    const design = readTileDesign(tile())!;
    const rows = tileLayerRows(tile(), design, design);
    expect(rows.layers.find((r) => r.id === id)?.template).toBe(true);
    expect(rows.layers.filter((r) => r.role !== undefined).every((r) => !r.template)).toBe(true);
    expect(flat(renderTileLayerRows(view(host)))).toContain(">template</span>");
  });
});

describe("adding a tap zone", () => {
  it("splits a tile with no zones by the first preset that fits, never a free zone", () => {
    const { host, tile } = draftHost(SWITCH); // 6x6
    const choice = addLayerChoices(tile(), tileDesignNow(host), 208).find((c) => c.kind === "tap")!;
    expect(choice).toEqual({ kind: "tap", label: "Tap zone", preset: "leftRight" });
    expect(tileLayerEdits(host).preset(choice.preset!)).toBe(true);
    const zoned = readTileDesign(tile())!;
    expect(zoned.doc.elements.filter((e) => e.kind === "tap").map((e) => e.payload.frame.width)).toEqual([0.5, 0.5]);
    expect(addLayerChoices(tile(), zoned, 208).find((c) => c.kind === "tap")?.reason).toBe("Pick a tap zone to change how the tile is split.");
  });

  it("is refused on a tile too small for any split on the smallest watch", () => {
    const small: WatchPage = { ...page(), items: [{ id: LIGHT, entityId: "light.office", gridCol: 0, gridRow: 0, colSpan: 3, rowSpan: 2 }] };
    const { host, tile } = draftHost(LIGHT, small);
    const choice = addLayerChoices(tile(), tileDesignNow(host), 162).find((c) => c.kind === "tap")!;
    expect(choice.reason).toBe("Too small for tap zones on a 40 mm watch");
    expect(choice.preset).toBeUndefined();
  });
});

describe("a picture layer in a tile", () => {
  it("shows its own entity's picture with no picker and no Timestamp card", () => {
    const { host, tile } = draftHost();
    const edits = tileLayerEdits(host);
    const id = edits.add("image");
    edits.doc((c) => {
      const el = c.elements.find((e) => e.payload.id.toUpperCase() === id);
      if (el?.kind === "image") {
        el.payload.source = "entityPicture";
        el.payload.entity = { entityId: "light.office", displayName: "Office", domain: "light" };
      }
    });
    expect(readTileDesign(tile())!.doc.elements.some((e) => e.payload.id.toUpperCase() === id)).toBe(true);
    const text = flat(renderTileLayerInspector(view(host, id), 208));
    expect(text).toContain("The picture of the tile's own entity, Office.");
    expect(text).not.toContain("Adds the time the picture was fetched");
    expect(tileLayerHost(host, () => undefined).tileEntity).toEqual({ entityId: "light.office", displayName: "Office", domain: "light" });
  });
});

describe("the Layers card", () => {
  it("counts the layers, offers the kinds, meters the budget and names a device too old", () => {
    const { host } = draftHost();
    host.uiState.set("tile-layers:open:layers", true);
    const text = flat(renderTileLayersCard(view(host), { pickers: [{ name: "Chen Watch", version: "3.1.0" }], page: host.page }));
    expect(text).toContain("4 layers: 0 changed, 0 added, 0 tap zones");
    for (const kind of ["Text", "Icon", "Gauge", "Shape", "Picture", "Tap zone"]) expect(text).toContain(`<span>${kind}</span>`);
    expect(text).toContain("4 of 8");
    expect(text).toContain("0 of 100");
    expect(text).toContain("Chen Watch shows the plain tile until it updates to Wrist Assistant 3.2.");
    expect(text).toContain("Back to the plain tile.");
  });
});

describe("the preview", () => {
  it("draws a design tile's text from its layers, and an untouched tile as before", () => {
    const { host, tile } = draftHost();
    const input = { page: host.page, pages: [host.page], screen: REFERENCE_CASE.screen, states: STATES, oneLook: true };
    const plain = flat(renderWatchTileFace(tile(), { width: 100.5, height: 66 }, input, 15.25));
    expect(plain).not.toContain("ol-design");
    tileLayerEdits(host).doc((c) => {
      const name = c.elements.find((e) => e.payload.id === BASE_LAYER_IDS.name)!;
      if (name.kind === "text") name.payload.value = { kind: { kind: "literal", value: "Desk lamp" } };
    });
    const drawn = flat(renderWatchTileFace(tile(), { width: 100.5, height: 66 }, { ...input, page: host.page, pages: [host.page] }, 15.25));
    expect(drawn).toContain("ol-design");
    expect(drawn).toContain("Desk lamp");
  });

  it("draws a design that owns nothing and adds nothing exactly as the plain tile", () => {
    const { host, tile } = draftHost();
    const input = { page: host.page, pages: [host.page], screen: REFERENCE_CASE.screen, states: STATES, oneLook: true };
    const plain = flat(renderWatchTileFace(tile(), { width: 100.5, height: 66 }, input, 15.25));
    // Tap zones only: a design is saved, but it draws nothing of its own.
    tileLayerEdits(host).preset("leftRight");
    expect(readTileDesign(tile())).toBeDefined();
    const zoned = flat(renderWatchTileFace(tile(), { width: 100.5, height: 66 }, { ...input, page: host.page, pages: [host.page] }, 15.25));
    expect(zoned).toBe(plain);
  });

  it("moving one layer redraws only that layer: every other part stays the native tile's", () => {
    const { host, tile } = draftHost();
    const input = () => ({ page: host.page, pages: [host.page], screen: REFERENCE_CASE.screen, states: STATES, oneLook: true });
    const plain = flat(renderWatchTileFace(tile(), { width: 100.5, height: 66 }, input(), 15.25));
    expect(plain).toContain("ol-glyph");
    expect(plain).toContain("ol-state");
    const icon = tileDesignNow(host).doc.elements.find((e) => e.payload.id === BASE_LAYER_IDS.icon)!;
    expect(tileLayerEdits(host).frame(BASE_LAYER_IDS.icon, { ...icon.payload.frame, x: icon.payload.frame.x + 0.05 })).toBe(true);
    const drawn = flat(renderWatchTileFace(tile(), { width: 100.5, height: 66 }, input(), 15.25));
    // The native glyph is gone, the layer draws it instead; the native state
    // line (its pill and all) and the native name stay exactly as they were.
    expect(drawn).not.toContain("ol-glyph");
    expect(drawn).toContain("ol-design");
    const native = (html: string) => html.match(/<span class="ol-(state|text)[^]*?<\/span>\s*<\/span>/g) ?? [];
    expect(native(plain).length).toBeGreaterThan(0);
    expect(native(drawn)).toEqual(native(plain));
  });

  it("hides the owned state natively with its pill, and draws the State layer and its pill instead", () => {
    const { host, tile } = draftHost();
    const set = editTile(host.document, host.pageId, host.tileId, (t) => ({ ...t, stateValueLabelStyle: "Pill" }));
    host.apply(set);
    const input = () => ({ page: host.page, pages: [host.page], screen: REFERENCE_CASE.screen, states: STATES, oneLook: true });
    expect(flat(renderWatchTileFace(tile(), { width: 100.5, height: 66 }, input(), 15.25))).toContain("ol-state pill");
    const state = tileDesignNow(host).doc.elements.find((e) => e.payload.id === BASE_LAYER_IDS.state)!;
    tileLayerEdits(host).frame(BASE_LAYER_IDS.state, { ...state.payload.frame, y: state.payload.frame.y + 0.05 });
    expect(readTileDesign(tile())!.owned).toEqual(["state"]);
    const drawn = flat(renderWatchTileFace(tile(), { width: 100.5, height: 66 }, input(), 15.25));
    expect(drawn).not.toContain("ol-state");
    expect(drawn).toContain("ol-design");
    expect(drawn).toContain("ol-glyph");
  });

  it("asks for each design tile's template under its tile key, and reads its render back", () => {
    const { host, tile } = draftHost();
    const id = tileLayerEdits(host).add("text");
    tileLayerEdits(host).doc((c) => {
      const el = c.elements.find((e) => e.payload.id.toUpperCase() === id)!;
      if (el.kind === "text") el.payload.value = { kind: { kind: "entityAttribute", entityId: "light.office", displayName: "Office", domain: "light", attribute: "brightness" } };
    });
    const template = readTileDesign(tile())!.template!;
    expect(template).toBeDefined();
    const requests = watchTemplateRequests(host.page);
    expect(requests[tileTemplateKey(template)]).toBe(template);
    const renders = new Map([[tileTemplateKey(template), { text: template, result: { ok: true as const, value: "{\"e_1\":\"209\"}" } }]]);
    expect(watchTileDesignRender(renders, template)).toBe("{\"e_1\":\"209\"}");
    expect(watchTileDesignRender(renders, `${template} `)).toBeUndefined();
  });
});

describe("the context", () => {
  it("builds base layers from the real states, the page and every page", () => {
    const { host } = draftHost();
    const ctx = tileLayerContext(host);
    expect(ctx.states).toBe(STATES);
    expect(ctx.page).toBe(host.page);
    expect(ctx.pages).toHaveLength(1);
  });
});
