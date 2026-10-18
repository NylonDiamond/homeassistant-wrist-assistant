// The badge on a row of a page or status page other devices have too: a
// small icon per other device, a watch or an iPhone in that device's color
// (`device-colors.ts`), and the sentence ("Also on Jesse's iPhone", "On 3
// devices") as its tooltip. It used to be that sentence, which a narrow
// list cut to "Also on iPhone 15 Pro ..." and left hard to read; icons fit
// any width and match the device chips everywhere else in the panel.
//
// The devices and the sentence come from `libraryBadgeDevices` and
// `libraryBadgeText` (`watch-pages/library-editing.ts`). The page editor
// and the Status pages tab draw it the same way and both take
// `linkBadgeStyles`.

import { css, html, nothing, type TemplateResult } from "lit";
import { uiIcon } from "../ui-icons.js";
import type { LinkDevice } from "../watch-pages/devices.js";

/** Icons drawn before the rest folds into "+N": four would crowd a row
 * whose name already gives way to the badges. */
const SHOWN = 3;

/** The badge, or nothing when no other device has the item. */
export function renderLinkBadge(
  others: readonly LinkDevice[],
  title: string,
  colorOf: (ownerId: string) => string | undefined,
): TemplateResult | typeof nothing {
  if (others.length === 0) return nothing;
  const shown = others.slice(0, SHOWN);
  const more = others.length - shown.length;
  return html`<span class="badge lk-badge" title=${title} role="img" aria-label=${title}>${shown.map((d) => {
    const color = colorOf(d.ownerId);
    return html`<span class="lk-dev" style=${color === undefined ? nothing : `--dc:${color}`} aria-hidden="true">${uiIcon(d.kind === "iphone" ? "phone" : "watch")}</span>`;
  })}${more > 0 ? html`<span class="lk-more" aria-hidden="true">+${more}</span>` : nothing}</span>`;
}

/** The badge's rules, after the shared chrome's `.badge`: the accent pill
 * the sentence badge had, holding the icons on one 20px line. */
export const linkBadgeStyles = css`
  .badge.lk-badge {
    display: inline-flex; align-items: center; gap: 1px; height: 20px; line-height: 20px; padding: 0 5px;
    color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 12%, transparent);
  }
  .lk-badge .lk-dev { display: inline-flex; color: var(--dc, var(--wa-accent)); }
  .lk-badge .lk-dev svg.ui-icon { width: 13px; height: 13px; stroke-width: 2; }
  .lk-badge .lk-more { margin-left: 2px; font-size: 10.5px; font-weight: 700; font-variant-numeric: tabular-nums; }
`;
