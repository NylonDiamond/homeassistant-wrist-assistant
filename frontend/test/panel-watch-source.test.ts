// The panel's wiring of the Watch app's shared watch and its row, read from
// its source, since no test mounts the panel. The rules themselves are tested
// in watch-pick, watch-row, watch-shell-mode and watch-settings-shell.

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
    expect(get).toContain("resolveWatchPick(settingsWatches(this.owners), {");
    expect(get).toContain("route: watchRouteOwner(this.route),");
    expect(get).toContain("saved: this.watchPick,");
    expect(get).toContain("fallback: this.ownerId,");
    expect(SOURCE).not.toMatch(/watchPick = this\.ownerId/);
    expect(SOURCE).not.toMatch(/rememberWatch\(this\.ownerId/);
  });

  it("remembers it per browser, read once on connect", () => {
    expect(method("  override connectedCallback() {")).toContain("this.watchPick = loadWatchPick(() => window.localStorage);");
    expect(method("  private rememberWatch(")).toContain("saveWatchPick(() => window.localStorage, watchId);");
  });

  it("makes a watch the address names the remembered one", () => {
    const will = method("  protected override willUpdate(changed");
    expect(will).toContain(`if (changed.has("route") || changed.has("owners")) {`);
    expect(will).toContain("adoptRouteWatch(this.watchPick, watchRouteOwner(this.route), settingsWatches(this.owners))");
    expect(will).toContain("this.rememberWatch(next)");
  });

  it("moves the address with a pick on a watch screen, in place", () => {
    const pick = method("  private pickWatch(");
    expect(pick).toContain("this.rememberWatch(watchId);");
    expect(pick).toContain("this.goTo(watchScreenPath(screen, watchId), true)");
  });
});

describe("the watch screens under the row", () => {
  const tab = method("  private renderTab() {");

  it("puts each of the six under the row, handed the shared watch, in the shell's mode, with no Watch settings button of their own", () => {
    for (const view of ["renderWatchPagesView", "renderWatchMenusView", "renderWatchVoiceView", "renderWatchStatusPagesView", "renderWatchControlCenterView", "renderWatchRoomsView"]) {
      expect(tab, view).toContain(`return this.withWatchRow(${view}({`);
    }
    expect(count(tab, "ownerId: watch,")).toBe(6);
    expect(count(tab, "shell: true,")).toBe(6);
    expect(count(tab, "actions: nothing,")).toBe(6);
    expect(tab).not.toContain("watchSettings.renderButton");
    expect(tab).not.toMatch(/RouteOwner\(this\.route\) \?\? this\.ownerId/);
  });

  it("opens Watch settings from the row on the shared watch, without its own tabs", () => {
    expect(method("  private openWatchSettings()")).toContain("this.watchSettings.show(this.hass, this.owners, this.sharedWatch, { shell: true });");
    const row = method("  private withWatchRow(");
    expect(row).toContain("onSettings: () => this.openWatchSettings(),");
    expect(row).toContain("onPick: (watchId) => this.pickWatch(watchId),");
    expect(row).toContain("watch: this.sharedWatch,");
    expect(row).toContain("admin: this.hass.user?.is_admin === true,");
  });

  it("makes a watch paired in Watch settings the shared one", () => {
    expect(SOURCE).toContain("}, () => this.icons, (watchId) => this.pickWatch(watchId));");
  });

  it("closes the row's watch menu on a press outside it, and lets go of the listener when the panel goes", () => {
    expect(method("  private toggleWatchRowMenu(")).toContain(`window.addEventListener("pointerdown", this.watchRowOutside, { capture: true })`);
    expect(method("  override disconnectedCallback() {")).toContain(`window.removeEventListener("pointerdown", this.watchRowOutside, { capture: true });`);
  });
});

describe("links into the Watch app carry the shared watch", () => {
  it("in the Watch app tab", () => {
    expect(method("  override render() {")).toContain("watch: this.sharedWatch,");
    expect(method("  private openTab(")).toContain("this.goTo(tabPath(tab, this.sharedWatch));");
  });

  it("on Home's cards and its Watch settings button", () => {
    const home = method("  private renderHomeWatch() {");
    expect(home).toContain("const watch = this.sharedWatch;");
    expect(home).toContain("watchScreenPath(screen, watch)");
    expect(method("  private renderHome() {")).toContain("this.watchSettings.show(this.hass, this.owners, this.sharedWatch)");
  });
});
