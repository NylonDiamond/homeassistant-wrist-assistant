import{Rd as r,c as l,d as o,g as s,gg as p}from"./chunk-Z46TIDV4.js";var i="/menus";function y(e){let n=e?.path??"";return n===i||n.startsWith(`${i}/`)}function $(e){let n=e?.path??"",t=`${i}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let c=decodeURIComponent(a);return c===""?void 0:c}catch{return}}function h(e,n,t=""){let a=e?.prefix??t.replace(/\/menus(\/.*)?$/,"");return n?`${a}${i}`:a}function x(e,n){let t=h(e,n,window.location.pathname);t===""||t===window.location.pathname||(history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var u;function M(e){u=e}function v(){return u?.dirty()??!1}function k(){u?.drop()}var m,d=!1;function f(){return m??=import("./menu-editor-BYV3NXWH.js").then(()=>{},e=>{throw d=!0,e}),m}function W(e,n,t){return!e.user?.is_admin||p(n).length===0?s:o`<button class="tb-btn tb-menus" title="The watch's Anywhere menu, Entity quick menu and page switcher"
    @click=${t}>${r("radial")}<span>Menus</span></button>`}function P(e){let n=customElements.get("wa-menu-editor")!==void 0;return!n&&!d&&f().then(e.onLoaded,e.onLoaded),o`<header class="wp-bar">
      ${e.menu?o`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${e.onMenu}>${r("menu")}</button>`:s}
      <button class="tb-btn tb-back" title="Back to complications" @click=${e.onBack}>${r("left")}<span>Complications</span></button>
      <span class="spacer"></span>
      ${e.actions}
    </header>
    ${e.dialogs}
    ${n?o`<wa-menu-editor .hass=${e.hass} .owners=${e.owners} .ownerId=${e.ownerId}
          .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}></wa-menu-editor>`:o`<div class="wp-loading">${d?o`<span>The menu editor did not load. Reload the page to try again.</span>`:"Loading\u2026"}</div>`}`}var R=l`
  button.tb-btn.tb-menus { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-menus svg.ui-icon { width: 14px; height: 14px; }
`;export{y as a,$ as b,x as c,M as d,v as e,k as f,W as g,P as h,R as i};
