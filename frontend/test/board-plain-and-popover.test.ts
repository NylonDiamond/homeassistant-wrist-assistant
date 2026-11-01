// Two things around the board's frame: a small table with nothing to tick is
// drawn on the board's own tracks, so the Overview's tables line up with the
// boards above them; and a popover's outside-press listener comes off the node
// it went on, even when the frame has already left the page.

import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("lit", async (original) => ({ ...await original<typeof import("lit")>(), render: () => undefined }));

import { html } from "lit";

import { WaBoardFrame, renderPlainBoard } from "../src/library/board.js";
import type { LinkDevice } from "../src/watch-pages/devices.js";
import { flat } from "./library-editor-home.js";

const WATCH: LinkDevice = { ownerId: "w1", name: "Apple Watch", kind: "watch" };
const PHONE: LinkDevice = { ownerId: "p1", name: "iPhone 17 Pro", kind: "iphone" };

describe("a plain board", () => {
  const drawn = flat(renderPlainBoard({
    label: "Shared",
    thing: "Thing",
    columns: [{ device: WATCH, color: "var(--wa-person-1)" }, { device: PHONE, color: undefined }],
    body: html`<tbody><tr class="bd-row"><th scope="row" class="bd-thing">HTTP actions</th></tr></tbody>`,
  }));

  it("sits in the frame that holds the column tracks, with a device count", () => {
    expect(drawn).toContain("wa-board-frame");
    expect(drawn).toContain("bd-frame");
    expect(drawn).toContain("--bd-n:2");
  });

  it("draws the board's heads over a table whose own heads are for a screen reader", () => {
    expect(drawn).toContain("bd-head-scroll");
    expect(drawn).toContain("bd-hthing");
    expect(drawn).toContain("Apple Watch");
    expect(drawn).toContain("iPhone 17 Pro");
    expect(drawn).toContain("bd-thead");
    expect(drawn).toContain("bd-sr");
  });

  it("has nothing to focus and no count, which a board's head has", () => {
    expect(drawn).not.toContain("bd-focus-pill");
    expect(drawn).not.toContain("bd-col-sub");
  });

  it("draws the rows it was given", () => {
    expect(drawn).toContain("HTTP actions");
  });
});

describe("a popover's outside-press listener", () => {
  afterEach(() => vi.unstubAllGlobals());

  function frameOnRoot() {
    vi.stubGlobal("window", { innerWidth: 1000, innerHeight: 800, addEventListener: () => undefined, removeEventListener: () => undefined });
    const added: unknown[] = [];
    const root = {
      addEventListener: (type: string, fn: unknown) => { if (type === "pointerdown") added.push(fn); },
      removeEventListener: (type: string, fn: unknown) => { if (type === "pointerdown") added.splice(added.indexOf(fn), 1); },
    };
    const detached = { addEventListener: () => undefined, removeEventListener: () => undefined };
    const pop = { hidden: true, style: {}, offsetWidth: 100, offsetHeight: 40 };
    const peek = { hidden: true };
    const frame = new WaBoardFrame();
    const stubbed = frame as unknown as Record<string, unknown>;
    let current: unknown = root;
    stubbed.getRootNode = () => current;
    stubbed.querySelector = (selector: string) => selector === ".bd-pop" ? pop : selector === ".bd-peek" ? peek : null;
    stubbed.removeEventListener = () => undefined;
    const anchor = {
      getBoundingClientRect: () => ({ left: 10, bottom: 20, top: 0 }),
      setAttribute: () => undefined, removeAttribute: () => undefined, closest: () => null, focus: () => undefined,
    } as unknown as HTMLElement;
    return { frame, anchor, added, leave: () => { current = detached; } };
  }

  it("comes off when the frame shuts it in place", () => {
    const { frame, anchor, added } = frameOnRoot();
    frame.openNote(anchor, "Waiting");
    expect(added).toHaveLength(1);
    frame.openNote(anchor, "Waiting");
    expect(added).toHaveLength(0);
  });

  it("comes off the root it went on when the board is removed with it open", () => {
    const { frame, anchor, added, leave } = frameOnRoot();
    frame.openNote(anchor, "Waiting");
    leave();
    frame.disconnectedCallback();
    expect(added).toHaveLength(0);
  });
});
