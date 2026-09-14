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
  GALLERY_API_BASE,
  GalleryError,
  buildGallerySubmission,
  deleteMyUpload,
  galleryBlockers,
  galleryErrorMessage,
  galleryPublicFields,
  listMyUploads,
  submitToGallery,
  unquotedEntityIds,
} from "../src/gallery.js";
import { galleryPreviewContext, withoutImageLayers } from "../src/preview-png.js";

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
    expect(body.shareText).toBe(exportText(cfg, "share", slots));
    for (const slot of slots) expect(body.shareText).not.toContain(slot.originalId);
    expect(body.slots).toEqual(slots.map((s) => ({ id: s.placeholderId, label: s.label })));
    expect(body.families).toEqual(supportedFamilies(cfg));
    expect(body.panelVersion).toBe("2.1.0-beta.5");
    expect(body).not.toHaveProperty("previews");
  });

  it("trims the fields and keeps only gallery tags, once each", () => {
    const cfg = livingRoom();
    const body = buildGallerySubmission(cfg, [], { ...META, title: "  Hi  ", tags: ["media", "nope", "media"] });
    expect(body.title).toBe("Hi");
    expect(body.tags).toEqual(["media"]);
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

  it("lists the name, layer names, shared value names and slot labels", () => {
    const { cfg, slots } = withText();
    const groups = galleryPublicFields(cfg, slots);
    expect(group(groups, "Complication name")).toEqual([cfg.name]);
    expect(group(groups, "Layer names")).toContain("The Smiths lamp");
    expect(group(groups, "Shared value names")).toContain("Heating cost");
    expect(group(groups, "Slot labels")).toEqual(slots.map((s) => s.label));
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
    expect(await listMyUploads(list.fetch, "key", "https://staging.example/api/gallery")).toEqual(items);
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
    for (const code of ["bad_json", "too_large", "schema_too_new", "bad_png", "not_found", "forbidden"] as const) {
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

  it("leaves picture layers and their timestamps out", () => {
    const cfg = fixtureConfig("image_time_layer.json");
    expect(cfg.elements.some((el) => el.kind === "image")).toBe(true);
    const out = withoutImageLayers(cfg);
    expect(out.elements.some((el) => el.kind === "image" || el.kind === "imageTime")).toBe(false);
    expect(cfg.elements.some((el) => el.kind === "image")).toBe(true);
  });
});
