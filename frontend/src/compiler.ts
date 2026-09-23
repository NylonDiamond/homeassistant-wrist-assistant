// Port of Shared/CustomComplicationCompiler.swift: turns one config into the
// entity fetch list plus a single Jinja document whose keys are stable per
// value. The keys MUST match Swift byte for byte, because the phone and the
// watch key their cache the same way (docs/custom_complication_schema_v4.md §6).

import {
  type AggregateSpec,
  type AggregateScope,
  type AggregateStateFilter,
  type CustomComplicationConfig,
  type DataSource,
  type Element,
  type EntityRef,
  type ListElement,
  type ListRequestSpec,
  type ListSource,
  type NamedValue,
  type Value,
  type ValueKind,
  DRAWABLE_FAMILIES,
  clampListRows,
  primaryValue,
  ruleValues,
} from "./model.js";

export interface Compiled {
  entities: Map<string, EntityRef>;
  expressions: Map<string, string>;
  /** The one-document template, or undefined when nothing is computed. */
  document?: string;
}

// ── keys ──────────────────────────────────────────────────────────────────

/** FNV-1a 64-bit over UTF-8 bytes, as lowercase hex without zero padding. */
export function fnv1a64Hex(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  const mask = 0xffffffffffffffffn;
  for (const b of bytes) {
    hash ^= BigInt(b);
    hash = (hash * prime) & mask;
  }
  return hash.toString(16);
}

function namedLookup(namedValues: NamedValue[]): Map<string, Value> {
  return new Map(namedValues.map((n) => [n.id.toUpperCase(), n.value]));
}

function isComputed(kind: ValueKind): boolean {
  return kind.kind === "entityAttribute" || kind.kind === "entityAge" || kind.kind === "aggregate"
    || kind.kind === "time" || kind.kind === "jinja";
}

/** Stable cache key for a value, or undefined when it resolves locally. */
export function keyFor(value: Value, namedValues: NamedValue[] | Map<string, Value>, depth = 0): string | undefined {
  const lookup = namedValues instanceof Map ? namedValues : namedLookup(namedValues);
  const kind = value.kind;
  if (kind.kind === "named") {
    if (depth > 8) return undefined;
    const target = lookup.get(kind.id.toUpperCase());
    if (!target) return undefined;
    if (target.kind.kind === "named") return keyFor(target, lookup, depth + 1);
    if (!isComputed(target.kind)) return undefined;
    return "n_" + kind.id.toLowerCase().replace(/-/g, "");
  }
  if (!isComputed(kind)) return undefined;
  const expr = expression(kind);
  if (expr === undefined) return undefined;
  return "e_" + fnv1a64Hex(expr);
}

// ── expressions ───────────────────────────────────────────────────────────

function quote(s: string): string {
  return "'" + s.replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
}

/** The entities an aggregate or a list source reads, as one Jinja expression.
 * Split out of `aggregateExpression` so a list's own Jinja can reuse it
 * character for character: "3 lights on" and the list of those three lights
 * have to select the same entities or the two would drift apart. */
function scopeExpression(spec: { scope: AggregateScope }): string {
  let scope: string;
  if (spec.scope.kind === "entities") {
    scope = `expand([${spec.scope.entities.map((e) => quote(e.entityId)).join(", ")}])`;
  } else {
    const { domains, areaIds, labelIds, floorIds } = spec.scope;
    const hasIds = areaIds.length + labelIds.length + floorIds.length > 0;
    if (!hasIds) {
      scope = domains.length === 0
        ? "[]"
        : "(" + domains.map((d) => `(states.${d} | list)`).join(" + ") + ")";
    } else {
      const parts: string[] = [];
      for (const a of areaIds) parts.push(`area_entities(${quote(a)})`);
      for (const l of labelIds) parts.push(`label_entities(${quote(l)})`);
      if (floorIds.length > 0) {
        parts.push(
          `((${floorIds.map((f) => `floor_areas(${quote(f)})`).join(" + ")}) | map('area_entities') | sum(start=[]))`,
        );
      }
      scope = `(expand(${parts.join(" + ")})`;
      if (domains.length > 0) {
        scope += ` | selectattr('domain', 'in', [${domains.map(quote).join(", ")}])`;
      }
      scope += ")";
    }
  }
  return scope;
}

/** The clause an aggregate's state filter adds to its pipeline, or the empty
 * string for no filter.
 *
 * Spacing here is load-bearing: the expression string is hashed into the value
 * key, so a stray space would give Swift and the browser different keys for the
 * same aggregate. Match CustomComplicationCompiler.aggregateExpression exactly. */
function stateFilterClause(sf: AggregateStateFilter | undefined): string {
  if (!sf) return "";
  if (sf.kind === "isOn") return " | selectattr('state', 'eq', 'on')";
  if (sf.kind === "isOff") return " | selectattr('state', 'eq', 'off')";
  if (sf.kind === "equals") return ` | selectattr('state', 'eq', ${quote(sf.value)})`;
  return ` | rejectattr('state', 'eq', ${quote(sf.value)})`;
}

function aggregateExpression(spec: AggregateSpec): string {
  const pipeline = scopeExpression(spec) + stateFilterClause(spec.stateFilter);
  if (spec.function === "count") return `(${pipeline} | list | count)`;
  const attr = spec.attribute ? `attributes.${spec.attribute}` : "state";
  const numbers = `${pipeline} | map(attribute=${quote(attr)}) | map('float', 0) | list`;
  switch (spec.function) {
    case "sum": return `(${numbers} | sum)`;
    case "average": return `(${numbers} | average(0))`;
    case "min": return `(${numbers} | min(default=0))`;
    case "max": return `(${numbers} | max(default=0))`;
  }
}

// ── lists ─────────────────────────────────────────────────────────────────
// The three Jinja-backed sources compile to one expression each, keyed `e_`
// like any inline computed value, so the integration renders them with the
// rest of the value document and nothing new has to fetch anything. The text
// is pinned character for character against the app's compiler (the whole
// point of the key being a hash of it) and against
// `docs/custom_complication_list_layer.md`, "The Jinja, character for
// character". Never reformat it to taste: a stray space is a different key and
// a second row in every template cache.

/** The states that mean an entity is not reporting. Dropped from an entities
 * list unless the author asked for exactly one of them. */
const LIST_REJECT_MISSING = " | rejectattr('state', 'in', ['unavailable', 'unknown'])";

/** The one-line Jinja a list source renders through, or undefined for a
 * service-backed source (which is fetched, not rendered) and for a blank
 * template (which has nothing to render). */
export function listExpression(source: ListSource, rows: number): string | undefined {
  const cells = clampListRows(rows);
  switch (source.kind) {
    case "entities": {
      const sf = source.stateFilter;
      // An author who asked for exactly `unavailable` or `unknown` wants those
      // rows, so the reject clause that normally drops them is left out.
      const keepsMissing = sf?.kind === "equals" && (sf.value === "unavailable" || sf.value === "unknown");
      // The device class sits between the two, so a list narrowed to battery
      // sensors and one narrowed to doors read the same way round.
      const deviceClass = (source.deviceClass ?? "").trim();
      const classClause = deviceClass === ""
        ? ""
        : ` | selectattr('attributes.device_class', 'eq', ${quote(deviceClass)})`;
      const pipeline = `(${scopeExpression(source)})${keepsMissing ? "" : LIST_REJECT_MISSING}${classClause}${stateFilterClause(sf)}`;
      const attrs = source.attributes.map((name) => `, 'attr.${name}': s.attributes.get(${quote(name)})`).join("");
      const desc = source.descending ? "true" : "false";
      const sorted = source.sort === "state"
        ? `((ns.items | rejectattr('n', 'none') | sort(attribute='n', reverse=${desc}) | list) + (ns.items | selectattr('n', 'none') | sort(attribute='state', reverse=${desc}) | list))`
        : `(ns.items | sort(attribute='${source.sort === "lastChanged" ? "lastChanged" : "name"}', reverse=${desc}) | list)`;
      return "{% set ns = namespace(items=[]) %}"
        + `{% for s in ${pipeline} %}`
        + "{% set ns.items = ns.items + [{'entityId': s.entity_id, 'name': s.name[:120], 'state': s.state[:120],"
        + " 'unit': s.attributes.get('unit_of_measurement'), 'domain': s.domain,"
        + " 'deviceClass': s.attributes.get('device_class'), 'area': area_name(s.entity_id),"
        + " 'lastChanged': (as_timestamp(s.last_changed) | round(0)), 'n': (s.state | float(none))"
        + `${attrs}}] %}`
        + "{% endfor %}"
        + `{% set sorted = ${sorted} %}`
        + `{{ {'items': sorted[:${cells}], 'total': (sorted | count)} | to_json }}`;
    }
    case "attribute":
      return `{% set a = state_attr(${quote(source.entityId)}, ${quote(source.attribute)}) %}`
        + "{% if a is string or a is mapping or a is not iterable %}{% set a = [] %}{% endif %}"
        + "{% set a = a | list %}"
        + `{{ {'items': a[:${cells}], 'total': (a | count)} | to_json }}`;
    case "template": {
      // The author's text verbatim, exactly as the `jinja` value kind is
      // emitted, so a template that works in a text layer works here.
      const text = source.value.trim();
      return text.length === 0 ? undefined : text;
    }
    default:
      return undefined;
  }
}

/** The value-document key a Jinja-backed list reads its items out of, or
 * undefined for a service-backed source. */
export function listExpressionKey(source: ListSource, rows: number): string | undefined {
  const expr = listExpression(source, rows);
  return expr === undefined ? undefined : "e_" + fnv1a64Hex(expr);
}

/** The readable identity of one service-backed list, hashed to `l_<fnv1a64>`
 * on the watch and used as it stands by the panel's websocket request and the
 * reply it gets back. Undefined for a Jinja source, and for a source that
 * names no entity yet: there is nothing to ask for. */
export function listKey(source: ListSource): string | undefined {
  const ids = (refs: EntityRef[]) => refs.map((r) => r.entityId).filter((id) => id !== "");
  switch (source.kind) {
    case "calendar": {
      const list = ids(source.entities);
      return list.length === 0 ? undefined : `calendar|${list.join(",")}|${source.hours}`;
    }
    case "todo": {
      const list = ids(source.entities);
      return list.length === 0 ? undefined : `todo|${list.join(",")}|${source.status}|${source.sort}`;
    }
    case "forecast":
      return source.entityId === "" ? undefined : `forecast|${source.entityId}|${source.type}`;
    default:
      return undefined;
  }
}

/** The request body for one service-backed list, the same shape the panel's
 * `wrist_assistant/complications/list_items` command and the watch's signed
 * `op=list` both send. */
export function listRequestSpec(source: ListSource, rows: number): ListRequestSpec | undefined {
  const limit = clampListRows(rows);
  const ids = (refs: EntityRef[]) => refs.map((r) => r.entityId).filter((id) => id !== "");
  switch (source.kind) {
    case "calendar": {
      const entities = ids(source.entities);
      return entities.length === 0 ? undefined : { source: "calendar", entities, hours: source.hours, limit };
    }
    case "todo": {
      const entities = ids(source.entities);
      return entities.length === 0 ? undefined : { source: "todo", entities, status: source.status, sort: source.sort, limit };
    }
    case "forecast":
      return source.entityId === "" ? undefined : { source: "forecast", entity_id: source.entityId, type: source.type, limit };
    default:
      return undefined;
  }
}

/** Every list layer in the document, top-level only: a row template holds no
 * list, so there is nothing deeper to walk. */
function listElements(config: CustomComplicationConfig): ListElement[] {
  const out: ListElement[] = [];
  for (const el of config.elements) if (el.kind === "list") out.push(el.payload);
  return out;
}

/**
 * What the panel asks `wrist_assistant/complications/list_items` for: one
 * entry per distinct list identity, keyed by its readable form, which is the
 * key the reply comes back under and the key the resolver reads.
 *
 * Two lists of the same calendars drawing different numbers of rows share one
 * request at the larger limit, because the identity does not carry the limit:
 * the shorter list slices what comes back, and asking twice for the same
 * events would only cost a second service call.
 */
export function listRequests(config: CustomComplicationConfig): Map<string, ListRequestSpec> {
  const out = new Map<string, ListRequestSpec>();
  for (const list of listElements(config)) {
    const key = listKey(list.source);
    const spec = listRequestSpec(list.source, list.rows);
    if (key === undefined || spec === undefined) continue;
    const known = out.get(key);
    if (known === undefined) out.set(key, spec);
    else if (spec.limit > known.limit) out.set(key, { ...known, limit: spec.limit });
  }
  return new Map([...out.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}

/** Jinja expression for a computed kind; undefined for local kinds or blank Jinja. */
export function expression(kind: ValueKind): string | undefined {
  switch (kind.kind) {
    case "entityAttribute":
      return `state_attr(${quote(kind.entityId)}, ${quote(kind.attribute)})`;
    case "entityAge": {
      const id = quote(kind.entityId);
      return `(((now() - states[${id}].last_changed).total_seconds() if states[${id}] is not none else 0) | round(0))`;
    }
    case "time":
      switch (kind.timeField) {
        case "now": return "now().strftime('%H:%M')";
        case "hour": return "now().hour";
        case "minute": return "now().minute";
        case "day": return "now().day";
        case "month": return "now().month";
        case "weekday": return "now().weekday()";
        case "timestamp": return "(as_timestamp(now()) | round(0))";
      }
      return undefined;
    case "jinja":
      return kind.value.trim().length === 0 ? undefined : kind.value;
    case "aggregate":
      return aggregateExpression(kind.aggregate);
    default:
      return undefined;
  }
}

// ── compile ───────────────────────────────────────────────────────────────

export function compile(config: CustomComplicationConfig): Compiled {
  const entities = new Map<string, EntityRef>();
  const expressions = new Map<string, string>();
  const lookup = namedLookup(config.values);

  const visit = (value: Value, depth = 0) => {
    const kind = value.kind;
    switch (kind.kind) {
      case "literal":
      case "dataAge":
      case "chartStat":
      case "item":
      case "listStat":
      case "imageTime":
        // A chart stat reads a chart layer that registers its own sources, and
        // both list kinds read a list that registers its own the same way. A
        // picture's time is when the watch fetched it: nothing to ask for.
        return;
      case "entityState":
        entities.set(kind.entityId, kind);
        return;
      case "named": {
        if (depth > 8) return;
        const target = lookup.get(kind.id.toUpperCase());
        if (!target) return;
        if (target.kind.kind === "named") {
          visit(target, depth + 1);
          return;
        }
        if (target.kind.kind === "entityState") {
          entities.set(target.kind.entityId, target.kind);
          return;
        }
        const expr = expression(target.kind);
        if (expr === undefined) return;
        expressions.set("n_" + kind.id.toLowerCase().replace(/-/g, ""), expr);
        return;
      }
      default: {
        const expr = expression(kind);
        if (expr === undefined) return;
        expressions.set("e_" + fnv1a64Hex(expr), expr);
      }
    }
  };

  /** One layer's values, and for a list its source expression and every layer
   * of its row. A row layer is fetched exactly like a layer of the document:
   * its text may read an entity, its rules may test one, and nothing else
   * would ask for them. An `item` or `listStat` value adds nothing, because
   * both are read back locally from the list the resolver already settled. */
  const visitElement = (el: Element) => {
    const primary = primaryValue(el);
    if (primary) visit(primary);
    // A rich text layer draws its parts, and its value is only the fallback
    // an older watch shows, so every part is fetched. Walked even under a
    // countdown, which ignores parts, so flipping that switch never changes
    // what the watch is asked to fetch.
    if (el.kind === "text") for (const part of el.payload.parts ?? []) visit(part.value);
    // A dot gauge's total is an ordinary value, so it is fetched like one. The
    // usual pairing, a filtered count and the same count unfiltered, dedupes to
    // two lines of one template document and no extra request.
    if (el.kind === "gauge" && el.payload.total) visit(el.payload.total);
    // The ends of a gauge's range can follow entities too, and the watch only
    // fetches what lands here, so they are visited like the reading.
    if (el.kind === "gauge" && el.payload.minSource) visit(el.payload.minSource);
    if (el.kind === "gauge" && el.payload.maxSource) visit(el.payload.maxSource);
    // A chart's "now" marker is an ordinary value, so it is fetched like one.
    // Usually the built-in Hour, which costs a line of the template document
    // and no request at all.
    if (el.kind === "chart" && el.payload.nowIndex) visit(el.payload.nowIndex);
    // An icon or a shape that fills by value reads an ordinary value, and the
    // ends of its scale can follow entities the way a gauge's do. Nothing else
    // fetches them, so a fill whose entity was never walked would sit empty.
    if (el.kind === "icon" || el.kind === "shape") {
      const level = el.payload.level;
      if (level) {
        visit(level.value);
        if (level.minSource) visit(level.minSource);
        if (level.maxSource) visit(level.maxSource);
      }
    }
    if (el.kind === "list") {
      const expr = listExpression(el.payload.source, el.payload.rows);
      if (expr !== undefined) expressions.set("e_" + fnv1a64Hex(expr), expr);
      for (const row of el.payload.template) visitElement(row);
    }
    for (const v of ruleValues(el.payload.rules)) visit(v);
  };

  for (const named of config.values) visit({ kind: { kind: "named", id: named.id } });
  for (const el of config.elements) visitElement(el);
  // Only the shapes the document supports: a layout left behind by a removed
  // shape must not cost a fetch (supportedFamilies is authoritative since
  // schema 6). Mirrors CustomComplicationCompiler.compile in the app.
  for (const family of DRAWABLE_FAMILIES) {
    if (!config.supportedFamilies.includes(family)) continue;
    const layout = config.perFamily[family];
    if (!layout) continue;
    if (layout.bezelText) visit(layout.bezelText);
    if (layout.curvedText) visit(layout.curvedText);
    if (layout.bezelGauge) {
      visit(layout.bezelGauge.value);
      if (layout.bezelGauge.minLabel) visit(layout.bezelGauge.minLabel);
      if (layout.bezelGauge.maxLabel) visit(layout.bezelGauge.maxLabel);
    }
    for (const v of ruleValues(layout.rules)) visit(v);
  }
  if (config.supportedFamilies.includes("inline") && config.inline) visit(config.inline.value);
  // The Control Center control, if the document carries one. No shape gate: a
  // control is not a shape, and the device draws it whichever shapes the
  // document lists. Nothing else fetches these, so a control whose title reads
  // an entity would sit on "--" for ever without this. Its action is not
  // visited, for the same reason a tap action is not: firing it needs no state.
  const control = config.control;
  if (control) {
    visit(control.title);
    if (control.valueLabel) visit(control.valueLabel);
    if (control.state) visit(control.state);
    if (control.status) visit(control.status);
  }

  const compiled: Compiled = { entities, expressions };
  if (expressions.size > 0) compiled.document = buildDocument(expressions);
  return compiled;
}

export function buildDocument(expressions: Map<string, string>): string {
  const keys = [...expressions.keys()].sort();
  const lines: string[] = [];
  for (const key of keys) {
    const expr = expressions.get(key)!;
    if (expr.includes("{{") || expr.includes("{%")) {
      lines.push(`{% set v_${key} %}${expr}{% endset %}`);
    } else {
      lines.push(`{% set v_${key} = ${expr} %}`);
    }
  }
  const dict = keys.map((k) => `"${k}": v_${k}`).join(", ");
  lines.push(`{{ { ${dict} } | to_json }}`);
  return lines.join("\n");
}

// ── response parsing ──────────────────────────────────────────────────────

export interface ValueDocument {
  values: Map<string, string>;
  nullKeys: Set<string>;
}

/** Mirror of `parseValueDocument`: only a JSON object counts as a render. */
export function parseValueDocument(text: string): ValueDocument | undefined {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return undefined;
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return undefined;
  const values = new Map<string, string>();
  const nullKeys = new Set<string>();
  for (const [key, raw] of Object.entries(parsed as Record<string, unknown>)) {
    if (raw === null) nullKeys.add(key);
    else values.set(key, normaliseScalar(raw));
  }
  return { values, nullKeys };
}

export function normaliseScalar(raw: unknown): string {
  if (typeof raw === "string") return raw;
  if (typeof raw === "boolean") return raw ? "true" : "false";
  if (typeof raw === "number") {
    if (Number.isInteger(raw) && Math.abs(raw) < 1e15) return String(raw);
    return String(raw);
  }
  return JSON.stringify(raw);
}

/** What the phone editor stores in `dataSources` on save (schema §6.1):
 * entities sorted by id, then at most one template holding the document. */
export function deriveDataSources(config: CustomComplicationConfig): DataSource[] {
  const compiled = compile(config);
  const out: DataSource[] = [...compiled.entities.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([, ref]) => ({
      kind: "entity",
      entityId: ref.entityId,
      displayName: ref.displayName,
      domain: ref.domain,
      ...(ref.iconName !== undefined ? { iconName: ref.iconName } : {}),
    }));
  if (compiled.document) out.push({ kind: "template", value: compiled.document });
  // The service-backed lists last, one per distinct identity and in key order,
  // the place statistics sources take in the app's own list. Nothing fetches
  // these from the panel (it has the websocket command); they are here so the
  // watch and the widget know what to ask for.
  for (const spec of listRequests(config).values()) out.push({ kind: "list", ...spec });
  return out;
}
