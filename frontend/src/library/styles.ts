// The look the Library's Photos and Parts screens share: a title with a line
// under it, a note for what the last delete did, and cards on the panel's
// tokens, plain and neutral like Home.

import { css } from "lit";

export const libraryStyles = css`
  :host {
    display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; overflow: auto;
    box-sizing: border-box; padding: 18px clamp(16px, 3vw, 32px) 48px;
    color: var(--wa-ink); background: var(--wa-bg); font-size: 14px;
  }
  * { box-sizing: border-box; }
  svg.ui-icon { width: 14px; height: 14px; display: block; flex: none; }
  h2, p { margin: 0; }
  .lb-wrap { width: 100%; max-width: 940px; margin: 0 auto; display: flex; flex-direction: column; gap: 14px; }
  .lb-head { display: flex; flex-direction: column; gap: 4px; }
  .lb-head h2 { font-size: 17px; font-weight: 600; letter-spacing: -.01em; }
  .lb-lead { font-size: 13px; line-height: 1.45; color: var(--wa-muted); max-width: 640px; }
  .lb-note {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px; font-size: 13px;
    border-radius: var(--wa-r-md, 12px); border: 1px solid var(--wa-line); background: var(--wa-card);
  }
  .lb-note > span { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  .lb-note.ok { border-color: color-mix(in srgb, var(--wa-green) 40%, transparent); }
  .lb-note.err { border-color: color-mix(in srgb, var(--wa-need) 45%, transparent); }
  .lb-empty {
    display: flex; flex-direction: column; align-items: flex-start; gap: 8px; padding: 20px;
    border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    font-size: 13px; color: var(--wa-muted);
  }
  button.lb-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px; flex: none;
    min-height: 30px; padding: 0 11px; border-radius: var(--wa-r-sm, 8px); cursor: pointer;
    font: inherit; font-size: 12.5px; color: var(--wa-ink); background: var(--wa-card); border: 1px solid var(--wa-line-strong);
  }
  button.lb-btn:hover:not(:disabled) { background: var(--wa-hover); }
  button.lb-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.lb-btn:disabled { opacity: .5; cursor: default; }
  button.lb-btn.danger { color: var(--wa-need); }
  button.lb-link { border: 0; background: none; padding: 0; color: var(--wa-accent); font: inherit; font-size: 13px; cursor: pointer; }
  .lb-count { font-size: 12px; color: var(--wa-muted); }
`;
