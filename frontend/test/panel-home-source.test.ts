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
const group = method("  private renderHomeGroup(");
const row = method("  private renderHomeRow(");
const detail = method("  private renderHomeDetail(");
const open = method("  private openHomeDevice(ownerId: string, forget = false) {");

describe("Home's page", () => {
  it("is the devices alone: no Watch app card, no complications card, no recent designs", () => {
    expect(SOURCE).not.toContain("renderHomeWatch");
    expect(home).not.toContain("home-recent");
    expect(home).not.toContain("renderStartCard(");
    expect(home).not.toContain("home-screens");
    expect(SOURCE).not.toContain("private startRecent(");
  });

  it("is a device browser: the side bar of devices, and the picked device beside it", () => {
    expect(home).toContain(`<aside class="hb-side" aria-label="Devices">`);
    expect(home).toContain("const pick = homePickOf(devices, this.homePick, (id) => this.ownerOf(id));");
    expect(home).toContain("${this.homeAll ? this.renderHomeAll() : this.renderHomeDetail(row, devices, groups, elapsed)}");
    // "All devices" leads the side bar (plan step 6).
    expect(home.indexOf("${this.renderHomeAllRow(devices.length)}")).toBeLessThan(home.indexOf("${groups.map("));
    expect(home.indexOf("hb-pair")).toBeLessThan(home.indexOf("${this.renderHomeAllRow(devices.length)}"));
    expect(home.indexOf("hb-pair")).toBeLessThan(home.indexOf("groups.map((g) => this.renderHomeGroup("));
  });

  it("tells a person who is not an administrator that the list shows only their devices", () => {
    expect(home).toContain(`const scope = this.hass?.user?.is_admin === false ? html\`<p class="home-scope">You see the devices paired to you. Ask an administrator if yours is missing.</p>\` : nothing;`);
    expect(home).toContain("${lead}${scope}");
  });

  it("says Loading… while the devices load, so the welcome never flashes up", () => {
    expect(home).toContain("const loading = !this.linkReady && this.owners.length === 0;");
    expect(home).toContain("if (!failed && !loading && devices.length === 0) return html`${error}${this.renderHomeWelcome(scope)}${pair}`;");
    expect(home).toContain("${failed ? this.renderNotReady() : html`<p class=\"home-empty\">Loading…</p>`}");
  });

  it("has no New complication button, only Pair a device", () => {
    expect(home).not.toContain("openNewDialog");
    expect(home).not.toContain("New complication");
    expect(home).toContain(`<button type="button" class="hb-pair" @click=\${() => this.openPairDialog()}>`);
    expect(home).toContain("<b>Pair a device</b>");
  });

  it("says in small print what the states cover: the watch app too", () => {
    expect(home).toContain(`<p class="home-small">\${HOME_SYNC_NOTE}</p>`);
  });

  it("judges each watch on its watch app records too, for everyone", () => {
    expect(home).toContain("homeDeviceRows(this.homeDevices(), this.watchAppSyncs)");
    // Only the note under the lead reads the person's role; the devices are
    // judged the same for everyone.
    expect(home.replace(/const scope = this\.hass\?\.user\?\.is_admin === false \? html`<p class="home-scope">[^`]*`/, "")).not.toContain("admin");
  });
});

describe("Home's household state", () => {
  it("is no card of its own: each person's box says how their devices stand", () => {
    expect(SOURCE).not.toContain("renderHomeStatus");
    expect(SOURCE).not.toContain("hb-sum");
    expect(group).toContain(`const sum = waiting > 0 ? \`\${waiting} waiting\``);
  });
});

describe("Home's device rows", () => {
  it("groups the rows by person, the person in grey and each device in its own color, with their picture where Home Assistant has one", () => {
    expect(home).toContain("const groups = homeGroups(this.people(), devices);");
    expect(group).toContain(`const color = "var(--wa-hue-grey)";`);
    expect(row).toContain("const color = this.deviceColorOf(d.id);");
    expect(group).toContain("<img src=${g.person.picture}");
    expect(group).toContain("this.renderHomeRow(d, d.id === pick, elapsed)");
    expect(method("  private people(): Person[] {")).toContain("peopleOf(this.owners, this.haPersonsFor.persons)");
    expect(SOURCE).not.toContain("peopleOf(this.owners)");
  });

  it("reads the counts from the same summary as the watch app's state, an iPhone's pages too", () => {
    const load = method("  private async loadWatchAppSync(again: boolean) {");
    expect(load).toContain("const phones = this.rowPhones.map((p) => p.owner_watch_id);");
    expect(load).toContain("const key = watchAppSyncKey([...watches, ...phones]);");
    expect(load).toContain("counts = summaryCounts(summary, [...watches, ...phones]);");
    expect(load).toContain("this.watchCounts = counts;");
  });

  it("picks its device, saying what it holds and when it was heard from", () => {
    expect(row).toContain(`aria-pressed=\${on ? "true" : "false"}`);
    expect(row).toContain("@click=${() => this.openHomeDevice(d.id, gone)}");
    expect(row).toContain("homeRowSub(d.kind, held, heard, this.homePageCount(d))");
    expect(row).toContain("homeMiniArt(d.kind, held > 0)");
  });

  it("marks a watch that could not use the last save in red", () => {
    expect(row).toContain(`const state = gone ? "" : rejected ? "rejected" : d.sync;`);
    expect(row).toContain("homeDeviceLabel(d)");
  });
});

describe("Home's picked device", () => {
  it("draws the device on its stage with its own complications on its face", () => {
    expect(detail).toContain("const face = gone ? undefined : this.homeFace(ownerId, row.kind);");
    expect(detail).toContain("homeWatchArt(`pick-${row.id}`, held, row.sync, face)");
    expect(detail).toContain("homePhoneArt(`pick-${row.id}`, held, row.sync, face)");
    expect(detail).toContain("const held = owner?.complication_count ?? 0;");
    const face = method("  private homeFace(ownerId: string, kind: \"watch\" | \"iphone\"): HomeFace | undefined {");
    expect(face).toContain("this.previewIsCurrent(preview, record)");
    expect(face).toContain("this.cardPictures.urlFor(key, cardPreviewAddress(ownerId, record.id, record.revision))");
    // Only as many pictures as the face has room for are asked for, and only
    // an iPhone stands Home Screen widgets on its face.
    expect(face.indexOf("if (!room) continue;")).toBeLessThan(face.indexOf("this.cardPictures.urlFor("));
    expect(face).toContain("circles.length + corners.length < 3");
    expect(face).toContain(`const widget = kind === "iphone" &&`);
    expect(face).toContain("widgets.length < 4");
  });

  it("names the device, its owner and its sync state in its bar, with no count buttons: its lineup below lists them", () => {
    expect(detail).toContain(`<div class="hb-stage"><div class="hb-device" aria-hidden="true">\${art}</div></div>`);
    expect(detail).toContain("${this.deviceForgetAsk || gone ? nothing : overview}");
    expect(detail).not.toContain("hb-call");
  });

  it("slides a newly picked device in, unless the person asks for less motion", () => {
    const slide = method("  private animateHomePick() {");
    expect(slide).toContain(`(prefers-reduced-motion: reduce)`);
    expect(slide).toContain("before === undefined || before === shown");
    expect(detail).toContain("data-pick=${ownerId}");
    expect(SOURCE).toContain(`if (tabOfRoute(this.route) === "home") this.animateHomePick();`);
  });

  it("reads an iPhone's pages count on a home with phone pages", () => {
    const load = method("  private async loadDeviceCounts(ownerId: string) {");
    expect(load).toContain(`: device === "iphone" && this.phonePages ? ["pages", "status_pages"] : [];`);
  });

  it("steps to the device before and after it", () => {
    expect(detail).toContain("const next = homeStep(devices, ownerId, dir);");
    expect(detail).toContain(`aria-label="Previous device"`);
    expect(detail).toContain(`aria-label="Next device"`);
  });

  it("says Not synced, in red, for a watch that could not use the last save", () => {
    expect(detail).toContain(`const state = rejected ? "rejected" : row.sync;`);
    expect(detail).toContain(`<div class="hb-state \${state}">`);
    expect(detail).toContain("<b>${homeDeviceLabel(row)}</b>");
    expect(detail).toContain("const syncSub = rejected ? attentionText(row, undefined)");
  });

  it("lists what is on the device in its order, each line with Edit and each group with Change (plan step 6)", () => {
    expect(detail).toContain("${this.deviceForgetAsk || gone ? nothing : this.renderHomeLineup(row)}");
    expect(detail).not.toContain("hb-doors");
    const lineup = method("  private renderHomeLineup(row: HomeDeviceRow) {");
    expect(lineup).toContain("onEdit: (kind, id) => this.goTo(libraryItemPath(kind, id, ownerId)),");
    expect(lineup).toContain("onChange: (kind) => this.goTo(listFocusPath(listOf(kind), ownerId)),");
    expect(lineup).toContain("${renderLineupGroup(this.homeCompGroup(row))}");
    const comps = method("  private homeCompGroup(row: HomeDeviceRow): LineupGroup {");
    expect(comps).toContain(`onClick: () => void this.openDeviceList(ownerId, "all")`);
    // A device's own screens open on that device, in the iPhone app for an
    // iPhone.
    const own = method("  private homeOwnGroup(row: HomeDeviceRow): LineupGroup {");
    expect(own).toContain("const path = deviceScreenPath(row.kind, screen, row.id);");
    expect(own).toContain("onClick: () => { this.pickWatch(row.id); this.goTo(path); },");
    // The board focused on the device (plan step 5), after closing a design
    // open in the editor; Cards, if picked, opens on that device's tab.
    const list = method("  private async openDeviceList(");
    expect(list).toContain("this.pickerFilter = filter;");
    expect(list).toContain("this.pickPickerTab(ownerId);");
    expect(list).toContain("if (this.draft?.dirty && !this.confirmDiscard()) return;");
    expect(list).toContain("this.goTo(listFocusPath(COMPLICATIONS_PATH, ownerId));");
    const count = method("  private homeTileCount(");
    expect(count).toContain("this.watchCounts.get(d.id)?.[t.count]");
  });

  it("has no New complication button", () => {
    expect(detail).not.toContain("openNewDialog");
  });

  it("reads a watch's counts when it is picked, when the summary has none, dropping a late reply", () => {
    expect(open).toContain("void this.loadDeviceCounts(ownerId);");
    const load = method("  private async loadDeviceCounts(ownerId: string) {");
    expect(load).toContain("watchConfigCount(kind, record.document)");
    expect(load).toContain("this.watchCounts.has(ownerId)");
    expect(load).toContain("if (this.homePick !== ownerId) return;");
  });

  it("opens on its Remove step when asked, never with the browser's own confirm", () => {
    expect(open).toContain("this.deviceForgetAsk = forget;");
    expect(home).not.toContain("confirm(");
    expect(detail).not.toContain("confirm(");
  });

  it("offers Remove to everyone, behind a second step", () => {
    expect(detail).not.toContain("is_admin");
    expect(detail).toContain("@click=${() => { this.deviceForgetAsk = true; this.deviceForgetError = undefined; stopRename(); this.stopAddressEdit(); }}>Remove</button>");
    expect(detail).toContain("@click=${() => void this.forgetDeviceNow(ownerId)}");
    expect(detail).toContain("${this.deviceForgetAsk ? ask : gone ? goneNote : nothing}");
  });

  it("renames the device through the integration, from a button on its bar, for everyone", () => {
    expect(detail).not.toContain("mayRename");
    expect(detail).toContain("${!this.deviceForgetAsk && !renaming && !gone");
    expect(detail).toContain("@click=${() => this.startDeviceRename(ownerId)}>Rename</button>");
    expect(detail).toContain("void this.renameDeviceNow(ownerId);");
    expect(method("  private startDeviceRename(ownerId: string) {")).toContain(`".hb-detail input.dev-rename-in"`);
    const save = method("  private async renameDeviceNow(ownerId: string) {");
    expect(save).toContain("await renameDevice(this.hass, ownerId, name === \"\" ? null : name);");
    expect(save).toContain("await this.loadOwners();");
  });

  it("lets Escape leave the name field", () => {
    expect(detail).toContain(`if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); stopRename(); }`);
  });

  it("reads the devices and lists again after a Remove, picks the device heard from last, and another complications device when it was the open one", () => {
    const forget = method("  private async forgetDeviceNow(ownerId: string) {");
    expect(forget).toContain("await forgetDevice(this.hass, ownerId);");
    expect(forget).toContain("if (this.ownerId === ownerId && this.draft?.dirty && !this.confirmDiscard()) return;");
    expect(forget).toContain("this.homePick = undefined;");
    expect(forget).toContain("this.ownerId = undefined;");
    expect(forget).toContain("await this.loadOtherLists();");
  });

  it("offers only Remove for a device whose Home Assistant user was deleted", () => {
    expect(row).toContain("const gone = userGone(owner);");
    expect(row).toContain("this.openHomeDevice(d.id, gone)");
    expect(detail).toContain("const gone = userGone(owner);");
    const note = between(detail, "const goneNote = html`", "</div>`;");
    expect(note).toContain("${USER_GONE_TEXT}.");
    expect(detail).toContain("${!this.deviceForgetAsk && !renaming && !gone");
  });
});

describe("coming back to Home", () => {
  it("reads the other devices' lists again, so its count is current", () => {
    const will = method("  protected override willUpdate(changed");
    const back = between(will, `if (changed.has("route") && tabOfRoute(this.route) === "home"`, "}");
    expect(back).toContain(`tabOfRoute(changed.get("route") as PanelRoute | undefined) !== "home"`);
    expect(back).toContain("void this.loadOtherLists();");
  });

  it("reads the watch app records on the way into Home, and when the watches change", () => {
    const will = method("  protected override willUpdate(changed");
    const back = between(will, `if (changed.has("route") && tabOfRoute(this.route) === "home"`, "}");
    expect(back).toContain("void this.loadWatchAppSync(true);");
    expect(will).toContain(`if (changed.has("owners") && barTabOf(this.route) === "home") void this.loadWatchAppSync(false);`);
    const load = method("  private async loadWatchAppSync(again: boolean) {");
    expect(load).not.toContain("is_admin");
    expect(load).toContain("const summary = await fetchWatchConfigSummary(hass);");
    expect(load).toContain("next = summaryWatchAppSyncs(summary, watches, phones);");
    expect(load).toContain("if (!summaryUnknown(err)) {");
    expect(load.indexOf("fetchWatchConfigSummary")).toBeLessThan(load.indexOf("readWatchAppSync((kind) => fetchWatchConfig(hass, id, kind))"));
    expect(load).toContain("if (run !== this.watchAppSyncRun) return;");
    expect(load).toContain("if (!again && key === this.watchAppSyncFor) return;");
    expect(load).toContain("counts = summaryCounts(summary, [...watches, ...phones]);");
    expect(load).toContain("this.watchCounts = counts;");
  });
});

describe("Home's Pair a device dialog", () => {
  it("opens from the side bar's button for everyone; a home with no devices pairs in its welcome", () => {
    expect(home).not.toContain("home-device-add");
    expect(home).toContain(`<button type="button" class="hb-pair" @click=\${() => this.openPairDialog()}>`);
    expect(home).toContain("<b>Pair a device</b>");
    expect(home).toContain("const pair = this.pairOpen ? this.renderPairDialog() : nothing;");
  });

  it("closes, withdrawing an open QR code, when the panel leaves the page", () => {
    expect(method("  override disconnectedCallback() {")).toContain("this.closePairDialog();");
    expect(method("  private renderPairDialog() {")).toContain(`aria-label="Pair a device"`);
  });

  it("draws the Settings page's own pairing card, starting afresh on each opening", () => {
    expect(SOURCE).toContain(`import { PairWatchCard, renderPairNext } from "./watch-pair-view.js";`);
    expect(method("  private openPairDialog() {")).toContain(`this.homePair.open(this.hass, { mode: "choose" });`);
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
    expect(made).toContain(`else if (isPhoneId(this.owners, watchId)) this.pickPhone(watchId);`);
    // Opened from the iPhone app, the dialog closes and no sheet opens.
    expect(made.indexOf(`if (tabOfRoute(this.route) !== "home") return;`)).toBeGreaterThan(made.indexOf("this.closePairDialog();"));
    expect(made.indexOf(`if (tabOfRoute(this.route) !== "home") return;`)).toBeLessThan(made.indexOf("this.openHomeDevice(watchId);"));
  });

  it("keeps a watch just paired in the dialog, saying what next, until it closes", () => {
    const at = SOURCE.indexOf("private homePair = new PairWatchCard(");
    const made = SOURCE.slice(at, SOURCE.indexOf("});", at));
    const watch = made.indexOf(`if (kind === "watch") {\n      this.pairNext = watchId;\n      // Its addresses, for the what next's third step.\n      void this.loadDeviceAddresses(watchId);\n      return;\n    }`);
    expect(watch).toBeGreaterThan(made.indexOf("if (stale() || !this.pairOpen"));
    expect(watch).toBeLessThan(made.indexOf("this.closePairDialog();"));
    expect(method("  private openPairDialog() {")).toContain("this.pairNext = undefined;");
    expect(method("  private closePairDialog() {")).toContain("this.pairNext = undefined;");
    const dialog = method("  private renderPairDialog() {");
    expect(dialog).toContain("this.renderPairNextBody(this.pairNext)");
    expect(dialog).toContain("<span>${this.homePair.subtitle}</span>");
    const next = method("  private renderPairNextBody(watchId: string) {");
    // New page: the Pages board focused on this watch, the way Home's doors go.
    expect(next).toContain(`const path = deviceListPath("pages", watchId)!;`);
    expect(next).toContain("this.pickWatch(watchId);\n        this.goTo(path);");
    expect(next).toContain("this.goTo(COMPLICATIONS_PATH);");
    expect(next).toContain(`this.homePair.open(this.hass, { mode: "choose" });`);
    // The sync word is Home's own row, which Home keeps current.
    expect(next).toContain("homeDeviceRows(this.homeDevices(), this.watchAppSyncs)");
    expect(next).toContain("status: pairNextStatus(row),");
  });

  it("closes on a new iPhone, picked on Home with Paired in green", () => {
    const at = SOURCE.indexOf("private homePair = new PairWatchCard(");
    const made = SOURCE.slice(at, SOURCE.indexOf("});", at));
    expect(made).toContain("if (stale() || !this.pairOpen || this.ownerOf(watchId) === undefined) return;");
    const order = ["this.closePairDialog();", "this.openHomeDevice(watchId);", "this.devicePaired = watchId;"]
      .map((line) => made.indexOf(line));
    expect(order.every((i) => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    // Picking any device drops the line.
    expect(open).toContain("this.devicePaired = undefined;");
    expect(detail).toContain(`\${this.devicePaired === ownerId ? html\`<div class="dev-paired" role="status">`);
  });
});

describe("the doors to a device's complications", () => {
  it("opens the Complications tab on every complication, closing a design with nothing unsaved", () => {
    expect(method("  private openTab(tab: PanelTab) {")).toContain(`if (tab === "complications") this.showAllComplications();`);
    const all = method("  private showAllComplications() {");
    expect(all).toContain("this.setTabMemory(pickTab(this.tabMemory, ALL_DEVICES));");
    expect(all).toContain(`this.pickerFilter = "all";`);
    expect(all).toContain("if (d !== undefined && !d.dirty && d.baseRevision !== null) void this.closeToList();");
  });
});
