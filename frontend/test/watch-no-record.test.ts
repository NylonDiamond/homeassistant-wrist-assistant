// What every watch editor offers while Home Assistant holds no record of its
// kind. The iPhone app moves the watch's setup here once, the first time the
// updated app opens, and only for a kind Home Assistant holds none of; so
// while the watch has an iPhone (`has_iphone` on its owner row) each editor
// waits, with a small "Start fresh instead" link that asks first. A watch
// with no iPhone, and an integration older than the field, open the menu,
// status page, voice and rooms screens ready instead: no Start button, the
// new watch line over the screen, nothing saved until the first Save
// (`watch-menus/new-watch.ts`). No text names the iPhone switch the app no
// longer has. The page editor and Watch settings are driven end to end in
// watch-start-flows.test.ts; this covers the decision, the words, and the
// other editors' no-record bodies.

import { afterEach, describe, expect, it, vi } from "vitest";

import type { OwnerSummary, WatchConfigRecord } from "../src/ha-api.js";
import { HTTP_ACTIONS_PHONE_TEXT } from "../src/watch-http-actions/model.js";
import type { HassLike } from "../src/ha-api.js";
import { dropAllWatchMenus } from "../src/watch-menus/draft.js";
import { WATCH_MENUS_NO_RECORD_TITLE } from "../src/watch-menus/model.js";
import {
  choseStartFresh,
  firstSaveNote,
  forgetStartFreshChoices,
  opensReady,
  saveBlockedText,
} from "../src/watch-menus/new-watch.js";
import { forgetRoomsDraft } from "../src/watch-rooms/draft.js";
import { ROOMS_NO_RECORD_TITLE, ROOMS_WAIT_TEXT } from "../src/watch-rooms/model.js";
import { WaRoomsEditor } from "../src/watch-rooms/rooms-editor.js";
import {
  NEW_WATCH_TEXT,
  NOTHING_TO_SAVE_TEXT,
  PAIR_FIRST_TEXT,
  START_FRESH_BUTTON,
  START_FRESH_CONFIRM_TEXT,
  WAIT_FOR_IPHONE_TEXT,
  mayStart,
  newDeviceText,
  noRecordStart,
} from "../src/watch-settings.js";
import { dropAllStatusPages } from "../src/watch-status-pages/draft.js";
import { STATUS_PAGES_NO_RECORD_TITLE } from "../src/watch-status-pages/model.js";
import { dropAllWatchVoice } from "../src/watch-voice/draft.js";
import { WATCH_VOICE_NO_RECORD_TITLE, WATCH_VOICE_UPDATE_TEXT } from "../src/watch-voice/model.js";
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

  it("give the rooms and HTTP actions their own wait lines", () => {
    expect(ROOMS_WAIT_TEXT).toBe(`Rooms are part of the watch's settings. ${WAIT_FOR_IPHONE_TEXT}`);
    expect(HTTP_ACTIONS_PHONE_TEXT).toBe("Update Wrist Assistant on your iPhone and open it once. Its HTTP actions move here by themselves.");
  });

  it("never name the iPhone switch the app no longer has, nor break a sentence with a dash", () => {
    for (const text of [
      WAIT_FOR_IPHONE_TEXT, START_FRESH_BUTTON, START_FRESH_CONFIRM_TEXT,
      WATCH_MENUS_NO_RECORD_TITLE, WATCH_VOICE_NO_RECORD_TITLE,
      STATUS_PAGES_NO_RECORD_TITLE,
      ROOMS_NO_RECORD_TITLE, ROOMS_WAIT_TEXT, HTTP_ACTIONS_PHONE_TEXT, NEW_WATCH_TEXT, NOTHING_TO_SAVE_TEXT,
    ]) {
      expect(text).not.toMatch(/Edit pages in Home Assistant|Pages in Home Assistant|turn on/);
      expect(text).not.toMatch(new RegExp(" - |\\u2013|\\u2014"));
    }
  });
});

// ── the other editors' no-record bodies ──────────────────────────────────

// ── a new watch, ready ───────────────────────────────────────────────────

describe("a new watch's ready screen", () => {
  it("opens ready with no iPhone, and while one may move the setup only after Start fresh", () => {
    forgetStartFreshChoices();
    expect(opensReady("start", "menus", "w1")).toBe(true);
    expect(opensReady("start", "menus", undefined)).toBe(true);
    expect(opensReady("wait", "menus", "w1")).toBe(false);
    expect(choseStartFresh("menus", "w1")).toBe(false);
    forgetStartFreshChoices();
  });

  it("gives Save's reason only on a new watch with nothing changed and no save running", () => {
    expect(saveBlockedText({ newWatch: true, dirty: false, saving: false })).toBe(NOTHING_TO_SAVE_TEXT);
    expect(saveBlockedText({ newWatch: true, dirty: true, saving: false })).toBe("");
    expect(saveBlockedText({ newWatch: true, dirty: true, saving: true })).toBe("");
    expect(saveBlockedText({ newWatch: false, dirty: false, saving: false })).toBe("");
  });

  it("asks to pair first when a first save meets no_record, and keeps the editor's note otherwise", () => {
    const own = { kind: "warn" as const, text: "own" };
    expect(firstSaveNote(true, "no_record", own)).toEqual({ kind: "warn", text: PAIR_FIRST_TEXT });
    expect(firstSaveNote(false, "no_record", own)).toBe(own);
    expect(firstSaveNote(true, "conflict", own)).toBe(own);
    expect(firstSaveNote(true, undefined, undefined)).toBeUndefined();
  });

  it("says it in plain words", () => {
    expect(NEW_WATCH_TEXT).toBe("New watch. The watch keeps what it has until you save here. Your first Save replaces it.");
    expect(NOTHING_TO_SAVE_TEXT).toBe("Nothing to save yet. Make a change first.");
  });
});

interface EditorInside {
  hass?: HassLike;
  owners: readonly OwnerSummary[];
  watchId?: string;
  record?: WatchConfigRecord;
  draft?: { dirty: boolean; revision: number };
  renderBody(watches: readonly OwnerSummary[]): unknown;
  renderTopBar(draft: unknown, watches: readonly OwnerSummary[]): unknown;
  startFresh(): void;
}

/** Enough of Home Assistant for the views to draw. */
const HASS = { states: {}, entities: {}, devices: {}, areas: {}, user: { is_admin: true }, language: "en" } as unknown as HassLike;

const editors: { name: string; make: () => EditorInside; kind: string; title: string; update: string }[] = [
  { name: "voice", make: () => new WaVoiceEditor() as unknown as EditorInside, kind: "voice", title: WATCH_VOICE_NO_RECORD_TITLE, update: WATCH_VOICE_UPDATE_TEXT },
];

function dropDrafts(): void {
  dropAllWatchMenus();
  dropAllWatchVoice();
  dropAllStatusPages();
  forgetRoomsDraft("w1");
  forgetStartFreshChoices();
}

describe.each(editors)("the $name editor with no record", ({ make, kind, title, update }) => {
  const opened = (extra: Partial<OwnerSummary>) => {
    const el = make();
    el.hass = HASS;
    el.owners = [owner("w1", extra)];
    el.watchId = "w1";
    el.record = empty(kind);
    return el;
  };
  const body = (el: EditorInside) => flatten(el.renderBody(el.owners));
  const bar = (el: EditorInside) => flatten(el.renderTopBar(el.draft, el.owners));

  afterEach(dropDrafts);

  it("opens ready under the new watch line, with no Start, for a watch with no iPhone and for an older integration", () => {
    for (const extra of [{ has_iphone: false }, {}]) {
      dropDrafts();
      const el = opened(extra);
      const text = body(el);
      expect(text).toContain(NEW_WATCH_TEXT);
      expect(text).toContain("nw-banner");
      expect(text).not.toContain(title);
      expect(text).not.toContain("Start with");
      expect(text).not.toContain(WAIT_FOR_IPHONE_TEXT);
      expect(text).not.toContain(START_FRESH_BUTTON);
      // Unsaved, not dirty, at revision 0: Save is greyed out and says why.
      expect(el.draft?.revision).toBe(0);
      expect(el.draft?.dirty).toBe(false);
      const top = bar(el);
      expect(top).toContain(NOTHING_TO_SAVE_TEXT);
      expect(top).not.toContain("Start with");
    }
  });

  it("waits for the iPhone with a small Start fresh link while the watch has one", () => {
    const el = opened({ has_iphone: true });
    const text = body(el);
    expect(text).toContain(title);
    expect(text).toContain(WAIT_FOR_IPHONE_TEXT);
    expect(text).toContain(START_FRESH_BUTTON);
    expect(text).toContain("link start-fresh");
    expect(text).not.toContain("pe-btn pe-primary");
    expect(text).not.toContain(NEW_WATCH_TEXT);
    expect(el.draft).toBeUndefined();
  });

  it("never opens ready over a record it cannot read", () => {
    const el = opened({ has_iphone: false });
    el.record = { ...empty(kind), revision: 3, document: "not a document" } as unknown as WatchConfigRecord;
    const text = body(el);
    expect(text).toContain(update);
    expect(text).not.toContain(NEW_WATCH_TEXT);
    expect(text).not.toContain(START_FRESH_BUTTON);
  });

  it("opens the same ready screen from Start fresh, once confirmed, and writes nothing", () => {
    const el = opened({ has_iphone: true });
    vi.stubGlobal("window", { confirm: () => false });
    el.startFresh();
    expect(body(el)).toContain(WAIT_FOR_IPHONE_TEXT);
    vi.stubGlobal("window", { confirm: () => true });
    el.startFresh();
    const text = body(el);
    expect(text).toContain(NEW_WATCH_TEXT);
    expect(text).not.toContain(WAIT_FOR_IPHONE_TEXT);
    expect(el.draft?.revision).toBe(0);
    expect(el.draft?.dirty).toBe(false);
    vi.unstubAllGlobals();
  });
});

describe("the rooms editor with no record", () => {
  afterEach(dropDrafts);

  const opened = (extra: Partial<OwnerSummary>) => {
    const el = new WaRoomsEditor() as unknown as EditorInside;
    el.hass = HASS;
    el.owners = [owner("w1", extra)];
    el.watchId = "w1";
    el.record = empty("behavior");
    return el;
  };

  it("opens ready without an iPhone, and waits with one", () => {
    for (const extra of [{ has_iphone: false }, {}]) {
      dropDrafts();
      const el = opened(extra);
      const text = flatten(el.renderBody(el.owners));
      expect(text).toContain(NEW_WATCH_TEXT);
      expect(text).not.toContain("Open Settings");
      expect(text).not.toContain(ROOMS_NO_RECORD_TITLE);
      expect(flatten(el.renderTopBar(el.draft, el.owners))).toContain(NOTHING_TO_SAVE_TEXT);
    }
    dropDrafts();
    const waiting = flatten(opened({ has_iphone: true }).renderBody([owner("w1", { has_iphone: true })]));
    expect(waiting).toContain(ROOMS_WAIT_TEXT);
    expect(waiting).toContain(START_FRESH_BUTTON);
    expect(waiting).not.toContain(NEW_WATCH_TEXT);
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});
