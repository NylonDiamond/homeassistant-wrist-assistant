// The dashboard card's config and its live data (`live-complication.ts`).
// The drawing itself is the editor's renderer, tested on its own.

import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { compile } from "../src/compiler.js";
import { cardSizeFor, gridOptionsFor, parseCardConfig } from "../src/dashboard-card-config.js";
import type { HassEntityState, HassLike } from "../src/ha-api.js";
import {
  LiveComplication,
  SERIES_AFTER_CHANGE_MS,
  SERIES_REFRESH_MS,
  TEMPLATE_MARKER,
  cardShapeOf,
  entityStateFor,
  parseTemplateEvent,
} from "../src/live-complication.js";
import { parseConfig } from "../src/model.js";
import "../src/dashboard-card.js";

const fixture = (name: string) =>
  JSON.parse(readFileSync(new URL(`./fixtures/${name}.json`, import.meta.url), "utf8")).config as Record<string, unknown>;

describe("card config", () => {
  it("fills in the Library and keeps what it does not know", () => {
    expect(parseCardConfig({ type: "custom:wrist-assistant-card", complication: " ABC ", future: 1 })).toEqual({
      type: "custom:wrist-assistant-card", owner: "library", complication: "ABC", future: 1,
    });
  });

  it("refuses a card with no design, a shape that does not exist, and odd switches", () => {
    expect(() => parseCardConfig({ type: "x" })).toThrow(/complication/);
    expect(() => parseCardConfig({ complication: "A", shape: "huge" })).toThrow(/shape/);
    expect(() => parseCardConfig({ complication: "A", taps: "yes" })).toThrow(/taps/);
    expect(() => parseCardConfig({ complication: "A", background: "blue" })).toThrow(/background/);
  });

  it("starts each shape at its own size", () => {
    expect(gridOptionsFor("rectangular").columns).toBe(12);
    expect(gridOptionsFor("circular")).toMatchObject({ columns: 3, rows: 2 });
    expect(gridOptionsFor(undefined)).toEqual(gridOptionsFor("rectangular"));
    expect(cardSizeFor("xlarge")).toBeGreaterThan(cardSizeFor("small"));
  });
});

describe("which shape a card draws", () => {
  const cfg = parseConfig({ ...fixture("chart_series"), supportedFamilies: ["circular", "rectangular"] });

  it("draws the shape asked for when the design has it", () => {
    expect(cardShapeOf(cfg, "rectangular")).toBe("rectangular");
  });

  it("falls back to the design's first drawable shape", () => {
    expect(cardShapeOf(cfg, "corner")).toBe("rectangular");
    expect(cardShapeOf(cfg, undefined)).toBe("rectangular");
  });

  it("draws Inline only when there is nothing else", () => {
    const inline = parseConfig({ ...fixture("chart_series"), supportedFamilies: ["inline"] });
    expect(cardShapeOf(inline, undefined)).toBe("inline");
  });
});

describe("template events", () => {
  it("reads the value object behind the marker", () => {
    const parsed = parseTemplateEvent({ result: `${TEMPLATE_MARKER}\n\n{"a": "1", "b": null}` });
    expect(parsed?.values.get("a")).toBe("1");
    expect(parsed?.nullKeys.has("b")).toBe(true);
  });

  it("ignores an error and anything that is not the value object", () => {
    expect(parseTemplateEvent({ error: "boom", level: "ERROR" })).toBeUndefined();
    expect(parseTemplateEvent({ result: `${TEMPLATE_MARKER}[1, 2]` })).toBeUndefined();
    expect(parseTemplateEvent(null)).toBeUndefined();
  });
});

const state = (id: string, value: string, stamp: string, attributes: Record<string, unknown> = {}): HassEntityState => ({
  entity_id: id, state: value, attributes, last_changed: stamp, last_updated: stamp,
});

describe("entity states", () => {
  it("reads a timer's phase and a picture as the resolver wants them", () => {
    const hass = { states: {
      "timer.tea": state("timer.tea", "paused", "t", { remaining: "0:02:30" }),
      "person.me": state("person.me", "home", "t", { entity_picture: "/api/image/me" }),
    } } as unknown as HassLike;
    expect(entityStateFor(hass, "timer.tea", "")).toMatchObject({ timerState: "paused", remaining: 150, domain: "timer" });
    expect(entityStateFor(hass, "person.me", "")?.entityPicture).toBe("/api/image/me");
    expect(entityStateFor(hass, "light.none", "")).toBeUndefined();
  });
});

/** A connection that records what was asked of it. */
function fakeHass(states: Record<string, HassEntityState>) {
  const sent: Record<string, unknown>[] = [];
  const subscriptions: { message: Record<string, unknown>; callback: (m: unknown) => void; closed: boolean }[] = [];
  const hass = {
    states,
    connection: {
      sendMessagePromise: vi.fn(async (message: Record<string, unknown>) => {
        sent.push(message);
        if (String(message.type).endsWith("history_series")) {
          const requests = message.requests as Record<string, unknown>;
          return { results: Object.fromEntries(Object.keys(requests).map((k) => [k, { ok: true, series: "1,2,3" }])) };
        }
        return { results: {} };
      }),
      subscribeMessage: vi.fn(async (callback: (m: unknown) => void, message: Record<string, unknown>) => {
        const entry = { message, callback, closed: false };
        subscriptions.push(entry);
        return async () => { entry.closed = true; };
      }),
    },
  } as unknown as HassLike;
  return { hass, sent, subscriptions };
}

describe("LiveComplication", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it("follows the value document with render_template and draws what it pushes", async () => {
    const doc = fixture("aggregates");
    const { hass, subscriptions } = fakeHass({});
    const changed = vi.fn();
    const live = new LiveComplication({ hass: () => hass, changed });
    live.setDocument(doc);
    live.start();
    await vi.advanceTimersByTimeAsync(0);

    const [sub] = subscriptions;
    expect(sub?.message).toMatchObject({ type: "render_template", report_errors: true });
    expect(sub?.message.template).toBe(`${TEMPLATE_MARKER}${compile(parseConfig(doc)).document}`);

    sub!.callback({ result: `${TEMPLATE_MARKER}{"x": "42"}` });
    expect(changed).toHaveBeenCalled();
    expect(live.context().templateResults.get("x")).toBe("42");

    sub!.callback({ error: "UndefinedError: nope", level: "ERROR" });
    expect(live.templateError).toMatch(/nope/);
    expect(live.context().templateResults.get("x")).toBe("42");

    live.stop();
    await vi.advanceTimersByTimeAsync(0);
    expect(sub?.closed).toBe(true);
  });

  it("redraws only when one of its own entities moved", () => {
    const states: Record<string, HassEntityState> = {
      "sensor.voltage": state("sensor.voltage", "3068", "1"),
      "light.other": state("light.other", "on", "1"),
    };
    const { hass } = fakeHass(states);
    const live = new LiveComplication({ hass: () => hass, changed: () => undefined });
    live.setDocument(fixture("chart_series"));
    expect(live.noteHass()).toBe(false);
    states["light.other"] = state("light.other", "off", "2");
    expect(live.noteHass()).toBe(false);
    states["sensor.voltage"] = state("sensor.voltage", "3070", "2");
    expect(live.noteHass()).toBe(true);
  });

  it("fetches history on start, every minute, and soon after a charted entity changes", async () => {
    const states: Record<string, HassEntityState> = { "sensor.voltage": state("sensor.voltage", "3068", "1") };
    const { hass, sent } = fakeHass(states);
    const live = new LiveComplication({ hass: () => hass, changed: () => undefined });
    live.setDocument(fixture("chart_series"));
    const historyCalls = () => sent.filter((m) => String(m.type).endsWith("history_series")).length;

    live.start();
    await vi.advanceTimersByTimeAsync(0);
    expect(historyCalls()).toBe(1);
    expect(live.context().historySeries?.size).toBe(1);

    states["sensor.voltage"] = state("sensor.voltage", "3070", "2");
    live.noteHass();
    await vi.advanceTimersByTimeAsync(SERIES_AFTER_CHANGE_MS);
    expect(historyCalls()).toBe(2);

    await vi.advanceTimersByTimeAsync(SERIES_REFRESH_MS);
    expect(historyCalls()).toBe(3);

    live.stop();
    await vi.advanceTimersByTimeAsync(SERIES_REFRESH_MS * 3);
    expect(historyCalls()).toBe(3);
  });

  it("subscribes again when a new revision changes the template, and not otherwise", async () => {
    const doc = fixture("aggregates");
    const { hass, subscriptions } = fakeHass({});
    const live = new LiveComplication({ hass: () => hass, changed: () => undefined });
    live.setDocument(doc);
    live.start();
    await vi.advanceTimersByTimeAsync(0);
    live.setDocument({ ...doc, name: "Renamed" });
    await vi.advanceTimersByTimeAsync(0);
    expect(subscriptions).toHaveLength(1);

    live.setDocument(fixture("chart_series"));
    await vi.advanceTimersByTimeAsync(0);
    // chart_series has no template, so the old subscription closes and none opens.
    expect(subscriptions).toHaveLength(1);
    expect(subscriptions[0]?.closed).toBe(true);
  });
});

describe("the card element", () => {
  const RECORD = { owner_watch_id: "library", complication_id: "A", revision: 1, updated_at: "t" };
  const GOOD = fixture("chart_series");
  // No tap action: a document the editor would never have written.
  const BAD = Object.fromEntries(Object.entries(GOOD).filter(([key]) => key !== "tapAction"));

  /** The card with a connection that answers `card/get` with `get`, records
   * each subscription, and answers every other read with nothing. */
  function card(get: () => unknown) {
    const subscriptions: { message: Record<string, unknown>; callback: (m: unknown) => void }[] = [];
    const hass = {
      states: {},
      connection: {
        sendMessagePromise: vi.fn(async (message: Record<string, unknown>) => {
          if (message.type === "wrist_assistant/card/get") return get();
          return { results: {} };
        }),
        subscribeMessage: vi.fn(async (callback: (m: unknown) => void, message: Record<string, unknown>) => {
          subscriptions.push({ message, callback });
          return async () => undefined;
        }),
      },
    } as unknown as HassLike;
    const Ctor = customElements.get("wa-dashboard-card") as unknown as new () => Record<string, unknown>;
    const el = new Ctor();
    el.hass = hass;
    el.config = { type: "custom:wrist-assistant-card", owner: "library", complication: "A" };
    const cardEvents = () => subscriptions.filter((s) => s.message.type === "wrist_assistant/card/subscribe");
    const load = () => (el.load as (o: string, i: string) => Promise<void>).call(el, "library", "A");
    return { el, load, cardEvents };
  }

  it("keeps listening after a design it cannot read, and draws the fixed revision", async () => {
    const t = card(() => ({ ...RECORD, document: BAD }));
    await t.load();
    expect(String(t.el.problem)).toMatch(/could not be read/);
    expect(t.cardEvents()).toHaveLength(1);
    t.cardEvents()[0]!.callback({ ...RECORD, revision: 2, document: GOOD });
    expect(t.el.problem).toBeUndefined();
    expect((t.el.record as { revision: number }).revision).toBe(2);
    expect(t.cardEvents()).toHaveLength(1);
  });

  it("keeps the last good revision's values whole when a new one does not read", () => {
    const live = new LiveComplication({ hass: () => undefined, changed: () => undefined });
    live.setDocument(GOOD);
    const before = live.config;
    expect(() => live.setDocument(BAD)).toThrow();
    expect(live.config).toBe(before);
  });

  it("listens for a design that is gone, so a restore draws without a reload", async () => {
    const t = card(() => { throw { code: "not_found", message: "no such complication" }; });
    await t.load();
    expect(String(t.el.problem)).toMatch(/deleted/);
    expect(t.cardEvents()).toHaveLength(1);
    t.cardEvents()[0]!.callback({ ...RECORD, document: GOOD });
    expect(t.el.problem).toBeUndefined();
  });

  describe("a page tour", () => {
    beforeEach(() => { vi.useFakeTimers(); });
    afterEach(() => { vi.useRealTimers(); });

    it("plays each page for its dwell and goes back to page 1, and stops with a new revision", async () => {
      const t = card(() => ({ ...RECORD, document: fixture("pages") }));
      await t.load();
      const cfg = (t.el.live as LiveComplication).config!;
      const play = () => (t.el.playTour as (c: unknown) => boolean).call(t.el, cfg);
      expect(play()).toBe(true);
      const seen = [t.el.page];
      for (let i = 0; i < 20; i++) {
        vi.advanceTimersByTime(500);
        if (seen[seen.length - 1] !== t.el.page) seen.push(t.el.page);
      }
      expect(seen).toEqual([1, 2, 3, 1]);

      expect(play()).toBe(true);
      vi.advanceTimersByTime(1000);
      expect(t.el.page).toBe(2);
      t.cardEvents()[0]!.callback({ ...RECORD, revision: 2, document: fixture("pages") });
      vi.advanceTimersByTime(10_000);
      expect(t.el.page).toBe(2);
    });

    it("plays nothing for a design without a tour", async () => {
      const t = card(() => ({ ...RECORD, document: GOOD }));
      await t.load();
      const cfg = (t.el.live as LiveComplication).config!;
      expect((t.el.playTour as (c: unknown) => boolean).call(t.el, cfg)).toBe(false);
    });
  });
});
