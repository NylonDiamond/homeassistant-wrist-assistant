import{Ea as j}from"./chunk-ZYBUWHUS.js";import{mg as k}from"./chunk-NPUC537M.js";import{ea as b}from"./chunk-5LB7PZLF.js";import{k as U}from"./chunk-ATGCOJRY.js";import{R as h,e as l,l as M,u as m,v as w}from"./chunk-TCVAOGAG.js";import{Ea as K,Ha as D,Ka as $,La as N,ma as W,oa as _,pa as E,sa as z,ta as F,ua as G,va as A,wa as C,xa as H,ya as O,za as I}from"./chunk-QHQZPGTZ.js";import{b as S,f as c,i as f,l as P}from"./chunk-6ZDBXU6B.js";var ne=.145,te=.045,re=.018,ie=.05;function oe(e,n){let t=e*n;return{radius:Math.round(t*ne),bezel:Math.round(t*te),rim:Math.max(2,Math.round(t*re)),crown:Math.round(t*ie)}}function ve(e,n,t,r){let i=oe(e.width,n),a=[`--wf-radius:${i.radius}px`,`--wf-bezel:${i.bezel}px`,`--wf-rim:${i.rim}px`,`--wf-crown:${i.crown}px`];if(e.height!==void 0&&e.height>0){let s=e.height*n+i.bezel*2,o=d=>`${Math.round(s*d*100)/100}px`;a.push(`--wf-crown-top:${o(.19)}`,`--wf-crown-h:${o(.16)}`,`--wf-button-top:${o(.42)}`,`--wf-button-h:${o(.22)}`)}return c`<div class="wa-watch" aria-label=${r??"Watch"} style=${a.join(";")}>${t}</div>`}var Le=S`
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
`;var ae=.25,g=30,se=22,ke=6;function We(e,n){return(n==="iphone"?e.fitToScreen:e.watchFitToScreen)===!0}function Ee(e){return e==="iphone"?g:se}var de=.6,ue=.4,ce=4,B=.5;function Y(e,n){return e===0?0:n*(de+(e-1)*ue)}function q(e){let n=[],t=r=>{for(;n.length<r;)n.push("empty")};for(let r of M(e)){let i=h(r),a=w(m(r));if(t(i.row+i.rowSpan),a!=="spacer")for(let s=i.row;s<i.row+i.rowSpan;s+=1)n[s]!=="header"&&(n[s]=a==="divider"?"header":"tile")}return n}function le(e,n,t,r,i,a=l,s=g){if(e.length===0||r<=0||i<=0)return;let o=y=>e.filter(ee=>ee===y).length,d=o("tile"),u=o("empty"),x=i-(o("header")*r+(e.length-1)*a-Y(t,r));if(r*(d+u)<=x)return;let T=r*ae,R=T,p=r;if(u>0&&(x-r*d)/u>=T)R=(x-r*d)/u;else if(d===0||(p=Math.floor((x-T*u)/d/B)*B,p<=0)||n!==void 0&&p*n+a*(n-1)<s)return;return{heights:e.map(y=>y==="empty"?R:y==="tile"?p:r),tileRow:p}}function Q(e,n,t,r=g){let i=M(e).map(o=>({g:h(o),kind:w(m(o))})),a=i.filter(o=>o.kind!=="spacer"&&o.kind!=="divider").map(o=>o.g.rowSpan),s=new Set(i.filter(o=>o.kind==="divider").map(o=>o.g.row)).size;return le(q(e),a.length===0?void 0:Math.min(...a),s,n,t,l,r)}function V(e,n,t=l){let r=0;for(let i=0;i<n;i+=1)r+=(e.heights[i]??e.tileRow)+t;return r}function he(e,n,t=l){return Math.max(1,Math.round((e+t)/(n+t)))}function pe(e,n){return n<e&&n<ce}function fe(e,n,t,r=l){let i=h(e),a=w(m(e));if(a==="spacer"||a==="divider"||n>=t*i.rowSpan+r*(i.rowSpan-1)-.01)return e;let s=he(n,t,r),o={...e,rowSpan:s,fittedCellHeight:n};return pe(i.rowSpan,s)&&delete o.arrange,o}function me(e,n,t=!1){let r=e.unit+e.spacing,i=e.tiles.map(a=>{let s=h(a.tile),o=s.row*r-a.y,d=V(n,s.row,e.spacing),u=V(n,s.row+s.rowSpan,e.spacing)-d-e.spacing;return{...a,y:d-o,height:u,tile:t?a.tile:fe(a.tile,u,e.unit,e.spacing)}});return{...e,tiles:i}}function ze(e,n,t,r=g){let i=Q(n,e.unit,t,r);return i===void 0?e:{...me(e,i),contentHeight:t,height:e.screen.height}}function Fe(e,n,t,r=g){let i=Q(e,n,t,r);if(i!==void 0)return i.tileRow>=n?{kind:"empty-rows"}:{kind:"squashed",share:i.tileRow/n};let a=M(e).filter(u=>w(m(u))==="divider"),s=new Set(a.map(u=>h(u).row)).size,o=q(e).length;return o*n+Math.max(0,o-1)*l-Y(s,n)<=t?{kind:"fits"}:{kind:"scrolls"}}function Ge(e,n="iPhone"){switch(e.kind){case"fits":return`This page already fits this ${n}'s screen.`;case"empty-rows":return"Fits: only its empty rows get shorter.";case"squashed":return`Fits: its rows are ${Math.round(e.share*100)}% of their normal height.`;case"scrolls":return`Too tall for this ${n}'s screen, so this page scrolls as normal. Remove some rows to fit it.`}}function Ae(e){let[n,t]=e==="iphone"?["iPhone","watch"]:["watch","iPhone"];return`This page fits the ${n}'s screen, so this tile draws short there. Custom layouts show on the ${t} and on taller tiles.`}var v=class extends P{static{this.properties={hass:{attribute:!1},owner:{attribute:!1},named:{type:Boolean},busy:{state:!0},failed:{state:!0}}}constructor(){super(),this.named=!1,this.busy=!1,this.failed=void 0}static{this.styles=S`
    :host { display: block; margin: 8px 0; font-size: 13px; line-height: 1.4; color: var(--wa-muted); }
    button {
      padding: 0; border: 0; background: none; font: inherit; color: var(--wa-accent); font-weight: 600;
      cursor: pointer; text-decoration: underline; text-underline-offset: 2px;
    }
    button:disabled { opacity: 0.5; cursor: default; }
    .failed { color: var(--wa-warn, var(--wa-muted)); }
  `}async use(){let n=this.hass,t=this.owner;if(!(n===void 0||t===void 0||this.busy)&&window.confirm(A(_(t)))){this.busy=!0,this.failed=void 0;try{await k(n,t.owner_watch_id),this.dispatchEvent(new CustomEvent(C,{bubbles:!0,composed:!0,detail:{watchId:t.owner_watch_id}}))}catch(r){this.failed=j(r)}finally{this.busy=!1}}}render(){return O(this.owner)?c`${this.named&&this.owner!==void 0?c`${H(this.owner.device_name??this.owner.owner_watch_id)} `:f}${G(_(this.owner))}
      <button type="button" ?disabled=${this.busy} @click=${()=>{this.use()}}>${F}</button>
      ${this.failed===void 0?f:c`<div class="failed" role="alert">${this.failed}</div>`}`:f}};typeof customElements<"u"&&!customElements.get("wa-move-wait-out")&&customElements.define("wa-move-wait-out",v);function Ue(e,n){return c`<wa-move-wait-out .hass=${e} .owner=${n}></wa-move-wait-out>`}function we(e,n,t){let r=n.filter(i=>t.has(i.owner_watch_id)&&O(i));return r.length===0?f:c`${r.map(i=>c`<wa-move-wait-out .hass=${e} .owner=${i} named></wa-move-wait-out>`)}`}function je(e,n,t,r){let i=new Map;for(let o of n)i.set(o.owner_watch_id,{held:b(t,o.owner_watch_id,r),free:!1});let a=we(e,n,U(n,i)),s=be(n,t,r);return s.length===0?a:c`${a}${s.map(o=>c`<p class="seed-wait" role="status" style="margin:8px 0;font-size:13px;line-height:1.4;color:var(--wa-muted)">${K(o.device_name??o.owner_watch_id)}</p>`)}`}function be(e,n,t){return e.filter(r=>D(r)&&!b(n,r.owner_watch_id,t))}function ge(e,n,t,r,i){if(n===void 0)return!0;let a=d=>d.toUpperCase(),s=new Set(t.map(a)),o=e.find(d=>s.has(a(d.owner_watch_id))&&!b(n,d.owner_watch_id,r)&&$(d,[r])!==void 0);return o===void 0||N(o,[r],i)}function xe(e,n,t,r,i){return ge(e,n,[t],r,i)}function Be(e,n,t,r,i){if(n!==void 0&&b(n,t,r))return{go:!0};let a=e.find(s=>s.owner_watch_id.toUpperCase()===t.toUpperCase());return W(a)!=="wait"?{go:xe(e,n,t,r,i)}:z(a)?{go:I("wait",i)}:{go:!1,note:E(a?.app_version,_(a))}}var Z={tinyTiles:"shrinkToDisc",centredGlyphOnPhone:!0,centredGlyphOnWatch:!0,brightnessBar:!0,centredNamesOneLine:!0};function Ye(e){return e==="phone"?Z.centredGlyphOnPhone:Z.centredGlyphOnWatch}var qe=.5,Qe=.62,ye=Object.freeze({nameSize:15.5,nameMin:11,nameTracking:-.01,figureSize:21,unitScale:.66,unitMin:0,wordSize:15,textMin:12,discK:.35,discMin:30,discMinNarrow:30,discMax:46,glyphK:.58,insetK:.11,insetMin:10,insetMax:14,stripDiscMax:44,stripGap:11,accessoryDisc:30,accessoryHit:44,liveSize:11,liveWidthEm:4.2,livePaddingV:4,livePaddingH:8,gapTop:6,bigSize:40,bigSubSize:13,bigSubGap:3,bigGap:18,chartLineWidth:2.2,rim:1,pearlGlow:12,underGlow:!0,cornerRadiusMax:22,cornerRadiusK:1/3,cornerStyle:"continuous",cellInset:.5,sidePadding:15.5}),Se=Object.freeze({nameSize:11.5,nameMin:10,nameTracking:-.01,figureSize:14,unitScale:.66,unitMin:10,wordSize:11,textMin:10,discK:.41,discMin:20,discMinNarrow:16,discMax:40,glyphK:.64,insetK:.09,insetMin:4.5,insetMax:7,stripDiscMax:20,stripGap:5,accessoryDisc:20,accessoryHit:32,liveSize:9,liveWidthEm:4.2,livePaddingV:2,livePaddingH:5,gapTop:1.5,bigSize:22,bigSubSize:10.5,bigSubGap:1.5,bigGap:10,chartLineWidth:1.6,rim:.6,pearlGlow:6,underGlow:!1,cornerRadiusMax:12,cornerRadiusK:.17,cornerStyle:"circular",cellInset:.5,sidePadding:1.5});function J(e){return e==="phone"?ye:Se}function Ze(e){return Math.max(e.unitMin,e.figureSize*e.unitScale)}function Je(e,n){return n<=4?e.discMinNarrow:e.discMin}function Xe(e,n){return Math.min(e.cornerRadiusMax,Math.min(n.width,n.height)*e.cornerRadiusK)}var _e=[.75,1.5];function en(e,n,t=1,r=1,i){if(n===1&&t===1&&r===1&&i===void 0)return e;let a=i===void 0?void 0:Math.min(Math.max(i,e.textMin),e.figureSize*_e[1]),s=a===void 0?r:a/e.figureSize,o=n*s,d=a===void 0?e.ownWordFloor===void 0?void 0:e.ownWordFloor*n:e.textMin*n;return Object.freeze({...e,...d===void 0?{}:{ownWordFloor:d},nameSize:e.nameSize*n*t,nameMin:e.nameMin*n*Math.min(1,t),figureSize:e.figureSize*o,unitMin:e.unitMin*n*Math.min(1,s),wordSize:(a??e.wordSize*s)*n,textMin:e.textMin*n*Math.min(1,s),bigSize:e.bigSize*o,bigSubSize:e.bigSubSize*o})}var Me=2,L="small",Te=Object.freeze({small:3,medium:6,large:12});function X(e,n=!1,t=!1,r=L){return n||t?0:e==="phone"?(Te[r]-Me)/2:J(e).cellInset}function nn(e){return e==="watch"?J(e).sidePadding:0}function tn(e,n=L){return Math.max(0,e-X("phone",!1,!1,n))}function rn(e=L){return 12-X("phone",!1,!1,e)}export{te as a,re as b,ie as c,ve as d,Le as e,Z as f,Ye as g,qe as h,Qe as i,J as j,Ze as k,Je as l,Xe as m,_e as n,en as o,L as p,X as q,nn as r,tn as s,rn as t,ke as u,We as v,Ee as w,ce as x,Q as y,V as z,fe as A,me as B,ze as C,Fe as D,Ge as E,Ae as F,Ue as G,we as H,je as I,ge as J,xe as K,Be as L};
