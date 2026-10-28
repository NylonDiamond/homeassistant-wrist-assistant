// A stand-in for an editor mode not built yet (Devices, Style): the plan
// stays on the stage with nothing to change on it, and the side cards say
// what the mode will do. Replaced by its own file (`mode-devices.ts`,
// `mode-style.ts`) once that is written.

import { type TemplateResult, html, nothing } from "lit";
import type { HomeMapEditorContext, HomeMapMode, HomeMapModeId } from "./editor-mode.js";
import { hmeCard } from "./editor-parts.js";

export class LaterMode implements HomeMapMode {
  constructor(
    readonly id: HomeMapModeId,
    private readonly title: string,
    private readonly text: string,
  ) {}

  rail(): TemplateResult {
    return hmeCard(this.title, html`<p class="hme-text">${this.text}</p><p class="hme-text dim">Coming in the next update of the editor.</p>`);
  }

  inspector(_ctx: HomeMapEditorContext): typeof nothing {
    return nothing;
  }

  overlay(): typeof nothing {
    return nothing;
  }
}
