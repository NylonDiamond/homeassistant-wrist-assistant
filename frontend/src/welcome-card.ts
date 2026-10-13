// Home's welcome card: the three getting started steps at the top of Home,
// for a home that has not made its first page yet, and three dashed cards
// under it saying what else Wrist Assistant does. Whether it shows and which
// steps are done is `getting-started.ts`; this file only draws it, so the
// panel's `renderHome` hands it the steps and the four things it can do.

import { css, html, nothing, svg, type TemplateResult } from "lit";
import { litOutline } from "./editor-chrome.js";
import {
  APP_STORE_URL,
  CARD_STEPS,
  type GettingStarted,
  NEW_PAGE_LABEL,
  OPEN_APP_STORE_LABEL,
  PAIR_DEVICE_LABEL,
  PAIR_FIRST_TEXT,
  SETUP_GUIDE_URL,
  type StepId,
  WELCOME_FACTS,
  WELCOME_FOOT,
  WELCOME_LEAD,
  WELCOME_TITLE,
  type WelcomeMode,
  doneWords,
} from "./getting-started.js";
import { uiIcon } from "./ui-icons.js";

export interface WelcomeCardInput {
  gs: GettingStarted;
  mode: WelcomeMode;
  /** Open Home's Pair a device dialog. */
  onPair: () => void;
  /** Go to the Watch app's Pages screen on this watch. */
  onNewPage: (watch: string) => void;
  /** Open the Help sheet. */
  onHelp: () => void;
  onHide: () => void;
}

/** A shopping bag, the App Store's own sign, drawn at the panel's stroke. */
const BAG = html`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${svg`<path d="M6 8H18L17 20H7L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />`}</svg>`;

/** The card, then the three facts under it. */
export function renderWelcomeCard(input: WelcomeCardInput): TemplateResult {
  const { gs } = input;
  const done = (id: StepId) => gs.steps.find((s) => s.id === id)?.done === true;
  const step = (id: StepId, n: number, acts: TemplateResult) => {
    const next = gs.next === id;
    return html`<li class="wl-step ${next ? "next" : ""} ${done(id) ? "done" : ""}">
      <div class="wl-step-head">
        <span class="wl-num" aria-hidden="true">${done(id) ? uiIcon("check") : n}</span>
        <b>${CARD_STEPS[id].title}</b>
        ${done(id) ? html`<span class="wl-tag done">Done</span>` : next ? html`<span class="wl-tag">Next</span>` : nothing}
      </div>
      <p>${CARD_STEPS[id].text}</p>
      <div class="wl-acts">${acts}</div>
    </li>`;
  };
  const watch = gs.watch;
  // The foot's note is only true while the card follows the automatic rule:
  // shown again from Help, it stays until Hide, whatever the steps say.
  return html`<section class="wl-card" aria-labelledby="wl-title">
      <div class="wl-head">
        <span class="home-chip wl-chip" aria-hidden="true">${uiIcon("watch")}</span>
        <h2 class="home-title" id="wl-title">${WELCOME_TITLE}</h2>
        <span class="wl-n">${doneWords(gs.done)}</span>
      </div>
      <p class="wl-lead">${WELCOME_LEAD}</p>
      <ol class="wl-steps">
        ${step("app", 1, html`<a class="home-btn out" href=${APP_STORE_URL} target="_blank" rel="noopener noreferrer">${BAG}<span>${OPEN_APP_STORE_LABEL}</span></a>`)}
        ${step("pair", 2, html`<button type="button" class="home-btn ${done("pair") ? "" : "add"}" @click=${input.onPair}>${uiIcon("plus")}<span>${PAIR_DEVICE_LABEL}</span></button>`)}
        ${step("page", 3, watch === undefined
          ? html`<button type="button" class="home-btn" disabled aria-describedby="wl-page-why">${NEW_PAGE_LABEL}</button>
            <span class="wl-why" id="wl-page-why">${uiIcon("info")}${PAIR_FIRST_TEXT}</span>`
          : html`<button type="button" class="home-btn ${done("page") ? "" : "add"}" @click=${() => input.onNewPage(watch)}>${uiIcon("plus")}<span>${NEW_PAGE_LABEL}</span></button>`)}
      </ol>
      <div class="wl-foot">
        <a class="wl-link" href=${SETUP_GUIDE_URL} target="_blank" rel="noopener noreferrer">Setup guide</a>
        <button type="button" class="wl-link" @click=${input.onHelp}>What can it do?</button>
        <span class="wl-note">${input.mode === "auto" ? WELCOME_FOOT : nothing}</span>
        <button type="button" class="home-btn wl-hide" @click=${input.onHide}>Hide</button>
      </div>
    </section>
    <section class="wl-facts" aria-label="What Wrist Assistant does">
      ${WELCOME_FACTS.map((f) => html`<div class="wl-fact"><h3 class="home-title">${f.title}</h3><p>${f.text}</p></div>`)}
    </section>`;
}

/**
 * The card's look, added to the panel's sheet beside Home's. A lit green
 * outline, the green chip, and graphite step boxes; the step that is next
 * wears a green number ring and a green word, nothing filled. The steps sit
 * three across and fall to one column on a phone. Every line wraps.
 */
export const welcomeStyles = css`
  .wl-card {
    --c: var(--wa-hue-green); --lo-fill: var(--wa-card); --lo-mid: var(--wa-card-mid);
    display: flex; flex-direction: column; gap: 18px; min-width: 0; box-sizing: border-box;
    padding: 20px; border-radius: 12px;
    ${litOutline}
  }
  .wl-head { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 10px; }
  .wl-head .home-title { flex: 1 1 auto; min-width: 0; overflow-wrap: anywhere; }
  .wl-chip { --c: var(--wa-hue-green); }
  .wl-n { font-size: 12px; color: var(--wa-muted); font-variant-numeric: tabular-nums; }
  .wl-lead { margin: 0; max-width: 760px; font-size: 14px; line-height: 1.5; color: var(--wa-ink); overflow-wrap: anywhere; }
  .wl-steps {
    margin: 0; padding: 0; list-style: none;
    display: grid; grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr)); gap: 12px;
  }
  .wl-step {
    display: flex; flex-direction: column; gap: 10px; min-width: 0; box-sizing: border-box; padding: 16px;
    border-radius: 10px; border: 1px solid var(--wa-line);
    background: color-mix(in srgb, var(--wa-ink) 3%, var(--wa-card));
  }
  .wl-step.next { border-color: color-mix(in srgb, var(--wa-hue-green) 40%, var(--wa-line)); }
  .wl-step-head { display: flex; align-items: center; gap: 10px; min-width: 0; }
  .wl-step-head b { flex: 1 1 auto; min-width: 0; font-size: 14px; font-weight: 500; overflow-wrap: anywhere; }
  .wl-num {
    width: 24px; height: 24px; flex: none; box-sizing: border-box; border-radius: 50%; display: grid; place-items: center;
    font-size: 12px; font-weight: 600; color: var(--wa-ink); border: 1px solid var(--wa-line-strong);
  }
  .wl-num svg.ui-icon { width: 13px; height: 13px; stroke-width: 2.4; }
  .wl-step.next .wl-num { border-color: var(--wa-hue-green); }
  .wl-step.done .wl-num { border-color: var(--wa-green); color: var(--wa-green); }
  .wl-tag { flex: none; font-size: 11px; font-weight: 500; color: var(--wa-hue-green); }
  .wl-tag.done { color: var(--wa-muted); }
  .wl-step p { flex: 1 1 auto; margin: 0; font-size: 13px; line-height: 1.5; color: var(--wa-muted); overflow-wrap: anywhere; }
  .wl-acts { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
  /* A link out of the panel is outlined blue. */
  .home-btn.out { border-color: color-mix(in srgb, var(--wa-hue-blue) 70%, var(--wa-card)); }
  .wl-why { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--wa-label); }
  .wl-why svg.ui-icon { width: 13px; height: 13px; flex: none; }
  .wl-foot {
    display: flex; flex-wrap: wrap; align-items: center; gap: 8px 20px;
    padding-top: 14px; border-top: 1px solid var(--wa-line); font-size: 13px;
  }
  a.wl-link, button.wl-link {
    font: inherit; font-size: 13px; padding: 0; border: 0; background: none; cursor: pointer;
    color: var(--wa-hue-blue); text-decoration: none;
  }
  a.wl-link:hover, button.wl-link:hover { text-decoration: underline; }
  a.wl-link:focus-visible, button.wl-link:focus-visible { outline: none; border-radius: 3px; box-shadow: var(--wa-ring); }
  .wl-note { flex: 1 1 220px; min-width: 0; color: var(--wa-muted); overflow-wrap: anywhere; }
  .home-btn.wl-hide { height: 28px; padding: 0 11px; }
  /* What else it does: three dashed cards, nothing lit. */
  .wl-facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr)); gap: 12px; }
  .wl-fact {
    display: flex; flex-direction: column; gap: 6px; min-width: 0; box-sizing: border-box; padding: 14px 16px;
    border-radius: 10px; border: 1px dashed var(--wa-line-strong);
  }
  .wl-fact .home-title { color: var(--wa-muted); }
  .wl-fact p { margin: 0; font-size: 13px; line-height: 1.45; color: var(--wa-label); overflow-wrap: anywhere; }
  @media (max-width: 640px) {
    .wl-card { padding: 16px 14px; }
  }
`;
