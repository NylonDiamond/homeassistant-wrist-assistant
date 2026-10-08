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

  it("offers to pair a watch, in Home's own dialog, in a home with none", () => {
    expect(watchCard).toContain("const watches = settingsWatches(this.owners);");
    const none = between(watchCard, "${watches.length === 0\n        ? html`<div class=\"home-screens\">", ": html`");
    expect(none).toContain(`<button class="home-screen home-pair-watch" @click=\${() => this.openPairDialog()}>`);
    expect(none).not.toContain("goTo(");
    expect(none).not.toContain("watchSettings");
  });

  it("has a door to each of the eight screens once there is a watch, HTTP actions and Cameras with no watch in them", () => {
    expect(watchCard).toContain("WATCH_SCREENS.map((screen) => {");
    expect(watchCard).toContain("const path = watchScreenPath(screen, watch);");
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
    expect(load).toContain("summaryWatchAppSyncs(await fetchWatchConfigSummary(hass), watches)");
    expect(load).toContain("if (!summaryUnknown(err)) {");
    expect(load.indexOf("fetchWatchConfigSummary")).toBeLessThan(load.indexOf("readWatchAppSync((kind) => fetchWatchConfig(hass, id, kind))"));
    expect(load).toContain("if (run !== this.watchAppSyncRun) return;");
    expect(load).toContain("if (!again && key === this.watchAppSyncFor) return;");
  });
});

describe("Home's device sheet", () => {
  const sheet = method("  private renderDeviceSheet(");
  const forget = method("  private async forgetDeviceNow(ownerId: string) {");

  it("opens from a whole device row, for everyone", () => {
    expect(home).toContain(`<button type="button" class="home-device-open" title=\${\`Open \${d.name}\`} @click=\${() => this.openDeviceSheet(d.id)}>`);
    expect(home).toContain("${this.deviceSheet !== undefined ? this.renderDeviceSheet(this.deviceSheet, devices, admin) : nothing}");
  });

  it("shows no design cards, only a count on each tab", () => {
    expect(sheet).not.toContain("renderStartCard(");
    expect(sheet).toContain("badge(t.filter === \"control\" ? controls.length : designs.length)");
    expect(sheet).toContain("badge(t.count === undefined ? undefined : counts[t.count])");
  });

  it("reads a watch's counts when its sheet opens, dropping a late reply", () => {
    expect(method("  private openDeviceSheet(ownerId: string, forget = false) {")).toContain("void this.loadDeviceCounts(ownerId);");
    const load = method("  private async loadDeviceCounts(ownerId: string) {");
    expect(load).toContain("watchConfigCount(kind, record.document)");
    expect(load).toContain("if (this.deviceSheet !== ownerId) return;");
  });

  it("gives each row a quiet Remove, for administrators only, that opens the sheet on its Forget step", () => {
    const row = between(home, `<li class="home-device \${d.sync}">`, "</li>");
    expect(row).toContain("${admin ? html`<button type=\"button\" class=\"home-device-remove\"");
    expect(row).toContain("@click=${() => this.openDeviceSheet(d.id, true)}>Remove</button>` : nothing}");
    // Never the browser's own confirm: the sheet asks.
    expect(row).not.toContain("confirm(");
    const open = method("  private openDeviceSheet(ownerId: string, forget = false) {");
    expect(open).toContain("this.deviceForgetAsk = forget;");
  });

  it("offers Forget to administrators only, behind a second step", () => {
    expect(sheet).toContain("${admin ? html`<button class=\"danger dev-forget\" @click=${() => { this.deviceForgetAsk = true; }}>${uiIcon(\"delete\")}<span>Remove device</span></button>` : nothing}");
    expect(sheet).toContain("@click=${() => void this.forgetDeviceNow(ownerId)}");
    expect(sheet).toContain("${this.deviceForgetAsk ? ask : overview}");
    expect(sheet.match(/<dialog /g)).toHaveLength(1);
  });

  it("has a tab for each of the device's pages, each opening it on this device", () => {
    expect(sheet).toContain("${deviceSheetTabs(row.kind, admin).map(tab)}");
    expect(sheet).toContain("const path = watchScreenPath(t.screen, ownerId);");
    expect(sheet).toContain("this.pickWatch(ownerId);");
    expect(sheet).toContain("this.pickerFilter = filter;");
  });

  it("has no New complication button", () => {
    expect(sheet).not.toContain("openNewDialog");
  });

  it("renames the device in Home Assistant's own registry, from a button on the head, for administrators", () => {
    expect(sheet).toContain("admin && !this.deviceForgetAsk && !renaming");
    expect(sheet).toContain("@click=${() => this.startDeviceRename(ownerId)}>Rename</button>");
    expect(sheet).toContain("void this.renameDeviceNow(ownerId);");
    const save = method("  private async renameDeviceNow(ownerId: string) {");
    expect(save).toContain("await renameDevice(this.hass, ownerId, name === \"\" ? null : name);");
    expect(save).toContain("await this.loadOwners();");
  });

  it("lets Escape leave the name field without shutting the sheet", () => {
    expect(sheet).toContain(`if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); stopRename(); }`);
  });

  it("reads the devices and lists again after a Forget, and picks another device when it was the open one", () => {
    expect(forget).toContain("await forgetDevice(this.hass, ownerId);");
    expect(forget).toContain("if (this.ownerId === ownerId && this.draft?.dirty && !this.confirmDiscard()) return;");
    expect(forget).toContain("this.ownerId = undefined;");
    expect(forget).toContain("await this.loadOtherLists();");
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

describe("Home's Pair a device dialog", () => {
  it("opens from the Devices card's title row, for administrators only", () => {
    const head = between(home, `<h2 class="home-title">Devices</h2>`, "</div>");
    expect(head).toContain("${admin ? html`<button class=\"home-btn home-pair-open\"");
    expect(head).toContain("@click=${() => this.openPairDialog()}>${uiIcon(\"plus\")}<span>Pair a device</span></button>");
    expect(home).toContain("${admin && this.pairOpen ? this.renderPairDialog() : nothing}");
  });

  it("closes, withdrawing an open QR code, when the panel leaves the page", () => {
    expect(method("  override disconnectedCallback() {")).toContain("this.closePairDialog();");
    expect(method("  private renderPairDialog() {")).toContain(`aria-label="Pair a device"`);
  });

  it("draws the Settings page's own pairing card, starting afresh on each opening", () => {
    expect(SOURCE).toContain(`import { PairWatchCard } from "./watch-pair-view.js";`);
    expect(method("  private openPairDialog() {")).toContain("this.homePair.open(this.hass);");
    expect(method("  private closePairDialog() {")).toContain("this.homePair.close();");
    const dialog = method("  private renderPairDialog() {");
    expect(dialog).toContain(`<dialog class="pair-dialog"`);
    expect(dialog).toContain("@close=${() => this.closePairDialog()}");
    expect(dialog).toContain("this.homePair.render({");
  });

  it("adds a device paired there to the device list, and makes a watch the shared watch", () => {
    const at = SOURCE.indexOf("private homePair = new PairWatchCard(");
    const made = SOURCE.slice(at, SOURCE.indexOf("});", at));
    expect(made).toContain("await this.loadOwners();");
    expect(made).toContain(`if (kind === "watch") this.pickWatch(watchId);`);
  });

  it("swaps the dialog for the new device's sheet, saying Paired in green", () => {
    const at = SOURCE.indexOf("private homePair = new PairWatchCard(");
    const made = SOURCE.slice(at, SOURCE.indexOf("});", at));
    expect(made).toContain("if (stale() || !this.pairOpen || this.ownerOf(watchId) === undefined) return;");
    const order = ["this.closePairDialog();", "this.openDeviceSheet(watchId);", "this.devicePaired = watchId;"]
      .map((line) => made.indexOf(line));
    expect(order.every((i) => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    // Any other opening, and every closing, drops the line.
    expect(method("  private openDeviceSheet(ownerId: string, forget = false) {")).toContain("this.devicePaired = undefined;");
    expect(method("  private closeDeviceSheet() {")).toContain("this.devicePaired = undefined;");
    expect(method("  private renderDeviceSheet(ownerId: string, devices: readonly HomeDeviceRow[], admin: boolean) {"))
      .toContain(`\${this.devicePaired === ownerId ? html\`<div class="dev-paired" role="status">`);
  });
});
