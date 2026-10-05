import{Gg as u,Qd as i,c as d,d as o,g as p}from"./chunk-KLU6QGRK.js";var a="/control-center";function g(e){let t=e?.path??"";return t===a||t.startsWith(`${a}/`)}function x(e){let t=e?.path??"",n=`${a}/`;if(!t.startsWith(n))return;let r=t.slice(n.length).split("/")[0]??"";if(r!=="")try{let l=decodeURIComponent(r);return l===""?void 0:l}catch{return}}function f(e,t,n=""){let r=e?.prefix??n.replace(/\/control-center(\/.*)?$/,"");return t?`${r}${a}`:r}function $(e,t){let n=f(e,t,window.location.pathname);n===""||n===window.location.pathname||(history.pushState(null,"",n),window.dispatchEvent(new CustomEvent("location-changed",{detail:{replace:!1}})))}var y="https://docs.wrist-assistant.com/watch-app/complications/#control-center",s;function v(e){s=e}function R(){return s?.dirty()??!1}function k(){s?.drop()}var h,c=!1;function C(){return h??=import("./control-center-editor-BTJYWYNS.js").then(()=>{},e=>{throw c=!0,e}),h}function T(e,t,n){return!e.user?.is_admin||u(t).length===0?p:o`<button class="tb-btn tb-control-center" title="The entities the watch's Control Center controls offer"
    @click=${n}>${i("grid")}<span>Control Center</span></button>`}function W(e){let t=customElements.get("wa-control-center-editor")!==void 0;return!t&&!c&&C().then(e.onLoaded,e.onLoaded),o`${e.dialogs}
    ${t?o`<wa-control-center-editor .hass=${e.hass} .owners=${e.owners} .ownerId=${e.ownerId}
          .icons=${e.icons} .iconsTick=${e.iconsTick} ?narrow=${e.narrow}
          .haMenu=${e.menu} .onHaMenu=${e.onMenu} .onBack=${e.onBack}
          .barActions=${e.actions}></wa-control-center-editor>`:o`<div class="wp-loading">
          <button class="tb-btn tb-back" title="Back to complications" @click=${e.onBack}>${i("left")}<span>Complications</span></button>
          ${c?o`<span>The Control Center editor did not load. Reload the page to try again.</span>`:o`<span>Loading…</span>`}
        </div>`}`}var P=d`
  button.tb-btn.tb-control-center { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
  button.tb-btn.tb-control-center svg.ui-icon { width: 14px; height: 14px; }
`;export{g as a,x as b,$ as c,y as d,v as e,R as f,k as g,T as h,W as i,P as j};
