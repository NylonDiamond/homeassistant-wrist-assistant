import{b as _,e as ie}from"./chunk-BZ65TI2W.js";import{a as E,b as se}from"./chunk-V5G73U2A.js";import{ph as i}from"./chunk-7YGC62I2.js";import{l}from"./chunk-T3VRCIVM.js";import{b as g,f as r,g as re,i as s}from"./chunk-6ZDBXU6B.js";var w="/home-map";function ce(e){let n=e?.path??"";return n===w||n.startsWith(`${w}/`)}var de,M=!1;function Ce(){return de??=import("./home-map-editor-Y2XLUCWC.js").then(()=>{},e=>{throw M=!0,e}),de}function un(e){let n=customElements.get("wa-home-map-editor")!==void 0;return!n&&!M&&Ce().then(e.onLoaded,e.onLoaded),n?r`<wa-home-map-editor .hass=${e.hass} ?narrow=${e.narrow} .icons=${e.icons} .iconsTick=${e.iconsTick}
        .bundleUrl=${e.bundleUrl} .capable=${e.capable} .onHome=${e.onHome} .onOpenPage=${e.onOpenPage}
        .owners=${e.owners??[]} .phones=${e.phones===!0}></wa-home-map-editor>`:r`<div class="wp-loading">
        ${M?r`<span>The Home map page did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
      </div>`}var b="/http-actions";function pe(e){let n=e?.path??"";return n===b||n.startsWith(`${b}/`)}var gn="https://docs.wrist-assistant.com/features/http-actions/",D;function wn(e){D=e}function bn(){return D?.dirty()??!1}function yn(){D?.drop()}var le,B=!1;function Oe(){return le??=import("./http-actions-editor-ENXNHUPA.js").then(()=>{},e=>{throw B=!0,e}),le}function xn(e){if(e.hass.user?.is_admin===!1)return r`<div class="wp-loading">
        <span>Only an administrator can change HTTP actions. Your watch and ${l("iPhone","phone")} can still run every one, from a tile, a menu or a complication.</span>
      </div>`;let n=customElements.get("wa-http-actions-editor")!==void 0;return!n&&!B&&Oe().then(e.onLoaded,e.onLoaded),n?r`<wa-http-actions-editor .hass=${e.hass} .owners=${e.owners}
        .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow} .barHost=${e.barHost}></wa-http-actions-editor>`:r`<div class="wp-loading">
        ${B?r`<span>The HTTP actions screen did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
      </div>`}var y="/menus";function he(e){let n=e?.path??"";return n===y||n.startsWith(`${y}/`)}function Tn(e){let n=e?.path??"",t=`${y}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}var $n="https://docs.wrist-assistant.com/watch-app/quick-menu/",V;function kn(e){V=e}function Hn(){return V?.dirty()??!1}function Sn(){V?.drop()}var ue,U=!1;function _e(){return ue??=import("./menu-editor-CUQJZCP7.js").then(()=>{},e=>{throw U=!0,e}),ue}function An(e){let n=customElements.get("wa-menu-editor")!==void 0;return!n&&!U&&_e().then(e.onLoaded,e.onLoaded),n?r`<wa-menu-editor .hass=${e.hass} .owners=${e.owners}
        .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
        .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
        .barActions=${e.actions} .phones=${e.phones===!0} .libraryItem=${e.libraryItem}></wa-menu-editor>`:r`<div class="wp-loading">
        <button class="tb-btn tb-back" title="Back to the Menus tab" @click=${e.onBack}>${i("left")}<span>Menus</span></button>
        ${U?r`<span>The menu editor did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
      </div>`}var p="/pages";function me(e){let n=e?.path??"";return n===p||n.startsWith(`${p}/`)}function Cn(e){let n=e?.path??"",t=`${p}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}var On="https://docs.wrist-assistant.com/watch-app/pages-in-home-assistant/",k;function _n(e){k=e}function En(){return k?.dirty()??!1}function Mn(){return k?.unsent()??!1}function Bn(){return k?.savesDone()}function Dn(){k?.drop()}var fe,j=!1;function Ee(){return fe??=import("./page-editor-NAQEHOEL.js").then(()=>{},e=>{throw j=!0,e}),fe}function Un(e){let n=customElements.get("wa-page-editor")!==void 0;return!n&&!j&&Ee().then(e.onLoaded,e.onLoaded),n?r`<wa-page-editor .hass=${e.hass} .owners=${e.owners}
        .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
        .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
        .barActions=${e.actions} .phones=${e.phones===!0} .libraryItem=${e.libraryItem}
        .onOpenItem=${e.onOpenItem} .onOpenBoard=${e.onOpenBoard}></wa-page-editor>`:r`<div class="wp-loading">
        <button class="tb-btn tb-back" title="Back to the Pages tab" @click=${e.onBack}>${i("left")}<span>Pages</span></button>
        ${j?r`<span>The page editor did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
      </div>`}var Vn=g`
  button.tb-btn.tb-back { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-back svg.ui-icon { width: 14px; height: 14px; }
  .wp-loading { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; padding: 12px 16px; color: var(--wa-muted); }
`;var u="/rooms";function we(e){let n=e?.path??"";return n===u||n.startsWith(`${u}/`)}function Fn(e){let n=e?.path??"",t=`${u}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}function Me(e,n,t=""){let a=e?.prefix??t.replace(/\/rooms(\/.*)?$/,"");return n?`${a}${u}`:a}function Gn(e,n){let t=Me(e,n,window.location.pathname);t===""||t===window.location.pathname||(history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var zn="https://docs.wrist-assistant.com/features/rooms/",K;function qn(e){K=e}function Yn(){return K?.dirty()??!1}function Zn(){K?.drop()}var ge,N=!1;function Be(){return ge??=import("./rooms-editor-3PNRJRBW.js").then(()=>{},e=>{throw N=!0,e}),ge}function Jn(e){let n=customElements.get("wa-rooms-editor")!==void 0;return!n&&!N&&Be().then(e.onLoaded,e.onLoaded),r`${e.dialogs}
    ${n?r`<wa-rooms-editor .hass=${e.hass} .owners=${e.owners} .ownerId=${e.ownerId}
          .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow} .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
          .barActions=${e.actions} .shellOwnsWatch=${e.shell===!0} .barHost=${e.barHost}
          .phones=${e.phones===!0}></wa-rooms-editor>`:r`<div class="wp-loading">
          ${e.shell===!0?s:r`<button class="tb-btn tb-back" title="Back to complications" @click=${e.onBack}>${i("left")}<span>Complications</span></button>`}
          ${N?r`<span>The Rooms editor did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
        </div>`}`}var x="/settings";function F(e){let n=e?.path??"";return n===x||n.startsWith(`${x}/`)}function Xn(e){let n=e?.path??"",t=`${x}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}function et(e,n){return(n.metaKey||n.ctrlKey)&&n.key==="s"&&F(e)}function nt(e,n,t){return t===void 0?e&&n===void 0?"stay":"clear":e&&n===t?"stay":"load"}function tt(e){return e.behaviorChanges+e.styleChanges+(e.addressChanges??0)>0&&!e.busy&&(e.behaviorChanges===0||e.behaviorHeld)&&(e.styleChanges===0||e.styleHeld)}var P="/status-pages";function ye(e){let n=e?.path??"";return n===P||n.startsWith(`${P}/`)}function it(e){let n=e?.path??"",t=`${P}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}var st="https://docs.wrist-assistant.com/features/status-pages/",H;function dt(e){H=e}function ct(){return H?.dirty()??!1}function lt(){return H?.unsent()??!1}function pt(){return H?.savesDone()}function ut(){H?.drop()}var be,G=!1;function De(){return be??=import("./status-pages-editor-PAYW2PFG.js").then(()=>{},e=>{throw G=!0,e}),be}function ht(e){let n=customElements.get("wa-status-pages-editor")!==void 0;return!n&&!G&&De().then(e.onLoaded,e.onLoaded),n?r`<wa-status-pages-editor .hass=${e.hass} .owners=${e.owners}
        .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
        .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
        .barActions=${e.actions} .phones=${e.phones===!0} .libraryItem=${e.libraryItem}
        .onOpenItem=${e.onOpenItem} .onOpenBoard=${e.onOpenBoard}></wa-status-pages-editor>`:r`<div class="wp-loading">
        <button class="tb-btn tb-back" title="Back to the Status pages tab" @click=${e.onBack}>${i("left")}<span>Status pages</span></button>
        ${G?r`<span>The status page editor did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
      </div>`}var h="/voice";function Pe(e){let n=e?.path??"";return n===h||n.startsWith(`${h}/`)}function wt(e){let n=e?.path??"",t=`${h}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}function Ue(e,n,t=""){let a=e?.prefix??t.replace(/\/voice(\/.*)?$/,"");return n?`${a}${h}`:a}function bt(e,n){let t=Ue(e,n,window.location.pathname);t===""||t===window.location.pathname||(history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var yt="https://docs.wrist-assistant.com/watch-app/voice/",q;function xt(e){q=e}function Pt(){return q?.dirty()??!1}function vt(){q?.drop()}var xe,z=!1;function Ve(){return xe??=import("./voice-editor-OHEXLXST.js").then(()=>{},e=>{throw z=!0,e}),xe}function Rt(){return r`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${re`<path d="M4 9.5H7.5L12 5.5V18.5L7.5 14.5H4Z" /><path d="M15.5 9.2A4 4 0 0 1 15.5 14.8" /><path d="M18.2 6.8A7.5 7.5 0 0 1 18.2 17.2" />`}</svg>`}function Tt(e){let n=customElements.get("wa-voice-editor")!==void 0;return!n&&!z&&Ve().then(e.onLoaded,e.onLoaded),r`${e.dialogs}
    ${n?r`<wa-voice-editor .hass=${e.hass} .owners=${e.owners} .ownerId=${e.ownerId}
          .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
          .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
          .barActions=${e.actions} .shellOwnsWatch=${e.shell===!0} .barHost=${e.barHost}></wa-voice-editor>`:r`<div class="wp-loading">
          ${e.shell===!0?s:r`<button class="tb-btn tb-back" title="Back to complications" @click=${e.onBack}>${i("left")}<span>Complications</span></button>`}
          ${z?r`<span>The voice editor did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
        </div>`}`}var Z="/all-menus",ve,Y=!1;function je(){return ve??=import("./all-menus-HHWODF4N.js").then(()=>{},e=>{throw Y=!0,e}),ve}function Ht(e){let n=customElements.get("wa-all-menus")!==void 0;return!n&&!Y&&je().then(e.onLoaded,e.onLoaded),n?r`<wa-all-menus .hass=${e.hass} .owners=${e.owners} .ownersReady=${e.ownersReady} .phones=${e.phones}
    .icons=${e.icons} .iconsTick=${e.iconsTick} .onOpenLibrary=${e.onOpenLibrary}
    .focusOwner=${e.focusOwner} .onFocus=${e.onFocus} .onOpenScreen=${e.onOpenScreen}
    ?embedded=${e.embedded===!0} .searchText=${e.searchText??""}></wa-all-menus>`:r`<div class="ap-loading">${Y?"The Menus tab did not load. Reload the page to try again.":"Loading\u2026"}</div>`}var Q="/all-pages",X="/all-status-pages";function Wt(e,n){if(e===void 0||!e.startsWith(`${n}/`))return;let t=e.slice(n.length+1).split("/")[0]??"";if(t!=="")try{return decodeURIComponent(t)}catch{return}}function Te(e,n){return n===void 0?e:`${e}/${encodeURIComponent(n)}`}var Re,J=!1;function Ne(){return Re??=import("./all-pages-AZMSRDFP.js").then(()=>{},e=>{throw J=!0,e}),Re}function It(e){let n=customElements.get("wa-all-pages")!==void 0;if(!n&&!J&&Ne().then(e.onLoaded,e.onLoaded),!n){let t=e.kind==="status_pages"?"Status pages":"Pages";return r`<div class="ap-loading">${J?`The ${t} tab did not load. Reload the page to try again.`:"Loading\u2026"}</div>`}return r`<wa-all-pages .kind=${e.kind} .hass=${e.hass} .owners=${e.owners} .ownersReady=${e.ownersReady} .phones=${e.phones}
    .icons=${e.icons} .iconsTick=${e.iconsTick} .onOpenLibrary=${e.onOpenLibrary}
    .focusOwner=${e.focusOwner} .onFocus=${e.onFocus} .onOpenScreen=${e.onOpenScreen}
    ?embedded=${e.embedded===!0} .searchText=${e.searchText??""}></wa-all-pages>`}var Lt=g`
  .ap-loading { flex: 1 1 auto; padding: 24px clamp(12px, 3vw, 28px); font-size: 13px; color: var(--wa-muted); background: var(--wa-bg); }
`;var v="/watch-complications";function $e(e){let n=e?.path??"";return n===v||n.startsWith(`${v}/`)}function Ot(e){let n=e?.path??"",t=`${v}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}var R="/control-center";function ke(e){let n=e?.path??"";return n===R||n.startsWith(`${R}/`)}function Et(e){let n=e?.path??"",t=`${R}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}var Mt="https://docs.wrist-assistant.com/watch-app/complications/#control-center";var Ke="",f="/devices",ee="all",He="/shared",W="/complications",Se="design",S="/iphone",$=[{id:"home",label:"Devices",path:f,icon:"watch"},{id:"pages",label:"Pages",path:Q,icon:"pages"},{id:"status-pages",label:"Status pages",path:X,icon:"checklist"},{id:"menus",label:"Menus",path:Z,icon:"radial"},{id:"complications",label:"Complications",path:W,icon:"gauge"},{id:"home-map",label:"Home map",path:w,icon:"home"},{id:"shared",label:"Shared",path:He,icon:"layers"}],Fe=Object.fromEntries($.map(e=>[e.id,e.icon])),Ge={...Object.fromEntries($.map(e=>[e.id,e.label])),watch:"Watch app",get iphone(){return l("iPhone app","Phone app")}},ne=[{id:"pages",label:"Pages",blurb:"are the screens you swipe between on the watch: tiles for lights, scenes, cameras and more.",path:p},{id:"menus",label:"Menus",blurb:"are the quick menus on the watch: the Anywhere menu, a menu for each kind of entity and the page switcher.",path:y},{id:"status-pages",label:"Status pages",get blurb(){return l("are lists to read at a glance, like the lights that are on or low batteries, opened from a tile, a menu or Siri.","are lists to read at a glance, like the lights that are on or low batteries, opened from a tile, a menu or, on Apple devices, Siri.")},path:P},{id:"control-center",label:"Control Center",blurb:"The list of controls",path:R,retired:!0},{id:"rooms",label:"Rooms",blurb:"let the watch open a room's page when you are in that room, and set up point control: point the watch at a thing to control it.",path:u},{id:"voice",label:"Voice",blurb:"sets how the watch listens and speaks: the Assist and Speak defaults, your saved phrases and the watch voice.",path:h},{id:"watch-complications",label:"Complications",blurb:"are what this watch's faces show, with every other design you could add under them, made in the Complications tab.",path:v},{id:"http-actions",label:"HTTP actions",get blurb(){return l("are web requests Home Assistant sends when a watch or an iPhone runs one from a tile, a menu or a complication, shared by every watch and iPhone.","are web requests Home Assistant sends when a watch or a phone runs one from a tile, a menu or a complication, shared by every watch and phone.")},path:b,shared:!0},{id:"cameras",label:"Camera framing",get blurb(){return l("sets how each camera's picture is framed in alerts, the same on the watch and the iPhone.","sets how each camera's picture is framed in alerts, the same on the watch and the phone.")},path:E,shared:!0},{id:"home-map",label:"Home map",blurb:"is the plan of your home from the iPhone's scan, with a pin for each device, shown on the iPhone, the watch and a Home map tile.",path:w,shared:!0,beta:"alpha",capability:_}],ze={id:"settings",label:"Settings",blurb:"sets how the watch behaves: gestures, wrist twists, pages, cameras and how it connects.",path:x};function to(e){return`${e.label} ${e.blurb}`}function te(e,n){return n&&e.shared!==!0?`${e.path}/${encodeURIComponent(n)}`:e.path}function I(e){let n=t=>ne.find(a=>a.id===t);if(me(e))return n("pages");if(he(e))return n("menus");if(ye(e))return n("status-pages");if(ke(e))return n("control-center");if(we(e))return n("rooms");if(Pe(e))return n("voice");if($e(e))return n("watch-complications");if(pe(e))return n("http-actions");if(se(e))return n("cameras");if(ce(e))return n("home-map");if(F(e))return ze}var qe=new Set(["pages","menus","status-pages","rooms","settings"]);function Ae(e){return qe.has(e.id)}var Ye=ne.filter(Ae);function Ze(e){let n=e?.path??"";if(e===void 0||n!==S&&!n.startsWith(`${S}/`))return;let t=n.slice(S.length);return{prefix:e.prefix,path:t===""||t==="/"?p:t}}function oe(e){let n=I(Ze(e));return n!==void 0&&Ae(n)?n:void 0}function We(e,n){return`${S}${te(e,n)}`}function oo(e,n,t){return Je(n.id,t)??(e==="iphone"?We(n,t):te(n,t))}function Je(e,n){let t=e==="pages"?Q:e==="status-pages"?X:e==="menus"?Z:void 0;return t===void 0?void 0:Te(t,n)}var T="/library",L=[{kind:"pages",segment:"pages",tab:"pages",screen:"pages"},{kind:"status_pages",segment:"status-pages",tab:"status-pages",screen:"status-pages"},{kind:"menus",segment:"menus",tab:"menus",screen:"menus"}];function ao(e,n,t){let a=L.find(d=>d.kind===e).segment,o=`${T}/${a}/${encodeURIComponent(n)}`;return t===void 0||t===""?o:`${o}/${encodeURIComponent(t)}`}function ae(e){let n=e?.path??"";if(!n.startsWith(`${T}/`))return;let[t,a,o,...d]=n.slice(T.length+1).split("/"),c=L.find(O=>O.segment===t);if(c===void 0||a===void 0||a===""||d.some(O=>O!==""))return;let m,C;try{m=decodeURIComponent(a),C=o===void 0||o===""?void 0:decodeURIComponent(o)}catch{return}return C===void 0?{kind:c.kind,id:m}:{kind:c.kind,id:m,from:C}}function Qe(e){return L.find(n=>n.kind===e.kind).tab}function A(e){if(I(e)!==void 0)return"watch";if(oe(e)!==void 0)return"iphone";let n=ae(e);if(n!==void 0)return Qe(n);let t=e?.path??"";return $.find(o=>t===o.path||t.startsWith(`${o.path}/`))?.id??"home"}function ro(e){let n=ae(e);if(n!==void 0)return L.find(o=>o.kind===n.kind).screen;let t=I(e)?.id??oe(e)?.id;if(t!==void 0)return t;let a=Ie(e);return a==="home"||a==="complications"||a==="shared"||a==="home-map"?a:`all-${a}`}function Xe(e,n,t){return e==="watch"?te(ne[0],n):e==="iphone"?We(Ye[0],t):$.find(a=>a.id===e)?.path??Ke}var en=$.map(e=>e.id);function nn(e,n=()=>ie()){return en.filter(t=>t!=="home-map"||t===e||n(_))}function tn(e){switch(e){case"pages":return"pages";case"status-pages":return"status-pages";case"menus":return"menus";case"watch-complications":case"control-center":return"complications";case"http-actions":case"cameras":return"shared";case"home-map":return"home-map";case"rooms":case"voice":case"settings":return"home"}}function Ie(e){let n=A(e);if(n!=="watch"&&n!=="iphone")return n;let t=n==="watch"?I(e):oe(e);return t===void 0?"home":tn(t.id)}function io(e){return e===void 0||e===""?f:`${f}/${e===ee?ee:encodeURIComponent(e)}`}function so(e){let n=e?.path??"";if(!n.startsWith(`${f}/`))return;let[t]=n.slice(f.length+1).split("/");if(!(t===void 0||t==="")){if(t===ee)return{all:!0};try{return{owner:decodeURIComponent(t)}}catch{return}}}function co(e,n){return`${W}/${Se}/${encodeURIComponent(e)}/${encodeURIComponent(n)}`}function lo(e){let n=e?.path??"",t=`${W}/${Se}/`;if(!n.startsWith(t))return;let[a,o,...d]=n.slice(t.length).split("/");if(!(a===void 0||a===""||o===void 0||o===""||d.some(c=>c!=="")))try{return{owner:decodeURIComponent(a),id:decodeURIComponent(o)}}catch{return}}function po(e){let n=e?.path??"";if(n===T||n===`${T}/`)return He;if(n===`${f}/`)return f}var on=new RegExp(`(${[...$.map(e=>e.path),T,S,p,y,h,P,R,u,b,E,x,v,w].join("|")})(/.*)?$`);function Le(e,n=""){return e?e.prefix:n.replace(on,"").replace(/\/$/,"")}function an(e,n,t=""){return`${Le(e,t)}${n}`}function rn(e,n,t=!1){let a=Le(e,window.location.pathname),o=`${a}${n}`;if(!(o===""||o===window.location.pathname))return t?history.replaceState(history.state,"",o):history.pushState(null,"",o),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:t}})),{prefix:a,path:n}}function uo(){rn(void 0,b)}function sn(e){return e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey}function dn(e,n){return n&&A(e)==="complications"}function ho(e){return(e.metaKey||e.ctrlKey)&&e.key==="s"}function fo(e,n){let t=A(e);return!dn(e,n)&&t!=="watch"&&t!=="iphone"&&ae(e)===void 0}function mo(e,n){if(A(e)!=="complications")return n.shareLink?W:void 0}function go(e){return A(e)==="complications"}var cn=r`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5" />
  <path d="M9.6 9.4a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.7" /><path d="M12 17V17.2" /></svg>`;function wo(e){let n=Ie(e.route),t=o=>an(e.route,Xe(o),globalThis.location?.pathname??""),a=o=>e.unsavedTabs?.has(o)===!0||o==="home"&&e.watchUnsaved===!0;return r`<nav class="wa-tabs" aria-label="Wrist Assistant">
    ${e.menu?r`<button class="wa-tabs-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
      @click=${e.onMenu}>${i("menu")}</button>`:s}
    <span class="wa-tabs-name">Wrist Assistant</span>
    <span class="wa-tabs-list">${nn(n).map((o,d,c)=>r`${d>0&&(o==="home-map"||o==="shared")&&c[d-1]!=="home-map"?r`<span class="wa-tabs-sep" aria-hidden="true"></span>`:s}<a class="wa-tab ${o===n?"on":""}"
      href=${t(o)} aria-current=${o===n?"page":"false"}
      @click=${m=>{sn(m)&&(m.preventDefault(),e.onTab(o))}}>${i(Fe[o])}${Ge[o]}${a(o)?ln():s}</a>`)}</span>
    <span class="wa-tabs-end">${e.sync??s}${e.onHelp?r`<button type="button" class="wa-tabs-help" title="Help and setup guide" aria-label="Help" aria-haspopup="dialog"
      @click=${e.onHelp}>${cn}<span>Help</span></button>`:s}</span>
  </nav>`}function ln(){return r`<i class="wa-unsaved" role="img" aria-label="unsaved changes"></i>`}var bo=g`
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
`;export{un as a,Ot as b,Et as c,Mt as d,gn as e,wn as f,bn as g,yn as h,xn as i,Tn as j,$n as k,kn as l,Hn as m,Sn as n,An as o,Cn as p,On as q,_n as r,En as s,Mn as t,Bn as u,Dn as v,Un as w,Vn as x,Fn as y,Gn as z,zn as A,qn as B,Yn as C,Zn as D,Jn as E,F,Xn as G,et as H,nt as I,tt as J,it as K,st as L,dt as M,ct as N,lt as O,pt as P,ut as Q,ht as R,wt as S,bt as T,yt as U,xt as V,Pt as W,vt as X,Rt as Y,Tt as Z,Z as _,Ht as $,Q as aa,X as ba,Wt as ca,Te as da,It as ea,Lt as fa,Ke as ga,f as ha,ee as ia,He as ja,W as ka,S as la,$ as ma,ne as na,ze as oa,to as pa,te as qa,I as ra,Ae as sa,Ye as ta,Ze as ua,oe as va,We as wa,oo as xa,Je as ya,ao as za,ae as Aa,A as Ba,ro as Ca,Xe as Da,tn as Ea,io as Fa,so as Ga,co as Ha,lo as Ia,po as Ja,an as Ka,rn as La,uo as Ma,sn as Na,dn as Oa,ho as Pa,fo as Qa,mo as Ra,go as Sa,wo as Ta,ln as Ua,bo as Va};
