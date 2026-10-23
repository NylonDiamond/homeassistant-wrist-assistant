// Home's lineup for one device (plan: app repo
// docs/panel_one_board_plan_2026-10.md, step 6): what is on it, in its
// order, a group per kind. Each line opens its thing in its tab's one
// editor (Edit); each group has one Change, which opens that tab's board
// focused on the device. Home itself ticks, drags and switches nothing, so
// each change has one place.
//
// The groups are drawn by two hosts: the pages, status pages and menus by
// `wa-home-lineup` (its own chunk, since it reads the library), the
// complications and the device's own screens by the panel. Both draw them
// through `renderLineupGroup` and wear `homeLineupStyles`, so they read as
// one list.

import { css, html, nothing, type TemplateResult } from "lit";
import { type UiIconName, uiIcon } from "./ui-icons.js";

/** One thing on the device. */
export interface LineupLine {
  key: string;
  name: string;
  /** The line under the name ("11 tiles", "Rectangular"). */
  detail?: string;
  picture?: TemplateResult;
  /** Hidden on this device (Hide here): drawn faded, with a tag. */
  hidden?: boolean;
  /** A small tag after the name ("Not shared"). */
  tag?: string;
  /** The line's button: "Edit", or "Open" for a device's own screen. */
  action?: { label: string; title: string; onClick: () => void; href?: string };
}

export interface LineupGroup {
  key: string;
  title: string;
  icon: UiIconName;
  /** The section hue its chip is outlined in. */
  hue: string;
  /** Words after the count ("in swipe order"). */
  sub?: string;
  /** Leave out the count (a device's own screens count nothing). */
  noCount?: boolean;
  lines: readonly LineupLine[];
  /** What it says with no lines. */
  empty: string;
  /** Change: that tab's board, focused on the device. */
  change?: { title: string; onClick: () => void };
  /** Drawn as a strip of small cards rather than a list (pages). */
  strip?: boolean;
}

/** The words of a hidden line's tag. */
export const LINEUP_HIDDEN_TAG = "Hidden here";

/** "Not shared": a device's own screen, kept by that device alone. */
export const LINEUP_OWN_TAG = "Not shared";

export function renderLineupGroup(g: LineupGroup): TemplateResult {
  return html`<section class="hl-group" aria-label=${g.title} style=${`--h:${g.hue}`}>
    <div class="hl-head">
      <span class="hl-chip" aria-hidden="true">${uiIcon(g.icon)}</span>
      <h3 class="hl-title">${g.title}</h3>
      ${g.noCount === true ? nothing : html`<span class="hl-n">${g.lines.length}</span>`}
      ${g.sub === undefined ? nothing : html`<span class="hl-sub">${g.sub}</span>`}
      ${g.change === undefined ? nothing : html`<button type="button" class="hl-change" title=${g.change.title} @click=${g.change.onClick}>Change${uiIcon("right")}</button>`}
    </div>
    ${g.lines.length === 0
      ? html`<p class="hl-empty">${g.empty}</p>`
      : html`<ol class="hl-lines ${g.strip === true ? "strip" : ""}">${g.lines.map((line, i) => renderLine(line, i, g.strip === true))}</ol>`}
  </section>`;
}

function renderLine(line: LineupLine, index: number, numbered: boolean): TemplateResult {
  const a = line.action;
  return html`<li class="hl-line ${line.hidden === true ? "hid" : ""}" data-line=${line.key}>
    ${numbered ? html`<span class="hl-i" aria-hidden="true">${index + 1}</span>` : nothing}
    ${line.picture === undefined ? nothing : html`<span class="hl-pic">${line.picture}</span>`}
    <span class="hl-t">
      <b class="hl-name">${line.name}</b>
      ${line.detail === undefined && line.hidden !== true && line.tag === undefined ? nothing : html`<small class="hl-detail">
        ${line.hidden === true ? html`<em class="hl-tag">${LINEUP_HIDDEN_TAG}</em>` : nothing}
        ${line.tag === undefined ? nothing : html`<em class="hl-tag own">${line.tag}</em>`}
        ${line.detail ?? nothing}</small>`}
    </span>
    ${a === undefined ? nothing : a.href !== undefined
      ? html`<a class="hl-edit" href=${a.href} title=${a.title}
          @click=${(e: MouseEvent) => {
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            a.onClick();
          }}>${a.label}</a>`
      : html`<button type="button" class="hl-edit" title=${a.title} @click=${a.onClick}>${a.label}</button>`}
  </li>`;
}

/** The lineup's look, in the panel's tokens. The hue is on the chip's
 * outline only, never on text. */
export const homeLineupStyles = css`
  .hl-groups { display: flex; flex-direction: column; gap: 18px; }
  .hl-group { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
  .hl-head { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .hl-chip {
    display: inline-flex; align-items: center; justify-content: center; flex: none; width: 24px; height: 24px; border-radius: 7px;
    border: 1px solid var(--h, var(--wa-line)); color: var(--wa-ink); background: var(--wa-card);
  }
  .hl-chip svg { width: 14px; height: 14px; }
  .hl-title { margin: 0; font-size: 14px; font-weight: 600; color: var(--wa-ink); }
  .hl-n { font-size: 12.5px; font-weight: 600; color: var(--wa-muted); }
  .hl-sub { font-size: 12px; color: var(--wa-muted); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hl-change {
    display: inline-flex; align-items: center; gap: 2px; margin-left: auto; flex: none; height: 26px; padding: 0 6px 0 10px;
    border-radius: 7px; border: 1px solid var(--wa-line); background: none; color: var(--wa-ink); font: inherit; font-size: 12px; font-weight: 600; cursor: pointer;
  }
  .hl-change svg { width: 12px; height: 12px; }
  .hl-change:hover { background: var(--wa-hover); }
  .hl-change:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .hl-empty { margin: 0; padding: 10px 12px; border-radius: 10px; border: 1px dashed var(--wa-line); font-size: 12.5px; color: var(--wa-muted); }
  .hl-lines { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 6px; }
  .hl-lines.strip { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; }
  .hl-line {
    display: flex; align-items: center; gap: 10px; min-width: 0; padding: 7px 8px 7px 10px; border-radius: 10px;
    border: 1px solid var(--wa-line); background: var(--wa-card);
  }
  .hl-lines.strip .hl-line { flex-direction: column; align-items: stretch; gap: 6px; padding: 8px; position: relative; }
  .hl-lines.strip .hl-pic { align-self: center; }
  .hl-line.hid .hl-pic, .hl-line.hid .hl-name { opacity: 0.5; }
  .hl-i { position: absolute; top: 6px; left: 8px; font-size: 11px; font-weight: 600; color: var(--wa-muted); }
  .hl-pic { display: inline-flex; flex: none; align-items: center; justify-content: center; }
  .hl-t { display: flex; flex-direction: column; gap: 1px; flex: 1 1 auto; min-width: 0; }
  .hl-name { font-size: 13px; font-weight: 600; color: var(--wa-ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hl-detail { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; font-size: 11.5px; color: var(--wa-muted); }
  .hl-tag { font-style: normal; font-size: 10.5px; font-weight: 600; padding: 0 5px; border-radius: 5px; border: 1px solid var(--wa-line); color: var(--wa-muted); }
  .hl-edit {
    flex: none; display: inline-flex; align-items: center; justify-content: center; height: 26px; padding: 0 10px; border-radius: 7px;
    border: 1px solid var(--wa-line); background: none; color: var(--wa-ink); font: inherit; font-size: 12px; font-weight: 600;
    text-decoration: none; cursor: pointer;
  }
  .hl-lines.strip .hl-edit { align-self: stretch; }
  .hl-edit:hover { background: var(--wa-hover); }
  .hl-edit:focus-visible { outline: none; box-shadow: var(--wa-ring); }
`;

/** Home's "All devices" (plan step 6): its head and search, then a part per
 * kind, each a board; the parts' tables share one device column width, so
 * their device columns line up (`boardStackStyles`). */
export const homeAllStyles = css`
  .ha { display: flex; flex-direction: column; gap: 22px; min-width: 0; }
  .ha-head { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px; }
  .ha-head-t { flex: 1 1 320px; min-width: 0; }
  .ha-head-t h2 { margin: 0; font-size: 20px; font-weight: 600; color: var(--wa-ink); }
  .ha-head-t p { margin: 4px 0 0; font-size: 13px; color: var(--wa-muted); }
  .ha-search { flex: 0 1 320px; }
  .ha-part { display: flex; flex-direction: column; gap: 8px; min-width: 0; position: relative; }
  .ha-part-head { display: flex; align-items: center; gap: 8px; }
  .ha-part-head h3 { margin: 0; font-size: 14px; font-weight: 600; color: var(--wa-ink); }
  .ha-col { display: inline-flex; align-items: center; gap: 6px; padding: 8px 6px; font-weight: 600; color: var(--wa-ink); }
  .ha-ic {
    display: inline-flex; align-items: center; justify-content: center; flex: none; width: 28px; height: 28px; border-radius: 8px;
    border: 1px solid var(--h, var(--wa-line)); color: var(--wa-ink);
  }
  .ha-ic svg { width: 15px; height: 15px; }
  .ha-still { cursor: default; }
  .ha-lock { display: inline-flex; color: var(--wa-muted); }
  .ha-lock svg { width: 14px; height: 14px; }
  .hb-lineup { margin-top: 4px; }
`;
