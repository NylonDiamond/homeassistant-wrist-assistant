import{Gg as p,Qd as r,c,d as o,g as l}from"./chunk-KLU6QGRK.js";var i="/menus";function $(e){let n=e?.path??"";return n===i||n.startsWith(`${i}/`)}function v(e){let n=e?.path??"",t=`${i}/`;if(!n.startsWith(t))return;let a=n.slice(t.length).split("/")[0]??"";if(a!=="")try{let u=decodeURIComponent(a);return u===""?void 0:u}catch{return}}function f(e,n,t=""){let a=e?.prefix??t.replace(/\/menus(\/.*)?$/,"");return n?`${a}${i}`:a}function x(e,n){let t=f(e,n,window.location.pathname);t===""||t===window.location.pathname||(history.pushState(null,"",t),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var y="https://docs.wrist-assistant.com/watch-app/quick-menu-editor/",m="/pages";function P(e){let n=`${f(e,!1,window.location.pathname)}${m}`;n!==window.location.pathname&&(history.pushState(null,"",n),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var d;function k(e){d=e}function R(){return d?.dirty()??!1}function W(){d?.drop()}var h,s=!1;function w(){return h??=import("./menu-editor-VLBZB5BJ.js").then(()=>{},e=>{throw s=!0,e}),h}function T(e,n,t){return!e.user?.is_admin||p(n).length===0?l:o`<button class="tb-btn tb-menus" title="The watch's Anywhere menu, Entity quick menu and page switcher"
    @click=${t}>${r("radial")}<span>Menus</span></button>`}function E(e){let n=customElements.get("wa-menu-editor")!==void 0;return!n&&!s&&w().then(e.onLoaded,e.onLoaded),o`${e.dialogs}
    ${n?o`<wa-menu-editor .hass=${e.hass} .owners=${e.owners} .ownerId=${e.ownerId}
          .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
          .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack} .onPages=${e.onPages}
          .barActions=${e.actions}></wa-menu-editor>`:o`<div class="wp-loading">
          <button class="tb-btn tb-back" title="Back to complications" @click=${e.onBack}>${r("left")}<span>Complications</span></button>
          ${s?o`<span>The menu editor did not load. Reload the page to try again.</span>`:o`<span>Loading…</span>`}
        </div>`}`}var H=c`
  button.tb-btn.tb-menus { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-menus svg.ui-icon { width: 14px; height: 14px; }
`;export{i as a,$ as b,v as c,x as d,y as e,P as f,k as g,R as h,W as i,T as j,E as k,H as l};
