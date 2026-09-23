// A picture's timestamp as building blocks (decided 2026-09-23): an ordinary
// text layer reading `{kind: "imageTime", layer: <picture>}` over an ordinary
// capsule, the two grouped as "Timestamp". The value kind is the wire contract
// shared with the app; the rest is how the editor makes, converts, deletes and
// copies the group.

import { describe, expect, it } from "vitest";
import { Draft } from "../src/draft.js";
import {
  type CustomComplicationConfig,
  type Element,
  IMAGE_TIMESTAMP_CAPSULE_HEX,
  addImageTime,
  auditUnknownKeys,
  convertImageTimeLayer,
  copyElements,
  encodeConfig,
  encodeValue,
  groupMembers,
  groupOf,
  imageTimeTextsOf,
  imageTimestampLayersOf,
  imageTimesOf,
  liftChartOwnMarks,
  newConfig,
  newElement,
  parseConfig,
  parseValue,
  pasteElements,
  removeElement,
  removeImageTimestamp,
  schemaVersionFor,
  setGroup,
} from "../src/model.js";
import { type EntityState, type ResolvedElement, Resolver, resolveAll, timestampString } from "../src/resolver.js";

type Image = Extract<Element, { kind: "image" }>;
type Text = Extract<Element, { kind: "text" }>;
type Shape = Extract<Element, { kind: "shape" }>;
type ImageTime = Extract<Element, { kind: "imageTime" }>;

function camera(source: Image["payload"]["source"] = "camera"): { cfg: CustomComplicationConfig; image: Image } {
  const cfg = newConfig("Door", 0);
  const image = newElement("image") as Image;
  image.payload.source = source;
  image.payload.entity = source === "inline"
    ? { entityId: "", displayName: "", domain: "" }
    : { entityId: "camera.door", displayName: "Door", domain: "camera" };
  image.payload.frame = { x: 0, y: 0, width: 0.5, height: 1, rotationDegrees: 0 };
  cfg.elements.push(image);
  return { cfg, image };
}

function textReading(layer: string, format?: Text["payload"]["value"]["format"]): Text {
  const t = newElement("text") as Text;
  t.payload.value = { kind: { kind: "imageTime", layer }, ...(format ? { format } : {}) };
  return t;
}

const byId = (cfg: CustomComplicationConfig, id: string) => cfg.elements.find((e) => e.payload.id === id);

// 2026-09-21 23:26:29 UTC, a Monday.
const NOW_MS = Date.UTC(2026, 8, 21, 23, 26, 29);

function resolveText(cfg: CustomComplicationConfig, id: string, withPicture = true): ResolvedElement | undefined {
  const entityStates = new Map<string, EntityState>(withPicture
    ? [["camera.door", { entityId: "camera.door", state: "idle", domain: "camera", iconName: "", entityPicture: "/pic" }]]
    : []);
  return resolveAll(cfg, { entityStates, templateResults: new Map(), namedValues: cfg.values, nowMs: NOW_MS, locale: "en-US", timeZone: "UTC" })
    .rectangular!.elements.find((e) => e.id === id);
}

describe("the imageTime value on the wire", () => {
  it("round-trips flat, like chartStat, with an upper-cased layer id", () => {
    const v = parseValue({ kind: { kind: "imageTime", layer: "abc-123" } });
    expect(v.kind).toEqual({ kind: "imageTime", layer: "ABC-123" });
    expect(encodeValue(v)).toEqual({ kind: { kind: "imageTime", layer: "ABC-123" } });
  });

  it("writes showSeconds only when it is on, and audits clean", () => {
    const { cfg, image } = camera();
    const on = textReading(image.payload.id, { timestamp: "clock", showSeconds: true, hideDayPeriod: true });
    const off = textReading(image.payload.id, { timestamp: "clock" });
    cfg.elements.push(on, off);
    const raw = JSON.parse(JSON.stringify(encodeConfig(cfg)));
    const payload = (id: string) => (raw.elements as { payload: { id: string; value: { format?: Record<string, unknown> } } }[])
      .find((e) => e.payload.id === id)!.payload;
    expect(payload(on.payload.id).value).toEqual({
      kind: { kind: "imageTime", layer: image.payload.id },
      format: { timestamp: "clock", hideDayPeriod: true, showSeconds: true },
    });
    expect("showSeconds" in payload(off.payload.id).value.format!).toBe(false);
    expect(auditUnknownKeys(raw)).toEqual([]);
    const back = parseConfig(raw);
    const t = byId(back, on.payload.id) as Text;
    expect(t.payload.value.format?.showSeconds).toBe(true);
  });

  it("needs schema 10 wherever the value sits, and nothing else does", () => {
    const { cfg, image } = camera();
    expect(schemaVersionFor(cfg)).toBeLessThan(10);
    // The old layer kind is older than the rung and needs nothing.
    const old = newElement("imageTime") as ImageTime;
    old.payload.image = image.payload.id;
    cfg.elements.push(old);
    expect(schemaVersionFor(cfg)).toBeLessThan(10);
    const inText = structuredClone(cfg);
    inText.elements.push(textReading(image.payload.id));
    expect(schemaVersionFor(inText)).toBe(10);
    const inShared = structuredClone(cfg);
    inShared.values.push({ id: "V1", name: "Time", value: { kind: { kind: "imageTime", layer: image.payload.id } } });
    expect(schemaVersionFor(inShared)).toBe(10);
  });
});

describe("resolving a picture's time", () => {
  it("is now, in whole unix seconds, while the picture is there and fetched", () => {
    const pictured = (): Map<string, EntityState> => new Map([["camera.door",
      { entityId: "camera.door", state: "idle", domain: "camera", iconName: "", entityPicture: "/pic" }]]);
    const { cfg, image } = camera();
    const r = new Resolver({ entityStates: pictured(), templateResults: new Map(), namedValues: [], nowMs: NOW_MS + 700 }, cfg);
    expect(r.resolve({ kind: { kind: "imageTime", layer: image.payload.id } })).toBe(String(NOW_MS / 1000));
    // An entity picture has a time too.
    const person = camera("entityPicture");
    const rp = new Resolver({ entityStates: pictured(), templateResults: new Map(), namedValues: [], nowMs: NOW_MS }, person.cfg);
    expect(rp.resolve({ kind: { kind: "imageTime", layer: person.image.payload.id } })).toBe(String(NOW_MS / 1000));
  });

  it("prints through the timestamp format, and draws nothing before the picture has a URL", () => {
    const { cfg, image } = camera();
    const t = textReading(image.payload.id, { timestamp: "clock", showSeconds: true, hideDayPeriod: true });
    cfg.elements.push(t);
    expect(resolveText(cfg, t.payload.id)).toMatchObject({ kind: "text", text: "11:26:29" });
    // No URL stands for a picture the watch has not fetched yet.
    expect(resolveText(cfg, t.payload.id, false)).toMatchObject({ kind: "text", text: "" });
  });

  it("is empty, never the placeholder, for a missing picture, an uploaded one, or a layer that is no picture", () => {
    const { cfg, image } = camera("inline");
    const shape = newElement("shape");
    cfg.elements.push(shape);
    const inline = textReading(image.payload.id, { timestamp: "clock", prefix: "at " });
    const missing = textReading("00000000-0000-0000-0000-000000000000", { timestamp: "clock" });
    const notAPicture = textReading(shape.payload.id);
    cfg.elements.push(inline, missing, notAPicture);
    for (const t of [inline, missing, notAPicture]) {
      // No prefix drawn alone either: the formatting is skipped.
      expect(resolveText(cfg, t.payload.id)).toMatchObject({ kind: "text", text: "" });
    }
  });
});

describe("showSeconds", () => {
  const at = NOW_MS / 1000;
  // Node's ICU spaces the day period with U+0020 where a current browser, and
  // the app, use U+202F; either is the locale's own separator.
  const sp = "[  ]";

  it("adds the seconds to a clock and to a weekday and time", () => {
    expect(timestampString(at, "clock", "en-US", "UTC", { seconds: true })).toMatch(new RegExp(`^11:26:29${sp}PM$`));
    expect(timestampString(at, "clock", "en-US", "UTC", { seconds: true, dayPeriod: true })).toBe("11:26:29");
    expect(timestampString(at, "dateTime", "en-US", "UTC", { seconds: true })).toMatch(new RegExp(`^Mon 11:26:29${sp}PM$`));
    expect(timestampString(at, "dateTime", "en-US", "UTC", { seconds: true, dayPeriod: true })).toBe("Mon 11:26:29");
    expect(timestampString(at, "clock", "en-GB", "UTC", { seconds: true })).toBe("23:26:29");
  });

  it("is ignored when the minutes are hidden, and by the styles with no clock", () => {
    expect(timestampString(at, "clock", "en-US", "UTC", { seconds: true, minutes: true })).toMatch(new RegExp(`^11${sp}PM$`));
    expect(timestampString(at, "date", "en-US", "UTC", { seconds: true })).toBe("Sep 21");
    expect(timestampString(at, "weekday", "en-US", "UTC", { seconds: true })).toBe("Mon");
  });
});

describe("making a picture's timestamp", () => {
  it("is a capsule and a text over it, grouped as Timestamp, above the picture", () => {
    const { cfg, image } = camera();
    const id = addImageTime(cfg, image.payload.id)!;
    const text = byId(cfg, id) as Text;
    const group = groupOf(cfg, id)!;
    expect(group.name).toBe("Timestamp");
    expect(group.locked).toBe(true);
    const members = groupMembers(cfg, group.id);
    expect(members.map((m) => m.kind)).toEqual(["shape", "text"]);
    const capsule = members[0] as Shape;
    expect(capsule.payload).toMatchObject({ kind: "capsule", borderWidth: 0, colorSlot: { baseColorHex: IMAGE_TIMESTAMP_CAPSULE_HEX } });
    expect(capsule.payload.borderColorHex).toBeUndefined();
    expect(text.payload.value).toEqual({
      kind: { kind: "imageTime", layer: image.payload.id },
      format: { timestamp: "clock", showSeconds: true, hideDayPeriod: true },
    });
    expect(text.payload).toMatchObject({ fontWeight: "semibold", fontDesign: "rounded", colorSlot: { baseColorHex: "#FFFFFF" } });
    expect(text.payload.alignment).toBeUndefined();
    expect(capsule.payload.frame).toEqual(text.payload.frame);
    // Straight above the picture, capsule first.
    const order = cfg.elements.map((e) => e.payload.id);
    expect(order).toEqual([image.payload.id, capsule.payload.id, id]);
    expect(schemaVersionFor(cfg)).toBe(10);
  });

  it("starts a new picture with square corners", () => {
    expect((newElement("image") as Image).payload.cornerRadius).toBe(0);
  });
});

describe("opening a document in the editor", () => {
  /** A canonical one-shape document: every layer placed on rectangular. */
  function withOldLayer(): { cfg: CustomComplicationConfig; image: Image; old: ImageTime } {
    const { cfg, image } = camera();
    const old = newElement("imageTime") as ImageTime;
    old.payload.image = image.payload.id;
    old.payload.opacity = 0.8;
    old.payload.page = 2;
    old.payload.shadow = { colorHex: "#000000", radius: 3, dx: 0, dy: 1 };
    old.payload.rules = [{ id: "R1", cases: [], otherwise: [{ kind: "setOpacity", number: 0.5 }] }];
    cfg.elements.push(old);
    // The picture's group, as the old Extras button made it.
    const gid = "G1";
    cfg.groups = [{ id: gid, name: "Group 1", locked: false }];
    image.payload.groupId = gid;
    old.payload.groupId = gid;
    const frame = { x: 0.3, y: 0.7, width: 0.3, height: 0.2, rotationDegrees: 10 };
    for (const el of cfg.elements) {
      cfg.perFamily.rectangular!.placements[el.payload.id] = { frame: el === old ? frame : { ...el.payload.frame }, isHidden: false };
      el.payload.isHidden = true;
    }
    const tap = newElement("tap");
    if (tap.kind === "tap") tap.payload.attachedTo = old.payload.id;
    cfg.elements.push(tap);
    return { cfg, image, old };
  }

  it("turns an old imageTime layer into the group, keeping what it carried", () => {
    const { cfg, image, old } = withOldLayer();
    const id = convertImageTimeLayer(cfg, old.payload.id)!;
    expect(imageTimesOf(cfg, image.payload.id)).toHaveLength(0);
    const group = groupOf(cfg, id)!;
    expect(group.name).toBe("Timestamp");
    const [capsule, text] = groupMembers(cfg, group.id) as [Shape, Text];
    expect(text.payload.id).toBe(id);
    for (const l of [capsule, text]) {
      expect(l.payload.opacity).toBe(0.8);
      expect(l.payload.page).toBe(2);
      expect(l.payload.isHidden).toBe(true);
      expect(l.payload.rules).toEqual(old.payload.rules);
      expect(cfg.perFamily.rectangular!.placements[l.payload.id]).toEqual({
        frame: { x: 0.3, y: 0.7, width: 0.3, height: 0.2, rotationDegrees: 10 }, isHidden: false,
      });
    }
    expect(capsule.payload.shadow).toEqual(old.payload.shadow);
    expect(text.payload.shadow).toBeUndefined();
    expect(cfg.perFamily.rectangular!.placements[old.payload.id]).toBeUndefined();
    // The chip's size, read off the frame on its own shape.
    expect(text.payload.fontSize).toBeGreaterThan(9);
    // The tap follows the text; the picture's group had only the chip besides
    // the picture, so it goes.
    const tap = cfg.elements.find((e) => e.kind === "tap")!;
    expect(tap.kind === "tap" && tap.payload.attachedTo).toBe(id);
    expect(groupOf(cfg, image.payload.id)).toBeUndefined();
  });

  it("converts both kinds of old timestamp on open, and saves no imageTime layer", () => {
    const { cfg, image } = withOldLayer();
    const chip = newElement("image") as Image;
    chip.payload.entity = { entityId: "camera.yard", displayName: "Yard", domain: "camera" };
    chip.payload.timestamp = true;
    cfg.elements.push(chip);
    cfg.perFamily.rectangular!.placements[chip.payload.id] = { frame: { ...chip.payload.frame }, isHidden: false };
    chip.payload.isHidden = true;
    const draft = Draft.fromDocument(encodeConfig(cfg), 1);
    const doc = encodeConfig(draft.config) as unknown as { elements: { kind: string }[] };
    expect(doc.elements.some((e) => e.kind === "imageTime")).toBe(false);
    expect(imageTimeTextsOf(draft.config, image.payload.id)).toHaveLength(1);
    expect(imageTimeTextsOf(draft.config, chip.payload.id)).toHaveLength(1);
    expect(draft.config.groups!.filter((g) => g.name === "Timestamp")).toHaveLength(2);
    expect(schemaVersionFor(draft.config)).toBe(10);
    // Opening does not count as an edit, and running it again changes nothing.
    expect(draft.dirty).toBe(false);
    const again = structuredClone(draft.config);
    liftChartOwnMarks(again);
    expect(encodeConfig(again)).toEqual(encodeConfig(draft.config));
  });
});

describe("deleting and copying", () => {
  it("takes the group with the picture, and leaves a text the author grouped with other things alone", () => {
    const { cfg, image } = camera();
    const id = addImageTime(cfg, image.payload.id)!;
    const capsule = groupMembers(cfg, groupOf(cfg, id)!.id)[0]!;
    // A second text reading the same picture, in a group with an icon.
    const other = textReading(image.payload.id);
    const icon = newElement("icon");
    cfg.elements.push(other, icon);
    setGroup(cfg, other.payload.id, undefined);
    cfg.groups!.push({ id: "MINE", name: "Mine", locked: true });
    other.payload.groupId = "MINE";
    icon.payload.groupId = "MINE";
    expect(imageTimestampLayersOf(cfg, image.payload.id).map((e) => e.payload.id).sort())
      .toEqual([capsule.payload.id, id, other.payload.id].sort());
    removeElement(cfg, image.payload.id);
    expect(cfg.elements.map((e) => e.payload.id)).toEqual([icon.payload.id]);
  });

  it("deletes one timestamp by its text: the text and its capsule", () => {
    const { cfg, image } = camera();
    const id = addImageTime(cfg, image.payload.id)!;
    removeImageTimestamp(cfg, id);
    expect(cfg.elements.map((e) => e.payload.id)).toEqual([image.payload.id]);
    expect(cfg.groups).toBeUndefined();
  });

  it("points a copied text at the copied picture, and leaves one copied alone where it was", () => {
    const { cfg, image } = camera();
    const id = addImageTime(cfg, image.payload.id)!;
    const all = cfg.elements.map((e) => e.payload.id);
    const landed = pasteElements(cfg, copyElements(cfg, all));
    const newImage = landed.find((l) => byId(cfg, l)!.kind === "image")!;
    const newText = byId(cfg, landed.find((l) => byId(cfg, l)!.kind === "text")!) as Text;
    expect(newText.payload.value.kind).toEqual({ kind: "imageTime", layer: newImage });
    // The copies keep their own Timestamp group.
    const g = groupOf(cfg, newText.payload.id)!;
    expect(g.name).toBe("Timestamp");
    expect(g.id).not.toBe(groupOf(cfg, id)!.id);
    expect(groupMembers(cfg, g.id)).toHaveLength(2);

    const alone = pasteElements(cfg, copyElements(cfg, [id]));
    expect((byId(cfg, alone[0]!) as Text).payload.value.kind).toEqual({ kind: "imageTime", layer: image.payload.id });
  });
});
