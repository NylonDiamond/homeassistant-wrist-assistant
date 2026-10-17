// One library summary the library tests share: two watches and an iPhone,
// pages, status pages and menus, as `library/summary` answers.

import type { LibrarySummary } from "../src/library/client.js";
import type { LinkDevice } from "../src/watch-pages/links.js";

export const CHEN = "chen-watch";
export const JESSE = "jesse-watch";
export const PHONE = "jesse-phone";

export const LIGHTS = "AAAA0000-0000-4000-8000-000000000001";
export const CAMERA = "AAAA0000-0000-4000-8000-000000000002";
export const PAGE1 = "AAAA0000-0000-4000-8000-000000000003";
export const SMART = "AAAA0000-0000-4000-8000-000000000004";
export const LONELY = "AAAA0000-0000-4000-8000-000000000005";
export const SYSTEM = "AAAA0000-0000-4000-8000-0000000000FF";

export const STARTER = "00000000-0000-0000-0000-000000000001";
export const DOORS = "BBBB0000-0000-4000-8000-000000000002";

export const HOME_MENU = "CCCC0000-0000-4000-8000-000000000001";
export const CHEN_MENU = "CCCC0000-0000-4000-8000-000000000002";
export const QUICK = "CCCC0000-0000-4000-8000-000000000003";
export const SPARE = "CCCC0000-0000-4000-8000-000000000004";

export const DEVICES: LinkDevice[] = [
  { ownerId: CHEN, name: "Chen Watch", kind: "watch" },
  { ownerId: JESSE, name: "Jesse Apple Watch", kind: "watch" },
  { ownerId: PHONE, name: "iPhone 15 Pro", kind: "iphone" },
];

export function summary(): LibrarySummary {
  const tile = (n: number) => Array.from({ length: n }, (_, i) => ({ id: `t${i}`, entityId: "light.hall", gridCol: 0, gridRow: i, colSpan: 6, rowSpan: 2 }));
  return {
    pages: {
      [LIGHTS]: { item: { id: LIGHTS, name: "Lights", items: tile(11) }, owners: [CHEN] },
      [CAMERA]: { item: { id: CAMERA, name: "Camera", items: tile(4) }, owners: [CHEN] },
      [PAGE1]: { item: { id: PAGE1, name: "New Page 1", items: tile(1) }, owners: [JESSE, PHONE] },
      [SMART]: { item: { id: SMART, name: "Smart", items: [], dynamicConfig: { rules: [] } }, owners: [JESSE] },
      [LONELY]: { item: { id: LONELY, name: "", items: [] }, owners: [] },
    },
    status_pages: {
      [STARTER]: { item: { id: STARTER, name: "Lights", rows: [{ id: "r1" }] }, owners: [CHEN, JESSE, PHONE] },
      [DOORS]: { item: { id: DOORS, name: "Doors", rows: [{ id: "r1" }, { id: "r2" }] }, owners: [JESSE] },
    },
    menus: {
      [HOME_MENU]: { name: "Home menu", kind: "anywhere", sections: { quickAction: { slots: [] }, pageSwitcher: {} }, owners: [JESSE, PHONE] },
      [CHEN_MENU]: { name: "Chen's menu", kind: "anywhere", sections: { quickAction: { slots: [] } }, owners: [CHEN] },
      [QUICK]: { name: "Entity quick menu", kind: "entity", sections: { entityRadial: {} }, owners: [CHEN, JESSE, PHONE] },
      [SPARE]: { name: "  ", kind: "entity", sections: {}, owners: [] },
    },
    picks: {
      [CHEN]: {
        pages: [{ id: CAMERA }, { id: LIGHTS }],
        status_pages: [{ id: STARTER }],
        menus: { anywhere: CHEN_MENU, entity: QUICK },
      },
      [JESSE]: {
        pages: [{ id: SYSTEM, page: { id: SYSTEM, name: "Settings", isSystemPage: true } }, { id: SMART }, { id: PAGE1.toLowerCase(), isHidden: true }],
        status_pages: [{ id: DOORS }, { id: STARTER }],
        menus: { anywhere: HOME_MENU, entity: QUICK },
      },
      [PHONE]: {
        pages: [{ id: PAGE1 }],
        menus: { anywhere: HOME_MENU, entity: QUICK },
        status_pages: [{ id: STARTER }],
      },
    },
  };
}
