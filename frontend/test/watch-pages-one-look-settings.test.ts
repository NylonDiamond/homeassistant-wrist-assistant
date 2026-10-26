// The tile settings when every device showing the page draws One Look (the
// host's `oneLook`, from `oneLookForEvery`): the lines One Look changes, and
// the controls it does not draw greyed with their reason, never cleared.
// Each line copies what the app's One Look draws (app repo
// `WristAssistant Watch App/Views/OneLook/`, `OneLookKindTile` in
// `Views/Tiles/SimpleTileViews.swift`), with the switches in `OneLookChoices`
// as they stand. A host that says nothing keeps the old look's words.

import { describe, expect, it } from "vitest";

import { SymbolBrowser } from "../src/symbols.js";
import { WatchPagesDraft } from "../src/watch-pages/draft.js";
import { NO_ICONS, type TileSettingsHost } from "../src/watch-pages/editor-host.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import {
  ONE_LOOK_ANIMATE_REASON,
  ONE_LOOK_ARTWORK_NOTE,
  ONE_LOOK_CAMERA_PREVIEW_HINT,
  ONE_LOOK_DIM_LIGHT_NOTE,
  ONE_LOOK_DIM_OFF_REASON,
  ONE_LOOK_EXTRA_THIN_REASON,
  ONE_LOOK_RAINBOW_NOTE,
  ONE_LOOK_STATE_ICONS_NOTE,
  ONE_LOOK_TEXT_SHADOW_NOTE,
  ONE_LOOK_WEIGHT_NOTE,
  oneLookCardSubtitle,
  oneLookColorNote,
  oneLookSectionOff,
  oneLookShowsPicture,
  oneLookStateRowOff,
} from "../src/watch-pages/one-look-settings.js";
import { watchTileStateCards } from "../src/watch-pages/styling-model.js";
import { renderTileSettings, tileInspectorSections } from "../src/watch-pages/tile-settings.js";

// The views ask for the focused field (`document.activeElement`); Node has
// no document.
(globalThis as { document?: unknown }).document ??= { activeElement: null };
(globalThis as { HTMLElement?: unknown }).HTMLElement ??= class {};

/** A template's text with its values. */
function text(t: unknown): string {
  if (typeof t === "symbol" || t === null || t === undefined) return "";
  if (Array.isArray(t)) return t.map(text).join("");
  if (typeof t !== "object") return String(t);
  const r = t as { strings?: readonly string[]; values?: unknown[] };
  if (r.strings === undefined) return "";
  return r.strings.map((s, i) => s + (i < (r.values?.length ?? 0) ? text(r.values![i]) : "")).join("");
}

const PAGE_ID = "C3A0E000-0000-4000-8000-0000000000AA";
const TILE_ID = "C3A0E000-0000-4000-8000-000000000001";

const tile = (entityId: string, extra: Record<string, unknown> = {}): WatchPageTile => ({ id: TILE_ID, entityId, ...extra });

/** A tile host as the page editor builds one, with or without One Look. */
function tileHost(t: WatchPageTile, oneLook?: boolean): { host: TileSettingsHost; draft: WatchPagesDraft } {
  const draft = new WatchPagesDraft({ schemaVersion: 1, pages: [{ id: PAGE_ID, name: "Living", items: [t] }] }, 1);
  const pageNow = () => (draft.document.pages as WatchPage[])[0]!;
  const host = {
    hass: { states: {} },
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    get document() { return draft.document; },
    pageId: PAGE_ID,
    get page() { return pageNow(); },
    otherPages: [],
    catalog: undefined,
    cameraRefreshDefaults: { on: true, debounce: "5" },
    behavior: undefined,
    musicAssistant: undefined,
    cloudTTS: undefined,
    templateRenders: new Map(),
    deviceSiblings: () => ({ selects: [], switches: [], sensors: [], all: [] }),
    smartRuleId: undefined,
    busy: false,
    uiState: new Map<string, unknown>(),
    apply: (next: WatchPagesDocument) => draft.apply(next),
    endCoalesce: () => draft.endCoalesce(),
    selectTile: () => undefined,
    requestUpdate: () => undefined,
    tileId: TILE_ID,
    get tile() { return ((pageNow().items as WatchPageTile[] | undefined) ?? []).find((x) => x.id === TILE_ID) ?? ({} as WatchPageTile); },
    ...(oneLook === undefined ? {} : { oneLook }),
  } as unknown as TileSettingsHost;
  return { host, draft };
}

const drawn = (t: WatchPageTile, oneLook?: boolean): string => text(renderTileSettings(tileHost(t, oneLook).host));

/** The text from a greyed block to the reason after it. */
const greyedBefore = (all: string, reason: string): string => {
  const at = all.indexOf(reason);
  return all.slice(all.lastIndexOf("ts-plain ts-off", at), at);
};

describe("the old look stays as it was", () => {
  it("without One Look, and on a host that says nothing", () => {
    for (const oneLook of [undefined, false]) {
      const light = drawn(tile("light.desk", { color: "#RAINBOW" }), oneLook);
      expect(light).toContain("The watch cycles the tile through every color.");
      expect(light).toContain("The tile dims while it is off, or keeps its color.");
      expect(light).toContain("An icon or color per state. A state with none uses the tile's.");
      expect(light).toContain("Show brightness percentage on tile.");
      expect(light).not.toContain("ts-off");
      for (const line of [ONE_LOOK_RAINBOW_NOTE, ONE_LOOK_WEIGHT_NOTE, ONE_LOOK_TEXT_SHADOW_NOTE, ONE_LOOK_DIM_LIGHT_NOTE]) expect(light).not.toContain(line);
      expect(drawn(tile("switch.fan"), oneLook)).toContain("The tile dims while it is off, or keeps its color.");
      expect(tileInspectorSections(tileHost(tile("point_control.x"), oneLook).host)).not.toContain("state");
    }
  });

  it("keeps Icon size hidden with the status badge off", () => {
    const cards = watchTileStateCards(tile("media_player.tv", { showActivityStatus: false }));
    expect(cards.find((c) => c.id === "activity")!.rows.map((r) => r.key)).toEqual(["showActivityStatus"]);
  });
});

describe("Icon and color in One Look", () => {
  it("names the glow by one switch, Glow icon when on, in a group of its own", () => {
    const view = drawn(tile("light.desk", { color: "#FF9500" }), true);
    const labels = [...view.matchAll(/<span class="pc-label">([^<]+)<\/span>/g)].map((m) => m[1]);
    expect(view).toContain("Glow icon when on");
    for (const gone of ["When on", "Always", "Auto"]) expect(labels).not.toContain(gone);
    expect(view.match(/<div class="ts-group">/g)?.length).toBeGreaterThanOrEqual(5);
  });

  it("says the tile fills with its color, and a rainbow that does not cycle", () => {
    expect(drawn(tile("light.desk", { color: "#RAINBOW" }), true)).toContain(ONE_LOOK_RAINBOW_NOTE);
    expect(drawn(tile("light.desk", { color: "#RAINBOW" }), true)).not.toContain("cycles");
    expect(drawn(tile("light.desk", { color: "#FF9500" }), true)).toContain(oneLookColorNote("solid")!);
    expect(drawn(tile("light.desk", { color: "GRADIENT|#FF9500|#FF3B30" }), true)).toContain(oneLookColorNote("gradient")!);
    // With none stored the watch's pull colors the tile by its kind; the
    // iPhone draws it as stored, graphite.
    expect(drawn(tile("light.desk"), true)).toContain("No color: the watch fills the tile with its kind's color from the page's theme.");
    const onPhone = Object.create(tileHost(tile("light.desk"), true).host, { device: { value: "iphone" } }) as TileSettingsHost;
    expect(text(renderTileSettings(onPhone))).toContain("No color: the tile draws graphite, amber while a light is on or media plays.");
  });

  it("dims only a light, and greys Dim when off elsewhere without touching it", () => {
    const light = drawn(tile("light.desk"), true);
    expect(light).toContain(ONE_LOOK_DIM_LIGHT_NOTE);
    expect(light).not.toContain(ONE_LOOK_DIM_OFF_REASON);
    const { host, draft } = tileHost(tile("switch.fan", { dimWhenOff: false }), true);
    const before = draft.document;
    const sw = text(renderTileSettings(host));
    expect(greyedBefore(sw, ONE_LOOK_DIM_OFF_REASON)).toContain("When it is off");
    expect(sw).not.toContain("The tile dims while it is off, or keeps its color.");
    // Drawing greys; it never writes.
    expect(draft.document).toBe(before);
    expect(host.tile.dimWhenOff).toBe(false);
  });

  it("greys Animate while on, which One Look never plays", () => {
    const fan = drawn(tile("fan.ceiling", { activeIconAnimationEnabled: true }), true);
    expect(greyedBefore(fan, ONE_LOOK_ANIMATE_REASON)).toContain("Animate while on");
    expect(fan).not.toContain("Spins the icon while the fan runs.");
    expect(fan).not.toContain("Use the default");
  });

  it("words the icon size and the state icons for One Look", () => {
    const light = drawn(tile("light.desk"), true);
    expect(light).toMatch(/Leave empty for Auto, or pick 8 to \d+ pt\. The icon sits where it always did and shrinks if the state or name needs the room\./);
    expect(light).toContain(ONE_LOOK_STATE_ICONS_NOTE);
  });
});

describe("Text in One Look", () => {
  it("says the name stays on one line, and what weight and shadow do", () => {
    const light = drawn(tile("light.desk"), true);
    expect(light).toContain("Leave empty for Auto, sized to the tile, or pick 4 to 16 pt. The name stays on one line and shrinks if it is too long.");
    expect(light).toContain(ONE_LOOK_WEIGHT_NOTE);
    expect(light).toContain(ONE_LOOK_TEXT_SHADOW_NOTE);
  });
});

describe("State in One Look", () => {
  it("words each card for where One Look draws it", () => {
    const light = drawn(tile("light.desk"), true);
    expect(light).toContain("The brightness in the top left. Off says On instead. Pill puts it in a dark capsule.");
    expect(light).toContain("The state in the top left, like Off or 50%.");
    expect(light).toContain("The brightness as a thin bar across the top, or the tile filled from the left.");
    expect(light).toContain("A thin bar across the top fills to the level. The tile keeps its room, so the icon does not move.");
    expect(light).toContain("Grows or shrinks the state from 75% to 150% of the tile's own size. It still shrinks to fit.");
    expect(light).toContain("A soft shadow under the state on a colored tile, on the iPhone. The watch draws none.");
    expect(light).not.toContain("Auto (7)");
    expect(drawn(tile("light.desk", { stateBarStyle: "Fill" }), true)).toContain("The tile fills with its color from the left to the level; the rest is a dark shade of it.");
    // A card One Look draws as the table says keeps the table's line.
    expect(oneLookCardSubtitle("activity", "alarm_control_panel")).toBeUndefined();
    expect(drawn(tile("alarm_control_panel.home"), true)).toContain("Show armed/disarmed state in top left of tile.");
  });

  it("greys a media player's Off value, whose volume is the bar", () => {
    const media = drawn(tile("media_player.tv"), true);
    expect(media).toContain("The volume shows as the bar. Pill puts what plays in a dark capsule.");
    expect(media).toContain("The volume shows as the bar.");
    // The Off button carries the reason and is disabled; Plain and Pill are not.
    expect(media).toMatch(/title=The volume shows as the bar\.\s*\?disabled=true[^]*?>Off</);
  });

  it("keeps a button's Icon size with the badge off, where the button still draws", () => {
    for (const id of ["media_player.tv", "music_hub.home", "climate.hall"]) {
      const cards = watchTileStateCards(tile(id, { showActivityStatus: false }), { oneLook: true });
      expect(cards.find((c) => c.id === "activity")!.rows.map((r) => r.key), id).toContain("statusIconSizeOverride");
    }
    // A fan's Icon size still follows the badge, and is greyed anyway.
    expect(watchTileStateCards(tile("fan.ceiling", { showActivityStatus: false }), { oneLook: true }).find((c) => c.id === "activity")!.rows.map((r) => r.key))
      .toEqual(["showActivityStatus"]);
    expect(drawn(tile("media_player.tv"), true)).toContain("The size of the play or pause button in the top right.");
  });

  it("greys the status rows One Look draws nothing for", () => {
    const fan = drawn(tile("fan.ceiling"), true);
    const reason = "No status icon on a fan tile. Its speed is the state.";
    expect(fan.split(reason).length - 1).toBeGreaterThanOrEqual(2);
    expect(greyedBefore(fan, `<div class="hint keep ts-under">${reason}`)).toContain("Show status badge");
    const climate = drawn(tile("climate.hall"), true);
    expect(greyedBefore(climate, oneLookStateRowOff("climate", "showActivityStatus")!)).toContain("Show status badge");
    expect(climate).toContain("The size of the fan button in the top right, on a thermostat with fan modes.");
    for (const id of ["vacuum.robo", "lawn_mower.mow", "remote.tv"]) {
      expect(greyedBefore(drawn(tile(id), true), "No status icon on this tile."), id).toContain("Icon size");
    }
    expect(drawn(tile("vacuum.robo"), true)).toContain("Show what the vacuum is doing in the top left. The battery stays.");
  });

  it("notes the iPhone's picture and chart tiles, which draw no bar or pill", () => {
    expect(drawn(tile("media_player.tv", { mediaArtwork: true }), true)).toContain(ONE_LOOK_ARTWORK_NOTE);
    expect(drawn(tile("media_player.tv"), true)).not.toContain(ONE_LOOK_ARTWORK_NOTE);
  });

  it("gives Point control and Assist no State section, as they draw no round button", () => {
    for (const id of ["point_control.x", "assist.home"]) {
      const { host } = tileHost(tile(id), true);
      expect(tileInspectorSections(host), id).not.toContain("state");
      expect(text(renderTileSettings(host)), id).not.toContain("button in the top right");
    }
  });
});

describe("Border in One Look", () => {
  it("greys Extra Thin, and says why a tile holding it draws no border", () => {
    const thin = drawn(tile("light.desk", { borderStyle: "line", borderThickness: "extraThin" }), true);
    expect(thin).toContain(`<div class="hint keep ts-under">${ONE_LOOK_EXTRA_THIN_REASON}</div>`);
    expect(thin).toMatch(/title=Too thin to draw\. Pick Thin or more\.\s*\?disabled=true[^]*?>Extra Thin</);
    const medium = drawn(tile("light.desk", { borderStyle: "line", borderThickness: "medium" }), true);
    expect(medium).not.toContain(`<div class="hint keep ts-under">${ONE_LOOK_EXTRA_THIN_REASON}</div>`);
    expect(medium).toContain("Extra Thin");
  });
});

describe("a camera showing its picture", () => {
  it("is a camera or a group in Preview", () => {
    expect(oneLookShowsPicture(tile("camera.door", { cameraDisplayMode: "preview" }))).toBe(true);
    expect(oneLookShowsPicture(tile("multicam.5A17E000-0000-4000-8000-000000000130", { cameraDisplayMode: "preview" }))).toBe(true);
    expect(oneLookShowsPicture(tile("camera.door"))).toBe(false);
    expect(oneLookShowsPicture(tile("camera.door", { cameraDisplayMode: "icon" }))).toBe(false);
    expect(oneLookShowsPicture(tile("light.desk", { cameraDisplayMode: "preview" }))).toBe(false);
  });

  it("greys its Icon, Text, Border and Background sections in One Look only", () => {
    const preview = tile("camera.door", { cameraDisplayMode: "preview" });
    const view = drawn(preview, true);
    for (const section of ["icon", "text", "border", "background"]) {
      const reason = oneLookSectionOff(preview, section)!;
      expect(view, section).toContain(`<div class="hint keep">${reason}</div><fieldset class="ts-plain ts-off" disabled>`);
    }
    expect(view).toContain(ONE_LOOK_CAMERA_PREVIEW_HINT);
    expect(drawn(preview)).not.toContain("ts-off");
    expect(drawn(preview)).not.toContain(ONE_LOOK_CAMERA_PREVIEW_HINT);
    expect(drawn(tile("camera.door"), true)).not.toContain("draws no icon");
  });
});
