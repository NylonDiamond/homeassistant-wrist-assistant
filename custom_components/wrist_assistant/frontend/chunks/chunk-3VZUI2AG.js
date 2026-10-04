import{Qd as s,Zg as g,c as p,d as o,g as l,qg as u}from"./chunk-2OZEA5X7.js";var i="/pages";function v(e){let t=e?.path??"";return t===i||t.startsWith(`${i}/`)}function $(e){let t=e?.path??"",n=`${i}/`;if(!t.startsWith(n))return;let a=t.slice(n.length).split("/")[0]??"";if(a!=="")try{let c=decodeURIComponent(a);return c===""?void 0:c}catch{return}}function h(e,t,n=""){let a=e?.prefix??n.replace(/\/pages(\/.*)?$/,"");return t?`${a}${i}`:a}function y(e,t){let n=h(e,t,window.location.pathname);n===""||n===window.location.pathname||(history.pushState(null,"",n),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var k="https://docs.wrist-assistant.com/watch-app/pages-in-home-assistant/";function W(e){let n=`${h(e,!1,window.location.pathname)}${g}`;n!==window.location.pathname&&(history.pushState(null,"",n),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var d;function R(e){d=e}function T(){return d?.dirty()??!1}function H(){d?.drop()}var f,r=!1;function m(){return f??=import("./page-editor-S7TKDYV3.js").then(()=>{},e=>{throw r=!0,e}),f}function E(e,t,n){return!e.user?.is_admin||u(t).length===0?l:o`<button class="tb-btn tb-pages" title="The watch's pages, as Home Assistant keeps them"
    @click=${n}>${s("pages")}<span>Pages</span></button>`}function A(e){let t=customElements.get("wa-page-editor")!==void 0;return!t&&!r&&m().then(e.onLoaded,e.onLoaded),o`${e.dialogs}
    ${t?o`<wa-page-editor .hass=${e.hass} .owners=${e.owners} .ownerId=${e.ownerId}
          .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
          .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack} .onMenus=${e.onMenus}
          .barActions=${e.actions}></wa-page-editor>`:o`<div class="wp-loading">
          <button class="tb-btn tb-back" title="Back to complications" @click=${e.onBack}>${s("left")}<span>Complications</span></button>
          ${r?o`<span>The page editor did not load. Reload the page to try again.</span>`:o`<span>Loading…</span>`}
        </div>`}`}var I=p`
  button.tb-btn.tb-pages, button.tb-btn.tb-back { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-pages svg.ui-icon, button.tb-btn.tb-back svg.ui-icon { width: 14px; height: 14px; }
  .wp-loading { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; padding: 12px 16px; color: var(--wa-muted); }
`;export{v as a,$ as b,y as c,k as d,W as e,R as f,T as g,H as h,E as i,A as j,I as k};
