// The Settings page's address and rules, and its kept drafts: where it lives
// in the Watch app tab, how it follows the row's watch, when Save can run and
// when ⌘S saves it, and how one watch's unsaved edits are kept and laid back
// over the records read on the way back.

import { afterEach, describe, expect, it } from "vitest";

import { WATCH_SETTINGS_SCREEN, panelPrefix, swallowsSaveKey, tabOfRoute, tabPath, watchScreenOf, watchScreenPath, editorKeysLive, landingPath } from "../src/shell.js";
import { watchRouteOwner } from "../src/watch-pick.js";
import { watchRowLinks, watchRowSettingsLink } from "../src/watch-row.js";
import { WATCH_SETTINGS_CATALOG, catalogSettings, watchBehaviorDefaults } from "../src/watch-settings.js";
import { watchSettingsStyles } from "../src/watch-settings-view.js";
import {
  type KeptSettings,
  anyWatchSettingsDirty,
  dropWatchSettingsDrafts,
  keepSettingsDraft,
  keptChanges,
  keptSettingsDraft,
  restoreSettingsDraft,
  settingsStartedFresh,
  startSettingsFresh,
} from "../src/watch-settings-draft.js";
import { NOTIFICATION_STYLE_SECTIONS } from "../src/watch-notification-style/model.js";
import { SETTINGS_GROUPS, groupOfCard, matchesSearch, searchTerms, settingsGroup } from "../src/watch-settings-nav.js";
import {
  WATCH_SETTINGS_PATH,
  isWatchSettingsRoute,
  settingsCanSave,
  settingsPageSavesOnKey,
  settingsPageStep,
  watchSettingsRouteOwner,
} from "../src/watch-settings-page.js";

const at = (path: string) => ({ prefix: "/wrist-assistant", path });
const key = (k: string, mod: "meta" | "ctrl" | "none" = "meta") => ({ key: k, metaKey: mod === "meta", ctrlKey: mod === "ctrl" });

describe("the Settings page's address", () => {
  it("is /settings, with or without a watch", () => {
    expect(WATCH_SETTINGS_PATH).toBe("/settings");
    expect(isWatchSettingsRoute(at("/settings"))).toBe(true);
    expect(isWatchSettingsRoute(at("/settings/w1"))).toBe(true);
    expect(isWatchSettingsRoute(at("/settingsx"))).toBe(false);
    expect(isWatchSettingsRoute(at("/pages"))).toBe(false);
    expect(isWatchSettingsRoute(undefined)).toBe(false);
  });

  it("reads the watch the way every watch screen does", () => {
    expect(watchSettingsRouteOwner(at("/settings/w1"))).toBe("w1");
    expect(watchSettingsRouteOwner(at("/settings/a%2Fb"))).toBe("a/b");
    expect(watchSettingsRouteOwner(at("/settings/%E0%A4%A"))).toBeUndefined();
    expect(watchSettingsRouteOwner(at("/settings"))).toBeUndefined();
    expect(watchSettingsRouteOwner(at("/settings/"))).toBeUndefined();
    expect(watchSettingsRouteOwner(at("/pages/w1"))).toBeUndefined();
    // The shared watch reads it too, so a deep link becomes the shared pick.
    expect(watchRouteOwner(at("/settings/w2"))).toBe("w2");
  });

  it("belongs to the Watch app tab as its Settings screen", () => {
    expect(tabOfRoute(at("/settings"))).toBe("watch");
    expect(tabOfRoute(at("/settings/w1"))).toBe("watch");
    expect(watchScreenOf(at("/settings/w1"))).toBe(WATCH_SETTINGS_SCREEN);
    expect(watchScreenPath(WATCH_SETTINGS_SCREEN, "a/b")).toBe("/settings/a%2Fb");
    expect(watchSettingsRouteOwner(at(watchScreenPath(WATCH_SETTINGS_SCREEN, "a/b")))).toBe("a/b");
    // The Watch app tab still opens on Pages.
    expect(tabPath("watch", "w1")).toBe("/pages/w1");
  });

  it("is a sub-path the panel's own address is found under", () => {
    expect(panelPrefix(undefined, "/wrist-assistant/settings/w1")).toBe("/wrist-assistant");
    expect(panelPrefix(undefined, "/wrist-assistant/settings")).toBe("/wrist-assistant");
  });

  it("keeps the complication editor's keys still, and a reload there stays there", () => {
    expect(editorKeysLive(at("/settings"), true)).toBe(false);
    expect(landingPath(at("/settings/w1"), { shareLink: false })).toBeUndefined();
  });

  it("is the row's first link, on the shared watch, marked on its page", () => {
    expect(watchRowLinks(at("/settings/w1"), "w1").filter((l) => l.on).map((l) => l.screen)).toEqual([WATCH_SETTINGS_SCREEN]);
    expect(watchRowSettingsLink(at("/settings/w1"), "w1")).toEqual({ screen: WATCH_SETTINGS_SCREEN, path: "/settings/w1", on: true });
    expect(watchRowSettingsLink(at("/pages/w1"), "w1").on).toBe(false);
    expect(watchRowSettingsLink(at("/pages"), undefined).path).toBe("/settings");
  });
});

describe("⌘S on the page", () => {
  it("saves the page on ⌘S and Ctrl+S, and only there", () => {
    expect(settingsPageSavesOnKey(at("/settings/w1"), key("s"))).toBe(true);
    expect(settingsPageSavesOnKey(at("/settings"), key("s", "ctrl"))).toBe(true);
    expect(settingsPageSavesOnKey(at("/settings"), key("s", "none"))).toBe(false);
    expect(settingsPageSavesOnKey(at("/settings"), key("z"))).toBe(false);
    expect(settingsPageSavesOnKey(at("/rooms/w1"), key("s"))).toBe(false);
    expect(settingsPageSavesOnKey(at(""), key("s"))).toBe(false);
  });

  it("is not held back by the rule for Home and the list, which leaves the Watch app alone", () => {
    expect(swallowsSaveKey(at("/settings"), false)).toBe(false);
  });
});

describe("settingsPageStep", () => {
  it("reads on the way onto the page, even on the watch it showed last", () => {
    expect(settingsPageStep(false, undefined, "w1")).toBe("load");
    expect(settingsPageStep(false, "w1", "w1")).toBe("load");
  });

  it("follows the row to another watch, and stays on the one it shows", () => {
    expect(settingsPageStep(true, "w1", "w2")).toBe("load");
    expect(settingsPageStep(true, "w1", "w1")).toBe("stay");
  });

  it("shows the pairing card alone with no watch, once", () => {
    expect(settingsPageStep(false, undefined, undefined)).toBe("clear");
    expect(settingsPageStep(true, "w1", undefined)).toBe("clear");
    expect(settingsPageStep(true, undefined, undefined)).toBe("stay");
  });
});

describe("settingsCanSave", () => {
  const base = { behaviorChanges: 1, styleChanges: 0, busy: false, behaviorHeld: true, styleHeld: true };
  it("needs a change, nothing running, and a record to save each change over", () => {
    expect(settingsCanSave(base)).toBe(true);
    expect(settingsCanSave({ ...base, behaviorChanges: 0 })).toBe(false);
    expect(settingsCanSave({ ...base, busy: true })).toBe(false);
    expect(settingsCanSave({ ...base, behaviorHeld: false })).toBe(false);
    expect(settingsCanSave({ ...base, behaviorChanges: 0, styleChanges: 2, styleHeld: false })).toBe(false);
    expect(settingsCanSave({ ...base, behaviorChanges: 0, styleChanges: 2, behaviorHeld: false })).toBe(true);
  });
});

describe("kept settings drafts", () => {
  afterEach(() => dropWatchSettingsDrafts());

  const wrap = catalogSettings().find((s) => s.key === "wrapPages")!;
  const doc = watchBehaviorDefaults();
  const draft = (over: Partial<KeptSettings> = {}): KeptSettings => ({
    behaviorRevision: 3, behaviorDocument: doc, edits: new Map([["wrapPages", !wrap.default]]),
    styleRevision: 0, styleDocument: undefined, styleEdits: new Map(), ...over,
  });

  it("keeps a watch's form only while it holds unsaved changes", () => {
    keepSettingsDraft("w1", draft());
    expect(keptChanges(keptSettingsDraft("w1")!)).toBe(1);
    expect(anyWatchSettingsDirty()).toBe(true);
    keepSettingsDraft("w1", draft({ edits: new Map() }));
    expect(keptSettingsDraft("w1")).toBeUndefined();
    expect(anyWatchSettingsDirty()).toBe(false);
  });

  it("does not count an edit that only says what the copy says", () => {
    keepSettingsDraft("w1", draft({ edits: new Map([["wrapPages", wrap.default]]) }));
    expect(anyWatchSettingsDirty()).toBe(false);
  });

  it("drops every watch's on the way out of the panel", () => {
    keepSettingsDraft("w1", draft());
    keepSettingsDraft("w2", draft());
    dropWatchSettingsDrafts();
    expect(anyWatchSettingsDirty()).toBe(false);
    expect(keptSettingsDraft("w2")).toBeUndefined();
  });

  it("lays the edits back over the same copy without a word", () => {
    const back = restoreSettingsDraft(draft(), { revision: 3, document: doc }, { revision: 0 });
    expect(back).toEqual({ edits: new Map([["wrapPages", !wrap.default]]), styleEdits: new Map(), moved: false });
  });

  it("keeps the edits over a newer copy and says so, dropping one the newer copy already holds", () => {
    const kept = draft({ edits: new Map<string, string | boolean>([["wrapPages", !wrap.default], ["longPressDuration", "Long"]]) });
    const newer = { ...doc, longPressDuration: "Long", crownSwitchesPages: true };
    const back = restoreSettingsDraft(kept, { revision: 4, document: newer }, undefined);
    expect([...back.edits]).toEqual([["wrapPages", !wrap.default]]);
    expect(back.moved).toBe(true);
  });

  it("says nothing when the newer copy holds every edit already", () => {
    const back = restoreSettingsDraft(draft(), { revision: 4, document: { ...doc, wrapPages: !wrap.default } }, undefined);
    expect(back.edits.size).toBe(0);
    expect(back.moved).toBe(false);
  });

  it("lets the edits go with a record that has gone", () => {
    const back = restoreSettingsDraft(draft(), { revision: 0 }, undefined);
    expect(back.edits.size).toBe(0);
  });

  it("lays edits made on a new watch's defaults back on them while there is still no record", () => {
    const fresh = draft({ behaviorRevision: 0 });
    const back = restoreSettingsDraft(fresh, { revision: 0 }, undefined, { behavior: doc });
    expect([...back.edits]).toEqual([["wrapPages", !wrap.default]]);
    expect(back.moved).toBe(false);
    // The page did not open ready (it waits for the iPhone): nothing to lay
    // them on.
    expect(restoreSettingsDraft(fresh, { revision: 0 }, undefined).edits.size).toBe(0);
  });

  it("lays them on a record that came meanwhile instead, and says so", () => {
    const back = restoreSettingsDraft(draft({ behaviorRevision: 0 }), { revision: 2, document: doc }, undefined, { behavior: doc });
    expect([...back.edits]).toEqual([["wrapPages", !wrap.default]]);
    expect(back.moved).toBe(true);
  });

  it("never lays edits from a record that has gone on the defaults", () => {
    const back = restoreSettingsDraft(draft(), { revision: 0 }, undefined, { behavior: doc });
    expect(back.edits.size).toBe(0);
  });

  it("remembers a start fresh per watch until the panel is left", () => {
    expect(settingsStartedFresh("w1")).toBe(false);
    startSettingsFresh("w1");
    expect(settingsStartedFresh("w1")).toBe(true);
    expect(settingsStartedFresh("w2")).toBe(false);
    dropWatchSettingsDrafts();
    expect(settingsStartedFresh("w1")).toBe(false);
  });

  it("starts empty for a watch with nothing kept", () => {
    expect(restoreSettingsDraft(undefined, { revision: 3, document: doc }, undefined)).toEqual({ edits: new Map(), styleEdits: new Map(), moved: false });
  });
});

describe("the page's look", () => {
  const sheet = (watchSettingsStyles as unknown as { cssText: string }).cssText.replace(/\/\*[\s\S]*?\*\//g, "");
  const rule = (sel: string) => {
    const at = sheet.indexOf(`${sel} {`);
    if (at < 0) throw new Error(`no ${sel}`);
    return sheet.slice(at, sheet.indexOf("}", at));
  };

  it("scrolls under a bar that stays at the top, so Save is always in reach", () => {
    expect(rule(".ws-page")).toContain("overflow: auto");
    expect(rule(".ws-top")).toContain("position: sticky; top: 0");
    expect(rule(".ws-top")).toContain("background: var(--wa-bg)");
  });

  it("keeps the side panel at the left edge, the cards filling the room to its right, and is never wider than the page", () => {
    expect(rule(".ws-cols")).toContain("width: min(960px, 100%); margin: 0 auto");
    expect(rule(".ws-cols.one > .ws-body")).toContain("grid-template-columns: repeat(auto-fit, minmax(min(400px, 100%), 1fr))");
    const split = rule(".ws-split");
    expect(split).toContain("width: 100%; margin: 0");
    expect(split).toContain("flex-wrap: wrap");
    const nav = rule(".ws-nav");
    expect(nav).toContain("flex: 0 0 248px");
    expect(nav).toContain("position: sticky");
    expect(nav).not.toContain("order");
    expect(rule(".ws-main")).toContain("flex: 999 1 520px");
    expect(rule(".ws-col")).toContain("min-width: 0; container: xfer / inline-size");
  });

  it("reads only tokens, never a fixed color, and never selects on the dark attribute", () => {
    const page = sheet.slice(sheet.indexOf(".ws-page {"), sheet.indexOf(".ws-body {"));
    expect(page).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(page).not.toMatch(/rgba?\(/);
    expect(sheet).not.toContain("[dark]");
  });

  it("keeps nothing of the dialog", () => {
    expect(sheet).not.toContain("dialog");
    expect(sheet).not.toContain("ws-tabs");
    expect(sheet).not.toContain("xfer-foot");
  });
});

describe("the side panel's groups", () => {
  const cards = SETTINGS_GROUPS.flatMap((g) => g.cards);

  it("puts every card in exactly one group", () => {
    expect(new Set(cards).size).toBe(cards.length);
    const expected = [
      ...WATCH_SETTINGS_CATALOG.sections.map((s) => s.id),
      ...NOTIFICATION_STYLE_SECTIONS.map((s) => s.id),
      "pair", "cert",
    ];
    expect([...cards].sort()).toEqual([...expected].sort());
  });

  it("gives every group a name, a line and a unique id", () => {
    expect(new Set(SETTINGS_GROUPS.map((g) => g.id)).size).toBe(SETTINGS_GROUPS.length);
    for (const g of SETTINGS_GROUPS) {
      expect(g.title).not.toBe("");
      expect(g.blurb).toMatch(/\.$/);
      expect(groupOfCard(g.cards[0]!)).toBe(g);
    }
  });

  it("falls back to the first group for an id it does not know", () => {
    expect(settingsGroup("sounds").id).toBe("sounds");
    expect(settingsGroup("nope")).toBe(SETTINGS_GROUPS[0]);
    expect(settingsGroup(undefined)).toBe(SETTINGS_GROUPS[0]);
  });

  it("searches for every word, in any case, anywhere in the words given", () => {
    expect(searchTerms("  Page   DOTS ")).toEqual(["page", "dots"]);
    expect(searchTerms("   ")).toEqual([]);
    expect(matchesSearch([], ["anything"])).toBe(true);
    expect(matchesSearch(["dots"], ["Page dots", undefined])).toBe(true);
    expect(matchesSearch(["page", "dots"], ["Page dots"])).toBe(true);
    expect(matchesSearch(["page", "pinch"], ["Page dots"])).toBe(false);
    expect(matchesSearch(["swip"], ["Swipe the bottom edge"])).toBe(true);
  });
});
