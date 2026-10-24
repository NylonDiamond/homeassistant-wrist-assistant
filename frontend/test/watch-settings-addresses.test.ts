// A watch's two addresses on the Watch app's Settings page: first in the
// Connection card, the same short block and form as on Home, saved by the
// page's own Save with the rest, only the slots that changed. They show for
// any watch, one whose settings come from another home included, never for
// an iPhone, and the settings search finds them.
//
// No DOM: the page's templates are flattened to text, over a stand-in Home
// Assistant connection that holds the behavior record and the addresses.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { DeviceAddresses, HassLike, OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import { WatchSettings } from "../src/watch-settings-view.js";
import { dropWatchSettingsDrafts, keptChanges, keptSettingsDraft } from "../src/watch-settings-draft.js";
import { SETTINGS_GROUPS } from "../src/watch-settings-nav.js";
import { type CatalogSetting, catalogSettings, watchBehaviorDefaults } from "../src/watch-settings.js";
import { ADDRESSES_PAGE_SAVE_NOTE, type AddressSlot } from "../src/device-addresses.js";

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

const LOCAL = "http://homeassistant.local:8123";
const EXTERNAL = "https://ha.example.com";
const refusal = (code: string, message = code) => Object.assign(new Error(message), { code });

function behavior(revision = 3): WatchConfigRecord {
  return {
    kind: "behavior", revision, hash: "h", updated_at: null, updated_by: "w1",
    delivered_revision: revision, delivered_at: null, document: watchBehaviorDefaults(),
  };
}

function addresses(over: Partial<DeviceAddresses> = {}): DeviceAddresses {
  return {
    ok: true, watch_id: "w1", local_url: LOCAL, remote_url: EXTERNAL, local_source: "auto", remote_source: "auto",
    hash: "0123456789abcdef", detected: { internal: LOCAL, external: EXTERNAL, cloud: null }, ...over,
  };
}

/** The behavior record and the addresses. `setAddresses` may answer a set
 * itself; by default the slots sent are applied the way the integration
 * applies them. */
function fakeHass(opts: { held?: DeviceAddresses; readFails?: boolean; setAddresses?: (msg: Record<string, unknown>) => Promise<DeviceAddresses> } = {}) {
  let held = opts.held ?? addresses();
  const sent: Record<string, unknown>[] = [];
  const hass = {
    user: { is_admin: true },
    states: {},
    connection: {
      async sendMessagePromise(msg: Record<string, unknown>): Promise<unknown> {
        sent.push(msg);
        const type = String(msg.type);
        if (type === "wrist_assistant/devices/addresses") {
          if (opts.readFails) throw refusal("unknown_error", "The read timed out");
          return structuredClone(held);
        }
        if (type === "wrist_assistant/devices/set_addresses") {
          if (opts.setAddresses) return opts.setAddresses(msg);
          const slot = (key: "local_url" | "remote_url", source: "local_source" | "remote_source") => {
            if (!(key in msg)) return;
            const v = msg[key] as string | null;
            held = { ...held, [key]: v === null ? (key === "local_url" ? held.detected.internal : held.detected.external) : v === "" ? null : v,
              [source]: v === null ? "auto" : v === "" ? "none" : "set" };
          };
          slot("local_url", "local_source");
          slot("remote_url", "remote_source");
          return structuredClone(held);
        }
        if (msg.kind === "behavior" && type.endsWith("/get")) return behavior();
        if (msg.kind === "behavior" && type.endsWith("/save")) return { revision: 4 };
        throw refusal("invalid", `unknown kind ${String(msg.kind)}`);
      },
      async subscribeMessage() {
        return async () => undefined;
      },
    },
  } as unknown as HassLike;
  return {
    hass,
    sets: () => sent.filter((m) => m.type === "wrist_assistant/devices/set_addresses"),
    reads: () => sent.filter((m) => m.type === "wrist_assistant/devices/addresses"),
    saves: () => sent.filter((m) => String(m.type).endsWith("/save")),
  };
}

const owner = (id: string, over: Partial<OwnerSummary> = {}): OwnerSummary => ({
  owner_watch_id: id, device_name: "Apple Watch", device_kind: "watch", paired_iphone_name: null, app_version: "3.1.0",
  screen_size: null, complication_count: 0, token: 1, is_orphan: false, ...over,
} as OwnerSummary);

interface Inside {
  loading: boolean;
  group: string;
  query: string;
  note?: { kind: string; text: string };
  addressDraft?: unknown;
  save(): Promise<void>;
  edit(setting: CatalogSetting, value: unknown): void;
  editAddresses(): void;
  editAddressSlot(slot: AddressSlot, change: { mode?: "auto" | "set" | "none"; text?: string }): void;
  cancelAddresses(): void;
  discard(): void;
  changesByGroup(): Map<string, number>;
  renderBar(): unknown;
}

describe("the addresses on the Settings page", () => {
  const realWindow = (globalThis as { window?: unknown }).window;
  beforeEach(() => {
    (globalThis as { window?: unknown }).window = { setTimeout: () => 1, clearTimeout: () => undefined };
  });
  afterEach(() => {
    (globalThis as { window?: unknown }).window = realWindow;
    dropWatchSettingsDrafts();
  });

  async function page(opts: Parameters<typeof fakeHass>[0] = {}, owners: OwnerSummary[] = [owner("w1")], phones = false) {
    const ha = fakeHass(opts);
    const host = {
      addController: () => undefined,
      removeController: () => undefined,
      requestUpdate: () => undefined,
      updateComplete: Promise.resolve(true),
      renderRoot: { querySelector: () => null },
    };
    const heard: { id: string; record: DeviceAddresses }[] = [];
    const ws = new WatchSettings(host as unknown as ConstructorParameters<typeof WatchSettings>[0], undefined, undefined, undefined,
      (id, record) => heard.push({ id, record }));
    ws.show(ha.hass, owners, owners[0]!.owner_watch_id, phones);
    const inside = ws as unknown as Inside;
    await vi.waitFor(() => expect(inside.loading).toBe(false));
    const connection = () => {
      inside.group = "connection";
      return flatten(ws.render(ha.hass, owners));
    };
    return { ws, inside, ha, heard, connection, bar: () => flatten(inside.renderBar()), owners };
  }

  it("reads them with the records and shows them first in the Connection card, one line each with Edit", async () => {
    const { ha, connection } = await page();
    expect(ha.reads()).toEqual([{ type: "wrist_assistant/devices/addresses", watch_id: "w1" }]);
    const text = connection();
    expect(text).toContain(`data-key="addresses"`);
    expect(text.indexOf(`data-key="addresses"`)).toBeLessThan(text.indexOf("data-key=serverMode"));
    expect(text).toContain("<dt>Home network</dt>");
    expect(text).toContain("<dt>Internet</dt>");
    expect(text).toContain(LOCAL);
    expect(text).toContain(EXTERNAL);
    expect(text.split(">Automatic</span>").length - 1).toBe(2);
    expect(text).toContain(">Edit</button>");
    // No form until Edit.
    expect(text).not.toContain("dev-addr-slot");
  });

  it("opens the form on Edit with no Save of its own, and a change joins the page's Save", async () => {
    const { inside, connection, bar } = await page();
    inside.editAddresses();
    const open = connection();
    expect(open).toContain("dev-addr-slot");
    expect(open).toContain(ADDRESSES_PAGE_SAVE_NOTE);
    expect(open).not.toContain(`type="submit"`);
    // Opening alone changes nothing.
    expect(bar()).toContain("?disabled=true");
    inside.editAddressSlot("remote", { text: "https://other.example.com" });
    expect(bar()).toContain("1 unsaved change");
    expect(bar()).toContain("?disabled=false");
    expect(bar()).toContain("primary save dirty");
    expect(inside.changesByGroup().get("connection")).toBe(1);
  });

  it("saves only the slot that changed with the page's Save, closes the form, and tells Home", async () => {
    const { inside, ha, heard, connection } = await page();
    inside.editAddresses();
    inside.editAddressSlot("remote", { text: " https://other.example.com " });
    await inside.save();
    expect(ha.sets()).toEqual([{ type: "wrist_assistant/devices/set_addresses", watch_id: "w1", remote_url: "https://other.example.com" }]);
    // Nothing else changed, so no record was saved.
    expect(ha.saves()).toHaveLength(0);
    expect(inside.addressDraft).toBeUndefined();
    const text = connection();
    expect(text).toContain("https://other.example.com");
    expect(text.split(">Automatic</span>").length - 1).toBe(1);
    expect(heard.map((h) => [h.id, h.record.remote_url])).toEqual([["w1", "https://other.example.com"]]);
  });

  it("sends the addresses beside a behavior change under the one Save", async () => {
    const { inside, ha } = await page();
    const mode = catalogSettings().find((s) => s.key === "serverMode")!;
    inside.edit(mode, "Remote");
    inside.editAddresses();
    inside.editAddressSlot("local", { mode: "none" });
    await inside.save();
    expect(ha.saves()).toHaveLength(1);
    expect(ha.sets()).toEqual([{ type: "wrist_assistant/devices/set_addresses", watch_id: "w1", local_url: "" }]);
  });

  it("stops the whole Save over a typed address that will not do, sending nothing", async () => {
    const { inside, ha } = await page();
    const mode = catalogSettings().find((s) => s.key === "serverMode")!;
    inside.edit(mode, "Remote");
    inside.editAddresses();
    inside.editAddressSlot("local", { text: "homeassistant.local" });
    await inside.save();
    expect(ha.sets()).toHaveLength(0);
    expect(ha.saves()).toHaveLength(0);
    expect(inside.note?.kind).toBe("err");
    expect(inside.note?.text).toBe("Not saved. Home network address: Start the address with http:// or https://.");
  });

  it("keeps the form and says why when the integration refuses the address", async () => {
    const { inside } = await page({ setAddresses: async () => { throw refusal("invalid_url", "remote_url must be http"); } });
    inside.editAddresses();
    inside.editAddressSlot("remote", { text: "https://bad.example.com" });
    await inside.save();
    expect(inside.addressDraft).toBeDefined();
    expect(inside.note?.text).toMatch(/^The internet address cannot be used\./);
  });

  it("typing into a field on Automatic or None switches it to Set", async () => {
    const { inside, bar } = await page({ held: addresses({ remote_source: "none", remote_url: null }) });
    inside.editAddresses();
    inside.editAddressSlot("remote", { text: "https://x.example.com" });
    inside.editAddressSlot("local", { text: "http://10.0.0.5:8123" });
    expect(bar()).toContain("2 unsaved changes");
  });

  it("Cancel and Discard throw the address changes away", async () => {
    const { inside, bar } = await page();
    inside.editAddresses();
    inside.editAddressSlot("remote", { mode: "none" });
    inside.cancelAddresses();
    expect(inside.addressDraft).toBeUndefined();
    expect(bar()).toContain("?disabled=true");
    inside.editAddresses();
    inside.editAddressSlot("remote", { mode: "none" });
    inside.discard();
    expect(inside.addressDraft).toBeUndefined();
  });

  it("keeps an unsaved address change for the watch while the page is away, and counts it for the leave guards", async () => {
    const { ws, inside, ha, owners } = await page();
    inside.editAddresses();
    inside.editAddressSlot("remote", { mode: "none" });
    ws.leave();
    const kept = keptSettingsDraft("w1");
    expect(kept).toBeDefined();
    expect(keptChanges(kept!)).toBe(1);
    ws.show(ha.hass, owners, "w1");
    await vi.waitFor(() => expect(inside.loading).toBe(false));
    expect(inside.addressDraft).toEqual({ local: { mode: "auto", text: "" }, remote: { mode: "none", text: "" } });
  });

  it("is found by the settings search", async () => {
    const { ws, inside, ha, owners } = await page();
    for (const word of ["address", "Addresses", "internet", "URL"]) {
      inside.query = word;
      const found = flatten(ws.render(ha.hass, owners));
      expect(found, word).toContain(`data-key="addresses"`);
    }
    inside.query = "address";
    // Where to connect does not name an address, so only the addresses row shows.
    expect(flatten(ws.render(ha.hass, owners))).not.toContain("data-key=serverMode");
  });

  it("shows for a watch whose settings come from another home", async () => {
    const owners = [owner("w1", { main_house: false } as Partial<OwnerSummary>)];
    const { ws, ha } = await page({}, owners);
    const text = flatten(ws.render(ha.hass, owners));
    expect(text).toContain(`data-key="addresses"`);
    expect(text).toContain(LOCAL);
  });

  it("is not read or shown for an iPhone", async () => {
    const owners = [owner("p1", { device_kind: "iphone", phone_pages: true } as Partial<OwnerSummary>)];
    const { ws, ha } = await page({}, owners, true);
    expect(ha.reads()).toHaveLength(0);
    const all = SETTINGS_GROUPS.map((g) => {
      (ws as unknown as Inside).group = g.id;
      return flatten(ws.render(ha.hass, owners));
    }).join("");
    expect(all).not.toContain(`data-key="addresses"`);
  });

  it("says when they could not be read, and the rest of the page still works", async () => {
    const { connection } = await page({ readFails: true });
    const text = connection();
    expect(text).toContain("Could not read the addresses:");
    expect(text).not.toContain(">Edit</button>");
    expect(text).toContain("data-key=serverMode");
  });
});
