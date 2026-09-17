// Demo mode: the preview standing in for the watch rather than for the design
// surface. The face is drawn as the watch draws it, and a click is a finger.
//
// Two jobs live here, both away from the panel so they can be tested without a
// browser. The first is the hit test: which tap a point lands on, by the watch's
// own rule that the topmost tap wins and everything else falls through to the
// document's whole-complication action. The second is running what that tap
// says, which for some actions means really calling Home Assistant and for the
// rest means saying what the watch would have done, because the panel has no
// watch app to open and no watch-local timer to start.

import {
  type CustomComplicationConfig,
  type NormalizedFrame,
  type TapAction,
  describeTapAction,
  serviceDataIsValid,
} from "./model.js";
import type { HassLike } from "./ha-api.js";
import { callService } from "./ha-api.js";
import type { ResolvedElement, ResolvedLayout, ResolvedTap } from "./resolver.js";

/** A point on the face, as fractions of the canvas. 0,0 is its top left. */
export interface FacePoint {
  x: number;
  y: number;
}

/** Whether a frame holds a point. Edges count as inside, the way a finger on
 * the very edge of a button still presses it. */
function holds(frame: NormalizedFrame, p: FacePoint): boolean {
  return p.x >= frame.x && p.x <= frame.x + frame.width
    && p.y >= frame.y && p.y <= frame.y + frame.height;
}

/**
 * The tap under a point, or undefined when the point misses every one.
 *
 * Elements are walked last to first because the last one drawn is the one on
 * top, and on the watch the topmost button is the one the finger reaches. A
 * hidden layer is skipped: the watch never draws it, so it is never a button
 * either. A list is looked into rather than through, since a row tap is a real
 * target repeated once per row, and the point is remapped into the row's own
 * box first because a row layer's frame is a fraction of its cell, not of the
 * face.
 */
export function tapAt(layout: ResolvedLayout, p: FacePoint): ResolvedTap | undefined {
  return tapIn(layout.elements, p);
}

function tapIn(elements: readonly ResolvedElement[], p: FacePoint): ResolvedTap | undefined {
  for (let i = elements.length - 1; i >= 0; i--) {
    const el = elements[i];
    if (!el || el.isHidden) continue;
    if (el.kind === "tap") {
      if (holds(el.frame, p)) return el;
      continue;
    }
    if (el.kind !== "list") continue;
    if (!holds(el.frame, p)) continue;
    for (let c = el.cells.length - 1; c >= 0; c--) {
      const cell = el.cells[c];
      if (!cell) continue;
      const w = cell.frame.width * el.frame.width;
      const h = cell.frame.height * el.frame.height;
      if (w <= 0 || h <= 0) continue;
      const inner: FacePoint = {
        x: (p.x - (el.frame.x + cell.frame.x * el.frame.width)) / w,
        y: (p.y - (el.frame.y + cell.frame.y * el.frame.height)) / h,
      };
      if (inner.x < 0 || inner.x > 1 || inner.y < 0 || inner.y > 1) continue;
      const hit = tapIn(cell.elements, inner);
      if (hit) return hit;
    }
  }
  return undefined;
}

/**
 * The action a click runs: the tap under the point, or the document's
 * whole-complication action when the point lands on bare face. The same
 * fallback the watch applies, and the reason a face with no tap layers at all
 * still does something when you press it.
 */
export function actionAt(
  cfg: CustomComplicationConfig,
  layout: ResolvedLayout,
  p: FacePoint,
): { action: TapAction; tapId?: string } {
  const hit = tapAt(layout, p);
  if (hit) return { action: hit.action, tapId: hit.id };
  return { action: cfg.tapAction };
}

/**
 * What a demo tap did.
 *
 * `did` is a thing that really happened, in Home Assistant or on the face.
 * `would` is the watch's half of the job, which the panel cannot do: opening
 * the app, starting a watch-local timer, asking for to-do text. Saying so is
 * more honest than pretending, and it still answers "what is this tap wired
 * to?", which is what the demo is for.
 */
export type DemoOutcome =
  | { kind: "did"; text: string }
  | { kind: "would"; text: string }
  | { kind: "failed"; text: string }
  | { kind: "none"; text: string };

/** What the panel lends the runner: the connection for real service calls, and
 * the three face moves, each answering whether it had anything to move. */
export interface DemoHooks {
  hass: HassLike;
  /** Re-read templates, history and list items, the way a refresh tap makes
   * the watch fetch again. */
  refresh: () => void;
  /** One page on or back, wrapping. False when the document has one page. */
  stepPage: (by: 1 | -1) => boolean;
  /** Play every page once. False when the document has no tour to play. */
  playTour: () => boolean;
}

/** The entity id's domain: everything before the first dot. */
function domainOf(entityId: string): string {
  const dot = entityId.indexOf(".");
  return dot > 0 ? entityId.slice(0, dot) : "";
}

/**
 * Run one tap action as far as a browser can.
 *
 * The service calls mirror the widget intents in the app: a toggle is the
 * entity's own domain `toggle`, a scene is `scene.turn_on`, a script is
 * `script.turn_on`, and a raw call goes exactly as the author typed it. That
 * matters more than it looks: a demo that toggled a light some other way would
 * pass while the watch failed.
 */
export async function runTapAction(action: TapAction, hooks: DemoHooks): Promise<DemoOutcome> {
  switch (action.type) {
    case "none":
      return { kind: "none", text: "Nothing. This tap is wired to do nothing." };
    case "refresh":
      hooks.refresh();
      return { kind: "did", text: "Refreshed this complication." };
    case "refreshAll":
      // The panel has one document open, so the extra targets are named rather
      // than fetched: they are other complications, which live on the watch.
      hooks.refresh();
      return {
        kind: "did",
        text: action.allPlaced === true
          ? "Refreshed this complication. On the watch, every placed complication refreshes too."
          : `Refreshed this complication.${(action.targets?.length ?? 0) > 0 ? ` On the watch, ${action.targets?.length} more would refresh too.` : ""}`,
      };
    case "nextPage":
      return hooks.stepPage(1)
        ? { kind: "did", text: "Next page." }
        : { kind: "none", text: "No next page: this complication has one page." };
    case "previousPage":
      return hooks.stepPage(-1)
        ? { kind: "did", text: "Previous page." }
        : { kind: "none", text: "No previous page: this complication has one page." };
    case "playTour":
      return hooks.playTour()
        ? { kind: "did", text: "Playing the page tour." }
        : { kind: "none", text: "No tour to play: this complication has no page tour." };
    case "openApp":
      return { kind: "would", text: "The watch would open the Wrist Assistant app." };
    case "openPage":
      return { kind: "would", text: "The watch would open its page." };
    case "openRoomPage":
      return { kind: "would", text: "The watch would open the room page." };
    case "timerStartPause":
      return { kind: "would", text: "The watch would start or pause its timer. The timer lives on the watch." };
    case "timerCancel":
      return { kind: "would", text: "The watch would cancel its timer. The timer lives on the watch." };
    case "addTodo":
      return { kind: "would", text: `The watch would ask for the text, then add it to ${action.displayName || action.entityId}.` };
    case "runHTTPAction":
      return { kind: "would", text: `The watch would run the HTTP action ${action.displayName || action.entityId}. HTTP actions are kept in the app.` };
    case "toggleEntity":
      return await fire(hooks, domainOf(action.entityId), "toggle", { entity_id: action.entityId },
        `Toggled ${action.displayName || action.entityId}.`);
    case "runScene":
      return await fire(hooks, "scene", "turn_on", { entity_id: action.entityId },
        `Ran the scene ${action.displayName || action.entityId}.`);
    case "runScript":
      return await fire(hooks, "script", "turn_on", { entity_id: action.entityId },
        `Ran the script ${action.displayName || action.entityId}.`);
    case "callService": {
      const domain = action.serviceDomain.trim();
      const service = action.serviceName.trim();
      if (domain === "" || service === "") {
        return { kind: "failed", text: "This tap has no service to call yet." };
      }
      // The watch parses the data string at fire time and refuses to fire when
      // it is not an object, so the demo refuses in the same place rather than
      // sending something Home Assistant would reject.
      if (!serviceDataIsValid(action.serviceDataJSON)) {
        return { kind: "failed", text: "The service data is not a JSON object, so the watch would not fire this either." };
      }
      const raw = (action.serviceDataJSON ?? "").trim();
      const data = raw === "" ? {} : (JSON.parse(raw) as Record<string, unknown>);
      const target = action.target?.entityId;
      const payload = target !== undefined && target !== "" ? { entity_id: target, ...data } : data;
      return await fire(hooks, domain, service, payload, `Called ${domain}.${service}.`);
    }
  }
}

/** One service call, with the failure turned into a line rather than a throw:
 * a demo that stopped dead on a bad entity would tell you less than one that
 * says what Home Assistant said. */
async function fire(
  hooks: DemoHooks,
  domain: string,
  service: string,
  data: Record<string, unknown>,
  done: string,
): Promise<DemoOutcome> {
  if (domain === "") return { kind: "failed", text: "That entity id has no domain, so there is no service to call." };
  try {
    await callService(hooks.hass, domain, service, data);
    return { kind: "did", text: done };
  } catch (err) {
    const why = err instanceof Error ? err.message : String(err);
    return { kind: "failed", text: `${domain}.${service} failed: ${why}` };
  }
}

/** The one-line label the demo shows before a tap is tried: the same sentence
 * the review mode labels a tap box with. */
export function demoTapLabel(action: TapAction): string {
  return describeTapAction(action);
}
