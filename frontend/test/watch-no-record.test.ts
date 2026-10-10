// What every watch editor offers while Home Assistant holds no record of its
// kind. The iPhone app moves the watch's setup here once, the first time the
// updated app opens, and only for a kind Home Assistant holds none of; so
// while the watch has an iPhone (`has_iphone` on its owner row) each editor
// waits, and its start becomes a small "Start fresh instead" link that asks
// first. A watch with no iPhone, and an integration older than the field,
// keep the Start button. No text names the iPhone switch the app no longer
// has. The page editor and Watch settings are driven end to end in
// watch-start-flows.test.ts; this covers the decision, the words, and the
// other editors' no-record bodies.

import { afterEach, describe, expect, it, vi } from "vitest";

import type { OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import { WaControlCenterEditor } from "../src/watch-control-center/control-center-editor.js";
import {
  CONTROL_CENTER_NO_RECORD_TEXT,
  CONTROL_CENTER_NO_RECORD_TITLE,
  CONTROL_CENTER_START_EMPTY_BUTTON,
} from "../src/watch-control-center/model.js";
import { HTTP_ACTIONS_PHONE_TEXT } from "../src/watch-http-actions/model.js";
import { WaMenuEditor } from "../src/watch-menus/menu-editor.js";
import { WATCH_MENUS_NO_RECORD_TEXT, WATCH_MENUS_NO_RECORD_TITLE, WATCH_MENUS_START_BUTTON } from "../src/watch-menus/model.js";
import { STYLE_NO_RECORD_TEXT, STYLE_START_BUTTON } from "../src/watch-notification-style/model.js";
import { ROOMS_NO_RECORD_TEXT, ROOMS_WAIT_TEXT } from "../src/watch-rooms/model.js";
import { WaRoomsEditor } from "../src/watch-rooms/rooms-editor.js";
import {
  PAGES_NO_RECORD_TEXT,
  SETTINGS_NO_RECORD_TEXT,
  START_FRESH_BUTTON,
  START_FRESH_CONFIRM_TEXT,
  WAIT_FOR_IPHONE_TEXT,
  mayStart,
  noRecordStart,
  noRecordText,
} from "../src/watch-settings.js";
import {
  STATUS_PAGES_NO_RECORD_TEXT,
  STATUS_PAGES_NO_RECORD_TITLE,
  STATUS_PAGES_START_BUTTON,
  STATUS_PAGES_START_EMPTY_BUTTON,
} from "../src/watch-status-pages/model.js";
import { WaStatusPagesEditor } from "../src/watch-status-pages/status-pages-editor.js";
import { WATCH_VOICE_NO_RECORD_TEXT, WATCH_VOICE_START_BUTTON } from "../src/watch-voice/model.js";
import { WaVoiceEditor } from "../src/watch-voice/voice-editor.js";

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

const owner = (id: string, extra: Partial<OwnerSummary> = {}): OwnerSummary => ({
  owner_watch_id: id,
  device_name: "Apple Watch",
  device_kind: "watch",
  paired_iphone_name: null,
  app_version: "3.1.0",
  screen_size: null,
  complication_count: 0,
  token: 1,
  is_orphan: false,
  ...extra,
} as OwnerSummary);

const empty = (kind: string): WatchConfigRecord => ({
  kind,
  revision: 0,
  hash: null,
  updated_at: null,
  updated_by: null,
  delivered_revision: 0,
  delivered_at: null,
});

// ── the decision ─────────────────────────────────────────────────────────

describe("the no-record state", () => {
  it("waits only for a watch the integration says has an iPhone", () => {
    expect(noRecordStart(owner("w", { has_iphone: true }))).toBe("wait");
    expect(noRecordStart(owner("w", { has_iphone: false }))).toBe("start");
    expect(noRecordStart(owner("w", { has_iphone: null }))).toBe("start");
  });

  it("keeps the Start button for an integration older than the field, and for no watch", () => {
    expect(noRecordStart(owner("w"))).toBe("start");
    expect(noRecordStart(undefined)).toBe("start");
  });

  it("says the wait text while waiting, else the editor's own", () => {
    expect(noRecordText("wait", PAGES_NO_RECORD_TEXT)).toBe(WAIT_FOR_IPHONE_TEXT);
    expect(noRecordText("start", PAGES_NO_RECORD_TEXT)).toBe(PAGES_NO_RECORD_TEXT);
  });

  it("asks before starting fresh while waiting, and only then", () => {
    const no = vi.fn(() => false);
    const yes = vi.fn(() => true);
    expect(mayStart("wait", no)).toBe(false);
    expect(no).toHaveBeenCalledWith(START_FRESH_CONFIRM_TEXT);
    expect(mayStart("wait", yes)).toBe(true);
    const never = vi.fn(() => false);
    expect(mayStart("start", never)).toBe(true);
    expect(never).not.toHaveBeenCalled();
  });
});

// ── the words ────────────────────────────────────────────────────────────

describe("the no-record words", () => {
  it("say the wait, the link and the question in plain words", () => {
    expect(WAIT_FOR_IPHONE_TEXT).toBe(
      "Waiting for your iPhone. Update Wrist Assistant on your iPhone and open it once. Your watch setup moves here by itself.",
    );
    expect(START_FRESH_BUTTON).toBe("Start fresh instead");
    expect(START_FRESH_CONFIRM_TEXT).toBe("Your iPhone's setup will not move. Start fresh?");
  });

  it("give every editor a start line that matches its button", () => {
    expect(PAGES_NO_RECORD_TEXT).toBe("Start with an empty page to begin.");
    expect(SETTINGS_NO_RECORD_TEXT).toBe("Start with the defaults to begin.");
    for (const [text, button] of [
      [WATCH_MENUS_NO_RECORD_TEXT, WATCH_MENUS_START_BUTTON],
      [WATCH_VOICE_NO_RECORD_TEXT, WATCH_VOICE_START_BUTTON],
      [STYLE_NO_RECORD_TEXT, STYLE_START_BUTTON],
      [STATUS_PAGES_NO_RECORD_TEXT, STATUS_PAGES_START_BUTTON],
      [CONTROL_CENTER_NO_RECORD_TEXT, CONTROL_CENTER_START_EMPTY_BUTTON],
    ]) {
      expect(text).toBe(`${button} to begin.`);
    }
    expect(ROOMS_NO_RECORD_TEXT).toBe("Rooms are part of the watch's settings. Start them under Watch app, Settings.");
    expect(ROOMS_WAIT_TEXT).toBe(`Rooms are part of the watch's settings. ${WAIT_FOR_IPHONE_TEXT}`);
    expect(HTTP_ACTIONS_PHONE_TEXT).toBe("Update Wrist Assistant on your iPhone and open it once. Its HTTP actions move here by themselves.");
  });

  it("never name the iPhone switch the app no longer has, nor break a sentence with a dash", () => {
    for (const text of [
      WAIT_FOR_IPHONE_TEXT, START_FRESH_BUTTON, START_FRESH_CONFIRM_TEXT,
      PAGES_NO_RECORD_TEXT, SETTINGS_NO_RECORD_TEXT, WATCH_MENUS_NO_RECORD_TEXT, WATCH_VOICE_NO_RECORD_TEXT,
      STYLE_NO_RECORD_TEXT, STATUS_PAGES_NO_RECORD_TEXT, CONTROL_CENTER_NO_RECORD_TEXT,
      ROOMS_NO_RECORD_TEXT, ROOMS_WAIT_TEXT, HTTP_ACTIONS_PHONE_TEXT,
    ]) {
      expect(text).not.toMatch(/Edit pages in Home Assistant|Pages in Home Assistant|turn on/);
      expect(text).not.toMatch(new RegExp(" - |\\u2013|\\u2014"));
    }
  });
});

// ── the other editors' no-record bodies ──────────────────────────────────

interface EditorInside {
  watchId?: string;
  record?: WatchConfigRecord;
  renderBody(watches: readonly OwnerSummary[]): unknown;
}

const editors: { name: string; make: () => EditorInside; kind: string; startButton: string }[] = [
  { name: "menus", make: () => new WaMenuEditor() as unknown as EditorInside, kind: "menus", startButton: WATCH_MENUS_START_BUTTON },
  { name: "voice", make: () => new WaVoiceEditor() as unknown as EditorInside, kind: "voice", startButton: WATCH_VOICE_START_BUTTON },
  { name: "status pages", make: () => new WaStatusPagesEditor() as unknown as EditorInside, kind: "status_pages", startButton: STATUS_PAGES_START_BUTTON },
  { name: "Control Center", make: () => new WaControlCenterEditor() as unknown as EditorInside, kind: "control_center", startButton: CONTROL_CENTER_START_EMPTY_BUTTON },
];

describe.each(editors)("the $name editor with no record", ({ make, kind, startButton }) => {
  const body = (extra: Partial<OwnerSummary>) => {
    const el = make();
    el.watchId = "w1";
    el.record = empty(kind);
    return flatten(el.renderBody([owner("w1", extra)]));
  };

  it("keeps its Start button for a watch with no iPhone and for an older integration", () => {
    for (const extra of [{ has_iphone: false }, {}]) {
      const text = body(extra);
      expect(text).toContain(startButton);
      expect(text).toContain("pe-btn pe-primary");
      expect(text).not.toContain(WAIT_FOR_IPHONE_TEXT);
      expect(text).not.toContain(START_FRESH_BUTTON);
    }
  });

  it("waits for the iPhone with a small Start fresh link while the watch has one", () => {
    const text = body({ has_iphone: true });
    expect(text).toContain(WAIT_FOR_IPHONE_TEXT);
    expect(text).toContain(START_FRESH_BUTTON);
    expect(text).toContain("link start-fresh");
    expect(text).not.toContain(startButton);
    expect(text).not.toContain("pe-btn pe-primary");
  });
});

describe("the rooms editor with no record", () => {
  const body = (extra: Partial<OwnerSummary>) => {
    const el = new WaRoomsEditor() as unknown as EditorInside;
    el.watchId = "w1";
    el.record = empty("behavior");
    return flatten(el.renderBody([owner("w1", extra)]));
  };

  it("points at Watch settings' start without an iPhone, and waits with one", () => {
    expect(body({ has_iphone: false })).toContain(ROOMS_NO_RECORD_TEXT);
    expect(body({})).toContain(ROOMS_NO_RECORD_TEXT);
    const waiting = body({ has_iphone: true });
    expect(waiting).toContain(ROOMS_WAIT_TEXT);
    expect(waiting).not.toContain(ROOMS_NO_RECORD_TEXT);
  });
});

describe("the menus and status pages editors on an iPhone with no record", () => {
  const phone = owner("p1", { device_kind: "iphone", device_name: "iPhone", has_iphone: false });
  const cases = [
    { make: () => new WaMenuEditor(), kind: "menus", title: "No menus on this iPhone yet.", watchTitle: WATCH_MENUS_NO_RECORD_TITLE, button: WATCH_MENUS_START_BUTTON },
    { make: () => new WaStatusPagesEditor(), kind: "status_pages", title: "No status pages on this iPhone yet.", watchTitle: STATUS_PAGES_NO_RECORD_TITLE, button: STATUS_PAGES_START_BUTTON },
  ];

  it.each(cases)("names the iPhone, not a watch, for $kind", ({ make, kind, title, watchTitle, button }) => {
    const el = make() as unknown as EditorInside & { owners: OwnerSummary[]; phones: boolean };
    el.owners = [owner("w1"), phone];
    el.phones = true;
    el.watchId = "p1";
    el.record = empty(kind);
    const text = flatten(el.renderBody(el.owners));
    expect(text).toContain(title);
    expect(text).not.toContain(watchTitle);
    expect(text).toContain(button);
    expect(text).not.toContain(WAIT_FOR_IPHONE_TEXT);

    // The same editor on the watch keeps the watch's words.
    el.watchId = "w1";
    expect(flatten(el.renderBody(el.owners))).toContain(watchTitle);
  });
});

describe("the status pages editor's empty start while waiting", () => {
  it("leaves the empty list to the ··· menu", () => {
    const el = new WaStatusPagesEditor() as unknown as EditorInside;
    el.watchId = "w1";
    el.record = empty("status_pages");
    const text = flatten(el.renderBody([owner("w1", { has_iphone: true })]));
    expect(text).not.toContain(STATUS_PAGES_START_EMPTY_BUTTON);
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});
