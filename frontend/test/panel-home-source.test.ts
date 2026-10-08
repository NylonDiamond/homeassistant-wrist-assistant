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
const card = method("  private renderHomeDevice(");
const tile = method("  private renderHomeTile(");
const group = method("  private renderHomeGroup(");

describe("Home's page", () => {
  it("is the devices alone: no Watch app card, no complications card, no recent designs", () => {
    expect(SOURCE).not.toContain("renderHomeWatch");
    expect(home).not.toContain("home-recent");
    expect(home).not.toContain("renderStartCard(");
    expect(home).not.toContain("home-screens");
    expect(SOURCE).not.toContain("private startRecent(");
  });

  it("says Loading… while the devices load, so the pairing card never flashes up", () => {
    expect(home).toContain("const loading = !this.linkReady && this.owners.length === 0;");
    expect(home.indexOf("${loading")).toBeLessThan(home.indexOf("}${add}"));
  });
});

describe("Home's device cards", () => {
  it("puts each name in a box of its own, so a long one ends in an ellipsis", () => {
    expect(card).toContain(`<span class="home-device-label">\${d.name}</span>`);
  });

  it("draws the device on its stage, a slot lit per thing it holds", () => {
    expect(card).toContain(`d.kind === "watch" ? homeWatchArt(d.id, held, d.sync) : homePhoneArt(d.id, held, d.sync)`);
    expect(card).toContain("const held = owner?.complication_count ?? 0;");
  });

  it("says in small print what the states cover: the watch app too", () => {
    expect(home).toContain(`<p class="home-small">Synced, Waiting and Nothing waiting cover complications and widgets, and on a watch also its pages, menus, settings and the rest of the watch app.</p>`);
    expect(home).not.toContain("only.</p>");
  });

  it("judges each watch on its watch app records too, for everyone, and says what a waiting card waits for", () => {
    expect(home).toContain("homeDeviceRows(this.homeDevices(), this.watchAppSyncs)");
    expect(home).not.toContain("admin");
    expect(card).toContain("`For ${waitingForText(d.waitingFor)}`");
    expect(card).toContain(`<span class="home-device-why">\${why}</span>`);
  });

  it("has a count tile per page, each opening that page on this device", () => {
    expect(card).toContain("deviceCardTiles(d.kind).map((t) => this.renderHomeTile(t, d, owner))");
    expect(tile).toContain("this.pickPickerTab(d.id);");
    expect(tile).toContain("this.pickerFilter = t.filter;");
    expect(tile).toContain("if (this.draft) this.openPicker();");
    expect(tile).toContain("const path = watchScreenPath(t.screen, d.id);");
    expect(tile.indexOf("this.pickWatch(d.id);")).toBeLessThan(tile.indexOf("this.goTo(path);"));
    const count = method("  private homeTileCount(");
    expect(count).toContain("this.watchCounts.get(d.id)?.[t.count]");
  });

  it("says when it was last heard from and what it will pick up, and leaves Settings to the sheet", () => {
    expect(card).toContain("const seen = seenWords(owner, elapsed);");
    expect(card).toContain("const pending = pendingWords(owner);");
    expect(card).not.toContain("WATCH_SETTINGS_SCREEN");
  });
});

describe("Home's status row", () => {
  const status = method("  private renderHomeStatus(");

  it("sits above the people, only once there are devices", () => {
    expect(home).toContain("${devices.length === 0 ? nothing : this.renderHomeStatus(devices, groups, elapsed)}${groups.map(");
  });

  it("counts the devices and names the one heard from last", () => {
    expect(status).toContain("const totals = homeTotals(devices);");
    expect(status).toContain("const last = lastSeenDevice(devices, (id) => this.ownerOf(id), elapsed);");
  });

  it("lists every waiting device under Waiting to sync, lit amber, each opening its sheet", () => {
    expect(status).toContain(`<h2 class="home-title">Waiting to sync</h2>`);
    expect(status).toContain(`const waiting = devices.filter((d) => d.sync === "waiting");`);
    expect(status).toContain(`<section class="home-attn \${waiting.length > 0 ? "on" : ""}">`);
    expect(status).toContain("@click=${() => this.openDeviceSheet(d.id)}>Open</button>");
    expect(status).toContain("Every device has your latest changes.");
  });

  it("puts New complication and Pair a device in the head, for everyone", () => {
    expect(home).toContain("const acts = html`<div class=\"home-head-acts\">");
    expect(home).toContain("this.goTo(COMPLICATIONS_PATH); this.openNewDialog();");
    expect(home).toContain("?disabled=${full || this.ownerBusy}");
  });

  it("groups the cards by person, in that person's color, with their picture where Home Assistant has one", () => {
    expect(home).toContain("const groups = homeGroups(this.people(), devices);");
    expect(group).toContain(`const color = personColorVar(g.index) ?? "var(--wa-hue-grey)";`);
    expect(group).toContain("<img src=${g.person.picture}");
    expect(method("  private people(): Person[] {")).toContain("peopleOf(this.owners, this.haPersonsFor.persons)");
    expect(SOURCE).not.toContain("peopleOf(this.owners)");
  });

  it("reads the counts from the same summary as the watch app's state", () => {
    const load = method("  private async loadWatchAppSync(again: boolean) {");
    expect(load).toContain("counts = summaryCounts(summary, watches);");
    expect(load).toContain("this.watchCounts = counts;");
  });

  it("reads the watch app records on the way into Home, and when the watches change", () => {
    const will = method("  protected override willUpdate(changed");
    const back = between(will, `if (changed.has("route") && tabOfRoute(this.route) === "home"`, "}");
    expect(back).toContain("void this.loadWatchAppSync(true);");
    expect(will).toContain(`if (changed.has("owners") && tabOfRoute(this.route) === "home") void this.loadWatchAppSync(false);`);
    const load = method("  private async loadWatchAppSync(again: boolean) {");
    expect(load).not.toContain("is_admin");
    expect(load).toContain("const summary = await fetchWatchConfigSummary(hass);");
    expect(load).toContain("next = summaryWatchAppSyncs(summary, watches);");
    expect(load).toContain("if (!summaryUnknown(err)) {");
    expect(load.indexOf("fetchWatchConfigSummary")).toBeLessThan(load.indexOf("readWatchAppSync((kind) => fetchWatchConfig(hass, id, kind))"));
    expect(load).toContain("if (run !== this.watchAppSyncRun) return;");
    expect(load).toContain("if (!again && key === this.watchAppSyncFor) return;");
  });
});

describe("Home's device sheet", () => {
  const sheet = method("  private renderDeviceSheet(");
  const forget = method("  private async forgetDeviceNow(ownerId: string) {");

  it("opens from a whole device card, for everyone", () => {
    expect(card).toContain(`<button type="button" class="home-device-open" title=\${\`Open \${d.name}\`} @click=\${() => this.openDeviceSheet(d.id)}>`);
    expect(home).toContain("${this.deviceSheet !== undefined ? this.renderDeviceSheet(this.deviceSheet, devices) : nothing}");
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

  it("still opens on its Forget step when asked, never with the browser's own confirm", () => {
    const open = method("  private openDeviceSheet(ownerId: string, forget = false) {");
    expect(open).toContain("this.deviceForgetAsk = forget;");
    expect(home).not.toContain("confirm(");
  });

  it("offers Forget to everyone, behind a second step", () => {
    expect(sheet).toContain("<button class=\"danger dev-forget\" @click=${() => { this.deviceForgetAsk = true; }}>${uiIcon(\"delete\")}<span>Remove device</span></button>");
    expect(sheet).not.toContain("admin ? html`<button class=\"danger dev-forget\"");
    expect(sheet).toContain("@click=${() => void this.forgetDeviceNow(ownerId)}");
    expect(sheet).toContain("${this.deviceForgetAsk ? ask : overview}");
    expect(sheet.match(/<dialog /g)).toHaveLength(1);
  });

  it("has a tab for each of the device's pages, each opening it on this device", () => {
    expect(sheet).toContain("${deviceSheetTabs(row.kind).map(tab)}");
    expect(sheet).toContain("const path = watchScreenPath(t.screen, ownerId);");
    expect(sheet).toContain("this.pickWatch(ownerId);");
    expect(sheet).toContain("this.pickerFilter = filter;");
  });

  it("has no New complication button", () => {
    expect(sheet).not.toContain("openNewDialog");
  });

  it("renames the device through the integration, from a button on the head, for everyone", () => {
    expect(sheet).not.toContain("mayRename");
    expect(sheet).not.toContain("is_admin");
    expect(sheet).toContain("${!this.deviceForgetAsk && !renaming");
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

describe("coming back to Home", () => {
  it("reads the other devices' lists again, so its count is current", () => {
    const will = method("  protected override willUpdate(changed");
    const back = between(will, `if (changed.has("route") && tabOfRoute(this.route) === "home"`, "}");
    expect(back).toContain(`tabOfRoute(changed.get("route") as PanelRoute | undefined) !== "home"`);
    expect(back).toContain("void this.loadOtherLists();");
  });
});

describe("Home's Pair a device dialog", () => {
  it("opens from the head's button, or from the only card in a home with no devices, for everyone", () => {
    expect(home).toContain("const add = devices.length === 0 ? html`<ul class=\"home-devices\"><li><button type=\"button\" class=\"home-device-add\"");
    expect(home).toContain("@click=${() => this.openPairDialog()}>${uiIcon(\"plus\")}<b>Pair a device</b>");
    expect(home).toContain("@click=${() => this.openPairDialog()}>${uiIcon(\"plus\")}<span>Pair a device</span>");
    expect(home).toContain("${groups.map((g) => this.renderHomeGroup(g, elapsed))}${add}");
    expect(home).toContain("${this.pairOpen ? this.renderPairDialog() : nothing}");
  });

  it("closes, withdrawing an open QR code, when the panel leaves the page", () => {
    expect(method("  override disconnectedCallback() {")).toContain("this.closePairDialog();");
    expect(method("  private renderPairDialog() {")).toContain(`aria-label="Pair a device"`);
  });

  it("draws the Settings page's own pairing card, starting afresh on each opening", () => {
    expect(SOURCE).toContain(`import { PairWatchCard } from "./watch-pair-view.js";`);
    expect(method("  private openPairDialog() {")).toContain(`this.homePair.open(this.hass, { mode: "qr", showQr: true });`);
    expect(method("  private closePairDialog() {")).toContain("this.homePair.close();");
    const dialog = method("  private renderPairDialog() {");
    expect(dialog).toContain(`<dialog class="xf pair-dialog"`);
    expect(dialog).toContain("const close = () => this.closePairDialog();");
    expect(dialog).toContain(`aria-label="Pair a device" @close=\${close}>`);
    expect(dialog).toContain("this.homePair.render({ bare: true })");
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
    expect(method("  private renderDeviceSheet(ownerId: string, devices: readonly HomeDeviceRow[]) {"))
      .toContain(`\${this.devicePaired === ownerId ? html\`<div class="dev-paired" role="status">`);
  });
});
