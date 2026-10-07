// The "Pair a device" card's QR code: the path it draws, and the code with
// its quiet zone, as `uqr` encodes it.

import { describe, expect, it } from "vitest";

import { QR_QUIET_ZONE, qrPath, qrPicture } from "../src/qr-code.js";

describe("the QR code's path", () => {
  it("draws each run of dark modules along a row as one rectangle", () => {
    const rows = [
      [true, true, false, true],
      [false, false, false, false],
      [false, true, true, true],
    ];
    expect(qrPath(rows)).toBe("M0 0h2v1h-2zM3 0h1v1h-1zM1 2h3v1h-3z");
    expect(qrPath([[false, false]])).toBe("");
  });
});

describe("the QR code", () => {
  const LINK = "wristassistant://pair#v=1&i=0123456789abcdef&t=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA&u=http%3A%2F%2F192.168.1.4%3A8123&n=Home";

  it("comes with a quiet zone four modules wide on every side", async () => {
    const pic = await qrPicture(LINK);
    // Version 1 is 21 modules; a link this long needs more, plus the border.
    expect(pic.size).toBeGreaterThan(21 + 2 * QR_QUIET_ZONE);
    expect(QR_QUIET_ZONE).toBe(4);
    // No rectangle starts inside the quiet zone, nor reaches into it.
    const rects = [...pic.path.matchAll(/M(\d+) (\d+)h(\d+)/g)].map((m) => m.slice(1).map(Number));
    expect(rects.length).toBeGreaterThan(0);
    for (const [x, y, w] of rects) {
      expect(x).toBeGreaterThanOrEqual(QR_QUIET_ZONE);
      expect(y).toBeGreaterThanOrEqual(QR_QUIET_ZONE);
      expect(x! + w!).toBeLessThanOrEqual(pic.size - QR_QUIET_ZONE);
      expect(y).toBeLessThan(pic.size - QR_QUIET_ZONE);
    }
    // The top-left finder's first row: seven dark modules just inside the zone.
    expect(pic.path.startsWith(`M${QR_QUIET_ZONE} ${QR_QUIET_ZONE}h7v1h-7z`)).toBe(true);
  });

  it("gives the same picture for the same link", async () => {
    expect(await qrPicture(LINK)).toEqual(await qrPicture(LINK));
  });
});
