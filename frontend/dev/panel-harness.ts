// A local harness for the panel itself: `<wrist-assistant-panel>` on a page of
// its own, without Home Assistant, with a complication open in the editor.
//
// It is the smallest stand-in that draws the editor: one watch, a handful of
// complications taken from the shared fixtures (`test/fixtures/*.json`, their
// `config`), a made-up state for every entity they name, and canned replies
// for the few commands the panel sends on its way in. Anything else is refused
// with `unknown_command` and warned in the console; the panel shows its own
// "could not" line for those, which is what it does against an older
// integration.
//
// It exists to look at the panel's styles outside Home Assistant (the form
// rules it shares with the page editor among them), not to exercise saves.
//
//   node dev/build-harness.mjs
//   python3 -m http.server 8765 --directory dev
//   open http://localhost:8765/panel-harness.html            first complication
//   open http://localhost:8765/panel-harness.html#open=rules  the fixture named
//   open http://localhost:8765/panel-harness.html#dark        dark skin

import "../src/panel.js";
import type { ComplicationRecord, HassEntityState, HassLike, OwnerSummary } from "../src/ha-api.js";

import livingRoom from "../test/fixtures/living_room.json";
import fillsGradient from "../test/fixtures/fills_gradient.json";
import textParts from "../test/fixtures/text_parts.json";
import rules from "../test/fixtures/rules.json";
import gauge from "../test/fixtures/gauge_bands_and_dots.json";
import chartSeries from "../test/fixtures/chart_series.json";
import control from "../test/fixtures/control.json";

type Json = Record<string, unknown>;

const WATCH = "harness-watch";
const PHONE = "harness-iphone";
const OPEN_STORE_KEY = "wrist-assistant-panel.open.v1";

const FIXTURES: Record<string, Json> = {
  living_room: livingRoom as Json,
  fills_gradient: fillsGradient as Json,
  text_parts: textParts as Json,
  rules: rules as Json,
  gauge_bands_and_dots: gauge as Json,
  chart_series: chartSeries as Json,
  control: control as Json,
};

/** A fixed clock for every record and state, so two runs draw the same. */
const AT = "2026-10-01T09:00:00Z";

const records: ComplicationRecord[] = Object.entries(FIXTURES).map(([name, fixture], i) => {
  const config = structuredClone(fixture.config) as Json;
  // Every record its own slot, so no two clash for a seat.
  config.slotIndex = i;
  return {
    id: typeof config.id === "string" ? config.id : `harness-${name}`,
    ownerWatchId: WATCH,
    revision: 1,
    token: i + 1,
    updatedAt: AT,
    updatedBy: "panel",
    deleted: false,
    document: config,
  };
});

const owners: OwnerSummary[] = [
  {
    owner_watch_id: WATCH, device_name: "Apple Watch", device_kind: "watch", paired_iphone_name: "Alex's iPhone",
    paired_iphone_id: PHONE, app_version: "3.0.1", app_build: "2", screen_size: "208x248",
    complication_count: records.length, token: records.length, applied_token: records.length, is_orphan: false,
  },
];

/** A made-up state for every entity a fixture's inputs name, from the state
 * the fixture itself gives. */
function buildStates(): Record<string, HassEntityState> {
  const states: Record<string, HassEntityState> = {};
  for (const fixture of Object.values(FIXTURES)) {
    const inputs = (fixture.inputs ?? {}) as { entityStates?: Record<string, { state?: string; unitOfMeasurement?: string }> };
    for (const [id, s] of Object.entries(inputs.entityStates ?? {})) {
      const attributes: Record<string, unknown> = { friendly_name: id.split(".")[1]!.replace(/_/g, " ") };
      if (s.unitOfMeasurement) attributes.unit_of_measurement = s.unitOfMeasurement;
      states[id] = { entity_id: id, state: s.state ?? "on", attributes, last_changed: AT, last_updated: AT };
    }
  }
  return states;
}

const D = "wrist_assistant/complications";

function answer(message: Json): unknown {
  switch (message.type) {
    case `${D}/owners`:
      return { owners, max_schema_version: 99, token: records.length };
    case `${D}/list`:
      return {
        owner_watch_id: message.owner_watch_id, token: records.length, max_schema_version: 99, presets: [], occupied: [],
        applied_token: records.length, pending_changes: 0, polling: true, last_poll_seconds: 5,
        push_available: true, last_push_seconds: null, pages: [], records: message.owner_watch_id === WATCH ? records : [], previews: {},
      };
    case `${D}/watch_status`:
      return { polling: true, last_poll_seconds: 5, push_available: true, last_push_seconds: null };
    case `${D}/render_values`:
      return { results: {} };
    case `${D}/history_series`:
    case `${D}/statistics_series`:
    case `${D}/list_items`:
      return { results: {} };
    case `${D}/parts_list`:
      return { parts: [] };
    case `${D}/history`:
      return { owner_watch_id: message.owner_watch_id, complication_id: message.complication_id, revision: 1, entries: [] };
    default: {
      console.warn("[panel harness] unknown command", message.type);
      throw { code: "unknown_command", message: `Unknown command ${String(message.type)}` };
    }
  }
}

const hass: HassLike = {
  connection: {
    async sendMessagePromise<T>(message: Record<string, unknown>): Promise<T> {
      return answer(message) as T;
    },
    async subscribeMessage<T>(_callback: (message: T) => void, _message: Record<string, unknown>) {
      return async () => undefined;
    },
  },
  states: buildStates(),
  user: { id: "harness-user", name: "Harness admin", is_admin: true },
  language: "en",
  themes: { darkMode: location.hash.includes("dark") },
};

// Open a record on the first draw, as a reload does: the panel reads the
// last open record from session storage.
const wanted = /open=([a-z_]+)/.exec(location.hash)?.[1];
const open = records[Math.max(0, Object.keys(FIXTURES).indexOf(wanted ?? ""))]!;
try {
  sessionStorage.setItem(OPEN_STORE_KEY, JSON.stringify({ owner: WATCH, id: open.id }));
} catch {
  // No storage: the panel opens on nothing.
}

const panel = document.createElement("wrist-assistant-panel") as HTMLElement & { hass: HassLike; narrow: boolean };
panel.hass = hass;
panel.narrow = false;
document.getElementById("frame")!.append(panel);
(window as unknown as { __panel: unknown }).__panel = panel;
