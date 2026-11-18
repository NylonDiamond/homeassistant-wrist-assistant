import{a as Gt,b as Vo,c as qa,d as Xa,e as Qe,f as Ya,g as Za,h as ei,i as fe,j as ti,k as oi,l as ni,m as ii,n as Je,o as Vt,p as et,q as qo,r as Ht,s as Qa,t as Ja,u as we,v as es,w as ts}from"./chunk-F6RVXDVR.js";import{a as nt}from"./chunk-46KUYLK6.js";import{a as ri,b as ai,c as tt,d as ot,e as qt,f as os,g as ns,h as is,i as rs,j as as,k as ss}from"./chunk-5Q2ZOAK2.js";import{d as fs}from"./chunk-ZEQBFCDM.js";import"./chunk-Y5CFVJ2U.js";import{a as Xo,b as ae,c as ye,d as Xt,e as Yt,f as ls,g as ps,h as Zt,i as di,j as Ne,k as gs,l as bs,m as vs,n as Pt}from"./chunk-5JUCENRL.js";import{A as us,c as hs,e as ms,f as cs}from"./chunk-JBNGOV2H.js";import{C as ds}from"./chunk-UWAHYY2H.js";import{f as si}from"./chunk-JSTALZCD.js";import"./chunk-NPN3AGMD.js";import{$ as qe,$a as ya,Aa as wt,Ab as xt,B as Ho,Ba as Gn,Bb as Bo,C as Kr,Ca as To,Cb as Ia,Da as la,Db as Wo,Ea as pa,Eb as Ra,Fa as ha,Fb as Da,G as _n,Ga as Vn,Gb as Aa,Ha as So,Hb as Oa,Ia as qn,Ib as La,J as Po,Ja as Io,Jb as Fa,K as Br,Ka as Ro,Kb as _a,L as Wr,La as Do,Lb as je,M as ft,Ma as ma,Mb as Jn,N as Ur,Na as Ao,Nb as Uo,Oa as ca,Ob as za,Pa as yt,Pb as ja,Q as zn,Qa as Oo,Qb as Na,Ra as ua,Rb as Ka,S as jn,Sa as Bt,Sb as Ba,T as gt,Ta as Xe,Tb as Wa,U as Gr,Ua as fa,Ub as Ua,V as Vr,Va as ga,Vb as Ga,Wa as ba,Wb as Ut,X as bt,Xa as Mt,Xb as Va,Y as Ve,Ya as kt,Yb as Ze,Z as W,Za as va,Zb as Go,_ as vt,_a as wa,_b as Te,a as re,aa as qr,ab as Wt,b as ue,ba as Nn,bb as Lo,c as An,ca as Xr,cb as Fo,d as On,da as Yr,db as _o,e as Ce,ea as zt,eb as Xn,fa as jt,fb as Ma,g as jr,ga as Zr,gb as zo,ha as Nt,hb as Yn,i as Ln,ia as Qr,ib as ka,ja as Jr,jb as jo,ka as ea,kb as $a,la as ta,lb as xa,ma as Eo,mb as Ha,na as Kn,nb as Pa,oa,ob as Zn,pa as Bn,pb as ze,q as _t,qa as na,qb as $t,ra as ia,rb as Ea,s as Fn,sa as Co,sb as Ca,t as _e,ta as ra,tb as Qn,u as Z,ua as Wn,ub as Ye,v as Y,va as Un,vb as No,w as V,wa as Kt,wb as Ko,x as J,xa as aa,xb as Ta,y as ee,ya as sa,yb as Sa,z as Nr,za as da,zb as ve}from"./chunk-KU6PC35X.js";import{_ as _r,ma as zr}from"./chunk-IY2Z5G74.js";import{a as ur,b as fr,c as gr,j as q}from"./chunk-UJEOSPM7.js";import{a as Rr,g as Dn,i as ws}from"./chunk-MFCZQSWH.js";import{A as Hr,B as k,E as K,F as T,G as wo,H as ce,I as Pr,J as Q,L as Er,N as Ee,O as Cr,P as yo,Q as Mo,W as Tr,X as Sr,Y as Ir,Z as ie,b as vr,d as wr,e as yr,h as At,i as Mr,j as kr,v as Ot,w as $r,x as xr,y as Lt}from"./chunk-4ILUENBV.js";import{a as Ar,l as Or}from"./chunk-Y354TWPI.js";import{b as ut,g as Fr}from"./chunk-QLXAPXSU.js";import{i as mt,l as ko,m as Lr,n as $o,u as ct,v as Ft,w as xo}from"./chunk-BHQ73QDG.js";import{a as Fe,i as Dr}from"./chunk-PWVBP3GH.js";import{Bg as pr,Wg as vo,Xg as hr,Yg as mr,Zg as cr,b as me,bg as Dt,c as _,th as br}from"./chunk-GFNODYNE.js";import{Tb as Ge,l as ht}from"./chunk-NLJVSYDV.js";import{b as bo,f as c,g as x,h as dr,i as g,l as lr}from"./chunk-6ZDBXU6B.js";import{a as D}from"./chunk-LO2NM3CE.js";function se(a){return a?.kind==="wall"||a?.kind==="corner"||a?.kind==="opening"}function Qt(a,e){if(e===void 0)return[];let o=(e.kind==="pin"?[e.pinId]:e.kind==="pins"?e.pinIds:[]).flatMap(i=>{let r=a.pins.find(d=>k(d.id,i));if(r===void 0)return[];let s=a.rooms.find(d=>r.roomId!==void 0&&k(d.id,r.roomId))??Pr(a,r.at);return s===void 0?[]:[s.id]}),n=e.kind==="objects"?e.items.map(i=>i.roomId):e.kind==="pin"||e.kind==="pins"?o:[e.roomId];return a.rooms.filter(i=>n.some(r=>k(r,i.id)))}function de(a){return a===void 0||a.kind==="pin"||a.kind==="pins"||a.kind==="objects"?void 0:a.roomId}function Se(a){return a?.kind==="object"?[{roomId:a.roomId,object:a.object}]:a?.kind==="objects"?a.items.map(e=>({roomId:e.roomId,object:e.object})):[]}var Yo=(a,e)=>k(a.roomId,e.roomId)&&a.object===e.object;function ys(a){let e=[];for(let t of a)e.some(o=>Yo(o,t))||e.push({roomId:t.roomId,object:t.object});if(e.length!==0)return e.length===1?{kind:"object",roomId:e[0].roomId,object:e[0].object}:{kind:"objects",items:e}}function it(a,e){let t=Se(a);return t.some(o=>Yo(o,e))?ys(t.filter(o=>!Yo(o,e))):ys([...t,e])}function Zo(a,e){if(e?.kind!=="pin"||a===void 0)return e;let t=ve(a,e.pinId);return t===void 0?e:{kind:"object",roomId:t.roomId,object:t.object}}function Ms(a,e,t){return Se(a).some(o=>Yo(o,{roomId:e,object:t}))}function li(a,e){if(e===void 0)return!0;if(a===void 0)return!1;if(e.kind==="pin")return a.pins.some(o=>k(o.id,e.pinId));if(e.kind==="pins")return e.pinIds.every(o=>a.pins.some(n=>k(n.id,o)));if(e.kind==="objects")return e.items.every(o=>a.rooms.find(n=>k(n.id,o.roomId))?.objects[o.object]!==void 0);let t=a.rooms.find(o=>k(o.id,e.roomId));if(t===void 0)return!1;switch(e.kind){case"room":return!0;case"wall":return W(t)[e.wall]!==void 0;case"corner":return t.outline[e.corner]!==void 0;case"opening":return t.openings[e.opening]!==void 0;case"object":return t.objects[e.object]!==void 0}}function Et(a,e){return a===void 0||e===void 0?a===e:JSON.stringify(a)===JSON.stringify(e)}var ks=4,$s=2400;function xs(a,e){return[a.ox+e[0]*a.scale,a.oy+e[1]*a.scale]}function Ke(a,e){return[(e[0]-a.ox)/a.scale,(e[1]-a.oy)/a.scale]}function Qo(a,e,t,o=44,n=72){let r=a===void 0||a.rooms.length===0&&a.pins.length===0?{minX:-5,minY:-5,maxX:5,maxY:5}:wo(a),s=Math.max(r.maxX-r.minX,1),d=Math.max(r.maxY-r.minY,1),l=Ts(Math.min(Math.max(e-o*2,40)/s,Math.max(t-n*2,40)/d),ks,$s);return{scale:l,ox:e/2-(r.minX+r.maxX)/2*l,oy:t/2-(r.minY+r.maxY)/2*l}}function pi(a,e,t){let o=Ts(a.scale*e,ks,$s),n=o/a.scale;return{scale:o,ox:t[0]-(t[0]-a.ox)*n,oy:t[1]-(t[1]-a.oy)*n}}function Hs(a,e){return Math.round(a.scale/e.scale*100)}var Jt=1.25;function Ps(a){if(typeof a!="object"||a===null)return;let e=a;return{tag:typeof e.tagName=="string"?e.tagName.toUpperCase():"",type:typeof e.type=="string"?e.type.toLowerCase():"text",editable:e.isContentEditable===!0}}var Es=["button","submit","reset","image"],yl=["checkbox","radio","range","color","file"];function hi(a){let e=Ps(a);return e===void 0?!1:e.editable||e.tag==="TEXTAREA"?!0:e.tag==="INPUT"&&!Es.includes(e.type)&&!yl.includes(e.type)}function Cs(a){let e=Ps(a);return e===void 0?!1:hi(a)||e.tag==="SELECT"?!0:e.tag==="INPUT"&&!Es.includes(e.type)}function te(a,e){if(e)return;let t=a.metaKey===!0||a.ctrlKey===!0,o=a.key.length===1?a.key.toLowerCase():a.key;if(t)return o==="z"?a.shiftKey===!0?"redo":"undo":o==="y"?"redo":a.shiftKey!==!0&&o==="c"?"copy":a.shiftKey!==!0&&o==="v"?"paste":a.shiftKey!==!0&&o==="d"?"duplicate":void 0;if(a.altKey===!0)return;switch(o){case"Escape":return"cancel";case"Delete":case"Backspace":return"delete";case"Enter":return"enter";case"+":case"=":return"zoomIn";case"-":return"zoomOut";case"0":return"fit";case"?":return"help"}let n=a.shiftKey===!0?.1:.01;if(o==="ArrowLeft")return{nudge:[-n,0]};if(o==="ArrowRight")return{nudge:[n,0]};if(o==="ArrowUp")return{nudge:[0,-n]};if(o==="ArrowDown")return{nudge:[0,n]};if(/^[a-z]$/.test(o)&&a.shiftKey!==!0)return{letter:o}}function Ie(){let a=globalThis.navigator,e=`${typeof a?.platform=="string"?a.platform:""} ${typeof a?.userAgent=="string"?a.userAgent:""}`;return/Mac|iPhone|iPad/.test(e)}var Ts=(a,e,t)=>Math.min(Math.max(a,e),t);function oe(a,e=2){return`${(Math.round(a*10**e)/10**e).toFixed(e)} m`}function eo(a,e=2){let t=(Math.round(a*10**e)/10**e).toFixed(e);return/^-0(\.0*)?$/.test(t)?t.slice(1):t}function mi(a){let e=a.trim().replace(",",".").replace(/\s*(m|cm|°|deg)$/i,"");if(e===""||!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(e))return;let t=Number(e);if(Number.isFinite(t))return/cm$/i.test(a.trim())?t/100:t}function Jo(a){if(a.outline.length<3)return{width:0,depth:0,area:0};let{a0:e,a1:t,c0:o,c1:n}=_n(a,Fn(a));return{width:t-e,depth:n-o,area:Math.abs(Po(a.outline))}}function to(a){let{width:e,depth:t}=Jo(a);return`${e.toFixed(1)} \xD7 ${t.toFixed(1)} m`}function Ss(a){if(a.outline.length<3)return a.outline.slice();let{a0:e,a1:t,c0:o,c1:n,point:i}=_n(a,Fn(a));return[i(e,o),i(t,o),i(t,n),i(e,n)]}function Is(a,e){let t=W(a)[e];if(t===void 0)return"inner";let o=Math.max(Math.hypot(t.b[0]-t.a[0],t.b[1]-t.a[1]),1e-9),n=-(t.b[1]-t.a[1])/o,i=(t.b[0]-t.a[0])/o,r=[(t.a[0]+t.b[0])/2,(t.a[1]+t.b[1])/2],s=Math.max(t.t,.1)+.1,d=Z(a.outline,[r[0]+n*s,r[1]+i*s]),l=Z(a.outline,[r[0]-n*s,r[1]-i*s]);if(d&&l)return"inner";if(d)n=-n,i=-i;else if(!l){let p=Y(a);p!==void 0&&(p[0]-r[0])*n+(p[1]-r[1])*i>0&&(n=-n,i=-i)}return Math.abs(n)>Math.abs(i)?n>0?"right":"left":i>0?"bottom":"top"}function oo(a,e,t){let o=Is(a,e);return`${t}, ${o} wall`}function Rs(a){let e=W(a).map((o,n)=>Is(a,n)),t=new Map;return e.map((o,n)=>{let i=(t.get(o)??0)+1;t.set(o,i);let r=`${o.charAt(0).toUpperCase()}${o.slice(1)} wall`;return i===1&&e.indexOf(o,n+1)<0?r:`${r} ${i}`})}function no(a){return a.kind==="opening"?"Way through":a.kind==="window"?a.style==="sliding"?"Sliding window":"Window":a.style==="double"?"Double door":a.style==="sliding"?"Sliding door":"Door"}var Ml={sofa:"Sofa",table:"Table",chair:"Chair",bed:"Bed",storage:"Storage",television:"TV",bathtub:"Bath",sink:"Basin",toilet:"Toilet",stove:"Hob",oven:"Oven",refrigerator:"Fridge",dishwasher:"Dishwasher",washerDryer:"Washer dryer",fireplace:"Fireplace",stairs:"Stairs"};function rt(a){let e=Ml[a];if(e!==void 0)return e;let t=a.replace(/([a-z0-9])([A-Z])/g,"$1 $2").toLowerCase();return t.charAt(0).toUpperCase()+t.slice(1)}function O(a,e,t=`${e}s`){return`${a} ${a===1?e:t}`}var ci=25,ui=80,Ds="wa.homeMap.split",As="wa.homeMap.tips";function en(){try{return globalThis.localStorage??void 0}catch{return}}function tn(a){return Number.isFinite(a)?Math.min(Math.max(a,ci),ui):50}function fi(a,e,t){return t<=0?50:tn((a-e)/t*100)}function Os(){try{let a=en()?.getItem(Ds);return a==null?50:tn(Number(a))}catch{return 50}}function Ls(a){try{en()?.setItem(Ds,String(Math.round(a*10)/10))}catch{}}function Fs(){try{return en()?.getItem(As)==="1"}catch{return!1}}function _s(a){try{en()?.setItem(As,a?"1":"0")}catch{}}var kl=66;function zs(a,e,t,o){if(a<=0||e<=0||t<=0||o<=0)return!1;let n=(i,r)=>Math.min(Math.max(i-kl-24,1)/t,Math.max(r-96,1)/o);return n(a,e/2)>n(a/2,e)*1.1}function A(a,e,t,o=""){return c`<section class="hme-card ${o}">
    <div class="hme-h">${a}${t===void 0?g:c`<span class="hme-h-end">${t}</span>`}</div>
    ${e}
  </section>`}var Ks="wa-home-map-fold-";function io(a){try{return globalThis.localStorage?.getItem(Ks+a)==="1"}catch{return!1}}function ro(a,e){try{globalThis.localStorage?.setItem(Ks+a,e?"1":"0")}catch{}}function Re(a,e,t,o,n=""){let i=io(a);return c`<details class="hme-card hme-fold ${n}" ?open=${i} data-fold=${a}
    @toggle=${r=>ro(a,r.currentTarget.open)}>
    <summary class="hme-h">${e}<span class="hme-h-end">${t??""}<span class="hme-fold-caret" aria-hidden="true">›</span></span></summary>
    <div class="hme-fold-body">${o}</div>
  </details>`}function B(a,...e){return c`<div class="hme-r"><span class="hme-l">${a}</span>${e}</div>`}function U(a,e=!1){return c`<p class="hme-hint ${e?"keep":""}">${a}</p>`}function $l(a,e,t){return t||a===e?dr:e}var gi=class extends gr{constructor(t){super(t);this.latest="";this.waiting=!1;if(t.type!==ur.PROPERTY)throw new Error("keepTyping is for a .value binding")}render(t){return t}update(t,[o]){let n=t.element;this.latest=o;let i=n.matches(":focus");return i&&!this.waiting&&(this.waiting=!0,n.addEventListener("blur",()=>{this.waiting=!1,n.value!==this.latest&&(n.value=this.latest)},{once:!0})),$l(n.value,o,i)}},Bs=fr(gi),js=3;function xl(a,e){return a==="\xB0"?1:10**-e}function z(a){let e=a.digits??2,t=a.step??xl(a.unit,e),o=a.value===void 0?"":eo(a.value,e),n=p=>Math.min(Math.max(p,a.min??-1/0),a.max??1/0),i=p=>eo(p,e)===o,r=p=>{let h=mi(p.value);if(h===void 0||a.min!==void 0&&h<a.min||a.max!==void 0&&h>a.max||i(h)){p.value=o;return}a.set(h)},s=p=>{let h=p.currentTarget,m=h.querySelector("input");if(m===null||a.disabled===!0||p.button!==0||m.matches(":focus"))return;p.preventDefault();let u=a.value,b=p.clientX,f=!1,w=u;try{h.setPointerCapture(p.pointerId)}catch{}let v=$=>{if(u===void 0)return;let y=$.clientX-b;if(!f&&Math.abs(y)<js)return;f||h.classList.add("scrubbing"),f=!0;let P=$.shiftKey?10:$.altKey?.1:1;w=n(Number((u+(y-Math.sign(y)*js)*t*P).toFixed(e+($.altKey?1:0)))),m.value=eo(w,e),a.preview?.(w)},M=$=>{if(h.removeEventListener("pointermove",v),h.removeEventListener("pointerup",M),h.removeEventListener("pointercancel",M),h.classList.remove("scrubbing"),!f){m.focus(),m.select();return}a.preview?.(void 0),$.type!=="pointercancel"&&w!==void 0&&!i(w)?a.set(w):m.value=o};h.addEventListener("pointermove",v),h.addEventListener("pointerup",M),h.addEventListener("pointercancel",M)},d=a.tag!==void 0&&a.tag.length>1,l=c`<span class="hme-in hme-num ${a.disabled===!0?"off":""}" style=${a.width===void 0?g:`flex:0 0 ${a.width}`}
    title=${a.disabled===!0?g:"Drag sideways to change it, click to type"} @pointerdown=${s}>
    ${a.tag===void 0||d?g:c`<span class="hme-ntag" aria-hidden="true">${a.tag}</span>`}
    <input type="text" inputmode="decimal" aria-label=${a.label} .value=${Bs(o)} ?disabled=${a.disabled===!0}
      placeholder=${a.value===void 0?"Mixed":""}
      @change=${p=>r(p.target)}
      @keydown=${p=>{let h=p.target;if(p.key==="Enter"&&h.blur(),p.key==="Escape"&&(h.value=o,h.blur()),(p.key==="ArrowUp"||p.key==="ArrowDown")&&a.value!==void 0){p.preventDefault();let m=mi(h.value)??a.value,u=n(Number((m+(p.key==="ArrowUp"?1:-1)*t*(p.shiftKey?10:1)).toFixed(e)));h.value=eo(u,e),i(u)||a.set(u)}}} />${a.unit===void 0?g:c`<span class="hme-unit">${a.unit}</span>`}</span>`;return d?c`<div class="hme-lab"><span class="hme-lab-t">${a.tag}</span>${l}</div>`:l}var Ct=new WeakMap,Ns=new WeakMap;function ao(a){let e=a.value.toLowerCase(),t=o=>{let n=Ct.get(o);n!==void 0&&(Ct.delete(o),a.preview(void 0),o.value.toLowerCase()!==n&&(Ns.set(o,o.value.toLowerCase()),a.set(o.value)))};return c`<input type="color" .value=${q(e)} aria-label=${a.label}
    @input=${o=>{let n=o.target;Ct.has(n)||Ct.set(n,e);let i=n.value.toLowerCase();a.preview(i===Ct.get(n)?void 0:i)}}
    @change=${o=>{let n=o.target,i=n.value.toLowerCase();Ct.has(n)?t(n):i!==e&&i!==Ns.get(n)&&a.set(n.value)}}
    @blur=${o=>t(o.target)} />`}function ge(...a){return c`<div class="hme-fields" style=${`--n:${a.length}`}>${a}</div>`}function bi(a,...e){return c`<div class="hme-group"><div class="hme-gl">${a}</div>${e}</div>`}function Tt(a){return c`<span class="hme-in"><input type="text" aria-label=${a.label} maxlength=${a.max??100} placeholder=${a.placeholder??""}
    .value=${Bs(a.value)}
    @change=${e=>{let t=e.target.value;t.trim()!==a.value.trim()&&a.set(t)}}
    @keydown=${e=>{e.key==="Enter"&&e.target.blur()}} /></span>`}function Me(a){return c`<span class="hme-in hme-sel ${a.cls??""}"><select aria-label=${a.label} @change=${e=>a.set(e.target.value)}>
    ${a.options.map(e=>c`<option value=${e.value} ?disabled=${e.disabled===!0} .selected=${q(e.value===a.value)}>${e.label}</option>`)}
  </select></span>`}function on(a){return c`<span class="hme-menu ${a.cls??""}"><select aria-label=${a.label} @change=${e=>{let t=e.target,o=t.value;t.value="",o!==""&&a.pick(o)}}>
    <option value="" .selected=${q(!0)}>${a.label}</option>
    ${a.options.map(e=>c`<option value=${e.value} ?disabled=${e.disabled===!0}>${e.label}</option>`)}
  </select><span class="hme-menu-caret" aria-hidden="true">▾</span></span>`}function le(a){return c`<button type="button" class="hme-pic ${a.on?"on":""}" aria-pressed=${a.on?"true":"false"} title=${a.title??a.label}
    @click=${a.click}>${a.picture}<span>${a.label}</span></button>`}function so(a){return c`<button type="button" class="hme-chip ${a.on?"":"off"}" aria-pressed=${a.on?"true":"false"} aria-label=${a.label}
    @click=${a.click}>${a.on?a.onText:a.offText}</button>`}var Hl={wood:"repeating-linear-gradient(0deg,#b38a61 0 9px,#8e6845 9px 10px)",tile:"linear-gradient(#a9a7a1 1px,transparent 1px) 0 0/10px 10px, linear-gradient(90deg,#a9a7a1 1px,transparent 1px) 0 0/10px 10px, #cbc9c2",stone:"#bcc1c6 linear-gradient(#9da2a6 1px,transparent 1px) 0 0/18px 12px",carpet:"#99928a",plain:"#a8a6a1"},Pl={wood:"#a17a55",tile:"#bdbbb4",stone:"#b0b5ba",carpet:"#8f8880",plain:"#9c9a95"};function vi(a){return c`<span class="hme-sw" style=${`background:${Hl[a]}`}></span>`}var Ws=a=>a.map(([e,t])=>`${Math.round(e*10)/10},${Math.round(t*10)/10}`).join(" ");function wi(a,e=34,t=24){let o=a?.rooms??[];if(o.length===0)return c`<svg class="hme-thumb" width=${e} height=${t} viewBox=${`0 0 ${e} ${t}`} aria-hidden="true">
      <rect x="1" y="1" width=${e-2} height=${t-2} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" stroke-dasharray="3 2" /></svg>`;let n=wo(a),i=4,r=Math.min((e-i*2)/Math.max(n.maxX-n.minX,.5),(t-i*2)/Math.max(n.maxY-n.minY,.5)),s=e/2-(n.minX+n.maxX)/2*r,d=t/2-(n.minY+n.maxY)/2*r;return c`<svg class="hme-thumb" width=${e} height=${t} viewBox=${`0 0 ${e} ${t}`} aria-hidden="true">
    <rect x="0.5" y="0.5" width=${e-1} height=${t-1} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" />
    ${o.map(l=>x`<polygon points=${Ws(l.outline.map(([p,h])=>[s+p*r,d+h*r]))} fill="none" stroke="var(--wa-muted)" stroke-width="1.1" />`)}
  </svg>`}function Us(a,e,t=76,o=54){let n=a.outline.map(f=>f[0]),i=a.outline.map(f=>f[1]),r=Math.min(...n),s=Math.max(...n),d=Math.min(...i),l=Math.max(...i),p=8,h=Math.min((t-p*2)/Math.max(s-r,.5),(o-p*2)/Math.max(l-d,.5)),m=t/2-(r+s)/2*h,u=o/2-(d+l)/2*h,b=Ws(a.outline.map(([f,w])=>[m+f*h,u+w*h]));return c`<svg class="hme-room-thumb" width=${t} height=${o} viewBox=${`0 0 ${t} ${o}`} aria-hidden="true">
    <rect width=${t} height=${o} rx="8" fill="#121010" />
    <polygon points=${b} fill=${Pl[Ho(a)]} stroke="#ece6da" stroke-width="2.5" stroke-linejoin="round" />
    ${e?x`<circle cx=${t*.58} cy=${o*.42} r=${Math.min(t,o)*.22} fill="#ffb648" opacity="0.35" />`:g}
  </svg>`}function yi(a,e,t,o={}){let n=(o.reach??10)/t,i,r=n;for(let l of[...a.rooms.flatMap(p=>p.outline),...o.corners??[]]){let p=Math.hypot(l[0]-e[0],l[1]-e[1]);p<=r&&(i=l,r=p)}if(i!==void 0)return[i[0],i[1]];let[s,d]=e;if(o.grid!==void 0&&o.grid>0&&(s=Math.round(s/o.grid)*o.grid,d=Math.round(d/o.grid)*o.grid),o.from!==void 0){let l=8/t;Math.abs(e[0]-o.from[0])<=l&&(s=o.from[0]),Math.abs(e[1]-o.from[1])<=l&&(d=o.from[1])}return[Math.round(s*100)/100,Math.round(d*100)/100]}var ke=.1,Be=.05,nn=class{constructor(e){this.grid=e;this.active=!1;this.points=[]}start(e){this.active=!0,this.points=[],this.hoverAt=void 0,e.select(void 0),e.redraw()}stop(e){this.active=!1,this.points=[],this.hoverAt=void 0,e?.redraw()}snap(e,t){return yi(e.floor,t,e.view.scale,{...this.points.length>0?{from:this.points[this.points.length-1]}:{},...e.toggles.grid?{grid:this.grid}:{},corners:this.points})}closes(e,t){let o=this.points[0];return o!==void 0&&this.points.length>=3&&Math.hypot(t[0]-o[0],t[1]-o[1])*e.view.scale<=10}pointerDown(e,t,o){if(!this.active||t.button!==0)return!1;let n=this.snap(e,o);if(this.closes(e,n))return this.finish(e),!0;let i=this.points[this.points.length-1];return(i===void 0||Math.hypot(n[0]-i[0],n[1]-i[1])>=.05)&&this.points.push(n),e.redraw(),!0}hover(e,t){this.active&&(this.hoverAt=t===void 0?void 0:this.snap(e,t),e.redraw())}keyDown(e,t){return this.active?t.key==="Escape"?(this.stop(e),!0):t.key==="Enter"?(this.points.length>=3&&this.finish(e),!0):t.key==="Backspace"||t.key==="Delete"?(this.points.pop(),e.redraw(),!0):!1:!1}async finish(e){let t=this.points.slice();if(this.stop(e),t.length<3)return;let o=await e.ask({title:"Name the room",label:"Name",value:"Room",ok:"Add room"});if(o===void 0)return;let n=e.newId(),i=e.floor.id;e.apply(r=>ba(r,i,n,t,o),{select:{kind:"room",roomId:n}})||e.note("err","That room could not be added. Draw at least three corners round some floor.")}overlay(e){if(!this.active)return g;let t=this.points.map(d=>e.toScreen(d)),o=this.hoverAt===void 0?void 0:e.toScreen(this.hoverAt),n=this.hoverAt!==void 0&&this.closes(e,this.hoverAt),i=[...t,...o!==void 0?[o]:[]].map(([d,l])=>`${d.toFixed(1)},${l.toFixed(1)}`).join(" "),r=this.points[this.points.length-1],s=r!==void 0&&this.hoverAt!==void 0?Math.hypot(this.hoverAt[0]-r[0],this.hoverAt[1]-r[1]):0;return x`<g class="hme-draw">
      ${t.length>=3?x`<polygon points=${t.map(([d,l])=>`${d},${l}`).join(" ")} fill="rgba(91,141,239,0.14)" stroke="none" />`:g}
      <polyline points=${i} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />
      ${t.map(([d,l],p)=>x`<circle cx=${d} cy=${l} r=${p===0&&n?8:5} fill=${p===0&&n?"#5b8def":"#fff"} stroke="#5b8def" stroke-width="2" />`)}
      ${o!==void 0&&!n?x`<circle cx=${o[0]} cy=${o[1]} r="4" fill="#5b8def" />`:g}
      ${o!==void 0&&s>.05?x`<g class="hme-tag"><rect x=${o[0]+10} y=${o[1]-26} width="58" height="18" rx="9" fill="#5b8def" />
        <text x=${o[0]+39} y=${o[1]-13} fill="#fff" text-anchor="middle">${s.toFixed(2)} m</text></g>`:g}
    </g>`}hint(){return this.points.length===0?"Click to put down the first corner":this.points.length<3?"Click to add corners":"Click the first corner or press Enter to close the room"}};var El=15;function Mi(a,e,t){let o,n=El;for(let i of a.pins){let r=e(i.at),s=Math.hypot(r[0]-t[0],r[1]-t[1]);s<=n&&(o=i,n=s)}return o}function an(a,e,t){let o;for(let n of t===void 0?a.rooms:[t])n.objects.forEach((i,r)=>{if(i.hidden===!0)return;let s=ee(J(i));if(!Z(s,e))return;let d=Math.abs(Po(s));(o===void 0||d<o.area)&&(o={thing:{room:n,index:r,object:i},area:d})});return o?.thing}var Cl=10,Tl=6,Sl=12;function Xs(a,e,t){let o=t[0]-e[0],n=t[1]-e[1],i=o*o+n*n,r=i<=0?0:Math.max(0,Math.min(1,((a[0]-e[0])*o+(a[1]-e[1])*n)/i));return Math.hypot(a[0]-(e[0]+o*r),a[1]-(e[1]+n*r))}function Il(a,e,t){let o=e(t),n;for(let i of a.rooms)i.openings.forEach((r,s)=>{let d=Xs(o,e(r.a),e(r.b));d<=Cl&&(n===void 0||d<n.d)&&(n={roomId:i.id,opening:s,d})});return n===void 0?void 0:{roomId:n.roomId,opening:n.opening}}function Gs(a,e,t,o,n){let i=e(t),r;for(let s of a.rooms){let d=n!==void 0&&k(s.id,n);W(s).forEach((l,p)=>{let h=Xs(i,e(l.a),e(l.b));if(h>o)return;let m=d?h-4:h;(r===void 0||m<r.d)&&(r={roomId:s.id,wall:p,d:m})})}return r===void 0?void 0:{roomId:r.roomId,wall:r.wall}}function ki(a,e,t,o){let n=Il(a,e,t);if(n!==void 0)return{kind:"opening",...n};let i=Gs(a,e,t,Tl,o);if(i!==void 0)return{kind:"wall",...i};if(an(a,t)!==void 0)return;let r=Gs(a,e,t,Sl,o);return r===void 0?void 0:{kind:"wall",...r}}function Ys(a,e,t,o){let n=Mi(a,e,e(t));if(n!==void 0){let d=ve(a,n.id);return d===void 0?{kind:"pin",pinId:n.id}:{kind:"object",roomId:d.roomId,object:d.object}}let i=ki(a,e,t,o);if(i!==void 0)return i;let r=an(a,t);if(r!==void 0)return{kind:"object",roomId:r.room.id,object:r.index};let s=V(a,t);return s===void 0?void 0:{kind:"room",roomId:s.id}}function $i(a,e){if(a!==void 0){if(a.kind==="room")return e?.kind==="room"&&k(e.roomId,a.roomId)?void 0:a;if(a.kind==="object")return Se(e).some(o=>k(o.roomId,a.roomId)&&o.object===a.object)?void 0:a;if(a.kind==="pin")return(e?.kind==="pin"?[e.pinId]:e?.kind==="pins"?e.pinIds:[]).some(o=>k(o,a.pinId))?void 0:a;if(a.kind==="wall"||a.kind==="opening")return Et(a,e)?void 0:a}}var Vs="rgba(91,141,239,0.14)",Rl="rgba(91,141,239,0.07)",rn="rgba(150,186,255,0.75)",qs=a=>`${a[0].toFixed(1)},${a[1].toFixed(1)}`;function Zs(a,e,t,o){let n=$i(e,t);if(n===void 0)return g;if(n.kind==="pin"){let s=a.pins.find(p=>k(p.id,n.pinId));if(s===void 0)return g;let[d,l]=o(s.at);return x`<g class="hme-hover" pointer-events="none"><circle cx=${d.toFixed(1)} cy=${l.toFixed(1)} r="18" fill=${Vs} stroke=${rn} stroke-width="1.5" /></g>`}let i=a.rooms.find(s=>k(s.id,n.roomId));if(i===void 0)return g;if(n.kind==="wall"||n.kind==="opening"){let s=n.kind==="wall"?W(i)[n.wall]:i.openings[n.opening];if(s===void 0)return g;let[d,l]=o(s.a),[p,h]=o(s.b);return x`<g class="hme-hover" pointer-events="none"><line x1=${d.toFixed(1)} y1=${l.toFixed(1)} x2=${p.toFixed(1)} y2=${h.toFixed(1)} stroke=${rn} stroke-width="6" stroke-linecap="round" /></g>`}if(n.kind==="object"){let s=i.objects[n.object];if(s===void 0)return g;let d=ee(J(s)).map(l=>qs(o(l))).join(" ");return x`<g class="hme-hover" pointer-events="none"><polygon points=${d} fill=${Vs} stroke=${rn} stroke-width="1.5"
      stroke-dasharray=${s.hidden===!0?"4 3":"none"} stroke-linejoin="round" /></g>`}if(i.outline.length<3)return g;let r=i.outline.map(s=>qs(o(s))).join(" ");return x`<g class="hme-hover" pointer-events="none"><polygon points=${r} fill=${Rl} stroke=${rn} stroke-width="1.5" stroke-linejoin="round" /></g>`}var Dl="#E8A33D";function Al(a){return a.walls.reduce((e,t)=>Math.max(e,t.t),0)||jr}function Qs(a){return a.floor.rooms.flatMap(e=>zn(a.floor,e).map(t=>{let[o,n]=a.toScreen(t.a),[i,r]=a.toScreen(t.b);return x`<line class="hme-open-edge" x1=${o.toFixed(1)} y1=${n.toFixed(1)} x2=${i.toFixed(1)} y2=${r.toFixed(1)}
      stroke=${Dl} stroke-width="2" stroke-dasharray="6 5" stroke-linecap="round" pointer-events="none" />`}))}function Ol(a){return`${a.side.charAt(0).toUpperCase()}${a.side.slice(1)}, ${oe(a.length)}`}function sn(a,e){let t=zn(a.floor,e);if(t.length===0)return g;let o=Al(e);return A(t.length===1?"Open edge":"Open edges",c`
    ${t.map(n=>c`<div class="hme-r"><span class="hme-l">${Ol(n)}</span>
      <button type="button" class="hme-tb" title="Put a wall along this edge"
        @click=${()=>a.apply(i=>_o(i,e.id,n.a,n.b,o))}>Add wall</button></div>`)}
    ${U("No wall here and no room beside it, so the house is open: dashed on the plan. Leave it for a stairwell or an open side.",!0)}`)}var Js={x:0,y:0,turn:0};function td(a){return a.map((e,t)=>({f:e,i:t})).sort((e,t)=>e.f.story-t.f.story||e.i-t.i).map(({f:e})=>e)}function od(a,e){let t=td(a),o=t.findIndex(n=>n.id.toUpperCase()===e.toUpperCase());return o>0?t[o-1]:void 0}function xi(a){let e=a.rooms.flatMap(n=>n.outline);if(e.length===0)return;let t=e.map(n=>n[0]),o=e.map(n=>n[1]);return[(Math.min(...t)+Math.max(...t))/2,(Math.min(...o)+Math.max(...o))/2]}function Hi(a,e){let t=td(a)[0];if(t===void 0||t.id.toUpperCase()===e.id.toUpperCase())return Js;if(e.place!==void 0)return e.place;let o=xi(e),n=xi(t);return o===void 0||n===void 0?Js:{x:n[0]-o[0],y:n[1]-o[1],turn:0}}function Pi(a,e){let t=a.turn*Math.PI/180,o=Math.cos(t),n=Math.sin(t);return[a.x+e[0]*o+e[1]*n,a.y-e[0]*n+e[1]*o]}function Ll(a,e){let t=a.turn*Math.PI/180,o=Math.cos(t),n=Math.sin(t),i=e[0]-a.x,r=e[1]-a.y;return[o*i-n*r,n*i+o*r]}function ed(a,e,t){let o=Pi(a,t),n=Pi({x:0,y:0,turn:e},t);return{x:o[0]-n[0],y:o[1]-n[1],turn:e}}function Fl(a,e){let t=od(a.floors,e.id);if(t===void 0)return[];let o=a.floors.map(r=>r.id.toUpperCase()===e.id.toUpperCase()?e:r),n=Hi(o,t),i=Hi(o,e);return t.rooms.map(r=>r.outline.map(s=>Ll(i,Pi(n,s))))}var lo="floor-line-up";function nd(a){return a.selection!==void 0||!io(lo)?[]:Fl(a.doc,a.floor).map(e=>{let t=e.map(o=>a.toScreen(o).map(n=>n.toFixed(1)).join(",")).join(" ");return x`<polygon class="hme-floor-below" points=${t} fill="rgba(120,170,255,0.06)" stroke="#78AAFF"
      stroke-width="1.5" stroke-dasharray="5 4" stroke-linejoin="round" pointer-events="none" />`})}function id(a,e){let t=od(a.doc.floors,e.id);if(t===void 0)return g;let o=a.doc.floors.map(h=>h.id.toUpperCase()===e.id.toUpperCase()?e:h),n=Hi(o,e),i=xi(e)??[0,0],r=e.id,s=h=>m=>Kn(m,r,h),d=h=>({set:m=>a.apply(s(h(m))),preview:m=>a.preview(m===void 0?void 0:s(h(m)))}),l=h=>a.apply(s(ed(n,n.turn+h,i))),p=io(lo);return c`<details class="hme-card hme-fold" ?open=${p} data-fold=${lo}
    @toggle=${h=>{let m=h.currentTarget.open;m!==io(lo)&&(ro(lo,m),a.redraw())}}>
    <summary class="hme-h">Line up over ${K(t)}<span class="hme-h-end">${e.place===void 0?"Centred":"Placed"}<span class="hme-fold-caret" aria-hidden="true">›</span></span></summary>
    <div class="hme-fold-body">
      ${U(`${K(t)} shows dashed on the plan. Drag a number sideways to move this floor over it until the walls match.`,!0)}
      ${ge(z({tag:"Across",label:"Across",value:n.x,unit:"m",min:-500,max:500,...d(h=>({...n,x:h}))}),z({tag:"Down",label:"Down",value:n.y,unit:"m",min:-500,max:500,...d(h=>({...n,y:h}))}),z({tag:"Turn",label:"Turn",value:n.turn,unit:"\xB0",digits:1,min:-180,max:180,...d(h=>ed(n,h,i))}))}
      <div class="hme-row-end">
        <button type="button" class="hme-tb" title="Turn this floor a quarter one way" @click=${()=>l(-90)}>−90°</button>
        <button type="button" class="hme-tb" title="Turn this floor a quarter the other way" @click=${()=>l(90)}>+90°</button>
        <button type="button" class="hme-tb" ?disabled=${e.place===void 0} title="Put this floor back in the middle of the lowest floor, not turned"
          @click=${()=>a.apply(h=>Kn(h,r,void 0))}>Centre</button>
      </div>
    </div>
  </details>`}var Ei;function dn(){return Ei??=import("./scene3d-AYXDXEUB.js").catch(a=>{throw Ei=void 0,a}),Ei}function Ci(a){return new URL("furniture/",a).href}var Ti={wood:"Wood",tile:"Tile",stone:"Stone",carpet:"Carpet",plain:"Plain"},_l={wood:[{name:"Light oak",hex:"#D9B88A"},{name:"Oak",hex:"#B98B5A"},{name:"Walnut",hex:"#6B4A32"},{name:"Grey wash",hex:"#9A948C"}],tile:[{name:"White",hex:"#E9E7E2"},{name:"Grey",hex:"#8E8E8A"},{name:"Black",hex:"#2E2E30"},{name:"Terracotta",hex:"#B4664A"}],stone:[{name:"Light",hex:"#C9C3B8"},{name:"Sand",hex:"#B8A98E"},{name:"Slate",hex:"#5E6468"}],carpet:[{name:"Grey",hex:"#8E8E93"},{name:"Beige",hex:"#CBB9A0"},{name:"Navy",hex:"#2E4A7D"},{name:"Green",hex:"#4F6B4A"}],plain:[{name:"White",hex:"#E9E7E2"},{name:"Grey",hex:"#8E8E8A"},{name:"Black",hex:"#2E2E30"}]},zl=[{name:"White",hex:"#F2F0EB"},{name:"Warm white",hex:"#EDE6D8"},{name:"Greige",hex:"#CFC6B8"},{name:"Sage",hex:"#A3B09A"},{name:"Blue grey",hex:"#8C9AA6"},{name:"Charcoal",hex:"#3E4044"}];function Si(a){let e=a.mixed===!0,t=e?void 0:a.now?.toUpperCase(),o=t!==void 0&&!a.presets.some(n=>n.hex===t);return c`<div class="hme-r top"><span class="hme-l">${a.word}</span>
    <div class="hme-chips hme-colours" role="group" aria-label=${`${a.word} colour`}>
      <button type="button" class="hme-chip sel ${t===void 0&&!e?"on":""}" aria-pressed=${t===void 0&&!e?"true":"false"}
        title=${a.defaultTitle} @click=${()=>a.set(void 0)}>Default</button>
      ${a.presets.map(n=>c`<button type="button" class="hme-colour ${t===n.hex?"on":""}" style=${`--c:${n.hex}`}
        title=${n.name} aria-label=${`${a.word}: ${n.name}`} aria-pressed=${t===n.hex?"true":"false"} @click=${()=>a.set(n.hex)}></button>`)}
      <label class="hme-chip sel hme-pick ${o?"on":""}" title=${a.customTitle}>${o?c`<span class="hme-swatch" style=${`background:${t}`}></span>`:g}Custom
        ${ao({value:t??a.presets[0].hex,label:a.customLabel,preview:a.preview,set:a.set})}</label>
    </div></div>
    ${e?U(`Mixed: their ${a.word.toLowerCase()} colours differ. Pick one to set them all.`,!0):g}`}var ln=15,jl=[{a:0,c:0},{c:0},{a:1,c:0},{a:1},{a:1,c:1},{c:1},{a:0,c:1},{a:0}];function Nl(a,e){let t=(Math.atan2(e,a)*180/Math.PI+180)%180;return["ew-resize","nwse-resize","ns-resize","nesw-resize"][Math.round(t/45)%4]}function Kl(a,e){let t=e===0?"":` Its ${O(e,"device")} come${e===1?"s":""} off the map too.`;return`${T(a)} comes off the map.${t} A scanned room comes back only by scanning it again on the iPhone. Undo brings it back while this page is open.`}function xe(a){return ot(a.model)?.name??rt(a.kind)}function rd(a){let e=a.map(t=>xe(t.object));return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function hn(a){return a.kind==="lamp"||qt(a)?.kind==="lamp"}function Ri(a,e){let t=Ee(a,e);return t.kind==="light"&&t.on}function Bl(a,e){let t=Et(e.sel,a.hover);return c`<div class="hme-ly ${e.picked?"on":""} ${t?"hov":""} ${e.hidden?"hid":""}"
    @pointerenter=${()=>a.setHover(e.sel)} @pointerleave=${()=>a.setHover(void 0)}>
    <button type="button" class="hme-ly-main" aria-pressed=${e.picked?"true":"false"} title=${e.title} @click=${e.pick}>
      ${e.icon}<span class="hme-ly-nm">${e.name}</span><span class="hme-ly-end">${e.end}</span></button>
    ${e.eye===void 0?g:c`<button type="button" class="hme-eye" aria-label=${`${e.hidden?"Show":"Hide"} ${e.name}`}
      title=${e.hidden?"Show it again on the map, the tiles and the watch":"Hide it on the map, the tiles and the watch; it stays listed here"}
      @click=${e.eye}>${Wl(!e.hidden)}</button>`}
  </div>`}function Wl(a){return c`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z" fill="none" stroke="currentColor" stroke-width="1.3"></path>
    ${a?x`<circle cx="8" cy="8" r="2" fill="currentColor"></circle>`:x`<path d="M2.5 13.5l11-11" stroke="currentColor" stroke-width="1.3"></path>`}</svg>`}function ad(a){let e=a[0]?.room.id;return e!==void 0&&a.every(t=>k(t.room.id,e))?{kind:"room",roomId:e}:void 0}var Ul=["fabric","wood"],at=a=>a.map(e=>({roomId:e.room.id,object:e.index}));function Ii(a){return Vr(qt(a))}function Di(a,e,t){let o=ns(a,t).filter(r=>e===""||r.group===e);if(a.trim()!==""||e!=="")return[{title:e===""?"Found":e,pieces:o}];let n=[],i=t===void 0?[]:o.filter(r=>r.kind===t);i.length>0&&n.push({title:`${rt(t)} pieces`,pieces:i});for(let r of tt.groups){let s=o.filter(d=>d.group===r&&!i.includes(d));s.length>0&&n.push({title:r,pieces:s})}return n}function Gl(a){return Math.round(Br(a.turn)*10)/10}var N=a=>a.toFixed(1),$e=a=>`${a[0].toFixed(1)},${a[1].toFixed(1)}`,Ai="room-card",pn=class{constructor(){this.draw=new nn(ke);this.guides=[];this.dragging=!1;this.resizing=!1;this.pickerQuery="";this.pickerGroup="";this.pickerFocus=!1;this.thumbs=new Map;this.askedThumbs=new Set;this.thumbFrame=0}openPicker(e,t,o){this.picker=o===void 0?{roomId:t.id}:{roomId:t.id,index:o},this.pickerQuery="",this.pickerGroup="",this.pickerFocus=!0,e.redraw()}closePicker(e){this.picker=void 0,e.redraw()}get pickerOpen(){return this.picker!==void 0}thumb(e,t){let o=this.thumbs.get(t),n=e.furnitureBase;if(o!==void 0||n===void 0||this.askedThumbs.has(t))return o;this.askedThumbs.add(t),dn().then(i=>i.homeMapPieceThumb(n,t)).then(i=>{if(i===void 0||(this.thumbs.set(t,i),this.thumbFrame!==0))return;let r=typeof requestAnimationFrame=="function"?requestAnimationFrame:s=>setTimeout(s,16);this.thumbFrame=r(()=>{this.thumbFrame=0,e.redraw()})},()=>{})}piecePic(e,t,o){let n=t===void 0?void 0:this.thumb(e,t.id);return c`<span class="${o} ${n===void 0?"wait":""}">${n===void 0?g:c`<img src=${n} alt="" draggable="false" />`}</span>`}pickPiece(e,t){let o=this.picker,n=o===void 0?void 0:e.floor.rooms.find(d=>k(d.id,o.roomId));if(this.picker=void 0,o===void 0||n===void 0){e.redraw();return}let i=n.id;if(o.index!==void 0){let d=o.index;e.apply(l=>ha(l,i,d,t),{select:{kind:"object",roomId:i,object:d}})||e.redraw();return}let r=Y(n)??ce(n),s=n.objects.length;e.apply(d=>la(d,i,t,r),{select:{kind:"object",roomId:i,object:s}})||e.redraw()}sheet(e){let t=this.picker;if(t===void 0)return g;let o=e.floor.rooms.find(m=>k(m.id,t.roomId)),n=t.index===void 0?void 0:o?.objects[t.index];if(o===void 0||t.index!==void 0&&n===void 0)return this.picker=void 0,g;let i=n===void 0?void 0:qt(n),r=Di(this.pickerQuery,this.pickerGroup,n?.kind),s=n===void 0?"Add furniture":"Change model",d=n===void 0?`To ${T(o)}, in its middle. Drag it into place once it is in.`:`${xe(n)} in ${T(o)} keeps its place, size and turn.`,l=m=>tt.pieces.filter(u=>m===""||u.group===m).length,p=["",...tt.groups],h=this.pickerFocus;return this.pickerFocus=!1,c`<div class="hme-scrim hme-sheet"
      @pointerdown=${m=>{m.target===m.currentTarget&&this.closePicker(e)}}
      @keydown=${m=>{m.stopPropagation(),m.key==="Escape"&&this.closePicker(e)}}>
      <div class="hme-fpick" role="dialog" aria-modal="true" aria-label=${s}>
        <header class="hme-fpick-head">
          <div class="hme-fpick-t"><strong>${s}</strong><span>${d}</span></div>
          <label class="hme-find hme-fpick-find"><span aria-hidden="true">⌕</span>
            <input type="search" placeholder="Find a piece: sofa, lamp, desk" aria-label="Find a piece" .value=${q(this.pickerQuery)}
              ${nt(m=>{h&&m instanceof HTMLInputElement&&setTimeout(()=>m.focus(),0)})}
              @input=${m=>{this.pickerQuery=m.target.value,e.redraw()}} /></label>
          <button type="button" class="hme-x hme-fpick-close" aria-label="Close" title="Close (Esc)" @click=${()=>this.closePicker(e)}>×</button>
        </header>
        <div class="hme-fpick-main">
          <nav class="hme-fpick-groups" aria-label="Groups">
            ${p.map(m=>c`<button type="button" class="hme-tool ${m===this.pickerGroup?"on":""}" aria-pressed=${m===this.pickerGroup?"true":"false"}
              @click=${()=>{this.pickerGroup=m,e.redraw()}}>${m===""?"All":m}<span class="n">${l(m)}</span></button>`)}
          </nav>
          <div class="hme-fpick-body">
            ${r.every(m=>m.pieces.length===0)?c`<p class="hme-empty-line">No piece by that name${this.pickerGroup===""?"":` in ${this.pickerGroup}`}.</p>`:g}
            ${r.filter(m=>m.pieces.length>0).map(m=>c`<section class="hme-fpick-sec">
              <div class="hme-h">${m.title}<span class="hme-h-end">${O(m.pieces.length,"piece")}</span></div>
              <div class="hme-fgrid">${m.pieces.map(u=>{let b=i?.id===u.id;return c`<button type="button" class="hme-fcard ${b?"on":""}" aria-pressed=${b?"true":"false"}
                  title=${`${n===void 0?"Add":"Use"} ${u.name}, ${bt(u)}`} @click=${()=>this.pickPiece(e,u)}>
                  ${this.piecePic(e,u,"hme-fcard-pic")}
                  <span class="hme-fcard-name">${u.name}</span>
                  <span class="hme-fcard-size mono">${bt(u)}</span>
                </button>`})}</div>
            </section>`)}
          </div>
        </div>
      </div>
    </div>`}stopDrag(e){this.guides=[],this.dragging=!1,this.resizing=!1,e.preview(void 0)}focus(e){if(se(e.selection))return;let t=de(e.selection);return t===void 0?void 0:e.floor.rooms.find(o=>k(o.id,t))}pickedMany(e){if(e.selection?.kind==="objects")return Se(e.selection).flatMap(t=>{let o=e.floor.rooms.find(i=>k(i.id,t.roomId)),n=o?.objects[t.object];return o===void 0||n===void 0?[]:[{room:o,index:t.object,object:n}]})}picked(e){let t=e.selection;if(t?.kind!=="object")return;let o=this.focus(e),n=o?.objects[t.object];return o===void 0||n===void 0?void 0:{room:o,index:t.object,object:n}}thingUnder(e,t,o){return an(e.floor,t,o)}pickThing(e,t,o){e.select({kind:"object",roomId:t.id,object:o})}overlay(e){if(this.draw.active)return this.draw.overlay(e);let t=this.focus(e),o=this.picked(e),n=this.pickedMany(e),i=[];for(let r of this.guides)i.push(this.guide(e,r));if(n!==void 0)for(let r of n){let s=ee(J(r.object)).map(d=>$e(e.toScreen(d))).join(" ");i.push(x`<polygon class="hme-box" points=${s} fill="rgba(91,141,239,0.1)" stroke="#5b8def" stroke-width="2"
          stroke-dasharray=${r.object.hidden===!0?"5 4":"none"} pointer-events="none" />`)}else if(o!==void 0){let r=o.room.outline.map(d=>$e(e.toScreen(d))).join(" ");i.push(x`<polygon points=${r} fill="none" stroke="#5b8def" stroke-width="1" stroke-dasharray="4 4" opacity="0.5" pointer-events="none" />`);let s=o.object;i.push(this.box(e,ee(J(s)),{width:s.size[0],depth:s.size[1]},"thing",s.hidden===!0))}else t!==void 0&&t.outline.length>=3&&i.push(this.box(e,Ss(t),Jo(t),"room",!1));return i.length===0?g:x`${i}`}box(e,t,o,n,i){let r=t.map(v=>e.toScreen(v)),s=r.reduce((v,M)=>[v[0]+M[0]/4,v[1]+M[1]/4],[0,0]),d=v=>[(r[v][0]+r[(v+1)%4][0])/2,(r[v][1]+r[(v+1)%4][1])/2],l=v=>{let M=Math.max(Math.hypot(v[0]-s[0],v[1]-s[1]),1e-6);return[(v[0]-s[0])/M,(v[1]-s[1])/M]},p=[0,1,2,3].flatMap(v=>[r[v],d(v)]),h=[0,1,2,3].reduce((v,M)=>d(M)[1]<d(v)[1]?M:v,0),m=d(h),u=l(m),b=[m[0]+u[0]*44,m[1]+u[1]*44],f=[];for(let v of[[0,2],[1,3]]){let[M,$]=v,P=Math.abs(r[(M+1)%4][0]-r[M][0])>=Math.abs(r[(M+1)%4][1]-r[M][1])?l(d(M))[1]<=l(d($))[1]?M:$:l(d(M))[0]<=l(d($))[0]?M:$,F=r[P],I=r[(P+1)%4],j=l(d(P)),S=[F[0]+j[0]*20,F[1]+j[1]*20],C=[I[0]+j[0]*20,I[1]+j[1]*20],L=[(S[0]+C[0])/2,(S[1]+C[1])/2],X=P%2===0?o.width:o.depth,G=[j[0]*5,j[1]*5];f.push(x`<path d=${`M${$e(S)}L${$e(C)}M${$e([S[0]-G[0],S[1]-G[1]])}L${$e([S[0]+G[0],S[1]+G[1]])}M${$e([C[0]-G[0],C[1]-G[1]])}L${$e([C[0]+G[0],C[1]+G[1]])}`}
        stroke="#5b8def" stroke-width="1.2" fill="none" />
        <g class="hme-tag"><rect x=${N(L[0]-26)} y=${N(L[1]-9)} width="52" height="18" rx="9" fill="#5b8def" />
        <text x=${N(L[0])} y=${N(L[1]+4)} fill="#fff" text-anchor="middle">${X.toFixed(2)} m</text></g>`)}let w=n==="room"?"Drag to resize the room. Shift keeps its proportions, Alt resizes it about its middle, Cmd or Ctrl stops it snapping.":"Drag to resize it. Shift keeps its proportions, Alt resizes it about its middle.";return x`<g class="hme-box">
      <polygon points=${r.map($e).join(" ")} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray=${i?"5 4":"none"} />
      ${this.resizing||!this.dragging?f:g}
      ${this.dragging?g:x`
        <line x1=${N(m[0])} y1=${N(m[1])} x2=${N(b[0])} y2=${N(b[1])} stroke="#5b8def" stroke-width="1.6" />
        ${p.map((v,M)=>x`<rect data-hme="resize" data-handle=${M} x=${N(v[0]-5)} y=${N(v[1]-5)} width="10" height="10"
          fill="#fff" stroke="#5b8def" stroke-width="1.6" style=${`cursor:${Nl(v[0]-s[0],v[1]-s[1])}`}>
          <title>${w}</title></rect>`)}
        <g data-hme="turn" style="cursor:grab" transform=${`translate(${$e(b)})`}>
          <title>${n==="room"?"Drag to turn the room. Hold Alt to turn it freely.":"Drag to turn it. Hold Alt to turn it freely."}</title>
          <circle r="9" fill="#5b8def" />
          <path d="M-4 0a4 4 0 1 0 1.5-3.1M-4-4.5v2.5h2.5" fill="none" stroke="#fff" stroke-width="1.3" />
        </g>`}
    </g>`}guide(e,t){let o=e.toScreen(t.a),n=e.toScreen(t.b);if(t.door===!0){let m=e.floor.rooms.find(v=>k(v.id,t.roomId)),u=`Door to ${m===void 0?"the next room":T(m)}`,b=u.length*6.2+20,f=(o[0]+n[0])/2-b/2,w=(o[1]+n[1])/2-34;return x`<g class="hme-guide" pointer-events="none">
        <line x1=${N(o[0])} y1=${N(o[1])} x2=${N(n[0])} y2=${N(n[1])} stroke="#30d158" stroke-width="5" stroke-linecap="round" />
        <g class="hme-tag"><rect x=${N(f)} y=${N(w)} width=${N(b)} height="20" rx="10" fill="#30d158" />
        <text x=${N(f+b/2)} y=${N(w+14)} fill="#000" text-anchor="middle">${u}</text></g>
      </g>`}let i=Math.max(Math.hypot(n[0]-o[0],n[1]-o[1]),1e-6),r=[(n[0]-o[0])/i,(n[1]-o[1])/i],s=[o[0]-r[0]*40,o[1]-r[1]*40],d=[n[0]+r[0]*40,n[1]+r[1]*40],l=e.floor.rooms.find(m=>k(m.id,t.roomId)),p=`Lined up with ${l===void 0?"a":T(l)} wall`,h=p.length*6.2+20;return x`<g class="hme-guide" pointer-events="none">
      <line x1=${N(s[0])} y1=${N(s[1])} x2=${N(d[0])} y2=${N(d[1])} stroke="#ff4fa3" stroke-width="1.2" stroke-dasharray="6 4" />
      <g class="hme-tag"><rect x=${N(d[0]+6)} y=${N(d[1]-10)} width=${N(h)} height="20" rx="10" fill="#ff4fa3" />
      <text x=${N(d[0]+6+h/2)} y=${N(d[1]+4)} fill="#fff" text-anchor="middle">${p}</text></g>
    </g>`}pointerDown(e,t,o){return this.draw.active?this.draw.pointerDown(e,t,o):t.button!==0?!1:this.pressHandle(e,t,o)||this.pressBody(e,t,o)}pressHandle(e,t,o){let n=t.target?.closest?.("[data-hme]"),i=n?.getAttribute("data-hme");if(i!=="turn"&&i!=="resize")return!1;let r=jl[Number(n?.getAttribute("data-handle"))],s=this.picked(e),d=this.focus(e);if(s!==void 0){if(i==="turn")this.thingTurnDrag(e,t,s,o);else if(r!==void 0)this.thingResizeDrag(e,t,s,r,o);else return!1;return!0}if(d===void 0)return!1;if(i==="turn")this.turnDrag(e,t,d,o);else if(r!==void 0)this.resizeDrag(e,t,d,r,o);else return!1;return!0}pressThing(e,t,o,n){let i=e.floor.rooms.find(s=>k(s.id,o.roomId)),r=i?.objects[o.object];return i===void 0||r===void 0?!1:t.shiftKey||t.metaKey||t.ctrlKey?(e.select(it(e.selection,{roomId:i.id,object:o.object})),!0):(this.dragThing(e,t,{room:i,index:o.object,object:r},n),!0)}dragThing(e,t,o,n){let i=this.pickedMany(e),r=i!==void 0&&i.some(s=>k(s.room.id,o.room.id)&&s.index===o.index);r||this.pickThing(e,o.room,o.index),t.altKey?this.copyDrag(e,t,r?i:[o],n):r?this.manyMoveDrag(e,t,i,o,n):this.thingMoveDrag(e,t,o,n)}manyMoveDrag(e,t,o,n,i){let r=at(o),s=o[0].object.c,d=[0,0];e.drag(t,{move:l=>{let p=l[0]-i[0],h=l[1]-i[1];if(e.toggles.grid){let m=ke;p=Math.round((s[0]+p)/m)*m-s[0],h=Math.round((s[1]+h)/m)*m-s[1]}this.guides=[],this.dragging=!0,d=[p,h],e.preview(m=>Ro(m,r,p,h))},end:(l,p,h)=>{if(this.stopDrag(e),!h){this.pickThing(e,n.room,n.index);return}let[m,u]=d;(Math.abs(m)>=.005||Math.abs(u)>=.005)&&e.apply(b=>Ro(b,r,m,u))},cancel:()=>this.stopDrag(e)})}copyDrag(e,t,o,n){let i=Do(e.doc,at(o));if(i===void 0)return;let r=e.floor.id,s=ma(i),d;e.drag(t,{move:l=>{let p=[s[0]+l[0]-n[0],s[1]+l[1]-n[1]];if(e.toggles.grid){let m=ke;p=[Math.round(p[0]/m)*m,Math.round(p[1]/m)*m]}this.guides=[],this.dragging=!0,d=p;let h=p;e.preview(m=>Ao(m,r,i,h)?.doc)},end:(l,p,h)=>{this.stopDrag(e),h&&d!==void 0&&this.paste(e,i,d)},cancel:()=>this.stopDrag(e)})}pressBody(e,t,o){let n=this.thingUnder(e,o,void 0);if(t.metaKey||t.ctrlKey)return n!==void 0&&e.select(it(e.selection,{roomId:n.room.id,object:n.index})),n!==void 0||V(e.floor,o)!==void 0;if(n!==void 0)return this.dragThing(e,t,n,o),!0;let i=V(e.floor,o);return i===void 0?!1:(e.select({kind:"room",roomId:i.id}),this.moveDrag(e,t,i,o),!0)}moveDrag(e,t,o,n){let i=e.doc,r=o.id,s=_e(o.outline),d=[0,0];e.drag(t,{move:(l,p)=>{let h=l[0]-n[0],m=l[1]-n[1];if(e.toggles.grid&&s!==void 0){let u=ke;h=Math.round((s.minX+h)/u)*u-s.minX,m=Math.round((s.minY+m)/u)*u-s.minY}if(this.guides=[],e.toggles.snap&&!p.altKey){let u=Xr(i,r,h,m);u!==void 0&&(h=u.dx,m=u.dy,this.guides=u.guides)}this.dragging=!0,d=[h,m],e.preview(u=>vt(u,r,h,m))},end:(l,p,h)=>{let m=this.guides.some(f=>f.door===!0);this.stopDrag(e);let[u,b]=d;h&&(Math.abs(u)>=.005||Math.abs(b)>=.005)&&e.apply(f=>{let w=vt(f,r,u,b);return w!==void 0&&m?Ka(w,[r]):w},{select:{kind:"room",roomId:r}})},cancel:()=>this.stopDrag(e)})}resizeDrag(e,t,o,n,i){let r=Zr(o);if(r===void 0)return;let s=e.doc,d=o.id,l=r.a1-r.a0,p=r.c1-r.c0;if(l<=1e-6||p<=1e-6)return;let h=f=>f[0]*r.u[0]+f[1]*r.u[1],m=f=>f[0]*r.v[0]+f[1]*r.v[1],u=f=>Math.min(Math.max(f,zt),jt),b;e.drag(t,{move:(f,w)=>{let v=w.altKey?2:1,M=l,$=p;if(n.a!==void 0&&(M=l+(h(f)-h(i))*(n.a===1?1:-1)*v),n.c!==void 0&&($=p+(m(f)-m(i))*(n.c===1?1:-1)*v),e.toggles.grid){let I=ke;n.a!==void 0&&(M=Math.round(M/I)*I),n.c!==void 0&&($=Math.round($/I)*I)}if(M=u(M),$=u($),w.shiftKey){let I=M/l,j=$/p,S=n.a===void 0?j:n.c===void 0||Math.abs(Math.log(I))>=Math.abs(Math.log(j))?I:j;S=Math.min(Math.max(S,zt/Math.min(l,p)),jt/Math.max(l,p)),M=l*S,$=p*S}let y=[w.altKey||n.a===void 0?.5:1-n.a,w.altKey||n.c===void 0?.5:1-n.c],P={width:M,depth:$,anchor:y};if(this.guides=[],e.toggles.snap&&!w.altKey&&!w.ctrlKey&&!w.metaKey){let I=Qr(s,d,P,n,{proportional:w.shiftKey});I!==void 0&&(P=I.resize,this.guides=I.guides)}this.dragging=!0,this.resizing=!0,b=P;let F=P;e.preview(I=>Nt(I,d,F))},end:(f,w,v)=>{this.stopDrag(e);let M=b;!v||M===void 0||Math.abs((M.width??l)-l)<.005&&Math.abs((M.depth??p)-p)<.005||e.apply($=>Nt($,d,M),{select:{kind:"room",roomId:d}})},cancel:()=>this.stopDrag(e)})}turnDrag(e,t,o,n){let i=o.id,r=ce(o),s=Math.atan2(n[1]-r[1],n[0]-r[0]),d=0;e.drag(t,{move:(l,p)=>{let h=(Math.atan2(l[1]-r[1],l[0]-r[0])-s)*180/Math.PI;h=(h+540)%360-180,p.altKey||(h=Math.round(h/ln)*ln),this.dragging=!0,d=h,e.preview(m=>qe(m,i,h,r))},end:(l,p,h)=>{this.stopDrag(e),h&&Math.abs(d)>.01&&e.apply(m=>qe(m,i,d,r),{select:{kind:"room",roomId:i}})},cancel:()=>this.stopDrag(e)})}thingMoveDrag(e,t,o,n){let{room:i,index:r,object:s}=o,d=i.id,l=s.c,p=l;e.drag(t,{move:(h,m)=>{let u=[l[0]+h[0]-n[0],l[1]+h[1]-n[1]];if(e.toggles.grid){let f=ke;u=[Math.round(u[0]/f)*f,Math.round(u[1]/f)*f]}if(this.guides=[],e.toggles.snap&&!m.altKey){let f=ga(i,s,u);u=f.c,this.guides=f.guides}this.dragging=!0,p=u;let b=u;e.preview(f=>wt(f,d,r,b))},end:(h,m,u)=>{if(this.stopDrag(e),u&&Math.hypot(p[0]-l[0],p[1]-l[1])>=.005){let b=p;e.apply(f=>wt(f,d,r,b),{select:{kind:"object",roomId:d,object:r}})}},cancel:()=>this.stopDrag(e)})}thingResizeDrag(e,t,o,n,i){let{room:r,index:s,object:d}=o,l=r.id,{u:p,v:h}=ua(d),m=Math.max(d.size[0],yt),u=Math.max(d.size[1],yt),b=M=>M[0]*p[0]+M[1]*p[1],f=M=>M[0]*h[0]+M[1]*h[1],w=M=>Math.min(Math.max(M,yt),Oo),v;e.drag(t,{move:(M,$)=>{let y=$.altKey?2:1,P=m,F=u;if(n.a!==void 0&&(P=m+(b(M)-b(i))*(n.a===1?1:-1)*y),n.c!==void 0&&(F=u+(f(M)-f(i))*(n.c===1?1:-1)*y),e.toggles.grid){let S=ke;n.a!==void 0&&(P=Math.round(P/S)*S),n.c!==void 0&&(F=Math.round(F/S)*S)}if(P=w(P),F=w(F),$.shiftKey){let S=P/m,C=F/u,L=n.a===void 0?C:n.c===void 0||Math.abs(Math.log(S))>=Math.abs(Math.log(C))?S:C;L=Math.min(Math.max(L,yt/Math.min(m,u)),Oo/Math.max(m,u)),P=m*L,F=u*L}let I=[$.altKey||n.a===void 0?.5:1-n.a,$.altKey||n.c===void 0?.5:1-n.c];this.dragging=!0,this.resizing=!0;let j={width:P,depth:F,anchor:I};v=j,e.preview(S=>Bt(S,l,s,j))},end:(M,$,y)=>{this.stopDrag(e);let P=v;!y||P===void 0||Math.abs((P.width??m)-d.size[0])<.005&&Math.abs((P.depth??u)-d.size[1])<.005||e.apply(F=>Bt(F,l,s,P),{select:{kind:"object",roomId:l,object:s}})},cancel:()=>this.stopDrag(e)})}thingTurnDrag(e,t,o,n){let{room:i,index:r,object:s}=o,d=i.id,l=s.c,p=Math.atan2(n[1]-l[1],n[0]-l[0]),h=0;e.drag(t,{move:(m,u)=>{let b=(Math.atan2(m[1]-l[1],m[0]-l[0])-p)*180/Math.PI;b=(b+540)%360-180,u.altKey||(b=Math.round(b/ln)*ln),this.dragging=!0,h=-b;let f=h;e.preview(w=>Xe(w,d,r,f))},end:(m,u,b)=>{this.stopDrag(e);let f=h;b&&Math.abs(f)>.01&&e.apply(w=>Xe(w,d,r,f),{select:{kind:"object",roomId:d,object:r}})},cancel:()=>this.stopDrag(e)})}hover(e,t){this.draw.hover(e,t)}pickedRefs(e){let t=e.selection;return t?.kind==="object"?[{roomId:t.roomId,object:t.object}]:t?.kind==="objects"?t.items:[]}copyPicked(e){let t=Do(e.doc,this.pickedRefs(e));return t===void 0?!1:(this.clip=t,!0)}paste(e,t,o){let n=e.floor.id,i=de(e.selection),r=Ao(e.doc,n,t,o,i);if(r===void 0)return;let s=r.items[0],d=r.items.length===1?{kind:"object",roomId:s.roomId,object:s.object}:{kind:"objects",items:r.items};return e.apply(l=>Ao(l,n,t,o,i)?.doc,{select:d})?r:void 0}pasteClip(e){if(this.clip===void 0)return!1;let t=this.paste(e,this.clip,this.pointer);return t!==void 0&&(this.clip=t.clip),!0}duplicatePicked(e){let t=Do(e.doc,this.pickedRefs(e));return t===void 0?!1:(this.paste(e,t,void 0),!0)}clipKey(e,t){return t==="copy"?this.copyPicked(e):t==="paste"?this.pasteClip(e):this.duplicatePicked(e)}copyButtons(e){return c`<button type="button" class="hme-tb" title="Copy it, to paste on any floor (${Ie()?"\u2318C":"Ctrl+C"})" @click=${()=>this.copyPicked(e)}>Copy</button>
      <button type="button" class="hme-tb" title="Make a copy beside it (${Ie()?"\u2318D":"Ctrl+D"})" @click=${()=>this.duplicatePicked(e)}>Duplicate</button>`}pasteButton(e){return c`<button type="button" class="hme-tb" title="Paste the furniture you copied (${Ie()?"\u2318V":"Ctrl+V"})" @click=${()=>this.pasteClip(e)}>Paste</button>`}keyDown(e,t){if(this.draw.active)return this.draw.keyDown(e,t);let o=this.pickedMany(e);if(o!==void 0)return this.manyKeyDown(e,t,o);let n=this.focus(e);if(n===void 0)return!1;let i=te(t,!1),r=this.picked(e);if(r!==void 0){let{index:s,object:d}=r,l={kind:"room",roomId:n.id};if(i==="delete")return e.apply(p=>So(p,n.id,s),{select:l}),!0;if(i==="cancel")return e.select(l),!0;if(typeof i=="object"&&"nudge"in i){let[p,h]=i.nudge;return e.apply(m=>wt(m,n.id,s,[d.c[0]+p,d.c[1]+h])),!0}return!1}if(i==="delete")return this.askDelete(e,n),!0;if(typeof i=="object"&&"nudge"in i){let[s,d]=i.nudge;return e.apply(l=>vt(l,n.id,s,d)),!0}return!1}manyKeyDown(e,t,o){let n=te(t,!1),i=at(o);if(n==="delete")return this.askDeleteThings(e,o),!0;if(n==="cancel")return e.select(ad(o)),!0;if(typeof n=="object"&&"nudge"in n){let[r,s]=n.nudge;return e.apply(d=>Ro(d,i,r,s)),!0}return!1}async askDeleteThings(e,t){let o=at(t);await e.confirm({title:`Delete ${O(t.length,"thing")}?`,text:`${rd(t)} come off the map. Undo brings them back while this page is open.`,ok:"Delete",danger:!0})&&e.apply(i=>ca(i,o),{select:ad(t)??null})}cursor(){return this.draw.active?"crosshair":void 0}leave(e){this.draw.stop(e),this.picker=void 0,this.guides=[],this.dragging=!1,this.resizing=!1}dock(e){return c`<button type="button" class="hme-tb ${e.toggles.snap?"on":""}" aria-pressed=${e.toggles.snap?"true":"false"}
        title="Snap: a dragged room locks to the door of the next room, or lines up with the walls round it. Hold Alt to move it freely." @click=${()=>e.setToggle("snap",!e.toggles.snap)}>Snap</button>`}viewItems(e){return[{label:"Grid 10 cm",on:e.toggles.grid,title:"Points land on a 10 cm grid, drawn on the plan",flip:()=>e.setToggle("grid",!e.toggles.grid)}]}pill(e){if(this.draw.active)return c`<span class="hme-pill-name">${this.draw.hint()}</span>
        ${this.draw.points.length>=3?c`<button type="button" class="hme-tb" @click=${()=>{this.draw.finish(e)}}>Close the room</button>`:g}
        <button type="button" class="hme-tb" @click=${()=>this.draw.stop(e)}>Cancel</button>`;if(this.dragging)return g;let t=this.pickedMany(e);if(t!==void 0){let r=at(t),s=t.some(d=>d.object.hidden!==!0);return c`<span class="hme-pill-name">${O(t.length,"thing")}</span>
        ${this.copyButtons(e)}
        <button type="button" class="hme-tb" title=${s?"Hide every picked thing":"Show every picked thing"}
          @click=${()=>e.apply(d=>Io(d,r,s))}>${s?"Hide":"Show"}</button>
        <button type="button" class="hme-tb danger" @click=${()=>{this.askDeleteThings(e,t)}}>Delete</button>`}let o=this.focus(e);if(this.dragging)return g;if(o===void 0)return this.clip===void 0?g:this.pasteButton(e);let n=o.id,i=this.picked(e);if(i!==void 0){let{index:r,object:s}=i;return c`<span class="hme-pill-name">${xe(s)}</span>
        <button type="button" class="hme-tb" @click=${()=>e.apply(d=>Xe(d,n,r,90))}>⟲ Turn 90°</button>
        ${this.copyButtons(e)}
        <button type="button" class="hme-tb" @click=${()=>e.apply(d=>To(d,n,r,s.hidden!==!0))}>${s.hidden===!0?"Show":"Hide"}</button>
        <button type="button" class="hme-tb" @click=${()=>e.select({kind:"room",roomId:n})}>${T(o)} ›</button>
        <button type="button" class="hme-tb danger" @click=${()=>e.apply(d=>So(d,n,r),{select:{kind:"room",roomId:n}})}>Remove</button>`}return c`<span class="hme-pill-name">${T(o)}</span>
      ${this.clip===void 0?g:this.pasteButton(e)}
      <button type="button" class="hme-tb" @click=${()=>e.apply(r=>qe(r,n,90))}>⟲ Turn 90°</button>
      <button type="button" class="hme-tb" title="Make its corners square" @click=${()=>e.apply(r=>Wt(r,n))}>Square</button>
      ${on({label:"More",cls:"hme-tb",options:[{value:"snap",label:"Snap to walls"},{value:"level",label:"Level"},{value:"delete",label:"Delete room"}],pick:r=>{r==="snap"?e.apply(s=>Yr(s,n)):r==="level"?e.apply(s=>Nn(s,n)):this.askDelete(e,o)}})}`}floorMenu(e,t,o,n){let i=e.doc.floors.filter(r=>!k(r.id,e.floor.id));return on({label:o,cls:n,options:[...i.map(r=>({value:r.id,label:K(r)})),{value:"new",label:"New floor\u2026"}],pick:r=>{this.moveToFloor(e,t,r)}})}async moveToFloor(e,t,o){let n=t.id,i={kind:"room",roomId:n};if(o!=="new"){e.apply(l=>Bn(l,n,{floorId:o}),{select:i,floorId:o});return}let r=Math.max(...e.doc.floors.map(l=>l.story))+1,s=await e.ask({title:"A new floor",label:"Name",value:r===1?"Upstairs":`Floor ${r+1}`,ok:"Move the room there"});if(s===void 0)return;let d=e.newId();e.apply(l=>Bn(l,n,{newFloor:{id:d,name:s,story:r}}),{select:i,floorId:d})}async askDelete(e,t){let o=Ve(e.floor,t.id).length;await e.confirm({title:`Delete ${T(t)}?`,text:Kl(t,o),ok:"Delete room",danger:!0})&&e.apply(i=>na(i,t.id),{select:null})}inspector(e){let t=this.pickedMany(e);if(t!==void 0)return this.manyInspector(e,t);let o=this.focus(e);if(o===void 0)return this.floorCard(e,e.floor);let n=this.picked(e);if(n!==void 0)return this.thingInspector(e,n);let i=o.id,r=Jo(o),s=Cr(e.floor,e.toggles.live?e.hass?.states:void 0).has(o.id),d=_e(o.outline)??{minX:0,minY:0,maxX:0,maxY:0},l=Math.round(-qr(o)*10)/10,p=o.areaId===void 0||e.areas.some(y=>y.id===o.areaId),h=e.areas.find(y=>y.id===o.areaId)?.name,m=o.pageId===void 0||e.pages.some(y=>k(y.id,o.pageId)),u=Kr(o),b=this.edits(e),f=o.objects.length,w=o.openings.filter(y=>y.kind!=="window").length,v=o.openings.length-w,M=o.openings.length===0?void 0:`${O(w,"door")}, ${O(v,"window")}`,$=y=>`room-${y}`;return c`
      ${this.roomBefore?.(e,o)??g}

      <section class="hme-card hme-head">
        ${Us(o,s)}
        <div class="hme-head-t">
          <strong>${T(o)}</strong>
          <span>${to(o)} · ${r.area.toFixed(1)} m²${h===void 0?"":` \xB7 ${h} area`}</span>
          <span>${K(e.floor)}</span>
        </div>
      </section>

      ${this.roomTray?.(e,o)??g}

      ${sn(e,o)}

      ${Re($("furniture"),"Furniture",f===0?void 0:O(f,"thing"),this.furnitureList(e,o),"hme-inroom")}

      ${Re(Ai,"Name, area and tap",h,c`
        ${B("Name",Tt({value:o.name??"",label:"Name",placeholder:"Room",set:y=>e.apply(P=>ia(P,i,y))}))}
        ${B("Area",Me({label:"Area",value:o.areaId??"",options:[{value:"",label:"None"},...p?[]:[{value:o.areaId,label:`Not in Home Assistant (${o.areaId})`,disabled:!0}],...e.areas.map(y=>({value:y.id,label:y.name}))],set:y=>e.apply(P=>Co(P,i,y===""?void 0:y))}))}
        ${U("The Home Assistant area. Its devices wait in Not on the map.")}
        ${B("Tap opens",Me({label:"Tap opens",value:o.pageId??"",options:[{value:"",label:"Nothing"},...m?[]:[{value:o.pageId,label:"A page not in your library",disabled:!0}],...e.pages.map(y=>({value:y.id,label:`Page: ${y.name}`}))],set:y=>e.apply(P=>ra(P,i,y===""?void 0:y))}))}
        ${U("What a tap on this room does on the map tiles and the watch.")}`)}

      ${Re($("size"),"Size and place",to(o),c`
        ${ge(z({tag:"Width",label:"Width",value:r.width,unit:"m",min:zt,max:jt,...b((y,P)=>Nt(y,i,{width:P}))}),z({tag:"Depth",label:"Depth",value:r.depth,unit:"m",min:zt,max:jt,...b((y,P)=>Nt(y,i,{depth:P}))}),z({tag:"Height",label:"Wall height",value:o.height,unit:"m",min:.5,max:20,...b((y,P)=>Kt(y,i,P))}))}
        ${ge(z({tag:"From left",label:"Left",value:d.minX,unit:"m",...b((y,P)=>vt(y,i,P-d.minX,0))}),z({tag:"From top",label:"Top",value:d.minY,unit:"m",...b((y,P)=>vt(y,i,0,P-d.minY))}))}
        <div class="hme-turn">
          ${z({label:"Turn",value:l,unit:"\xB0",digits:1,min:-180,max:180,...b((y,P)=>qe(y,i,P-l))})}
          <button type="button" class="hme-tb" @click=${()=>e.apply(y=>qe(y,i,-90))}>−90°</button>
          <button type="button" class="hme-tb" @click=${()=>e.apply(y=>qe(y,i,90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it so its longest wall runs straight across or down" @click=${()=>e.apply(y=>Nn(y,i))}>Level</button>
        </div>
        <p class="hme-foot-hint">Along its own walls, about its middle; its doors, things and devices move with it. Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the room to move it, a square handle to resize it, the round one to turn it.</p>
        ${B("Floor",Me({label:"Floor",value:e.floor.id,options:[...e.doc.floors.map(y=>({value:y.id,label:K(y)})),{value:"new",label:"New floor\u2026"}],set:y=>{this.moveToFloor(e,o,y)}}))}`)}

      ${Re($("finish"),"Floor and walls",Ti[o.finish??u],c`<div class="hme-pics">
        ${le({label:`Auto: ${Ti[u]}`,picture:vi(u),on:o.finish===void 0,title:"Picked from the room's name and furniture",click:()=>e.apply(y=>Wn(y,i,void 0))})}
        ${wr.map(y=>le({label:Ti[y],picture:vi(y),on:o.finish===y,click:()=>e.apply(P=>Wn(P,i,y))}))}
      </div>
        ${this.roomColourRow(e,o,"floorColor")}
        ${this.roomColourRow(e,o,"wallColor")}
        <p class="hme-foot-hint">On the plan, the night, warm and clay looks and in 3D, here, on the iPhone and on the watch. The line looks keep their own colour.</p>`)}

      ${Re($("openings"),"Doors and windows",M,c`
        ${this.roomDoors?.(e,o)??g}
        ${this.roomWalls?.(e,o)??g}`,"hme-fold-cards")}

      ${Re($("scan"),"The scan",void 0,c`
        ${this.roomScan?.(e,o)??g}
        ${A("More",c`
        <div class="hme-row-end">
          ${on({label:"\uFF0B Add a plain box",cls:"hme-tb",options:aa.map(y=>({value:y,label:rt(y)})),pick:y=>{let P=Y(o)??ce(o);e.apply(F=>sa(F,i,y,P))}})}
          <button type="button" class="hme-tb danger push" @click=${()=>{this.askDelete(e,o)}}>Delete room</button>
        </div>`)}`,"hme-fold-cards")}`}furnitureList(e,t){let o=e.floor,n=e.toggles.live?e.hass?.states:void 0,i=e.selection,r=t.id,s=[],d=[];t.objects.forEach((p,h)=>{let m={roomId:r,object:h},u=xe(p),b=p.hidden===!0,f=xt(o,r,h),w=hn(p)||f!==void 0&&f.entityId.startsWith("light."),v=Bl(e,{sel:{kind:"object",...m},picked:Ms(i,r,h),hidden:b,icon:w?c`<span class="hme-ly-lamp ${f!==void 0&&Ri(f.entityId,n)?"lit":""}" aria-hidden="true"></span>`:c`<span class="hme-thing-ic" aria-hidden="true"></span>`,name:u,end:b?"hidden":f!==void 0?`${ie(f,e.hass)} \xB7 ${fe(f.entityId,n)}`:w?"no light":`${p.size[0].toFixed(1)} \xD7 ${p.size[1].toFixed(1)}`,title:"Pick it to move, resize or turn it. Cmd or Ctrl and a click picks several.",pick:M=>e.select(M.metaKey||M.ctrlKey?it(e.selection,m):{kind:"object",...m}),eye:()=>e.apply(M=>To(M,r,h,!b))});(w?s:d).push(v)});let l=(p,h)=>h.length===0?g:c`<div class="hme-ly-grp">${p}</div>${h}`;return c`<div class="hme-ly-list">
        ${s.length+d.length===0?c`<p class="hme-empty-line">No furniture yet. A bed, a sofa or a table makes the map read.</p>`:g}
        ${l("Lamps",s)}
        ${l("Furniture",d)}
      </div>
      <button type="button" class="hme-tb hme-wide" title="Add furniture to this room" @click=${()=>e.openAdd("furniture")}>＋ Add furniture to ${T(t)}</button>`}edits(e){return t=>({set:o=>e.apply(n=>t(n,o)),preview:o=>e.preview(o===void 0?void 0:n=>t(n,o))})}thingInspector(e,t){let{room:o,index:n,object:i}=t,r=o.id,s=xe(i),[d,l,p]=i.size,h=Gl(i),m=this.edits(e),u={kind:"room",roomId:r},b={unit:"m",min:yt,max:Oo};return c`
      <section class="hme-card hme-head">
        <div class="hme-head-t">
          <strong>${s}</strong>
          <span>In ${T(o)} · ${d.toFixed(2)} × ${l.toFixed(2)} × ${p.toFixed(2)} m${(i.lift??0)>0?` \xB7 ${(i.lift??0).toFixed(2)} m up`:""}${i.hidden===!0?" \xB7 Hidden":""}</span>
        </div>
      </section>

      ${this.modelCard(e,t)}

      ${this.coloursCard(e,t)}

      ${A("Size",c`
        ${ge(z({tag:"Width",label:"Width",value:d,...b,...m((f,w)=>Bt(f,r,n,{width:w}))}),z({tag:"Depth",label:"Depth",value:l,...b,...m((f,w)=>Bt(f,r,n,{depth:w}))}),z({tag:"Height",label:"Height",value:p,...b,min:.01,...m((f,w)=>Gn(f,r,n,{size:[d,l,w]}))}))}`)}

      ${A("Place",c`
        ${bi("Middle, and up off the floor",ge(z({tag:"Across",label:"Middle across",value:i.c[0],unit:"m",...m((f,w)=>wt(f,r,n,[w,i.c[1]]))}),z({tag:"Down",label:"Middle down",value:i.c[1],unit:"m",...m((f,w)=>wt(f,r,n,[i.c[0],w]))}),z({tag:"Up",label:"Up off the floor",value:i.lift??0,unit:"m",min:0,max:100,...m((f,w)=>Gn(f,r,n,{lift:w}))})))}
        ${bi("Turn",c`<div class="hme-turn">
          ${z({label:"Turn",value:h,unit:"\xB0",digits:1,min:-180,max:180,...m((f,w)=>Xe(f,r,n,w-h))})}
          <button type="button" class="hme-tb" title="Turn it a quarter one way" @click=${()=>e.apply(f=>Xe(f,r,n,-90))}>−90°</button>
          <button type="button" class="hme-tb" title="Turn it a quarter the other way" @click=${()=>e.apply(f=>Xe(f,r,n,90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it square with the room's walls" @click=${()=>e.apply(f=>fa(f,r,n))}>Line up</button>
        </div>`)}
        <p class="hme-foot-hint">Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the thing to move it, a square handle to resize it, the round one to turn it.</p>`)}

      ${A("Show",c`
        <div class="hme-r tight"><span class="hme-grow">On the map, the tiles and the watch</span>
          ${so({on:i.hidden!==!0,onText:"Shown",offText:"Hidden",label:`${s} shown`,click:()=>e.apply(f=>To(f,r,n,i.hidden!==!0))})}</div>
        <p class="hme-foot-hint">Scan Again on the iPhone puts the room's things back where the scan finds them. A hidden thing stays hidden.</p>
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${()=>e.select(u)}>‹ ${T(o)}</button>
          <button type="button" class="hme-tb danger push" @click=${()=>e.apply(f=>So(f,r,n),{select:u})}>Remove</button>
        </div>`)}`}manyInspector(e,t){let o=at(t),n=[...new Set(t.map(s=>T(s.room)))],i=we(t.map(s=>s.object.hidden===!0)),r=Ul.filter(s=>t.some(d=>Ii(d.object).includes(s)));return c`
      <section class="hme-card hme-head">
        <div class="hme-head-t">
          <strong>${O(t.length,"thing")}</strong>
          <span>${rd(t)} · in ${n.join(", ")}</span>
        </div>
      </section>

      ${A("Picked",c`${t.map(s=>c`<div class="hme-list-row hme-pick-row">
          <button type="button" class="hme-grow hme-link ${s.object.hidden===!0?"dim":""}" title="Pick this one alone"
            @click=${()=>this.pickThing(e,s.room,s.index)}>${xe(s.object)}</button>
          <span class="hme-val">${T(s.room)}</span>
          <button type="button" class="hme-x" aria-label=${`Leave ${xe(s.object)} out of the pick`} title="Leave it out of the pick"
            @click=${()=>e.select(it(e.selection,{roomId:s.room.id,object:s.index}))}>×</button></div>`)}
        <p class="hme-foot-hint">Cmd or Ctrl and a click on the plan or in 3D adds a thing or takes one away. The arrow keys move them all.</p>`,String(t.length))}

      ${r.length===0?g:A("Colours",c`
        ${r.map(s=>this.manyColourRow(e,t,s))}
        <p class="hme-foot-hint">Set on every picked thing whose piece has that part. In the 3D view and on the iPhone.</p>`)}

      ${A("Show",c`
        <div class="hme-r tight"><span class="hme-grow">On the map, the tiles and the watch</span>
          ${i.mixed?c`<button type="button" class="hme-chip off" aria-pressed="mixed" aria-label="Shown" title="Some are hidden: show them all"
                @click=${()=>e.apply(s=>Io(s,o,!1))}>Mixed</button>`:so({on:!i.value,onText:"Shown",offText:"Hidden",label:"Shown",click:()=>e.apply(s=>Io(s,o,!i.value))})}</div>
        <div class="hme-row-end">
          <button type="button" class="hme-tb danger push" @click=${()=>{this.askDeleteThings(e,t)}}>Delete ${O(t.length,"thing")}</button>
        </div>`)}`}manyColourRow(e,t,o){let n=t.filter(s=>Ii(s.object).includes(o)),i=at(n),r=we(n.map(s=>s.object[o]?.toUpperCase()));return Si({word:o==="fabric"?"Fabric":"Wood",presets:o==="fabric"?ri:ai,now:r.mixed?void 0:r.value,mixed:r.mixed,defaultTitle:"Each model's own colour",customTitle:`Any ${o} colour`,customLabel:`Pick a ${o} colour for every picked thing`,set:s=>e.apply(d=>qn(d,i,o,s)),preview:s=>e.preview(s===void 0?void 0:d=>qn(d,i,o,s)??d)})}modelCard(e,t){let{room:o,index:n,object:i}=t,r=qt(i),s=ot(i.model),d=s!==void 0?`${s.group}, picked from the catalog`:i.model!==void 0?r===void 0?"A piece this panel does not know yet":`A piece this panel does not know yet, drawn as the ${r.name.toLowerCase()} meanwhile`:r!==void 0?`Picked by its kind: ${rt(i.kind)}`:"A plain box, as the scan found it";return A("Model",c`<div class="hme-model">
        ${this.piecePic(e,r,"hme-model-pic")}
        <div class="hme-model-t"><strong>${r?.name??"Plain box"}</strong><span>${d}</span></div>
        <button type="button" class="hme-tb push" title="Pick another piece from the furniture catalog; it keeps its place, size and turn"
          @click=${()=>this.openPicker(e,o,n)}>Change…</button>
      </div>
      <p class="hme-foot-hint">What it looks like in the 3D view and on the iPhone. The flat plan and the tiles draw it as before.</p>`)}coloursCard(e,t){let o=Ii(t.object);return o.length===0?g:A("Colours",c`
      ${o.map(n=>this.colourRow(e,t,n))}
      <p class="hme-foot-hint">In the 3D view and on the iPhone. The flat plan, the tiles and the furniture picker keep the model's own colours.</p>`)}colourRow(e,t,o){let{room:n,index:i,object:r}=t,s=n.id;return Si({word:o==="fabric"?"Fabric":"Wood",presets:o==="fabric"?ri:ai,now:r[o],defaultTitle:"The model's own colour",customTitle:`Any ${o} colour`,customLabel:`Pick a ${o} colour`,set:l=>e.apply(p=>Vn(p,s,i,o,l)),preview:l=>e.preview(l===void 0?void 0:p=>Vn(p,s,i,o,l)??p)})}roomColourRow(e,t,o){let n=t.id,i=o==="floorColor";return Si({word:i?"Floor":"Walls",presets:i?_l[Ho(t)]:zl,now:t[o],defaultTitle:i?"The finish's own colour":"The look's own wall colour",customTitle:i?"Any floor colour":"Any wall colour",customLabel:i?"Pick a floor colour":"Pick a wall colour",set:r=>e.apply(s=>Un(s,n,o,r)),preview:r=>e.preview(r===void 0?void 0:s=>Un(s,n,o,r)??s)})}floorCard(e,t){return c`${A("Floor",this.floorBody(e,t))}${id(e,t)}`}floorBody(e,t){let o=yo(t,e.toggles.live?e.hass?.states:void 0),n=t.rooms.reduce((i,r)=>i+r.objects.length,0);return c`
      ${B("Name",Tt({value:t.name,label:"Floor name",placeholder:K(t),set:i=>e.apply(r=>Eo(r,t.id,i))}))}
      ${B("On it",c`<span class="hme-val">${O(t.rooms.length,"room")} · ${O(n,"thing")} · ${O(t.pins.length,"device")} · ${Mo(o)}</span>`)}`}};var Vl=.4,ql=.15;function Xl(a,e,t){let o=t[0]-e[0],n=t[1]-e[1],i=o*o+n*n,r=i===0?0:Math.max(0,Math.min(1,((a[0]-e[0])*o+(a[1]-e[1])*n)/i));return Math.hypot(a[0]-(e[0]+r*o),a[1]-(e[1]+r*n))}function Yl(a,e){let t=1/0;for(let o=0,n=e.length-1;o<e.length;n=o,o+=1)t=Math.min(t,Xl(a,e[n],e[o]));return t}function*ld(a,e,t){yield a;for(let o=1;o*e<=t;o+=1){let n=o*e,i=Math.min(64,Math.max(8,Math.ceil(2*Math.PI*n/e)));for(let r=0;r<i;r+=1){let s=r/i*2*Math.PI;yield[a[0]+n*Math.cos(s),a[1]+n*Math.sin(s)]}}}function pd(a,e){return a.reduce((t,o)=>Math.max(t,Math.hypot(o[0]-e[0],o[1]-e[1])),0)}function hd(a,e,t,o=Vl){let n=Y(a);if(n===void 0)return;let i=a.outline,r=(d,l)=>Z(i,d)&&(i.length<3||Yl(d,i)>=l)&&e.every(p=>Math.hypot(p.at[0]-d[0],p.at[1]-d[1])>=o)&&(t===void 0||Math.abs(d[0]-t.at[0])>t.halfW||Math.abs(d[1]-t.at[1])>t.halfH),s=pd(i,n);for(let d of[ql,0])for(let l of ld(n,.1,s))if(r(l,d))return[sd(l[0]),sd(l[1])];return n}var sd=a=>Math.round(a*1e3)/1e3;function Zl(a,e,t){if(t.length===0)return!1;let o=[[a[0]-e[0],a[1]-e[1]],[a[0]+e[0],a[1]-e[1]],[a[0]+e[0],a[1]+e[1]],[a[0]-e[0],a[1]+e[1]]],n=[[1,0],[0,1]];for(let i=0,r=t.length-1;i<t.length;r=i,i+=1){let s=t[i][0]-t[r][0],d=t[i][1]-t[r][1];(s!==0||d!==0)&&n.push([-d,s])}for(let[i,r]of n){let s=m=>{let u=1/0,b=-1/0;for(let f of m){let w=f[0]*i+f[1]*r;u=Math.min(u,w),b=Math.max(b,w)}return[u,b]},[d,l]=s(o),[p,h]=s(t);if(l<=p||h<=d)return!1}return!0}function Ql(a,e,t){let o=Math.max(Math.abs(t.c[0]-a[0])-e[0],0),n=Math.max(Math.abs(t.c[1]-a[1])-e[1],0);return o*o+n*n<t.r*t.r}function dd(a,e,t,o=4){let n=s=>t.room.length<3||[[s[0]-e[0],s[1]-e[1]],[s[0]+e[0],s[1]-e[1]],[s[0]+e[0],s[1]+e[1]],[s[0]-e[0],s[1]+e[1]]].every(d=>Z(t.room,d)),i=s=>n(s)&&t.boxes.every(d=>!Zl(s,e,d))&&t.circles.every(d=>!Ql(s,e,d))&&t.taken.every(d=>Math.abs(d.c[0]-s[0])>=d.half[0]+e[0]||Math.abs(d.c[1]-s[1])>=d.half[1]+e[1]),r=pd(t.room,a);for(let s of ld(a,o,Math.min(r,600)))if(i(s))return s}var Jl=[10,4];function md(a,e,t,o){return{room:a.outline.map(n=>e(n)),boxes:a.objects.filter(n=>n.hidden!==!0&&n.kind!=="rug").map(n=>ee(J(n)).map(i=>e(i))),circles:t,taken:o}}function cd(a,e,t){for(let[o,n]of e.entries())for(let i of Jl){let r=dd(a,[n[0]+i,n[1]+i],t);if(r!==void 0)return{at:r,pill:o}}for(let[o,n]of e.entries()){let i=dd(a,n,t);if(i!==void 0)return{at:i,pill:o}}}var ep=18,cn=16;function Fi(a){return a.length*5.9+14}var tp=/^[-–—·|:/,]+$/;function mn(a){return a.split(/\s+/).filter(e=>e!==""&&!tp.test(e))}var Oi=(a,e)=>a.toLowerCase().replace(/['’]/g,"")===e.toLowerCase().replace(/['’]/g,"");function op(a,e){if(e===void 0)return a;let t=mn(e);return t.length===0||a.length<=t.length?a:t.every((o,n)=>Oi(o,a[n]))?a.slice(t.length):a}function np(a){let e=Math.min(...a.map(n=>n.length)),t=0;for(;t<e-1&&a.every(n=>Oi(n[t],a[0][t]));)t+=1;let o=0;for(;t+o<e-1&&a.every(n=>Oi(n[n.length-1-o],a[0][a[0].length-1-o]));)o+=1;return a.map(n=>n.slice(t,n.length-o))}function ud(a,e=ep){let t=a.join(" ");if(t.length<=e)return t;let o="";for(let n of a){let i=o===""?n:`${o} ${n}`;if(i.length>e-1)break;o=i}return`${o===""?t.slice(0,e-1).trimEnd():o}\u2026`}var ip=a=>a.slice(0,a.indexOf("."));function fd(a,e){return Q(a,e)?.id??""}function rp(a,e){let t=new Map,o=new Map;for(let i of a.pins){let r=Q(a,i),s=mn(e(i));t.set(i.id,op(s,r===void 0?void 0:T(r)));let d=`${r?.id??""}|${ip(i.entityId)}`;o.set(d,[...o.get(d)??[],i])}for(let i of o.values()){let r=[...new Set(i.map(l=>t.get(l.id).join(" ")))];if(r.length<2||r.some(l=>l===""))continue;let s=np(r.map(mn)),d=new Map(r.map((l,p)=>[l,s[p]]));for(let l of i)t.set(l.id,d.get(t.get(l.id).join(" ")))}let n=new Map;for(let i of a.pins){let r=t.get(i.id);n.set(i.id,r.length===0?ud(mn(e(i))):ud(r))}return n}function gd(a){return a.replace(/[-+−]?\d[\d.,]*/g,"").trim()}function wd(a,e){let t=rp(a,e.nameOf),o=new Map,n=new Map;for(let r of a.pins){if(r.reading==="none"||r.reading==="name")continue;let s=e.readingOf(r);if(s===void 0||s==="")continue;o.set(r.id,s);let d=`${fd(a,r)}|${gd(s)}`;n.set(d,(n.get(d)??new Set).add(r.entityId))}let i=new Map;for(let r of a.pins){if(e.picked(r)||r.reading==="name"){i.set(r.id,{text:e.nameOf(r),must:!0});continue}if(r.reading==="none")continue;let s=o.get(r.id);if(s!==void 0){let d=(n.get(`${fd(a,r)}|${gd(s)}`)?.size??0)>1;i.set(r.id,{text:d?`${t.get(r.id)} ${s}`:s,must:!0});continue}e.names&&i.set(r.id,{text:t.get(r.id),must:!1})}return i}var Li=2,bd=4;function vd(a,e){return Math.abs(a.c[0]-e.c[0])<a.half[0]+e.half[0]+Li&&Math.abs(a.c[1]-e.c[1])<a.half[1]+e.half[1]+Li}function ap(a,e){let t=Math.max(Math.abs(e.c[0]-a.c[0])-a.half[0],0),o=Math.max(Math.abs(e.c[1]-a.c[1])-a.half[1],0);return Math.hypot(t,o)<e.r+Li}function yd(a,e,t=[]){let o=[],n=new Map,i=[...a.filter(r=>e.get(r.id)?.must===!0),...a.filter(r=>e.get(r.id)?.must===!1)];for(let r of i){let s=e.get(r.id),d=[Fi(s.text)/2,cn/2],[l,p]=r.c,h=r.r+bd+d[1],m=r.r+bd+d[0],u=[[l,p+h],[l,p-h],[l+m,p],[l-m,p]],b=M=>{let $={c:M,half:d};return a.every(y=>y.id===r.id||!ap($,y))&&o.every(y=>!vd($,y))&&t.every(y=>!vd($,y))},f=r.room,w=M=>f===void 0||f.length<3||[[M[0]-d[0],M[1]-d[1]],[M[0]+d[0],M[1]-d[1]],[M[0]+d[0],M[1]+d[1]],[M[0]-d[0],M[1]+d[1]]].every($=>Z(f,$)),v=u.find(M=>w(M)&&b(M))??u.find(b)??(s.must?u[0]:void 0);v!==void 0&&(o.push({c:v,half:d}),n.set(r.id,v))}return n}var _i=["light","cover","fan","climate","media_player","lock","vacuum","humidifier","water_heater","alarm_control_panel","valve"],$d=["switch","input_boolean","camera","siren","remote"];function xd(a){let e=a.indexOf(".");return e<0?a:a.slice(0,e)}function un(a){if(a.category!==void 0&&a.category!==null&&a.category!==""||a.hidden===!0)return;let e=xd(a.entityId);if(_i.includes(e))return"main";if($d.includes(e))return"switch"}function Hd(a){return new Set((a?.floors??[]).flatMap(e=>e.pins.map(t=>t.entityId)))}function Md(a){let e=xd(a),t=_i.indexOf(e);return t>=0?t:_i.length+$d.indexOf(e)}function kd(a,e){let t=Md(a.entityId)-Md(e.entityId);if(t!==0)return t;let o=a.name.toLowerCase(),n=e.name.toLowerCase();return o!==n?o<n?-1:1:a.entityId<e.entityId?-1:a.entityId>e.entityId?1:0}function St(a,e,t,o=Hd(t)){let n=[],i=[],r=a.areaId;if(r===void 0||r==="")return{main:n,more:i};for(let s of e){if(s.areaId!==r||o.has(s.entityId))continue;let d=un(s);d==="main"?n.push(s):d==="switch"&&i.push(s)}return n.sort(kd),i.sort(kd),{main:n,more:i}}function zi(a,e){let t=Hd(a),o=a?.floors??[],n=new Set(o.flatMap(r=>r.rooms.map(s=>s.areaId)).filter(r=>r!==void 0&&r!=="")),i=new Set;for(let r of e)r.areaId!==void 0&&n.has(r.areaId)&&!t.has(r.entityId)&&un(r)==="main"&&i.add(r.entityId);return{rooms:o.reduce((r,s)=>r+s.rooms.length,0),placed:t.size,waiting:i.size}}var ji="Finish your map";function Ni(a){return`${a.filter(e=>e.done).length} of ${a.length} done`}var po=(a,e,t)=>`${a} ${a===1?e:t}`;function sp(a,e){return a===0?e>0?`${po(e,"device waits","devices wait")} in your rooms.`:"Put your lights and devices on the map.":e>0?`${a} on the map. ${po(e,"more waits","more wait")}.`:`${a} on the map.`}function Pd(a,e){return[{id:1,title:"Rooms",words:`${po(a.rooms,"room","rooms")}.`,done:a.rooms>0},{id:2,title:"Devices",words:sp(a.placed,a.waiting),done:a.placed>0},{id:3,title:"On a page",words:e?"On a page.":"Put the map on a page to use it each day.",done:e}]}function fn(a){return a.find(e=>!e.done)}function Ed(a,e){return e>0?`${a} \xB7 ${ho(e)}`:a}function ho(a){return po(a,"waits","wait")}function Cd(a){return a.onMap>0&&a.wait>0?`${a.onMap} on the map \xB7 ${ho(a.wait)}`:a.onMap>0?`${a.onMap} on the map`:a.wait>0?ho(a.wait):a.hasArea?a.more>0?Ki(a.more):"No devices in its area":"No area"}function Ki(a){return`${po(a,"switch","switches")} and more`}var gn=Math.PI/4,Bi=8,st="#ffbf55",E=a=>a.toFixed(1);function dp(a,e){return`${ei(a.domain)} \xB7 ${fe(a.entityId,e)}`}function lp(a,e){let t=ei(a.domain);return`${t.charAt(0).toUpperCase()}${t.slice(1)} \xB7 ${fe(a.entityId,e)}`}function pp(a,e){let t=Q(a,e);if(t===void 0)return"Not in a room";let o=V(a,e.at);return o!==void 0&&k(o.id,t.id)?`${T(t)} (found by place)`:T(t)}function hp(a,e,t){return a.icon!==void 0?Xo[a.icon]:`Auto (${Xo[ye(a.entityId,e,t)].toLowerCase()})`}var Td={ceiling:"Ceiling",floor:"Floor",table:"Table",wall:"Wall",bulb:"Just a bulb"},Dd="wa-home-map-lamp-choice";function Ad(){try{return globalThis.localStorage??void 0}catch{return}}function Od(){try{let a=Ad()?.getItem(Dd);return gt.includes(a)?a:void 0}catch{return}}function Wi(a){try{Ad()?.setItem(Dd,a)}catch{}}function Ui(){return Od()??"ceiling"}var Ld={ceiling:"Ceiling lamp",floor:"Floor lamp",table:"Table lamp",wall:"Wall lamp",bulb:"Just a bulb"},be=a=>a.startsWith("light."),mp=16,bn=class{constructor(e){this.picture=e;this.side=!0;this.names=!0;this.moving=!1;this.iconsOpen=!1;this.pickPage=!1;this.chooserFocus=!1;this.moreOpen=new Set;this.blinking=new Set}states(e){return e.toggles.live?e.hass?.states:void 0}areaCard(e,t,o){let n=ts(e.hass,t,o);if(n===void 0)return g;let i=l=>l===void 0?"No area":e.areas.find(p=>p.id===l)?.name??l,r=i(n.roomAreaId),s=this.areaMove?.entityId===t?this.areaMove.state:void 0,d=async()=>{let l=e.hass;if(l!==void 0){this.areaMove={entityId:t,state:"busy"},e.redraw();try{await l.connection.sendMessagePromise({type:"config/entity_registry/update",entity_id:t,area_id:n.roomAreaId}),this.areaMove=void 0}catch{this.areaMove={entityId:t,state:"failed"}}e.redraw()}};return A("Area",c`
      ${B("In Home Assistant",c`<span class="hme-in hme-ro">${i(n.deviceAreaId)}</span>`)}
      ${B("On the map",c`<span class="hme-in hme-ro">${r}</span>`)}
      ${n.movable?c`<div class="hme-row-end">
        <button type="button" class="hme-tb" ?disabled=${s==="busy"} title="Set this device's area in Home Assistant to the room's"
          @click=${d}>${s==="busy"?"Moving\u2026":`Move to ${r} in Home Assistant`}</button></div>`:g}
      ${s==="failed"?U("Home Assistant did not take the change. Set the area in its settings instead.",!0):g}
      ${U("They can differ on purpose, for a group kept in an area of its own.",!0)}`)}picked(e){let t=e.selection;return t?.kind==="pin"?e.floor.pins.find(o=>k(o.id,t.pinId)):void 0}picks(e){return et(e.selection).flatMap(t=>e.floor.pins.filter(o=>k(o.id,t)))}deviceClass(e,t){let o=e.hass?.states?.[t]?.attributes?.device_class;return typeof o=="string"?o:void 0}friendly(e,t){let o=e.hass?.states?.[t]?.attributes?.friendly_name;return typeof o=="string"&&o.trim()!==""?o.trim():void 0}place(e,t,o,n){let i=Je(e.doc,t);if(i!==void 0)return k(i.floorId,e.floor.id)||e.setFloor(i.floorId),e.select({kind:"pin",pinId:i.pinId}),!1;let r=Vt(e.floor,n),s=o??(r===void 0?Ke(e.view,[e.stage.width/2,e.stage.height/2]):this.freeSpot(e,r)),d=e.newId().toUpperCase(),l=e.floor.id,p=this.friendly(e,t),h=e.apply(m=>Pa(m,l,{id:d,entityId:t,at:[s[0],s[1]],...p===void 0?{}:{name:p}}),{select:{kind:"pin",pinId:d}});return h||e.note("warn","That device could not be put on the map: the map holds at most 400 devices."),h}deviceRow(e,t,o){let n=be(t.entityId),i=n?void 0:Je(e.doc,t.entityId),r=n?Bo(e.doc,t.entityId).length:0,s=ye(t.entityId,t.deviceClass,t.name),d=()=>n?this.addLight(e,t.entityId,void 0,t.areaId):this.place(e,t.entityId,void 0,t.areaId),l=n?"Drag onto the plan or onto a lamp, or click to add it in its area's room. A light can be on the map many times.":i===void 0?"Drag onto the plan, or click to put it in its area's room":"On the map: click to pick it";return c`<div class="hme-dv ${this.dragging===t.entityId?"dragging":""} ${i===void 0?"":"placed"}" role="button" tabindex="0"
      draggable=${i===void 0?"true":"false"} title=${l}
      @dragstart=${p=>{p.dataTransfer?.setData(Gt,t.entityId),n&&p.dataTransfer?.setData(Vo,t.entityId),p.dataTransfer?.setData("text/plain",t.entityId),p.dataTransfer&&(p.dataTransfer.effectAllowed="copy"),this.dragging=t.entityId,e.redraw()}}
      @dragend=${()=>{this.dragging=void 0,this.dropAt=void 0,this.lampOver=void 0,e.redraw()}}
      @click=${d}
      @keydown=${p=>{p.target===p.currentTarget&&(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),d())}}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${ae(s,"currentColor",24,2)}</svg></span>
      <span class="hme-dv-nm">${t.name}<small>${i===void 0?dp(t,o):"on the map"}</small></span>
      ${r===0?g:c`<button type="button" class="hme-dv-count" title="Pick the next one on the map"
        @click=${p=>{p.stopPropagation(),this.pickNext(e,t.entityId)}}
        @keydown=${p=>p.stopPropagation()}>${r} on map</button>`}
      <span class="hme-dv-grip" aria-hidden="true">${i===void 0?"\u22EE\u22EE":"\u203A"}</span>
    </div>`}pickNext(e,t){let o=e.doc.floors.flatMap(l=>l.pins.filter(p=>p.entityId===t).map(p=>({floor:l,pin:p})));if(o.length===0)return;let n=e.selection,i=n?.kind==="pin"?n.pinId:n?.kind==="object"?xt(e.floor,n.roomId,n.object)?.id:void 0,r=i===void 0?-1:o.findIndex(l=>k(l.pin.id,i)),s=o[(r+1)%o.length];k(s.floor.id,e.floor.id)||e.setFloor(s.floor.id);let d=ve(s.floor,s.pin.id);e.select(d===void 0?{kind:"pin",pinId:s.pin.id}:{kind:"object",roomId:d.roomId,object:d.object})}homeDevices(e){return e.devices??Qe(e.hass)}waitingIn(e,t){return St(t,this.homeDevices(e),e.doc)}freeSpot(e,t){let o=Y(t)??ce(t),n=Math.max(e.px(1),1),i=T(t).length*7.4+22,r={at:o,halfW:Math.min((i/2+14)/n,1.2),halfH:Math.min(25/n,.5)};return hd(t,Ve(e.floor,t.id),r)??o}arm(e,t){this.armed=this.armed===t?void 0:t,e.redraw()}placeArmed(e,t){let o=this.armed;if(o===void 0)return;this.armed=void 0;let n=be(o),i=this.emptyThingAt(e,t,n),r=V(e.floor,t);(i!==void 0?this.putOn(e,i,o):n?this.placeLight(e,o,t):this.place(e,o,t))&&(this.trayRoom=i?.roomId??r?.id),e.redraw()}blink(e,t){let o=e.hass,n=o?.states?.[t]?.state;if(o===void 0||!be(t)||n===void 0||n==="unavailable"||this.blinking.has(t))return;let i=n==="on";this.blinking.add(t),e.redraw();let r=s=>e.note("warn",`Could not blink it: ${s instanceof Error?s.message:String(s?.message??s)}`);Dt(o,"light",i?"turn_off":"turn_on",{entity_id:t}).then(()=>new Promise(s=>setTimeout(s,1e3)).then(()=>Dt(o,"light",i?"turn_on":"turn_off",{entity_id:t}))).catch(r).finally(()=>{this.blinking.delete(t),e.redraw()})}trayRow(e,t){let o=be(t.entityId),n=this.armed===t.entityId,i=ye(t.entityId,t.deviceClass,t.name),r=e.hass?.states?.[t.entityId]?.state,s=o&&r!==void 0&&r!=="unavailable";return c`<div class="hme-dv hme-tray-row ${n?"armed":""} ${this.dragging===t.entityId?"dragging":""}" role="button" tabindex="0"
      draggable="true" aria-pressed=${n?"true":"false"}
      title=${n?"Click its place on the plan. Click here again to stop.":"Drag it onto the plan, or click it, then click its place"}
      @dragstart=${d=>{d.dataTransfer?.setData(Gt,t.entityId),o&&d.dataTransfer?.setData(Vo,t.entityId),d.dataTransfer?.setData("text/plain",t.entityId),d.dataTransfer&&(d.dataTransfer.effectAllowed="copy"),this.dragging=t.entityId,this.armed=void 0,e.redraw()}}
      @dragend=${()=>{this.dragging=void 0,this.dropAt=void 0,this.lampOver=void 0,e.redraw()}}
      @click=${()=>this.arm(e,t.entityId)}
      @keydown=${d=>{d.target===d.currentTarget&&(d.key==="Enter"||d.key===" ")&&(d.preventDefault(),this.arm(e,t.entityId))}}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${ae(i,"currentColor",24,2)}</svg></span>
      <span class="hme-dv-nm">${t.name}<small>${lp(t,e.hass?.states)}</small></span>
      ${s?c`<button type="button" class="hme-tb hme-blink" ?disabled=${this.blinking.has(t.entityId)} title="Turn it the other way for a second, to see which light it is"
        @click=${d=>{d.stopPropagation(),this.blink(e,t.entityId)}}
        @keydown=${d=>d.stopPropagation()}>Blink</button>`:g}
      <span class="hme-dv-grip" aria-hidden="true">⋮⋮</span>
    </div>`}trayCard(e,t,o="Not on the map"){let n=this.waitingIn(e,t),i=this.moreOpen.has(t.id.toUpperCase()),r=n.more.length===0?g:c`<button type="button" class="hme-tray-more" aria-expanded=${i?"true":"false"}
        @click=${()=>{let d=t.id.toUpperCase();i?this.moreOpen.delete(d):this.moreOpen.add(d),e.redraw()}}>
        ${Ki(n.more.length)}<span aria-hidden="true">${i?"\u25BE":"\u203A"}</span></button>
      ${i?n.more.map(d=>this.trayRow(e,d)):g}`,s=g;if(t.areaId===void 0){let d=t.id;s=c`<p class="hme-empty-line">This room has no area. Pick one below to see its devices.</p>
        ${B("Area",Me({label:"Area",value:"",options:[{value:"",label:"None"},...e.areas.map(l=>({value:l.id,label:l.name}))],set:l=>{l!==""&&e.apply(p=>Co(p,d,l))}}))}`}else if(n.main.length===0&&n.more.length===0){let d=this.homeDevices(e).some(l=>l.areaId===t.areaId&&un(l)!==void 0);s=c`<p class="hme-empty-line">${d?"Every device of this room is on the map.":"No devices in this room's area."}</p>`}return A(o,c`
      ${n.main.length===0&&n.more.length===0?g:c`<p class="hme-foot-hint hme-tray-how">Drag one onto the plan. Or click it, then click its place.</p>`}
      ${s}
      <div class="hme-tray">${n.main.map(d=>this.trayRow(e,d))}${r}</div>`,n.main.length===0?void 0:ho(n.main.length),"hme-tray-card")}onMapCard(e,t){let o=Ve(e.floor,t.id),n=this.states(e),i=et(e.selection);return A("On the map",c`<div class="hme-ly-list">
      ${o.length===0?c`<p class="hme-empty-line">No devices yet.</p>`:o.map(r=>{let s={kind:"pin",pinId:r.id},d=e.hover?.kind==="pin"&&k(e.hover.pinId,r.id),l=i.some(p=>k(p,r.id));return c`<div class="hme-ly ${l?"on":""} ${d?"hov":""}"
          @pointerenter=${()=>e.setHover(s)} @pointerleave=${()=>e.setHover(void 0)}>
          <button type="button" class="hme-ly-main" aria-pressed=${l?"true":"false"} title="Pick it. Shift, Cmd or Ctrl and a click picks several."
            @click=${p=>e.select(p.shiftKey||p.metaKey||p.ctrlKey?Ht(e.selection,r.id):s)}>
            <span class="hme-dot dev ${Ri(r.entityId,n)||!be(r.entityId)?"":"off"}" aria-hidden="true"></span><span class="hme-ly-nm">${ie(r,e.hass)}</span><span class="hme-ly-end">${fe(r.entityId,n)}</span></button>
        </div>`})}</div>`,String(o.length),"hme-onmap")}addLight(e,t,o,n){let i=o===void 0?Vt(e.floor,n??Xa(e.hass,t)):void 0,r=o??(i===void 0?Ke(e.view,[e.stage.width/2,e.stage.height/2]):Y(i)??ce(i)),s=V(e.floor,r)??i,d=Od();this.chooser={entityId:t,at:[r[0],r[1]],roomId:s?.id,choice:s===void 0?"bulb":d??"ceiling"},this.chooserFocus=!0,e.redraw()}get choosing(){return this.chooser!==void 0}cancelChooser(e){this.chooser=void 0,e.redraw()}canChoose(e){return e==="bulb"||this.chooser?.roomId!==void 0}takeChoice(e,t){let o=this.chooser;if(o===void 0)return;let n=t??o.choice;this.canChoose(n)&&(this.chooser=void 0,Wi(n),this.lightIn(e,o.entityId,n,o.at,o.roomId))}lightIn(e,t,o,n,i){let r=e.newId().toUpperCase(),s=e.floor.id,d=i===void 0?void 0:e.doc.floors.find(m=>k(m.id,s))?.rooms.find(m=>k(m.id,i)),l=this.friendly(e,t),p=o!=="bulb"&&d!==void 0?{kind:"object",roomId:d.id,object:d.objects.length}:{kind:"pin",pinId:r},h=e.apply(m=>Ia(m,s,i,t,o,n,r,l)?.doc,{select:p});return h||e.note("warn","That light could not be put on the map: the map holds at most 400 devices, and a room at most 256 things."),h}placeLight(e,t,o){let n=V(e.floor,o);return this.lightIn(e,t,n===void 0?"bulb":Ui(),[o[0],o[1]],n?.id)}chooserKey(e,t){let o=this.chooser;if(o===void 0)return!1;switch(t.key){case"Enter":return this.takeChoice(e),!0;case"Escape":return this.cancelChooser(e),!0;case"ArrowLeft":case"ArrowUp":case"ArrowRight":case"ArrowDown":{let n=gt.filter(r=>this.canChoose(r)),i=t.key==="ArrowLeft"||t.key==="ArrowUp"?-1:1;return o.choice=n[(n.indexOf(o.choice)+i+n.length)%n.length]??o.choice,this.chooserFocus=!0,e.redraw(),!0}case"Delete":case"Backspace":return!0;default:return!1}}lampChooser(e){let t=this.chooser;if(t===void 0)return g;let o=e.toScreen(t.at),n=e.toScreen(e.toPlan(0,0)),i=o[0]-n[0],r=o[1]-n[1],s=344,d=globalThis.innerWidth??1/0,l=i+22+s>d?Math.max(8,i-22-s):i+22,p=t.roomId===void 0?void 0:e.floor.rooms.find(u=>k(u.id,t.roomId)),h=this.chooserFocus;this.chooserFocus=!1;let m=this.friendly(e,t.entityId)??t.entityId;return c`<div class="hme-scrim hme-lamp-scrim" @pointerdown=${u=>{u.target===u.currentTarget&&this.cancelChooser(e)}}>
      <div class="hme-lampc" role="dialog" aria-label="Which lamp is it in?" style=${`left:${Math.round(l)}px;top:${Math.round(Math.max(8,r-64))}px;width:${s}px`}
        @keydown=${u=>{this.chooserKey(e,u)&&(u.preventDefault(),u.stopPropagation())}}>
        <div class="hme-lampc-t"><strong>${m}</strong>
          <span>${p===void 0?"In no room, so just a bulb.":`In ${T(p)}. Which lamp is it in?`}</span></div>
        <div class="hme-lampc-row" role="group" aria-label="Lamp">
          ${gt.map(u=>{let b=u===t.choice,f=this.canChoose(u),w=Gr[u];return c`<button type="button" class="hme-lampc-b ${b?"on":""}" aria-pressed=${b?"true":"false"} ?disabled=${!f}
              title=${f?Td[u]:"A lamp goes in a room"}
              ${nt(v=>{h&&b&&v!==void 0&&setTimeout(()=>v.focus?.(),0)})}
              @click=${()=>this.takeChoice(e,u)}>
              ${w===void 0||this.picture===void 0?c`<span class="hme-lampc-pic bulb"><svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">${ae("bulb","currentColor",24,1.8)}</svg></span>`:this.picture(e,w,"hme-lampc-pic")}
              <span>${Td[u]}</span></button>`})}
        </div>
        <p class="hme-lampc-hint">Enter takes the ringed one · Esc cancels</p>
      </div>
    </div>`}emptyThingAt(e,t,o,n=e.floor){let i=e.toScreen(t),r;for(let s of n.rooms)s.objects.forEach((d,l)=>{if(d.hidden===!0||(o?jn(d.model)===void 0:d.kind==="rug")||xt(n,s.id,l)!==void 0)return;let p=e.toScreen(d.c),h=Math.hypot(p[0]-i[0],p[1]-i[1]);h>mp&&!Z(ee(J(d)),t)||(r===void 0||h<r.d)&&(r={ref:{roomId:s.id,object:l},d:h})});return r?.ref}heldThingAt(e,t){let o=this.pinAt(e,e.toScreen(t));return o===void 0?void 0:ve(e.floor,o.id)}lampMark(e,t){let o=e.floor.rooms.find(l=>k(l.id,t.roomId))?.objects[t.object];if(o===void 0)return g;let n=ee(J(o)).map(l=>e.toScreen(l).map(E).join(",")).join(" "),[i,r]=e.toScreen(o.c),s=hn(o)?"Put it in this lamp":`Put it on this ${xe(o)}`,d=s.length*6.4+20;return x`<g class="hme-lamp-over" pointer-events="none">
      <circle cx=${E(i)} cy=${E(r)} r="22" fill="rgba(255,191,85,0.22)" stroke=${st} stroke-width="2" stroke-dasharray="4 3" />
      <polygon points=${n} fill="rgba(255,191,85,0.3)" stroke=${st} stroke-width="2" />
      <g class="hme-tag"><rect x=${E(i-d/2)} y=${E(r+28)} width=${E(d)} height="18" rx="9" fill=${st} />
        <text x=${E(i)} y=${E(r+41)} fill="#3a2600" text-anchor="middle">${s}</text></g>
    </g>`}dragOver(e,t,o){let n=[...o.dataTransfer?.types??[]],i=this.dragging!==void 0||n.includes(Gt),r=this.dragging!==void 0?be(this.dragging):n.includes(Vo),s=this.dropAt,d=this.lampOver;return this.dropAt=i?t:void 0,this.lampOver=i&&t!==void 0?this.emptyThingAt(e,t,r):void 0,(s!==this.dropAt||JSON.stringify(d)!==JSON.stringify(this.lampOver))&&e.redraw(),i&&t!==void 0}drop(e,t,o){let n=this.dragging??o.dataTransfer?.getData(Gt)??"";if(this.dragging=void 0,this.dropAt=void 0,this.lampOver=void 0,n===""){e.redraw();return}let i=be(n),r=this.emptyThingAt(e,t,i),s=V(e.floor,t);(r!==void 0?this.putOn(e,r,n):i?this.placeLight(e,n,t):this.place(e,n,t))&&(this.trayRoom=r?.roomId??s?.id)}putOn(e,t,o){let n=e.floor.id,i=be(o)?void 0:Je(e.doc,o),r={select:{kind:"object",...t}};if(i!==void 0)return k(i.floorId,n)?e.apply(l=>Wo(l,n,t.roomId,t.object,i.pinId),r):(e.note("warn","That device is on another floor's map. Remove it there first to put it here."),!1);let s=e.newId().toUpperCase(),d=e.apply(l=>Da(l,n,t.roomId,t.object,o,s),r);return d||e.note("warn","That device could not be put on it: the map holds at most 400 devices."),d}overlay(e){let t=this.states(e),o=this.picked(e),n=et(e.selection),i=[],r=this.lampOver===void 0?g:this.lampMark(e,this.lampOver);r!==g?i.push(r):this.dropAt!==void 0&&i.push(this.dropMark(e,this.dropAt));let s=o===void 0?void 0:Ee(o.entityId,t);o!==void 0&&s?.kind==="light"&&i.push(this.glowRing(e,o,s.on?s.brightness:void 0));let d=h=>n.some(m=>k(h.id,m)),l=wd(e.floor,{nameOf:h=>ie(h,e.hass),readingOf:h=>ls(h,t),picked:d,names:this.names}),p=yd(e.floor.pins.map(h=>({id:h.id,c:e.toScreen(h.at),r:d(h)?20:12,room:Q(e.floor,h)?.outline.map(m=>e.toScreen(m))})),l,e.roomNameBoxes?.()??[]);for(let h of e.floor.pins){let m=p.get(h.id),u=m===void 0?void 0:{text:l.get(h.id).text,at:m};i.push(this.pinMark(e,h,d(h),!1,t,u))}return this.box!==void 0&&i.push(this.boxMark(e,this.box)),x`${i}`}boxMark(e,t){let[o,n]=e.toScreen(t.a),[i,r]=e.toScreen(t.b);return x`<rect class="hme-box" x=${E(Math.min(o,i))} y=${E(Math.min(n,r))} width=${E(Math.abs(i-o))} height=${E(Math.abs(r-n))}
      fill="rgba(91,141,239,0.12)" stroke="#5b8def" stroke-width="1.2" stroke-dasharray="4 3" pointer-events="none" />`}pinMark(e,t,o,n,i,r){let[s,d]=e.toScreen(t.at),l=ps(t,i),p=t.icon??ye(t.entityId,this.deviceClass(e,t.entityId),this.friendly(e,t.entityId)),h=o?13:12,m=r===void 0?0:Fi(r.text),u=r===void 0?0:r.at[0]-s,b=r===void 0?0:r.at[1]-d;return x`<g class="hme-pin" data-hme="pin" data-pin=${t.id} transform=${`translate(${E(s)} ${E(d)})`} opacity=${n?.25:1} style="cursor:grab">
      ${o?x`<circle r="20" fill="none" stroke="#5b8def" stroke-width="2.5" />`:g}
      ${l.lit?x`<circle r=${h+7} fill=${l.fill} opacity="0.22" />`:g}
      <circle r=${h} fill=${l.fill} stroke=${l.ring} stroke-width="1.4" />
      <g transform="translate(-7 -7)">${ae(p,l.ink,14,1.5)}</g>
      ${r===void 0||r.text===""?g:x`<g pointer-events="none"><rect x=${E(u-m/2)} y=${E(b-cn/2)} width=${E(m)} height=${cn} rx="8" fill=${o?"#5b8def":"rgba(0,0,0,0.7)"} />
        <text x=${E(u)} y=${E(b+3.5)} fill="#fff" font-size="10" font-weight="600" text-anchor="middle">${r.text}</text></g>`}
    </g>`}glowRing(e,t,o){let[n,i]=e.toScreen(t.at),r=Xt(t,o),s=e.px(r),d=[n+s*Math.cos(gn),i+s*Math.sin(gn)],l=`Glow ${r.toFixed(1)} m`,p=l.length*6.2+18,h=t.glowSpill===!0?void 0:Q(e.floor,t),m=h!==void 0&&h.outline.length>=3?h.outline.map(b=>e.toScreen(b).map(E).join(",")).join(" "):void 0,u=b=>x`<circle cx=${E(n)} cy=${E(i)} r=${E(s)} fill="none" stroke=${Yt(t)??"#5b8def"} stroke-width="1.4"
      stroke-dasharray="5 5" opacity=${b} pointer-events="none" />`;return x`<g class="hme-glow-ring">
      ${m===void 0?u(1):x`<clipPath id="hme-glow-walls"><polygon points=${m} /></clipPath>
        ${u(.28)}<g clip-path="url(#hme-glow-walls)">${u(1)}</g>`}
      <circle data-hme="glow" cx=${E(d[0])} cy=${E(d[1])} r="7" fill="#fff" stroke="#5b8def" stroke-width="2" style="cursor:nwse-resize">
        <title>Drag to set how far this light's glow reaches</title></circle>
      <g class="hme-tag" pointer-events="none"><rect x=${E(d[0]-p/2)} y=${E(d[1]+12)} width=${E(p)} height="18" rx="9" fill="#5b8def" />
        <text x=${E(d[0])} y=${E(d[1]+25)} fill="#fff" text-anchor="middle">${l}</text></g>
    </g>`}dropMark(e,t){let o=V(e.floor,t),[n,i]=e.toScreen(t),r=o===void 0?"Drop here, in no room":`Drop in ${T(o)}`,s=r.length*6.4+20;return x`<g class="hme-drop" pointer-events="none">
      ${o===void 0?g:x`<polygon points=${o.outline.map(d=>e.toScreen(d).map(E).join(",")).join(" ")}
        fill="rgba(91,141,239,0.18)" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />`}
      <circle cx=${E(n)} cy=${E(i)} r="13" fill="rgba(91,141,239,0.35)" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 2" />
      <g class="hme-tag"><rect x=${E(n-s/2)} y=${E(i+20)} width=${E(s)} height="18" rx="9" fill="#5b8def" />
        <text x=${E(n)} y=${E(i+33)} fill="#fff" text-anchor="middle">${r}</text></g>
    </g>`}pinAt(e,t){return Mi(e.floor,e.toScreen,t)}pointerDown(e,t,o){return t.button!==0?!1:this.pressHandle(e,t,o)||this.pressPin(e,t,o)||this.pressBox(e,t,o)}pressHandle(e,t,o){let n=this.picked(e);if(n===void 0||t.shiftKey||t.metaKey||t.ctrlKey)return!1;let i=Ee(n.entityId,this.states(e));if(i.kind!=="light")return!1;let r=e.toScreen(o),[s,d]=e.toScreen(n.at),l=e.px(Xt(n,i.on?i.brightness:void 0));return Math.hypot(r[0]-(s+l*Math.cos(gn)),r[1]-(d+l*Math.sin(gn)))>10?!1:(this.glowDrag(e,t,n),!0)}onPin(e,t){return this.pinAt(e,e.toScreen(t))!==void 0}pressBox(e,t,o){return t.shiftKey?(this.boxDrag(e,t,o),!0):!1}pressPin(e,t,o){let n=t.shiftKey||t.metaKey||t.ctrlKey,i=this.pinAt(e,e.toScreen(o));if(i===void 0)return!1;if(this.pickPage=!1,this.iconsOpen=!1,n)return e.select(Ht(e.selection,i.id)),!0;let r=et(e.selection);return r.length>1&&r.some(s=>k(s,i.id))?(this.groupDrag(e,t,r,i.id,o),!0):(e.select({kind:"pin",pinId:i.id}),this.moveDrag(e,t,i,o),!0)}groupDrag(e,t,o,n,i){let r=[0,0],s=qo(o);e.drag(t,{move:d=>{this.moving=!0,r=[d[0]-i[0],d[1]-i[1]];let[l,p]=r;e.preview(h=>No(h,o,l,p))},end:(d,l,p)=>{this.moving=!1,e.preview(void 0);let[h,m]=r;p?Math.hypot(h,m)>=.005&&e.apply(u=>No(u,o,h,m),s===void 0?{}:{select:s}):e.select({kind:"pin",pinId:n})},cancel:()=>this.stopDrag(e)})}stopDrag(e){this.moving=!1,this.box=void 0,this.lampOver=void 0,e.preview(void 0)}boxDrag(e,t,o){let n=e.floor.pins,i=e.selection;e.drag(t,{move:r=>{this.box={a:o,b:r},e.redraw()},end:(r,s,d)=>{this.box=void 0,d?e.select(Qa(i,Ja(n,o,r))):e.redraw()},cancel:()=>this.stopDrag(e)})}async removePicks(e,t){t.length!==0&&(t.length>1&&!await e.confirm({title:`Remove ${O(t.length,"device")} from the map?`,text:"They come off the map, and Add can put them back. Undo puts them back where they were.",ok:"Remove",danger:!0})||e.apply(o=>Ta(o,t),{select:null}))}moveDrag(e,t,o,n){let i=o.id,r=e.floor,s=r.id,d=[o.at[0],o.at[1]],l=ve(r,i)===void 0,p=be(o.entityId),h=d;e.drag(t,{move:m=>{this.moving=!0,h=[d[0]+m[0]-n[0],d[1]+m[1]-n[1]];let u=l?this.emptyThingAt(e,h,p,r):void 0;this.lampOver=u,e.preview(u===void 0?b=>Zn(b,i,h):b=>Wo(b,s,u.roomId,u.object,i))},end:(m,u,b)=>{let f=this.lampOver;this.moving=!1,this.lampOver=void 0,e.preview(void 0),b&&f!==void 0?e.apply(w=>Wo(w,s,f.roomId,f.object,i),{select:{kind:"object",...f}}):b&&Math.hypot(h[0]-d[0],h[1]-d[1])>=.005&&e.apply(w=>Zn(w,i,h),{select:{kind:"pin",pinId:i}})},cancel:()=>this.stopDrag(e)})}glowDrag(e,t,o){let n=o.id,i;e.drag(t,{move:r=>{this.moving=!0;let s=Math.hypot(r[0]-o.at[0],r[1]-o.at[1]);i=Math.min(Math.max(Math.round(s/.05)*.05,At),Mr);let d=i;e.preview(l=>Ye(l,n,{glow:d}))},end:()=>{this.moving=!1,e.preview(void 0);let r=i;r!==void 0&&e.apply(s=>Ye(s,n,{glow:r}))},cancel:()=>this.stopDrag(e)})}keyDown(e,t){let o=this.picks(e).map(i=>i.id);if(o.length===0)return!1;let n=te(t,!1);if(n==="delete")return this.removePicks(e,o),!0;if(typeof n=="object"&&"nudge"in n){let[i,r]=n.nudge;return e.apply(s=>No(s,o,i,r)),!0}return!1}leave(){this.dragging=void 0,this.dropAt=void 0,this.box=void 0,this.moving=!1,this.iconsOpen=!1,this.pickPage=!1,this.chooser=void 0,this.lampOver=void 0,this.armed=void 0,this.trayRoom=void 0}viewItems(e){return[{label:"Side view",on:this.side,title:"The picked device's room from the side, to set its height",flip:()=>{this.side=!this.side,e.redraw()}},{label:"Names",on:this.names,title:"Each device's short name by its pin, where there is room",flip:()=>{this.names=!this.names,e.redraw()}}]}stageExtra(e){let t=this.picked(e);if(!this.side||t===void 0)return g;let o=Q(e.floor,t),n=o?.height??2.5,i=_e(o?.outline??e.floor.rooms.flatMap(y=>y.outline))??{minX:t.at[0]-1,maxX:t.at[0]+1,minY:0,maxY:0},r=18,s=118,d=(s-r)/Math.max(n,.5),l=30,p=262,h=(p-l)/Math.max(i.maxX-i.minX,.5),m=y=>l+(Math.min(Math.max(y,i.minX),i.maxX)-i.minX)*h,u=t.at[2],b=s-Math.min(Math.max(u,0),n)*d,f=m(t.at[0]),w=(()=>{let y=Ee(t.entityId,this.states(e));return y.kind==="light"&&y.on})(),v=[];for(let y=0;y<=n+1e-9;y+=1)v.push(y);let M=o===void 0?[]:Er(o),$=o===void 0?"No room":T(o);return c`<div class="hme-side">
      <div class="hme-h">${$} from the side</div>
      <svg viewBox="0 0 270 130" role="img" aria-label=${`Side view: ${ie(t,e.hass)} at ${u.toFixed(2)} m, the wall ${n.toFixed(1)} m tall`}
        @pointerdown=${y=>this.heightDrag(e,y,t,n,s,d)}>
        <path d=${`M${l} ${E(r)}H${p}M${l} ${s}H${p}`} stroke="#ece6da" stroke-width="3" />
        <path d=${`M${l} ${E(r)}V${s}M${p} ${E(r)}V${s}`} stroke="#ece6da" stroke-width="1.5" opacity="0.4" />
        <g font-size="9" fill="#8e8e93" text-anchor="end" class="mono">
          ${v.map(y=>x`<text x=${l-6} y=${E(s-y*d+3)}>${y===0?"0":`${y} m`}</text>
            <path d=${`M${l-4} ${E(s-y*d)}H${l}`} stroke="#8e8e93" />`)}
        </g>
        ${M.map(y=>{let P=m(y.c[0]-y.size[0]/2),F=m(y.c[0]+y.size[0]/2),I=Math.min(y.size[2],n)*d;return x`<rect x=${E(P)} y=${E(s-I)} width=${E(Math.max(F-P,2))} height=${E(I)} rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" />`})}
        <path d=${`M${E(f)} ${s}V${E(b)}`} stroke="#5b8def" stroke-width="1.2" stroke-dasharray="3 3" />
        ${w?x`<circle cx=${E(f)} cy=${E(b)} r="20" fill="#ffb648" opacity="0.22" />`:g}
        <circle cx=${E(f)} cy=${E(b)} r="9" fill=${w?st:"#3a3a3c"} stroke="#5b8def" stroke-width="2.5" style="cursor:ns-resize" />
        <g class="hme-tag"><rect x=${E(Math.min(f+14,222))} y=${E(b-8)} width="44" height="16" rx="8" fill="#5b8def" />
          <text x=${E(Math.min(f+14,222)+22)} y=${E(b+3.5)} fill="#fff" font-size="10" text-anchor="middle">${u.toFixed(2)} m</text></g>
      </svg>
      <span class="hme-side-hint">Drag the pin up or down here.</span>
    </div>`}heightDrag(e,t,o,n,i,r){if(t.button!==0)return;let s=t.currentTarget,d=o.id,l=u=>{let b=s.getBoundingClientRect(),f=(u.clientY-b.top)*130/Math.max(b.height,1);return Math.min(Math.max(Math.round((i-f)/r/.05)*.05,0),n)},p=l(t);try{s.setPointerCapture(t.pointerId)}catch{}this.moving=!0,e.preview(u=>ze(u,d,p));let h=u=>{p=l(u);let b=p;e.preview(f=>ze(f,d,b))},m=()=>{s.removeEventListener("pointermove",h),s.removeEventListener("pointerup",m),s.removeEventListener("pointercancel",m),this.moving=!1,e.preview(void 0);let u=p;Math.abs(u-o.at[2])>=.005&&e.apply(b=>ze(b,d,u))};s.addEventListener("pointermove",h),s.addEventListener("pointerup",m),s.addEventListener("pointercancel",m)}pill(e){let t=this.picks(e);if(t.length>1&&!this.moving)return this.groupPill(e,t);let o=this.picked(e);if(o===void 0||this.moving)return g;let n=o.id,i=o.entityId.startsWith("light."),r=Q(e.floor,o)!==void 0;return c`<span class="hme-pill-name">${ie(o,e.hass)}</span>
      ${ti(o.entityId)&&e.hass!==void 0?c`<button type="button" class="hme-tb" @click=${()=>this.toggle(e,o.entityId)}>${oi(o.entityId,e.hass.states)}</button>`:g}
      ${i?c`<button type="button" class="hme-tb" title="Every light on this floor at this light's height" @click=${()=>e.apply(s=>Ea(s,n))}>Same height for all lights</button>`:g}
      ${r?c`<button type="button" class="hme-tb" @click=${()=>e.apply(s=>Ca(s,n))}>Center in room</button>`:g}
      <button type="button" class="hme-tb danger" @click=${()=>e.apply(s=>Qn(s,n),{select:null})}>Remove</button>`}groupPill(e,t){let o=t.map(d=>d.id),n=t[0],i=n.at[2],r=t.every(d=>Math.abs(d.at[2]-i)<.005),s=e.hass===void 0?void 0:es(t.map(d=>d.entityId),e.hass.states);return c`<span class="hme-pill-name">${O(t.length,"device")}</span>
      ${s===void 0?g:c`<button type="button" class="hme-tb" @click=${()=>this.turn(e,t.map(d=>d.entityId),s.service)}>${s.words}</button>`}
      <button type="button" class="hme-tb" ?disabled=${r} title=${r?"They are all at one height":`Every picked device at ${ie(n,e.hass)}'s height, ${i.toFixed(2)} m`}
        @click=${()=>e.apply(d=>$t(d,o,i))}>Same height</button>
      <button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(e,o)}}>Remove</button>`}toggle(e,t){let o=e.hass;o!==void 0&&Dt(o,"homeassistant","toggle",{entity_id:t}).catch(n=>{e.note("err",`Could not turn it on or off: ${n instanceof Error?n.message:String(n)}`)})}turn(e,t,o){let n=e.hass;n!==void 0&&Dt(n,"homeassistant",o,{entity_id:[...t]}).catch(i=>{e.note("err",`Could not turn them ${o==="turn_on"?"on":"off"}: ${i instanceof Error?i.message:String(i)}`)})}inspector(e){let t=this.picks(e);if(t.length>1)return this.groupInspector(e,t);let o=this.picked(e);if(o===void 0)return g;let n=e.hass?.states,i=o.id,r=Ee(o.entityId,n),s=r.kind==="light"&&r.on,d=this.friendly(e,o.entityId),l=this.deviceClass(e,o.entityId),p=ye(o.entityId,l,d),h=o.icon??p,m=Q(e.floor,o),u=m?.height??2.5,b=v=>e.apply(M=>Ye(M,i,v,d)),w=Yt(o)??st;return c`
      <section class="hme-card hme-head">
        <span class="hme-pin-big ${s?"lit":""}" style=${s?`background:${w};box-shadow:0 0 24px ${w}80`:""}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${ae(h,s?"#3a2600":"#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${ie(o,e.hass)}</strong>
          <span class="mono">${o.entityId}</span>
        </div>
        <span class="hme-state ${s?"lit":""}">${fe(o.entityId,n)}</span>
      </section>

      ${A("On the map",c`
        ${B("Name",Tt({value:o.name??"",label:"Name on the map",placeholder:d??o.entityId,set:v=>b({name:v.trim()===""?null:v})}))}
        ${this.iconRows(e,o,b)}
        ${B("Room",c`<span class="hme-in hme-ro">${pp(e.floor,o)}</span>`)}
        ${Rd(o,w,b)}`)}

      ${this.areaCard(e,o.entityId,m?.areaId)}

      ${A("Height",c`
        <div class="hme-r">
          <input class="hme-range" type="range" min="0" max=${u} step="0.05" .value=${q(String(o.at[2]))} aria-label="Height" style=${Fe(o.at[2],0,u)}
            @input=${v=>{let M=Number(v.target.value);e.preview($=>ze($,i,M))}}
            @change=${v=>{let M=Number(v.target.value);e.apply($=>ze($,i,M))}} />
          ${z({label:"Height",value:o.at[2],unit:"m",min:0,max:100,width:"92px",set:v=>e.apply(M=>ze(M,i,v))})}
        </div>
        <div class="hme-chips">${ni.map(([v,M])=>c`<button type="button" class="hme-chip sel ${Math.abs(o.at[2]-M)<.005?"on":""}"
          @click=${()=>e.apply($=>ze($,i,M))}>${v} ${M}</button>`)}</div>
        <p class="hme-text dim">The model looks stand the pin at this height.</p>`)}

      ${o.entityId.startsWith("light.")?this.lightCard(e,o,r.kind==="light"&&r.on?r.brightness:void 0,b):g}

      ${this.tapCard(e,o,b)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>e.apply(v=>Qn(v,i),{select:null})}>Remove from the map</button></div>`}iconRows(e,t,o){let n=this.friendly(e,t.entityId),i=this.deviceClass(e,t.entityId),r=ye(t.entityId,i,n),s=t.icon??r;return c`${B("Icon",c`<button type="button" class="hme-in hme-icon-btn" aria-haspopup="true" aria-expanded=${this.iconsOpen?"true":"false"}
        @click=${()=>{this.iconsOpen=!this.iconsOpen,e.redraw()}}>
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">${ae(s,"currentColor",24,2)}</svg>
        <span class="hme-grow">${hp(t,i,n)}</span><span class="hme-caret" aria-hidden="true">▾</span></button>`)}
      ${this.iconsOpen?this.iconMenu(e,t,r,o):g}`}iconMenu(e,t,o,n){let i=s=>{this.iconsOpen=!1,n({icon:s}),e.redraw()},r=(s,d,l,p)=>c`<button type="button" class="hme-icon-cell ${l?"on":""}"
      title=${d} aria-label=${d} aria-pressed=${l?"true":"false"} @click=${()=>i(p)}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">${ae(s,"currentColor",24,1.9)}</svg><span>${d}</span></button>`;return c`<div class="hme-icons" role="group" aria-label="Icon">
      ${r(o,"Auto",t.icon===void 0,null)}
      ${yr.map(s=>r(s,Xo[s],t.icon===s,s))}
    </div>`}lightCard(e,t,o,n){return A("Light",this.glowRows(e,t,o,n))}glowRows(e,t,o,n){let i=t.id,r=Xt(t,o),s=Yt(t),d=(l,p,h)=>c`<button type="button" class="hme-chip sel ${p?"on":""}" aria-pressed=${p?"true":"false"} @click=${h}>${l}</button>`;return c`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        <input class="hme-range" type="range" min=${At} max=${Math.max(Bi,r)} step="0.05" .value=${q(String(r))} aria-label="Glow size"
          style=${Fe(r,At,Math.max(Bi,r))}
          @input=${l=>{let p=Number(l.target.value);e.preview(h=>Ye(h,i,{glow:p}))}}
          @change=${l=>n({glow:Number(l.target.value)})} />
        <span class="hme-val mono hme-w48">${r.toFixed(1)} m</span></div>
      <div class="hme-row-end indent">${d("By its brightness",t.glow===void 0,()=>n({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${d("Follow the light",t.glowColor===void 0,()=>n({glowColor:null}))}
        ${d("Warm",t.glowColor==="warm",()=>n({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${s!==void 0?"on":""}">${s===void 0?g:c`<span class="hme-swatch" style=${`background:${s}`}></span>`}Pick
          ${ao({value:s??"#ffb648",label:"Pick the glow's color",preview:l=>e.preview(l===void 0?void 0:p=>Ye(p,i,{glowColor:l})??p),set:l=>n({glowColor:l})})}</label>
      </div></div>
      ${Sd(t.glowSpill===!0?"off":"on",l=>n({glowSpill:l?null:!0}))}
      ${U("The pool of light round this light on the plan and the tiles. Warm is the lamplight every light has without a color of its own.")}`}thingCards(e,t,o){let n=e.floor.rooms.find(C=>k(C.id,t)),i=n?.objects[o];if(n===void 0||i===void 0)return g;let r=hn(i)||jn(i.model)!==void 0,s=r?"Light":"Device",d=xe(i),l=e.floor.id,p=xt(e.floor,n.id,o),h=C=>r?`Put ${C} in this lamp`:`Put ${C} on this ${d}`;if(p===void 0){let C=()=>e.openAdd("devices",{title:r?"Choose a light for this lamp":`Choose a device for this ${d}`,lightsOnly:r,rowTitle:h,pick:L=>{this.putOn(e,{roomId:n.id,object:o},L)||e.redraw()}});return A(s,c`
        ${B(s,c`<span class="hme-in hme-ro dim">None</span>`,c`<button type="button" class="hme-tb" aria-haspopup="dialog" title=${r?"Pick the light this lamp holds":`Pick the device this ${d} is or carries`}
            @click=${C}>Choose…</button>`)}
        ${U(r?"Pick the light this lamp holds, or drag its light's pin onto it on the plan.":`The device this ${d} is or carries, a TV's media player or a fan's switch: choose it, or drag its pin onto it on the plan.`)}`)}let m=e.hass?.states,u=p.id,b=be(p.entityId),f=Ee(p.entityId,m),w=f.kind==="light"&&f.on,v=this.friendly(e,p.entityId),M=C=>e.apply(L=>Ye(L,u,C,v)),$=p.icon??ye(p.entityId,this.deviceClass(e,p.entityId),v),y=Yt(p)??st,P=e.doc.floors.find(C=>k(C.id,l))?.rooms.find(C=>k(C.id,n.id)),F=()=>{let C=e.newId().toUpperCase(),L=P===void 0?null:{kind:"object",roomId:n.id,object:P.objects.length};e.apply(X=>Aa(X,l,n.id,o,C)?.doc,{select:L})||e.note("warn","Another lamp could not be added: the map holds at most 400 devices, and a room at most 256 things.")},I=()=>e.openAdd("devices",{title:r?"Change the light in this lamp":`Change the device on this ${d}`,lightsOnly:r,now:p.entityId,rowTitle:h,pick:C=>{if(!be(C)&&Je(e.doc,C)!==void 0){e.note("warn","That device is on the map already. Drag its pin onto this instead."),e.redraw();return}e.apply(L=>Oa(L,u,C))||e.redraw()}}),j=r?"lamp":d,S=b?"light":"device";return c`${A(s,c`
        <div class="hme-lamp-light">
          <span class="hme-pin-big ${w?"lit":""}" style=${w?`background:${y};box-shadow:0 0 24px ${y}80`:""}>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${ae($,w?"#3a2600":"#d1d1d6",24,2)}</svg></span>
          <div class="hme-head-t hme-grow">
            <strong>${ie(p,e.hass)}</strong>
            <span class="mono">${p.entityId}</span>
          </div>
          <span class="hme-state ${w?"lit":""}">${fe(p.entityId,m)}</span>
        </div>
        ${B("Name",Tt({value:p.name??"",label:"Name on the map",placeholder:v??p.entityId,set:C=>M({name:C.trim()===""?null:C})}))}
        ${B(s,c`<span class="hme-in hme-ro mono">${p.entityId}</span>`,c`<button type="button" class="hme-tb" aria-haspopup="dialog" title=${r?"Show another of the home's lights in this lamp":`Show another of the home's devices on this ${d}`}
            @click=${I}>Change…</button>`)}
        ${b?this.glowRows(e,p,w?f.brightness:void 0,M):g}
        ${this.iconRows(e,p,M)}
        ${Rd(p,y,M)}
        <div class="hme-row-end">
          ${ti(p.entityId)&&e.hass!==void 0?c`<button type="button" class="hme-tb" @click=${()=>this.toggle(e,p.entityId)}>${oi(p.entityId,m)}</button>`:g}
          ${b?c`<button type="button" class="hme-tb" title=${`Another of this ${j} beside it, holding the same light: a light group in many lamps`} @click=${F}>Add another</button>`:g}
          <button type="button" class="hme-tb push" title=${`The ${j} lets go of the ${S}; both stay where they are`} @click=${()=>e.apply(C=>Ra(C,l,n.id,o))}>Unlink</button>
        </div>
        <p class="hme-foot-hint">${r&&b?"The light sits in the lamp: move, lift or turn the lamp and the light goes with it.":`The ${S} sits on the ${j}: move, lift or turn the ${j} and the ${S} goes with it.`}</p>`)}
      ${this.tapCard(e,p,M)}`}groupInspector(e,t){let o=e.hass?.states,n=t.map(h=>h.id),i=h=>{e.apply(m=>Ko(m,n,h))||e.note("warn","That could not be set on every picked device.")},r=Math.max(2.5,...t.map(h=>Q(e.floor,h)?.height??2.5)),s=we(t.map(h=>h.at[2])),d=we(t.map(h=>h.reading)),l=t.every(h=>h.entityId.startsWith("light.")),p=st;return c`
      <section class="hme-card hme-head">
        <span class="hme-pin-big"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${ae("bulb","#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${O(t.length,"device")}</strong>
          <span>Shift, Cmd or Ctrl and a click adds or takes one away</span>
        </div>
      </section>

      ${A("Picked",c`${t.map(h=>c`<div class="hme-list-row hme-pick-row">
          <button type="button" class="hme-grow hme-link" title="Pick this one alone" @click=${()=>e.select({kind:"pin",pinId:h.id})}>${ie(h,e.hass)}</button>
          <span class="hme-val">${fe(h.entityId,o)}</span>
          <button type="button" class="hme-x" aria-label=${`Leave ${ie(h,e.hass)} out of the pick`} title="Leave it out of the pick"
            @click=${()=>e.select(Ht(e.selection,h.id))}>×</button></div>`)}`,String(t.length))}

      ${A("On the map",c`
        <div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
          ${le({label:"None",picture:It("none",p),on:!d.mixed&&d.value==="none",click:()=>i({reading:"none"})})}
          ${le({label:"Pill",picture:It("pill",p),on:!d.mixed&&d.value===void 0,title:"Each one's reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>i({reading:null})})}
          ${le({label:"Name",picture:It("name",p),on:!d.mixed&&d.value==="name",click:()=>i({reading:"name"})})}
        </div></div>
        ${d.mixed?U("Mixed: they show different things. Pick one to set them all.",!0):g}`)}

      ${A("Height",c`
        <div class="hme-r">
          ${Id({label:"Height",value:s.mixed?void 0:s.value,min:0,max:r,step:.05,preview:h=>e.preview(m=>$t(m,n,h)),set:h=>e.apply(m=>$t(m,n,h))})}
          ${z({label:"Height",value:s.mixed?void 0:s.value,unit:"m",min:0,max:100,width:"92px",set:h=>e.apply(m=>$t(m,n,h))})}
        </div>
        <div class="hme-chips">${ni.map(([h,m])=>c`<button type="button" class="hme-chip sel ${t.every(u=>Math.abs(u.at[2]-m)<.005)?"on":""}"
          @click=${()=>e.apply(u=>$t(u,n,m))}>${h} ${m}</button>`)}</div>
        <p class="hme-text dim">Every picked device at this height.</p>`)}

      ${l?this.groupLightCard(e,t,i):g}

      ${this.groupTapCard(e,t,i)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(e,n)}}>Remove ${O(t.length,"device")} from the map</button></div>`}groupLightCard(e,t,o){let n=t.map(b=>b.id),i=this.states(e),r=t.map(b=>{let f=Ee(b.entityId,i);return Math.round(Xt(b,f.kind==="light"&&f.on?f.brightness:void 0)*20)/20}),s=we(r),d=Math.max(Bi,...r),l=t.every(b=>b.glow===void 0),p=we(t.map(b=>b.glowColor?.toLowerCase())),h=we(t.map(b=>b.glowSpill===!0)),m=p.mixed||p.value===void 0||p.value==="warm"?void 0:p.value,u=(b,f,w)=>c`<button type="button" class="hme-chip sel ${f?"on":""}" aria-pressed=${f?"true":"false"} @click=${w}>${b}</button>`;return A("Light",c`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        ${Id({label:"Glow size",value:s.mixed?void 0:s.value,min:At,max:d,step:.05,preview:b=>e.preview(f=>Ko(f,n,{glow:b})),set:b=>o({glow:b})})}
        <span class="hme-val mono hme-w48">${s.mixed?"Mixed":`${s.value.toFixed(1)} m`}</span></div>
      <div class="hme-row-end indent">${u("By its brightness",l,()=>o({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${u("Follow the light",!p.mixed&&p.value===void 0,()=>o({glowColor:null}))}
        ${u("Warm",!p.mixed&&p.value==="warm",()=>o({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${m!==void 0?"on":""}">${m===void 0?g:c`<span class="hme-swatch" style=${`background:${m}`}></span>`}Pick
          ${ao({value:m??"#ffb648",label:"Pick the glow's color for every picked light",preview:b=>e.preview(b===void 0?void 0:f=>Ko(f,n,{glowColor:b})??f),set:b=>o({glowColor:b})})}</label>
      </div></div>
      ${p.mixed?U("Mixed: their colors differ. Pick one to set them all.",!0):g}
      ${Sd(h.mixed?"mixed":h.value?"off":"on",b=>o({glowSpill:b?null:!0}))}`)}groupTapCard(e,t,o){let n=we(t.map(l=>[l.tap,l.tap==="page"?l.pageId?.toLowerCase():void 0])),i=n.mixed?void 0:n.value,r=i?.[0]==="page"||this.pickPage,s=i?.[0]==="page"?t[0].pageId:void 0,d=l=>{if(l==="page"){e.pages.length===1?o({tap:"page",pageId:e.pages[0].id}):(this.pickPage=!0,e.redraw());return}this.pickPage=!1,o({tap:l??null})};return A("Tap on the map",c`
      <div class="hme-chips">${ii.map(([l,p])=>{let h=l==="page"?r:!this.pickPage&&i!==void 0&&i[0]===l;return c`<button type="button" class="hme-chip sel ${h?"on":""}" aria-pressed=${h?"true":"false"}
          ?disabled=${l==="page"&&e.pages.length===0} title=${l==="page"&&e.pages.length===0?"Your library has no pages":""}
          @click=${()=>d(l)}>${p}</button>`})}</div>
      ${r?B("Page",Me({label:"Page",value:s??"",options:[...s===void 0?[{value:"",label:"Pick a page\u2026",disabled:!0}]:[],...s===void 0||e.pages.some(l=>k(l.id,s))?[]:[{value:s,label:"A page not in your library",disabled:!0}],...e.pages.map(l=>({value:l.id,label:l.name}))],set:l=>{this.pickPage=!1,l!==""&&o({tap:"page",pageId:l})}})):g}
      <p class="hme-text dim">${n.mixed&&!this.pickPage?"Mixed: a tap does different things on them. Pick one to set them all.":"Set on every picked device."}</p>`)}tapCard(e,t,o){let n=t.tap==="page"||this.pickPage,i=t.pageId===void 0||e.pages.some(s=>k(s.id,t.pageId)),r=s=>{if(s==="page"){if(t.tap==="page")return;e.pages.length===1?o({tap:"page",pageId:e.pages[0].id}):(this.pickPage=!0,e.redraw());return}this.pickPage=!1,o({tap:s??null})};return A("Tap on the map",c`
      <div class="hme-chips">${ii.map(([s,d])=>{let l=s==="page"?n:!this.pickPage&&t.tap===s;return c`<button type="button" class="hme-chip sel ${l?"on":""}" aria-pressed=${l?"true":"false"}
          ?disabled=${s==="page"&&e.pages.length===0} title=${s==="page"&&e.pages.length===0?"Your library has no pages":""}
          @click=${()=>r(s)}>${d}</button>`})}</div>
      ${n?B("Page",Me({label:"Page",value:t.tap==="page"?t.pageId??"":"",options:[...t.tap==="page"?[]:[{value:"",label:"Pick a page\u2026",disabled:!0}],...i?[]:[{value:t.pageId,label:"A page not in your library",disabled:!0}],...e.pages.map(s=>({value:s.id,label:s.name}))],set:s=>{this.pickPage=!1,s!==""&&o({tap:"page",pageId:s})}})):g}
      <p class="hme-text dim">${t.tap===void 0&&!this.pickPage?"As the tile does: a light toggles, anything else opens its control.":ht("Hold on the watch or iPhone: its controls.","Hold on the watch or phone: its controls.")}</p>`)}};function Sd(a,e){let t=a==="on"?"walls stop the glow":a==="off"?"the glow spreads past the walls":"some stay in, some spread";return c`<div class="hme-r"><span class="hme-l">Stay in room</span>
    ${a==="mixed"?c`<button type="button" class="hme-chip off" aria-pressed="mixed" aria-label="Stay in room" @click=${()=>e(!0)}>Mixed</button>`:so({on:a==="on",onText:"On",offText:"Off",label:"Stay in room",click:()=>e(a!=="on")})}
    <span class="hme-text dim">${t}</span></div>`}function Id(a){let e=a.value??(a.min+a.max)/2;return c`<input class="hme-range ${a.value===void 0?"mixed":""}" type="range" min=${a.min} max=${a.max} step=${a.step} .value=${q(String(e))}
    aria-label=${a.label} aria-valuetext=${a.value===void 0?"Mixed":g} style=${a.value===void 0?"--p:0%":Fe(a.value,a.min,a.max)}
    @input=${t=>{let o=t.target;o.classList.remove("mixed"),a.preview(Number(o.value))}}
    @change=${t=>a.set(Number(t.target.value))} />`}function Rd(a,e,t){return c`<div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
    ${le({label:"None",picture:It("none",e),on:a.reading==="none",click:()=>t({reading:"none"})})}
    ${le({label:"Pill",picture:It("pill",e),on:a.reading===void 0,title:"Its reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>t({reading:null})})}
    ${le({label:"Name",picture:It("name",e),on:a.reading==="name",click:()=>t({reading:"name"})})}
  </div></div>`}function It(a,e){return c`<svg width="62" height="44" viewBox="0 0 62 44" aria-hidden="true">
    <circle cx="31" cy=${a==="none"?20:16} r="9" fill=${e} />
    ${a==="pill"?x`<rect x="17" y="29" width="28" height="11" rx="5.5" fill="rgba(0,0,0,0.7)" stroke="#3a3a3c" /><text x="31" y="37.5" font-size="8" fill="#fff" text-anchor="middle">21.5°</text>`:g}
    ${a==="name"?x`<text x="31" y="38" font-size="8" fill="#fff" text-anchor="middle">Name</text>`:g}
  </svg>`}var Fd=.05,cp=.03,_d=16;function Vi(a){let{hinge:e,shut:t,open:o}=a,n=Math.atan2(o[1]-e[1],o[0]-e[0]),i=Math.atan2(t[1]-e[1],t[0]-e[0])-n;i>Math.PI&&(i-=2*Math.PI),i<-Math.PI&&(i+=2*Math.PI);let r=Math.hypot(t[0]-e[0],t[1]-e[1]),s=[e];for(let d=0;d<=_d;d+=1){let l=n+i*d/_d;s.push([e[0]+Math.cos(l)*r,e[1]+Math.sin(l)*r])}return s}function up(a){let e=0;for(let t=0;t<a.length;t+=1){let o=a[t],n=a[(t+1)%a.length];e+=o[0]*n[1]-n[0]*o[1]}return e<0?[...a].reverse():a}function fp(a,e){let t=up(e),o=a;for(let n=0;n<t.length&&o.length>0;n+=1){let i=t[n],r=t[(n+1)%t.length];Math.hypot(r[0]-i[0],r[1]-i[1])<1e-9||(o=Ur(o,i,r,1))}return o}function gp(a){if(a.length<3)return 0;let e=1/0;for(let t=0;t<a.length;t+=1){let o=a[t],n=a[(t+1)%a.length],i=Math.hypot(n[0]-o[0],n[1]-o[1]);if(i<1e-6)continue;let r=0;for(let s of a)r=Math.max(r,Math.abs((s[0]-o[0])*(n[1]-o[1])-(s[1]-o[1])*(n[0]-o[0]))/i);e=Math.min(e,r)}return e===1/0?0:e}function zd(a,e){return gp(fp(a,e))}function bp(a,e){if(a.hidden===!0||a.kind==="rug")return!1;let t=a.lift??0;return t>=e?!1:t+a.size[2]>cp}var Gi=a=>`${a.roomId.toUpperCase()}:${a.index}`,jd=new WeakMap;function vn(a){let e=jd.get(a);if(e!==void 0)return e;let t=re(a),o=[],n=new Map;for(let m of a.rooms)m.openings.forEach((u,b)=>{if(u.kind!=="door")return;let f={roomId:m.id,index:b};n.set(Gi(f),u.z1);for(let w of _t(u,m))o.push({door:f,polygon:Vi(w)})});let i=(m,u)=>k(m.roomId,u.roomId)&&m.index===u.index,r=(m,u)=>{let b=ue(t,m.roomId,m.index),f=ue(t,u.roomId,u.index);return b!==void 0&&i(b,u)||f!==void 0&&i(f,m)},s=a.rooms.flatMap(m=>m.objects.map((u,b)=>({roomId:m.id,index:b,object:u,polygon:ee(J(u))}))),d=new Map,l=(m,u,b)=>{let f=Gi(m),w=d.get(f);w===void 0&&(w={door:m,hits:[]},d.set(f,w));let v=w.hits.find(b);v===void 0?w.hits.push(u):v.depth=Math.max(v.depth,u.depth)};for(let[m,u]of o.entries()){for(let f of o.slice(m+1)){if(i(u.door,f.door)||r(u.door,f.door))continue;let w=zd(u.polygon,f.polygon);w<=Fd||(l(u.door,{kind:"door",door:f.door,depth:w},v=>v.kind==="door"&&i(v.door,f.door)),l(f.door,{kind:"door",door:u.door,depth:w},v=>v.kind==="door"&&i(v.door,u.door)))}let b=n.get(Gi(u.door))??1/0;for(let f of s){if(!bp(f.object,b))continue;let w=zd(u.polygon,f.polygon);w<=Fd||l(u.door,{kind:"object",roomId:f.roomId,object:f.index,depth:w},v=>v.kind==="object"&&k(v.roomId,f.roomId)&&v.object===f.index)}}let p=m=>a.rooms.findIndex(u=>k(u.id,m.roomId))*1e3+m.index,h=[...d.values()].sort((m,u)=>p(m.door)-p(u.door));return jd.set(a,h),h}function mo(a,e,t){return vn(a).find(o=>k(o.door.roomId,e)&&o.door.index===t)}function vp(a,e,t){let o=i=>{let r=a.rooms.find(s=>k(s.id,i));return r===void 0?void 0:T(r)},n=ue(re(a),e.roomId,e.index);if(n!==void 0&&!k(n.roomId,t.roomId)){let i=o(n.roomId);if(i!==void 0)return`the door to ${i}`}if(!k(e.roomId,t.roomId)){let i=o(e.roomId);if(i!==void 0)return`the door of ${i}`}return"another door"}function qi(a,e,t){if(t.kind==="door")return`Swings into ${vp(a,t.door,e)}`;let o=a.rooms.find(i=>k(i.id,t.roomId))?.objects[t.object];return`Swings into the ${o===void 0?"something":(ot(o.model)?.name??rt(o.kind)).toLowerCase()}`}function Nd(a){return vn(a).length}function Xi(a,e,t){let o=!1,n=a.floors.map(i=>{let r=i.rooms.findIndex(h=>k(h.id,e)),s=i.rooms[r],d=s?.openings[t];if(s===void 0||d===void 0||d.kind!=="door")return i;o=!0;let l=s.openings.slice();l[t]={...d,a:d.b,b:d.a};let p=i.rooms.slice();return p[r]={...s,openings:l},{...i,rooms:p}});return o?Tr({...a,floors:n}):void 0}function Kd(a,e,t,o){let n=a.floors.find(d=>k(d.id,e))?.rooms.find(d=>k(d.id,t)),i=n?.openings[o];if(n===void 0||i===void 0||_t(i,n).length!==1)return!1;let s=Xi(a,t,o)?.floors.find(d=>k(d.id,e));return s!==void 0&&mo(s,t,o)===void 0}var ne=a=>a.toFixed(1),wp=18,Bd="#E8A33D";function Ud(a){return vn(a.floor).flatMap(e=>{let t=a.floor.rooms.find(n=>k(n.id,e.door.roomId)),o=t?.openings[e.door.index];return t===void 0||o===void 0?[]:_t(o,t).map(n=>{let i=Vi(n).map((r,s)=>{let[d,l]=a.toScreen(r);return`${s===0?"M":"L"}${ne(d)} ${ne(l)}`}).join("");return x`<path class="hme-swing-clash" d=${`${i}Z`} fill=${Bd} fill-opacity="0.12"
        stroke=${Bd} stroke-width="2" stroke-dasharray="6 5" stroke-linejoin="round" pointer-events="none" />`})})}function Yi(a){return a.doc.floors.find(e=>k(e.id,a.floor.id))??a.floor}function Gd(a){return a.length<2?a.join(""):`${a.slice(0,-1).join(", ")} and ${a[a.length-1]}`}function yp(a,e){return Math.abs(e)>=Math.abs(a)?e>0?"down":"up":a>0?"right":"left"}function Mp(a,e){let t=a.moves.flatMap(s=>{let d=e.rooms.find(l=>k(l.id,s.roomId));return d===void 0?[]:[T(d)]}),o=a.moves[0],n=o===void 0?0:Math.hypot(o.dx,o.dy),i=o===void 0?"":yp(o.dx,o.dy),r=a.after===a.doors?`all ${a.doors} doors meet`:`${a.after} of ${a.doors} doors meet`;return`Move ${Gd(t)} ${oe(n)} ${i}: ${r}.`}function kp(a,e){let t=r=>Gd(r.flatMap(s=>{let d=e.rooms.find(l=>k(l.id,s));return d===void 0?[]:[T(d)]})),o=a.pairs===1?"The door":`${a.pairs} doors`,n=a.pairs===1?`of ${t(a.move)} moves`:`of ${t(a.move)} move`,i=a.narrow?" A door gets narrower, as the rooms share little wall.":"";return`${o} ${n} to meet ${t(a.keep)}. The rooms stay.${i}`}function Wd(a){let e=Ua(a).map(o=>({words:kp(o,a),button:o.pairs===1?"Move the door":"Move the doors",op:n=>Wa(n,o.spots)})),t=Na(a);return t!==void 0&&e.push({words:Mp(t,a),button:t.moves.length===1?"Move the room":"Move the rooms",op:o=>Ba(o,t.moves)}),e}var wn=class{constructor(){this.offer=0;this.showing=!1}get active(){return this.connecting!==void 0}endShow(e){this.showing&&e.preview(void 0),this.showing=!1}stop(e){this.endShow(e),this.connecting=void 0}choices(e){if(this.connecting===void 0)return[];let t=re(e.floor),o=t.doors.find(n=>k(n.roomId,this.connecting.roomId)&&n.index===this.connecting.opening);return o===void 0?[]:On(t,o)}clicked(e,t,o){let n=re(e.floor),i=n.doors.find(r=>k(r.roomId,t)&&r.index===o);i===void 0||ue(n,t,o)!==void 0||On(n,i).length>0&&this.start(e,t,o)}start(e,t,o){this.connecting={roomId:t,opening:o},e.select({kind:"opening",roomId:t,opening:o}),e.redraw()}connect(e,t,o){let n=this.connecting;return n===void 0?!1:(this.connecting=void 0,e.apply(i=>Ga(i,n.roomId,n.opening,t,o),{select:{kind:"room",roomId:n.roomId}})||e.note("err","Those two doors cannot be connected."),!0)}pickDoor(e,t,o){return this.connecting===void 0?!1:this.choices(e).some(n=>k(n.roomId,t)&&n.index===o)?this.connect(e,t,o):(this.connecting=void 0,!1)}pointerDown(e,t){let o=e.toScreen(t),n;for(let i of this.choices(e)){let r=e.toScreen(i.mid),s=Math.hypot(r[0]-o[0],r[1]-o[1]);s<=wp&&(n===void 0||s<n.d)&&(n={door:i,d:s})}return n!==void 0?this.connect(e,n.door.roomId,n.door.index):(this.connecting=void 0,!1)}keyDown(e,t){return this.connecting===void 0||te(t,!1)!=="cancel"?!1:(this.connecting=void 0,e.redraw(),!0)}pill(e){let t=this.connecting;if(t===void 0)return g;let o=e.floor.rooms.find(n=>k(n.id,t.roomId));return c`<span class="hme-pill-name">Click the door that ${o===void 0?"it":T(o)} should meet</span>
      <button type="button" class="hme-tb" @click=${()=>{this.connecting=void 0,e.redraw()}}>Cancel</button>`}overlay(e){let t=re(e.floor);if(t.doors.length===0||e.floor.rooms.length<2)return g;let o=this.choices(e),n=[],i=new Set;for(let s of t.doors){let[d,l]=e.toScreen(s.mid),p=ue(t,s.roomId,s.index);o.includes(s)||(p===void 0?this.connecting!==void 0&&k(s.roomId,this.connecting.roomId)&&s.index===this.connecting.opening||n.push(x`<circle class="hme-door-open" cx=${ne(d)} cy=${ne(l)} r="6" fill="#ffb340" stroke="#2a1a00" stroke-width="1"><title>No partner yet. Click to connect it.</title></circle>`):i.has(p)||(i.add(s),n.push(x`<circle class="hme-door-met" cx=${ne(d)} cy=${ne(l)} r="4" fill="#30d158" />`)))}let r=o.map(s=>{let[d,l]=e.toScreen(s.mid),p=e.floor.rooms.find(u=>k(u.id,s.roomId)),h=p===void 0?"":T(p),m=h.length*6.4+16;return x`<g class="hme-door-choice"><circle cx=${ne(d)} cy=${ne(l)} r="9" fill="#5b8def" stroke="#fff" stroke-width="2" />
        <g class="hme-tag"><rect x=${ne(d-m/2)} y=${ne(l-34)} width=${ne(m)} height="20" rx="10" fill="#5b8def" />
        <text x=${ne(d)} y=${ne(l-20)} fill="#fff" text-anchor="middle">${h}</text></g></g>`});return x`<g class="hme-doors" pointer-events="none">${n}${r}</g>`}allMet(e){let t=Yi(e);if(t.rooms.length<2)return;let o=re(t),n=o.doors.length;if(!(n===0||An(o).length>0||Ut(t).length>0||Wd(t).length>0))return n}fitFoot(e){let t=this.allMet(e);if(t===void 0)return g;let o=Nd(Yi(e)),n=o===0?"":` ${O(o,"door")} ${o===1?"swings":"swing"} into something.`;return c`<p class="hme-fit-foot" role="status">All ${t} doors meet.${n}</p>`}fitCard(e){let t=Yi(e);if(t.rooms.length<2||this.allMet(e)!==void 0)return g;let o=re(t),n=Ut(t),i=o.doors.length;if(i===0&&n.length===0)return g;let r=Wd(t),s=r.length===0?void 0:r[this.offer%r.length],d=An(o).length,l=()=>{s!==void 0&&(this.showing=!this.showing,e.preview(this.showing?s.op:void 0),e.redraw())},p=()=>{s!==void 0&&(this.showing=!1,this.offer=0,e.preview(void 0),e.apply(s.op,{select:null}))},h=()=>{this.offer=(this.offer+1)%r.length;let b=r[this.offer];this.showing&&b!==void 0&&e.preview(b.op),e.redraw()},m=s!==void 0||d>0?"hot":n.length>0?"":"good",u=t.id;return c`<section class="hme-card hme-fit ${m}">
      <div class="hme-h">Fit rooms${i===0?g:c`<span class="hme-h-end">${o.met} of ${O(i,"door")}</span>`}</div>
      ${i===0?g:c`<div class="hme-fit-bar" role="img" aria-label=${`${o.met} of ${O(i,"door")} meet`}>
        <i class=${d===0?"full":""} style=${`width:${o.met/i*100}%`}></i></div>`}
      ${s!==void 0?c`<p class="hme-text">${s.words}</p>
        <div class="hme-fit-acts">
          <button type="button" class="hme-tb" aria-pressed=${this.showing?"true":"false"} @click=${l}>${this.showing?"Hide":"Show me"}</button>
          <button type="button" class="hme-tb hme-blue" @click=${p}>${s.button}</button>
        </div>
        ${r.length<2?g:c`<button type="button" class="hme-tb hme-wide hme-fit-other" @click=${h}>Another way (${this.offer%r.length+1} of ${r.length})</button>`}`:d>0?c`<p class="hme-text">Amber doors have no partner. Click one, then the door it should meet.</p>`:i>0?c`<p class="hme-text dim">All doors meet.</p>`:g}
      ${n.map(b=>c`<div class="hme-fix">
        <span class="hme-fix-dot ${b.kind==="missingDoor"?"gray":""}"></span>
        <p @click=${()=>e.select({kind:"room",roomId:b.roomIds[0]})}><b>${b.title}</b> ${b.detail}</p>
        <button type="button" class="hme-tb" @click=${()=>e.apply(f=>b.fix(f))}>${b.fixLabel}</button></div>`)}
      ${n.length>1?c`<button type="button" class="hme-tb hme-wide" @click=${()=>e.apply(b=>Va(b,u))}>Fix all ${n.length}</button>`:g}
    </section>`}doorsCard(e,t){let o=re(e.floor),n=o.doors.filter(r=>k(r.roomId,t.id));if(n.length===0)return g;let i=n.filter(r=>ue(o,r.roomId,r.index)!==void 0).length;return c`<section class="hme-card hme-doors-card">
      <div class="hme-h">Doors<span class="hme-h-end">${i} of ${n.length} meet</span></div>
      ${n.map(r=>{let s=ue(o,r.roomId,r.index),d=s===void 0?void 0:e.floor.rooms.find(h=>k(h.id,s.roomId));return c`<div class="hme-door-row" @pointerenter=${()=>e.setHover({kind:"opening",roomId:r.roomId,opening:r.index})} @pointerleave=${()=>e.setHover(void 0)}>
          <span class="hme-fix-dot ${d===void 0?"":"green"}"></span>
          <button type="button" class="hme-door-name" @click=${()=>e.select({kind:"opening",roomId:r.roomId,opening:r.index})}>${d===void 0?"No partner":`To ${T(d)}`}</button>
          <span class="mono dim">${oe(r.width)}</span>
          ${s===void 0?c`<button type="button" class="hme-tb" title="Click the door it should meet, on the plan or in 3D" @click=${()=>this.start(e,r.roomId,r.index)}>Connect</button>`:g}
        </div>${this.swingLines(e,r.roomId,r.index).map(h=>c`<p class="hme-text dim">${h}</p>`)}`})}
    </section>`}opensToCard(e,t,o){let n=re(e.floor);if(n.doors.find(l=>k(l.roomId,t.id)&&l.index===o)===void 0)return g;let r=ue(n,t.id,o),s=r===void 0?void 0:e.floor.rooms.find(l=>k(l.id,r.roomId));if(s!==void 0)return c`<section class="hme-card hme-fit good"><div class="hme-h">Opens to</div>
        <p class="hme-text">${T(s)}. One door, cutting both walls.</p></section>${this.swingCard(e,t,o)}`;let d=this.connecting!==void 0&&k(this.connecting.roomId,t.id)&&this.connecting.opening===o;return c`<section class="hme-card hme-fit hot"><div class="hme-h">Opens to</div>
      ${d?c`<p class="hme-text">Click the blue door it should meet. On one wall this door moves there and the room stays. Else <b>${T(t)}</b> moves.</p>
        <button type="button" class="hme-tb hme-wide" @click=${()=>{this.connecting=void 0,e.redraw()}}>Cancel</button>`:c`<button type="button" class="hme-tb hme-blue hme-wide" @click=${()=>this.start(e,t.id,o)}>Connect to a door</button>`}
    </section>${this.swingCard(e,t,o)}`}swingLines(e,t,o){let n=e.floor,i=mo(n,t,o),r=i===void 0?[]:i.hits.map(l=>qi(n,i.door,l)),s=ue(re(n),t,o),d=s===void 0?void 0:mo(n,s.roomId,s.index);if(d!==void 0){let l=n.rooms.find(h=>k(h.id,d.door.roomId)),p=l===void 0?"In the next room":`In ${T(l)}`;for(let h of d.hits){let m=qi(n,d.door,h);r.push(`${p}, ${m.charAt(0).toLowerCase()}${m.slice(1)}`)}}return r}swingCard(e,t,o){let n=this.swingLines(e,t.id,o);if(n.length===0)return g;let r=mo(e.floor,t.id,o)!==void 0&&Kd(e.doc,e.floor.id,t.id,o);return c`<section class="hme-card hme-fit hot"><div class="hme-h">Swing</div>
      ${n.map(s=>c`<p class="hme-text">${s}.</p>`)}
      ${r?c`<button type="button" class="hme-tb hme-wide" title="Hang the door from its other side"
        @click=${()=>e.apply(s=>Xi(s,t.id,o))}>Swing the other way</button>`:g}
    </section>`}};function Jd(a){return Hp[a]}var $p=[{label:"Door",kind:"door"},{label:"Double door",kind:"door",style:"double"},{label:"Sliding door",kind:"door",style:"sliding"},{label:"Window",kind:"window"},{label:"Sliding window",kind:"window",style:"sliding"},{label:"Way through",kind:"opening"}],Vd=18,Zi="#4fd6c2",qd="Draw each room faint and dashed as the iPhone scanned it, or as first seen for a room scanned before scans were kept. A room drawn here has none.",xp="Put this room's walls, doors, windows and furniture back as the iPhone scanned it. Its devices stay where they are.",H=a=>a.toFixed(1),dt=a=>`${a[0].toFixed(1)},${a[1].toFixed(1)}`,Xd=new WeakMap;function Yd(a){let e=Xd.get(a);return e===void 0&&Xd.set(a,e=Ut(a)),e}function Zd(a,e,t,o){let n=t/a.view.scale,i=s=>{let d;for(let l of s)for(let[p,h]of W(l).entries()){let m=Nr(e,h);m<=n&&(d===void 0||m<d.d)&&(d={room:l,wall:p,seg:h,d:m})}return d};return(o===void 0?void 0:i([o]))??i(a.floor.rooms)}function Qd(a,e){let t=Math.max(Ce(e),1e-9),o=[-(e.b[1]-e.a[1])/t,(e.b[0]-e.a[0])/t],n=[(e.a[0]+e.b[0])/2,(e.a[1]+e.b[1])/2],i=Y(a)??ce(a);return(i[0]-n[0])*o[0]+(i[1]-n[1])*o[1]>0&&(o=[-o[0],-o[1]]),o}var yn=class{constructor(){this.tool="select";this.dragging=!1}setTool(e,t){this.first=void 0,this.tool=t,e.redraw()}get armed(){return this.tool!=="select"}focus(e){let t=de(e.selection);return t===void 0?void 0:e.floor.rooms.find(o=>k(o.id,t))}pieceRoom(e){return se(e.selection)?this.focus(e):void 0}placed(e,t){this.setTool(e,"select"),e.select(t)}pickedWall(e,t){let o=e.selection;if(!(t===void 0||o===void 0)){if(o.kind==="wall")return o.wall;if(o.kind==="opening"){let n=t.openings[o.opening],i=n===void 0?-1:Mt(t,n);return i>=0?i:void 0}}}roomCards(e,t){return c`${this.wallsCard(e,t)}${sn(e,t)}${this.scanCard(e,t)}`}wallsCard(e,t){let o=W(t),n=e.selection,i=t.id,r=Rs(t),s=t.openings.map((l,p)=>({o:l,i:p})).filter(({o:l})=>Mt(t,l)<0),d=({o:l,i:p})=>{let h=n?.kind==="opening"&&n.opening===p;return c`<button type="button" class="hme-lay sub ${h?"on":""}" aria-pressed=${h?"true":"false"}
        @pointerenter=${()=>e.setHover({kind:"opening",roomId:i,opening:p})} @pointerleave=${()=>e.setHover(void 0)}
        @click=${()=>e.select({kind:"opening",roomId:i,opening:p})}>${no(l)}<span class="n">${oe(Math.hypot(l.b[0]-l.a[0],l.b[1]-l.a[1]))}</span></button>`};return c`<section class="hme-card hme-layers">
      <div class="hme-h">${T(t)}<span class="hme-h-end">${O(o.length,"wall")}</span></div>
      ${o.map((l,p)=>{let h=n?.kind==="wall"&&n.wall===p;return c`<button type="button" class="hme-lay ${h?"on":""}" aria-pressed=${h?"true":"false"}
            @pointerenter=${()=>e.setHover({kind:"wall",roomId:i,wall:p})} @pointerleave=${()=>e.setHover(void 0)}
            @click=${()=>e.select({kind:"wall",roomId:i,wall:p})}>${r[p]}<span class="n">${oe(Ce(l))}</span></button>
          ${t.openings.map((m,u)=>({o:m,i:u})).filter(({o:m})=>Mt(t,m)===p).map(d)}`})}
      ${s.length===0?g:c`<div class="hme-lay dim">In no wall</div>${s.map(d)}`}
    </section>`}scanCard(e,t){if(e.scans===void 0)return g;let o=t.id,n=Hr(e.scans,o),i=n!==void 0&&$a(t,n)?n:void 0;return A("Show scan as it was",c`<div class="hme-row-end">
      <button type="button" class="hme-tb ${e.toggles.scan?"on":""}" aria-pressed=${e.toggles.scan?"true":"false"} title=${qd}
        @click=${()=>e.setToggle("scan",!e.toggles.scan)}>${e.toggles.scan?"On":"Off"}</button>
      <button type="button" class="hme-tb" ?disabled=${i===void 0} title=${i===void 0?"This room is as the iPhone scanned it, or was drawn here":xp}
        @click=${()=>{i!==void 0&&e.apply(r=>xa(r,o,i))}}>Back to the scan</button>
    </div>`)}overlay(e){let t=this.pieceRoom(e),o=[];return e.toggles.scan&&o.push(...this.scanMarks(e)),o.push(...this.issueMarks(e)),t!==void 0&&o.push(this.roomHandles(e,t)),o.push(...this.ghost(e)),x`${o}`}scanMarks(e){return Ha(e.floor,e.scans).map(t=>{let o=t.outline.map(i=>dt(e.toScreen(i))).join("L"),n=t.walls.map(i=>`M${dt(e.toScreen(i.a))}L${dt(e.toScreen(i.b))}`).join("");return x`<g class="hme-scan" data-room=${t.roomId} pointer-events="none">
        <path d=${`M${o}Z`} fill=${Zi} fill-opacity="0.06" stroke="none" />
        <path d=${n} fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="3.5" stroke-dasharray="7 5" />
        <path d=${n} fill="none" stroke=${Zi} stroke-width="1.6" stroke-dasharray="7 5" stroke-opacity="0.9" />
        ${t.openings.map(i=>{let r=e.toScreen(i.a),s=e.toScreen(i.b);return x`<line x1=${H(r[0])} y1=${H(r[1])} x2=${H(s[0])} y2=${H(s[1])} stroke=${Zi} stroke-width="4" stroke-opacity="0.85"
            stroke-dasharray=${i.kind==="window"?"2 3":"none"} />`})}
      </g>`})}issueMarks(e){return e.doc.floors.includes(e.floor)?Yd(e.floor).map(t=>{let[o,n]=e.toScreen(t.where);if(t.kind==="offSquare"){let l=/(\d+)°/.exec(t.title)?.[1]??"";return x`<g class="hme-issue" data-hme=${`issue:${t.id}`} style="cursor:pointer"><title>${t.title} Click to square it.</title>
          <circle cx=${H(o)} cy=${H(n)} r="9" fill="#ffb340" stroke="#fff" stroke-width="2" />
          <g class="hme-tag"><rect x=${H(o+12)} y=${H(n+6)} width="44" height="20" rx="10" fill="#ffb340" />
          <text x=${H(o+34)} y=${H(n+20)} fill="#2a1a00" text-anchor="middle">${l}°</text></g></g>`}let i=`${Math.round(t.amount*100)} cm`,r=t.kind==="overlap"?`Overlap ${i} \xB7 ${t.fixLabel}`:t.kind==="gap"?`Gap ${i} \xB7 ${t.fixLabel}`:`No door \xB7 ${t.fixLabel}`,s=r.length*6.2+18,d=t.kind==="missingDoor";return x`<g class="hme-issue" data-hme=${`issue:${t.id}`} style="cursor:pointer"><title>${t.title} ${t.detail}</title>
        <circle cx=${H(o)} cy=${H(n)} r="4" fill=${d?"#8e8e93":"#ffb340"} />
        <g class="hme-tag"><rect x=${H(o-s/2)} y=${H(n+8)} width=${H(s)} height="20" rx="10" fill=${d?"#8e8e93":"#ffb340"} />
        <text x=${H(o)} y=${H(n+22)} fill=${d?"#fff":"#2a1a00"} text-anchor="middle">${r}</text></g></g>`}):[]}roomHandles(e,t){let o=W(t),n=e.selection,i=this.pickedWall(e,t),r=[];if(i!==void 0&&o[i]!==void 0){let d=o[i],l=e.toScreen(d.a),p=e.toScreen(d.b),h=Qd(t,d);if(r.push(x`<line x1=${H(l[0])} y1=${H(l[1])} x2=${H(p[0])} y2=${H(p[1])} stroke="#5b8def" stroke-width="9" stroke-linecap="round" pointer-events="none" />`),n?.kind==="wall"&&!this.dragging){let m=[(l[0]+p[0])/2+h[0]*22,(l[1]+p[1])/2+h[1]*22];r.push(x`<g class="hme-tag" pointer-events="none"><rect x=${H(m[0]-27)} y=${H(m[1]-9)} width="54" height="18" rx="9" fill="#5b8def" />
          <text x=${H(m[0])} y=${H(m[1]+4)} fill="#fff" text-anchor="middle">${Ce(d).toFixed(2)} m</text></g>`)}}for(let[d,l]of t.openings.entries()){let p=e.toScreen(l.a),h=e.toScreen(l.b),m=n?.kind==="opening"&&n.opening===d,u=l.kind==="window"?"#8bb8f0":l.kind==="door"?"#ece6da":"#98989d";if(r.push(x`<g data-hme=${`opening:${d}`} style="cursor:ew-resize">
        <line x1=${H(p[0])} y1=${H(p[1])} x2=${H(h[0])} y2=${H(h[1])} stroke=${m?"#5b8def":"rgba(14,14,16,0.9)"} stroke-width="12" stroke-linecap="round" />
        <line x1=${H(p[0])} y1=${H(p[1])} x2=${H(h[0])} y2=${H(h[1])} stroke=${u} stroke-width="3" />
      </g>`),m){let b=Math.abs(h[0]-p[0])>=Math.abs(h[1]-p[1])?"ew-resize":"ns-resize";for(let[f,w]of[[0,p],[1,h]])r.push(x`<circle data-hme=${`end:${d}:${f}`} cx=${H(w[0])} cy=${H(w[1])} r="8" fill="#fff" stroke="#5b8def" stroke-width="2.5" style=${`cursor:${b}`}><title>Drag to make it wider or narrower</title></circle>`)}}let s=this.sliding!==void 0&&k(this.sliding.roomId,t.id)?this.sliding.index:n?.kind==="opening"?n.opening:void 0;if(s!==void 0&&t.openings[s]!==void 0&&r.push(this.distances(e,t,t.openings[s])),!this.dragging||this.sliding===void 0){if(this.tool==="select")for(let[d,l]of o.entries()){if(Ce(l)*e.view.scale<40)continue;let p=e.toScreen([(l.a[0]+l.b[0])/2,(l.a[1]+l.b[1])/2]);r.push(x`<circle data-hme=${`mid:${d}`} cx=${H(p[0])} cy=${H(p[1])} r="5" fill="#0e0e10" stroke="#5b8def" stroke-width="1.5" style="cursor:copy"><title>Drag to add a corner</title></circle>`)}for(let[d,l]of t.outline.entries()){let[p,h]=e.toScreen(l),m=n?.kind==="corner"&&n.corner===d;r.push(x`<circle data-hme=${`corner:${d}`} cx=${H(p)} cy=${H(h)} r="7" fill=${m?"#5b8def":"#fff"} stroke=${m?"#fff":"#5b8def"} stroke-width="2" style="cursor:move" />`)}}return x`<g class="hme-handles">${r}</g>`}distances(e,t,o){let n=Mt(t,o),i=n>=0?W(t)[n]:void 0;if(i===void 0)return x``;let r=Ce(i),s=ft(o.a,i.a,i.b).along,d=ft(o.b,i.a,i.b).along,l=Math.max(0,Math.min(s,d)),p=Math.min(r,Math.max(s,d)),h=Qd(t,i),m=[(i.b[0]-i.a[0])/r,(i.b[1]-i.a[1])/r],u=v=>{let M=e.toScreen([i.a[0]+m[0]*v,i.a[1]+m[1]*v]);return[M[0]+h[0]*26,M[1]+h[1]*26]},b=[0,l,p,r],f=v=>`M${dt([v[0]-h[0]*5,v[1]-h[1]*5])}L${dt([v[0]+h[0]*5,v[1]+h[1]*5])}`,w=[[0,l,!1],[l,p,!0],[p,r,!1]];return x`<g class="hme-dist" pointer-events="none">
      <path d=${`M${dt(u(0))}L${dt(u(r))}${b.map(v=>f(u(v))).join("")}`} stroke="#98989d" stroke-width="1" fill="none" />
      ${w.filter(([v,M])=>M-v>.02).map(([v,M,$])=>{let y=u((v+M)/2);return x`<g class="hme-tag"><rect x=${H(y[0]-25)} y=${H(y[1]-9)} width="50" height="18" rx="9" fill=${$?"#5b8def":"#2c2c2e"} />
          <text x=${H(y[0])} y=${H(y[1]+4)} fill="#fff" text-anchor="middle">${(M-v).toFixed(2)} m</text></g>`})}
    </g>`}ghost(e){let t=this.hoverAt;if(t===void 0)return[];let o=[];if(this.tool==="door"||this.tool==="window"||this.tool==="opening"){let n=Zd(e,t,Vd,this.focus(e));if(n!==void 0){let i=this.tool==="window"?1.2:.9,r=Ce(n.seg),s=Math.min(i,r),d=Math.min(Math.max(ft(t,n.seg.a,n.seg.b).along,s/2),r-s/2),l=[(n.seg.b[0]-n.seg.a[0])/r,(n.seg.b[1]-n.seg.a[1])/r],p=e.toScreen([n.seg.a[0]+l[0]*(d-s/2),n.seg.a[1]+l[1]*(d-s/2)]),h=e.toScreen([n.seg.a[0]+l[0]*(d+s/2),n.seg.a[1]+l[1]*(d+s/2)]);o.push(x`<line x1=${H(p[0])} y1=${H(p[1])} x2=${H(h[0])} y2=${H(h[1])} stroke="#5b8def" stroke-width="10" stroke-opacity="0.6" stroke-linecap="round" pointer-events="none" />`)}}if(this.tool==="stairs"&&V(e.floor,t)!==void 0){let[n,i]=e.toScreen(t),r=e.px(1),s=e.px(2.6);o.push(x`<g pointer-events="none" opacity="0.7"><rect x=${H(n-r/2)} y=${H(i-s/2)} width=${H(r)} height=${H(s)} fill="none" stroke="#5b8def" stroke-width="1.5" stroke-dasharray="4 3" />
        ${[1,2,3,4,5,6,7].map(d=>x`<line x1=${H(n-r/2)} x2=${H(n+r/2)} y1=${H(i-s/2+s*d/8)} y2=${H(i-s/2+s*d/8)} stroke="#5b8def" stroke-width="1" />`)}</g>`)}if((this.tool==="split"||this.tool==="inner")&&this.first!==void 0){let n=e.toScreen(this.first.a),i=e.toScreen(this.snap(e,t,this.first.a));if(this.tool==="split"){let r=Math.max(Math.hypot(i[0]-n[0],i[1]-n[1]),1e-6),s=[(i[0]-n[0])/r,(i[1]-n[1])/r],d=Math.hypot(e.stage.width,e.stage.height);o.push(x`<line x1=${H(n[0]-s[0]*d)} y1=${H(n[1]-s[1]*d)} x2=${H(n[0]+s[0]*d)} y2=${H(n[1]+s[1]*d)} stroke="#5b8def" stroke-width="1.5" stroke-dasharray="6 4" pointer-events="none" />`)}else o.push(x`<line x1=${H(n[0])} y1=${H(n[1])} x2=${H(i[0])} y2=${H(i[1])} stroke="#ece6da" stroke-width=${H(Math.max(e.px(.1),3))} stroke-opacity="0.8" pointer-events="none" />`);o.push(x`<circle cx=${H(n[0])} cy=${H(n[1])} r="5" fill="#5b8def" pointer-events="none" />`)}return o}snap(e,t,o){return yi(e.floor,t,e.view.scale,{...o===void 0?{}:{from:o},...e.toggles.grid?{grid:Be}:{}})}pointerDown(e,t,o){if(t.button!==0)return!1;switch(this.tool){case"door":case"window":case"opening":{let n=Zd(e,o,Vd,this.focus(e));if(n===void 0)return!1;let i=this.tool,r=n.room.id,s={kind:"opening",roomId:r,opening:n.room.openings.length},d=n.wall;return e.apply(l=>zo(l,r,d,{kind:i,at:o}),{select:s})&&this.placed(e,s),!0}case"stairs":{let n=V(e.floor,o);if(n===void 0)return!1;let i=n.id,r={kind:"room",roomId:i};return e.apply(s=>da(s,i,o),{select:r})&&this.placed(e,r),!0}case"split":case"inner":return this.twoPoints(e,o);default:return!1}}twoPoints(e,t){if(this.first===void 0){let r=V(e.floor,t)??this.focus(e);return r===void 0?!1:(this.first={roomId:r.id,a:this.snap(e,t)},e.select({kind:"room",roomId:r.id}),!0)}let{roomId:o,a:n}=this.first,i=this.snap(e,t,n);if(this.first=void 0,Math.hypot(i[0]-n[0],i[1]-n[1])<.1)return e.redraw(),!0;if(this.tool==="inner"){let r=e.doc.floors.flatMap(d=>d.rooms).find(d=>k(d.id,o)),s={kind:"wall",roomId:o,wall:r===void 0?0:Ln(r).length};return e.apply(d=>_o(d,o,n,i),{select:s})?this.placed(e,s):e.note("err","An inner wall needs to be at least 10 cm long."),!0}return this.split(e,o,n,i),!0}async split(e,t,o,n){let i=e.floor.rooms.find(l=>k(l.id,t)),r=await e.ask({title:"Name the new room",label:"Name",value:i===void 0?"Room":`${T(i)} 2`,ok:"Split the room"});if(r===void 0)return;let s=e.newId(),d={kind:"room",roomId:s};e.apply(l=>Ma(l,t,o,n,s,r),{select:d})?(this.setTool(e,"select"),e.select(d)):e.note("err","That line does not cut the room in two. Draw it right across the room.")}pressHandle(e,t){let o=this.pieceRoom(e),n=t.target?.closest?.("[data-hme]")?.getAttribute("data-hme")??"",[i,r]=n.split(/:(.*)/s);if(i==="issue"){let d=Yd(e.floor).find(l=>l.id===r);return d!==void 0&&e.apply(l=>d.fix(l)),!0}if(i==="end"&&o!==void 0&&r!==void 0){let[d,l]=r.split(":").map(Number);return Number.isInteger(d)&&(l===0||l===1)&&this.endDrag(e,t,o,d,l),!0}let s=Number(r);if(o===void 0||!Number.isInteger(s))return!1;if(i==="corner")this.cornerDrag(e,t,o,s);else if(i==="mid")this.midDrag(e,t,o,s);else if(i==="opening")this.openingDrag(e,t,o,s);else return!1;return!0}pressPiece(e,t,o){if(t.shiftKey||t.metaKey||t.ctrlKey||t.altKey)return!1;let n=ki(e.floor,e.toScreen,o,de(e.selection));if(n===void 0)return!1;let i=e.floor.rooms.find(s=>k(s.id,n.roomId));if(i===void 0)return!1;if(n.kind==="opening")return this.openingDrag(e,t,i,n.opening),!0;let r=W(i)[n.wall];return this.wallAt=r===void 0?void 0:ft(o,r.a,r.b).point,e.select(n),!0}cornerTo(e,t,o,n){let i=e.floor.rooms.filter(d=>!k(d.id,t.id)).flatMap(d=>d.outline),r=10/e.view.scale;for(let d of i)if(Math.hypot(d[0]-n[0],d[1]-n[1])<=r)return[d[0],d[1]];let s=n;if(e.toggles.grid&&(s=[Math.round(s[0]/Be)*Be,Math.round(s[1]/Be)*Be]),e.toggles.snap){let d=Wr(e.floor.rooms.flatMap(w=>Ln(w))),l=Math.cos(d),p=Math.sin(d),h=w=>[w[0]*l+w[1]*p,-w[0]*p+w[1]*l],[m,u]=h(s),b=t.outline.length,f=8/e.view.scale;for(let w of[(o+b-1)%b,(o+1)%b]){let[v,M]=h(t.outline[w]);Math.abs(m-v)<=f&&(m=v),Math.abs(u-M)<=f&&(u=M)}s=[m*l-u*p,m*p+u*l]}return s}cornerDrag(e,t,o,n){let i=o.id,r;e.drag(t,{move:s=>{this.dragging=!0;let d=this.cornerTo(e,o,n,s);r=d,e.preview(l=>kt(l,i,n,d))},end:(s,d,l)=>{this.dragging=!1,e.preview(void 0);let p=r,h={kind:"corner",roomId:i,corner:n};l&&p!==void 0?e.apply(m=>kt(m,i,n,p),{select:h}):e.select(h)},cancel:()=>this.stopDrag(e)})}midDrag(e,t,o,n){let i=o.id,r=W(o)[n],s=Lo(e.doc,i,n),d=s?.floors.flatMap(u=>u.rooms).find(u=>k(u.id,i));if(r===void 0||s===void 0||d===void 0)return;let l=[(r.a[0]+r.b[0])/2,(r.a[1]+r.b[1])/2],p=d.outline.reduce((u,b,f)=>Math.hypot(b[0]-l[0],b[1]-l[1])<Math.hypot(d.outline[u][0]-l[0],d.outline[u][1]-l[1])?f:u,0),h=u=>b=>{let f=Lo(b,i,n);return f===void 0||u===void 0?f:kt(f,i,p,u)},m;e.drag(t,{move:u=>{this.dragging=!0,m=this.cornerTo(e,d,p,u),e.preview(h(m))},end:(u,b,f)=>{this.dragging=!1,e.preview(void 0),e.apply(h(f?m:void 0),{select:{kind:"corner",roomId:i,corner:p}})},cancel:()=>this.stopDrag(e)})}endDrag(e,t,o,n,i){let r=o.id,s=Ze(o,n),d=s===void 0?void 0:W(o)[s.wall];if(s===void 0||d===void 0)return;let l=i===0===s.forward?-1:1,p=u=>Go(s,{x:l,z:0},ft(u,d.a,d.b).along-(l<0?s.from:s.to),0,!1),h,m={kind:"opening",roomId:r,opening:n};e.drag(t,{move:u=>{this.dragging=!0,this.sliding={roomId:r,index:n};let b=p(u);h=b,e.preview(f=>Te(f,r,n,b))},end:()=>{this.dragging=!1,this.sliding=void 0,e.preview(void 0);let u=h;u!==void 0&&e.apply(b=>Te(b,r,n,u),{select:m})},cancel:()=>this.stopDrag(e)})}faceDrag(e,t){let{pick:o,part:n,ds:i,dz:r,done:s}=t,d=o.roomId,l=e.doc.floors.flatMap(h=>h.rooms).find(h=>k(h.id,d));if(l===void 0)return;let p;if(o.kind==="wall"){let h=Math.round(Math.min(Math.max(l.height+r,.5),20)*100)/100;this.sizeTag=`Height ${h.toFixed(2)} m`,p=m=>Kt(m,d,h)}else{let h=o.opening,m=Ze(l,h),u=l.openings[h];if(m===void 0||u===void 0)return;let b=m.forward?1:-1,f=Go(m,{x:n.x*b,z:n.z},i*b,r,u.kind!=="window");this.sizeTag=`${(f.to-f.from).toFixed(2)} \xD7 ${(f.z1-f.z0).toFixed(2)} m`,p=w=>Te(w,d,h,f)}if(!s){e.preview(p);return}this.sizeTag=void 0,e.preview(void 0),e.apply(p)}openingDrag(e,t,o,n){let i=o.id,r=o.openings[n];if(r===void 0)return;let s={kind:"opening",roomId:i,opening:n},d=[(r.a[0]+r.b[0])/2,(r.a[1]+r.b[1])/2],l,p;e.select(s),e.drag(t,{move:h=>{l??=h,this.dragging=!0,this.sliding={roomId:i,index:n};let m=[d[0]+h[0]-l[0],d[1]+h[1]-l[1]];p=m,e.preview(u=>Yn(u,i,n,m))},end:(h,m,u)=>{this.dragging=!1,this.sliding=void 0,e.preview(void 0);let b=p;u&&b!==void 0?e.apply(f=>Yn(f,i,n,b),{select:s}):u||this.onOpeningClick?.(e,i,n)},cancel:()=>this.stopDrag(e)})}stopDrag(e){this.dragging=!1,this.sliding=void 0,e.preview(void 0)}hover(e,t){this.tool!=="select"&&(this.hoverAt=t,e.redraw())}keyDown(e,t){let o=te(t,!1);if(o==="cancel"&&(this.tool!=="select"||this.first!==void 0))return this.setTool(e,"select"),!0;let n=e.selection;if(o==="cancel"&&se(n))return e.select({kind:"room",roomId:n.roomId}),!0;if(o==="delete"){let i=e.selection;if(i?.kind==="corner")e.apply(r=>Fo(r,i.roomId,i.corner),{select:{kind:"room",roomId:i.roomId}});else if(i?.kind==="opening")e.apply(r=>jo(r,i.roomId,i.opening),{select:{kind:"room",roomId:i.roomId}});else if(i?.kind==="wall")e.apply(r=>Xn(r,i.roomId,i.wall),{select:{kind:"room",roomId:i.roomId}});else return!1;return!0}return!1}cursor(){return this.tool==="select"?void 0:"crosshair"}leave(e){this.first=void 0,this.hoverAt=void 0,this.dragging=!1,this.sliding=void 0,this.tool="select",e.redraw()}viewItems(e){return e.scans===void 0?[]:[{label:"Show scan as it was",on:e.toggles.scan,title:qd,flip:()=>e.setToggle("scan",!e.toggles.scan)}]}pill(e){if(this.tool!=="select"){let s={split:this.first===void 0?"Click where the cut starts":"Click where it ends, across the room",inner:this.first===void 0?"Click where the wall starts":"Click where it ends",door:"Click a wall to put a door in it",window:"Click a wall to put a window in it",opening:"Click a wall to open a way through it",stairs:"Click in the room to put stairs there"};return c`<span class="hme-pill-name">${s[this.tool]}</span>
        <button type="button" class="hme-tb" @click=${()=>this.setTool(e,"select")}>Cancel</button>`}let t=this.pieceRoom(e),o=e.selection;if(t===void 0||o===void 0||this.dragging)return g;let n=t.id,i=T(t),r=c`<button type="button" class="hme-tb" title="Pick the room (Esc)" @click=${()=>e.select({kind:"room",roomId:n})}>${i} ›</button>`;if(o.kind==="wall"){let s=o.wall,d=this.wallAt,l=oo(t,s,i).replace(", "," \xB7 ");return c`<span class="hme-pill-name">${l}</span>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(e,t,s,"window",d)}>＋ Window here</button>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(e,t,s,"door",d)}>＋ Door here</button>
        <button type="button" class="hme-tb" @click=${()=>this.cornerHere(e,t,s,d)}>Add a corner</button>
        ${r}`}if(o.kind==="corner")return c`<span class="hme-pill-name">${i} · corner</span>
        <button type="button" class="hme-tb" ?disabled=${t.outline.length<=3} @click=${()=>e.apply(s=>Fo(s,n,o.corner),{select:{kind:"room",roomId:n}})}>Remove corner</button>
        ${r}`;if(o.kind==="opening"){let s=t.openings[o.opening];return s===void 0?g:c`<span class="hme-pill-name">${no(s)}</span>
        <button type="button" class="hme-tb danger" @click=${()=>e.apply(d=>jo(d,n,o.opening),{select:{kind:"room",roomId:n}})}>Remove</button>
        ${r}`}return g}addHere(e,t,o,n,i){let r=t.id,s=t.openings.length;e.apply(d=>zo(d,r,o,{kind:n,...i===void 0?{}:{at:i}}),{select:{kind:"opening",roomId:r,opening:s}})}cornerHere(e,t,o,n){let i=t.id,r=h=>Lo(h,i,o,n),s=r(e.doc)?.floors.flatMap(h=>h.rooms).find(h=>k(h.id,i)),d=W(t)[o],l=n??(d===void 0?void 0:[(d.a[0]+d.b[0])/2,(d.a[1]+d.b[1])/2]),p=s===void 0||l===void 0?-1:s.outline.reduce((h,m,u)=>Math.hypot(m[0]-l[0],m[1]-l[1])<Math.hypot(s.outline[h][0]-l[0],s.outline[h][1]-l[1])?u:h,0);e.apply(r,{select:p<0?{kind:"room",roomId:i}:{kind:"corner",roomId:i,corner:p}})}inspector(e){let t=this.pieceRoom(e),o=e.selection;if(t===void 0||o===void 0)return c``;let n=t.id;if(o.kind==="corner")return this.cornerCard(e,t,o.corner);let i=this.pickedWall(e,t);if(i===void 0)return c``;let r=W(t)[i],s=Ce(r),d=p=>{let h=t.openings.length;e.apply(m=>zo(m,n,i,{kind:p}),{select:{kind:"opening",roomId:n,opening:h}})},l=oo(t,i,T(t));return c`
      ${o.kind==="wall"?c`<section class="hme-card hme-head"><div class="hme-head-t"><strong>Wall</strong><span>${l}</span></div></section>`:g}
      <section class="hme-card">
        <div class="hme-h">${o.kind==="wall"?"This wall":`The wall: ${l}`}</div>
        ${o.kind==="wall"?this.wallPicture(e,t,i,void 0):g}
        ${ge(z({tag:"Length",label:"Length",value:s,unit:"m",min:.1,max:200,set:p=>e.apply(h=>va(h,n,i,p))}),z({tag:"Height",label:"Wall height",value:t.height,unit:"m",min:.5,max:20,set:p=>e.apply(h=>Kt(h,n,p))}),z({tag:"Thick",label:"Thickness",value:r.t,unit:"m",min:.01,max:1,set:p=>e.apply(h=>wa(h,n,i,p))}))}
        ${U("Type a length to move the far corner. Rooms that share the corner move with it.")}
        <div class="hme-add3">
          <button type="button" class="hme-tb" @click=${()=>d("door")}>＋ Door</button>
          <button type="button" class="hme-tb" @click=${()=>d("window")}>＋ Window</button>
          <button type="button" class="hme-tb" @click=${()=>d("opening")}>＋ Way through</button>
        </div>
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${()=>e.apply(p=>ya(p,n,i))}>Straighten</button>
          <button type="button" class="hme-tb" @click=${()=>e.apply(p=>Wt(p,n))}>Square the corners</button>
          <button type="button" class="hme-tb" @click=${()=>this.cornerHere(e,t,i,void 0)}>Split wall</button>
          <button type="button" class="hme-tb danger" title="Take this wall away" @click=${()=>e.apply(p=>Xn(p,n,i),{select:{kind:"room",roomId:n}})}>Remove</button>
        </div>
      </section>`}wallPicture(e,t,o,n){let i=W(t)[o],r=Math.max(Ce(i),.01),s=t.height>0?t.height:2.4,d=Math.abs(i.b[0]-i.a[0])>=Math.abs(i.b[1]-i.a[1])?i.a[0]>i.b[0]:i.a[1]>i.b[1],l=320,p=14,h=24,m=Math.min((l-p*2)/r,120/s),u=r*m,b=s*m,f=(l-u)/2,w=h+b+26,v=h+b,M=S=>f+(d?r-S:S)*m,$=S=>v-S*m,y=t.id,P=(S,C,L)=>{let X=Ze(t,C),G=t.openings[C],pe=S.currentTarget.closest("svg");if(X===void 0||G===void 0||pe===null||S.button!==0)return;S.preventDefault(),S.stopPropagation();let He=pe.getBoundingClientRect().width/l||1,he={x:S.clientX,y:S.clientY},Ae={x:d?-L.x:L.x,z:L.z},We,Oe=Le=>{let Pe=(Le.clientX-he.x)/He/m,lt=-(Le.clientY-he.y)/He/m;if(We===void 0&&Math.hypot(Pe,lt)*He*m<3)return;let pt=Go(X,Ae,d?-Pe:Pe,lt,G.kind!=="window");We=pt,e.preview(Rt=>Te(Rt,y,C,pt))},Ue=()=>{window.removeEventListener("pointermove",Oe),window.removeEventListener("pointerup",Ue),window.removeEventListener("pointercancel",Ue),e.preview(void 0);let Le=We;Le!==void 0&&e.apply(Pe=>Te(Pe,y,C,Le))};window.addEventListener("pointermove",Oe),window.addEventListener("pointerup",Ue),window.addEventListener("pointercancel",Ue)},F=t.openings.flatMap((S,C)=>{if(Mt(t,S)!==o)return[];let L=Ze(t,C);if(L===void 0)return[];let X=Math.min(M(L.from),M(L.to)),G=Math.max(M(L.from),M(L.to)),pe=$(L.z1),He=$(L.z0),he=n===C,Ae=S.kind==="window"?"rgba(139,184,240,0.55)":"#121214";return[x`<rect class="hme-wp-o ${he?"on":""}" x=${H(X)} y=${H(pe)} width=${H(G-X)} height=${H(He-pe)} rx="1.5" fill=${Ae} stroke=${he?"#5b8def":"#6e6e73"} stroke-width=${he?2:1}
        style=${he?"cursor:move":"cursor:pointer"}
        @pointerdown=${We=>{he&&P(We,C,{x:0,z:0})}}
        @click=${()=>{he||e.select({kind:"opening",roomId:y,opening:C})}}><title>${no(S)}</title></rect>`]}),I=n===void 0?void 0:Ze(t,n),j=[];if(I!==void 0&&n!==void 0){let S=t.openings[n],C=Math.min(M(I.from),M(I.to)),L=Math.max(M(I.from),M(I.to)),X=$(I.z1),G=$(I.z0),pe=(C+L)/2,He=(X+G)/2,he=S.kind!=="window",Ae=(Pe,lt,pt,Rt)=>x`<circle class="hme-wp-h" cx=${H(Pe)} cy=${H(lt)} r="5.5" fill="#fff" stroke="#5b8def" stroke-width="2" style=${`cursor:${Rt}`}
        @pointerdown=${Rn=>P(Rn,n,pt)}></circle>`,We=[Ae(C,He,{x:-1,z:0},"ew-resize"),Ae(L,He,{x:1,z:0},"ew-resize"),Ae(pe,X,{x:0,z:1},"ns-resize"),...he?[]:[Ae(pe,G,{x:0,z:-1},"ns-resize")]],Oe=(Pe,lt,pt,Rt,Rn=!1)=>x`<text x=${H(Pe)} y=${H(lt)} text-anchor=${Rt} class=${Rn?"hme-wp-t strong":"hme-wp-t"}>${pt}</text>`;j.push(Oe(pe,Math.max(X-8,12),`${oe(I.to-I.from)}`,"middle",!0));let Ue=(C-f)/m,Le=(f+u-L)/m;Ue>.03&&j.push(x`<path d=${`M${H(f)} ${H(v+8)}H${H(C)}`} class="hme-wp-dim" />`,Oe((f+C)/2,v+20,oe(Ue),"middle")),Le>.03&&j.push(x`<path d=${`M${H(L)} ${H(v+8)}H${H(f+u)}`} class="hme-wp-dim" />`,Oe((L+f+u)/2,v+20,oe(Le),"middle")),j.push(Oe(L+8,He+4,oe(I.z1-I.z0),"start",!0)),I.z0>.03&&j.push(x`<path d=${`M${H(pe)} ${H(G)}V${H(v)}`} class="hme-wp-dim" />`,Oe(pe+5,(G+v)/2+4,oe(I.z0),"start")),j.push(...We)}return c`<svg class="hme-wp" viewBox=${`0 0 ${l} ${w.toFixed(0)}`} role="img" aria-label=${`${oo(t,o,T(t))}, seen square on`}>
      ${x`<rect x=${H(f)} y=${H(h)} width=${H(u)} height=${H(b)} rx="2" class="hme-wp-wall" />
        <line x1=${H(f-8)} x2=${H(f+u+8)} y1=${H(v)} y2=${H(v)} class="hme-wp-floor" />`}
      ${F}${j}
    </svg>`}openingCardOf(e){let t=this.pieceRoom(e),o=e.selection,n=o?.kind==="opening"?t?.openings[o.opening]:void 0;return t===void 0||o?.kind!=="opening"||n===void 0?g:this.openingCard(e,t,o.opening,n)}openingCard(e,t,o,n){let i=t.id,r=no(n),s=Ze(t,o),d=s?.wall??-1,l=W(t)[d],p=n.kind!=="window",h=l===void 0?!1:Math.abs(l.b[0]-l.a[0])>=Math.abs(l.b[1]-l.a[1])?l.a[0]>l.b[0]:l.a[1]>l.b[1],m=l===void 0||Math.abs(l.b[0]-l.a[0])>=Math.abs(l.b[1]-l.a[1]),u=P=>({set:F=>{e.apply(I=>Te(I,i,o,P(F)))},preview:F=>e.preview(F===void 0?void 0:I=>Te(I,i,o,P(F)))}),b=c`<div class="hme-pics hme-kinds">${$p.map(P=>le({label:P.label,picture:Pp[P.label],on:n.kind===P.kind&&n.style===P.style,click:()=>e.apply(F=>ka(F,i,o,{kind:P.kind,style:P.style??null}))}))}</div>`,f=c`<button type="button" class="hme-tb danger" @click=${()=>e.apply(P=>jo(P,i,o),{select:{kind:"room",roomId:i}})}>Remove ${r.toLowerCase()}</button>`,w=c`<section class="hme-card hme-head"><div class="hme-head-t"><strong>${r}</strong>
      <span>${d>=0?oo(t,d,T(t)):T(t)}</span></div></section>`;if(s===void 0||l===void 0)return c`${w}${A("Kind",b)}<section class="hme-card"><div class="hme-row-end">${f}</div></section>`;let v=s.to-s.from,M=s.z1-s.z0,$=h?s.length-s.to:s.from,y=(s.length-v)/2;return c`${w}
      <section class="hme-card">
        <div class="hme-h">Size and place</div>
        ${this.wallPicture(e,t,d,o)}
        ${ge(z({tag:"Width",label:"Width",value:v,unit:"m",min:.2,max:s.length,...u(P=>({...s,from:s.from,to:Math.min(s.from+P,s.length)}))}),z({tag:"Height",label:"Tall",value:M,unit:"m",min:.1,max:s.height,...u(P=>({...s,z1:Math.min(s.z0+P,s.height)}))}))}
        ${ge(z({tag:m?"From left":"From top",label:m?"From the left":"From the top",value:$,unit:"m",min:0,max:s.length-v,...u(P=>h?{...s,from:s.length-P-v,to:s.length-P}:{...s,from:P,to:P+v})}),z({tag:"From floor",label:"From floor",value:s.z0,unit:"m",min:0,max:s.height-M,disabled:p,...u(P=>({...s,z0:P,z1:P+M}))}))}
        <div class="hme-row-end">
          <button type="button" class="hme-tb" title="Put it in the middle of its wall" @click=${()=>e.apply(P=>Te(P,i,o,{...s,from:y,to:y+v}))}>Center on wall</button>
          ${f}
        </div>
        ${U("Drag a white dot on the picture to resize it, or the shape to move it. It works on the plan and in 3D too.",!0)}
      </section>
      ${A("Kind",b)}`}cornerCard(e,t,o){let n=t.id,i=t.outline[o];if(i===void 0)return c``;let r=e.floor.rooms.filter(s=>!k(s.id,n)&&s.outline.some(d=>Math.hypot(d[0]-i[0],d[1]-i[1])<=.02));return A("Corner",c`
      ${B("Room",c`<span class="hme-val strong">${T(t)}</span>`)}
      ${B("Left, top",z({label:"Corner left",value:i[0],unit:"m",set:s=>e.apply(d=>kt(d,n,o,[s,i[1]]))}),z({label:"Corner top",value:i[1],unit:"m",set:s=>e.apply(d=>kt(d,n,o,[i[0],s]))}))}
      ${U(r.length===0?"Drag it on the plan. Drop it on another room's corner and the two move together after.":`Shared with ${r.map(T).join(", ")}, which move${r.length===1?"s":""} with it.`)}
      <div class="hme-row-end indent">
        <button type="button" class="hme-tb" ?disabled=${t.outline.length<=3} @click=${()=>e.apply(s=>Fo(s,n,o),{select:{kind:"room",roomId:n}})}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(s=>Wt(s,n))}>Square the corners</button>
      </div>`)}},Hp={select:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3z" fill="none" stroke="currentColor" stroke-width="1.4"></path><circle cx="3" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="15" r="2" fill="currentColor"></circle><circle cx="3" cy="15" r="2" fill="currentColor"></circle></svg>`,split:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 3h14v12H2z" fill="none" stroke="currentColor" stroke-width="1.4"></path><path d="M9 1v16" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 2"></path></svg>`,inner:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="2.4"></path></svg>`,door:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 15h4M12 15h4M6 15V5M6 5a10 10 0 0 1 10 10" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`,window:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="1.4"></path><path d="M5 7h8M5 11h8" stroke="#8bb8f0" stroke-width="1.4"></path></svg>`,opening:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h4M12 9h4" stroke="currentColor" stroke-width="2.4"></path></svg>`,stairs:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3zM3 6h12M3 9h12M3 12h12" fill="none" stroke="currentColor" stroke-width="1.2"></path></svg>`},Pp={Door:c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V4M14 4a17 17 0 0 1 17 17" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Double door":c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V7M48 21V7M14 7a14 14 0 0 1 14 14M48 7a14 14 0 0 0-14 14" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Sliding door":c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18.5h20M28 23.5h20" stroke="#ece6da" stroke-width="2.4"></path></svg>`,Window:c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 18h34M14 24h34" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Sliding window":c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18h20M28 24h20" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Way through":c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h10M48 21h10" stroke="#ece6da" stroke-width="4"></path><path d="M14 27h34" stroke="#98989d" stroke-width="1" stroke-dasharray="3 3"></path></svg>`};var co=[{id:"pick",name:"Pick",label:"Pick and move",key:"v"},{id:"draw",name:"Room",label:"Draw a room",key:"r"},{id:"split",name:"Split",label:"Split the room",key:"s"},{id:"inner",name:"Wall",label:"Inner wall",key:"w"},{id:"door",name:"Door",label:"Door",key:"d"},{id:"window",name:"Window",label:"Window",key:"n"},{id:"opening",name:"Opening",label:"Way through (no door)",key:"o"},{id:"stairs",name:"Stairs",label:"Stairs",key:"t"},{id:"measure",name:"Measure",label:"Measure",key:"m"}],el=co.filter(a=>a.id!=="pick"&&a.id!=="measure");function Ep(a){return co.find(e=>e.key===a.toLowerCase())?.id}function Cp(a){let e=Sa(a);return a.pins.filter(t=>t.entityId.startsWith("light.")&&!e.has(t.id.toUpperCase())).map(t=>t.id)}function Tp(a,e){let t=a.hass?.states?.[e]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t.trim():e}var Mn=class{constructor(){this.arrange=new pn;this.devices=new bn((e,t,o)=>this.arrange.piecePic(e,ot(t),o));this.shape=new yn;this.doors=new wn;this.drawOpen=!1;this.arrange.roomDoors=(e,t)=>this.doors.doorsCard(e,t),this.arrange.roomWalls=(e,t)=>this.shape.wallsCard(e,t),this.arrange.roomScan=(e,t)=>this.shape.scanCard(e,t),this.arrange.roomBefore=e=>this.checklistStrip(e),this.arrange.roomTray=(e,t)=>c`${this.devices.trayCard(e,t)}${this.devices.onMapCard(e,t)}`,this.shape.onOpeningClick=(e,t,o)=>this.doors.clicked(e,t,o)}tool(e){if(e.toggles.measure)return"measure";if(this.arrange.draw.active)return"draw";let t=this.shape.tool;return t==="select"?"pick":t}setTool(e,t){if(this.doors.stop(e),this.drawOpen=!1,this.devices.armed=void 0,t==="measure"){this.arrange.draw.stop(),this.shape.setTool(e,"select"),e.setToggle("measure",!e.toggles.measure),e.redraw();return}if(e.toggles.measure&&e.setToggle("measure",!1),t==="draw"){this.shape.setTool(e,"select"),this.arrange.draw.active||this.arrange.draw.start(e);return}this.arrange.draw.stop(e),this.shape.setTool(e,t==="pick"?"select":t)}picksPins(e){return et(e.selection).length>0}overlay(e){return x`${this.arrange.overlay(e)}${this.shape.overlay(e)}${this.doors.overlay(e)}${this.devices.overlay(e)}`}drawsPins(e){return!0}pointerDown(e,t,o){if(this.devices.choosing)return this.devices.cancelChooser(e),!0;if(this.drawOpen&&(this.drawOpen=!1,e.redraw()),this.devices.armed!==void 0&&t.button===0)return this.devices.placeArmed(e,o),!0;if(this.doors.endShow(e),this.doors.active&&t.button===0&&this.doors.pointerDown(e,o))return!0;if(this.arrange.draw.active)return this.arrange.draw.pointerDown(e,t,o);if(this.shape.armed)return this.shape.pointerDown(e,t,o);if(t.button!==0)return!1;if(this.shape.pressHandle(e,t)||this.arrange.pressHandle(e,t,o)||this.devices.pressHandle(e,t,o))return!0;let n=this.devices.heldThingAt(e,o);return n!==void 0&&this.arrange.pressThing(e,t,n,o)?!0:this.devices.pressPin(e,t,o)||this.devices.pressBox(e,t,o)||this.shape.pressPiece(e,t,o)||this.arrange.pressBody(e,t,o)}hover(e,t){this.arrange.pointer=t,this.arrange.hover(e,t),this.shape.hover(e,t)}keyDown(e,t){if(this.devices.chooserKey(e,t))return!0;let o=te(t,!1);if(o==="cancel"&&(this.devices.armed!==void 0||this.drawOpen))return this.devices.armed=void 0,this.drawOpen=!1,e.redraw(),!0;let n=typeof o=="object"&&"letter"in o?o.letter:void 0;if(n==="m")return this.setTool(e,"measure"),!0;if(this.doors.keyDown(e,t)||this.arrange.draw.active&&this.arrange.draw.keyDown(e,t))return!0;if(o==="copy"||o==="paste"||o==="duplicate")return this.arrange.clipKey(e,o);if(n==="f")return e.openAdd("furniture"),!0;let i=n===void 0?void 0:Ep(n);return i!==void 0?(this.setTool(e,i),!0):o==="cancel"&&this.shape.armed?(this.setTool(e,"pick"),!0):se(e.selection)||this.shape.armed?this.shape.keyDown(e,t):this.picksPins(e)?this.devices.keyDown(e,t):this.arrange.keyDown(e,t)}cursor(e){return this.arrange.draw.active||this.shape.armed||this.devices.armed!==void 0?"crosshair":void 0}leave(e){this.arrange.leave(e),this.devices.leave(),this.shape.leave(e),this.doors.stop(e),this.drawOpen=!1}dock(e){return this.arrange.dock(e)}viewItems(e){return[...this.arrange.viewItems(e),...this.devices.viewItems(e),...this.shape.viewItems(e)]}pill(e){return this.doors.active?this.doors.pill(e):this.shape.armed||se(e.selection)?this.shape.pill(e):this.arrange.draw.active?this.arrange.pill(e):this.picksPins(e)?this.devices.pill(e):this.arrange.pill(e)}stageExtra(e){let t=this.devices.stageExtra(e),o=this.devices.armed,n=se(e.selection)?"Drag a corner \xB7 drag a wall's middle to add a corner \xB7 Esc for the room":"Click picks what is on top: a door, a wall, a thing or a room";return c`${this.toolRail(e)}${this.drawList(e)}${t}
      ${o!==void 0?c`<div class="hme-armed" role="status"><b>${Tp(e,o)}</b> Click its place on the plan.
          <button type="button" class="hme-link" @click=${()=>this.devices.arm(e,void 0)}>Stop</button></div>`:t===g&&e.stage.width>=1200?c`<div class="hme-stage-hint">${n}</div>`:g}`}toolRail(e){let t=this.tool(e),o=co.find(s=>s.id==="pick"),n=co.find(s=>s.id==="measure"),i=el.find(s=>s.id===t),r=s=>c`<button type="button" class="hme-rtool ${t===s.id?"on":""}" aria-pressed=${t===s.id?"true":"false"}
      aria-label=${s.label} title=${`${s.label} (${s.key.toUpperCase()})`} @click=${()=>this.setTool(e,s.id)}>
      ${Qi(s.id)}<span class="hme-rtool-name">${s.name}</span></button>`;return c`<div class="hme-toolrail" role="toolbar" aria-label="Tools" aria-orientation="vertical">
      ${r(o)}
      <span class="hme-rtool-sep" aria-hidden="true"></span>
      <button type="button" class="hme-rtool hme-rtool-draw ${i!==void 0||this.drawOpen?"on":""}" aria-pressed=${i!==void 0?"true":"false"}
        aria-haspopup="menu" aria-expanded=${this.drawOpen?"true":"false"} aria-label=${i===void 0?"Draw":`Draw: ${i.label}`}
        title=${i===void 0?"Draw a room, a wall, a door, a window, a way through or stairs":`${i.label} (${i.key.toUpperCase()})`}
        @click=${()=>{this.drawOpen=!this.drawOpen,e.redraw()}}>
        ${Qi(i?.id??"draw")}<span class="hme-rtool-name">${i?.name??"Draw"} ▾</span></button>
      <span class="hme-rtool-sep" aria-hidden="true"></span>
      ${r(n)}
    </div>`}drawList(e){if(!this.drawOpen)return g;let t=this.tool(e);return c`<div class="hme-drawlist" role="menu" aria-label="Draw">
      ${el.map(o=>c`<button type="button" role="menuitemradio" class="hme-drawlist-item ${t===o.id?"on":""}" aria-checked=${t===o.id?"true":"false"}
        title=${`${o.label} (${o.key.toUpperCase()})`} @click=${()=>this.setTool(e,o.id)}>${Qi(o.id)}<span>${o.name}</span><kbd>${o.key.toUpperCase()}</kbd></button>`)}
    </div>`}inspector(e){return c`${this.doors.fitCard(e)}${this.pickedCards(e)}${this.doors.fitFoot(e)}`}trayAbove(e){let t=this.devices.trayRoom,o=e.selection;if(t===void 0||o===void 0)return g;let n=e.floor.rooms.find(s=>k(s.id,t));if(n===void 0)return g;if(!(o.kind==="object"?k(o.roomId,t):o.kind==="pin"?Qt(e.floor,o).some(s=>k(s.id,t)):!1))return g;let r=this.devices.waitingIn(e,n);return r.main.length===0&&r.more.length===0?g:c`${this.devices.trayCard(e,n,`Next in ${T(n)}`)}
      <button type="button" class="hme-link hme-tray-back" @click=${()=>e.select({kind:"room",roomId:n.id})}>‹ ${T(n)}</button>`}pickedCards(e){if(this.picksPins(e))return c`${this.trayAbove(e)}${this.devices.inspector(e)}`;let t=e.selection;if(t===void 0)return this.startPanel(e);if(se(t)){let n=e.floor.rooms.find(i=>k(i.id,t.roomId));return c`${this.shape.openingCardOf(e)}
        ${n!==void 0&&t.kind==="opening"?this.doors.opensToCard(e,n,t.opening):g}
        ${this.shape.inspector(e)}
        ${n===void 0?g:this.shape.roomCards(e,n)}`}let o=t.kind==="object"?this.devices.thingCards(e,t.roomId,t.object):g;return o===g?this.arrange.inspector(e):c`${this.trayAbove(e)}${o}${this.arrange.inspector(e)}`}checklist(e,t=zi(e.doc,this.devices.homeDevices(e))){return Pd(t,e.pageStep?.done(e.doc)??!1)}checklistShown(e,t){return fn(t)!==void 0||e.pageStep?.addedAny===!0}checklistStrip(e){let t=this.checklist(e),o=fn(t);return o===void 0?g:c`<button type="button" class="hme-strip" title="Show the whole checklist" aria-label=${`${ji}: ${Ni(t)}`}
      @click=${()=>e.select(void 0)}>
      ${t.map(n=>c`<span class="hme-strip-cell ${n.done?"done":n===o?"now":"next"}">
        <b>${n.done?"\u2713 ":""}${n.title}</b>${n===o?c`<small>${n.words}</small>`:g}</span>`)}
    </button>`}placeDevices(e){let t=this.devices.homeDevices(e),o=[e.floor,...e.doc.floors.filter(n=>!k(n.id,e.floor.id))];for(let n of o){let i=n.rooms.find(r=>St(r,t,e.doc).main.length>0);if(i!==void 0){k(n.id,e.floor.id)||e.setFloor(n.id),e.select({kind:"room",roomId:i.id});return}}}checklistCard(e){let t=zi(e.doc,this.devices.homeDevices(e)),o=this.checklist(e,t);if(!this.checklistShown(e,o))return g;let n=fn(o),i=Cp(e.floor),r=(p,h)=>{let m=p.done?"done":p===n?"now":"next";return c`<div class="hme-step ${m}">
        <span class="hme-step-no" aria-label=${p.done?"Done":`Step ${p.id}`}>${p.done?"\u2713":String(p.id)}</span>
        <div class="hme-step-t"><b>${p.title}</b><span>${p.words}</span>${h}</div>
      </div>`},[s,d,l]=o;return A(ji,c`<div class="hme-steps">
      ${r(s,n===s?c`<button type="button" class="hme-tb hme-blue" @click=${()=>this.startDrawing(e)}>Draw a room</button>`:g)}
      ${r(d,c`${n!==d?g:t.waiting>0?c`<button type="button" class="hme-tb hme-blue" @click=${()=>this.placeDevices(e)}>Place devices</button>`:c`<button type="button" class="hme-tb hme-blue" @click=${()=>e.openAdd("devices")}>Add a device</button>`}
        ${i.length===0?g:c`<span class="hme-step-quiet">${O(i.length,"light")} ${i.length===1?"sits":"sit"} in no lamp.
          <button type="button" class="hme-link" title="Pick every light no lamp holds" @click=${()=>e.select(qo(i))}>Show me the loose lights</button></span>`}`)}
      ${r(l,n===l||e.pageStep?.addedAny===!0?this.pageRows(e):g)}
    </div>`,Ni(o),"hme-start")}pageRows(e){let t=e.pageStep;if(t===void 0)return c``;let o=t.rows(),n=e.floor.rooms.length>0?e.floor:e.doc.floors.find(i=>i.rooms.length>0);return o.length===0?c`<span class="hme-step-quiet">${ht("Pair a watch or an iPhone first.","Pair a watch or a phone first.")}</span>`:c`<div class="hme-pagerows">${o.map(i=>c`<div class="hme-pagerow">
      <div class="hme-pagerow-t"><b>${i.device.name}</b><span>${i.line}</span>
        ${i.note===void 0?g:c`<span class="hme-pagerow-note ${i.note.kind}" role="status">${i.note.text}</span>`}</div>
      ${i.added!==void 0?c`<span class="hme-pagerow-done">Added${e.openPage===void 0?g:c` · <button type="button" class="hme-link" @click=${()=>e.openPage?.(i.added)}>Open it</button>`}</span>`:c`<button type="button" class="hme-tb" aria-label=${`Add a page to ${i.device.name}`} ?disabled=${i.busy||n===void 0}
            @click=${()=>{n!==void 0&&t.add(e.hass,e.doc,n,i.device,r=>e.confirm(r))}}>${i.busy?"Adding\u2026":"Add page"}</button>`}
    </div>`)}</div>`}roomsCard(e){let t=e.floor;return t.rooms.length===0?g:A("Rooms",c`<div class="hme-ly-list">${t.rooms.map(o=>{let n=this.devices.waitingIn(e,o),i=o.areaId!==void 0,r=Cd({hasArea:i,onMap:Ve(t,o.id).length,wait:n.main.length,more:n.more.length}),s={kind:"room",roomId:o.id},d=e.hover?.kind==="room"&&k(e.hover.roomId,o.id);return c`<div class="hme-ly ${d?"hov":""}" @pointerenter=${()=>e.setHover(s)} @pointerleave=${()=>e.setHover(void 0)}>
        <button type="button" class="hme-ly-main" title=${i?"Pick it":"Pick it and give it an area"}
          @click=${()=>{i||ro(Ai,!0),e.select(s)}}>
          <span class="hme-thing-ic" aria-hidden="true"></span><span class="hme-ly-nm">${T(o)}</span>
          <span class="hme-ly-end ${n.main.length>0?"wait":""}">${r}</span></button>
      </div>`})}</div>`,String(t.rooms.length),"hme-rooms")}startPanel(e){let t=e.floor;return c`
      ${this.checklistCard(e)}
      ${this.roomsCard(e)}
      ${Re("floor","Floor",K(t),this.arrange.floorBody(e,t))}
      <section class="hme-card hme-tips-card">
        <details class="hme-tips">
          <summary>Keys and tips <span aria-hidden="true">›</span></summary>
          <p class="hme-text">Click picks what is on top: a device, then a thing (a sofa, a TV, a desk), then the room under them. Drag it to move it.</p>
          <p class="hme-text dim">A dragged room locks to the doors of the rooms round it. Click an amber door, then the door it should meet. Drag the round handle above a room to turn it, or a square handle on its box to resize it. Click a wall, door or window to change it.</p>
          <p class="hme-text dim">Shift, Cmd or Ctrl and a click picks several devices; Cmd or Ctrl and a click picks several things, to colour or hide them together. Pick a room to see its devices that wait: drag one from its tray onto the plan, or click it, then click its place.</p>
          <p class="hme-text dim">Press <kbd>?</kbd> or the ? button in the bar for every key.</p>
          <dl class="hme-keys">
            ${Ji(Ie()).filter(o=>o.title!=="Mouse").flatMap(o=>o.keys).map(([o,n])=>c`<dt><kbd>${o}</kbd></dt><dd>${n}</dd>`)}
          </dl>
        </details>
      </section>`}sheet(e){let t=this.devices.lampChooser(e);return t===g?this.arrange.sheet(e):t}dragOver(e,t,o){return this.devices.dragOver(e,t,o)}drop(e,t,o){this.devices.drop(e,t,o)}startDrawing(e){this.setTool(e,"draw")}};function Ji(a){let e=a?"\u2318":"Ctrl";return[{title:"Tools",keys:co.map(t=>[t.key.toUpperCase(),t.label])},{title:"Add",keys:[["A","Add a device or furniture"],["F","Add furniture"]]},{title:"Edit",keys:[["Delete","Remove what is picked"],[`${e}${a?"":"+"}C`,"Copy the picked furniture"],[`${e}${a?"":"+"}V`,"Paste it under the pointer, on any floor"],[`${e}${a?"":"+"}D`,"Duplicate the picked furniture"],["Arrows","Nudge it 1 cm, with Shift 10 cm"],["Enter","Close the room being drawn"],["Backspace","Take back the last corner drawn"],["Esc","Back out: Connect, a tool, a wall, door or thing to its room"],[a?"\u2318Z":"Ctrl+Z","Undo"],[a?"\u21E7\u2318Z":"Ctrl+Shift+Z or Ctrl+Y","Redo"]]},{title:"View",keys:[["Space","Hold and drag to pan"],["Middle button","Drag to move the plan or the 3D view"],["+ \u2212","Zoom in and out"],["0","Fit the floor"],["Z","Fit the picked room"],["?","Show or hide these keys"]]},{title:"Mouse",keys:[["Click","Pick what is on top: a device, a door or window, a wall, a thing, then the room"],["Click an amber door","Connect it: then click the door it should meet"],[`Shift or ${e} click`,"Pick several devices"],[`${e} click`,"Pick several things"],["Shift drag","Pick every device in a box"],["Drag in 3D","Turn the model; scroll to zoom"],["Alt drag","Drag a copy of the furniture picked"],["Drag a number","Change it, with Shift in big steps, with Alt in fine ones; click it to type"]]}]}function Qi(a){switch(a){case"pick":return c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 2.5v11.5l3.1-3 2.3 5 2-.9-2.3-4.9h4.4z" fill="currentColor"></path></svg>`;case"draw":return c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 15V3h8l4 4v8z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2.5 2"></path></svg>`;case"measure":return c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14M2 6v6M16 6v6M6 9v-2M9 9V6M12 9v-2" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`;default:return Jd(a)}}var Sp=[["lights","Lights"],["sensors","Sensors"],["climate","Climate"],["switches","Switches and plugs"],["media","Media"],["covers","Covers"],["locks","Locks"],["other","Other"]],De="*",$n="",er=200;function Ip(a){switch(Za(a)){case"lights":return"lights";case"sensors":return"sensors";case"climate":return"climate";case"power":return"switches";case"media":return"media";case"covers":return"covers";case"security":return a.startsWith("lock.")?"locks":"other";default:return"other"}}function kn(a){let e=a.selection,t=de(e);if(t!==void 0)return a.floor.rooms.find(n=>k(n.id,t));if(e?.kind!=="pin")return;let o=a.floor.pins.find(n=>k(n.id,e.pinId));return o===void 0?void 0:Q(a.floor,o)}function tr(a){return Ke(a.view,[a.stage.width/2,a.stage.height/2])}function Rp(a){return kn(a)??V(a.floor,tr(a))}function Dp(a,e){let t=tr(a);return Z(e.outline,t)?t:Y(e)??ce(e)}function Ap(a,e){return e.trim()===""?a.filter(t=>t.category===void 0&&qa.has(t.domain)):Ya(a,e,1/0)}function Op(a,e){return e===De?!0:e===$n?a.areaId===void 0:a.areaId===e}function Lp(a,e,t,o){let n=new Map,i=new Map(a.areas.map(h=>[h.id,h.name])),r=0;for(let h of e){if(h.areaId===void 0){r+=1;continue}n.set(h.areaId,(n.get(h.areaId)??0)+1),i.has(h.areaId)||i.set(h.areaId,h.areaName??h.areaId)}let s=[],d=(h,m=!1)=>{h===void 0||h===""||s.includes(h)||!m&&(n.get(h)??0)===0||s.push(h)};d(t,!0);for(let h of a.floor.rooms)d(h.areaId);let l=[...n.keys()].sort((h,m)=>(i.get(h)??h).localeCompare(i.get(m)??m));for(let h of l)d(h);o!==De&&d(o,!0);let p=s.map(h=>({id:h,name:i.get(h)??h,count:n.get(h)??0}));return(r>0||o===$n)&&p.push({id:$n,name:"No area",count:r}),p.push({id:De,name:"All areas",count:e.length}),p}function tl(a,e){let t=new Map;for(let o of a){if(!Op(o,e))continue;let n=Ip(o.entityId),i=t.get(n);i===void 0&&t.set(n,i=[]),i.push(o)}return Sp.filter(([o])=>t.has(o)).map(([o,n])=>({kind:o,label:n,devices:t.get(o)}))}function Fp(a,e){if(e.startsWith("light.")){let t=Bo(a,e).length;return t===0?void 0:t===1?"On the map":`${t} on the map`}return Je(a,e)===void 0?void 0:"On the map"}function _p(a){let e=a;e?.focus!==void 0&&setTimeout(()=>e.focus?.(),0)}function zp(a){let e=a;e?.showModal!==void 0&&queueMicrotask(()=>{e.isConnected&&e.open!==!0&&e.showModal?.()})}var xn=class{constructor(e,t){this.devices=e;this.picture=t;this.tab="devices";this.query="";this.area=De;this.areaChosen=!1;this.pieceQuery="";this.pieceGroup="";this.focus=!1}open(e,t="devices",o){this.choice=o,this.tab=o===void 0?t:"devices",this.query="",this.pieceQuery="",this.pieceGroup="",this.roomId=void 0,this.area=o===void 0?kn(e)?.areaId??De:De,this.areaChosen=!1,this.focus=!0}setTab(e,t){this.tab!==t&&(this.tab=t,this.focus=!0,e.redraw())}furnitureRoom(e){let t=Rp(e);if(t!==void 0)return t;let o=this.roomId;return o===void 0?void 0:e.floor.rooms.find(n=>k(n.id,o))}addDevice(e,t,o){let n=this.choice;if(n!==void 0){o(),n.pick(t.entityId);return}let i=kn(e)??Vt(e.floor,t.areaId),r=i===void 0?void 0:this.devices.freeSpot(e,i);t.entityId.startsWith("light.")?this.devices.placeLight(e,t.entityId,r??tr(e)):this.devices.place(e,t.entityId,r,t.areaId),e.redraw()}addPiece(e,t,o){let n=this.furnitureRoom(e);if(n===void 0)return;let i=n.id,r=n.objects.length,s=Dp(e,n);o(),e.apply(d=>pa(d,i,t,s),{select:{kind:"object",roomId:i,object:r}})||e.note("warn","That piece could not be added: a room holds at most 256 things.")}render(e,t){let o=kn(e),n=this.choice,i=n?.title??`Add to ${o===void 0?K(e.floor):T(o)}`,r=this.focus;this.focus=!1;let s=nt(l=>{r&&_p(l)}),d=(l,p)=>c`<button type="button" role="tab" id=${`hma-tab-${l}`} class=${this.tab===l?"on":""}
      aria-selected=${this.tab===l?"true":"false"} aria-controls="hma-panel" @click=${()=>this.setTab(e,l)}>${p}</button>`;return c`<dialog class="hma" aria-labelledby="hma-title" ${nt(zp)}
      @cancel=${l=>{l.preventDefault(),t()}}
      @keydown=${l=>{l.stopPropagation(),l.key==="Escape"&&(l.preventDefault(),t())}}
      @pointerdown=${l=>{l.target===l.currentTarget&&t()}}>
      <div class="hma-in">
        <div class="hma-head">
          <h3 id="hma-title">${i}</h3>
          <button type="button" class="hme-x hma-close" aria-label="Close" title="Close (Esc)" @click=${t}>×</button>
        </div>
        ${n===void 0?c`<div class="hme-seg hma-tabs" role="tablist" aria-label="What to add">${d("devices","Devices")}${d("furniture","Furniture")}</div>`:g}
        <div class="hma-panel" id="hma-panel" role=${n===void 0?"tabpanel":"group"} aria-labelledby=${n===void 0?`hma-tab-${this.tab}`:"hma-title"}>
          ${this.tab==="devices"?this.devicesTab(e,o,t,s):this.furnitureTab(e,t,s)}
        </div>
      </div>
    </dialog>`}devicesTab(e,t,o,n){let i=e.hass?.states,r=this.choice,s=Qe(e.hass),d=r===void 0?s:s.filter($=>(!r.lightsOnly||$.domain==="light")&&$.entityId!==r.now),l=Ap(d,this.query);!this.areaChosen&&this.area!==De&&tl(l,this.area).every($=>$.devices.length===0)&&(this.area=De);let p=Lp(e,l,t?.areaId,this.area),h=tl(l,this.area),m=h.reduce(($,y)=>$+y.devices.length,0),u=er,b=h.map($=>{let y=$.devices.slice(0,Math.max(u,0));return u-=y.length,{...$,devices:y}}).filter($=>$.devices.length>0),f=this.area===De?"in any area":this.area===$n?"with no area":`in ${p.find($=>$.id===this.area)?.name??"this area"}`,w=this.query.trim()!=="",v=r?.lightsOnly===!0?"light":"device",M=Ui();return c`
      ${r===void 0?c`<div class="hma-lamp"><span>Lights go in</span>${Me({label:"Lights go in",value:M,options:gt.map($=>({value:$,label:Ld[$]})),set:$=>{Wi($),e.redraw()}})}</div>`:g}
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find a ${v}" aria-label="Find a ${v}" autofocus .value=${q(this.query)} ${n}
          @input=${$=>{this.query=$.target.value,e.redraw()}} /></label>
      <div class="hme-chips hma-chips" role="group" aria-label="Areas">
        ${p.map($=>{let y=$.id===this.area;return c`<button type="button" class="hme-chip sel ${y?"on":""}" aria-pressed=${y?"true":"false"}
            @click=${()=>{this.area=$.id,this.areaChosen=!0,e.redraw()}}>${$.name}<span class="hma-n">${$.count}</span></button>`})}
      </div>
      <div class="hma-list">
        ${m===0?c`<p class="hma-empty">${w?`Nothing by that name ${f}.`:`No ${v}s ${f}.`}</p>`:g}
        ${b.map($=>c`<section class="hma-sec">
          <div class="hme-h">${$.label}<span class="hme-h-end">${$.devices.length}</span></div>
          ${$.devices.map(y=>this.deviceRow(e,y,i,o))}
        </section>`)}
        ${m>er?c`<p class="hma-empty">Showing ${er} of ${m}. Type to narrow the list.</p>`:g}
      </div>
      <div class="hma-foot">
        <span class="hma-count">${O(m,v)}</span>
        ${r===void 0?c`<button type="button" class="hme-tb hme-blue hma-done" @click=${o}>Done</button>`:g}
      </div>`}deviceRow(e,t,o,n){let i=t.entityId.startsWith("light."),r=Fp(e.doc,t.entityId),s=this.choice,d=s!==void 0?s.rowTitle(t.name):i?"Add it in a lamp, the kind Lights go in names. A light can be on the map many times.":r===void 0?"Put it on the map":"On the map: click to pick it",l=ye(t.entityId,t.deviceClass,t.name);return c`<button type="button" class="hma-row ${s===void 0&&!i&&r!==void 0?"placed":""}" title=${d}
      @click=${()=>this.addDevice(e,t,n)}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${ae(l,"currentColor",24,2)}</svg></span>
      <span class="hma-nm"><span>${t.name}</span><small class="mono">${t.entityId}</small></span>
      <span class="hma-state">${fe(t.entityId,o)}</span>
      ${r===void 0?g:c`<span class="hma-tag">${r}</span>`}
    </button>`}furnitureTab(e,t,o){let n=this.furnitureRoom(e),i=Di(this.pieceQuery,this.pieceGroup).filter(d=>d.pieces.length>0),r=["",...tt.groups],s=d=>tt.pieces.filter(l=>d===""||l.group===d).length;return c`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find a piece: sofa, lamp, desk" aria-label="Find a piece" autofocus .value=${q(this.pieceQuery)} ${o}
          @input=${d=>{this.pieceQuery=d.target.value,e.redraw()}} /></label>
      <div class="hme-chips hma-chips" role="group" aria-label="Groups">
        ${r.map(d=>{let l=d===this.pieceGroup;return c`<button type="button" class="hme-chip sel ${l?"on":""}" aria-pressed=${l?"true":"false"}
            @click=${()=>{this.pieceGroup=d,e.redraw()}}>${d===""?"All":d}<span class="hma-n">${s(d)}</span></button>`})}
      </div>
      ${n===void 0?this.askRoom(e):c`<p class="hma-where">Into <b>${T(n)}</b>: each piece stands against the nearest free wall, facing into the room. Drag it into place after.</p>`}
      <div class="hma-list">
        ${i.length===0?c`<p class="hma-empty">No piece by that name${this.pieceGroup===""?"":` in ${this.pieceGroup}`}.</p>`:g}
        ${i.map(d=>c`<section class="hma-sec">
          <div class="hme-h">${d.title}<span class="hme-h-end">${O(d.pieces.length,"piece")}</span></div>
          <div class="hma-grid">${d.pieces.map(l=>c`<button type="button" class="hme-fcard" ?disabled=${n===void 0}
            title=${`Add ${l.name}, ${bt(l)}`} @click=${()=>this.addPiece(e,l,t)}>
            ${this.picture(e,l,"hme-fcard-pic")}
            <span class="hme-fcard-name">${l.name}</span>
            <span class="hme-fcard-size mono">${bt(l)}</span>
          </button>`)}</div>
        </section>`)}
      </div>`}askRoom(e){return e.floor.rooms.length===0?c`<p class="hma-where warn">Draw or scan a room first, then add its furniture.</p>`:c`<div class="hma-ask">
      <p class="hma-where warn">Which room is it for? Pick one, or pick a room on the plan first.</p>
      <div class="hme-chips hma-chips" role="group" aria-label="Rooms">
        ${e.floor.rooms.map(t=>c`<button type="button" class="hme-chip sel" aria-pressed="false"
          @click=${()=>{this.roomId=t.id,e.redraw()}}>${T(t)}</button>`)}
      </div>
    </div>`}},ol=bo`
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
`;var jp={iphone:"A full page with the live 3D map.",watch:"A map tile on a page. A tap opens the map."};function Np(a,e){return a===void 0||e===null||e===void 0?!1:a.pages.some(t=>t.owners.length>0&&mt(t.item)&&ko(t.item).some(o=>{let n=ct(o);return Ft(n)==="home_map"&&e.floors.some(i=>k(i.id,xo(n)))}))}function Kp(a,e){return a.floors.length>1?K(e):"Home map"}function Bp(a,e,t,o){let n=e.toUpperCase();if(a==="iphone")return{schemaVersion:1,pages:[fs(n,t,o)]};let i={schemaVersion:1,pages:[Fr(n,t)]};return ds(i,n,{kind:"homeMap",floor:{id:o}},{last:!0}).document}var Hn=class{constructor(e){this.redraw=e;this.owners=[];this.phones=!1;this.busy=new Set;this.added=new Map;this.notes=new Map}follow(e){if(e===void 0)return;let t=us(e),o=this.owners.map(n=>n.owner_watch_id);this.store!==t||this.listening===void 0?(this.listening?.stop(),this.store=t,this.listening=t.listen(()=>this.redraw(),o)):this.listening.update(o)}stop(){this.listening?.stop(),this.listening=void 0}get library(){return this.store?.library}done(e){return Np(this.library,e)}get addedAny(){return this.added.size>0}rows(){return Ar(this.owners,this.phones).map(e=>{let t=e.ownerId.toUpperCase(),o=this.added.get(t),n=this.notes.get(t);return{device:e,line:jp[e.kind],busy:this.busy.has(t),...o===void 0?{}:{added:o},...n===void 0?{}:{note:n}}})}async add(e,t,o,n,i){let r=this.store,s=n.ownerId.toUpperCase();if(e===void 0||r===void 0||this.busy.has(s))return;this.notes.delete(s);let d,l=si(this.owners,this.library,n.ownerId,"pages",p=>(d=p,!1));if(!l.go&&d!==void 0){if(!await i({title:`Add a page to ${n.name}?`,text:d,ok:"Add page"}))return;l=si(this.owners,this.library,n.ownerId,"pages",()=>!0)}if(!l.go){l.note!==void 0&&this.notes.set(s,{kind:"warn",text:`Not added on ${n.name}. ${l.note}`}),this.redraw();return}this.busy.add(s),this.redraw();try{let p=Bp(n.kind,ut(),Kp(t,o),o.id),h=await r.createItem("pages",p);if(!h.ok){this.notes.set(s,{kind:"err",text:`Not added. ${h.text}`});return}let m=await r.pick(n.ownerId,"pages",h.reply.id,!0);if(!m.ok){this.notes.set(s,{kind:"err",text:`Not added on ${n.name}. ${m.text}`});return}this.added.set(s,h.reply.id),await this.sayFreePlan(e,n)}finally{this.busy.delete(s),this.redraw()}}async sayFreePlan(e,t){let o=this.library;if(!(o===void 0||zr(o,t.ownerId,"pages")<2))try{let i=(await pr(e,t.ownerId,"pages")).multiple_pages===!1?Or([t.name]):void 0;i!==void 0&&this.notes.set(t.ownerId.toUpperCase(),{kind:"ok",text:i})}catch{}}};function rl(a){return{get:()=>vo(a),save:(e,t)=>cr(a,e,t)}}var al="The map had changed on another device. Your change was saved on top of it.",Wp="The map changed on another device, and your change no longer fits it. It now shows the map as saved there.",Up="The map changed again while saving, so your change was not saved. Try it once more.",uo="Not saved yet. Trying again.",Gp=2e4;function Pn(){return{v:kr,floors:[]}}var Vp=new Set(["unavailable","timeout"]);function or(a){let e=Ge(a).code;return e===void 0||Vp.has(e)}function nl(a,e){let{code:t,message:o}=Ge(a);switch(console.warn(`Home map: Home Assistant refused the save (${t??"no code"}): ${o}`),t){case"invalid":{let{path:n,problem:i}=xr(o);return`Not saved. ${$r(e,n,i)}`}case"too_large":return"Not saved. The map is too big to save. Take out some rooms or things.";case"conflict":return Up;case"unauthorized":return"Not saved. Home Assistant did not let this login save the map. Sign in again and try once more.";case"invalid_format":return"Not saved. Home Assistant could not read the map sent. Reload the page and try again.";case"unknown_command":return"Not saved. Update the HouseLit integration to save the map here.";case"unavailable":case"timeout":return"Not saved. Home Assistant could not be reached. Try again in a moment.";default:return"Not saved. Home Assistant did not take the change. Try again."}}function ir(a){let{code:e,message:t}=Ge(a);switch(console.warn(`Home map: the map could not be read (${e??"no code"}): ${t}`),e){case"unauthorized":return"Home Assistant did not let this login read it. Sign in again.";case"unavailable":return"HouseLit is still starting. Try again in a moment.";case void 0:return"Home Assistant could not be reached. Check the connection and try again.";default:return"Home Assistant could not send it. Try again."}}function qp(a){return{doc:Lt(a?.doc)??null,rev:typeof a?.rev=="number"?a.rev:0}}function En(a){return Array.isArray(a)?`[${a.map(En).join(",")}]`:typeof a=="object"&&a!==null?`{${Object.entries(a).filter(([,t])=>t!==void 0).sort(([t],[o])=>t<o?-1:t>o?1:0).map(([t,o])=>`${JSON.stringify(t)}:${En(o)}`).join(",")}}`:JSON.stringify(a)}function Cn(a,e){return a===e?!0:a==null||e==null?!1:En(a)===En(e)}function nr(a){let e,t=new Promise((o,n)=>{e=setTimeout(()=>n({code:"timeout",message:"Home Assistant did not answer."}),Gp)});return Promise.race([a,t]).finally(()=>clearTimeout(e))}function il(a,e){let t=typeof e=="function"?e(a):Sr(a,e);if(t===void 0)return;let o=Ot(t);return o.ok?{doc:o.doc}:(console.warn(`Home map: not saved, as the store would refuse it: ${o.message}`),{text:`Not saved. ${o.text}`})}async function sl(a,e,t,o){let n=il(e.doc??Pn(),t);if(n===void 0)return{ok:!1,text:"That is no longer on the map."};if("text"in n)return{ok:!1,text:n.text};try{let s=await nr(a.save(n.doc,e.rev));return{ok:!0,read:{doc:n.doc,rev:s.rev},merged:!1}}catch(s){if(or(s))return{ok:!1,retry:!0,text:uo,sent:n.doc};if(Ge(s).code!=="conflict")return{ok:!1,text:nl(s,n.doc)}}let i;try{i=qp(await nr(a.get()))}catch(s){return or(s)?{ok:!1,retry:!0,text:uo,sent:o??n.doc}:{ok:!1,text:`Not saved. The map changed on another device and could not be read again. ${ir(s)}`}}for(let s of[o,n.doc])if(s!==void 0&&i.doc!==null&&Cn(i.doc,s))return{ok:!0,read:{doc:i.doc,rev:i.rev},merged:!1};let r=il(i.doc??Pn(),t);if(r===void 0)return{ok:!1,text:Wp,read:i};if("text"in r)return{ok:!1,text:r.text,read:i};try{let s=await nr(a.save(r.doc,i.rev));return{ok:!0,read:{doc:r.doc,rev:s.rev},merged:!0}}catch(s){return or(s)?{ok:!1,retry:!0,text:uo,sent:r.doc}:{ok:!1,text:nl(s,r.doc),read:i}}}function Xp(a){return Math.min(3e4,1e3*2**Math.max(0,a-1))}var rr=new Set;function ll(){for(let a of rr)if(a.busy)return!0;return!1}function dl(a,e){return t=>Cn(t,a)?e:void 0}function Yp(a){return a.length===1?a[0]:e=>a.reduce((t,o)=>t===void 0?void 0:o(t),e)}var Tn=class{constructor(e,t,o=()=>{},n=()=>{},i){this.api=e;this.changed=o;this.saved=n;this.state={kind:"saved"};this.queue=[];this.failures=0;this.confirmed=t,this.doc=t.doc,this.history=new ja(i)}get busy(){return this.queue.length>0||this.pending!==void 0||this.running!==void 0}get canUndo(){return this.doc!==null&&this.history.canUndo}get canRedo(){return this.doc!==null&&this.history.canRedo}load(e){return this.busy?!1:(this.confirmed=e,this.doc=e.doc,this.history.clear(),this.changed(),!0)}apply(e){let t=this.doc;if(t===null)return!1;let o=this.checked(e(t));return o===void 0?!1:(this.history.push(t),this.doc=o,this.enqueue(e),!0)}begin(e){let t=this.doc??Pn();if(t.floors.length>0)return!1;let o=this.checked(e(t));return o===void 0?!1:(this.doc=o,this.enqueue(e),!0)}undo(){let e=this.doc;if(e===null)return!1;let t=this.history.undo(e);return t===void 0?!1:(this.doc=t,this.enqueue(dl(e,t)),!0)}redo(){let e=this.doc;if(e===null)return!1;let t=this.history.redo(e);return t===void 0?!1:(this.doc=t,this.enqueue(dl(e,t)),!0)}retryNow(){this.wake?.()}async idle(){for(;this.running!==void 0;)await this.running}dismissNote(){this.note=void 0,this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed()}checked(e){if(e===void 0)return;let t=Ot(e);if(!t.ok){console.warn(`Home map: an edit was not made, as the store would refuse it: ${t.message}`),this.note={kind:"err",text:t.text},this.changed();return}return t.doc}enqueue(e){this.queue.push(e),rr.add(this),this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed(),this.kick()}kick(){this.running===void 0&&(this.running=this.run().finally(()=>{this.running=void 0,this.queue.length>0||this.pending!==void 0?this.kick():(rr.delete(this),this.changed())}))}pause(e){return new Promise(t=>{let o=setTimeout(i,e),n=this;function i(){clearTimeout(o),n.wake===i&&(n.wake=void 0),t()}this.wake=i})}async run(){for(;this.pending!==void 0||this.queue.length>0;){let e=this.pending??{ops:this.queue.splice(0),sent:void 0};this.pending=void 0,this.state.kind!=="waiting"&&(this.state={kind:"saving"}),this.changed();let t=await sl(this.api,this.confirmed,Yp(e.ops),e.sent);if(t.ok){this.failures=0,this.state={kind:"saving"},this.confirmed=t.read,this.saved(t.read),t.merged?(this.note={kind:"warn",text:al},this.history.clear(),this.doc=this.rebased()):this.queue.length===0&&(this.doc=t.read.doc);continue}if(t.retry===!0){this.pending={ops:e.ops,sent:t.sent??e.sent},this.failures+=1,this.state={kind:"waiting",text:uo},this.changed(),await this.pause(Xp(this.failures));continue}this.failures=0,this.queue=[],this.history.clear(),t.read!==void 0&&(this.confirmed=t.read,this.saved(t.read)),this.doc=this.confirmed.doc,this.note={kind:"err",text:t.text},this.state={kind:"error",text:t.text},this.changed();return}this.state={kind:"saved"}}rebased(){let e=this.confirmed.doc;if(e===null)return null;let t=[];for(let o of this.queue){let n=o(e);if(n===void 0)continue;let i=Ot(n);i.ok&&(e=i.doc,t.push(o))}return this.queue=t,e}};var pl=bo`
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
`;var fo={plan:{title:"Plan",hint:"The floor from above, with real floors, walls and pools of light."},night:{title:"Night",hint:"A small model at night. Lit rooms glow warm."},warm:{title:"Warm",hint:"Wood floors and cream walls, like a doll house."},lines:{title:"Lines",hint:"Only the lines. Calm and clean."},clay:{title:"Clay",hint:"A soft light model, for light pages."},blueprint:{title:"Blueprint",hint:"White lines on blue paper."},dots:{title:"Dots",hint:"A quiet plan with a dot for each light."}};function Zp(a,e){if(!Uo(a))return"Home style";let t=Jn(a,e),o=i=>Object.hasOwn(a,La[i]),n=[];return o("look")&&n.push(fo[t.look].title),o("turn")&&n.push(`turned ${t.turn}\xB0`),o("names")&&n.push(t.names?"room names":"no room names"),o("devices")&&n.push(t.devices==="all"?"every device":t.devices==="none"?"no devices":"lights only"),o("furniture")&&n.push(t.furniture?"furniture":"no furniture"),o("glow")&&n.push(t.glow?"glow":"no glow"),`Own look: ${n.join(", ")}`}var hl=(a,e)=>typeof a=="number"&&Number.isFinite(a)?a:e;function Qp(a,e){let t=Lr(a);return ko(a).flatMap(o=>{if(Ft(ct(o))!=="home_map")return[];let n=o,i=xo(ct(o)),r=e?.floors.find(m=>k(m.id,i)),s=typeof n.homeMapRoomId=="string"?n.homeMapRoomId:void 0,d=s===void 0?void 0:r?.rooms.find(m=>k(m.id,s)),l=`${hl(o.colSpan,1)}\xD7${hl(o.rowSpan,1)}`,h=(typeof o.customLabel=="string"&&o.customLabel.trim()!==""?o.customLabel.trim():void 0)??(d?.name?.trim()?`${d.name.trim()} only`:r===void 0||(e?.floors.length??0)<=1?"Home map":K(r));return[{pageId:t,pageName:$o(a),tileId:typeof o.id=="string"?o.id:"",what:h,size:l,own:Uo(n),words:Zp(n,e),look:Jn(n,e).look}]})}function ml(a,e){return Object.values(a?.pages??{}).map(o=>o?.item).filter(o=>mt(o)).sort((o,n)=>$o(o).localeCompare($o(n))).flatMap(o=>Qp(o,e))}function cl(a){let e=!1;if(!Array.isArray(a.pages))return;let t=a.pages.map(o=>{if(!mt(o)||!Array.isArray(o.items))return o;let n=o.items.map(i=>!mt(i)||Ft(ct(i))!=="home_map"||!Uo(i)?i:(e=!0,za(i)));return{...o,items:n}});return e?{...a,pages:t}:void 0}var Sn={width:112,height:68},Jp={width:94,height:94,radius:34},eh={width:188,height:94,radius:22},th=.9,In=class{constructor(){this.usesState="idle";this.busy=!1}style(e){let t=je(e.doc);return this.turnLive===void 0?t:{...t,turn:this.turnLive}}set(e,t){e.apply(o=>Fa(o,t))}panel(e,t){let o=this.style(e),n=e.hass?.states,i=Zt.includes(o.look),r=(s,d,l)=>c`<button type="button" class="hme-chip sel ${d?"on":""}" aria-pressed=${d?"true":"false"} @click=${l}>${s}</button>`;return c`<div class="hme-style-scrim" @pointerdown=${s=>{s.target===s.currentTarget&&t()}}></div>
      <div class="hme-style-pop" role="dialog" aria-label="Home style">
        <header class="hme-style-head">
          <strong>Home style</strong>
          <span>How every map tile looks, unless a tile picks its own</span>
          <button type="button" class="hme-x hme-style-close" aria-label="Close" title="Close (Esc)" @click=${t}>✕</button>
        </header>

        ${A("Look",c`<div class="hme-looks four">
          ${vr.map(s=>{let d=s===o.look,l=Pt({floor:e.floor,states:n,...o,look:s,names:!1,width:Sn.width,height:Sn.height});return c`<button type="button" class="hme-look ${d?"on":""}" aria-pressed=${d?"true":"false"} title=${fo[s].hint}
              @click=${()=>this.set(e,{look:s})}>
              <svg viewBox=${`0 0 ${Sn.width} ${Sn.height}`} style=${`background:${Ne(s,.5)}`} aria-hidden="true">${l}</svg>
              <span>${fo[s].title}</span></button>`})}
        </div>
        <p class="hme-foot">Plan and Dots draw the floor from above. The other five draw it as a small model you can turn.</p>`)}

        <div class="hme-style-row">
          ${A("Show",c`
            <div class="hme-r"><span class="hme-l">Room names</span>${r(o.names?"Shown":"Hidden",o.names,()=>this.set(e,{names:!o.names}))}</div>
            <div class="hme-r"><span class="hme-l">Devices</span><div class="hme-chips">
              ${r("Lights",o.devices==="lights",()=>this.set(e,{devices:"lights"}))}
              ${r("All",o.devices==="all",()=>this.set(e,{devices:"all"}))}
              ${r("None",o.devices==="none",()=>this.set(e,{devices:"none"}))}</div></div>
            <div class="hme-r"><span class="hme-l">Furniture</span>${r(o.furniture?"Shown":"Hidden",o.furniture,()=>this.set(e,{furniture:!o.furniture}))}</div>
            <div class="hme-r"><span class="hme-l">Light glow</span>${r(o.glow?"On":"Off",o.glow,()=>this.set(e,{glow:!o.glow}))}</div>
            <div class="hme-r"><span class="hme-l">Turn</span>
              <input class="hme-range" type="range" min="-180" max="180" step="1" .value=${q(String(o.turn))} ?disabled=${!i} aria-label="Turn the model"
                style=${Fe(o.turn,-180,180)}
                @input=${s=>{this.turnLive=Number(s.target.value),e.redraw()}}
                @change=${s=>{this.turnLive=void 0,this.set(e,{turn:Number(s.target.value)})}} />
              <span class="hme-val mono hme-w48">${i?`${o.turn}\xB0`:"flat"}</span></div>`,void 0,"hme-grow-card")}
          ${A("Preview",c`<div class="hme-style-tiles">
            ${this.face(e,o,Jp,"Watch tile 2 \xD7 2")}
            ${this.face(e,o,eh,"iPhone tile 4 \xD7 2")}
          </div>`,fo[o.look].title,"hme-grow-card")}
        </div>

        ${this.usesCard(e)}
      </div>`}face(e,t,o,n){let i=th,r=e.hass?.states,s=vs(o.width,o.height),d=Pt({floor:e.floor,states:r,...t,width:s.width,height:s.height,tileHeight:o.height,icons:e.icons}),l=yo(e.floor,r),p=6*i;return c`<figure class="hme-fr">
      <div class="hme-face" style=${`width:${o.width*i}px;height:${o.height*i}px;border-radius:${o.radius*i}px;background:${Ne(t.look,i)}`}>
        <svg viewBox=${`0 0 ${s.width} ${s.height}`} aria-hidden="true"
          style=${`left:${s.x*i}px;top:${s.y*i}px;width:${s.width*i}px;height:${s.height*i}px`}>${d}</svg>
        ${o.height>90?c`<span class="hme-face-title" style=${`left:${p}px;top:${p}px;font-size:${11*i}px;color:${gs(t.look)}`}>${oh(e.floor)}</span>`:g}
        <span class="hme-face-words" style=${`left:${p}px;bottom:${p}px;font-size:${10*i}px;color:${bs(t.look,l>0)}`}>${Mo(l)}</span>
      </div>
      <figcaption>${n}</figcaption>
    </figure>`}leave(){this.turnLive=void 0,this.usesState="idle",this.message=void 0}look(e){return je(e.doc).look}loadUses(e){let t=e.hass;this.usesState!=="idle"||t===void 0||(this.usesState="loading",hs(t).then(o=>{this.summary=o,this.usesState="done",e.redraw()},()=>{this.usesState="error",e.redraw()}))}usesCard(e){if(this.loadUses(e),this.usesState!=="done")return A("Used on",c`<p class="hme-text dim">${this.usesState==="error"?"Could not read your pages.":"Reading your pages\u2026"}</p>`);let t=ml(this.summary,e.doc),o=t.filter(n=>n.own);return A(`Used on ${O(t.length,"tile")}`,c`
      ${t.length===0?c`<p class="hme-text dim">No page has a Home map tile yet. Add one from a page's Add tile.</p>`:g}
      ${t.map(n=>this.useRow(e,n))}
      ${o.length===0?g:c`<button type="button" class="hme-tb hme-wide" ?disabled=${this.busy}
        @click=${()=>{this.useHomeStyleOnAll(e,o)}}>${this.busy?"Saving\u2026":`Use the home style on all ${o.length}`}</button>`}
      ${this.message===void 0?g:c`<p class="hme-text dim" role="status">${this.message}</p>`}`)}useRow(e,t){return c`<div class="hme-use">
      <i style=${`background:${Ne(t.look,.2)}`}></i>
      <div><span>${t.pageName} · ${t.what} ${t.size}</span><small>${t.words}</small></div>
      ${e.openPage===void 0?g:c`<button type="button" class="hme-tb" @click=${()=>e.openPage?.(t.pageId)}>Edit</button>`}
    </div>`}async useHomeStyleOnAll(e,t){let o=e.hass;if(o===void 0||this.busy)return;let n=[...new Set(t.map(s=>s.pageId))];if(!await e.confirm({title:`Use the home style on ${O(t.length,"tile")}?`,text:`Their own looks come off, so each draws the home style. ${n.length===1?"The page is":`The ${n.length} pages are`} saved for every watch and ${ht("iPhone","phone")} that shows ${n.length===1?"it":"them"}.`,ok:"Use the home style"}))return;this.busy=!0,this.message=void 0,e.redraw();let r=0;for(let s of n)try{let d=await ms(o,"pages",s),l=cl(d.document);l!==void 0&&await cs(o,"pages",s,d.revision,l)}catch{r+=1}this.busy=!1,this.message=r===0?"Done: those tiles follow the home style now.":`${O(r,"page")} could not be saved. Try again, or open ${r===1?"it":"them"} to see why.`,this.usesState="idle",e.redraw()}};function oh(a){return a.name.trim()===""?"Home map":a.name.trim()}var nh={dir:[0,1,0],sun:0,sky:0,warm:0},ih=(()=>{let[a,e,t]=[-2,6.5,8],o=Math.hypot(a,e,t);return{dir:[a/o,e/o,t/o],sun:1,sky:1,warm:0}})();function ar(a,e,t){let o=Math.max(0,Math.min(1,(t-a)/(e-a)));return o*o*(3-2*o)}function sr(a){let e=a?.["sun.sun"]?.attributes,t=e?.azimuth,o=e?.elevation;if(!(typeof t!="number"||!Number.isFinite(t)||typeof o!="number"||!Number.isFinite(o)))return{azimuth:t,elevation:o}}function rh(a,e){let t=(a.azimuth+e)*Math.PI/180,o=Math.max(a.elevation,0)*Math.PI/180;return{dir:[Math.cos(o)*Math.sin(t),Math.sin(o),-Math.cos(o)*Math.cos(t)],sun:ar(0,12,a.elevation),sky:ar(-6,10,a.elevation),warm:1-ar(2,25,a.elevation)}}function ul(a,e){let t=a?.north??0,o=a?.floors.reduce((i,r)=>i===void 0||r.story<i.story?r:i,void 0),n=o===void 0||o.id.toUpperCase()===e.id.toUpperCase()?0:e.place?.turn??0;return((t+n)%360+360)%360}function fl(a,e,t){return a==="day"?ih:a==="now"&&e!==void 0?rh(e,t):nh}var ah="Update the HouseLit integration to see the home map here.",sh="No home map yet",dh="Start a map by hand";var lh=4,ph=140;function hh(a){return a.kind==="saving"?"Saving\u2026":a.kind==="waiting"?a.text:a.kind==="error"?"Not saved":"Saved"}typeof window<"u"&&window.addEventListener("beforeunload",a=>{ll()&&(a.preventDefault(),a.returnValue="")});var gl={night:"Night",warm:"Warm",lines:"Lines",clay:"Clay",blueprint:"Blueprint"},bl={now:"Now",night:"Lights",day:"Daylight"},R=class extends lr{constructor(){super(...arguments);this.narrow=!1;this.icons=void 0;this.iconsTick=0;this.capable=!1;this.bundleUrl=void 0;this.onHome=void 0;this.onOpenPage=void 0;this.owners=[];this.phones=!1;this.unsupported=!1;this.loading=!1;this.styleOpen=!1;this.viewKind="both";this.splitStack=!1;this.split=Os();this.tipsShown=Fs();this.artScale=0;this.stageSize={width:0,height:0};this.toggles={snap:!0,grid:!1,measure:!1,live:!0,scan:!1};this.measure={};this.floorMenu=!1;this.model3d=!0;this.skyChoice="now";this.spaceHeld=!1;this.tick=0;this.page=new Mn;this.stylePanel=new In;this.pageStep=new Hn(()=>{this.tick++});this.addDialog=new xn(this.page.devices,(t,o,n)=>this.page.arrange.piecePic(t,o,n));this.loadSeq=0;this.askedOnce=!1;this.needFit=!0;this.userMoved=!1;this.touches=new Map;this.artKey="";this.artHeld=g;this.loading3d=!1;this.quality3d=as();this.slow3d=!1;this.lost3d=!1;this.keysOpen=!1;this.checking=!1;this.onReconnect=()=>{this.session?.retryNow(),this.recheck()};this.onVisible=()=>{typeof document<"u"&&document.visibilityState!=="visible"||(this.session?.retryNow(),this.recheck())};this.onKey=t=>{if(this.dialog!==void 0||this.addOpen!==void 0||this.session===void 0||this.renderRoot?.querySelector?.(".hme-sheet")!=null)return;let o=(typeof t.composedPath=="function"?t.composedPath()[0]:void 0)??t.target;if(hi(o))return;let n=te(t,!1);if(this.keysOpen){(t.key==="Escape"||n==="help")&&(t.preventDefault?.(),this.closeKeys());return}if(n==="undo"||n==="redo"){t.preventDefault?.(),n==="undo"?this.undo():this.redo();return}if(this.styleOpen){t.key==="Escape"&&this.closeStyle();return}if(Cs(o))return;if(n==="help"){t.preventDefault?.(),this.openKeys();return}if(this.dockMenu!==void 0&&t.key==="Escape"){this.dockMenu=void 0;return}if(t.key===" "&&!t.repeat){this.spaceHeld=!0,t.preventDefault?.();return}if(typeof n=="object"&&"letter"in n&&n.letter==="a"&&!this.page.devices.choosing){t.preventDefault?.(),this.openAdd();return}if(typeof n=="object"&&"letter"in n&&n.letter==="z"&&this.viewKind!=="model"){t.preventDefault?.(),this.fitPicked();return}let i=this.context(),r=n==="copy"||n==="paste"||n==="duplicate";if(i!==void 0&&(this.viewKind!=="model"||r)&&this.page.keyDown?.(i,t)===!0){t.preventDefault?.();return}switch(n){case"cancel":this.floorMenu?this.floorMenu=!1:this.toggles.measure?this.setToggle("measure",!1):this.selection=void 0;return;case"zoomIn":this.zoomBy(Jt);return;case"zoomOut":this.zoomBy(1/Jt);return;case"fit":this.fit();return}};this.onKeyUp=t=>{t.key===" "&&(this.spaceHeld=!1)}}homeDevices(){let t=this.hass,o=[t?.states,t?.entities,t?.devices,t?.areas],n=this.devicesHeld;if(n!==void 0&&n.key.every((r,s)=>r===o[s]))return n.list;let i=Qe(t);return this.devicesHeld={key:o,list:i},i}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKey),window.addEventListener("keyup",this.onKeyUp),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.askedOnce&&(this.load(!0),this.listen())}disconnectedCallback(){super.disconnectedCallback(),this.pageStep.stop(),window.removeEventListener("keydown",this.onKey),window.removeEventListener("keyup",this.onKeyUp),typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.stopListening(),this.endDrag?.(),this.observer?.disconnect(),this.observed=void 0,this.zoomTimer!==void 0&&clearTimeout(this.zoomTimer),this.loadSeq++,this.drop3d()}willUpdate(t){this.hass&&this.capable&&!this.askedOnce&&(this.askedOnce=!0,this.load()),this.askedOnce&&this.listen(),this.pageStep.owners=this.owners,this.pageStep.phones=this.phones,this.askedOnce&&this.pageStep.follow(this.hass);let o=this.baseFloor();this.needFit&&o!==void 0&&this.stageSize.width>0&&this.fit()}updated(){let t=this.renderRoot.querySelector?.(".hme-dialog");t instanceof Element&&t!==this.focusedDialog?(this.focusedDialog=t,(t.querySelector("input")??t.querySelector(".primary"))?.focus?.(),t.querySelector("input")?.select?.()):t===null&&(this.focusedDialog=void 0);let o=this.renderRoot.querySelector?.(".hme-stage");o instanceof Element&&o!==this.observed&&typeof ResizeObserver<"u"&&(this.observer??=new ResizeObserver(n=>{let i=n[n.length-1]?.contentRect;i!==void 0&&this.resizeStage(i.width,i.height)}),this.observed!==void 0&&this.observer.unobserve(this.observed),this.observer.observe(o),this.observed=o),this.syncSplit(),this.view!==void 0&&this.view.scale!==this.artScale&&this.zoomTimer===void 0&&(this.zoomTimer=setTimeout(()=>{this.zoomTimer=void 0,this.view!==void 0&&(this.artScale=this.view.scale)},ph)),this.sync3d()}input3d(){let t=this.shownFloor();if(t===void 0)return;let o=this.selection,n=Se(o),i=de(o),r=n.length>0?{things:n}:o?.kind==="wall"||o?.kind==="opening"?{piece:o}:i===void 0?void 0:{roomId:i},s=sr(this.hass?.states),d=ul(this.doc===null?null:{...this.doc,north:this.northLive??this.doc.north},t);return{floor:t,states:this.toggles.live?this.hass?.states:void 0,mark:r,sky:fl(this.skyChoiceNow(s),s,d)}}syncSplit(){if(this.viewKind!=="both")return;let t=this.renderRoot.querySelector?.(".hme-stage-wrap"),o=this.baseFloor(),n=o===void 0?void 0:_e(o.rooms.flatMap(s=>s.outline));if(!(t instanceof Element)||n===void 0)return;let i=t.getBoundingClientRect(),r=zs(i.width,i.height,n.maxX-n.minX,n.maxY-n.minY);r!==this.splitStack&&(this.splitStack=r)}sync3d(){let t=this.renderRoot.querySelector?.(".hme-3d-host"),o=this.input3d();if(!(t instanceof HTMLElement)||o===void 0||this.bundleUrl===void 0){this.drop3d();return}if(this.scene3d!==void 0){this.scene3d.attach(t),this.scene3d.update(o,this.modelTurnNow()),this.scene3d.setHover(this.hoverFor3d()),this.view3d!==void 0&&(this.scene3d.setView(this.view3d),this.view3d=void 0);return}if(this.loading3d||this.failed3d!==void 0)return;this.loading3d=!0;let n=Ci(this.bundleUrl);dn().then(i=>{if(this.loading3d=!1,!!this.isConnected){try{if(this.scene3d===void 0){let r=this.quality3dNow(),s=new i.HomeMapScene3D(n,r,this.quality3d==="auto"&&r==="high");s.onPick=(d,l)=>this.pick3d(d,l),s.onHover=d=>this.hover3d(d),s.onFaceDrag=d=>{let l=this.context();l!==void 0&&this.page.shape.faceDrag(l,d),this.tick++},s.onContextLost=()=>{this.lost3d=!0},s.onContextRestored=()=>this.restart3d(),s.onSlow=()=>{this.slow3d=!0,this.quality3d==="auto"&&this.scene3d?.setQuality(this.quality3dNow()),this.tick++},this.scene3d=s}}catch{this.failed3d="webgl"}this.tick++}},()=>{this.loading3d=!1,this.failed3d="load",this.tick++})}quality3dNow(){return is(this.quality3d,rs(this.slow3d))}setQuality3d(t){this.quality3d=t,ss(t),this.scene3d?.setQuality(this.quality3dNow())}restart3d(){this.scene3d!==void 0&&(this.view3d=this.scene3d.view()),this.drop3d(),this.lost3d=!1,this.tick++}pick3d(t,o={add:!1}){if(this.dialog!==void 0)return;this.floorMenu=!1;let n=this.baseFloor(),i=t?.kind==="pin"&&n!==void 0?ve(n,t.pinId):void 0,r=i===void 0?t:{kind:"object",roomId:i.roomId,object:i.object};if(o.add){r?.kind==="object"?this.select(it(this.selection,{roomId:r.roomId,object:r.object})):r?.kind==="pin"&&this.select(Ht(this.selection,r.pinId));return}let s=this.context();if(s!==void 0){if(r?.kind==="opening"&&this.page.doors.pickDoor(s,r.roomId,r.opening))return;this.page.doors.stop(s)}this.select(r),r?.kind==="opening"&&s!==void 0&&this.page.doors.clicked(this.context()??s,r.roomId,r.opening)}drop3d(){this.scene3d?.dispose(),this.scene3d=void 0,this.lost3d=!1}setHover(t){Et(t,this.hover)||(this.hover=t)}hover3d(t){if(this.dialog!==void 0){this.setHover(void 0);return}this.setHover(t?.kind==="pin"?Zo(this.baseFloor(),{kind:"pin",pinId:t.pinId}):t)}hoverFor3d(){let t=$i(this.hover,this.selection);if(t!==void 0)return t.kind==="pin"?{kind:"pin",pinId:t.pinId}:t.kind==="object"?{kind:"object",roomId:t.roomId,object:t.object}:t.kind==="wall"?{kind:"wall",roomId:t.roomId,wall:t.wall}:t.kind==="opening"?{kind:"opening",roomId:t.roomId,opening:t.opening}:t.kind==="room"?{kind:"room",roomId:t.roomId}:void 0}planHoverAt(t,o,n){if(o.pointerType==="touch"||this.spaceHeld||this.dialog!==void 0||this.page.tool(t)!=="pick"||this.page.devices.choosing)return;let i=o.target;if(!(typeof i?.closest=="function"&&i.closest("[data-hme=turn], [data-hme=resize], [data-hme^=corner], [data-hme^=mid], [data-hme^=end]")!==null))return Ys(t.floor,t.toScreen,n,de(t.selection))}turnBack(){this.modelTurn=void 0,this.scene3d?.frameFloor(je(this.doc).turn??di)}async load(t=!1){let o=this.hass;if(!o||!this.capable)return;let n=++this.loadSeq;t||(this.loading=this.session===void 0,this.loadError=void 0);try{let i=await vo(o);if(n!==this.loadSeq)return;this.unsupported=!1,this.loadError=void 0,this.show({doc:Lt(i?.doc)??null,rev:typeof i?.rev=="number"?i.rev:0}),this.loadScans()}catch(i){if(n!==this.loadSeq)return;let{code:r}=Ge(i);r==="unknown_command"?this.unsupported=!0:(!t||this.session===void 0)&&(this.loadError=ir(i))}this.loading=!1}async loadScans(){let t=this.hass;if(t)try{this.scans=await Rr(t)}catch{}}libraryPages(){let t=this.pageStep.library;return t===void 0?[]:(this.pagesHeld?.lib!==t&&(this.pagesHeld={lib:t,pages:_r(t,"pages").map(o=>({id:o.id,name:o.name}))}),this.pagesHeld.pages)}show(t){let o=this.hass;if(o&&Dn(o,t),this.session===void 0)this.session=new Tn(rl(this.hassOrThrow()),t,()=>{this.afterChange(),this.catchUp()},n=>{this.hass&&Dn(this.hass,n)}),this.needFit=!0;else if(!this.session.load(t))return;this.afterChange()}listen(){let t=this.hass,o=t?.connection;if(t===void 0||o===void 0||!this.capable||!this.isConnected||o===this.listenedTo)return;this.stopListening(),this.listenedTo=o;let n=o;typeof n.addEventListener=="function"&&(n.addEventListener("ready",this.onReconnect),this.readyConnection=n),typeof o.subscribeMessage=="function"&&(this.unsubscribe=mr(t,i=>this.heard(i)).catch(()=>{}))}stopListening(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0,this.listenedTo=void 0;let t=this.unsubscribe;this.unsubscribe=void 0,t?.then(o=>o?.()).catch(()=>{})}heard(t){this.heardRev=t,this.catchUp()}catchUp(){let t=this.session,o=this.heardRev;if(!(t===void 0||o===void 0||t.busy||this.checking)){if(o===t.confirmed.rev){this.heardRev=void 0;return}this.recheck()}}async recheck(){let t=this.hass,o=this.session;if(t===void 0||o===void 0||!this.capable||o.busy||this.checking)return;this.checking=!0;let n=this.heardRev,i=!1;try{let r=await hr(t,o.confirmed.rev);i=!0,r!==void 0&&this.session===o&&!o.busy&&(this.previewDoc=void 0,this.show({doc:Lt(r.doc)??null,rev:typeof r.rev=="number"?r.rev:0}),this.loadScans())}catch{}finally{this.checking=!1}i&&(this.heardRev===n?this.heardRev=void 0:this.catchUp())}hassOrThrow(){let t=this.hass;if(t===void 0)throw new Error("no hass");return t}afterChange(){let t=this.session?.doc?.floors??[];t.some(o=>k(o.id,this.floorId))||(this.floorId=t[0]?.id,this.needFit=!0),li(this.baseFloor(),this.selection)||(this.selection=void 0),li(this.baseFloor(),this.hover)||(this.hover=void 0),this.tick++}get doc(){return this.session?.doc??null}baseFloor(){let t=this.doc?.floors??[];return t.find(o=>k(o.id,this.floorId))??t[0]}shownFloor(){let t=this.baseFloor();return t===void 0||this.previewDoc===void 0?t:this.previewDoc.floors.find(o=>k(o.id,t.id))??t}apply(t,o={}){let n=this.session;return n===void 0?!1:(this.previewDoc=void 0,n.apply(t)?(o.floorId!==void 0&&(this.floorId=o.floorId),o.select!==void 0&&(this.selection=Zo(this.baseFloor(),o.select??void 0)),this.afterChange(),!0):(this.tick++,!1))}preview(t){let o=this.doc;this.previewDoc=t===void 0||o===null?void 0:t(o)??this.previewDoc,this.tick++}undo(){this.previewDoc=void 0,this.session?.undo()===!0&&this.afterChange()}redo(){this.previewDoc=void 0,this.session?.redo()===!0&&this.afterChange()}select(t){this.selection=Zo(this.baseFloor(),t)}setFloor(t){let o=this.context();o!==void 0&&this.page.leave?.(o),this.floorId=t,this.selection=void 0,this.floorMenu=!1,this.measure={},this.needFit=!0,this.userMoved=!1}setToggle(t,o){this.toggles={...this.toggles,[t]:o},t==="measure"&&(this.measure={}),t==="scan"&&o&&this.loadScans()}confirm(t){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(o=>{this.dialog={kind:"confirm",...t,done:n=>{this.dialog=void 0,o(n)}}})}ask(t){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(o=>{this.dialog={kind:"ask",...t,done:n=>{this.dialog=void 0,o(n)}}})}resizeStage(t,o){let n=this.stageSize.width===0;this.stageSize={width:t,height:o},(n||!this.userMoved)&&(this.needFit=!0)}fit(){let{width:t,height:o}=this.stageSize;t<=0||(this.view=Qo(this.baseFloor(),t,o),this.artScale=this.view.scale,this.needFit=!1,this.userMoved=!1)}fitPicked(){let{width:t,height:o}=this.stageSize,n=this.baseFloor();if(t<=0||n===void 0)return;let i=Qt(n,this.selection);i.length!==0&&(this.view=Qo({...n,rooms:i,pins:[]},t,o),this.artScale=this.view.scale,this.needFit=!1,this.userMoved=!0)}zoomBy(t,o){this.view!==void 0&&(this.view=pi(this.view,t,o??[this.stageSize.width/2,this.stageSize.height/2]),this.userMoved=!0)}context(){let t=this.doc,o=this.shownFloor();if(t===null||o===void 0)return;let n=this.view??{scale:40,ox:0,oy:0},i=this.session;return{hass:this.hass,icons:this.icons,doc:t,floor:o,selection:this.selection,view:n,stage:this.stageSize,toggles:this.toggles,pages:this.libraryPages(),areas:Ir(this.hass),scans:this.scans,furnitureBase:this.bundleUrl===void 0?void 0:Ci(this.bundleUrl),canUndo:i?.canUndo??!1,canRedo:i?.canRedo??!1,toScreen:r=>xs(n,r),px:r=>r*n.scale,toPlan:(r,s)=>this.toPlan(r,s),apply:(r,s)=>this.apply(r,s),preview:r=>this.preview(r),select:r=>this.select(r),setFloor:r=>this.setFloor(r),setToggle:(r,s)=>this.setToggle(r,s),drag:(r,s)=>this.drag(r,s),undo:()=>this.undo(),redo:()=>this.redo(),confirm:r=>this.confirm(r),ask:r=>this.ask(r),newId:()=>ut(),note:(r,s)=>{this.session!==void 0&&(this.session.note={kind:r,text:s}),this.tick++},redraw:()=>{this.tick++},hover:this.hover,setHover:r=>this.setHover(r),openAdd:(r,s)=>this.openAdd(r,s),openPage:this.onOpenPage,devices:this.homeDevices(),pageStep:this.pageStep,roomNameBoxes:()=>this.labelsHeld?.taken??[]}}openAdd(t="devices",o){let n=this.context();n!==void 0&&(this.floorMenu=!1,this.styleOpen&&this.closeStyle(),this.addDialog.open(n,t,o),this.addOpen=t)}closeAdd(){this.addOpen!==void 0&&(this.addOpen=void 0,this.updateComplete.then(()=>{this.renderRoot?.querySelector?.(".hme-add-btn")?.focus?.()}))}toPlan(t,o){let n=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return Ke(this.view??{scale:40,ox:0,oy:0},[t-n.left,o-n.top])}stagePoint(t){let o=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return[t.clientX-o.left,t.clientY-o.top]}drag(t,o){let n=this.stageEl;if(n===void 0)return;this.endDrag?.();let i=t.clientX,r=t.clientY,s=!1,d,l=0,p=typeof requestAnimationFrame=="function"?requestAnimationFrame:void 0,h=()=>{l=0,d!==void 0&&o.move(this.toPlan(d.clientX,d.clientY),d)};try{n.setPointerCapture?.(t.pointerId)}catch{}let m=w=>{let v=w;v.pointerId===t.pointerId&&(!s&&Math.hypot(v.clientX-i,v.clientY-r)<lh||(s=!0,d=v,p===void 0?h():l===0&&(l=p(h))))},u=w=>{let v=w;v.pointerId===t.pointerId&&(b(),l!==0&&(cancelAnimationFrame(l),h()),o.end(this.toPlan(v.clientX,v.clientY),v,s))},b=()=>{n.removeEventListener("pointermove",m),n.removeEventListener("pointerup",u),n.removeEventListener("pointercancel",u);try{n.releasePointerCapture?.(t.pointerId)}catch{}this.endDrag===f&&(this.endDrag=void 0)},f=()=>{b(),l!==0&&(cancelAnimationFrame(l),l=0),o.cancel?.()};n.addEventListener("pointermove",m),n.addEventListener("pointerup",u),n.addEventListener("pointercancel",u),this.endDrag=f}onStageDown(t){if(this.stageEl=t.currentTarget,this.floorMenu=!1,this.dockMenu=void 0,this.setHover(void 0),this.dialog!==void 0)return;if(t.pointerType==="touch"&&(this.touches.set(t.pointerId,[t.clientX,t.clientY]),this.touches.size===2)){this.endDrag?.(),this.preview(void 0),this.pinch();return}if(this.viewKind==="model"){this.turnModel(t);return}if(t.button===1||this.spaceHeld){t.preventDefault?.(),this.pan(t,!1);return}if(t.button!==0)return;let o=this.context();if(o===void 0)return;if(this.toggles.measure){let i=this.toPlan(t.clientX,t.clientY),r=this.measure;this.measure=r.a===void 0||r.b!==void 0?{a:i}:{a:r.a,b:i};return}let n=this.toPlan(t.clientX,t.clientY);if(this.page.pointerDown?.(o,t,n)===!0){t.preventDefault?.();return}this.pan(t,!0)}onStageMove(t){if(this.stageEl=t.currentTarget,this.touches.has(t.pointerId)&&this.touches.set(t.pointerId,[t.clientX,t.clientY]),t.buttons!==0||this.viewKind==="model"){this.setHover(void 0);return}let o=this.toPlan(t.clientX,t.clientY);this.toggles.measure&&this.measure.a!==void 0&&this.measure.b===void 0&&(this.measure={...this.measure,hover:o});let n=this.context();n!==void 0&&(this.page.hover?.(n,o),this.setHover(this.planHoverAt(n,t,o)))}onStageLeave(){this.setHover(void 0);let t=this.context();t!==void 0&&this.page.hover?.(t,void 0)}onStageUp(t){this.touches.delete(t.pointerId)}onStageDrag(t){this.stageEl=t.currentTarget;let o=this.context();o===void 0||this.viewKind==="model"||this.dialog!==void 0||this.page.dragOver?.(o,this.toPlan(t.clientX,t.clientY),t)===!0&&(t.preventDefault?.(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"))}onStageDragLeave(t){let o=t.relatedTarget,n=t.currentTarget;if(o!==null&&n!==null&&typeof n.contains=="function"&&n.contains(o))return;let i=this.context();i!==void 0&&this.page.dragOver?.(i,void 0,t)}onStageDrop(t){this.stageEl=t.currentTarget;let o=this.context();o===void 0||this.viewKind==="model"||(t.preventDefault?.(),this.page.drop?.(o,this.toPlan(t.clientX,t.clientY),t))}pan(t,o){let n=this.view;if(n===void 0)return;let i=t.clientX,r=t.clientY;this.drag(t,{move:(s,d)=>{this.view={...n,ox:n.ox+d.clientX-i,oy:n.oy+d.clientY-r},this.userMoved=!0},end:(s,d,l)=>{!l&&o&&(this.selection=void 0)}})}pinch(){let t=this.stageEl,o=this.view,n=[...this.touches.keys()];if(t===void 0||o===void 0||n.length<2)return;let i=()=>n.map(u=>this.touches.get(u)),[r,s]=i(),d=Math.max(Math.hypot(s[0]-r[0],s[1]-r[1]),1),l=t.getBoundingClientRect(),p=[(r[0]+s[0])/2-l.left,(r[1]+s[1])/2-l.top],h=u=>{let b=u;if(!this.touches.has(b.pointerId))return;this.touches.set(b.pointerId,[b.clientX,b.clientY]);let[f,w]=i(),v=Math.max(Math.hypot(w[0]-f[0],w[1]-f[1]),1),M=[(f[0]+w[0])/2-l.left,(f[1]+w[1])/2-l.top],$=pi(o,v/d,p);this.view={...$,ox:$.ox+M[0]-p[0],oy:$.oy+M[1]-p[1]},this.userMoved=!0},m=u=>{this.touches.delete(u.pointerId),t.removeEventListener("pointermove",h),t.removeEventListener("pointerup",m),t.removeEventListener("pointercancel",m)};t.addEventListener("pointermove",h),t.addEventListener("pointerup",m),t.addEventListener("pointercancel",m)}turnModel(t){let o=this.modelTurnNow(),n=t.clientX;this.drag(t,{move:(i,r)=>{let s=o+(r.clientX-n)*.5;s=((s+180)%360+360)%360-180,this.modelTurn=Math.round(s)},end:()=>{}})}modelTurnNow(){return this.modelTurn??je(this.doc).turn??di}modelLookNow(){if(this.modelLook!==void 0)return this.modelLook;let t=je(this.doc).look;return Zt.includes(t)?t:"night"}onWheel(t){if(this.viewKind==="model"||this.view===void 0)return;this.stageEl=t.currentTarget,t.preventDefault?.();let o=t.deltaMode===1?16:t.deltaMode===2?400:1;if(t.ctrlKey||t.metaKey){this.zoomBy(Math.exp(-t.deltaY*o*.0025),this.stagePoint(t));return}this.view={...this.view,ox:this.view.ox-t.deltaX*o,oy:this.view.oy-t.deltaY*o},this.userMoved=!0}openKeys(){this.floorMenu=!1,this.dockMenu=void 0,this.spaceHeld=!1,this.keysOpen=!0,this.updateComplete.then(()=>{this.renderRoot?.querySelector?.(".hme-keys-box .hme-keys-done")?.focus?.()})}closeKeys(){this.keysOpen=!1}renderKeys(){if(!this.keysOpen)return g;let t=Ji(Ie());return c`<div class="hme-scrim" @pointerdown=${o=>{o.target===o.currentTarget&&this.closeKeys()}}>
      <div class="hme-keys-box" role="dialog" aria-modal="true" aria-labelledby="hme-keys-title">
        <div class="hme-keys-top"><h3 id="hme-keys-title">Keys</h3><span class="hme-flex"></span>
          <button type="button" class="hme-tb hme-keys-done" @click=${()=>this.closeKeys()}>Done</button></div>
        <div class="hme-keys-groups">
          ${t.map(o=>c`<section class="hme-keys-group" aria-label=${o.title}><h4>${o.title}</h4>
            <dl class="hme-keys">${o.keys.map(([n,i])=>c`<dt><kbd>${n}</kbd></dt><dd>${i}</dd>`)}</dl></section>`)}
        </div>
      </div>
    </div>`}toggleStyle(){if(this.styleOpen){this.closeStyle();return}this.floorMenu=!1,this.styleOpen=!0}closeStyle(){this.styleOpen=!1,this.stylePanel.leave()}render(){if(this.tick,!this.capable||this.unsupported)return this.calm(c`<b>${ah}</b>`);if(this.loadError!==void 0)return this.calm(c`<span>Could not read the home map. ${this.loadError}</span>
        <button class="hme-tb" @click=${()=>{this.load()}}>Try again</button>`);if(this.loading||this.session===void 0)return this.calm(c`Loading…`);let t=this.doc;if(t===null||t.floors.length===0)return this.renderFirstRun();let o=this.context(),n=this.session.note;return c`<div class="hme">
      ${this.renderBar(t,o)}
      ${n===void 0?g:c`<div class="hme-note ${n.kind}" role="status"><span>${n.text}</span>
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
    </div>`}calm(t){return c`<div class="hme-calm"><div class="hme-empty">${t}</div></div>`}renderFirstRun(){let t=this.session?.note;return c`<div class="hme-calm"><div class="hme-empty hme-first">
      <b>${sh}</b>
      ${t===void 0?g:c`<span class="hme-first-note ${t.kind}" role="status">${t.text}</span>`}
      <button type="button" class="hme-tb primary hme-start-btn" @click=${()=>this.startByHand()}>${dh}</button>
      <span class="hme-first-line">${ws}</span>
      ${this.onHome===void 0?g:c`<button type="button" class="hme-link" @click=${()=>this.onHome?.()}>‹ Shared</button>`}
    </div></div>`}startByHand(){let t=this.session;if(t===void 0)return;let o=ut(),n=ea(this.hass?.floors);if(!t.begin(r=>ta(r,{id:o,name:n.name,story:n.story})))return;t.note=void 0,this.floorId=o,this.selection=void 0,this.needFit=!0,this.userMoved=!1,this.afterChange();let i=this.context();i!==void 0&&this.page.startDrawing(i)}renderBar(t,o){let n=this.baseFloor(),i=this.session?.state??{kind:"saved"},r=Ie(),s=je(t).look;return c`<header class="hme-bar">
      ${this.onHome===void 0?g:c`<button type="button" class="hme-back" @click=${()=>this.onHome?.()}>‹ Shared</button><span class="hme-vsep"></span>`}
      <strong class="hme-title">Home map</strong><span class="hme-beta">ALPHA</span>
      <div class="hme-floor-wrap">
        <button type="button" class="hme-tb hme-floor-btn" aria-label="Switch floor" aria-haspopup="menu" aria-expanded=${this.floorMenu?"true":"false"}
          @click=${()=>{this.floorMenu=!this.floorMenu}}>
          ${wi(n)}
          <span class="hme-floor-t"><span>${K(n)}</span><small>${O(n.rooms.length,"room")} · ${O(new Set(n.pins.map(d=>d.entityId)).size,"device")}</small></span>
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
        ${this.renderStyleButton(s)}
        ${this.styleOpen?this.stylePanel.panel(o,()=>this.closeStyle()):g}
      </div>
      <button type="button" class="hme-tb hme-icon" aria-label="Undo" title=${`Undo (${r?"\u2318Z":"Ctrl+Z"})`} ?disabled=${!o.canUndo} @click=${()=>this.undo()}>↶</button>
      <button type="button" class="hme-tb hme-icon" aria-label="Redo" title=${`Redo (${r?"\u21E7\u2318Z":"Ctrl+Shift+Z"})`} ?disabled=${!o.canRedo} @click=${()=>this.redo()}>↷</button>
      <span class="hme-status ${i.kind}" role="status" title=${i.kind==="error"?i.text:g}><span class="hme-status-dot"></span>${hh(i)}</span>
      ${this.renderKeysButton()}
    </header>`}renderKeysButton(){return c`<button type="button" class="hme-tb hme-icon hme-keys-btn ${this.keysOpen?"on":""}" aria-label="Keys" aria-haspopup="dialog"
      aria-expanded=${this.keysOpen?"true":"false"} title="Every key (?)" @click=${()=>this.keysOpen?this.closeKeys():this.openKeys()}>?</button>`}renderStyleButton(t){return c`<button type="button" class="hme-tb hme-style-btn ${this.styleOpen?"on":""}" aria-haspopup="dialog" aria-expanded=${this.styleOpen?"true":"false"}
      title="How every map tile looks, unless a tile picks its own" @click=${()=>this.toggleStyle()}>
      <span class="hme-style-sw" style=${`background:${Ne(t,.2)}`} aria-hidden="true"></span>Home style</button>`}renderFloorMenu(t,o){return c`<div class="hme-pop" role="menu" aria-label="Floors">
      ${t.floors.map(n=>c`<div class="hme-pop-row ${k(n.id,o.id)?"on":""}">
        <button type="button" role="menuitem" class="hme-pop-main" @click=${()=>this.setFloor(n.id)}>
          ${wi(n)}<span class="hme-floor-t"><span>${K(n)}</span><small>${O(n.rooms.length,"room")} · ${O(new Set(n.pins.map(i=>i.entityId)).size,"device")}</small></span></button>
        <button type="button" class="hme-pop-act" title="Rename" aria-label=${`Rename ${K(n)}`} @click=${()=>{this.renameFloorAsk(n)}}>Rename</button>
        <button type="button" class="hme-pop-act danger" title=${t.floors.length===1?"The map keeps at least one floor":"Delete"} aria-label=${`Delete ${K(n)}`}
          ?disabled=${t.floors.length===1} @click=${()=>{this.deleteFloorAsk(n)}}>Delete</button>
      </div>`)}
      <button type="button" class="hme-pop-add" @click=${()=>{this.addFloorAsk()}}>＋ Add a floor</button>
    </div>`}async addFloorAsk(){this.floorMenu=!1;let t=this.doc;if(t===null)return;let o=Math.max(...t.floors.map(r=>r.story))+1,n=await this.ask({title:"Add a floor",label:"Name",value:o===1?"Upstairs":`Floor ${o+1}`,ok:"Add floor"});if(n===void 0)return;let i=ut();this.apply(r=>Jr(r,{id:i,name:n,story:o}),{floorId:i,select:null})&&(this.needFit=!0)}async renameFloorAsk(t){this.floorMenu=!1;let o=await this.ask({title:"Rename floor",label:"Name",value:t.name||K(t),ok:"Rename"});o!==void 0&&this.apply(n=>Eo(n,t.id,o))}async deleteFloorAsk(t){this.floorMenu=!1,await this.confirm({title:`Delete ${K(t)}?`,text:`Its ${O(t.rooms.length,"room")} and ${O(t.pins.length,"device")} come off the map. Undo brings them back while this page is open.`,ok:"Delete floor",danger:!0})&&this.apply(n=>oa(n,t.id),{select:null})}renderStage(t){let o=this.page,{width:n,height:i}=this.stageSize,r=this.viewKind==="model",s=this.viewKind==="both",d=r?g:o.pill?.(t)??g,l=this.spaceHeld?"grab":r?"ew-resize":this.toggles.measure?"crosshair":o.cursor?.(t)??"default",p=t.floor.rooms.length===0,h=this.model3d&&this.bundleUrl!==void 0,m=s?h?c`<div class="hme-stage model hme-split-r hme-3d">
      ${this.render3d(t)}
      ${this.renderModelDock(!1)}
    </div>`:c`<div class="hme-stage model hme-split-r" style=${`background:${Ne(this.modelLookNow())}`}>
      <svg class="hme-svg" width="100%" height="100%" viewBox=${`0 0 ${Math.max(n,1)} ${Math.max(i,1)}`} style="cursor:ew-resize"
        role="img" aria-label=${`Model of ${K(t.floor)}`}
        @pointerdown=${u=>this.onModelDown(u)}>
        ${this.renderModel(t,n,i)}
      </svg>
      ${this.renderModelDock(!1)}
    </div>`:g;return r&&h?c`<div class="hme-stage model hme-3d">
        ${this.render3d(t)}
        ${this.renderAddButton()}
        ${this.renderDock(t)}
      </div>`:c`<div class="hme-stage ${r?"model":"rail"} ${s?"hme-split-l":""}" style=${r?`background:${Ne(this.modelLookNow())}`:""}>
      <svg class="hme-svg" width="100%" height="100%" viewBox=${`0 0 ${Math.max(n,1)} ${Math.max(i,1)}`} style=${`cursor:${l}`}
        role="img" aria-label=${`Plan of ${K(t.floor)}`}
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
      ${d===g?g:c`<div class="hme-pill beside">${d}</div>`}
      ${r?g:o.stageExtra?.(t)??g}
      ${p&&!r&&!o.arrange.draw.active?c`<div class="hme-stage-empty"><b>No rooms on this floor yet.</b>
        <span>Draw one by hand, or scan this floor with the iPhone.</span>
        <button type="button" class="hme-tb" @click=${()=>{let u=this.context();u&&o.startDrawing(u)}}>＋ Draw a room by hand</button></div>`:g}
      ${this.renderAddButton(d!==g)}
      ${this.renderDock(t)}
    </div>${s?this.renderSplitHandle():g}${m}`}renderAddButton(t=!1){return c`<button type="button" class="hme-add-btn ${t?"compact":""}" aria-haspopup="dialog" aria-expanded=${this.addOpen===void 0?"false":"true"}
      aria-label="Add device or furniture" title="Add a device or a piece of furniture (A)" @click=${()=>this.openAdd()}>
      <span aria-hidden="true">＋</span>${t?"Add":"Add device or furniture"}</button>`}renderSplitHandle(){let t=n=>{let r=n.currentTarget.parentElement?.getBoundingClientRect();r!==void 0&&(this.split=this.splitStack?fi(n.clientY,r.top,r.height):fi(n.clientX,r.left,r.width))},o=()=>Ls(this.split);return c`<div class="hme-split-handle" role="separator" tabindex="0" aria-orientation=${this.splitStack?"horizontal":"vertical"}
      aria-label="Size of the plan and the model" aria-valuemin=${ci} aria-valuemax=${ui} aria-valuenow=${Math.round(this.split)}
      title="Drag to give the plan or the model more room. Double-click to even them."
      @pointerdown=${n=>{n.currentTarget.setPointerCapture?.(n.pointerId)}}
      @pointermove=${n=>{n.buttons!==0&&t(n)}}
      @pointerup=${o}
      @dblclick=${()=>{this.split=50,o()}}
      @keydown=${n=>{let i=this.splitStack?"ArrowUp":"ArrowLeft",r=this.splitStack?"ArrowDown":"ArrowRight";n.key!==i&&n.key!==r||(n.preventDefault(),n.stopPropagation(),this.split=tn(this.split+(n.key===i?-5:5)),o())}}><span aria-hidden="true"></span></div>`}toggleTips(){this.tipsShown=!this.tipsShown,_s(this.tipsShown)}onModelDown(t){this.dialog!==void 0||t.button!==0||(this.stageEl=t.currentTarget,this.floorMenu=!1,this.dockMenu=void 0,this.turnModel(t))}renderPlan(t,o,n){let i=this.view;if(i===void 0||o<=0)return g;let r=this.planArt(t.floor,o,n,this.page.drawsPins?.(t)===!0?"none":"all"),s=i.scale/(this.artScale||i.scale);return x`${this.background(i,o,n)}
      <g class="hme-art" transform=${`translate(${i.ox.toFixed(2)} ${i.oy.toFixed(2)}) scale(${s.toFixed(5)})`} pointer-events="none">${r}</g>
      <g class="hme-floor-below" pointer-events="none">${nd(t)}</g>
      <g class="hme-open-edges" pointer-events="none">${Qs(t)}</g>
      <g class="hme-swing-clashes" pointer-events="none">${Ud(t)}</g>
      ${Zs(t.floor,this.hover,this.selection,t.toScreen)}
      <g class="hme-labels" pointer-events="none">${this.labels(t)}</g>
      <g class="hme-overlay">${this.page.overlay(t)}</g>
      ${this.toggles.measure?this.measureMarks(t):g}`}planArt(t,o,n,i){let r=this.toggles.live?this.hass?.states:void 0,s=this.artScale||this.view.scale,d=`${wl(t)}|${go(r)}|${s}|${o}|${n}|${this.iconsTick}|${go(this.icons)}|${i}`;return d!==this.artKey&&(this.artKey=d,this.artHeld=Pt({floor:t,states:r,look:"plan",names:!1,devices:i,furniture:!0,furnitureLook:os,oneWall:!0,glow:!0,width:o,height:n,icons:this.icons,frame:{scale:s,ox:0,oy:0}})),this.artHeld}background(t,o,n){let i=se(this.selection)?Be:ke,r=20;if(this.toggles.grid)for(r=i*t.scale;r<8;)r*=10;let s=(t.ox%r+r)%r,d=(t.oy%r+r)%r;return x`<defs><pattern id="hme-bg" width=${r} height=${r} patternUnits="userSpaceOnUse" patternTransform=${`translate(${s.toFixed(1)} ${d.toFixed(1)})`}>
        ${this.toggles.grid?x`<path d=${`M${r} 0V${r}H0`} fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1" />`:x`<circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.09)" />`}
      </pattern></defs>
      <rect class="hme-bg" width=${o} height=${n} fill="url(#hme-bg)" />`}labels(t){let o=t.devices??Qe(t.hass),n=`${wl(t.floor)}|${go(t.doc)}|${t.view.scale}|${t.view.ox}|${t.view.oy}|${go(o)}`;if(this.labelsHeld?.key===n)return this.labelsHeld.art;let i=[],r=t.floor.pins.map(d=>({c:t.toScreen(d.at),r:15})),s=t.floor.rooms.map(d=>{let l=Y(d),p=_e(d.outline);if(l===void 0||p===void 0)return g;let h=St(d,o,t.doc).main.length,m=Ed(T(d),h),u=to(d),b=(p.maxX-p.minX)*t.view.scale,f=(p.maxY-p.minY)*t.view.scale,w=m.length*7.4+22;if(w>b*.95||f<26)return g;let v=Math.max(w,u.length*5.8+22)<=b*.95&&f>=48,M=v?Math.max(w,u.length*5.8+22):w,$=v?36:22,y=md(d,t.toScreen,r,i),P=v?[[M/2,$/2],[w/2,11]]:[[w/2,11]],F=cd(t.toScreen(l),P,y);if(F===void 0)return g;let I=v&&F.pill===0,j=P[F.pill];i.push({c:F.at,half:j});let[S,C]=F.at,L=j[0]*2,X=j[1]*2;return x`<g class="hme-label"><rect x=${(S-L/2).toFixed(1)} y=${(C-X/2).toFixed(1)} width=${L.toFixed(1)} height=${X} rx=${I?9:7} fill="rgba(0,0,0,0.6)" />
        <text x=${S.toFixed(1)} y=${(C+(I?-3:4.5)).toFixed(1)} fill="#fff" font-size=${I?13:12} font-weight="600" text-anchor="middle">${m}</text>
        ${I?x`<text x=${S.toFixed(1)} y=${(C+11).toFixed(1)} fill="#aeaeb2" font-size="10" text-anchor="middle">${u}</text>`:g}</g>`});return this.labelsHeld={key:n,art:s,taken:i},s}measureMarks(t){let o=this.measure;if(o.a===void 0)return x`<g class="hme-measure"></g>`;let n=o.b??o.hover,i=t.toScreen(o.a);if(n===void 0)return x`<g class="hme-measure" pointer-events="none"><circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" /></g>`;let r=t.toScreen(n),s=Math.hypot(n[0]-o.a[0],n[1]-o.a[1]),d=[(i[0]+r[0])/2,(i[1]+r[1])/2];return x`<g class="hme-measure" pointer-events="none">
      <line x1=${i[0]} y1=${i[1]} x2=${r[0]} y2=${r[1]} stroke="#ff9f0a" stroke-width="2" stroke-dasharray=${o.b===void 0?"6 4":"none"} />
      <circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" /><circle cx=${r[0]} cy=${r[1]} r="5" fill="#ff9f0a" />
      <g class="hme-tag"><rect x=${(d[0]-32).toFixed(1)} y=${(d[1]-22).toFixed(1)} width="64" height="20" rx="10" fill="#ff9f0a" />
      <text x=${d[0].toFixed(1)} y=${(d[1]-8).toFixed(1)} fill="#2a1a00" text-anchor="middle">${s.toFixed(2)} m</text></g></g>`}renderModel(t,o,n){if(o<=0)return g;let i=this.selection,r=de(i),s=r===void 0?void 0:t.floor.rooms.find(p=>k(p.id,r)),d=Se(i).flatMap(p=>t.floor.rooms.find(h=>k(h.id,p.roomId))?.objects[p.object]??[]),l=d.length>0?{boxes:d}:s!==void 0?{outline:s.outline}:void 0;return Pt({mark:l,floor:t.floor,states:this.toggles.live?this.hass?.states:void 0,look:this.modelLookNow(),turn:this.modelTurnNow(),names:!0,devices:"lights",furniture:!0,glow:!0,width:o,height:n})}render3d(t){let o=this.failed3d==="webgl"?"The 3D view is not available on this device. The plan still works.":this.failed3d==="load"?"The 3D view could not be loaded. Reload the page to try again. The plan still works.":this.scene3d===void 0?"Loading the 3D view\u2026":void 0;return c`<div class="hme-3d-host" role="img" aria-label=${`3D model of ${K(t.floor)}. Drag to turn it, scroll to zoom, click a thing to pick it.`}></div>
      ${o===void 0?g:c`<div class="hme-3d-note">${o}</div>`}
      ${this.page.shape.sizeTag===void 0?g:c`<div class="hme-3d-size" role="status">${this.page.shape.sizeTag}</div>`}
      ${this.lost3d?c`<div class="hme-3d-note hme-3d-paused" role="status"><span>3D paused</span>
        <button type="button" class="hme-link" title="Make the 3D view again now" @click=${()=>this.restart3d()}>Start again</button></div>`:g}`}qualityItems(){let t=this.quality3dNow()==="low"?"Low":"High",o=n=>()=>this.setQuality3d(n);return[{group:"3D quality",radio:!0,label:this.quality3d==="auto"?`Auto (${t} here)`:"Auto",on:this.quality3d==="auto",title:"High on a strong computer, Low on a tablet or slower hardware",pick:o("auto")},{group:"3D quality",radio:!0,label:"High",on:this.quality3d==="high",title:"Soft shading in the corners, glowing bulbs and every shadow",pick:o("high")},{group:"3D quality",radio:!0,label:"Low",on:this.quality3d==="low",title:"Fewer effects and shadows, for a smoother view on slower hardware",pick:o("low")}]}renderModelDock(t,o){let n=this.model3d&&this.bundleUrl!==void 0,i=n?void 0:this.modelLookNow(),r=sr(this.hass?.states),s=this.skyChoiceNow(r),d=this.northLive??this.doc?.north??0,l=Zt.map(m=>({label:gl[m]??m,on:m===i,pick:()=>{this.modelLook=m,this.model3d=!1,this.dockMenu=void 0}}));this.bundleUrl!==void 0&&l.push({label:"3D",on:n,title:"The floor in real 3D, with its furniture and each light lit as it is now",pick:()=>{this.model3d=!0,this.dockMenu=void 0}}),n&&l.push(...this.qualityItems());let p=(m,u)=>({label:bl[m],on:s===m,title:u,pick:()=>{this.skyChoice=m,this.dockMenu=void 0}}),h=[...r===void 0?[]:[p("now","The sun where it is now: it moves through the day, and at night only the lights that are on light the rooms")],p("night","Night: only the lights that are on light the rooms"),p("day","Day: the sun comes in through the windows"),...r===void 0?[]:[{label:`North ${d}\xB0\u2026`,on:!1,title:"Where north is on the plan, so the sun comes in on the right side",pick:()=>{this.dockMenu="north"}}]];return c`<div class="hme-dock">
      ${n?this.dockMenuButton("sky",`Sky: ${bl[s]}`,"The sun and the sky in 3D, and where north is"):g}
      ${n&&(this.selection?.kind==="wall"||this.selection?.kind==="opening")?c`<button type="button" class="hme-tb hme-blue" title="Move the camera in front of it, to resize it. Turn back goes back." @click=${()=>this.scene3d?.lookAtPiece()}>Look at it</button>`:g}
      ${this.dockMenuButton("look",`Look: ${n?"3D":gl[i??"night"]??i}`,"How the model is drawn: the tiles' looks, or real 3D")}
      <button type="button" class="hme-tb" title=${n?"Show the whole floor from the home style's turn":"Back to the home style's turn"} @click=${()=>this.turnBack()}>⟲ Turn back</button>
      ${t&&o!==void 0?c`<span class="hme-vsep"></span>${o}`:g}
      ${this.dockMenuList("look","Look",l,"menuitemradio")}${this.dockMenuList("sky","Sky",h,"menuitemradio")}${this.renderNorthMenu(d)}
    </div>`}skyChoiceNow(t){return this.skyChoice==="now"&&t===void 0?"night":this.skyChoice}renderNorthMenu(t){return this.dockMenu!=="north"?g:c`<div class="hme-dock-pop hme-north" role="group" aria-label="North">
      <svg class="hme-north-dial" viewBox="-20 -20 40 40" aria-hidden="true">
        <circle r="18" />
        <g transform=${`rotate(${t})`}><path class="n" d="M0 -15 L4 0 L-4 0 Z" /><path d="M0 15 L4 0 L-4 0 Z" /></g>
      </svg>
      <label class="hme-north-row">Where north is on the plan
        <input type="range" class="hme-range" min="0" max="359" step="1" .value=${q(String(t))} style=${Fe(t,0,359)}
          @input=${o=>{this.northLive=Number(o.target.value)}}
          @change=${o=>{let n=Number(o.target.value);this.northLive=void 0,this.context()?.apply(i=>_a(i,n))}} />
      </label>
      <span class="hme-val mono">${t}°</span>
    </div>`}renderDock(t){let o="Draw what Home Assistant's devices are doing now",n=()=>this.setToggle("live",!this.toggles.live);if(this.viewKind==="model")return this.renderModelDock(!0,c`<button type="button" class="hme-tb ${this.toggles.live?"on":""}" aria-pressed=${this.toggles.live?"true":"false"}
        title=${o} @click=${n}><span class="hme-live-dot"></span>Live states</button>`);let i=this.stageSize.width>0?Qo(this.baseFloor(),this.stageSize.width,this.stageSize.height):void 0,r=this.view===void 0||i===void 0?100:Hs(this.view,i),s=[...(this.page.viewItems?.(t)??[]).map(d=>({label:d.label,on:d.on,title:d.title,pick:()=>d.flip()})),{label:"Live states",on:this.toggles.live,title:o,pick:n},...this.bundleUrl===void 0?[]:this.qualityItems()];return c`<div class="hme-dock">
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom out" title="Zoom out (−)" @click=${()=>this.zoomBy(1/Jt)}>−</button>
      <span class="hme-zoom mono">${r}%</span>
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom in" title="Zoom in (+)" @click=${()=>this.zoomBy(Jt)}>＋</button>
      <button type="button" class="hme-tb" title="Fit the floor (0)" @click=${()=>this.fit()}>Fit</button>
      ${Qt(t.floor,t.selection).length===0?g:c`<button type="button" class="hme-tb" title="Fit the picked room (Z)" @click=${()=>this.fitPicked()}>Fit room</button>`}
      <span class="hme-vsep"></span>
      ${this.page.dock?.(t)??g}
      ${this.dockMenuButton("view","View","What the plan shows: the grid, names, live states and more")}
      ${this.dockMenuList("view","View",s,"menuitemcheckbox")}
    </div>`}dockMenuButton(t,o,n){let i=this.dockMenu===t;return c`<button type="button" class="hme-tb ${i?"on":""}" aria-haspopup="menu" aria-expanded=${i?"true":"false"} title=${n}
      @click=${()=>{this.dockMenu=i?void 0:t}}>${o} <span class="hme-caret" aria-hidden="true">▾</span></button>`}dockMenuList(t,o,n,i){return this.dockMenu!==t?g:c`<div class="hme-dock-pop" role="menu" aria-label=${o}>
      ${n.map((r,s)=>c`${r.group!==void 0&&r.group!==n[s-1]?.group?c`<div class="hme-dock-head" role="presentation">${r.group}</div>`:g}
        <button type="button" role=${r.radio===!0?"menuitemradio":i} aria-checked=${r.on?"true":"false"} class="hme-dock-item ${r.on?"on":""}"
        title=${r.title??r.label} @click=${()=>r.pick()}><span class="hme-check" aria-hidden="true">${r.on?"\u2713":""}</span>${r.label}</button>`)}
    </div>`}renderDialog(){let t=this.dialog;if(t===void 0)return g;let o=()=>t.kind==="confirm"?t.done(!1):t.done(void 0),n=i=>{t.kind==="confirm"?t.done(!0):t.done((i?.querySelector("input")?.value??t.value).trim()||t.value)};return c`<div class="hme-scrim" @pointerdown=${i=>{i.target===i.currentTarget&&o()}}>
      <div class="hme-dialog" role="dialog" aria-modal="true" aria-label=${t.title}
        @keydown=${i=>{i.key==="Escape"&&(i.stopPropagation(),o()),i.key==="Enter"&&(i.preventDefault(),n(i.currentTarget))}}>
        <h3>${t.title}</h3>
        ${t.kind==="confirm"?t.text===void 0?g:c`<p>${t.text}</p>`:c`<label class="hme-dialog-field"><span>${t.label}</span><input type="text" maxlength="100" .value=${t.value} autofocus /></label>`}
        <div class="hme-dialog-row">
          <button type="button" class="hme-tb" @click=${o}>Cancel</button>
          <button type="button" class="hme-tb primary ${t.kind==="confirm"&&t.danger===!0?"danger-fill":""}"
            @click=${i=>n(i.currentTarget.closest(".hme-dialog"))}>${t.ok}</button>
        </div>
      </div>
    </div>`}static{this.styles=[Dr,br,pl,ol]}};D([me({attribute:!1})],R.prototype,"hass",2),D([me({type:Boolean,reflect:!0})],R.prototype,"narrow",2),D([me({attribute:!1})],R.prototype,"icons",2),D([me({attribute:!1})],R.prototype,"iconsTick",2),D([me({attribute:!1})],R.prototype,"capable",2),D([me({attribute:!1})],R.prototype,"bundleUrl",2),D([me({attribute:!1})],R.prototype,"onHome",2),D([me({attribute:!1})],R.prototype,"onOpenPage",2),D([me({attribute:!1})],R.prototype,"owners",2),D([me({attribute:!1})],R.prototype,"phones",2),D([_()],R.prototype,"unsupported",2),D([_()],R.prototype,"loading",2),D([_()],R.prototype,"loadError",2),D([_()],R.prototype,"floorId",2),D([_()],R.prototype,"selection",2),D([_()],R.prototype,"walls",2),D([_()],R.prototype,"styleOpen",2),D([_()],R.prototype,"viewKind",2),D([_()],R.prototype,"splitStack",2),D([_()],R.prototype,"split",2),D([_()],R.prototype,"tipsShown",2),D([_()],R.prototype,"view",2),D([_()],R.prototype,"artScale",2),D([_()],R.prototype,"stageSize",2),D([_()],R.prototype,"toggles",2),D([_()],R.prototype,"scans",2),D([_()],R.prototype,"measure",2),D([_()],R.prototype,"floorMenu",2),D([_()],R.prototype,"dockMenu",2),D([_()],R.prototype,"dialog",2),D([_()],R.prototype,"modelLook",2),D([_()],R.prototype,"model3d",2),D([_()],R.prototype,"skyChoice",2),D([_()],R.prototype,"northLive",2),D([_()],R.prototype,"modelTurn",2),D([_()],R.prototype,"spaceHeld",2),D([_()],R.prototype,"tick",2),D([_()],R.prototype,"hover",2),D([_()],R.prototype,"addOpen",2),D([_()],R.prototype,"quality3d",2),D([_()],R.prototype,"lost3d",2),D([_()],R.prototype,"keysOpen",2);var vl=new WeakMap,mh=1;function go(a){if(a===void 0)return 0;let e=vl.get(a);return e===void 0&&vl.set(a,e=mh++),e}var wl=a=>go(a);customElements.get("wa-home-map-editor")||customElements.define("wa-home-map-editor",R);export{lh as HOME_MAP_DRAG_SLOP,sh as HOME_MAP_EMPTY_TEXT,ws as HOME_MAP_SCAN_TEXT,dh as HOME_MAP_START_TEXT,ah as HOME_MAP_UPDATE_TEXT,R as WaHomeMapEditor,hh as homeMapSaveWords};
