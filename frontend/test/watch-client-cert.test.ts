// The client certificate card on the Settings page: the size guard on a
// picked file, reading it as base64, the short fingerprint, what a status
// reads as, the refusals in words, and the card itself driven over a stand-in
// Home Assistant (read once on opening, upload, a wrong passphrase, removal).

import { afterEach, describe, expect, it, vi } from "vitest";

import type { ClientCertificateStatus, HaUser, HassLike } from "../src/ha-api.js";
import {
  CLIENT_CERT_FOR_HINT,
  CLIENT_CERT_FOR_TITLE,
  CLIENT_CERT_MAX_BYTES,
  CLIENT_CERT_SAVED_NOTE,
  CLIENT_CERT_UPDATE_TEXT,
  base64OfDataUrl,
  clientCertCanUpload,
  clientCertDateText,
  clientCertErrorText,
  clientCertOtherName,
  clientCertRemoveAsk,
  clientCertSavedNote,
  clientCertSizeProblem,
  clientCertSourceText,
  clientCertUploadTitle,
  clientCertView,
  readFileAsBase64,
  shortFingerprint,
} from "../src/watch-client-cert.js";
import { ClientCertCard } from "../src/watch-client-cert-view.js";

interface Tpl {
  strings: readonly string[];
  values: unknown[];
}

const isTpl = (node: unknown): node is Tpl => typeof node === "object" && node !== null && "strings" in node && "values" in node;

function flatten(node: unknown): string {
  if (node === undefined || node === null || typeof node === "symbol") return "";
  if (Array.isArray(node)) return node.map(flatten).join("");
  if (isTpl(node)) return node.strings.map((s, i) => s + (i < node.values.length ? flatten(node.values[i]) : "")).join("");
  if (typeof node === "function" || typeof node === "object") return "";
  return String(node);
}

const refusal = (code: string, message: string) => Object.assign(new Error(message), { code });

const FP = "AB:CD:EF:01:23:45:67:89:AB:CD:EF:01:23:45:67:89:00:11";

const held = (extra: Partial<ClientCertificateStatus> = {}): ClientCertificateStatus => ({
  present: true, fingerprint: FP, updated_at: "2026-10-07T12:00:00Z", revision: 3, source: "panel", ...extra,
});

const none: ClientCertificateStatus = { present: false, fingerprint: null, updated_at: null, revision: 0, source: null };

/** A stand-in `FileReader` that hands back `result`, or fails. */
function stubReader(result: string | undefined) {
  class Reader {
    result: string | null = null;
    error: Error | null = null;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    readAsDataURL() {
      queueMicrotask(() => {
        if (result === undefined) {
          this.error = new Error("read failed");
          this.onerror?.();
        } else {
          this.result = result;
          this.onload?.();
        }
      });
    }
  }
  vi.stubGlobal("FileReader", Reader);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("the size guard", () => {
  it("takes a file of a few KB, up to the limit", () => {
    expect(clientCertSizeProblem(3_000)).toBeUndefined();
    expect(clientCertSizeProblem(CLIENT_CERT_MAX_BYTES)).toBeUndefined();
  });

  it("refuses an empty file and one over the integration's 32 KB, saying why", () => {
    expect(CLIENT_CERT_MAX_BYTES).toBe(32_768);
    expect(clientCertSizeProblem(0)).toBe("That file is empty.");
    expect(clientCertSizeProblem(CLIENT_CERT_MAX_BYTES + 1)).toBe("That file is 33 KB, over the 32 KB limit. A .p12 file is only a few KB.");
    expect(clientCertSizeProblem(2_000_000)).toContain("1954 KB");
  });
});

describe("reading the file as base64", () => {
  it("takes the base64 part of a data URL, and nothing else", () => {
    expect(base64OfDataUrl("data:application/x-pkcs12;base64,MIIK")).toBe("MIIK");
    expect(base64OfDataUrl("data:application/octet-stream;base64,")).toBe("");
    expect(base64OfDataUrl("data:text/plain,hello")).toBeUndefined();
    expect(base64OfDataUrl("MIIK")).toBeUndefined();
  });

  it("reads a file with FileReader", async () => {
    stubReader("data:application/x-pkcs12;base64,MIIKAgEDMIIJ");
    await expect(readFileAsBase64(new Blob(["x"]))).resolves.toBe("MIIKAgEDMIIJ");
  });

  it("rejects when the reader fails or hands back something else", async () => {
    stubReader(undefined);
    await expect(readFileAsBase64(new Blob(["x"]))).rejects.toThrow("read failed");
    stubReader("not a data url");
    await expect(readFileAsBase64(new Blob(["x"]))).rejects.toThrow("could not be read");
  });
});

describe("the fingerprint", () => {
  it("shows its first 16 hex digits, separators dropped", () => {
    expect(shortFingerprint(FP)).toBe("ABCDEF0123456789");
    expect(shortFingerprint("abcdef0123456789abcdef")).toBe("abcdef0123456789");
    expect(shortFingerprint("ab cd")).toBe("abcd");
  });

  it("is nothing when there is none", () => {
    expect(shortFingerprint(null)).toBeUndefined();
    expect(shortFingerprint(undefined)).toBeUndefined();
    expect(shortFingerprint("::")).toBeUndefined();
  });
});

describe("what a status reads as", () => {
  it("names where the certificate came from", () => {
    expect(clientCertSourceText("panel")).toBe("Uploaded here");
    expect(clientCertSourceText("iphone")).toBe("From the iPhone app");
    expect(clientCertSourceText("other")).toBeUndefined();
  });

  it("writes the date short, and nothing for a missing or broken one", () => {
    expect(clientCertDateText("2026-10-07T12:00:00Z", "en-GB")).toBe("7 Oct 2026");
    expect(clientCertDateText(null)).toBeUndefined();
    expect(clientCertDateText("")).toBeUndefined();
    expect(clientCertDateText("not a date")).toBeUndefined();
  });

  it("is Installed with the fingerprint, the date and the source while one is held", () => {
    expect(clientCertView(held(), "en-GB")).toEqual({
      installed: true,
      state: "Installed",
      fingerprint: { short: "ABCDEF0123456789", full: FP },
      added: "7 Oct 2026 · Uploaded here",
    });
    expect(clientCertView(held({ source: "iphone", updated_at: null }), "en-GB").added).toBe("From the iPhone app");
    expect(clientCertView(held({ fingerprint: null }), "en-GB").fingerprint).toBeUndefined();
  });

  it("is None when there is no certificate, or no status yet", () => {
    expect(clientCertView(none)).toEqual({ installed: false, state: "None" });
    expect(clientCertView(undefined)).toEqual({ installed: false, state: "None" });
  });

  it("lets Upload run only with a file read and nothing running", () => {
    expect(clientCertCanUpload(undefined, false)).toBe(false);
    expect(clientCertCanUpload({}, false)).toBe(false);
    expect(clientCertCanUpload({ data: "" }, false)).toBe(false);
    expect(clientCertCanUpload({ data: "MIIK" }, true)).toBe(false);
    expect(clientCertCanUpload({ data: "MIIK" }, false)).toBe(true);
  });
});

describe("refusals in words", () => {
  it("says the two file refusals in the server's words, as a sentence", () => {
    expect(clientCertErrorText(refusal("bad_passphrase", "wrong passphrase"), "upload")).toBe("Wrong passphrase.");
    expect(clientCertErrorText(refusal("invalid_pkcs12", "not a .p12 file"), "upload")).toBe("Not a .p12 file.");
    expect(clientCertErrorText(refusal("invalid_pkcs12", "Not a .p12 file."), "upload")).toBe("Not a .p12 file.");
  });

  it("falls back to its own words when the server gives none", () => {
    expect(clientCertErrorText(refusal("bad_passphrase", ""), "upload")).toBe("That passphrase does not open this certificate.");
    expect(clientCertErrorText(refusal("invalid_pkcs12", " "), "upload")).toBe("That is not a .p12 file.");
  });

  it("says a file the integration finds too large is too large", () => {
    expect(clientCertErrorText(refusal("too_large", "a .p12 is at most 32 KiB"), "upload")).toBe("That file is too large. A .p12 is at most 32 KiB.");
  });

  it("asks for a newer integration when the command is unknown", () => {
    expect(clientCertErrorText(refusal("unknown_command", "Unknown command."), "read")).toBe(CLIENT_CERT_UPDATE_TEXT);
  });

  it("names the step for anything else", () => {
    expect(clientCertErrorText(refusal("unavailable", "not ready"), "read")).toBe("Could not read the certificate: not ready");
    expect(clientCertErrorText(refusal("home_assistant_error", "disk full"), "upload")).toBe("Could not upload: disk full");
    expect(clientCertErrorText(new Error("socket closed"), "remove")).toBe("Could not remove: socket closed");
  });
});

interface Inside {
  file?: { name: string; bytes: number; data?: string };
  passphrase: string;
  error?: string;
  askRemove: boolean;
  replacing: boolean;
  pick(input: { files: unknown[]; value: string }): Promise<void>;
  upload(): Promise<void>;
  remove(): Promise<void>;
  pickUser(userId: string): void;
}

function fakeHass(start: ClientCertificateStatus | "old", users?: HaUser[], admin = true) {
  const sent: Record<string, unknown>[] = [];
  let status = start;
  const others = new Map<string, ClientCertificateStatus>(
    (users ?? []).filter((u) => u.id !== "u-admin" && u.is_active !== false).map((u) => [u.id, none]),
  );
  const hass = {
    states: {},
    user: { id: "u-admin", is_admin: admin, name: "Jesse" },
    connection: {
      async sendMessagePromise(msg: Record<string, unknown>): Promise<unknown> {
        sent.push(msg);
        if (msg.type === "config/auth/list") {
          // Home Assistant's own rule: administrators only.
          if (!admin) throw refusal("unauthorized", "Unauthorized");
          if (users === undefined) throw refusal("unknown_command", "Unknown command.");
          return users;
        }
        if (status === "old") throw refusal("unknown_command", "Unknown command.");
        // Each person their own record; the signed in one's is `status`.
        const who = msg.user_id;
        if (who !== undefined && !others.has(String(who))) {
          throw refusal("invalid_user", "Pick an active Home Assistant user for this certificate.");
        }
        const current = who === undefined ? status : others.get(String(who))!;
        const keep = (next: ClientCertificateStatus) => {
          if (who === undefined) status = next;
          else others.set(String(who), next);
          return next;
        };
        if (msg.type === "wrist_assistant/client_certificate/status") return current;
        if (msg.type === "wrist_assistant/client_certificate/put") {
          if (msg.passphrase !== "right") throw refusal("bad_passphrase", "wrong passphrase");
          return keep(held({ revision: current.revision + 1 }));
        }
        if (msg.type === "wrist_assistant/client_certificate/delete") {
          return keep({ ...none, revision: current.revision + 1 });
        }
        throw refusal("unknown_command", "Unknown command.");
      },
      async subscribeMessage() {
        return async () => undefined;
      },
    },
  } as unknown as HassLike;
  return { hass, sent, others, mine: () => status };
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("the card", () => {
  async function card(start: ClientCertificateStatus | "old", users?: HaUser[]) {
    const ha = fakeHass(start, users);
    const c = new ClientCertCard(() => undefined);
    c.open(ha.hass);
    await settle();
    return { c, inside: c as unknown as Inside, ha, text: () => flatten(c.render()) };
  }

  it("reads the status once on opening, and shows what is held", async () => {
    const { ha, text } = await card(held({ source: "iphone" }));
    expect(ha.sent.filter((m) => m.type !== "config/auth/list")).toEqual([{ type: "wrist_assistant/client_certificate/status" }]);
    const shown = text();
    expect(shown).toContain("Client certificate");
    expect(shown).toContain("Installed");
    expect(shown).toContain("ABCDEF0123456789");
    expect(shown).toContain("From the iPhone app");
    expect(shown).toContain(">Replace</button>");
    expect(shown).toContain(">Remove</button>");
    // No upload form until Replace is pressed.
    expect(shown).not.toContain(`type="password"`);
    // Drawing again reads nothing.
    const before = ha.sent.length;
    text();
    expect(ha.sent).toHaveLength(before);
  });

  it("offers the upload form when there is none, Upload off until a file is read", async () => {
    stubReader("data:application/x-pkcs12;base64,MIIK");
    const { inside, text } = await card(none);
    expect(text()).toContain(`type="password"`);
    expect(text()).toContain("No file chosen");
    expect(inside.file).toBeUndefined();
    await inside.pick({ files: [{ name: "home.p12", size: 2_400 }], value: "C:\\fakepath\\home.p12" });
    expect(inside.file).toEqual({ name: "home.p12", bytes: 2_400, data: "MIIK" });
    expect(text()).toContain("home.p12");
  });

  it("refuses a file over the limit without reading it", async () => {
    const { inside, text } = await card(none);
    await inside.pick({ files: [{ name: "big.pfx", size: 200_000 }], value: "big.pfx" });
    expect(inside.file).toBeUndefined();
    expect(text()).toContain("over the 32 KB limit");
  });

  it("shows a wrong passphrase inline and keeps the file, then uploads", async () => {
    stubReader("data:application/x-pkcs12;base64,MIIK");
    const { inside, ha, text } = await card(none);
    await inside.pick({ files: [{ name: "home.p12", size: 2_400 }], value: "" });
    inside.passphrase = "wrong";
    await inside.upload();
    expect(text()).toContain("Wrong passphrase.");
    expect(inside.file?.data).toBe("MIIK");
    inside.passphrase = "right";
    await inside.upload();
    const put = ha.sent.filter((m) => m.type === "wrist_assistant/client_certificate/put").at(-1);
    expect(put).toEqual({ type: "wrist_assistant/client_certificate/put", pkcs12: "MIIK", passphrase: "right" });
    expect(inside.file).toBeUndefined();
    expect(inside.passphrase).toBe("");
    const shown = text();
    expect(shown).toContain("Installed");
    expect(shown).toContain(CLIENT_CERT_SAVED_NOTE);
  });

  it("asks before Remove, then removes", async () => {
    const { inside, ha, text } = await card(held());
    inside.askRemove = true;
    expect(text()).toContain("Remove this certificate?");
    await inside.remove();
    expect(ha.sent.at(-1)).toEqual({ type: "wrist_assistant/client_certificate/delete" });
    const shown = text();
    expect(shown).not.toContain("Installed");
    expect(shown).toContain(CLIENT_CERT_SAVED_NOTE);
    expect(shown).toContain(`type="password"`);
  });

  it("asks for a newer integration on one that does not know the commands", async () => {
    const { text } = await card("old");
    expect(text()).toContain(CLIENT_CERT_UPDATE_TEXT);
    expect(text()).not.toContain(`type="password"`);
  });
});

const PEOPLE: HaUser[] = [
  { id: "u-admin", name: "Jesse", is_active: true, group_ids: ["system-admin"] },
  { id: "u-anna", name: "Anna", is_active: true, group_ids: ["system-users"] },
  { id: "u-old", name: "Old account", is_active: false },
  { id: "u-super", name: "Supervisor", is_active: true, system_generated: true },
];

describe("the For menu", () => {
  async function card(start: ClientCertificateStatus, users?: HaUser[], admin = true) {
    const ha = fakeHass(start, users, admin);
    const c = new ClientCertCard(() => undefined);
    c.open(ha.hass);
    await settle();
    return { c, inside: c as unknown as Inside, ha, text: () => flatten(c.render()) };
  }

  const certCommands = (sent: Record<string, unknown>[]) => sent.filter((m) => String(m.type).startsWith("wrist_assistant/client_certificate/"));

  it("lists the people pairing offers, starting on the signed in administrator", async () => {
    const { ha, text } = await card(held(), PEOPLE);
    const shown = text();
    expect(shown).toContain(CLIENT_CERT_FOR_TITLE);
    expect(shown).toContain(CLIENT_CERT_FOR_HINT);
    expect(shown).toContain("Jesse (you) · Admin");
    expect(shown).toContain("Anna · User");
    expect(shown).not.toContain("Old account");
    expect(shown).not.toContain("Supervisor");
    // The administrator's own status, read with no user named.
    expect(certCommands(ha.sent)).toEqual([{ type: "wrist_assistant/client_certificate/status" }]);
    expect(shown).toContain("Installed");
  });

  it("shows no menu, and never reads the people, for someone who is not an administrator", async () => {
    const { ha, text } = await card(held(), PEOPLE, false);
    expect(ha.sent.filter((m) => m.type === "config/auth/list")).toEqual([]);
    expect(text()).not.toContain(CLIENT_CERT_FOR_HINT);
    expect(text()).not.toContain("Anna");
    expect(certCommands(ha.sent)).toEqual([{ type: "wrist_assistant/client_certificate/status" }]);
    expect(text()).toContain("Installed");
  });

  it("shows no menu with one person, or when the people cannot be read", async () => {
    const one = await card(held(), [PEOPLE[0]!]);
    expect(one.text()).not.toContain(CLIENT_CERT_FOR_HINT);
    const unread = await card(held());
    expect(unread.text()).not.toContain(CLIENT_CERT_FOR_HINT);
    expect(unread.text()).toContain("Installed");
  });

  it("reads, uploads and removes the chosen person's certificate", async () => {
    stubReader("data:application/x-pkcs12;base64,MIIK");
    const { inside, ha, text } = await card(held(), PEOPLE);
    inside.pickUser("u-anna");
    await settle();
    expect(certCommands(ha.sent).at(-1)).toEqual({ type: "wrist_assistant/client_certificate/status", user_id: "u-anna" });
    // Anna has none, so the upload form shows, though the administrator has one.
    expect(text()).toContain("None");
    expect(text()).toContain(`type="password"`);
    await inside.pick({ files: [{ name: "anna.p12", size: 2_400 }], value: "" });
    inside.passphrase = "right";
    await inside.upload();
    expect(certCommands(ha.sent).at(-1)).toEqual({
      type: "wrist_assistant/client_certificate/put", pkcs12: "MIIK", passphrase: "right", user_id: "u-anna",
    });
    expect(ha.others.get("u-anna")?.present).toBe(true);
    // The administrator's own record is untouched.
    expect(ha.mine()).toEqual(held());
    expect(text()).toContain(clientCertSavedNote("Anna"));
    inside.askRemove = true;
    expect(text()).toContain(clientCertRemoveAsk("Anna"));
    await inside.remove();
    expect(certCommands(ha.sent).at(-1)).toEqual({ type: "wrist_assistant/client_certificate/delete", user_id: "u-anna" });
    expect(ha.others.get("u-anna")?.present).toBe(false);
  });

  it("sends no user when the administrator is picked again", async () => {
    const { inside, ha } = await card(held(), PEOPLE);
    inside.pickUser("u-anna");
    await settle();
    inside.pickUser("u-admin");
    await settle();
    expect(certCommands(ha.sent).at(-1)).toEqual({ type: "wrist_assistant/client_certificate/status" });
  });

  it("drops a picked file and passphrase when the person changes", async () => {
    stubReader("data:application/x-pkcs12;base64,MIIK");
    const { inside } = await card(none, PEOPLE);
    await inside.pick({ files: [{ name: "home.p12", size: 2_400 }], value: "" });
    inside.passphrase = "secret";
    inside.pickUser("u-anna");
    await settle();
    expect(inside.file).toBeUndefined();
    expect(inside.passphrase).toBe("");
  });
});

describe("the words for another person", () => {
  const choices = [
    { id: "u-admin", label: "Jesse (you) · Admin", name: "Jesse", admin: true },
    { id: "u-anna", label: "Anna · User", name: "Anna", admin: false },
  ];

  it("names the person only when it is not the administrator at the card", () => {
    expect(clientCertOtherName(choices, "u-anna", "u-admin")).toBe("Anna");
    expect(clientCertOtherName(choices, "u-admin", "u-admin")).toBeUndefined();
    expect(clientCertOtherName(undefined, "u-anna", "u-admin")).toBeUndefined();
    expect(clientCertOtherName([choices[0]!], "u-anna", "u-admin")).toBeUndefined();
  });

  it("keeps the old words for the administrator and names anyone else", () => {
    expect(clientCertSavedNote()).toBe(CLIENT_CERT_SAVED_NOTE);
    expect(clientCertSavedNote("Anna")).toBe("Saved for Anna. Their watch and iPhone pick it up the next time they open the app.");
    expect(clientCertRemoveAsk("Anna")).toContain("for Anna?");
    expect(clientCertUploadTitle()).toContain("your devices");
    expect(clientCertUploadTitle("Anna")).toContain("for Anna");
  });

  it("says a refused person in the server's words", () => {
    expect(clientCertErrorText(refusal("invalid_user", "pick an active Home Assistant user for this certificate"), "read"))
      .toBe("Pick an active Home Assistant user for this certificate.");
  });
});
