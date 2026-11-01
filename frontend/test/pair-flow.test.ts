// The Pair a device dialog's steps (`pair-flow.ts`): which step it opens on,
// what each answer opens, the words of each step, and what next once a
// watch is paired.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  OLD_APP_PAIR_NOTE,
  PAIR_CHOICES,
  PAIR_CHOICE_TITLE,
  PAIR_NEXT_OPEN,
  PAIR_NEXT_PAGE,
  PAIR_QR_TITLE,
  PAIR_SETUP_GUIDE_URL,
  PAIR_TO_CODE_TEXT,
  PAIR_TO_QR_IPHONE_TEXT,
  PAIR_TO_QR_TEXT,
  pairChoiceMode,
  pairChoiceNote,
  pairCodeSteps,
  pairCodeTitle,
  pairFoundLines,
  pairFoundTitle,
  pairGoLabel,
  pairNextStatus,
  pairOpening,
  pairSubtitle,
  pairedFactsLine,
  pairedHeadline,
} from "../src/pair-flow.js";
import { PAIR_CODE_STEPS } from "../src/watch-settings.js";

describe("where the Pair a device card opens", () => {
  it("opens Home's dialog on the choice, with nothing made yet", () => {
    expect(pairOpening({ mode: "choose" })).toEqual({ choosing: true, asks: true, mode: "code", autoQr: false });
  });

  it("opens the Settings page's card straight on Type a code, with no choice to go back to", () => {
    expect(pairOpening()).toEqual({ choosing: false, asks: false, mode: "code", autoQr: false });
    expect(pairOpening({ mode: "code", showQr: true })).toEqual({ choosing: false, asks: false, mode: "code", autoQr: false });
  });

  it("still opens on a QR code already showing when asked for one", () => {
    expect(pairOpening({ mode: "qr", showQr: true })).toEqual({ choosing: false, asks: false, mode: "qr", autoQr: true });
    expect(pairOpening({ mode: "qr" })).toEqual({ choosing: false, asks: false, mode: "qr", autoQr: false });
  });

  it("opens Type a code for a watch and the QR code for an iPhone", () => {
    expect(pairChoiceMode("watch")).toBe("code");
    expect(pairChoiceMode("iphone")).toBe("qr");
    expect(PAIR_CHOICES.map((c) => c.choice)).toEqual(["watch", "iphone"]);
  });
});

describe("the words of each step", () => {
  it("says which step the dialog is on under its title", () => {
    expect(pairSubtitle(true, "code", undefined)).toBe("A watch or an iPhone, to this Home Assistant");
    expect(pairSubtitle(false, "code", "watch")).toBe("Apple Watch, by its code");
    expect(pairSubtitle(false, "code", "iphone")).toBe("iPhone, by its code");
    expect(pairSubtitle(false, "qr", "iphone")).toBe("iPhone, by a QR code");
    expect(pairSubtitle(false, "code", undefined)).toBe("A watch or an iPhone, by its code");
  });

  it("gives a watch its own steps, an iPhone its own, and both the shared ones when nobody said", () => {
    expect(pairCodeTitle("watch")).toBe("Type the watch's code");
    expect(pairCodeSteps("watch")[0]).toBe("On the watch, open Wrist Assistant and choose Pair with Home Assistant.");
    expect(pairCodeSteps("iphone")[1]).toBe("Choose Show a code instead, and pick this Home Assistant.");
    expect(pairCodeSteps(undefined)).toBe(PAIR_CODE_STEPS);
    expect(pairCodeTitle(undefined)).toBe("Type the code");
  });

  it("names a found device by its kind when it reports no name, and its app when it reports one", () => {
    expect(pairFoundTitle("watch")).toBe("Is this your watch?");
    expect(pairFoundTitle("iphone")).toBe("Is this your iPhone?");
    expect(pairGoLabel("watch")).toBe("Pair this watch");
    expect(pairFoundLines({ device_name: "Jesse's Watch", app_version: "3.1.0", app_build: "2" })).toEqual({ name: "Jesse's Watch", app: "App 3.1.0 (2)" });
    expect(pairFoundLines({ kind: "iphone", device_name: " " })).toEqual({ name: "iPhone" });
    expect(pairFoundLines({ app_version: "3.1.0" })).toEqual({ name: "Apple Watch", app: "App 3.1.0" });
  });

  it("tells an administrator they can choose someone else, and anyone else who can", () => {
    expect(pairChoiceNote(true)).toContain("unless you choose someone else");
    expect(pairChoiceNote(false)).toContain("An administrator can pair one for someone else.");
  });
});

describe("what next, once a watch is paired", () => {
  it("names the watch, then what Home knows of it and whose it is", () => {
    expect(pairedHeadline("Jesse's Watch")).toBe("Jesse's Watch is paired.");
    expect(pairedHeadline(" ")).toBe("Apple Watch is paired.");
    expect(pairedFactsLine(["Apple Watch", "App 3.1.0 (2)"], "Jesse")).toBe("Apple Watch · App 3.1.0 (2) · Belongs to Jesse");
    expect(pairedFactsLine(["Apple Watch"], undefined)).toBe("Apple Watch");
  });

  it("shows Home's own sync word, and nothing for a watch with nothing to pick up", () => {
    expect(pairNextStatus(undefined)).toBeUndefined();
    expect(pairNextStatus({ sync: "idle" })).toBeUndefined();
    expect(pairNextStatus({ sync: "waiting" })).toEqual({ state: "waiting", label: "Waiting" });
    expect(pairNextStatus({ sync: "synced" })).toEqual({ state: "synced", label: "Synced" });
    expect(pairNextStatus({ sync: "synced", rejected: ["pages"] })).toEqual({ state: "rejected", label: "Not synced" });
  });

  it("links to the setup guide on the docs site", () => {
    expect(PAIR_SETUP_GUIDE_URL).toBe("https://docs.wrist-assistant.com/getting-started/setup/");
  });
});

describe("pairing from the 3.0 app", () => {
  // 3.0 has neither the watch's code nor the iPhone's QR code; its iPhone
  // app signs in instead (/v2/register_secret, still served).
  it("is named under both choices: the welcome's and the dialog's", () => {
    expect(OLD_APP_PAIR_NOTE).toBe("On Wrist Assistant 3.0, sign in to Home Assistant from the iPhone app instead.");
    const panel = readFileSync(join(__dirname, "..", "src", "panel.ts"), "utf8");
    const welcome = panel.slice(panel.indexOf("  private renderHomeWelcome("));
    expect(welcome.slice(0, welcome.indexOf("\n  }\n"))).toContain("<span>${OLD_APP_PAIR_NOTE}</span>");
    const card = readFileSync(join(__dirname, "..", "src", "watch-pair-view.ts"), "utf8");
    const choice = card.slice(card.indexOf("  private renderChoice() {"));
    expect(choice.slice(0, choice.indexOf("\n  }\n"))).toContain("${OLD_APP_PAIR_NOTE}");
  });

  it("is in the config flow's words too", () => {
    for (const file of ["strings.json", join("translations", "en.json")]) {
      const json = JSON.parse(readFileSync(join(__dirname, "..", "..", "custom_components", "wrist_assistant", file), "utf8")) as { config: { step: { user: { description: string } } } };
      expect(json.config.step.user.description).toContain("On Wrist Assistant 3.0, which has no pairing, sign in to Home Assistant from the iPhone app instead.");
    }
  });
});

describe("plain words", () => {
  it("never breaks a sentence with a dash", () => {
    const words = [
      PAIR_CHOICE_TITLE, PAIR_QR_TITLE, PAIR_TO_CODE_TEXT, PAIR_TO_QR_TEXT, PAIR_TO_QR_IPHONE_TEXT,
      ...PAIR_CHOICES.flatMap((c) => [c.label, c.line]),
      ...pairCodeSteps("watch"), ...pairCodeSteps("iphone"),
      pairChoiceNote(true), pairChoiceNote(false),
      PAIR_NEXT_PAGE.title, PAIR_NEXT_PAGE.line, PAIR_NEXT_PAGE.action, PAIR_NEXT_OPEN.title, PAIR_NEXT_OPEN.line,
    ];
    for (const w of words) expect(w).not.toMatch(/ \x2d |\u2013|\u2014/);
  });
});
