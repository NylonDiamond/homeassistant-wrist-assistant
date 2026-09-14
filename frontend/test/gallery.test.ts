// Sending to the gallery: the body is the Share text and nothing more, the
// public list names the free text an author wrote, the blockers refuse what
// the gallery or privacy would refuse, and the three calls speak the contract.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  type CustomComplicationConfig,
  documentEntityUses,
  newElement,
  newId,
  parseConfig,
} from "../src/model.js";
import { keyFor } from "../src/compiler.js";
import { exportText, parseImportText, scrubForShare, shareSlots } from "../src/transfer.js";
import { supportedFamilies } from "../src/layouts.js";
import {
  type GalleryFetch,
  type GalleryMeta,
  type GalleryUpload,
  GALLERY_API_BASE,
  GalleryError,
  buildGallerySubmission,
  deleteMyUpload,
  galleryBlockers,
  galleryBlockersByStep,
  galleryErrorMessage,
  galleryPublicFields,
  galleryStatusLabel,
  galleryUploadRows,
  galleryUploadSubline,
  listMyUploads,
  readGalleryUpload,
  resolvePreviewUrl,
  submitToGallery,
  unquotedEntityIds,
} from "../src/gallery.js";
import { galleryPreviewContext, withPicturePlaceholders } from "../src/preview-png.js";

function livingRoom(): CustomComplicationConfig {
  const parsed = parseImportText(readFileSync(join(__dirname, "fixtures-share", "living-room-backup.json"), "utf8"), 6);
  if (!parsed.ok) throw new Error(parsed.error);
  return parsed.config;
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
    const cfg = livingRoom();
    const slots = shareSlots(cfg, domainsOf(cfg)).map((s, i) => ({ ...s, label: `Thing ${i + 1}` }));
    expect(slots.length).toBeGreaterThan(0);
    const body = buildGallerySubmission(cfg, slots, META);
    const named = structuredClone(cfg);
    named.name = META.title;
    expect(body.shareText).toBe(exportText(named, "share", slots));
    for (const slot of slots) expect(body.shareText).not.toContain(slot.originalId);
    expect(body.slots).toEqual(slots.map((s) => ({ id: s.placeholderId, label: s.label })));
    expect(body.families).toEqual(supportedFamilies(cfg));
    expect(body.panelVersion).toBe("2.1.0-beta.5");
    expect(body).not.toHaveProperty("previews");
  });

  // The Worker, the gallery page and this file carry the same eight names, so
  // a Home Screen tile is filed under its own shape rather than dropped.
  it("files a Home Screen tile under its own shape", () => {
    const cfg = livingRoom();
    cfg.supportedFamilies = ["rectangular", "small", "medium", "large", "xlarge"];
    const body = buildGallerySubmission(cfg, [], META);
    expect(body.families).toEqual(["rectangular", "small", "medium", "large", "xlarge"]);
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

  it("shows template text as it will be sent, with the entity replaced", () => {
    const { cfg, slots } = withText();
    const templates = group(galleryPublicFields(cfg, slots), "Template text");
    const ours = templates.find((t) => t.includes("* 0.3"));
    expect(ours).toBeDefined();
    expect(templates.join("\n")).not.toContain("sensor.boiler_meter");
    expect(ours).toMatch(/states\('sensor\.shared_\d+'\)/);
  });

  it("catches a literal typed into a layer, and no ids or colours", () => {
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
    replacesId: null, updatedAt: null, importCount: 0, previewUrl: null, ...over,
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

  const submission = () => ({
    ...buildGallerySubmission(livingRoom(), [], META),
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

  it("lists and deletes the uploader's own items", async () => {
    const items = [{ id: "a", title: "T", status: "rejected", rejectReason: "Blurry", createdAt: "2026-09-13T00:00:00Z", voteCount: 0 }];
    const list = stub(200, { items });
    expect(await listMyUploads(list.fetch, "key", "https://staging.example/api/gallery")).toEqual([
      { ...items[0], replacesId: null, updatedAt: null, importCount: 0, previewUrl: null },
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
      expect(state?.iconName).toBe("");
      expect(state?.entityPicture).toBeUndefined();
      expect(ctx.entityStates.has(slot.originalId)).toBe(false);
    }
  });

  it("keeps picture layers as stand-ins and leaves their timestamps out", () => {
    const cfg = fixtureConfig("image_time_layer.json");
    expect(cfg.elements.some((el) => el.kind === "imageTime")).toBe(true);
    const out = withPicturePlaceholders(cfg);
    expect(out.elements.some((el) => el.kind === "image")).toBe(true);
    expect(out.elements.some((el) => el.kind === "imageTime")).toBe(false);
    expect(cfg.elements.some((el) => el.kind === "imageTime")).toBe(true);
  });
});
