// The Template, Music, Assist and Speak cards write in sentence case, as the
// rest of the panel does, with no developer words, and name the device the
// editor is for ("watch" or "iPhone") where a line names one.

import { describe, expect, it } from "vitest";

import { SymbolBrowser } from "../src/symbols.js";
import { WatchPagesDraft } from "../src/watch-pages/draft.js";
import { NO_ICONS, type TileSettingsHost } from "../src/watch-pages/editor-host.js";
import type { WatchPage, WatchPageTile, WatchPagesDocument } from "../src/watch-pages/model.js";
import { renderTileSettings } from "../src/watch-pages/tile-settings.js";

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

/** A tile host as the page editor builds one, for `device`. */
function tileHost(item: WatchPageTile, device?: "watch" | "iphone"): TileSettingsHost {
  const draft = new WatchPagesDraft({ schemaVersion: 1, pages: [{ id: PAGE_ID, name: "Living", items: [item] }] }, 1);
  const pageNow = () => (draft.document.pages as WatchPage[])[0]!;
  return {
    hass: { states: {} },
    icons: NO_ICONS,
    symbols: new SymbolBrowser(() => undefined),
    get document() { return draft.document; },
    device,
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
    get tile() { return ((pageNow().items as WatchPageTile[] | undefined) ?? []).find((t) => t.id === TILE_ID) ?? ({} as WatchPageTile); },
  } as unknown as TileSettingsHost;
}

const drawn = (entityId: string, extra: Record<string, unknown> = {}, device?: "watch" | "iphone") =>
  text(renderTileSettings(tileHost({ id: TILE_ID, entityId, ...extra }, device)));

/** The Title Case and developer words these cards used to show. */
const OLD_WORDS = [
  "Jinja2",
  "Tap to edit template",
  "SF Symbols",
  "Conversation Agent",
  "Start Listening Immediately",
  "Speakers Shown on Watch",
  "Voice Engine",
  "Speech Volume",
  "Voice Input",
  "Assist Mode",
  "Reply Speaker",
  "Other Media Players",
  "Show Album Art",
  "Speaker Presets",
  "Music Assistant integration",
  "grouping on watch",
  "speaker list on watch",
  "show on watch",
  "Prompts on watch",
];

describe("the app cards' words", () => {
  it("the Template card: one label, a real template for a placeholder, one hint", () => {
    const t = drawn("template.outside", { templateString: "" });
    expect(t).toContain("Template");
    expect(t).toContain("{{ states('sensor.outside_temperature') }}°");
    expect(t).toContain("Add an icon with [icon:lightbulb.fill]. Color it with [icon:snowflake color:blue].");
    for (const old of OLD_WORDS) expect(t, old).not.toContain(old);
  });

  it("the Music card: no Music Assistant requirement, the device named", () => {
    const watch = drawn("music_hub.living");
    expect(watch).toContain("Show album art");
    expect(watch).toContain("No speakers yet. Add the ones you want to group from the watch.");
    expect(watch).toContain("Optional quick picks shown above the speaker list on the watch.");
    expect(watch).not.toContain("Speakers you can group from");
    for (const old of OLD_WORDS) expect(watch, old).not.toContain(old);
    const phone = drawn("music_hub.living", { musicHubSpeakerIds: ["media_player.kitchen"] }, "iphone");
    expect(phone).toContain("Speakers you can group from the iPhone.");
    expect(phone).toContain("on the iPhone.");
    expect(phone).not.toMatch(/\bwatch\b/i);
  });

  it("the Assist card", () => {
    const t = drawn("assist.voice_hub", { assistPrimaryAction: "assistAndSpeakReply", assistSpeakTargetMode: "configuredSpeakers" });
    for (const words of ["Conversation agent", "Assist mode", "Silent reply", "Reply speaker", "Choose speakers", "Voice engine", "Speech volume", "Voice input", "Start listening right away"]) {
      expect(t, words).toContain(words);
    }
    for (const old of OLD_WORDS) expect(t, old).not.toContain(old);
    expect(drawn("assist.voice_hub", {}, "iphone")).toContain("see the reply on your iPhone.");
  });

  it("the Speak card names the device whose list it is", () => {
    const watch = drawn("speak_message.voice_hub", { speakMessageOutputMode: "chooseEachTime" });
    expect(watch).toContain("Choose on watch");
    expect(watch).toContain("Speakers shown on the watch");
    expect(watch).toContain("Pick at least one speaker to show on the watch for this tile.");
    for (const old of OLD_WORDS) expect(watch, old).not.toContain(old);
    const phone = drawn("speak_message.voice_hub", { speakMessageOutputMode: "chooseEachTime" }, "iphone");
    expect(phone).toContain("Choose on iPhone");
    expect(phone).toContain("Speakers shown on the iPhone");
    expect(phone).toContain("Asks on the iPhone which of this tile's speakers to use.");
  });
});
