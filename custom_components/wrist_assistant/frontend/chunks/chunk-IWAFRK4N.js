import{b as ae}from"./chunk-GCYFZRHH.js";import{a as O,b as re}from"./chunk-GSAXOO2O.js";import{ph as i}from"./chunk-NPUC537M.js";import{b as h,f as r,g as oe,i as s}from"./chunk-6ZDBXU6B.js";var R="/home-map";function se(e){let n=e?.path??"";return n===R||n.startsWith(`${R}/`)}var ie,C=!1;function Ie(){return ie??=import("./home-map-editor-3J6XN6Y7.js").then(()=>{},e=>{throw C=!0,e}),ie}function cn(e){let n=customElements.get("wa-home-map-editor")!==void 0;return!n&&!C&&Ie().then(e.onLoaded,e.onLoaded),n?r`<wa-home-map-editor .hass=${e.hass} ?narrow=${e.narrow} .icons=${e.icons} .iconsTick=${e.iconsTick}
        .bundleUrl=${e.bundleUrl} .capable=${e.capable} .onHome=${e.onHome} .onOpenPage=${e.onOpenPage}></wa-home-map-editor>`:r`<div class="wp-loading">
        ${C?r`<span>The Home map page did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
      </div>`}var f="/http-actions";function ce(e){let n=e?.path??"";return n===f||n.startsWith(`${f}/`)}var un="https://docs.wrist-assistant.com/features/http-actions/",M;function hn(e){M=e}function fn(){return M?.dirty()??!1}function mn(){M?.drop()}var de,E=!1;function Le(){return de??=import("./http-actions-editor-UVUDXIRE.js").then(()=>{},e=>{throw E=!0,e}),de}function gn(e){if(e.hass.user?.is_admin===!1)return r`<div class="wp-loading">
        <span>Only an administrator can change HTTP actions. Your watch and iPhone can still run every one, from a tile, a menu or a complication.</span>
      </div>`;let n=customElements.get("wa-http-actions-editor")!==void 0;return!n&&!E&&Le().then(e.onLoaded,e.onLoaded),n?r`<wa-http-actions-editor .hass=${e.hass} .owners=${e.owners}
        .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow} .barHost=${e.barHost}></wa-http-actions-editor>`:r`<div class="wp-loading">
        ${E?r`<span>The HTTP actions screen did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
      </div>`}var m="/menus";function pe(e){let n=e?.path??"";return n===m||n.startsWith(`${m}/`)}function yn(e){let n=e?.path??"",t=`${m}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}var Pn="https://docs.wrist-assistant.com/watch-app/quick-menu/",D;function vn(e){D=e}function Rn(){return D?.dirty()??!1}function Tn(){D?.drop()}var le,B=!1;function _e(){return le??=import("./menu-editor-HGPG6P5R.js").then(()=>{},e=>{throw B=!0,e}),le}function $n(e){let n=customElements.get("wa-menu-editor")!==void 0;return!n&&!B&&_e().then(e.onLoaded,e.onLoaded),n?r`<wa-menu-editor .hass=${e.hass} .owners=${e.owners}
        .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
        .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
        .barActions=${e.actions} .phones=${e.phones===!0} .libraryItem=${e.libraryItem}></wa-menu-editor>`:r`<div class="wp-loading">
        <button class="tb-btn tb-back" title="Back to the Menus tab" @click=${e.onBack}>${i("left")}<span>Menus</span></button>
        ${B?r`<span>The menu editor did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
      </div>`}var c="/pages";function he(e){let n=e?.path??"";return n===c||n.startsWith(`${c}/`)}function An(e){let n=e?.path??"",t=`${c}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}var Wn="https://docs.wrist-assistant.com/watch-app/pages-in-home-assistant/",T;function In(e){T=e}function Ln(){return T?.dirty()??!1}function _n(){return T?.unsent()??!1}function On(){return T?.savesDone()}function Cn(){T?.drop()}var ue,U=!1;function Oe(){return ue??=import("./page-editor-VBTEC5YB.js").then(()=>{},e=>{throw U=!0,e}),ue}function En(e){let n=customElements.get("wa-page-editor")!==void 0;return!n&&!U&&Oe().then(e.onLoaded,e.onLoaded),n?r`<wa-page-editor .hass=${e.hass} .owners=${e.owners}
        .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
        .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
        .barActions=${e.actions} .phones=${e.phones===!0} .libraryItem=${e.libraryItem}
        .onOpenItem=${e.onOpenItem} .onOpenBoard=${e.onOpenBoard}></wa-page-editor>`:r`<div class="wp-loading">
        <button class="tb-btn tb-back" title="Back to the Pages tab" @click=${e.onBack}>${i("left")}<span>Pages</span></button>
        ${U?r`<span>The page editor did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
      </div>`}var Mn=h`
  button.tb-btn.tb-back { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-back svg.ui-icon { width: 14px; height: 14px; }
  .wp-loading { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; padding: 12px 16px; color: var(--wa-muted); }
`;var l="/rooms";function me(e){let n=e?.path??"";return n===l||n.startsWith(`${l}/`)}function Vn(e){let n=e?.path??"",t=`${l}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}function Ce(e,n,t=""){let a=e?.prefix??t.replace(/\/rooms(\/.*)?$/,"");return n?`${a}${l}`:a}function jn(e,n){let t=Ce(e,n,window.location.pathname);t===""||t===window.location.pathname||(history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var Nn="https://docs.wrist-assistant.com/features/rooms/",j;function Kn(e){j=e}function Fn(){return j?.dirty()??!1}function Gn(){j?.drop()}var fe,V=!1;function Ee(){return fe??=import("./rooms-editor-33WRDQ2R.js").then(()=>{},e=>{throw V=!0,e}),fe}function zn(e){let n=customElements.get("wa-rooms-editor")!==void 0;return!n&&!V&&Ee().then(e.onLoaded,e.onLoaded),r`${e.dialogs}
    ${n?r`<wa-rooms-editor .hass=${e.hass} .owners=${e.owners} .ownerId=${e.ownerId}
          .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow} .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
          .barActions=${e.actions} .shellOwnsWatch=${e.shell===!0} .barHost=${e.barHost}
          .phones=${e.phones===!0}></wa-rooms-editor>`:r`<div class="wp-loading">
          ${e.shell===!0?s:r`<button class="tb-btn tb-back" title="Back to complications" @click=${e.onBack}>${i("left")}<span>Complications</span></button>`}
          ${V?r`<span>The Rooms editor did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
        </div>`}`}var g="/settings";function N(e){let n=e?.path??"";return n===g||n.startsWith(`${g}/`)}function qn(e){let n=e?.path??"",t=`${g}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}function Zn(e,n){return(n.metaKey||n.ctrlKey)&&n.key==="s"&&N(e)}function Jn(e,n,t){return t===void 0?e&&n===void 0?"stay":"clear":e&&n===t?"stay":"load"}function Qn(e){return e.behaviorChanges+e.styleChanges+(e.addressChanges??0)>0&&!e.busy&&(e.behaviorChanges===0||e.behaviorHeld)&&(e.styleChanges===0||e.styleHeld)}var w="/status-pages";function we(e){let n=e?.path??"";return n===w||n.startsWith(`${w}/`)}function tt(e){let n=e?.path??"",t=`${w}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}var ot="https://docs.wrist-assistant.com/features/status-pages/",$;function at(e){$=e}function rt(){return $?.dirty()??!1}function it(){return $?.unsent()??!1}function st(){return $?.savesDone()}function dt(){$?.drop()}var ge,K=!1;function Me(){return ge??=import("./status-pages-editor-FV6SXIKQ.js").then(()=>{},e=>{throw K=!0,e}),ge}function ct(e){let n=customElements.get("wa-status-pages-editor")!==void 0;return!n&&!K&&Me().then(e.onLoaded,e.onLoaded),n?r`<wa-status-pages-editor .hass=${e.hass} .owners=${e.owners}
        .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
        .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
        .barActions=${e.actions} .phones=${e.phones===!0} .libraryItem=${e.libraryItem}
        .onOpenItem=${e.onOpenItem} .onOpenBoard=${e.onOpenBoard}></wa-status-pages-editor>`:r`<div class="wp-loading">
        <button class="tb-btn tb-back" title="Back to the Status pages tab" @click=${e.onBack}>${i("left")}<span>Status pages</span></button>
        ${K?r`<span>The status page editor did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
      </div>`}var p="/voice";function xe(e){let n=e?.path??"";return n===p||n.startsWith(`${p}/`)}function ht(e){let n=e?.path??"",t=`${p}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}function Be(e,n,t=""){let a=e?.prefix??t.replace(/\/voice(\/.*)?$/,"");return n?`${a}${p}`:a}function ft(e,n){let t=Be(e,n,window.location.pathname);t===""||t===window.location.pathname||(history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var mt="https://docs.wrist-assistant.com/watch-app/voice/",G;function gt(e){G=e}function wt(){return G?.dirty()??!1}function bt(){G?.drop()}var be,F=!1;function De(){return be??=import("./voice-editor-3W62LYAU.js").then(()=>{},e=>{throw F=!0,e}),be}function xt(){return r`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${oe`<path d="M4 9.5H7.5L12 5.5V18.5L7.5 14.5H4Z" /><path d="M15.5 9.2A4 4 0 0 1 15.5 14.8" /><path d="M18.2 6.8A7.5 7.5 0 0 1 18.2 17.2" />`}</svg>`}function yt(e){let n=customElements.get("wa-voice-editor")!==void 0;return!n&&!F&&De().then(e.onLoaded,e.onLoaded),r`${e.dialogs}
    ${n?r`<wa-voice-editor .hass=${e.hass} .owners=${e.owners} .ownerId=${e.ownerId}
          .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
          .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
          .barActions=${e.actions} .shellOwnsWatch=${e.shell===!0} .barHost=${e.barHost}></wa-voice-editor>`:r`<div class="wp-loading">
          ${e.shell===!0?s:r`<button class="tb-btn tb-back" title="Back to complications" @click=${e.onBack}>${i("left")}<span>Complications</span></button>`}
          ${F?r`<span>The voice editor did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
        </div>`}`}var Y="/all-menus",ye,z=!1;function Ue(){return ye??=import("./all-menus-LOTQYRPU.js").then(()=>{},e=>{throw z=!0,e}),ye}function Rt(e){let n=customElements.get("wa-all-menus")!==void 0;return!n&&!z&&Ue().then(e.onLoaded,e.onLoaded),n?r`<wa-all-menus .hass=${e.hass} .owners=${e.owners} .ownersReady=${e.ownersReady} .phones=${e.phones}
    .icons=${e.icons} .iconsTick=${e.iconsTick} .onOpenLibrary=${e.onOpenLibrary}
    .focusOwner=${e.focusOwner} .onFocus=${e.onFocus} .onOpenScreen=${e.onOpenScreen}
    ?embedded=${e.embedded===!0} .searchText=${e.searchText??""}></wa-all-menus>`:r`<div class="ap-loading">${z?"The Menus tab did not load. Reload the page to try again.":"Loading\u2026"}</div>`}var Z="/all-pages",J="/all-status-pages";function kt(e,n){if(e===void 0||!e.startsWith(`${n}/`))return;let t=e.slice(n.length+1).split("/")[0]??"";if(t!=="")try{return decodeURIComponent(t)}catch{return}}function ve(e,n){return n===void 0?e:`${e}/${encodeURIComponent(n)}`}var Pe,q=!1;function Ve(){return Pe??=import("./all-pages-IRX7M4YC.js").then(()=>{},e=>{throw q=!0,e}),Pe}function Ht(e){let n=customElements.get("wa-all-pages")!==void 0;if(!n&&!q&&Ve().then(e.onLoaded,e.onLoaded),!n){let t=e.kind==="status_pages"?"Status pages":"Pages";return r`<div class="ap-loading">${q?`The ${t} tab did not load. Reload the page to try again.`:"Loading\u2026"}</div>`}return r`<wa-all-pages .kind=${e.kind} .hass=${e.hass} .owners=${e.owners} .ownersReady=${e.ownersReady} .phones=${e.phones}
    .icons=${e.icons} .iconsTick=${e.iconsTick} .onOpenLibrary=${e.onOpenLibrary}
    .focusOwner=${e.focusOwner} .onFocus=${e.onFocus} .onOpenScreen=${e.onOpenScreen}
    ?embedded=${e.embedded===!0} .searchText=${e.searchText??""}></wa-all-pages>`}var St=h`
  .ap-loading { flex: 1 1 auto; padding: 24px clamp(12px, 3vw, 28px); font-size: 13px; color: var(--wa-muted); background: var(--wa-bg); }
`;var b="/watch-complications";function Re(e){let n=e?.path??"";return n===b||n.startsWith(`${b}/`)}function Wt(e){let n=e?.path??"",t=`${b}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}var x="/control-center";function Te(e){let n=e?.path??"";return n===x||n.startsWith(`${x}/`)}function Lt(e){let n=e?.path??"",t=`${x}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}var _t="https://docs.wrist-assistant.com/watch-app/complications/#control-center";var je="",u="/devices",Q="all",$e="/shared",S="/complications",ke="design",k="/iphone",P=[{id:"home",label:"Devices",path:u,icon:"watch"},{id:"pages",label:"Pages",path:Z,icon:"pages"},{id:"status-pages",label:"Status pages",path:J,icon:"checklist"},{id:"menus",label:"Menus",path:Y,icon:"radial"},{id:"complications",label:"Complications",path:S,icon:"gauge"},{id:"shared",label:"Shared",path:$e,icon:"layers"}],Ne=Object.fromEntries(P.map(e=>[e.id,e.icon])),Ke={...Object.fromEntries(P.map(e=>[e.id,e.label])),watch:"Watch app",iphone:"iPhone app"},X=[{id:"pages",label:"Pages",blurb:"are the screens you swipe between on the watch: tiles for lights, scenes, cameras and more.",path:c},{id:"menus",label:"Menus",blurb:"are the quick menus on the watch: the Anywhere menu, a menu for each kind of entity and the page switcher.",path:m},{id:"status-pages",label:"Status pages",blurb:"are lists to read at a glance, like the lights that are on or low batteries, opened from a tile, a menu or Siri.",path:w},{id:"control-center",label:"Control Center",blurb:"The list of controls",path:x,retired:!0},{id:"rooms",label:"Rooms",blurb:"let the watch open a room's page when you are in that room, and set up point control: point the watch at a thing to control it.",path:l},{id:"voice",label:"Voice",blurb:"sets how the watch listens and speaks: the Assist and Speak defaults, your saved phrases and the watch voice.",path:p},{id:"watch-complications",label:"Complications",blurb:"are what this watch's faces show, with every other design you could add under them, made in the Complications tab.",path:b},{id:"http-actions",label:"HTTP actions",blurb:"are web requests Home Assistant sends when a watch or an iPhone runs one from a tile, a menu or a complication, shared by every watch and iPhone.",path:f,shared:!0},{id:"cameras",label:"Camera framing",blurb:"sets how each camera's picture is framed in alerts, the same on the watch and the iPhone.",path:O,shared:!0},{id:"home-map",label:"Home map",blurb:"is the plan of your home from the iPhone's scan, with a pin for each device, shown on the iPhone, the watch and a Home map tile.",path:R,shared:!0,beta:!0,capability:ae}],Fe={id:"settings",label:"Settings",blurb:"sets how the watch behaves: gestures, wrist twists, pages, cameras and how it connects.",path:g};function Jt(e){return`${e.label} ${e.blurb}`}function ee(e,n){return n&&e.shared!==!0?`${e.path}/${encodeURIComponent(n)}`:e.path}function A(e){let n=t=>X.find(a=>a.id===t);if(he(e))return n("pages");if(pe(e))return n("menus");if(we(e))return n("status-pages");if(Te(e))return n("control-center");if(me(e))return n("rooms");if(xe(e))return n("voice");if(Re(e))return n("watch-complications");if(ce(e))return n("http-actions");if(re(e))return n("cameras");if(se(e))return n("home-map");if(N(e))return Fe}var Ge=new Set(["pages","menus","status-pages","rooms","settings"]);function He(e){return Ge.has(e.id)}var ze=X.filter(He);function Ye(e){let n=e?.path??"";if(e===void 0||n!==k&&!n.startsWith(`${k}/`))return;let t=n.slice(k.length);return{prefix:e.prefix,path:t===""||t==="/"?c:t}}function ne(e){let n=A(Ye(e));return n!==void 0&&He(n)?n:void 0}function Se(e,n){return`${k}${ee(e,n)}`}function Qt(e,n,t){return qe(n.id,t)??(e==="iphone"?Se(n,t):ee(n,t))}function qe(e,n){let t=e==="pages"?Z:e==="status-pages"?J:e==="menus"?Y:void 0;return t===void 0?void 0:ve(t,n)}var y="/library",W=[{kind:"pages",segment:"pages",tab:"pages",screen:"pages"},{kind:"status_pages",segment:"status-pages",tab:"status-pages",screen:"status-pages"},{kind:"menus",segment:"menus",tab:"menus",screen:"menus"}];function Xt(e,n,t){let a=W.find(d=>d.kind===e).segment,o=`${y}/${a}/${encodeURIComponent(n)}`;return t===void 0||t===""?o:`${o}/${encodeURIComponent(t)}`}function te(e){let n=e?.path??"";if(!n.startsWith(`${y}/`))return;let[t,a,o,...d]=n.slice(y.length+1).split("/"),v=W.find(_=>_.segment===t);if(v===void 0||a===void 0||a===""||d.some(_=>_!==""))return;let I,L;try{I=decodeURIComponent(a),L=o===void 0||o===""?void 0:decodeURIComponent(o)}catch{return}return L===void 0?{kind:v.kind,id:I}:{kind:v.kind,id:I,from:L}}function Ze(e){return W.find(n=>n.kind===e.kind).tab}function H(e){if(A(e)!==void 0)return"watch";if(ne(e)!==void 0)return"iphone";let n=te(e);if(n!==void 0)return Ze(n);let t=e?.path??"";return P.find(o=>t===o.path||t.startsWith(`${o.path}/`))?.id??"home"}function eo(e){let n=te(e);if(n!==void 0)return W.find(o=>o.kind===n.kind).screen;let t=A(e)?.id??ne(e)?.id;if(t!==void 0)return t;let a=Ae(e);return a==="home"||a==="complications"||a==="shared"?a:`all-${a}`}function Je(e,n,t){return e==="watch"?ee(X[0],n):e==="iphone"?Se(ze[0],t):P.find(a=>a.id===e)?.path??je}var Qe=P.map(e=>e.id);function Xe(e){switch(e){case"pages":return"pages";case"status-pages":return"status-pages";case"menus":return"menus";case"watch-complications":case"control-center":return"complications";case"http-actions":case"cameras":case"home-map":return"shared";case"rooms":case"voice":case"settings":return"home"}}function Ae(e){let n=H(e);if(n!=="watch"&&n!=="iphone")return n;let t=n==="watch"?A(e):ne(e);return t===void 0?"home":Xe(t.id)}function no(e){return e===void 0||e===""?u:`${u}/${e===Q?Q:encodeURIComponent(e)}`}function to(e){let n=e?.path??"";if(!n.startsWith(`${u}/`))return;let[t]=n.slice(u.length+1).split("/");if(!(t===void 0||t==="")){if(t===Q)return{all:!0};try{return{owner:decodeURIComponent(t)}}catch{return}}}function oo(e,n){return`${S}/${ke}/${encodeURIComponent(e)}/${encodeURIComponent(n)}`}function ao(e){let n=e?.path??"",t=`${S}/${ke}/`;if(!n.startsWith(t))return;let[a,o,...d]=n.slice(t.length).split("/");if(!(a===void 0||a===""||o===void 0||o===""||d.some(v=>v!=="")))try{return{owner:decodeURIComponent(a),id:decodeURIComponent(o)}}catch{return}}function ro(e){let n=e?.path??"";if(n===y||n===`${y}/`)return $e;if(n===`${u}/`)return u}var en=new RegExp(`(${[...P.map(e=>e.path),y,k,c,m,p,w,x,l,f,O,g,b,R].join("|")})(/.*)?$`);function We(e,n=""){return e?e.prefix:n.replace(en,"").replace(/\/$/,"")}function nn(e,n,t=""){return`${We(e,t)}${n}`}function tn(e,n,t=!1){let a=We(e,window.location.pathname),o=`${a}${n}`;if(!(o===""||o===window.location.pathname))return t?history.replaceState(history.state,"",o):history.pushState(null,"",o),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:t}})),{prefix:a,path:n}}function io(){tn(void 0,f)}function on(e){return e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey}function an(e,n){return n&&H(e)==="complications"}function so(e){return(e.metaKey||e.ctrlKey)&&e.key==="s"}function co(e,n){let t=H(e);return!an(e,n)&&t!=="watch"&&t!=="iphone"&&te(e)===void 0}function lo(e,n){if(H(e)!=="complications")return n.shareLink?S:void 0}function po(e){return H(e)==="complications"}var rn=r`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5" />
  <path d="M9.6 9.4a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.7" /><path d="M12 17V17.2" /></svg>`;function uo(e){let n=Ae(e.route),t=o=>nn(e.route,Je(o),globalThis.location?.pathname??""),a=o=>e.unsavedTabs?.has(o)===!0||o==="home"&&e.watchUnsaved===!0;return r`<nav class="wa-tabs" aria-label="Wrist Assistant">
    ${e.menu?r`<button class="wa-tabs-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
      @click=${e.onMenu}>${i("menu")}</button>`:s}
    <span class="wa-tabs-name">Wrist Assistant</span>
    <span class="wa-tabs-list">${Qe.map(o=>r`${o==="shared"?r`<span class="wa-tabs-sep" aria-hidden="true"></span>`:s}<a class="wa-tab ${o===n?"on":""}"
      href=${t(o)} aria-current=${o===n?"page":"false"}
      @click=${d=>{on(d)&&(d.preventDefault(),e.onTab(o))}}>${i(Ne[o])}${Ke[o]}${a(o)?sn():s}</a>`)}</span>
    <span class="wa-tabs-end">${e.sync??s}${e.onHelp?r`<button type="button" class="wa-tabs-help" title="Help and setup guide" aria-label="Help" aria-haspopup="dialog"
      @click=${e.onHelp}>${rn}<span>Help</span></button>`:s}</span>
  </nav>`}function sn(){return r`<i class="wa-unsaved" role="img" aria-label="unsaved changes"></i>`}var ho=h`
  nav.wa-tabs {
    display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; flex: none;
    min-height: 44px; box-sizing: border-box; padding: 6px 12px;
    background: var(--wa-top); color: var(--wa-ink); border-bottom: 1px solid var(--wa-line);
    position: relative; z-index: 21;
  }
  .wa-tabs-name { font-size: 14px; font-weight: 600; letter-spacing: -.01em; white-space: nowrap; }
  /* One segmented group, the panel's own switch look: a field with a one
     pixel inset outline, and the tab on screen raised in the switch's "on"
     fill with a light rim, so it reads at a glance. */
  .wa-tabs-list {
    display: inline-flex; flex-wrap: wrap; align-items: center; gap: 2px; min-width: 0; padding: 2px;
    border-radius: 8px; background: var(--wa-field, var(--wa-panel)); box-shadow: inset 0 0 0 1px var(--wa-line-strong);
  }
  a.wa-tab {
    display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 10px; border-radius: 6px;
    font-size: 13px; font-weight: 500; color: var(--wa-muted); text-decoration: none; white-space: nowrap;
    background: transparent;
  }
  a.wa-tab svg.ui-icon { width: 13px; height: 13px; flex: none; }
  a.wa-tab:hover { color: var(--wa-ink); background: var(--wa-hover); }
  a.wa-tab:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  a.wa-tab.on {
    color: var(--wa-ink); font-weight: 600; background: var(--wa-seg-on);
    outline: 1px solid color-mix(in srgb, var(--wa-ink) 34%, var(--wa-card)); outline-offset: -1px;
  }
  .wa-tabs-sep { width: 1px; height: 16px; margin: 0 4px; background: var(--wa-line-strong); flex: none; }
  /* The sync pill and Help, together at the bar's right end. */
  .wa-tabs-end { display: inline-flex; align-items: center; gap: 8px; margin-left: auto; }
  button.wa-tabs-menu {
    display: grid; place-items: center; width: 30px; height: 30px; padding: 0; margin-left: -4px; border-radius: 6px; cursor: pointer;
    color: var(--wa-ink); background: transparent; border: 1px solid var(--wa-line-strong);
  }
  button.wa-tabs-menu:hover { background: var(--wa-hover); }
  button.wa-tabs-menu:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.wa-tabs-menu svg.ui-icon { width: 16px; height: 16px; }
  /* Help, neutral and outlined like a tab, pushed to the bar's right end. */
  button.wa-tabs-help {
    display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 11px 0 9px; border-radius: 6px;
    font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; white-space: nowrap;
    color: var(--wa-ink); background: transparent; border: 1px solid var(--wa-line-strong);
  }
  button.wa-tabs-help:hover { background: var(--wa-hover); }
  button.wa-tabs-help:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  button.wa-tabs-help svg.ui-icon { width: 15px; height: 15px; }
  /* A phone: the name on top, then the tabs and Help on one line under it.
     The empty ::after is the line break, a full width item of no height, so
     the rows carry their own margins instead of a row gap counted twice.
     Help keeps only its sign, and the tabs wrap onto a second line if the
     screen cannot hold them all: sliding sideways hid Complications behind
     the edge with nothing to say it was there (2026-10-23). */
  @media (max-width: 480px) {
    nav.wa-tabs { row-gap: 0; padding-block: 3px; }
    nav.wa-tabs > * { margin-block: 3px; }
    nav.wa-tabs::after { content: ""; order: 1; flex: 0 0 100%; height: 0; margin: 0; }
    .wa-tabs-list { order: 2; }
    .wa-tabs-list { flex: 1 1 0; min-width: 0; flex-wrap: wrap; }
    a.wa-tab { flex: none; padding: 0 8px; }
    a.wa-tab svg.ui-icon { display: none; }
    .wa-tabs-sep { display: none; }
    button.wa-tabs-help { width: 28px; padding: 0; justify-content: center; flex: none; }
    button.wa-tabs-help > span { display: none; }
  }
  @media (max-width: 380px) {
    a.wa-tab { padding: 0 7px; font-size: 12.5px; }
  }
  /* Orange, the one hue in the tabs and the row: it says "not saved yet",
     so it never stands for the tab or the screen on show. */
  i.wa-unsaved {
    display: inline-block; flex: none; width: 6px; height: 6px; margin-left: 6px; border-radius: 50%;
    background: var(--wa-hue-orange);
  }
`;export{cn as a,Wt as b,Lt as c,_t as d,un as e,hn as f,fn as g,mn as h,gn as i,yn as j,Pn as k,vn as l,Rn as m,Tn as n,$n as o,An as p,Wn as q,In as r,Ln as s,_n as t,On as u,Cn as v,En as w,Mn as x,Vn as y,jn as z,Nn as A,Kn as B,Fn as C,Gn as D,zn as E,N as F,qn as G,Zn as H,Jn as I,Qn as J,tt as K,ot as L,at as M,rt as N,it as O,st as P,dt as Q,ct as R,ht as S,ft as T,mt as U,gt as V,wt as W,bt as X,xt as Y,yt as Z,Y as _,Rt as $,Z as aa,J as ba,kt as ca,ve as da,Ht as ea,St as fa,je as ga,u as ha,Q as ia,$e as ja,S as ka,k as la,X as ma,Fe as na,Jt as oa,ee as pa,A as qa,He as ra,ze as sa,Ye as ta,ne as ua,Se as va,Qt as wa,qe as xa,Xt as ya,te as za,H as Aa,eo as Ba,Je as Ca,Xe as Da,no as Ea,to as Fa,oo as Ga,ao as Ha,ro as Ia,nn as Ja,tn as Ka,io as La,on as Ma,an as Na,so as Oa,co as Pa,lo as Qa,po as Ra,uo as Sa,sn as Ta,ho as Ua};
