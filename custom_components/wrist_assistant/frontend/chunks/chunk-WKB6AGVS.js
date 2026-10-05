import{b as s}from"./chunk-AGSP7PIK.js";import{i as g,j as b,l as f}from"./chunk-ZIEG52KN.js";import{c as x,d}from"./chunk-NHKIA2WF.js";var m=g,M=4,S=3;function E(t,e,n){let a=b*n,u=(Math.max(1,t-f*2)-(m-1)*b)/m*n;return{scale:n,unit:u,spacing:a,step:u+a,top:e*n,left:f*n}}function y(t,e){return{left:t.left+e.col*t.step,top:t.top+e.row*t.step,width:e.colSpan*t.unit+(e.colSpan-1)*t.spacing,height:e.rowSpan*t.unit+(e.rowSpan-1)*t.spacing}}function W(t,e,n){return{col:Math.floor((e-t.left)/t.step),row:Math.floor((n-t.top)/t.step)}}function O(t,e,n,a){let r=Math.max(1,Math.min(m,Math.trunc(a))),u=Math.round((e-t.left)/t.step),o=Math.round((n-t.top)/t.step);return{col:Math.max(0,Math.min(m-r,u)),row:Math.max(0,o)}}function z(t,e){return{left:t.x-e.x,top:t.y-e.y}}function D(t,e,n){return{cols:e/t.step,rows:n/t.step}}function H(t,e,n=M){return Math.hypot(t,e)>=n}function Z(t,e,n,a=48,r=18){return n-e>a*2?t<e+a?-Math.round(r*Math.min(1,(e+a-t)/a)):t>n-a?Math.round(r*Math.min(1,(t-(n-a))/a)):0:0}function L(t,e){return Math.max(1,Math.floor((e-t.top+t.spacing)/t.step))}function N(t,e,n=0){return Math.max(t+S,e,n+S)}function P(t,e,n){let a=t.unit,r=Math.max(0,Math.min(n,a/2)),u=a-2*r,o=c=>Math.round(c*100)/100,i=[];for(let c=0;c<e;c++)for(let p=0;p<m;p++){let h=t.left+p*t.step,w=c*t.step;i.push(r===0?`M${o(h)} ${o(w)}h${o(a)}v${o(a)}h${o(-a)}z`:`M${o(h+r)} ${o(w)}h${o(u)}a${o(r)} ${o(r)} 0 0 1 ${o(r)} ${o(r)}v${o(u)}a${o(r)} ${o(r)} 0 0 1 ${o(-r)} ${o(r)}h${o(-u)}a${o(r)} ${o(r)} 0 0 1 ${o(-r)} ${o(-r)}v${o(-u)}a${o(r)} ${o(r)} 0 0 1 ${o(r)} ${o(-r)}z`)}return i.join("")}function k(t,e){let n=0;for(let a of t)e>a&&n++;return n}var v="wrist-assistant-panel.pages.live.v1";function F(t=s()){try{return t?.getItem(v)==="1"}catch{return!1}}function j(t,e=s()){try{e?.setItem(v,t?"1":"0")}catch{}}var $="wrist-assistant-panel.pages.zoom.v1",l=[1,1.25,1.5,2];function U(t){return t?1.25:1.5}function K(t){return`${Math.round(t*100)}%`}function Y(t){return l.find(e=>e>t+1e-9)??t}function B(t){return[...l].reverse().find(e=>e<t-1e-9)??t}function V(t=s()){try{let e=t?.getItem($);if(e==null||e==="")return;let n=Number(e);return l.includes(n)?n:void 0}catch{return}}function q(t,e=s()){try{e?.setItem($,t===void 0?"":String(t))}catch{}}function J(t,e){return e>t?e-1:e}var _=.145,T=.045,C=.018,R=.05;function A(t,e){let n=t*e;return{radius:Math.round(n*_),bezel:Math.round(n*T),rim:Math.max(2,Math.round(n*C)),crown:Math.round(n*R)}}function tt(t,e,n,a){let r=A(t.width,e),u=[`--wf-radius:${r.radius}px`,`--wf-bezel:${r.bezel}px`,`--wf-rim:${r.rim}px`,`--wf-crown:${r.crown}px`];if(t.height!==void 0&&t.height>0){let o=t.height*e+r.bezel*2,i=c=>`${Math.round(o*c*100)/100}px`;u.push(`--wf-crown-top:${i(.19)}`,`--wf-crown-h:${i(.16)}`,`--wf-button-top:${i(.42)}`,`--wf-button-h:${i(.22)}`)}return d`<div class="wa-watch" aria-label=${a??"Watch"} style=${u.join(";")}>${n}</div>`}var et=x`
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
`;export{E as a,y as b,W as c,O as d,z as e,D as f,H as g,Z as h,L as i,N as j,P as k,k as l,F as m,j as n,l as o,U as p,K as q,Y as r,B as s,V as t,q as u,J as v,tt as w,et as x};
