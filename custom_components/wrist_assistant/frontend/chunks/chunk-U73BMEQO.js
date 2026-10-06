import{c}from"./chunk-ULP77QG2.js";import{i as v,j as m,l as b}from"./chunk-ZPJR7QBR.js";import{c as g,d as S}from"./chunk-CSCVGLX5.js";var l=v,T=4,$=3;function F(t,e,n){let o=m*n,u=(Math.max(1,t-b*2)-(l-1)*m)/l*n;return{scale:n,unit:u,spacing:o,step:u+o,top:e*n,left:b*n}}function H(t,e){return{left:t.left+e.col*t.step,top:t.top+e.row*t.step,width:e.colSpan*t.unit+(e.colSpan-1)*t.spacing,height:e.rowSpan*t.unit+(e.rowSpan-1)*t.spacing}}function L(t,e,n){return{col:Math.floor((e-t.left)/t.step),row:Math.floor((n-t.top)/t.step)}}function N(t,e,n,o){let r=Math.max(1,Math.min(l,Math.trunc(o))),u=Math.round((e-t.left)/t.step),a=Math.round((n-t.top)/t.step);return{col:Math.max(0,Math.min(l-r,u)),row:Math.max(0,a)}}function Z(t,e){return{left:t.x-e.x,top:t.y-e.y}}function P(t,e,n){return{cols:e/t.step,rows:n/t.step}}function j(t,e,n=T){return Math.hypot(t,e)>=n}function K(t,e,n,o=48,r=18){return n-e>o*2?t<e+o?-Math.round(r*Math.min(1,(e+o-t)/o)):t>n-o?Math.round(r*Math.min(1,(t-(n-o))/o)):0:0}function U(t,e){return Math.max(1,Math.floor((e-t.top+t.spacing)/t.step))}function Y(t,e,n=0){return Math.max(t+$,e,n+$)}function J(t,e,n){let o=t.unit,r=Math.max(0,Math.min(n,o/2)),u=o-2*r,a=s=>Math.round(s*100)/100,i=[];for(let s=0;s<e;s++)for(let f=0;f<l;f++){let w=t.left+f*t.step,x=s*t.step;i.push(r===0?`M${a(w)} ${a(x)}h${a(o)}v${a(o)}h${a(-o)}z`:`M${a(w+r)} ${a(x)}h${a(u)}a${a(r)} ${a(r)} 0 0 1 ${a(r)} ${a(r)}v${a(u)}a${a(r)} ${a(r)} 0 0 1 ${a(-r)} ${a(r)}h${a(-u)}a${a(r)} ${a(r)} 0 0 1 ${a(-r)} ${a(-r)}v${a(-u)}a${a(r)} ${a(r)} 0 0 1 ${a(r)} ${a(-r)}z`)}return i.join("")}function B(t,e){let n=0;for(let o of t)e>o&&n++;return n}var M="wrist-assistant-panel.pages.live.v1";function V(t=c()){try{return t?.getItem(M)==="1"}catch{return!1}}function q(t,e=c()){try{e?.setItem(M,t?"1":"0")}catch{}}var y="wrist-assistant-panel.pages.zoom.v1",d=[1,1.25,1.5,2];function Q(t){return t?1.25:1.5}function X(t){return`${Math.round(t*100)}%`}function tt(t){return d.find(e=>e>t+1e-9)??t}function et(t){return[...d].reverse().find(e=>e<t-1e-9)??t}function nt(t=c()){try{let e=t?.getItem(y);if(e==null||e==="")return;let n=Number(e);return d.includes(n)?n:void 0}catch{return}}function rt(t,e=c()){try{e?.setItem(y,t===void 0?"":String(t))}catch{}}function ot(t,e){return e>t?e-1:e}var C=.145,O=.045,A=.018,E=.05;function G(t,e){let n=t*e;return{radius:Math.round(n*C),bezel:Math.round(n*O),rim:Math.max(2,Math.round(n*A)),crown:Math.round(n*E)}}function it(t,e,n,o){let r=G(t.width,e),u=[`--wf-radius:${r.radius}px`,`--wf-bezel:${r.bezel}px`,`--wf-rim:${r.rim}px`,`--wf-crown:${r.crown}px`];if(t.height!==void 0&&t.height>0){let a=t.height*e+r.bezel*2,i=s=>`${Math.round(a*s*100)/100}px`;u.push(`--wf-crown-top:${i(.19)}`,`--wf-crown-h:${i(.16)}`,`--wf-button-top:${i(.42)}`,`--wf-button-h:${i(.22)}`)}return S`<div class="wa-watch" aria-label=${o??"Watch"} style=${u.join(";")}>${n}</div>`}var st=g`
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
`;var h="wrist-assistant-panel.pages.folds.v1",p;function _(){return c()}function I(){let t=null;try{t=_()?.getItem(h)??null}catch{t=null}if(p!==void 0&&p.raw===t)return p.closed;let e=new Set;try{let n=t?JSON.parse(t):void 0;if(n!==null&&typeof n=="object"&&!Array.isArray(n))for(let[o,r]of Object.entries(n))r===!0&&e.add(o)}catch{}return p={raw:t,closed:e},e}function R(t,e){return`${t}:open:${e}`}function W(t,e,n){let o=t.get(R(e,n));return typeof o=="boolean"?o:!I().has(`${e}:${n}`)}function pt(t,e,n,o){k(t,[{module:e,section:n}],o)}function ft(t,e){return e.some(n=>W(t,n.module,n.section))}function k(t,e,n){let o=new Set(I());for(let{module:r,section:u}of e){t.set(R(r,u),n);let a=`${r}:${u}`;n?o.delete(a):o.add(a)}try{let r=_();if(!r)return;o.size===0?r.removeItem(h):r.setItem(h,JSON.stringify(Object.fromEntries([...o].sort().map(u=>[u,!0]))))}catch{}}export{F as a,H as b,L as c,N as d,Z as e,P as f,j as g,K as h,U as i,Y as j,J as k,B as l,V as m,q as n,d as o,Q as p,X as q,tt as r,et as s,nt as t,rt as u,ot as v,it as w,st as x,W as y,pt as z,ft as A,k as B};
