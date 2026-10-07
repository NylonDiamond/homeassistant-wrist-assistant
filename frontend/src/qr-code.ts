// A QR code for the "Pair a device" card's QR mode, drawn as one SVG path.
//
// The encoder is `uqr` (MIT), pinned in package.json. It is imported only
// when a QR code is first asked for, so the build puts it in its own chunk
// and the panel's start never loads it.
//
// The matrix comes back with its quiet zone (four modules, the width the
// standard asks for) already around it. The view draws it dark on white
// whatever the panel's theme, which is what phone cameras read best.

/** The light border around the code, in modules. */
export const QR_QUIET_ZONE = 4;

/** A QR code ready to draw: `size` modules a side, quiet zone included, and
 * the dark modules as one path in those units. */
export interface QrPicture {
  size: number;
  path: string;
}

/** The dark modules as one path: each run of dark modules along a row is one
 * rectangle a module high, which keeps the path short. */
export function qrPath(rows: readonly (readonly boolean[])[]): string {
  const parts: string[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (!row[x]) {
        x++;
        continue;
      }
      const start = x;
      while (x < row.length && row[x]) x++;
      parts.push(`M${start} ${y}h${x - start}v1h${start - x}z`);
    }
  });
  return parts.join("");
}

/** Encode `text` at error correction M, which leaves room for a smudge or
 * glare and still fits a pairing link in a small code. */
export async function qrPicture(text: string): Promise<QrPicture> {
  const { encode } = await import("uqr");
  const qr = encode(text, { ecc: "M", border: QR_QUIET_ZONE });
  return { size: qr.size, path: qrPath(qr.data) };
}
