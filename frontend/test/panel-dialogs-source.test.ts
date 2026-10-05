// The Complications tab's dialogs, menus and sheets when the route leaves the
// tab, read from the panel's source, since no test mounts the panel. Back or
// Forward moves without a press, and the element a dialog lived in is simply
// not drawn any more, so its close handler never runs: the panel shuts each
// in state itself, by the reset its own close path runs.

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

describe("leaving the Complications tab with a dialog open", () => {
  const gone = method("  private complicationsSurfacesGone() {");

  it("runs on every move off the tab, Back and Forward included", () => {
    const will = method("  protected override willUpdate(changed");
    expect(will).toContain(`if (changed.has("route") && tabOfRoute(this.route) !== "complications") this.complicationsSurfacesGone();`);
    // The Browse dialog keeps its own path.
    expect(will).toContain(`if (this.pickerOpen && tabOfRoute(this.route) !== "complications") this.pickerClosed();`);
  });

  it("lowers every dialog's flag", () => {
    for (const flag of ["helpOpen", "newOpen", "dupOpen", "confirmDelete", "shareOpen", "galleryOpen", "slotsOpen", "savePartOpen", "zoomed"]) {
      expect(gone, flag).toContain(`this.${flag} = false;`);
    }
    expect(gone).toContain("this.presetKind = undefined;");
    expect(gone).toContain("this.presetEntity = undefined;");
  });

  it("runs the dialogs' own close paths where they do more than lower a flag", () => {
    // Import's history timer and run, History's fetch run, Share's pointer.
    expect(gone).toContain("if (this.importOpen) this.importClosed();");
    expect(gone).toContain("if (this.historyOpen) this.historyClosed();");
    expect(gone).toContain("this.pointAtRow([], undefined, () => undefined);");
    expect(gone).toContain("if (this.stacked) this.closeStack();");
    expect(gone).toContain("if (this.demoing) this.closeDemo();");
  });

  it("lets go of the window listeners the tab's menus and sheet hold", () => {
    expect(gone).toContain("if (this.addSheet !== undefined) this.closeAddSheet();");
    expect(gone).toContain("this.toggleSideMenu(this.sideMenu, false);");
    expect(gone).toContain("this.toggleMenu(this.openMenu, false);");
    expect(method("  private closeAddSheet() {")).toContain(`window.removeEventListener("pointerdown", this.addSheetOutside, { capture: true });`);
    expect(method("  private toggleSideMenu(")).toContain(`else window.removeEventListener("pointerdown", this.sideMenuOutside, { capture: true });`);
    expect(method("  private toggleMenu(")).toContain(`else window.removeEventListener("pointerdown", this.menuOutside, { capture: true });`);
  });

  it("covers every dialog the tab draws behind a flag", () => {
    const tab = method("  private renderTab() {");
    const flags = [...tab.matchAll(/\$\{this\.(\w+) \? this\.render\w+Dialog\(\) : nothing\}/g)].map((m) => m[1]!);
    expect(flags.length).toBeGreaterThanOrEqual(10);
    for (const flag of flags) expect(gone, flag).toMatch(new RegExp(`this\\.${flag}\\b`));
  });

  it("never reaches into the DOM: the elements are already on their way out", () => {
    expect(gone).not.toContain("querySelector");
    expect(gone).not.toContain(".close()");
  });
});
