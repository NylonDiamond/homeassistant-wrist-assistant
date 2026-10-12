// The Control Center screen on a watch whose old list moved into
// complications: the iPhone made one control-only document per entry, each
// naming the entry's entity in `legacyControlEntityId`. Such a watch gets a
// short note with the way to Complications instead of the editor; every other
// watch keeps the editor exactly as it was.
// Plan: app repo docs/control_center_move.md, slice 5.

import { describe, expect, it } from "vitest";

import type { ComplicationRecord, HassLike, OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import { WaControlCenterEditor } from "../src/watch-control-center/control-center-editor.js";
import {
  CONTROL_CENTER_MOVED_LINK,
  CONTROL_CENTER_MOVED_TEXT,
  CONTROL_CENTER_MOVED_TITLE,
  controlCenterMoved,
  renderControlCenterMoved,
} from "../src/watch-control-center/view.js";

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

function record(document: Record<string, unknown> | null, deleted = false): ComplicationRecord {
  return {
    id: "AAAAAAAA-0000-4000-8000-000000000001",
    ownerWatchId: "w1",
    revision: 1,
    token: 1,
    updatedAt: "2026-10-12T00:00:00Z",
    updatedBy: "app-import:w1",
    deleted,
    document,
  };
}

const MOVED_DOC = { name: "Kitchen", supportedFamilies: [], control: { kind: "toggle" }, legacyControlEntityId: "light.kitchen" };
const PLAIN_DOC = { name: "Kitchen", supportedFamilies: [], control: { kind: "toggle" } };

describe("whether a watch's Control Center list moved", () => {
  it("is yes once one live document names an old entry", () => {
    expect(controlCenterMoved([record(PLAIN_DOC), record(MOVED_DOC)])).toBe(true);
  });

  it("is no with none, with only deleted ones, and with an empty or missing key", () => {
    expect(controlCenterMoved([])).toBe(false);
    expect(controlCenterMoved([record(PLAIN_DOC)])).toBe(false);
    expect(controlCenterMoved([record(MOVED_DOC, true)])).toBe(false);
    expect(controlCenterMoved([record({ ...MOVED_DOC, legacyControlEntityId: "" })])).toBe(false);
    expect(controlCenterMoved([record({ ...MOVED_DOC, legacyControlEntityId: 7 })])).toBe(false);
    expect(controlCenterMoved([record(null)])).toBe(false);
  });
});

describe("the note that stands in for the editor", () => {
  it("says where the tiles live now and links there", () => {
    let opened = 0;
    const template = renderControlCenterMoved(() => { opened++; });
    const text = flat(template);
    expect(text).toContain(CONTROL_CENTER_MOVED_TITLE);
    expect(text).toContain(CONTROL_CENTER_MOVED_TEXT);
    expect(text).toContain(CONTROL_CENTER_MOVED_LINK);
    expect(CONTROL_CENTER_MOVED_TITLE).toContain("Complications");
    const click = (template.values as unknown[]).find((v): v is () => void => typeof v === "function");
    click?.();
    expect(opened).toBe(1);
  });

  it("is plain short sentences", () => {
    for (const words of [CONTROL_CENTER_MOVED_TITLE, CONTROL_CENTER_MOVED_TEXT, CONTROL_CENTER_MOVED_LINK]) {
      expect(words).not.toMatch(/ - |\u2013|\u2014/);
    }
    for (const sentence of CONTROL_CENTER_MOVED_TEXT.split(". ")) {
      expect(sentence.split(" ").length).toBeLessThanOrEqual(14);
    }
  });
});

// ── the editor ───────────────────────────────────────────────────────────

let made = 0;

const CC_RECORD: WatchConfigRecord = {
  kind: "control_center",
  revision: 3,
  hash: null,
  updated_at: "2026-10-12T00:00:00Z",
  updated_by: "panel",
  delivered_revision: 3,
  delivered_at: "2026-10-12T00:00:00Z",
  document: {
    schemaVersion: 1,
    entities: [{ displayName: "Kitchen", domain: "light", entityId: "light.kitchen", iconName: "lightbulb" }],
  },
};

interface EditorInside {
  hass?: HassLike;
  owners: readonly OwnerSummary[];
  watchId?: string;
  onBack?: () => void;
  load(watchId: string, quiet?: boolean): Promise<void>;
  render(): unknown;
  renderBody(watches: readonly OwnerSummary[]): unknown;
}

/** An unconnected editor on one watch, its reads answered by `list`. */
function editor(list: () => Promise<{ records: ComplicationRecord[] }>) {
  const id = `moved-w${++made}`;
  const asked: string[] = [];
  const hass = {
    user: { is_admin: true },
    states: { "light.kitchen": { state: "on", attributes: { friendly_name: "Kitchen" } } },
    connection: {
      sendMessagePromise: (msg: { type: string }) => {
        asked.push(msg.type);
        if (msg.type === "wrist_assistant/complications/list") return list();
        if (msg.type.endsWith("/get")) return Promise.resolve(structuredClone(CC_RECORD));
        return Promise.reject(Object.assign(new Error("unknown"), { code: "unknown_command" }));
      },
    },
  } as unknown as HassLike;
  const owners = [
    { owner_watch_id: id, device_name: "Jesse's Watch", device_kind: "watch", paired_iphone_name: null, is_orphan: false },
  ] as unknown as OwnerSummary[];
  const el = new WaControlCenterEditor() as unknown as EditorInside;
  el.hass = hass;
  el.owners = owners;
  el.watchId = id;
  let back = 0;
  el.onBack = () => { back++; };
  const body = () => flat(el.renderBody(owners));
  const whole = () => flat(el.render());
  return { el, id, asked, body, whole, backs: () => back };
}

describe("the Control Center screen", () => {
  it("shows the note, not the editor, on a watch that owns a moved control", async () => {
    const { el, id, asked, body, whole, backs } = editor(() => Promise.resolve({ records: [record(MOVED_DOC)] }));
    await el.load(id);
    expect(asked).toContain("wrist_assistant/complications/list");
    const text = body();
    expect(text).toContain(CONTROL_CENTER_MOVED_TITLE);
    expect(text).toContain(CONTROL_CENTER_MOVED_LINK);
    expect(text).not.toContain("cc-entries-card");
    // Nothing in the bar edits or saves the old list any more.
    expect(whole()).not.toContain("primary save");
    // The link is the way back to Complications.
    const note = el.renderBody(el.owners) as { values: unknown[] };
    const click = note.values.find((v): v is () => void => typeof v === "function");
    click?.();
    expect(backs()).toBe(1);
  });

  it("keeps the editor exactly as before on a watch with no moved control", async () => {
    const { el, id, body, whole } = editor(() => Promise.resolve({ records: [record(PLAIN_DOC), record(MOVED_DOC, true)] }));
    await el.load(id);
    const text = body();
    expect(text).not.toContain(CONTROL_CENTER_MOVED_TITLE);
    expect(text).toContain("cc-entries-card");
    expect(whole()).toContain("primary save");
  });

  it("keeps the editor when the watch's complications cannot be read", async () => {
    const { el, id, body } = editor(() => Promise.reject(new Error("offline")));
    await el.load(id);
    const text = body();
    expect(text).not.toContain(CONTROL_CENTER_MOVED_TITLE);
    expect(text).toContain("cc-entries-card");
  });
});
