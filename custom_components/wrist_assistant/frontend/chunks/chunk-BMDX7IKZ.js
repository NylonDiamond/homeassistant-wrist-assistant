import{d as S,h as _,i as T}from"./chunk-XK4RPKXH.js";import{Ea as x,Fa as U,fa as I,ga as N,ha as F,la as L,ma as u,na as M,sa as $}from"./chunk-444RQRAM.js";import{b as O,e as j}from"./chunk-HQUNKMJR.js";import{qh as c}from"./chunk-FEBFQRVD.js";import{D as P,M as D,N as E,Na as p,O as z,Oa as W,Ta as H,b as g,ba as w,ca as A,d as m,e as v,h as y,l as k,xa as R,ya as C}from"./chunk-3XA74UYB.js";import{b as f}from"./chunk-6ZDBXU6B.js";var h=[{kind:"pages",label:"pages"},{kind:"menus",label:"menus"},{kind:"status_pages",label:"status pages"},{kind:"control_center",label:"Control Center"},{kind:"voice",label:"voice"},{kind:"behavior",label:"settings"},{kind:"rooms",label:"rooms"},{kind:"notification_style",label:"notification style"}],Y=h.filter(e=>e.kind==="pages"||e.kind==="menus"||e.kind==="status_pages"||e.kind==="behavior"||e.kind==="rooms"),J="HTTP actions",Q="voice",Z=["pages","status_pages","menus"];function B(e,n){return K(h,e,n)}function ee(e){return K(Y,e,void 0)}function K(e,n,t){let i=[],o=[],r=!1,a=(d,l)=>{let b=w(d);b==="waiting"?i.push(l):b==="delivered"&&(r=!0),A(d)&&o.push(l)};for(let d of e)a(n.get(d.kind),d.label),d.kind===Q&&a(t,J);let s=Z.some(d=>w(n.get(d))==="none");return{waiting:i,delivered:r,...o.length===0?{}:{rejected:o},...s?{noRecord:!0}:{}}}function ne(e,n){if(typeof e!="object"||e===null||typeof e.revision!="number")return;let t=e.delivered?.[n];return{revision:e.revision,delivered_revision:typeof t=="number"?t:0}}function xe(e,n,t=[]){let i=new Map;for(let o of n){let r=e.owners[o]??{};i.set(o,B(new Map(Object.entries(r)),ne(e.http_actions,o)))}for(let o of t)i.set(o,ee(new Map(Object.entries(e.owners[o]??{}))));return i}function be(e){return typeof e=="object"&&e!==null&&e.code==="unknown_command"}async function fe(e){let n=await Promise.allSettled(h.map(i=>e(i.kind)));if(n.every(i=>i.status==="rejected"))return;let t=new Map;return h.forEach((i,o)=>{let r=n[o];t.set(i.kind,r.status==="fulfilled"?r.value:void 0)}),B(t)}var ie="your iPhone",te=`HouseLit ${z(D)} on the watch`;function oe(e){return E(e)?te:ie}function V(e,n,t=!1,i,o={}){let r=[...e==="waiting"?["complications"]:[],...n?.waiting??[],...o.waitsForUpdate===!0||t&&n?.noRecord===!0?[oe(i)]:[],...o.seedWaits===!0?[p]:[]],a=n?.rejected??[],s=r.length>0?"waiting":e==="synced"||n?.delivered===!0?"synced":"idle";return a.length===0?{sync:s,waitingFor:r}:{sync:s,waitingFor:r,rejected:[...a]}}var re="Watch could not use the last save",ae="iPhone could not use the last save",se="Phone could not use the last save";function q(e,n="watch",t){let i=n==="iphone"?t==="android"?se:ae:re;if(e.length===0)return i;let o=e.length===1?e[0]:`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`;return`${i} of its ${o}`}function G(e){return e.join(", ")}function me(e){return[...e].sort().join(`
`)}function We(e,n,t){let i=e.map(n);return e.map((o,r)=>({id:o.owner_watch_id,name:i.filter(a=>a===i[r]).length>1?t(o):i[r],kind:o.device_kind,token:o.token,appliedToken:o.applied_token,count:o.complication_count,orphan:o.is_orphan,waitsForIphone:C(o)==="wait",waitsForUpdate:R(o),seedWaits:H(o),appVersion:v(o),...m(o)?{platform:g(o)}:{}}))}function He(e){return(e.rejected?.length??0)>0?de:T(e.sync)}var de="Not synced";function Oe(e){return e.sync==="waiting"||(e.rejected?.length??0)>0}function je(e,n){return[(e.rejected?.length??0)>0?q(e.rejected,e.kind,e.platform):void 0,e.sync==="waiting"?`Waiting for ${G(e.waitingFor)}`:void 0,n].filter(t=>t!==void 0).join(" \xB7 ")}function Ie(e,n=new Map){let t=[];for(let i of e){let o=_(i);if(o===void 0)continue;let r=P({owner_watch_id:i.id,device_kind:i.kind});if(r==="library")continue;let{sync:a,waitingFor:s,rejected:d}=V(o,n.get(i.id),r==="watch"&&i.waitsForIphone===!0,i.appVersion,{waitsForUpdate:r==="watch"&&i.waitsForUpdate===!0,seedWaits:r==="watch"&&i.seedWaits===!0}),l=d===void 0?{id:i.id,name:i.name,kind:r,sync:a,waitingFor:s}:{id:i.id,name:i.name,kind:r,sync:a,waitingFor:s,rejected:d};t.push(i.platform===void 0?l:{...l,platform:i.platform})}return[...t.filter(i=>i.kind==="watch"),...t.filter(i=>i.kind==="iphone")]}function Ne(e,n){if(!X(n))return 0;let t=n[e==="pages"?"pages":e==="status_pages"?"statusPages":"entities"];return Array.isArray(t)?t.filter(i=>X(i)&&!(e==="pages"&&i.isSystemPage===!0)).length:0}function X(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}var le={pages:"pages","status-pages":"status_pages","control-center":"control_center"};function Fe(e,n=!1){let t={kind:"list",label:"Control Center",filter:"control"},i={kind:"list",label:e==="watch"?"Complications":"Widgets",filter:"all"},o=s=>{let d=le[s.id];return d===void 0?{kind:"screen",label:s.label,screen:s}:{kind:"screen",label:s.label,screen:s,count:d}};if(e==="iphone"&&!n)return[i,t];let r=e==="iphone"?$:u.filter(s=>s.shared!==!0&&s.retired!==!0&&s.id!=="watch-complications"),a=[];for(let s of r)a.push(o(s)),s.id==="pages"&&a.push(i),s.id==="status-pages"&&a.push(t);return a.push(o(M)),a}function Le(e,n){let t=new Map,i=["pages","status_pages","control_center"];if(!Object.values(e.owners).some(r=>Object.values(r).some(a=>typeof a.items=="number")))return t;for(let r of n){let a=e.owners[r]??{},s={};for(let d of i)s[d]=a[d]?.items??0;t.set(r,s)}return t}function Me(e,n){if(e?.polling===!0)return"Online now";let t=e?.last_seen_seconds;if(typeof t=="number")return`Seen ${S(t+Math.max(0,n))}`}var $e="Shared";function Ue(){return k("Kept once for the whole home. Every watch and iPhone uses them.","Kept once for the whole home. Every watch and phone uses them.")}function Be(e=ce){return u.filter(n=>n.shared===!0&&n.retired!==!0&&!L.some(t=>t.path===n.path)&&(n.capability===void 0||e(n.capability)))}function ce(e){return e===O&&j()}var Ke={"http-actions":"Web requests every device can run",cameras:"How each camera is framed in alerts"},Ve="On a watch, Synced and Waiting cover its complications and the whole watch app: pages, menus and settings.";function qe(e){return e===void 0||e.polling===!0?!1:!e.app_version&&(e.applied_token===null||e.applied_token===void 0)&&typeof e.last_seen_seconds!="number"}var Ge="Never connected";function Xe(e){return e?.user_gone===!0}var Ye="Its Home Assistant user was removed";function Je(e){let n=e?.pending_changes;if(!(typeof n!="number"||n<=0))return`${n} ${n===1?"change":"changes"} to pick up`}function Qe(e){return e.waitingFor.length===1&&e.waitingFor[0]===p&&(e.rejected?.length??0)===0}function Ze(e,n=0){let t=s=>e.filter(d=>d===s).length,i=t("waiting"),o=t("synced"),r=t("asleep"),a=e.length;return i>0&&n===i?{text:W,tone:"waiting"}:i>0?{text:`${i} waiting`,tone:"waiting"}:o===a?{text:"All synced",tone:"synced"}:r===a?{text:`${r} asleep`,tone:""}:r>0&&o>0?{text:`${o} synced, ${r} asleep`,tone:""}:r>0?{text:`${r} asleep`,tone:""}:{text:`${o} of ${a} synced`,tone:""}}function en(e,n,t,i){let o=U(e);if(o!==void 0&&"all"in o)return{pick:t.pick,all:!0};let r=e?.path??"";if(o===void 0&&!(r===I||r==="/"||r===N))return{pick:t.pick,all:t.all};if(o===void 0&&t.all)return{pick:t.pick,all:!0,rewrite:x(F)};let s=o?.owner;if(n.length===0)return{pick:s??t.pick,all:!1};let d=pe(n,s??t.pick,i);return d===void 0||d===s?{pick:d,all:!1}:{pick:d,all:!1,rewrite:x(d)}}async function nn(e){try{if(navigator.clipboard?.writeText!==void 0)return await navigator.clipboard.writeText(e),!0}catch{}let n=document.createElement("textarea");n.value=e,n.setAttribute("readonly",""),n.style.cssText="position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;",document.body.append(n),n.select();try{return document.execCommand("copy")}catch{return!1}finally{n.remove()}}function tn(e,n){let t=[],i=new Set;e.forEach((r,a)=>{let s=new Set(r.owners.map(l=>l.owner_watch_id)),d=n.filter(l=>s.has(l.id));for(let l of d)i.add(l.id);d.length>0&&t.push({person:r,index:a,rows:d})});let o=n.filter(r=>!i.has(r.id));return o.length>0&&t.push({index:-1,rows:o}),t}function on(e,n){let t=[y(g(e===void 0?{device_kind:n}:{...e,device_kind:n}))];return e?.app_version&&t.push(`App ${e.app_version}${e.app_build?` (${e.app_build})`:""}`),n==="watch"&&e?.paired_iphone_name&&e.has_iphone===!0&&t.push(`Set up by ${e.paired_iphone_name}`),t}function pe(e,n,t){if(n!==void 0&&e.some(o=>o.id===n))return n;let i;for(let o of e){let r=t(o.id),a=r?.polling===!0?0:r?.last_seen_seconds;typeof a=="number"&&(i===void 0||a<i.seconds)&&(i={id:o.id,seconds:a})}return i?.id??e[0]?.id}function rn(e,n,t){if(e.length===0)return;let i=e.findIndex(o=>o.id===n);return i<0?e[0].id:e[(i+t+e.length)%e.length].id}function an(e,n,t,i){let o=e==="watch"?n===1?"complication":"complications":n===1?"widget":"widgets";return[[i===void 0?void 0:`${i} ${i===1?"page":"pages"}`,`${n} ${o}`].filter(a=>a!==void 0).join(", "),t?.replace(/^Seen /,"")].filter(a=>a!==void 0).join(" \xB7 ")}var he={pages:{icon:"pages",hue:"var(--wa-hue-green)",blurb:"The screens you swipe between."},menus:{icon:"radial",hue:"var(--wa-hue-orange)",blurb:"The quick menus and the page switcher."},"status-pages":{icon:"checklist",hue:"var(--wa-hue-yellow)",blurb:"Lists to read at a glance."},"watch-complications":{icon:"gauge",hue:"var(--wa-hue-blue)",blurb:"On this watch\u2019s faces."},rooms:{icon:"home",hue:"var(--wa-hue-pink)",blurb:"Room pages and point control."},voice:{icon:"mic",hue:"var(--wa-hue-red)",blurb:"How the watch listens and speaks."},settings:{icon:"sliders",hue:"var(--wa-hue-grey)",blurb:"Gestures, wrist twists and how it connects."}},ge="Gestures, page look and cameras.";function sn(e,n){return n==="iphone"&&e==="settings"?ge:he[e]?.blurb}var dn=f`
  .home {
    flex: 1 1 auto; min-height: 0; overflow: auto; box-sizing: border-box;
    background: var(--wa-bg); color: var(--wa-ink);
  }
  .home-pad { padding: clamp(20px, 4vh, 40px) clamp(16px, 4vw, 40px) 48px; }
  .home-wrap { width: min(1240px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 28px; }
  /* The sheen every Home card shares: a fill a shade lighter at the top, and
     a hairline of light along the top edge, so a card reads as a surface
     the light falls on rather than a flat box. */
  .home {
    --home-card: linear-gradient(180deg, color-mix(in srgb, var(--wa-ink) 4%, var(--wa-card)), var(--wa-card));
    --home-lift: inset 0 1px 0 color-mix(in srgb, var(--wa-ink) 7%, transparent);
  }
  .home-head { display: flex; align-items: flex-end; flex-wrap: wrap; gap: 12px 16px; padding: 0 2px; }
  .home-head-text { flex: 1 1 320px; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .home-head h1 { margin: 0; font-size: 30px; font-weight: 500; letter-spacing: -.02em; }
  .home-lead { margin: 0; font-size: 14px; color: var(--wa-muted); }
  /* A person who is not an administrator sees only their own devices: one
     quiet line under the lead says so. */
  .home-scope { margin: 0; font-size: 12.5px; color: var(--wa-muted); }
  .home-head-acts { display: flex; flex-wrap: wrap; gap: 8px; }
  .home-title { margin: 0; font-size: 11px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: var(--wa-ink); }
  a.home-btn, button.home-btn {
    display: inline-flex; align-items: center; gap: 6px; box-sizing: border-box; height: 32px; padding: 0 13px;
    border-radius: 7px; font: inherit; font-size: 12.5px; font-weight: 500; cursor: pointer; white-space: nowrap; text-decoration: none;
    color: var(--wa-ink); background: var(--home-card, var(--wa-card)); border: 1px solid var(--wa-line-strong);
    box-shadow: var(--home-lift, none);
  }
  a.home-btn:hover, button.home-btn:hover:not(:disabled) { background: var(--wa-hover); }
  a.home-btn:focus-visible, button.home-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.home-btn:disabled { opacity: .5; cursor: default; }
  .home-btn svg.ui-icon { width: 14px; height: 14px; }
  /* Adding something, a device or a complication, is outlined green, the way
     every Add is across the panel. */
  .home-btn.add { border-color: color-mix(in srgb, var(--wa-hue-green) 70%, var(--wa-card)); }
  .home-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: var(--wa-muted); }
  .home-dot.synced { background: var(--wa-green); }
  .home-dot.waiting { background: var(--wa-amber); }
  .home-small { margin: 0; font-size: 11.5px; line-height: 1.45; color: var(--wa-muted); }
  .home-empty { margin: 0; font-size: 13px; color: var(--wa-muted); }
  /* The devices drawn on Home and in the pairing dialog light their slots
     in their person's color (--c). */
  .ha-art { display: block; }
  .ha-lit { stroke: var(--c); }
  .ha-lit-fill { fill: var(--c); }
  .ha-edge-wait { stroke: var(--wa-amber); stroke-opacity: .7; }
  /* Pair a device, the only card in a home with no devices yet: a dashed
     outline, nothing lit. */
  .home-devices { margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(240px, 100%), 1fr)); gap: 10px; }
  .home-devices > li:has(> button.home-device-add) { display: flex; }
  button.home-device-add {
    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-height: 120px;
    box-sizing: border-box; padding: 16px; border-radius: 12px; font: inherit; cursor: pointer;
    color: var(--wa-muted); background: transparent; border: 1.5px dashed var(--wa-line-strong);
  }
  button.home-device-add:hover { color: var(--wa-ink); border-color: var(--wa-muted); background: var(--wa-hover); }
  button.home-device-add:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.home-device-add b { font-size: 14px; font-weight: 600; color: var(--wa-ink); }
  button.home-device-add span { font-size: 12.5px; }
  button.home-device-add svg.ui-icon { width: 20px; height: 20px; }

  /* ── The device browser ── */
  .hb { display: flex; flex-wrap: wrap; align-items: stretch; min-height: 100%; }
  /* Beside the device, the side bar stays on screen while the device (or
     All devices) scrolls, and scrolls in its own box when it is longer:
     a sticky column one screen tall. The browser is a size container for
     that height, which its parent's flex column gives it. */
  .home.hb { container: hb / size; }
  @container hb (min-width: 820px) {
    .hb-side {
      position: sticky; top: 0; align-self: flex-start; height: 100cqh;
      overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin;
    }
    /* A fixed height must not squeeze its parts: it scrolls instead. */
    .hb-side > * { flex-shrink: 0; }
  }
  /* Overview, picked, is lit like a picked device, in the accent. */
  button.hb-row.hb-all { --c: var(--wa-accent); }
  /* The side bar: the head with + Pair, Overview, then every device by person. */
  .hb-side {
    flex: 1 1 280px; max-width: 340px; min-width: 0; box-sizing: border-box;
    display: flex; flex-direction: column; gap: 16px; padding: 20px 12px 18px;
    background: color-mix(in srgb, var(--wa-card) 45%, var(--wa-bg)); border-right: 1px solid var(--wa-line);
  }
  .hb-head { display: flex; flex-direction: column; gap: 4px; padding: 0 8px; }
  .hb-head h1 { margin: 0; font-size: 20px; font-weight: 500; letter-spacing: -.02em; }
  .hb-head .home-lead { font-size: 12px; line-height: 1.45; }
  .hb-head .home-scope { font-size: 11.5px; }
  /* The title with + Pair beside it, where a new device will appear. */
  .hb-head-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .hb-head-top .home-btn { height: 28px; padding: 0 11px; font-weight: 600; }
  .hb-head-top .home-btn svg.ui-icon { width: 13px; height: 13px; }
  /* One person: their picture (or initial) ringed in grey (the colors are
     the devices'), their
     name in small capitals, how their devices stand, then a row each, all
     in one box. */
  .hb-group { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .hb-group:not(.hb-shared) {
    padding: 4px 4px 6px; border-radius: 14px; border: 1px solid var(--wa-line);
    background: var(--home-card); box-shadow: var(--home-lift);
  }
  .hb-person { display: flex; align-items: center; gap: 9px; padding: 8px 8px 6px; min-width: 0; }
  .hb-avatar {
    width: 22px; height: 22px; flex: none; box-sizing: border-box; border-radius: 50%; overflow: hidden;
    display: grid; place-items: center; border: 1.5px solid var(--c); background: var(--wa-field);
    font-size: 10px; font-weight: 600; color: var(--c);
  }
  .hb-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .hb-person-name {
    flex: 1; min-width: 0; margin: 0; overflow-wrap: anywhere;
    font-size: 11px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--wa-label);
  }
  .hb-person-sum { flex: 0 1 auto; min-width: 0; max-width: 62%; display: flex; align-items: center; justify-content: flex-end; gap: 6px; font-size: 11px; color: var(--wa-muted); text-align: right; }
  .hb-person-sum .home-dot { flex: none; }
  .hb-person-note { padding: 0 8px 4px; font-size: 11px; color: var(--wa-muted); }
  /* A device's row: its small drawing, its name, what it holds and when it
     was heard from, and a dot in its sync color. The picked one is lit in
     its device's color from the top left. */
  button.hb-row {
    --s: var(--wa-muted);
    display: flex; align-items: center; gap: 11px; width: 100%; box-sizing: border-box; padding: 6px 10px 6px 6px;
    border-radius: 11px; font: inherit; text-align: left; cursor: pointer; color: var(--wa-ink);
    background: transparent; border: 1px solid transparent;
    transition: background-color .15s ease;
  }
  button.hb-row.synced { --s: var(--wa-green); }
  button.hb-row.waiting { --s: var(--wa-amber); }
  button.hb-row.rejected { --s: var(--error-color); }
  /* Asleep: unseen for a week with changes waiting. Grey, never amber, since
     there is nothing to do about it (\`sync-pill.ts\`). */
  button.hb-row.asleep { --s: var(--wa-faint); }
  .hb-asleep { color: var(--wa-faint); }
  button.hb-row:hover { background-color: var(--wa-hover); }
  button.hb-row:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.hb-row.on {
    --lo-fill: var(--wa-card); --lo-mid: var(--wa-card-mid);
    ${c}
    border-width: 1px;
    box-shadow: var(--home-lift);
  }
  .hb-icon {
    width: 38px; height: 38px; flex: none; box-sizing: border-box; border-radius: 9px;
    display: grid; place-items: center; background: var(--wa-field); border: 1px solid var(--wa-line);
  }
  /* The device's own color (device-colors.ts) on its drawing's box. */
  .hb-icon.tinted { border-color: color-mix(in srgb, var(--c) 60%, transparent); }
  .hb-row-t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .hb-row-name { font-size: 13px; font-weight: 500; line-height: 1.3; overflow-wrap: anywhere; }
  .hb-row-sub { font-size: 11px; line-height: 1.3; color: var(--wa-muted); overflow-wrap: anywhere; }
  .hb-row-dot { width: 7px; height: 7px; flex: none; border-radius: 50%; background: var(--s); }
  button.hb-row.on .hb-row-dot { box-shadow: 0 0 0 3px color-mix(in srgb, var(--s) 22%, transparent); }
  /* The Library, the whole home's screens: rows like a device's, as links,
     each glyph in its screen's hue as the watch row draws it, under a line
     that says what they are. */
  .hb-shared { margin-top: 6px; }
  .hb-shared .hb-lead { margin: -2px 0 4px; padding: 0 8px; font-size: 11px; line-height: 1.35; color: var(--wa-muted); }
  a.hb-link {
    display: flex; align-items: center; gap: 11px; width: 100%; box-sizing: border-box; padding: 6px 10px 6px 6px;
    border-radius: 11px; text-decoration: none; color: var(--wa-ink); border: 1px solid transparent;
    transition: background-color .15s ease;
  }
  a.hb-link:hover { background-color: var(--wa-hover); }
  a.hb-link:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .hb-link-ic { color: var(--h); }
  .hb-link-ic svg.ui-icon { width: 18px; height: 18px; }
  .hb-side > .home-small { margin-top: auto; padding: 10px 8px 0; font-size: 11px; }

  /* The picked device. */
  .hb-main { flex: 999 1 520px; min-width: 0; box-sizing: border-box; padding: 18px clamp(16px, 3vw, 32px) 48px; container-type: inline-size; }
  .hb-detail { max-width: 940px; margin: 0; display: flex; flex-direction: column; gap: 18px; }
  .hb-main > .home-welcome-slot { max-width: 940px; margin: 0 auto 18px; }
  /* Its bar: whose it is and its name, the arrows to the device before and
     after it, Rename and Remove. */
  /* It stays at the top while the device's page scrolls under it, on the
     page's own ground, so whose page it is and its arrows never go. */
  .hb-bar {
    display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; min-height: 34px;
    position: sticky; top: 0; z-index: 6; margin: 0 -8px; padding: 8px;
    background: var(--wa-bg); box-shadow: 0 1px 0 var(--wa-line);
  }
  .hb-crumb { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; min-width: 0; font-size: 12.5px; color: var(--wa-muted); }
  .hb-crumb i { width: 7px; height: 7px; flex: none; border-radius: 50%; background: var(--c); }
  .hb-crumb b { font-weight: 500; color: var(--wa-ink); overflow-wrap: anywhere; }
  .hb-crumb svg.ui-icon { width: 12px; height: 12px; color: var(--wa-faint); }
  .hb-acts { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  button.hb-step {
    width: 32px; height: 32px; box-sizing: border-box; border-radius: 9px; display: grid; place-items: center; cursor: pointer;
    color: var(--wa-label); background: var(--home-card); border: 1px solid var(--wa-line-strong); box-shadow: var(--home-lift);
  }
  button.hb-step:hover { background: var(--wa-hover); }
  button.hb-step:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.hb-step svg.ui-icon { width: 14px; height: 14px; }
  /* The ··· menu: Rename, Copy device address and, last and in red, Remove. */
  .hb-more { display: inline-flex; }
  .pop-menu.side-pop.hb-menu { min-width: 200px; }
  .pop-menu.side-pop.hb-menu .row { flex-direction: row; align-items: center; gap: 9px; font-weight: 500; font-size: 13px; }
  .hb-menu .row svg.ui-icon { width: 14px; height: 14px; flex: none; color: var(--wa-muted); }
  .hb-menu .row.danger svg.ui-icon { color: inherit; }
  /* A device's own screens, under its bar: the Settings screen's own row
     style, as wide as its tabs, then at the right the save controls of the
     one on show. */
  .hb-subnav { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; min-width: 0; }
  .hb-subnav nav.wa-wr-links { flex: 0 1 auto; order: 0; gap: 4px; padding: 4px; border-radius: 13px; border-color: var(--wa-line-strong); }
  /* These tabs are how a device's own screens are found, so they are larger
     than the editors' row and each wears its screen's hue: on its icon always,
     and on the outline and a faint fill of the one on show. */
  .hb-subnav nav.wa-wr-links a.wa-wr-link { height: 36px; padding: 0 14px; gap: 8px; border-radius: 9px; font-size: 13.5px; font-weight: 500; color: var(--wa-soft); }
  .hb-subnav nav.wa-wr-links a.wa-wr-link .wa-wr-ic { color: var(--h); }
  .hb-subnav nav.wa-wr-links a.wa-wr-link .wa-wr-ic svg.ui-icon { width: 16px; height: 16px; }
  .hb-subnav nav.wa-wr-links a.wa-wr-link:hover { color: var(--wa-ink); }
  .hb-subnav nav.wa-wr-links a.wa-wr-link.on {
    color: var(--wa-ink); font-weight: 600;
    background: color-mix(in srgb, var(--h) 16%, var(--wa-card));
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--h) 60%, transparent);
  }
  .hb-subnav-end { margin-left: auto; }
  /* Settings, Rooms or Voice on show: the screen is the device's page, as wide
     as the page has room for, under the same header and tabs as Overview. */
  .hb-detail.own { max-width: none; }
  .hb-own { min-width: 0; }
  /* Settings here scrolls with the device page, not in a box of its own, and
     starts at the tabs' left edge. Its side list sticks under the device's
     header, and only once the page has scrolled that far: measured from its
     own box it would start out pushed down on any long group. */
  .hb-own .ws-page { overflow: visible; }
  .hb-own .ws-split { padding: 16px 0 48px; }
  .hb-own .ws-nav { top: 76px; }
  /* Rooms and Voice start at the tabs' left edge too. Rooms' stage sticks
     under the header, with the page. */
  .hb-own :is(wa-rooms-editor, wa-voice-editor) { padding-left: 0; padding-right: 0; }
  .hb-own wa-rooms-editor { overflow: visible; --rm-side-top: 76px; }
  /* The way back to the list, only where the list does not fit beside it. */
  button.hb-back { display: none; }
  @container hb (max-width: 819px) {
    .home.hb.own .hb-side { display: none; }
    button.hb-back { display: inline-flex; align-items: center; gap: 4px; flex: none; }
  }
  /* The device at the top of its page, small, so its pages and the rest it
     holds below are the page: a stage a hand wide beside its name, its sync
     state and its two counts. The stage is the device standing in a soft
     light from above, on a floor that gives back its reflection, lit along
     its edge in its device's color. */
  /* One slim row: the device small in its lit box, its name and facts, its
     sync state as a pill, and its two counts. The page under it is its
     pages; this row only says which device it is (Jesse, 2026-10-23). */
  .hb-hero { flex: 1 1 auto; display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; min-width: 0; }
  .hb-stage {
    position: relative; flex: none; width: 46px; height: 46px; border-radius: 11px; overflow: hidden; box-sizing: border-box;
    border: 1px solid transparent;
    background:
      radial-gradient(46% 70% at 50% 0%, var(--wa-stage-light) 0%, transparent 80%) padding-box,
      linear-gradient(180deg, var(--wa-stage-top) 0%, var(--wa-stage-bottom) 100%) padding-box,
      linear-gradient(140deg, var(--c) 0%, color-mix(in srgb, var(--c) 25%, transparent) 32%,
        var(--wa-card-mid) 64%, color-mix(in srgb, var(--c) 15%, transparent) 100%) border-box;
    box-shadow: var(--home-lift);
  }
  /* In the bar its edge is plain grey: the device's color is the dot in its
     facts line and the slots lit on the drawing, which keep their own --c. */
  .hb-bar .hb-stage { --c: var(--wa-line-strong); }
  .hb-floor {
    display: none; position: absolute; left: 0; right: 0; bottom: 0; height: 42px;
    background: linear-gradient(180deg, color-mix(in srgb, var(--wa-ink) 3%, transparent), transparent);
    border-top: 1px solid color-mix(in srgb, var(--wa-ink) 5%, transparent);
  }
  .hb-device { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
  .hb-device svg.ha-art { width: auto; height: 36px; }
  /* The two counts, each a door to its page: a number and its word. */
  .hb-calls { display: flex; flex-wrap: wrap; gap: 6px; }
  button.hb-call {
    display: inline-flex; align-items: baseline; gap: 6px; height: 28px; box-sizing: border-box; padding: 0 10px;
    border-radius: 9px; font: inherit; color: var(--wa-ink); cursor: pointer;
    background: var(--home-card); border: 1px solid var(--wa-line-strong); box-shadow: var(--home-lift);
  }
  button.hb-call:hover { background: var(--wa-hover); }
  button.hb-call:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .hb-call-n { display: inline-flex; align-items: baseline; gap: 5px; line-height: 26px; }
  .hb-call-n b { font-size: 14px; font-weight: 400; font-variant-numeric: tabular-nums; }
  .hb-call-n b.none { color: var(--wa-faint); }
  .hb-call-n span { font-size: 12px; color: var(--wa-muted); }
  button.hb-call:hover .hb-call-n span { color: var(--wa-ink); }
  /* A big screen at normal zoom: the device a little bigger, and its pages
     as wide as the room, so they fill it rather than one narrow column. */
  /* A big screen at normal zoom: its pages as wide as the room, so they
     fill it rather than one narrow column. */
  @container (min-width: 1400px) {
    .hb-detail { max-width: 2200px; }
    .hb-main > .home-welcome-slot { max-width: 2200px; }
  }
  /* The welcome, in a home with no devices yet: three numbered steps down
     the page, joined by a thin line. Install the app, pick the device on
     the lit stage, pair it. */
  .hw-wrap { width: min(1040px, 100%); margin: 0 auto; display: flex; flex-direction: column; gap: 28px; }
  .hw-steps { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; }
  .hw-step { display: grid; grid-template-columns: 28px minmax(0, 1fr); column-gap: 16px; }
  .hw-rail { display: flex; flex-direction: column; align-items: center; }
  .hw-num {
    width: 28px; height: 28px; flex: none; box-sizing: border-box; border-radius: 50%; display: grid; place-items: center;
    font-size: 12px; font-weight: 500; color: var(--wa-ink); background: var(--wa-card); border: 1px solid var(--wa-line-strong);
  }
  .hw-line { flex: 1; width: 1px; margin-top: 8px; background: var(--wa-line-strong); }
  .hw-step:last-child .hw-line { display: none; }
  .hw-body { min-width: 0; display: flex; flex-direction: column; gap: 14px; padding-bottom: 30px; }
  .hw-step:last-child .hw-body { padding-bottom: 0; }
  .hw-step-head { display: flex; flex-direction: column; gap: 3px; padding-top: 3px; }
  .hw-step-head h2 { margin: 0; font-size: 17px; font-weight: 500; letter-spacing: -.01em; overflow-wrap: anywhere; }
  .hw-step-head span { font-size: 12.5px; line-height: 1.45; color: var(--wa-muted); overflow-wrap: anywhere; }
  .hw-install {
    display: flex; flex-wrap: wrap; align-items: center; gap: 20px 24px; padding: 16px; border-radius: 16px;
    background: var(--home-card); border: 1px solid var(--wa-line); box-shadow: var(--home-lift);
  }
  .hw-install-t { flex: 1 1 360px; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
  .hw-install-t p { margin: 0; font-size: 13.5px; line-height: 1.55; color: var(--wa-ink); overflow-wrap: anywhere; }
  .hw-qr { flex: none; margin: 0; display: flex; align-items: center; gap: 14px; }
  .hw-qr svg, .hw-qr-empty { display: block; width: 96px; height: 96px; box-sizing: border-box; border-radius: 8px; border: 1px solid var(--wa-line); }
  .hw-qr figcaption { display: flex; flex-direction: column; gap: 3px; max-width: 150px; font-size: 11.5px; line-height: 1.4; color: var(--wa-muted); }
  .hw-qr figcaption b { font-size: 12.5px; font-weight: 500; color: var(--wa-ink); }
  /* Pick one: both devices on Home's lit stage, its edge plain grey. The one
     picked is drawn in full with one thin green arc turning slowly round it;
     the other is faint inside a dashed ring. */
  .hb-stage.hw-stage { --c: var(--wa-line-strong); width: auto; height: auto; border-radius: 24px; display: flex; justify-content: center; padding: 28px 20px 30px; }
  .hw-choices { position: relative; display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start; gap: 24px 72px; }
  button.hw-choice {
    display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 0; margin: 0;
    border: 0; border-radius: 24px; background: none; font: inherit; color: inherit; cursor: pointer;
  }
  button.hw-choice:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .hw-ring { position: relative; width: 236px; height: 236px; display: grid; place-items: center; }
  .hw-ring > svg.hw-ring-track, .hw-ring > svg.hw-ring-arc { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; fill: none; }
  .hw-ring-track circle { stroke: var(--wa-line-strong); stroke-width: 1; stroke-dasharray: 4 5; transition: stroke .2s ease; }
  .hw-choice:hover:not(.on) .hw-ring-track circle { stroke: var(--wa-muted); }
  .hw-choice.on .hw-ring-track circle { stroke: color-mix(in srgb, var(--wa-hue-green) 28%, transparent); stroke-dasharray: none; }
  .hw-ring-arc { animation: hw-in .45s ease-out both, hw-spin 6s linear infinite; }
  .hw-ring-arc circle { stroke: var(--wa-hue-green); stroke-width: 1.5; stroke-linecap: round; }
  @keyframes hw-spin { to { transform: rotate(360deg); } }
  @keyframes hw-in { from { opacity: 0; } to { opacity: 1; } }
  .hw-ghost-art { position: relative; opacity: .45; transition: opacity .25s ease; }
  .hw-choice:hover .hw-ghost-art { opacity: .9; }
  .hw-choice.on .hw-ghost-art { opacity: 1; }
  .hw-ghost { stroke: color-mix(in srgb, var(--wa-ink) 28%, transparent); }
  .hw-ghost-lit { stroke: color-mix(in srgb, var(--wa-hue-green) 70%, transparent); }
  .hw-ghost-faint { stroke: color-mix(in srgb, var(--wa-ink) 13%, transparent); }
  .hw-ghost-faint-fill { fill: color-mix(in srgb, var(--wa-ink) 13%, transparent); }
  .hw-ghost-fill { fill: color-mix(in srgb, var(--wa-ink) 2.5%, transparent); }
  .hw-ghost-ink { fill: color-mix(in srgb, var(--wa-ink) 45%, transparent); font-family: inherit; }
  .hw-ghost-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .hw-ghost-ink-line { stroke: color-mix(in srgb, var(--wa-ink) 45%, transparent); }
  .hw-choice-t { display: flex; flex-direction: column; align-items: center; gap: 3px; }
  .hw-choice-t b { font-size: 14px; font-weight: 500; }
  .hw-choice.on .hw-choice-t b { color: var(--wa-green); }
  .hw-choice-t span { font-size: 11.5px; color: var(--wa-muted); }
  /* Pair it: the pairing card for the device picked, lit green. */
  .hw-pair {
    --c: var(--wa-hue-green); --lo-fill: var(--wa-card); --lo-mid: var(--wa-card-mid);
    ${c}
    display: flex; flex-direction: column; gap: 14px; padding: 18px 20px; border-radius: 18px; box-shadow: var(--home-lift);
  }
  .hw-pair-foot {
    display: flex; flex-wrap: wrap; gap: 8px 18px; padding-top: 14px; border-top: 1px solid var(--wa-line);
    font-size: 12.5px; line-height: 1.45; color: var(--wa-muted);
  }
  .hw-pair-foot a { color: var(--wa-ink); }
  @media (prefers-reduced-motion: reduce) {
    .hw-ring-arc { animation: none; }
  }
  /* On a phone the two stay side by side, smaller. */
  @media (max-width: 640px) {
    .hb-stage.hw-stage { padding: 20px 8px 22px; }
    .hw-ring { width: 118px; height: 118px; }
    .hw-ghost-art { transform: scale(.5); }
    .hw-choices { flex-wrap: nowrap; gap: 14px; }
  }
  /* Beside the stage: its name and facts, the sync well, then its counts. */
  /* Under the bar while it shows: the rename field, Remove's question, a
     note. */
  .hb-info { min-width: 0; display: flex; flex-direction: column; gap: 10px; }
  /* A watch's two addresses, always under the bar: a slim hairline card of
     two lines with Edit at the right, and the form in its place while it is
     open. */
  .hb-addrs { min-width: 0; }
  .hb-addrs:not(.editing) {
    padding: 9px 10px 9px 14px; border: 1px solid var(--wa-line); border-radius: 12px; background: var(--home-card, var(--wa-card));
  }
  .hb-name { display: flex; flex-direction: column; gap: 1px; padding: 0 2px; min-width: 0; }
  .hb-name h2 { margin: 0; font-size: 18px; font-weight: 500; letter-spacing: -.02em; line-height: 1.15; overflow-wrap: anywhere; }
  .hb-facts i { display: inline-block; width: 7px; height: 7px; margin-right: 6px; border-radius: 50%; background: var(--c); vertical-align: 1px; }
  .hb-facts { font-size: 12px; line-height: 1.45; color: var(--wa-muted); overflow-wrap: anywhere; }
  /* The sync state in a well lit in its color: a chip, its word and what it
     means, and when the device was last heard from. */
  .hb-state {
    --c: var(--wa-muted); --lo-fill: var(--wa-card); --lo-mid: var(--wa-card-mid);
    ${c}
    border-width: 1px;
    display: flex; align-items: center; gap: 8px; min-height: 28px; box-sizing: border-box; padding: 3px 12px 3px 4px; border-radius: 999px;
  }
  .hb-state.synced { --c: var(--wa-green); }
  .hb-state.waiting { --c: var(--wa-amber); }
  .hb-state.rejected { --c: var(--error-color); }
  .hb-state.asleep { --c: var(--wa-faint); }
  /* Only Synced and Not synced wear a glyph; the rest start on their words. */
  .hb-state.plain { padding-left: 12px; }
  .hb-state.asleep .hb-state-t b { color: var(--wa-label); }
  .hb-state-chip {
    width: 20px; height: 20px; flex: none; box-sizing: border-box; border-radius: 50%; display: grid; place-items: center;
    border: 1px solid var(--c); color: var(--c);
  }
  .hb-state-chip svg.ui-icon { width: 11px; height: 11px; }
  .hb-state-t { min-width: 0; display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 6px; }
  .hb-state-t b { font-size: 12.5px; font-weight: 500; color: var(--c); }
  .hb-state-t span { font-size: 12px; color: var(--wa-muted); overflow-wrap: anywhere; }
  .hb-seen { flex: none; display: flex; align-items: baseline; gap: 4px; padding-left: 8px; border-left: 1px solid var(--wa-line); }
  .hb-seen span { font-size: 12px; color: var(--wa-muted); }
  .hb-seen b { font-size: 12px; font-weight: 400; color: var(--wa-label); }
  .hb-detail > .home-title { padding: 6px 2px 0; color: var(--wa-muted); }
  /* A door per page, each opening it on this device: a chip in the page's
     section hue, its name, how many it holds, and a line on what it is for. */
  .hb-doors { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(208px, 100%), 1fr)); gap: 10px; margin-top: -6px; }
  a.hb-door, button.hb-door {
    display: flex; flex-direction: column; gap: 12px; min-height: 104px; box-sizing: border-box; padding: 13px 14px 14px;
    border-radius: 14px; font: inherit; text-align: left; cursor: pointer; text-decoration: none; color: var(--wa-ink);
    background: var(--home-card); border: 1px solid var(--wa-line-strong); box-shadow: var(--home-lift);
    transition: background-color .15s ease, border-color .15s ease, transform .15s ease;
  }
  a.hb-door:hover, button.hb-door:hover { background: var(--wa-hover); transform: translateY(-1px); }
  a.hb-door:focus-visible, button.hb-door:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .hb-door-top { display: flex; align-items: center; gap: 10px; }
  .hb-door-chip {
    width: 26px; height: 26px; flex: none; box-sizing: border-box; border-radius: 7px; display: grid; place-items: center;
    border: 1px solid var(--h); color: var(--h);
  }
  .hb-door-chip svg.ui-icon { width: 14px; height: 14px; }
  .hb-door-l { flex: 1; min-width: 0; font-size: 13.5px; font-weight: 500; overflow-wrap: anywhere; }
  .hb-door-n { flex: none; font-size: 20px; font-weight: 300; line-height: 1; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
  .hb-door-n.none { font-size: 12.5px; font-weight: 400; letter-spacing: 0; color: var(--wa-faint); }
  .hb-door-foot { display: flex; align-items: flex-end; gap: 8px; }
  .hb-door-b { flex: 1; font-size: 12px; line-height: 1.4; color: var(--wa-muted); }
  /* The Pages door draws the watch's first pages instead of its line: one
     screen of each, small, with the screen's corners and no watch case. */
  /* The pictures sit from the left, so two pages read as a pair. The Menus
     door's three spread across instead (\`wa-menu-thumbs\`): there are always
     three, so they line up with both edges. */
  .hb-door-pages {
    flex: 1; min-width: 0; height: var(--hb-screen-h); display: flex; flex-wrap: wrap; align-content: flex-start; gap: 0 5px;
    overflow: hidden; pointer-events: none;
  }
  .hb-page { flex: none; display: block; line-height: 0; }
  /* The Complications door's strip: each complication's card picture on a
     black tile, all one height, a round one cut to a circle. */
  .hb-door-comps {
    flex: 1; min-width: 0; height: var(--hb-comp-h); display: flex; flex-wrap: wrap; align-content: flex-start; gap: 0 5px;
    overflow: hidden; pointer-events: none;
  }
  .hb-comp {
    flex: none; display: block; height: var(--hb-comp-h); box-sizing: border-box; border-radius: 6px;
    background-color: var(--wa-art-screen); background-repeat: no-repeat; background-position: center; background-size: contain;
    box-shadow: 0 0 0 1px var(--wa-line-strong);
  }
  .hb-comp.round { border-radius: 50%; }
  .hb-page .wa-watch { padding: 0; margin: 0; background: none; box-shadow: 0 0 0 1px var(--wa-line-strong); border-radius: var(--wf-radius, 6px); }
  .hb-page .wa-watch::before, .hb-page .wa-watch::after { display: none; }
  .hb-page .wa-watch > .wp-screen { max-height: var(--hb-screen-h); }
  .hb-page .wp-fold { display: none; }
  .hb-door-go { flex: none; display: grid; color: var(--wa-label); opacity: 0; transform: translateX(-3px); transition: opacity .15s ease, transform .15s ease; }
  .hb-door-go svg.ui-icon { width: 14px; height: 14px; }
  a.hb-door:hover .hb-door-go, button.hb-door:hover .hb-door-go,
  a.hb-door:focus-visible .hb-door-go, button.hb-door:focus-visible .hb-door-go { opacity: 1; transform: none; }
  @media (prefers-reduced-motion: reduce) {
    button.hb-row, a.hb-link, a.hb-door, button.hb-door, .hb-door-go { transition: none; }
    a.hb-door:hover, button.hb-door:hover { transform: none; }
  }
  /* The rename field, the Remove step and the notes, in the detail. */
  .dev-paired {
    display: flex; align-items: flex-start; gap: 8px; padding: 9px 11px;
    border: 1px solid var(--wa-green); border-radius: 10px;
    font-size: 13px; line-height: 1.4; color: var(--wa-ink);
  }
  .dev-paired svg { flex: none; width: 16px; height: 16px; margin-top: 1px; color: var(--wa-green); }
  .dev-paired b { font-weight: 600; color: var(--wa-green); }
  .hb-ask {
    display: flex; flex-direction: column; gap: 12px; padding: 14px 16px; border-radius: 14px;
    border: 1px solid color-mix(in srgb, var(--error-color) 45%, var(--wa-line)); background: var(--wa-card);
  }
  .hb-ask p { margin: 0; font-size: 13px; line-height: 1.5; color: var(--wa-ink); }
  .hb-ask p.quiet { color: var(--wa-muted); }
  .dev-acts { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
  .dev-acts button { height: 32px; padding: 0 14px; border-radius: 8px; }
  .dev-acts button.danger { display: inline-flex; align-items: center; gap: 6px; font-weight: 500; }
  .dev-acts button.danger svg.ui-icon { width: 14px; height: 14px; }
  .dev-rename { display: flex; align-items: center; gap: 8px; }
  .dev-rename input { flex: 1; min-width: 0; height: 32px; box-sizing: border-box; }
  .dev-rename button { height: 32px; }
  .dev-small { margin: 0; font-size: 11.5px; color: var(--wa-muted); }
  .dev-err { margin: 0; font-size: 12.5px; color: var(--error-color); }
  /* Pair a device: the transfer dialogs' frame with Home's sheen, a head
     with the link glyph in an outlined chip. */
  dialog.pair-dialog {
    --home-card: linear-gradient(180deg, color-mix(in srgb, var(--wa-ink) 4%, var(--wa-card)), var(--wa-card));
    --home-lift: inset 0 1px 0 color-mix(in srgb, var(--wa-ink) 7%, transparent);
    width: min(580px, calc(100vw - 32px)); border-radius: 16px; border-color: var(--wa-line-strong);
    background: var(--home-card); box-shadow: var(--home-lift), var(--wa-shadow-pop);
  }
  .pair-head { display: flex; align-items: center; gap: 12px; padding: 14px 12px 14px 16px; border-bottom: 1px solid var(--wa-line); flex: none; }
  .pair-chip {
    width: 32px; height: 32px; flex: none; box-sizing: border-box; border-radius: 9px; display: grid; place-items: center;
    border: 1px solid var(--wa-green); color: var(--wa-green);
  }
  .pair-chip svg.ui-icon { width: 16px; height: 16px; }
  .pair-head-t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .pair-head h2 { margin: 0; font-size: 12px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; }
  .pair-head-t > span { font-size: 12px; color: var(--wa-muted); overflow-wrap: anywhere; }
  .pair-head > button.icon { width: 30px; height: 30px; flex: none; }
  .pair-head > button.icon svg.ui-icon { width: 16px; height: 16px; }
  @media (max-width: 720px) {
    .hb-side { max-width: none; border-right: 0; border-bottom: 1px solid var(--wa-line); }
    .hb-main { padding: 16px 12px 32px; }
    .hb-name h2 { font-size: 17px; }
  }
  @media (max-width: 640px) {
    .home-pad { padding: 14px 12px 32px; }
    .home-head h1 { font-size: 22px; }
  }
`;export{xe as a,be as b,fe as c,G as d,me as e,We as f,He as g,de as h,Oe as i,je as j,Ie as k,Ne as l,Fe as m,Le as n,Me as o,$e as p,Ue as q,Be as r,Ke as s,Ve as t,qe as u,Ge as v,Xe as w,Ye as x,Je as y,Qe as z,Ze as A,en as B,nn as C,tn as D,on as E,pe as F,rn as G,an as H,sn as I,dn as J};
