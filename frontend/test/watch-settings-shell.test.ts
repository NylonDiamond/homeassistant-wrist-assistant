// Watch settings as the Watch app's Settings page, under the row that owns
// the watch: no tabs of its own, the row's watch followed on every draw, each
// watch's unsaved edits kept while another is shown or the page is left, the
// bar's Discard and Save (⌘S included), and pairing, which moves the page and
// the panel's shared watch to the new watch without asking.
//
// No DOM: the controller is driven over a stand-in Home Assistant and its
// template read by flattening it.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { HassLike, OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import { WatchSettings } from "../src/watch-settings-view.js";
import { type CatalogSetting, catalogSettings, watchBehaviorDefaults } from "../src/watch-settings.js";
import { SETTINGS_MOVED_TEXT, anyWatchSettingsDirty, dropWatchSettingsDrafts, keptSettingsDraft } from "../src/watch-settings-draft.js";

interface Tpl {
  strings: readonly string[];
  values: unknown[];
}

const isTpl = (node: unknown): node is Tpl => typeof node === "object" && node !== null && "strings" in node && "values" in node;

function flatten(node: unknown): string {
  if (node === undefined || node === null || typeof node === "symbol") return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (isTpl(node)) return node.strings.map((s, i) => s + (i < node.values.length ? flatten(node.values[i]) : "")).join("");
  if (typeof node === "function" || typeof node === "object") return "";
  return String(node);
}

const owner = (id: string, name: string): OwnerSummary => ({
  owner_watch_id: id,
  device_name: name,
  device_kind: "watch",
  paired_iphone_name: null,
  app_version: "3.1.0",
  screen_size: null,
  complication_count: 0,
  token: 1,
  is_orphan: false,
} as OwnerSummary);

const behavior = (revision: number, extra: Record<string, unknown> = {}): WatchConfigRecord => ({
  kind: "behavior", revision, hash: "h", updated_at: null, updated_by: "panel",
  delivered_revision: revision, delivered_at: null, document: { ...watchBehaviorDefaults(), ...extra },
});

const setting = (key: string): CatalogSetting => {
  const s = catalogSettings().find((x) => x.key === key);
  if (s === undefined) throw new Error(`no setting ${key}`);
  return s;
};

/** Answers a settings read with the watch's behavior record (the
 * notification style is refused as an older integration does, so its cards
 * stay out), a save over the revision held, a code lookup with the new watch,
 * and a confirm with it paired. */
function fakeHass(newWatch: string) {
  const sent: Record<string, unknown>[] = [];
  const store = new Map<string, WatchConfigRecord>();
  const hass = {
    user: { is_admin: true },
    states: {},
    connection: {
      async sendMessagePromise(msg: Record<string, unknown>): Promise<unknown> {
        sent.push(msg);
        const type = String(msg.type);
        const id = String(msg.owner_watch_id);
        if (type.endsWith("watch_config/get")) {
          if (msg.kind !== "behavior") throw Object.assign(new Error("unknown kind"), { code: "invalid" });
          return structuredClone(store.get(id) ?? behavior(1));
        }
        if (type.endsWith("watch_config/save")) {
          const held = store.get(id) ?? behavior(1);
          if (msg.base_revision !== held.revision) throw Object.assign(new Error(`stored revision is ${held.revision}`), { code: "conflict" });
          const next = { ...held, revision: held.revision + 1, document: msg.document as Record<string, unknown> };
          store.set(id, next);
          return { revision: next.revision };
        }
        if (type.endsWith("/lookup")) {
          return { found: true, watch_id: newWatch, device_name: "New Watch", expires_in: 300, already_paired: false, paired_by_other_user: false };
        }
        if (type.endsWith("/confirm")) return { ok: true, watch_id: newWatch, device_name: "New Watch", result: "new" };
        throw Object.assign(new Error("unknown"), { code: "unknown_command" });
      },
      async subscribeMessage() {
        return async () => undefined;
      },
    },
  } as unknown as HassLike;
  return { hass, sent, store };
}

interface Inside {
  loading: boolean;
  ownerId?: string;
  edits: ReadonlyMap<string, unknown>;
  note?: { kind: string; text: string };
  confirm?: { label: string; run: () => void };
  pair: { code: string; found?: Record<string, unknown> };
  edit(setting: CatalogSetting, value: unknown): void;
  askDiscard(): void;
  lookUpPair(): Promise<void>;
  confirmPair(): Promise<void>;
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("Watch settings as a page under the Watch app row", () => {
  const realWindow = (globalThis as { window?: unknown }).window;
  beforeEach(() => {
    (globalThis as { window?: unknown }).window = { setTimeout: () => 1, clearTimeout: () => undefined };
  });
  afterEach(() => {
    (globalThis as { window?: unknown }).window = realWindow;
    dropWatchSettingsDrafts();
  });

  const WATCHES = [owner("w1", "Jesse's Watch"), owner("w2", "Chen's Watch")];
  const wrap = setting("wrapPages");

  async function page(current = "w2", list: readonly OwnerSummary[] = WATCHES) {
    const ha = fakeHass("w3");
    let owners: OwnerSummary[] = [...list];
    const paired: string[] = [];
    const host = {
      addController: () => undefined,
      removeController: () => undefined,
      requestUpdate: () => undefined,
      updateComplete: Promise.resolve(true),
      renderRoot: { querySelector: () => null },
    };
    const ws = new WatchSettings(
      host as unknown as ConstructorParameters<typeof WatchSettings>[0],
      async () => owners,
      undefined,
      (id) => { paired.push(id); },
    );
    const inside = ws as unknown as Inside;
    const show = async (id: string | undefined) => {
      ws.show(ha.hass, owners, id);
      await vi.waitFor(() => expect(inside.loading).toBe(false));
    };
    await show(current);
    return {
      ws, inside, ha, paired, show,
      text: () => flatten(ws.render(ha.hass, owners)),
      bar: () => flatten(ws.renderBar()),
      addWatch(o: OwnerSummary) { owners = [...owners, o]; },
    };
  }

  it("draws a page with its bar and no watch tabs, on the watch it is handed", async () => {
    const { ws, inside, text } = await page("w2");
    const shown = text();
    expect(shown).toContain(`<div class="ws-page">`);
    expect(shown).toContain(`role="toolbar" aria-label="Watch settings"`);
    expect(shown).not.toContain("ws-tabs");
    expect(shown).not.toContain("<dialog");
    expect(shown).toContain("Chen's Watch · revision 1");
    expect(shown).toContain(`<div class="ws-cols ">`);
    expect(inside.ownerId).toBe("w2");
    expect(ws.shown).toBe(true);
  });

  it("says the settings come from the main house on a home that is not it, and keeps the pairing card", async () => {
    const elsewhere = [owner("w1", "Jesse's Watch"), { ...owner("w2", "Chen's Watch"), main_house: false }];
    const { text, bar } = await page("w2", elsewhere);
    const shown = text();
    expect(shown).toContain("This watch takes its settings from your main house. Change them there.");
    expect(shown).toContain(`<div class="ws-cols one">`);
    // A bound attribute flattens without its quotes.
    expect(shown).not.toContain("data-sec=ws-connection");
    expect(shown).not.toContain(`data-sec="ws-notification-style"`);
    expect(shown).toContain(`data-sec="ws-pair"`);
    expect(bar()).toContain("Watch settings");

    // The other watch, whose main house this is, gets the editors.
    const main = await page("w1", elsewhere);
    expect(main.text()).not.toContain("takes its settings from your main house");
    expect(main.text()).toContain("data-sec=ws-connection");
  });

  it("reads nothing again while it stays on one watch", async () => {
    const { ws, ha, show } = await page("w2");
    const reads = ha.sent.length;
    await show("w2");
    ws.show(ha.hass, WATCHES, "w2");
    expect(ha.sent).toHaveLength(reads);
  });

  it("follows the row to another watch without asking, and keeps each watch's edits for it", async () => {
    const { inside, show, bar } = await page("w2");
    inside.edit(wrap, !wrap.default);
    expect(bar()).toContain("1 unsaved change");
    expect(anyWatchSettingsDirty()).toBe(true);
    await show("w1");
    expect(inside.confirm).toBeUndefined();
    expect(inside.ownerId).toBe("w1");
    expect(inside.edits.size).toBe(0);
    expect(keptSettingsDraft("w2")?.edits.get("wrapPages")).toBe(!wrap.default);
    await show("w2");
    expect(inside.edits.get("wrapPages")).toBe(!wrap.default);
    expect(inside.note).toBeUndefined();
  });

  it("reads again on the way back, and keeps the edits on top of a copy saved meanwhile", async () => {
    const { ws, inside, ha, show, text } = await page("w2");
    inside.edit(wrap, !wrap.default);
    ws.leave();
    expect(ws.shown).toBe(false);
    // Rooms (or the iPhone) saved the same record meanwhile.
    ha.store.set("w2", behavior(4, { crownSwitchesPages: true }));
    const reads = ha.sent.length;
    await show("w2");
    expect(ha.sent.length).toBeGreaterThan(reads);
    expect(inside.edits.get("wrapPages")).toBe(!wrap.default);
    expect(inside.note).toEqual({ kind: "warn", text: SETTINGS_MOVED_TEXT });
    expect(text()).toContain("revision 4");
  });

  it("asks before Discard throws the edits away", async () => {
    const { inside, bar } = await page();
    inside.edit(wrap, !wrap.default);
    expect(bar()).toContain(">Discard</button>");
    inside.askDiscard();
    expect(inside.confirm?.label).toBe("Discard");
    expect(bar()).toContain("Throw away 1 unsaved change?");
    inside.confirm!.run();
    expect(inside.edits.size).toBe(0);
    expect(anyWatchSettingsDirty()).toBe(false);
    expect(bar()).not.toContain(">Discard</button>");
  });

  it("saves from the keyboard as Save would, and does nothing with nothing to save", async () => {
    const { ws, inside, ha } = await page();
    const saves = () => ha.sent.filter((m) => String(m.type).endsWith("watch_config/save"));
    ws.saveFromKey();
    expect(saves()).toHaveLength(0);
    inside.edit(wrap, !wrap.default);
    ws.saveFromKey();
    await vi.waitFor(() => expect(saves()).toHaveLength(1));
    await vi.waitFor(() => expect(inside.edits.size).toBe(0));
    expect(anyWatchSettingsDirty()).toBe(false);
  });

  it("drops every watch's kept edits when the person agrees to leave the panel", async () => {
    const { ws, inside, show } = await page("w2");
    inside.edit(wrap, !wrap.default);
    await show("w1");
    inside.edit(wrap, !wrap.default);
    ws.dropKept();
    expect(anyWatchSettingsDirty()).toBe(false);
    expect(inside.edits.size).toBe(0);
  });

  it("moves to a watch just paired and hands it to the panel, keeping the edits on the watch shown before", async () => {
    const opened = await page();
    opened.addWatch(owner("w3", "New Watch"));
    opened.inside.edit(wrap, !wrap.default);
    opened.inside.pair = { code: "ABCDEF", found: { found: true, watch_id: "w3", device_name: "New Watch", code: "ABCDEF" } };
    await opened.inside.confirmPair();
    await settle();
    expect(opened.inside.confirm).toBeUndefined();
    expect(opened.paired).toEqual(["w3"]);
    expect(opened.inside.ownerId).toBe("w3");
    expect(opened.ha.sent.some((m) => String(m.type).endsWith("/confirm"))).toBe(true);
    expect(keptSettingsDraft("w2")?.edits.get("wrapPages")).toBe(!wrap.default);
  });

  it("pairs the first watch of a home with none, which then becomes the panel's watch", async () => {
    const ha = fakeHass("w9");
    let owners: OwnerSummary[] = [];
    const paired: string[] = [];
    const host = {
      addController: () => undefined, removeController: () => undefined, requestUpdate: () => undefined,
      updateComplete: Promise.resolve(true), renderRoot: { querySelector: () => null },
    };
    const ws = new WatchSettings(host as unknown as ConstructorParameters<typeof WatchSettings>[0], async () => owners, undefined, (id) => { paired.push(id); });
    ws.show(ha.hass, owners, undefined);
    const inside = ws as unknown as Inside;
    expect(inside.ownerId).toBeUndefined();
    const first = flatten(ws.render(ha.hass, owners));
    expect(first).toContain("No watch has connected to this Home Assistant yet.");
    expect(first).toContain(`<div class="ws-cols one">`);
    expect(first).toContain(`data-sec="ws-pair"`);
    expect(first).toContain("No watch paired yet");
    // No Save while there is no watch to save for.
    expect(first).not.toContain(`class="primary save`);
    owners = [owner("w9", "First Watch")];
    inside.pair = { code: "ABCDEF", found: { found: true, watch_id: "w9", device_name: "First Watch", code: "ABCDEF" } };
    await inside.confirmPair();
    await settle();
    expect(paired).toEqual(["w9"]);
    expect(inside.ownerId).toBe("w9");
    // The panel then hands the page the new watch, which it already shows.
    const reads = ha.sent.length;
    ws.show(ha.hass, owners, "w9");
    expect(ha.sent).toHaveLength(reads);
  });
});
