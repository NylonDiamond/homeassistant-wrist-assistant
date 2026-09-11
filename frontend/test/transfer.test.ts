// Share, scrub and import. The two tests that matter most are the drift guard
// (the document walker must reach every entity the compiler reaches, on every
// fixture both sides run) and the leak test (a scrubbed document must not carry
// one id or one friendly name from the house it came from). Everything else is
// wording and round trips.

import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  type CustomComplicationConfig,
  type Element,
  type EntityRef,
  type Rule,
  type TapElement,
  type Value,
  documentEntityUses,
  newConfig,
  newElement,
  newId,
  parseConfig,
} from "../src/model.js";
import { deriveDataSources } from "../src/compiler.js";
import {
  type ShareSlot,
  exportFileName,
  exportText,
  hasInstanceFilters,
  isPlaceholderId,
  parseImportText,
  remapEntities,
  scrubForShare,
  shareSlots,
  unresolvedEntities,
} from "../src/transfer.js";

const MAX_SCHEMA = 6;

const fixturesDir = join(__dirname, "fixtures");
const transferDir = join(__dirname, "fixtures-transfer");
const shareDir = join(__dirname, "fixtures-share");

/** Every document both suites hold, as raw JSON. `fixtures/` wraps the document
 * in a test case; `fixtures-transfer/` is the stored document itself. */
function everyDocument(): { name: string; raw: unknown }[] {
  const out: { name: string; raw: unknown }[] = [];
  for (const file of readdirSync(fixturesDir).filter((f) => f.endsWith(".json"))) {
    const fx = JSON.parse(readFileSync(join(fixturesDir, file), "utf8")) as { config: unknown };
    out.push({ name: `fixtures/${file}`, raw: fx.config });
  }
  for (const file of readdirSync(transferDir).filter((f) => f.endsWith(".json"))) {
    out.push({ name: `fixtures-transfer/${file}`, raw: JSON.parse(readFileSync(join(transferDir, file), "utf8")) });
  }
  return out;
}

const documents = everyDocument();

/** The parts of a document that are deliberately not shared: identity, the
 * derived sources, and the schema stamp that follows the slot. */
function withoutIdentity(cfg: CustomComplicationConfig): Record<string, unknown> {
  const { id: _id, slotIndex: _slot, dataSources: _sources, schemaVersion: _schema, ...rest } = cfg;
  return rest as unknown as Record<string, unknown>;
}

/** The most a share can give back: a page id belongs to the sender's watch, so
 * it is dropped on the way out and never comes home. */
function withoutPages(cfg: CustomComplicationConfig): CustomComplicationConfig {
  const want = structuredClone(cfg);
  delete want.openPageId;
  delete want.openPageName;
  if (want.tapAction.type === "openPage") want.tapAction = { type: "none" };
  for (const el of want.elements) {
    if (el.kind !== "tap") continue;
    delete el.payload.openPageId;
    delete el.payload.openPageName;
    if (el.payload.action.type === "openPage") el.payload.action = { type: "none" };
  }
  want.dataSources = [];
  return want;
}

/** The map an import would build if the reader picked exactly the entities the
 * sender had, which is the only way to compare the two documents. */
function originalRefs(cfg: CustomComplicationConfig, slots: readonly ShareSlot[]): Map<string, EntityRef> {
  const uses = documentEntityUses(cfg, () => true);
  const map = new Map<string, EntityRef>();
  for (const slot of slots) {
    const use = uses.find((u) => u.entityId === slot.originalId);
    map.set(slot.placeholderId, use?.ref ?? { entityId: slot.originalId, displayName: "", domain: slot.domain });
  }
  return map;
}

// ── the drift guard ───────────────────────────────────────────────────────

describe("documentEntityUses reaches everything the compiler does", () => {
  it("has documents to check", () => {
    expect(documents.length).toBeGreaterThan(20);
  });

  for (const doc of documents) {
    it(`${doc.name} lists every entity in its dataSources`, () => {
      const cfg = parseConfig(doc.raw);
      const walked = new Set(documentEntityUses(cfg).map((u) => u.entityId));
      const derived = deriveDataSources(cfg)
        .filter((d): d is Extract<typeof d, { kind: "entity" }> => d.kind === "entity")
        .map((d) => d.entityId);
      for (const id of derived) expect(walked, `${doc.name} misses ${id}`).toContain(id);
    });
  }
});

// ── a document with an entity at every site ───────────────────────────────

interface Leak {
  ids: string[];
  names: string[];
  config: CustomComplicationConfig;
}

let leakCounter = 0;

/** A fresh entity value, and its id and name recorded as things that must not
 * survive a scrub. */
function leakRef(leak: Leak, domain = "sensor"): EntityRef {
  leakCounter += 1;
  const n = String(leakCounter).padStart(2, "0");
  const ref: EntityRef = { entityId: `${domain}.private_${n}`, displayName: `Private Name ${n}`, domain };
  leak.ids.push(ref.entityId);
  leak.names.push(ref.displayName);
  return ref;
}

function stateValue(leak: Leak, domain = "sensor"): Value {
  return { kind: { kind: "entityState", ...leakRef(leak, domain) } };
}

function ageValue(leak: Leak): Value {
  return { kind: { kind: "entityAge", ...leakRef(leak) } };
}

function attributeValue(leak: Leak): Value {
  return { kind: { kind: "entityAttribute", ...leakRef(leak), attribute: "battery_level" } };
}

function ruleWithEntities(leak: Leak): Rule {
  return {
    id: newId(),
    cases: [
      {
        id: newId(),
        when: {
          join: "all",
          tests: [
            {
              id: newId(),
              value: ageValue(leak),
              comparison: { kind: "between", value: stateValue(leak), upper: stateValue(leak) },
            },
          ],
        },
        then: [{ kind: "setText", value: stateValue(leak) }],
      },
    ],
    otherwise: [{ kind: "setColor", value: stateValue(leak) }],
  };
}

/**
 * One document that names an entity in every place a document can.
 *
 * Written by hand rather than picked from the fixtures because the point is
 * coverage of the sites, not of any real design: a site nobody uses today is
 * exactly the one a scrub would forget.
 */
function documentWithEveryEntitySite(): Leak {
  leakCounter = 0;
  // Only the rectangular shape is supported; the other two layouts are left
  // behind, which is the case `compile()` skips and a share must not.
  const cfg = newConfig("Everything", 3, ["rectangular", "circular", "corner", "inline"]);
  cfg.supportedFamilies = ["rectangular"];
  const leak: Leak = { ids: [], names: [], config: cfg };

  cfg.values = [
    { id: newId(), name: "Shared reading", value: stateValue(leak) },
    {
      id: newId(),
      name: "Shared count",
      value: {
        kind: {
          kind: "aggregate",
          aggregate: {
            function: "count",
            scope: { kind: "entities", entities: [leakRef(leak), leakRef(leak)] },
          },
        },
      },
    },
    { id: newId(), name: "Shared template", value: { kind: { kind: "jinja", value: "" } } },
  ];
  const template = cfg.values[2]!;
  template.value = { kind: { kind: "jinja", value: `{{ states('${leakRef(leak).entityId}') | float(0) }}` } };

  const text = newElement("text");
  (text.payload as { value: Value }).value = attributeValue(leak);
  text.payload.rules = [ruleWithEntities(leak)];

  const icon = newElement("icon");
  (icon.payload as { symbol: Value }).symbol = stateValue(leak);

  const gauge = newElement("gauge");
  (gauge.payload as { value: Value; total?: Value }).value = stateValue(leak);
  (gauge.payload as { value: Value; total?: Value }).total = stateValue(leak);
  (gauge.payload as { minSource?: Value }).minSource = stateValue(leak);
  (gauge.payload as { maxSource?: Value }).maxSource = attributeValue(leak);

  const chart = newElement("chart");
  (chart.payload as { value: Value; nowIndex?: Value }).value = stateValue(leak);
  (chart.payload as { value: Value; nowIndex?: Value }).nowIndex = stateValue(leak);

  const timeline = newElement("timeline");
  (timeline.payload as { value: Value }).value = stateValue(leak);

  const shape = newElement("shape");
  shape.payload.rules = [ruleWithEntities(leak)];

  const image = newElement("image");
  (image.payload as { entity: EntityRef }).entity = leakRef(leak, "camera");

  const attached = newElement("tap");
  const attachedPayload = attached.payload as TapElement;
  attachedPayload.attachedTo = text.payload.id;
  attachedPayload.action = { type: "toggleEntity", ...leakRef(leak, "light") };

  const service = newElement("tap");
  const servicePayload = service.payload as TapElement;
  servicePayload.action = {
    type: "callService",
    serviceDomain: "switch",
    serviceName: "turn_on",
    target: leakRef(leak, "switch"),
    serviceDataJSON: `{"entity_id": "${leakRef(leak).entityId}"}`,
  };

  const pageTap = newElement("tap");
  const pagePayload = pageTap.payload as TapElement;
  pagePayload.action = { type: "openPage" };
  pagePayload.openPageId = "6E1F0C7A-0000-4000-8000-00000000AAAA";
  pagePayload.openPageName = "Private Page Name";

  cfg.elements = [text, icon, gauge, chart, timeline, shape, image, attached, service, pageTap];

  const rectangular = cfg.perFamily.rectangular!;
  rectangular.bezelText = stateValue(leak);
  rectangular.rules = [ruleWithEntities(leak)];

  const circular = cfg.perFamily.circular!;
  circular.bezelGauge = {
    value: stateValue(leak),
    minValue: 0,
    maxValue: 100,
    colorHexes: ["#34C759"],
    minLabel: stateValue(leak),
    maxLabel: stateValue(leak),
  };

  const corner = cfg.perFamily.corner!;
  corner.curvedText = stateValue(leak);
  corner.bezelText = stateValue(leak);

  cfg.inline = { value: stateValue(leak) };

  cfg.tapAction = { type: "toggleEntity", ...leakRef(leak, "light") };
  cfg.openPageId = "6E1F0C7A-0000-4000-8000-00000000BBBB";
  cfg.openPageName = "Private Page Name";

  return leak;
}

const KNOWN_DOMAINS = new Set(["sensor", "light", "switch", "camera", "binary_sensor"]);

describe("scrubbing a document that names an entity everywhere", () => {
  it("leaves no entity id and no friendly name anywhere in the text", () => {
    const leak = documentWithEveryEntitySite();
    const slots = shareSlots(leak.config, KNOWN_DOMAINS);
    const scrubbed = scrubForShare(leak.config, slots);
    const text = JSON.stringify(scrubbed);
    for (const id of leak.ids) expect(text, `leaked the id ${id}`).not.toContain(id);
    for (const name of leak.names) expect(text, `leaked the name ${name}`).not.toContain(name);
    expect(text).not.toContain("Private Page Name");
    expect(text).not.toContain("00000000AAAA");
    expect(text).not.toContain("00000000BBBB");
    // The whole export, not only the config object, since that is what is posted.
    const exported = exportText(leak.config, "share", slots);
    for (const id of leak.ids) expect(exported, `leaked the id ${id}`).not.toContain(id);
    for (const name of leak.names) expect(exported, `leaked the name ${name}`).not.toContain(name);
  });

  it("finds a slot for every entity the document names", () => {
    const leak = documentWithEveryEntitySite();
    const slots = shareSlots(leak.config, KNOWN_DOMAINS);
    expect(slots.map((s) => s.originalId).sort()).toEqual([...new Set(leak.ids)].sort());
  });

  it("turns an openPage tap into nothing, at both levels", () => {
    const leak = documentWithEveryEntitySite();
    const scrubbed = scrubForShare(leak.config, shareSlots(leak.config, KNOWN_DOMAINS));
    expect(scrubbed.openPageId).toBeUndefined();
    expect(scrubbed.openPageName).toBeUndefined();
    const tap = scrubbed.elements.find(
      (el): el is Extract<Element, { kind: "tap" }> => el.kind === "tap" && el.payload.action.type === "none",
    );
    expect(tap).toBeDefined();
    expect(tap!.payload.openPageId).toBeUndefined();
    expect(tap!.payload.openPageName).toBeUndefined();
  });

  it("comes back whole when the original entities are mapped in again", () => {
    const leak = documentWithEveryEntitySite();
    const slots = shareSlots(leak.config, KNOWN_DOMAINS);
    const scrubbed = scrubForShare(leak.config, slots);
    const restored = remapEntities(scrubbed, originalRefs(leak.config, slots));
    expect(withoutIdentity(restored)).toEqual(withoutIdentity(withoutPages(leak.config)));
  });
});

describe("a gauge's range sources", () => {
  it("are named as their own sites on the gauge", () => {
    const cfg = newConfig("Range", 0, ["rectangular"]);
    const gauge = newElement("gauge");
    const p = gauge.payload as { value: Value; minSource?: Value; maxSource?: Value };
    p.value = { kind: { kind: "entityState", entityId: "sensor.car_battery", displayName: "Car battery", domain: "sensor" } };
    p.minSource = { kind: { kind: "entityState", entityId: "sensor.floor", displayName: "Floor", domain: "sensor" } };
    p.maxSource = { kind: { kind: "entityState", entityId: "number.car_charge_limit", displayName: "Charge limit", domain: "number" } };
    cfg.elements = [gauge];
    expect(documentEntityUses(cfg).map((u) => [u.entityId, u.where])).toEqual([
      ["sensor.car_battery", "Gauge layer \"Car battery\""],
      ["sensor.floor", "Min on gauge \"Car battery\""],
      ["number.car_charge_limit", "Max on gauge \"Car battery\""],
    ]);
  });
});

// ── slots and numbering ───────────────────────────────────────────────────

function documentWithOneEntityTwice(): CustomComplicationConfig {
  const cfg = newConfig("Twice", 0, ["rectangular"]);
  const ref: EntityRef = { entityId: "sensor.energy", displayName: "Energy today", domain: "sensor" };
  const other: EntityRef = { entityId: "light.porch", displayName: "Porch light", domain: "light" };
  const text = newElement("text");
  (text.payload as { value: Value }).value = { kind: { kind: "entityState", ...ref } };
  const gauge = newElement("gauge");
  (gauge.payload as { value: Value }).value = { kind: { kind: "entityAge", ...ref } };
  const tap = newElement("tap");
  (tap.payload as TapElement).action = { type: "toggleEntity", ...other };
  cfg.elements = [text, gauge, tap];
  cfg.values = [
    { id: newId(), name: "Template", value: { kind: { kind: "jinja", value: "{{ states('sensor.energy') }}" } } },
  ];
  return cfg;
}

describe("share slots", () => {
  it("numbers in first-use order and keeps the domain", () => {
    const slots = shareSlots(documentWithOneEntityTwice(), KNOWN_DOMAINS);
    expect(slots.map((s) => s.placeholderId)).toEqual(["sensor.shared_1", "light.shared_2"]);
    expect(slots.map((s) => s.label)).toEqual(["Sensor 1", "Light 2"]);
    expect(slots.every((s) => isPlaceholderId(s.placeholderId))).toBe(true);
  });

  it("gives one entity one slot however often it is read", () => {
    const slots = shareSlots(documentWithOneEntityTwice(), KNOWN_DOMAINS);
    expect(slots).toHaveLength(2);
    const energy = slots[0]!;
    expect(energy.originalId).toBe("sensor.energy");
    expect(energy.where.length).toBeGreaterThan(1);
    expect(energy.where).toContain("Template text");
  });

  it("is stable across runs", () => {
    const cfg = documentWithOneEntityTwice();
    expect(shareSlots(cfg, KNOWN_DOMAINS)).toEqual(shareSlots(cfg, KNOWN_DOMAINS));
  });

  it("ignores a free-text hit whose domain is nowhere in this house", () => {
    const cfg = newConfig("Free text", 0, ["rectangular"]);
    cfg.values = [
      { id: newId(), name: "T", value: { kind: { kind: "jinja", value: "{{ 'made_up.thing' }}" } } },
    ];
    expect(shareSlots(cfg, KNOWN_DOMAINS)).toEqual([]);
  });
});

describe("free text", () => {
  function templateDocument(template: string, serviceData: string): CustomComplicationConfig {
    const cfg = newConfig("Templates", 0, ["rectangular"]);
    cfg.values = [{ id: newId(), name: "T", value: { kind: { kind: "jinja", value: template } } }];
    cfg.tapAction = {
      type: "callService",
      serviceDomain: "light",
      serviceName: "turn_on",
      serviceDataJSON: serviceData,
    };
    return cfg;
  }

  it("rewrites a quoted id in a template and in service data", () => {
    const cfg = templateDocument(
      "{{ states('sensor.energy') | float(0) }}",
      '{"entity_id": "sensor.energy"}',
    );
    const slots = shareSlots(cfg, KNOWN_DOMAINS);
    expect(slots).toHaveLength(1);
    const scrubbed = scrubForShare(cfg, slots);
    const value = scrubbed.values[0]!.value.kind;
    expect(value.kind === "jinja" ? value.value : "").toBe("{{ states('sensor.shared_1') | float(0) }}");
    const action = scrubbed.tapAction;
    expect(action.type === "callService" ? action.serviceDataJSON : "").toBe('{"entity_id": "sensor.shared_1"}');
  });

  it("leaves an attribute path and a number alone", () => {
    const cfg = templateDocument(
      "{{ value.attr + 3.5 }}{{ states('sensor.energy') }}",
      '{"brightness": 3.5}',
    );
    const slots = shareSlots(cfg, KNOWN_DOMAINS);
    expect(slots.map((s) => s.originalId)).toEqual(["sensor.energy"]);
    const scrubbed = scrubForShare(cfg, slots);
    const value = scrubbed.values[0]!.value.kind;
    expect(value.kind === "jinja" ? value.value : "").toBe("{{ value.attr + 3.5 }}{{ states('sensor.shared_1') }}");
    const action = scrubbed.tapAction;
    expect(action.type === "callService" ? action.serviceDataJSON : "").toBe('{"brightness": 3.5}');
  });

  it("joins the slot the same entity already has", () => {
    const cfg = documentWithOneEntityTwice();
    const slots = shareSlots(cfg, KNOWN_DOMAINS);
    const scrubbed = scrubForShare(cfg, slots);
    const value = scrubbed.values[0]!.value.kind;
    expect(value.kind === "jinja" ? value.value : "").toBe("{{ states('sensor.shared_1') }}");
  });
});

// ── export shape ──────────────────────────────────────────────────────────

describe("exported text", () => {
  const cfg = parseConfig(
    (JSON.parse(readFileSync(join(fixturesDir, "living_room.json"), "utf8")) as { config: unknown }).config,
  );

  it("drops identity and empties the derived sources", () => {
    const raw = JSON.parse(exportText(cfg, "backup")) as Record<string, unknown>;
    expect(raw.id).toBeUndefined();
    expect(raw.slotIndex).toBeUndefined();
    expect(raw.dataSources).toEqual([]);
    expect(raw.name).toBe(cfg.name);
  });

  it("sorts every level of keys and indents by two", () => {
    const text = exportText(cfg, "backup");
    expect(text.endsWith("}\n")).toBe(true);
    const topLevel = [...text.matchAll(/^ {2}"([^"]+)":/gm)].map((m) => m[1]!);
    expect(topLevel).toEqual([...topLevel].sort());
    expect(topLevel).toContain("schemaVersion");
  });

  it("names a file the way the phone does", () => {
    expect(exportFileName({ ...cfg, name: "Energy today!" })).toBe("Energy-today.json");
    expect(exportFileName({ ...cfg, name: "" })).toBe("Complication.json");
    expect(exportFileName({ ...cfg, name: "!!!" })).toBe("Complication.json");
    expect(exportFileName({ ...cfg, name: "Kitchen / Hall" })).toBe("Kitchen-Hall.json");
  });
});

describe("backup round trip", () => {
  for (const doc of documents) {
    it(`${doc.name} survives export and import`, () => {
      const cfg = parseConfig(doc.raw);
      const parsed = parseImportText(exportText(cfg, "backup"), MAX_SCHEMA);
      expect(parsed.ok, parsed.ok ? "" : parsed.error).toBe(true);
      if (!parsed.ok) return;
      expect(withoutIdentity(parsed.config)).toEqual(withoutIdentity(cfg));
    });
  }
});

describe("share round trip", () => {
  for (const doc of documents) {
    it(`${doc.name} comes back when its entities are mapped in again`, () => {
      const cfg = parseConfig(doc.raw);
      const slots = shareSlots(cfg, KNOWN_DOMAINS);
      const parsed = parseImportText(exportText(cfg, "share", slots), MAX_SCHEMA);
      expect(parsed.ok, parsed.ok ? "" : parsed.error).toBe(true);
      if (!parsed.ok) return;

      const restored = remapEntities(parsed.config, originalRefs(cfg, slots));
      const want = withoutPages(cfg);
      // The icon a reference carried belonged to the sender's entity.
      const stripIcons = (o: unknown): unknown => {
        if (Array.isArray(o)) return o.map(stripIcons);
        if (o && typeof o === "object") {
          const copy = { ...(o as Record<string, unknown>) };
          delete copy.iconName;
          for (const [k, v] of Object.entries(copy)) copy[k] = stripIcons(v);
          return copy;
        }
        return o;
      };
      expect(stripIcons(withoutIdentity(restored))).toEqual(stripIcons(withoutIdentity(want)));
    });
  }
});

// ── import ────────────────────────────────────────────────────────────────

/** Every entity id written anywhere in a stored document except its derived
 * sources: an oracle for `unresolvedEntities` that shares no code with it. */
function entityIdsIn(raw: unknown, key = ""): string[] {
  if (Array.isArray(raw)) return raw.flatMap((v) => entityIdsIn(v, key));
  if (raw && typeof raw === "object") {
    const out: string[] = [];
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
      if (k === "dataSources") continue;
      if (k === "entityId" && typeof v === "string" && v !== "") out.push(v);
      else out.push(...entityIdsIn(v, k));
    }
    return out;
  }
  return [];
}

describe("importing a stored document", () => {
  const files = readdirSync(transferDir).filter((f) => f.endsWith(".json"));

  it("has stored documents to check", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    const raw = JSON.parse(readFileSync(join(transferDir, file), "utf8")) as Record<string, unknown>;

    it(`${file} parses and lists exactly its entities`, () => {
      const parsed = parseImportText(JSON.stringify(raw), MAX_SCHEMA);
      expect(parsed.ok, parsed.ok ? "" : parsed.error).toBe(true);
      if (!parsed.ok) return;
      const listed = unresolvedEntities(parsed.config, {});
      expect(listed.map((u) => u.entityId).sort()).toEqual([...new Set(entityIdsIn(raw))].sort());
      // Nothing in a stored document is a placeholder, so nothing is required.
      expect(listed.every((u) => !u.required)).toBe(true);
    });
  }

  it("keeps an entity this house already has out of the list", () => {
    const cfg = documentWithOneEntityTwice();
    const listed = unresolvedEntities(cfg, { "sensor.energy": {} });
    expect(listed.map((u) => u.entityId)).toEqual(["light.porch"]);
  });

  it("requires every placeholder and carries the sender's label", () => {
    const cfg = documentWithOneEntityTwice();
    const slots = shareSlots(cfg, KNOWN_DOMAINS);
    slots[0]!.label = "The energy meter";
    const shared = parseImportText(exportText(cfg, "share", slots), MAX_SCHEMA);
    expect(shared.ok).toBe(true);
    if (!shared.ok) return;
    const listed = unresolvedEntities(shared.config, {});
    expect(listed.map((u) => u.entityId)).toEqual(["sensor.shared_1", "light.shared_2"]);
    expect(listed.every((u) => u.required)).toBe(true);
    expect(listed[0]!.label).toBe("The energy meter");
    expect(listed[0]!.domain).toBe("sensor");
    expect(listed[0]!.where).toContain("Template text");
  });

  it("lands the reader's own reference, name included", () => {
    const cfg = documentWithOneEntityTwice();
    const slots = shareSlots(cfg, KNOWN_DOMAINS);
    const shared = parseImportText(exportText(cfg, "share", slots), MAX_SCHEMA);
    expect(shared.ok).toBe(true);
    if (!shared.ok) return;
    const mine: EntityRef = { entityId: "sensor.my_meter", displayName: "My meter", domain: "sensor" };
    const landed = remapEntities(shared.config, new Map([["sensor.shared_1", mine]]));
    const sources = deriveDataSources(landed).filter((d) => d.kind === "entity");
    expect(sources).toContainEqual({ kind: "entity", entityId: "sensor.my_meter", displayName: "My meter", domain: "sensor" });
    const template = landed.values[0]!.value.kind;
    expect(template.kind === "jinja" ? template.value : "").toBe("{{ states('sensor.my_meter') }}");
  });
});

describe("import refusals", () => {
  it("says so when there is nothing to read", () => {
    const parsed = parseImportText("   \n ", MAX_SCHEMA);
    expect(parsed).toEqual({ ok: false, error: "There is nothing to read here. Paste a complication first." });
  });

  it("says so when the text is not JSON", () => {
    const parsed = parseImportText("{ oops", MAX_SCHEMA);
    expect(parsed).toEqual({
      ok: false,
      error: "This is not valid JSON. Check for a missing brace or a stray comma.",
    });
  });

  it("says so when the JSON is not an object", () => {
    const parsed = parseImportText("[1,2,3]", MAX_SCHEMA);
    expect(parsed).toEqual({
      ok: false,
      error: "This is valid JSON but not a complication. A complication starts with { and ends with }.",
    });
  });

  it("says which part is missing", () => {
    const parsed = parseImportText('{"hello":"world"}', MAX_SCHEMA);
    expect(parsed.ok).toBe(false);
    if (parsed.ok) return;
    expect(parsed.error).toBe('This does not look like a complication.\n\nIt is missing "name".');
  });

  it("refuses a schema this panel does not read yet", () => {
    const parsed = parseImportText(JSON.stringify({ schemaVersion: 99, name: "X" }), MAX_SCHEMA);
    expect(parsed.ok).toBe(false);
    if (parsed.ok) return;
    expect(parsed.error).toContain("schema v99");
    expect(parsed.error).toContain("update the Wrist Assistant integration");
  });

  it("refuses a key it would silently drop", () => {
    const cfg = documentWithOneEntityTwice();
    const raw = JSON.parse(exportText(cfg, "backup")) as Record<string, unknown>;
    raw.somethingNew = true;
    const parsed = parseImportText(JSON.stringify(raw), MAX_SCHEMA);
    expect(parsed.ok).toBe(false);
    if (parsed.ok) return;
    expect(parsed.error).toContain("$.somethingNew");
    expect(parsed.error).toContain("update the Wrist Assistant integration");
  });
});

describe("aggregate filters", () => {
  it("spots a scope named by area, label or floor", () => {
    const cfg = newConfig("Filtered", 0, ["rectangular"]);
    const text = newElement("text");
    (text.payload as { value: Value }).value = {
      kind: {
        kind: "aggregate",
        aggregate: {
          function: "count",
          scope: { kind: "filter", domains: ["light"], areaIds: ["kitchen"], labelIds: [], floorIds: [] },
        },
      },
    };
    cfg.elements = [text];
    expect(hasInstanceFilters(cfg)).toBe(true);
  });

  it("says nothing about a plain domain scope", () => {
    const cfg = newConfig("Filtered", 0, ["rectangular"]);
    const text = newElement("text");
    (text.payload as { value: Value }).value = {
      kind: {
        kind: "aggregate",
        aggregate: {
          function: "count",
          scope: { kind: "filter", domains: ["light"], areaIds: [], labelIds: [], floorIds: [] },
        },
      },
    };
    cfg.elements = [text];
    expect(hasInstanceFilters(cfg)).toBe(false);
    expect(hasInstanceFilters(documentWithOneEntityTwice())).toBe(false);
  });
});

// ── the committed samples ─────────────────────────────────────────────────

describe("the sample texts", () => {
  const files = readdirSync(shareDir).filter((f) => f.endsWith(".json"));

  it("has one share sample and one backup sample", () => {
    expect(files.sort()).toEqual(["living-room-backup.json", "living-room-share.json"]);
  });

  it("is still what this panel writes today", () => {
    const source = parseConfig(
      (JSON.parse(readFileSync(join(fixturesDir, "living_room.json"), "utf8")) as { config: unknown }).config,
    );
    const slots = shareSlots(source, KNOWN_DOMAINS);
    expect(readFileSync(join(shareDir, "living-room-share.json"), "utf8")).toBe(exportText(source, "share", slots));
    expect(readFileSync(join(shareDir, "living-room-backup.json"), "utf8")).toBe(exportText(source, "backup"));
  });

  it("carries placeholders in the share sample and real ids in the backup one", () => {
    const share = readFileSync(join(shareDir, "living-room-share.json"), "utf8");
    const backup = readFileSync(join(shareDir, "living-room-backup.json"), "utf8");
    expect(share).toMatch(/"[a-z0-9_]+\.shared_1"/);
    // Identity is a top-level key, so only a top-level line counts: every layer
    // still carries an `id` of its own.
    expect(share).not.toMatch(/^ {2}"id":/m);
    expect(share).not.toMatch(/^ {2}"slotIndex":/m);
    expect(backup).toMatch(/"entityId": "[a-z0-9_]+\.[a-z0-9_]+"/);
  });

  for (const file of files) {
    it(`${file} parses and round trips`, () => {
      const text = readFileSync(join(shareDir, file), "utf8");
      const parsed = parseImportText(text, MAX_SCHEMA);
      expect(parsed.ok, parsed.ok ? "" : parsed.error).toBe(true);
      if (!parsed.ok) return;
      expect(exportText(parsed.config, "backup")).toBe(text);
    });
  }

  it("asks for every slot in the share sample", () => {
    const parsed = parseImportText(readFileSync(join(shareDir, "living-room-share.json"), "utf8"), MAX_SCHEMA);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const listed = unresolvedEntities(parsed.config, {});
    expect(listed.length).toBeGreaterThan(0);
    expect(listed.every((u) => u.required && isPlaceholderId(u.entityId))).toBe(true);
  });
});
