// The one way into the 3D look's chunk (`scene3d.ts` and three.js): loaded
// once, the first time the Model view's 3D look or the furniture picker's
// pictures are asked for. Only a type of it is named anywhere else, so
// three.js stays out of the panel's entry and the editor's own chunk.

let loading: Promise<typeof import("./scene3d.js")> | undefined;

/** The 3D look's module, loaded once. A failed load is tried again next
 * time (an integration updated under an open page). */
export function homeMapLoad3D(): Promise<typeof import("./scene3d.js")> {
  loading ??= import("./scene3d.js").catch((err: unknown) => {
    loading = undefined;
    throw err;
  });
  return loading;
}

/** The furniture folder beside the panel's bundle, from the address the
 * bundle was served from. */
export function homeMapFurnitureBase(bundleUrl: string): string {
  return new URL("furniture/", bundleUrl).href;
}
