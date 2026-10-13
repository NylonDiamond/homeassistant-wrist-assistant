// The Help sheet: what the Help button at the right of the tab bar opens, on
// every tab. A side sheet from the right with the getting started steps (the
// same three as Home's welcome card, from `getting-started.ts`), a word about
// the screen in view, and the guides. Its foot names the integration's
// version and can bring the welcome card back.
//
// The complication editor keeps its own, longer Help dialog (Basics, Pages,
// Keys and mouse, Syncing and sharing) behind the ? in its bar. This sheet
// leaves it where it is and, on the Complications tab, links to it.
//
// A native modal dialog, so the backdrop, Escape and keeping focus inside
// come with it. The panel opens it, and puts focus back on the Help button
// when it closes (`onClosed`).

import { css, html, nothing, type TemplateResult } from "lit";
import {
  APP_STORE_URL,
  DOCS_URL,
  type GettingStarted,
  NEW_PAGE_LABEL,
  OPEN_APP_STORE_LABEL,
  PAIR_DEVICE_LABEL,
  PAIR_FIRST_TEXT,
  REPORT_PROBLEM_URL,
  SETUP_GUIDE_URL,
  type StepId,
  TROUBLESHOOTING_URL,
  doneWords,
  helpStepWords,
} from "./getting-started.js";
import { type WatchScreen, tabOfRoute, watchScreenOf } from "./shell.js";
import { uiIcon } from "./ui-icons.js";
import type { PanelRoute } from "./watch-pages/hook.js";

/** What the sheet says about the screen in view. */
export interface HelpScreen {
  name: string;
  /** One or two plain sentences. */
  text: string[];
  /** A page of the docs about it, when there is one. */
  more?: string;
}

const HOME_TEXT = [
  "Home lists every watch and iPhone, who it belongs to, and whether it has your latest changes.",
  "Waiting means the device gets them the next time Wrist Assistant opens on it.",
];

const COMPLICATIONS_TEXT = [
  "Complications put live home state on the watch face, and widgets on the iPhone.",
  "Pick one in the list to change it, or make a new one.",
];

/** A watch screen's blurb as a sentence, then whose it is. The blurbs are
 * shell.ts's, which Home and the watch row show too, so the three never say
 * different things about one screen. */
function watchScreenText(screen: WatchScreen): string[] {
  const blurb = screen.blurb.trim();
  const sentence = /[.!?]$/.test(blurb) ? blurb : `${blurb}.`;
  return [sentence, screen.shared === true ? "Every watch in this home shares it." : "It is for the watch picked at the top."];
}

/** The screen a route shows, as the sheet names and explains it. */
export function helpScreen(route: PanelRoute | undefined): HelpScreen {
  const screen = watchScreenOf(route);
  if (screen !== undefined) return { name: screen.label, text: watchScreenText(screen) };
  if (tabOfRoute(route) === "complications") return { name: "Complications", text: COMPLICATIONS_TEXT };
  return { name: "Home", text: HOME_TEXT, more: DOCS_URL };
}

export interface HelpSheetInput {
  gs: GettingStarted;
  route: PanelRoute | undefined;
  /** The integration's version, from the panel's config. */
  version?: string;
  /** The dialog closed itself: Escape, the X, or a click on the backdrop. */
  onClosed: () => void;
  onPair: () => void;
  onNewPage: (watch: string) => void;
  onShowWelcome: () => void;
  /** Open the complication editor's own Help. Given only on the
   * Complications tab, where that dialog lives. */
  onEditorHelp?: () => void;
}

const close = (e: Event) => (e.currentTarget as HTMLElement).closest("dialog")?.close();

export function renderHelpSheet(input: HelpSheetInput): TemplateResult {
  const { gs } = input;
  const screen = helpScreen(input.route);
  const action = (id: StepId): TemplateResult | typeof nothing => {
    if (gs.next !== id) return nothing;
    if (id === "app") return html`<a class="hs-act" href=${APP_STORE_URL} target="_blank" rel="noopener noreferrer">${OPEN_APP_STORE_LABEL}</a>`;
    if (id === "pair") return html`<button type="button" class="hs-act" @click=${input.onPair}>${PAIR_DEVICE_LABEL}</button>`;
    const watch = gs.watch;
    return watch === undefined
      ? html`<span class="hs-why">${PAIR_FIRST_TEXT}</span>`
      : html`<button type="button" class="hs-act" @click=${() => input.onNewPage(watch)}>${NEW_PAGE_LABEL}</button>`;
  };
  const step = (id: StepId) => {
    const done = gs.steps.find((s) => s.id === id)?.done === true;
    const words = helpStepWords(id, gs);
    return html`<li class="hs-step">
      <span class="hs-mark ${done ? "ok" : ""}">${done ? uiIcon("check") : nothing}<span class="hs-hidden">${done ? "Done: " : "To do: "}</span></span>
      <span class="hs-step-t"><b>${words.title}</b><span>${words.text}</span></span>
      ${action(id)}
    </li>`;
  };
  const guide = (label: string, href: string, where: string) => html`<a class="hs-guide" href=${href} target="_blank" rel="noopener noreferrer">
      <span class="hs-guide-l">${label}</span><span class="hs-guide-w">${where}</span>${uiIcon("arrow")}</a>`;
  return html`<dialog class="wa-help-sheet" aria-labelledby="hs-title"
      @close=${input.onClosed}
      @click=${(e: MouseEvent) => { if (e.target === e.currentTarget) (e.currentTarget as HTMLDialogElement).close(); }}>
    <div class="hs-wrap">
      <div class="hs-head">
        <h2 id="hs-title">Help</h2>
        <button type="button" class="icon hs-x" title="Close (Escape)" aria-label="Close" @click=${close}>${uiIcon("close")}</button>
      </div>
      <div class="hs-body">
        <section class="hs-sec">
          <div class="hs-sec-head">
            <h3 class="hs-title">Getting started</h3>
            <span class="hs-n">${doneWords(gs.done)}</span>
          </div>
          <div class="hs-bar" role="progressbar" aria-label="Getting started" aria-valuemin="0" aria-valuemax="3" aria-valuenow=${gs.done}>
            <i style=${`width:${Math.round((gs.done / 3) * 100)}%`}></i>
          </div>
          <ol class="hs-steps">${step("app")}${step("pair")}${step("page")}</ol>
        </section>
        <section class="hs-sec">
          <h3 class="hs-title">On this screen: ${screen.name}</h3>
          <p class="hs-text">${screen.text.join(" ")}</p>
          ${screen.more === undefined ? nothing
            : html`<a class="hs-more" href=${screen.more} target="_blank" rel="noopener noreferrer">More about ${screen.name}</a>`}
          ${input.onEditorHelp === undefined ? nothing
            : html`<button type="button" class="hs-more" @click=${input.onEditorHelp}>How the editor works</button>`}
        </section>
        <section class="hs-sec">
          <h3 class="hs-title">Guides</h3>
          <div class="hs-guides">
            ${guide("Setup guide", SETUP_GUIDE_URL, "docs")}
            ${guide("Something is not working", TROUBLESHOOTING_URL, "docs")}
            ${guide("Report a problem", REPORT_PROBLEM_URL, "GitHub")}
          </div>
        </section>
      </div>
      <div class="hs-foot">
        <span class="hs-version">Wrist Assistant${input.version ? ` ${input.version}` : ""}</span>
        <button type="button" class="hs-more" @click=${input.onShowWelcome}>Show the welcome card again</button>
      </div>
    </div>
  </dialog>`;
}

/**
 * The sheet's look, added to the panel's sheet. Graphite, a hairline down
 * its left edge, full height at the right; the whole screen wide on a phone.
 * Widths are in % of the screen, not vw, which counts a scrollbar
 * and pushed the sheet's left edge off a narrow screen.
 * Neutral throughout: green only for the progress bar and the ticks, blue
 * only for links. Titles are small capitals like Home's.
 */
export const helpSheetStyles = css`
  dialog.wa-help-sheet {
    position: fixed; inset: 0 0 0 auto; margin: 0; box-sizing: border-box;
    width: min(520px, 100%); max-width: 100%; height: 100dvh; max-height: 100dvh; padding: 0;
    border: 0; border-left: 1px solid var(--wa-line-strong); border-radius: 0;
    background: var(--wa-card); color: var(--wa-ink); box-shadow: var(--wa-shadow-pop);
  }
  dialog.wa-help-sheet[open] { animation: hs-in .18s ease-out; }
  dialog.wa-help-sheet::backdrop { background: rgba(0, 0, 0, .45); }
  @keyframes hs-in { from { transform: translateX(24px); opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { dialog.wa-help-sheet[open] { animation: none; } }
  .hs-wrap { height: 100%; display: flex; flex-direction: column; min-width: 0; }
  .hs-head { flex: none; display: flex; align-items: center; gap: 12px; padding: 12px 12px 12px 20px; border-bottom: 1px solid var(--wa-line); }
  .hs-head h2 { flex: 1; margin: 0; font-size: 16px; font-weight: 500; }
  .hs-head button.hs-x { width: 30px; height: 30px; }
  .hs-head button.hs-x svg.ui-icon { width: 16px; height: 16px; }
  .hs-body { flex: 1 1 auto; min-height: 0; overflow: auto; padding: 20px; display: flex; flex-direction: column; gap: 24px; }
  .hs-sec { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
  .hs-sec-head { display: flex; align-items: center; gap: 10px; }
  .hs-sec-head .hs-title { flex: 1; }
  .hs-title { margin: 0; font-size: 11px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: var(--wa-ink); overflow-wrap: anywhere; }
  .hs-n { font-size: 12px; color: var(--wa-muted); font-variant-numeric: tabular-nums; }
  .hs-bar { height: 4px; border-radius: 2px; background: var(--wa-line-strong); overflow: hidden; }
  .hs-bar i { display: block; height: 100%; border-radius: 2px; background: var(--wa-green); }
  .hs-steps { margin: 0; padding: 0; list-style: none; }
  .hs-step { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--wa-line); font-size: 13px; }
  .hs-mark {
    width: 20px; height: 20px; flex: none; box-sizing: border-box; border-radius: 50%; display: grid; place-items: center;
    border: 1px solid var(--wa-line-strong); color: var(--wa-green);
  }
  .hs-mark.ok { border-color: var(--wa-green); }
  .hs-mark svg.ui-icon { width: 11px; height: 11px; stroke-width: 2.6; }
  .hs-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  .hs-step-t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .hs-step-t b { font-weight: 500; overflow-wrap: anywhere; }
  .hs-step-t span { color: var(--wa-muted); overflow-wrap: anywhere; }
  a.hs-act, button.hs-act, a.hs-more, button.hs-more {
    font: inherit; font-size: 13px; padding: 0; border: 0; background: none; cursor: pointer; text-align: left;
    color: var(--wa-hue-blue); text-decoration: none;
  }
  a.hs-act, button.hs-act { flex: none; white-space: nowrap; }
  a.hs-act:hover, button.hs-act:hover, a.hs-more:hover, button.hs-more:hover { text-decoration: underline; }
  a.hs-act:focus-visible, button.hs-act:focus-visible, a.hs-more:focus-visible, button.hs-more:focus-visible {
    outline: none; border-radius: 3px; box-shadow: var(--wa-ring);
  }
  .hs-why { flex: none; font-size: 12px; color: var(--wa-muted); }
  .hs-text { margin: 0; font-size: 13px; line-height: 1.55; color: var(--wa-label); overflow-wrap: anywhere; }
  .hs-sec > .hs-more { align-self: flex-start; }
  .hs-guides { display: flex; flex-direction: column; gap: 8px; }
  a.hs-guide {
    display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 8px; text-decoration: none; font-size: 13px;
    color: var(--wa-ink); border: 1px solid var(--wa-line-strong); background: color-mix(in srgb, var(--wa-ink) 3%, var(--wa-card));
  }
  a.hs-guide:hover { background: var(--wa-hover); }
  a.hs-guide:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .hs-guide-l { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  .hs-guide-w { flex: none; color: var(--wa-muted); }
  a.hs-guide svg.ui-icon { width: 14px; height: 14px; flex: none; color: var(--wa-muted); }
  .hs-foot {
    flex: none; display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px;
    padding: 14px 20px; border-top: 1px solid var(--wa-line); font-size: 12px; color: var(--wa-muted);
  }
  .hs-version { flex: 1 1 auto; min-width: 0; }
  .hs-foot button.hs-more { font-size: 12px; }
  @media (max-width: 640px) {
    dialog.wa-help-sheet { border-left: 0; }
    .hs-body { padding: 16px; }
    .hs-head { padding-left: 16px; }
    .hs-foot { padding: 12px 16px; }
  }
`;
