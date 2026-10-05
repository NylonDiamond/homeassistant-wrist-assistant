import{c,d as o,g as u,tc as l}from"./chunk-FF445B2T.js";var r="/menus";function M(e){let n=e?.path??"";return n===r||n.startsWith(`${r}/`)}function v(e){let n=e?.path??"",t=`${r}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let d=decodeURIComponent(a);return d===""?void 0:d}catch{return}}function h(e,n,t=""){let a=e?.prefix??t.replace(/\/menus(\/.*)?$/,"");return n?`${a}${r}`:a}function x(e,n){let t=h(e,n,window.location.pathname);t===""||t===window.location.pathname||(history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var y="https://docs.wrist-assistant.com/watch-app/quick-menu-editor/",f="/pages";function P(e){let n=`${h(e,!1,window.location.pathname)}${f}`;n!==window.location.pathname&&(history.pushState(null,"",n),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var i;function k(e){i=e}function R(){return i?.dirty()??!1}function W(){i?.drop()}var p,s=!1;function m(){return p??=import("./menu-editor-ENECHAOS.js").then(()=>{},e=>{throw s=!0,e}),p}function T(e){let n=customElements.get("wa-menu-editor")!==void 0;return!n&&!s&&m().then(e.onLoaded,e.onLoaded),o`${e.dialogs}
    ${n?o`<wa-menu-editor .hass=${e.hass} .owners=${e.owners} .ownerId=${e.ownerId}
          .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
          .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack} .onPages=${e.onPages}
          .barActions=${e.actions} .shellOwnsWatch=${e.shell===!0}></wa-menu-editor>`:o`<div class="wp-loading">
          ${e.shell===!0?u:o`<button class="tb-btn tb-back" title="Back to complications" @click=${e.onBack}>${l("left")}<span>Complications</span></button>`}
          ${s?o`<span>The menu editor did not load. Reload the page to try again.</span>`:o`<span>Loading…</span>`}
        </div>`}`}var E=c`
  button.tb-btn.tb-menus { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-menus svg.ui-icon { width: 14px; height: 14px; }
`;export{r as a,M as b,v as c,x as d,y as e,P as f,k as g,R as h,W as i,T as j,E as k};
