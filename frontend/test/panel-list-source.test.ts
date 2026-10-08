// The panel's wiring of the Complications tab's list page, read from its
// source, since no test mounts the panel: one surface drawn as the dialog or
// the page and never both, the dialog-keyed rules moved to the shared class,
// the close-first calls only closing an open dialog, the way back from the
// editor asking about unsaved work, and the start page kept only as the
// empty state.

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

/** An arrow-function field, from its name to its closing `};`. */
function field(name: string): string {
  const at = SOURCE.indexOf(`private ${name} = `);
  if (at < 0) throw new Error(`no ${name}`);
  return SOURCE.slice(at, SOURCE.indexOf("\n  };\n", at));
}

describe("one picker surface, two forms", () => {
  it("draws the dialog through the shared surface", () => {
    expect(method("  private renderPickerDialog() {")).toContain('return this.renderPickerSurface("dialog");');
  });

  it("writes the dialog element in one place only, with the class showModal finds", () => {
    expect(SOURCE.match(/<dialog class=\$\{cls\}/g)).toHaveLength(1);
    expect(SOURCE).not.toMatch(/<dialog class="pk-dialog/);
    const surface = method("  private renderPickerSurface(form: PickerForm) {");
    expect(surface).toContain("pickerSurfaceClass(form, this.pickerBare)");
    expect(surface).toContain("@close=${() => this.pickerClosed()}");
    expect(surface).toContain("@cancel=${this.pickerCancel}");
    expect(surface).toContain("@click=${this.pickerBackdrop}");
  });

  it("leaves the dialog's title and Close out of the page, and gives the page its Escape", () => {
    const surface = method("  private renderPickerSurface(form: PickerForm) {");
    expect(surface).toContain("${page ? nothing : html`<h2>Your complications");
    expect(surface).toContain('${page ? nothing : html`<button class="icon" title="Close"');
    expect(surface).toContain("@keydown=${this.pickerPageKey}");
    expect(surface).toContain("this.renderPickerFoot(page)");
  });

  it("closes the Devices menu before picking on the page's Escape", () => {
    const key = field("pickerPageKey");
    expect(key).toContain("listPageEscape(");
    expect(key.indexOf("this.closePickerDup()")).toBeLessThan(key.indexOf("this.setPickerSelecting(false)"));
  });

  it("keys the Shape view's grid on the shared class, not on the dialog", () => {
    expect(SOURCE).not.toContain(".pk-dialog.bare");
    expect(SOURCE.match(/\.pk-surface\.bare /g)?.length).toBeGreaterThanOrEqual(10);
    // The dialog's own frame and its narrow size stay the dialog's.
    expect(SOURCE).toContain("dialog.pk-dialog {");
    expect(SOURCE).toContain("dialog.pk-dialog { width: calc(100vw - 16px)");
  });

  it("draws the page surface only from the list page", () => {
    expect(SOURCE.match(/this\.renderPickerSurface\("page"\)/g)).toHaveLength(1);
    expect(method("  private renderListPage() {")).toContain('this.renderPickerSurface("page")');
  });
});

describe("the dialog and the page are never on screen together", () => {
  it("draws Browse, and the dialog inside it, only while a design is open", () => {
    const bar = method("  private renderTopBar(");
    expect(bar).toContain("const open = this.designOpen;");
    expect(bar).toContain("${open ? this.renderPicker() : nothing}");
    expect(SOURCE.match(/this\.renderPicker\(\)/g)).toHaveLength(1);
    expect(method("  private renderPicker() {")).toContain("${this.pickerOpen ? this.renderPickerDialog() : nothing}");
  });

  it("draws the list page only where the stage has nothing open", () => {
    const canvas = method("  private renderCanvas() {");
    expect(canvas).toContain("if (!cfg) return this.renderListPage();");
    expect(canvas).not.toContain("renderStartPage");
  });

  it("shuts the dialog in state when its tab goes, and hands it to the page when its design goes", () => {
    const will = method("  protected override willUpdate(changed");
    expect(will).toContain("listPageShown(this.route, this.designOpen)");
    expect(will).toContain("if (now && !was) this.enterListPage();");
    expect(will).toContain("else if (was && !now) this.leaveListPage();");
    expect(will).toContain('if (this.pickerOpen && tabOfRoute(this.route) !== "complications") this.pickerClosed();');
    const enter = method("  private enterListPage() {");
    expect(enter).toContain("if (this.pickerOpen) this.pickerOpen = false;");
  });
});

describe("closing first only when there is a dialog", () => {
  it("opens a card without touching a dialog that is not there", () => {
    expect(method("  private async openFromPicker(")).toContain("if (this.pickerOpen) this.togglePicker(false);");
    expect(method("  private newFromPicker() {")).toContain("if (this.pickerOpen) this.togglePicker(false);");
    expect(method("  private importFromPicker() {")).toContain("if (this.pickerOpen) this.closePicker();");
    expect(method("  private duplicateAsFromCard(")).toContain("if (this.pickerOpen) this.closePicker();");
  });
});

describe("the remembered device tab", () => {
  it("lets Browse all show All without wiping what the page remembers", () => {
    const browse = method("  private browseAll() {");
    expect(browse).toContain("browseAllTab(this.tabMemory)");
    expect(browse).not.toContain("pickPickerTab");
    expect(browse).not.toContain("saveListView");
  });

  it("saves the page's tab, not the one Browse all is showing", () => {
    expect(method("  private saveListView() {")).toContain("pickerDevice: this.listDevice");
    expect(method("  private loadListView() {")).toContain("this.pickerDevice = this.listDevice = saved.pickerDevice");
  });

  it("brings the page's tab back when the dialog shuts and when the page is entered", () => {
    expect(method("  private pickerClosed() {")).toContain("restoreTab(this.tabMemory)");
    expect(method("  private enterListPage() {")).toContain("restoreTab(this.tabMemory)");
  });

  it("remembers a tab picked by hand", () => {
    expect(method("  private pickPickerTab(key: string) {")).toContain("pickTab(this.tabMemory, key)");
  });
});

describe("entering and leaving the page", () => {
  it("reads the other devices' lists again on the way in, unless a device switch is reading them", () => {
    const enter = method("  private enterListPage() {");
    expect(enter).toContain("this.startListsAsked = true;");
    expect(enter).toContain("if (!this.ownerBusy) void this.loadOtherLists();");
  });

  it("lets go of the Devices menu, its listener and picking on the way out", () => {
    expect(method("  private leaveListPage() {")).toContain("this.pickerForget();");
    const forget = method("  private pickerForget() {");
    expect(forget).toContain("this.closePickerDup();");
    expect(forget).toContain("this.setPickerSelecting(false)");
  });

  it("notes which edited device the other lists were read for", () => {
    const load = method("  private async loadOtherLists() {");
    expect(load.indexOf("this.otherListsOwner = ownerId;")).toBeGreaterThan(load.indexOf("run !== this.otherListsRun"));
  });
});

describe("the way back from the editor", () => {
  it("asks before unsaved work goes, then closes the design", () => {
    const back = method("  private async closeToList() {");
    expect(back).toContain("await this.draftSave;");
    expect(back).toContain("if (this.draft?.dirty && !this.confirmDiscard()) return;");
    expect(back.indexOf("confirmDiscard")).toBeLessThan(back.indexOf("this.selectNone()"));
  });

  it("leads the editor's bar", () => {
    const bar = method("  private renderTopBar(");
    expect(bar.indexOf("this.renderBackToList()")).toBeLessThan(bar.indexOf("this.renderPicker()"));
    expect(method("  private renderBackToList() {")).toContain("this.closeToList()");
  });

  it("counts a record that could not be opened as open, so its bar still has the way back", () => {
    const open = SOURCE.slice(SOURCE.indexOf("private get designOpen()"), SOURCE.indexOf("private get designOpen()") + 200);
    expect(open).toContain("this.draft !== undefined || this.selectedId !== undefined");
  });
});

describe("the list page", () => {
  it("keeps the start page only as the empty state", () => {
    const page = method("  private renderListPage() {");
    expect(page).toContain('if (state === "empty") return this.renderStartPage();');
    expect(SOURCE.match(/this\.renderStartPage\(\)/g)).toHaveLength(1);
    const start = method("  private renderStartPage() {");
    expect(start).not.toContain("browseAll");
    expect(start).not.toContain("startRecent");
  });

  it("puts Gallery, Import and New at the head, for everyone", () => {
    const page = method("  private renderListPage() {");
    expect(page).toContain("href=${GALLERY_PAGE}");
    expect(page).toContain('<button class="cl-btn cl-import"');
    expect(page).toContain('<button class="cl-btn cl-new"');
    expect(page).not.toContain("admin");
    expect(page).toContain("this.openNewDialog()");
    expect(page).toContain("this.openImportDialog()");
  });

  it("leaves New and Import out of the page's foot, which the head has", () => {
    const foot = method("  private renderPickerFoot(page = false) {");
    expect(foot).toContain("${page ? nothing : html`<button type=\"button\" class=\"new-btn pk-import\"");
    expect(foot).toContain("const said = page ? undefined");
  });
});
