import{R as d,e as u,l as g,u as p,v as l}from"./chunk-BHQ73QDG.js";import{b as S,f as T}from"./chunk-6ZDBXU6B.js";var $=.145,I=.045,M=.018,A=.05;function H(e,t){let n=e*t;return{radius:Math.round(n*$),bezel:Math.round(n*I),rim:Math.max(2,Math.round(n*M)),crown:Math.round(n*A)}}function j(e,t,n,o){let r=e.round===!0,a=H(e.width,t),i=[`--wf-radius:${r?Math.round(e.width*t/2):a.radius}px`,`--wf-bezel:${a.bezel}px`,`--wf-rim:${a.rim}px`,`--wf-crown:${a.crown}px`];if(r){let h=e.width*t+a.bezel*2,s=w=>`${Math.round(h*w*100)/100}px`;i.push(`--wf-crown-top:${s(.42)}`,`--wf-crown-h:${s(.16)}`,`--wf-button-top:${s(.66)}`,`--wf-button-h:${s(.1)}`)}else if(e.height!==void 0&&e.height>0){let h=e.height*t+a.bezel*2,s=w=>`${Math.round(h*w*100)/100}px`;i.push(`--wf-crown-top:${s(.19)}`,`--wf-crown-h:${s(.16)}`,`--wf-button-top:${s(.42)}`,`--wf-button-h:${s(.22)}`)}return r?T`<div class="wa-watch round" aria-label=${o??"Watch"} style=${i.join(";")}>${n}</div>`:T`<div class="wa-watch" aria-label=${o??"Watch"} style=${i.join(";")}>${n}</div>`}var B=S`
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
  /* A round Wear OS screen: the screen is clipped to its circle, so a tile in
     a corner shows as the watch shows it, cut by the round glass. */
  .wa-watch.round > * { overflow: hidden; }
`;var E=.25,m=30,k=22,Z=6;function J(e,t){return(t==="iphone"?e.fitToScreen:e.watchFitToScreen)===!0}function Q(e){return e==="iphone"?m:k}var O=.6,C=.4,L=4,v=.5;function F(e,t){return e===0?0:t*(O+(e-1)*C)}function _(e){let t=[],n=o=>{for(;t.length<o;)t.push("empty")};for(let o of g(e)){let r=d(o),a=l(p(o));if(n(r.row+r.rowSpan),a!=="spacer")for(let c=r.row;c<r.row+r.rowSpan;c+=1)t[c]!=="header"&&(t[c]=a==="divider"?"header":"tile")}return t}function z(e,t,n,o,r,a=u,c=m){if(e.length===0||o<=0||r<=0)return;let i=b=>e.filter(P=>P===b).length,h=i("tile"),s=i("empty"),w=r-(i("header")*o+(e.length-1)*a-F(n,o));if(o*(h+s)<=w)return;let x=o*E,R=x,f=o;if(s>0&&(w-o*h)/s>=x)R=(w-o*h)/s;else if(h===0||(f=Math.floor((w-x*s)/h/v)*v,f<=0)||t!==void 0&&f*t+a*(t-1)<c)return;return{heights:e.map(b=>b==="empty"?R:b==="tile"?f:o),tileRow:f}}function y(e,t,n,o=m){let r=g(e).map(i=>({g:d(i),kind:l(p(i))})),a=r.filter(i=>i.kind!=="spacer"&&i.kind!=="divider").map(i=>i.g.rowSpan),c=new Set(r.filter(i=>i.kind==="divider").map(i=>i.g.row)).size;return z(_(e),a.length===0?void 0:Math.min(...a),c,t,n,u,o)}function W(e,t,n=u){let o=0;for(let r=0;r<t;r+=1)o+=(e.heights[r]??e.tileRow)+n;return o}function D(e,t,n=u){return Math.max(1,Math.round((e+n)/(t+n)))}function K(e,t){return t<e&&t<L}function G(e,t,n,o=u){let r=d(e),a=l(p(e));if(a==="spacer"||a==="divider"||t>=n*r.rowSpan+o*(r.rowSpan-1)-.01)return e;let c=D(t,n,o),i={...e,rowSpan:c,fittedCellHeight:t};return K(r.rowSpan,c)&&delete i.arrange,i}function N(e,t,n=!1){let o=e.unit+e.spacing,r=e.tiles.map(a=>{let c=d(a.tile),i=c.row*o-a.y,h=W(t,c.row,e.spacing),s=W(t,c.row+c.rowSpan,e.spacing)-h-e.spacing;return{...a,y:h-i,height:s,tile:n?a.tile:G(a.tile,s,e.unit,e.spacing)}});return{...e,tiles:r}}function V(e,t,n,o=m){let r=y(t,e.unit,n,o);return r===void 0?e:{...N(e,r),contentHeight:n,height:e.screen.height}}function X(e,t,n,o=m){let r=y(e,t,n,o);if(r!==void 0)return r.tileRow>=t?{kind:"empty-rows"}:{kind:"squashed",share:r.tileRow/t};let a=g(e).filter(s=>l(p(s))==="divider"),c=new Set(a.map(s=>d(s).row)).size,i=_(e).length;return i*t+Math.max(0,i-1)*u-F(c,t)<=n?{kind:"fits"}:{kind:"scrolls"}}function ee(e,t="iPhone"){switch(e.kind){case"fits":return`This page already fits this ${t}'s screen.`;case"empty-rows":return"Fits: only its empty rows get shorter.";case"squashed":return`Fits: its rows are ${Math.round(e.share*100)}% of their normal height.`;case"scrolls":return`Too tall for this ${t}'s screen, so this page scrolls as normal. Remove some rows to fit it.`}}function te(e){let[t,n]=e==="iphone"?["iPhone","watch"]:["watch","iPhone"];return`This page fits the ${t}'s screen, so this tile draws short there. Custom layouts show on the ${n} and on taller tiles.`}export{I as a,M as b,A as c,j as d,B as e,Z as f,J as g,Q as h,L as i,y as j,W as k,G as l,N as m,V as n,X as o,ee as p,te as q};
