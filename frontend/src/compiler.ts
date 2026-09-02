// Port of Shared/CustomComplicationCompiler.swift: turns one config into the
// entity fetch list plus a single Jinja document whose keys are stable per
// value. The keys MUST match Swift byte for byte, because the phone and the
// watch key their cache the same way (docs/custom_complication_schema_v4.md §6).

import {
  type AggregateSpec,
  type CustomComplicationConfig,
  type DataSource,
  type EntityRef,
  type NamedValue,
  type Value,
  type ValueKind,
  DRAWABLE_FAMILIES,
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

function aggregateExpression(spec: AggregateSpec): string {
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
  let pipeline = scope;
  const sf = spec.stateFilter;
  if (sf) {
    // Spacing here is load-bearing: the expression string is hashed into the value
    // key, so a stray space would give Swift and the browser different keys for the
    // same aggregate. Match CustomComplicationCompiler.aggregateExpression exactly.
    if (sf.kind === "isOn") pipeline += " | selectattr('state', 'eq', 'on')";
    else if (sf.kind === "isOff") pipeline += " | selectattr('state', 'eq', 'off')";
    else if (sf.kind === "equals") pipeline += ` | selectattr('state', 'eq', ${quote(sf.value)})`;
    else pipeline += ` | rejectattr('state', 'eq', ${quote(sf.value)})`;
  }
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

  for (const named of config.values) visit({ kind: { kind: "named", id: named.id } });
  for (const el of config.elements) {
    const primary = primaryValue(el);
    if (primary) visit(primary);
    for (const v of ruleValues(el.payload.rules)) visit(v);
  }
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
  return out;
}
