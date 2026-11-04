import{Ea as k}from"./chunk-HZZJB3SV.js";import{lg as E}from"./chunk-WJ2EW5QK.js";import{ea as H}from"./chunk-5LB7PZLF.js";import{j as I}from"./chunk-GIY73U3S.js";import{R as f,e as w,l as T,u as l,v as m}from"./chunk-TCVAOGAG.js";import{oa as O,pa as F,qa as P,ra as M,sa as $,ta as _}from"./chunk-WMGSOSBD.js";import{b as y,f as u,i as p,l as W}from"./chunk-6ZDBXU6B.js";var K=.145,U=.045,B=.018,G=.05;function q(e,t){let n=e*t;return{radius:Math.round(n*K),bezel:Math.round(n*U),rim:Math.max(2,Math.round(n*B)),crown:Math.round(n*G)}}function ie(e,t,n,o){let r=q(e.width,t),a=[`--wf-radius:${r.radius}px`,`--wf-bezel:${r.bezel}px`,`--wf-rim:${r.rim}px`,`--wf-crown:${r.crown}px`];if(e.height!==void 0&&e.height>0){let s=e.height*t+r.bezel*2,i=d=>`${Math.round(s*d*100)/100}px`;a.push(`--wf-crown-top:${i(.19)}`,`--wf-crown-h:${i(.16)}`,`--wf-button-top:${i(.42)}`,`--wf-button-h:${i(.22)}`)}return u`<div class="wa-watch" aria-label=${o??"Watch"} style=${a.join(";")}>${n}</div>`}var ae=y`
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
`;var j=.25,b=30,V=22,de=6;function ue(e,t){return(t==="iphone"?e.fitToScreen:e.watchFitToScreen)===!0}function we(e){return e==="iphone"?b:V}var fe=7,Q=.6,X=.4,Y=4,L=.5;function C(e,t){return e===0?0:t*(Q+(e-1)*X)}function N(e){let t=[],n=o=>{for(;t.length<o;)t.push("empty")};for(let o of T(e)){let r=f(o),a=m(l(o));if(n(r.row+r.rowSpan),a!=="spacer")for(let s=r.row;s<r.row+r.rowSpan;s+=1)t[s]!=="header"&&(t[s]=a==="divider"?"header":"tile")}return t}function Z(e,t,n,o,r,a=w,s=b){if(e.length===0||o<=0||r<=0)return;let i=x=>e.filter(D=>D===x).length,d=i("tile"),c=i("empty"),g=r-(i("header")*o+(e.length-1)*a-C(n,o));if(o*(d+c)<=g)return;let v=o*j,S=v,h=o;if(c>0&&(g-o*d)/c>=v)S=(g-o*d)/c;else if(d===0||(h=Math.floor((g-v*c)/d/L)*L,h<=0)||t!==void 0&&h*t+a*(t-1)<s)return;return{heights:e.map(x=>x==="empty"?S:x==="tile"?h:o),tileRow:h}}function z(e,t,n,o=b){let r=T(e).map(i=>({g:f(i),kind:m(l(i))})),a=r.filter(i=>i.kind!=="spacer"&&i.kind!=="divider").map(i=>i.g.rowSpan),s=new Set(r.filter(i=>i.kind==="divider").map(i=>i.g.row)).size;return Z(N(e),a.length===0?void 0:Math.min(...a),s,t,n,w,o)}function A(e,t,n=w){let o=0;for(let r=0;r<t;r+=1)o+=(e.heights[r]??e.tileRow)+n;return o}function J(e,t,n=w){return Math.max(1,Math.round((e+n)/(t+n)))}function ee(e,t){return t<e&&t<Y}function te(e,t,n,o=w){let r=f(e),a=m(l(e));if(a==="spacer"||a==="divider"||t>=n*r.rowSpan+o*(r.rowSpan-1)-.01)return e;let s=J(t,n,o),i={...e,rowSpan:s,fittedCellHeight:t};return ee(r.rowSpan,s)&&delete i.arrange,i}function re(e,t,n=!1){let o=e.unit+e.spacing,r=e.tiles.map(a=>{let s=f(a.tile),i=s.row*o-a.y,d=A(t,s.row,e.spacing),c=A(t,s.row+s.rowSpan,e.spacing)-d-e.spacing;return{...a,y:d-i,height:c,tile:n?a.tile:te(a.tile,c,e.unit,e.spacing)}});return{...e,tiles:r}}function he(e,t,n,o=b){let r=z(t,e.unit,n,o);return r===void 0?e:{...re(e,r),contentHeight:n,height:e.screen.height}}function pe(e,t,n,o=b){let r=z(e,t,n,o);if(r!==void 0)return r.tileRow>=t?{kind:"empty-rows"}:{kind:"squashed",share:r.tileRow/t};let a=T(e).filter(c=>m(l(c))==="divider"),s=new Set(a.map(c=>f(c).row)).size,i=N(e).length;return i*t+Math.max(0,i-1)*w-C(s,t)<=n?{kind:"fits"}:{kind:"scrolls"}}function le(e,t="iPhone"){switch(e.kind){case"fits":return`This page already fits this ${t}'s screen.`;case"empty-rows":return"Fits: only its empty rows get shorter.";case"squashed":return`Fits: its rows are ${Math.round(e.share*100)}% of their normal height.`;case"scrolls":return`Too tall for this ${t}'s screen, so this page scrolls as normal. Remove some rows to fit it.`}}function me(e){let[t,n]=e==="iphone"?["iPhone","watch"]:["watch","iPhone"];return`This page fits the ${t}'s screen, so this tile draws short there. Custom layouts show on the ${n} and on taller tiles.`}var R=class extends W{static{this.properties={hass:{attribute:!1},owner:{attribute:!1},named:{type:Boolean},busy:{state:!0},failed:{state:!0}}}constructor(){super(),this.named=!1,this.busy=!1,this.failed=void 0}static{this.styles=y`
    :host { display: block; margin: 8px 0; font-size: 13px; line-height: 1.4; color: var(--wa-muted); }
    button {
      padding: 0; border: 0; background: none; font: inherit; color: var(--wa-accent); font-weight: 600;
      cursor: pointer; text-decoration: underline; text-underline-offset: 2px;
    }
    button:disabled { opacity: 0.5; cursor: default; }
    .failed { color: var(--wa-warn, var(--wa-muted)); }
  `}async use(){let t=this.hass,n=this.owner;if(!(t===void 0||n===void 0||this.busy)&&window.confirm(P)){this.busy=!0,this.failed=void 0;try{await E(t,n.owner_watch_id),this.dispatchEvent(new CustomEvent(M,{bubbles:!0,composed:!0,detail:{watchId:n.owner_watch_id}}))}catch(o){this.failed=k(o)}finally{this.busy=!1}}}render(){return _(this.owner)?u`${this.named&&this.owner!==void 0?u`${$(this.owner.device_name??this.owner.owner_watch_id)} `:p}${O}
      <button type="button" ?disabled=${this.busy} @click=${()=>{this.use()}}>${F}</button>
      ${this.failed===void 0?p:u`<div class="failed" role="alert">${this.failed}</div>`}`:p}};typeof customElements<"u"&&!customElements.get("wa-move-wait-out")&&customElements.define("wa-move-wait-out",R);function Re(e,t){return u`<wa-move-wait-out .hass=${e} .owner=${t}></wa-move-wait-out>`}function ne(e,t,n){let o=t.filter(r=>n.has(r.owner_watch_id)&&_(r));return o.length===0?p:u`${o.map(r=>u`<wa-move-wait-out .hass=${e} .owner=${r} named></wa-move-wait-out>`)}`}function Se(e,t,n,o){let r=new Map;for(let a of t)r.set(a.owner_watch_id,{held:H(n,a.owner_watch_id,o),free:!1});return ne(e,t,I(t,r))}export{U as a,B as b,G as c,ie as d,ae as e,de as f,ue as g,we as h,fe as i,Y as j,z as k,A as l,te as m,re as n,he as o,pe as p,le as q,me as r,Re as s,ne as t,Se as u};
