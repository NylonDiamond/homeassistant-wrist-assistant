// The map editor's real 3D look (three.js), the Model view's and the Both
// view's right side when the dock's look is 3D, and the furniture picker's
// small pictures. This file and three.js load on their own, the first time
// either is asked for (`scene3d-load.ts`), so neither the panel's entry nor
// the editor's own chunk carries them.
//
// The scene is the floor shown, every room of it: each floor laid by its
// finish, or in the room's own floor colour; walls in the room's own wall
// colour when it has one, with their doors, windows and ways through cut out, and
// glass in the windows; the walls between the camera and a room faded, like
// a doll's house; the things in the rooms as the furniture catalog's models
// (`furniture.ts` says which piece and how it fits the thing's box), its
// fabric and wood in the thing's own colours when it has them, a thing
// with no piece as the plain box it always was, a hidden thing nowhere; the
// picked room's floor or each picked thing's box outlined in the editor's
// blue; and each light on the floor as a real light at its pin, lit as Home
// Assistant says it is. Drag to orbit, scroll or pinch to zoom; a click
// hands the page what it met (`onPick`), a thing, a light or a room, and
// whether Cmd or Ctrl was held. The pointer resting on the view hands the
// page what a click there would meet (`onHover`), and the page has the
// view mark its hover, from here, the plan or a list row, in a paler blue
// than the pick (`setHover`).
//
// The plan's x stays x, the plan's y becomes z, and up is y; a thing's turn
// is a turn about up by the same angle, a model's front its +z. Shown at
// night only the lights and a faint sky light it, by day a sun comes in
// too; a soft environment stands in for the light a room's walls bounce
// about, so a shadow is never pure black. A ceiling light shines down in a
// soft cone, any other light every way. A light a lamp holds has no bulb of
// its own drawn: it shines from inside the lamp, which casts no shadow so
// its shade never closes the light in, and the shade glows while it is on;
// a click on either picks the lamp. Any other device a thing holds has no
// pin of its own here either (no device but a light is drawn in 3D), and a
// TV holding one glows its screen a soft cool white while it is on,
// playing, paused or buffering. The finished picture is shaded in
// its corners and under its things (ambient occlusion) and its bulbs glow
// past their edges. The numbers were tuned by eye on a real scanned room.
//
// Nothing here reads `import.meta`: the furniture folder's address is handed
// in (`base`), from the panel's entry.

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { GTAOPass } from "three/addons/postprocessing/GTAOPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { FullScreenQuad, Pass } from "three/addons/postprocessing/Pass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { CopyShader } from "three/addons/shaders/CopyShader.js";
import { homeMapHeldPins } from "./edit-ops.js";
import { type HomeMapFurniturePiece, homeMapLampPiece, homeMapModelFit, homeMapPiece, homeMapPieceOf } from "./furniture.js";
import { type HomeSegment, homeFloorKind, homeWallsOf } from "./geometry.js";
import { type HomeMapFloor, type HomeMapObject, type HomeMapPin, type HomeMapRoom, type HomeMapStates, homeMapPinLook, isHomeMapPartColor, sameHomeMapId } from "./model.js";

/** What the 3D look draws. */
export interface HomeMap3DInput {
  floor: HomeMapFloor;
  /** Home Assistant's states, or undefined to draw every light off. */
  states: HomeMapStates | undefined;
  /** The picked room, or the picked things (one or several, in any rooms),
   * each by its room and its place in that room's list. */
  mark: { roomId: string } | { things: readonly { roomId: string; object: number }[] } | undefined;
  /** Daylight: a sun comes in. Off, only the lights light the rooms. */
  daylight: boolean;
}

// ── models ───────────────────────────────────────────────────────────────

/** A loaded model and its natural bounds: width (x), depth (z), height
 * (y), and the middle of its foot. */
interface Model {
  scene: THREE.Group;
  natural: [number, number, number];
  foot: THREE.Vector3;
}

const models = new Map<string, Promise<Model | undefined>>();
let loader: GLTFLoader | undefined;

/** A piece's model from the furniture folder at `base`, loaded once and
 * kept; undefined when it cannot be read. */
function loadModel(base: string, id: string): Promise<Model | undefined> {
  const url = new URL(`${id}.glb`, base).href;
  let model = models.get(url);
  if (model === undefined) {
    loader ??= new GLTFLoader();
    model = loader.loadAsync(url).then(
      (gltf) => {
        const scene = gltf.scene;
        scene.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
          }
        });
        const box = new THREE.Box3().setFromObject(scene);
        const size = box.getSize(new THREE.Vector3());
        const centre = box.getCenter(new THREE.Vector3());
        return { scene, natural: [size.x, size.z, size.y], foot: new THREE.Vector3(centre.x, box.min.y, centre.z) } satisfies Model;
      },
      () => undefined,
    );
    models.set(url, model);
  }
  return model;
}

/** A copy of `model` fitted to a box `size` (width, depth, height) with its
 * foot's middle at the origin. */
function fitted(model: Model, size: readonly [number, number, number]): THREE.Group {
  const inner = model.scene.clone(true);
  inner.position.set(-model.foot.x, -model.foot.y, -model.foot.z);
  const fit = new THREE.Group();
  fit.add(inner);
  const s = homeMapModelFit(model.natural, size);
  fit.scale.set(s.x, s.y, s.z);
  return fit;
}

// ── colours ──────────────────────────────────────────────────────────────

const BLUE = 0x5b8def;
/** The hover's mark, paler than the pick's blue. */
const HOVER = 0xa8c6ff;
const WALL = 0xdcd5c8;
const BOX = 0x8a7f72;
const FINISH: Readonly<Record<string, number>> = { carpet: 0x6f665c, wood: 0x8a6a4a, tile: 0xb9b4aa, stone: 0x8f8a82, plain: 0x8a847c };
const NIGHT_SKY = 0x0f0e0d;
const DAY_SKY = 0x1a1916;

/** A light's brightest, in candela, as tuned on a real lamp. */
const LAMP_CANDELA = 9;
/** A ceiling light's brightest straight down, in candela: its light goes
 * into a cone rather than every way, so the same bulb is brighter under it,
 * tuned by eye against the lamps. */
const SPOT_CANDELA = 40;
/** A ceiling light's cone, from straight down to its edge, and how much of
 * that is a soft edge: half the light is gone about 34 degrees out, a beam
 * of about 68 degrees as a real downlight's. */
const SPOT_ANGLE = Math.PI / 4;
const SPOT_PENUMBRA = 0.6;
/** A ceiling light's faint glow every way, as a share of a lamp's, for the
 * light a real ceiling and its shade spill round the fitting: without it the
 * walls above the cone are black. */
const SPOT_FILL = 0.15;
/** What the lit lights' shadows may cost, in shadow maps drawn, the
 * brightest light first: a ceiling light's shadow is one map, a lamp's six
 * (one for each way it shines). The maps are drawn again only when the
 * scene changes, a thing dragged on the plan for one, never when the view
 * turns, so this is what that drag pays each frame; 24 is what the four
 * shadowed lamps of before cost, now shared so that four ceiling lights and
 * three lamps all cast. */
const SHADOW_BUDGET = 24;
/** And at most this many lit lights cast, each one more shadow map every
 * lit surface reads each frame, and one more of the few textures a material
 * may read. */
const SHADOW_LIGHTS = 8;
/** How far a lamp's shadow edge spreads, in shadow map texels: a real shade
 * is a hand wide, so its shadows fade over a few centimetres, never a cut. */
const SHADOW_SOFTNESS = 5;
/** A wall seen from outside its room is this see through. */
const FADED = 0.1;

/** A colour temperature as a bulb's colour, close enough for a bulb. */
export function homeMapKelvinColor(kelvin: number): [number, number, number] {
  const t = kelvin / 100;
  const r = t <= 66 ? 255 : 329.7 * (t - 60) ** -0.1332;
  const g = t <= 66 ? 99.47 * Math.log(t) - 161.12 : 288.12 * (t - 60) ** -0.0755;
  const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.52 * Math.log(t - 10) - 305.04;
  const c = (v: number) => Math.max(0, Math.min(255, v)) / 255;
  return [c(r), c(g), c(b)];
}

/** The models' materials a thing's colours change, by name (the iPhone's
 * models keep the same names): the fabric ones, a lamp's shade among them,
 * take its `fabric` and the wood ones its `wood`, a darker one that colour
 * times its factor in each linear channel. Every other material (white
 * cloth, metal, glass, a plant) keeps the model's own colour. */
export const HOME_MAP_TINTED_MATERIALS: Readonly<Record<string, { part: "fabric" | "wood"; factor: number }>> = {
  carpet: { part: "fabric", factor: 1 },
  carpetBlue: { part: "fabric", factor: 1 },
  carpetDarker: { part: "fabric", factor: 0.645 },
  lamp: { part: "fabric", factor: 1 },
  wood: { part: "wood", factor: 1 },
  woodDark: { part: "wood", factor: 0.757 },
};

/** A `#RRGGBB` sRGB colour as linear RGB, 0 to 1 each; undefined for
 * anything else. */
export function homeMapLinearOf(hex: string | undefined): [number, number, number] | undefined {
  if (hex === undefined || !/^#[0-9A-Fa-f]{6}$/.test(hex)) return undefined;
  const channel = (at: number) => {
    const c = Number.parseInt(hex.slice(at, at + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return [channel(1), channel(3), channel(5)];
}

/** The linear colour a model's material named `name` takes on a thing with
 * these colours, or undefined when it keeps its own. */
export function homeMapMaterialTint(name: string, colors: Pick<HomeMapObject, "fabric" | "wood">): [number, number, number] | undefined {
  const rule = Object.hasOwn(HOME_MAP_TINTED_MATERIALS, name) ? HOME_MAP_TINTED_MATERIALS[name] : undefined;
  if (rule === undefined) return undefined;
  const linear = homeMapLinearOf(colors[rule.part]);
  return linear?.map((v) => v * rule.factor) as [number, number, number] | undefined;
}

/** How a light pin shines: how bright (0 off, 1 full) and its colour, from
 * `rgb_color`, else `color_temp_kelvin`, else a warm 2700 K bulb. */
export function homeMapLampOf(pin: HomeMapPin, states: HomeMapStates | undefined): { level: number; rgb: [number, number, number] } {
  const look = homeMapPinLook(pin.entityId, states);
  const level = look.kind === "light" && look.on ? (look.brightness ?? 1) : 0;
  const attributes = states?.[pin.entityId]?.attributes;
  const rgb = attributes?.rgb_color;
  const kelvin = attributes?.color_temp_kelvin;
  if (Array.isArray(rgb) && rgb.length >= 3 && rgb.slice(0, 3).every((v) => typeof v === "number" && Number.isFinite(v))) {
    return { level, rgb: [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255].map((v) => Math.max(0, Math.min(1, v))) as [number, number, number] };
  }
  if (typeof kelvin === "number" && Number.isFinite(kelvin) && kelvin > 0) return { level, rgb: homeMapKelvinColor(kelvin) };
  return { level, rgb: homeMapKelvinColor(2700) };
}

const isLight = (pin: HomeMapPin) => pin.entityId.startsWith("light.");

// ── the rooms ────────────────────────────────────────────────────────────

/** A wall piece and the way into its room, for the doll's house fade. */
interface WallPiece {
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
  nx: number;
  nz: number;
}

/** A wall on the same line as a longer one and inside its span adds
 * nothing. */
function covers(big: HomeSegment, small: HomeSegment): boolean {
  const [ax, ay] = big.a;
  const [bx, by] = big.b;
  const len = Math.hypot(bx - ax, by - ay);
  const sLen = Math.hypot(small.b[0] - small.a[0], small.b[1] - small.a[1]);
  if (len <= sLen) return false;
  const ux = (bx - ax) / len;
  const uy = (by - ay) / len;
  return [small.a, small.b].every((p) => {
    const along = (p[0] - ax) * ux + (p[1] - ay) * uy;
    const off = Math.abs((p[0] - ax) * uy - (p[1] - ay) * ux);
    return off < 0.03 && along > -0.03 && along < len + 0.03;
  });
}

/** A room's floor and wall colours (sRGB): its own `floorColor` and
 * `wallColor` when it has them, else its finish's and the plain wall's. */
export function homeMapRoomColors(room: HomeMapRoom): { floor: string | number; wall: string | number } {
  return {
    floor: isHomeMapPartColor(room.floorColor) ? room.floorColor.toUpperCase() : (FINISH[homeFloorKind(room)] ?? BOX),
    wall: isHomeMapPartColor(room.wallColor) ? room.wallColor.toUpperCase() : WALL,
  };
}

/** One room's floor, walls and window glass, and its wall pieces. */
function buildRoom(room: HomeMapRoom): { group: THREE.Group; walls: WallPiece[] } {
  const group = new THREE.Group();
  const walls: WallPiece[] = [];
  const colors = homeMapRoomColors(room);
  if (room.outline.length >= 3) {
    const shape = new THREE.Shape(room.outline.map(([x, y]) => new THREE.Vector2(x, -y)));
    const floor = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshStandardMaterial({ color: colors.floor, roughness: 0.95 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    group.add(floor);
  }
  const n = Math.max(room.outline.length, 1);
  const cx = room.outline.reduce((s, p) => s + p[0], 0) / n;
  const cy = room.outline.reduce((s, p) => s + p[1], 0) / n;
  const height = room.height > 0 ? room.height : 2.4;
  const all = homeWallsOf(room);
  const kept = all.filter((w, i) => !all.some((o, j) => j !== i && covers(o, w)));
  for (const w of kept) {
    const [ax, ay] = w.a;
    const [bx, by] = w.b;
    const len = Math.hypot(bx - ax, by - ay);
    if (len < 0.01) continue;
    const ux = (bx - ax) / len;
    const uy = (by - ay) / len;
    // The room's side of this wall, so a wall between the camera and the
    // room can fade.
    let nx = -uy;
    let nz = ux;
    if ((cx - ax) * nx + (cy - ay) * nz < 0) {
      nx = -nx;
      nz = -nz;
    }
    const cuts: { s0: number; s1: number; z0: number; z1: number; window: boolean }[] = [];
    for (const o of room.openings) {
      const off = (p: readonly number[]) => Math.abs((p[0]! - ax) * uy - (p[1]! - ay) * ux);
      if (off(o.a) > 0.2 || off(o.b) > 0.2) continue;
      let s0 = (o.a[0] - ax) * ux + (o.a[1] - ay) * uy;
      let s1 = (o.b[0] - ax) * ux + (o.b[1] - ay) * uy;
      if (s0 > s1) [s0, s1] = [s1, s0];
      s0 = Math.max(0, s0);
      s1 = Math.min(len, s1);
      const z0 = Math.max(0, Math.min(o.z0, height));
      const z1 = Math.max(z0, Math.min(o.z1, height));
      if (s1 - s0 > 0.05) cuts.push({ s0, s1, z0, z1, window: o.kind === "window" });
    }
    cuts.sort((p, q) => p.s0 - q.s0);
    const angle = -Math.atan2(uy, ux);
    const thick = w.t > 0 ? w.t : 0.1;
    const piece = (s0: number, s1: number, z0: number, z1: number) => {
      if (s1 - s0 < 0.005 || z1 - z0 < 0.005) return;
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(s1 - s0, z1 - z0, thick), new THREE.MeshStandardMaterial({ color: colors.wall, roughness: 0.92, transparent: true }));
      const s = (s0 + s1) / 2;
      mesh.position.set(ax + ux * s, (z0 + z1) / 2, ay + uy * s);
      mesh.rotation.y = angle;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      walls.push({ mesh, nx, nz });
    };
    let s = 0;
    for (const c of cuts) {
      piece(s, c.s0, 0, height);
      piece(c.s0, c.s1, 0, c.z0);
      piece(c.s0, c.s1, c.z1, height);
      if (c.window && c.z1 - c.z0 > 0.01) {
        const glass = new THREE.Mesh(
          new THREE.BoxGeometry(c.s1 - c.s0, c.z1 - c.z0, 0.01),
          new THREE.MeshStandardMaterial({ color: 0x9fb8d0, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.3, depthWrite: false }),
        );
        const m = (c.s0 + c.s1) / 2;
        glass.position.set(ax + ux * m, (c.z0 + c.z1) / 2, ay + uy * m);
        glass.rotation.y = angle;
        group.add(glass);
      }
      s = Math.max(s, c.s1);
    }
    piece(s, len, 0, height);
  }
  return { group, walls };
}

/** What a room's structure is built from, as text, its colours too: built
 * again only when it changes, so a colour picked for one room builds that
 * room alone. */
export function homeMapRoomKey(room: HomeMapRoom): string {
  const colors = homeMapRoomColors(room);
  return JSON.stringify([room.outline, room.height, room.walls, room.openings, homeFloorKind(room), colors.floor, colors.wall]);
}

/** Free a group's geometry and materials. */
function disposeTree(root: THREE.Object3D): void {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.geometry !== undefined) mesh.geometry.dispose();
    const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(material)) material.forEach((m) => m.dispose());
    else material?.dispose();
  });
}

// ── the scene ────────────────────────────────────────────────────────────

/** A thing drawn: its piece (none for the plain box) and the group placed at
 * its middle, foot and turn. */
interface Thing {
  piece: HomeMapFurniturePiece | undefined;
  group: THREE.Group;
  /** The fitted model or box, filled in once its model loads. */
  body?: THREE.Object3D;
  model?: Model;
  size: [number, number, number];
  /** Its fabric and wood as last drawn. */
  colors: Pick<HomeMapObject, "fabric" | "wood">;
  /** The materials made for its colours, its own so the loaded model's
   * shared ones and every other thing's stay as they are. */
  copies: THREE.Material[];
  /** The pin of the light this lamp holds, or none. */
  holds?: string;
  /** A lamp holding a light: its shade's own materials (among `copies`),
   * which glow while the light is on. */
  shades: THREE.MeshStandardMaterial[];
  /** The entity of the device this thing holds, any kind, or none: a TV's
   * screen glows while it is on. */
  device?: string;
  /** A TV holding a device: its screen's own materials (among `copies`). */
  screens: THREE.MeshStandardMaterial[];
  /** Whether its screen glows now, as Home Assistant last said. */
  screenOn: boolean;
}

/** The models' material a TV's screen is made of: the Kenney TVs draw the
 * screen, and only the screen, in it (a flat quad on the modern one's front,
 * the old one's curved glass), so it glows alone. */
const SCREEN = "metal";
/** A TV's screen while its device is on: a soft cool white, under the
 * bloom's threshold so it lights the screen rather than flaring. */
const SCREEN_GLOW = 0xd6e4ff;
const SCREEN_GLOW_LEVEL = 0.6;
/** The catalog's kind of a TV. */
const TV = "television";

/** Whether the device a TV holds is on as a screen is: a media player on,
 * playing, paused or buffering, a switch or anything else on; off, idle,
 * standby, unavailable, unknown or no state at all leave it dark. */
export function homeMapScreenOn(entityId: string | undefined, states: HomeMapStates | undefined): boolean {
  const state = entityId === undefined ? undefined : states?.[entityId]?.state;
  return state === "on" || state === "playing" || state === "paused" || state === "buffering";
}

/** A TV's screens lit or dark as its `screenOn` says. */
function lightScreens(thing: Thing): void {
  for (const screen of thing.screens) {
    screen.emissive.set(SCREEN_GLOW);
    screen.emissiveIntensity = thing.screenOn ? SCREEN_GLOW_LEVEL : 0;
  }
}

/** The models' material a lamp's shade is made of, which glows while the
 * lamp's light is on. */
const SHADE = "lamp";
/** A lit shade's brightness for each candela its light gives: past the
 * glow's threshold at full, so the shade reads as lit through its fabric
 * with a soft glow round it, and under it when dimmed. */
const SHADE_GLOW = 0.6;

/** The loaded model's own material a recoloured mesh had. */
const ownMaterials = new WeakMap<THREE.Mesh, THREE.Material | THREE.Material[]>();

/** A thing's model back in its own colours, the copies made for its colours
 * freed. */
function untint(thing: Thing): void {
  thing.body?.traverse((o) => {
    const mesh = o as THREE.Mesh;
    const own = ownMaterials.get(mesh);
    if (own === undefined) return;
    mesh.material = own;
    ownMaterials.delete(mesh);
  });
  for (const copy of thing.copies) copy.dispose();
  thing.copies = [];
  thing.shades = [];
  thing.screens = [];
}

/** A thing's model in its fabric and wood colours: each material that
 * takes one (`homeMapMaterialTint`) swapped for a copy of its own, one copy
 * for each material however many meshes share it. A lamp holding a light
 * has its shade copied too, coloured or not, so its glow is its own, and a
 * TV holding a device its screen. */
function tint(thing: Thing, colors: Pick<HomeMapObject, "fabric" | "wood">): void {
  untint(thing);
  const glows = thing.holds !== undefined;
  const tv = thing.device !== undefined && thing.piece?.kind === TV;
  if (thing.body === undefined || (colors.fabric === undefined && colors.wood === undefined && !glows && !tv)) return;
  const made = new Map<THREE.Material, THREE.Material>();
  const recolour = (material: THREE.Material): THREE.Material => {
    const rgb = homeMapMaterialTint(material.name, colors);
    const emits = (material as THREE.MeshStandardMaterial).emissive !== undefined;
    const shade = glows && material.name === SHADE && emits;
    const screen = tv && material.name === SCREEN && emits;
    const color = (material as THREE.MeshStandardMaterial).color as THREE.Color | undefined;
    if ((rgb === undefined && !shade && !screen) || color === undefined) return material;
    let copy = made.get(material);
    if (copy === undefined) {
      copy = material.clone();
      if (rgb !== undefined) (copy as THREE.MeshStandardMaterial).color.setRGB(rgb[0], rgb[1], rgb[2], THREE.LinearSRGBColorSpace);
      made.set(material, copy);
      thing.copies.push(copy);
      if (shade) thing.shades.push(copy as THREE.MeshStandardMaterial);
      if (screen) thing.screens.push(copy as THREE.MeshStandardMaterial);
    }
    return copy;
  };
  thing.body.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const own = mesh.material;
    const next = Array.isArray(own) ? own.map(recolour) : recolour(own);
    if (Array.isArray(own) ? (next as THREE.Material[]).every((m, i) => m === own[i]) : next === own) return;
    ownMaterials.set(mesh, own);
    mesh.material = next;
  });
  lightScreens(thing);
}

/** A thing's meshes casting shadows, or not when it is a lamp holding a
 * light: its shade and stand stand round the light's bulb, and as casters
 * they would close it in and the room would stay dark. They still take
 * the shadows other things cast. */
function castFor(thing: Thing): void {
  const cast = thing.holds === undefined;
  thing.body?.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.castShadow = cast;
  });
}

/** A thing's colours as a key, to tell when they change. */
function tintKey(object: Pick<HomeMapObject, "fabric" | "wood">): string {
  return `${object.fabric?.toUpperCase() ?? ""}|${object.wood?.toUpperCase() ?? ""}`;
}

/** What a click on the 3D look found: a thing by its place in its room's
 * list, a room (its floor or a wall that is not faded), or a light's pin. */
export type HomeMap3DPick =
  | { kind: "object"; roomId: string; object: number }
  | { kind: "room"; roomId: string }
  | { kind: "pin"; pinId: string };

/** How far a press may move, in CSS pixels, and still be a click rather
 * than a turn of the view. */
const CLICK_SLOP = 5;
/** A light's bulb is small; a click this near its middle still finds it. */
const BULB_REACH = 0.15;

interface Lamp {
  /** A ceiling light shines down in a cone, any other light every way. */
  light: THREE.PointLight | THREE.SpotLight;
  /** A ceiling light's faint glow every way, round its cone. */
  fill?: THREE.PointLight;
  bulb: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
  /** Whether it shines down (a ceiling light), what it was made as. */
  down: boolean;
  /** Held by a lamp: its bulb ball is never drawn, the lamp is. */
  held: boolean;
  /** Its candela when full. */
  peak: number;
  /** The intensity it eases towards. */
  target: number;
}

// ── the finish ───────────────────────────────────────────────────────────

/** How far, in meters, ambient occlusion looks for what shades a point: a
 * room's corners and the floor under a chair darken, a whole wall does not. */
const AO_RADIUS = 0.5;
/** How strongly the occlusion darkens, 1 its full measure. */
const AO_STRENGTH = 0.85;
/** A bulb's glow spreads past it: how much, how far, and how bright a pixel
 * must be (in light before tone mapping, where a lit wall stays under it and
 * a bulb past half its level goes over) to glow. Lower, a room with every
 * light on glowed out into the dark round it. */
const BLOOM_STRENGTH = 0.3;
const BLOOM_RADIUS = 0.45;
const BLOOM_THRESHOLD = 4;
/** A lit bulb's own brightness for each candela its light gives, high
 * enough that a bulb past half its level is over the glow's threshold. */
const BULB_GLOW = 1.5;

/** The scene drawn with its edges smoothed, four samples a pixel, into a
 * target of its own, then copied once into the composer's. Only this draw
 * is smoothed: had the composer's own targets four samples, every full
 * screen pass after it (the occlusion, the glow) would write all four too,
 * which measured more than half the frame. */
class SmoothScenePass extends Pass {
  private readonly target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
  private readonly copy = new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone(CopyShader.uniforms),
    vertexShader: CopyShader.vertexShader,
    fragmentShader: CopyShader.fragmentShader,
    blending: THREE.NoBlending,
    depthTest: false,
    depthWrite: false,
  });
  private readonly quad = new FullScreenQuad(this.copy);

  constructor(private readonly scene: THREE.Scene, private readonly camera: THREE.Camera) {
    super();
    this.needsSwap = false;
  }

  override render(renderer: THREE.WebGLRenderer, _writeBuffer: THREE.WebGLRenderTarget, readBuffer: THREE.WebGLRenderTarget): void {
    renderer.setRenderTarget(this.target);
    renderer.render(this.scene, this.camera);
    this.copy.uniforms.tDiffuse!.value = this.target.texture;
    renderer.setRenderTarget(this.renderToScreen ? null : readBuffer);
    this.quad.render(renderer);
  }

  override setSize(width: number, height: number): void {
    this.target.setSize(width, height);
  }

  override dispose(): void {
    this.target.dispose();
    this.copy.dispose();
    this.quad.dispose();
  }
}

/** What shades nothing round it: what is seen through rather than seen (a
 * faded wall, window glass) and a bulb, which gives light rather than
 * blocking it and would otherwise ring itself with a grey halo on the wall
 * behind. */
function shadesNothing(o: THREE.Object3D): boolean {
  if (o.userData.bulb === true) return true;
  const material = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
  return material !== undefined && !Array.isArray(material) && material.transparent && material.opacity < 0.5;
}

/** Ground truth ambient occlusion (GTAO) that leaves out of its depth and
 * normals what shades nothing (`shadesNothing`), so the floor behind a
 * faded wall is shaded by what stands on it and not by the wall; three's own
 * pass leaves out only points and lines. Its two shaders its own dispose
 * forgets are freed too. */
class RoomAO extends GTAOPass {
  private readonly hiddenNow: THREE.Object3D[] = [];

  override overrideVisibility(): void {
    this.scene.traverse((o) => {
      if (o.visible && shadesNothing(o)) {
        o.visible = false;
        this.hiddenNow.push(o);
      }
    });
  }

  override restoreVisibility(): void {
    for (const o of this.hiddenNow) o.visible = true;
    this.hiddenNow.length = 0;
  }

  /** Worked out at half the canvas's size each way, a quarter of the
   * pixels: the shading is soft, so the drawn picture loses nothing a person
   * sees, and it cost three of the frame's ten milliseconds at full size. */
  override setSize(width: number, height: number): void {
    super.setSize(Math.max(Math.round(width / 2), 1), Math.max(Math.round(height / 2), 1));
  }

  override dispose(): void {
    super.dispose();
    this.gtaoMaterial.dispose();
    this.blendMaterial.dispose();
  }
}

export class HomeMapScene3D {
  readonly canvas: HTMLCanvasElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  /** What is drawn over the finished scene, after the occlusion and before
   * the glow: the picked outline, which neither shades nor glows. */
  private readonly overlay = new THREE.Scene();
  /** The scene drawn, then shaded in its corners (`ao`), the outline laid
   * over it, its bulbs glowing (`bloom`), and last tone mapped into the
   * page's colours (`OutputPass`), which the renderer did itself before. */
  private readonly composer: EffectComposer;
  private readonly ao: RoomAO;
  private readonly bloom: UnrealBloomPass;
  private readonly camera = new THREE.PerspectiveCamera(32, 1, 0.05, 200);
  private readonly controls: OrbitControls;
  private readonly pmrem: THREE.PMREMGenerator;
  private readonly environment: THREE.Texture;
  private readonly sky = new THREE.HemisphereLight(0x8a9ab8, 0x2a2018, 0.18);
  private readonly sun = new THREE.DirectionalLight(0xfff1dc, 0);
  private readonly rooms = new Map<string, { key: string; group: THREE.Group; walls: WallPiece[] }>();
  private readonly things = new Map<string, Thing>();
  private readonly lamps = new Map<string, Lamp>();
  /** Each pin a shown thing holds, by its pin's id. */
  private held = new Map<string, HeldPin>();
  private readonly lines: LineMaterial[] = [];
  private mark?: THREE.Object3D;
  private markKey = "";
  private host?: HTMLElement;
  private observer?: ResizeObserver;
  private frame = 0;
  private awakeUntil = 0;
  private floorId?: string;
  private framedTurn = 0;
  private input?: HomeMapInputSeen;
  private disposed = false;
  private press?: { id: number; x: number; y: number };
  private readonly raycaster = new THREE.Raycaster();
  /** The hover's soft mark (`setHover`), its lines, and what it marks. */
  private hoverMark?: THREE.Object3D;
  private readonly hoverLines: LineMaterial[] = [];
  private hoverKey = "";
  /** Where the pointer rests with no button down, for the next frame's
   * hover; undefined once it left, pressed or is a finger. */
  private hoverAt?: { x: number; y: number };
  private hoverFrame = 0;
  /** What the hover last told the page, as a key. */
  private hoverSent = "";

  /** A click (a press let go where it started) on the view: what is under
   * it, or undefined for empty space, and whether Cmd or Ctrl was held
   * (`add`), to add it to the pick or take it out. */
  onPick?: (pick: HomeMap3DPick | undefined, keys: { add: boolean }) => void;
  /** The pointer resting on the view with no button down: what a click
   * there would pick, or undefined for empty space, after the pointer left,
   * or while a press orbits the view. Found at most once a frame, and told
   * only when it changes. */
  onHover?: (pick: HomeMap3DPick | undefined) => void;

  /** `base` is the furniture folder's address, ending in a slash. */
  constructor(private readonly base: string) {
    // No antialiasing of the canvas itself: the scene is drawn smoothed into
    // a target of its own (`SmoothScenePass`), and the canvas only takes the
    // finished picture.
    this.renderer = new THREE.WebGLRenderer({ antialias: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    // Plain PCF rather than PCFSoft: PCFSoft ignores a shadow's radius for
    // the sun and the downlights, and its fixed edge left a plant's shadow
    // as sharp as a cut-out. PCF spreads every edge over the light's radius.
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    // Shadows only move when the scene does, never with the camera.
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.canvas = this.renderer.domElement;
    this.canvas.style.display = "block";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.touchAction = "none";
    this.scene.background = new THREE.Color(NIGHT_SKY);
    this.pmrem = new THREE.PMREMGenerator(this.renderer);
    const room = new RoomEnvironment();
    this.environment = this.pmrem.fromScene(room, 0.04).texture;
    room.dispose();
    this.scene.environment = this.environment;
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.bias = -0.0005;
    this.sun.shadow.radius = 3;
    this.scene.add(this.sky, this.sun, this.sun.target);
    // Half floats keep a bulb's light brighter than white until the end, so
    // the glow finds it and the tone mapping rolls it off as before.
    this.composer = new EffectComposer(this.renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType }));
    this.composer.addPass(new SmoothScenePass(this.scene, this.camera));
    this.ao = new RoomAO(this.scene, this.camera, 1, 1);
    // Twice three's own scale and thickness: at its own the corners of a lit
    // room barely darkened, tuned by eye on a real scanned room.
    this.ao.updateGtaoMaterial({ radius: AO_RADIUS, distanceExponent: 1, thickness: 2, scale: 2, samples: 16 });
    this.ao.blendIntensity = AO_STRENGTH;
    this.composer.addPass(this.ao);
    const overlay = new RenderPass(this.overlay, this.camera);
    overlay.clear = false;
    this.composer.addPass(overlay);
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), BLOOM_STRENGTH, BLOOM_RADIUS, BLOOM_THRESHOLD);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());
    this.controls = new OrbitControls(this.camera, this.canvas);
    // Damped enough to settle softly, not so much that the view trails the
    // pointer: three's own 0.05 felt like lag.
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.3;
    this.controls.maxPolarAngle = Math.PI * 0.47;
    this.controls.minDistance = 1.5;
    this.controls.maxDistance = 60;
    this.controls.addEventListener("change", () => this.wake());
    this.canvas.addEventListener("pointerdown", (e) => {
      this.wake(1500);
      this.press = e.isPrimary && e.button === 0 ? { id: e.pointerId, x: e.clientX, y: e.clientY } : undefined;
      // A press orbits or clicks: no hover until the pointer moves again
      // with no button down.
      this.hoverAt = undefined;
      this.sendHover(undefined);
    });
    this.canvas.addEventListener("pointermove", (e) => this.hoverMove(e));
    this.canvas.addEventListener("pointerleave", () => this.hoverMove(undefined));
    this.canvas.addEventListener("pointerup", (e) => {
      const press = this.press;
      this.press = undefined;
      if (press === undefined || press.id !== e.pointerId || Math.hypot(e.clientX - press.x, e.clientY - press.y) > CLICK_SLOP) return;
      this.onPick?.(this.pickAt(e.clientX, e.clientY), { add: e.metaKey || e.ctrlKey });
    });
    this.canvas.addEventListener("pointercancel", () => { this.press = undefined; });
    // On a Mac a Ctrl click adds to the pick; it must not also open the
    // browser's menu.
    this.canvas.addEventListener("contextmenu", (e) => { if (e.ctrlKey) e.preventDefault(); });
  }

  /** What is under a point of the page: the nearest thing, light or room
   * the eye meets, looking through faded walls and window glass. */
  pickAt(clientX: number, clientY: number): HomeMap3DPick | undefined {
    const box = this.canvas.getBoundingClientRect();
    if (box.width <= 0 || box.height <= 0) return undefined;
    const at = new THREE.Vector2(((clientX - box.left) / box.width) * 2 - 1, -((clientY - box.top) / box.height) * 2 + 1);
    this.raycaster.setFromCamera(at, this.camera);
    const targets: THREE.Object3D[] = [
      ...[...this.rooms.values()].map((r) => r.group),
      ...[...this.things.values()].map((t) => t.group),
      ...[...this.lamps.values()].map((l) => l.bulb),
    ];
    for (const hit of this.raycaster.intersectObjects(targets, true)) {
      const material = (hit.object as THREE.Mesh).material as THREE.Material | undefined;
      if (material !== undefined && !Array.isArray(material) && material.transparent && material.opacity < 0.5) continue;
      for (let o: THREE.Object3D | null = hit.object; o !== null; o = o.parent) {
        const pick = o.userData.pick as HomeMap3DPick | undefined;
        if (pick !== undefined) return pick;
      }
    }
    return undefined;
  }

  // ── the hover ──────────────────────────────────────────────────────────

  /** The pointer moved over the view, or left it (undefined): looked at on
   * the next frame, once however many moves come before it. A finger has
   * no hover, and a button down is an orbit. */
  private hoverMove(e: PointerEvent | undefined): void {
    this.hoverAt = e === undefined || e.pointerType === "touch" || e.buttons !== 0 ? undefined : { x: e.clientX, y: e.clientY };
    if (this.hoverFrame === 0 && !this.disposed && typeof requestAnimationFrame === "function") this.hoverFrame = requestAnimationFrame(this.hoverTick);
  }

  private readonly hoverTick = (): void => {
    this.hoverFrame = 0;
    if (this.disposed) return;
    const at = this.hoverAt;
    this.sendHover(at === undefined || this.press !== undefined ? undefined : this.pickAt(at.x, at.y));
  };

  /** Tell the page the hover, when it changed. */
  private sendHover(pick: HomeMap3DPick | undefined): void {
    const key = pick === undefined ? "" : JSON.stringify(pick);
    if (key === this.hoverSent) return;
    this.hoverSent = key;
    this.onHover?.(pick);
  }

  /** Mark a room, a thing or a light softly, lighter than the pick's
   * outline: a faint wash over it and a thin pale line round it, drawn
   * with the outline over the finished scene, so it costs no pass of its
   * own. The page sets it, from this view's hover or from the plan's or a
   * list row's; undefined takes it away. One frame is drawn for a change. */
  setHover(pick: HomeMap3DPick | undefined): void {
    if (this.disposed) return;
    const floor = this.input?.floor;
    const room = pick === undefined || pick.kind === "pin" || floor === undefined ? undefined : floor.rooms.find((r) => sameHomeMapId(r.id, pick.roomId));
    const object = pick?.kind === "object" ? room?.objects[pick.object] : undefined;
    const lamp = pick?.kind === "pin" ? this.lamps.get(pick.pinId) : undefined;
    const bulb = lamp?.bulb.position;
    const key = object !== undefined ? JSON.stringify(["thing", object.c, object.size, object.turn, object.lift ?? 0])
      : bulb !== undefined ? JSON.stringify(["light", bulb.x, bulb.y, bulb.z])
      : room !== undefined && pick?.kind === "room" ? JSON.stringify(["room", room.outline])
      : "";
    if (key === this.hoverKey) return;
    this.hoverKey = key;
    if (this.hoverMark !== undefined) {
      this.overlay.remove(this.hoverMark);
      disposeTree(this.hoverMark);
      this.hoverMark = undefined;
      this.hoverLines.length = 0;
    }
    // Seen through everything, as the outline is: a box's faces towards the
    // camera only, so the wash is as faint from any side.
    const wash = (opacity: number, side: THREE.Side = THREE.FrontSide) => new THREE.MeshBasicMaterial({ color: HOVER, transparent: true, opacity, depthTest: false, depthWrite: false, side });
    const line = () => {
      const m = new LineMaterial({ color: HOVER, linewidth: 1.5, depthTest: false, transparent: true, opacity: 0.7 });
      m.resolution.set(Math.max(this.host?.clientWidth ?? 1, 1), Math.max(this.host?.clientHeight ?? 1, 1));
      this.hoverLines.push(m);
      return m;
    };
    let mark: THREE.Object3D | undefined;
    if (object !== undefined) {
      const [w, d, h] = object.size;
      const y0 = Math.max(object.lift ?? 0, 0);
      const group = new THREE.Group();
      const box = new THREE.Mesh(new THREE.BoxGeometry(Math.max(w, 0.01), Math.max(h, 0.01), Math.max(d, 0.01)), wash(0.07));
      box.position.y = y0 + h / 2;
      const corners = [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]] as const;
      const positions: number[] = [];
      for (let i = 0; i < 4; i += 1) {
        const [x0, z0] = corners[i]!;
        const [x1, z1] = corners[(i + 1) % 4]!;
        positions.push(x0, y0, z0, x1, y0, z1, x0, y0 + h, z0, x1, y0 + h, z1, x0, y0, z0, x0, y0 + h, z0);
      }
      const geometry = new LineSegmentsGeometry();
      geometry.setPositions(positions);
      group.add(box, new LineSegments2(geometry, line()));
      group.position.set(object.c[0], 0, object.c[1]);
      group.rotation.y = (object.turn * Math.PI) / 180;
      mark = group;
    } else if (bulb !== undefined) {
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 12), wash(0.3));
      ball.position.copy(bulb);
      mark = ball;
    } else if (room !== undefined && pick?.kind === "room" && room.outline.length >= 3) {
      const group = new THREE.Group();
      const floorWash = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape(room.outline.map(([x, y]) => new THREE.Vector2(x, -y)))), wash(0.06, THREE.DoubleSide));
      floorWash.rotation.x = -Math.PI / 2;
      floorWash.position.y = 0.02;
      const edge = new LineGeometry();
      edge.setPositions([...room.outline, room.outline[0]!].flatMap(([x, y]) => [x, 0.02, y]));
      group.add(floorWash, new Line2(edge, line()));
      mark = group;
    }
    if (mark !== undefined) {
      // Under the pick's outline, which draws at 10.
      mark.traverse((o) => { o.renderOrder = 9; });
      this.hoverMark = mark;
      this.overlay.add(mark);
    }
    this.wake(0);
  }

  /** Draw into `host`, filling it; the canvas moves there from wherever it
   * was, and the floor is framed whole again for the new shape. */
  attach(host: HTMLElement): void {
    if (this.disposed || host === this.host) return;
    const moved = this.host !== undefined;
    this.host = host;
    host.append(this.canvas);
    this.observer?.disconnect();
    if (typeof ResizeObserver !== "undefined") {
      this.observer = new ResizeObserver(() => this.resize());
      this.observer.observe(host);
    }
    this.resize();
    if (moved) this.frameFloor(this.framedTurn);
  }

  private resize(): void {
    const host = this.host;
    if (host === undefined) return;
    const width = Math.max(host.clientWidth, 1);
    const height = Math.max(host.clientHeight, 1);
    this.renderer.setSize(width, height, false);
    this.composer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    for (const m of this.lines) m.resolution.set(width, height);
    for (const m of this.hoverLines) m.resolution.set(width, height);
    this.wake();
  }

  /** Draw `input`, building again only what changed; the lights follow the
   * states without anything being built. A new floor is framed whole, from
   * `turn` degrees round, as the model looks turn. Nothing new to draw
   * (the page drawn again for a hover, say) draws no frame. */
  update(input: HomeMap3DInput, turn: number): void {
    if (this.disposed) return;
    const seen = this.input;
    this.input = { ...input, turn };
    let moved = false;
    let changed = false;
    if (seen === undefined || seen.floor !== input.floor) {
      this.held = heldPinsOf(input.floor);
      moved = this.build(input.floor);
      changed = true;
    }
    if (seen === undefined || seen.floor !== input.floor || seen.states !== input.states) {
      this.light(input.floor, input.states);
      this.lightScreens(input.states);
      changed = true;
    }
    if (seen === undefined || seen.daylight !== input.daylight) {
      this.setDaylight(input.daylight, input.floor);
      changed = true;
    }
    if (this.setMark(input.floor, input.mark)) changed = true;
    if (!sameHomeMapId(this.floorId, input.floor.id)) {
      this.floorId = input.floor.id;
      this.frameFloor(turn);
    } else if (turn !== this.framedTurn) {
      this.frameFloor(turn);
    }
    if (moved) this.renderer.shadowMap.needsUpdate = true;
    if (changed) this.wake();
  }

  /** Show the whole floor again from `turn` degrees round. */
  frameFloor(turn: number): void {
    const floor = this.input?.floor;
    if (floor === undefined) return;
    this.framedTurn = turn;
    const b = floorBounds(floor);
    const tall = Math.max(...floor.rooms.map((r) => r.height), 2.4);
    const target = new THREE.Vector3((b.minX + b.maxX) / 2, tall * 0.3, (b.minY + b.maxY) / 2);
    // The sphere round the floor and its walls, kept whole in the view.
    const radius = Math.max(Math.hypot(b.maxX - b.minX, b.maxY - b.minY, tall) / 2, 1.5);
    const vfov = (this.camera.fov * Math.PI) / 180;
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * this.camera.aspect);
    const distance = (radius * 1.1) / Math.sin(Math.min(vfov, hfov) / 2);
    // Seen from the plan's foot turned by `turn`, as the model looks are,
    // tipped about 40 degrees down.
    const t = (turn * Math.PI) / 180;
    const polar = (50 * Math.PI) / 180;
    this.controls.target.copy(target);
    this.camera.position.set(
      target.x + Math.sin(t) * Math.sin(polar) * distance,
      target.y + Math.cos(polar) * distance,
      target.z + Math.cos(t) * Math.sin(polar) * distance,
    );
    this.controls.maxDistance = Math.max(distance * 3, 20);
    this.controls.update();
    this.wake();
  }

  /** The rooms' structure and the things in them, each built again only
   * when it changed. True when anything moved, for the shadows. */
  private build(floor: HomeMapFloor): boolean {
    let moved = false;
    const roomIds = new Set<string>();
    for (const room of floor.rooms) {
      roomIds.add(room.id);
      const key = homeMapRoomKey(room);
      const had = this.rooms.get(room.id);
      if (had?.key === key) continue;
      if (had !== undefined) {
        this.scene.remove(had.group);
        disposeTree(had.group);
      }
      const built = buildRoom(room);
      built.group.userData.pick = { kind: "room", roomId: room.id } satisfies HomeMap3DPick;
      this.scene.add(built.group);
      this.rooms.set(room.id, { key, ...built });
      moved = true;
    }
    for (const [id, had] of this.rooms) {
      if (roomIds.has(id)) continue;
      this.scene.remove(had.group);
      disposeTree(had.group);
      this.rooms.delete(id);
      moved = true;
    }
    const thingIds = new Set<string>();
    const holders = new Map([...this.held.values()].map((h) => [`${h.roomId}|${h.object}`, h.pin]));
    for (const room of floor.rooms) {
      room.objects.forEach((object, index) => {
        if (object.hidden === true) return;
        const piece = homeMapPieceOf(object);
        const id = `${room.id}|${index}|${piece?.id ?? `box:${object.kind}`}`;
        thingIds.add(id);
        const pin = holders.get(`${room.id}|${index}`);
        // The lamp rules are a held light's alone; any device lights a TV.
        moved = this.place(id, piece, object, pin !== undefined && isLight(pin) ? pin.id : undefined, pin?.entityId) || moved;
        this.things.get(id)!.group.userData.pick = { kind: "object", roomId: room.id, object: index } satisfies HomeMap3DPick;
      });
    }
    for (const [id, thing] of this.things) {
      if (thingIds.has(id)) continue;
      this.scene.remove(thing.group);
      if (thing.piece === undefined) disposeTree(thing.group);
      else untint(thing);
      this.things.delete(id);
      moved = true;
    }
    return moved;
  }

  /** One thing placed at its middle, foot and turn, its model fitted to its
   * box and in its colours, made the first time it is seen; a change of
   * colour only recolours it. `holds` is the pin of the light it holds, if
   * it holds one, and `device` the entity of whatever device it holds. True
   * when it moved or its shadow changed. */
  private place(id: string, piece: HomeMapFurniturePiece | undefined, object: HomeMapObject, holds: string | undefined, device: string | undefined): boolean {
    let thing = this.things.get(id);
    const size: [number, number, number] = [Math.max(object.size[0], 0.01), Math.max(object.size[1], 0.01), Math.max(object.size[2], 0.01)];
    const lift = Math.max(object.lift ?? 0, 0);
    const turn = (object.turn * Math.PI) / 180;
    const colors = { fabric: object.fabric, wood: object.wood };
    let changed = false;
    if (thing !== undefined && thing.holds !== holds) {
      // A light put in this lamp or taken out: its shade glows or not, and
      // it casts shadows or not.
      thing.holds = holds;
      thing.device = device;
      thing.colors = colors;
      if (piece !== undefined) tint(thing, colors);
      castFor(thing);
      changed = true;
    } else if (thing !== undefined && piece !== undefined && (tintKey(thing.colors) !== tintKey(colors) || thing.device !== device)) {
      // New colours, or a device put on it or taken off (a TV's screen).
      thing.colors = colors;
      thing.device = device;
      tint(thing, colors);
    }
    if (thing === undefined) {
      const group = new THREE.Group();
      thing = { piece, group, size, colors, copies: [], holds, shades: [], device, screens: [], screenOn: false };
      this.things.set(id, thing);
      this.scene.add(group);
      if (piece === undefined) {
        const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: BOX, roughness: 0.85 }));
        box.receiveShadow = true;
        thing.body = box;
        castFor(thing);
        group.add(box);
      } else {
        const made = thing;
        void loadModel(this.base, piece.id).then((model) => {
          if (model === undefined || this.disposed || this.things.get(id) !== made) return;
          made.model = model;
          made.body = fitted(model, made.size);
          tint(made, made.colors);
          castFor(made);
          made.group.add(made.body);
          this.renderer.shadowMap.needsUpdate = true;
          this.wake();
        });
      }
    } else if (thing.group.position.x === object.c[0] && thing.group.position.z === object.c[1] && thing.group.position.y === lift
      && thing.group.rotation.y === turn && thing.size.every((v, i) => v === size[i])) {
      return changed;
    }
    thing.group.position.set(object.c[0], lift, object.c[1]);
    thing.group.rotation.y = turn;
    thing.size = size;
    if (piece === undefined) {
      thing.body?.scale.set(size[0], size[2], size[1]);
      thing.body?.position.set(0, size[2] / 2, 0);
    } else if (thing.model !== undefined && thing.body !== undefined) {
      const s = homeMapModelFit(thing.model.natural, size);
      thing.body.scale.set(s.x, s.y, s.z);
    }
    return true;
  }

  /** A light at each light pin, lit as `states` says: a ceiling light (its
   * icon `ceiling`) shining down in a soft cone with a faint glow round it,
   * any other light every way; the brightest cast shadows as far as the
   * shadow budget goes. */
  private light(floor: HomeMapFloor, states: HomeMapStates | undefined): void {
    const seen = new Set<string>();
    const lit: { lamp: Lamp; level: number }[] = [];
    let moved = false;
    for (const pin of floor.pins) {
      if (!isLight(pin)) continue;
      seen.add(pin.id);
      // A light a lamp holds shines as the lamp's piece says, whatever its
      // pin's icon; any other light down when its icon is a ceiling light.
      const holder = this.held.get(pin.id);
      const cast = holder === undefined ? undefined : homeMapLampPiece(holder.thing.model)?.cast;
      const down = cast !== undefined ? cast === "down" : pin.icon === "ceiling";
      let lamp = this.lamps.get(pin.id);
      if (lamp !== undefined && lamp.down !== down) {
        // Its icon or its lamp changed between shining down and not: made
        // again as the other.
        this.dropLamp(lamp);
        this.lamps.delete(pin.id);
        lamp = undefined;
      }
      if (lamp === undefined) {
        lamp = this.makeLamp(pin.id, down);
        this.lamps.set(pin.id, lamp);
        moved = true;
      }
      // Held, its ball is never drawn, the lamp's shade glowing instead, and
      // a click at the bulb picks the lamp, as a click on the lamp does.
      lamp.held = holder !== undefined;
      lamp.bulb.userData.pick = (holder === undefined ? { kind: "pin", pinId: pin.id } : { kind: "object", roomId: holder.roomId, object: holder.object }) satisfies HomeMap3DPick;
      const x = pin.at[0];
      const y = Math.max(pin.at[2] ?? 1.2, 0.05);
      const z = pin.at[1];
      if (lamp.light.position.x !== x || lamp.light.position.y !== y || lamp.light.position.z !== z) moved = true;
      lamp.light.position.set(x, y, z);
      lamp.fill?.position.set(x, y, z);
      lamp.bulb.position.set(x, y, z);
      if (lamp.light instanceof THREE.SpotLight) {
        lamp.light.target.position.set(x, 0, z);
        lamp.light.target.updateMatrixWorld();
      }
      const { level, rgb } = homeMapLampOf(pin, states);
      lamp.light.color.setRGB(rgb[0], rgb[1], rgb[2], THREE.SRGBColorSpace);
      lamp.fill?.color.copy(lamp.light.color);
      lamp.bulb.material.emissive.copy(lamp.light.color);
      lamp.target = level * lamp.peak;
      if (level > 0) lit.push({ lamp, level });
    }
    for (const [id, lamp] of this.lamps) {
      if (seen.has(id)) continue;
      this.dropLamp(lamp);
      this.lamps.delete(id);
      moved = true;
    }
    lit.sort((a, b) => b.level - a.level);
    const casting = new Set<Lamp>();
    let budget = SHADOW_BUDGET;
    for (const { lamp } of lit) {
      const cost = lamp.down ? 1 : 6;
      if (casting.size >= SHADOW_LIGHTS || cost > budget) continue;
      casting.add(lamp);
      budget -= cost;
    }
    for (const lamp of this.lamps.values()) {
      const cast = casting.has(lamp);
      if (lamp.light.castShadow !== cast) moved = true;
      lamp.light.castShadow = cast;
    }
    if (moved) this.renderer.shadowMap.needsUpdate = true;
  }

  /** Each TV holding a device lit or dark as `states` says its device is
   * (`homeMapScreenOn`); one frame is drawn for a change. */
  private lightScreens(states: HomeMapStates | undefined): void {
    for (const thing of this.things.values()) {
      const on = thing.device !== undefined && thing.piece?.kind === TV && homeMapScreenOn(thing.device, states);
      if (on === thing.screenOn) continue;
      thing.screenOn = on;
      lightScreens(thing);
    }
  }

  /** A light pin's light, its bulb and, for a ceiling light, its glow,
   * added to the scene unlit. */
  private makeLamp(pinId: string, down: boolean): Lamp {
    let light: THREE.PointLight | THREE.SpotLight;
    let fill: THREE.PointLight | undefined;
    if (down) {
      const spot = new THREE.SpotLight(0xffc98a, 0, 0, SPOT_ANGLE, SPOT_PENUMBRA, 2);
      spot.shadow.mapSize.set(1024, 1024);
      spot.shadow.bias = -0.0008;
      spot.shadow.camera.near = 0.05;
      spot.shadow.camera.far = 15;
      // Its target is in the scene so it is placed with everything else.
      this.scene.add(spot.target);
      light = spot;
      // The glow casts nothing: its light is faint, and a shadow of it
      // would cost six maps.
      fill = new THREE.PointLight(0xffc98a, 0, 0, 2);
      this.scene.add(fill);
    } else {
      light = new THREE.PointLight(0xffc98a, 0, 0, 2);
      // A smaller map with a wider radius: a lamp's shade is no point, so
      // its shadows have soft edges, and six faces at 512 cost a quarter of
      // six at 1024.
      light.shadow.mapSize.set(512, 512);
      light.shadow.bias = -0.002;
      light.shadow.camera.near = 0.05;
    }
    light.shadow.radius = SHADOW_SOFTNESS;
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 12), new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0xffc98a, emissiveIntensity: 0 }));
    // A larger ball round the bulb, never drawn, for clicks to find.
    const reach = new THREE.Mesh(new THREE.SphereGeometry(BULB_REACH, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
    bulb.add(reach);
    bulb.userData.pick = { kind: "pin", pinId } satisfies HomeMap3DPick;
    bulb.userData.bulb = true;
    this.scene.add(light, bulb);
    return { light, fill, bulb, down, held: false, peak: down ? SPOT_CANDELA : LAMP_CANDELA, target: 0 };
  }

  /** A light pin's light taken out of the scene and freed. */
  private dropLamp(lamp: Lamp): void {
    this.scene.remove(lamp.light, lamp.bulb);
    if (lamp.light instanceof THREE.SpotLight) this.scene.remove(lamp.light.target);
    lamp.light.dispose();
    if (lamp.fill !== undefined) {
      this.scene.remove(lamp.fill);
      lamp.fill.dispose();
    }
    disposeTree(lamp.bulb);
  }

  private setDaylight(day: boolean, floor: HomeMapFloor): void {
    const b = floorBounds(floor);
    const mid = new THREE.Vector3((b.minX + b.maxX) / 2, 0.8, (b.minY + b.maxY) / 2);
    const half = Math.max(b.maxX - b.minX, b.maxY - b.minY) / 2 + 1.5;
    this.sun.intensity = day ? 2 : 0;
    this.sun.position.set(mid.x - half * 0.4, 4.5 + half * 0.4, mid.z + half * 1.6);
    this.sun.target.position.copy(mid);
    Object.assign(this.sun.shadow.camera, { left: -half * 1.4, right: half * 1.4, top: half * 1.4, bottom: -half * 1.4, near: 0.5, far: half * 6 + 20 });
    this.sun.shadow.camera.updateProjectionMatrix();
    this.sky.intensity = day ? 0.55 : 0.18;
    this.scene.environmentIntensity = day ? 0.35 : 0.22;
    (this.scene.background as THREE.Color).set(day ? DAY_SKY : NIGHT_SKY);
    this.renderer.shadowMap.needsUpdate = true;
  }

  /** The picked room's floor, or each picked thing's box, outlined in
   * blue. True when the outline changed. */
  private setMark(floor: HomeMapFloor, mark: HomeMap3DInput["mark"]): boolean {
    const roomOf = (id: string) => floor.rooms.find((r) => sameHomeMapId(r.id, id));
    const room = mark === undefined || !("roomId" in mark) ? undefined : roomOf(mark.roomId);
    const objects = mark === undefined || !("things" in mark) ? [] : mark.things.flatMap((t) => roomOf(t.roomId)?.objects[t.object] ?? []);
    const key = objects.length > 0 ? JSON.stringify(["things", objects.map((o) => [o.c, o.size, o.turn, o.lift ?? 0])])
      : room !== undefined ? JSON.stringify(["room", room.outline]) : "";
    if (key === this.markKey) return false;
    this.markKey = key;
    if (this.mark !== undefined) {
      this.overlay.remove(this.mark);
      disposeTree(this.mark);
      this.lines.length = 0;
      this.mark = undefined;
    }
    const material = () => {
      const m = new LineMaterial({ color: BLUE, linewidth: 2.5, depthTest: false, transparent: true, opacity: 0.95 });
      m.resolution.set(Math.max(this.host?.clientWidth ?? 1, 1), Math.max(this.host?.clientHeight ?? 1, 1));
      this.lines.push(m);
      return m;
    };
    if (objects.length > 0) {
      const marks = new THREE.Group();
      for (const object of objects) {
        const [w, d, h] = object.size;
        const y0 = Math.max(object.lift ?? 0, 0);
        const corners = [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]] as const;
        const positions: number[] = [];
        for (let i = 0; i < 4; i += 1) {
          const [x0, z0] = corners[i]!;
          const [x1, z1] = corners[(i + 1) % 4]!;
          positions.push(x0, y0, z0, x1, y0, z1, x0, y0 + h, z0, x1, y0 + h, z1, x0, y0, z0, x0, y0 + h, z0);
        }
        const geometry = new LineSegmentsGeometry();
        geometry.setPositions(positions);
        const lines = new LineSegments2(geometry, material());
        lines.renderOrder = 10;
        const group = new THREE.Group();
        group.add(lines);
        group.position.set(object.c[0], 0, object.c[1]);
        group.rotation.y = (object.turn * Math.PI) / 180;
        marks.add(group);
      }
      this.mark = marks;
    } else if (room !== undefined && room.outline.length >= 3) {
      const points = [...room.outline, room.outline[0]!].flatMap(([x, y]) => [x, 0.02, y]);
      const geometry = new LineGeometry();
      geometry.setPositions(points);
      const line = new Line2(geometry, material());
      line.computeLineDistances();
      line.renderOrder = 10;
      this.mark = line;
    }
    if (this.mark !== undefined) this.overlay.add(this.mark);
    return true;
  }

  /** Keep drawing for a moment: the camera easing to rest, a light easing
   * to its new brightness. */
  wake(ms = 400): void {
    if (this.disposed) return;
    this.awakeUntil = Math.max(this.awakeUntil, performance.now() + ms);
    if (this.frame === 0 && typeof requestAnimationFrame === "function") this.frame = requestAnimationFrame(this.tick);
  }

  private readonly tick = (): void => {
    this.frame = 0;
    if (this.disposed) return;
    const moving = this.controls.update();
    let easing = false;
    for (const lamp of this.lamps.values()) {
      const gap = lamp.target - lamp.light.intensity;
      if (Math.abs(gap) > 0.01) {
        lamp.light.intensity += gap * 0.15;
        easing = true;
      } else {
        lamp.light.intensity = lamp.target;
      }
      // The bulb and a ceiling light's glow follow its level, whatever its
      // candela: a ceiling light's bulb looks as a lamp's at the same level.
      const share = lamp.light.intensity / lamp.peak;
      if (lamp.fill !== undefined) lamp.fill.intensity = share * LAMP_CANDELA * SPOT_FILL;
      lamp.bulb.material.emissiveIntensity = share * LAMP_CANDELA * BULB_GLOW;
      lamp.bulb.visible = !lamp.held && share > 0.01 / LAMP_CANDELA;
    }
    // A lamp's shade glows in its light's colour as its light is lit, easing
    // with it.
    for (const thing of this.things.values()) {
      if (thing.holds === undefined || thing.shades.length === 0) continue;
      const lamp = this.lamps.get(thing.holds);
      const share = lamp === undefined ? 0 : lamp.light.intensity / lamp.peak;
      for (const shade of thing.shades) {
        if (lamp !== undefined) shade.emissive.copy(lamp.light.color);
        shade.emissiveIntensity = share * LAMP_CANDELA * SHADE_GLOW;
      }
    }
    this.fadeWalls();
    this.composer.render();
    // The controls' change while they ease after a drag wakes the view from
    // inside this tick, which may have asked for the next frame already;
    // asking again would draw the view twice a frame, then four times, and
    // so on for as long as the easing lasts.
    if (this.frame === 0 && (moving || easing || performance.now() < this.awakeUntil)) this.frame = requestAnimationFrame(this.tick);
  };

  /** Fade the walls between the camera and their room, like a doll's
   * house. */
  private fadeWalls(): void {
    const eye = this.camera.position;
    for (const room of this.rooms.values()) {
      for (const { mesh, nx, nz } of room.walls) {
        const outside = (eye.x - mesh.position.x) * -nx + (eye.z - mesh.position.z) * -nz > 0;
        mesh.material.opacity = outside ? FADED : 1;
        mesh.material.depthWrite = !outside;
      }
    }
  }

  /** Free everything the GPU holds for this view and take the canvas off
   * the page. Models stay loaded for the next view. */
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    if (this.frame !== 0) cancelAnimationFrame(this.frame);
    this.frame = 0;
    if (this.hoverFrame !== 0) cancelAnimationFrame(this.hoverFrame);
    this.hoverFrame = 0;
    this.observer?.disconnect();
    this.controls.dispose();
    for (const lamp of this.lamps.values()) {
      lamp.light.dispose();
      lamp.fill?.dispose();
    }
    this.sun.dispose();
    // The composer frees its two targets; each pass its own targets and
    // shaders (the scene passes hold none).
    for (const pass of this.composer.passes) pass.dispose();
    this.composer.dispose();
    disposeTree(this.scene);
    disposeTree(this.overlay);
    this.environment.dispose();
    this.pmrem.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.canvas.remove();
    this.rooms.clear();
    this.things.clear();
    this.lamps.clear();
  }
}

interface HomeMapInputSeen extends HomeMap3DInput {
  turn: number;
}

/** A pin held by a thing: the thing, by its room and place in that room's
 * list, the thing itself, and the pin. */
interface HeldPin {
  roomId: string;
  object: number;
  thing: HomeMapObject;
  pin: HomeMapPin;
}

/** Each pin a thing of the floor holds, by its pin's id, as a reader takes
 * the links (`homeMapHeldPins`), a hidden thing holding nothing here: its
 * light is drawn as a plain bulb, so it can still be seen and clicked. */
function heldPinsOf(floor: HomeMapFloor): Map<string, HeldPin> {
  const links = homeMapHeldPins(floor);
  const out = new Map<string, HeldPin>();
  for (const pin of floor.pins) {
    const ref = links.get(pin.id.toUpperCase());
    if (ref === undefined) continue;
    const thing = floor.rooms.find((r) => sameHomeMapId(r.id, ref.roomId))?.objects[ref.object];
    if (thing === undefined || thing.hidden === true) continue;
    out.set(pin.id, { roomId: ref.roomId, object: ref.object, thing, pin });
  }
  return out;
}

function floorBounds(floor: HomeMapFloor): { minX: number; minY: number; maxX: number; maxY: number } {
  const points = floor.rooms.flatMap((r) => r.outline);
  if (points.length === 0) return { minX: 0, minY: 0, maxX: 1, maxY: 1 };
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
}

// ── the picker's pictures ────────────────────────────────────────────────

const THUMB_W = 176;
const THUMB_H = 132;
const thumbs = new Map<string, string>();
const waiting = new Map<string, Promise<string | undefined>>();
let thumbRenderer: THREE.WebGLRenderer | undefined;
let thumbScene: THREE.Scene | undefined;
let thumbEnvironment: THREE.Texture | undefined;
let thumbRest: ReturnType<typeof setTimeout> | undefined;
let thumbQueue: Promise<unknown> = Promise.resolve();

/** A piece's picture as already made, if it has been. */
export function homeMapPieceThumbNow(pieceId: string): string | undefined {
  return thumbs.get(pieceId);
}

/** A piece's small picture, a PNG data URL: its model at its own size, seen
 * from the front and a little to one side, drawn once offscreen by the same
 * three.js and kept. One at a time; the drawing set is let go a few seconds
 * after the last. */
export function homeMapPieceThumb(base: string, pieceId: string): Promise<string | undefined> {
  const done = thumbs.get(pieceId);
  if (done !== undefined) return Promise.resolve(done);
  let made = waiting.get(pieceId);
  if (made === undefined) {
    const piece = homeMapPiece(pieceId);
    made = piece === undefined ? Promise.resolve(undefined) : (thumbQueue = thumbQueue.then(() => drawThumb(base, piece), () => drawThumb(base, piece)));
    waiting.set(pieceId, made);
    void made.finally(() => waiting.delete(pieceId));
  }
  return made;
}

async function drawThumb(base: string, piece: HomeMapFurniturePiece): Promise<string | undefined> {
  const model = await loadModel(base, piece.id);
  if (model === undefined) return undefined;
  if (thumbRest !== undefined) clearTimeout(thumbRest);
  if (thumbRenderer === undefined || thumbScene === undefined) {
    thumbRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    thumbRenderer.setPixelRatio(2);
    thumbRenderer.setSize(THUMB_W, THUMB_H, false);
    thumbRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    thumbRenderer.setClearColor(0x000000, 0);
    const pmrem = new THREE.PMREMGenerator(thumbRenderer);
    const room = new RoomEnvironment();
    thumbEnvironment = pmrem.fromScene(room, 0.04).texture;
    room.dispose();
    pmrem.dispose();
    thumbScene = new THREE.Scene();
    thumbScene.environment = thumbEnvironment;
    thumbScene.environmentIntensity = 0.75;
    const key = new THREE.DirectionalLight(0xfff4e6, 1.6);
    key.position.set(2, 4, 3);
    thumbScene.add(key, new THREE.HemisphereLight(0xc8d2e6, 0x3a3027, 0.6));
  }
  const body = fitted(model, piece.size);
  thumbScene.add(body);
  const [w, d, h] = piece.size;
  const camera = new THREE.PerspectiveCamera(28, THUMB_W / THUMB_H, 0.01, 50);
  const target = new THREE.Vector3(0, h / 2, 0);
  const radius = Math.max(Math.hypot(w, d, h) / 2, 0.05);
  const distance = (radius * 1.08) / Math.tan((14 * Math.PI) / 180);
  // From the front (+z) and a little to the right and above.
  const az = (32 * Math.PI) / 180;
  const el = (24 * Math.PI) / 180;
  camera.position.set(target.x + Math.sin(az) * Math.cos(el) * distance, target.y + Math.sin(el) * distance, target.z + Math.cos(az) * Math.cos(el) * distance);
  camera.lookAt(target);
  thumbRenderer.render(thumbScene, camera);
  const url = thumbRenderer.domElement.toDataURL("image/png");
  thumbScene.remove(body);
  thumbs.set(piece.id, url);
  thumbRest = setTimeout(() => {
    thumbRest = undefined;
    thumbEnvironment?.dispose();
    thumbRenderer?.dispose();
    thumbRenderer?.forceContextLoss();
    thumbRenderer = undefined;
    thumbScene = undefined;
    thumbEnvironment = undefined;
  }, 4000);
  return url;
}
