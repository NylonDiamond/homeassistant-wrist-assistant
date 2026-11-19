import{a as io,b as ln,c as ps,d as hs,e as tt,f as ms,g as cs,h as ui,i as be,j as fi,k as gi,l as bi,m as vi,n as ot,o as ro,p as nt,q as pn,r as Rt,s as us,t as fs,u as Me,v as gs,w as bs}from"./chunk-ZSWWR6FS.js";import{a as at}from"./chunk-46KUYLK6.js";import{a as yi,b as wi,c as it,d as se,e as rt,f as vs,g as ys,h as ws,i as Ms,j as ks,k as $s}from"./chunk-3X2UW5F5.js";import{d as Is}from"./chunk-YU7LSQFX.js";import"./chunk-Y5CFVJ2U.js";import{a as hn,b as de,c as ke,d as ao,e as so,f as Hs,g as Ps,h as lo,i as ki,j as We,k as Rs,l as Ds,m as Os,n as Dt}from"./chunk-K7SWBAGF.js";import{A as Ss,c as Es,e as Cs,f as Ts}from"./chunk-SJSWTPUS.js";import{C as xs}from"./chunk-YSFPF36D.js";import{f as Mi}from"./chunk-3654CASX.js";import"./chunk-VPSVCUVB.js";import{$ as ha,$a as Ia,$b as ss,Aa as ri,Ab as mi,Ba as ai,Bb as Je,C as oa,Ca as Jt,Cb as on,Da as $a,Db as nn,E as _o,Ea as xa,Eb as Ua,F as na,Fa as Ha,Fb as Ga,Ga as Pt,Gb as we,Ha as Et,Hb as Ne,Ia as Pa,Ib as rn,J as ti,Ja as Wo,Jb as Va,Ka as Bo,Kb as an,La as Ea,Lb as qa,M as zo,Ma as Uo,Mb as Xa,N as ia,Na as si,Nb as Ya,O as ra,Oa as Go,Ob as Za,P as Mt,Pa as di,Pb as Qa,Q as aa,Qa as Vo,Qb as Ja,Ra as qo,Rb as es,Sa as Xo,Sb as Ke,T as kt,Ta as Ca,Tb as ci,Ua as Yo,Ub as sn,V as sa,Va as Ta,Vb as ts,W as da,Wa as Ct,Wb as os,X as la,Xa as Zo,Xb as ns,Y as Xt,Ya as Sa,Yb as is,Z as $t,Za as eo,Zb as rs,_ as pa,_a as Qe,_b as as,a as ae,ab as Ra,ac as ds,b as fe,ba as xt,bb as Da,bc as no,c as Zn,ca as Ye,cb as Tt,cc as ls,d as Qn,da as V,db as St,dc as et,e as Ie,ea as Ht,eb as Oa,ec as dn,fa as Ze,fb as Aa,fc as Re,g as Fo,ga as ma,gb as La,ha as oi,hb as to,i as Jn,ia as ca,ib as Qo,ja as ua,jb as Jo,ka as Yt,kb as oo,la as Zt,lb as li,ma as jo,mb as Fa,na as Qt,nb as en,oa as fa,ob as pi,pa as ga,pb as _a,q as Xe,qa as ba,qb as tn,ra as va,rb as za,s as ei,sa as No,sb as ja,t as ge,ta as ni,tb as Na,u as Y,ua as ya,ub as Ka,v as Z,va as ii,vb as hi,w as q,wa,wb as je,x as Q,xa as Ma,xb as It,y as J,ya as Ko,yb as Wa,z as ta,za as ka,zb as Ba}from"./chunk-JPYTFTZX.js";import{_ as Jr,ma as ea}from"./chunk-KE25FXWY.js";import{a as Tr,b as Sr,c as Ir,j as X}from"./chunk-UJEOSPM7.js";import{a as Vr,g as Yn,i as As}from"./chunk-POEO3GLD.js";import{A as jr,B as k,E as K,F as T,G as Io,H as ue,I as Nr,J as te,L as Kr,N as Se,O as Wr,P as Ro,Q as Do,W as Br,X as Ur,Y as Gr,Z as re,b as Dr,d as Or,e as Ar,h as Ut,i as Lr,j as Fr,v as Gt,w as _r,x as zr,y as Vt}from"./chunk-FG3PHEWQ.js";import{a as Xr,l as Yr}from"./chunk-Y354TWPI.js";import{b as wt,g as Qr}from"./chunk-VBO6SZXU.js";import{i as vt,l as Oo,m as Zr,n as Ao,u as yt,v as qt,w as Lo}from"./chunk-LPWS77Y4.js";import{a as ze,i as qr}from"./chunk-PWVBP3GH.js";import{Bg as Hr,Wg as So,Xg as Pr,Yg as Er,Zg as Cr,b as ce,bg as Bt,c as z,th as Rr}from"./chunk-GFNODYNE.js";import{Tb as qe,l as bt}from"./chunk-NLJVSYDV.js";import{b as To,f as c,g as H,h as $r,i as b,l as xr}from"./chunk-6ZDBXU6B.js";import{a as L}from"./chunk-LO2NM3CE.js";function le(r){return r?.kind==="wall"||r?.kind==="corner"||r?.kind==="opening"}function po(r,e){if(e===void 0)return[];let o=(e.kind==="pin"?[e.pinId]:e.kind==="pins"?e.pinIds:[]).flatMap(i=>{let a=r.pins.find(d=>k(d.id,i));if(a===void 0)return[];let s=r.rooms.find(d=>a.roomId!==void 0&&k(d.id,a.roomId))??Nr(r,a.at);return s===void 0?[]:[s.id]}),n=e.kind==="objects"?e.items.map(i=>i.roomId):e.kind==="pin"||e.kind==="pins"?o:[e.roomId];return r.rooms.filter(i=>n.some(a=>k(a,i.id)))}function pe(r){return r===void 0||r.kind==="pin"||r.kind==="pins"||r.kind==="objects"?void 0:r.roomId}function De(r){return r?.kind==="object"?[{roomId:r.roomId,object:r.object}]:r?.kind==="objects"?r.items.map(e=>({roomId:e.roomId,object:e.object})):[]}var mn=(r,e)=>k(r.roomId,e.roomId)&&r.object===e.object;function Ls(r){let e=[];for(let t of r)e.some(o=>mn(o,t))||e.push({roomId:t.roomId,object:t.object});if(e.length!==0)return e.length===1?{kind:"object",roomId:e[0].roomId,object:e[0].object}:{kind:"objects",items:e}}function st(r,e){let t=De(r);return t.some(o=>mn(o,e))?Ls(t.filter(o=>!mn(o,e))):Ls([...t,e])}function cn(r,e){if(e?.kind!=="pin"||r===void 0)return e;let t=we(r,e.pinId);return t===void 0?e:{kind:"object",roomId:t.roomId,object:t.object}}function Fs(r,e,t){return De(r).some(o=>mn(o,{roomId:e,object:t}))}function $i(r,e){if(e===void 0)return!0;if(r===void 0)return!1;if(e.kind==="pin")return r.pins.some(o=>k(o.id,e.pinId));if(e.kind==="pins")return e.pinIds.every(o=>r.pins.some(n=>k(n.id,o)));if(e.kind==="objects")return e.items.every(o=>r.rooms.find(n=>k(n.id,o.roomId))?.objects[o.object]!==void 0);let t=r.rooms.find(o=>k(o.id,e.roomId));if(t===void 0)return!1;switch(e.kind){case"room":return!0;case"wall":return V(t)[e.wall]!==void 0;case"corner":return t.outline[e.corner]!==void 0;case"opening":return t.openings[e.opening]!==void 0;case"object":return t.objects[e.object]!==void 0}}function Ot(r,e){return r===void 0||e===void 0?r===e:JSON.stringify(r)===JSON.stringify(e)}var _s=4,zs=2400;function js(r,e){return[r.ox+e[0]*r.scale,r.oy+e[1]*r.scale]}function Be(r,e){return[(e[0]-r.ox)/r.scale,(e[1]-r.oy)/r.scale]}function un(r,e,t,o=44,n=72){let a=r===void 0||r.rooms.length===0&&r.pins.length===0?{minX:-5,minY:-5,maxX:5,maxY:5}:Io(r),s=Math.max(a.maxX-a.minX,1),d=Math.max(a.maxY-a.minY,1),l=Us(Math.min(Math.max(e-o*2,40)/s,Math.max(t-n*2,40)/d),_s,zs);return{scale:l,ox:e/2-(a.minX+a.maxX)/2*l,oy:t/2-(a.minY+a.maxY)/2*l}}function xi(r,e,t){let o=Us(r.scale*e,_s,zs),n=o/r.scale;return{scale:o,ox:t[0]-(t[0]-r.ox)*n,oy:t[1]-(t[1]-r.oy)*n}}function Ns(r,e){return Math.round(r.scale/e.scale*100)}var ho=1.25;function Ks(r){if(typeof r!="object"||r===null)return;let e=r;return{tag:typeof e.tagName=="string"?e.tagName.toUpperCase():"",type:typeof e.type=="string"?e.type.toLowerCase():"text",editable:e.isContentEditable===!0}}var Ws=["button","submit","reset","image"],Gl=["checkbox","radio","range","color","file"];function Hi(r){let e=Ks(r);return e===void 0?!1:e.editable||e.tag==="TEXTAREA"?!0:e.tag==="INPUT"&&!Ws.includes(e.type)&&!Gl.includes(e.type)}function Bs(r){let e=Ks(r);return e===void 0?!1:Hi(r)||e.tag==="SELECT"?!0:e.tag==="INPUT"&&!Ws.includes(e.type)}function oe(r,e){if(e)return;let t=r.metaKey===!0||r.ctrlKey===!0,o=r.key.length===1?r.key.toLowerCase():r.key;if(t)return o==="z"?r.shiftKey===!0?"redo":"undo":o==="y"?"redo":r.shiftKey!==!0&&o==="c"?"copy":r.shiftKey!==!0&&o==="v"?"paste":r.shiftKey!==!0&&o==="d"?"duplicate":void 0;if(r.altKey===!0)return;switch(o){case"Escape":return"cancel";case"Delete":case"Backspace":return"delete";case"Enter":return"enter";case"+":case"=":return"zoomIn";case"-":return"zoomOut";case"0":return"fit";case"?":return"help"}let n=r.shiftKey===!0?.1:.01;if(o==="ArrowLeft")return{nudge:[-n,0]};if(o==="ArrowRight")return{nudge:[n,0]};if(o==="ArrowUp")return{nudge:[0,-n]};if(o==="ArrowDown")return{nudge:[0,n]};if(/^[a-z]$/.test(o)&&r.shiftKey!==!0)return{letter:o}}function $e(){let r=globalThis.navigator,e=`${typeof r?.platform=="string"?r.platform:""} ${typeof r?.userAgent=="string"?r.userAgent:""}`;return/Mac|iPhone|iPad/.test(e)}var Us=(r,e,t)=>Math.min(Math.max(r,e),t);function ne(r,e=2){return`${(Math.round(r*10**e)/10**e).toFixed(e)} m`}function mo(r,e=2){let t=(Math.round(r*10**e)/10**e).toFixed(e);return/^-0(\.0*)?$/.test(t)?t.slice(1):t}function Pi(r){let e=r.trim().replace(",",".").replace(/\s*(m|cm|°|deg)$/i,"");if(e===""||!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(e))return;let t=Number(e);if(Number.isFinite(t))return/cm$/i.test(r.trim())?t/100:t}function fn(r){if(r.outline.length<3)return{width:0,depth:0,area:0};let{a0:e,a1:t,c0:o,c1:n}=ti(r,ei(r));return{width:t-e,depth:n-o,area:Math.abs(zo(r.outline))}}function co(r){let{width:e,depth:t}=fn(r);return`${e.toFixed(1)} \xD7 ${t.toFixed(1)} m`}function Gs(r){if(r.outline.length<3)return r.outline.slice();let{a0:e,a1:t,c0:o,c1:n,point:i}=ti(r,ei(r));return[i(e,o),i(t,o),i(t,n),i(e,n)]}function Vs(r,e){let t=V(r)[e];if(t===void 0)return"inner";let o=Math.max(Math.hypot(t.b[0]-t.a[0],t.b[1]-t.a[1]),1e-9),n=-(t.b[1]-t.a[1])/o,i=(t.b[0]-t.a[0])/o,a=[(t.a[0]+t.b[0])/2,(t.a[1]+t.b[1])/2],s=Math.max(t.t,.1)+.1,d=Y(r.outline,[a[0]+n*s,a[1]+i*s]),l=Y(r.outline,[a[0]-n*s,a[1]-i*s]);if(d&&l)return"inner";if(d)n=-n,i=-i;else if(!l){let p=Z(r);p!==void 0&&(p[0]-a[0])*n+(p[1]-a[1])*i>0&&(n=-n,i=-i)}return Math.abs(n)>Math.abs(i)?n>0?"right":"left":i>0?"bottom":"top"}function uo(r,e,t){let o=Vs(r,e);return`${t}, ${o} wall`}function qs(r){let e=V(r).map((o,n)=>Vs(r,n)),t=new Map;return e.map((o,n)=>{let i=(t.get(o)??0)+1;t.set(o,i);let a=`${o.charAt(0).toUpperCase()}${o.slice(1)} wall`;return i===1&&e.indexOf(o,n+1)<0?a:`${a} ${i}`})}function fo(r){return r.kind==="opening"?"Way through":r.kind==="window"?r.style==="sliding"?"Sliding window":"Window":r.style==="double"?"Double door":r.style==="sliding"?"Sliding door":"Door"}var Vl={sofa:"Sofa",table:"Table",chair:"Chair",bed:"Bed",storage:"Storage",television:"TV",bathtub:"Bath",sink:"Basin",toilet:"Toilet",stove:"Hob",oven:"Oven",refrigerator:"Fridge",dishwasher:"Dishwasher",washerDryer:"Washer dryer",fireplace:"Fireplace",stairs:"Stairs"};function dt(r){let e=Vl[r];if(e!==void 0)return e;let t=r.replace(/([a-z0-9])([A-Z])/g,"$1 $2").toLowerCase();return t.charAt(0).toUpperCase()+t.slice(1)}function F(r,e,t=`${e}s`){return`${r} ${r===1?e:t}`}var Ei=25,Ci=80,Xs="wa.homeMap.split",Ys="wa.homeMap.tips";function gn(){try{return globalThis.localStorage??void 0}catch{return}}function bn(r){return Number.isFinite(r)?Math.min(Math.max(r,Ei),Ci):50}function Ti(r,e,t){return t<=0?50:bn((r-e)/t*100)}function Zs(){try{let r=gn()?.getItem(Xs);return r==null?50:bn(Number(r))}catch{return 50}}function Qs(r){try{gn()?.setItem(Xs,String(Math.round(r*10)/10))}catch{}}function Js(){try{return gn()?.getItem(Ys)==="1"}catch{return!1}}function ed(r){try{gn()?.setItem(Ys,r?"1":"0")}catch{}}var ql=66;function td(r,e,t,o){if(r<=0||e<=0||t<=0||o<=0)return!1;let n=(i,a)=>Math.min(Math.max(i-ql-24,1)/t,Math.max(a-96,1)/o);return n(r,e/2)>n(r/2,e)*1.1}function D(r,e,t,o=""){return c`<section class="hme-card ${o}">
    <div class="hme-h">${r}${t===void 0?b:c`<span class="hme-h-end">${t}</span>`}</div>
    ${e}
  </section>`}var id="wa-home-map-fold-";function go(r){try{return globalThis.localStorage?.getItem(id+r)==="1"}catch{return!1}}function Lt(r,e){try{globalThis.localStorage?.setItem(id+r,e?"1":"0")}catch{}}function Oe(r,e,t,o,n=""){let i=go(r);return c`<details class="hme-card hme-fold ${n}" ?open=${i} data-fold=${r}
    @toggle=${a=>Lt(r,a.currentTarget.open)}>
    <summary class="hme-h">${e}<span class="hme-h-end">${t??""}<span class="hme-fold-caret" aria-hidden="true">›</span></span></summary>
    <div class="hme-fold-body">${o}</div>
  </details>`}function G(r,...e){return c`<div class="hme-r"><span class="hme-l">${r}</span>${e}</div>`}function W(r,e=!1){return c`<p class="hme-hint ${e?"keep":""}">${r}</p>`}function Xl(r,e,t){return t||r===e?$r:e}var Si=class extends Ir{constructor(t){super(t);this.latest="";this.waiting=!1;if(t.type!==Tr.PROPERTY)throw new Error("keepTyping is for a .value binding")}render(t){return t}update(t,[o]){let n=t.element;this.latest=o;let i=n.matches(":focus");return i&&!this.waiting&&(this.waiting=!0,n.addEventListener("blur",()=>{this.waiting=!1,n.value!==this.latest&&(n.value=this.latest)},{once:!0})),Xl(n.value,o,i)}},rd=Sr(Si),od=3;function Yl(r,e){return r==="\xB0"?1:10**-e}function j(r){let e=r.digits??2,t=r.step??Yl(r.unit,e),o=r.value===void 0?"":mo(r.value,e),n=p=>Math.min(Math.max(p,r.min??-1/0),r.max??1/0),i=p=>mo(p,e)===o,a=p=>{let h=Pi(p.value);if(h===void 0||r.min!==void 0&&h<r.min||r.max!==void 0&&h>r.max||i(h)){p.value=o;return}r.set(h)},s=p=>{let h=p.currentTarget,m=h.querySelector("input");if(m===null||r.disabled===!0||p.button!==0||m.matches(":focus"))return;p.preventDefault();let u=r.value,f=p.clientX,g=!1,w=u;try{h.setPointerCapture(p.pointerId)}catch{}let y=$=>{if(u===void 0)return;let v=$.clientX-f;if(!g&&Math.abs(v)<od)return;g||h.classList.add("scrubbing"),g=!0;let x=$.shiftKey?10:$.altKey?.1:1;w=n(Number((u+(v-Math.sign(v)*od)*t*x).toFixed(e+($.altKey?1:0)))),m.value=mo(w,e),r.preview?.(w)},M=$=>{if(h.removeEventListener("pointermove",y),h.removeEventListener("pointerup",M),h.removeEventListener("pointercancel",M),h.classList.remove("scrubbing"),!g){m.focus(),m.select();return}r.preview?.(void 0),$.type!=="pointercancel"&&w!==void 0&&!i(w)?r.set(w):m.value=o};h.addEventListener("pointermove",y),h.addEventListener("pointerup",M),h.addEventListener("pointercancel",M)},d=r.tag!==void 0&&r.tag.length>1,l=c`<span class="hme-in hme-num ${r.disabled===!0?"off":""}" style=${r.width===void 0?b:`flex:0 0 ${r.width}`}
    title=${r.disabled===!0?b:"Drag sideways to change it, click to type"} @pointerdown=${s}>
    ${r.tag===void 0||d?b:c`<span class="hme-ntag" aria-hidden="true">${r.tag}</span>`}
    <input type="text" inputmode="decimal" aria-label=${r.label} .value=${rd(o)} ?disabled=${r.disabled===!0}
      placeholder=${r.value===void 0?"Mixed":""}
      @change=${p=>a(p.target)}
      @keydown=${p=>{let h=p.target;if(p.key==="Enter"&&h.blur(),p.key==="Escape"&&(h.value=o,h.blur()),(p.key==="ArrowUp"||p.key==="ArrowDown")&&r.value!==void 0){p.preventDefault();let m=Pi(h.value)??r.value,u=n(Number((m+(p.key==="ArrowUp"?1:-1)*t*(p.shiftKey?10:1)).toFixed(e)));h.value=mo(u,e),i(u)||r.set(u)}}} />${r.unit===void 0?b:c`<span class="hme-unit">${r.unit}</span>`}</span>`;return d?c`<div class="hme-lab"><span class="hme-lab-t">${r.tag}</span>${l}</div>`:l}var At=new WeakMap,nd=new WeakMap;function bo(r){let e=r.value.toLowerCase(),t=o=>{let n=At.get(o);n!==void 0&&(At.delete(o),r.preview(void 0),o.value.toLowerCase()!==n&&(nd.set(o,o.value.toLowerCase()),r.set(o.value)))};return c`<input type="color" .value=${X(e)} aria-label=${r.label}
    @input=${o=>{let n=o.target;At.has(n)||At.set(n,e);let i=n.value.toLowerCase();r.preview(i===At.get(n)?void 0:i)}}
    @change=${o=>{let n=o.target,i=n.value.toLowerCase();At.has(n)?t(n):i!==e&&i!==nd.get(n)&&r.set(n.value)}}
    @blur=${o=>t(o.target)} />`}function ve(...r){return c`<div class="hme-fields" style=${`--n:${r.length}`}>${r}</div>`}function Ii(r,...e){return c`<div class="hme-group"><div class="hme-gl">${r}</div>${e}</div>`}function Ft(r){return c`<span class="hme-in"><input type="text" aria-label=${r.label} maxlength=${r.max??100} placeholder=${r.placeholder??""}
    .value=${rd(r.value)}
    @change=${e=>{let t=e.target.value;t.trim()!==r.value.trim()&&r.set(t)}}
    @keydown=${e=>{e.key==="Enter"&&e.target.blur()}} /></span>`}function xe(r){return c`<span class="hme-in hme-sel ${r.cls??""}"><select aria-label=${r.label} @change=${e=>r.set(e.target.value)}>
    ${r.options.map(e=>c`<option value=${e.value} ?disabled=${e.disabled===!0} .selected=${X(e.value===r.value)}>${e.label}</option>`)}
  </select></span>`}function vo(r){return c`<span class="hme-menu ${r.cls??""}"><select aria-label=${r.label} @change=${e=>{let t=e.target,o=t.value;t.value="",o!==""&&r.pick(o)}}>
    <option value="" .selected=${X(!0)}>${r.label}</option>
    ${r.options.map(e=>c`<option value=${e.value} ?disabled=${e.disabled===!0}>${e.label}</option>`)}
  </select><span class="hme-menu-caret" aria-hidden="true">▾</span></span>`}function he(r){return c`<button type="button" class="hme-pic ${r.on?"on":""}" aria-pressed=${r.on?"true":"false"} title=${r.title??r.label}
    @click=${r.click}>${r.picture}<span>${r.label}</span></button>`}function yo(r){return c`<button type="button" class="hme-chip ${r.on?"":"off"}" aria-pressed=${r.on?"true":"false"} aria-label=${r.label}
    @click=${r.click}>${r.on?r.onText:r.offText}</button>`}var Zl={wood:"repeating-linear-gradient(0deg,#b38a61 0 9px,#8e6845 9px 10px)",tile:"linear-gradient(#a9a7a1 1px,transparent 1px) 0 0/10px 10px, linear-gradient(90deg,#a9a7a1 1px,transparent 1px) 0 0/10px 10px, #cbc9c2",stone:"#bcc1c6 linear-gradient(#9da2a6 1px,transparent 1px) 0 0/18px 12px",carpet:"#99928a",plain:"#a8a6a1"},Ql={wood:"#a17a55",tile:"#bdbbb4",stone:"#b0b5ba",carpet:"#8f8880",plain:"#9c9a95"};function Ri(r){return c`<span class="hme-sw" style=${`background:${Zl[r]}`}></span>`}var ad=r=>r.map(([e,t])=>`${Math.round(e*10)/10},${Math.round(t*10)/10}`).join(" ");function Di(r,e=34,t=24){let o=r?.rooms??[];if(o.length===0)return c`<svg class="hme-thumb" width=${e} height=${t} viewBox=${`0 0 ${e} ${t}`} aria-hidden="true">
      <rect x="1" y="1" width=${e-2} height=${t-2} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" stroke-dasharray="3 2" /></svg>`;let n=Io(r),i=4,a=Math.min((e-i*2)/Math.max(n.maxX-n.minX,.5),(t-i*2)/Math.max(n.maxY-n.minY,.5)),s=e/2-(n.minX+n.maxX)/2*a,d=t/2-(n.minY+n.maxY)/2*a;return c`<svg class="hme-thumb" width=${e} height=${t} viewBox=${`0 0 ${e} ${t}`} aria-hidden="true">
    <rect x="0.5" y="0.5" width=${e-1} height=${t-1} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" />
    ${o.map(l=>H`<polygon points=${ad(l.outline.map(([p,h])=>[s+p*a,d+h*a]))} fill="none" stroke="var(--wa-muted)" stroke-width="1.1" />`)}
  </svg>`}function sd(r,e,t=76,o=54){let n=r.outline.map(g=>g[0]),i=r.outline.map(g=>g[1]),a=Math.min(...n),s=Math.max(...n),d=Math.min(...i),l=Math.max(...i),p=8,h=Math.min((t-p*2)/Math.max(s-a,.5),(o-p*2)/Math.max(l-d,.5)),m=t/2-(a+s)/2*h,u=o/2-(d+l)/2*h,f=ad(r.outline.map(([g,w])=>[m+g*h,u+w*h]));return c`<svg class="hme-room-thumb" width=${t} height=${o} viewBox=${`0 0 ${t} ${o}`} aria-hidden="true">
    <rect width=${t} height=${o} rx="8" fill="#121010" />
    <polygon points=${f} fill=${Ql[_o(r)]} stroke="#ece6da" stroke-width="2.5" stroke-linejoin="round" />
    ${e?H`<circle cx=${t*.58} cy=${o*.42} r=${Math.min(t,o)*.22} fill="#ffb648" opacity="0.35" />`:b}
  </svg>`}var dd=.05,Jl=.03,ld=16;function Ai(r){let{hinge:e,shut:t,open:o}=r,n=Math.atan2(o[1]-e[1],o[0]-e[0]),i=Math.atan2(t[1]-e[1],t[0]-e[0])-n;i>Math.PI&&(i-=2*Math.PI),i<-Math.PI&&(i+=2*Math.PI);let a=Math.hypot(t[0]-e[0],t[1]-e[1]),s=[e];for(let d=0;d<=ld;d+=1){let l=n+i*d/ld;s.push([e[0]+Math.cos(l)*a,e[1]+Math.sin(l)*a])}return s}function ep(r){let e=0;for(let t=0;t<r.length;t+=1){let o=r[t],n=r[(t+1)%r.length];e+=o[0]*n[1]-n[0]*o[1]}return e<0?[...r].reverse():r}function tp(r,e){let t=ep(e),o=r;for(let n=0;n<t.length&&o.length>0;n+=1){let i=t[n],a=t[(n+1)%t.length];Math.hypot(a[0]-i[0],a[1]-i[1])<1e-9||(o=aa(o,i,a,1))}return o}function op(r){if(r.length<3)return 0;let e=1/0;for(let t=0;t<r.length;t+=1){let o=r[t],n=r[(t+1)%r.length],i=Math.hypot(n[0]-o[0],n[1]-o[1]);if(i<1e-6)continue;let a=0;for(let s of r)a=Math.max(a,Math.abs((s[0]-o[0])*(n[1]-o[1])-(s[1]-o[1])*(n[0]-o[0]))/i);e=Math.min(e,a)}return e===1/0?0:e}function pd(r,e){return op(tp(r,e))}function np(r,e){if(r.hidden===!0||r.kind==="rug")return!1;let t=r.lift??0;return t>=e?!1:t+r.size[2]>Jl}var Oi=r=>`${r.roomId.toUpperCase()}:${r.index}`,hd=new WeakMap;function lt(r){let e=hd.get(r);if(e!==void 0)return e;let t=ae(r),o=[],n=new Map;for(let m of r.rooms)m.openings.forEach((u,f)=>{if(u.kind!=="door")return;let g={roomId:m.id,index:f};n.set(Oi(g),u.z1);for(let w of Xe(u,m))o.push({door:g,polygon:Ai(w)})});let i=(m,u)=>k(m.roomId,u.roomId)&&m.index===u.index,a=(m,u)=>{let f=fe(t,m.roomId,m.index),g=fe(t,u.roomId,u.index);return f!==void 0&&i(f,u)||g!==void 0&&i(g,m)},s=r.rooms.flatMap(m=>m.objects.map((u,f)=>({roomId:m.id,index:f,object:u,polygon:J(Q(u))}))),d=new Map,l=(m,u,f)=>{let g=Oi(m),w=d.get(g);w===void 0&&(w={door:m,hits:[]},d.set(g,w));let y=w.hits.find(f);y===void 0?w.hits.push(u):y.depth=Math.max(y.depth,u.depth)};for(let[m,u]of o.entries()){for(let g of o.slice(m+1)){if(i(u.door,g.door)||a(u.door,g.door))continue;let w=pd(u.polygon,g.polygon);w<=dd||(l(u.door,{kind:"door",door:g.door,depth:w},y=>y.kind==="door"&&i(y.door,g.door)),l(g.door,{kind:"door",door:u.door,depth:w},y=>y.kind==="door"&&i(y.door,u.door)))}let f=n.get(Oi(u.door))??1/0;for(let g of s){if(!np(g.object,f))continue;let w=pd(u.polygon,g.polygon);w<=dd||l(u.door,{kind:"object",roomId:g.roomId,object:g.index,depth:w},y=>y.kind==="object"&&k(y.roomId,g.roomId)&&y.object===g.index)}}let p=m=>r.rooms.findIndex(u=>k(u.id,m.roomId))*1e3+m.index,h=[...d.values()].sort((m,u)=>p(m.door)-p(u.door));return hd.set(r,h),h}function _t(r,e,t){return lt(r).find(o=>k(o.door.roomId,e)&&o.door.index===t)}function ip(r,e,t){let o=i=>{let a=r.rooms.find(s=>k(s.id,i));return a===void 0?void 0:T(a)},n=fe(ae(r),e.roomId,e.index);if(n!==void 0&&!k(n.roomId,t.roomId)){let i=o(n.roomId);if(i!==void 0)return`the door to ${i}`}if(!k(e.roomId,t.roomId)){let i=o(e.roomId);if(i!==void 0)return`the door of ${i}`}return"another door"}function Li(r,e,t){if(t.kind==="door")return`Swings into ${ip(r,t.door,e)}`;let o=r.rooms.find(i=>k(i.id,t.roomId))?.objects[t.object];return`Swings into the ${o===void 0?"something":(se(o.model)?.name??dt(o.kind)).toLowerCase()}`}function vn(r,e,t){let o=!1,n=r.floors.map(i=>{let a=i.rooms.findIndex(h=>k(h.id,e)),s=i.rooms[a],d=s?.openings[t];if(s===void 0||d===void 0||d.kind!=="door")return i;o=!0;let l=s.openings.slice();l[t]={...d,a:d.b,b:d.a};let p=i.rooms.slice();return p[a]={...s,openings:l},{...i,rooms:p}});return o?Br({...r,floors:n}):void 0}function cd(r,e,t,o){let n=r.floors.find(d=>k(d.id,e))?.rooms.find(d=>k(d.id,t)),i=n?.openings[o];if(n===void 0||i===void 0||Xe(i,n).length!==1)return!1;let s=vn(r,t,o)?.floors.find(d=>k(d.id,e));return s!==void 0&&_t(s,t,o)===void 0}function md(r){let e=lt(r);return{doors:e.length,depth:e.reduce((t,o)=>t+o.hits.reduce((n,i)=>n+i.depth,0),0)}}var rp=(r,e)=>r.doors<e.doors;function Fi(r,e){let t=i=>i.floors.find(a=>k(a.id,e)),o=r,n=!1;for(let i=0;i<2;i+=1){let a=t(o);if(a===void 0)return;let s=lt(a);if(s.length===0)break;let d=!1;for(let l of s){let p=t(o);if(_t(p,l.door.roomId,l.door.index)===void 0)continue;let h=p.rooms.find(g=>k(g.id,l.door.roomId)),m=h?.openings[l.door.index];if(h===void 0||m===void 0||Xe(m,h).length!==1)continue;let u=vn(o,l.door.roomId,l.door.index),f=u===void 0?void 0:t(u);f===void 0||!rp(md(f),md(p))||(o=u,n=d=!0)}if(!d)break}return n?o:void 0}var ap="#E8A33D";function ud(r){return r.walls.reduce((e,t)=>Math.max(e,t.t),0)||Fo}function fd(r){return r.rooms.reduce((e,t)=>e+kt(r,t).length,0)}function gd(r){return r.rooms.find(e=>kt(r,e).length>0)}function _i(r,e,t){let o=r.floors.find(s=>k(s.id,e));if(o===void 0)return;let n=o.rooms.filter(s=>t===void 0||k(s.id,t)).flatMap(s=>kt(o,s).map(d=>({room:s,edge:d}))),i=r,a=0;for(let{room:s,edge:d}of n){let l=oo(i,s.id,d.a,d.b,ud(s));l!==void 0&&(i=l,a+=1)}return a===0?void 0:i}function bd(r){return r.floor.rooms.flatMap(e=>kt(r.floor,e).map(t=>{let[o,n]=r.toScreen(t.a),[i,a]=r.toScreen(t.b);return H`<line class="hme-open-edge" x1=${o.toFixed(1)} y1=${n.toFixed(1)} x2=${i.toFixed(1)} y2=${a.toFixed(1)}
      stroke=${ap} stroke-width="2" stroke-dasharray="6 5" stroke-linecap="round" pointer-events="none" />`}))}function sp(r){return`${r.side.charAt(0).toUpperCase()}${r.side.slice(1)}, ${ne(r.length)}`}function yn(r,e){let t=kt(r.floor,e);if(t.length===0)return b;let o=ud(e);return D(t.length===1?"Open edge":"Open edges",c`
    ${t.map(n=>c`<div class="hme-r"><span class="hme-l">${sp(n)}</span>
      <button type="button" class="hme-tb" title="Put a wall along this edge"
        @click=${()=>r.apply(i=>oo(i,e.id,n.a,n.b,o))}>Add wall</button></div>`)}
    ${t.length<2?b:c`<button type="button" class="hme-tb hme-wide" title="Put a wall along every open edge of this room"
      @click=${()=>r.apply(n=>_i(n,r.floor.id,e.id))}>Add all ${t.length} walls</button>`}
    ${W("No wall here and no room beside it, so the house is open: dashed on the plan. Leave it for a stairwell or an open side.",!0)}`)}var vd=new WeakMap;function dp(r,e){let t=vd.get(e);if(t!==void 0)return t;let o=Fi(r,e.id)!==void 0;return vd.set(e,o),o}function lp(r){return`${F(r,"gap")} in the walls`}function pp(r){return`${F(r,"door")} ${r===1?"swings":"swing"} into something`}function yd(r){let e=r.floor,t=fd(e),o=lt(e);if(t===0&&o.length===0)return b;let n=e.id,i=()=>{let p=gd(e);p!==void 0&&r.select({kind:"room",roomId:p.id})},a=()=>{let p=o[0];p!==void 0&&r.select({kind:"opening",roomId:p.door.roomId,opening:p.door.index})},s=o.length>0&&dp(r.doc,e),d=t+o.length,l=(p,h)=>c`<div class="hme-fix">
    <span class="hme-fix-dot"></span>
    <div class="hme-fix-t">${p}<span class="hme-fix-acts">${h}</span></div></div>`;return D("Check",c`
    ${t===0?b:l(c`<p @click=${i}><b>${lp(t)}.</b> Dashed amber on the plan. Leave one open for a stairwell.</p>`,c`<button type="button" class="hme-tb hme-blue" title="Put a wall along every gap of this floor"
          @click=${()=>r.apply(p=>_i(p,n))}>Add walls</button>
        <button type="button" class="hme-tb" title="Pick the first room with a gap" @click=${i}>Show</button>`)}
    ${o.length===0?b:l(c`<p @click=${a}><b>${pp(o.length)}.</b> ${s?"Hung from their other side, fewer of them do.":"Hanging them the other way does not help. Show picks the first one."}</p>`,c`${s?c`<button type="button" class="hme-tb hme-blue" title="Hang each of these doors from the side where it swings free"
          @click=${()=>r.apply(p=>Fi(p,n))}>Fix swings</button>`:b}
        <button type="button" class="hme-tb" title="Pick the first door that swings into something" @click=${a}>Show</button>`)}
    ${W("Each fix is one step, so Undo puts it back.",!0)}`,String(d),"hme-checks")}function zi(r,e,t,o={}){let n=(o.reach??10)/t,i,a=n;for(let l of[...r.rooms.flatMap(p=>p.outline),...o.corners??[]]){let p=Math.hypot(l[0]-e[0],l[1]-e[1]);p<=a&&(i=l,a=p)}if(i!==void 0)return[i[0],i[1]];let[s,d]=e;if(o.grid!==void 0&&o.grid>0&&(s=Math.round(s/o.grid)*o.grid,d=Math.round(d/o.grid)*o.grid),o.from!==void 0){let l=8/t;Math.abs(e[0]-o.from[0])<=l&&(s=o.from[0]),Math.abs(e[1]-o.from[1])<=l&&(d=o.from[1])}return[Math.round(s*100)/100,Math.round(d*100)/100]}var He=.1,Ue=.05,wn=class{constructor(e){this.grid=e;this.active=!1;this.points=[]}start(e){this.active=!0,this.points=[],this.hoverAt=void 0,e.select(void 0),e.redraw()}stop(e){this.active=!1,this.points=[],this.hoverAt=void 0,e?.redraw()}snap(e,t){return zi(e.floor,t,e.view.scale,{...this.points.length>0?{from:this.points[this.points.length-1]}:{},...e.toggles.grid?{grid:this.grid}:{},corners:this.points})}closes(e,t){let o=this.points[0];return o!==void 0&&this.points.length>=3&&Math.hypot(t[0]-o[0],t[1]-o[1])*e.view.scale<=10}pointerDown(e,t,o){if(!this.active||t.button!==0)return!1;let n=this.snap(e,o);if(this.closes(e,n))return this.finish(e),!0;let i=this.points[this.points.length-1];return(i===void 0||Math.hypot(n[0]-i[0],n[1]-i[1])>=.05)&&this.points.push(n),e.redraw(),!0}hover(e,t){this.active&&(this.hoverAt=t===void 0?void 0:this.snap(e,t),e.redraw())}keyDown(e,t){return this.active?t.key==="Escape"?(this.stop(e),!0):t.key==="Enter"?(this.points.length>=3&&this.finish(e),!0):t.key==="Backspace"||t.key==="Delete"?(this.points.pop(),e.redraw(),!0):!1:!1}async finish(e){let t=this.points.slice();if(this.stop(e),t.length<3)return;let o=await e.ask({title:"Name the room",label:"Name",value:"Room",ok:"Add room"});if(o===void 0)return;let n=e.newId(),i=e.floor.id;e.apply(a=>Da(a,i,n,t,o),{select:{kind:"room",roomId:n}})||e.note("err","That room could not be added. Draw at least three corners round some floor.")}overlay(e){if(!this.active)return b;let t=this.points.map(d=>e.toScreen(d)),o=this.hoverAt===void 0?void 0:e.toScreen(this.hoverAt),n=this.hoverAt!==void 0&&this.closes(e,this.hoverAt),i=[...t,...o!==void 0?[o]:[]].map(([d,l])=>`${d.toFixed(1)},${l.toFixed(1)}`).join(" "),a=this.points[this.points.length-1],s=a!==void 0&&this.hoverAt!==void 0?Math.hypot(this.hoverAt[0]-a[0],this.hoverAt[1]-a[1]):0;return H`<g class="hme-draw">
      ${t.length>=3?H`<polygon points=${t.map(([d,l])=>`${d},${l}`).join(" ")} fill="rgba(91,141,239,0.14)" stroke="none" />`:b}
      <polyline points=${i} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />
      ${t.map(([d,l],p)=>H`<circle cx=${d} cy=${l} r=${p===0&&n?8:5} fill=${p===0&&n?"#5b8def":"#fff"} stroke="#5b8def" stroke-width="2" />`)}
      ${o!==void 0&&!n?H`<circle cx=${o[0]} cy=${o[1]} r="4" fill="#5b8def" />`:b}
      ${o!==void 0&&s>.05?H`<g class="hme-tag"><rect x=${o[0]+10} y=${o[1]-26} width="58" height="18" rx="9" fill="#5b8def" />
        <text x=${o[0]+39} y=${o[1]-13} fill="#fff" text-anchor="middle">${s.toFixed(2)} m</text></g>`:b}
    </g>`}hint(){return this.points.length===0?"Click to put down the first corner":this.points.length<3?"Click to add corners":"Click the first corner or press Enter to close the room"}};var hp=15;function ji(r,e,t){let o,n=hp;for(let i of r.pins){let a=e(i.at),s=Math.hypot(a[0]-t[0],a[1]-t[1]);s<=n&&(o=i,n=s)}return o}function kn(r,e,t){let o;for(let n of t===void 0?r.rooms:[t])n.objects.forEach((i,a)=>{if(i.hidden===!0)return;let s=J(Q(i));if(!Y(s,e))return;let d=Math.abs(zo(s));(o===void 0||d<o.area)&&(o={thing:{room:n,index:a,object:i},area:d})});return o?.thing}var mp=10,cp=6,up=12;function $d(r,e,t){let o=t[0]-e[0],n=t[1]-e[1],i=o*o+n*n,a=i<=0?0:Math.max(0,Math.min(1,((r[0]-e[0])*o+(r[1]-e[1])*n)/i));return Math.hypot(r[0]-(e[0]+o*a),r[1]-(e[1]+n*a))}function fp(r,e,t){let o=e(t),n;for(let i of r.rooms)i.openings.forEach((a,s)=>{let d=$d(o,e(a.a),e(a.b));d<=mp&&(n===void 0||d<n.d)&&(n={roomId:i.id,opening:s,d})});return n===void 0?void 0:{roomId:n.roomId,opening:n.opening}}function wd(r,e,t,o,n){let i=e(t),a;for(let s of r.rooms){let d=n!==void 0&&k(s.id,n);V(s).forEach((l,p)=>{let h=$d(i,e(l.a),e(l.b));if(h>o)return;let m=d?h-4:h;(a===void 0||m<a.d)&&(a={roomId:s.id,wall:p,d:m})})}return a===void 0?void 0:{roomId:a.roomId,wall:a.wall}}function Ni(r,e,t,o){let n=fp(r,e,t);if(n!==void 0)return{kind:"opening",...n};let i=wd(r,e,t,cp,o);if(i!==void 0)return{kind:"wall",...i};if(kn(r,t)!==void 0)return;let a=wd(r,e,t,up,o);return a===void 0?void 0:{kind:"wall",...a}}function xd(r,e,t,o){let n=ji(r,e,e(t));if(n!==void 0){let d=we(r,n.id);return d===void 0?{kind:"pin",pinId:n.id}:{kind:"object",roomId:d.roomId,object:d.object}}let i=Ni(r,e,t,o);if(i!==void 0)return i;let a=kn(r,t);if(a!==void 0)return{kind:"object",roomId:a.room.id,object:a.index};let s=q(r,t);return s===void 0?void 0:{kind:"room",roomId:s.id}}function Ki(r,e){if(r!==void 0){if(r.kind==="room")return e?.kind==="room"&&k(e.roomId,r.roomId)?void 0:r;if(r.kind==="object")return De(e).some(o=>k(o.roomId,r.roomId)&&o.object===r.object)?void 0:r;if(r.kind==="pin")return(e?.kind==="pin"?[e.pinId]:e?.kind==="pins"?e.pinIds:[]).some(o=>k(o,r.pinId))?void 0:r;if(r.kind==="wall"||r.kind==="opening")return Ot(r,e)?void 0:r}}var Md="rgba(91,141,239,0.14)",gp="rgba(91,141,239,0.07)",Mn="rgba(150,186,255,0.75)",kd=r=>`${r[0].toFixed(1)},${r[1].toFixed(1)}`;function Hd(r,e,t,o){let n=Ki(e,t);if(n===void 0)return b;if(n.kind==="pin"){let s=r.pins.find(p=>k(p.id,n.pinId));if(s===void 0)return b;let[d,l]=o(s.at);return H`<g class="hme-hover" pointer-events="none"><circle cx=${d.toFixed(1)} cy=${l.toFixed(1)} r="18" fill=${Md} stroke=${Mn} stroke-width="1.5" /></g>`}let i=r.rooms.find(s=>k(s.id,n.roomId));if(i===void 0)return b;if(n.kind==="wall"||n.kind==="opening"){let s=n.kind==="wall"?V(i)[n.wall]:i.openings[n.opening];if(s===void 0)return b;let[d,l]=o(s.a),[p,h]=o(s.b);return H`<g class="hme-hover" pointer-events="none"><line x1=${d.toFixed(1)} y1=${l.toFixed(1)} x2=${p.toFixed(1)} y2=${h.toFixed(1)} stroke=${Mn} stroke-width="6" stroke-linecap="round" /></g>`}if(n.kind==="object"){let s=i.objects[n.object];if(s===void 0)return b;let d=J(Q(s)).map(l=>kd(o(l))).join(" ");return H`<g class="hme-hover" pointer-events="none"><polygon points=${d} fill=${Md} stroke=${Mn} stroke-width="1.5"
      stroke-dasharray=${s.hidden===!0?"4 3":"none"} stroke-linejoin="round" /></g>`}if(i.outline.length<3)return b;let a=i.outline.map(s=>kd(o(s))).join(" ");return H`<g class="hme-hover" pointer-events="none"><polygon points=${a} fill=${gp} stroke=${Mn} stroke-width="1.5" stroke-linejoin="round" /></g>`}var Pd={x:0,y:0,turn:0};function Td(r){return r.map((e,t)=>({f:e,i:t})).sort((e,t)=>e.f.story-t.f.story||e.i-t.i).map(({f:e})=>e)}function Ui(r,e){let t=Td(r),o=t.findIndex(n=>n.id.toUpperCase()===e.toUpperCase());return o>0?t[o-1]:void 0}function $n(r){let e=r.rooms.flatMap(n=>n.outline);if(e.length===0)return;let t=e.map(n=>n[0]),o=e.map(n=>n[1]);return[(Math.min(...t)+Math.max(...t))/2,(Math.min(...o)+Math.max(...o))/2]}function xn(r,e){let t=Td(r)[0];if(t===void 0||t.id.toUpperCase()===e.id.toUpperCase())return Pd;if(e.place!==void 0)return e.place;let o=$n(e),n=$n(t);return o===void 0||n===void 0?Pd:{x:n[0]-o[0],y:n[1]-o[1],turn:0}}function ht(r,e){let t=r.turn*Math.PI/180,o=Math.cos(t),n=Math.sin(t);return[r.x+e[0]*o+e[1]*n,r.y-e[0]*n+e[1]*o]}function bp(r,e){let t=r.turn*Math.PI/180,o=Math.cos(t),n=Math.sin(t),i=e[0]-r.x,a=e[1]-r.y;return[o*i-n*a,n*i+o*a]}function Ed(r,e,t){let o=ht(r,t),n=ht({x:0,y:0,turn:e},t);return{x:o[0]-n[0],y:o[1]-n[1],turn:e}}function vp(r,e){let t=Ui(r.floors,e.id);if(t===void 0)return[];let o=r.floors.map(a=>a.id.toUpperCase()===e.id.toUpperCase()?e:a),n=xn(o,t),i=xn(o,e);return t.rooms.map(a=>a.outline.map(s=>bp(i,ht(n,s))))}var pt=.25,wo=.05,yp=10;function Bi(r,e){let t=[];for(let o of r){let n=ge(o);if(n!==void 0)for(let i=Math.floor(n.minY/e)*e+e/2;i<n.maxY;i+=e)for(let a=Math.floor(n.minX/e)*e+e/2;a<n.maxX;a+=e)Y(o,[a,i])&&t.push([a,i])}return t}function Wi(r,e){let t=ge(r.flat());if(t===void 0)return;let o=t.minX,n=t.minY,i=Math.max(1,Math.ceil((t.maxX-o)/e)),a=Math.max(1,Math.ceil((t.maxY-n)/e)),s=new Uint8Array(i*a),d=0;for(let p of Bi(r,e)){let h=Math.floor((p[0]-o)/e),m=Math.floor((p[1]-n)/e);h<0||m<0||h>=i||m>=a||s[m*i+h]===1||(s[m*i+h]=1,d+=1)}return{holds:(p,h)=>{let m=Math.floor((p-o)/e),u=Math.floor((h-n)/e);return m>=0&&u>=0&&m<i&&u<a&&s[u*i+m]===1},count:d,middle:[(t.minX+t.maxX)/2,(t.minY+t.maxY)/2],reach:Math.max(t.maxX-t.minX,t.maxY-t.minY)}}function Cd(r,e,t,o){let n=0;for(let a of r)e.holds(a[0]+t,a[1]+o)&&(n+=1);let i=r.length+e.count-n;return i===0?0:n/i}var Sd=r=>((r+180)%360+360)%360-180;function wp(r,e){let t=r.floors.find(M=>M.id.toUpperCase()===e.toUpperCase());if(t===void 0)return;let o=Ui(r.floors,t.id);if(o===void 0||o.rooms.length===0||t.rooms.length===0)return;let n=xn(r.floors,o),i=o.rooms.map(M=>M.outline.map($=>ht(n,$))),a=t.rooms.map(M=>M.outline.map($=>[$[0],$[1]])),s=Wi(i,pt),d=Wi(i,wo),l=$n(t);if(s===void 0||d===void 0||l===void 0)return;let p=Bi(a,pt),h=Bi(a,wo),m=Wi(a,pt),u=Math.min(yp,(s.reach+(m?.reach??0))/2),f=Math.ceil(u/pt),g=t.place?.turn??0,w=[];for(let M=0;M<4;M+=1){let $=Sd(g+90*M),v={x:0,y:0,turn:$},x=ht(v,l),R=s.middle[0]-x[0],S=s.middle[1]-x[1],_=p.map(E=>ht(v,E)),I={dx:R,dy:S,match:-1};for(let E=-f;E<=f;E+=1)for(let O=-f;O<=f;O+=1){let U=R+O*pt,ee=S+E*pt,B=Cd(_,s,U,ee);B>I.match&&(I={dx:U,dy:ee,match:B})}w.push({turn:$,...I,fine:h.map(E=>ht(v,E))})}w.sort((M,$)=>$.match-M.match);let y;for(let M of w.slice(0,2)){let $=Math.round(pt/wo);for(let v=-$;v<=$;v+=1)for(let x=-$;x<=$;x+=1){let R=M.dx+x*wo,S=M.dy+v*wo,_=Cd(M.fine,d,R,S);(y===void 0||_>y.match+1e-9)&&(y={place:{x:R,y:S,turn:M.turn},match:_})}}return y}var Mo,Mp=(r,e)=>r!==void 0&&Math.abs(r.x-e.x)<.006&&Math.abs(r.y-e.y)<.006&&Math.abs(Sd(r.turn-e.turn))<.06;function kp(r){let e=Math.round(r*100);return e>=60?`Lined up. ${e}% of the floor matches the one below.`:`Lined up as well as it goes: ${e}% matches. Check the walls by eye.`}var zt="floor-line-up";function Id(r){return r.selection!==void 0||!go(zt)?[]:vp(r.doc,r.floor).map(e=>{let t=e.map(o=>r.toScreen(o).map(n=>n.toFixed(1)).join(",")).join(" ");return H`<polygon class="hme-floor-below" points=${t} fill="rgba(120,170,255,0.06)" stroke="#78AAFF"
      stroke-width="1.5" stroke-dasharray="5 4" stroke-linejoin="round" pointer-events="none" />`})}function Rd(r,e){let t=Ui(r.doc.floors,e.id);if(t===void 0)return b;let o=r.doc.floors.map(u=>u.id.toUpperCase()===e.id.toUpperCase()?e:u),n=xn(o,e),i=$n(e)??[0,0],a=e.id,s=u=>f=>ni(f,a,u),d=u=>({set:f=>r.apply(s(u(f))),preview:f=>r.preview(f===void 0?void 0:s(u(f)))}),l=u=>r.apply(s(Ed(n,n.turn+u,i))),p=go(zt),h=()=>{let u=wp(r.doc,a);u!==void 0&&(Mo={floorId:a,place:{x:Math.round(u.place.x*100)/100,y:Math.round(u.place.y*100)/100,turn:Math.round(u.place.turn*100)/100},match:u.match},Lt(zt,!0),r.apply(s(u.place)))},m=Mo!==void 0&&Mo.floorId.toUpperCase()===a.toUpperCase()&&Mp(e.place,Mo.place)?kp(Mo.match):void 0;return c`<details class="hme-card hme-fold" ?open=${p} data-fold=${zt}
    @toggle=${u=>{let f=u.currentTarget.open;f!==go(zt)&&(Lt(zt,f),r.redraw())}}>
    <summary class="hme-h">Line up over ${K(t)}<span class="hme-h-end">${e.place===void 0?"Centred":"Placed"}<span class="hme-fold-caret" aria-hidden="true">›</span></span></summary>
    <div class="hme-fold-body">
      <button type="button" class="hme-tb hme-blue hme-wide" title="Find where this floor's rooms lie best over the floor below, and put it there"
        @click=${h}>Line up for me</button>
      ${m===void 0?b:c`<p class="hme-text" role="status">${m}</p>`}
      ${W(`${K(t)} shows dashed on the plan. Or drag a number sideways to move this floor over it until the walls match.`,!0)}
      ${ve(j({tag:"Across",label:"Across",value:n.x,unit:"m",min:-500,max:500,...d(u=>({...n,x:u}))}),j({tag:"Down",label:"Down",value:n.y,unit:"m",min:-500,max:500,...d(u=>({...n,y:u}))}),j({tag:"Turn",label:"Turn",value:n.turn,unit:"\xB0",digits:1,min:-180,max:180,...d(u=>Ed(n,u,i))}))}
      <div class="hme-row-end">
        <button type="button" class="hme-tb" title="Turn this floor a quarter one way" @click=${()=>l(-90)}>−90°</button>
        <button type="button" class="hme-tb" title="Turn this floor a quarter the other way" @click=${()=>l(90)}>+90°</button>
        <button type="button" class="hme-tb" ?disabled=${e.place===void 0} title="Put this floor back in the middle of the lowest floor, not turned"
          @click=${()=>r.apply(u=>ni(u,a,void 0))}>Centre</button>
      </div>
    </div>
  </details>`}var ko="stairsFlight",$p=.05,xp=.6;function Hp(r){return/stair/i.test(r.name??"")&&!r.objects.some(e=>e.kind==="stairs")}function Pn(r,e){let t=jo(r);if(t===void 0)return;let o=Fo/2+$p,n=[{long:t.u,side:t.v,l0:t.a0,l1:t.a1,s0:t.c0,s1:t.c1},{long:t.v,side:t.u,l0:t.c0,l1:t.c1,s0:t.a0,s1:t.a1}].sort((d,l)=>l.l1-l.l0-(d.l1-d.l0)),i=r.openings.filter(d=>d.kind!=="window"),a=(d,l)=>d[0]*l[0]+d[1]*l[1],s;for(let d of n){let l=Math.min(e.size[1],d.l1-d.l0-2*o),p=Math.min(e.size[0],d.s1-d.s0-2*o);if(l<1||p<xp)continue;let m=[(d.l0+d.l1)/2,d.l0+o+l/2,d.l1-o-l/2];for(let u of[d.s0,d.s1])for(let f of m){let g=i.filter($=>{if(Math.abs(a($.a,d.side)-u)>.3||Math.abs(a($.b,d.side)-u)>.3)return!1;let v=a($.a,d.long),x=a($.b,d.long);return Math.max(v,x)>f-l/2&&Math.min(v,x)<f+l/2}).length;if(s!==void 0&&g>=s.blocks)continue;let w=u===d.s0?u+o+p/2:u-o-p/2,y=Math.atan2(-d.long[0],d.long[1]),M=r.height>0?r.height:e.size[2];if(s={c:[f*d.long[0]+w*d.side[0],f*d.long[1]+w*d.side[1]],size:[Hn(p),Hn(l),Hn(M)],turn:Hn(-y*180/Math.PI),blocks:g},g===0)return Dd(s)}}return s===void 0?void 0:Dd(s)}var Hn=r=>Math.round(r*100)/100;function Dd(r){return{c:r.c,size:r.size,turn:r.turn}}function Pp(r,e){let t=se(ko),o=r.floors.flatMap(a=>a.rooms).find(a=>k(a.id,e));if(t===void 0||o===void 0)return;let n=Pn(o,t);if(n===void 0)return;let i=Bo(r,e,t,n.c);if(i!==void 0)return Et(i,e,o.objects.length,{c:n.c,size:n.size,turn:n.turn})}function Od(r,e){if(!Hp(e))return b;let t=se(ko);if(t===void 0||Pn(e,t)===void 0)return b;let o=e.objects.length;return D("Stairs",c`
    <p class="hme-text">This room has no stairs drawn in it yet.</p>
    <button type="button" class="hme-tb hme-blue hme-wide" title="Put a flight of stairs in this room, sized to fit"
      @click=${()=>r.apply(n=>Pp(n,e.id),{select:{kind:"object",roomId:e.id,object:o}})}>Add stairs here</button>
    ${W("Drag it or its corners after, to match the real stairs.",!0)}`)}function Ep(r,e){return e.kind!=="stairs"?!1:rt(e)?.id!==ko?!0:!J(Q(e)).every(t=>ta(r,t))}function Cp(r,e,t){let o=se(ko),n=r.floors.flatMap(s=>s.rooms).find(s=>k(s.id,e));if(o===void 0||n===void 0||n.objects[t]===void 0)return;let i=Pn(n,o);if(i===void 0)return;let a=Uo(r,e,t,o)??r;return Et(a,e,t,{c:i.c,size:i.size,turn:i.turn,lift:0})}var Tp={above:"Picked for you: a floor is above this one, so they go up.",top:"Picked for you: no floor is above this one, so they go down.",alone:"Picked for you: no floor is above or below this one, so they go up."};function Ad(r,e,t,o){if(o.kind!=="stairs")return b;let n=r.doc.floors.map(p=>k(p.id,r.floor.id)?r.floor:p),i=la(n,r.floor.id,o),a=p=>r.apply(h=>Pa(h,e.id,t,p)),s=se(ko),d=Ep(e,o)&&s!==void 0&&Pn(e,s)!==void 0,l=o.goes===void 0?Tp[da(n,r.floor.id)]:i?"They go down from this floor.":"They go up from this floor.";return D("Goes",c`
    <div class="hme-r tight"><span class="hme-grow">From this floor</span>
      <div class="hme-seg" role="group" aria-label="Which way the stairs go">
        <button type="button" class=${i?"":"on"} aria-pressed=${i?"false":"true"} title="The stairs go up from this floor" @click=${()=>a("up")}>Up</button>
        <button type="button" class=${i?"on":""} aria-pressed=${i?"true":"false"} title="The stairs go down from this floor" @click=${()=>a("down")}>Down</button>
      </div></div>
    ${W(l,!0)}
    ${d||o.goes!==void 0?c`<div class="hme-row-end">
      ${d?c`<button type="button" class="hme-tb" title="Make it a flight of stairs that fits inside this room, clear of its doors"
        @click=${()=>r.apply(p=>Cp(p,e.id,t))}>Fit to the room</button>`:b}
      ${o.goes===void 0?b:c`<button type="button" class="hme-tb" title="Go by the floors of the map again" @click=${()=>a(void 0)}>Let HouseLit pick</button>`}</div>`:b}`)}var Gi;function En(){return Gi??=import("./scene3d-MWGYNLVP.js").catch(r=>{throw Gi=void 0,r}),Gi}function Vi(r){return new URL("furniture/",r).href}var qi={wood:"Wood",tile:"Tile",stone:"Stone",carpet:"Carpet",plain:"Plain"},Sp={wood:[{name:"Light oak",hex:"#D9B88A"},{name:"Oak",hex:"#B98B5A"},{name:"Walnut",hex:"#6B4A32"},{name:"Grey wash",hex:"#9A948C"}],tile:[{name:"White",hex:"#E9E7E2"},{name:"Grey",hex:"#8E8E8A"},{name:"Black",hex:"#2E2E30"},{name:"Terracotta",hex:"#B4664A"}],stone:[{name:"Light",hex:"#C9C3B8"},{name:"Sand",hex:"#B8A98E"},{name:"Slate",hex:"#5E6468"}],carpet:[{name:"Grey",hex:"#8E8E93"},{name:"Beige",hex:"#CBB9A0"},{name:"Navy",hex:"#2E4A7D"},{name:"Green",hex:"#4F6B4A"}],plain:[{name:"White",hex:"#E9E7E2"},{name:"Grey",hex:"#8E8E8A"},{name:"Black",hex:"#2E2E30"}]},Ip=[{name:"White",hex:"#F2F0EB"},{name:"Warm white",hex:"#EDE6D8"},{name:"Greige",hex:"#CFC6B8"},{name:"Sage",hex:"#A3B09A"},{name:"Blue grey",hex:"#8C9AA6"},{name:"Charcoal",hex:"#3E4044"}];function Xi(r){let e=r.mixed===!0,t=e?void 0:r.now?.toUpperCase(),o=t!==void 0&&!r.presets.some(n=>n.hex===t);return c`<div class="hme-r top"><span class="hme-l">${r.word}</span>
    <div class="hme-chips hme-colours" role="group" aria-label=${`${r.word} colour`}>
      <button type="button" class="hme-chip sel ${t===void 0&&!e?"on":""}" aria-pressed=${t===void 0&&!e?"true":"false"}
        title=${r.defaultTitle} @click=${()=>r.set(void 0)}>Default</button>
      ${r.presets.map(n=>c`<button type="button" class="hme-colour ${t===n.hex?"on":""}" style=${`--c:${n.hex}`}
        title=${n.name} aria-label=${`${r.word}: ${n.name}`} aria-pressed=${t===n.hex?"true":"false"} @click=${()=>r.set(n.hex)}></button>`)}
      <label class="hme-chip sel hme-pick ${o?"on":""}" title=${r.customTitle}>${o?c`<span class="hme-swatch" style=${`background:${t}`}></span>`:b}Custom
        ${bo({value:t??r.presets[0].hex,label:r.customLabel,preview:r.preview,set:r.set})}</label>
    </div></div>
    ${e?W(`Mixed: their ${r.word.toLowerCase()} colours differ. Pick one to set them all.`,!0):b}`}var Rp=H`<svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
  <path d="M2.5 4h11M6.5 4V2.6h3V4M4 4l.7 9.4h6.6L12 4M6.6 6.6v4.6M9.4 6.6v4.6" /></svg>`,Cn=15,Dp=[{a:0,c:0},{c:0},{a:1,c:0},{a:1},{a:1,c:1},{c:1},{a:0,c:1},{a:0}];function Op(r,e){let t=(Math.atan2(e,r)*180/Math.PI+180)%180;return["ew-resize","nwse-resize","ns-resize","nesw-resize"][Math.round(t/45)%4]}function Ap(r,e){let t=e===0?"":` Its ${F(e,"device")} come${e===1?"s":""} off the map too.`;return`${T(r)} comes off the map.${t} A scanned room comes back only by scanning it again on the iPhone. Undo brings it back while this page is open.`}function Ee(r){return se(r.model)?.name??dt(r.kind)}function Ld(r){let e=r.map(t=>Ee(t.object));return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function jt(r){return r.kind==="lamp"||rt(r)?.kind==="lamp"}function Zi(r,e){let t=Se(r,e);return t.kind==="light"&&t.on}function Lp(r,e){let t=Ot(e.sel,r.hover);return c`<div class="hme-ly ${e.picked?"on":""} ${t?"hov":""} ${e.hidden?"hid":""}"
    @pointerenter=${()=>r.setHover(e.sel)} @pointerleave=${()=>r.setHover(void 0)}>
    <button type="button" class="hme-ly-main" aria-pressed=${e.picked?"true":"false"} title=${e.title} @click=${e.pick}>
      ${e.icon}<span class="hme-ly-nm">${e.name}</span><span class="hme-ly-end">${e.end}</span></button>
    ${e.eye===void 0?b:c`<button type="button" class="hme-eye" aria-label=${`${e.hidden?"Show":"Hide"} ${e.name}`}
      title=${e.hidden?"Show it again on the map, the tiles and the watch":"Hide it on the map, the tiles and the watch; it stays listed here"}
      @click=${e.eye}>${Fp(!e.hidden)}</button>`}
  </div>`}function Fp(r){return c`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z" fill="none" stroke="currentColor" stroke-width="1.3"></path>
    ${r?H`<circle cx="8" cy="8" r="2" fill="currentColor"></circle>`:H`<path d="M2.5 13.5l11-11" stroke="currentColor" stroke-width="1.3"></path>`}</svg>`}function Fd(r){let e=r[0]?.room.id;return e!==void 0&&r.every(t=>k(t.room.id,e))?{kind:"room",roomId:e}:void 0}var _p=["fabric","wood"],mt=r=>r.map(e=>({roomId:e.room.id,object:e.index}));function Yi(r){return ha(rt(r))}function Qi(r,e,t){let o=ys(r,t).filter(a=>e===""||a.group===e);if(r.trim()!==""||e!=="")return[{title:e===""?"Found":e,pieces:o}];let n=[],i=t===void 0?[]:o.filter(a=>a.kind===t);i.length>0&&n.push({title:`${dt(t)} pieces`,pieces:i});for(let a of it.groups){let s=o.filter(d=>d.group===a&&!i.includes(d));s.length>0&&n.push({title:a,pieces:s})}return n}function zp(r){return Math.round(ia(r.turn)*10)/10}var N=r=>r.toFixed(1),Pe=r=>`${r[0].toFixed(1)},${r[1].toFixed(1)}`,Ji="room-card",Tn=class{constructor(){this.draw=new wn(He);this.guides=[];this.dragging=!1;this.resizing=!1;this.pickerQuery="";this.pickerGroup="";this.pickerFocus=!1;this.thumbs=new Map;this.askedThumbs=new Set;this.thumbFrame=0}openPicker(e,t,o){this.picker=o===void 0?{roomId:t.id}:{roomId:t.id,index:o},this.pickerQuery="",this.pickerGroup="",this.pickerFocus=!0,e.redraw()}closePicker(e){this.picker=void 0,e.redraw()}get pickerOpen(){return this.picker!==void 0}thumb(e,t){let o=this.thumbs.get(t),n=e.furnitureBase;if(o!==void 0||n===void 0||this.askedThumbs.has(t))return o;this.askedThumbs.add(t),En().then(i=>i.homeMapPieceThumb(n,t)).then(i=>{if(i===void 0||(this.thumbs.set(t,i),this.thumbFrame!==0))return;let a=typeof requestAnimationFrame=="function"?requestAnimationFrame:s=>setTimeout(s,16);this.thumbFrame=a(()=>{this.thumbFrame=0,e.redraw()})},()=>{})}piecePic(e,t,o){let n=t===void 0?void 0:this.thumb(e,t.id);return c`<span class="${o} ${n===void 0?"wait":""}">${n===void 0?b:c`<img src=${n} alt="" draggable="false" />`}</span>`}pickPiece(e,t){let o=this.picker,n=o===void 0?void 0:e.floor.rooms.find(d=>k(d.id,o.roomId));if(this.picker=void 0,o===void 0||n===void 0){e.redraw();return}let i=n.id;if(o.index!==void 0){let d=o.index;e.apply(l=>Uo(l,i,d,t),{select:{kind:"object",roomId:i,object:d}})||e.redraw();return}let a=Z(n)??ue(n),s=n.objects.length;e.apply(d=>Bo(d,i,t,a),{select:{kind:"object",roomId:i,object:s}})||e.redraw()}sheet(e){let t=this.picker;if(t===void 0)return b;let o=e.floor.rooms.find(m=>k(m.id,t.roomId)),n=t.index===void 0?void 0:o?.objects[t.index];if(o===void 0||t.index!==void 0&&n===void 0)return this.picker=void 0,b;let i=n===void 0?void 0:rt(n),a=Qi(this.pickerQuery,this.pickerGroup,n?.kind),s=n===void 0?"Add furniture":"Change model",d=n===void 0?`To ${T(o)}, in its middle. Drag it into place once it is in.`:`${Ee(n)} in ${T(o)} keeps its place, size and turn.`,l=m=>it.pieces.filter(u=>m===""||u.group===m).length,p=["",...it.groups],h=this.pickerFocus;return this.pickerFocus=!1,c`<div class="hme-scrim hme-sheet"
      @pointerdown=${m=>{m.target===m.currentTarget&&this.closePicker(e)}}
      @keydown=${m=>{m.stopPropagation(),m.key==="Escape"&&this.closePicker(e)}}>
      <div class="hme-fpick" role="dialog" aria-modal="true" aria-label=${s}>
        <header class="hme-fpick-head">
          <div class="hme-fpick-t"><strong>${s}</strong><span>${d}</span></div>
          <label class="hme-find hme-fpick-find"><span aria-hidden="true">⌕</span>
            <input type="search" placeholder="Find a piece: sofa, lamp, desk" aria-label="Find a piece" .value=${X(this.pickerQuery)}
              ${at(m=>{h&&m instanceof HTMLInputElement&&setTimeout(()=>m.focus(),0)})}
              @input=${m=>{this.pickerQuery=m.target.value,e.redraw()}} /></label>
          <button type="button" class="hme-x hme-fpick-close" aria-label="Close" title="Close (Esc)" @click=${()=>this.closePicker(e)}>×</button>
        </header>
        <div class="hme-fpick-main">
          <nav class="hme-fpick-groups" aria-label="Groups">
            ${p.map(m=>c`<button type="button" class="hme-tool ${m===this.pickerGroup?"on":""}" aria-pressed=${m===this.pickerGroup?"true":"false"}
              @click=${()=>{this.pickerGroup=m,e.redraw()}}>${m===""?"All":m}<span class="n">${l(m)}</span></button>`)}
          </nav>
          <div class="hme-fpick-body">
            ${a.every(m=>m.pieces.length===0)?c`<p class="hme-empty-line">No piece by that name${this.pickerGroup===""?"":` in ${this.pickerGroup}`}.</p>`:b}
            ${a.filter(m=>m.pieces.length>0).map(m=>c`<section class="hme-fpick-sec">
              <div class="hme-h">${m.title}<span class="hme-h-end">${F(m.pieces.length,"piece")}</span></div>
              <div class="hme-fgrid">${m.pieces.map(u=>{let f=i?.id===u.id;return c`<button type="button" class="hme-fcard ${f?"on":""}" aria-pressed=${f?"true":"false"}
                  title=${`${n===void 0?"Add":"Use"} ${u.name}, ${xt(u)}`} @click=${()=>this.pickPiece(e,u)}>
                  ${this.piecePic(e,u,"hme-fcard-pic")}
                  <span class="hme-fcard-name">${u.name}</span>
                  <span class="hme-fcard-size mono">${xt(u)}</span>
                </button>`})}</div>
            </section>`)}
          </div>
        </div>
      </div>
    </div>`}stopDrag(e){this.guides=[],this.dragging=!1,this.resizing=!1,e.preview(void 0)}focus(e){if(le(e.selection))return;let t=pe(e.selection);return t===void 0?void 0:e.floor.rooms.find(o=>k(o.id,t))}pickedMany(e){if(e.selection?.kind==="objects")return De(e.selection).flatMap(t=>{let o=e.floor.rooms.find(i=>k(i.id,t.roomId)),n=o?.objects[t.object];return o===void 0||n===void 0?[]:[{room:o,index:t.object,object:n}]})}picked(e){let t=e.selection;if(t?.kind!=="object")return;let o=this.focus(e),n=o?.objects[t.object];return o===void 0||n===void 0?void 0:{room:o,index:t.object,object:n}}thingUnder(e,t,o){return kn(e.floor,t,o)}pickThing(e,t,o){e.select({kind:"object",roomId:t.id,object:o})}overlay(e){if(this.draw.active)return this.draw.overlay(e);let t=this.focus(e),o=this.picked(e),n=this.pickedMany(e),i=[];for(let a of this.guides)i.push(this.guide(e,a));if(n!==void 0)for(let a of n){let s=J(Q(a.object)).map(d=>Pe(e.toScreen(d))).join(" ");i.push(H`<polygon class="hme-box" points=${s} fill="rgba(91,141,239,0.1)" stroke="#5b8def" stroke-width="2"
          stroke-dasharray=${a.object.hidden===!0?"5 4":"none"} pointer-events="none" />`)}else if(o!==void 0){let a=o.room.outline.map(d=>Pe(e.toScreen(d))).join(" ");i.push(H`<polygon points=${a} fill="none" stroke="#5b8def" stroke-width="1" stroke-dasharray="4 4" opacity="0.5" pointer-events="none" />`);let s=o.object;i.push(this.box(e,J(Q(s)),{width:s.size[0],depth:s.size[1]},"thing",s.hidden===!0))}else t!==void 0&&t.outline.length>=3&&i.push(this.box(e,Gs(t),fn(t),"room",!1));return i.length===0?b:H`${i}`}box(e,t,o,n,i){let a=t.map(y=>e.toScreen(y)),s=a.reduce((y,M)=>[y[0]+M[0]/4,y[1]+M[1]/4],[0,0]),d=y=>[(a[y][0]+a[(y+1)%4][0])/2,(a[y][1]+a[(y+1)%4][1])/2],l=y=>{let M=Math.max(Math.hypot(y[0]-s[0],y[1]-s[1]),1e-6);return[(y[0]-s[0])/M,(y[1]-s[1])/M]},p=[0,1,2,3].flatMap(y=>[a[y],d(y)]),h=[0,1,2,3].reduce((y,M)=>d(M)[1]<d(y)[1]?M:y,0),m=d(h),u=l(m),f=[m[0]+u[0]*44,m[1]+u[1]*44],g=[];for(let y of[[0,2],[1,3]]){let[M,$]=y,v=Math.abs(a[(M+1)%4][0]-a[M][0])>=Math.abs(a[(M+1)%4][1]-a[M][1]),x=v?l(d(M))[1]<=l(d($))[1]?M:$:l(d(M))[0]<=l(d($))[0]?M:$,R=a[x],S=a[(x+1)%4],_=l(d(x)),I=v?20:38,E=[R[0]+_[0]*I,R[1]+_[1]*I],O=[S[0]+_[0]*I,S[1]+_[1]*I],U=[(E[0]+O[0])/2,(E[1]+O[1])/2],ee=x%2===0?o.width:o.depth,B=[_[0]*5,_[1]*5];g.push(H`<path d=${`M${Pe(E)}L${Pe(O)}M${Pe([E[0]-B[0],E[1]-B[1]])}L${Pe([E[0]+B[0],E[1]+B[1]])}M${Pe([O[0]-B[0],O[1]-B[1]])}L${Pe([O[0]+B[0],O[1]+B[1]])}`}
        stroke="#5b8def" stroke-width="1.2" fill="none" />
        <g class="hme-tag"><rect x=${N(U[0]-26)} y=${N(U[1]-9)} width="52" height="18" rx="9" fill="#5b8def" />
        <text x=${N(U[0])} y=${N(U[1]+4)} fill="#fff" text-anchor="middle">${ee.toFixed(2)} m</text></g>`)}let w=n==="room"?"Drag to resize the room. Shift keeps its proportions, Alt resizes it about its middle, Cmd or Ctrl stops it snapping.":"Drag to resize it. Shift keeps its proportions, Alt resizes it about its middle.";return H`<g class="hme-box">
      <polygon points=${a.map(Pe).join(" ")} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray=${i?"5 4":"none"} />
      ${this.dragging?b:H`<line x1=${N(m[0])} y1=${N(m[1])} x2=${N(f[0])} y2=${N(f[1])} stroke="#5b8def" stroke-width="1.6" />`}
      ${this.resizing||!this.dragging?g:b}
      ${this.dragging?b:H`
        ${p.map((y,M)=>H`<rect data-hme="resize" data-handle=${M} x=${N(y[0]-5)} y=${N(y[1]-5)} width="10" height="10"
          fill="#fff" stroke="#5b8def" stroke-width="1.6" style=${`cursor:${Op(y[0]-s[0],y[1]-s[1])}`}>
          <title>${w}</title></rect>`)}
        <g data-hme="turn" style="cursor:grab" transform=${`translate(${Pe(f)})`}>
          <title>${n==="room"?"Drag to turn the room. Hold Alt to turn it freely.":"Drag to turn it. Hold Alt to turn it freely."}</title>
          <circle r="9" fill="#5b8def" />
          <path d="M-4 0a4 4 0 1 0 1.5-3.1M-4-4.5v2.5h2.5" fill="none" stroke="#fff" stroke-width="1.3" />
        </g>`}
    </g>`}guide(e,t){let o=e.toScreen(t.a),n=e.toScreen(t.b);if(t.door===!0){let m=e.floor.rooms.find(y=>k(y.id,t.roomId)),u=`Door to ${m===void 0?"the next room":T(m)}`,f=u.length*6.2+20,g=(o[0]+n[0])/2-f/2,w=(o[1]+n[1])/2-34;return H`<g class="hme-guide" pointer-events="none">
        <line x1=${N(o[0])} y1=${N(o[1])} x2=${N(n[0])} y2=${N(n[1])} stroke="#30d158" stroke-width="5" stroke-linecap="round" />
        <g class="hme-tag"><rect x=${N(g)} y=${N(w)} width=${N(f)} height="20" rx="10" fill="#30d158" />
        <text x=${N(g+f/2)} y=${N(w+14)} fill="#000" text-anchor="middle">${u}</text></g>
      </g>`}let i=Math.max(Math.hypot(n[0]-o[0],n[1]-o[1]),1e-6),a=[(n[0]-o[0])/i,(n[1]-o[1])/i],s=[o[0]-a[0]*40,o[1]-a[1]*40],d=[n[0]+a[0]*40,n[1]+a[1]*40],l=e.floor.rooms.find(m=>k(m.id,t.roomId)),p=`Lined up with ${l===void 0?"a":T(l)} wall`,h=p.length*6.2+20;return H`<g class="hme-guide" pointer-events="none">
      <line x1=${N(s[0])} y1=${N(s[1])} x2=${N(d[0])} y2=${N(d[1])} stroke="#ff4fa3" stroke-width="1.2" stroke-dasharray="6 4" />
      <g class="hme-tag"><rect x=${N(d[0]+6)} y=${N(d[1]-10)} width=${N(h)} height="20" rx="10" fill="#ff4fa3" />
      <text x=${N(d[0]+6+h/2)} y=${N(d[1]+4)} fill="#fff" text-anchor="middle">${p}</text></g>
    </g>`}pointerDown(e,t,o){return this.draw.active?this.draw.pointerDown(e,t,o):t.button!==0?!1:this.pressHandle(e,t,o)||this.pressBody(e,t,o)}pressHandle(e,t,o){let n=t.target?.closest?.("[data-hme]"),i=n?.getAttribute("data-hme");if(i!=="turn"&&i!=="resize")return!1;let a=Dp[Number(n?.getAttribute("data-handle"))],s=this.picked(e),d=this.focus(e);if(s!==void 0){if(i==="turn")this.thingTurnDrag(e,t,s,o);else if(a!==void 0)this.thingResizeDrag(e,t,s,a,o);else return!1;return!0}if(d===void 0)return!1;if(i==="turn")this.turnDrag(e,t,d,o);else if(a!==void 0)this.resizeDrag(e,t,d,a,o);else return!1;return!0}pressThing(e,t,o,n){let i=e.floor.rooms.find(s=>k(s.id,o.roomId)),a=i?.objects[o.object];return i===void 0||a===void 0?!1:t.shiftKey||t.metaKey||t.ctrlKey?(e.select(st(e.selection,{roomId:i.id,object:o.object})),!0):(this.dragThing(e,t,{room:i,index:o.object,object:a},n),!0)}dragThing(e,t,o,n){let i=this.pickedMany(e),a=i!==void 0&&i.some(s=>k(s.room.id,o.room.id)&&s.index===o.index);a||this.pickThing(e,o.room,o.index),t.altKey?this.copyDrag(e,t,a?i:[o],n):a?this.manyMoveDrag(e,t,i,o,n):this.thingMoveDrag(e,t,o,n)}manyMoveDrag(e,t,o,n,i){let a=mt(o),s=o[0].object.c,d=[0,0];e.drag(t,{move:l=>{let p=l[0]-i[0],h=l[1]-i[1];if(e.toggles.grid){let m=He;p=Math.round((s[0]+p)/m)*m-s[0],h=Math.round((s[1]+h)/m)*m-s[1]}this.guides=[],this.dragging=!0,d=[p,h],e.preview(m=>qo(m,a,p,h))},end:(l,p,h)=>{if(this.stopDrag(e),!h){this.pickThing(e,n.room,n.index);return}let[m,u]=d;(Math.abs(m)>=.005||Math.abs(u)>=.005)&&e.apply(f=>qo(f,a,m,u))},cancel:()=>this.stopDrag(e)})}copyDrag(e,t,o,n){let i=Xo(e.doc,mt(o));if(i===void 0)return;let a=e.floor.id,s=Ca(i),d;e.drag(t,{move:l=>{let p=[s[0]+l[0]-n[0],s[1]+l[1]-n[1]];if(e.toggles.grid){let m=He;p=[Math.round(p[0]/m)*m,Math.round(p[1]/m)*m]}this.guides=[],this.dragging=!0,d=p;let h=p;e.preview(m=>Yo(m,a,i,h)?.doc)},end:(l,p,h)=>{this.stopDrag(e),h&&d!==void 0&&this.paste(e,i,d)},cancel:()=>this.stopDrag(e)})}pressBody(e,t,o){let n=this.thingUnder(e,o,void 0);if(t.metaKey||t.ctrlKey)return n!==void 0&&e.select(st(e.selection,{roomId:n.room.id,object:n.index})),n!==void 0||q(e.floor,o)!==void 0;if(n!==void 0)return this.dragThing(e,t,n,o),!0;let i=q(e.floor,o);return i===void 0?!1:(e.select({kind:"room",roomId:i.id}),this.moveDrag(e,t,i,o),!0)}moveDrag(e,t,o,n){let i=e.doc,a=o.id,s=ge(o.outline),d=[0,0];e.drag(t,{move:(l,p)=>{let h=l[0]-n[0],m=l[1]-n[1];if(e.toggles.grid&&s!==void 0){let u=He;h=Math.round((s.minX+h)/u)*u-s.minX,m=Math.round((s.minY+m)/u)*u-s.minY}if(this.guides=[],e.toggles.snap&&!p.altKey){let u=ca(i,a,h,m);u!==void 0&&(h=u.dx,m=u.dy,this.guides=u.guides)}this.dragging=!0,d=[h,m],e.preview(u=>Ht(u,a,h,m))},end:(l,p,h)=>{let m=this.guides.some(g=>g.door===!0);this.stopDrag(e);let[u,f]=d;h&&(Math.abs(u)>=.005||Math.abs(f)>=.005)&&e.apply(g=>{let w=Ht(g,a,u,f);return w!==void 0&&m?is(w,[a]):w},{select:{kind:"room",roomId:a}})},cancel:()=>this.stopDrag(e)})}resizeDrag(e,t,o,n,i){let a=jo(o);if(a===void 0)return;let s=e.doc,d=o.id,l=a.a1-a.a0,p=a.c1-a.c0;if(l<=1e-6||p<=1e-6)return;let h=g=>g[0]*a.u[0]+g[1]*a.u[1],m=g=>g[0]*a.v[0]+g[1]*a.v[1],u=g=>Math.min(Math.max(g,Yt),Zt),f;e.drag(t,{move:(g,w)=>{let y=w.altKey?2:1,M=l,$=p;if(n.a!==void 0&&(M=l+(h(g)-h(i))*(n.a===1?1:-1)*y),n.c!==void 0&&($=p+(m(g)-m(i))*(n.c===1?1:-1)*y),e.toggles.grid){let S=He;n.a!==void 0&&(M=Math.round(M/S)*S),n.c!==void 0&&($=Math.round($/S)*S)}if(M=u(M),$=u($),w.shiftKey){let S=M/l,_=$/p,I=n.a===void 0?_:n.c===void 0||Math.abs(Math.log(S))>=Math.abs(Math.log(_))?S:_;I=Math.min(Math.max(I,Yt/Math.min(l,p)),Zt/Math.max(l,p)),M=l*I,$=p*I}let v=[w.altKey||n.a===void 0?.5:1-n.a,w.altKey||n.c===void 0?.5:1-n.c],x={width:M,depth:$,anchor:v};if(this.guides=[],e.toggles.snap&&!w.altKey&&!w.ctrlKey&&!w.metaKey){let S=fa(s,d,x,n,{proportional:w.shiftKey});S!==void 0&&(x=S.resize,this.guides=S.guides)}this.dragging=!0,this.resizing=!0,f=x;let R=x;e.preview(S=>Qt(S,d,R))},end:(g,w,y)=>{this.stopDrag(e);let M=f;!y||M===void 0||Math.abs((M.width??l)-l)<.005&&Math.abs((M.depth??p)-p)<.005||e.apply($=>Qt($,d,M),{select:{kind:"room",roomId:d}})},cancel:()=>this.stopDrag(e)})}turnDrag(e,t,o,n){let i=o.id,a=ue(o),s=Math.atan2(n[1]-a[1],n[0]-a[0]),d=0;e.drag(t,{move:(l,p)=>{let h=(Math.atan2(l[1]-a[1],l[0]-a[0])-s)*180/Math.PI;h=(h+540)%360-180,p.altKey||(h=Math.round(h/Cn)*Cn),this.dragging=!0,d=h,e.preview(m=>Ze(m,i,h,a))},end:(l,p,h)=>{this.stopDrag(e),h&&Math.abs(d)>.01&&e.apply(m=>Ze(m,i,d,a),{select:{kind:"room",roomId:i}})},cancel:()=>this.stopDrag(e)})}thingMoveDrag(e,t,o,n){let{room:i,index:a,object:s}=o,d=i.id,l=s.c,p=l;e.drag(t,{move:(h,m)=>{let u=[l[0]+h[0]-n[0],l[1]+h[1]-n[1]];if(e.toggles.grid){let g=He;u=[Math.round(u[0]/g)*g,Math.round(u[1]/g)*g]}if(this.guides=[],e.toggles.snap&&!m.altKey){let g=Ra(i,s,u);u=g.c,this.guides=g.guides}this.dragging=!0,p=u;let f=u;e.preview(g=>Pt(g,d,a,f))},end:(h,m,u)=>{if(this.stopDrag(e),u&&Math.hypot(p[0]-l[0],p[1]-l[1])>=.005){let f=p;e.apply(g=>Pt(g,d,a,f),{select:{kind:"object",roomId:d,object:a}})}},cancel:()=>this.stopDrag(e)})}thingResizeDrag(e,t,o,n,i){let{room:a,index:s,object:d}=o,l=a.id,{u:p,v:h}=Sa(d),m=Math.max(d.size[0],Ct),u=Math.max(d.size[1],Ct),f=M=>M[0]*p[0]+M[1]*p[1],g=M=>M[0]*h[0]+M[1]*h[1],w=M=>Math.min(Math.max(M,Ct),Zo),y;e.drag(t,{move:(M,$)=>{let v=$.altKey?2:1,x=m,R=u;if(n.a!==void 0&&(x=m+(f(M)-f(i))*(n.a===1?1:-1)*v),n.c!==void 0&&(R=u+(g(M)-g(i))*(n.c===1?1:-1)*v),e.toggles.grid){let I=He;n.a!==void 0&&(x=Math.round(x/I)*I),n.c!==void 0&&(R=Math.round(R/I)*I)}if(x=w(x),R=w(R),$.shiftKey){let I=x/m,E=R/u,O=n.a===void 0?E:n.c===void 0||Math.abs(Math.log(I))>=Math.abs(Math.log(E))?I:E;O=Math.min(Math.max(O,Ct/Math.min(m,u)),Zo/Math.max(m,u)),x=m*O,R=u*O}let S=[$.altKey||n.a===void 0?.5:1-n.a,$.altKey||n.c===void 0?.5:1-n.c];this.dragging=!0,this.resizing=!0;let _={width:x,depth:R,anchor:S};y=_,e.preview(I=>eo(I,l,s,_))},end:(M,$,v)=>{this.stopDrag(e);let x=y;!v||x===void 0||Math.abs((x.width??m)-d.size[0])<.005&&Math.abs((x.depth??u)-d.size[1])<.005||e.apply(R=>eo(R,l,s,x),{select:{kind:"object",roomId:l,object:s}})},cancel:()=>this.stopDrag(e)})}thingTurnDrag(e,t,o,n){let{room:i,index:a,object:s}=o,d=i.id,l=s.c,p=Math.atan2(n[1]-l[1],n[0]-l[0]),h=0;e.drag(t,{move:(m,u)=>{let f=(Math.atan2(m[1]-l[1],m[0]-l[0])-p)*180/Math.PI;f=(f+540)%360-180,u.altKey||(f=Math.round(f/Cn)*Cn),this.dragging=!0,h=-f;let g=h;e.preview(w=>Qe(w,d,a,g))},end:(m,u,f)=>{this.stopDrag(e);let g=h;f&&Math.abs(g)>.01&&e.apply(w=>Qe(w,d,a,g),{select:{kind:"object",roomId:d,object:a}})},cancel:()=>this.stopDrag(e)})}hover(e,t){this.draw.hover(e,t)}pickedRefs(e){let t=e.selection;return t?.kind==="object"?[{roomId:t.roomId,object:t.object}]:t?.kind==="objects"?t.items:[]}copyPicked(e){let t=Xo(e.doc,this.pickedRefs(e));return t===void 0?!1:(this.clip=t,!0)}paste(e,t,o){let n=e.floor.id,i=pe(e.selection),a=Yo(e.doc,n,t,o,i);if(a===void 0)return;let s=a.items[0],d=a.items.length===1?{kind:"object",roomId:s.roomId,object:s.object}:{kind:"objects",items:a.items};return e.apply(l=>Yo(l,n,t,o,i)?.doc,{select:d})?a:void 0}pasteClip(e){if(this.clip===void 0)return!1;let t=this.paste(e,this.clip,this.pointer);return t!==void 0&&(this.clip=t.clip),!0}duplicatePicked(e){let t=Xo(e.doc,this.pickedRefs(e));return t===void 0?!1:(this.paste(e,t,void 0),!0)}clipKey(e,t){return t==="copy"?this.copyPicked(e):t==="paste"?this.pasteClip(e):this.duplicatePicked(e)}copyButtons(e){return c`<button type="button" class="hme-tb" title="Copy it, to paste on any floor (${$e()?"\u2318C":"Ctrl+C"})" @click=${()=>this.copyPicked(e)}>Copy</button>
      <button type="button" class="hme-tb" title="Make a copy beside it (${$e()?"\u2318D":"Ctrl+D"})" @click=${()=>this.duplicatePicked(e)}>Duplicate</button>`}pasteButton(e){return c`<button type="button" class="hme-tb" title="Paste the furniture you copied (${$e()?"\u2318V":"Ctrl+V"})" @click=${()=>this.pasteClip(e)}>Paste</button>`}keyDown(e,t){if(this.draw.active)return this.draw.keyDown(e,t);let o=this.pickedMany(e);if(o!==void 0)return this.manyKeyDown(e,t,o);let n=this.focus(e);if(n===void 0)return!1;let i=oe(t,!1),a=this.picked(e);if(a!==void 0){let{index:s,object:d}=a,l={kind:"room",roomId:n.id};if(i==="delete")return e.apply(p=>Go(p,n.id,s),{select:l}),!0;if(i==="cancel")return e.select(l),!0;if(typeof i=="object"&&"nudge"in i){let[p,h]=i.nudge;return e.apply(m=>Pt(m,n.id,s,[d.c[0]+p,d.c[1]+h])),!0}return!1}if(i==="delete")return this.askDelete(e,n),!0;if(typeof i=="object"&&"nudge"in i){let[s,d]=i.nudge;return e.apply(l=>Ht(l,n.id,s,d)),!0}return!1}manyKeyDown(e,t,o){let n=oe(t,!1),i=mt(o);if(n==="delete")return this.askDeleteThings(e,o),!0;if(n==="cancel")return e.select(Fd(o)),!0;if(typeof n=="object"&&"nudge"in n){let[a,s]=n.nudge;return e.apply(d=>qo(d,i,a,s)),!0}return!1}async askDeleteThings(e,t){let o=mt(t);await e.confirm({title:`Delete ${F(t.length,"thing")}?`,text:`${Ld(t)} come off the map. Undo brings them back while this page is open.`,ok:"Delete",danger:!0})&&e.apply(i=>Ta(i,o),{select:Fd(t)??null})}cursor(){return this.draw.active?"crosshair":void 0}leave(e){this.draw.stop(e),this.picker=void 0,this.guides=[],this.dragging=!1,this.resizing=!1}dock(e){return c`<button type="button" class="hme-tb ${e.toggles.snap?"on":""}" aria-pressed=${e.toggles.snap?"true":"false"}
        title="Snap: a dragged room locks to the door of the next room, or lines up with the walls round it. Hold Alt to move it freely." @click=${()=>e.setToggle("snap",!e.toggles.snap)}>Snap</button>`}viewItems(e){return[{label:"Grid 10 cm",on:e.toggles.grid,title:"Points land on a 10 cm grid, drawn on the plan",flip:()=>e.setToggle("grid",!e.toggles.grid)}]}pill(e){if(this.draw.active)return c`<span class="hme-pill-name">${this.draw.hint()}</span>
        ${this.draw.points.length>=3?c`<button type="button" class="hme-tb" @click=${()=>{this.draw.finish(e)}}>Close the room</button>`:b}
        <button type="button" class="hme-tb" @click=${()=>this.draw.stop(e)}>Cancel</button>`;if(this.dragging)return b;let t=this.pickedMany(e);if(t!==void 0){let a=mt(t),s=t.some(d=>d.object.hidden!==!0);return c`<span class="hme-pill-name">${F(t.length,"thing")}</span>
        ${this.copyButtons(e)}
        <button type="button" class="hme-tb" title=${s?"Hide every picked thing":"Show every picked thing"}
          @click=${()=>e.apply(d=>Vo(d,a,s))}>${s?"Hide":"Show"}</button>
        <button type="button" class="hme-tb danger" @click=${()=>{this.askDeleteThings(e,t)}}>Delete</button>`}let o=this.focus(e);if(this.dragging)return b;if(o===void 0)return this.clip===void 0?b:this.pasteButton(e);let n=o.id,i=this.picked(e);if(i!==void 0){let{index:a,object:s}=i,d=$e();return c`<span class="hme-pill-name">${Ee(s)}</span>
        <button type="button" class="hme-tb" @click=${()=>e.apply(l=>Qe(l,n,a,90))}>⟲ Turn 90°</button>
        <button type="button" class="hme-tb" title="Make a copy beside it (${d?"\u2318D":"Ctrl+D"})" @click=${()=>this.duplicatePicked(e)}>Duplicate</button>
        ${vo({label:"More",cls:"hme-tb",options:[{value:"copy",label:`Copy (${d?"\u2318C":"Ctrl+C"})`},{value:"hide",label:s.hidden===!0?"Show it":"Hide it"}],pick:l=>{l==="copy"?this.copyPicked(e):e.apply(p=>Wo(p,n,a,s.hidden!==!0))}})}
        <button type="button" class="hme-tb" title="Pick its room" @click=${()=>e.select({kind:"room",roomId:n})}>${T(o)} ›</button>
        <button type="button" class="hme-tb hme-icon danger" aria-label="Remove" title="Remove it (Delete)"
          @click=${()=>e.apply(l=>Go(l,n,a),{select:{kind:"room",roomId:n}})}>${Rp}</button>`}return c`<span class="hme-pill-name">${T(o)}</span>
      ${this.clip===void 0?b:this.pasteButton(e)}
      <button type="button" class="hme-tb" @click=${()=>e.apply(a=>Ze(a,n,90))}>⟲ Turn 90°</button>
      <button type="button" class="hme-tb" title="Make its corners square" @click=${()=>e.apply(a=>to(a,n))}>Square</button>
      ${vo({label:"More",cls:"hme-tb",options:[{value:"snap",label:"Snap to walls"},{value:"level",label:"Level"},{value:"delete",label:"Delete room"}],pick:a=>{a==="snap"?e.apply(s=>ua(s,n)):a==="level"?e.apply(s=>oi(s,n)):this.askDelete(e,o)}})}`}floorMenu(e,t,o,n){let i=e.doc.floors.filter(a=>!k(a.id,e.floor.id));return vo({label:o,cls:n,options:[...i.map(a=>({value:a.id,label:K(a)})),{value:"new",label:"New floor\u2026"}],pick:a=>{this.moveToFloor(e,t,a)}})}async moveToFloor(e,t,o){let n=t.id,i={kind:"room",roomId:n};if(o!=="new"){e.apply(l=>ii(l,n,{floorId:o}),{select:i,floorId:o});return}let a=Math.max(...e.doc.floors.map(l=>l.story))+1,s=await e.ask({title:"A new floor",label:"Name",value:a===1?"Upstairs":`Floor ${a+1}`,ok:"Move the room there"});if(s===void 0)return;let d=e.newId();e.apply(l=>ii(l,n,{newFloor:{id:d,name:s,story:a}}),{select:i,floorId:d})}async askDelete(e,t){let o=Ye(e.floor,t.id).length;await e.confirm({title:`Delete ${T(t)}?`,text:Ap(t,o),ok:"Delete room",danger:!0})&&e.apply(i=>wa(i,t.id),{select:null})}inspector(e){let t=this.pickedMany(e);if(t!==void 0)return this.manyInspector(e,t);let o=this.focus(e);if(o===void 0)return this.floorCard(e,e.floor);let n=this.picked(e);if(n!==void 0)return this.thingInspector(e,n);let i=o.id,a=fn(o),s=Wr(e.floor,e.toggles.live?e.hass?.states:void 0).has(o.id),d=ge(o.outline)??{minX:0,minY:0,maxX:0,maxY:0},l=Math.round(-ma(o)*10)/10,p=o.areaId===void 0||e.areas.some(v=>v.id===o.areaId),h=e.areas.find(v=>v.id===o.areaId)?.name,m=o.pageId===void 0||e.pages.some(v=>k(v.id,o.pageId)),u=na(o),f=this.edits(e),g=o.objects.length,w=o.openings.filter(v=>v.kind!=="window").length,y=o.openings.length-w,M=o.openings.length===0?void 0:`${F(w,"door")}, ${F(y,"window")}`,$=v=>`room-${v}`;return c`
      ${this.roomBefore?.(e,o)??b}

      <section class="hme-card hme-head">
        ${sd(o,s)}
        <div class="hme-head-t">
          <strong>${T(o)}</strong>
          <span>${co(o)} · ${a.area.toFixed(1)} m²${h===void 0?"":` \xB7 ${h} area`}</span>
          <span>${K(e.floor)}</span>
        </div>
      </section>

      ${this.roomTray?.(e,o)??b}

      ${yn(e,o)}

      ${Od(e,o)}

      ${Oe($("furniture"),"Furniture",g===0?void 0:F(g,"thing"),this.furnitureList(e,o),"hme-inroom")}

      ${Oe(Ji,"Name, area and tap",h,c`
        ${G("Name",Ft({value:o.name??"",label:"Name",placeholder:"Room",set:v=>e.apply(x=>Ma(x,i,v))}))}
        ${G("Area",xe({label:"Area",value:o.areaId??"",options:[{value:"",label:"None"},...p?[]:[{value:o.areaId,label:`Not in Home Assistant (${o.areaId})`,disabled:!0}],...e.areas.map(v=>({value:v.id,label:v.name}))],set:v=>e.apply(x=>Ko(x,i,v===""?void 0:v))}))}
        ${W("The Home Assistant area. Its devices wait in Not on the map.")}
        ${G("Tap opens",xe({label:"Tap opens",value:o.pageId??"",options:[{value:"",label:"Nothing"},...m?[]:[{value:o.pageId,label:"A page not in your library",disabled:!0}],...e.pages.map(v=>({value:v.id,label:`Page: ${v.name}`}))],set:v=>e.apply(x=>ka(x,i,v===""?void 0:v))}))}
        ${W("What a tap on this room does on the map tiles and the watch.")}`)}

      ${Oe($("size"),"Size and place",co(o),c`
        ${ve(j({tag:"Width",label:"Width",value:a.width,unit:"m",min:Yt,max:Zt,...f((v,x)=>Qt(v,i,{width:x}))}),j({tag:"Depth",label:"Depth",value:a.depth,unit:"m",min:Yt,max:Zt,...f((v,x)=>Qt(v,i,{depth:x}))}),j({tag:"Height",label:"Wall height",value:o.height,unit:"m",min:.5,max:20,...f((v,x)=>Jt(v,i,x))}))}
        ${ve(j({tag:"From left",label:"Left",value:d.minX,unit:"m",...f((v,x)=>Ht(v,i,x-d.minX,0))}),j({tag:"From top",label:"Top",value:d.minY,unit:"m",...f((v,x)=>Ht(v,i,0,x-d.minY))}))}
        <div class="hme-turn">
          ${j({label:"Turn",value:l,unit:"\xB0",digits:1,min:-180,max:180,...f((v,x)=>Ze(v,i,x-l))})}
          <button type="button" class="hme-tb" @click=${()=>e.apply(v=>Ze(v,i,-90))}>−90°</button>
          <button type="button" class="hme-tb" @click=${()=>e.apply(v=>Ze(v,i,90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it so its longest wall runs straight across or down" @click=${()=>e.apply(v=>oi(v,i))}>Level</button>
        </div>
        <p class="hme-foot-hint">Along its own walls, about its middle; its doors, things and devices move with it. Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the room to move it, a square handle to resize it, the round one to turn it.</p>
        ${G("Floor",xe({label:"Floor",value:e.floor.id,options:[...e.doc.floors.map(v=>({value:v.id,label:K(v)})),{value:"new",label:"New floor\u2026"}],set:v=>{this.moveToFloor(e,o,v)}}))}`)}

      ${Oe($("finish"),"Floor and walls",qi[o.finish??u],c`<div class="hme-pics">
        ${he({label:`Auto: ${qi[u]}`,picture:Ri(u),on:o.finish===void 0,title:"Picked from the room's name and furniture",click:()=>e.apply(v=>ri(v,i,void 0))})}
        ${Or.map(v=>he({label:qi[v],picture:Ri(v),on:o.finish===v,click:()=>e.apply(x=>ri(x,i,v))}))}
      </div>
        ${this.roomColourRow(e,o,"floorColor")}
        ${this.roomColourRow(e,o,"wallColor")}
        <p class="hme-foot-hint">On the plan, the night, warm and clay looks and in 3D, here, on the iPhone and on the watch. The line looks keep their own colour.</p>`)}

      ${Oe($("openings"),"Doors and windows",M,c`
        ${this.roomDoors?.(e,o)??b}
        ${this.roomWalls?.(e,o)??b}`,"hme-fold-cards")}

      ${Oe($("scan"),"The scan",void 0,c`
        ${this.roomScan?.(e,o)??b}
        ${D("More",c`
        <div class="hme-row-end">
          ${vo({label:"\uFF0B Add a plain box",cls:"hme-tb",options:$a.map(v=>({value:v,label:dt(v)})),pick:v=>{let x=Z(o)??ue(o);e.apply(R=>xa(R,i,v,x))}})}
          <button type="button" class="hme-tb danger push" @click=${()=>{this.askDelete(e,o)}}>Delete room</button>
        </div>`)}`,"hme-fold-cards")}`}furnitureList(e,t){let o=e.floor,n=e.toggles.live?e.hass?.states:void 0,i=e.selection,a=t.id,s=[],d=[];t.objects.forEach((p,h)=>{let m={roomId:a,object:h},u=Ee(p),f=p.hidden===!0,g=Ne(o,a,h),w=jt(p)||g!==void 0&&g.entityId.startsWith("light."),y=Lp(e,{sel:{kind:"object",...m},picked:Fs(i,a,h),hidden:f,icon:w?c`<span class="hme-ly-lamp ${g!==void 0&&Zi(g.entityId,n)?"lit":""}" aria-hidden="true"></span>`:c`<span class="hme-thing-ic" aria-hidden="true"></span>`,name:u,end:f?"hidden":g!==void 0?`${re(g,e.hass)} \xB7 ${be(g.entityId,n)}`:w?"no light":`${p.size[0].toFixed(1)} \xD7 ${p.size[1].toFixed(1)}`,title:"Pick it to move, resize or turn it. Cmd or Ctrl and a click picks several.",pick:M=>e.select(M.metaKey||M.ctrlKey?st(e.selection,m):{kind:"object",...m}),eye:()=>e.apply(M=>Wo(M,a,h,!f))});(w?s:d).push(y)});let l=(p,h)=>h.length===0?b:c`<div class="hme-ly-grp">${p}</div>${h}`;return c`<div class="hme-ly-list">
        ${s.length+d.length===0?c`<p class="hme-empty-line">No furniture yet. A bed, a sofa or a table makes the map read.</p>`:b}
        ${l("Lamps",s)}
        ${l("Furniture",d)}
      </div>
      <button type="button" class="hme-tb hme-wide" title="Add furniture to this room" @click=${()=>e.openAdd("furniture")}>＋ Add furniture to ${T(t)}</button>`}edits(e){return t=>({set:o=>e.apply(n=>t(n,o)),preview:o=>e.preview(o===void 0?void 0:n=>t(n,o))})}thingInspector(e,t){let{room:o,index:n,object:i}=t,a=o.id,s=Ee(i),[d,l,p]=i.size,h=zp(i),m=this.edits(e),u={kind:"room",roomId:a},f={unit:"m",min:Ct,max:Zo};return c`
      <section class="hme-card hme-head">
        <div class="hme-head-t">
          <strong>${s}</strong>
          <span>In ${T(o)} · ${d.toFixed(2)} × ${l.toFixed(2)} × ${p.toFixed(2)} m${(i.lift??0)>0?` \xB7 ${(i.lift??0).toFixed(2)} m up`:""}${i.hidden===!0?" \xB7 Hidden":""}</span>
        </div>
      </section>

      ${this.modelCard(e,t)}

      ${Ad(e,o,n,i)}

      ${this.coloursCard(e,t)}

      ${D("Size",c`
        ${ve(j({tag:"Width",label:"Width",value:d,...f,...m((g,w)=>eo(g,a,n,{width:w}))}),j({tag:"Depth",label:"Depth",value:l,...f,...m((g,w)=>eo(g,a,n,{depth:w}))}),j({tag:"Height",label:"Height",value:p,...f,min:.01,...m((g,w)=>Et(g,a,n,{size:[d,l,w]}))}))}`)}

      ${D("Place",c`
        ${Ii("Middle, and up off the floor",ve(j({tag:"Across",label:"Middle across",value:i.c[0],unit:"m",...m((g,w)=>Pt(g,a,n,[w,i.c[1]]))}),j({tag:"Down",label:"Middle down",value:i.c[1],unit:"m",...m((g,w)=>Pt(g,a,n,[i.c[0],w]))}),j({tag:"Up",label:"Up off the floor",value:i.lift??0,unit:"m",min:0,max:100,...m((g,w)=>Et(g,a,n,{lift:w}))})))}
        ${Ii("Turn",c`<div class="hme-turn">
          ${j({label:"Turn",value:h,unit:"\xB0",digits:1,min:-180,max:180,...m((g,w)=>Qe(g,a,n,w-h))})}
          <button type="button" class="hme-tb" title="Turn it a quarter one way" @click=${()=>e.apply(g=>Qe(g,a,n,-90))}>−90°</button>
          <button type="button" class="hme-tb" title="Turn it a quarter the other way" @click=${()=>e.apply(g=>Qe(g,a,n,90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it square with the room's walls" @click=${()=>e.apply(g=>Ia(g,a,n))}>Line up</button>
        </div>`)}
        <p class="hme-foot-hint">Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the thing to move it, a square handle to resize it, the round one to turn it.</p>`)}

      ${D("Show",c`
        <div class="hme-r tight"><span class="hme-grow">On the map, the tiles and the watch</span>
          ${yo({on:i.hidden!==!0,onText:"Shown",offText:"Hidden",label:`${s} shown`,click:()=>e.apply(g=>Wo(g,a,n,i.hidden!==!0))})}</div>
        <p class="hme-foot-hint">Scan Again on the iPhone puts the room's things back where the scan finds them. A hidden thing stays hidden.</p>
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${()=>e.select(u)}>‹ ${T(o)}</button>
          <button type="button" class="hme-tb danger push" @click=${()=>e.apply(g=>Go(g,a,n),{select:u})}>Remove</button>
        </div>`)}`}manyInspector(e,t){let o=mt(t),n=[...new Set(t.map(s=>T(s.room)))],i=Me(t.map(s=>s.object.hidden===!0)),a=_p.filter(s=>t.some(d=>Yi(d.object).includes(s)));return c`
      <section class="hme-card hme-head">
        <div class="hme-head-t">
          <strong>${F(t.length,"thing")}</strong>
          <span>${Ld(t)} · in ${n.join(", ")}</span>
        </div>
      </section>

      ${D("Picked",c`${t.map(s=>c`<div class="hme-list-row hme-pick-row">
          <button type="button" class="hme-grow hme-link ${s.object.hidden===!0?"dim":""}" title="Pick this one alone"
            @click=${()=>this.pickThing(e,s.room,s.index)}>${Ee(s.object)}</button>
          <span class="hme-val">${T(s.room)}</span>
          <button type="button" class="hme-x" aria-label=${`Leave ${Ee(s.object)} out of the pick`} title="Leave it out of the pick"
            @click=${()=>e.select(st(e.selection,{roomId:s.room.id,object:s.index}))}>×</button></div>`)}
        <p class="hme-foot-hint">Cmd or Ctrl and a click on the plan or in 3D adds a thing or takes one away. The arrow keys move them all.</p>`,String(t.length))}

      ${a.length===0?b:D("Colours",c`
        ${a.map(s=>this.manyColourRow(e,t,s))}
        <p class="hme-foot-hint">Set on every picked thing whose piece has that part. In the 3D view and on the iPhone.</p>`)}

      ${D("Show",c`
        <div class="hme-r tight"><span class="hme-grow">On the map, the tiles and the watch</span>
          ${i.mixed?c`<button type="button" class="hme-chip off" aria-pressed="mixed" aria-label="Shown" title="Some are hidden: show them all"
                @click=${()=>e.apply(s=>Vo(s,o,!1))}>Mixed</button>`:yo({on:!i.value,onText:"Shown",offText:"Hidden",label:"Shown",click:()=>e.apply(s=>Vo(s,o,!i.value))})}</div>
        <div class="hme-row-end">
          <button type="button" class="hme-tb danger push" @click=${()=>{this.askDeleteThings(e,t)}}>Delete ${F(t.length,"thing")}</button>
        </div>`)}`}manyColourRow(e,t,o){let n=t.filter(s=>Yi(s.object).includes(o)),i=mt(n),a=Me(n.map(s=>s.object[o]?.toUpperCase()));return Xi({word:o==="fabric"?"Fabric":"Wood",presets:o==="fabric"?yi:wi,now:a.mixed?void 0:a.value,mixed:a.mixed,defaultTitle:"Each model's own colour",customTitle:`Any ${o} colour`,customLabel:`Pick a ${o} colour for every picked thing`,set:s=>e.apply(d=>di(d,i,o,s)),preview:s=>e.preview(s===void 0?void 0:d=>di(d,i,o,s)??d)})}modelCard(e,t){let{room:o,index:n,object:i}=t,a=rt(i),s=se(i.model),d=s!==void 0?`${s.group}, picked from the catalog`:i.model!==void 0?a===void 0?"A piece this panel does not know yet":`A piece this panel does not know yet, drawn as the ${a.name.toLowerCase()} meanwhile`:a!==void 0?`Picked by its kind: ${dt(i.kind)}`:"A plain box, as the scan found it";return D("Model",c`<div class="hme-model">
        ${this.piecePic(e,a,"hme-model-pic")}
        <div class="hme-model-t"><strong>${a?.name??"Plain box"}</strong><span>${d}</span></div>
        <button type="button" class="hme-tb push" title="Pick another piece from the furniture catalog; it keeps its place, size and turn"
          @click=${()=>this.openPicker(e,o,n)}>Change…</button>
      </div>
      <p class="hme-foot-hint">What it looks like in the 3D view and on the iPhone. The flat plan and the tiles draw it as before.</p>`)}coloursCard(e,t){let o=Yi(t.object);return o.length===0?b:D("Colours",c`
      ${o.map(n=>this.colourRow(e,t,n))}
      <p class="hme-foot-hint">In the 3D view and on the iPhone. The flat plan, the tiles and the furniture picker keep the model's own colours.</p>`)}colourRow(e,t,o){let{room:n,index:i,object:a}=t,s=n.id;return Xi({word:o==="fabric"?"Fabric":"Wood",presets:o==="fabric"?yi:wi,now:a[o],defaultTitle:"The model's own colour",customTitle:`Any ${o} colour`,customLabel:`Pick a ${o} colour`,set:l=>e.apply(p=>si(p,s,i,o,l)),preview:l=>e.preview(l===void 0?void 0:p=>si(p,s,i,o,l)??p)})}roomColourRow(e,t,o){let n=t.id,i=o==="floorColor";return Xi({word:i?"Floor":"Walls",presets:i?Sp[_o(t)]:Ip,now:t[o],defaultTitle:i?"The finish's own colour":"The look's own wall colour",customTitle:i?"Any floor colour":"Any wall colour",customLabel:i?"Pick a floor colour":"Pick a wall colour",set:a=>e.apply(s=>ai(s,n,o,a)),preview:a=>e.preview(a===void 0?void 0:s=>ai(s,n,o,a)??s)})}floorCard(e,t){return c`${D("Floor",this.floorBody(e,t))}${Rd(e,t)}`}floorBody(e,t){let o=Ro(t,e.toggles.live?e.hass?.states:void 0),n=t.rooms.reduce((i,a)=>i+a.objects.length,0);return c`
      ${G("Name",Ft({value:t.name,label:"Floor name",placeholder:K(t),set:i=>e.apply(a=>No(a,t.id,i))}))}
      ${G("On it",c`<span class="hme-val">${F(t.rooms.length,"room")} · ${F(n,"thing")} · ${F(t.pins.length,"device")} · ${Do(o)}</span>`)}`}};var jp=.4,Np=.15;function Kp(r,e,t){let o=t[0]-e[0],n=t[1]-e[1],i=o*o+n*n,a=i===0?0:Math.max(0,Math.min(1,((r[0]-e[0])*o+(r[1]-e[1])*n)/i));return Math.hypot(r[0]-(e[0]+a*o),r[1]-(e[1]+a*n))}function Wp(r,e){let t=1/0;for(let o=0,n=e.length-1;o<e.length;n=o,o+=1)t=Math.min(t,Kp(r,e[n],e[o]));return t}function*jd(r,e,t){yield r;for(let o=1;o*e<=t;o+=1){let n=o*e,i=Math.min(64,Math.max(8,Math.ceil(2*Math.PI*n/e)));for(let a=0;a<i;a+=1){let s=a/i*2*Math.PI;yield[r[0]+n*Math.cos(s),r[1]+n*Math.sin(s)]}}}function Nd(r,e){return r.reduce((t,o)=>Math.max(t,Math.hypot(o[0]-e[0],o[1]-e[1])),0)}function Kd(r,e,t,o=jp){let n=Z(r);if(n===void 0)return;let i=r.outline,a=(d,l)=>Y(i,d)&&(i.length<3||Wp(d,i)>=l)&&e.every(p=>Math.hypot(p.at[0]-d[0],p.at[1]-d[1])>=o)&&(t===void 0||Math.abs(d[0]-t.at[0])>t.halfW||Math.abs(d[1]-t.at[1])>t.halfH),s=Nd(i,n);for(let d of[Np,0])for(let l of jd(n,.1,s))if(a(l,d))return[_d(l[0]),_d(l[1])];return n}var _d=r=>Math.round(r*1e3)/1e3;function er(r,e,t){if(t.length===0)return!1;let o=[[r[0]-e[0],r[1]-e[1]],[r[0]+e[0],r[1]-e[1]],[r[0]+e[0],r[1]+e[1]],[r[0]-e[0],r[1]+e[1]]],n=[[1,0],[0,1]];for(let i=0,a=t.length-1;i<t.length;a=i,i+=1){let s=t[i][0]-t[a][0],d=t[i][1]-t[a][1];(s!==0||d!==0)&&n.push([-d,s])}for(let[i,a]of n){let s=m=>{let u=1/0,f=-1/0;for(let g of m){let w=g[0]*i+g[1]*a;u=Math.min(u,w),f=Math.max(f,w)}return[u,f]},[d,l]=s(o),[p,h]=s(t);if(l<=p||h<=d)return!1}return!0}function Bp(r,e,t){let o=Math.max(Math.abs(t.c[0]-r[0])-e[0],0),n=Math.max(Math.abs(t.c[1]-r[1])-e[1],0);return o*o+n*n<t.r*t.r}function zd(r,e,t,o=4){let n=s=>t.room.length<3||[[s[0]-e[0],s[1]-e[1]],[s[0]+e[0],s[1]-e[1]],[s[0]+e[0],s[1]+e[1]],[s[0]-e[0],s[1]+e[1]]].every(d=>Y(t.room,d)),i=s=>n(s)&&t.boxes.every(d=>!er(s,e,d))&&t.circles.every(d=>!Bp(s,e,d))&&t.taken.every(d=>Math.abs(d.c[0]-s[0])>=d.half[0]+e[0]||Math.abs(d.c[1]-s[1])>=d.half[1]+e[1]),a=Nd(t.room,r);for(let s of jd(r,o,Math.min(a,600)))if(i(s))return s}var Up=[10,4];function Wd(r,e,t,o){return{room:r.outline.map(n=>e(n)),boxes:r.objects.filter(n=>n.hidden!==!0&&n.kind!=="rug").map(n=>J(Q(n)).map(i=>e(i))),circles:t,taken:o}}function Bd(r,e,t){for(let[o,n]of e.entries())for(let i of Up){let a=zd(r,[n[0]+i,n[1]+i],t);if(a!==void 0)return{at:a,pill:o}}for(let[o,n]of e.entries()){let i=zd(r,n,t);if(i!==void 0)return{at:i,pill:o}}}var Gp=18,In=16;function nr(r){return r.length*5.9+14}var Vp=/^[-–—·|:/,]+$/;function Sn(r){return r.split(/\s+/).filter(e=>e!==""&&!Vp.test(e))}var tr=(r,e)=>r.toLowerCase().replace(/['’]/g,"")===e.toLowerCase().replace(/['’]/g,"");function qp(r,e){if(e===void 0)return r;let t=Sn(e);return t.length===0||r.length<=t.length?r:t.every((o,n)=>tr(o,r[n]))?r.slice(t.length):r}function Xp(r){let e=Math.min(...r.map(n=>n.length)),t=0;for(;t<e-1&&r.every(n=>tr(n[t],r[0][t]));)t+=1;let o=0;for(;t+o<e-1&&r.every(n=>tr(n[n.length-1-o],r[0][r[0].length-1-o]));)o+=1;return r.map(n=>n.slice(t,n.length-o))}function Ud(r,e=Gp){let t=r.join(" ");if(t.length<=e)return t;let o="";for(let n of r){let i=o===""?n:`${o} ${n}`;if(i.length>e-1)break;o=i}return`${o===""?t.slice(0,e-1).trimEnd():o}\u2026`}var Yp=r=>r.slice(0,r.indexOf("."));function Gd(r,e){return te(r,e)?.id??""}function Zp(r,e){let t=new Map,o=new Map;for(let i of r.pins){let a=te(r,i),s=Sn(e(i));t.set(i.id,qp(s,a===void 0?void 0:T(a)));let d=`${a?.id??""}|${Yp(i.entityId)}`;o.set(d,[...o.get(d)??[],i])}for(let i of o.values()){let a=[...new Set(i.map(l=>t.get(l.id).join(" ")))];if(a.length<2||a.some(l=>l===""))continue;let s=Xp(a.map(Sn)),d=new Map(a.map((l,p)=>[l,s[p]]));for(let l of i)t.set(l.id,d.get(t.get(l.id).join(" ")))}let n=new Map;for(let i of r.pins){let a=t.get(i.id);n.set(i.id,a.length===0?Ud(Sn(e(i))):Ud(a))}return n}function Vd(r){return r.replace(/[-+−]?\d[\d.,]*/g,"").trim()}function Yd(r,e){let t=Zp(r,e.nameOf),o=new Map,n=new Map;for(let a of r.pins){if(a.reading==="none"||a.reading==="name")continue;let s=e.readingOf(a);if(s===void 0||s==="")continue;o.set(a.id,s);let d=`${Gd(r,a)}|${Vd(s)}`;n.set(d,(n.get(d)??new Set).add(a.entityId))}let i=new Map;for(let a of r.pins){if(e.picked(a)||a.reading==="name"){i.set(a.id,{text:e.nameOf(a),must:!0});continue}if(a.reading==="none")continue;let s=o.get(a.id);if(s!==void 0){let d=(n.get(`${Gd(r,a)}|${Vd(s)}`)?.size??0)>1;i.set(a.id,{text:d?`${t.get(a.id)} ${s}`:s,must:!0});continue}e.names&&i.set(a.id,{text:t.get(a.id),must:!1})}return i}var or=2,qd=4;function Xd(r,e){return Math.abs(r.c[0]-e.c[0])<r.half[0]+e.half[0]+or&&Math.abs(r.c[1]-e.c[1])<r.half[1]+e.half[1]+or}function Qp(r,e){let t=Math.max(Math.abs(e.c[0]-r.c[0])-r.half[0],0),o=Math.max(Math.abs(e.c[1]-r.c[1])-r.half[1],0);return Math.hypot(t,o)<e.r+or}function Zd(r,e,t=[],o=[]){let n=[],i=new Map,a=[...r.filter(s=>e.get(s.id)?.must===!0),...r.filter(s=>e.get(s.id)?.must===!1)];for(let s of a){let d=e.get(s.id),l=[nr(d.text)/2,In/2],[p,h]=s.c,m=s.r+qd+l[1],u=s.r+qd+l[0],f=[[p,h+m],[p,h-m],[p+u,h],[p-u,h]],g=v=>{let x={c:v,half:l};return r.every(R=>R.id===s.id||!Qp(x,R))&&n.every(R=>!Xd(x,R))&&t.every(R=>!Xd(x,R))},w=s.room,y=v=>w===void 0||w.length<3||[[v[0]-l[0],v[1]-l[1]],[v[0]+l[0],v[1]-l[1]],[v[0]+l[0],v[1]+l[1]],[v[0]-l[0],v[1]+l[1]]].every(x=>Y(w,x)),M=v=>o.every(x=>!er(v,l,x)),$=f.find(v=>y(v)&&g(v)&&M(v))??f.find(v=>y(v)&&g(v))??f.find(g)??(d.must?f[0]:void 0);$!==void 0&&(n.push({c:$,half:l}),i.set(s.id,$))}return i}var ir=["light","cover","fan","climate","media_player","lock","vacuum","humidifier","water_heater","alarm_control_panel","valve"],el=["switch","input_boolean","camera","siren","remote"];function tl(r){let e=r.indexOf(".");return e<0?r:r.slice(0,e)}function Rn(r){if(r.category!==void 0&&r.category!==null&&r.category!==""||r.hidden===!0)return;let e=tl(r.entityId);if(ir.includes(e))return"main";if(el.includes(e))return"switch"}function ol(r){return new Set((r?.floors??[]).flatMap(e=>e.pins.map(t=>t.entityId)))}function Qd(r){let e=tl(r),t=ir.indexOf(e);return t>=0?t:ir.length+el.indexOf(e)}function Jd(r,e){let t=Qd(r.entityId)-Qd(e.entityId);if(t!==0)return t;let o=r.name.toLowerCase(),n=e.name.toLowerCase();return o!==n?o<n?-1:1:r.entityId<e.entityId?-1:r.entityId>e.entityId?1:0}function Nt(r,e,t,o=ol(t)){let n=[],i=[],a=r.areaId;if(a===void 0||a==="")return{main:n,more:i};for(let s of e){if(s.areaId!==a||o.has(s.entityId))continue;let d=Rn(s);d==="main"?n.push(s):d==="switch"&&i.push(s)}return n.sort(Jd),i.sort(Jd),{main:n,more:i}}function rr(r,e){let t=ol(r),o=r?.floors??[],n=new Set(o.flatMap(a=>a.rooms.map(s=>s.areaId)).filter(a=>a!==void 0&&a!=="")),i=new Set;for(let a of e)a.areaId!==void 0&&n.has(a.areaId)&&!t.has(a.entityId)&&Rn(a)==="main"&&i.add(a.entityId);return{rooms:o.reduce((a,s)=>a+s.rooms.length,0),placed:t.size,waiting:i.size}}var ar="Finish your map";function sr(r){return`${r.filter(e=>e.done).length} of ${r.length} done`}var $o=(r,e,t)=>`${r} ${r===1?e:t}`;function Jp(r,e){return r===0?e>0?`${$o(e,"device waits","devices wait")} in your rooms.`:"Put your lights and devices on the map.":e>0?`${r} on the map. ${$o(e,"more waits","more wait")}.`:`${r} on the map.`}function nl(r,e){return[{id:1,title:"Rooms",words:`${$o(r.rooms,"room","rooms")}.`,done:r.rooms>0},{id:2,title:"Devices",words:Jp(r.placed,r.waiting),done:r.placed>0},{id:3,title:"On a page",words:e?"On a page.":"Put the map on a page to use it each day.",done:e}]}function Dn(r){return r.find(e=>!e.done)}function il(r,e){return e>0?`${r} \xB7 ${xo(e)}`:r}function xo(r){return $o(r,"waits","wait")}function rl(r){return r.onMap>0&&r.wait>0?`${r.onMap} on the map \xB7 ${xo(r.wait)}`:r.onMap>0?`${r.onMap} on the map`:r.wait>0?xo(r.wait):r.hasArea?r.more>0?dr(r.more):"No devices in its area":"No area"}function dr(r){return`${$o(r,"switch","switches")} and more`}var On=Math.PI/4,lr=8,ct="#ffbf55",C=r=>r.toFixed(1);function eh(r,e){return`${ui(r.domain)} \xB7 ${be(r.entityId,e)}`}function th(r,e){let t=ui(r.domain);return`${t.charAt(0).toUpperCase()}${t.slice(1)} \xB7 ${be(r.entityId,e)}`}function oh(r,e){let t=te(r,e);if(t===void 0)return"Not in a room";let o=q(r,e.at);return o!==void 0&&k(o.id,t.id)?`${T(t)} (found by place)`:T(t)}function nh(r,e,t){return r.icon!==void 0?hn[r.icon]:`Auto (${hn[ke(r.entityId,e,t)].toLowerCase()})`}var al={ceiling:"Ceiling",floor:"Floor",table:"Table",wall:"Wall",bulb:"Just a bulb"},pl="wa-home-map-lamp-choice";function hl(){try{return globalThis.localStorage??void 0}catch{return}}function ml(){try{let r=hl()?.getItem(pl);return $t.includes(r)?r:void 0}catch{return}}function pr(r){try{hl()?.setItem(pl,r)}catch{}}function hr(){return ml()??"ceiling"}var cl={ceiling:"Ceiling lamp",floor:"Floor lamp",table:"Table lamp",wall:"Wall lamp",bulb:"Just a bulb"},ye=r=>r.startsWith("light."),ih=16,An=class{constructor(e){this.picture=e;this.side=!0;this.names=!0;this.moving=!1;this.iconsOpen=!1;this.pickPage=!1;this.chooserFocus=!1;this.moreOpen=new Set;this.blinking=new Set}states(e){return e.toggles.live?e.hass?.states:void 0}areaCard(e,t,o){let n=bs(e.hass,t,o);if(n===void 0)return b;let i=l=>l===void 0?"No area":e.areas.find(p=>p.id===l)?.name??l,a=i(n.roomAreaId),s=this.areaMove?.entityId===t?this.areaMove.state:void 0,d=async()=>{let l=e.hass;if(l!==void 0){this.areaMove={entityId:t,state:"busy"},e.redraw();try{await l.connection.sendMessagePromise({type:"config/entity_registry/update",entity_id:t,area_id:n.roomAreaId}),this.areaMove=void 0}catch{this.areaMove={entityId:t,state:"failed"}}e.redraw()}};return D("Area",c`
      ${G("In Home Assistant",c`<span class="hme-in hme-ro">${i(n.deviceAreaId)}</span>`)}
      ${G("On the map",c`<span class="hme-in hme-ro">${a}</span>`)}
      ${n.movable?c`<div class="hme-row-end">
        <button type="button" class="hme-tb" ?disabled=${s==="busy"} title="Set this device's area in Home Assistant to the room's"
          @click=${d}>${s==="busy"?"Moving\u2026":`Move to ${a} in Home Assistant`}</button></div>`:b}
      ${s==="failed"?W("Home Assistant did not take the change. Set the area in its settings instead.",!0):b}
      ${W("They can differ on purpose, for a group kept in an area of its own.",!0)}`)}picked(e){let t=e.selection;return t?.kind==="pin"?e.floor.pins.find(o=>k(o.id,t.pinId)):void 0}picks(e){return nt(e.selection).flatMap(t=>e.floor.pins.filter(o=>k(o.id,t)))}deviceClass(e,t){let o=e.hass?.states?.[t]?.attributes?.device_class;return typeof o=="string"?o:void 0}friendly(e,t){let o=e.hass?.states?.[t]?.attributes?.friendly_name;return typeof o=="string"&&o.trim()!==""?o.trim():void 0}place(e,t,o,n){let i=ot(e.doc,t);if(i!==void 0)return k(i.floorId,e.floor.id)||e.setFloor(i.floorId),e.select({kind:"pin",pinId:i.pinId}),!1;let a=ro(e.floor,n),s=o??(a===void 0?Be(e.view,[e.stage.width/2,e.stage.height/2]):this.freeSpot(e,a)),d=e.newId().toUpperCase(),l=e.floor.id,p=this.friendly(e,t),h=e.apply(m=>Ka(m,l,{id:d,entityId:t,at:[s[0],s[1]],...p===void 0?{}:{name:p}}),{select:{kind:"pin",pinId:d}});return h||e.note("warn","That device could not be put on the map: the map holds at most 400 devices."),h}deviceRow(e,t,o){let n=ye(t.entityId),i=n?void 0:ot(e.doc,t.entityId),a=n?rn(e.doc,t.entityId).length:0,s=ke(t.entityId,t.deviceClass,t.name),d=()=>n?this.addLight(e,t.entityId,void 0,t.areaId):this.place(e,t.entityId,void 0,t.areaId),l=n?"Drag onto the plan or onto a lamp, or click to add it in its area's room. A light can be on the map many times.":i===void 0?"Drag onto the plan, or click to put it in its area's room":"On the map: click to pick it";return c`<div class="hme-dv ${this.dragging===t.entityId?"dragging":""} ${i===void 0?"":"placed"}" role="button" tabindex="0"
      draggable=${i===void 0?"true":"false"} title=${l}
      @dragstart=${p=>{p.dataTransfer?.setData(io,t.entityId),n&&p.dataTransfer?.setData(ln,t.entityId),p.dataTransfer?.setData("text/plain",t.entityId),p.dataTransfer&&(p.dataTransfer.effectAllowed="copy"),this.dragging=t.entityId,e.redraw()}}
      @dragend=${()=>{this.dragging=void 0,this.dropAt=void 0,this.lampOver=void 0,e.redraw()}}
      @click=${d}
      @keydown=${p=>{p.target===p.currentTarget&&(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),d())}}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${de(s,"currentColor",24,2)}</svg></span>
      <span class="hme-dv-nm">${t.name}<small>${i===void 0?eh(t,o):"on the map"}</small></span>
      ${a===0?b:c`<button type="button" class="hme-dv-count" title="Pick the next one on the map"
        @click=${p=>{p.stopPropagation(),this.pickNext(e,t.entityId)}}
        @keydown=${p=>p.stopPropagation()}>${a} on map</button>`}
      <span class="hme-dv-grip" aria-hidden="true">${i===void 0?"\u22EE\u22EE":"\u203A"}</span>
    </div>`}pickNext(e,t){let o=e.doc.floors.flatMap(l=>l.pins.filter(p=>p.entityId===t).map(p=>({floor:l,pin:p})));if(o.length===0)return;let n=e.selection,i=n?.kind==="pin"?n.pinId:n?.kind==="object"?Ne(e.floor,n.roomId,n.object)?.id:void 0,a=i===void 0?-1:o.findIndex(l=>k(l.pin.id,i)),s=o[(a+1)%o.length];k(s.floor.id,e.floor.id)||e.setFloor(s.floor.id);let d=we(s.floor,s.pin.id);e.select(d===void 0?{kind:"pin",pinId:s.pin.id}:{kind:"object",roomId:d.roomId,object:d.object})}homeDevices(e){return e.devices??tt(e.hass)}waitingIn(e,t){return Nt(t,this.homeDevices(e),e.doc)}freeSpot(e,t){let o=Z(t)??ue(t),n=Math.max(e.px(1),1),i=T(t).length*7.4+22,a={at:o,halfW:Math.min((i/2+14)/n,1.2),halfH:Math.min(25/n,.5)};return Kd(t,Ye(e.floor,t.id),a)??o}arm(e,t){this.armed=this.armed===t?void 0:t,e.redraw()}placeArmed(e,t){let o=this.armed;if(o===void 0)return;this.armed=void 0;let n=ye(o),i=this.emptyThingAt(e,t,n),a=q(e.floor,t);(i!==void 0?this.putOn(e,i,o):n?this.placeLight(e,o,t):this.place(e,o,t))&&(this.trayRoom=i?.roomId??a?.id),e.redraw()}blink(e,t){let o=e.hass,n=o?.states?.[t]?.state;if(o===void 0||!ye(t)||n===void 0||n==="unavailable"||this.blinking.has(t))return;let i=n==="on";this.blinking.add(t),e.redraw();let a=s=>e.note("warn",`Could not blink it: ${s instanceof Error?s.message:String(s?.message??s)}`);Bt(o,"light",i?"turn_off":"turn_on",{entity_id:t}).then(()=>new Promise(s=>setTimeout(s,1e3)).then(()=>Bt(o,"light",i?"turn_on":"turn_off",{entity_id:t}))).catch(a).finally(()=>{this.blinking.delete(t),e.redraw()})}trayRow(e,t){let o=ye(t.entityId),n=this.armed===t.entityId,i=ke(t.entityId,t.deviceClass,t.name),a=e.hass?.states?.[t.entityId]?.state,s=o&&a!==void 0&&a!=="unavailable";return c`<div class="hme-dv hme-tray-row ${n?"armed":""} ${this.dragging===t.entityId?"dragging":""}" role="button" tabindex="0"
      draggable="true" aria-pressed=${n?"true":"false"}
      title=${n?"Click its place on the plan. Click here again to stop.":"Drag it onto the plan, or click it, then click its place"}
      @dragstart=${d=>{d.dataTransfer?.setData(io,t.entityId),o&&d.dataTransfer?.setData(ln,t.entityId),d.dataTransfer?.setData("text/plain",t.entityId),d.dataTransfer&&(d.dataTransfer.effectAllowed="copy"),this.dragging=t.entityId,this.armed=void 0,e.redraw()}}
      @dragend=${()=>{this.dragging=void 0,this.dropAt=void 0,this.lampOver=void 0,e.redraw()}}
      @click=${()=>this.arm(e,t.entityId)}
      @keydown=${d=>{d.target===d.currentTarget&&(d.key==="Enter"||d.key===" ")&&(d.preventDefault(),this.arm(e,t.entityId))}}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${de(i,"currentColor",24,2)}</svg></span>
      <span class="hme-dv-nm">${t.name}<small>${th(t,e.hass?.states)}</small></span>
      ${s?c`<button type="button" class="hme-tb hme-blink" ?disabled=${this.blinking.has(t.entityId)} title="Turn it the other way for a second, to see which light it is"
        @click=${d=>{d.stopPropagation(),this.blink(e,t.entityId)}}
        @keydown=${d=>d.stopPropagation()}>Blink</button>`:b}
      <span class="hme-dv-grip" aria-hidden="true">⋮⋮</span>
    </div>`}trayCard(e,t,o="Not on the map"){let n=this.waitingIn(e,t),i=this.moreOpen.has(t.id.toUpperCase()),a=n.more.length===0?b:c`<button type="button" class="hme-tray-more" aria-expanded=${i?"true":"false"}
        @click=${()=>{let d=t.id.toUpperCase();i?this.moreOpen.delete(d):this.moreOpen.add(d),e.redraw()}}>
        ${dr(n.more.length)}<span aria-hidden="true">${i?"\u25BE":"\u203A"}</span></button>
      ${i?n.more.map(d=>this.trayRow(e,d)):b}`,s=b;if(t.areaId===void 0){let d=t.id;s=c`<p class="hme-empty-line">This room has no area. Pick one below to see its devices.</p>
        ${G("Area",xe({label:"Area",value:"",options:[{value:"",label:"None"},...e.areas.map(l=>({value:l.id,label:l.name}))],set:l=>{l!==""&&e.apply(p=>Ko(p,d,l))}}))}`}else if(n.main.length===0&&n.more.length===0){let d=this.homeDevices(e).some(l=>l.areaId===t.areaId&&Rn(l)!==void 0);s=c`<p class="hme-empty-line">${d?"Every device of this room is on the map.":"No devices in this room's area."}</p>`}return D(o,c`
      ${n.main.length===0&&n.more.length===0?b:c`<p class="hme-foot-hint hme-tray-how">Drag one onto the plan. Or click it, then click its place.</p>`}
      ${s}
      <div class="hme-tray">${n.main.map(d=>this.trayRow(e,d))}${a}</div>`,n.main.length===0?void 0:xo(n.main.length),"hme-tray-card")}onMapCard(e,t){let o=Ye(e.floor,t.id),n=this.states(e),i=nt(e.selection);return D("On the map",c`<div class="hme-ly-list">
      ${o.length===0?c`<p class="hme-empty-line">No devices yet.</p>`:o.map(a=>{let s={kind:"pin",pinId:a.id},d=e.hover?.kind==="pin"&&k(e.hover.pinId,a.id),l=i.some(p=>k(p,a.id));return c`<div class="hme-ly ${l?"on":""} ${d?"hov":""}"
          @pointerenter=${()=>e.setHover(s)} @pointerleave=${()=>e.setHover(void 0)}>
          <button type="button" class="hme-ly-main" aria-pressed=${l?"true":"false"} title="Pick it. Shift, Cmd or Ctrl and a click picks several."
            @click=${p=>e.select(p.shiftKey||p.metaKey||p.ctrlKey?Rt(e.selection,a.id):s)}>
            <span class="hme-dot dev ${Zi(a.entityId,n)||!ye(a.entityId)?"":"off"}" aria-hidden="true"></span><span class="hme-ly-nm">${re(a,e.hass)}</span><span class="hme-ly-end">${be(a.entityId,n)}</span></button>
        </div>`})}</div>`,String(o.length),"hme-onmap")}addLight(e,t,o,n){let i=o===void 0?ro(e.floor,n??hs(e.hass,t)):void 0,a=o??(i===void 0?Be(e.view,[e.stage.width/2,e.stage.height/2]):Z(i)??ue(i)),s=q(e.floor,a)??i,d=ml();this.chooser={entityId:t,at:[a[0],a[1]],roomId:s?.id,choice:s===void 0?"bulb":d??"ceiling"},this.chooserFocus=!0,e.redraw()}get choosing(){return this.chooser!==void 0}cancelChooser(e){this.chooser=void 0,e.redraw()}canChoose(e){return e==="bulb"||this.chooser?.roomId!==void 0}takeChoice(e,t){let o=this.chooser;if(o===void 0)return;let n=t??o.choice;this.canChoose(n)&&(this.chooser=void 0,pr(n),this.lightIn(e,o.entityId,n,o.at,o.roomId))}lightIn(e,t,o,n,i){let a=e.newId().toUpperCase(),s=e.floor.id,d=i===void 0?void 0:e.doc.floors.find(m=>k(m.id,s))?.rooms.find(m=>k(m.id,i)),l=this.friendly(e,t),p=o!=="bulb"&&d!==void 0?{kind:"object",roomId:d.id,object:d.objects.length}:{kind:"pin",pinId:a},h=e.apply(m=>Va(m,s,i,t,o,n,a,l)?.doc,{select:p});return h||e.note("warn","That light could not be put on the map: the map holds at most 400 devices, and a room at most 256 things."),h}placeLight(e,t,o){let n=q(e.floor,o);return this.lightIn(e,t,n===void 0?"bulb":hr(),[o[0],o[1]],n?.id)}chooserKey(e,t){let o=this.chooser;if(o===void 0)return!1;switch(t.key){case"Enter":return this.takeChoice(e),!0;case"Escape":return this.cancelChooser(e),!0;case"ArrowLeft":case"ArrowUp":case"ArrowRight":case"ArrowDown":{let n=$t.filter(a=>this.canChoose(a)),i=t.key==="ArrowLeft"||t.key==="ArrowUp"?-1:1;return o.choice=n[(n.indexOf(o.choice)+i+n.length)%n.length]??o.choice,this.chooserFocus=!0,e.redraw(),!0}case"Delete":case"Backspace":return!0;default:return!1}}lampChooser(e){let t=this.chooser;if(t===void 0)return b;let o=e.toScreen(t.at),n=e.toScreen(e.toPlan(0,0)),i=o[0]-n[0],a=o[1]-n[1],s=344,d=globalThis.innerWidth??1/0,l=i+22+s>d?Math.max(8,i-22-s):i+22,p=t.roomId===void 0?void 0:e.floor.rooms.find(u=>k(u.id,t.roomId)),h=this.chooserFocus;this.chooserFocus=!1;let m=this.friendly(e,t.entityId)??t.entityId;return c`<div class="hme-scrim hme-lamp-scrim" @pointerdown=${u=>{u.target===u.currentTarget&&this.cancelChooser(e)}}>
      <div class="hme-lampc" role="dialog" aria-label="Which lamp is it in?" style=${`left:${Math.round(l)}px;top:${Math.round(Math.max(8,a-64))}px;width:${s}px`}
        @keydown=${u=>{this.chooserKey(e,u)&&(u.preventDefault(),u.stopPropagation())}}>
        <div class="hme-lampc-t"><strong>${m}</strong>
          <span>${p===void 0?"In no room, so just a bulb.":`In ${T(p)}. Which lamp is it in?`}</span></div>
        <div class="hme-lampc-row" role="group" aria-label="Lamp">
          ${$t.map(u=>{let f=u===t.choice,g=this.canChoose(u),w=pa[u];return c`<button type="button" class="hme-lampc-b ${f?"on":""}" aria-pressed=${f?"true":"false"} ?disabled=${!g}
              title=${g?al[u]:"A lamp goes in a room"}
              ${at(y=>{h&&f&&y!==void 0&&setTimeout(()=>y.focus?.(),0)})}
              @click=${()=>this.takeChoice(e,u)}>
              ${w===void 0||this.picture===void 0?c`<span class="hme-lampc-pic bulb"><svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">${de("bulb","currentColor",24,1.8)}</svg></span>`:this.picture(e,w,"hme-lampc-pic")}
              <span>${al[u]}</span></button>`})}
        </div>
        <p class="hme-lampc-hint">Enter takes the ringed one · Esc cancels</p>
      </div>
    </div>`}emptyThingAt(e,t,o,n=e.floor){let i=e.toScreen(t),a;for(let s of n.rooms)s.objects.forEach((d,l)=>{if(d.hidden===!0||(o?Xt(d.model)===void 0:d.kind==="rug")||Ne(n,s.id,l)!==void 0)return;let p=e.toScreen(d.c),h=Math.hypot(p[0]-i[0],p[1]-i[1]);h>ih&&!Y(J(Q(d)),t)||(a===void 0||h<a.d)&&(a={ref:{roomId:s.id,object:l},d:h})});return a?.ref}heldThingAt(e,t){let o=this.pinAt(e,e.toScreen(t));return o===void 0?void 0:we(e.floor,o.id)}lampMark(e,t){let o=e.floor.rooms.find(l=>k(l.id,t.roomId))?.objects[t.object];if(o===void 0)return b;let n=J(Q(o)).map(l=>e.toScreen(l).map(C).join(",")).join(" "),[i,a]=e.toScreen(o.c),s=jt(o)?"Put it in this lamp":`Put it on this ${Ee(o)}`,d=s.length*6.4+20;return H`<g class="hme-lamp-over" pointer-events="none">
      <circle cx=${C(i)} cy=${C(a)} r="22" fill="rgba(255,191,85,0.22)" stroke=${ct} stroke-width="2" stroke-dasharray="4 3" />
      <polygon points=${n} fill="rgba(255,191,85,0.3)" stroke=${ct} stroke-width="2" />
      <g class="hme-tag"><rect x=${C(i-d/2)} y=${C(a+28)} width=${C(d)} height="18" rx="9" fill=${ct} />
        <text x=${C(i)} y=${C(a+41)} fill="#3a2600" text-anchor="middle">${s}</text></g>
    </g>`}dragOver(e,t,o){let n=[...o.dataTransfer?.types??[]],i=this.dragging!==void 0||n.includes(io),a=this.dragging!==void 0?ye(this.dragging):n.includes(ln),s=this.dropAt,d=this.lampOver;return this.dropAt=i?t:void 0,this.lampOver=i&&t!==void 0?this.emptyThingAt(e,t,a):void 0,(s!==this.dropAt||JSON.stringify(d)!==JSON.stringify(this.lampOver))&&e.redraw(),i&&t!==void 0}drop(e,t,o){let n=this.dragging??o.dataTransfer?.getData(io)??"";if(this.dragging=void 0,this.dropAt=void 0,this.lampOver=void 0,n===""){e.redraw();return}let i=ye(n),a=this.emptyThingAt(e,t,i),s=q(e.floor,t);(a!==void 0?this.putOn(e,a,n):i?this.placeLight(e,n,t):this.place(e,n,t))&&(this.trayRoom=a?.roomId??s?.id)}putOn(e,t,o){let n=e.floor.id,i=ye(o)?void 0:ot(e.doc,o),a={select:{kind:"object",...t}};if(i!==void 0)return k(i.floorId,n)?e.apply(l=>an(l,n,t.roomId,t.object,i.pinId),a):(e.note("warn","That device is on another floor's map. Remove it there first to put it here."),!1);let s=e.newId().toUpperCase(),d=e.apply(l=>Xa(l,n,t.roomId,t.object,o,s),a);return d||e.note("warn","That device could not be put on it: the map holds at most 400 devices."),d}overlay(e){let t=this.states(e),o=this.picked(e),n=nt(e.selection),i=[],a=this.lampOver===void 0?b:this.lampMark(e,this.lampOver);a!==b?i.push(a):this.dropAt!==void 0&&i.push(this.dropMark(e,this.dropAt));let s=o===void 0?void 0:Se(o.entityId,t);o!==void 0&&s?.kind==="light"&&i.push(this.glowRing(e,o,s.on?s.brightness:void 0));let d=h=>n.some(m=>k(h.id,m)),l=Yd(e.floor,{nameOf:h=>re(h,e.hass),readingOf:h=>Hs(h,t),picked:d,names:this.names}),p=Zd(e.floor.pins.map(h=>({id:h.id,c:e.toScreen(h.at),r:d(h)?20:12,room:te(e.floor,h)?.outline.map(m=>e.toScreen(m))})),l,e.roomNameBoxes?.()??[],e.floor.rooms.flatMap(h=>h.objects.filter(m=>m.hidden!==!0&&m.kind!=="rug").map(m=>J(Q(m)).map(u=>e.toScreen(u)))));for(let h of e.floor.pins){let m=p.get(h.id),u=m===void 0?void 0:{text:l.get(h.id).text,at:m};i.push(this.pinMark(e,h,d(h),!1,t,u))}return this.box!==void 0&&i.push(this.boxMark(e,this.box)),H`${i}`}boxMark(e,t){let[o,n]=e.toScreen(t.a),[i,a]=e.toScreen(t.b);return H`<rect class="hme-box" x=${C(Math.min(o,i))} y=${C(Math.min(n,a))} width=${C(Math.abs(i-o))} height=${C(Math.abs(a-n))}
      fill="rgba(91,141,239,0.12)" stroke="#5b8def" stroke-width="1.2" stroke-dasharray="4 3" pointer-events="none" />`}pinMark(e,t,o,n,i,a){let[s,d]=e.toScreen(t.at),l=Ps(t,i),p=t.icon??ke(t.entityId,this.deviceClass(e,t.entityId),this.friendly(e,t.entityId)),h=o?13:12,m=a===void 0?0:nr(a.text),u=a===void 0?0:a.at[0]-s,f=a===void 0?0:a.at[1]-d;return H`<g class="hme-pin" data-hme="pin" data-pin=${t.id} transform=${`translate(${C(s)} ${C(d)})`} opacity=${n?.25:1} style="cursor:grab">
      ${o?H`<circle r="20" fill="none" stroke="#5b8def" stroke-width="2.5" />`:b}
      ${l.lit?H`<circle r=${h+7} fill=${l.fill} opacity="0.22" />`:b}
      <circle r=${h} fill=${l.fill} stroke=${l.ring} stroke-width="1.4" />
      <g transform="translate(-7 -7)">${de(p,l.ink,14,1.5)}</g>
      ${a===void 0||a.text===""?b:H`<g pointer-events="none"><rect x=${C(u-m/2)} y=${C(f-In/2)} width=${C(m)} height=${In} rx="8" fill=${o?"#5b8def":"rgba(0,0,0,0.7)"} />
        <text x=${C(u)} y=${C(f+3.5)} fill="#fff" font-size="10" font-weight="600" text-anchor="middle">${a.text}</text></g>`}
    </g>`}glowRing(e,t,o){let[n,i]=e.toScreen(t.at),a=ao(t,o),s=e.px(a),d=[n+s*Math.cos(On),i+s*Math.sin(On)],l=`Glow ${a.toFixed(1)} m`,p=l.length*6.2+18,h=t.glowSpill===!0?void 0:te(e.floor,t),m=h!==void 0&&h.outline.length>=3?h.outline.map(f=>e.toScreen(f).map(C).join(",")).join(" "):void 0,u=f=>H`<circle cx=${C(n)} cy=${C(i)} r=${C(s)} fill="none" stroke=${so(t)??"#5b8def"} stroke-width="1.4"
      stroke-dasharray="5 5" opacity=${f} pointer-events="none" />`;return H`<g class="hme-glow-ring">
      ${m===void 0?u(1):H`<clipPath id="hme-glow-walls"><polygon points=${m} /></clipPath>
        ${u(.28)}<g clip-path="url(#hme-glow-walls)">${u(1)}</g>`}
      <circle data-hme="glow" cx=${C(d[0])} cy=${C(d[1])} r="7" fill="#fff" stroke="#5b8def" stroke-width="2" style="cursor:nwse-resize">
        <title>Drag to set how far this light's glow reaches</title></circle>
      <g class="hme-tag" pointer-events="none"><rect x=${C(d[0]-p/2)} y=${C(d[1]+12)} width=${C(p)} height="18" rx="9" fill="#5b8def" />
        <text x=${C(d[0])} y=${C(d[1]+25)} fill="#fff" text-anchor="middle">${l}</text></g>
    </g>`}dropMark(e,t){let o=q(e.floor,t),[n,i]=e.toScreen(t),a=o===void 0?"Drop here, in no room":`Drop in ${T(o)}`,s=a.length*6.4+20;return H`<g class="hme-drop" pointer-events="none">
      ${o===void 0?b:H`<polygon points=${o.outline.map(d=>e.toScreen(d).map(C).join(",")).join(" ")}
        fill="rgba(91,141,239,0.18)" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />`}
      <circle cx=${C(n)} cy=${C(i)} r="13" fill="rgba(91,141,239,0.35)" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 2" />
      <g class="hme-tag"><rect x=${C(n-s/2)} y=${C(i+20)} width=${C(s)} height="18" rx="9" fill="#5b8def" />
        <text x=${C(n)} y=${C(i+33)} fill="#fff" text-anchor="middle">${a}</text></g>
    </g>`}pinAt(e,t){return ji(e.floor,e.toScreen,t)}pointerDown(e,t,o){return t.button!==0?!1:this.pressHandle(e,t,o)||this.pressPin(e,t,o)||this.pressBox(e,t,o)}pressHandle(e,t,o){let n=this.picked(e);if(n===void 0||t.shiftKey||t.metaKey||t.ctrlKey)return!1;let i=Se(n.entityId,this.states(e));if(i.kind!=="light")return!1;let a=e.toScreen(o),[s,d]=e.toScreen(n.at),l=e.px(ao(n,i.on?i.brightness:void 0));return Math.hypot(a[0]-(s+l*Math.cos(On)),a[1]-(d+l*Math.sin(On)))>10?!1:(this.glowDrag(e,t,n),!0)}onPin(e,t){return this.pinAt(e,e.toScreen(t))!==void 0}pressBox(e,t,o){return t.shiftKey?(this.boxDrag(e,t,o),!0):!1}pressPin(e,t,o){let n=t.shiftKey||t.metaKey||t.ctrlKey,i=this.pinAt(e,e.toScreen(o));if(i===void 0)return!1;if(this.pickPage=!1,this.iconsOpen=!1,n)return e.select(Rt(e.selection,i.id)),!0;let a=nt(e.selection);return a.length>1&&a.some(s=>k(s,i.id))?(this.groupDrag(e,t,a,i.id,o),!0):(e.select({kind:"pin",pinId:i.id}),this.moveDrag(e,t,i,o),!0)}groupDrag(e,t,o,n,i){let a=[0,0],s=pn(o);e.drag(t,{move:d=>{this.moving=!0,a=[d[0]-i[0],d[1]-i[1]];let[l,p]=a;e.preview(h=>on(h,o,l,p))},end:(d,l,p)=>{this.moving=!1,e.preview(void 0);let[h,m]=a;p?Math.hypot(h,m)>=.005&&e.apply(u=>on(u,o,h,m),s===void 0?{}:{select:s}):e.select({kind:"pin",pinId:n})},cancel:()=>this.stopDrag(e)})}stopDrag(e){this.moving=!1,this.box=void 0,this.lampOver=void 0,e.preview(void 0)}boxDrag(e,t,o){let n=e.floor.pins,i=e.selection;e.drag(t,{move:a=>{this.box={a:o,b:a},e.redraw()},end:(a,s,d)=>{this.box=void 0,d?e.select(us(i,fs(n,o,a))):e.redraw()},cancel:()=>this.stopDrag(e)})}async removePicks(e,t){t.length!==0&&(t.length>1&&!await e.confirm({title:`Remove ${F(t.length,"device")} from the map?`,text:"They come off the map, and Add can put them back. Undo puts them back where they were.",ok:"Remove",danger:!0})||e.apply(o=>Ua(o,t),{select:null}))}moveDrag(e,t,o,n){let i=o.id,a=e.floor,s=a.id,d=[o.at[0],o.at[1]],l=we(a,i)===void 0,p=ye(o.entityId),h=d;e.drag(t,{move:m=>{this.moving=!0,h=[d[0]+m[0]-n[0],d[1]+m[1]-n[1]];let u=l?this.emptyThingAt(e,h,p,a):void 0;this.lampOver=u,e.preview(u===void 0?f=>hi(f,i,h):f=>an(f,s,u.roomId,u.object,i))},end:(m,u,f)=>{let g=this.lampOver;this.moving=!1,this.lampOver=void 0,e.preview(void 0),f&&g!==void 0?e.apply(w=>an(w,s,g.roomId,g.object,i),{select:{kind:"object",...g}}):f&&Math.hypot(h[0]-d[0],h[1]-d[1])>=.005&&e.apply(w=>hi(w,i,h),{select:{kind:"pin",pinId:i}})},cancel:()=>this.stopDrag(e)})}glowDrag(e,t,o){let n=o.id,i;e.drag(t,{move:a=>{this.moving=!0;let s=Math.hypot(a[0]-o.at[0],a[1]-o.at[1]);i=Math.min(Math.max(Math.round(s/.05)*.05,Ut),Lr);let d=i;e.preview(l=>Je(l,n,{glow:d}))},end:()=>{this.moving=!1,e.preview(void 0);let a=i;a!==void 0&&e.apply(s=>Je(s,n,{glow:a}))},cancel:()=>this.stopDrag(e)})}keyDown(e,t){let o=this.picks(e).map(i=>i.id);if(o.length===0)return!1;let n=oe(t,!1);if(n==="delete")return this.removePicks(e,o),!0;if(typeof n=="object"&&"nudge"in n){let[i,a]=n.nudge;return e.apply(s=>on(s,o,i,a)),!0}return!1}leave(){this.dragging=void 0,this.dropAt=void 0,this.box=void 0,this.moving=!1,this.iconsOpen=!1,this.pickPage=!1,this.chooser=void 0,this.lampOver=void 0,this.armed=void 0,this.trayRoom=void 0}viewItems(e){return[{label:"Side view",on:this.side,title:"The picked device's room from the side, to set its height",flip:()=>{this.side=!this.side,e.redraw()}},{label:"Names",on:this.names,title:"Each device's short name by its pin, where there is room",flip:()=>{this.names=!this.names,e.redraw()}}]}stageExtra(e){let t=this.picked(e);if(!this.side||t===void 0)return b;let o=te(e.floor,t),n=o?.height??2.5,i=ge(o?.outline??e.floor.rooms.flatMap(v=>v.outline))??{minX:t.at[0]-1,maxX:t.at[0]+1,minY:0,maxY:0},a=18,s=118,d=(s-a)/Math.max(n,.5),l=30,p=262,h=(p-l)/Math.max(i.maxX-i.minX,.5),m=v=>l+(Math.min(Math.max(v,i.minX),i.maxX)-i.minX)*h,u=t.at[2],f=s-Math.min(Math.max(u,0),n)*d,g=m(t.at[0]),w=(()=>{let v=Se(t.entityId,this.states(e));return v.kind==="light"&&v.on})(),y=[];for(let v=0;v<=n+1e-9;v+=1)y.push(v);let M=o===void 0?[]:Kr(o),$=o===void 0?"No room":T(o);return c`<div class="hme-side">
      <div class="hme-h">${$} from the side</div>
      <svg viewBox="0 0 270 130" role="img" aria-label=${`Side view: ${re(t,e.hass)} at ${u.toFixed(2)} m, the wall ${n.toFixed(1)} m tall`}
        @pointerdown=${v=>this.heightDrag(e,v,t,n,s,d)}>
        <path d=${`M${l} ${C(a)}H${p}M${l} ${s}H${p}`} stroke="#ece6da" stroke-width="3" />
        <path d=${`M${l} ${C(a)}V${s}M${p} ${C(a)}V${s}`} stroke="#ece6da" stroke-width="1.5" opacity="0.4" />
        <g font-size="9" fill="#8e8e93" text-anchor="end" class="mono">
          ${y.map(v=>H`<text x=${l-6} y=${C(s-v*d+3)}>${v===0?"0":`${v} m`}</text>
            <path d=${`M${l-4} ${C(s-v*d)}H${l}`} stroke="#8e8e93" />`)}
        </g>
        ${M.map(v=>{let x=m(v.c[0]-v.size[0]/2),R=m(v.c[0]+v.size[0]/2),S=Math.min(v.size[2],n)*d;return H`<rect x=${C(x)} y=${C(s-S)} width=${C(Math.max(R-x,2))} height=${C(S)} rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" />`})}
        <path d=${`M${C(g)} ${s}V${C(f)}`} stroke="#5b8def" stroke-width="1.2" stroke-dasharray="3 3" />
        ${w?H`<circle cx=${C(g)} cy=${C(f)} r="20" fill="#ffb648" opacity="0.22" />`:b}
        <circle cx=${C(g)} cy=${C(f)} r="9" fill=${w?ct:"#3a3a3c"} stroke="#5b8def" stroke-width="2.5" style="cursor:ns-resize" />
        <g class="hme-tag"><rect x=${C(Math.min(g+14,222))} y=${C(f-8)} width="44" height="16" rx="8" fill="#5b8def" />
          <text x=${C(Math.min(g+14,222)+22)} y=${C(f+3.5)} fill="#fff" font-size="10" text-anchor="middle">${u.toFixed(2)} m</text></g>
      </svg>
      <span class="hme-side-hint">Drag the pin up or down here.</span>
    </div>`}heightDrag(e,t,o,n,i,a){if(t.button!==0)return;let s=t.currentTarget,d=o.id,l=u=>{let f=s.getBoundingClientRect(),g=(u.clientY-f.top)*130/Math.max(f.height,1);return Math.min(Math.max(Math.round((i-g)/a/.05)*.05,0),n)},p=l(t);try{s.setPointerCapture(t.pointerId)}catch{}this.moving=!0,e.preview(u=>je(u,d,p));let h=u=>{p=l(u);let f=p;e.preview(g=>je(g,d,f))},m=()=>{s.removeEventListener("pointermove",h),s.removeEventListener("pointerup",m),s.removeEventListener("pointercancel",m),this.moving=!1,e.preview(void 0);let u=p;Math.abs(u-o.at[2])>=.005&&e.apply(f=>je(f,d,u))};s.addEventListener("pointermove",h),s.addEventListener("pointerup",m),s.addEventListener("pointercancel",m)}pill(e){let t=this.picks(e);if(t.length>1&&!this.moving)return this.groupPill(e,t);let o=this.picked(e);if(o===void 0||this.moving)return b;let n=o.id,i=o.entityId.startsWith("light."),a=te(e.floor,o)!==void 0;return c`<span class="hme-pill-name">${re(o,e.hass)}</span>
      ${fi(o.entityId)&&e.hass!==void 0?c`<button type="button" class="hme-tb" @click=${()=>this.toggle(e,o.entityId)}>${gi(o.entityId,e.hass.states)}</button>`:b}
      ${i?c`<button type="button" class="hme-tb" title="Every light on this floor at this light's height" @click=${()=>e.apply(s=>Wa(s,n))}>Same height for all lights</button>`:b}
      ${a?c`<button type="button" class="hme-tb" @click=${()=>e.apply(s=>Ba(s,n))}>Center in room</button>`:b}
      <button type="button" class="hme-tb danger" @click=${()=>e.apply(s=>mi(s,n),{select:null})}>Remove</button>`}groupPill(e,t){let o=t.map(d=>d.id),n=t[0],i=n.at[2],a=t.every(d=>Math.abs(d.at[2]-i)<.005),s=e.hass===void 0?void 0:gs(t.map(d=>d.entityId),e.hass.states);return c`<span class="hme-pill-name">${F(t.length,"device")}</span>
      ${s===void 0?b:c`<button type="button" class="hme-tb" @click=${()=>this.turn(e,t.map(d=>d.entityId),s.service)}>${s.words}</button>`}
      <button type="button" class="hme-tb" ?disabled=${a} title=${a?"They are all at one height":`Every picked device at ${re(n,e.hass)}'s height, ${i.toFixed(2)} m`}
        @click=${()=>e.apply(d=>It(d,o,i))}>Same height</button>
      <button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(e,o)}}>Remove</button>`}toggle(e,t){let o=e.hass;o!==void 0&&Bt(o,"homeassistant","toggle",{entity_id:t}).catch(n=>{e.note("err",`Could not turn it on or off: ${n instanceof Error?n.message:String(n)}`)})}turn(e,t,o){let n=e.hass;n!==void 0&&Bt(n,"homeassistant",o,{entity_id:[...t]}).catch(i=>{e.note("err",`Could not turn them ${o==="turn_on"?"on":"off"}: ${i instanceof Error?i.message:String(i)}`)})}inspector(e){let t=this.picks(e);if(t.length>1)return this.groupInspector(e,t);let o=this.picked(e);if(o===void 0)return b;let n=e.hass?.states,i=o.id,a=Se(o.entityId,n),s=a.kind==="light"&&a.on,d=this.friendly(e,o.entityId),l=this.deviceClass(e,o.entityId),p=ke(o.entityId,l,d),h=o.icon??p,m=te(e.floor,o),u=m?.height??2.5,f=y=>e.apply(M=>Je(M,i,y,d)),w=so(o)??ct;return c`
      <section class="hme-card hme-head">
        <span class="hme-pin-big ${s?"lit":""}" style=${s?`background:${w};box-shadow:0 0 24px ${w}80`:""}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${de(h,s?"#3a2600":"#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${re(o,e.hass)}</strong>
          <span class="mono">${o.entityId}</span>
        </div>
        <span class="hme-state ${s?"lit":""}">${be(o.entityId,n)}</span>
      </section>

      ${D("On the map",c`
        ${G("Name",Ft({value:o.name??"",label:"Name on the map",placeholder:d??o.entityId,set:y=>f({name:y.trim()===""?null:y})}))}
        ${this.iconRows(e,o,f)}
        ${G("Room",c`<span class="hme-in hme-ro">${oh(e.floor,o)}</span>`)}
        ${ll(o,w,f)}`)}

      ${this.areaCard(e,o.entityId,m?.areaId)}

      ${D("Height",c`
        <div class="hme-r">
          <input class="hme-range" type="range" min="0" max=${u} step="0.05" .value=${X(String(o.at[2]))} aria-label="Height" style=${ze(o.at[2],0,u)}
            @input=${y=>{let M=Number(y.target.value);e.preview($=>je($,i,M))}}
            @change=${y=>{let M=Number(y.target.value);e.apply($=>je($,i,M))}} />
          ${j({label:"Height",value:o.at[2],unit:"m",min:0,max:100,width:"92px",set:y=>e.apply(M=>je(M,i,y))})}
        </div>
        <div class="hme-chips">${bi.map(([y,M])=>c`<button type="button" class="hme-chip sel ${Math.abs(o.at[2]-M)<.005?"on":""}"
          @click=${()=>e.apply($=>je($,i,M))}>${y} ${M}</button>`)}</div>
        <p class="hme-text dim">The model looks stand the pin at this height.</p>`)}

      ${o.entityId.startsWith("light.")?this.lightCard(e,o,a.kind==="light"&&a.on?a.brightness:void 0,f):b}

      ${this.tapCard(e,o,f)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>e.apply(y=>mi(y,i),{select:null})}>Remove from the map</button></div>`}iconRows(e,t,o){let n=this.friendly(e,t.entityId),i=this.deviceClass(e,t.entityId),a=ke(t.entityId,i,n),s=t.icon??a;return c`${G("Icon",c`<button type="button" class="hme-in hme-icon-btn" aria-haspopup="true" aria-expanded=${this.iconsOpen?"true":"false"}
        @click=${()=>{this.iconsOpen=!this.iconsOpen,e.redraw()}}>
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">${de(s,"currentColor",24,2)}</svg>
        <span class="hme-grow">${nh(t,i,n)}</span><span class="hme-caret" aria-hidden="true">▾</span></button>`)}
      ${this.iconsOpen?this.iconMenu(e,t,a,o):b}`}iconMenu(e,t,o,n){let i=s=>{this.iconsOpen=!1,n({icon:s}),e.redraw()},a=(s,d,l,p)=>c`<button type="button" class="hme-icon-cell ${l?"on":""}"
      title=${d} aria-label=${d} aria-pressed=${l?"true":"false"} @click=${()=>i(p)}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">${de(s,"currentColor",24,1.9)}</svg><span>${d}</span></button>`;return c`<div class="hme-icons" role="group" aria-label="Icon">
      ${a(o,"Auto",t.icon===void 0,null)}
      ${Ar.map(s=>a(s,hn[s],t.icon===s,s))}
    </div>`}lightCard(e,t,o,n){return D("Light",this.glowRows(e,t,o,n))}glowRows(e,t,o,n){let i=t.id,a=ao(t,o),s=so(t),d=(l,p,h)=>c`<button type="button" class="hme-chip sel ${p?"on":""}" aria-pressed=${p?"true":"false"} @click=${h}>${l}</button>`;return c`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        <input class="hme-range" type="range" min=${Ut} max=${Math.max(lr,a)} step="0.05" .value=${X(String(a))} aria-label="Glow size"
          style=${ze(a,Ut,Math.max(lr,a))}
          @input=${l=>{let p=Number(l.target.value);e.preview(h=>Je(h,i,{glow:p}))}}
          @change=${l=>n({glow:Number(l.target.value)})} />
        <span class="hme-val mono hme-w48">${a.toFixed(1)} m</span></div>
      <div class="hme-row-end indent">${d("By its brightness",t.glow===void 0,()=>n({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${d("Follow the light",t.glowColor===void 0,()=>n({glowColor:null}))}
        ${d("Warm",t.glowColor==="warm",()=>n({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${s!==void 0?"on":""}">${s===void 0?b:c`<span class="hme-swatch" style=${`background:${s}`}></span>`}Pick
          ${bo({value:s??"#ffb648",label:"Pick the glow's color",preview:l=>e.preview(l===void 0?void 0:p=>Je(p,i,{glowColor:l})??p),set:l=>n({glowColor:l})})}</label>
      </div></div>
      ${sl(t.glowSpill===!0?"off":"on",l=>n({glowSpill:l?null:!0}))}
      ${W("The pool of light round this light on the plan and the tiles. Warm is the lamplight every light has without a color of its own.")}`}thingCards(e,t,o){let n=e.floor.rooms.find(E=>k(E.id,t)),i=n?.objects[o];if(n===void 0||i===void 0)return b;let a=jt(i)||Xt(i.model)!==void 0,s=a?"Light":"Device",d=Ee(i),l=e.floor.id,p=Ne(e.floor,n.id,o),h=E=>a?`Put ${E} in this lamp`:`Put ${E} on this ${d}`;if(p===void 0){let E=()=>e.openAdd("devices",{title:a?"Choose a light for this lamp":`Choose a device for this ${d}`,lightsOnly:a,rowTitle:h,pick:O=>{this.putOn(e,{roomId:n.id,object:o},O)||e.redraw()}});return D(s,c`
        ${G(s,c`<span class="hme-in hme-ro dim">None</span>`,c`<button type="button" class="hme-tb" aria-haspopup="dialog" title=${a?"Pick the light this lamp holds":`Pick the device this ${d} is or carries`}
            @click=${E}>Choose…</button>`)}
        ${W(a?"Pick the light this lamp holds, or drag its light's pin onto it on the plan.":`The device this ${d} is or carries, a TV's media player or a fan's switch: choose it, or drag its pin onto it on the plan.`)}`)}let m=e.hass?.states,u=p.id,f=ye(p.entityId),g=Se(p.entityId,m),w=g.kind==="light"&&g.on,y=this.friendly(e,p.entityId),M=E=>e.apply(O=>Je(O,u,E,y)),$=p.icon??ke(p.entityId,this.deviceClass(e,p.entityId),y),v=so(p)??ct,x=e.doc.floors.find(E=>k(E.id,l))?.rooms.find(E=>k(E.id,n.id)),R=()=>{let E=e.newId().toUpperCase(),O=x===void 0?null:{kind:"object",roomId:n.id,object:x.objects.length};e.apply(U=>Ya(U,l,n.id,o,E)?.doc,{select:O})||e.note("warn","Another lamp could not be added: the map holds at most 400 devices, and a room at most 256 things.")},S=()=>e.openAdd("devices",{title:a?"Change the light in this lamp":`Change the device on this ${d}`,lightsOnly:a,now:p.entityId,rowTitle:h,pick:E=>{if(!ye(E)&&ot(e.doc,E)!==void 0){e.note("warn","That device is on the map already. Drag its pin onto this instead."),e.redraw();return}e.apply(O=>Za(O,u,E))||e.redraw()}}),_=a?"lamp":d,I=f?"light":"device";return c`${D(s,c`
        <div class="hme-lamp-light">
          <span class="hme-pin-big ${w?"lit":""}" style=${w?`background:${v};box-shadow:0 0 24px ${v}80`:""}>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${de($,w?"#3a2600":"#d1d1d6",24,2)}</svg></span>
          <div class="hme-head-t hme-grow">
            <strong>${re(p,e.hass)}</strong>
            <span class="mono">${p.entityId}</span>
          </div>
          <span class="hme-state ${w?"lit":""}">${be(p.entityId,m)}</span>
        </div>
        ${G("Name",Ft({value:p.name??"",label:"Name on the map",placeholder:y??p.entityId,set:E=>M({name:E.trim()===""?null:E})}))}
        ${G(s,c`<span class="hme-in hme-ro mono">${p.entityId}</span>`,c`<button type="button" class="hme-tb" aria-haspopup="dialog" title=${a?"Show another of the home's lights in this lamp":`Show another of the home's devices on this ${d}`}
            @click=${S}>Change…</button>`)}
        ${f?this.glowRows(e,p,w?g.brightness:void 0,M):b}
        ${this.iconRows(e,p,M)}
        ${ll(p,v,M)}
        <div class="hme-row-end">
          ${fi(p.entityId)&&e.hass!==void 0?c`<button type="button" class="hme-tb" @click=${()=>this.toggle(e,p.entityId)}>${gi(p.entityId,m)}</button>`:b}
          ${f?c`<button type="button" class="hme-tb" title=${`Another of this ${_} beside it, holding the same light: a light group in many lamps`} @click=${R}>Add another</button>`:b}
          <button type="button" class="hme-tb push" title=${`The ${_} lets go of the ${I}; both stay where they are`} @click=${()=>e.apply(E=>qa(E,l,n.id,o))}>Unlink</button>
        </div>
        <p class="hme-foot-hint">${a&&f?"The light sits in the lamp: move, lift or turn the lamp and the light goes with it.":`The ${I} sits on the ${_}: move, lift or turn the ${_} and the ${I} goes with it.`}</p>`)}
      ${this.tapCard(e,p,M)}`}groupInspector(e,t){let o=e.hass?.states,n=t.map(h=>h.id),i=h=>{e.apply(m=>nn(m,n,h))||e.note("warn","That could not be set on every picked device.")},a=Math.max(2.5,...t.map(h=>te(e.floor,h)?.height??2.5)),s=Me(t.map(h=>h.at[2])),d=Me(t.map(h=>h.reading)),l=t.every(h=>h.entityId.startsWith("light.")),p=ct;return c`
      <section class="hme-card hme-head">
        <span class="hme-pin-big"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${de("bulb","#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${F(t.length,"device")}</strong>
          <span>Shift, Cmd or Ctrl and a click adds or takes one away</span>
        </div>
      </section>

      ${D("Picked",c`${t.map(h=>c`<div class="hme-list-row hme-pick-row">
          <button type="button" class="hme-grow hme-link" title="Pick this one alone" @click=${()=>e.select({kind:"pin",pinId:h.id})}>${re(h,e.hass)}</button>
          <span class="hme-val">${be(h.entityId,o)}</span>
          <button type="button" class="hme-x" aria-label=${`Leave ${re(h,e.hass)} out of the pick`} title="Leave it out of the pick"
            @click=${()=>e.select(Rt(e.selection,h.id))}>×</button></div>`)}`,String(t.length))}

      ${D("On the map",c`
        <div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
          ${he({label:"None",picture:Kt("none",p),on:!d.mixed&&d.value==="none",click:()=>i({reading:"none"})})}
          ${he({label:"Pill",picture:Kt("pill",p),on:!d.mixed&&d.value===void 0,title:"Each one's reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>i({reading:null})})}
          ${he({label:"Name",picture:Kt("name",p),on:!d.mixed&&d.value==="name",click:()=>i({reading:"name"})})}
        </div></div>
        ${d.mixed?W("Mixed: they show different things. Pick one to set them all.",!0):b}`)}

      ${D("Height",c`
        <div class="hme-r">
          ${dl({label:"Height",value:s.mixed?void 0:s.value,min:0,max:a,step:.05,preview:h=>e.preview(m=>It(m,n,h)),set:h=>e.apply(m=>It(m,n,h))})}
          ${j({label:"Height",value:s.mixed?void 0:s.value,unit:"m",min:0,max:100,width:"92px",set:h=>e.apply(m=>It(m,n,h))})}
        </div>
        <div class="hme-chips">${bi.map(([h,m])=>c`<button type="button" class="hme-chip sel ${t.every(u=>Math.abs(u.at[2]-m)<.005)?"on":""}"
          @click=${()=>e.apply(u=>It(u,n,m))}>${h} ${m}</button>`)}</div>
        <p class="hme-text dim">Every picked device at this height.</p>`)}

      ${l?this.groupLightCard(e,t,i):b}

      ${this.groupTapCard(e,t,i)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(e,n)}}>Remove ${F(t.length,"device")} from the map</button></div>`}groupLightCard(e,t,o){let n=t.map(f=>f.id),i=this.states(e),a=t.map(f=>{let g=Se(f.entityId,i);return Math.round(ao(f,g.kind==="light"&&g.on?g.brightness:void 0)*20)/20}),s=Me(a),d=Math.max(lr,...a),l=t.every(f=>f.glow===void 0),p=Me(t.map(f=>f.glowColor?.toLowerCase())),h=Me(t.map(f=>f.glowSpill===!0)),m=p.mixed||p.value===void 0||p.value==="warm"?void 0:p.value,u=(f,g,w)=>c`<button type="button" class="hme-chip sel ${g?"on":""}" aria-pressed=${g?"true":"false"} @click=${w}>${f}</button>`;return D("Light",c`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        ${dl({label:"Glow size",value:s.mixed?void 0:s.value,min:Ut,max:d,step:.05,preview:f=>e.preview(g=>nn(g,n,{glow:f})),set:f=>o({glow:f})})}
        <span class="hme-val mono hme-w48">${s.mixed?"Mixed":`${s.value.toFixed(1)} m`}</span></div>
      <div class="hme-row-end indent">${u("By its brightness",l,()=>o({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${u("Follow the light",!p.mixed&&p.value===void 0,()=>o({glowColor:null}))}
        ${u("Warm",!p.mixed&&p.value==="warm",()=>o({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${m!==void 0?"on":""}">${m===void 0?b:c`<span class="hme-swatch" style=${`background:${m}`}></span>`}Pick
          ${bo({value:m??"#ffb648",label:"Pick the glow's color for every picked light",preview:f=>e.preview(f===void 0?void 0:g=>nn(g,n,{glowColor:f})??g),set:f=>o({glowColor:f})})}</label>
      </div></div>
      ${p.mixed?W("Mixed: their colors differ. Pick one to set them all.",!0):b}
      ${sl(h.mixed?"mixed":h.value?"off":"on",f=>o({glowSpill:f?null:!0}))}`)}groupTapCard(e,t,o){let n=Me(t.map(l=>[l.tap,l.tap==="page"?l.pageId?.toLowerCase():void 0])),i=n.mixed?void 0:n.value,a=i?.[0]==="page"||this.pickPage,s=i?.[0]==="page"?t[0].pageId:void 0,d=l=>{if(l==="page"){e.pages.length===1?o({tap:"page",pageId:e.pages[0].id}):(this.pickPage=!0,e.redraw());return}this.pickPage=!1,o({tap:l??null})};return D("Tap on the map",c`
      <div class="hme-chips">${vi.map(([l,p])=>{let h=l==="page"?a:!this.pickPage&&i!==void 0&&i[0]===l;return c`<button type="button" class="hme-chip sel ${h?"on":""}" aria-pressed=${h?"true":"false"}
          ?disabled=${l==="page"&&e.pages.length===0} title=${l==="page"&&e.pages.length===0?"Your library has no pages":""}
          @click=${()=>d(l)}>${p}</button>`})}</div>
      ${a?G("Page",xe({label:"Page",value:s??"",options:[...s===void 0?[{value:"",label:"Pick a page\u2026",disabled:!0}]:[],...s===void 0||e.pages.some(l=>k(l.id,s))?[]:[{value:s,label:"A page not in your library",disabled:!0}],...e.pages.map(l=>({value:l.id,label:l.name}))],set:l=>{this.pickPage=!1,l!==""&&o({tap:"page",pageId:l})}})):b}
      <p class="hme-text dim">${n.mixed&&!this.pickPage?"Mixed: a tap does different things on them. Pick one to set them all.":"Set on every picked device."}</p>`)}tapCard(e,t,o){let n=t.tap==="page"||this.pickPage,i=t.pageId===void 0||e.pages.some(s=>k(s.id,t.pageId)),a=s=>{if(s==="page"){if(t.tap==="page")return;e.pages.length===1?o({tap:"page",pageId:e.pages[0].id}):(this.pickPage=!0,e.redraw());return}this.pickPage=!1,o({tap:s??null})};return D("Tap on the map",c`
      <div class="hme-chips">${vi.map(([s,d])=>{let l=s==="page"?n:!this.pickPage&&t.tap===s;return c`<button type="button" class="hme-chip sel ${l?"on":""}" aria-pressed=${l?"true":"false"}
          ?disabled=${s==="page"&&e.pages.length===0} title=${s==="page"&&e.pages.length===0?"Your library has no pages":""}
          @click=${()=>a(s)}>${d}</button>`})}</div>
      ${n?G("Page",xe({label:"Page",value:t.tap==="page"?t.pageId??"":"",options:[...t.tap==="page"?[]:[{value:"",label:"Pick a page\u2026",disabled:!0}],...i?[]:[{value:t.pageId,label:"A page not in your library",disabled:!0}],...e.pages.map(s=>({value:s.id,label:s.name}))],set:s=>{this.pickPage=!1,s!==""&&o({tap:"page",pageId:s})}})):b}
      <p class="hme-text dim">${t.tap===void 0&&!this.pickPage?"As the tile does: a light toggles, anything else opens its control.":bt("Hold on the watch or iPhone: its controls.","Hold on the watch or phone: its controls.")}</p>`)}};function sl(r,e){let t=r==="on"?"walls stop the glow":r==="off"?"the glow spreads past the walls":"some stay in, some spread";return c`<div class="hme-r"><span class="hme-l">Stay in room</span>
    ${r==="mixed"?c`<button type="button" class="hme-chip off" aria-pressed="mixed" aria-label="Stay in room" @click=${()=>e(!0)}>Mixed</button>`:yo({on:r==="on",onText:"On",offText:"Off",label:"Stay in room",click:()=>e(r!=="on")})}
    <span class="hme-text dim">${t}</span></div>`}function dl(r){let e=r.value??(r.min+r.max)/2;return c`<input class="hme-range ${r.value===void 0?"mixed":""}" type="range" min=${r.min} max=${r.max} step=${r.step} .value=${X(String(e))}
    aria-label=${r.label} aria-valuetext=${r.value===void 0?"Mixed":b} style=${r.value===void 0?"--p:0%":ze(r.value,r.min,r.max)}
    @input=${t=>{let o=t.target;o.classList.remove("mixed"),r.preview(Number(o.value))}}
    @change=${t=>r.set(Number(t.target.value))} />`}function ll(r,e,t){return c`<div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
    ${he({label:"None",picture:Kt("none",e),on:r.reading==="none",click:()=>t({reading:"none"})})}
    ${he({label:"Pill",picture:Kt("pill",e),on:r.reading===void 0,title:"Its reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>t({reading:null})})}
    ${he({label:"Name",picture:Kt("name",e),on:r.reading==="name",click:()=>t({reading:"name"})})}
  </div></div>`}function Kt(r,e){return c`<svg width="62" height="44" viewBox="0 0 62 44" aria-hidden="true">
    <circle cx="31" cy=${r==="none"?20:16} r="9" fill=${e} />
    ${r==="pill"?H`<rect x="17" y="29" width="28" height="11" rx="5.5" fill="rgba(0,0,0,0.7)" stroke="#3a3a3c" /><text x="31" y="37.5" font-size="8" fill="#fff" text-anchor="middle">21.5°</text>`:b}
    ${r==="name"?H`<text x="31" y="38" font-size="8" fill="#fff" text-anchor="middle">Name</text>`:b}
  </svg>`}var ie=r=>r.toFixed(1),rh=18,ul="#E8A33D";function bl(r){return lt(r.floor).flatMap(e=>{let t=r.floor.rooms.find(n=>k(n.id,e.door.roomId)),o=t?.openings[e.door.index];return t===void 0||o===void 0?[]:Xe(o,t).map(n=>{let i=Ai(n).map((a,s)=>{let[d,l]=r.toScreen(a);return`${s===0?"M":"L"}${ie(d)} ${ie(l)}`}).join("");return H`<path class="hme-swing-clash" d=${`${i}Z`} fill=${ul} fill-opacity="0.12"
        stroke=${ul} stroke-width="2" stroke-dasharray="6 5" stroke-linejoin="round" pointer-events="none" />`})})}function fl(r){return r.doc.floors.find(e=>k(e.id,r.floor.id))??r.floor}function vl(r){return r.length<2?r.join(""):`${r.slice(0,-1).join(", ")} and ${r[r.length-1]}`}function ah(r,e){return Math.abs(e)>=Math.abs(r)?e>0?"down":"up":r>0?"right":"left"}function sh(r,e){let t=r.moves.flatMap(s=>{let d=e.rooms.find(l=>k(l.id,s.roomId));return d===void 0?[]:[T(d)]}),o=r.moves[0],n=o===void 0?0:Math.hypot(o.dx,o.dy),i=o===void 0?"":ah(o.dx,o.dy),a=r.after===r.doors?`all ${r.doors} doors meet`:`${r.after} of ${r.doors} doors meet`;return`Move ${vl(t)} ${ne(n)} ${i}: ${a}.`}function dh(r,e){let t=a=>vl(a.flatMap(s=>{let d=e.rooms.find(l=>k(l.id,s));return d===void 0?[]:[T(d)]})),o=r.pairs===1?"The door":`${r.pairs} doors`,n=r.pairs===1?`of ${t(r.move)} moves`:`of ${t(r.move)} move`,i=r.narrow?" A door gets narrower, as the rooms share little wall.":"";return`${o} ${n} to meet ${t(r.keep)}. The rooms stay.${i}`}function gl(r){let e=ss(r).map(o=>({words:dh(o,r),button:o.pairs===1?"Move the door":"Move the doors",op:n=>as(n,o.spots)})),t=ns(r);return t!==void 0&&e.push({words:sh(t,r),button:t.moves.length===1?"Move the room":"Move the rooms",op:o=>rs(o,t.moves)}),e}var Ln=class{constructor(){this.offer=0;this.showing=!1}get active(){return this.connecting!==void 0}endShow(e){this.showing&&e.preview(void 0),this.showing=!1}stop(e){this.endShow(e),this.connecting=void 0}choices(e){if(this.connecting===void 0)return[];let t=ae(e.floor),o=t.doors.find(n=>k(n.roomId,this.connecting.roomId)&&n.index===this.connecting.opening);return o===void 0?[]:Qn(t,o)}clicked(e,t,o){let n=ae(e.floor),i=n.doors.find(a=>k(a.roomId,t)&&a.index===o);i===void 0||fe(n,t,o)!==void 0||Qn(n,i).length>0&&this.start(e,t,o)}start(e,t,o){this.connecting={roomId:t,opening:o},e.select({kind:"opening",roomId:t,opening:o}),e.redraw()}connect(e,t,o){let n=this.connecting;return n===void 0?!1:(this.connecting=void 0,e.apply(i=>ds(i,n.roomId,n.opening,t,o),{select:{kind:"room",roomId:n.roomId}})||e.note("err","Those two doors cannot be connected."),!0)}pickDoor(e,t,o){return this.connecting===void 0?!1:this.choices(e).some(n=>k(n.roomId,t)&&n.index===o)?this.connect(e,t,o):(this.connecting=void 0,!1)}pointerDown(e,t){let o=e.toScreen(t),n;for(let i of this.choices(e)){let a=e.toScreen(i.mid),s=Math.hypot(a[0]-o[0],a[1]-o[1]);s<=rh&&(n===void 0||s<n.d)&&(n={door:i,d:s})}return n!==void 0?this.connect(e,n.door.roomId,n.door.index):(this.connecting=void 0,!1)}keyDown(e,t){return this.connecting===void 0||oe(t,!1)!=="cancel"?!1:(this.connecting=void 0,e.redraw(),!0)}pill(e){let t=this.connecting;if(t===void 0)return b;let o=e.floor.rooms.find(n=>k(n.id,t.roomId));return c`<span class="hme-pill-name">Click the door that ${o===void 0?"it":T(o)} should meet</span>
      <button type="button" class="hme-tb" @click=${()=>{this.connecting=void 0,e.redraw()}}>Cancel</button>`}overlay(e){let t=ae(e.floor);if(t.doors.length===0||e.floor.rooms.length<2)return b;let o=this.choices(e),n=[],i=new Set;for(let s of t.doors){let[d,l]=e.toScreen(s.mid),p=fe(t,s.roomId,s.index);o.includes(s)||(p===void 0?this.connecting!==void 0&&k(s.roomId,this.connecting.roomId)&&s.index===this.connecting.opening||n.push(H`<circle class="hme-door-open" cx=${ie(d)} cy=${ie(l)} r="6" fill="#ffb340" stroke="#2a1a00" stroke-width="1"><title>No partner yet. Click to connect it.</title></circle>`):i.has(p)||(i.add(s),n.push(H`<circle class="hme-door-met" cx=${ie(d)} cy=${ie(l)} r="4" fill="#30d158" />`)))}let a=o.map(s=>{let[d,l]=e.toScreen(s.mid),p=e.floor.rooms.find(u=>k(u.id,s.roomId)),h=p===void 0?"":T(p),m=h.length*6.4+16;return H`<g class="hme-door-choice"><circle cx=${ie(d)} cy=${ie(l)} r="9" fill="#5b8def" stroke="#fff" stroke-width="2" />
        <g class="hme-tag"><rect x=${ie(d-m/2)} y=${ie(l-34)} width=${ie(m)} height="20" rx="10" fill="#5b8def" />
        <text x=${ie(d)} y=${ie(l-20)} fill="#fff" text-anchor="middle">${h}</text></g></g>`});return H`<g class="hme-doors" pointer-events="none">${n}${a}</g>`}allMet(e){let t=fl(e);if(t.rooms.length<2)return;let o=ae(t),n=o.doors.length;if(!(n===0||Zn(o).length>0||no(t).length>0||gl(t).length>0))return n}fitFoot(e){let t=this.allMet(e);return t===void 0?b:c`<p class="hme-fit-foot" role="status">All ${t} doors meet.</p>`}fitCard(e){let t=fl(e);if(t.rooms.length<2||this.allMet(e)!==void 0)return b;let o=ae(t),n=no(t),i=o.doors.length;if(i===0&&n.length===0)return b;let a=gl(t),s=a.length===0?void 0:a[this.offer%a.length],d=Zn(o).length,l=()=>{s!==void 0&&(this.showing=!this.showing,e.preview(this.showing?s.op:void 0),e.redraw())},p=()=>{s!==void 0&&(this.showing=!1,this.offer=0,e.preview(void 0),e.apply(s.op,{select:null}))},h=()=>{this.offer=(this.offer+1)%a.length;let f=a[this.offer];this.showing&&f!==void 0&&e.preview(f.op),e.redraw()},m=s!==void 0||d>0?"hot":n.length>0?"":"good",u=t.id;return c`<section class="hme-card hme-fit ${m}">
      <div class="hme-h">Fit rooms${i===0?b:c`<span class="hme-h-end">${o.met} of ${F(i,"door")}</span>`}</div>
      ${i===0?b:c`<div class="hme-fit-bar" role="img" aria-label=${`${o.met} of ${F(i,"door")} meet`}>
        <i class=${d===0?"full":""} style=${`width:${o.met/i*100}%`}></i></div>`}
      ${s!==void 0?c`<p class="hme-text">${s.words}</p>
        <div class="hme-fit-acts">
          <button type="button" class="hme-tb" aria-pressed=${this.showing?"true":"false"} @click=${l}>${this.showing?"Hide":"Show me"}</button>
          <button type="button" class="hme-tb hme-blue" @click=${p}>${s.button}</button>
        </div>
        ${a.length<2?b:c`<button type="button" class="hme-tb hme-wide hme-fit-other" @click=${h}>Another way (${this.offer%a.length+1} of ${a.length})</button>`}`:d>0?c`<p class="hme-text">Amber doors have no partner. Click one, then the door it should meet.</p>`:i>0?c`<p class="hme-text dim">All doors meet.</p>`:b}
      ${n.map(f=>c`<div class="hme-fix">
        <span class="hme-fix-dot ${f.kind==="missingDoor"?"gray":""}"></span>
        <p @click=${()=>e.select({kind:"room",roomId:f.roomIds[0]})}><b>${f.title}</b> ${f.detail}</p>
        <button type="button" class="hme-tb" @click=${()=>e.apply(g=>f.fix(g))}>${f.fixLabel}</button></div>`)}
      ${n.length>1?c`<button type="button" class="hme-tb hme-wide" @click=${()=>e.apply(f=>ls(f,u))}>Fix all ${n.length}</button>`:b}
    </section>`}doorsCard(e,t){let o=ae(e.floor),n=o.doors.filter(a=>k(a.roomId,t.id));if(n.length===0)return b;let i=n.filter(a=>fe(o,a.roomId,a.index)!==void 0).length;return c`<section class="hme-card hme-doors-card">
      <div class="hme-h">Doors<span class="hme-h-end">${i} of ${n.length} meet</span></div>
      ${n.map(a=>{let s=fe(o,a.roomId,a.index),d=s===void 0?void 0:e.floor.rooms.find(h=>k(h.id,s.roomId));return c`<div class="hme-door-row" @pointerenter=${()=>e.setHover({kind:"opening",roomId:a.roomId,opening:a.index})} @pointerleave=${()=>e.setHover(void 0)}>
          <span class="hme-fix-dot ${d===void 0?"":"green"}"></span>
          <button type="button" class="hme-door-name" @click=${()=>e.select({kind:"opening",roomId:a.roomId,opening:a.index})}>${d===void 0?"No partner":`To ${T(d)}`}</button>
          <span class="mono dim">${ne(a.width)}</span>
          ${s===void 0?c`<button type="button" class="hme-tb" title="Click the door it should meet, on the plan or in 3D" @click=${()=>this.start(e,a.roomId,a.index)}>Connect</button>`:b}
        </div>${this.swingLines(e,a.roomId,a.index).map(h=>c`<p class="hme-text dim">${h}</p>`)}`})}
    </section>`}opensToCard(e,t,o){let n=ae(e.floor);if(n.doors.find(l=>k(l.roomId,t.id)&&l.index===o)===void 0)return b;let a=fe(n,t.id,o),s=a===void 0?void 0:e.floor.rooms.find(l=>k(l.id,a.roomId));if(s!==void 0)return c`<section class="hme-card hme-fit good"><div class="hme-h">Opens to</div>
        <p class="hme-text">${T(s)}. One door, cutting both walls.</p></section>${this.swingCard(e,t,o)}`;let d=this.connecting!==void 0&&k(this.connecting.roomId,t.id)&&this.connecting.opening===o;return c`<section class="hme-card hme-fit hot"><div class="hme-h">Opens to</div>
      ${d?c`<p class="hme-text">Click the blue door it should meet. On one wall this door moves there and the room stays. Else <b>${T(t)}</b> moves.</p>
        <button type="button" class="hme-tb hme-wide" @click=${()=>{this.connecting=void 0,e.redraw()}}>Cancel</button>`:c`<button type="button" class="hme-tb hme-blue hme-wide" @click=${()=>this.start(e,t.id,o)}>Connect to a door</button>`}
    </section>${this.swingCard(e,t,o)}`}swingLines(e,t,o){let n=e.floor,i=_t(n,t,o),a=i===void 0?[]:i.hits.map(l=>Li(n,i.door,l)),s=fe(ae(n),t,o),d=s===void 0?void 0:_t(n,s.roomId,s.index);if(d!==void 0){let l=n.rooms.find(h=>k(h.id,d.door.roomId)),p=l===void 0?"In the next room":`In ${T(l)}`;for(let h of d.hits){let m=Li(n,d.door,h);a.push(`${p}, ${m.charAt(0).toLowerCase()}${m.slice(1)}`)}}return a}swingCard(e,t,o){let n=this.swingLines(e,t.id,o);if(n.length===0)return b;let i=_t(e.floor,t.id,o)!==void 0,a=t.openings[o],s=a!==void 0&&Xe(a,t).length===1,d=i&&s,l=d&&cd(e.doc,e.floor.id,t.id,o);return c`<section class="hme-card hme-fit hot"><div class="hme-h">Swing</div>
      ${n.map(p=>c`<p class="hme-text">${p}.</p>`)}
      ${d?c`<button type="button" class="hme-tb hme-wide ${l?"hme-blue":""}" title="Hang the door from its other side"
        @click=${()=>e.apply(p=>vn(p,t.id,o))}>Swing the other way</button>
        ${l?b:c`<p class="hme-text dim">The other way runs into something too.</p>`}`:b}
    </section>`}};function Hl(r){return hh[r]}var lh=[{label:"Door",kind:"door"},{label:"Double door",kind:"door",style:"double"},{label:"Sliding door",kind:"door",style:"sliding"},{label:"Window",kind:"window"},{label:"Sliding window",kind:"window",style:"sliding"},{label:"Way through",kind:"opening"}],yl=18,mr="#4fd6c2",wl="Draw each room faint and dashed as the iPhone scanned it, or as first seen for a room scanned before scans were kept. A room drawn here has none.",ph="Put this room's walls, doors, windows and furniture back as the iPhone scanned it. Its devices stay where they are.",P=r=>r.toFixed(1),ut=r=>`${r[0].toFixed(1)},${r[1].toFixed(1)}`,Ml=new WeakMap;function kl(r){let e=Ml.get(r);return e===void 0&&Ml.set(r,e=no(r)),e}function $l(r,e,t,o){let n=t/r.view.scale,i=s=>{let d;for(let l of s)for(let[p,h]of V(l).entries()){let m=oa(e,h);m<=n&&(d===void 0||m<d.d)&&(d={room:l,wall:p,seg:h,d:m})}return d};return(o===void 0?void 0:i([o]))??i(r.floor.rooms)}function xl(r,e){let t=Math.max(Ie(e),1e-9),o=[-(e.b[1]-e.a[1])/t,(e.b[0]-e.a[0])/t],n=[(e.a[0]+e.b[0])/2,(e.a[1]+e.b[1])/2],i=Z(r)??ue(r);return(i[0]-n[0])*o[0]+(i[1]-n[1])*o[1]>0&&(o=[-o[0],-o[1]]),o}var Fn=class{constructor(){this.tool="select";this.dragging=!1}setTool(e,t){this.first=void 0,this.tool=t,e.redraw()}get armed(){return this.tool!=="select"}focus(e){let t=pe(e.selection);return t===void 0?void 0:e.floor.rooms.find(o=>k(o.id,t))}pieceRoom(e){return le(e.selection)?this.focus(e):void 0}placed(e,t){this.setTool(e,"select"),e.select(t)}pickedWall(e,t){let o=e.selection;if(!(t===void 0||o===void 0)){if(o.kind==="wall")return o.wall;if(o.kind==="opening"){let n=t.openings[o.opening],i=n===void 0?-1:Tt(t,n);return i>=0?i:void 0}}}roomCards(e,t){return c`${this.wallsCard(e,t)}${yn(e,t)}${this.scanCard(e,t)}`}wallsCard(e,t){let o=V(t),n=e.selection,i=t.id,a=qs(t),s=t.openings.map((l,p)=>({o:l,i:p})).filter(({o:l})=>Tt(t,l)<0),d=({o:l,i:p})=>{let h=n?.kind==="opening"&&n.opening===p;return c`<button type="button" class="hme-lay sub ${h?"on":""}" aria-pressed=${h?"true":"false"}
        @pointerenter=${()=>e.setHover({kind:"opening",roomId:i,opening:p})} @pointerleave=${()=>e.setHover(void 0)}
        @click=${()=>e.select({kind:"opening",roomId:i,opening:p})}>${fo(l)}<span class="n">${ne(Math.hypot(l.b[0]-l.a[0],l.b[1]-l.a[1]))}</span></button>`};return c`<section class="hme-card hme-layers">
      <div class="hme-h">${T(t)}<span class="hme-h-end">${F(o.length,"wall")}</span></div>
      ${o.map((l,p)=>{let h=n?.kind==="wall"&&n.wall===p;return c`<button type="button" class="hme-lay ${h?"on":""}" aria-pressed=${h?"true":"false"}
            @pointerenter=${()=>e.setHover({kind:"wall",roomId:i,wall:p})} @pointerleave=${()=>e.setHover(void 0)}
            @click=${()=>e.select({kind:"wall",roomId:i,wall:p})}>${a[p]}<span class="n">${ne(Ie(l))}</span></button>
          ${t.openings.map((m,u)=>({o:m,i:u})).filter(({o:m})=>Tt(t,m)===p).map(d)}`})}
      ${s.length===0?b:c`<div class="hme-lay dim">In no wall</div>${s.map(d)}`}
    </section>`}scanCard(e,t){if(e.scans===void 0)return b;let o=t.id,n=jr(e.scans,o),i=n!==void 0&&za(t,n)?n:void 0;return D("Show scan as it was",c`<div class="hme-row-end">
      <button type="button" class="hme-tb ${e.toggles.scan?"on":""}" aria-pressed=${e.toggles.scan?"true":"false"} title=${wl}
        @click=${()=>e.setToggle("scan",!e.toggles.scan)}>${e.toggles.scan?"On":"Off"}</button>
      <button type="button" class="hme-tb" ?disabled=${i===void 0} title=${i===void 0?"This room is as the iPhone scanned it, or was drawn here":ph}
        @click=${()=>{i!==void 0&&e.apply(a=>ja(a,o,i))}}>Back to the scan</button>
    </div>`)}overlay(e){let t=this.pieceRoom(e),o=[];return e.toggles.scan&&o.push(...this.scanMarks(e)),o.push(...this.issueMarks(e)),t!==void 0&&o.push(this.roomHandles(e,t)),o.push(...this.ghost(e)),H`${o}`}scanMarks(e){return Na(e.floor,e.scans).map(t=>{let o=t.outline.map(i=>ut(e.toScreen(i))).join("L"),n=t.walls.map(i=>`M${ut(e.toScreen(i.a))}L${ut(e.toScreen(i.b))}`).join("");return H`<g class="hme-scan" data-room=${t.roomId} pointer-events="none">
        <path d=${`M${o}Z`} fill=${mr} fill-opacity="0.06" stroke="none" />
        <path d=${n} fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="3.5" stroke-dasharray="7 5" />
        <path d=${n} fill="none" stroke=${mr} stroke-width="1.6" stroke-dasharray="7 5" stroke-opacity="0.9" />
        ${t.openings.map(i=>{let a=e.toScreen(i.a),s=e.toScreen(i.b);return H`<line x1=${P(a[0])} y1=${P(a[1])} x2=${P(s[0])} y2=${P(s[1])} stroke=${mr} stroke-width="4" stroke-opacity="0.85"
            stroke-dasharray=${i.kind==="window"?"2 3":"none"} />`})}
      </g>`})}issueMarks(e){return e.doc.floors.includes(e.floor)?kl(e.floor).map(t=>{let[o,n]=e.toScreen(t.where);if(t.kind==="offSquare"){let l=/(\d+)°/.exec(t.title)?.[1]??"";return H`<g class="hme-issue" data-hme=${`issue:${t.id}`} style="cursor:pointer"><title>${t.title} Click to square it.</title>
          <circle cx=${P(o)} cy=${P(n)} r="9" fill="#ffb340" stroke="#fff" stroke-width="2" />
          <g class="hme-tag"><rect x=${P(o+12)} y=${P(n+6)} width="44" height="20" rx="10" fill="#ffb340" />
          <text x=${P(o+34)} y=${P(n+20)} fill="#2a1a00" text-anchor="middle">${l}°</text></g></g>`}let i=`${Math.round(t.amount*100)} cm`,a=t.kind==="overlap"?`Overlap ${i} \xB7 ${t.fixLabel}`:t.kind==="gap"?`Gap ${i} \xB7 ${t.fixLabel}`:`No door \xB7 ${t.fixLabel}`,s=a.length*6.2+18,d=t.kind==="missingDoor";return H`<g class="hme-issue" data-hme=${`issue:${t.id}`} style="cursor:pointer"><title>${t.title} ${t.detail}</title>
        <circle cx=${P(o)} cy=${P(n)} r="4" fill=${d?"#8e8e93":"#ffb340"} />
        <g class="hme-tag"><rect x=${P(o-s/2)} y=${P(n+8)} width=${P(s)} height="20" rx="10" fill=${d?"#8e8e93":"#ffb340"} />
        <text x=${P(o)} y=${P(n+22)} fill=${d?"#fff":"#2a1a00"} text-anchor="middle">${a}</text></g></g>`}):[]}roomHandles(e,t){let o=V(t),n=e.selection,i=this.pickedWall(e,t),a=[];if(i!==void 0&&o[i]!==void 0){let d=o[i],l=e.toScreen(d.a),p=e.toScreen(d.b),h=xl(t,d);if(a.push(H`<line x1=${P(l[0])} y1=${P(l[1])} x2=${P(p[0])} y2=${P(p[1])} stroke="#5b8def" stroke-width="9" stroke-linecap="round" pointer-events="none" />`),n?.kind==="wall"&&!this.dragging){let m=[(l[0]+p[0])/2+h[0]*22,(l[1]+p[1])/2+h[1]*22];a.push(H`<g class="hme-tag" pointer-events="none"><rect x=${P(m[0]-27)} y=${P(m[1]-9)} width="54" height="18" rx="9" fill="#5b8def" />
          <text x=${P(m[0])} y=${P(m[1]+4)} fill="#fff" text-anchor="middle">${Ie(d).toFixed(2)} m</text></g>`)}}for(let[d,l]of t.openings.entries()){let p=e.toScreen(l.a),h=e.toScreen(l.b),m=n?.kind==="opening"&&n.opening===d,u=l.kind==="window"?"#8bb8f0":l.kind==="door"?"#ece6da":"#98989d";if(a.push(H`<g data-hme=${`opening:${d}`} style="cursor:ew-resize">
        <line x1=${P(p[0])} y1=${P(p[1])} x2=${P(h[0])} y2=${P(h[1])} stroke=${m?"#5b8def":"rgba(14,14,16,0.9)"} stroke-width="12" stroke-linecap="round" />
        <line x1=${P(p[0])} y1=${P(p[1])} x2=${P(h[0])} y2=${P(h[1])} stroke=${u} stroke-width="3" />
      </g>`),m){let f=Math.abs(h[0]-p[0])>=Math.abs(h[1]-p[1])?"ew-resize":"ns-resize";for(let[g,w]of[[0,p],[1,h]])a.push(H`<circle data-hme=${`end:${d}:${g}`} cx=${P(w[0])} cy=${P(w[1])} r="8" fill="#fff" stroke="#5b8def" stroke-width="2.5" style=${`cursor:${f}`}><title>Drag to make it wider or narrower</title></circle>`)}}let s=this.sliding!==void 0&&k(this.sliding.roomId,t.id)?this.sliding.index:n?.kind==="opening"?n.opening:void 0;if(s!==void 0&&t.openings[s]!==void 0&&a.push(this.distances(e,t,t.openings[s])),!this.dragging||this.sliding===void 0){if(this.tool==="select")for(let[d,l]of o.entries()){if(Ie(l)*e.view.scale<40)continue;let p=e.toScreen([(l.a[0]+l.b[0])/2,(l.a[1]+l.b[1])/2]);a.push(H`<circle data-hme=${`mid:${d}`} cx=${P(p[0])} cy=${P(p[1])} r="5" fill="#0e0e10" stroke="#5b8def" stroke-width="1.5" style="cursor:copy"><title>Drag to add a corner</title></circle>`)}for(let[d,l]of t.outline.entries()){let[p,h]=e.toScreen(l),m=n?.kind==="corner"&&n.corner===d;a.push(H`<circle data-hme=${`corner:${d}`} cx=${P(p)} cy=${P(h)} r="7" fill=${m?"#5b8def":"#fff"} stroke=${m?"#fff":"#5b8def"} stroke-width="2" style="cursor:move" />`)}}return H`<g class="hme-handles">${a}</g>`}distances(e,t,o){let n=Tt(t,o),i=n>=0?V(t)[n]:void 0;if(i===void 0)return H``;let a=Ie(i),s=Mt(o.a,i.a,i.b).along,d=Mt(o.b,i.a,i.b).along,l=Math.max(0,Math.min(s,d)),p=Math.min(a,Math.max(s,d)),h=xl(t,i),m=[(i.b[0]-i.a[0])/a,(i.b[1]-i.a[1])/a],u=y=>{let M=e.toScreen([i.a[0]+m[0]*y,i.a[1]+m[1]*y]);return[M[0]+h[0]*26,M[1]+h[1]*26]},f=[0,l,p,a],g=y=>`M${ut([y[0]-h[0]*5,y[1]-h[1]*5])}L${ut([y[0]+h[0]*5,y[1]+h[1]*5])}`,w=[[0,l,!1],[l,p,!0],[p,a,!1]];return H`<g class="hme-dist" pointer-events="none">
      <path d=${`M${ut(u(0))}L${ut(u(a))}${f.map(y=>g(u(y))).join("")}`} stroke="#98989d" stroke-width="1" fill="none" />
      ${w.filter(([y,M])=>M-y>.02).map(([y,M,$])=>{let v=u((y+M)/2);return H`<g class="hme-tag"><rect x=${P(v[0]-25)} y=${P(v[1]-9)} width="50" height="18" rx="9" fill=${$?"#5b8def":"#2c2c2e"} />
          <text x=${P(v[0])} y=${P(v[1]+4)} fill="#fff" text-anchor="middle">${(M-y).toFixed(2)} m</text></g>`})}
    </g>`}ghost(e){let t=this.hoverAt;if(t===void 0)return[];let o=[];if(this.tool==="door"||this.tool==="window"||this.tool==="opening"){let n=$l(e,t,yl,this.focus(e));if(n!==void 0){let i=this.tool==="window"?1.2:.9,a=Ie(n.seg),s=Math.min(i,a),d=Math.min(Math.max(Mt(t,n.seg.a,n.seg.b).along,s/2),a-s/2),l=[(n.seg.b[0]-n.seg.a[0])/a,(n.seg.b[1]-n.seg.a[1])/a],p=e.toScreen([n.seg.a[0]+l[0]*(d-s/2),n.seg.a[1]+l[1]*(d-s/2)]),h=e.toScreen([n.seg.a[0]+l[0]*(d+s/2),n.seg.a[1]+l[1]*(d+s/2)]);o.push(H`<line x1=${P(p[0])} y1=${P(p[1])} x2=${P(h[0])} y2=${P(h[1])} stroke="#5b8def" stroke-width="10" stroke-opacity="0.6" stroke-linecap="round" pointer-events="none" />`)}}if(this.tool==="stairs"&&q(e.floor,t)!==void 0){let[n,i]=e.toScreen(t),a=e.px(1),s=e.px(2.6);o.push(H`<g pointer-events="none" opacity="0.7"><rect x=${P(n-a/2)} y=${P(i-s/2)} width=${P(a)} height=${P(s)} fill="none" stroke="#5b8def" stroke-width="1.5" stroke-dasharray="4 3" />
        ${[1,2,3,4,5,6,7].map(d=>H`<line x1=${P(n-a/2)} x2=${P(n+a/2)} y1=${P(i-s/2+s*d/8)} y2=${P(i-s/2+s*d/8)} stroke="#5b8def" stroke-width="1" />`)}</g>`)}if((this.tool==="split"||this.tool==="inner")&&this.first!==void 0){let n=e.toScreen(this.first.a),i=e.toScreen(this.snap(e,t,this.first.a));if(this.tool==="split"){let a=Math.max(Math.hypot(i[0]-n[0],i[1]-n[1]),1e-6),s=[(i[0]-n[0])/a,(i[1]-n[1])/a],d=Math.hypot(e.stage.width,e.stage.height);o.push(H`<line x1=${P(n[0]-s[0]*d)} y1=${P(n[1]-s[1]*d)} x2=${P(n[0]+s[0]*d)} y2=${P(n[1]+s[1]*d)} stroke="#5b8def" stroke-width="1.5" stroke-dasharray="6 4" pointer-events="none" />`)}else o.push(H`<line x1=${P(n[0])} y1=${P(n[1])} x2=${P(i[0])} y2=${P(i[1])} stroke="#ece6da" stroke-width=${P(Math.max(e.px(.1),3))} stroke-opacity="0.8" pointer-events="none" />`);o.push(H`<circle cx=${P(n[0])} cy=${P(n[1])} r="5" fill="#5b8def" pointer-events="none" />`)}return o}snap(e,t,o){return zi(e.floor,t,e.view.scale,{...o===void 0?{}:{from:o},...e.toggles.grid?{grid:Ue}:{}})}pointerDown(e,t,o){if(t.button!==0)return!1;switch(this.tool){case"door":case"window":case"opening":{let n=$l(e,o,yl,this.focus(e));if(n===void 0)return!1;let i=this.tool,a=n.room.id,s={kind:"opening",roomId:a,opening:n.room.openings.length},d=n.wall;return e.apply(l=>en(l,a,d,{kind:i,at:o}),{select:s})&&this.placed(e,s),!0}case"stairs":{let n=q(e.floor,o);if(n===void 0)return!1;let i=n.id,a={kind:"room",roomId:i};return e.apply(s=>Ha(s,i,o),{select:a})&&this.placed(e,a),!0}case"split":case"inner":return this.twoPoints(e,o);default:return!1}}twoPoints(e,t){if(this.first===void 0){let a=q(e.floor,t)??this.focus(e);return a===void 0?!1:(this.first={roomId:a.id,a:this.snap(e,t)},e.select({kind:"room",roomId:a.id}),!0)}let{roomId:o,a:n}=this.first,i=this.snap(e,t,n);if(this.first=void 0,Math.hypot(i[0]-n[0],i[1]-n[1])<.1)return e.redraw(),!0;if(this.tool==="inner"){let a=e.doc.floors.flatMap(d=>d.rooms).find(d=>k(d.id,o)),s={kind:"wall",roomId:o,wall:a===void 0?0:Jn(a).length};return e.apply(d=>oo(d,o,n,i),{select:s})?this.placed(e,s):e.note("err","An inner wall needs to be at least 10 cm long."),!0}return this.split(e,o,n,i),!0}async split(e,t,o,n){let i=e.floor.rooms.find(l=>k(l.id,t)),a=await e.ask({title:"Name the new room",label:"Name",value:i===void 0?"Room":`${T(i)} 2`,ok:"Split the room"});if(a===void 0)return;let s=e.newId(),d={kind:"room",roomId:s};e.apply(l=>Fa(l,t,o,n,s,a),{select:d})?(this.setTool(e,"select"),e.select(d)):e.note("err","That line does not cut the room in two. Draw it right across the room.")}pressHandle(e,t){let o=this.pieceRoom(e),n=t.target?.closest?.("[data-hme]")?.getAttribute("data-hme")??"",[i,a]=n.split(/:(.*)/s);if(i==="issue"){let d=kl(e.floor).find(l=>l.id===a);return d!==void 0&&e.apply(l=>d.fix(l)),!0}if(i==="end"&&o!==void 0&&a!==void 0){let[d,l]=a.split(":").map(Number);return Number.isInteger(d)&&(l===0||l===1)&&this.endDrag(e,t,o,d,l),!0}let s=Number(a);if(o===void 0||!Number.isInteger(s))return!1;if(i==="corner")this.cornerDrag(e,t,o,s);else if(i==="mid")this.midDrag(e,t,o,s);else if(i==="opening")this.openingDrag(e,t,o,s);else return!1;return!0}pressPiece(e,t,o){if(t.shiftKey||t.metaKey||t.ctrlKey||t.altKey)return!1;let n=Ni(e.floor,e.toScreen,o,pe(e.selection));if(n===void 0)return!1;let i=e.floor.rooms.find(s=>k(s.id,n.roomId));if(i===void 0)return!1;if(n.kind==="opening")return this.openingDrag(e,t,i,n.opening),!0;let a=V(i)[n.wall];return this.wallAt=a===void 0?void 0:Mt(o,a.a,a.b).point,e.select(n),!0}cornerTo(e,t,o,n){let i=e.floor.rooms.filter(d=>!k(d.id,t.id)).flatMap(d=>d.outline),a=10/e.view.scale;for(let d of i)if(Math.hypot(d[0]-n[0],d[1]-n[1])<=a)return[d[0],d[1]];let s=n;if(e.toggles.grid&&(s=[Math.round(s[0]/Ue)*Ue,Math.round(s[1]/Ue)*Ue]),e.toggles.snap){let d=ra(e.floor.rooms.flatMap(w=>Jn(w))),l=Math.cos(d),p=Math.sin(d),h=w=>[w[0]*l+w[1]*p,-w[0]*p+w[1]*l],[m,u]=h(s),f=t.outline.length,g=8/e.view.scale;for(let w of[(o+f-1)%f,(o+1)%f]){let[y,M]=h(t.outline[w]);Math.abs(m-y)<=g&&(m=y),Math.abs(u-M)<=g&&(u=M)}s=[m*l-u*p,m*p+u*l]}return s}cornerDrag(e,t,o,n){let i=o.id,a;e.drag(t,{move:s=>{this.dragging=!0;let d=this.cornerTo(e,o,n,s);a=d,e.preview(l=>St(l,i,n,d))},end:(s,d,l)=>{this.dragging=!1,e.preview(void 0);let p=a,h={kind:"corner",roomId:i,corner:n};l&&p!==void 0?e.apply(m=>St(m,i,n,p),{select:h}):e.select(h)},cancel:()=>this.stopDrag(e)})}midDrag(e,t,o,n){let i=o.id,a=V(o)[n],s=Qo(e.doc,i,n),d=s?.floors.flatMap(u=>u.rooms).find(u=>k(u.id,i));if(a===void 0||s===void 0||d===void 0)return;let l=[(a.a[0]+a.b[0])/2,(a.a[1]+a.b[1])/2],p=d.outline.reduce((u,f,g)=>Math.hypot(f[0]-l[0],f[1]-l[1])<Math.hypot(d.outline[u][0]-l[0],d.outline[u][1]-l[1])?g:u,0),h=u=>f=>{let g=Qo(f,i,n);return g===void 0||u===void 0?g:St(g,i,p,u)},m;e.drag(t,{move:u=>{this.dragging=!0,m=this.cornerTo(e,d,p,u),e.preview(h(m))},end:(u,f,g)=>{this.dragging=!1,e.preview(void 0),e.apply(h(g?m:void 0),{select:{kind:"corner",roomId:i,corner:p}})},cancel:()=>this.stopDrag(e)})}endDrag(e,t,o,n,i){let a=o.id,s=et(o,n),d=s===void 0?void 0:V(o)[s.wall];if(s===void 0||d===void 0)return;let l=i===0===s.forward?-1:1,p=u=>dn(s,{x:l,z:0},Mt(u,d.a,d.b).along-(l<0?s.from:s.to),0,!1),h,m={kind:"opening",roomId:a,opening:n};e.drag(t,{move:u=>{this.dragging=!0,this.sliding={roomId:a,index:n};let f=p(u);h=f,e.preview(g=>Re(g,a,n,f))},end:()=>{this.dragging=!1,this.sliding=void 0,e.preview(void 0);let u=h;u!==void 0&&e.apply(f=>Re(f,a,n,u),{select:m})},cancel:()=>this.stopDrag(e)})}faceDrag(e,t){let{pick:o,part:n,ds:i,dz:a,done:s}=t,d=o.roomId,l=e.doc.floors.flatMap(h=>h.rooms).find(h=>k(h.id,d));if(l===void 0)return;let p;if(o.kind==="wall"){let h=Math.round(Math.min(Math.max(l.height+a,.5),20)*100)/100;this.sizeTag=`Height ${h.toFixed(2)} m`,p=m=>Jt(m,d,h)}else{let h=o.opening,m=et(l,h),u=l.openings[h];if(m===void 0||u===void 0)return;let f=m.forward?1:-1,g=dn(m,{x:n.x*f,z:n.z},i*f,a,u.kind!=="window");this.sizeTag=`${(g.to-g.from).toFixed(2)} \xD7 ${(g.z1-g.z0).toFixed(2)} m`,p=w=>Re(w,d,h,g)}if(!s){e.preview(p);return}this.sizeTag=void 0,e.preview(void 0),e.apply(p)}openingDrag(e,t,o,n){let i=o.id,a=o.openings[n];if(a===void 0)return;let s={kind:"opening",roomId:i,opening:n},d=[(a.a[0]+a.b[0])/2,(a.a[1]+a.b[1])/2],l,p;e.select(s),e.drag(t,{move:h=>{l??=h,this.dragging=!0,this.sliding={roomId:i,index:n};let m=[d[0]+h[0]-l[0],d[1]+h[1]-l[1]];p=m,e.preview(u=>pi(u,i,n,m))},end:(h,m,u)=>{this.dragging=!1,this.sliding=void 0,e.preview(void 0);let f=p;u&&f!==void 0?e.apply(g=>pi(g,i,n,f),{select:s}):u||this.onOpeningClick?.(e,i,n)},cancel:()=>this.stopDrag(e)})}stopDrag(e){this.dragging=!1,this.sliding=void 0,e.preview(void 0)}hover(e,t){this.tool!=="select"&&(this.hoverAt=t,e.redraw())}keyDown(e,t){let o=oe(t,!1);if(o==="cancel"&&(this.tool!=="select"||this.first!==void 0))return this.setTool(e,"select"),!0;let n=e.selection;if(o==="cancel"&&le(n))return e.select({kind:"room",roomId:n.roomId}),!0;if(o==="delete"){let i=e.selection;if(i?.kind==="corner")e.apply(a=>Jo(a,i.roomId,i.corner),{select:{kind:"room",roomId:i.roomId}});else if(i?.kind==="opening")e.apply(a=>tn(a,i.roomId,i.opening),{select:{kind:"room",roomId:i.roomId}});else if(i?.kind==="wall")e.apply(a=>li(a,i.roomId,i.wall),{select:{kind:"room",roomId:i.roomId}});else return!1;return!0}return!1}cursor(){return this.tool==="select"?void 0:"crosshair"}leave(e){this.first=void 0,this.hoverAt=void 0,this.dragging=!1,this.sliding=void 0,this.tool="select",e.redraw()}viewItems(e){return e.scans===void 0?[]:[{label:"Show scan as it was",on:e.toggles.scan,title:wl,flip:()=>e.setToggle("scan",!e.toggles.scan)}]}pill(e){if(this.tool!=="select"){let s={split:this.first===void 0?"Click where the cut starts":"Click where it ends, across the room",inner:this.first===void 0?"Click where the wall starts":"Click where it ends",door:"Click a wall to put a door in it",window:"Click a wall to put a window in it",opening:"Click a wall to open a way through it",stairs:"Click in the room to put stairs there"};return c`<span class="hme-pill-name">${s[this.tool]}</span>
        <button type="button" class="hme-tb" @click=${()=>this.setTool(e,"select")}>Cancel</button>`}let t=this.pieceRoom(e),o=e.selection;if(t===void 0||o===void 0||this.dragging)return b;let n=t.id,i=T(t),a=c`<button type="button" class="hme-tb" title="Pick the room (Esc)" @click=${()=>e.select({kind:"room",roomId:n})}>${i} ›</button>`;if(o.kind==="wall"){let s=o.wall,d=this.wallAt,l=uo(t,s,i).replace(", "," \xB7 ");return c`<span class="hme-pill-name">${l}</span>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(e,t,s,"window",d)}>＋ Window here</button>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(e,t,s,"door",d)}>＋ Door here</button>
        <button type="button" class="hme-tb" @click=${()=>this.cornerHere(e,t,s,d)}>Add a corner</button>
        ${a}`}if(o.kind==="corner")return c`<span class="hme-pill-name">${i} · corner</span>
        <button type="button" class="hme-tb" ?disabled=${t.outline.length<=3} @click=${()=>e.apply(s=>Jo(s,n,o.corner),{select:{kind:"room",roomId:n}})}>Remove corner</button>
        ${a}`;if(o.kind==="opening"){let s=t.openings[o.opening];return s===void 0?b:c`<span class="hme-pill-name">${fo(s)}</span>
        <button type="button" class="hme-tb danger" @click=${()=>e.apply(d=>tn(d,n,o.opening),{select:{kind:"room",roomId:n}})}>Remove</button>
        ${a}`}return b}addHere(e,t,o,n,i){let a=t.id,s=t.openings.length;e.apply(d=>en(d,a,o,{kind:n,...i===void 0?{}:{at:i}}),{select:{kind:"opening",roomId:a,opening:s}})}cornerHere(e,t,o,n){let i=t.id,a=h=>Qo(h,i,o,n),s=a(e.doc)?.floors.flatMap(h=>h.rooms).find(h=>k(h.id,i)),d=V(t)[o],l=n??(d===void 0?void 0:[(d.a[0]+d.b[0])/2,(d.a[1]+d.b[1])/2]),p=s===void 0||l===void 0?-1:s.outline.reduce((h,m,u)=>Math.hypot(m[0]-l[0],m[1]-l[1])<Math.hypot(s.outline[h][0]-l[0],s.outline[h][1]-l[1])?u:h,0);e.apply(a,{select:p<0?{kind:"room",roomId:i}:{kind:"corner",roomId:i,corner:p}})}inspector(e){let t=this.pieceRoom(e),o=e.selection;if(t===void 0||o===void 0)return c``;let n=t.id;if(o.kind==="corner")return this.cornerCard(e,t,o.corner);let i=this.pickedWall(e,t);if(i===void 0)return c``;let a=V(t)[i],s=Ie(a),d=p=>{let h=t.openings.length;e.apply(m=>en(m,n,i,{kind:p}),{select:{kind:"opening",roomId:n,opening:h}})},l=uo(t,i,T(t));return c`
      ${o.kind==="wall"?c`<section class="hme-card hme-head"><div class="hme-head-t"><strong>Wall</strong><span>${l}</span></div></section>`:b}
      <section class="hme-card">
        <div class="hme-h">${o.kind==="wall"?"This wall":`The wall: ${l}`}</div>
        ${o.kind==="wall"?this.wallPicture(e,t,i,void 0):b}
        ${ve(j({tag:"Length",label:"Length",value:s,unit:"m",min:.1,max:200,set:p=>e.apply(h=>Oa(h,n,i,p))}),j({tag:"Height",label:"Wall height",value:t.height,unit:"m",min:.5,max:20,set:p=>e.apply(h=>Jt(h,n,p))}),j({tag:"Thick",label:"Thickness",value:a.t,unit:"m",min:.01,max:1,set:p=>e.apply(h=>Aa(h,n,i,p))}))}
        ${W("Type a length to move the far corner. Rooms that share the corner move with it.")}
        <div class="hme-add3">
          <button type="button" class="hme-tb" @click=${()=>d("door")}>＋ Door</button>
          <button type="button" class="hme-tb" @click=${()=>d("window")}>＋ Window</button>
          <button type="button" class="hme-tb" @click=${()=>d("opening")}>＋ Way through</button>
        </div>
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${()=>e.apply(p=>La(p,n,i))}>Straighten</button>
          <button type="button" class="hme-tb" @click=${()=>e.apply(p=>to(p,n))}>Square the corners</button>
          <button type="button" class="hme-tb" @click=${()=>this.cornerHere(e,t,i,void 0)}>Split wall</button>
          <button type="button" class="hme-tb danger" title="Take this wall away" @click=${()=>e.apply(p=>li(p,n,i),{select:{kind:"room",roomId:n}})}>Remove</button>
        </div>
      </section>`}wallPicture(e,t,o,n){let i=V(t)[o],a=Math.max(Ie(i),.01),s=t.height>0?t.height:2.4,d=Math.abs(i.b[0]-i.a[0])>=Math.abs(i.b[1]-i.a[1])?i.a[0]>i.b[0]:i.a[1]>i.b[1],l=320,p=14,h=24,m=Math.min((l-p*2)/a,120/s),u=a*m,f=s*m,g=(l-u)/2,w=h+f+26,y=h+f,M=I=>g+(d?a-I:I)*m,$=I=>y-I*m,v=t.id,x=(I,E,O)=>{let U=et(t,E),ee=t.openings[E],B=I.currentTarget.closest("svg");if(U===void 0||ee===void 0||B===null||I.button!==0)return;I.preventDefault(),I.stopPropagation();let Ce=B.getBoundingClientRect().width/l||1,me={x:I.clientX,y:I.clientY},Le={x:d?-O.x:O.x,z:O.z},Ge,Fe=_e=>{let Te=(_e.clientX-me.x)/Ce/m,ft=-(_e.clientY-me.y)/Ce/m;if(Ge===void 0&&Math.hypot(Te,ft)*Ce*m<3)return;let gt=dn(U,Le,d?-Te:Te,ft,ee.kind!=="window");Ge=gt,e.preview(Wt=>Re(Wt,v,E,gt))},Ve=()=>{window.removeEventListener("pointermove",Fe),window.removeEventListener("pointerup",Ve),window.removeEventListener("pointercancel",Ve),e.preview(void 0);let _e=Ge;_e!==void 0&&e.apply(Te=>Re(Te,v,E,_e))};window.addEventListener("pointermove",Fe),window.addEventListener("pointerup",Ve),window.addEventListener("pointercancel",Ve)},R=t.openings.flatMap((I,E)=>{if(Tt(t,I)!==o)return[];let O=et(t,E);if(O===void 0)return[];let U=Math.min(M(O.from),M(O.to)),ee=Math.max(M(O.from),M(O.to)),B=$(O.z1),Ce=$(O.z0),me=n===E,Le=I.kind==="window"?"rgba(139,184,240,0.55)":"#121214";return[H`<rect class="hme-wp-o ${me?"on":""}" x=${P(U)} y=${P(B)} width=${P(ee-U)} height=${P(Ce-B)} rx="1.5" fill=${Le} stroke=${me?"#5b8def":"#6e6e73"} stroke-width=${me?2:1}
        style=${me?"cursor:move":"cursor:pointer"}
        @pointerdown=${Ge=>{me&&x(Ge,E,{x:0,z:0})}}
        @click=${()=>{me||e.select({kind:"opening",roomId:v,opening:E})}}><title>${fo(I)}</title></rect>`]}),S=n===void 0?void 0:et(t,n),_=[];if(S!==void 0&&n!==void 0){let I=t.openings[n],E=Math.min(M(S.from),M(S.to)),O=Math.max(M(S.from),M(S.to)),U=$(S.z1),ee=$(S.z0),B=(E+O)/2,Ce=(U+ee)/2,me=I.kind!=="window",Le=(Te,ft,gt,Wt)=>H`<circle class="hme-wp-h" cx=${P(Te)} cy=${P(ft)} r="5.5" fill="#fff" stroke="#5b8def" stroke-width="2" style=${`cursor:${Wt}`}
        @pointerdown=${Xn=>x(Xn,n,gt)}></circle>`,Ge=[Le(E,Ce,{x:-1,z:0},"ew-resize"),Le(O,Ce,{x:1,z:0},"ew-resize"),Le(B,U,{x:0,z:1},"ns-resize"),...me?[]:[Le(B,ee,{x:0,z:-1},"ns-resize")]],Fe=(Te,ft,gt,Wt,Xn=!1)=>H`<text x=${P(Te)} y=${P(ft)} text-anchor=${Wt} class=${Xn?"hme-wp-t strong":"hme-wp-t"}>${gt}</text>`;_.push(Fe(B,Math.max(U-8,12),`${ne(S.to-S.from)}`,"middle",!0));let Ve=(E-g)/m,_e=(g+u-O)/m;Ve>.03&&_.push(H`<path d=${`M${P(g)} ${P(y+8)}H${P(E)}`} class="hme-wp-dim" />`,Fe((g+E)/2,y+20,ne(Ve),"middle")),_e>.03&&_.push(H`<path d=${`M${P(O)} ${P(y+8)}H${P(g+u)}`} class="hme-wp-dim" />`,Fe((O+g+u)/2,y+20,ne(_e),"middle")),_.push(Fe(O+8,Ce+4,ne(S.z1-S.z0),"start",!0)),S.z0>.03&&_.push(H`<path d=${`M${P(B)} ${P(ee)}V${P(y)}`} class="hme-wp-dim" />`,Fe(B+5,(ee+y)/2+4,ne(S.z0),"start")),_.push(...Ge)}return c`<svg class="hme-wp" viewBox=${`0 0 ${l} ${w.toFixed(0)}`} role="img" aria-label=${`${uo(t,o,T(t))}, seen square on`}>
      ${H`<rect x=${P(g)} y=${P(h)} width=${P(u)} height=${P(f)} rx="2" class="hme-wp-wall" />
        <line x1=${P(g-8)} x2=${P(g+u+8)} y1=${P(y)} y2=${P(y)} class="hme-wp-floor" />`}
      ${R}${_}
    </svg>`}openingCardOf(e){let t=this.pieceRoom(e),o=e.selection,n=o?.kind==="opening"?t?.openings[o.opening]:void 0;return t===void 0||o?.kind!=="opening"||n===void 0?b:this.openingCard(e,t,o.opening,n)}openingCard(e,t,o,n){let i=t.id,a=fo(n),s=et(t,o),d=s?.wall??-1,l=V(t)[d],p=n.kind!=="window",h=l===void 0?!1:Math.abs(l.b[0]-l.a[0])>=Math.abs(l.b[1]-l.a[1])?l.a[0]>l.b[0]:l.a[1]>l.b[1],m=l===void 0||Math.abs(l.b[0]-l.a[0])>=Math.abs(l.b[1]-l.a[1]),u=x=>({set:R=>{e.apply(S=>Re(S,i,o,x(R)))},preview:R=>e.preview(R===void 0?void 0:S=>Re(S,i,o,x(R)))}),f=c`<div class="hme-pics hme-kinds">${lh.map(x=>he({label:x.label,picture:mh[x.label],on:n.kind===x.kind&&n.style===x.style,click:()=>e.apply(R=>_a(R,i,o,{kind:x.kind,style:x.style??null}))}))}</div>`,g=c`<button type="button" class="hme-tb danger" @click=${()=>e.apply(x=>tn(x,i,o),{select:{kind:"room",roomId:i}})}>Remove ${a.toLowerCase()}</button>`,w=c`<section class="hme-card hme-head"><div class="hme-head-t"><strong>${a}</strong>
      <span>${d>=0?uo(t,d,T(t)):T(t)}</span></div></section>`;if(s===void 0||l===void 0)return c`${w}${D("Kind",f)}<section class="hme-card"><div class="hme-row-end">${g}</div></section>`;let y=s.to-s.from,M=s.z1-s.z0,$=h?s.length-s.to:s.from,v=(s.length-y)/2;return c`${w}
      <section class="hme-card">
        <div class="hme-h">Size and place</div>
        ${this.wallPicture(e,t,d,o)}
        ${ve(j({tag:"Width",label:"Width",value:y,unit:"m",min:.2,max:s.length,...u(x=>({...s,from:s.from,to:Math.min(s.from+x,s.length)}))}),j({tag:"Height",label:"Tall",value:M,unit:"m",min:.1,max:s.height,...u(x=>({...s,z1:Math.min(s.z0+x,s.height)}))}))}
        ${ve(j({tag:m?"From left":"From top",label:m?"From the left":"From the top",value:$,unit:"m",min:0,max:s.length-y,...u(x=>h?{...s,from:s.length-x-y,to:s.length-x}:{...s,from:x,to:x+y})}),j({tag:"From floor",label:"From floor",value:s.z0,unit:"m",min:0,max:s.height-M,disabled:p,...u(x=>({...s,z0:x,z1:x+M}))}))}
        <div class="hme-row-end">
          <button type="button" class="hme-tb" title="Put it in the middle of its wall" @click=${()=>e.apply(x=>Re(x,i,o,{...s,from:v,to:v+y}))}>Center on wall</button>
          ${g}
        </div>
        ${W("Drag a white dot on the picture to resize it, or the shape to move it. It works on the plan and in 3D too.",!0)}
      </section>
      ${D("Kind",f)}`}cornerCard(e,t,o){let n=t.id,i=t.outline[o];if(i===void 0)return c``;let a=e.floor.rooms.filter(s=>!k(s.id,n)&&s.outline.some(d=>Math.hypot(d[0]-i[0],d[1]-i[1])<=.02));return D("Corner",c`
      ${G("Room",c`<span class="hme-val strong">${T(t)}</span>`)}
      ${G("Left, top",j({label:"Corner left",value:i[0],unit:"m",set:s=>e.apply(d=>St(d,n,o,[s,i[1]]))}),j({label:"Corner top",value:i[1],unit:"m",set:s=>e.apply(d=>St(d,n,o,[i[0],s]))}))}
      ${W(a.length===0?"Drag it on the plan. Drop it on another room's corner and the two move together after.":`Shared with ${a.map(T).join(", ")}, which move${a.length===1?"s":""} with it.`)}
      <div class="hme-row-end indent">
        <button type="button" class="hme-tb" ?disabled=${t.outline.length<=3} @click=${()=>e.apply(s=>Jo(s,n,o),{select:{kind:"room",roomId:n}})}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(s=>to(s,n))}>Square the corners</button>
      </div>`)}},hh={select:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3z" fill="none" stroke="currentColor" stroke-width="1.4"></path><circle cx="3" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="15" r="2" fill="currentColor"></circle><circle cx="3" cy="15" r="2" fill="currentColor"></circle></svg>`,split:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 3h14v12H2z" fill="none" stroke="currentColor" stroke-width="1.4"></path><path d="M9 1v16" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 2"></path></svg>`,inner:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="2.4"></path></svg>`,door:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 15h4M12 15h4M6 15V5M6 5a10 10 0 0 1 10 10" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`,window:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="1.4"></path><path d="M5 7h8M5 11h8" stroke="#8bb8f0" stroke-width="1.4"></path></svg>`,opening:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h4M12 9h4" stroke="currentColor" stroke-width="2.4"></path></svg>`,stairs:c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3zM3 6h12M3 9h12M3 12h12" fill="none" stroke="currentColor" stroke-width="1.2"></path></svg>`},mh={Door:c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V4M14 4a17 17 0 0 1 17 17" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Double door":c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V7M48 21V7M14 7a14 14 0 0 1 14 14M48 7a14 14 0 0 0-14 14" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Sliding door":c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18.5h20M28 23.5h20" stroke="#ece6da" stroke-width="2.4"></path></svg>`,Window:c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 18h34M14 24h34" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Sliding window":c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18h20M28 24h20" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Way through":c`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h10M48 21h10" stroke="#ece6da" stroke-width="4"></path><path d="M14 27h34" stroke="#98989d" stroke-width="1" stroke-dasharray="3 3"></path></svg>`};var Ho=[{id:"pick",name:"Pick",label:"Pick and move",key:"v"},{id:"draw",name:"Room",label:"Draw a room",key:"r"},{id:"split",name:"Split",label:"Split the room",key:"s"},{id:"inner",name:"Wall",label:"Inner wall",key:"w"},{id:"door",name:"Door",label:"Door",key:"d"},{id:"window",name:"Window",label:"Window",key:"n"},{id:"opening",name:"Opening",label:"Way through (no door)",key:"o"},{id:"stairs",name:"Stairs",label:"Stairs",key:"t"},{id:"measure",name:"Measure",label:"Measure",key:"m"}],Pl=Ho.filter(r=>r.id!=="pick"&&r.id!=="measure");function ch(r){return Ho.find(e=>e.key===r.toLowerCase())?.id}function uh(r){let e=Ga(r);return r.pins.filter(t=>t.entityId.startsWith("light.")&&!e.has(t.id.toUpperCase())).map(t=>t.id)}function fh(r,e){let t=r.hass?.states?.[e]?.attributes?.friendly_name;return typeof t=="string"&&t.trim()!==""?t.trim():e}var _n=class{constructor(){this.arrange=new Tn;this.devices=new An((e,t,o)=>this.arrange.piecePic(e,se(t),o));this.shape=new Fn;this.doors=new Ln;this.drawOpen=!1;this.arrange.roomDoors=(e,t)=>this.doors.doorsCard(e,t),this.arrange.roomWalls=(e,t)=>this.shape.wallsCard(e,t),this.arrange.roomScan=(e,t)=>this.shape.scanCard(e,t),this.arrange.roomBefore=e=>this.checklistStrip(e),this.arrange.roomTray=(e,t)=>c`${this.devices.trayCard(e,t)}${this.devices.onMapCard(e,t)}`,this.shape.onOpeningClick=(e,t,o)=>this.doors.clicked(e,t,o)}tool(e){if(e.toggles.measure)return"measure";if(this.arrange.draw.active)return"draw";let t=this.shape.tool;return t==="select"?"pick":t}setTool(e,t){if(this.doors.stop(e),this.drawOpen=!1,this.devices.armed=void 0,t==="measure"){this.arrange.draw.stop(),this.shape.setTool(e,"select"),e.setToggle("measure",!e.toggles.measure),e.redraw();return}if(e.toggles.measure&&e.setToggle("measure",!1),t==="draw"){this.shape.setTool(e,"select"),this.arrange.draw.active||this.arrange.draw.start(e);return}this.arrange.draw.stop(e),this.shape.setTool(e,t==="pick"?"select":t)}picksPins(e){return nt(e.selection).length>0}overlay(e){return H`${this.arrange.overlay(e)}${this.shape.overlay(e)}${this.doors.overlay(e)}${this.devices.overlay(e)}`}drawsPins(e){return!0}pointerDown(e,t,o){if(this.devices.choosing)return this.devices.cancelChooser(e),!0;if(this.drawOpen&&(this.drawOpen=!1,e.redraw()),this.devices.armed!==void 0&&t.button===0)return this.devices.placeArmed(e,o),!0;if(this.doors.endShow(e),this.doors.active&&t.button===0&&this.doors.pointerDown(e,o))return!0;if(this.arrange.draw.active)return this.arrange.draw.pointerDown(e,t,o);if(this.shape.armed)return this.shape.pointerDown(e,t,o);if(t.button!==0)return!1;if(this.shape.pressHandle(e,t)||this.arrange.pressHandle(e,t,o)||this.devices.pressHandle(e,t,o))return!0;let n=this.devices.heldThingAt(e,o);return n!==void 0&&this.arrange.pressThing(e,t,n,o)?!0:this.devices.pressPin(e,t,o)||this.devices.pressBox(e,t,o)||this.shape.pressPiece(e,t,o)||this.arrange.pressBody(e,t,o)}hover(e,t){this.arrange.pointer=t,this.arrange.hover(e,t),this.shape.hover(e,t)}keyDown(e,t){if(this.devices.chooserKey(e,t))return!0;let o=oe(t,!1);if(o==="cancel"&&(this.devices.armed!==void 0||this.drawOpen))return this.devices.armed=void 0,this.drawOpen=!1,e.redraw(),!0;let n=typeof o=="object"&&"letter"in o?o.letter:void 0;if(n==="m")return this.setTool(e,"measure"),!0;if(this.doors.keyDown(e,t)||this.arrange.draw.active&&this.arrange.draw.keyDown(e,t))return!0;if(o==="copy"||o==="paste"||o==="duplicate")return this.arrange.clipKey(e,o);if(n==="f")return e.openAdd("furniture"),!0;let i=n===void 0?void 0:ch(n);return i!==void 0?(this.setTool(e,i),!0):o==="cancel"&&this.shape.armed?(this.setTool(e,"pick"),!0):le(e.selection)||this.shape.armed?this.shape.keyDown(e,t):this.picksPins(e)?this.devices.keyDown(e,t):this.arrange.keyDown(e,t)}cursor(e){return this.arrange.draw.active||this.shape.armed||this.devices.armed!==void 0?"crosshair":void 0}leave(e){this.arrange.leave(e),this.devices.leave(),this.shape.leave(e),this.doors.stop(e),this.drawOpen=!1}dock(e){return this.arrange.dock(e)}viewItems(e){return[...this.arrange.viewItems(e),...this.devices.viewItems(e),...this.shape.viewItems(e)]}pill(e){return this.doors.active?this.doors.pill(e):this.shape.armed||le(e.selection)?this.shape.pill(e):this.arrange.draw.active?this.arrange.pill(e):this.picksPins(e)?this.devices.pill(e):this.arrange.pill(e)}stageExtra(e){let t=this.devices.stageExtra(e),o=this.devices.armed,n=le(e.selection)?"Drag a corner \xB7 drag a wall's middle to add a corner \xB7 Esc for the room":"Click picks what is on top: a door, a wall, a thing or a room";return c`${this.toolRail(e)}${this.drawList(e)}${t}
      ${o!==void 0?c`<div class="hme-armed" role="status"><b>${fh(e,o)}</b> Click its place on the plan.
          <button type="button" class="hme-link" @click=${()=>this.devices.arm(e,void 0)}>Stop</button></div>`:t===b&&e.stage.width>=1200?c`<div class="hme-stage-hint">${n}</div>`:b}`}toolRail(e){let t=this.tool(e),o=Ho.find(s=>s.id==="pick"),n=Ho.find(s=>s.id==="measure"),i=Pl.find(s=>s.id===t),a=s=>c`<button type="button" class="hme-rtool ${t===s.id?"on":""}" aria-pressed=${t===s.id?"true":"false"}
      aria-label=${s.label} title=${`${s.label} (${s.key.toUpperCase()})`} @click=${()=>this.setTool(e,s.id)}>
      ${cr(s.id)}<span class="hme-rtool-name">${s.name}</span></button>`;return c`<div class="hme-toolrail" role="toolbar" aria-label="Tools" aria-orientation="vertical">
      ${a(o)}
      <span class="hme-rtool-sep" aria-hidden="true"></span>
      <button type="button" class="hme-rtool hme-rtool-draw ${i!==void 0||this.drawOpen?"on":""}" aria-pressed=${i!==void 0?"true":"false"}
        aria-haspopup="menu" aria-expanded=${this.drawOpen?"true":"false"} aria-label=${i===void 0?"Draw":`Draw: ${i.label}`}
        title=${i===void 0?"Draw a room, a wall, a door, a window, a way through or stairs":`${i.label} (${i.key.toUpperCase()})`}
        @click=${()=>{this.drawOpen=!this.drawOpen,e.redraw()}}>
        ${cr(i?.id??"draw")}<span class="hme-rtool-name">${i?.name??"Draw"} ▾</span></button>
      <span class="hme-rtool-sep" aria-hidden="true"></span>
      ${a(n)}
    </div>`}drawList(e){if(!this.drawOpen)return b;let t=this.tool(e);return c`<div class="hme-drawlist" role="menu" aria-label="Draw">
      ${Pl.map(o=>c`<button type="button" role="menuitemradio" class="hme-drawlist-item ${t===o.id?"on":""}" aria-checked=${t===o.id?"true":"false"}
        title=${`${o.label} (${o.key.toUpperCase()})`} @click=${()=>this.setTool(e,o.id)}>${cr(o.id)}<span>${o.name}</span><kbd>${o.key.toUpperCase()}</kbd></button>`)}
    </div>`}inspector(e){return c`${this.doors.fitCard(e)}${this.pickedCards(e)}${this.doors.fitFoot(e)}`}trayAbove(e){let t=this.devices.trayRoom,o=e.selection;if(t===void 0||o===void 0)return b;let n=e.floor.rooms.find(s=>k(s.id,t));if(n===void 0)return b;if(!(o.kind==="object"?k(o.roomId,t):o.kind==="pin"?po(e.floor,o).some(s=>k(s.id,t)):!1))return b;let a=this.devices.waitingIn(e,n);return a.main.length===0&&a.more.length===0?b:c`${this.devices.trayCard(e,n,`Next in ${T(n)}`)}
      <button type="button" class="hme-link hme-tray-back" @click=${()=>e.select({kind:"room",roomId:n.id})}>‹ ${T(n)}</button>`}pickedCards(e){if(this.picksPins(e))return c`${this.trayAbove(e)}${this.devices.inspector(e)}`;let t=e.selection;if(t===void 0)return this.startPanel(e);if(le(t)){let n=e.floor.rooms.find(i=>k(i.id,t.roomId));return c`${this.shape.openingCardOf(e)}
        ${n!==void 0&&t.kind==="opening"?this.doors.opensToCard(e,n,t.opening):b}
        ${this.shape.inspector(e)}
        ${n===void 0?b:this.shape.roomCards(e,n)}`}let o=t.kind==="object"?this.devices.thingCards(e,t.roomId,t.object):b;return o===b?this.arrange.inspector(e):t.kind==="object"&&!this.deviceFirst(e,t.roomId,t.object)?c`${this.trayAbove(e)}${this.arrange.inspector(e)}${o}`:c`${this.trayAbove(e)}${o}${this.arrange.inspector(e)}`}deviceFirst(e,t,o){let n=e.floor.rooms.find(a=>k(a.id,t)),i=n?.objects[o];return n===void 0||i===void 0?!0:Ne(e.floor,n.id,o)!==void 0||jt(i)||Xt(i.model)!==void 0}checklist(e,t=rr(e.doc,this.devices.homeDevices(e))){return nl(t,e.pageStep?.done(e.doc)??!1)}checklistShown(e,t){return Dn(t)!==void 0||e.pageStep?.addedAny===!0}checklistStrip(e){let t=this.checklist(e),o=Dn(t);return o===void 0?b:c`<button type="button" class="hme-strip" title="Show the whole checklist" aria-label=${`${ar}: ${sr(t)}`}
      @click=${()=>e.select(void 0)}>
      ${t.map(n=>c`<span class="hme-strip-cell ${n.done?"done":n===o?"now":"next"}">
        <b>${n.done?"\u2713 ":""}${n.title}</b>${n===o?c`<small>${n.words}</small>`:b}</span>`)}
    </button>`}placeDevices(e){let t=this.devices.homeDevices(e),o=[e.floor,...e.doc.floors.filter(n=>!k(n.id,e.floor.id))];for(let n of o){let i=n.rooms.find(a=>Nt(a,t,e.doc).main.length>0);if(i!==void 0){k(n.id,e.floor.id)||e.setFloor(n.id),e.select({kind:"room",roomId:i.id});return}}}checklistCard(e){let t=rr(e.doc,this.devices.homeDevices(e)),o=this.checklist(e,t);if(!this.checklistShown(e,o))return b;let n=Dn(o),i=uh(e.floor),a=(p,h)=>{let m=p.done?"done":p===n?"now":"next";return c`<div class="hme-step ${m}">
        <span class="hme-step-no" aria-label=${p.done?"Done":`Step ${p.id}`}>${p.done?"\u2713":String(p.id)}</span>
        <div class="hme-step-t"><b>${p.title}</b><span>${p.words}</span>${h}</div>
      </div>`},[s,d,l]=o;return D(ar,c`<div class="hme-steps">
      ${a(s,n===s?c`<button type="button" class="hme-tb hme-blue" @click=${()=>this.startDrawing(e)}>Draw a room</button>`:b)}
      ${a(d,c`${n!==d?b:t.waiting>0?c`<button type="button" class="hme-tb hme-blue" @click=${()=>this.placeDevices(e)}>Place devices</button>`:c`<button type="button" class="hme-tb hme-blue" @click=${()=>e.openAdd("devices")}>Add a device</button>`}
        ${i.length===0?b:c`<span class="hme-step-quiet">${F(i.length,"light")} ${i.length===1?"sits":"sit"} in no lamp.
          <button type="button" class="hme-link" title="Pick every light no lamp holds" @click=${()=>e.select(pn(i))}>Show me the loose lights</button></span>`}`)}
      ${a(l,n===l||e.pageStep?.addedAny===!0?this.pageRows(e):b)}
    </div>`,sr(o),"hme-start")}pageRows(e){let t=e.pageStep;if(t===void 0)return c``;let o=t.rows(),n=e.floor.rooms.length>0?e.floor:e.doc.floors.find(i=>i.rooms.length>0);return o.length===0?c`<span class="hme-step-quiet">${bt("Pair a watch or an iPhone first.","Pair a watch or a phone first.")}</span>`:c`<div class="hme-pagerows">${o.map(i=>c`<div class="hme-pagerow">
      <div class="hme-pagerow-t"><b>${i.device.name}</b><span>${i.line}</span>
        ${i.note===void 0?b:c`<span class="hme-pagerow-note ${i.note.kind}" role="status">${i.note.text}</span>`}</div>
      ${i.added!==void 0?c`<span class="hme-pagerow-done">Added${e.openPage===void 0?b:c` · <button type="button" class="hme-link" @click=${()=>e.openPage?.(i.added)}>Open it</button>`}</span>`:c`<button type="button" class="hme-tb" aria-label=${`Add a page to ${i.device.name}`} ?disabled=${i.busy||n===void 0}
            @click=${()=>{n!==void 0&&t.add(e.hass,e.doc,n,i.device,a=>e.confirm(a))}}>${i.busy?"Adding\u2026":"Add page"}</button>`}
    </div>`)}</div>`}roomsCard(e){let t=e.floor;return t.rooms.length===0?b:D("Rooms",c`<div class="hme-ly-list">${t.rooms.map(o=>{let n=this.devices.waitingIn(e,o),i=o.areaId!==void 0,a=rl({hasArea:i,onMap:Ye(t,o.id).length,wait:n.main.length,more:n.more.length}),s={kind:"room",roomId:o.id},d=e.hover?.kind==="room"&&k(e.hover.roomId,o.id);return c`<div class="hme-ly ${d?"hov":""}" @pointerenter=${()=>e.setHover(s)} @pointerleave=${()=>e.setHover(void 0)}>
        <button type="button" class="hme-ly-main" title=${i?"Pick it":"Pick it and give it an area"}
          @click=${()=>{i||Lt(Ji,!0),e.select(s)}}>
          <span class="hme-thing-ic" aria-hidden="true"></span><span class="hme-ly-nm">${T(o)}</span>
          <span class="hme-ly-end ${n.main.length>0?"wait":""}">${a}</span></button>
      </div>`})}</div>`,String(t.rooms.length),"hme-rooms")}startPanel(e){let t=e.floor;return c`
      ${this.checklistCard(e)}
      ${this.roomsCard(e)}
      ${yd(e)}
      ${Oe("floor","Floor",K(t),this.arrange.floorBody(e,t))}
      <section class="hme-card hme-tips-card">
        <details class="hme-tips">
          <summary>Keys and tips <span aria-hidden="true">›</span></summary>
          <p class="hme-text">Click picks what is on top: a device, then a thing (a sofa, a TV, a desk), then the room under them. Drag it to move it.</p>
          <p class="hme-text dim">A dragged room locks to the doors of the rooms round it. Click an amber door, then the door it should meet. Drag the round handle above a room to turn it, or a square handle on its box to resize it. Click a wall, door or window to change it.</p>
          <p class="hme-text dim">Shift, Cmd or Ctrl and a click picks several devices; Cmd or Ctrl and a click picks several things, to colour or hide them together. Pick a room to see its devices that wait: drag one from its tray onto the plan, or click it, then click its place.</p>
          <p class="hme-text dim">Press <kbd>?</kbd> or the ? button in the bar for every key.</p>
          <dl class="hme-keys">
            ${ur($e()).filter(o=>o.title!=="Mouse").flatMap(o=>o.keys).map(([o,n])=>c`<dt><kbd>${o}</kbd></dt><dd>${n}</dd>`)}
          </dl>
        </details>
      </section>`}sheet(e){let t=this.devices.lampChooser(e);return t===b?this.arrange.sheet(e):t}dragOver(e,t,o){return this.devices.dragOver(e,t,o)}drop(e,t,o){this.devices.drop(e,t,o)}startDrawing(e){this.setTool(e,"draw")}};function ur(r){let e=r?"\u2318":"Ctrl";return[{title:"Tools",keys:Ho.map(t=>[t.key.toUpperCase(),t.label])},{title:"Add",keys:[["A","Add a device or furniture"],["F","Add furniture"]]},{title:"Edit",keys:[["Delete","Remove what is picked"],[`${e}${r?"":"+"}C`,"Copy the picked furniture"],[`${e}${r?"":"+"}V`,"Paste it under the pointer, on any floor"],[`${e}${r?"":"+"}D`,"Duplicate the picked furniture"],["Arrows","Nudge it 1 cm, with Shift 10 cm"],["Enter","Close the room being drawn"],["Backspace","Take back the last corner drawn"],["Esc","Back out: Connect, a tool, a wall, door or thing to its room"],[r?"\u2318Z":"Ctrl+Z","Undo"],[r?"\u21E7\u2318Z":"Ctrl+Shift+Z or Ctrl+Y","Redo"]]},{title:"View",keys:[["Space","Hold and drag to pan"],["Middle button","Drag to move the plan or the 3D view"],["+ \u2212","Zoom in and out"],["0","Fit the floor"],["Z","Fit the picked room"],["?","Show or hide these keys"]]},{title:"Mouse",keys:[["Click","Pick what is on top: a device, a door or window, a wall, a thing, then the room"],["Click an amber door","Connect it: then click the door it should meet"],[`Shift or ${e} click`,"Pick several devices"],[`${e} click`,"Pick several things"],["Shift drag","Pick every device in a box"],["Drag in 3D","Turn the model; scroll to zoom"],["Alt drag","Drag a copy of the furniture picked"],["Drag a number","Change it, with Shift in big steps, with Alt in fine ones; click it to type"]]}]}function cr(r){switch(r){case"pick":return c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 2.5v11.5l3.1-3 2.3 5 2-.9-2.3-4.9h4.4z" fill="currentColor"></path></svg>`;case"draw":return c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 15V3h8l4 4v8z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2.5 2"></path></svg>`;case"measure":return c`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14M2 6v6M16 6v6M6 9v-2M9 9V6M12 9v-2" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`;default:return Hl(r)}}var gh=[["lights","Lights"],["sensors","Sensors"],["climate","Climate"],["switches","Switches and plugs"],["media","Media"],["covers","Covers"],["locks","Locks"],["other","Other"]],Ae="*",jn="",fr=200;function bh(r){switch(cs(r)){case"lights":return"lights";case"sensors":return"sensors";case"climate":return"climate";case"power":return"switches";case"media":return"media";case"covers":return"covers";case"security":return r.startsWith("lock.")?"locks":"other";default:return"other"}}function zn(r){let e=r.selection,t=pe(e);if(t!==void 0)return r.floor.rooms.find(n=>k(n.id,t));if(e?.kind!=="pin")return;let o=r.floor.pins.find(n=>k(n.id,e.pinId));return o===void 0?void 0:te(r.floor,o)}function gr(r){return Be(r.view,[r.stage.width/2,r.stage.height/2])}function vh(r){return zn(r)??q(r.floor,gr(r))}function yh(r,e){let t=gr(r);return Y(e.outline,t)?t:Z(e)??ue(e)}function wh(r,e){return e.trim()===""?r.filter(t=>t.category===void 0&&ps.has(t.domain)):ms(r,e,1/0)}function Mh(r,e){return e===Ae?!0:e===jn?r.areaId===void 0:r.areaId===e}function kh(r,e,t,o){let n=new Map,i=new Map(r.areas.map(h=>[h.id,h.name])),a=0;for(let h of e){if(h.areaId===void 0){a+=1;continue}n.set(h.areaId,(n.get(h.areaId)??0)+1),i.has(h.areaId)||i.set(h.areaId,h.areaName??h.areaId)}let s=[],d=(h,m=!1)=>{h===void 0||h===""||s.includes(h)||!m&&(n.get(h)??0)===0||s.push(h)};d(t,!0);for(let h of r.floor.rooms)d(h.areaId);let l=[...n.keys()].sort((h,m)=>(i.get(h)??h).localeCompare(i.get(m)??m));for(let h of l)d(h);o!==Ae&&d(o,!0);let p=s.map(h=>({id:h,name:i.get(h)??h,count:n.get(h)??0}));return(a>0||o===jn)&&p.push({id:jn,name:"No area",count:a}),p.push({id:Ae,name:"All areas",count:e.length}),p}function El(r,e){let t=new Map;for(let o of r){if(!Mh(o,e))continue;let n=bh(o.entityId),i=t.get(n);i===void 0&&t.set(n,i=[]),i.push(o)}return gh.filter(([o])=>t.has(o)).map(([o,n])=>({kind:o,label:n,devices:t.get(o)}))}function $h(r,e){if(e.startsWith("light.")){let t=rn(r,e).length;return t===0?void 0:t===1?"On the map":`${t} on the map`}return ot(r,e)===void 0?void 0:"On the map"}function xh(r){let e=r;e?.focus!==void 0&&setTimeout(()=>e.focus?.(),0)}function Hh(r){let e=r;e?.showModal!==void 0&&queueMicrotask(()=>{e.isConnected&&e.open!==!0&&e.showModal?.()})}var Nn=class{constructor(e,t){this.devices=e;this.picture=t;this.tab="devices";this.query="";this.area=Ae;this.areaChosen=!1;this.pieceQuery="";this.pieceGroup="";this.focus=!1}open(e,t="devices",o){this.choice=o,this.tab=o===void 0?t:"devices",this.query="",this.pieceQuery="",this.pieceGroup="",this.roomId=void 0,this.area=o===void 0?zn(e)?.areaId??Ae:Ae,this.areaChosen=!1,this.focus=!0}setTab(e,t){this.tab!==t&&(this.tab=t,this.focus=!0,e.redraw())}furnitureRoom(e){let t=vh(e);if(t!==void 0)return t;let o=this.roomId;return o===void 0?void 0:e.floor.rooms.find(n=>k(n.id,o))}addDevice(e,t,o){let n=this.choice;if(n!==void 0){o(),n.pick(t.entityId);return}let i=zn(e)??ro(e.floor,t.areaId),a=i===void 0?void 0:this.devices.freeSpot(e,i);t.entityId.startsWith("light.")?this.devices.placeLight(e,t.entityId,a??gr(e)):this.devices.place(e,t.entityId,a,t.areaId),e.redraw()}addPiece(e,t,o){let n=this.furnitureRoom(e);if(n===void 0)return;let i=n.id,a=n.objects.length,s=yh(e,n);o(),e.apply(d=>Ea(d,i,t,s),{select:{kind:"object",roomId:i,object:a}})||e.note("warn","That piece could not be added: a room holds at most 256 things.")}render(e,t){let o=zn(e),n=this.choice,i=n?.title??`Add to ${o===void 0?K(e.floor):T(o)}`,a=this.focus;this.focus=!1;let s=at(l=>{a&&xh(l)}),d=(l,p)=>c`<button type="button" role="tab" id=${`hma-tab-${l}`} class=${this.tab===l?"on":""}
      aria-selected=${this.tab===l?"true":"false"} aria-controls="hma-panel" @click=${()=>this.setTab(e,l)}>${p}</button>`;return c`<dialog class="hma" aria-labelledby="hma-title" ${at(Hh)}
      @cancel=${l=>{l.preventDefault(),t()}}
      @keydown=${l=>{l.stopPropagation(),l.key==="Escape"&&(l.preventDefault(),t())}}
      @pointerdown=${l=>{l.target===l.currentTarget&&t()}}>
      <div class="hma-in">
        <div class="hma-head">
          <h3 id="hma-title">${i}</h3>
          <button type="button" class="hme-x hma-close" aria-label="Close" title="Close (Esc)" @click=${t}>×</button>
        </div>
        ${n===void 0?c`<div class="hme-seg hma-tabs" role="tablist" aria-label="What to add">${d("devices","Devices")}${d("furniture","Furniture")}</div>`:b}
        <div class="hma-panel" id="hma-panel" role=${n===void 0?"tabpanel":"group"} aria-labelledby=${n===void 0?`hma-tab-${this.tab}`:"hma-title"}>
          ${this.tab==="devices"?this.devicesTab(e,o,t,s):this.furnitureTab(e,t,s)}
        </div>
      </div>
    </dialog>`}devicesTab(e,t,o,n){let i=e.hass?.states,a=this.choice,s=tt(e.hass),d=a===void 0?s:s.filter($=>(!a.lightsOnly||$.domain==="light")&&$.entityId!==a.now),l=wh(d,this.query);!this.areaChosen&&this.area!==Ae&&El(l,this.area).every($=>$.devices.length===0)&&(this.area=Ae);let p=kh(e,l,t?.areaId,this.area),h=El(l,this.area),m=h.reduce(($,v)=>$+v.devices.length,0),u=fr,f=h.map($=>{let v=$.devices.slice(0,Math.max(u,0));return u-=v.length,{...$,devices:v}}).filter($=>$.devices.length>0),g=this.area===Ae?"in any area":this.area===jn?"with no area":`in ${p.find($=>$.id===this.area)?.name??"this area"}`,w=this.query.trim()!=="",y=a?.lightsOnly===!0?"light":"device",M=hr();return c`
      ${a===void 0?c`<div class="hma-lamp"><span>Lights go in</span>${xe({label:"Lights go in",value:M,options:$t.map($=>({value:$,label:cl[$]})),set:$=>{pr($),e.redraw()}})}</div>`:b}
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find a ${y}" aria-label="Find a ${y}" autofocus .value=${X(this.query)} ${n}
          @input=${$=>{this.query=$.target.value,e.redraw()}} /></label>
      <div class="hme-chips hma-chips" role="group" aria-label="Areas">
        ${p.map($=>{let v=$.id===this.area;return c`<button type="button" class="hme-chip sel ${v?"on":""}" aria-pressed=${v?"true":"false"}
            @click=${()=>{this.area=$.id,this.areaChosen=!0,e.redraw()}}>${$.name}<span class="hma-n">${$.count}</span></button>`})}
      </div>
      <div class="hma-list">
        ${m===0?c`<p class="hma-empty">${w?`Nothing by that name ${g}.`:`No ${y}s ${g}.`}</p>`:b}
        ${f.map($=>c`<section class="hma-sec">
          <div class="hme-h">${$.label}<span class="hme-h-end">${$.devices.length}</span></div>
          ${$.devices.map(v=>this.deviceRow(e,v,i,o))}
        </section>`)}
        ${m>fr?c`<p class="hma-empty">Showing ${fr} of ${m}. Type to narrow the list.</p>`:b}
      </div>
      <div class="hma-foot">
        <span class="hma-count">${F(m,y)}</span>
        ${a===void 0?c`<button type="button" class="hme-tb hme-blue hma-done" @click=${o}>Done</button>`:b}
      </div>`}deviceRow(e,t,o,n){let i=t.entityId.startsWith("light."),a=$h(e.doc,t.entityId),s=this.choice,d=s!==void 0?s.rowTitle(t.name):i?"Add it in a lamp, the kind Lights go in names. A light can be on the map many times.":a===void 0?"Put it on the map":"On the map: click to pick it",l=ke(t.entityId,t.deviceClass,t.name);return c`<button type="button" class="hma-row ${s===void 0&&!i&&a!==void 0?"placed":""}" title=${d}
      @click=${()=>this.addDevice(e,t,n)}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${de(l,"currentColor",24,2)}</svg></span>
      <span class="hma-nm"><span>${t.name}</span><small class="mono">${t.entityId}</small></span>
      <span class="hma-state">${be(t.entityId,o)}</span>
      ${a===void 0?b:c`<span class="hma-tag">${a}</span>`}
    </button>`}furnitureTab(e,t,o){let n=this.furnitureRoom(e),i=Qi(this.pieceQuery,this.pieceGroup).filter(d=>d.pieces.length>0),a=["",...it.groups],s=d=>it.pieces.filter(l=>d===""||l.group===d).length;return c`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find a piece: sofa, lamp, desk" aria-label="Find a piece" autofocus .value=${X(this.pieceQuery)} ${o}
          @input=${d=>{this.pieceQuery=d.target.value,e.redraw()}} /></label>
      <div class="hme-chips hma-chips" role="group" aria-label="Groups">
        ${a.map(d=>{let l=d===this.pieceGroup;return c`<button type="button" class="hme-chip sel ${l?"on":""}" aria-pressed=${l?"true":"false"}
            @click=${()=>{this.pieceGroup=d,e.redraw()}}>${d===""?"All":d}<span class="hma-n">${s(d)}</span></button>`})}
      </div>
      ${n===void 0?this.askRoom(e):c`<p class="hma-where">Into <b>${T(n)}</b>: each piece stands against the nearest free wall, facing into the room. Drag it into place after.</p>`}
      <div class="hma-list">
        ${i.length===0?c`<p class="hma-empty">No piece by that name${this.pieceGroup===""?"":` in ${this.pieceGroup}`}.</p>`:b}
        ${i.map(d=>c`<section class="hma-sec">
          <div class="hme-h">${d.title}<span class="hme-h-end">${F(d.pieces.length,"piece")}</span></div>
          <div class="hma-grid">${d.pieces.map(l=>c`<button type="button" class="hme-fcard" ?disabled=${n===void 0}
            title=${`Add ${l.name}, ${xt(l)}`} @click=${()=>this.addPiece(e,l,t)}>
            ${this.picture(e,l,"hme-fcard-pic")}
            <span class="hme-fcard-name">${l.name}</span>
            <span class="hme-fcard-size mono">${xt(l)}</span>
          </button>`)}</div>
        </section>`)}
      </div>`}askRoom(e){return e.floor.rooms.length===0?c`<p class="hma-where warn">Draw or scan a room first, then add its furniture.</p>`:c`<div class="hma-ask">
      <p class="hma-where warn">Which room is it for? Pick one, or pick a room on the plan first.</p>
      <div class="hme-chips hma-chips" role="group" aria-label="Rooms">
        ${e.floor.rooms.map(t=>c`<button type="button" class="hme-chip sel" aria-pressed="false"
          @click=${()=>{this.roomId=t.id,e.redraw()}}>${T(t)}</button>`)}
      </div>
    </div>`}},Cl=To`
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
`;var Ph={iphone:"A full page with the live 3D map.",watch:"A map tile on a page. A tap opens the map."};function Eh(r,e){return r===void 0||e===null||e===void 0?!1:r.pages.some(t=>t.owners.length>0&&vt(t.item)&&Oo(t.item).some(o=>{let n=yt(o);return qt(n)==="home_map"&&e.floors.some(i=>k(i.id,Lo(n)))}))}function Ch(r,e){return r.floors.length>1?K(e):"Home map"}function Th(r,e,t,o){let n=e.toUpperCase();if(r==="iphone")return{schemaVersion:1,pages:[Is(n,t,o)]};let i={schemaVersion:1,pages:[Qr(n,t)]};return xs(i,n,{kind:"homeMap",floor:{id:o}},{last:!0}).document}var Kn=class{constructor(e){this.redraw=e;this.owners=[];this.phones=!1;this.busy=new Set;this.added=new Map;this.notes=new Map}follow(e){if(e===void 0)return;let t=Ss(e),o=this.owners.map(n=>n.owner_watch_id);this.store!==t||this.listening===void 0?(this.listening?.stop(),this.store=t,this.listening=t.listen(()=>this.redraw(),o)):this.listening.update(o)}stop(){this.listening?.stop(),this.listening=void 0}get library(){return this.store?.library}done(e){return Eh(this.library,e)}get addedAny(){return this.added.size>0}rows(){return Xr(this.owners,this.phones).map(e=>{let t=e.ownerId.toUpperCase(),o=this.added.get(t),n=this.notes.get(t);return{device:e,line:Ph[e.kind],busy:this.busy.has(t),...o===void 0?{}:{added:o},...n===void 0?{}:{note:n}}})}async add(e,t,o,n,i){let a=this.store,s=n.ownerId.toUpperCase();if(e===void 0||a===void 0||this.busy.has(s))return;this.notes.delete(s);let d,l=Mi(this.owners,this.library,n.ownerId,"pages",p=>(d=p,!1));if(!l.go&&d!==void 0){if(!await i({title:`Add a page to ${n.name}?`,text:d,ok:"Add page"}))return;l=Mi(this.owners,this.library,n.ownerId,"pages",()=>!0)}if(!l.go){l.note!==void 0&&this.notes.set(s,{kind:"warn",text:`Not added on ${n.name}. ${l.note}`}),this.redraw();return}this.busy.add(s),this.redraw();try{let p=Th(n.kind,wt(),Ch(t,o),o.id),h=await a.createItem("pages",p);if(!h.ok){this.notes.set(s,{kind:"err",text:`Not added. ${h.text}`});return}let m=await a.pick(n.ownerId,"pages",h.reply.id,!0);if(!m.ok){this.notes.set(s,{kind:"err",text:`Not added on ${n.name}. ${m.text}`});return}this.added.set(s,h.reply.id),await this.sayFreePlan(e,n)}finally{this.busy.delete(s),this.redraw()}}async sayFreePlan(e,t){let o=this.library;if(!(o===void 0||ea(o,t.ownerId,"pages")<2))try{let i=(await Hr(e,t.ownerId,"pages")).multiple_pages===!1?Yr([t.name]):void 0;i!==void 0&&this.notes.set(t.ownerId.toUpperCase(),{kind:"ok",text:i})}catch{}}};function Il(r){return{get:()=>So(r),save:(e,t)=>Cr(r,e,t)}}var Rl="The map had changed on another device. Your change was saved on top of it.",Sh="The map changed on another device, and your change no longer fits it. It now shows the map as saved there.",Ih="The map changed again while saving, so your change was not saved. Try it once more.",Po="Not saved yet. Trying again.",Rh=2e4;function Wn(){return{v:Fr,floors:[]}}var Dh=new Set(["unavailable","timeout"]);function br(r){let e=qe(r).code;return e===void 0||Dh.has(e)}function Tl(r,e){let{code:t,message:o}=qe(r);switch(console.warn(`Home map: Home Assistant refused the save (${t??"no code"}): ${o}`),t){case"invalid":{let{path:n,problem:i}=zr(o);return`Not saved. ${_r(e,n,i)}`}case"too_large":return"Not saved. The map is too big to save. Take out some rooms or things.";case"conflict":return Ih;case"unauthorized":return"Not saved. Home Assistant did not let this login save the map. Sign in again and try once more.";case"invalid_format":return"Not saved. Home Assistant could not read the map sent. Reload the page and try again.";case"unknown_command":return"Not saved. Update the HouseLit integration to save the map here.";case"unavailable":case"timeout":return"Not saved. Home Assistant could not be reached. Try again in a moment.";default:return"Not saved. Home Assistant did not take the change. Try again."}}function yr(r){let{code:e,message:t}=qe(r);switch(console.warn(`Home map: the map could not be read (${e??"no code"}): ${t}`),e){case"unauthorized":return"Home Assistant did not let this login read it. Sign in again.";case"unavailable":return"HouseLit is still starting. Try again in a moment.";case void 0:return"Home Assistant could not be reached. Check the connection and try again.";default:return"Home Assistant could not send it. Try again."}}function Oh(r){return{doc:Vt(r?.doc)??null,rev:typeof r?.rev=="number"?r.rev:0}}function Bn(r){return Array.isArray(r)?`[${r.map(Bn).join(",")}]`:typeof r=="object"&&r!==null?`{${Object.entries(r).filter(([,t])=>t!==void 0).sort(([t],[o])=>t<o?-1:t>o?1:0).map(([t,o])=>`${JSON.stringify(t)}:${Bn(o)}`).join(",")}}`:JSON.stringify(r)}function Un(r,e){return r===e?!0:r==null||e==null?!1:Bn(r)===Bn(e)}function vr(r){let e,t=new Promise((o,n)=>{e=setTimeout(()=>n({code:"timeout",message:"Home Assistant did not answer."}),Rh)});return Promise.race([r,t]).finally(()=>clearTimeout(e))}function Sl(r,e){let t=typeof e=="function"?e(r):Ur(r,e);if(t===void 0)return;let o=Gt(t);return o.ok?{doc:o.doc}:(console.warn(`Home map: not saved, as the store would refuse it: ${o.message}`),{text:`Not saved. ${o.text}`})}async function Dl(r,e,t,o){let n=Sl(e.doc??Wn(),t);if(n===void 0)return{ok:!1,text:"That is no longer on the map."};if("text"in n)return{ok:!1,text:n.text};try{let s=await vr(r.save(n.doc,e.rev));return{ok:!0,read:{doc:n.doc,rev:s.rev},merged:!1}}catch(s){if(br(s))return{ok:!1,retry:!0,text:Po,sent:n.doc};if(qe(s).code!=="conflict")return{ok:!1,text:Tl(s,n.doc)}}let i;try{i=Oh(await vr(r.get()))}catch(s){return br(s)?{ok:!1,retry:!0,text:Po,sent:o??n.doc}:{ok:!1,text:`Not saved. The map changed on another device and could not be read again. ${yr(s)}`}}for(let s of[o,n.doc])if(s!==void 0&&i.doc!==null&&Un(i.doc,s))return{ok:!0,read:{doc:i.doc,rev:i.rev},merged:!1};let a=Sl(i.doc??Wn(),t);if(a===void 0)return{ok:!1,text:Sh,read:i};if("text"in a)return{ok:!1,text:a.text,read:i};try{let s=await vr(r.save(a.doc,i.rev));return{ok:!0,read:{doc:a.doc,rev:s.rev},merged:!0}}catch(s){return br(s)?{ok:!1,retry:!0,text:Po,sent:a.doc}:{ok:!1,text:Tl(s,a.doc),read:i}}}function Ah(r){return Math.min(3e4,1e3*2**Math.max(0,r-1))}var wr=new Set;function Al(){for(let r of wr)if(r.busy)return!0;return!1}function Ol(r,e){return t=>Un(t,r)?e:void 0}function Lh(r){return r.length===1?r[0]:e=>r.reduce((t,o)=>t===void 0?void 0:o(t),e)}var Gn=class{constructor(e,t,o=()=>{},n=()=>{},i){this.api=e;this.changed=o;this.saved=n;this.state={kind:"saved"};this.queue=[];this.failures=0;this.confirmed=t,this.doc=t.doc,this.history=new os(i)}get busy(){return this.queue.length>0||this.pending!==void 0||this.running!==void 0}get canUndo(){return this.doc!==null&&this.history.canUndo}get canRedo(){return this.doc!==null&&this.history.canRedo}load(e){return this.busy?!1:(this.confirmed=e,this.doc=e.doc,this.history.clear(),this.changed(),!0)}apply(e){let t=this.doc;if(t===null)return!1;let o=this.checked(e(t));return o===void 0?!1:(this.history.push(t),this.doc=o,this.enqueue(e),!0)}begin(e){let t=this.doc??Wn();if(t.floors.length>0)return!1;let o=this.checked(e(t));return o===void 0?!1:(this.doc=o,this.enqueue(e),!0)}undo(){let e=this.doc;if(e===null)return!1;let t=this.history.undo(e);return t===void 0?!1:(this.doc=t,this.enqueue(Ol(e,t)),!0)}redo(){let e=this.doc;if(e===null)return!1;let t=this.history.redo(e);return t===void 0?!1:(this.doc=t,this.enqueue(Ol(e,t)),!0)}retryNow(){this.wake?.()}async idle(){for(;this.running!==void 0;)await this.running}dismissNote(){this.note=void 0,this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed()}checked(e){if(e===void 0)return;let t=Gt(e);if(!t.ok){console.warn(`Home map: an edit was not made, as the store would refuse it: ${t.message}`),this.note={kind:"err",text:t.text},this.changed();return}return t.doc}enqueue(e){this.queue.push(e),wr.add(this),this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed(),this.kick()}kick(){this.running===void 0&&(this.running=this.run().finally(()=>{this.running=void 0,this.queue.length>0||this.pending!==void 0?this.kick():(wr.delete(this),this.changed())}))}pause(e){return new Promise(t=>{let o=setTimeout(i,e),n=this;function i(){clearTimeout(o),n.wake===i&&(n.wake=void 0),t()}this.wake=i})}async run(){for(;this.pending!==void 0||this.queue.length>0;){let e=this.pending??{ops:this.queue.splice(0),sent:void 0};this.pending=void 0,this.state.kind!=="waiting"&&(this.state={kind:"saving"}),this.changed();let t=await Dl(this.api,this.confirmed,Lh(e.ops),e.sent);if(t.ok){this.failures=0,this.state={kind:"saving"},this.confirmed=t.read,this.saved(t.read),t.merged?(this.note={kind:"warn",text:Rl},this.history.clear(),this.doc=this.rebased()):this.queue.length===0&&(this.doc=t.read.doc);continue}if(t.retry===!0){this.pending={ops:e.ops,sent:t.sent??e.sent},this.failures+=1,this.state={kind:"waiting",text:Po},this.changed(),await this.pause(Ah(this.failures));continue}this.failures=0,this.queue=[],this.history.clear(),t.read!==void 0&&(this.confirmed=t.read,this.saved(t.read)),this.doc=this.confirmed.doc,this.note={kind:"err",text:t.text},this.state={kind:"error",text:t.text},this.changed();return}this.state={kind:"saved"}}rebased(){let e=this.confirmed.doc;if(e===null)return null;let t=[];for(let o of this.queue){let n=o(e);if(n===void 0)continue;let i=Gt(n);i.ok&&(e=i.doc,t.push(o))}return this.queue=t,e}};var Ll=To`
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
  .hme-fix-t { flex: 1; display: flex; flex-direction: column; gap: 8px; min-width: 0; }
  .hme-fix-acts { display: flex; gap: 6px; flex-wrap: wrap; }
  .hme-checks .hme-fix + .hme-fix { margin-top: 8px; }

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
    /* As wide as its buttons: a bar placed from the middle of the plan is
     * otherwise held to the half of it right of its left edge, and wraps
     * with room to spare. */
    width: max-content;
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
`;var Eo={plan:{title:"Plan",hint:"The floor from above, with real floors, walls and pools of light."},night:{title:"Night",hint:"A small model at night. Lit rooms glow warm."},warm:{title:"Warm",hint:"Wood floors and cream walls, like a doll house."},lines:{title:"Lines",hint:"Only the lines. Calm and clean."},clay:{title:"Clay",hint:"A soft light model, for light pages."},blueprint:{title:"Blueprint",hint:"White lines on blue paper."},dots:{title:"Dots",hint:"A quiet plan with a dot for each light."}};function Fh(r,e){if(!sn(r))return"Home style";let t=ci(r,e),o=i=>Object.hasOwn(r,Qa[i]),n=[];return o("look")&&n.push(Eo[t.look].title),o("turn")&&n.push(`turned ${t.turn}\xB0`),o("names")&&n.push(t.names?"room names":"no room names"),o("devices")&&n.push(t.devices==="all"?"every device":t.devices==="none"?"no devices":"lights only"),o("furniture")&&n.push(t.furniture?"furniture":"no furniture"),o("glow")&&n.push(t.glow?"glow":"no glow"),`Own look: ${n.join(", ")}`}var Fl=(r,e)=>typeof r=="number"&&Number.isFinite(r)?r:e;function _h(r,e){let t=Zr(r);return Oo(r).flatMap(o=>{if(qt(yt(o))!=="home_map")return[];let n=o,i=Lo(yt(o)),a=e?.floors.find(m=>k(m.id,i)),s=typeof n.homeMapRoomId=="string"?n.homeMapRoomId:void 0,d=s===void 0?void 0:a?.rooms.find(m=>k(m.id,s)),l=`${Fl(o.colSpan,1)}\xD7${Fl(o.rowSpan,1)}`,h=(typeof o.customLabel=="string"&&o.customLabel.trim()!==""?o.customLabel.trim():void 0)??(d?.name?.trim()?`${d.name.trim()} only`:a===void 0||(e?.floors.length??0)<=1?"Home map":K(a));return[{pageId:t,pageName:Ao(r),tileId:typeof o.id=="string"?o.id:"",what:h,size:l,own:sn(n),words:Fh(n,e),look:ci(n,e).look}]})}function _l(r,e){return Object.values(r?.pages??{}).map(o=>o?.item).filter(o=>vt(o)).sort((o,n)=>Ao(o).localeCompare(Ao(n))).flatMap(o=>_h(o,e))}function zl(r){let e=!1;if(!Array.isArray(r.pages))return;let t=r.pages.map(o=>{if(!vt(o)||!Array.isArray(o.items))return o;let n=o.items.map(i=>!vt(i)||qt(yt(i))!=="home_map"||!sn(i)?i:(e=!0,ts(i)));return{...o,items:n}});return e?{...r,pages:t}:void 0}var Vn={width:112,height:68},zh={width:94,height:94,radius:34},jh={width:188,height:94,radius:22},Nh=.9,qn=class{constructor(){this.usesState="idle";this.busy=!1}style(e){let t=Ke(e.doc);return this.turnLive===void 0?t:{...t,turn:this.turnLive}}set(e,t){e.apply(o=>Ja(o,t))}panel(e,t){let o=this.style(e),n=e.hass?.states,i=lo.includes(o.look),a=(s,d,l)=>c`<button type="button" class="hme-chip sel ${d?"on":""}" aria-pressed=${d?"true":"false"} @click=${l}>${s}</button>`;return c`<div class="hme-style-scrim" @pointerdown=${s=>{s.target===s.currentTarget&&t()}}></div>
      <div class="hme-style-pop" role="dialog" aria-label="Home style">
        <header class="hme-style-head">
          <strong>Home style</strong>
          <span>How every map tile looks, unless a tile picks its own</span>
          <button type="button" class="hme-x hme-style-close" aria-label="Close" title="Close (Esc)" @click=${t}>✕</button>
        </header>

        ${D("Look",c`<div class="hme-looks four">
          ${Dr.map(s=>{let d=s===o.look,l=Dt({floor:e.floor,states:n,...o,look:s,names:!1,width:Vn.width,height:Vn.height});return c`<button type="button" class="hme-look ${d?"on":""}" aria-pressed=${d?"true":"false"} title=${Eo[s].hint}
              @click=${()=>this.set(e,{look:s})}>
              <svg viewBox=${`0 0 ${Vn.width} ${Vn.height}`} style=${`background:${We(s,.5)}`} aria-hidden="true">${l}</svg>
              <span>${Eo[s].title}</span></button>`})}
        </div>
        <p class="hme-foot">Plan and Dots draw the floor from above. The other five draw it as a small model you can turn.</p>`)}

        <div class="hme-style-row">
          ${D("Show",c`
            <div class="hme-r"><span class="hme-l">Room names</span>${a(o.names?"Shown":"Hidden",o.names,()=>this.set(e,{names:!o.names}))}</div>
            <div class="hme-r"><span class="hme-l">Devices</span><div class="hme-chips">
              ${a("Lights",o.devices==="lights",()=>this.set(e,{devices:"lights"}))}
              ${a("All",o.devices==="all",()=>this.set(e,{devices:"all"}))}
              ${a("None",o.devices==="none",()=>this.set(e,{devices:"none"}))}</div></div>
            <div class="hme-r"><span class="hme-l">Furniture</span>${a(o.furniture?"Shown":"Hidden",o.furniture,()=>this.set(e,{furniture:!o.furniture}))}</div>
            <div class="hme-r"><span class="hme-l">Light glow</span>${a(o.glow?"On":"Off",o.glow,()=>this.set(e,{glow:!o.glow}))}</div>
            <div class="hme-r"><span class="hme-l">Turn</span>
              <input class="hme-range" type="range" min="-180" max="180" step="1" .value=${X(String(o.turn))} ?disabled=${!i} aria-label="Turn the model"
                style=${ze(o.turn,-180,180)}
                @input=${s=>{this.turnLive=Number(s.target.value),e.redraw()}}
                @change=${s=>{this.turnLive=void 0,this.set(e,{turn:Number(s.target.value)})}} />
              <span class="hme-val mono hme-w48">${i?`${o.turn}\xB0`:"flat"}</span></div>`,void 0,"hme-grow-card")}
          ${D("Preview",c`<div class="hme-style-tiles">
            ${this.face(e,o,zh,"Watch tile 2 \xD7 2")}
            ${this.face(e,o,jh,"iPhone tile 4 \xD7 2")}
          </div>`,Eo[o.look].title,"hme-grow-card")}
        </div>

        ${this.usesCard(e)}
      </div>`}face(e,t,o,n){let i=Nh,a=e.hass?.states,s=Os(o.width,o.height),d=Dt({floor:e.floor,states:a,...t,width:s.width,height:s.height,tileHeight:o.height,icons:e.icons}),l=Ro(e.floor,a),p=6*i;return c`<figure class="hme-fr">
      <div class="hme-face" style=${`width:${o.width*i}px;height:${o.height*i}px;border-radius:${o.radius*i}px;background:${We(t.look,i)}`}>
        <svg viewBox=${`0 0 ${s.width} ${s.height}`} aria-hidden="true"
          style=${`left:${s.x*i}px;top:${s.y*i}px;width:${s.width*i}px;height:${s.height*i}px`}>${d}</svg>
        ${o.height>90?c`<span class="hme-face-title" style=${`left:${p}px;top:${p}px;font-size:${11*i}px;color:${Rs(t.look)}`}>${Kh(e.floor)}</span>`:b}
        <span class="hme-face-words" style=${`left:${p}px;bottom:${p}px;font-size:${10*i}px;color:${Ds(t.look,l>0)}`}>${Do(l)}</span>
      </div>
      <figcaption>${n}</figcaption>
    </figure>`}leave(){this.turnLive=void 0,this.usesState="idle",this.message=void 0}look(e){return Ke(e.doc).look}loadUses(e){let t=e.hass;this.usesState!=="idle"||t===void 0||(this.usesState="loading",Es(t).then(o=>{this.summary=o,this.usesState="done",e.redraw()},()=>{this.usesState="error",e.redraw()}))}usesCard(e){if(this.loadUses(e),this.usesState!=="done")return D("Used on",c`<p class="hme-text dim">${this.usesState==="error"?"Could not read your pages.":"Reading your pages\u2026"}</p>`);let t=_l(this.summary,e.doc),o=t.filter(n=>n.own);return D(`Used on ${F(t.length,"tile")}`,c`
      ${t.length===0?c`<p class="hme-text dim">No page has a Home map tile yet. Add one from a page's Add tile.</p>`:b}
      ${t.map(n=>this.useRow(e,n))}
      ${o.length===0?b:c`<button type="button" class="hme-tb hme-wide" ?disabled=${this.busy}
        @click=${()=>{this.useHomeStyleOnAll(e,o)}}>${this.busy?"Saving\u2026":`Use the home style on all ${o.length}`}</button>`}
      ${this.message===void 0?b:c`<p class="hme-text dim" role="status">${this.message}</p>`}`)}useRow(e,t){return c`<div class="hme-use">
      <i style=${`background:${We(t.look,.2)}`}></i>
      <div><span>${t.pageName} · ${t.what} ${t.size}</span><small>${t.words}</small></div>
      ${e.openPage===void 0?b:c`<button type="button" class="hme-tb" @click=${()=>e.openPage?.(t.pageId)}>Edit</button>`}
    </div>`}async useHomeStyleOnAll(e,t){let o=e.hass;if(o===void 0||this.busy)return;let n=[...new Set(t.map(s=>s.pageId))];if(!await e.confirm({title:`Use the home style on ${F(t.length,"tile")}?`,text:`Their own looks come off, so each draws the home style. ${n.length===1?"The page is":`The ${n.length} pages are`} saved for every watch and ${bt("iPhone","phone")} that shows ${n.length===1?"it":"them"}.`,ok:"Use the home style"}))return;this.busy=!0,this.message=void 0,e.redraw();let a=0;for(let s of n)try{let d=await Cs(o,"pages",s),l=zl(d.document);l!==void 0&&await Ts(o,"pages",s,d.revision,l)}catch{a+=1}this.busy=!1,this.message=a===0?"Done: those tiles follow the home style now.":`${F(a,"page")} could not be saved. Try again, or open ${a===1?"it":"them"} to see why.`,this.usesState="idle",e.redraw()}};function Kh(r){return r.name.trim()===""?"Home map":r.name.trim()}var Wh={dir:[0,1,0],sun:0,sky:0,warm:0},Bh=(()=>{let[r,e,t]=[-2,6.5,8],o=Math.hypot(r,e,t);return{dir:[r/o,e/o,t/o],sun:1,sky:1,warm:0}})();function Mr(r,e,t){let o=Math.max(0,Math.min(1,(t-r)/(e-r)));return o*o*(3-2*o)}function kr(r){let e=r?.["sun.sun"]?.attributes,t=e?.azimuth,o=e?.elevation;if(!(typeof t!="number"||!Number.isFinite(t)||typeof o!="number"||!Number.isFinite(o)))return{azimuth:t,elevation:o}}function Uh(r,e){let t=(r.azimuth+e)*Math.PI/180,o=Math.max(r.elevation,0)*Math.PI/180;return{dir:[Math.cos(o)*Math.sin(t),Math.sin(o),-Math.cos(o)*Math.cos(t)],sun:Mr(0,12,r.elevation),sky:Mr(-6,10,r.elevation),warm:1-Mr(2,25,r.elevation)}}function jl(r,e){let t=r?.north??0,o=r?.floors.reduce((i,a)=>i===void 0||a.story<i.story?a:i,void 0),n=o===void 0||o.id.toUpperCase()===e.id.toUpperCase()?0:e.place?.turn??0;return((t+n)%360+360)%360}function Nl(r,e,t){return r==="day"?Bh:r==="now"&&e!==void 0?Uh(e,t):Wh}var Gh="Update the HouseLit integration to see the home map here.",Vh="No home map yet",qh="Start a map by hand";var Xh=4,Yh=140;function Zh(r){return r.kind==="saving"?"Saving\u2026":r.kind==="waiting"?r.text:r.kind==="error"?"Not saved":"Saved"}typeof window<"u"&&window.addEventListener("beforeunload",r=>{Al()&&(r.preventDefault(),r.returnValue="")});var Kl={night:"Night",warm:"Warm",lines:"Lines",clay:"Clay",blueprint:"Blueprint"},Wl={now:"Now",night:"Lights",day:"Daylight"},A=class extends xr{constructor(){super(...arguments);this.narrow=!1;this.icons=void 0;this.iconsTick=0;this.capable=!1;this.bundleUrl=void 0;this.onHome=void 0;this.onOpenPage=void 0;this.owners=[];this.phones=!1;this.unsupported=!1;this.loading=!1;this.styleOpen=!1;this.viewKind="both";this.splitStack=!1;this.split=Zs();this.tipsShown=Js();this.artScale=0;this.stageSize={width:0,height:0};this.toggles={snap:!0,grid:!1,measure:!1,live:!0,scan:!1};this.measure={};this.floorMenu=!1;this.model3d=!0;this.skyChoice="now";this.spaceHeld=!1;this.tick=0;this.page=new _n;this.stylePanel=new qn;this.pageStep=new Kn(()=>{this.tick++});this.addDialog=new Nn(this.page.devices,(t,o,n)=>this.page.arrange.piecePic(t,o,n));this.loadSeq=0;this.askedOnce=!1;this.needFit=!0;this.userMoved=!1;this.touches=new Map;this.artKey="";this.artHeld=b;this.loading3d=!1;this.quality3d=ks();this.slow3d=!1;this.lost3d=!1;this.keysOpen=!1;this.checking=!1;this.onReconnect=()=>{this.session?.retryNow(),this.recheck()};this.onVisible=()=>{typeof document<"u"&&document.visibilityState!=="visible"||(this.session?.retryNow(),this.recheck())};this.onKey=t=>{if(this.dialog!==void 0||this.addOpen!==void 0||this.session===void 0||this.renderRoot?.querySelector?.(".hme-sheet")!=null)return;let o=(typeof t.composedPath=="function"?t.composedPath()[0]:void 0)??t.target;if(Hi(o))return;let n=oe(t,!1);if(this.keysOpen){(t.key==="Escape"||n==="help")&&(t.preventDefault?.(),this.closeKeys());return}if(n==="undo"||n==="redo"){t.preventDefault?.(),n==="undo"?this.undo():this.redo();return}if(this.styleOpen){t.key==="Escape"&&this.closeStyle();return}if(Bs(o))return;if(n==="help"){t.preventDefault?.(),this.openKeys();return}if(t.key==="Escape"&&this.closeMenus())return;if(t.key===" "&&!t.repeat){this.spaceHeld=!0,t.preventDefault?.();return}if(typeof n=="object"&&"letter"in n&&n.letter==="a"&&!this.page.devices.choosing){t.preventDefault?.(),this.openAdd();return}if(typeof n=="object"&&"letter"in n&&n.letter==="z"&&this.viewKind!=="model"){t.preventDefault?.(),this.fitPicked();return}let i=this.context(),a=n==="copy"||n==="paste"||n==="duplicate";if(i!==void 0&&(this.viewKind!=="model"||a)&&this.page.keyDown?.(i,t)===!0){t.preventDefault?.();return}switch(n){case"cancel":this.floorMenu?this.floorMenu=!1:this.toggles.measure?this.setToggle("measure",!1):this.selection=void 0;return;case"zoomIn":this.zoomBy(ho);return;case"zoomOut":this.zoomBy(1/ho);return;case"fit":this.fit();return}};this.onAnyDown=t=>{let o=typeof t.composedPath=="function"?t.composedPath():[],n=i=>o.some(a=>typeof a.matches=="function"&&a.matches(i));this.dockMenu!==void 0&&!n(".hme-dock-pop, [data-hme-menu]")&&(this.dockMenu=void 0),this.floorMenu&&!n(".hme-floor-wrap")&&(this.floorMenu=!1),this.page.drawOpen&&!n(".hme-drawlist, .hme-rtool-draw")&&(this.page.drawOpen=!1,this.requestUpdate())};this.onKeyUp=t=>{t.key===" "&&(this.spaceHeld=!1)}}homeDevices(){let t=this.hass,o=[t?.states,t?.entities,t?.devices,t?.areas],n=this.devicesHeld;if(n!==void 0&&n.key.every((a,s)=>a===o[s]))return n.list;let i=tt(t);return this.devicesHeld={key:o,list:i},i}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKey),window.addEventListener("keyup",this.onKeyUp),this.addEventListener("pointerdown",this.onAnyDown,!0),typeof document<"u"&&document.addEventListener("visibilitychange",this.onVisible),this.askedOnce&&(this.load(!0),this.listen())}disconnectedCallback(){super.disconnectedCallback(),this.pageStep.stop(),window.removeEventListener("keydown",this.onKey),window.removeEventListener("keyup",this.onKeyUp),this.removeEventListener("pointerdown",this.onAnyDown,!0),typeof document<"u"&&document.removeEventListener("visibilitychange",this.onVisible),this.stopListening(),this.endDrag?.(),this.observer?.disconnect(),this.observed=void 0,this.zoomTimer!==void 0&&clearTimeout(this.zoomTimer),this.loadSeq++,this.drop3d()}willUpdate(t){this.hass&&this.capable&&!this.askedOnce&&(this.askedOnce=!0,this.load()),this.askedOnce&&this.listen(),this.pageStep.owners=this.owners,this.pageStep.phones=this.phones,this.askedOnce&&this.pageStep.follow(this.hass);let o=this.baseFloor();this.needFit&&o!==void 0&&this.stageSize.width>0&&this.fit()}updated(){let t=this.renderRoot.querySelector?.(".hme-dialog");t instanceof Element&&t!==this.focusedDialog?(this.focusedDialog=t,(t.querySelector("input")??t.querySelector(".primary"))?.focus?.(),t.querySelector("input")?.select?.()):t===null&&(this.focusedDialog=void 0);let o=this.renderRoot.querySelector?.(".hme-stage");o instanceof Element&&o!==this.observed&&typeof ResizeObserver<"u"&&(this.observer??=new ResizeObserver(n=>{let i=n[n.length-1]?.contentRect;i!==void 0&&this.resizeStage(i.width,i.height)}),this.observed!==void 0&&this.observer.unobserve(this.observed),this.observer.observe(o),this.observed=o),this.syncSplit(),this.view!==void 0&&this.view.scale!==this.artScale&&this.zoomTimer===void 0&&(this.zoomTimer=setTimeout(()=>{this.zoomTimer=void 0,this.view!==void 0&&(this.artScale=this.view.scale)},Yh)),this.sync3d()}input3d(){let t=this.shownFloor();if(t===void 0)return;let o=this.selection,n=De(o),i=pe(o),a=n.length>0?{things:n}:o?.kind==="wall"||o?.kind==="opening"?{piece:o}:i===void 0?void 0:{roomId:i},s=kr(this.hass?.states),d=jl(this.doc===null?null:{...this.doc,north:this.northLive??this.doc.north},t);return{floor:t,states:this.toggles.live?this.hass?.states:void 0,mark:a,sky:Nl(this.skyChoiceNow(s),s,d),stairsDown:this.stairsDown(t)}}syncSplit(){if(this.viewKind!=="both")return;let t=this.renderRoot.querySelector?.(".hme-stage-wrap"),o=this.baseFloor(),n=o===void 0?void 0:ge(o.rooms.flatMap(s=>s.outline));if(!(t instanceof Element)||n===void 0)return;let i=t.getBoundingClientRect(),a=td(i.width,i.height,n.maxX-n.minX,n.maxY-n.minY);a!==this.splitStack&&(this.splitStack=a)}sync3d(){let t=this.renderRoot.querySelector?.(".hme-3d-host"),o=this.input3d();if(!(t instanceof HTMLElement)||o===void 0||this.bundleUrl===void 0){this.drop3d();return}if(this.scene3d!==void 0){this.scene3d.attach(t),this.scene3d.update(o,this.modelTurnNow()),this.scene3d.setHover(this.hoverFor3d()),this.view3d!==void 0&&(this.scene3d.setView(this.view3d),this.view3d=void 0);return}if(this.loading3d||this.failed3d!==void 0)return;this.loading3d=!0;let n=Vi(this.bundleUrl);En().then(i=>{if(this.loading3d=!1,!!this.isConnected){try{if(this.scene3d===void 0){let a=this.quality3dNow(),s=new i.HomeMapScene3D(n,a,this.quality3d==="auto"&&a==="high");s.onPick=(d,l)=>this.pick3d(d,l),s.onHover=d=>this.hover3d(d),s.onFaceDrag=d=>{let l=this.context();l!==void 0&&this.page.shape.faceDrag(l,d),this.tick++},s.onContextLost=()=>{this.lost3d=!0},s.onContextRestored=()=>this.restart3d(),s.onSlow=()=>{this.slow3d=!0,this.quality3d==="auto"&&this.scene3d?.setQuality(this.quality3dNow()),this.tick++},this.scene3d=s}}catch{this.failed3d="webgl"}this.tick++}},()=>{this.loading3d=!1,this.failed3d="load",this.tick++})}quality3dNow(){return ws(this.quality3d,Ms(this.slow3d))}setQuality3d(t){this.quality3d=t,$s(t),this.scene3d?.setQuality(this.quality3dNow())}restart3d(){this.scene3d!==void 0&&(this.view3d=this.scene3d.view()),this.drop3d(),this.lost3d=!1,this.tick++}pick3d(t,o={add:!1}){if(this.dialog!==void 0)return;this.floorMenu=!1;let n=this.baseFloor(),i=t?.kind==="pin"&&n!==void 0?we(n,t.pinId):void 0,a=i===void 0?t:{kind:"object",roomId:i.roomId,object:i.object};if(o.add){a?.kind==="object"?this.select(st(this.selection,{roomId:a.roomId,object:a.object})):a?.kind==="pin"&&this.select(Rt(this.selection,a.pinId));return}let s=this.context();if(s!==void 0){if(a?.kind==="opening"&&this.page.doors.pickDoor(s,a.roomId,a.opening))return;this.page.doors.stop(s)}this.select(a),a?.kind==="opening"&&s!==void 0&&this.page.doors.clicked(this.context()??s,a.roomId,a.opening)}drop3d(){this.scene3d?.dispose(),this.scene3d=void 0,this.lost3d=!1}setHover(t){Ot(t,this.hover)||(this.hover=t)}hover3d(t){if(this.dialog!==void 0){this.setHover(void 0);return}this.setHover(t?.kind==="pin"?cn(this.baseFloor(),{kind:"pin",pinId:t.pinId}):t)}hoverFor3d(){let t=Ki(this.hover,this.selection);if(t!==void 0)return t.kind==="pin"?{kind:"pin",pinId:t.pinId}:t.kind==="object"?{kind:"object",roomId:t.roomId,object:t.object}:t.kind==="wall"?{kind:"wall",roomId:t.roomId,wall:t.wall}:t.kind==="opening"?{kind:"opening",roomId:t.roomId,opening:t.opening}:t.kind==="room"?{kind:"room",roomId:t.roomId}:void 0}planHoverAt(t,o,n){if(o.pointerType==="touch"||this.spaceHeld||this.dialog!==void 0||this.page.tool(t)!=="pick"||this.page.devices.choosing)return;let i=o.target;if(!(typeof i?.closest=="function"&&i.closest("[data-hme=turn], [data-hme=resize], [data-hme^=corner], [data-hme^=mid], [data-hme^=end]")!==null))return xd(t.floor,t.toScreen,n,pe(t.selection))}turnBack(){this.modelTurn=void 0,this.scene3d?.frameFloor(Ke(this.doc).turn??ki)}async load(t=!1){let o=this.hass;if(!o||!this.capable)return;let n=++this.loadSeq;t||(this.loading=this.session===void 0,this.loadError=void 0);try{let i=await So(o);if(n!==this.loadSeq)return;this.unsupported=!1,this.loadError=void 0,this.show({doc:Vt(i?.doc)??null,rev:typeof i?.rev=="number"?i.rev:0}),this.loadScans()}catch(i){if(n!==this.loadSeq)return;let{code:a}=qe(i);a==="unknown_command"?this.unsupported=!0:(!t||this.session===void 0)&&(this.loadError=yr(i))}this.loading=!1}async loadScans(){let t=this.hass;if(t)try{this.scans=await Vr(t)}catch{}}libraryPages(){let t=this.pageStep.library;return t===void 0?[]:(this.pagesHeld?.lib!==t&&(this.pagesHeld={lib:t,pages:Jr(t,"pages").map(o=>({id:o.id,name:o.name}))}),this.pagesHeld.pages)}show(t){let o=this.hass;if(o&&Yn(o,t),this.session===void 0)this.session=new Gn(Il(this.hassOrThrow()),t,()=>{this.afterChange(),this.catchUp()},n=>{this.hass&&Yn(this.hass,n)}),this.needFit=!0;else if(!this.session.load(t))return;this.afterChange()}listen(){let t=this.hass,o=t?.connection;if(t===void 0||o===void 0||!this.capable||!this.isConnected||o===this.listenedTo)return;this.stopListening(),this.listenedTo=o;let n=o;typeof n.addEventListener=="function"&&(n.addEventListener("ready",this.onReconnect),this.readyConnection=n),typeof o.subscribeMessage=="function"&&(this.unsubscribe=Er(t,i=>this.heard(i)).catch(()=>{}))}stopListening(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0,this.listenedTo=void 0;let t=this.unsubscribe;this.unsubscribe=void 0,t?.then(o=>o?.()).catch(()=>{})}heard(t){this.heardRev=t,this.catchUp()}catchUp(){let t=this.session,o=this.heardRev;if(!(t===void 0||o===void 0||t.busy||this.checking)){if(o===t.confirmed.rev){this.heardRev=void 0;return}this.recheck()}}async recheck(){let t=this.hass,o=this.session;if(t===void 0||o===void 0||!this.capable||o.busy||this.checking)return;this.checking=!0;let n=this.heardRev,i=!1;try{let a=await Pr(t,o.confirmed.rev);i=!0,a!==void 0&&this.session===o&&!o.busy&&(this.previewDoc=void 0,this.show({doc:Vt(a.doc)??null,rev:typeof a.rev=="number"?a.rev:0}),this.loadScans())}catch{}finally{this.checking=!1}i&&(this.heardRev===n?this.heardRev=void 0:this.catchUp())}hassOrThrow(){let t=this.hass;if(t===void 0)throw new Error("no hass");return t}afterChange(){let t=this.session?.doc?.floors??[];t.some(o=>k(o.id,this.floorId))||(this.floorId=t[0]?.id,this.needFit=!0),$i(this.baseFloor(),this.selection)||(this.selection=void 0),$i(this.baseFloor(),this.hover)||(this.hover=void 0),this.tick++}get doc(){return this.session?.doc??null}baseFloor(){let t=this.doc?.floors??[];return t.find(o=>k(o.id,this.floorId))??t[0]}stairsDown(t){let o=(this.doc?.floors??[]).map(n=>k(n.id,t.id)?t:n);return sa(o.some(n=>k(n.id,t.id))?o:[...o,t],t.id)}shownFloor(){let t=this.baseFloor();return t===void 0||this.previewDoc===void 0?t:this.previewDoc.floors.find(o=>k(o.id,t.id))??t}apply(t,o={}){let n=this.session;return n===void 0?!1:(this.previewDoc=void 0,n.apply(t)?(o.floorId!==void 0&&(this.floorId=o.floorId),o.select!==void 0&&(this.selection=cn(this.baseFloor(),o.select??void 0)),this.afterChange(),!0):(this.tick++,!1))}preview(t){let o=this.doc;this.previewDoc=t===void 0||o===null?void 0:t(o)??this.previewDoc,this.tick++}undo(){this.previewDoc=void 0,this.session?.undo()===!0&&this.afterChange()}redo(){this.previewDoc=void 0,this.session?.redo()===!0&&this.afterChange()}select(t){this.selection=cn(this.baseFloor(),t)}setFloor(t){let o=this.context();o!==void 0&&this.page.leave?.(o),this.floorId=t,this.selection=void 0,this.floorMenu=!1,this.measure={},this.needFit=!0,this.userMoved=!1}setToggle(t,o){this.toggles={...this.toggles,[t]:o},t==="measure"&&(this.measure={}),t==="scan"&&o&&this.loadScans()}confirm(t){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(o=>{this.dialog={kind:"confirm",...t,done:n=>{this.dialog=void 0,o(n)}}})}ask(t){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(o=>{this.dialog={kind:"ask",...t,done:n=>{this.dialog=void 0,o(n)}}})}resizeStage(t,o){let n=this.stageSize.width===0;this.stageSize={width:t,height:o},(n||!this.userMoved)&&(this.needFit=!0)}fit(){let{width:t,height:o}=this.stageSize;t<=0||(this.view=un(this.baseFloor(),t,o),this.artScale=this.view.scale,this.needFit=!1,this.userMoved=!1)}fitPicked(){let{width:t,height:o}=this.stageSize,n=this.baseFloor();if(t<=0||n===void 0)return;let i=po(n,this.selection);i.length!==0&&(this.view=un({...n,rooms:i,pins:[]},t,o),this.artScale=this.view.scale,this.needFit=!1,this.userMoved=!0)}zoomBy(t,o){this.view!==void 0&&(this.view=xi(this.view,t,o??[this.stageSize.width/2,this.stageSize.height/2]),this.userMoved=!0)}context(){let t=this.doc,o=this.shownFloor();if(t===null||o===void 0)return;let n=this.view??{scale:40,ox:0,oy:0},i=this.session;return{hass:this.hass,icons:this.icons,doc:t,floor:o,selection:this.selection,view:n,stage:this.stageSize,toggles:this.toggles,pages:this.libraryPages(),areas:Gr(this.hass),scans:this.scans,furnitureBase:this.bundleUrl===void 0?void 0:Vi(this.bundleUrl),canUndo:i?.canUndo??!1,canRedo:i?.canRedo??!1,toScreen:a=>js(n,a),px:a=>a*n.scale,toPlan:(a,s)=>this.toPlan(a,s),apply:(a,s)=>this.apply(a,s),preview:a=>this.preview(a),select:a=>this.select(a),setFloor:a=>this.setFloor(a),setToggle:(a,s)=>this.setToggle(a,s),drag:(a,s)=>this.drag(a,s),undo:()=>this.undo(),redo:()=>this.redo(),confirm:a=>this.confirm(a),ask:a=>this.ask(a),newId:()=>wt(),note:(a,s)=>{this.session!==void 0&&(this.session.note={kind:a,text:s}),this.tick++},redraw:()=>{this.tick++},hover:this.hover,setHover:a=>this.setHover(a),openAdd:(a,s)=>this.openAdd(a,s),openPage:this.onOpenPage,devices:this.homeDevices(),pageStep:this.pageStep,roomNameBoxes:()=>this.labelsHeld?.taken??[]}}openAdd(t="devices",o){let n=this.context();n!==void 0&&(this.floorMenu=!1,this.styleOpen&&this.closeStyle(),this.addDialog.open(n,t,o),this.addOpen=t)}closeAdd(){this.addOpen!==void 0&&(this.addOpen=void 0,this.updateComplete.then(()=>{this.renderRoot?.querySelector?.(".hme-add-btn")?.focus?.()}))}toPlan(t,o){let n=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return Be(this.view??{scale:40,ox:0,oy:0},[t-n.left,o-n.top])}stagePoint(t){let o=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return[t.clientX-o.left,t.clientY-o.top]}drag(t,o){let n=this.stageEl;if(n===void 0)return;this.endDrag?.();let i=t.clientX,a=t.clientY,s=!1,d,l=0,p=typeof requestAnimationFrame=="function"?requestAnimationFrame:void 0,h=()=>{l=0,d!==void 0&&o.move(this.toPlan(d.clientX,d.clientY),d)};try{n.setPointerCapture?.(t.pointerId)}catch{}let m=w=>{let y=w;y.pointerId===t.pointerId&&(!s&&Math.hypot(y.clientX-i,y.clientY-a)<Xh||(s=!0,d=y,p===void 0?h():l===0&&(l=p(h))))},u=w=>{let y=w;y.pointerId===t.pointerId&&(f(),l!==0&&(cancelAnimationFrame(l),h()),o.end(this.toPlan(y.clientX,y.clientY),y,s))},f=()=>{n.removeEventListener("pointermove",m),n.removeEventListener("pointerup",u),n.removeEventListener("pointercancel",u);try{n.releasePointerCapture?.(t.pointerId)}catch{}this.endDrag===g&&(this.endDrag=void 0)},g=()=>{f(),l!==0&&(cancelAnimationFrame(l),l=0),o.cancel?.()};n.addEventListener("pointermove",m),n.addEventListener("pointerup",u),n.addEventListener("pointercancel",u),this.endDrag=g}onStageDown(t){if(this.stageEl=t.currentTarget,this.floorMenu=!1,this.dockMenu=void 0,this.setHover(void 0),this.dialog!==void 0)return;if(t.pointerType==="touch"&&(this.touches.set(t.pointerId,[t.clientX,t.clientY]),this.touches.size===2)){this.endDrag?.(),this.preview(void 0),this.pinch();return}if(this.viewKind==="model"){this.turnModel(t);return}if(t.button===1||this.spaceHeld){t.preventDefault?.(),this.pan(t,!1);return}if(t.button!==0)return;let o=this.context();if(o===void 0)return;if(this.toggles.measure){let i=this.toPlan(t.clientX,t.clientY),a=this.measure;this.measure=a.a===void 0||a.b!==void 0?{a:i}:{a:a.a,b:i};return}let n=this.toPlan(t.clientX,t.clientY);if(this.page.pointerDown?.(o,t,n)===!0){t.preventDefault?.();return}this.pan(t,!0)}onStageMove(t){if(this.stageEl=t.currentTarget,this.touches.has(t.pointerId)&&this.touches.set(t.pointerId,[t.clientX,t.clientY]),t.buttons!==0||this.viewKind==="model"){this.setHover(void 0);return}let o=this.toPlan(t.clientX,t.clientY);this.toggles.measure&&this.measure.a!==void 0&&this.measure.b===void 0&&(this.measure={...this.measure,hover:o});let n=this.context();n!==void 0&&(this.page.hover?.(n,o),this.setHover(this.planHoverAt(n,t,o)))}onStageLeave(){this.setHover(void 0);let t=this.context();t!==void 0&&this.page.hover?.(t,void 0)}onStageUp(t){this.touches.delete(t.pointerId)}onStageDrag(t){this.stageEl=t.currentTarget;let o=this.context();o===void 0||this.viewKind==="model"||this.dialog!==void 0||this.page.dragOver?.(o,this.toPlan(t.clientX,t.clientY),t)===!0&&(t.preventDefault?.(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"))}onStageDragLeave(t){let o=t.relatedTarget,n=t.currentTarget;if(o!==null&&n!==null&&typeof n.contains=="function"&&n.contains(o))return;let i=this.context();i!==void 0&&this.page.dragOver?.(i,void 0,t)}onStageDrop(t){this.stageEl=t.currentTarget;let o=this.context();o===void 0||this.viewKind==="model"||(t.preventDefault?.(),this.page.drop?.(o,this.toPlan(t.clientX,t.clientY),t))}pan(t,o){let n=this.view;if(n===void 0)return;let i=t.clientX,a=t.clientY;this.drag(t,{move:(s,d)=>{this.view={...n,ox:n.ox+d.clientX-i,oy:n.oy+d.clientY-a},this.userMoved=!0},end:(s,d,l)=>{!l&&o&&(this.selection=void 0)}})}pinch(){let t=this.stageEl,o=this.view,n=[...this.touches.keys()];if(t===void 0||o===void 0||n.length<2)return;let i=()=>n.map(u=>this.touches.get(u)),[a,s]=i(),d=Math.max(Math.hypot(s[0]-a[0],s[1]-a[1]),1),l=t.getBoundingClientRect(),p=[(a[0]+s[0])/2-l.left,(a[1]+s[1])/2-l.top],h=u=>{let f=u;if(!this.touches.has(f.pointerId))return;this.touches.set(f.pointerId,[f.clientX,f.clientY]);let[g,w]=i(),y=Math.max(Math.hypot(w[0]-g[0],w[1]-g[1]),1),M=[(g[0]+w[0])/2-l.left,(g[1]+w[1])/2-l.top],$=xi(o,y/d,p);this.view={...$,ox:$.ox+M[0]-p[0],oy:$.oy+M[1]-p[1]},this.userMoved=!0},m=u=>{this.touches.delete(u.pointerId),t.removeEventListener("pointermove",h),t.removeEventListener("pointerup",m),t.removeEventListener("pointercancel",m)};t.addEventListener("pointermove",h),t.addEventListener("pointerup",m),t.addEventListener("pointercancel",m)}turnModel(t){let o=this.modelTurnNow(),n=t.clientX;this.drag(t,{move:(i,a)=>{let s=o+(a.clientX-n)*.5;s=((s+180)%360+360)%360-180,this.modelTurn=Math.round(s)},end:()=>{}})}modelTurnNow(){return this.modelTurn??Ke(this.doc).turn??ki}modelLookNow(){if(this.modelLook!==void 0)return this.modelLook;let t=Ke(this.doc).look;return lo.includes(t)?t:"night"}onWheel(t){if(this.viewKind==="model"||this.view===void 0)return;this.stageEl=t.currentTarget,t.preventDefault?.();let o=t.deltaMode===1?16:t.deltaMode===2?400:1;if(t.ctrlKey||t.metaKey){this.zoomBy(Math.exp(-t.deltaY*o*.0025),this.stagePoint(t));return}this.view={...this.view,ox:this.view.ox-t.deltaX*o,oy:this.view.oy-t.deltaY*o},this.userMoved=!0}closeMenus(){let t=this.dockMenu!==void 0||this.page.drawOpen||this.floorMenu;return this.dockMenu=void 0,this.floorMenu=!1,this.page.drawOpen&&(this.page.drawOpen=!1,this.requestUpdate()),t}openKeys(){this.floorMenu=!1,this.dockMenu=void 0,this.spaceHeld=!1,this.keysOpen=!0,this.updateComplete.then(()=>{this.renderRoot?.querySelector?.(".hme-keys-box .hme-keys-done")?.focus?.()})}closeKeys(){this.keysOpen=!1}renderKeys(){if(!this.keysOpen)return b;let t=ur($e());return c`<div class="hme-scrim" @pointerdown=${o=>{o.target===o.currentTarget&&this.closeKeys()}}>
      <div class="hme-keys-box" role="dialog" aria-modal="true" aria-labelledby="hme-keys-title">
        <div class="hme-keys-top"><h3 id="hme-keys-title">Keys</h3><span class="hme-flex"></span>
          <button type="button" class="hme-tb hme-keys-done" @click=${()=>this.closeKeys()}>Done</button></div>
        <div class="hme-keys-groups">
          ${t.map(o=>c`<section class="hme-keys-group" aria-label=${o.title}><h4>${o.title}</h4>
            <dl class="hme-keys">${o.keys.map(([n,i])=>c`<dt><kbd>${n}</kbd></dt><dd>${i}</dd>`)}</dl></section>`)}
        </div>
      </div>
    </div>`}toggleStyle(){if(this.styleOpen){this.closeStyle();return}this.floorMenu=!1,this.styleOpen=!0}closeStyle(){this.styleOpen=!1,this.stylePanel.leave()}render(){if(this.tick,!this.capable||this.unsupported)return this.calm(c`<b>${Gh}</b>`);if(this.loadError!==void 0)return this.calm(c`<span>Could not read the home map. ${this.loadError}</span>
        <button class="hme-tb" @click=${()=>{this.load()}}>Try again</button>`);if(this.loading||this.session===void 0)return this.calm(c`Loading…`);let t=this.doc;if(t===null||t.floors.length===0)return this.renderFirstRun();let o=this.context(),n=this.session.note;return c`<div class="hme">
      ${this.renderBar(t,o)}
      ${n===void 0?b:c`<div class="hme-note ${n.kind}" role="status"><span>${n.text}</span>
        <button class="hme-link" @click=${()=>this.session?.dismissNote()}>Dismiss</button></div>`}
      <div class=${this.tipsShown?"hme-body tips":"hme-body"}>
        <aside class="hme-insp" aria-label="Side panel">
          ${this.page.inspector(o)}
          <button type="button" class="hme-link hme-tips-link" aria-pressed=${this.tipsShown?"true":"false"} @click=${()=>this.toggleTips()}>${this.tipsShown?"Hide tips":"Show tips"}</button>
        </aside>
        <section class="hme-stage-wrap ${this.viewKind==="both"&&this.splitStack?"stack":""}" style=${`--hme-split:${this.split}%`}>${this.renderStage(o)}</section>
      </div>
      ${this.page.sheet?.(o)??b}
      ${this.renderDialog()}
      ${this.addOpen===void 0?b:this.addDialog.render(o,()=>this.closeAdd())}
      ${this.renderKeys()}
    </div>`}calm(t){return c`<div class="hme-calm"><div class="hme-empty">${t}</div></div>`}renderFirstRun(){let t=this.session?.note;return c`<div class="hme-calm"><div class="hme-empty hme-first">
      <b>${Vh}</b>
      ${t===void 0?b:c`<span class="hme-first-note ${t.kind}" role="status">${t.text}</span>`}
      <button type="button" class="hme-tb primary hme-start-btn" @click=${()=>this.startByHand()}>${qh}</button>
      <span class="hme-first-line">${As}</span>
      ${this.onHome===void 0?b:c`<button type="button" class="hme-link" @click=${()=>this.onHome?.()}>‹ Shared</button>`}
    </div></div>`}startByHand(){let t=this.session;if(t===void 0)return;let o=wt(),n=ba(this.hass?.floors);if(!t.begin(a=>va(a,{id:o,name:n.name,story:n.story})))return;t.note=void 0,this.floorId=o,this.selection=void 0,this.needFit=!0,this.userMoved=!1,this.afterChange();let i=this.context();i!==void 0&&this.page.startDrawing(i)}renderBar(t,o){let n=this.baseFloor(),i=this.session?.state??{kind:"saved"},a=$e(),s=Ke(t).look;return c`<header class="hme-bar">
      ${this.onHome===void 0?b:c`<button type="button" class="hme-back" @click=${()=>this.onHome?.()}>‹ Shared</button><span class="hme-vsep"></span>`}
      <strong class="hme-title">Home map</strong><span class="hme-beta">ALPHA</span>
      <div class="hme-floor-wrap">
        <button type="button" class="hme-tb hme-floor-btn" aria-label="Switch floor" aria-haspopup="menu" aria-expanded=${this.floorMenu?"true":"false"}
          @click=${()=>{this.floorMenu=!this.floorMenu}}>
          ${Di(n)}
          <span class="hme-floor-t"><span>${K(n)}</span><small>${F(n.rooms.length,"room")} · ${F(new Set(n.pins.map(d=>d.entityId)).size,"device")}</small></span>
          <span class="hme-caret" aria-hidden="true">▾</span>
        </button>
        ${this.floorMenu?this.renderFloorMenu(t,n):b}
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
        ${this.styleOpen?this.stylePanel.panel(o,()=>this.closeStyle()):b}
      </div>
      <button type="button" class="hme-tb hme-icon" aria-label="Undo" title=${`Undo (${a?"\u2318Z":"Ctrl+Z"})`} ?disabled=${!o.canUndo} @click=${()=>this.undo()}>↶</button>
      <button type="button" class="hme-tb hme-icon" aria-label="Redo" title=${`Redo (${a?"\u21E7\u2318Z":"Ctrl+Shift+Z"})`} ?disabled=${!o.canRedo} @click=${()=>this.redo()}>↷</button>
      <span class="hme-status ${i.kind}" role="status" title=${i.kind==="error"?i.text:b}><span class="hme-status-dot"></span>${Zh(i)}</span>
      ${this.renderKeysButton()}
    </header>`}renderKeysButton(){return c`<button type="button" class="hme-tb hme-icon hme-keys-btn ${this.keysOpen?"on":""}" aria-label="Keys" aria-haspopup="dialog"
      aria-expanded=${this.keysOpen?"true":"false"} title="Every key (?)" @click=${()=>this.keysOpen?this.closeKeys():this.openKeys()}>?</button>`}renderStyleButton(t){return c`<button type="button" class="hme-tb hme-style-btn ${this.styleOpen?"on":""}" aria-haspopup="dialog" aria-expanded=${this.styleOpen?"true":"false"}
      title="How every map tile looks, unless a tile picks its own" @click=${()=>this.toggleStyle()}>
      <span class="hme-style-sw" style=${`background:${We(t,.2)}`} aria-hidden="true"></span>Home style</button>`}renderFloorMenu(t,o){return c`<div class="hme-pop" role="menu" aria-label="Floors">
      ${t.floors.map(n=>c`<div class="hme-pop-row ${k(n.id,o.id)?"on":""}">
        <button type="button" role="menuitem" class="hme-pop-main" @click=${()=>this.setFloor(n.id)}>
          ${Di(n)}<span class="hme-floor-t"><span>${K(n)}</span><small>${F(n.rooms.length,"room")} · ${F(new Set(n.pins.map(i=>i.entityId)).size,"device")}</small></span></button>
        <button type="button" class="hme-pop-act" title="Rename" aria-label=${`Rename ${K(n)}`} @click=${()=>{this.renameFloorAsk(n)}}>Rename</button>
        <button type="button" class="hme-pop-act danger" title=${t.floors.length===1?"The map keeps at least one floor":"Delete"} aria-label=${`Delete ${K(n)}`}
          ?disabled=${t.floors.length===1} @click=${()=>{this.deleteFloorAsk(n)}}>Delete</button>
      </div>`)}
      <button type="button" class="hme-pop-add" @click=${()=>{this.addFloorAsk()}}>＋ Add a floor</button>
    </div>`}async addFloorAsk(){this.floorMenu=!1;let t=this.doc;if(t===null)return;let o=Math.max(...t.floors.map(a=>a.story))+1,n=await this.ask({title:"Add a floor",label:"Name",value:o===1?"Upstairs":`Floor ${o+1}`,ok:"Add floor"});if(n===void 0)return;let i=wt();this.apply(a=>ga(a,{id:i,name:n,story:o}),{floorId:i,select:null})&&(this.needFit=!0)}async renameFloorAsk(t){this.floorMenu=!1;let o=await this.ask({title:"Rename floor",label:"Name",value:t.name||K(t),ok:"Rename"});o!==void 0&&this.apply(n=>No(n,t.id,o))}async deleteFloorAsk(t){this.floorMenu=!1,await this.confirm({title:`Delete ${K(t)}?`,text:`Its ${F(t.rooms.length,"room")} and ${F(t.pins.length,"device")} come off the map. Undo brings them back while this page is open.`,ok:"Delete floor",danger:!0})&&this.apply(n=>ya(n,t.id),{select:null})}renderStage(t){let o=this.page,{width:n,height:i}=this.stageSize,a=this.viewKind==="model",s=this.viewKind==="both",d=a?b:o.pill?.(t)??b,l=this.spaceHeld?"grab":a?"ew-resize":this.toggles.measure?"crosshair":o.cursor?.(t)??"default",p=t.floor.rooms.length===0,h=this.model3d&&this.bundleUrl!==void 0,m=s?h?c`<div class="hme-stage model hme-split-r hme-3d">
      ${this.render3d(t)}
      ${this.renderModelDock(!1)}
    </div>`:c`<div class="hme-stage model hme-split-r" style=${`background:${We(this.modelLookNow())}`}>
      <svg class="hme-svg" width="100%" height="100%" viewBox=${`0 0 ${Math.max(n,1)} ${Math.max(i,1)}`} style="cursor:ew-resize"
        role="img" aria-label=${`Model of ${K(t.floor)}`}
        @pointerdown=${u=>this.onModelDown(u)}>
        ${this.renderModel(t,n,i)}
      </svg>
      ${this.renderModelDock(!1)}
    </div>`:b;return a&&h?c`<div class="hme-stage model hme-3d">
        ${this.render3d(t)}
        ${this.renderAddButton()}
        ${this.renderDock(t)}
      </div>`:c`<div class="hme-stage ${a?"model":"rail"} ${s?"hme-split-l":""}" style=${a?`background:${We(this.modelLookNow())}`:""}>
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
        ${a?this.renderModel(t,n,i):this.renderPlan(t,n,i)}
      </svg>
      ${d===b?b:c`<div class="hme-pill beside">${d}</div>`}
      ${a?b:o.stageExtra?.(t)??b}
      ${p&&!a&&!o.arrange.draw.active?c`<div class="hme-stage-empty"><b>No rooms on this floor yet.</b>
        <span>Draw one by hand, or scan this floor with the iPhone.</span>
        <button type="button" class="hme-tb" @click=${()=>{let u=this.context();u&&o.startDrawing(u)}}>＋ Draw a room by hand</button></div>`:b}
      ${this.renderAddButton(d!==b)}
      ${this.renderDock(t)}
    </div>${s?this.renderSplitHandle():b}${m}`}renderAddButton(t=!1){return c`<button type="button" class="hme-add-btn ${t?"compact":""}" aria-haspopup="dialog" aria-expanded=${this.addOpen===void 0?"false":"true"}
      aria-label="Add device or furniture" title="Add a device or a piece of furniture (A)" @click=${()=>this.openAdd()}>
      <span aria-hidden="true">＋</span>${t?"Add":"Add device or furniture"}</button>`}renderSplitHandle(){let t=n=>{let a=n.currentTarget.parentElement?.getBoundingClientRect();a!==void 0&&(this.split=this.splitStack?Ti(n.clientY,a.top,a.height):Ti(n.clientX,a.left,a.width))},o=()=>Qs(this.split);return c`<div class="hme-split-handle" role="separator" tabindex="0" aria-orientation=${this.splitStack?"horizontal":"vertical"}
      aria-label="Size of the plan and the model" aria-valuemin=${Ei} aria-valuemax=${Ci} aria-valuenow=${Math.round(this.split)}
      title="Drag to give the plan or the model more room. Double-click to even them."
      @pointerdown=${n=>{n.currentTarget.setPointerCapture?.(n.pointerId)}}
      @pointermove=${n=>{n.buttons!==0&&t(n)}}
      @pointerup=${o}
      @dblclick=${()=>{this.split=50,o()}}
      @keydown=${n=>{let i=this.splitStack?"ArrowUp":"ArrowLeft",a=this.splitStack?"ArrowDown":"ArrowRight";n.key!==i&&n.key!==a||(n.preventDefault(),n.stopPropagation(),this.split=bn(this.split+(n.key===i?-5:5)),o())}}><span aria-hidden="true"></span></div>`}toggleTips(){this.tipsShown=!this.tipsShown,ed(this.tipsShown)}onModelDown(t){this.dialog!==void 0||t.button!==0||(this.stageEl=t.currentTarget,this.floorMenu=!1,this.dockMenu=void 0,this.turnModel(t))}renderPlan(t,o,n){let i=this.view;if(i===void 0||o<=0)return b;let a=this.planArt(t.floor,o,n,this.page.drawsPins?.(t)===!0?"none":"all"),s=i.scale/(this.artScale||i.scale);return H`${this.background(i,o,n)}
      <g class="hme-art" transform=${`translate(${i.ox.toFixed(2)} ${i.oy.toFixed(2)}) scale(${s.toFixed(5)})`} pointer-events="none">${a}</g>
      <g class="hme-floor-below" pointer-events="none">${Id(t)}</g>
      <g class="hme-open-edges" pointer-events="none">${bd(t)}</g>
      <g class="hme-swing-clashes" pointer-events="none">${bl(t)}</g>
      ${Hd(t.floor,this.hover,this.selection,t.toScreen)}
      <g class="hme-labels" pointer-events="none">${this.labels(t)}</g>
      <g class="hme-overlay">${this.page.overlay(t)}</g>
      ${this.toggles.measure?this.measureMarks(t):b}`}planArt(t,o,n,i){let a=this.toggles.live?this.hass?.states:void 0,s=this.artScale||this.view.scale,d=this.stairsDown(t),l=`${Ul(t)}|${Co(a)}|${s}|${o}|${n}|${this.iconsTick}|${Co(this.icons)}|${i}|${d}`;return l!==this.artKey&&(this.artKey=l,this.artHeld=Dt({floor:t,states:a,look:"plan",names:!1,devices:i,furniture:!0,furnitureLook:p=>vs(p,d),stairsDown:d,oneWall:!0,glow:!0,width:o,height:n,icons:this.icons,frame:{scale:s,ox:0,oy:0}})),this.artHeld}background(t,o,n){let i=le(this.selection)?Ue:He,a=20;if(this.toggles.grid)for(a=i*t.scale;a<8;)a*=10;let s=(t.ox%a+a)%a,d=(t.oy%a+a)%a;return H`<defs><pattern id="hme-bg" width=${a} height=${a} patternUnits="userSpaceOnUse" patternTransform=${`translate(${s.toFixed(1)} ${d.toFixed(1)})`}>
        ${this.toggles.grid?H`<path d=${`M${a} 0V${a}H0`} fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1" />`:H`<circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.09)" />`}
      </pattern></defs>
      <rect class="hme-bg" width=${o} height=${n} fill="url(#hme-bg)" />`}labels(t){let o=t.devices??tt(t.hass),n=`${Ul(t.floor)}|${Co(t.doc)}|${t.view.scale}|${t.view.ox}|${t.view.oy}|${Co(o)}`;if(this.labelsHeld?.key===n)return this.labelsHeld.art;let i=[],a=t.floor.pins.map(d=>({c:t.toScreen(d.at),r:15})),s=t.floor.rooms.map(d=>{let l=Z(d),p=ge(d.outline);if(l===void 0||p===void 0)return b;let h=Nt(d,o,t.doc).main.length,m=il(T(d),h),u=co(d),f=(p.maxX-p.minX)*t.view.scale,g=(p.maxY-p.minY)*t.view.scale,w=m.length*7.4+22;if(w>f*.95||g<26)return b;let y=Math.max(w,u.length*5.8+22)<=f*.95&&g>=48,M=y?Math.max(w,u.length*5.8+22):w,$=y?36:22,v=Wd(d,t.toScreen,a,i),x=y?[[M/2,$/2],[w/2,11]]:[[w/2,11]],R=Bd(t.toScreen(l),x,v);if(R===void 0)return b;let S=y&&R.pill===0,_=x[R.pill];i.push({c:R.at,half:_});let[I,E]=R.at,O=_[0]*2,U=_[1]*2;return H`<g class="hme-label"><rect x=${(I-O/2).toFixed(1)} y=${(E-U/2).toFixed(1)} width=${O.toFixed(1)} height=${U} rx=${S?9:7} fill="rgba(0,0,0,0.6)" />
        <text x=${I.toFixed(1)} y=${(E+(S?-3:4.5)).toFixed(1)} fill="#fff" font-size=${S?13:12} font-weight="600" text-anchor="middle">${m}</text>
        ${S?H`<text x=${I.toFixed(1)} y=${(E+11).toFixed(1)} fill="#aeaeb2" font-size="10" text-anchor="middle">${u}</text>`:b}</g>`});return this.labelsHeld={key:n,art:s,taken:i},s}measureMarks(t){let o=this.measure;if(o.a===void 0)return H`<g class="hme-measure"></g>`;let n=o.b??o.hover,i=t.toScreen(o.a);if(n===void 0)return H`<g class="hme-measure" pointer-events="none"><circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" /></g>`;let a=t.toScreen(n),s=Math.hypot(n[0]-o.a[0],n[1]-o.a[1]),d=[(i[0]+a[0])/2,(i[1]+a[1])/2];return H`<g class="hme-measure" pointer-events="none">
      <line x1=${i[0]} y1=${i[1]} x2=${a[0]} y2=${a[1]} stroke="#ff9f0a" stroke-width="2" stroke-dasharray=${o.b===void 0?"6 4":"none"} />
      <circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" /><circle cx=${a[0]} cy=${a[1]} r="5" fill="#ff9f0a" />
      <g class="hme-tag"><rect x=${(d[0]-32).toFixed(1)} y=${(d[1]-22).toFixed(1)} width="64" height="20" rx="10" fill="#ff9f0a" />
      <text x=${d[0].toFixed(1)} y=${(d[1]-8).toFixed(1)} fill="#2a1a00" text-anchor="middle">${s.toFixed(2)} m</text></g></g>`}renderModel(t,o,n){if(o<=0)return b;let i=this.selection,a=pe(i),s=a===void 0?void 0:t.floor.rooms.find(p=>k(p.id,a)),d=De(i).flatMap(p=>t.floor.rooms.find(h=>k(h.id,p.roomId))?.objects[p.object]??[]),l=d.length>0?{boxes:d}:s!==void 0?{outline:s.outline}:void 0;return Dt({mark:l,floor:t.floor,states:this.toggles.live?this.hass?.states:void 0,look:this.modelLookNow(),turn:this.modelTurnNow(),names:!0,devices:"lights",furniture:!0,glow:!0,width:o,height:n,stairsDown:this.stairsDown(t.floor)})}render3d(t){let o=this.failed3d==="webgl"?"The 3D view is not available on this device. The plan still works.":this.failed3d==="load"?"The 3D view could not be loaded. Reload the page to try again. The plan still works.":this.scene3d===void 0?"Loading the 3D view\u2026":void 0;return c`<div class="hme-3d-host" role="img" aria-label=${`3D model of ${K(t.floor)}. Drag to turn it, scroll to zoom, click a thing to pick it.`}></div>
      ${o===void 0?b:c`<div class="hme-3d-note">${o}</div>`}
      ${this.page.shape.sizeTag===void 0?b:c`<div class="hme-3d-size" role="status">${this.page.shape.sizeTag}</div>`}
      ${this.lost3d?c`<div class="hme-3d-note hme-3d-paused" role="status"><span>3D paused</span>
        <button type="button" class="hme-link" title="Make the 3D view again now" @click=${()=>this.restart3d()}>Start again</button></div>`:b}`}qualityItems(){let t=this.quality3dNow()==="low"?"Low":"High",o=n=>()=>this.setQuality3d(n);return[{group:"3D quality",radio:!0,label:this.quality3d==="auto"?`Auto (${t} here)`:"Auto",on:this.quality3d==="auto",title:"High on a strong computer, Low on a tablet or slower hardware",pick:o("auto")},{group:"3D quality",radio:!0,label:"High",on:this.quality3d==="high",title:"Soft shading in the corners, glowing bulbs and every shadow",pick:o("high")},{group:"3D quality",radio:!0,label:"Low",on:this.quality3d==="low",title:"Fewer effects and shadows, for a smoother view on slower hardware",pick:o("low")}]}renderModelDock(t,o){let n=this.model3d&&this.bundleUrl!==void 0,i=n?void 0:this.modelLookNow(),a=kr(this.hass?.states),s=this.skyChoiceNow(a),d=this.northLive??this.doc?.north??0,l=lo.map(m=>({label:Kl[m]??m,on:m===i,pick:()=>{this.modelLook=m,this.model3d=!1,this.dockMenu=void 0}}));this.bundleUrl!==void 0&&l.push({label:"3D",on:n,title:"The floor in real 3D, with its furniture and each light lit as it is now",pick:()=>{this.model3d=!0,this.dockMenu=void 0}}),n&&l.push(...this.qualityItems());let p=(m,u)=>({label:Wl[m],on:s===m,title:u,pick:()=>{this.skyChoice=m,this.dockMenu=void 0}}),h=[...a===void 0?[]:[p("now","The sun where it is now: it moves through the day, and at night only the lights that are on light the rooms")],p("night","Night: only the lights that are on light the rooms"),p("day","Day: the sun comes in through the windows"),...a===void 0?[]:[{label:`North ${d}\xB0\u2026`,on:!1,title:"Where north is on the plan, so the sun comes in on the right side",pick:()=>{this.dockMenu="north"}}]];return c`<div class="hme-dock">
      ${n?this.dockMenuButton("sky",`Sky: ${Wl[s]}`,"The sun and the sky in 3D, and where north is"):b}
      ${n&&(this.selection?.kind==="wall"||this.selection?.kind==="opening")?c`<button type="button" class="hme-tb hme-blue" title="Move the camera in front of it, to resize it. Turn back goes back." @click=${()=>this.scene3d?.lookAtPiece()}>Look at it</button>`:b}
      ${this.dockMenuButton("look",`Look: ${n?"3D":Kl[i??"night"]??i}`,"How the model is drawn: the tiles' looks, or real 3D")}
      <button type="button" class="hme-tb" title=${n?"Show the whole floor from the home style's turn":"Back to the home style's turn"} @click=${()=>this.turnBack()}>⟲ Turn back</button>
      ${t&&o!==void 0?c`<span class="hme-vsep"></span>${o}`:b}
      ${this.dockMenuList("look","Look",l,"menuitemradio")}${this.dockMenuList("sky","Sky",h,"menuitemradio")}${this.renderNorthMenu(d)}
    </div>`}skyChoiceNow(t){return this.skyChoice==="now"&&t===void 0?"night":this.skyChoice}renderNorthMenu(t){return this.dockMenu!=="north"?b:c`<div class="hme-dock-pop hme-north" role="group" aria-label="North">
      <svg class="hme-north-dial" viewBox="-20 -20 40 40" aria-hidden="true">
        <circle r="18" />
        <g transform=${`rotate(${t})`}><path class="n" d="M0 -15 L4 0 L-4 0 Z" /><path d="M0 15 L4 0 L-4 0 Z" /></g>
      </svg>
      <label class="hme-north-row">Where north is on the plan
        <input type="range" class="hme-range" min="0" max="359" step="1" .value=${X(String(t))} style=${ze(t,0,359)}
          @input=${o=>{this.northLive=Number(o.target.value)}}
          @change=${o=>{let n=Number(o.target.value);this.northLive=void 0,this.context()?.apply(i=>es(i,n))}} />
      </label>
      <span class="hme-val mono">${t}°</span>
    </div>`}renderDock(t){let o="Draw what Home Assistant's devices are doing now",n=()=>this.setToggle("live",!this.toggles.live);if(this.viewKind==="model")return this.renderModelDock(!0,c`<button type="button" class="hme-tb ${this.toggles.live?"on":""}" aria-pressed=${this.toggles.live?"true":"false"}
        title=${o} @click=${n}><span class="hme-live-dot"></span>Live states</button>`);let i=this.stageSize.width>0?un(this.baseFloor(),this.stageSize.width,this.stageSize.height):void 0,a=this.view===void 0||i===void 0?100:Ns(this.view,i),s=[...(this.page.viewItems?.(t)??[]).map(d=>({label:d.label,on:d.on,title:d.title,pick:()=>d.flip()})),{label:"Live states",on:this.toggles.live,title:o,pick:n},...this.bundleUrl===void 0?[]:this.qualityItems()];return c`<div class="hme-dock">
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom out" title="Zoom out (−)" @click=${()=>this.zoomBy(1/ho)}>−</button>
      <span class="hme-zoom mono">${a}%</span>
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom in" title="Zoom in (+)" @click=${()=>this.zoomBy(ho)}>＋</button>
      <button type="button" class="hme-tb" title="Fit the floor (0)" @click=${()=>this.fit()}>Fit</button>
      ${po(t.floor,t.selection).length===0?b:c`<button type="button" class="hme-tb" title="Fit the picked room (Z)" @click=${()=>this.fitPicked()}>Fit room</button>`}
      <span class="hme-vsep"></span>
      ${this.page.dock?.(t)??b}
      ${this.dockMenuButton("view","View","What the plan shows: the grid, names, live states and more")}
      ${this.dockMenuList("view","View",s,"menuitemcheckbox")}
    </div>`}dockMenuButton(t,o,n){let i=this.dockMenu===t;return c`<button type="button" class="hme-tb ${i?"on":""}" data-hme-menu=${t} aria-haspopup="menu" aria-expanded=${i?"true":"false"} title=${n}
      @click=${()=>{this.dockMenu=i?void 0:t}}>${o} <span class="hme-caret" aria-hidden="true">▾</span></button>`}dockMenuList(t,o,n,i){return this.dockMenu!==t?b:c`<div class="hme-dock-pop" role="menu" aria-label=${o}>
      ${n.map((a,s)=>c`${a.group!==void 0&&a.group!==n[s-1]?.group?c`<div class="hme-dock-head" role="presentation">${a.group}</div>`:b}
        <button type="button" role=${a.radio===!0?"menuitemradio":i} aria-checked=${a.on?"true":"false"} class="hme-dock-item ${a.on?"on":""}"
        title=${a.title??a.label} @click=${()=>a.pick()}><span class="hme-check" aria-hidden="true">${a.on?"\u2713":""}</span>${a.label}</button>`)}
    </div>`}renderDialog(){let t=this.dialog;if(t===void 0)return b;let o=()=>t.kind==="confirm"?t.done(!1):t.done(void 0),n=i=>{t.kind==="confirm"?t.done(!0):t.done((i?.querySelector("input")?.value??t.value).trim()||t.value)};return c`<div class="hme-scrim" @pointerdown=${i=>{i.target===i.currentTarget&&o()}}>
      <div class="hme-dialog" role="dialog" aria-modal="true" aria-label=${t.title}
        @keydown=${i=>{i.key==="Escape"&&(i.stopPropagation(),o()),i.key==="Enter"&&(i.preventDefault(),n(i.currentTarget))}}>
        <h3>${t.title}</h3>
        ${t.kind==="confirm"?t.text===void 0?b:c`<p>${t.text}</p>`:c`<label class="hme-dialog-field"><span>${t.label}</span><input type="text" maxlength="100" .value=${t.value} autofocus /></label>`}
        <div class="hme-dialog-row">
          <button type="button" class="hme-tb" @click=${o}>Cancel</button>
          <button type="button" class="hme-tb primary ${t.kind==="confirm"&&t.danger===!0?"danger-fill":""}"
            @click=${i=>n(i.currentTarget.closest(".hme-dialog"))}>${t.ok}</button>
        </div>
      </div>
    </div>`}static{this.styles=[qr,Rr,Ll,Cl]}};L([ce({attribute:!1})],A.prototype,"hass",2),L([ce({type:Boolean,reflect:!0})],A.prototype,"narrow",2),L([ce({attribute:!1})],A.prototype,"icons",2),L([ce({attribute:!1})],A.prototype,"iconsTick",2),L([ce({attribute:!1})],A.prototype,"capable",2),L([ce({attribute:!1})],A.prototype,"bundleUrl",2),L([ce({attribute:!1})],A.prototype,"onHome",2),L([ce({attribute:!1})],A.prototype,"onOpenPage",2),L([ce({attribute:!1})],A.prototype,"owners",2),L([ce({attribute:!1})],A.prototype,"phones",2),L([z()],A.prototype,"unsupported",2),L([z()],A.prototype,"loading",2),L([z()],A.prototype,"loadError",2),L([z()],A.prototype,"floorId",2),L([z()],A.prototype,"selection",2),L([z()],A.prototype,"walls",2),L([z()],A.prototype,"styleOpen",2),L([z()],A.prototype,"viewKind",2),L([z()],A.prototype,"splitStack",2),L([z()],A.prototype,"split",2),L([z()],A.prototype,"tipsShown",2),L([z()],A.prototype,"view",2),L([z()],A.prototype,"artScale",2),L([z()],A.prototype,"stageSize",2),L([z()],A.prototype,"toggles",2),L([z()],A.prototype,"scans",2),L([z()],A.prototype,"measure",2),L([z()],A.prototype,"floorMenu",2),L([z()],A.prototype,"dockMenu",2),L([z()],A.prototype,"dialog",2),L([z()],A.prototype,"modelLook",2),L([z()],A.prototype,"model3d",2),L([z()],A.prototype,"skyChoice",2),L([z()],A.prototype,"northLive",2),L([z()],A.prototype,"modelTurn",2),L([z()],A.prototype,"spaceHeld",2),L([z()],A.prototype,"tick",2),L([z()],A.prototype,"hover",2),L([z()],A.prototype,"addOpen",2),L([z()],A.prototype,"quality3d",2),L([z()],A.prototype,"lost3d",2),L([z()],A.prototype,"keysOpen",2);var Bl=new WeakMap,Qh=1;function Co(r){if(r===void 0)return 0;let e=Bl.get(r);return e===void 0&&Bl.set(r,e=Qh++),e}var Ul=r=>Co(r);customElements.get("wa-home-map-editor")||customElements.define("wa-home-map-editor",A);export{Xh as HOME_MAP_DRAG_SLOP,Vh as HOME_MAP_EMPTY_TEXT,As as HOME_MAP_SCAN_TEXT,qh as HOME_MAP_START_TEXT,Gh as HOME_MAP_UPDATE_TEXT,A as WaHomeMapEditor,Zh as homeMapSaveWords};
