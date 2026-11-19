import{R as d,e as u,l as g,u as p,v as l}from"./chunk-IX4Z54XE.js";import{b as S,f as T}from"./chunk-6ZDBXU6B.js";var P=.145,I=.045,M=.018,A=.05;function H(e,t){let o=e*t;return{radius:Math.round(o*P),bezel:Math.round(o*I),rim:Math.max(2,Math.round(o*M)),crown:Math.round(o*A)}}function j(e,t,o,r){let n=e.round===!0,a=H(e.width,t),i=[`--wf-radius:${n?Math.round(e.width*t/2):a.radius}px`,`--wf-bezel:${a.bezel}px`,`--wf-rim:${a.rim}px`,`--wf-crown:${a.crown}px`];if(n){let w=e.width*t+a.bezel*2,s=h=>`${Math.round(w*h*100)/100}px`;i.push(`--wf-crown-top:${s(.42)}`,`--wf-crown-h:${s(.16)}`,`--wf-button-top:${s(.66)}`,`--wf-button-h:${s(.1)}`)}else if(e.height!==void 0&&e.height>0){let w=e.height*t+a.bezel*2,s=h=>`${Math.round(w*h*100)/100}px`;i.push(`--wf-crown-top:${s(.19)}`,`--wf-crown-h:${s(.16)}`,`--wf-button-top:${s(.42)}`,`--wf-button-h:${s(.22)}`)}return n?T`<div class="wa-watch round" aria-label=${r??"Watch"} style=${i.join(";")}>${o}</div>`:T`<div class="wa-watch" aria-label=${r??"Watch"} style=${i.join(";")}>${o}</div>`}var B=S`
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
`;var E=.25,m=30,k=22,Z=6;function J(e,t){return(t==="iphone"?e.fitToScreen:e.watchFitToScreen)===!0}function Q(e){return e==="iphone"?m:k}var O=.6,C=.4,L=4,v=.5;function F(e,t){return e===0?0:t*(O+(e-1)*C)}function _(e){let t=[],o=r=>{for(;t.length<r;)t.push("empty")};for(let r of g(e)){let n=d(r),a=l(p(r));if(o(n.row+n.rowSpan),a!=="spacer")for(let c=n.row;c<n.row+n.rowSpan;c+=1)t[c]!=="header"&&(t[c]=a==="divider"?"header":"tile")}return t}function z(e,t,o,r,n,a=u,c=m){if(e.length===0||r<=0||n<=0)return;let i=b=>e.filter($=>$===b).length,w=i("tile"),s=i("empty"),h=n-(i("header")*r+(e.length-1)*a-F(o,r));if(r*(w+s)<=h)return;let x=r*E,R=x,f=r;if(s>0&&(h-r*w)/s>=x)R=(h-r*w)/s;else if(w===0||(f=Math.floor((h-x*s)/w/v)*v,f<=0)||t!==void 0&&f*t+a*(t-1)<c)return;return{heights:e.map(b=>b==="empty"?R:b==="tile"?f:r),tileRow:f}}function y(e,t,o,r=m){let n=g(e).map(i=>({g:d(i),kind:l(p(i))})),a=n.filter(i=>i.kind!=="spacer"&&i.kind!=="divider").map(i=>i.g.rowSpan),c=new Set(n.filter(i=>i.kind==="divider").map(i=>i.g.row)).size;return z(_(e),a.length===0?void 0:Math.min(...a),c,t,o,u,r)}function W(e,t,o=u){let r=0;for(let n=0;n<t;n+=1)r+=(e.heights[n]??e.tileRow)+o;return r}function D(e,t,o=u){return Math.max(1,Math.round((e+o)/(t+o)))}function K(e,t){return t<e&&t<L}function G(e,t,o,r=u){let n=d(e),a=l(p(e));if(a==="spacer"||a==="divider"||t>=o*n.rowSpan+r*(n.rowSpan-1)-.01)return e;let c=D(t,o,r),i={...e,rowSpan:c,fittedCellHeight:t};return K(n.rowSpan,c)&&delete i.arrange,i}function N(e,t,o=!1){let r=e.unit+e.spacing,n=e.tiles.map(a=>{let c=d(a.tile),i=c.row*r-a.y,w=W(t,c.row,e.spacing),s=W(t,c.row+c.rowSpan,e.spacing)-w-e.spacing;return{...a,y:w-i,height:s,tile:o?a.tile:G(a.tile,s,e.unit,e.spacing)}});return{...e,tiles:n}}function V(e,t,o,r=m){let n=y(t,e.unit,o,r);return n===void 0?e:{...N(e,n),contentHeight:o,height:e.screen.height}}function X(e,t,o,r=m){let n=y(e,t,o,r);if(n!==void 0)return n.tileRow>=t?{kind:"empty-rows"}:{kind:"squashed",share:n.tileRow/t};let a=g(e).filter(s=>l(p(s))==="divider"),c=new Set(a.map(s=>d(s).row)).size,i=_(e).length;return i*t+Math.max(0,i-1)*u-F(c,t)<=o?{kind:"fits"}:{kind:"scrolls"}}function ee(e,t="iPhone"){switch(e.kind){case"fits":return`This page already fits this ${t}'s screen.`;case"empty-rows":return"Fits: only its empty rows get shorter.";case"squashed":return`Fits: its rows are ${Math.round(e.share*100)}% of their normal height.`;case"scrolls":return`Too tall for this ${t}'s screen, so this page scrolls as normal. Remove some rows to fit it.`}}function te(e,t="iPhone"){let[o,r]=e==="iphone"?[t,"watch"]:["watch",t];return`This page fits the ${o}'s screen, so this tile draws short there. Custom layouts show on the ${r} and on taller tiles.`}export{I as a,M as b,A as c,j as d,B as e,Z as f,J as g,Q as h,L as i,y as j,W as k,G as l,N as m,V as n,X as o,ee as p,te as q};
