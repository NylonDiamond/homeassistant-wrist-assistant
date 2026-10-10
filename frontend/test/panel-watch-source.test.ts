// The panel's wiring of the Watch app's shared watch and its row, and of the
// iPhone app's shared iPhone and its row, read from its source, since no test
// mounts the panel. The rules themselves are tested in watch-pick,
// watch-row, phone-pages, watch-shell-mode and watch-settings-shell.

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

const count = (text: string, part: string) => text.split(part).length - 1;

describe("the panel's shared watch", () => {
  it("works it out from the address, the remembered pick and today's choice, never storing the complications device", () => {
    const get = method("  private get sharedWatch()");
    expect(get).toContain("resolveWatchPick(this.rowWatches, {");
    expect(get).toContain("route: watchRouteOwner(this.route),");
    expect(get).toContain("saved: this.watchPick,");
    expect(get).toContain("fallback: this.ownerId,");
    expect(SOURCE).not.toMatch(/watchPick = this\.ownerId/);
    expect(SOURCE).not.toMatch(/rememberWatch\(this\.ownerId/);
  });

  it("offers the watches alone in the Watch app, and the iPhones in the iPhone app only on a home with phone pages", () => {
    expect(method("  private get rowWatches()")).toContain("return settingsWatches(this.owners);");
    expect(method("  private get rowPhones()")).toContain("return this.phonePages ? iphoneDevices(this.owners) : [];");
    const phone = method("  private get sharedPhone()");
    expect(phone).toContain("if (phones.length === 0 && (this.linkReady || this.owners.length > 0)) return undefined;");
    expect(phone).toContain("resolveWatchPick(phones, { route: iphoneRouteOwner(this.route), saved: this.phonePick, fallback: undefined });");
    const load = method("  private async loadOwners() {");
    expect(load).toContain("this.phonePages = phonePagesOn(reply.capabilities);");
    expect(load.indexOf("this.phonePages =")).toBeLessThan(load.indexOf("this.owners = reply.owners;"));
  });

  it("remembers it per browser, read once on connect", () => {
    expect(method("  override connectedCallback() {")).toContain("this.watchPick = loadWatchPick(() => window.localStorage);");
    expect(method("  private rememberWatch(")).toContain("saveWatchPick(() => window.localStorage, watchId);");
    expect(method("  override connectedCallback() {")).toContain(`this.phonePick = loadWatchPick(() => window.localStorage, "iphone");`);
    expect(method("  private rememberPhone(")).toContain(`saveWatchPick(() => window.localStorage, phoneId, "iphone");`);
  });

  it("makes a watch the address names the remembered one", () => {
    const will = method("  protected override willUpdate(changed");
    expect(will).toContain(`if (changed.has("route") || changed.has("owners") || changed.has("phonePages")) {`);
    expect(will).toContain("adoptRouteWatch(this.watchPick, watchRouteOwner(this.route), this.rowWatches)");
    expect(will).toContain("this.rememberWatch(next)");
    expect(will).toContain("adoptRouteWatch(this.phonePick, iphoneRouteOwner(this.route), this.rowPhones)");
    expect(will).toContain("this.rememberPhone(phone)");
  });

  it("moves an old Watch app address that names an iPhone to the iPhone app, in place, before anything reads the route", () => {
    const will = method("  protected override willUpdate(changed");
    const at = will.indexOf("const to = iphoneAddressFor(this.route, this.owners, this.phonePages);");
    expect(at).toBeGreaterThan(0);
    expect(will.slice(at, at + 160)).toContain("if (to !== undefined) this.goTo(to, true);");
    expect(at).toBeLessThan(will.indexOf("this.watchSettings.show("));
    expect(at).toBeLessThan(will.indexOf("adoptRouteWatch("));
  });

  it("moves the address with a pick on a watch screen, in place, and hands an iPhone to the iPhone app's pick", () => {
    const pick = method("  private pickWatch(");
    expect(pick).toContain("this.rememberWatch(watchId);");
    expect(pick).toContain("this.goTo(watchScreenPath(screen, watchId), true)");
    expect(pick.indexOf("this.pickPhone(watchId);")).toBeLessThan(pick.indexOf("this.rememberWatch(watchId);"));
    const phone = method("  private pickPhone(");
    expect(phone).toContain("this.rememberPhone(phoneId);");
    expect(phone).toContain("this.goTo(iphoneScreenPath(screen, phoneId), true)");
  });
});

describe("the watch screens under the row", () => {
  const tab = method("  private renderTab() {");
  const screens = method("  private renderWatchScreen(");
  const call = (view: string) => {
    const at = screens.indexOf(`return ${view}({`);
    expect(at, view).toBeGreaterThan(0);
    return screens.slice(at, screens.indexOf("});", at));
  };

  it("puts every watch screen under the Watch app row, handed the shared watch, and every iPhone app screen under its own row, handed the shared iPhone", () => {
    expect(tab).toContain("if (screen !== undefined) return this.withWatchRow(this.renderWatchScreen(screen.id, this.sharedWatch));");
    expect(tab).toContain(`if (tab === "iphone") return this.withIphoneRow(this.renderIphoneScreen());`);
    const iphone = method("  private renderIphoneScreen() {");
    expect(iphone).toContain("return this.renderWatchScreen(screen.id, phone);");
    expect(iphone).toContain("const phone = this.sharedPhone;");
    expect(iphone).toContain("const screen = iphoneScreenOf(this.route);");
  });

  it("hands each of the six that follow a device the device it is drawn for, in the shell's mode, with no Watch settings button of their own", () => {
    for (const view of ["renderWatchPagesView", "renderWatchMenusView", "renderWatchVoiceView", "renderWatchStatusPagesView", "renderWatchControlCenterView", "renderWatchRoomsView"]) {
      const body = call(view);
      expect(body, view).toContain("ownerId: owner,");
      expect(body, view).toContain("shell: true,");
      expect(body, view).toContain("actions: nothing,");
      expect(body, view).toContain("dialogs: nothing,");
    }
    expect(count(screens, "ownerId: owner,")).toBe(6);
    expect(screens).not.toContain("watchSettings.renderButton");
    expect(screens).not.toContain("watchSettings.render(");
    expect(SOURCE).not.toContain("watchOnlyOwner");
    expect(SOURCE).not.toContain("watchOnlyFallback");
    expect(tab).not.toMatch(/RouteOwner\(this\.route\) \?\? this\.ownerId/);
  });

  it("lets the four screens a phone has open an iPhone on a home with phone pages, and no other", () => {
    for (const view of ["renderWatchPagesView", "renderWatchMenusView", "renderWatchStatusPagesView", "renderWatchRoomsView"]) {
      expect(call(view), view).toContain("phones: this.phonePages,");
    }
    expect(count(screens, "phones: this.phonePages,")).toBe(4);
    expect(method("  private withWatchRow(")).toContain("phones: this.phonePages,");
  });

  it("draws the iPhone app's row for the iPhones, with Pair an iPhone opening Home's Pair a device", () => {
    const row = method("  private withIphoneRow(");
    expect(row).toContain("watch: this.sharedPhone,");
    expect(row).toContain("iphone: true,");
    expect(row).toContain("onPick: (phoneId) => this.pickPhone(phoneId),");
    expect(row).toContain("onPair: () => this.openPairDialog(),");
    expect(row).toContain("${this.pairOpen ? this.renderPairDialog() : nothing}");
  });

  it("waits for the device list on the iPhone app, then says how to pair an iPhone in a home with none", () => {
    const iphone = method("  private renderIphoneScreen() {");
    expect(iphone.indexOf("if (!this.linkReady && this.owners.length === 0) {")).toBeLessThan(iphone.indexOf("const phone = this.sharedPhone;"));
    expect(iphone).toContain("if (phone === undefined || screen === undefined) {");
    expect(iphone).toContain("<h2>No iPhone yet</h2>");
    expect(iphone).toContain("@click=${() => this.openPairDialog()}");
    expect(iphone).not.toMatch(/ - |\u2013|\u2014/);
  });

  it("puts HTTP actions under the row too, handed no watch, as every watch shares it", () => {
    const body = call("renderWatchHttpActionsView");
    expect(body).toContain("hass: this.hass, owners: this.owners, narrow: this.narrow, icons: this.icons, iconsTick: this.iconsTick,");
    expect(body).not.toContain("ownerId");
    expect(body).not.toMatch(/\bwatch\b/);
    expect(body).not.toContain("shell:");
  });

  it("puts Cameras under the row too, handed no watch and no owners, as the framing is the camera's", () => {
    const body = call("renderWatchCamerasView");
    expect(body).toContain("hass: this.hass, narrow: this.narrow,");
    expect(body).not.toContain("ownerId");
    expect(body).not.toMatch(/\bwatch\b/);
    expect(body).not.toContain("shell:");
    expect(body).not.toContain("menu:");
    expect(body).not.toContain("onBack");
  });

  it("counts HTTP action and camera edits in both leave guards, and drops them on a yes", () => {
    const unload = SOURCE.slice(SOURCE.indexOf("  private beforeUnload = "), SOURCE.indexOf("  private leaveGuard = "));
    expect(unload).toContain("!watchHttpActionsDirty()");
    expect(unload).toContain("!watchCamerasDirty()");
    const guard = SOURCE.slice(SOURCE.indexOf("  private leaveGuard = "), SOURCE.indexOf("\n  };\n", SOURCE.indexOf("  private leaveGuard = ")));
    expect(guard).toContain("!watchHttpActionsDirty()");
    expect(guard).toContain("dropWatchHttpActionsDrafts();");
    expect(guard).toContain("!watchCamerasDirty()");
    expect(guard).toContain("dropWatchCamerasDrafts();");
  });

  it("asks before a move inside the panel leaves a screen with unsaved work, and drops only that screen's edits on a yes", () => {
    const go = method("  private goTo(path: string");
    expect(go.indexOf("if (!replace && !this.leaveScreenFor(")).toBeGreaterThan(0);
    expect(go.indexOf("leaveScreenFor(")).toBeLessThan(go.indexOf("navigatePanel("));
    const leave = method("  private leaveScreenFor(");
    expect(leave).toContain("if (screenIdOf(from) === screenIdOf(to)) return true;");
    expect(leave).toContain("if (kept === undefined || !kept.dirty) return true;");
    expect(leave).toContain("if (!this.confirmDiscard()) return false;");
    expect(leave.indexOf("confirmDiscard")).toBeLessThan(leave.indexOf("kept.drop();"));
    const kept = method("  private screenDraft(");
    for (const line of [
      `case "pages": return { dirty: watchPagesDirty(), drop: dropWatchPagesDrafts };`,
      `case "menus": return { dirty: watchMenusDirty(), drop: dropWatchMenusDrafts };`,
      `case "status-pages": return { dirty: watchStatusPagesDirty(), drop: dropWatchStatusPagesDrafts };`,
      `case "control-center": return { dirty: watchControlCenterDirty(), drop: dropWatchControlCenterDrafts };`,
      `case "rooms": return { dirty: watchRoomsDirty(), drop: dropWatchRoomsDrafts };`,
      `case "voice": return { dirty: watchVoiceDirty(), drop: dropWatchVoiceDrafts };`,
      `case "http-actions": return { dirty: watchHttpActionsDirty(), drop: dropWatchHttpActionsDrafts };`,
      `case "cameras": return { dirty: watchCamerasDirty(), drop: dropWatchCamerasDrafts };`,
      `case "settings": return { dirty: anyWatchSettingsDirty(), drop: () => this.watchSettings.dropKept() };`,
      `case "complications": return { dirty: this.draft?.dirty === true, drop: () => this.selectNone() };`,
    ]) expect(kept).toContain(line);
    // The browser's Back and a link from inside an editor do not go through
    // goTo: the route change asks, and a no puts the address back.
    const will = method("  protected override willUpdate(");
    expect(will).toContain("if (!this.leaveScreenFor(this.route, from)) this.route = navigatePanel(this.route, from.path, true) ?? from;");
  });

  it("leaves Settings to the row as a link like the six, on the shared watch", () => {
    expect(SOURCE).not.toContain("openWatchSettings");
    const row = method("  private withWatchRow(");
    expect(row).not.toContain("onSettings");
    expect(row).not.toContain("settingsOpen");
    expect(row).toContain("onGo: (path) => { this.toggleWatchRowMenu(false); this.goTo(path); },");
    expect(row).toContain("onPick: (watchId) => this.pickWatch(watchId),");
    expect(row).toContain("watch: this.sharedWatch,");
    expect(row).not.toContain("admin");
  });

  it("makes a watch paired in Watch settings the shared one", () => {
    expect(SOURCE).toContain("}, () => this.icons, (watchId) => this.pickWatch(watchId));");
  });

  it("closes the row's watch menu on a press outside it, and lets go of the listener when the panel goes", () => {
    expect(method("  private toggleWatchRowMenu(")).toContain(`window.addEventListener("pointerdown", this.watchRowOutside, { capture: true })`);
    expect(method("  override disconnectedCallback() {")).toContain(`window.removeEventListener("pointerdown", this.watchRowOutside, { capture: true });`);
  });

  it("closes the row's watch menu on any move, Back and Forward included, which bring no press", () => {
    expect(method("  protected override willUpdate(changed")).toContain(`if (changed.has("route")) this.toggleWatchRowMenu(false);`);
  });
});

describe("links into the Watch app carry the shared watch", () => {
  it("in the Watch app and iPhone app tabs", () => {
    const render = method("  override render() {");
    expect(render).toContain("watch: this.sharedWatch,");
    expect(render).toContain("iphone: this.sharedPhone,");
    expect(render).toContain("phones: this.phonePages,");
    expect(method("  private openTab(")).toContain("this.goTo(tabPath(tab, this.sharedWatch, this.sharedPhone));");
  });

  it("on Home's device cards, which open a screen on that card's own watch or iPhone", () => {
    const tile = method("  private renderHomeTile(");
    expect(tile).toContain("const path = deviceScreenPath(d.kind, t.screen, d.id);");
    expect(tile).toContain(`<a class="home-tile" href=\${panelUrl(this.route, path, window.location.pathname)}`);
    expect(tile).toContain("this.pickWatch(d.id);");
    expect(method("  private renderHome() {")).not.toContain("watchSettings.");
  });
});

describe("the Settings page", () => {
  it("is a watch screen under the row, drawn by the panel", () => {
    expect(method("  private renderWatchScreen(")).toContain(`case "settings": return this.renderSettingsPage();`);
    const page = method("  private renderSettingsPage() {");
    expect(page).not.toContain("is_admin");
    expect(page).toContain("if (!this.linkReady && this.owners.length === 0) {");
    expect(page).toContain("return this.watchSettings.render(this.hass, this.owners, { narrow: this.narrow, width: this.panelWidth });");
  });

  it("follows the shared watch on every draw, once the devices are in, and leaves on any other route", () => {
    const will = method("  protected override willUpdate(changed");
    expect(will).toContain("if (isWatchSettingsRoute(this.route)) {");
    expect(will).toContain("if (listed) this.watchSettings.show(this.hass, this.owners, this.sharedWatch, false);");
    expect(will).toContain("this.watchSettings.leave();");
  });

  it("shows the iPhone app's Settings only on an iPhone, as iPhone settings", () => {
    const will = method("  protected override willUpdate(changed");
    expect(will).toContain("} else if (iphoneScreenOf(this.route) === WATCH_SETTINGS_SCREEN && listed && this.sharedPhone !== undefined) {");
    expect(will).toContain("this.watchSettings.show(this.hass, this.owners, this.sharedPhone, true);");
  });

  it("is drawn nowhere else: no Watch settings dialog over Home, the list, the editor or a watch screen", () => {
    expect(count(SOURCE, "this.watchSettings.render(")).toBe(1);
    expect(SOURCE).not.toContain("this.watchSettings.show(this.hass, this.owners, undefined)");
  });

  it("saves on ⌘S or Ctrl+S, which the panel takes before its other keys", () => {
    const keys = SOURCE.slice(SOURCE.indexOf("  private keyHandler = (e: KeyboardEvent) => {"));
    const save = keys.indexOf("if (settingsPageSavesOnKey(iphoneInnerRoute(this.route) ?? this.route, e)) {");
    expect(save).toBeGreaterThan(0);
    expect(save).toBeLessThan(keys.indexOf("if (!editorKeysLive("));
    expect(keys.slice(save, save + 200)).toContain("this.watchSettings.saveFromKey();");
  });

  it("counts its kept edits in both leave guards, and drops them on a yes", () => {
    const unload = SOURCE.slice(SOURCE.indexOf("  private beforeUnload = "), SOURCE.indexOf("  private leaveGuard = "));
    expect(unload).toContain("!anyWatchSettingsDirty()");
    const guard = SOURCE.slice(SOURCE.indexOf("  private leaveGuard = "), SOURCE.indexOf("\n  };\n", SOURCE.indexOf("  private leaveGuard = ")));
    expect(guard).toContain("!anyWatchSettingsDirty()");
    expect(guard).toContain("this.watchSettings.dropKept();");
  });
});
