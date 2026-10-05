import{Gg as u,Qd as s,c as l,d as n,g as m}from"./chunk-KLU6QGRK.js";var a="/rooms";function g(o){let e=o?.path??"";return e===a||e.startsWith(`${a}/`)}function x(o){let e=o?.path??"",t=`${a}/`;if(!e.startsWith(t))return;let r=e.slice(t.length).split("/")[0]??"";if(r!=="")try{let c=decodeURIComponent(r);return c===""?void 0:c}catch{return}}function h(o,e,t=""){let r=o?.prefix??t.replace(/\/rooms(\/.*)?$/,"");return e?`${r}${a}`:r}function y(o,e){let t=h(o,e,window.location.pathname);t===""||t===window.location.pathname||(history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var $="https://docs.wrist-assistant.com/features/rooms/",d;function v(o){d=o}function W(){return d?.dirty()??!1}function k(){d?.drop()}var p,i=!1;function f(){return p??=import("./rooms-editor-5BMOV22S.js").then(()=>{},o=>{throw i=!0,o}),p}function P(o,e,t){return!o.user?.is_admin||u(e).length===0?m:n`<button class="tb-btn tb-rooms" title="The watch's rooms: switching pages by room and point control"
    @click=${t}>${s("home")}<span>Rooms</span></button>`}function T(o){let e=customElements.get("wa-rooms-editor")!==void 0;return!e&&!i&&f().then(o.onLoaded,o.onLoaded),n`${o.dialogs}
    ${e?n`<wa-rooms-editor .hass=${o.hass} .owners=${o.owners} .ownerId=${o.ownerId}
          ?narrow=${o.narrow} .haMenu=${o.menu} .onHaMenu=${o.onMenu} .onBack=${o.onBack}
          .barActions=${o.actions}></wa-rooms-editor>`:n`<div class="wp-loading">
          <button class="tb-btn tb-back" title="Back to complications" @click=${o.onBack}>${s("left")}<span>Complications</span></button>
          ${i?n`<span>The Rooms editor did not load. Reload the page to try again.</span>`:n`<span>Loading…</span>`}
        </div>`}`}var H=l`
  button.tb-btn.tb-rooms { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-rooms svg.ui-icon { width: 14px; height: 14px; }
`;export{g as a,x as b,y as c,$ as d,v as e,W as f,k as g,P as h,T as i,H as j};
