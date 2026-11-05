// Pairing the first device on Home's welcome, on the real panel object and the
// real pairing card. There is no browser here, so nothing is drawn, but the rest
// of the cycle is the real one: the devices come back, Lit runs its update, and
// `updated` closes the card because the welcome is over.

import { ReactiveElement } from "lit";
import { describe, expect, it, vi } from "vitest";

import { WristAssistantPanel } from "../src/panel.js";

// Made in the panel's constructor, and watches what is drawn.
vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });

const row =(id: string, device_kind: string) => ({
  owner_watch_id: id,
  device_name: id,
  device_kind,
  complication_count: 0,
  app_version: "3.2.0",
  has_iphone: false,
});

/** The panel's private parts this test reads. */
interface Panel {
  hass: unknown;
  route: unknown;
  updateComplete: Promise<boolean>;
  enableUpdating(): void;
  welcomePair: {
    visit: number;
    pair: Record<string, unknown>;
    confirmPair(): Promise<void>;
  };
  welcomePairOpen: boolean;
  pairOpen: boolean;
  pairNext?: string;
  devicePaired?: string;
  owners: unknown[];
  linkReady: boolean;
  syncHomeWelcome(): void;
}

async function settle(panel: Panel): Promise<void> {
  // The update that follows the devices may itself ask for another.
  for (let i = 0; i < 5; i++) {
    await panel.updateComplete;
    await new Promise((done) => setTimeout(done, 0));
  }
}

/** A panel on Home in a home with no devices, its welcome card open on a code
 * that pairs `paired` when the Pair button is pressed. */
async function welcome(paired: { id: string; kind: string }) {
  const panel = new WristAssistantPanel() as unknown as Panel;
  const devices: unknown[] = [];
  const hass = {
    user: { id: "u1", is_admin: true },
    states: {},
    connection: {
      async sendMessagePromise<T>(message: { type: string }): Promise<T> {
        if (message.type === "wrist_assistant/complications/owners") {
          return { owners: [...devices], capabilities: [], max_schema_version: 9, token: 1 } as T;
        }
        if (message.type === "wrist_assistant/pair/confirm") {
          devices.push(row(paired.id, paired.kind));
          return { watch_id: paired.id, device_name: paired.id } as T;
        }
        return { records: [], token: 1, max_schema_version: 9, owners: [...devices] } as T;
      },
      subscribeMessage: async () => () => undefined,
      subscribeEvents: async () => () => undefined,
    },
    callWS: async () => ({}),
    callApi: async () => ({}),
  };
  panel.hass = hass as never;
  panel.route = { path: "/devices", prefix: "/wrist-assistant" } as never;
  panel.linkReady = true;
  // Lit's update cycle, without the parts that need a browser: what comes before
  // the drawing, the drawing, and of what comes after it only the welcome's turn,
  // which `updated` runs after every drawing (home-welcome.test.ts holds that).
  const self = panel as unknown as Record<string, unknown>;
  self.renderRoot = {};
  self.willUpdate = () => undefined;
  self.update = (changed: Map<PropertyKey, unknown>) => {
    (ReactiveElement.prototype as unknown as { update(c: unknown): void }).update.call(panel, changed);
  };
  self.firstUpdated = () => undefined;
  self.goTo = () => undefined;
  self.updated = () => panel.syncHomeWelcome();
  panel.enableUpdating();
  await settle(panel);
  return panel;
}

async function pair(panel: Panel, kind: "watch" | "iphone") {
  const card = panel.welcomePair;
  card.pair = {
    code: "ABC123",
    found: { found: true, code: "ABC123", watch_id: "x", kind, device_name: "x", expires_in: 60 },
    users: [],
    userId: "u1",
    asked: {},
    ticked: {},
  };
  await card.confirmPair();
  await settle(panel);
}

describe("pairing the first device on Home's welcome", () => {
  it("has the card open while the home has no devices", async () => {
    const panel = await welcome({ id: "w1", kind: "watch" });
    expect(panel.welcomePairOpen).toBe(true);
    expect(panel.pairOpen).toBeFalsy();
  });

  it("gives a new watch What next, though the redraw closes the card", async () => {
    const panel = await welcome({ id: "w1", kind: "watch" });
    const visit = panel.welcomePair.visit;
    await pair(panel, "watch");
    // The redraw really did close the card, which is what used to end it.
    expect(panel.welcomePair.visit).toBeGreaterThan(visit);
    expect(panel.welcomePairOpen).toBe(false);
    expect(panel.pairOpen).toBe(true);
    expect(panel.pairNext).toBe("w1");
  });

  it("picks a new iPhone on Home with its Paired line, though the redraw closes the card", async () => {
    const panel = await welcome({ id: "p1", kind: "iphone" });
    await pair(panel, "iphone");
    expect(panel.welcomePairOpen).toBe(false);
    expect(panel.pairOpen).toBeFalsy();
    expect(panel.devicePaired).toBe("p1");
  });

  it("does nothing more once the person has left the card before the pairing came back", async () => {
    const panel = await welcome({ id: "w1", kind: "watch" });
    const card = panel.welcomePair;
    card.pair = {
      code: "ABC123",
      found: { found: true, code: "ABC123", watch_id: "x", kind: "watch", device_name: "x", expires_in: 60 },
      users: [],
      userId: "u1",
      asked: {},
      ticked: {},
    };
    const pressed = card.confirmPair();
    // Home left while the Pair button waits for its answer.
    panel.route = { path: "/pages", prefix: "/wrist-assistant" } as never;
    await panel.updateComplete;
    await pressed;
    await settle(panel);
    expect(panel.pairOpen).toBeFalsy();
    expect(panel.pairNext).toBeUndefined();
  });
});
