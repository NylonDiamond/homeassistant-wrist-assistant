import{b as x,d as R}from"./chunk-G7AAB2LI.js";import{R as f,e as d,l,u,v as p}from"./chunk-WRB6XLXW.js";var W=.145,P=.045,I=.018,M=.05;function k(e,t){let i=e*t;return{radius:Math.round(i*W),bezel:Math.round(i*P),rim:Math.max(2,Math.round(i*I)),crown:Math.round(i*M)}}function N(e,t,i,r){let o=k(e.width,t),a=[`--wf-radius:${o.radius}px`,`--wf-bezel:${o.bezel}px`,`--wf-rim:${o.rim}px`,`--wf-crown:${o.crown}px`];if(e.height!==void 0&&e.height>0){let n=e.height*t+o.bezel*2,s=c=>`${Math.round(n*c*100)/100}px`;a.push(`--wf-crown-top:${s(.19)}`,`--wf-crown-h:${s(.16)}`,`--wf-button-top:${s(.42)}`,`--wf-button-h:${s(.22)}`)}return R`<div class="wa-watch" aria-label=${r??"Watch"} style=${a.join(";")}>${i}</div>`}var q=x`
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
`;var A=.25,E=30,U=7,O=.6,H=.4,C=4,v=.5;function S(e,t){return e===0?0:t*(O+(e-1)*H)}function F(e){let t=[],i=r=>{for(;t.length<r;)t.push("empty")};for(let r of l(e)){let o=f(r),a=p(u(r));if(i(o.row+o.rowSpan),a!=="spacer")for(let n=o.row;n<o.row+o.rowSpan;n+=1)t[n]!=="header"&&(t[n]=a==="divider"?"header":"tile")}return t}function $(e,t,i,r,o,a=d){if(e.length===0||r<=0||o<=0)return;let n=m=>e.filter(y=>y===m).length,s=n("tile"),c=n("empty"),w=o-(n("header")*r+(e.length-1)*a-S(i,r));if(r*(s+c)<=w)return;let b=r*A,g=b,h=r;if(c>0&&(w-r*s)/c>=b)g=(w-r*s)/c;else if(s===0||(h=Math.floor((w-b*c)/s/v)*v,h<=0)||t!==void 0&&h*t+a*(t-1)<E)return;return{heights:e.map(m=>m==="empty"?g:m==="tile"?h:r),tileRow:h}}function _(e,t,i){let r=l(e).map(n=>({g:f(n),kind:p(u(n))})),o=r.filter(n=>n.kind!=="spacer"&&n.kind!=="divider").map(n=>n.g.rowSpan),a=new Set(r.filter(n=>n.kind==="divider").map(n=>n.g.row)).size;return $(F(e),o.length===0?void 0:Math.min(...o),a,t,i)}function T(e,t,i=d){let r=0;for(let o=0;o<t;o+=1)r+=(e.heights[o]??e.tileRow)+i;return r}function L(e,t,i=d){return Math.max(1,Math.round((e+i)/(t+i)))}function z(e,t){return t<e&&t<C}function D(e,t,i,r=d){let o=f(e),a=p(u(e));if(a==="spacer"||a==="divider"||t>=i*o.rowSpan+r*(o.rowSpan-1)-.01)return e;let n=L(t,i,r),s={...e,rowSpan:n,fittedCellHeight:t};return z(o.rowSpan,n)&&delete s.arrange,s}function K(e,t,i=!1){let r=e.unit+e.spacing,o=e.tiles.map(a=>{let n=f(a.tile),s=n.row*r-a.y,c=T(t,n.row,e.spacing),w=T(t,n.row+n.rowSpan,e.spacing)-c-e.spacing;return{...a,y:c-s,height:w,tile:i?a.tile:D(a.tile,w,e.unit,e.spacing)}});return{...e,tiles:o}}function Y(e,t,i){let r=_(t,e.unit,i);return r===void 0?e:{...K(e,r),contentHeight:i,height:e.screen.height}}function Z(e,t,i){let r=_(e,t,i);if(r!==void 0)return r.tileRow>=t?{kind:"empty-rows"}:{kind:"squashed",share:r.tileRow/t};let o=l(e).filter(c=>p(u(c))==="divider"),a=new Set(o.map(c=>f(c).row)).size,n=F(e).length;return n*t+Math.max(0,n-1)*d-S(a,t)<=i?{kind:"fits"}:{kind:"scrolls"}}function J(e){switch(e.kind){case"fits":return"This page already fits this iPhone's screen.";case"empty-rows":return"Fits: only its empty rows get shorter.";case"squashed":return`Fits: its rows are ${Math.round(e.share*100)}% of their normal height.`;case"scrolls":return"Too tall for this iPhone's screen, so this page scrolls as normal. Remove some rows to fit it."}}export{P as a,I as b,M as c,N as d,q as e,U as f,_ as g,T as h,D as i,K as j,Y as k,Z as l,J as m};
