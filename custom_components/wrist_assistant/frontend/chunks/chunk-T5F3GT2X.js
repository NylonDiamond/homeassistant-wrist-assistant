import{Rd as r,c as p,d as o,g as s,gg as u}from"./chunk-AMF7ZW32.js";var i="/pages";function P(e){let t=e?.path??"";return t===i||t.startsWith(`${i}/`)}function x(e){let t=e?.path??"",n=`${i}/`;if(!t.startsWith(n))return;let a=t.slice(n.length).split("/")[0]??"";if(a!=="")try{let l=decodeURIComponent(a);return l===""?void 0:l}catch{return}}function f(e,t,n=""){let a=e?.prefix??n.replace(/\/pages(\/.*)?$/,"");return t?`${a}${i}`:a}function $(e,t){let n=f(e,t,window.location.pathname);n===""||n===window.location.pathname||(history.pushState(null,"",n),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var c;function v(e){c=e}function y(){return c?.dirty()??!1}function k(){c?.drop()}var g,d=!1;function h(){return g??=import("./page-editor-BDRXNVGB.js").then(()=>{},e=>{throw d=!0,e}),g}function W(e,t,n){return!e.user?.is_admin||u(t).length===0?s:o`<button class="tb-btn tb-pages" title="The watch's pages, as Home Assistant keeps them"
    @click=${n}>${r("pages")}<span>Pages</span></button>`}function R(e){let t=customElements.get("wa-page-editor")!==void 0;return!t&&!d&&h().then(e.onLoaded,e.onLoaded),o`<header class="wp-bar">
      ${e.menu?o`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${e.onMenu}>${r("menu")}</button>`:s}
      <button class="tb-btn tb-back" title="Back to complications" @click=${e.onBack}>${r("left")}<span>Complications</span></button>
      <span class="spacer"></span>
      ${e.actions}
    </header>
    ${e.dialogs}
    ${t?o`<wa-page-editor .hass=${e.hass} .owners=${e.owners} .ownerId=${e.ownerId}
          .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}></wa-page-editor>`:o`<div class="wp-loading">${d?o`<span>The page editor did not load. Reload the page to try again.</span>`:"Loading\u2026"}</div>`}`}var T=p`
  button.tb-btn.tb-pages, button.tb-btn.tb-back { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-pages svg.ui-icon, button.tb-btn.tb-back svg.ui-icon { width: 14px; height: 14px; }
  .wp-loading { padding: 24px 16px; color: var(--wa-muted); }
`;export{P as a,x as b,$ as c,v as d,y as e,k as f,W as g,R as h,T as i};
