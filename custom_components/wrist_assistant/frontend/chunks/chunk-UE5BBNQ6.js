import{Gg as h,Qd as p,c as d,d as n,e as l,g as u}from"./chunk-KLU6QGRK.js";var a="/voice";function V(e){let o=e?.path??"";return o===a||o.startsWith(`${a}/`)}function $(e){let o=e?.path??"",t=`${a}/`;if(!o.startsWith(t))return;let i=o.slice(t.length).split("/")[0]??"";if(i!=="")try{let s=decodeURIComponent(i);return s===""?void 0:s}catch{return}}function m(e,o,t=""){let i=e?.prefix??t.replace(/\/voice(\/.*)?$/,"");return o?`${i}${a}`:i}function y(e,o){let t=m(e,o,window.location.pathname);t===""||t===window.location.pathname||(history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var k="https://docs.wrist-assistant.com/watch-app/voice/",c;function R(e){c=e}function W(){return c?.dirty()??!1}function P(){c?.drop()}var f,r=!1;function w(){return f??=import("./voice-editor-Y346N5Y7.js").then(()=>{},e=>{throw r=!0,e}),f}function v(){return n`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${l`<path d="M4 9.5H7.5L12 5.5V18.5L7.5 14.5H4Z" /><path d="M15.5 9.2A4 4 0 0 1 15.5 14.8" /><path d="M18.2 6.8A7.5 7.5 0 0 1 18.2 17.2" />`}</svg>`}function T(e,o,t){return!e.user?.is_admin||h(o).length===0?u:n`<button class="tb-btn tb-voice" title="The watch's voice defaults, phrases and watch voice"
    @click=${t}>${v()}<span>Voice</span></button>`}function H(e){let o=customElements.get("wa-voice-editor")!==void 0;return!o&&!r&&w().then(e.onLoaded,e.onLoaded),n`${e.dialogs}
    ${o?n`<wa-voice-editor .hass=${e.hass} .owners=${e.owners} .ownerId=${e.ownerId}
          .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
          .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
          .barActions=${e.actions}></wa-voice-editor>`:n`<div class="wp-loading">
          <button class="tb-btn tb-back" title="Back to complications" @click=${e.onBack}>${p("left")}<span>Complications</span></button>
          ${r?n`<span>The voice editor did not load. Reload the page to try again.</span>`:n`<span>Loading…</span>`}
        </div>`}`}var I=d`
  button.tb-btn.tb-voice { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-voice svg.ui-icon { width: 14px; height: 14px; }
`;export{V as a,$ as b,y as c,k as d,R as e,W as f,P as g,v as h,T as i,H as j,I as k};
