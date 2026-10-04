// The Apple Watch case drawn around a screen-sized box: a rounded case with a
// bezel, the Digital Crown and the side button on the right. Shared by the
// page editor and the menu editor so both previews look like the same watch.
//
// Every size is a fraction of the screen width times `scale`, so the case
// grows evenly with the screen it holds. The proportions follow the watch
// icon in `shapeArt.ts` (screen inset about an eighth of the screen width,
// crown a fifth of the way down the case) and the 46 mm watch's own corners.

import { css, html, type TemplateResult } from "lit";

/** Screen corner radius as a fraction of the screen width (the 46 mm watch's
 * screen is 208 pt wide with corners near 30 pt). */
export const WATCH_SCREEN_RADIUS_RATIO = 0.145;

/** Bezel (case edge around the screen) as a fraction of the screen width. */
export const WATCH_BEZEL_RATIO = 0.08;

/** Digital Crown width as a fraction of the screen width. */
export const WATCH_CROWN_RATIO = 0.055;

/** Sizes in pixels for a screen `width` points wide drawn at `scale`. */
export function watchFrameMetrics(width: number, scale: number): { radius: number; bezel: number; crown: number } {
  const px = width * scale;
  return {
    radius: Math.round(px * WATCH_SCREEN_RADIUS_RATIO),
    bezel: Math.round(px * WATCH_BEZEL_RATIO),
    crown: Math.round(px * WATCH_CROWN_RATIO),
  };
}

/** Wrap `screen` (a box already sized to the watch screen) in the watch case.
 * The child gets `--wf-radius` for its own corners. With the screen's
 * `height`, the crown and side button sit where they would on a case around
 * that screen even when the box runs taller (a page that scrolls on below
 * the screen); without it they sit by the case's own height. */
export function renderWatchFrame(
  screen: { width: number; height?: number },
  scale: number,
  body: TemplateResult,
  label?: string,
): TemplateResult {
  const m = watchFrameMetrics(screen.width, scale);
  const vars = [`--wf-radius:${m.radius}px`, `--wf-bezel:${m.bezel}px`, `--wf-crown:${m.crown}px`];
  if (screen.height !== undefined && screen.height > 0) {
    const caseHeight = screen.height * scale + m.bezel * 2;
    const at = (f: number) => `${Math.round(caseHeight * f * 100) / 100}px`;
    vars.push(`--wf-crown-top:${at(0.19)}`, `--wf-crown-h:${at(0.16)}`, `--wf-button-top:${at(0.42)}`, `--wf-button-h:${at(0.22)}`);
  }
  return html`<div class="wa-watch" aria-label=${label ?? "Watch"} style=${vars.join(";")}>${body}</div>`;
}

/** The case's own rules. Add to a component's `styles` next to the preview
 * styles. The case colour is the panel's `--wa-art-case` token. */
export const watchFrameStyles = css`
  .wa-watch {
    position: relative;
    display: inline-block;
    flex: none;
    box-sizing: content-box;
    padding: var(--wf-bezel, 16px);
    margin-right: var(--wf-crown, 10px);
    border-radius: calc(var(--wf-radius, 28px) + var(--wf-bezel, 16px));
    background:
      linear-gradient(155deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0) 45%, rgba(0, 0, 0, 0.25)),
      var(--wa-art-case, #2b2f3d);
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 0 0 calc(var(--wf-bezel, 16px) - 2px) rgba(0, 0, 0, 0.18),
      0 10px 28px rgba(0, 0, 0, 0.35);
  }
  .wa-watch::before,
  .wa-watch::after {
    content: "";
    position: absolute;
    left: 100%;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.25)),
      var(--wa-art-case, #2b2f3d);
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.08);
    pointer-events: none;
  }
  /* Digital Crown: a fifth of the way down, a sixth of the case tall. */
  .wa-watch::before {
    top: var(--wf-crown-top, 19%);
    width: var(--wf-crown, 10px);
    height: var(--wf-crown-h, 16%);
    border-radius: 0 calc(var(--wf-crown, 10px) * 0.45) calc(var(--wf-crown, 10px) * 0.45) 0;
  }
  /* Side button: below the crown, thinner and longer. */
  .wa-watch::after {
    top: var(--wf-button-top, 42%);
    width: calc(var(--wf-crown, 10px) * 0.55);
    height: var(--wf-button-h, 22%);
    border-radius: 0 calc(var(--wf-crown, 10px) * 0.3) calc(var(--wf-crown, 10px) * 0.3) 0;
  }
  .wa-watch > * {
    border-radius: var(--wf-radius, 28px);
    box-shadow: none;
  }
`;
