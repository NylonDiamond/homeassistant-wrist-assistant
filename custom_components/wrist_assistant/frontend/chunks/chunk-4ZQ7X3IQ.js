import{b as re}from"./chunk-NFNPNEJA.js";import{a as C,b as ie}from"./chunk-V5G73U2A.js";import{ph as i}from"./chunk-7YGC62I2.js";import{l as c}from"./chunk-T3VRCIVM.js";import{b as f,f as r,g as ae,i as s}from"./chunk-6ZDBXU6B.js";var T="/home-map";function de(e){let n=e?.path??"";return n===T||n.startsWith(`${T}/`)}var se,E=!1;function Le(){return se??=import("./home-map-editor-2DMCRTVO.js").then(()=>{},e=>{throw E=!0,e}),se}function ln(e){let n=customElements.get("wa-home-map-editor")!==void 0;return!n&&!E&&Le().then(e.onLoaded,e.onLoaded),n?r`<wa-home-map-editor .hass=${e.hass} ?narrow=${e.narrow} .icons=${e.icons} .iconsTick=${e.iconsTick}
        .bundleUrl=${e.bundleUrl} .capable=${e.capable} .onHome=${e.onHome} .onOpenPage=${e.onOpenPage}
        .owners=${e.owners??[]} .phones=${e.phones===!0}></wa-home-map-editor>`:r`<div class="wp-loading">
        ${E?r`<span>The Home map page did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
      </div>`}var m="/http-actions";function le(e){let n=e?.path??"";return n===m||n.startsWith(`${m}/`)}var fn="https://docs.wrist-assistant.com/features/http-actions/",B;function mn(e){B=e}function gn(){return B?.dirty()??!1}function wn(){B?.drop()}var ce,M=!1;function Oe(){return ce??=import("./http-actions-editor-CJCUSJVZ.js").then(()=>{},e=>{throw M=!0,e}),ce}function bn(e){if(e.hass.user?.is_admin===!1)return r`<div class="wp-loading">
        <span>Only an administrator can change HTTP actions. Your watch and ${c("iPhone","phone")} can still run every one, from a tile, a menu or a complication.</span>
      </div>`;let n=customElements.get("wa-http-actions-editor")!==void 0;return!n&&!M&&Oe().then(e.onLoaded,e.onLoaded),n?r`<wa-http-actions-editor .hass=${e.hass} .owners=${e.owners}
        .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow} .barHost=${e.barHost}></wa-http-actions-editor>`:r`<div class="wp-loading">
        ${M?r`<span>The HTTP actions screen did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
      </div>`}var g="/menus";function ue(e){let n=e?.path??"";return n===g||n.startsWith(`${g}/`)}function vn(e){let n=e?.path??"",t=`${g}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}var Rn="https://docs.wrist-assistant.com/watch-app/quick-menu/",U;function Tn(e){U=e}function $n(){return U?.dirty()??!1}function kn(){U?.drop()}var pe,D=!1;function _e(){return pe??=import("./menu-editor-TGMF7LBS.js").then(()=>{},e=>{throw D=!0,e}),pe}function Hn(e){let n=customElements.get("wa-menu-editor")!==void 0;return!n&&!D&&_e().then(e.onLoaded,e.onLoaded),n?r`<wa-menu-editor .hass=${e.hass} .owners=${e.owners}
        .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
        .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
        .barActions=${e.actions} .phones=${e.phones===!0} .libraryItem=${e.libraryItem}></wa-menu-editor>`:r`<div class="wp-loading">
        <button class="tb-btn tb-back" title="Back to the Menus tab" @click=${e.onBack}>${i("left")}<span>Menus</span></button>
        ${D?r`<span>The menu editor did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
      </div>`}var l="/pages";function fe(e){let n=e?.path??"";return n===l||n.startsWith(`${l}/`)}function In(e){let n=e?.path??"",t=`${l}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}var Ln="https://docs.wrist-assistant.com/watch-app/pages-in-home-assistant/",$;function On(e){$=e}function _n(){return $?.dirty()??!1}function Cn(){return $?.unsent()??!1}function En(){return $?.savesDone()}function Mn(){$?.drop()}var he,V=!1;function Ce(){return he??=import("./page-editor-OKZSRJMS.js").then(()=>{},e=>{throw V=!0,e}),he}function Bn(e){let n=customElements.get("wa-page-editor")!==void 0;return!n&&!V&&Ce().then(e.onLoaded,e.onLoaded),n?r`<wa-page-editor .hass=${e.hass} .owners=${e.owners}
        .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
        .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
        .barActions=${e.actions} .phones=${e.phones===!0} .libraryItem=${e.libraryItem}
        .onOpenItem=${e.onOpenItem} .onOpenBoard=${e.onOpenBoard}></wa-page-editor>`:r`<div class="wp-loading">
        <button class="tb-btn tb-back" title="Back to the Pages tab" @click=${e.onBack}>${i("left")}<span>Pages</span></button>
        ${V?r`<span>The page editor did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
      </div>`}var Dn=f`
  button.tb-btn.tb-back { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-back svg.ui-icon { width: 14px; height: 14px; }
  .wp-loading { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; padding: 12px 16px; color: var(--wa-muted); }
`;var p="/rooms";function ge(e){let n=e?.path??"";return n===p||n.startsWith(`${p}/`)}function Nn(e){let n=e?.path??"",t=`${p}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}function Ee(e,n,t=""){let a=e?.prefix??t.replace(/\/rooms(\/.*)?$/,"");return n?`${a}${p}`:a}function Kn(e,n){let t=Ee(e,n,window.location.pathname);t===""||t===window.location.pathname||(history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var Fn="https://docs.wrist-assistant.com/features/rooms/",N;function Gn(e){N=e}function zn(){return N?.dirty()??!1}function qn(){N?.drop()}var me,j=!1;function Me(){return me??=import("./rooms-editor-BDUGIMSI.js").then(()=>{},e=>{throw j=!0,e}),me}function Yn(e){let n=customElements.get("wa-rooms-editor")!==void 0;return!n&&!j&&Me().then(e.onLoaded,e.onLoaded),r`${e.dialogs}
    ${n?r`<wa-rooms-editor .hass=${e.hass} .owners=${e.owners} .ownerId=${e.ownerId}
          .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow} .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
          .barActions=${e.actions} .shellOwnsWatch=${e.shell===!0} .barHost=${e.barHost}
          .phones=${e.phones===!0}></wa-rooms-editor>`:r`<div class="wp-loading">
          ${e.shell===!0?s:r`<button class="tb-btn tb-back" title="Back to complications" @click=${e.onBack}>${i("left")}<span>Complications</span></button>`}
          ${j?r`<span>The Rooms editor did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
        </div>`}`}var w="/settings";function K(e){let n=e?.path??"";return n===w||n.startsWith(`${w}/`)}function Jn(e){let n=e?.path??"",t=`${w}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}function Qn(e,n){return(n.metaKey||n.ctrlKey)&&n.key==="s"&&K(e)}function Xn(e,n,t){return t===void 0?e&&n===void 0?"stay":"clear":e&&n===t?"stay":"load"}function et(e){return e.behaviorChanges+e.styleChanges+(e.addressChanges??0)>0&&!e.busy&&(e.behaviorChanges===0||e.behaviorHeld)&&(e.styleChanges===0||e.styleHeld)}var b="/status-pages";function be(e){let n=e?.path??"";return n===b||n.startsWith(`${b}/`)}function at(e){let n=e?.path??"",t=`${b}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}var rt="https://docs.wrist-assistant.com/features/status-pages/",k;function it(e){k=e}function st(){return k?.dirty()??!1}function dt(){return k?.unsent()??!1}function ct(){return k?.savesDone()}function lt(){k?.drop()}var we,F=!1;function Be(){return we??=import("./status-pages-editor-GCAYNZ7I.js").then(()=>{},e=>{throw F=!0,e}),we}function pt(e){let n=customElements.get("wa-status-pages-editor")!==void 0;return!n&&!F&&Be().then(e.onLoaded,e.onLoaded),n?r`<wa-status-pages-editor .hass=${e.hass} .owners=${e.owners}
        .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
        .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
        .barActions=${e.actions} .phones=${e.phones===!0} .libraryItem=${e.libraryItem}
        .onOpenItem=${e.onOpenItem} .onOpenBoard=${e.onOpenBoard}></wa-status-pages-editor>`:r`<div class="wp-loading">
        <button class="tb-btn tb-back" title="Back to the Status pages tab" @click=${e.onBack}>${i("left")}<span>Status pages</span></button>
        ${F?r`<span>The status page editor did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
      </div>`}var u="/voice";function xe(e){let n=e?.path??"";return n===u||n.startsWith(`${u}/`)}function mt(e){let n=e?.path??"",t=`${u}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}function De(e,n,t=""){let a=e?.prefix??t.replace(/\/voice(\/.*)?$/,"");return n?`${a}${u}`:a}function gt(e,n){let t=De(e,n,window.location.pathname);t===""||t===window.location.pathname||(history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var wt="https://docs.wrist-assistant.com/watch-app/voice/",z;function bt(e){z=e}function yt(){return z?.dirty()??!1}function xt(){z?.drop()}var ye,G=!1;function Ue(){return ye??=import("./voice-editor-UDWVDQGO.js").then(()=>{},e=>{throw G=!0,e}),ye}function Pt(){return r`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ae`<path d="M4 9.5H7.5L12 5.5V18.5L7.5 14.5H4Z" /><path d="M15.5 9.2A4 4 0 0 1 15.5 14.8" /><path d="M18.2 6.8A7.5 7.5 0 0 1 18.2 17.2" />`}</svg>`}function vt(e){let n=customElements.get("wa-voice-editor")!==void 0;return!n&&!G&&Ue().then(e.onLoaded,e.onLoaded),r`${e.dialogs}
    ${n?r`<wa-voice-editor .hass=${e.hass} .owners=${e.owners} .ownerId=${e.ownerId}
          .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
          .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
          .barActions=${e.actions} .shellOwnsWatch=${e.shell===!0} .barHost=${e.barHost}></wa-voice-editor>`:r`<div class="wp-loading">
          ${e.shell===!0?s:r`<button class="tb-btn tb-back" title="Back to complications" @click=${e.onBack}>${i("left")}<span>Complications</span></button>`}
          ${G?r`<span>The voice editor did not load. Reload the page to try again.</span>`:r`<span>Loading…</span>`}
        </div>`}`}var Y="/all-menus",Pe,q=!1;function Ve(){return Pe??=import("./all-menus-QR2SV7NF.js").then(()=>{},e=>{throw q=!0,e}),Pe}function $t(e){let n=customElements.get("wa-all-menus")!==void 0;return!n&&!q&&Ve().then(e.onLoaded,e.onLoaded),n?r`<wa-all-menus .hass=${e.hass} .owners=${e.owners} .ownersReady=${e.ownersReady} .phones=${e.phones}
    .icons=${e.icons} .iconsTick=${e.iconsTick} .onOpenLibrary=${e.onOpenLibrary}
    .focusOwner=${e.focusOwner} .onFocus=${e.onFocus} .onOpenScreen=${e.onOpenScreen}
    ?embedded=${e.embedded===!0} .searchText=${e.searchText??""}></wa-all-menus>`:r`<div class="ap-loading">${q?"The Menus tab did not load. Reload the page to try again.":"Loading\u2026"}</div>`}var J="/all-pages",Q="/all-status-pages";function St(e,n){if(e===void 0||!e.startsWith(`${n}/`))return;let t=e.slice(n.length+1).split("/")[0]??"";if(t!=="")try{return decodeURIComponent(t)}catch{return}}function Re(e,n){return n===void 0?e:`${e}/${encodeURIComponent(n)}`}var ve,Z=!1;function je(){return ve??=import("./all-pages-4HF2DJYD.js").then(()=>{},e=>{throw Z=!0,e}),ve}function At(e){let n=customElements.get("wa-all-pages")!==void 0;if(!n&&!Z&&je().then(e.onLoaded,e.onLoaded),!n){let t=e.kind==="status_pages"?"Status pages":"Pages";return r`<div class="ap-loading">${Z?`The ${t} tab did not load. Reload the page to try again.`:"Loading\u2026"}</div>`}return r`<wa-all-pages .kind=${e.kind} .hass=${e.hass} .owners=${e.owners} .ownersReady=${e.ownersReady} .phones=${e.phones}
    .icons=${e.icons} .iconsTick=${e.iconsTick} .onOpenLibrary=${e.onOpenLibrary}
    .focusOwner=${e.focusOwner} .onFocus=${e.onFocus} .onOpenScreen=${e.onOpenScreen}
    ?embedded=${e.embedded===!0} .searchText=${e.searchText??""}></wa-all-pages>`}var Wt=f`
  .ap-loading { flex: 1 1 auto; padding: 24px clamp(12px, 3vw, 28px); font-size: 13px; color: var(--wa-muted); background: var(--wa-bg); }
`;var y="/watch-complications";function Te(e){let n=e?.path??"";return n===y||n.startsWith(`${y}/`)}function Lt(e){let n=e?.path??"",t=`${y}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}var x="/control-center";function $e(e){let n=e?.path??"";return n===x||n.startsWith(`${x}/`)}function _t(e){let n=e?.path??"",t=`${x}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let o=decodeURIComponent(a);return o===""?void 0:o}catch{return}}var Ct="https://docs.wrist-assistant.com/watch-app/complications/#control-center";var Ne="",h="/devices",X="all",ke="/shared",A="/complications",He="design",H="/iphone",v=[{id:"home",label:"Devices",path:h,icon:"watch"},{id:"pages",label:"Pages",path:J,icon:"pages"},{id:"status-pages",label:"Status pages",path:Q,icon:"checklist"},{id:"menus",label:"Menus",path:Y,icon:"radial"},{id:"complications",label:"Complications",path:A,icon:"gauge"},{id:"shared",label:"Shared",path:ke,icon:"layers"}],Ke=Object.fromEntries(v.map(e=>[e.id,e.icon])),Fe={...Object.fromEntries(v.map(e=>[e.id,e.label])),watch:"Watch app",get iphone(){return c("iPhone app","Phone app")}},ee=[{id:"pages",label:"Pages",blurb:"are the screens you swipe between on the watch: tiles for lights, scenes, cameras and more.",path:l},{id:"menus",label:"Menus",blurb:"are the quick menus on the watch: the Anywhere menu, a menu for each kind of entity and the page switcher.",path:g},{id:"status-pages",label:"Status pages",get blurb(){return c("are lists to read at a glance, like the lights that are on or low batteries, opened from a tile, a menu or Siri.","are lists to read at a glance, like the lights that are on or low batteries, opened from a tile, a menu or, on Apple devices, Siri.")},path:b},{id:"control-center",label:"Control Center",blurb:"The list of controls",path:x,retired:!0},{id:"rooms",label:"Rooms",blurb:"let the watch open a room's page when you are in that room, and set up point control: point the watch at a thing to control it.",path:p},{id:"voice",label:"Voice",blurb:"sets how the watch listens and speaks: the Assist and Speak defaults, your saved phrases and the watch voice.",path:u},{id:"watch-complications",label:"Complications",blurb:"are what this watch's faces show, with every other design you could add under them, made in the Complications tab.",path:y},{id:"http-actions",label:"HTTP actions",get blurb(){return c("are web requests Home Assistant sends when a watch or an iPhone runs one from a tile, a menu or a complication, shared by every watch and iPhone.","are web requests Home Assistant sends when a watch or a phone runs one from a tile, a menu or a complication, shared by every watch and phone.")},path:m,shared:!0},{id:"cameras",label:"Camera framing",get blurb(){return c("sets how each camera's picture is framed in alerts, the same on the watch and the iPhone.","sets how each camera's picture is framed in alerts, the same on the watch and the phone.")},path:C,shared:!0},{id:"home-map",label:"Home map",blurb:"is the plan of your home from the iPhone's scan, with a pin for each device, shown on the iPhone, the watch and a Home map tile.",path:T,shared:!0,beta:"alpha",capability:re}],Ge={id:"settings",label:"Settings",blurb:"sets how the watch behaves: gestures, wrist twists, pages, cameras and how it connects.",path:w};function eo(e){return`${e.label} ${e.blurb}`}function ne(e,n){return n&&e.shared!==!0?`${e.path}/${encodeURIComponent(n)}`:e.path}function W(e){let n=t=>ee.find(a=>a.id===t);if(fe(e))return n("pages");if(ue(e))return n("menus");if(be(e))return n("status-pages");if($e(e))return n("control-center");if(ge(e))return n("rooms");if(xe(e))return n("voice");if(Te(e))return n("watch-complications");if(le(e))return n("http-actions");if(ie(e))return n("cameras");if(de(e))return n("home-map");if(K(e))return Ge}var ze=new Set(["pages","menus","status-pages","rooms","settings"]);function Se(e){return ze.has(e.id)}var qe=ee.filter(Se);function Ye(e){let n=e?.path??"";if(e===void 0||n!==H&&!n.startsWith(`${H}/`))return;let t=n.slice(H.length);return{prefix:e.prefix,path:t===""||t==="/"?l:t}}function te(e){let n=W(Ye(e));return n!==void 0&&Se(n)?n:void 0}function Ae(e,n){return`${H}${ne(e,n)}`}function no(e,n,t){return Ze(n.id,t)??(e==="iphone"?Ae(n,t):ne(n,t))}function Ze(e,n){let t=e==="pages"?J:e==="status-pages"?Q:e==="menus"?Y:void 0;return t===void 0?void 0:Re(t,n)}var P="/library",I=[{kind:"pages",segment:"pages",tab:"pages",screen:"pages"},{kind:"status_pages",segment:"status-pages",tab:"status-pages",screen:"status-pages"},{kind:"menus",segment:"menus",tab:"menus",screen:"menus"}];function to(e,n,t){let a=I.find(d=>d.kind===e).segment,o=`${P}/${a}/${encodeURIComponent(n)}`;return t===void 0||t===""?o:`${o}/${encodeURIComponent(t)}`}function oe(e){let n=e?.path??"";if(!n.startsWith(`${P}/`))return;let[t,a,o,...d]=n.slice(P.length+1).split("/"),R=I.find(_=>_.segment===t);if(R===void 0||a===void 0||a===""||d.some(_=>_!==""))return;let L,O;try{L=decodeURIComponent(a),O=o===void 0||o===""?void 0:decodeURIComponent(o)}catch{return}return O===void 0?{kind:R.kind,id:L}:{kind:R.kind,id:L,from:O}}function Je(e){return I.find(n=>n.kind===e.kind).tab}function S(e){if(W(e)!==void 0)return"watch";if(te(e)!==void 0)return"iphone";let n=oe(e);if(n!==void 0)return Je(n);let t=e?.path??"";return v.find(o=>t===o.path||t.startsWith(`${o.path}/`))?.id??"home"}function oo(e){let n=oe(e);if(n!==void 0)return I.find(o=>o.kind===n.kind).screen;let t=W(e)?.id??te(e)?.id;if(t!==void 0)return t;let a=We(e);return a==="home"||a==="complications"||a==="shared"?a:`all-${a}`}function Qe(e,n,t){return e==="watch"?ne(ee[0],n):e==="iphone"?Ae(qe[0],t):v.find(a=>a.id===e)?.path??Ne}var Xe=v.map(e=>e.id);function en(e){switch(e){case"pages":return"pages";case"status-pages":return"status-pages";case"menus":return"menus";case"watch-complications":case"control-center":return"complications";case"http-actions":case"cameras":case"home-map":return"shared";case"rooms":case"voice":case"settings":return"home"}}function We(e){let n=S(e);if(n!=="watch"&&n!=="iphone")return n;let t=n==="watch"?W(e):te(e);return t===void 0?"home":en(t.id)}function ao(e){return e===void 0||e===""?h:`${h}/${e===X?X:encodeURIComponent(e)}`}function ro(e){let n=e?.path??"";if(!n.startsWith(`${h}/`))return;let[t]=n.slice(h.length+1).split("/");if(!(t===void 0||t==="")){if(t===X)return{all:!0};try{return{owner:decodeURIComponent(t)}}catch{return}}}function io(e,n){return`${A}/${He}/${encodeURIComponent(e)}/${encodeURIComponent(n)}`}function so(e){let n=e?.path??"",t=`${A}/${He}/`;if(!n.startsWith(t))return;let[a,o,...d]=n.slice(t.length).split("/");if(!(a===void 0||a===""||o===void 0||o===""||d.some(R=>R!=="")))try{return{owner:decodeURIComponent(a),id:decodeURIComponent(o)}}catch{return}}function co(e){let n=e?.path??"";if(n===P||n===`${P}/`)return ke;if(n===`${h}/`)return h}var nn=new RegExp(`(${[...v.map(e=>e.path),P,H,l,g,u,b,x,p,m,C,w,y,T].join("|")})(/.*)?$`);function Ie(e,n=""){return e?e.prefix:n.replace(nn,"").replace(/\/$/,"")}function tn(e,n,t=""){return`${Ie(e,t)}${n}`}function on(e,n,t=!1){let a=Ie(e,window.location.pathname),o=`${a}${n}`;if(!(o===""||o===window.location.pathname))return t?history.replaceState(history.state,"",o):history.pushState(null,"",o),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:t}})),{prefix:a,path:n}}function lo(){on(void 0,m)}function an(e){return e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey}function rn(e,n){return n&&S(e)==="complications"}function po(e){return(e.metaKey||e.ctrlKey)&&e.key==="s"}function uo(e,n){let t=S(e);return!rn(e,n)&&t!=="watch"&&t!=="iphone"&&oe(e)===void 0}function ho(e,n){if(S(e)!=="complications")return n.shareLink?A:void 0}function fo(e){return S(e)==="complications"}var sn=r`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5" />
  <path d="M9.6 9.4a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.7" /><path d="M12 17V17.2" /></svg>`;function mo(e){let n=We(e.route),t=o=>tn(e.route,Qe(o),globalThis.location?.pathname??""),a=o=>e.unsavedTabs?.has(o)===!0||o==="home"&&e.watchUnsaved===!0;return r`<nav class="wa-tabs" aria-label="Wrist Assistant">
    ${e.menu?r`<button class="wa-tabs-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
      @click=${e.onMenu}>${i("menu")}</button>`:s}
    <span class="wa-tabs-name">Wrist Assistant</span>
    <span class="wa-tabs-list">${Xe.map(o=>r`${o==="shared"?r`<span class="wa-tabs-sep" aria-hidden="true"></span>`:s}<a class="wa-tab ${o===n?"on":""}"
      href=${t(o)} aria-current=${o===n?"page":"false"}
      @click=${d=>{an(d)&&(d.preventDefault(),e.onTab(o))}}>${i(Ke[o])}${Fe[o]}${a(o)?dn():s}</a>`)}</span>
    <span class="wa-tabs-end">${e.sync??s}${e.onHelp?r`<button type="button" class="wa-tabs-help" title="Help and setup guide" aria-label="Help" aria-haspopup="dialog"
      @click=${e.onHelp}>${sn}<span>Help</span></button>`:s}</span>
  </nav>`}function dn(){return r`<i class="wa-unsaved" role="img" aria-label="unsaved changes"></i>`}var go=f`
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
`;export{ln as a,Lt as b,_t as c,Ct as d,fn as e,mn as f,gn as g,wn as h,bn as i,vn as j,Rn as k,Tn as l,$n as m,kn as n,Hn as o,In as p,Ln as q,On as r,_n as s,Cn as t,En as u,Mn as v,Bn as w,Dn as x,Nn as y,Kn as z,Fn as A,Gn as B,zn as C,qn as D,Yn as E,K as F,Jn as G,Qn as H,Xn as I,et as J,at as K,rt as L,it as M,st as N,dt as O,ct as P,lt as Q,pt as R,mt as S,gt as T,wt as U,bt as V,yt as W,xt as X,Pt as Y,vt as Z,Y as _,$t as $,J as aa,Q as ba,St as ca,Re as da,At as ea,Wt as fa,Ne as ga,h as ha,X as ia,ke as ja,A as ka,H as la,ee as ma,Ge as na,eo as oa,ne as pa,W as qa,Se as ra,qe as sa,Ye as ta,te as ua,Ae as va,no as wa,Ze as xa,to as ya,oe as za,S as Aa,oo as Ba,Qe as Ca,en as Da,ao as Ea,ro as Fa,io as Ga,so as Ha,co as Ia,tn as Ja,on as Ka,lo as La,an as Ma,rn as Na,po as Oa,uo as Pa,ho as Qa,fo as Ra,mo as Sa,dn as Ta,go as Ua};
