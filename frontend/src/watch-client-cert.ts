// The client certificate card's thinking, without a DOM: its words, the size
// guard on a picked file, reading the file as base64, the short fingerprint,
// and what a status from Home Assistant reads as. The card itself is
// `watch-client-cert-view.ts`.
//
// A Home Assistant behind a reverse proxy that asks for a client certificate
// (mTLS) needs one on every device that talks to it. The certificate belongs
// to the signed in Home Assistant user, one per user, and that user's watches
// and iPhone read it from the integration the next time they open the app.

import type { ClientCertificateStatus } from "./ha-api.js";
import { errorCode } from "./watch-settings.js";

export const CLIENT_CERT_TITLE = "Client certificate";

export const CLIENT_CERT_HELP =
  "For a Home Assistant behind a reverse proxy that asks for a client certificate (mTLS). Not needed for most homes.";

/** Under the card after an upload or a removal. */
export const CLIENT_CERT_SAVED_NOTE = "Your watch and iPhone pick it up the next time they open the app.";

/** In place of the card's body on an integration from before the panel kept
 * certificates, which does not know the commands at all. */
export const CLIENT_CERT_UPDATE_TEXT = "Update the Wrist Assistant integration to add a client certificate here.";

/** Asked before Remove runs. */
export const CLIENT_CERT_REMOVE_ASK = "Remove this certificate? Your watch and iPhone stop sending it the next time they open the app.";

/** The file types the picker offers. */
export const CLIENT_CERT_ACCEPT = ".p12,.pfx,application/x-pkcs12";

/** The largest file the card sends, the integration's own limit
 * (`CLIENT_CERTIFICATE_MAX_PKCS12_BYTES` in `const.py`), so a file the
 * integration would refuse is refused here before it is read. A .p12 is a
 * few KB; anything near this is some other file. */
export const CLIENT_CERT_MAX_BYTES = 32 * 1024;

/** Why a picked file of `bytes` is refused before it is read, or undefined
 * when its size is fine. */
export function clientCertSizeProblem(bytes: number): string | undefined {
  if (!Number.isFinite(bytes) || bytes <= 0) return "That file is empty.";
  if (bytes > CLIENT_CERT_MAX_BYTES) {
    const kb = Math.ceil(bytes / 1024);
    return `That file is ${kb} KB, over the ${CLIENT_CERT_MAX_BYTES / 1024} KB limit. A .p12 file is only a few KB.`;
  }
  return undefined;
}

/** The base64 part of a `data:` URL, as `FileReader.readAsDataURL` writes
 * it. Undefined for anything that is not a base64 data URL. */
export function base64OfDataUrl(url: string): string | undefined {
  if (!url.startsWith("data:")) return undefined;
  const comma = url.indexOf(",");
  if (comma < 0) return undefined;
  if (!url.slice(0, comma).endsWith(";base64")) return undefined;
  return url.slice(comma + 1);
}

/** A picked file's bytes as base64, for the WebSocket, read with a
 * `FileReader`. */
export function readFileAsBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const data = typeof reader.result === "string" ? base64OfDataUrl(reader.result) : undefined;
      if (data === undefined) reject(new Error("the file could not be read"));
      else resolve(data);
    };
    reader.onerror = () => reject(reader.error ?? new Error("the file could not be read"));
    reader.readAsDataURL(file);
  });
}

/** How many hex digits of the fingerprint the card shows. */
export const FINGERPRINT_SHOWN = 16;

/** The fingerprint's first hex digits, its separators (colons, spaces)
 * dropped. Undefined when there is none. */
export function shortFingerprint(fingerprint: string | null | undefined): string | undefined {
  if (typeof fingerprint !== "string") return undefined;
  const hex = fingerprint.replace(/[^0-9a-fA-F]/g, "");
  return hex === "" ? undefined : hex.slice(0, FINGERPRINT_SHOWN);
}

/** Where the certificate came from, in words. */
export function clientCertSourceText(source: unknown): string | undefined {
  if (source === "panel") return "Uploaded here";
  if (source === "iphone") return "From the iPhone app";
  return undefined;
}

/** The day a certificate was stored, as a short date. Undefined when there is
 * no date, or one that does not parse. */
export function clientCertDateText(at: string | null | undefined, locale?: string): string | undefined {
  if (typeof at !== "string" || at === "") return undefined;
  const date = new Date(at);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
}

/** What the card says about a status. */
export interface ClientCertView {
  installed: boolean;
  /** "Installed", or "None". */
  state: string;
  fingerprint?: { short: string; full: string };
  /** The date and the source together, "7 Oct 2026 · Uploaded here". */
  added?: string;
}

export function clientCertView(status: ClientCertificateStatus | undefined, locale?: string): ClientCertView {
  if (status === undefined || status.present !== true) return { installed: false, state: "None" };
  const short = shortFingerprint(status.fingerprint);
  const added = [clientCertDateText(status.updated_at, locale), clientCertSourceText(status.source)]
    .filter((s): s is string => s !== undefined)
    .join(" · ");
  return {
    installed: true,
    state: "Installed",
    ...(short === undefined ? {} : { fingerprint: { short, full: String(status.fingerprint) } }),
    ...(added === "" ? {} : { added }),
  };
}

/** Whether Upload can run: a file read and nothing else running. */
export function clientCertCanUpload(file: { data?: string } | undefined, busy: boolean): boolean {
  return !busy && typeof file?.data === "string" && file.data !== "";
}

/** A server message as a sentence: a capital first and a full stop last. */
function sentence(text: string): string {
  const t = text.trim();
  if (t === "") return t;
  const capped = t[0]!.toUpperCase() + t.slice(1);
  return /[.!?]$/.test(capped) ? capped : `${capped}.`;
}

/** The card's line for a refusal. The two refusals about the file itself are
 * said in the server's own words; the rest name the step that failed. */
export function clientCertErrorText(err: unknown, step: "read" | "upload" | "remove"): string {
  const code = errorCode(err);
  if (code === "unknown_command") return CLIENT_CERT_UPDATE_TEXT;
  const raw = (err as { message?: unknown } | null | undefined)?.message;
  const message = typeof raw === "string" ? raw : String(err);
  if (code === "bad_passphrase") return sentence(message) || "That passphrase does not open this certificate.";
  if (code === "invalid_pkcs12") return sentence(message) || "That is not a .p12 file.";
  if (code === "too_large") return `That file is too large. ${sentence(message)}`.trim();
  const lead = step === "read" ? "Could not read the certificate" : step === "upload" ? "Could not upload" : "Could not remove";
  return `${lead}: ${message}`;
}
