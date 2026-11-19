import{b as O,e as re,h as A,j as ie}from"./chunk-SOK665NS.js";import{a as E,b as se}from"./chunk-TSTLXBIR.js";import{ph as i}from"./chunk-CDPOLDB2.js";import{l}from"./chunk-M6TODPS6.js";import{b as g,f as r,g as ae,i as s}from"./chunk-6ZDBXU6B.js";var b="/http-actions";function ce(e){let n=e?.path??"";return n===b||n.startsWith(`${b}/`)}var ln="https://docs.houselit.app/features/http-actions/",B;function pn(e){B=e}function un(){return B?.dirty()??!1}function hn(){B?.drop()}var de,M=!1;function Ie(){return de??=import("./http-actions-editor-DMSDCP4Q.js").then(()=>{},e=>{throw M=!0,e}),de}function fn(e){if(e.hass.user?.is_admin===!1)return r`<div class="wp-loading">
        <span>Only an administrator can change HTTP actions. Your watch and ${l("iPhone","phone")} can still run every one, from a tile, a menu or a complication.</span>
      </div>`;let n=customElements.get("wa-http-actions-editor")!==void 0;return!n&&!M&&Ie().then(e.onLoaded,e.onLoaded),n?r`<wa-http-actions-editor .hass=${e.hass} .owners=${e.owners}
        .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow} .barHost=${e.barHost}></wa-http-actions-editor>`:r`<div class="wp-loading">
        ${M?r`<span>The HTTP actions screen did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
      </div>`}var w="/menus";function pe(e){let n=e?.path??"";return n===w||n.startsWith(`${w}/`)}function wn(e){let n=e?.path??"",t=`${w}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}var yn="https://docs.houselit.app/watch-app/quick-menu/",U;function xn(e){U=e}function Pn(){return U?.dirty()??!1}function vn(){U?.drop()}var le,D=!1;function Le(){return le??=import("./menu-editor-PX5ZI6AU.js").then(()=>{},e=>{throw D=!0,e}),le}function Rn(e){let n=customElements.get("wa-menu-editor")!==void 0;return!n&&!D&&Le().then(e.onLoaded,e.onLoaded),n?r`<wa-menu-editor .hass=${e.hass} .owners=${e.owners}
        .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
        .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
        .barActions=${e.actions} .phones=${e.phones===!0} .libraryItem=${e.libraryItem}></wa-menu-editor>`:r`<div class="wp-loading">
        <button class="tb-btn tb-back" title="Back to the Menus tab" @click=${e.onBack}>${i("left")}<span>Menus</span></button>
        ${D?r`<span>The menu editor did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
      </div>`}var p="/pages";function he(e){let n=e?.path??"";return n===p||n.startsWith(`${p}/`)}function Sn(e){let n=e?.path??"",t=`${p}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}var Hn="https://docs.houselit.app/watch-app/pages-in-home-assistant/",$;function An(e){$=e}function Wn(){return $?.dirty()??!1}function In(){return $?.unsent()??!1}function Ln(){return $?.savesDone()}function Cn(){$?.drop()}var ue,V=!1;function Ce(){return ue??=import("./page-editor-HFSNZXAQ.js").then(()=>{},e=>{throw V=!0,e}),ue}function _n(e){let n=customElements.get("wa-page-editor")!==void 0;return!n&&!V&&Ce().then(e.onLoaded,e.onLoaded),n?r`<wa-page-editor .hass=${e.hass} .owners=${e.owners}
        .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
        .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
        .barActions=${e.actions} .phones=${e.phones===!0} .libraryItem=${e.libraryItem}
        .onOpenItem=${e.onOpenItem} .onOpenBoard=${e.onOpenBoard}></wa-page-editor>`:r`<div class="wp-loading">
        <button class="tb-btn tb-back" title="Back to the Pages tab" @click=${e.onBack}>${i("left")}<span>Pages</span></button>
        ${V?r`<span>The page editor did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
      </div>`}var On=g`
  button.tb-btn.tb-back { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-back svg.ui-icon { width: 14px; height: 14px; }
  .wp-loading { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; padding: 12px 16px; color: var(--wa-muted); }
`;var u="/rooms";function me(e){let n=e?.path??"";return n===u||n.startsWith(`${u}/`)}function Dn(e){let n=e?.path??"",t=`${u}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}function _e(e,n,t=""){let a=e?.prefix??t.replace(/\/rooms(\/.*)?$/,"");return n?`${a}${u}`:a}function Un(e,n){let t=_e(e,n,window.location.pathname);t===""||t===window.location.pathname||(history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var Vn="https://docs.houselit.app/features/rooms/",j;function Nn(e){j=e}function jn(){return j?.dirty()??!1}function Kn(){j?.drop()}var fe,N=!1;function Oe(){return fe??=import("./rooms-editor-6PSATQWW.js").then(()=>{},e=>{throw N=!0,e}),fe}function Fn(e){let n=customElements.get("wa-rooms-editor")!==void 0;return!n&&!N&&Oe().then(e.onLoaded,e.onLoaded),r`${e.dialogs}
    ${n?r`<wa-rooms-editor .hass=${e.hass} .owners=${e.owners} .ownerId=${e.ownerId}
          .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow} .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
          .barActions=${e.actions} .shellOwnsWatch=${e.shell===!0} .barHost=${e.barHost}
          .phones=${e.phones===!0}></wa-rooms-editor>`:r`<div class="wp-loading">
          ${e.shell===!0?s:r`<button class="tb-btn tb-back" title="Back to complications" @click=${e.onBack}>${i("left")}<span>Complications</span></button>`}
          ${N?r`<span>The Rooms editor did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
        </div>`}`}var y="/settings";function K(e){let n=e?.path??"";return n===y||n.startsWith(`${y}/`)}function zn(e){let n=e?.path??"",t=`${y}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}function qn(e,n){return(n.metaKey||n.ctrlKey)&&n.key==="s"&&K(e)}function Yn(e,n,t){return t===void 0?e&&n===void 0?"stay":"clear":e&&n===t?"stay":"load"}function Zn(e){return e.behaviorChanges+e.styleChanges+(e.addressChanges??0)>0&&!e.busy&&(e.behaviorChanges===0||e.behaviorHeld)&&(e.styleChanges===0||e.styleHeld)}var x="/status-pages";function be(e){let n=e?.path??"";return n===x||n.startsWith(`${x}/`)}function et(e){let n=e?.path??"",t=`${x}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}var nt="https://docs.houselit.app/features/status-pages/",k;function tt(e){k=e}function ot(){return k?.dirty()??!1}function at(){return k?.unsent()??!1}function rt(){return k?.savesDone()}function it(){k?.drop()}var ge,F=!1;function Ee(){return ge??=import("./status-pages-editor-BOV6QNCB.js").then(()=>{},e=>{throw F=!0,e}),ge}function st(e){let n=customElements.get("wa-status-pages-editor")!==void 0;return!n&&!F&&Ee().then(e.onLoaded,e.onLoaded),n?r`<wa-status-pages-editor .hass=${e.hass} .owners=${e.owners}
        .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
        .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
        .barActions=${e.actions} .phones=${e.phones===!0} .libraryItem=${e.libraryItem}
        .onOpenItem=${e.onOpenItem} .onOpenBoard=${e.onOpenBoard}></wa-status-pages-editor>`:r`<div class="wp-loading">
        <button class="tb-btn tb-back" title="Back to the Status pages tab" @click=${e.onBack}>${i("left")}<span>Status pages</span></button>
        ${F?r`<span>The status page editor did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
      </div>`}var h="/voice";function ye(e){let n=e?.path??"";return n===h||n.startsWith(`${h}/`)}function pt(e){let n=e?.path??"",t=`${h}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}function Me(e,n,t=""){let a=e?.prefix??t.replace(/\/voice(\/.*)?$/,"");return n?`${a}${h}`:a}function ut(e,n){let t=Me(e,n,window.location.pathname);t===""||t===window.location.pathname||(history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var ht="https://docs.houselit.app/watch-app/voice/",z;function ft(e){z=e}function mt(){return z?.dirty()??!1}function gt(){z?.drop()}var we,G=!1;function Be(){return we??=import("./voice-editor-5ABXWXQB.js").then(()=>{},e=>{throw G=!0,e}),we}function bt(){return r`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ae`<path d="M4 9.5H7.5L12 5.5V18.5L7.5 14.5H4Z" /><path d="M15.5 9.2A4 4 0 0 1 15.5 14.8" /><path d="M18.2 6.8A7.5 7.5 0 0 1 18.2 17.2" />`}</svg>`}function wt(e){let n=customElements.get("wa-voice-editor")!==void 0;return!n&&!G&&Be().then(e.onLoaded,e.onLoaded),r`${e.dialogs}
    ${n?r`<wa-voice-editor .hass=${e.hass} .owners=${e.owners} .ownerId=${e.ownerId}
          .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
          .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
          .barActions=${e.actions} .shellOwnsWatch=${e.shell===!0} .barHost=${e.barHost}></wa-voice-editor>`:r`<div class="wp-loading">
          ${e.shell===!0?s:r`<button class="tb-btn tb-back" title="Back to complications" @click=${e.onBack}>${i("left")}<span>Complications</span></button>`}
          ${G?r`<span>The voice editor did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
        </div>`}`}var Y="/all-menus",xe,q=!1;function De(){return xe??=import("./all-menus-JBHKDAGH.js").then(()=>{},e=>{throw q=!0,e}),xe}function Pt(e){let n=customElements.get("wa-all-menus")!==void 0;return!n&&!q&&De().then(e.onLoaded,e.onLoaded),n?r`<wa-all-menus .hass=${e.hass} .owners=${e.owners} .ownersReady=${e.ownersReady} .phones=${e.phones}
    .icons=${e.icons} .iconsTick=${e.iconsTick} .onOpenLibrary=${e.onOpenLibrary}
    .focusOwner=${e.focusOwner} .onFocus=${e.onFocus} .onOpenScreen=${e.onOpenScreen}
    ?embedded=${e.embedded===!0} .searchText=${e.searchText??""}></wa-all-menus>`:r`<div class="ap-loading">${q?"The Menus tab did not load. Reload the page to try again.":"Loading\u2026"}</div>`}var J="/all-pages",Q="/all-status-pages";function Tt(e,n){if(e===void 0||!e.startsWith(`${n}/`))return;let t=e.slice(n.length+1).split("/")[0]??"";if(t!=="")try{return decodeURIComponent(t)}catch{return}}function ve(e,n){return n===void 0?e:`${e}/${encodeURIComponent(n)}`}var Pe,Z=!1;function Ue(){return Pe??=import("./all-pages-ESVAKZJO.js").then(()=>{},e=>{throw Z=!0,e}),Pe}function $t(e){let n=customElements.get("wa-all-pages")!==void 0;if(!n&&!Z&&Ue().then(e.onLoaded,e.onLoaded),!n){let t=e.kind==="status_pages"?"Status pages":"Pages";return r`<div class="ap-loading">${Z?`The ${t} tab did not load. Reload the page to try again.`:"Loading\u2026"}</div>`}return r`<wa-all-pages .kind=${e.kind} .hass=${e.hass} .owners=${e.owners} .ownersReady=${e.ownersReady} .phones=${e.phones}
    .icons=${e.icons} .iconsTick=${e.iconsTick} .onOpenLibrary=${e.onOpenLibrary}
    .focusOwner=${e.focusOwner} .onFocus=${e.onFocus} .onOpenScreen=${e.onOpenScreen}
    ?embedded=${e.embedded===!0} .searchText=${e.searchText??""}></wa-all-pages>`}var kt=g`
  .ap-loading { flex: 1 1 auto; padding: 24px clamp(12px, 3vw, 28px); font-size: 13px; color: var(--wa-muted); background: var(--wa-bg); }
`;var P="/watch-complications";function Re(e){let n=e?.path??"";return n===P||n.startsWith(`${P}/`)}function Ht(e){let n=e?.path??"",t=`${P}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}var v="/control-center";function Te(e){let n=e?.path??"";return n===v||n.startsWith(`${v}/`)}function Wt(e){let n=e?.path??"",t=`${v}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}var It="https://docs.houselit.app/watch-app/complications/#control-center";var Ve="",f="/devices",X="all",$e="/shared",W="/complications",ke="design",S="/iphone",T=[{id:"home",label:"Devices",path:f,icon:"watch"},{id:"pages",label:"Pages",path:J,icon:"pages"},{id:"status-pages",label:"Status pages",path:Q,icon:"checklist"},{id:"menus",label:"Menus",path:Y,icon:"radial"},{id:"complications",label:"Complications",path:W,icon:"gauge"},{id:"home-map",label:"Home map",path:A,icon:"home"},{id:"shared",label:"Shared",path:$e,icon:"layers"}],Ne=Object.fromEntries(T.map(e=>[e.id,e.icon])),je={...Object.fromEntries(T.map(e=>[e.id,e.label])),watch:"Watch app",get iphone(){return l("iPhone app","Phone app")}},ee=[{id:"pages",label:"Pages",blurb:"are the screens you swipe between on the watch: tiles for lights, scenes, cameras and more.",path:p},{id:"menus",label:"Menus",blurb:"are the quick menus on the watch: the Anywhere menu, a menu for each kind of entity and the page switcher.",path:w},{id:"status-pages",label:"Status pages",get blurb(){return l("are lists to read at a glance, like the lights that are on or low batteries, opened from a tile, a menu or Siri.","are lists to read at a glance, like the lights that are on or low batteries, opened from a tile, a menu or, on Apple devices, Siri.")},path:x},{id:"control-center",label:"Control Center",blurb:"The list of controls",path:v,retired:!0},{id:"rooms",label:"Rooms",blurb:"let the watch open a room's page when you are in that room, and set up point control: point the watch at a thing to control it.",path:u},{id:"voice",label:"Voice",blurb:"sets how the watch listens and speaks: the Assist and Speak defaults, your saved phrases and the watch voice.",path:h},{id:"watch-complications",label:"Complications",blurb:"are what this watch's faces show, with every other design you could add under them, made in the Complications tab.",path:P},{id:"http-actions",label:"HTTP actions",get blurb(){return l("are web requests Home Assistant sends when a watch or an iPhone runs one from a tile, a menu or a complication, shared by every watch and iPhone.","are web requests Home Assistant sends when a watch or a phone runs one from a tile, a menu or a complication, shared by every watch and phone.")},path:b,shared:!0},{id:"cameras",label:"Camera framing",get blurb(){return l("sets how each camera's picture is framed in alerts, the same on the watch and the iPhone.","sets how each camera's picture is framed in alerts, the same on the watch and the phone.")},path:E,shared:!0},{id:"home-map",label:"Home map",blurb:"is the plan of your home, drawn here or scanned with an iPhone Pro or iPad Pro, with a pin for each device, shown on the iPhone, the watch and a Home map tile.",path:A,shared:!0,beta:"alpha",capability:O}],Ke={id:"settings",label:"Settings",blurb:"sets how the watch behaves: gestures, wrist twists, pages, cameras and how it connects.",path:y};function Zt(e){return`${e.label} ${e.blurb}`}function ne(e,n){return n&&e.shared!==!0?`${e.path}/${encodeURIComponent(n)}`:e.path}function I(e){let n=t=>ee.find(a=>a.id===t);if(he(e))return n("pages");if(pe(e))return n("menus");if(be(e))return n("status-pages");if(Te(e))return n("control-center");if(me(e))return n("rooms");if(ye(e))return n("voice");if(Re(e))return n("watch-complications");if(ce(e))return n("http-actions");if(se(e))return n("cameras");if(ie(e))return n("home-map");if(K(e))return Ke}var Fe=new Set(["pages","menus","status-pages","rooms","settings"]);function Se(e){return Fe.has(e.id)}var Ge=ee.filter(Se);function ze(e){let n=e?.path??"";if(e===void 0||n!==S&&!n.startsWith(`${S}/`))return;let t=n.slice(S.length);return{prefix:e.prefix,path:t===""||t==="/"?p:t}}function te(e){let n=I(ze(e));return n!==void 0&&Se(n)?n:void 0}function He(e,n){return`${S}${ne(e,n)}`}function Jt(e,n,t){return qe(n.id,t)??(e==="iphone"?He(n,t):ne(n,t))}function qe(e,n){let t=e==="pages"?J:e==="status-pages"?Q:e==="menus"?Y:void 0;return t===void 0?void 0:ve(t,n)}var R="/library",L=[{kind:"pages",segment:"pages",tab:"pages",screen:"pages"},{kind:"status_pages",segment:"status-pages",tab:"status-pages",screen:"status-pages"},{kind:"menus",segment:"menus",tab:"menus",screen:"menus"}];function Qt(e,n,t){let a=L.find(d=>d.kind===e).segment,o=`${R}/${a}/${encodeURIComponent(n)}`;return t===void 0||t===""?o:`${o}/${encodeURIComponent(t)}`}function oe(e){let n=e?.path??"";if(!n.startsWith(`${R}/`))return;let[t,a,o,...d]=n.slice(R.length+1).split("/"),c=L.find(_=>_.segment===t);if(c===void 0||a===void 0||a===""||d.some(_=>_!==""))return;let m,C;try{m=decodeURIComponent(a),C=o===void 0||o===""?void 0:decodeURIComponent(o)}catch{return}return C===void 0?{kind:c.kind,id:m}:{kind:c.kind,id:m,from:C}}function Ye(e){return L.find(n=>n.kind===e.kind).tab}function H(e){if(I(e)!==void 0)return"watch";if(te(e)!==void 0)return"iphone";let n=oe(e);if(n!==void 0)return Ye(n);let t=e?.path??"";return T.find(o=>t===o.path||t.startsWith(`${o.path}/`))?.id??"home"}function Xt(e){let n=oe(e);if(n!==void 0)return L.find(o=>o.kind===n.kind).screen;let t=I(e)?.id??te(e)?.id;if(t!==void 0)return t;let a=Ae(e);return a==="home"||a==="complications"||a==="shared"||a==="home-map"?a:`all-${a}`}function Ze(e,n,t){return e==="watch"?ne(ee[0],n):e==="iphone"?He(Ge[0],t):T.find(a=>a.id===e)?.path??Ve}var Je=T.map(e=>e.id);function Qe(e,n=()=>re()){return Je.filter(t=>t!=="home-map"||t===e||n(O))}function Xe(e){switch(e){case"pages":return"pages";case"status-pages":return"status-pages";case"menus":return"menus";case"watch-complications":case"control-center":return"complications";case"http-actions":case"cameras":return"shared";case"home-map":return"home-map";case"rooms":case"voice":case"settings":return"home"}}function Ae(e){let n=H(e);if(n!=="watch"&&n!=="iphone")return n;let t=n==="watch"?I(e):te(e);return t===void 0?"home":Xe(t.id)}function eo(e){return e===void 0||e===""?f:`${f}/${e===X?X:encodeURIComponent(e)}`}function no(e){let n=e?.path??"";if(!n.startsWith(`${f}/`))return;let[t]=n.slice(f.length+1).split("/");if(!(t===void 0||t==="")){if(t===X)return{all:!0};try{return{owner:decodeURIComponent(t)}}catch{return}}}function to(e,n){return`${W}/${ke}/${encodeURIComponent(e)}/${encodeURIComponent(n)}`}function oo(e){let n=e?.path??"",t=`${W}/${ke}/`;if(!n.startsWith(t))return;let[a,o,...d]=n.slice(t.length).split("/");if(!(a===void 0||a===""||o===void 0||o===""||d.some(c=>c!=="")))try{return{owner:decodeURIComponent(a),id:decodeURIComponent(o)}}catch{return}}function ao(e){let n=e?.path??"";if(n===R||n===`${R}/`)return $e;if(n===`${f}/`)return f}var en=new RegExp(`(${[...T.map(e=>e.path),R,S,p,w,h,x,v,u,b,E,y,P,A].join("|")})(/.*)?$`);function We(e,n=""){return e?e.prefix:n.replace(en,"").replace(/\/$/,"")}function nn(e,n,t=""){return`${We(e,t)}${n}`}function tn(e,n,t=!1){let a=We(e,window.location.pathname),o=`${a}${n}`;if(!(o===""||o===window.location.pathname))return t?history.replaceState(history.state,"",o):history.pushState(null,"",o),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:t}})),{prefix:a,path:n}}function ro(){tn(void 0,b)}function on(e){return e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey}function an(e,n){return n&&H(e)==="complications"}function io(e){return(e.metaKey||e.ctrlKey)&&e.key==="s"}function so(e,n){let t=H(e);return!an(e,n)&&t!=="watch"&&t!=="iphone"&&oe(e)===void 0}function co(e,n){if(H(e)!=="complications")return n.shareLink?W:void 0}function lo(e){return H(e)==="complications"}var rn=r`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5" />
  <path d="M9.6 9.4a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.7" /><path d="M12 17V17.2" /></svg>`;function po(e){let n=Ae(e.route),t=o=>nn(e.route,Ze(o),globalThis.location?.pathname??""),a=o=>e.unsavedTabs?.has(o)===!0||o==="home"&&e.watchUnsaved===!0;return r`<nav class="wa-tabs" aria-label="HouseLit">
    ${e.menu?r`<button class="wa-tabs-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
      @click=${e.onMenu}>${i("menu")}</button>`:s}
    <span class="wa-tabs-name">HouseLit</span>
    <span class="wa-tabs-list">${Qe(n).map((o,d,c)=>r`${d>0&&(o==="home-map"||o==="shared")&&c[d-1]!=="home-map"?r`<span class="wa-tabs-sep" aria-hidden="true"></span>`:s}<a class="wa-tab ${o===n?"on":""}"
      href=${t(o)} aria-current=${o===n?"page":"false"}
      @click=${m=>{on(m)&&(m.preventDefault(),e.onTab(o))}}>${i(Ne[o])}${je[o]}${a(o)?sn():s}</a>`)}</span>
    <span class="wa-tabs-end">${e.sync??s}${e.onHelp?r`<button type="button" class="wa-tabs-help" title="Help and setup guide" aria-label="Help" aria-haspopup="dialog"
      @click=${e.onHelp}>${rn}<span>Help</span></button>`:s}</span>
  </nav>`}function sn(){return r`<i class="wa-unsaved" role="img" aria-label="unsaved changes"></i>`}var uo=g`
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
`;export{Ht as a,Wt as b,It as c,ln as d,pn as e,un as f,hn as g,fn as h,wn as i,yn as j,xn as k,Pn as l,vn as m,Rn as n,Sn as o,Hn as p,An as q,Wn as r,In as s,Ln as t,Cn as u,_n as v,On as w,Dn as x,Un as y,Vn as z,Nn as A,jn as B,Kn as C,Fn as D,K as E,zn as F,qn as G,Yn as H,Zn as I,et as J,nt as K,tt as L,ot as M,at as N,rt as O,it as P,st as Q,pt as R,ut as S,ht as T,ft as U,mt as V,gt as W,bt as X,wt as Y,Y as Z,Pt as _,J as $,Q as aa,Tt as ba,ve as ca,$t as da,kt as ea,Ve as fa,f as ga,X as ha,$e as ia,W as ja,S as ka,T as la,ee as ma,Ke as na,Zt as oa,ne as pa,I as qa,Se as ra,Ge as sa,ze as ta,te as ua,He as va,Jt as wa,qe as xa,Qt as ya,oe as za,H as Aa,Xt as Ba,Ze as Ca,Xe as Da,eo as Ea,no as Fa,to as Ga,oo as Ha,ao as Ia,nn as Ja,tn as Ka,ro as La,on as Ma,an as Na,io as Oa,so as Pa,co as Qa,lo as Ra,po as Sa,sn as Ta,uo as Ua};
