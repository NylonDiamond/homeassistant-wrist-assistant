// "Not on this watch" under an editor's list of pages or status pages: the
// rest of the library, each row with its small picture, its name over what
// it holds and the devices that have it, and a dashed "Add to this watch"
// tick that puts it here (`library/pick`). Mock frame 2a, in an editor's
// narrow column. The page editor and the status pages editor draw it alike.

import { css, html, nothing, type TemplateResult } from "lit";
import type { LibraryListKind } from "../library/client.js";
import type { Library, LibraryItem } from "../library/model.js";
import type { PendingPick } from "../library/store.js";
import { renderTicks } from "../library/ticks.js";
import { REST_HINT, type RestRow, restTitle } from "./library-editing.js";
import type { LinkDevice } from "./links.js";

export interface LibraryRestInput {
  library: Library;
  kind: LibraryListKind;
  /** The device on screen. */
  here: LinkDevice;
  rows: readonly RestRow[];
  colorOf: (ownerId: string) => string | undefined;
  pending?: ReadonlyMap<string, PendingPick>;
  noteFor: (id: string) => string | undefined;
  admin?: boolean;
  /** Why nothing can be added now (a save is out), or undefined. */
  locked?: string;
  picture: (entry: LibraryItem) => TemplateResult;
  /** A way to the tab, beside the title ("See all pages"). */
  more?: TemplateResult;
  onAdd: (id: string) => void;
  /** Drawn as a box of its own, as an empty iPhone draws it. */
  standalone?: boolean;
}

/** The list, or nothing when the library holds nothing else. */
export function renderLibraryRest(input: LibraryRestInput): TemplateResult | typeof nothing {
  const { rows, here } = input;
  if (rows.length === 0) return nothing;
  const title = restTitle(here.kind);
  return html`<div class="lb-rest ${input.standalone === true ? "standalone" : ""}" role="group" aria-label=${title}>
    <div class="lb-rest-h"><span class="lb-rest-t">${title}</span><small>${rows.length}</small>
      <span class="lb-rest-sp"></span>${input.more ?? nothing}</div>
    <p class="lb-rest-hint">${REST_HINT}</p>
    <ul class="lb-rest-list">${rows.map((row) => html`<li class="lb-rest-row" data-item=${row.entry.id}>
      ${input.picture(row.entry)}
      <span class="lb-rest-name"><b title=${row.entry.name}>${row.entry.name}</b><small>${row.meta}</small></span>
      ${renderTicks({
        library: input.library,
        kind: input.kind,
        itemId: row.entry.id,
        devices: [here],
        addFor: here.ownerId,
        colorOf: input.colorOf,
        ...(input.pending === undefined ? {} : { pending: input.pending }),
        ...(input.noteFor(row.entry.id) === undefined ? {} : { note: input.noteFor(row.entry.id)! }),
        ...(input.admin === undefined ? {} : { admin: input.admin }),
        ...(input.locked === undefined ? {} : { locked: () => input.locked }),
      }, (_owner, on) => { if (on) input.onAdd(row.entry.id); })}
    </li>`)}</ul>
  </div>`;
}

export const libraryRestStyles = css`
  .lb-rest { display: flex; flex-direction: column; gap: 6px; padding: 10px 12px 12px; border-top: 1px solid var(--wa-line); }
  .lb-rest.standalone { align-self: stretch; max-width: 460px; width: 100%; margin: 12px auto 0; border: 1px solid var(--wa-line); border-radius: var(--wa-r-sm, 8px); }
  .lb-rest-h { display: flex; align-items: baseline; gap: 6px; font-size: 12px; font-weight: 650; color: var(--wa-ink); }
  .lb-rest-h small { font-size: 11px; font-weight: 500; color: var(--wa-muted); }
  .lb-rest-sp { flex: 1; }
  .lb-rest-h a { font-size: 12px; font-weight: 500; color: var(--wa-accent); text-decoration: none; }
  .lb-rest-h a:hover { text-decoration: underline; }
  .lb-rest-hint { margin: 0; font-size: 11.5px; line-height: 1.4; color: var(--wa-muted); }
  .lb-rest-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
  .lb-rest-row { display: flex; align-items: center; gap: 10px; min-width: 0; padding: 4px 0; opacity: .8; }
  .lb-rest-row:hover { opacity: 1; }
  .lb-rest-name { display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0; }
  .lb-rest-name b { font-size: 12.5px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .lb-rest-name small { font-size: 11px; color: var(--wa-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .lb-rest-row .lt-ticks { flex: none; max-width: 50%; }
`;
