import{Ea as C}from"./chunk-GHFPYMJS.js";import{lg as O}from"./chunk-IBZGIRVS.js";import{ea as R}from"./chunk-5LB7PZLF.js";import{k as A}from"./chunk-H4AUETPC.js";import{R as h,e as w,l as v,u as l,v as m}from"./chunk-TCVAOGAG.js";import{Ba as I,Da as k,qa as $,ra as E,sa as L,ta as P,ua as M,va as T,za as H}from"./chunk-TWJXXRS4.js";import{b as y,f as u,i as p,l as F}from"./chunk-6ZDBXU6B.js";var q=.145,j=.045,V=.018,Q=.05;function Y(e,t){let r=e*t;return{radius:Math.round(r*q),bezel:Math.round(r*j),rim:Math.max(2,Math.round(r*V)),crown:Math.round(r*Q)}}function ue(e,t,r,n){let o=Y(e.width,t),a=[`--wf-radius:${o.radius}px`,`--wf-bezel:${o.bezel}px`,`--wf-rim:${o.rim}px`,`--wf-crown:${o.crown}px`];if(e.height!==void 0&&e.height>0){let s=e.height*t+o.bezel*2,i=c=>`${Math.round(s*c*100)/100}px`;a.push(`--wf-crown-top:${i(.19)}`,`--wf-crown-h:${i(.16)}`,`--wf-button-top:${i(.42)}`,`--wf-button-h:${i(.22)}`)}return u`<div class="wa-watch" aria-label=${n??"Watch"} style=${a.join(";")}>${r}</div>`}var we=y`
  .wa-watch {
    position: relative;
    display: inline-block;
    flex: none;
    box-sizing: content-box;
    padding: var(--wf-bezel, 9px);
    /* The rim is drawn outside the box (a shadow), so the margins keep room
       for it, and on the right for the crown as well. */
    margin: var(--wf-rim, 3px) calc(var(--wf-rim, 3px) + var(--wf-crown, 10px)) var(--wf-rim, 3px) var(--wf-rim, 3px);
    border-radius: calc(var(--wf-radius, 28px) + var(--wf-bezel, 9px));
    /* The glass: black, with a faint sheen from the top left. */
    background:
      linear-gradient(160deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0) 40%),
      #07080c;
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.04),
      0 0 0 var(--wf-rim, 3px) var(--wa-art-case, #2b2f3d),
      0 0 0 calc(var(--wf-rim, 3px) + 1px) rgba(255, 255, 255, 0.1),
      0 14px 34px rgba(0, 0, 0, 0.4);
  }
  .wa-watch::before,
  .wa-watch::after {
    content: "";
    position: absolute;
    left: calc(100% + var(--wf-rim, 3px));
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.25)),
      var(--wa-art-case, #2b2f3d);
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.08);
    pointer-events: none;
  }
  /* Digital Crown: a fifth of the way down, a sixth of the case tall. */
  .wa-watch::before {
    top: var(--wf-crown-top, 19%);
    width: var(--wf-crown, 10px);
    height: var(--wf-crown-h, 16%);
    border-radius: 0 calc(var(--wf-crown, 10px) * 0.45) calc(var(--wf-crown, 10px) * 0.45) 0;
  }
  /* Side button: below the crown, thinner and longer. */
  .wa-watch::after {
    top: var(--wf-button-top, 42%);
    width: calc(var(--wf-crown, 10px) * 0.55);
    height: var(--wf-button-h, 22%);
    border-radius: 0 calc(var(--wf-crown, 10px) * 0.3) calc(var(--wf-crown, 10px) * 0.3) 0;
  }
  .wa-watch > * {
    border-radius: var(--wf-radius, 28px);
    box-shadow: none;
  }
`;var Z=.25,b=30,J=22,pe=6;function le(e,t){return(t==="iphone"?e.fitToScreen:e.watchFitToScreen)===!0}function me(e){return e==="iphone"?b:J}var be=7,X=.6,ee=.4,te=4,z=.5;function D(e,t){return e===0?0:t*(X+(e-1)*ee)}function N(e){let t=[],r=n=>{for(;t.length<n;)t.push("empty")};for(let n of v(e)){let o=h(n),a=m(l(n));if(r(o.row+o.rowSpan),a!=="spacer")for(let s=o.row;s<o.row+o.rowSpan;s+=1)t[s]!=="header"&&(t[s]=a==="divider"?"header":"tile")}return t}function re(e,t,r,n,o,a=w,s=b){if(e.length===0||n<=0||o<=0)return;let i=x=>e.filter(U=>U===x).length,c=i("tile"),d=i("empty"),g=o-(i("header")*n+(e.length-1)*a-D(r,n));if(n*(c+d)<=g)return;let _=n*Z,W=_,f=n;if(d>0&&(g-n*c)/d>=_)W=(g-n*c)/d;else if(c===0||(f=Math.floor((g-_*d)/c/z)*z,f<=0)||t!==void 0&&f*t+a*(t-1)<s)return;return{heights:e.map(x=>x==="empty"?W:x==="tile"?f:n),tileRow:f}}function B(e,t,r,n=b){let o=v(e).map(i=>({g:h(i),kind:m(l(i))})),a=o.filter(i=>i.kind!=="spacer"&&i.kind!=="divider").map(i=>i.g.rowSpan),s=new Set(o.filter(i=>i.kind==="divider").map(i=>i.g.row)).size;return re(N(e),a.length===0?void 0:Math.min(...a),s,t,r,w,n)}function K(e,t,r=w){let n=0;for(let o=0;o<t;o+=1)n+=(e.heights[o]??e.tileRow)+r;return n}function ne(e,t,r=w){return Math.max(1,Math.round((e+r)/(t+r)))}function oe(e,t){return t<e&&t<te}function ie(e,t,r,n=w){let o=h(e),a=m(l(e));if(a==="spacer"||a==="divider"||t>=r*o.rowSpan+n*(o.rowSpan-1)-.01)return e;let s=ne(t,r,n),i={...e,rowSpan:s,fittedCellHeight:t};return oe(o.rowSpan,s)&&delete i.arrange,i}function ae(e,t,r=!1){let n=e.unit+e.spacing,o=e.tiles.map(a=>{let s=h(a.tile),i=s.row*n-a.y,c=K(t,s.row,e.spacing),d=K(t,s.row+s.rowSpan,e.spacing)-c-e.spacing;return{...a,y:c-i,height:d,tile:r?a.tile:ie(a.tile,d,e.unit,e.spacing)}});return{...e,tiles:o}}function ge(e,t,r,n=b){let o=B(t,e.unit,r,n);return o===void 0?e:{...ae(e,o),contentHeight:r,height:e.screen.height}}function xe(e,t,r,n=b){let o=B(e,t,r,n);if(o!==void 0)return o.tileRow>=t?{kind:"empty-rows"}:{kind:"squashed",share:o.tileRow/t};let a=v(e).filter(d=>m(l(d))==="divider"),s=new Set(a.map(d=>h(d).row)).size,i=N(e).length;return i*t+Math.max(0,i-1)*w-D(s,t)<=r?{kind:"fits"}:{kind:"scrolls"}}function ye(e,t="iPhone"){switch(e.kind){case"fits":return`This page already fits this ${t}'s screen.`;case"empty-rows":return"Fits: only its empty rows get shorter.";case"squashed":return`Fits: its rows are ${Math.round(e.share*100)}% of their normal height.`;case"scrolls":return`Too tall for this ${t}'s screen, so this page scrolls as normal. Remove some rows to fit it.`}}function ve(e){let[t,r]=e==="iphone"?["iPhone","watch"]:["watch","iPhone"];return`This page fits the ${t}'s screen, so this tile draws short there. Custom layouts show on the ${r} and on taller tiles.`}var S=class extends F{static{this.properties={hass:{attribute:!1},owner:{attribute:!1},named:{type:Boolean},busy:{state:!0},failed:{state:!0}}}constructor(){super(),this.named=!1,this.busy=!1,this.failed=void 0}static{this.styles=y`
    :host { display: block; margin: 8px 0; font-size: 13px; line-height: 1.4; color: var(--wa-muted); }
    button {
      padding: 0; border: 0; background: none; font: inherit; color: var(--wa-accent); font-weight: 600;
      cursor: pointer; text-decoration: underline; text-underline-offset: 2px;
    }
    button:disabled { opacity: 0.5; cursor: default; }
    .failed { color: var(--wa-warn, var(--wa-muted)); }
  `}async use(){let t=this.hass,r=this.owner;if(!(t===void 0||r===void 0||this.busy)&&window.confirm(L(r.owner_iphone_moves))){this.busy=!0,this.failed=void 0;try{await O(t,r.owner_watch_id),this.dispatchEvent(new CustomEvent(P,{bubbles:!0,composed:!0,detail:{watchId:r.owner_watch_id}}))}catch(n){this.failed=C(n)}finally{this.busy=!1}}}render(){return T(this.owner)?u`${this.named&&this.owner!==void 0?u`${M(this.owner.device_name??this.owner.owner_watch_id)} `:p}${E(this.owner?.owner_iphone_moves)}
      <button type="button" ?disabled=${this.busy} @click=${()=>{this.use()}}>${$}</button>
      ${this.failed===void 0?p:u`<div class="failed" role="alert">${this.failed}</div>`}`:p}};typeof customElements<"u"&&!customElements.get("wa-move-wait-out")&&customElements.define("wa-move-wait-out",S);function $e(e,t){return u`<wa-move-wait-out .hass=${e} .owner=${t}></wa-move-wait-out>`}function se(e,t,r){let n=t.filter(o=>r.has(o.owner_watch_id)&&T(o));return n.length===0?p:u`${n.map(o=>u`<wa-move-wait-out .hass=${e} .owner=${o} named></wa-move-wait-out>`)}`}function Ee(e,t,r,n){let o=new Map;for(let i of t)o.set(i.owner_watch_id,{held:R(r,i.owner_watch_id,n),free:!1});let a=se(e,t,A(t,o)),s=G(t,r,n);return s.length===0?a:u`${a}${s.map(i=>u`<p class="seed-wait" role="status" style="margin:8px 0;font-size:13px;line-height:1.4;color:var(--wa-muted)">${H(i.device_name??i.owner_watch_id)}</p>`)}`}function G(e,t,r){return e.filter(n=>I(n)&&!R(t,n.owner_watch_id,r))}function ce(e,t,r,n,o){if(t===void 0)return!0;let a=c=>c.toUpperCase(),s=new Set(r.map(a)),i=G(e,t,n).find(c=>s.has(a(c.owner_watch_id)));return i===void 0||k(i,[n],o)}function Le(e,t,r,n,o){return ce(e,t,[r],n,o)}export{j as a,V as b,Q as c,ue as d,we as e,pe as f,le as g,me as h,be as i,te as j,B as k,K as l,ie as m,ae as n,ge as o,xe as p,ye as q,ve as r,$e as s,se as t,Ee as u,ce as v,Le as w};
