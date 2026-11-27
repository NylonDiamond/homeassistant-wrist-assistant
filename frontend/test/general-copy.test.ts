// General copy: the lines about no device in particular. Since 2026-11-14
// they say phone and watch in every home (`fixtures-general-copy/phone.json`,
// rendered from the branch's first Android words at 2176d1b5), whether or not
// an Android phone or a Wear OS watch is paired. Until then a home of Apple
// devices only kept the words main had before the Android apps
// (`fixtures-general-copy/apple.json`, rendered from main at 141473ca); that
// fixture stays only as a record, and to check that every probe here is a
// line the switch changed. Both fixtures were made by calling the same
// functions and reading the same constants, so a probe here that differs from
// phone.json by one byte fails.
//
// Whether an Android device is paired here still decides the Android only
// extras (the Google Play links and QR code): `fetchOwners` notes the owners
// reply's `paired_platforms` (every paired device, whoever asks), or its rows
// from an integration without that field.

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { COMP_WHERE_HINTS, compCell, compGreyNote, compLeftOutText } from "../src/complication-board.js";
import { androidHereNow, homeHasAndroid, noteHomeDevices, setAndroidHere } from "../src/device-platform.js";
import { PLAY_STORE_URL, gettingStarted, helpStepWords, pairStepTodoText, updateFirstText } from "../src/getting-started.js";
import { fetchOwners, type OwnerSummary } from "../src/ha-api.js";
import { helpScreen, pagesPhoneTilesText, renderHelpSheet } from "../src/help-sheet.js";
import { deviceSheetTabs, homeDoorLook, homeLibraryLead } from "../src/home.js";
import { previewLabel } from "../src/library/item-mode.js";
import { previewNote } from "../src/library/new-dialog.js";
import { tickSkipsTitle } from "../src/library/ticks.js";
import { kindTitle, newSummary } from "../src/newComplication.js";
import { PAIR_CHOICES, pairCodeSteps, pairCodeTitle, pairQrTitle, pairSubtitle, pairToQrText, welcomeEasyText } from "../src/pair-flow.js";
import { SCREEN_HOW_TO } from "../src/screen-howto.js";
import { notOnADeviceHelp, notOnADeviceLine, notOnADeviceUnsavedLine } from "../src/send-state.js";
import { TAB_LABEL, WATCH_SCREENS } from "../src/shell.js";
import { syncPillSummary } from "../src/sync-pill.js";
import { camerasLead } from "../src/watch-cameras/cameras-editor.js";
import { clientCertForHint, clientCertRemoveAsk, clientCertSavedNote } from "../src/watch-client-cert.js";
import { httpActionsSharedText } from "../src/watch-http-actions/model.js";
import { makeFirstMenuText, menusEmptyText, newMenuAdminText } from "../src/watch-menus/all-menus-model.js";
import { phoneNoPhrasesText } from "../src/watch-menus/model.js";
import { styleRow, styleRowOn } from "../src/watch-notification-style/model.js";
import { watchPhoneAddedText, watchPhoneGreyedText, watchPhoneGroupTitle, watchPhoneLandsText, watchPhoneTilesBlockedText } from "../src/watch-pages/add-tile-list.js";
import { allPagesLead, allPagesLeadLine, emptyLibraryText, emptyText, footText } from "../src/watch-pages/all-pages-model.js";
import { noScreensDifferText, twoScreensCardText } from "../src/watch-pages/all-pages-screens.js";
import { oneLookArtworkNote, oneLookChartNote, oneLookStateRowNote, oneLookTextShadowNote } from "../src/watch-pages/one-look-settings.js";
import { renderPreviewSeg } from "../src/watch-pages/page-frame.js";
import { watchWebURLNote } from "../src/watch-pages/phone-tiles-model.js";
import { phoneScreenFoldText } from "../src/watch-pages/preview.js";
import { notForIphoneText, watchCommandError } from "../src/watch-pages/save-note.js";
import { WATCH_TILE_SETTINGS_SECTION_TITLES, watchPhoneExtrasTitle, watchSensorChartShortNote } from "../src/watch-pages/tile-settings-options.js";
import { iphoneRowNoneNote } from "../src/watch-row.js";
import {
  pairCodeHint,
  pairCodeStepsForAny,
  pairErrorText,
  pairQrHint,
  pairQrReplaceHint,
  pairQrReplaceLabel,
  pairQrSteps,
  pairUserHint,
  pairUserTitle,
} from "../src/watch-settings.js";
import { thisDeviceSearchWords } from "../src/watch-this-device.js";
import { voiceLinkErrorText } from "../src/watch-voice/links.js";
import apple from "./fixtures-general-copy/apple.json";
import drawn from "./fixtures-general-copy/drawn.json";
import phone from "./fixtures-general-copy/phone.json";

afterEach(() => setAndroidHere(false));

/** Every probe, by the fixtures' ids, as the panel reads it now. */
function probes(): Record<string, unknown> {
  const phoneRow = { owner_watch_id: "p1", device_kind: "iphone", device_name: "P", app_version: "3.2.0", complication_count: 0, token: 1, is_orphan: false } as never;
  const controlTab = deviceSheetTabs("iphone").find((t) => (t as { kind: string }).kind === "list" && (t as { filter?: string }).filter === "control")!;
  const facts = { listed: false, on: false, last: false, draws: true, full: false, designKind: "iphone", deviceKind: "watch", deviceName: "Den Watch", lockShape: false, shelfName: "Library" } as never;
  const chartTile = { id: "t", entityId: "sensor.t", rowSpan: 2, sensorChart: "24h" } as never;
  return {
    compWhereHome: COMP_WHERE_HINTS.home,
    compWhereControl: COMP_WHERE_HINTS.control,
    compCellDash: compCell(facts).dash,
    compGreyBoth: compGreyNote({ watchGrey: true, iphoneGrey: true }),
    compGreyIphone: compGreyNote({ watchGrey: false, iphoneGrey: true }),
    compGreyWatch: compGreyNote({ watchGrey: true, iphoneGrey: false }),
    compLeftOutWatch: compLeftOutText("watch", 2),
    compLeftOutIphone: compLeftOutText("iphone", 1),
    getAppDone: helpStepWords("app", gettingStarted([phoneRow], undefined)).text,
    getAppTodo: helpStepWords("app", gettingStarted([], undefined)).text,
    pairStepTodo: pairStepTodoText(),
    updateFirst: updateFirstText(),
    welcomeEasy: welcomeEasyText(),
    helpHome: helpScreen(undefined).text,
    helpShared: helpScreen({ path: "/shared", prefix: "/x" } as never).text,
    helpComplications: helpScreen({ path: "/complications", prefix: "/x" } as never).text,
    helpPages: helpScreen({ path: "/all-pages", prefix: "/x" } as never).text,
    helpIphoneScreen: helpScreen({ path: "/iphone/pages/p1", prefix: "/x" } as never).text,
    pagesPhoneTiles: pagesPhoneTilesText(),
    homeLibraryLead: homeLibraryLead(),
    homeControlBlurb: homeDoorLook(controlTab, "iphone").blurb,
    previewLabelNone: previewLabel("iphone", []),
    previewLabelSome: previewLabel("iphone", ["Den"]),
    previewNote: previewNote("iphone"),
    tickSkips: tickSkipsTitle("Den Watch", ["Map", "Garden"]),
    kindTitle: kindTitle("iphone"),
    newSummary: newSummary({ named: true, kind: "iphone", family: "medium", devices: 2 } as never),
    pairChoices: PAIR_CHOICES.map((c) => [c.label, c.line]),
    pairSubtitles: [pairSubtitle(true, "code", undefined), pairSubtitle(false, "qr", "iphone"), pairSubtitle(false, "code", "watch"), pairSubtitle(false, "code", "iphone"), pairSubtitle(false, "code", undefined)],
    pairCodeTitle: pairCodeTitle("iphone"),
    pairCodeStepsIphone: pairCodeSteps("iphone"),
    pairCodeStepsAny: pairCodeSteps(undefined),
    pairQrTitle: pairQrTitle(),
    pairToQr: pairToQrText(),
    howStatusPages: SCREEN_HOW_TO["status-pages"].how,
    howCameras: SCREEN_HOW_TO["cameras"].how,
    howHomeMap: SCREEN_HOW_TO["home-map"].how,
    notOnLine: notOnADeviceLine(),
    notOnUnsaved: notOnADeviceUnsavedLine(),
    notOnHelp: notOnADeviceHelp(),
    tabIphone: TAB_LABEL.iphone,
    screenBlurbs: WATCH_SCREENS.map((s) => s.blurb),
    syncPillNone: syncPillSummary([]).title,
    camerasLead: camerasLead(),
    certFor: clientCertForHint(),
    certSaved: [clientCertSavedNote(), clientCertSavedNote(), clientCertSavedNote("Anna")],
    certRemove: [clientCertRemoveAsk(), clientCertRemoveAsk(), clientCertRemoveAsk("Anna")],
    httpShared: httpActionsSharedText(),
    menuAdmin: newMenuAdminText(),
    menuFirst: makeFirstMenuText(false),
    menusEmpty: menusEmptyText([], ""),
    noPhrases: phoneNoPhrasesText(),
    // An Apple Watch's settings, the device on show not an Android one.
    webhookHelp: styleRowOn(styleRow("storedWebhookButtonSize")!, "watchos").help,
    phoneTiles: [watchPhoneGroupTitle(), watchPhoneGreyedText(), watchPhoneLandsText(), watchPhoneAddedText(), watchPhoneTilesBlockedText({ name: "Den Watch", version: "3.1.0" })],
    allPages: [allPagesLeadLine(), allPagesLead(3), emptyLibraryText("pages", true), footText("pages", undefined, false, "cards"), emptyText([], "")],
    screens: [noScreensDifferText(), twoScreensCardText()],
    oneLook: [oneLookTextShadowNote(), oneLookArtworkNote(), oneLookChartNote(), oneLookStateRowNote("light", "statusTextShadow", true)],
    webNote: watchWebURLNote("ftp://example.com"),
    foldText: phoneScreenFoldText(),
    notForIphone: [notForIphoneText(), watchCommandError({ code: "not_for_iphone", message: "x" }).message],
    sectionTitles: [WATCH_TILE_SETTINGS_SECTION_TITLES.phone, WATCH_TILE_SETTINGS_SECTION_TITLES.phoneExtras, WATCH_TILE_SETTINGS_SECTION_TITLES.phoneTile, watchPhoneExtrasTitle()],
    chartShort: watchSensorChartShortNote(chartTile),
    iphoneRowNone: iphoneRowNoneNote(),
    pairHints: [pairCodeHint(), pairQrHint()],
    pairQrSteps: [...pairQrSteps()],
    pairCodeSteps: [...pairCodeStepsForAny()],
    pairQrReplace: [pairQrReplaceLabel(), pairQrReplaceHint()],
    pairOfferOld: pairErrorText({ code: "unknown_command", message: "Unknown command." }, "offer"),
    // The QR code's person menu, which is for whichever phone scans it.
    qrUserTitle: pairUserTitle("iphone", "any"),
    qrUserHint: pairUserHint("iphone", "any"),
    searchWords: thisDeviceSearchWords(),
    voiceNotForIphone: voiceLinkErrorText({ code: "not_for_iphone", message: "x" }),
  };
}

/** A template's text and attribute values, as one string. */
const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

describe("general copy with no Android device paired", () => {
  it("is the phone and watch words, byte for byte", () => {
    setAndroidHere(false);
    const now = probes();
    expect(Object.keys(now).sort()).toEqual(Object.keys(phone).sort());
    // The one exception: Help's Get the app line names Google Play only once
    // an Android device is paired, since the Android app is not in the store
    // before that; without one it keeps the App Store only line.
    for (const [id, words] of Object.entries(phone)) {
      expect(now[id], id).toStrictEqual(id === "getAppDone" ? (apple as Record<string, unknown>)[id] : words);
    }
  });

  it("says phone in the dock's Preview on", () => {
    setAndroidHere(false);
    const seg = flat(renderPreviewSeg({ kind: "watch", duo: false, phones: true, onPick: () => undefined, onBoth: () => undefined }));
    expect(seg).toContain("title=Preview on a phone");
    expect(seg).toContain(">Phone</button>");
    expect(seg).toContain(`title="Side by side: a watch and a phone"`);
    expect(seg).not.toContain("iPhone");
  });
});

describe("general copy once an Android device is paired", () => {
  it("says phone and watch, as the Android words have it", () => {
    setAndroidHere(true);
    const now = probes();
    for (const [id, words] of Object.entries(phone)) expect(now[id], id).toStrictEqual(words);
  });

  it("says phone in the dock's Preview on", () => {
    setAndroidHere(true);
    const seg = flat(renderPreviewSeg({ kind: "watch", duo: false, phones: true, onPick: () => undefined, onBoth: () => undefined }));
    expect(seg).toContain("title=Preview on a phone");
    expect(seg).toContain(">Phone</button>");
    expect(seg).not.toContain("iPhone");
  });

  it("differs from the old Apple words in every probe that names a phone", () => {
    // apple.json is the record of what each line said in an Apple only home
    // before 2026-11-14. The two fixtures share their ids; a probe the
    // switch never changed would be a probe of nothing.
    expect(Object.keys(apple).sort()).toEqual(Object.keys(phone).sort());
    const same = Object.keys(apple).filter((id) => JSON.stringify((apple as Record<string, unknown>)[id]) === JSON.stringify((phone as Record<string, unknown>)[id]));
    expect(same).toEqual([]);
  });

  it("never breaks a sentence with a dash", () => {
    for (const on of [false, true]) {
      setAndroidHere(on);
      for (const words of Object.values(probes())) expect(JSON.stringify(words)).not.toMatch(/[–—]| - /);
    }
  });
});

describe("the Google Play extras", () => {
  const helpSheet = () => flat(renderHelpSheet({
    gs: gettingStarted([], undefined), route: undefined, version: "3.2.0",
    onClosed: () => undefined, onPair: () => undefined, onNewPage: () => undefined,
  }));

  it("stay off the Help sheet until an Android device is paired here", () => {
    setAndroidHere(false);
    const apple = helpSheet();
    expect(apple).toContain("Open the App Store");
    expect(apple).not.toContain(PLAY_STORE_URL);
    expect(apple).not.toContain("Open Google Play");
    setAndroidHere(true);
    const android = helpSheet();
    expect(android).toContain("Open the App Store");
    expect(android).toContain(PLAY_STORE_URL);
    expect(android).toContain("Open Google Play");
  });

  it("stay off the welcome until an Android device is paired here: the line, the link and the QR code", () => {
    const panel = readFileSync(join(__dirname, "..", "src", "panel.ts"), "utf8");
    const welcome = panel.slice(panel.indexOf('step(1, "Install the app"'), panel.indexOf('step(2, "Pick one"'));
    // Each extra is behind androidHereNow(), never behind general copy,
    // which no longer waits for an Android device.
    expect(welcome).not.toMatch(/generalCopy\(\s*nothing/);
    for (const extra of ["<p>On Android, install it from Google Play", `<a class="home-btn hw-play" href=\${PLAY_STORE_URL}`, `<figure class="hw-qr">\n                \${playQr`]) {
      expect(welcome, extra).toContain(`\${androidHereNow() ? html\`${extra}`);
    }
    // And the Play QR code is made only then.
    expect(panel).toContain("if (this.playStoreQr === undefined && androidHereNow()) {");
  });
});

describe("whether an Android device is paired here", () => {
  const row = (over: Partial<OwnerSummary>): OwnerSummary => ({
    owner_watch_id: "w1", device_name: "W", paired_iphone_name: null, app_version: "3.2.0", screen_size: null,
    complication_count: 0, token: 1, is_orphan: false, ...over,
  });

  it("reads paired_platforms, which lists every paired device whoever asks", () => {
    expect(homeHasAndroid({ paired_platforms: ["ios", "watchos"] })).toBe(false);
    expect(homeHasAndroid({ paired_platforms: ["android", "watchos"] })).toBe(true);
    expect(homeHasAndroid({ paired_platforms: ["wearos"] })).toBe(true);
    expect(homeHasAndroid({ paired_platforms: [] })).toBe(false);
    // Someone else's Pixel counts even when this person's rows are Apple ones.
    expect(homeHasAndroid({ paired_platforms: ["android", "ios"], owners: [row({ device_kind: "iphone" })] })).toBe(true);
    // And the field wins over the rows when it says none.
    expect(homeHasAndroid({ paired_platforms: ["ios"], owners: [row({ device_kind: "watch", platform: "wearos" })] })).toBe(false);
  });

  it("reads the rows from an integration without the field", () => {
    expect(homeHasAndroid({ owners: [row({ device_kind: "watch" }), row({ device_kind: "iphone" })] })).toBe(false);
    expect(homeHasAndroid({ owners: [row({ device_kind: "watch", platform: "wearos" })] })).toBe(true);
    expect(homeHasAndroid({ owners: [row({ device_kind: "iphone", platform: "android" })] })).toBe(true);
    // A platform that does not fit the kind reads as the kind's Apple one.
    expect(homeHasAndroid({ owners: [row({ device_kind: "iphone", platform: "wearos" })] })).toBe(false);
    // The Library and an orphan are no device.
    expect(homeHasAndroid({ owners: [row({ device_kind: "library", platform: null }), row({ device_kind: null, is_orphan: true, platform: "android" })] })).toBe(false);
    expect(homeHasAndroid(undefined)).toBe(false);
    expect(homeHasAndroid({})).toBe(false);
  });

  it("is noted on every owners read, so a pairing turns the Android extras over, and the words stay", async () => {
    let platforms = ["ios", "watchos"];
    const hass = {
      connection: {
        async sendMessagePromise<T>(): Promise<T> {
          return { owners: [], capabilities: [], max_schema_version: 9, token: 1, paired_platforms: platforms } as T;
        },
      },
    } as never;
    await fetchOwners(hass);
    expect(androidHereNow()).toBe(false);
    // General copy says phone either way; only the Android extras turn over.
    expect(pairQrTitle()).toBe("Scan with the phone");
    platforms = ["android", "ios", "watchos"];
    await fetchOwners(hass);
    expect(androidHereNow()).toBe(true);
    expect(pairQrTitle()).toBe("Scan with the phone");
    // Forgetting the last Android device turns them back.
    platforms = ["ios"];
    await fetchOwners(hass);
    expect(androidHereNow()).toBe(false);
    expect(pairQrTitle()).toBe("Scan with the phone");
    noteHomeDevices(undefined);
    expect(androidHereNow()).toBe(false);
  });

  it("leaves a line about one device to that device's platform", () => {
    // General copy only: "Is this your iPhone?" is the found device's.
    setAndroidHere(true);
    expect(pairUserTitle("iphone")).toBe("Whose iPhone is this?");
    expect(pairUserTitle("iphone", "android")).toBe("Whose phone is this?");
    setAndroidHere(false);
    expect(pairUserTitle("iphone", "android")).toBe("Whose phone is this?");
  });
});

// The lines only a drawn view holds (the panel's Home, the welcome, the
// editors' hints), which no pure function returns. `drawn.json` lists each as
// [file, main's words, the Android words], every one read off main and off
// 2176d1b5 as they stood; main's words stay only as a record. A file's source
// is read as every home now draws it: each `generalCopy(a, b)` kept to its
// phone and watch side.
describe("general copy in the drawn views", () => {
  const STR = String.raw`(?:html)?(?:"(?:[^"\\]|\\.)*"|\`(?:[^\`\\]|\\.)*\`)`;
  const call = new RegExp(String.raw`generalCopy\(\s*(${STR})\s*,\s*(${STR})\s*,?\s*\)`, "gs");
  const inTemplate = new RegExp(String.raw`\$\{generalCopy\(\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,?\s*\)\}`, "gs");
  const view = (source: string): string =>
    source
      .replace(inTemplate, (_m, _a: string, b: string) => b)
      .replace(call, (_m, _a: string, b: string) => b);
  const read = (file: string) => readFileSync(join(__dirname, "..", "src", file), "utf8");

  it("draws the phone and watch words in every home", () => {
    for (const [file, , words] of drawn as [string, string, string][]) expect(view(read(file)), `${file}: ${words}`).toContain(words);
  });
});
