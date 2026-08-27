// The SF Symbol catalogue the picker browses, plus the small amount of state a
// browsing session needs.
//
// The document always stores the canonical Apple name (`lightbulb.fill`), never
// the Home Assistant asset name (`ios:lightbulb-fill`). Drawing is the icon
// provider's job; this file only decides which names to offer and in what order.
//
// The catalogue is curated rather than exhaustive. An installed icon pack can
// enumerate several thousand glyphs, which is both too slow to draw as a grid
// and too long to skim, so the categories below are the starting view and the
// full pack is reached by typing in the search box. Any name at all can still be
// typed into the field by hand, whether it is in this list or not.
//
// Every name here passed two checks on 2026-08-27, and both are worth repeating
// when the list grows:
//
//  1. `NSImage(systemSymbolName:)` accepts it. An invented name costs the user a
//     placeholder box on the watch with no warning at all.
//  2. The Cupertino Icons pack ships it. Apple keeps old spellings working as
//     aliases, so `airplayaudio` passes check 1 while only the modern
//     `airplay.audio` has a glyph to draw, which would leave a tile blank in a
//     picker whose whole point is the pictures.

export interface SymbolCategory {
  name: string;
  symbols: string[];
}

export const SYMBOL_CATEGORIES: SymbolCategory[] = [
  {
    name: "Home",
    symbols: [
      "house", "house.fill", "house.circle.fill", "bed.double.fill", "sofa.fill", "chair.lounge.fill",
      "lamp.desk.fill", "washer.fill", "dryer.fill", "refrigerator.fill", "oven.fill", "dishwasher.fill",
      "microwave.fill", "shower.fill", "bathtub.fill", "toilet.fill", "stairs", "door.left.hand.open",
      "door.left.hand.closed", "window.casement", "curtains.closed", "spigot.fill", "humidifier.fill",
      "air.purifier.fill", "fan.fill", "fan.ceiling.fill",
    ],
  },
  {
    name: "Climate",
    symbols: [
      "thermometer.variable", "thermometer.medium", "thermometer.low", "thermometer.high", "thermometer.sun.fill",
      "thermometer.snowflake", "humidity.fill", "drop.fill", "drop.degreesign", "flame.fill", "snowflake",
      "wind", "air.conditioner.horizontal.fill", "heater.vertical.fill", "gauge.with.needle",
    ],
  },
  {
    name: "Weather",
    symbols: [
      "sun.max.fill", "sun.min.fill", "sunrise.fill", "sunset.fill", "moon.fill", "moon.stars.fill",
      "cloud.fill", "cloud.sun.fill", "cloud.rain.fill", "cloud.heavyrain.fill", "cloud.drizzle.fill",
      "cloud.snow.fill", "cloud.bolt.fill", "cloud.bolt.rain.fill", "cloud.fog.fill", "tornado",
      "hurricane", "umbrella.fill", "rainbow", "aqi.medium",
    ],
  },
  {
    name: "Lighting",
    symbols: [
      "lightbulb", "lightbulb.fill", "lightbulb.slash.fill", "lightbulb.led.fill", "light.recessed",
      "light.panel.fill", "light.strip.2", "lamp.ceiling.fill", "lamp.floor.fill", "lamp.table.fill",
      "sparkles", "rays",
    ],
  },
  {
    name: "Security",
    symbols: [
      "lock.fill", "lock.open.fill", "lock.shield.fill", "shield.fill", "shield.slash.fill", "key.fill",
      "exclamationmark.shield.fill", "video.fill", "video.slash.fill", "web.camera.fill", "sensor.fill",
      "sensor.tag.radiowaves.forward.fill", "bell.fill", "bell.slash.fill", "bell.badge.fill",
      "alarm.fill", "eye.fill", "eye.slash.fill",
    ],
  },
  {
    name: "Media",
    symbols: [
      "play.fill", "pause.fill", "stop.fill", "forward.fill", "backward.fill", "forward.end.fill",
      "backward.end.fill", "speaker.wave.2.fill", "speaker.wave.3.fill", "speaker.slash.fill",
      "music.note", "music.note.list", "tv", "tv.fill", "appletv.fill", "homepod.fill", "homepod.2.fill",
      "airplay.audio", "airplay.video", "hifispeaker.fill", "headphones", "radio.fill", "film.fill",
      "photo.fill",
    ],
  },
  {
    name: "Power",
    symbols: [
      "bolt.fill", "bolt.slash.fill", "bolt.circle.fill", "battery.100percent", "battery.75percent",
      "battery.50percent", "battery.25percent", "battery.0percent", "battery.100percent.bolt",
      "powerplug.fill", "power", "poweroutlet.type.b.fill", "minus.plus.batteryblock.fill", "leaf.fill",
    ],
  },
  {
    name: "Devices",
    symbols: [
      "iphone", "ipad", "applewatch", "macbook", "desktopcomputer", "laptopcomputer", "homekit", "wifi",
      "wifi.slash", "antenna.radiowaves.left.and.right", "network", "externaldrive.fill", "server.rack",
      "printer.fill", "cpu", "memorychip", "sdcard.fill", "cable.connector",
      "dot.radiowaves.left.and.right",
    ],
  },
  {
    name: "Status",
    symbols: [
      "checkmark", "checkmark.circle.fill", "xmark", "xmark.circle.fill", "exclamationmark.triangle.fill",
      "exclamationmark.circle.fill", "questionmark.circle.fill", "info.circle.fill", "circle.fill",
      "circle", "circle.circle.fill", "minus.circle.fill", "plus.circle.fill", "hand.thumbsup.fill",
      "hand.thumbsdown.fill", "star.fill", "heart.fill", "flag.fill", "pin.fill",
      "wrench.and.screwdriver.fill", "gearshape.fill", "hourglass",
      "ellipsis",
    ],
  },
  {
    name: "Time",
    symbols: [
      "clock", "clock.fill", "alarm", "timer", "stopwatch.fill", "calendar", "calendar.badge.clock",
      "hourglass.bottomhalf.filled", "deskclock.fill", "sunrise", "sunset", "moon.zzz.fill", "zzz",
    ],
  },
  {
    name: "Arrows",
    symbols: [
      "arrow.up", "arrow.down", "arrow.left", "arrow.right", "arrow.up.right", "arrow.down.right",
      "arrow.up.circle.fill", "arrow.down.circle.fill", "arrow.clockwise", "arrow.counterclockwise",
      "arrow.up.arrow.down", "arrow.up.and.down", "arrow.left.and.right", "arrowshape.turn.up.left.fill",
      "chevron.up", "chevron.down", "chevron.left", "chevron.right",
    ],
  },
  {
    name: "Shapes",
    symbols: [
      "square.fill", "square", "circle.dashed", "triangle.fill", "diamond.fill", "hexagon.fill",
      "octagon.fill", "capsule.fill", "rectangle.fill", "app.fill", "seal.fill", "shield", "oval.fill",
      "pentagon.fill", "rhombus.fill", "drop", "cloud", "bolt",
    ],
  },
  {
    name: "Text and numbers",
    symbols: [
      "0.circle.fill", "1.circle.fill", "2.circle.fill", "3.circle.fill", "textformat", "textformat.size",
      "percent", "number", "plus", "minus", "multiply", "divide", "equal", "function", "sum", "character",
      "character.textbox", "degreesign.celsius", "degreesign.fahrenheit",
    ],
  },
  {
    name: "Nature",
    symbols: [
      "tree.fill", "carrot.fill", "drop.triangle.fill", "pawprint.fill", "hare.fill", "tortoise.fill",
      "ant.fill", "ladybug.fill", "bird.fill", "fish.fill", "camera.macro", "mountain.2.fill",
      "water.waves", "globe.americas.fill",
    ],
  },
  {
    name: "People",
    symbols: [
      "person.fill", "person.2.fill", "person.3.fill", "person.crop.circle.fill", "person.fill.checkmark",
      "person.fill.xmark", "figure.walk", "figure.run", "figure.stand", "hand.raised.fill", "ear.fill",
      "brain.head.profile", "eye", "accessibility",
    ],
  },
  {
    name: "Transport",
    symbols: [
      "car.fill", "car.2.fill", "bus.fill", "tram.fill", "airplane", "bicycle", "figure.walk.motion",
      "ev.charger.fill", "fuelpump.fill", "parkingsign.circle.fill", "road.lanes", "location.fill",
      "location.slash.fill", "map.fill", "mappin.and.ellipse",
    ],
  },
];

/** The catalogue flattened, in category order, with cross-category repeats dropped. */
export const CURATED_SYMBOLS: string[] = [
  ...new Set(SYMBOL_CATEGORIES.flatMap((c) => c.symbols)),
];

/** Search words a name does not contain but a person would reach for. */
const ALIASES: Record<string, string[]> = {
  "aqi.medium": ["air quality"],
  "arrow.clockwise": ["refresh", "reload", "update"],
  "battery.100percent": ["charge", "level"],
  "bolt.fill": ["power", "energy", "watt", "electric"],
  "checkmark.circle.fill": ["ok", "done", "good"],
  "clock.fill": ["time"],
  "curtains.closed": ["blind", "shade", "cover"],
  "door.left.hand.open": ["entry"],
  "drop.fill": ["humidity", "water", "moisture"],
  "dryer.fill": ["laundry"],
  "exclamationmark.triangle.fill": ["alert", "alarm", "problem", "error"],
  "fan.fill": ["ventilation"],
  "figure.walk": ["motion", "presence"],
  "flame.fill": ["heat", "heating", "boiler", "fire"],
  "gauge.with.needle": ["pressure"],
  "gearshape.fill": ["settings", "config"],
  "house.fill": ["home"],
  "leaf.fill": ["eco", "plant", "garden"],
  "lock.fill": ["security", "locked", "secure"],
  "moon.fill": ["night", "sleep"],
  "person.fill": ["presence", "occupancy"],
  "poweroutlet.type.b.fill": ["socket", "outlet"],
  "powerplug.fill": ["outlet", "socket", "plug", "switch"],
  "sensor.tag.radiowaves.forward.fill": ["motion"],
  "snowflake": ["cool", "cooling", "ac", "freeze"],
  "speaker.wave.2.fill": ["volume", "sound", "audio"],
  "sun.max.fill": ["day", "bright", "brightness"],
  "thermometer.medium": ["temperature", "temp"],
  "video.fill": ["camera"],
  "washer.fill": ["laundry"],
  "water.waves": ["pool", "flood"],
  "wifi": ["network", "internet", "signal"],
  "window.casement": ["blind", "shade"],
};

/** Everything a name can be found by: its own words plus any aliases. */
function haystack(symbol: string): string {
  return `${symbol.replace(/\./g, " ")} ${(ALIASES[symbol] ?? []).join(" ")}`;
}

/**
 * Names matching every word of the query, best first: whole-name matches, then
 * prefix matches, then the rest. An empty query returns the list unchanged so
 * the caller's own ordering (category order) survives.
 */
export function searchSymbols(names: readonly string[], query: string): string[] {
  const words = query.toLowerCase().split(/[\s.]+/).filter(Boolean);
  if (words.length === 0) return [...names];
  const scored: { name: string; score: number }[] = [];
  for (const name of names) {
    const hay = haystack(name);
    if (!words.every((w) => hay.includes(w))) continue;
    const joined = words.join(".");
    scored.push({ name, score: name === joined ? 0 : name.startsWith(joined) ? 1 : 2 });
  }
  // Sort is stable, so equal scores keep the order the caller supplied.
  return scored.sort((a, b) => a.score - b.score).map((s) => s.name);
}

/** Holds the picker's transient state so the editor functions can stay pure. */
/** What one symbol field is browsing: a search, and a category name or "" for
 * the whole starting catalogue. */
interface BrowseState {
  query: string;
  category: string;
}

export class SymbolBrowser {
  /**
   * Every symbol field shows its grid, so the state worth keeping is which ones
   * the user has folded away. Pictures are the whole point of the picker and a
   * name field alone gives no clue what it will draw, so the grid is not
   * something to go looking for behind a button.
   */
  private collapsed = new Set<string>();
  /** Per field, because several grids are on screen at once and a search typed
   * into one must not disturb the others. */
  private browsing = new Map<string, BrowseState>();
  recent: string[] = [];

  private static readonly STORAGE_KEY = "wrist-assistant.recent-symbols";
  private static readonly RECENT_LIMIT = 12;

  constructor(private readonly onChange: () => void) {
    this.recent = SymbolBrowser.loadRecent();
  }

  isOpen(key: string): boolean {
    return !this.collapsed.has(key);
  }

  toggle(key: string) {
    if (this.collapsed.has(key)) this.collapsed.delete(key);
    else this.collapsed.add(key);
    this.onChange();
  }

  query(key: string): string {
    return this.browsing.get(key)?.query ?? "";
  }

  category(key: string): string {
    return this.browsing.get(key)?.category ?? "";
  }

  setQuery(key: string, query: string) {
    this.browsing.set(key, { category: this.category(key), query });
    this.onChange();
  }

  setCategory(key: string, category: string) {
    this.browsing.set(key, { query: this.query(key), category });
    this.onChange();
  }

  /** Records a pick, most recent first, without duplicates. */
  noteUsed(symbol: string) {
    const name = symbol.trim();
    if (!name) return;
    this.recent = [name, ...this.recent.filter((s) => s !== name)].slice(0, SymbolBrowser.RECENT_LIMIT);
    SymbolBrowser.saveRecent(this.recent);
    this.onChange();
  }

  // Storage can throw outright in a browser with site data blocked, so both
  // sides swallow failures: a lost recents list is not worth a broken panel.
  private static loadRecent(): string[] {
    try {
      const raw = localStorage.getItem(SymbolBrowser.STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((s): s is string => typeof s === "string").slice(0, SymbolBrowser.RECENT_LIMIT);
    } catch {
      return [];
    }
  }

  private static saveRecent(list: string[]) {
    try {
      localStorage.setItem(SymbolBrowser.STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Nothing to do; the list stays correct for this session only.
    }
  }
}
