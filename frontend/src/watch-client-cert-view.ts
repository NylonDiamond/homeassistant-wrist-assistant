// The "Client certificate" card on the Watch app's Settings page, beside the
// pairing card: the signed in user's mTLS certificate, which that user's
// watches and iPhone read from the integration. It shows what is held (its
// fingerprint, when, and from where) and uploads, replaces or removes it.
//
// The card is not about the watch on the page: one certificate per Home
// Assistant user, so it reads its status once each time the page is opened
// and never again until something here changes it. No polling.
//
// Its words and rules are `watch-client-cert.ts`, which the tests read without
// a DOM.

import { css, html, nothing } from "lit";
import { live } from "lit/directives/live.js";
import {
  type ClientCertificateStatus,
  type HassLike,
  deleteClientCertificate,
  fetchClientCertificate,
  putClientCertificate,
} from "./ha-api.js";
import { SECTION_COLOR } from "./kinds.js";
import { uiIcon } from "./ui-icons.js";
import {
  CLIENT_CERT_ACCEPT,
  CLIENT_CERT_HELP,
  CLIENT_CERT_REMOVE_ASK,
  CLIENT_CERT_SAVED_NOTE,
  CLIENT_CERT_TITLE,
  CLIENT_CERT_UPDATE_TEXT,
  clientCertCanUpload,
  clientCertErrorText,
  clientCertSizeProblem,
  clientCertView,
  readFileAsBase64,
} from "./watch-client-cert.js";
import { errorCode } from "./watch-settings.js";

/** The card's mark and tint: neutral, it is not a setting of the watch. */
const CERT_LOOK = { icon: "lock", color: SECTION_COLOR.place } as const;

/** A picked file: its name and size at once, its bytes once read. */
interface PickedFile {
  name: string;
  bytes: number;
  data?: string;
}

export class ClientCertCard {
  private hass?: HassLike;
  /** Bumped by every opening and closing, so a reply that lands after the
   * page was left is dropped. */
  private visit = 0;
  private status?: ClientCertificateStatus;
  private reading = false;
  private readError?: string;
  /** The integration does not know the commands. */
  private unsupported = false;
  /** Replace was pressed: the upload form shows under what is held. */
  private replacing = false;
  private file?: PickedFile;
  /** Bumped by every pick, so a slow read of an earlier file is dropped. */
  private fileSeq = 0;
  private passphrase = "";
  private busy?: "upload" | "remove";
  private error?: string;
  private askRemove = false;
  /** An upload or removal just went through. */
  private done = false;

  /** `update` asks the page to draw again. */
  constructor(private readonly update: () => void) {}

  /** The page has come on screen: start afresh and read the status once. */
  open(hass: HassLike): void {
    this.hass = hass;
    this.visit++;
    this.reset();
    this.status = undefined;
    this.readError = undefined;
    this.unsupported = false;
    void this.read();
  }

  /** The page has gone: a picked file and a typed passphrase are dropped. */
  close(): void {
    this.visit++;
    this.reset();
    this.reading = false;
  }

  private reset(): void {
    this.fileSeq++;
    this.replacing = false;
    this.file = undefined;
    this.passphrase = "";
    this.busy = undefined;
    this.error = undefined;
    this.askRemove = false;
    this.done = false;
  }

  private async read(): Promise<void> {
    const hass = this.hass;
    if (!hass) return;
    const visit = this.visit;
    this.reading = true;
    this.readError = undefined;
    this.update();
    try {
      const status = await fetchClientCertificate(hass);
      if (visit !== this.visit) return;
      this.status = status;
    } catch (err) {
      if (visit !== this.visit) return;
      if (errorCode(err) === "unknown_command") this.unsupported = true;
      else this.readError = clientCertErrorText(err, "read");
    } finally {
      if (visit === this.visit) {
        this.reading = false;
        this.update();
      }
    }
  }

  /** A file picked: refused at once when its size is wrong, else read. */
  private async pick(input: HTMLInputElement): Promise<void> {
    const file = input.files?.[0];
    // Cleared so picking the same file again still fires a change.
    input.value = "";
    if (file === undefined) return;
    const seq = ++this.fileSeq;
    this.error = undefined;
    this.done = false;
    const problem = clientCertSizeProblem(file.size);
    if (problem !== undefined) {
      this.file = undefined;
      this.error = problem;
      this.update();
      return;
    }
    this.file = { name: file.name, bytes: file.size };
    this.update();
    try {
      const data = await readFileAsBase64(file);
      if (seq !== this.fileSeq) return;
      this.file = { name: file.name, bytes: file.size, data };
    } catch (err) {
      if (seq !== this.fileSeq) return;
      this.file = undefined;
      this.error = `Could not read that file: ${String((err as { message?: string })?.message ?? err)}`;
    }
    this.update();
  }

  private async upload(): Promise<void> {
    const hass = this.hass;
    const file = this.file;
    if (!hass || file?.data === undefined || !clientCertCanUpload(file, this.busy !== undefined)) return;
    const visit = this.visit;
    this.busy = "upload";
    this.error = undefined;
    this.done = false;
    this.askRemove = false;
    this.update();
    try {
      const status = await putClientCertificate(hass, file.data, this.passphrase);
      if (visit !== this.visit) return;
      this.status = status;
      this.fileSeq++;
      this.file = undefined;
      this.passphrase = "";
      this.replacing = false;
      this.done = true;
    } catch (err) {
      if (visit !== this.visit) return;
      // The file stays picked, so a wrong passphrase is fixed by typing again.
      this.error = clientCertErrorText(err, "upload");
    } finally {
      if (visit === this.visit) {
        this.busy = undefined;
        this.update();
      }
    }
  }

  private async remove(): Promise<void> {
    const hass = this.hass;
    if (!hass || this.busy !== undefined) return;
    const visit = this.visit;
    this.busy = "remove";
    this.error = undefined;
    this.done = false;
    this.update();
    try {
      const status = await deleteClientCertificate(hass);
      if (visit !== this.visit) return;
      this.status = status;
      this.askRemove = false;
      this.replacing = false;
      this.done = true;
    } catch (err) {
      if (visit !== this.visit) return;
      this.askRemove = false;
      this.error = clientCertErrorText(err, "remove");
    } finally {
      if (visit === this.visit) {
        this.busy = undefined;
        this.update();
      }
    }
  }

  private setReplacing(on: boolean): void {
    this.replacing = on;
    this.askRemove = false;
    this.error = undefined;
    this.done = false;
    if (!on) {
      this.fileSeq++;
      this.file = undefined;
      this.passphrase = "";
    }
    this.update();
  }

  render(hass?: HassLike) {
    if (hass) this.hass = hass;
    return html`<section class="sec ws-cert" data-sec="ws-cert" data-open="true" data-help="on" style=${`--c:${CERT_LOOK.color}`}>
      <div class="sec-h pinned">
        <span class="swatch">${uiIcon(CERT_LOOK.icon)}</span>
        <span class="tt"><h4>${CLIENT_CERT_TITLE}</h4></span>
      </div>
      <div class="sec-b">
        <div class="hint keep">${CLIENT_CERT_HELP}</div>
        ${this.renderBody()}
      </div>
    </section>`;
  }

  private renderBody() {
    if (this.unsupported) return html`<div class="hint warn">${CLIENT_CERT_UPDATE_TEXT}</div>`;
    if (this.readError !== undefined) {
      return html`<div class="hint err" role="alert">${this.readError}</div>
        <button class="small ws-cert-retry" ?disabled=${this.reading} @click=${() => void this.read()}>Try again</button>`;
    }
    if (this.status === undefined) return html`<div class="hint">${this.reading ? "Reading…" : ""}</div>`;
    const view = clientCertView(this.status);
    const busy = this.busy !== undefined;
    return html`<div class="field readout"><span>Status</span>
        <div class="readout-v ws-cert-state ${view.installed ? "on" : ""}"><i class="ws-cert-dot" aria-hidden="true"></i>${view.state}</div>
      </div>
      ${view.fingerprint === undefined ? nothing : html`<div class="field readout"><span>Fingerprint</span>
        <div class="readout-v mono ws-cert-fp" title=${view.fingerprint.full}>${view.fingerprint.short}</div>
      </div>`}
      ${view.added === undefined ? nothing : html`<div class="field readout"><span>Added</span>
        <div class="readout-v ws-cert-added">${view.added}</div>
      </div>`}
      ${view.installed && this.askRemove
        ? html`<div class="ws-cert-ask" role="alert">
            <span>${CLIENT_CERT_REMOVE_ASK}</span>
            <button type="button" class="small danger" ?disabled=${busy} @click=${() => void this.remove()}>${this.busy === "remove" ? "Removing…" : "Remove"}</button>
            <button type="button" class="small" ?disabled=${busy} @click=${() => { this.askRemove = false; this.update(); }}>Keep</button>
          </div>`
        : view.installed && !this.replacing
        ? html`<div class="row-acts ws-cert-acts">
            <button type="button" class="small" ?disabled=${busy} title="Upload another certificate in place of this one"
              @click=${() => this.setReplacing(true)}>Replace</button>
            <button type="button" class="small danger" ?disabled=${busy}
              @click=${() => { this.askRemove = true; this.error = undefined; this.done = false; this.update(); }}>Remove</button>
          </div>`
        : nothing}
      ${!view.installed || this.replacing ? this.renderForm(view.installed) : nothing}
      ${this.error === undefined ? nothing : html`<div class="hint err" role="alert">${this.error}</div>`}
      ${this.done ? html`<div class="hint keep ws-cert-done" role="status">${CLIENT_CERT_SAVED_NOTE}</div>` : nothing}`;
  }

  /** The file, its passphrase and Upload. `replacing`: a certificate is held,
   * so the form can be put away again. */
  private renderForm(replacing: boolean) {
    const file = this.file;
    const busy = this.busy !== undefined;
    const ready = clientCertCanUpload(file, busy);
    return html`<div class="field ws-cert-file"><span>File</span>
        <div class="row-acts">
          <button type="button" class="small" ?disabled=${busy} title="Choose a .p12 or .pfx file from this device"
            @click=${(e: Event) => (e.currentTarget as HTMLElement).parentElement?.querySelector<HTMLInputElement>("input[type=file]")?.click()}>Choose a file</button>
          <input type="file" hidden accept=${CLIENT_CERT_ACCEPT} @change=${(e: Event) => void this.pick(e.target as HTMLInputElement)} />
          <span class="readout-v ws-cert-name">${file === undefined ? "No file chosen" : file.name}</span>
        </div>
      </div>
      <label class="field ws-cert-pass"><span>Passphrase</span>
        <input type="password" autocomplete="off" spellcheck="false" placeholder="None" ?disabled=${busy}
          .value=${live(this.passphrase)}
          @input=${(e: Event) => { this.passphrase = (e.target as HTMLInputElement).value; if (this.error !== undefined) { this.error = undefined; this.update(); } }}
          @keydown=${(e: KeyboardEvent) => {
            if (e.key !== "Enter" || e.isComposing) return;
            e.preventDefault();
            void this.upload();
          }} />
      </label>
      <div class="row-acts ws-cert-acts">
        <button type="button" class="small primary" ?disabled=${!ready}
          title=${ready ? "Store this certificate in Home Assistant for your devices" : "Choose a .p12 file first"}
          @click=${() => void this.upload()}>${this.busy === "upload" ? "Uploading…" : "Upload"}</button>
        ${replacing ? html`<button type="button" class="small" ?disabled=${busy} @click=${() => this.setReplacing(false)}>Cancel</button>` : nothing}
      </div>`;
  }
}

/** The card's own rules, added to the Settings page's sheet. */
export const clientCertStyles = css`
  .ws-cert .readout-v.ws-cert-state { display: flex; align-items: center; gap: 7px; color: var(--wa-muted); }
  .ws-cert .readout-v.ws-cert-state.on { color: var(--wa-ink); }
  /* The one spot of colour: a dot, lit while a certificate is held. */
  .ws-cert-dot { width: 7px; height: 7px; flex: none; border-radius: 50%; background: var(--wa-line-strong); }
  .ws-cert-state.on .ws-cert-dot { background: var(--wa-hue-green); }
  .ws-cert .readout-v.ws-cert-fp { color: var(--wa-ink); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: .02em; cursor: default; }
  .ws-cert .ws-cert-file .row-acts { flex-wrap: nowrap; }
  .ws-cert .ws-cert-file .row-acts > button { flex: none; }
  .ws-cert .readout-v.ws-cert-name { padding: 0; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ws-cert .ws-cert-pass input[type=password] {
    width: 100%; min-width: 0; box-sizing: border-box; height: 28px; min-height: 28px; padding: 0 9px;
    font: inherit; font-size: 13px; font-weight: 500; color: var(--wa-ink);
    border: 1px solid var(--wa-line-strong); border-radius: 6px; background-color: var(--wa-field);
    transition: border-color .12s ease-out, box-shadow .12s ease-out;
  }
  .ws-cert .ws-cert-pass input[type=password]:hover:not(:disabled) { border-color: color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); }
  .ws-cert .ws-cert-pass input[type=password]:focus-visible { outline: none; border-color: var(--wa-accent); box-shadow: var(--wa-ring); }
  .ws-cert .ws-cert-pass input[type=password]::placeholder { color: color-mix(in srgb, var(--wa-muted) 70%, transparent); }
  .ws-cert .ws-cert-acts { margin: 6px 0 2px; }
  .ws-cert-ask { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 4px 0 4px; font-size: 12px; color: var(--wa-ink); }
  .ws-cert-ask > span { flex: 1 1 100%; }
`;
