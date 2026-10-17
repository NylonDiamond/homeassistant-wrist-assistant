// The Watch app's one header row (`watch-row.ts`) holds, at its right, the
// save controls of the screen on show: where its copy has got to, its ···
// menu and Save. A screen's help is the panel's Help sheet, which names the
// screen and links its guide (`help-sheet.ts`), so the bar has no ? of its
// own. Each screen is an editor element of its own that
// keeps its drafts and saves them itself, so the controls stay the editor's:
// the panel only hands it an empty box in the header (`barHost`), and the
// editor draws its bar there instead of on top of itself.
//
// The editor draws into a box of its own that it appends to the host, with a
// shadow root that adopts the editor's own sheet, so every rule its bar was
// styled with still applies and its handlers still run as the editor's
// (`render(..., { host })`). A press inside it is still a press inside the
// editor's menus: `composedPath()` walks into an open shadow root, so the
// editors' outside-click checks by class keep working. Taken out of the tree,
// the editor clears and removes its box (`clear`).
//
// Outside the panel (the dev harness, a test) no host is given and the
// editor draws its bar inline as before.

import { adoptStyles, css, html, nothing, render, type LitElement, type TemplateResult } from "lit";
import { NOTHING_TO_SAVE_TEXT, type SettingDevice, newDeviceText } from "./watch-settings.js";

/** The header's word for a new watch's screen, in orange, with the whole
 * `NEW_WATCH_TEXT` as its tooltip. It stands in for the banner the screens
 * drew over themselves. */
export const NEW_WATCH_STATUS = "New watch, not saved yet";
/** The same for an iPhone's own records. */
export const NEW_IPHONE_STATUS = "New iPhone, not saved yet";
/** The same on a phone, where the header's bar is narrow. */
export const NEW_WATCH_SHORT = "Not saved yet";

/** One editor's bar in the header. */
export class HeadBar {
  private box: HTMLElement | undefined;

  constructor(private readonly owner: LitElement) {}

  /** The root the bar is drawn in while it is in the header. */
  get root(): ShadowRoot | undefined {
    return this.box?.shadowRoot ?? undefined;
  }

  /** Draw `bar` into `host`, or take the bar away when there is no host. */
  draw(host: HTMLElement | undefined, bar: () => TemplateResult): void {
    if (host === undefined) {
      this.clear();
      return;
    }
    let box = this.box;
    if (box === undefined) {
      box = document.createElement("div");
      box.className = "wa-head-bar";
      const root = box.attachShadow({ mode: "open" });
      adoptStyles(root, (this.owner.constructor as typeof LitElement).elementStyles);
      this.box = box;
    }
    if (box.parentNode !== host) host.append(box);
    render(bar(), box.shadowRoot!, { host: this.owner });
  }

  /** Take the bar out of the header. */
  clear(): void {
    const box = this.box;
    if (box === undefined) return;
    this.box = undefined;
    if (box.shadowRoot) render(nothing, box.shadowRoot, { host: this.owner });
    box.remove();
  }

  /** Whether an event's path runs through the bar in the header, so an
   * editor's keys (⌘S, Escape on its ··· menu) still answer while the focus
   * is on one of its buttons there, outside the editor itself. */
  holds(path: readonly EventTarget[]): boolean {
    const root = this.root;
    return root !== undefined && path.includes(root);
  }

  /** Where to look for the bar's own elements: the header box while the bar
   * is there, else the editor's own root. */
  query<E extends Element = HTMLElement>(fallback: ParentNode, selector: string): E | null {
    return (this.root ?? fallback).querySelector<E>(selector);
  }
}

export interface HeadStatusInput {
  /** A new watch's ready screen: nothing of this kind saved yet. */
  newWatch: boolean;
  dirty: boolean;
  /** How many changes are unsaved, when the screen counts them: "3 changes"
   * rather than "Unsaved changes". */
  changes?: number;
  /** When the copy was saved (`renderConfigSaved`), shown while there is
   * nothing to save. */
  saved?: TemplateResult | string | typeof nothing;
  /** The device on the screen; a watch when absent. An iPhone's ready
   * screen says "New iPhone". */
  device?: SettingDevice;
}

/**
 * What the header says beside Save: "New watch, not saved yet" in orange on
 * a new watch, "Unsaved changes" in orange while there are edits, else when
 * the copy was saved, muted. A dot leads each, in the same color.
 */
export function renderHeadStatus(input: HeadStatusInput): TemplateResult | typeof nothing {
  if (input.newWatch) {
    const device = input.device ?? "watch";
    const text = newDeviceText(device);
    const title = input.dirty ? text : `${text} ${NOTHING_TO_SAVE_TEXT}`;
    // A phone's bar is narrow: there the line is the short one, so it keeps
    // to one line beside its dot. The tooltip says the whole of it.
    return html`<span class="tb-status new" role="status" title=${title}><i class="tb-status-dot" aria-hidden="true"></i><span class="tb-long">${device === "iphone" ? NEW_IPHONE_STATUS : NEW_WATCH_STATUS}</span><span class="tb-short" aria-hidden="true">${NEW_WATCH_SHORT}</span></span>`;
  }
  if (input.dirty) {
    const n = input.changes;
    const words = n === undefined || n <= 0 ? "Unsaved changes" : `${n} ${n === 1 ? "change" : "changes"}`;
    return html`<span class="tb-status unsaved" role="status" title="Not saved yet"><i class="tb-status-dot" aria-hidden="true"></i><span>${words}</span></span>`;
  }
  const saved = input.saved;
  if (saved === undefined || saved === nothing || saved === "") return nothing;
  return html`<span class="tb-status" role="status">${saved}</span>`;
}

/**
 * The bar's look in the header: no ground of its own, one line, every button
 * 32px tall with a one pixel outline, and Save neutral with a green outline
 * while there is something to save. Added after each editor's own rules, and
 * to the panel's sheet for the Settings page's bar, which the panel draws.
 */
export const headBarStyles = css`
  .wa-bar.in-head {
    display: flex; align-items: center; justify-content: flex-end; flex-wrap: nowrap; gap: 8px;
    min-height: 0; padding: 0; margin: 0; border: 0; background: none; position: static; z-index: auto;
  }
  .wa-bar.in-head > .spacer { display: none; }
  .wa-bar.in-head > * { margin-block: 0; }
  .wa-bar.in-head :is(button.tb-btn, button.help, button.cv-act, button.cm-btn, button.primary.save, button.primary) {
    height: 32px; min-height: 32px; box-sizing: border-box; border-radius: 9px; flex: none;
    font: inherit; font-size: 12.5px; font-weight: 500; cursor: pointer;
    border: 1px solid var(--wa-line-strong); background: var(--wa-card); color: var(--wa-ink); box-shadow: none;
  }
  .wa-bar.in-head :is(button.tb-btn, button.cm-btn) { padding: 0 11px; }
  .wa-bar.in-head :is(button.help, button.tb-btn.icon, button.cv-act.icon, button.tb-btn.tb-more) {
    width: 32px; padding: 0; display: inline-grid; place-items: center;
  }
  .wa-bar.in-head button.tb-btn.tb-more { letter-spacing: .04em; }
  .wa-bar.in-head :is(button.tb-btn, button.help, button.cv-act, button.cm-btn, button.primary):hover:not(:disabled) {
    background: var(--wa-hover); border-color: var(--wa-line-strong);
  }
  .wa-bar.in-head :is(button.tb-btn, button.help, button.cv-act, button.cm-btn, button.primary):focus-visible {
    outline: none; box-shadow: var(--wa-ring);
  }
  .wa-bar.in-head :is(button.tb-btn, button.cv-act, button.cm-btn):disabled { opacity: .45; cursor: default; }
  .wa-bar.in-head button.primary.save { padding: 0 16px; color: var(--wa-faint); opacity: 1; }
  .wa-bar.in-head button.primary.save:disabled { cursor: default; }
  .wa-bar.in-head button.primary.save.dirty:not(:disabled) {
    color: var(--wa-ink); background: var(--wa-card); border-color: var(--wa-hue-green); box-shadow: none;
  }
  .wa-bar.in-head button.primary.save.dirty:not(:disabled):hover { background: var(--wa-hover); }
  .wa-bar.in-head button.primary.save.dirty:not(:disabled):focus-visible { box-shadow: var(--wa-ring); }
  .wa-bar.in-head .tb-sync { height: 32px; font-size: 12px; font-weight: 500; max-width: none; }
  .wa-bar.in-head .tb-status {
    display: inline-flex; align-items: center; gap: 7px; min-width: 0;
    font-size: 12px; line-height: 1.3; color: var(--wa-muted); overflow-wrap: anywhere;
  }
  .wa-bar.in-head .tb-status .cf-saved { margin: 0; font-size: inherit; color: inherit; }
  .wa-bar.in-head .tb-status-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: var(--wa-muted); }
  .wa-bar.in-head .tb-status:is(.new, .unsaved) { color: var(--wa-hue-orange); }
  .wa-bar.in-head .tb-status:is(.new, .unsaved) .tb-status-dot { background: var(--wa-hue-orange); }
  .wa-bar.in-head .tb-status > .tb-short { display: none; }
  .wa-bar.in-head .tb-note { font-size: 12px; color: var(--wa-muted); min-width: 0; overflow-wrap: anywhere; }
  .wa-bar.in-head .pop-menu { z-index: 60; }
  /* A phone: the bar sits beside the watch on the first line and may take
     two lines of its own, the buttons on top and the words under them. */
  @media (max-width: 640px) {
    .wa-bar.in-head { flex-wrap: wrap; gap: 4px 6px; }
    .wa-bar.in-head::before { content: ""; order: 1; flex: 0 0 100%; height: 0; }
    .wa-bar.in-head > :is(.tb-status, .tb-sync, .tb-note) { order: 2; flex: 0 1 auto; text-align: right; }
    .wa-bar.in-head .tb-sync { height: auto; }
    .wa-bar.in-head .tb-status { white-space: nowrap; }
    .wa-bar.in-head .tb-status > .tb-long { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
    .wa-bar.in-head .tb-status > .tb-short { display: inline; }
  }
`;
