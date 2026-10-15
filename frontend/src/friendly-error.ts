// One plain sentence for an error the panel shows.
//
// Home Assistant's WebSocket refuses a command with a code and a message, and
// the integration's messages are written for logs: "integration not ready",
// "not a device paired to this user", "document exceeds 262144 bytes". Those
// are true, but a person new to the panel cannot act on them. This maps the
// ones the integration really sends to words that say what happened and what
// to do. Anything it does not know is shown as it came, since a raw message
// still beats no message. `rawErrorText` keeps the original for a tooltip.
//
// The codes and messages are the integration's own: `*_ws.py`,
// `panel_access.py` (NOT_YOURS), `complication_store.py`, `parts_store.py`.
// Modelled on `pairErrorText` (watch-settings.ts) and `galleryErrorMessage`
// (gallery.ts).

/** The words for an integration that is still loading, the most common
 * refusal right after Home Assistant restarts. */
export const NOT_READY_TEXT = "Wrist Assistant is still starting. Try again in a moment.";
/** An integration older than this panel, which does not know a command. */
export const UPDATE_INTEGRATION_TEXT = "Update the Wrist Assistant integration in HACS, then reload this page.";
/** A design written by a newer panel than this one: a schema version past
 * what it reads, or keys it does not know. The version numbers and key names
 * go in a tooltip or a fold, never in this line. */
export const NEWER_VERSION_TEXT = "Made with a newer Wrist Assistant. Update the integration in HACS, then reload this page.";

/** The code and message of an error, wherever the socket put them. A command
 * that dies with the connection rejects with the whole result, so the error
 * sits one level down there. */
function parts(err: unknown): { code: string | undefined; message: string } {
  const e = err as { code?: unknown; message?: unknown; error?: { code?: unknown; message?: unknown } } | null | undefined;
  const inner = e !== null && typeof e === "object" && e.error !== null && typeof e.error === "object" ? e.error : undefined;
  const rawCode = e?.code ?? inner?.code;
  const code = typeof rawCode === "string" ? rawCode : typeof rawCode === "number" ? String(rawCode) : undefined;
  const rawMessage = e?.message ?? inner?.message;
  const message = rawMessage === undefined || rawMessage === null ? (inner === undefined ? String(err) : "") : String(rawMessage);
  return { code, message };
}

/** The error exactly as it came, for a tooltip under the plain words. */
export function rawErrorText(err: unknown): string {
  const { code, message } = parts(err);
  return message !== "" ? message : (code ?? String(err));
}

/** One sentence for an error, or the raw message when it is not one this
 * knows. */
export function friendlyError(err: unknown): string {
  const { code, message } = parts(err);
  const m = message.trim();
  const lower = m.toLowerCase();

  if (lower === "integration not ready") return NOT_READY_TEXT;
  if (lower === "not a device paired to this user") return "This device belongs to someone else.";
  if (lower === "connection lost" || code === "3") return "Lost the connection to Home Assistant. Try again once it is back.";
  if (code === "unknown_command") return UPDATE_INTEGRATION_TEXT;
  if (code === "timeout") return "Home Assistant took too long to answer. Try again.";

  // Complications and their history.
  if (lower === "no such complication") return "This complication was deleted.";
  if (lower === "no such revision") return "That version is no longer in the history.";
  if (lower === "no preview of that revision") return "There is no picture of that version.";
  if (lower === "no such part") return "This part was deleted.";
  if (lower === "a part needs a name" || lower === "document.name must not be empty") return "Give it a name first.";
  if (/^document exceeds \d+ bytes$/.test(lower)) return "This design is too big to save. Remove some layers or pictures.";
  const layers = /^document\.elements exceeds (\d+) layers$/.exec(lower);
  if (layers) return `This design has too many layers. It can have ${layers[1]} at most.`;
  const full = /^owner already has (\d+) complications$/.exec(lower);
  if (full) return `This device already has ${full[1]} complications, the most it can hold. Remove one first.`;
  const held = /^slot \d+ already holds "(.*)" for the .* shape on this device; pick another slot$/.exec(m);
  if (held) return `"${held[1]}" is already in that slot. Pick another slot.`;
  if (/^document\.schemaVersion \d+ is newer than this integration supports/.test(m)) return NEWER_VERSION_TEXT;

  // Devices.
  if (/^no registered device with id /.test(lower) || /is not a registered device; pair it first/.test(lower)) {
    return "That device is not paired any more. Pair it again first.";
  }
  const nameCap = /^a name is at most (\d+) characters$/.exec(lower);
  if (nameCap) return `A name can be ${nameCap[1]} characters at most.`;

  if (code === "unauthorized") return "Your Home Assistant user is not allowed to do that.";
  if (code === "unavailable" && m === "") return NOT_READY_TEXT;
  return m !== "" ? m : rawErrorText(err);
}

/** The raw text for a `title` tooltip, or undefined when the plain words
 * already are the raw text, so a tooltip never repeats the line. */
export function rawErrorTitle(err: unknown): string | undefined {
  const raw = rawErrorText(err);
  return raw === friendlyError(err) ? undefined : raw;
}
