import{ja as v,ka as M,la as E,pa as W,ra as S,xa as T}from"./chunk-KW27Q7DP.js";import{i as _}from"./chunk-NW4UA5ON.js";import{ra as R}from"./chunk-ZUAREVPI.js";import{j as k,l as I}from"./chunk-FMUKGUCP.js";import{c as x}from"./chunk-SV3BTW33.js";import{I as y}from"./chunk-GCHEIMKV.js";import{b as P,d as u,nh as b}from"./chunk-PGFG6NDE.js";import{r as $}from"./chunk-Y7NZKWQC.js";var g=56,j=40;var A=56;var d=y.screen;function U(e){return Math.round(e*d.height/d.width)}var L=new WeakMap;function O(e,t,r,s){let n=L.get(e);n===void 0&&(n=new Map,L.set(e,n));let a=n.get(t);if(a!==void 0&&a.stamp.length===r.length&&a.stamp.every((o,h)=>o===r[h]))return a.picture;let c=s();return n.set(t,{stamp:r,picture:c}),c}function Y(e){let t=e.iphone===!0,r=e.width??(t?j:g),s=[e.states,e.icons,e.tick,e.pages],n=e.look??"iphone";return O(e.page,`page:${t?`p:${n}`:"w"}:${r}`,s,()=>D(e,r,t,n))}function D(e,t,r,s){let{page:n}=e,a=r?k(void 0,{look:s}):void 0,c=a===void 0?d:I(a),o=t/c.width,h=Math.min(Math.round(c.height*o),U(Math.max(t,g))),w=`width:${t}px;height:${h}px`;if($(n))return u`<span class="lr-pic lr-smart ${r?"ph":""}" style=${`${w};background:${W(n)}`} aria-hidden="true">${b("states")}</span>`;let p={page:n,pages:e.pages??[n],screen:c,scale:o,stateMode:"live",...e.states===void 0?{}:{states:e.states},...e.icons===void 0?{}:{icons:e.icons},...a===void 0?{}:{phone:a}},l=E(n,c,{sideInset:v(p),topInset:M(p)}),N=l.tiles.filter(i=>(l.topInset+i.y)*o<h),f=S(p,n,o,c,void 0);return u`<span class="lr-pic ${r?"ph":""}" style=${`${w};background:${f.background}`} aria-hidden="true">
    ${f.layers}
    ${N.map(i=>u`<span class="lr-tile"
      style=${`left:${i.x*o}px;top:${(l.topInset+i.y)*o}px;width:${i.width*o}px;height:${i.height*o}px`}>${T(i.tile,{width:i.width,height:i.height},p,l.unit)}</span>`)}
  </span>`}function Z(e){let t=e.width??g,r=U(t),s=`width:${t}px;height:${r}px`,n=e.hass;return n===void 0?u`<span class="lr-pic lr-status" style=${s} aria-hidden="true"></span>`:O(e.page,`status:${t}`,[n.states,e.icons,e.tick],()=>u`<span class="lr-pic lr-status" style=${s} aria-hidden="true">
    ${_({page:e.page,hass:n,icons:e.icons??x,screen:d,scale:t/d.width})}
  </span>`)}var C,m=!1;function F(e){return m||customElements.get("wa-menu-thumbs")!==void 0?(m=!0,!0):(C??=import("./menu-thumbs-MZDZ3HB6.js").then(()=>{m=!0}),C.then(e,()=>{}),!1)}var H=new WeakMap;function ee(e){let t=e.height??A,r=e.menu.unit;if(!F(e.onReady)||e.hass===void 0||e.icons===void 0)return u`<span class="lr-ring" style=${`width:${t}px;height:${t}px`} aria-hidden="true"></span>`;let s=H.get(e.menu);return s===void 0&&(s=R(e.menu),H.set(e.menu,s)),u`<wa-menu-thumbs class="lr-menu" .hass=${e.hass} .icons=${e.icons} .tick=${e.tick??0} .menus=${s}
    .pages=${e.pages} .screen=${d} .height=${t} menu=${r}></wa-menu-thumbs>`}var te=P`
  .lr-pic {
    position: relative; display: block; flex: none; overflow: hidden; line-height: 0; pointer-events: none;
    border-radius: 9px; box-shadow: 0 0 0 1px var(--wa-line-strong); background: #000;
  }
  .lr-pic.ph { border-radius: 6px; }
  .lr-tile { position: absolute; overflow: hidden; pointer-events: none; }
  .lr-smart { display: grid; place-items: center; color: rgba(255, 255, 255, .7); }
  .lr-smart svg { width: 16px; height: 16px; }
  .lr-status .wa-watch { padding: 0; margin: 0; background: none; box-shadow: none; border-radius: 0; }
  .lr-status .wa-watch::before, .lr-status .wa-watch::after { display: none; }
  .lr-ring { display: block; flex: none; border-radius: 50%; border: 1px dashed var(--wa-line-strong); box-sizing: border-box; }
  wa-menu-thumbs.lr-menu { flex: none; }
  .hid .lr-pic, .hid .lr-ring, .hid wa-menu-thumbs.lr-menu { opacity: .45; }
`;export{Y as a,Z as b,ee as c,te as d};
