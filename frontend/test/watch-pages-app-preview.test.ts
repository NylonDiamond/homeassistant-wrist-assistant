// The plumbing of part 3f batch 2: the two home wide Home Assistant calls,
// which templates the page editor renders and how it keeps their answers,
// and the preview of the template, music hub and webhook inbox tiles as
// their watch views draw them.

import { svg } from "lit";
import { describe, expect, it } from "vitest";

import { type HassEntityState, type HassLike, type RenderResult, fetchCloudStatus, fetchConfigEntries } from "../src/ha-api.js";
import type { IconProvider } from "../src/renderer.js";
import {
  MUSIC_ASSISTANT_DOMAIN,
  type WatchTemplateRender,
  watchCloudTTSAvailable,
  watchHasConfigEntry,
  watchMergedRenders,
  watchMusicHubActiveSpeaker,
  watchTemplateRender,
  watchTemplateRequests,
  watchTemplateSignature,
} from "../src/watch-pages/app-model.js";
import { type WatchPage, type WatchPageTile, tileSymbol } from "../src/watch-pages/model.js";
import {
  WATCH_TEMPLATE_PLACEHOLDER_SYMBOL,
  renderWatchTileFace,
  watchSpecialTileLook,
  watchTemplateFontSize,
  watchTemplateTileLook,
  watchTilePreviewActive,
} from "../src/watch-pages/preview.js";
import { watchThemeRoleColors } from "../src/watch-pages/tile-new.js";

/** A `hass` whose socket answers with `reply` and keeps what was sent. */
function socket(reply: (message: Record<string, unknown>) => unknown) {
  const sent: Record<string, unknown>[] = [];
  const hass = {
    states: {},
    connection: {
      async sendMessagePromise<T>(message: Record<string, unknown>): Promise<T> {
        sent.push(structuredClone(message));
        return reply(message) as T;
      },
      async subscribeMessage() {
        return async () => undefined;
      },
    },
  } as HassLike;
  return { hass, sent };
}

/** The Music Assistant entry as Home Assistant 2026.9 lists it. */
const MUSIC_ENTRY = {
  created_at: 1742012260.9, entry_id: "01JPC0B8JB2EQF3DTM9X9E2H9V", domain: "music_assistant", modified_at: 1784329875.2,
  title: "Music Assistant", source: "zeroconf", state: "loaded", supports_options: false, supports_remove_device: true,
  supports_unload: true, supports_reconfigure: false, supported_subentry_types: {}, pref_disable_new_entities: false,
  pref_disable_polling: false, disabled_by: null, reason: null, error_reason_translation_domain: null,
  error_reason_translation_key: null, error_reason_translation_placeholders: null, num_subentries: 0,
};

describe("the home wide calls", () => {
  it("ask config_entries/get by domain alone, never with a type filter", async () => {
    const { hass, sent } = socket(() => [MUSIC_ENTRY]);
    const entries = await fetchConfigEntries(hass, MUSIC_ASSISTANT_DOMAIN);
    expect(sent).toEqual([{ type: "config_entries/get", domain: "music_assistant" }]);
    expect(entries).toEqual([MUSIC_ENTRY]);
  });

  it("ask cloud/status with nothing else", async () => {
    const { hass, sent } = socket(() => ({ logged_in: false, http_use_ssl: false }));
    expect(await fetchCloudStatus(hass)).toEqual({ logged_in: false, http_use_ssl: false });
    expect(sent).toEqual([{ type: "cloud/status" }]);
  });

  it("pass a refusal on to the caller", async () => {
    const { hass } = socket(() => { throw { code: "unknown_command", message: "Unknown command." }; });
    await expect(fetchCloudStatus(hass)).rejects.toEqual({ code: "unknown_command", message: "Unknown command." });
  });

  it("count any Music Assistant entry, in any state, as the phone does", () => {
    expect(watchHasConfigEntry([MUSIC_ENTRY], MUSIC_ASSISTANT_DOMAIN)).toBe(true);
    expect(watchHasConfigEntry([{ ...MUSIC_ENTRY, state: "setup_error" }], MUSIC_ASSISTANT_DOMAIN)).toBe(true);
    expect(watchHasConfigEntry([{ ...MUSIC_ENTRY, state: "not_loaded", disabled_by: "user" }], MUSIC_ASSISTANT_DOMAIN)).toBe(true);
    expect(watchHasConfigEntry([], MUSIC_ASSISTANT_DOMAIN)).toBe(false);
    // Another domain's entry, or a reply that is no list, is none.
    expect(watchHasConfigEntry([{ ...MUSIC_ENTRY, domain: "mass" }], MUSIC_ASSISTANT_DOMAIN)).toBe(false);
    for (const junk of [undefined, null, {}, "music_assistant", [null, 3]]) expect(watchHasConfigEntry(junk, MUSIC_ASSISTANT_DOMAIN)).toBe(false);
  });

  it("let the cloud speak only while logged in and connected", () => {
    // The box's answer on 2026.9.4: logged in, the link down.
    expect(watchCloudTTSAvailable({ logged_in: true, cloud: "disconnected", active_subscription: false, prefs: {} })).toBe(false);
    expect(watchCloudTTSAvailable({ logged_in: true, cloud: "connecting" })).toBe(false);
    expect(watchCloudTTSAvailable({ logged_in: true, cloud: "connected" })).toBe(true);
    expect(watchCloudTTSAvailable({ logged_in: false, cloud: "connected" })).toBe(false);
    expect(watchCloudTTSAvailable({ logged_in: "true", cloud: "connected" })).toBe(false);
    for (const junk of [undefined, null, [], "connected"]) expect(watchCloudTTSAvailable(junk)).toBe(false);
  });
});

const PAGE_ID = "P";
const pageOf = (...items: WatchPageTile[]): WatchPage => ({ id: PAGE_ID, name: "Page", items, themeOverride: "ember" });

describe("which templates the editor renders", () => {
  it("asks for each template tile of the page with a text, by tile id", () => {
    const page = pageOf(
      { id: "A", entityId: "template.A", templateString: "{{ 1 + 1 }}" },
      { id: "B", entityId: "template.B", templateString: "" },
      { id: "C", entityId: "template.C", templateString: "   " },
      { id: "D", entityId: "template.D" },
      { id: "E", entityId: "light.desk", templateString: "{{ 2 }}" },
      { entityId: "template.F", templateString: "{{ 3 }}" },
      { id: "G", entityId: "template.G", templateString: "Hi\n[icon:sun.max]" },
      { id: "A", entityId: "template.A2", templateString: "{{ second }}" },
    );
    expect(watchTemplateRequests(page)).toEqual({ A: "{{ 1 + 1 }}", G: "Hi\n[icon:sun.max]" });
    expect(watchTemplateRequests(undefined)).toEqual({});
    expect(watchTemplateRequests(pageOf())).toEqual({});
  });

  it("asks again only when the set of tiles and texts changes, not their order", () => {
    const a = watchTemplateSignature({ A: "x", B: "y" });
    expect(watchTemplateSignature({ B: "y", A: "x" })).toBe(a);
    expect(watchTemplateSignature({ A: "x", B: "y!" })).not.toBe(a);
    expect(watchTemplateSignature({ A: "x" })).not.toBe(a);
    expect(watchTemplateSignature({ A: "x", C: "y" })).not.toBe(a);
  });

  it("lays an answer over the last renders, keeping a tile it leaves out, each with its text", () => {
    const held = new Map<string, WatchTemplateRender>([
      ["A", { text: "a", result: { ok: true, value: "1" } }],
      ["B", { text: "b", result: { ok: true, value: "2" } }],
    ]);
    const next = watchMergedRenders(held, { A: "a2", C: "c" }, { A: { ok: false, error: "UndefinedError: 'foo' is undefined" }, C: { ok: true, value: "3" } });
    expect([...next]).toEqual([
      ["A", { text: "a2", result: { ok: false, error: "UndefinedError: 'foo' is undefined" } }],
      ["B", { text: "b", result: { ok: true, value: "2" } }],
      ["C", { text: "c", result: { ok: true, value: "3" } }],
    ]);
    // The held map is never changed; junk in an answer, and an answer for a
    // tile that was not asked, are skipped.
    expect(held.get("A")).toEqual({ text: "a", result: { ok: true, value: "1" } });
    const requests = { A: "a", B: "b" };
    expect([...watchMergedRenders(held, requests, { A: { ok: true } as unknown as RenderResult, B: null as unknown as RenderResult })]).toEqual([...held]);
    expect([...watchMergedRenders(held, requests, { Z: { ok: true, value: "9" } })]).toEqual([...held]);
  });

  it("shows a render only while the tile's text is the one it was asked for", () => {
    const renders = new Map<string, WatchTemplateRender>([["A", { text: "{{ 1 }}", result: { ok: true, value: "1" } }]]);
    const tile = (templateString: string): WatchPageTile => ({ id: "A", entityId: "template.A", templateString });
    expect(watchTemplateRender(renders, tile("{{ 1 }}"))).toEqual({ ok: true, value: "1" });
    // Edited: the old value never shows under the new text, so the tile
    // draws "..." until the new answer (or forever after a failed call).
    expect(watchTemplateRender(renders, tile("{{ 2 }}"))).toBeUndefined();
    expect(watchTemplateTileLook(tile("{{ 2 }}"), { page: pageOf(), templates: renders })).toMatchObject({ kind: "text", text: "...", pending: true });
    // Typed back: the last value for that text shows again.
    expect(watchTemplateTileLook(tile("{{ 1 }}"), { page: pageOf(), templates: renders })).toMatchObject({ text: "1", pending: false });
    expect(watchTemplateRender(undefined, tile("{{ 1 }}"))).toBeUndefined();
    expect(watchTemplateRender(renders, { entityId: "template.A", templateString: "{{ 1 }}" })).toBeUndefined();
  });
});

const state = (entityId: string, value: string, attributes: Record<string, unknown> = {}): Record<string, HassEntityState> => ({
  [entityId]: { entity_id: entityId, state: value, attributes, last_changed: "", last_updated: "" },
});

/** A template's text with its values, for a look at what it draws. */
function text(t: unknown): string {
  if (typeof t === "symbol" || t === null || t === undefined) return "";
  if (Array.isArray(t)) return t.map(text).join("");
  if (typeof t !== "object") return String(t);
  const r = t as { strings?: readonly string[]; values?: unknown[] };
  if (r.strings === undefined) return "";
  return r.strings.map((s, i) => s + (i < (r.values?.length ?? 0) ? text(r.values![i]) : "")).join("");
}

/** A provider that draws only the names it is given, each as its name and
 * color. */
const icons = (...names: string[]): IconProvider => ({
  render: (symbol: string, _size: number, color: string) => (names.includes(symbol) ? svg`<title>${symbol} ${color}</title>` : undefined),
  available: () => true,
  names: () => names,
});

describe("the app tiles' names in the preview", () => {
  const draw = (t: WatchPageTile) =>
    text(renderWatchTileFace(t, { width: 90, height: 90 }, { page: pageOf(), pages: [], screen: { width: 198, height: 242 }, scale: 1 }, 21));

  it("draws the watch's name and no second line for speak, assist and point control", () => {
    const speak = draw({ id: "S", entityId: "speak_message.voice_hub" });
    expect(speak).toContain(">Speak<");
    expect(speak).not.toContain("Speak message");
    expect(speak).not.toContain("wp-state");
    const point = draw({ id: "P", entityId: "point_control.X" });
    expect(point).toContain(">Point Control<");
    expect(point).not.toContain("wp-state");
    expect(draw({ id: "A", entityId: "assist.voice_hub" })).not.toContain("wp-state");
  });

  it("draws a page link with its name alone, as the watch does", () => {
    for (const entityId of ["page.X"]) {
      const drawn = draw({ id: "G", entityId });
      expect(drawn.match(/class="wp-label"/g), entityId).toHaveLength(1);
      expect(drawn, entityId).not.toContain("wp-state");
      expect(drawn, entityId).not.toContain("wp-badge");
    }
  });
});

describe("a template tile in the preview", () => {
  const page = pageOf();
  // The page is ember; a tile's own default is sunnyBeachDay's all the same.
  const sensor = watchThemeRoleColors("sunnyBeachDay").entitySensor!;
  const tile = (extra: Record<string, unknown> = {}): WatchPageTile => ({ id: "T", entityId: "template.T", templateString: "{{ x }}", icon: "star", customLabel: "Mine", ...extra });
  const renders = (result?: RenderResult) => new Map<string, WatchTemplateRender>(result === undefined ? [] : [["T", { text: "{{ x }}", result }]]);
  const face = (t: WatchPageTile, result?: RenderResult, provider?: IconProvider) =>
    text(renderWatchTileFace(t, { width: 90, height: 60 }, { page, pages: [], screen: { width: 198, height: 242 }, scale: 1, icons: provider, templates: renders(result) }, 21));

  it("is drawn with the phone's add symbol when it has no template", () => {
    expect(tileSymbol({ entityId: "template.T" })).toBe("chevron.left.forwardslash.chevron.right");
    expect(watchTemplateTileLook(tile({ templateString: undefined }), { page })).toEqual({ kind: "placeholder", symbol: WATCH_TEMPLATE_PLACEHOLDER_SYMBOL, ink: sensor });
    expect(watchTemplateTileLook(tile({ templateString: "" }), { page })).toEqual({ kind: "placeholder", symbol: WATCH_TEMPLATE_PLACEHOLDER_SYMBOL, ink: sensor });
    const drawn = face(tile({ templateString: "" }), undefined, icons(WATCH_TEMPLATE_PLACEHOLDER_SYMBOL, "star"));
    expect(drawn).toContain("opacity:0.4");
    // Drawn, the tile has the color the sync rules give a template: white.
    expect(drawn).toContain(`${WATCH_TEMPLATE_PLACEHOLDER_SYMBOL} #FFFFFF`);
    // Never its own icon or label.
    expect(drawn).not.toContain("star");
    expect(drawn).not.toContain("Mine");
  });

  it("says ... until its first answer, then the value in the tile's color", () => {
    expect(watchTemplateTileLook(tile(), { page })).toEqual({ kind: "text", text: "...", multiLine: false, ink: sensor, pending: true });
    expect(watchTemplateTileLook(tile({ color: "#FF8800" }), { page, templates: renders({ ok: true, value: "21" }) }))
      .toEqual({ kind: "text", text: "21", multiLine: false, ink: "#FF8800", pending: false });
    const two = watchTemplateTileLook(tile(), { page, templates: renders({ ok: true, value: "A\n\nB" }) });
    expect(two).toMatchObject({ kind: "text", multiLine: true });
    expect(face(tile())).toContain("...");
    const drawn = face(tile(), { ok: true, value: "21 lights" });
    expect(drawn).toContain("21 lights");
    expect(drawn).toContain("text-align:center");
    expect(drawn).toContain("color:#FFFFFF");
    expect(drawn).not.toContain("Mine");
    expect(face(tile(), { ok: true, value: "A\nB" })).toContain("text-align:left");
  });

  it("draws an error as the yellow warning triangle", () => {
    expect(watchTemplateTileLook(tile(), { page, templates: renders({ ok: false, error: "TemplateSyntaxError: x" }) }))
      .toEqual({ kind: "error", error: "TemplateSyntaxError: x" });
    const drawn = face(tile(), { ok: false, error: "TemplateSyntaxError: x" }, icons("exclamationmark.triangle"));
    expect(drawn).toContain("exclamationmark.triangle #FFCC00");
    expect(drawn).not.toContain("...");
  });

  it("draws a text of white space alone as an empty line, without asking", () => {
    expect(watchTemplateTileLook(tile({ templateString: "  " }), { page })).toEqual({ kind: "text", text: "", multiLine: false, ink: sensor, pending: false });
  });

  it("draws each [icon:] marker as a symbol in its own color or the text's", () => {
    const drawn = face(tile(), { ok: true, value: "[icon:lightbulb.fill color:yellow] 20 on [icon:power] [icon:nope color:red]" }, icons("lightbulb.fill", "power"));
    expect(drawn).toContain("lightbulb.fill #FFCC00");
    expect(drawn).toContain("power #FFFFFF");
    expect(drawn).toContain(" 20 on ");
    expect(drawn).not.toContain("nope");
    expect(drawn).not.toContain("[icon:");
    // An eight digit color's opacity.
    expect(face(tile(), { ok: true, value: "[icon:power color:#FF880080]" }, icons("power"))).toContain("opacity:0.502");
  });

  it("shrinks its text to fit five lines, down to 40% of the body size", () => {
    expect(watchTemplateFontSize("21", 80, 50)).toBe(16);
    const long = watchTemplateFontSize("Living room 21 °C, kitchen 19 °C, bedroom 18 °C", 80, 50);
    expect(long).toBeLessThan(16);
    expect(long).toBeGreaterThanOrEqual(6.4);
    expect(watchTemplateFontSize("x\n".repeat(40), 20, 10)).toBe(6.4);
  });
});

describe("a music hub tile in the preview", () => {
  const page = pageOf();
  const hub = (extra: Record<string, unknown> = {}): WatchPageTile => ({
    id: "M", entityId: "music_hub.M", musicHubSpeakerIds: ["media_player.kitchen", "media_player.gone", "media_player.office"], ...extra,
  });
  const look = (t: WatchPageTile, states?: Record<string, HassEntityState>) => watchSpecialTileLook(t, { page, states });
  const art = "/api/media_player_proxy/media_player.office?token=1";
  const playing = { ...state("media_player.kitchen", "idle"), ...state("media_player.office", "playing", { media_title: "So What", entity_picture: art }) };

  it("rests with its symbol and name while no speaker plays, pauses or idles", () => {
    const states = { ...state("media_player.kitchen", "off"), ...state("media_player.office", "unavailable") };
    expect(watchMusicHubActiveSpeaker(hub(), states)).toBeUndefined();
    expect(look(hub(), states)).toMatchObject({ symbol: "music.note.house", filled: true, ink: { hex: "#E89545", alpha: 1 }, active: false, topRight: undefined, label: "Music", art: undefined });
    expect(look(hub({ icon: "hifispeaker", color: "#00FF00", customLabel: "  Den " }), states)).toMatchObject({ symbol: "hifispeaker", ink: { hex: "#00FF00", alpha: 1 }, label: "  Den " });
    expect(look(hub({ customLabel: "   " }), states)?.label).toBe("Music");
    expect(look(hub({ icon: "" }), states)?.symbol).toBeUndefined();
    expect(watchTilePreviewActive(hub(), states)).toBe(false);
  });

  it("shows the first playing speaker, else paused, else idle, skipping one Home Assistant lacks", () => {
    expect(watchMusicHubActiveSpeaker(hub(), playing)).toEqual({ entityId: "media_player.office", state: "playing", title: "So What", picture: art });
    const paused = { ...state("media_player.kitchen", "idle"), ...state("media_player.office", "PAUSED") };
    expect(watchMusicHubActiveSpeaker(hub(), paused)).toEqual({ entityId: "media_player.office", state: "paused" });
    expect(watchMusicHubActiveSpeaker(hub(), state("media_player.kitchen", "idle", { media_title: "" }))).toEqual({ entityId: "media_player.kitchen", state: "idle" });
    expect(watchMusicHubActiveSpeaker(hub({ musicHubSpeakerIds: "media_player.office" }), playing)).toBeUndefined();
    expect(watchMusicHubActiveSpeaker(hub(), undefined)).toBeUndefined();
  });

  it("plays: pause symbol, the title over its own name, a play badge, the album art", () => {
    expect(look(hub({ customLabel: "Den" }), playing)).toMatchObject({
      symbol: "pause.fill", active: true, topRight: "play.fill", label: "So What", art,
    });
    expect(watchTilePreviewActive(hub(), playing)).toBe(true);
    // Album art off, or no activity badge.
    expect(look(hub({ showAlbumArt: false }), playing)?.art).toBeUndefined();
    expect(look(hub({ showActivityStatus: false }), playing)?.topRight).toBeUndefined();
  });

  it("pauses or idles: play symbol and a pause badge, its own name with no title", () => {
    const idle = state("media_player.kitchen", "idle");
    expect(look(hub({ customLabel: "Den" }), idle)).toMatchObject({ symbol: "play.fill", topRight: "pause.fill", label: "Den", art: undefined });
  });

  it("draws the album art filling the tile with the name in white, and no symbol", () => {
    const drawn = text(renderWatchTileFace(hub(), { width: 90, height: 90 }, {
      page, pages: [], screen: { width: 198, height: 242 }, scale: 1, states: playing, icons: icons("pause.fill", "play.fill"),
    }, 21));
    expect(drawn).toContain("wp-art");
    expect(drawn).toContain(art);
    expect(drawn).toContain("So What");
    expect(drawn).toContain("color:#FFFFFF");
    expect(drawn).not.toContain("<title>pause.fill");
    expect(drawn).toContain("<title>play.fill");
  });
});

describe("a webhook inbox tile in the preview", () => {
  const page = pageOf();
  const look = (t: WatchPageTile) => watchSpecialTileLook(t, { page });

  it("draws its tray in the info color (sunnyBeachDay's, whatever the page's theme), named after its topic", () => {
    expect(look({ id: "W", entityId: "webhook_inbox.all" })).toMatchObject({ symbol: "tray", filled: true, ink: { hex: "#4BBDE0", alpha: 1 }, label: "Inbox", active: true });
    expect(look({ id: "W", entityId: "webhook_inbox.alerts" })?.label).toBe("#alerts");
    expect(look({ id: "W", entityId: "webhook_inbox." })?.label).toBe("Inbox");
    expect(look({ id: "W", entityId: "webhook_inbox.alerts", customLabel: "Door" })?.label).toBe("Door");
    expect(look({ id: "W", entityId: "webhook_inbox.all", icon: "bell", color: "#112233" })).toMatchObject({ symbol: "bell", ink: { hex: "#112233", alpha: 1 } });
    expect(look({ id: "W", entityId: "webhook_inbox.all", icon: "" })?.symbol).toBeUndefined();
  });
});
