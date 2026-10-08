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
import { PairWatchCard } from "../src/watch-pair-view.js";
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
 * stay out), a save over the revision held, a code lookup with the new watch
 * (`lookup` adds to what it finds), and a confirm with it paired, refused
 * when it lacks a key `confirmWants` names. A QR offer answers with a link,
 * and its state is whatever `offerState` holds. */
function fakeHass(newWatch: string, opts: {
  pickUser?: boolean;
  boundUser?: string;
  lookup?: Record<string, unknown>;
  confirmWants?: "replace" | "allow_remote";
  offerState?: { state: string; device_name?: string; user_id?: string };
} = {}) {
  const sent: Record<string, unknown>[] = [];
  const store = new Map<string, WatchConfigRecord>();
  const hass = {
    user: { id: "root", is_admin: true, name: "Jesse" },
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
          // Only an integration whose confirm takes a user sends `bound_user_id`.
          const bound = opts.pickUser ? { bound_user_id: opts.boundUser ?? null } : {};
          return { found: true, watch_id: newWatch, device_name: "New Watch", expires_in: 300, already_paired: false, paired_by_other_user: false, ...bound, ...opts.lookup };
        }
        if (type === "config/auth/list") {
          return [
            { id: "sup", name: "Supervisor", is_active: true, system_generated: true, group_ids: ["system-admin"] },
            { id: "chen", name: "Chen", is_active: true, system_generated: false, group_ids: ["system-users"] },
            { id: "root", name: "Jesse", is_active: true, system_generated: false, is_owner: true, group_ids: ["system-admin"] },
          ];
        }
        if (type.endsWith("/confirm")) {
          const wants = opts.confirmWants;
          if (wants !== undefined && msg[wants] !== true) {
            throw Object.assign(new Error(`${wants} required`), { code: wants === "replace" ? "needs_replace" : "needs_allow_remote" });
          }
          return { ok: true, watch_id: newWatch, device_name: "New Watch", result: "new" };
        }
        if (type.endsWith("/pair/offer")) {
          return { offer_id: "off1", url: "wristassistant://pair#v=1&i=abc&t=TOKEN&u=http%3A%2F%2F192.168.1.4%3A8123", expires_in: 300 };
        }
        if (type.endsWith("/pair/offer_status")) return opts.offerState ?? { state: "open" };
        if (type.endsWith("/pair/offer_cancel")) return null;
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
  pairCard: PairInside;
  edit(setting: CatalogSetting, value: unknown): void;
  askDiscard(): void;
}

/** The Settings page's "Pair a device" card (`watch-pair-view.ts`). */
interface PairInside {
  pair: {
    code: string; found?: Record<string, unknown>; users?: readonly { id: string; label: string }[]; userId?: string; done?: string;
    error?: string; asked?: { replace?: boolean; remote?: boolean };
  };
  offer: { usersRead: boolean; users?: readonly { id: string; label: string }[]; userId?: string; open?: { id: string; url: string }; expired?: boolean; done?: string; error?: string };
  setMode(mode: "code" | "qr"): void;
  setPairCode(raw: string): string;
  pickPairUser(userId: string): void;
  tickPair(box: "replace" | "remote", on: boolean): void;
  lookUpPair(): Promise<void>;
  confirmPair(): Promise<void>;
  pickOfferUser(userId: string): void;
  setOfferReplace(on: boolean): void;
  showOffer(): Promise<void>;
  pollOffer(): Promise<void>;
  polling: boolean;
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

  async function page(current = "w2", list: readonly OwnerSummary[] = WATCHES, hassOpts: Parameters<typeof fakeHass>[1] = {}) {
    const ha = fakeHass("w3", hassOpts);
    let owners: OwnerSummary[] = [...list];
    let refreshes = 0;
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
      async () => { refreshes++; return owners; },
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
      refreshes: () => refreshes,
      text: () => flatten(ws.render(ha.hass, owners)),
      bar: () => flatten(ws.renderBar()),
      addWatch(o: OwnerSummary) { owners = [...owners, o]; },
    };
  }

  it("draws a page with its bar and no watch tabs, on the watch it is handed", async () => {
    const { ws, inside, text } = await page("w2");
    const shown = text();
    expect(shown).toContain(`<div class="ws-page" style=`);
    expect(shown).toContain(`role="toolbar" aria-label="Watch settings"`);
    expect(shown).not.toContain("ws-tabs");
    expect(shown).not.toContain("<dialog");
    expect(shown).toContain("Chen's Watch · revision 1");
    expect(shown).toContain(`<div class="ws-cols " style=`);
    expect(inside.ownerId).toBe("w2");
    expect(ws.shown).toBe(true);
  });

  it("says the settings come from the main house on a home that is not it, and keeps the pairing card", async () => {
    const elsewhere = [owner("w1", "Jesse's Watch"), { ...owner("w2", "Chen's Watch"), main_house: false }];
    const { text, bar } = await page("w2", elsewhere);
    const shown = text();
    expect(shown).toContain("This watch takes its settings from your main house. Change them there.");
    expect(shown).toContain(`<div class="ws-cols one" style=`);
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
    opened.inside.pairCard.pair = { code: "ABCDEF", found: { found: true, watch_id: "w3", device_name: "New Watch", code: "ABCDEF" } };
    await opened.inside.pairCard.confirmPair();
    await settle();
    expect(opened.inside.confirm).toBeUndefined();
    expect(opened.paired).toEqual(["w3"]);
    expect(opened.inside.ownerId).toBe("w3");
    expect(opened.ha.sent.some((m) => String(m.type).endsWith("/confirm"))).toBe(true);
    expect(keptSettingsDraft("w2")?.edits.get("wrapPages")).toBe(!wrap.default);
  });

  describe("whose watch it is", () => {
    const confirms = (sent: Record<string, unknown>[]) => sent.filter((m) => String(m.type).endsWith("/confirm"));

    async function lookedUp(hassOpts: Parameters<typeof fakeHass>[1]) {
      const opened = await page("w2", WATCHES, hassOpts);
      opened.inside.pairCard.setPairCode("ABCDEF");
      await opened.inside.pairCard.lookUpPair();
      return opened;
    }

    it("asks, with nobody picked and Pair held until someone is, and pairs for the person picked", async () => {
      const { inside, ha, text } = await lookedUp({ pickUser: true });
      const shown = text();
      expect(shown).toContain("Pair a device");
      expect(shown).toContain("Whose watch is this?");
      expect(shown).toContain("Choose a person");
      expect(shown).toContain(">Jesse (you) · Admin</option>");
      expect(shown).toContain(">Chen · User</option>");
      expect(shown).not.toContain("Supervisor");
      expect(shown).toContain("their iPhone gets its Fast alerts");
      expect(shown.indexOf("Jesse (you)")).toBeLessThan(shown.indexOf(">Chen · User<"));
      expect(inside.pairCard.pair.userId).toBeUndefined();
      expect(shown).toContain(`ws-pair-go" ?disabled=true`);

      // Pair does nothing while nobody is picked.
      await inside.pairCard.confirmPair();
      expect(confirms(ha.sent)).toHaveLength(0);

      inside.pairCard.pickPairUser("chen");
      expect(text()).toContain(`ws-pair-go" ?disabled=false`);
      expect(text()).not.toContain("Choose a person");
      await inside.pairCard.confirmPair();
      const confirm = confirms(ha.sent)[0]!;
      expect(confirm.user_id).toBe("chen");
      expect(inside.pairCard.pair.done).toBe("Paired New Watch for Chen.");
    });

    it("sends no user when the administrator picks themself", async () => {
      const { inside, ha } = await lookedUp({ pickUser: true });
      inside.pairCard.pickPairUser("root");
      await inside.pairCard.confirmPair();
      const confirm = confirms(ha.sent)[0]!;
      expect("user_id" in confirm).toBe(false);
      expect("replace" in confirm).toBe(false);
      expect("allow_remote" in confirm).toBe(false);
      expect(inside.pairCard.pair.done).toBe("Paired New Watch for Jesse.");
    });

    it("starts on the person a known watch already belongs to", async () => {
      const { inside, ha } = await lookedUp({ pickUser: true, boundUser: "chen" });
      expect(inside.pairCard.pair.userId).toBe("chen");
      await inside.pairCard.confirmPair();
      expect(confirms(ha.sent)[0]!.user_id).toBe("chen");
    });

    it("leaves the question out for an integration whose confirm takes no user", async () => {
      const { inside, ha, text } = await lookedUp({});
      expect(text()).not.toContain("Whose watch is this?");
      expect(ha.sent.some((m) => m.type === "config/auth/list")).toBe(false);
      await inside.pairCard.confirmPair();
      expect("user_id" in confirms(ha.sent)[0]!).toBe(false);
    });

    it("holds Pair for a paired watch until Replace is ticked, then sends replace", async () => {
      const { inside, ha, text } = await lookedUp({ lookup: { already_paired: true } });
      expect(text()).toContain("This watch is already paired.");
      expect(text()).toContain("Replace its pairing");
      expect(text()).not.toContain("I expect this watch");
      expect(text()).toContain(`ws-pair-go" ?disabled=true`);
      await inside.pairCard.confirmPair();
      expect(confirms(ha.sent)).toHaveLength(0);
      inside.pairCard.tickPair("replace", true);
      await inside.pairCard.confirmPair();
      expect(confirms(ha.sent)[0]!.replace).toBe(true);
      expect("allow_remote" in confirms(ha.sent)[0]!).toBe(false);
    });

    it("holds Pair for a request from outside until I expect this watch is ticked, then sends allow_remote", async () => {
      const { inside, ha, text } = await lookedUp({ lookup: { remote: "203.0.113.7", age_seconds: 4 } });
      expect(text()).toContain("The request came from outside your network.");
      expect(text()).toContain("I expect this watch");
      expect(text()).not.toContain("Replace its pairing");
      inside.pairCard.tickPair("remote", true);
      await inside.pairCard.confirmPair();
      expect(confirms(ha.sent)[0]!.allow_remote).toBe(true);
      expect("replace" in confirms(ha.sent)[0]!).toBe(false);
    });

    it("shows the box the server asks for when the lookup did not call for it", async () => {
      const { inside, ha, text } = await lookedUp({ confirmWants: "allow_remote" });
      expect(text()).not.toContain("I expect this watch");
      await inside.pairCard.confirmPair();
      expect(inside.pairCard.pair.error).toBe("The request came from outside your network. Tick I expect this watch to pair it.");
      expect(inside.pairCard.pair.asked?.remote).toBe(true);
      expect(text()).toContain("I expect this watch");
      expect(text()).toContain(`ws-pair-go" ?disabled=true`);
      inside.pairCard.tickPair("remote", true);
      await inside.pairCard.confirmPair();
      expect(confirms(ha.sent)).toHaveLength(2);
      expect(inside.pairCard.pair.done).toBe("Paired New Watch.");
    });

    it("names an iPhone that shows a code as an iPhone", async () => {
      const { inside, ha, text, paired } = await lookedUp({ pickUser: true, boundUser: "chen", lookup: { kind: "iphone", device_name: null } });
      const shown = text();
      expect(shown).toContain("<span>iPhone</span>");
      expect(shown).toContain(">iPhone</div>");
      expect(shown).toContain("Whose iPhone is this?");
      expect(shown).toContain("The iPhone runs with this person's rights.");
      await inside.pairCard.confirmPair();
      expect(confirms(ha.sent)[0]!.user_id).toBe("chen");
      expect(inside.pairCard.pair.done).toBe("Paired New Watch for Chen.");
      // An iPhone is not a watch the page could move to.
      await settle();
      expect(paired).toEqual([]);
    });
  });

  describe("showing a QR code", () => {
    const offers = (sent: Record<string, unknown>[]) => sent.filter((m) => String(m.type).endsWith("/pair/offer"));
    const cancels = (sent: Record<string, unknown>[]) => sent.filter((m) => String(m.type).endsWith("/pair/offer_cancel"));
    const polls = (sent: Record<string, unknown>[]) => sent.filter((m) => String(m.type).endsWith("/pair/offer_status"));

    afterEach(() => {
      vi.useRealTimers();
    });

    async function qrMode(hassOpts: Parameters<typeof fakeHass>[1] = {}) {
      const opened = await page("w2", WATCHES, hassOpts);
      opened.inside.pairCard.setMode("qr");
      await vi.waitFor(() => expect(opened.inside.pairCard.offer.usersRead).toBe(true));
      return opened;
    }

    it("asks whose iPhone it is, each with its account type, and holds Show QR code until someone is picked", async () => {
      const { inside, ha, text, ws } = await qrMode();
      const shown = text();
      expect(shown).toContain("Show a QR code");
      expect(shown).toContain("Scan QR code");
      expect(shown).toContain("Whose iPhone is this?");
      expect(shown).toContain("Choose a person");
      expect(shown).toContain(">Jesse (you) · Admin</option>");
      expect(shown).toContain(">Chen · User</option>");
      expect(shown).toContain(`ws-qr-show" ?disabled=true`);
      await inside.pairCard.showOffer();
      expect(offers(ha.sent)).toHaveLength(0);
      inside.pairCard.pickOfferUser("chen");
      expect(text()).toContain(`ws-qr-show" ?disabled=false`);
      ws.leave();
    });

    it("shows the code, its link and a countdown, asks every two seconds, and says who was paired", async () => {
      vi.useFakeTimers({ toFake: ["setInterval", "clearInterval", "Date"] });
      const opened = await qrMode();
      const { inside, ha, text } = opened;
      inside.pairCard.pickOfferUser("chen");
      inside.pairCard.setOfferReplace(true);
      await inside.pairCard.showOffer();
      const offer = offers(ha.sent)[0]!;
      expect(offer.user_id).toBe("chen");
      expect(offer.replace).toBe(true);
      expect("kind" in offer).toBe(false);
      const shown = text();
      expect(shown).toContain(`aria-label="QR code for pairing an iPhone"`);
      expect(shown).toMatch(/<path d=M4 4h7v1h-7z/);
      expect(shown).toContain(`href=wristassistant://pair#v=1&i=abc&t=TOKEN`);
      expect(shown).toContain("Open in Wrist Assistant");
      expect(shown).toContain("Runs out in 5:00");
      // While it is open, the person and the box stay as they were.
      expect(shown).not.toContain("ws-qr-show");

      vi.advanceTimersByTime(1000);
      expect(text()).toContain("Runs out in 4:59");
      expect(polls(ha.sent)).toHaveLength(0);
      vi.advanceTimersByTime(1000);
      expect(polls(ha.sent)).toHaveLength(1);
      expect(polls(ha.sent)[0]!.offer_id).toBe("off1");
      await vi.waitFor(() => expect(inside.pairCard.polling).toBe(false));
      expect(inside.pairCard.offer.open).toBeDefined();

      opened.addWatch({ ...owner("p1", "Chen's iPhone"), device_kind: "iphone" } as OwnerSummary);
      const reads = opened.refreshes();
      // The phone scans it: the next question finds it redeemed.
      const hass = ha.hass as unknown as { connection: { sendMessagePromise(msg: Record<string, unknown>): Promise<unknown> } };
      const real = hass.connection.sendMessagePromise.bind(hass.connection);
      hass.connection.sendMessagePromise = async (msg) => String(msg.type).endsWith("/offer_status")
        ? (ha.sent.push(msg), { state: "redeemed", device_name: "Chen's iPhone", user_id: "chen", device_id: "p1" })
        : real(msg);
      vi.advanceTimersByTime(2000);
      await vi.waitFor(() => expect(inside.pairCard.offer.done).toBe("Paired Chen's iPhone for Chen."));
      expect(inside.pairCard.offer.open).toBeUndefined();
      expect(text()).toContain("Paired Chen's iPhone for Chen.");
      // The device list is read again, as after a code.
      await vi.waitFor(() => expect(opened.refreshes()).toBe(reads + 1));
      // Ticking has stopped: no more questions, and nothing to cancel.
      const asked = polls(ha.sent).length;
      vi.advanceTimersByTime(10_000);
      expect(polls(ha.sent)).toHaveLength(asked);
      opened.ws.leave();
      expect(cancels(ha.sent)).toHaveLength(0);
      // The panel is not moved to an iPhone.
      expect(opened.paired).toEqual([]);
    });

    it("says the code ran out, and offers a new one", async () => {
      const { inside, text, ws } = await qrMode({ offerState: { state: "expired" } });
      inside.pairCard.pickOfferUser("root");
      await inside.pairCard.showOffer();
      await inside.pairCard.pollOffer();
      expect(inside.pairCard.offer.open).toBeUndefined();
      expect(inside.pairCard.offer.expired).toBe(true);
      expect(text()).toContain("This code ran out. Show a new one.");
      expect(text()).toContain(`ws-qr-show" ?disabled=false`);
      ws.leave();
    });

    it("sends no user for the administrator at the card", async () => {
      const { inside, ha, ws } = await qrMode();
      inside.pairCard.pickOfferUser("root");
      await inside.pairCard.showOffer();
      const offer = offers(ha.sent)[0]!;
      expect("user_id" in offer).toBe(false);
      expect("replace" in offer).toBe(false);
      ws.leave();
    });

    it("withdraws an open code when the mode changes, and when the page is left", async () => {
      const { inside, ha, ws } = await qrMode();
      inside.pairCard.pickOfferUser("chen");
      await inside.pairCard.showOffer();
      inside.pairCard.setMode("code");
      expect(cancels(ha.sent)).toEqual([{ type: "wrist_assistant/pair/offer_cancel", offer_id: "off1" }]);
      expect(inside.pairCard.offer.open).toBeUndefined();

      inside.pairCard.setMode("qr");
      // The people are read once a visit; nobody is picked again.
      expect(inside.pairCard.offer.usersRead).toBe(true);
      expect(inside.pairCard.offer.userId).toBeUndefined();
      inside.pairCard.pickOfferUser("chen");
      await inside.pairCard.showOffer();
      ws.leave();
      expect(cancels(ha.sent)).toHaveLength(2);
    });

    it("asks for a newer integration when it knows no QR codes", async () => {
      const { inside, ha, ws } = await qrMode();
      const hass = ha.hass as unknown as { connection: { sendMessagePromise(msg: Record<string, unknown>): Promise<unknown> } };
      const real = hass.connection.sendMessagePromise.bind(hass.connection);
      hass.connection.sendMessagePromise = async (msg) => String(msg.type).endsWith("/pair/offer")
        ? Promise.reject(Object.assign(new Error("Unknown command."), { code: "unknown_command" }))
        : real(msg);
      inside.pairCard.pickOfferUser("chen");
      await inside.pairCard.showOffer();
      expect(inside.pairCard.offer.error).toBe("Update the Wrist Assistant integration to pair an iPhone with a QR code.");
      expect(inside.pairCard.offer.open).toBeUndefined();
      ws.leave();
    });
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
    expect(first).toContain(`<div class="ws-cols one" style=`);
    expect(first).toContain(`data-sec="ws-pair"`);
    expect(first).toContain("No watch paired yet");
    // No Save while there is no watch to save for.
    expect(first).not.toContain(`class="primary save`);
    owners = [owner("w9", "First Watch")];
    inside.pairCard.pair = { code: "ABCDEF", found: { found: true, watch_id: "w9", device_name: "First Watch", code: "ABCDEF" } };
    await inside.pairCard.confirmPair();
    await settle();
    expect(paired).toEqual(["w9"]);
    expect(inside.ownerId).toBe("w9");
    // The panel then hands the page the new watch, which it already shows.
    const reads = ha.sent.length;
    ws.show(ha.hass, owners, "w9");
    expect(ha.sent).toHaveLength(reads);
  });
});

describe("Home's Pair a device dialog card", () => {
  const offers = (sent: Record<string, unknown>[]) => sent.filter((m) => String(m.type).endsWith("/pair/offer"));
  const cancels = (sent: Record<string, unknown>[]) => sent.filter((m) => String(m.type).endsWith("/pair/offer_cancel"));
  type Card = PairInside & {
    open(hass: HassLike, start?: { mode?: "code" | "qr"; showQr?: boolean }): void;
    close(): void;
    render(options?: { bare?: boolean }): unknown;
  };

  it("opens on the QR code, already showing one for the administrator at the card", async () => {
    const ha = fakeHass("w9");
    const card = new PairWatchCard(() => undefined) as unknown as Card;
    card.open(ha.hass, { mode: "qr", showQr: true });
    await vi.waitFor(() => expect(card.offer.open).toBeDefined());
    expect(offers(ha.sent)).toHaveLength(1);
    expect("user_id" in offers(ha.sent)[0]!).toBe(false);
    expect(card.offer.userId).toBe("root");
    const shown = flatten(card.render({ bare: true }));
    expect(shown).toContain(`aria-label="QR code for pairing an iPhone"`);
    expect(shown).not.toContain("sec-h");
    expect(shown.indexOf("Show a QR code")).toBeLessThan(shown.indexOf("Type a code"));
    card.close();
    expect(cancels(ha.sent)).toHaveLength(1);
  });

  it("makes a new code when another person is picked, withdrawing the old one", async () => {
    const ha = fakeHass("w9");
    const card = new PairWatchCard(() => undefined) as unknown as Card;
    card.open(ha.hass, { mode: "qr", showQr: true });
    await vi.waitFor(() => expect(card.offer.open).toBeDefined());
    card.pickOfferUser("chen");
    await vi.waitFor(() => expect(offers(ha.sent)).toHaveLength(2));
    expect(offers(ha.sent)[1]!.user_id).toBe("chen");
    expect(cancels(ha.sent)).toEqual([{ type: "wrist_assistant/pair/offer_cancel", offer_id: "off1" }]);
    card.close();
  });

  it("still opens on Type a code, with no code made, where nothing asks for one", () => {
    const ha = fakeHass("w9");
    const card = new PairWatchCard(() => undefined) as unknown as Card;
    card.open(ha.hass);
    expect(card.offer.usersRead).toBe(false);
    expect(offers(ha.sent)).toHaveLength(0);
    expect(flatten(card.render())).toContain("ws-pair-code");
  });
});
