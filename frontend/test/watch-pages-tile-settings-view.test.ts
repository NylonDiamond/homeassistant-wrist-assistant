// What the tile settings view shows, without a DOM: the sections a tile
// gets, the menus with their "Default (...)" entries and stored values not
// offered, the page link menu, the label's fallback name, the color helpers
// and the reasons a typed value is refused.

import { describe, expect, it } from "vitest";

import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { watchGradientOf, watchLinkTargetPages } from "../src/watch-pages/tile-new.js";
import {
  WATCH_DEFAULT_CHOICE,
  WATCH_NOT_OFFERED_NOTE,
  isWatchStoredChoice,
  sameWatchColor,
  watchAskBeforeRunningNote,
  watchChoiceMenu,
  watchColorEnds,
  watchColorForMode,
  watchColorModeChoice,
  watchColorRefusal,
  watchCustomBoxColor,
  watchFontDesignMenu,
  watchFontSizeRefusal,
  watchFontWeightMenu,
  watchGlowPercent,
  watchHeaderTextSizeRefusal,
  watchHoldSlideMenus,
  watchIconSizeRefusal,
  watchLabelNote,
  watchLinkTargetMenu,
  watchSingleTapMenu,
  watchSkipChoice,
  watchSkipValue,
  watchSwatchesInGradient,
  watchTileFallbackName,
  watchTileSettingsSections,
  watchTriggerEntityName,
} from "../src/watch-pages/tile-settings-options.js";
import { WATCH_ICON_TAP_ANIMATIONS } from "../src/watch-pages/tile-settings-model.js";

const tile = (entityId: string, extra: Record<string, unknown> = {}): WatchPageTile => ({ id: "T1", entityId, ...extra });

const P1 = "C3A0E000-0000-4000-8000-000000000001";
const P2 = "C3A0E000-0000-4000-8000-000000000002";
const P3 = "C3A0E000-0000-4000-8000-000000000003";
const P4 = "C3A0E000-0000-4000-8000-000000000004";

function documentWith(...pages: WatchPage[]): WatchPagesDocument {
  return { schemaVersion: 1, pages };
}

describe("sections", () => {
  it("gives each kind its sections in order", () => {
    expect(watchTileSettingsSections(tile("light.desk"))).toEqual(["icon", "text", "action"]);
    expect(watchTileSettingsSections(tile("divider.line.custom"))).toEqual(["header", "action"]);
    expect(watchTileSettingsSections(tile(`page.${P2}`))).toEqual(["opens", "icon", "text", "action"]);
    expect(watchTileSettingsSections(tile(`show_page.${P2}`))).toEqual(["opens", "icon", "text", "action"]);
    expect(watchTileSettingsSections(tile("spacer.ABC"))).toEqual([]);
  });
});

describe("single tap menu", () => {
  it("starts with the default in the kind's words, then the offered actions", () => {
    const menu = watchSingleTapMenu(tile("light.desk"))!;
    expect(menu.options[0]).toEqual({ value: WATCH_DEFAULT_CHOICE, label: "Default (Toggle Light)" });
    expect(menu.options.slice(1).map((o) => o.value)).toEqual(["toggle", "openControl", "none"]);
    expect(menu.selected).toBe(WATCH_DEFAULT_CHOICE);
    expect(menu.note).toBeUndefined();
  });

  it("selects a stored action, even one that equals the default", () => {
    expect(watchSingleTapMenu(tile("light.desk", { singleTapAction: "toggle" }))!.selected).toBe("toggle");
  });

  it("shows a stored library action or unknown string as the current entry, disabled", () => {
    for (const [stored, label] of [["runMacro", "Run Macro"], ["dance", "Sync Needed"]] as const) {
      const menu = watchSingleTapMenu(tile("light.desk", { singleTapAction: stored }))!;
      const current = menu.options.find((o) => o.value === menu.selected)!;
      expect(isWatchStoredChoice(menu.selected)).toBe(true);
      expect(current.disabled).toBe(true);
      expect(current.label).toBe(label);
      expect(menu.note).toBe(WATCH_NOT_OFFERED_NOTE);
      expect(menu.options.filter((o) => !o.disabled).map((o) => o.value)).toEqual(["", "toggle", "openControl", "none"]);
    }
  });

  it("is absent for a kind with no single tap", () => {
    expect(watchSingleTapMenu(tile(`page.${P2}`))).toBeUndefined();
    expect(watchSingleTapMenu(tile("divider.line.custom"))).toBeUndefined();
  });
});

describe("hold and slide menus", () => {
  it("has four rows, the default named, None last, no library action offered", () => {
    const menus = watchHoldSlideMenus(tile("light.desk"))!;
    expect(menus.rows.map((r) => r.title)).toEqual(["Up", "Down", "Left", "Right"]);
    expect(menus.rows.map((r) => r.options[0]!.label)).toEqual([
      "Default (None)",
      "Default (Open Light Controls)",
      "Default (None)",
      "Default (None)",
    ]);
    for (const row of menus.rows) {
      expect(row.options.at(-1)!.value).toBe("none");
      expect(row.options.some((o) => o.value === "httpAction")).toBe(false);
      expect(row.selected).toBe(WATCH_DEFAULT_CHOICE);
      expect(row.trigger).toBeUndefined();
    }
    expect(menus.anyStored).toBe(false);
    expect(menus.readable).toBe(true);
  });

  it("names the default from the kind even while the direction is stored", () => {
    const menus = watchHoldSlideMenus(tile("light.desk", { holdSlideActions: ["down", "none"] }))!;
    expect(menus.rows[1]!.options[0]!.label).toBe("Default (Open Light Controls)");
    expect(menus.rows[1]!.selected).toBe("none");
    expect(menus.anyStored).toBe(true);
  });

  it("shows a stored HTTP action as the current entry, disabled", () => {
    const row = watchHoldSlideMenus(tile("light.desk", { holdSlideActions: ["up", "httpAction"] }))!.rows[0]!;
    expect(isWatchStoredChoice(row.selected)).toBe(true);
    expect(row.options.find((o) => o.value === row.selected)).toMatchObject({ label: "Run HTTP Action", disabled: true });
    expect(row.note).toBe(WATCH_NOT_OFFERED_NOTE);
  });

  it("carries a trigger's target and its domain's modes", () => {
    const t = tile("light.desk", {
      holdSlideActions: ["left", "triggerEntity", "right", "triggerEntity"],
      holdSlideTriggerTargets: ["left", { entityId: "scene.movie", mode: "activate", friendlyName: "Movie" }],
    });
    const rows = watchHoldSlideMenus(t)!.rows;
    expect(rows[2]!.trigger).toEqual({
      entityId: "scene.movie",
      friendlyName: "Movie",
      modes: { options: [{ value: "activate", label: "Activate" }, { value: "refresh", label: "Refresh" }], selected: "activate" },
    });
    // Trigger entity with nothing picked yet: the entity picker alone.
    expect(rows[3]!.trigger).toEqual({ entityId: "", friendlyName: undefined, modes: undefined });
  });

  it("shows a stored mode the target's domain does not offer, disabled", () => {
    const t = tile("light.desk", {
      holdSlideActions: ["left", "triggerEntity"],
      holdSlideTriggerTargets: ["left", { entityId: "scene.movie", mode: "turnOn" }],
    });
    const modes = watchHoldSlideMenus(t)!.rows[2]!.trigger!.modes!;
    expect(modes.options[0]).toMatchObject({ label: "turnOn", disabled: true });
    expect(modes.selected).toBe(modes.options[0]!.value);
    expect(modes.note).toMatch(/does not offer/);
  });

  it("marks a stored array that does not parse as not readable", () => {
    expect(watchHoldSlideMenus(tile("light.desk", { holdSlideActions: ["up"] }))!.readable).toBe(false);
  });

  it("is absent for a header", () => {
    expect(watchHoldSlideMenus(tile("divider.line.custom"))).toBeUndefined();
  });
});

describe("ask before running, skip conditions, fixed menus", () => {
  it("names the kind's default", () => {
    expect(watchAskBeforeRunningNote(tile("lock.front"))).toBe("The default for this kind of tile: on.");
    expect(watchAskBeforeRunningNote(tile("light.desk"))).toBe("The default for this kind of tile: off.");
    expect(watchAskBeforeRunningNote(tile("light.desk", { requiresConfirmation: true }))).toBe(
      "Set on this tile. The default for this kind of tile is off.",
    );
  });

  it("maps the skip choice both ways", () => {
    for (const value of [null, true, false]) expect(watchSkipValue(watchSkipChoice(value))).toBe(value);
    expect(watchSkipChoice(null)).toBe("default");
  });

  it("shows a stored value a fixed menu lacks, disabled, first", () => {
    expect(watchFontWeightMenu("bold").selected).toBe("bold");
    expect(watchFontDesignMenu("default").selected).toBe("default");
    const odd = watchFontWeightMenu("heavy");
    expect(odd.options[0]).toMatchObject({ label: "heavy", disabled: true });
    expect(odd.selected).toBe(odd.options[0]!.value);
    expect(watchChoiceMenu(WATCH_ICON_TAP_ANIMATIONS, "replace").options.map((o) => o.label)).toContain("Morph");
  });
});

describe("page link menu", () => {
  const home: WatchPage = { id: P1, name: "Home", items: [] };
  const up: WatchPage = { id: P2, name: "Upstairs", items: [] };
  const hidden: WatchPage = { id: P3, name: "Guest", isHidden: true, items: [] };
  const system: WatchPage = { id: P4, name: "System", isSystemPage: true, items: [] };
  const document = documentWith(home, up, hidden, system);

  it("lists the pages a link may open, the current one selected", () => {
    const t = tile(`page.${P2}`);
    const menu = watchLinkTargetMenu(document, t, watchLinkTargetPages(document, P1, "pageLink"))!;
    expect(menu.options.map((o) => o.label)).toEqual(["Upstairs"]);
    expect(menu.selected).toBe(P2);
    expect(menu.oldTargetName).toBe("Upstairs");
    expect(menu.kind).toBe("page");
  });

  it("offers hidden pages to a peek link", () => {
    const t = tile(`show_page.${P2.toLowerCase()}`);
    const menu = watchLinkTargetMenu(document, t, watchLinkTargetPages(document, P1, "peekLink"))!;
    expect(menu.options.map((o) => o.label)).toEqual(["Upstairs", "Guest"]);
    expect(menu.selected).toBe(P2);
  });

  it("shows a target it cannot offer, disabled, with the reason", () => {
    const toHidden = watchLinkTargetMenu(document, tile(`page.${P3}`), watchLinkTargetPages(document, P1, "pageLink"))!;
    expect(toHidden.options[0]).toMatchObject({ label: "Guest", disabled: true });
    expect(toHidden.note).toMatch(/hidden page/);
    const gone = watchLinkTargetMenu(document, tile("page.C3A0E000-0000-4000-8000-0000000000FF"), [up])!;
    expect(gone.options[0]).toMatchObject({ label: "A page that is gone", disabled: true });
    expect(gone.oldTargetName).toBeUndefined();
  });

  it("is absent for a tile that is no link", () => {
    expect(watchLinkTargetMenu(document, tile("light.desk"), [])).toBeUndefined();
  });
});

describe("label", () => {
  it("falls back to Home Assistant's name, or the page a link opens", () => {
    const states = { "light.desk": { entity_id: "light.desk", state: "on", attributes: { friendly_name: "Desk Lamp" } } };
    expect(watchTileFallbackName(tile("light.desk", { customLabel: "Mine" }), states as never)).toBe("Desk Lamp");
    expect(watchTileFallbackName(tile("light.gone", { customLabel: "Mine" }), states as never)).toBe("light.gone");
    const pages: WatchPage[] = [{ id: P2, name: "Upstairs", items: [] }];
    expect(watchTileFallbackName(tile(`page.${P2}`, { customLabel: "Mine" }), undefined, pages)).toBe("Upstairs");
    expect(watchLabelNote(tile(`page.${P2}`))).toMatch(/page it opens/);
    expect(watchLabelNote(tile("light.desk"))).toMatch(/Home Assistant/);
  });
});

describe("colors", () => {
  it("reads the mode, with none for no color", () => {
    expect(watchColorModeChoice("#FFC145")).toBe("solid");
    expect(watchColorModeChoice("GRADIENT|#FFC145|#3BBED9")).toBe("gradient");
    expect(watchColorModeChoice("#rainbow")).toBe("rainbow");
    expect(watchColorModeChoice(undefined)).toBe("none");
    expect(watchColorModeChoice("red")).toBe("none");
  });

  it("converts for the Solid and Gradient choice, from a rainbow by the fallback", () => {
    expect(watchColorForMode("#FFC145", "gradient", undefined, watchGradientOf)).toBe("GRADIENT|#FFC145|#3BBED9");
    expect(watchColorForMode("GRADIENT|#FFC145|#3BBED9", "solid", undefined, watchGradientOf)).toBe("#FFC145");
    expect(watchColorForMode("#FFC145", "solid", "#000000", watchGradientOf)).toBeUndefined();
    expect(watchColorForMode("#RAINBOW", "gradient", "#FFC145", watchGradientOf)).toBe("GRADIENT|#FFC145|#3BBED9");
    expect(watchColorForMode(undefined, "solid", "GRADIENT|#FFC145|#3BBED9", watchGradientOf)).toBe("#FFC145");
    expect(watchColorForMode("#RAINBOW", "solid", undefined, watchGradientOf)).toBeUndefined();
    expect(watchColorForMode(undefined, "solid", "#RAINBOW", watchGradientOf)).toBeUndefined();
  });

  it("shows gradient swatches for a gradient, or for no color on a gradient page", () => {
    expect(watchSwatchesInGradient("GRADIENT|#FFC145|#3BBED9", false)).toBe(true);
    expect(watchSwatchesInGradient("#FFC145", true)).toBe(false);
    expect(watchSwatchesInGradient(undefined, true)).toBe(true);
    expect(watchSwatchesInGradient("#RAINBOW", true)).toBe(true);
    expect(watchSwatchesInGradient(undefined, false)).toBe(false);
  });

  it("splits a color into its ends and the custom box's color", () => {
    expect(watchColorEnds("#ffc145")).toEqual({ from: "#FFC145", to: "#FFC145" });
    expect(watchColorEnds("GRADIENT|#FFC145|#3bbed9")).toEqual({ from: "#FFC145", to: "#3BBED9" });
    expect(watchColorEnds("#RAINBOW")).toBeUndefined();
    expect(watchCustomBoxColor("GRADIENT|#FFC145|#3BBED9")).toBe("#FFC145");
    expect(watchCustomBoxColor(undefined)).toBeUndefined();
  });

  it("compares colors without regard to case or a missing #", () => {
    expect(sameWatchColor("#ffc145", "FFC145")).toBe(true);
    expect(sameWatchColor("GRADIENT|#FFC145|#3BBED9", "gradient|#ffc145|#3bbed9")).toBe(true);
    expect(sameWatchColor("#FFC145", "GRADIENT|#FFC145|#3BBED9")).toBe(false);
    expect(sameWatchColor(undefined, "#FFC145")).toBe(false);
  });

  it("refuses opacity and anything but six hex digits", () => {
    expect(watchColorRefusal("#FFC145")).toBeUndefined();
    expect(watchColorRefusal("ffc145")).toBeUndefined();
    expect(watchColorRefusal("#FFC14580")).toMatch(/no opacity/);
    expect(watchColorRefusal("#FFF")).toMatch(/six hex digits/);
  });
});

describe("numbers", () => {
  it("names the range a typed number must be in", () => {
    expect(watchFontSizeRefusal(12.4)).toBeUndefined();
    expect(watchFontSizeRefusal(3)).toBe("Use a number from 4 to 16.");
    expect(watchFontSizeRefusal(Number.NaN)).toBe("Use a number from 4 to 16.");
    expect(watchHeaderTextSizeRefusal(21)).toBe("Use a number from 8 to 20.");
  });

  it("says when the tile's size is what caps the icon", () => {
    expect(watchIconSizeRefusal(24, 31.6)).toBeUndefined();
    expect(watchIconSizeRefusal(40, 31.6)).toMatch(/stops growing at 31/);
    expect(watchIconSizeRefusal(4, 31.6)).toBe("Use a number from 8 to 31.");
    expect(watchIconSizeRefusal(9, 8)).toMatch(/stops growing at 8/);
  });

  it("shows a glow in whole percent", () => {
    expect(watchGlowPercent(0.35)).toBe(35);
    expect(watchGlowPercent(2)).toBe(100);
  });
});

describe("trigger entity name", () => {
  it("prefers Home Assistant's name, then the stored one, then the id", () => {
    const states = { "scene.movie": { entity_id: "scene.movie", state: "x", attributes: { friendly_name: "Movie Night" } } };
    expect(watchTriggerEntityName("scene.movie", "Old", states as never)).toBe("Movie Night");
    expect(watchTriggerEntityName("scene.other", "Old", states as never)).toBe("Old");
    expect(watchTriggerEntityName("scene.other", undefined, states as never)).toBe("scene.other");
  });
});
