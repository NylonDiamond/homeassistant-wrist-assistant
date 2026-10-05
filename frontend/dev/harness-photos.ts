// The harness's stand-in for the integration's page photo store (part 4d
// batch 6, `page_images_store.py`): the 15 built-in photos drawn here as
// small JPEGs (the phone's assets are not served), one library photo, and
// the list, get, upload and delete commands with the store's checks and
// refusal codes. A photo is in use while any watch's stored pages name it.

type Json = Record<string, unknown>;

export const PAGE_IMAGES = "wrist_assistant/page_images";

/** The built-in photos in the phone's order (`presetBackgroundImages`). */
const PRESETS: readonly [string, string, number][] = [
  ["preset_waves", "Waves", 205], ["preset_sand", "Sand", 38], ["preset_ocean", "Ocean", 200],
  ["preset_aurora", "Aurora", 150], ["preset_fern", "Fern", 110], ["preset_cloudy_sea", "Cloudy Sea", 210],
  ["preset_foggy_forest", "Fog", 140], ["preset_ferns_dark", "Ferns", 120], ["preset_mountain_lake", "Lake", 190],
  ["preset_neon_swirl", "Neon", 290], ["preset_snow_twilight", "Twilight", 240], ["preset_forest_canopy", "Canopy", 100],
  ["preset_sand_dunes", "Dunes", 30], ["preset_dark_rock", "Rock", 20], ["preset_neon_red_blue", "Glow", 320],
];

const MAX_BYTES = 256 * 1024;
const MAX_PHOTOS = 500;
const UUID = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;

interface Stored {
  data: string;
  width: number;
  height: number;
  bytes: number;
  added_at: string;
}

/** A picture drawn on a canvas, as a base64 JPEG. */
function drawJpeg(width: number, height: number, hue: number, label: string): string {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const c = canvas.getContext("2d")!;
  const g = c.createLinearGradient(0, 0, width, height);
  g.addColorStop(0, `hsl(${hue}, 60%, 42%)`);
  g.addColorStop(0.55, `hsl(${(hue + 35) % 360}, 50%, 22%)`);
  g.addColorStop(1, `hsl(${(hue + 70) % 360}, 45%, 9%)`);
  c.fillStyle = g;
  c.fillRect(0, 0, width, height);
  c.fillStyle = `hsla(${(hue + 180) % 360}, 70%, 70%, 0.35)`;
  for (let i = 0; i < 7; i++) {
    c.beginPath();
    c.arc(((i * 53) % width), ((i * 97) % height), 18 + i * 6, 0, Math.PI * 2);
    c.fill();
  }
  c.fillStyle = "rgba(255, 255, 255, 0.85)";
  c.font = `600 ${Math.round(height / 9)}px sans-serif`;
  c.textAlign = "center";
  c.fillText(label, width / 2, height * 0.55);
  return canvas.toDataURL("image/jpeg", 0.8).split(",")[1]!;
}

const presetData = new Map<string, string>();
const photos = new Map<string, Stored>();

function bytesOf(base64: string): Uint8Array {
  const text = atob(base64);
  const out = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) out[i] = text.charCodeAt(i);
  return out;
}

/** A JPEG's size from its frame header, as the store reads it. */
function jpegSize(bytes: Uint8Array): { width: number; height: number } | undefined {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) return undefined;
  let i = 2;
  while (i + 9 < bytes.length) {
    if (bytes[i] !== 0xff) return undefined;
    const marker = bytes[i + 1]!;
    const length = (bytes[i + 2]! << 8) | bytes[i + 3]!;
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: (bytes[i + 5]! << 8) | bytes[i + 6]!, width: (bytes[i + 7]! << 8) | bytes[i + 8]! };
    }
    i += 2 + length;
  }
  return undefined;
}

function hashOf(base64: string): string {
  let h = 0;
  for (let i = 0; i < base64.length; i++) h = (h * 31 + base64.charCodeAt(i)) | 0;
  return `${base64.length}:${h}`;
}

function newId(): string {
  const hex = () => Math.floor(Math.random() * 16).toString(16).toUpperCase();
  const run = (n: number) => Array.from({ length: n }, hex).join("");
  return `${run(8)}-${run(4)}-4${run(3)}-8${run(3)}-${run(12)}`;
}

/** The store as the harness starts: the built-in photos drawn, and one
 * library photo added a day ago. */
export function seedPagePhotos(): void {
  photos.clear();
  if (presetData.size === 0) for (const [id, name, hue] of PRESETS) presetData.set(id, drawJpeg(208, 248, hue, name));
  const data = drawJpeg(396, 484, 265, "Garden");
  const bytes = bytesOf(data);
  photos.set("6F1C2D3E-4A5B-4C6D-8E7F-0123456789AB", {
    data, width: 396, height: 484, bytes: bytes.length, added_at: new Date(Date.now() - 86_400_000).toISOString(),
  });
}

/** A library photo the seeded pages name. */
export const SEEDED_PHOTO_ID = "6F1C2D3E-4A5B-4C6D-8E7F-0123456789AB";

/** An id no photo has, for "Photo missing". */
export const MISSING_PHOTO_ID = "0BADF00D-0000-4000-8000-000000000000";

function fail(code: string, message: string): never {
  throw { code, message };
}

function find(id: string): [string, Stored] | undefined {
  for (const entry of photos) if (entry[0].toUpperCase() === id.toUpperCase()) return entry;
  return undefined;
}

/**
 * One page photo command's answer, or undefined for a type that is not one.
 * `usedBy(id)` lists the owners whose stored pages name a photo.
 */
export function answerPagePhotos(message: Json, usedBy: (id: string) => string[]): unknown {
  switch (message.type) {
    case `${PAGE_IMAGES}/list`:
      return {
        presets: PRESETS.map(([id, name]) => ({ id, name, width: 208, height: 248 })),
        images: [...photos].sort((a, b) => b[1].added_at.localeCompare(a[1].added_at)).map(([id, p]) => ({
          id, width: p.width, height: p.height, bytes: p.bytes, added_at: p.added_at, used_by: usedBy(id),
        })),
      };
    case `${PAGE_IMAGES}/get`: {
      const id = String(message.image_id);
      const preset = presetData.get(id);
      if (preset !== undefined) return { image_id: id, content_type: "image/jpeg", data: preset };
      if (!UUID.test(id)) fail("invalid", "Not a photo id.");
      const found = find(id);
      if (found === undefined) fail("not_found", "No such photo.");
      return { image_id: found[0], content_type: "image/jpeg", data: found[1].data };
    }
    case `${PAGE_IMAGES}/upload`: {
      const data = String(message.data);
      let bytes: Uint8Array;
      try {
        bytes = bytesOf(data);
      } catch {
        return fail("invalid", "Not base64.");
      }
      if (bytes.length > MAX_BYTES) fail("too_large", "The photo is over 256 KiB.");
      const size = jpegSize(bytes);
      if (size === undefined) fail("invalid", "Not a JPEG.");
      if (size.width < 16 || size.height < 16 || size.width > 1024 || size.height > 1024) fail("invalid", "The photo's size is out of range.");
      const hash = hashOf(data);
      for (const [id, p] of photos) if (hashOf(p.data) === hash) return { image_id: id, width: p.width, height: p.height, bytes: p.bytes };
      if (photos.size >= MAX_PHOTOS) fail("full", "The store is full.");
      const id = newId();
      photos.set(id, { data, ...size, bytes: bytes.length, added_at: new Date().toISOString() });
      return { image_id: id, ...size, bytes: bytes.length };
    }
    case `${PAGE_IMAGES}/delete`: {
      const id = String(message.image_id);
      if (presetData.has(id) || !UUID.test(id)) fail("invalid", "Not a photo of the library.");
      const found = find(id);
      if (found === undefined) fail("not_found", "No such photo.");
      if (usedBy(found[0]).length > 0) fail("in_use", "A page uses this photo.");
      photos.delete(found[0]);
      return {};
    }
    default:
      return undefined;
  }
}
