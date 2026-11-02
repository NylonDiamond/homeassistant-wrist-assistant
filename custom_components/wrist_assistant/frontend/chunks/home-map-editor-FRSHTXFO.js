import{a as Jt,b as Jo,c as da,d as la,e as ha,f as pa,g as ma,h as ca,i as J,j as en,k as tn,l as on,m as nn,n as Ae,o as an,p as ye,q as eo,r as Oe,s as ua,t as fa,u as ne,v as ga}from"./chunk-BM26GRFX.js";import{a as _e}from"./chunk-FSA4VG3R.js";import{a as rn,b as sn,c as Le,d as ht,e as pt,f as va,g as ba,h as wa,i as ya,j as ka,k as Ma}from"./chunk-GIWFR4TE.js";import"./chunk-IXL67W32.js";import{c as Rt,k as ni,l as ii}from"./chunk-MDGPCNEL.js";import{Z as di,_ as li}from"./chunk-OUIHU54Q.js";import"./chunk-ZYSWWJNQ.js";import{a as to,b as ee,c as pe,d as mt,e as Ye,f as $a,g as ct,h as dn,i as ke,j as xa,k as Ha,l as Pa,m as Ze}from"./chunk-JMDXRNSE.js";import"./chunk-YQ3UMYHB.js";import{$ as $i,$a as Vi,A as Oo,Aa as Ge,Ab as ra,Ba as Bt,Bb as sa,Ca as Fi,D as _t,Da as dt,E as mi,Ea as Ie,F as ci,Fa as Wo,G as Se,Ga as zi,H as Lo,Ha as ji,I as Ft,Ia as Ue,J as ui,Ja as Ve,K as fi,Ka as Ni,La as Ki,M as Ke,Ma as Go,N as _o,Na as ve,O as q,Oa as Wt,P as Be,Pa as Gt,Q as Re,Qa as Bi,R as gi,Ra as Uo,S as vi,Sa as Wi,T as bi,Ta as Ut,U as wi,Ua as Vo,V as it,Va as lt,W as at,Wa as Vt,X as yi,Xa as Gi,Y as rt,Ya as Ui,Z as ki,Za as qo,_ as Mi,_a as Xo,a as ge,aa as xi,ab as qi,ba as zt,bb as Yo,ca as Hi,cb as be,d as Do,da as Fo,db as qe,ea as Pi,eb as Xi,fa as Ei,fb as Yi,ga as Ti,gb as Zo,ha as Ci,hb as De,ia as zo,ib as qt,ja as jo,jb as Xt,ka as st,kb as Zi,la as Si,lb as Qi,m as Ao,ma as Ri,mb as Z,n as Ce,na as Ii,nb as Xe,o as de,oa as We,ob as Yt,p as U,pa as No,pb as Ji,q as W,qa as jt,qb as Zt,r as le,ra as Di,rb as ea,s as he,sa as Ai,sb as ta,t as hi,ta as Oi,tb as oa,ua as Ko,ub as na,v as Lt,va as Nt,vb as ia,w as pi,wa as Bo,wb as aa,xa as Kt,xb as we,ya as Li,yb as Qo,za as _i,zb as Qt}from"./chunk-4Z22ZXCD.js";import{j as G}from"./chunk-UCO5DASE.js";import{a as ti,h as Ro}from"./chunk-TPW5WK27.js";import{A as So,B as M,E as j,F as S,G as Tt,H as X,I as se,K as Zn,M as oe,N as Qn,O as Ct,P as St,W as Jn,X as ei,Y,b as Wn,d as Gn,e as Un,h as tt,i as Vn,j as qn,v as ot,w as Xn,x as Yn,y as nt}from"./chunk-FJIHFDLG.js";import{a as Ne,i as oi}from"./chunk-WXP32YDG.js";import{Bh as Bn,b as Pt,ch as Et,d as m,dh as jn,e as k,eh as Nn,fh as Kn,g as v,j as zn,kg as Co,l as re,m as A}from"./chunk-G7AAB2LI.js";import{b as Ot}from"./chunk-2VK47YDQ.js";import{i as It,l as ai,m as ri,n as Dt,u as At,v as Io,w as si}from"./chunk-NKZCOZL2.js";import{lb as Te}from"./chunk-Y7CHJ2K5.js";import{a as C}from"./chunk-LO2NM3CE.js";var Ea=4,Ta=2400;function Ca(s,e){return[s.ox+e[0]*s.scale,s.oy+e[1]*s.scale]}function Me(s,e){return[(e[0]-s.ox)/s.scale,(e[1]-s.oy)/s.scale]}function ln(s,e,t,o=72,n=96){let a=s===void 0||s.rooms.length===0&&s.pins.length===0?{minX:-5,minY:-5,maxX:5,maxY:5}:Tt(s),r=Math.max(a.maxX-a.minX,1),d=Math.max(a.maxY-a.minY,1),l=Aa(Math.min(Math.max(e-o*2,40)/r,Math.max(t-n*2,40)/d),Ea,Ta);return{scale:l,ox:e/2-(a.minX+a.maxX)/2*l,oy:t/2-(a.minY+a.maxY)/2*l}}function hn(s,e,t){let o=Aa(s.scale*e,Ea,Ta),n=o/s.scale;return{scale:o,ox:t[0]-(t[0]-s.ox)*n,oy:t[1]-(t[1]-s.oy)*n}}function Sa(s,e){return Math.round(s.scale/e.scale*100)}var ut=1.25;function Ra(s){if(typeof s!="object"||s===null)return;let e=s;return{tag:typeof e.tagName=="string"?e.tagName.toUpperCase():"",type:typeof e.type=="string"?e.type.toLowerCase():"text",editable:e.isContentEditable===!0}}var Ia=["button","submit","reset","image"],Er=["checkbox","radio","range","color","file"];function pn(s){let e=Ra(s);return e===void 0?!1:e.editable||e.tag==="TEXTAREA"?!0:e.tag==="INPUT"&&!Ia.includes(e.type)&&!Er.includes(e.type)}function Da(s){let e=Ra(s);return e===void 0?!1:pn(s)||e.tag==="SELECT"?!0:e.tag==="INPUT"&&!Ia.includes(e.type)}function te(s,e){if(e)return;let t=s.metaKey===!0||s.ctrlKey===!0,o=s.key.length===1?s.key.toLowerCase():s.key;if(t)return o==="z"?s.shiftKey===!0?"redo":"undo":o==="y"?"redo":void 0;if(s.altKey===!0)return;switch(o){case"Escape":return"cancel";case"Delete":case"Backspace":return"delete";case"Enter":return"enter";case"+":case"=":return"zoomIn";case"-":return"zoomOut";case"0":return"fit";case"?":return"help"}let n=s.shiftKey===!0?.1:.01;if(o==="ArrowLeft")return{nudge:[-n,0]};if(o==="ArrowRight")return{nudge:[n,0]};if(o==="ArrowUp")return{nudge:[0,-n]};if(o==="ArrowDown")return{nudge:[0,n]};if(/^[a-z]$/.test(o)&&s.shiftKey!==!0)return{letter:o}}function ft(){let s=globalThis.navigator,e=`${typeof s?.platform=="string"?s.platform:""} ${typeof s?.userAgent=="string"?s.userAgent:""}`;return/Mac|iPhone|iPad/.test(e)}var Aa=(s,e,t)=>Math.min(Math.max(s,e),t);function gt(s,e=2){return`${(Math.round(s*10**e)/10**e).toFixed(e)} m`}function vt(s,e=2){let t=(Math.round(s*10**e)/10**e).toFixed(e);return/^-0(\.0*)?$/.test(t)?t.slice(1):t}function mn(s){let e=s.trim().replace(",",".").replace(/\s*(m|cm|°|deg)$/i,"");if(e===""||!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(e))return;let t=Number(e);if(Number.isFinite(t))return/cm$/i.test(s.trim())?t/100:t}function oo(s){if(s.outline.length<3)return{width:0,depth:0,area:0};let{a0:e,a1:t,c0:o,c1:n}=Oo(s,Ao(s));return{width:t-e,depth:n-o,area:Math.abs(_t(s.outline))}}function no(s){let{width:e,depth:t}=oo(s);return`${e.toFixed(1)} \xD7 ${t.toFixed(1)} m`}function Oa(s){if(s.outline.length<3)return s.outline.slice();let{a0:e,a1:t,c0:o,c1:n,point:i}=Oo(s,Ao(s));return[i(e,o),i(t,o),i(t,n),i(e,n)]}function La(s,e){let t=q(s)[e];if(t===void 0)return"inner";let o=Math.max(Math.hypot(t.b[0]-t.a[0],t.b[1]-t.a[1]),1e-9),n=-(t.b[1]-t.a[1])/o,i=(t.b[0]-t.a[0])/o,a=[(t.a[0]+t.b[0])/2,(t.a[1]+t.b[1])/2],r=Math.max(t.t,.1)+.1,d=de(s.outline,[a[0]+n*r,a[1]+i*r]),l=de(s.outline,[a[0]-n*r,a[1]-i*r]);if(d&&l)return"inner";if(d)n=-n,i=-i;else if(!l){let h=U(s);h!==void 0&&(h[0]-a[0])*n+(h[1]-a[1])*i>0&&(n=-n,i=-i)}return Math.abs(n)>Math.abs(i)?n>0?"right":"left":i>0?"bottom":"top"}function cn(s,e,t){let o=La(s,e);return`${t}, ${o} wall`}function _a(s){let e=q(s).map((o,n)=>La(s,n)),t=new Map;return e.map((o,n)=>{let i=(t.get(o)??0)+1;t.set(o,i);let a=`${o.charAt(0).toUpperCase()}${o.slice(1)} wall`;return i===1&&e.indexOf(o,n+1)<0?a:`${a} ${i}`})}function $e(s){return s.kind==="opening"?"Way through":s.kind==="window"?s.style==="sliding"?"Sliding window":"Window":s.style==="double"?"Double door":s.style==="sliding"?"Sliding door":"Door"}var Tr={sofa:"Sofa",table:"Table",chair:"Chair",bed:"Bed",storage:"Storage",television:"TV",bathtub:"Bath",sink:"Basin",toilet:"Toilet",stove:"Hob",oven:"Oven",refrigerator:"Fridge",dishwasher:"Dishwasher",washerDryer:"Washer dryer",fireplace:"Fireplace",stairs:"Stairs"};function bt(s){let e=Tr[s];if(e!==void 0)return e;let t=s.replace(/([a-z0-9])([A-Z])/g,"$1 $2").toLowerCase();return t.charAt(0).toUpperCase()+t.slice(1)}function R(s,e,t=`${e}s`){return`${s} ${s===1?e:t}`}function E(s,e,t,o=""){return m`<section class="hme-card ${o}">
    <div class="hme-h">${s}${t===void 0?v:m`<span class="hme-h-end">${t}</span>`}</div>
    ${e}
  </section>`}function L(s,...e){return m`<div class="hme-r"><span class="hme-l">${s}</span>${e}</div>`}function V(s){return m`<p class="hme-hint">${s}</p>`}var Fa=3;function Cr(s,e){return s==="\xB0"?1:10**-e}function F(s){let e=s.digits??2,t=s.step??Cr(s.unit,e),o=s.value===void 0?"":vt(s.value,e),n=d=>Math.min(Math.max(d,s.min??-1/0),s.max??1/0),i=d=>vt(d,e)===o,a=d=>{let l=mn(d.value);if(l===void 0||s.min!==void 0&&l<s.min||s.max!==void 0&&l>s.max||i(l)){d.value=o;return}s.set(l)},r=d=>{let l=d.currentTarget,h=l.querySelector("input");if(h===null||s.disabled===!0||d.button!==0||h.matches(":focus"))return;d.preventDefault();let p=s.value,u=d.clientX,f=!1,g=p;try{l.setPointerCapture(d.pointerId)}catch{}let c=y=>{if(p===void 0)return;let w=y.clientX-u;if(!f&&Math.abs(w)<Fa)return;f||l.classList.add("scrubbing"),f=!0;let H=y.shiftKey?10:y.altKey?.1:1;g=n(Number((p+(w-Math.sign(w)*Fa)*t*H).toFixed(e+(y.altKey?1:0)))),h.value=vt(g,e),s.preview?.(g)},b=y=>{if(l.removeEventListener("pointermove",c),l.removeEventListener("pointerup",b),l.removeEventListener("pointercancel",b),l.classList.remove("scrubbing"),!f){h.focus(),h.select();return}s.preview?.(void 0),y.type!=="pointercancel"&&g!==void 0&&!i(g)?s.set(g):h.value=o};l.addEventListener("pointermove",c),l.addEventListener("pointerup",b),l.addEventListener("pointercancel",b)};return m`<span class="hme-in hme-num ${s.disabled===!0?"off":""}" style=${s.width===void 0?v:`flex:0 0 ${s.width}`}
    title=${s.disabled===!0?v:"Drag sideways to change it, click to type"} @pointerdown=${r}>
    ${s.tag===void 0?v:m`<span class="hme-ntag" aria-hidden="true">${s.tag}</span>`}
    <input type="text" inputmode="decimal" aria-label=${s.label} .value=${G(o)} ?disabled=${s.disabled===!0}
      placeholder=${s.value===void 0?"Mixed":""}
      @change=${d=>a(d.target)}
      @keydown=${d=>{let l=d.target;if(d.key==="Enter"&&l.blur(),d.key==="Escape"&&(l.value=o,l.blur()),(d.key==="ArrowUp"||d.key==="ArrowDown")&&s.value!==void 0){d.preventDefault();let h=mn(l.value)??s.value,p=n(Number((h+(d.key==="ArrowUp"?1:-1)*t*(d.shiftKey?10:1)).toFixed(e)));l.value=vt(p,e),i(p)||s.set(p)}}} />${s.unit===void 0?v:m`<span class="hme-unit">${s.unit}</span>`}</span>`}var Qe=new WeakMap,za=new WeakMap;function wt(s){let e=s.value.toLowerCase(),t=o=>{let n=Qe.get(o);n!==void 0&&(Qe.delete(o),s.preview(void 0),o.value.toLowerCase()!==n&&(za.set(o,o.value.toLowerCase()),s.set(o.value)))};return m`<input type="color" .value=${G(e)} aria-label=${s.label}
    @input=${o=>{let n=o.target;Qe.has(n)||Qe.set(n,e);let i=n.value.toLowerCase();s.preview(i===Qe.get(n)?void 0:i)}}
    @change=${o=>{let n=o.target,i=n.value.toLowerCase();Qe.has(n)?t(n):i!==e&&i!==za.get(n)&&s.set(n.value)}}
    @blur=${o=>t(o.target)} />`}function yt(...s){return m`<div class="hme-fields" style=${`--n:${s.length}`}>${s}</div>`}function kt(s,...e){return m`<div class="hme-group"><div class="hme-gl">${s}</div>${e}</div>`}function Je(s){return m`<span class="hme-in"><input type="text" aria-label=${s.label} maxlength=${s.max??100} placeholder=${s.placeholder??""}
    .value=${G(s.value)}
    @change=${e=>{let t=e.target.value;t.trim()!==s.value.trim()&&s.set(t)}}
    @keydown=${e=>{e.key==="Enter"&&e.target.blur()}} /></span>`}function Fe(s){return m`<span class="hme-in hme-sel ${s.cls??""}"><select aria-label=${s.label} @change=${e=>s.set(e.target.value)}>
    ${s.options.map(e=>m`<option value=${e.value} ?disabled=${e.disabled===!0} .selected=${G(e.value===s.value)}>${e.label}</option>`)}
  </select></span>`}function un(s){return m`<span class="hme-menu ${s.cls??""}"><select aria-label=${s.label} @change=${e=>{let t=e.target,o=t.value;t.value="",o!==""&&s.pick(o)}}>
    <option value="" .selected=${G(!0)}>${s.label}</option>
    ${s.options.map(e=>m`<option value=${e.value} ?disabled=${e.disabled===!0}>${e.label}</option>`)}
  </select><span class="hme-menu-caret" aria-hidden="true">▾</span></span>`}function Q(s){return m`<button type="button" class="hme-pic ${s.on?"on":""}" aria-pressed=${s.on?"true":"false"} title=${s.title??s.label}
    @click=${s.click}>${s.picture}<span>${s.label}</span></button>`}function Mt(s){return m`<button type="button" class="hme-chip ${s.on?"":"off"}" aria-pressed=${s.on?"true":"false"} aria-label=${s.label}
    @click=${s.click}>${s.on?s.onText:s.offText}</button>`}var Sr={wood:"repeating-linear-gradient(0deg,#b38a61 0 9px,#8e6845 9px 10px)",tile:"linear-gradient(#a9a7a1 1px,transparent 1px) 0 0/10px 10px, linear-gradient(90deg,#a9a7a1 1px,transparent 1px) 0 0/10px 10px, #cbc9c2",stone:"#bcc1c6 linear-gradient(#9da2a6 1px,transparent 1px) 0 0/18px 12px",carpet:"#99928a",plain:"#a8a6a1"},Rr={wood:"#a17a55",tile:"#bdbbb4",stone:"#b0b5ba",carpet:"#8f8880",plain:"#9c9a95"};function fn(s){return m`<span class="hme-sw" style=${`background:${Sr[s]}`}></span>`}var ja=s=>s.map(([e,t])=>`${Math.round(e*10)/10},${Math.round(t*10)/10}`).join(" ");function gn(s,e=34,t=24){let o=s?.rooms??[];if(o.length===0)return m`<svg class="hme-thumb" width=${e} height=${t} viewBox=${`0 0 ${e} ${t}`} aria-hidden="true">
      <rect x="1" y="1" width=${e-2} height=${t-2} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" stroke-dasharray="3 2" /></svg>`;let n=Tt(s),i=4,a=Math.min((e-i*2)/Math.max(n.maxX-n.minX,.5),(t-i*2)/Math.max(n.maxY-n.minY,.5)),r=e/2-(n.minX+n.maxX)/2*a,d=t/2-(n.minY+n.maxY)/2*a;return m`<svg class="hme-thumb" width=${e} height=${t} viewBox=${`0 0 ${e} ${t}`} aria-hidden="true">
    <rect x="0.5" y="0.5" width=${e-1} height=${t-1} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" />
    ${o.map(l=>k`<polygon points=${ja(l.outline.map(([h,p])=>[r+h*a,d+p*a]))} fill="none" stroke="var(--wa-muted)" stroke-width="1.1" />`)}
  </svg>`}function Na(s,e,t=76,o=54){let n=s.outline.map(c=>c[0]),i=s.outline.map(c=>c[1]),a=Math.min(...n),r=Math.max(...n),d=Math.min(...i),l=Math.max(...i),h=8,p=Math.min((t-h*2)/Math.max(r-a,.5),(o-h*2)/Math.max(l-d,.5)),u=t/2-(a+r)/2*p,f=o/2-(d+l)/2*p,g=ja(s.outline.map(([c,b])=>[u+c*p,f+b*p]));return m`<svg class="hme-room-thumb" width=${t} height=${o} viewBox=${`0 0 ${t} ${o}`} aria-hidden="true">
    <rect width=${t} height=${o} rx="8" fill="#121010" />
    <polygon points=${g} fill=${Rr[Lt(s)]} stroke="#ece6da" stroke-width="2.5" stroke-linejoin="round" />
    ${e?k`<circle cx=${t*.58} cy=${o*.42} r=${Math.min(t,o)*.22} fill="#ffb648" opacity="0.35" />`:v}
  </svg>`}function vn(s,e,t,o={}){let n=(o.reach??10)/t,i,a=n;for(let l of[...s.rooms.flatMap(h=>h.outline),...o.corners??[]]){let h=Math.hypot(l[0]-e[0],l[1]-e[1]);h<=a&&(i=l,a=h)}if(i!==void 0)return[i[0],i[1]];let[r,d]=e;if(o.grid!==void 0&&o.grid>0&&(r=Math.round(r/o.grid)*o.grid,d=Math.round(d/o.grid)*o.grid),o.from!==void 0){let l=8/t;Math.abs(e[0]-o.from[0])<=l&&(r=o.from[0]),Math.abs(e[1]-o.from[1])<=l&&(d=o.from[1])}return[Math.round(r*100)/100,Math.round(d*100)/100]}var xe=.1,He=.05,io=class{constructor(e){this.grid=e;this.active=!1;this.points=[]}start(e){this.active=!0,this.points=[],this.hoverAt=void 0,e.select(void 0),e.redraw()}stop(e){this.active=!1,this.points=[],this.hoverAt=void 0,e?.redraw()}snap(e,t){return vn(e.floor,t,e.view.scale,{...this.points.length>0?{from:this.points[this.points.length-1]}:{},...e.toggles.grid?{grid:this.grid}:{},corners:this.points})}closes(e,t){let o=this.points[0];return o!==void 0&&this.points.length>=3&&Math.hypot(t[0]-o[0],t[1]-o[1])*e.view.scale<=10}pointerDown(e,t,o){if(!this.active||t.button!==0)return!1;let n=this.snap(e,o);if(this.closes(e,n))return this.finish(e),!0;let i=this.points[this.points.length-1];return(i===void 0||Math.hypot(n[0]-i[0],n[1]-i[1])>=.05)&&this.points.push(n),e.redraw(),!0}hover(e,t){this.active&&(this.hoverAt=t===void 0?void 0:this.snap(e,t),e.redraw())}keyDown(e,t){return this.active?t.key==="Escape"?(this.stop(e),!0):t.key==="Enter"?(this.points.length>=3&&this.finish(e),!0):t.key==="Backspace"||t.key==="Delete"?(this.points.pop(),e.redraw(),!0):!1:!1}async finish(e){let t=this.points.slice();if(this.stop(e),t.length<3)return;let o=await e.ask({title:"Name the room",label:"Name",value:"Room",ok:"Add room"});if(o===void 0)return;let n=e.newId(),i=e.floor.id;e.apply(a=>ji(a,i,n,t,o),{select:{kind:"room",roomId:n}})||e.note("err","That room could not be added. Draw at least three corners round some floor.")}overlay(e){if(!this.active)return v;let t=this.points.map(d=>e.toScreen(d)),o=this.hoverAt===void 0?void 0:e.toScreen(this.hoverAt),n=this.hoverAt!==void 0&&this.closes(e,this.hoverAt),i=[...t,...o!==void 0?[o]:[]].map(([d,l])=>`${d.toFixed(1)},${l.toFixed(1)}`).join(" "),a=this.points[this.points.length-1],r=a!==void 0&&this.hoverAt!==void 0?Math.hypot(this.hoverAt[0]-a[0],this.hoverAt[1]-a[1]):0;return k`<g class="hme-draw">
      ${t.length>=3?k`<polygon points=${t.map(([d,l])=>`${d},${l}`).join(" ")} fill="rgba(91,141,239,0.14)" stroke="none" />`:v}
      <polyline points=${i} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />
      ${t.map(([d,l],h)=>k`<circle cx=${d} cy=${l} r=${h===0&&n?8:5} fill=${h===0&&n?"#5b8def":"#fff"} stroke="#5b8def" stroke-width="2" />`)}
      ${o!==void 0&&!n?k`<circle cx=${o[0]} cy=${o[1]} r="4" fill="#5b8def" />`:v}
      ${o!==void 0&&r>.05?k`<g class="hme-tag"><rect x=${o[0]+10} y=${o[1]-26} width="58" height="18" rx="9" fill="#5b8def" />
        <text x=${o[0]+39} y=${o[1]-13} fill="#fff" text-anchor="middle">${r.toFixed(2)} m</text></g>`:v}
    </g>`}hint(){return this.points.length===0?"Click to put down the first corner":this.points.length<3?"Click to add corners":"Click the first corner or press Enter to close the room"}};function me(s){return s===void 0||s.kind==="pin"||s.kind==="pins"||s.kind==="objects"?void 0:s.roomId}function ce(s){return s?.kind==="object"?[{roomId:s.roomId,object:s.object}]:s?.kind==="objects"?s.items.map(e=>({roomId:e.roomId,object:e.object})):[]}var ao=(s,e)=>M(s.roomId,e.roomId)&&s.object===e.object;function Ka(s){let e=[];for(let t of s)e.some(o=>ao(o,t))||e.push({roomId:t.roomId,object:t.object});if(e.length!==0)return e.length===1?{kind:"object",roomId:e[0].roomId,object:e[0].object}:{kind:"objects",items:e}}function ze(s,e){let t=ce(s);return t.some(o=>ao(o,e))?Ka(t.filter(o=>!ao(o,e))):Ka([...t,e])}function ro(s,e){if(e?.kind!=="pin"||s===void 0)return e;let t=Z(s,e.pinId);return t===void 0?e:{kind:"object",roomId:t.roomId,object:t.object}}function Ba(s,e,t){return ce(s).some(o=>ao(o,{roomId:e,object:t}))}function bn(s,e){if(e===void 0)return!0;if(s===void 0)return!1;if(e.kind==="pin")return s.pins.some(o=>M(o.id,e.pinId));if(e.kind==="pins")return e.pinIds.every(o=>s.pins.some(n=>M(n.id,o)));if(e.kind==="objects")return e.items.every(o=>s.rooms.find(n=>M(n.id,o.roomId))?.objects[o.object]!==void 0);let t=s.rooms.find(o=>M(o.id,e.roomId));if(t===void 0)return!1;switch(e.kind){case"room":return!0;case"wall":return q(t)[e.wall]!==void 0;case"corner":return t.outline[e.corner]!==void 0;case"opening":return t.openings[e.opening]!==void 0;case"object":return t.objects[e.object]!==void 0}}function so(s,e){return s===void 0||e===void 0?s===e:JSON.stringify(s)===JSON.stringify(e)}var Ir=15;function yn(s,e,t){let o,n=Ir;for(let i of s.pins){let a=e(i.at),r=Math.hypot(a[0]-t[0],a[1]-t[1]);r<=n&&(o=i,n=r)}return o}function kn(s,e,t){let o;for(let n of t===void 0?s.rooms:[t])n.objects.forEach((i,a)=>{if(i.hidden===!0)return;let r=he(le(i));if(!de(r,e))return;let d=Math.abs(_t(r));(o===void 0||d<o.area)&&(o={thing:{room:n,index:a,object:i},area:d})});return o?.thing}function Ua(s,e,t){let o=yn(s,e,e(t));if(o!==void 0){let a=Z(s,o.id);return a===void 0?{kind:"pin",pinId:o.id}:{kind:"object",roomId:a.roomId,object:a.object}}let n=kn(s,t);if(n!==void 0)return{kind:"object",roomId:n.room.id,object:n.index};let i=W(s,t);return i===void 0?void 0:{kind:"room",roomId:i.id}}function Mn(s,e){if(s!==void 0){if(s.kind==="room")return e?.kind==="room"&&M(e.roomId,s.roomId)?void 0:s;if(s.kind==="object")return ce(e).some(o=>M(o.roomId,s.roomId)&&o.object===s.object)?void 0:s;if(s.kind==="pin")return(e?.kind==="pin"?[e.pinId]:e?.kind==="pins"?e.pinIds:[]).some(o=>M(o,s.pinId))?void 0:s}}var Wa="rgba(91,141,239,0.14)",Dr="rgba(91,141,239,0.07)",wn="rgba(150,186,255,0.75)",Ga=s=>`${s[0].toFixed(1)},${s[1].toFixed(1)}`;function Va(s,e,t,o){let n=Mn(e,t);if(n===void 0)return v;if(n.kind==="pin"){let r=s.pins.find(h=>M(h.id,n.pinId));if(r===void 0)return v;let[d,l]=o(r.at);return k`<g class="hme-hover" pointer-events="none"><circle cx=${d.toFixed(1)} cy=${l.toFixed(1)} r="18" fill=${Wa} stroke=${wn} stroke-width="1.5" /></g>`}let i=s.rooms.find(r=>M(r.id,n.roomId));if(i===void 0)return v;if(n.kind==="object"){let r=i.objects[n.object];if(r===void 0)return v;let d=he(le(r)).map(l=>Ga(o(l))).join(" ");return k`<g class="hme-hover" pointer-events="none"><polygon points=${d} fill=${Wa} stroke=${wn} stroke-width="1.5"
      stroke-dasharray=${r.hidden===!0?"4 3":"none"} stroke-linejoin="round" /></g>`}if(i.outline.length<3)return v;let a=i.outline.map(r=>Ga(o(r))).join(" ");return k`<g class="hme-hover" pointer-events="none"><polygon points=${a} fill=${Dr} stroke=${wn} stroke-width="1.5" stroke-linejoin="round" /></g>`}var $n;function lo(){return $n??=import("./scene3d-3633JERF.js").catch(s=>{throw $n=void 0,s}),$n}function xn(s){return new URL("furniture/",s).href}var qa={wood:"Wood",tile:"Tile",stone:"Stone",carpet:"Carpet",plain:"Plain"},Ar={wood:[{name:"Light oak",hex:"#D9B88A"},{name:"Oak",hex:"#B98B5A"},{name:"Walnut",hex:"#6B4A32"},{name:"Grey wash",hex:"#9A948C"}],tile:[{name:"White",hex:"#E9E7E2"},{name:"Grey",hex:"#8E8E8A"},{name:"Black",hex:"#2E2E30"},{name:"Terracotta",hex:"#B4664A"}],stone:[{name:"Light",hex:"#C9C3B8"},{name:"Sand",hex:"#B8A98E"},{name:"Slate",hex:"#5E6468"}],carpet:[{name:"Grey",hex:"#8E8E93"},{name:"Beige",hex:"#CBB9A0"},{name:"Navy",hex:"#2E4A7D"},{name:"Green",hex:"#4F6B4A"}],plain:[{name:"White",hex:"#E9E7E2"},{name:"Grey",hex:"#8E8E8A"},{name:"Black",hex:"#2E2E30"}]},Or=[{name:"White",hex:"#F2F0EB"},{name:"Warm white",hex:"#EDE6D8"},{name:"Greige",hex:"#CFC6B8"},{name:"Sage",hex:"#A3B09A"},{name:"Blue grey",hex:"#8C9AA6"},{name:"Charcoal",hex:"#3E4044"}];function Hn(s){let e=s.mixed===!0,t=e?void 0:s.now?.toUpperCase(),o=t!==void 0&&!s.presets.some(n=>n.hex===t);return m`<div class="hme-r top"><span class="hme-l">${s.word}</span>
    <div class="hme-chips hme-colours" role="group" aria-label=${`${s.word} colour`}>
      <button type="button" class="hme-chip sel ${t===void 0&&!e?"on":""}" aria-pressed=${t===void 0&&!e?"true":"false"}
        title=${s.defaultTitle} @click=${()=>s.set(void 0)}>Default</button>
      ${s.presets.map(n=>m`<button type="button" class="hme-colour ${t===n.hex?"on":""}" style=${`--c:${n.hex}`}
        title=${n.name} aria-label=${`${s.word}: ${n.name}`} aria-pressed=${t===n.hex?"true":"false"} @click=${()=>s.set(n.hex)}></button>`)}
      <label class="hme-chip sel hme-pick ${o?"on":""}" title=${s.customTitle}>${o?m`<span class="hme-swatch" style=${`background:${t}`}></span>`:v}Custom
        ${wt({value:t??s.presets[0].hex,label:s.customLabel,preview:s.preview,set:s.set})}</label>
    </div></div>
    ${e?V(`Mixed: their ${s.word.toLowerCase()} colours differ. Pick one to set them all.`):v}`}var ho=15,Lr=[{a:0,c:0},{c:0},{a:1,c:0},{a:1},{a:1,c:1},{c:1},{a:0,c:1},{a:0}];function _r(s,e){let t=(Math.atan2(e,s)*180/Math.PI+180)%180;return["ew-resize","nwse-resize","ns-resize","nesw-resize"][Math.round(t/45)%4]}function Fr(s,e){let t=e===0?"":` Its ${R(e,"device")} come${e===1?"s":""} off the map too.`;return`${S(s)} comes off the map.${t} A scanned room comes back only by scanning it again on the iPhone. Undo brings it back while this page is open.`}function ae(s){return ht(s.model)?.name??bt(s.kind)}function Xa(s){let e=s.map(t=>ae(t.object));return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function mo(s){return s.kind==="lamp"||pt(s)?.kind==="lamp"}function Ya(s,e){let t=oe(s,e);return t.kind==="light"&&t.on}function Za(s,e){let t=so(e.sel,s.hover);return m`<div class="hme-ly ${e.picked?"on":""} ${t?"hov":""} ${e.hidden?"hid":""}"
    @pointerenter=${()=>s.setHover(e.sel)} @pointerleave=${()=>s.setHover(void 0)}>
    <button type="button" class="hme-ly-main" aria-pressed=${e.picked?"true":"false"} title=${e.title} @click=${e.pick}>
      ${e.icon}<span class="hme-ly-nm">${e.name}</span><span class="hme-ly-end">${e.end}</span></button>
    ${e.eye===void 0?v:m`<button type="button" class="hme-eye" aria-label=${`${e.hidden?"Show":"Hide"} ${e.name}`}
      title=${e.hidden?"Show it again on the map, the tiles and the watch":"Hide it on the map, the tiles and the watch; it stays listed here"}
      @click=${e.eye}>${zr(!e.hidden)}</button>`}
  </div>`}function zr(s){return m`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z" fill="none" stroke="currentColor" stroke-width="1.3"></path>
    ${s?k`<circle cx="8" cy="8" r="2" fill="currentColor"></circle>`:k`<path d="M2.5 13.5l11-11" stroke="currentColor" stroke-width="1.3"></path>`}</svg>`}function Qa(s){let e=s[0]?.room.id;return e!==void 0&&s.every(t=>M(t.room.id,e))?{kind:"room",roomId:e}:void 0}var jr=["fabric","wood"],$t=s=>s.map(e=>({roomId:e.room.id,object:e.index}));function Pn(s){return fi(pt(s))}function En(s,e,t){let o=ba(s,t).filter(a=>e===""||a.group===e);if(s.trim()!==""||e!=="")return[{title:e===""?"Found":e,pieces:o}];let n=[],i=t===void 0?[]:o.filter(a=>a.kind===t);i.length>0&&n.push({title:`${bt(t)} pieces`,pieces:i});for(let a of Le.groups){let r=o.filter(d=>d.group===a&&!i.includes(d));r.length>0&&n.push({title:a,pieces:r})}return n}function Nr(s){return Math.round(mi(s.turn)*10)/10}var N=s=>s.toFixed(1),ie=s=>`${s[0].toFixed(1)},${s[1].toFixed(1)}`,po=class{constructor(){this.draw=new io(xe);this.guides=[];this.dragging=!1;this.resizing=!1;this.pickerQuery="";this.pickerGroup="";this.pickerFocus=!1;this.thumbs=new Map;this.askedThumbs=new Set;this.thumbFrame=0}openPicker(e,t,o){this.picker=o===void 0?{roomId:t.id}:{roomId:t.id,index:o},this.pickerQuery="",this.pickerGroup="",this.pickerFocus=!0,e.redraw()}closePicker(e){this.picker=void 0,e.redraw()}get pickerOpen(){return this.picker!==void 0}thumb(e,t){let o=this.thumbs.get(t),n=e.furnitureBase;if(o!==void 0||n===void 0||this.askedThumbs.has(t))return o;this.askedThumbs.add(t),lo().then(i=>i.homeMapPieceThumb(n,t)).then(i=>{if(i===void 0||(this.thumbs.set(t,i),this.thumbFrame!==0))return;let a=typeof requestAnimationFrame=="function"?requestAnimationFrame:r=>setTimeout(r,16);this.thumbFrame=a(()=>{this.thumbFrame=0,e.redraw()})},()=>{})}piecePic(e,t,o){let n=t===void 0?void 0:this.thumb(e,t.id);return m`<span class="${o} ${n===void 0?"wait":""}">${n===void 0?v:m`<img src=${n} alt="" draggable="false" />`}</span>`}pickPiece(e,t){let o=this.picker,n=o===void 0?void 0:e.floor.rooms.find(d=>M(d.id,o.roomId));if(this.picker=void 0,o===void 0||n===void 0){e.redraw();return}let i=n.id;if(o.index!==void 0){let d=o.index;e.apply(l=>Oi(l,i,d,t),{select:{kind:"object",roomId:i,object:d}})||e.redraw();return}let a=U(n)??X(n),r=n.objects.length;e.apply(d=>Di(d,i,t,a),{select:{kind:"object",roomId:i,object:r}})||e.redraw()}sheet(e){let t=this.picker;if(t===void 0)return v;let o=e.floor.rooms.find(u=>M(u.id,t.roomId)),n=t.index===void 0?void 0:o?.objects[t.index];if(o===void 0||t.index!==void 0&&n===void 0)return this.picker=void 0,v;let i=n===void 0?void 0:pt(n),a=En(this.pickerQuery,this.pickerGroup,n?.kind),r=n===void 0?"Add furniture":"Change model",d=n===void 0?`To ${S(o)}, in its middle. Drag it into place once it is in.`:`${ae(n)} in ${S(o)} keeps its place, size and turn.`,l=u=>Le.pieces.filter(f=>u===""||f.group===u).length,h=["",...Le.groups],p=this.pickerFocus;return this.pickerFocus=!1,m`<div class="hme-scrim hme-sheet"
      @pointerdown=${u=>{u.target===u.currentTarget&&this.closePicker(e)}}
      @keydown=${u=>{u.stopPropagation(),u.key==="Escape"&&this.closePicker(e)}}>
      <div class="hme-fpick" role="dialog" aria-modal="true" aria-label=${r}>
        <header class="hme-fpick-head">
          <div class="hme-fpick-t"><strong>${r}</strong><span>${d}</span></div>
          <label class="hme-find hme-fpick-find"><span aria-hidden="true">⌕</span>
            <input type="search" placeholder="Find a piece: sofa, lamp, desk" aria-label="Find a piece" .value=${G(this.pickerQuery)}
              ${_e(u=>{p&&u instanceof HTMLInputElement&&setTimeout(()=>u.focus(),0)})}
              @input=${u=>{this.pickerQuery=u.target.value,e.redraw()}} /></label>
          <button type="button" class="hme-x hme-fpick-close" aria-label="Close" title="Close (Esc)" @click=${()=>this.closePicker(e)}>×</button>
        </header>
        <div class="hme-fpick-main">
          <nav class="hme-fpick-groups" aria-label="Groups">
            ${h.map(u=>m`<button type="button" class="hme-tool ${u===this.pickerGroup?"on":""}" aria-pressed=${u===this.pickerGroup?"true":"false"}
              @click=${()=>{this.pickerGroup=u,e.redraw()}}>${u===""?"All":u}<span class="n">${l(u)}</span></button>`)}
          </nav>
          <div class="hme-fpick-body">
            ${a.every(u=>u.pieces.length===0)?m`<p class="hme-empty-line">No piece by that name${this.pickerGroup===""?"":` in ${this.pickerGroup}`}.</p>`:v}
            ${a.filter(u=>u.pieces.length>0).map(u=>m`<section class="hme-fpick-sec">
              <div class="hme-h">${u.title}<span class="hme-h-end">${R(u.pieces.length,"piece")}</span></div>
              <div class="hme-fgrid">${u.pieces.map(f=>{let g=i?.id===f.id;return m`<button type="button" class="hme-fcard ${g?"on":""}" aria-pressed=${g?"true":"false"}
                  title=${`${n===void 0?"Add":"Use"} ${f.name}, ${Ke(f)}`} @click=${()=>this.pickPiece(e,f)}>
                  ${this.piecePic(e,f,"hme-fcard-pic")}
                  <span class="hme-fcard-name">${f.name}</span>
                  <span class="hme-fcard-size mono">${Ke(f)}</span>
                </button>`})}</div>
            </section>`)}
          </div>
        </div>
      </div>
    </div>`}stopDrag(e){this.guides=[],this.dragging=!1,this.resizing=!1,e.preview(void 0)}focus(e){let t=me(e.selection);return t===void 0?void 0:e.floor.rooms.find(o=>M(o.id,t))}pickedMany(e){if(e.selection?.kind==="objects")return ce(e.selection).flatMap(t=>{let o=e.floor.rooms.find(i=>M(i.id,t.roomId)),n=o?.objects[t.object];return o===void 0||n===void 0?[]:[{room:o,index:t.object,object:n}]})}picked(e){let t=e.selection;if(t?.kind!=="object")return;let o=this.focus(e),n=o?.objects[t.object];return o===void 0||n===void 0?void 0:{room:o,index:t.object,object:n}}thingUnder(e,t,o){return kn(e.floor,t,o)}pickThing(e,t,o){e.select({kind:"object",roomId:t.id,object:o})}overlay(e){if(this.draw.active)return this.draw.overlay(e);let t=this.focus(e),o=this.picked(e),n=this.pickedMany(e),i=[];for(let a of this.guides)i.push(this.guide(e,a));if(n!==void 0)for(let a of n){let r=he(le(a.object)).map(d=>ie(e.toScreen(d))).join(" ");i.push(k`<polygon class="hme-box" points=${r} fill="rgba(91,141,239,0.1)" stroke="#5b8def" stroke-width="2"
          stroke-dasharray=${a.object.hidden===!0?"5 4":"none"} pointer-events="none" />`)}else if(o!==void 0){let a=o.room.outline.map(d=>ie(e.toScreen(d))).join(" ");i.push(k`<polygon points=${a} fill="none" stroke="#5b8def" stroke-width="1" stroke-dasharray="4 4" opacity="0.5" pointer-events="none" />`);let r=o.object;i.push(this.box(e,he(le(r)),{width:r.size[0],depth:r.size[1]},"thing",r.hidden===!0))}else t!==void 0&&t.outline.length>=3&&i.push(this.box(e,Oa(t),oo(t),"room",!1));return i.length===0?v:k`${i}`}box(e,t,o,n,i){let a=t.map(y=>e.toScreen(y)),r=a.reduce((y,w)=>[y[0]+w[0]/4,y[1]+w[1]/4],[0,0]),d=y=>[(a[y][0]+a[(y+1)%4][0])/2,(a[y][1]+a[(y+1)%4][1])/2],l=y=>{let w=Math.max(Math.hypot(y[0]-r[0],y[1]-r[1]),1e-6);return[(y[0]-r[0])/w,(y[1]-r[1])/w]},h=[0,1,2,3].flatMap(y=>[a[y],d(y)]),p=[0,1,2,3].reduce((y,w)=>d(w)[1]<d(y)[1]?w:y,0),u=d(p),f=l(u),g=[u[0]+f[0]*44,u[1]+f[1]*44],c=[];for(let y of[[0,2],[1,3]]){let[w,H]=y,D=Math.abs(a[(w+1)%4][0]-a[w][0])>=Math.abs(a[(w+1)%4][1]-a[w][1])?l(d(w))[1]<=l(d(H))[1]?w:H:l(d(w))[0]<=l(d(H))[0]?w:H,z=a[D],O=a[(D+1)%4],K=l(d(D)),_=[z[0]+K[0]*20,z[1]+K[1]*20],I=[O[0]+K[0]*20,O[1]+K[1]*20],B=[(_[0]+I[0])/2,(_[1]+I[1])/2],To=D%2===0?o.width:o.depth,fe=[K[0]*5,K[1]*5];c.push(k`<path d=${`M${ie(_)}L${ie(I)}M${ie([_[0]-fe[0],_[1]-fe[1]])}L${ie([_[0]+fe[0],_[1]+fe[1]])}M${ie([I[0]-fe[0],I[1]-fe[1]])}L${ie([I[0]+fe[0],I[1]+fe[1]])}`}
        stroke="#5b8def" stroke-width="1.2" fill="none" />
        <g class="hme-tag"><rect x=${N(B[0]-26)} y=${N(B[1]-9)} width="52" height="18" rx="9" fill="#5b8def" />
        <text x=${N(B[0])} y=${N(B[1]+4)} fill="#fff" text-anchor="middle">${To.toFixed(2)} m</text></g>`)}let b=n==="room"?"Drag to resize the room. Shift keeps its proportions, Alt resizes it about its middle, Cmd or Ctrl stops it snapping.":"Drag to resize it. Shift keeps its proportions, Alt resizes it about its middle.";return k`<g class="hme-box">
      <polygon points=${a.map(ie).join(" ")} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray=${i?"5 4":"none"} />
      ${this.resizing||!this.dragging?c:v}
      ${this.dragging?v:k`
        <line x1=${N(u[0])} y1=${N(u[1])} x2=${N(g[0])} y2=${N(g[1])} stroke="#5b8def" stroke-width="1.6" />
        ${h.map((y,w)=>k`<rect data-hme="resize" data-handle=${w} x=${N(y[0]-5)} y=${N(y[1]-5)} width="10" height="10"
          fill="#fff" stroke="#5b8def" stroke-width="1.6" style=${`cursor:${_r(y[0]-r[0],y[1]-r[1])}`}>
          <title>${b}</title></rect>`)}
        <g data-hme="turn" style="cursor:grab" transform=${`translate(${ie(g)})`}>
          <title>${n==="room"?"Drag to turn the room. Hold Alt to turn it freely.":"Drag to turn it. Hold Alt to turn it freely."}</title>
          <circle r="9" fill="#5b8def" />
          <path d="M-4 0a4 4 0 1 0 1.5-3.1M-4-4.5v2.5h2.5" fill="none" stroke="#fff" stroke-width="1.3" />
        </g>`}
    </g>`}guide(e,t){let o=e.toScreen(t.a),n=e.toScreen(t.b),i=Math.max(Math.hypot(n[0]-o[0],n[1]-o[1]),1e-6),a=[(n[0]-o[0])/i,(n[1]-o[1])/i],r=[o[0]-a[0]*40,o[1]-a[1]*40],d=[n[0]+a[0]*40,n[1]+a[1]*40],l=e.floor.rooms.find(u=>M(u.id,t.roomId)),h=`Lined up with ${l===void 0?"a":S(l)} wall`,p=h.length*6.2+20;return k`<g class="hme-guide" pointer-events="none">
      <line x1=${N(r[0])} y1=${N(r[1])} x2=${N(d[0])} y2=${N(d[1])} stroke="#ff4fa3" stroke-width="1.2" stroke-dasharray="6 4" />
      <g class="hme-tag"><rect x=${N(d[0]+6)} y=${N(d[1]-10)} width=${N(p)} height="20" rx="10" fill="#ff4fa3" />
      <text x=${N(d[0]+6+p/2)} y=${N(d[1]+4)} fill="#fff" text-anchor="middle">${h}</text></g>
    </g>`}pointerDown(e,t,o){return this.draw.active?this.draw.pointerDown(e,t,o):t.button!==0?!1:this.pressHandle(e,t,o)||this.pressBody(e,t,o)}pressHandle(e,t,o){let n=t.target?.closest?.("[data-hme]"),i=n?.getAttribute("data-hme");if(i!=="turn"&&i!=="resize")return!1;let a=Lr[Number(n?.getAttribute("data-handle"))],r=this.picked(e),d=this.focus(e);if(r!==void 0){if(i==="turn")this.thingTurnDrag(e,t,r,o);else if(a!==void 0)this.thingResizeDrag(e,t,r,a,o);else return!1;return!0}if(d===void 0)return!1;if(i==="turn")this.turnDrag(e,t,d,o);else if(a!==void 0)this.resizeDrag(e,t,d,a,o);else return!1;return!0}pressThing(e,t,o,n){let i=e.floor.rooms.find(r=>M(r.id,o.roomId)),a=i?.objects[o.object];return i===void 0||a===void 0?!1:t.shiftKey||t.metaKey||t.ctrlKey?(e.select(ze(e.selection,{roomId:i.id,object:o.object})),!0):(this.pickThing(e,i,o.object),this.thingMoveDrag(e,t,{room:i,index:o.object,object:a},n),!0)}pressBody(e,t,o){let n=this.thingUnder(e,o,void 0);if(t.metaKey||t.ctrlKey)return n!==void 0&&e.select(ze(e.selection,{roomId:n.room.id,object:n.index})),n!==void 0||W(e.floor,o)!==void 0;if(n!==void 0)return this.pickThing(e,n.room,n.index),this.thingMoveDrag(e,t,n,o),!0;let i=W(e.floor,o);return i===void 0?!1:(e.select({kind:"room",roomId:i.id}),this.moveDrag(e,t,i,o),!0)}moveDrag(e,t,o,n){let i=e.doc,a=o.id,r=Ce(o.outline),d=[0,0];e.drag(t,{move:(l,h)=>{let p=l[0]-n[0],u=l[1]-n[1];if(e.toggles.grid&&r!==void 0){let f=xe;p=Math.round((r.minX+p)/f)*f-r.minX,u=Math.round((r.minY+u)/f)*f-r.minY}if(this.guides=[],e.toggles.snap&&!h.altKey){let f=bi(i,a,p,u);f!==void 0&&(p=f.dx,u=f.dy,this.guides=f.guides)}this.dragging=!0,d=[p,u],e.preview(f=>Be(f,a,p,u))},end:(l,h,p)=>{this.stopDrag(e);let[u,f]=d;p&&(Math.abs(u)>=.005||Math.abs(f)>=.005)&&e.apply(g=>Be(g,a,u,f),{select:{kind:"room",roomId:a}})},cancel:()=>this.stopDrag(e)})}resizeDrag(e,t,o,n,i){let a=yi(o);if(a===void 0)return;let r=e.doc,d=o.id,l=a.a1-a.a0,h=a.c1-a.c0;if(l<=1e-6||h<=1e-6)return;let p=c=>c[0]*a.u[0]+c[1]*a.u[1],u=c=>c[0]*a.v[0]+c[1]*a.v[1],f=c=>Math.min(Math.max(c,it),at),g;e.drag(t,{move:(c,b)=>{let y=b.altKey?2:1,w=l,H=h;if(n.a!==void 0&&(w=l+(p(c)-p(i))*(n.a===1?1:-1)*y),n.c!==void 0&&(H=h+(u(c)-u(i))*(n.c===1?1:-1)*y),e.toggles.grid){let O=xe;n.a!==void 0&&(w=Math.round(w/O)*O),n.c!==void 0&&(H=Math.round(H/O)*O)}if(w=f(w),H=f(H),b.shiftKey){let O=w/l,K=H/h,_=n.a===void 0?K:n.c===void 0||Math.abs(Math.log(O))>=Math.abs(Math.log(K))?O:K;_=Math.min(Math.max(_,it/Math.min(l,h)),at/Math.max(l,h)),w=l*_,H=h*_}let P=[b.altKey||n.a===void 0?.5:1-n.a,b.altKey||n.c===void 0?.5:1-n.c],D={width:w,depth:H,anchor:P};if(this.guides=[],e.toggles.snap&&!b.altKey&&!b.ctrlKey&&!b.metaKey){let O=ki(r,d,D,n,{proportional:b.shiftKey});O!==void 0&&(D=O.resize,this.guides=O.guides)}this.dragging=!0,this.resizing=!0,g=D;let z=D;e.preview(O=>rt(O,d,z))},end:(c,b,y)=>{this.stopDrag(e);let w=g;!y||w===void 0||Math.abs((w.width??l)-l)<.005&&Math.abs((w.depth??h)-h)<.005||e.apply(H=>rt(H,d,w),{select:{kind:"room",roomId:d}})},cancel:()=>this.stopDrag(e)})}turnDrag(e,t,o,n){let i=o.id,a=X(o),r=Math.atan2(n[1]-a[1],n[0]-a[0]),d=0;e.drag(t,{move:(l,h)=>{let p=(Math.atan2(l[1]-a[1],l[0]-a[0])-r)*180/Math.PI;p=(p+540)%360-180,h.altKey||(p=Math.round(p/ho)*ho),this.dragging=!0,d=p,e.preview(u=>Re(u,i,p,a))},end:(l,h,p)=>{this.stopDrag(e),p&&Math.abs(d)>.01&&e.apply(u=>Re(u,i,d,a),{select:{kind:"room",roomId:i}})},cancel:()=>this.stopDrag(e)})}thingMoveDrag(e,t,o,n){let{room:i,index:a,object:r}=o,d=i.id,l=r.c,h=l;e.drag(t,{move:(p,u)=>{let f=[l[0]+p[0]-n[0],l[1]+p[1]-n[1]];if(e.toggles.grid){let c=xe;f=[Math.round(f[0]/c)*c,Math.round(f[1]/c)*c]}if(this.guides=[],e.toggles.snap&&!u.altKey){let c=zi(i,r,f);f=c.c,this.guides=c.guides}this.dragging=!0,h=f;let g=f;e.preview(c=>We(c,d,a,g))},end:(p,u,f)=>{if(this.stopDrag(e),f&&Math.hypot(h[0]-l[0],h[1]-l[1])>=.005){let g=h;e.apply(c=>We(c,d,a,g),{select:{kind:"object",roomId:d,object:a}})}},cancel:()=>this.stopDrag(e)})}thingResizeDrag(e,t,o,n,i){let{room:a,index:r,object:d}=o,l=a.id,{u:h,v:p}=Fi(d),u=Math.max(d.size[0],Ge),f=Math.max(d.size[1],Ge),g=w=>w[0]*h[0]+w[1]*h[1],c=w=>w[0]*p[0]+w[1]*p[1],b=w=>Math.min(Math.max(w,Ge),Bt),y;e.drag(t,{move:(w,H)=>{let P=H.altKey?2:1,D=u,z=f;if(n.a!==void 0&&(D=u+(g(w)-g(i))*(n.a===1?1:-1)*P),n.c!==void 0&&(z=f+(c(w)-c(i))*(n.c===1?1:-1)*P),e.toggles.grid){let _=xe;n.a!==void 0&&(D=Math.round(D/_)*_),n.c!==void 0&&(z=Math.round(z/_)*_)}if(D=b(D),z=b(z),H.shiftKey){let _=D/u,I=z/f,B=n.a===void 0?I:n.c===void 0||Math.abs(Math.log(_))>=Math.abs(Math.log(I))?_:I;B=Math.min(Math.max(B,Ge/Math.min(u,f)),Bt/Math.max(u,f)),D=u*B,z=f*B}let O=[H.altKey||n.a===void 0?.5:1-n.a,H.altKey||n.c===void 0?.5:1-n.c];this.dragging=!0,this.resizing=!0;let K={width:D,depth:z,anchor:O};y=K,e.preview(_=>dt(_,l,r,K))},end:(w,H,P)=>{this.stopDrag(e);let D=y;!P||D===void 0||Math.abs((D.width??u)-d.size[0])<.005&&Math.abs((D.depth??f)-d.size[1])<.005||e.apply(z=>dt(z,l,r,D),{select:{kind:"object",roomId:l,object:r}})},cancel:()=>this.stopDrag(e)})}thingTurnDrag(e,t,o,n){let{room:i,index:a,object:r}=o,d=i.id,l=r.c,h=Math.atan2(n[1]-l[1],n[0]-l[0]),p=0;e.drag(t,{move:(u,f)=>{let g=(Math.atan2(u[1]-l[1],u[0]-l[0])-h)*180/Math.PI;g=(g+540)%360-180,f.altKey||(g=Math.round(g/ho)*ho),this.dragging=!0,p=-g;let c=p;e.preview(b=>Ie(b,d,a,c))},end:(u,f,g)=>{this.stopDrag(e);let c=p;g&&Math.abs(c)>.01&&e.apply(b=>Ie(b,d,a,c),{select:{kind:"object",roomId:d,object:a}})},cancel:()=>this.stopDrag(e)})}hover(e,t){this.draw.hover(e,t)}keyDown(e,t){if(this.draw.active)return this.draw.keyDown(e,t);let o=this.pickedMany(e);if(o!==void 0)return this.manyKeyDown(e,t,o);let n=this.focus(e);if(n===void 0)return!1;let i=te(t,!1),a=this.picked(e);if(a!==void 0){let{index:r,object:d}=a,l={kind:"room",roomId:n.id};if(i==="delete")return e.apply(h=>Nt(h,n.id,r),{select:l}),!0;if(i==="cancel")return e.select(l),!0;if(typeof i=="object"&&"nudge"in i){let[h,p]=i.nudge;return e.apply(u=>We(u,n.id,r,[d.c[0]+h,d.c[1]+p])),!0}return!1}if(i==="delete")return this.askDelete(e,n),!0;if(typeof i=="object"&&"nudge"in i){let[r,d]=i.nudge;return e.apply(l=>Be(l,n.id,r,d)),!0}return!1}manyKeyDown(e,t,o){let n=te(t,!1),i=$t(o);if(n==="delete")return this.askDeleteThings(e,o),!0;if(n==="cancel")return e.select(Qa(o)),!0;if(typeof n=="object"&&"nudge"in n){let[a,r]=n.nudge;return e.apply(d=>Li(d,i,a,r)),!0}return!1}async askDeleteThings(e,t){let o=$t(t);await e.confirm({title:`Delete ${R(t.length,"thing")}?`,text:`${Xa(t)} come off the map. Undo brings them back while this page is open.`,ok:"Delete",danger:!0})&&e.apply(i=>_i(i,o),{select:Qa(t)??null})}cursor(){return this.draw.active?"crosshair":void 0}leave(e){this.draw.stop(e),this.picker=void 0,this.guides=[],this.dragging=!1,this.resizing=!1}dock(e){return m`<button type="button" class="hme-tb ${e.toggles.snap?"on":""}" aria-pressed=${e.toggles.snap?"true":"false"}
        title="Snap to walls: a dragged room lines up with the walls round it. Hold Alt to move it freely." @click=${()=>e.setToggle("snap",!e.toggles.snap)}>Snap</button>`}viewItems(e){return[{label:"Grid 10 cm",on:e.toggles.grid,title:"Points land on a 10 cm grid, drawn on the plan",flip:()=>e.setToggle("grid",!e.toggles.grid)}]}pill(e){if(this.draw.active)return m`<span class="hme-pill-name">${this.draw.hint()}</span>
        ${this.draw.points.length>=3?m`<button type="button" class="hme-tb" @click=${()=>{this.draw.finish(e)}}>Close the room</button>`:v}
        <button type="button" class="hme-tb" @click=${()=>this.draw.stop(e)}>Cancel</button>`;let t=this.pickedMany(e);if(t!==void 0){let a=$t(t),r=t.some(d=>d.object.hidden!==!0);return m`<span class="hme-pill-name">${R(t.length,"thing")}</span>
        <button type="button" class="hme-tb" title=${r?"Hide every picked thing":"Show every picked thing"}
          @click=${()=>e.apply(d=>Kt(d,a,r))}>${r?"Hide":"Show"}</button>
        <button type="button" class="hme-tb danger" @click=${()=>{this.askDeleteThings(e,t)}}>Delete</button>`}let o=this.focus(e);if(o===void 0||this.dragging)return v;let n=o.id,i=this.picked(e);if(i!==void 0){let{index:a,object:r}=i;return m`<span class="hme-pill-name">${ae(r)}</span>
        <button type="button" class="hme-tb" @click=${()=>e.apply(d=>Ie(d,n,a,90))}>⟲ Turn 90°</button>
        <button type="button" class="hme-tb" title="Turn it square with the room's walls" @click=${()=>e.apply(d=>Wo(d,n,a))}>Line up</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(d=>jt(d,n,a,r.hidden!==!0))}>${r.hidden===!0?"Show":"Hide"}</button>
        <button type="button" class="hme-tb" @click=${()=>e.select({kind:"room",roomId:n})}>${S(o)} ›</button>
        <button type="button" class="hme-tb danger" @click=${()=>e.apply(d=>Nt(d,n,a),{select:{kind:"room",roomId:n}})}>Remove</button>`}return m`<span class="hme-pill-name">${S(o)}</span>
      <button type="button" class="hme-tb" @click=${()=>e.apply(a=>Re(a,n,90))}>⟲ Turn 90°</button>
      <button type="button" class="hme-tb" @click=${()=>e.apply(a=>ve(a,n))}>Square the corners</button>
      <button type="button" class="hme-tb" title="Turn it to the floor's walls and slide it onto the nearest wall line, as the iPhone does"
        @click=${()=>e.apply(a=>wi(a,n))}>Snap to walls</button>
      ${this.floorMenu(e,o,"Move to floor","hme-tb")}
      <button type="button" class="hme-tb danger" @click=${()=>{this.askDelete(e,o)}}>Delete</button>`}floorMenu(e,t,o,n){let i=e.doc.floors.filter(a=>!M(a.id,e.floor.id));return un({label:o,cls:n,options:[...i.map(a=>({value:a.id,label:j(a)})),{value:"new",label:"New floor\u2026"}],pick:a=>{this.moveToFloor(e,t,a)}})}async moveToFloor(e,t,o){let n=t.id,i={kind:"room",roomId:n};if(o!=="new"){e.apply(l=>Fo(l,n,{floorId:o}),{select:i,floorId:o});return}let a=Math.max(...e.doc.floors.map(l=>l.story))+1,r=await e.ask({title:"A new floor",label:"Name",value:a===1?"Upstairs":`Floor ${a+1}`,ok:"Move the room there"});if(r===void 0)return;let d=e.newId();e.apply(l=>Fo(l,n,{newFloor:{id:d,name:r,story:a}}),{select:i,floorId:d})}async askDelete(e,t){let o=_o(e.floor,t.id).length;await e.confirm({title:`Delete ${S(t)}?`,text:Fr(t,o),ok:"Delete room",danger:!0})&&e.apply(i=>Pi(i,t.id),{select:null})}inspector(e){let t=this.pickedMany(e);if(t!==void 0)return this.manyInspector(e,t);let o=this.focus(e);if(o===void 0)return this.floorCard(e,e.floor);let n=this.picked(e);if(n!==void 0)return this.thingInspector(e,n);let i=o.id,a=oo(o),r=Qn(e.floor,e.toggles.live?e.hass?.states:void 0).has(o.id),d=Ce(o.outline)??{minX:0,minY:0,maxX:0,maxY:0},l=Math.round(-gi(o)*10)/10,h=o.areaId===void 0||e.areas.some(c=>c.id===o.areaId),p=e.areas.find(c=>c.id===o.areaId)?.name,u=o.pageId===void 0||e.pages.some(c=>M(c.id,o.pageId)),f=pi(o),g=this.edits(e);return m`
      <section class="hme-card hme-head">
        ${Na(o,r)}
        <div class="hme-head-t">
          <strong>${S(o)}</strong>
          <span>${no(o)} · ${a.area.toFixed(1)} m²${p===void 0?"":` \xB7 ${p} area`}</span>
          <span>${j(e.floor)} · double-click to edit its walls</span>
        </div>
      </section>

      ${this.inRoomCard(e,o)}

      ${E("Room",m`
        ${L("Name",Je({value:o.name??"",label:"Name",placeholder:"Room",set:c=>e.apply(b=>Ei(b,i,c))}))}
        ${L("Area",Fe({label:"Area",value:o.areaId??"",options:[{value:"",label:"None"},...h?[]:[{value:o.areaId,label:`Not in Home Assistant (${o.areaId})`,disabled:!0}],...e.areas.map(c=>({value:c.id,label:c.name}))],set:c=>e.apply(b=>Ti(b,i,c===""?void 0:c))}))}
        ${V("The Home Assistant area. Add lists its devices first.")}
        ${L("Tap opens",Fe({label:"Tap opens",value:o.pageId??"",options:[{value:"",label:"Nothing"},...u?[]:[{value:o.pageId,label:"A page not in your library",disabled:!0}],...e.pages.map(c=>({value:c.id,label:`Page: ${c.name}`}))],set:c=>e.apply(b=>Ci(b,i,c===""?void 0:c))}))}
        ${V("What a tap on this room does on the map tiles and the watch.")}`)}

      ${E("Size",m`
        ${yt(F({tag:"W",label:"Width",value:a.width,unit:"m",min:it,max:at,...g((c,b)=>rt(c,i,{width:b}))}),F({tag:"D",label:"Depth",value:a.depth,unit:"m",min:it,max:at,...g((c,b)=>rt(c,i,{depth:b}))}),F({tag:"H",label:"Wall height",value:o.height,unit:"m",min:.5,max:20,...g((c,b)=>st(c,i,b))}))}
        <p class="hme-foot-hint">Along its own walls, about its middle; its doors, things and devices move with it.</p>`)}

      ${E("Place",m`
        ${kt("Corner",yt(F({tag:"X",label:"Left",value:d.minX,unit:"m",...g((c,b)=>Be(c,i,b-d.minX,0))}),F({tag:"Y",label:"Top",value:d.minY,unit:"m",...g((c,b)=>Be(c,i,0,b-d.minY))})))}
        ${kt("Turn",m`<div class="hme-turn">
          ${F({label:"Turn",value:l,unit:"\xB0",digits:1,min:-180,max:180,...g((c,b)=>Re(c,i,b-l))})}
          <button type="button" class="hme-tb" @click=${()=>e.apply(c=>Re(c,i,-90))}>−90°</button>
          <button type="button" class="hme-tb" @click=${()=>e.apply(c=>Re(c,i,90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it so its longest wall runs straight across or down" @click=${()=>e.apply(c=>vi(c,i))}>Level</button>
        </div>`)}
        <p class="hme-foot-hint">Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the room to move it, a square handle to resize it, the round one to turn it.</p>
        ${L("Floor",Fe({label:"Floor",value:e.floor.id,options:[...e.doc.floors.map(c=>({value:c.id,label:j(c)})),{value:"new",label:"New floor\u2026"}],set:c=>{this.moveToFloor(e,o,c)}}))}`)}

      ${E("Floor finish",m`<div class="hme-pics">
        ${Q({label:`Auto: ${qa[f]}`,picture:fn(f),on:o.finish===void 0,title:"Picked from the room's name and furniture",click:()=>e.apply(c=>zo(c,i,void 0))})}
        ${Gn.map(c=>Q({label:qa[c],picture:fn(c),on:o.finish===c,click:()=>e.apply(b=>zo(b,i,c))}))}
      </div>
        ${this.roomColourRow(e,o,"floorColor")}
        ${this.roomColourRow(e,o,"wallColor")}
        <p class="hme-foot-hint">On the plan, the night, warm and clay looks and in 3D, here, on the iPhone and on the watch. The line looks keep their own colour.</p>`)}

      ${E("Walls and more",m`
        <div class="hme-r tight"><span class="hme-grow">${o.openings.length===0?"No doors or windows":[...new Set(o.openings.map($e))].join(", ")}</span>
          <button type="button" class="hme-link" title="Edit this room's corners, walls, doors and windows (or double-click the room)"
            @click=${()=>e.editWalls(i)}>Edit walls ›</button></div>
        <div class="hme-row-end">
          ${un({label:"\uFF0B Add a plain box",cls:"hme-tb",options:Si.map(c=>({value:c,label:bt(c)})),pick:c=>{let b=U(o)??X(o);e.apply(y=>Ri(y,i,c,b))}})}
          <button type="button" class="hme-tb danger push" @click=${()=>{this.askDelete(e,o)}}>Delete room</button>
        </div>`)}`}inRoomCard(e,t){let o=e.floor,n=e.toggles.live?e.hass?.states:void 0,i=e.selection,a=t.id,r=[],d=[];t.objects.forEach((c,b)=>{let y={roomId:a,object:b},w=ae(c),H=c.hidden===!0,P=Xe(o,a,b),D=mo(c)||P!==void 0&&P.entityId.startsWith("light."),z=Za(e,{sel:{kind:"object",...y},picked:Ba(i,a,b),hidden:H,icon:D?m`<span class="hme-ly-lamp ${P!==void 0&&Ya(P.entityId,n)?"lit":""}" aria-hidden="true"></span>`:m`<span class="hme-thing-ic" aria-hidden="true"></span>`,name:w,end:H?"hidden":P!==void 0?`${Y(P,e.hass)} \xB7 ${J(P.entityId,n)}`:D?"no light":`${c.size[0].toFixed(1)} \xD7 ${c.size[1].toFixed(1)}`,title:"Pick it to move, resize or turn it. Cmd or Ctrl and a click picks several.",pick:O=>e.select(O.metaKey||O.ctrlKey?ze(e.selection,y):{kind:"object",...y}),eye:()=>e.apply(O=>jt(O,a,b,!H))});(D?r:d).push(z)});let l=_o(o,a).filter(c=>Z(o,c.id)===void 0),h=c=>Za(e,{sel:{kind:"pin",pinId:c.id},picked:ye(i).some(b=>M(b,c.id)),hidden:!1,icon:m`<span class="hme-dot dev ${Ya(c.entityId,n)||!c.entityId.startsWith("light.")?"":"off"}" aria-hidden="true"></span>`,name:Y(c,e.hass),end:c.entityId.startsWith("light.")?`${J(c.entityId,n)} \xB7 in no lamp`:J(c.entityId,n),title:"Pick it to set its height, glow and tap. Shift, Cmd or Ctrl and a click picks several.",pick:b=>e.select(b.shiftKey||b.metaKey||b.ctrlKey?Oe(e.selection,c.id):{kind:"pin",pinId:c.id})}),p=l.filter(c=>c.entityId.startsWith("light.")).map(h),u=l.filter(c=>!c.entityId.startsWith("light.")).map(h),f=r.length+p.length+d.length+u.length,g=(c,b)=>b.length===0?v:m`<div class="hme-ly-grp">${c}</div>${b}`;return E("In this room",m`<div class="hme-ly-list">
        ${f===0?m`<p class="hme-empty-line">Nothing in it yet. Add furniture and devices so the map reads.</p>`:v}
        ${g("Lamps and lights",[...r,...p])}
        ${g("Furniture",d)}
        ${g("Devices",u)}
      </div>
      <button type="button" class="hme-tb hme-wide" title="Add devices or furniture to this room" @click=${()=>e.openAdd()}>＋ Add to ${S(t)}</button>`,String(f),"hme-inroom")}edits(e){return t=>({set:o=>e.apply(n=>t(n,o)),preview:o=>e.preview(o===void 0?void 0:n=>t(n,o))})}thingInspector(e,t){let{room:o,index:n,object:i}=t,a=o.id,r=ae(i),[d,l,h]=i.size,p=Nr(i),u=this.edits(e),f={kind:"room",roomId:a},g={unit:"m",min:Ge,max:Bt};return m`
      <section class="hme-card hme-head">
        <div class="hme-head-t">
          <strong>${r}</strong>
          <span>In ${S(o)} · ${d.toFixed(2)} × ${l.toFixed(2)} × ${h.toFixed(2)} m${(i.lift??0)>0?` \xB7 ${(i.lift??0).toFixed(2)} m up`:""}${i.hidden===!0?" \xB7 Hidden":""}</span>
        </div>
      </section>

      ${this.modelCard(e,t)}

      ${this.coloursCard(e,t)}

      ${E("Size",m`
        ${yt(F({tag:"W",label:"Width",value:d,...g,...u((c,b)=>dt(c,a,n,{width:b}))}),F({tag:"D",label:"Depth",value:l,...g,...u((c,b)=>dt(c,a,n,{depth:b}))}),F({tag:"H",label:"Height",value:h,...g,min:.01,...u((c,b)=>No(c,a,n,{size:[d,l,b]}))}))}`)}

      ${E("Place",m`
        ${kt("Middle, and up off the floor",yt(F({tag:"X",label:"Middle across",value:i.c[0],unit:"m",...u((c,b)=>We(c,a,n,[b,i.c[1]]))}),F({tag:"Y",label:"Middle down",value:i.c[1],unit:"m",...u((c,b)=>We(c,a,n,[i.c[0],b]))}),F({tag:"Z",label:"Up off the floor",value:i.lift??0,unit:"m",min:0,max:100,...u((c,b)=>No(c,a,n,{lift:b}))})))}
        ${kt("Turn",m`<div class="hme-turn">
          ${F({label:"Turn",value:p,unit:"\xB0",digits:1,min:-180,max:180,...u((c,b)=>Ie(c,a,n,b-p))})}
          <button type="button" class="hme-tb" title="Turn it a quarter one way" @click=${()=>e.apply(c=>Ie(c,a,n,-90))}>−90°</button>
          <button type="button" class="hme-tb" title="Turn it a quarter the other way" @click=${()=>e.apply(c=>Ie(c,a,n,90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it square with the room's walls" @click=${()=>e.apply(c=>Wo(c,a,n))}>Line up</button>
        </div>`)}
        <p class="hme-foot-hint">Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the thing to move it, a square handle to resize it, the round one to turn it.</p>`)}

      ${E("Show",m`
        <div class="hme-r tight"><span class="hme-grow">On the map, the tiles and the watch</span>
          ${Mt({on:i.hidden!==!0,onText:"Shown",offText:"Hidden",label:`${r} shown`,click:()=>e.apply(c=>jt(c,a,n,i.hidden!==!0))})}</div>
        <p class="hme-foot-hint">Scan Again on the iPhone puts the room's things back where the scan finds them. A hidden thing stays hidden.</p>
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${()=>e.select(f)}>‹ ${S(o)}</button>
          <button type="button" class="hme-tb danger push" @click=${()=>e.apply(c=>Nt(c,a,n),{select:f})}>Remove</button>
        </div>`)}`}manyInspector(e,t){let o=$t(t),n=[...new Set(t.map(r=>S(r.room)))],i=ne(t.map(r=>r.object.hidden===!0)),a=jr.filter(r=>t.some(d=>Pn(d.object).includes(r)));return m`
      <section class="hme-card hme-head">
        <div class="hme-head-t">
          <strong>${R(t.length,"thing")}</strong>
          <span>${Xa(t)} · in ${n.join(", ")}</span>
        </div>
      </section>

      ${E("Picked",m`${t.map(r=>m`<div class="hme-list-row hme-pick-row">
          <button type="button" class="hme-grow hme-link ${r.object.hidden===!0?"dim":""}" title="Pick this one alone"
            @click=${()=>this.pickThing(e,r.room,r.index)}>${ae(r.object)}</button>
          <span class="hme-val">${S(r.room)}</span>
          <button type="button" class="hme-x" aria-label=${`Leave ${ae(r.object)} out of the pick`} title="Leave it out of the pick"
            @click=${()=>e.select(ze(e.selection,{roomId:r.room.id,object:r.index}))}>×</button></div>`)}
        <p class="hme-foot-hint">Cmd or Ctrl and a click on the plan or in 3D adds a thing or takes one away. The arrow keys move them all.</p>`,String(t.length))}

      ${a.length===0?v:E("Colours",m`
        ${a.map(r=>this.manyColourRow(e,t,r))}
        <p class="hme-foot-hint">Set on every picked thing whose piece has that part. In the 3D view and on the iPhone.</p>`)}

      ${E("Show",m`
        <div class="hme-r tight"><span class="hme-grow">On the map, the tiles and the watch</span>
          ${i.mixed?m`<button type="button" class="hme-chip off" aria-pressed="mixed" aria-label="Shown" title="Some are hidden: show them all"
                @click=${()=>e.apply(r=>Kt(r,o,!1))}>Mixed</button>`:Mt({on:!i.value,onText:"Shown",offText:"Hidden",label:"Shown",click:()=>e.apply(r=>Kt(r,o,!i.value))})}</div>
        <div class="hme-row-end">
          <button type="button" class="hme-tb danger push" @click=${()=>{this.askDeleteThings(e,t)}}>Delete ${R(t.length,"thing")}</button>
        </div>`)}`}manyColourRow(e,t,o){let n=t.filter(r=>Pn(r.object).includes(o)),i=$t(n),a=ne(n.map(r=>r.object[o]?.toUpperCase()));return Hn({word:o==="fabric"?"Fabric":"Wood",presets:o==="fabric"?rn:sn,now:a.mixed?void 0:a.value,mixed:a.mixed,defaultTitle:"Each model's own colour",customTitle:`Any ${o} colour`,customLabel:`Pick a ${o} colour for every picked thing`,set:r=>e.apply(d=>Bo(d,i,o,r)),preview:r=>e.preview(r===void 0?void 0:d=>Bo(d,i,o,r)??d)})}modelCard(e,t){let{room:o,index:n,object:i}=t,a=pt(i),r=ht(i.model),d=r!==void 0?`${r.group}, picked from the catalog`:i.model!==void 0?a===void 0?"A piece this panel does not know yet":`A piece this panel does not know yet, drawn as the ${a.name.toLowerCase()} meanwhile`:a!==void 0?`Picked by its kind: ${bt(i.kind)}`:"A plain box, as the scan found it";return E("Model",m`<div class="hme-model">
        ${this.piecePic(e,a,"hme-model-pic")}
        <div class="hme-model-t"><strong>${a?.name??"Plain box"}</strong><span>${d}</span></div>
        <button type="button" class="hme-tb push" title="Pick another piece from the furniture catalog; it keeps its place, size and turn"
          @click=${()=>this.openPicker(e,o,n)}>Change…</button>
      </div>
      <p class="hme-foot-hint">What it looks like in the 3D view and on the iPhone. The flat plan and the tiles draw it as before.</p>`)}coloursCard(e,t){let o=Pn(t.object);return o.length===0?v:E("Colours",m`
      ${o.map(n=>this.colourRow(e,t,n))}
      <p class="hme-foot-hint">In the 3D view and on the iPhone. The flat plan, the tiles and the furniture picker keep the model's own colours.</p>`)}colourRow(e,t,o){let{room:n,index:i,object:a}=t,r=n.id;return Hn({word:o==="fabric"?"Fabric":"Wood",presets:o==="fabric"?rn:sn,now:a[o],defaultTitle:"The model's own colour",customTitle:`Any ${o} colour`,customLabel:`Pick a ${o} colour`,set:l=>e.apply(h=>Ko(h,r,i,o,l)),preview:l=>e.preview(l===void 0?void 0:h=>Ko(h,r,i,o,l)??h)})}roomColourRow(e,t,o){let n=t.id,i=o==="floorColor";return Hn({word:i?"Floor":"Walls",presets:i?Ar[Lt(t)]:Or,now:t[o],defaultTitle:i?"The finish's own colour":"The look's own wall colour",customTitle:i?"Any floor colour":"Any wall colour",customLabel:i?"Pick a floor colour":"Pick a wall colour",set:a=>e.apply(r=>jo(r,n,o,a)),preview:a=>e.preview(a===void 0?void 0:r=>jo(r,n,o,a)??r)})}floorCard(e,t){let o=Ct(t,e.toggles.live?e.hass?.states:void 0),n=t.rooms.reduce((i,a)=>i+a.objects.length,0);return E("Floor",m`
      ${L("Name",Je({value:t.name,label:"Floor name",placeholder:j(t),set:i=>e.apply(a=>zt(a,t.id,i))}))}
      ${L("On it",m`<span class="hme-val">${R(t.rooms.length,"room")} · ${R(n,"thing")} · ${R(t.pins.length,"device")} · ${St(o)}</span>`)}`)}};var co=Math.PI/4,Tn=8,Pe="#ffbf55",x=s=>s.toFixed(1);function Kr(s,e){return`${ca(s.domain)} \xB7 ${J(s.entityId,e)}`}function Br(s,e){let t=se(s,e);if(t===void 0)return"Not in a room";let o=W(s,e.at);return o!==void 0&&M(o.id,t.id)?`${S(t)} (found by place)`:S(t)}function Wr(s,e,t){return s.icon!==void 0?to[s.icon]:`Auto (${to[pe(s.entityId,e,t)].toLowerCase()})`}var Ja={ceiling:"Ceiling",floor:"Floor",table:"Table",wall:"Wall",bulb:"Just a bulb"},nr="wa-home-map-lamp-choice";function ir(){try{return globalThis.localStorage??void 0}catch{return}}function Gr(){try{let s=ir()?.getItem(nr);return Ft.includes(s)?s:void 0}catch{return}}function Ur(s){try{ir()?.setItem(nr,s)}catch{}}var je=s=>s.startsWith("light."),Vr=16,uo=class{constructor(e){this.picture=e;this.side=!0;this.names=!1;this.moving=!1;this.iconsOpen=!1;this.pickPage=!1;this.chooserFocus=!1}states(e){return e.toggles.live?e.hass?.states:void 0}picked(e){let t=e.selection;return t?.kind==="pin"?e.floor.pins.find(o=>M(o.id,t.pinId)):void 0}picks(e){return ye(e.selection).flatMap(t=>e.floor.pins.filter(o=>M(o.id,t)))}deviceClass(e,t){let o=e.hass?.states?.[t]?.attributes?.device_class;return typeof o=="string"?o:void 0}friendly(e,t){let o=e.hass?.states?.[t]?.attributes?.friendly_name;return typeof o=="string"&&o.trim()!==""?o.trim():void 0}place(e,t,o,n){let i=Ae(e.doc,t);if(i!==void 0)return M(i.floorId,e.floor.id)||e.setFloor(i.floorId),e.select({kind:"pin",pinId:i.pinId}),!1;let a=an(e.floor,n),r=o??(a===void 0?Me(e.view,[e.stage.width/2,e.stage.height/2]):U(a)??X(a)),d=e.newId().toUpperCase(),l=e.floor.id,h=this.friendly(e,t),p=e.apply(u=>qi(u,l,{id:d,entityId:t,at:[r[0],r[1]],...h===void 0?{}:{name:h}}),{select:{kind:"pin",pinId:d}});return p||e.note("warn","That device could not be put on the map: the map holds at most 400 devices."),p}deviceRow(e,t,o){let n=je(t.entityId),i=n?void 0:Ae(e.doc,t.entityId),a=n?Yt(e.doc,t.entityId).length:0,r=pe(t.entityId,t.deviceClass,t.name),d=()=>n?this.addLight(e,t.entityId,void 0,t.areaId):this.place(e,t.entityId,void 0,t.areaId),l=n?"Drag onto the plan or onto a lamp, or click to add it in its area's room. A light can be on the map many times.":i===void 0?"Drag onto the plan, or click to put it in its area's room":"On the map: click to pick it";return m`<div class="hme-dv ${this.dragging===t.entityId?"dragging":""} ${i===void 0?"":"placed"}" role="button" tabindex="0"
      draggable=${i===void 0?"true":"false"} title=${l}
      @dragstart=${h=>{h.dataTransfer?.setData(Jt,t.entityId),n&&h.dataTransfer?.setData(Jo,t.entityId),h.dataTransfer?.setData("text/plain",t.entityId),h.dataTransfer&&(h.dataTransfer.effectAllowed="copy"),this.dragging=t.entityId,e.redraw()}}
      @dragend=${()=>{this.dragging=void 0,this.dropAt=void 0,this.lampOver=void 0,e.redraw()}}
      @click=${d}
      @keydown=${h=>{h.target===h.currentTarget&&(h.key==="Enter"||h.key===" ")&&(h.preventDefault(),d())}}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${ee(r,"currentColor",24,2)}</svg></span>
      <span class="hme-dv-nm">${t.name}<small>${i===void 0?Kr(t,o):"on the map"}</small></span>
      ${a===0?v:m`<button type="button" class="hme-dv-count" title="Pick the next one on the map"
        @click=${h=>{h.stopPropagation(),this.pickNext(e,t.entityId)}}
        @keydown=${h=>h.stopPropagation()}>${a} on map</button>`}
      <span class="hme-dv-grip" aria-hidden="true">${i===void 0?"\u22EE\u22EE":"\u203A"}</span>
    </div>`}pickNext(e,t){let o=e.doc.floors.flatMap(l=>l.pins.filter(h=>h.entityId===t).map(h=>({floor:l,pin:h})));if(o.length===0)return;let n=e.selection,i=n?.kind==="pin"?n.pinId:n?.kind==="object"?Xe(e.floor,n.roomId,n.object)?.id:void 0,a=i===void 0?-1:o.findIndex(l=>M(l.pin.id,i)),r=o[(a+1)%o.length];M(r.floor.id,e.floor.id)||e.setFloor(r.floor.id);let d=Z(r.floor,r.pin.id);e.select(d===void 0?{kind:"pin",pinId:r.pin.id}:{kind:"object",roomId:d.roomId,object:d.object})}addLight(e,t,o,n){let i=o===void 0?an(e.floor,n??la(e.hass,t)):void 0,a=o??(i===void 0?Me(e.view,[e.stage.width/2,e.stage.height/2]):U(i)??X(i)),r=W(e.floor,a)??i,d=Gr();this.chooser={entityId:t,at:[a[0],a[1]],roomId:r?.id,choice:r===void 0?"bulb":d??"ceiling"},this.chooserFocus=!0,e.redraw()}get choosing(){return this.chooser!==void 0}cancelChooser(e){this.chooser=void 0,e.redraw()}canChoose(e){return e==="bulb"||this.chooser?.roomId!==void 0}takeChoice(e,t){let o=this.chooser;if(o===void 0)return;let n=t??o.choice;if(!this.canChoose(n))return;this.chooser=void 0,Ur(n);let i=e.newId().toUpperCase(),a=e.floor.id,r=o.roomId===void 0?void 0:e.doc.floors.find(p=>M(p.id,a))?.rooms.find(p=>M(p.id,o.roomId)),d=this.friendly(e,o.entityId),l=n!=="bulb"&&r!==void 0?{kind:"object",roomId:r.id,object:r.objects.length}:{kind:"pin",pinId:i};e.apply(p=>Ji(p,a,o.roomId,o.entityId,n,o.at,i,d)?.doc,{select:l})||e.note("warn","That light could not be put on the map: the map holds at most 400 devices, and a room at most 256 things.")}chooserKey(e,t){let o=this.chooser;if(o===void 0)return!1;switch(t.key){case"Enter":return this.takeChoice(e),!0;case"Escape":return this.cancelChooser(e),!0;case"ArrowLeft":case"ArrowUp":case"ArrowRight":case"ArrowDown":{let n=Ft.filter(a=>this.canChoose(a)),i=t.key==="ArrowLeft"||t.key==="ArrowUp"?-1:1;return o.choice=n[(n.indexOf(o.choice)+i+n.length)%n.length]??o.choice,this.chooserFocus=!0,e.redraw(),!0}case"Delete":case"Backspace":return!0;default:return!1}}lampChooser(e){let t=this.chooser;if(t===void 0)return v;let o=e.toScreen(t.at),n=e.toScreen(e.toPlan(0,0)),i=o[0]-n[0],a=o[1]-n[1],r=344,d=globalThis.innerWidth??1/0,l=i+22+r>d?Math.max(8,i-22-r):i+22,h=t.roomId===void 0?void 0:e.floor.rooms.find(f=>M(f.id,t.roomId)),p=this.chooserFocus;this.chooserFocus=!1;let u=this.friendly(e,t.entityId)??t.entityId;return m`<div class="hme-scrim hme-lamp-scrim" @pointerdown=${f=>{f.target===f.currentTarget&&this.cancelChooser(e)}}>
      <div class="hme-lampc" role="dialog" aria-label="Which lamp is it in?" style=${`left:${Math.round(l)}px;top:${Math.round(Math.max(8,a-64))}px;width:${r}px`}
        @keydown=${f=>{this.chooserKey(e,f)&&(f.preventDefault(),f.stopPropagation())}}>
        <div class="hme-lampc-t"><strong>${u}</strong>
          <span>${h===void 0?"In no room, so just a bulb.":`In ${S(h)}. Which lamp is it in?`}</span></div>
        <div class="hme-lampc-row" role="group" aria-label="Lamp">
          ${Ft.map(f=>{let g=f===t.choice,c=this.canChoose(f),b=ui[f];return m`<button type="button" class="hme-lampc-b ${g?"on":""}" aria-pressed=${g?"true":"false"} ?disabled=${!c}
              title=${c?Ja[f]:"A lamp goes in a room"}
              ${_e(y=>{p&&g&&y!==void 0&&setTimeout(()=>y.focus?.(),0)})}
              @click=${()=>this.takeChoice(e,f)}>
              ${b===void 0||this.picture===void 0?m`<span class="hme-lampc-pic bulb"><svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">${ee("bulb","currentColor",24,1.8)}</svg></span>`:this.picture(e,b,"hme-lampc-pic")}
              <span>${Ja[f]}</span></button>`})}
        </div>
        <p class="hme-lampc-hint">Enter takes the ringed one · Esc cancels</p>
      </div>
    </div>`}emptyThingAt(e,t,o,n=e.floor){let i=e.toScreen(t),a;for(let r of n.rooms)r.objects.forEach((d,l)=>{if(d.hidden===!0||(o?Lo(d.model)===void 0:d.kind==="rug")||Xe(n,r.id,l)!==void 0)return;let h=e.toScreen(d.c),p=Math.hypot(h[0]-i[0],h[1]-i[1]);p>Vr&&!de(he(le(d)),t)||(a===void 0||p<a.d)&&(a={ref:{roomId:r.id,object:l},d:p})});return a?.ref}heldThingAt(e,t){let o=this.pinAt(e,e.toScreen(t));return o===void 0?void 0:Z(e.floor,o.id)}lampMark(e,t){let o=e.floor.rooms.find(l=>M(l.id,t.roomId))?.objects[t.object];if(o===void 0)return v;let n=he(le(o)).map(l=>e.toScreen(l).map(x).join(",")).join(" "),[i,a]=e.toScreen(o.c),r=mo(o)?"Put it in this lamp":`Put it on this ${ae(o)}`,d=r.length*6.4+20;return k`<g class="hme-lamp-over" pointer-events="none">
      <circle cx=${x(i)} cy=${x(a)} r="22" fill="rgba(255,191,85,0.22)" stroke=${Pe} stroke-width="2" stroke-dasharray="4 3" />
      <polygon points=${n} fill="rgba(255,191,85,0.3)" stroke=${Pe} stroke-width="2" />
      <g class="hme-tag"><rect x=${x(i-d/2)} y=${x(a+28)} width=${x(d)} height="18" rx="9" fill=${Pe} />
        <text x=${x(i)} y=${x(a+41)} fill="#3a2600" text-anchor="middle">${r}</text></g>
    </g>`}dragOver(e,t,o){let n=[...o.dataTransfer?.types??[]],i=this.dragging!==void 0||n.includes(Jt),a=this.dragging!==void 0?je(this.dragging):n.includes(Jo),r=this.dropAt,d=this.lampOver;return this.dropAt=i?t:void 0,this.lampOver=i&&t!==void 0?this.emptyThingAt(e,t,a):void 0,(r!==this.dropAt||JSON.stringify(d)!==JSON.stringify(this.lampOver))&&e.redraw(),i&&t!==void 0}drop(e,t,o){let n=this.dragging??o.dataTransfer?.getData(Jt)??"";if(this.dragging=void 0,this.dropAt=void 0,this.lampOver=void 0,n===""){e.redraw();return}let i=je(n),a=this.emptyThingAt(e,t,i);if(a===void 0){i?this.addLight(e,n,t):this.place(e,n,t);return}this.putOn(e,a,n)}putOn(e,t,o){let n=e.floor.id,i=je(o)?void 0:Ae(e.doc,o),a={select:{kind:"object",...t}};if(i!==void 0)return M(i.floorId,n)?e.apply(l=>Zt(l,n,t.roomId,t.object,i.pinId),a):(e.note("warn","That device is on another floor's map. Remove it there first to put it here."),!1);let r=e.newId().toUpperCase(),d=e.apply(l=>ta(l,n,t.roomId,t.object,o,r),a);return d||e.note("warn","That device could not be put on it: the map holds at most 400 devices."),d}overlay(e){let t=this.states(e),o=this.picked(e),n=ye(e.selection),i=[],a=this.lampOver===void 0?v:this.lampMark(e,this.lampOver);a!==v?i.push(a):this.dropAt!==void 0&&i.push(this.dropMark(e,this.dropAt));let r=o===void 0?void 0:oe(o.entityId,t);o!==void 0&&r?.kind==="light"&&i.push(this.glowRing(e,o,r.on?r.brightness:void 0));for(let d of e.floor.pins){let l=n.some(h=>M(d.id,h));i.push(this.pinMark(e,d,l,!1,t))}return this.box!==void 0&&i.push(this.boxMark(e,this.box)),k`${i}`}boxMark(e,t){let[o,n]=e.toScreen(t.a),[i,a]=e.toScreen(t.b);return k`<rect class="hme-box" x=${x(Math.min(o,i))} y=${x(Math.min(n,a))} width=${x(Math.abs(i-o))} height=${x(Math.abs(a-n))}
      fill="rgba(91,141,239,0.12)" stroke="#5b8def" stroke-width="1.2" stroke-dasharray="4 3" pointer-events="none" />`}pinMark(e,t,o,n,i){let[a,r]=e.toScreen(t.at),d=oe(t.entityId,i),l=d.kind==="light"&&d.on,h=l?Ye(t)??Pe:"rgba(36,36,40,0.92)",p=l?"#fff3d6":d.kind==="gone"?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.4)",u=l?"#3a2600":d.kind==="lock"?d.locked?"#30d158":"#ff9f0a":d.kind==="other"&&d.on?"#ffffff":d.kind==="gone"?"#8e8e93":"#d1d1d6",f=t.icon??pe(t.entityId,this.deviceClass(e,t.entityId),this.friendly(e,t.entityId)),g=o?13:12,c=o||this.names?Y(t,e.hass):$a(t,i),b=c===void 0?0:c.length*5.9+14;return k`<g class="hme-pin" data-hme="pin" data-pin=${t.id} transform=${`translate(${x(a)} ${x(r)})`} opacity=${n?.25:1} style="cursor:grab">
      ${o?k`<circle r="20" fill="none" stroke="#5b8def" stroke-width="2.5" />`:v}
      ${l?k`<circle r=${g+7} fill=${h} opacity="0.22" />`:v}
      <circle r=${g} fill=${h} stroke=${p} stroke-width="1.2" />
      <g transform="translate(-7 -7)">${ee(f,u,14,1.5)}</g>
      ${c===void 0||c===""?v:k`<g pointer-events="none"><rect x=${x(-b/2)} y=${g+4} width=${x(b)} height="16" rx="8" fill=${o?"#5b8def":"rgba(0,0,0,0.7)"} />
        <text y=${g+15.5} fill="#fff" font-size="10" font-weight="600" text-anchor="middle">${c}</text></g>`}
    </g>`}glowRing(e,t,o){let[n,i]=e.toScreen(t.at),a=mt(t,o),r=e.px(a),d=[n+r*Math.cos(co),i+r*Math.sin(co)],l=`Glow ${a.toFixed(1)} m`,h=l.length*6.2+18,p=t.glowSpill===!0?void 0:se(e.floor,t),u=p!==void 0&&p.outline.length>=3?p.outline.map(g=>e.toScreen(g).map(x).join(",")).join(" "):void 0,f=g=>k`<circle cx=${x(n)} cy=${x(i)} r=${x(r)} fill="none" stroke=${Ye(t)??"#5b8def"} stroke-width="1.4"
      stroke-dasharray="5 5" opacity=${g} pointer-events="none" />`;return k`<g class="hme-glow-ring">
      ${u===void 0?f(1):k`<clipPath id="hme-glow-walls"><polygon points=${u} /></clipPath>
        ${f(.28)}<g clip-path="url(#hme-glow-walls)">${f(1)}</g>`}
      <circle data-hme="glow" cx=${x(d[0])} cy=${x(d[1])} r="7" fill="#fff" stroke="#5b8def" stroke-width="2" style="cursor:nwse-resize">
        <title>Drag to set how far this light's glow reaches</title></circle>
      <g class="hme-tag" pointer-events="none"><rect x=${x(d[0]-h/2)} y=${x(d[1]+12)} width=${x(h)} height="18" rx="9" fill="#5b8def" />
        <text x=${x(d[0])} y=${x(d[1]+25)} fill="#fff" text-anchor="middle">${l}</text></g>
    </g>`}dropMark(e,t){let o=W(e.floor,t),[n,i]=e.toScreen(t),a=o===void 0?"Drop here, in no room":`Drop in ${S(o)}`,r=a.length*6.4+20;return k`<g class="hme-drop" pointer-events="none">
      ${o===void 0?v:k`<polygon points=${o.outline.map(d=>e.toScreen(d).map(x).join(",")).join(" ")}
        fill="rgba(91,141,239,0.18)" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />`}
      <circle cx=${x(n)} cy=${x(i)} r="13" fill="rgba(91,141,239,0.35)" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 2" />
      <g class="hme-tag"><rect x=${x(n-r/2)} y=${x(i+20)} width=${x(r)} height="18" rx="9" fill="#5b8def" />
        <text x=${x(n)} y=${x(i+33)} fill="#fff" text-anchor="middle">${a}</text></g>
    </g>`}pinAt(e,t){return yn(e.floor,e.toScreen,t)}pointerDown(e,t,o){return t.button!==0?!1:this.pressHandle(e,t,o)||this.pressPin(e,t,o)||this.pressBox(e,t,o)}pressHandle(e,t,o){let n=this.picked(e);if(n===void 0||t.shiftKey||t.metaKey||t.ctrlKey)return!1;let i=oe(n.entityId,this.states(e));if(i.kind!=="light")return!1;let a=e.toScreen(o),[r,d]=e.toScreen(n.at),l=e.px(mt(n,i.on?i.brightness:void 0));return Math.hypot(a[0]-(r+l*Math.cos(co)),a[1]-(d+l*Math.sin(co)))>10?!1:(this.glowDrag(e,t,n),!0)}onPin(e,t){return this.pinAt(e,e.toScreen(t))!==void 0}pressBox(e,t,o){return t.shiftKey?(this.boxDrag(e,t,o),!0):!1}pressPin(e,t,o){let n=t.shiftKey||t.metaKey||t.ctrlKey,i=this.pinAt(e,e.toScreen(o));if(i===void 0)return!1;if(this.pickPage=!1,this.iconsOpen=!1,n)return e.select(Oe(e.selection,i.id)),!0;let a=ye(e.selection);return a.length>1&&a.some(r=>M(r,i.id))?(this.groupDrag(e,t,a,i.id,o),!0):(e.select({kind:"pin",pinId:i.id}),this.moveDrag(e,t,i,o),!0)}groupDrag(e,t,o,n,i){let a=[0,0],r=eo(o);e.drag(t,{move:d=>{this.moving=!0,a=[d[0]-i[0],d[1]-i[1]];let[l,h]=a;e.preview(p=>qt(p,o,l,h))},end:(d,l,h)=>{this.moving=!1,e.preview(void 0);let[p,u]=a;h?Math.hypot(p,u)>=.005&&e.apply(f=>qt(f,o,p,u),r===void 0?{}:{select:r}):e.select({kind:"pin",pinId:n})},cancel:()=>this.stopDrag(e)})}stopDrag(e){this.moving=!1,this.box=void 0,this.lampOver=void 0,e.preview(void 0)}boxDrag(e,t,o){let n=e.floor.pins,i=e.selection;e.drag(t,{move:a=>{this.box={a:o,b:a},e.redraw()},end:(a,r,d)=>{this.box=void 0,d?e.select(ua(i,fa(n,o,a))):e.redraw()},cancel:()=>this.stopDrag(e)})}async removePicks(e,t){t.length!==0&&(t.length>1&&!await e.confirm({title:`Remove ${R(t.length,"device")} from the map?`,text:"They come off the map, and Add can put them back. Undo puts them back where they were.",ok:"Remove",danger:!0})||e.apply(o=>Zi(o,t),{select:null}))}moveDrag(e,t,o,n){let i=o.id,a=e.floor,r=a.id,d=[o.at[0],o.at[1]],l=Z(a,i)===void 0,h=je(o.entityId),p=d;e.drag(t,{move:u=>{this.moving=!0,p=[d[0]+u[0]-n[0],d[1]+u[1]-n[1]];let f=l?this.emptyThingAt(e,p,h,a):void 0;this.lampOver=f,e.preview(f===void 0?g=>Yo(g,i,p):g=>Zt(g,r,f.roomId,f.object,i))},end:(u,f,g)=>{let c=this.lampOver;this.moving=!1,this.lampOver=void 0,e.preview(void 0),g&&c!==void 0?e.apply(b=>Zt(b,r,c.roomId,c.object,i),{select:{kind:"object",...c}}):g&&Math.hypot(p[0]-d[0],p[1]-d[1])>=.005&&e.apply(b=>Yo(b,i,p),{select:{kind:"pin",pinId:i}})},cancel:()=>this.stopDrag(e)})}glowDrag(e,t,o){let n=o.id,i;e.drag(t,{move:a=>{this.moving=!0;let r=Math.hypot(a[0]-o.at[0],a[1]-o.at[1]);i=Math.min(Math.max(Math.round(r/.05)*.05,tt),Vn);let d=i;e.preview(l=>De(l,n,{glow:d}))},end:()=>{this.moving=!1,e.preview(void 0);let a=i;a!==void 0&&e.apply(r=>De(r,n,{glow:a}))},cancel:()=>this.stopDrag(e)})}keyDown(e,t){let o=this.picks(e).map(i=>i.id);if(o.length===0)return!1;let n=te(t,!1);if(n==="delete")return this.removePicks(e,o),!0;if(typeof n=="object"&&"nudge"in n){let[i,a]=n.nudge;return e.apply(r=>qt(r,o,i,a)),!0}return!1}leave(){this.dragging=void 0,this.dropAt=void 0,this.box=void 0,this.moving=!1,this.iconsOpen=!1,this.pickPage=!1,this.chooser=void 0,this.lampOver=void 0}viewItems(e){return[{label:"Side view",on:this.side,title:"The picked device's room from the side, to set its height",flip:()=>{this.side=!this.side,e.redraw()}},{label:"Names",on:this.names,title:"Every device's name under its pin",flip:()=>{this.names=!this.names,e.redraw()}}]}stageExtra(e){let t=this.picked(e);if(!this.side||t===void 0)return v;let o=se(e.floor,t),n=o?.height??2.5,i=Ce(o?.outline??e.floor.rooms.flatMap(P=>P.outline))??{minX:t.at[0]-1,maxX:t.at[0]+1,minY:0,maxY:0},a=18,r=118,d=(r-a)/Math.max(n,.5),l=30,h=262,p=(h-l)/Math.max(i.maxX-i.minX,.5),u=P=>l+(Math.min(Math.max(P,i.minX),i.maxX)-i.minX)*p,f=t.at[2],g=r-Math.min(Math.max(f,0),n)*d,c=u(t.at[0]),b=(()=>{let P=oe(t.entityId,this.states(e));return P.kind==="light"&&P.on})(),y=[];for(let P=0;P<=n+1e-9;P+=1)y.push(P);let w=o===void 0?[]:Zn(o),H=o===void 0?"No room":S(o);return m`<div class="hme-side">
      <div class="hme-h">${H} from the side</div>
      <svg viewBox="0 0 270 130" role="img" aria-label=${`Side view: ${Y(t,e.hass)} at ${f.toFixed(2)} m, the wall ${n.toFixed(1)} m tall`}
        @pointerdown=${P=>this.heightDrag(e,P,t,n,r,d)}>
        <path d=${`M${l} ${x(a)}H${h}M${l} ${r}H${h}`} stroke="#ece6da" stroke-width="3" />
        <path d=${`M${l} ${x(a)}V${r}M${h} ${x(a)}V${r}`} stroke="#ece6da" stroke-width="1.5" opacity="0.4" />
        <g font-size="9" fill="#8e8e93" text-anchor="end" class="mono">
          ${y.map(P=>k`<text x=${l-6} y=${x(r-P*d+3)}>${P===0?"0":`${P} m`}</text>
            <path d=${`M${l-4} ${x(r-P*d)}H${l}`} stroke="#8e8e93" />`)}
        </g>
        ${w.map(P=>{let D=u(P.c[0]-P.size[0]/2),z=u(P.c[0]+P.size[0]/2),O=Math.min(P.size[2],n)*d;return k`<rect x=${x(D)} y=${x(r-O)} width=${x(Math.max(z-D,2))} height=${x(O)} rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" />`})}
        <path d=${`M${x(c)} ${r}V${x(g)}`} stroke="#5b8def" stroke-width="1.2" stroke-dasharray="3 3" />
        ${b?k`<circle cx=${x(c)} cy=${x(g)} r="20" fill="#ffb648" opacity="0.22" />`:v}
        <circle cx=${x(c)} cy=${x(g)} r="9" fill=${b?Pe:"#3a3a3c"} stroke="#5b8def" stroke-width="2.5" style="cursor:ns-resize" />
        <g class="hme-tag"><rect x=${x(Math.min(c+14,222))} y=${x(g-8)} width="44" height="16" rx="8" fill="#5b8def" />
          <text x=${x(Math.min(c+14,222)+22)} y=${x(g+3.5)} fill="#fff" font-size="10" text-anchor="middle">${f.toFixed(2)} m</text></g>
      </svg>
      <span class="hme-side-hint">Drag the pin up or down here.</span>
    </div>`}heightDrag(e,t,o,n,i,a){if(t.button!==0)return;let r=t.currentTarget,d=o.id,l=f=>{let g=r.getBoundingClientRect(),c=(f.clientY-g.top)*130/Math.max(g.height,1);return Math.min(Math.max(Math.round((i-c)/a/.05)*.05,0),n)},h=l(t);try{r.setPointerCapture(t.pointerId)}catch{}this.moving=!0,e.preview(f=>be(f,d,h));let p=f=>{h=l(f);let g=h;e.preview(c=>be(c,d,g))},u=()=>{r.removeEventListener("pointermove",p),r.removeEventListener("pointerup",u),r.removeEventListener("pointercancel",u),this.moving=!1,e.preview(void 0);let f=h;Math.abs(f-o.at[2])>=.005&&e.apply(g=>be(g,d,f))};r.addEventListener("pointermove",p),r.addEventListener("pointerup",u),r.addEventListener("pointercancel",u)}pill(e){let t=this.picks(e);if(t.length>1&&!this.moving)return this.groupPill(e,t);let o=this.picked(e);if(o===void 0||this.moving)return v;let n=o.id,i=o.entityId.startsWith("light."),a=se(e.floor,o)!==void 0;return m`<span class="hme-pill-name">${Y(o,e.hass)}</span>
      ${en(o.entityId)&&e.hass!==void 0?m`<button type="button" class="hme-tb" @click=${()=>this.toggle(e,o.entityId)}>${tn(o.entityId,e.hass.states)}</button>`:v}
      ${i?m`<button type="button" class="hme-tb" title="Every light on this floor at this light's height" @click=${()=>e.apply(r=>Xi(r,n))}>Same height for all lights</button>`:v}
      ${a?m`<button type="button" class="hme-tb" @click=${()=>e.apply(r=>Yi(r,n))}>Center in room</button>`:v}
      <button type="button" class="hme-tb danger" @click=${()=>e.apply(r=>Zo(r,n),{select:null})}>Remove</button>`}groupPill(e,t){let o=t.map(d=>d.id),n=t[0],i=n.at[2],a=t.every(d=>Math.abs(d.at[2]-i)<.005),r=e.hass===void 0?void 0:ga(t.map(d=>d.entityId),e.hass.states);return m`<span class="hme-pill-name">${R(t.length,"device")}</span>
      ${r===void 0?v:m`<button type="button" class="hme-tb" @click=${()=>this.turn(e,t.map(d=>d.entityId),r.service)}>${r.words}</button>`}
      <button type="button" class="hme-tb" ?disabled=${a} title=${a?"They are all at one height":`Every picked device at ${Y(n,e.hass)}'s height, ${i.toFixed(2)} m`}
        @click=${()=>e.apply(d=>qe(d,o,i))}>Same height</button>
      <button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(e,o)}}>Remove</button>`}toggle(e,t){let o=e.hass;o!==void 0&&Co(o,"homeassistant","toggle",{entity_id:t}).catch(n=>{e.note("err",`Could not turn it on or off: ${n instanceof Error?n.message:String(n)}`)})}turn(e,t,o){let n=e.hass;n!==void 0&&Co(n,"homeassistant",o,{entity_id:[...t]}).catch(i=>{e.note("err",`Could not turn them ${o==="turn_on"?"on":"off"}: ${i instanceof Error?i.message:String(i)}`)})}inspector(e){let t=this.picks(e);if(t.length>1)return this.groupInspector(e,t);let o=this.picked(e);if(o===void 0)return v;let n=e.hass?.states,i=o.id,a=oe(o.entityId,n),r=a.kind==="light"&&a.on,d=this.friendly(e,o.entityId),l=this.deviceClass(e,o.entityId),h=pe(o.entityId,l,d),p=o.icon??h,f=se(e.floor,o)?.height??2.5,g=y=>e.apply(w=>De(w,i,y,d)),b=Ye(o)??Pe;return m`
      <section class="hme-card hme-head">
        <span class="hme-pin-big ${r?"lit":""}" style=${r?`background:${b};box-shadow:0 0 24px ${b}80`:""}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${ee(p,r?"#3a2600":"#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${Y(o,e.hass)}</strong>
          <span class="mono">${o.entityId}</span>
        </div>
        <span class="hme-state ${r?"lit":""}">${J(o.entityId,n)}</span>
      </section>

      ${E("On the map",m`
        ${L("Name",Je({value:o.name??"",label:"Name on the map",placeholder:d??o.entityId,set:y=>g({name:y.trim()===""?null:y})}))}
        ${this.iconRows(e,o,g)}
        ${L("Room",m`<span class="hme-in hme-ro">${Br(e.floor,o)}</span>`)}
        ${or(o,b,g)}`)}

      ${E("Height",m`
        <div class="hme-r">
          <input class="hme-range" type="range" min="0" max=${f} step="0.05" .value=${G(String(o.at[2]))} aria-label="Height" style=${Ne(o.at[2],0,f)}
            @input=${y=>{let w=Number(y.target.value);e.preview(H=>be(H,i,w))}}
            @change=${y=>{let w=Number(y.target.value);e.apply(H=>be(H,i,w))}} />
          ${F({label:"Height",value:o.at[2],unit:"m",min:0,max:100,width:"92px",set:y=>e.apply(w=>be(w,i,y))})}
        </div>
        <div class="hme-chips">${on.map(([y,w])=>m`<button type="button" class="hme-chip sel ${Math.abs(o.at[2]-w)<.005?"on":""}"
          @click=${()=>e.apply(H=>be(H,i,w))}>${y} ${w}</button>`)}</div>
        <p class="hme-text dim">The model looks stand the pin at this height.</p>`)}

      ${o.entityId.startsWith("light.")?this.lightCard(e,o,a.kind==="light"&&a.on?a.brightness:void 0,g):v}

      ${this.tapCard(e,o,g)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>e.apply(y=>Zo(y,i),{select:null})}>Remove from the map</button></div>`}iconRows(e,t,o){let n=this.friendly(e,t.entityId),i=this.deviceClass(e,t.entityId),a=pe(t.entityId,i,n),r=t.icon??a;return m`${L("Icon",m`<button type="button" class="hme-in hme-icon-btn" aria-haspopup="true" aria-expanded=${this.iconsOpen?"true":"false"}
        @click=${()=>{this.iconsOpen=!this.iconsOpen,e.redraw()}}>
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">${ee(r,"currentColor",24,2)}</svg>
        <span class="hme-grow">${Wr(t,i,n)}</span><span class="hme-caret" aria-hidden="true">▾</span></button>`)}
      ${this.iconsOpen?this.iconMenu(e,t,a,o):v}`}iconMenu(e,t,o,n){let i=r=>{this.iconsOpen=!1,n({icon:r}),e.redraw()},a=(r,d,l,h)=>m`<button type="button" class="hme-icon-cell ${l?"on":""}"
      title=${d} aria-label=${d} aria-pressed=${l?"true":"false"} @click=${()=>i(h)}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">${ee(r,"currentColor",24,1.9)}</svg><span>${d}</span></button>`;return m`<div class="hme-icons" role="group" aria-label="Icon">
      ${a(o,"Auto",t.icon===void 0,null)}
      ${Un.map(r=>a(r,to[r],t.icon===r,r))}
    </div>`}lightCard(e,t,o,n){return E("Light",this.glowRows(e,t,o,n))}glowRows(e,t,o,n){let i=t.id,a=mt(t,o),r=Ye(t),d=(l,h,p)=>m`<button type="button" class="hme-chip sel ${h?"on":""}" aria-pressed=${h?"true":"false"} @click=${p}>${l}</button>`;return m`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        <input class="hme-range" type="range" min=${tt} max=${Math.max(Tn,a)} step="0.05" .value=${G(String(a))} aria-label="Glow size"
          style=${Ne(a,tt,Math.max(Tn,a))}
          @input=${l=>{let h=Number(l.target.value);e.preview(p=>De(p,i,{glow:h}))}}
          @change=${l=>n({glow:Number(l.target.value)})} />
        <span class="hme-val mono hme-w48">${a.toFixed(1)} m</span></div>
      <div class="hme-row-end indent">${d("By its brightness",t.glow===void 0,()=>n({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${d("Follow the light",t.glowColor===void 0,()=>n({glowColor:null}))}
        ${d("Warm",t.glowColor==="warm",()=>n({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${r!==void 0?"on":""}">${r===void 0?v:m`<span class="hme-swatch" style=${`background:${r}`}></span>`}Pick
          ${wt({value:r??"#ffb648",label:"Pick the glow's color",preview:l=>e.preview(l===void 0?void 0:h=>De(h,i,{glowColor:l})??h),set:l=>n({glowColor:l})})}</label>
      </div></div>
      ${er(t.glowSpill===!0?"off":"on",l=>n({glowSpill:l?null:!0}))}
      ${V("The pool of light round this light on the plan and the tiles. Warm is the lamplight every light has without a color of its own.")}`}thingCards(e,t,o){let n=e.floor.rooms.find(I=>M(I.id,t)),i=n?.objects[o];if(n===void 0||i===void 0)return v;let a=mo(i)||Lo(i.model)!==void 0,r=a?"Light":"Device",d=ae(i),l=e.floor.id,h=Xe(e.floor,n.id,o),p=I=>a?`Put ${I} in this lamp`:`Put ${I} on this ${d}`;if(h===void 0){let I=()=>e.openAdd("devices",{title:a?"Choose a light for this lamp":`Choose a device for this ${d}`,lightsOnly:a,rowTitle:p,pick:B=>{this.putOn(e,{roomId:n.id,object:o},B)||e.redraw()}});return E(r,m`
        ${L(r,m`<span class="hme-in hme-ro dim">None</span>`,m`<button type="button" class="hme-tb" aria-haspopup="dialog" title=${a?"Pick the light this lamp holds":`Pick the device this ${d} is or carries`}
            @click=${I}>Choose…</button>`)}
        ${V(a?"Pick the light this lamp holds, or drag its light's pin onto it on the plan.":`The device this ${d} is or carries, a TV's media player or a fan's switch: choose it, or drag its pin onto it on the plan.`)}`)}let u=e.hass?.states,f=h.id,g=je(h.entityId),c=oe(h.entityId,u),b=c.kind==="light"&&c.on,y=this.friendly(e,h.entityId),w=I=>e.apply(B=>De(B,f,I,y)),H=h.icon??pe(h.entityId,this.deviceClass(e,h.entityId),y),P=Ye(h)??Pe,D=e.doc.floors.find(I=>M(I.id,l))?.rooms.find(I=>M(I.id,n.id)),z=()=>{let I=e.newId().toUpperCase(),B=D===void 0?null:{kind:"object",roomId:n.id,object:D.objects.length};e.apply(To=>oa(To,l,n.id,o,I)?.doc,{select:B})||e.note("warn","Another lamp could not be added: the map holds at most 400 devices, and a room at most 256 things.")},O=()=>e.openAdd("devices",{title:a?"Change the light in this lamp":`Change the device on this ${d}`,lightsOnly:a,now:h.entityId,rowTitle:p,pick:I=>{if(!je(I)&&Ae(e.doc,I)!==void 0){e.note("warn","That device is on the map already. Drag its pin onto this instead."),e.redraw();return}e.apply(B=>na(B,f,I))||e.redraw()}}),K=a?"lamp":d,_=g?"light":"device";return m`${E(r,m`
        <div class="hme-lamp-light">
          <span class="hme-pin-big ${b?"lit":""}" style=${b?`background:${P};box-shadow:0 0 24px ${P}80`:""}>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${ee(H,b?"#3a2600":"#d1d1d6",24,2)}</svg></span>
          <div class="hme-head-t hme-grow">
            <strong>${Y(h,e.hass)}</strong>
            <span class="mono">${h.entityId}</span>
          </div>
          <span class="hme-state ${b?"lit":""}">${J(h.entityId,u)}</span>
        </div>
        ${L("Name",Je({value:h.name??"",label:"Name on the map",placeholder:y??h.entityId,set:I=>w({name:I.trim()===""?null:I})}))}
        ${L(r,m`<span class="hme-in hme-ro mono">${h.entityId}</span>`,m`<button type="button" class="hme-tb" aria-haspopup="dialog" title=${a?"Show another of the home's lights in this lamp":`Show another of the home's devices on this ${d}`}
            @click=${O}>Change…</button>`)}
        ${g?this.glowRows(e,h,b?c.brightness:void 0,w):v}
        ${this.iconRows(e,h,w)}
        ${or(h,P,w)}
        <div class="hme-row-end">
          ${en(h.entityId)&&e.hass!==void 0?m`<button type="button" class="hme-tb" @click=${()=>this.toggle(e,h.entityId)}>${tn(h.entityId,u)}</button>`:v}
          ${g?m`<button type="button" class="hme-tb" title=${`Another of this ${K} beside it, holding the same light: a light group in many lamps`} @click=${z}>Add another</button>`:v}
          <button type="button" class="hme-tb push" title=${`The ${K} lets go of the ${_}; both stay where they are`} @click=${()=>e.apply(I=>ea(I,l,n.id,o))}>Unlink</button>
        </div>
        <p class="hme-foot-hint">${a&&g?"The light sits in the lamp: move, lift or turn the lamp and the light goes with it.":`The ${_} sits on the ${K}: move, lift or turn the ${K} and the ${_} goes with it.`}</p>`)}
      ${this.tapCard(e,h,w)}`}groupInspector(e,t){let o=e.hass?.states,n=t.map(p=>p.id),i=p=>{e.apply(u=>Xt(u,n,p))||e.note("warn","That could not be set on every picked device.")},a=Math.max(2.5,...t.map(p=>se(e.floor,p)?.height??2.5)),r=ne(t.map(p=>p.at[2])),d=ne(t.map(p=>p.reading)),l=t.every(p=>p.entityId.startsWith("light.")),h=Pe;return m`
      <section class="hme-card hme-head">
        <span class="hme-pin-big"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${ee("bulb","#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${R(t.length,"device")}</strong>
          <span>Shift, Cmd or Ctrl and a click adds or takes one away</span>
        </div>
      </section>

      ${E("Picked",m`${t.map(p=>m`<div class="hme-list-row hme-pick-row">
          <button type="button" class="hme-grow hme-link" title="Pick this one alone" @click=${()=>e.select({kind:"pin",pinId:p.id})}>${Y(p,e.hass)}</button>
          <span class="hme-val">${J(p.entityId,o)}</span>
          <button type="button" class="hme-x" aria-label=${`Leave ${Y(p,e.hass)} out of the pick`} title="Leave it out of the pick"
            @click=${()=>e.select(Oe(e.selection,p.id))}>×</button></div>`)}`,String(t.length))}

      ${E("On the map",m`
        <div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
          ${Q({label:"None",picture:et("none",h),on:!d.mixed&&d.value==="none",click:()=>i({reading:"none"})})}
          ${Q({label:"Pill",picture:et("pill",h),on:!d.mixed&&d.value===void 0,title:"Each one's reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>i({reading:null})})}
          ${Q({label:"Name",picture:et("name",h),on:!d.mixed&&d.value==="name",click:()=>i({reading:"name"})})}
        </div></div>
        ${d.mixed?V("Mixed: they show different things. Pick one to set them all."):v}`)}

      ${E("Height",m`
        <div class="hme-r">
          ${tr({label:"Height",value:r.mixed?void 0:r.value,min:0,max:a,step:.05,preview:p=>e.preview(u=>qe(u,n,p)),set:p=>e.apply(u=>qe(u,n,p))})}
          ${F({label:"Height",value:r.mixed?void 0:r.value,unit:"m",min:0,max:100,width:"92px",set:p=>e.apply(u=>qe(u,n,p))})}
        </div>
        <div class="hme-chips">${on.map(([p,u])=>m`<button type="button" class="hme-chip sel ${t.every(f=>Math.abs(f.at[2]-u)<.005)?"on":""}"
          @click=${()=>e.apply(f=>qe(f,n,u))}>${p} ${u}</button>`)}</div>
        <p class="hme-text dim">Every picked device at this height.</p>`)}

      ${l?this.groupLightCard(e,t,i):v}

      ${this.groupTapCard(e,t,i)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(e,n)}}>Remove ${R(t.length,"device")} from the map</button></div>`}groupLightCard(e,t,o){let n=t.map(g=>g.id),i=this.states(e),a=t.map(g=>{let c=oe(g.entityId,i);return Math.round(mt(g,c.kind==="light"&&c.on?c.brightness:void 0)*20)/20}),r=ne(a),d=Math.max(Tn,...a),l=t.every(g=>g.glow===void 0),h=ne(t.map(g=>g.glowColor?.toLowerCase())),p=ne(t.map(g=>g.glowSpill===!0)),u=h.mixed||h.value===void 0||h.value==="warm"?void 0:h.value,f=(g,c,b)=>m`<button type="button" class="hme-chip sel ${c?"on":""}" aria-pressed=${c?"true":"false"} @click=${b}>${g}</button>`;return E("Light",m`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        ${tr({label:"Glow size",value:r.mixed?void 0:r.value,min:tt,max:d,step:.05,preview:g=>e.preview(c=>Xt(c,n,{glow:g})),set:g=>o({glow:g})})}
        <span class="hme-val mono hme-w48">${r.mixed?"Mixed":`${r.value.toFixed(1)} m`}</span></div>
      <div class="hme-row-end indent">${f("By its brightness",l,()=>o({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${f("Follow the light",!h.mixed&&h.value===void 0,()=>o({glowColor:null}))}
        ${f("Warm",!h.mixed&&h.value==="warm",()=>o({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${u!==void 0?"on":""}">${u===void 0?v:m`<span class="hme-swatch" style=${`background:${u}`}></span>`}Pick
          ${wt({value:u??"#ffb648",label:"Pick the glow's color for every picked light",preview:g=>e.preview(g===void 0?void 0:c=>Xt(c,n,{glowColor:g})??c),set:g=>o({glowColor:g})})}</label>
      </div></div>
      ${h.mixed?V("Mixed: their colors differ. Pick one to set them all."):v}
      ${er(p.mixed?"mixed":p.value?"off":"on",g=>o({glowSpill:g?null:!0}))}`)}groupTapCard(e,t,o){let n=ne(t.map(l=>[l.tap,l.tap==="page"?l.pageId?.toLowerCase():void 0])),i=n.mixed?void 0:n.value,a=i?.[0]==="page"||this.pickPage,r=i?.[0]==="page"?t[0].pageId:void 0,d=l=>{if(l==="page"){e.pages.length===1?o({tap:"page",pageId:e.pages[0].id}):(this.pickPage=!0,e.redraw());return}this.pickPage=!1,o({tap:l??null})};return E("Tap on the map",m`
      <div class="hme-chips">${nn.map(([l,h])=>{let p=l==="page"?a:!this.pickPage&&i!==void 0&&i[0]===l;return m`<button type="button" class="hme-chip sel ${p?"on":""}" aria-pressed=${p?"true":"false"}
          ?disabled=${l==="page"&&e.pages.length===0} title=${l==="page"&&e.pages.length===0?"Your library has no pages":""}
          @click=${()=>d(l)}>${h}</button>`})}</div>
      ${a?L("Page",Fe({label:"Page",value:r??"",options:[...r===void 0?[{value:"",label:"Pick a page\u2026",disabled:!0}]:[],...r===void 0||e.pages.some(l=>M(l.id,r))?[]:[{value:r,label:"A page not in your library",disabled:!0}],...e.pages.map(l=>({value:l.id,label:l.name}))],set:l=>{this.pickPage=!1,l!==""&&o({tap:"page",pageId:l})}})):v}
      <p class="hme-text dim">${n.mixed&&!this.pickPage?"Mixed: a tap does different things on them. Pick one to set them all.":"Set on every picked device."}</p>`)}tapCard(e,t,o){let n=t.tap==="page"||this.pickPage,i=t.pageId===void 0||e.pages.some(r=>M(r.id,t.pageId)),a=r=>{if(r==="page"){if(t.tap==="page")return;e.pages.length===1?o({tap:"page",pageId:e.pages[0].id}):(this.pickPage=!0,e.redraw());return}this.pickPage=!1,o({tap:r??null})};return E("Tap on the map",m`
      <div class="hme-chips">${nn.map(([r,d])=>{let l=r==="page"?n:!this.pickPage&&t.tap===r;return m`<button type="button" class="hme-chip sel ${l?"on":""}" aria-pressed=${l?"true":"false"}
          ?disabled=${r==="page"&&e.pages.length===0} title=${r==="page"&&e.pages.length===0?"Your library has no pages":""}
          @click=${()=>a(r)}>${d}</button>`})}</div>
      ${n?L("Page",Fe({label:"Page",value:t.tap==="page"?t.pageId??"":"",options:[...t.tap==="page"?[]:[{value:"",label:"Pick a page\u2026",disabled:!0}],...i?[]:[{value:t.pageId,label:"A page not in your library",disabled:!0}],...e.pages.map(r=>({value:r.id,label:r.name}))],set:r=>{this.pickPage=!1,r!==""&&o({tap:"page",pageId:r})}})):v}
      <p class="hme-text dim">${t.tap===void 0&&!this.pickPage?"As the tile does: a light toggles, anything else opens its control.":"Hold on the watch or iPhone: its controls."}</p>`)}};function er(s,e){let t=s==="on"?"walls stop the glow":s==="off"?"the glow spreads past the walls":"some stay in, some spread";return m`<div class="hme-r"><span class="hme-l">Stay in room</span>
    ${s==="mixed"?m`<button type="button" class="hme-chip off" aria-pressed="mixed" aria-label="Stay in room" @click=${()=>e(!0)}>Mixed</button>`:Mt({on:s==="on",onText:"On",offText:"Off",label:"Stay in room",click:()=>e(s!=="on")})}
    <span class="hme-text dim">${t}</span></div>`}function tr(s){let e=s.value??(s.min+s.max)/2;return m`<input class="hme-range ${s.value===void 0?"mixed":""}" type="range" min=${s.min} max=${s.max} step=${s.step} .value=${G(String(e))}
    aria-label=${s.label} aria-valuetext=${s.value===void 0?"Mixed":v} style=${s.value===void 0?"--p:0%":Ne(s.value,s.min,s.max)}
    @input=${t=>{let o=t.target;o.classList.remove("mixed"),s.preview(Number(o.value))}}
    @change=${t=>s.set(Number(t.target.value))} />`}function or(s,e,t){return m`<div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
    ${Q({label:"None",picture:et("none",e),on:s.reading==="none",click:()=>t({reading:"none"})})}
    ${Q({label:"Pill",picture:et("pill",e),on:s.reading===void 0,title:"Its reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>t({reading:null})})}
    ${Q({label:"Name",picture:et("name",e),on:s.reading==="name",click:()=>t({reading:"name"})})}
  </div></div>`}function et(s,e){return m`<svg width="62" height="44" viewBox="0 0 62 44" aria-hidden="true">
    <circle cx="31" cy=${s==="none"?20:16} r="9" fill=${e} />
    ${s==="pill"?k`<rect x="17" y="29" width="28" height="11" rx="5.5" fill="rgba(0,0,0,0.7)" stroke="#3a3a3c" /><text x="31" y="37.5" font-size="8" fill="#fff" text-anchor="middle">21.5°</text>`:v}
    ${s==="name"?k`<text x="31" y="38" font-size="8" fill="#fff" text-anchor="middle">Name</text>`:v}
  </svg>`}var vo=[{id:"select",label:"Corners and walls",key:"v"},{id:"split",label:"Split the room",key:"s"},{id:"inner",label:"Inner wall",key:"w"},{id:"door",label:"Door",key:"d"},{id:"window",label:"Window",key:"n"},{id:"opening",label:"Way through (no door)",key:"o"},{id:"stairs",label:"Stairs",key:"t"}];function hr(s){return Jr[s]}function qr(s){return vo.find(e=>e.key===s.toLowerCase())?.id}var Xr=[{label:"Door",kind:"door"},{label:"Double door",kind:"door",style:"double"},{label:"Sliding door",kind:"door",style:"sliding"},{label:"Window",kind:"window"},{label:"Sliding window",kind:"window",style:"sliding"},{label:"Way through",kind:"opening"}],Yr=["zero","one","two","three","four","five","six","seven","eight","nine","ten"];function Zr(s){return s===2?"Fix both":`Fix all ${Yr[s]??s}`}var Qr=9,ar=18,Cn="#4fd6c2",rr="Draw each room faint and dashed as the iPhone scanned it, or as first seen for a room scanned before scans were kept. A room drawn here has none.",sr="Put this room's walls, doors, windows and furniture back as the iPhone scanned it. Its devices stay where they are.",$=s=>s.toFixed(1),Ee=s=>`${s[0].toFixed(1)},${s[1].toFixed(1)}`,dr=new WeakMap;function fo(s){let e=dr.get(s);return e===void 0&&dr.set(s,e=Gi(s)),e}function Sn(s,e,t,o){if(s.walls!==void 0&&o===void 0)return;let n=t/s.view.scale,i=r=>{let d;for(let l of r)for(let[h,p]of q(l).entries()){let u=hi(e,p);u<=n&&(d===void 0||u<d.d)&&(d={room:l,wall:h,seg:p,d:u})}return d},a=o===void 0?void 0:i([o]);return s.walls!==void 0?a:a??i(s.floor.rooms)}function lr(s,e){let t=Math.max(ge(e),1e-9),o=[-(e.b[1]-e.a[1])/t,(e.b[0]-e.a[0])/t],n=[(e.a[0]+e.b[0])/2,(e.a[1]+e.b[1])/2],i=U(s)??X(s);return(i[0]-n[0])*o[0]+(i[1]-n[1])*o[1]>0&&(o=[-o[0],-o[1]]),o}var go=class{constructor(){this.tool="select";this.dragging=!1}setTool(e,t){this.first=void 0,this.tool=t,e.redraw()}get armed(){return this.tool!=="select"}focus(e){let t=e.walls??me(e.selection);return t===void 0?void 0:e.floor.rooms.find(o=>M(o.id,t))}roomAt(e,t){let o=W(e.floor,t);return e.walls===void 0||o!==void 0&&M(o.id,e.walls)?o:void 0}placed(e,t,o){this.setTool(e,"select"),e.editWalls(t,o)}pickedWall(e,t){let o=e.selection;if(!(t===void 0||o===void 0)){if(o.kind==="wall")return o.wall;if(o.kind==="opening"){let n=t.openings[o.opening],i=n===void 0?-1:Ue(t,n);return i>=0?i:void 0}}}rail(e){let t=this.focus(e);return m`${t===void 0?v:this.wallsCard(e,t)}
      ${this.checkCard(e)}
      ${t===void 0?v:this.scanCard(e,t)}`}wallsCard(e,t){let o=q(t),n=e.selection,i=t.id,a=_a(t),r=t.openings.map((l,h)=>({o:l,i:h})).filter(({o:l})=>Ue(t,l)<0),d=({o:l,i:h})=>{let p=n?.kind==="opening"&&n.opening===h;return m`<button type="button" class="hme-lay sub ${p?"on":""}" aria-pressed=${p?"true":"false"}
        @click=${()=>e.select({kind:"opening",roomId:i,opening:h})}>${$e(l)}<span class="n">${gt(Math.hypot(l.b[0]-l.a[0],l.b[1]-l.a[1]))}</span></button>`};return m`<section class="hme-card hme-layers">
      <div class="hme-h">${S(t)}<span class="hme-h-end">${R(o.length,"wall")}</span></div>
      ${o.map((l,h)=>{let p=n?.kind==="wall"&&n.wall===h;return m`<button type="button" class="hme-lay ${p?"on":""}" aria-pressed=${p?"true":"false"}
            @click=${()=>e.select({kind:"wall",roomId:i,wall:h})}>${a[h]}<span class="n">${gt(ge(l))}</span></button>
          ${t.openings.map((u,f)=>({o:u,i:f})).filter(({o:u})=>Ue(t,u)===h).map(d)}`})}
      ${r.length===0?v:m`<div class="hme-lay dim">In no wall</div>${r.map(d)}`}
    </section>`}scanCard(e,t){if(e.scans===void 0)return v;let o=t.id,n=So(e.scans,o),i=n!==void 0&&qo(t,n)?n:void 0;return E("Show scan as it was",m`<div class="hme-row-end">
      <button type="button" class="hme-tb ${e.toggles.scan?"on":""}" aria-pressed=${e.toggles.scan?"true":"false"} title=${rr}
        @click=${()=>e.setToggle("scan",!e.toggles.scan)}>${e.toggles.scan?"On":"Off"}</button>
      <button type="button" class="hme-tb" ?disabled=${i===void 0} title=${i===void 0?"This room is as the iPhone scanned it, or was drawn here":sr}
        @click=${()=>{i!==void 0&&e.apply(a=>Xo(a,o,i))}}>Back to the scan</button>
    </div>`)}checkCard(e){let t=fo(e.floor),o=e.floor.id;return m`
      ${E("Scan check",m`
        ${t.length===0?m`<p class="hme-text dim">Nothing to fix. The walls meet and every room has a way in.</p>`:v}
        ${t.map(n=>m`<div class="hme-fix">
          <span class="hme-fix-dot ${n.kind==="missingDoor"?"gray":""}"></span>
          <p @click=${()=>e.select({kind:"room",roomId:n.roomIds[0]})}><b>${n.title}</b> ${n.detail}</p>
          <button type="button" class="hme-tb" @click=${()=>e.apply(i=>n.fix(i))}>${n.fixLabel}</button></div>`)}
        ${t.length>1?m`<button type="button" class="hme-tb hme-wide" @click=${()=>e.apply(n=>Ui(n,o))}>${Zr(t.length)}</button>`:v}`,t.length===0?void 0:m`<span class="hme-amber">${t.length} to fix</span>`)}`}overlay(e){let t=this.focus(e),o=[];if(t!==void 0&&t.outline.length>=3){let n=t.outline.map(i=>Ee(e.toScreen(i))).join("L");o.push(k`<path d=${`M0 0H${e.stage.width}V${e.stage.height}H0ZM${n}Z`} fill="rgba(0,0,0,0.45)" fill-rule="evenodd" pointer-events="none" />`)}return e.toggles.scan&&o.push(...this.scanMarks(e)),o.push(...this.issueMarks(e)),t!==void 0&&o.push(this.roomHandles(e,t)),o.push(...this.ghost(e)),k`${o}`}scanMarks(e){return Vi(e.floor,e.scans).map(t=>{let o=t.outline.map(i=>Ee(e.toScreen(i))).join("L"),n=t.walls.map(i=>`M${Ee(e.toScreen(i.a))}L${Ee(e.toScreen(i.b))}`).join("");return k`<g class="hme-scan" data-room=${t.roomId} pointer-events="none">
        <path d=${`M${o}Z`} fill=${Cn} fill-opacity="0.06" stroke="none" />
        <path d=${n} fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="3.5" stroke-dasharray="7 5" />
        <path d=${n} fill="none" stroke=${Cn} stroke-width="1.6" stroke-dasharray="7 5" stroke-opacity="0.9" />
        ${t.openings.map(i=>{let a=e.toScreen(i.a),r=e.toScreen(i.b);return k`<line x1=${$(a[0])} y1=${$(a[1])} x2=${$(r[0])} y2=${$(r[1])} stroke=${Cn} stroke-width="4" stroke-opacity="0.85"
            stroke-dasharray=${i.kind==="window"?"2 3":"none"} />`})}
      </g>`})}issueMarks(e){return fo(e.floor).map(t=>{let[o,n]=e.toScreen(t.where);if(t.kind==="offSquare"){let l=/(\d+)°/.exec(t.title)?.[1]??"";return k`<g class="hme-issue" data-hme=${`issue:${t.id}`} style="cursor:pointer"><title>${t.title} Click to square it.</title>
          <circle cx=${$(o)} cy=${$(n)} r="9" fill="#ffb340" stroke="#fff" stroke-width="2" />
          <g class="hme-tag"><rect x=${$(o+12)} y=${$(n+6)} width="44" height="20" rx="10" fill="#ffb340" />
          <text x=${$(o+34)} y=${$(n+20)} fill="#2a1a00" text-anchor="middle">${l}°</text></g></g>`}let i=`${Math.round(t.amount*100)} cm`,a=t.kind==="overlap"?`Overlap ${i} \xB7 ${t.fixLabel}`:t.kind==="gap"?`Gap ${i} \xB7 ${t.fixLabel}`:`No door \xB7 ${t.fixLabel}`,r=a.length*6.2+18,d=t.kind==="missingDoor";return k`<g class="hme-issue" data-hme=${`issue:${t.id}`} style="cursor:pointer"><title>${t.title} ${t.detail}</title>
        <circle cx=${$(o)} cy=${$(n)} r="4" fill=${d?"#8e8e93":"#ffb340"} />
        <g class="hme-tag"><rect x=${$(o-r/2)} y=${$(n+8)} width=${$(r)} height="20" rx="10" fill=${d?"#8e8e93":"#ffb340"} />
        <text x=${$(o)} y=${$(n+22)} fill=${d?"#fff":"#2a1a00"} text-anchor="middle">${a}</text></g></g>`})}roomHandles(e,t){let o=q(t),n=e.selection,i=this.pickedWall(e,t),a=[];if(i!==void 0&&o[i]!==void 0){let d=o[i],l=e.toScreen(d.a),h=e.toScreen(d.b),p=lr(t,d);if(a.push(k`<line x1=${$(l[0])} y1=${$(l[1])} x2=${$(h[0])} y2=${$(h[1])} stroke="#5b8def" stroke-width="9" stroke-linecap="round" pointer-events="none" />`),n?.kind==="wall"&&!this.dragging){let u=[(l[0]+h[0])/2+p[0]*22,(l[1]+h[1])/2+p[1]*22];a.push(k`<g class="hme-tag" pointer-events="none"><rect x=${$(u[0]-27)} y=${$(u[1]-9)} width="54" height="18" rx="9" fill="#5b8def" />
          <text x=${$(u[0])} y=${$(u[1]+4)} fill="#fff" text-anchor="middle">${ge(d).toFixed(2)} m</text></g>`)}}for(let[d,l]of t.openings.entries()){let h=e.toScreen(l.a),p=e.toScreen(l.b),u=n?.kind==="opening"&&n.opening===d,f=l.kind==="window"?"#8bb8f0":l.kind==="door"?"#ece6da":"#98989d";a.push(k`<g data-hme=${`opening:${d}`} style="cursor:ew-resize">
        <line x1=${$(h[0])} y1=${$(h[1])} x2=${$(p[0])} y2=${$(p[1])} stroke=${u?"#5b8def":"rgba(14,14,16,0.9)"} stroke-width="12" stroke-linecap="round" />
        <line x1=${$(h[0])} y1=${$(h[1])} x2=${$(p[0])} y2=${$(p[1])} stroke=${f} stroke-width="3" />
        ${u?k`<circle cx=${$(h[0])} cy=${$(h[1])} r="5" fill="#fff" stroke="#5b8def" stroke-width="2" /><circle cx=${$(p[0])} cy=${$(p[1])} r="5" fill="#fff" stroke="#5b8def" stroke-width="2" />`:v}
      </g>`)}let r=this.sliding!==void 0&&M(this.sliding.roomId,t.id)?this.sliding.index:n?.kind==="opening"?n.opening:void 0;if(r!==void 0&&t.openings[r]!==void 0&&a.push(this.distances(e,t,t.openings[r])),!this.dragging||this.sliding===void 0){if(this.tool==="select")for(let[d,l]of o.entries()){if(ge(l)*e.view.scale<40)continue;let h=e.toScreen([(l.a[0]+l.b[0])/2,(l.a[1]+l.b[1])/2]);a.push(k`<circle data-hme=${`mid:${d}`} cx=${$(h[0])} cy=${$(h[1])} r="5" fill="#0e0e10" stroke="#5b8def" stroke-width="1.5" style="cursor:copy"><title>Drag to add a corner</title></circle>`)}for(let[d,l]of t.outline.entries()){let[h,p]=e.toScreen(l),u=n?.kind==="corner"&&n.corner===d;a.push(k`<circle data-hme=${`corner:${d}`} cx=${$(h)} cy=${$(p)} r="7" fill=${u?"#5b8def":"#fff"} stroke=${u?"#fff":"#5b8def"} stroke-width="2" style="cursor:move" />`)}}return k`<g class="hme-handles">${a}</g>`}distances(e,t,o){let n=Ue(t,o),i=n>=0?q(t)[n]:void 0;if(i===void 0)return k``;let a=ge(i),r=Se(o.a,i.a,i.b).along,d=Se(o.b,i.a,i.b).along,l=Math.max(0,Math.min(r,d)),h=Math.min(a,Math.max(r,d)),p=lr(t,i),u=[(i.b[0]-i.a[0])/a,(i.b[1]-i.a[1])/a],f=y=>{let w=e.toScreen([i.a[0]+u[0]*y,i.a[1]+u[1]*y]);return[w[0]+p[0]*26,w[1]+p[1]*26]},g=[0,l,h,a],c=y=>`M${Ee([y[0]-p[0]*5,y[1]-p[1]*5])}L${Ee([y[0]+p[0]*5,y[1]+p[1]*5])}`,b=[[0,l,!1],[l,h,!0],[h,a,!1]];return k`<g class="hme-dist" pointer-events="none">
      <path d=${`M${Ee(f(0))}L${Ee(f(a))}${g.map(y=>c(f(y))).join("")}`} stroke="#98989d" stroke-width="1" fill="none" />
      ${b.filter(([y,w])=>w-y>.02).map(([y,w,H])=>{let P=f((y+w)/2);return k`<g class="hme-tag"><rect x=${$(P[0]-25)} y=${$(P[1]-9)} width="50" height="18" rx="9" fill=${H?"#5b8def":"#2c2c2e"} />
          <text x=${$(P[0])} y=${$(P[1]+4)} fill="#fff" text-anchor="middle">${(w-y).toFixed(2)} m</text></g>`})}
    </g>`}ghost(e){let t=this.hoverAt;if(t===void 0)return[];let o=[];if(this.tool==="door"||this.tool==="window"||this.tool==="opening"){let n=Sn(e,t,ar,this.focus(e));if(n!==void 0){let i=this.tool==="window"?1.2:.9,a=ge(n.seg),r=Math.min(i,a),d=Math.min(Math.max(Se(t,n.seg.a,n.seg.b).along,r/2),a-r/2),l=[(n.seg.b[0]-n.seg.a[0])/a,(n.seg.b[1]-n.seg.a[1])/a],h=e.toScreen([n.seg.a[0]+l[0]*(d-r/2),n.seg.a[1]+l[1]*(d-r/2)]),p=e.toScreen([n.seg.a[0]+l[0]*(d+r/2),n.seg.a[1]+l[1]*(d+r/2)]);o.push(k`<line x1=${$(h[0])} y1=${$(h[1])} x2=${$(p[0])} y2=${$(p[1])} stroke="#5b8def" stroke-width="10" stroke-opacity="0.6" stroke-linecap="round" pointer-events="none" />`)}}if(this.tool==="stairs"&&this.roomAt(e,t)!==void 0){let[n,i]=e.toScreen(t),a=e.px(1),r=e.px(2.6);o.push(k`<g pointer-events="none" opacity="0.7"><rect x=${$(n-a/2)} y=${$(i-r/2)} width=${$(a)} height=${$(r)} fill="none" stroke="#5b8def" stroke-width="1.5" stroke-dasharray="4 3" />
        ${[1,2,3,4,5,6,7].map(d=>k`<line x1=${$(n-a/2)} x2=${$(n+a/2)} y1=${$(i-r/2+r*d/8)} y2=${$(i-r/2+r*d/8)} stroke="#5b8def" stroke-width="1" />`)}</g>`)}if((this.tool==="split"||this.tool==="inner")&&this.first!==void 0){let n=e.toScreen(this.first.a),i=e.toScreen(this.snap(e,t,this.first.a));if(this.tool==="split"){let a=Math.max(Math.hypot(i[0]-n[0],i[1]-n[1]),1e-6),r=[(i[0]-n[0])/a,(i[1]-n[1])/a],d=Math.hypot(e.stage.width,e.stage.height);o.push(k`<line x1=${$(n[0]-r[0]*d)} y1=${$(n[1]-r[1]*d)} x2=${$(n[0]+r[0]*d)} y2=${$(n[1]+r[1]*d)} stroke="#5b8def" stroke-width="1.5" stroke-dasharray="6 4" pointer-events="none" />`)}else o.push(k`<line x1=${$(n[0])} y1=${$(n[1])} x2=${$(i[0])} y2=${$(i[1])} stroke="#ece6da" stroke-width=${$(Math.max(e.px(.1),3))} stroke-opacity="0.8" pointer-events="none" />`);o.push(k`<circle cx=${$(n[0])} cy=${$(n[1])} r="5" fill="#5b8def" pointer-events="none" />`)}return o}snap(e,t,o){return vn(e.floor,t,e.view.scale,{...o===void 0?{}:{from:o},...e.toggles.grid?{grid:He}:{}})}pointerDown(e,t,o){if(t.button!==0)return!1;switch(this.tool){case"door":case"window":case"opening":{let n=Sn(e,o,ar,this.focus(e));if(n===void 0)return!1;let i=this.tool,a=n.room.id,r={kind:"opening",roomId:a,opening:n.room.openings.length},d=n.wall;return e.apply(l=>Ut(l,a,d,{kind:i,at:o}),{select:r})&&this.placed(e,a,r),!0}case"stairs":{let n=this.roomAt(e,o);if(n===void 0)return!1;let i=n.id,a={kind:"room",roomId:i};return e.apply(r=>Ii(r,i,o),{select:a})&&this.placed(e,i,a),!0}case"split":case"inner":return this.twoPoints(e,o);default:return this.pick(e,t,o)}}twoPoints(e,t){if(this.first===void 0){let a=(e.walls===void 0?W(e.floor,t):void 0)??this.focus(e);return a===void 0?!1:(this.first={roomId:a.id,a:this.snap(e,t)},e.walls===void 0?e.select({kind:"room",roomId:a.id}):e.redraw(),!0)}let{roomId:o,a:n}=this.first,i=this.snap(e,t,n);if(this.first=void 0,Math.hypot(i[0]-n[0],i[1]-n[1])<.1)return e.redraw(),!0;if(this.tool==="inner"){let a=e.doc.floors.flatMap(d=>d.rooms).find(d=>M(d.id,o)),r={kind:"wall",roomId:o,wall:a===void 0?0:Do(a).length};return e.apply(d=>Bi(d,o,n,i),{select:r})?this.placed(e,o,r):e.note("err","An inner wall needs to be at least 10 cm long."),!0}return this.split(e,o,n,i),!0}async split(e,t,o,n){let i=e.floor.rooms.find(l=>M(l.id,t)),a=await e.ask({title:"Name the new room",label:"Name",value:i===void 0?"Room":`${S(i)} 2`,ok:"Split the room"});if(a===void 0)return;let r=e.newId(),d={kind:"room",roomId:r};e.apply(l=>Wi(l,t,o,n,r,a),{select:d})?(this.setTool(e,"select"),e.editWalls(void 0,d)):e.note("err","That line does not cut the room in two. Draw it right across the room.")}pick(e,t,o){let n=this.focus(e),i=t.target?.closest?.("[data-hme]")?.getAttribute("data-hme")??"",[a,r]=i.split(/:(.*)/s);if(a==="issue"){let p=fo(e.floor).find(u=>u.id===r);return p!==void 0&&e.apply(u=>p.fix(u)),!0}let d=Number(r);if(n!==void 0&&a==="corner"&&Number.isInteger(d))return this.cornerDrag(e,t,n,d),!0;if(n!==void 0&&a==="mid"&&Number.isInteger(d))return this.midDrag(e,t,n,d),!0;if(n!==void 0&&a==="opening"&&Number.isInteger(d))return this.openingDrag(e,t,n,d),!0;let l=Sn(e,o,Qr,n);if(l!==void 0)return this.wallAt=Se(o,l.seg.a,l.seg.b).point,e.select({kind:"wall",roomId:l.room.id,wall:l.wall}),!0;let h=W(e.floor,o);return e.walls!==void 0&&(h===void 0||!M(h.id,e.walls))?(e.editWalls(void 0),!0):h===void 0?!1:(e.select({kind:"room",roomId:h.id}),!0)}cornerTo(e,t,o,n){let i=e.floor.rooms.filter(d=>!M(d.id,t.id)).flatMap(d=>d.outline),a=10/e.view.scale;for(let d of i)if(Math.hypot(d[0]-n[0],d[1]-n[1])<=a)return[d[0],d[1]];let r=n;if(e.toggles.grid&&(r=[Math.round(r[0]/He)*He,Math.round(r[1]/He)*He]),e.toggles.square){let d=ci(e.floor.rooms.flatMap(b=>Do(b))),l=Math.cos(d),h=Math.sin(d),p=b=>[b[0]*l+b[1]*h,-b[0]*h+b[1]*l],[u,f]=p(r),g=t.outline.length,c=8/e.view.scale;for(let b of[(o+g-1)%g,(o+1)%g]){let[y,w]=p(t.outline[b]);Math.abs(u-y)<=c&&(u=y),Math.abs(f-w)<=c&&(f=w)}r=[u*l-f*h,u*h+f*l]}return r}cornerDrag(e,t,o,n){let i=o.id,a;e.drag(t,{move:r=>{this.dragging=!0;let d=this.cornerTo(e,o,n,r);a=d,e.preview(l=>Ve(l,i,n,d))},end:(r,d,l)=>{this.dragging=!1,e.preview(void 0);let h=a,p={kind:"corner",roomId:i,corner:n};l&&h!==void 0?e.apply(u=>Ve(u,i,n,h),{select:p}):e.select(p)},cancel:()=>this.stopDrag(e)})}midDrag(e,t,o,n){let i=o.id,a=q(o)[n],r=Wt(e.doc,i,n),d=r?.floors.flatMap(f=>f.rooms).find(f=>M(f.id,i));if(a===void 0||r===void 0||d===void 0)return;let l=[(a.a[0]+a.b[0])/2,(a.a[1]+a.b[1])/2],h=d.outline.reduce((f,g,c)=>Math.hypot(g[0]-l[0],g[1]-l[1])<Math.hypot(d.outline[f][0]-l[0],d.outline[f][1]-l[1])?c:f,0),p=f=>g=>{let c=Wt(g,i,n);return c===void 0||f===void 0?c:Ve(c,i,h,f)},u;e.drag(t,{move:f=>{this.dragging=!0,u=this.cornerTo(e,d,h,f),e.preview(p(u))},end:(f,g,c)=>{this.dragging=!1,e.preview(void 0),e.apply(p(c?u:void 0),{select:{kind:"corner",roomId:i,corner:h}})},cancel:()=>this.stopDrag(e)})}openingDrag(e,t,o,n){let i=o.id,a=o.openings[n];if(a===void 0)return;let r={kind:"opening",roomId:i,opening:n},d=[(a.a[0]+a.b[0])/2,(a.a[1]+a.b[1])/2],l,h;e.select(r),e.drag(t,{move:p=>{l??=p,this.dragging=!0,this.sliding={roomId:i,index:n};let u=[d[0]+p[0]-l[0],d[1]+p[1]-l[1]];h=u,e.preview(f=>Vo(f,i,n,u))},end:(p,u,f)=>{this.dragging=!1,this.sliding=void 0,e.preview(void 0);let g=h;f&&g!==void 0&&e.apply(c=>Vo(c,i,n,g),{select:r})},cancel:()=>this.stopDrag(e)})}stopDrag(e){this.dragging=!1,this.sliding=void 0,e.preview(void 0)}hover(e,t){this.tool!=="select"&&(this.hoverAt=t,e.redraw())}keyDown(e,t){let o=te(t,!1);if(typeof o=="object"&&"letter"in o){let n=qr(o.letter);return n===void 0?!1:(this.setTool(e,n),!0)}if(o==="cancel"&&(this.tool!=="select"||this.first!==void 0))return this.setTool(e,"select"),!0;if(o==="delete"){let n=e.selection;if(n?.kind==="corner")e.apply(i=>Gt(i,n.roomId,n.corner),{select:{kind:"room",roomId:n.roomId}});else if(n?.kind==="opening")e.apply(i=>Vt(i,n.roomId,n.opening),{select:{kind:"room",roomId:n.roomId}});else if(n?.kind==="wall")e.apply(i=>Uo(i,n.roomId,n.wall),{select:{kind:"room",roomId:n.roomId}});else return!1;return!0}return!1}cursor(){return this.tool==="select"?void 0:"crosshair"}leave(e){this.first=void 0,this.hoverAt=void 0,this.dragging=!1,this.sliding=void 0,this.tool="select",e.redraw()}dock(e){return m`<button type="button" class="hme-tb ${e.toggles.square?"on":""}" aria-pressed=${e.toggles.square?"true":"false"}
        title="A dragged corner lines up with the corners beside it" @click=${()=>e.setToggle("square",!e.toggles.square)}>Snap to 90°</button>`}viewItems(e){let t=[{label:"Grid 5 cm",on:e.toggles.grid,flip:()=>e.setToggle("grid",!e.toggles.grid)}];return e.scans!==void 0&&t.push({label:"Show scan as it was",on:e.toggles.scan,title:rr,flip:()=>e.setToggle("scan",!e.toggles.scan)}),t}pill(e){if(this.tool!=="select"){let a={split:this.first===void 0?"Click where the cut starts":"Click where it ends, across the room",inner:this.first===void 0?"Click where the wall starts":"Click where it ends",door:"Click a wall to put a door in it",window:"Click a wall to put a window in it",opening:"Click a wall to open a way through it",stairs:"Click in the room to put stairs there"};return m`<span class="hme-pill-name">${a[this.tool]}</span>
        <button type="button" class="hme-tb" @click=${()=>this.setTool(e,"select")}>Cancel</button>`}let t=this.focus(e),o=e.selection;if(t===void 0||o===void 0||this.dragging)return v;let n=t.id,i=S(t);if(o.kind==="wall"){let a=o.wall,r=this.wallAt,d=cn(t,a,i).replace(", "," \xB7 ");return m`<span class="hme-pill-name">${d}</span>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(e,t,a,"window",r)}>＋ Window here</button>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(e,t,a,"door",r)}>＋ Door here</button>
        <button type="button" class="hme-tb" @click=${()=>this.cornerHere(e,t,a,r)}>Add a corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(l=>Go(l,n,a))}>Straighten</button>`}if(o.kind==="corner")return m`<span class="hme-pill-name">${i} · corner</span>
        <button type="button" class="hme-tb" ?disabled=${t.outline.length<=3} @click=${()=>e.apply(a=>Gt(a,n,o.corner),{select:{kind:"room",roomId:n}})}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(a=>ve(a,n))}>Square the corners</button>`;if(o.kind==="opening"){let a=t.openings[o.opening];return a===void 0?v:m`<span class="hme-pill-name">${$e(a)}</span>
        <button type="button" class="hme-tb danger" @click=${()=>e.apply(r=>Vt(r,n,o.opening),{select:{kind:"room",roomId:n}})}>Remove</button>`}return m`<span class="hme-pill-name">${i}</span>
      <button type="button" class="hme-tb" @click=${()=>e.apply(a=>ve(a,n))}>Square the corners</button>`}addHere(e,t,o,n,i){let a=t.id,r=t.openings.length;e.apply(d=>Ut(d,a,o,{kind:n,...i===void 0?{}:{at:i}}),{select:{kind:"opening",roomId:a,opening:r}})}cornerHere(e,t,o,n){let i=t.id,a=p=>Wt(p,i,o,n),r=a(e.doc)?.floors.flatMap(p=>p.rooms).find(p=>M(p.id,i)),d=q(t)[o],l=n??(d===void 0?void 0:[(d.a[0]+d.b[0])/2,(d.a[1]+d.b[1])/2]),h=r===void 0||l===void 0?-1:r.outline.reduce((p,u,f)=>Math.hypot(u[0]-l[0],u[1]-l[1])<Math.hypot(r.outline[p][0]-l[0],r.outline[p][1]-l[1])?f:p,0);e.apply(a,{select:h<0?{kind:"room",roomId:i}:{kind:"corner",roomId:i,corner:h}})}inspector(e){let t=this.focus(e),o=e.selection;if(t===void 0||o===void 0){let p=fo(e.floor);return E("Shape",m`<p class="hme-text">Pick a room, then a wall or a corner. Drag a corner to move it; a corner two rooms share moves for both.</p>
        <p class="hme-text dim">${p.length===0?"The scan check found nothing to fix on this floor.":`The scan check found ${R(p.length,"thing")} to fix. They are marked in amber.`}</p>`)}let n=t.id;if(o.kind==="corner")return this.cornerCard(e,t,o.corner);let i=this.pickedWall(e,t);if(i===void 0){let p=So(e.scans,n),u=p!==void 0&&qo(t,p)?p:void 0;return E(S(t),m`
        ${L("Corners",m`<span class="hme-val">${t.outline.length}</span>`)}
        ${L("Walls",m`<span class="hme-val">${q(t).length}</span>`)}
        ${L("Wall height",F({label:"Wall height",value:t.height,unit:"m",min:.5,max:20,set:f=>e.apply(g=>st(g,n,f))}))}
        ${V("Click a wall to change it or put a door or window in it. Drag a corner to move it, or the dot in a wall's middle to add a corner.")}
        ${u===void 0?v:V("Its shape has changed since the iPhone scanned it.")}
        <div class="hme-row-end">
          ${u===void 0?v:m`<button type="button" class="hme-tb" title=${sr} @click=${()=>e.apply(f=>Xo(f,n,u))}>Back to the scan</button>`}
          <button type="button" class="hme-tb" @click=${()=>e.apply(f=>ve(f,n))}>Square the corners</button>
        </div>`)}let a=q(t)[i],r=t.openings.map((p,u)=>({o:p,i:u})).filter(({o:p})=>Ue(t,p)===i),d=o.kind==="opening"?t.openings[o.opening]:void 0,l=ge(a),h=p=>{let u=t.openings.length;e.apply(f=>Ut(f,n,i,{kind:p}),{select:{kind:"opening",roomId:n,opening:u}})};return m`
      ${E("Wall",m`
        ${L("Room",m`<span class="hme-val strong">${cn(t,i,S(t))}</span>`)}
        ${L("Length",F({label:"Length",value:l,unit:"m",min:.1,max:200,set:p=>e.apply(u=>Ni(u,n,i,p))}))}
        ${L("Thickness",F({label:"Thickness",value:a.t,unit:"m",min:.01,max:1,set:p=>e.apply(u=>Ki(u,n,i,p))}))}
        ${L("Height",F({label:"Wall height",value:t.height,unit:"m",min:.5,max:20,set:p=>e.apply(u=>st(u,n,p))}))}
        ${V("Type a length to move the far corner. Rooms that share the corner move with it.")}
        <div class="hme-row-end indent">
          <button type="button" class="hme-tb" @click=${()=>e.apply(p=>Go(p,n,i))}>Straighten</button>
          <button type="button" class="hme-tb" @click=${()=>e.apply(p=>ve(p,n))}>Square the corners</button>
          <button type="button" class="hme-tb" @click=${()=>this.cornerHere(e,t,i,void 0)}>Split wall</button>
          <button type="button" class="hme-tb danger" title="Take this wall away" @click=${()=>e.apply(p=>Uo(p,n,i),{select:{kind:"room",roomId:n}})}>Remove</button>
        </div>`)}
      ${E("On this wall",m`
        ${r.map(({o:p,i:u})=>{let f=Se(p.a,a.a,a.b).along,g=Se(p.b,a.a,a.b).along,c=o.kind==="opening"&&o.opening===u;return m`<button type="button" class="hme-list-row ${c?"on":""}" @click=${()=>e.select({kind:"opening",roomId:n,opening:u})}>
            <span class="hme-grow">${$e(p)}</span><span class="mono dim">${gt(Math.abs(g-f))} · ${gt(Math.max(0,Math.min(f,g)))} in</span></button>`})}
        ${r.length===0?m`<p class="hme-empty-line">Nothing on this wall.</p>`:v}
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${()=>h("door")}>＋ Door</button>
          <button type="button" class="hme-tb" @click=${()=>h("window")}>＋ Window</button>
          <button type="button" class="hme-tb" @click=${()=>h("opening")}>＋ Way through</button>
        </div>`)}
      ${d===void 0||o.kind!=="opening"?v:this.openingCard(e,t,o.opening,d)}`}openingCard(e,t,o,n){let i=t.id,a=Math.hypot(n.b[0]-n.a[0],n.b[1]-n.a[1]),r=n.z1-n.z0;return E($e(n),m`
      <div class="hme-pics">${Xr.map(d=>Q({label:d.label,picture:es[d.label],on:n.kind===d.kind&&n.style===d.style,click:()=>e.apply(l=>lt(l,i,o,{kind:d.kind,style:d.style??null}))}))}</div>
      ${L("Width",F({label:"Width",value:a,unit:"m",min:.1,max:20,set:d=>e.apply(l=>lt(l,i,o,{width:d}))}))}
      ${L("From floor",F({label:"From floor",value:n.z0,unit:"m",min:0,max:20,set:d=>e.apply(l=>lt(l,i,o,{z0:d,z1:d+r}))}),m`<span class="hme-l short">Tall</span>`,F({label:"Tall",value:r,unit:"m",min:.05,max:20,set:d=>e.apply(l=>lt(l,i,o,{z1:n.z0+d}))}))}
      ${V("Drag it along the wall. The plan shows the space to each corner.")}
      <div class="hme-row-end indent"><button type="button" class="hme-tb danger" @click=${()=>e.apply(d=>Vt(d,i,o),{select:{kind:"room",roomId:i}})}>Remove ${$e(n).toLowerCase()}</button></div>`)}cornerCard(e,t,o){let n=t.id,i=t.outline[o];if(i===void 0)return m``;let a=e.floor.rooms.filter(r=>!M(r.id,n)&&r.outline.some(d=>Math.hypot(d[0]-i[0],d[1]-i[1])<=.02));return E("Corner",m`
      ${L("Room",m`<span class="hme-val strong">${S(t)}</span>`)}
      ${L("Left, top",F({label:"Corner left",value:i[0],unit:"m",set:r=>e.apply(d=>Ve(d,n,o,[r,i[1]]))}),F({label:"Corner top",value:i[1],unit:"m",set:r=>e.apply(d=>Ve(d,n,o,[i[0],r]))}))}
      ${V(a.length===0?"Drag it on the plan. Drop it on another room's corner and the two move together after.":`Shared with ${a.map(S).join(", ")}, which move${a.length===1?"s":""} with it.`)}
      <div class="hme-row-end indent">
        <button type="button" class="hme-tb" ?disabled=${t.outline.length<=3} @click=${()=>e.apply(r=>Gt(r,n,o),{select:{kind:"room",roomId:n}})}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(r=>ve(r,n))}>Square the corners</button>
      </div>`)}},Jr={select:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3z" fill="none" stroke="currentColor" stroke-width="1.4"></path><circle cx="3" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="15" r="2" fill="currentColor"></circle><circle cx="3" cy="15" r="2" fill="currentColor"></circle></svg>`,split:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 3h14v12H2z" fill="none" stroke="currentColor" stroke-width="1.4"></path><path d="M9 1v16" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 2"></path></svg>`,inner:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="2.4"></path></svg>`,door:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 15h4M12 15h4M6 15V5M6 5a10 10 0 0 1 10 10" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`,window:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="1.4"></path><path d="M5 7h8M5 11h8" stroke="#8bb8f0" stroke-width="1.4"></path></svg>`,opening:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h4M12 9h4" stroke="currentColor" stroke-width="2.4"></path></svg>`,stairs:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3zM3 6h12M3 9h12M3 12h12" fill="none" stroke="currentColor" stroke-width="1.2"></path></svg>`},es={Door:m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V4M14 4a17 17 0 0 1 17 17" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Double door":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V7M48 21V7M14 7a14 14 0 0 1 14 14M48 7a14 14 0 0 0-14 14" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Sliding door":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18.5h20M28 23.5h20" stroke="#ece6da" stroke-width="2.4"></path></svg>`,Window:m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 18h34M14 24h34" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Sliding window":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18h20M28 24h20" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Way through":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h10M48 21h10" stroke="#ece6da" stroke-width="4"></path><path d="M14 27h34" stroke="#98989d" stroke-width="1" stroke-dasharray="3 3"></path></svg>`};var Rn=[{id:"pick",name:"Pick",label:"Pick and move",key:"v"},{id:"draw",name:"Room",label:"Draw a room",key:"r"},{id:"inner",name:"Wall",label:"Inner wall",key:"w"},{id:"door",name:"Door",label:"Door",key:"d"},{id:"window",name:"Window",label:"Window",key:"n"},{id:"measure",name:"Measure",label:"Measure",key:"m"}],ts={select:"Corners",split:"Split",inner:"Wall",door:"Door",window:"Window",opening:"Opening",stairs:"Stairs"};function os(s){return Rn.find(e=>e.key===s.toLowerCase())?.id}function ns(s){let e=Qi(s),t=s.pins.filter(a=>a.entityId.startsWith("light.")),o=t.filter(a=>!e.has(a.id.toUpperCase())).map(a=>a.id),n=s.rooms.length,i=s.rooms.reduce((a,r)=>a+r.objects.length,0);return{rooms:n,things:i,lights:t.length,loose:o,done:[n>0,i>0,t.length>0&&o.length===0]}}var bo=class{constructor(){this.arrange=new po;this.devices=new uo((e,t,o)=>this.arrange.piecePic(e,ht(t),o));this.shape=new go}tool(e){if(e.toggles.measure)return"measure";if(e.walls!==void 0)return this.shape.tool;if(this.arrange.draw.active)return"draw";let t=this.shape.tool;return t==="inner"||t==="door"||t==="window"?t:"pick"}setTool(e,t){if(t==="measure"){this.arrange.draw.stop(),this.shape.setTool(e,"select"),e.setToggle("measure",!e.toggles.measure),e.redraw();return}if(e.toggles.measure&&e.setToggle("measure",!1),t==="draw"){this.shape.setTool(e,"select"),this.arrange.draw.active||this.arrange.draw.start(e);return}this.arrange.draw.stop(e),this.shape.setTool(e,t==="pick"?"select":t)}picksPins(e){return ye(e.selection).length>0}overlay(e){return e.walls!==void 0?this.shape.overlay(e):k`${this.arrange.overlay(e)}${this.shape.armed?this.shape.ghost(e):v}${this.devices.overlay(e)}`}drawsPins(e){return e.walls===void 0}pointerDown(e,t,o){if(this.devices.choosing)return this.devices.cancelChooser(e),!0;if(e.walls!==void 0)return this.shape.pointerDown(e,t,o);if(this.arrange.draw.active)return this.arrange.draw.pointerDown(e,t,o);if(this.shape.armed)return this.shape.pointerDown(e,t,o);if(t.button!==0)return!1;if(this.arrange.pressHandle(e,t,o)||this.devices.pressHandle(e,t,o))return!0;let n=this.devices.heldThingAt(e,o);return n!==void 0&&this.arrange.pressThing(e,t,n,o)?!0:this.devices.pressPin(e,t,o)||this.devices.pressBox(e,t,o)||this.arrange.pressBody(e,t,o)}doubleClick(e,t,o){if(this.arrange.draw.active||this.shape.armed||e.walls===void 0&&this.devices.onPin(e,o))return;let n=W(e.floor,o);n===void 0||M(n.id,e.walls)||e.editWalls(n.id)}hover(e,t){e.walls===void 0&&this.arrange.hover(e,t),this.shape.hover(e,t)}keyDown(e,t){if(this.devices.chooserKey(e,t))return!0;let o=te(t,!1),n=typeof o=="object"&&"letter"in o?o.letter:void 0;if(n==="m")return this.setTool(e,"measure"),!0;if(e.walls!==void 0)return this.shape.keyDown(e,t)?!0:o==="cancel"?(e.editWalls(void 0),!0):!1;if(this.arrange.draw.active&&this.arrange.draw.keyDown(e,t))return!0;if(n==="f")return e.openAdd("furniture"),!0;let i=n===void 0?void 0:os(n);return i!==void 0?(this.setTool(e,i),!0):o==="cancel"&&this.shape.armed?(this.setTool(e,"pick"),!0):this.picksPins(e)?this.devices.keyDown(e,t):this.arrange.keyDown(e,t)}cursor(e){return e.walls!==void 0?this.shape.cursor():this.arrange.draw.active||this.shape.armed?"crosshair":void 0}leave(e){this.arrange.leave(e),this.devices.leave(),this.shape.leave(e)}dock(e){return e.walls!==void 0?this.shape.dock(e):this.arrange.dock(e)}viewItems(e){return e.walls!==void 0?this.shape.viewItems(e):[...this.arrange.viewItems(e),...this.devices.viewItems(e)]}pill(e){return e.walls!==void 0||this.shape.armed?this.shape.pill(e):this.arrange.draw.active?this.arrange.pill(e):this.picksPins(e)?this.devices.pill(e):this.arrange.pill(e)}banner(e){let t=this.wallsRoom(e);return t===void 0?v:m`<span class="hme-banner-t">Editing the walls of <b>${S(t)}</b></span>
      <button type="button" class="hme-tb hme-blue" title="Back to moving things (Esc)" @click=${()=>e.editWalls(void 0)}>Done <kbd>Esc</kbd></button>`}wallsRoom(e){return e.walls===void 0?void 0:e.floor.rooms.find(t=>M(t.id,e.walls))}stageExtra(e){let t=e.walls===void 0?this.devices.stageExtra(e):v,o=e.walls!==void 0?"Drag a corner \xB7 drag a wall's middle to add a corner \xB7 Esc when done":"Click picks what is on top \xB7 Double-click a room to edit its walls";return m`${this.toolRail(e)}${t}
      ${t===v&&e.stage.width>=900?m`<div class="hme-stage-hint">${o}</div>`:v}`}toolRail(e){let t=this.tool(e),o=e.walls!==void 0,n=o?[...vo.map(a=>({...a,name:ts[a.id]})),{id:"measure",name:"Measure",label:"Measure",key:"m"}]:[...Rn],i=new Set(o?[0]:[0,4]);return m`<div class="hme-toolrail" role="toolbar" aria-label=${o?"Wall tools":"Tools"} aria-orientation="vertical">
      ${n.map((a,r)=>m`<button type="button" class="hme-rtool ${t===a.id?"on":""}" aria-pressed=${t===a.id?"true":"false"}
          aria-label=${a.label} title=${`${a.label} (${a.key.toUpperCase()})`} @click=${()=>this.setTool(e,a.id)}>
          ${is(a.id)}<span class="hme-rtool-name">${a.name}</span></button>
        ${i.has(r)?m`<span class="hme-rtool-sep" aria-hidden="true"></span>`:v}`)}
    </div>`}inspector(e){if(e.walls!==void 0)return m`${this.shape.inspector(e)}
        ${this.shape.rail(e)}
        ${E("Leave this",m`<p class="hme-text dim">Press Esc, click Done, or click outside the room to go back to moving things. Double-click any room to edit its walls.</p>`)}`;if(this.picksPins(e))return this.devices.inspector(e);let t=e.selection;if(t===void 0)return this.startPanel(e);let o=t.kind==="object"?this.devices.thingCards(e,t.roomId,t.object):v;return o===v?this.arrange.inspector(e):m`${o}${this.arrange.inspector(e)}`}startPanel(e){let t=e.floor,o=ns(t),n=o.done.indexOf(!1),i=o.loose.length,a=(h,p,u,f=v)=>{let g=o.done[h]?"done":h===n?"now":"next";return m`<div class="hme-step ${g}">
        <span class="hme-step-no" aria-label=${o.done[h]?"Done":`Step ${h+1}`}>${o.done[h]?"\u2713":String(h+1)}</span>
        <div class="hme-step-t"><b>${p}</b><span>${u}</span>${f}</div>
      </div>`},r=o.rooms>0?`${R(o.rooms,"room")} on ${j(t)}. Draw one with Room, or scan one with the iPhone.`:"Draw one with Room, or scan one with the iPhone.",d=o.things>0?`${R(o.things,"thing")}. Add more from Add \u203A Furniture.`:"None yet. Add a sofa, a bed or a lamp from Add \u203A Furniture.",l=o.lights===0?"No lights yet. Add one from Add \u203A Devices and pick its lamp.":i>0?`${R(i,"light")} ${i===1?"sits":"sit"} loose. Drop each one on its lamp, or add a light from Add \u203A Devices and pick its lamp.`:`Every light sits in a lamp (${o.lights}).`;return m`
      ${E("Start here",m`<div class="hme-steps">
        ${a(0,"Rooms",r,o.rooms>0?v:m`<button type="button" class="hme-link" @click=${()=>this.startDrawing(e)}>Draw a room ›</button>`)}
        ${a(1,"Furniture",d,m`<button type="button" class="hme-link" @click=${()=>e.openAdd("furniture")}>Add › Furniture</button>`)}
        ${a(2,"Lights in lamps",l,i===0?v:m`<button type="button" class="hme-link" title="Pick every light no lamp holds" @click=${()=>e.select(eo(o.loose))}>Show me the loose lights</button>`)}
      </div>`,`${o.done.filter(Boolean).length} of 3 done`,"hme-start")}
      ${this.arrange.floorCard(e,t)}
      <section class="hme-card hme-tips-card">
        <details class="hme-tips">
          <summary>Keys and tips <span aria-hidden="true">›</span></summary>
          <p class="hme-text">Click picks what is on top: a device, then a thing (a sofa, a TV, a desk), then the room under them. Drag it to move it.</p>
          <p class="hme-text dim">A dragged room lines up with the walls of the rooms round it. Drag the round handle above it to turn it, or a square handle on its box to resize it. Double-click a room to edit its walls, doors and windows.</p>
          <p class="hme-text dim">Shift, Cmd or Ctrl and a click picks several devices; Cmd or Ctrl and a click picks several things, to colour or hide them together. Drag a device from Add onto the plan to place it.</p>
          <p class="hme-text dim">Press <kbd>?</kbd> or the ? button in the bar for every key.</p>
          <dl class="hme-keys">
            ${In(ft()).filter(h=>h.title!=="Mouse"&&h.title!=="A room's walls").flatMap(h=>h.keys).map(([h,p])=>m`<dt><kbd>${h}</kbd></dt><dd>${p}</dd>`)}
          </dl>
        </details>
      </section>`}sheet(e){let t=this.devices.lampChooser(e);return t===v?this.arrange.sheet(e):t}dragOver(e,t,o){return e.walls===void 0&&this.devices.dragOver(e,t,o)}drop(e,t,o){e.walls===void 0&&this.devices.drop(e,t,o)}startDrawing(e){this.setTool(e,"draw")}};function In(s){let e=s?"\u2318":"Ctrl";return[{title:"Tools",keys:Rn.map(t=>[t.key.toUpperCase(),t.label])},{title:"Add",keys:[["A","Add a device or furniture"],["F","Add furniture"]]},{title:"Edit",keys:[["Delete","Remove what is picked"],["Arrows","Nudge it 1 cm, with Shift 10 cm"],["Enter","Close the room being drawn"],["Backspace","Take back the last corner drawn"],["Esc","Back out: a tool, a thing to its room, a room's walls"],[s?"\u2318Z":"Ctrl+Z","Undo"],[s?"\u21E7\u2318Z":"Ctrl+Shift+Z or Ctrl+Y","Redo"]]},{title:"A room's walls",keys:[...vo.map(t=>[t.key.toUpperCase(),t.label]),["M","Measure"],["Esc","Done with the walls"]]},{title:"View",keys:[["Space","Hold and drag to pan"],["+ \u2212","Zoom in and out"],["0","Fit the floor"],["?","Show or hide these keys"]]},{title:"Mouse",keys:[["Click","Pick what is on top: a device, a thing, then the room"],["Double-click","Edit a room's walls, doors and windows"],[`Shift or ${e} click`,"Pick several devices"],[`${e} click`,"Pick several things"],["Shift drag","Pick every device in a box"],["Drag in 3D","Turn the model; scroll to zoom"]]}]}function is(s){switch(s){case"pick":return m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 2.5v11.5l3.1-3 2.3 5 2-.9-2.3-4.9h4.4z" fill="currentColor"></path></svg>`;case"draw":return m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 15V3h8l4 4v8z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2.5 2"></path></svg>`;case"measure":return m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14M2 6v6M16 6v6M6 9v-2M9 9V6M12 9v-2" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`;default:return hr(s)}}var as=[["lights","Lights"],["sensors","Sensors"],["climate","Climate"],["switches","Switches and plugs"],["media","Media"],["covers","Covers"],["locks","Locks"],["other","Other"]],ue="*",yo="",Dn=200;function rs(s){switch(ma(s)){case"lights":return"lights";case"sensors":return"sensors";case"climate":return"climate";case"power":return"switches";case"media":return"media";case"covers":return"covers";case"security":return s.startsWith("lock.")?"locks":"other";default:return"other"}}function wo(s){let e=s.selection,t=me(e)??s.walls;if(t!==void 0)return s.floor.rooms.find(n=>M(n.id,t));if(e?.kind!=="pin")return;let o=s.floor.pins.find(n=>M(n.id,e.pinId));return o===void 0?void 0:se(s.floor,o)}function mr(s){return Me(s.view,[s.stage.width/2,s.stage.height/2])}function ss(s){return wo(s)??W(s.floor,mr(s))}function ds(s,e){let t=mr(s);return de(e.outline,t)?t:U(e)??X(e)}function ls(s,e){return e.trim()===""?s.filter(t=>t.category===void 0&&da.has(t.domain)):pa(s,e,1/0)}function hs(s,e){return e===ue?!0:e===yo?s.areaId===void 0:s.areaId===e}function ps(s,e,t,o){let n=new Map,i=new Map(s.areas.map(p=>[p.id,p.name])),a=0;for(let p of e){if(p.areaId===void 0){a+=1;continue}n.set(p.areaId,(n.get(p.areaId)??0)+1),i.has(p.areaId)||i.set(p.areaId,p.areaName??p.areaId)}let r=[],d=(p,u=!1)=>{p===void 0||p===""||r.includes(p)||!u&&(n.get(p)??0)===0||r.push(p)};d(t,!0);for(let p of s.floor.rooms)d(p.areaId);let l=[...n.keys()].sort((p,u)=>(i.get(p)??p).localeCompare(i.get(u)??u));for(let p of l)d(p);o!==ue&&d(o,!0);let h=r.map(p=>({id:p,name:i.get(p)??p,count:n.get(p)??0}));return(a>0||o===yo)&&h.push({id:yo,name:"No area",count:a}),h.push({id:ue,name:"All areas",count:e.length}),h}function pr(s,e){let t=new Map;for(let o of s){if(!hs(o,e))continue;let n=rs(o.entityId),i=t.get(n);i===void 0&&t.set(n,i=[]),i.push(o)}return as.filter(([o])=>t.has(o)).map(([o,n])=>({kind:o,label:n,devices:t.get(o)}))}function ms(s,e){if(e.startsWith("light.")){let t=Yt(s,e).length;return t===0?void 0:`${t} on map`}return Ae(s,e)===void 0?void 0:"on map"}function cs(s){let e=s;e?.focus!==void 0&&setTimeout(()=>e.focus?.(),0)}function us(s){let e=s;e?.showModal!==void 0&&queueMicrotask(()=>{e.isConnected&&e.open!==!0&&e.showModal?.()})}var ko=class{constructor(e,t){this.devices=e;this.picture=t;this.tab="devices";this.query="";this.area=ue;this.areaChosen=!1;this.pieceQuery="";this.pieceGroup="";this.focus=!1}open(e,t="devices",o){this.choice=o,this.tab=o===void 0?t:"devices",this.query="",this.pieceQuery="",this.pieceGroup="",this.roomId=void 0,this.area=o===void 0?wo(e)?.areaId??ue:ue,this.areaChosen=!1,this.focus=!0}setTab(e,t){this.tab!==t&&(this.tab=t,this.focus=!0,e.redraw())}furnitureRoom(e){let t=ss(e);if(t!==void 0)return t;let o=this.roomId;return o===void 0?void 0:e.floor.rooms.find(n=>M(n.id,o))}addDevice(e,t,o){let n=this.choice;if(n!==void 0){o(),n.pick(t.entityId);return}let i=wo(e),a=i===void 0?void 0:U(i)??X(i);o(),t.entityId.startsWith("light.")?this.devices.addLight(e,t.entityId,a,t.areaId):this.devices.place(e,t.entityId,a,t.areaId)}addPiece(e,t,o){let n=this.furnitureRoom(e);if(n===void 0)return;let i=n.id,a=n.objects.length,r=ds(e,n);o(),e.apply(d=>Ai(d,i,t,r),{select:{kind:"object",roomId:i,object:a}})||e.note("warn","That piece could not be added: a room holds at most 256 things.")}render(e,t){let o=wo(e),n=this.choice,i=n?.title??`Add to ${o===void 0?j(e.floor):S(o)}`,a=this.focus;this.focus=!1;let r=_e(l=>{a&&cs(l)}),d=(l,h)=>m`<button type="button" role="tab" id=${`hma-tab-${l}`} class=${this.tab===l?"on":""}
      aria-selected=${this.tab===l?"true":"false"} aria-controls="hma-panel" @click=${()=>this.setTab(e,l)}>${h}</button>`;return m`<dialog class="hma" aria-labelledby="hma-title" ${_e(us)}
      @cancel=${l=>{l.preventDefault(),t()}}
      @keydown=${l=>{l.stopPropagation(),l.key==="Escape"&&(l.preventDefault(),t())}}
      @pointerdown=${l=>{l.target===l.currentTarget&&t()}}>
      <div class="hma-in">
        <div class="hma-head">
          <h3 id="hma-title">${i}</h3>
          <button type="button" class="hme-x hma-close" aria-label="Close" title="Close (Esc)" @click=${t}>×</button>
        </div>
        ${n===void 0?m`<div class="hme-seg hma-tabs" role="tablist" aria-label="What to add">${d("devices","Devices")}${d("furniture","Furniture")}</div>`:v}
        <div class="hma-panel" id="hma-panel" role=${n===void 0?"tabpanel":"group"} aria-labelledby=${n===void 0?`hma-tab-${this.tab}`:"hma-title"}>
          ${this.tab==="devices"?this.devicesTab(e,o,t,r):this.furnitureTab(e,t,r)}
        </div>
      </div>
    </dialog>`}devicesTab(e,t,o,n){let i=e.hass?.states,a=this.choice,r=ha(e.hass),d=a===void 0?r:r.filter(w=>(!a.lightsOnly||w.domain==="light")&&w.entityId!==a.now),l=ls(d,this.query);!this.areaChosen&&this.area!==ue&&pr(l,this.area).every(w=>w.devices.length===0)&&(this.area=ue);let h=ps(e,l,t?.areaId,this.area),p=pr(l,this.area),u=p.reduce((w,H)=>w+H.devices.length,0),f=Dn,g=p.map(w=>{let H=w.devices.slice(0,Math.max(f,0));return f-=H.length,{...w,devices:H}}).filter(w=>w.devices.length>0),c=this.area===ue?"in any area":this.area===yo?"with no area":`in ${h.find(w=>w.id===this.area)?.name??"this area"}`,b=this.query.trim()!=="",y=a?.lightsOnly===!0?"light":"device";return m`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find a ${y}" aria-label="Find a ${y}" autofocus .value=${G(this.query)} ${n}
          @input=${w=>{this.query=w.target.value,e.redraw()}} /></label>
      <div class="hme-chips hma-chips" role="group" aria-label="Areas">
        ${h.map(w=>{let H=w.id===this.area;return m`<button type="button" class="hme-chip sel ${H?"on":""}" aria-pressed=${H?"true":"false"}
            @click=${()=>{this.area=w.id,this.areaChosen=!0,e.redraw()}}>${w.name}<span class="hma-n">${w.count}</span></button>`})}
      </div>
      <div class="hma-list">
        ${u===0?m`<p class="hma-empty">${b?`Nothing by that name ${c}.`:`No ${y}s ${c}.`}</p>`:v}
        ${g.map(w=>m`<section class="hma-sec">
          <div class="hme-h">${w.label}<span class="hme-h-end">${w.devices.length}</span></div>
          ${w.devices.map(H=>this.deviceRow(e,H,i,o))}
        </section>`)}
        ${u>Dn?m`<p class="hma-empty">Showing ${Dn} of ${u}. Type to narrow the list.</p>`:v}
      </div>
      <div class="hma-foot">
        <span class="hma-count">${R(u,y)}</span>
      </div>`}deviceRow(e,t,o,n){let i=t.entityId.startsWith("light."),a=ms(e.doc,t.entityId),r=this.choice,d=r!==void 0?r.rowTitle(t.name):i?"Add it in a lamp. A light can be on the map many times.":a===void 0?"Put it on the map":"On the map: click to pick it",l=pe(t.entityId,t.deviceClass,t.name);return m`<button type="button" class="hma-row ${r===void 0&&!i&&a!==void 0?"placed":""}" title=${d}
      @click=${()=>this.addDevice(e,t,n)}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${ee(l,"currentColor",24,2)}</svg></span>
      <span class="hma-nm"><span>${t.name}</span><small class="mono">${t.entityId}</small></span>
      <span class="hma-state">${J(t.entityId,o)}</span>
      ${a===void 0?v:m`<span class="hma-tag">${a}</span>`}
    </button>`}furnitureTab(e,t,o){let n=this.furnitureRoom(e),i=En(this.pieceQuery,this.pieceGroup).filter(d=>d.pieces.length>0),a=["",...Le.groups],r=d=>Le.pieces.filter(l=>d===""||l.group===d).length;return m`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find a piece: sofa, lamp, desk" aria-label="Find a piece" autofocus .value=${G(this.pieceQuery)} ${o}
          @input=${d=>{this.pieceQuery=d.target.value,e.redraw()}} /></label>
      <div class="hme-chips hma-chips" role="group" aria-label="Groups">
        ${a.map(d=>{let l=d===this.pieceGroup;return m`<button type="button" class="hme-chip sel ${l?"on":""}" aria-pressed=${l?"true":"false"}
            @click=${()=>{this.pieceGroup=d,e.redraw()}}>${d===""?"All":d}<span class="hma-n">${r(d)}</span></button>`})}
      </div>
      ${n===void 0?this.askRoom(e):m`<p class="hma-where">Into <b>${S(n)}</b>: each piece stands against the nearest free wall, facing into the room. Drag it into place after.</p>`}
      <div class="hma-list">
        ${i.length===0?m`<p class="hma-empty">No piece by that name${this.pieceGroup===""?"":` in ${this.pieceGroup}`}.</p>`:v}
        ${i.map(d=>m`<section class="hma-sec">
          <div class="hme-h">${d.title}<span class="hme-h-end">${R(d.pieces.length,"piece")}</span></div>
          <div class="hma-grid">${d.pieces.map(l=>m`<button type="button" class="hme-fcard" ?disabled=${n===void 0}
            title=${`Add ${l.name}, ${Ke(l)}`} @click=${()=>this.addPiece(e,l,t)}>
            ${this.picture(e,l,"hme-fcard-pic")}
            <span class="hme-fcard-name">${l.name}</span>
            <span class="hme-fcard-size mono">${Ke(l)}</span>
          </button>`)}</div>
        </section>`)}
      </div>`}askRoom(e){return e.floor.rooms.length===0?m`<p class="hma-where warn">Draw or scan a room first, then add its furniture.</p>`:m`<div class="hma-ask">
      <p class="hma-where warn">Which room is it for? Pick one, or pick a room on the plan first.</p>
      <div class="hme-chips hma-chips" role="group" aria-label="Rooms">
        ${e.floor.rooms.map(t=>m`<button type="button" class="hme-chip sel" aria-pressed="false"
          @click=${()=>{this.roomId=t.id,e.redraw()}}>${S(t)}</button>`)}
      </div>
    </div>`}},cr=Pt`
  dialog.hma {
    width: min(600px, calc(100vw - 32px)); max-width: none; padding: 0; border: 1px solid var(--wa-line-strong); border-radius: 16px;
    background: var(--wa-card); color: var(--wa-ink); box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
  }
  dialog.hma::backdrop { background: rgba(0, 0, 0, 0.45); }
  .hma-in { display: flex; flex-direction: column; gap: 12px; padding: 20px; min-width: 0; }
  .hma-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
  .hma-head h3 { font-size: 17px; font-weight: 600; overflow-wrap: anywhere; }
  .hme-x.hma-close { width: 30px; height: 30px; font-size: 20px; margin: -4px -6px 0 0; }
  .hma-tabs { align-self: flex-start; }
  .hma-panel { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
  .hma-chips { max-height: 64px; overflow: auto; }
  .hma-n { margin-left: 6px; color: var(--wa-faint); font-variant-numeric: tabular-nums; }
  .hme-chip.sel.on .hma-n { color: inherit; opacity: 0.7; }
  /* A fixed height, so the dialog does not grow and shrink with every
     letter typed. */
  .hma-list {
    height: min(380px, 46vh); overflow: auto; overscroll-behavior: contain; padding: 4px 6px 8px;
    border: 1px solid var(--wa-line); border-radius: 12px; background: var(--wa-raised, var(--wa-card));
    display: flex; flex-direction: column; gap: 8px;
  }
  .hma-sec { display: flex; flex-direction: column; gap: 2px; }
  .hma-sec > .hme-h { padding: 8px 6px 4px; }
  button.hma-row {
    display: flex; align-items: center; gap: 10px; width: 100%; min-height: 42px; padding: 5px 8px; flex: none;
    border: 0; border-radius: 8px; background: none; color: var(--wa-ink); font: inherit; font-size: 13px; text-align: left; cursor: pointer;
  }
  button.hma-row:hover { background: var(--wa-hover); }
  button.hma-row:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--hme-sel); }
  .hma-nm { flex: 1; min-width: 0; display: flex; flex-direction: column; line-height: 1.25; }
  .hma-nm > span { font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hma-nm > small { color: var(--wa-faint); font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hma-state { flex: 0 1 auto; max-width: 30%; color: var(--wa-muted); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hma-tag { flex: none; padding: 1px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; color: var(--hme-sel); background: var(--hme-sel-bg); white-space: nowrap; }
  .hma-empty { padding: 14px 10px; font-size: 13px; color: var(--wa-muted); }
  .hma-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .hma-count { font-size: 12.5px; color: var(--wa-muted); }
  .hma-where { font-size: 12.5px; line-height: 1.4; color: var(--wa-muted); }
  .hma-where b { color: var(--wa-ink); font-weight: 600; }
  .hma-where.warn { color: var(--wa-soft); }
  .hma-ask { display: flex; flex-direction: column; gap: 8px; }
  .hma-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(124px, 1fr)); gap: 8px; padding: 0 2px; }
  .hma-grid .hme-fcard:disabled { opacity: 0.5; cursor: default; }
  .hma-grid .hme-fcard:disabled:hover { border-color: var(--wa-line); background: var(--wa-input); }
`;function gr(s){return{get:()=>Et(s),save:(e,t)=>Kn(s,e,t)}}var vr="The map had changed on another device. Your change was saved on top of it.",fs="The map changed on another device, and your change no longer fits it. It now shows the map as saved there.",gs="The map changed again while saving, so your change was not saved. Try it once more.",xt="Not saved yet. Trying again.",vs=2e4;function Mo(){return{v:qn,floors:[]}}var bs=new Set(["unavailable","timeout"]);function An(s){let e=Te(s).code;return e===void 0||bs.has(e)}function ur(s,e){let{code:t,message:o}=Te(s);switch(console.warn(`Home map: Home Assistant refused the save (${t??"no code"}): ${o}`),t){case"invalid":{let{path:n,problem:i}=Yn(o);return`Not saved. ${Xn(e,n,i)}`}case"too_large":return"Not saved. The map is too big to save. Take out some rooms or things.";case"conflict":return gs;case"unauthorized":return"Not saved. Home Assistant did not let this login save the map. Sign in again and try once more.";case"invalid_format":return"Not saved. Home Assistant could not read the map sent. Reload the page and try again.";case"unknown_command":return"Not saved. Update the Wrist Assistant integration to save the map here.";case"unavailable":case"timeout":return"Not saved. Home Assistant could not be reached. Try again in a moment.";default:return"Not saved. Home Assistant did not take the change. Try again."}}function Ln(s){let{code:e,message:t}=Te(s);switch(console.warn(`Home map: the map could not be read (${e??"no code"}): ${t}`),e){case"unauthorized":return"Home Assistant did not let this login read it. Sign in again.";case"unavailable":return"Wrist Assistant is still starting. Try again in a moment.";case void 0:return"Home Assistant could not be reached. Check the connection and try again.";default:return"Home Assistant could not send it. Try again."}}function ws(s){return{doc:nt(s?.doc)??null,rev:typeof s?.rev=="number"?s.rev:0}}function $o(s){return Array.isArray(s)?`[${s.map($o).join(",")}]`:typeof s=="object"&&s!==null?`{${Object.entries(s).filter(([,t])=>t!==void 0).sort(([t],[o])=>t<o?-1:t>o?1:0).map(([t,o])=>`${JSON.stringify(t)}:${$o(o)}`).join(",")}}`:JSON.stringify(s)}function xo(s,e){return s===e?!0:s==null||e==null?!1:$o(s)===$o(e)}function On(s){let e,t=new Promise((o,n)=>{e=setTimeout(()=>n({code:"timeout",message:"Home Assistant did not answer."}),vs)});return Promise.race([s,t]).finally(()=>clearTimeout(e))}function fr(s,e){let t=typeof e=="function"?e(s):Jn(s,e);if(t===void 0)return;let o=ot(t);return o.ok?{doc:o.doc}:(console.warn(`Home map: not saved, as the store would refuse it: ${o.message}`),{text:`Not saved. ${o.text}`})}async function br(s,e,t,o){let n=fr(e.doc??Mo(),t);if(n===void 0)return{ok:!1,text:"That is no longer on the map."};if("text"in n)return{ok:!1,text:n.text};try{let r=await On(s.save(n.doc,e.rev));return{ok:!0,read:{doc:n.doc,rev:r.rev},merged:!1}}catch(r){if(An(r))return{ok:!1,retry:!0,text:xt,sent:n.doc};if(Te(r).code!=="conflict")return{ok:!1,text:ur(r,n.doc)}}let i;try{i=ws(await On(s.get()))}catch(r){return An(r)?{ok:!1,retry:!0,text:xt,sent:o??n.doc}:{ok:!1,text:`Not saved. The map changed on another device and could not be read again. ${Ln(r)}`}}for(let r of[o,n.doc])if(r!==void 0&&i.doc!==null&&xo(i.doc,r))return{ok:!0,read:{doc:i.doc,rev:i.rev},merged:!1};let a=fr(i.doc??Mo(),t);if(a===void 0)return{ok:!1,text:fs,read:i};if("text"in a)return{ok:!1,text:a.text,read:i};try{let r=await On(s.save(a.doc,i.rev));return{ok:!0,read:{doc:a.doc,rev:r.rev},merged:!0}}catch(r){return An(r)?{ok:!1,retry:!0,text:xt,sent:a.doc}:{ok:!1,text:ur(r,a.doc),read:i}}}function ys(s){return Math.min(3e4,1e3*2**Math.max(0,s-1))}var _n=new Set;function yr(){for(let s of _n)if(s.busy)return!0;return!1}function wr(s,e){return t=>xo(t,s)?e:void 0}function ks(s){return s.length===1?s[0]:e=>s.reduce((t,o)=>t===void 0?void 0:o(t),e)}var Ho=class{constructor(e,t,o=()=>{},n=()=>{},i){this.api=e;this.changed=o;this.saved=n;this.state={kind:"saved"};this.queue=[];this.failures=0;this.confirmed=t,this.doc=t.doc,this.history=new sa(i)}get busy(){return this.queue.length>0||this.pending!==void 0||this.running!==void 0}get canUndo(){return this.doc!==null&&this.history.canUndo}get canRedo(){return this.doc!==null&&this.history.canRedo}load(e){return this.busy?!1:(this.confirmed=e,this.doc=e.doc,this.history.clear(),this.changed(),!0)}apply(e){let t=this.doc;if(t===null)return!1;let o=this.checked(e(t));return o===void 0?!1:(this.history.push(t),this.doc=o,this.enqueue(e),!0)}begin(e){let t=this.doc??Mo();if(t.floors.length>0)return!1;let o=this.checked(e(t));return o===void 0?!1:(this.doc=o,this.enqueue(e),!0)}undo(){let e=this.doc;if(e===null)return!1;let t=this.history.undo(e);return t===void 0?!1:(this.doc=t,this.enqueue(wr(e,t)),!0)}redo(){let e=this.doc;if(e===null)return!1;let t=this.history.redo(e);return t===void 0?!1:(this.doc=t,this.enqueue(wr(e,t)),!0)}retryNow(){this.wake?.()}async idle(){for(;this.running!==void 0;)await this.running}dismissNote(){this.note=void 0,this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed()}checked(e){if(e===void 0)return;let t=ot(e);if(!t.ok){console.warn(`Home map: an edit was not made, as the store would refuse it: ${t.message}`),this.note={kind:"err",text:t.text},this.changed();return}return t.doc}enqueue(e){this.queue.push(e),_n.add(this),this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed(),this.kick()}kick(){this.running===void 0&&(this.running=this.run().finally(()=>{this.running=void 0,this.queue.length>0||this.pending!==void 0?this.kick():(_n.delete(this),this.changed())}))}pause(e){return new Promise(t=>{let o=setTimeout(i,e),n=this;function i(){clearTimeout(o),n.wake===i&&(n.wake=void 0),t()}this.wake=i})}async run(){for(;this.pending!==void 0||this.queue.length>0;){let e=this.pending??{ops:this.queue.splice(0),sent:void 0};this.pending=void 0,this.state.kind!=="waiting"&&(this.state={kind:"saving"}),this.changed();let t=await br(this.api,this.confirmed,ks(e.ops),e.sent);if(t.ok){this.failures=0,this.state={kind:"saving"},this.confirmed=t.read,this.saved(t.read),t.merged?(this.note={kind:"warn",text:vr},this.history.clear(),this.doc=this.rebased()):this.queue.length===0&&(this.doc=t.read.doc);continue}if(t.retry===!0){this.pending={ops:e.ops,sent:t.sent??e.sent},this.failures+=1,this.state={kind:"waiting",text:xt},this.changed(),await this.pause(ys(this.failures));continue}this.failures=0,this.queue=[],this.history.clear(),t.read!==void 0&&(this.confirmed=t.read,this.saved(t.read)),this.doc=this.confirmed.doc,this.note={kind:"err",text:t.text},this.state={kind:"error",text:t.text},this.changed();return}this.state={kind:"saved"}}rebased(){let e=this.confirmed.doc;if(e===null)return null;let t=[];for(let o of this.queue){let n=o(e);if(n===void 0)continue;let i=ot(n);i.ok&&(e=i.doc,t.push(o))}return this.queue=t,e}};var kr=Pt`
  :host {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
    container-type: inline-size;
    color: var(--wa-ink);
    background: var(--wa-bg);
    font-size: 13px;
    --hme-sel: #5b8def;
    --hme-sel-bg: rgba(91, 141, 239, 0.16);
    --hme-amber: #ffb340;
    --hme-thumb-bg: var(--wa-input);
    --hme-mono: var(--wa-mono, "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace);
  }
  * { box-sizing: border-box; }
  h3, p { margin: 0; }
  .mono { font-family: var(--hme-mono); }
  .dim { color: var(--wa-faint); }

  /* ── the page ─────────────────────────────────────────────────────── */
  .hme { display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; }
  .hme-body {
    flex: 1 1 auto;
    min-height: 600px;
    display: grid;
    grid-template-columns: minmax(300px, 380px) minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
    grid-template-areas: "insp stage";
    gap: 12px;
    padding: 12px;
  }
  .hme-insp { grid-area: insp; }
  .hme-stage-wrap { grid-area: stage; position: relative; min-width: 0; min-height: 520px; }
  .hme-insp { display: flex; flex-direction: column; gap: 10px; min-width: 0; min-height: 0; overflow: auto; }

  @container (max-width: 1000px) {
    .hme-body { grid-template-columns: minmax(260px, 320px) minmax(0, 1fr); }
  }
  @container (max-width: 760px) {
    .hme-body { display: flex; flex-direction: column; min-height: 0; }
    .hme-stage-wrap { flex: none; height: max(420px, 64vh); order: 0; }
    .hme-insp { overflow: visible; order: 1; }
    .hme-bar { gap: 10px; }
    .hme-hint { margin-left: 0; }
    .hme-row-end.indent { padding-left: 0; }
  }

  /* ── buttons ──────────────────────────────────────────────────────── */
  .hme-tb, .hme-menu {
    height: 30px;
    padding: 0 12px;
    border-radius: 8px;
    border: 1px solid var(--wa-line-strong);
    background: var(--wa-card);
    color: var(--wa-soft);
    font: inherit;
    font-size: 13px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    cursor: pointer;
    white-space: nowrap;
    flex: none;
  }
  .hme-tb:hover:not(:disabled), .hme-menu:hover { background: var(--wa-hover); color: var(--wa-ink); }
  .hme-tb:focus-visible, .hme-menu:focus-within { outline: none; box-shadow: var(--wa-ring, 0 0 0 2px var(--hme-sel)); }
  .hme-tb.on { background: var(--wa-raise); color: var(--wa-ink); }
  .hme-tb:disabled { opacity: 0.42; cursor: default; }
  .hme-tb.danger { color: var(--wa-need); }
  .hme-tb.primary { background: var(--wa-primary-bg); color: var(--wa-primary-ink); border-color: transparent; }
  .hme-tb.primary.danger-fill { background: var(--wa-need); color: #fff; }
  /* The Add button, the editor's one way in for devices and furniture,
   * floating in the plan's top left corner in the picked blue so it is the
   * first thing a new user finds. */
  .hme-add-btn {
    position: absolute; left: 14px; top: 14px; z-index: 4;
    height: 40px; padding: 0 16px 0 12px; border: 0; border-radius: 12px;
    background: var(--hme-sel); color: #fff; font-family: inherit; font-size: 14px; font-weight: 600; line-height: 1;
    display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
  }
  .hme-add-btn span { font-size: 18px; font-weight: 500; }
  .hme-add-btn:hover { background: color-mix(in srgb, var(--hme-sel) 86%, #fff); }
  .hme-add-btn:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
  .hme-tb.hme-icon { width: 30px; padding: 0; font-size: 15px; }
  .hme-tb.hme-wide { width: 100%; height: 36px; }
  .hme-tb.push { margin-left: auto; }
  .hme-menu { position: relative; padding: 0; }
  .hme-menu select {
    appearance: none;
    -webkit-appearance: none;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    height: 100%;
    padding: 0 28px 0 12px;
    cursor: pointer;
    outline: none;
  }
  .hme-menu-caret { position: absolute; right: 10px; pointer-events: none; color: var(--wa-faint); font-size: 11px; }
  .hme-link { border: 0; background: none; padding: 0; color: var(--hme-sel); font: inherit; font-size: 13px; cursor: pointer; white-space: nowrap; }
  .hme-link:hover { text-decoration: underline; }
  .hme-x { border: 0; background: none; color: var(--wa-faint); font-size: 16px; line-height: 1; width: 22px; height: 22px; border-radius: 6px; cursor: pointer; flex: none; }
  .hme-x:hover { background: var(--wa-hover); color: var(--wa-need); }

  .hme-seg { display: inline-flex; padding: 3px; gap: 2px; border-radius: 10px; background: var(--wa-card); border: 1px solid var(--wa-line); flex: none; }
  .hme-seg button {
    height: 28px; padding: 0 14px; border: 0; border-radius: 7px; background: transparent; color: var(--wa-muted);
    font: inherit; font-size: 13px; font-weight: 500; cursor: pointer;
  }
  .hme-seg button:hover { color: var(--wa-ink); }
  .hme-seg button.on { background: var(--wa-raise); color: var(--wa-ink); }
  .hme-seg button:focus-visible { outline: none; box-shadow: var(--wa-ring, 0 0 0 2px var(--hme-sel)); }

  /* ── the bar ──────────────────────────────────────────────────────── */
  .hme-bar {
    min-height: 58px; display: flex; align-items: center; gap: 14px; padding: 8px 16px; flex-wrap: wrap;
    border-bottom: 1px solid var(--wa-line); background: var(--wa-raised);
  }
  .hme-back { border: 0; background: none; color: var(--wa-muted); font: inherit; font-size: 13px; cursor: pointer; padding: 0; }
  .hme-back:hover { color: var(--wa-ink); }
  .hme-vsep { width: 1px; height: 22px; background: var(--wa-line-strong); flex: none; }
  .hme-title { font-size: 15px; }
  .hme-beta { font-size: 10px; border: 1px solid var(--wa-line-strong); border-radius: 6px; padding: 1px 6px; color: var(--wa-muted); letter-spacing: 0.06em; }
  .hme-flex { flex: 1 1 0; min-width: 0; }
  .hme-floor-wrap { position: relative; }
  .hme-tb.hme-floor-btn { height: 38px; padding: 0 12px 0 8px; gap: 10px; }
  .hme-floor-t { display: flex; flex-direction: column; align-items: flex-start; line-height: 1.2; text-align: left; }
  .hme-floor-t > span { color: var(--wa-ink); font-weight: 600; }
  .hme-floor-t > small { color: var(--wa-faint); font-size: 11px; }
  .hme-caret { color: var(--wa-muted); font-size: 11px; }
  .hme-status { color: var(--wa-faint); font-size: 12px; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
  .hme-crumb-sep { color: var(--wa-faint); }
  .hme-title.hme-crumb { color: var(--hme-sel); }
  .hme-style-wrap { position: relative; flex: none; }
  .hme-tb.hme-style-btn { height: 34px; }
  .hme-tb.hme-style-btn.on { border-color: var(--hme-sel); }
  .hme-style-sw { width: 14px; height: 14px; border-radius: 4px; border: 1px solid var(--wa-line-strong); flex: none; }
  .hme-status-dot { width: 7px; height: 7px; border-radius: 50%; background: #30d158; }
  .hme-status.saving .hme-status-dot { background: var(--hme-amber); }
  .hme-status.waiting { color: var(--hme-amber); }
  .hme-status.waiting .hme-status-dot { background: var(--hme-amber); }
  .hme-status.error { color: var(--wa-need); }
  .hme-status.error .hme-status-dot { background: var(--wa-need); }
  .hme-pop {
    position: absolute; top: calc(100% + 6px); left: 0; z-index: 30; min-width: 320px; padding: 6px;
    display: flex; flex-direction: column; gap: 2px;
    background: var(--wa-card); border: 1px solid var(--wa-line-strong); border-radius: 12px; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
  }
  .hme-pop-row { display: flex; align-items: center; gap: 4px; border-radius: 9px; }
  .hme-pop-row.on { background: var(--hme-sel-bg); }
  .hme-pop-main { flex: 1; display: flex; align-items: center; gap: 10px; padding: 6px; border: 0; background: none; color: var(--wa-ink); font: inherit; cursor: pointer; border-radius: 8px; }
  .hme-pop-main:hover { background: var(--wa-hover); }
  .hme-pop-act { border: 0; background: none; color: var(--wa-muted); font: inherit; font-size: 12px; padding: 4px 8px; border-radius: 6px; cursor: pointer; }
  .hme-pop-act:hover:not(:disabled) { background: var(--wa-hover); color: var(--wa-ink); }
  .hme-pop-act.danger:hover:not(:disabled) { color: var(--wa-need); }
  .hme-pop-act:disabled { opacity: 0.4; cursor: default; }
  .hme-pop-add { margin-top: 4px; border: 1px dashed var(--wa-line-strong); background: none; color: var(--wa-soft); font: inherit; height: 34px; border-radius: 8px; cursor: pointer; }
  .hme-pop-add:hover { background: var(--wa-hover); color: var(--wa-ink); }
  svg.hme-thumb { display: block; flex: none; }

  .hme-note {
    display: flex; align-items: center; gap: 10px; margin: 10px 12px 0; padding: 10px 12px; font-size: 13px;
    border-radius: 12px; border: 1px solid var(--wa-line); background: var(--wa-card);
  }
  .hme-note > span { flex: 1; min-width: 0; }
  .hme-note.warn { border-color: var(--wa-amber-line, var(--hme-amber)); background: var(--wa-amber-bg, var(--wa-card)); }
  .hme-note.err { border-color: color-mix(in srgb, var(--wa-need) 45%, transparent); }

  /* ── cards ────────────────────────────────────────────────────────── */
  .hme-card { background: var(--wa-card); border: 1px solid var(--wa-line); border-radius: 14px; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; flex: none; }
  .hme-h { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--wa-muted); display: flex; align-items: center; gap: 8px; }
  .hme-h-end { margin-left: auto; letter-spacing: 0; text-transform: none; font-weight: 500; color: var(--wa-faint); }
  .hme-amber { color: var(--hme-amber); font-weight: 600; }
  .hme-r { display: flex; align-items: center; gap: 10px; min-height: 32px; }
  .hme-r.tight { min-height: 28px; }
  .hme-l { flex: 0 0 92px; color: var(--wa-muted); font-size: 13px; }
  .hme-l.short { flex: 0 0 auto; }
  .hme-grow { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hme-val { color: var(--wa-soft); }
  .hme-val.strong { color: var(--wa-ink); }
  .hme-text { color: var(--wa-soft); line-height: 1.45; }
  .hme-text.dim { color: var(--wa-faint); font-size: 12px; }
  .hme-empty-line { color: var(--wa-faint); font-size: 12.5px; padding: 2px 10px; }
  .hme-hint { color: var(--wa-faint); font-size: 12px; line-height: 1.45; margin: 0 0 0 102px; }
  .hme-row-end { display: flex; gap: 8px; padding-top: 4px; flex-wrap: wrap; align-items: center; }
  .hme-row-end.indent { padding-left: 102px; }
  .hme-in {
    flex: 1; min-width: 0; height: 32px; border-radius: 8px; border: 1px solid var(--wa-line); background: var(--wa-input);
    color: var(--wa-ink); display: flex; align-items: center; padding: 0 10px; gap: 4px;
  }
  .hme-in:focus-within { border-color: var(--hme-sel); }
  .hme-in input, .hme-in select {
    flex: 1; min-width: 0; width: 100%; height: 100%; border: 0; background: transparent; color: inherit; font: inherit; font-size: 13px; outline: none; padding: 0;
  }
  .hme-in select { cursor: pointer; }
  .hme-num input { font-family: var(--hme-mono); }
  .hme-unit { color: var(--wa-faint); font-size: 12px; }
  /* A number field scrubs when dragged and types when clicked: until it has
     the typing, the press goes to the field, not its text. */
  .hme-num { cursor: ew-resize; transition: border-color 0.12s, background 0.12s; }
  .hme-num:not(:focus-within) input { pointer-events: none; cursor: ew-resize; }
  .hme-num:not(:focus-within):hover { border-color: var(--wa-line-strong); background: var(--wa-hover); }
  .hme-num:focus-within { cursor: text; }
  .hme-num.scrubbing { border-color: var(--hme-sel); background: var(--wa-hover); }
  .hme-num.off { cursor: default; opacity: 0.5; }
  .hme-ntag { color: var(--wa-faint); font-size: 11px; font-weight: 600; letter-spacing: 0.02em; min-width: 12px; user-select: none; }
  .hme-num.scrubbing .hme-ntag, .hme-num:hover .hme-ntag { color: var(--hme-sel); }
  .hme-fields { display: grid; grid-template-columns: repeat(var(--n, 2), minmax(0, 1fr)); gap: 8px; }
  .hme-group { display: flex; flex-direction: column; gap: 6px; }
  .hme-group + .hme-group { padding-top: 4px; }
  .hme-gl { color: var(--wa-muted); font-size: 12px; display: flex; align-items: center; gap: 8px; }
  .hme-turn { display: flex; gap: 6px; align-items: center; }
  .hme-turn .hme-num { flex: 1; }
  .hme-turn .hme-tb.hme-icon { width: 32px; padding: 0; justify-content: center; }
  .hme-foot-hint { color: var(--wa-faint); font-size: 11.5px; line-height: 1.4; margin: 2px 0 0; }
  .hme-in.hme-ro { color: var(--wa-soft); }
  .hme-pics { display: flex; gap: 10px; flex-wrap: wrap; }
  .hme-pic { display: flex; flex-direction: column; align-items: center; gap: 5px; font: inherit; font-size: 11px; color: var(--wa-muted); border: 0; background: none; padding: 0; cursor: pointer; max-width: 72px; text-align: center; }
  .hme-pic > svg { border-radius: 8px; border: 1px solid #3a3a3c; background: #1f1f21; display: block; }
  .hme-sw { width: 52px; height: 38px; border-radius: 8px; border: 1px solid var(--wa-line-strong); display: block; }
  .hme-pic:hover { color: var(--wa-ink); }
  .hme-pic.on { color: var(--wa-ink); }
  .hme-pic.on > svg, .hme-pic.on > .hme-sw { outline: 2px solid var(--hme-sel); outline-offset: 2px; }
  .hme-pic:focus-visible { outline: none; }
  .hme-pic:focus-visible > svg, .hme-pic:focus-visible > .hme-sw { outline: 2px solid var(--hme-sel); outline-offset: 2px; }
  .hme-chip {
    height: 26px; padding: 0 10px; border-radius: 13px; background: var(--wa-input); border: 1px solid var(--wa-line);
    color: var(--wa-soft); font: inherit; font-size: 12px; cursor: pointer; flex: none;
  }
  .hme-chip.off { color: var(--wa-faint); }
  .hme-head { flex-direction: row; align-items: center; gap: 14px; }
  .hme-head-t { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
  .hme-head-t strong { font-size: 17px; }
  .hme-head-t span { color: var(--wa-muted); font-size: 12px; }
  svg.hme-room-thumb { flex: none; display: block; }
  .hme-list-row {
    display: flex; align-items: center; gap: 10px; min-height: 32px; padding: 0 8px; border-radius: 8px; border: 0; background: none;
    color: var(--wa-soft); font: inherit; font-size: 13px; width: 100%; text-align: left; cursor: pointer;
  }
  .hme-list-row:hover { background: var(--wa-hover); }
  .hme-list-row.on { background: var(--hme-sel-bg); color: var(--wa-ink); }
  /* A device of several picked: its name picks it alone, × leaves it out. */
  .hme-pick-row { cursor: default; padding-right: 2px; }
  .hme-pick-row .hme-link { color: var(--wa-ink); text-align: left; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
  .hme-x {
    flex: none; width: 24px; height: 24px; border: 0; border-radius: 6px; background: none; color: var(--wa-faint);
    font: inherit; font-size: 16px; line-height: 1; cursor: pointer;
  }
  .hme-x:hover { background: var(--wa-hover); color: var(--wa-ink); }
  .hme-x:focus-visible { outline: none; box-shadow: var(--wa-ring, 0 0 0 2px var(--hme-sel)); }

  /* ── Start here, with nothing picked ──────────────────────────────── */
  .hme-steps { display: flex; flex-direction: column; gap: 12px; }
  .hme-step { display: flex; gap: 12px; align-items: flex-start; }
  .hme-step-no {
    width: 26px; height: 26px; border-radius: 50%; flex: none; display: inline-flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 600; background: var(--wa-raise); color: var(--wa-muted);
  }
  .hme-step.done .hme-step-no { background: rgba(48, 209, 88, 0.16); color: #30d158; }
  .hme-step.now .hme-step-no { background: var(--hme-sel); color: #fff; }
  .hme-step-t { display: flex; flex-direction: column; gap: 2px; min-width: 0; align-items: flex-start; }
  .hme-step-t b { font-size: 14px; font-weight: 600; color: var(--wa-ink); }
  .hme-step.next .hme-step-t b { color: var(--wa-soft); }
  .hme-step-t > span { color: var(--wa-muted); font-size: 12px; line-height: 1.45; }
  .hme-step-t .hme-link { margin-top: 4px; font-size: 12.5px; }
  .hme-tips-card { padding: 10px 16px; }
  .hme-tips > summary { cursor: pointer; color: var(--wa-soft); font-size: 13px; list-style: none; }
  .hme-tips > summary::-webkit-details-marker { display: none; }
  .hme-tips > summary:hover { color: var(--wa-ink); }
  .hme-tips[open] > summary { margin-bottom: 10px; }
  .hme-tips[open] > summary > span { display: inline-block; transform: rotate(90deg); }
  .hme-tips > p + p { margin-top: 6px; }
  .hme-keys { display: grid; grid-template-columns: auto 1fr; gap: 6px 10px; margin: 10px 0 0; align-items: baseline; }
  .hme-keys dt { margin: 0; }
  .hme-keys dd { margin: 0; color: var(--wa-muted); font-size: 12px; }
  .hme-keys kbd { font: 500 11px var(--hme-mono); color: var(--wa-soft); border: 1px solid var(--wa-line-strong); border-radius: 5px; padding: 1px 5px; white-space: nowrap; }

  /* ── In this room, with a room picked ─────────────────────────────── */
  .hme-ly-list { display: flex; flex-direction: column; gap: 1px; margin: 0 -8px; }
  .hme-ly-grp { padding: 8px 8px 2px; color: var(--wa-faint); font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
  .hme-ly { display: flex; align-items: center; gap: 2px; border-radius: 8px; padding-right: 2px; }
  .hme-ly:hover { background: var(--wa-hover); }
  .hme-ly.on { background: var(--hme-sel-bg); }
  /* Under the pointer, here, on the plan or in 3D: a soft ring, lighter
     than the picked blue. */
  .hme-ly.hov { box-shadow: inset 0 0 0 1px rgba(91, 141, 239, 0.55); background: rgba(91, 141, 239, 0.07); }
  .hme-ly.on.hov { background: var(--hme-sel-bg); }
  .hme-ly-main {
    flex: 1; min-width: 0; display: flex; align-items: center; gap: 8px; min-height: 30px; padding: 0 8px; border: 0; background: none;
    color: var(--wa-ink); font: inherit; font-size: 13px; text-align: left; cursor: pointer; border-radius: 8px;
  }
  .hme-ly-main:focus-visible, .hme-eye:focus-visible { outline: none; box-shadow: var(--wa-ring, 0 0 0 2px var(--hme-sel)); }
  .hme-ly-nm { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hme-ly-end { margin-left: auto; padding-left: 8px; color: var(--wa-faint); font-size: 11.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 55%; }
  .hme-ly.hid .hme-ly-main { color: var(--wa-faint); }
  .hme-ly.hid .hme-ly-main > span:first-child { opacity: 0.5; }
  .hme-eye {
    flex: none; width: 26px; height: 26px; border: 0; border-radius: 6px; background: none; color: var(--wa-faint); cursor: pointer;
    display: inline-flex; align-items: center; justify-content: center; padding: 0;
  }
  .hme-eye:hover { background: var(--wa-raise); color: var(--wa-ink); }
  .hme-ly.hid .hme-eye { color: var(--wa-muted); }
  .hme-ly-lamp { width: 14px; height: 14px; border-radius: 50%; flex: none; background: var(--wa-raise); border: 1px solid var(--wa-line-strong); display: inline-flex; align-items: center; justify-content: center; }
  .hme-ly-lamp::after { content: ""; width: 6px; height: 6px; border-radius: 50%; background: #636366; }
  .hme-ly-lamp.lit::after { background: var(--hme-amber); }
  .hme-inroom .hme-tb.hme-wide { margin-top: 2px; }

  /* ── lists ────────────────────────────────────────────────────────── */
  .hme-find { display: flex; align-items: center; gap: 8px; height: 34px; padding: 0 10px; border-radius: 8px; border: 1px solid var(--wa-line); background: var(--wa-input); color: var(--wa-faint); flex: none; }
  .hme-find:focus-within { border-color: var(--hme-sel); }
  .hme-find input { flex: 1; min-width: 0; border: 0; background: transparent; color: var(--wa-ink); font: inherit; outline: none; }
  .hme-layers { padding: 10px 8px; gap: 2px; }
  .hme-layers > .hme-h { padding: 4px 10px 8px; }
  .hme-lay {
    display: flex; align-items: center; gap: 8px; min-height: 30px; padding: 0 10px; border-radius: 7px; border: 0; background: none;
    color: var(--wa-soft); font: inherit; font-size: 13px; width: 100%; text-align: left; cursor: pointer;
  }
  .hme-lay:hover { background: var(--wa-hover); }
  .hme-lay.on { background: var(--hme-sel-bg); color: var(--wa-ink); }
  .hme-lay.sub { padding-left: 30px; color: var(--wa-muted); font-size: 12px; min-height: 26px; }
  .hme-lay.subsub { padding-left: 44px; color: var(--wa-muted); font-size: 12px; min-height: 28px; justify-content: space-between; cursor: default; }
  button.hme-lay.subsub { cursor: pointer; }
  .hme-lay.dim { color: var(--wa-muted); }
  .hme-lay .n { margin-left: auto; color: var(--wa-faint); font-size: 12px; white-space: nowrap; }
  .hme-dot { width: 10px; height: 10px; border-radius: 3px; flex: none; }
  .hme-dot.dev { border-radius: 50%; background: var(--hme-amber); }
  .hme-lay.sub .hme-dot.dev { width: 8px; height: 8px; }
  .hme-dot.dev.off { background: #636366; }
  .hme-lay .hme-caret { width: 10px; font-size: 10px; color: var(--wa-faint); flex: none; }
  .hme-lay.on .hme-caret { color: var(--wa-muted); }
  .hme-lay.sub.dim { color: var(--wa-faint); }
  .hme-thing-ic { width: 8px; height: 8px; border-radius: 2px; border: 1px solid var(--wa-faint); flex: none; }
  .hme-thing-ic.on { border-color: var(--hme-sel); }
  .hme-tb.hme-grow-btn { flex: 1 1 auto; }
  .hme-sep { height: 1px; background: var(--wa-line); margin: 8px 6px; flex: none; }
  .hme-foot { color: var(--wa-faint); font-size: 12px; line-height: 1.45; margin: 2px 4px; }
  .hme-tool {
    display: flex; align-items: center; gap: 10px; height: 38px; padding: 0 10px; border-radius: 9px; border: 0; background: none;
    color: var(--wa-soft); font: inherit; font-size: 13px; font-weight: 500; width: 100%; text-align: left; cursor: pointer;
  }
  .hme-tool:hover { background: var(--wa-hover); }
  .hme-tool.on { background: var(--hme-sel-bg); color: var(--wa-ink); }
  .hme-tool > svg { flex: 0 0 18px; }
  .hme-tool kbd { margin-left: auto; font: 500 11px var(--hme-mono); color: var(--wa-faint); border: 1px solid var(--wa-line-strong); border-radius: 5px; padding: 1px 5px; }
  .hme-fix { display: flex; gap: 10px; align-items: flex-start; padding: 10px; border-radius: 10px; background: var(--wa-input); border: 1px solid var(--wa-line); }
  .hme-fix p { font-size: 12.5px; line-height: 1.4; color: var(--wa-soft); flex: 1; cursor: pointer; }
  .hme-fix b { color: var(--wa-ink); font-weight: 600; }
  .hme-fix-dot { width: 8px; height: 8px; margin-top: 5px; border-radius: 50%; background: var(--hme-amber); flex: none; }
  .hme-fix-dot.gray { background: #8e8e93; }

  /* ── the stage ────────────────────────────────────────────────────── */
  .hme-stage { position: absolute; inset: 0; border-radius: 16px; border: 1px solid var(--wa-line); background: #11100f; overflow: hidden; }
  .hme-stage.hme-split-l { right: calc(50% + 6px); }
  .hme-stage.hme-split-r { left: calc(50% + 6px); }
  svg.hme-svg { display: block; position: absolute; inset: 0; width: 100%; height: 100%; touch-action: none; user-select: none; -webkit-user-select: none; }
  svg.hme-svg text { font-family: var(--wa-font, inherit); }
  .hme-tag text { font-size: 11px; font-weight: 600; }
  .hme-pill, .hme-dock {
    position: absolute; left: 50%; transform: translateX(-50%); z-index: 2;
    display: flex; gap: 4px; align-items: center; padding: 4px; border-radius: 12px;
    background: rgba(28, 28, 30, 0.92); border: 1px solid #3a3a3c; white-space: nowrap;
    max-width: calc(100% - 28px); overflow-x: auto; scrollbar-width: none;
    -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  }
  .hme-pill { top: 14px; }
  .hme-pill.under { top: 62px; }
  .hme-dock { bottom: 14px; gap: 6px; padding: 6px; }
  /* Wall editing: the stage ringed in blue, and its Done bar. */
  .hme-stage.walls { border: 2px solid var(--hme-sel); }
  .hme-banner {
    position: absolute; left: 50%; top: 14px; transform: translateX(-50%); z-index: 3;
    display: flex; gap: 8px; align-items: center; padding: 4px 4px 4px 14px; border-radius: 12px;
    background: rgba(28, 28, 30, 0.94); border: 1px solid var(--hme-sel); white-space: nowrap; color: #d1d1d6;
    max-width: calc(100% - 28px); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  }
  .hme-banner-t { overflow: hidden; text-overflow: ellipsis; }
  .hme-banner b { color: #fff; }
  .hme-tb.hme-blue { background: var(--hme-sel); border-color: var(--hme-sel); color: #fff; }
  .hme-tb.hme-blue:hover:not(:disabled) { background: #6f9cf2; color: #fff; }
  .hme-tb.hme-blue kbd { font: 500 11px var(--hme-mono); opacity: 0.75; }
  /* The tool rail, floating on the left of the plan. */
  .hme-toolrail {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%); z-index: 3;
    display: flex; flex-direction: column; gap: 2px; padding: 4px; border-radius: 12px;
    background: rgba(28, 28, 30, 0.94); border: 1px solid #3a3a3c; max-height: calc(100% - 28px); overflow-y: auto; scrollbar-width: none;
    -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  }
  .hme-rtool {
    width: 56px; min-height: 46px; flex: none; border-radius: 10px; border: 0; background: transparent; color: #c7c7cc; cursor: pointer;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; padding: 6px 0 5px;
  }
  .hme-rtool:hover { background: #2c2c2e; color: #fff; }
  .hme-rtool.on { background: #3a3a3c; color: #fff; }
  .hme-rtool:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--hme-sel); }
  .hme-rtool-name { font-size: 10.5px; font-weight: 500; line-height: 1; white-space: nowrap; }
  .hme-rtool-sep { height: 1px; background: #3a3a3c; margin: 2px 6px; flex: none; }
  .hme-stage-hint { position: absolute; left: 86px; bottom: 22px; z-index: 1; color: #8e8e93; font-size: 11px; pointer-events: none; }
  /* The dock's View and Look menus, over the dock. */
  .hme-dock-pop {
    position: absolute; left: 50%; bottom: 62px; transform: translateX(-50%); z-index: 4; min-width: 200px; padding: 4px;
    display: flex; flex-direction: column; gap: 1px; border-radius: 12px;
    background: rgba(28, 28, 30, 0.96); border: 1px solid #3a3a3c; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
    -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  }
  .hme-dock-item {
    display: flex; align-items: center; gap: 8px; height: 32px; padding: 0 10px 0 6px; border: 0; border-radius: 8px; background: none;
    color: #d1d1d6; font: inherit; font-size: 13px; text-align: left; cursor: pointer; white-space: nowrap;
  }
  .hme-dock-item:hover { background: #2c2c2e; color: #fff; }
  .hme-dock-item:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--hme-sel); }
  .hme-dock-item.on { color: #fff; }
  .hme-check { width: 16px; flex: none; text-align: center; color: var(--hme-sel); font-weight: 700; }
  .hme-dock-head { padding: 8px 10px 2px 30px; color: #8e8e93; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; border-top: 1px solid #3a3a3c; margin-top: 3px; }
  .hme-dock .hme-caret { color: #98989d; }
  .hme-pill-name { padding: 0 10px; display: inline-flex; align-items: center; font-weight: 600; color: #fff; }
  .hme-pill .hme-tb, .hme-dock .hme-tb, .hme-pill .hme-menu, .hme-stage-empty .hme-tb { background: #161617; border-color: #2c2c2e; color: #d1d1d6; }
  .hme-pill .hme-tb:hover:not(:disabled), .hme-dock .hme-tb:hover:not(:disabled), .hme-pill .hme-menu:hover { background: #2c2c2e; color: #fff; }
  .hme-dock .hme-tb.on { background: #2c2c2e; color: #fff; border-color: #48484a; }
  .hme-pill .hme-tb.danger { color: #ff6961; }
  .hme-pill .hme-menu-caret { color: #98989d; }
  .hme-dock .hme-vsep { background: #3a3a3c; height: 20px; }
  .hme-zoom { width: 48px; text-align: center; color: #d1d1d6; font-size: 12px; }
  .hme-live-dot { width: 7px; height: 7px; border-radius: 50%; background: #ffbf55; }
  .hme-tb:not(.on) > .hme-live-dot { background: #636366; }
  .hme-stage-empty {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; gap: 8px;
    padding: 20px 24px; border-radius: 14px; background: rgba(28, 28, 30, 0.9); border: 1px solid #3a3a3c; color: #d1d1d6; text-align: center; max-width: 340px;
  }
  .hme-stage-empty b { color: #fff; font-size: 14px; }
  /* The real 3D look: the canvas fills the stage, dragged to orbit. */
  .hme-stage.hme-3d { background: #0f0e0d; }
  .hme-3d-host { position: absolute; inset: 0; cursor: grab; touch-action: none; user-select: none; -webkit-user-select: none; }
  .hme-3d-host:active { cursor: grabbing; }
  .hme-3d-note {
    position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); padding: 10px 16px; border-radius: 12px;
    background: rgba(28, 28, 30, 0.9); border: 1px solid #3a3a3c; color: #d1d1d6; font-size: 13px; pointer-events: none;
  }
  /* The browser took the 3D context away: a quiet line at the top, its
     button the only part that takes a click. */
  .hme-3d-note.hme-3d-paused { top: 14px; transform: translateX(-50%); display: flex; align-items: center; gap: 10px; padding: 6px 12px; font-size: 12px; }
  .hme-3d-paused .hme-link { pointer-events: auto; }

  /* ── shared by Devices and Style ──────────────────────────────────── */
  .hme-pad { padding: 4px 6px; }
  .hme-chips { display: flex; flex-wrap: wrap; gap: 6px; min-width: 0; }
  .hme-chip.sel.on { background: var(--hme-sel-bg); border-color: var(--hme-sel); color: var(--wa-ink); }
  .hme-chip:disabled { opacity: 0.45; cursor: default; }
  .hme-r.top { align-items: flex-start; }
  .hme-r.top > .hme-l { padding-top: 6px; }
  .hme-w48 { flex: 0 0 52px; text-align: right; }
  /* The panel's own slider (form-styles.ts), its fill from --p. Mixed, for
     several picked things that differ: no fill and an empty dashed knob
     until it is moved. */
  .hme-range { flex: 1; min-width: 0; }
  .hme-range.mixed::-webkit-slider-thumb { background: transparent; border: 2px dashed var(--wa-faint); box-shadow: none; }
  .hme-range.mixed::-moz-range-thumb { background: transparent; border: 2px dashed var(--wa-faint); box-shadow: none; }
  .hme-range.mixed::-moz-range-progress { background: transparent; }

  /* ── Devices ──────────────────────────────────────────────────────── */
  .hme-tray { gap: 6px; }
  .hme-ar { font-size: 11px; font-weight: 600; color: var(--wa-muted); margin: 8px 2px 2px; display: flex; }
  .hme-ar.dim { color: var(--wa-faint); }
  .hme-ar > span { margin-left: auto; font-weight: 500; color: var(--wa-faint); }
  .hme-dv {
    display: flex; align-items: center; gap: 10px; min-height: 40px; padding: 4px 8px; border-radius: 9px;
    background: var(--wa-input); border: 1px solid var(--wa-line); cursor: grab; flex: none; outline: none;
  }
  .hme-dv:hover { border-color: var(--wa-line-strong); }
  .hme-dv:focus-visible { border-color: var(--hme-sel); }
  .hme-dv.dragging { opacity: 0.45; border-style: dashed; }
  .hme-dv.placed { cursor: pointer; }
  .hme-dv-ic { width: 24px; height: 24px; border-radius: 50%; background: var(--wa-raise); color: var(--wa-soft); display: flex; align-items: center; justify-content: center; flex: 0 0 24px; }
  .hme-dv-nm { flex: 1; min-width: 0; display: flex; flex-direction: column; line-height: 1.2; color: var(--wa-ink); overflow: hidden; }
  .hme-dv-nm small { color: var(--wa-faint); font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .hme-dv-grip { color: var(--wa-faint); font-size: 13px; }
  /* A light's "2 on map": a click picks the next one in turn. */
  .hme-dv-count {
    flex: none; height: 22px; padding: 0 8px; border-radius: 11px; border: 1px solid var(--wa-line-strong); background: var(--wa-raise);
    color: var(--wa-soft); font: inherit; font-size: 11px; font-weight: 600; cursor: pointer; white-space: nowrap;
  }
  .hme-dv-count:hover { color: var(--wa-ink); border-color: var(--hme-sel); }
  /* A thing's device: its head. */
  .hme-lamp-light { display: flex; align-items: center; gap: 12px; }
  /* The lamp chooser, by the spot a light goes to, over a clear scrim that
     closes it when pressed. */
  .hme-lamp-scrim { background: transparent; display: block; padding: 0; }
  .hme-lampc {
    position: absolute; max-width: calc(100vw - 16px); padding: 12px; border-radius: 14px; display: flex; flex-direction: column; gap: 10px;
    background: var(--wa-card); border: 1px solid var(--wa-line-strong); box-shadow: 0 18px 50px rgba(0, 0, 0, 0.5);
  }
  .hme-lampc-t { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .hme-lampc-t strong { font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hme-lampc-t span { color: var(--wa-muted); font-size: 12px; }
  .hme-lampc-row { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; }
  .hme-lampc-b {
    display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 4px 3px 6px; border-radius: 10px; cursor: pointer;
    border: 1px solid var(--wa-line); background: var(--wa-input); color: var(--wa-soft); font: inherit; font-size: 11px; text-align: center;
  }
  .hme-lampc-b:hover:not(:disabled) { border-color: var(--wa-line-strong); color: var(--wa-ink); }
  .hme-lampc-b:focus-visible { outline: none; box-shadow: var(--wa-ring, 0 0 0 2px var(--hme-sel)); }
  .hme-lampc-b.on { border-color: var(--hme-sel); background: var(--hme-sel-bg); color: var(--wa-ink); }
  .hme-lampc-b:disabled { opacity: 0.4; cursor: default; }
  .hme-lampc-pic {
    width: 100%; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; overflow: hidden;
    border-radius: 8px; background: radial-gradient(circle at 50% 38%, #2a2826, #161514 75%);
  }
  .hme-lampc-pic img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .hme-lampc-pic.wait { background: linear-gradient(100deg, #1d1c1b 30%, #262423 50%, #1d1c1b 70%) 0 0/300% 100%; animation: hme-wait 1.4s linear infinite; }
  .hme-lampc-pic.bulb { color: #ffbf55; }
  .hme-lampc-hint { color: var(--wa-faint); font-size: 11px; }
  .hme-dot.gray { background: #8e8e93; }
  .hme-pin-big { width: 46px; height: 46px; border-radius: 50%; background: #2c2c2e; display: flex; align-items: center; justify-content: center; flex: none; }
  .hme-state { color: var(--wa-soft); font-weight: 600; white-space: nowrap; }
  .hme-state.lit { color: #e6a52e; }
  .hme-in.hme-icon-btn { font: inherit; font-size: 13px; text-align: left; cursor: pointer; gap: 8px; color: var(--wa-ink); }
  .hme-icons { display: grid; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); gap: 4px; padding: 6px; border-radius: 10px; border: 1px solid var(--wa-line); background: var(--wa-input); }
  .hme-icon-cell {
    display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 4px; border-radius: 8px; border: 1px solid transparent;
    background: none; color: var(--wa-soft); font: inherit; font-size: 10.5px; cursor: pointer; text-align: center;
  }
  .hme-icon-cell:hover { background: var(--wa-hover); color: var(--wa-ink); }
  .hme-icon-cell.on { border-color: var(--hme-sel); background: var(--hme-sel-bg); color: var(--wa-ink); }
  .hme-pick { position: relative; display: inline-flex; align-items: center; gap: 6px; }
  .hme-pick input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; border: 0; padding: 0; }
  .hme-swatch { width: 12px; height: 12px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.4); }
  .hme-side {
    position: absolute; left: 68px; bottom: 70px; z-index: 2; width: 300px; max-width: calc(100% - 84px); padding: 12px 14px; border-radius: 12px;
    background: rgba(22, 22, 23, 0.95); border: 1px solid #3a3a3c; display: flex; flex-direction: column; gap: 8px; color: #fff;
  }
  .hme-side .hme-h { color: #98989d; }
  .hme-side svg { width: 100%; height: auto; display: block; touch-action: none; user-select: none; -webkit-user-select: none; }
  .hme-side text { font-family: var(--wa-font, inherit); }
  .hme-side-hint { color: #8e8e93; font-size: 11.5px; }

  /* ── the Home style panel ─────────────────────────────────────────── */
  .hme-style-scrim { position: fixed; inset: 0; z-index: 60; background: rgba(0, 0, 0, 0.4); }
  .hme-style-pop {
    position: absolute; top: calc(100% + 10px); right: 0; z-index: 61; width: 600px; max-width: calc(100vw - 32px);
    max-height: calc(100vh - 140px); overflow: auto; display: flex; flex-direction: column; gap: 10px; padding: 14px;
    border-radius: 18px; background: var(--wa-raised); border: 1px solid var(--wa-line-strong); box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
  }
  .hme-style-head { display: flex; align-items: center; gap: 10px; padding: 2px 4px; }
  .hme-style-head strong { font-size: 16px; flex: none; }
  .hme-style-head span { color: var(--wa-faint); font-size: 12px; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hme-x.hme-style-close { margin-left: auto; width: 30px; height: 30px; font-size: 15px; }
  .hme-style-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .hme-grow-card { flex: 1 1 250px; min-width: 0; }
  .hme-grow-card .hme-l { flex-basis: 84px; }
  .hme-looks { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px; flex: none; }
  .hme-looks.four { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  @container (max-width: 560px) {
    .hme-looks.four { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  .hme-look {
    display: flex; flex-direction: column; gap: 6px; border: 0; background: none; padding: 6px; border-radius: 12px; cursor: pointer;
    color: var(--wa-muted); font: inherit; font-size: 12px; font-weight: 500; text-align: left; min-width: 0;
  }
  .hme-look > svg { width: 100%; height: auto; aspect-ratio: 112 / 68; border-radius: 9px; border: 1px solid var(--wa-line); display: block; }
  .hme-look:hover { background: var(--wa-card); }
  .hme-look.on { background: var(--wa-raise); color: var(--wa-ink); }
  .hme-look.on > svg { outline: 2px solid var(--hme-sel); outline-offset: 2px; }
  .hme-look:focus-visible { outline: none; box-shadow: var(--wa-ring, 0 0 0 2px var(--hme-sel)); }
  .hme-style-tiles { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: center; gap: 12px; }
  .hme-fr { margin: 0; display: flex; flex-direction: column; gap: 6px; align-items: center; color: var(--wa-muted); font-size: 12px; }
  .hme-face { position: relative; overflow: hidden; border: 1px solid #3a3a3c; flex: none; }
  .hme-face > svg { position: absolute; display: block; }
  .hme-face-title, .hme-face-words { position: absolute; right: 8px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .hme-use { display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: 10px; background: var(--wa-input); border: 1px solid var(--wa-line); }
  .hme-use > i { width: 40px; height: 40px; border-radius: 9px; flex: 0 0 40px; border: 1px solid #3a3a3c; }
  .hme-use > div { flex: 1; min-width: 0; display: flex; flex-direction: column; line-height: 1.3; }
  .hme-use > div > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hme-use small { color: var(--wa-faint); font-size: 11.5px; }

  /* ── the furniture picker ─────────────────────────────────────────── */
  .hme-model { display: flex; align-items: center; gap: 12px; }
  .hme-model-pic, .hme-fcard-pic {
    display: flex; align-items: center; justify-content: center; flex: none; overflow: hidden;
    border-radius: 9px; border: 1px solid #2c2c2e; background: radial-gradient(circle at 50% 38%, #2a2826, #161514 75%);
  }
  .hme-model-pic { width: 76px; height: 57px; }
  .hme-model-pic img, .hme-fcard-pic img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .hme-model-pic.wait, .hme-fcard-pic.wait { background: linear-gradient(100deg, #1d1c1b 30%, #262423 50%, #1d1c1b 70%) 0 0/300% 100%; animation: hme-wait 1.4s linear infinite; }
  @keyframes hme-wait { to { background-position: -300% 0; } }
  .hme-model-t { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
  .hme-model-t strong { font-size: 14px; }
  .hme-model-t span { color: var(--wa-muted); font-size: 12px; line-height: 1.35; }
  /* A thing's fabric or wood: Default, a round button for each preset in
     its colour (--c), ringed when picked, and Custom. */
  .hme-colours { align-items: center; }
  .hme-colour {
    width: 24px; height: 24px; border-radius: 50%; padding: 0; flex: none; cursor: pointer;
    background: var(--c); border: 1px solid var(--wa-line-strong);
  }
  .hme-colour:hover { border-color: var(--wa-faint); }
  .hme-colour.on, .hme-colour:focus-visible { outline: 2px solid var(--hme-sel); outline-offset: 2px; }
  .hme-sheet { z-index: 90; }
  .hme-fpick {
    width: min(1240px, 100%); height: min(860px, 100%); display: flex; flex-direction: column; overflow: hidden;
    border-radius: 18px; background: var(--wa-card); border: 1px solid var(--wa-line-strong); box-shadow: 0 24px 70px rgba(0, 0, 0, 0.5);
  }
  .hme-fpick-head { display: flex; align-items: center; gap: 16px; padding: 16px 18px; border-bottom: 1px solid var(--wa-line); }
  .hme-fpick-t { display: flex; flex-direction: column; gap: 3px; min-width: 0; flex: 1; }
  .hme-fpick-t strong { font-size: 17px; }
  .hme-fpick-t span { color: var(--wa-muted); font-size: 12.5px; }
  .hme-fpick-find { width: min(360px, 40%); }
  .hme-x.hme-fpick-close { width: 32px; height: 32px; font-size: 20px; }
  .hme-fpick-main { flex: 1 1 auto; min-height: 0; display: grid; grid-template-columns: 196px minmax(0, 1fr); }
  .hme-fpick-groups { display: flex; flex-direction: column; gap: 2px; padding: 12px 10px; border-right: 1px solid var(--wa-line); overflow: auto; }
  .hme-fpick-groups .hme-tool { height: 34px; }
  .hme-fpick-groups .n { margin-left: auto; color: var(--wa-faint); font-size: 12px; font-weight: 500; }
  .hme-fpick-body { overflow: auto; padding: 14px 18px 22px; display: flex; flex-direction: column; gap: 18px; }
  .hme-fpick-sec { display: flex; flex-direction: column; gap: 10px; }
  .hme-fgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(168px, 1fr)); gap: 10px; }
  .hme-fcard {
    display: flex; flex-direction: column; align-items: stretch; gap: 3px; padding: 6px 6px 9px; text-align: left; cursor: pointer;
    border-radius: 12px; border: 1px solid var(--wa-line); background: var(--wa-input); color: var(--wa-ink); font: inherit;
  }
  .hme-fcard:hover { border-color: var(--wa-line-strong); background: var(--wa-hover); }
  .hme-fcard:focus-visible { outline: none; box-shadow: var(--wa-ring, 0 0 0 2px var(--hme-sel)); }
  .hme-fcard.on { border-color: var(--hme-sel); background: var(--hme-sel-bg); }
  .hme-fcard-pic { width: 100%; aspect-ratio: 4 / 3; margin-bottom: 5px; }
  .hme-fcard-name { font-size: 13px; font-weight: 500; padding: 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .hme-fcard-size { font-size: 11px; color: var(--wa-faint); padding: 0 4px; }
  @container (max-width: 760px) {
    .hme-fpick-main { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto minmax(0, 1fr); }
    .hme-fpick-groups { flex-direction: row; flex-wrap: wrap; border-right: 0; border-bottom: 1px solid var(--wa-line); }
    .hme-fpick-groups .hme-tool { width: auto; }
    .hme-fpick-head { flex-wrap: wrap; }
    .hme-fpick-find { width: 100%; order: 3; }
  }

  /* ── dialogs and calm states ──────────────────────────────────────── */
  .hme-scrim { position: fixed; inset: 0; z-index: 100; background: rgba(0, 0, 0, 0.45); display: flex; align-items: center; justify-content: center; padding: 16px; }
  .hme-dialog {
    width: min(420px, 100%); padding: 20px; border-radius: 16px; background: var(--wa-card); border: 1px solid var(--wa-line-strong);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45); display: flex; flex-direction: column; gap: 10px;
  }
  .hme-dialog h3 { font-size: 16px; }
  .hme-dialog p { color: var(--wa-soft); font-size: 13.5px; line-height: 1.45; }
  .hme-dialog-field { display: flex; flex-direction: column; gap: 6px; color: var(--wa-muted); font-size: 12px; }
  .hme-dialog-field input {
    height: 36px; border-radius: 8px; border: 1px solid var(--wa-line-strong); background: var(--wa-input); color: var(--wa-ink); font: inherit; font-size: 14px; padding: 0 10px; outline: none;
  }
  .hme-dialog-field input:focus { border-color: var(--hme-sel); }
  .hme-dialog-row { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
  .hme-calm { flex: 1 1 auto; min-height: 280px; display: flex; align-items: center; justify-content: center; padding: 24px; }
  .hme-empty {
    display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; max-width: 520px;
    padding: 28px 24px; border: 1px solid var(--wa-line); border-radius: 16px; background: var(--wa-card);
  }
  .hme-empty > b { font-size: 15px; }
  .hme-first { gap: 14px; padding: 32px 28px; }
  .hme-first .hme-start-btn { height: 38px; padding: 0 18px; font-size: 14px; font-weight: 600; }
  .hme-first-line { color: var(--wa-faint); font-size: 12.5px; line-height: 1.45; max-width: 360px; }
  .hme-first-note { font-size: 12.5px; line-height: 1.45; color: var(--hme-amber); }
  .hme-first-note.err { color: var(--wa-need); }
  /* The keys overlay, opened with ? or the bar's ? button: every shortcut
     by group, in columns where the page is wide enough. */
  .hme-keys-box {
    width: min(720px, 100%); max-height: min(640px, calc(100vh - 32px)); overflow: auto; padding: 18px 20px 20px; border-radius: 16px;
    background: var(--wa-card); border: 1px solid var(--wa-line-strong); box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
  }
  .hme-keys-top { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .hme-keys-top h3 { font-size: 16px; margin: 0; }
  .hme-keys-top .hme-flex { flex: 1; }
  .hme-keys-groups { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 6px 24px; }
  .hme-keys-group h4 { margin: 12px 0 0; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--wa-muted); }
  .hme-keys-group .hme-keys { margin-top: 6px; }
`;var Ht={plan:{title:"Plan",hint:"The floor from above, with real floors, walls and pools of light."},night:{title:"Night",hint:"A small model at night. Lit rooms glow warm."},warm:{title:"Warm",hint:"Wood floors and cream walls, like a doll house."},lines:{title:"Lines",hint:"Only the lines. Calm and clean."},clay:{title:"Clay",hint:"A soft light model, for light pages."},blueprint:{title:"Blueprint",hint:"White lines on blue paper."},dots:{title:"Dots",hint:"A quiet plan with a dot for each light."}};function Ms(s,e){if(!Qt(s))return"Home style";let t=Qo(s,e),o=i=>Object.hasOwn(s,ia[i]),n=[];return o("look")&&n.push(Ht[t.look].title),o("turn")&&n.push(`turned ${t.turn}\xB0`),o("names")&&n.push(t.names?"room names":"no room names"),o("devices")&&n.push(t.devices==="all"?"every device":t.devices==="none"?"no devices":"lights only"),o("furniture")&&n.push(t.furniture?"furniture":"no furniture"),o("glow")&&n.push(t.glow?"glow":"no glow"),`Own look: ${n.join(", ")}`}var Mr=(s,e)=>typeof s=="number"&&Number.isFinite(s)?s:e;function $s(s,e){let t=ri(s);return ai(s).flatMap(o=>{if(Io(At(o))!=="home_map")return[];let n=o,i=si(At(o)),a=e?.floors.find(u=>M(u.id,i)),r=typeof n.homeMapRoomId=="string"?n.homeMapRoomId:void 0,d=r===void 0?void 0:a?.rooms.find(u=>M(u.id,r)),l=`${Mr(o.colSpan,1)}\xD7${Mr(o.rowSpan,1)}`,p=(typeof o.customLabel=="string"&&o.customLabel.trim()!==""?o.customLabel.trim():void 0)??(d?.name?.trim()?`${d.name.trim()} only`:a===void 0||(e?.floors.length??0)<=1?"Home map":j(a));return[{pageId:t,pageName:Dt(s),tileId:typeof o.id=="string"?o.id:"",what:p,size:l,own:Qt(n),words:Ms(n,e),look:Qo(n,e).look}]})}function $r(s,e){return Object.values(s?.pages??{}).map(o=>o?.item).filter(o=>It(o)).sort((o,n)=>Dt(o).localeCompare(Dt(n))).flatMap(o=>$s(o,e))}function xr(s){let e=!1;if(!Array.isArray(s.pages))return;let t=s.pages.map(o=>{if(!It(o)||!Array.isArray(o.items))return o;let n=o.items.map(i=>!It(i)||Io(At(i))!=="home_map"||!Qt(i)?i:(e=!0,ra(i)));return{...o,items:n}});return e?{...s,pages:t}:void 0}var Po={width:112,height:68},xs={width:94,height:94,radius:34},Hs={width:188,height:94,radius:22},Ps=.9,Eo=class{constructor(){this.usesState="idle";this.busy=!1}style(e){let t=we(e.doc);return this.turnLive===void 0?t:{...t,turn:this.turnLive}}set(e,t){e.apply(o=>aa(o,t))}panel(e,t){let o=this.style(e),n=e.hass?.states,i=ct.includes(o.look),a=(r,d,l)=>m`<button type="button" class="hme-chip sel ${d?"on":""}" aria-pressed=${d?"true":"false"} @click=${l}>${r}</button>`;return m`<div class="hme-style-scrim" @pointerdown=${r=>{r.target===r.currentTarget&&t()}}></div>
      <div class="hme-style-pop" role="dialog" aria-label="Home style">
        <header class="hme-style-head">
          <strong>Home style</strong>
          <span>How every map tile looks, unless a tile picks its own</span>
          <button type="button" class="hme-x hme-style-close" aria-label="Close" title="Close (Esc)" @click=${t}>✕</button>
        </header>

        ${E("Look",m`<div class="hme-looks four">
          ${Wn.map(r=>{let d=r===o.look,l=Ze({floor:e.floor,states:n,...o,look:r,names:!1,width:Po.width,height:Po.height});return m`<button type="button" class="hme-look ${d?"on":""}" aria-pressed=${d?"true":"false"} title=${Ht[r].hint}
              @click=${()=>this.set(e,{look:r})}>
              <svg viewBox=${`0 0 ${Po.width} ${Po.height}`} style=${`background:${ke(r,.5)}`} aria-hidden="true">${l}</svg>
              <span>${Ht[r].title}</span></button>`})}
        </div>
        <p class="hme-foot">Plan and Dots draw the floor from above. The other five draw it as a small model you can turn.</p>`)}

        <div class="hme-style-row">
          ${E("Show",m`
            <div class="hme-r"><span class="hme-l">Room names</span>${a(o.names?"Shown":"Hidden",o.names,()=>this.set(e,{names:!o.names}))}</div>
            <div class="hme-r"><span class="hme-l">Devices</span><div class="hme-chips">
              ${a("Lights",o.devices==="lights",()=>this.set(e,{devices:"lights"}))}
              ${a("All",o.devices==="all",()=>this.set(e,{devices:"all"}))}
              ${a("None",o.devices==="none",()=>this.set(e,{devices:"none"}))}</div></div>
            <div class="hme-r"><span class="hme-l">Furniture</span>${a(o.furniture?"Shown":"Hidden",o.furniture,()=>this.set(e,{furniture:!o.furniture}))}</div>
            <div class="hme-r"><span class="hme-l">Light glow</span>${a(o.glow?"On":"Off",o.glow,()=>this.set(e,{glow:!o.glow}))}</div>
            <div class="hme-r"><span class="hme-l">Turn</span>
              <input class="hme-range" type="range" min="-180" max="180" step="1" .value=${G(String(o.turn))} ?disabled=${!i} aria-label="Turn the model"
                style=${Ne(o.turn,-180,180)}
                @input=${r=>{this.turnLive=Number(r.target.value),e.redraw()}}
                @change=${r=>{this.turnLive=void 0,this.set(e,{turn:Number(r.target.value)})}} />
              <span class="hme-val mono hme-w48">${i?`${o.turn}\xB0`:"flat"}</span></div>`,void 0,"hme-grow-card")}
          ${E("Preview",m`<div class="hme-style-tiles">
            ${this.face(e,o,xs,"Watch tile 2 \xD7 2")}
            ${this.face(e,o,Hs,"iPhone tile 4 \xD7 2")}
          </div>`,Ht[o.look].title,"hme-grow-card")}
        </div>

        ${this.usesCard(e)}
      </div>`}face(e,t,o,n){let i=Ps,a=e.hass?.states,r=Pa(o.width,o.height),d=Ze({floor:e.floor,states:a,...t,width:r.width,height:r.height,tileHeight:o.height,icons:e.icons}),l=Ct(e.floor,a),h=6*i;return m`<figure class="hme-fr">
      <div class="hme-face" style=${`width:${o.width*i}px;height:${o.height*i}px;border-radius:${o.radius*i}px;background:${ke(t.look,i)}`}>
        <svg viewBox=${`0 0 ${r.width} ${r.height}`} aria-hidden="true"
          style=${`left:${r.x*i}px;top:${r.y*i}px;width:${r.width*i}px;height:${r.height*i}px`}>${d}</svg>
        ${o.height>90?m`<span class="hme-face-title" style=${`left:${h}px;top:${h}px;font-size:${11*i}px;color:${xa(t.look)}`}>${Es(e.floor)}</span>`:v}
        <span class="hme-face-words" style=${`left:${h}px;bottom:${h}px;font-size:${10*i}px;color:${Ha(t.look,l>0)}`}>${St(l)}</span>
      </div>
      <figcaption>${n}</figcaption>
    </figure>`}leave(){this.turnLive=void 0,this.usesState="idle",this.message=void 0}look(e){return we(e.doc).look}loadUses(e){let t=e.hass;this.usesState!=="idle"||t===void 0||(this.usesState="loading",Rt(t).then(o=>{this.summary=o,this.usesState="done",e.redraw()},()=>{this.usesState="error",e.redraw()}))}usesCard(e){if(this.loadUses(e),this.usesState!=="done")return E("Used on",m`<p class="hme-text dim">${this.usesState==="error"?"Could not read your pages.":"Reading your pages\u2026"}</p>`);let t=$r(this.summary,e.doc),o=t.filter(n=>n.own);return E(`Used on ${R(t.length,"tile")}`,m`
      ${t.length===0?m`<p class="hme-text dim">No page has a Home map tile yet. Add one from a page's Add tile.</p>`:v}
      ${t.map(n=>this.useRow(e,n))}
      ${o.length===0?v:m`<button type="button" class="hme-tb hme-wide" ?disabled=${this.busy}
        @click=${()=>{this.useHomeStyleOnAll(e,o)}}>${this.busy?"Saving\u2026":`Use the home style on all ${o.length}`}</button>`}
      ${this.message===void 0?v:m`<p class="hme-text dim" role="status">${this.message}</p>`}`)}useRow(e,t){return m`<div class="hme-use">
      <i style=${`background:${ke(t.look,.2)}`}></i>
      <div><span>${t.pageName} · ${t.what} ${t.size}</span><small>${t.words}</small></div>
      ${e.openPage===void 0?v:m`<button type="button" class="hme-tb" @click=${()=>e.openPage?.(t.pageId)}>Edit</button>`}
    </div>`}async useHomeStyleOnAll(e,t){let o=e.hass;if(o===void 0||this.busy)return;let n=[...new Set(t.map(r=>r.pageId))];if(!await e.confirm({title:`Use the home style on ${R(t.length,"tile")}?`,text:`Their own looks come off, so each draws the home style. ${n.length===1?"The page is":`The ${n.length} pages are`} saved for every watch and iPhone that shows ${n.length===1?"it":"them"}.`,ok:"Use the home style"}))return;this.busy=!0,this.message=void 0,e.redraw();let a=0;for(let r of n)try{let d=await ni(o,"pages",r),l=xr(d.document);l!==void 0&&await ii(o,"pages",r,d.revision,l)}catch{a+=1}this.busy=!1,this.message=a===0?"Done: those tiles follow the home style now.":`${R(a,"page")} could not be saved. Try again, or open ${a===1?"it":"them"} to see why.`,this.usesState="idle",e.redraw()}};function Es(s){return s.name.trim()===""?"Home map":s.name.trim()}var Ts="Update the Wrist Assistant integration to see the home map here.",Cs="No home map yet",Ss="Start a map by hand",Rs="You can also scan your rooms with the Wrist Assistant app on an iPhone or iPad Pro with LiDAR.",Is=4,Ds=140;function As(s){return s.kind==="saving"?"Saving\u2026":s.kind==="waiting"?s.text:s.kind==="error"?"Not saved":"Saved"}typeof window<"u"&&window.addEventListener("beforeunload",s=>{yr()&&(s.preventDefault(),s.returnValue="")});var Hr={night:"Night",warm:"Warm",lines:"Lines",clay:"Clay",blueprint:"Blueprint"},T=class extends zn{constructor(){super(...arguments);this.narrow=!1;this.icons=void 0;this.iconsTick=0;this.capable=!1;this.bundleUrl=void 0;this.onHome=void 0;this.onOpenPage=void 0;this.unsupported=!1;this.loading=!1;this.styleOpen=!1;this.viewKind="both";this.artScale=0;this.stageSize={width:0,height:0};this.toggles={snap:!0,square:!0,grid:!1,measure:!1,live:!0,scan:!1};this.measure={};this.floorMenu=!1;this.model3d=!0;this.daylight=!1;this.spaceHeld=!1;this.tick=0;this.page=new bo;this.stylePanel=new Eo;this.addDialog=new ko(this.page.devices,(t,o,n)=>this.page.arrange.piecePic(t,o,n));this.loadSeq=0;this.askedOnce=!1;this.needFit=!0;this.userMoved=!1;this.touches=new Map;this.artKey="";this.artHeld=v;this.loading3d=!1;this.quality3d=ka();this.slow3d=!1;this.lost3d=!1;this.keysOpen=!1;this.checking=!1;this.onReconnect=()=>{this.session?.retryNow(),this.recheck()};this.onVisible=()=>{typeof document<"u"&&document.visibilityState!=="visible"||(this.session?.retryNow(),this.recheck())};this.onKey=t=>{if(this.dialog!==void 0||this.addOpen!==void 0||this.session===void 0||this.renderRoot?.querySelector?.(".hme-sheet")!=null)return;let o=(typeof t.composedPath=="function"?t.composedPath()[0]:void 0)??t.target;if(pn(o))return;let n=te(t,!1);if(this.keysOpen){(t.key==="Escape"||n==="help")&&(t.preventDefault?.(),this.closeKeys());return}if(n==="undo"||n==="redo"){t.preventDefault?.(),n==="undo"?this.undo():this.redo();return}if(this.styleOpen){t.key==="Escape"&&this.closeStyle();return}if(Da(o))return;if(n==="help"){t.preventDefault?.(),this.openKeys();return}if(this.dockMenu!==void 0&&t.key==="Escape"){this.dockMenu=void 0;return}if(t.key===" "&&!t.repeat){this.spaceHeld=!0,t.preventDefault?.();return}if(typeof n=="object"&&"letter"in n&&n.letter==="a"&&!this.page.devices.choosing){t.preventDefault?.(),this.openAdd();return}let i=this.context();if(i!==void 0&&this.viewKind!=="model"&&this.page.keyDown?.(i,t)===!0){t.preventDefault?.();return}switch(n){case"cancel":this.floorMenu?this.floorMenu=!1:this.toggles.measure?this.setToggle("measure",!1):this.walls!==void 0?this.editWalls(void 0):this.selection=void 0;return;case"zoomIn":this.zoomBy(ut);return;case"zoomOut":this.zoomBy(1/ut);return;case"fit":this.fit();return}};this.onKeyUp=t=>{t.key===" "&&(this.spaceHeld=!1)}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKey),window.addEventListener("keyup",this.onKeyUp),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.askedOnce&&(this.load(!0),this.listen())}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKey),window.removeEventListener("keyup",this.onKeyUp),typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.stopListening(),this.endDrag?.(),this.observer?.disconnect(),this.observed=void 0,this.zoomTimer!==void 0&&clearTimeout(this.zoomTimer),this.loadSeq++,this.drop3d()}willUpdate(t){this.hass&&this.capable&&!this.askedOnce&&(this.askedOnce=!0,this.load(),this.loadPages()),this.askedOnce&&this.listen();let o=this.baseFloor();this.needFit&&o!==void 0&&this.stageSize.width>0&&this.fit()}updated(){let t=this.renderRoot.querySelector?.(".hme-dialog");t instanceof Element&&t!==this.focusedDialog?(this.focusedDialog=t,(t.querySelector("input")??t.querySelector(".primary"))?.focus?.(),t.querySelector("input")?.select?.()):t===null&&(this.focusedDialog=void 0);let o=this.renderRoot.querySelector?.(".hme-stage");o instanceof Element&&o!==this.observed&&typeof ResizeObserver<"u"&&(this.observer??=new ResizeObserver(n=>{let i=n[n.length-1]?.contentRect;i!==void 0&&this.resizeStage(i.width,i.height)}),this.observed!==void 0&&this.observer.unobserve(this.observed),this.observer.observe(o),this.observed=o),this.view!==void 0&&this.view.scale!==this.artScale&&this.zoomTimer===void 0&&(this.zoomTimer=setTimeout(()=>{this.zoomTimer=void 0,this.view!==void 0&&(this.artScale=this.view.scale)},Ds)),this.sync3d()}input3d(){let t=this.shownFloor();if(t===void 0)return;let o=this.selection,n=ce(o),i=me(o),a=n.length>0?{things:n}:i===void 0?void 0:{roomId:i};return{floor:t,states:this.toggles.live?this.hass?.states:void 0,mark:a,daylight:this.daylight}}sync3d(){let t=this.renderRoot.querySelector?.(".hme-3d-host"),o=this.input3d();if(!(t instanceof HTMLElement)||o===void 0||this.bundleUrl===void 0){this.drop3d();return}if(this.scene3d!==void 0){this.scene3d.attach(t),this.scene3d.update(o,this.modelTurnNow()),this.scene3d.setHover(this.hoverFor3d()),this.view3d!==void 0&&(this.scene3d.setView(this.view3d),this.view3d=void 0);return}if(this.loading3d||this.failed3d!==void 0)return;this.loading3d=!0;let n=xn(this.bundleUrl);lo().then(i=>{if(this.loading3d=!1,!!this.isConnected){try{if(this.scene3d===void 0){let a=this.quality3dNow(),r=new i.HomeMapScene3D(n,a,this.quality3d==="auto"&&a==="high");r.onPick=(d,l)=>this.pick3d(d,l),r.onHover=d=>this.hover3d(d),r.onContextLost=()=>{this.lost3d=!0},r.onContextRestored=()=>this.restart3d(),r.onSlow=()=>{this.slow3d=!0,this.quality3d==="auto"&&this.scene3d?.setQuality(this.quality3dNow()),this.tick++},this.scene3d=r}}catch{this.failed3d="webgl"}this.tick++}},()=>{this.loading3d=!1,this.failed3d="load",this.tick++})}quality3dNow(){return wa(this.quality3d,ya(this.slow3d))}setQuality3d(t){this.quality3d=t,Ma(t),this.scene3d?.setQuality(this.quality3dNow())}restart3d(){this.scene3d!==void 0&&(this.view3d=this.scene3d.view()),this.drop3d(),this.lost3d=!1,this.tick++}pick3d(t,o={add:!1}){if(this.dialog!==void 0)return;this.floorMenu=!1;let n=this.baseFloor(),i=t?.kind==="pin"&&n!==void 0?Z(n,t.pinId):void 0,a=i===void 0?t:{kind:"object",roomId:i.roomId,object:i.object};if(this.walls!==void 0){(a===void 0||a.kind==="pin"||!M(a.roomId,this.walls))&&this.editWalls(void 0);return}if(o.add){a?.kind==="object"?this.select(ze(this.selection,{roomId:a.roomId,object:a.object})):a?.kind==="pin"&&this.select(Oe(this.selection,a.pinId));return}this.select(a===void 0?void 0:a.kind==="pin"?{kind:"pin",pinId:a.pinId}:a.kind==="object"?{kind:"object",roomId:a.roomId,object:a.object}:{kind:"room",roomId:a.roomId})}drop3d(){this.scene3d?.dispose(),this.scene3d=void 0,this.lost3d=!1}setHover(t){so(t,this.hover)||(this.hover=t)}hover3d(t){if(this.dialog!==void 0||this.walls!==void 0){this.setHover(void 0);return}this.setHover(t===void 0?void 0:t.kind==="pin"?ro(this.baseFloor(),{kind:"pin",pinId:t.pinId}):t.kind==="object"?{kind:"object",roomId:t.roomId,object:t.object}:{kind:"room",roomId:t.roomId})}hoverFor3d(){let t=Mn(this.hover,this.selection);if(t!==void 0)return t.kind==="pin"?{kind:"pin",pinId:t.pinId}:t.kind==="object"?{kind:"object",roomId:t.roomId,object:t.object}:t.kind==="room"?{kind:"room",roomId:t.roomId}:void 0}planHoverAt(t,o,n){if(o.pointerType==="touch"||this.spaceHeld||this.dialog!==void 0||this.walls!==void 0||this.page.tool(t)!=="pick"||this.page.devices.choosing)return;let i=o.target;if(!(typeof i?.closest=="function"&&i.closest("[data-hme=turn], [data-hme=resize]")!==null))return Ua(t.floor,t.toScreen,n)}turnBack(){this.modelTurn=void 0,this.scene3d?.frameFloor(we(this.doc).turn??dn)}async load(t=!1){let o=this.hass;if(!o||!this.capable)return;let n=++this.loadSeq;t||(this.loading=this.session===void 0,this.loadError=void 0);try{let i=await Et(o);if(n!==this.loadSeq)return;this.unsupported=!1,this.loadError=void 0,this.show({doc:nt(i?.doc)??null,rev:typeof i?.rev=="number"?i.rev:0}),this.loadScans()}catch(i){if(n!==this.loadSeq)return;let{code:a}=Te(i);a==="unknown_command"?this.unsupported=!0:(!t||this.session===void 0)&&(this.loadError=Ln(i))}this.loading=!1}async loadScans(){let t=this.hass;if(t)try{this.scans=await ti(t)}catch{}}async loadPages(){let t=this.hass;if(t)try{let o=di(await Rt(t));this.pages=li(o,"pages").map(n=>({id:n.id,name:n.name}))}catch{this.pages=[]}}show(t){let o=this.hass;if(o&&Ro(o,t),this.session===void 0)this.session=new Ho(gr(this.hassOrThrow()),t,()=>{this.afterChange(),this.catchUp()},n=>{this.hass&&Ro(this.hass,n)}),this.needFit=!0;else if(!this.session.load(t))return;this.afterChange()}listen(){let t=this.hass,o=t?.connection;if(t===void 0||o===void 0||!this.capable||!this.isConnected||o===this.listenedTo)return;this.stopListening(),this.listenedTo=o;let n=o;typeof n.addEventListener=="function"&&(n.addEventListener("ready",this.onReconnect),this.readyConnection=n),typeof o.subscribeMessage=="function"&&(this.unsubscribe=Nn(t,i=>this.heard(i)).catch(()=>{}))}stopListening(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0,this.listenedTo=void 0;let t=this.unsubscribe;this.unsubscribe=void 0,t?.then(o=>o?.()).catch(()=>{})}heard(t){this.heardRev=t,this.catchUp()}catchUp(){let t=this.session,o=this.heardRev;if(!(t===void 0||o===void 0||t.busy||this.checking)){if(o===t.confirmed.rev){this.heardRev=void 0;return}this.recheck()}}async recheck(){let t=this.hass,o=this.session;if(t===void 0||o===void 0||!this.capable||o.busy||this.checking)return;this.checking=!0;let n=this.heardRev,i=!1;try{let a=await jn(t,o.confirmed.rev);i=!0,a!==void 0&&this.session===o&&!o.busy&&(this.previewDoc=void 0,this.show({doc:nt(a.doc)??null,rev:typeof a.rev=="number"?a.rev:0}),this.loadScans())}catch{}finally{this.checking=!1}i&&(this.heardRev===n?this.heardRev=void 0:this.catchUp())}hassOrThrow(){let t=this.hass;if(t===void 0)throw new Error("no hass");return t}afterChange(){let t=this.session?.doc?.floors??[];t.some(n=>M(n.id,this.floorId))||(this.floorId=t[0]?.id,this.needFit=!0);let o=this.walls;o!==void 0&&!(this.baseFloor()?.rooms??[]).some(n=>M(n.id,o))&&(this.walls=void 0),bn(this.baseFloor(),this.selection)||(this.selection=void 0),bn(this.baseFloor(),this.hover)||(this.hover=void 0),this.tick++}get doc(){return this.session?.doc??null}baseFloor(){let t=this.doc?.floors??[];return t.find(o=>M(o.id,this.floorId))??t[0]}shownFloor(){let t=this.baseFloor();return t===void 0||this.previewDoc===void 0?t:this.previewDoc.floors.find(o=>M(o.id,t.id))??t}apply(t,o={}){let n=this.session;return n===void 0?!1:(this.previewDoc=void 0,n.apply(t)?(o.floorId!==void 0&&(this.floorId=o.floorId),o.select!==void 0&&(this.selection=ro(this.baseFloor(),o.select??void 0)),this.afterChange(),!0):(this.tick++,!1))}preview(t){let o=this.doc;this.previewDoc=t===void 0||o===null?void 0:t(o)??this.previewDoc,this.tick++}undo(){this.previewDoc=void 0,this.session?.undo()===!0&&this.afterChange()}redo(){this.previewDoc=void 0,this.session?.redo()===!0&&this.afterChange()}select(t){this.selection=ro(this.baseFloor(),t)}editWalls(t,o){let n=this.walls,i=t===void 0?void 0:this.baseFloor()?.rooms.find(d=>M(d.id,t));if(t!==void 0&&i===void 0)return;let a=this.context();a!==void 0&&!(t===void 0?n===void 0:M(t,n))&&this.page.leave?.(a),this.walls=i?.id,this.styleOpen=!1;let r=i?.id??n;this.selection=o??(r===void 0?this.selection:{kind:"room",roomId:r})}setFloor(t){let o=this.context();o!==void 0&&this.page.leave?.(o),this.floorId=t,this.walls=void 0,this.selection=void 0,this.floorMenu=!1,this.measure={},this.needFit=!0,this.userMoved=!1}setToggle(t,o){this.toggles={...this.toggles,[t]:o},t==="measure"&&(this.measure={}),t==="scan"&&o&&this.loadScans()}confirm(t){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(o=>{this.dialog={kind:"confirm",...t,done:n=>{this.dialog=void 0,o(n)}}})}ask(t){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(o=>{this.dialog={kind:"ask",...t,done:n=>{this.dialog=void 0,o(n)}}})}resizeStage(t,o){let n=this.stageSize.width===0;this.stageSize={width:t,height:o},(n||!this.userMoved)&&(this.needFit=!0)}fit(){let{width:t,height:o}=this.stageSize;t<=0||(this.view=ln(this.baseFloor(),t,o),this.artScale=this.view.scale,this.needFit=!1,this.userMoved=!1)}zoomBy(t,o){this.view!==void 0&&(this.view=hn(this.view,t,o??[this.stageSize.width/2,this.stageSize.height/2]),this.userMoved=!0)}context(){let t=this.doc,o=this.shownFloor();if(t===null||o===void 0)return;let n=this.view??{scale:40,ox:0,oy:0},i=this.session;return{hass:this.hass,icons:this.icons,doc:t,floor:o,selection:this.selection,walls:this.walls,view:n,stage:this.stageSize,toggles:this.toggles,pages:this.pages??[],areas:ei(this.hass),scans:this.scans,furnitureBase:this.bundleUrl===void 0?void 0:xn(this.bundleUrl),canUndo:i?.canUndo??!1,canRedo:i?.canRedo??!1,toScreen:a=>Ca(n,a),px:a=>a*n.scale,toPlan:(a,r)=>this.toPlan(a,r),apply:(a,r)=>this.apply(a,r),preview:a=>this.preview(a),select:a=>this.select(a),editWalls:(a,r)=>this.editWalls(a,r),setFloor:a=>this.setFloor(a),setToggle:(a,r)=>this.setToggle(a,r),drag:(a,r)=>this.drag(a,r),undo:()=>this.undo(),redo:()=>this.redo(),confirm:a=>this.confirm(a),ask:a=>this.ask(a),newId:()=>Ot(),note:(a,r)=>{this.session!==void 0&&(this.session.note={kind:a,text:r}),this.tick++},redraw:()=>{this.tick++},hover:this.hover,setHover:a=>this.setHover(a),openAdd:(a,r)=>this.openAdd(a,r),openPage:this.onOpenPage}}openAdd(t="devices",o){let n=this.context();n!==void 0&&(this.floorMenu=!1,this.styleOpen&&this.closeStyle(),this.addDialog.open(n,t,o),this.addOpen=t)}closeAdd(){this.addOpen!==void 0&&(this.addOpen=void 0,this.updateComplete.then(()=>{this.renderRoot?.querySelector?.(".hme-add-btn")?.focus?.()}))}toPlan(t,o){let n=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return Me(this.view??{scale:40,ox:0,oy:0},[t-n.left,o-n.top])}stagePoint(t){let o=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return[t.clientX-o.left,t.clientY-o.top]}drag(t,o){let n=this.stageEl;if(n===void 0)return;this.endDrag?.();let i=t.clientX,a=t.clientY,r=!1,d,l=0,h=typeof requestAnimationFrame=="function"?requestAnimationFrame:void 0,p=()=>{l=0,d!==void 0&&o.move(this.toPlan(d.clientX,d.clientY),d)};try{n.setPointerCapture?.(t.pointerId)}catch{}let u=b=>{let y=b;y.pointerId===t.pointerId&&(!r&&Math.hypot(y.clientX-i,y.clientY-a)<Is||(r=!0,d=y,h===void 0?p():l===0&&(l=h(p))))},f=b=>{let y=b;y.pointerId===t.pointerId&&(g(),l!==0&&(cancelAnimationFrame(l),p()),o.end(this.toPlan(y.clientX,y.clientY),y,r))},g=()=>{n.removeEventListener("pointermove",u),n.removeEventListener("pointerup",f),n.removeEventListener("pointercancel",f);try{n.releasePointerCapture?.(t.pointerId)}catch{}this.endDrag===c&&(this.endDrag=void 0)},c=()=>{g(),l!==0&&(cancelAnimationFrame(l),l=0),o.cancel?.()};n.addEventListener("pointermove",u),n.addEventListener("pointerup",f),n.addEventListener("pointercancel",f),this.endDrag=c}onStageDown(t){if(this.stageEl=t.currentTarget,this.floorMenu=!1,this.dockMenu=void 0,this.setHover(void 0),this.dialog!==void 0)return;if(t.pointerType==="touch"&&(this.touches.set(t.pointerId,[t.clientX,t.clientY]),this.touches.size===2)){this.endDrag?.(),this.preview(void 0),this.pinch();return}if(this.viewKind==="model"){this.turnModel(t);return}if(t.button===1||this.spaceHeld){t.preventDefault?.(),this.pan(t,!1);return}if(t.button!==0)return;let o=this.context();if(o===void 0)return;if(this.toggles.measure){let i=this.toPlan(t.clientX,t.clientY),a=this.measure;this.measure=a.a===void 0||a.b!==void 0?{a:i}:{a:a.a,b:i};return}let n=this.toPlan(t.clientX,t.clientY);if(this.page.pointerDown?.(o,t,n)===!0){t.preventDefault?.();return}this.pan(t,!0)}onStageDblClick(t){if(this.stageEl=t.currentTarget,this.dialog!==void 0||this.viewKind==="model"||this.toggles.measure||this.spaceHeld||t.button!==0)return;let o=this.context();o!==void 0&&this.page.doubleClick?.(o,t,this.toPlan(t.clientX,t.clientY))}onStageMove(t){if(this.stageEl=t.currentTarget,this.touches.has(t.pointerId)&&this.touches.set(t.pointerId,[t.clientX,t.clientY]),t.buttons!==0||this.viewKind==="model"){this.setHover(void 0);return}let o=this.toPlan(t.clientX,t.clientY);this.toggles.measure&&this.measure.a!==void 0&&this.measure.b===void 0&&(this.measure={...this.measure,hover:o});let n=this.context();n!==void 0&&(this.page.hover?.(n,o),this.setHover(this.planHoverAt(n,t,o)))}onStageLeave(){this.setHover(void 0);let t=this.context();t!==void 0&&this.page.hover?.(t,void 0)}onStageUp(t){this.touches.delete(t.pointerId)}onStageDrag(t){this.stageEl=t.currentTarget;let o=this.context();o===void 0||this.viewKind==="model"||this.dialog!==void 0||this.page.dragOver?.(o,this.toPlan(t.clientX,t.clientY),t)===!0&&(t.preventDefault?.(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"))}onStageDragLeave(t){let o=t.relatedTarget,n=t.currentTarget;if(o!==null&&n!==null&&typeof n.contains=="function"&&n.contains(o))return;let i=this.context();i!==void 0&&this.page.dragOver?.(i,void 0,t)}onStageDrop(t){this.stageEl=t.currentTarget;let o=this.context();o===void 0||this.viewKind==="model"||(t.preventDefault?.(),this.page.drop?.(o,this.toPlan(t.clientX,t.clientY),t))}pan(t,o){let n=this.view;if(n===void 0)return;let i=t.clientX,a=t.clientY;this.drag(t,{move:(r,d)=>{this.view={...n,ox:n.ox+d.clientX-i,oy:n.oy+d.clientY-a},this.userMoved=!0},end:(r,d,l)=>{!l&&o&&(this.selection=void 0)}})}pinch(){let t=this.stageEl,o=this.view,n=[...this.touches.keys()];if(t===void 0||o===void 0||n.length<2)return;let i=()=>n.map(f=>this.touches.get(f)),[a,r]=i(),d=Math.max(Math.hypot(r[0]-a[0],r[1]-a[1]),1),l=t.getBoundingClientRect(),h=[(a[0]+r[0])/2-l.left,(a[1]+r[1])/2-l.top],p=f=>{let g=f;if(!this.touches.has(g.pointerId))return;this.touches.set(g.pointerId,[g.clientX,g.clientY]);let[c,b]=i(),y=Math.max(Math.hypot(b[0]-c[0],b[1]-c[1]),1),w=[(c[0]+b[0])/2-l.left,(c[1]+b[1])/2-l.top],H=hn(o,y/d,h);this.view={...H,ox:H.ox+w[0]-h[0],oy:H.oy+w[1]-h[1]},this.userMoved=!0},u=f=>{this.touches.delete(f.pointerId),t.removeEventListener("pointermove",p),t.removeEventListener("pointerup",u),t.removeEventListener("pointercancel",u)};t.addEventListener("pointermove",p),t.addEventListener("pointerup",u),t.addEventListener("pointercancel",u)}turnModel(t){let o=this.modelTurnNow(),n=t.clientX;this.drag(t,{move:(i,a)=>{let r=o+(a.clientX-n)*.5;r=((r+180)%360+360)%360-180,this.modelTurn=Math.round(r)},end:()=>{}})}modelTurnNow(){return this.modelTurn??we(this.doc).turn??dn}modelLookNow(){if(this.modelLook!==void 0)return this.modelLook;let t=we(this.doc).look;return ct.includes(t)?t:"night"}onWheel(t){if(this.viewKind==="model"||this.view===void 0)return;this.stageEl=t.currentTarget,t.preventDefault?.();let o=t.deltaMode===1?16:t.deltaMode===2?400:1;if(t.ctrlKey||t.metaKey){this.zoomBy(Math.exp(-t.deltaY*o*.0025),this.stagePoint(t));return}this.view={...this.view,ox:this.view.ox-t.deltaX*o,oy:this.view.oy-t.deltaY*o},this.userMoved=!0}openKeys(){this.floorMenu=!1,this.dockMenu=void 0,this.spaceHeld=!1,this.keysOpen=!0,this.updateComplete.then(()=>{this.renderRoot?.querySelector?.(".hme-keys-box .hme-keys-done")?.focus?.()})}closeKeys(){this.keysOpen=!1}renderKeys(){if(!this.keysOpen)return v;let t=In(ft());return m`<div class="hme-scrim" @pointerdown=${o=>{o.target===o.currentTarget&&this.closeKeys()}}>
      <div class="hme-keys-box" role="dialog" aria-modal="true" aria-labelledby="hme-keys-title">
        <div class="hme-keys-top"><h3 id="hme-keys-title">Keys</h3><span class="hme-flex"></span>
          <button type="button" class="hme-tb hme-keys-done" @click=${()=>this.closeKeys()}>Done</button></div>
        <div class="hme-keys-groups">
          ${t.map(o=>m`<section class="hme-keys-group" aria-label=${o.title}><h4>${o.title}</h4>
            <dl class="hme-keys">${o.keys.map(([n,i])=>m`<dt><kbd>${n}</kbd></dt><dd>${i}</dd>`)}</dl></section>`)}
        </div>
      </div>
    </div>`}toggleStyle(){if(this.styleOpen){this.closeStyle();return}this.floorMenu=!1,this.styleOpen=!0}closeStyle(){this.styleOpen=!1,this.stylePanel.leave()}render(){if(this.tick,!this.capable||this.unsupported)return this.calm(m`<b>${Ts}</b>`);if(this.loadError!==void 0)return this.calm(m`<span>Could not read the home map. ${this.loadError}</span>
        <button class="hme-tb" @click=${()=>{this.load()}}>Try again</button>`);if(this.loading||this.session===void 0)return this.calm(m`Loading…`);let t=this.doc;if(t===null||t.floors.length===0)return this.renderFirstRun();let o=this.context(),n=this.session.note;return m`<div class="hme">
      ${this.renderBar(t,o)}
      ${n===void 0?v:m`<div class="hme-note ${n.kind}" role="status"><span>${n.text}</span>
        <button class="hme-link" @click=${()=>this.session?.dismissNote()}>Dismiss</button></div>`}
      <div class="hme-body">
        <aside class="hme-insp" aria-label=${this.walls===void 0?"Side panel":"Walls"}>${this.page.inspector(o)}</aside>
        <section class="hme-stage-wrap">${this.renderStage(o)}</section>
      </div>
      ${this.page.sheet?.(o)??v}
      ${this.renderDialog()}
      ${this.addOpen===void 0?v:this.addDialog.render(o,()=>this.closeAdd())}
      ${this.renderKeys()}
    </div>`}calm(t){return m`<div class="hme-calm"><div class="hme-empty">${t}</div></div>`}renderFirstRun(){let t=this.session?.note;return m`<div class="hme-calm"><div class="hme-empty hme-first">
      <b>${Cs}</b>
      ${t===void 0?v:m`<span class="hme-first-note ${t.kind}" role="status">${t.text}</span>`}
      <button type="button" class="hme-tb primary hme-start-btn" @click=${()=>this.startByHand()}>${Ss}</button>
      <span class="hme-first-line">${Rs}</span>
      ${this.onHome===void 0?v:m`<button type="button" class="hme-link" @click=${()=>this.onHome?.()}>‹ Shared</button>`}
    </div></div>`}startByHand(){let t=this.session;if(t===void 0)return;let o=Ot(),n=$i(this.hass?.floors);if(!t.begin(a=>xi(a,{id:o,name:n.name,story:n.story})))return;t.note=void 0,this.floorId=o,this.walls=void 0,this.selection=void 0,this.needFit=!0,this.userMoved=!1,this.afterChange();let i=this.context();i!==void 0&&this.page.startDrawing(i)}renderBar(t,o){let n=this.baseFloor(),i=this.session?.state??{kind:"saved"},a=ft(),r=this.walls===void 0?void 0:n.rooms.find(l=>M(l.id,this.walls)),d=we(t).look;return m`<header class="hme-bar">
      ${this.onHome===void 0?v:m`<button type="button" class="hme-back" @click=${()=>this.onHome?.()}>‹ Shared</button><span class="hme-vsep"></span>`}
      <strong class="hme-title">Home map</strong><span class="hme-beta">BETA</span>
      ${r===void 0?v:m`<span class="hme-crumb-sep" aria-hidden="true">›</span>
        <strong class="hme-title hme-crumb">${S(r)} walls</strong>`}
      <div class="hme-floor-wrap">
        <button type="button" class="hme-tb hme-floor-btn" aria-label="Switch floor" aria-haspopup="menu" aria-expanded=${this.floorMenu?"true":"false"}
          @click=${()=>{this.floorMenu=!this.floorMenu}}>
          ${gn(n)}
          <span class="hme-floor-t"><span>${j(n)}</span><small>${R(n.rooms.length,"room")} · ${R(n.pins.length,"device")}</small></span>
          <span class="hme-caret" aria-hidden="true">▾</span>
        </button>
        ${this.floorMenu?this.renderFloorMenu(t,n):v}
      </div>
      <span class="hme-flex"></span>
      <div class="hme-seg" role="group" aria-label="View">
        <button type="button" class=${this.viewKind==="flat"?"on":""} aria-pressed=${this.viewKind==="flat"?"true":"false"} @click=${()=>{this.viewKind="flat"}}>Flat</button>
        <button type="button" class=${this.viewKind==="model"?"on":""} aria-pressed=${this.viewKind==="model"?"true":"false"} @click=${()=>{this.viewKind="model"}}>Model</button>
        <button type="button" class=${this.viewKind==="both"?"on":""} aria-pressed=${this.viewKind==="both"?"true":"false"}
          title="The plan to edit on the left, the model following it on the right" @click=${()=>{this.viewKind="both"}}>Both</button>
      </div>
      <div class="hme-style-wrap">
        ${this.renderStyleButton(d)}
        ${this.styleOpen?this.stylePanel.panel(o,()=>this.closeStyle()):v}
      </div>
      <button type="button" class="hme-tb hme-icon" aria-label="Undo" title=${`Undo (${a?"\u2318Z":"Ctrl+Z"})`} ?disabled=${!o.canUndo} @click=${()=>this.undo()}>↶</button>
      <button type="button" class="hme-tb hme-icon" aria-label="Redo" title=${`Redo (${a?"\u21E7\u2318Z":"Ctrl+Shift+Z"})`} ?disabled=${!o.canRedo} @click=${()=>this.redo()}>↷</button>
      <span class="hme-status ${i.kind}" role="status" title=${i.kind==="error"?i.text:v}><span class="hme-status-dot"></span>${As(i)}</span>
      ${this.renderKeysButton()}
    </header>`}renderKeysButton(){return m`<button type="button" class="hme-tb hme-icon hme-keys-btn ${this.keysOpen?"on":""}" aria-label="Keys" aria-haspopup="dialog"
      aria-expanded=${this.keysOpen?"true":"false"} title="Every key (?)" @click=${()=>this.keysOpen?this.closeKeys():this.openKeys()}>?</button>`}renderStyleButton(t){return m`<button type="button" class="hme-tb hme-style-btn ${this.styleOpen?"on":""}" aria-haspopup="dialog" aria-expanded=${this.styleOpen?"true":"false"}
      title="How every map tile looks, unless a tile picks its own" @click=${()=>this.toggleStyle()}>
      <span class="hme-style-sw" style=${`background:${ke(t,.2)}`} aria-hidden="true"></span>Home style</button>`}renderFloorMenu(t,o){return m`<div class="hme-pop" role="menu" aria-label="Floors">
      ${t.floors.map(n=>m`<div class="hme-pop-row ${M(n.id,o.id)?"on":""}">
        <button type="button" role="menuitem" class="hme-pop-main" @click=${()=>this.setFloor(n.id)}>
          ${gn(n)}<span class="hme-floor-t"><span>${j(n)}</span><small>${R(n.rooms.length,"room")} · ${R(n.pins.length,"device")}</small></span></button>
        <button type="button" class="hme-pop-act" title="Rename" aria-label=${`Rename ${j(n)}`} @click=${()=>{this.renameFloorAsk(n)}}>Rename</button>
        <button type="button" class="hme-pop-act danger" title=${t.floors.length===1?"The map keeps at least one floor":"Delete"} aria-label=${`Delete ${j(n)}`}
          ?disabled=${t.floors.length===1} @click=${()=>{this.deleteFloorAsk(n)}}>Delete</button>
      </div>`)}
      <button type="button" class="hme-pop-add" @click=${()=>{this.addFloorAsk()}}>＋ Add a floor</button>
    </div>`}async addFloorAsk(){this.floorMenu=!1;let t=this.doc;if(t===null)return;let o=Math.max(...t.floors.map(a=>a.story))+1,n=await this.ask({title:"Add a floor",label:"Name",value:o===1?"Upstairs":`Floor ${o+1}`,ok:"Add floor"});if(n===void 0)return;let i=Ot();this.apply(a=>Mi(a,{id:i,name:n,story:o}),{floorId:i,select:null})&&(this.needFit=!0)}async renameFloorAsk(t){this.floorMenu=!1;let o=await this.ask({title:"Rename floor",label:"Name",value:t.name||j(t),ok:"Rename"});o!==void 0&&this.apply(n=>zt(n,t.id,o))}async deleteFloorAsk(t){this.floorMenu=!1,await this.confirm({title:`Delete ${j(t)}?`,text:`Its ${R(t.rooms.length,"room")} and ${R(t.pins.length,"device")} come off the map. Undo brings them back while this page is open.`,ok:"Delete floor",danger:!0})&&this.apply(n=>Hi(n,t.id),{select:null})}renderStage(t){let o=this.page,{width:n,height:i}=this.stageSize,a=this.viewKind==="model",r=this.viewKind==="both",d=a?v:o.pill?.(t)??v,l=a?v:o.banner?.(t)??v,h=this.spaceHeld?"grab":a?"ew-resize":this.toggles.measure?"crosshair":o.cursor?.(t)??"default",p=t.floor.rooms.length===0,u=this.model3d&&this.bundleUrl!==void 0,f=r?u?m`<div class="hme-stage model hme-split-r hme-3d">
      ${this.render3d(t)}
      ${this.renderModelDock(!1)}
    </div>`:m`<div class="hme-stage model hme-split-r" style=${`background:${ke(this.modelLookNow())}`}>
      <svg class="hme-svg" width="100%" height="100%" viewBox=${`0 0 ${Math.max(n,1)} ${Math.max(i,1)}`} style="cursor:ew-resize"
        role="img" aria-label=${`Model of ${j(t.floor)}`}
        @pointerdown=${c=>this.onModelDown(c)}>
        ${this.renderModel(t,n,i)}
      </svg>
      ${this.renderModelDock(!1)}
    </div>`:v;if(a&&u)return m`<div class="hme-stage model hme-3d">
        ${this.render3d(t)}
        ${this.renderAddButton()}
        ${this.renderDock(t)}
      </div>`;let g=this.walls!==void 0&&!a;return m`<div class="hme-stage ${a?"model":""} ${r?"hme-split-l":""} ${g?"walls":""}" style=${a?`background:${ke(this.modelLookNow())}`:""}>
      <svg class="hme-svg" width="100%" height="100%" viewBox=${`0 0 ${Math.max(n,1)} ${Math.max(i,1)}`} style=${`cursor:${h}`}
        role="img" aria-label=${`Plan of ${j(t.floor)}`}
        @pointerdown=${c=>this.onStageDown(c)}
        @contextmenu=${c=>{c.ctrlKey&&c.preventDefault()}}
        @dblclick=${c=>this.onStageDblClick(c)}
        @pointermove=${c=>this.onStageMove(c)}
        @pointerup=${c=>this.onStageUp(c)}
        @pointercancel=${c=>this.onStageUp(c)}
        @pointerleave=${()=>this.onStageLeave()}
        @wheel=${c=>this.onWheel(c)}
        @dragover=${c=>this.onStageDrag(c)}
        @dragleave=${c=>this.onStageDragLeave(c)}
        @drop=${c=>this.onStageDrop(c)}>
        ${a?this.renderModel(t,n,i):this.renderPlan(t,n,i)}
      </svg>
      ${l===v?v:m`<div class="hme-banner">${l}</div>`}
      ${d===v?v:m`<div class="hme-pill ${l===v?"":"under"}">${d}</div>`}
      ${a?v:o.stageExtra?.(t)??v}
      ${p&&!a&&!o.arrange.draw.active?m`<div class="hme-stage-empty"><b>No rooms on this floor yet.</b>
        <span>Draw one by hand, or scan this floor with the iPhone.</span>
        <button type="button" class="hme-tb" @click=${()=>{let c=this.context();c&&o.startDrawing(c)}}>＋ Draw a room by hand</button></div>`:v}
      ${g?v:this.renderAddButton()}
      ${this.renderDock(t)}
    </div>${f}`}renderAddButton(){return m`<button type="button" class="hme-add-btn" aria-haspopup="dialog" aria-expanded=${this.addOpen===void 0?"false":"true"}
      title="Add a device or a piece of furniture (A)" @click=${()=>this.openAdd()}>
      <span aria-hidden="true">＋</span>Add device or furniture</button>`}onModelDown(t){this.dialog!==void 0||t.button!==0||(this.stageEl=t.currentTarget,this.floorMenu=!1,this.dockMenu=void 0,this.turnModel(t))}renderPlan(t,o,n){let i=this.view;if(i===void 0||o<=0)return v;let a=this.planArt(t.floor,o,n,this.page.drawsPins?.(t)===!0?"none":"all"),r=i.scale/(this.artScale||i.scale);return k`${this.background(i,o,n)}
      <g class="hme-art" transform=${`translate(${i.ox.toFixed(2)} ${i.oy.toFixed(2)}) scale(${r.toFixed(5)})`} pointer-events="none">${a}</g>
      ${t.walls===void 0?Va(t.floor,this.hover,this.selection,t.toScreen):v}
      <g class="hme-labels" pointer-events="none">${this.labels(t)}</g>
      <g class="hme-overlay">${this.page.overlay(t)}</g>
      ${this.toggles.measure?this.measureMarks(t):v}`}planArt(t,o,n,i){let a=this.toggles.live?this.hass?.states:void 0,r=this.artScale||this.view.scale,d=`${Ls(t)}|${Fn(a)}|${r}|${o}|${n}|${this.iconsTick}|${Fn(this.icons)}|${i}`;return d!==this.artKey&&(this.artKey=d,this.artHeld=Ze({floor:t,states:a,look:"plan",names:!1,devices:i,furniture:!0,furnitureLook:va,glow:!0,width:o,height:n,icons:this.icons,frame:{scale:r,ox:0,oy:0}})),this.artHeld}background(t,o,n){let i=this.walls!==void 0?He:xe,a=20;if(this.toggles.grid)for(a=i*t.scale;a<8;)a*=10;let r=(t.ox%a+a)%a,d=(t.oy%a+a)%a;return k`<defs><pattern id="hme-bg" width=${a} height=${a} patternUnits="userSpaceOnUse" patternTransform=${`translate(${r.toFixed(1)} ${d.toFixed(1)})`}>
        ${this.toggles.grid?k`<path d=${`M${a} 0V${a}H0`} fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1" />`:k`<circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.09)" />`}
      </pattern></defs>
      <rect class="hme-bg" width=${o} height=${n} fill="url(#hme-bg)" />`}labels(t){return t.floor.rooms.map(o=>{let n=U(o),i=Ce(o.outline);if(n===void 0||i===void 0)return v;let a=S(o),r=no(o),d=(i.maxX-i.minX)*t.view.scale,l=(i.maxY-i.minY)*t.view.scale,h=a.length*7.4+22;if(h>d*.95||l<26)return v;let p=Math.max(h,r.length*5.8+22)<=d*.95&&l>=48,u=p?Math.max(h,r.length*5.8+22):h,f=p?36:22,[g,c]=t.toScreen(n);return k`<g class="hme-label"><rect x=${(g-u/2).toFixed(1)} y=${(c-f/2).toFixed(1)} width=${u.toFixed(1)} height=${f} rx=${p?9:7} fill="rgba(0,0,0,0.6)" />
        <text x=${g.toFixed(1)} y=${(c+(p?-3:4.5)).toFixed(1)} fill="#fff" font-size=${p?13:12} font-weight="600" text-anchor="middle">${a}</text>
        ${p?k`<text x=${g.toFixed(1)} y=${(c+11).toFixed(1)} fill="#aeaeb2" font-size="10" text-anchor="middle">${r}</text>`:v}</g>`})}measureMarks(t){let o=this.measure;if(o.a===void 0)return k`<g class="hme-measure"></g>`;let n=o.b??o.hover,i=t.toScreen(o.a);if(n===void 0)return k`<g class="hme-measure" pointer-events="none"><circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" /></g>`;let a=t.toScreen(n),r=Math.hypot(n[0]-o.a[0],n[1]-o.a[1]),d=[(i[0]+a[0])/2,(i[1]+a[1])/2];return k`<g class="hme-measure" pointer-events="none">
      <line x1=${i[0]} y1=${i[1]} x2=${a[0]} y2=${a[1]} stroke="#ff9f0a" stroke-width="2" stroke-dasharray=${o.b===void 0?"6 4":"none"} />
      <circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" /><circle cx=${a[0]} cy=${a[1]} r="5" fill="#ff9f0a" />
      <g class="hme-tag"><rect x=${(d[0]-32).toFixed(1)} y=${(d[1]-22).toFixed(1)} width="64" height="20" rx="10" fill="#ff9f0a" />
      <text x=${d[0].toFixed(1)} y=${(d[1]-8).toFixed(1)} fill="#2a1a00" text-anchor="middle">${r.toFixed(2)} m</text></g></g>`}renderModel(t,o,n){if(o<=0)return v;let i=this.selection,a=me(i),r=a===void 0?void 0:t.floor.rooms.find(h=>M(h.id,a)),d=ce(i).flatMap(h=>t.floor.rooms.find(p=>M(p.id,h.roomId))?.objects[h.object]??[]),l=d.length>0?{boxes:d}:r!==void 0?{outline:r.outline}:void 0;return Ze({mark:l,floor:t.floor,states:this.toggles.live?this.hass?.states:void 0,look:this.modelLookNow(),turn:this.modelTurnNow(),names:!0,devices:"lights",furniture:!0,glow:!0,width:o,height:n})}render3d(t){let o=this.failed3d==="webgl"?"The 3D view is not available on this device. The plan still works.":this.failed3d==="load"?"The 3D view could not be loaded. Reload the page to try again. The plan still works.":this.scene3d===void 0?"Loading the 3D view\u2026":void 0;return m`<div class="hme-3d-host" role="img" aria-label=${`3D model of ${j(t.floor)}. Drag to turn it, scroll to zoom, click a thing to pick it.`}></div>
      ${o===void 0?v:m`<div class="hme-3d-note">${o}</div>`}
      ${this.lost3d?m`<div class="hme-3d-note hme-3d-paused" role="status"><span>3D paused</span>
        <button type="button" class="hme-link" title="Make the 3D view again now" @click=${()=>this.restart3d()}>Start again</button></div>`:v}`}qualityItems(){let t=this.quality3dNow()==="low"?"Low":"High",o=n=>()=>this.setQuality3d(n);return[{group:"3D quality",radio:!0,label:this.quality3d==="auto"?`Auto (${t} here)`:"Auto",on:this.quality3d==="auto",title:"High on a strong computer, Low on a tablet or slower hardware",pick:o("auto")},{group:"3D quality",radio:!0,label:"High",on:this.quality3d==="high",title:"Soft shading in the corners, glowing bulbs and every shadow",pick:o("high")},{group:"3D quality",radio:!0,label:"Low",on:this.quality3d==="low",title:"Fewer effects and shadows, for a smoother view on slower hardware",pick:o("low")}]}renderModelDock(t,o){let n=this.model3d&&this.bundleUrl!==void 0,i=n?void 0:this.modelLookNow(),a=d=>d?"true":"false",r=ct.map(d=>({label:Hr[d]??d,on:d===i,pick:()=>{this.modelLook=d,this.model3d=!1,this.dockMenu=void 0}}));return this.bundleUrl!==void 0&&r.push({label:"3D",on:n,title:"The floor in real 3D, with its furniture and each light lit as it is now",pick:()=>{this.model3d=!0,this.dockMenu=void 0}}),n&&r.push(...this.qualityItems()),m`<div class="hme-dock">
      ${n?m`<button type="button" class="hme-tb ${this.daylight?"":"on"}" aria-pressed=${a(!this.daylight)} title="Night: only the lights that are on light the rooms"
          @click=${()=>{this.daylight=!1}}>Lights</button>
        <button type="button" class="hme-tb ${this.daylight?"on":""}" aria-pressed=${a(this.daylight)} title="Day: the sun comes in through the windows"
          @click=${()=>{this.daylight=!0}}>Daylight</button>
        <span class="hme-vsep"></span>`:v}
      ${this.dockMenuButton("look",`Look: ${n?"3D":Hr[i??"night"]??i}`,"How the model is drawn: the tiles' looks, or real 3D")}
      <button type="button" class="hme-tb" title=${n?"Show the whole floor from the home style's turn":"Back to the home style's turn"} @click=${()=>this.turnBack()}>⟲ Turn back</button>
      ${t&&o!==void 0?m`<span class="hme-vsep"></span>${o}`:v}
    </div>${this.dockMenuList("look","Look",r,"menuitemradio")}`}renderDock(t){let o="Draw what Home Assistant's devices are doing now",n=()=>this.setToggle("live",!this.toggles.live);if(this.viewKind==="model")return this.renderModelDock(!0,m`<button type="button" class="hme-tb ${this.toggles.live?"on":""}" aria-pressed=${this.toggles.live?"true":"false"}
        title=${o} @click=${n}><span class="hme-live-dot"></span>Live states</button>`);let i=this.stageSize.width>0?ln(this.baseFloor(),this.stageSize.width,this.stageSize.height):void 0,a=this.view===void 0||i===void 0?100:Sa(this.view,i),r=[...(this.page.viewItems?.(t)??[]).map(d=>({label:d.label,on:d.on,title:d.title,pick:()=>d.flip()})),{label:"Live states",on:this.toggles.live,title:o,pick:n},...this.bundleUrl===void 0?[]:this.qualityItems()];return m`<div class="hme-dock">
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom out" title="Zoom out (−)" @click=${()=>this.zoomBy(1/ut)}>−</button>
      <span class="hme-zoom mono">${a}%</span>
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom in" title="Zoom in (+)" @click=${()=>this.zoomBy(ut)}>＋</button>
      <button type="button" class="hme-tb" title="Fit the floor (0)" @click=${()=>this.fit()}>Fit</button>
      <span class="hme-vsep"></span>
      ${this.page.dock?.(t)??v}
      ${this.dockMenuButton("view","View","What the plan shows: the grid, names, live states and more")}
    </div>${this.dockMenuList("view","View",r,"menuitemcheckbox")}`}dockMenuButton(t,o,n){let i=this.dockMenu===t;return m`<button type="button" class="hme-tb ${i?"on":""}" aria-haspopup="menu" aria-expanded=${i?"true":"false"} title=${n}
      @click=${()=>{this.dockMenu=i?void 0:t}}>${o} <span class="hme-caret" aria-hidden="true">▾</span></button>`}dockMenuList(t,o,n,i){return this.dockMenu!==t?v:m`<div class="hme-dock-pop" role="menu" aria-label=${o}>
      ${n.map((a,r)=>m`${a.group!==void 0&&a.group!==n[r-1]?.group?m`<div class="hme-dock-head" role="presentation">${a.group}</div>`:v}
        <button type="button" role=${a.radio===!0?"menuitemradio":i} aria-checked=${a.on?"true":"false"} class="hme-dock-item ${a.on?"on":""}"
        title=${a.title??a.label} @click=${()=>a.pick()}><span class="hme-check" aria-hidden="true">${a.on?"\u2713":""}</span>${a.label}</button>`)}
    </div>`}renderDialog(){let t=this.dialog;if(t===void 0)return v;let o=()=>t.kind==="confirm"?t.done(!1):t.done(void 0),n=i=>{t.kind==="confirm"?t.done(!0):t.done((i?.querySelector("input")?.value??t.value).trim()||t.value)};return m`<div class="hme-scrim" @pointerdown=${i=>{i.target===i.currentTarget&&o()}}>
      <div class="hme-dialog" role="dialog" aria-modal="true" aria-label=${t.title}
        @keydown=${i=>{i.key==="Escape"&&(i.stopPropagation(),o()),i.key==="Enter"&&(i.preventDefault(),n(i.currentTarget))}}>
        <h3>${t.title}</h3>
        ${t.kind==="confirm"?t.text===void 0?v:m`<p>${t.text}</p>`:m`<label class="hme-dialog-field"><span>${t.label}</span><input type="text" maxlength="100" .value=${t.value} autofocus /></label>`}
        <div class="hme-dialog-row">
          <button type="button" class="hme-tb" @click=${o}>Cancel</button>
          <button type="button" class="hme-tb primary ${t.kind==="confirm"&&t.danger===!0?"danger-fill":""}"
            @click=${i=>n(i.currentTarget.closest(".hme-dialog"))}>${t.ok}</button>
        </div>
      </div>
    </div>`}static{this.styles=[oi,Bn,kr,cr]}};C([re({attribute:!1})],T.prototype,"hass",2),C([re({type:Boolean,reflect:!0})],T.prototype,"narrow",2),C([re({attribute:!1})],T.prototype,"icons",2),C([re({attribute:!1})],T.prototype,"iconsTick",2),C([re({attribute:!1})],T.prototype,"capable",2),C([re({attribute:!1})],T.prototype,"bundleUrl",2),C([re({attribute:!1})],T.prototype,"onHome",2),C([re({attribute:!1})],T.prototype,"onOpenPage",2),C([A()],T.prototype,"unsupported",2),C([A()],T.prototype,"loading",2),C([A()],T.prototype,"loadError",2),C([A()],T.prototype,"floorId",2),C([A()],T.prototype,"selection",2),C([A()],T.prototype,"walls",2),C([A()],T.prototype,"styleOpen",2),C([A()],T.prototype,"viewKind",2),C([A()],T.prototype,"view",2),C([A()],T.prototype,"artScale",2),C([A()],T.prototype,"stageSize",2),C([A()],T.prototype,"toggles",2),C([A()],T.prototype,"scans",2),C([A()],T.prototype,"measure",2),C([A()],T.prototype,"floorMenu",2),C([A()],T.prototype,"dockMenu",2),C([A()],T.prototype,"dialog",2),C([A()],T.prototype,"modelLook",2),C([A()],T.prototype,"model3d",2),C([A()],T.prototype,"daylight",2),C([A()],T.prototype,"modelTurn",2),C([A()],T.prototype,"pages",2),C([A()],T.prototype,"spaceHeld",2),C([A()],T.prototype,"tick",2),C([A()],T.prototype,"hover",2),C([A()],T.prototype,"addOpen",2),C([A()],T.prototype,"quality3d",2),C([A()],T.prototype,"lost3d",2),C([A()],T.prototype,"keysOpen",2);var Pr=new WeakMap,Os=1;function Fn(s){if(s===void 0)return 0;let e=Pr.get(s);return e===void 0&&Pr.set(s,e=Os++),e}var Ls=s=>Fn(s);customElements.get("wa-home-map-editor")||customElements.define("wa-home-map-editor",T);export{Is as HOME_MAP_DRAG_SLOP,Cs as HOME_MAP_EMPTY_TEXT,Rs as HOME_MAP_SCAN_TEXT,Ss as HOME_MAP_START_TEXT,Ts as HOME_MAP_UPDATE_TEXT,T as WaHomeMapEditor,As as homeMapSaveWords};
