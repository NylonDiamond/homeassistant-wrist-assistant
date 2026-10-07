// Animate while on (`activeIconAnimationEnabled`): which kinds show the
// switch, what an absent key reads as, and what the setter writes, as the
// watch's `GridItemConfig.resolvedActiveIconAnimationEnabled` and the
// phone's Icon task had them.

import { describe, expect, it } from "vitest";

import { findWatchPage } from "../src/watch-pages/edit.js";
import type { WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { applySmartStyleStandIn, smartStandInTile, smartStyleStandIn } from "../src/watch-pages/smart-model.js";
import { watchActiveAnimationNote } from "../src/watch-pages/tile-settings-options.js";
import {
  WATCH_TILE_SETTING_KEYS,
  setWatchTileActiveIconAnimation,
  watchTileIconSettings,
} from "../src/watch-pages/tile-settings-model.js";
import tileActions from "../src/watch-pages/tile-actions.json";

type Json = Record<string, unknown>;

const PAGE = "C3A0E000-0000-4000-8000-0000000000AA";
const SMART = "C3A0E000-0000-4000-8000-0000000000CC";
const T = "C3A0E000-0000-4000-8000-0000000000DD";
const RULE = "11111111-0000-4000-8000-000000000001";

/** The domains the watch animates (`supportsActiveIconAnimation`). */
const ANIMATED = ["climate", "fan", "light", "media_player", "timer", "vacuum"];

const tile = (entityId: string, extra: Json = {}): WatchPageTile => ({ id: T, entityId, ...extra });

function docWith(t: WatchPageTile): WatchPagesDocument {
  return Object.freeze({
    schemaVersion: 1,
    pages: [
      { id: PAGE, name: "Living", items: [t] },
      { id: SMART, name: "Smart", dynamicConfig: { rules: [] }, items: [t] },
    ],
  }) as WatchPagesDocument;
}

const read = (d: WatchPagesDocument, pageId = PAGE): WatchPageTile => (findWatchPage(d, pageId)!.items as WatchPageTile[])[0]!;

describe("which kinds show Animate while on", () => {
  it("only the domains the watch animates, from the table", () => {
    const kinds = (tileActions as unknown as { kinds: Record<string, Json> }).kinds;
    const shown = Object.entries(kinds).filter(([, k]) => k.activeIconAnimation === true).map(([name]) => name).sort();
    expect(shown).toEqual(ANIMATED);
    for (const name of ANIMATED) expect(watchTileIconSettings(tile(`${name}.den`)).activeAnimation.shown, name).toBe(true);
    for (const name of ["switch", "sensor", "automation", "cover", "lock", "zz_unknown"]) {
      expect(watchTileIconSettings(tile(`${name}.den`)).activeAnimation.shown, name).toBe(false);
    }
  });
});

describe("an absent key reads as the watch's default", () => {
  it("fans spin, every other animated kind is still", () => {
    for (const name of ANIMATED) {
      const a = watchTileIconSettings(tile(`${name}.den`)).activeAnimation;
      expect(a.stored, name).toBeUndefined();
      expect(a.default, name).toBe(name === "fan");
      expect(a.value, name).toBe(name === "fan");
    }
  });

  it("a stored value wins, and a kind that does not animate reads off whatever is stored", () => {
    expect(watchTileIconSettings(tile("fan.den", { activeIconAnimationEnabled: false })).activeAnimation.value).toBe(false);
    expect(watchTileIconSettings(tile("light.den", { activeIconAnimationEnabled: true })).activeAnimation.value).toBe(true);
    const sw = watchTileIconSettings(tile("switch.den", { activeIconAnimationEnabled: true })).activeAnimation;
    expect(sw).toEqual({ shown: false, stored: true, default: false, value: false });
    // A value that is not a boolean reads as absent.
    expect(watchTileIconSettings(tile("fan.den", { activeIconAnimationEnabled: "no" })).activeAnimation.value).toBe(true);
  });

  it("the note names the default and says when the tile holds its own", () => {
    expect(watchActiveAnimationNote(tile("fan.den"))).toBe("Spins the icon while the fan runs. The default for this kind of tile: on.");
    expect(watchActiveAnimationNote(tile("light.den", { activeIconAnimationEnabled: true })))
      .toBe("Pulses the icon while the light is on. Set on this tile. The default for this kind of tile is off.");
  });
});

describe("setWatchTileActiveIconAnimation", () => {
  it("writes true and false, even when equal to the default, as the phone's toggle did", () => {
    const d = docWith(tile("light.den"));
    expect(read(setWatchTileActiveIconAnimation(d, PAGE, T, true)).activeIconAnimationEnabled).toBe(true);
    expect(read(setWatchTileActiveIconAnimation(d, PAGE, T, false)).activeIconAnimationEnabled).toBe(false);
    const fan = docWith(tile("fan.den"));
    expect(read(setWatchTileActiveIconAnimation(fan, PAGE, T, true)).activeIconAnimationEnabled).toBe(true);
  });

  it("the default (null) removes the key", () => {
    const d = docWith(tile("fan.den", { activeIconAnimationEnabled: false }));
    const next = read(setWatchTileActiveIconAnimation(d, PAGE, T, null));
    expect(Object.hasOwn(next, "activeIconAnimationEnabled")).toBe(false);
    // Nothing to remove: the document as given.
    const bare = docWith(tile("fan.den"));
    expect(setWatchTileActiveIconAnimation(bare, PAGE, T, null)).toBe(bare);
  });

  it("keeps every other key, unknown ones too, in place", () => {
    const d = docWith(tile("light.den", { zzFuture: { a: 1 }, color: "#FFCC00", activeIconAnimationEnabled: true }));
    const next = read(setWatchTileActiveIconAnimation(d, PAGE, T, false));
    expect(next).toEqual({ id: T, entityId: "light.den", zzFuture: { a: 1 }, color: "#FFCC00", activeIconAnimationEnabled: false });
    expect(Object.keys(next)).toEqual(["id", "entityId", "zzFuture", "color", "activeIconAnimationEnabled"]);
  });

  it("refuses a kind the watch does not animate, a smart page, and a value that is not a boolean", () => {
    const sw = docWith(tile("switch.den"));
    expect(setWatchTileActiveIconAnimation(sw, PAGE, T, true)).toBe(sw);
    const d = docWith(tile("light.den"));
    expect(setWatchTileActiveIconAnimation(d, SMART, T, true)).toBe(d);
    expect(setWatchTileActiveIconAnimation(d, PAGE, T, "yes" as unknown as boolean)).toBe(d);
    expect(setWatchTileActiveIconAnimation(d, PAGE, "missing", true)).toBe(d);
  });

  it("is one of the keys the tile setters write", () => {
    expect(WATCH_TILE_SETTING_KEYS).toContain("activeIconAnimationEnabled");
  });
});

describe("a smart page rule's style", () => {
  const rule = (tileStyle: Json): Json => ({ domain: "fan", entityIds: [], header: "label", id: RULE, invertActive: false, mode: "all", tileStyle });
  const smartDoc = (r: Json): WatchPagesDocument => ({
    schemaVersion: 1,
    pages: [{ id: PAGE, name: "Active", items: [], dynamicConfig: { rules: [r], sortOrder: "domain" } }],
  });
  const ruleIn = (d: WatchPagesDocument): Json => ((findWatchPage(d, PAGE)!.dynamicConfig as Json).rules as Json[])[0]!;
  const edit = (d: WatchPagesDocument, value: boolean | null): WatchPagesDocument => {
    const r = ruleIn(d);
    const standIn = smartStyleStandIn(r, PAGE, findWatchPage(d, PAGE));
    return applySmartStyleStandIn(d, PAGE, RULE, setWatchTileActiveIconAnimation(standIn, PAGE, RULE, value));
  };

  it("reads the domain's default with no key, as the watch's tiles get none from the rule", () => {
    const d = smartDoc(rule({}));
    const standIn = smartStandInTile(smartStyleStandIn(ruleIn(d), PAGE, findWatchPage(d, PAGE)), PAGE, RULE)!;
    expect(watchTileIconSettings(standIn).activeAnimation).toEqual({ shown: true, stored: undefined, default: true, value: true });
  });

  it("writes false and true into tileStyle, and the default removes it, other keys kept", () => {
    const d = smartDoc(rule({ color: "#FFCC00", zzFuture: 1 }));
    const off = edit(d, false);
    expect(ruleIn(off).tileStyle).toEqual({ color: "#FFCC00", zzFuture: 1, activeIconAnimationEnabled: false });
    const on = edit(off, true);
    expect((ruleIn(on).tileStyle as Json).activeIconAnimationEnabled).toBe(true);
    const back = edit(on, null);
    expect(ruleIn(back).tileStyle).toEqual({ color: "#FFCC00", zzFuture: 1 });
  });
});
