import{c as u,d as n,g as c,qc as l}from"./chunk-4HFFS6MN.js";var s="/status-pages";function P(t){let e=t?.path??"";return e===s||e.startsWith(`${s}/`)}function S(t){let e=t?.path??"",a=`${s}/`;if(!e.startsWith(a))return;let o=e.slice(a.length).split("/")[0]??"";if(o!=="")try{let d=decodeURIComponent(o);return d===""?void 0:d}catch{return}}function h(t,e,a=""){let o=t?.prefix??a.replace(/\/status-pages(\/.*)?$/,"");return e?`${o}${s}`:o}function $(t,e){let a=h(t,e,window.location.pathname);a===""||a===window.location.pathname||(history.pushState(null,"",a),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var x="https://docs.wrist-assistant.com/features/status-pages/",i;function y(t){i=t}function v(){return i?.dirty()??!1}function k(){i?.drop()}var p,r=!1;function g(){return p??=import("./status-pages-editor-LDD6L2PC.js").then(()=>{},t=>{throw r=!0,t}),p}function T(t){let e=customElements.get("wa-status-pages-editor")!==void 0;return!e&&!r&&g().then(t.onLoaded,t.onLoaded),n`${t.dialogs}
    ${e?n`<wa-status-pages-editor .hass=${t.hass} .owners=${t.owners} .ownerId=${t.ownerId}
          .icons=${t.icons} .iconsTick=${t.iconsTick} ?narrow=${t.narrow}
          .haMenu=${t.menu} .onHaMenu=${t.onMenu} .onBack=${t.onBack}
          .barActions=${t.actions} .shellOwnsWatch=${t.shell===!0}></wa-status-pages-editor>`:n`<div class="wp-loading">
          ${t.shell===!0?c:n`<button class="tb-btn tb-back" title="Back to complications" @click=${t.onBack}>${l("left")}<span>Complications</span></button>`}
          ${r?n`<span>The status page editor did not load. Reload the page to try again.</span>`:n`<span>Loading…</span>`}
        </div>`}`}var W=u`
  button.tb-btn.tb-status-pages { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-status-pages svg.ui-icon { width: 14px; height: 14px; }
`;export{s as a,P as b,S as c,$ as d,x as e,y as f,v as g,k as h,T as i,W as j};
