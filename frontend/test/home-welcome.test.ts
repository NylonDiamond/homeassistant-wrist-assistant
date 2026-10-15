// Home's welcome, in a home with no devices yet: install the app, pick the
// device on the stage, pair it. The drawings and words are tested here, the
// wiring from the panel's source, since no test mounts the panel. The pairing
// QR code's web address is here too: the welcome is where an iPhone is
// paired first.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { homeChoiceArt } from "../src/home-art.js";
import { homeStyles } from "../src/home.js";
import { PAIR_WEB_LINK, pairQrLink } from "../src/pair-flow.js";
import { PAIR_QR_STEPS } from "../src/watch-settings.js";

const SOURCE = readFileSync(join(__dirname, "..", "src", "panel.ts"), "utf8");
const PAIR_VIEW = readFileSync(join(__dirname, "..", "src", "watch-pair-view.ts"), "utf8");

function method(source: string, signature: string): string {
  const at = source.indexOf(signature);
  if (at < 0) throw new Error(`no ${signature}`);
  return source.slice(at, source.indexOf("\n  }\n", at));
}

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

describe("the pairing QR code's web address", () => {
  const app = "wristassistant://pair#v=1&i=abc&t=TOKEN&u=http%3A%2F%2F192.168.1.4%3A8123";

  it("is the app's link with its # part moved onto wrist-assistant.com/pair", () => {
    expect(PAIR_WEB_LINK).toBe("https://wrist-assistant.com/pair");
    expect(pairQrLink(app)).toBe("https://wrist-assistant.com/pair#v=1&i=abc&t=TOKEN&u=http%3A%2F%2F192.168.1.4%3A8123");
  });

  it("is nothing for any other link", () => {
    expect(pairQrLink("wristassistant://pair")).toBeUndefined();
    expect(pairQrLink("wristassistant://page/abc#x")).toBeUndefined();
    expect(pairQrLink("https://example.com/pair#v=1")).toBeUndefined();
  });

  it("goes into the QR code, while Open in app keeps the app's own link", () => {
    const show = method(PAIR_VIEW, "  private async showOffer()");
    expect(show).toContain("await qrPicture(pairQrLink(url) ?? url)");
    expect(show).toContain("open: { id: reply.offer_id, url, picture");
  });

  it("tells the person to use the Camera, and what happens without the app", () => {
    expect(PAIR_QR_STEPS[0]).toBe("Point the iPhone's Camera at this code.");
    expect(PAIR_QR_STEPS.join(" ")).toContain("App Store");
    for (const line of PAIR_QR_STEPS) expect(line).not.toMatch(/[–—]| - /);
  });
});

describe("the devices to pick", () => {
  it("draws the picked watch lit, with a sample code on its screen", () => {
    const on = flat(homeChoiceArt("watch", true));
    expect(on).toContain("hw-ghost-lit");
    expect(on).toContain("K7Q 4M2");
    const off = flat(homeChoiceArt("watch", false));
    expect(off).not.toContain("hw-ghost-lit");
    expect(off).not.toContain("K7Q 4M2");
  });

  it("draws the picked iPhone lit, with a camera frame and Scan to pair", () => {
    const on = flat(homeChoiceArt("iphone", true));
    expect(on).toContain("hw-ghost-lit");
    expect(on).toContain("Scan to pair");
    expect(flat(homeChoiceArt("iphone", false))).not.toContain("Scan to pair");
  });

  it("is drawn in the panel's tokens, through classes, never fixed colors", () => {
    for (const art of [homeChoiceArt("watch", true), homeChoiceArt("iphone", true)]) {
      expect(flat(art)).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    }
  });
});

describe("the welcome's look", () => {
  const text = homeStyles.cssText;
  const rule = (sel: string) => text.slice(text.indexOf(sel), text.indexOf("}", text.indexOf(sel)));

  it("turns one thin green arc slowly round the picked device, and not at all for reduced motion", () => {
    expect(text).toContain(".hw-ring-arc { animation: hw-in .45s ease-out both, hw-spin 6s linear infinite; }");
    expect(rule(".hw-ring-arc circle {")).toContain("stroke-width: 1.5");
    expect(text).toMatch(/prefers-reduced-motion: reduce\)\s*\{\s*\.hw-ring-arc\s*\{\s*animation: none;/);
  });

  it("uses Home's own lit stage for Pick one, grown to fit the two devices", () => {
    expect(rule(".hb-stage.hw-stage {")).toContain("height: auto");
  });

  it("wraps every word on the steps", () => {
    for (const sel of [".hw-step-head h2 {", ".hw-step-head span {", ".hw-install-t p {"]) {
      expect(rule(sel), sel).toContain("overflow-wrap: anywhere");
    }
  });
});

describe("the welcome's wiring", () => {
  const welcome = method(SOURCE, "  private renderHomeWelcome(");
  const sync = method(SOURCE, "  private syncHomeWelcome() {");

  it("shows in a home with no devices, once the devices are read", () => {
    const shows = method(SOURCE, "  private homeWelcomeShows(): boolean {");
    expect(shows).toContain(`if (tabOfRoute(this.route) !== "home") return false;`);
    expect(shows).toContain("if (!this.linkReady && this.owners.length === 0) return false;");
    expect(shows).toContain("return devices.length === 0 && !this.loadFailedEmpty;");
  });

  it("has three steps, top to bottom: install, pick one, pair", () => {
    const order = ['step(1, "Install the app"', 'step(2, "Pick one"', "step(3, picked === \"iphone\" ? \"Pair your iPhone\" : \"Pair your watch\""];
    const at = order.map((s) => welcome.indexOf(s));
    expect(at.every((i) => i > 0)).toBe(true);
    expect([...at].sort((a, b) => a - b)).toEqual(at);
    expect(welcome).not.toContain("first page");
    expect(welcome).not.toContain("first widget");
  });

  it("links the App Store and shows it as a QR code", () => {
    expect(welcome).toContain("href=${APP_STORE_URL} target=\"_blank\"");
    expect(welcome).toContain(`aria-label="QR code for the App Store page"`);
    expect(sync).toContain("void qrPicture(APP_STORE_URL)");
  });

  it("picks a device on the stage, and the pairing card under it follows", () => {
    expect(welcome).toContain("const picked: PairChoice = card.picked ?? \"watch\";");
    expect(welcome).toContain("@click=${() => { if (!on) card.pick(kind); }}");
    expect(welcome).toContain("${card.render({ bare: true })}");
    expect(welcome).toContain(`aria-pressed=\${on ? "true" : "false"}`);
  });

  it("opens its card on the watch without taking the cursor, and closes it when the welcome goes", () => {
    expect(sync).toContain(`this.welcomePair.open(this.hass, { mode: "code" });`);
    expect(sync).toContain(`this.welcomePair.pick("watch", { focus: false });`);
    expect(sync).toContain("this.closeHomeWelcome();");
    expect(method(SOURCE, "  private closeHomeWelcome() {")).toContain("this.welcomePair.close();");
    expect(method(SOURCE, "  override disconnectedCallback() {")).toContain("this.closeHomeWelcome();");
  });

  it("picks the new device on Home with its green Paired line", () => {
    const card = SOURCE.slice(SOURCE.indexOf("private welcomePair = new PairWatchCard("), SOURCE.indexOf("private welcomePairOpen = false;"));
    expect(card).toContain("this.openHomeDevice(deviceId);");
    expect(card).toContain("this.devicePaired = deviceId;");
  });

  it("never uses a dash to break a sentence", () => {
    const words = [...welcome.matchAll(/>([^<>${}]+)</g)].map((m) => m[1]!.trim()).filter(Boolean);
    for (const w of words) expect(w, w).not.toMatch(/[–—]| - /);
  });
});

describe("the pairing card's pick", () => {
  it("is the choice's own answer, kept while a pairing is under way", () => {
    const pick = method(PAIR_VIEW, "  pick(device: PairChoice");
    expect(pick).toContain("if (this.busy) return false;");
    expect(pick).toContain("this.choose(device);");
    expect(pick).toContain("if (options.focus === false) this.focusCode = false;");
  });
});
