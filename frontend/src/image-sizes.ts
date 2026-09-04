// Natural sizes of the pictures the preview draws.
//
// A camera layer is cropped with the same arithmetic the watch uses, and that
// needs the picture's own pixel size. Only the browser knows it, and only once
// the URL has loaded, so this holds one entry per URL and asks the caller to
// re-render when one arrives. Same shape as the SF Symbol provider in icons.ts.

export interface ImageSize {
  width: number;
  height: number;
}

export interface ImageSizeProvider {
  /** The natural size of `url`, or undefined until it has loaded. The first
   * ask starts the load; a URL that never loads stays undefined and is not
   * retried, so a dead camera cannot spin. */
  size(url: string): ImageSize | undefined;
}

export function makeImageSizeProvider(onLoad: () => void): ImageSizeProvider {
  const sizes = new Map<string, ImageSize>();
  const asked = new Set<string>();
  return {
    size(url: string) {
      const known = sizes.get(url);
      if (known) return known;
      if (asked.has(url)) return undefined;
      asked.add(url);
      // Camera URLs carry a rotating token, so a URL is asked for once and the
      // next token is simply a new entry.
      const img = new Image();
      img.onload = () => {
        if (img.naturalWidth <= 0 || img.naturalHeight <= 0) return;
        sizes.set(url, { width: img.naturalWidth, height: img.naturalHeight });
        onLoad();
      };
      img.src = url;
      return undefined;
    },
  };
}
