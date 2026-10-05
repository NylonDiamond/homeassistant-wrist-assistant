import{c as d,d as n,e as l,g as u,pc as p}from"./chunk-CHULIEMM.js";var a="/voice";function $(e){let o=e?.path??"";return o===a||o.startsWith(`${a}/`)}function x(e){let o=e?.path??"",t=`${a}/`;if(!o.startsWith(t))return;let i=o.slice(t.length).split("/")[0]??"";if(i!=="")try{let s=decodeURIComponent(i);return s===""?void 0:s}catch{return}}function f(e,o,t=""){let i=e?.prefix??t.replace(/\/voice(\/.*)?$/,"");return o?`${i}${a}`:i}function V(e,o){let t=f(e,o,window.location.pathname);t===""||t===window.location.pathname||(history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var y="https://docs.wrist-assistant.com/watch-app/voice/",c;function k(e){c=e}function W(){return c?.dirty()??!1}function R(){c?.drop()}var h,r=!1;function m(){return h??=import("./voice-editor-FCU3RATQ.js").then(()=>{},e=>{throw r=!0,e}),h}function P(){return n`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${l`<path d="M4 9.5H7.5L12 5.5V18.5L7.5 14.5H4Z" /><path d="M15.5 9.2A4 4 0 0 1 15.5 14.8" /><path d="M18.2 6.8A7.5 7.5 0 0 1 18.2 17.2" />`}</svg>`}function T(e){let o=customElements.get("wa-voice-editor")!==void 0;return!o&&!r&&m().then(e.onLoaded,e.onLoaded),n`${e.dialogs}
    ${o?n`<wa-voice-editor .hass=${e.hass} .owners=${e.owners} .ownerId=${e.ownerId}
          .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
          .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
          .barActions=${e.actions} .shellOwnsWatch=${e.shell===!0}></wa-voice-editor>`:n`<div class="wp-loading">
          ${e.shell===!0?u:n`<button class="tb-btn tb-back" title="Back to complications" @click=${e.onBack}>${p("left")}<span>Complications</span></button>`}
          ${r?n`<span>The voice editor did not load. Reload the page to try again.</span>`:n`<span>Loading…</span>`}
        </div>`}`}var H=d`
  button.tb-btn.tb-voice { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-voice svg.ui-icon { width: 14px; height: 14px; }
`;export{a,$ as b,x as c,V as d,y as e,k as f,W as g,R as h,P as i,T as j,H as k};
