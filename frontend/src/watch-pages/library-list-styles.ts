// The look of a device's tab on the Pages, Status pages and Menus tabs (mock
// frames 1b, 2a and 2b): a heading with its count and a line at its right,
// the device's picks as rows with a drag handle, a small picture, the name
// over a line of facts and Hide here, then "Not on this watch" as dimmed
// cards with their ticks. The cards themselves are the list tabs' own
// (`list-tab-styles.ts`).

import { css } from "lit";

export const libraryListStyles = css`
  .lt-view { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
  .lt-sect { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 8px; padding: 0 2px; font-size: 12.5px; font-weight: 600; color: var(--wa-muted); }
  .lt-sect small { font-size: 12px; font-weight: 500; color: color-mix(in srgb, var(--wa-muted) 75%, transparent); }
  .lt-sect-r { margin-left: auto; font-size: 11.5px; font-weight: 400; color: var(--wa-muted); }
  .lt-list { display: flex; flex-direction: column; min-width: 0; border: 1px solid var(--wa-line-strong); border-radius: 8px; overflow: hidden; background: var(--wa-card); }
  .lt-row {
    display: flex; align-items: center; gap: 10px; min-width: 0; padding: 7px 12px 7px 8px;
    border-top: 1px solid var(--wa-line); background: var(--wa-card); font-size: 13px;
  }
  .lt-row:first-child { border-top: 0; }
  .lt-row.drag-over { box-shadow: inset 0 2px 0 var(--wa-accent); }
  .lt-row.drag-over.below { box-shadow: inset 0 -2px 0 var(--wa-accent); }
  .lt-row.dragging { opacity: .5; }
  .lt-row:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--wa-accent); }
  .lt-grip { display: inline-flex; flex: none; width: 14px; color: var(--wa-muted); cursor: grab; }
  .lt-grip svg { width: 14px; height: 14px; }
  .lt-row[draggable="false"] .lt-grip { opacity: .35; cursor: default; }
  .lt-row-open {
    display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; padding: 0; border: 0; background: none;
    font: inherit; color: inherit; text-align: left; cursor: pointer;
  }
  .lt-row-open:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
  .lt-row-nm { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
  .lt-row-n { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 500; }
  .lt-row-open:hover .lt-row-n { text-decoration: underline; text-underline-offset: 2px; }
  .lt-row-m { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; color: var(--wa-muted); }
  .lt-row.hid { color: var(--wa-muted); }
  .lt-row.hid .lt-row-n { text-decoration: line-through; text-decoration-color: var(--wa-line-strong); }
  .lt-eye {
    flex: none; padding: 2px 7px; border-radius: 5px; border: 1px solid var(--wa-line-strong); background: transparent;
    font: inherit; font-size: 11px; color: var(--wa-muted); cursor: pointer;
  }
  .lt-eye:hover:not(:disabled) { color: var(--wa-ink); background: var(--wa-hover); }
  .lt-eye:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .lt-eye:disabled { opacity: .5; cursor: progress; }
  .lt-pick-sel {
    flex: none; max-width: 190px; height: 26px; padding: 0 24px 0 9px; border-radius: 6px; border: 1px solid var(--wa-line-strong);
    font: inherit; font-size: 12.5px; color: var(--wa-ink); background-color: var(--wa-input, var(--wa-field)); cursor: pointer;
    appearance: none; -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238a8a8f' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 7px center; background-size: 11px;
  }
  .lt-pick-sel:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .lt-pick-sel:disabled { opacity: .5; cursor: progress; }
  .lt-line { margin: 0; padding: 0 2px; font-size: 12px; line-height: 1.5; color: var(--wa-muted); }
  .lt-line.warn, .lt-line.err { color: var(--wa-need); }
  .lt-line.ok { color: var(--wa-ok, var(--wa-ink)); }
  .lt-empty { margin: 0; padding: 12px 14px; font-size: 12.5px; color: var(--wa-muted); }
  /* "Not on this watch": the rest of the home, dimmed until hovered, each
     card with a small picture and its ticks. */
  .ap-card.lt-dim { opacity: .62; transition: opacity .12s ease-out, border-color .12s ease-out; }
  .ap-card.lt-dim:hover, .ap-card.lt-dim:focus-within { opacity: 1; }
  .ap-thumb.lt-thumb-sm { padding: 6px; }
  .lt-card-note { margin: 0; font-size: 11.5px; line-height: 1.35; color: var(--wa-need); }
  @media (max-width: 640px) {
    .lt-sect-r { margin-left: 0; flex-basis: 100%; }
    .lt-row { padding: 7px 10px 7px 6px; gap: 8px; }
    .lt-pick-sel { max-width: 130px; }
  }
`;
