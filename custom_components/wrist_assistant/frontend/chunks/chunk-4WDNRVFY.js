import{Gg as l,Qd as r,c,d as n,g as p}from"./chunk-KLU6QGRK.js";var s="/status-pages";function b(t){let e=t?.path??"";return e===s||e.startsWith(`${s}/`)}function S(t){let e=t?.path??"",a=`${s}/`;if(!e.startsWith(a))return;let o=e.slice(a.length).split("/")[0]??"";if(o!=="")try{let u=decodeURIComponent(o);return u===""?void 0:u}catch{return}}function f(t,e,a=""){let o=t?.prefix??a.replace(/\/status-pages(\/.*)?$/,"");return e?`${o}${s}`:o}function x(t,e){let a=f(t,e,window.location.pathname);a===""||a===window.location.pathname||(history.pushState(null,"",a),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var $="https://docs.wrist-assistant.com/features/status-pages/",d;function y(t){d=t}function v(){return d?.dirty()??!1}function k(){d?.drop()}var g,i=!1;function h(){return g??=import("./status-pages-editor-T535TTUY.js").then(()=>{},t=>{throw i=!0,t}),g}function T(t,e,a){return!t.user?.is_admin||l(e).length===0?p:n`<button class="tb-btn tb-status-pages" title="The watch's status pages"
    @click=${a}>${r("list")}<span>Status pages</span></button>`}function W(t){let e=customElements.get("wa-status-pages-editor")!==void 0;return!e&&!i&&h().then(t.onLoaded,t.onLoaded),n`${t.dialogs}
    ${e?n`<wa-status-pages-editor .hass=${t.hass} .owners=${t.owners} .ownerId=${t.ownerId}
          .icons=${t.icons} .iconsTick=${t.iconsTick} ?narrow=${t.narrow}
          .haMenu=${t.menu} .onHaMenu=${t.onMenu} .onBack=${t.onBack}
          .barActions=${t.actions}></wa-status-pages-editor>`:n`<div class="wp-loading">
          <button class="tb-btn tb-back" title="Back to complications" @click=${t.onBack}>${r("left")}<span>Complications</span></button>
          ${i?n`<span>The status page editor did not load. Reload the page to try again.</span>`:n`<span>Loading…</span>`}
        </div>`}`}var R=c`
  button.tb-btn.tb-status-pages { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-status-pages svg.ui-icon { width: 14px; height: 14px; }
`;export{b as a,S as b,x as c,$ as d,y as e,v as f,k as g,T as h,W as i,R as j};
