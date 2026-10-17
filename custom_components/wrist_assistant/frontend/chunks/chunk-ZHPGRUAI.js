import{b as w,d as s}from"./chunk-E5S2SHQS.js";import{g as i}from"./chunk-PPFKQRTD.js";var l=6;function f(r){return`var(--wa-person-${r%l+1})`}function h(r){let e=r.filter(o=>i(o)!=="library"),t=o=>[...o.filter(n=>i(n)==="watch"),...o.filter(n=>i(n)==="iphone")];return[...t(e.filter(o=>!o.is_orphan)),...t(e.filter(o=>o.is_orphan))].map(o=>o.owner_watch_id)}function u(r){let e=new Map;return h(r).forEach((t,o)=>{let n=t.toUpperCase();e.has(n)||e.set(n,f(o))}),e}function y(r,e){return e===void 0?void 0:r.get(e.toUpperCase())}function _(){let r,e=new Map;return t=>(t!==r&&(r=t,e=u(t)),e)}var b=.145,x=.045,v=.018,m=.05;function g(r,e){let t=r*e;return{radius:Math.round(t*b),bezel:Math.round(t*x),rim:Math.max(2,Math.round(t*v)),crown:Math.round(t*m)}}function R(r,e,t,o){let n=g(r.width,e),c=[`--wf-radius:${n.radius}px`,`--wf-bezel:${n.bezel}px`,`--wf-rim:${n.rim}px`,`--wf-crown:${n.crown}px`];if(r.height!==void 0&&r.height>0){let p=r.height*e+n.bezel*2,a=d=>`${Math.round(p*d*100)/100}px`;c.push(`--wf-crown-top:${a(.19)}`,`--wf-crown-h:${a(.16)}`,`--wf-button-top:${a(.42)}`,`--wf-button-h:${a(.22)}`)}return s`<div class="wa-watch" aria-label=${o??"Watch"} style=${c.join(";")}>${t}</div>`}var T=w`
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
`;export{u as a,y as b,_ as c,R as d,T as e};
