// The Watch settings dialog with its second record, the notification style:
// both read on open, one Save that sends only what changed, each over its own
// revision, a conflict on one that costs the other nothing, the card in place
// of the three when there is no record yet, and nothing at all from an
// integration that does not keep the kind.
//
// No DOM: the dialog's templates are flattened to text, over a stand-in Home
// Assistant connection that holds one record per kind.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { HassLike, OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import { WatchSettings } from "../src/watch-settings-view.js";
import { type CatalogSetting, catalogSettings, watchBehaviorDefaults } from "../src/watch-settings.js";
import {
  NOTIFICATION_STYLE_SECTIONS,
  STYLE_NO_RECORD_TITLE,
  STYLE_START_BUTTON,
  STYLE_UNREADABLE_TEXT,
  type StyleRow,
  type StyleValue,
  notificationStyleDefaults,
  styleRow,
} from "../src/watch-notification-style/model.js";

const KIND = "notification_style";
const fixture = (name: string) =>
  JSON.parse(readFileSync(join(__dirname, "fixtures-notification-style", name), "utf8")) as Record<string, unknown>;

// ── reading templates ────────────────────────────────────────────────────

interface Tpl {
  strings: readonly string[];
  values: unknown[];
}

function isTpl(node: unknown): node is Tpl {
  return typeof node === "object" && node !== null && "strings" in node && "values" in node;
}

function flatten(node: unknown): string {
  if (node === undefined || node === null || typeof node === "symbol") return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (isTpl(node)) return node.strings.map((s, i) => s + (i < node.values.length ? flatten(node.values[i]) : "")).join("");
  if (typeof node === "function" || typeof node === "object") return "";
  return String(node);
}

// ── a stand-in Home Assistant ────────────────────────────────────────────

const refusal = (code: string, message = code) => Object.assign(new Error(message), { code });

function record(kind: string, revision: number, document?: Record<string, unknown>): WatchConfigRecord {
  return {
    kind,
    revision,
    hash: revision > 0 ? "h" : null,
    updated_at: null,
    updated_by: revision > 0 ? "w1" : null,
    delivered_revision: revision,
    delivered_at: null,
    ...(document === undefined ? {} : { document }),
  };
}

type SaveHook = (msg: Record<string, unknown>, held: Map<string, WatchConfigRecord>) => Promise<{ revision: number }> | undefined;

/** One record per kind. A kind it holds nothing for is refused as an
 * integration without it refuses (`invalid`). `onSave` may answer a save
 * itself; by default the document is stored as the next revision. */
function fakeHass(held: Record<string, WatchConfigRecord>, onSave?: SaveHook) {
  const store = new Map(Object.entries(held));
  const sent: Record<string, unknown>[] = [];
  const hass = {
    user: { is_admin: true },
    states: {},
    connection: {
      async sendMessagePromise(msg: Record<string, unknown>): Promise<unknown> {
        sent.push(msg);
        const type = String(msg.type);
        const kind = String(msg.kind);
        const stored = store.get(kind);
        if (stored === undefined) throw refusal("invalid", `unknown kind ${kind}`);
        if (type.endsWith("/get")) return structuredClone(stored);
        if (type.endsWith("/save")) {
          const answer = onSave?.(msg, store);
          if (answer !== undefined) return answer;
          if (msg.base_revision !== stored.revision) throw refusal("conflict", `stored revision is ${stored.revision}`);
          const next = { ...record(kind, stored.revision + 1, msg.document as Record<string, unknown>), delivered_revision: stored.delivered_revision, updated_by: "panel" };
          store.set(kind, next);
          return { revision: next.revision };
        }
        throw refusal("unknown_command");
      },
      async subscribeMessage() {
        return async () => undefined;
      },
    },
  } as unknown as HassLike;
  return {
    hass,
    store,
    saves: (kind?: string) => sent.filter((m) => String(m.type).endsWith("/save") && (kind === undefined || m.kind === kind)),
    gets: (kind?: string) => sent.filter((m) => String(m.type).endsWith("/get") && (kind === undefined || m.kind === kind)),
  };
}

const owner = (id: string): OwnerSummary => ({
  owner_watch_id: id,
  device_name: "Apple Watch",
  device_kind: "watch",
  paired_iphone_name: null,
  app_version: "3.1.0",
  screen_size: null,
  complication_count: 0,
  token: 1,
  is_orphan: false,
} as OwnerSummary);

interface Inside {
  loading: boolean;
  record?: WatchConfigRecord;
  edits: ReadonlyMap<string, unknown>;
  styleRecord?: WatchConfigRecord;
  styleEdits: ReadonlyMap<string, StyleValue>;
  styleUnsupported: boolean;
  note?: { kind: string; text: string };
  save(): Promise<void>;
  startStyle(): Promise<void>;
  edit(setting: CatalogSetting, value: unknown): void;
  editStyle(row: StyleRow, value: StyleValue): void;
  renderFoot(): unknown;
}

const setting = (key: string): CatalogSetting => {
  const s = catalogSettings().find((x) => x.key === key);
  if (s === undefined) throw new Error(`no setting ${key}`);
  return s;
};

const row = (key: string): StyleRow => {
  const r = styleRow(key);
  if (r === undefined) throw new Error(`no row ${key}`);
  return r;
};

describe("Watch settings with the notification style", () => {
  // The dialog polls for delivery once a save waits; Node has no window to
  // time it with.
  const realWindow = (globalThis as { window?: unknown }).window;
  beforeEach(() => {
    (globalThis as { window?: unknown }).window = { setTimeout: () => 1, clearTimeout: () => undefined };
  });
  afterEach(() => {
    (globalThis as { window?: unknown }).window = realWindow;
  });

  async function dialog(held: Record<string, WatchConfigRecord>, onSave?: SaveHook) {
    const ha = fakeHass(held, onSave);
    const host = {
      addController: () => undefined,
      removeController: () => undefined,
      requestUpdate: () => undefined,
      updateComplete: Promise.resolve(true),
      renderRoot: { querySelector: () => null },
    };
    const ws = new WatchSettings(host as unknown as ConstructorParameters<typeof WatchSettings>[0]);
    const owners = [owner("w1")];
    ws.show(ha.hass, owners, "w1");
    const inside = ws as unknown as Inside;
    await vi.waitFor(() => expect(inside.loading).toBe(false));
    return { ws, inside, ha, text: () => flatten(ws.render(ha.hass, owners)), foot: () => flatten(inside.renderFoot()) };
  }

  const both = (style: Record<string, unknown> = fixture("02-configured.json")) => ({
    behavior: record("behavior", 3, watchBehaviorDefaults()),
    [KIND]: record(KIND, 5, style),
  });

  it("reads both records on open and draws the three cards after the behavior ones", async () => {
    const { ha, text } = await dialog(both());
    expect(ha.gets("behavior")).toHaveLength(1);
    expect(ha.gets(KIND)).toHaveLength(1);
    const shown = text();
    const at = (s: string) => shown.indexOf(s);
    expect(at("data-sec=ws-camera")).toBeGreaterThan(0);
    expect(at("data-sec=ws-notifications")).toBeGreaterThan(at("data-sec=ws-camera"));
    expect(at("data-sec=ws-sounds")).toBeGreaterThan(at("data-sec=ws-notifications"));
    expect(at("data-sec=ws-wristWebhooks")).toBeGreaterThan(at("data-sec=ws-sounds"));
    expect(at(`data-sec="ws-pair"`)).toBeGreaterThan(at("data-sec=ws-wristWebhooks"));
    // The preview leads the Notifications card.
    expect(at('class="ns-pv"')).toBeGreaterThan(at("data-sec=ws-notifications"));
    expect(at('class="ns-pv"')).toBeLessThan(at("data-key=backgroundStyle"));
    for (const r of NOTIFICATION_STYLE_SECTIONS.flatMap((s) => s.groups.flatMap((g) => g.rows))) {
      expect(shown, r.key).toContain(`data-key=${r.key}`);
    }
    expect(shown).toContain("notification style revision 5");
  });

  it("offers no Save after a load with no edit, and sends nothing", async () => {
    const { inside, ha, foot } = await dialog(both());
    expect(foot()).toContain("?disabled=true");
    await inside.save();
    expect(ha.saves()).toHaveLength(0);
  });

  it("saves only the notification style when only it changed, over its own revision", async () => {
    const { inside, ha, foot } = await dialog(both());
    inside.editStyle(row("cornerStyle"), "square");
    inside.editStyle(row("tileTapSound"), "");
    expect(foot()).toContain("2 unsaved changes");
    await inside.save();
    expect(ha.saves("behavior")).toHaveLength(0);
    const saves = ha.saves(KIND);
    expect(saves).toHaveLength(1);
    expect(saves[0]!.base_revision).toBe(5);
    const { tileTapSound: _dropped, ...rest } = fixture("02-configured.json");
    expect(saves[0]!.document).toEqual({ ...rest, cornerStyle: "square" });
    expect(inside.styleRecord?.revision).toBe(6);
    expect(inside.styleEdits.size).toBe(0);
    expect(inside.note).toBeUndefined();
  });

  it("saves only the behavior when only it changed", async () => {
    const { inside, ha } = await dialog(both());
    inside.edit(setting("wrapPages"), true);
    await inside.save();
    expect(ha.saves(KIND)).toHaveLength(0);
    expect(ha.saves("behavior")).toHaveLength(1);
    expect(ha.saves("behavior")[0]!.base_revision).toBe(3);
  });

  it("saves both with one Save, each over its own revision", async () => {
    const { inside, ha, foot } = await dialog(both());
    inside.edit(setting("wrapPages"), true);
    inside.editStyle(row("soundVolume"), 0.8);
    expect(foot()).toContain("2 unsaved changes");
    await inside.save();
    expect(ha.saves("behavior").map((m) => m.base_revision)).toEqual([3]);
    expect(ha.saves(KIND).map((m) => m.base_revision)).toEqual([5]);
    expect((ha.saves(KIND)[0]!.document as Record<string, unknown>).soundVolume).toBe(0.8);
    expect(inside.record?.revision).toBe(4);
    expect(inside.styleRecord?.revision).toBe(6);
    // The pill speaks for both: neither has been collected yet.
    const shown = foot();
    expect(shown).toContain("Waiting to be collected");
    expect(shown).toContain("Settings saved as revision 4.");
    expect(shown).toContain("Notification style saved as revision 6.");
  });

  it("merges the notification style by key on a conflict and still saves the behavior", async () => {
    const theirs = { ...fixture("02-configured.json"), tapAnimation: "flash" };
    let first = true;
    const { inside, ha } = await dialog(both(), (msg, store) => {
      if (msg.kind !== KIND || !first) return undefined;
      first = false;
      store.set(KIND, record(KIND, 7, theirs));
      return Promise.reject(refusal("conflict", "stored revision is 7, save was based on 5"));
    });
    inside.edit(setting("wrapPages"), true);
    inside.editStyle(row("cornerStyle"), "square");
    await inside.save();
    expect(ha.saves("behavior")).toHaveLength(1);
    const styleSaves = ha.saves(KIND);
    expect(styleSaves.map((m) => m.base_revision)).toEqual([5, 7]);
    expect(styleSaves[1]!.document).toEqual({ ...theirs, cornerStyle: "square" });
    expect(inside.styleRecord?.revision).toBe(8);
    expect(inside.record?.revision).toBe(4);
    expect(inside.edits.size).toBe(0);
    expect(inside.styleEdits.size).toBe(0);
    expect(inside.note?.text).toContain("Notification style saved");
  });

  it("keeps the notification style's edits when it cannot save, and the behavior's save stands", async () => {
    const { inside, ha, foot } = await dialog(both(), (msg, store) => {
      if (msg.kind !== KIND) return undefined;
      const stored = store.get(KIND)!;
      store.set(KIND, record(KIND, stored.revision + 1, { ...(stored.document ?? {}), tapAnimation: "flash" }));
      return Promise.reject(refusal("conflict"));
    });
    inside.edit(setting("wrapPages"), true);
    inside.editStyle(row("cornerStyle"), "square");
    await inside.save();
    expect(ha.saves(KIND)).toHaveLength(3);
    expect(inside.record?.revision).toBe(4);
    expect(inside.edits.size).toBe(0);
    expect(inside.styleEdits.get("cornerStyle")).toBe("square");
    // The newest copy read (the third send then met revision 8, unread).
    expect(inside.styleRecord?.revision).toBe(7);
    expect(inside.note?.kind).toBe("warn");
    expect(inside.note?.text).toContain("Your changes are kept");
    expect(foot()).toContain("1 unsaved change");
  });

  it("keeps the notification style's save and edits when the behavior meets a conflict", async () => {
    const { inside, ha } = await dialog(both(), (msg, store) => {
      if (msg.kind !== "behavior") return undefined;
      store.set("behavior", record("behavior", 9, { ...watchBehaviorDefaults(), crownSwitchesPages: true }));
      return Promise.reject(refusal("conflict", "stored revision is 9, save was based on 3"));
    });
    inside.edit(setting("wrapPages"), true);
    inside.editStyle(row("cornerStyle"), "square");
    await inside.save();
    expect(ha.saves(KIND)).toHaveLength(1);
    expect(inside.styleRecord?.revision).toBe(6);
    expect(inside.styleEdits.size).toBe(0);
    expect(inside.record?.revision).toBe(9);
    expect(inside.note?.text).toContain("These settings changed somewhere else (now revision 9)");
  });

  it("hides the three cards when the integration does not keep the kind", async () => {
    const { inside, ha, text, foot } = await dialog({ behavior: record("behavior", 3, watchBehaviorDefaults()) });
    expect(ha.gets(KIND)).toHaveLength(1);
    expect(inside.styleUnsupported).toBe(true);
    const shown = text();
    expect(shown).toContain("data-sec=ws-camera");
    for (const id of ["notifications", "sounds", "wristWebhooks", "notification-style"]) expect(shown).not.toContain(`data-sec=ws-${id}`);
    expect(shown).not.toContain(STYLE_NO_RECORD_TITLE);
    expect(shown).not.toContain("notification style revision");
    expect(foot()).not.toContain("Notification style");
  });

  it("shows one card with Start with the defaults when there is no record, and starts over revision 0", async () => {
    const { inside, ha, text } = await dialog({
      behavior: record("behavior", 3, watchBehaviorDefaults()),
      [KIND]: record(KIND, 0),
    });
    const before = text();
    expect(before).toContain(STYLE_NO_RECORD_TITLE);
    expect(before).toContain(`class="small primary ns-start"`);
    expect(before).toContain(STYLE_START_BUTTON);
    for (const id of ["notifications", "sounds", "wristWebhooks"]) expect(before).not.toContain(`data-sec=ws-${id}`);
    // An edit to the behavior is not lost by starting the other record.
    inside.edit(setting("wrapPages"), true);
    await inside.startStyle();
    const saves = ha.saves(KIND);
    expect(saves).toHaveLength(1);
    expect(saves[0]).toMatchObject({ base_revision: 0, document: notificationStyleDefaults() });
    expect(inside.styleRecord?.revision).toBe(1);
    expect(inside.edits.get("wrapPages")).toBe(true);
    expect(ha.saves("behavior")).toHaveLength(0);
    const after = text();
    expect(after).not.toContain(STYLE_NO_RECORD_TITLE);
    expect(after).toContain("data-sec=ws-sounds");
  });

  it("asks for a pairing when the start is refused as no_record", async () => {
    const { inside, text } = await dialog({
      behavior: record("behavior", 3, watchBehaviorDefaults()),
      [KIND]: record(KIND, 0),
    }, (msg) => (msg.kind === KIND ? Promise.reject(refusal("no_record")) : undefined));
    await inside.startStyle();
    expect(inside.note?.text).toContain("Pair this watch first");
    expect(text()).toContain(STYLE_START_BUTTON);
  });

  it("offers no start over a record it cannot read", async () => {
    const { inside, ha, text } = await dialog({
      behavior: record("behavior", 3, watchBehaviorDefaults()),
      [KIND]: record(KIND, 4),
    });
    const shown = text();
    expect(shown).toContain(STYLE_UNREADABLE_TEXT);
    expect(shown).not.toContain(STYLE_NO_RECORD_TITLE);
    await inside.startStyle();
    expect(ha.saves()).toHaveLength(0);
  });

  it("shows the notification style beside a watch with no behavior record yet", async () => {
    const { text } = await dialog({
      behavior: record("behavior", 0),
      [KIND]: record(KIND, 2, fixture("01-defaults.json")),
    });
    const shown = text();
    expect(shown).toContain("No settings from this watch yet.");
    expect(shown).toContain("data-sec=ws-notifications");
  });

  it("draws the volume with its presets, the sounds as menus and delivery as tiles", async () => {
    const { text } = await dialog(both());
    const shown = text();
    const volume = shown.slice(shown.indexOf("data-key=soundVolume"), shown.indexOf("data-key=buttonPressSound"));
    expect(volume).toContain('aria-label="Volume presets"');
    expect(volume).toMatch(/aria-checked=true class=on\s*@click=>Medium/);
    expect(volume.match(/aria-checked=true/g)).toHaveLength(1);
    const sound = shown.slice(shown.indexOf("data-key=tileTapSound"), shown.indexOf("data-key=menuOpenSound"));
    expect(sound).toContain("<optgroup label=Short>");
    expect(sound).toContain(">None</option>");
    expect(sound).toContain(">Default (Button Press Sound)</option>");
    const delivery = shown.slice(shown.indexOf("data-key=storedDeliveryMode"));
    expect(delivery).toContain('<span class="ws-tile-name">Reliable</span>');
    expect(delivery).toContain("Works without iPhone");
  });
});
