import{b as R,d as S}from"./chunk-G7AAB2LI.js";import{R as f,e as h,l as g,u as p,v as d}from"./chunk-GAYIT4EM.js";var I=.145,M=.045,O=.018,A=.05;function E(e,t){let n=e*t;return{radius:Math.round(n*I),bezel:Math.round(n*M),rim:Math.max(2,Math.round(n*O)),crown:Math.round(n*A)}}function B(e,t,n,o){let r=E(e.width,t),a=[`--wf-radius:${r.radius}px`,`--wf-bezel:${r.bezel}px`,`--wf-rim:${r.rim}px`,`--wf-crown:${r.crown}px`];if(e.height!==void 0&&e.height>0){let s=e.height*t+r.bezel*2,i=w=>`${Math.round(s*w*100)/100}px`;a.push(`--wf-crown-top:${i(.19)}`,`--wf-crown-h:${i(.16)}`,`--wf-button-top:${i(.42)}`,`--wf-button-h:${i(.22)}`)}return S`<div class="wa-watch" aria-label=${o??"Watch"} style=${a.join(";")}>${n}</div>`}var j=R`
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
`;var H=.25,l=30,k=22,Z=6;function J(e,t){return(t==="iphone"?e.fitToScreen:e.watchFitToScreen)===!0}function Q(e){return e==="iphone"?l:k}var V=7,$=.6,C=.4,L=4,v=.5;function W(e,t){return e===0?0:t*($+(e-1)*C)}function F(e){let t=[],n=o=>{for(;t.length<o;)t.push("empty")};for(let o of g(e)){let r=f(o),a=d(p(o));if(n(r.row+r.rowSpan),a!=="spacer")for(let s=r.row;s<r.row+r.rowSpan;s+=1)t[s]!=="header"&&(t[s]=a==="divider"?"header":"tile")}return t}function z(e,t,n,o,r,a=h,s=l){if(e.length===0||o<=0||r<=0)return;let i=b=>e.filter(P=>P===b).length,w=i("tile"),c=i("empty"),m=r-(i("header")*o+(e.length-1)*a-W(n,o));if(o*(w+c)<=m)return;let x=o*H,T=x,u=o;if(c>0&&(m-o*w)/c>=x)T=(m-o*w)/c;else if(w===0||(u=Math.floor((m-x*c)/w/v)*v,u<=0)||t!==void 0&&u*t+a*(t-1)<s)return;return{heights:e.map(b=>b==="empty"?T:b==="tile"?u:o),tileRow:u}}function y(e,t,n,o=l){let r=g(e).map(i=>({g:f(i),kind:d(p(i))})),a=r.filter(i=>i.kind!=="spacer"&&i.kind!=="divider").map(i=>i.g.rowSpan),s=new Set(r.filter(i=>i.kind==="divider").map(i=>i.g.row)).size;return z(F(e),a.length===0?void 0:Math.min(...a),s,t,n,h,o)}function _(e,t,n=h){let o=0;for(let r=0;r<t;r+=1)o+=(e.heights[r]??e.tileRow)+n;return o}function D(e,t,n=h){return Math.max(1,Math.round((e+n)/(t+n)))}function K(e,t){return t<e&&t<L}function G(e,t,n,o=h){let r=f(e),a=d(p(e));if(a==="spacer"||a==="divider"||t>=n*r.rowSpan+o*(r.rowSpan-1)-.01)return e;let s=D(t,n,o),i={...e,rowSpan:s,fittedCellHeight:t};return K(r.rowSpan,s)&&delete i.arrange,i}function N(e,t,n=!1){let o=e.unit+e.spacing,r=e.tiles.map(a=>{let s=f(a.tile),i=s.row*o-a.y,w=_(t,s.row,e.spacing),c=_(t,s.row+s.rowSpan,e.spacing)-w-e.spacing;return{...a,y:w-i,height:c,tile:n?a.tile:G(a.tile,c,e.unit,e.spacing)}});return{...e,tiles:r}}function X(e,t,n,o=l){let r=y(t,e.unit,n,o);return r===void 0?e:{...N(e,r),contentHeight:n,height:e.screen.height}}function ee(e,t,n,o=l){let r=y(e,t,n,o);if(r!==void 0)return r.tileRow>=t?{kind:"empty-rows"}:{kind:"squashed",share:r.tileRow/t};let a=g(e).filter(c=>d(p(c))==="divider"),s=new Set(a.map(c=>f(c).row)).size,i=F(e).length;return i*t+Math.max(0,i-1)*h-W(s,t)<=n?{kind:"fits"}:{kind:"scrolls"}}function te(e,t="iPhone"){switch(e.kind){case"fits":return`This page already fits this ${t}'s screen.`;case"empty-rows":return"Fits: only its empty rows get shorter.";case"squashed":return`Fits: its rows are ${Math.round(e.share*100)}% of their normal height.`;case"scrolls":return`Too tall for this ${t}'s screen, so this page scrolls as normal. Remove some rows to fit it.`}}function re(e){let[t,n]=e==="iphone"?["iPhone","watch"]:["watch","iPhone"];return`This page fits the ${t}'s screen, so this tile draws short there. Custom layouts show on the ${n} and on taller tiles.`}export{M as a,O as b,A as c,B as d,j as e,Z as f,J as g,Q as h,V as i,L as j,y as k,_ as l,G as m,N as n,X as o,ee as p,te as q,re as r};
