// The panel's wiring of the shell, read from its source, since no test mounts
// the panel: the tab bar draws above every tab, the complication bar keeps
// only what is about complications, the editor's keys are muted off its tab,
// and the help no longer sends anyone to the old top bar.

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

describe("the panel's shell wiring", () => {
  it("draws the tab bar above whatever the tab draws", () => {
    const render = method("  override render() {");
    expect(render).toContain("renderTabBar(");
    expect(render).toContain("html`${bar}${this.renderTab()}`");
  });

  it("draws Home on Home, before any watch screen or the complication editor", () => {
    const tab = method("  private renderTab() {");
    const home = tab.indexOf("this.renderHome()");
    expect(home).toBeGreaterThan(0);
    expect(home).toBeLessThan(tab.indexOf("isWatchPagesRoute(this.route)"));
  });

  it("keeps the watch screens and Watch settings out of the complication bar", () => {
    const bar = method("  private renderTopBar(");
    expect(bar).not.toMatch(/renderWatch\w*Button/);
    expect(bar).not.toContain("watchSettings.renderButton");
    expect(bar).not.toContain("tb-menu");
    for (const kept of ["renderPicker()", "renderNewButton()", "renderImportButton()", "renderShareButton()", "renderSendPill()", "renderTopMenu()", "primary save", "button class=\"help\""]) {
      expect(bar, kept).toContain(kept);
    }
  });

  it("hands Home Assistant's menu to the tab bar, not to each watch screen", () => {
    expect(SOURCE).not.toMatch(/\n {8}menu: this\.narrow/);
    expect(SOURCE.match(/\n {8}menu: false,/g)).toHaveLength(6);
  });

  it("sends each watch screen's way back to the Complications tab", () => {
    expect(SOURCE.match(/onBack: \(\) => this\.goTo\(COMPLICATIONS_PATH\)/g)).toHaveLength(6);
  });

  it("mutes the editor's keys wherever its draft is out of sight", () => {
    const keys = SOURCE.slice(SOURCE.indexOf("private keyHandler = "), SOURCE.indexOf("private blurHandler"));
    expect(keys).toContain("if (!editorKeysLive(this.route, this.draft !== undefined)) return;");
    expect(keys.indexOf("editorKeysLive")).toBeLessThan(keys.indexOf("this.onKey(e)"));
  });

  it("lands a reload or a share link on the Complications tab, replacing the address", () => {
    const will = method("  protected override willUpdate(changed");
    expect(will).toContain("landingPath(this.route, { restoring: this.restoreOpen !== undefined, shareLink: this.pendingLink !== undefined })");
    expect(will).toContain("this.goTo(to, true)");
    const share = SOURCE.slice(SOURCE.indexOf("private takeShareLink = "), SOURCE.indexOf("private async openPendingLink"));
    expect(share).toContain("landingPath(this.route, { restoring: false, shareLink: true })");
    expect(share).toContain("this.goTo(to, true)");
  });

  it("no longer sends anyone to the top bar in the help", () => {
    const help = method("  private renderHelpDialog() {");
    expect(help).not.toContain("top bar");
  });
});
