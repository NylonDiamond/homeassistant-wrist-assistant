// CustomComplicationConfig schemaVersion 4, as the Apple clients encode it.
// Wire-format reference: docs/custom_complication_schema_v4.md in the app
// repo. `parseConfig` normalises the two shapes Swift can emit (perFamily as
// an alternating array, `Value` in flat v2 or nested v3 form) into one typed
// object; `encodeConfig` writes back exactly the shape the phone expects.

export type FamilyKind = "rectangular" | "circular" | "corner" | "inline";
export const DRAWABLE_FAMILIES: FamilyKind[] = ["rectangular", "circular", "corner"];

export type FontWeight = "regular" | "medium" | "semibold" | "bold";
export type TextCase = "upper" | "lower" | "capitalized";
export type TimeField = "now" | "hour" | "minute" | "weekday" | "day" | "month" | "timestamp";
export type GaugeStyle = "ring" | "arc" | "bar";
export type ShapeKind = "rectangle" | "roundedRectangle" | "capsule" | "circle";
export type CornerBodyShape = "circle" | "wedge";
export type AggregateFunction = "count" | "sum" | "average" | "min" | "max";

export interface EntityRef {
  entityId: string;
  displayName: string;
  domain: string;
  iconName?: string;
}

export interface ValueFormat {
  decimals?: number;
  multiply?: number;
  offset?: number;
  prefix?: string;
  suffix?: string;
  useEntityUnit?: boolean;
  relativeTime?: boolean;
  textCase?: TextCase;
}

export type AggregateScope =
  | { kind: "entities"; entities: EntityRef[] }
  | { kind: "filter"; domains: string[]; areaIds: string[]; labelIds: string[]; floorIds: string[] };

export type AggregateStateFilter =
  | { kind: "isOn" }
  | { kind: "isOff" }
  | { kind: "equals"; value: string }
  | { kind: "notEquals"; value: string };

export interface AggregateSpec {
  function: AggregateFunction;
  scope: AggregateScope;
  stateFilter?: AggregateStateFilter;
  attribute?: string;
}

export type ValueKind =
  | { kind: "literal"; value: string }
  | ({ kind: "entityState" } & EntityRef)
  | ({ kind: "entityAttribute"; attribute: string } & EntityRef)
  | ({ kind: "entityAge" } & EntityRef)
  | { kind: "aggregate"; aggregate: AggregateSpec }
  | { kind: "time"; timeField: TimeField }
  | { kind: "dataAge" }
  | { kind: "jinja"; value: string }
  | { kind: "named"; id: string };

export interface Value {
  kind: ValueKind;
  format?: ValueFormat;
}

export interface NamedValue {
  id: string;
  name: string;
  value: Value;
}

export interface NormalizedFrame {
  x: number;
  y: number;
  width: number;
  height: number;
  rotationDegrees: number;
}

export const CENTERED_FRAME: NormalizedFrame = { x: 0.25, y: 0.25, width: 0.5, height: 0.5, rotationDegrees: 0 };

export interface ColorSlot {
  baseColorHex: string;
}

export type ComparisonKind =
  | "equals" | "notEquals" | "isOn" | "isOff" | "isUnavailable" | "isStale" | "isEmpty"
  | "greaterThan" | "greaterOrEqual" | "lessThan" | "lessOrEqual" | "between"
  | "contains" | "startsWith" | "endsWith" | "matchesRegex" | "isOneOf";

export interface Comparison {
  kind: ComparisonKind;
  value?: Value;
  upper?: Value;
  pattern?: string;
  options?: string[];
}

export type StyleProperty =
  | "color" | "opacity" | "text" | "icon" | "fontSize" | "fontWeight" | "rotation"
  | "visibility" | "gaugeValue" | "gaugeMin" | "gaugeMax" | "borderColor" | "borderWidth"
  | "backgroundColor";

export type StyleChangeKind =
  | "setColor" | "setOpacity" | "setText" | "setIcon" | "setFontSize" | "setFontWeight"
  | "setRotation" | "hide" | "show" | "setGaugeValue" | "setGaugeMin" | "setGaugeMax"
  | "setBorderColor" | "setBorderWidth" | "setBackgroundColor";

export interface StyleChange {
  kind: StyleChangeKind;
  value?: Value;
  number?: number;
  weight?: FontWeight;
}

export const STYLE_PROPERTY: Record<StyleChangeKind, StyleProperty> = {
  setColor: "color",
  setOpacity: "opacity",
  setText: "text",
  setIcon: "icon",
  setFontSize: "fontSize",
  setFontWeight: "fontWeight",
  setRotation: "rotation",
  hide: "visibility",
  show: "visibility",
  setGaugeValue: "gaugeValue",
  setGaugeMin: "gaugeMin",
  setGaugeMax: "gaugeMax",
  setBorderColor: "borderColor",
  setBorderWidth: "borderWidth",
  setBackgroundColor: "backgroundColor",
};

export interface Test {
  id: string;
  value: Value;
  comparison: Comparison;
}

export interface Condition {
  join: "all" | "any";
  tests: Test[];
}

export interface RuleCase {
  id: string;
  when: Condition;
  then: StyleChange[];
}

export interface Rule {
  id: string;
  cases: RuleCase[];
  otherwise?: StyleChange[];
}

interface ElementBase {
  id: string;
  colorSlot: ColorSlot;
  rules: Rule[];
  frame: NormalizedFrame;
  isHidden: boolean;
}

export interface TextElement extends ElementBase {
  value: Value;
  fontSize: number;
  fontWeight: FontWeight;
}

export interface IconElement extends ElementBase {
  symbol: Value;
  size: number;
}

export interface GaugeElement extends ElementBase {
  value: Value;
  minValue: number;
  maxValue: number;
  style: GaugeStyle;
  lineWidth: number;
  trackColorHex: string;
}

export interface ShapeElement extends ElementBase {
  kind: ShapeKind;
  cornerRadius: number;
  borderColorHex?: string;
  borderWidth: number;
}

export type Element =
  | { kind: "text"; payload: TextElement }
  | { kind: "icon"; payload: IconElement }
  | { kind: "gauge"; payload: GaugeElement }
  | { kind: "shape"; payload: ShapeElement };

export interface Placement {
  frame: NormalizedFrame;
  isHidden: boolean;
  size?: number;
}

export interface FamilyLayout {
  placements: Record<string, Placement>;
  bezelText?: Value;
  backgroundColorHex?: string;
  cornerBodyShape: CornerBodyShape;
  borderColorHex?: string;
  borderWidth: number;
  rules: Rule[];
}

export type TapAction =
  | { type: "none" | "refresh" | "openApp" | "openPage" | "openRoomPage" | "timerStartPause" | "timerCancel" }
  | ({ type: "toggleEntity" | "runScene" | "runScript" | "addTodo" | "runHTTPAction" } & EntityRef);

export type DataSource =
  | ({ kind: "entity" } & EntityRef)
  | { kind: "template"; value: string };

export interface CustomComplicationConfig {
  schemaVersion: number;
  id: string;
  name: string;
  values: NamedValue[];
  slotIndex: number;
  elements: Element[];
  supportedFamilies: FamilyKind[];
  perFamily: Partial<Record<FamilyKind, FamilyLayout>>;
  dataSources: DataSource[];
  refreshMinutes?: number;
  tapAction: TapAction;
  showSuccessFlash?: boolean;
  successFlashColorHex?: string;
}

// ── parsing ───────────────────────────────────────────────────────────────

type J = Record<string, unknown>;

function isObject(v: unknown): v is J {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}
function num(v: unknown, fallback: number): number {
  if (typeof v === "number") return v;
  if (v === "+inf") return Infinity;
  if (v === "-inf") return -Infinity;
  if (v === "nan") return NaN;
  return fallback;
}
function optNum(v: unknown): number | undefined {
  return v === undefined || v === null ? undefined : num(v, 0);
}
function optStr(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

export class ConfigParseError extends Error {}

function parseEntityRef(o: J): EntityRef {
  if (typeof o.entityId !== "string") throw new ConfigParseError("entityId is required");
  const ref: EntityRef = { entityId: o.entityId, displayName: str(o.displayName), domain: str(o.domain) };
  if (typeof o.iconName === "string") ref.iconName = o.iconName;
  return ref;
}

function parseFormat(o: unknown): ValueFormat | undefined {
  if (!isObject(o)) return undefined;
  const f: ValueFormat = {};
  if (o.decimals !== undefined && o.decimals !== null) f.decimals = num(o.decimals, 0);
  if (o.multiply !== undefined && o.multiply !== null) f.multiply = num(o.multiply, 1);
  if (o.offset !== undefined && o.offset !== null) f.offset = num(o.offset, 0);
  if (typeof o.prefix === "string") f.prefix = o.prefix;
  if (typeof o.suffix === "string") f.suffix = o.suffix;
  if (o.useEntityUnit === true) f.useEntityUnit = true;
  if (o.relativeTime === true) f.relativeTime = true;
  if (o.textCase === "upper" || o.textCase === "lower" || o.textCase === "capitalized") f.textCase = o.textCase;
  return formatIsEmpty(f) ? undefined : f;
}

export function formatIsEmpty(f: ValueFormat | undefined): boolean {
  if (!f) return true;
  return (
    f.decimals === undefined &&
    f.multiply === undefined &&
    f.offset === undefined &&
    !f.prefix &&
    !f.suffix &&
    !f.useEntityUnit &&
    !f.relativeTime &&
    f.textCase === undefined
  );
}

function parseAggregate(o: J): AggregateSpec {
  const fn = str(o.function, "count") as AggregateFunction;
  const scopeRaw = isObject(o.scope) ? o.scope : {};
  let scope: AggregateScope;
  if (scopeRaw.kind === "entities") {
    const list = Array.isArray(scopeRaw.entities) ? scopeRaw.entities : [];
    scope = { kind: "entities", entities: list.filter(isObject).map(parseEntityRef) };
  } else {
    const strings = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
    scope = {
      kind: "filter",
      domains: strings(scopeRaw.domains),
      areaIds: strings(scopeRaw.areaIds),
      labelIds: strings(scopeRaw.labelIds),
      floorIds: strings(scopeRaw.floorIds),
    };
  }
  const spec: AggregateSpec = { function: fn, scope };
  if (isObject(o.stateFilter)) {
    const k = o.stateFilter.kind;
    if (k === "isOn" || k === "isOff") spec.stateFilter = { kind: k };
    else if (k === "equals" || k === "notEquals") spec.stateFilter = { kind: k, value: str(o.stateFilter.value) };
  }
  if (typeof o.attribute === "string") spec.attribute = o.attribute;
  return spec;
}

function parseValueKind(o: J): ValueKind {
  switch (o.kind) {
    case "literal":
      return { kind: "literal", value: str(o.value) };
    case "entityState":
      return { kind: "entityState", ...parseEntityRef(o) };
    case "entityAttribute":
      return { kind: "entityAttribute", ...parseEntityRef(o), attribute: str(o.attribute) };
    case "entityAge":
      return { kind: "entityAge", ...parseEntityRef(o) };
    case "aggregate":
      return { kind: "aggregate", aggregate: parseAggregate(isObject(o.aggregate) ? o.aggregate : {}) };
    case "time":
      return { kind: "time", timeField: (optStr(o.timeField) as TimeField | undefined) ?? "now" };
    case "dataAge":
      return { kind: "dataAge" };
    case "jinja":
      return { kind: "jinja", value: str(o.value) };
    case "named":
      return { kind: "named", id: str(o.id).toUpperCase() };
    default:
      throw new ConfigParseError(`unknown value kind ${String(o.kind)}`);
  }
}

export function parseValue(raw: unknown): Value {
  if (!isObject(raw)) throw new ConfigParseError("value must be an object");
  // Nested v3 form: {"kind": {...}, "format": {...}}. Flat v2 form: kind is a string.
  if (isObject(raw.kind)) {
    const v: Value = { kind: parseValueKind(raw.kind) };
    const f = parseFormat(raw.format);
    if (f) v.format = f;
    return v;
  }
  const v: Value = { kind: parseValueKind(raw) };
  const f = parseFormat(raw.format);
  if (f) v.format = f;
  return v;
}

function parseFrame(o: unknown): NormalizedFrame {
  if (!isObject(o)) return { ...CENTERED_FRAME };
  return {
    x: num(o.x, 0.25),
    y: num(o.y, 0.25),
    width: num(o.width, 0.5),
    height: num(o.height, 0.5),
    rotationDegrees: num(o.rotationDegrees, 0),
  };
}

function parseComparison(o: unknown): Comparison {
  if (!isObject(o)) return { kind: "isOn" };
  const kind = str(o.kind, "isOn") as ComparisonKind;
  const c: Comparison = { kind };
  switch (kind) {
    case "equals": case "notEquals": case "greaterThan": case "greaterOrEqual":
    case "lessThan": case "lessOrEqual": case "contains": case "startsWith": case "endsWith":
      c.value = isObject(o.value) ? parseValue(o.value) : literal("");
      break;
    case "between":
      c.value = isObject(o.value) ? parseValue(o.value) : literal("");
      c.upper = isObject(o.upper) ? parseValue(o.upper) : literal("");
      break;
    case "matchesRegex":
      c.pattern = str(o.pattern);
      break;
    case "isOneOf":
      c.options = Array.isArray(o.options) ? o.options.filter((x): x is string => typeof x === "string") : [];
      break;
    default:
      break;
  }
  return c;
}

function parseStyleChange(o: unknown): StyleChange {
  if (!isObject(o)) return { kind: "show" };
  const kind = str(o.kind, "show") as StyleChangeKind;
  const c: StyleChange = { kind };
  switch (kind) {
    case "setColor": case "setText": case "setIcon": case "setGaugeValue":
    case "setBorderColor": case "setBackgroundColor":
      c.value = isObject(o.value) ? parseValue(o.value) : literal("");
      break;
    case "setOpacity": case "setFontSize": case "setRotation": case "setGaugeMin":
    case "setGaugeMax": case "setBorderWidth":
      c.number = num(o.number, 0);
      break;
    case "setFontWeight":
      c.weight = (optStr(o.weight) as FontWeight | undefined) ?? "regular";
      break;
    default:
      break;
  }
  return c;
}

function parseRules(raw: unknown): Rule[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isObject).map((r) => {
    const rule: Rule = {
      id: str(r.id).toUpperCase(),
      cases: (Array.isArray(r.cases) ? r.cases : []).filter(isObject).map((c) => {
        const when = isObject(c.when) ? c.when : {};
        return {
          id: str(c.id).toUpperCase(),
          when: {
            join: when.join === "any" ? "any" : "all",
            tests: (Array.isArray(when.tests) ? when.tests : []).filter(isObject).map((t) => ({
              id: str(t.id).toUpperCase(),
              value: isObject(t.value) ? parseValue(t.value) : literal(""),
              comparison: parseComparison(t.comparison),
            })),
          },
          then: (Array.isArray(c.then) ? c.then : []).map(parseStyleChange),
        };
      }),
    };
    if (Array.isArray(r.otherwise)) rule.otherwise = r.otherwise.map(parseStyleChange);
    return rule;
  });
}

function parseColorSlot(o: unknown, fallback: string): ColorSlot {
  return { baseColorHex: isObject(o) ? str(o.baseColorHex, fallback) : fallback };
}

function parseElementBase(p: J, defaultColor: string): ElementBase {
  if (typeof p.id !== "string") throw new ConfigParseError("element id is required");
  return {
    id: p.id.toUpperCase(),
    colorSlot: parseColorSlot(p.colorSlot, defaultColor),
    rules: parseRules(p.rules),
    frame: parseFrame(p.frame),
    isHidden: p.isHidden === true,
  };
}

export function parseElement(raw: unknown): Element {
  if (!isObject(raw) || !isObject(raw.payload)) throw new ConfigParseError("element must have a payload");
  const p = raw.payload;
  switch (raw.kind) {
    case "text":
      return {
        kind: "text",
        payload: {
          ...parseElementBase(p, "#FFFFFF"),
          value: isObject(p.value) ? parseValue(p.value) : literal(""),
          fontSize: num(p.fontSize, 14),
          fontWeight: (optStr(p.fontWeight) as FontWeight | undefined) ?? "regular",
        },
      };
    case "icon":
      return {
        kind: "icon",
        payload: {
          ...parseElementBase(p, "#FFFFFF"),
          symbol: isObject(p.symbol) ? parseValue(p.symbol) : literal("lightbulb"),
          size: num(p.size, 14),
        },
      };
    case "gauge":
      return {
        kind: "gauge",
        payload: {
          ...parseElementBase(p, "#FFFFFF"),
          value: isObject(p.value) ? parseValue(p.value) : literal("50"),
          minValue: num(p.minValue, 0),
          maxValue: num(p.maxValue, 100),
          style: (optStr(p.style) as GaugeStyle | undefined) ?? "arc",
          lineWidth: num(p.lineWidth, 4),
          trackColorHex: str(p.trackColorHex, "#FFFFFF40"),
        },
      };
    case "shape": {
      const el: ShapeElement = {
        ...parseElementBase(p, "#FFFFFF33"),
        kind: (optStr(p.kind) as ShapeKind | undefined) ?? "roundedRectangle",
        cornerRadius: num(p.cornerRadius, 6),
        borderWidth: num(p.borderWidth, 1),
      };
      if (typeof p.borderColorHex === "string") el.borderColorHex = p.borderColorHex;
      return { kind: "shape", payload: el };
    }
    default:
      throw new ConfigParseError(`unknown element kind ${String(raw.kind)}`);
  }
}

function parseLayout(o: unknown): FamilyLayout {
  const l = isObject(o) ? o : {};
  const placements: Record<string, Placement> = {};
  if (isObject(l.placements)) {
    for (const [id, p] of Object.entries(l.placements)) {
      if (!isObject(p)) continue;
      const pl: Placement = { frame: parseFrame(p.frame), isHidden: p.isHidden === true };
      const size = optNum(p.size);
      if (size !== undefined) pl.size = size;
      placements[id.toUpperCase()] = pl;
    }
  }
  const layout: FamilyLayout = {
    placements,
    cornerBodyShape: l.cornerBodyShape === "circle" ? "circle" : "wedge",
    borderWidth: num(l.borderWidth, 2),
    rules: parseRules(l.rules),
  };
  if (isObject(l.bezelText)) layout.bezelText = parseValue(l.bezelText);
  if (typeof l.backgroundColorHex === "string") layout.backgroundColorHex = l.backgroundColorHex;
  if (typeof l.borderColorHex === "string") layout.borderColorHex = l.borderColorHex;
  return layout;
}

function parsePerFamily(raw: unknown): Partial<Record<FamilyKind, FamilyLayout>> {
  const out: Partial<Record<FamilyKind, FamilyLayout>> = {};
  if (Array.isArray(raw)) {
    // Swift encodes [FamilyKind: FamilyLayout] as a flat alternating array.
    for (let i = 0; i + 1 < raw.length; i += 2) {
      const k = raw[i];
      if (typeof k === "string") out[k as FamilyKind] = parseLayout(raw[i + 1]);
    }
  } else if (isObject(raw)) {
    for (const [k, v] of Object.entries(raw)) out[k as FamilyKind] = parseLayout(v);
  }
  return out;
}

function parseTapAction(raw: unknown): TapAction {
  if (!isObject(raw) || typeof raw.type !== "string") return { type: "none" };
  switch (raw.type) {
    case "none": case "refresh": case "openApp": case "openPage": case "openRoomPage":
    case "timerStartPause": case "timerCancel":
      return { type: raw.type };
    case "toggleEntity": case "runScene": case "runScript": case "addTodo": case "runHTTPAction":
      return { type: raw.type, ...parseEntityRef(raw) };
    default:
      return { type: "none" };
  }
}

export function parseConfig(raw: unknown): CustomComplicationConfig {
  if (!isObject(raw)) throw new ConfigParseError("config must be an object");
  for (const key of ["id", "name", "slotIndex", "supportedFamilies", "perFamily", "tapAction"]) {
    if (!(key in raw)) throw new ConfigParseError(`${key} is required`);
  }
  const values = (Array.isArray(raw.values) ? raw.values : []).filter(isObject).map((v) => ({
    id: str(v.id).toUpperCase(),
    name: str(v.name),
    value: isObject(v.value) ? parseValue(v.value) : literal(""),
  }));
  const dataSources: DataSource[] = (Array.isArray(raw.dataSources) ? raw.dataSources : [])
    .filter(isObject)
    .map((d): DataSource | null => {
      if (d.kind === "template") return { kind: "template", value: str(d.value) };
      if (d.kind === "entity") return { kind: "entity", ...parseEntityRef(d) };
      return null;
    })
    .filter((d): d is DataSource => d !== null);
  const cfg: CustomComplicationConfig = {
    schemaVersion: num(raw.schemaVersion, 1),
    id: str(raw.id).toUpperCase(),
    name: str(raw.name, "Custom"),
    values,
    slotIndex: num(raw.slotIndex, 0),
    elements: (Array.isArray(raw.elements) ? raw.elements : []).map(parseElement),
    supportedFamilies: (Array.isArray(raw.supportedFamilies) ? raw.supportedFamilies : []).filter(
      (f): f is FamilyKind => typeof f === "string",
    ),
    perFamily: parsePerFamily(raw.perFamily),
    dataSources,
    tapAction: parseTapAction(raw.tapAction),
  };
  const rm = optNum(raw.refreshMinutes);
  if (rm !== undefined) cfg.refreshMinutes = rm;
  if (typeof raw.showSuccessFlash === "boolean") cfg.showSuccessFlash = raw.showSuccessFlash;
  if (typeof raw.successFlashColorHex === "string") cfg.successFlashColorHex = raw.successFlashColorHex;
  return cfg;
}

// ── encoding ──────────────────────────────────────────────────────────────
// Writes exactly what the Swift synthesised/custom encoders write
// (docs/custom_complication_schema_v4.md §0-§5, §8): nested Value with
// `format` omitted when empty, perFamily as the alternating array, Placement
// with `isHidden` only when true and `size` only when set, FamilyLayout with
// `placements`/`rules` only when non-empty and optionals only when present.

function encNum(n: number): number | string {
  if (Number.isNaN(n)) return "nan";
  if (n === Infinity) return "+inf";
  if (n === -Infinity) return "-inf";
  return n;
}

function encodeEntityRef(r: EntityRef): J {
  const o: J = { entityId: r.entityId, displayName: r.displayName, domain: r.domain };
  if (r.iconName !== undefined) o.iconName = r.iconName;
  return o;
}

function encodeFormat(f: ValueFormat): J {
  const o: J = {};
  if (f.decimals !== undefined) o.decimals = encNum(f.decimals);
  if (f.multiply !== undefined) o.multiply = encNum(f.multiply);
  if (f.offset !== undefined) o.offset = encNum(f.offset);
  if (f.prefix) o.prefix = f.prefix;
  if (f.suffix) o.suffix = f.suffix;
  if (f.useEntityUnit) o.useEntityUnit = true;
  if (f.relativeTime) o.relativeTime = true;
  if (f.textCase !== undefined) o.textCase = f.textCase;
  return o;
}

function encodeAggregate(a: AggregateSpec): J {
  const scope: J =
    a.scope.kind === "entities"
      ? { kind: "entities", entities: a.scope.entities.map(encodeEntityRef) }
      : { kind: "filter", domains: a.scope.domains, areaIds: a.scope.areaIds, labelIds: a.scope.labelIds, floorIds: a.scope.floorIds };
  const o: J = { function: a.function, scope };
  if (a.stateFilter) {
    o.stateFilter = a.stateFilter.kind === "equals" || a.stateFilter.kind === "notEquals"
      ? { kind: a.stateFilter.kind, value: a.stateFilter.value }
      : { kind: a.stateFilter.kind };
  }
  if (a.attribute !== undefined) o.attribute = a.attribute;
  return o;
}

function encodeValueKind(k: ValueKind): J {
  switch (k.kind) {
    case "literal": return { kind: "literal", value: k.value };
    case "entityState": return { kind: "entityState", ...encodeEntityRef(k) };
    case "entityAttribute": return { kind: "entityAttribute", ...encodeEntityRef(k), attribute: k.attribute };
    case "entityAge": return { kind: "entityAge", ...encodeEntityRef(k) };
    case "aggregate": return { kind: "aggregate", aggregate: encodeAggregate(k.aggregate) };
    case "time": return { kind: "time", timeField: k.timeField };
    case "dataAge": return { kind: "dataAge" };
    case "jinja": return { kind: "jinja", value: k.value };
    case "named": return { kind: "named", id: k.id };
  }
}

export function encodeValue(v: Value): J {
  const o: J = { kind: encodeValueKind(v.kind) };
  if (!formatIsEmpty(v.format)) o.format = encodeFormat(v.format!);
  return o;
}

function encodeFrame(f: NormalizedFrame): J {
  return { x: encNum(f.x), y: encNum(f.y), width: encNum(f.width), height: encNum(f.height), rotationDegrees: encNum(f.rotationDegrees) };
}

function encodeComparison(c: Comparison): J {
  const o: J = { kind: c.kind };
  switch (c.kind) {
    case "equals": case "notEquals": case "greaterThan": case "greaterOrEqual":
    case "lessThan": case "lessOrEqual": case "contains": case "startsWith": case "endsWith":
      o.value = encodeValue(c.value ?? literal(""));
      break;
    case "between":
      o.value = encodeValue(c.value ?? literal(""));
      o.upper = encodeValue(c.upper ?? literal(""));
      break;
    case "matchesRegex":
      o.pattern = c.pattern ?? "";
      break;
    case "isOneOf":
      o.options = c.options ?? [];
      break;
    default:
      break;
  }
  return o;
}

function encodeStyleChange(c: StyleChange): J {
  const o: J = { kind: c.kind };
  switch (c.kind) {
    case "setColor": case "setText": case "setIcon": case "setGaugeValue":
    case "setBorderColor": case "setBackgroundColor":
      o.value = encodeValue(c.value ?? literal(""));
      break;
    case "setOpacity": case "setFontSize": case "setRotation": case "setGaugeMin":
    case "setGaugeMax": case "setBorderWidth":
      o.number = encNum(c.number ?? 0);
      break;
    case "setFontWeight":
      o.weight = c.weight ?? "regular";
      break;
    default:
      break;
  }
  return o;
}

export function encodeRules(rules: Rule[]): J[] {
  return rules.map((r) => {
    const o: J = {
      id: r.id,
      cases: r.cases.map((c) => ({
        id: c.id,
        when: {
          join: c.when.join,
          tests: c.when.tests.map((t) => ({ id: t.id, value: encodeValue(t.value), comparison: encodeComparison(t.comparison) })),
        },
        then: c.then.map(encodeStyleChange),
      })),
    };
    if (r.otherwise) o.otherwise = r.otherwise.map(encodeStyleChange);
    return o;
  });
}

function encodeElement(el: Element): J {
  const base = (p: ElementBase): J => ({
    id: p.id,
    colorSlot: { baseColorHex: p.colorSlot.baseColorHex },
    rules: encodeRules(p.rules),
    frame: encodeFrame(p.frame),
    isHidden: p.isHidden,
  });
  switch (el.kind) {
    case "text":
      return { kind: "text", payload: { ...base(el.payload), value: encodeValue(el.payload.value), fontSize: encNum(el.payload.fontSize), fontWeight: el.payload.fontWeight } };
    case "icon":
      return { kind: "icon", payload: { ...base(el.payload), symbol: encodeValue(el.payload.symbol), size: encNum(el.payload.size) } };
    case "gauge":
      return {
        kind: "gauge",
        payload: {
          ...base(el.payload),
          value: encodeValue(el.payload.value),
          minValue: encNum(el.payload.minValue),
          maxValue: encNum(el.payload.maxValue),
          style: el.payload.style,
          lineWidth: encNum(el.payload.lineWidth),
          trackColorHex: el.payload.trackColorHex,
        },
      };
    case "shape": {
      const o: J = { ...base(el.payload), kind: el.payload.kind, cornerRadius: encNum(el.payload.cornerRadius), borderWidth: encNum(el.payload.borderWidth) };
      if (el.payload.borderColorHex !== undefined) o.borderColorHex = el.payload.borderColorHex;
      return { kind: "shape", payload: o };
    }
  }
}

function encodeLayout(l: FamilyLayout): J {
  const o: J = {};
  const ids = Object.keys(l.placements);
  if (ids.length > 0) {
    const placements: J = {};
    for (const id of ids) {
      const p = l.placements[id]!;
      const po: J = { frame: encodeFrame(p.frame) };
      if (p.isHidden) po.isHidden = true;
      if (p.size !== undefined) po.size = encNum(p.size);
      placements[id] = po;
    }
    o.placements = placements;
  }
  if (l.bezelText) o.bezelText = encodeValue(l.bezelText);
  if (l.backgroundColorHex !== undefined) o.backgroundColorHex = l.backgroundColorHex;
  o.cornerBodyShape = l.cornerBodyShape;
  if (l.borderColorHex !== undefined) o.borderColorHex = l.borderColorHex;
  o.borderWidth = encNum(l.borderWidth);
  if (l.rules.length > 0) o.rules = encodeRules(l.rules);
  return o;
}

function encodeTapAction(t: TapAction): J {
  if ("entityId" in t) return { type: t.type, ...encodeEntityRef(t) };
  return { type: t.type };
}

export function encodeConfig(cfg: CustomComplicationConfig): J {
  const perFamily: unknown[] = [];
  for (const family of ["rectangular", "circular", "corner", "inline"] as FamilyKind[]) {
    const l = cfg.perFamily[family];
    if (l) perFamily.push(family, encodeLayout(l));
  }
  const o: J = {
    schemaVersion: 4,
    id: cfg.id,
    name: cfg.name,
    values: cfg.values.map((v) => ({ id: v.id, name: v.name, value: encodeValue(v.value) })),
    slotIndex: cfg.slotIndex,
    elements: cfg.elements.map(encodeElement),
    supportedFamilies: cfg.supportedFamilies,
    perFamily,
    dataSources: cfg.dataSources.map((d) => (d.kind === "template" ? { kind: "template", value: d.value } : { kind: "entity", ...encodeEntityRef(d) })),
    tapAction: encodeTapAction(cfg.tapAction),
  };
  if (cfg.refreshMinutes !== undefined) o.refreshMinutes = cfg.refreshMinutes;
  if (cfg.showSuccessFlash !== undefined) o.showSuccessFlash = cfg.showSuccessFlash;
  if (cfg.successFlashColorHex !== undefined) o.successFlashColorHex = cfg.successFlashColorHex;
  return o;
}

// ── unknown-key audit ─────────────────────────────────────────────────────
// The parser drops keys it does not know, so a save after editing would
// silently lose them. The panel refuses to edit a document whose audit is
// non-empty and tells the user which paths it does not understand.

const K = {
  config: ["schemaVersion", "id", "name", "values", "slotIndex", "elements", "supportedFamilies", "perFamily", "dataSources", "refreshMinutes", "tapAction", "showSuccessFlash", "successFlashColorHex"],
  named: ["id", "name", "value"],
  value: ["kind", "format"],
  format: ["decimals", "multiply", "offset", "prefix", "suffix", "useEntityUnit", "relativeTime", "textCase"],
  entityRef: ["entityId", "displayName", "domain", "iconName"],
  aggregate: ["function", "scope", "stateFilter", "attribute"],
  scope: ["kind", "entities", "domains", "areaIds", "labelIds", "floorIds"],
  stateFilter: ["kind", "value"],
  frame: ["x", "y", "width", "height", "rotationDegrees"],
  elementEnvelope: ["kind", "payload"],
  elementBase: ["id", "colorSlot", "rules", "frame", "isHidden"],
  text: ["value", "fontSize", "fontWeight"],
  icon: ["symbol", "size"],
  gauge: ["value", "minValue", "maxValue", "style", "lineWidth", "trackColorHex"],
  shape: ["kind", "cornerRadius", "borderColorHex", "borderWidth"],
  colorSlot: ["baseColorHex"],
  rule: ["id", "cases", "otherwise"],
  case: ["id", "when", "then"],
  condition: ["join", "tests"],
  test: ["id", "value", "comparison"],
  comparison: ["kind", "value", "upper", "pattern", "options"],
  styleChange: ["kind", "value", "number", "weight"],
  layout: ["placements", "bezelText", "backgroundColorHex", "cornerBodyShape", "borderColorHex", "borderWidth", "rules"],
  placement: ["frame", "isHidden", "size"],
  tapAction: ["type", "entityId", "displayName", "domain", "iconName"],
  dataSource: ["kind", "entityId", "displayName", "domain", "iconName", "value"],
};

const VALUE_KIND_KEYS: Record<string, string[]> = {
  literal: ["kind", "value"],
  entityState: ["kind", ...K.entityRef],
  entityAttribute: ["kind", ...K.entityRef, "attribute"],
  entityAge: ["kind", ...K.entityRef],
  aggregate: ["kind", "aggregate"],
  time: ["kind", "timeField"],
  dataAge: ["kind"],
  jinja: ["kind", "value"],
  named: ["kind", "id"],
};

export function auditUnknownKeys(raw: unknown): string[] {
  const out: string[] = [];
  const check = (o: unknown, allowed: string[], path: string) => {
    if (!isObject(o)) return;
    for (const key of Object.keys(o)) if (!allowed.includes(key)) out.push(`${path}.${key}`);
  };
  const valueKind = (o: unknown, path: string) => {
    if (!isObject(o)) return;
    const kind = typeof o.kind === "string" ? o.kind : "";
    check(o, VALUE_KIND_KEYS[kind] ?? ["kind"], path);
    if (kind === "aggregate" && isObject(o.aggregate)) {
      check(o.aggregate, K.aggregate, `${path}.aggregate`);
      check(o.aggregate.scope, K.scope, `${path}.aggregate.scope`);
      if (isObject(o.aggregate.scope) && Array.isArray(o.aggregate.scope.entities)) {
        o.aggregate.scope.entities.forEach((e, i) => check(e, K.entityRef, `${path}.aggregate.scope.entities[${i}]`));
      }
      check(o.aggregate.stateFilter, K.stateFilter, `${path}.aggregate.stateFilter`);
    }
  };
  const value = (o: unknown, path: string) => {
    if (!isObject(o)) return;
    if (isObject(o.kind)) {
      check(o, K.value, path);
      valueKind(o.kind, `${path}.kind`);
    } else {
      const kind = typeof o.kind === "string" ? o.kind : "";
      check(o, [...(VALUE_KIND_KEYS[kind] ?? ["kind"]), "format"], path);
      if (kind === "aggregate") valueKind(o, path);
    }
    check(o.format, K.format, `${path}.format`);
  };
  const changes = (list: unknown, path: string) => {
    if (!Array.isArray(list)) return;
    list.forEach((c, i) => {
      check(c, K.styleChange, `${path}[${i}]`);
      if (isObject(c)) value(c.value, `${path}[${i}].value`);
    });
  };
  const rules = (list: unknown, path: string) => {
    if (!Array.isArray(list)) return;
    list.forEach((r, i) => {
      const rp = `${path}[${i}]`;
      check(r, K.rule, rp);
      if (!isObject(r)) return;
      if (Array.isArray(r.cases)) {
        r.cases.forEach((c, j) => {
          const cp = `${rp}.cases[${j}]`;
          check(c, K.case, cp);
          if (!isObject(c)) return;
          check(c.when, K.condition, `${cp}.when`);
          if (isObject(c.when) && Array.isArray(c.when.tests)) {
            c.when.tests.forEach((t, k) => {
              const tp = `${cp}.when.tests[${k}]`;
              check(t, K.test, tp);
              if (!isObject(t)) return;
              value(t.value, `${tp}.value`);
              check(t.comparison, K.comparison, `${tp}.comparison`);
              if (isObject(t.comparison)) {
                value(t.comparison.value, `${tp}.comparison.value`);
                value(t.comparison.upper, `${tp}.comparison.upper`);
              }
            });
          }
          changes(c.then, `${cp}.then`);
        });
      }
      changes(r.otherwise, `${rp}.otherwise`);
    });
  };
  if (!isObject(raw)) return out;
  check(raw, K.config, "$");
  if (Array.isArray(raw.values)) {
    raw.values.forEach((v, i) => {
      check(v, K.named, `$.values[${i}]`);
      if (isObject(v)) value(v.value, `$.values[${i}].value`);
    });
  }
  if (Array.isArray(raw.elements)) {
    raw.elements.forEach((e, i) => {
      const ep = `$.elements[${i}]`;
      check(e, K.elementEnvelope, ep);
      if (!isObject(e) || !isObject(e.payload)) return;
      const kind = typeof e.kind === "string" ? e.kind : "";
      const extra = (K as Record<string, string[]>)[kind] ?? [];
      check(e.payload, [...K.elementBase, ...extra], `${ep}.payload`);
      check(e.payload.colorSlot, K.colorSlot, `${ep}.payload.colorSlot`);
      check(e.payload.frame, K.frame, `${ep}.payload.frame`);
      rules(e.payload.rules, `${ep}.payload.rules`);
      for (const vk of ["value", "symbol"]) if (vk in e.payload) value(e.payload[vk], `${ep}.payload.${vk}`);
    });
  }
  const layouts: [string, unknown][] = [];
  if (Array.isArray(raw.perFamily)) {
    for (let i = 0; i + 1 < raw.perFamily.length; i += 2) layouts.push([String(raw.perFamily[i]), raw.perFamily[i + 1]]);
  } else if (isObject(raw.perFamily)) {
    layouts.push(...Object.entries(raw.perFamily));
  }
  for (const [family, l] of layouts) {
    const lp = `$.perFamily.${family}`;
    check(l, K.layout, lp);
    if (!isObject(l)) continue;
    if (isObject(l.placements)) {
      for (const [id, p] of Object.entries(l.placements)) {
        check(p, K.placement, `${lp}.placements.${id}`);
        if (isObject(p)) check(p.frame, K.frame, `${lp}.placements.${id}.frame`);
      }
    }
    value(l.bezelText, `${lp}.bezelText`);
    rules(l.rules, `${lp}.rules`);
  }
  if (Array.isArray(raw.dataSources)) raw.dataSources.forEach((d, i) => check(d, K.dataSource, `$.dataSources[${i}]`));
  check(raw.tapAction, K.tapAction, "$.tapAction");
  return out;
}

// ── construction helpers ──────────────────────────────────────────────────

export function newId(): string {
  const c = globalThis.crypto;
  if (c && "randomUUID" in c) return c.randomUUID().toUpperCase();
  const hex = () => Math.floor(Math.random() * 0x10000).toString(16).padStart(4, "0");
  return `${hex()}${hex()}-${hex()}-4${hex().slice(1)}-${hex()}-${hex()}${hex()}${hex()}`.toUpperCase();
}

export function defaultLayout(): FamilyLayout {
  return { placements: {}, cornerBodyShape: "wedge", borderWidth: 2, rules: [] };
}

export function newConfig(name: string, slotIndex: number): CustomComplicationConfig {
  return {
    schemaVersion: 4,
    id: newId(),
    name,
    values: [],
    slotIndex,
    elements: [],
    supportedFamilies: ["rectangular", "circular", "corner"],
    perFamily: { rectangular: defaultLayout(), circular: defaultLayout(), corner: defaultLayout() },
    dataSources: [],
    refreshMinutes: 15,
    tapAction: { type: "refresh" },
  };
}

export function newElement(kind: Element["kind"]): Element {
  const base = (color: string): ElementBase => ({ id: newId(), colorSlot: { baseColorHex: color }, rules: [], frame: { ...CENTERED_FRAME }, isHidden: false });
  switch (kind) {
    case "text": return { kind, payload: { ...base("#FFFFFF"), value: literal("Text"), fontSize: 14, fontWeight: "regular" } };
    case "icon": return { kind, payload: { ...base("#FFFFFF"), symbol: literal("lightbulb"), size: 14 } };
    case "gauge": return { kind, payload: { ...base("#FFFFFF"), value: literal("50"), minValue: 0, maxValue: 100, style: "arc", lineWidth: 4, trackColorHex: "#FFFFFF40" } };
    case "shape": return { kind, payload: { ...base("#FFFFFF33"), kind: "roundedRectangle", cornerRadius: 6, borderWidth: 1 } };
  }
}

// ── helpers ───────────────────────────────────────────────────────────────

export function literal(value: string): Value {
  return { kind: { kind: "literal", value } };
}

export function elementBase(el: Element): ElementBase {
  return el.payload;
}

/** Per-family layer list: shared elements with the family's placements applied. */
export function elementsFor(config: CustomComplicationConfig, family: FamilyKind): Element[] {
  const layout = config.perFamily[family];
  if (!layout || Object.keys(layout.placements).length === 0) return config.elements;
  return config.elements.map((el) => {
    const placement = layout.placements[el.payload.id];
    if (!placement) return el;
    const payload = { ...el.payload, frame: placement.frame, isHidden: placement.isHidden };
    if (placement.size !== undefined) {
      if (el.kind === "text") (payload as TextElement).fontSize = placement.size;
      else if (el.kind === "icon") (payload as IconElement).size = placement.size;
      else if (el.kind === "gauge") (payload as GaugeElement).lineWidth = placement.size;
    }
    return { kind: el.kind, payload } as Element;
  });
}

/** The value a layer shows (shapes have none). */
export function primaryValue(el: Element): Value | undefined {
  switch (el.kind) {
    case "text": return el.payload.value;
    case "icon": return el.payload.symbol;
    case "gauge": return el.payload.value;
    case "shape": return undefined;
  }
}

/** Every Value a rule can read, in walk order. */
export function ruleValues(rules: Rule[]): Value[] {
  const out: Value[] = [];
  const fromChanges = (changes: StyleChange[]) => {
    for (const c of changes) if (c.value) out.push(c.value);
  };
  for (const rule of rules) {
    for (const c of rule.cases) {
      for (const t of c.when.tests) {
        out.push(t.value);
        if (t.comparison.value) out.push(t.comparison.value);
        if (t.comparison.upper) out.push(t.comparison.upper);
      }
      fromChanges(c.then);
    }
    if (rule.otherwise) fromChanges(rule.otherwise);
  }
  return out;
}

// ── rule construction ─────────────────────────────────────────────────────

export type RuleTarget = Element["kind"] | "layout";

/** Properties each target actually reads (schema §5.3). Others are stored but ignored. */
export const RULE_TARGET_PROPERTIES: Record<RuleTarget, StyleProperty[]> = {
  text: ["color", "opacity", "text", "fontSize", "fontWeight", "rotation", "visibility"],
  icon: ["color", "opacity", "icon", "fontSize", "rotation", "visibility"],
  gauge: ["color", "opacity", "gaugeValue", "gaugeMin", "gaugeMax", "rotation", "visibility"],
  shape: ["color", "opacity", "borderColor", "borderWidth", "rotation", "visibility"],
  layout: ["backgroundColor", "borderColor", "borderWidth", "text"],
};

export const COMPARISON_KINDS: ComparisonKind[] = [
  "isOn", "isOff", "equals", "notEquals", "isUnavailable", "isStale", "isEmpty",
  "greaterThan", "greaterOrEqual", "lessThan", "lessOrEqual", "between",
  "contains", "startsWith", "endsWith", "matchesRegex", "isOneOf",
];

export function comparisonOperand(kind: ComparisonKind): "none" | "value" | "between" | "pattern" | "options" {
  switch (kind) {
    case "isOn": case "isOff": case "isUnavailable": case "isStale": case "isEmpty": return "none";
    case "between": return "between";
    case "matchesRegex": return "pattern";
    case "isOneOf": return "options";
    default: return "value";
  }
}

export function styleChangePayload(kind: StyleChangeKind): "none" | "value" | "number" | "weight" {
  switch (kind) {
    case "hide": case "show": return "none";
    case "setFontWeight": return "weight";
    case "setOpacity": case "setFontSize": case "setRotation": case "setGaugeMin": case "setGaugeMax": case "setBorderWidth": return "number";
    default: return "value";
  }
}

export function newTest(): Test {
  return { id: newId(), value: literal(""), comparison: { kind: "isOn" } };
}

export function newCase(): RuleCase {
  return { id: newId(), when: { join: "all", tests: [newTest()] }, then: [] };
}

export function newRule(): Rule {
  return { id: newId(), cases: [newCase()] };
}

/** Change the comparison kind, keeping an operand the new kind can still use. */
export function switchComparison(c: Comparison, kind: ComparisonKind): Comparison {
  const next: Comparison = { kind };
  switch (comparisonOperand(kind)) {
    case "value": next.value = c.value ?? literal(""); break;
    case "between": next.value = c.value ?? literal(""); next.upper = c.upper ?? literal(""); break;
    case "pattern": next.pattern = c.pattern ?? ""; break;
    case "options": next.options = c.options ?? []; break;
    case "none": break;
  }
  return next;
}

export function newStyleChange(kind: StyleChangeKind): StyleChange {
  const c: StyleChange = { kind };
  switch (styleChangePayload(kind)) {
    case "value":
      c.value = literal(kind === "setColor" || kind === "setBorderColor" || kind === "setBackgroundColor" ? "#FF453A" : kind === "setIcon" ? "exclamationmark.triangle" : kind === "setGaugeValue" ? "50" : "Text");
      break;
    case "number":
      c.number = kind === "setOpacity" ? 0.5 : kind === "setFontSize" ? 14 : kind === "setBorderWidth" ? 2 : kind === "setGaugeMax" ? 100 : 0;
      break;
    case "weight": c.weight = "bold"; break;
    case "none": break;
  }
  return c;
}
