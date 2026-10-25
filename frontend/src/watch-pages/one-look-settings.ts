// What the tile settings say when the devices showing the page draw One
// Look, the shared tile look of the iPhone and the watch: the lines that
// change because One Look draws a setting differently, and the reasons for
// the controls it does not draw at all, which the settings grey out.
//
// Words only, and which rows they belong to; `tile-settings.ts` draws them.
// Nothing here writes: a greyed control keeps its stored value, so a device
// on an older app, or a later look, still reads it. Whether One Look is on
// for the page is the host's `oneLook` (`editor-host.ts`), worked out by the
// page editor from the devices that pick the page (`oneLookForEvery`,
// version.ts); a host that says nothing keeps the old look's words.
//
// Every line was checked against the app's One Look code (app repo
// `WristAssistant Watch App/Views/OneLook/`, and `OneLookKindTile` in
// `Views/Tiles/SimpleTileViews.swift`) with the switches in `OneLookChoices`
// as they stand: the centred glyph on both devices, the brightness bar,
// names on one line, no calm when idle, graphite for a tile with no color.
// Plan: app repo docs/one_look_2026-10/NOTES.md.

import { type WatchPageTile, tileEntityId, tileKind } from "./model.js";

/** The settings sections One Look can grey as a whole. */
export type OneLookSection = "icon" | "text" | "border" | "background";

// ── which tiles ──────────────────────────────────────────────────────────

/** The kinds whose round button in the top right (play or pause, the fan)
 * One Look draws whatever Show status badge says, so Icon size stays in
 * view with the badge off. */
export const ONE_LOOK_BUTTON_KINDS: ReadonlySet<string> = new Set(["media_player", "music_hub", "climate"]);

/** The kinds One Look gives a round button that the phone's State task has
 * no card for: Point control's arrow and Assist's mic. Icon size scales it,
 * so they get a card of their own with that one row. */
export const ONE_LOOK_BUTTON_ONLY_KINDS: ReadonlySet<string> = new Set(["point_control", "assist"]);

function kindOf(tile: WatchPageTile): string {
  return tileKind(tileEntityId(tile));
}

/** Whether the tile is a camera or a camera group showing its picture
 * (Preview): One Look draws the picture alone there, with no icon, name,
 * border, pattern or effect (`showCameraPicture`, and `decorated` off). */
export function oneLookShowsPicture(tile: WatchPageTile): boolean {
  const kind = kindOf(tile);
  return (kind === "camera" || kind === "multicam") && tile.cameraDisplayMode === "preview";
}

/** Why a whole section does nothing on this tile in One Look, or undefined
 * when it draws. */
export function oneLookSectionOff(tile: WatchPageTile, section: string): string | undefined {
  if (!oneLookShowsPicture(tile)) return undefined;
  switch (section) {
    case "icon":
      return "A camera showing its picture draws no icon or color.";
    case "text":
      return "A camera showing its picture draws no name.";
    case "border":
      return "A camera showing its picture draws no border.";
    case "background":
      return "A camera showing its picture draws no pattern or effect.";
    default:
      return undefined;
  }
}

// ── Icon and color ───────────────────────────────────────────────────────

/** The line under the tile's color, by what it holds, on the device showing
 * the page. With none stored, the watch's pull gives the tile its kind's
 * color from the page's theme (`applyDefaultTileColors`); the iPhone draws
 * the tile as stored. */
export function oneLookColorNote(mode: "none" | "solid" | "gradient" | "rainbow", device: "watch" | "iphone" = "watch"): string | undefined {
  switch (mode) {
    case "none":
      return device === "iphone"
        ? "No color: the tile draws graphite, amber while a light is on or media plays."
        : "No color: the watch fills the tile with its kind's color from the page's theme.";
    case "solid":
      return "The tile fills with this color, deepened so white text reads on it.";
    case "gradient":
      return "The tile fills from the first color to the second, corner to corner.";
    case "rainbow":
      return undefined;
  }
}

/** The Rainbow swatch's line: a still fill, it never cycles. */
export const ONE_LOOK_RAINBOW_NOTE = "The tile fills with every color in bands, corner to corner.";

/** The State icons and colors card's line. */
export const ONE_LOOK_STATE_ICONS_NOTE = "An icon or color per state. A state's color fills the whole tile while it is in that state.";

/** The line under Icon size. */
export function oneLookIconSizeHint(top: number): string {
  return `Leave empty for Auto, or pick 8 to ${top} pt. The icon sits where it always did and shrinks if the state or name needs the room.`;
}

/** Dim when off on a light, the one kind One Look dims. */
export const ONE_LOOK_DIM_LIGHT_NOTE = "On: an off light draws dark gray with its bulb in its color. Off: it keeps its color.";

/** Why Dim when off is greyed on every other kind. */
export const ONE_LOOK_DIM_OFF_REASON = "Only lights dim when off. Other tiles keep their color.";

/** Whether Dim when off draws on this tile. */
export function oneLookDims(tile: WatchPageTile): boolean {
  return kindOf(tile) === "light";
}

/** Why Animate while on is greyed. */
export const ONE_LOOK_ANIMATE_REASON = "The icon stays still while on. The tile's color shows it is on.";

// ── Text ─────────────────────────────────────────────────────────────────

/** The line under Font size. */
export function oneLookFontSizeHint(min: number, max: number): string {
  return `Leave empty for Auto, sized to the tile, or pick ${min} to ${max} pt. The name stays on one line and shrinks if it is too long.`;
}

/** The line under Weight: Light, every new tile's, and Regular both keep
 * the look's own. */
export const ONE_LOOK_WEIGHT_NOTE = "Light and Regular keep the tile's own weight.";

/** The line under the name's Text shadow. */
export const ONE_LOOK_TEXT_SHADOW_NOTE = "A soft shadow under the name on a colored tile, on the iPhone. The watch draws none.";

// ── State ────────────────────────────────────────────────────────────────

/** Each State card's line in One Look, by card and then by kind (`*` for
 * every kind), where it differs from the table's. Without the table's
 * closing period: the card adds it. */
const CARD_SUBTITLES: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  textSize: { "*": "The state in the top left, like Off or 50%" },
  valueLabel: {
    light: "The brightness in the top left. Off says On instead. Pill puts it in a dark capsule",
    fan: "The speed in the top left. Off says On instead. Pill puts it in a dark capsule",
    cover: "The position in the top left. Off hides it. Pill puts it in a dark capsule",
    valve: "The position in the top left. Off hides it. Pill puts it in a dark capsule",
    sensor: "The reading in the top left. Off hides it. Pill puts it in a dark capsule",
    binary_sensor: "The reading in the top left. Off hides it. Pill puts it in a dark capsule",
    counter: "The reading in the top left. Off hides it. Pill puts it in a dark capsule",
    media_player: "The volume shows as the bar. Pill puts what plays in a dark capsule",
  },
  bar: {
    light: "The brightness as a thin bar across the top, or the tile filled from the left",
    cover: "The position as a thin bar across the top, or the tile filled from the left",
    valve: "The position as a thin bar across the top, or the tile filled from the left",
    fan: "The speed as a thin bar across the top, or the tile filled from the left",
    media_player: "The volume while it plays as a thin bar across the top, or the tile filled from the left",
  },
  activity: {
    timer: "Show the countdown in the top left of the tile",
    media_player: "Show what is playing in the top left. The play or pause button stays",
    music_hub: "Show what is playing in the top left. The play or pause button stays",
    climate: "The fan button in the top right, on a thermostat with fan modes",
    fan: "No status icon on a fan tile. Its speed is the state",
    lawn_mower: "Show what the mower is doing in the top left. The battery stays",
    vacuum: "Show what the vacuum is doing in the top left. The battery stays",
    remote: "Show On, Off or the player's state in the top left",
  },
};

/** A State card's line in One Look, or undefined to keep the table's. */
export function oneLookCardSubtitle(cardId: string, kind: string): string | undefined {
  const byKind = CARD_SUBTITLES[cardId];
  if (byKind === undefined) return undefined;
  return byKind[kind] ?? byKind["*"];
}

/** The card Point control and Assist get for their button. */
export const ONE_LOOK_BUTTON_CARD = { id: "button", title: "Button", subtitle: "The round button in the top right" } as const;

/** Why a State row does nothing on this kind in One Look, or undefined
 * when it draws. */
export function oneLookStateRowOff(kind: string, key: string): string | undefined {
  if (key === "showActivityStatus") {
    if (kind === "climate") return "No heating or cooling icon. The temperature shows it.";
    if (kind === "fan") return "No status icon on a fan tile. Its speed is the state.";
  }
  if (key === "statusIconSizeOverride") {
    if (kind === "fan") return "No status icon on a fan tile. Its speed is the state.";
    if (kind === "lawn_mower" || kind === "vacuum" || kind === "remote") return "No status icon on this tile.";
  }
  return undefined;
}

/** The size button each kind's Icon size scales. */
const BUTTON_WORDS: Readonly<Record<string, string>> = {
  media_player: "The size of the play or pause button in the top right.",
  music_hub: "The size of the play or pause button in the top right.",
  climate: "The size of the fan button in the top right, on a thermostat with fan modes.",
  point_control: "The size of the arrow button in the top right.",
  assist: "The size of the mic button in the top right.",
};

/** The line under a State row in One Look, from what it holds now, or
 * undefined for none. */
export function oneLookStateRowNote(kind: string, key: string, value: unknown): string | undefined {
  switch (key) {
    case "statusTextShadow":
      return "A soft shadow under the state on a colored tile, on the iPhone. The watch draws none.";
    case "badgeFontSizeOverride":
      return "Grows or shrinks the state from 75% to 150% of the tile's own size. It still shrinks to fit.";
    case "stateBarStyle":
      return value === "Fill"
        ? "The tile fills with its color from the left to the level; the rest is a dark shade of it."
        : "A thin bar across the top fills to the level. The tile keeps its room, so the icon does not move.";
    case "stateBarColorStyle":
      return "Tile: white with a little of the tile's color. White: plain white.";
    case "statusIconSizeOverride":
      return BUTTON_WORDS[kind];
    default:
      return undefined;
  }
}

/** The Value choices One Look does not draw on a kind, each with why: a
 * media player's volume is the bar, never a number, so Off does nothing. */
export function oneLookValueStylesOff(kind: string): Readonly<Record<string, string>> {
  return kind === "media_player" ? { Off: "The volume shows as the bar." } : {};
}

/** On the iPhone, a media player showing its album art and a sensor
 * drawing its chart keep the disc layout, with no bar and no pill there. */
export const ONE_LOOK_ARTWORK_NOTE = "On the iPhone, a tile showing album art draws no bar or pill.";
export const ONE_LOOK_CHART_NOTE = "On the iPhone, a tile drawing a chart shows no pill.";

// ── Border ───────────────────────────────────────────────────────────────

/** Why the Extra Thin border is greyed: One Look drops the hairlines and
 * draws its own rim instead. */
export const ONE_LOOK_EXTRA_THIN_REASON = "Too thin to draw. Pick Thin or more.";

/** Whether a Line border of this thickness draws (`OneLookSurface.keepsBorder`). */
export function oneLookDrawsThickness(thickness: string): boolean {
  return thickness !== "extraThin" && thickness !== "auto";
}

// ── Camera ───────────────────────────────────────────────────────────────

/** The line under the camera's Display: Preview. */
export const ONE_LOOK_CAMERA_PREVIEW_HINT = "Shows the picture alone, with no icon or name. Tap opens the live view; hold and slide up refreshes the snapshot.";
