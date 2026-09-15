// Turning a picture the author uploads into the bytes a document can carry.
//
// The watch never fetches an inline picture, so whatever lands here is what a
// complication draws forever: it is resized to the box the layer actually
// occupies, not to the file's own size, and squeezed until it fits the per
// picture cap. Everything above the canvas work is pure, so the sizing and the
// cap are tested without a browser.

import { IMAGE_INLINE_MAX_BYTES, base64ByteLength, type ImageFormat } from "./model.js";

/** How many pixels one design point gets. Two covers every watch and every
 * Home Screen tile at its own scale without paying for a third. */
export const IMAGE_PIXELS_PER_POINT = 2;
/** The longest side any inline picture may reach, in pixels. Well inside
 * `ImageElementView.maximumPixelSize` (640) on the watch, which is the cap
 * WidgetKit's archive cares about. */
export const IMAGE_MAX_PIXEL_SIDE = 400;
/** The quality a JPEG fallback is written at. */
export const IMAGE_JPEG_QUALITY = 0.85;
/** How far the picture shrinks, step by step, when even a JPEG will not fit.
 * Each step is 80% of the one before, so five steps is a third of the side and
 * roughly a tenth of the pixels. */
export const IMAGE_SHRINK_STEPS = [1, 0.8, 0.64, 0.51, 0.41, 0.33];

/** The file types the picker offers. HEIC is listed because Safari decodes it;
 * a browser that cannot simply never returns a picture for it. */
export const IMAGE_UPLOAD_ACCEPT = "image/png,image/jpeg,image/webp,image/gif,image/heic,image/heif";

/** A picture ready for the wire. */
export interface InlinePicture {
  /** Base64, no `data:` prefix, exactly as the `data` key wants it. */
  data: string;
  format: ImageFormat;
  width: number;
  height: number;
  /** Decoded size in bytes, so the editor can print it without decoding. */
  bytes: number;
}

export type InlinePictureResult = InlinePicture | { error: string };

/**
 * The pixel box a layer of this size deserves: two pixels per design point,
 * with the longest side capped.
 *
 * A zero or nonsense box falls back to the cap, so a layer whose frame has not
 * been laid out yet still gets a usable picture rather than none.
 */
export function inlineTargetPixels(boxWidth: number, boxHeight: number): { width: number; height: number } {
  const w = Number.isFinite(boxWidth) && boxWidth > 0 ? boxWidth * IMAGE_PIXELS_PER_POINT : IMAGE_MAX_PIXEL_SIDE;
  const h = Number.isFinite(boxHeight) && boxHeight > 0 ? boxHeight * IMAGE_PIXELS_PER_POINT : IMAGE_MAX_PIXEL_SIDE;
  const scale = Math.min(1, IMAGE_MAX_PIXEL_SIDE / Math.max(w, h));
  return { width: Math.max(1, Math.round(w * scale)), height: Math.max(1, Math.round(h * scale)) };
}

/** The picture's own size scaled to sit inside a box, aspect kept. Never
 * enlarged: a 40 pixel icon dropped on a big layer stays 40 pixels rather than
 * becoming a blurry 400. */
export function fitWithin(
  width: number, height: number, maxWidth: number, maxHeight: number,
): { width: number; height: number } {
  if (!(width > 0) || !(height > 0)) return { width: 1, height: 1 };
  const scale = Math.min(1, maxWidth / width, maxHeight / height);
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

/** Whether these bytes fit the per-picture cap. */
export function inlineFits(data: string): boolean {
  return base64ByteLength(data) <= IMAGE_INLINE_MAX_BYTES;
}

/** The size next to the Upload button: whole KB, never "0 KB" for a picture
 * that is really there. */
export function formatKiB(bytes: number): string {
  if (bytes <= 0) return "0 KB";
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** The base64 half of a `data:` URL. */
function base64Of(dataUrl: string): string {
  const comma = dataUrl.indexOf(",");
  return comma < 0 ? "" : dataUrl.slice(comma + 1);
}

/** Decode a picked file into something a canvas can draw. Anything the browser
 * refuses (a format it cannot read, a damaged file) resolves to undefined. */
async function decodeFile(file: Blob): Promise<HTMLImageElement | undefined> {
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement | undefined>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(undefined);
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * A picked file as bytes for the `data` key, resized for this layer.
 *
 * PNG first, because a drawing or a logo is what most people upload and PNG
 * keeps its edges. Over the cap it is written again as JPEG, and past that the
 * picture shrinks in steps until it fits. A picture that will not fit even at
 * a third of the side is refused with a message rather than quietly landing at
 * a size nobody chose.
 */
export async function encodeInlinePicture(
  file: Blob, box: { width: number; height: number },
): Promise<InlinePictureResult> {
  const img = await decodeFile(file);
  if (!img || !(img.naturalWidth > 0) || !(img.naturalHeight > 0)) {
    return { error: "This browser could not read that picture. Try a PNG or a JPEG." };
  }
  const target = inlineTargetPixels(box.width, box.height);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return { error: "This browser has no canvas to resize the picture with." };

  for (const step of IMAGE_SHRINK_STEPS) {
    const size = fitWithin(
      img.naturalWidth, img.naturalHeight,
      Math.max(1, target.width * step), Math.max(1, target.height * step),
    );
    canvas.width = size.width;
    canvas.height = size.height;
    ctx.clearRect(0, 0, size.width, size.height);
    ctx.drawImage(img, 0, 0, size.width, size.height);
    // PNG only on the full-size pass: once the picture has been shrunk it is a
    // photograph too big for PNG anyway, and writing both formats every step
    // doubles the work for nothing.
    const attempts: ImageFormat[] = step === 1 ? ["png", "jpeg"] : ["jpeg"];
    for (const format of attempts) {
      const data = base64Of(canvas.toDataURL(
        format === "png" ? "image/png" : "image/jpeg",
        format === "png" ? undefined : IMAGE_JPEG_QUALITY,
      ));
      if (data !== "" && inlineFits(data)) {
        return { data, format, width: size.width, height: size.height, bytes: base64ByteLength(data) };
      }
    }
  }
  return {
    error: `That picture will not fit in ${IMAGE_INLINE_MAX_BYTES / 1024} KB, even shrunk. Crop it or save it smaller first.`,
  };
}
