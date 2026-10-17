// Menus linked across devices: the rules the menu editor's Devices menu
// draws from (`menu-links.ts`), its drawing (`menu-devices.ts`), the link
// call, and the editor's Devices entry, badge, card line and replace
// question.

import { html } from "lit";
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { type HassLike, type OwnerSummary, type WatchConfigRecord, type WatchPagesPlaces, linkWatchMenus } from "../src/ha-api.js";
import { takeWatchMenusRecord } from "../src/watch-menus/draft.js";
import { renderMenuDevicesMenu } from "../src/watch-menus/menu-devices.js";
import "../src/watch-menus/menu-editor.js";
import {
  MENU_DEVICES_HERE_TEXT,
  MENU_DEVICES_SWITCHER_TEXT,
  MENU_DEVICES_WAIT_TEXT,
  MENU_LINKS_UPDATE_TEXT,
  MENU_PHRASE_GAP_TEXT,
  MENU_UNLINK_ATTEMPTS,
  menuAlsoAddsText,
  menuDeviceTitle,
  menuDevicePlaces,
  menuDevicesGroups,
  menuHasSpeakPhrase,
  menuLinkBadgeText,
  menuLinkErrorText,
  menuLinkUnitOf,
  menuLinksKnown,
  menuReplaceAskText,
  menuUnitHolders,
  menuUnitLinkId,
  menuUnitTargets,
  unlinkMenuUnit,
  withoutMenuUnitLink,
} from "../src/watch-menus/menu-links.js";
import { type MenusViewHost, renderMenuInspector, renderMenusCard } from "../src/watch-menus/menu-view.js";
import { type MenusDocument, setWatchMenuStyle } from "../src/watch-menus/model.js";
import { type LinkDevice, linkDevicesOf } from "../src/watch-pages/links.js";

const DEFAULTS = JSON.parse(readFileSync(join(__dirname, "fixtures-menus", "01-defaults.json"), "utf8")) as MenusDocument;

const flat = (v: unknown): string => {
  if (Array.isArray(v)) return v.map(flat).join("");
  if (v !== null && typeof v === "object" && "strings" in v && "values" in v) {
    const r = v as { strings: readonly string[]; values: unknown[] };
    return r.strings.map((s, i) => s + (i < r.values.length ? flat(r.values[i]) : "")).join("");
  }
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" ? String(v) : "";
};

const WATCH = "watch-a";
const PHONE = "phone-a";
const OTHER = "watch-b";
const DEVICES: LinkDevice[] = [
  { ownerId: WATCH, name: "Jesse's Watch", kind: "watch" },
  { ownerId: PHONE, name: "Jesse's iPhone", kind: "iphone" },
  { ownerId: OTHER, name: "Chen's Watch", kind: "watch" },
];
const ANY_LINK = "a".repeat(32);
const ENTITY_LINK = "b".repeat(32);

/** The defaults with `linkIds` at its sorted place. */
function linked(links: Record<string, string>): MenusDocument {
  const out: MenusDocument = {};
  for (const [k, v] of Object.entries(DEFAULTS)) {
    if (k === "pageSwitcher") out.linkIds = links;
    out[k] = v;
  }
  return out;
}

const PLACES: WatchPagesPlaces = {
  pages: {},
  status_pages: {},
  menus: {
    [ANY_LINK]: { unit: "anywhere", owners: [PHONE, WATCH] },
    [ENTITY_LINK]: { unit: "entity", owners: [OTHER, PHONE, WATCH] },
  },
};

const PAGE = "5A17E000-0000-4000-8000-000000000001";
const GARAGE = "5A17E000-0000-4000-8000-000000000002";
const STATUS = "5A17E000-0000-4000-8000-0000000000F1";

/** A slot opening `action`. */
function slot(id: string, action: Record<string, unknown>): Record<string, unknown> {
  return { id, position: "topLeft", action, icon: "star", color: "#FFFFFF" };
}

/** The defaults with Anywhere slots that open pages, a status page and a
 * phrase, and an entity's own menu opening a page. */
function withTargets(): MenusDocument {
  const doc = structuredClone(DEFAULTS);
  const qa = doc.quickAction as Record<string, unknown>;
  qa.slots = [
    slot("00000000-0000-4000-8000-000000000001", { type: "navigateToPage", pageId: PAGE }),
    slot("00000000-0000-4000-8000-000000000002", { type: "showStatusPage", pageId: STATUS }),
    slot("00000000-0000-4000-8000-000000000003", { type: "navigateToPage", pageId: PAGE.toLowerCase() }),
    slot("00000000-0000-4000-8000-000000000004", { type: "speakPhrase", phraseId: "00000000-0000-4000-8000-0000000000AA" }),
  ];
  const radial = doc.entityRadial as Record<string, unknown>;
  radial.entityOverrides = { "light.kitchen": [slot("00000000-0000-4000-8000-000000000005", { type: "navigateToPage", pageId: GARAGE })] };
  return doc;
}

describe("a menu's link", () => {
  it("reads the unit's link id, and the switcher goes with the Anywhere menu", () => {
    const doc = linked({ anywhere: ANY_LINK, entity: ENTITY_LINK });
    expect(menuUnitLinkId(doc, "anywhere")).toBe(ANY_LINK);
    expect(menuUnitLinkId(doc, "entity")).toBe(ENTITY_LINK);
    expect(menuUnitLinkId(DEFAULTS, "anywhere")).toBeUndefined();
    expect(menuUnitLinkId(linked({ anywhere: "" }), "anywhere")).toBeUndefined();
    expect(menuLinkUnitOf("anywhere")).toBe("anywhere");
    expect(menuLinkUnitOf("switcher")).toBe("anywhere");
    expect(menuLinkUnitOf("entity")).toBe("entity");
  });

  it("lists the holders here first, and only the unit's own link", () => {
    const doc = linked({ anywhere: ANY_LINK, entity: ENTITY_LINK });
    expect(menuUnitHolders(doc, "anywhere", WATCH, PLACES)).toEqual([WATCH, PHONE]);
    expect(menuUnitHolders(doc, "entity", WATCH, PLACES)).toEqual([WATCH, OTHER, PHONE]);
    expect(menuUnitHolders(DEFAULTS, "anywhere", WATCH, PLACES)).toEqual([WATCH]);
    // A link listed for the other unit is not this one's.
    expect(menuUnitHolders(linked({ anywhere: ENTITY_LINK }), "anywhere", WATCH, PLACES)).toEqual([WATCH]);
    expect(menuUnitHolders(doc, "anywhere", WATCH, undefined)).toEqual([WATCH]);
  });

  it("tells an integration that links menus by the places reply", () => {
    expect(menuLinksKnown(PLACES)).toBe(true);
    expect(menuLinksKnown({ pages: {}, status_pages: {} })).toBe(false);
    expect(menuLinksKnown(undefined)).toBe(false);
  });

  it("badges a linked menu as Also on, or On N devices", () => {
    const doc = linked({ anywhere: ANY_LINK, entity: ENTITY_LINK });
    expect(menuLinkBadgeText(doc, "anywhere", WATCH, PLACES, DEVICES)).toBe("Also on Jesse's iPhone");
    expect(menuLinkBadgeText(doc, "entity", WATCH, PLACES, DEVICES)).toBe("On 3 devices");
    expect(menuLinkBadgeText(DEFAULTS, "anywhere", WATCH, PLACES, DEVICES)).toBeUndefined();
  });
});

describe("the Devices rows", () => {
  const doc = linked({ anywhere: ANY_LINK });

  it("has a row per device, the iPhone among them, on where the menu is linked", () => {
    const rows = menuDevicePlaces(DEVICES, doc, "anywhere", WATCH, PLACES);
    expect(rows.map((r) => [r.device.ownerId, r.on, r.here])).toEqual([[WATCH, true, true], [PHONE, true, false], [OTHER, false, false]]);
    expect(rows[0]!.stuck).toBe(MENU_DEVICES_HERE_TEXT);
    // No last device rule: the iPhone's copy can always be unticked.
    expect(rows[1]!.stuck).toBeUndefined();
    expect(rows[2]!.stuck).toBeUndefined();
  });

  it("greys a watch that waits for its iPhone, unless it holds the menu already", () => {
    const rows = menuDevicePlaces(DEVICES, doc, "anywhere", WATCH, PLACES, new Set([OTHER, PHONE]));
    expect(rows[2]).toMatchObject({ stuck: MENU_DEVICES_WAIT_TEXT, tag: "waiting for iPhone" });
    expect(rows[1]!.stuck).toBeUndefined();
  });

  it("greys every row with the update text on an integration older than linked menus", () => {
    const rows = menuDevicePlaces(DEVICES, doc, "anywhere", WATCH, { pages: {}, status_pages: {} });
    expect(rows.every((r) => r.stuck === MENU_LINKS_UPDATE_TEXT)).toBe(true);
  });

  it("says what a flip does", () => {
    const rows = menuDevicePlaces(DEVICES, doc, "anywhere", WATCH, PLACES);
    expect(menuDeviceTitle("anywhere", rows[1]!)).toBe("Unlink Jesse's iPhone. It keeps this Anywhere menu as it is, and an edit then stays on its own device.");
    expect(menuDeviceTitle("anywhere", rows[2]!)).toBe("Put this Anywhere menu on Chen's Watch. An edit on one device then shows on both.");
    expect(menuDeviceTitle("anywhere", rows[0]!)).toBe(MENU_DEVICES_HERE_TEXT);
  });

  it("lists an iPhone where the home keeps phone pages", () => {
    const owners = [
      { owner_watch_id: WATCH, device_name: "Jesse's Watch", device_kind: "watch" },
      { owner_watch_id: PHONE, device_name: "Jesse's iPhone", device_kind: "iphone", phone_pages: true },
    ] as unknown as OwnerSummary[];
    expect(linkDevicesOf(owners, true).map((d) => d.kind)).toContain("iphone");
  });
});

describe("the replace question", () => {
  it("names the menu and the device", () => {
    expect(menuReplaceAskText("anywhere", "Jesse's iPhone")).toBe("Replace the Anywhere menu on Jesse's iPhone? Its own is lost.");
    expect(menuReplaceAskText("entity", "Chen's Watch")).toBe("Replace the Entity quick menu on Chen's Watch? Its own is lost.");
  });
});

describe("what a link brings along", () => {
  it("walks the unit's slots for pages and status pages, each once, as stored", () => {
    const doc = withTargets();
    expect(menuUnitTargets(doc, "anywhere")).toEqual({ pageIds: [PAGE], statusPageIds: [STATUS] });
    expect(menuUnitTargets(doc, "entity")).toEqual({ pageIds: [GARAGE], statusPageIds: [] });
    expect(menuUnitTargets(DEFAULTS, "entity").pageIds).toEqual([]);
  });

  it("says which pages come along, by the names this device lists", () => {
    const doc = withTargets();
    const pages = [{ id: PAGE, name: "Lights" }, { id: GARAGE, name: "Garage" }];
    expect(menuAlsoAddsText(doc, "anywhere", pages, [{ id: STATUS.toLowerCase() }])).toBe("Also adds: Lights and 1 status page.");
    // A status page this device does not hold brings nothing either.
    expect(menuAlsoAddsText(doc, "anywhere", pages)).toBe("Also adds: Lights.");
    expect(menuAlsoAddsText(doc, "entity", pages)).toBe("Also adds: Garage.");
    // A page the device does not list brings nothing.
    expect(menuAlsoAddsText(doc, "entity", [])).toBeUndefined();
    expect(menuAlsoAddsText(DEFAULTS, "anywhere", pages)).toBeUndefined();
  });

  it("notes the phrase gap only while the Anywhere menu speaks a phrase", () => {
    expect(menuHasSpeakPhrase(withTargets())).toBe(true);
    expect(menuHasSpeakPhrase(DEFAULTS)).toBe(false);
    const facts = { devices: DEVICES, here: WATCH, places: PLACES, pages: [{ id: PAGE, name: "Lights" }], statusPages: [{ id: STATUS }] };
    const [anywhere, entity] = menuDevicesGroups({ ...facts, document: withTargets() });
    expect(anywhere!.head).toBe("The Anywhere menu is on");
    expect(anywhere!.lines).toEqual([MENU_DEVICES_SWITCHER_TEXT, "Also adds: Lights and 1 status page.", MENU_PHRASE_GAP_TEXT]);
    expect(entity!.head).toBe("The Entity quick menu is on");
    expect(entity!.lines).toEqual([]);
    expect(menuDevicesGroups({ ...facts, document: DEFAULTS })[0]!.lines).toEqual([MENU_DEVICES_SWITCHER_TEXT]);
    expect(MENU_PHRASE_GAP_TEXT).toBe("Speak phrase slots need the phrases on that watch too.");
  });

  it("offers Unlink here only on a linked copy, and one group from a card", () => {
    const doc = linked({ anywhere: ANY_LINK });
    const groups = menuDevicesGroups({ devices: DEVICES, here: WATCH, places: PLACES, pages: [], document: doc });
    expect(groups.map((g) => [g.unit, g.linked])).toEqual([["anywhere", true], ["entity", false]]);
    expect(menuDevicesGroups({ devices: DEVICES, here: WATCH, places: PLACES, pages: [], document: doc }, ["entity"]).map((g) => g.unit)).toEqual(["entity"]);
  });
});

describe("unlinking a copy", () => {
  it("takes the unit's id off, and linkIds with it once empty, keeping the order", () => {
    const both = linked({ anywhere: ANY_LINK, entity: ENTITY_LINK });
    const one = withoutMenuUnitLink(both, "anywhere");
    expect(one.linkIds).toEqual({ entity: ENTITY_LINK });
    expect(Object.keys(one)).toEqual(Object.keys(both));
    const none = withoutMenuUnitLink(one, "entity");
    expect(Object.hasOwn(none, "linkIds")).toBe(false);
    expect(none.quickAction).toBe(both.quickAction);
    expect(withoutMenuUnitLink(DEFAULTS, "anywhere")).toBe(DEFAULTS);
  });

  it("saves the device's menus without it over the revision read, again on a conflict", async () => {
    const saves: { owner: string; base: number; doc: MenusDocument }[] = [];
    let revision = 4;
    const io = {
      read: async () => ({ revision, document: linked({ anywhere: ANY_LINK }) }),
      save: async (owner: string, base: number, doc: MenusDocument) => {
        saves.push({ owner, base, doc });
        if (saves.length === 1) {
          revision = 5;
          throw Object.assign(new Error("changed"), { code: "conflict" });
        }
        return { revision: base + 1 };
      },
    };
    expect(await unlinkMenuUnit(io, PHONE, "anywhere")).toEqual({ ok: true, unlinked: true });
    expect(saves.map((s) => [s.owner, s.base])).toEqual([[PHONE, 4], [PHONE, 5]]);
    expect(Object.hasOwn(saves[1]!.doc, "linkIds")).toBe(false);
    expect(await unlinkMenuUnit({ ...io, read: async () => ({ revision: 2, document: DEFAULTS }) }, PHONE, "anywhere")).toEqual({ ok: true, unlinked: false });
    let tries = 0;
    const stuck = { read: io.read, save: async () => { tries++; throw Object.assign(new Error("changed"), { code: "conflict" }); } };
    expect(await unlinkMenuUnit(stuck, PHONE, "anywhere")).toMatchObject({ ok: false, code: "conflict" });
    expect(tries).toBe(MENU_UNLINK_ATTEMPTS);
  });

  it("says each refusal in the editor's words", () => {
    const err = (code: string) => Object.assign(new Error("raw"), { code });
    expect(menuLinkErrorText(err("unit_taken"))).toBe("That device has a menu of its own there.");
    expect(menuLinkErrorText(err("invalid_format"))).toBe(MENU_LINKS_UPDATE_TEXT);
    expect(menuLinkErrorText(err("not_found"))).toBe("The menus are not saved here yet. Save first, then try again.");
    expect(menuLinkErrorText(err("something"))).toBe("raw");
  });
});

describe("the link call", () => {
  it("sends kind menus with the units, the targets and replace", async () => {
    const sent: Record<string, unknown>[] = [];
    const hass = { connection: { sendMessagePromise: async (m: Record<string, unknown>) => { sent.push(m); return {}; } } } as unknown as HassLike;
    await linkWatchMenus(hass, WATCH, ["anywhere"], [PHONE]);
    await linkWatchMenus(hass, WATCH, ["entity"], [OTHER], true);
    expect(sent).toEqual([
      { type: "wrist_assistant/watch_pages/link", source_id: WATCH, kind: "menus", units: ["anywhere"], targets: [PHONE], replace: false },
      { type: "wrist_assistant/watch_pages/link", source_id: WATCH, kind: "menus", units: ["entity"], targets: [OTHER], replace: true },
    ]);
  });
});

describe("the Devices menu", () => {
  const groups = () => menuDevicesGroups({ devices: DEVICES, here: WATCH, places: PLACES, pages: [], document: linked({ anywhere: ANY_LINK }) });
  const input = { hereKind: "watch" as const, busy: false, onToggle: () => undefined, onUnlinkHere: () => undefined, onDone: () => undefined };

  it("draws a group per menu, each device's switch, Unlink this watch on a linked copy, and Done", () => {
    const text = flat(renderMenuDevicesMenu({ ...input, groups: groups() }));
    expect(text).toContain("The Anywhere menu is on");
    expect(text).toContain("The Entity quick menu is on");
    expect(text.split(`class="pk-dup-row check`).length - 1).toBe(6);
    expect(text).toContain("Anywhere menu on Jesse's iPhone");
    expect(text.split("Unlink this watch").length - 1).toBe(1);
    expect(text).toContain(MENU_DEVICES_SWITCHER_TEXT);
    expect(text).toContain(">Done</button>");
    expect(text).toContain(`aria-label=Devices for the menus`);
  });

  it("greys every switch with the reason while blocked", () => {
    const text = flat(renderMenuDevicesMenu({ ...input, groups: groups().slice(0, 1), blocked: "Save first." }));
    expect(text).toContain(`<div class="pe-dev-note warn">Save first.</div>`);
    expect(text.split(`check off`).length - 1).toBe(3);
    expect(text).toContain(`aria-label=Devices for the Anywhere menu`);
  });
});

// ── the editor ──────────────────────────────────────────────────────────

const OWNERS = [
  { owner_watch_id: "links-w1", device_name: "Jesse's Watch", device_kind: "watch", paired_iphone_name: null },
  { owner_watch_id: "links-w2", device_name: "Chen's Watch", device_kind: "watch", paired_iphone_name: null },
] as unknown as OwnerSummary[];

let editors = 0;

function editor(document: MenusDocument, places: WatchPagesPlaces | undefined, send: (m: Record<string, unknown>) => Promise<unknown> = async () => ({})) {
  const watchId = `${OWNERS[0]!.owner_watch_id}-${++editors}`;
  const owners = [{ ...OWNERS[0]!, owner_watch_id: watchId }, OWNERS[1]!] as OwnerSummary[];
  const Ctor = customElements.get("wa-menu-editor") as unknown as new () => Record<string, unknown>;
  const el = new Ctor();
  el.hass = { user: { is_admin: true }, states: {}, connection: { sendMessagePromise: send } } as unknown as HassLike;
  el.owners = owners;
  el.watchId = watchId;
  el.record = { kind: "menus", revision: 4, hash: null, updated_at: null, updated_by: "panel", delivered_revision: 4, delivered_at: null, document } as unknown as WatchConfigRecord;
  el.places = places;
  el.barActions = html``;
  takeWatchMenusRecord(watchId, document, 4);
  const host = () => (el.viewHost as () => MenusViewHost).call(el);
  return { el, watchId, host, whole: () => flat((el.render as () => unknown).call(el)) };
}

describe("the editor's Devices", () => {
  const placesFor = (watchId: string): WatchPagesPlaces => ({ pages: {}, status_pages: {}, menus: { [ANY_LINK]: { unit: "anywhere", owners: [watchId, "links-w2"] } } });

  it("puts Devices in the ··· menu while the integration shares pages", () => {
    const { el, whole } = editor(DEFAULTS, { pages: {}, status_pages: {}, menus: {} });
    el.topMenuOpen = true;
    expect(whole()).toContain(">Devices…</button>");
    const off = editor(DEFAULTS, undefined);
    off.el.topMenuOpen = true;
    expect(off.whole()).not.toContain(">Devices…</button>");
  });

  it("badges a linked menu's row and its switcher, and leaves the Entity quick menu alone", () => {
    const e = editor(linked({ anywhere: ANY_LINK }), undefined);
    e.el.places = placesFor(e.watchId);
    const card = flat(renderMenusCard(e.host()));
    expect(card.split("Also on Chen's Watch").length - 1).toBe(4);
    const entityRow = card.slice(card.indexOf("data-menu=entity"), card.indexOf("data-menu=switcher"));
    expect(entityRow).not.toContain("pe-linked");
  });

  it("draws a Devices line on the menu's own card that opens its menu", () => {
    const e = editor(linked({ anywhere: ANY_LINK }), undefined);
    e.el.places = placesFor(e.watchId);
    let text = flat(renderMenuInspector(e.host()));
    expect(text).toContain(`<div class="field me-dev-field"><span>Devices</span>`);
    expect(text).toContain("Also on Chen's Watch");
    (e.el.openDevices as (m: unknown) => void).call(e.el, { where: "card", unit: "anywhere" });
    text = flat(renderMenuInspector(e.host()));
    expect(text).toContain("The Anywhere menu is on");
    expect(text).not.toContain("The Entity quick menu is on");
  });

  it("asks before replacing a device's own menu, then sends replace", async () => {
    const sent: Record<string, unknown>[] = [];
    const e = editor(DEFAULTS, { pages: {}, status_pages: {}, menus: {} }, async (m) => {
      sent.push(m);
      if (m.type === "wrist_assistant/watch_pages/link" && m.replace !== true) throw Object.assign(new Error("taken"), { code: "unit_taken" });
      if (m.type === "wrist_assistant/watch_pages/link") return { targets: { "links-w2": { pages: [], status_pages: [], units: ["anywhere"] } }, link_ids: { anywhere: ANY_LINK } };
      if (m.type === "wrist_assistant/watch_pages/places") return { pages: {}, status_pages: {}, menus: {} };
      return { revision: 4, document: DEFAULTS };
    });
    await (e.el.linkMenuTo as (u: string, t: string) => Promise<void>).call(e.el, "anywhere", "links-w2");
    expect(e.el.replaceAsk).toEqual({ unit: "anywhere", target: "links-w2" });
    const text = e.whole();
    expect(text).toContain("Replace the Anywhere menu on Chen's Watch?");
    expect(text).toContain("Its own is lost.");
    await (e.el.linkMenuTo as (u: string, t: string, r: boolean) => Promise<void>).call(e.el, "anywhere", "links-w2", true);
    const links = sent.filter((m) => m.type === "wrist_assistant/watch_pages/link");
    expect(links.map((m) => m.replace)).toEqual([false, true]);
    expect((e.el.devicesNote as { text: string }).text).toBe("The Anywhere menu is on Chen's Watch now.");
  });

  it("will not link over unsaved edits", () => {
    const e = editor(DEFAULTS, { pages: {}, status_pages: {}, menus: {} });
    const draft = e.el.draft as { apply(d: MenusDocument): boolean };
    draft.apply(setWatchMenuStyle(DEFAULTS, "quickAction", "beamIntensity", 0.9));
    expect((e.el.devicesBlocked as () => string | undefined).call(e.el)).toContain("Save or discard your edits first.");
    const old = editor(DEFAULTS, { pages: {}, status_pages: {} });
    expect((old.el.devicesBlocked as () => string | undefined).call(old.el)).toBe(MENU_LINKS_UPDATE_TEXT);
  });
});
