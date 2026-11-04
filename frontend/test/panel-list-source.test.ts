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
    // Eight since a device lost its box: the Shape view's tighter padding
    // inside it went with it.
    expect(SOURCE.match(/\.pk-surface\.bare /g)?.length).toBeGreaterThanOrEqual(8);
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
  it("draws the editor's bar, and the Browse dialog in it, only while a design is open", () => {
    const bar = method("  private renderTopBar(");
    expect(bar).toContain("const open = this.designOpen;");
    expect(bar).toContain("if (!open) return nothing;");
    expect(bar).toContain("${this.pickerOpen ? this.renderPickerDialog() : nothing}");
    expect(SOURCE.match(/this\.renderPickerDialog\(\)/g)).toHaveLength(1);
    expect(method("  private renderTopMenu() {")).toContain('"Browse complications"');
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
    expect(bar.indexOf("this.renderBackToList()")).toBeLessThan(bar.indexOf("this.renderCrumb("));
    expect(method("  private renderBackToList() {")).toContain("this.closeToList()");
  });

  it("gives an open design its own address, and takes the address back with it", () => {
    const will = method("  protected override willUpdate(changed");
    expect(will).toContain("this.syncDesignAddress(changed);");
    expect(will.indexOf("this.syncDesignAddress(changed);")).toBeLessThan(will.indexOf("listPageShown(this.route, this.designOpen)"));
    // A design's address at first draw opens that design.
    expect(will).toContain("if (named !== undefined) this.restoreOpen = named;");
    expect(method("  private selectNone() {")).toContain("this.leaveDesignAddress();");
    // A screen being left, or a device list being opened, is its own next step.
    expect(SOURCE).toContain('case "complications": return { dirty: this.draft?.dirty === true, drop: () => this.dropDesign() };');
    // Delete closes through the same door, with its way back to the list.
    expect(method("  private deleteRecordsLater(")).toContain("this.selectNone()");
  });

  it("puts the list back where it was left: tab, filter and scroll", () => {
    expect(method("  private async openFromPicker(")).toContain("this.listScroll = page.scrollTop;");
    expect(method("  private enterListPage() {")).toContain("this.listScrollDue = this.listScroll > 0;");
    expect(method("  protected override updated(changed")).toContain("page.scrollTop = this.listScroll;");
  });

  it("holds a device tick until Save while the draft has unsaved work", () => {
    const strip = method("  private renderCanvasDevices(");
    expect(strip).toContain("this.deviceQueue = queueDeviceTick(this.deviceQueue, ownerId, putOn, place.on);");
    expect(strip).toContain('"after Save"');
    expect(strip).toContain("deviceStripNote({ queued: queue.size, on })");
    // No toast: a device change in the editor stays quiet (mock view 2, item 12 skipped).
    expect(strip).toContain("this.addRowTo(row, place.owner, true)");
    expect(method("  private async save(asNew = false) {")).toContain("this.flushDeviceQueue();");
    expect(method("  private clearDraft() {")).toContain("this.deviceQueue = new Map()");
  });

  it("keeps the editor's bar to one filled button, the rest in ···", () => {
    const bar = method("  private renderTopBar(");
    expect(bar.indexOf("this.renderBarUndo(d)")).toBeLessThan(bar.indexOf("tb-saved"));
    expect(bar.indexOf("tb-saved")).toBeLessThan(bar.indexOf("primary save"));
    expect(bar.indexOf("primary save")).toBeLessThan(bar.indexOf("this.renderShareButton()"));
    expect(bar.indexOf("this.renderShareButton()")).toBeLessThan(bar.indexOf("this.renderTopMenu()"));
    const menu = method("  private renderTopMenu() {");
    const items = ["Browse complications", "New complication", "Import", "History", "View raw configuration", "Duplicate", "Delete design…"];
    for (const [i, item] of items.entries()) {
      expect(menu, item).toContain(`"${item}"`);
      if (i > 0) expect(menu.indexOf(`"${items[i - 1]}"`), item).toBeLessThan(menu.indexOf(`"${item}"`));
    }
    // The stage title card and the foot's links are gone.
    expect(SOURCE).not.toContain("renderCanvasHead");
    expect(SOURCE).not.toContain("renderDocActions");
    expect(SOURCE).not.toContain("renderFooter");
  });

  it("draws the stage toolbar in words", () => {
    const tools = method("  private renderStageTools(");
    expect(tools).toContain('class="stage-tools words"');
    expect(tools).toContain('<span class="word">Demo</span>');
    expect(tools).toContain('<span class="word">Layers 3D</span>');
    expect(method("  private renderSnapMenu() {")).toContain('<span class="word">Snap</span>');
  });

  it("shows the multi-select tip once, with a ? in the Layers head", () => {
    const layers = method("  private renderLayers() {");
    expect(layers).toContain("!this.layersTipSeen");
    expect(layers).toContain("Got it");
    expect(layers).toContain('this.helpTab = "keys"; this.helpOpen = true;');
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

  it("puts New, Gallery and Import at the head, for everyone", () => {
    const page = method("  private renderListPage() {");
    expect(page).toContain("href=${GALLERY_PAGE}");
    expect(page).toContain('<button class="cl-btn cl-import"');
    expect(page).toContain('<button class="cl-btn cl-new"');
    expect(page).not.toContain("admin");
    expect(page).toContain("this.openNewDialog()");
    expect(page).toContain("this.openImportDialog()");
    expect(page.indexOf("cl-new")).toBeLessThan(page.indexOf("cl-gallery"));
    expect(page.indexOf("cl-gallery")).toBeLessThan(page.indexOf("cl-import"));
  });

  it("moves Board and Cards into the card toolbar, for both views", () => {
    expect(method("  private renderListPage() {")).not.toContain("renderViewSwitch");
    expect(method("  private renderPickerSurface(")).toContain('renderViewSwitch(phoneView("complications", this.compView)');
    // The board says Board on a focused device too, so Cards is one click away.
    expect(method("  private renderCompBoard(")).toContain('renderViewSwitch("board", (v) => this.setCompView(v), "complications")');
  });

  it("says Preview, In a face and Close up", () => {
    const look = method("  private renderPickerLook() {");
    for (const word of ["Preview", "In a face", "Close up"]) expect(look, word).toContain(word);
    expect(look).not.toContain("On device");
    expect(look).not.toContain("Shape only");
  });

  it("searches by entity on both views, with the field saying so", () => {
    expect(method("  private renderPickerSurface(")).toContain("COMP_SEARCH_PLACEHOLDER");
    expect(method("  private renderCompBoard(")).toContain("placeholder=${COMP_SEARCH_PLACEHOLDER}");
    expect(method("  private pickerMatches(")).toContain("designTextMatches(this.searchTextOf(copy.item.record), query");
  });

  it("folds what is on no device, and never hides a search's hits", () => {
    const all = method("  private renderPickerAll(");
    expect(all).toContain("foldShelf(");
    expect(all).toContain("this.renderShelfRow(");
    expect(method("  private shelfShownOpen(")).toContain('query !== ""');
    const shelf = method("  private renderShelfRow(");
    expect(shelf).toContain("Select all empty");
    expect(shelf).toContain("Delete empty…");
    // Through the one delete with Undo.
    expect(method("  private deleteEmpty(")).toContain("this.deleteRecordsLater(deleteEmptyDone(rows.length), records);");
    // "All shown" picks only what a closed row leaves on screen.
    expect(method("  private renderPickerSurface(")).toContain("rows.filter((row) => !isShelvedRow(row))");
  });

  it("draws an empty design as a dashed slot, with no picture work", () => {
    const card = method("  private renderPickerCard(");
    expect(card).toContain("const blank = !open && this.recordIsEmpty(drawn);");
    expect(card).toContain("EMPTY_DESIGN_TEXT");
    // A document this panel cannot read is never offered for clearing away.
    expect(method("  private recordIsEmpty(")).toContain("empty = false;");
  });

  it("sets the hover tools in the picture's corner, off the name", () => {
    const card = method("  private renderPickerCard(");
    expect(card.indexOf('class="pk-card-pic"')).toBeLessThan(card.indexOf('class="pk-card-acts'));
    expect(SOURCE).toContain('title="Devices" aria-label=${`Devices for ${row.name}`}');
  });

  it("folds devices with nothing into +N more, Not on a device set apart", () => {
    expect(method("  private renderPickerTabs(")).toContain("renderDeviceTabs({");
    const tabs = readFileSync(join(__dirname, "..", "src", "library", "device-tabs.ts"), "utf8");
    expect(tabs).toContain("splitPickerTabs(input.tabs, current)");
    expect(tabs).toContain("+${row.more.length} more");
    expect(tabs).toContain('tabButton(row.shelf, "chip")');
  });

  it("leaves New and Import out of the page's foot, which the head has", () => {
    const foot = method("  private renderPickerFoot(page = false) {");
    expect(foot).toContain("${page ? nothing : html`<button type=\"button\" class=\"new-btn pk-import\"");
    expect(foot).toContain("const said = page ? undefined");
  });
});

// On the All tab a card is the design on every device it is on, so picking
// one card is one pick: the bar counts it once, asks before deleting it from
// every device, and runs a batch one design at a time. A device tab keeps
// counting and acting by card.
describe("the picking bar on the All tab", () => {
  it("counts and words the bar by the groups a batch runs", () => {
    const bar = method("  private renderPickerBar() {");
    expect(bar).toContain("const designs = this.pickedByDesign();");
    expect(bar).toContain("const n = (designs ?? this.pickerPicked).length;");
    expect(bar).toContain("pickBarWords(n, designs !== undefined)");
    expect(bar).toContain("${words.deleteAsk}");
    expect(bar).toContain("<span>${words.takeOff}</span>");
    expect(bar).toContain("title=${words.takeOffTitle}");
    expect(bar).not.toContain("this.pickerPicked.length");
  });

  it("groups picks by design on the All tab only, and by card otherwise", () => {
    const groups = method("  private pickedGroups(): string[][] {");
    expect(groups).toContain("return this.pickedByDesign() ?? this.pickerPicked.map((k) => [k]);");
    const designs = method("  private pickedByDesign(): string[][] | undefined {");
    expect(designs).toContain("if (this.pickerShownAt !== ALL_DEVICES) return undefined;");
    expect(designs).toContain("pickedDesigns(this.pickerRows(), this.pickerPicked,");
  });

  it("notes the tab the grid was drawn on beside the cards it drew", () => {
    const surface = method("  private renderPickerSurface(form: PickerForm) {");
    expect(surface).toContain("this.pickerShownAt = tab;");
  });

  it("runs a batch one group at a time and counts groups", () => {
    const run = method("  private async runBatch(");
    expect(run).toContain("const groups = this.pickedGroups();");
    expect(run).toContain("`${doing} ${done + 1} of ${groups.length}…`");
    expect(run).toContain("`${doing} done: ${done} of ${groups.length}.`");
  });
});
