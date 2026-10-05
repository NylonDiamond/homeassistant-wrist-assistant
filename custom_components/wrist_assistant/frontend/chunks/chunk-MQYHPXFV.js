import{c,d as n,g as l,tc as m}from"./chunk-FF445B2T.js";var a="/rooms";function g(o){let e=o?.path??"";return e===a||e.startsWith(`${a}/`)}function x(o){let e=o?.path??"",t=`${a}/`;if(!e.startsWith(t))return;let r=e.slice(t.length).split("/")[0]??"";if(r!=="")try{let d=decodeURIComponent(r);return d===""?void 0:d}catch{return}}function p(o,e,t=""){let r=o?.prefix??t.replace(/\/rooms(\/.*)?$/,"");return e?`${r}${a}`:r}function y(o,e){let t=p(o,e,window.location.pathname);t===""||t===window.location.pathname||(history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var $="https://docs.wrist-assistant.com/features/rooms/",i;function v(o){i=o}function W(){return i?.dirty()??!1}function k(){i?.drop()}var u,s=!1;function h(){return u??=import("./rooms-editor-YSATZZ6Z.js").then(()=>{},o=>{throw s=!0,o}),u}function P(o){let e=customElements.get("wa-rooms-editor")!==void 0;return!e&&!s&&h().then(o.onLoaded,o.onLoaded),n`${o.dialogs}
    ${e?n`<wa-rooms-editor .hass=${o.hass} .owners=${o.owners} .ownerId=${o.ownerId}
          ?narrow=${o.narrow} .haMenu=${o.menu} .onHaMenu=${o.onMenu} .onBack=${o.onBack}
          .barActions=${o.actions} .shellOwnsWatch=${o.shell===!0}></wa-rooms-editor>`:n`<div class="wp-loading">
          ${o.shell===!0?l:n`<button class="tb-btn tb-back" title="Back to complications" @click=${o.onBack}>${m("left")}<span>Complications</span></button>`}
          ${s?n`<span>The Rooms editor did not load. Reload the page to try again.</span>`:n`<span>Loading…</span>`}
        </div>`}`}var T=c`
  button.tb-btn.tb-rooms { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-rooms svg.ui-icon { width: 14px; height: 14px; }
`;export{a,g as b,x as c,y as d,$ as e,v as f,W as g,k as h,P as i,T as j};
