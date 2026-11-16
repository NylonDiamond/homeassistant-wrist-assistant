// Teach loops: a small watch that plays a screen's gesture on a loop, beside
// the steps it shows, each step lit while the watch does it. They stand on a
// screen while it has nothing in it yet (Pages, Status pages, Menus and the
// Complications start page), at the top of the Help sheet for those screens,
// and the bare watch plays in the tab's hover card on a device's row
// (`watch-row.ts`).
//
// The watch is drawn, never a video: tiles, rings and fingers are boxes moved
// by CSS keyframes, so it costs no file, matches the panel in both themes and
// holds still for anyone who asks for less motion (`prefers-reduced-motion`
// shows one telling frame). A Pause button stops it, as any motion longer
// than five seconds must offer.
//
// The words were checked against the watch app: a held tile shows a "+" in
// the middle, and sliding onto it opens the menu (`QuickActionState`'s
// `centerDeadzone`); turning the crown there swaps to the Anywhere menu. A
// status page opens as a sheet from the bottom (`StatusPageSheetView`).
// Each loop's step windows are the single source of when a step is lit: the
// CSS for them is made from `TEACH_LOOPS`, so the steps and the words cannot
// drift apart. The drawings' own keyframes follow the same windows by hand,
// and `teach-loop.test.ts` holds the windows in order.

import { css, html, nothing, type TemplateResult, unsafeCSS } from "lit";
import { generalCopy } from "./device-platform.js";
import { screenHowTo } from "./screen-howto.js";

export type TeachLoopId = "pages" | "menus" | "status-pages" | "complications";

export interface TeachGroup {
  /** The small heading over the steps, like "On your watch". */
  title: string;
  /** One step each. `**word**` is drawn bold. */
  steps: string[];
}

export interface TeachLoop {
  /** One loop's length in seconds. */
  seconds: number;
  /** The panel hue the card's outline takes. */
  hue: string;
  groups: TeachGroup[];
  /** Per step, in order across the groups: when it is lit, in percent of
   * the loop. */
  windows: readonly (readonly [number, number])[];
  /** What the screen's work is good for. */
  use: string;
  /** A small line under the steps. */
  tip?: string;
  /** A short table of kinds, name then words. */
  kinds?: readonly (readonly [string, string])[];
  /** Where the reduced motion frame stops, in percent of the loop. */
  still: number;
}

const crown = () => generalCopy("Digital Crown", "crown");

export const TEACH_LOOPS: Readonly<Record<TeachLoopId, TeachLoop>> = {
  "pages": {
    seconds: 8, hue: "var(--wa-hue-blue)", still: 70,
    groups: [{ title: "On your watch", steps: [
      "**Swipe** left or right to move between pages.",
      "**Tap** a tile to use it. The porch light turns on.",
    ] }],
    windows: [[0, 46], [48, 97]],
    get use() { return screenHowTo("pages")!.use; },
    tip: "Touch and hold a tile for its quick menu. The Menus tab sets what is in it.",
  },
  "menus": {
    seconds: 16, hue: "var(--wa-hue-purple)", still: 83,
    get groups() {
      return [
        { title: "A tile's menu", steps: [
          "**Touch and hold** a tile. A + shows in the middle.",
          "**Slide** to the middle, then to a slot, and **lift** your finger.",
        ] },
        { title: "The Anywhere menu", steps: [
          `**Hold** any tile, slide to the **middle**, then **turn the ${crown()}**.`,
          "**Slide** to a slot, then **lift** your finger.",
        ] },
      ];
    },
    windows: [[0, 12], [13, 46], [48, 73], [74, 97]],
    use: "Shortcuts and quick controls without leaving the page you are on.",
    tip: "On a page with room, you can also hold an empty spot for the Anywhere menu. Slide to the red X to cancel.",
    kinds: [
      ["By type", "One menu for each kind of tile. Every light gets the light menu."],
      ["One tile", "A menu for one tile only. It takes the place of its type's menu."],
      ["Anywhere", "The same shortcuts from every page."],
    ],
  },
  "status-pages": {
    seconds: 8, hue: "var(--wa-hue-orange)", still: 70,
    get groups() {
      return [{ title: "On your watch", steps: [
        generalCopy(
          "**Open** one from a status page tile, a menu slot, or by asking Siri.",
          "**Open** one from a status page tile, a menu slot, or, on an Apple device, by asking Siri.",
        ),
        `**Read** it. Turn the ${crown()} to see more.`,
      ] }];
    },
    windows: [[0, 46], [48, 97]],
    use: "Checking things fast: lights that are on, low batteries, open windows. A status page only shows things. To change one, use a tile.",
    tip: "To put one on a page, add a status page tile on the Pages tab.",
  },
  "complications": {
    seconds: 8, hue: "var(--wa-hue-green)", still: 70,
    groups: [{ title: "On your watch", steps: [
      "**Touch and hold** the watch face. Tap **Edit**.",
      "**Pick** a spot, then pick **Wrist Assistant**.",
      "**Tap** it to run its tap action, like opening a page.",
    ] }],
    windows: [[0, 33], [35, 66], [68, 97]],
    use: "Seeing things without opening the app, like the temperature or whether the door is locked.",
    tip: "You make the design here. You put it on a face on the watch.",
  },
};

/** Every word a loop shows, for the plain words test. */
export function teachWords(id: TeachLoopId): string[] {
  const loop = TEACH_LOOPS[id];
  return [
    ...loop.groups.flatMap((g) => [g.title, ...g.steps.map((s) => s.replaceAll("**", ""))]),
    loop.use, ...(loop.tip === undefined ? [] : [loop.tip]),
    ...(loop.kinds ?? []).flatMap(([a, b]) => [a, b]),
  ];
}

/** A step's words with its `**bold**` parts. */
function stepWords(text: string): TemplateResult[] {
  return text.split("**").map((part, i) => (i % 2 === 1 ? html`<b>${part}</b>` : html`${part}`));
}

// ── the drawings ─────────────────────────────────────────────────────────

const ICON = {
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  play: "M6 4l14 8-14 8z",
  temp: "M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z",
  camera: "M3 7h12v10H3zM15 10l6-3v10l-6-3",
  house: "M3 11l9-7 9 7v9H3z",
  fan: "M12 10c0-4 1-7 4-7 2 0 2 3 0 5M14 12c4 0 7 1 7 4 0 2-3 2-5 0M12 14c0 4-1 7-4 7-2 0-2-3 0-5M10 12c-4 0-7-1-7-4 0-2 3-2 5 0",
  list: "M9 6h11M9 12h11M9 18h8M4 6h.5M4 12h.5M4 18h.5",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  power: "M12 3v9M6.4 6.4a8 8 0 1 0 11.2 0",
  sun: "M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4",
  palette: "M12 3a9 9 0 1 0 0 18 3 3 0 0 0 0-6 3 3 0 0 1 0-6 3 3 0 0 0 0-6z",
  moon: "M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z",
  mic: "M9 6a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0zM5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3",
  pages: "M3 5h7.5v7.5H3zM13.5 5H21v7.5h-7.5zM5 17h14",
  alert: "M12 8v5M12 16h.01",
} as const;
type IconName = keyof typeof ICON;

const icon = (name: IconName, cls = "tl-ic") => html`<svg class=${cls} viewBox="0 0 24 24" aria-hidden="true"><path d=${ICON[name]}></path></svg>`;

const tile = (cls: string, name: IconName, label: string, state: TemplateResult | string) =>
  html`<div class="tl-t ${cls}">${icon(name)}<span>${label}<small>${state}</small></span></div>`;

/** A radial menu's slots around the middle, the first at the top. */
const slots = (names: readonly IconName[], hit?: { index: number; cls: string }) =>
  html`${names.map((name, i) => {
    const a = (-90 + i * (360 / names.length)) * (Math.PI / 180);
    const x = Math.round(Math.cos(a) * 58);
    const y = Math.round(Math.sin(a) * 58);
    return html`<div class="tl-slot ${hit?.index === i ? hit.cls : ""}" style=${`left:${x}px;top:${y}px`}>${icon(name, "")}</div>`;
  })}`;

function drawPages(): TemplateResult {
  return html`<div class="tl-clock">10:09</div>
    <div class="tl-strip">
      <div class="tl-pg"><div class="tl-grid">
        ${tile("c-yellow", "bulb", "Living room", "On")}${tile("c-orange", "lock", "Front Door", "Locked")}
        ${tile("c-purple", "play", "Movie", "Scene")}${tile("c-blue", "temp", "Hall", "21°")}
      </div></div>
      <div class="tl-pg"><div class="tl-grid">
        ${tile("c-ink", "camera", "Driveway", "Camera")}${tile("tl-porch", "bulb", "Porch", html`<i class="tl-word"></i>`)}
        ${tile("c-green", "house", "Garage", "Closed")}${tile("c-pink", "fan", "Fan", "Off")}
      </div></div>
    </div>
    <div class="tl-dots"><i class="tl-d1"></i><i class="tl-d2"></i></div>
    <div class="tl-finger"></div>`;
}

function drawMenus(): TemplateResult {
  return html`<div class="tl-clock">10:09</div>
    <div class="tl-grid">
      ${tile("tl-lr", "bulb", "Living room", html`<i class="tl-word"></i>`)}${tile("c-orange", "lock", "Front Door", "Locked")}
      ${tile("c-blue", "temp", "Hall", "21°")}${tile("c-green", "house", "Garage", "Closed")}
    </div>
    <div class="tl-dim"></div>
    <div class="tl-ring"></div>
    <div class="tl-radial tl-ra">
      <div class="tl-arms">${slots(["sun", "palette", "minus", "plus", "power"], { index: 4, cls: "tl-hit-a" })}</div>
      <div class="tl-mid">${icon("plus", "")}</div>
      <div class="tl-name tl-na">Turn off</div>
    </div>
    <div class="tl-radial tl-rb1">
      <div class="tl-arms">${slots(["lock", "lock", "alert", "minus", "minus"])}</div>
      <div class="tl-mid">${icon("plus", "")}</div>
    </div>
    <div class="tl-radial tl-rb2">
      ${slots(["play", "moon", "mic", "pages", "list"], { index: 0, cls: "tl-hit-b" })}
      <div class="tl-mid">${icon("plus", "")}</div>
      <div class="tl-name tl-nany">Anywhere menu</div>
      <div class="tl-name tl-nb">Movie scene</div>
    </div>
    <div class="tl-toast tl-ta"><i></i>Living room is off</div>
    <div class="tl-toast tl-tb"><i></i>Movie scene is on</div>
    <div class="tl-finger"></div>`;
}

function drawStatus(): TemplateResult {
  const row = (name: string, state: string) => html`<div class="tl-row"><i></i>${name}<span>${state}</span></div>`;
  return html`<div class="tl-clock">10:09</div>
    <div class="tl-grid">
      ${tile("c-orange tl-stile", "list", "Lights on", "3")}${tile("c-purple", "play", "Movie", "Scene")}
      ${tile("c-blue", "temp", "Hall", "21°")}${tile("c-green", "house", "Garage", "Closed")}
    </div>
    <div class="tl-sheet"><h5>Lights on</h5><div class="tl-rows">
      ${row("Kitchen", "On")}${row("Office", "80%")}${row("Porch", "On")}${row("Hall lamp", "40%")}${row("Garden", "On")}
    </div></div>
    <div class="tl-finger"></div>`;
}

function drawComplications(): TemplateResult {
  return html`<div class="tl-face">
      <div class="tl-fdate">SUN 15</div>
      <div class="tl-ftime">10:09</div>
      <div class="tl-cmp tl-ca tl-target"><span class="tl-old">+</span><span class="tl-new"><b>21°</b></span></div>
      <div class="tl-cmp tl-cc">72%</div>
      <div class="tl-cmp tl-cb">${icon("moon", "")}</div>
    </div>
    <div class="tl-editpill">Edit</div>
    <div class="tl-picker">
      <div class="tl-prow"><i></i>Activity</div>
      <div class="tl-prow tl-wa"><i></i>Wrist Assistant</div>
      <div class="tl-prow"><i></i>Weather</div>
    </div>
    <div class="tl-jump"><div class="tl-clock">10:09</div><div class="tl-grid">
      ${tile("c-blue", "temp", "Hall", "21°")}${tile("c-orange", "sun", "Heat", "Auto")}
    </div></div>
    <div class="tl-finger"></div>`;
}

const DRAW: Readonly<Record<TeachLoopId, () => TemplateResult>> = {
  "pages": drawPages,
  "menus": drawMenus,
  "status-pages": drawStatus,
  "complications": drawComplications,
};

function togglePause(e: Event): void {
  const button = e.currentTarget as HTMLButtonElement;
  const root = button.closest(".tl");
  if (root === null) return;
  const paused = root.classList.toggle("tl-paused");
  button.setAttribute("aria-pressed", String(paused));
  button.setAttribute("aria-label", paused ? "Play the picture" : "Pause the picture");
  button.title = paused ? "Play" : "Pause";
}

/** The watch alone, playing. `mini` draws it small for a hover card. */
export function renderTeachWatch(id: TeachLoopId, mini = false): TemplateResult {
  const loop = TEACH_LOOPS[id];
  const watch = html`<div class="tl-watch" aria-hidden="true"><div class="tl-scr">${DRAW[id]()}</div>
    ${id === "menus" || id === "status-pages" ? html`<div class="tl-crown">↻</div>` : nothing}</div>`;
  if (mini) return html`<div class="tl tl-mini tl-${id}" style=${`--tl-t:${loop.seconds}s;--tl-still:${-(loop.seconds * loop.still) / 100}s`}><div class="tl-mini-box">${watch}</div></div>`;
  return watch;
}

/**
 * The teach card: the watch playing, its steps lit in time, what the work is
 * good for, then `actions` (the screen's own New button) and `note` (the
 * screen's own line, like who may make one). The card's words are
 * `TEACH_LOOPS`'s.
 */
export function renderTeachCard(id: TeachLoopId, opts: { actions?: TemplateResult | typeof nothing; note?: TemplateResult | typeof nothing } = {}): TemplateResult {
  const loop = TEACH_LOOPS[id];
  let n = 0;
  const groups = loop.groups.map((g) => {
    const start = n;
    n += g.steps.length;
    return html`<div class="tl-k">${g.title}</div>
      <ol class="tl-steps" style=${`counter-reset: tl-s ${start}`}>
        ${g.steps.map((s, i) => html`<li class="tl-step tl-s${start + i + 1}"><span>${stepWords(s)}</span></li>`)}
      </ol>`;
  });
  return html`<section class="tl tl-card tl-${id}" aria-label="How it works on your watch"
      style=${`--tl-hue:${loop.hue};--tl-t:${loop.seconds}s;--tl-still:${-(loop.seconds * loop.still) / 100}s`}>
    <div class="tl-stage">
      ${renderTeachWatch(id)}
      <button type="button" class="tl-pause" title="Pause" aria-label="Pause the picture" aria-pressed="false" @click=${togglePause}>
        <svg viewBox="0 0 24 24" aria-hidden="true" class="tl-pz"><path d="M8 5v14M16 5v14"></path></svg>
        <svg viewBox="0 0 24 24" aria-hidden="true" class="tl-pl"><path d="M7 4l13 8-13 8z"></path></svg>
      </button>
    </div>
    <div class="tl-text">
      ${groups}
      ${loop.tip === undefined ? nothing : html`<p class="tl-tip">${loop.tip}</p>`}
      ${loop.kinds === undefined ? nothing : html`<div class="tl-k">Three kinds of menu</div>
        <div class="tl-kinds">${loop.kinds.map(([name, text]) => html`<div class="tl-kind"><b>${name}</b><span>${text}</span></div>`)}</div>`}
      <p class="tl-use"><span class="tl-k">Good for</span>${loop.use}</p>
      ${opts.note ?? nothing}
      ${opts.actions === undefined || opts.actions === nothing ? nothing : html`<div class="tl-acts">${opts.actions}</div>`}
    </div>
  </section>`;
}

// ── styles ───────────────────────────────────────────────────────────────

const LIT = "background: var(--wa-panel, var(--wa-raise)); color: var(--wa-ink); border-color: var(--wa-line-strong);";
const DARK = "background: transparent; color: var(--wa-muted); border-color: transparent;";

/** One keyframes per step: lit inside its window, dark outside. */
function stepCss(): string {
  return (Object.keys(TEACH_LOOPS) as TeachLoopId[]).map((id) => {
    const loop = TEACH_LOOPS[id];
    return loop.windows.map(([from, to], i) => {
      const name = `tl-${id}-s${i + 1}`;
      const before = from <= 0 ? "" : `0%, ${from - 1}% { ${DARK} } `;
      const after = to >= 100 ? "" : ` ${to + 1}%, 100% { ${DARK} }`;
      return `@keyframes ${name} { ${before}${Math.max(0, from)}%, ${to}% { ${LIT} }${after} }
.tl-${id} .tl-s${i + 1} { animation: ${name} var(--tl-t) infinite; }`;
    }).join("\n");
  }).join("\n");
}

export const teachStyles = css`
  .tl-card {
    position: relative; display: flex; flex-wrap: wrap; justify-content: center; gap: 20px 24px; align-items: center;
    box-sizing: border-box; width: min(760px, 100%); margin: 0 auto; padding: 20px; border-radius: 16px; text-align: left;
    border: 1px solid color-mix(in srgb, var(--tl-hue) 50%, var(--wa-line-strong)); background: var(--wa-card); color: var(--wa-ink);
  }
  /* Side by side when there is room; the watch above, centred, when not. */
  .tl-stage { position: relative; flex: 0 0 228px; display: grid; place-items: center; }
  .tl-pause {
    position: absolute; left: 0; bottom: 0; width: 28px; height: 28px; padding: 0; border-radius: 50%; display: grid; place-items: center;
    border: 1px solid var(--wa-line-strong); background: var(--wa-card); color: var(--wa-muted); cursor: pointer;
  }
  .tl-pause:hover { color: var(--wa-ink); }
  .tl-pause:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .tl-pause svg { width: 13px; height: 13px; stroke: currentColor; fill: none; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
  .tl-pause .tl-pl { display: none; }
  .tl-paused .tl-pause .tl-pz { display: none; }
  .tl-paused .tl-pause .tl-pl { display: block; }
  .tl-text { flex: 1 1 280px; min-width: 0; font-size: 13px; line-height: 1.45; }
  .tl-k { display: block; font-size: 10.5px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--wa-muted); margin: 0 0 6px; }
  .tl-steps { list-style: none; margin: 0 0 12px; padding: 0; display: grid; gap: 4px; }
  .tl-step { counter-increment: tl-s; display: flex; gap: 10px; align-items: flex-start; padding: 7px 10px; border-radius: 10px; border: 1px solid transparent; color: var(--wa-muted); }
  .tl-step::before {
    content: counter(tl-s); flex: none; width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center;
    font-size: 11px; font-weight: 600; background: var(--wa-raise); color: var(--wa-ink);
  }
  .tl-step b { font-weight: 600; }
  .tl-tip { margin: -4px 0 12px 10px; font-size: 12px; color: var(--wa-muted); }
  .tl-kinds { border: 1px solid var(--wa-line); border-radius: 10px; margin: 0 0 12px; }
  .tl-kind { display: grid; grid-template-columns: 76px 1fr; gap: 8px; padding: 6px 10px; font-size: 12px; color: var(--wa-label); }
  .tl-kind + .tl-kind { border-top: 1px solid var(--wa-line); }
  .tl-kind b { color: var(--wa-ink); font-weight: 600; }
  .tl-use { margin: 0 0 14px; font-size: 12.5px; color: var(--wa-label); }
  .tl-use .tl-k { display: inline; margin-right: 6px; }
  .tl-acts { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 12px; }

  /* the watch: dark in both themes, as the watch is */
  .tl-watch {
    position: relative; flex: none; width: 204px; height: 248px; box-sizing: border-box; padding: 11px; border-radius: 58px;
    background: linear-gradient(160deg, #3a3a3e, #1b1b1d); box-shadow: 0 14px 32px rgba(0, 0, 0, .35), inset 0 0 0 1px #4a4a4f;
  }
  .tl-watch::after { content: ""; position: absolute; right: -6px; top: 70px; width: 7px; height: 34px; border-radius: 3px; background: linear-gradient(90deg, #4b4b50, #2a2a2d); }
  .tl-scr { position: relative; width: 182px; height: 226px; border-radius: 47px; background: #000; overflow: hidden; font-family: "WA Inter", Inter, -apple-system, sans-serif; color: #fff; }
  .tl-clock { position: absolute; top: 9px; right: 30px; font-size: 11px; font-weight: 600; z-index: 3; }
  .tl-grid { position: absolute; top: 26px; left: 8px; width: 166px; display: grid; grid-template-columns: 80px 80px; gap: 6px; }
  .tl-t {
    height: 88px; box-sizing: border-box; border-radius: 18px; padding: 9px; display: flex; flex-direction: column; justify-content: space-between;
    font-size: 10.5px; font-weight: 600; line-height: 1.2; color: #fff; overflow: hidden;
  }
  .tl-t small { display: block; font-size: 9px; font-weight: 600; opacity: .85; }
  .tl-t i { font-style: normal; }
  .tl-ic { width: 22px; height: 22px; }
  .tl-scr svg { stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .c-yellow { background: #e8c547; color: #2b2100; } .c-orange { background: #f0a23b; } .c-purple { background: #a78bfa; }
  .c-blue { background: #5e9beb; } .c-green { background: #4cc38a; } .c-pink { background: #ec7a93; } .c-ink { background: #1c1c1e; }
  .tl-dots { position: absolute; bottom: 10px; left: 0; right: 0; display: flex; justify-content: center; gap: 4px; z-index: 3; }
  .tl-dots i { width: 5px; height: 5px; border-radius: 50%; background: #555; }
  .tl-finger {
    position: absolute; width: 30px; height: 30px; margin: -15px 0 0 -15px; border-radius: 50%; z-index: 10; opacity: 0; pointer-events: none;
    background: rgba(255, 255, 255, .55); box-shadow: 0 0 0 2px rgba(255, 255, 255, .25);
  }
  .tl-crown { position: absolute; right: -24px; top: 62px; color: var(--wa-muted); font-size: 16px; opacity: 0; }
  .tl-watch * { animation-duration: var(--tl-t); animation-iteration-count: infinite; animation-timing-function: ease; }

  /* Pages: swipe, then tap the porch light on */
  .tl-strip { position: absolute; inset: 0; width: 364px; animation-name: tl-strip; }
  .tl-pg { position: absolute; top: 0; width: 182px; height: 226px; }
  .tl-pg + .tl-pg { left: 182px; }
  @keyframes tl-strip { 0%, 12% { transform: translateX(0); } 34%, 96% { transform: translateX(-182px); } 100% { transform: translateX(0); } }
  .tl-d1 { animation-name: tl-d1; } .tl-d2 { animation-name: tl-d2; }
  @keyframes tl-d1 { 0%, 25% { background: #fff; } 27%, 97% { background: #555; } 100% { background: #fff; } }
  @keyframes tl-d2 { 0%, 25% { background: #555; } 27%, 97% { background: #fff; } 100% { background: #555; } }
  .tl-pages .tl-finger { animation-name: tl-f-pages; }
  @keyframes tl-f-pages {
    0%, 8% { opacity: 0; left: 150px; top: 150px; transform: scale(1.2); }
    12% { opacity: 1; left: 150px; top: 150px; transform: scale(1); }
    34% { opacity: 1; left: 40px; top: 150px; }
    38% { opacity: 0; left: 30px; top: 150px; }
    52% { opacity: 0; left: 130px; top: 70px; transform: scale(1.3); }
    56% { opacity: 1; left: 130px; top: 70px; transform: scale(1); }
    60% { transform: scale(.75); }
    64% { opacity: 1; transform: scale(1); }
    72%, 100% { opacity: 0; left: 130px; top: 70px; }
  }
  .tl-porch { animation-name: tl-porch; }
  @keyframes tl-porch { 0%, 60% { background: #2c2c2e; color: #aaa; } 62%, 96% { background: #e8c547; color: #2b2100; } 100% { background: #2c2c2e; color: #aaa; } }
  .tl-porch .tl-word::before { content: "Off"; animation: tl-porch-word var(--tl-t) infinite; }
  @keyframes tl-porch-word { 0%, 60% { content: "Off"; } 62%, 96% { content: "On"; } 100% { content: "Off"; } }

  /* Menus: a tile's menu, then the Anywhere menu by the crown */
  .tl-dim { position: absolute; inset: 0; background: rgba(0, 0, 0, .74); opacity: 0; z-index: 4; animation-name: tl-dim; }
  @keyframes tl-dim { 0%, 11% { opacity: 0; } 13%, 34% { opacity: 1; } 37%, 56% { opacity: 0; } 58%, 87% { opacity: 1; } 90%, 100% { opacity: 0; } }
  .tl-ring { position: absolute; width: 60px; height: 60px; margin: -30px 0 0 -30px; border-radius: 50%; border: 2.5px solid #fff; box-sizing: border-box; z-index: 6; opacity: 0; animation-name: tl-ring; }
  @keyframes tl-ring {
    0%, 1% { left: 47px; top: 70px; opacity: 0; transform: scale(.3); }
    3% { left: 47px; top: 70px; opacity: .9; transform: scale(.3); }
    11% { left: 47px; top: 70px; opacity: .9; transform: scale(1); }
    13% { left: 47px; top: 70px; opacity: 0; transform: scale(1.2); }
    47% { left: 135px; top: 70px; opacity: 0; transform: scale(.3); }
    50% { left: 135px; top: 70px; opacity: .9; transform: scale(.3); }
    56% { left: 135px; top: 70px; opacity: .9; transform: scale(1); }
    58%, 100% { left: 135px; top: 70px; opacity: 0; transform: scale(1.2); }
  }
  .tl-radial { position: absolute; left: 91px; top: 113px; width: 0; height: 0; z-index: 7; opacity: 0; }
  .tl-arms { position: absolute; left: 0; top: 0; }
  .tl-slot { position: absolute; width: 36px; height: 36px; margin: -18px 0 0 -18px; border-radius: 50%; background: #2c2c2e; display: grid; place-items: center; }
  .tl-slot svg { width: 17px; height: 17px; }
  .tl-mid { position: absolute; width: 30px; height: 30px; margin: -15px 0 0 -15px; border-radius: 50%; background: #fff; color: #000; display: grid; place-items: center; }
  .tl-mid svg { width: 16px; height: 16px; stroke-width: 2.6; }
  .tl-name { position: absolute; left: -60px; top: 74px; width: 120px; text-align: center; font-size: 10px; font-weight: 600; opacity: 0; }
  .tl-ra { animation-name: tl-ra; }
  @keyframes tl-ra { 0%, 11% { opacity: 0; } 13%, 34% { opacity: 1; } 37%, 100% { opacity: 0; } }
  .tl-ra .tl-arms { animation-name: tl-arms-a; }
  @keyframes tl-arms-a { 0%, 17% { opacity: 0; transform: scale(.2); } 20%, 100% { opacity: 1; transform: none; } }
  .tl-rb1 { animation-name: tl-rb1; }
  @keyframes tl-rb1 { 0%, 56% { opacity: 0; } 58%, 66% { opacity: 1; transform: none; } 70%, 100% { opacity: 0; transform: rotate(40deg) scale(.9); } }
  .tl-rb1 .tl-arms { animation-name: tl-arms-b; }
  @keyframes tl-arms-b { 0%, 61% { opacity: 0; transform: scale(.2); } 63%, 100% { opacity: 1; transform: none; } }
  .tl-rb2 { animation-name: tl-rb2; }
  @keyframes tl-rb2 { 0%, 66% { opacity: 0; transform: rotate(-40deg) scale(.9); } 70%, 87% { opacity: 1; transform: none; } 90%, 100% { opacity: 0; } }
  .tl-hit-a { animation-name: tl-hit-a; }
  @keyframes tl-hit-a { 0%, 24% { background: #2c2c2e; transform: scale(1); } 27%, 34% { background: #48484a; transform: scale(1.25); } 37%, 100% { background: #2c2c2e; transform: scale(1); } }
  .tl-hit-b { animation-name: tl-hit-b; }
  @keyframes tl-hit-b { 0%, 79% { background: #2c2c2e; transform: scale(1); } 81%, 87% { background: #a78bfa; transform: scale(1.25); } 90%, 100% { background: #2c2c2e; transform: scale(1); } }
  .tl-na { animation-name: tl-na; }
  @keyframes tl-na { 0%, 26% { opacity: 0; } 28%, 34% { opacity: 1; } 36%, 100% { opacity: 0; } }
  .tl-nany { animation-name: tl-nany; }
  @keyframes tl-nany { 0%, 69% { opacity: 0; } 71%, 77% { opacity: 1; } 79%, 100% { opacity: 0; } }
  .tl-nb { animation-name: tl-nb; }
  @keyframes tl-nb { 0%, 80% { opacity: 0; } 82%, 87% { opacity: 1; } 89%, 100% { opacity: 0; } }
  .tl-menus .tl-finger { animation-name: tl-f-menus; }
  @keyframes tl-f-menus {
    0% { opacity: 0; left: 47px; top: 70px; transform: scale(1.3); }
    2%, 12% { opacity: 1; left: 47px; top: 70px; transform: scale(1); }
    18% { left: 91px; top: 113px; }
    20% { left: 91px; top: 113px; }
    26%, 33% { opacity: 1; left: 36px; top: 95px; transform: scale(1); }
    36% { opacity: 0; left: 36px; top: 95px; transform: scale(1.3); }
    47% { opacity: 0; left: 135px; top: 70px; transform: scale(1.3); }
    49%, 57% { opacity: 1; left: 135px; top: 70px; transform: scale(1); }
    62%, 72% { opacity: 1; left: 91px; top: 113px; }
    80%, 87% { opacity: 1; left: 91px; top: 55px; transform: scale(1); }
    90%, 100% { opacity: 0; left: 91px; top: 55px; transform: scale(1.3); }
  }
  .tl-lr { animation-name: tl-lr; }
  @keyframes tl-lr { 0%, 34% { background: #e8c547; color: #2b2100; } 36%, 98% { background: #2c2c2e; color: #aaa; } 100% { background: #e8c547; color: #2b2100; } }
  .tl-lr .tl-word::before { content: "On"; animation: tl-lr-word var(--tl-t) infinite; }
  @keyframes tl-lr-word { 0%, 34% { content: "On"; } 36%, 98% { content: "Off"; } 100% { content: "On"; } }
  .tl-toast {
    position: absolute; left: 14px; right: 14px; bottom: 26px; z-index: 8; display: flex; align-items: center; gap: 7px;
    padding: 8px 10px; border-radius: 14px; background: #2c2c2e; font-size: 10.5px; font-weight: 600; opacity: 0;
  }
  .tl-toast i { width: 16px; height: 16px; border-radius: 50%; flex: none; }
  .tl-ta { animation-name: tl-ta; } .tl-ta i { background: #8e8e93; }
  @keyframes tl-ta { 0%, 36% { opacity: 0; transform: translateY(8px); } 38%, 45% { opacity: 1; transform: none; } 47%, 100% { opacity: 0; } }
  .tl-tb { animation-name: tl-tb; } .tl-tb i { background: #a78bfa; }
  @keyframes tl-tb { 0%, 88% { opacity: 0; transform: translateY(8px); } 90%, 97% { opacity: 1; transform: none; } 99%, 100% { opacity: 0; } }
  .tl-menus .tl-crown { animation-name: tl-crown-m; }
  @keyframes tl-crown-m { 0%, 62% { opacity: 0; transform: rotate(0); } 64% { opacity: 1; } 71% { opacity: 1; transform: rotate(200deg); } 74%, 100% { opacity: 0; transform: rotate(200deg); } }

  /* Status pages: tap the tile, the page slides up, the crown scrolls */
  .tl-stile { animation-name: tl-stile; }
  @keyframes tl-stile { 0%, 14% { transform: scale(1); } 17% { transform: scale(.92); } 21%, 100% { transform: scale(1); } }
  .tl-status-pages .tl-finger { animation-name: tl-f-status; }
  @keyframes tl-f-status { 0%, 6% { opacity: 0; left: 47px; top: 70px; transform: scale(1.3); } 10% { opacity: 1; transform: scale(1); } 16% { transform: scale(.75); } 20% { opacity: 1; transform: scale(1); } 25%, 100% { opacity: 0; left: 47px; top: 70px; } }
  .tl-sheet { position: absolute; inset: 0; z-index: 5; padding: 30px 14px 0; background: #000; transform: translateY(100%); animation-name: tl-sheet; }
  @keyframes tl-sheet { 0%, 22% { transform: translateY(100%); } 32%, 95% { transform: none; } 100% { transform: translateY(100%); } }
  .tl-sheet h5 { margin: 0 0 8px; font-size: 13px; font-weight: 700; }
  .tl-rows { animation-name: tl-rows; }
  @keyframes tl-rows { 0%, 58% { transform: none; } 78%, 100% { transform: translateY(-46px); } }
  .tl-row { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; padding: 8px 10px; border-radius: 12px; background: #1c1c1e; font-size: 10.5px; font-weight: 600; }
  .tl-row i { width: 8px; height: 8px; border-radius: 50%; background: #e8c547; flex: none; }
  .tl-row span { margin-left: auto; color: #aaa; font-weight: 500; }
  .tl-status-pages .tl-crown { animation-name: tl-crown-s; }
  @keyframes tl-crown-s { 0%, 56% { opacity: 0; transform: translateY(6px); } 62%, 78% { opacity: 1; transform: translateY(-4px); } 84%, 100% { opacity: 0; } }

  /* Complications: hold the face, Edit, pick Wrist Assistant, tap it */
  .tl-face { position: absolute; inset: 0; z-index: 1; background: radial-gradient(circle at 50% 40%, #121212, #000); animation-name: tl-face; }
  @keyframes tl-face { 0%, 16% { transform: scale(1); border-radius: 47px; } 22%, 64% { transform: scale(.8); border-radius: 30px; box-shadow: 0 0 0 2px #333; } 70%, 100% { transform: scale(1); } }
  .tl-ftime { position: absolute; top: 74px; left: 0; right: 0; text-align: center; font-size: 46px; font-weight: 600; letter-spacing: -.02em; }
  .tl-fdate { position: absolute; top: 56px; left: 0; right: 0; text-align: center; font-size: 10px; font-weight: 600; color: #f0a23b; }
  .tl-cmp { position: absolute; width: 40px; height: 40px; border-radius: 50%; background: #1c1c1e; display: grid; place-items: center; font-size: 10px; font-weight: 700; color: #ddd; }
  .tl-cmp svg { width: 14px; height: 14px; }
  .tl-ca { left: 26px; top: 150px; } .tl-cb { right: 26px; top: 150px; } .tl-cc { left: 71px; top: 166px; }
  .tl-target { animation-name: tl-target; }
  @keyframes tl-target { 0%, 34% { box-shadow: none; } 38%, 62% { box-shadow: 0 0 0 2.5px #4cc38a; } 66%, 100% { box-shadow: none; } }
  .tl-old, .tl-new { position: absolute; inset: 0; display: grid; place-items: center; border-radius: 50%; }
  .tl-new { background: conic-gradient(#5e9beb 0 62%, #2a2a2d 62% 100%); opacity: 0; animation-name: tl-newc; }
  .tl-new b { width: 32px; height: 32px; border-radius: 50%; background: #111; display: grid; place-items: center; font-size: 10px; }
  @keyframes tl-newc { 0%, 60% { opacity: 0; } 64%, 96% { opacity: 1; } 100% { opacity: 0; } }
  .tl-editpill { position: absolute; left: 50%; bottom: 8px; z-index: 4; margin-left: -28px; width: 56px; text-align: center; padding: 5px 0; border-radius: 99px; background: #2c2c2e; font-size: 10.5px; font-weight: 700; opacity: 0; animation-name: tl-editp; }
  @keyframes tl-editp { 0%, 20% { opacity: 0; } 23%, 32% { opacity: 1; } 34%, 100% { opacity: 0; } }
  .tl-picker { position: absolute; left: 0; right: 0; bottom: 0; height: 132px; z-index: 6; box-sizing: border-box; padding: 12px 14px; border-radius: 22px 22px 0 0; background: #1c1c1e; transform: translateY(100%); animation-name: tl-picker; }
  @keyframes tl-picker { 0%, 40% { transform: translateY(100%); } 46%, 60% { transform: none; } 66%, 100% { transform: translateY(100%); } }
  .tl-prow { display: flex; align-items: center; gap: 7px; padding: 6px 8px; border-radius: 9px; font-size: 10.5px; font-weight: 600; color: #ccc; }
  .tl-prow i { width: 14px; height: 14px; border-radius: 4px; background: #444; flex: none; }
  .tl-wa { color: #fff; animation-name: tl-prow; }
  .tl-wa i { background: #5e9beb; }
  @keyframes tl-prow { 0%, 52% { background: transparent; } 55%, 62% { background: #3a3a3d; } 66%, 100% { background: transparent; } }
  .tl-complications .tl-finger { animation-name: tl-f-comp; }
  @keyframes tl-f-comp {
    0%, 2% { opacity: 0; left: 91px; top: 110px; transform: scale(1.3); }
    5%, 18% { opacity: 1; left: 91px; top: 110px; transform: scale(1); }
    22% { opacity: 0; left: 91px; top: 110px; }
    25% { opacity: 0; left: 91px; top: 214px; }
    27% { opacity: 1; left: 91px; top: 214px; transform: scale(1); } 30% { transform: scale(.75); } 32% { opacity: 1; transform: scale(1); }
    34% { opacity: 0; left: 91px; top: 214px; }
    50% { opacity: 0; left: 70px; top: 128px; transform: scale(1.3); }
    53% { opacity: 1; left: 70px; top: 128px; transform: scale(1); } 56% { transform: scale(.75); } 58% { opacity: 1; transform: scale(1); }
    61%, 74% { opacity: 0; left: 70px; top: 128px; }
    78% { opacity: 1; left: 46px; top: 170px; transform: scale(1); } 81% { transform: scale(.75); } 83% { opacity: 1; transform: scale(1); }
    87%, 100% { opacity: 0; left: 46px; top: 170px; }
  }
  .tl-jump { position: absolute; inset: 0; z-index: 7; background: #000; opacity: 0; animation-name: tl-jump; }
  @keyframes tl-jump { 0%, 83% { opacity: 0; transform: scale(.4); } 88%, 96% { opacity: 1; transform: none; } 100% { opacity: 0; } }

  /* the steps, lit in time (made from TEACH_LOOPS) */
  ${unsafeCSS(stepCss())}

  /* paused, and held still for less motion */
  .tl-paused *, .tl-paused *::before { animation-play-state: paused !important; }
  @media (prefers-reduced-motion: reduce) {
    .tl .tl-watch *, .tl .tl-watch *::before { animation-play-state: paused !important; animation-delay: var(--tl-still) !important; }
    .tl .tl-step { animation: none !important; color: var(--wa-ink); }
    .tl-pause { display: none; }
  }

  /* the bare watch in a hover card, small */
  .tl-mini { display: flex; justify-content: center; margin: 4px 0 10px; }
  .tl-mini-box { width: 122px; height: 149px; }
  .tl-mini .tl-watch { transform: scale(.6); transform-origin: top left; box-shadow: none; }
  .tl-mini .tl-crown { display: none; }

`;
