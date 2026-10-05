// The notification style's model: the rows read from the table the app
// builds (`notification-style-keys.json`), the values the form shows, the
// document a save sends, the sounds' "None" and "Default", the volume's
// clamp and step, the first record, and the save that merges by key on a
// conflict. The shared fixtures (`fixtures-notification-style`) are the
// app's own bytes; a load and a save with no edit must give them back.

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";

import { describe, expect, it } from "vitest";

import table from "../src/watch-notification-style/notification-style-keys.json";
import type { WatchConfigRecord } from "../src/ha-api.js";
import {
  ABSENT,
  NOTIFICATION_STYLE_ICONS,
  NOTIFICATION_STYLE_SECTIONS,
  SILENT_SOUND,
  type StyleRow,
  buildStyleSaveDocument,
  clampStep,
  notificationStyleDefaults,
  notificationStyleReadMeansUnsupported,
  saveNotificationStyle,
  soundChoices,
  soundValueText,
  startNotificationStyle,
  styleDirtyKeys,
  styleFormValues,
  styleOptionsFor,
  styleRow,
  styleRows,
  styleRuns,
  styleTileChoices,
  styleUsesTiles,
  styleValue,
  volumeText,
  withStyleEdit,
  writableStyleValue,
} from "../src/watch-notification-style/model.js";
import { ACCENT_HEX, buttonColors, notificationPreview } from "../src/watch-notification-style/preview.js";

const fixtureDir = join(__dirname, "fixtures-notification-style");
const fixtureNames = readdirSync(fixtureDir).filter((f) => f.endsWith(".json")).sort();
const fixtureText = (name: string) => readFileSync(join(fixtureDir, name), "utf8");
const fixture = (name: string) => JSON.parse(fixtureText(name)) as Record<string, unknown>;

const row = (key: string): StyleRow => {
  const r = styleRow(key);
  if (r === undefined) throw new Error(`no row ${key}`);
  return r;
};

const refusal = (code: string, message = code) => Object.assign(new Error(message), { code });

// ── the fixtures ─────────────────────────────────────────────────────────

describe("the shared fixtures", () => {
  it("are all there", () => {
    expect(fixtureNames).toEqual(["01-defaults.json", "02-configured.json", "03-no-sound-overrides.json"]);
  });

  for (const name of fixtureNames) {
    it(`${name}: a load and a save with no edit gives the same bytes`, () => {
      const loaded = fixture(name);
      expect(styleDirtyKeys(loaded, new Map())).toEqual([]);
      expect(JSON.stringify(buildStyleSaveDocument(loaded, new Map()))).toBe(fixtureText(name));
    });

    it(`${name}: every row changed and changed back gives the same bytes`, () => {
      const loaded = fixture(name);
      let edits = new Map<string, string | boolean | number>();
      for (const r of styleRows()) {
        const shown = styleValue(r, loaded);
        const other = r.type === "bool" ? !shown
          : r.type === "number" ? 0.8
          : r.type === "sound" ? (shown === "Bell" ? "click_001" : "Bell")
          : (r.options!.find((o) => o.value !== shown)!.value);
        edits = withStyleEdit(edits, loaded, r, other);
        edits = withStyleEdit(edits, loaded, r, shown);
      }
      expect(edits.size).toBe(0);
      expect(JSON.stringify(buildStyleSaveDocument(loaded, edits))).toBe(fixtureText(name));
    });

    it(`${name}: shows every stored value as it is`, () => {
      const loaded = fixture(name);
      const values = styleFormValues(loaded);
      for (const r of styleRows()) {
        if (Object.hasOwn(loaded, r.key)) expect(values.get(r.key), r.key).toBe(loaded[r.key]);
      }
    });
  }

  it("starts a record with the defaults fixture, byte for byte", () => {
    expect(JSON.stringify(notificationStyleDefaults())).toBe(fixtureText("01-defaults.json"));
    expect(notificationStyleDefaults()).not.toBe(notificationStyleDefaults());
  });
});

// ── the rows ─────────────────────────────────────────────────────────────

describe("the rows", () => {
  it("shows every key of the table but schemaVersion, once each", () => {
    const shown = styleRows().map((r) => r.key);
    expect(new Set(shown).size).toBe(shown.length);
    expect([...shown].sort()).toEqual(Object.keys(table.keys).filter((k) => k !== "schemaVersion").sort());
  });

  it("has three cards in the phone's order, with the button press sound leading the sounds", () => {
    expect(NOTIFICATION_STYLE_SECTIONS.map((s) => s.title)).toEqual(["Notifications", "Sounds", "Wrist Webhooks"]);
    const groups = (i: number) => NOTIFICATION_STYLE_SECTIONS[i]!.groups.map((g) => [g.label, g.rows.map((r) => r.key)]);
    expect(groups(0)).toEqual([
      ["Style", ["backgroundStyle", "buttonFill", "buttonSize", "cornerStyle"]],
      ["Color", ["useEntityTintColor", "accentColor"]],
      ["Content", ["showButtonIcons", "showStateBadge", "stateBadgePosition", "stateBadgeSize", "stateBadgePill"]],
      ["Animation", ["tapAnimation"]],
      ["Delivery", ["storedDeliveryMode"]],
    ]);
    expect(groups(1)).toEqual([
      ["Volume", ["soundVolume"]],
      ["Sounds", ["buttonPressSound", "tileTapSound", "menuOpenSound", "slideToIconSound", "arcSlideTickSound", "successSound", "cancelSound"]],
    ]);
    expect(groups(2)).toEqual([["Notification Appearance", ["storedWebhookButtonSize"]]]);
  });

  it("offers each enum's values in the Swift order with the phone's labels", () => {
    for (const r of styleRows().filter((x) => x.type === "enum")) {
      const name = (table.keys as Record<string, { enum?: string }>)[r.key]!.enum!;
      expect(r.options!.map((o) => o.value), r.key).toEqual((table.enums as Record<string, string[]>)[name]);
      for (const o of r.options!) expect(o.label).toBe((table.labels as Record<string, Record<string, string>>)[name]![o.value]);
    }
    expect(row("storedDeliveryMode").options).toEqual([{ value: "fast", label: "Fast" }, { value: "reliable", label: "Reliable" }]);
    expect(row("stateBadgePosition").options!.map((o) => o.label)).toEqual(["Inside Button", "Below Button"]);
  });

  it("draws choices of up to five as tiles and the accent colors as a menu", () => {
    const tiled = styleRows().filter(styleUsesTiles).map((r) => r.key);
    expect(tiled).not.toContain("accentColor");
    expect(tiled).toContain("storedDeliveryMode");
    expect(tiled).toContain("buttonSize");
  });

  it("gives delivery's tiles the phone's line for each choice", () => {
    const tiles = styleTileChoices(row("storedDeliveryMode"), "fast");
    expect(tiles.map((t) => [t.value, t.name, t.detail, t.on])).toEqual([
      ["fast", "Fast", table.delivery.details.fast, true],
      ["reliable", "Reliable", table.delivery.details.reliable, false],
    ]);
  });

  it("names only symbols the panel ships", () => {
    const file = join(__dirname, "..", "..", "custom_components", "wrist_assistant", "frontend", "symbol-icons.json.gz");
    const shipped = new Set(Object.keys(JSON.parse(gunzipSync(readFileSync(file)).toString("utf8")) as Record<string, unknown>));
    const named = [...Object.values(NOTIFICATION_STYLE_ICONS), "lightbulb.fill", "door.garage.closed"];
    expect(named.filter((n) => !shipped.has(n))).toEqual([]);
    for (const r of styleRows()) expect(NOTIFICATION_STYLE_ICONS[r.key], r.key).toBeDefined();
  });

  it("shows the accent color only without the entity tint, and the badge's rows only with the badge", () => {
    const content = NOTIFICATION_STYLE_SECTIONS[0]!.groups[2]!;
    const color = NOTIFICATION_STYLE_SECTIONS[0]!.groups[1]!;
    const defaults = styleFormValues(notificationStyleDefaults());
    expect(styleRuns(color, defaults)).toEqual([{ row: row("useEntityTintColor"), dependents: [] }]);
    expect(styleRuns(content, defaults).map((r) => r.row.key)).toEqual(["showButtonIcons", "showStateBadge"]);
    const configured = styleFormValues(fixture("02-configured.json"));
    expect(styleRuns(color, configured)).toEqual([{ row: row("useEntityTintColor"), dependents: [row("accentColor")] }]);
    expect(styleRuns(content, configured)[1]!.dependents.map((r) => r.key)).toEqual(["stateBadgePosition", "stateBadgeSize", "stateBadgePill"]);
  });
});

// ── enums ────────────────────────────────────────────────────────────────

describe("enum writes", () => {
  const base = fixture("01-defaults.json");

  it("writes a picked value and nothing else", () => {
    const edits = withStyleEdit(new Map(), base, row("cornerStyle"), "rounded");
    expect(styleDirtyKeys(base, edits)).toEqual(["cornerStyle"]);
    expect(buildStyleSaveDocument(base, edits)).toEqual({ ...base, cornerStyle: "rounded" });
  });

  it("never writes a value the table does not list", () => {
    expect(writableStyleValue(row("cornerStyle"), "oval")).toBe(false);
    const edits = new Map([["cornerStyle", "oval"]]);
    expect(buildStyleSaveDocument(base, edits)).toEqual(base);
  });

  it("shows a stored value the table does not list as it is, and keeps it", () => {
    const odd = { ...base, buttonSize: "huge" };
    expect(styleValue(row("buttonSize"), odd)).toBe("huge");
    expect(styleOptionsFor(row("buttonSize"), "huge").at(-1)).toEqual({ value: "huge", label: "huge" });
    expect(buildStyleSaveDocument(odd, new Map())).toEqual(odd);
  });

  it("reads an absent delivery as Fast and leaves it absent until Reliable is picked", () => {
    expect(Object.hasOwn(base, "storedDeliveryMode")).toBe(false);
    const r = row("storedDeliveryMode");
    expect(styleValue(r, base)).toBe("fast");
    expect(withStyleEdit(new Map(), base, r, "fast").size).toBe(0);
    const edits = withStyleEdit(new Map(), base, r, "reliable");
    expect(buildStyleSaveDocument(base, edits).storedDeliveryMode).toBe("reliable");
  });

  it("reads an absent webhook button size as Medium", () => {
    expect(styleValue(row("storedWebhookButtonSize"), base)).toBe("medium");
    expect(styleValue(row("storedWebhookButtonSize"), fixture("02-configured.json"))).toBe("extraLarge");
  });

  it("never writes null", () => {
    const configured = fixture("02-configured.json");
    let edits = new Map<string, string | boolean | number>();
    for (const r of styleRows()) edits = withStyleEdit(edits, configured, r, r.default);
    const sent = buildStyleSaveDocument(configured, edits);
    expect(Object.values(sent).some((v) => v === null)).toBe(false);
  });
});

// ── the volume ───────────────────────────────────────────────────────────

describe("the volume", () => {
  const base = fixture("01-defaults.json");
  const volume = row("soundVolume");

  it("is a number from the table's range", () => {
    expect(volume.type).toBe("number");
    expect([table.volume.min, table.volume.max, table.volume.step]).toEqual([0, 1, 0.05]);
    expect(styleValue(volume, base)).toBe(0.05);
  });

  it("clamps and steps", () => {
    expect(clampStep(0.07, 0, 1, 0.05)).toBe(0.05);
    expect(clampStep(0.08, 0, 1, 0.05)).toBe(0.1);
    expect(clampStep(0.3, 0, 1, 0.05)).toBe(0.3);
    expect(clampStep(0.35, 0, 1, 0.05)).toBe(0.35);
    expect(clampStep(-0.2, 0, 1, 0.05)).toBe(0);
    expect(clampStep(1.4, 0, 1, 0.05)).toBe(1);
    expect(clampStep(Number.NaN, 0, 1, 0.05)).toBe(0);
    expect(withStyleEdit(new Map(), base, volume, 0.33).get("soundVolume")).toBe(0.35);
    expect(withStyleEdit(new Map(), base, volume, 2).get("soundVolume")).toBe(1);
    // A step that lands on what is stored is no edit.
    expect(withStyleEdit(new Map(), base, volume, 0.06).size).toBe(0);
  });

  it("reads as the phone's percent, and Silent at zero", () => {
    expect(volumeText(0.05)).toBe("5%");
    expect(volumeText(0.3)).toBe("30%");
    expect(volumeText(0)).toBe("Silent");
    expect(table.volume.presets.map((p) => p.label)).toEqual(["Silent", "Quiet", "Medium", "Loud"]);
  });

  it("shows a stored value of the wrong kind as the default and keeps it", () => {
    const odd = { ...base, soundVolume: "loud" };
    expect(styleValue(volume, odd)).toBe(0.05);
    expect(buildStyleSaveDocument(odd, new Map())).toEqual(odd);
  });
});

// ── sounds ───────────────────────────────────────────────────────────────

describe("sounds", () => {
  const base = fixture("01-defaults.json");
  const bare = fixture("03-no-sound-overrides.json");

  it("tells None (the silent key) from Default (the key left out)", () => {
    const r = row("tileTapSound");
    const silent = withStyleEdit(new Map(), base, r, SILENT_SOUND);
    expect(buildStyleSaveDocument(base, silent).tileTapSound).toBe("__silent__");
    const absent = withStyleEdit(new Map(), base, r, ABSENT);
    const sent = buildStyleSaveDocument(base, absent);
    expect(Object.hasOwn(sent, "tileTapSound")).toBe(false);
    expect(soundValueText(r, SILENT_SOUND)).toBe("None");
    expect(soundValueText(r, ABSENT)).toBe("Default (Button Press Sound)");
    expect(soundValueText(row("menuOpenSound"), ABSENT)).toBe("Default (Click 5)");
    expect(soundValueText(r, "glass_002")).toBe("Glass 2");
  });

  it("shows an absent sound as Default and keeps it absent", () => {
    for (const key of ["buttonPressSound", "tileTapSound", "cancelSound"]) expect(styleValue(row(key), bare)).toBe(ABSENT);
    expect(JSON.stringify(buildStyleSaveDocument(bare, new Map()))).toBe(fixtureText("03-no-sound-overrides.json"));
  });

  it("offers the button press sound no silent key: its None is the key left out", () => {
    const r = row("buttonPressSound");
    const choices = soundChoices(r, "click_003");
    expect(choices.lead).toEqual([{ value: ABSENT, label: "None" }]);
    expect(writableStyleValue(r, SILENT_SOUND)).toBe(false);
    expect(buildStyleSaveDocument(base, new Map([["buttonPressSound", SILENT_SOUND]]))).toEqual(base);
  });

  it("lists the phone's Short and Longer sounds after Default and None", () => {
    const choices = soundChoices(row("successSound"), "drop_003");
    expect(choices.lead.map((o) => o.label)).toEqual(["Default (Drop 3)", "None"]);
    expect(choices.groups.map((g) => g.label)).toEqual(["Short", "Longer"]);
    expect(choices.groups.flatMap((g) => g.options).length).toBe(table.sounds.categories.flatMap((c) => c.sounds).length);
  });

  it("keeps a stored sound it does not offer, as itself", () => {
    const r = row("successSound");
    const choices = soundChoices(r, "Bubble-Pop");
    expect(choices.lead.at(-1)).toEqual({ value: "Bubble-Pop", label: "Bubble-Pop" });
    expect(buildStyleSaveDocument({ ...base, successSound: "Bubble-Pop" }, new Map())).toEqual({ ...base, successSound: "Bubble-Pop" });
  });

  it("writes only sounds the watch bundles", () => {
    expect(writableStyleValue(row("successSound"), "Positive")).toBe(true);
    expect(writableStyleValue(row("successSound"), "nope")).toBe(false);
  });

  it("resets a sound to the file a fresh install writes", () => {
    expect(row("menuOpenSound").resetTo).toBe("click_005");
    expect(row("menuOpenSound").default).toBe(ABSENT);
  });
});

// ── saving ───────────────────────────────────────────────────────────────

function rec(revision: number, document?: Record<string, unknown>): WatchConfigRecord {
  return {
    kind: "notification_style", revision, hash: null, updated_at: null, updated_by: "w1",
    delivered_revision: revision, delivered_at: null, ...(document === undefined ? {} : { document }),
  };
}

describe("saving", () => {
  const base = fixture("01-defaults.json");

  it("sends the edits over the base revision", async () => {
    const sent: [number, Record<string, unknown>][] = [];
    const result = await saveNotificationStyle({
      save: async (b, d) => { sent.push([b, d]); return { revision: b + 1 }; },
      fetch: async () => { throw new Error("not read"); },
    }, { revision: 4, document: base }, new Map([["cornerStyle", "rounded"]]));
    expect(result).toMatchObject({ ok: true, revision: 5, merged: false, alreadySaved: false });
    expect(sent).toEqual([[4, { ...base, cornerStyle: "rounded" }]]);
  });

  it("merges by key on a conflict: the edit wins its key, the newer copy keeps the rest", async () => {
    const theirs = { ...base, tapAnimation: "pulse", cornerStyle: "square" };
    const sent: [number, Record<string, unknown>][] = [];
    const result = await saveNotificationStyle({
      save: async (b, d) => {
        sent.push([b, d]);
        if (b === 4) throw refusal("conflict", "stored revision is 6, save was based on 4");
        return { revision: 7 };
      },
      fetch: async () => rec(6, theirs),
    }, { revision: 4, document: base }, new Map([["cornerStyle", "rounded"]]));
    expect(result).toMatchObject({ ok: true, revision: 7, merged: true, alreadySaved: false });
    expect(sent[1]).toEqual([6, { ...base, tapAnimation: "pulse", cornerStyle: "rounded" }]);
  });

  it("sends nothing more when the newer copy already holds the edits", async () => {
    let sends = 0;
    const result = await saveNotificationStyle({
      save: async () => { sends++; throw refusal("conflict"); },
      fetch: async () => rec(6, { ...base, cornerStyle: "rounded" }),
    }, { revision: 4, document: base }, new Map([["cornerStyle", "rounded"]]));
    expect(sends).toBe(1);
    expect(result).toMatchObject({ ok: true, revision: 6, alreadySaved: true });
  });

  it("gives up after three sends and hands back the newest copy", async () => {
    let sends = 0;
    const result = await saveNotificationStyle({
      save: async () => { sends++; throw refusal("conflict"); },
      fetch: async () => rec(6 + sends, { ...base, tapAnimation: "flash" }),
    }, { revision: 4, document: base }, new Map([["cornerStyle", "rounded"]]));
    expect(sends).toBe(3);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("conflict");
      expect(result.fresh?.revision).toBe(8);
    }
  });

  it("says no_record when the newer read holds nothing", async () => {
    const result = await saveNotificationStyle({
      save: async () => { throw refusal("conflict"); },
      fetch: async () => rec(0),
    }, { revision: 4, document: base }, new Map([["cornerStyle", "rounded"]]));
    expect(result).toMatchObject({ ok: false, code: "no_record" });
  });

  it("starts with the defaults over revision 0", async () => {
    const sent: [number, Record<string, unknown>][] = [];
    const result = await startNotificationStyle(async (b, d) => { sent.push([b, d]); return { revision: 1 }; });
    expect(result).toMatchObject({ ok: true, revision: 1 });
    expect(sent).toEqual([[0, fixture("01-defaults.json")]]);
    expect(await startNotificationStyle(async () => { throw refusal("no_record"); })).toMatchObject({ ok: false, code: "no_record" });
    expect(await startNotificationStyle(async () => { throw refusal("conflict"); })).toMatchObject({ ok: false, code: "conflict" });
    expect(await startNotificationStyle(async () => { throw refusal("unknown_command"); })).toMatchObject({ ok: false, code: "unsupported" });
  });

  it("reads invalid and unknown_command as an integration without the kind", () => {
    expect(notificationStyleReadMeansUnsupported(refusal("invalid"))).toBe(true);
    expect(notificationStyleReadMeansUnsupported(refusal("unknown_command"))).toBe(true);
    expect(notificationStyleReadMeansUnsupported(refusal("unavailable"))).toBe(false);
  });
});

// ── the preview ──────────────────────────────────────────────────────────

describe("the preview", () => {
  interface Tpl { strings: readonly string[]; values: unknown[] }
  const isTpl = (n: unknown): n is Tpl => typeof n === "object" && n !== null && "strings" in n && "values" in n;
  const flatten = (n: unknown): string => {
    if (n === undefined || n === null || typeof n === "symbol") return "";
    if (Array.isArray(n)) return n.map(flatten).join("");
    if (isTpl(n)) return n.strings.map((s, i) => s + (i < n.values.length ? flatten(n.values[i]) : "")).join("");
    if (typeof n === "function" || typeof n === "object") return "";
    return String(n);
  };

  it("draws from the form's values: background, fill, corners, size, icons and badge", () => {
    const asked: string[] = [];
    const glyph = (name: string) => { asked.push(name); return undefined; };
    const plain = flatten(notificationPreview(styleFormValues(fixture("01-defaults.json")), glyph));
    expect(plain).toContain("data-bg=black");
    expect(plain).toContain("data-fill=tinted");
    expect(plain).toContain("--ns-r:5.8px"); // sharp, 8 points
    expect(plain).not.toContain("ns-pv-badge");
    expect(asked).toEqual(["lightbulb.fill", "door.garage.closed"]);
    asked.length = 0;
    const configured = flatten(notificationPreview(styleFormValues(fixture("02-configured.json")), glyph));
    expect(configured).toContain("data-bg=glass");
    expect(configured).toContain("--ns-r:11.5px"); // rounded, 16 points
    expect(configured).toContain("ns-pv-below");
    expect(configured).not.toContain("ns-pv-ic");
    expect(asked).toEqual([]);
    // Glass buttons wear no accent; tinted ones without the entity tint wear
    // the teal accent on the lit button.
    expect(configured).not.toContain(ACCENT_HEX.teal);
    const tinted = flatten(notificationPreview(styleFormValues({ ...fixture("02-configured.json"), buttonFill: "tinted" }), glyph));
    expect(tinted).toContain(`color-mix(in srgb, ${ACCENT_HEX.teal} 12%, transparent)`);
  });

  it("works out each fill's colors as the watch does", () => {
    expect(buttonColors("tinted", "#fff", true).background).toContain("12%");
    expect(buttonColors("solid", "#fff", true).background).toContain("25%");
    expect(buttonColors("outlined", "#fff", false)).toMatchObject({ background: "#0f0f0f", width: 1 });
    expect(Object.keys(ACCENT_HEX).sort()).toEqual([...table.enums.AccentColor].sort());
  });
});
