// The one editor's left list (plan step 4): every page, or every status
// page, of the library, the open one as the editor's own row and each other
// one a row that opens it. The filter over it keeps only the items no
// device has yet ("On no device"). What the page and status pages editors
// share for it.

import { css, html, nothing, type TemplateResult } from "lit";
import type { LibraryItem } from "./model.js";
import { sameId } from "./model.js";

/** Every item, or only those on no device. */
export type ItemFilter = "all" | "none";

/** The items the list shows, in library order: all of them, or with "none"
 * only those no device has, and always the open one. */
export function listedItems(items: readonly LibraryItem[], openId: string, filter: ItemFilter): LibraryItem[] {
  return items.filter((entry) => sameId(entry.id, openId) || filter === "all" || entry.owners.length === 0);
}

/** "On no device yet", "On 1 device", "On 3 devices". */
export function itemWhereText(entry: Pick<LibraryItem, "owners">): string {
  const n = entry.owners.length;
  return n === 0 ? "On no device yet" : `On ${n} ${n === 1 ? "device" : "devices"}`;
}

/** The two-way filter, for the head of the list's card. */
export function renderItemFilter(filter: ItemFilter, onPick: (filter: ItemFilter) => void, noun: string): TemplateResult {
  const pick = (to: ItemFilter, label: string, title: string) => html`<button type="button" class="lib-filter ${filter === to ? "on" : ""}"
    aria-pressed=${filter === to ? "true" : "false"} title=${title} @click=${() => { if (filter !== to) onPick(to); }}>${label}</button>`;
  return html`<span class="lib-filters" role="group" aria-label="Show">
    ${pick("all", "All", `Every ${noun} in your home`)}
    ${pick("none", "On no device yet", `Only the ${noun}s on no device yet`)}
  </span>`;
}

/** The line under the list when "On no device yet" leaves only the open one. */
export function renderNoneLeft(filter: ItemFilter, shown: number, noun: string): TemplateResult | typeof nothing {
  return filter === "none" && shown <= 1 ? html`<div class="lc-note">Every other ${noun} is on a device.</div>` : nothing;
}

export const itemListStyles = css`
  .lib-filters { display: inline-flex; gap: 2px; padding: 2px; border-radius: 8px; background: var(--wa-hover); }
  .lib-filter {
    padding: 2px 8px; border: 0; border-radius: 6px; background: none; color: var(--wa-muted);
    font: inherit; font-size: 11.5px; font-weight: 600; white-space: nowrap; cursor: pointer;
  }
  .lib-filter.on { background: var(--wa-card); color: var(--wa-ink); box-shadow: 0 0 0 1px var(--wa-line); }
  .lib-filter:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  /* Every other item of the library: a row that opens it. */
  .lib-other-row { width: 100%; border: 0; background: none; color: inherit; font: inherit; text-align: left; cursor: pointer; }
  .lib-other-row:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .lib-other-row.nowhere small { color: var(--wa-amber); }
`;
