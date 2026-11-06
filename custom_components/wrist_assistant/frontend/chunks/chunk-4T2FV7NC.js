import{Fa as G}from"./chunk-D4TOWQIW.js";import{mg as O}from"./chunk-NPUC537M.js";import{ea as b}from"./chunk-FHUB2O2K.js";import{k as U}from"./chunk-SBT2F53M.js";import{R as w,e as f,l as T,u as l,v as m}from"./chunk-YDNYMT5W.js";import{Ea as K,Ha as z,Ka as D,La as N,ma as $,oa as _,pa as E,sa as M,ta as P,ua as A,va as H,wa as k,xa as I,ya as R,za as C}from"./chunk-A3CWY7SV.js";import{b as v,f as u,i as p,l as L}from"./chunk-6ZDBXU6B.js";var Z=.145,J=.045,X=.018,ee=.05;function te(e,t){let r=e*t;return{radius:Math.round(r*Z),bezel:Math.round(r*J),rim:Math.max(2,Math.round(r*X)),crown:Math.round(r*ee)}}function be(e,t,r,n){let o=te(e.width,t),a=[`--wf-radius:${o.radius}px`,`--wf-bezel:${o.bezel}px`,`--wf-rim:${o.rim}px`,`--wf-crown:${o.crown}px`];if(e.height!==void 0&&e.height>0){let s=e.height*t+o.bezel*2,i=d=>`${Math.round(s*d*100)/100}px`;a.push(`--wf-crown-top:${i(.19)}`,`--wf-crown-h:${i(.16)}`,`--wf-button-top:${i(.42)}`,`--wf-button-h:${i(.22)}`)}return u`<div class="wa-watch" aria-label=${n??"Watch"} style=${a.join(";")}>${r}</div>`}var ge=v`
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
`;var re=.25,g=30,ne=22,ve=6;function _e(e,t){return(t==="iphone"?e.fitToScreen:e.watchFitToScreen)===!0}function Te(e){return e==="iphone"?g:ne}var oe=.6,ie=.4,ae=4,B=.5;function j(e,t){return e===0?0:t*(oe+(e-1)*ie)}function V(e){let t=[],r=n=>{for(;t.length<n;)t.push("empty")};for(let n of T(e)){let o=w(n),a=m(l(n));if(r(o.row+o.rowSpan),a!=="spacer")for(let s=o.row;s<o.row+o.rowSpan;s+=1)t[s]!=="header"&&(t[s]=a==="divider"?"header":"tile")}return t}function se(e,t,r,n,o,a=f,s=g){if(e.length===0||n<=0||o<=0)return;let i=y=>e.filter(Y=>Y===y).length,d=i("tile"),c=i("empty"),x=o-(i("header")*n+(e.length-1)*a-j(r,n));if(n*(d+c)<=x)return;let S=n*re,F=S,h=n;if(c>0&&(x-n*d)/c>=S)F=(x-n*d)/c;else if(d===0||(h=Math.floor((x-S*c)/d/B)*B,h<=0)||t!==void 0&&h*t+a*(t-1)<s)return;return{heights:e.map(y=>y==="empty"?F:y==="tile"?h:n),tileRow:h}}function Q(e,t,r,n=g){let o=T(e).map(i=>({g:w(i),kind:m(l(i))})),a=o.filter(i=>i.kind!=="spacer"&&i.kind!=="divider").map(i=>i.g.rowSpan),s=new Set(o.filter(i=>i.kind==="divider").map(i=>i.g.row)).size;return se(V(e),a.length===0?void 0:Math.min(...a),s,t,r,f,n)}function q(e,t,r=f){let n=0;for(let o=0;o<t;o+=1)n+=(e.heights[o]??e.tileRow)+r;return n}function de(e,t,r=f){return Math.max(1,Math.round((e+r)/(t+r)))}function ce(e,t){return t<e&&t<ae}function ue(e,t,r,n=f){let o=w(e),a=m(l(e));if(a==="spacer"||a==="divider"||t>=r*o.rowSpan+n*(o.rowSpan-1)-.01)return e;let s=de(t,r,n),i={...e,rowSpan:s,fittedCellHeight:t};return ce(o.rowSpan,s)&&delete i.arrange,i}function fe(e,t,r=!1){let n=e.unit+e.spacing,o=e.tiles.map(a=>{let s=w(a.tile),i=s.row*n-a.y,d=q(t,s.row,e.spacing),c=q(t,s.row+s.rowSpan,e.spacing)-d-e.spacing;return{...a,y:d-i,height:c,tile:r?a.tile:ue(a.tile,c,e.unit,e.spacing)}});return{...e,tiles:o}}function Se(e,t,r,n=g){let o=Q(t,e.unit,r,n);return o===void 0?e:{...fe(e,o),contentHeight:r,height:e.screen.height}}function Re(e,t,r,n=g){let o=Q(e,t,r,n);if(o!==void 0)return o.tileRow>=t?{kind:"empty-rows"}:{kind:"squashed",share:o.tileRow/t};let a=T(e).filter(c=>m(l(c))==="divider"),s=new Set(a.map(c=>w(c).row)).size,i=V(e).length;return i*t+Math.max(0,i-1)*f-j(s,t)<=r?{kind:"fits"}:{kind:"scrolls"}}function We(e,t="iPhone"){switch(e.kind){case"fits":return`This page already fits this ${t}'s screen.`;case"empty-rows":return"Fits: only its empty rows get shorter.";case"squashed":return`Fits: its rows are ${Math.round(e.share*100)}% of their normal height.`;case"scrolls":return`Too tall for this ${t}'s screen, so this page scrolls as normal. Remove some rows to fit it.`}}function Fe(e){let[t,r]=e==="iphone"?["iPhone","watch"]:["watch","iPhone"];return`This page fits the ${t}'s screen, so this tile draws short there. Custom layouts show on the ${r} and on taller tiles.`}var W=class extends L{static{this.properties={hass:{attribute:!1},owner:{attribute:!1},named:{type:Boolean},busy:{state:!0},failed:{state:!0}}}constructor(){super(),this.named=!1,this.busy=!1,this.failed=void 0}static{this.styles=v`
    :host { display: block; margin: 8px 0; font-size: 13px; line-height: 1.4; color: var(--wa-muted); }
    button {
      padding: 0; border: 0; background: none; font: inherit; color: var(--wa-accent); font-weight: 600;
      cursor: pointer; text-decoration: underline; text-underline-offset: 2px;
    }
    button:disabled { opacity: 0.5; cursor: default; }
    .failed { color: var(--wa-warn, var(--wa-muted)); }
  `}async use(){let t=this.hass,r=this.owner;if(!(t===void 0||r===void 0||this.busy)&&window.confirm(H(_(r)))){this.busy=!0,this.failed=void 0;try{await O(t,r.owner_watch_id),this.dispatchEvent(new CustomEvent(k,{bubbles:!0,composed:!0,detail:{watchId:r.owner_watch_id}}))}catch(n){this.failed=G(n)}finally{this.busy=!1}}}render(){return R(this.owner)?u`${this.named&&this.owner!==void 0?u`${I(this.owner.device_name??this.owner.owner_watch_id)} `:p}${A(_(this.owner))}
      <button type="button" ?disabled=${this.busy} @click=${()=>{this.use()}}>${P}</button>
      ${this.failed===void 0?p:u`<div class="failed" role="alert">${this.failed}</div>`}`:p}};typeof customElements<"u"&&!customElements.get("wa-move-wait-out")&&customElements.define("wa-move-wait-out",W);function He(e,t){return u`<wa-move-wait-out .hass=${e} .owner=${t}></wa-move-wait-out>`}function we(e,t,r){let n=t.filter(o=>r.has(o.owner_watch_id)&&R(o));return n.length===0?p:u`${n.map(o=>u`<wa-move-wait-out .hass=${e} .owner=${o} named></wa-move-wait-out>`)}`}function ke(e,t,r,n){let o=new Map;for(let i of t)o.set(i.owner_watch_id,{held:b(r,i.owner_watch_id,n),free:!1});let a=we(e,t,U(t,o)),s=he(t,r,n);return s.length===0?a:u`${a}${s.map(i=>u`<p class="seed-wait" role="status" style="margin:8px 0;font-size:13px;line-height:1.4;color:var(--wa-muted)">${K(i.device_name??i.owner_watch_id)}</p>`)}`}function he(e,t,r){return e.filter(n=>z(n)&&!b(t,n.owner_watch_id,r))}function pe(e,t,r,n,o){if(t===void 0)return!0;let a=d=>d.toUpperCase(),s=new Set(r.map(a)),i=e.find(d=>s.has(a(d.owner_watch_id))&&!b(t,d.owner_watch_id,n)&&D(d,[n])!==void 0);return i===void 0||N(i,[n],o)}function le(e,t,r,n,o){return pe(e,t,[r],n,o)}function Ie(e,t,r,n,o){if(t!==void 0&&b(t,r,n))return{go:!0};let a=e.find(s=>s.owner_watch_id.toUpperCase()===r.toUpperCase());return $(a)!=="wait"?{go:le(e,t,r,n,o)}:M(a)?{go:C("wait",o)}:{go:!1,note:E(a?.app_version,_(a))}}export{J as a,X as b,ee as c,be as d,ge as e,ve as f,_e as g,Te as h,ae as i,Q as j,q as k,ue as l,fe as m,Se as n,Re as o,We as p,Fe as q,He as r,we as s,ke as t,pe as u,le as v,Ie as w};
