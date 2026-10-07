// The one camera open on the Cameras screen, and its unsaved edit.
//
// Kept here rather than in the element, the way the HTTP actions draft is:
// the element is made anew each time the route opens, and an open camera
// with edits outlives that, so the panel's leave guards can still ask about
// it and coming back finds it as it was left. Memory only.

import { type CameraEdit, sameCameraEdit } from "./model.js";

export interface CameraDraft {
  /** The camera's representative entity, as the list names it. */
  entityId: string;
  /** What Home Assistant holds. */
  base: CameraEdit;
  /** The edit on screen. */
  edit: CameraEdit;
}

let open: CameraDraft | undefined;

/** The camera open in the editor, if any. */
export function openCameraDraft(): CameraDraft | undefined {
  return open;
}

/** Open a camera with nothing changed yet. */
export function startCameraDraft(entityId: string, base: CameraEdit): CameraDraft {
  open = { entityId, base, edit: base };
  return open;
}

/** Put an edit on the open camera. */
export function editCameraDraft(edit: CameraEdit): void {
  if (open !== undefined) open = { ...open, edit };
}

/** Home Assistant now holds `base` for the open camera: after a save, or a
 * read that found it changed while nothing here was. */
export function rebaseCameraDraft(base: CameraEdit, keepEdit: boolean): void {
  if (open !== undefined) open = { ...open, base, edit: keepEdit ? open.edit : base };
}

/** Back to what Home Assistant holds, the camera still open. */
export function discardCameraEdit(): void {
  if (open !== undefined) open = { ...open, edit: open.base };
}

export function cameraDraftDirty(): boolean {
  return open !== undefined && !sameCameraEdit(open.edit, open.base);
}

/** Close the camera, dropping any edit. */
export function dropCameraDraft(): void {
  open = undefined;
}
