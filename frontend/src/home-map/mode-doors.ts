// The edit page's doors (`edit-page.ts`, which uses this part): how rooms
// scanned one at a time come together.
//
// A door between two rooms is scanned from each, so doors say where rooms
// belong. On the plan a door with no partner has an amber dot and two that
// meet a green one (`door-pairs.ts`). A click on an amber door, on the plan or
// in 3D, starts Connect: the doors it could open to turn blue with their room
// names, and a click on one moves its room there, turned if it must be
// (`connectDoors`). Escape, or a click anywhere else, stops it.
//
// The Fit rooms card stands on top of the side panel whatever is picked: how
// many doors meet and the one thing to do next, the move the doors point to
// when there is one (`homeMapFitOf`), with Show me, which draws it live and
// saves nothing, and what the scan check still finds (`homeMapFitIssues`).

import { type SVGTemplateResult, type TemplateResult, html, nothing, svg } from "lit";
import { type HomeMapDoor, homeMapDoorChoices, homeMapDoorPairs, homeMapDoorPartner, homeMapOpenDoors } from "./door-pairs.js";
import { type HomeMapFit, connectDoors, fitAllIssues, fitRooms, homeMapFitIssues, homeMapFitOf } from "./edit-ops.js";
import type { HomeMapEditorContext } from "./editor-mode.js";
import { homeMapCount, homeMapMeters, homeMapShortcut } from "./editor-view.js";
import { type HomeMapFloor, type HomeMapRoom, type HomePoint, homeMapRoomName, sameHomeMapId } from "./model.js";

const fmt = (v: number) => v.toFixed(1);

/** How near a door a press must land to connect to it, in pixels. */
const CHOICE_REACH = 18;

/** The floor as saved, with no drag's preview on it. */
function savedFloor(ctx: HomeMapEditorContext): HomeMapFloor {
  return ctx.doc.floors.find((f) => sameHomeMapId(f.id, ctx.floor.id)) ?? ctx.floor;
}

/** A list of names in words: "A", "A and B", "A, B and C". */
function namesInWords(names: readonly string[]): string {
  return names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/** Which way a move goes on the plan, by its longer side. */
function wayOf(dx: number, dy: number): string {
  return Math.abs(dy) >= Math.abs(dx) ? (dy > 0 ? "down" : "up") : (dx > 0 ? "right" : "left");
}

/** What Fit rooms offers, in words. */
export function homeMapFitWords(fit: HomeMapFit, floor: HomeMapFloor): string {
  const names = fit.moves.flatMap((m) => {
    const room = floor.rooms.find((r) => sameHomeMapId(r.id, m.roomId));
    return room === undefined ? [] : [homeMapRoomName(room)];
  });
  const first = fit.moves[0];
  const far = first === undefined ? 0 : Math.hypot(first.dx, first.dy);
  const way = first === undefined ? "" : wayOf(first.dx, first.dy);
  const doors = fit.after === fit.doors ? `all ${fit.doors} doors meet` : `${fit.after} of ${fit.doors} doors meet`;
  return `Move ${namesInWords(names)} ${homeMapMeters(far)} ${way}: ${doors}.`;
}

export class DoorMode {
  /** The door Connect started from. */
  connecting: { roomId: string; opening: number } | undefined;
  /** Show me: Fit rooms' move drawn as a preview. */
  private showing = false;

  /** Whether Connect is on. */
  get active(): boolean {
    return this.connecting !== undefined;
  }

  /** Stop Show me, its move no longer drawn. */
  endShow(ctx: HomeMapEditorContext): void {
    if (this.showing) ctx.preview(undefined);
    this.showing = false;
  }

  /** Stop Connect, and Show me. */
  stop(ctx: HomeMapEditorContext): void {
    this.endShow(ctx);
    this.connecting = undefined;
  }

  /** The doors Connect offers now. */
  private choices(ctx: HomeMapEditorContext): HomeMapDoor[] {
    if (this.connecting === undefined) return [];
    const pairs = homeMapDoorPairs(ctx.floor);
    const door = pairs.doors.find((d) => sameHomeMapId(d.roomId, this.connecting!.roomId) && d.index === this.connecting!.opening);
    return door === undefined ? [] : homeMapDoorChoices(pairs, door);
  }

  /** A click on a door, on the plan or in 3D: one with no partner starts
   * Connect, on a floor with a door to connect it to. */
  clicked(ctx: HomeMapEditorContext, roomId: string, opening: number): void {
    const pairs = homeMapDoorPairs(ctx.floor);
    const door = pairs.doors.find((d) => sameHomeMapId(d.roomId, roomId) && d.index === opening);
    if (door === undefined || homeMapDoorPartner(pairs, roomId, opening) !== undefined) return;
    if (homeMapDoorChoices(pairs, door).length > 0) this.start(ctx, roomId, opening);
  }

  /** Start Connect from a door. */
  start(ctx: HomeMapEditorContext, roomId: string, opening: number): void {
    this.connecting = { roomId, opening };
    ctx.select({ kind: "opening", roomId, opening });
    ctx.redraw();
  }

  /** Connect the door it started from to this one, its room moving. */
  connect(ctx: HomeMapEditorContext, roomId: string, opening: number): boolean {
    const from = this.connecting;
    if (from === undefined) return false;
    this.connecting = undefined;
    if (ctx.apply((d) => connectDoors(d, from.roomId, from.opening, roomId, opening), { select: { kind: "room", roomId: from.roomId } })) return true;
    ctx.note("err", "Those two doors cannot be connected.");
    return true;
  }

  /** A pick of a door in 3D while Connect is on: true when it took it. */
  pickDoor(ctx: HomeMapEditorContext, roomId: string, opening: number): boolean {
    if (this.connecting === undefined) return false;
    if (this.choices(ctx).some((d) => sameHomeMapId(d.roomId, roomId) && d.index === opening)) return this.connect(ctx, roomId, opening);
    this.connecting = undefined;
    return false;
  }

  /** A press on the plan while Connect is on: on a door it offers, connects;
   * anywhere else, stops and lets the press do what it does. */
  pointerDown(ctx: HomeMapEditorContext, at: HomePoint): boolean {
    const s = ctx.toScreen(at);
    let best: { door: HomeMapDoor; d: number } | undefined;
    for (const door of this.choices(ctx)) {
      const m = ctx.toScreen(door.mid);
      const d = Math.hypot(m[0] - s[0], m[1] - s[1]);
      if (d <= CHOICE_REACH && (best === undefined || d < best.d)) best = { door, d };
    }
    if (best !== undefined) return this.connect(ctx, best.door.roomId, best.door.index);
    this.connecting = undefined;
    return false;
  }

  /** Escape stops Connect. */
  keyDown(ctx: HomeMapEditorContext, e: KeyboardEvent): boolean {
    if (this.connecting === undefined || homeMapShortcut(e, false) !== "cancel") return false;
    this.connecting = undefined;
    ctx.redraw();
    return true;
  }

  /** The pill while Connect is on. */
  pill(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    const from = this.connecting;
    if (from === undefined) return nothing;
    const room = ctx.floor.rooms.find((r) => sameHomeMapId(r.id, from.roomId));
    return html`<span class="hme-pill-name">Click the door that ${room === undefined ? "it" : homeMapRoomName(room)} opens to</span>
      <button type="button" class="hme-tb" @click=${() => { this.connecting = undefined; ctx.redraw(); }}>Cancel</button>`;
  }

  // ── the plan ───────────────────────────────────────────────────────────

  /** A dot on each door, or while Connect is on the doors it offers. */
  overlay(ctx: HomeMapEditorContext): SVGTemplateResult | typeof nothing {
    const pairs = homeMapDoorPairs(ctx.floor);
    if (pairs.doors.length === 0 || ctx.floor.rooms.length < 2) return nothing;
    const choices = this.choices(ctx);
    const marks: SVGTemplateResult[] = [];
    const drawn = new Set<HomeMapDoor>();
    for (const door of pairs.doors) {
      const [x, y] = ctx.toScreen(door.mid);
      const partner = homeMapDoorPartner(pairs, door.roomId, door.index);
      if (choices.includes(door)) continue;
      if (partner === undefined) {
        const from = this.connecting !== undefined && sameHomeMapId(door.roomId, this.connecting.roomId) && door.index === this.connecting.opening;
        if (!from) marks.push(svg`<circle class="hme-door-open" cx=${fmt(x)} cy=${fmt(y)} r="6" fill="#ffb340" stroke="#2a1a00" stroke-width="1"><title>No partner yet. Click to connect it.</title></circle>`);
      } else if (!drawn.has(partner)) {
        drawn.add(door);
        marks.push(svg`<circle class="hme-door-met" cx=${fmt(x)} cy=${fmt(y)} r="4" fill="#30d158" />`);
      }
    }
    const offers = choices.map((door) => {
      const [x, y] = ctx.toScreen(door.mid);
      const room = ctx.floor.rooms.find((r) => sameHomeMapId(r.id, door.roomId));
      const name = room === undefined ? "" : homeMapRoomName(room);
      const w = name.length * 6.4 + 16;
      return svg`<g class="hme-door-choice"><circle cx=${fmt(x)} cy=${fmt(y)} r="9" fill="#5b8def" stroke="#fff" stroke-width="2" />
        <g class="hme-tag"><rect x=${fmt(x - w / 2)} y=${fmt(y - 34)} width=${fmt(w)} height="20" rx="10" fill="#5b8def" />
        <text x=${fmt(x)} y=${fmt(y - 20)} fill="#fff" text-anchor="middle">${name}</text></g></g>`;
    });
    return svg`<g class="hme-doors" pointer-events="none">${marks}${offers}</g>`;
  }

  // ── the side panel ─────────────────────────────────────────────────────

  /** Fit rooms: how many doors meet, the next thing to do, and what the scan
   * check still finds. Nothing on a floor with no doors and nothing to fix,
   * or with one room. */
  fitCard(ctx: HomeMapEditorContext): TemplateResult | typeof nothing {
    const floor = savedFloor(ctx);
    if (floor.rooms.length < 2) return nothing;
    const pairs = homeMapDoorPairs(floor);
    const issues = homeMapFitIssues(floor);
    const total = pairs.doors.length;
    if (total === 0 && issues.length === 0) return nothing;
    const fit = homeMapFitOf(floor);
    const open = homeMapOpenDoors(pairs).length;
    const moves = fit?.moves ?? [];
    const flipShow = () => {
      this.showing = !this.showing;
      ctx.preview(this.showing ? (d) => fitRooms(d, moves) : undefined);
      ctx.redraw();
    };
    const move = () => {
      this.showing = false;
      ctx.preview(undefined);
      ctx.apply((d) => fitRooms(d, moves), { select: null });
    };
    const state = fit !== undefined || open > 0 ? "hot" : issues.length > 0 ? "" : "good";
    const floorId = floor.id;
    return html`<section class="hme-card hme-fit ${state}">
      <div class="hme-h">Fit rooms${total === 0 ? nothing : html`<span class="hme-h-end">${pairs.met} of ${homeMapCount(total, "door")}</span>`}</div>
      ${total === 0 ? nothing : html`<div class="hme-fit-bar" role="img" aria-label=${`${pairs.met} of ${homeMapCount(total, "door")} meet`}>
        <i class=${open === 0 ? "full" : ""} style=${`width:${(pairs.met / total) * 100}%`}></i></div>`}
      ${fit !== undefined ? html`<p class="hme-text">${homeMapFitWords(fit, floor)}</p>
        <div class="hme-fit-acts">
          <button type="button" class="hme-tb" aria-pressed=${this.showing ? "true" : "false"} @click=${flipShow}>${this.showing ? "Hide" : "Show me"}</button>
          <button type="button" class="hme-tb hme-blue" @click=${move}>${moves.length === 1 ? "Move it" : "Move them"}</button>
        </div>`
        : open > 0 ? html`<p class="hme-text">Amber doors have no partner. Click one, then the door it opens to.</p>`
        : total > 0 ? html`<p class="hme-text dim">All doors meet.</p>` : nothing}
      ${issues.map((issue) => html`<div class="hme-fix">
        <span class="hme-fix-dot ${issue.kind === "missingDoor" ? "gray" : ""}"></span>
        <p @click=${() => ctx.select({ kind: "room", roomId: issue.roomIds[0]! })}><b>${issue.title}</b> ${issue.detail}</p>
        <button type="button" class="hme-tb" @click=${() => ctx.apply((d) => issue.fix(d))}>${issue.fixLabel}</button></div>`)}
      ${issues.length > 1 ? html`<button type="button" class="hme-tb hme-wide" @click=${() => ctx.apply((d) => fitAllIssues(d, floorId))}>Fix all ${issues.length}</button>` : nothing}
    </section>`;
  }

  /** A room's doors: who each one meets, a row picking it, and Connect on one
   * with no partner. Nothing for a room with no doors. */
  doorsCard(ctx: HomeMapEditorContext, room: HomeMapRoom): TemplateResult | typeof nothing {
    const pairs = homeMapDoorPairs(ctx.floor);
    const doors = pairs.doors.filter((d) => sameHomeMapId(d.roomId, room.id));
    if (doors.length === 0) return nothing;
    const met = doors.filter((d) => homeMapDoorPartner(pairs, d.roomId, d.index) !== undefined).length;
    return html`<section class="hme-card hme-doors-card">
      <div class="hme-h">Doors<span class="hme-h-end">${met} of ${doors.length} meet</span></div>
      ${doors.map((door) => {
        const partner = homeMapDoorPartner(pairs, door.roomId, door.index);
        const to = partner === undefined ? undefined : ctx.floor.rooms.find((r) => sameHomeMapId(r.id, partner.roomId));
        const pick = () => ctx.select({ kind: "opening", roomId: door.roomId, opening: door.index });
        const hover = () => ctx.setHover({ kind: "opening", roomId: door.roomId, opening: door.index });
        return html`<div class="hme-door-row" @pointerenter=${hover} @pointerleave=${() => ctx.setHover(undefined)}>
          <span class="hme-fix-dot ${to === undefined ? "" : "green"}"></span>
          <button type="button" class="hme-door-name" @click=${pick}>${to === undefined ? "No partner" : `To ${homeMapRoomName(to)}`}</button>
          <span class="mono dim">${homeMapMeters(door.width)}</span>
          ${partner === undefined ? html`<button type="button" class="hme-tb" title="Click the door it opens to on the plan or in 3D" @click=${() => this.start(ctx, door.roomId, door.index)}>Connect</button>` : nothing}
        </div>`;
      })}
    </section>`;
  }

  /** The picked door's partner, under its own card. */
  opensToCard(ctx: HomeMapEditorContext, room: HomeMapRoom, opening: number): TemplateResult | typeof nothing {
    const pairs = homeMapDoorPairs(ctx.floor);
    const door = pairs.doors.find((d) => sameHomeMapId(d.roomId, room.id) && d.index === opening);
    if (door === undefined) return nothing;
    const partner = homeMapDoorPartner(pairs, room.id, opening);
    const to = partner === undefined ? undefined : ctx.floor.rooms.find((r) => sameHomeMapId(r.id, partner.roomId));
    if (to !== undefined) {
      return html`<section class="hme-card hme-fit good"><div class="hme-h">Opens to</div>
        <p class="hme-text">${homeMapRoomName(to)}. One door, cutting both walls.</p></section>`;
    }
    const on = this.connecting !== undefined && sameHomeMapId(this.connecting.roomId, room.id) && this.connecting.opening === opening;
    return html`<section class="hme-card hme-fit hot"><div class="hme-h">Opens to</div>
      ${on ? html`<p class="hme-text">Click the blue door it opens to. <b>${homeMapRoomName(room)}</b> moves there.</p>
        <button type="button" class="hme-tb hme-wide" @click=${() => { this.connecting = undefined; ctx.redraw(); }}>Cancel</button>`
        : html`<button type="button" class="hme-tb hme-blue hme-wide" @click=${() => this.start(ctx, room.id, opening)}>Connect to a door</button>`}
    </section>`;
  }
}
