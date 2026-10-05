// Home's drawing and its doors, read from the panel's source, since no test
// mounts the panel. What Home lists and how it looks is tested in home.test.ts;
// the links' shared watch in panel-watch-source.test.ts.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const SOURCE = readFileSync(join(__dirname, "..", "src", "panel.ts"), "utf8");

/** The body of a method, from its signature to the next method at the same
 * indent. */
function method(signature: string): string {
  const at = SOURCE.indexOf(signature);
  if (at < 0) throw new Error(`no ${signature}`);
  const end = SOURCE.indexOf("\n  }\n", at);
  return SOURCE.slice(at, end);
}

/** The part of `text` from `from` up to the next `to` after it. */
function between(text: string, from: string, to: string): string {
  const at = text.indexOf(from);
  if (at < 0) throw new Error(`no ${from}`);
  const end = text.indexOf(to, at + from.length);
  if (end < 0) throw new Error(`no ${to} after ${from}`);
  return text.slice(at, end);
}

const home = method("  private renderHome() {");
const watchCard = method("  private renderHomeWatch() {");

describe("Home's Watch app card", () => {
  it("is for administrators only", () => {
    expect(home).toContain("const admin = this.hass.user?.is_admin === true;");
    expect(home).toContain("${admin ? this.renderHomeWatch() : nothing}");
  });

  it("draws nothing while the devices load, so the pairing card never flashes up", () => {
    const guard = "if (!this.linkReady && this.owners.length === 0) return nothing;";
    expect(watchCard).toContain(guard);
    expect(watchCard.indexOf(guard)).toBeLessThan(watchCard.indexOf("home-pair-watch"));
  });

  it("offers to pair a watch, through the Settings page, in a home with none", () => {
    expect(watchCard).toContain("const watches = settingsWatches(this.owners);");
    const none = between(watchCard, "${watches.length === 0\n        ? html`<div class=\"home-screens\">", ": html`");
    expect(none).toContain(`<a class="home-screen home-pair-watch" href=\${href(WATCH_SETTINGS_SCREEN.path)}`);
    expect(none).toContain("this.goTo(WATCH_SETTINGS_SCREEN.path);");
    expect(none).not.toContain("watchSettings");
  });

  it("has a door to each of the six screens once there is a watch", () => {
    expect(watchCard).toContain("WATCH_SCREENS.map((screen) => {");
    expect(watchCard).toContain("this.goTo(path);");
  });
});

describe("Home's Complications and widgets card", () => {
  it("offers New and Import to administrators only, and Browse all and the gallery to everyone", () => {
    expect(home).toContain("${admin ? html`<button class=\"home-btn home-new\"");
    expect(home).toContain("${admin ? html`<button class=\"home-btn home-import\"");
    expect(home).toMatch(/\n {14}<button class="home-btn home-browse"/);
    expect(home).toMatch(/\n {14}<a class="home-btn home-gallery" href=\$\{GALLERY_PAGE\}/);
  });

  it("goes to the Complications tab for Browse all, and opens the dialog only over an open design", () => {
    const browse = between(home, `class="home-btn home-browse"`, "}}>Browse all</button>");
    expect(browse).toContain("toComplications();");
    expect(browse).toContain("if (this.draft) this.browseAll();");
    expect(browse.indexOf("toComplications();")).toBeLessThan(browse.indexOf("this.browseAll()"));
  });

  it("goes to the Complications tab before New and Import open their dialogs", () => {
    expect(home).toContain("@click=${() => { toComplications(); this.openNewDialog(); }}");
    expect(home).toContain("@click=${() => { toComplications(); this.openImportDialog(); }}");
  });
});

describe("Home's Devices card", () => {
  it("puts each name in a box of its own, so a long one ends in an ellipsis", () => {
    expect(home).toContain(`<span class="home-device-label">\${d.name}</span>`);
  });

  it("says in small print what the states cover: the watch app too, for an administrator who can read it", () => {
    expect(home).toContain(`"Synced, Waiting and Nothing waiting cover complications and widgets, and on a watch also its pages, menus, settings and the rest of the watch app."`);
    expect(home).toContain(`: "Synced, Waiting and Nothing waiting cover complications and widgets."}</p>`);
    expect(home).not.toContain("only.</p>");
  });

  it("judges each watch on its watch app records too, for an administrator, and says what a waiting row waits for", () => {
    expect(home).toContain("homeDeviceRows(this.homeDevices(), admin ? this.watchAppSyncs : new Map())");
    expect(home).toContain(`<span class="home-device-why"> · \${waitingForText(d.waitingFor)}</span>`);
  });

  it("reads the watch app records on the way into Home, and when the watches change", () => {
    const will = method("  protected override willUpdate(changed");
    const back = between(will, `if (changed.has("route") && tabOfRoute(this.route) === "home"`, "}");
    expect(back).toContain("void this.loadWatchAppSync(true);");
    expect(will).toContain(`if (changed.has("owners") && tabOfRoute(this.route) === "home") void this.loadWatchAppSync(false);`);
    const load = method("  private async loadWatchAppSync(again: boolean) {");
    expect(load).toContain("if (this.hass?.user?.is_admin !== true) return;");
    expect(load).toContain("readWatchAppSync((kind) => fetchWatchConfig(hass, id, kind))");
    expect(load).toContain("if (run !== this.watchAppSyncRun) return;");
    expect(load).toContain("if (!again && key === this.watchAppSyncFor) return;");
  });
});

describe("Home's recent designs", () => {
  it("open on the Complications tab, moving there before the design opens", () => {
    const recent = between(home, `<section class="start-sec home-recent">`, "</section>");
    expect(recent).toContain("toComplications();");
    expect(recent).toContain("void this.openFromPicker(hit.row, hit.copy);");
    expect(recent.indexOf("toComplications();")).toBeLessThan(recent.indexOf("this.openFromPicker("));
    expect(home).toContain("const toComplications = () => this.goTo(COMPLICATIONS_PATH);");
  });
});

describe("coming back to Home", () => {
  it("reads the other devices' lists again, so its count is current", () => {
    const will = method("  protected override willUpdate(changed");
    const back = between(will, `if (changed.has("route") && tabOfRoute(this.route) === "home"`, "}");
    expect(back).toContain(`tabOfRoute(changed.get("route") as PanelRoute | undefined) !== "home"`);
    expect(back).toContain("void this.loadOtherLists();");
  });
});
