// Share page's dialog: the page as text (`page-share.ts`), with Copy and
// Download. The Pages tab opens it from a row's "...". The other person
// pastes it in New page, Paste a page.

import { type TemplateResult, css, html, nothing } from "lit";
import { copyPlainText } from "../home.js";
import { uiIcon } from "../ui-icons.js";

export const SHARE_PAGE_DIALOG = "dialog.lib-share-page";

/** What the dialog holds while it is open. */
export interface SharePageForm {
  name: string;
  text: string;
  fileName: string;
  /** How many entities the text names. */
  entities: number;
  /** The last Copy or Download said this. */
  said?: { kind: "ok" | "err"; text: string };
}

export interface SharePageHandlers {
  onSaid: (said: SharePageForm["said"]) => void;
  onClose: () => void;
}

/** Save the text as a file in the browser's downloads. */
export function downloadText(text: string, fileName: string): boolean {
  try {
    const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    return true;
  } catch {
    return false;
  }
}

export function renderSharePageDialog(form: SharePageForm, h: SharePageHandlers): TemplateResult {
  const copy = async (e: Event) => {
    // The dialog's own box first: Home Assistant over plain http has no
    // `navigator.clipboard`, and `copyPlainText`'s hidden box sits outside
    // this modal dialog, where the page is inert and nothing copies.
    const box = (e.currentTarget as HTMLElement).closest("dialog")?.querySelector<HTMLTextAreaElement>("textarea.sp-text");
    let ok = false;
    if (navigator.clipboard?.writeText !== undefined) {
      try {
        await navigator.clipboard.writeText(form.text);
        ok = true;
      } catch {
        // Refused: select and copy below.
      }
    }
    if (!ok && box) {
      box.focus();
      box.select();
      box.setSelectionRange(0, box.value.length);
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
    }
    if (!ok) ok = await copyPlainText(form.text);
    h.onSaid(ok ? { kind: "ok", text: "Copied. Send it to them." } : { kind: "err", text: "The browser did not copy it. Use Download instead." });
  };
  const download = () => {
    const ok = downloadText(form.text, form.fileName);
    h.onSaid(ok ? { kind: "ok", text: `Saved as ${form.fileName}.` } : { kind: "err", text: "The browser did not save it. Use Copy instead." });
  };
  const names = form.entities === 1 ? "1 entity" : `${form.entities} entities`;
  return html`<dialog class="new-dialog lib-new lib-share-page" aria-label="Share page" @close=${() => h.onClose()}
    @cancel=${(e: Event) => { e.preventDefault(); h.onClose(); }}>
    <div class="lib-new-form">
      <div class="new-head">
        <h2>Share ${form.name}</h2>
        <span class="spacer"></span>
        <button type="button" class="icon lib-new-x" title="Close" aria-label="Close" @click=${() => h.onClose()}>${uiIcon("close")}</button>
      </div>
      <div class="new-body">
        <p class="sp-lead">Send this text or file to the other person. In Pages they pick New page, then Paste a page.</p>
        <textarea class="sp-text" readonly spellcheck="false" aria-label="Shared page text" .value=${form.text}
          @focus=${(e: Event) => (e.target as HTMLTextAreaElement).select()}></textarea>
        <p class="sp-note">It has the page's tiles and the ids and names of its ${names}. It has no states, no photos and nothing else from your home.</p>
        ${form.said === undefined ? nothing : html`<p class="lt-line ${form.said.kind === "ok" ? "ok" : "err"}" role="status">${form.said.text}</p>`}
      </div>
      <div class="new-foot">
        <span class="new-count"></span>
        <button type="button" class="lib-new-btn" @click=${download}>${uiIcon("download")} Download</button>
        <button type="button" class="lib-new-btn primary" @click=${(e: Event) => void copy(e)}>Copy text</button>
      </div>
    </div>
  </dialog>`;
}

export function openSharePageDialog(root: { querySelector?: (s: string) => Element | null } | undefined): void {
  const dialog = root?.querySelector?.(SHARE_PAGE_DIALOG) as HTMLDialogElement | null | undefined;
  if (!dialog) return;
  if (!dialog.open && typeof dialog.showModal === "function") dialog.showModal();
}

export const sharePageDialogStyles = css`
  .lib-share-page .sp-lead, .lib-share-page .sp-note { margin: 0; font-size: 12.5px; line-height: 1.4; color: var(--wa-muted); }
  .lib-share-page .sp-text {
    width: 100%; box-sizing: border-box; height: 180px; resize: vertical; padding: 8px; border-radius: 9px;
    border: 1px solid var(--wa-line-strong); font: 11.5px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--wa-ink);
    background: var(--wa-input, var(--wa-field));
  }
  .lib-share-page .lib-new-btn svg { width: 14px; height: 14px; vertical-align: -2px; }
`;
