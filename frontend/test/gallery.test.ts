// Sending to the gallery: the body is the Share text and nothing more, the
// public list names the free text an author wrote, the blockers refuse what
// the gallery or privacy would refuse, and the three calls speak the contract.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  type CustomComplicationConfig,
  defaultControlSpec,
  documentEntityUses,
  newElement,
  newId,
  parseConfig,
  schemaVersionFor,
  setPageCount,
} from "../src/model.js";
import { keyFor, listExpressionKey, listKey } from "../src/compiler.js";
import { exportObject, exportText, parseImportText, scrubForShare, shareSlots, stableStringify } from "../src/transfer.js";
import { supportedFamilies } from "../src/layouts.js";
import {
  type GalleryFetch,
  type GalleryMeta,
  type GalleryUpload,
  GALLERY_API_BASE,
  GalleryError,
  buildGallerySubmission,
  deleteMyUpload,
  GALLERY_MAX_SCHEMA,
  galleryBlockers,
  galleryBlockersByStep,
  galleryDevice,
  galleryErrorMessage,
  galleryFamily,
  galleryPublicFields,
  galleryStatusLabel,
  designFingerprint,
  galleryLinkChanged,
  galleryLinkFor,
  latestGalleryVersion,
  galleryUploadRows,
  galleryUploadSubline,
  listMyUploads,
  readGalleryUpload,
  resolvePreviewUrl,
  submitToGallery,
  unquotedEntityIds,
} from "../src/gallery.js";
import { galleryPreviewContext, galleryPreviewPlan, inlineLineSvg, inlineRunsShown } from "../src/preview-png.js";
import { inlineSymbolMarker } from "../src/model.js";
import type { IconProvider } from "../src/renderer.js";
import { svg as litSvg, type TemplateResult } from "lit";

function livingRoom(): CustomComplicationConfig {
  const parsed = parseImportText(readFileSync(join(__dirname, "fixtures-share", "living-room-backup.json"), "utf8"), 6);
  if (!parsed.ok) throw new Error(parsed.error);
  return parsed.config;
}

/** The same fixture as the one shape a complication is now. The file predates
 * the split and still carries three, which is what the older-panel cases
 * below want; everything else wants one. */
function oneShape(family: CustomComplicationConfig["supportedFamilies"][number]): CustomComplicationConfig {
  const cfg = livingRoom();
  cfg.supportedFamilies = [family];
  return cfg;
}

function fixtureConfig(name: string): CustomComplicationConfig {
  const fx = JSON.parse(readFileSync(join(__dirname, "fixtures", name), "utf8")) as { config: unknown };
  return parseConfig(fx.config);
}

function domainsOf(cfg: CustomComplicationConfig): Set<string> {
  return new Set(documentEntityUses(cfg).map((u) => u.entityId.split(".")[0] ?? ""));
}

const META: GalleryMeta = {
  title: "Living room",
  description: "Temperature and lights.",
  authorName: "sam",
  tags: ["climate", "lights"],
  panelVersion: "2.1.0-beta.5",
};

describe("buildGallerySubmission", () => {
  it("sends the Share text, with the same slots the Share dialog uses", () => {
    const cfg = oneShape("rectangular");
    const slots = shareSlots(cfg, domainsOf(cfg)).map((s, i) => ({ ...s, label: `Thing ${i + 1}` }));
    expect(slots.length).toBeGreaterThan(0);
    const body = buildGallerySubmission(cfg, slots, META);
    const named = structuredClone(cfg);
    named.name = META.title;
    // The same document as the Share text, on one line to fit the gallery's limit.
    expect(body.shareText).toBe(stableStringify(exportObject(named, "share", slots), null));
    expect(body.shareText).not.toContain("\n");
    expect(JSON.parse(body.shareText)).toEqual(JSON.parse(exportText(named, "share", slots)));
    for (const slot of slots) expect(body.shareText).not.toContain(slot.originalId);
    expect(body.slots).toEqual(slots.map((s) => ({ id: s.placeholderId, label: s.label })));
    expect(body.families).toEqual(["rectangular"]);
    expect(body.panelVersion).toBe("2.1.0-beta.5");
    expect(body).not.toHaveProperty("previews");
    // The document's id rides beside the text, never inside it.
    expect(body.sourceId).toBe(cfg.id);
    expect(body.shareText).not.toContain(cfg.id);
  });

  it("fingerprints the design, not its name or this home's fields", () => {
    const cfg = oneShape("rectangular");
    const print = designFingerprint(cfg);
    expect(print).toMatch(/^[0-9a-f]{16}$/);
    expect(buildGallerySubmission(cfg, [], META).sourceHash).toBe(print);
    expect(designFingerprint(structuredClone(cfg))).toBe(print);
    const renamed = structuredClone(cfg);
    renamed.name = "Something else";
    renamed.hidden = true;
    expect(designFingerprint(renamed)).toBe(print);
    const edited = structuredClone(cfg);
    edited.notes = "A new line for whoever imports it.";
    expect(designFingerprint(edited)).not.toBe(print);
    const trimmed = structuredClone(cfg);
    trimmed.elements.pop();
    expect(designFingerprint(trimmed)).not.toBe(print);
  });

  // The Worker, the gallery page and this file carry the same eight names, so
  // a Home Screen tile is filed under its own shape rather than dropped.
  it("files a Home Screen tile under its own shape", () => {
    expect(buildGallerySubmission(oneShape("medium"), [], META).families).toEqual(["medium"]);
    expect(buildGallerySubmission(oneShape("xlarge"), [], META).families).toEqual(["xlarge"]);
    expect(buildGallerySubmission(oneShape("inline"), [], META).families).toEqual(["inline"]);
  });

  // A complication is one shape, so one entry is all the field ever carries
  // from this panel. A document an older panel wrote can still be shared, and
  // is filed under its first shape, which is the one its picture draws.
  it("sends one shape, and files an older document under its first", () => {
    const old = livingRoom();
    expect(supportedFamilies(old).length).toBeGreaterThan(1);
    expect(galleryFamily(old)).toBe("rectangular");
    expect(buildGallerySubmission(old, [], META).families).toEqual(["rectangular"]);
  });

  it("carries the device, and leaves the field off when neither device is meant", () => {
    const cfg = oneShape("rectangular");
    expect(buildGallerySubmission(cfg, [], { ...META, device: "iphone" }).device).toBe("iphone");
    expect(buildGallerySubmission(cfg, [], { ...META, device: "watch" }).device).toBe("watch");
    expect(buildGallerySubmission(cfg, [], META)).not.toHaveProperty("device");
  });

  it("trims the fields and keeps only gallery tags, once each", () => {
    const cfg = livingRoom();
    const body = buildGallerySubmission(cfg, [], { ...META, title: "  Hi  ", tags: ["media", "nope", "media"] });
    expect(body.title).toBe("Hi");
    expect(body.tags).toEqual(["media"]);
  });

  it("renames groups and shared values in the copy only, and an empty name keeps the original", () => {
    const cfg = livingRoom();
    const group = { id: newId(), name: "Jane's room", locked: false };
    const other = { id: newId(), name: "Upstairs", locked: false };
    cfg.groups = [...(cfg.groups ?? []), group, other];
    const value = { id: newId(), name: "Jane's heater", value: { kind: { kind: "literal" as const, value: "1" } } };
    cfg.values.push(value);
    const before = structuredClone(cfg);

    const body = buildGallerySubmission(cfg, [], META, {
      groupNames: new Map([[group.id, "Bedroom"], [other.id, "  "]]),
      valueNames: new Map([[value.id, "Heater"]]),
    });
    const sent = JSON.parse(body.shareText) as { name: string; groups: { name: string }[]; values: { name: string }[] };
    expect(sent.name).toBe(META.title);
    expect(sent.groups.map((g) => g.name)).toContain("Bedroom");
    expect(sent.groups.map((g) => g.name)).toContain("Upstairs");
    expect(sent.values.map((v) => v.name)).toContain("Heater");
    expect(body.shareText).not.toContain("Jane");
    expect(cfg).toEqual(before);
  });

  it("renames layers in the copy only, and an empty name keeps the original", () => {
    const cfg = livingRoom();
    const [a, b] = cfg.elements as [typeof cfg.elements[number], typeof cfg.elements[number]];
    a.payload.name = "Jane's lamp";
    b.payload.name = "Clock";
    const before = structuredClone(cfg);
    const body = buildGallerySubmission(cfg, [], META, {
      layerNames: new Map([[a.payload.id, "Lamp"], [b.payload.id, " "]]),
    });
    const sent = JSON.parse(body.shareText) as { elements: { payload: { name?: string } }[] };
    const names = sent.elements.map((el) => el.payload.name);
    expect(names).toContain("Lamp");
    expect(names).toContain("Clock");
    expect(body.shareText).not.toContain("Jane");
    expect(cfg).toEqual(before);
  });
});

describe("galleryDevice", () => {
  it("is the owner's own kind, whatever the shape is", () => {
    expect(galleryDevice("watch", "rectangular")).toBe("watch");
    expect(galleryDevice("watch", "inline")).toBe("watch");
    expect(galleryDevice("iphone", "circular")).toBe("iphone");
    expect(galleryDevice("iphone", "large")).toBe("iphone");
    expect(galleryDevice("watch", undefined)).toBe("watch");
  });

  // The Library is a shelf, not a device, so the shape is the only evidence.
  it("reads the shape for a design in the library", () => {
    expect(galleryDevice("library", "corner")).toBe("watch");
    for (const tile of ["small", "medium", "large", "xlarge"] as const) {
      expect(galleryDevice("library", tile)).toBe("iphone");
    }
  });

  it("says nothing for a library shape both devices draw", () => {
    for (const shared of ["rectangular", "circular", "inline"] as const) {
      expect(galleryDevice("library", shared)).toBeUndefined();
    }
    expect(galleryDevice("library", undefined)).toBeUndefined();
  });
});

describe("galleryPublicFields", () => {
  function withText(): { cfg: CustomComplicationConfig; slots: ReturnType<typeof shareSlots> } {
    const cfg = livingRoom();
    const first = cfg.elements[0]!;
    first.payload.name = "The Smiths lamp";
    const text = newElement("text");
    if (text.kind === "text") text.payload.value = { kind: { kind: "literal", value: "Hello Jane" } };
    cfg.elements.push(text);
    cfg.values.push({
      id: newId(),
      name: "Heating cost",
      value: { kind: { kind: "jinja", value: "{{ states('sensor.boiler_meter') | float * 0.3 }}" } },
    });
    const slots = shareSlots(cfg, new Set([...domainsOf(cfg), "sensor"]));
    return { cfg, slots };
  }

  const group = (groups: ReturnType<typeof galleryPublicFields>, label: string) =>
    groups.find((g) => g.label === label)?.values ?? [];

  it("lists layer names, shared value names and slot labels, and leaves the name to the title", () => {
    const { cfg, slots } = withText();
    const groups = galleryPublicFields(cfg, slots);
    expect(groups.some((g) => g.label === "Complication name")).toBe(false);
    expect(group(groups, "Other text")).not.toContain(cfg.name);
    expect(group(groups, "Layer names")).toContain("The Smiths lamp");
    expect(group(groups, "Shared value names")).toContain("Heating cost");
    expect(group(groups, "Slot labels")).toEqual(slots.map((s) => s.label));
  });

  it("offers group, shared value and slot names as rows, with the renames applied", () => {
    const { cfg, slots } = withText();
    const heating = cfg.values.find((n) => n.name === "Heating cost")!;
    const groups = galleryPublicFields(cfg, slots, { valueNames: new Map([[heating.id, "Boiler cost"]]) });
    const shared = groups.find((g) => g.label === "Shared value names")!;
    expect(shared.values).toContain("Boiler cost");
    expect(shared.values).not.toContain("Heating cost");
    expect(shared.rows).toContainEqual({ kind: "shared", id: heating.id, value: "Boiler cost", original: "Heating cost" });
    expect(groups.find((g) => g.label === "Slot labels")?.rows?.map((r) => r.id)).toEqual(slots.map((s) => s.placeholderId));
    expect(groups.find((g) => g.label === "Layer names")?.rows).toBeUndefined();
    expect(cfg.values.find((n) => n.id === heating.id)?.name).toBe("Heating cost");
  });

  it("does not list an icon's symbol name as other text", () => {
    const { cfg, slots } = withText();
    const icon = newElement("icon");
    if (icon.kind === "icon") icon.payload.symbol = { kind: { kind: "literal", value: "circle.fill" } };
    icon.payload.rules = [{
      id: newId(),
      cases: [],
      otherwise: [{ kind: "setIcon", value: { kind: { kind: "literal", value: "exclamationmark.triangle" } } }],
    }];
    cfg.elements.push(icon);
    const other = group(galleryPublicFields(cfg, slots), "Other text");
    expect(exportText(cfg, "share", slots)).toContain("circle.fill");
    expect(other).not.toContain("circle.fill");
    expect(other).not.toContain("exclamationmark.triangle");
    expect(other).toContain("Hello Jane");
  });

  it("says an uploaded picture is going with it, and keeps its bytes out of the text list", () => {
    const { cfg, slots } = withText();
    const picture = newElement("image");
    if (picture.kind === "image") {
      picture.payload.source = "inline";
      // A tiny PNG, 74 bytes: one line in the step, not a wall of base64.
      picture.payload.data = "iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAEUlEQVR42mP476CAFTEMLQkAgYZXwZM8C00AAAAASUVORK5CYII=";
    }
    cfg.elements.push(picture);
    const groups = galleryPublicFields(cfg, slots);
    expect(group(groups, "Embedded pictures")).toEqual(["Embedded image, 1 KiB"]);
    expect(group(groups, "Other text").join(" ")).not.toContain("iVBORw0KGgo");
    // And it really does leave with the document: the scrub keeps it.
    expect(exportText(cfg, "share", slots)).toContain("iVBORw0KGgo");
  });

  it("shows template text as it will be sent, with the entity replaced", () => {
    const { cfg, slots } = withText();
    const templates = group(galleryPublicFields(cfg, slots), "Template text");
    const ours = templates.find((t) => t.includes("* 0.3"));
    expect(ours).toBeDefined();
    expect(templates.join("\n")).not.toContain("sensor.boiler_meter");
    expect(ours).toMatch(/states\('sensor\.shared_\d+'\)/);
  });

  it("catches a literal typed into a layer, and no ids or colors", () => {
    const { cfg, slots } = withText();
    const other = group(galleryPublicFields(cfg, slots), "Other text");
    expect(other).toContain("Hello Jane");
    for (const s of other) {
      expect(s).not.toMatch(/^[0-9A-F]{8}-/i);
      expect(s).not.toMatch(/^#[0-9A-F]+$/i);
      expect(s).not.toMatch(/\.shared_\d+$/);
    }
  });

  it("lists service data text", () => {
    const cfg = fixtureConfig("call_service_tap.json");
    const slots = shareSlots(cfg, domainsOf(cfg));
    const groups = galleryPublicFields(cfg, slots);
    expect(group(groups, "Service data").length).toBeGreaterThan(0);
  });

  // A list carries writing in two places nothing else does: the Jinja of a
  // `template` source, and the row layers, which are not layers of the
  // document. Both leave with the upload, so the author is shown both.
  describe("a list", () => {
    function withList(): { cfg: CustomComplicationConfig; slots: ReturnType<typeof shareSlots> } {
      const cfg = livingRoom();
      const el = newElement("list");
      if (el.kind !== "list") throw new Error("not a list");
      el.payload.name = "Departures";
      el.payload.source = {
        kind: "template",
        value: "{{ state_attr('sensor.bus_stop', 'departures') | to_json }}",
      };
      const row = newElement("text");
      if (row.kind === "text") {
        row.payload.name = "Platform for Jane";
        row.payload.value = { kind: { kind: "literal", value: "Leaves in" } };
      }
      const tap = newElement("tap");
      if (tap.kind === "tap") {
        tap.payload.action = {
          type: "callService",
          serviceDomain: "select",
          serviceName: "select_option",
          serviceDataJSON: '{"option":"{item.value}"}',
        };
      }
      el.payload.template = [row, tap];
      cfg.elements.push(el);
      const slots = shareSlots(cfg, new Set([...domainsOf(cfg), "sensor"]));
      return { cfg, slots };
    }

    it("shows a template source's Jinja, with the entity already replaced", () => {
      const { cfg, slots } = withList();
      const templates = group(galleryPublicFields(cfg, slots), "Template text");
      const ours = templates.find((t) => t.includes("departures"));
      expect(ours).toBeDefined();
      expect(ours).toMatch(/state_attr\('sensor\.shared_\d+'/);
      expect(templates.join("\n")).not.toContain("sensor.bus_stop");
    });

    it("names the row layers beside the document's own", () => {
      const { cfg, slots } = withList();
      const groups = galleryPublicFields(cfg, slots);
      expect(group(groups, "Layer names")).toContain("Departures");
      expect(group(groups, "Layer names")).toContain("Platform for Jane");
      // And the name is not repeated as loose text.
      expect(group(groups, "Other text")).not.toContain("Platform for Jane");
    });

    it("shows a row's literal text and its tap's service data", () => {
      const { cfg, slots } = withList();
      const groups = galleryPublicFields(cfg, slots);
      expect(group(groups, "Other text")).toContain("Leaves in");
      // An item placeholder is not an entity, so it goes out as it stands and
      // is listed as the ordinary text it is.
      expect(group(groups, "Service data")).toContain('{"option":"{item.value}"}');
    });
  });
});

describe("galleryBlockers", () => {
  it("has nothing to say about a complete upload", () => {
    const cfg = livingRoom();
    const domains = domainsOf(cfg);
    expect(galleryBlockers(cfg, shareSlots(cfg, domains), META, domains)).toEqual([]);
  });

  it("asks for a title", () => {
    const cfg = livingRoom();
    expect(galleryBlockers(cfg, [], { ...META, title: "   " })).toContain("Give it a title.");
  });

  it("refuses fields over the gallery's limits", () => {
    const cfg = livingRoom();
    const out = galleryBlockers(cfg, [], {
      ...META,
      title: "x".repeat(61),
      description: "x".repeat(501),
      authorName: "x".repeat(41),
      tags: ["weather", "energy", "climate", "security", "media", "health"],
    });
    expect(out.join("\n")).toMatch(/title is longer than 60/);
    expect(out.join("\n")).toMatch(/description is longer than 500/);
    expect(out.join("\n")).toMatch(/nickname is longer than 40/);
    expect(out.join("\n")).toMatch(/at most 5 tags/);
  });

  it("says why a Control Center control has nowhere to go", () => {
    const cfg = livingRoom();
    cfg.control = defaultControlSpec(cfg);
    cfg.supportedFamilies = [];
    const out = galleryBlockers(cfg, [], META);
    expect(out.some((s) => s.startsWith("It is a Control Center control"))).toBe(true);
    // And never the older, vaguer sentence beside it.
    expect(out).not.toContain("It has no shape the gallery can show.");
  });

  // Only a control-only document is turned away. One shape and a control is
  // an ordinary complication that also appears in Control Center.
  it("lets a document with a shape and a control through", () => {
    const cfg = oneShape("rectangular");
    cfg.control = defaultControlSpec(cfg);
    const domains = domainsOf(cfg);
    expect(galleryBlockers(cfg, shareSlots(cfg, domains), META, domains)).toEqual([]);
  });

  it("still says the plain sentence for a shapeless document that is not a control", () => {
    const cfg = livingRoom();
    cfg.supportedFamilies = [];
    expect(galleryBlockers(cfg, [], META)).toContain("It has no shape the gallery can show.");
  });

  it("lets a document with pages through, which is the schema the gallery just took on", () => {
    const cfg = livingRoom();
    setPageCount(cfg, 3);
    expect(schemaVersionFor(cfg)).toBe(9);
    expect(GALLERY_MAX_SCHEMA).toBeGreaterThanOrEqual(9);
    const domains = domainsOf(cfg);
    const out = galleryBlockers(cfg, shareSlots(cfg, domains), META, domains);
    expect(out.some((s) => s.includes("the gallery takes up to"))).toBe(false);
  });

  it("refuses area, label and floor filters", () => {
    const cfg = fixtureConfig("aggregates.json");
    const domains = domainsOf(cfg);
    const out = galleryBlockers(cfg, shareSlots(cfg, domains), META, domains);
    expect(out.some((s) => s.includes("area, label or floor"))).toBe(true);
  });

  it("refuses share text over 64 KB", () => {
    const cfg = livingRoom();
    cfg.values.push({ id: newId(), name: "Big", value: { kind: { kind: "jinja", value: "x".repeat(70 * 1024) } } });
    const out = galleryBlockers(cfg, [], META);
    expect(out.some((s) => s.startsWith("It is too big for the gallery"))).toBe(true);
  });

  it("refuses an entity id the scrub cannot replace", () => {
    const cfg = livingRoom();
    cfg.values.push({ id: newId(), name: "Raw", value: { kind: { kind: "jinja", value: "{{ states.sensor.attic_temp.state }}" } } });
    const domains = new Set([...domainsOf(cfg), "sensor"]);
    const out = galleryBlockers(cfg, shareSlots(cfg, domains), META, domains);
    expect(out.some((s) => s.includes("sensor.attic_temp"))).toBe(true);
  });

  it("refuses a list that reads entities by area", () => {
    const cfg = livingRoom();
    const el = newElement("list");
    if (el.kind !== "list") throw new Error("not a list");
    el.payload.source = {
      kind: "entities",
      scope: { kind: "filter", domains: ["light"], areaIds: ["kitchen"], labelIds: [], floorIds: [] },
      sort: "name",
      descending: false,
      attributes: [],
    };
    cfg.elements.push(el);
    const domains = domainsOf(cfg);
    const out = galleryBlockers(cfg, shareSlots(cfg, domains), META, domains);
    expect(out.some((s) => s.includes("area, label or floor"))).toBe(true);
  });

  it("refuses an unquoted id inside a list's own template", () => {
    const cfg = livingRoom();
    const el = newElement("list");
    if (el.kind !== "list") throw new Error("not a list");
    el.payload.source = { kind: "template", value: "{{ states.sensor.attic_feed.attributes.rows | to_json }}" };
    cfg.elements.push(el);
    const domains = new Set([...domainsOf(cfg), "sensor"]);
    const out = galleryBlockers(cfg, shareSlots(cfg, domains), META, domains);
    expect(out.some((s) => s.includes("sensor.attic_feed"))).toBe(true);
  });

  it("refuses a slot id the gallery's pattern does not take", () => {
    const cfg = livingRoom();
    const slots = shareSlots(cfg, domainsOf(cfg)).map((s) => ({ ...s, placeholderId: "Hue.shared_1" }));
    expect(galleryBlockers(cfg, slots, META).some((s) => s.includes("Hue.shared_1"))).toBe(true);
  });

  it("takes a slot id with digits in the domain", () => {
    const cfg = livingRoom();
    const slots = shareSlots(cfg, domainsOf(cfg)).map((s, i) => ({ ...s, placeholderId: `hue2.shared_${i + 1}` }));
    expect(galleryBlockers(cfg, slots, META).some((s) => s.includes("hue2.shared_"))).toBe(false);
  });
});

describe("galleryBlockersByStep", () => {
  it("puts what was typed under Details and the rest under Send", () => {
    const cfg = livingRoom();
    const domains = domainsOf(cfg);
    const empty = galleryBlockersByStep(cfg, shareSlots(cfg, domains), { ...META, title: " ", authorName: "x".repeat(41) }, domains);
    expect(empty.details).toContain("Give it a title.");
    expect(empty.details.some((s) => s.includes("nickname"))).toBe(true);
    expect(empty.send).toEqual([]);

    const filtered = fixtureConfig("aggregates.json");
    const fd = domainsOf(filtered);
    const out = galleryBlockersByStep(filtered, shareSlots(filtered, fd), META, fd);
    expect(out.details).toEqual([]);
    expect(out.send.some((s) => s.includes("area, label or floor"))).toBe(true);
    expect([...out.details, ...out.send]).toEqual(galleryBlockers(filtered, shareSlots(filtered, fd), META, fd));
  });
});

describe("my uploads", () => {
  const upload = (over: Partial<GalleryUpload>): GalleryUpload => ({
    id: "x", title: "T", status: "approved", rejectReason: null, createdAt: "", voteCount: 0,
    replacesId: null, updatedAt: null, importCount: 0, previewUrl: null,
    sourceId: null, sourceHash: null, description: "", tags: [], ...over,
  });

  it("reads the source, description and tags", () => {
    expect(readGalleryUpload({ id: "a", source_id: "doc-1", description: "D", tags: ["weather", 3] }))
      .toMatchObject({ sourceId: "doc-1", description: "D", tags: ["weather"] });
    expect(readGalleryUpload({ id: "b" })).toMatchObject({ sourceId: null, description: "", tags: [] });
  });

  it("finds the design's own upload in the gallery, with a new version waiting", () => {
    const live = upload({ id: "a", sourceId: "doc" });
    const waiting = upload({ id: "b", status: "pending", replacesId: "a", sourceId: "doc" });
    expect(galleryLinkFor([live], "doc")).toEqual({ kind: "live", upload: live });
    expect(galleryLinkFor([waiting, live], "doc")).toEqual({ kind: "live", upload: live, waiting });
    expect(galleryLinkFor([live], "other")).toBeUndefined();
    expect(galleryLinkFor([live], undefined)).toBeUndefined();
  });

  it("tells whether the design changed since the newest version sent", () => {
    const live = upload({ id: "a", createdAt: "1", sourceId: "doc", sourceHash: "old" });
    const waiting = upload({ id: "b", status: "pending", replacesId: "a", createdAt: "2", sourceId: "doc", sourceHash: "new" });
    const link = galleryLinkFor([live, waiting], "doc")!;
    expect(galleryLinkChanged([live, waiting], link, "new")).toBe(false);
    expect(galleryLinkChanged([live, waiting], link, "old")).toBe(true);
    const unknown = upload({ id: "c", sourceId: "doc2" });
    expect(galleryLinkChanged([unknown], galleryLinkFor([unknown], "doc2")!, "x")).toBeUndefined();
  });

  it("starts an update from the newest version sent", () => {
    const live = upload({ id: "a", createdAt: "2026-09-01T00:00:00Z" });
    const older = upload({ id: "b", status: "rejected", replacesId: "a", createdAt: "2026-09-02T00:00:00Z" });
    const newest = upload({ id: "c", status: "pending", replacesId: "a", createdAt: "2026-09-03T00:00:00Z", description: "New words" });
    const other = upload({ id: "d", replacesId: "z", createdAt: "2026-09-04T00:00:00Z" });
    expect(latestGalleryVersion([other, newest, older, live], live)).toBe(newest);
    expect(latestGalleryVersion([live], live)).toBe(live);
  });

  it("links an older upload through a new version sent from the design", () => {
    const old = upload({ id: "a" });
    const turnedDown = upload({ id: "b", status: "rejected", replacesId: "a", sourceId: "doc" });
    expect(galleryLinkFor([turnedDown, old], "doc")).toEqual({ kind: "live", upload: old });
  });

  it("finds a first upload still waiting, and skips turned-down or removed ones", () => {
    const pending = upload({ id: "a", status: "pending", sourceId: "doc" });
    expect(galleryLinkFor([pending], "doc")).toEqual({ kind: "pending", upload: pending });
    expect(galleryLinkFor([upload({ id: "c", status: "rejected", sourceId: "doc" }), upload({ id: "d", status: "removed", sourceId: "doc" })], "doc")).toBeUndefined();
  });

  it("reads either spelling and resolves a relative preview address", () => {
    const base = "https://wrist-assistant.com/api/gallery";
    expect(readGalleryUpload({ id: "a", title: "A", status: "pending", replaces_id: "z", import_count: 3, preview_url: "previews/a.png", updated_at: "u" }, base))
      .toMatchObject({ replacesId: "z", importCount: 3, updatedAt: "u", previewUrl: "https://wrist-assistant.com/api/gallery/previews/a.png" });
    expect(readGalleryUpload({ id: "b", replacesId: "y", importCount: 2, previewUrl: "https://cdn.example/b.png" }, base))
      .toMatchObject({ replacesId: "y", importCount: 2, previewUrl: "https://cdn.example/b.png" });
    expect(readGalleryUpload({ title: "no id" }, base)).toBeUndefined();
    expect(resolvePreviewUrl("/api/gallery/previews/c.png", base)).toBe("https://wrist-assistant.com/api/gallery/previews/c.png");
  });

  it("hangs new versions under the upload they replace, and offers Update only when nothing waits", () => {
    const items = [
      upload({ id: "b", status: "pending", replacesId: "a" }),
      upload({ id: "c", status: "rejected", replacesId: "a", rejectReason: "Names a street" }),
      upload({ id: "a", title: "Door ring" }),
      upload({ id: "d", status: "pending", replacesId: "gone" }),
      upload({ id: "e", title: "Solar", voteCount: 12, importCount: 31 }),
      upload({ id: "f", status: "rejected" }),
      upload({ id: "g", status: "rejected", replacesId: "h" }),
      upload({ id: "h", title: "Tried again" }),
    ];
    const rows = galleryUploadRows(items);
    expect(rows.map((r) => r.upload.id)).toEqual(["a", "d", "e", "f", "h"]);
    const byId = new Map(rows.map((r) => [r.upload.id, r]));
    expect(byId.get("a")!.updates.map((u) => u.id)).toEqual(["b", "c"]);
    expect(byId.get("a")!.canUpdate).toBe(false);
    expect(byId.get("d")!.canUpdate).toBe(false);
    expect(byId.get("e")!.canUpdate).toBe(true);
    expect(byId.get("f")!.canUpdate).toBe(false);
    // A turned-down new version does not stop another try.
    expect(byId.get("h")!.canUpdate).toBe(true);
  });

  it("words each state", () => {
    expect(galleryStatusLabel(upload({ status: "pending", replacesId: "a" }))).toBe("New version in review");
    expect(galleryStatusLabel(upload({ status: "rejected", replacesId: "a" }))).toBe("New version not approved");
    expect(galleryStatusLabel(upload({ status: "pending" }))).toBe("Waiting for review");
    expect(galleryUploadSubline(upload({ voteCount: 12, importCount: 31 }))).toBe("12 votes · added 31 times");
    expect(galleryUploadSubline(upload({ voteCount: 1, importCount: 1 }))).toBe("1 vote · added once");
    expect(galleryUploadSubline(upload({ status: "rejected", rejectReason: "Blurry" }))).toBe("Blurry");
  });
});

describe("unquotedEntityIds", () => {
  const domains = new Set(["sensor", "sun"]);

  it("finds dotted state access and ignores quoted ids and other dots", () => {
    expect(unquotedEntityIds("{{ states.sensor.a.state }} {{ states.sun.sun.attributes.elevation }}", domains))
      .toEqual(["sensor.a", "sun.sun"]);
    expect(unquotedEntityIds("{{ states('sensor.shared_1') }} {{ value.attributes }} 3.5", domains)).toEqual([]);
  });
});

describe("gallery calls", () => {
  interface Call { url: string; init: Parameters<GalleryFetch>[1] }

  function stub(status: number, body: unknown, headers: Record<string, string> = {}): { fetch: GalleryFetch; calls: Call[] } {
    const calls: Call[] = [];
    const fetch: GalleryFetch = async (url, init) => {
      calls.push({ url, init });
      return {
        ok: status >= 200 && status < 300,
        status,
        headers: { get: (name: string) => headers[name.toLowerCase()] ?? null },
        json: async () => {
          if (typeof body === "string") throw new SyntaxError("not json");
          return body;
        },
      };
    };
    return { fetch, calls };
  }

  const submission = (meta: GalleryMeta = META) => ({
    ...buildGallerySubmission(oneShape("rectangular"), [], meta),
    previews: [{ family: "rectangular" as const, png: "iVBORw0KGgo=" }],
  });

  it("posts the submission with the key header and no cookies", async () => {
    const { fetch, calls } = stub(201, { id: "abc123defg", status: "pending" });
    const body = submission();
    const out = await submitToGallery(fetch, "k".repeat(43), body);
    expect(out).toEqual({ id: "abc123defg", status: "pending" });
    expect(calls).toHaveLength(1);
    expect(calls[0]!.url).toBe(`${GALLERY_API_BASE}/submissions`);
    expect(calls[0]!.init.method).toBe("POST");
    expect(calls[0]!.init.headers["X-Gallery-Key"]).toBe("k".repeat(43));
    expect(calls[0]!.init.headers["content-type"]).toBe("application/json");
    expect(calls[0]!.init.credentials).toBe("omit");
    expect(JSON.parse(calls[0]!.init.body!)).toEqual(body);
  });

  it("sends one shape and one picture, with the device beside them", async () => {
    const { fetch, calls } = stub(201, { id: "a", status: "pending" });
    await submitToGallery(fetch, "key", submission({ ...META, device: "watch" }));
    const sent = JSON.parse(calls[0]!.init.body!) as { families: string[]; previews: unknown[]; device?: string };
    expect(sent.families).toEqual(["rectangular"]);
    expect(sent.previews).toHaveLength(1);
    expect(sent.device).toBe("watch");

    const unknown = stub(201, { id: "b", status: "pending" });
    await submitToGallery(unknown.fetch, "key", submission());
    expect(JSON.parse(unknown.calls[0]!.init.body!)).not.toHaveProperty("device");
  });

  it("lists and deletes the uploader's own items", async () => {
    const items = [{ id: "a", title: "T", status: "rejected", rejectReason: "Blurry", createdAt: "2026-09-13T00:00:00Z", voteCount: 0 }];
    const list = stub(200, { items });
    expect(await listMyUploads(list.fetch, "key", "https://staging.example/api/gallery")).toEqual([
      { ...items[0], replacesId: null, updatedAt: null, importCount: 0, previewUrl: null, sourceId: null, sourceHash: null, description: "", tags: [] },
    ]);
    expect(list.calls[0]!.url).toBe("https://staging.example/api/gallery/mine");
    expect(list.calls[0]!.init.method).toBe("GET");
    expect(list.calls[0]!.init.headers["X-Gallery-Key"]).toBe("key");
    expect(list.calls[0]!.init.body).toBeUndefined();

    const del = stub(204, "");
    await deleteMyUpload(del.fetch, "key", "a/b");
    expect(del.calls[0]!.url).toBe(`${GALLERY_API_BASE}/mine/a%2Fb`);
    expect(del.calls[0]!.init.method).toBe("DELETE");
    expect(del.calls[0]!.init.headers["X-Gallery-Key"]).toBe("key");
  });

  async function failed(promise: Promise<unknown>): Promise<GalleryError> {
    try {
      await promise;
    } catch (err) {
      if (err instanceof GalleryError) return err;
      throw err;
    }
    throw new Error("expected a failure");
  }

  it("maps a daily cap to try again tomorrow", async () => {
    const { fetch } = stub(429, { error: "rate_limited" }, { "retry-after": "3600" });
    const err = await failed(submitToGallery(fetch, "key", submission()));
    expect(err.code).toBe("rate_limited");
    expect(err.retryAfter).toBe(3600);
    expect(galleryErrorMessage(err)).toMatch(/Try again tomorrow\.$/);
  });

  it("names the field the gallery refused", async () => {
    const { fetch } = stub(400, { error: "invalid_field", detail: "authorName" });
    const err = await failed(submitToGallery(fetch, "key", submission()));
    expect(err.code).toBe("invalid_field");
    expect(galleryErrorMessage(err)).toBe("The gallery did not accept the nickname.");
    expect(galleryErrorMessage(new GalleryError("invalid_field", 400, "device"))).toBe("The gallery did not accept the device.");
  });

  it("reads every contract code, and a page that is not JSON as a server error", async () => {
    for (const code of ["bad_json", "too_large", "schema_too_new", "bad_png", "not_found", "not_updatable", "forbidden"] as const) {
      const { fetch } = stub(400, { error: code });
      expect((await failed(listMyUploads(fetch, "key"))).code).toBe(code);
    }
    const { fetch } = stub(502, "<html>Bad gateway</html>");
    expect((await failed(listMyUploads(fetch, "key"))).code).toBe("server_error");
  });

  it("reports a failed connection as a network error", async () => {
    const fetch: GalleryFetch = async () => { throw new TypeError("Failed to fetch"); };
    const err = await failed(deleteMyUpload(fetch, "key", "a"));
    expect(err.code).toBe("network");
    expect(galleryErrorMessage(err)).toMatch(/Could not reach the gallery/);
  });

  it("sends a new version with the upload it replaces, and a new item without the key", async () => {
    const update = stub(201, { id: "b2", status: "pending", replaces: "a1" });
    const out = await submitToGallery(update.fetch, "key", { ...submission(), replaces: "a1" });
    expect(out).toEqual({ id: "b2", status: "pending", replaces: "a1" });
    expect(JSON.parse(update.calls[0]!.init.body!).replaces).toBe("a1");

    const fresh = stub(201, { id: "c3", status: "pending" });
    await submitToGallery(fresh.fetch, "key", { ...submission(), replaces: "" });
    expect(JSON.parse(fresh.calls[0]!.init.body!)).not.toHaveProperty("replaces");
  });

  it("explains an update the gallery will not take", async () => {
    const { fetch } = stub(409, { error: "not_updatable" });
    const err = await failed(submitToGallery(fetch, "key", { ...submission(), replaces: "a1" }));
    expect(err.code).toBe("not_updatable");
    expect(galleryErrorMessage(err)).toMatch(/in the gallery before it can be updated/);
    const missing = stub(404, { error: "not_found" });
    expect((await failed(submitToGallery(missing.fetch, "key", { ...submission(), replaces: "zz" }))).code).toBe("not_found");
    expect(galleryErrorMessage(new GalleryError("invalid_field", 400, "replaces"))).toBe("The gallery did not accept the upload to update.");
  });

  it("refuses a body over 1 MB before sending it", async () => {
    const { fetch, calls } = stub(201, {});
    const big = { ...submission(), previews: [{ family: "rectangular" as const, png: "A".repeat(1024 * 1024) }] };
    expect((await failed(submitToGallery(fetch, "key", big))).code).toBe("too_large");
    expect(calls).toHaveLength(0);
  });
});

describe("preview context", () => {
  it("puts live states and template results under the scrubbed ids and keys", () => {
    const cfg = livingRoom();
    cfg.values.push({ id: newId(), name: "Cost", value: { kind: { kind: "jinja", value: "{{ states('sensor.boiler_meter') }}" } } });
    const domains = new Set([...domainsOf(cfg), "sensor"]);
    const slots = shareSlots(cfg, domains);
    const scrubbed = scrubForShare(cfg, slots);

    const oldValue = cfg.values[cfg.values.length - 1]!.value;
    const newValue = scrubbed.values[scrubbed.values.length - 1]!.value;
    const oldKey = keyFor(oldValue, cfg.values)!;
    const newKey = keyFor(newValue, scrubbed.values)!;
    expect(oldKey).not.toBe(newKey);

    const ctx = galleryPreviewContext(cfg, scrubbed, slots, {
      entityState: (id) => ({ entityId: id, state: "21.5", iconName: "mdi:private", domain: id.split(".")[0] ?? "", entityPicture: "/api/camera_proxy/x?token=secret" }),
      templateResults: new Map([[oldKey, "42"]]),
      historySeries: new Map(),
    });
    expect(ctx.templateResults.get(newKey)).toBe("42");
    for (const slot of slots) {
      const state = ctx.entityStates.get(slot.placeholderId);
      expect(state?.state).toBe("21.5");
      expect(state?.entityId).toBe(slot.placeholderId);
      expect(state?.iconName).toBe("mdi:private");
      expect(state?.entityPicture).toBeUndefined();
      expect(ctx.entityStates.has(slot.originalId)).toBe(false);
    }
  });

  it("carries a list's items across to the keys the scrubbed document reads", () => {
    const cfg = livingRoom();
    const jinja = newElement("list");
    if (jinja.kind !== "list") throw new Error("not a list");
    jinja.payload.source = { kind: "template", value: "{{ state_attr('sensor.bus_stop', 'departures') | to_json }}" };
    const served = newElement("list");
    if (served.kind !== "list") throw new Error("not a list");
    served.payload.source = {
      kind: "todo",
      entities: [{ entityId: "todo.shopping", displayName: "Shopping", domain: "todo" }],
      status: "open",
      sort: "list",
    };
    cfg.elements.push(jinja, served);
    const domains = new Set([...domainsOf(cfg), "sensor", "todo"]);
    const slots = shareSlots(cfg, domains);
    const scrubbed = scrubForShare(cfg, slots);

    const rows = '{"items": [{"title": "Milk"}], "total": 1}';
    const ctx = galleryPreviewContext(cfg, scrubbed, slots, {
      entityState: () => undefined,
      templateResults: new Map([[listExpressionKey(jinja.payload.source, jinja.payload.rows)!, rows]]),
      historySeries: new Map(),
      listItems: new Map([[listKey(served.payload.source)!, rows]]),
    });

    const scrubbedJinja = scrubbed.elements[scrubbed.elements.length - 2]!;
    const scrubbedServed = scrubbed.elements[scrubbed.elements.length - 1]!;
    if (scrubbedJinja.kind !== "list" || scrubbedServed.kind !== "list") throw new Error("not a list");
    const newTemplateKey = listExpressionKey(scrubbedJinja.payload.source, scrubbedJinja.payload.rows)!;
    const newListKey = listKey(scrubbedServed.payload.source)!;
    // Both keys moved with the scrub, and the items followed them.
    expect(newTemplateKey).not.toBe(listExpressionKey(jinja.payload.source, jinja.payload.rows));
    expect(newListKey).toMatch(/^todo\|todo\.shared_\d+\|open\|list$/);
    expect(ctx.templateResults.get(newTemplateKey)).toBe(rows);
    expect(ctx.listItems?.get(newListKey)).toBe(rows);
  });

  // The picture is a stand-in with no address, so a timestamp on it used to
  // print nothing, and was taken out. It stays and reads the upload's time.
  it("draws a picture's timestamp on the stand-in, capsule and time both", () => {
    const noLiveData = { entityState: () => undefined, templateResults: new Map(), historySeries: new Map() };
    const cfg = fixtureConfig("image_time_value.json");
    const plan = galleryPreviewPlan(cfg, shareSlots(cfg, domainsOf(cfg)), noLiveData);
    if (plan.kind !== "canvas") throw new Error(`expected a canvas plan, got ${plan.kind}`);
    const els = plan.pages[0]!.layout.elements;
    expect(els.some((r) => r.kind === "image")).toBe(true);
    const time = cfg.elements.find((el) => el.kind === "text" && el.payload.value.kind.kind === "imageTime")!;
    const drawn = els.find((r) => r.id === time.payload.id);
    expect(drawn?.kind).toBe("text");
    expect(drawn?.kind === "text" ? drawn.text : "").toMatch(/\d:\d\d/);
    const capsule = cfg.elements.find((el) => el.kind === "shape" && el.payload.groupId === time.payload.groupId)!;
    expect(els.some((r) => r.id === capsule.payload.id)).toBe(true);
  });

  it("draws an old timestamp layer on the stand-in at full strength", () => {
    const noLiveData = { entityState: () => undefined, templateResults: new Map(), historySeries: new Map() };
    const cfg = fixtureConfig("image_time_layer.json");
    const plan = galleryPreviewPlan(cfg, shareSlots(cfg, domainsOf(cfg)), noLiveData);
    if (plan.kind !== "canvas") throw new Error(`expected a canvas plan, got ${plan.kind}`);
    const chip = plan.pages[0]!.layout.elements.find((r) => r.kind === "imageTime");
    expect(chip).toBeDefined();
    expect(chip?.kind === "imageTime" && chip.standIn).toBe(true);
  });

  describe("the pictures of a paged design", () => {
    const noLiveData = { entityState: () => undefined, templateResults: new Map(), historySeries: new Map() };

    it("draws one picture per page, each with only that page's layers", () => {
      const cfg = fixtureConfig("pages.json");
      const plan = galleryPreviewPlan(cfg, [], noLiveData);
      if (plan.kind !== "canvas") throw new Error(`expected a canvas plan, got ${plan.kind}`);
      expect(plan.family).toBe("rectangular");
      expect(plan.pages.map((p) => p.page)).toEqual([1, 2, 3]);
      const everyPage = cfg.elements.find((el) => el.kind === "text" && el.payload.page === undefined)!.payload.id;
      cfg.elements.filter((el) => el.kind !== "tap").forEach((el) => {
        for (const { page, layout } of plan.pages) {
          const shown = layout.elements.some((r) => r.id === el.payload.id);
          expect(shown, `${el.kind} pinned to ${el.payload.page ?? "every page"} on page ${page}`)
            .toBe(el.payload.id === everyPage || el.payload.page === page);
        }
      });
    });

    it("draws a design without pages once, with no page number", () => {
      const cfg = fixtureConfig("pages.json");
      setPageCount(cfg, 1);
      const plan = galleryPreviewPlan(cfg, [], noLiveData);
      if (plan.kind !== "canvas") throw new Error(`expected a canvas plan, got ${plan.kind}`);
      expect(plan.pages).toHaveLength(1);
      expect(plan.pages[0]!.page).toBeUndefined();
    });
  });

  describe("the inline line's picture", () => {
    const drawn: string[] = [];
    const icons: IconProvider = {
      render: (symbol) => {
        drawn.push(symbol);
        return symbol === "no.such.icon" ? undefined : litSvg`<svg></svg>`;
      },
      available: () => true,
      names: () => [],
    };
    const words = (t: unknown): string[] => {
      if (typeof t === "string") return [t];
      if (Array.isArray(t)) return t.flatMap(words);
      const r = t as TemplateResult | undefined;
      return r && Array.isArray(r.values) ? r.values.flatMap(words) : [];
    };
    const measure = (text: string) => text.length * 8;

    it("draws icon parts as icons, never as their names", () => {
      drawn.length = 0;
      const line = `Text${inlineSymbolMarker("lamp.desk.fill")} ${inlineSymbolMarker("bed.double.fill")}`;
      const out = inlineLineSvg({ text: line }, icons, measure)!;
      expect(drawn).toEqual(["lamp.desk.fill", "bed.double.fill"]);
      const text = words(out).join("|");
      expect(text).toContain("Text");
      expect(text).not.toContain("lamp.desk");
      expect(text).not.toMatch(/[\uE000\uE001]/);
    });

    it("puts the symbol first and the label before the value", () => {
      drawn.length = 0;
      const out = inlineLineSvg({ symbol: "bolt.fill", label: "Power", text: "12 W" }, icons, measure)!;
      expect(drawn).toEqual(["bolt.fill"]);
      expect(words(out)).toContain("Power: 12 W");
    });

    it("cuts a long line where the watch cuts it, an icon counting as one", () => {
      const out = inlineRunsShown([{ text: "Text" }, { symbol: "lamp.desk.fill" }, { text: " " }, { symbol: "bed.double.fill" }, { text: " tstetststwsttsetestset" }]);
      expect(out).toEqual([{ text: "Text" }, { symbol: "lamp.desk.fill" }, { text: " " }, { symbol: "bed.double.fill" }, { text: " tstetst…" }]);
      const count = out.reduce((n, r) => n + ("text" in r ? [...r.text].length : 1), 0);
      expect(count).toBe(16);
    });

    it("keeps a line that fits whole, and cuts plain words like the panel's card", () => {
      expect(inlineRunsShown([{ symbol: "bolt.fill" }, { text: "Power: 12 W" }])).toEqual([{ symbol: "bolt.fill" }, { text: "Power: 12 W" }]);
      expect(inlineRunsShown([{ text: "Front Yard test test" }])).toEqual([{ text: "Front Yard test…" }]);
    });

    it("skips an icon the pack cannot draw and draws nothing for nothing", () => {
      const out = inlineLineSvg({ text: `A${inlineSymbolMarker("no.such.icon")}` }, icons, measure)!;
      expect(words(out)).toContain("A");
      expect(inlineLineSvg({ text: inlineSymbolMarker("no.such.icon") }, icons, measure)).toBeUndefined();
    });
  });
});
