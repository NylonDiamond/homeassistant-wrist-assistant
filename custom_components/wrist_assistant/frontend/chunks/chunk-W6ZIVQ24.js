import{c}from"./chunk-QVYMVUW6.js";import{i as S,j as m,l as v}from"./chunk-43HRUTRJ.js";import{b as x,c as g}from"./chunk-CQXHQEN6.js";var l=S,T=4,$=3;function F(t,e,n,a=v){let r=m*n,o=(Math.max(1,t-a*2)-(l-1)*m)/l*n;return{scale:n,unit:o,spacing:r,step:o+r,top:e*n,left:a*n}}function H(t,e){return{left:t.left+e.col*t.step,top:t.top+e.row*t.step,width:e.colSpan*t.unit+(e.colSpan-1)*t.spacing,height:e.rowSpan*t.unit+(e.rowSpan-1)*t.spacing}}function L(t,e,n){return{col:Math.floor((e-t.left)/t.step),row:Math.floor((n-t.top)/t.step)}}function N(t,e,n,a){let r=Math.max(1,Math.min(l,Math.trunc(a))),u=Math.round((e-t.left)/t.step),o=Math.round((n-t.top)/t.step);return{col:Math.max(0,Math.min(l-r,u)),row:Math.max(0,o)}}function Z(t,e){return{left:t.x-e.x,top:t.y-e.y}}function P(t,e,n){return{cols:e/t.step,rows:n/t.step}}function j(t,e,n=T){return Math.hypot(t,e)>=n}function K(t,e,n,a=48,r=18){return n-e>a*2?t<e+a?-Math.round(r*Math.min(1,(e+a-t)/a)):t>n-a?Math.round(r*Math.min(1,(t-(n-a))/a)):0:0}function U(t,e){return Math.max(1,Math.floor((e-t.top+t.spacing)/t.step))}function Y(t,e,n=0){return Math.max(t+$,e,n+$)}function J(t,e,n){let a=t.unit,r=Math.max(0,Math.min(n,a/2)),u=a-2*r,o=s=>Math.round(s*100)/100,i=[];for(let s=0;s<e;s++)for(let f=0;f<l;f++){let h=t.left+f*t.step,w=s*t.step;i.push(r===0?`M${o(h)} ${o(w)}h${o(a)}v${o(a)}h${o(-a)}z`:`M${o(h+r)} ${o(w)}h${o(u)}a${o(r)} ${o(r)} 0 0 1 ${o(r)} ${o(r)}v${o(u)}a${o(r)} ${o(r)} 0 0 1 ${o(-r)} ${o(r)}h${o(-u)}a${o(r)} ${o(r)} 0 0 1 ${o(-r)} ${o(-r)}v${o(-u)}a${o(r)} ${o(r)} 0 0 1 ${o(r)} ${o(-r)}z`)}return i.join("")}function B(t,e){let n=0;for(let a of t)e>a&&n++;return n}var M="wrist-assistant-panel.pages.live.v1";function V(t=c()){try{return t?.getItem(M)==="1"}catch{return!1}}function q(t,e=c()){try{e?.setItem(M,t?"1":"0")}catch{}}var y="wrist-assistant-panel.pages.zoom.v1",b=[1,1.25,1.5,2];function Q(t){return t?1.25:1.5}function X(t){return`${Math.round(t*100)}%`}function tt(t){return b.find(e=>e>t+1e-9)??t}function et(t){return[...b].reverse().find(e=>e<t-1e-9)??t}function nt(t=c()){try{let e=t?.getItem(y);if(e==null||e==="")return;let n=Number(e);return b.includes(n)?n:void 0}catch{return}}function rt(t,e=c()){try{e?.setItem(y,t===void 0?"":String(t))}catch{}}function ot(t,e){return e>t?e-1:e}var C=.145,O=.045,A=.018,E=.05;function G(t,e){let n=t*e;return{radius:Math.round(n*C),bezel:Math.round(n*O),rim:Math.max(2,Math.round(n*A)),crown:Math.round(n*E)}}function it(t,e,n,a){let r=G(t.width,e),u=[`--wf-radius:${r.radius}px`,`--wf-bezel:${r.bezel}px`,`--wf-rim:${r.rim}px`,`--wf-crown:${r.crown}px`];if(t.height!==void 0&&t.height>0){let o=t.height*e+r.bezel*2,i=s=>`${Math.round(o*s*100)/100}px`;u.push(`--wf-crown-top:${i(.19)}`,`--wf-crown-h:${i(.16)}`,`--wf-button-top:${i(.42)}`,`--wf-button-h:${i(.22)}`)}return g`<div class="wa-watch" aria-label=${a??"Watch"} style=${u.join(";")}>${n}</div>`}var st=x`
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
`;var d="wrist-assistant-panel.pages.folds.v1",p;function _(){return c()}function I(){let t=null;try{t=_()?.getItem(d)??null}catch{t=null}if(p!==void 0&&p.raw===t)return p.closed;let e=new Set;try{let n=t?JSON.parse(t):void 0;if(n!==null&&typeof n=="object"&&!Array.isArray(n))for(let[a,r]of Object.entries(n))r===!0&&e.add(a)}catch{}return p={raw:t,closed:e},e}function R(t,e){return`${t}:open:${e}`}function W(t,e,n){let a=t.get(R(e,n));return typeof a=="boolean"?a:!I().has(`${e}:${n}`)}function pt(t,e,n,a){k(t,[{module:e,section:n}],a)}function ft(t,e){return e.some(n=>W(t,n.module,n.section))}function k(t,e,n){let a=new Set(I());for(let{module:r,section:u}of e){t.set(R(r,u),n);let o=`${r}:${u}`;n?a.delete(o):a.add(o)}try{let r=_();if(!r)return;a.size===0?r.removeItem(d):r.setItem(d,JSON.stringify(Object.fromEntries([...a].sort().map(u=>[u,!0]))))}catch{}}export{F as a,H as b,L as c,N as d,Z as e,P as f,j as g,K as h,U as i,Y as j,J as k,B as l,V as m,q as n,b as o,Q as p,X as q,tt as r,et as s,nt as t,rt as u,ot as v,it as w,st as x,W as y,pt as z,ft as A,k as B};
