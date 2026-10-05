// Watch settings opened from the panel's Watch app row, which owns the watch:
// no tabs of its own, only the watch it was opened on. The unsaved edits
// guard and the pairing flow work as before, and a watch paired here is
// handed to the panel once the dialog has moved to it.
//
// No DOM: the controller is driven over a stand-in Home Assistant and its
// template read by flattening it.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { HassLike, OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import { WatchSettings } from "../src/watch-settings-view.js";
import { watchBehaviorDefaults } from "../src/watch-settings.js";

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

const BEHAVIOR: WatchConfigRecord = {
  kind: "behavior", revision: 1, hash: "h", updated_at: null, updated_by: "panel",
  delivered_revision: 1, delivered_at: null, document: watchBehaviorDefaults(),
};

/** Answers a settings read with BEHAVIOR (the notification style is refused
 * as an older integration does, so its cards stay out), a code lookup with
 * the new watch, and a confirm with it paired. */
function fakeHass(newWatch: string) {
  const sent: Record<string, unknown>[] = [];
  const hass = {
    user: { is_admin: true },
    states: {},
    connection: {
      async sendMessagePromise(msg: Record<string, unknown>): Promise<unknown> {
        sent.push(msg);
        const type = String(msg.type);
        if (type.endsWith("watch_config/get")) {
          if (msg.kind !== "behavior") throw Object.assign(new Error("unknown kind"), { code: "invalid" });
          return structuredClone(BEHAVIOR);
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
  return { hass, sent };
}

interface Inside {
  loading: boolean;
  ownerId?: string;
  confirm?: { label: string; run: () => void };
  pair: { code: string; found?: Record<string, unknown> };
  guard(label: string, then: () => void): void;
  lookUpPair(): Promise<void>;
  confirmPair(): Promise<void>;
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("Watch settings when the Watch app row owns the watch", () => {
  const realWindow = (globalThis as { window?: unknown }).window;
  beforeEach(() => {
    (globalThis as { window?: unknown }).window = { setTimeout: () => 1, clearTimeout: () => undefined };
  });
  afterEach(() => {
    (globalThis as { window?: unknown }).window = realWindow;
  });

  const WATCHES = [owner("w1", "Jesse's Watch"), owner("w2", "Chen's Watch")];

  async function dialog(shell: boolean, current = "w2") {
    const ha = fakeHass("w3");
    let owners: OwnerSummary[] = [...WATCHES];
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
    ws.show(ha.hass, owners, current, { shell });
    const inside = ws as unknown as Inside;
    await vi.waitFor(() => expect(inside.loading).toBe(false));
    return {
      ws, inside, ha, paired,
      text: () => flatten(ws.render(ha.hass, owners)),
      addWatch(o: OwnerSummary) { owners = [...owners, o]; },
    };
  }

  it("draws the watch tabs on its own, and none when the row owns the watch", async () => {
    const own = await dialog(false);
    expect(own.text()).toContain(`class="pk-tabs ws-tabs"`);
    const shell = await dialog(true);
    const text = shell.text();
    expect(text).not.toContain("ws-tabs");
    // The head still says which watch it is.
    expect(text).toContain("Chen's Watch");
    expect(shell.inside.ownerId).toBe("w2");
    expect(shell.ws.shown).toBe(true);
  });

  it("forgets the row's ownership on the next plain open", async () => {
    const { ws, ha, text } = await dialog(true);
    ws.show(ha.hass, WATCHES, "w1");
    expect(text()).toContain(`class="pk-tabs ws-tabs"`);
  });

  it("still asks before Close or Escape throws away unsaved edits", async () => {
    const { inside } = await dialog(true);
    Object.defineProperty(inside, "dirty", { get: () => true });
    let closed = false;
    inside.guard("Discard and close", () => { closed = true; });
    expect(closed).toBe(false);
    expect(inside.confirm?.label).toBe("Discard and close");
    inside.confirm!.run();
    expect(closed).toBe(true);
  });

  it("moves to a watch just paired and hands it to the panel", async () => {
    const opened = await dialog(true);
    opened.addWatch(owner("w3", "New Watch"));
    opened.inside.pair = { code: "ABCDEF" };
    opened.inside.pair.found = { found: true, watch_id: "w3", device_name: "New Watch", code: "ABCDEF" };
    await opened.inside.confirmPair();
    await settle();
    expect(opened.paired).toEqual(["w3"]);
    expect(opened.inside.ownerId).toBe("w3");
    expect(opened.ha.sent.some((m) => String(m.type).endsWith("/confirm"))).toBe(true);
  });

  it("asks first with edits unsaved, and hands the paired watch over only once the person agrees", async () => {
    const opened = await dialog(true);
    opened.addWatch(owner("w3", "New Watch"));
    Object.defineProperty(opened.inside, "dirty", { get: () => true });
    opened.inside.pair = { code: "ABCDEF", found: { found: true, watch_id: "w3", device_name: "New Watch", code: "ABCDEF" } };
    await opened.inside.confirmPair();
    await settle();
    expect(opened.paired).toEqual([]);
    expect(opened.inside.ownerId).toBe("w2");
    expect(opened.inside.confirm?.label).toBe("Discard and switch");
    opened.inside.confirm!.run();
    expect(opened.paired).toEqual(["w3"]);
    expect(opened.inside.ownerId).toBe("w3");
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
    ws.show(ha.hass, owners, undefined, { shell: true });
    const inside = ws as unknown as Inside;
    expect(inside.ownerId).toBeUndefined();
    expect(flatten(ws.render(ha.hass, owners))).toContain("No watch has connected to this Home Assistant yet.");
    owners = [owner("w9", "First Watch")];
    inside.pair = { code: "ABCDEF", found: { found: true, watch_id: "w9", device_name: "First Watch", code: "ABCDEF" } };
    await inside.confirmPair();
    await settle();
    expect(paired).toEqual(["w9"]);
    expect(inside.ownerId).toBe("w9");
  });
});
