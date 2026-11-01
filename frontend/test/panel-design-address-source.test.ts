// The panel's handling of a design's address, its device queue and its board
// Undo, read from its source, since no test mounts the panel. The rules behind
// them are tested in list-page, complication-cards and delete-later.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { boardStackStyles } from "../src/library/board.js";
import { topBarStyles } from "../src/editor-chrome.js";

const SOURCE = readFileSync(join(__dirname, "..", "src", "panel.ts"), "utf8");

function method(signature: string): string {
  const at = SOURCE.indexOf(signature);
  if (at < 0) throw new Error(`no ${signature}`);
  return SOURCE.slice(at, SOURCE.indexOf("\n  }\n", at));
}

describe("Back from a design's address", () => {
  it("shuts what stood over the design, after the question and before it goes", () => {
    const close = method("  private async closeFromAddress(");
    expect(close.indexOf("confirmDiscard()")).toBeLessThan(close.indexOf("complicationsSurfacesGone()"));
    expect(close.indexOf("complicationsSurfacesGone()")).toBeLessThan(close.indexOf("this.dropDesign()"));
    expect(close).toContain("this.listReturn = undefined;");
  });

  it("shuts them moving between designs too, only when the move happened", () => {
    const open = method("  private async openDesignAddress(");
    expect(open).toContain("if (this.selectedId !== want.id) this.goTo(keep, true);\n    else this.complicationsSurfacesGone();");
    expect(open).toMatch(/this\.goTo\(keep, true\);\n\s+\} else \{\n\s+this\.complicationsSurfacesGone\(\);/);
  });

  it("never draws a shut dialog in the page", () => {
    expect(SOURCE).toContain("dialog.xf:not([open]) { display: none; }");
    expect(SOURCE.indexOf("dialog.xf:not([open])")).toBeGreaterThan(SOURCE.indexOf("dialog.xf {"));
  });

  it("does not reopen a design waiting on its delete toast", () => {
    expect(method("  private async openDesignAddress(")).toContain(`laterHidden().has(laterKey("complications", want.id, want.owner))`);
    expect(SOURCE).toContain(`!laterHidden().has(laterKey("complications", restore.id, restore.owner))`);
  });
});

describe("the way back to the list", () => {
  it("forgets a focused board once a design opens straight at its own address", () => {
    const home = method("  private async openFromHome(");
    expect(home.indexOf("this.listReturn = undefined;")).toBeLessThan(home.indexOf("this.goTo(designPath("));
    expect(method("  private async openDeviceList(")).toContain("this.listReturn = undefined;");
  });
});

describe("the device ticks that wait for Save", () => {
  const flush = method("  private flushDeviceQueue()");

  it("holds after a failure rather than running the rest on the next draw", () => {
    expect(flush).toContain("this.queueRunning || this.deviceQueueHeld) return;");
    expect(flush).toContain("this.deviceQueue = queueAfterFailure(todo, i);");
    expect(flush).toContain("this.deviceQueueHeld = true;");
  });

  it("counts a failed removal, which only sets copyStatus", () => {
    expect(flush).toContain("(this.copyStatus !== undefined && this.copyStatus !== said)");
  });

  it("lets go on the next Save, and when the design closes", () => {
    const save = method("  private async save(asNew = false)");
    expect(save.indexOf("this.deviceQueueHeld = false;")).toBeLessThan(save.indexOf("this.flushDeviceQueue();"));
    expect(method("  private clearDraft()")).toContain("this.deviceQueueHeld = false;");
  });

  it("offers Save with nothing else to save while ticks are held", () => {
    expect(SOURCE).toContain("(!dirty && !this.deviceQueueHeld)");
  });
});

describe("a board tick's Undo", () => {
  it("takes off a link the tick made, only when nothing has moved since", () => {
    const drop = method("  private async dropTickLink(");
    expect(drop).toContain("now.revision !== linked.revision");
    expect(drop).toContain("if (open && this.draft?.dirty) return;");
    expect(drop).toContain("saveRecord(this.hass, linked.ownerId, linked.document, now.revision)");
    expect(method("  private async undoCompPutOn(")).toContain("await this.dropTickLink(linked, placedId);");
  });

  it("reads the lists first on an untick's Undo, and says when the shelf's copy stays", () => {
    const off = method("  private async undoCompTakeOff(");
    expect(off.indexOf("await this.loadOtherLists();")).toBeLessThan(off.indexOf("reviveRecord"));
    expect(off).toContain("shelfCopyStays = gone?.ok !== true;");
    expect(off).toContain("but the copy under ${UNASSIGNED_LABEL} stays.");
  });
});

describe("the Overview", () => {
  it("draws its plain tables in a board's frame, under the words for what a head does now", () => {
    expect(method("  private renderHomeAllTable(")).toContain("renderPlainBoard({");
    expect(SOURCE).toContain("Press Focus on a device to change its order.");
    expect(SOURCE).not.toContain("Click a device's name to change its order.");
    expect(boardStackStyles.cssText).toContain(".bd-fixed .bd-frame.bd-frame");
  });
});

describe("a dialog drawn in a stacked bar", () => {
  it("keeps the margin that centres it", () => {
    expect(topBarStyles.cssText).toContain("header.stacked > :not(dialog), .wa-bar.stacked > :not(dialog) { margin-block: 4px; }");
  });
});

describe("a menu inside a dialog", () => {
  it("stays inside the dialog, which cuts off what passes its edge", () => {
    const keep = method("  private keepMenusOnScreen()");
    expect(keep).toContain(`menu.closest("dialog")?.getBoundingClientRect()`);
    expect(keep).toContain("menuShift(r.left - box.left, r.right - box.left, box.width)");
  });
});
