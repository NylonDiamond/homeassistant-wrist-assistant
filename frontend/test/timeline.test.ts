// The state timeline layer: the series string it reads, the runs it cuts that
// into, how a run finds its colour, and the bytes it writes back.
//
// The parsing and merging here are ports of the Swift in the app repo
// (`timelineSamples` and `timelineRuns` in `CustomComplicationRendering.swift`),
// and `test/fixtures/timeline.json` is run by both sides, so a drift between
// the two implementations fails in both repos.

import { describe, expect, it } from "vitest";
import { nothing } from "lit";
import {
  TIMELINE_DEFAULT_LABEL_HEX,
  TIMELINE_DEFAULT_LABEL_SIZE,
  TIMELINE_DEFAULT_OTHER_HEX,
  TIMELINE_DEFAULT_TIME_LABELS,
  TIMELINE_HISTORY_POINTS,
  TIMELINE_NEW_TIME_LABELS,
  auditUnknownKeys,
  encodeConfig,
  literal,
  newConfig,
  newElement,
  parseConfig,
  seedTimelineBands,
  setLayerEntity,
  chartHistoryRequests,
  timelineBandColor,
  timelineHistoryKey,
  timelineHistoryMinutes,
  type Element,
  type TimelineElement,
} from "../src/model.js";
import { renderLayout, type IconProvider } from "../src/renderer.js";
import { resolveAll, timelineLabels, timelineRuns, timelineSamples, type ResolvedLayout } from "../src/resolver.js";

const noIcons: IconProvider = { render: () => undefined, available: () => false, names: () => undefined };

const DOOR = { entityId: "binary_sensor.front_door", displayName: "Front door", domain: "binary_sensor" };

function flatten(node: unknown): string {
  if (node === undefined || node === null || node === nothing) return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (typeof node === "object" && "strings" in (node as Record<string, unknown>)) {
    const t = node as { strings: readonly string[]; values: unknown[] };
    return t.strings.map((s, i) => s + (i < t.values.length ? flatten(t.values[i]) : "")).join("");
  }
  return String(node);
}

function timelineElement(tweak: (p: TimelineElement) => void = () => {}): Extract<Element, { kind: "timeline" }> {
  const el = newElement("timeline") as Extract<Element, { kind: "timeline" }>;
  el.payload.frame = { x: 0, y: 0, width: 1, height: 1, rotationDegrees: 0 };
  el.payload.value = { kind: { kind: "entityState", ...DOOR } };
  // The tests below reason in one hour; a fresh layer starts on a day.
  el.payload.historyMinutes = 60;
  tweak(el.payload);
  return el;
}

/** One timeline filling a rectangular face, resolved against one cached series. */
function timelineLayout(series: string | undefined, tweak: (p: TimelineElement) => void = () => {}, nowMs?: number): ResolvedLayout {
  const cfg = newConfig("Timeline", 0);
  const el = timelineElement(tweak);
  cfg.elements.push(el);
  const key = timelineHistoryKey(el.payload);
  const historySeries = new Map<string, string>();
  if (series !== undefined && key !== undefined) historySeries.set(key, series);
  return resolveAll(cfg, {
    entityStates: new Map(),
    templateResults: new Map(),
    historySeries,
    namedValues: cfg.values,
    ...(nowMs === undefined ? {} : { nowMs }),
  }).rectangular!;
}

function runsOf(series: string | undefined, tweak: (p: TimelineElement) => void = () => {}) {
  const el = timelineLayout(series, tweak).elements.find((e) => e.kind === "timeline");
  if (!el || el.kind !== "timeline") throw new Error("no timeline layer resolved");
  return el.runs;
}

describe("the series string", () => {
  it("reads offset:state pairs in order", () => {
    expect(timelineSamples("0:off 600:on 900:off")).toEqual([
      { offsetSeconds: 0, state: "off" },
      { offsetSeconds: 600, state: "on" },
      { offsetSeconds: 900, state: "off" },
    ]);
  });

  it("has nothing to say about an empty series", () => {
    expect(timelineSamples("")).toEqual([]);
  });

  it("decodes a percent-encoded state, colons and spaces included", () => {
    // Encoding is what lets a state hold the two characters the format itself
    // uses, so this is the case the whole encoding exists for.
    expect(timelineSamples("0:Heating%20up 60:12%3A30%20pm")).toEqual([
      { offsetSeconds: 0, state: "Heating up" },
      { offsetSeconds: 60, state: "12:30 pm" },
    ]);
  });

  it("round trips a state through encodeURIComponent", () => {
    const awkward = "Playing: Bohemian Rhapsody (live)";
    const raw = `0:${encodeURIComponent(awkward)}`;
    expect(timelineSamples(raw)).toEqual([{ offsetSeconds: 0, state: awkward }]);
  });

  it("keeps a malformed escape rather than losing the whole strip", () => {
    expect(timelineSamples("0:100%25 60:brok%en")).toEqual([
      { offsetSeconds: 0, state: "100%" },
      { offsetSeconds: 60, state: "brok%en" },
    ]);
  });

  it("skips a pair with no offset, a negative one or no colon", () => {
    expect(timelineSamples("0:off nope -60:on :on 600:on")).toEqual([
      { offsetSeconds: 0, state: "off" },
      { offsetSeconds: 600, state: "on" },
    ]);
  });

  it("ignores everything past the cap", () => {
    const pairs = Array.from({ length: TIMELINE_HISTORY_POINTS + 25 }, (_, i) => `${i * 10}:s${i}`).join(" ");
    const samples = timelineSamples(pairs);
    expect(samples).toHaveLength(TIMELINE_HISTORY_POINTS);
    expect(samples[samples.length - 1]!.state).toBe(`s${TIMELINE_HISTORY_POINTS - 1}`);
  });

  it("caps a resolved layer at 120 runs' worth of samples too", () => {
    // Every sample is its own colour here, so nothing merges and the cap is the
    // only thing that can hold the run count down.
    const pairs = Array.from({ length: 200 }, (_, i) => `${i * 10}:s${i}`).join(" ");
    const runs = runsOf(pairs, (p) => {
      p.historyMinutes = 60;
      p.bands = Array.from({ length: 200 }, (_, i) => ({
        id: `B${i}`,
        match: `s${i}`,
        colorHex: i % 2 === 0 ? "#111111" : "#222222",
      }));
    });
    // 120 samples alternating between two colours is 120 runs, none of them
    // mergeable with its neighbour.
    expect(runs).toHaveLength(TIMELINE_HISTORY_POINTS);
  });
});

describe("cutting samples into runs", () => {
  const colours = (state: string) => (state === "on" ? "#FF0000" : state === "off" ? "#00FF00" : "#0000FF");

  it("runs each sample up to the next one and the last one to the edge", () => {
    const runs = timelineRuns(timelineSamples("0:off 30:on 60:off"), 120, colours);
    expect(runs).toEqual([
      { start: 0, end: 0.25, colorHex: "#00FF00" },
      { start: 0.25, end: 0.5, colorHex: "#FF0000" },
      { start: 0.5, end: 1, colorHex: "#00FF00" },
    ]);
  });

  it("merges neighbours that draw the same colour", () => {
    // "unavailable" and "unknown" are different states and the same colour, so
    // the strip shows one grey stretch rather than two touching ones.
    const runs = timelineRuns(timelineSamples("0:on 25:unavailable 50:unknown 75:on"), 100, colours);
    expect(runs).toEqual([
      { start: 0, end: 0.25, colorHex: "#FF0000" },
      { start: 0.25, end: 0.75, colorHex: "#0000FF" },
      { start: 0.75, end: 1, colorHex: "#FF0000" },
    ]);
  });

  it("starts part way across when nothing was in force at the span's start", () => {
    const runs = timelineRuns(timelineSamples("50:on"), 100, colours);
    expect(runs).toEqual([{ start: 0.5, end: 1, colorHex: "#FF0000" }]);
  });

  it("always ends at the right edge, whatever the last offset says", () => {
    const runs = timelineRuns(timelineSamples("0:on 90:off"), 100, colours);
    expect(runs[runs.length - 1]!.end).toBe(1);
  });

  it("pulls an offset past the span back onto the strip", () => {
    const runs = timelineRuns(timelineSamples("0:on 500:off"), 100, colours);
    expect(runs).toEqual([{ start: 0, end: 1, colorHex: "#FF0000" }]);
  });

  it("drops a pair that repeats the offset before it", () => {
    // The `off` at 40 lasts no time at all, so it draws nothing and the two
    // stretches of `on` around it become one run.
    const runs = timelineRuns(timelineSamples("0:on 40:off 40:on 80:off"), 100, colours);
    expect(runs).toEqual([
      { start: 0, end: 0.8, colorHex: "#FF0000" },
      { start: 0.8, end: 1, colorHex: "#00FF00" },
    ]);
  });

  it("draws nothing from an empty series or a span of no time", () => {
    expect(timelineRuns([], 100, colours)).toEqual([]);
    expect(timelineRuns(timelineSamples("0:on"), 0, colours)).toEqual([]);
  });
});

describe("matching a state to a colour", () => {
  const bands = [
    { id: "B1", match: "ON", colorHex: "#FF453A" },
    { id: "B2", match: " off ", colorHex: "#32D74B" },
    { id: "B3", match: "on", colorHex: "#0A84FF" },
  ];

  it("ignores case and surrounding space", () => {
    expect(timelineBandColor("on", bands, "#111111")).toBe("#FF453A");
    expect(timelineBandColor("OFF", bands, "#111111")).toBe("#32D74B");
  });

  it("takes the first row that matches, not the last", () => {
    expect(timelineBandColor("On", bands, "#111111")).toBe("#FF453A");
  });

  it("falls through to the otherwise colour", () => {
    expect(timelineBandColor("unavailable", bands, "#111111")).toBe("#111111");
  });

  it("colours every run one way when the table is empty", () => {
    const runs = runsOf("0:on 1800:off", (p) => { p.bands = []; p.otherColorHex = TIMELINE_DEFAULT_OTHER_HEX; });
    expect(runs).toEqual([{ start: 0, end: 1, colorHex: TIMELINE_DEFAULT_OTHER_HEX }]);
  });
});

describe("the history request", () => {
  it("keys on the entity, the span, 120 points and the states mode", () => {
    const el = timelineElement((p) => { p.historyMinutes = 180; });
    expect(timelineHistoryKey(el.payload)).toBe("binary_sensor.front_door|180|120|states");
  });

  it("asks for nothing when the layer names no entity", () => {
    const el = timelineElement((p) => { p.value = literal("on"); });
    expect(timelineHistoryKey(el.payload)).toBeUndefined();
  });

  it("clamps the span the way the chart's is clamped", () => {
    expect(timelineHistoryMinutes(timelineElement((p) => { p.historyMinutes = 0; }).payload)).toBe(1);
    expect(timelineHistoryMinutes(timelineElement((p) => { p.historyMinutes = 99_999; }).payload)).toBe(7 * 24 * 60);
  });

  it("reaches the panel's fetch list carrying mode states", () => {
    const cfg = newConfig("Timeline", 0);
    cfg.elements.push(timelineElement());
    expect(chartHistoryRequests(cfg)).toEqual([{
      key: "binary_sensor.front_door|60|120|states",
      entityId: "binary_sensor.front_door",
      minutes: 60,
      points: 120,
      mode: "states",
    }]);
  });

  it("stays a separate request from a chart of the same entity and span", () => {
    const cfg = newConfig("Both", 0);
    cfg.elements.push(timelineElement());
    const chart = newElement("chart") as Extract<Element, { kind: "chart" }>;
    chart.payload.value = { kind: { kind: "entityState", ...DOOR } };
    chart.payload.historyMinutes = 60;
    chart.payload.historyPoints = 120;
    cfg.elements.push(chart);
    const keys = chartHistoryRequests(cfg).map((r) => r.key).sort();
    expect(keys).toEqual([
      "binary_sensor.front_door|60|120",
      "binary_sensor.front_door|60|120|states",
    ]);
  });
});

describe("the wire format", () => {
  it("writes nothing it does not have to", () => {
    const cfg = newConfig("Timeline", 0);
    // A fresh layer starts away from three wire defaults on purpose (black for
    // the unnamed colour, 2 pt corners, four clock times), so those three are
    // written; set them back to the wire defaults and nothing but the value
    // should remain.
    cfg.elements.push(timelineElement((p) => {
      p.otherColorHex = TIMELINE_DEFAULT_OTHER_HEX;
      p.cornerRadius = 1;
      p.historyMinutes = 60;
      p.timeLabels = TIMELINE_DEFAULT_TIME_LABELS;
    }));
    const payload = (encodeConfig(cfg).elements as Record<string, unknown>[])[0]!.payload as Record<string, unknown>;
    expect(Object.keys(payload).sort()).toEqual(["frame", "id", "isHidden", "rules", "value"]);
  });

  it("starts a new layer with black underneath and 2 pt corners, and writes both", () => {
    const cfg = newConfig("Timeline", 0);
    cfg.elements.push(timelineElement());
    const payload = (encodeConfig(cfg).elements as Record<string, unknown>[])[0]!.payload as Record<string, unknown>;
    expect(payload.otherColorHex).toBe("#000000");
    expect(payload.cornerRadius).toBe(2);
  });

  it("starts a new layer showing its times, and writes only that one key", () => {
    // The times are the reading this layer was missing, so a fresh one has
    // them; the other three sit at their wire defaults and stay unwritten.
    const el = newElement("timeline") as Extract<Element, { kind: "timeline" }>;
    expect(el.payload.timeLabels).toBe(TIMELINE_NEW_TIME_LABELS);
    expect(el.payload.timeLabels).toBe("four");
    expect(el.payload.labelSize).toBe(TIMELINE_DEFAULT_LABEL_SIZE);
    expect(el.payload.labelColorHex).toBe(TIMELINE_DEFAULT_LABEL_HEX);
    expect(el.payload.labelsAbove).toBe(false);
    const cfg = newConfig("Timeline", 0);
    cfg.elements.push(el);
    const payload = (encodeConfig(cfg).elements as Record<string, unknown>[])[0]!.payload as Record<string, unknown>;
    expect(payload.timeLabels).toBe("four");
    expect(payload.labelSize).toBeUndefined();
    expect(payload.labelColorHex).toBeUndefined();
    expect(payload.labelsAbove).toBeUndefined();
  });

  it("writes each time-label key once it is away from its default", () => {
    const cfg = newConfig("Timeline", 0);
    cfg.elements.push(timelineElement((p) => {
      p.timeLabels = "ends";
      p.labelSize = 12;
      p.labelColorHex = "#FF9F0A";
      p.labelsAbove = true;
    }));
    const payload = (encodeConfig(cfg).elements as Record<string, unknown>[])[0]!.payload as Record<string, unknown>;
    expect(payload.timeLabels).toBe("ends");
    expect(payload.labelSize).toBe(12);
    expect(payload.labelColorHex).toBe("#FF9F0A");
    expect(payload.labelsAbove).toBe(true);
    // The four sit after the corner radius, in the order the app's encoder
    // writes them, so a document from either side is byte for byte the same.
    expect(Object.keys(payload).filter((k) => ["cornerRadius", "timeLabels", "labelSize", "labelColorHex", "labelsAbove"].includes(k)))
      .toEqual(["cornerRadius", "timeLabels", "labelSize", "labelColorHex", "labelsAbove"]);
  });

  it("round trips the time labels through parse and encode", () => {
    const cfg = newConfig("Timeline", 0);
    cfg.elements.push(timelineElement((p) => {
      p.timeLabels = "ends";
      p.labelSize = 11.5;
      p.labelColorHex = "#FF9F0A";
      p.labelsAbove = true;
    }));
    const encoded = encodeConfig(cfg);
    expect(encodeConfig(parseConfig(encoded))).toEqual(encoded);
    const back = parseConfig(encoded).elements[0]!;
    if (back.kind !== "timeline") throw new Error("unreachable");
    expect(back.payload.timeLabels).toBe("ends");
    expect(back.payload.labelSize).toBe(11.5);
    expect(back.payload.labelColorHex).toBe("#FF9F0A");
    expect(back.payload.labelsAbove).toBe(true);
  });

  it("reads a document that predates the keys as no times at all", () => {
    const cfg = newConfig("Timeline", 0);
    cfg.elements.push(timelineElement((p) => { p.timeLabels = TIMELINE_DEFAULT_TIME_LABELS; }));
    const encoded = encodeConfig(cfg);
    const back = parseConfig(encoded).elements[0]!;
    if (back.kind !== "timeline") throw new Error("unreachable");
    expect(back.payload.timeLabels).toBe("none");
    expect(back.payload.labelSize).toBe(TIMELINE_DEFAULT_LABEL_SIZE);
    expect(back.payload.labelColorHex).toBe(TIMELINE_DEFAULT_LABEL_HEX);
    expect(back.payload.labelsAbove).toBe(false);
  });

  it("takes a timeLabels word it does not know as none rather than refusing", () => {
    const cfg = newConfig("Timeline", 0);
    cfg.elements.push(timelineElement((p) => { p.timeLabels = "four"; }));
    const encoded = encodeConfig(cfg);
    ((encoded.elements as Record<string, unknown>[])[0]!.payload as Record<string, unknown>).timeLabels = "eight";
    const back = parseConfig(encoded).elements[0]!;
    if (back.kind !== "timeline") throw new Error("unreachable");
    expect(back.payload.timeLabels).toBe("none");
  });

  it("writes each key once it is away from its default", () => {
    const cfg = newConfig("Timeline", 0);
    cfg.elements.push(timelineElement((p) => {
      p.historyMinutes = 180;
      p.bands = [{ id: "BBBBBBBB-0000-4000-8000-0000000000B1", match: "on", colorHex: "#FF453A" }];
      p.otherColorHex = "#5E5CE6";
      p.gap = 1.5;
      p.cornerRadius = 3;
    }));
    const payload = (encodeConfig(cfg).elements as Record<string, unknown>[])[0]!.payload as Record<string, unknown>;
    expect(payload.historyMinutes).toBe(180);
    expect(payload.bands).toEqual([{ id: "BBBBBBBB-0000-4000-8000-0000000000B1", match: "on", colorHex: "#FF453A" }]);
    expect(payload.otherColorHex).toBe("#5E5CE6");
    expect(payload.gap).toBe(1.5);
    expect(payload.cornerRadius).toBe(3);
  });

  it("round trips through parse and encode unchanged", () => {
    const cfg = newConfig("Timeline", 0);
    cfg.elements.push(timelineElement((p) => {
      p.historyMinutes = 720;
      p.bands = seedTimelineBands("cover");
      p.gap = 2;
    }));
    const encoded = encodeConfig(cfg);
    expect(encodeConfig(parseConfig(encoded))).toEqual(encoded);
  });

  it("reports no unknown keys", () => {
    const cfg = newConfig("Timeline", 0);
    cfg.elements.push(timelineElement((p) => {
      p.bands = seedTimelineBands("binary_sensor", "door");
      p.gap = 1;
      p.cornerRadius = 2;
      p.otherColorHex = "#5E5CE6";
      p.historyMinutes = 360;
    }));
    expect(auditUnknownKeys(encodeConfig(cfg))).toEqual([]);
  });

  it("flags a key nothing decodes", () => {
    const cfg = newConfig("Timeline", 0);
    cfg.elements.push(timelineElement());
    const encoded = encodeConfig(cfg);
    ((encoded.elements as Record<string, unknown>[])[0]!.payload as Record<string, unknown>).colorSlot2 = { baseColorHex: "#FFFFFF" };
    expect(auditUnknownKeys(encoded)).toEqual(["$.elements[0].payload.colorSlot2"]);
  });

  it("clamps a gap and a span a hand-edited document exceeded", () => {
    const cfg = newConfig("Timeline", 0);
    cfg.elements.push(timelineElement());
    const encoded = encodeConfig(cfg);
    const payload = (encoded.elements as Record<string, unknown>[])[0]!.payload as Record<string, unknown>;
    payload.gap = 40;
    payload.historyMinutes = -5;
    const back = parseConfig(encoded).elements[0]!;
    if (back.kind !== "timeline") throw new Error("unreachable");
    expect(back.payload.gap).toBe(4);
    expect(back.payload.historyMinutes).toBe(1);
  });
});

describe("seeded colour tables", () => {
  it("names the two states a switch actually reports", () => {
    expect(seedTimelineBands("switch").map((b) => b.match)).toEqual(["on", "off", "unavailable", "unknown"]);
  });

  it("names open and closed for a cover, which really reports those words", () => {
    expect(seedTimelineBands("cover").map((b) => b.match)).toEqual(["open", "closed", "opening", "closing", "unavailable", "unknown"]);
  });

  it("keeps on and off for a door sensor, because that is what it reports", () => {
    // The device class changes what the frontend prints, not what the recorder
    // holds, so a table of "open" would match nothing at all.
    const door = seedTimelineBands("binary_sensor", "door");
    expect(door.map((b) => b.match)).toEqual(["on", "off", "unavailable", "unknown"]);
    expect(door[0]!.colorHex).not.toBe(seedTimelineBands("binary_sensor")[0]!.colorHex);
  });

  it("names home and not_home for a person", () => {
    expect(seedTimelineBands("person").map((b) => b.match)).toEqual(["home", "not_home", "unavailable", "unknown"]);
  });

  it("leaves an unknown domain with only the no-reading rows", () => {
    expect(seedTimelineBands("sensor").map((b) => b.match)).toEqual(["unavailable", "unknown"]);
  });

  it("is written when an entity is picked, and again when a different one is", () => {
    const cfg = newConfig("Timeline", 0);
    const el = newElement("timeline") as Extract<Element, { kind: "timeline" }>;
    cfg.elements.push(el);
    setLayerEntity(cfg, el.payload.id, DOOR, "window");
    const seeded = el.payload.bands.map((b) => b.match);
    expect(seeded).toEqual(["on", "off", "unavailable", "unknown"]);
    expect(el.payload.value.kind).toEqual({ kind: "entityState", ...DOOR });

    // Picking the same entity again is not a change, so edits survive it.
    el.payload.bands = [{ id: "MINE", match: "mine", colorHex: "#FFFFFF" }];
    setLayerEntity(cfg, el.payload.id, DOOR, "window");
    expect(el.payload.bands.map((b) => b.match)).toEqual(["mine"]);

    // A different entity reports different states, so the table starts over.
    setLayerEntity(cfg, el.payload.id, { entityId: "cover.garage", displayName: "Garage", domain: "cover" });
    expect(el.payload.bands.map((b) => b.match)).toEqual(["open", "closed", "opening", "closing", "unavailable", "unknown"]);
  });

  it("starts a new layer on the last 24 hours, and writes it", () => {
    const cfg = newConfig("Timeline", 0);
    cfg.elements.push(newElement("timeline"));
    const payload = (encodeConfig(cfg).elements as Record<string, unknown>[])[0]!.payload as Record<string, unknown>;
    expect(payload.historyMinutes).toBe(1440);
  });
});

describe("the clock times along the span", () => {
  // A fixed instant, so every expectation below is arithmetic rather than a
  // race with the wall clock. The strings are built with the same Intl call the
  // resolver makes, so a machine on a 24 hour locale passes the same tests.
  const NOW = Date.UTC(2026, 8, 6, 21, 36, 0);
  const withMinutes = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });
  const hourOnly = new Intl.DateTimeFormat(undefined, { hour: "numeric" });
  const labelsOf = (tweak: (p: TimelineElement) => void) => timelineLabels(timelineElement(tweak).payload, NOW);

  it("prints the two ends of the window", () => {
    const labels = labelsOf((p) => { p.timeLabels = "ends"; p.historyMinutes = 60; });
    expect(labels.map((l) => l.position)).toEqual([0, 1]);
    expect(labels.map((l) => l.text)).toEqual([
      withMinutes.format(new Date(NOW - 60 * 60 * 1000)),
      withMinutes.format(new Date(NOW)),
    ]);
  });

  it("prints the ends and the two thirds between them, the watch page's own row", () => {
    const labels = labelsOf((p) => { p.timeLabels = "four"; p.historyMinutes = 180; });
    expect(labels.map((l) => l.position)).toEqual([0, 1 / 3, 2 / 3, 1]);
    const hour = 60 * 60 * 1000;
    expect(labels.map((l) => l.text)).toEqual([
      withMinutes.format(new Date(NOW - 3 * hour)),
      withMinutes.format(new Date(NOW - 2 * hour)),
      withMinutes.format(new Date(NOW - hour)),
      withMinutes.format(new Date(NOW)),
    ]);
  });

  it("keeps the minute up to three hours", () => {
    const labels = labelsOf((p) => { p.timeLabels = "four"; p.historyMinutes = 180; });
    expect(labels[0]!.text).toBe(withMinutes.format(new Date(NOW - 180 * 60 * 1000)));
  });

  it("drops the minute past three hours, where it is noise", () => {
    const labels = labelsOf((p) => { p.timeLabels = "four"; p.historyMinutes = 240; });
    expect(labels.map((l) => l.text)).toEqual([
      hourOnly.format(new Date(NOW - 240 * 60 * 1000)),
      hourOnly.format(new Date(NOW - 160 * 60 * 1000)),
      hourOnly.format(new Date(NOW - 80 * 60 * 1000)),
      hourOnly.format(new Date(NOW)),
    ]);
  });

  it("prints nothing when the layer asks for none", () => {
    expect(labelsOf((p) => { p.timeLabels = "none"; })).toEqual([]);
  });

  it("prints nothing when the layer names no entity, because it has no window", () => {
    expect(labelsOf((p) => { p.timeLabels = "four"; p.value = literal("on"); })).toEqual([]);
  });

  it("prints its times before the history lands, because the window is already known", () => {
    // The row is a fact about the span, not about the data, so a strip still
    // fetching still says what it will cover.
    const layout = timelineLayout(undefined, (p) => { p.timeLabels = "four"; }, NOW);
    const el = layout.elements.find((e) => e.kind === "timeline");
    if (!el || el.kind !== "timeline") throw new Error("no timeline layer resolved");
    expect(el.runs).toEqual([]);
    expect(el.labels).toHaveLength(4);
    expect(el.labelSize).toBe(TIMELINE_DEFAULT_LABEL_SIZE);
    expect(el.labelColorHex).toBe(TIMELINE_DEFAULT_LABEL_HEX);
    expect(el.labelsAbove).toBe(false);
  });
});

describe("drawing the strip", () => {
  const ON_OFF = [
    { id: "B1", match: "on", colorHex: "#FF453A" },
    { id: "B2", match: "off", colorHex: "#32D74B" },
  ];
  const draw = (series: string, tweak: (p: TimelineElement) => void = () => {}) =>
    flatten(renderLayout(timelineLayout(series, tweak), { icons: noIcons }));

  /** The run rectangles, in draw order. The layer's own invisible hit box has
   * no radius and no colour, which is what tells the two apart. */
  const runRects = (svg: string) =>
    [...svg.matchAll(/<rect x=([-\d.]+) y=[-\d.]+ width=([\d.]+) height=[\d.]+ rx=[\d.]+\s+fill=(#[0-9A-Fa-f]{6})/g)]
      .map((m) => ({ x: Number(m[1]), width: Number(m[2]), colorHex: m[3]! }));

  it("draws one rectangle per run", () => {
    const rects = runRects(draw("0:on 1800:off", (p) => { p.bands = ON_OFF; }));
    expect(rects.map((r) => r.colorHex)).toEqual(["#FF453A", "#32D74B"]);
  });

  it("draws nothing at all when the series has not landed", () => {
    expect(runRects(draw(""))).toEqual([]);
  });

  it("leaves the last run flush with the right edge whatever the gap", () => {
    const rects = runRects(draw("0:on 900:off", (p) => { p.gap = 4; p.bands = ON_OFF; }));
    expect(rects).toHaveLength(2);
    // The design box is 181 points wide and this layer fills it.
    expect(rects[1]!.x + rects[1]!.width).toBeCloseTo(181, 5);
    // The gap comes off the right of every run but the last.
    expect(rects[0]!.x + rects[0]!.width).toBeCloseTo(rects[1]!.x - 4, 5);
  });

  /** One entry per clock time, with the x it sits at and the side it hangs off. */
  const timeTexts = (svg: string) =>
    [...svg.matchAll(/<text x=([-\d.]+) y=[-\d.]+ text-anchor=(\w+)/g)]
      .map((m) => ({ x: Number(m[1]), anchor: m[2]! }));

  it("draws one text per clock time, the ends hung off the edges", () => {
    const texts = timeTexts(draw("0:on 1800:off", (p) => { p.timeLabels = "four"; p.bands = ON_OFF; }));
    expect(texts).toHaveLength(4);
    expect(texts.map((t) => t.anchor)).toEqual(["start", "middle", "middle", "end"]);
    expect(texts[0]!.x).toBeCloseTo(0, 5);
    expect(texts[3]!.x).toBeCloseTo(181, 5);
  });

  it("puts the row under the strip, or over it when asked", () => {
    const rowY = (svg: string) => Number(/<text x=[-\d.]+ y=([-\d.]+)/.exec(svg)?.[1]);
    const stripY = (svg: string) => Number(/<rect x=[-\d.]+ y=([-\d.]+) width=[\d.]+ height=[\d.]+ rx=[\d.]+\s+fill=#/.exec(svg)?.[1]);
    const below = draw("0:on 1800:off", (p) => { p.timeLabels = "four"; p.bands = ON_OFF; });
    const above = draw("0:on 1800:off", (p) => { p.timeLabels = "four"; p.labelsAbove = true; p.bands = ON_OFF; });
    expect(rowY(below)).toBeGreaterThan(stripY(below));
    expect(rowY(above)).toBeLessThan(stripY(above));
    // The row is 9 * 1.2 points plus a point of clearance, and the strip takes
    // what is left of the 62 point face.
    expect(stripY(above) - stripY(below)).toBeCloseTo(9 * 1.2 + 1, 5);
  });

  it("draws no text when the layer asks for none", () => {
    expect(timeTexts(draw("0:on 1800:off", (p) => { p.timeLabels = "none"; p.bands = ON_OFF; }))).toEqual([]);
  });

  it("draws the times over an empty strip while the history is still coming", () => {
    const texts = timeTexts(draw("", (p) => { p.timeLabels = "four"; p.bands = ON_OFF; }));
    expect(texts).toHaveLength(4);
  });
});
