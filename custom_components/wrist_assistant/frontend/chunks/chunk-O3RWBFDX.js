import{c as l,d as o,g as d,pc as u}from"./chunk-CHULIEMM.js";var a="/control-center";function g(e){let t=e?.path??"";return t===a||t.startsWith(`${a}/`)}function $(e){let t=e?.path??"",n=`${a}/`;if(!t.startsWith(n))return;let r=t.slice(n.length).split("/")[0]??"";if(r!=="")try{let c=decodeURIComponent(r);return c===""?void 0:c}catch{return}}function h(e,t,n=""){let r=e?.prefix??n.replace(/\/control-center(\/.*)?$/,"");return t?`${r}${a}`:r}function x(e,t){let n=h(e,t,window.location.pathname);n===""||n===window.location.pathname||(history.pushState(null,"",n),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var y="https://docs.wrist-assistant.com/watch-app/complications/#control-center",s;function v(e){s=e}function R(){return s?.dirty()??!1}function k(){s?.drop()}var p,i=!1;function f(){return p??=import("./control-center-editor-OF3Y2MRX.js").then(()=>{},e=>{throw i=!0,e}),p}function T(e){let t=customElements.get("wa-control-center-editor")!==void 0;return!t&&!i&&f().then(e.onLoaded,e.onLoaded),o`${e.dialogs}
    ${t?o`<wa-control-center-editor .hass=${e.hass} .owners=${e.owners} .ownerId=${e.ownerId}
          .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
          .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
          .barActions=${e.actions} .shellOwnsWatch=${e.shell===!0}></wa-control-center-editor>`:o`<div class="wp-loading">
          ${e.shell===!0?d:o`<button class="tb-btn tb-back" title="Back to complications" @click=${e.onBack}>${u("left")}<span>Complications</span></button>`}
          ${i?o`<span>The Control Center editor did not load. Reload the page to try again.</span>`:o`<span>Loading…</span>`}
        </div>`}`}var W=l`
  button.tb-btn.tb-control-center { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-control-center svg.ui-icon { width: 14px; height: 14px; }
`;export{a,g as b,$ as c,x as d,y as e,v as f,R as g,k as h,T as i,W as j};
