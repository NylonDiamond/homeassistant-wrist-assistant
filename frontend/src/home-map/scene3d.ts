// The map editor's real 3D look (three.js), the Model view's and the Both
// view's right side when the dock's look is 3D, and the furniture picker's
// small pictures. This file and three.js load on their own, the first time
// either is asked for (`scene3d-load.ts`), so neither the panel's entry nor
// the editor's own chunk carries them.
//
// The scene is the floor shown, every room of it: each floor laid by its
// finish; walls with their doors, windows and ways through cut out, and
// glass in the windows; the walls between the camera and a room faded, like
// a doll's house; the things in the rooms as the furniture catalog's models
// (`furniture.ts` says which piece and how it fits the thing's box), its
// fabric and wood in the thing's own colours when it has them, a thing
// with no piece as the plain box it always was, a hidden thing nowhere; the
// picked room's floor or the picked thing's box outlined in the editor's
// blue; and each light on the floor as a real light at its pin, lit as Home
// Assistant says it is. Drag to orbit, scroll or pinch to zoom; a click
// hands the page what it met (`onPick`), a thing, a light or a room.
//
// The plan's x stays x, the plan's y becomes z, and up is y; a thing's turn
// is a turn about up by the same angle, a model's front its +z. Shown at
// night only the lights and a faint sky light it, by day a sun comes in
// too; a soft environment stands in for the light a room's walls bounce
// about, so a shadow is never pure black. The numbers were tuned by eye on a
// real scanned room.
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
import { type HomeMapFurniturePiece, homeMapModelFit, homeMapPiece, homeMapPieceOf } from "./furniture.js";
import { type HomeSegment, homeFloorKind, homeWallsOf } from "./geometry.js";
import { type HomeMapFloor, type HomeMapObject, type HomeMapPin, type HomeMapRoom, type HomeMapStates, homeMapPinLook, sameHomeMapId } from "./model.js";

/** What the 3D look draws. */
export interface HomeMap3DInput {
  floor: HomeMapFloor;
  /** Home Assistant's states, or undefined to draw every light off. */
  states: HomeMapStates | undefined;
  /** The picked room, or a thing in it by its place in the room's list. */
  mark: { roomId: string; object?: number } | undefined;
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
const WALL = 0xdcd5c8;
const BOX = 0x8a7f72;
const FINISH: Readonly<Record<string, number>> = { carpet: 0x6f665c, wood: 0x8a6a4a, tile: 0xb9b4aa, stone: 0x8f8a82, plain: 0x8a847c };
const NIGHT_SKY = 0x0f0e0d;
const DAY_SKY = 0x1a1916;

/** A light's brightest, in candela, as tuned on a real lamp. */
const LAMP_CANDELA = 9;
/** How many lit lights cast shadows, the brightest first. */
const SHADOW_LIGHTS = 4;
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
 * models keep the same names): the fabric ones take its `fabric` and the
 * wood ones its `wood`, a darker one that colour times its factor in each
 * linear channel. Every other material (white cloth, metal, glass, a lamp's
 * shade, a plant) keeps the model's own colour. */
export const HOME_MAP_TINTED_MATERIALS: Readonly<Record<string, { part: "fabric" | "wood"; factor: number }>> = {
  carpet: { part: "fabric", factor: 1 },
  carpetBlue: { part: "fabric", factor: 1 },
  carpetDarker: { part: "fabric", factor: 0.645 },
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

/** One room's floor, walls and window glass, and its wall pieces. */
function buildRoom(room: HomeMapRoom): { group: THREE.Group; walls: WallPiece[] } {
  const group = new THREE.Group();
  const walls: WallPiece[] = [];
  if (room.outline.length >= 3) {
    const shape = new THREE.Shape(room.outline.map(([x, y]) => new THREE.Vector2(x, -y)));
    const floor = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshStandardMaterial({ color: FINISH[homeFloorKind(room)] ?? BOX, roughness: 0.95 }));
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
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(s1 - s0, z1 - z0, thick), new THREE.MeshStandardMaterial({ color: WALL, roughness: 0.92, transparent: true }));
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

/** What a room's structure is built from, as text: built again only when
 * it changes. */
function roomKey(room: HomeMapRoom): string {
  return JSON.stringify([room.outline, room.height, room.walls, room.openings, homeFloorKind(room)]);
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
}

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
}

/** A thing's model in its fabric and wood colours: each material that
 * takes one (`homeMapMaterialTint`) swapped for a copy of its own, one copy
 * for each material however many meshes share it. */
function tint(thing: Thing, colors: Pick<HomeMapObject, "fabric" | "wood">): void {
  untint(thing);
  if (thing.body === undefined || (colors.fabric === undefined && colors.wood === undefined)) return;
  const made = new Map<THREE.Material, THREE.Material>();
  const recolour = (material: THREE.Material): THREE.Material => {
    const rgb = homeMapMaterialTint(material.name, colors);
    const color = (material as THREE.MeshStandardMaterial).color as THREE.Color | undefined;
    if (rgb === undefined || color === undefined) return material;
    let copy = made.get(material);
    if (copy === undefined) {
      copy = material.clone();
      (copy as THREE.MeshStandardMaterial).color.setRGB(rgb[0], rgb[1], rgb[2], THREE.LinearSRGBColorSpace);
      made.set(material, copy);
      thing.copies.push(copy);
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
  light: THREE.PointLight;
  bulb: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
  /** The intensity it eases towards. */
  target: number;
}

export class HomeMapScene3D {
  readonly canvas: HTMLCanvasElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(32, 1, 0.05, 200);
  private readonly controls: OrbitControls;
  private readonly pmrem: THREE.PMREMGenerator;
  private readonly environment: THREE.Texture;
  private readonly sky = new THREE.HemisphereLight(0x8a9ab8, 0x2a2018, 0.18);
  private readonly sun = new THREE.DirectionalLight(0xfff1dc, 0);
  private readonly rooms = new Map<string, { key: string; group: THREE.Group; walls: WallPiece[] }>();
  private readonly things = new Map<string, Thing>();
  private readonly lamps = new Map<string, Lamp>();
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

  /** A click (a press let go where it started) on the view: what is under
   * it, or undefined for empty space. */
  onPick?: (pick: HomeMap3DPick | undefined) => void;

  /** `base` is the furniture folder's address, ending in a slash. */
  constructor(private readonly base: string) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
    this.scene.add(this.sky, this.sun, this.sun.target);
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
    });
    this.canvas.addEventListener("pointerup", (e) => {
      const press = this.press;
      this.press = undefined;
      if (press === undefined || press.id !== e.pointerId || Math.hypot(e.clientX - press.x, e.clientY - press.y) > CLICK_SLOP) return;
      this.onPick?.(this.pickAt(e.clientX, e.clientY));
    });
    this.canvas.addEventListener("pointercancel", () => { this.press = undefined; });
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
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    for (const m of this.lines) m.resolution.set(width, height);
    this.wake();
  }

  /** Draw `input`, building again only what changed; the lights follow the
   * states without anything being built. A new floor is framed whole, from
   * `turn` degrees round, as the model looks turn. */
  update(input: HomeMap3DInput, turn: number): void {
    if (this.disposed) return;
    const seen = this.input;
    this.input = { ...input, turn };
    let moved = false;
    if (seen === undefined || seen.floor !== input.floor) moved = this.build(input.floor);
    if (seen === undefined || seen.floor !== input.floor || seen.states !== input.states) this.light(input.floor, input.states);
    if (seen === undefined || seen.daylight !== input.daylight) this.setDaylight(input.daylight, input.floor);
    this.setMark(input.floor, input.mark);
    if (!sameHomeMapId(this.floorId, input.floor.id)) {
      this.floorId = input.floor.id;
      this.frameFloor(turn);
    } else if (turn !== this.framedTurn) {
      this.frameFloor(turn);
    }
    if (moved) this.renderer.shadowMap.needsUpdate = true;
    this.wake();
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
      const key = roomKey(room);
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
    for (const room of floor.rooms) {
      room.objects.forEach((object, index) => {
        if (object.hidden === true) return;
        const piece = homeMapPieceOf(object);
        const id = `${room.id}|${index}|${piece?.id ?? `box:${object.kind}`}`;
        thingIds.add(id);
        moved = this.place(id, piece, object) || moved;
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
   * colour only recolours it. True when it moved. */
  private place(id: string, piece: HomeMapFurniturePiece | undefined, object: HomeMapObject): boolean {
    let thing = this.things.get(id);
    const size: [number, number, number] = [Math.max(object.size[0], 0.01), Math.max(object.size[1], 0.01), Math.max(object.size[2], 0.01)];
    const lift = Math.max(object.lift ?? 0, 0);
    const turn = (object.turn * Math.PI) / 180;
    const colors = { fabric: object.fabric, wood: object.wood };
    if (thing !== undefined && piece !== undefined && tintKey(thing.colors) !== tintKey(colors)) {
      thing.colors = colors;
      tint(thing, colors);
    }
    if (thing === undefined) {
      const group = new THREE.Group();
      thing = { piece, group, size, colors, copies: [] };
      this.things.set(id, thing);
      this.scene.add(group);
      if (piece === undefined) {
        const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: BOX, roughness: 0.85 }));
        box.castShadow = true;
        box.receiveShadow = true;
        thing.body = box;
        group.add(box);
      } else {
        const made = thing;
        void loadModel(this.base, piece.id).then((model) => {
          if (model === undefined || this.disposed || this.things.get(id) !== made) return;
          made.model = model;
          made.body = fitted(model, made.size);
          tint(made, made.colors);
          made.group.add(made.body);
          this.renderer.shadowMap.needsUpdate = true;
          this.wake();
        });
      }
    } else if (thing.group.position.x === object.c[0] && thing.group.position.z === object.c[1] && thing.group.position.y === lift
      && thing.group.rotation.y === turn && thing.size.every((v, i) => v === size[i])) {
      return false;
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

  /** A light at each light pin, lit as `states` says; the brightest few
   * cast shadows. */
  private light(floor: HomeMapFloor, states: HomeMapStates | undefined): void {
    const seen = new Set<string>();
    const lit: { lamp: Lamp; level: number }[] = [];
    let moved = false;
    for (const pin of floor.pins) {
      if (!isLight(pin)) continue;
      seen.add(pin.id);
      let lamp = this.lamps.get(pin.id);
      if (lamp === undefined) {
        const light = new THREE.PointLight(0xffc98a, 0, 0, 2);
        light.shadow.mapSize.set(1024, 1024);
        light.shadow.bias = -0.002;
        light.shadow.radius = 4;
        light.shadow.camera.near = 0.05;
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 12), new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0xffc98a, emissiveIntensity: 0 }));
        // A larger ball round the bulb, never drawn, for clicks to find.
        const reach = new THREE.Mesh(new THREE.SphereGeometry(BULB_REACH, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
        bulb.add(reach);
        bulb.userData.pick = { kind: "pin", pinId: pin.id } satisfies HomeMap3DPick;
        lamp = { light, bulb, target: 0 };
        this.lamps.set(pin.id, lamp);
        this.scene.add(light, bulb);
        moved = true;
      }
      const x = pin.at[0];
      const y = Math.max(pin.at[2] ?? 1.2, 0.05);
      const z = pin.at[1];
      if (lamp.light.position.x !== x || lamp.light.position.y !== y || lamp.light.position.z !== z) moved = true;
      lamp.light.position.set(x, y, z);
      lamp.bulb.position.set(x, y, z);
      const { level, rgb } = homeMapLampOf(pin, states);
      lamp.light.color.setRGB(rgb[0], rgb[1], rgb[2], THREE.SRGBColorSpace);
      lamp.bulb.material.emissive.copy(lamp.light.color);
      lamp.target = level * LAMP_CANDELA;
      if (level > 0) lit.push({ lamp, level });
    }
    for (const [id, lamp] of this.lamps) {
      if (seen.has(id)) continue;
      this.scene.remove(lamp.light, lamp.bulb);
      lamp.light.dispose();
      disposeTree(lamp.bulb);
      this.lamps.delete(id);
      moved = true;
    }
    lit.sort((a, b) => b.level - a.level);
    const casting = new Set(lit.slice(0, SHADOW_LIGHTS).map((l) => l.lamp));
    for (const lamp of this.lamps.values()) {
      const cast = casting.has(lamp);
      if (lamp.light.castShadow !== cast) moved = true;
      lamp.light.castShadow = cast;
    }
    if (moved) this.renderer.shadowMap.needsUpdate = true;
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

  /** The picked room's floor, or the picked thing's box, outlined in
   * blue. */
  private setMark(floor: HomeMapFloor, mark: HomeMap3DInput["mark"]): void {
    const room = mark === undefined ? undefined : floor.rooms.find((r) => sameHomeMapId(r.id, mark.roomId));
    const object = mark?.object === undefined ? undefined : room?.objects[mark.object];
    const key = object !== undefined ? JSON.stringify(["thing", object.c, object.size, object.turn, object.lift ?? 0]) : room !== undefined ? JSON.stringify(["room", room.outline]) : "";
    if (key === this.markKey) return;
    this.markKey = key;
    if (this.mark !== undefined) {
      this.scene.remove(this.mark);
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
    if (object !== undefined) {
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
      this.mark = group;
    } else if (room !== undefined && room.outline.length >= 3) {
      const points = [...room.outline, room.outline[0]!].flatMap(([x, y]) => [x, 0.02, y]);
      const geometry = new LineGeometry();
      geometry.setPositions(points);
      const line = new Line2(geometry, material());
      line.computeLineDistances();
      line.renderOrder = 10;
      this.mark = line;
    }
    if (this.mark !== undefined) this.scene.add(this.mark);
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
      lamp.bulb.material.emissiveIntensity = lamp.light.intensity * 0.6;
      lamp.bulb.visible = lamp.light.intensity > 0.01;
    }
    this.fadeWalls();
    this.renderer.render(this.scene, this.camera);
    if (moving || easing || performance.now() < this.awakeUntil) this.frame = requestAnimationFrame(this.tick);
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
    this.observer?.disconnect();
    this.controls.dispose();
    for (const lamp of this.lamps.values()) lamp.light.dispose();
    this.sun.dispose();
    disposeTree(this.scene);
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
