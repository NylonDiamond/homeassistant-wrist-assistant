/** Formatting of a test answer's body for the response pane. Pure: no DOM. */

export type JsonPieceKind = "key" | "str" | "num" | "lit" | "punct" | "ws";
export interface JsonPiece {
  kind: JsonPieceKind;
  text: string;
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
  const tokens = trimmed.match(TOKEN) ?? [];
  const out: JsonPiece[] = [];
  let depth = 0;
  const line = () => out.push({ kind: "ws", text: `\n${" ".repeat(depth * indent)}` });
  for (let i = 0; i < tokens.length; i += 1) {
    const t = tokens[i]!;
    const next = tokens[i + 1];
    if (t === "{" || t === "[") {
      const close = t === "{" ? "}" : "]";
      if (next === close) {
        out.push({ kind: "punct", text: t + close });
        i += 1;
      } else {
        out.push({ kind: "punct", text: t });
        depth += 1;
        line();
      }
    } else if (t === "}" || t === "]") {
      depth = Math.max(0, depth - 1);
      line();
      out.push({ kind: "punct", text: t });
    } else if (t === ",") {
      out.push({ kind: "punct", text: t });
      line();
    } else if (t === ":") {
      out.push({ kind: "punct", text: ": " });
    } else if (t.startsWith('"')) {
      out.push({ kind: next === ":" ? "key" : "str", text: t });
    } else if (t === "true" || t === "false" || t === "null") {
      out.push({ kind: "lit", text: t });
    } else {
      out.push({ kind: "num", text: t });
    }
  }
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
