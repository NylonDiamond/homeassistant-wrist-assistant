// A tiny picture of what each preset builds, for the Add a layer card.
//
// The presets used to be a row of pill-shaped words under the kind buttons,
// and a word is a poor description of a finished thing: "Door history" and
// "Recent activity" read alike and draw nothing alike. Each preset now carries
// a sample of its own output, the same 120x46 black well the kind buttons use,
// so the choice is made by eye and the row of words is gone.
//
// Nothing here is live. These are hand drawn samples, not the renderer, and
// they are deliberately cheap because two dozen of them draw on every panel
// update. Color comes from `--k`, which the button sets from `presetColor`,
// so a sample always agrees with the card around it.

import { type TemplateResult, html, svg } from "lit";
import { KIND_COLOR, type LayerKind } from "./kinds.js";
import type { PresetKind } from "./presets.js";

/** The muted ink for the parts of a sample that are not the subject: a gauge's
 * unfilled track, a caption under a number, a row that is switched off. */
const DIM = "color-mix(in srgb, var(--k) 45%, #6b7280)";

const FONT = `system-ui, -apple-system, "Segoe UI", sans-serif`;

/** Green, amber and red, for the samples whose whole point is the color: an
 * armed alarm, a person at home, a battery running out. Fixed hexes rather
 * than `--k`, because these are the colors the preset itself writes. */
const GREEN = "#34C759";
const AMBER = "#FFD60A";
const RED = "#FF453A";

/**
 * Which layer kind's color a preset wears.
 *
 * A preset is a finished thing rather than a kind, but it is mostly made of
 * one kind, and borrowing that kind's color is what keeps the card and the
 * Layers row underneath it looking like the same object. A preset built from
 * several layers takes the color of its subject: a battery ring is a gauge
 * with a number in it, not a text with a ring round it.
 */
const PRESET_KIND: Record<PresetKind, LayerKind> = {
  toggle: "icon",
  status: "text",
  gauge: "gauge",
  chart: "chart",
  history: "chart",
  doorHistory: "timeline",
  camera: "image",
  battery: "gauge",
  sparkline: "text",
  lastChanged: "text",
  person: "icon",
  timer: "text",
  alarm: "text",
  weatherNow: "icon",
  sunTimes: "text",
  openCount: "text",
  stateIcon: "icon",
  runButton: "icon",
  thermostat: "text",
  nowPlaying: "text",
  summary: "text",
  togglePill: "shape",
  levelBar: "text",
  weatherCard: "icon",
  eventCountdown: "text",
  personPhoto: "image",
  nowPlayingArt: "image",
  listEntities: "list",
  listEvents: "list",
  listTodo: "list",
  listHourly: "list",
  listDaily: "list",
  listLightsOn: "list",
  listBatteries: "list",
  listRecent: "list",
  listScenes: "list",
  listWhoHome: "list",
  listToggles: "list",
};

/** The color a preset's card is tinted with. */
export function presetColor(kind: PresetKind): string {
  return KIND_COLOR[PRESET_KIND[kind]];
}

// ── drawing helpers ───────────────────────────────────────────────────────

/** An arc of a circle. `frac` is how much of the 270 degree sweep is drawn,
 * starting from the bottom left, the same geometry a real gauge uses. */
function arc(cx: number, cy: number, r: number, frac: number): string {
  const start = 135;
  const end = start + 270 * Math.max(0, Math.min(1, frac));
  const p = (deg: number): { x: string; y: string } => {
    const rad = (deg * Math.PI) / 180;
    return { x: (cx - r * Math.cos(rad)).toFixed(2), y: (cy - r * Math.sin(rad)).toFixed(2) };
  };
  const a = p(start);
  const b = p(end);
  return `M${a.x} ${a.y}A${r} ${r} 0 ${end - start > 180 ? 1 : 0} 1 ${b.x} ${b.y}`;
}

/** One line of sample text, centred on x unless told otherwise. */
function label(x: number, y: number, text: string, size: number, fill: string, weight = "500", anchor = "middle"): TemplateResult {
  return svg`<text x=${x} y=${y} font-family=${FONT} font-size=${size} font-weight=${weight}
    fill=${fill} text-anchor=${anchor}>${text}</text>`;
}

/** The two-line stack six of the presets draw: a quiet line, then the reading.
 * `caption` sits under the reading instead when `below` is set. */
function stack(top: string, main: string, opts: { fill?: string; below?: boolean } = {}): TemplateResult {
  return svg`<g>
    ${opts.below ? label(60, 18, main, 19, opts.fill ?? "var(--k)", "600") : label(60, 17, top, 8, DIM)}
    ${opts.below ? label(60, 33, top, 8, DIM) : label(60, 34, main, 17, opts.fill ?? "var(--k)", "600")}
  </g>`;
}

/** The grey card a row sits on: white at the same fraction the preset writes,
 * so the sample and the face agree on how loud a card is. A capsule unless a
 * corner radius is given. */
function card(x: number, y: number, w: number, h: number, rx = h / 2): TemplateResult {
  return svg`<rect x=${x} y=${y} width=${w} height=${h} rx=${rx} fill="#FFFFFF" opacity=".12" />`;
}

/** A horizontal row of list rows: N lines of a wide bar and a short one, which
 * is what every list preset looks like from far enough away. */
function listRows(count: number, draw: (y: number, h: number, i: number) => TemplateResult): TemplateResult {
  const gap = 2;
  const h = (46 - 8 - gap * (count - 1)) / count;
  const out: TemplateResult[] = [];
  for (let i = 0; i < count; i++) out.push(draw(4 + i * (h + gap), h, i));
  return svg`<g>${out}</g>`;
}

/** One column of a list that runs across the face: a time, a glyph, a number. */
function acrossColumn(x: number, width: number, top: string, bottom: string, glyph: TemplateResult): TemplateResult {
  const cx = x + width / 2;
  return svg`<g>
    ${label(cx, 12, top, 7, DIM)}
    <g transform=${`translate(${cx - 5} 15)`}>${glyph}</g>
    ${label(cx, 40, bottom, 9, "var(--k)", "600")}
  </g>`;
}

/** A small weather-ish glyph, drawn at 10x10 from its own origin. */
const cloudGlyph = svg`<path d="M2.5 8.5h5.2a2 2 0 0 0 0-4 2.8 2.8 0 0 0-5.4.6 1.8 1.8 0 0 0 .2 3.4z"
  fill="none" stroke="var(--k)" stroke-width="1.1" stroke-linejoin="round" />`;
const sunGlyph = svg`<g fill="none" stroke="var(--k)" stroke-width="1.1" stroke-linecap="round">
  <circle cx="5" cy="5" r="2.2" /><path d="M5 .6v1.4M5 8v1.4M.6 5h1.4M8 5h1.4M1.9 1.9l1 1M7.1 7.1l1 1M8.1 1.9l-1 1M2.9 7.1l-1 1" />
</g>`;

/** A figure, for the person samples. Filled, so a row of them reads as people
 * and not as a row of circles. */
function figure(fill: string): TemplateResult {
  return svg`<g fill=${fill}><circle cx="5" cy="2.6" r="2.4" />
    <path d="M.8 10.5c0-2.6 1.9-4.4 4.2-4.4s4.2 1.8 4.2 4.4z" /></g>`;
}

// ── the samples ───────────────────────────────────────────────────────────

/** The sample drawn inside one preset's card. */
function sample(kind: PresetKind): TemplateResult {
  switch (kind) {
    // A button that is on: the glyph filled and lit, with the off version
    // beside it so the card says "this changes with the state".
    case "toggle":
      return svg`<g>
        <g transform="translate(34 13)" opacity=".45">
          <path d="M5 .8a4 4 0 0 1 4 4c0 1.6-1 2.4-1.4 3.3H2.4C2 7.2 1 6.4 1 4.8a4 4 0 0 1 4-4z"
            fill="none" stroke=${DIM} stroke-width="1.3" /><path d="M3.4 10.6h3.2" stroke=${DIM} stroke-width="1.3" />
        </g>
        <g transform="translate(66 9) scale(1.6)">
          <path d="M5 .8a4 4 0 0 1 4 4c0 1.6-1 2.4-1.4 3.3H2.4C2 7.2 1 6.4 1 4.8a4 4 0 0 1 4-4z" fill="var(--k)" />
          <path d="M3.4 10.6h3.2" stroke="var(--k)" stroke-width="1.3" stroke-linecap="round" />
        </g>
      </g>`;
    // One line saying what something is doing, which is the whole preset.
    case "status":
      return svg`${label(60, 29, "Playing", 15, "var(--k)", "600")}`;
    // The arc, its unfilled track, and the reading in the middle.
    case "gauge":
      return svg`<g fill="none" stroke-linecap="round">
        <path d=${arc(60, 27, 16, 1)} stroke=${DIM} stroke-width="3" opacity=".5" />
        <path d=${arc(60, 27, 16, 0.62)} stroke="var(--k)" stroke-width="3" />
        ${label(60, 31, "62", 12, "var(--k)", "600")}
      </g>`;
    // Bars, tallest one marked: a forecast is read for its peak.
    case "chart":
      return svg`<g fill="var(--k)">
        ${[14, 22, 9, 30, 18, 12, 25, 16].map((h, i) =>
          svg`<rect x=${10 + i * 13} y=${38 - h} width="8" height=${h} rx="1.5" opacity=${h === 30 ? 1 : 0.55} />`)}
      </g>`;
    // A line with its high and low marked, the way the preset ships it.
    case "history":
      return svg`<g fill="none">
        <polyline points="8,32 22,26 36,29 50,17 64,21 78,11 92,16 112,9"
          stroke="var(--k)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
        <circle cx="112" cy="9" r="2.6" fill="var(--k)" /><circle cx="78" cy="11" r="2" fill="var(--k)" opacity=".6" />
      </g>`;
    // A name over a strip of when it was open.
    case "doorHistory":
      return svg`<g>
        ${label(10, 16, "Front door", 9, DIM, "500", "start")}
        <g>
          <rect x="8" y="24" width="104" height="11" rx="3" fill=${DIM} opacity=".35" />
          <rect x="26" y="24" width="14" height="11" rx="3" fill="var(--k)" />
          <rect x="62" y="24" width="8" height="11" rx="3" fill="var(--k)" />
          <rect x="86" y="24" width="20" height="11" rx="3" fill="var(--k)" />
        </g>
      </g>`;
    // A snapshot filling the face: a frame, a horizon and a lens.
    case "camera":
      return svg`<g>
        <rect x="6" y="5" width="108" height="36" rx="5" fill="none" stroke="var(--k)" stroke-width="1.6" />
        <path d="M6 33l24-15 18 11 15-9 51 21H6z" fill="var(--k)" opacity=".35" />
        <circle cx="90" cy="15" r="4.5" fill="none" stroke="var(--k)" stroke-width="1.4" />
      </g>`;
    // The ring with the number inside, in the color a low battery takes.
    case "battery":
      return svg`<g fill="none" stroke-linecap="round">
        <path d=${arc(60, 27, 16, 1)} stroke=${DIM} stroke-width="3.4" opacity=".5" />
        <path d=${arc(60, 27, 16, 0.22)} stroke=${RED} stroke-width="3.4" />
        ${label(60, 31, "22%", 11, RED, "600")}
      </g>`;
    // The reading big, the six hours faint under it.
    case "sparkline":
      return svg`<g>
        ${label(60, 24, "21.4°", 19, "var(--k)", "600")}
        <polyline points="10,38 24,35 38,36 52,31 66,33 80,29 94,31 110,27"
          fill="none" stroke=${DIM} stroke-width="1.6" stroke-linejoin="round" />
      </g>`;
    case "lastChanged":
      return svg`${stack("Front door", "2h ago")}`;
    // A house and the word, in the green the preset writes for home.
    case "person":
      return svg`<g>
        <g transform="translate(51 8) scale(1.5)">
          <path d="M.9 5.2L6 1.1l5.1 4.1V11H.9z" fill="none" stroke=${GREEN} stroke-width="1.3" stroke-linejoin="round" />
        </g>
        ${label(60, 39, "Home", 9, DIM)}
      </g>`;
    // The clock ticking, with the finger that starts and pauses it.
    case "timer":
      return svg`<g>
        ${label(60, 25, "04:12", 18, "var(--k)", "600")}
        <g transform="translate(55 30)" opacity=".7">
          <path d="M5 9.5V4.2a1.1 1.1 0 0 1 2.2 0v2.1l1.6.5a1.4 1.4 0 0 1 1 1.6l-.4 1.8"
            fill="none" stroke=${DIM} stroke-width="1.2" stroke-linejoin="round" />
        </g>
      </g>`;
    case "alarm":
      return svg`<g>
        ${label(60, 17, "Alarm", 8, DIM)}
        ${label(60, 35, "Armed", 16, GREEN, "600")}
      </g>`;
    // The symbol over the temperature, which is the preset's own stack.
    case "weatherNow":
      return svg`<g>
        <g transform="translate(54 5) scale(1.25)">${cloudGlyph}</g>
        ${label(60, 38, "18°", 17, "var(--k)", "600")}
      </g>`;
    // Two rows: up at the top, down under it.
    case "sunTimes":
      return svg`<g>
        <g transform="translate(26 6)">${sunGlyph}</g>
        ${label(48, 18, "6:42", 12, "var(--k)", "600", "start")}
        <g transform="translate(26 26)" opacity=".55">${sunGlyph}</g>
        ${label(48, 38, "19:05", 12, DIM, "600", "start")}
      </g>`;
    case "openCount":
      return svg`<g>
        ${label(60, 29, "3", 22, "var(--k)", "600")}
        ${label(60, 40, "open", 8, DIM)}
      </g>`;
    // Three states side by side, the middle one current, so the card says
    // "the icon follows the state" rather than "on or off".
    case "stateIcon":
      return svg`<g>
        <g transform="translate(30 12)" opacity=".4">
          <rect x="0" y="0" width="12" height="12" rx="2" fill="none" stroke=${DIM} stroke-width="1.3" /></g>
        <g transform="translate(53 8) scale(1.4)">
          <rect x="0" y="0" width="10" height="10" rx="2" fill="none" stroke=${AMBER} stroke-width="1.3" />
          <path d="M0 5h10" stroke=${AMBER} stroke-width="1.3" /></g>
        <g transform="translate(78 12)" opacity=".4">
          <path d="M0 0h12v12H0z" fill=${DIM} opacity=".6" /></g>
        ${label(60, 40, "Garage", 8, DIM)}
      </g>`;
    // A play glyph in a lit circle, the name under it.
    case "runButton":
      return svg`<g>
        <circle cx="60" cy="18" r="10" fill="var(--k)" opacity=".2" />
        <path d="M56.5 12.5v11l9-5.5z" fill="var(--k)" />
        ${label(60, 40, "Movie night", 8, DIM)}
      </g>`;
    // Flame over the room temperature, the target under it.
    case "thermostat":
      return svg`<g>
        <path d="M60 4c2.5 2.6 4 4.6 4 6.7a4 4 0 0 1-8 0c0-1.2.5-2.2 1.3-3 .1 1.2.8 1.9 1.6 1.9 0-2 .3-3.7 1.1-5.6z"
          fill="var(--k)" />
        ${label(60, 31, "21°", 15, "var(--k)", "600")}
        ${label(60, 42, "Set 22°", 7, DIM)}
      </g>`;
    // A pause button over the song and the artist.
    case "nowPlaying":
      return svg`<g>
        <rect x="56" y="4" width="3" height="10" rx="1" fill="var(--k)" />
        <rect x="61" y="4" width="3" height="10" rx="1" fill="var(--k)" />
        ${label(60, 29, "Clair de lune", 11, "var(--k)", "600")}
        ${label(60, 40, "Debussy", 8, DIM)}
      </g>`;
    // A lit pill: dark ink on the accent, which is the preset's own "on".
    case "togglePill":
      return svg`<g>
        <rect x="14" y="12" width="92" height="22" rx="11" fill="#FF9F0A" />
        <g transform="translate(22 17)">
          <path d="M5 .8a4 4 0 0 1 4 4c0 1.6-1 2.4-1.4 3.3H2.4C2 7.2 1 6.4 1 4.8a4 4 0 0 1 4-4z" fill="#1C1C1E" />
          <path d="M3.4 10.6h3.2" stroke="#1C1C1E" stroke-width="1.3" stroke-linecap="round" />
        </g>
        ${label(38, 27, "Kitchen", 11, "#1C1C1E", "600", "start")}
      </g>`;
    // The name, the reading, and the bar under it, part filled in amber.
    case "levelBar":
      return svg`<g>
        ${label(60, 12, "Humidity", 7, DIM)}
        ${label(60, 30, "64%", 16, "var(--k)", "600")}
        <rect x="14" y="36" width="92" height="5" rx="2.5" fill=${DIM} opacity=".4" />
        <rect x="14" y="36" width="59" height="5" rx="2.5" fill=${AMBER} />
      </g>`;
    // The symbol on the left, the temperature and the details beside it.
    case "weatherCard":
      return svg`<g>
        <g transform="translate(12 9) scale(2.4)">${sunGlyph}</g>
        ${label(48, 25, "21°", 18, "var(--k)", "600", "start")}
        ${label(48, 38, "64% · 12 km/h", 7, DIM, "500", "start")}
      </g>`;
    // The event, the countdown, and when it starts.
    case "eventCountdown":
      return svg`<g>
        ${label(60, 12, "Dentist", 7, DIM)}
        ${label(60, 30, "1:23:45", 16, "var(--k)", "600")}
        ${label(60, 41, "14:00", 7, DIM)}
      </g>`;
    // A disc for the ring, the photo as a lighter disc inside it, the word.
    case "personPhoto":
      return svg`<g>
        <circle cx="60" cy="18" r="14" fill=${GREEN} />
        <circle cx="60" cy="18" r="11.5" fill="var(--k)" opacity=".45" />
        <g transform="translate(55 11.5)">${figure("#FFFFFF")}</g>
        ${label(60, 42, "Home", 8, GREEN)}
      </g>`;
    // The art as a tinted frame, the dark band along its bottom, the song.
    case "nowPlayingArt":
      return svg`<g>
        <rect x="6" y="4" width="108" height="38" rx="5" fill="var(--k)" opacity=".3" />
        <path d="M6 32l26-14 20 10 14-8 48 18v4H6z" fill="var(--k)" opacity=".3" />
        <rect x="10" y="28" width="100" height="11" rx="3" fill="#000000" opacity=".55" />
        ${label(60, 36.5, "Clair de lune", 8, "#FFFFFF", "600")}
      </g>`;
    // Three card rows: a colored glyph at the left end, the count at the right.
    case "summary":
      return svg`${listRows(3, (y, h, i) => svg`<g>
        ${card(4, y, 112, h)}
        <circle cx="13" cy=${y + h / 2} r="3.2" fill=${[AMBER, "#0A84FF", GREEN][i]!} />
        ${label(110, y + h * 0.75, ["3 lights on", "2 home", "All closed"][i]!, 9, "var(--k)", "600", "end")}
      </g>`)}`;
    // A card per row: a dot, a name and a reading.
    case "listEntities":
      return svg`${listRows(3, (y, h, i) => svg`<g>
        ${card(4, y, 112, h)}
        <circle cx="13" cy=${y + h / 2} r="3" fill="var(--k)" opacity=".8" />
        ${label(24, y + h * 0.75, ["Kitchen", "Office", "Garage"][i]!, 9, "var(--k)", "500", "start")}
        ${label(110, y + h * 0.75, ["21.5°", "On", "Closed"][i]!, 8, DIM, "500", "end")}
      </g>`)}`;
    // A card per event: the title and the time it starts.
    case "listEvents":
      return svg`${listRows(3, (y, h, i) => svg`<g>
        ${card(4, y, 112, h)}
        ${label(11, y + h * 0.75, ["Stand-up", "Dentist", "Pickup"][i]!, 9, "var(--k)", "500", "start")}
        ${label(110, y + h * 0.75, ["9:30", "14:00", "16:15"][i]!, 8, DIM, "500", "end")}
      </g>`)}`;
    // A card per item: a box to tick and the thing to do.
    case "listTodo":
      return svg`${listRows(3, (y, h, i) => svg`<g>
        ${card(4, y, 112, h)}
        <rect x="9" y=${y + h / 2 - 4} width="8" height="8" rx="2" fill="none" stroke=${DIM} stroke-width="1.2" />
        ${label(24, y + h * 0.75, ["Milk", "Post office", "Call Sam"][i]!, 9, "var(--k)", "500", "start")}
      </g>`)}`;
    case "listHourly":
      return svg`<g>${["10", "11", "12", "13"].map((t, i) =>
        acrossColumn(4 + i * 28, 28, t, ["17°", "18°", "19°", "18°"][i]!, i === 1 ? cloudGlyph : sunGlyph))}</g>`;
    case "listDaily":
      return svg`<g>${["Mon", "Tue", "Wed", "Thu"].map((t, i) =>
        acrossColumn(4 + i * 28, 28, t, ["21°", "19°", "17°", "20°"][i]!, i === 2 ? cloudGlyph : sunGlyph))}</g>`;
    // A card per light: a dot for the light and its name.
    case "listLightsOn":
      return svg`${listRows(3, (y, h, i) => svg`<g>
        ${card(4, y, 112, h)}
        <circle cx="13" cy=${y + h / 2} r="3.4" fill="var(--k)" />
        ${label(24, y + h * 0.75, ["Kitchen", "Hall", "Porch"][i]!, 9, "var(--k)", "500", "start")}
      </g>`)}`;
    // A card per battery: a bar that runs down, the name, and the number.
    case "listBatteries":
      return svg`${listRows(3, (y, h, i) => {
        const pct = [12, 46, 88][i]!;
        return svg`<g>
          ${card(4, y, 112, h)}
          <rect x="9" y=${y + h / 2 - 3} width="16" height="6" rx="3" fill=${DIM} opacity=".4" />
          <rect x="9" y=${y + h / 2 - 3} width=${(16 * pct) / 100} height="6" rx="3"
            fill=${pct < 25 ? RED : pct < 60 ? AMBER : GREEN} />
          ${label(31, y + h * 0.75, ["Sensor", "Remote", "Lock"][i]!, 9, "var(--k)", "500", "start")}
          ${label(110, y + h * 0.75, `${pct}%`, 8, DIM, "500", "end")}
        </g>`;
      })}`;
    case "listRecent":
      return svg`${listRows(3, (y, h, i) => svg`<g>
        ${card(4, y, 112, h)}
        ${label(11, y + h * 0.75, ["Back door", "Motion", "Kettle"][i]!, 9, "var(--k)", "500", "start")}
        ${label(110, y + h * 0.75, ["1m", "6m", "22m"][i]!, 8, DIM, "500", "end")}
      </g>`)}`;
    // Two by two cards, a glyph and a name per cell.
    case "listScenes":
      return svg`<g>${[0, 1, 2, 3].map((i) => {
        const x = 8 + (i % 2) * 56;
        const y = 4 + Math.floor(i / 2) * 20;
        return svg`<g>
          ${card(x, y, 48, 17, 4)}
          <circle cx=${x + 11} cy=${y + 8.5} r="3.2" fill="var(--k)" />
          ${label(x + 19, y + 12, ["Movie", "Away", "Night", "Dinner"][i]!, 8, "var(--k)", "500", "start")}
        </g>`;
      })}</g>`;
    // Two by two pills, the lit ones in the accent with dark ink.
    case "listToggles":
      return svg`<g>${[0, 1, 2, 3].map((i) => {
        const x = 8 + (i % 2) * 56;
        const y = 4 + Math.floor(i / 2) * 20;
        const on = i === 0 || i === 3;
        return svg`<g>
          ${on ? svg`<rect x=${x} y=${y} width="48" height="17" rx="8.5" fill="#FF9F0A" />` : card(x, y, 48, 17)}
          <circle cx=${x + 10} cy=${y + 8.5} r="3" fill=${on ? "#1C1C1E" : "var(--k)"} />
          ${label(x + 17, y + 12, ["Kitchen", "Fan", "Porch", "Lamp"][i]!, 8, on ? "#1C1C1E" : "var(--k)", "600", "start")}
        </g>`;
      })}</g>`;
    // Four people across, the two at home lit.
    case "listWhoHome":
      return svg`<g>${[0, 1, 2, 3].map((i) => {
        const home = i !== 2;
        return svg`<g>
          <g transform=${`translate(${13 + i * 28} 10)`} opacity=${home ? 1 : 0.4}>${figure(home ? GREEN : DIM)}</g>
          ${label(18 + i * 28, 38, ["Sam", "Alex", "Kim", "Jo"][i]!, 8, home ? "var(--k)" : DIM)}
        </g>`;
      })}</g>`;
  }
}

/**
 * The sample for one preset, sized by the same `.add .shot` rule the kind
 * buttons use. Marked `aria-hidden`: the card's own words name the preset, and
 * a screen reader has nothing to gain from the picture.
 */
export function presetPreview(kind: PresetKind): TemplateResult {
  return html`<svg class="shot" viewBox="0 0 120 46" aria-hidden="true">${sample(kind)}</svg>`;
}
