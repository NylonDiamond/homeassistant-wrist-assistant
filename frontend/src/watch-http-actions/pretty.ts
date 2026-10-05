/** Formatting of a test answer's body for the response pane. Pure: no DOM. */

export type JsonPieceKind = "key" | "str" | "num" | "lit" | "punct" | "ws" | "var";
export interface JsonPiece {
  kind: JsonPieceKind;
  text: string;
  /** On a value that is not a list or an object: the JSON path to it, keys
   * joined by dots and a number for an item of a list. */
  path?: string;
}

const TOKEN = /"(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|[{}[\],:]/g;

/** The body as indented JSON, in coloured pieces, or undefined when it is
 * not JSON. Every value keeps the characters the server sent (a long number
 * is not rounded, an escape is not rewritten); only the white space between
 * values changes. */
export function prettyJson(text: string, indent = 2): JsonPiece[] | undefined {
  const trimmed = text.trim();
  if (trimmed === "") return undefined;
  try {
    JSON.parse(trimmed);
  } catch {
    return undefined;
  }
  return layout(trimmed.match(TOKEN) ?? [], indent);
}

function layout(tokens: readonly string[], indent: number): JsonPiece[] {
  const out: JsonPiece[] = [];
  let depth = 0;
  const line = () => out.push({ kind: "ws", text: `\n${" ".repeat(depth * indent)}` });
  // Where the walk is: one frame per open object (its key in hand) or list
  // (the index of the item in hand).
  const frames: { key?: string; index?: number }[] = [];
  const path = () => frames.map((f) => f.key ?? String(f.index ?? 0)).join(".");
  const leaf = (kind: JsonPieceKind, text: string) => out.push(frames.length === 0 ? { kind, text } : { kind, text, path: path() });
  for (let i = 0; i < tokens.length; i += 1) {
    const t = tokens[i]!;
    const next = tokens[i + 1];
    if (t.startsWith("{{")) {
      out.push({ kind: "var", text: t });
    } else if (t === "{" || t === "[") {
      const close = t === "{" ? "}" : "]";
      if (next === close) {
        out.push({ kind: "punct", text: t + close });
        i += 1;
      } else {
        out.push({ kind: "punct", text: t });
        frames.push(t === "[" ? { index: 0 } : {});
        depth += 1;
        line();
      }
    } else if (t === "}" || t === "]") {
      frames.pop();
      depth = Math.max(0, depth - 1);
      line();
      out.push({ kind: "punct", text: t });
    } else if (t === ",") {
      const top = frames[frames.length - 1];
      if (top?.index !== undefined) top.index += 1;
      out.push({ kind: "punct", text: t });
      line();
    } else if (t === ":") {
      out.push({ kind: "punct", text: ": " });
    } else if (t.startsWith('"')) {
      if (next === ":") {
        const top = frames[frames.length - 1];
        if (top !== undefined) {
          try {
            top.key = String(JSON.parse(t));
          } catch {
            top.key = t.slice(1, -1);
          }
        }
        out.push({ kind: "key", text: t });
      } else leaf("str", t);
    } else if (t === "true" || t === "false" || t === "null") {
      leaf("lit", t);
    } else {
      leaf("num", t);
    }
  }
  return out;
}

const VAR = /\{\{[A-Za-z0-9_]+\}\}/g;
/** As TOKEN, and a {{key}} is one value, and a text still being typed (no
 * closing quote yet) is one token to the end of its line. */
const LOOSE = /\{\{[A-Za-z0-9_]+\}\}|"(?:[^"\\\n]|\\.)*"?|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\btrue\b|\bfalse\b|\bnull\b|[{}[\],:]/g;

/** A request body of JSON indented, or undefined when it is not JSON. A
 * {{key}} may stand where a value goes (`{"n": {{count}}}`), which is not
 * JSON until it is filled in; it is kept as typed. */
export function formatJsonBody(text: string, indent = 2): string | undefined {
  const trimmed = text.trim();
  if (trimmed === "") return undefined;
  const tokens: string[] = [];
  let probe = "";
  let at = 0;
  for (const m of trimmed.matchAll(LOOSE)) {
    if (trimmed.slice(at, m.index).trim() !== "") return undefined;
    tokens.push(m[0]);
    probe += m[0].startsWith("{{") ? "0" : m[0];
    at = m.index + m[0].length;
  }
  if (trimmed.slice(at).trim() !== "") return undefined;
  try {
    JSON.parse(probe);
  } catch {
    return undefined;
  }
  return piecesText(layout(tokens, indent));
}

/** The text exactly as typed, cut into colored pieces: JSON tokens when
 * `json`, and every {{key}} either way. Joined, the pieces are the text. */
export function colorBody(text: string, json: boolean): JsonPiece[] {
  const out: JsonPiece[] = [];
  let at = 0;
  const matches = [...text.matchAll(json ? LOOSE : VAR)];
  matches.forEach((m, i) => {
    if (m.index > at) out.push({ kind: "ws", text: text.slice(at, m.index) });
    const t = m[0];
    at = m.index + t.length;
    let kind: JsonPieceKind;
    if (t.startsWith("{{")) kind = "var";
    else if (t.startsWith('"')) {
      const next = matches[i + 1];
      kind = next !== undefined && next[0] === ":" && text.slice(at, next.index).trim() === "" ? "key" : "str";
    } else if (t === "true" || t === "false" || t === "null") kind = "lit";
    else if (/^[{}[\],:]$/.test(t)) kind = "punct";
    else kind = "num";
    out.push({ kind, text: t });
  });
  if (at < text.length) out.push({ kind: "ws", text: text.slice(at) });
  return out;
}

/** The pieces as one string, for Copy. */
export function piecesText(pieces: readonly JsonPiece[]): string {
  return pieces.map((p) => p.text).join("");
}

/** A byte count in words: "812 bytes", "1.6 KB", "0.25 MB". */
export function sizeText(bytes: number): string {
  if (bytes < 1024) return `${bytes} ${bytes === 1 ? "byte" : "bytes"}`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
