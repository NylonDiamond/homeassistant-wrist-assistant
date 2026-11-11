import{a as Wt,b as jo,c as wa,d as ya,e as Qe,f as Ma,g as ka,h as Nn,i as pe,j as Kn,k as Wn,l as Bn,m as Un,n as Je,o as Bt,p as et,q as No,r as kt,s as $a,t as xa,u as ge,v as Ha}from"./chunk-HMOQ2RZH.js";import{a as ot}from"./chunk-WLCYQA5Q.js";import{a as Gn,b as Vn,c as tt,d as Ut,e as Gt,f as Pa,g as Ea,h as Ta,i as Ca,j as Sa,k as Ia}from"./chunk-GIWFR4TE.js";import{d as Fa}from"./chunk-ZEQBFCDM.js";import"./chunk-JQXNKNEU.js";import{a as Ko,b as te,c as be,d as Vt,e as $t,f as Da,g as qt,h as Xn,i as je,j as za,k as ja,l as Na,m as xt}from"./chunk-MHD6PGPH.js";import{A as _a,c as Aa,e as Oa,f as La}from"./chunk-XUDOA2U6.js";import{C as Ra}from"./chunk-UWAHYY2H.js";import{f as qn}from"./chunk-SS5J476F.js";import"./chunk-BGITYK7Q.js";import{$ as Lt,$a as Gr,A as cr,Aa as An,Ab as ra,Ba as xo,Bb as aa,Ca as On,Cb as sa,Da as Ho,Db as da,E as En,Ea as Po,Eb as la,Fa as Eo,Fb as ze,Ga as Lr,Gb as jn,H as yo,Ha as To,Hb as Fo,I as ur,Ia as _r,Ib as pa,J as fr,Ja as bt,Jb as ha,K as mt,Ka as Co,Kb as ma,La as Fr,Lb as ca,Ma as jt,Mb as ua,N as Tn,Na as Xe,Nb as fa,O as ct,Oa as zr,Ob as ga,P as gr,Pa as jr,Pb as ba,Q as br,Qa as Nr,Qb as Kt,Ra as vt,Rb as va,S as ut,Sa as wt,Sb as Ze,T as Ve,Ta as Kr,Tb as zo,U as B,Ua as Wr,Ub as Pe,V as ft,Va as Br,W as qe,Wa as Nt,X as vr,Xa as So,Y as Cn,Ya as Io,Z as wr,Za as Ur,_ as yr,_a as Ln,a as Le,aa as _t,ab as Ro,b as ht,ba as Mr,bb as _n,c as $n,ca as Ft,cb as Vr,d as xn,da as kr,db as Do,e as He,ea as $r,eb as qr,fa as xr,fb as Xr,ga as Hr,gb as Yr,h as Hn,ha as Mo,hb as Zr,ia as Pr,ib as Fn,ja as Sn,jb as Fe,ka as Er,kb as yt,la as Tr,lb as Qr,ma as ko,mb as Jr,na as Cr,nb as zn,oa as In,ob as Ye,pa as Rn,pb as Ao,q as Pn,qa as zt,qb as Oo,r as _e,ra as Sr,rb as ea,s as ee,sa as Ir,sb as ta,t as X,ta as Rr,tb as fe,u as V,ua as gt,ub as Mt,v as de,va as Dn,vb as Lo,w as le,wa as $o,wb as oa,x as mr,xa as Dr,xb as _o,ya as Ar,yb as na,z as wo,za as Or,zb as ia}from"./chunk-ORO4TUMU.js";import{_ as pr,ma as hr}from"./chunk-IY2Z5G74.js";import{j as G}from"./chunk-XXIFNMFK.js";import{a as ir,h as kn}from"./chunk-2MQ2CMMA.js";import{A as Qi,B as k,E as W,F as C,G as co,H as se,I as Ji,J as xe,L as er,N as ue,O as tr,P as uo,Q as fo,X as or,Y as nr,Z as J,b as Ui,d as Gi,e as Vi,h as Rt,i as qi,j as Xi,v as Dt,w as Yi,x as Zi,y as At}from"./chunk-4ILUENBV.js";import{a as ar,l as sr}from"./chunk-RWBTFEBI.js";import{b as pt,g as lr}from"./chunk-QLXAPXSU.js";import{i as dt,l as go,m as dr,n as bo,u as lt,v as Ot,w as vo}from"./chunk-BHQ73QDG.js";import{a as Oe,i as rr}from"./chunk-PWVBP3GH.js";import{Bg as ji,Wg as mo,Xg as Ni,Yg as Ki,Zg as Wi,b as ae,bg as It,c as F,th as Bi}from"./chunk-NPUC537M.js";import{Hb as Ge}from"./chunk-NDCIP4JT.js";import{b as ho,f as m,g as H,i as g,l as zi}from"./chunk-6ZDBXU6B.js";import{a as D}from"./chunk-LO2NM3CE.js";function oe(s){return s?.kind==="wall"||s?.kind==="corner"||s?.kind==="opening"}function Xt(s,e){if(e===void 0)return[];let o=(e.kind==="pin"?[e.pinId]:e.kind==="pins"?e.pinIds:[]).flatMap(i=>{let r=s.pins.find(d=>k(d.id,i));if(r===void 0)return[];let a=s.rooms.find(d=>r.roomId!==void 0&&k(d.id,r.roomId))??Ji(s,r.at);return a===void 0?[]:[a.id]}),n=e.kind==="objects"?e.items.map(i=>i.roomId):e.kind==="pin"||e.kind==="pins"?o:[e.roomId];return s.rooms.filter(i=>n.some(r=>k(r,i.id)))}function ne(s){return s===void 0||s.kind==="pin"||s.kind==="pins"||s.kind==="objects"?void 0:s.roomId}function Ee(s){return s?.kind==="object"?[{roomId:s.roomId,object:s.object}]:s?.kind==="objects"?s.items.map(e=>({roomId:e.roomId,object:e.object})):[]}var Wo=(s,e)=>k(s.roomId,e.roomId)&&s.object===e.object;function Ka(s){let e=[];for(let t of s)e.some(o=>Wo(o,t))||e.push({roomId:t.roomId,object:t.object});if(e.length!==0)return e.length===1?{kind:"object",roomId:e[0].roomId,object:e[0].object}:{kind:"objects",items:e}}function nt(s,e){let t=Ee(s);return t.some(o=>Wo(o,e))?Ka(t.filter(o=>!Wo(o,e))):Ka([...t,e])}function Bo(s,e){if(e?.kind!=="pin"||s===void 0)return e;let t=fe(s,e.pinId);return t===void 0?e:{kind:"object",roomId:t.roomId,object:t.object}}function Wa(s,e,t){return Ee(s).some(o=>Wo(o,{roomId:e,object:t}))}function Yn(s,e){if(e===void 0)return!0;if(s===void 0)return!1;if(e.kind==="pin")return s.pins.some(o=>k(o.id,e.pinId));if(e.kind==="pins")return e.pinIds.every(o=>s.pins.some(n=>k(n.id,o)));if(e.kind==="objects")return e.items.every(o=>s.rooms.find(n=>k(n.id,o.roomId))?.objects[o.object]!==void 0);let t=s.rooms.find(o=>k(o.id,e.roomId));if(t===void 0)return!1;switch(e.kind){case"room":return!0;case"wall":return B(t)[e.wall]!==void 0;case"corner":return t.outline[e.corner]!==void 0;case"opening":return t.openings[e.opening]!==void 0;case"object":return t.objects[e.object]!==void 0}}function Ht(s,e){return s===void 0||e===void 0?s===e:JSON.stringify(s)===JSON.stringify(e)}var Ba=4,Ua=2400;function Ga(s,e){return[s.ox+e[0]*s.scale,s.oy+e[1]*s.scale]}function Ne(s,e){return[(e[0]-s.ox)/s.scale,(e[1]-s.oy)/s.scale]}function Uo(s,e,t,o=44,n=72){let r=s===void 0||s.rooms.length===0&&s.pins.length===0?{minX:-5,minY:-5,maxX:5,maxY:5}:co(s),a=Math.max(r.maxX-r.minX,1),d=Math.max(r.maxY-r.minY,1),l=Za(Math.min(Math.max(e-o*2,40)/a,Math.max(t-n*2,40)/d),Ba,Ua);return{scale:l,ox:e/2-(r.minX+r.maxX)/2*l,oy:t/2-(r.minY+r.maxY)/2*l}}function Zn(s,e,t){let o=Za(s.scale*e,Ba,Ua),n=o/s.scale;return{scale:o,ox:t[0]-(t[0]-s.ox)*n,oy:t[1]-(t[1]-s.oy)*n}}function Va(s,e){return Math.round(s.scale/e.scale*100)}var Yt=1.25;function qa(s){if(typeof s!="object"||s===null)return;let e=s;return{tag:typeof e.tagName=="string"?e.tagName.toUpperCase():"",type:typeof e.type=="string"?e.type.toLowerCase():"text",editable:e.isContentEditable===!0}}var Xa=["button","submit","reset","image"],bd=["checkbox","radio","range","color","file"];function Qn(s){let e=qa(s);return e===void 0?!1:e.editable||e.tag==="TEXTAREA"?!0:e.tag==="INPUT"&&!Xa.includes(e.type)&&!bd.includes(e.type)}function Ya(s){let e=qa(s);return e===void 0?!1:Qn(s)||e.tag==="SELECT"?!0:e.tag==="INPUT"&&!Xa.includes(e.type)}function Z(s,e){if(e)return;let t=s.metaKey===!0||s.ctrlKey===!0,o=s.key.length===1?s.key.toLowerCase():s.key;if(t)return o==="z"?s.shiftKey===!0?"redo":"undo":o==="y"?"redo":s.shiftKey!==!0&&o==="c"?"copy":s.shiftKey!==!0&&o==="v"?"paste":s.shiftKey!==!0&&o==="d"?"duplicate":void 0;if(s.altKey===!0)return;switch(o){case"Escape":return"cancel";case"Delete":case"Backspace":return"delete";case"Enter":return"enter";case"+":case"=":return"zoomIn";case"-":return"zoomOut";case"0":return"fit";case"?":return"help"}let n=s.shiftKey===!0?.1:.01;if(o==="ArrowLeft")return{nudge:[-n,0]};if(o==="ArrowRight")return{nudge:[n,0]};if(o==="ArrowUp")return{nudge:[0,-n]};if(o==="ArrowDown")return{nudge:[0,n]};if(/^[a-z]$/.test(o)&&s.shiftKey!==!0)return{letter:o}}function Te(){let s=globalThis.navigator,e=`${typeof s?.platform=="string"?s.platform:""} ${typeof s?.userAgent=="string"?s.userAgent:""}`;return/Mac|iPhone|iPad/.test(e)}var Za=(s,e,t)=>Math.min(Math.max(s,e),t);function he(s,e=2){return`${(Math.round(s*10**e)/10**e).toFixed(e)} m`}function Zt(s,e=2){let t=(Math.round(s*10**e)/10**e).toFixed(e);return/^-0(\.0*)?$/.test(t)?t.slice(1):t}function Jn(s){let e=s.trim().replace(",",".").replace(/\s*(m|cm|°|deg)$/i,"");if(e===""||!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(e))return;let t=Number(e);if(Number.isFinite(t))return/cm$/i.test(s.trim())?t/100:t}function Go(s){if(s.outline.length<3)return{width:0,depth:0,area:0};let{a0:e,a1:t,c0:o,c1:n}=En(s,Pn(s));return{width:t-e,depth:n-o,area:Math.abs(yo(s.outline))}}function Qt(s){let{width:e,depth:t}=Go(s);return`${e.toFixed(1)} \xD7 ${t.toFixed(1)} m`}function Qa(s){if(s.outline.length<3)return s.outline.slice();let{a0:e,a1:t,c0:o,c1:n,point:i}=En(s,Pn(s));return[i(e,o),i(t,o),i(t,n),i(e,n)]}function Ja(s,e){let t=B(s)[e];if(t===void 0)return"inner";let o=Math.max(Math.hypot(t.b[0]-t.a[0],t.b[1]-t.a[1]),1e-9),n=-(t.b[1]-t.a[1])/o,i=(t.b[0]-t.a[0])/o,r=[(t.a[0]+t.b[0])/2,(t.a[1]+t.b[1])/2],a=Math.max(t.t,.1)+.1,d=ee(s.outline,[r[0]+n*a,r[1]+i*a]),l=ee(s.outline,[r[0]-n*a,r[1]-i*a]);if(d&&l)return"inner";if(d)n=-n,i=-i;else if(!l){let p=X(s);p!==void 0&&(p[0]-r[0])*n+(p[1]-r[1])*i>0&&(n=-n,i=-i)}return Math.abs(n)>Math.abs(i)?n>0?"right":"left":i>0?"bottom":"top"}function Jt(s,e,t){let o=Ja(s,e);return`${t}, ${o} wall`}function es(s){let e=B(s).map((o,n)=>Ja(s,n)),t=new Map;return e.map((o,n)=>{let i=(t.get(o)??0)+1;t.set(o,i);let r=`${o.charAt(0).toUpperCase()}${o.slice(1)} wall`;return i===1&&e.indexOf(o,n+1)<0?r:`${r} ${i}`})}function eo(s){return s.kind==="opening"?"Way through":s.kind==="window"?s.style==="sliding"?"Sliding window":"Window":s.style==="double"?"Double door":s.style==="sliding"?"Sliding door":"Door"}var vd={sofa:"Sofa",table:"Table",chair:"Chair",bed:"Bed",storage:"Storage",television:"TV",bathtub:"Bath",sink:"Basin",toilet:"Toilet",stove:"Hob",oven:"Oven",refrigerator:"Fridge",dishwasher:"Dishwasher",washerDryer:"Washer dryer",fireplace:"Fireplace",stairs:"Stairs"};function to(s){let e=vd[s];if(e!==void 0)return e;let t=s.replace(/([a-z0-9])([A-Z])/g,"$1 $2").toLowerCase();return t.charAt(0).toUpperCase()+t.slice(1)}function O(s,e,t=`${e}s`){return`${s} ${s===1?e:t}`}var ei=25,ti=80,ts="wa.homeMap.split",os="wa.homeMap.tips";function Vo(){try{return globalThis.localStorage??void 0}catch{return}}function qo(s){return Number.isFinite(s)?Math.min(Math.max(s,ei),ti):50}function oi(s,e,t){return t<=0?50:qo((s-e)/t*100)}function ns(){try{let s=Vo()?.getItem(ts);return s==null?50:qo(Number(s))}catch{return 50}}function is(s){try{Vo()?.setItem(ts,String(Math.round(s*10)/10))}catch{}}function rs(){try{return Vo()?.getItem(os)==="1"}catch{return!1}}function as(s){try{Vo()?.setItem(os,s?"1":"0")}catch{}}var wd=66;function ss(s,e,t,o){if(s<=0||e<=0||t<=0||o<=0)return!1;let n=(i,r)=>Math.min(Math.max(i-wd-24,1)/t,Math.max(r-96,1)/o);return n(s,e/2)>n(s/2,e)*1.1}function L(s,e,t,o=""){return m`<section class="hme-card ${o}">
    <div class="hme-h">${s}${t===void 0?g:m`<span class="hme-h-end">${t}</span>`}</div>
    ${e}
  </section>`}var ps="wa-home-map-fold-";function yd(s){try{return globalThis.localStorage?.getItem(ps+s)==="1"}catch{return!1}}function ni(s,e){try{globalThis.localStorage?.setItem(ps+s,e?"1":"0")}catch{}}function Ce(s,e,t,o,n=""){let i=yd(s);return m`<details class="hme-card hme-fold ${n}" ?open=${i} data-fold=${s}
    @toggle=${r=>ni(s,r.currentTarget.open)}>
    <summary class="hme-h">${e}<span class="hme-h-end">${t??""}<span class="hme-fold-caret" aria-hidden="true">›</span></span></summary>
    <div class="hme-fold-body">${o}</div>
  </details>`}function U(s,...e){return m`<div class="hme-r"><span class="hme-l">${s}</span>${e}</div>`}function Q(s,e=!1){return m`<p class="hme-hint ${e?"keep":""}">${s}</p>`}var ds=3;function Md(s,e){return s==="\xB0"?1:10**-e}function N(s){let e=s.digits??2,t=s.step??Md(s.unit,e),o=s.value===void 0?"":Zt(s.value,e),n=p=>Math.min(Math.max(p,s.min??-1/0),s.max??1/0),i=p=>Zt(p,e)===o,r=p=>{let h=Jn(p.value);if(h===void 0||s.min!==void 0&&h<s.min||s.max!==void 0&&h>s.max||i(h)){p.value=o;return}s.set(h)},a=p=>{let h=p.currentTarget,c=h.querySelector("input");if(c===null||s.disabled===!0||p.button!==0||c.matches(":focus"))return;p.preventDefault();let u=s.value,b=p.clientX,f=!1,y=u;try{h.setPointerCapture(p.pointerId)}catch{}let v=x=>{if(u===void 0)return;let w=x.clientX-b;if(!f&&Math.abs(w)<ds)return;f||h.classList.add("scrubbing"),f=!0;let P=x.shiftKey?10:x.altKey?.1:1;y=n(Number((u+(w-Math.sign(w)*ds)*t*P).toFixed(e+(x.altKey?1:0)))),c.value=Zt(y,e),s.preview?.(y)},M=x=>{if(h.removeEventListener("pointermove",v),h.removeEventListener("pointerup",M),h.removeEventListener("pointercancel",M),h.classList.remove("scrubbing"),!f){c.focus(),c.select();return}s.preview?.(void 0),x.type!=="pointercancel"&&y!==void 0&&!i(y)?s.set(y):c.value=o};h.addEventListener("pointermove",v),h.addEventListener("pointerup",M),h.addEventListener("pointercancel",M)},d=s.tag!==void 0&&s.tag.length>1,l=m`<span class="hme-in hme-num ${s.disabled===!0?"off":""}" style=${s.width===void 0?g:`flex:0 0 ${s.width}`}
    title=${s.disabled===!0?g:"Drag sideways to change it, click to type"} @pointerdown=${a}>
    ${s.tag===void 0||d?g:m`<span class="hme-ntag" aria-hidden="true">${s.tag}</span>`}
    <input type="text" inputmode="decimal" aria-label=${s.label} .value=${G(o)} ?disabled=${s.disabled===!0}
      placeholder=${s.value===void 0?"Mixed":""}
      @change=${p=>r(p.target)}
      @keydown=${p=>{let h=p.target;if(p.key==="Enter"&&h.blur(),p.key==="Escape"&&(h.value=o,h.blur()),(p.key==="ArrowUp"||p.key==="ArrowDown")&&s.value!==void 0){p.preventDefault();let c=Jn(h.value)??s.value,u=n(Number((c+(p.key==="ArrowUp"?1:-1)*t*(p.shiftKey?10:1)).toFixed(e)));h.value=Zt(u,e),i(u)||s.set(u)}}} />${s.unit===void 0?g:m`<span class="hme-unit">${s.unit}</span>`}</span>`;return d?m`<div class="hme-lab"><span class="hme-lab-t">${s.tag}</span>${l}</div>`:l}var Pt=new WeakMap,ls=new WeakMap;function oo(s){let e=s.value.toLowerCase(),t=o=>{let n=Pt.get(o);n!==void 0&&(Pt.delete(o),s.preview(void 0),o.value.toLowerCase()!==n&&(ls.set(o,o.value.toLowerCase()),s.set(o.value)))};return m`<input type="color" .value=${G(e)} aria-label=${s.label}
    @input=${o=>{let n=o.target;Pt.has(n)||Pt.set(n,e);let i=n.value.toLowerCase();s.preview(i===Pt.get(n)?void 0:i)}}
    @change=${o=>{let n=o.target,i=n.value.toLowerCase();Pt.has(n)?t(n):i!==e&&i!==ls.get(n)&&s.set(n.value)}}
    @blur=${o=>t(o.target)} />`}function Se(...s){return m`<div class="hme-fields" style=${`--n:${s.length}`}>${s}</div>`}function ii(s,...e){return m`<div class="hme-group"><div class="hme-gl">${s}</div>${e}</div>`}function Et(s){return m`<span class="hme-in"><input type="text" aria-label=${s.label} maxlength=${s.max??100} placeholder=${s.placeholder??""}
    .value=${G(s.value)}
    @change=${e=>{let t=e.target.value;t.trim()!==s.value.trim()&&s.set(t)}}
    @keydown=${e=>{e.key==="Enter"&&e.target.blur()}} /></span>`}function ve(s){return m`<span class="hme-in hme-sel ${s.cls??""}"><select aria-label=${s.label} @change=${e=>s.set(e.target.value)}>
    ${s.options.map(e=>m`<option value=${e.value} ?disabled=${e.disabled===!0} .selected=${G(e.value===s.value)}>${e.label}</option>`)}
  </select></span>`}function Xo(s){return m`<span class="hme-menu ${s.cls??""}"><select aria-label=${s.label} @change=${e=>{let t=e.target,o=t.value;t.value="",o!==""&&s.pick(o)}}>
    <option value="" .selected=${G(!0)}>${s.label}</option>
    ${s.options.map(e=>m`<option value=${e.value} ?disabled=${e.disabled===!0}>${e.label}</option>`)}
  </select><span class="hme-menu-caret" aria-hidden="true">▾</span></span>`}function ie(s){return m`<button type="button" class="hme-pic ${s.on?"on":""}" aria-pressed=${s.on?"true":"false"} title=${s.title??s.label}
    @click=${s.click}>${s.picture}<span>${s.label}</span></button>`}function no(s){return m`<button type="button" class="hme-chip ${s.on?"":"off"}" aria-pressed=${s.on?"true":"false"} aria-label=${s.label}
    @click=${s.click}>${s.on?s.onText:s.offText}</button>`}var kd={wood:"repeating-linear-gradient(0deg,#b38a61 0 9px,#8e6845 9px 10px)",tile:"linear-gradient(#a9a7a1 1px,transparent 1px) 0 0/10px 10px, linear-gradient(90deg,#a9a7a1 1px,transparent 1px) 0 0/10px 10px, #cbc9c2",stone:"#bcc1c6 linear-gradient(#9da2a6 1px,transparent 1px) 0 0/18px 12px",carpet:"#99928a",plain:"#a8a6a1"},$d={wood:"#a17a55",tile:"#bdbbb4",stone:"#b0b5ba",carpet:"#8f8880",plain:"#9c9a95"};function ri(s){return m`<span class="hme-sw" style=${`background:${kd[s]}`}></span>`}var hs=s=>s.map(([e,t])=>`${Math.round(e*10)/10},${Math.round(t*10)/10}`).join(" ");function ai(s,e=34,t=24){let o=s?.rooms??[];if(o.length===0)return m`<svg class="hme-thumb" width=${e} height=${t} viewBox=${`0 0 ${e} ${t}`} aria-hidden="true">
      <rect x="1" y="1" width=${e-2} height=${t-2} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" stroke-dasharray="3 2" /></svg>`;let n=co(s),i=4,r=Math.min((e-i*2)/Math.max(n.maxX-n.minX,.5),(t-i*2)/Math.max(n.maxY-n.minY,.5)),a=e/2-(n.minX+n.maxX)/2*r,d=t/2-(n.minY+n.maxY)/2*r;return m`<svg class="hme-thumb" width=${e} height=${t} viewBox=${`0 0 ${e} ${t}`} aria-hidden="true">
    <rect x="0.5" y="0.5" width=${e-1} height=${t-1} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" />
    ${o.map(l=>H`<polygon points=${hs(l.outline.map(([p,h])=>[a+p*r,d+h*r]))} fill="none" stroke="var(--wa-muted)" stroke-width="1.1" />`)}
  </svg>`}function ms(s,e,t=76,o=54){let n=s.outline.map(f=>f[0]),i=s.outline.map(f=>f[1]),r=Math.min(...n),a=Math.max(...n),d=Math.min(...i),l=Math.max(...i),p=8,h=Math.min((t-p*2)/Math.max(a-r,.5),(o-p*2)/Math.max(l-d,.5)),c=t/2-(r+a)/2*h,u=o/2-(d+l)/2*h,b=hs(s.outline.map(([f,y])=>[c+f*h,u+y*h]));return m`<svg class="hme-room-thumb" width=${t} height=${o} viewBox=${`0 0 ${t} ${o}`} aria-hidden="true">
    <rect width=${t} height=${o} rx="8" fill="#121010" />
    <polygon points=${b} fill=${$d[wo(s)]} stroke="#ece6da" stroke-width="2.5" stroke-linejoin="round" />
    ${e?H`<circle cx=${t*.58} cy=${o*.42} r=${Math.min(t,o)*.22} fill="#ffb648" opacity="0.35" />`:g}
  </svg>`}function si(s,e,t,o={}){let n=(o.reach??10)/t,i,r=n;for(let l of[...s.rooms.flatMap(p=>p.outline),...o.corners??[]]){let p=Math.hypot(l[0]-e[0],l[1]-e[1]);p<=r&&(i=l,r=p)}if(i!==void 0)return[i[0],i[1]];let[a,d]=e;if(o.grid!==void 0&&o.grid>0&&(a=Math.round(a/o.grid)*o.grid,d=Math.round(d/o.grid)*o.grid),o.from!==void 0){let l=8/t;Math.abs(e[0]-o.from[0])<=l&&(a=o.from[0]),Math.abs(e[1]-o.from[1])<=l&&(d=o.from[1])}return[Math.round(a*100)/100,Math.round(d*100)/100]}var we=.1,Ke=.05,Yo=class{constructor(e){this.grid=e;this.active=!1;this.points=[]}start(e){this.active=!0,this.points=[],this.hoverAt=void 0,e.select(void 0),e.redraw()}stop(e){this.active=!1,this.points=[],this.hoverAt=void 0,e?.redraw()}snap(e,t){return si(e.floor,t,e.view.scale,{...this.points.length>0?{from:this.points[this.points.length-1]}:{},...e.toggles.grid?{grid:this.grid}:{},corners:this.points})}closes(e,t){let o=this.points[0];return o!==void 0&&this.points.length>=3&&Math.hypot(t[0]-o[0],t[1]-o[1])*e.view.scale<=10}pointerDown(e,t,o){if(!this.active||t.button!==0)return!1;let n=this.snap(e,o);if(this.closes(e,n))return this.finish(e),!0;let i=this.points[this.points.length-1];return(i===void 0||Math.hypot(n[0]-i[0],n[1]-i[1])>=.05)&&this.points.push(n),e.redraw(),!0}hover(e,t){this.active&&(this.hoverAt=t===void 0?void 0:this.snap(e,t),e.redraw())}keyDown(e,t){return this.active?t.key==="Escape"?(this.stop(e),!0):t.key==="Enter"?(this.points.length>=3&&this.finish(e),!0):t.key==="Backspace"||t.key==="Delete"?(this.points.pop(),e.redraw(),!0):!1:!1}async finish(e){let t=this.points.slice();if(this.stop(e),t.length<3)return;let o=await e.ask({title:"Name the room",label:"Name",value:"Room",ok:"Add room"});if(o===void 0)return;let n=e.newId(),i=e.floor.id;e.apply(r=>Nr(r,i,n,t,o),{select:{kind:"room",roomId:n}})||e.note("err","That room could not be added. Draw at least three corners round some floor.")}overlay(e){if(!this.active)return g;let t=this.points.map(d=>e.toScreen(d)),o=this.hoverAt===void 0?void 0:e.toScreen(this.hoverAt),n=this.hoverAt!==void 0&&this.closes(e,this.hoverAt),i=[...t,...o!==void 0?[o]:[]].map(([d,l])=>`${d.toFixed(1)},${l.toFixed(1)}`).join(" "),r=this.points[this.points.length-1],a=r!==void 0&&this.hoverAt!==void 0?Math.hypot(this.hoverAt[0]-r[0],this.hoverAt[1]-r[1]):0;return H`<g class="hme-draw">
      ${t.length>=3?H`<polygon points=${t.map(([d,l])=>`${d},${l}`).join(" ")} fill="rgba(91,141,239,0.14)" stroke="none" />`:g}
      <polyline points=${i} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />
      ${t.map(([d,l],p)=>H`<circle cx=${d} cy=${l} r=${p===0&&n?8:5} fill=${p===0&&n?"#5b8def":"#fff"} stroke="#5b8def" stroke-width="2" />`)}
      ${o!==void 0&&!n?H`<circle cx=${o[0]} cy=${o[1]} r="4" fill="#5b8def" />`:g}
      ${o!==void 0&&a>.05?H`<g class="hme-tag"><rect x=${o[0]+10} y=${o[1]-26} width="58" height="18" rx="9" fill="#5b8def" />
        <text x=${o[0]+39} y=${o[1]-13} fill="#fff" text-anchor="middle">${a.toFixed(2)} m</text></g>`:g}
    </g>`}hint(){return this.points.length===0?"Click to put down the first corner":this.points.length<3?"Click to add corners":"Click the first corner or press Enter to close the room"}};var xd=15;function di(s,e,t){let o,n=xd;for(let i of s.pins){let r=e(i.at),a=Math.hypot(r[0]-t[0],r[1]-t[1]);a<=n&&(o=i,n=a)}return o}function Qo(s,e,t){let o;for(let n of t===void 0?s.rooms:[t])n.objects.forEach((i,r)=>{if(i.hidden===!0)return;let a=le(de(i));if(!ee(a,e))return;let d=Math.abs(yo(a));(o===void 0||d<o.area)&&(o={thing:{room:n,index:r,object:i},area:d})});return o?.thing}var Hd=10,Pd=6,Ed=12;function gs(s,e,t){let o=t[0]-e[0],n=t[1]-e[1],i=o*o+n*n,r=i<=0?0:Math.max(0,Math.min(1,((s[0]-e[0])*o+(s[1]-e[1])*n)/i));return Math.hypot(s[0]-(e[0]+o*r),s[1]-(e[1]+n*r))}function Td(s,e,t){let o=e(t),n;for(let i of s.rooms)i.openings.forEach((r,a)=>{let d=gs(o,e(r.a),e(r.b));d<=Hd&&(n===void 0||d<n.d)&&(n={roomId:i.id,opening:a,d})});return n===void 0?void 0:{roomId:n.roomId,opening:n.opening}}function cs(s,e,t,o,n){let i=e(t),r;for(let a of s.rooms){let d=n!==void 0&&k(a.id,n);B(a).forEach((l,p)=>{let h=gs(i,e(l.a),e(l.b));if(h>o)return;let c=d?h-4:h;(r===void 0||c<r.d)&&(r={roomId:a.id,wall:p,d:c})})}return r===void 0?void 0:{roomId:r.roomId,wall:r.wall}}function li(s,e,t,o){let n=Td(s,e,t);if(n!==void 0)return{kind:"opening",...n};let i=cs(s,e,t,Pd,o);if(i!==void 0)return{kind:"wall",...i};if(Qo(s,t)!==void 0)return;let r=cs(s,e,t,Ed,o);return r===void 0?void 0:{kind:"wall",...r}}function bs(s,e,t,o){let n=di(s,e,e(t));if(n!==void 0){let d=fe(s,n.id);return d===void 0?{kind:"pin",pinId:n.id}:{kind:"object",roomId:d.roomId,object:d.object}}let i=li(s,e,t,o);if(i!==void 0)return i;let r=Qo(s,t);if(r!==void 0)return{kind:"object",roomId:r.room.id,object:r.index};let a=V(s,t);return a===void 0?void 0:{kind:"room",roomId:a.id}}function pi(s,e){if(s!==void 0){if(s.kind==="room")return e?.kind==="room"&&k(e.roomId,s.roomId)?void 0:s;if(s.kind==="object")return Ee(e).some(o=>k(o.roomId,s.roomId)&&o.object===s.object)?void 0:s;if(s.kind==="pin")return(e?.kind==="pin"?[e.pinId]:e?.kind==="pins"?e.pinIds:[]).some(o=>k(o,s.pinId))?void 0:s;if(s.kind==="wall"||s.kind==="opening")return Ht(s,e)?void 0:s}}var us="rgba(91,141,239,0.14)",Cd="rgba(91,141,239,0.07)",Zo="rgba(150,186,255,0.75)",fs=s=>`${s[0].toFixed(1)},${s[1].toFixed(1)}`;function vs(s,e,t,o){let n=pi(e,t);if(n===void 0)return g;if(n.kind==="pin"){let a=s.pins.find(p=>k(p.id,n.pinId));if(a===void 0)return g;let[d,l]=o(a.at);return H`<g class="hme-hover" pointer-events="none"><circle cx=${d.toFixed(1)} cy=${l.toFixed(1)} r="18" fill=${us} stroke=${Zo} stroke-width="1.5" /></g>`}let i=s.rooms.find(a=>k(a.id,n.roomId));if(i===void 0)return g;if(n.kind==="wall"||n.kind==="opening"){let a=n.kind==="wall"?B(i)[n.wall]:i.openings[n.opening];if(a===void 0)return g;let[d,l]=o(a.a),[p,h]=o(a.b);return H`<g class="hme-hover" pointer-events="none"><line x1=${d.toFixed(1)} y1=${l.toFixed(1)} x2=${p.toFixed(1)} y2=${h.toFixed(1)} stroke=${Zo} stroke-width="6" stroke-linecap="round" /></g>`}if(n.kind==="object"){let a=i.objects[n.object];if(a===void 0)return g;let d=le(de(a)).map(l=>fs(o(l))).join(" ");return H`<g class="hme-hover" pointer-events="none"><polygon points=${d} fill=${us} stroke=${Zo} stroke-width="1.5"
      stroke-dasharray=${a.hidden===!0?"4 3":"none"} stroke-linejoin="round" /></g>`}if(i.outline.length<3)return g;let r=i.outline.map(a=>fs(o(a))).join(" ");return H`<g class="hme-hover" pointer-events="none"><polygon points=${r} fill=${Cd} stroke=${Zo} stroke-width="1.5" stroke-linejoin="round" /></g>`}var hi;function Jo(){return hi??=import("./scene3d-XGSE2NYZ.js").catch(s=>{throw hi=void 0,s}),hi}function mi(s){return new URL("furniture/",s).href}var ci={wood:"Wood",tile:"Tile",stone:"Stone",carpet:"Carpet",plain:"Plain"},Sd={wood:[{name:"Light oak",hex:"#D9B88A"},{name:"Oak",hex:"#B98B5A"},{name:"Walnut",hex:"#6B4A32"},{name:"Grey wash",hex:"#9A948C"}],tile:[{name:"White",hex:"#E9E7E2"},{name:"Grey",hex:"#8E8E8A"},{name:"Black",hex:"#2E2E30"},{name:"Terracotta",hex:"#B4664A"}],stone:[{name:"Light",hex:"#C9C3B8"},{name:"Sand",hex:"#B8A98E"},{name:"Slate",hex:"#5E6468"}],carpet:[{name:"Grey",hex:"#8E8E93"},{name:"Beige",hex:"#CBB9A0"},{name:"Navy",hex:"#2E4A7D"},{name:"Green",hex:"#4F6B4A"}],plain:[{name:"White",hex:"#E9E7E2"},{name:"Grey",hex:"#8E8E8A"},{name:"Black",hex:"#2E2E30"}]},Id=[{name:"White",hex:"#F2F0EB"},{name:"Warm white",hex:"#EDE6D8"},{name:"Greige",hex:"#CFC6B8"},{name:"Sage",hex:"#A3B09A"},{name:"Blue grey",hex:"#8C9AA6"},{name:"Charcoal",hex:"#3E4044"}];function ui(s){let e=s.mixed===!0,t=e?void 0:s.now?.toUpperCase(),o=t!==void 0&&!s.presets.some(n=>n.hex===t);return m`<div class="hme-r top"><span class="hme-l">${s.word}</span>
    <div class="hme-chips hme-colours" role="group" aria-label=${`${s.word} colour`}>
      <button type="button" class="hme-chip sel ${t===void 0&&!e?"on":""}" aria-pressed=${t===void 0&&!e?"true":"false"}
        title=${s.defaultTitle} @click=${()=>s.set(void 0)}>Default</button>
      ${s.presets.map(n=>m`<button type="button" class="hme-colour ${t===n.hex?"on":""}" style=${`--c:${n.hex}`}
        title=${n.name} aria-label=${`${s.word}: ${n.name}`} aria-pressed=${t===n.hex?"true":"false"} @click=${()=>s.set(n.hex)}></button>`)}
      <label class="hme-chip sel hme-pick ${o?"on":""}" title=${s.customTitle}>${o?m`<span class="hme-swatch" style=${`background:${t}`}></span>`:g}Custom
        ${oo({value:t??s.presets[0].hex,label:s.customLabel,preview:s.preview,set:s.set})}</label>
    </div></div>
    ${e?Q(`Mixed: their ${s.word.toLowerCase()} colours differ. Pick one to set them all.`,!0):g}`}var en=15,Rd=[{a:0,c:0},{c:0},{a:1,c:0},{a:1},{a:1,c:1},{c:1},{a:0,c:1},{a:0}];function Dd(s,e){let t=(Math.atan2(e,s)*180/Math.PI+180)%180;return["ew-resize","nwse-resize","ns-resize","nesw-resize"][Math.round(t/45)%4]}function Ad(s,e){let t=e===0?"":` Its ${O(e,"device")} come${e===1?"s":""} off the map too.`;return`${C(s)} comes off the map.${t} A scanned room comes back only by scanning it again on the iPhone. Undo brings it back while this page is open.`}function Me(s){return Ut(s.model)?.name??to(s.kind)}function ws(s){let e=s.map(t=>Me(t.object));return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function on(s){return s.kind==="lamp"||Gt(s)?.kind==="lamp"}function gi(s,e){let t=ue(s,e);return t.kind==="light"&&t.on}function Od(s,e){let t=Ht(e.sel,s.hover);return m`<div class="hme-ly ${e.picked?"on":""} ${t?"hov":""} ${e.hidden?"hid":""}"
    @pointerenter=${()=>s.setHover(e.sel)} @pointerleave=${()=>s.setHover(void 0)}>
    <button type="button" class="hme-ly-main" aria-pressed=${e.picked?"true":"false"} title=${e.title} @click=${e.pick}>
      ${e.icon}<span class="hme-ly-nm">${e.name}</span><span class="hme-ly-end">${e.end}</span></button>
    ${e.eye===void 0?g:m`<button type="button" class="hme-eye" aria-label=${`${e.hidden?"Show":"Hide"} ${e.name}`}
      title=${e.hidden?"Show it again on the map, the tiles and the watch":"Hide it on the map, the tiles and the watch; it stays listed here"}
      @click=${e.eye}>${Ld(!e.hidden)}</button>`}
  </div>`}function Ld(s){return m`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z" fill="none" stroke="currentColor" stroke-width="1.3"></path>
    ${s?H`<circle cx="8" cy="8" r="2" fill="currentColor"></circle>`:H`<path d="M2.5 13.5l11-11" stroke="currentColor" stroke-width="1.3"></path>`}</svg>`}function ys(s){let e=s[0]?.room.id;return e!==void 0&&s.every(t=>k(t.room.id,e))?{kind:"room",roomId:e}:void 0}var _d=["fabric","wood"],it=s=>s.map(e=>({roomId:e.room.id,object:e.index}));function fi(s){return br(Gt(s))}function bi(s,e,t){let o=Ea(s,t).filter(r=>e===""||r.group===e);if(s.trim()!==""||e!=="")return[{title:e===""?"Found":e,pieces:o}];let n=[],i=t===void 0?[]:o.filter(r=>r.kind===t);i.length>0&&n.push({title:`${to(t)} pieces`,pieces:i});for(let r of tt.groups){let a=o.filter(d=>d.group===r&&!i.includes(d));a.length>0&&n.push({title:r,pieces:a})}return n}function Fd(s){return Math.round(ur(s.turn)*10)/10}var j=s=>s.toFixed(1),ye=s=>`${s[0].toFixed(1)},${s[1].toFixed(1)}`,vi="room-card",tn=class{constructor(){this.draw=new Yo(we);this.guides=[];this.dragging=!1;this.resizing=!1;this.pickerQuery="";this.pickerGroup="";this.pickerFocus=!1;this.thumbs=new Map;this.askedThumbs=new Set;this.thumbFrame=0}openPicker(e,t,o){this.picker=o===void 0?{roomId:t.id}:{roomId:t.id,index:o},this.pickerQuery="",this.pickerGroup="",this.pickerFocus=!0,e.redraw()}closePicker(e){this.picker=void 0,e.redraw()}get pickerOpen(){return this.picker!==void 0}thumb(e,t){let o=this.thumbs.get(t),n=e.furnitureBase;if(o!==void 0||n===void 0||this.askedThumbs.has(t))return o;this.askedThumbs.add(t),Jo().then(i=>i.homeMapPieceThumb(n,t)).then(i=>{if(i===void 0||(this.thumbs.set(t,i),this.thumbFrame!==0))return;let r=typeof requestAnimationFrame=="function"?requestAnimationFrame:a=>setTimeout(a,16);this.thumbFrame=r(()=>{this.thumbFrame=0,e.redraw()})},()=>{})}piecePic(e,t,o){let n=t===void 0?void 0:this.thumb(e,t.id);return m`<span class="${o} ${n===void 0?"wait":""}">${n===void 0?g:m`<img src=${n} alt="" draggable="false" />`}</span>`}pickPiece(e,t){let o=this.picker,n=o===void 0?void 0:e.floor.rooms.find(d=>k(d.id,o.roomId));if(this.picker=void 0,o===void 0||n===void 0){e.redraw();return}let i=n.id;if(o.index!==void 0){let d=o.index;e.apply(l=>Or(l,i,d,t),{select:{kind:"object",roomId:i,object:d}})||e.redraw();return}let r=X(n)??se(n),a=n.objects.length;e.apply(d=>Dr(d,i,t,r),{select:{kind:"object",roomId:i,object:a}})||e.redraw()}sheet(e){let t=this.picker;if(t===void 0)return g;let o=e.floor.rooms.find(c=>k(c.id,t.roomId)),n=t.index===void 0?void 0:o?.objects[t.index];if(o===void 0||t.index!==void 0&&n===void 0)return this.picker=void 0,g;let i=n===void 0?void 0:Gt(n),r=bi(this.pickerQuery,this.pickerGroup,n?.kind),a=n===void 0?"Add furniture":"Change model",d=n===void 0?`To ${C(o)}, in its middle. Drag it into place once it is in.`:`${Me(n)} in ${C(o)} keeps its place, size and turn.`,l=c=>tt.pieces.filter(u=>c===""||u.group===c).length,p=["",...tt.groups],h=this.pickerFocus;return this.pickerFocus=!1,m`<div class="hme-scrim hme-sheet"
      @pointerdown=${c=>{c.target===c.currentTarget&&this.closePicker(e)}}
      @keydown=${c=>{c.stopPropagation(),c.key==="Escape"&&this.closePicker(e)}}>
      <div class="hme-fpick" role="dialog" aria-modal="true" aria-label=${a}>
        <header class="hme-fpick-head">
          <div class="hme-fpick-t"><strong>${a}</strong><span>${d}</span></div>
          <label class="hme-find hme-fpick-find"><span aria-hidden="true">⌕</span>
            <input type="search" placeholder="Find a piece: sofa, lamp, desk" aria-label="Find a piece" .value=${G(this.pickerQuery)}
              ${ot(c=>{h&&c instanceof HTMLInputElement&&setTimeout(()=>c.focus(),0)})}
              @input=${c=>{this.pickerQuery=c.target.value,e.redraw()}} /></label>
          <button type="button" class="hme-x hme-fpick-close" aria-label="Close" title="Close (Esc)" @click=${()=>this.closePicker(e)}>×</button>
        </header>
        <div class="hme-fpick-main">
          <nav class="hme-fpick-groups" aria-label="Groups">
            ${p.map(c=>m`<button type="button" class="hme-tool ${c===this.pickerGroup?"on":""}" aria-pressed=${c===this.pickerGroup?"true":"false"}
              @click=${()=>{this.pickerGroup=c,e.redraw()}}>${c===""?"All":c}<span class="n">${l(c)}</span></button>`)}
          </nav>
          <div class="hme-fpick-body">
            ${r.every(c=>c.pieces.length===0)?m`<p class="hme-empty-line">No piece by that name${this.pickerGroup===""?"":` in ${this.pickerGroup}`}.</p>`:g}
            ${r.filter(c=>c.pieces.length>0).map(c=>m`<section class="hme-fpick-sec">
              <div class="hme-h">${c.title}<span class="hme-h-end">${O(c.pieces.length,"piece")}</span></div>
              <div class="hme-fgrid">${c.pieces.map(u=>{let b=i?.id===u.id;return m`<button type="button" class="hme-fcard ${b?"on":""}" aria-pressed=${b?"true":"false"}
                  title=${`${n===void 0?"Add":"Use"} ${u.name}, ${ut(u)}`} @click=${()=>this.pickPiece(e,u)}>
                  ${this.piecePic(e,u,"hme-fcard-pic")}
                  <span class="hme-fcard-name">${u.name}</span>
                  <span class="hme-fcard-size mono">${ut(u)}</span>
                </button>`})}</div>
            </section>`)}
          </div>
        </div>
      </div>
    </div>`}stopDrag(e){this.guides=[],this.dragging=!1,this.resizing=!1,e.preview(void 0)}focus(e){if(oe(e.selection))return;let t=ne(e.selection);return t===void 0?void 0:e.floor.rooms.find(o=>k(o.id,t))}pickedMany(e){if(e.selection?.kind==="objects")return Ee(e.selection).flatMap(t=>{let o=e.floor.rooms.find(i=>k(i.id,t.roomId)),n=o?.objects[t.object];return o===void 0||n===void 0?[]:[{room:o,index:t.object,object:n}]})}picked(e){let t=e.selection;if(t?.kind!=="object")return;let o=this.focus(e),n=o?.objects[t.object];return o===void 0||n===void 0?void 0:{room:o,index:t.object,object:n}}thingUnder(e,t,o){return Qo(e.floor,t,o)}pickThing(e,t,o){e.select({kind:"object",roomId:t.id,object:o})}overlay(e){if(this.draw.active)return this.draw.overlay(e);let t=this.focus(e),o=this.picked(e),n=this.pickedMany(e),i=[];for(let r of this.guides)i.push(this.guide(e,r));if(n!==void 0)for(let r of n){let a=le(de(r.object)).map(d=>ye(e.toScreen(d))).join(" ");i.push(H`<polygon class="hme-box" points=${a} fill="rgba(91,141,239,0.1)" stroke="#5b8def" stroke-width="2"
          stroke-dasharray=${r.object.hidden===!0?"5 4":"none"} pointer-events="none" />`)}else if(o!==void 0){let r=o.room.outline.map(d=>ye(e.toScreen(d))).join(" ");i.push(H`<polygon points=${r} fill="none" stroke="#5b8def" stroke-width="1" stroke-dasharray="4 4" opacity="0.5" pointer-events="none" />`);let a=o.object;i.push(this.box(e,le(de(a)),{width:a.size[0],depth:a.size[1]},"thing",a.hidden===!0))}else t!==void 0&&t.outline.length>=3&&i.push(this.box(e,Qa(t),Go(t),"room",!1));return i.length===0?g:H`${i}`}box(e,t,o,n,i){let r=t.map(v=>e.toScreen(v)),a=r.reduce((v,M)=>[v[0]+M[0]/4,v[1]+M[1]/4],[0,0]),d=v=>[(r[v][0]+r[(v+1)%4][0])/2,(r[v][1]+r[(v+1)%4][1])/2],l=v=>{let M=Math.max(Math.hypot(v[0]-a[0],v[1]-a[1]),1e-6);return[(v[0]-a[0])/M,(v[1]-a[1])/M]},p=[0,1,2,3].flatMap(v=>[r[v],d(v)]),h=[0,1,2,3].reduce((v,M)=>d(M)[1]<d(v)[1]?M:v,0),c=d(h),u=l(c),b=[c[0]+u[0]*44,c[1]+u[1]*44],f=[];for(let v of[[0,2],[1,3]]){let[M,x]=v,P=Math.abs(r[(M+1)%4][0]-r[M][0])>=Math.abs(r[(M+1)%4][1]-r[M][1])?l(d(M))[1]<=l(d(x))[1]?M:x:l(d(M))[0]<=l(d(x))[0]?M:x,_=r[P],I=r[(P+1)%4],z=l(d(P)),S=[_[0]+z[0]*20,_[1]+z[1]*20],E=[I[0]+z[0]*20,I[1]+z[1]*20],A=[(S[0]+E[0])/2,(S[1]+E[1])/2],q=P%2===0?o.width:o.depth,K=[z[0]*5,z[1]*5];f.push(H`<path d=${`M${ye(S)}L${ye(E)}M${ye([S[0]-K[0],S[1]-K[1]])}L${ye([S[0]+K[0],S[1]+K[1]])}M${ye([E[0]-K[0],E[1]-K[1]])}L${ye([E[0]+K[0],E[1]+K[1]])}`}
        stroke="#5b8def" stroke-width="1.2" fill="none" />
        <g class="hme-tag"><rect x=${j(A[0]-26)} y=${j(A[1]-9)} width="52" height="18" rx="9" fill="#5b8def" />
        <text x=${j(A[0])} y=${j(A[1]+4)} fill="#fff" text-anchor="middle">${q.toFixed(2)} m</text></g>`)}let y=n==="room"?"Drag to resize the room. Shift keeps its proportions, Alt resizes it about its middle, Cmd or Ctrl stops it snapping.":"Drag to resize it. Shift keeps its proportions, Alt resizes it about its middle.";return H`<g class="hme-box">
      <polygon points=${r.map(ye).join(" ")} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray=${i?"5 4":"none"} />
      ${this.resizing||!this.dragging?f:g}
      ${this.dragging?g:H`
        <line x1=${j(c[0])} y1=${j(c[1])} x2=${j(b[0])} y2=${j(b[1])} stroke="#5b8def" stroke-width="1.6" />
        ${p.map((v,M)=>H`<rect data-hme="resize" data-handle=${M} x=${j(v[0]-5)} y=${j(v[1]-5)} width="10" height="10"
          fill="#fff" stroke="#5b8def" stroke-width="1.6" style=${`cursor:${Dd(v[0]-a[0],v[1]-a[1])}`}>
          <title>${y}</title></rect>`)}
        <g data-hme="turn" style="cursor:grab" transform=${`translate(${ye(b)})`}>
          <title>${n==="room"?"Drag to turn the room. Hold Alt to turn it freely.":"Drag to turn it. Hold Alt to turn it freely."}</title>
          <circle r="9" fill="#5b8def" />
          <path d="M-4 0a4 4 0 1 0 1.5-3.1M-4-4.5v2.5h2.5" fill="none" stroke="#fff" stroke-width="1.3" />
        </g>`}
    </g>`}guide(e,t){let o=e.toScreen(t.a),n=e.toScreen(t.b);if(t.door===!0){let c=e.floor.rooms.find(v=>k(v.id,t.roomId)),u=`Door to ${c===void 0?"the next room":C(c)}`,b=u.length*6.2+20,f=(o[0]+n[0])/2-b/2,y=(o[1]+n[1])/2-34;return H`<g class="hme-guide" pointer-events="none">
        <line x1=${j(o[0])} y1=${j(o[1])} x2=${j(n[0])} y2=${j(n[1])} stroke="#30d158" stroke-width="5" stroke-linecap="round" />
        <g class="hme-tag"><rect x=${j(f)} y=${j(y)} width=${j(b)} height="20" rx="10" fill="#30d158" />
        <text x=${j(f+b/2)} y=${j(y+14)} fill="#000" text-anchor="middle">${u}</text></g>
      </g>`}let i=Math.max(Math.hypot(n[0]-o[0],n[1]-o[1]),1e-6),r=[(n[0]-o[0])/i,(n[1]-o[1])/i],a=[o[0]-r[0]*40,o[1]-r[1]*40],d=[n[0]+r[0]*40,n[1]+r[1]*40],l=e.floor.rooms.find(c=>k(c.id,t.roomId)),p=`Lined up with ${l===void 0?"a":C(l)} wall`,h=p.length*6.2+20;return H`<g class="hme-guide" pointer-events="none">
      <line x1=${j(a[0])} y1=${j(a[1])} x2=${j(d[0])} y2=${j(d[1])} stroke="#ff4fa3" stroke-width="1.2" stroke-dasharray="6 4" />
      <g class="hme-tag"><rect x=${j(d[0]+6)} y=${j(d[1]-10)} width=${j(h)} height="20" rx="10" fill="#ff4fa3" />
      <text x=${j(d[0]+6+h/2)} y=${j(d[1]+4)} fill="#fff" text-anchor="middle">${p}</text></g>
    </g>`}pointerDown(e,t,o){return this.draw.active?this.draw.pointerDown(e,t,o):t.button!==0?!1:this.pressHandle(e,t,o)||this.pressBody(e,t,o)}pressHandle(e,t,o){let n=t.target?.closest?.("[data-hme]"),i=n?.getAttribute("data-hme");if(i!=="turn"&&i!=="resize")return!1;let r=Rd[Number(n?.getAttribute("data-handle"))],a=this.picked(e),d=this.focus(e);if(a!==void 0){if(i==="turn")this.thingTurnDrag(e,t,a,o);else if(r!==void 0)this.thingResizeDrag(e,t,a,r,o);else return!1;return!0}if(d===void 0)return!1;if(i==="turn")this.turnDrag(e,t,d,o);else if(r!==void 0)this.resizeDrag(e,t,d,r,o);else return!1;return!0}pressThing(e,t,o,n){let i=e.floor.rooms.find(a=>k(a.id,o.roomId)),r=i?.objects[o.object];return i===void 0||r===void 0?!1:t.shiftKey||t.metaKey||t.ctrlKey?(e.select(nt(e.selection,{roomId:i.id,object:o.object})),!0):(this.dragThing(e,t,{room:i,index:o.object,object:r},n),!0)}dragThing(e,t,o,n){let i=this.pickedMany(e),r=i!==void 0&&i.some(a=>k(a.room.id,o.room.id)&&a.index===o.index);r||this.pickThing(e,o.room,o.index),t.altKey?this.copyDrag(e,t,r?i:[o],n):r?this.manyMoveDrag(e,t,i,o,n):this.thingMoveDrag(e,t,o,n)}manyMoveDrag(e,t,o,n,i){let r=it(o),a=o[0].object.c,d=[0,0];e.drag(t,{move:l=>{let p=l[0]-i[0],h=l[1]-i[1];if(e.toggles.grid){let c=we;p=Math.round((a[0]+p)/c)*c-a[0],h=Math.round((a[1]+h)/c)*c-a[1]}this.guides=[],this.dragging=!0,d=[p,h],e.preview(c=>Po(c,r,p,h))},end:(l,p,h)=>{if(this.stopDrag(e),!h){this.pickThing(e,n.room,n.index);return}let[c,u]=d;(Math.abs(c)>=.005||Math.abs(u)>=.005)&&e.apply(b=>Po(b,r,c,u))},cancel:()=>this.stopDrag(e)})}copyDrag(e,t,o,n){let i=Eo(e.doc,it(o));if(i===void 0)return;let r=e.floor.id,a=Lr(i),d;e.drag(t,{move:l=>{let p=[a[0]+l[0]-n[0],a[1]+l[1]-n[1]];if(e.toggles.grid){let c=we;p=[Math.round(p[0]/c)*c,Math.round(p[1]/c)*c]}this.guides=[],this.dragging=!0,d=p;let h=p;e.preview(c=>To(c,r,i,h)?.doc)},end:(l,p,h)=>{this.stopDrag(e),h&&d!==void 0&&this.paste(e,i,d)},cancel:()=>this.stopDrag(e)})}pressBody(e,t,o){let n=this.thingUnder(e,o,void 0);if(t.metaKey||t.ctrlKey)return n!==void 0&&e.select(nt(e.selection,{roomId:n.room.id,object:n.index})),n!==void 0||V(e.floor,o)!==void 0;if(n!==void 0)return this.dragThing(e,t,n,o),!0;let i=V(e.floor,o);return i===void 0?!1:(e.select({kind:"room",roomId:i.id}),this.moveDrag(e,t,i,o),!0)}moveDrag(e,t,o,n){let i=e.doc,r=o.id,a=_e(o.outline),d=[0,0];e.drag(t,{move:(l,p)=>{let h=l[0]-n[0],c=l[1]-n[1];if(e.toggles.grid&&a!==void 0){let u=we;h=Math.round((a.minX+h)/u)*u-a.minX,c=Math.round((a.minY+c)/u)*u-a.minY}if(this.guides=[],e.toggles.snap&&!p.altKey){let u=wr(i,r,h,c);u!==void 0&&(h=u.dx,c=u.dy,this.guides=u.guides)}this.dragging=!0,d=[h,c],e.preview(u=>ft(u,r,h,c))},end:(l,p,h)=>{let c=this.guides.some(f=>f.door===!0);this.stopDrag(e);let[u,b]=d;h&&(Math.abs(u)>=.005||Math.abs(b)>=.005)&&e.apply(f=>{let y=ft(f,r,u,b);return y!==void 0&&c?ca(y,[r]):y},{select:{kind:"room",roomId:r}})},cancel:()=>this.stopDrag(e)})}resizeDrag(e,t,o,n,i){let r=Mr(o);if(r===void 0)return;let a=e.doc,d=o.id,l=r.a1-r.a0,p=r.c1-r.c0;if(l<=1e-6||p<=1e-6)return;let h=f=>f[0]*r.u[0]+f[1]*r.u[1],c=f=>f[0]*r.v[0]+f[1]*r.v[1],u=f=>Math.min(Math.max(f,Lt),_t),b;e.drag(t,{move:(f,y)=>{let v=y.altKey?2:1,M=l,x=p;if(n.a!==void 0&&(M=l+(h(f)-h(i))*(n.a===1?1:-1)*v),n.c!==void 0&&(x=p+(c(f)-c(i))*(n.c===1?1:-1)*v),e.toggles.grid){let I=we;n.a!==void 0&&(M=Math.round(M/I)*I),n.c!==void 0&&(x=Math.round(x/I)*I)}if(M=u(M),x=u(x),y.shiftKey){let I=M/l,z=x/p,S=n.a===void 0?z:n.c===void 0||Math.abs(Math.log(I))>=Math.abs(Math.log(z))?I:z;S=Math.min(Math.max(S,Lt/Math.min(l,p)),_t/Math.max(l,p)),M=l*S,x=p*S}let w=[y.altKey||n.a===void 0?.5:1-n.a,y.altKey||n.c===void 0?.5:1-n.c],P={width:M,depth:x,anchor:w};if(this.guides=[],e.toggles.snap&&!y.altKey&&!y.ctrlKey&&!y.metaKey){let I=kr(a,d,P,n,{proportional:y.shiftKey});I!==void 0&&(P=I.resize,this.guides=I.guides)}this.dragging=!0,this.resizing=!0,b=P;let _=P;e.preview(I=>Ft(I,d,_))},end:(f,y,v)=>{this.stopDrag(e);let M=b;!v||M===void 0||Math.abs((M.width??l)-l)<.005&&Math.abs((M.depth??p)-p)<.005||e.apply(x=>Ft(x,d,M),{select:{kind:"room",roomId:d}})},cancel:()=>this.stopDrag(e)})}turnDrag(e,t,o,n){let i=o.id,r=se(o),a=Math.atan2(n[1]-r[1],n[0]-r[0]),d=0;e.drag(t,{move:(l,p)=>{let h=(Math.atan2(l[1]-r[1],l[0]-r[0])-a)*180/Math.PI;h=(h+540)%360-180,p.altKey||(h=Math.round(h/en)*en),this.dragging=!0,d=h,e.preview(c=>qe(c,i,h,r))},end:(l,p,h)=>{this.stopDrag(e),h&&Math.abs(d)>.01&&e.apply(c=>qe(c,i,d,r),{select:{kind:"room",roomId:i}})},cancel:()=>this.stopDrag(e)})}thingMoveDrag(e,t,o,n){let{room:i,index:r,object:a}=o,d=i.id,l=a.c,p=l;e.drag(t,{move:(h,c)=>{let u=[l[0]+h[0]-n[0],l[1]+h[1]-n[1]];if(e.toggles.grid){let f=we;u=[Math.round(u[0]/f)*f,Math.round(u[1]/f)*f]}if(this.guides=[],e.toggles.snap&&!c.altKey){let f=jr(i,a,u);u=f.c,this.guides=f.guides}this.dragging=!0,p=u;let b=u;e.preview(f=>gt(f,d,r,b))},end:(h,c,u)=>{if(this.stopDrag(e),u&&Math.hypot(p[0]-l[0],p[1]-l[1])>=.005){let b=p;e.apply(f=>gt(f,d,r,b),{select:{kind:"object",roomId:d,object:r}})}},cancel:()=>this.stopDrag(e)})}thingResizeDrag(e,t,o,n,i){let{room:r,index:a,object:d}=o,l=r.id,{u:p,v:h}=Fr(d),c=Math.max(d.size[0],bt),u=Math.max(d.size[1],bt),b=M=>M[0]*p[0]+M[1]*p[1],f=M=>M[0]*h[0]+M[1]*h[1],y=M=>Math.min(Math.max(M,bt),Co),v;e.drag(t,{move:(M,x)=>{let w=x.altKey?2:1,P=c,_=u;if(n.a!==void 0&&(P=c+(b(M)-b(i))*(n.a===1?1:-1)*w),n.c!==void 0&&(_=u+(f(M)-f(i))*(n.c===1?1:-1)*w),e.toggles.grid){let S=we;n.a!==void 0&&(P=Math.round(P/S)*S),n.c!==void 0&&(_=Math.round(_/S)*S)}if(P=y(P),_=y(_),x.shiftKey){let S=P/c,E=_/u,A=n.a===void 0?E:n.c===void 0||Math.abs(Math.log(S))>=Math.abs(Math.log(E))?S:E;A=Math.min(Math.max(A,bt/Math.min(c,u)),Co/Math.max(c,u)),P=c*A,_=u*A}let I=[x.altKey||n.a===void 0?.5:1-n.a,x.altKey||n.c===void 0?.5:1-n.c];this.dragging=!0,this.resizing=!0;let z={width:P,depth:_,anchor:I};v=z,e.preview(S=>jt(S,l,a,z))},end:(M,x,w)=>{this.stopDrag(e);let P=v;!w||P===void 0||Math.abs((P.width??c)-d.size[0])<.005&&Math.abs((P.depth??u)-d.size[1])<.005||e.apply(_=>jt(_,l,a,P),{select:{kind:"object",roomId:l,object:a}})},cancel:()=>this.stopDrag(e)})}thingTurnDrag(e,t,o,n){let{room:i,index:r,object:a}=o,d=i.id,l=a.c,p=Math.atan2(n[1]-l[1],n[0]-l[0]),h=0;e.drag(t,{move:(c,u)=>{let b=(Math.atan2(c[1]-l[1],c[0]-l[0])-p)*180/Math.PI;b=(b+540)%360-180,u.altKey||(b=Math.round(b/en)*en),this.dragging=!0,h=-b;let f=h;e.preview(y=>Xe(y,d,r,f))},end:(c,u,b)=>{this.stopDrag(e);let f=h;b&&Math.abs(f)>.01&&e.apply(y=>Xe(y,d,r,f),{select:{kind:"object",roomId:d,object:r}})},cancel:()=>this.stopDrag(e)})}hover(e,t){this.draw.hover(e,t)}pickedRefs(e){let t=e.selection;return t?.kind==="object"?[{roomId:t.roomId,object:t.object}]:t?.kind==="objects"?t.items:[]}copyPicked(e){let t=Eo(e.doc,this.pickedRefs(e));return t===void 0?!1:(this.clip=t,!0)}paste(e,t,o){let n=e.floor.id,i=ne(e.selection),r=To(e.doc,n,t,o,i);if(r===void 0)return;let a=r.items[0],d=r.items.length===1?{kind:"object",roomId:a.roomId,object:a.object}:{kind:"objects",items:r.items};return e.apply(l=>To(l,n,t,o,i)?.doc,{select:d})?r:void 0}pasteClip(e){if(this.clip===void 0)return!1;let t=this.paste(e,this.clip,this.pointer);return t!==void 0&&(this.clip=t.clip),!0}duplicatePicked(e){let t=Eo(e.doc,this.pickedRefs(e));return t===void 0?!1:(this.paste(e,t,void 0),!0)}clipKey(e,t){return t==="copy"?this.copyPicked(e):t==="paste"?this.pasteClip(e):this.duplicatePicked(e)}copyButtons(e){return m`<button type="button" class="hme-tb" title="Copy it, to paste on any floor (${Te()?"\u2318C":"Ctrl+C"})" @click=${()=>this.copyPicked(e)}>Copy</button>
      <button type="button" class="hme-tb" title="Make a copy beside it (${Te()?"\u2318D":"Ctrl+D"})" @click=${()=>this.duplicatePicked(e)}>Duplicate</button>`}pasteButton(e){return m`<button type="button" class="hme-tb" title="Paste the furniture you copied (${Te()?"\u2318V":"Ctrl+V"})" @click=${()=>this.pasteClip(e)}>Paste</button>`}keyDown(e,t){if(this.draw.active)return this.draw.keyDown(e,t);let o=this.pickedMany(e);if(o!==void 0)return this.manyKeyDown(e,t,o);let n=this.focus(e);if(n===void 0)return!1;let i=Z(t,!1),r=this.picked(e);if(r!==void 0){let{index:a,object:d}=r,l={kind:"room",roomId:n.id};if(i==="delete")return e.apply(p=>xo(p,n.id,a),{select:l}),!0;if(i==="cancel")return e.select(l),!0;if(typeof i=="object"&&"nudge"in i){let[p,h]=i.nudge;return e.apply(c=>gt(c,n.id,a,[d.c[0]+p,d.c[1]+h])),!0}return!1}if(i==="delete")return this.askDelete(e,n),!0;if(typeof i=="object"&&"nudge"in i){let[a,d]=i.nudge;return e.apply(l=>ft(l,n.id,a,d)),!0}return!1}manyKeyDown(e,t,o){let n=Z(t,!1),i=it(o);if(n==="delete")return this.askDeleteThings(e,o),!0;if(n==="cancel")return e.select(ys(o)),!0;if(typeof n=="object"&&"nudge"in n){let[r,a]=n.nudge;return e.apply(d=>Po(d,i,r,a)),!0}return!1}async askDeleteThings(e,t){let o=it(t);await e.confirm({title:`Delete ${O(t.length,"thing")}?`,text:`${ws(t)} come off the map. Undo brings them back while this page is open.`,ok:"Delete",danger:!0})&&e.apply(i=>_r(i,o),{select:ys(t)??null})}cursor(){return this.draw.active?"crosshair":void 0}leave(e){this.draw.stop(e),this.picker=void 0,this.guides=[],this.dragging=!1,this.resizing=!1}dock(e){return m`<button type="button" class="hme-tb ${e.toggles.snap?"on":""}" aria-pressed=${e.toggles.snap?"true":"false"}
        title="Snap: a dragged room locks to the door of the next room, or lines up with the walls round it. Hold Alt to move it freely." @click=${()=>e.setToggle("snap",!e.toggles.snap)}>Snap</button>`}viewItems(e){return[{label:"Grid 10 cm",on:e.toggles.grid,title:"Points land on a 10 cm grid, drawn on the plan",flip:()=>e.setToggle("grid",!e.toggles.grid)}]}pill(e){if(this.draw.active)return m`<span class="hme-pill-name">${this.draw.hint()}</span>
        ${this.draw.points.length>=3?m`<button type="button" class="hme-tb" @click=${()=>{this.draw.finish(e)}}>Close the room</button>`:g}
        <button type="button" class="hme-tb" @click=${()=>this.draw.stop(e)}>Cancel</button>`;if(this.dragging)return g;let t=this.pickedMany(e);if(t!==void 0){let r=it(t),a=t.some(d=>d.object.hidden!==!0);return m`<span class="hme-pill-name">${O(t.length,"thing")}</span>
        ${this.copyButtons(e)}
        <button type="button" class="hme-tb" title=${a?"Hide every picked thing":"Show every picked thing"}
          @click=${()=>e.apply(d=>Ho(d,r,a))}>${a?"Hide":"Show"}</button>
        <button type="button" class="hme-tb danger" @click=${()=>{this.askDeleteThings(e,t)}}>Delete</button>`}let o=this.focus(e);if(this.dragging)return g;if(o===void 0)return this.clip===void 0?g:this.pasteButton(e);let n=o.id,i=this.picked(e);if(i!==void 0){let{index:r,object:a}=i;return m`<span class="hme-pill-name">${Me(a)}</span>
        <button type="button" class="hme-tb" @click=${()=>e.apply(d=>Xe(d,n,r,90))}>⟲ Turn 90°</button>
        ${this.copyButtons(e)}
        <button type="button" class="hme-tb" @click=${()=>e.apply(d=>$o(d,n,r,a.hidden!==!0))}>${a.hidden===!0?"Show":"Hide"}</button>
        <button type="button" class="hme-tb" @click=${()=>e.select({kind:"room",roomId:n})}>${C(o)} ›</button>
        <button type="button" class="hme-tb danger" @click=${()=>e.apply(d=>xo(d,n,r),{select:{kind:"room",roomId:n}})}>Remove</button>`}return m`<span class="hme-pill-name">${C(o)}</span>
      ${this.clip===void 0?g:this.pasteButton(e)}
      <button type="button" class="hme-tb" @click=${()=>e.apply(r=>qe(r,n,90))}>⟲ Turn 90°</button>
      <button type="button" class="hme-tb" title="Make its corners square" @click=${()=>e.apply(r=>Nt(r,n))}>Square</button>
      ${Xo({label:"More",cls:"hme-tb",options:[{value:"snap",label:"Snap to walls"},{value:"level",label:"Level"},{value:"delete",label:"Delete room"}],pick:r=>{r==="snap"?e.apply(a=>yr(a,n)):r==="level"?e.apply(a=>Cn(a,n)):this.askDelete(e,o)}})}`}floorMenu(e,t,o,n){let i=e.doc.floors.filter(r=>!k(r.id,e.floor.id));return Xo({label:o,cls:n,options:[...i.map(r=>({value:r.id,label:W(r)})),{value:"new",label:"New floor\u2026"}],pick:r=>{this.moveToFloor(e,t,r)}})}async moveToFloor(e,t,o){let n=t.id,i={kind:"room",roomId:n};if(o!=="new"){e.apply(l=>Sn(l,n,{floorId:o}),{select:i,floorId:o});return}let r=Math.max(...e.doc.floors.map(l=>l.story))+1,a=await e.ask({title:"A new floor",label:"Name",value:r===1?"Upstairs":`Floor ${r+1}`,ok:"Move the room there"});if(a===void 0)return;let d=e.newId();e.apply(l=>Sn(l,n,{newFloor:{id:d,name:a,story:r}}),{select:i,floorId:d})}async askDelete(e,t){let o=Ve(e.floor,t.id).length;await e.confirm({title:`Delete ${C(t)}?`,text:Ad(t,o),ok:"Delete room",danger:!0})&&e.apply(i=>Er(i,t.id),{select:null})}inspector(e){let t=this.pickedMany(e);if(t!==void 0)return this.manyInspector(e,t);let o=this.focus(e);if(o===void 0)return this.floorCard(e,e.floor);let n=this.picked(e);if(n!==void 0)return this.thingInspector(e,n);let i=o.id,r=Go(o),a=tr(e.floor,e.toggles.live?e.hass?.states:void 0).has(o.id),d=_e(o.outline)??{minX:0,minY:0,maxX:0,maxY:0},l=Math.round(-vr(o)*10)/10,p=o.areaId===void 0||e.areas.some(w=>w.id===o.areaId),h=e.areas.find(w=>w.id===o.areaId)?.name,c=o.pageId===void 0||e.pages.some(w=>k(w.id,o.pageId)),u=cr(o),b=this.edits(e),f=o.objects.length,y=o.openings.filter(w=>w.kind!=="window").length,v=o.openings.length-y,M=o.openings.length===0?void 0:`${O(y,"door")}, ${O(v,"window")}`,x=w=>`room-${w}`;return m`
      ${this.roomBefore?.(e,o)??g}

      <section class="hme-card hme-head">
        ${ms(o,a)}
        <div class="hme-head-t">
          <strong>${C(o)}</strong>
          <span>${Qt(o)} · ${r.area.toFixed(1)} m²${h===void 0?"":` \xB7 ${h} area`}</span>
          <span>${W(e.floor)}</span>
        </div>
      </section>

      ${this.roomTray?.(e,o)??g}

      ${Ce(x("furniture"),"Furniture",f===0?void 0:O(f,"thing"),this.furnitureList(e,o),"hme-inroom")}

      ${Ce(vi,"Name, area and tap",h,m`
        ${U("Name",Et({value:o.name??"",label:"Name",placeholder:"Room",set:w=>e.apply(P=>Tr(P,i,w))}))}
        ${U("Area",ve({label:"Area",value:o.areaId??"",options:[{value:"",label:"None"},...p?[]:[{value:o.areaId,label:`Not in Home Assistant (${o.areaId})`,disabled:!0}],...e.areas.map(w=>({value:w.id,label:w.name}))],set:w=>e.apply(P=>ko(P,i,w===""?void 0:w))}))}
        ${Q("The Home Assistant area. Its devices wait in Not on the map.")}
        ${U("Tap opens",ve({label:"Tap opens",value:o.pageId??"",options:[{value:"",label:"Nothing"},...c?[]:[{value:o.pageId,label:"A page not in your library",disabled:!0}],...e.pages.map(w=>({value:w.id,label:`Page: ${w.name}`}))],set:w=>e.apply(P=>Cr(P,i,w===""?void 0:w))}))}
        ${Q("What a tap on this room does on the map tiles and the watch.")}`)}

      ${Ce(x("size"),"Size and place",Qt(o),m`
        ${Se(N({tag:"Width",label:"Width",value:r.width,unit:"m",min:Lt,max:_t,...b((w,P)=>Ft(w,i,{width:P}))}),N({tag:"Depth",label:"Depth",value:r.depth,unit:"m",min:Lt,max:_t,...b((w,P)=>Ft(w,i,{depth:P}))}),N({tag:"Height",label:"Wall height",value:o.height,unit:"m",min:.5,max:20,...b((w,P)=>zt(w,i,P))}))}
        ${Se(N({tag:"From left",label:"Left",value:d.minX,unit:"m",...b((w,P)=>ft(w,i,P-d.minX,0))}),N({tag:"From top",label:"Top",value:d.minY,unit:"m",...b((w,P)=>ft(w,i,0,P-d.minY))}))}
        <div class="hme-turn">
          ${N({label:"Turn",value:l,unit:"\xB0",digits:1,min:-180,max:180,...b((w,P)=>qe(w,i,P-l))})}
          <button type="button" class="hme-tb" @click=${()=>e.apply(w=>qe(w,i,-90))}>−90°</button>
          <button type="button" class="hme-tb" @click=${()=>e.apply(w=>qe(w,i,90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it so its longest wall runs straight across or down" @click=${()=>e.apply(w=>Cn(w,i))}>Level</button>
        </div>
        <p class="hme-foot-hint">Along its own walls, about its middle; its doors, things and devices move with it. Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the room to move it, a square handle to resize it, the round one to turn it.</p>
        ${U("Floor",ve({label:"Floor",value:e.floor.id,options:[...e.doc.floors.map(w=>({value:w.id,label:W(w)})),{value:"new",label:"New floor\u2026"}],set:w=>{this.moveToFloor(e,o,w)}}))}`)}

      ${Ce(x("finish"),"Floor and walls",ci[o.finish??u],m`<div class="hme-pics">
        ${ie({label:`Auto: ${ci[u]}`,picture:ri(u),on:o.finish===void 0,title:"Picked from the room's name and furniture",click:()=>e.apply(w=>In(w,i,void 0))})}
        ${Gi.map(w=>ie({label:ci[w],picture:ri(w),on:o.finish===w,click:()=>e.apply(P=>In(P,i,w))}))}
      </div>
        ${this.roomColourRow(e,o,"floorColor")}
        ${this.roomColourRow(e,o,"wallColor")}
        <p class="hme-foot-hint">On the plan, the night, warm and clay looks and in 3D, here, on the iPhone and on the watch. The line looks keep their own colour.</p>`)}

      ${Ce(x("openings"),"Doors and windows",M,m`
        ${this.roomDoors?.(e,o)??g}
        ${this.roomWalls?.(e,o)??g}`,"hme-fold-cards")}

      ${Ce(x("scan"),"The scan",void 0,m`
        ${this.roomScan?.(e,o)??g}
        ${L("More",m`
        <div class="hme-row-end">
          ${Xo({label:"\uFF0B Add a plain box",cls:"hme-tb",options:Sr.map(w=>({value:w,label:to(w)})),pick:w=>{let P=X(o)??se(o);e.apply(_=>Ir(_,i,w,P))}})}
          <button type="button" class="hme-tb danger push" @click=${()=>{this.askDelete(e,o)}}>Delete room</button>
        </div>`)}`,"hme-fold-cards")}`}furnitureList(e,t){let o=e.floor,n=e.toggles.live?e.hass?.states:void 0,i=e.selection,r=t.id,a=[],d=[];t.objects.forEach((p,h)=>{let c={roomId:r,object:h},u=Me(p),b=p.hidden===!0,f=Mt(o,r,h),y=on(p)||f!==void 0&&f.entityId.startsWith("light."),v=Od(e,{sel:{kind:"object",...c},picked:Wa(i,r,h),hidden:b,icon:y?m`<span class="hme-ly-lamp ${f!==void 0&&gi(f.entityId,n)?"lit":""}" aria-hidden="true"></span>`:m`<span class="hme-thing-ic" aria-hidden="true"></span>`,name:u,end:b?"hidden":f!==void 0?`${J(f,e.hass)} \xB7 ${pe(f.entityId,n)}`:y?"no light":`${p.size[0].toFixed(1)} \xD7 ${p.size[1].toFixed(1)}`,title:"Pick it to move, resize or turn it. Cmd or Ctrl and a click picks several.",pick:M=>e.select(M.metaKey||M.ctrlKey?nt(e.selection,c):{kind:"object",...c}),eye:()=>e.apply(M=>$o(M,r,h,!b))});(y?a:d).push(v)});let l=(p,h)=>h.length===0?g:m`<div class="hme-ly-grp">${p}</div>${h}`;return m`<div class="hme-ly-list">
        ${a.length+d.length===0?m`<p class="hme-empty-line">No furniture yet. A bed, a sofa or a table makes the map read.</p>`:g}
        ${l("Lamps",a)}
        ${l("Furniture",d)}
      </div>
      <button type="button" class="hme-tb hme-wide" title="Add furniture to this room" @click=${()=>e.openAdd("furniture")}>＋ Add furniture to ${C(t)}</button>`}edits(e){return t=>({set:o=>e.apply(n=>t(n,o)),preview:o=>e.preview(o===void 0?void 0:n=>t(n,o))})}thingInspector(e,t){let{room:o,index:n,object:i}=t,r=o.id,a=Me(i),[d,l,p]=i.size,h=Fd(i),c=this.edits(e),u={kind:"room",roomId:r},b={unit:"m",min:bt,max:Co};return m`
      <section class="hme-card hme-head">
        <div class="hme-head-t">
          <strong>${a}</strong>
          <span>In ${C(o)} · ${d.toFixed(2)} × ${l.toFixed(2)} × ${p.toFixed(2)} m${(i.lift??0)>0?` \xB7 ${(i.lift??0).toFixed(2)} m up`:""}${i.hidden===!0?" \xB7 Hidden":""}</span>
        </div>
      </section>

      ${this.modelCard(e,t)}

      ${this.coloursCard(e,t)}

      ${L("Size",m`
        ${Se(N({tag:"Width",label:"Width",value:d,...b,...c((f,y)=>jt(f,r,n,{width:y}))}),N({tag:"Depth",label:"Depth",value:l,...b,...c((f,y)=>jt(f,r,n,{depth:y}))}),N({tag:"Height",label:"Height",value:p,...b,min:.01,...c((f,y)=>Dn(f,r,n,{size:[d,l,y]}))}))}`)}

      ${L("Place",m`
        ${ii("Middle, and up off the floor",Se(N({tag:"Across",label:"Middle across",value:i.c[0],unit:"m",...c((f,y)=>gt(f,r,n,[y,i.c[1]]))}),N({tag:"Down",label:"Middle down",value:i.c[1],unit:"m",...c((f,y)=>gt(f,r,n,[i.c[0],y]))}),N({tag:"Up",label:"Up off the floor",value:i.lift??0,unit:"m",min:0,max:100,...c((f,y)=>Dn(f,r,n,{lift:y}))})))}
        ${ii("Turn",m`<div class="hme-turn">
          ${N({label:"Turn",value:h,unit:"\xB0",digits:1,min:-180,max:180,...c((f,y)=>Xe(f,r,n,y-h))})}
          <button type="button" class="hme-tb" title="Turn it a quarter one way" @click=${()=>e.apply(f=>Xe(f,r,n,-90))}>−90°</button>
          <button type="button" class="hme-tb" title="Turn it a quarter the other way" @click=${()=>e.apply(f=>Xe(f,r,n,90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it square with the room's walls" @click=${()=>e.apply(f=>zr(f,r,n))}>Line up</button>
        </div>`)}
        <p class="hme-foot-hint">Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the thing to move it, a square handle to resize it, the round one to turn it.</p>`)}

      ${L("Show",m`
        <div class="hme-r tight"><span class="hme-grow">On the map, the tiles and the watch</span>
          ${no({on:i.hidden!==!0,onText:"Shown",offText:"Hidden",label:`${a} shown`,click:()=>e.apply(f=>$o(f,r,n,i.hidden!==!0))})}</div>
        <p class="hme-foot-hint">Scan Again on the iPhone puts the room's things back where the scan finds them. A hidden thing stays hidden.</p>
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${()=>e.select(u)}>‹ ${C(o)}</button>
          <button type="button" class="hme-tb danger push" @click=${()=>e.apply(f=>xo(f,r,n),{select:u})}>Remove</button>
        </div>`)}`}manyInspector(e,t){let o=it(t),n=[...new Set(t.map(a=>C(a.room)))],i=ge(t.map(a=>a.object.hidden===!0)),r=_d.filter(a=>t.some(d=>fi(d.object).includes(a)));return m`
      <section class="hme-card hme-head">
        <div class="hme-head-t">
          <strong>${O(t.length,"thing")}</strong>
          <span>${ws(t)} · in ${n.join(", ")}</span>
        </div>
      </section>

      ${L("Picked",m`${t.map(a=>m`<div class="hme-list-row hme-pick-row">
          <button type="button" class="hme-grow hme-link ${a.object.hidden===!0?"dim":""}" title="Pick this one alone"
            @click=${()=>this.pickThing(e,a.room,a.index)}>${Me(a.object)}</button>
          <span class="hme-val">${C(a.room)}</span>
          <button type="button" class="hme-x" aria-label=${`Leave ${Me(a.object)} out of the pick`} title="Leave it out of the pick"
            @click=${()=>e.select(nt(e.selection,{roomId:a.room.id,object:a.index}))}>×</button></div>`)}
        <p class="hme-foot-hint">Cmd or Ctrl and a click on the plan or in 3D adds a thing or takes one away. The arrow keys move them all.</p>`,String(t.length))}

      ${r.length===0?g:L("Colours",m`
        ${r.map(a=>this.manyColourRow(e,t,a))}
        <p class="hme-foot-hint">Set on every picked thing whose piece has that part. In the 3D view and on the iPhone.</p>`)}

      ${L("Show",m`
        <div class="hme-r tight"><span class="hme-grow">On the map, the tiles and the watch</span>
          ${i.mixed?m`<button type="button" class="hme-chip off" aria-pressed="mixed" aria-label="Shown" title="Some are hidden: show them all"
                @click=${()=>e.apply(a=>Ho(a,o,!1))}>Mixed</button>`:no({on:!i.value,onText:"Shown",offText:"Hidden",label:"Shown",click:()=>e.apply(a=>Ho(a,o,!i.value))})}</div>
        <div class="hme-row-end">
          <button type="button" class="hme-tb danger push" @click=${()=>{this.askDeleteThings(e,t)}}>Delete ${O(t.length,"thing")}</button>
        </div>`)}`}manyColourRow(e,t,o){let n=t.filter(a=>fi(a.object).includes(o)),i=it(n),r=ge(n.map(a=>a.object[o]?.toUpperCase()));return ui({word:o==="fabric"?"Fabric":"Wood",presets:o==="fabric"?Gn:Vn,now:r.mixed?void 0:r.value,mixed:r.mixed,defaultTitle:"Each model's own colour",customTitle:`Any ${o} colour`,customLabel:`Pick a ${o} colour for every picked thing`,set:a=>e.apply(d=>On(d,i,o,a)),preview:a=>e.preview(a===void 0?void 0:d=>On(d,i,o,a)??d)})}modelCard(e,t){let{room:o,index:n,object:i}=t,r=Gt(i),a=Ut(i.model),d=a!==void 0?`${a.group}, picked from the catalog`:i.model!==void 0?r===void 0?"A piece this panel does not know yet":`A piece this panel does not know yet, drawn as the ${r.name.toLowerCase()} meanwhile`:r!==void 0?`Picked by its kind: ${to(i.kind)}`:"A plain box, as the scan found it";return L("Model",m`<div class="hme-model">
        ${this.piecePic(e,r,"hme-model-pic")}
        <div class="hme-model-t"><strong>${r?.name??"Plain box"}</strong><span>${d}</span></div>
        <button type="button" class="hme-tb push" title="Pick another piece from the furniture catalog; it keeps its place, size and turn"
          @click=${()=>this.openPicker(e,o,n)}>Change…</button>
      </div>
      <p class="hme-foot-hint">What it looks like in the 3D view and on the iPhone. The flat plan and the tiles draw it as before.</p>`)}coloursCard(e,t){let o=fi(t.object);return o.length===0?g:L("Colours",m`
      ${o.map(n=>this.colourRow(e,t,n))}
      <p class="hme-foot-hint">In the 3D view and on the iPhone. The flat plan, the tiles and the furniture picker keep the model's own colours.</p>`)}colourRow(e,t,o){let{room:n,index:i,object:r}=t,a=n.id;return ui({word:o==="fabric"?"Fabric":"Wood",presets:o==="fabric"?Gn:Vn,now:r[o],defaultTitle:"The model's own colour",customTitle:`Any ${o} colour`,customLabel:`Pick a ${o} colour`,set:l=>e.apply(p=>An(p,a,i,o,l)),preview:l=>e.preview(l===void 0?void 0:p=>An(p,a,i,o,l)??p)})}roomColourRow(e,t,o){let n=t.id,i=o==="floorColor";return ui({word:i?"Floor":"Walls",presets:i?Sd[wo(t)]:Id,now:t[o],defaultTitle:i?"The finish's own colour":"The look's own wall colour",customTitle:i?"Any floor colour":"Any wall colour",customLabel:i?"Pick a floor colour":"Pick a wall colour",set:r=>e.apply(a=>Rn(a,n,o,r)),preview:r=>e.preview(r===void 0?void 0:a=>Rn(a,n,o,r)??a)})}floorCard(e,t){return L("Floor",this.floorBody(e,t))}floorBody(e,t){let o=uo(t,e.toggles.live?e.hass?.states:void 0),n=t.rooms.reduce((i,r)=>i+r.objects.length,0);return m`
      ${U("Name",Et({value:t.name,label:"Floor name",placeholder:W(t),set:i=>e.apply(r=>Mo(r,t.id,i))}))}
      ${U("On it",m`<span class="hme-val">${O(t.rooms.length,"room")} · ${O(n,"thing")} · ${O(t.pins.length,"device")} · ${fo(o)}</span>`)}`}};var zd=.4,jd=.15;function Nd(s,e,t){let o=t[0]-e[0],n=t[1]-e[1],i=o*o+n*n,r=i===0?0:Math.max(0,Math.min(1,((s[0]-e[0])*o+(s[1]-e[1])*n)/i));return Math.hypot(s[0]-(e[0]+r*o),s[1]-(e[1]+r*n))}function Kd(s,e){let t=1/0;for(let o=0,n=e.length-1;o<e.length;n=o,o+=1)t=Math.min(t,Nd(s,e[n],e[o]));return t}function*ks(s,e,t){yield s;for(let o=1;o*e<=t;o+=1){let n=o*e,i=Math.min(64,Math.max(8,Math.ceil(2*Math.PI*n/e)));for(let r=0;r<i;r+=1){let a=r/i*2*Math.PI;yield[s[0]+n*Math.cos(a),s[1]+n*Math.sin(a)]}}}function $s(s,e){return s.reduce((t,o)=>Math.max(t,Math.hypot(o[0]-e[0],o[1]-e[1])),0)}function xs(s,e,t,o=zd){let n=X(s);if(n===void 0)return;let i=s.outline,r=(d,l)=>ee(i,d)&&(i.length<3||Kd(d,i)>=l)&&e.every(p=>Math.hypot(p.at[0]-d[0],p.at[1]-d[1])>=o)&&(t===void 0||Math.abs(d[0]-t.at[0])>t.halfW||Math.abs(d[1]-t.at[1])>t.halfH),a=$s(i,n);for(let d of[jd,0])for(let l of ks(n,.1,a))if(r(l,d))return[Ms(l[0]),Ms(l[1])];return n}var Ms=s=>Math.round(s*1e3)/1e3;function Wd(s,e,t){if(t.length===0)return!1;let o=[[s[0]-e[0],s[1]-e[1]],[s[0]+e[0],s[1]-e[1]],[s[0]+e[0],s[1]+e[1]],[s[0]-e[0],s[1]+e[1]]],n=[[1,0],[0,1]];for(let i=0,r=t.length-1;i<t.length;r=i,i+=1){let a=t[i][0]-t[r][0],d=t[i][1]-t[r][1];(a!==0||d!==0)&&n.push([-d,a])}for(let[i,r]of n){let a=c=>{let u=1/0,b=-1/0;for(let f of c){let y=f[0]*i+f[1]*r;u=Math.min(u,y),b=Math.max(b,y)}return[u,b]},[d,l]=a(o),[p,h]=a(t);if(l<=p||h<=d)return!1}return!0}function Bd(s,e,t){let o=Math.max(Math.abs(t.c[0]-s[0])-e[0],0),n=Math.max(Math.abs(t.c[1]-s[1])-e[1],0);return o*o+n*n<t.r*t.r}function wi(s,e,t,o=4){let n=a=>t.room.length<3||[[a[0]-e[0],a[1]-e[1]],[a[0]+e[0],a[1]-e[1]],[a[0]+e[0],a[1]+e[1]],[a[0]-e[0],a[1]+e[1]]].every(d=>ee(t.room,d)),i=a=>n(a)&&t.boxes.every(d=>!Wd(a,e,d))&&t.circles.every(d=>!Bd(a,e,d))&&t.taken.every(d=>Math.abs(d.c[0]-a[0])>=d.half[0]+e[0]||Math.abs(d.c[1]-a[1])>=d.half[1]+e[1]),r=$s(t.room,s);for(let a of ks(s,o,Math.min(r,600)))if(i(a))return a}var yi=["light","cover","fan","climate","media_player","lock","vacuum","humidifier","water_heater","alarm_control_panel","valve"],Es=["switch","input_boolean","camera","siren","remote"];function Ts(s){let e=s.indexOf(".");return e<0?s:s.slice(0,e)}function nn(s){if(s.category!==void 0&&s.category!==null&&s.category!==""||s.hidden===!0)return;let e=Ts(s.entityId);if(yi.includes(e))return"main";if(Es.includes(e))return"switch"}function Cs(s){return new Set((s?.floors??[]).flatMap(e=>e.pins.map(t=>t.entityId)))}function Hs(s){let e=Ts(s),t=yi.indexOf(e);return t>=0?t:yi.length+Es.indexOf(e)}function Ps(s,e){let t=Hs(s.entityId)-Hs(e.entityId);if(t!==0)return t;let o=s.name.toLowerCase(),n=e.name.toLowerCase();return o!==n?o<n?-1:1:s.entityId<e.entityId?-1:s.entityId>e.entityId?1:0}function Tt(s,e,t,o=Cs(t)){let n=[],i=[],r=s.areaId;if(r===void 0||r==="")return{main:n,more:i};for(let a of e){if(a.areaId!==r||o.has(a.entityId))continue;let d=nn(a);d==="main"?n.push(a):d==="switch"&&i.push(a)}return n.sort(Ps),i.sort(Ps),{main:n,more:i}}function Mi(s,e){let t=Cs(s),o=s?.floors??[],n=new Set(o.flatMap(r=>r.rooms.map(a=>a.areaId)).filter(r=>r!==void 0&&r!=="")),i=new Set;for(let r of e)r.areaId!==void 0&&n.has(r.areaId)&&!t.has(r.entityId)&&nn(r)==="main"&&i.add(r.entityId);return{rooms:o.reduce((r,a)=>r+a.rooms.length,0),placed:t.size,waiting:i.size}}var ki="Finish your map";function $i(s){return`${s.filter(e=>e.done).length} of ${s.length} done`}var io=(s,e,t)=>`${s} ${s===1?e:t}`;function Ud(s,e){return s===0?e>0?`${io(e,"device waits","devices wait")} in your rooms.`:"Put your lights and devices on the map.":e>0?`${s} on the map. ${io(e,"more waits","more wait")}.`:`${s} on the map.`}function Ss(s,e){return[{id:1,title:"Rooms",words:`${io(s.rooms,"room","rooms")}.`,done:s.rooms>0},{id:2,title:"Devices",words:Ud(s.placed,s.waiting),done:s.placed>0},{id:3,title:"On a page",words:e?"On a page.":"Put the map on a page to use it each day.",done:e}]}function rn(s){return s.find(e=>!e.done)}function Is(s,e){return e>0?`${s} \xB7 ${ro(e)}`:s}function ro(s){return io(s,"waits","wait")}function Rs(s){return s.onMap>0&&s.wait>0?`${s.onMap} on the map \xB7 ${ro(s.wait)}`:s.onMap>0?`${s.onMap} on the map`:s.wait>0?ro(s.wait):s.hasArea?s.more>0?xi(s.more):"No devices in its area":"No area"}function xi(s){return`${io(s,"switch","switches")} and more`}var an=Math.PI/4,Hi=8,We="#ffbf55",T=s=>s.toFixed(1);function Gd(s,e){return`${Nn(s.domain)} \xB7 ${pe(s.entityId,e)}`}function Vd(s,e){let t=Nn(s.domain);return`${t.charAt(0).toUpperCase()}${t.slice(1)} \xB7 ${pe(s.entityId,e)}`}function qd(s,e){let t=xe(s,e);if(t===void 0)return"Not in a room";let o=V(s,e.at);return o!==void 0&&k(o.id,t.id)?`${C(t)} (found by place)`:C(t)}function Xd(s,e,t){return s.icon!==void 0?Ko[s.icon]:`Auto (${Ko[be(s.entityId,e,t)].toLowerCase()})`}var Ds={ceiling:"Ceiling",floor:"Floor",table:"Table",wall:"Wall",bulb:"Just a bulb"},_s="wa-home-map-lamp-choice";function Fs(){try{return globalThis.localStorage??void 0}catch{return}}function zs(){try{let s=Fs()?.getItem(_s);return ct.includes(s)?s:void 0}catch{return}}function Pi(s){try{Fs()?.setItem(_s,s)}catch{}}function Ei(){return zs()??"ceiling"}var js={ceiling:"Ceiling lamp",floor:"Floor lamp",table:"Table lamp",wall:"Wall lamp",bulb:"Just a bulb"},me=s=>s.startsWith("light."),Yd=16,sn=class{constructor(e){this.picture=e;this.side=!0;this.names=!1;this.moving=!1;this.iconsOpen=!1;this.pickPage=!1;this.chooserFocus=!1;this.moreOpen=new Set;this.blinking=new Set}states(e){return e.toggles.live?e.hass?.states:void 0}picked(e){let t=e.selection;return t?.kind==="pin"?e.floor.pins.find(o=>k(o.id,t.pinId)):void 0}picks(e){return et(e.selection).flatMap(t=>e.floor.pins.filter(o=>k(o.id,t)))}deviceClass(e,t){let o=e.hass?.states?.[t]?.attributes?.device_class;return typeof o=="string"?o:void 0}friendly(e,t){let o=e.hass?.states?.[t]?.attributes?.friendly_name;return typeof o=="string"&&o.trim()!==""?o.trim():void 0}place(e,t,o,n){let i=Je(e.doc,t);if(i!==void 0)return k(i.floorId,e.floor.id)||e.setFloor(i.floorId),e.select({kind:"pin",pinId:i.pinId}),!1;let r=Bt(e.floor,n),a=o??(r===void 0?Ne(e.view,[e.stage.width/2,e.stage.height/2]):this.freeSpot(e,r)),d=e.newId().toUpperCase(),l=e.floor.id,p=this.friendly(e,t),h=e.apply(c=>Zr(c,l,{id:d,entityId:t,at:[a[0],a[1]],...p===void 0?{}:{name:p}}),{select:{kind:"pin",pinId:d}});return h||e.note("warn","That device could not be put on the map: the map holds at most 400 devices."),h}deviceRow(e,t,o){let n=me(t.entityId),i=n?void 0:Je(e.doc,t.entityId),r=n?Lo(e.doc,t.entityId).length:0,a=be(t.entityId,t.deviceClass,t.name),d=()=>n?this.addLight(e,t.entityId,void 0,t.areaId):this.place(e,t.entityId,void 0,t.areaId),l=n?"Drag onto the plan or onto a lamp, or click to add it in its area's room. A light can be on the map many times.":i===void 0?"Drag onto the plan, or click to put it in its area's room":"On the map: click to pick it";return m`<div class="hme-dv ${this.dragging===t.entityId?"dragging":""} ${i===void 0?"":"placed"}" role="button" tabindex="0"
      draggable=${i===void 0?"true":"false"} title=${l}
      @dragstart=${p=>{p.dataTransfer?.setData(Wt,t.entityId),n&&p.dataTransfer?.setData(jo,t.entityId),p.dataTransfer?.setData("text/plain",t.entityId),p.dataTransfer&&(p.dataTransfer.effectAllowed="copy"),this.dragging=t.entityId,e.redraw()}}
      @dragend=${()=>{this.dragging=void 0,this.dropAt=void 0,this.lampOver=void 0,e.redraw()}}
      @click=${d}
      @keydown=${p=>{p.target===p.currentTarget&&(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),d())}}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${te(a,"currentColor",24,2)}</svg></span>
      <span class="hme-dv-nm">${t.name}<small>${i===void 0?Gd(t,o):"on the map"}</small></span>
      ${r===0?g:m`<button type="button" class="hme-dv-count" title="Pick the next one on the map"
        @click=${p=>{p.stopPropagation(),this.pickNext(e,t.entityId)}}
        @keydown=${p=>p.stopPropagation()}>${r} on map</button>`}
      <span class="hme-dv-grip" aria-hidden="true">${i===void 0?"\u22EE\u22EE":"\u203A"}</span>
    </div>`}pickNext(e,t){let o=e.doc.floors.flatMap(l=>l.pins.filter(p=>p.entityId===t).map(p=>({floor:l,pin:p})));if(o.length===0)return;let n=e.selection,i=n?.kind==="pin"?n.pinId:n?.kind==="object"?Mt(e.floor,n.roomId,n.object)?.id:void 0,r=i===void 0?-1:o.findIndex(l=>k(l.pin.id,i)),a=o[(r+1)%o.length];k(a.floor.id,e.floor.id)||e.setFloor(a.floor.id);let d=fe(a.floor,a.pin.id);e.select(d===void 0?{kind:"pin",pinId:a.pin.id}:{kind:"object",roomId:d.roomId,object:d.object})}homeDevices(e){return e.devices??Qe(e.hass)}waitingIn(e,t){return Tt(t,this.homeDevices(e),e.doc)}freeSpot(e,t){let o=X(t)??se(t),n=Math.max(e.px(1),1),i=C(t).length*7.4+22,r={at:o,halfW:Math.min((i/2+14)/n,1.2),halfH:Math.min(25/n,.5)};return xs(t,Ve(e.floor,t.id),r)??o}arm(e,t){this.armed=this.armed===t?void 0:t,e.redraw()}placeArmed(e,t){let o=this.armed;if(o===void 0)return;this.armed=void 0;let n=me(o),i=this.emptyThingAt(e,t,n),r=V(e.floor,t);(i!==void 0?this.putOn(e,i,o):n?this.placeLight(e,o,t):this.place(e,o,t))&&(this.trayRoom=i?.roomId??r?.id),e.redraw()}blink(e,t){let o=e.hass,n=o?.states?.[t]?.state;if(o===void 0||!me(t)||n===void 0||n==="unavailable"||this.blinking.has(t))return;let i=n==="on";this.blinking.add(t),e.redraw();let r=a=>e.note("warn",`Could not blink it: ${a instanceof Error?a.message:String(a?.message??a)}`);It(o,"light",i?"turn_off":"turn_on",{entity_id:t}).then(()=>new Promise(a=>setTimeout(a,1e3)).then(()=>It(o,"light",i?"turn_on":"turn_off",{entity_id:t}))).catch(r).finally(()=>{this.blinking.delete(t),e.redraw()})}trayRow(e,t){let o=me(t.entityId),n=this.armed===t.entityId,i=be(t.entityId,t.deviceClass,t.name),r=e.hass?.states?.[t.entityId]?.state,a=o&&r!==void 0&&r!=="unavailable";return m`<div class="hme-dv hme-tray-row ${n?"armed":""} ${this.dragging===t.entityId?"dragging":""}" role="button" tabindex="0"
      draggable="true" aria-pressed=${n?"true":"false"}
      title=${n?"Click its place on the plan. Click here again to stop.":"Drag it onto the plan, or click it, then click its place"}
      @dragstart=${d=>{d.dataTransfer?.setData(Wt,t.entityId),o&&d.dataTransfer?.setData(jo,t.entityId),d.dataTransfer?.setData("text/plain",t.entityId),d.dataTransfer&&(d.dataTransfer.effectAllowed="copy"),this.dragging=t.entityId,this.armed=void 0,e.redraw()}}
      @dragend=${()=>{this.dragging=void 0,this.dropAt=void 0,this.lampOver=void 0,e.redraw()}}
      @click=${()=>this.arm(e,t.entityId)}
      @keydown=${d=>{d.target===d.currentTarget&&(d.key==="Enter"||d.key===" ")&&(d.preventDefault(),this.arm(e,t.entityId))}}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${te(i,"currentColor",24,2)}</svg></span>
      <span class="hme-dv-nm">${t.name}<small>${Vd(t,e.hass?.states)}</small></span>
      ${a?m`<button type="button" class="hme-tb hme-blink" ?disabled=${this.blinking.has(t.entityId)} title="Turn it the other way for a second, to see which light it is"
        @click=${d=>{d.stopPropagation(),this.blink(e,t.entityId)}}
        @keydown=${d=>d.stopPropagation()}>Blink</button>`:g}
      <span class="hme-dv-grip" aria-hidden="true">⋮⋮</span>
    </div>`}trayCard(e,t,o="Not on the map"){let n=this.waitingIn(e,t),i=this.moreOpen.has(t.id.toUpperCase()),r=n.more.length===0?g:m`<button type="button" class="hme-tray-more" aria-expanded=${i?"true":"false"}
        @click=${()=>{let d=t.id.toUpperCase();i?this.moreOpen.delete(d):this.moreOpen.add(d),e.redraw()}}>
        ${xi(n.more.length)}<span aria-hidden="true">${i?"\u25BE":"\u203A"}</span></button>
      ${i?n.more.map(d=>this.trayRow(e,d)):g}`,a=g;if(t.areaId===void 0){let d=t.id;a=m`<p class="hme-empty-line">This room has no area. Pick one below to see its devices.</p>
        ${U("Area",ve({label:"Area",value:"",options:[{value:"",label:"None"},...e.areas.map(l=>({value:l.id,label:l.name}))],set:l=>{l!==""&&e.apply(p=>ko(p,d,l))}}))}`}else if(n.main.length===0&&n.more.length===0){let d=this.homeDevices(e).some(l=>l.areaId===t.areaId&&nn(l)!==void 0);a=m`<p class="hme-empty-line">${d?"Every device of this room is on the map.":"No devices in this room's area."}</p>`}return L(o,m`
      ${n.main.length===0&&n.more.length===0?g:m`<p class="hme-foot-hint hme-tray-how">Drag one onto the plan. Or click it, then click its place.</p>`}
      ${a}
      <div class="hme-tray">${n.main.map(d=>this.trayRow(e,d))}${r}</div>`,n.main.length===0?void 0:ro(n.main.length),"hme-tray-card")}onMapCard(e,t){let o=Ve(e.floor,t.id),n=this.states(e),i=et(e.selection);return L("On the map",m`<div class="hme-ly-list">
      ${o.length===0?m`<p class="hme-empty-line">No devices yet.</p>`:o.map(r=>{let a={kind:"pin",pinId:r.id},d=e.hover?.kind==="pin"&&k(e.hover.pinId,r.id),l=i.some(p=>k(p,r.id));return m`<div class="hme-ly ${l?"on":""} ${d?"hov":""}"
          @pointerenter=${()=>e.setHover(a)} @pointerleave=${()=>e.setHover(void 0)}>
          <button type="button" class="hme-ly-main" aria-pressed=${l?"true":"false"} title="Pick it. Shift, Cmd or Ctrl and a click picks several."
            @click=${p=>e.select(p.shiftKey||p.metaKey||p.ctrlKey?kt(e.selection,r.id):a)}>
            <span class="hme-dot dev ${gi(r.entityId,n)||!me(r.entityId)?"":"off"}" aria-hidden="true"></span><span class="hme-ly-nm">${J(r,e.hass)}</span><span class="hme-ly-end">${pe(r.entityId,n)}</span></button>
        </div>`})}</div>`,String(o.length),"hme-onmap")}addLight(e,t,o,n){let i=o===void 0?Bt(e.floor,n??ya(e.hass,t)):void 0,r=o??(i===void 0?Ne(e.view,[e.stage.width/2,e.stage.height/2]):X(i)??se(i)),a=V(e.floor,r)??i,d=zs();this.chooser={entityId:t,at:[r[0],r[1]],roomId:a?.id,choice:a===void 0?"bulb":d??"ceiling"},this.chooserFocus=!0,e.redraw()}get choosing(){return this.chooser!==void 0}cancelChooser(e){this.chooser=void 0,e.redraw()}canChoose(e){return e==="bulb"||this.chooser?.roomId!==void 0}takeChoice(e,t){let o=this.chooser;if(o===void 0)return;let n=t??o.choice;this.canChoose(n)&&(this.chooser=void 0,Pi(n),this.lightIn(e,o.entityId,n,o.at,o.roomId))}lightIn(e,t,o,n,i){let r=e.newId().toUpperCase(),a=e.floor.id,d=i===void 0?void 0:e.doc.floors.find(c=>k(c.id,a))?.rooms.find(c=>k(c.id,i)),l=this.friendly(e,t),p=o!=="bulb"&&d!==void 0?{kind:"object",roomId:d.id,object:d.objects.length}:{kind:"pin",pinId:r},h=e.apply(c=>oa(c,a,i,t,o,n,r,l)?.doc,{select:p});return h||e.note("warn","That light could not be put on the map: the map holds at most 400 devices, and a room at most 256 things."),h}placeLight(e,t,o){let n=V(e.floor,o);return this.lightIn(e,t,n===void 0?"bulb":Ei(),[o[0],o[1]],n?.id)}chooserKey(e,t){let o=this.chooser;if(o===void 0)return!1;switch(t.key){case"Enter":return this.takeChoice(e),!0;case"Escape":return this.cancelChooser(e),!0;case"ArrowLeft":case"ArrowUp":case"ArrowRight":case"ArrowDown":{let n=ct.filter(r=>this.canChoose(r)),i=t.key==="ArrowLeft"||t.key==="ArrowUp"?-1:1;return o.choice=n[(n.indexOf(o.choice)+i+n.length)%n.length]??o.choice,this.chooserFocus=!0,e.redraw(),!0}case"Delete":case"Backspace":return!0;default:return!1}}lampChooser(e){let t=this.chooser;if(t===void 0)return g;let o=e.toScreen(t.at),n=e.toScreen(e.toPlan(0,0)),i=o[0]-n[0],r=o[1]-n[1],a=344,d=globalThis.innerWidth??1/0,l=i+22+a>d?Math.max(8,i-22-a):i+22,p=t.roomId===void 0?void 0:e.floor.rooms.find(u=>k(u.id,t.roomId)),h=this.chooserFocus;this.chooserFocus=!1;let c=this.friendly(e,t.entityId)??t.entityId;return m`<div class="hme-scrim hme-lamp-scrim" @pointerdown=${u=>{u.target===u.currentTarget&&this.cancelChooser(e)}}>
      <div class="hme-lampc" role="dialog" aria-label="Which lamp is it in?" style=${`left:${Math.round(l)}px;top:${Math.round(Math.max(8,r-64))}px;width:${a}px`}
        @keydown=${u=>{this.chooserKey(e,u)&&(u.preventDefault(),u.stopPropagation())}}>
        <div class="hme-lampc-t"><strong>${c}</strong>
          <span>${p===void 0?"In no room, so just a bulb.":`In ${C(p)}. Which lamp is it in?`}</span></div>
        <div class="hme-lampc-row" role="group" aria-label="Lamp">
          ${ct.map(u=>{let b=u===t.choice,f=this.canChoose(u),y=gr[u];return m`<button type="button" class="hme-lampc-b ${b?"on":""}" aria-pressed=${b?"true":"false"} ?disabled=${!f}
              title=${f?Ds[u]:"A lamp goes in a room"}
              ${ot(v=>{h&&b&&v!==void 0&&setTimeout(()=>v.focus?.(),0)})}
              @click=${()=>this.takeChoice(e,u)}>
              ${y===void 0||this.picture===void 0?m`<span class="hme-lampc-pic bulb"><svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">${te("bulb","currentColor",24,1.8)}</svg></span>`:this.picture(e,y,"hme-lampc-pic")}
              <span>${Ds[u]}</span></button>`})}
        </div>
        <p class="hme-lampc-hint">Enter takes the ringed one · Esc cancels</p>
      </div>
    </div>`}emptyThingAt(e,t,o,n=e.floor){let i=e.toScreen(t),r;for(let a of n.rooms)a.objects.forEach((d,l)=>{if(d.hidden===!0||(o?Tn(d.model)===void 0:d.kind==="rug")||Mt(n,a.id,l)!==void 0)return;let p=e.toScreen(d.c),h=Math.hypot(p[0]-i[0],p[1]-i[1]);h>Yd&&!ee(le(de(d)),t)||(r===void 0||h<r.d)&&(r={ref:{roomId:a.id,object:l},d:h})});return r?.ref}heldThingAt(e,t){let o=this.pinAt(e,e.toScreen(t));return o===void 0?void 0:fe(e.floor,o.id)}lampMark(e,t){let o=e.floor.rooms.find(l=>k(l.id,t.roomId))?.objects[t.object];if(o===void 0)return g;let n=le(de(o)).map(l=>e.toScreen(l).map(T).join(",")).join(" "),[i,r]=e.toScreen(o.c),a=on(o)?"Put it in this lamp":`Put it on this ${Me(o)}`,d=a.length*6.4+20;return H`<g class="hme-lamp-over" pointer-events="none">
      <circle cx=${T(i)} cy=${T(r)} r="22" fill="rgba(255,191,85,0.22)" stroke=${We} stroke-width="2" stroke-dasharray="4 3" />
      <polygon points=${n} fill="rgba(255,191,85,0.3)" stroke=${We} stroke-width="2" />
      <g class="hme-tag"><rect x=${T(i-d/2)} y=${T(r+28)} width=${T(d)} height="18" rx="9" fill=${We} />
        <text x=${T(i)} y=${T(r+41)} fill="#3a2600" text-anchor="middle">${a}</text></g>
    </g>`}dragOver(e,t,o){let n=[...o.dataTransfer?.types??[]],i=this.dragging!==void 0||n.includes(Wt),r=this.dragging!==void 0?me(this.dragging):n.includes(jo),a=this.dropAt,d=this.lampOver;return this.dropAt=i?t:void 0,this.lampOver=i&&t!==void 0?this.emptyThingAt(e,t,r):void 0,(a!==this.dropAt||JSON.stringify(d)!==JSON.stringify(this.lampOver))&&e.redraw(),i&&t!==void 0}drop(e,t,o){let n=this.dragging??o.dataTransfer?.getData(Wt)??"";if(this.dragging=void 0,this.dropAt=void 0,this.lampOver=void 0,n===""){e.redraw();return}let i=me(n),r=this.emptyThingAt(e,t,i),a=V(e.floor,t);(r!==void 0?this.putOn(e,r,n):i?this.placeLight(e,n,t):this.place(e,n,t))&&(this.trayRoom=r?.roomId??a?.id)}putOn(e,t,o){let n=e.floor.id,i=me(o)?void 0:Je(e.doc,o),r={select:{kind:"object",...t}};if(i!==void 0)return k(i.floorId,n)?e.apply(l=>_o(l,n,t.roomId,t.object,i.pinId),r):(e.note("warn","That device is on another floor's map. Remove it there first to put it here."),!1);let a=e.newId().toUpperCase(),d=e.apply(l=>ia(l,n,t.roomId,t.object,o,a),r);return d||e.note("warn","That device could not be put on it: the map holds at most 400 devices."),d}overlay(e){let t=this.states(e),o=this.picked(e),n=et(e.selection),i=[],r=this.lampOver===void 0?g:this.lampMark(e,this.lampOver);r!==g?i.push(r):this.dropAt!==void 0&&i.push(this.dropMark(e,this.dropAt));let a=o===void 0?void 0:ue(o.entityId,t);o!==void 0&&a?.kind==="light"&&i.push(this.glowRing(e,o,a.on?a.brightness:void 0));for(let d of e.floor.pins){let l=n.some(p=>k(d.id,p));i.push(this.pinMark(e,d,l,!1,t))}return this.box!==void 0&&i.push(this.boxMark(e,this.box)),H`${i}`}boxMark(e,t){let[o,n]=e.toScreen(t.a),[i,r]=e.toScreen(t.b);return H`<rect class="hme-box" x=${T(Math.min(o,i))} y=${T(Math.min(n,r))} width=${T(Math.abs(i-o))} height=${T(Math.abs(r-n))}
      fill="rgba(91,141,239,0.12)" stroke="#5b8def" stroke-width="1.2" stroke-dasharray="4 3" pointer-events="none" />`}pinMark(e,t,o,n,i){let[r,a]=e.toScreen(t.at),d=ue(t.entityId,i),l=d.kind==="light"&&d.on,p=l?$t(t)??We:"rgba(36,36,40,0.92)",h=l?"#fff3d6":d.kind==="gone"?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.4)",c=l?"#3a2600":d.kind==="lock"?d.locked?"#30d158":"#ff9f0a":d.kind==="other"&&d.on?"#ffffff":d.kind==="gone"?"#8e8e93":"#d1d1d6",u=t.icon??be(t.entityId,this.deviceClass(e,t.entityId),this.friendly(e,t.entityId)),b=o?13:12,f=o||this.names?J(t,e.hass):Da(t,i),y=f===void 0?0:f.length*5.9+14;return H`<g class="hme-pin" data-hme="pin" data-pin=${t.id} transform=${`translate(${T(r)} ${T(a)})`} opacity=${n?.25:1} style="cursor:grab">
      ${o?H`<circle r="20" fill="none" stroke="#5b8def" stroke-width="2.5" />`:g}
      ${l?H`<circle r=${b+7} fill=${p} opacity="0.22" />`:g}
      <circle r=${b} fill=${p} stroke=${h} stroke-width="1.2" />
      <g transform="translate(-7 -7)">${te(u,c,14,1.5)}</g>
      ${f===void 0||f===""?g:H`<g pointer-events="none"><rect x=${T(-y/2)} y=${b+4} width=${T(y)} height="16" rx="8" fill=${o?"#5b8def":"rgba(0,0,0,0.7)"} />
        <text y=${b+15.5} fill="#fff" font-size="10" font-weight="600" text-anchor="middle">${f}</text></g>`}
    </g>`}glowRing(e,t,o){let[n,i]=e.toScreen(t.at),r=Vt(t,o),a=e.px(r),d=[n+a*Math.cos(an),i+a*Math.sin(an)],l=`Glow ${r.toFixed(1)} m`,p=l.length*6.2+18,h=t.glowSpill===!0?void 0:xe(e.floor,t),c=h!==void 0&&h.outline.length>=3?h.outline.map(b=>e.toScreen(b).map(T).join(",")).join(" "):void 0,u=b=>H`<circle cx=${T(n)} cy=${T(i)} r=${T(a)} fill="none" stroke=${$t(t)??"#5b8def"} stroke-width="1.4"
      stroke-dasharray="5 5" opacity=${b} pointer-events="none" />`;return H`<g class="hme-glow-ring">
      ${c===void 0?u(1):H`<clipPath id="hme-glow-walls"><polygon points=${c} /></clipPath>
        ${u(.28)}<g clip-path="url(#hme-glow-walls)">${u(1)}</g>`}
      <circle data-hme="glow" cx=${T(d[0])} cy=${T(d[1])} r="7" fill="#fff" stroke="#5b8def" stroke-width="2" style="cursor:nwse-resize">
        <title>Drag to set how far this light's glow reaches</title></circle>
      <g class="hme-tag" pointer-events="none"><rect x=${T(d[0]-p/2)} y=${T(d[1]+12)} width=${T(p)} height="18" rx="9" fill="#5b8def" />
        <text x=${T(d[0])} y=${T(d[1]+25)} fill="#fff" text-anchor="middle">${l}</text></g>
    </g>`}dropMark(e,t){let o=V(e.floor,t),[n,i]=e.toScreen(t),r=o===void 0?"Drop here, in no room":`Drop in ${C(o)}`,a=r.length*6.4+20;return H`<g class="hme-drop" pointer-events="none">
      ${o===void 0?g:H`<polygon points=${o.outline.map(d=>e.toScreen(d).map(T).join(",")).join(" ")}
        fill="rgba(91,141,239,0.18)" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />`}
      <circle cx=${T(n)} cy=${T(i)} r="13" fill="rgba(91,141,239,0.35)" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 2" />
      <g class="hme-tag"><rect x=${T(n-a/2)} y=${T(i+20)} width=${T(a)} height="18" rx="9" fill="#5b8def" />
        <text x=${T(n)} y=${T(i+33)} fill="#fff" text-anchor="middle">${r}</text></g>
    </g>`}pinAt(e,t){return di(e.floor,e.toScreen,t)}pointerDown(e,t,o){return t.button!==0?!1:this.pressHandle(e,t,o)||this.pressPin(e,t,o)||this.pressBox(e,t,o)}pressHandle(e,t,o){let n=this.picked(e);if(n===void 0||t.shiftKey||t.metaKey||t.ctrlKey)return!1;let i=ue(n.entityId,this.states(e));if(i.kind!=="light")return!1;let r=e.toScreen(o),[a,d]=e.toScreen(n.at),l=e.px(Vt(n,i.on?i.brightness:void 0));return Math.hypot(r[0]-(a+l*Math.cos(an)),r[1]-(d+l*Math.sin(an)))>10?!1:(this.glowDrag(e,t,n),!0)}onPin(e,t){return this.pinAt(e,e.toScreen(t))!==void 0}pressBox(e,t,o){return t.shiftKey?(this.boxDrag(e,t,o),!0):!1}pressPin(e,t,o){let n=t.shiftKey||t.metaKey||t.ctrlKey,i=this.pinAt(e,e.toScreen(o));if(i===void 0)return!1;if(this.pickPage=!1,this.iconsOpen=!1,n)return e.select(kt(e.selection,i.id)),!0;let r=et(e.selection);return r.length>1&&r.some(a=>k(a,i.id))?(this.groupDrag(e,t,r,i.id,o),!0):(e.select({kind:"pin",pinId:i.id}),this.moveDrag(e,t,i,o),!0)}groupDrag(e,t,o,n,i){let r=[0,0],a=No(o);e.drag(t,{move:d=>{this.moving=!0,r=[d[0]-i[0],d[1]-i[1]];let[l,p]=r;e.preview(h=>Ao(h,o,l,p))},end:(d,l,p)=>{this.moving=!1,e.preview(void 0);let[h,c]=r;p?Math.hypot(h,c)>=.005&&e.apply(u=>Ao(u,o,h,c),a===void 0?{}:{select:a}):e.select({kind:"pin",pinId:n})},cancel:()=>this.stopDrag(e)})}stopDrag(e){this.moving=!1,this.box=void 0,this.lampOver=void 0,e.preview(void 0)}boxDrag(e,t,o){let n=e.floor.pins,i=e.selection;e.drag(t,{move:r=>{this.box={a:o,b:r},e.redraw()},end:(r,a,d)=>{this.box=void 0,d?e.select($a(i,xa(n,o,r))):e.redraw()},cancel:()=>this.stopDrag(e)})}async removePicks(e,t){t.length!==0&&(t.length>1&&!await e.confirm({title:`Remove ${O(t.length,"device")} from the map?`,text:"They come off the map, and Add can put them back. Undo puts them back where they were.",ok:"Remove",danger:!0})||e.apply(o=>ea(o,t),{select:null}))}moveDrag(e,t,o,n){let i=o.id,r=e.floor,a=r.id,d=[o.at[0],o.at[1]],l=fe(r,i)===void 0,p=me(o.entityId),h=d;e.drag(t,{move:c=>{this.moving=!0,h=[d[0]+c[0]-n[0],d[1]+c[1]-n[1]];let u=l?this.emptyThingAt(e,h,p,r):void 0;this.lampOver=u,e.preview(u===void 0?b=>Fn(b,i,h):b=>_o(b,a,u.roomId,u.object,i))},end:(c,u,b)=>{let f=this.lampOver;this.moving=!1,this.lampOver=void 0,e.preview(void 0),b&&f!==void 0?e.apply(y=>_o(y,a,f.roomId,f.object,i),{select:{kind:"object",...f}}):b&&Math.hypot(h[0]-d[0],h[1]-d[1])>=.005&&e.apply(y=>Fn(y,i,h),{select:{kind:"pin",pinId:i}})},cancel:()=>this.stopDrag(e)})}glowDrag(e,t,o){let n=o.id,i;e.drag(t,{move:r=>{this.moving=!0;let a=Math.hypot(r[0]-o.at[0],r[1]-o.at[1]);i=Math.min(Math.max(Math.round(a/.05)*.05,Rt),qi);let d=i;e.preview(l=>Ye(l,n,{glow:d}))},end:()=>{this.moving=!1,e.preview(void 0);let r=i;r!==void 0&&e.apply(a=>Ye(a,n,{glow:r}))},cancel:()=>this.stopDrag(e)})}keyDown(e,t){let o=this.picks(e).map(i=>i.id);if(o.length===0)return!1;let n=Z(t,!1);if(n==="delete")return this.removePicks(e,o),!0;if(typeof n=="object"&&"nudge"in n){let[i,r]=n.nudge;return e.apply(a=>Ao(a,o,i,r)),!0}return!1}leave(){this.dragging=void 0,this.dropAt=void 0,this.box=void 0,this.moving=!1,this.iconsOpen=!1,this.pickPage=!1,this.chooser=void 0,this.lampOver=void 0,this.armed=void 0,this.trayRoom=void 0}viewItems(e){return[{label:"Side view",on:this.side,title:"The picked device's room from the side, to set its height",flip:()=>{this.side=!this.side,e.redraw()}},{label:"Names",on:this.names,title:"Every device's name under its pin",flip:()=>{this.names=!this.names,e.redraw()}}]}stageExtra(e){let t=this.picked(e);if(!this.side||t===void 0)return g;let o=xe(e.floor,t),n=o?.height??2.5,i=_e(o?.outline??e.floor.rooms.flatMap(w=>w.outline))??{minX:t.at[0]-1,maxX:t.at[0]+1,minY:0,maxY:0},r=18,a=118,d=(a-r)/Math.max(n,.5),l=30,p=262,h=(p-l)/Math.max(i.maxX-i.minX,.5),c=w=>l+(Math.min(Math.max(w,i.minX),i.maxX)-i.minX)*h,u=t.at[2],b=a-Math.min(Math.max(u,0),n)*d,f=c(t.at[0]),y=(()=>{let w=ue(t.entityId,this.states(e));return w.kind==="light"&&w.on})(),v=[];for(let w=0;w<=n+1e-9;w+=1)v.push(w);let M=o===void 0?[]:er(o),x=o===void 0?"No room":C(o);return m`<div class="hme-side">
      <div class="hme-h">${x} from the side</div>
      <svg viewBox="0 0 270 130" role="img" aria-label=${`Side view: ${J(t,e.hass)} at ${u.toFixed(2)} m, the wall ${n.toFixed(1)} m tall`}
        @pointerdown=${w=>this.heightDrag(e,w,t,n,a,d)}>
        <path d=${`M${l} ${T(r)}H${p}M${l} ${a}H${p}`} stroke="#ece6da" stroke-width="3" />
        <path d=${`M${l} ${T(r)}V${a}M${p} ${T(r)}V${a}`} stroke="#ece6da" stroke-width="1.5" opacity="0.4" />
        <g font-size="9" fill="#8e8e93" text-anchor="end" class="mono">
          ${v.map(w=>H`<text x=${l-6} y=${T(a-w*d+3)}>${w===0?"0":`${w} m`}</text>
            <path d=${`M${l-4} ${T(a-w*d)}H${l}`} stroke="#8e8e93" />`)}
        </g>
        ${M.map(w=>{let P=c(w.c[0]-w.size[0]/2),_=c(w.c[0]+w.size[0]/2),I=Math.min(w.size[2],n)*d;return H`<rect x=${T(P)} y=${T(a-I)} width=${T(Math.max(_-P,2))} height=${T(I)} rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" />`})}
        <path d=${`M${T(f)} ${a}V${T(b)}`} stroke="#5b8def" stroke-width="1.2" stroke-dasharray="3 3" />
        ${y?H`<circle cx=${T(f)} cy=${T(b)} r="20" fill="#ffb648" opacity="0.22" />`:g}
        <circle cx=${T(f)} cy=${T(b)} r="9" fill=${y?We:"#3a3a3c"} stroke="#5b8def" stroke-width="2.5" style="cursor:ns-resize" />
        <g class="hme-tag"><rect x=${T(Math.min(f+14,222))} y=${T(b-8)} width="44" height="16" rx="8" fill="#5b8def" />
          <text x=${T(Math.min(f+14,222)+22)} y=${T(b+3.5)} fill="#fff" font-size="10" text-anchor="middle">${u.toFixed(2)} m</text></g>
      </svg>
      <span class="hme-side-hint">Drag the pin up or down here.</span>
    </div>`}heightDrag(e,t,o,n,i,r){if(t.button!==0)return;let a=t.currentTarget,d=o.id,l=u=>{let b=a.getBoundingClientRect(),f=(u.clientY-b.top)*130/Math.max(b.height,1);return Math.min(Math.max(Math.round((i-f)/r/.05)*.05,0),n)},p=l(t);try{a.setPointerCapture(t.pointerId)}catch{}this.moving=!0,e.preview(u=>Fe(u,d,p));let h=u=>{p=l(u);let b=p;e.preview(f=>Fe(f,d,b))},c=()=>{a.removeEventListener("pointermove",h),a.removeEventListener("pointerup",c),a.removeEventListener("pointercancel",c),this.moving=!1,e.preview(void 0);let u=p;Math.abs(u-o.at[2])>=.005&&e.apply(b=>Fe(b,d,u))};a.addEventListener("pointermove",h),a.addEventListener("pointerup",c),a.addEventListener("pointercancel",c)}pill(e){let t=this.picks(e);if(t.length>1&&!this.moving)return this.groupPill(e,t);let o=this.picked(e);if(o===void 0||this.moving)return g;let n=o.id,i=o.entityId.startsWith("light."),r=xe(e.floor,o)!==void 0;return m`<span class="hme-pill-name">${J(o,e.hass)}</span>
      ${Kn(o.entityId)&&e.hass!==void 0?m`<button type="button" class="hme-tb" @click=${()=>this.toggle(e,o.entityId)}>${Wn(o.entityId,e.hass.states)}</button>`:g}
      ${i?m`<button type="button" class="hme-tb" title="Every light on this floor at this light's height" @click=${()=>e.apply(a=>Qr(a,n))}>Same height for all lights</button>`:g}
      ${r?m`<button type="button" class="hme-tb" @click=${()=>e.apply(a=>Jr(a,n))}>Center in room</button>`:g}
      <button type="button" class="hme-tb danger" @click=${()=>e.apply(a=>zn(a,n),{select:null})}>Remove</button>`}groupPill(e,t){let o=t.map(d=>d.id),n=t[0],i=n.at[2],r=t.every(d=>Math.abs(d.at[2]-i)<.005),a=e.hass===void 0?void 0:Ha(t.map(d=>d.entityId),e.hass.states);return m`<span class="hme-pill-name">${O(t.length,"device")}</span>
      ${a===void 0?g:m`<button type="button" class="hme-tb" @click=${()=>this.turn(e,t.map(d=>d.entityId),a.service)}>${a.words}</button>`}
      <button type="button" class="hme-tb" ?disabled=${r} title=${r?"They are all at one height":`Every picked device at ${J(n,e.hass)}'s height, ${i.toFixed(2)} m`}
        @click=${()=>e.apply(d=>yt(d,o,i))}>Same height</button>
      <button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(e,o)}}>Remove</button>`}toggle(e,t){let o=e.hass;o!==void 0&&It(o,"homeassistant","toggle",{entity_id:t}).catch(n=>{e.note("err",`Could not turn it on or off: ${n instanceof Error?n.message:String(n)}`)})}turn(e,t,o){let n=e.hass;n!==void 0&&It(n,"homeassistant",o,{entity_id:[...t]}).catch(i=>{e.note("err",`Could not turn them ${o==="turn_on"?"on":"off"}: ${i instanceof Error?i.message:String(i)}`)})}inspector(e){let t=this.picks(e);if(t.length>1)return this.groupInspector(e,t);let o=this.picked(e);if(o===void 0)return g;let n=e.hass?.states,i=o.id,r=ue(o.entityId,n),a=r.kind==="light"&&r.on,d=this.friendly(e,o.entityId),l=this.deviceClass(e,o.entityId),p=be(o.entityId,l,d),h=o.icon??p,u=xe(e.floor,o)?.height??2.5,b=v=>e.apply(M=>Ye(M,i,v,d)),y=$t(o)??We;return m`
      <section class="hme-card hme-head">
        <span class="hme-pin-big ${a?"lit":""}" style=${a?`background:${y};box-shadow:0 0 24px ${y}80`:""}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${te(h,a?"#3a2600":"#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${J(o,e.hass)}</strong>
          <span class="mono">${o.entityId}</span>
        </div>
        <span class="hme-state ${a?"lit":""}">${pe(o.entityId,n)}</span>
      </section>

      ${L("On the map",m`
        ${U("Name",Et({value:o.name??"",label:"Name on the map",placeholder:d??o.entityId,set:v=>b({name:v.trim()===""?null:v})}))}
        ${this.iconRows(e,o,b)}
        ${U("Room",m`<span class="hme-in hme-ro">${qd(e.floor,o)}</span>`)}
        ${Ls(o,y,b)}`)}

      ${L("Height",m`
        <div class="hme-r">
          <input class="hme-range" type="range" min="0" max=${u} step="0.05" .value=${G(String(o.at[2]))} aria-label="Height" style=${Oe(o.at[2],0,u)}
            @input=${v=>{let M=Number(v.target.value);e.preview(x=>Fe(x,i,M))}}
            @change=${v=>{let M=Number(v.target.value);e.apply(x=>Fe(x,i,M))}} />
          ${N({label:"Height",value:o.at[2],unit:"m",min:0,max:100,width:"92px",set:v=>e.apply(M=>Fe(M,i,v))})}
        </div>
        <div class="hme-chips">${Bn.map(([v,M])=>m`<button type="button" class="hme-chip sel ${Math.abs(o.at[2]-M)<.005?"on":""}"
          @click=${()=>e.apply(x=>Fe(x,i,M))}>${v} ${M}</button>`)}</div>
        <p class="hme-text dim">The model looks stand the pin at this height.</p>`)}

      ${o.entityId.startsWith("light.")?this.lightCard(e,o,r.kind==="light"&&r.on?r.brightness:void 0,b):g}

      ${this.tapCard(e,o,b)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>e.apply(v=>zn(v,i),{select:null})}>Remove from the map</button></div>`}iconRows(e,t,o){let n=this.friendly(e,t.entityId),i=this.deviceClass(e,t.entityId),r=be(t.entityId,i,n),a=t.icon??r;return m`${U("Icon",m`<button type="button" class="hme-in hme-icon-btn" aria-haspopup="true" aria-expanded=${this.iconsOpen?"true":"false"}
        @click=${()=>{this.iconsOpen=!this.iconsOpen,e.redraw()}}>
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">${te(a,"currentColor",24,2)}</svg>
        <span class="hme-grow">${Xd(t,i,n)}</span><span class="hme-caret" aria-hidden="true">▾</span></button>`)}
      ${this.iconsOpen?this.iconMenu(e,t,r,o):g}`}iconMenu(e,t,o,n){let i=a=>{this.iconsOpen=!1,n({icon:a}),e.redraw()},r=(a,d,l,p)=>m`<button type="button" class="hme-icon-cell ${l?"on":""}"
      title=${d} aria-label=${d} aria-pressed=${l?"true":"false"} @click=${()=>i(p)}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">${te(a,"currentColor",24,1.9)}</svg><span>${d}</span></button>`;return m`<div class="hme-icons" role="group" aria-label="Icon">
      ${r(o,"Auto",t.icon===void 0,null)}
      ${Vi.map(a=>r(a,Ko[a],t.icon===a,a))}
    </div>`}lightCard(e,t,o,n){return L("Light",this.glowRows(e,t,o,n))}glowRows(e,t,o,n){let i=t.id,r=Vt(t,o),a=$t(t),d=(l,p,h)=>m`<button type="button" class="hme-chip sel ${p?"on":""}" aria-pressed=${p?"true":"false"} @click=${h}>${l}</button>`;return m`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        <input class="hme-range" type="range" min=${Rt} max=${Math.max(Hi,r)} step="0.05" .value=${G(String(r))} aria-label="Glow size"
          style=${Oe(r,Rt,Math.max(Hi,r))}
          @input=${l=>{let p=Number(l.target.value);e.preview(h=>Ye(h,i,{glow:p}))}}
          @change=${l=>n({glow:Number(l.target.value)})} />
        <span class="hme-val mono hme-w48">${r.toFixed(1)} m</span></div>
      <div class="hme-row-end indent">${d("By its brightness",t.glow===void 0,()=>n({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${d("Follow the light",t.glowColor===void 0,()=>n({glowColor:null}))}
        ${d("Warm",t.glowColor==="warm",()=>n({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${a!==void 0?"on":""}">${a===void 0?g:m`<span class="hme-swatch" style=${`background:${a}`}></span>`}Pick
          ${oo({value:a??"#ffb648",label:"Pick the glow's color",preview:l=>e.preview(l===void 0?void 0:p=>Ye(p,i,{glowColor:l})??p),set:l=>n({glowColor:l})})}</label>
      </div></div>
      ${As(t.glowSpill===!0?"off":"on",l=>n({glowSpill:l?null:!0}))}
      ${Q("The pool of light round this light on the plan and the tiles. Warm is the lamplight every light has without a color of its own.")}`}thingCards(e,t,o){let n=e.floor.rooms.find(E=>k(E.id,t)),i=n?.objects[o];if(n===void 0||i===void 0)return g;let r=on(i)||Tn(i.model)!==void 0,a=r?"Light":"Device",d=Me(i),l=e.floor.id,p=Mt(e.floor,n.id,o),h=E=>r?`Put ${E} in this lamp`:`Put ${E} on this ${d}`;if(p===void 0){let E=()=>e.openAdd("devices",{title:r?"Choose a light for this lamp":`Choose a device for this ${d}`,lightsOnly:r,rowTitle:h,pick:A=>{this.putOn(e,{roomId:n.id,object:o},A)||e.redraw()}});return L(a,m`
        ${U(a,m`<span class="hme-in hme-ro dim">None</span>`,m`<button type="button" class="hme-tb" aria-haspopup="dialog" title=${r?"Pick the light this lamp holds":`Pick the device this ${d} is or carries`}
            @click=${E}>Choose…</button>`)}
        ${Q(r?"Pick the light this lamp holds, or drag its light's pin onto it on the plan.":`The device this ${d} is or carries, a TV's media player or a fan's switch: choose it, or drag its pin onto it on the plan.`)}`)}let c=e.hass?.states,u=p.id,b=me(p.entityId),f=ue(p.entityId,c),y=f.kind==="light"&&f.on,v=this.friendly(e,p.entityId),M=E=>e.apply(A=>Ye(A,u,E,v)),x=p.icon??be(p.entityId,this.deviceClass(e,p.entityId),v),w=$t(p)??We,P=e.doc.floors.find(E=>k(E.id,l))?.rooms.find(E=>k(E.id,n.id)),_=()=>{let E=e.newId().toUpperCase(),A=P===void 0?null:{kind:"object",roomId:n.id,object:P.objects.length};e.apply(q=>ra(q,l,n.id,o,E)?.doc,{select:A})||e.note("warn","Another lamp could not be added: the map holds at most 400 devices, and a room at most 256 things.")},I=()=>e.openAdd("devices",{title:r?"Change the light in this lamp":`Change the device on this ${d}`,lightsOnly:r,now:p.entityId,rowTitle:h,pick:E=>{if(!me(E)&&Je(e.doc,E)!==void 0){e.note("warn","That device is on the map already. Drag its pin onto this instead."),e.redraw();return}e.apply(A=>aa(A,u,E))||e.redraw()}}),z=r?"lamp":d,S=b?"light":"device";return m`${L(a,m`
        <div class="hme-lamp-light">
          <span class="hme-pin-big ${y?"lit":""}" style=${y?`background:${w};box-shadow:0 0 24px ${w}80`:""}>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${te(x,y?"#3a2600":"#d1d1d6",24,2)}</svg></span>
          <div class="hme-head-t hme-grow">
            <strong>${J(p,e.hass)}</strong>
            <span class="mono">${p.entityId}</span>
          </div>
          <span class="hme-state ${y?"lit":""}">${pe(p.entityId,c)}</span>
        </div>
        ${U("Name",Et({value:p.name??"",label:"Name on the map",placeholder:v??p.entityId,set:E=>M({name:E.trim()===""?null:E})}))}
        ${U(a,m`<span class="hme-in hme-ro mono">${p.entityId}</span>`,m`<button type="button" class="hme-tb" aria-haspopup="dialog" title=${r?"Show another of the home's lights in this lamp":`Show another of the home's devices on this ${d}`}
            @click=${I}>Change…</button>`)}
        ${b?this.glowRows(e,p,y?f.brightness:void 0,M):g}
        ${this.iconRows(e,p,M)}
        ${Ls(p,w,M)}
        <div class="hme-row-end">
          ${Kn(p.entityId)&&e.hass!==void 0?m`<button type="button" class="hme-tb" @click=${()=>this.toggle(e,p.entityId)}>${Wn(p.entityId,c)}</button>`:g}
          ${b?m`<button type="button" class="hme-tb" title=${`Another of this ${z} beside it, holding the same light: a light group in many lamps`} @click=${_}>Add another</button>`:g}
          <button type="button" class="hme-tb push" title=${`The ${z} lets go of the ${S}; both stay where they are`} @click=${()=>e.apply(E=>na(E,l,n.id,o))}>Unlink</button>
        </div>
        <p class="hme-foot-hint">${r&&b?"The light sits in the lamp: move, lift or turn the lamp and the light goes with it.":`The ${S} sits on the ${z}: move, lift or turn the ${z} and the ${S} goes with it.`}</p>`)}
      ${this.tapCard(e,p,M)}`}groupInspector(e,t){let o=e.hass?.states,n=t.map(h=>h.id),i=h=>{e.apply(c=>Oo(c,n,h))||e.note("warn","That could not be set on every picked device.")},r=Math.max(2.5,...t.map(h=>xe(e.floor,h)?.height??2.5)),a=ge(t.map(h=>h.at[2])),d=ge(t.map(h=>h.reading)),l=t.every(h=>h.entityId.startsWith("light.")),p=We;return m`
      <section class="hme-card hme-head">
        <span class="hme-pin-big"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${te("bulb","#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${O(t.length,"device")}</strong>
          <span>Shift, Cmd or Ctrl and a click adds or takes one away</span>
        </div>
      </section>

      ${L("Picked",m`${t.map(h=>m`<div class="hme-list-row hme-pick-row">
          <button type="button" class="hme-grow hme-link" title="Pick this one alone" @click=${()=>e.select({kind:"pin",pinId:h.id})}>${J(h,e.hass)}</button>
          <span class="hme-val">${pe(h.entityId,o)}</span>
          <button type="button" class="hme-x" aria-label=${`Leave ${J(h,e.hass)} out of the pick`} title="Leave it out of the pick"
            @click=${()=>e.select(kt(e.selection,h.id))}>×</button></div>`)}`,String(t.length))}

      ${L("On the map",m`
        <div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
          ${ie({label:"None",picture:Ct("none",p),on:!d.mixed&&d.value==="none",click:()=>i({reading:"none"})})}
          ${ie({label:"Pill",picture:Ct("pill",p),on:!d.mixed&&d.value===void 0,title:"Each one's reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>i({reading:null})})}
          ${ie({label:"Name",picture:Ct("name",p),on:!d.mixed&&d.value==="name",click:()=>i({reading:"name"})})}
        </div></div>
        ${d.mixed?Q("Mixed: they show different things. Pick one to set them all.",!0):g}`)}

      ${L("Height",m`
        <div class="hme-r">
          ${Os({label:"Height",value:a.mixed?void 0:a.value,min:0,max:r,step:.05,preview:h=>e.preview(c=>yt(c,n,h)),set:h=>e.apply(c=>yt(c,n,h))})}
          ${N({label:"Height",value:a.mixed?void 0:a.value,unit:"m",min:0,max:100,width:"92px",set:h=>e.apply(c=>yt(c,n,h))})}
        </div>
        <div class="hme-chips">${Bn.map(([h,c])=>m`<button type="button" class="hme-chip sel ${t.every(u=>Math.abs(u.at[2]-c)<.005)?"on":""}"
          @click=${()=>e.apply(u=>yt(u,n,c))}>${h} ${c}</button>`)}</div>
        <p class="hme-text dim">Every picked device at this height.</p>`)}

      ${l?this.groupLightCard(e,t,i):g}

      ${this.groupTapCard(e,t,i)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(e,n)}}>Remove ${O(t.length,"device")} from the map</button></div>`}groupLightCard(e,t,o){let n=t.map(b=>b.id),i=this.states(e),r=t.map(b=>{let f=ue(b.entityId,i);return Math.round(Vt(b,f.kind==="light"&&f.on?f.brightness:void 0)*20)/20}),a=ge(r),d=Math.max(Hi,...r),l=t.every(b=>b.glow===void 0),p=ge(t.map(b=>b.glowColor?.toLowerCase())),h=ge(t.map(b=>b.glowSpill===!0)),c=p.mixed||p.value===void 0||p.value==="warm"?void 0:p.value,u=(b,f,y)=>m`<button type="button" class="hme-chip sel ${f?"on":""}" aria-pressed=${f?"true":"false"} @click=${y}>${b}</button>`;return L("Light",m`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        ${Os({label:"Glow size",value:a.mixed?void 0:a.value,min:Rt,max:d,step:.05,preview:b=>e.preview(f=>Oo(f,n,{glow:b})),set:b=>o({glow:b})})}
        <span class="hme-val mono hme-w48">${a.mixed?"Mixed":`${a.value.toFixed(1)} m`}</span></div>
      <div class="hme-row-end indent">${u("By its brightness",l,()=>o({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${u("Follow the light",!p.mixed&&p.value===void 0,()=>o({glowColor:null}))}
        ${u("Warm",!p.mixed&&p.value==="warm",()=>o({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${c!==void 0?"on":""}">${c===void 0?g:m`<span class="hme-swatch" style=${`background:${c}`}></span>`}Pick
          ${oo({value:c??"#ffb648",label:"Pick the glow's color for every picked light",preview:b=>e.preview(b===void 0?void 0:f=>Oo(f,n,{glowColor:b})??f),set:b=>o({glowColor:b})})}</label>
      </div></div>
      ${p.mixed?Q("Mixed: their colors differ. Pick one to set them all.",!0):g}
      ${As(h.mixed?"mixed":h.value?"off":"on",b=>o({glowSpill:b?null:!0}))}`)}groupTapCard(e,t,o){let n=ge(t.map(l=>[l.tap,l.tap==="page"?l.pageId?.toLowerCase():void 0])),i=n.mixed?void 0:n.value,r=i?.[0]==="page"||this.pickPage,a=i?.[0]==="page"?t[0].pageId:void 0,d=l=>{if(l==="page"){e.pages.length===1?o({tap:"page",pageId:e.pages[0].id}):(this.pickPage=!0,e.redraw());return}this.pickPage=!1,o({tap:l??null})};return L("Tap on the map",m`
      <div class="hme-chips">${Un.map(([l,p])=>{let h=l==="page"?r:!this.pickPage&&i!==void 0&&i[0]===l;return m`<button type="button" class="hme-chip sel ${h?"on":""}" aria-pressed=${h?"true":"false"}
          ?disabled=${l==="page"&&e.pages.length===0} title=${l==="page"&&e.pages.length===0?"Your library has no pages":""}
          @click=${()=>d(l)}>${p}</button>`})}</div>
      ${r?U("Page",ve({label:"Page",value:a??"",options:[...a===void 0?[{value:"",label:"Pick a page\u2026",disabled:!0}]:[],...a===void 0||e.pages.some(l=>k(l.id,a))?[]:[{value:a,label:"A page not in your library",disabled:!0}],...e.pages.map(l=>({value:l.id,label:l.name}))],set:l=>{this.pickPage=!1,l!==""&&o({tap:"page",pageId:l})}})):g}
      <p class="hme-text dim">${n.mixed&&!this.pickPage?"Mixed: a tap does different things on them. Pick one to set them all.":"Set on every picked device."}</p>`)}tapCard(e,t,o){let n=t.tap==="page"||this.pickPage,i=t.pageId===void 0||e.pages.some(a=>k(a.id,t.pageId)),r=a=>{if(a==="page"){if(t.tap==="page")return;e.pages.length===1?o({tap:"page",pageId:e.pages[0].id}):(this.pickPage=!0,e.redraw());return}this.pickPage=!1,o({tap:a??null})};return L("Tap on the map",m`
      <div class="hme-chips">${Un.map(([a,d])=>{let l=a==="page"?n:!this.pickPage&&t.tap===a;return m`<button type="button" class="hme-chip sel ${l?"on":""}" aria-pressed=${l?"true":"false"}
          ?disabled=${a==="page"&&e.pages.length===0} title=${a==="page"&&e.pages.length===0?"Your library has no pages":""}
          @click=${()=>r(a)}>${d}</button>`})}</div>
      ${n?U("Page",ve({label:"Page",value:t.tap==="page"?t.pageId??"":"",options:[...t.tap==="page"?[]:[{value:"",label:"Pick a page\u2026",disabled:!0}],...i?[]:[{value:t.pageId,label:"A page not in your library",disabled:!0}],...e.pages.map(a=>({value:a.id,label:a.name}))],set:a=>{this.pickPage=!1,a!==""&&o({tap:"page",pageId:a})}})):g}
      <p class="hme-text dim">${t.tap===void 0&&!this.pickPage?"As the tile does: a light toggles, anything else opens its control.":"Hold on the watch or iPhone: its controls."}</p>`)}};function As(s,e){let t=s==="on"?"walls stop the glow":s==="off"?"the glow spreads past the walls":"some stay in, some spread";return m`<div class="hme-r"><span class="hme-l">Stay in room</span>
    ${s==="mixed"?m`<button type="button" class="hme-chip off" aria-pressed="mixed" aria-label="Stay in room" @click=${()=>e(!0)}>Mixed</button>`:no({on:s==="on",onText:"On",offText:"Off",label:"Stay in room",click:()=>e(s!=="on")})}
    <span class="hme-text dim">${t}</span></div>`}function Os(s){let e=s.value??(s.min+s.max)/2;return m`<input class="hme-range ${s.value===void 0?"mixed":""}" type="range" min=${s.min} max=${s.max} step=${s.step} .value=${G(String(e))}
    aria-label=${s.label} aria-valuetext=${s.value===void 0?"Mixed":g} style=${s.value===void 0?"--p:0%":Oe(s.value,s.min,s.max)}
    @input=${t=>{let o=t.target;o.classList.remove("mixed"),s.preview(Number(o.value))}}
    @change=${t=>s.set(Number(t.target.value))} />`}function Ls(s,e,t){return m`<div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
    ${ie({label:"None",picture:Ct("none",e),on:s.reading==="none",click:()=>t({reading:"none"})})}
    ${ie({label:"Pill",picture:Ct("pill",e),on:s.reading===void 0,title:"Its reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>t({reading:null})})}
    ${ie({label:"Name",picture:Ct("name",e),on:s.reading==="name",click:()=>t({reading:"name"})})}
  </div></div>`}function Ct(s,e){return m`<svg width="62" height="44" viewBox="0 0 62 44" aria-hidden="true">
    <circle cx="31" cy=${s==="none"?20:16} r="9" fill=${e} />
    ${s==="pill"?H`<rect x="17" y="29" width="28" height="11" rx="5.5" fill="rgba(0,0,0,0.7)" stroke="#3a3a3c" /><text x="31" y="37.5" font-size="8" fill="#fff" text-anchor="middle">21.5°</text>`:g}
    ${s==="name"?H`<text x="31" y="38" font-size="8" fill="#fff" text-anchor="middle">Name</text>`:g}
  </svg>`}var ce=s=>s.toFixed(1),Zd=18;function Ns(s){return s.doc.floors.find(e=>k(e.id,s.floor.id))??s.floor}function Ws(s){return s.length<2?s.join(""):`${s.slice(0,-1).join(", ")} and ${s[s.length-1]}`}function Qd(s,e){return Math.abs(e)>=Math.abs(s)?e>0?"down":"up":s>0?"right":"left"}function Jd(s,e){let t=s.moves.flatMap(a=>{let d=e.rooms.find(l=>k(l.id,a.roomId));return d===void 0?[]:[C(d)]}),o=s.moves[0],n=o===void 0?0:Math.hypot(o.dx,o.dy),i=o===void 0?"":Qd(o.dx,o.dy),r=s.after===s.doors?`all ${s.doors} doors meet`:`${s.after} of ${s.doors} doors meet`;return`Move ${Ws(t)} ${he(n)} ${i}: ${r}.`}function el(s,e){let t=r=>Ws(r.flatMap(a=>{let d=e.rooms.find(l=>k(l.id,a));return d===void 0?[]:[C(d)]})),o=s.pairs===1?"The door":`${s.pairs} doors`,n=s.pairs===1?`of ${t(s.move)} moves`:`of ${t(s.move)} move`,i=s.narrow?" A door gets narrower, as the rooms share little wall.":"";return`${o} ${n} to meet ${t(s.keep)}. The rooms stay.${i}`}function Ks(s){let e=ga(s).map(o=>({words:el(o,s),button:o.pairs===1?"Move the door":"Move the doors",op:n=>fa(n,o.spots)})),t=ma(s);return t!==void 0&&e.push({words:Jd(t,s),button:t.moves.length===1?"Move the room":"Move the rooms",op:o=>ua(o,t.moves)}),e}var dn=class{constructor(){this.offer=0;this.showing=!1}get active(){return this.connecting!==void 0}endShow(e){this.showing&&e.preview(void 0),this.showing=!1}stop(e){this.endShow(e),this.connecting=void 0}choices(e){if(this.connecting===void 0)return[];let t=Le(e.floor),o=t.doors.find(n=>k(n.roomId,this.connecting.roomId)&&n.index===this.connecting.opening);return o===void 0?[]:xn(t,o)}clicked(e,t,o){let n=Le(e.floor),i=n.doors.find(r=>k(r.roomId,t)&&r.index===o);i===void 0||ht(n,t,o)!==void 0||xn(n,i).length>0&&this.start(e,t,o)}start(e,t,o){this.connecting={roomId:t,opening:o},e.select({kind:"opening",roomId:t,opening:o}),e.redraw()}connect(e,t,o){let n=this.connecting;return n===void 0?!1:(this.connecting=void 0,e.apply(i=>ba(i,n.roomId,n.opening,t,o),{select:{kind:"room",roomId:n.roomId}})||e.note("err","Those two doors cannot be connected."),!0)}pickDoor(e,t,o){return this.connecting===void 0?!1:this.choices(e).some(n=>k(n.roomId,t)&&n.index===o)?this.connect(e,t,o):(this.connecting=void 0,!1)}pointerDown(e,t){let o=e.toScreen(t),n;for(let i of this.choices(e)){let r=e.toScreen(i.mid),a=Math.hypot(r[0]-o[0],r[1]-o[1]);a<=Zd&&(n===void 0||a<n.d)&&(n={door:i,d:a})}return n!==void 0?this.connect(e,n.door.roomId,n.door.index):(this.connecting=void 0,!1)}keyDown(e,t){return this.connecting===void 0||Z(t,!1)!=="cancel"?!1:(this.connecting=void 0,e.redraw(),!0)}pill(e){let t=this.connecting;if(t===void 0)return g;let o=e.floor.rooms.find(n=>k(n.id,t.roomId));return m`<span class="hme-pill-name">Click the door that ${o===void 0?"it":C(o)} should meet</span>
      <button type="button" class="hme-tb" @click=${()=>{this.connecting=void 0,e.redraw()}}>Cancel</button>`}overlay(e){let t=Le(e.floor);if(t.doors.length===0||e.floor.rooms.length<2)return g;let o=this.choices(e),n=[],i=new Set;for(let a of t.doors){let[d,l]=e.toScreen(a.mid),p=ht(t,a.roomId,a.index);o.includes(a)||(p===void 0?this.connecting!==void 0&&k(a.roomId,this.connecting.roomId)&&a.index===this.connecting.opening||n.push(H`<circle class="hme-door-open" cx=${ce(d)} cy=${ce(l)} r="6" fill="#ffb340" stroke="#2a1a00" stroke-width="1"><title>No partner yet. Click to connect it.</title></circle>`):i.has(p)||(i.add(a),n.push(H`<circle class="hme-door-met" cx=${ce(d)} cy=${ce(l)} r="4" fill="#30d158" />`)))}let r=o.map(a=>{let[d,l]=e.toScreen(a.mid),p=e.floor.rooms.find(u=>k(u.id,a.roomId)),h=p===void 0?"":C(p),c=h.length*6.4+16;return H`<g class="hme-door-choice"><circle cx=${ce(d)} cy=${ce(l)} r="9" fill="#5b8def" stroke="#fff" stroke-width="2" />
        <g class="hme-tag"><rect x=${ce(d-c/2)} y=${ce(l-34)} width=${ce(c)} height="20" rx="10" fill="#5b8def" />
        <text x=${ce(d)} y=${ce(l-20)} fill="#fff" text-anchor="middle">${h}</text></g></g>`});return H`<g class="hme-doors" pointer-events="none">${n}${r}</g>`}allMet(e){let t=Ns(e);if(t.rooms.length<2)return;let o=Le(t),n=o.doors.length;if(!(n===0||$n(o).length>0||Kt(t).length>0||Ks(t).length>0))return n}fitFoot(e){let t=this.allMet(e);return t===void 0?g:m`<p class="hme-fit-foot" role="status">All ${t} doors meet.</p>`}fitCard(e){let t=Ns(e);if(t.rooms.length<2||this.allMet(e)!==void 0)return g;let o=Le(t),n=Kt(t),i=o.doors.length;if(i===0&&n.length===0)return g;let r=Ks(t),a=r.length===0?void 0:r[this.offer%r.length],d=$n(o).length,l=()=>{a!==void 0&&(this.showing=!this.showing,e.preview(this.showing?a.op:void 0),e.redraw())},p=()=>{a!==void 0&&(this.showing=!1,this.offer=0,e.preview(void 0),e.apply(a.op,{select:null}))},h=()=>{this.offer=(this.offer+1)%r.length;let b=r[this.offer];this.showing&&b!==void 0&&e.preview(b.op),e.redraw()},c=a!==void 0||d>0?"hot":n.length>0?"":"good",u=t.id;return m`<section class="hme-card hme-fit ${c}">
      <div class="hme-h">Fit rooms${i===0?g:m`<span class="hme-h-end">${o.met} of ${O(i,"door")}</span>`}</div>
      ${i===0?g:m`<div class="hme-fit-bar" role="img" aria-label=${`${o.met} of ${O(i,"door")} meet`}>
        <i class=${d===0?"full":""} style=${`width:${o.met/i*100}%`}></i></div>`}
      ${a!==void 0?m`<p class="hme-text">${a.words}</p>
        <div class="hme-fit-acts">
          <button type="button" class="hme-tb" aria-pressed=${this.showing?"true":"false"} @click=${l}>${this.showing?"Hide":"Show me"}</button>
          <button type="button" class="hme-tb hme-blue" @click=${p}>${a.button}</button>
        </div>
        ${r.length<2?g:m`<button type="button" class="hme-tb hme-wide hme-fit-other" @click=${h}>Another way (${this.offer%r.length+1} of ${r.length})</button>`}`:d>0?m`<p class="hme-text">Amber doors have no partner. Click one, then the door it should meet.</p>`:i>0?m`<p class="hme-text dim">All doors meet.</p>`:g}
      ${n.map(b=>m`<div class="hme-fix">
        <span class="hme-fix-dot ${b.kind==="missingDoor"?"gray":""}"></span>
        <p @click=${()=>e.select({kind:"room",roomId:b.roomIds[0]})}><b>${b.title}</b> ${b.detail}</p>
        <button type="button" class="hme-tb" @click=${()=>e.apply(f=>b.fix(f))}>${b.fixLabel}</button></div>`)}
      ${n.length>1?m`<button type="button" class="hme-tb hme-wide" @click=${()=>e.apply(b=>va(b,u))}>Fix all ${n.length}</button>`:g}
    </section>`}doorsCard(e,t){let o=Le(e.floor),n=o.doors.filter(r=>k(r.roomId,t.id));if(n.length===0)return g;let i=n.filter(r=>ht(o,r.roomId,r.index)!==void 0).length;return m`<section class="hme-card hme-doors-card">
      <div class="hme-h">Doors<span class="hme-h-end">${i} of ${n.length} meet</span></div>
      ${n.map(r=>{let a=ht(o,r.roomId,r.index),d=a===void 0?void 0:e.floor.rooms.find(h=>k(h.id,a.roomId));return m`<div class="hme-door-row" @pointerenter=${()=>e.setHover({kind:"opening",roomId:r.roomId,opening:r.index})} @pointerleave=${()=>e.setHover(void 0)}>
          <span class="hme-fix-dot ${d===void 0?"":"green"}"></span>
          <button type="button" class="hme-door-name" @click=${()=>e.select({kind:"opening",roomId:r.roomId,opening:r.index})}>${d===void 0?"No partner":`To ${C(d)}`}</button>
          <span class="mono dim">${he(r.width)}</span>
          ${a===void 0?m`<button type="button" class="hme-tb" title="Click the door it should meet, on the plan or in 3D" @click=${()=>this.start(e,r.roomId,r.index)}>Connect</button>`:g}
        </div>`})}
    </section>`}opensToCard(e,t,o){let n=Le(e.floor);if(n.doors.find(l=>k(l.roomId,t.id)&&l.index===o)===void 0)return g;let r=ht(n,t.id,o),a=r===void 0?void 0:e.floor.rooms.find(l=>k(l.id,r.roomId));if(a!==void 0)return m`<section class="hme-card hme-fit good"><div class="hme-h">Opens to</div>
        <p class="hme-text">${C(a)}. One door, cutting both walls.</p></section>`;let d=this.connecting!==void 0&&k(this.connecting.roomId,t.id)&&this.connecting.opening===o;return m`<section class="hme-card hme-fit hot"><div class="hme-h">Opens to</div>
      ${d?m`<p class="hme-text">Click the blue door it should meet. On one wall this door moves there and the room stays. Else <b>${C(t)}</b> moves.</p>
        <button type="button" class="hme-tb hme-wide" @click=${()=>{this.connecting=void 0,e.redraw()}}>Cancel</button>`:m`<button type="button" class="hme-tb hme-blue hme-wide" @click=${()=>this.start(e,t.id,o)}>Connect to a door</button>`}
    </section>`}};function Ys(s){return nl[s]}var tl=[{label:"Door",kind:"door"},{label:"Double door",kind:"door",style:"double"},{label:"Sliding door",kind:"door",style:"sliding"},{label:"Window",kind:"window"},{label:"Sliding window",kind:"window",style:"sliding"},{label:"Way through",kind:"opening"}],Bs=18,Ti="#4fd6c2",Us="Draw each room faint and dashed as the iPhone scanned it, or as first seen for a room scanned before scans were kept. A room drawn here has none.",ol="Put this room's walls, doors, windows and furniture back as the iPhone scanned it. Its devices stay where they are.",$=s=>s.toFixed(1),rt=s=>`${s[0].toFixed(1)},${s[1].toFixed(1)}`,Gs=new WeakMap;function Vs(s){let e=Gs.get(s);return e===void 0&&Gs.set(s,e=Kt(s)),e}function qs(s,e,t,o){let n=t/s.view.scale,i=a=>{let d;for(let l of a)for(let[p,h]of B(l).entries()){let c=mr(e,h);c<=n&&(d===void 0||c<d.d)&&(d={room:l,wall:p,seg:h,d:c})}return d};return(o===void 0?void 0:i([o]))??i(s.floor.rooms)}function Xs(s,e){let t=Math.max(He(e),1e-9),o=[-(e.b[1]-e.a[1])/t,(e.b[0]-e.a[0])/t],n=[(e.a[0]+e.b[0])/2,(e.a[1]+e.b[1])/2],i=X(s)??se(s);return(i[0]-n[0])*o[0]+(i[1]-n[1])*o[1]>0&&(o=[-o[0],-o[1]]),o}var ln=class{constructor(){this.tool="select";this.dragging=!1}setTool(e,t){this.first=void 0,this.tool=t,e.redraw()}get armed(){return this.tool!=="select"}focus(e){let t=ne(e.selection);return t===void 0?void 0:e.floor.rooms.find(o=>k(o.id,t))}pieceRoom(e){return oe(e.selection)?this.focus(e):void 0}placed(e,t){this.setTool(e,"select"),e.select(t)}pickedWall(e,t){let o=e.selection;if(!(t===void 0||o===void 0)){if(o.kind==="wall")return o.wall;if(o.kind==="opening"){let n=t.openings[o.opening],i=n===void 0?-1:vt(t,n);return i>=0?i:void 0}}}roomCards(e,t){return m`${this.wallsCard(e,t)}${this.scanCard(e,t)}`}wallsCard(e,t){let o=B(t),n=e.selection,i=t.id,r=es(t),a=t.openings.map((l,p)=>({o:l,i:p})).filter(({o:l})=>vt(t,l)<0),d=({o:l,i:p})=>{let h=n?.kind==="opening"&&n.opening===p;return m`<button type="button" class="hme-lay sub ${h?"on":""}" aria-pressed=${h?"true":"false"}
        @pointerenter=${()=>e.setHover({kind:"opening",roomId:i,opening:p})} @pointerleave=${()=>e.setHover(void 0)}
        @click=${()=>e.select({kind:"opening",roomId:i,opening:p})}>${eo(l)}<span class="n">${he(Math.hypot(l.b[0]-l.a[0],l.b[1]-l.a[1]))}</span></button>`};return m`<section class="hme-card hme-layers">
      <div class="hme-h">${C(t)}<span class="hme-h-end">${O(o.length,"wall")}</span></div>
      ${o.map((l,p)=>{let h=n?.kind==="wall"&&n.wall===p;return m`<button type="button" class="hme-lay ${h?"on":""}" aria-pressed=${h?"true":"false"}
            @pointerenter=${()=>e.setHover({kind:"wall",roomId:i,wall:p})} @pointerleave=${()=>e.setHover(void 0)}
            @click=${()=>e.select({kind:"wall",roomId:i,wall:p})}>${r[p]}<span class="n">${he(He(l))}</span></button>
          ${t.openings.map((c,u)=>({o:c,i:u})).filter(({o:c})=>vt(t,c)===p).map(d)}`})}
      ${a.length===0?g:m`<div class="hme-lay dim">In no wall</div>${a.map(d)}`}
    </section>`}scanCard(e,t){if(e.scans===void 0)return g;let o=t.id,n=Qi(e.scans,o),i=n!==void 0&&qr(t,n)?n:void 0;return L("Show scan as it was",m`<div class="hme-row-end">
      <button type="button" class="hme-tb ${e.toggles.scan?"on":""}" aria-pressed=${e.toggles.scan?"true":"false"} title=${Us}
        @click=${()=>e.setToggle("scan",!e.toggles.scan)}>${e.toggles.scan?"On":"Off"}</button>
      <button type="button" class="hme-tb" ?disabled=${i===void 0} title=${i===void 0?"This room is as the iPhone scanned it, or was drawn here":ol}
        @click=${()=>{i!==void 0&&e.apply(r=>Xr(r,o,i))}}>Back to the scan</button>
    </div>`)}overlay(e){let t=this.pieceRoom(e),o=[];return e.toggles.scan&&o.push(...this.scanMarks(e)),o.push(...this.issueMarks(e)),t!==void 0&&o.push(this.roomHandles(e,t)),o.push(...this.ghost(e)),H`${o}`}scanMarks(e){return Yr(e.floor,e.scans).map(t=>{let o=t.outline.map(i=>rt(e.toScreen(i))).join("L"),n=t.walls.map(i=>`M${rt(e.toScreen(i.a))}L${rt(e.toScreen(i.b))}`).join("");return H`<g class="hme-scan" data-room=${t.roomId} pointer-events="none">
        <path d=${`M${o}Z`} fill=${Ti} fill-opacity="0.06" stroke="none" />
        <path d=${n} fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="3.5" stroke-dasharray="7 5" />
        <path d=${n} fill="none" stroke=${Ti} stroke-width="1.6" stroke-dasharray="7 5" stroke-opacity="0.9" />
        ${t.openings.map(i=>{let r=e.toScreen(i.a),a=e.toScreen(i.b);return H`<line x1=${$(r[0])} y1=${$(r[1])} x2=${$(a[0])} y2=${$(a[1])} stroke=${Ti} stroke-width="4" stroke-opacity="0.85"
            stroke-dasharray=${i.kind==="window"?"2 3":"none"} />`})}
      </g>`})}issueMarks(e){return e.doc.floors.includes(e.floor)?Vs(e.floor).map(t=>{let[o,n]=e.toScreen(t.where);if(t.kind==="offSquare"){let l=/(\d+)°/.exec(t.title)?.[1]??"";return H`<g class="hme-issue" data-hme=${`issue:${t.id}`} style="cursor:pointer"><title>${t.title} Click to square it.</title>
          <circle cx=${$(o)} cy=${$(n)} r="9" fill="#ffb340" stroke="#fff" stroke-width="2" />
          <g class="hme-tag"><rect x=${$(o+12)} y=${$(n+6)} width="44" height="20" rx="10" fill="#ffb340" />
          <text x=${$(o+34)} y=${$(n+20)} fill="#2a1a00" text-anchor="middle">${l}°</text></g></g>`}let i=`${Math.round(t.amount*100)} cm`,r=t.kind==="overlap"?`Overlap ${i} \xB7 ${t.fixLabel}`:t.kind==="gap"?`Gap ${i} \xB7 ${t.fixLabel}`:`No door \xB7 ${t.fixLabel}`,a=r.length*6.2+18,d=t.kind==="missingDoor";return H`<g class="hme-issue" data-hme=${`issue:${t.id}`} style="cursor:pointer"><title>${t.title} ${t.detail}</title>
        <circle cx=${$(o)} cy=${$(n)} r="4" fill=${d?"#8e8e93":"#ffb340"} />
        <g class="hme-tag"><rect x=${$(o-a/2)} y=${$(n+8)} width=${$(a)} height="20" rx="10" fill=${d?"#8e8e93":"#ffb340"} />
        <text x=${$(o)} y=${$(n+22)} fill=${d?"#fff":"#2a1a00"} text-anchor="middle">${r}</text></g></g>`}):[]}roomHandles(e,t){let o=B(t),n=e.selection,i=this.pickedWall(e,t),r=[];if(i!==void 0&&o[i]!==void 0){let d=o[i],l=e.toScreen(d.a),p=e.toScreen(d.b),h=Xs(t,d);if(r.push(H`<line x1=${$(l[0])} y1=${$(l[1])} x2=${$(p[0])} y2=${$(p[1])} stroke="#5b8def" stroke-width="9" stroke-linecap="round" pointer-events="none" />`),n?.kind==="wall"&&!this.dragging){let c=[(l[0]+p[0])/2+h[0]*22,(l[1]+p[1])/2+h[1]*22];r.push(H`<g class="hme-tag" pointer-events="none"><rect x=${$(c[0]-27)} y=${$(c[1]-9)} width="54" height="18" rx="9" fill="#5b8def" />
          <text x=${$(c[0])} y=${$(c[1]+4)} fill="#fff" text-anchor="middle">${He(d).toFixed(2)} m</text></g>`)}}for(let[d,l]of t.openings.entries()){let p=e.toScreen(l.a),h=e.toScreen(l.b),c=n?.kind==="opening"&&n.opening===d,u=l.kind==="window"?"#8bb8f0":l.kind==="door"?"#ece6da":"#98989d";if(r.push(H`<g data-hme=${`opening:${d}`} style="cursor:ew-resize">
        <line x1=${$(p[0])} y1=${$(p[1])} x2=${$(h[0])} y2=${$(h[1])} stroke=${c?"#5b8def":"rgba(14,14,16,0.9)"} stroke-width="12" stroke-linecap="round" />
        <line x1=${$(p[0])} y1=${$(p[1])} x2=${$(h[0])} y2=${$(h[1])} stroke=${u} stroke-width="3" />
      </g>`),c){let b=Math.abs(h[0]-p[0])>=Math.abs(h[1]-p[1])?"ew-resize":"ns-resize";for(let[f,y]of[[0,p],[1,h]])r.push(H`<circle data-hme=${`end:${d}:${f}`} cx=${$(y[0])} cy=${$(y[1])} r="8" fill="#fff" stroke="#5b8def" stroke-width="2.5" style=${`cursor:${b}`}><title>Drag to make it wider or narrower</title></circle>`)}}let a=this.sliding!==void 0&&k(this.sliding.roomId,t.id)?this.sliding.index:n?.kind==="opening"?n.opening:void 0;if(a!==void 0&&t.openings[a]!==void 0&&r.push(this.distances(e,t,t.openings[a])),!this.dragging||this.sliding===void 0){if(this.tool==="select")for(let[d,l]of o.entries()){if(He(l)*e.view.scale<40)continue;let p=e.toScreen([(l.a[0]+l.b[0])/2,(l.a[1]+l.b[1])/2]);r.push(H`<circle data-hme=${`mid:${d}`} cx=${$(p[0])} cy=${$(p[1])} r="5" fill="#0e0e10" stroke="#5b8def" stroke-width="1.5" style="cursor:copy"><title>Drag to add a corner</title></circle>`)}for(let[d,l]of t.outline.entries()){let[p,h]=e.toScreen(l),c=n?.kind==="corner"&&n.corner===d;r.push(H`<circle data-hme=${`corner:${d}`} cx=${$(p)} cy=${$(h)} r="7" fill=${c?"#5b8def":"#fff"} stroke=${c?"#fff":"#5b8def"} stroke-width="2" style="cursor:move" />`)}}return H`<g class="hme-handles">${r}</g>`}distances(e,t,o){let n=vt(t,o),i=n>=0?B(t)[n]:void 0;if(i===void 0)return H``;let r=He(i),a=mt(o.a,i.a,i.b).along,d=mt(o.b,i.a,i.b).along,l=Math.max(0,Math.min(a,d)),p=Math.min(r,Math.max(a,d)),h=Xs(t,i),c=[(i.b[0]-i.a[0])/r,(i.b[1]-i.a[1])/r],u=v=>{let M=e.toScreen([i.a[0]+c[0]*v,i.a[1]+c[1]*v]);return[M[0]+h[0]*26,M[1]+h[1]*26]},b=[0,l,p,r],f=v=>`M${rt([v[0]-h[0]*5,v[1]-h[1]*5])}L${rt([v[0]+h[0]*5,v[1]+h[1]*5])}`,y=[[0,l,!1],[l,p,!0],[p,r,!1]];return H`<g class="hme-dist" pointer-events="none">
      <path d=${`M${rt(u(0))}L${rt(u(r))}${b.map(v=>f(u(v))).join("")}`} stroke="#98989d" stroke-width="1" fill="none" />
      ${y.filter(([v,M])=>M-v>.02).map(([v,M,x])=>{let w=u((v+M)/2);return H`<g class="hme-tag"><rect x=${$(w[0]-25)} y=${$(w[1]-9)} width="50" height="18" rx="9" fill=${x?"#5b8def":"#2c2c2e"} />
          <text x=${$(w[0])} y=${$(w[1]+4)} fill="#fff" text-anchor="middle">${(M-v).toFixed(2)} m</text></g>`})}
    </g>`}ghost(e){let t=this.hoverAt;if(t===void 0)return[];let o=[];if(this.tool==="door"||this.tool==="window"||this.tool==="opening"){let n=qs(e,t,Bs,this.focus(e));if(n!==void 0){let i=this.tool==="window"?1.2:.9,r=He(n.seg),a=Math.min(i,r),d=Math.min(Math.max(mt(t,n.seg.a,n.seg.b).along,a/2),r-a/2),l=[(n.seg.b[0]-n.seg.a[0])/r,(n.seg.b[1]-n.seg.a[1])/r],p=e.toScreen([n.seg.a[0]+l[0]*(d-a/2),n.seg.a[1]+l[1]*(d-a/2)]),h=e.toScreen([n.seg.a[0]+l[0]*(d+a/2),n.seg.a[1]+l[1]*(d+a/2)]);o.push(H`<line x1=${$(p[0])} y1=${$(p[1])} x2=${$(h[0])} y2=${$(h[1])} stroke="#5b8def" stroke-width="10" stroke-opacity="0.6" stroke-linecap="round" pointer-events="none" />`)}}if(this.tool==="stairs"&&V(e.floor,t)!==void 0){let[n,i]=e.toScreen(t),r=e.px(1),a=e.px(2.6);o.push(H`<g pointer-events="none" opacity="0.7"><rect x=${$(n-r/2)} y=${$(i-a/2)} width=${$(r)} height=${$(a)} fill="none" stroke="#5b8def" stroke-width="1.5" stroke-dasharray="4 3" />
        ${[1,2,3,4,5,6,7].map(d=>H`<line x1=${$(n-r/2)} x2=${$(n+r/2)} y1=${$(i-a/2+a*d/8)} y2=${$(i-a/2+a*d/8)} stroke="#5b8def" stroke-width="1" />`)}</g>`)}if((this.tool==="split"||this.tool==="inner")&&this.first!==void 0){let n=e.toScreen(this.first.a),i=e.toScreen(this.snap(e,t,this.first.a));if(this.tool==="split"){let r=Math.max(Math.hypot(i[0]-n[0],i[1]-n[1]),1e-6),a=[(i[0]-n[0])/r,(i[1]-n[1])/r],d=Math.hypot(e.stage.width,e.stage.height);o.push(H`<line x1=${$(n[0]-a[0]*d)} y1=${$(n[1]-a[1]*d)} x2=${$(n[0]+a[0]*d)} y2=${$(n[1]+a[1]*d)} stroke="#5b8def" stroke-width="1.5" stroke-dasharray="6 4" pointer-events="none" />`)}else o.push(H`<line x1=${$(n[0])} y1=${$(n[1])} x2=${$(i[0])} y2=${$(i[1])} stroke="#ece6da" stroke-width=${$(Math.max(e.px(.1),3))} stroke-opacity="0.8" pointer-events="none" />`);o.push(H`<circle cx=${$(n[0])} cy=${$(n[1])} r="5" fill="#5b8def" pointer-events="none" />`)}return o}snap(e,t,o){return si(e.floor,t,e.view.scale,{...o===void 0?{}:{from:o},...e.toggles.grid?{grid:Ke}:{}})}pointerDown(e,t,o){if(t.button!==0)return!1;switch(this.tool){case"door":case"window":case"opening":{let n=qs(e,o,Bs,this.focus(e));if(n===void 0)return!1;let i=this.tool,r=n.room.id,a={kind:"opening",roomId:r,opening:n.room.openings.length},d=n.wall;return e.apply(l=>Ro(l,r,d,{kind:i,at:o}),{select:a})&&this.placed(e,a),!0}case"stairs":{let n=V(e.floor,o);if(n===void 0)return!1;let i=n.id,r={kind:"room",roomId:i};return e.apply(a=>Rr(a,i,o),{select:r})&&this.placed(e,r),!0}case"split":case"inner":return this.twoPoints(e,o);default:return!1}}twoPoints(e,t){if(this.first===void 0){let r=V(e.floor,t)??this.focus(e);return r===void 0?!1:(this.first={roomId:r.id,a:this.snap(e,t)},e.select({kind:"room",roomId:r.id}),!0)}let{roomId:o,a:n}=this.first,i=this.snap(e,t,n);if(this.first=void 0,Math.hypot(i[0]-n[0],i[1]-n[1])<.1)return e.redraw(),!0;if(this.tool==="inner"){let r=e.doc.floors.flatMap(d=>d.rooms).find(d=>k(d.id,o)),a={kind:"wall",roomId:o,wall:r===void 0?0:Hn(r).length};return e.apply(d=>Ur(d,o,n,i),{select:a})?this.placed(e,a):e.note("err","An inner wall needs to be at least 10 cm long."),!0}return this.split(e,o,n,i),!0}async split(e,t,o,n){let i=e.floor.rooms.find(l=>k(l.id,t)),r=await e.ask({title:"Name the new room",label:"Name",value:i===void 0?"Room":`${C(i)} 2`,ok:"Split the room"});if(r===void 0)return;let a=e.newId(),d={kind:"room",roomId:a};e.apply(l=>Gr(l,t,o,n,a,r),{select:d})?(this.setTool(e,"select"),e.select(d)):e.note("err","That line does not cut the room in two. Draw it right across the room.")}pressHandle(e,t){let o=this.pieceRoom(e),n=t.target?.closest?.("[data-hme]")?.getAttribute("data-hme")??"",[i,r]=n.split(/:(.*)/s);if(i==="issue"){let d=Vs(e.floor).find(l=>l.id===r);return d!==void 0&&e.apply(l=>d.fix(l)),!0}if(i==="end"&&o!==void 0&&r!==void 0){let[d,l]=r.split(":").map(Number);return Number.isInteger(d)&&(l===0||l===1)&&this.endDrag(e,t,o,d,l),!0}let a=Number(r);if(o===void 0||!Number.isInteger(a))return!1;if(i==="corner")this.cornerDrag(e,t,o,a);else if(i==="mid")this.midDrag(e,t,o,a);else if(i==="opening")this.openingDrag(e,t,o,a);else return!1;return!0}pressPiece(e,t,o){if(t.shiftKey||t.metaKey||t.ctrlKey||t.altKey)return!1;let n=li(e.floor,e.toScreen,o,ne(e.selection));if(n===void 0)return!1;let i=e.floor.rooms.find(a=>k(a.id,n.roomId));if(i===void 0)return!1;if(n.kind==="opening")return this.openingDrag(e,t,i,n.opening),!0;let r=B(i)[n.wall];return this.wallAt=r===void 0?void 0:mt(o,r.a,r.b).point,e.select(n),!0}cornerTo(e,t,o,n){let i=e.floor.rooms.filter(d=>!k(d.id,t.id)).flatMap(d=>d.outline),r=10/e.view.scale;for(let d of i)if(Math.hypot(d[0]-n[0],d[1]-n[1])<=r)return[d[0],d[1]];let a=n;if(e.toggles.grid&&(a=[Math.round(a[0]/Ke)*Ke,Math.round(a[1]/Ke)*Ke]),e.toggles.snap){let d=fr(e.floor.rooms.flatMap(y=>Hn(y))),l=Math.cos(d),p=Math.sin(d),h=y=>[y[0]*l+y[1]*p,-y[0]*p+y[1]*l],[c,u]=h(a),b=t.outline.length,f=8/e.view.scale;for(let y of[(o+b-1)%b,(o+1)%b]){let[v,M]=h(t.outline[y]);Math.abs(c-v)<=f&&(c=v),Math.abs(u-M)<=f&&(u=M)}a=[c*l-u*p,c*p+u*l]}return a}cornerDrag(e,t,o,n){let i=o.id,r;e.drag(t,{move:a=>{this.dragging=!0;let d=this.cornerTo(e,o,n,a);r=d,e.preview(l=>wt(l,i,n,d))},end:(a,d,l)=>{this.dragging=!1,e.preview(void 0);let p=r,h={kind:"corner",roomId:i,corner:n};l&&p!==void 0?e.apply(c=>wt(c,i,n,p),{select:h}):e.select(h)},cancel:()=>this.stopDrag(e)})}midDrag(e,t,o,n){let i=o.id,r=B(o)[n],a=So(e.doc,i,n),d=a?.floors.flatMap(u=>u.rooms).find(u=>k(u.id,i));if(r===void 0||a===void 0||d===void 0)return;let l=[(r.a[0]+r.b[0])/2,(r.a[1]+r.b[1])/2],p=d.outline.reduce((u,b,f)=>Math.hypot(b[0]-l[0],b[1]-l[1])<Math.hypot(d.outline[u][0]-l[0],d.outline[u][1]-l[1])?f:u,0),h=u=>b=>{let f=So(b,i,n);return f===void 0||u===void 0?f:wt(f,i,p,u)},c;e.drag(t,{move:u=>{this.dragging=!0,c=this.cornerTo(e,d,p,u),e.preview(h(c))},end:(u,b,f)=>{this.dragging=!1,e.preview(void 0),e.apply(h(f?c:void 0),{select:{kind:"corner",roomId:i,corner:p}})},cancel:()=>this.stopDrag(e)})}endDrag(e,t,o,n,i){let r=o.id,a=Ze(o,n),d=a===void 0?void 0:B(o)[a.wall];if(a===void 0||d===void 0)return;let l=i===0===a.forward?-1:1,p=u=>zo(a,{x:l,z:0},mt(u,d.a,d.b).along-(l<0?a.from:a.to),0,!1),h,c={kind:"opening",roomId:r,opening:n};e.drag(t,{move:u=>{this.dragging=!0,this.sliding={roomId:r,index:n};let b=p(u);h=b,e.preview(f=>Pe(f,r,n,b))},end:()=>{this.dragging=!1,this.sliding=void 0,e.preview(void 0);let u=h;u!==void 0&&e.apply(b=>Pe(b,r,n,u),{select:c})},cancel:()=>this.stopDrag(e)})}faceDrag(e,t){let{pick:o,part:n,ds:i,dz:r,done:a}=t,d=o.roomId,l=e.doc.floors.flatMap(h=>h.rooms).find(h=>k(h.id,d));if(l===void 0)return;let p;if(o.kind==="wall"){let h=Math.round(Math.min(Math.max(l.height+r,.5),20)*100)/100;this.sizeTag=`Height ${h.toFixed(2)} m`,p=c=>zt(c,d,h)}else{let h=o.opening,c=Ze(l,h),u=l.openings[h];if(c===void 0||u===void 0)return;let b=c.forward?1:-1,f=zo(c,{x:n.x*b,z:n.z},i*b,r,u.kind!=="window");this.sizeTag=`${(f.to-f.from).toFixed(2)} \xD7 ${(f.z1-f.z0).toFixed(2)} m`,p=y=>Pe(y,d,h,f)}if(!a){e.preview(p);return}this.sizeTag=void 0,e.preview(void 0),e.apply(p)}openingDrag(e,t,o,n){let i=o.id,r=o.openings[n];if(r===void 0)return;let a={kind:"opening",roomId:i,opening:n},d=[(r.a[0]+r.b[0])/2,(r.a[1]+r.b[1])/2],l,p;e.select(a),e.drag(t,{move:h=>{l??=h,this.dragging=!0,this.sliding={roomId:i,index:n};let c=[d[0]+h[0]-l[0],d[1]+h[1]-l[1]];p=c,e.preview(u=>_n(u,i,n,c))},end:(h,c,u)=>{this.dragging=!1,this.sliding=void 0,e.preview(void 0);let b=p;u&&b!==void 0?e.apply(f=>_n(f,i,n,b),{select:a}):u||this.onOpeningClick?.(e,i,n)},cancel:()=>this.stopDrag(e)})}stopDrag(e){this.dragging=!1,this.sliding=void 0,e.preview(void 0)}hover(e,t){this.tool!=="select"&&(this.hoverAt=t,e.redraw())}keyDown(e,t){let o=Z(t,!1);if(o==="cancel"&&(this.tool!=="select"||this.first!==void 0))return this.setTool(e,"select"),!0;let n=e.selection;if(o==="cancel"&&oe(n))return e.select({kind:"room",roomId:n.roomId}),!0;if(o==="delete"){let i=e.selection;if(i?.kind==="corner")e.apply(r=>Io(r,i.roomId,i.corner),{select:{kind:"room",roomId:i.roomId}});else if(i?.kind==="opening")e.apply(r=>Do(r,i.roomId,i.opening),{select:{kind:"room",roomId:i.roomId}});else if(i?.kind==="wall")e.apply(r=>Ln(r,i.roomId,i.wall),{select:{kind:"room",roomId:i.roomId}});else return!1;return!0}return!1}cursor(){return this.tool==="select"?void 0:"crosshair"}leave(e){this.first=void 0,this.hoverAt=void 0,this.dragging=!1,this.sliding=void 0,this.tool="select",e.redraw()}viewItems(e){return e.scans===void 0?[]:[{label:"Show scan as it was",on:e.toggles.scan,title:Us,flip:()=>e.setToggle("scan",!e.toggles.scan)}]}pill(e){if(this.tool!=="select"){let a={split:this.first===void 0?"Click where the cut starts":"Click where it ends, across the room",inner:this.first===void 0?"Click where the wall starts":"Click where it ends",door:"Click a wall to put a door in it",window:"Click a wall to put a window in it",opening:"Click a wall to open a way through it",stairs:"Click in the room to put stairs there"};return m`<span class="hme-pill-name">${a[this.tool]}</span>
        <button type="button" class="hme-tb" @click=${()=>this.setTool(e,"select")}>Cancel</button>`}let t=this.pieceRoom(e),o=e.selection;if(t===void 0||o===void 0||this.dragging)return g;let n=t.id,i=C(t),r=m`<button type="button" class="hme-tb" title="Pick the room (Esc)" @click=${()=>e.select({kind:"room",roomId:n})}>${i} ›</button>`;if(o.kind==="wall"){let a=o.wall,d=this.wallAt,l=Jt(t,a,i).replace(", "," \xB7 ");return m`<span class="hme-pill-name">${l}</span>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(e,t,a,"window",d)}>＋ Window here</button>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(e,t,a,"door",d)}>＋ Door here</button>
        <button type="button" class="hme-tb" @click=${()=>this.cornerHere(e,t,a,d)}>Add a corner</button>
        ${r}`}if(o.kind==="corner")return m`<span class="hme-pill-name">${i} · corner</span>
        <button type="button" class="hme-tb" ?disabled=${t.outline.length<=3} @click=${()=>e.apply(a=>Io(a,n,o.corner),{select:{kind:"room",roomId:n}})}>Remove corner</button>
        ${r}`;if(o.kind==="opening"){let a=t.openings[o.opening];return a===void 0?g:m`<span class="hme-pill-name">${eo(a)}</span>
        <button type="button" class="hme-tb danger" @click=${()=>e.apply(d=>Do(d,n,o.opening),{select:{kind:"room",roomId:n}})}>Remove</button>
        ${r}`}return g}addHere(e,t,o,n,i){let r=t.id,a=t.openings.length;e.apply(d=>Ro(d,r,o,{kind:n,...i===void 0?{}:{at:i}}),{select:{kind:"opening",roomId:r,opening:a}})}cornerHere(e,t,o,n){let i=t.id,r=h=>So(h,i,o,n),a=r(e.doc)?.floors.flatMap(h=>h.rooms).find(h=>k(h.id,i)),d=B(t)[o],l=n??(d===void 0?void 0:[(d.a[0]+d.b[0])/2,(d.a[1]+d.b[1])/2]),p=a===void 0||l===void 0?-1:a.outline.reduce((h,c,u)=>Math.hypot(c[0]-l[0],c[1]-l[1])<Math.hypot(a.outline[h][0]-l[0],a.outline[h][1]-l[1])?u:h,0);e.apply(r,{select:p<0?{kind:"room",roomId:i}:{kind:"corner",roomId:i,corner:p}})}inspector(e){let t=this.pieceRoom(e),o=e.selection;if(t===void 0||o===void 0)return m``;let n=t.id;if(o.kind==="corner")return this.cornerCard(e,t,o.corner);let i=this.pickedWall(e,t);if(i===void 0)return m``;let r=B(t)[i],a=He(r),d=p=>{let h=t.openings.length;e.apply(c=>Ro(c,n,i,{kind:p}),{select:{kind:"opening",roomId:n,opening:h}})},l=Jt(t,i,C(t));return m`
      ${o.kind==="wall"?m`<section class="hme-card hme-head"><div class="hme-head-t"><strong>Wall</strong><span>${l}</span></div></section>`:g}
      <section class="hme-card">
        <div class="hme-h">${o.kind==="wall"?"This wall":`The wall: ${l}`}</div>
        ${o.kind==="wall"?this.wallPicture(e,t,i,void 0):g}
        ${Se(N({tag:"Length",label:"Length",value:a,unit:"m",min:.1,max:200,set:p=>e.apply(h=>Kr(h,n,i,p))}),N({tag:"Height",label:"Wall height",value:t.height,unit:"m",min:.5,max:20,set:p=>e.apply(h=>zt(h,n,p))}),N({tag:"Thick",label:"Thickness",value:r.t,unit:"m",min:.01,max:1,set:p=>e.apply(h=>Wr(h,n,i,p))}))}
        ${Q("Type a length to move the far corner. Rooms that share the corner move with it.")}
        <div class="hme-add3">
          <button type="button" class="hme-tb" @click=${()=>d("door")}>＋ Door</button>
          <button type="button" class="hme-tb" @click=${()=>d("window")}>＋ Window</button>
          <button type="button" class="hme-tb" @click=${()=>d("opening")}>＋ Way through</button>
        </div>
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${()=>e.apply(p=>Br(p,n,i))}>Straighten</button>
          <button type="button" class="hme-tb" @click=${()=>e.apply(p=>Nt(p,n))}>Square the corners</button>
          <button type="button" class="hme-tb" @click=${()=>this.cornerHere(e,t,i,void 0)}>Split wall</button>
          <button type="button" class="hme-tb danger" title="Take this wall away" @click=${()=>e.apply(p=>Ln(p,n,i),{select:{kind:"room",roomId:n}})}>Remove</button>
        </div>
      </section>`}wallPicture(e,t,o,n){let i=B(t)[o],r=Math.max(He(i),.01),a=t.height>0?t.height:2.4,d=Math.abs(i.b[0]-i.a[0])>=Math.abs(i.b[1]-i.a[1])?i.a[0]>i.b[0]:i.a[1]>i.b[1],l=320,p=14,h=24,c=Math.min((l-p*2)/r,120/a),u=r*c,b=a*c,f=(l-u)/2,y=h+b+26,v=h+b,M=S=>f+(d?r-S:S)*c,x=S=>v-S*c,w=t.id,P=(S,E,A)=>{let q=Ze(t,E),K=t.openings[E],Y=S.currentTarget.closest("svg");if(q===void 0||K===void 0||Y===null||S.button!==0)return;S.preventDefault(),S.stopPropagation();let ke=Y.getBoundingClientRect().width/l||1,re={x:S.clientX,y:S.clientY},Re={x:d?-A.x:A.x,z:A.z},Be,De=Ae=>{let $e=(Ae.clientX-re.x)/ke/c,at=-(Ae.clientY-re.y)/ke/c;if(Be===void 0&&Math.hypot($e,at)*ke*c<3)return;let st=zo(q,Re,d?-$e:$e,at,K.kind!=="window");Be=st,e.preview(St=>Pe(St,w,E,st))},Ue=()=>{window.removeEventListener("pointermove",De),window.removeEventListener("pointerup",Ue),window.removeEventListener("pointercancel",Ue),e.preview(void 0);let Ae=Be;Ae!==void 0&&e.apply($e=>Pe($e,w,E,Ae))};window.addEventListener("pointermove",De),window.addEventListener("pointerup",Ue),window.addEventListener("pointercancel",Ue)},_=t.openings.flatMap((S,E)=>{if(vt(t,S)!==o)return[];let A=Ze(t,E);if(A===void 0)return[];let q=Math.min(M(A.from),M(A.to)),K=Math.max(M(A.from),M(A.to)),Y=x(A.z1),ke=x(A.z0),re=n===E,Re=S.kind==="window"?"rgba(139,184,240,0.55)":"#121214";return[H`<rect class="hme-wp-o ${re?"on":""}" x=${$(q)} y=${$(Y)} width=${$(K-q)} height=${$(ke-Y)} rx="1.5" fill=${Re} stroke=${re?"#5b8def":"#6e6e73"} stroke-width=${re?2:1}
        style=${re?"cursor:move":"cursor:pointer"}
        @pointerdown=${Be=>{re&&P(Be,E,{x:0,z:0})}}
        @click=${()=>{re||e.select({kind:"opening",roomId:w,opening:E})}}><title>${eo(S)}</title></rect>`]}),I=n===void 0?void 0:Ze(t,n),z=[];if(I!==void 0&&n!==void 0){let S=t.openings[n],E=Math.min(M(I.from),M(I.to)),A=Math.max(M(I.from),M(I.to)),q=x(I.z1),K=x(I.z0),Y=(E+A)/2,ke=(q+K)/2,re=S.kind!=="window",Re=($e,at,st,St)=>H`<circle class="hme-wp-h" cx=${$($e)} cy=${$(at)} r="5.5" fill="#fff" stroke="#5b8def" stroke-width="2" style=${`cursor:${St}`}
        @pointerdown=${Mn=>P(Mn,n,st)}></circle>`,Be=[Re(E,ke,{x:-1,z:0},"ew-resize"),Re(A,ke,{x:1,z:0},"ew-resize"),Re(Y,q,{x:0,z:1},"ns-resize"),...re?[]:[Re(Y,K,{x:0,z:-1},"ns-resize")]],De=($e,at,st,St,Mn=!1)=>H`<text x=${$($e)} y=${$(at)} text-anchor=${St} class=${Mn?"hme-wp-t strong":"hme-wp-t"}>${st}</text>`;z.push(De(Y,Math.max(q-8,12),`${he(I.to-I.from)}`,"middle",!0));let Ue=(E-f)/c,Ae=(f+u-A)/c;Ue>.03&&z.push(H`<path d=${`M${$(f)} ${$(v+8)}H${$(E)}`} class="hme-wp-dim" />`,De((f+E)/2,v+20,he(Ue),"middle")),Ae>.03&&z.push(H`<path d=${`M${$(A)} ${$(v+8)}H${$(f+u)}`} class="hme-wp-dim" />`,De((A+f+u)/2,v+20,he(Ae),"middle")),z.push(De(A+8,ke+4,he(I.z1-I.z0),"start",!0)),I.z0>.03&&z.push(H`<path d=${`M${$(Y)} ${$(K)}V${$(v)}`} class="hme-wp-dim" />`,De(Y+5,(K+v)/2+4,he(I.z0),"start")),z.push(...Be)}return m`<svg class="hme-wp" viewBox=${`0 0 ${l} ${y.toFixed(0)}`} role="img" aria-label=${`${Jt(t,o,C(t))}, seen square on`}>
      ${H`<rect x=${$(f)} y=${$(h)} width=${$(u)} height=${$(b)} rx="2" class="hme-wp-wall" />
        <line x1=${$(f-8)} x2=${$(f+u+8)} y1=${$(v)} y2=${$(v)} class="hme-wp-floor" />`}
      ${_}${z}
    </svg>`}openingCardOf(e){let t=this.pieceRoom(e),o=e.selection,n=o?.kind==="opening"?t?.openings[o.opening]:void 0;return t===void 0||o?.kind!=="opening"||n===void 0?g:this.openingCard(e,t,o.opening,n)}openingCard(e,t,o,n){let i=t.id,r=eo(n),a=Ze(t,o),d=a?.wall??-1,l=B(t)[d],p=n.kind!=="window",h=l===void 0?!1:Math.abs(l.b[0]-l.a[0])>=Math.abs(l.b[1]-l.a[1])?l.a[0]>l.b[0]:l.a[1]>l.b[1],c=l===void 0||Math.abs(l.b[0]-l.a[0])>=Math.abs(l.b[1]-l.a[1]),u=P=>({set:_=>{e.apply(I=>Pe(I,i,o,P(_)))},preview:_=>e.preview(_===void 0?void 0:I=>Pe(I,i,o,P(_)))}),b=m`<div class="hme-pics hme-kinds">${tl.map(P=>ie({label:P.label,picture:il[P.label],on:n.kind===P.kind&&n.style===P.style,click:()=>e.apply(_=>Vr(_,i,o,{kind:P.kind,style:P.style??null}))}))}</div>`,f=m`<button type="button" class="hme-tb danger" @click=${()=>e.apply(P=>Do(P,i,o),{select:{kind:"room",roomId:i}})}>Remove ${r.toLowerCase()}</button>`,y=m`<section class="hme-card hme-head"><div class="hme-head-t"><strong>${r}</strong>
      <span>${d>=0?Jt(t,d,C(t)):C(t)}</span></div></section>`;if(a===void 0||l===void 0)return m`${y}${L("Kind",b)}<section class="hme-card"><div class="hme-row-end">${f}</div></section>`;let v=a.to-a.from,M=a.z1-a.z0,x=h?a.length-a.to:a.from,w=(a.length-v)/2;return m`${y}
      <section class="hme-card">
        <div class="hme-h">Size and place</div>
        ${this.wallPicture(e,t,d,o)}
        ${Se(N({tag:"Width",label:"Width",value:v,unit:"m",min:.2,max:a.length,...u(P=>({...a,from:a.from,to:Math.min(a.from+P,a.length)}))}),N({tag:"Height",label:"Tall",value:M,unit:"m",min:.1,max:a.height,...u(P=>({...a,z1:Math.min(a.z0+P,a.height)}))}))}
        ${Se(N({tag:c?"From left":"From top",label:c?"From the left":"From the top",value:x,unit:"m",min:0,max:a.length-v,...u(P=>h?{...a,from:a.length-P-v,to:a.length-P}:{...a,from:P,to:P+v})}),N({tag:"From floor",label:"From floor",value:a.z0,unit:"m",min:0,max:a.height-M,disabled:p,...u(P=>({...a,z0:P,z1:P+M}))}))}
        <div class="hme-row-end">
          <button type="button" class="hme-tb" title="Put it in the middle of its wall" @click=${()=>e.apply(P=>Pe(P,i,o,{...a,from:w,to:w+v}))}>Center on wall</button>
          ${f}
        </div>
        ${Q("Drag a white dot on the picture to resize it, or the shape to move it. It works on the plan and in 3D too.",!0)}
      </section>
      ${L("Kind",b)}`}cornerCard(e,t,o){let n=t.id,i=t.outline[o];if(i===void 0)return m``;let r=e.floor.rooms.filter(a=>!k(a.id,n)&&a.outline.some(d=>Math.hypot(d[0]-i[0],d[1]-i[1])<=.02));return L("Corner",m`
      ${U("Room",m`<span class="hme-val strong">${C(t)}</span>`)}
      ${U("Left, top",N({label:"Corner left",value:i[0],unit:"m",set:a=>e.apply(d=>wt(d,n,o,[a,i[1]]))}),N({label:"Corner top",value:i[1],unit:"m",set:a=>e.apply(d=>wt(d,n,o,[i[0],a]))}))}
      ${Q(r.length===0?"Drag it on the plan. Drop it on another room's corner and the two move together after.":`Shared with ${r.map(C).join(", ")}, which move${r.length===1?"s":""} with it.`)}
      <div class="hme-row-end indent">
        <button type="button" class="hme-tb" ?disabled=${t.outline.length<=3} @click=${()=>e.apply(a=>Io(a,n,o),{select:{kind:"room",roomId:n}})}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(a=>Nt(a,n))}>Square the corners</button>
      </div>`)}},nl={select:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3z" fill="none" stroke="currentColor" stroke-width="1.4"></path><circle cx="3" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="15" r="2" fill="currentColor"></circle><circle cx="3" cy="15" r="2" fill="currentColor"></circle></svg>`,split:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 3h14v12H2z" fill="none" stroke="currentColor" stroke-width="1.4"></path><path d="M9 1v16" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 2"></path></svg>`,inner:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="2.4"></path></svg>`,door:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 15h4M12 15h4M6 15V5M6 5a10 10 0 0 1 10 10" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`,window:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="1.4"></path><path d="M5 7h8M5 11h8" stroke="#8bb8f0" stroke-width="1.4"></path></svg>`,opening:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h4M12 9h4" stroke="currentColor" stroke-width="2.4"></path></svg>`,stairs:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3zM3 6h12M3 9h12M3 12h12" fill="none" stroke="currentColor" stroke-width="1.2"></path></svg>`},il={Door:m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V4M14 4a17 17 0 0 1 17 17" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Double door":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V7M48 21V7M14 7a14 14 0 0 1 14 14M48 7a14 14 0 0 0-14 14" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Sliding door":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18.5h20M28 23.5h20" stroke="#ece6da" stroke-width="2.4"></path></svg>`,Window:m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 18h34M14 24h34" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Sliding window":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18h20M28 24h20" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Way through":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h10M48 21h10" stroke="#ece6da" stroke-width="4"></path><path d="M14 27h34" stroke="#98989d" stroke-width="1" stroke-dasharray="3 3"></path></svg>`};var ao=[{id:"pick",name:"Pick",label:"Pick and move",key:"v"},{id:"draw",name:"Room",label:"Draw a room",key:"r"},{id:"split",name:"Split",label:"Split the room",key:"s"},{id:"inner",name:"Wall",label:"Inner wall",key:"w"},{id:"door",name:"Door",label:"Door",key:"d"},{id:"window",name:"Window",label:"Window",key:"n"},{id:"opening",name:"Opening",label:"Way through (no door)",key:"o"},{id:"stairs",name:"Stairs",label:"Stairs",key:"t"},{id:"measure",name:"Measure",label:"Measure",key:"m"}],Zs=ao.filter(s=>s.id!=="pick"&&s.id!=="measure");function rl(s){return ao.find(e=>e.key===s.toLowerCase())?.id}function al(s){let e=ta(s);return s.pins.filter(t=>t.entityId.startsWith("light.")&&!e.has(t.id.toUpperCase())).map(t=>t.id)}function sl(s,e){let t=s.hass?.states?.[e]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t.trim():e}var pn=class{constructor(){this.arrange=new tn;this.devices=new sn((e,t,o)=>this.arrange.piecePic(e,Ut(t),o));this.shape=new ln;this.doors=new dn;this.drawOpen=!1;this.arrange.roomDoors=(e,t)=>this.doors.doorsCard(e,t),this.arrange.roomWalls=(e,t)=>this.shape.wallsCard(e,t),this.arrange.roomScan=(e,t)=>this.shape.scanCard(e,t),this.arrange.roomBefore=e=>this.checklistStrip(e),this.arrange.roomTray=(e,t)=>m`${this.devices.trayCard(e,t)}${this.devices.onMapCard(e,t)}`,this.shape.onOpeningClick=(e,t,o)=>this.doors.clicked(e,t,o)}tool(e){if(e.toggles.measure)return"measure";if(this.arrange.draw.active)return"draw";let t=this.shape.tool;return t==="select"?"pick":t}setTool(e,t){if(this.doors.stop(e),this.drawOpen=!1,this.devices.armed=void 0,t==="measure"){this.arrange.draw.stop(),this.shape.setTool(e,"select"),e.setToggle("measure",!e.toggles.measure),e.redraw();return}if(e.toggles.measure&&e.setToggle("measure",!1),t==="draw"){this.shape.setTool(e,"select"),this.arrange.draw.active||this.arrange.draw.start(e);return}this.arrange.draw.stop(e),this.shape.setTool(e,t==="pick"?"select":t)}picksPins(e){return et(e.selection).length>0}overlay(e){return H`${this.arrange.overlay(e)}${this.shape.overlay(e)}${this.doors.overlay(e)}${this.devices.overlay(e)}`}drawsPins(e){return!0}pointerDown(e,t,o){if(this.devices.choosing)return this.devices.cancelChooser(e),!0;if(this.drawOpen&&(this.drawOpen=!1,e.redraw()),this.devices.armed!==void 0&&t.button===0)return this.devices.placeArmed(e,o),!0;if(this.doors.endShow(e),this.doors.active&&t.button===0&&this.doors.pointerDown(e,o))return!0;if(this.arrange.draw.active)return this.arrange.draw.pointerDown(e,t,o);if(this.shape.armed)return this.shape.pointerDown(e,t,o);if(t.button!==0)return!1;if(this.shape.pressHandle(e,t)||this.arrange.pressHandle(e,t,o)||this.devices.pressHandle(e,t,o))return!0;let n=this.devices.heldThingAt(e,o);return n!==void 0&&this.arrange.pressThing(e,t,n,o)?!0:this.devices.pressPin(e,t,o)||this.devices.pressBox(e,t,o)||this.shape.pressPiece(e,t,o)||this.arrange.pressBody(e,t,o)}hover(e,t){this.arrange.pointer=t,this.arrange.hover(e,t),this.shape.hover(e,t)}keyDown(e,t){if(this.devices.chooserKey(e,t))return!0;let o=Z(t,!1);if(o==="cancel"&&(this.devices.armed!==void 0||this.drawOpen))return this.devices.armed=void 0,this.drawOpen=!1,e.redraw(),!0;let n=typeof o=="object"&&"letter"in o?o.letter:void 0;if(n==="m")return this.setTool(e,"measure"),!0;if(this.doors.keyDown(e,t)||this.arrange.draw.active&&this.arrange.draw.keyDown(e,t))return!0;if(o==="copy"||o==="paste"||o==="duplicate")return this.arrange.clipKey(e,o);if(n==="f")return e.openAdd("furniture"),!0;let i=n===void 0?void 0:rl(n);return i!==void 0?(this.setTool(e,i),!0):o==="cancel"&&this.shape.armed?(this.setTool(e,"pick"),!0):oe(e.selection)||this.shape.armed?this.shape.keyDown(e,t):this.picksPins(e)?this.devices.keyDown(e,t):this.arrange.keyDown(e,t)}cursor(e){return this.arrange.draw.active||this.shape.armed||this.devices.armed!==void 0?"crosshair":void 0}leave(e){this.arrange.leave(e),this.devices.leave(),this.shape.leave(e),this.doors.stop(e),this.drawOpen=!1}dock(e){return this.arrange.dock(e)}viewItems(e){return[...this.arrange.viewItems(e),...this.devices.viewItems(e),...this.shape.viewItems(e)]}pill(e){return this.doors.active?this.doors.pill(e):this.shape.armed||oe(e.selection)?this.shape.pill(e):this.arrange.draw.active?this.arrange.pill(e):this.picksPins(e)?this.devices.pill(e):this.arrange.pill(e)}stageExtra(e){let t=this.devices.stageExtra(e),o=this.devices.armed,n=oe(e.selection)?"Drag a corner \xB7 drag a wall's middle to add a corner \xB7 Esc for the room":"Click picks what is on top: a door, a wall, a thing or a room";return m`${this.toolRail(e)}${this.drawList(e)}${t}
      ${o!==void 0?m`<div class="hme-armed" role="status"><b>${sl(e,o)}</b> Click its place on the plan.
          <button type="button" class="hme-link" @click=${()=>this.devices.arm(e,void 0)}>Stop</button></div>`:t===g&&e.stage.width>=1200?m`<div class="hme-stage-hint">${n}</div>`:g}`}toolRail(e){let t=this.tool(e),o=ao.find(a=>a.id==="pick"),n=ao.find(a=>a.id==="measure"),i=Zs.find(a=>a.id===t),r=a=>m`<button type="button" class="hme-rtool ${t===a.id?"on":""}" aria-pressed=${t===a.id?"true":"false"}
      aria-label=${a.label} title=${`${a.label} (${a.key.toUpperCase()})`} @click=${()=>this.setTool(e,a.id)}>
      ${Ci(a.id)}<span class="hme-rtool-name">${a.name}</span></button>`;return m`<div class="hme-toolrail" role="toolbar" aria-label="Tools" aria-orientation="vertical">
      ${r(o)}
      <span class="hme-rtool-sep" aria-hidden="true"></span>
      <button type="button" class="hme-rtool hme-rtool-draw ${i!==void 0||this.drawOpen?"on":""}" aria-pressed=${i!==void 0?"true":"false"}
        aria-haspopup="menu" aria-expanded=${this.drawOpen?"true":"false"} aria-label=${i===void 0?"Draw":`Draw: ${i.label}`}
        title=${i===void 0?"Draw a room, a wall, a door, a window, a way through or stairs":`${i.label} (${i.key.toUpperCase()})`}
        @click=${()=>{this.drawOpen=!this.drawOpen,e.redraw()}}>
        ${Ci(i?.id??"draw")}<span class="hme-rtool-name">${i?.name??"Draw"} ▾</span></button>
      <span class="hme-rtool-sep" aria-hidden="true"></span>
      ${r(n)}
    </div>`}drawList(e){if(!this.drawOpen)return g;let t=this.tool(e);return m`<div class="hme-drawlist" role="menu" aria-label="Draw">
      ${Zs.map(o=>m`<button type="button" role="menuitemradio" class="hme-drawlist-item ${t===o.id?"on":""}" aria-checked=${t===o.id?"true":"false"}
        title=${`${o.label} (${o.key.toUpperCase()})`} @click=${()=>this.setTool(e,o.id)}>${Ci(o.id)}<span>${o.name}</span><kbd>${o.key.toUpperCase()}</kbd></button>`)}
    </div>`}inspector(e){return m`${this.doors.fitCard(e)}${this.pickedCards(e)}${this.doors.fitFoot(e)}`}trayAbove(e){let t=this.devices.trayRoom,o=e.selection;if(t===void 0||o===void 0)return g;let n=e.floor.rooms.find(a=>k(a.id,t));if(n===void 0)return g;if(!(o.kind==="object"?k(o.roomId,t):o.kind==="pin"?Xt(e.floor,o).some(a=>k(a.id,t)):!1))return g;let r=this.devices.waitingIn(e,n);return r.main.length===0&&r.more.length===0?g:m`${this.devices.trayCard(e,n,`Next in ${C(n)}`)}
      <button type="button" class="hme-link hme-tray-back" @click=${()=>e.select({kind:"room",roomId:n.id})}>‹ ${C(n)}</button>`}pickedCards(e){if(this.picksPins(e))return m`${this.trayAbove(e)}${this.devices.inspector(e)}`;let t=e.selection;if(t===void 0)return this.startPanel(e);if(oe(t)){let n=e.floor.rooms.find(i=>k(i.id,t.roomId));return m`${this.shape.openingCardOf(e)}
        ${n!==void 0&&t.kind==="opening"?this.doors.opensToCard(e,n,t.opening):g}
        ${this.shape.inspector(e)}
        ${n===void 0?g:this.shape.roomCards(e,n)}`}let o=t.kind==="object"?this.devices.thingCards(e,t.roomId,t.object):g;return o===g?this.arrange.inspector(e):m`${this.trayAbove(e)}${o}${this.arrange.inspector(e)}`}checklist(e,t=Mi(e.doc,this.devices.homeDevices(e))){return Ss(t,e.pageStep?.done(e.doc)??!1)}checklistShown(e,t){return rn(t)!==void 0||e.pageStep?.addedAny===!0}checklistStrip(e){let t=this.checklist(e),o=rn(t);return o===void 0?g:m`<button type="button" class="hme-strip" title="Show the whole checklist" aria-label=${`${ki}: ${$i(t)}`}
      @click=${()=>e.select(void 0)}>
      ${t.map(n=>m`<span class="hme-strip-cell ${n.done?"done":n===o?"now":"next"}">
        <b>${n.done?"\u2713 ":""}${n.title}</b>${n===o?m`<small>${n.words}</small>`:g}</span>`)}
    </button>`}placeDevices(e){let t=this.devices.homeDevices(e),o=[e.floor,...e.doc.floors.filter(n=>!k(n.id,e.floor.id))];for(let n of o){let i=n.rooms.find(r=>Tt(r,t,e.doc).main.length>0);if(i!==void 0){k(n.id,e.floor.id)||e.setFloor(n.id),e.select({kind:"room",roomId:i.id});return}}}checklistCard(e){let t=Mi(e.doc,this.devices.homeDevices(e)),o=this.checklist(e,t);if(!this.checklistShown(e,o))return g;let n=rn(o),i=al(e.floor),r=(p,h)=>{let c=p.done?"done":p===n?"now":"next";return m`<div class="hme-step ${c}">
        <span class="hme-step-no" aria-label=${p.done?"Done":`Step ${p.id}`}>${p.done?"\u2713":String(p.id)}</span>
        <div class="hme-step-t"><b>${p.title}</b><span>${p.words}</span>${h}</div>
      </div>`},[a,d,l]=o;return L(ki,m`<div class="hme-steps">
      ${r(a,n===a?m`<button type="button" class="hme-tb hme-blue" @click=${()=>this.startDrawing(e)}>Draw a room</button>`:g)}
      ${r(d,m`${n!==d?g:t.waiting>0?m`<button type="button" class="hme-tb hme-blue" @click=${()=>this.placeDevices(e)}>Place devices</button>`:m`<button type="button" class="hme-tb hme-blue" @click=${()=>e.openAdd("devices")}>Add a device</button>`}
        ${i.length===0?g:m`<span class="hme-step-quiet">${O(i.length,"light")} ${i.length===1?"sits":"sit"} in no lamp.
          <button type="button" class="hme-link" title="Pick every light no lamp holds" @click=${()=>e.select(No(i))}>Show me the loose lights</button></span>`}`)}
      ${r(l,n===l||e.pageStep?.addedAny===!0?this.pageRows(e):g)}
    </div>`,$i(o),"hme-start")}pageRows(e){let t=e.pageStep;if(t===void 0)return m``;let o=t.rows(),n=e.floor.rooms.length>0?e.floor:e.doc.floors.find(i=>i.rooms.length>0);return o.length===0?m`<span class="hme-step-quiet">Pair a watch or an iPhone first.</span>`:m`<div class="hme-pagerows">${o.map(i=>m`<div class="hme-pagerow">
      <div class="hme-pagerow-t"><b>${i.device.name}</b><span>${i.line}</span>
        ${i.note===void 0?g:m`<span class="hme-pagerow-note ${i.note.kind}" role="status">${i.note.text}</span>`}</div>
      ${i.added!==void 0?m`<span class="hme-pagerow-done">Added${e.openPage===void 0?g:m` · <button type="button" class="hme-link" @click=${()=>e.openPage?.(i.added)}>Open it</button>`}</span>`:m`<button type="button" class="hme-tb" aria-label=${`Add a page to ${i.device.name}`} ?disabled=${i.busy||n===void 0}
            @click=${()=>{n!==void 0&&t.add(e.hass,e.doc,n,i.device,r=>e.confirm(r))}}>${i.busy?"Adding\u2026":"Add page"}</button>`}
    </div>`)}</div>`}roomsCard(e){let t=e.floor;return t.rooms.length===0?g:L("Rooms",m`<div class="hme-ly-list">${t.rooms.map(o=>{let n=this.devices.waitingIn(e,o),i=o.areaId!==void 0,r=Rs({hasArea:i,onMap:Ve(t,o.id).length,wait:n.main.length,more:n.more.length}),a={kind:"room",roomId:o.id},d=e.hover?.kind==="room"&&k(e.hover.roomId,o.id);return m`<div class="hme-ly ${d?"hov":""}" @pointerenter=${()=>e.setHover(a)} @pointerleave=${()=>e.setHover(void 0)}>
        <button type="button" class="hme-ly-main" title=${i?"Pick it":"Pick it and give it an area"}
          @click=${()=>{i||ni(vi,!0),e.select(a)}}>
          <span class="hme-thing-ic" aria-hidden="true"></span><span class="hme-ly-nm">${C(o)}</span>
          <span class="hme-ly-end ${n.main.length>0?"wait":""}">${r}</span></button>
      </div>`})}</div>`,String(t.rooms.length),"hme-rooms")}startPanel(e){let t=e.floor;return m`
      ${this.checklistCard(e)}
      ${this.roomsCard(e)}
      ${Ce("floor","Floor",W(t),this.arrange.floorBody(e,t))}
      <section class="hme-card hme-tips-card">
        <details class="hme-tips">
          <summary>Keys and tips <span aria-hidden="true">›</span></summary>
          <p class="hme-text">Click picks what is on top: a device, then a thing (a sofa, a TV, a desk), then the room under them. Drag it to move it.</p>
          <p class="hme-text dim">A dragged room locks to the doors of the rooms round it. Click an amber door, then the door it should meet. Drag the round handle above a room to turn it, or a square handle on its box to resize it. Click a wall, door or window to change it.</p>
          <p class="hme-text dim">Shift, Cmd or Ctrl and a click picks several devices; Cmd or Ctrl and a click picks several things, to colour or hide them together. Pick a room to see its devices that wait: drag one from its tray onto the plan, or click it, then click its place.</p>
          <p class="hme-text dim">Press <kbd>?</kbd> or the ? button in the bar for every key.</p>
          <dl class="hme-keys">
            ${Si(Te()).filter(o=>o.title!=="Mouse").flatMap(o=>o.keys).map(([o,n])=>m`<dt><kbd>${o}</kbd></dt><dd>${n}</dd>`)}
          </dl>
        </details>
      </section>`}sheet(e){let t=this.devices.lampChooser(e);return t===g?this.arrange.sheet(e):t}dragOver(e,t,o){return this.devices.dragOver(e,t,o)}drop(e,t,o){this.devices.drop(e,t,o)}startDrawing(e){this.setTool(e,"draw")}};function Si(s){let e=s?"\u2318":"Ctrl";return[{title:"Tools",keys:ao.map(t=>[t.key.toUpperCase(),t.label])},{title:"Add",keys:[["A","Add a device or furniture"],["F","Add furniture"]]},{title:"Edit",keys:[["Delete","Remove what is picked"],[`${e}${s?"":"+"}C`,"Copy the picked furniture"],[`${e}${s?"":"+"}V`,"Paste it under the pointer, on any floor"],[`${e}${s?"":"+"}D`,"Duplicate the picked furniture"],["Arrows","Nudge it 1 cm, with Shift 10 cm"],["Enter","Close the room being drawn"],["Backspace","Take back the last corner drawn"],["Esc","Back out: Connect, a tool, a wall, door or thing to its room"],[s?"\u2318Z":"Ctrl+Z","Undo"],[s?"\u21E7\u2318Z":"Ctrl+Shift+Z or Ctrl+Y","Redo"]]},{title:"View",keys:[["Space","Hold and drag to pan"],["Middle button","Drag to move the plan or the 3D view"],["+ \u2212","Zoom in and out"],["0","Fit the floor"],["Z","Fit the picked room"],["?","Show or hide these keys"]]},{title:"Mouse",keys:[["Click","Pick what is on top: a device, a door or window, a wall, a thing, then the room"],["Click an amber door","Connect it: then click the door it should meet"],[`Shift or ${e} click`,"Pick several devices"],[`${e} click`,"Pick several things"],["Shift drag","Pick every device in a box"],["Drag in 3D","Turn the model; scroll to zoom"],["Alt drag","Drag a copy of the furniture picked"],["Drag a number","Change it, with Shift in big steps, with Alt in fine ones; click it to type"]]}]}function Ci(s){switch(s){case"pick":return m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 2.5v11.5l3.1-3 2.3 5 2-.9-2.3-4.9h4.4z" fill="currentColor"></path></svg>`;case"draw":return m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 15V3h8l4 4v8z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2.5 2"></path></svg>`;case"measure":return m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14M2 6v6M16 6v6M6 9v-2M9 9V6M12 9v-2" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`;default:return Ys(s)}}var dl=[["lights","Lights"],["sensors","Sensors"],["climate","Climate"],["switches","Switches and plugs"],["media","Media"],["covers","Covers"],["locks","Locks"],["other","Other"]],Ie="*",mn="",Ii=200;function ll(s){switch(ka(s)){case"lights":return"lights";case"sensors":return"sensors";case"climate":return"climate";case"power":return"switches";case"media":return"media";case"covers":return"covers";case"security":return s.startsWith("lock.")?"locks":"other";default:return"other"}}function hn(s){let e=s.selection,t=ne(e);if(t!==void 0)return s.floor.rooms.find(n=>k(n.id,t));if(e?.kind!=="pin")return;let o=s.floor.pins.find(n=>k(n.id,e.pinId));return o===void 0?void 0:xe(s.floor,o)}function Ri(s){return Ne(s.view,[s.stage.width/2,s.stage.height/2])}function pl(s){return hn(s)??V(s.floor,Ri(s))}function hl(s,e){let t=Ri(s);return ee(e.outline,t)?t:X(e)??se(e)}function ml(s,e){return e.trim()===""?s.filter(t=>t.category===void 0&&wa.has(t.domain)):Ma(s,e,1/0)}function cl(s,e){return e===Ie?!0:e===mn?s.areaId===void 0:s.areaId===e}function ul(s,e,t,o){let n=new Map,i=new Map(s.areas.map(h=>[h.id,h.name])),r=0;for(let h of e){if(h.areaId===void 0){r+=1;continue}n.set(h.areaId,(n.get(h.areaId)??0)+1),i.has(h.areaId)||i.set(h.areaId,h.areaName??h.areaId)}let a=[],d=(h,c=!1)=>{h===void 0||h===""||a.includes(h)||!c&&(n.get(h)??0)===0||a.push(h)};d(t,!0);for(let h of s.floor.rooms)d(h.areaId);let l=[...n.keys()].sort((h,c)=>(i.get(h)??h).localeCompare(i.get(c)??c));for(let h of l)d(h);o!==Ie&&d(o,!0);let p=a.map(h=>({id:h,name:i.get(h)??h,count:n.get(h)??0}));return(r>0||o===mn)&&p.push({id:mn,name:"No area",count:r}),p.push({id:Ie,name:"All areas",count:e.length}),p}function Qs(s,e){let t=new Map;for(let o of s){if(!cl(o,e))continue;let n=ll(o.entityId),i=t.get(n);i===void 0&&t.set(n,i=[]),i.push(o)}return dl.filter(([o])=>t.has(o)).map(([o,n])=>({kind:o,label:n,devices:t.get(o)}))}function fl(s,e){if(e.startsWith("light.")){let t=Lo(s,e).length;return t===0?void 0:t===1?"On the map":`${t} on the map`}return Je(s,e)===void 0?void 0:"On the map"}function gl(s){let e=s;e?.focus!==void 0&&setTimeout(()=>e.focus?.(),0)}function bl(s){let e=s;e?.showModal!==void 0&&queueMicrotask(()=>{e.isConnected&&e.open!==!0&&e.showModal?.()})}var cn=class{constructor(e,t){this.devices=e;this.picture=t;this.tab="devices";this.query="";this.area=Ie;this.areaChosen=!1;this.pieceQuery="";this.pieceGroup="";this.focus=!1}open(e,t="devices",o){this.choice=o,this.tab=o===void 0?t:"devices",this.query="",this.pieceQuery="",this.pieceGroup="",this.roomId=void 0,this.area=o===void 0?hn(e)?.areaId??Ie:Ie,this.areaChosen=!1,this.focus=!0}setTab(e,t){this.tab!==t&&(this.tab=t,this.focus=!0,e.redraw())}furnitureRoom(e){let t=pl(e);if(t!==void 0)return t;let o=this.roomId;return o===void 0?void 0:e.floor.rooms.find(n=>k(n.id,o))}addDevice(e,t,o){let n=this.choice;if(n!==void 0){o(),n.pick(t.entityId);return}let i=hn(e)??Bt(e.floor,t.areaId),r=i===void 0?void 0:this.devices.freeSpot(e,i);t.entityId.startsWith("light.")?this.devices.placeLight(e,t.entityId,r??Ri(e)):this.devices.place(e,t.entityId,r,t.areaId),e.redraw()}addPiece(e,t,o){let n=this.furnitureRoom(e);if(n===void 0)return;let i=n.id,r=n.objects.length,a=hl(e,n);o(),e.apply(d=>Ar(d,i,t,a),{select:{kind:"object",roomId:i,object:r}})||e.note("warn","That piece could not be added: a room holds at most 256 things.")}render(e,t){let o=hn(e),n=this.choice,i=n?.title??`Add to ${o===void 0?W(e.floor):C(o)}`,r=this.focus;this.focus=!1;let a=ot(l=>{r&&gl(l)}),d=(l,p)=>m`<button type="button" role="tab" id=${`hma-tab-${l}`} class=${this.tab===l?"on":""}
      aria-selected=${this.tab===l?"true":"false"} aria-controls="hma-panel" @click=${()=>this.setTab(e,l)}>${p}</button>`;return m`<dialog class="hma" aria-labelledby="hma-title" ${ot(bl)}
      @cancel=${l=>{l.preventDefault(),t()}}
      @keydown=${l=>{l.stopPropagation(),l.key==="Escape"&&(l.preventDefault(),t())}}
      @pointerdown=${l=>{l.target===l.currentTarget&&t()}}>
      <div class="hma-in">
        <div class="hma-head">
          <h3 id="hma-title">${i}</h3>
          <button type="button" class="hme-x hma-close" aria-label="Close" title="Close (Esc)" @click=${t}>×</button>
        </div>
        ${n===void 0?m`<div class="hme-seg hma-tabs" role="tablist" aria-label="What to add">${d("devices","Devices")}${d("furniture","Furniture")}</div>`:g}
        <div class="hma-panel" id="hma-panel" role=${n===void 0?"tabpanel":"group"} aria-labelledby=${n===void 0?`hma-tab-${this.tab}`:"hma-title"}>
          ${this.tab==="devices"?this.devicesTab(e,o,t,a):this.furnitureTab(e,t,a)}
        </div>
      </div>
    </dialog>`}devicesTab(e,t,o,n){let i=e.hass?.states,r=this.choice,a=Qe(e.hass),d=r===void 0?a:a.filter(x=>(!r.lightsOnly||x.domain==="light")&&x.entityId!==r.now),l=ml(d,this.query);!this.areaChosen&&this.area!==Ie&&Qs(l,this.area).every(x=>x.devices.length===0)&&(this.area=Ie);let p=ul(e,l,t?.areaId,this.area),h=Qs(l,this.area),c=h.reduce((x,w)=>x+w.devices.length,0),u=Ii,b=h.map(x=>{let w=x.devices.slice(0,Math.max(u,0));return u-=w.length,{...x,devices:w}}).filter(x=>x.devices.length>0),f=this.area===Ie?"in any area":this.area===mn?"with no area":`in ${p.find(x=>x.id===this.area)?.name??"this area"}`,y=this.query.trim()!=="",v=r?.lightsOnly===!0?"light":"device",M=Ei();return m`
      ${r===void 0?m`<div class="hma-lamp"><span>Lights go in</span>${ve({label:"Lights go in",value:M,options:ct.map(x=>({value:x,label:js[x]})),set:x=>{Pi(x),e.redraw()}})}</div>`:g}
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find a ${v}" aria-label="Find a ${v}" autofocus .value=${G(this.query)} ${n}
          @input=${x=>{this.query=x.target.value,e.redraw()}} /></label>
      <div class="hme-chips hma-chips" role="group" aria-label="Areas">
        ${p.map(x=>{let w=x.id===this.area;return m`<button type="button" class="hme-chip sel ${w?"on":""}" aria-pressed=${w?"true":"false"}
            @click=${()=>{this.area=x.id,this.areaChosen=!0,e.redraw()}}>${x.name}<span class="hma-n">${x.count}</span></button>`})}
      </div>
      <div class="hma-list">
        ${c===0?m`<p class="hma-empty">${y?`Nothing by that name ${f}.`:`No ${v}s ${f}.`}</p>`:g}
        ${b.map(x=>m`<section class="hma-sec">
          <div class="hme-h">${x.label}<span class="hme-h-end">${x.devices.length}</span></div>
          ${x.devices.map(w=>this.deviceRow(e,w,i,o))}
        </section>`)}
        ${c>Ii?m`<p class="hma-empty">Showing ${Ii} of ${c}. Type to narrow the list.</p>`:g}
      </div>
      <div class="hma-foot">
        <span class="hma-count">${O(c,v)}</span>
        ${r===void 0?m`<button type="button" class="hme-tb hme-blue hma-done" @click=${o}>Done</button>`:g}
      </div>`}deviceRow(e,t,o,n){let i=t.entityId.startsWith("light."),r=fl(e.doc,t.entityId),a=this.choice,d=a!==void 0?a.rowTitle(t.name):i?"Add it in a lamp, the kind Lights go in names. A light can be on the map many times.":r===void 0?"Put it on the map":"On the map: click to pick it",l=be(t.entityId,t.deviceClass,t.name);return m`<button type="button" class="hma-row ${a===void 0&&!i&&r!==void 0?"placed":""}" title=${d}
      @click=${()=>this.addDevice(e,t,n)}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${te(l,"currentColor",24,2)}</svg></span>
      <span class="hma-nm"><span>${t.name}</span><small class="mono">${t.entityId}</small></span>
      <span class="hma-state">${pe(t.entityId,o)}</span>
      ${r===void 0?g:m`<span class="hma-tag">${r}</span>`}
    </button>`}furnitureTab(e,t,o){let n=this.furnitureRoom(e),i=bi(this.pieceQuery,this.pieceGroup).filter(d=>d.pieces.length>0),r=["",...tt.groups],a=d=>tt.pieces.filter(l=>d===""||l.group===d).length;return m`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find a piece: sofa, lamp, desk" aria-label="Find a piece" autofocus .value=${G(this.pieceQuery)} ${o}
          @input=${d=>{this.pieceQuery=d.target.value,e.redraw()}} /></label>
      <div class="hme-chips hma-chips" role="group" aria-label="Groups">
        ${r.map(d=>{let l=d===this.pieceGroup;return m`<button type="button" class="hme-chip sel ${l?"on":""}" aria-pressed=${l?"true":"false"}
            @click=${()=>{this.pieceGroup=d,e.redraw()}}>${d===""?"All":d}<span class="hma-n">${a(d)}</span></button>`})}
      </div>
      ${n===void 0?this.askRoom(e):m`<p class="hma-where">Into <b>${C(n)}</b>: each piece stands against the nearest free wall, facing into the room. Drag it into place after.</p>`}
      <div class="hma-list">
        ${i.length===0?m`<p class="hma-empty">No piece by that name${this.pieceGroup===""?"":` in ${this.pieceGroup}`}.</p>`:g}
        ${i.map(d=>m`<section class="hma-sec">
          <div class="hme-h">${d.title}<span class="hme-h-end">${O(d.pieces.length,"piece")}</span></div>
          <div class="hma-grid">${d.pieces.map(l=>m`<button type="button" class="hme-fcard" ?disabled=${n===void 0}
            title=${`Add ${l.name}, ${ut(l)}`} @click=${()=>this.addPiece(e,l,t)}>
            ${this.picture(e,l,"hme-fcard-pic")}
            <span class="hme-fcard-name">${l.name}</span>
            <span class="hme-fcard-size mono">${ut(l)}</span>
          </button>`)}</div>
        </section>`)}
      </div>`}askRoom(e){return e.floor.rooms.length===0?m`<p class="hma-where warn">Draw or scan a room first, then add its furniture.</p>`:m`<div class="hma-ask">
      <p class="hma-where warn">Which room is it for? Pick one, or pick a room on the plan first.</p>
      <div class="hme-chips hma-chips" role="group" aria-label="Rooms">
        ${e.floor.rooms.map(t=>m`<button type="button" class="hme-chip sel" aria-pressed="false"
          @click=${()=>{this.roomId=t.id,e.redraw()}}>${C(t)}</button>`)}
      </div>
    </div>`}},Js=ho`
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
  .hma-lamp { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--wa-muted); }
  .hma-count { font-size: 12.5px; color: var(--wa-muted); }
  .hma-where { font-size: 12.5px; line-height: 1.4; color: var(--wa-muted); }
  .hma-where b { color: var(--wa-ink); font-weight: 600; }
  .hma-where.warn { color: var(--wa-soft); }
  .hma-ask { display: flex; flex-direction: column; gap: 8px; }
  .hma-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(124px, 1fr)); gap: 8px; padding: 0 2px; }
  .hma-grid .hme-fcard:disabled { opacity: 0.5; cursor: default; }
  .hma-grid .hme-fcard:disabled:hover { border-color: var(--wa-line); background: var(--wa-input); }
`;var vl={iphone:"A full page with the live 3D map.",watch:"A map tile on a page. A tap opens the map."};function wl(s,e){return s===void 0||e===null||e===void 0?!1:s.pages.some(t=>t.owners.length>0&&dt(t.item)&&go(t.item).some(o=>{let n=lt(o);return Ot(n)==="home_map"&&e.floors.some(i=>k(i.id,vo(n)))}))}function yl(s,e){return s.floors.length>1?W(e):"Home map"}function Ml(s,e,t,o){let n=e.toUpperCase();if(s==="iphone")return{schemaVersion:1,pages:[Fa(n,t,o)]};let i={schemaVersion:1,pages:[lr(n,t)]};return Ra(i,n,{kind:"homeMap",floor:{id:o}},{last:!0}).document}var un=class{constructor(e){this.redraw=e;this.owners=[];this.phones=!1;this.busy=new Set;this.added=new Map;this.notes=new Map}follow(e){if(e===void 0)return;let t=_a(e),o=this.owners.map(n=>n.owner_watch_id);this.store!==t||this.listening===void 0?(this.listening?.stop(),this.store=t,this.listening=t.listen(()=>this.redraw(),o)):this.listening.update(o)}stop(){this.listening?.stop(),this.listening=void 0}get library(){return this.store?.library}done(e){return wl(this.library,e)}get addedAny(){return this.added.size>0}rows(){return ar(this.owners,this.phones).map(e=>{let t=e.ownerId.toUpperCase(),o=this.added.get(t),n=this.notes.get(t);return{device:e,line:vl[e.kind],busy:this.busy.has(t),...o===void 0?{}:{added:o},...n===void 0?{}:{note:n}}})}async add(e,t,o,n,i){let r=this.store,a=n.ownerId.toUpperCase();if(e===void 0||r===void 0||this.busy.has(a))return;this.notes.delete(a);let d,l=qn(this.owners,this.library,n.ownerId,"pages",p=>(d=p,!1));if(!l.go&&d!==void 0){if(!await i({title:`Add a page to ${n.name}?`,text:d,ok:"Add page"}))return;l=qn(this.owners,this.library,n.ownerId,"pages",()=>!0)}if(!l.go){l.note!==void 0&&this.notes.set(a,{kind:"warn",text:`Not added on ${n.name}. ${l.note}`}),this.redraw();return}this.busy.add(a),this.redraw();try{let p=Ml(n.kind,pt(),yl(t,o),o.id),h=await r.createItem("pages",p);if(!h.ok){this.notes.set(a,{kind:"err",text:`Not added. ${h.text}`});return}let c=await r.pick(n.ownerId,"pages",h.reply.id,!0);if(!c.ok){this.notes.set(a,{kind:"err",text:`Not added on ${n.name}. ${c.text}`});return}this.added.set(a,h.reply.id),await this.sayFreePlan(e,n)}finally{this.busy.delete(a),this.redraw()}}async sayFreePlan(e,t){let o=this.library;if(!(o===void 0||hr(o,t.ownerId,"pages")<2))try{let i=(await ji(e,t.ownerId,"pages")).multiple_pages===!1?sr([t.name]):void 0;i!==void 0&&this.notes.set(t.ownerId.toUpperCase(),{kind:"ok",text:i})}catch{}}};function od(s){return{get:()=>mo(s),save:(e,t)=>Wi(s,e,t)}}var nd="The map had changed on another device. Your change was saved on top of it.",kl="The map changed on another device, and your change no longer fits it. It now shows the map as saved there.",$l="The map changed again while saving, so your change was not saved. Try it once more.",so="Not saved yet. Trying again.",xl=2e4;function fn(){return{v:Xi,floors:[]}}var Hl=new Set(["unavailable","timeout"]);function Di(s){let e=Ge(s).code;return e===void 0||Hl.has(e)}function ed(s,e){let{code:t,message:o}=Ge(s);switch(console.warn(`Home map: Home Assistant refused the save (${t??"no code"}): ${o}`),t){case"invalid":{let{path:n,problem:i}=Zi(o);return`Not saved. ${Yi(e,n,i)}`}case"too_large":return"Not saved. The map is too big to save. Take out some rooms or things.";case"conflict":return $l;case"unauthorized":return"Not saved. Home Assistant did not let this login save the map. Sign in again and try once more.";case"invalid_format":return"Not saved. Home Assistant could not read the map sent. Reload the page and try again.";case"unknown_command":return"Not saved. Update the Wrist Assistant integration to save the map here.";case"unavailable":case"timeout":return"Not saved. Home Assistant could not be reached. Try again in a moment.";default:return"Not saved. Home Assistant did not take the change. Try again."}}function Oi(s){let{code:e,message:t}=Ge(s);switch(console.warn(`Home map: the map could not be read (${e??"no code"}): ${t}`),e){case"unauthorized":return"Home Assistant did not let this login read it. Sign in again.";case"unavailable":return"Wrist Assistant is still starting. Try again in a moment.";case void 0:return"Home Assistant could not be reached. Check the connection and try again.";default:return"Home Assistant could not send it. Try again."}}function Pl(s){return{doc:At(s?.doc)??null,rev:typeof s?.rev=="number"?s.rev:0}}function gn(s){return Array.isArray(s)?`[${s.map(gn).join(",")}]`:typeof s=="object"&&s!==null?`{${Object.entries(s).filter(([,t])=>t!==void 0).sort(([t],[o])=>t<o?-1:t>o?1:0).map(([t,o])=>`${JSON.stringify(t)}:${gn(o)}`).join(",")}}`:JSON.stringify(s)}function bn(s,e){return s===e?!0:s==null||e==null?!1:gn(s)===gn(e)}function Ai(s){let e,t=new Promise((o,n)=>{e=setTimeout(()=>n({code:"timeout",message:"Home Assistant did not answer."}),xl)});return Promise.race([s,t]).finally(()=>clearTimeout(e))}function td(s,e){let t=typeof e=="function"?e(s):or(s,e);if(t===void 0)return;let o=Dt(t);return o.ok?{doc:o.doc}:(console.warn(`Home map: not saved, as the store would refuse it: ${o.message}`),{text:`Not saved. ${o.text}`})}async function id(s,e,t,o){let n=td(e.doc??fn(),t);if(n===void 0)return{ok:!1,text:"That is no longer on the map."};if("text"in n)return{ok:!1,text:n.text};try{let a=await Ai(s.save(n.doc,e.rev));return{ok:!0,read:{doc:n.doc,rev:a.rev},merged:!1}}catch(a){if(Di(a))return{ok:!1,retry:!0,text:so,sent:n.doc};if(Ge(a).code!=="conflict")return{ok:!1,text:ed(a,n.doc)}}let i;try{i=Pl(await Ai(s.get()))}catch(a){return Di(a)?{ok:!1,retry:!0,text:so,sent:o??n.doc}:{ok:!1,text:`Not saved. The map changed on another device and could not be read again. ${Oi(a)}`}}for(let a of[o,n.doc])if(a!==void 0&&i.doc!==null&&bn(i.doc,a))return{ok:!0,read:{doc:i.doc,rev:i.rev},merged:!1};let r=td(i.doc??fn(),t);if(r===void 0)return{ok:!1,text:kl,read:i};if("text"in r)return{ok:!1,text:r.text,read:i};try{let a=await Ai(s.save(r.doc,i.rev));return{ok:!0,read:{doc:r.doc,rev:a.rev},merged:!0}}catch(a){return Di(a)?{ok:!1,retry:!0,text:so,sent:r.doc}:{ok:!1,text:ed(a,r.doc),read:i}}}function El(s){return Math.min(3e4,1e3*2**Math.max(0,s-1))}var Li=new Set;function ad(){for(let s of Li)if(s.busy)return!0;return!1}function rd(s,e){return t=>bn(t,s)?e:void 0}function Tl(s){return s.length===1?s[0]:e=>s.reduce((t,o)=>t===void 0?void 0:o(t),e)}var vn=class{constructor(e,t,o=()=>{},n=()=>{},i){this.api=e;this.changed=o;this.saved=n;this.state={kind:"saved"};this.queue=[];this.failures=0;this.confirmed=t,this.doc=t.doc,this.history=new ha(i)}get busy(){return this.queue.length>0||this.pending!==void 0||this.running!==void 0}get canUndo(){return this.doc!==null&&this.history.canUndo}get canRedo(){return this.doc!==null&&this.history.canRedo}load(e){return this.busy?!1:(this.confirmed=e,this.doc=e.doc,this.history.clear(),this.changed(),!0)}apply(e){let t=this.doc;if(t===null)return!1;let o=this.checked(e(t));return o===void 0?!1:(this.history.push(t),this.doc=o,this.enqueue(e),!0)}begin(e){let t=this.doc??fn();if(t.floors.length>0)return!1;let o=this.checked(e(t));return o===void 0?!1:(this.doc=o,this.enqueue(e),!0)}undo(){let e=this.doc;if(e===null)return!1;let t=this.history.undo(e);return t===void 0?!1:(this.doc=t,this.enqueue(rd(e,t)),!0)}redo(){let e=this.doc;if(e===null)return!1;let t=this.history.redo(e);return t===void 0?!1:(this.doc=t,this.enqueue(rd(e,t)),!0)}retryNow(){this.wake?.()}async idle(){for(;this.running!==void 0;)await this.running}dismissNote(){this.note=void 0,this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed()}checked(e){if(e===void 0)return;let t=Dt(e);if(!t.ok){console.warn(`Home map: an edit was not made, as the store would refuse it: ${t.message}`),this.note={kind:"err",text:t.text},this.changed();return}return t.doc}enqueue(e){this.queue.push(e),Li.add(this),this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed(),this.kick()}kick(){this.running===void 0&&(this.running=this.run().finally(()=>{this.running=void 0,this.queue.length>0||this.pending!==void 0?this.kick():(Li.delete(this),this.changed())}))}pause(e){return new Promise(t=>{let o=setTimeout(i,e),n=this;function i(){clearTimeout(o),n.wake===i&&(n.wake=void 0),t()}this.wake=i})}async run(){for(;this.pending!==void 0||this.queue.length>0;){let e=this.pending??{ops:this.queue.splice(0),sent:void 0};this.pending=void 0,this.state.kind!=="waiting"&&(this.state={kind:"saving"}),this.changed();let t=await id(this.api,this.confirmed,Tl(e.ops),e.sent);if(t.ok){this.failures=0,this.state={kind:"saving"},this.confirmed=t.read,this.saved(t.read),t.merged?(this.note={kind:"warn",text:nd},this.history.clear(),this.doc=this.rebased()):this.queue.length===0&&(this.doc=t.read.doc);continue}if(t.retry===!0){this.pending={ops:e.ops,sent:t.sent??e.sent},this.failures+=1,this.state={kind:"waiting",text:so},this.changed(),await this.pause(El(this.failures));continue}this.failures=0,this.queue=[],this.history.clear(),t.read!==void 0&&(this.confirmed=t.read,this.saved(t.read)),this.doc=this.confirmed.doc,this.note={kind:"err",text:t.text},this.state={kind:"error",text:t.text},this.changed();return}this.state={kind:"saved"}}rebased(){let e=this.confirmed.doc;if(e===null)return null;let t=[];for(let o of this.queue){let n=o(e);if(n===void 0)continue;let i=Dt(n);i.ok&&(e=i.doc,t.push(o))}return this.queue=t,e}};var sd=ho`
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
  /* With something picked its bar takes the top of the plan: Add draws small
   * and the bar starts after it, so neither covers the other. */
  .hme-add-btn.compact { padding: 0 12px 0 9px; gap: 5px; }
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
  /* A field with its name over it, and the sign it drags. */
  .hme-lab { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .hme-lab-t { font-size: 12px; color: var(--wa-muted); padding-left: 2px; white-space: nowrap; }
  .hme-lab .hme-num { height: 36px; }
  .hme-lab .hme-num input { font-size: 14px; }
  .hme-num:not(.off):not(:focus-within):hover .hme-unit::after { content: " ↔"; color: var(--hme-sel); }
  /* A wall seen square on, with its doors and windows to scale. */
  .hme-wp { display: block; width: 100%; height: auto; touch-action: none; user-select: none; -webkit-user-select: none; }
  .hme-wp-wall { fill: var(--wa-input); stroke: var(--wa-line-strong); stroke-width: 1; }
  .hme-wp-floor { stroke: var(--wa-faint); stroke-width: 2; }
  .hme-wp-o:hover { stroke: var(--hme-sel); }
  .hme-wp-t { font-size: 11px; fill: var(--wa-muted); font-family: var(--hme-mono); pointer-events: none; }
  .hme-wp-t.strong { fill: var(--wa-ink); font-weight: 600; }
  .hme-wp-dim { fill: none; stroke: var(--wa-faint); stroke-width: 1; stroke-dasharray: 3 3; pointer-events: none; }
  .hme-add3 { display: grid; grid-template-columns: repeat(3, minmax(0, auto)); gap: 6px; justify-content: start; }
  .hme-kinds { gap: 8px; }
  .hme-kinds .hme-pic { width: 56px; text-align: center; line-height: 1.15; }
  .hme-kinds .hme-pic > svg { width: 52px; height: 35px; }
  .hme-3d-size { position: absolute; left: 50%; top: 14px; transform: translateX(-50%); z-index: 3; padding: 5px 12px; border-radius: 10px; background: var(--hme-sel); color: #fff; font: 600 13px var(--hme-mono); pointer-events: none; white-space: nowrap; }
  .hme-fields { display: grid; grid-template-columns: repeat(var(--n, 2), minmax(0, 1fr)); gap: 8px; }
  .hme-group { display: flex; flex-direction: column; gap: 6px; }
  .hme-group + .hme-group { padding-top: 4px; }
  .hme-gl { color: var(--wa-muted); font-size: 12px; display: flex; align-items: center; gap: 8px; }
  .hme-turn { display: flex; gap: 6px; align-items: center; }
  .hme-turn .hme-num { flex: 1; }
  .hme-turn .hme-tb.hme-icon { width: 32px; padding: 0; justify-content: center; }
  .hme-foot-hint { color: var(--wa-faint); font-size: 11.5px; line-height: 1.4; margin: 2px 0 0; }
  /* How-to lines wait for Show tips, so the options read at a glance. */
  .hme-body:not(.tips) .hme-insp .hme-foot-hint, .hme-body:not(.tips) .hme-insp .hme-hint:not(.keep) { display: none; }
  .hme-tips-link { align-self: flex-start; margin: 2px 4px 6px; font-size: 12px; color: var(--wa-faint); }
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
  .hme-step-t > .hme-tb { margin-top: 6px; }
  .hme-step-quiet { color: var(--wa-faint); font-size: 12px; line-height: 1.45; margin-top: 4px; }
  .hme-step-quiet .hme-link { font-size: 12px; margin: 0 0 0 2px; }
  /* On a page: each watch and iPhone, what it gets, and Add page. */
  .hme-pagerows { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; align-self: stretch; }
  .hme-pagerow { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 10px; background: var(--wa-input); border: 1px solid var(--wa-line); }
  .hme-pagerow-t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
  .hme-pagerow-t b { font-size: 13px; font-weight: 600; color: var(--wa-ink); }
  .hme-pagerow-t > span { color: var(--wa-muted); font-size: 11.5px; line-height: 1.35; }
  .hme-pagerow-note.warn, .hme-pagerow-note.err { color: var(--wa-soft); }
  .hme-pagerow-done { flex: none; color: #30d158; font-size: 12.5px; font-weight: 600; white-space: nowrap; }
  .hme-pagerow-done .hme-link { font-size: 12.5px; font-weight: 500; }
  /* A picked room's strip of the checklist: three cells, the active one
     tinted. */
  .hme-strip {
    display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px; padding: 4px; border-radius: 12px; flex: none;
    border: 1px solid var(--wa-line); background: var(--wa-card); font: inherit; text-align: left; cursor: pointer;
  }
  .hme-strip:focus-visible { outline: none; box-shadow: var(--wa-ring, 0 0 0 2px var(--hme-sel)); }
  .hme-strip-cell { display: flex; flex-direction: column; gap: 2px; padding: 6px 8px; border-radius: 9px; min-width: 0; }
  .hme-strip-cell b { font-size: 12px; font-weight: 600; color: var(--wa-soft); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .hme-strip-cell.done b { color: #30d158; }
  .hme-strip-cell.now { background: var(--hme-sel-bg); }
  .hme-strip-cell.now b { color: var(--wa-ink); }
  .hme-strip-cell small { color: var(--wa-muted); font-size: 11px; line-height: 1.3; }
  .hme-rooms .hme-ly-end.wait { color: var(--hme-sel); }
  .hme-fit-foot { color: var(--wa-faint); font-size: 12px; padding: 2px 6px; }
  /* A folded card: its title and a short value, opened by a click. */
  .hme-fold > summary { cursor: pointer; list-style: none; }
  .hme-fold > summary::-webkit-details-marker { display: none; }
  .hme-fold > summary:hover { color: var(--wa-ink); }
  .hme-fold > summary:focus-visible { outline: none; box-shadow: var(--wa-ring, 0 0 0 2px var(--hme-sel)); border-radius: 6px; }
  .hme-fold-caret { display: inline-block; margin-left: 6px; transition: transform 0.15s; }
  .hme-fold[open] .hme-fold-caret { transform: rotate(90deg); }
  .hme-fold-body { display: flex; flex-direction: column; gap: 10px; }
  /* Cards inside a folded card lose their own frame. */
  .hme-fold-cards .hme-fold-body > .hme-card { border: 0; padding: 0; background: none; }
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
  .hme-stage.hme-split-l { right: calc(100% - var(--hme-split, 50%) + 6px); }
  .hme-stage.hme-split-r { left: calc(var(--hme-split, 50%) + 6px); }
  /* Both with the plan over the model, when that draws the plan bigger. */
  .hme-stage-wrap.stack .hme-stage.hme-split-l { right: 0; bottom: calc(100% - var(--hme-split, 50%) + 6px); }
  .hme-stage-wrap.stack .hme-stage.hme-split-r { left: 0; top: calc(var(--hme-split, 50%) + 6px); }
  .hme-stage-wrap.stack .hme-split-handle { left: 0; right: 0; bottom: auto; width: auto; height: 12px; top: calc(var(--hme-split, 50%) - 6px); cursor: row-resize; }
  .hme-stage-wrap.stack .hme-split-handle span { width: 44px; height: 4px; }
  .hme-split-handle {
    position: absolute; top: 0; bottom: 0; left: calc(var(--hme-split, 50%) - 6px); width: 12px; z-index: 5;
    display: flex; align-items: center; justify-content: center; cursor: col-resize; touch-action: none; border-radius: 6px;
  }
  .hme-split-handle span { width: 4px; height: 44px; border-radius: 2px; background: #48484a; }
  .hme-split-handle:hover span, .hme-split-handle:active span { background: var(--hme-sel); }
  .hme-split-handle:focus-visible { outline: 2px solid var(--hme-sel); outline-offset: -2px; }
  svg.hme-svg { display: block; position: absolute; inset: 0; width: 100%; height: 100%; touch-action: none; user-select: none; -webkit-user-select: none; }
  svg.hme-svg text { font-family: var(--wa-font, inherit); }
  .hme-tag text { font-size: 11px; font-weight: 600; }
  .hme-pill, .hme-dock {
    position: absolute; left: 50%; transform: translateX(-50%); z-index: 2;
    display: flex; gap: 4px; align-items: center; padding: 4px; border-radius: 12px;
    background: rgba(28, 28, 30, 0.92); border: 1px solid #3a3a3c; white-space: nowrap;
    /* A narrow plan (Both, or a small window) wraps the bar onto a second
     * row rather than cutting buttons off at its edge. */
    max-width: calc(100% - 28px); flex-wrap: wrap; justify-content: center;
    -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  }
  .hme-pill { top: 14px; }
  .hme-pill.beside { left: 100px; transform: none; max-width: calc(100% - 114px); }
  .hme-dock { bottom: 14px; gap: 6px; padding: 6px; }
  .hme-tb.hme-blue { background: var(--hme-sel); border-color: var(--hme-sel); color: #fff; }
  .hme-tb.hme-blue:hover:not(:disabled) { background: #6f9cf2; color: #fff; }
  .hme-tb.hme-blue kbd { font: 500 11px var(--hme-mono); opacity: 0.75; }
  /* The tools, in a column of their own on the left of the plan, so they never
   * cover the map. The plan and what floats over it start after the column. */
  .hme-toolrail {
    position: absolute; left: 0; top: 0; bottom: 0; z-index: 3; width: 66px;
    display: flex; flex-direction: column; gap: 2px; padding: 6px 4px;
    background: #161617; border-right: 1px solid #2c2c2e; overflow-y: auto; scrollbar-width: none;
  }
  .hme-stage.rail { padding-left: 66px; }
  .hme-stage.rail svg.hme-svg { left: 66px; width: calc(100% - 66px); }
  .hme-stage.rail .hme-add-btn { left: 80px; }
  .hme-stage.rail .hme-pill.beside { left: 164px; max-width: calc(100% - 178px); }
  .hme-stage.rail .hme-dock, .hme-stage.rail .hme-pill:not(.beside) { left: calc(50% + 33px); max-width: calc(100% - 94px); }
  .hme-stage.rail .hme-stage-hint { left: 80px; }
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
  /* The tool rail's Draw list, beside the rail. */
  .hme-drawlist {
    position: absolute; left: 70px; top: 54px; z-index: 4; min-width: 170px; padding: 4px; display: flex; flex-direction: column; gap: 1px;
    border-radius: 12px; background: #1c1c1e; border: 1px solid #3a3a3c; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
  }
  .hme-drawlist-item {
    display: flex; align-items: center; gap: 10px; min-height: 34px; padding: 0 10px; border: 0; border-radius: 8px; background: none;
    color: #e5e5ea; font: inherit; font-size: 13px; cursor: pointer; text-align: left;
  }
  .hme-drawlist-item:hover { background: #2c2c2e; }
  .hme-drawlist-item.on { background: #3a3a3c; color: #fff; }
  .hme-drawlist-item:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--hme-sel); }
  .hme-drawlist-item span { flex: 1; }
  .hme-drawlist-item kbd { font: 500 11px var(--hme-mono); color: #8e8e93; }
  /* The dock's View and Look menus, over the dock: inside it, so they sit
   * just above it however many rows it wraps to. */
  .hme-dock-pop {
    position: absolute; left: 50%; bottom: calc(100% + 8px); transform: translateX(-50%); z-index: 4; min-width: 200px; padding: 4px;
    display: flex; flex-direction: column; gap: 1px; border-radius: 12px;
    background: rgba(28, 28, 30, 0.96); border: 1px solid #3a3a3c; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
    -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  }
  .hme-north { flex-direction: row; align-items: center; gap: 10px; padding: 8px 12px; white-space: nowrap; }
  .hme-north-dial { width: 40px; height: 40px; flex: none; }
  .hme-north-dial circle { fill: none; stroke: #48484a; stroke-width: 1.5; }
  .hme-north-dial path { fill: #8e8e93; }
  .hme-north-dial path.n { fill: #ff453a; }
  .hme-north-row { display: flex; flex-direction: column; gap: 4px; color: #d1d1d6; font-size: 12px; min-width: 170px; }
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

  /* Fit rooms: how many doors meet and the next thing to do. */
  .hme-fit.hot { border-color: color-mix(in srgb, var(--hme-amber) 55%, var(--wa-line)); }
  .hme-fit.good { border-color: color-mix(in srgb, #30d158 45%, var(--wa-line)); }
  .hme-fit-bar { height: 5px; border-radius: 3px; background: var(--wa-input); overflow: hidden; margin: 2px 0 8px; }
  .hme-fit-bar i { display: block; height: 100%; border-radius: 3px; background: var(--hme-amber); }
  .hme-fit-bar i.full { background: #30d158; }
  .hme-fit-acts { display: flex; gap: 6px; margin-top: 8px; }
  .hme-fit-acts .hme-tb { flex: 1; }
  .hme-tb.hme-fit-other { margin-top: 6px; height: 30px; }
  .hme-door-row { display: flex; align-items: center; gap: 8px; min-height: 28px; }
  .hme-door-name { flex: 1; min-width: 0; border: 0; background: none; padding: 0; color: var(--wa-soft); font: inherit; text-align: left; cursor: pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hme-door-name:hover { color: var(--wa-ink); }
  .hme-door-row .hme-tb { height: 24px; padding: 0 8px; font-size: 12px; }
  .hme-fix-dot.green { background: #30d158; }
  @keyframes hme-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
  .hme-door-open, .hme-door-choice > circle { animation: hme-pulse 1.2s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) { .hme-door-open, .hme-door-choice > circle { animation: none; } }
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
  .hme-tray { display: flex; flex-direction: column; gap: 6px; }
  /* A room's tray, Not on the map: a row armed by a click waits for its
     place on the plan. */
  .hme-tray-row { cursor: grab; }
  .hme-tray-row.armed { border-color: var(--hme-sel); background: var(--hme-sel-bg); }
  .hme-tb.hme-blink { height: 24px; padding: 0 8px; font-size: 11.5px; flex: none; }
  .hme-tray-more {
    display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 32px; padding: 0 10px; border-radius: 9px;
    border: 1px dashed var(--wa-line-strong); background: none; color: var(--wa-soft); font: inherit; font-size: 12.5px; cursor: pointer; text-align: left;
  }
  .hme-tray-more:hover { color: var(--wa-ink); border-color: var(--hme-sel); }
  .hme-tray-more:focus-visible { outline: none; box-shadow: var(--wa-ring, 0 0 0 2px var(--hme-sel)); }
  .hme-tray-how { margin-top: -4px; }
  .hme-tray-back { align-self: flex-start; margin: -4px 4px 0; font-size: 12.5px; }
  /* The line over the plan while a device is armed. */
  .hme-armed {
    position: absolute; left: 50%; top: 12px; transform: translateX(-50%); z-index: 3; display: flex; align-items: center; gap: 8px;
    padding: 6px 12px; border-radius: 999px; background: rgba(0, 0, 0, 0.78); color: #fff; font-size: 12.5px; white-space: nowrap; max-width: calc(100% - 100px);
  }
  .hme-stage.rail .hme-armed { left: calc(50% + 33px); }
  .hme-armed b { font-weight: 600; overflow: hidden; text-overflow: ellipsis; }
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
`;var lo={plan:{title:"Plan",hint:"The floor from above, with real floors, walls and pools of light."},night:{title:"Night",hint:"A small model at night. Lit rooms glow warm."},warm:{title:"Warm",hint:"Wood floors and cream walls, like a doll house."},lines:{title:"Lines",hint:"Only the lines. Calm and clean."},clay:{title:"Clay",hint:"A soft light model, for light pages."},blueprint:{title:"Blueprint",hint:"White lines on blue paper."},dots:{title:"Dots",hint:"A quiet plan with a dot for each light."}};function Cl(s,e){if(!Fo(s))return"Home style";let t=jn(s,e),o=i=>Object.hasOwn(s,sa[i]),n=[];return o("look")&&n.push(lo[t.look].title),o("turn")&&n.push(`turned ${t.turn}\xB0`),o("names")&&n.push(t.names?"room names":"no room names"),o("devices")&&n.push(t.devices==="all"?"every device":t.devices==="none"?"no devices":"lights only"),o("furniture")&&n.push(t.furniture?"furniture":"no furniture"),o("glow")&&n.push(t.glow?"glow":"no glow"),`Own look: ${n.join(", ")}`}var dd=(s,e)=>typeof s=="number"&&Number.isFinite(s)?s:e;function Sl(s,e){let t=dr(s);return go(s).flatMap(o=>{if(Ot(lt(o))!=="home_map")return[];let n=o,i=vo(lt(o)),r=e?.floors.find(c=>k(c.id,i)),a=typeof n.homeMapRoomId=="string"?n.homeMapRoomId:void 0,d=a===void 0?void 0:r?.rooms.find(c=>k(c.id,a)),l=`${dd(o.colSpan,1)}\xD7${dd(o.rowSpan,1)}`,h=(typeof o.customLabel=="string"&&o.customLabel.trim()!==""?o.customLabel.trim():void 0)??(d?.name?.trim()?`${d.name.trim()} only`:r===void 0||(e?.floors.length??0)<=1?"Home map":W(r));return[{pageId:t,pageName:bo(s),tileId:typeof o.id=="string"?o.id:"",what:h,size:l,own:Fo(n),words:Cl(n,e),look:jn(n,e).look}]})}function ld(s,e){return Object.values(s?.pages??{}).map(o=>o?.item).filter(o=>dt(o)).sort((o,n)=>bo(o).localeCompare(bo(n))).flatMap(o=>Sl(o,e))}function pd(s){let e=!1;if(!Array.isArray(s.pages))return;let t=s.pages.map(o=>{if(!dt(o)||!Array.isArray(o.items))return o;let n=o.items.map(i=>!dt(i)||Ot(lt(i))!=="home_map"||!Fo(i)?i:(e=!0,pa(i)));return{...o,items:n}});return e?{...s,pages:t}:void 0}var wn={width:112,height:68},Il={width:94,height:94,radius:34},Rl={width:188,height:94,radius:22},Dl=.9,yn=class{constructor(){this.usesState="idle";this.busy=!1}style(e){let t=ze(e.doc);return this.turnLive===void 0?t:{...t,turn:this.turnLive}}set(e,t){e.apply(o=>da(o,t))}panel(e,t){let o=this.style(e),n=e.hass?.states,i=qt.includes(o.look),r=(a,d,l)=>m`<button type="button" class="hme-chip sel ${d?"on":""}" aria-pressed=${d?"true":"false"} @click=${l}>${a}</button>`;return m`<div class="hme-style-scrim" @pointerdown=${a=>{a.target===a.currentTarget&&t()}}></div>
      <div class="hme-style-pop" role="dialog" aria-label="Home style">
        <header class="hme-style-head">
          <strong>Home style</strong>
          <span>How every map tile looks, unless a tile picks its own</span>
          <button type="button" class="hme-x hme-style-close" aria-label="Close" title="Close (Esc)" @click=${t}>✕</button>
        </header>

        ${L("Look",m`<div class="hme-looks four">
          ${Ui.map(a=>{let d=a===o.look,l=xt({floor:e.floor,states:n,...o,look:a,names:!1,width:wn.width,height:wn.height});return m`<button type="button" class="hme-look ${d?"on":""}" aria-pressed=${d?"true":"false"} title=${lo[a].hint}
              @click=${()=>this.set(e,{look:a})}>
              <svg viewBox=${`0 0 ${wn.width} ${wn.height}`} style=${`background:${je(a,.5)}`} aria-hidden="true">${l}</svg>
              <span>${lo[a].title}</span></button>`})}
        </div>
        <p class="hme-foot">Plan and Dots draw the floor from above. The other five draw it as a small model you can turn.</p>`)}

        <div class="hme-style-row">
          ${L("Show",m`
            <div class="hme-r"><span class="hme-l">Room names</span>${r(o.names?"Shown":"Hidden",o.names,()=>this.set(e,{names:!o.names}))}</div>
            <div class="hme-r"><span class="hme-l">Devices</span><div class="hme-chips">
              ${r("Lights",o.devices==="lights",()=>this.set(e,{devices:"lights"}))}
              ${r("All",o.devices==="all",()=>this.set(e,{devices:"all"}))}
              ${r("None",o.devices==="none",()=>this.set(e,{devices:"none"}))}</div></div>
            <div class="hme-r"><span class="hme-l">Furniture</span>${r(o.furniture?"Shown":"Hidden",o.furniture,()=>this.set(e,{furniture:!o.furniture}))}</div>
            <div class="hme-r"><span class="hme-l">Light glow</span>${r(o.glow?"On":"Off",o.glow,()=>this.set(e,{glow:!o.glow}))}</div>
            <div class="hme-r"><span class="hme-l">Turn</span>
              <input class="hme-range" type="range" min="-180" max="180" step="1" .value=${G(String(o.turn))} ?disabled=${!i} aria-label="Turn the model"
                style=${Oe(o.turn,-180,180)}
                @input=${a=>{this.turnLive=Number(a.target.value),e.redraw()}}
                @change=${a=>{this.turnLive=void 0,this.set(e,{turn:Number(a.target.value)})}} />
              <span class="hme-val mono hme-w48">${i?`${o.turn}\xB0`:"flat"}</span></div>`,void 0,"hme-grow-card")}
          ${L("Preview",m`<div class="hme-style-tiles">
            ${this.face(e,o,Il,"Watch tile 2 \xD7 2")}
            ${this.face(e,o,Rl,"iPhone tile 4 \xD7 2")}
          </div>`,lo[o.look].title,"hme-grow-card")}
        </div>

        ${this.usesCard(e)}
      </div>`}face(e,t,o,n){let i=Dl,r=e.hass?.states,a=Na(o.width,o.height),d=xt({floor:e.floor,states:r,...t,width:a.width,height:a.height,tileHeight:o.height,icons:e.icons}),l=uo(e.floor,r),p=6*i;return m`<figure class="hme-fr">
      <div class="hme-face" style=${`width:${o.width*i}px;height:${o.height*i}px;border-radius:${o.radius*i}px;background:${je(t.look,i)}`}>
        <svg viewBox=${`0 0 ${a.width} ${a.height}`} aria-hidden="true"
          style=${`left:${a.x*i}px;top:${a.y*i}px;width:${a.width*i}px;height:${a.height*i}px`}>${d}</svg>
        ${o.height>90?m`<span class="hme-face-title" style=${`left:${p}px;top:${p}px;font-size:${11*i}px;color:${za(t.look)}`}>${Al(e.floor)}</span>`:g}
        <span class="hme-face-words" style=${`left:${p}px;bottom:${p}px;font-size:${10*i}px;color:${ja(t.look,l>0)}`}>${fo(l)}</span>
      </div>
      <figcaption>${n}</figcaption>
    </figure>`}leave(){this.turnLive=void 0,this.usesState="idle",this.message=void 0}look(e){return ze(e.doc).look}loadUses(e){let t=e.hass;this.usesState!=="idle"||t===void 0||(this.usesState="loading",Aa(t).then(o=>{this.summary=o,this.usesState="done",e.redraw()},()=>{this.usesState="error",e.redraw()}))}usesCard(e){if(this.loadUses(e),this.usesState!=="done")return L("Used on",m`<p class="hme-text dim">${this.usesState==="error"?"Could not read your pages.":"Reading your pages\u2026"}</p>`);let t=ld(this.summary,e.doc),o=t.filter(n=>n.own);return L(`Used on ${O(t.length,"tile")}`,m`
      ${t.length===0?m`<p class="hme-text dim">No page has a Home map tile yet. Add one from a page's Add tile.</p>`:g}
      ${t.map(n=>this.useRow(e,n))}
      ${o.length===0?g:m`<button type="button" class="hme-tb hme-wide" ?disabled=${this.busy}
        @click=${()=>{this.useHomeStyleOnAll(e,o)}}>${this.busy?"Saving\u2026":`Use the home style on all ${o.length}`}</button>`}
      ${this.message===void 0?g:m`<p class="hme-text dim" role="status">${this.message}</p>`}`)}useRow(e,t){return m`<div class="hme-use">
      <i style=${`background:${je(t.look,.2)}`}></i>
      <div><span>${t.pageName} · ${t.what} ${t.size}</span><small>${t.words}</small></div>
      ${e.openPage===void 0?g:m`<button type="button" class="hme-tb" @click=${()=>e.openPage?.(t.pageId)}>Edit</button>`}
    </div>`}async useHomeStyleOnAll(e,t){let o=e.hass;if(o===void 0||this.busy)return;let n=[...new Set(t.map(a=>a.pageId))];if(!await e.confirm({title:`Use the home style on ${O(t.length,"tile")}?`,text:`Their own looks come off, so each draws the home style. ${n.length===1?"The page is":`The ${n.length} pages are`} saved for every watch and iPhone that shows ${n.length===1?"it":"them"}.`,ok:"Use the home style"}))return;this.busy=!0,this.message=void 0,e.redraw();let r=0;for(let a of n)try{let d=await Oa(o,"pages",a),l=pd(d.document);l!==void 0&&await La(o,"pages",a,d.revision,l)}catch{r+=1}this.busy=!1,this.message=r===0?"Done: those tiles follow the home style now.":`${O(r,"page")} could not be saved. Try again, or open ${r===1?"it":"them"} to see why.`,this.usesState="idle",e.redraw()}};function Al(s){return s.name.trim()===""?"Home map":s.name.trim()}var Ol={dir:[0,1,0],sun:0,sky:0,warm:0},Ll=(()=>{let[s,e,t]=[-2,6.5,8],o=Math.hypot(s,e,t);return{dir:[s/o,e/o,t/o],sun:1,sky:1,warm:0}})();function _i(s,e,t){let o=Math.max(0,Math.min(1,(t-s)/(e-s)));return o*o*(3-2*o)}function Fi(s){let e=s?.["sun.sun"]?.attributes,t=e?.azimuth,o=e?.elevation;if(!(typeof t!="number"||!Number.isFinite(t)||typeof o!="number"||!Number.isFinite(o)))return{azimuth:t,elevation:o}}function _l(s,e){let t=(s.azimuth+e)*Math.PI/180,o=Math.max(s.elevation,0)*Math.PI/180;return{dir:[Math.cos(o)*Math.sin(t),Math.sin(o),-Math.cos(o)*Math.cos(t)],sun:_i(0,12,s.elevation),sky:_i(-6,10,s.elevation),warm:1-_i(2,25,s.elevation)}}function hd(s,e){let t=s?.north??0,o=s?.floors.reduce((i,r)=>i===void 0||r.story<i.story?r:i,void 0),n=o===void 0||o.id.toUpperCase()===e.id.toUpperCase()?0:e.place?.turn??0;return((t+n)%360+360)%360}function md(s,e,t){return s==="day"?Ll:s==="now"&&e!==void 0?_l(e,t):Ol}var Fl="Update the Wrist Assistant integration to see the home map here.",zl="No home map yet",jl="Start a map by hand",Nl="You can also scan your rooms with the Wrist Assistant app on an iPhone or iPad Pro with LiDAR.",Kl=4,Wl=140;function Bl(s){return s.kind==="saving"?"Saving\u2026":s.kind==="waiting"?s.text:s.kind==="error"?"Not saved":"Saved"}typeof window<"u"&&window.addEventListener("beforeunload",s=>{ad()&&(s.preventDefault(),s.returnValue="")});var cd={night:"Night",warm:"Warm",lines:"Lines",clay:"Clay",blueprint:"Blueprint"},ud={now:"Now",night:"Lights",day:"Daylight"},R=class extends zi{constructor(){super(...arguments);this.narrow=!1;this.icons=void 0;this.iconsTick=0;this.capable=!1;this.bundleUrl=void 0;this.onHome=void 0;this.onOpenPage=void 0;this.owners=[];this.phones=!1;this.unsupported=!1;this.loading=!1;this.styleOpen=!1;this.viewKind="both";this.splitStack=!1;this.split=ns();this.tipsShown=rs();this.artScale=0;this.stageSize={width:0,height:0};this.toggles={snap:!0,grid:!1,measure:!1,live:!0,scan:!1};this.measure={};this.floorMenu=!1;this.model3d=!0;this.skyChoice="now";this.spaceHeld=!1;this.tick=0;this.page=new pn;this.stylePanel=new yn;this.pageStep=new un(()=>{this.tick++});this.addDialog=new cn(this.page.devices,(t,o,n)=>this.page.arrange.piecePic(t,o,n));this.loadSeq=0;this.askedOnce=!1;this.needFit=!0;this.userMoved=!1;this.touches=new Map;this.artKey="";this.artHeld=g;this.loading3d=!1;this.quality3d=Sa();this.slow3d=!1;this.lost3d=!1;this.keysOpen=!1;this.checking=!1;this.onReconnect=()=>{this.session?.retryNow(),this.recheck()};this.onVisible=()=>{typeof document<"u"&&document.visibilityState!=="visible"||(this.session?.retryNow(),this.recheck())};this.onKey=t=>{if(this.dialog!==void 0||this.addOpen!==void 0||this.session===void 0||this.renderRoot?.querySelector?.(".hme-sheet")!=null)return;let o=(typeof t.composedPath=="function"?t.composedPath()[0]:void 0)??t.target;if(Qn(o))return;let n=Z(t,!1);if(this.keysOpen){(t.key==="Escape"||n==="help")&&(t.preventDefault?.(),this.closeKeys());return}if(n==="undo"||n==="redo"){t.preventDefault?.(),n==="undo"?this.undo():this.redo();return}if(this.styleOpen){t.key==="Escape"&&this.closeStyle();return}if(Ya(o))return;if(n==="help"){t.preventDefault?.(),this.openKeys();return}if(this.dockMenu!==void 0&&t.key==="Escape"){this.dockMenu=void 0;return}if(t.key===" "&&!t.repeat){this.spaceHeld=!0,t.preventDefault?.();return}if(typeof n=="object"&&"letter"in n&&n.letter==="a"&&!this.page.devices.choosing){t.preventDefault?.(),this.openAdd();return}if(typeof n=="object"&&"letter"in n&&n.letter==="z"&&this.viewKind!=="model"){t.preventDefault?.(),this.fitPicked();return}let i=this.context(),r=n==="copy"||n==="paste"||n==="duplicate";if(i!==void 0&&(this.viewKind!=="model"||r)&&this.page.keyDown?.(i,t)===!0){t.preventDefault?.();return}switch(n){case"cancel":this.floorMenu?this.floorMenu=!1:this.toggles.measure?this.setToggle("measure",!1):this.selection=void 0;return;case"zoomIn":this.zoomBy(Yt);return;case"zoomOut":this.zoomBy(1/Yt);return;case"fit":this.fit();return}};this.onKeyUp=t=>{t.key===" "&&(this.spaceHeld=!1)}}homeDevices(){let t=this.hass,o=[t?.states,t?.entities,t?.devices,t?.areas],n=this.devicesHeld;if(n!==void 0&&n.key.every((r,a)=>r===o[a]))return n.list;let i=Qe(t);return this.devicesHeld={key:o,list:i},i}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKey),window.addEventListener("keyup",this.onKeyUp),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.askedOnce&&(this.load(!0),this.listen())}disconnectedCallback(){super.disconnectedCallback(),this.pageStep.stop(),window.removeEventListener("keydown",this.onKey),window.removeEventListener("keyup",this.onKeyUp),typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.stopListening(),this.endDrag?.(),this.observer?.disconnect(),this.observed=void 0,this.zoomTimer!==void 0&&clearTimeout(this.zoomTimer),this.loadSeq++,this.drop3d()}willUpdate(t){this.hass&&this.capable&&!this.askedOnce&&(this.askedOnce=!0,this.load()),this.askedOnce&&this.listen(),this.pageStep.owners=this.owners,this.pageStep.phones=this.phones,this.askedOnce&&this.pageStep.follow(this.hass);let o=this.baseFloor();this.needFit&&o!==void 0&&this.stageSize.width>0&&this.fit()}updated(){let t=this.renderRoot.querySelector?.(".hme-dialog");t instanceof Element&&t!==this.focusedDialog?(this.focusedDialog=t,(t.querySelector("input")??t.querySelector(".primary"))?.focus?.(),t.querySelector("input")?.select?.()):t===null&&(this.focusedDialog=void 0);let o=this.renderRoot.querySelector?.(".hme-stage");o instanceof Element&&o!==this.observed&&typeof ResizeObserver<"u"&&(this.observer??=new ResizeObserver(n=>{let i=n[n.length-1]?.contentRect;i!==void 0&&this.resizeStage(i.width,i.height)}),this.observed!==void 0&&this.observer.unobserve(this.observed),this.observer.observe(o),this.observed=o),this.syncSplit(),this.view!==void 0&&this.view.scale!==this.artScale&&this.zoomTimer===void 0&&(this.zoomTimer=setTimeout(()=>{this.zoomTimer=void 0,this.view!==void 0&&(this.artScale=this.view.scale)},Wl)),this.sync3d()}input3d(){let t=this.shownFloor();if(t===void 0)return;let o=this.selection,n=Ee(o),i=ne(o),r=n.length>0?{things:n}:o?.kind==="wall"||o?.kind==="opening"?{piece:o}:i===void 0?void 0:{roomId:i},a=Fi(this.hass?.states),d=hd(this.doc===null?null:{...this.doc,north:this.northLive??this.doc.north},t);return{floor:t,states:this.toggles.live?this.hass?.states:void 0,mark:r,sky:md(this.skyChoiceNow(a),a,d)}}syncSplit(){if(this.viewKind!=="both")return;let t=this.renderRoot.querySelector?.(".hme-stage-wrap"),o=this.baseFloor(),n=o===void 0?void 0:_e(o.rooms.flatMap(a=>a.outline));if(!(t instanceof Element)||n===void 0)return;let i=t.getBoundingClientRect(),r=ss(i.width,i.height,n.maxX-n.minX,n.maxY-n.minY);r!==this.splitStack&&(this.splitStack=r)}sync3d(){let t=this.renderRoot.querySelector?.(".hme-3d-host"),o=this.input3d();if(!(t instanceof HTMLElement)||o===void 0||this.bundleUrl===void 0){this.drop3d();return}if(this.scene3d!==void 0){this.scene3d.attach(t),this.scene3d.update(o,this.modelTurnNow()),this.scene3d.setHover(this.hoverFor3d()),this.view3d!==void 0&&(this.scene3d.setView(this.view3d),this.view3d=void 0);return}if(this.loading3d||this.failed3d!==void 0)return;this.loading3d=!0;let n=mi(this.bundleUrl);Jo().then(i=>{if(this.loading3d=!1,!!this.isConnected){try{if(this.scene3d===void 0){let r=this.quality3dNow(),a=new i.HomeMapScene3D(n,r,this.quality3d==="auto"&&r==="high");a.onPick=(d,l)=>this.pick3d(d,l),a.onHover=d=>this.hover3d(d),a.onFaceDrag=d=>{let l=this.context();l!==void 0&&this.page.shape.faceDrag(l,d),this.tick++},a.onContextLost=()=>{this.lost3d=!0},a.onContextRestored=()=>this.restart3d(),a.onSlow=()=>{this.slow3d=!0,this.quality3d==="auto"&&this.scene3d?.setQuality(this.quality3dNow()),this.tick++},this.scene3d=a}}catch{this.failed3d="webgl"}this.tick++}},()=>{this.loading3d=!1,this.failed3d="load",this.tick++})}quality3dNow(){return Ta(this.quality3d,Ca(this.slow3d))}setQuality3d(t){this.quality3d=t,Ia(t),this.scene3d?.setQuality(this.quality3dNow())}restart3d(){this.scene3d!==void 0&&(this.view3d=this.scene3d.view()),this.drop3d(),this.lost3d=!1,this.tick++}pick3d(t,o={add:!1}){if(this.dialog!==void 0)return;this.floorMenu=!1;let n=this.baseFloor(),i=t?.kind==="pin"&&n!==void 0?fe(n,t.pinId):void 0,r=i===void 0?t:{kind:"object",roomId:i.roomId,object:i.object};if(o.add){r?.kind==="object"?this.select(nt(this.selection,{roomId:r.roomId,object:r.object})):r?.kind==="pin"&&this.select(kt(this.selection,r.pinId));return}let a=this.context();if(a!==void 0){if(r?.kind==="opening"&&this.page.doors.pickDoor(a,r.roomId,r.opening))return;this.page.doors.stop(a)}this.select(r),r?.kind==="opening"&&a!==void 0&&this.page.doors.clicked(this.context()??a,r.roomId,r.opening)}drop3d(){this.scene3d?.dispose(),this.scene3d=void 0,this.lost3d=!1}setHover(t){Ht(t,this.hover)||(this.hover=t)}hover3d(t){if(this.dialog!==void 0){this.setHover(void 0);return}this.setHover(t?.kind==="pin"?Bo(this.baseFloor(),{kind:"pin",pinId:t.pinId}):t)}hoverFor3d(){let t=pi(this.hover,this.selection);if(t!==void 0)return t.kind==="pin"?{kind:"pin",pinId:t.pinId}:t.kind==="object"?{kind:"object",roomId:t.roomId,object:t.object}:t.kind==="wall"?{kind:"wall",roomId:t.roomId,wall:t.wall}:t.kind==="opening"?{kind:"opening",roomId:t.roomId,opening:t.opening}:t.kind==="room"?{kind:"room",roomId:t.roomId}:void 0}planHoverAt(t,o,n){if(o.pointerType==="touch"||this.spaceHeld||this.dialog!==void 0||this.page.tool(t)!=="pick"||this.page.devices.choosing)return;let i=o.target;if(!(typeof i?.closest=="function"&&i.closest("[data-hme=turn], [data-hme=resize], [data-hme^=corner], [data-hme^=mid], [data-hme^=end]")!==null))return bs(t.floor,t.toScreen,n,ne(t.selection))}turnBack(){this.modelTurn=void 0,this.scene3d?.frameFloor(ze(this.doc).turn??Xn)}async load(t=!1){let o=this.hass;if(!o||!this.capable)return;let n=++this.loadSeq;t||(this.loading=this.session===void 0,this.loadError=void 0);try{let i=await mo(o);if(n!==this.loadSeq)return;this.unsupported=!1,this.loadError=void 0,this.show({doc:At(i?.doc)??null,rev:typeof i?.rev=="number"?i.rev:0}),this.loadScans()}catch(i){if(n!==this.loadSeq)return;let{code:r}=Ge(i);r==="unknown_command"?this.unsupported=!0:(!t||this.session===void 0)&&(this.loadError=Oi(i))}this.loading=!1}async loadScans(){let t=this.hass;if(t)try{this.scans=await ir(t)}catch{}}libraryPages(){let t=this.pageStep.library;return t===void 0?[]:(this.pagesHeld?.lib!==t&&(this.pagesHeld={lib:t,pages:pr(t,"pages").map(o=>({id:o.id,name:o.name}))}),this.pagesHeld.pages)}show(t){let o=this.hass;if(o&&kn(o,t),this.session===void 0)this.session=new vn(od(this.hassOrThrow()),t,()=>{this.afterChange(),this.catchUp()},n=>{this.hass&&kn(this.hass,n)}),this.needFit=!0;else if(!this.session.load(t))return;this.afterChange()}listen(){let t=this.hass,o=t?.connection;if(t===void 0||o===void 0||!this.capable||!this.isConnected||o===this.listenedTo)return;this.stopListening(),this.listenedTo=o;let n=o;typeof n.addEventListener=="function"&&(n.addEventListener("ready",this.onReconnect),this.readyConnection=n),typeof o.subscribeMessage=="function"&&(this.unsubscribe=Ki(t,i=>this.heard(i)).catch(()=>{}))}stopListening(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0,this.listenedTo=void 0;let t=this.unsubscribe;this.unsubscribe=void 0,t?.then(o=>o?.()).catch(()=>{})}heard(t){this.heardRev=t,this.catchUp()}catchUp(){let t=this.session,o=this.heardRev;if(!(t===void 0||o===void 0||t.busy||this.checking)){if(o===t.confirmed.rev){this.heardRev=void 0;return}this.recheck()}}async recheck(){let t=this.hass,o=this.session;if(t===void 0||o===void 0||!this.capable||o.busy||this.checking)return;this.checking=!0;let n=this.heardRev,i=!1;try{let r=await Ni(t,o.confirmed.rev);i=!0,r!==void 0&&this.session===o&&!o.busy&&(this.previewDoc=void 0,this.show({doc:At(r.doc)??null,rev:typeof r.rev=="number"?r.rev:0}),this.loadScans())}catch{}finally{this.checking=!1}i&&(this.heardRev===n?this.heardRev=void 0:this.catchUp())}hassOrThrow(){let t=this.hass;if(t===void 0)throw new Error("no hass");return t}afterChange(){let t=this.session?.doc?.floors??[];t.some(o=>k(o.id,this.floorId))||(this.floorId=t[0]?.id,this.needFit=!0),Yn(this.baseFloor(),this.selection)||(this.selection=void 0),Yn(this.baseFloor(),this.hover)||(this.hover=void 0),this.tick++}get doc(){return this.session?.doc??null}baseFloor(){let t=this.doc?.floors??[];return t.find(o=>k(o.id,this.floorId))??t[0]}shownFloor(){let t=this.baseFloor();return t===void 0||this.previewDoc===void 0?t:this.previewDoc.floors.find(o=>k(o.id,t.id))??t}apply(t,o={}){let n=this.session;return n===void 0?!1:(this.previewDoc=void 0,n.apply(t)?(o.floorId!==void 0&&(this.floorId=o.floorId),o.select!==void 0&&(this.selection=Bo(this.baseFloor(),o.select??void 0)),this.afterChange(),!0):(this.tick++,!1))}preview(t){let o=this.doc;this.previewDoc=t===void 0||o===null?void 0:t(o)??this.previewDoc,this.tick++}undo(){this.previewDoc=void 0,this.session?.undo()===!0&&this.afterChange()}redo(){this.previewDoc=void 0,this.session?.redo()===!0&&this.afterChange()}select(t){this.selection=Bo(this.baseFloor(),t)}setFloor(t){let o=this.context();o!==void 0&&this.page.leave?.(o),this.floorId=t,this.selection=void 0,this.floorMenu=!1,this.measure={},this.needFit=!0,this.userMoved=!1}setToggle(t,o){this.toggles={...this.toggles,[t]:o},t==="measure"&&(this.measure={}),t==="scan"&&o&&this.loadScans()}confirm(t){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(o=>{this.dialog={kind:"confirm",...t,done:n=>{this.dialog=void 0,o(n)}}})}ask(t){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(o=>{this.dialog={kind:"ask",...t,done:n=>{this.dialog=void 0,o(n)}}})}resizeStage(t,o){let n=this.stageSize.width===0;this.stageSize={width:t,height:o},(n||!this.userMoved)&&(this.needFit=!0)}fit(){let{width:t,height:o}=this.stageSize;t<=0||(this.view=Uo(this.baseFloor(),t,o),this.artScale=this.view.scale,this.needFit=!1,this.userMoved=!1)}fitPicked(){let{width:t,height:o}=this.stageSize,n=this.baseFloor();if(t<=0||n===void 0)return;let i=Xt(n,this.selection);i.length!==0&&(this.view=Uo({...n,rooms:i,pins:[]},t,o),this.artScale=this.view.scale,this.needFit=!1,this.userMoved=!0)}zoomBy(t,o){this.view!==void 0&&(this.view=Zn(this.view,t,o??[this.stageSize.width/2,this.stageSize.height/2]),this.userMoved=!0)}context(){let t=this.doc,o=this.shownFloor();if(t===null||o===void 0)return;let n=this.view??{scale:40,ox:0,oy:0},i=this.session;return{hass:this.hass,icons:this.icons,doc:t,floor:o,selection:this.selection,view:n,stage:this.stageSize,toggles:this.toggles,pages:this.libraryPages(),areas:nr(this.hass),scans:this.scans,furnitureBase:this.bundleUrl===void 0?void 0:mi(this.bundleUrl),canUndo:i?.canUndo??!1,canRedo:i?.canRedo??!1,toScreen:r=>Ga(n,r),px:r=>r*n.scale,toPlan:(r,a)=>this.toPlan(r,a),apply:(r,a)=>this.apply(r,a),preview:r=>this.preview(r),select:r=>this.select(r),setFloor:r=>this.setFloor(r),setToggle:(r,a)=>this.setToggle(r,a),drag:(r,a)=>this.drag(r,a),undo:()=>this.undo(),redo:()=>this.redo(),confirm:r=>this.confirm(r),ask:r=>this.ask(r),newId:()=>pt(),note:(r,a)=>{this.session!==void 0&&(this.session.note={kind:r,text:a}),this.tick++},redraw:()=>{this.tick++},hover:this.hover,setHover:r=>this.setHover(r),openAdd:(r,a)=>this.openAdd(r,a),openPage:this.onOpenPage,devices:this.homeDevices(),pageStep:this.pageStep}}openAdd(t="devices",o){let n=this.context();n!==void 0&&(this.floorMenu=!1,this.styleOpen&&this.closeStyle(),this.addDialog.open(n,t,o),this.addOpen=t)}closeAdd(){this.addOpen!==void 0&&(this.addOpen=void 0,this.updateComplete.then(()=>{this.renderRoot?.querySelector?.(".hme-add-btn")?.focus?.()}))}toPlan(t,o){let n=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return Ne(this.view??{scale:40,ox:0,oy:0},[t-n.left,o-n.top])}stagePoint(t){let o=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return[t.clientX-o.left,t.clientY-o.top]}drag(t,o){let n=this.stageEl;if(n===void 0)return;this.endDrag?.();let i=t.clientX,r=t.clientY,a=!1,d,l=0,p=typeof requestAnimationFrame=="function"?requestAnimationFrame:void 0,h=()=>{l=0,d!==void 0&&o.move(this.toPlan(d.clientX,d.clientY),d)};try{n.setPointerCapture?.(t.pointerId)}catch{}let c=y=>{let v=y;v.pointerId===t.pointerId&&(!a&&Math.hypot(v.clientX-i,v.clientY-r)<Kl||(a=!0,d=v,p===void 0?h():l===0&&(l=p(h))))},u=y=>{let v=y;v.pointerId===t.pointerId&&(b(),l!==0&&(cancelAnimationFrame(l),h()),o.end(this.toPlan(v.clientX,v.clientY),v,a))},b=()=>{n.removeEventListener("pointermove",c),n.removeEventListener("pointerup",u),n.removeEventListener("pointercancel",u);try{n.releasePointerCapture?.(t.pointerId)}catch{}this.endDrag===f&&(this.endDrag=void 0)},f=()=>{b(),l!==0&&(cancelAnimationFrame(l),l=0),o.cancel?.()};n.addEventListener("pointermove",c),n.addEventListener("pointerup",u),n.addEventListener("pointercancel",u),this.endDrag=f}onStageDown(t){if(this.stageEl=t.currentTarget,this.floorMenu=!1,this.dockMenu=void 0,this.setHover(void 0),this.dialog!==void 0)return;if(t.pointerType==="touch"&&(this.touches.set(t.pointerId,[t.clientX,t.clientY]),this.touches.size===2)){this.endDrag?.(),this.preview(void 0),this.pinch();return}if(this.viewKind==="model"){this.turnModel(t);return}if(t.button===1||this.spaceHeld){t.preventDefault?.(),this.pan(t,!1);return}if(t.button!==0)return;let o=this.context();if(o===void 0)return;if(this.toggles.measure){let i=this.toPlan(t.clientX,t.clientY),r=this.measure;this.measure=r.a===void 0||r.b!==void 0?{a:i}:{a:r.a,b:i};return}let n=this.toPlan(t.clientX,t.clientY);if(this.page.pointerDown?.(o,t,n)===!0){t.preventDefault?.();return}this.pan(t,!0)}onStageMove(t){if(this.stageEl=t.currentTarget,this.touches.has(t.pointerId)&&this.touches.set(t.pointerId,[t.clientX,t.clientY]),t.buttons!==0||this.viewKind==="model"){this.setHover(void 0);return}let o=this.toPlan(t.clientX,t.clientY);this.toggles.measure&&this.measure.a!==void 0&&this.measure.b===void 0&&(this.measure={...this.measure,hover:o});let n=this.context();n!==void 0&&(this.page.hover?.(n,o),this.setHover(this.planHoverAt(n,t,o)))}onStageLeave(){this.setHover(void 0);let t=this.context();t!==void 0&&this.page.hover?.(t,void 0)}onStageUp(t){this.touches.delete(t.pointerId)}onStageDrag(t){this.stageEl=t.currentTarget;let o=this.context();o===void 0||this.viewKind==="model"||this.dialog!==void 0||this.page.dragOver?.(o,this.toPlan(t.clientX,t.clientY),t)===!0&&(t.preventDefault?.(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"))}onStageDragLeave(t){let o=t.relatedTarget,n=t.currentTarget;if(o!==null&&n!==null&&typeof n.contains=="function"&&n.contains(o))return;let i=this.context();i!==void 0&&this.page.dragOver?.(i,void 0,t)}onStageDrop(t){this.stageEl=t.currentTarget;let o=this.context();o===void 0||this.viewKind==="model"||(t.preventDefault?.(),this.page.drop?.(o,this.toPlan(t.clientX,t.clientY),t))}pan(t,o){let n=this.view;if(n===void 0)return;let i=t.clientX,r=t.clientY;this.drag(t,{move:(a,d)=>{this.view={...n,ox:n.ox+d.clientX-i,oy:n.oy+d.clientY-r},this.userMoved=!0},end:(a,d,l)=>{!l&&o&&(this.selection=void 0)}})}pinch(){let t=this.stageEl,o=this.view,n=[...this.touches.keys()];if(t===void 0||o===void 0||n.length<2)return;let i=()=>n.map(u=>this.touches.get(u)),[r,a]=i(),d=Math.max(Math.hypot(a[0]-r[0],a[1]-r[1]),1),l=t.getBoundingClientRect(),p=[(r[0]+a[0])/2-l.left,(r[1]+a[1])/2-l.top],h=u=>{let b=u;if(!this.touches.has(b.pointerId))return;this.touches.set(b.pointerId,[b.clientX,b.clientY]);let[f,y]=i(),v=Math.max(Math.hypot(y[0]-f[0],y[1]-f[1]),1),M=[(f[0]+y[0])/2-l.left,(f[1]+y[1])/2-l.top],x=Zn(o,v/d,p);this.view={...x,ox:x.ox+M[0]-p[0],oy:x.oy+M[1]-p[1]},this.userMoved=!0},c=u=>{this.touches.delete(u.pointerId),t.removeEventListener("pointermove",h),t.removeEventListener("pointerup",c),t.removeEventListener("pointercancel",c)};t.addEventListener("pointermove",h),t.addEventListener("pointerup",c),t.addEventListener("pointercancel",c)}turnModel(t){let o=this.modelTurnNow(),n=t.clientX;this.drag(t,{move:(i,r)=>{let a=o+(r.clientX-n)*.5;a=((a+180)%360+360)%360-180,this.modelTurn=Math.round(a)},end:()=>{}})}modelTurnNow(){return this.modelTurn??ze(this.doc).turn??Xn}modelLookNow(){if(this.modelLook!==void 0)return this.modelLook;let t=ze(this.doc).look;return qt.includes(t)?t:"night"}onWheel(t){if(this.viewKind==="model"||this.view===void 0)return;this.stageEl=t.currentTarget,t.preventDefault?.();let o=t.deltaMode===1?16:t.deltaMode===2?400:1;if(t.ctrlKey||t.metaKey){this.zoomBy(Math.exp(-t.deltaY*o*.0025),this.stagePoint(t));return}this.view={...this.view,ox:this.view.ox-t.deltaX*o,oy:this.view.oy-t.deltaY*o},this.userMoved=!0}openKeys(){this.floorMenu=!1,this.dockMenu=void 0,this.spaceHeld=!1,this.keysOpen=!0,this.updateComplete.then(()=>{this.renderRoot?.querySelector?.(".hme-keys-box .hme-keys-done")?.focus?.()})}closeKeys(){this.keysOpen=!1}renderKeys(){if(!this.keysOpen)return g;let t=Si(Te());return m`<div class="hme-scrim" @pointerdown=${o=>{o.target===o.currentTarget&&this.closeKeys()}}>
      <div class="hme-keys-box" role="dialog" aria-modal="true" aria-labelledby="hme-keys-title">
        <div class="hme-keys-top"><h3 id="hme-keys-title">Keys</h3><span class="hme-flex"></span>
          <button type="button" class="hme-tb hme-keys-done" @click=${()=>this.closeKeys()}>Done</button></div>
        <div class="hme-keys-groups">
          ${t.map(o=>m`<section class="hme-keys-group" aria-label=${o.title}><h4>${o.title}</h4>
            <dl class="hme-keys">${o.keys.map(([n,i])=>m`<dt><kbd>${n}</kbd></dt><dd>${i}</dd>`)}</dl></section>`)}
        </div>
      </div>
    </div>`}toggleStyle(){if(this.styleOpen){this.closeStyle();return}this.floorMenu=!1,this.styleOpen=!0}closeStyle(){this.styleOpen=!1,this.stylePanel.leave()}render(){if(this.tick,!this.capable||this.unsupported)return this.calm(m`<b>${Fl}</b>`);if(this.loadError!==void 0)return this.calm(m`<span>Could not read the home map. ${this.loadError}</span>
        <button class="hme-tb" @click=${()=>{this.load()}}>Try again</button>`);if(this.loading||this.session===void 0)return this.calm(m`Loading…`);let t=this.doc;if(t===null||t.floors.length===0)return this.renderFirstRun();let o=this.context(),n=this.session.note;return m`<div class="hme">
      ${this.renderBar(t,o)}
      ${n===void 0?g:m`<div class="hme-note ${n.kind}" role="status"><span>${n.text}</span>
        <button class="hme-link" @click=${()=>this.session?.dismissNote()}>Dismiss</button></div>`}
      <div class=${this.tipsShown?"hme-body tips":"hme-body"}>
        <aside class="hme-insp" aria-label="Side panel">
          ${this.page.inspector(o)}
          <button type="button" class="hme-link hme-tips-link" aria-pressed=${this.tipsShown?"true":"false"} @click=${()=>this.toggleTips()}>${this.tipsShown?"Hide tips":"Show tips"}</button>
        </aside>
        <section class="hme-stage-wrap ${this.viewKind==="both"&&this.splitStack?"stack":""}" style=${`--hme-split:${this.split}%`}>${this.renderStage(o)}</section>
      </div>
      ${this.page.sheet?.(o)??g}
      ${this.renderDialog()}
      ${this.addOpen===void 0?g:this.addDialog.render(o,()=>this.closeAdd())}
      ${this.renderKeys()}
    </div>`}calm(t){return m`<div class="hme-calm"><div class="hme-empty">${t}</div></div>`}renderFirstRun(){let t=this.session?.note;return m`<div class="hme-calm"><div class="hme-empty hme-first">
      <b>${zl}</b>
      ${t===void 0?g:m`<span class="hme-first-note ${t.kind}" role="status">${t.text}</span>`}
      <button type="button" class="hme-tb primary hme-start-btn" @click=${()=>this.startByHand()}>${jl}</button>
      <span class="hme-first-line">${Nl}</span>
      ${this.onHome===void 0?g:m`<button type="button" class="hme-link" @click=${()=>this.onHome?.()}>‹ Shared</button>`}
    </div></div>`}startByHand(){let t=this.session;if(t===void 0)return;let o=pt(),n=xr(this.hass?.floors);if(!t.begin(r=>Hr(r,{id:o,name:n.name,story:n.story})))return;t.note=void 0,this.floorId=o,this.selection=void 0,this.needFit=!0,this.userMoved=!1,this.afterChange();let i=this.context();i!==void 0&&this.page.startDrawing(i)}renderBar(t,o){let n=this.baseFloor(),i=this.session?.state??{kind:"saved"},r=Te(),a=ze(t).look;return m`<header class="hme-bar">
      ${this.onHome===void 0?g:m`<button type="button" class="hme-back" @click=${()=>this.onHome?.()}>‹ Shared</button><span class="hme-vsep"></span>`}
      <strong class="hme-title">Home map</strong><span class="hme-beta">ALPHA</span>
      <div class="hme-floor-wrap">
        <button type="button" class="hme-tb hme-floor-btn" aria-label="Switch floor" aria-haspopup="menu" aria-expanded=${this.floorMenu?"true":"false"}
          @click=${()=>{this.floorMenu=!this.floorMenu}}>
          ${ai(n)}
          <span class="hme-floor-t"><span>${W(n)}</span><small>${O(n.rooms.length,"room")} · ${O(new Set(n.pins.map(d=>d.entityId)).size,"device")}</small></span>
          <span class="hme-caret" aria-hidden="true">▾</span>
        </button>
        ${this.floorMenu?this.renderFloorMenu(t,n):g}
      </div>
      <span class="hme-flex"></span>
      <div class="hme-seg" role="group" aria-label="View">
        <button type="button" class=${this.viewKind==="flat"?"on":""} aria-pressed=${this.viewKind==="flat"?"true":"false"} @click=${()=>{this.viewKind="flat"}}>Flat</button>
        <button type="button" class=${this.viewKind==="model"?"on":""} aria-pressed=${this.viewKind==="model"?"true":"false"} @click=${()=>{this.viewKind="model"}}>Model</button>
        <button type="button" class=${this.viewKind==="both"?"on":""} aria-pressed=${this.viewKind==="both"?"true":"false"}
          title="The plan to edit and the model following it, split the way that draws the plan biggest" @click=${()=>{this.viewKind="both"}}>Both</button>
      </div>
      <div class="hme-style-wrap">
        ${this.renderStyleButton(a)}
        ${this.styleOpen?this.stylePanel.panel(o,()=>this.closeStyle()):g}
      </div>
      <button type="button" class="hme-tb hme-icon" aria-label="Undo" title=${`Undo (${r?"\u2318Z":"Ctrl+Z"})`} ?disabled=${!o.canUndo} @click=${()=>this.undo()}>↶</button>
      <button type="button" class="hme-tb hme-icon" aria-label="Redo" title=${`Redo (${r?"\u21E7\u2318Z":"Ctrl+Shift+Z"})`} ?disabled=${!o.canRedo} @click=${()=>this.redo()}>↷</button>
      <span class="hme-status ${i.kind}" role="status" title=${i.kind==="error"?i.text:g}><span class="hme-status-dot"></span>${Bl(i)}</span>
      ${this.renderKeysButton()}
    </header>`}renderKeysButton(){return m`<button type="button" class="hme-tb hme-icon hme-keys-btn ${this.keysOpen?"on":""}" aria-label="Keys" aria-haspopup="dialog"
      aria-expanded=${this.keysOpen?"true":"false"} title="Every key (?)" @click=${()=>this.keysOpen?this.closeKeys():this.openKeys()}>?</button>`}renderStyleButton(t){return m`<button type="button" class="hme-tb hme-style-btn ${this.styleOpen?"on":""}" aria-haspopup="dialog" aria-expanded=${this.styleOpen?"true":"false"}
      title="How every map tile looks, unless a tile picks its own" @click=${()=>this.toggleStyle()}>
      <span class="hme-style-sw" style=${`background:${je(t,.2)}`} aria-hidden="true"></span>Home style</button>`}renderFloorMenu(t,o){return m`<div class="hme-pop" role="menu" aria-label="Floors">
      ${t.floors.map(n=>m`<div class="hme-pop-row ${k(n.id,o.id)?"on":""}">
        <button type="button" role="menuitem" class="hme-pop-main" @click=${()=>this.setFloor(n.id)}>
          ${ai(n)}<span class="hme-floor-t"><span>${W(n)}</span><small>${O(n.rooms.length,"room")} · ${O(new Set(n.pins.map(i=>i.entityId)).size,"device")}</small></span></button>
        <button type="button" class="hme-pop-act" title="Rename" aria-label=${`Rename ${W(n)}`} @click=${()=>{this.renameFloorAsk(n)}}>Rename</button>
        <button type="button" class="hme-pop-act danger" title=${t.floors.length===1?"The map keeps at least one floor":"Delete"} aria-label=${`Delete ${W(n)}`}
          ?disabled=${t.floors.length===1} @click=${()=>{this.deleteFloorAsk(n)}}>Delete</button>
      </div>`)}
      <button type="button" class="hme-pop-add" @click=${()=>{this.addFloorAsk()}}>＋ Add a floor</button>
    </div>`}async addFloorAsk(){this.floorMenu=!1;let t=this.doc;if(t===null)return;let o=Math.max(...t.floors.map(r=>r.story))+1,n=await this.ask({title:"Add a floor",label:"Name",value:o===1?"Upstairs":`Floor ${o+1}`,ok:"Add floor"});if(n===void 0)return;let i=pt();this.apply(r=>$r(r,{id:i,name:n,story:o}),{floorId:i,select:null})&&(this.needFit=!0)}async renameFloorAsk(t){this.floorMenu=!1;let o=await this.ask({title:"Rename floor",label:"Name",value:t.name||W(t),ok:"Rename"});o!==void 0&&this.apply(n=>Mo(n,t.id,o))}async deleteFloorAsk(t){this.floorMenu=!1,await this.confirm({title:`Delete ${W(t)}?`,text:`Its ${O(t.rooms.length,"room")} and ${O(t.pins.length,"device")} come off the map. Undo brings them back while this page is open.`,ok:"Delete floor",danger:!0})&&this.apply(n=>Pr(n,t.id),{select:null})}renderStage(t){let o=this.page,{width:n,height:i}=this.stageSize,r=this.viewKind==="model",a=this.viewKind==="both",d=r?g:o.pill?.(t)??g,l=this.spaceHeld?"grab":r?"ew-resize":this.toggles.measure?"crosshair":o.cursor?.(t)??"default",p=t.floor.rooms.length===0,h=this.model3d&&this.bundleUrl!==void 0,c=a?h?m`<div class="hme-stage model hme-split-r hme-3d">
      ${this.render3d(t)}
      ${this.renderModelDock(!1)}
    </div>`:m`<div class="hme-stage model hme-split-r" style=${`background:${je(this.modelLookNow())}`}>
      <svg class="hme-svg" width="100%" height="100%" viewBox=${`0 0 ${Math.max(n,1)} ${Math.max(i,1)}`} style="cursor:ew-resize"
        role="img" aria-label=${`Model of ${W(t.floor)}`}
        @pointerdown=${u=>this.onModelDown(u)}>
        ${this.renderModel(t,n,i)}
      </svg>
      ${this.renderModelDock(!1)}
    </div>`:g;return r&&h?m`<div class="hme-stage model hme-3d">
        ${this.render3d(t)}
        ${this.renderAddButton()}
        ${this.renderDock(t)}
      </div>`:m`<div class="hme-stage ${r?"model":"rail"} ${a?"hme-split-l":""}" style=${r?`background:${je(this.modelLookNow())}`:""}>
      <svg class="hme-svg" width="100%" height="100%" viewBox=${`0 0 ${Math.max(n,1)} ${Math.max(i,1)}`} style=${`cursor:${l}`}
        role="img" aria-label=${`Plan of ${W(t.floor)}`}
        @pointerdown=${u=>this.onStageDown(u)}
        @contextmenu=${u=>{u.ctrlKey&&u.preventDefault()}}
        @pointermove=${u=>this.onStageMove(u)}
        @pointerup=${u=>this.onStageUp(u)}
        @pointercancel=${u=>this.onStageUp(u)}
        @pointerleave=${()=>this.onStageLeave()}
        @wheel=${u=>this.onWheel(u)}
        @dragover=${u=>this.onStageDrag(u)}
        @dragleave=${u=>this.onStageDragLeave(u)}
        @drop=${u=>this.onStageDrop(u)}>
        ${r?this.renderModel(t,n,i):this.renderPlan(t,n,i)}
      </svg>
      ${d===g?g:m`<div class="hme-pill beside">${d}</div>`}
      ${r?g:o.stageExtra?.(t)??g}
      ${p&&!r&&!o.arrange.draw.active?m`<div class="hme-stage-empty"><b>No rooms on this floor yet.</b>
        <span>Draw one by hand, or scan this floor with the iPhone.</span>
        <button type="button" class="hme-tb" @click=${()=>{let u=this.context();u&&o.startDrawing(u)}}>＋ Draw a room by hand</button></div>`:g}
      ${this.renderAddButton(d!==g)}
      ${this.renderDock(t)}
    </div>${a?this.renderSplitHandle():g}${c}`}renderAddButton(t=!1){return m`<button type="button" class="hme-add-btn ${t?"compact":""}" aria-haspopup="dialog" aria-expanded=${this.addOpen===void 0?"false":"true"}
      aria-label="Add device or furniture" title="Add a device or a piece of furniture (A)" @click=${()=>this.openAdd()}>
      <span aria-hidden="true">＋</span>${t?"Add":"Add device or furniture"}</button>`}renderSplitHandle(){let t=n=>{let r=n.currentTarget.parentElement?.getBoundingClientRect();r!==void 0&&(this.split=this.splitStack?oi(n.clientY,r.top,r.height):oi(n.clientX,r.left,r.width))},o=()=>is(this.split);return m`<div class="hme-split-handle" role="separator" tabindex="0" aria-orientation=${this.splitStack?"horizontal":"vertical"}
      aria-label="Size of the plan and the model" aria-valuemin=${ei} aria-valuemax=${ti} aria-valuenow=${Math.round(this.split)}
      title="Drag to give the plan or the model more room. Double-click to even them."
      @pointerdown=${n=>{n.currentTarget.setPointerCapture?.(n.pointerId)}}
      @pointermove=${n=>{n.buttons!==0&&t(n)}}
      @pointerup=${o}
      @dblclick=${()=>{this.split=50,o()}}
      @keydown=${n=>{let i=this.splitStack?"ArrowUp":"ArrowLeft",r=this.splitStack?"ArrowDown":"ArrowRight";n.key!==i&&n.key!==r||(n.preventDefault(),n.stopPropagation(),this.split=qo(this.split+(n.key===i?-5:5)),o())}}><span aria-hidden="true"></span></div>`}toggleTips(){this.tipsShown=!this.tipsShown,as(this.tipsShown)}onModelDown(t){this.dialog!==void 0||t.button!==0||(this.stageEl=t.currentTarget,this.floorMenu=!1,this.dockMenu=void 0,this.turnModel(t))}renderPlan(t,o,n){let i=this.view;if(i===void 0||o<=0)return g;let r=this.planArt(t.floor,o,n,this.page.drawsPins?.(t)===!0?"none":"all"),a=i.scale/(this.artScale||i.scale);return H`${this.background(i,o,n)}
      <g class="hme-art" transform=${`translate(${i.ox.toFixed(2)} ${i.oy.toFixed(2)}) scale(${a.toFixed(5)})`} pointer-events="none">${r}</g>
      ${vs(t.floor,this.hover,this.selection,t.toScreen)}
      <g class="hme-labels" pointer-events="none">${this.labels(t)}</g>
      <g class="hme-overlay">${this.page.overlay(t)}</g>
      ${this.toggles.measure?this.measureMarks(t):g}`}planArt(t,o,n,i){let r=this.toggles.live?this.hass?.states:void 0,a=this.artScale||this.view.scale,d=`${gd(t)}|${po(r)}|${a}|${o}|${n}|${this.iconsTick}|${po(this.icons)}|${i}`;return d!==this.artKey&&(this.artKey=d,this.artHeld=xt({floor:t,states:r,look:"plan",names:!1,devices:i,furniture:!0,furnitureLook:Pa,oneWall:!0,glow:!0,width:o,height:n,icons:this.icons,frame:{scale:a,ox:0,oy:0}})),this.artHeld}background(t,o,n){let i=oe(this.selection)?Ke:we,r=20;if(this.toggles.grid)for(r=i*t.scale;r<8;)r*=10;let a=(t.ox%r+r)%r,d=(t.oy%r+r)%r;return H`<defs><pattern id="hme-bg" width=${r} height=${r} patternUnits="userSpaceOnUse" patternTransform=${`translate(${a.toFixed(1)} ${d.toFixed(1)})`}>
        ${this.toggles.grid?H`<path d=${`M${r} 0V${r}H0`} fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1" />`:H`<circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.09)" />`}
      </pattern></defs>
      <rect class="hme-bg" width=${o} height=${n} fill="url(#hme-bg)" />`}labels(t){let o=t.devices??Qe(t.hass),n=`${gd(t.floor)}|${po(t.doc)}|${t.view.scale}|${t.view.ox}|${t.view.oy}|${po(o)}`;if(this.labelsHeld?.key===n)return this.labelsHeld.art;let i=[],r=t.floor.pins.map(d=>({c:t.toScreen(d.at),r:15})),a=t.floor.rooms.map(d=>{let l=X(d),p=_e(d.outline);if(l===void 0||p===void 0)return g;let h=Tt(d,o,t.doc).main.length,c=Is(C(d),h),u=Qt(d),b=(p.maxX-p.minX)*t.view.scale,f=(p.maxY-p.minY)*t.view.scale,y=c.length*7.4+22;if(y>b*.95||f<26)return g;let v=Math.max(y,u.length*5.8+22)<=b*.95&&f>=48,M=v?Math.max(y,u.length*5.8+22):y,x=v?36:22,w={room:d.outline.map(K=>t.toScreen(K)),boxes:d.objects.filter(K=>K.hidden!==!0&&K.kind!=="rug").map(K=>le(de(K)).map(Y=>t.toScreen(Y))),circles:r,taken:i},P=t.toScreen(l),_=wi(P,[M/2,x/2],w),I=v&&_!==void 0;if(_===void 0&&v&&(_=wi(P,[y/2,11],w)),_===void 0)return g;let z=I?[M/2,x/2]:[y/2,11];i.push({c:_,half:z});let[S,E]=_,A=z[0]*2,q=z[1]*2;return H`<g class="hme-label"><rect x=${(S-A/2).toFixed(1)} y=${(E-q/2).toFixed(1)} width=${A.toFixed(1)} height=${q} rx=${I?9:7} fill="rgba(0,0,0,0.6)" />
        <text x=${S.toFixed(1)} y=${(E+(I?-3:4.5)).toFixed(1)} fill="#fff" font-size=${I?13:12} font-weight="600" text-anchor="middle">${c}</text>
        ${I?H`<text x=${S.toFixed(1)} y=${(E+11).toFixed(1)} fill="#aeaeb2" font-size="10" text-anchor="middle">${u}</text>`:g}</g>`});return this.labelsHeld={key:n,art:a},a}measureMarks(t){let o=this.measure;if(o.a===void 0)return H`<g class="hme-measure"></g>`;let n=o.b??o.hover,i=t.toScreen(o.a);if(n===void 0)return H`<g class="hme-measure" pointer-events="none"><circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" /></g>`;let r=t.toScreen(n),a=Math.hypot(n[0]-o.a[0],n[1]-o.a[1]),d=[(i[0]+r[0])/2,(i[1]+r[1])/2];return H`<g class="hme-measure" pointer-events="none">
      <line x1=${i[0]} y1=${i[1]} x2=${r[0]} y2=${r[1]} stroke="#ff9f0a" stroke-width="2" stroke-dasharray=${o.b===void 0?"6 4":"none"} />
      <circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" /><circle cx=${r[0]} cy=${r[1]} r="5" fill="#ff9f0a" />
      <g class="hme-tag"><rect x=${(d[0]-32).toFixed(1)} y=${(d[1]-22).toFixed(1)} width="64" height="20" rx="10" fill="#ff9f0a" />
      <text x=${d[0].toFixed(1)} y=${(d[1]-8).toFixed(1)} fill="#2a1a00" text-anchor="middle">${a.toFixed(2)} m</text></g></g>`}renderModel(t,o,n){if(o<=0)return g;let i=this.selection,r=ne(i),a=r===void 0?void 0:t.floor.rooms.find(p=>k(p.id,r)),d=Ee(i).flatMap(p=>t.floor.rooms.find(h=>k(h.id,p.roomId))?.objects[p.object]??[]),l=d.length>0?{boxes:d}:a!==void 0?{outline:a.outline}:void 0;return xt({mark:l,floor:t.floor,states:this.toggles.live?this.hass?.states:void 0,look:this.modelLookNow(),turn:this.modelTurnNow(),names:!0,devices:"lights",furniture:!0,glow:!0,width:o,height:n})}render3d(t){let o=this.failed3d==="webgl"?"The 3D view is not available on this device. The plan still works.":this.failed3d==="load"?"The 3D view could not be loaded. Reload the page to try again. The plan still works.":this.scene3d===void 0?"Loading the 3D view\u2026":void 0;return m`<div class="hme-3d-host" role="img" aria-label=${`3D model of ${W(t.floor)}. Drag to turn it, scroll to zoom, click a thing to pick it.`}></div>
      ${o===void 0?g:m`<div class="hme-3d-note">${o}</div>`}
      ${this.page.shape.sizeTag===void 0?g:m`<div class="hme-3d-size" role="status">${this.page.shape.sizeTag}</div>`}
      ${this.lost3d?m`<div class="hme-3d-note hme-3d-paused" role="status"><span>3D paused</span>
        <button type="button" class="hme-link" title="Make the 3D view again now" @click=${()=>this.restart3d()}>Start again</button></div>`:g}`}qualityItems(){let t=this.quality3dNow()==="low"?"Low":"High",o=n=>()=>this.setQuality3d(n);return[{group:"3D quality",radio:!0,label:this.quality3d==="auto"?`Auto (${t} here)`:"Auto",on:this.quality3d==="auto",title:"High on a strong computer, Low on a tablet or slower hardware",pick:o("auto")},{group:"3D quality",radio:!0,label:"High",on:this.quality3d==="high",title:"Soft shading in the corners, glowing bulbs and every shadow",pick:o("high")},{group:"3D quality",radio:!0,label:"Low",on:this.quality3d==="low",title:"Fewer effects and shadows, for a smoother view on slower hardware",pick:o("low")}]}renderModelDock(t,o){let n=this.model3d&&this.bundleUrl!==void 0,i=n?void 0:this.modelLookNow(),r=Fi(this.hass?.states),a=this.skyChoiceNow(r),d=this.northLive??this.doc?.north??0,l=qt.map(c=>({label:cd[c]??c,on:c===i,pick:()=>{this.modelLook=c,this.model3d=!1,this.dockMenu=void 0}}));this.bundleUrl!==void 0&&l.push({label:"3D",on:n,title:"The floor in real 3D, with its furniture and each light lit as it is now",pick:()=>{this.model3d=!0,this.dockMenu=void 0}}),n&&l.push(...this.qualityItems());let p=(c,u)=>({label:ud[c],on:a===c,title:u,pick:()=>{this.skyChoice=c,this.dockMenu=void 0}}),h=[...r===void 0?[]:[p("now","The sun where it is now: it moves through the day, and at night only the lights that are on light the rooms")],p("night","Night: only the lights that are on light the rooms"),p("day","Day: the sun comes in through the windows"),...r===void 0?[]:[{label:`North ${d}\xB0\u2026`,on:!1,title:"Where north is on the plan, so the sun comes in on the right side",pick:()=>{this.dockMenu="north"}}]];return m`<div class="hme-dock">
      ${n?this.dockMenuButton("sky",`Sky: ${ud[a]}`,"The sun and the sky in 3D, and where north is"):g}
      ${n&&(this.selection?.kind==="wall"||this.selection?.kind==="opening")?m`<button type="button" class="hme-tb hme-blue" title="Move the camera in front of it, to resize it. Turn back goes back." @click=${()=>this.scene3d?.lookAtPiece()}>Look at it</button>`:g}
      ${this.dockMenuButton("look",`Look: ${n?"3D":cd[i??"night"]??i}`,"How the model is drawn: the tiles' looks, or real 3D")}
      <button type="button" class="hme-tb" title=${n?"Show the whole floor from the home style's turn":"Back to the home style's turn"} @click=${()=>this.turnBack()}>⟲ Turn back</button>
      ${t&&o!==void 0?m`<span class="hme-vsep"></span>${o}`:g}
      ${this.dockMenuList("look","Look",l,"menuitemradio")}${this.dockMenuList("sky","Sky",h,"menuitemradio")}${this.renderNorthMenu(d)}
    </div>`}skyChoiceNow(t){return this.skyChoice==="now"&&t===void 0?"night":this.skyChoice}renderNorthMenu(t){return this.dockMenu!=="north"?g:m`<div class="hme-dock-pop hme-north" role="group" aria-label="North">
      <svg class="hme-north-dial" viewBox="-20 -20 40 40" aria-hidden="true">
        <circle r="18" />
        <g transform=${`rotate(${t})`}><path class="n" d="M0 -15 L4 0 L-4 0 Z" /><path d="M0 15 L4 0 L-4 0 Z" /></g>
      </svg>
      <label class="hme-north-row">Where north is on the plan
        <input type="range" class="hme-range" min="0" max="359" step="1" .value=${G(String(t))} style=${Oe(t,0,359)}
          @input=${o=>{this.northLive=Number(o.target.value)}}
          @change=${o=>{let n=Number(o.target.value);this.northLive=void 0,this.context()?.apply(i=>la(i,n))}} />
      </label>
      <span class="hme-val mono">${t}°</span>
    </div>`}renderDock(t){let o="Draw what Home Assistant's devices are doing now",n=()=>this.setToggle("live",!this.toggles.live);if(this.viewKind==="model")return this.renderModelDock(!0,m`<button type="button" class="hme-tb ${this.toggles.live?"on":""}" aria-pressed=${this.toggles.live?"true":"false"}
        title=${o} @click=${n}><span class="hme-live-dot"></span>Live states</button>`);let i=this.stageSize.width>0?Uo(this.baseFloor(),this.stageSize.width,this.stageSize.height):void 0,r=this.view===void 0||i===void 0?100:Va(this.view,i),a=[...(this.page.viewItems?.(t)??[]).map(d=>({label:d.label,on:d.on,title:d.title,pick:()=>d.flip()})),{label:"Live states",on:this.toggles.live,title:o,pick:n},...this.bundleUrl===void 0?[]:this.qualityItems()];return m`<div class="hme-dock">
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom out" title="Zoom out (−)" @click=${()=>this.zoomBy(1/Yt)}>−</button>
      <span class="hme-zoom mono">${r}%</span>
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom in" title="Zoom in (+)" @click=${()=>this.zoomBy(Yt)}>＋</button>
      <button type="button" class="hme-tb" title="Fit the floor (0)" @click=${()=>this.fit()}>Fit</button>
      ${Xt(t.floor,t.selection).length===0?g:m`<button type="button" class="hme-tb" title="Fit the picked room (Z)" @click=${()=>this.fitPicked()}>Fit room</button>`}
      <span class="hme-vsep"></span>
      ${this.page.dock?.(t)??g}
      ${this.dockMenuButton("view","View","What the plan shows: the grid, names, live states and more")}
      ${this.dockMenuList("view","View",a,"menuitemcheckbox")}
    </div>`}dockMenuButton(t,o,n){let i=this.dockMenu===t;return m`<button type="button" class="hme-tb ${i?"on":""}" aria-haspopup="menu" aria-expanded=${i?"true":"false"} title=${n}
      @click=${()=>{this.dockMenu=i?void 0:t}}>${o} <span class="hme-caret" aria-hidden="true">▾</span></button>`}dockMenuList(t,o,n,i){return this.dockMenu!==t?g:m`<div class="hme-dock-pop" role="menu" aria-label=${o}>
      ${n.map((r,a)=>m`${r.group!==void 0&&r.group!==n[a-1]?.group?m`<div class="hme-dock-head" role="presentation">${r.group}</div>`:g}
        <button type="button" role=${r.radio===!0?"menuitemradio":i} aria-checked=${r.on?"true":"false"} class="hme-dock-item ${r.on?"on":""}"
        title=${r.title??r.label} @click=${()=>r.pick()}><span class="hme-check" aria-hidden="true">${r.on?"\u2713":""}</span>${r.label}</button>`)}
    </div>`}renderDialog(){let t=this.dialog;if(t===void 0)return g;let o=()=>t.kind==="confirm"?t.done(!1):t.done(void 0),n=i=>{t.kind==="confirm"?t.done(!0):t.done((i?.querySelector("input")?.value??t.value).trim()||t.value)};return m`<div class="hme-scrim" @pointerdown=${i=>{i.target===i.currentTarget&&o()}}>
      <div class="hme-dialog" role="dialog" aria-modal="true" aria-label=${t.title}
        @keydown=${i=>{i.key==="Escape"&&(i.stopPropagation(),o()),i.key==="Enter"&&(i.preventDefault(),n(i.currentTarget))}}>
        <h3>${t.title}</h3>
        ${t.kind==="confirm"?t.text===void 0?g:m`<p>${t.text}</p>`:m`<label class="hme-dialog-field"><span>${t.label}</span><input type="text" maxlength="100" .value=${t.value} autofocus /></label>`}
        <div class="hme-dialog-row">
          <button type="button" class="hme-tb" @click=${o}>Cancel</button>
          <button type="button" class="hme-tb primary ${t.kind==="confirm"&&t.danger===!0?"danger-fill":""}"
            @click=${i=>n(i.currentTarget.closest(".hme-dialog"))}>${t.ok}</button>
        </div>
      </div>
    </div>`}static{this.styles=[rr,Bi,sd,Js]}};D([ae({attribute:!1})],R.prototype,"hass",2),D([ae({type:Boolean,reflect:!0})],R.prototype,"narrow",2),D([ae({attribute:!1})],R.prototype,"icons",2),D([ae({attribute:!1})],R.prototype,"iconsTick",2),D([ae({attribute:!1})],R.prototype,"capable",2),D([ae({attribute:!1})],R.prototype,"bundleUrl",2),D([ae({attribute:!1})],R.prototype,"onHome",2),D([ae({attribute:!1})],R.prototype,"onOpenPage",2),D([ae({attribute:!1})],R.prototype,"owners",2),D([ae({attribute:!1})],R.prototype,"phones",2),D([F()],R.prototype,"unsupported",2),D([F()],R.prototype,"loading",2),D([F()],R.prototype,"loadError",2),D([F()],R.prototype,"floorId",2),D([F()],R.prototype,"selection",2),D([F()],R.prototype,"walls",2),D([F()],R.prototype,"styleOpen",2),D([F()],R.prototype,"viewKind",2),D([F()],R.prototype,"splitStack",2),D([F()],R.prototype,"split",2),D([F()],R.prototype,"tipsShown",2),D([F()],R.prototype,"view",2),D([F()],R.prototype,"artScale",2),D([F()],R.prototype,"stageSize",2),D([F()],R.prototype,"toggles",2),D([F()],R.prototype,"scans",2),D([F()],R.prototype,"measure",2),D([F()],R.prototype,"floorMenu",2),D([F()],R.prototype,"dockMenu",2),D([F()],R.prototype,"dialog",2),D([F()],R.prototype,"modelLook",2),D([F()],R.prototype,"model3d",2),D([F()],R.prototype,"skyChoice",2),D([F()],R.prototype,"northLive",2),D([F()],R.prototype,"modelTurn",2),D([F()],R.prototype,"spaceHeld",2),D([F()],R.prototype,"tick",2),D([F()],R.prototype,"hover",2),D([F()],R.prototype,"addOpen",2),D([F()],R.prototype,"quality3d",2),D([F()],R.prototype,"lost3d",2),D([F()],R.prototype,"keysOpen",2);var fd=new WeakMap,Ul=1;function po(s){if(s===void 0)return 0;let e=fd.get(s);return e===void 0&&fd.set(s,e=Ul++),e}var gd=s=>po(s);customElements.get("wa-home-map-editor")||customElements.define("wa-home-map-editor",R);export{Kl as HOME_MAP_DRAG_SLOP,zl as HOME_MAP_EMPTY_TEXT,Nl as HOME_MAP_SCAN_TEXT,jl as HOME_MAP_START_TEXT,Fl as HOME_MAP_UPDATE_TEXT,R as WaHomeMapEditor,Bl as homeMapSaveWords};
