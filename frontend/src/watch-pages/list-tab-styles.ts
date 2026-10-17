// The look the tabs that list things across devices share: the Pages and
// Status pages tabs (`all-pages.ts`) and the Menus tab
// (`watch-menus/all-menus.ts`). The title and its line, then one outlined
// surface holding the head (the Device menu and the search), the device
// tabs, the cards and the foot; each card its name, its picture, its device
// chips and Devices. What only one tab has (Multi select's bar, New page, a
// page's picture) stays in that tab's own sheet.

import { css } from "lit";

export const listTabStyles = css`
  :host { display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; color: var(--wa-ink); }
  * { box-sizing: border-box; }
  svg { display: block; }
  button { font: inherit; color: inherit; }
  /* The page, the Complications list page's (\`list-page.ts\`): the title
     and its line, then one outlined surface holding the head, the device
     tabs, the bar, the cards and the foot. */
  .ap-page {
    --ap-top: clamp(20px, 4vh, 40px);
    flex: 1 1 auto; min-height: 0; overflow: auto;
    padding: var(--ap-top) clamp(16px, 4vw, 40px) 48px;
    background: var(--wa-bg); color: var(--wa-ink);
  }
  .ap-wrap { width: min(1400px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
  .ap-head { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px 16px; padding: 0 2px; }
  .ap-head-text { flex: 1 1 320px; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .ap-head h1 { margin: 0; font-size: 26px; font-weight: 600; letter-spacing: -.02em; }
  .ap-lead { margin: 0; font-size: 14px; color: var(--wa-muted); }
  .ap-warn { margin: 0; font-size: 12.5px; color: var(--wa-need); }
  .ap-empty { margin: 0; padding: 18px 4px; font-size: 13px; color: var(--wa-muted); }

  /* A copy of the Complications surface's rules in panel.ts (\`.pk-*\`,
     its page form in list-page.ts), so these tabs' head and tabs look the
     same. Keep the two in step. */
  .pk-surface.pk-page {
    display: flex; flex-direction: column; min-width: 0;
    border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-lg);
    background: var(--wa-card); color: var(--wa-ink);
  }
  .pk-page > :first-child { border-top-left-radius: calc(var(--wa-r-lg) - 1px); border-top-right-radius: calc(var(--wa-r-lg) - 1px); }
  .pk-page > :last-child { border-bottom-left-radius: calc(var(--wa-r-lg) - 1px); border-bottom-right-radius: calc(var(--wa-r-lg) - 1px); }
  .pk-page > .pk-pin { position: sticky; top: calc(-1 * var(--ap-top, 0px)); z-index: 7; background: var(--wa-card); }
  .pk-head { display: flex; align-items: center; gap: 12px; flex: none; padding: 12px 12px 12px 18px; border-bottom: 1px solid var(--wa-line); }
  .pk-head > .pk-search { margin-left: auto; }
  .pk-shape { display: inline-flex; align-items: center; gap: 6px; flex: none; }
  .pk-shape-lead { font-size: 12px; color: var(--wa-muted); }
  .pk-shape select {
    max-width: 180px; font: inherit; font-size: 13px; font-weight: 500; color: var(--wa-ink); cursor: pointer; height: 28px;
    padding: 0 26px 0 10px; border-radius: 6px; border: 1px solid var(--wa-line-strong); background-color: var(--wa-input);
    appearance: none; -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238a8a8f' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 8px center; background-size: 12px;
    transition: border-color .12s ease-out, box-shadow .12s ease-out;
  }
  .pk-shape select:hover { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
  .pk-shape select:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .pk-search {
    display: flex; align-items: center; gap: 8px; flex: none; width: 260px; max-width: 45vw;
    height: 28px; padding: 0 10px; border-radius: 6px; border: 1px solid var(--wa-line-strong); background: var(--wa-field);
  }
  .pk-search:hover { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
  .pk-search:focus-within { border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .pk-search svg { width: 14px; height: 14px; flex: none; color: var(--wa-muted); }
  .pk-search-input {
    flex: 1; min-width: 0; font: inherit; font-size: 13px; color: var(--wa-ink);
    border: 0; background: transparent; outline: 0; padding: 0;
  }
  .pk-search-input::placeholder { color: color-mix(in srgb, var(--wa-muted) 70%, transparent); }
  .pk-tabs {
    display: flex; align-items: stretch; flex-wrap: wrap; gap: 2px; flex: none;
    padding: 0 12px; border-bottom: 1px solid var(--wa-line);
  }
  .pk-tab {
    display: inline-flex; align-items: center; gap: 7px; flex: none; cursor: pointer;
    font: inherit; font-size: 12.5px; font-weight: 500; color: var(--wa-muted); white-space: nowrap;
    padding: 9px 12px; border: 0; background: transparent;
    border-bottom: 2px solid transparent; margin-bottom: -1px;
  }
  .pk-tab:hover { color: var(--wa-ink); }
  .pk-tab:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 7px 7px 0 0; }
  .pk-tab.on { color: var(--wa-ink); font-weight: 600; border-bottom-color: var(--dc, var(--wa-ink)); }
  .pk-tab svg { width: 15px; height: 15px; }
  .pk-tab-glyph { display: inline-flex; flex: none; color: var(--dc, var(--wa-muted)); }
  .pk-tab-count { font-size: 11.5px; font-weight: 400; color: var(--wa-muted); }
  .pk-body { padding: 14px 18px; background: var(--wa-bg); min-height: 160px; }
  .pk-foot {
    display: flex; align-items: center; gap: 10px; flex: none; padding: 12px 18px;
    border-top: 1px solid var(--wa-line); background: var(--wa-card);
  }
  .pk-foot-hint { flex: 1; min-width: 0; font-size: 12px; color: var(--wa-muted); }

  /* The cards, the Complications cards' shape: the name on top, the picture
     big under it, then the devices and Devices. Each card is as tall as
     its picture. */
  .ap-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(232px, 1fr)); gap: 12px; align-items: start; }
  .ap-card {
    position: relative; z-index: 1; display: flex; flex-direction: column; gap: 8px; min-width: 0; padding: 9px 10px 10px;
    border: 1px solid var(--wa-line-strong); border-radius: 8px; background: var(--wa-card);
    transition: border-color .12s ease-out;
  }
  .ap-card:hover { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
  .ap-card.over { z-index: 5; }
  .ap-thumb {
    display: grid; place-items: start center; width: 100%; padding: 10px; overflow: hidden;
    border: 0; border-radius: 6px; background: var(--wa-bg); cursor: pointer;
  }
  .ap-top { display: flex; align-items: center; gap: 8px; max-width: 100%; padding-top: 2px; }
  .ap-open {
    display: flex; align-items: baseline; gap: 8px; min-width: 0; flex: 1;
    padding: 0; border: 0; background: none; cursor: pointer; text-align: left;
  }
  .ap-open .ap-detail { margin-left: auto; flex: none; }
  .ap-foot { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; min-width: 0; }
  .ap-foot > .ap-dev-open { margin-left: auto; }
  .ap-open:focus-visible, .ap-thumb:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
  .ap-name { min-width: 0; font-size: 13.5px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ap-card:not(.picking) .ap-open:hover .ap-name { text-decoration: underline; text-underline-offset: 2px; }
  .ap-detail { font-size: 11.5px; color: var(--wa-muted); }
  .ap-devs { display: flex; flex-wrap: wrap; gap: 4px; min-width: 0; }
  .ap-dev {
    display: inline-flex; align-items: center; gap: 4px; max-width: 100%; padding: 2px 7px 2px 5px; border-radius: 999px;
    font-size: 11px; color: var(--wa-ink); background: var(--wa-hover); border: 1px solid var(--wa-line);
  }
  .ap-dev { border-color: color-mix(in srgb, var(--dc, var(--wa-line)) 60%, transparent); }
  .ap-dev svg { flex: none; width: 12px; height: 12px; color: var(--dc, var(--wa-muted)); }
  .ap-dev-n { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ap-dev.dim { opacity: .55; }
  .ap-dev em { font-style: normal; font-size: 10px; color: var(--wa-muted); }
  .ap-dev-open {
    display: inline-flex; align-items: center; gap: 4px; padding: 3px 6px 3px 7px; border-radius: 6px; cursor: pointer;
    font-size: 11.5px; font-weight: 600; color: var(--wa-ink); background: transparent; border: 1px solid var(--wa-line-strong);
  }
  .ap-dev-open svg { width: 13px; height: 13px; }
  .ap-dev-open:hover { background: var(--wa-hover); }
  .ap-dev-open:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .ap-dev-open.on { border-color: var(--wa-accent); background: var(--wa-sel-bg); color: var(--wa-accent); }
  /* The Devices menu hangs under its card, over the cards below. */
  .ap-card > .pe-dev-menu { position: absolute; top: calc(100% - 4px); left: 8px; width: 250px; max-width: calc(100vw - 32px); z-index: 6; }
  /* A phone, as the Complications surface folds there: the head's
     controls wrap, the search and the Device menu share a line, the tabs
     wrap and the head stops being pinned. */
  @media (max-width: 640px) {
    .ap-page { padding: 14px 12px 32px; }
    .ap-head h1 { font-size: 22px; }
    .pk-page > .pk-pin { position: static; }
    .pk-head { flex-wrap: wrap; row-gap: 8px; column-gap: 8px; padding: 10px 10px 10px 14px; }
    .pk-head > .pk-search { order: 3; flex: 1 1 0; width: auto; max-width: none; min-width: 0; margin-left: 0; }
    .pk-head > .pk-shape { order: 3; }
    .pk-shape select { max-width: 130px; }
    .pk-tab { padding: 9px 10px; }
    .pk-body { padding: 10px; }
    .ap-grid { gap: 8px; }
  }
`;
