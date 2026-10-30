import{a as Ae}from"./chunk-5RAIUOD6.js";import{a as Yo,b as Zo,c as De,d as pt,e as ht,f as Vi,g as Xi}from"./chunk-4OUO5SB4.js";import"./chunk-PID6EQ7W.js";import{a as Zt,b as Q,c as me,d as mt,e as Ze,f as qi,g as ct,h as Jo,i as Me,j as Yi,k as Zi,l as Ji,m as Je}from"./chunk-GALNCSLB.js";import"./chunk-X3HTP33H.js";import{$ as Lt,$a as Vo,A as Ro,Aa as $i,Ba as dt,Ca as Ie,D as Ot,Da as No,E as Qn,Ea as xi,F as ei,Fa as Hi,G as Ce,Ga as Ve,H as Do,Ha as Xe,I as _t,Ia as Pi,J as ti,Ja as Ei,K as oi,Ka as Ko,La as be,M as We,Ma as Kt,N as Ao,Na as Wt,O as X,Oa as Ti,P as Be,Pa as Wo,Q as Se,Qa as Ci,R as ni,Ra as Bt,S as ii,Sa as Bo,T as ri,Ta as lt,U as ai,Ua as Gt,V as it,Va as Si,W as rt,Wa as Ii,X as si,Xa as Go,Y as at,Ya as Uo,Z as di,Za as Ri,_ as li,_a as Di,a as ve,aa as pi,ab as we,ba as Oo,bb as qe,ca as hi,cb as Ai,d as So,da as mi,db as Oi,ea as ci,eb as Xo,fa as ui,fb as Re,ga as _o,gb as Ut,ha as Lo,hb as Vt,ia as st,ib as _i,ja as fi,jb as Li,ka as gi,kb as Z,la as vi,lb as Ye,m as Io,ma as Ge,mb as Xt,n as Te,na as Fo,nb as Fi,o as le,oa as Ft,ob as qt,p as U,pa as bi,pb as ji,q as B,qa as wi,qb as zi,r as pe,ra as yi,rb as Ni,s as he,sa as jo,sb as Ki,t as Zn,ta as jt,tb as Wi,ua as zo,ub as Bi,v as At,va as zt,vb as ye,w as Jn,wa as Mi,wb as qo,xa as ki,xb as Yt,ya as Ue,yb as Gi,za as Nt,zb as Ui}from"./chunk-KUKMIXHV.js";import{c as St,j as Bn,k as Gn,na as qn,oa as Yn}from"./chunk-IZUWXV63.js";import"./chunk-7J47EY3D.js";import{b as Co}from"./chunk-3OBV6BAV.js";import{j as Kn,p as Eo,q as G}from"./chunk-EM5NHGY5.js";import{i as It,l as Un,m as Vn,n as Rt,u as Dt,v as To,w as Xn}from"./chunk-PPAEDG6P.js";import{B as z,C as T,D as Et,E as q,F as de,H as Fn,J as oe,K as jn,L as Tt,M as Ct,T as zn,U as Nn,V as Y,b as An,d as On,e as _n,h as ot,i as Ln,u as nt,v as Pt,x as Po,y as M}from"./chunk-RDES6BO4.js";import{$g as Ht,Fh as Ke,Nh as Wn,ah as Rn,b as xt,d as m,e as k,g as v,hg as Ho,j as In,k as se,l as L,wh as Dn}from"./chunk-7M7K7CM3.js";import{db as Ne}from"./chunk-YL2NAPV5.js";import{a as R}from"./chunk-LO2NM3CE.js";var Jt="application/x-wa-home-map-entity",Qo="application/x-wa-home-map-light",Qi=new Set(["light","switch","fan","climate","humidifier","water_heater","sensor","binary_sensor","media_player","lock","cover","valve","camera","vacuum","alarm_control_panel","siren","input_boolean","remote"]);function en(s,e){let t=s?.entities?.[e];if(t===void 0)return;if(typeof t.area_id=="string"&&t.area_id!=="")return t.area_id;let o=t.device_id?s?.devices?.[t.device_id]:void 0;return typeof o?.area_id=="string"&&o.area_id!==""?o.area_id:void 0}function er(s){let e=[];for(let[t,o]of Object.entries(s?.states??{})){let n=s?.entities?.[t];if(n?.hidden===!0)continue;let i=o?.attributes?.friendly_name,r=en(s,t),a=r===void 0?void 0:s?.areas?.[r]?.name?.trim()||r,d=o?.attributes?.device_class;e.push({entityId:t,name:typeof i=="string"&&i.trim()!==""?i.trim():t,domain:t.slice(0,t.indexOf(".")),areaId:r,areaName:a,deviceClass:typeof d=="string"?d:void 0,category:typeof n?.entity_category=="string"?n.entity_category:void 0})}return e.sort((t,o)=>t.name.localeCompare(o.name)||t.entityId.localeCompare(o.entityId))}function tr(s,e,t=40){let o=e.toLowerCase().split(/\s+/).filter(a=>a!=="");if(o.length===0)return[];let n=a=>`${a.name} ${a.entityId} ${a.areaName??""}`.toLowerCase(),i=s.filter(a=>o.every(d=>n(a).includes(d))),r=e.trim().toLowerCase();return i.sort((a,d)=>+!a.name.toLowerCase().startsWith(r)-+!d.name.toLowerCase().startsWith(r)).slice(0,t)}function or(s){switch(s.slice(0,s.indexOf("."))){case"light":return"lights";case"climate":case"fan":case"humidifier":case"water_heater":return"climate";case"sensor":case"binary_sensor":return"sensors";case"switch":case"input_boolean":return"power";case"media_player":case"remote":return"media";case"lock":case"camera":case"alarm_control_panel":case"siren":return"security";case"cover":case"valve":return"covers";default:return"other"}}function nr(s){return s.replace(/_/g," ")}function ee(s,e){let t=e?.[s];if(t===void 0)return"gone";let o=String(t.state??""),n=s.slice(0,s.indexOf(".")),i=t.attributes??{};if(n==="light"&&o==="on"&&typeof i.brightness=="number")return`on \xB7 ${Math.round(i.brightness/255*100)}%`;if(n==="climate"&&typeof i.current_temperature=="number")return`${o} \xB7 ${i.current_temperature}\xB0`;let r=typeof i.unit_of_measurement=="string"?i.unit_of_measurement:"";return r!==""&&o!==""&&Number.isFinite(Number(o))?`${o} ${r}`.replace(" \xB0","\xB0").replace(" %","%"):o.replace(/_/g," ")}function Qt(s){return["light","switch","fan","input_boolean","media_player","cover","humidifier","siren"].includes(s.slice(0,s.indexOf(".")))}function eo(s,e){let t=String(e?.[s]?.state??"");return s.startsWith("cover.")?t==="open"||t==="opening"?"Close":"Open":t==="on"||t==="playing"||t==="paused"||t==="idle"?"Turn off":"Turn on"}var tn=[["Floor",.3],["Table",.8],["Wall",1.6],["Ceiling",2.5]],on=[[void 0,"As the tile does"],["toggle","Turn on or off"],["details","Show details"],["page","Open a page"],["none","Nothing"]];function _e(s,e){for(let t of s.floors){let o=t.pins.find(n=>n.entityId===e);if(o!==void 0)return{floorId:t.id,pinId:o.id}}}function nn(s,e){return e===void 0?void 0:s.rooms.find(t=>t.areaId!==void 0&&t.areaId===e)}function ne(s){return s?.kind==="pin"?[s.pinId]:s?.kind==="pins"?s.pinIds.slice():[]}function Oe(s){let e=[];for(let t of s)e.some(o=>M(o,t))||e.push(t);if(e.length!==0)return e.length===1?{kind:"pin",pinId:e[0]}:{kind:"pins",pinIds:e}}function Le(s,e){let t=ne(s);return t.some(o=>M(o,e))?Oe(t.filter(o=>!M(o,e))):Oe([...t,e])}function ir(s,e){return Oe([...ne(s),...e])}function rr(s,e,t){let[o,n]=[Math.min(e[0],t[0]),Math.max(e[0],t[0])],[i,r]=[Math.min(e[1],t[1]),Math.max(e[1],t[1])];return s.filter(a=>a.at[0]>=o&&a.at[0]<=n&&a.at[1]>=i&&a.at[1]<=r).map(a=>a.id)}function ie(s){if(s.length===0)return{mixed:!0};let e=JSON.stringify(s[0])??"undefined";return s.every(t=>(JSON.stringify(t)??"undefined")===e)?{mixed:!1,value:s[0]}:{mixed:!0}}function ar(s,e){if(s.length===0||!s.every(Qt))return;let t=s.every(n=>n.startsWith("cover.")),o=s.some(n=>{let i=eo(n,e);return i==="Turn off"||i==="Close"});return t?o?{words:"Close",service:"turn_off"}:{words:"Open",service:"turn_on"}:o?{words:"Turn off",service:"turn_off"}:{words:"Turn on",service:"turn_on"}}var sr=4,dr=2400;function lr(s,e){return[s.ox+e[0]*s.scale,s.oy+e[1]*s.scale]}function ke(s,e){return[(e[0]-s.ox)/s.scale,(e[1]-s.oy)/s.scale]}function rn(s,e,t,o=72,n=96){let r=s===void 0||s.rooms.length===0&&s.pins.length===0?{minX:-5,minY:-5,maxX:5,maxY:5}:Et(s),a=Math.max(r.maxX-r.minX,1),d=Math.max(r.maxY-r.minY,1),l=fr(Math.min(Math.max(e-o*2,40)/a,Math.max(t-n*2,40)/d),sr,dr);return{scale:l,ox:e/2-(r.minX+r.maxX)/2*l,oy:t/2-(r.minY+r.maxY)/2*l}}function an(s,e,t){let o=fr(s.scale*e,sr,dr),n=o/s.scale;return{scale:o,ox:t[0]-(t[0]-s.ox)*n,oy:t[1]-(t[1]-s.oy)*n}}function pr(s,e){return Math.round(s.scale/e.scale*100)}var ut=1.25;function hr(s){if(typeof s!="object"||s===null)return;let e=s;return{tag:typeof e.tagName=="string"?e.tagName.toUpperCase():"",type:typeof e.type=="string"?e.type.toLowerCase():"text",editable:e.isContentEditable===!0}}var mr=["button","submit","reset","image"],sa=["checkbox","radio","range","color","file"];function sn(s){let e=hr(s);return e===void 0?!1:e.editable||e.tag==="TEXTAREA"?!0:e.tag==="INPUT"&&!mr.includes(e.type)&&!sa.includes(e.type)}function cr(s){let e=hr(s);return e===void 0?!1:sn(s)||e.tag==="SELECT"?!0:e.tag==="INPUT"&&!mr.includes(e.type)}function te(s,e){if(e)return;let t=s.metaKey===!0||s.ctrlKey===!0,o=s.key.length===1?s.key.toLowerCase():s.key;if(t)return o==="z"?s.shiftKey===!0?"redo":"undo":o==="y"?"redo":void 0;if(s.altKey===!0)return;switch(o){case"Escape":return"cancel";case"Delete":case"Backspace":return"delete";case"Enter":return"enter";case"+":case"=":return"zoomIn";case"-":return"zoomOut";case"0":return"fit"}let n=s.shiftKey===!0?.1:.01;if(o==="ArrowLeft")return{nudge:[-n,0]};if(o==="ArrowRight")return{nudge:[n,0]};if(o==="ArrowUp")return{nudge:[0,-n]};if(o==="ArrowDown")return{nudge:[0,n]};if(/^[a-z]$/.test(o)&&s.shiftKey!==!0)return{letter:o}}function dn(){let s=globalThis.navigator,e=`${typeof s?.platform=="string"?s.platform:""} ${typeof s?.userAgent=="string"?s.userAgent:""}`;return/Mac|iPhone|iPad/.test(e)}function ur(){return dn()?"\u2318Z":"Ctrl+Z"}var fr=(s,e,t)=>Math.min(Math.max(s,e),t);function ft(s,e=2){return`${(Math.round(s*10**e)/10**e).toFixed(e)} m`}function gt(s,e=2){let t=(Math.round(s*10**e)/10**e).toFixed(e);return/^-0(\.0*)?$/.test(t)?t.slice(1):t}function ln(s){let e=s.trim().replace(",",".").replace(/\s*(m|cm|°|deg)$/i,"");if(e===""||!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(e))return;let t=Number(e);if(Number.isFinite(t))return/cm$/i.test(s.trim())?t/100:t}function to(s){if(s.outline.length<3)return{width:0,depth:0,area:0};let{a0:e,a1:t,c0:o,c1:n}=Ro(s,Io(s));return{width:t-e,depth:n-o,area:Math.abs(Ot(s.outline))}}function oo(s){let{width:e,depth:t}=to(s);return`${e.toFixed(1)} \xD7 ${t.toFixed(1)} m`}function gr(s){if(s.outline.length<3)return s.outline.slice();let{a0:e,a1:t,c0:o,c1:n,point:i}=Ro(s,Io(s));return[i(e,o),i(t,o),i(t,n),i(e,n)]}function vr(s,e){let t=X(s)[e];if(t===void 0)return"inner";let o=Math.max(Math.hypot(t.b[0]-t.a[0],t.b[1]-t.a[1]),1e-9),n=-(t.b[1]-t.a[1])/o,i=(t.b[0]-t.a[0])/o,r=[(t.a[0]+t.b[0])/2,(t.a[1]+t.b[1])/2],a=Math.max(t.t,.1)+.1,d=le(s.outline,[r[0]+n*a,r[1]+i*a]),l=le(s.outline,[r[0]-n*a,r[1]-i*a]);if(d&&l)return"inner";if(d)n=-n,i=-i;else if(!l){let p=U(s);p!==void 0&&(p[0]-r[0])*n+(p[1]-r[1])*i>0&&(n=-n,i=-i)}return Math.abs(n)>Math.abs(i)?n>0?"right":"left":i>0?"bottom":"top"}function pn(s,e,t){let o=vr(s,e);return`${t}, ${o} wall`}function br(s){let e=X(s).map((o,n)=>vr(s,n)),t=new Map;return e.map((o,n)=>{let i=(t.get(o)??0)+1;t.set(o,i);let r=`${o.charAt(0).toUpperCase()}${o.slice(1)} wall`;return i===1&&e.indexOf(o,n+1)<0?r:`${r} ${i}`})}function $e(s){return s.kind==="opening"?"Way through":s.kind==="window"?s.style==="sliding"?"Sliding window":"Window":s.style==="double"?"Double door":s.style==="sliding"?"Sliding door":"Door"}var da={sofa:"Sofa",table:"Table",chair:"Chair",bed:"Bed",storage:"Storage",television:"TV",bathtub:"Bath",sink:"Basin",toilet:"Toilet",stove:"Hob",oven:"Oven",refrigerator:"Fridge",dishwasher:"Dishwasher",washerDryer:"Washer dryer",fireplace:"Fireplace",stairs:"Stairs"};function vt(s){let e=da[s];if(e!==void 0)return e;let t=s.replace(/([a-z0-9])([A-Z])/g,"$1 $2").toLowerCase();return t.charAt(0).toUpperCase()+t.slice(1)}function S(s,e,t=`${e}s`){return`${s} ${s===1?e:t}`}function E(s,e,t,o=""){return m`<section class="hme-card ${o}">
    <div class="hme-h">${s}${t===void 0?v:m`<span class="hme-h-end">${t}</span>`}</div>
    ${e}
  </section>`}function O(s,...e){return m`<div class="hme-r"><span class="hme-l">${s}</span>${e}</div>`}function V(s){return m`<p class="hme-hint">${s}</p>`}var wr=3;function la(s,e){return s==="\xB0"?1:10**-e}function F(s){let e=s.digits??2,t=s.step??la(s.unit,e),o=s.value===void 0?"":gt(s.value,e),n=d=>Math.min(Math.max(d,s.min??-1/0),s.max??1/0),i=d=>gt(d,e)===o,r=d=>{let l=ln(d.value);if(l===void 0||s.min!==void 0&&l<s.min||s.max!==void 0&&l>s.max||i(l)){d.value=o;return}s.set(l)},a=d=>{let l=d.currentTarget,p=l.querySelector("input");if(p===null||s.disabled===!0||d.button!==0||p.matches(":focus"))return;d.preventDefault();let h=s.value,u=d.clientX,f=!1,g=h;try{l.setPointerCapture(d.pointerId)}catch{}let c=y=>{if(h===void 0)return;let w=y.clientX-u;if(!f&&Math.abs(w)<wr)return;f||l.classList.add("scrubbing"),f=!0;let H=y.shiftKey?10:y.altKey?.1:1;g=n(Number((h+(w-Math.sign(w)*wr)*t*H).toFixed(e+(y.altKey?1:0)))),p.value=gt(g,e),s.preview?.(g)},b=y=>{if(l.removeEventListener("pointermove",c),l.removeEventListener("pointerup",b),l.removeEventListener("pointercancel",b),l.classList.remove("scrubbing"),!f){p.focus(),p.select();return}s.preview?.(void 0),y.type!=="pointercancel"&&g!==void 0&&!i(g)?s.set(g):p.value=o};l.addEventListener("pointermove",c),l.addEventListener("pointerup",b),l.addEventListener("pointercancel",b)};return m`<span class="hme-in hme-num ${s.disabled===!0?"off":""}" style=${s.width===void 0?v:`flex:0 0 ${s.width}`}
    title=${s.disabled===!0?v:"Drag sideways to change it, click to type"} @pointerdown=${a}>
    ${s.tag===void 0?v:m`<span class="hme-ntag" aria-hidden="true">${s.tag}</span>`}
    <input type="text" inputmode="decimal" aria-label=${s.label} .value=${G(o)} ?disabled=${s.disabled===!0}
      placeholder=${s.value===void 0?"Mixed":""}
      @change=${d=>r(d.target)}
      @keydown=${d=>{let l=d.target;if(d.key==="Enter"&&l.blur(),d.key==="Escape"&&(l.value=o,l.blur()),(d.key==="ArrowUp"||d.key==="ArrowDown")&&s.value!==void 0){d.preventDefault();let p=ln(l.value)??s.value,h=n(Number((p+(d.key==="ArrowUp"?1:-1)*t*(d.shiftKey?10:1)).toFixed(e)));l.value=gt(h,e),i(h)||s.set(h)}}} />${s.unit===void 0?v:m`<span class="hme-unit">${s.unit}</span>`}</span>`}var Qe=new WeakMap,yr=new WeakMap;function bt(s){let e=s.value.toLowerCase(),t=o=>{let n=Qe.get(o);n!==void 0&&(Qe.delete(o),s.preview(void 0),o.value.toLowerCase()!==n&&(yr.set(o,o.value.toLowerCase()),s.set(o.value)))};return m`<input type="color" .value=${G(e)} aria-label=${s.label}
    @input=${o=>{let n=o.target;Qe.has(n)||Qe.set(n,e);let i=n.value.toLowerCase();s.preview(i===Qe.get(n)?void 0:i)}}
    @change=${o=>{let n=o.target,i=n.value.toLowerCase();Qe.has(n)?t(n):i!==e&&i!==yr.get(n)&&s.set(n.value)}}
    @blur=${o=>t(o.target)} />`}function wt(...s){return m`<div class="hme-fields" style=${`--n:${s.length}`}>${s}</div>`}function yt(s,...e){return m`<div class="hme-group"><div class="hme-gl">${s}</div>${e}</div>`}function et(s){return m`<span class="hme-in"><input type="text" aria-label=${s.label} maxlength=${s.max??100} placeholder=${s.placeholder??""}
    .value=${G(s.value)}
    @change=${e=>{let t=e.target.value;t.trim()!==s.value.trim()&&s.set(t)}}
    @keydown=${e=>{e.key==="Enter"&&e.target.blur()}} /></span>`}function Fe(s){return m`<span class="hme-in hme-sel ${s.cls??""}"><select aria-label=${s.label} @change=${e=>s.set(e.target.value)}>
    ${s.options.map(e=>m`<option value=${e.value} ?disabled=${e.disabled===!0} .selected=${G(e.value===s.value)}>${e.label}</option>`)}
  </select></span>`}function hn(s){return m`<span class="hme-menu ${s.cls??""}"><select aria-label=${s.label} @change=${e=>{let t=e.target,o=t.value;t.value="",o!==""&&s.pick(o)}}>
    <option value="" .selected=${G(!0)}>${s.label}</option>
    ${s.options.map(e=>m`<option value=${e.value} ?disabled=${e.disabled===!0}>${e.label}</option>`)}
  </select><span class="hme-menu-caret" aria-hidden="true">▾</span></span>`}function J(s){return m`<button type="button" class="hme-pic ${s.on?"on":""}" aria-pressed=${s.on?"true":"false"} title=${s.title??s.label}
    @click=${s.click}>${s.picture}<span>${s.label}</span></button>`}function Mt(s){return m`<button type="button" class="hme-chip ${s.on?"":"off"}" aria-pressed=${s.on?"true":"false"} aria-label=${s.label}
    @click=${s.click}>${s.on?s.onText:s.offText}</button>`}var pa={wood:"repeating-linear-gradient(0deg,#b38a61 0 9px,#8e6845 9px 10px)",tile:"linear-gradient(#a9a7a1 1px,transparent 1px) 0 0/10px 10px, linear-gradient(90deg,#a9a7a1 1px,transparent 1px) 0 0/10px 10px, #cbc9c2",stone:"#bcc1c6 linear-gradient(#9da2a6 1px,transparent 1px) 0 0/18px 12px",carpet:"#99928a",plain:"#a8a6a1"},ha={wood:"#a17a55",tile:"#bdbbb4",stone:"#b0b5ba",carpet:"#8f8880",plain:"#9c9a95"};function mn(s){return m`<span class="hme-sw" style=${`background:${pa[s]}`}></span>`}var Mr=s=>s.map(([e,t])=>`${Math.round(e*10)/10},${Math.round(t*10)/10}`).join(" ");function cn(s,e=34,t=24){let o=s?.rooms??[];if(o.length===0)return m`<svg class="hme-thumb" width=${e} height=${t} viewBox=${`0 0 ${e} ${t}`} aria-hidden="true">
      <rect x="1" y="1" width=${e-2} height=${t-2} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" stroke-dasharray="3 2" /></svg>`;let n=Et(s),i=4,r=Math.min((e-i*2)/Math.max(n.maxX-n.minX,.5),(t-i*2)/Math.max(n.maxY-n.minY,.5)),a=e/2-(n.minX+n.maxX)/2*r,d=t/2-(n.minY+n.maxY)/2*r;return m`<svg class="hme-thumb" width=${e} height=${t} viewBox=${`0 0 ${e} ${t}`} aria-hidden="true">
    <rect x="0.5" y="0.5" width=${e-1} height=${t-1} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" />
    ${o.map(l=>k`<polygon points=${Mr(l.outline.map(([p,h])=>[a+p*r,d+h*r]))} fill="none" stroke="var(--wa-muted)" stroke-width="1.1" />`)}
  </svg>`}function kr(s,e,t=76,o=54){let n=s.outline.map(c=>c[0]),i=s.outline.map(c=>c[1]),r=Math.min(...n),a=Math.max(...n),d=Math.min(...i),l=Math.max(...i),p=8,h=Math.min((t-p*2)/Math.max(a-r,.5),(o-p*2)/Math.max(l-d,.5)),u=t/2-(r+a)/2*h,f=o/2-(d+l)/2*h,g=Mr(s.outline.map(([c,b])=>[u+c*h,f+b*h]));return m`<svg class="hme-room-thumb" width=${t} height=${o} viewBox=${`0 0 ${t} ${o}`} aria-hidden="true">
    <rect width=${t} height=${o} rx="8" fill="#121010" />
    <polygon points=${g} fill=${ha[At(s)]} stroke="#ece6da" stroke-width="2.5" stroke-linejoin="round" />
    ${e?k`<circle cx=${t*.58} cy=${o*.42} r=${Math.min(t,o)*.22} fill="#ffb648" opacity="0.35" />`:v}
  </svg>`}function un(s,e,t,o={}){let n=(o.reach??10)/t,i,r=n;for(let l of[...s.rooms.flatMap(p=>p.outline),...o.corners??[]]){let p=Math.hypot(l[0]-e[0],l[1]-e[1]);p<=r&&(i=l,r=p)}if(i!==void 0)return[i[0],i[1]];let[a,d]=e;if(o.grid!==void 0&&o.grid>0&&(a=Math.round(a/o.grid)*o.grid,d=Math.round(d/o.grid)*o.grid),o.from!==void 0){let l=8/t;Math.abs(e[0]-o.from[0])<=l&&(a=o.from[0]),Math.abs(e[1]-o.from[1])<=l&&(d=o.from[1])}return[Math.round(a*100)/100,Math.round(d*100)/100]}var xe=.1,He=.05,no=class{constructor(e){this.grid=e;this.active=!1;this.points=[]}start(e){this.active=!0,this.points=[],this.hoverAt=void 0,e.select(void 0),e.redraw()}stop(e){this.active=!1,this.points=[],this.hoverAt=void 0,e?.redraw()}snap(e,t){return un(e.floor,t,e.view.scale,{...this.points.length>0?{from:this.points[this.points.length-1]}:{},...e.toggles.grid?{grid:this.grid}:{},corners:this.points})}closes(e,t){let o=this.points[0];return o!==void 0&&this.points.length>=3&&Math.hypot(t[0]-o[0],t[1]-o[1])*e.view.scale<=10}pointerDown(e,t,o){if(!this.active||t.button!==0)return!1;let n=this.snap(e,o);if(this.closes(e,n))return this.finish(e),!0;let i=this.points[this.points.length-1];return(i===void 0||Math.hypot(n[0]-i[0],n[1]-i[1])>=.05)&&this.points.push(n),e.redraw(),!0}hover(e,t){this.active&&(this.hoverAt=t===void 0?void 0:this.snap(e,t),e.redraw())}keyDown(e,t){return this.active?t.key==="Escape"?(this.stop(e),!0):t.key==="Enter"?(this.points.length>=3&&this.finish(e),!0):t.key==="Backspace"||t.key==="Delete"?(this.points.pop(),e.redraw(),!0):!1:!1}async finish(e){let t=this.points.slice();if(this.stop(e),t.length<3)return;let o=await e.ask({title:"Name the room",label:"Name",value:"Room",ok:"Add room"});if(o===void 0)return;let n=e.newId(),i=e.floor.id;e.apply(r=>Hi(r,i,n,t,o),{select:{kind:"room",roomId:n}})||e.note("err","That room could not be added. Draw at least three corners round some floor.")}overlay(e){if(!this.active)return v;let t=this.points.map(d=>e.toScreen(d)),o=this.hoverAt===void 0?void 0:e.toScreen(this.hoverAt),n=this.hoverAt!==void 0&&this.closes(e,this.hoverAt),i=[...t,...o!==void 0?[o]:[]].map(([d,l])=>`${d.toFixed(1)},${l.toFixed(1)}`).join(" "),r=this.points[this.points.length-1],a=r!==void 0&&this.hoverAt!==void 0?Math.hypot(this.hoverAt[0]-r[0],this.hoverAt[1]-r[1]):0;return k`<g class="hme-draw">
      ${t.length>=3?k`<polygon points=${t.map(([d,l])=>`${d},${l}`).join(" ")} fill="rgba(91,141,239,0.14)" stroke="none" />`:v}
      <polyline points=${i} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />
      ${t.map(([d,l],p)=>k`<circle cx=${d} cy=${l} r=${p===0&&n?8:5} fill=${p===0&&n?"#5b8def":"#fff"} stroke="#5b8def" stroke-width="2" />`)}
      ${o!==void 0&&!n?k`<circle cx=${o[0]} cy=${o[1]} r="4" fill="#5b8def" />`:v}
      ${o!==void 0&&a>.05?k`<g class="hme-tag"><rect x=${o[0]+10} y=${o[1]-26} width="58" height="18" rx="9" fill="#5b8def" />
        <text x=${o[0]+39} y=${o[1]-13} fill="#fff" text-anchor="middle">${a.toFixed(2)} m</text></g>`:v}
    </g>`}hint(){return this.points.length===0?"Click to put down the first corner":this.points.length<3?"Click to add corners":"Click the first corner or press Enter to close the room"}};function ce(s){return s===void 0||s.kind==="pin"||s.kind==="pins"||s.kind==="objects"?void 0:s.roomId}function ue(s){return s?.kind==="object"?[{roomId:s.roomId,object:s.object}]:s?.kind==="objects"?s.items.map(e=>({roomId:e.roomId,object:e.object})):[]}var io=(s,e)=>M(s.roomId,e.roomId)&&s.object===e.object;function $r(s){let e=[];for(let t of s)e.some(o=>io(o,t))||e.push({roomId:t.roomId,object:t.object});if(e.length!==0)return e.length===1?{kind:"object",roomId:e[0].roomId,object:e[0].object}:{kind:"objects",items:e}}function je(s,e){let t=ue(s);return t.some(o=>io(o,e))?$r(t.filter(o=>!io(o,e))):$r([...t,e])}function ro(s,e){if(e?.kind!=="pin"||s===void 0)return e;let t=Z(s,e.pinId);return t===void 0?e:{kind:"object",roomId:t.roomId,object:t.object}}function xr(s,e,t){return ue(s).some(o=>io(o,{roomId:e,object:t}))}function fn(s,e){if(e===void 0)return!0;if(s===void 0)return!1;if(e.kind==="pin")return s.pins.some(o=>M(o.id,e.pinId));if(e.kind==="pins")return e.pinIds.every(o=>s.pins.some(n=>M(n.id,o)));if(e.kind==="objects")return e.items.every(o=>s.rooms.find(n=>M(n.id,o.roomId))?.objects[o.object]!==void 0);let t=s.rooms.find(o=>M(o.id,e.roomId));if(t===void 0)return!1;switch(e.kind){case"room":return!0;case"wall":return X(t)[e.wall]!==void 0;case"corner":return t.outline[e.corner]!==void 0;case"opening":return t.openings[e.opening]!==void 0;case"object":return t.objects[e.object]!==void 0}}function ao(s,e){return s===void 0||e===void 0?s===e:JSON.stringify(s)===JSON.stringify(e)}var ma=15;function vn(s,e,t){let o,n=ma;for(let i of s.pins){let r=e(i.at),a=Math.hypot(r[0]-t[0],r[1]-t[1]);a<=n&&(o=i,n=a)}return o}function bn(s,e,t){let o;for(let n of t===void 0?s.rooms:[t])n.objects.forEach((i,r)=>{if(i.hidden===!0)return;let a=he(pe(i));if(!le(a,e))return;let d=Math.abs(Ot(a));(o===void 0||d<o.area)&&(o={thing:{room:n,index:r,object:i},area:d})});return o?.thing}function Er(s,e,t){let o=vn(s,e,e(t));if(o!==void 0){let r=Z(s,o.id);return r===void 0?{kind:"pin",pinId:o.id}:{kind:"object",roomId:r.roomId,object:r.object}}let n=bn(s,t);if(n!==void 0)return{kind:"object",roomId:n.room.id,object:n.index};let i=B(s,t);return i===void 0?void 0:{kind:"room",roomId:i.id}}function wn(s,e){if(s!==void 0){if(s.kind==="room")return e?.kind==="room"&&M(e.roomId,s.roomId)?void 0:s;if(s.kind==="object")return ue(e).some(o=>M(o.roomId,s.roomId)&&o.object===s.object)?void 0:s;if(s.kind==="pin")return(e?.kind==="pin"?[e.pinId]:e?.kind==="pins"?e.pinIds:[]).some(o=>M(o,s.pinId))?void 0:s}}var Hr="rgba(91,141,239,0.14)",ca="rgba(91,141,239,0.07)",gn="rgba(150,186,255,0.75)",Pr=s=>`${s[0].toFixed(1)},${s[1].toFixed(1)}`;function Tr(s,e,t,o){let n=wn(e,t);if(n===void 0)return v;if(n.kind==="pin"){let a=s.pins.find(p=>M(p.id,n.pinId));if(a===void 0)return v;let[d,l]=o(a.at);return k`<g class="hme-hover" pointer-events="none"><circle cx=${d.toFixed(1)} cy=${l.toFixed(1)} r="18" fill=${Hr} stroke=${gn} stroke-width="1.5" /></g>`}let i=s.rooms.find(a=>M(a.id,n.roomId));if(i===void 0)return v;if(n.kind==="object"){let a=i.objects[n.object];if(a===void 0)return v;let d=he(pe(a)).map(l=>Pr(o(l))).join(" ");return k`<g class="hme-hover" pointer-events="none"><polygon points=${d} fill=${Hr} stroke=${gn} stroke-width="1.5"
      stroke-dasharray=${a.hidden===!0?"4 3":"none"} stroke-linejoin="round" /></g>`}if(i.outline.length<3)return v;let r=i.outline.map(a=>Pr(o(a))).join(" ");return k`<g class="hme-hover" pointer-events="none"><polygon points=${r} fill=${ca} stroke=${gn} stroke-width="1.5" stroke-linejoin="round" /></g>`}var yn;function so(){return yn??=import("./scene3d-H2H4OZED.js").catch(s=>{throw yn=void 0,s}),yn}function Mn(s){return new URL("furniture/",s).href}var Cr={wood:"Wood",tile:"Tile",stone:"Stone",carpet:"Carpet",plain:"Plain"},ua={wood:[{name:"Light oak",hex:"#D9B88A"},{name:"Oak",hex:"#B98B5A"},{name:"Walnut",hex:"#6B4A32"},{name:"Grey wash",hex:"#9A948C"}],tile:[{name:"White",hex:"#E9E7E2"},{name:"Grey",hex:"#8E8E8A"},{name:"Black",hex:"#2E2E30"},{name:"Terracotta",hex:"#B4664A"}],stone:[{name:"Light",hex:"#C9C3B8"},{name:"Sand",hex:"#B8A98E"},{name:"Slate",hex:"#5E6468"}],carpet:[{name:"Grey",hex:"#8E8E93"},{name:"Beige",hex:"#CBB9A0"},{name:"Navy",hex:"#2E4A7D"},{name:"Green",hex:"#4F6B4A"}],plain:[{name:"White",hex:"#E9E7E2"},{name:"Grey",hex:"#8E8E8A"},{name:"Black",hex:"#2E2E30"}]},fa=[{name:"White",hex:"#F2F0EB"},{name:"Warm white",hex:"#EDE6D8"},{name:"Greige",hex:"#CFC6B8"},{name:"Sage",hex:"#A3B09A"},{name:"Blue grey",hex:"#8C9AA6"},{name:"Charcoal",hex:"#3E4044"}];function kn(s){let e=s.mixed===!0,t=e?void 0:s.now?.toUpperCase(),o=t!==void 0&&!s.presets.some(n=>n.hex===t);return m`<div class="hme-r top"><span class="hme-l">${s.word}</span>
    <div class="hme-chips hme-colours" role="group" aria-label=${`${s.word} colour`}>
      <button type="button" class="hme-chip sel ${t===void 0&&!e?"on":""}" aria-pressed=${t===void 0&&!e?"true":"false"}
        title=${s.defaultTitle} @click=${()=>s.set(void 0)}>Default</button>
      ${s.presets.map(n=>m`<button type="button" class="hme-colour ${t===n.hex?"on":""}" style=${`--c:${n.hex}`}
        title=${n.name} aria-label=${`${s.word}: ${n.name}`} aria-pressed=${t===n.hex?"true":"false"} @click=${()=>s.set(n.hex)}></button>`)}
      <label class="hme-chip sel hme-pick ${o?"on":""}" title=${s.customTitle}>${o?m`<span class="hme-swatch" style=${`background:${t}`}></span>`:v}Custom
        ${bt({value:t??s.presets[0].hex,label:s.customLabel,preview:s.preview,set:s.set})}</label>
    </div></div>
    ${e?V(`Mixed: their ${s.word.toLowerCase()} colours differ. Pick one to set them all.`):v}`}var lo=15,ga=[{a:0,c:0},{c:0},{a:1,c:0},{a:1},{a:1,c:1},{c:1},{a:0,c:1},{a:0}];function va(s,e){let t=(Math.atan2(e,s)*180/Math.PI+180)%180;return["ew-resize","nwse-resize","ns-resize","nesw-resize"][Math.round(t/45)%4]}function ba(s,e){let t=e===0?"":` Its ${S(e,"device")} come${e===1?"s":""} off the map too.`;return`${T(s)} comes off the map.${t} A scanned room comes back only by scanning it again on the iPhone. Undo brings it back while this page is open.`}function ae(s){return pt(s.model)?.name??vt(s.kind)}function Sr(s){let e=s.map(t=>ae(t.object));return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function ho(s){return s.kind==="lamp"||ht(s)?.kind==="lamp"}function Ir(s,e){let t=oe(s,e);return t.kind==="light"&&t.on}function Rr(s,e){let t=ao(e.sel,s.hover);return m`<div class="hme-ly ${e.picked?"on":""} ${t?"hov":""} ${e.hidden?"hid":""}"
    @pointerenter=${()=>s.setHover(e.sel)} @pointerleave=${()=>s.setHover(void 0)}>
    <button type="button" class="hme-ly-main" aria-pressed=${e.picked?"true":"false"} title=${e.title} @click=${e.pick}>
      ${e.icon}<span class="hme-ly-nm">${e.name}</span><span class="hme-ly-end">${e.end}</span></button>
    ${e.eye===void 0?v:m`<button type="button" class="hme-eye" aria-label=${`${e.hidden?"Show":"Hide"} ${e.name}`}
      title=${e.hidden?"Show it again on the map, the tiles and the watch":"Hide it on the map, the tiles and the watch; it stays listed here"}
      @click=${e.eye}>${wa(!e.hidden)}</button>`}
  </div>`}function wa(s){return m`<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8z" fill="none" stroke="currentColor" stroke-width="1.3"></path>
    ${s?k`<circle cx="8" cy="8" r="2" fill="currentColor"></circle>`:k`<path d="M2.5 13.5l11-11" stroke="currentColor" stroke-width="1.3"></path>`}</svg>`}function Dr(s){let e=s[0]?.room.id;return e!==void 0&&s.every(t=>M(t.room.id,e))?{kind:"room",roomId:e}:void 0}var ya=["fabric","wood"],kt=s=>s.map(e=>({roomId:e.room.id,object:e.index}));function $n(s){return oi(ht(s))}function xn(s,e,t){let o=Xi(s,t).filter(r=>e===""||r.group===e);if(s.trim()!==""||e!=="")return[{title:e===""?"Found":e,pieces:o}];let n=[],i=t===void 0?[]:o.filter(r=>r.kind===t);i.length>0&&n.push({title:`${vt(t)} pieces`,pieces:i});for(let r of De.groups){let a=o.filter(d=>d.group===r&&!i.includes(d));a.length>0&&n.push({title:r,pieces:a})}return n}function Ma(s){return Math.round(Qn(s.turn)*10)/10}var N=s=>s.toFixed(1),re=s=>`${s[0].toFixed(1)},${s[1].toFixed(1)}`,po=class{constructor(){this.draw=new no(xe);this.guides=[];this.dragging=!1;this.resizing=!1;this.pickerQuery="";this.pickerGroup="";this.pickerFocus=!1;this.thumbs=new Map;this.askedThumbs=new Set;this.thumbFrame=0}openPicker(e,t,o){this.picker=o===void 0?{roomId:t.id}:{roomId:t.id,index:o},this.pickerQuery="",this.pickerGroup="",this.pickerFocus=!0,e.redraw()}closePicker(e){this.picker=void 0,e.redraw()}get pickerOpen(){return this.picker!==void 0}thumb(e,t){let o=this.thumbs.get(t),n=e.furnitureBase;if(o!==void 0||n===void 0||this.askedThumbs.has(t))return o;this.askedThumbs.add(t),so().then(i=>i.homeMapPieceThumb(n,t)).then(i=>{if(i===void 0||(this.thumbs.set(t,i),this.thumbFrame!==0))return;let r=typeof requestAnimationFrame=="function"?requestAnimationFrame:a=>setTimeout(a,16);this.thumbFrame=r(()=>{this.thumbFrame=0,e.redraw()})},()=>{})}piecePic(e,t,o){let n=t===void 0?void 0:this.thumb(e,t.id);return m`<span class="${o} ${n===void 0?"wait":""}">${n===void 0?v:m`<img src=${n} alt="" draggable="false" />`}</span>`}pickPiece(e,t){let o=this.picker,n=o===void 0?void 0:e.floor.rooms.find(d=>M(d.id,o.roomId));if(this.picker=void 0,o===void 0||n===void 0){e.redraw();return}let i=n.id;if(o.index!==void 0){let d=o.index;e.apply(l=>yi(l,i,d,t),{select:{kind:"object",roomId:i,object:d}})||e.redraw();return}let r=U(n)??q(n),a=n.objects.length;e.apply(d=>bi(d,i,t,r),{select:{kind:"object",roomId:i,object:a}})||e.redraw()}sheet(e){let t=this.picker;if(t===void 0)return v;let o=e.floor.rooms.find(u=>M(u.id,t.roomId)),n=t.index===void 0?void 0:o?.objects[t.index];if(o===void 0||t.index!==void 0&&n===void 0)return this.picker=void 0,v;let i=n===void 0?void 0:ht(n),r=xn(this.pickerQuery,this.pickerGroup,n?.kind),a=n===void 0?"Add furniture":"Change model",d=n===void 0?`To ${T(o)}, in its middle. Drag it into place once it is in.`:`${ae(n)} in ${T(o)} keeps its place, size and turn.`,l=u=>De.pieces.filter(f=>u===""||f.group===u).length,p=["",...De.groups],h=this.pickerFocus;return this.pickerFocus=!1,m`<div class="hme-scrim hme-sheet"
      @pointerdown=${u=>{u.target===u.currentTarget&&this.closePicker(e)}}
      @keydown=${u=>{u.stopPropagation(),u.key==="Escape"&&this.closePicker(e)}}>
      <div class="hme-fpick" role="dialog" aria-modal="true" aria-label=${a}>
        <header class="hme-fpick-head">
          <div class="hme-fpick-t"><strong>${a}</strong><span>${d}</span></div>
          <label class="hme-find hme-fpick-find"><span aria-hidden="true">⌕</span>
            <input type="search" placeholder="Find a piece: sofa, lamp, desk" aria-label="Find a piece" .value=${G(this.pickerQuery)}
              ${Ae(u=>{h&&u instanceof HTMLInputElement&&setTimeout(()=>u.focus(),0)})}
              @input=${u=>{this.pickerQuery=u.target.value,e.redraw()}} /></label>
          <button type="button" class="hme-x hme-fpick-close" aria-label="Close" title="Close (Esc)" @click=${()=>this.closePicker(e)}>×</button>
        </header>
        <div class="hme-fpick-main">
          <nav class="hme-fpick-groups" aria-label="Groups">
            ${p.map(u=>m`<button type="button" class="hme-tool ${u===this.pickerGroup?"on":""}" aria-pressed=${u===this.pickerGroup?"true":"false"}
              @click=${()=>{this.pickerGroup=u,e.redraw()}}>${u===""?"All":u}<span class="n">${l(u)}</span></button>`)}
          </nav>
          <div class="hme-fpick-body">
            ${r.every(u=>u.pieces.length===0)?m`<p class="hme-empty-line">No piece by that name${this.pickerGroup===""?"":` in ${this.pickerGroup}`}.</p>`:v}
            ${r.filter(u=>u.pieces.length>0).map(u=>m`<section class="hme-fpick-sec">
              <div class="hme-h">${u.title}<span class="hme-h-end">${S(u.pieces.length,"piece")}</span></div>
              <div class="hme-fgrid">${u.pieces.map(f=>{let g=i?.id===f.id;return m`<button type="button" class="hme-fcard ${g?"on":""}" aria-pressed=${g?"true":"false"}
                  title=${`${n===void 0?"Add":"Use"} ${f.name}, ${We(f)}`} @click=${()=>this.pickPiece(e,f)}>
                  ${this.piecePic(e,f,"hme-fcard-pic")}
                  <span class="hme-fcard-name">${f.name}</span>
                  <span class="hme-fcard-size mono">${We(f)}</span>
                </button>`})}</div>
            </section>`)}
          </div>
        </div>
      </div>
    </div>`}stopDrag(e){this.guides=[],this.dragging=!1,this.resizing=!1,e.preview(void 0)}focus(e){let t=ce(e.selection);return t===void 0?void 0:e.floor.rooms.find(o=>M(o.id,t))}pickedMany(e){if(e.selection?.kind==="objects")return ue(e.selection).flatMap(t=>{let o=e.floor.rooms.find(i=>M(i.id,t.roomId)),n=o?.objects[t.object];return o===void 0||n===void 0?[]:[{room:o,index:t.object,object:n}]})}picked(e){let t=e.selection;if(t?.kind!=="object")return;let o=this.focus(e),n=o?.objects[t.object];return o===void 0||n===void 0?void 0:{room:o,index:t.object,object:n}}thingUnder(e,t,o){return bn(e.floor,t,o)}pickThing(e,t,o){e.select({kind:"object",roomId:t.id,object:o})}overlay(e){if(this.draw.active)return this.draw.overlay(e);let t=this.focus(e),o=this.picked(e),n=this.pickedMany(e),i=[];for(let r of this.guides)i.push(this.guide(e,r));if(n!==void 0)for(let r of n){let a=he(pe(r.object)).map(d=>re(e.toScreen(d))).join(" ");i.push(k`<polygon class="hme-box" points=${a} fill="rgba(91,141,239,0.1)" stroke="#5b8def" stroke-width="2"
          stroke-dasharray=${r.object.hidden===!0?"5 4":"none"} pointer-events="none" />`)}else if(o!==void 0){let r=o.room.outline.map(d=>re(e.toScreen(d))).join(" ");i.push(k`<polygon points=${r} fill="none" stroke="#5b8def" stroke-width="1" stroke-dasharray="4 4" opacity="0.5" pointer-events="none" />`);let a=o.object;i.push(this.box(e,he(pe(a)),{width:a.size[0],depth:a.size[1]},"thing",a.hidden===!0))}else t!==void 0&&t.outline.length>=3&&i.push(this.box(e,gr(t),to(t),"room",!1));return i.length===0?v:k`${i}`}box(e,t,o,n,i){let r=t.map(y=>e.toScreen(y)),a=r.reduce((y,w)=>[y[0]+w[0]/4,y[1]+w[1]/4],[0,0]),d=y=>[(r[y][0]+r[(y+1)%4][0])/2,(r[y][1]+r[(y+1)%4][1])/2],l=y=>{let w=Math.max(Math.hypot(y[0]-a[0],y[1]-a[1]),1e-6);return[(y[0]-a[0])/w,(y[1]-a[1])/w]},p=[0,1,2,3].flatMap(y=>[r[y],d(y)]),h=[0,1,2,3].reduce((y,w)=>d(w)[1]<d(y)[1]?w:y,0),u=d(h),f=l(u),g=[u[0]+f[0]*44,u[1]+f[1]*44],c=[];for(let y of[[0,2],[1,3]]){let[w,H]=y,D=Math.abs(r[(w+1)%4][0]-r[w][0])>=Math.abs(r[(w+1)%4][1]-r[w][1])?l(d(w))[1]<=l(d(H))[1]?w:H:l(d(w))[0]<=l(d(H))[0]?w:H,j=r[D],A=r[(D+1)%4],K=l(d(D)),_=[j[0]+K[0]*20,j[1]+K[1]*20],I=[A[0]+K[0]*20,A[1]+K[1]*20],W=[(_[0]+I[0])/2,(_[1]+I[1])/2],xo=D%2===0?o.width:o.depth,ge=[K[0]*5,K[1]*5];c.push(k`<path d=${`M${re(_)}L${re(I)}M${re([_[0]-ge[0],_[1]-ge[1]])}L${re([_[0]+ge[0],_[1]+ge[1]])}M${re([I[0]-ge[0],I[1]-ge[1]])}L${re([I[0]+ge[0],I[1]+ge[1]])}`}
        stroke="#5b8def" stroke-width="1.2" fill="none" />
        <g class="hme-tag"><rect x=${N(W[0]-26)} y=${N(W[1]-9)} width="52" height="18" rx="9" fill="#5b8def" />
        <text x=${N(W[0])} y=${N(W[1]+4)} fill="#fff" text-anchor="middle">${xo.toFixed(2)} m</text></g>`)}let b=n==="room"?"Drag to resize the room. Shift keeps its proportions, Alt resizes it about its middle, Cmd or Ctrl stops it snapping.":"Drag to resize it. Shift keeps its proportions, Alt resizes it about its middle.";return k`<g class="hme-box">
      <polygon points=${r.map(re).join(" ")} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray=${i?"5 4":"none"} />
      ${this.resizing||!this.dragging?c:v}
      ${this.dragging?v:k`
        <line x1=${N(u[0])} y1=${N(u[1])} x2=${N(g[0])} y2=${N(g[1])} stroke="#5b8def" stroke-width="1.6" />
        ${p.map((y,w)=>k`<rect data-hme="resize" data-handle=${w} x=${N(y[0]-5)} y=${N(y[1]-5)} width="10" height="10"
          fill="#fff" stroke="#5b8def" stroke-width="1.6" style=${`cursor:${va(y[0]-a[0],y[1]-a[1])}`}>
          <title>${b}</title></rect>`)}
        <g data-hme="turn" style="cursor:grab" transform=${`translate(${re(g)})`}>
          <title>${n==="room"?"Drag to turn the room. Hold Alt to turn it freely.":"Drag to turn it. Hold Alt to turn it freely."}</title>
          <circle r="9" fill="#5b8def" />
          <path d="M-4 0a4 4 0 1 0 1.5-3.1M-4-4.5v2.5h2.5" fill="none" stroke="#fff" stroke-width="1.3" />
        </g>`}
    </g>`}guide(e,t){let o=e.toScreen(t.a),n=e.toScreen(t.b),i=Math.max(Math.hypot(n[0]-o[0],n[1]-o[1]),1e-6),r=[(n[0]-o[0])/i,(n[1]-o[1])/i],a=[o[0]-r[0]*40,o[1]-r[1]*40],d=[n[0]+r[0]*40,n[1]+r[1]*40],l=e.floor.rooms.find(u=>M(u.id,t.roomId)),p=`Lined up with ${l===void 0?"a":T(l)} wall`,h=p.length*6.2+20;return k`<g class="hme-guide" pointer-events="none">
      <line x1=${N(a[0])} y1=${N(a[1])} x2=${N(d[0])} y2=${N(d[1])} stroke="#ff4fa3" stroke-width="1.2" stroke-dasharray="6 4" />
      <g class="hme-tag"><rect x=${N(d[0]+6)} y=${N(d[1]-10)} width=${N(h)} height="20" rx="10" fill="#ff4fa3" />
      <text x=${N(d[0]+6+h/2)} y=${N(d[1]+4)} fill="#fff" text-anchor="middle">${p}</text></g>
    </g>`}pointerDown(e,t,o){return this.draw.active?this.draw.pointerDown(e,t,o):t.button!==0?!1:this.pressHandle(e,t,o)||this.pressBody(e,t,o)}pressHandle(e,t,o){let n=t.target?.closest?.("[data-hme]"),i=n?.getAttribute("data-hme");if(i!=="turn"&&i!=="resize")return!1;let r=ga[Number(n?.getAttribute("data-handle"))],a=this.picked(e),d=this.focus(e);if(a!==void 0){if(i==="turn")this.thingTurnDrag(e,t,a,o);else if(r!==void 0)this.thingResizeDrag(e,t,a,r,o);else return!1;return!0}if(d===void 0)return!1;if(i==="turn")this.turnDrag(e,t,d,o);else if(r!==void 0)this.resizeDrag(e,t,d,r,o);else return!1;return!0}pressThing(e,t,o,n){let i=e.floor.rooms.find(a=>M(a.id,o.roomId)),r=i?.objects[o.object];return i===void 0||r===void 0?!1:t.shiftKey||t.metaKey||t.ctrlKey?(e.select(je(e.selection,{roomId:i.id,object:o.object})),!0):(this.pickThing(e,i,o.object),this.thingMoveDrag(e,t,{room:i,index:o.object,object:r},n),!0)}pressBody(e,t,o){let n=this.thingUnder(e,o,void 0);if(t.metaKey||t.ctrlKey)return n!==void 0&&e.select(je(e.selection,{roomId:n.room.id,object:n.index})),n!==void 0||B(e.floor,o)!==void 0;if(n!==void 0)return this.pickThing(e,n.room,n.index),this.thingMoveDrag(e,t,n,o),!0;let i=B(e.floor,o);return i===void 0?!1:(e.select({kind:"room",roomId:i.id}),this.moveDrag(e,t,i,o),!0)}moveDrag(e,t,o,n){let i=e.doc,r=o.id,a=Te(o.outline),d=[0,0];e.drag(t,{move:(l,p)=>{let h=l[0]-n[0],u=l[1]-n[1];if(e.toggles.grid&&a!==void 0){let f=xe;h=Math.round((a.minX+h)/f)*f-a.minX,u=Math.round((a.minY+u)/f)*f-a.minY}if(this.guides=[],e.toggles.snap&&!p.altKey){let f=ri(i,r,h,u);f!==void 0&&(h=f.dx,u=f.dy,this.guides=f.guides)}this.dragging=!0,d=[h,u],e.preview(f=>Be(f,r,h,u))},end:(l,p,h)=>{this.stopDrag(e);let[u,f]=d;h&&(Math.abs(u)>=.005||Math.abs(f)>=.005)&&e.apply(g=>Be(g,r,u,f),{select:{kind:"room",roomId:r}})},cancel:()=>this.stopDrag(e)})}resizeDrag(e,t,o,n,i){let r=si(o);if(r===void 0)return;let a=e.doc,d=o.id,l=r.a1-r.a0,p=r.c1-r.c0;if(l<=1e-6||p<=1e-6)return;let h=c=>c[0]*r.u[0]+c[1]*r.u[1],u=c=>c[0]*r.v[0]+c[1]*r.v[1],f=c=>Math.min(Math.max(c,it),rt),g;e.drag(t,{move:(c,b)=>{let y=b.altKey?2:1,w=l,H=p;if(n.a!==void 0&&(w=l+(h(c)-h(i))*(n.a===1?1:-1)*y),n.c!==void 0&&(H=p+(u(c)-u(i))*(n.c===1?1:-1)*y),e.toggles.grid){let A=xe;n.a!==void 0&&(w=Math.round(w/A)*A),n.c!==void 0&&(H=Math.round(H/A)*A)}if(w=f(w),H=f(H),b.shiftKey){let A=w/l,K=H/p,_=n.a===void 0?K:n.c===void 0||Math.abs(Math.log(A))>=Math.abs(Math.log(K))?A:K;_=Math.min(Math.max(_,it/Math.min(l,p)),rt/Math.max(l,p)),w=l*_,H=p*_}let P=[b.altKey||n.a===void 0?.5:1-n.a,b.altKey||n.c===void 0?.5:1-n.c],D={width:w,depth:H,anchor:P};if(this.guides=[],e.toggles.snap&&!b.altKey&&!b.ctrlKey&&!b.metaKey){let A=di(a,d,D,n,{proportional:b.shiftKey});A!==void 0&&(D=A.resize,this.guides=A.guides)}this.dragging=!0,this.resizing=!0,g=D;let j=D;e.preview(A=>at(A,d,j))},end:(c,b,y)=>{this.stopDrag(e);let w=g;!y||w===void 0||Math.abs((w.width??l)-l)<.005&&Math.abs((w.depth??p)-p)<.005||e.apply(H=>at(H,d,w),{select:{kind:"room",roomId:d}})},cancel:()=>this.stopDrag(e)})}turnDrag(e,t,o,n){let i=o.id,r=q(o),a=Math.atan2(n[1]-r[1],n[0]-r[0]),d=0;e.drag(t,{move:(l,p)=>{let h=(Math.atan2(l[1]-r[1],l[0]-r[0])-a)*180/Math.PI;h=(h+540)%360-180,p.altKey||(h=Math.round(h/lo)*lo),this.dragging=!0,d=h,e.preview(u=>Se(u,i,h,r))},end:(l,p,h)=>{this.stopDrag(e),h&&Math.abs(d)>.01&&e.apply(u=>Se(u,i,d,r),{select:{kind:"room",roomId:i}})},cancel:()=>this.stopDrag(e)})}thingMoveDrag(e,t,o,n){let{room:i,index:r,object:a}=o,d=i.id,l=a.c,p=l;e.drag(t,{move:(h,u)=>{let f=[l[0]+h[0]-n[0],l[1]+h[1]-n[1]];if(e.toggles.grid){let c=xe;f=[Math.round(f[0]/c)*c,Math.round(f[1]/c)*c]}if(this.guides=[],e.toggles.snap&&!u.altKey){let c=xi(i,a,f);f=c.c,this.guides=c.guides}this.dragging=!0,p=f;let g=f;e.preview(c=>Ge(c,d,r,g))},end:(h,u,f)=>{if(this.stopDrag(e),f&&Math.hypot(p[0]-l[0],p[1]-l[1])>=.005){let g=p;e.apply(c=>Ge(c,d,r,g),{select:{kind:"object",roomId:d,object:r}})}},cancel:()=>this.stopDrag(e)})}thingResizeDrag(e,t,o,n,i){let{room:r,index:a,object:d}=o,l=r.id,{u:p,v:h}=$i(d),u=Math.max(d.size[0],Ue),f=Math.max(d.size[1],Ue),g=w=>w[0]*p[0]+w[1]*p[1],c=w=>w[0]*h[0]+w[1]*h[1],b=w=>Math.min(Math.max(w,Ue),Nt),y;e.drag(t,{move:(w,H)=>{let P=H.altKey?2:1,D=u,j=f;if(n.a!==void 0&&(D=u+(g(w)-g(i))*(n.a===1?1:-1)*P),n.c!==void 0&&(j=f+(c(w)-c(i))*(n.c===1?1:-1)*P),e.toggles.grid){let _=xe;n.a!==void 0&&(D=Math.round(D/_)*_),n.c!==void 0&&(j=Math.round(j/_)*_)}if(D=b(D),j=b(j),H.shiftKey){let _=D/u,I=j/f,W=n.a===void 0?I:n.c===void 0||Math.abs(Math.log(_))>=Math.abs(Math.log(I))?_:I;W=Math.min(Math.max(W,Ue/Math.min(u,f)),Nt/Math.max(u,f)),D=u*W,j=f*W}let A=[H.altKey||n.a===void 0?.5:1-n.a,H.altKey||n.c===void 0?.5:1-n.c];this.dragging=!0,this.resizing=!0;let K={width:D,depth:j,anchor:A};y=K,e.preview(_=>dt(_,l,a,K))},end:(w,H,P)=>{this.stopDrag(e);let D=y;!P||D===void 0||Math.abs((D.width??u)-d.size[0])<.005&&Math.abs((D.depth??f)-d.size[1])<.005||e.apply(j=>dt(j,l,a,D),{select:{kind:"object",roomId:l,object:a}})},cancel:()=>this.stopDrag(e)})}thingTurnDrag(e,t,o,n){let{room:i,index:r,object:a}=o,d=i.id,l=a.c,p=Math.atan2(n[1]-l[1],n[0]-l[0]),h=0;e.drag(t,{move:(u,f)=>{let g=(Math.atan2(u[1]-l[1],u[0]-l[0])-p)*180/Math.PI;g=(g+540)%360-180,f.altKey||(g=Math.round(g/lo)*lo),this.dragging=!0,h=-g;let c=h;e.preview(b=>Ie(b,d,r,c))},end:(u,f,g)=>{this.stopDrag(e);let c=h;g&&Math.abs(c)>.01&&e.apply(b=>Ie(b,d,r,c),{select:{kind:"object",roomId:d,object:r}})},cancel:()=>this.stopDrag(e)})}hover(e,t){this.draw.hover(e,t)}keyDown(e,t){if(this.draw.active)return this.draw.keyDown(e,t);let o=this.pickedMany(e);if(o!==void 0)return this.manyKeyDown(e,t,o);let n=this.focus(e);if(n===void 0)return!1;let i=te(t,!1),r=this.picked(e);if(r!==void 0){let{index:a,object:d}=r,l={kind:"room",roomId:n.id};if(i==="delete")return e.apply(p=>jt(p,n.id,a),{select:l}),!0;if(i==="cancel")return e.select(l),!0;if(typeof i=="object"&&"nudge"in i){let[p,h]=i.nudge;return e.apply(u=>Ge(u,n.id,a,[d.c[0]+p,d.c[1]+h])),!0}return!1}if(i==="delete")return this.askDelete(e,n),!0;if(typeof i=="object"&&"nudge"in i){let[a,d]=i.nudge;return e.apply(l=>Be(l,n.id,a,d)),!0}return!1}manyKeyDown(e,t,o){let n=te(t,!1),i=kt(o);if(n==="delete")return this.askDeleteThings(e,o),!0;if(n==="cancel")return e.select(Dr(o)),!0;if(typeof n=="object"&&"nudge"in n){let[r,a]=n.nudge;return e.apply(d=>Mi(d,i,r,a)),!0}return!1}async askDeleteThings(e,t){let o=kt(t);await e.confirm({title:`Delete ${S(t.length,"thing")}?`,text:`${Sr(t)} come off the map. Undo brings them back while this page is open.`,ok:"Delete",danger:!0})&&e.apply(i=>ki(i,o),{select:Dr(t)??null})}cursor(){return this.draw.active?"crosshair":void 0}leave(e){this.draw.stop(e),this.picker=void 0,this.guides=[],this.dragging=!1,this.resizing=!1}dock(e){return m`<button type="button" class="hme-tb ${e.toggles.snap?"on":""}" aria-pressed=${e.toggles.snap?"true":"false"}
        title="Snap to walls: a dragged room lines up with the walls round it. Hold Alt to move it freely." @click=${()=>e.setToggle("snap",!e.toggles.snap)}>Snap</button>`}viewItems(e){return[{label:"Grid 10 cm",on:e.toggles.grid,title:"Points land on a 10 cm grid, drawn on the plan",flip:()=>e.setToggle("grid",!e.toggles.grid)}]}pill(e){if(this.draw.active)return m`<span class="hme-pill-name">${this.draw.hint()}</span>
        ${this.draw.points.length>=3?m`<button type="button" class="hme-tb" @click=${()=>{this.draw.finish(e)}}>Close the room</button>`:v}
        <button type="button" class="hme-tb" @click=${()=>this.draw.stop(e)}>Cancel</button>`;let t=this.pickedMany(e);if(t!==void 0){let r=kt(t),a=t.some(d=>d.object.hidden!==!0);return m`<span class="hme-pill-name">${S(t.length,"thing")}</span>
        <button type="button" class="hme-tb" title=${a?"Hide every picked thing":"Show every picked thing"}
          @click=${()=>e.apply(d=>zt(d,r,a))}>${a?"Hide":"Show"}</button>
        <button type="button" class="hme-tb danger" @click=${()=>{this.askDeleteThings(e,t)}}>Delete</button>`}let o=this.focus(e);if(o===void 0||this.dragging)return v;let n=o.id,i=this.picked(e);if(i!==void 0){let{index:r,object:a}=i;return m`<span class="hme-pill-name">${ae(a)}</span>
        <button type="button" class="hme-tb" @click=${()=>e.apply(d=>Ie(d,n,r,90))}>⟲ Turn 90°</button>
        <button type="button" class="hme-tb" title="Turn it square with the room's walls" @click=${()=>e.apply(d=>No(d,n,r))}>Line up</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(d=>Ft(d,n,r,a.hidden!==!0))}>${a.hidden===!0?"Show":"Hide"}</button>
        <button type="button" class="hme-tb" @click=${()=>e.select({kind:"room",roomId:n})}>${T(o)} ›</button>
        <button type="button" class="hme-tb danger" @click=${()=>e.apply(d=>jt(d,n,r),{select:{kind:"room",roomId:n}})}>Remove</button>`}return m`<span class="hme-pill-name">${T(o)}</span>
      <button type="button" class="hme-tb" @click=${()=>e.apply(r=>Se(r,n,90))}>⟲ Turn 90°</button>
      <button type="button" class="hme-tb" @click=${()=>e.apply(r=>be(r,n))}>Square the corners</button>
      <button type="button" class="hme-tb" title="Turn it to the floor's walls and slide it onto the nearest wall line, as the iPhone does"
        @click=${()=>e.apply(r=>ai(r,n))}>Snap to walls</button>
      ${this.floorMenu(e,o,"Move to floor","hme-tb")}
      <button type="button" class="hme-tb danger" @click=${()=>{this.askDelete(e,o)}}>Delete</button>`}floorMenu(e,t,o,n){let i=e.doc.floors.filter(r=>!M(r.id,e.floor.id));return hn({label:o,cls:n,options:[...i.map(r=>({value:r.id,label:z(r)})),{value:"new",label:"New floor\u2026"}],pick:r=>{this.moveToFloor(e,t,r)}})}async moveToFloor(e,t,o){let n=t.id,i={kind:"room",roomId:n};if(o!=="new"){e.apply(l=>Oo(l,n,{floorId:o}),{select:i,floorId:o});return}let r=Math.max(...e.doc.floors.map(l=>l.story))+1,a=await e.ask({title:"A new floor",label:"Name",value:r===1?"Upstairs":`Floor ${r+1}`,ok:"Move the room there"});if(a===void 0)return;let d=e.newId();e.apply(l=>Oo(l,n,{newFloor:{id:d,name:a,story:r}}),{select:i,floorId:d})}async askDelete(e,t){let o=Ao(e.floor,t.id).length;await e.confirm({title:`Delete ${T(t)}?`,text:ba(t,o),ok:"Delete room",danger:!0})&&e.apply(i=>hi(i,t.id),{select:null})}inspector(e){let t=this.pickedMany(e);if(t!==void 0)return this.manyInspector(e,t);let o=this.focus(e);if(o===void 0)return this.floorCard(e,e.floor);let n=this.picked(e);if(n!==void 0)return this.thingInspector(e,n);let i=o.id,r=to(o),a=jn(e.floor,e.toggles.live?e.hass?.states:void 0).has(o.id),d=Te(o.outline)??{minX:0,minY:0,maxX:0,maxY:0},l=Math.round(-ni(o)*10)/10,p=o.areaId===void 0||e.areas.some(c=>c.id===o.areaId),h=e.areas.find(c=>c.id===o.areaId)?.name,u=o.pageId===void 0||e.pages.some(c=>M(c.id,o.pageId)),f=Jn(o),g=this.edits(e);return m`
      <section class="hme-card hme-head">
        ${kr(o,a)}
        <div class="hme-head-t">
          <strong>${T(o)}</strong>
          <span>${oo(o)} · ${r.area.toFixed(1)} m²${h===void 0?"":` \xB7 ${h} area`}</span>
          <span>${z(e.floor)} · double-click to edit its walls</span>
        </div>
      </section>

      ${this.inRoomCard(e,o)}

      ${E("Room",m`
        ${O("Name",et({value:o.name??"",label:"Name",placeholder:"Room",set:c=>e.apply(b=>mi(b,i,c))}))}
        ${O("Area",Fe({label:"Area",value:o.areaId??"",options:[{value:"",label:"None"},...p?[]:[{value:o.areaId,label:`Not in Home Assistant (${o.areaId})`,disabled:!0}],...e.areas.map(c=>({value:c.id,label:c.name}))],set:c=>e.apply(b=>ci(b,i,c===""?void 0:c))}))}
        ${V("The Home Assistant area. Add lists its devices first.")}
        ${O("Tap opens",Fe({label:"Tap opens",value:o.pageId??"",options:[{value:"",label:"Nothing"},...u?[]:[{value:o.pageId,label:"A page not in your library",disabled:!0}],...e.pages.map(c=>({value:c.id,label:`Page: ${c.name}`}))],set:c=>e.apply(b=>ui(b,i,c===""?void 0:c))}))}
        ${V("What a tap on this room does on the map tiles and the watch.")}`)}

      ${E("Size",m`
        ${wt(F({tag:"W",label:"Width",value:r.width,unit:"m",min:it,max:rt,...g((c,b)=>at(c,i,{width:b}))}),F({tag:"D",label:"Depth",value:r.depth,unit:"m",min:it,max:rt,...g((c,b)=>at(c,i,{depth:b}))}),F({tag:"H",label:"Wall height",value:o.height,unit:"m",min:.5,max:20,...g((c,b)=>st(c,i,b))}))}
        <p class="hme-foot-hint">Along its own walls, about its middle; its doors, things and devices move with it.</p>`)}

      ${E("Place",m`
        ${yt("Corner",wt(F({tag:"X",label:"Left",value:d.minX,unit:"m",...g((c,b)=>Be(c,i,b-d.minX,0))}),F({tag:"Y",label:"Top",value:d.minY,unit:"m",...g((c,b)=>Be(c,i,0,b-d.minY))})))}
        ${yt("Turn",m`<div class="hme-turn">
          ${F({label:"Turn",value:l,unit:"\xB0",digits:1,min:-180,max:180,...g((c,b)=>Se(c,i,b-l))})}
          <button type="button" class="hme-tb" @click=${()=>e.apply(c=>Se(c,i,-90))}>−90°</button>
          <button type="button" class="hme-tb" @click=${()=>e.apply(c=>Se(c,i,90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it so its longest wall runs straight across or down" @click=${()=>e.apply(c=>ii(c,i))}>Level</button>
        </div>`)}
        <p class="hme-foot-hint">Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the room to move it, a square handle to resize it, the round one to turn it.</p>
        ${O("Floor",Fe({label:"Floor",value:e.floor.id,options:[...e.doc.floors.map(c=>({value:c.id,label:z(c)})),{value:"new",label:"New floor\u2026"}],set:c=>{this.moveToFloor(e,o,c)}}))}`)}

      ${E("Floor finish",m`<div class="hme-pics">
        ${J({label:`Auto: ${Cr[f]}`,picture:mn(f),on:o.finish===void 0,title:"Picked from the room's name and furniture",click:()=>e.apply(c=>_o(c,i,void 0))})}
        ${On.map(c=>J({label:Cr[c],picture:mn(c),on:o.finish===c,click:()=>e.apply(b=>_o(b,i,c))}))}
      </div>
        ${this.roomColourRow(e,o,"floorColor")}
        ${this.roomColourRow(e,o,"wallColor")}
        <p class="hme-foot-hint">On the plan, the night, warm and clay looks and in 3D, here, on the iPhone and on the watch. The line looks keep their own colour.</p>`)}

      ${E("Walls and more",m`
        <div class="hme-r tight"><span class="hme-grow">${o.openings.length===0?"No doors or windows":[...new Set(o.openings.map($e))].join(", ")}</span>
          <button type="button" class="hme-link" title="Edit this room's corners, walls, doors and windows (or double-click the room)"
            @click=${()=>e.editWalls(i)}>Edit walls ›</button></div>
        <div class="hme-row-end">
          ${hn({label:"\uFF0B Add a plain box",cls:"hme-tb",options:fi.map(c=>({value:c,label:vt(c)})),pick:c=>{let b=U(o)??q(o);e.apply(y=>gi(y,i,c,b))}})}
          <button type="button" class="hme-tb danger push" @click=${()=>{this.askDelete(e,o)}}>Delete room</button>
        </div>`)}`}inRoomCard(e,t){let o=e.floor,n=e.toggles.live?e.hass?.states:void 0,i=e.selection,r=t.id,a=[],d=[];t.objects.forEach((c,b)=>{let y={roomId:r,object:b},w=ae(c),H=c.hidden===!0,P=Ye(o,r,b),D=ho(c)||P!==void 0&&P.entityId.startsWith("light."),j=Rr(e,{sel:{kind:"object",...y},picked:xr(i,r,b),hidden:H,icon:D?m`<span class="hme-ly-lamp ${P!==void 0&&Ir(P.entityId,n)?"lit":""}" aria-hidden="true"></span>`:m`<span class="hme-thing-ic" aria-hidden="true"></span>`,name:w,end:H?"hidden":P!==void 0?`${Y(P,e.hass)} \xB7 ${ee(P.entityId,n)}`:D?"no light":`${c.size[0].toFixed(1)} \xD7 ${c.size[1].toFixed(1)}`,title:"Pick it to move, resize or turn it. Cmd or Ctrl and a click picks several.",pick:A=>e.select(A.metaKey||A.ctrlKey?je(e.selection,y):{kind:"object",...y}),eye:()=>e.apply(A=>Ft(A,r,b,!H))});(D?a:d).push(j)});let l=Ao(o,r).filter(c=>Z(o,c.id)===void 0),p=c=>Rr(e,{sel:{kind:"pin",pinId:c.id},picked:ne(i).some(b=>M(b,c.id)),hidden:!1,icon:m`<span class="hme-dot dev ${Ir(c.entityId,n)||!c.entityId.startsWith("light.")?"":"off"}" aria-hidden="true"></span>`,name:Y(c,e.hass),end:c.entityId.startsWith("light.")?`${ee(c.entityId,n)} \xB7 in no lamp`:ee(c.entityId,n),title:"Pick it to set its height, glow and tap. Shift, Cmd or Ctrl and a click picks several.",pick:b=>e.select(b.shiftKey||b.metaKey||b.ctrlKey?Le(e.selection,c.id):{kind:"pin",pinId:c.id})}),h=l.filter(c=>c.entityId.startsWith("light.")).map(p),u=l.filter(c=>!c.entityId.startsWith("light.")).map(p),f=a.length+h.length+d.length+u.length,g=(c,b)=>b.length===0?v:m`<div class="hme-ly-grp">${c}</div>${b}`;return E("In this room",m`<div class="hme-ly-list">
        ${f===0?m`<p class="hme-empty-line">Nothing in it yet. Add furniture and devices so the map reads.</p>`:v}
        ${g("Lamps and lights",[...a,...h])}
        ${g("Furniture",d)}
        ${g("Devices",u)}
      </div>
      <button type="button" class="hme-tb hme-wide" title="Add devices or furniture to this room" @click=${()=>e.openAdd()}>＋ Add to ${T(t)}</button>`,String(f),"hme-inroom")}edits(e){return t=>({set:o=>e.apply(n=>t(n,o)),preview:o=>e.preview(o===void 0?void 0:n=>t(n,o))})}thingInspector(e,t){let{room:o,index:n,object:i}=t,r=o.id,a=ae(i),[d,l,p]=i.size,h=Ma(i),u=this.edits(e),f={kind:"room",roomId:r},g={unit:"m",min:Ue,max:Nt};return m`
      <section class="hme-card hme-head">
        <div class="hme-head-t">
          <strong>${a}</strong>
          <span>In ${T(o)} · ${d.toFixed(2)} × ${l.toFixed(2)} × ${p.toFixed(2)} m${(i.lift??0)>0?` \xB7 ${(i.lift??0).toFixed(2)} m up`:""}${i.hidden===!0?" \xB7 Hidden":""}</span>
        </div>
      </section>

      ${this.modelCard(e,t)}

      ${this.coloursCard(e,t)}

      ${E("Size",m`
        ${wt(F({tag:"W",label:"Width",value:d,...g,...u((c,b)=>dt(c,r,n,{width:b}))}),F({tag:"D",label:"Depth",value:l,...g,...u((c,b)=>dt(c,r,n,{depth:b}))}),F({tag:"H",label:"Height",value:p,...g,min:.01,...u((c,b)=>Fo(c,r,n,{size:[d,l,b]}))}))}`)}

      ${E("Place",m`
        ${yt("Middle, and up off the floor",wt(F({tag:"X",label:"Middle across",value:i.c[0],unit:"m",...u((c,b)=>Ge(c,r,n,[b,i.c[1]]))}),F({tag:"Y",label:"Middle down",value:i.c[1],unit:"m",...u((c,b)=>Ge(c,r,n,[i.c[0],b]))}),F({tag:"Z",label:"Up off the floor",value:i.lift??0,unit:"m",min:0,max:100,...u((c,b)=>Fo(c,r,n,{lift:b}))})))}
        ${yt("Turn",m`<div class="hme-turn">
          ${F({label:"Turn",value:h,unit:"\xB0",digits:1,min:-180,max:180,...u((c,b)=>Ie(c,r,n,b-h))})}
          <button type="button" class="hme-tb" title="Turn it a quarter one way" @click=${()=>e.apply(c=>Ie(c,r,n,-90))}>−90°</button>
          <button type="button" class="hme-tb" title="Turn it a quarter the other way" @click=${()=>e.apply(c=>Ie(c,r,n,90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it square with the room's walls" @click=${()=>e.apply(c=>No(c,r,n))}>Line up</button>
        </div>`)}
        <p class="hme-foot-hint">Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the thing to move it, a square handle to resize it, the round one to turn it.</p>`)}

      ${E("Show",m`
        <div class="hme-r tight"><span class="hme-grow">On the map, the tiles and the watch</span>
          ${Mt({on:i.hidden!==!0,onText:"Shown",offText:"Hidden",label:`${a} shown`,click:()=>e.apply(c=>Ft(c,r,n,i.hidden!==!0))})}</div>
        <p class="hme-foot-hint">Scan Again on the iPhone puts the room's things back where the scan finds them. A hidden thing stays hidden.</p>
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${()=>e.select(f)}>‹ ${T(o)}</button>
          <button type="button" class="hme-tb danger push" @click=${()=>e.apply(c=>jt(c,r,n),{select:f})}>Remove</button>
        </div>`)}`}manyInspector(e,t){let o=kt(t),n=[...new Set(t.map(a=>T(a.room)))],i=ie(t.map(a=>a.object.hidden===!0)),r=ya.filter(a=>t.some(d=>$n(d.object).includes(a)));return m`
      <section class="hme-card hme-head">
        <div class="hme-head-t">
          <strong>${S(t.length,"thing")}</strong>
          <span>${Sr(t)} · in ${n.join(", ")}</span>
        </div>
      </section>

      ${E("Picked",m`${t.map(a=>m`<div class="hme-list-row hme-pick-row">
          <button type="button" class="hme-grow hme-link ${a.object.hidden===!0?"dim":""}" title="Pick this one alone"
            @click=${()=>this.pickThing(e,a.room,a.index)}>${ae(a.object)}</button>
          <span class="hme-val">${T(a.room)}</span>
          <button type="button" class="hme-x" aria-label=${`Leave ${ae(a.object)} out of the pick`} title="Leave it out of the pick"
            @click=${()=>e.select(je(e.selection,{roomId:a.room.id,object:a.index}))}>×</button></div>`)}
        <p class="hme-foot-hint">Cmd or Ctrl and a click on the plan or in 3D adds a thing or takes one away. The arrow keys move them all.</p>`,String(t.length))}

      ${r.length===0?v:E("Colours",m`
        ${r.map(a=>this.manyColourRow(e,t,a))}
        <p class="hme-foot-hint">Set on every picked thing whose piece has that part. In the 3D view and on the iPhone.</p>`)}

      ${E("Show",m`
        <div class="hme-r tight"><span class="hme-grow">On the map, the tiles and the watch</span>
          ${i.mixed?m`<button type="button" class="hme-chip off" aria-pressed="mixed" aria-label="Shown" title="Some are hidden: show them all"
                @click=${()=>e.apply(a=>zt(a,o,!1))}>Mixed</button>`:Mt({on:!i.value,onText:"Shown",offText:"Hidden",label:"Shown",click:()=>e.apply(a=>zt(a,o,!i.value))})}</div>
        <div class="hme-row-end">
          <button type="button" class="hme-tb danger push" @click=${()=>{this.askDeleteThings(e,t)}}>Delete ${S(t.length,"thing")}</button>
        </div>`)}`}manyColourRow(e,t,o){let n=t.filter(a=>$n(a.object).includes(o)),i=kt(n),r=ie(n.map(a=>a.object[o]?.toUpperCase()));return kn({word:o==="fabric"?"Fabric":"Wood",presets:o==="fabric"?Yo:Zo,now:r.mixed?void 0:r.value,mixed:r.mixed,defaultTitle:"Each model's own colour",customTitle:`Any ${o} colour`,customLabel:`Pick a ${o} colour for every picked thing`,set:a=>e.apply(d=>zo(d,i,o,a)),preview:a=>e.preview(a===void 0?void 0:d=>zo(d,i,o,a)??d)})}modelCard(e,t){let{room:o,index:n,object:i}=t,r=ht(i),a=pt(i.model),d=a!==void 0?`${a.group}, picked from the catalog`:i.model!==void 0?r===void 0?"A piece this panel does not know yet":`A piece this panel does not know yet, drawn as the ${r.name.toLowerCase()} meanwhile`:r!==void 0?`Picked by its kind: ${vt(i.kind)}`:"A plain box, as the scan found it";return E("Model",m`<div class="hme-model">
        ${this.piecePic(e,r,"hme-model-pic")}
        <div class="hme-model-t"><strong>${r?.name??"Plain box"}</strong><span>${d}</span></div>
        <button type="button" class="hme-tb push" title="Pick another piece from the furniture catalog; it keeps its place, size and turn"
          @click=${()=>this.openPicker(e,o,n)}>Change…</button>
      </div>
      <p class="hme-foot-hint">What it looks like in the 3D view and on the iPhone. The flat plan and the tiles draw it as before.</p>`)}coloursCard(e,t){let o=$n(t.object);return o.length===0?v:E("Colours",m`
      ${o.map(n=>this.colourRow(e,t,n))}
      <p class="hme-foot-hint">In the 3D view and on the iPhone. The flat plan, the tiles and the furniture picker keep the model's own colours.</p>`)}colourRow(e,t,o){let{room:n,index:i,object:r}=t,a=n.id;return kn({word:o==="fabric"?"Fabric":"Wood",presets:o==="fabric"?Yo:Zo,now:r[o],defaultTitle:"The model's own colour",customTitle:`Any ${o} colour`,customLabel:`Pick a ${o} colour`,set:l=>e.apply(p=>jo(p,a,i,o,l)),preview:l=>e.preview(l===void 0?void 0:p=>jo(p,a,i,o,l)??p)})}roomColourRow(e,t,o){let n=t.id,i=o==="floorColor";return kn({word:i?"Floor":"Walls",presets:i?ua[At(t)]:fa,now:t[o],defaultTitle:i?"The finish's own colour":"The look's own wall colour",customTitle:i?"Any floor colour":"Any wall colour",customLabel:i?"Pick a floor colour":"Pick a wall colour",set:r=>e.apply(a=>Lo(a,n,o,r)),preview:r=>e.preview(r===void 0?void 0:a=>Lo(a,n,o,r)??a)})}floorCard(e,t){let o=Tt(t,e.toggles.live?e.hass?.states:void 0),n=t.rooms.reduce((i,r)=>i+r.objects.length,0);return E("Floor",m`
      ${O("Name",et({value:t.name,label:"Floor name",placeholder:z(t),set:i=>e.apply(r=>Lt(r,t.id,i))}))}
      ${O("On it",m`<span class="hme-val">${S(t.rooms.length,"room")} · ${S(n,"thing")} · ${S(t.pins.length,"device")} · ${Ct(o)}</span>`)}`)}};var mo=Math.PI/4,Hn=8,Pe="#ffbf55",x=s=>s.toFixed(1);function ka(s,e){return`${nr(s.domain)} \xB7 ${ee(s.entityId,e)}`}function $a(s,e){let t=de(s,e);if(t===void 0)return"Not in a room";let o=B(s,e.at);return o!==void 0&&M(o.id,t.id)?`${T(t)} (found by place)`:T(t)}function xa(s,e,t){return s.icon!==void 0?Zt[s.icon]:`Auto (${Zt[me(s.entityId,e,t)].toLowerCase()})`}var Ar={ceiling:"Ceiling",floor:"Floor",table:"Table",wall:"Wall",bulb:"Just a bulb"},Fr="wa-home-map-lamp-choice";function jr(){try{return globalThis.localStorage??void 0}catch{return}}function Ha(){try{let s=jr()?.getItem(Fr);return _t.includes(s)?s:void 0}catch{return}}function Pa(s){try{jr()?.setItem(Fr,s)}catch{}}var ze=s=>s.startsWith("light."),Ea=16,co=class{constructor(e){this.picture=e;this.side=!0;this.names=!1;this.moving=!1;this.iconsOpen=!1;this.pickPage=!1;this.chooserFocus=!1}states(e){return e.toggles.live?e.hass?.states:void 0}picked(e){let t=e.selection;return t?.kind==="pin"?e.floor.pins.find(o=>M(o.id,t.pinId)):void 0}picks(e){return ne(e.selection).flatMap(t=>e.floor.pins.filter(o=>M(o.id,t)))}deviceClass(e,t){let o=e.hass?.states?.[t]?.attributes?.device_class;return typeof o=="string"?o:void 0}friendly(e,t){let o=e.hass?.states?.[t]?.attributes?.friendly_name;return typeof o=="string"&&o.trim()!==""?o.trim():void 0}place(e,t,o,n){let i=_e(e.doc,t);if(i!==void 0)return M(i.floorId,e.floor.id)||e.setFloor(i.floorId),e.select({kind:"pin",pinId:i.pinId}),!1;let r=nn(e.floor,n),a=o??(r===void 0?ke(e.view,[e.stage.width/2,e.stage.height/2]):U(r)??q(r)),d=e.newId().toUpperCase(),l=e.floor.id,p=this.friendly(e,t),h=e.apply(u=>Di(u,l,{id:d,entityId:t,at:[a[0],a[1]],...p===void 0?{}:{name:p}}),{select:{kind:"pin",pinId:d}});return h||e.note("warn","That device could not be put on the map: the map holds at most 400 devices."),h}deviceRow(e,t,o){let n=ze(t.entityId),i=n?void 0:_e(e.doc,t.entityId),r=n?Xt(e.doc,t.entityId).length:0,a=me(t.entityId,t.deviceClass,t.name),d=()=>n?this.addLight(e,t.entityId,void 0,t.areaId):this.place(e,t.entityId,void 0,t.areaId),l=n?"Drag onto the plan or onto a lamp, or click to add it in its area's room. A light can be on the map many times.":i===void 0?"Drag onto the plan, or click to put it in its area's room":"On the map: click to pick it";return m`<div class="hme-dv ${this.dragging===t.entityId?"dragging":""} ${i===void 0?"":"placed"}" role="button" tabindex="0"
      draggable=${i===void 0?"true":"false"} title=${l}
      @dragstart=${p=>{p.dataTransfer?.setData(Jt,t.entityId),n&&p.dataTransfer?.setData(Qo,t.entityId),p.dataTransfer?.setData("text/plain",t.entityId),p.dataTransfer&&(p.dataTransfer.effectAllowed="copy"),this.dragging=t.entityId,e.redraw()}}
      @dragend=${()=>{this.dragging=void 0,this.dropAt=void 0,this.lampOver=void 0,e.redraw()}}
      @click=${d}
      @keydown=${p=>{p.target===p.currentTarget&&(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),d())}}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${Q(a,"currentColor",24,2)}</svg></span>
      <span class="hme-dv-nm">${t.name}<small>${i===void 0?ka(t,o):"on the map"}</small></span>
      ${r===0?v:m`<button type="button" class="hme-dv-count" title="Pick the next one on the map"
        @click=${p=>{p.stopPropagation(),this.pickNext(e,t.entityId)}}
        @keydown=${p=>p.stopPropagation()}>${r} on map</button>`}
      <span class="hme-dv-grip" aria-hidden="true">${i===void 0?"\u22EE\u22EE":"\u203A"}</span>
    </div>`}pickNext(e,t){let o=e.doc.floors.flatMap(l=>l.pins.filter(p=>p.entityId===t).map(p=>({floor:l,pin:p})));if(o.length===0)return;let n=e.selection,i=n?.kind==="pin"?n.pinId:n?.kind==="object"?Ye(e.floor,n.roomId,n.object)?.id:void 0,r=i===void 0?-1:o.findIndex(l=>M(l.pin.id,i)),a=o[(r+1)%o.length];M(a.floor.id,e.floor.id)||e.setFloor(a.floor.id);let d=Z(a.floor,a.pin.id);e.select(d===void 0?{kind:"pin",pinId:a.pin.id}:{kind:"object",roomId:d.roomId,object:d.object})}addLight(e,t,o,n){let i=o===void 0?nn(e.floor,n??en(e.hass,t)):void 0,r=o??(i===void 0?ke(e.view,[e.stage.width/2,e.stage.height/2]):U(i)??q(i)),a=B(e.floor,r)??i,d=Ha();this.chooser={entityId:t,at:[r[0],r[1]],roomId:a?.id,choice:a===void 0?"bulb":d??"ceiling"},this.chooserFocus=!0,e.redraw()}get choosing(){return this.chooser!==void 0}cancelChooser(e){this.chooser=void 0,e.redraw()}canChoose(e){return e==="bulb"||this.chooser?.roomId!==void 0}takeChoice(e,t){let o=this.chooser;if(o===void 0)return;let n=t??o.choice;if(!this.canChoose(n))return;this.chooser=void 0,Pa(n);let i=e.newId().toUpperCase(),r=e.floor.id,a=o.roomId===void 0?void 0:e.doc.floors.find(h=>M(h.id,r))?.rooms.find(h=>M(h.id,o.roomId)),d=this.friendly(e,o.entityId),l=n!=="bulb"&&a!==void 0?{kind:"object",roomId:a.id,object:a.objects.length}:{kind:"pin",pinId:i};e.apply(h=>Fi(h,r,o.roomId,o.entityId,n,o.at,i,d)?.doc,{select:l})||e.note("warn","That light could not be put on the map: the map holds at most 400 devices, and a room at most 256 things.")}chooserKey(e,t){let o=this.chooser;if(o===void 0)return!1;switch(t.key){case"Enter":return this.takeChoice(e),!0;case"Escape":return this.cancelChooser(e),!0;case"ArrowLeft":case"ArrowUp":case"ArrowRight":case"ArrowDown":{let n=_t.filter(r=>this.canChoose(r)),i=t.key==="ArrowLeft"||t.key==="ArrowUp"?-1:1;return o.choice=n[(n.indexOf(o.choice)+i+n.length)%n.length]??o.choice,this.chooserFocus=!0,e.redraw(),!0}case"Delete":case"Backspace":return!0;default:return!1}}lampChooser(e){let t=this.chooser;if(t===void 0)return v;let o=e.toScreen(t.at),n=e.toScreen(e.toPlan(0,0)),i=o[0]-n[0],r=o[1]-n[1],a=344,d=globalThis.innerWidth??1/0,l=i+22+a>d?Math.max(8,i-22-a):i+22,p=t.roomId===void 0?void 0:e.floor.rooms.find(f=>M(f.id,t.roomId)),h=this.chooserFocus;this.chooserFocus=!1;let u=this.friendly(e,t.entityId)??t.entityId;return m`<div class="hme-scrim hme-lamp-scrim" @pointerdown=${f=>{f.target===f.currentTarget&&this.cancelChooser(e)}}>
      <div class="hme-lampc" role="dialog" aria-label="Which lamp is it in?" style=${`left:${Math.round(l)}px;top:${Math.round(Math.max(8,r-64))}px;width:${a}px`}
        @keydown=${f=>{this.chooserKey(e,f)&&(f.preventDefault(),f.stopPropagation())}}>
        <div class="hme-lampc-t"><strong>${u}</strong>
          <span>${p===void 0?"In no room, so just a bulb.":`In ${T(p)}. Which lamp is it in?`}</span></div>
        <div class="hme-lampc-row" role="group" aria-label="Lamp">
          ${_t.map(f=>{let g=f===t.choice,c=this.canChoose(f),b=ti[f];return m`<button type="button" class="hme-lampc-b ${g?"on":""}" aria-pressed=${g?"true":"false"} ?disabled=${!c}
              title=${c?Ar[f]:"A lamp goes in a room"}
              ${Ae(y=>{h&&g&&y!==void 0&&setTimeout(()=>y.focus?.(),0)})}
              @click=${()=>this.takeChoice(e,f)}>
              ${b===void 0||this.picture===void 0?m`<span class="hme-lampc-pic bulb"><svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">${Q("bulb","currentColor",24,1.8)}</svg></span>`:this.picture(e,b,"hme-lampc-pic")}
              <span>${Ar[f]}</span></button>`})}
        </div>
        <p class="hme-lampc-hint">Enter takes the ringed one · Esc cancels</p>
      </div>
    </div>`}emptyThingAt(e,t,o,n=e.floor){let i=e.toScreen(t),r;for(let a of n.rooms)a.objects.forEach((d,l)=>{if(d.hidden===!0||(o?Do(d.model)===void 0:d.kind==="rug")||Ye(n,a.id,l)!==void 0)return;let p=e.toScreen(d.c),h=Math.hypot(p[0]-i[0],p[1]-i[1]);h>Ea&&!le(he(pe(d)),t)||(r===void 0||h<r.d)&&(r={ref:{roomId:a.id,object:l},d:h})});return r?.ref}heldThingAt(e,t){let o=this.pinAt(e,e.toScreen(t));return o===void 0?void 0:Z(e.floor,o.id)}lampMark(e,t){let o=e.floor.rooms.find(l=>M(l.id,t.roomId))?.objects[t.object];if(o===void 0)return v;let n=he(pe(o)).map(l=>e.toScreen(l).map(x).join(",")).join(" "),[i,r]=e.toScreen(o.c),a=ho(o)?"Put it in this lamp":`Put it on this ${ae(o)}`,d=a.length*6.4+20;return k`<g class="hme-lamp-over" pointer-events="none">
      <circle cx=${x(i)} cy=${x(r)} r="22" fill="rgba(255,191,85,0.22)" stroke=${Pe} stroke-width="2" stroke-dasharray="4 3" />
      <polygon points=${n} fill="rgba(255,191,85,0.3)" stroke=${Pe} stroke-width="2" />
      <g class="hme-tag"><rect x=${x(i-d/2)} y=${x(r+28)} width=${x(d)} height="18" rx="9" fill=${Pe} />
        <text x=${x(i)} y=${x(r+41)} fill="#3a2600" text-anchor="middle">${a}</text></g>
    </g>`}dragOver(e,t,o){let n=[...o.dataTransfer?.types??[]],i=this.dragging!==void 0||n.includes(Jt),r=this.dragging!==void 0?ze(this.dragging):n.includes(Qo),a=this.dropAt,d=this.lampOver;return this.dropAt=i?t:void 0,this.lampOver=i&&t!==void 0?this.emptyThingAt(e,t,r):void 0,(a!==this.dropAt||JSON.stringify(d)!==JSON.stringify(this.lampOver))&&e.redraw(),i&&t!==void 0}drop(e,t,o){let n=this.dragging??o.dataTransfer?.getData(Jt)??"";if(this.dragging=void 0,this.dropAt=void 0,this.lampOver=void 0,n===""){e.redraw();return}let i=ze(n),r=this.emptyThingAt(e,t,i);if(r===void 0){i?this.addLight(e,n,t):this.place(e,n,t);return}this.putOn(e,r,n)}putOn(e,t,o){let n=e.floor.id,i=ze(o)?void 0:_e(e.doc,o),r={select:{kind:"object",...t}};if(i!==void 0)return M(i.floorId,n)?e.apply(l=>qt(l,n,t.roomId,t.object,i.pinId),r):(e.note("warn","That device is on another floor's map. Remove it there first to put it here."),!1);let a=e.newId().toUpperCase(),d=e.apply(l=>zi(l,n,t.roomId,t.object,o,a),r);return d||e.note("warn","That device could not be put on it: the map holds at most 400 devices."),d}overlay(e){let t=this.states(e),o=this.picked(e),n=ne(e.selection),i=[],r=this.lampOver===void 0?v:this.lampMark(e,this.lampOver);r!==v?i.push(r):this.dropAt!==void 0&&i.push(this.dropMark(e,this.dropAt));let a=o===void 0?void 0:oe(o.entityId,t);o!==void 0&&a?.kind==="light"&&i.push(this.glowRing(e,o,a.on?a.brightness:void 0));for(let d of e.floor.pins){let l=n.some(p=>M(d.id,p));i.push(this.pinMark(e,d,l,!1,t))}return this.box!==void 0&&i.push(this.boxMark(e,this.box)),k`${i}`}boxMark(e,t){let[o,n]=e.toScreen(t.a),[i,r]=e.toScreen(t.b);return k`<rect class="hme-box" x=${x(Math.min(o,i))} y=${x(Math.min(n,r))} width=${x(Math.abs(i-o))} height=${x(Math.abs(r-n))}
      fill="rgba(91,141,239,0.12)" stroke="#5b8def" stroke-width="1.2" stroke-dasharray="4 3" pointer-events="none" />`}pinMark(e,t,o,n,i){let[r,a]=e.toScreen(t.at),d=oe(t.entityId,i),l=d.kind==="light"&&d.on,p=l?Ze(t)??Pe:"rgba(36,36,40,0.92)",h=l?"#fff3d6":d.kind==="gone"?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.4)",u=l?"#3a2600":d.kind==="lock"?d.locked?"#30d158":"#ff9f0a":d.kind==="other"&&d.on?"#ffffff":d.kind==="gone"?"#8e8e93":"#d1d1d6",f=t.icon??me(t.entityId,this.deviceClass(e,t.entityId),this.friendly(e,t.entityId)),g=o?13:12,c=o||this.names?Y(t,e.hass):qi(t,i),b=c===void 0?0:c.length*5.9+14;return k`<g class="hme-pin" data-hme="pin" data-pin=${t.id} transform=${`translate(${x(r)} ${x(a)})`} opacity=${n?.25:1} style="cursor:grab">
      ${o?k`<circle r="20" fill="none" stroke="#5b8def" stroke-width="2.5" />`:v}
      ${l?k`<circle r=${g+7} fill=${p} opacity="0.22" />`:v}
      <circle r=${g} fill=${p} stroke=${h} stroke-width="1.2" />
      <g transform="translate(-7 -7)">${Q(f,u,14,1.5)}</g>
      ${c===void 0||c===""?v:k`<g pointer-events="none"><rect x=${x(-b/2)} y=${g+4} width=${x(b)} height="16" rx="8" fill=${o?"#5b8def":"rgba(0,0,0,0.7)"} />
        <text y=${g+15.5} fill="#fff" font-size="10" font-weight="600" text-anchor="middle">${c}</text></g>`}
    </g>`}glowRing(e,t,o){let[n,i]=e.toScreen(t.at),r=mt(t,o),a=e.px(r),d=[n+a*Math.cos(mo),i+a*Math.sin(mo)],l=`Glow ${r.toFixed(1)} m`,p=l.length*6.2+18,h=t.glowSpill===!0?void 0:de(e.floor,t),u=h!==void 0&&h.outline.length>=3?h.outline.map(g=>e.toScreen(g).map(x).join(",")).join(" "):void 0,f=g=>k`<circle cx=${x(n)} cy=${x(i)} r=${x(a)} fill="none" stroke=${Ze(t)??"#5b8def"} stroke-width="1.4"
      stroke-dasharray="5 5" opacity=${g} pointer-events="none" />`;return k`<g class="hme-glow-ring">
      ${u===void 0?f(1):k`<clipPath id="hme-glow-walls"><polygon points=${u} /></clipPath>
        ${f(.28)}<g clip-path="url(#hme-glow-walls)">${f(1)}</g>`}
      <circle data-hme="glow" cx=${x(d[0])} cy=${x(d[1])} r="7" fill="#fff" stroke="#5b8def" stroke-width="2" style="cursor:nwse-resize">
        <title>Drag to set how far this light's glow reaches</title></circle>
      <g class="hme-tag" pointer-events="none"><rect x=${x(d[0]-p/2)} y=${x(d[1]+12)} width=${x(p)} height="18" rx="9" fill="#5b8def" />
        <text x=${x(d[0])} y=${x(d[1]+25)} fill="#fff" text-anchor="middle">${l}</text></g>
    </g>`}dropMark(e,t){let o=B(e.floor,t),[n,i]=e.toScreen(t),r=o===void 0?"Drop here, in no room":`Drop in ${T(o)}`,a=r.length*6.4+20;return k`<g class="hme-drop" pointer-events="none">
      ${o===void 0?v:k`<polygon points=${o.outline.map(d=>e.toScreen(d).map(x).join(",")).join(" ")}
        fill="rgba(91,141,239,0.18)" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />`}
      <circle cx=${x(n)} cy=${x(i)} r="13" fill="rgba(91,141,239,0.35)" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 2" />
      <g class="hme-tag"><rect x=${x(n-a/2)} y=${x(i+20)} width=${x(a)} height="18" rx="9" fill="#5b8def" />
        <text x=${x(n)} y=${x(i+33)} fill="#fff" text-anchor="middle">${r}</text></g>
    </g>`}pinAt(e,t){return vn(e.floor,e.toScreen,t)}pointerDown(e,t,o){return t.button!==0?!1:this.pressHandle(e,t,o)||this.pressPin(e,t,o)||this.pressBox(e,t,o)}pressHandle(e,t,o){let n=this.picked(e);if(n===void 0||t.shiftKey||t.metaKey||t.ctrlKey)return!1;let i=oe(n.entityId,this.states(e));if(i.kind!=="light")return!1;let r=e.toScreen(o),[a,d]=e.toScreen(n.at),l=e.px(mt(n,i.on?i.brightness:void 0));return Math.hypot(r[0]-(a+l*Math.cos(mo)),r[1]-(d+l*Math.sin(mo)))>10?!1:(this.glowDrag(e,t,n),!0)}onPin(e,t){return this.pinAt(e,e.toScreen(t))!==void 0}pressBox(e,t,o){return t.shiftKey?(this.boxDrag(e,t,o),!0):!1}pressPin(e,t,o){let n=t.shiftKey||t.metaKey||t.ctrlKey,i=this.pinAt(e,e.toScreen(o));if(i===void 0)return!1;if(this.pickPage=!1,this.iconsOpen=!1,n)return e.select(Le(e.selection,i.id)),!0;let r=ne(e.selection);return r.length>1&&r.some(a=>M(a,i.id))?(this.groupDrag(e,t,r,i.id,o),!0):(e.select({kind:"pin",pinId:i.id}),this.moveDrag(e,t,i,o),!0)}groupDrag(e,t,o,n,i){let r=[0,0],a=Oe(o);e.drag(t,{move:d=>{this.moving=!0,r=[d[0]-i[0],d[1]-i[1]];let[l,p]=r;e.preview(h=>Ut(h,o,l,p))},end:(d,l,p)=>{this.moving=!1,e.preview(void 0);let[h,u]=r;p?Math.hypot(h,u)>=.005&&e.apply(f=>Ut(f,o,h,u),a===void 0?{}:{select:a}):e.select({kind:"pin",pinId:n})},cancel:()=>this.stopDrag(e)})}stopDrag(e){this.moving=!1,this.box=void 0,this.lampOver=void 0,e.preview(void 0)}boxDrag(e,t,o){let n=e.floor.pins,i=e.selection;e.drag(t,{move:r=>{this.box={a:o,b:r},e.redraw()},end:(r,a,d)=>{this.box=void 0,d?e.select(ir(i,rr(n,o,r))):e.redraw()},cancel:()=>this.stopDrag(e)})}async removePicks(e,t){t.length!==0&&(t.length>1&&!await e.confirm({title:`Remove ${S(t.length,"device")} from the map?`,text:"They come off the map, and Add can put them back. Undo puts them back where they were.",ok:"Remove",danger:!0})||e.apply(o=>_i(o,t),{select:null}))}moveDrag(e,t,o,n){let i=o.id,r=e.floor,a=r.id,d=[o.at[0],o.at[1]],l=Z(r,i)===void 0,p=ze(o.entityId),h=d;e.drag(t,{move:u=>{this.moving=!0,h=[d[0]+u[0]-n[0],d[1]+u[1]-n[1]];let f=l?this.emptyThingAt(e,h,p,r):void 0;this.lampOver=f,e.preview(f===void 0?g=>Vo(g,i,h):g=>qt(g,a,f.roomId,f.object,i))},end:(u,f,g)=>{let c=this.lampOver;this.moving=!1,this.lampOver=void 0,e.preview(void 0),g&&c!==void 0?e.apply(b=>qt(b,a,c.roomId,c.object,i),{select:{kind:"object",...c}}):g&&Math.hypot(h[0]-d[0],h[1]-d[1])>=.005&&e.apply(b=>Vo(b,i,h),{select:{kind:"pin",pinId:i}})},cancel:()=>this.stopDrag(e)})}glowDrag(e,t,o){let n=o.id,i;e.drag(t,{move:r=>{this.moving=!0;let a=Math.hypot(r[0]-o.at[0],r[1]-o.at[1]);i=Math.min(Math.max(Math.round(a/.05)*.05,ot),Ln);let d=i;e.preview(l=>Re(l,n,{glow:d}))},end:()=>{this.moving=!1,e.preview(void 0);let r=i;r!==void 0&&e.apply(a=>Re(a,n,{glow:r}))},cancel:()=>this.stopDrag(e)})}keyDown(e,t){let o=this.picks(e).map(i=>i.id);if(o.length===0)return!1;let n=te(t,!1);if(n==="delete")return this.removePicks(e,o),!0;if(typeof n=="object"&&"nudge"in n){let[i,r]=n.nudge;return e.apply(a=>Ut(a,o,i,r)),!0}return!1}leave(){this.dragging=void 0,this.dropAt=void 0,this.box=void 0,this.moving=!1,this.iconsOpen=!1,this.pickPage=!1,this.chooser=void 0,this.lampOver=void 0}viewItems(e){return[{label:"Side view",on:this.side,title:"The picked device's room from the side, to set its height",flip:()=>{this.side=!this.side,e.redraw()}},{label:"Names",on:this.names,title:"Every device's name under its pin",flip:()=>{this.names=!this.names,e.redraw()}}]}stageExtra(e){let t=this.picked(e);if(!this.side||t===void 0)return v;let o=de(e.floor,t),n=o?.height??2.5,i=Te(o?.outline??e.floor.rooms.flatMap(P=>P.outline))??{minX:t.at[0]-1,maxX:t.at[0]+1,minY:0,maxY:0},r=18,a=118,d=(a-r)/Math.max(n,.5),l=30,p=262,h=(p-l)/Math.max(i.maxX-i.minX,.5),u=P=>l+(Math.min(Math.max(P,i.minX),i.maxX)-i.minX)*h,f=t.at[2],g=a-Math.min(Math.max(f,0),n)*d,c=u(t.at[0]),b=(()=>{let P=oe(t.entityId,this.states(e));return P.kind==="light"&&P.on})(),y=[];for(let P=0;P<=n+1e-9;P+=1)y.push(P);let w=o===void 0?[]:Fn(o),H=o===void 0?"No room":T(o);return m`<div class="hme-side">
      <div class="hme-h">${H} from the side</div>
      <svg viewBox="0 0 270 130" role="img" aria-label=${`Side view: ${Y(t,e.hass)} at ${f.toFixed(2)} m, the wall ${n.toFixed(1)} m tall`}
        @pointerdown=${P=>this.heightDrag(e,P,t,n,a,d)}>
        <path d=${`M${l} ${x(r)}H${p}M${l} ${a}H${p}`} stroke="#ece6da" stroke-width="3" />
        <path d=${`M${l} ${x(r)}V${a}M${p} ${x(r)}V${a}`} stroke="#ece6da" stroke-width="1.5" opacity="0.4" />
        <g font-size="9" fill="#8e8e93" text-anchor="end" class="mono">
          ${y.map(P=>k`<text x=${l-6} y=${x(a-P*d+3)}>${P===0?"0":`${P} m`}</text>
            <path d=${`M${l-4} ${x(a-P*d)}H${l}`} stroke="#8e8e93" />`)}
        </g>
        ${w.map(P=>{let D=u(P.c[0]-P.size[0]/2),j=u(P.c[0]+P.size[0]/2),A=Math.min(P.size[2],n)*d;return k`<rect x=${x(D)} y=${x(a-A)} width=${x(Math.max(j-D,2))} height=${x(A)} rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" />`})}
        <path d=${`M${x(c)} ${a}V${x(g)}`} stroke="#5b8def" stroke-width="1.2" stroke-dasharray="3 3" />
        ${b?k`<circle cx=${x(c)} cy=${x(g)} r="20" fill="#ffb648" opacity="0.22" />`:v}
        <circle cx=${x(c)} cy=${x(g)} r="9" fill=${b?Pe:"#3a3a3c"} stroke="#5b8def" stroke-width="2.5" style="cursor:ns-resize" />
        <g class="hme-tag"><rect x=${x(Math.min(c+14,222))} y=${x(g-8)} width="44" height="16" rx="8" fill="#5b8def" />
          <text x=${x(Math.min(c+14,222)+22)} y=${x(g+3.5)} fill="#fff" font-size="10" text-anchor="middle">${f.toFixed(2)} m</text></g>
      </svg>
      <span class="hme-side-hint">Drag the pin up or down here.</span>
    </div>`}heightDrag(e,t,o,n,i,r){if(t.button!==0)return;let a=t.currentTarget,d=o.id,l=f=>{let g=a.getBoundingClientRect(),c=(f.clientY-g.top)*130/Math.max(g.height,1);return Math.min(Math.max(Math.round((i-c)/r/.05)*.05,0),n)},p=l(t);try{a.setPointerCapture(t.pointerId)}catch{}this.moving=!0,e.preview(f=>we(f,d,p));let h=f=>{p=l(f);let g=p;e.preview(c=>we(c,d,g))},u=()=>{a.removeEventListener("pointermove",h),a.removeEventListener("pointerup",u),a.removeEventListener("pointercancel",u),this.moving=!1,e.preview(void 0);let f=p;Math.abs(f-o.at[2])>=.005&&e.apply(g=>we(g,d,f))};a.addEventListener("pointermove",h),a.addEventListener("pointerup",u),a.addEventListener("pointercancel",u)}pill(e){let t=this.picks(e);if(t.length>1&&!this.moving)return this.groupPill(e,t);let o=this.picked(e);if(o===void 0||this.moving)return v;let n=o.id,i=o.entityId.startsWith("light."),r=de(e.floor,o)!==void 0;return m`<span class="hme-pill-name">${Y(o,e.hass)}</span>
      ${Qt(o.entityId)&&e.hass!==void 0?m`<button type="button" class="hme-tb" @click=${()=>this.toggle(e,o.entityId)}>${eo(o.entityId,e.hass.states)}</button>`:v}
      ${i?m`<button type="button" class="hme-tb" title="Every light on this floor at this light's height" @click=${()=>e.apply(a=>Ai(a,n))}>Same height for all lights</button>`:v}
      ${r?m`<button type="button" class="hme-tb" @click=${()=>e.apply(a=>Oi(a,n))}>Center in room</button>`:v}
      <button type="button" class="hme-tb danger" @click=${()=>e.apply(a=>Xo(a,n),{select:null})}>Remove</button>`}groupPill(e,t){let o=t.map(d=>d.id),n=t[0],i=n.at[2],r=t.every(d=>Math.abs(d.at[2]-i)<.005),a=e.hass===void 0?void 0:ar(t.map(d=>d.entityId),e.hass.states);return m`<span class="hme-pill-name">${S(t.length,"device")}</span>
      ${a===void 0?v:m`<button type="button" class="hme-tb" @click=${()=>this.turn(e,t.map(d=>d.entityId),a.service)}>${a.words}</button>`}
      <button type="button" class="hme-tb" ?disabled=${r} title=${r?"They are all at one height":`Every picked device at ${Y(n,e.hass)}'s height, ${i.toFixed(2)} m`}
        @click=${()=>e.apply(d=>qe(d,o,i))}>Same height</button>
      <button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(e,o)}}>Remove</button>`}toggle(e,t){let o=e.hass;o!==void 0&&Ho(o,"homeassistant","toggle",{entity_id:t}).catch(n=>{e.note("err",`Could not turn it on or off: ${n instanceof Error?n.message:String(n)}`)})}turn(e,t,o){let n=e.hass;n!==void 0&&Ho(n,"homeassistant",o,{entity_id:[...t]}).catch(i=>{e.note("err",`Could not turn them ${o==="turn_on"?"on":"off"}: ${i instanceof Error?i.message:String(i)}`)})}inspector(e){let t=this.picks(e);if(t.length>1)return this.groupInspector(e,t);let o=this.picked(e);if(o===void 0)return v;let n=e.hass?.states,i=o.id,r=oe(o.entityId,n),a=r.kind==="light"&&r.on,d=this.friendly(e,o.entityId),l=this.deviceClass(e,o.entityId),p=me(o.entityId,l,d),h=o.icon??p,f=de(e.floor,o)?.height??2.5,g=y=>e.apply(w=>Re(w,i,y,d)),b=Ze(o)??Pe;return m`
      <section class="hme-card hme-head">
        <span class="hme-pin-big ${a?"lit":""}" style=${a?`background:${b};box-shadow:0 0 24px ${b}80`:""}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${Q(h,a?"#3a2600":"#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${Y(o,e.hass)}</strong>
          <span class="mono">${o.entityId}</span>
        </div>
        <span class="hme-state ${a?"lit":""}">${ee(o.entityId,n)}</span>
      </section>

      ${E("On the map",m`
        ${O("Name",et({value:o.name??"",label:"Name on the map",placeholder:d??o.entityId,set:y=>g({name:y.trim()===""?null:y})}))}
        ${this.iconRows(e,o,g)}
        ${O("Room",m`<span class="hme-in hme-ro">${$a(e.floor,o)}</span>`)}
        ${Lr(o,b,g)}`)}

      ${E("Height",m`
        <div class="hme-r">
          <input class="hme-range" type="range" min="0" max=${f} step="0.05" .value=${G(String(o.at[2]))} aria-label="Height" style=${Ke(o.at[2],0,f)}
            @input=${y=>{let w=Number(y.target.value);e.preview(H=>we(H,i,w))}}
            @change=${y=>{let w=Number(y.target.value);e.apply(H=>we(H,i,w))}} />
          ${F({label:"Height",value:o.at[2],unit:"m",min:0,max:100,width:"92px",set:y=>e.apply(w=>we(w,i,y))})}
        </div>
        <div class="hme-chips">${tn.map(([y,w])=>m`<button type="button" class="hme-chip sel ${Math.abs(o.at[2]-w)<.005?"on":""}"
          @click=${()=>e.apply(H=>we(H,i,w))}>${y} ${w}</button>`)}</div>
        <p class="hme-text dim">The model looks stand the pin at this height.</p>`)}

      ${o.entityId.startsWith("light.")?this.lightCard(e,o,r.kind==="light"&&r.on?r.brightness:void 0,g):v}

      ${this.tapCard(e,o,g)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>e.apply(y=>Xo(y,i),{select:null})}>Remove from the map</button></div>`}iconRows(e,t,o){let n=this.friendly(e,t.entityId),i=this.deviceClass(e,t.entityId),r=me(t.entityId,i,n),a=t.icon??r;return m`${O("Icon",m`<button type="button" class="hme-in hme-icon-btn" aria-haspopup="true" aria-expanded=${this.iconsOpen?"true":"false"}
        @click=${()=>{this.iconsOpen=!this.iconsOpen,e.redraw()}}>
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">${Q(a,"currentColor",24,2)}</svg>
        <span class="hme-grow">${xa(t,i,n)}</span><span class="hme-caret" aria-hidden="true">▾</span></button>`)}
      ${this.iconsOpen?this.iconMenu(e,t,r,o):v}`}iconMenu(e,t,o,n){let i=a=>{this.iconsOpen=!1,n({icon:a}),e.redraw()},r=(a,d,l,p)=>m`<button type="button" class="hme-icon-cell ${l?"on":""}"
      title=${d} aria-label=${d} aria-pressed=${l?"true":"false"} @click=${()=>i(p)}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">${Q(a,"currentColor",24,1.9)}</svg><span>${d}</span></button>`;return m`<div class="hme-icons" role="group" aria-label="Icon">
      ${r(o,"Auto",t.icon===void 0,null)}
      ${_n.map(a=>r(a,Zt[a],t.icon===a,a))}
    </div>`}lightCard(e,t,o,n){return E("Light",this.glowRows(e,t,o,n))}glowRows(e,t,o,n){let i=t.id,r=mt(t,o),a=Ze(t),d=(l,p,h)=>m`<button type="button" class="hme-chip sel ${p?"on":""}" aria-pressed=${p?"true":"false"} @click=${h}>${l}</button>`;return m`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        <input class="hme-range" type="range" min=${ot} max=${Math.max(Hn,r)} step="0.05" .value=${G(String(r))} aria-label="Glow size"
          style=${Ke(r,ot,Math.max(Hn,r))}
          @input=${l=>{let p=Number(l.target.value);e.preview(h=>Re(h,i,{glow:p}))}}
          @change=${l=>n({glow:Number(l.target.value)})} />
        <span class="hme-val mono hme-w48">${r.toFixed(1)} m</span></div>
      <div class="hme-row-end indent">${d("By its brightness",t.glow===void 0,()=>n({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${d("Follow the light",t.glowColor===void 0,()=>n({glowColor:null}))}
        ${d("Warm",t.glowColor==="warm",()=>n({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${a!==void 0?"on":""}">${a===void 0?v:m`<span class="hme-swatch" style=${`background:${a}`}></span>`}Pick
          ${bt({value:a??"#ffb648",label:"Pick the glow's color",preview:l=>e.preview(l===void 0?void 0:p=>Re(p,i,{glowColor:l})??p),set:l=>n({glowColor:l})})}</label>
      </div></div>
      ${Or(t.glowSpill===!0?"off":"on",l=>n({glowSpill:l?null:!0}))}
      ${V("The pool of light round this light on the plan and the tiles. Warm is the lamplight every light has without a color of its own.")}`}thingCards(e,t,o){let n=e.floor.rooms.find(I=>M(I.id,t)),i=n?.objects[o];if(n===void 0||i===void 0)return v;let r=ho(i)||Do(i.model)!==void 0,a=r?"Light":"Device",d=ae(i),l=e.floor.id,p=Ye(e.floor,n.id,o),h=I=>r?`Put ${I} in this lamp`:`Put ${I} on this ${d}`;if(p===void 0){let I=()=>e.openAdd("devices",{title:r?"Choose a light for this lamp":`Choose a device for this ${d}`,lightsOnly:r,rowTitle:h,pick:W=>{this.putOn(e,{roomId:n.id,object:o},W)||e.redraw()}});return E(a,m`
        ${O(a,m`<span class="hme-in hme-ro dim">None</span>`,m`<button type="button" class="hme-tb" aria-haspopup="dialog" title=${r?"Pick the light this lamp holds":`Pick the device this ${d} is or carries`}
            @click=${I}>Choose…</button>`)}
        ${V(r?"Pick the light this lamp holds, or drag its light's pin onto it on the plan.":`The device this ${d} is or carries, a TV's media player or a fan's switch: choose it, or drag its pin onto it on the plan.`)}`)}let u=e.hass?.states,f=p.id,g=ze(p.entityId),c=oe(p.entityId,u),b=c.kind==="light"&&c.on,y=this.friendly(e,p.entityId),w=I=>e.apply(W=>Re(W,f,I,y)),H=p.icon??me(p.entityId,this.deviceClass(e,p.entityId),y),P=Ze(p)??Pe,D=e.doc.floors.find(I=>M(I.id,l))?.rooms.find(I=>M(I.id,n.id)),j=()=>{let I=e.newId().toUpperCase(),W=D===void 0?null:{kind:"object",roomId:n.id,object:D.objects.length};e.apply(xo=>Ni(xo,l,n.id,o,I)?.doc,{select:W})||e.note("warn","Another lamp could not be added: the map holds at most 400 devices, and a room at most 256 things.")},A=()=>e.openAdd("devices",{title:r?"Change the light in this lamp":`Change the device on this ${d}`,lightsOnly:r,now:p.entityId,rowTitle:h,pick:I=>{if(!ze(I)&&_e(e.doc,I)!==void 0){e.note("warn","That device is on the map already. Drag its pin onto this instead."),e.redraw();return}e.apply(W=>Ki(W,f,I))||e.redraw()}}),K=r?"lamp":d,_=g?"light":"device";return m`${E(a,m`
        <div class="hme-lamp-light">
          <span class="hme-pin-big ${b?"lit":""}" style=${b?`background:${P};box-shadow:0 0 24px ${P}80`:""}>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${Q(H,b?"#3a2600":"#d1d1d6",24,2)}</svg></span>
          <div class="hme-head-t hme-grow">
            <strong>${Y(p,e.hass)}</strong>
            <span class="mono">${p.entityId}</span>
          </div>
          <span class="hme-state ${b?"lit":""}">${ee(p.entityId,u)}</span>
        </div>
        ${O("Name",et({value:p.name??"",label:"Name on the map",placeholder:y??p.entityId,set:I=>w({name:I.trim()===""?null:I})}))}
        ${O(a,m`<span class="hme-in hme-ro mono">${p.entityId}</span>`,m`<button type="button" class="hme-tb" aria-haspopup="dialog" title=${r?"Show another of the home's lights in this lamp":`Show another of the home's devices on this ${d}`}
            @click=${A}>Change…</button>`)}
        ${g?this.glowRows(e,p,b?c.brightness:void 0,w):v}
        ${this.iconRows(e,p,w)}
        ${Lr(p,P,w)}
        <div class="hme-row-end">
          ${Qt(p.entityId)&&e.hass!==void 0?m`<button type="button" class="hme-tb" @click=${()=>this.toggle(e,p.entityId)}>${eo(p.entityId,u)}</button>`:v}
          ${g?m`<button type="button" class="hme-tb" title=${`Another of this ${K} beside it, holding the same light: a light group in many lamps`} @click=${j}>Add another</button>`:v}
          <button type="button" class="hme-tb push" title=${`The ${K} lets go of the ${_}; both stay where they are`} @click=${()=>e.apply(I=>ji(I,l,n.id,o))}>Unlink</button>
        </div>
        <p class="hme-foot-hint">${r&&g?"The light sits in the lamp: move, lift or turn the lamp and the light goes with it.":`The ${_} sits on the ${K}: move, lift or turn the ${K} and the ${_} goes with it.`}</p>`)}
      ${this.tapCard(e,p,w)}`}groupInspector(e,t){let o=e.hass?.states,n=t.map(h=>h.id),i=h=>{e.apply(u=>Vt(u,n,h))||e.note("warn","That could not be set on every picked device.")},r=Math.max(2.5,...t.map(h=>de(e.floor,h)?.height??2.5)),a=ie(t.map(h=>h.at[2])),d=ie(t.map(h=>h.reading)),l=t.every(h=>h.entityId.startsWith("light.")),p=Pe;return m`
      <section class="hme-card hme-head">
        <span class="hme-pin-big"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${Q("bulb","#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${S(t.length,"device")}</strong>
          <span>Shift, Cmd or Ctrl and a click adds or takes one away</span>
        </div>
      </section>

      ${E("Picked",m`${t.map(h=>m`<div class="hme-list-row hme-pick-row">
          <button type="button" class="hme-grow hme-link" title="Pick this one alone" @click=${()=>e.select({kind:"pin",pinId:h.id})}>${Y(h,e.hass)}</button>
          <span class="hme-val">${ee(h.entityId,o)}</span>
          <button type="button" class="hme-x" aria-label=${`Leave ${Y(h,e.hass)} out of the pick`} title="Leave it out of the pick"
            @click=${()=>e.select(Le(e.selection,h.id))}>×</button></div>`)}`,String(t.length))}

      ${E("On the map",m`
        <div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
          ${J({label:"None",picture:tt("none",p),on:!d.mixed&&d.value==="none",click:()=>i({reading:"none"})})}
          ${J({label:"Pill",picture:tt("pill",p),on:!d.mixed&&d.value===void 0,title:"Each one's reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>i({reading:null})})}
          ${J({label:"Name",picture:tt("name",p),on:!d.mixed&&d.value==="name",click:()=>i({reading:"name"})})}
        </div></div>
        ${d.mixed?V("Mixed: they show different things. Pick one to set them all."):v}`)}

      ${E("Height",m`
        <div class="hme-r">
          ${_r({label:"Height",value:a.mixed?void 0:a.value,min:0,max:r,step:.05,preview:h=>e.preview(u=>qe(u,n,h)),set:h=>e.apply(u=>qe(u,n,h))})}
          ${F({label:"Height",value:a.mixed?void 0:a.value,unit:"m",min:0,max:100,width:"92px",set:h=>e.apply(u=>qe(u,n,h))})}
        </div>
        <div class="hme-chips">${tn.map(([h,u])=>m`<button type="button" class="hme-chip sel ${t.every(f=>Math.abs(f.at[2]-u)<.005)?"on":""}"
          @click=${()=>e.apply(f=>qe(f,n,u))}>${h} ${u}</button>`)}</div>
        <p class="hme-text dim">Every picked device at this height.</p>`)}

      ${l?this.groupLightCard(e,t,i):v}

      ${this.groupTapCard(e,t,i)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(e,n)}}>Remove ${S(t.length,"device")} from the map</button></div>`}groupLightCard(e,t,o){let n=t.map(g=>g.id),i=this.states(e),r=t.map(g=>{let c=oe(g.entityId,i);return Math.round(mt(g,c.kind==="light"&&c.on?c.brightness:void 0)*20)/20}),a=ie(r),d=Math.max(Hn,...r),l=t.every(g=>g.glow===void 0),p=ie(t.map(g=>g.glowColor?.toLowerCase())),h=ie(t.map(g=>g.glowSpill===!0)),u=p.mixed||p.value===void 0||p.value==="warm"?void 0:p.value,f=(g,c,b)=>m`<button type="button" class="hme-chip sel ${c?"on":""}" aria-pressed=${c?"true":"false"} @click=${b}>${g}</button>`;return E("Light",m`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        ${_r({label:"Glow size",value:a.mixed?void 0:a.value,min:ot,max:d,step:.05,preview:g=>e.preview(c=>Vt(c,n,{glow:g})),set:g=>o({glow:g})})}
        <span class="hme-val mono hme-w48">${a.mixed?"Mixed":`${a.value.toFixed(1)} m`}</span></div>
      <div class="hme-row-end indent">${f("By its brightness",l,()=>o({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${f("Follow the light",!p.mixed&&p.value===void 0,()=>o({glowColor:null}))}
        ${f("Warm",!p.mixed&&p.value==="warm",()=>o({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${u!==void 0?"on":""}">${u===void 0?v:m`<span class="hme-swatch" style=${`background:${u}`}></span>`}Pick
          ${bt({value:u??"#ffb648",label:"Pick the glow's color for every picked light",preview:g=>e.preview(g===void 0?void 0:c=>Vt(c,n,{glowColor:g})??c),set:g=>o({glowColor:g})})}</label>
      </div></div>
      ${p.mixed?V("Mixed: their colors differ. Pick one to set them all."):v}
      ${Or(h.mixed?"mixed":h.value?"off":"on",g=>o({glowSpill:g?null:!0}))}`)}groupTapCard(e,t,o){let n=ie(t.map(l=>[l.tap,l.tap==="page"?l.pageId?.toLowerCase():void 0])),i=n.mixed?void 0:n.value,r=i?.[0]==="page"||this.pickPage,a=i?.[0]==="page"?t[0].pageId:void 0,d=l=>{if(l==="page"){e.pages.length===1?o({tap:"page",pageId:e.pages[0].id}):(this.pickPage=!0,e.redraw());return}this.pickPage=!1,o({tap:l??null})};return E("Tap on the map",m`
      <div class="hme-chips">${on.map(([l,p])=>{let h=l==="page"?r:!this.pickPage&&i!==void 0&&i[0]===l;return m`<button type="button" class="hme-chip sel ${h?"on":""}" aria-pressed=${h?"true":"false"}
          ?disabled=${l==="page"&&e.pages.length===0} title=${l==="page"&&e.pages.length===0?"Your library has no pages":""}
          @click=${()=>d(l)}>${p}</button>`})}</div>
      ${r?O("Page",Fe({label:"Page",value:a??"",options:[...a===void 0?[{value:"",label:"Pick a page\u2026",disabled:!0}]:[],...a===void 0||e.pages.some(l=>M(l.id,a))?[]:[{value:a,label:"A page not in your library",disabled:!0}],...e.pages.map(l=>({value:l.id,label:l.name}))],set:l=>{this.pickPage=!1,l!==""&&o({tap:"page",pageId:l})}})):v}
      <p class="hme-text dim">${n.mixed&&!this.pickPage?"Mixed: a tap does different things on them. Pick one to set them all.":"Set on every picked device."}</p>`)}tapCard(e,t,o){let n=t.tap==="page"||this.pickPage,i=t.pageId===void 0||e.pages.some(a=>M(a.id,t.pageId)),r=a=>{if(a==="page"){if(t.tap==="page")return;e.pages.length===1?o({tap:"page",pageId:e.pages[0].id}):(this.pickPage=!0,e.redraw());return}this.pickPage=!1,o({tap:a??null})};return E("Tap on the map",m`
      <div class="hme-chips">${on.map(([a,d])=>{let l=a==="page"?n:!this.pickPage&&t.tap===a;return m`<button type="button" class="hme-chip sel ${l?"on":""}" aria-pressed=${l?"true":"false"}
          ?disabled=${a==="page"&&e.pages.length===0} title=${a==="page"&&e.pages.length===0?"Your library has no pages":""}
          @click=${()=>r(a)}>${d}</button>`})}</div>
      ${n?O("Page",Fe({label:"Page",value:t.tap==="page"?t.pageId??"":"",options:[...t.tap==="page"?[]:[{value:"",label:"Pick a page\u2026",disabled:!0}],...i?[]:[{value:t.pageId,label:"A page not in your library",disabled:!0}],...e.pages.map(a=>({value:a.id,label:a.name}))],set:a=>{this.pickPage=!1,a!==""&&o({tap:"page",pageId:a})}})):v}
      <p class="hme-text dim">${t.tap===void 0&&!this.pickPage?"As the tile does: a light toggles, anything else opens its control.":"Hold on the watch or iPhone: its controls."}</p>`)}};function Or(s,e){let t=s==="on"?"walls stop the glow":s==="off"?"the glow spreads past the walls":"some stay in, some spread";return m`<div class="hme-r"><span class="hme-l">Stay in room</span>
    ${s==="mixed"?m`<button type="button" class="hme-chip off" aria-pressed="mixed" aria-label="Stay in room" @click=${()=>e(!0)}>Mixed</button>`:Mt({on:s==="on",onText:"On",offText:"Off",label:"Stay in room",click:()=>e(s!=="on")})}
    <span class="hme-text dim">${t}</span></div>`}function _r(s){let e=s.value??(s.min+s.max)/2;return m`<input class="hme-range ${s.value===void 0?"mixed":""}" type="range" min=${s.min} max=${s.max} step=${s.step} .value=${G(String(e))}
    aria-label=${s.label} aria-valuetext=${s.value===void 0?"Mixed":v} style=${s.value===void 0?"--p:0%":Ke(s.value,s.min,s.max)}
    @input=${t=>{let o=t.target;o.classList.remove("mixed"),s.preview(Number(o.value))}}
    @change=${t=>s.set(Number(t.target.value))} />`}function Lr(s,e,t){return m`<div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
    ${J({label:"None",picture:tt("none",e),on:s.reading==="none",click:()=>t({reading:"none"})})}
    ${J({label:"Pill",picture:tt("pill",e),on:s.reading===void 0,title:"Its reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>t({reading:null})})}
    ${J({label:"Name",picture:tt("name",e),on:s.reading==="name",click:()=>t({reading:"name"})})}
  </div></div>`}function tt(s,e){return m`<svg width="62" height="44" viewBox="0 0 62 44" aria-hidden="true">
    <circle cx="31" cy=${s==="none"?20:16} r="9" fill=${e} />
    ${s==="pill"?k`<rect x="17" y="29" width="28" height="11" rx="5.5" fill="rgba(0,0,0,0.7)" stroke="#3a3a3c" /><text x="31" y="37.5" font-size="8" fill="#fff" text-anchor="middle">21.5°</text>`:v}
    ${s==="name"?k`<text x="31" y="38" font-size="8" fill="#fff" text-anchor="middle">Name</text>`:v}
  </svg>`}var Tn=[{id:"select",label:"Corners and walls",key:"v"},{id:"split",label:"Split the room",key:"s"},{id:"inner",label:"Inner wall",key:"w"},{id:"door",label:"Door",key:"d"},{id:"window",label:"Window",key:"n"},{id:"opening",label:"Way through (no door)",key:"o"},{id:"stairs",label:"Stairs",key:"t"}];function Gr(s){return Da[s]}function Ta(s){return Tn.find(e=>e.key===s.toLowerCase())?.id}var Ca=[{label:"Door",kind:"door"},{label:"Double door",kind:"door",style:"double"},{label:"Sliding door",kind:"door",style:"sliding"},{label:"Window",kind:"window"},{label:"Sliding window",kind:"window",style:"sliding"},{label:"Way through",kind:"opening"}],Sa=["zero","one","two","three","four","five","six","seven","eight","nine","ten"];function Ia(s){return s===2?"Fix both":`Fix all ${Sa[s]??s}`}var Ra=9,zr=18,Pn="#4fd6c2",Nr="Draw each room faint and dashed as the iPhone scanned it, or as first seen for a room scanned before scans were kept. A room drawn here has none.",Kr="Put this room's walls, doors, windows and furniture back as the iPhone scanned it. Its devices stay where they are.",$=s=>s.toFixed(1),Ee=s=>`${s[0].toFixed(1)},${s[1].toFixed(1)}`,Wr=new WeakMap;function uo(s){let e=Wr.get(s);return e===void 0&&Wr.set(s,e=Si(s)),e}function En(s,e,t,o){if(s.walls!==void 0&&o===void 0)return;let n=t/s.view.scale,i=a=>{let d;for(let l of a)for(let[p,h]of X(l).entries()){let u=Zn(e,h);u<=n&&(d===void 0||u<d.d)&&(d={room:l,wall:p,seg:h,d:u})}return d},r=o===void 0?void 0:i([o]);return s.walls!==void 0?r:r??i(s.floor.rooms)}function Br(s,e){let t=Math.max(ve(e),1e-9),o=[-(e.b[1]-e.a[1])/t,(e.b[0]-e.a[0])/t],n=[(e.a[0]+e.b[0])/2,(e.a[1]+e.b[1])/2],i=U(s)??q(s);return(i[0]-n[0])*o[0]+(i[1]-n[1])*o[1]>0&&(o=[-o[0],-o[1]]),o}var fo=class{constructor(){this.tool="select";this.dragging=!1}setTool(e,t){this.first=void 0,this.tool=t,e.redraw()}get armed(){return this.tool!=="select"}focus(e){let t=e.walls??ce(e.selection);return t===void 0?void 0:e.floor.rooms.find(o=>M(o.id,t))}roomAt(e,t){let o=B(e.floor,t);return e.walls===void 0||o!==void 0&&M(o.id,e.walls)?o:void 0}placed(e,t,o){this.setTool(e,"select"),e.editWalls(t,o)}pickedWall(e,t){let o=e.selection;if(!(t===void 0||o===void 0)){if(o.kind==="wall")return o.wall;if(o.kind==="opening"){let n=t.openings[o.opening],i=n===void 0?-1:Ve(t,n);return i>=0?i:void 0}}}rail(e){let t=this.focus(e);return m`${t===void 0?v:this.wallsCard(e,t)}
      ${this.checkCard(e)}
      ${t===void 0?v:this.scanCard(e,t)}`}wallsCard(e,t){let o=X(t),n=e.selection,i=t.id,r=br(t),a=t.openings.map((l,p)=>({o:l,i:p})).filter(({o:l})=>Ve(t,l)<0),d=({o:l,i:p})=>{let h=n?.kind==="opening"&&n.opening===p;return m`<button type="button" class="hme-lay sub ${h?"on":""}" aria-pressed=${h?"true":"false"}
        @click=${()=>e.select({kind:"opening",roomId:i,opening:p})}>${$e(l)}<span class="n">${ft(Math.hypot(l.b[0]-l.a[0],l.b[1]-l.a[1]))}</span></button>`};return m`<section class="hme-card hme-layers">
      <div class="hme-h">${T(t)}<span class="hme-h-end">${S(o.length,"wall")}</span></div>
      ${o.map((l,p)=>{let h=n?.kind==="wall"&&n.wall===p;return m`<button type="button" class="hme-lay ${h?"on":""}" aria-pressed=${h?"true":"false"}
            @click=${()=>e.select({kind:"wall",roomId:i,wall:p})}>${r[p]}<span class="n">${ft(ve(l))}</span></button>
          ${t.openings.map((u,f)=>({o:u,i:f})).filter(({o:u})=>Ve(t,u)===p).map(d)}`})}
      ${a.length===0?v:m`<div class="hme-lay dim">In no wall</div>${a.map(d)}`}
    </section>`}scanCard(e,t){if(e.scans===void 0)return v;let o=t.id,n=Po(e.scans,o),i=n!==void 0&&Go(t,n)?n:void 0;return E("Show scan as it was",m`<div class="hme-row-end">
      <button type="button" class="hme-tb ${e.toggles.scan?"on":""}" aria-pressed=${e.toggles.scan?"true":"false"} title=${Nr}
        @click=${()=>e.setToggle("scan",!e.toggles.scan)}>${e.toggles.scan?"On":"Off"}</button>
      <button type="button" class="hme-tb" ?disabled=${i===void 0} title=${i===void 0?"This room is as the iPhone scanned it, or was drawn here":Kr}
        @click=${()=>{i!==void 0&&e.apply(r=>Uo(r,o,i))}}>Back to the scan</button>
    </div>`)}checkCard(e){let t=uo(e.floor),o=e.floor.id;return m`
      ${E("Scan check",m`
        ${t.length===0?m`<p class="hme-text dim">Nothing to fix. The walls meet and every room has a way in.</p>`:v}
        ${t.map(n=>m`<div class="hme-fix">
          <span class="hme-fix-dot ${n.kind==="missingDoor"?"gray":""}"></span>
          <p @click=${()=>e.select({kind:"room",roomId:n.roomIds[0]})}><b>${n.title}</b> ${n.detail}</p>
          <button type="button" class="hme-tb" @click=${()=>e.apply(i=>n.fix(i))}>${n.fixLabel}</button></div>`)}
        ${t.length>1?m`<button type="button" class="hme-tb hme-wide" @click=${()=>e.apply(n=>Ii(n,o))}>${Ia(t.length)}</button>`:v}`,t.length===0?void 0:m`<span class="hme-amber">${t.length} to fix</span>`)}`}overlay(e){let t=this.focus(e),o=[];if(t!==void 0&&t.outline.length>=3){let n=t.outline.map(i=>Ee(e.toScreen(i))).join("L");o.push(k`<path d=${`M0 0H${e.stage.width}V${e.stage.height}H0ZM${n}Z`} fill="rgba(0,0,0,0.45)" fill-rule="evenodd" pointer-events="none" />`)}return e.toggles.scan&&o.push(...this.scanMarks(e)),o.push(...this.issueMarks(e)),t!==void 0&&o.push(this.roomHandles(e,t)),o.push(...this.ghost(e)),k`${o}`}scanMarks(e){return Ri(e.floor,e.scans).map(t=>{let o=t.outline.map(i=>Ee(e.toScreen(i))).join("L"),n=t.walls.map(i=>`M${Ee(e.toScreen(i.a))}L${Ee(e.toScreen(i.b))}`).join("");return k`<g class="hme-scan" data-room=${t.roomId} pointer-events="none">
        <path d=${`M${o}Z`} fill=${Pn} fill-opacity="0.06" stroke="none" />
        <path d=${n} fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="3.5" stroke-dasharray="7 5" />
        <path d=${n} fill="none" stroke=${Pn} stroke-width="1.6" stroke-dasharray="7 5" stroke-opacity="0.9" />
        ${t.openings.map(i=>{let r=e.toScreen(i.a),a=e.toScreen(i.b);return k`<line x1=${$(r[0])} y1=${$(r[1])} x2=${$(a[0])} y2=${$(a[1])} stroke=${Pn} stroke-width="4" stroke-opacity="0.85"
            stroke-dasharray=${i.kind==="window"?"2 3":"none"} />`})}
      </g>`})}issueMarks(e){return uo(e.floor).map(t=>{let[o,n]=e.toScreen(t.where);if(t.kind==="offSquare"){let l=/(\d+)°/.exec(t.title)?.[1]??"";return k`<g class="hme-issue" data-hme=${`issue:${t.id}`} style="cursor:pointer"><title>${t.title} Click to square it.</title>
          <circle cx=${$(o)} cy=${$(n)} r="9" fill="#ffb340" stroke="#fff" stroke-width="2" />
          <g class="hme-tag"><rect x=${$(o+12)} y=${$(n+6)} width="44" height="20" rx="10" fill="#ffb340" />
          <text x=${$(o+34)} y=${$(n+20)} fill="#2a1a00" text-anchor="middle">${l}°</text></g></g>`}let i=`${Math.round(t.amount*100)} cm`,r=t.kind==="overlap"?`Overlap ${i} \xB7 ${t.fixLabel}`:t.kind==="gap"?`Gap ${i} \xB7 ${t.fixLabel}`:`No door \xB7 ${t.fixLabel}`,a=r.length*6.2+18,d=t.kind==="missingDoor";return k`<g class="hme-issue" data-hme=${`issue:${t.id}`} style="cursor:pointer"><title>${t.title} ${t.detail}</title>
        <circle cx=${$(o)} cy=${$(n)} r="4" fill=${d?"#8e8e93":"#ffb340"} />
        <g class="hme-tag"><rect x=${$(o-a/2)} y=${$(n+8)} width=${$(a)} height="20" rx="10" fill=${d?"#8e8e93":"#ffb340"} />
        <text x=${$(o)} y=${$(n+22)} fill=${d?"#fff":"#2a1a00"} text-anchor="middle">${r}</text></g></g>`})}roomHandles(e,t){let o=X(t),n=e.selection,i=this.pickedWall(e,t),r=[];if(i!==void 0&&o[i]!==void 0){let d=o[i],l=e.toScreen(d.a),p=e.toScreen(d.b),h=Br(t,d);if(r.push(k`<line x1=${$(l[0])} y1=${$(l[1])} x2=${$(p[0])} y2=${$(p[1])} stroke="#5b8def" stroke-width="9" stroke-linecap="round" pointer-events="none" />`),n?.kind==="wall"&&!this.dragging){let u=[(l[0]+p[0])/2+h[0]*22,(l[1]+p[1])/2+h[1]*22];r.push(k`<g class="hme-tag" pointer-events="none"><rect x=${$(u[0]-27)} y=${$(u[1]-9)} width="54" height="18" rx="9" fill="#5b8def" />
          <text x=${$(u[0])} y=${$(u[1]+4)} fill="#fff" text-anchor="middle">${ve(d).toFixed(2)} m</text></g>`)}}for(let[d,l]of t.openings.entries()){let p=e.toScreen(l.a),h=e.toScreen(l.b),u=n?.kind==="opening"&&n.opening===d,f=l.kind==="window"?"#8bb8f0":l.kind==="door"?"#ece6da":"#98989d";r.push(k`<g data-hme=${`opening:${d}`} style="cursor:ew-resize">
        <line x1=${$(p[0])} y1=${$(p[1])} x2=${$(h[0])} y2=${$(h[1])} stroke=${u?"#5b8def":"rgba(14,14,16,0.9)"} stroke-width="12" stroke-linecap="round" />
        <line x1=${$(p[0])} y1=${$(p[1])} x2=${$(h[0])} y2=${$(h[1])} stroke=${f} stroke-width="3" />
        ${u?k`<circle cx=${$(p[0])} cy=${$(p[1])} r="5" fill="#fff" stroke="#5b8def" stroke-width="2" /><circle cx=${$(h[0])} cy=${$(h[1])} r="5" fill="#fff" stroke="#5b8def" stroke-width="2" />`:v}
      </g>`)}let a=this.sliding!==void 0&&M(this.sliding.roomId,t.id)?this.sliding.index:n?.kind==="opening"?n.opening:void 0;if(a!==void 0&&t.openings[a]!==void 0&&r.push(this.distances(e,t,t.openings[a])),!this.dragging||this.sliding===void 0){if(this.tool==="select")for(let[d,l]of o.entries()){if(ve(l)*e.view.scale<40)continue;let p=e.toScreen([(l.a[0]+l.b[0])/2,(l.a[1]+l.b[1])/2]);r.push(k`<circle data-hme=${`mid:${d}`} cx=${$(p[0])} cy=${$(p[1])} r="5" fill="#0e0e10" stroke="#5b8def" stroke-width="1.5" style="cursor:copy"><title>Drag to add a corner</title></circle>`)}for(let[d,l]of t.outline.entries()){let[p,h]=e.toScreen(l),u=n?.kind==="corner"&&n.corner===d;r.push(k`<circle data-hme=${`corner:${d}`} cx=${$(p)} cy=${$(h)} r="7" fill=${u?"#5b8def":"#fff"} stroke=${u?"#fff":"#5b8def"} stroke-width="2" style="cursor:move" />`)}}return k`<g class="hme-handles">${r}</g>`}distances(e,t,o){let n=Ve(t,o),i=n>=0?X(t)[n]:void 0;if(i===void 0)return k``;let r=ve(i),a=Ce(o.a,i.a,i.b).along,d=Ce(o.b,i.a,i.b).along,l=Math.max(0,Math.min(a,d)),p=Math.min(r,Math.max(a,d)),h=Br(t,i),u=[(i.b[0]-i.a[0])/r,(i.b[1]-i.a[1])/r],f=y=>{let w=e.toScreen([i.a[0]+u[0]*y,i.a[1]+u[1]*y]);return[w[0]+h[0]*26,w[1]+h[1]*26]},g=[0,l,p,r],c=y=>`M${Ee([y[0]-h[0]*5,y[1]-h[1]*5])}L${Ee([y[0]+h[0]*5,y[1]+h[1]*5])}`,b=[[0,l,!1],[l,p,!0],[p,r,!1]];return k`<g class="hme-dist" pointer-events="none">
      <path d=${`M${Ee(f(0))}L${Ee(f(r))}${g.map(y=>c(f(y))).join("")}`} stroke="#98989d" stroke-width="1" fill="none" />
      ${b.filter(([y,w])=>w-y>.02).map(([y,w,H])=>{let P=f((y+w)/2);return k`<g class="hme-tag"><rect x=${$(P[0]-25)} y=${$(P[1]-9)} width="50" height="18" rx="9" fill=${H?"#5b8def":"#2c2c2e"} />
          <text x=${$(P[0])} y=${$(P[1]+4)} fill="#fff" text-anchor="middle">${(w-y).toFixed(2)} m</text></g>`})}
    </g>`}ghost(e){let t=this.hoverAt;if(t===void 0)return[];let o=[];if(this.tool==="door"||this.tool==="window"||this.tool==="opening"){let n=En(e,t,zr,this.focus(e));if(n!==void 0){let i=this.tool==="window"?1.2:.9,r=ve(n.seg),a=Math.min(i,r),d=Math.min(Math.max(Ce(t,n.seg.a,n.seg.b).along,a/2),r-a/2),l=[(n.seg.b[0]-n.seg.a[0])/r,(n.seg.b[1]-n.seg.a[1])/r],p=e.toScreen([n.seg.a[0]+l[0]*(d-a/2),n.seg.a[1]+l[1]*(d-a/2)]),h=e.toScreen([n.seg.a[0]+l[0]*(d+a/2),n.seg.a[1]+l[1]*(d+a/2)]);o.push(k`<line x1=${$(p[0])} y1=${$(p[1])} x2=${$(h[0])} y2=${$(h[1])} stroke="#5b8def" stroke-width="10" stroke-opacity="0.6" stroke-linecap="round" pointer-events="none" />`)}}if(this.tool==="stairs"&&this.roomAt(e,t)!==void 0){let[n,i]=e.toScreen(t),r=e.px(1),a=e.px(2.6);o.push(k`<g pointer-events="none" opacity="0.7"><rect x=${$(n-r/2)} y=${$(i-a/2)} width=${$(r)} height=${$(a)} fill="none" stroke="#5b8def" stroke-width="1.5" stroke-dasharray="4 3" />
        ${[1,2,3,4,5,6,7].map(d=>k`<line x1=${$(n-r/2)} x2=${$(n+r/2)} y1=${$(i-a/2+a*d/8)} y2=${$(i-a/2+a*d/8)} stroke="#5b8def" stroke-width="1" />`)}</g>`)}if((this.tool==="split"||this.tool==="inner")&&this.first!==void 0){let n=e.toScreen(this.first.a),i=e.toScreen(this.snap(e,t,this.first.a));if(this.tool==="split"){let r=Math.max(Math.hypot(i[0]-n[0],i[1]-n[1]),1e-6),a=[(i[0]-n[0])/r,(i[1]-n[1])/r],d=Math.hypot(e.stage.width,e.stage.height);o.push(k`<line x1=${$(n[0]-a[0]*d)} y1=${$(n[1]-a[1]*d)} x2=${$(n[0]+a[0]*d)} y2=${$(n[1]+a[1]*d)} stroke="#5b8def" stroke-width="1.5" stroke-dasharray="6 4" pointer-events="none" />`)}else o.push(k`<line x1=${$(n[0])} y1=${$(n[1])} x2=${$(i[0])} y2=${$(i[1])} stroke="#ece6da" stroke-width=${$(Math.max(e.px(.1),3))} stroke-opacity="0.8" pointer-events="none" />`);o.push(k`<circle cx=${$(n[0])} cy=${$(n[1])} r="5" fill="#5b8def" pointer-events="none" />`)}return o}snap(e,t,o){return un(e.floor,t,e.view.scale,{...o===void 0?{}:{from:o},...e.toggles.grid?{grid:He}:{}})}pointerDown(e,t,o){if(t.button!==0)return!1;switch(this.tool){case"door":case"window":case"opening":{let n=En(e,o,zr,this.focus(e));if(n===void 0)return!1;let i=this.tool,r=n.room.id,a={kind:"opening",roomId:r,opening:n.room.openings.length},d=n.wall;return e.apply(l=>Bt(l,r,d,{kind:i,at:o}),{select:a})&&this.placed(e,r,a),!0}case"stairs":{let n=this.roomAt(e,o);if(n===void 0)return!1;let i=n.id,r={kind:"room",roomId:i};return e.apply(a=>vi(a,i,o),{select:r})&&this.placed(e,i,r),!0}case"split":case"inner":return this.twoPoints(e,o);default:return this.pick(e,t,o)}}twoPoints(e,t){if(this.first===void 0){let r=(e.walls===void 0?B(e.floor,t):void 0)??this.focus(e);return r===void 0?!1:(this.first={roomId:r.id,a:this.snap(e,t)},e.walls===void 0?e.select({kind:"room",roomId:r.id}):e.redraw(),!0)}let{roomId:o,a:n}=this.first,i=this.snap(e,t,n);if(this.first=void 0,Math.hypot(i[0]-n[0],i[1]-n[1])<.1)return e.redraw(),!0;if(this.tool==="inner"){let r=e.doc.floors.flatMap(d=>d.rooms).find(d=>M(d.id,o)),a={kind:"wall",roomId:o,wall:r===void 0?0:So(r).length};return e.apply(d=>Ti(d,o,n,i),{select:a})?this.placed(e,o,a):e.note("err","An inner wall needs to be at least 10 cm long."),!0}return this.split(e,o,n,i),!0}async split(e,t,o,n){let i=e.floor.rooms.find(l=>M(l.id,t)),r=await e.ask({title:"Name the new room",label:"Name",value:i===void 0?"Room":`${T(i)} 2`,ok:"Split the room"});if(r===void 0)return;let a=e.newId(),d={kind:"room",roomId:a};e.apply(l=>Ci(l,t,o,n,a,r),{select:d})?(this.setTool(e,"select"),e.editWalls(void 0,d)):e.note("err","That line does not cut the room in two. Draw it right across the room.")}pick(e,t,o){let n=this.focus(e),i=t.target?.closest?.("[data-hme]")?.getAttribute("data-hme")??"",[r,a]=i.split(/:(.*)/s);if(r==="issue"){let h=uo(e.floor).find(u=>u.id===a);return h!==void 0&&e.apply(u=>h.fix(u)),!0}let d=Number(a);if(n!==void 0&&r==="corner"&&Number.isInteger(d))return this.cornerDrag(e,t,n,d),!0;if(n!==void 0&&r==="mid"&&Number.isInteger(d))return this.midDrag(e,t,n,d),!0;if(n!==void 0&&r==="opening"&&Number.isInteger(d))return this.openingDrag(e,t,n,d),!0;let l=En(e,o,Ra,n);if(l!==void 0)return this.wallAt=Ce(o,l.seg.a,l.seg.b).point,e.select({kind:"wall",roomId:l.room.id,wall:l.wall}),!0;let p=B(e.floor,o);return e.walls!==void 0&&(p===void 0||!M(p.id,e.walls))?(e.editWalls(void 0),!0):p===void 0?!1:(e.select({kind:"room",roomId:p.id}),!0)}cornerTo(e,t,o,n){let i=e.floor.rooms.filter(d=>!M(d.id,t.id)).flatMap(d=>d.outline),r=10/e.view.scale;for(let d of i)if(Math.hypot(d[0]-n[0],d[1]-n[1])<=r)return[d[0],d[1]];let a=n;if(e.toggles.grid&&(a=[Math.round(a[0]/He)*He,Math.round(a[1]/He)*He]),e.toggles.square){let d=ei(e.floor.rooms.flatMap(b=>So(b))),l=Math.cos(d),p=Math.sin(d),h=b=>[b[0]*l+b[1]*p,-b[0]*p+b[1]*l],[u,f]=h(a),g=t.outline.length,c=8/e.view.scale;for(let b of[(o+g-1)%g,(o+1)%g]){let[y,w]=h(t.outline[b]);Math.abs(u-y)<=c&&(u=y),Math.abs(f-w)<=c&&(f=w)}a=[u*l-f*p,u*p+f*l]}return a}cornerDrag(e,t,o,n){let i=o.id,r;e.drag(t,{move:a=>{this.dragging=!0;let d=this.cornerTo(e,o,n,a);r=d,e.preview(l=>Xe(l,i,n,d))},end:(a,d,l)=>{this.dragging=!1,e.preview(void 0);let p=r,h={kind:"corner",roomId:i,corner:n};l&&p!==void 0?e.apply(u=>Xe(u,i,n,p),{select:h}):e.select(h)},cancel:()=>this.stopDrag(e)})}midDrag(e,t,o,n){let i=o.id,r=X(o)[n],a=Kt(e.doc,i,n),d=a?.floors.flatMap(f=>f.rooms).find(f=>M(f.id,i));if(r===void 0||a===void 0||d===void 0)return;let l=[(r.a[0]+r.b[0])/2,(r.a[1]+r.b[1])/2],p=d.outline.reduce((f,g,c)=>Math.hypot(g[0]-l[0],g[1]-l[1])<Math.hypot(d.outline[f][0]-l[0],d.outline[f][1]-l[1])?c:f,0),h=f=>g=>{let c=Kt(g,i,n);return c===void 0||f===void 0?c:Xe(c,i,p,f)},u;e.drag(t,{move:f=>{this.dragging=!0,u=this.cornerTo(e,d,p,f),e.preview(h(u))},end:(f,g,c)=>{this.dragging=!1,e.preview(void 0),e.apply(h(c?u:void 0),{select:{kind:"corner",roomId:i,corner:p}})},cancel:()=>this.stopDrag(e)})}openingDrag(e,t,o,n){let i=o.id,r=o.openings[n];if(r===void 0)return;let a={kind:"opening",roomId:i,opening:n},d=[(r.a[0]+r.b[0])/2,(r.a[1]+r.b[1])/2],l,p;e.select(a),e.drag(t,{move:h=>{l??=h,this.dragging=!0,this.sliding={roomId:i,index:n};let u=[d[0]+h[0]-l[0],d[1]+h[1]-l[1]];p=u,e.preview(f=>Bo(f,i,n,u))},end:(h,u,f)=>{this.dragging=!1,this.sliding=void 0,e.preview(void 0);let g=p;f&&g!==void 0&&e.apply(c=>Bo(c,i,n,g),{select:a})},cancel:()=>this.stopDrag(e)})}stopDrag(e){this.dragging=!1,this.sliding=void 0,e.preview(void 0)}hover(e,t){this.tool!=="select"&&(this.hoverAt=t,e.redraw())}keyDown(e,t){let o=te(t,!1);if(typeof o=="object"&&"letter"in o){let n=Ta(o.letter);return n===void 0?!1:(this.setTool(e,n),!0)}if(o==="cancel"&&(this.tool!=="select"||this.first!==void 0))return this.setTool(e,"select"),!0;if(o==="delete"){let n=e.selection;if(n?.kind==="corner")e.apply(i=>Wt(i,n.roomId,n.corner),{select:{kind:"room",roomId:n.roomId}});else if(n?.kind==="opening")e.apply(i=>Gt(i,n.roomId,n.opening),{select:{kind:"room",roomId:n.roomId}});else if(n?.kind==="wall")e.apply(i=>Wo(i,n.roomId,n.wall),{select:{kind:"room",roomId:n.roomId}});else return!1;return!0}return!1}cursor(){return this.tool==="select"?void 0:"crosshair"}leave(e){this.first=void 0,this.hoverAt=void 0,this.dragging=!1,this.sliding=void 0,this.tool="select",e.redraw()}dock(e){return m`<button type="button" class="hme-tb ${e.toggles.square?"on":""}" aria-pressed=${e.toggles.square?"true":"false"}
        title="A dragged corner lines up with the corners beside it" @click=${()=>e.setToggle("square",!e.toggles.square)}>Snap to 90°</button>`}viewItems(e){let t=[{label:"Grid 5 cm",on:e.toggles.grid,flip:()=>e.setToggle("grid",!e.toggles.grid)}];return e.scans!==void 0&&t.push({label:"Show scan as it was",on:e.toggles.scan,title:Nr,flip:()=>e.setToggle("scan",!e.toggles.scan)}),t}pill(e){if(this.tool!=="select"){let r={split:this.first===void 0?"Click where the cut starts":"Click where it ends, across the room",inner:this.first===void 0?"Click where the wall starts":"Click where it ends",door:"Click a wall to put a door in it",window:"Click a wall to put a window in it",opening:"Click a wall to open a way through it",stairs:"Click in the room to put stairs there"};return m`<span class="hme-pill-name">${r[this.tool]}</span>
        <button type="button" class="hme-tb" @click=${()=>this.setTool(e,"select")}>Cancel</button>`}let t=this.focus(e),o=e.selection;if(t===void 0||o===void 0||this.dragging)return v;let n=t.id,i=T(t);if(o.kind==="wall"){let r=o.wall,a=this.wallAt,d=pn(t,r,i).replace(", "," \xB7 ");return m`<span class="hme-pill-name">${d}</span>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(e,t,r,"window",a)}>＋ Window here</button>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(e,t,r,"door",a)}>＋ Door here</button>
        <button type="button" class="hme-tb" @click=${()=>this.cornerHere(e,t,r,a)}>Add a corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(l=>Ko(l,n,r))}>Straighten</button>`}if(o.kind==="corner")return m`<span class="hme-pill-name">${i} · corner</span>
        <button type="button" class="hme-tb" ?disabled=${t.outline.length<=3} @click=${()=>e.apply(r=>Wt(r,n,o.corner),{select:{kind:"room",roomId:n}})}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(r=>be(r,n))}>Square the corners</button>`;if(o.kind==="opening"){let r=t.openings[o.opening];return r===void 0?v:m`<span class="hme-pill-name">${$e(r)}</span>
        <button type="button" class="hme-tb danger" @click=${()=>e.apply(a=>Gt(a,n,o.opening),{select:{kind:"room",roomId:n}})}>Remove</button>`}return m`<span class="hme-pill-name">${i}</span>
      <button type="button" class="hme-tb" @click=${()=>e.apply(r=>be(r,n))}>Square the corners</button>`}addHere(e,t,o,n,i){let r=t.id,a=t.openings.length;e.apply(d=>Bt(d,r,o,{kind:n,...i===void 0?{}:{at:i}}),{select:{kind:"opening",roomId:r,opening:a}})}cornerHere(e,t,o,n){let i=t.id,r=h=>Kt(h,i,o,n),a=r(e.doc)?.floors.flatMap(h=>h.rooms).find(h=>M(h.id,i)),d=X(t)[o],l=n??(d===void 0?void 0:[(d.a[0]+d.b[0])/2,(d.a[1]+d.b[1])/2]),p=a===void 0||l===void 0?-1:a.outline.reduce((h,u,f)=>Math.hypot(u[0]-l[0],u[1]-l[1])<Math.hypot(a.outline[h][0]-l[0],a.outline[h][1]-l[1])?f:h,0);e.apply(r,{select:p<0?{kind:"room",roomId:i}:{kind:"corner",roomId:i,corner:p}})}inspector(e){let t=this.focus(e),o=e.selection;if(t===void 0||o===void 0){let h=uo(e.floor);return E("Shape",m`<p class="hme-text">Pick a room, then a wall or a corner. Drag a corner to move it; a corner two rooms share moves for both.</p>
        <p class="hme-text dim">${h.length===0?"The scan check found nothing to fix on this floor.":`The scan check found ${S(h.length,"thing")} to fix. They are marked in amber.`}</p>`)}let n=t.id;if(o.kind==="corner")return this.cornerCard(e,t,o.corner);let i=this.pickedWall(e,t);if(i===void 0){let h=Po(e.scans,n),u=h!==void 0&&Go(t,h)?h:void 0;return E(T(t),m`
        ${O("Corners",m`<span class="hme-val">${t.outline.length}</span>`)}
        ${O("Walls",m`<span class="hme-val">${X(t).length}</span>`)}
        ${O("Wall height",F({label:"Wall height",value:t.height,unit:"m",min:.5,max:20,set:f=>e.apply(g=>st(g,n,f))}))}
        ${V("Click a wall to change it or put a door or window in it. Drag a corner to move it, or the dot in a wall's middle to add a corner.")}
        ${u===void 0?v:V("Its shape has changed since the iPhone scanned it.")}
        <div class="hme-row-end">
          ${u===void 0?v:m`<button type="button" class="hme-tb" title=${Kr} @click=${()=>e.apply(f=>Uo(f,n,u))}>Back to the scan</button>`}
          <button type="button" class="hme-tb" @click=${()=>e.apply(f=>be(f,n))}>Square the corners</button>
        </div>`)}let r=X(t)[i],a=t.openings.map((h,u)=>({o:h,i:u})).filter(({o:h})=>Ve(t,h)===i),d=o.kind==="opening"?t.openings[o.opening]:void 0,l=ve(r),p=h=>{let u=t.openings.length;e.apply(f=>Bt(f,n,i,{kind:h}),{select:{kind:"opening",roomId:n,opening:u}})};return m`
      ${E("Wall",m`
        ${O("Room",m`<span class="hme-val strong">${pn(t,i,T(t))}</span>`)}
        ${O("Length",F({label:"Length",value:l,unit:"m",min:.1,max:200,set:h=>e.apply(u=>Pi(u,n,i,h))}))}
        ${O("Thickness",F({label:"Thickness",value:r.t,unit:"m",min:.01,max:1,set:h=>e.apply(u=>Ei(u,n,i,h))}))}
        ${O("Height",F({label:"Wall height",value:t.height,unit:"m",min:.5,max:20,set:h=>e.apply(u=>st(u,n,h))}))}
        ${V("Type a length to move the far corner. Rooms that share the corner move with it.")}
        <div class="hme-row-end indent">
          <button type="button" class="hme-tb" @click=${()=>e.apply(h=>Ko(h,n,i))}>Straighten</button>
          <button type="button" class="hme-tb" @click=${()=>e.apply(h=>be(h,n))}>Square the corners</button>
          <button type="button" class="hme-tb" @click=${()=>this.cornerHere(e,t,i,void 0)}>Split wall</button>
          <button type="button" class="hme-tb danger" title="Take this wall away" @click=${()=>e.apply(h=>Wo(h,n,i),{select:{kind:"room",roomId:n}})}>Remove</button>
        </div>`)}
      ${E("On this wall",m`
        ${a.map(({o:h,i:u})=>{let f=Ce(h.a,r.a,r.b).along,g=Ce(h.b,r.a,r.b).along,c=o.kind==="opening"&&o.opening===u;return m`<button type="button" class="hme-list-row ${c?"on":""}" @click=${()=>e.select({kind:"opening",roomId:n,opening:u})}>
            <span class="hme-grow">${$e(h)}</span><span class="mono dim">${ft(Math.abs(g-f))} · ${ft(Math.max(0,Math.min(f,g)))} in</span></button>`})}
        ${a.length===0?m`<p class="hme-empty-line">Nothing on this wall.</p>`:v}
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${()=>p("door")}>＋ Door</button>
          <button type="button" class="hme-tb" @click=${()=>p("window")}>＋ Window</button>
          <button type="button" class="hme-tb" @click=${()=>p("opening")}>＋ Way through</button>
        </div>`)}
      ${d===void 0||o.kind!=="opening"?v:this.openingCard(e,t,o.opening,d)}`}openingCard(e,t,o,n){let i=t.id,r=Math.hypot(n.b[0]-n.a[0],n.b[1]-n.a[1]),a=n.z1-n.z0;return E($e(n),m`
      <div class="hme-pics">${Ca.map(d=>J({label:d.label,picture:Aa[d.label],on:n.kind===d.kind&&n.style===d.style,click:()=>e.apply(l=>lt(l,i,o,{kind:d.kind,style:d.style??null}))}))}</div>
      ${O("Width",F({label:"Width",value:r,unit:"m",min:.1,max:20,set:d=>e.apply(l=>lt(l,i,o,{width:d}))}))}
      ${O("From floor",F({label:"From floor",value:n.z0,unit:"m",min:0,max:20,set:d=>e.apply(l=>lt(l,i,o,{z0:d,z1:d+a}))}),m`<span class="hme-l short">Tall</span>`,F({label:"Tall",value:a,unit:"m",min:.05,max:20,set:d=>e.apply(l=>lt(l,i,o,{z1:n.z0+d}))}))}
      ${V("Drag it along the wall. The plan shows the space to each corner.")}
      <div class="hme-row-end indent"><button type="button" class="hme-tb danger" @click=${()=>e.apply(d=>Gt(d,i,o),{select:{kind:"room",roomId:i}})}>Remove ${$e(n).toLowerCase()}</button></div>`)}cornerCard(e,t,o){let n=t.id,i=t.outline[o];if(i===void 0)return m``;let r=e.floor.rooms.filter(a=>!M(a.id,n)&&a.outline.some(d=>Math.hypot(d[0]-i[0],d[1]-i[1])<=.02));return E("Corner",m`
      ${O("Room",m`<span class="hme-val strong">${T(t)}</span>`)}
      ${O("Left, top",F({label:"Corner left",value:i[0],unit:"m",set:a=>e.apply(d=>Xe(d,n,o,[a,i[1]]))}),F({label:"Corner top",value:i[1],unit:"m",set:a=>e.apply(d=>Xe(d,n,o,[i[0],a]))}))}
      ${V(r.length===0?"Drag it on the plan. Drop it on another room's corner and the two move together after.":`Shared with ${r.map(T).join(", ")}, which move${r.length===1?"s":""} with it.`)}
      <div class="hme-row-end indent">
        <button type="button" class="hme-tb" ?disabled=${t.outline.length<=3} @click=${()=>e.apply(a=>Wt(a,n,o),{select:{kind:"room",roomId:n}})}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(a=>be(a,n))}>Square the corners</button>
      </div>`)}},Da={select:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3z" fill="none" stroke="currentColor" stroke-width="1.4"></path><circle cx="3" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="15" r="2" fill="currentColor"></circle><circle cx="3" cy="15" r="2" fill="currentColor"></circle></svg>`,split:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 3h14v12H2z" fill="none" stroke="currentColor" stroke-width="1.4"></path><path d="M9 1v16" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 2"></path></svg>`,inner:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="2.4"></path></svg>`,door:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 15h4M12 15h4M6 15V5M6 5a10 10 0 0 1 10 10" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`,window:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="1.4"></path><path d="M5 7h8M5 11h8" stroke="#8bb8f0" stroke-width="1.4"></path></svg>`,opening:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h4M12 9h4" stroke="currentColor" stroke-width="2.4"></path></svg>`,stairs:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3zM3 6h12M3 9h12M3 12h12" fill="none" stroke="currentColor" stroke-width="1.2"></path></svg>`},Aa={Door:m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V4M14 4a17 17 0 0 1 17 17" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Double door":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V7M48 21V7M14 7a14 14 0 0 1 14 14M48 7a14 14 0 0 0-14 14" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Sliding door":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18.5h20M28 23.5h20" stroke="#ece6da" stroke-width="2.4"></path></svg>`,Window:m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 18h34M14 24h34" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Sliding window":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18h20M28 24h20" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Way through":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h10M48 21h10" stroke="#ece6da" stroke-width="4"></path><path d="M14 27h34" stroke="#98989d" stroke-width="1" stroke-dasharray="3 3"></path></svg>`};var Ur=[{id:"pick",name:"Pick",label:"Pick and move",key:"v"},{id:"draw",name:"Room",label:"Draw a room",key:"r"},{id:"inner",name:"Wall",label:"Inner wall",key:"w"},{id:"door",name:"Door",label:"Door",key:"d"},{id:"window",name:"Window",label:"Window",key:"n"},{id:"measure",name:"Measure",label:"Measure",key:"m"}],Oa={select:"Corners",split:"Split",inner:"Wall",door:"Door",window:"Window",opening:"Opening",stairs:"Stairs"};function _a(s){return Ur.find(e=>e.key===s.toLowerCase())?.id}function La(s){let e=Li(s),t=s.pins.filter(r=>r.entityId.startsWith("light.")),o=t.filter(r=>!e.has(r.id.toUpperCase())).map(r=>r.id),n=s.rooms.length,i=s.rooms.reduce((r,a)=>r+a.objects.length,0);return{rooms:n,things:i,lights:t.length,loose:o,done:[n>0,i>0,t.length>0&&o.length===0]}}var go=class{constructor(){this.arrange=new po;this.devices=new co((e,t,o)=>this.arrange.piecePic(e,pt(t),o));this.shape=new fo}tool(e){if(e.toggles.measure)return"measure";if(e.walls!==void 0)return this.shape.tool;if(this.arrange.draw.active)return"draw";let t=this.shape.tool;return t==="inner"||t==="door"||t==="window"?t:"pick"}setTool(e,t){if(t==="measure"){this.arrange.draw.stop(),this.shape.setTool(e,"select"),e.setToggle("measure",!e.toggles.measure),e.redraw();return}if(e.toggles.measure&&e.setToggle("measure",!1),t==="draw"){this.shape.setTool(e,"select"),this.arrange.draw.active||this.arrange.draw.start(e);return}this.arrange.draw.stop(e),this.shape.setTool(e,t==="pick"?"select":t)}picksPins(e){return ne(e.selection).length>0}overlay(e){return e.walls!==void 0?this.shape.overlay(e):k`${this.arrange.overlay(e)}${this.shape.armed?this.shape.ghost(e):v}${this.devices.overlay(e)}`}drawsPins(e){return e.walls===void 0}pointerDown(e,t,o){if(this.devices.choosing)return this.devices.cancelChooser(e),!0;if(e.walls!==void 0)return this.shape.pointerDown(e,t,o);if(this.arrange.draw.active)return this.arrange.draw.pointerDown(e,t,o);if(this.shape.armed)return this.shape.pointerDown(e,t,o);if(t.button!==0)return!1;if(this.arrange.pressHandle(e,t,o)||this.devices.pressHandle(e,t,o))return!0;let n=this.devices.heldThingAt(e,o);return n!==void 0&&this.arrange.pressThing(e,t,n,o)?!0:this.devices.pressPin(e,t,o)||this.devices.pressBox(e,t,o)||this.arrange.pressBody(e,t,o)}doubleClick(e,t,o){if(this.arrange.draw.active||this.shape.armed||e.walls===void 0&&this.devices.onPin(e,o))return;let n=B(e.floor,o);n===void 0||M(n.id,e.walls)||e.editWalls(n.id)}hover(e,t){e.walls===void 0&&this.arrange.hover(e,t),this.shape.hover(e,t)}keyDown(e,t){if(this.devices.chooserKey(e,t))return!0;let o=te(t,!1),n=typeof o=="object"&&"letter"in o?o.letter:void 0;if(n==="m")return this.setTool(e,"measure"),!0;if(e.walls!==void 0)return this.shape.keyDown(e,t)?!0:o==="cancel"?(e.editWalls(void 0),!0):!1;if(this.arrange.draw.active&&this.arrange.draw.keyDown(e,t))return!0;if(n==="f")return e.openAdd("furniture"),!0;let i=n===void 0?void 0:_a(n);return i!==void 0?(this.setTool(e,i),!0):o==="cancel"&&this.shape.armed?(this.setTool(e,"pick"),!0):this.picksPins(e)?this.devices.keyDown(e,t):this.arrange.keyDown(e,t)}cursor(e){return e.walls!==void 0?this.shape.cursor():this.arrange.draw.active||this.shape.armed?"crosshair":void 0}leave(e){this.arrange.leave(e),this.devices.leave(),this.shape.leave(e)}dock(e){return e.walls!==void 0?this.shape.dock(e):this.arrange.dock(e)}viewItems(e){return e.walls!==void 0?this.shape.viewItems(e):[...this.arrange.viewItems(e),...this.devices.viewItems(e)]}pill(e){return e.walls!==void 0||this.shape.armed?this.shape.pill(e):this.arrange.draw.active?this.arrange.pill(e):this.picksPins(e)?this.devices.pill(e):this.arrange.pill(e)}banner(e){let t=this.wallsRoom(e);return t===void 0?v:m`<span class="hme-banner-t">Editing the walls of <b>${T(t)}</b></span>
      <button type="button" class="hme-tb hme-blue" title="Back to moving things (Esc)" @click=${()=>e.editWalls(void 0)}>Done <kbd>Esc</kbd></button>`}wallsRoom(e){return e.walls===void 0?void 0:e.floor.rooms.find(t=>M(t.id,e.walls))}stageExtra(e){let t=e.walls===void 0?this.devices.stageExtra(e):v,o=e.walls!==void 0?"Drag a corner \xB7 drag a wall's middle to add a corner \xB7 Esc when done":"Click picks what is on top \xB7 Double-click a room to edit its walls";return m`${this.toolRail(e)}${t}
      ${t===v&&e.stage.width>=900?m`<div class="hme-stage-hint">${o}</div>`:v}`}toolRail(e){let t=this.tool(e),o=e.walls!==void 0,n=o?[...Tn.map(r=>({...r,name:Oa[r.id]})),{id:"measure",name:"Measure",label:"Measure",key:"m"}]:[...Ur],i=new Set(o?[0]:[0,4]);return m`<div class="hme-toolrail" role="toolbar" aria-label=${o?"Wall tools":"Tools"} aria-orientation="vertical">
      ${n.map((r,a)=>m`<button type="button" class="hme-rtool ${t===r.id?"on":""}" aria-pressed=${t===r.id?"true":"false"}
          aria-label=${r.label} title=${`${r.label} (${r.key.toUpperCase()})`} @click=${()=>this.setTool(e,r.id)}>
          ${ja(r.id)}<span class="hme-rtool-name">${r.name}</span></button>
        ${i.has(a)?m`<span class="hme-rtool-sep" aria-hidden="true"></span>`:v}`)}
    </div>`}inspector(e){if(e.walls!==void 0)return m`${this.shape.inspector(e)}
        ${this.shape.rail(e)}
        ${E("Leave this",m`<p class="hme-text dim">Press Esc, click Done, or click outside the room to go back to moving things. Double-click any room to edit its walls.</p>`)}`;if(this.picksPins(e))return this.devices.inspector(e);let t=e.selection;if(t===void 0)return this.startPanel(e);let o=t.kind==="object"?this.devices.thingCards(e,t.roomId,t.object):v;return o===v?this.arrange.inspector(e):m`${o}${this.arrange.inspector(e)}`}startPanel(e){let t=e.floor,o=La(t),n=o.done.indexOf(!1),i=o.loose.length,r=(p,h,u,f=v)=>{let g=o.done[p]?"done":p===n?"now":"next";return m`<div class="hme-step ${g}">
        <span class="hme-step-no" aria-label=${o.done[p]?"Done":`Step ${p+1}`}>${o.done[p]?"\u2713":String(p+1)}</span>
        <div class="hme-step-t"><b>${h}</b><span>${u}</span>${f}</div>
      </div>`},a=o.rooms>0?`${S(o.rooms,"room")} on ${z(t)}. Draw one with Room, or scan one with the iPhone.`:"Draw one with Room, or scan one with the iPhone.",d=o.things>0?`${S(o.things,"thing")}. Add more from Add \u203A Furniture.`:"None yet. Add a sofa, a bed or a lamp from Add \u203A Furniture.",l=o.lights===0?"No lights yet. Add one from Add \u203A Devices and pick its lamp.":i>0?`${S(i,"light")} ${i===1?"sits":"sit"} loose. Drop each one on its lamp, or add a light from Add \u203A Devices and pick its lamp.`:`Every light sits in a lamp (${o.lights}).`;return m`
      ${E("Start here",m`<div class="hme-steps">
        ${r(0,"Rooms",a,o.rooms>0?v:m`<button type="button" class="hme-link" @click=${()=>this.startDrawing(e)}>Draw a room ›</button>`)}
        ${r(1,"Furniture",d,m`<button type="button" class="hme-link" @click=${()=>e.openAdd("furniture")}>Add › Furniture</button>`)}
        ${r(2,"Lights in lamps",l,i===0?v:m`<button type="button" class="hme-link" title="Pick every light no lamp holds" @click=${()=>e.select(Oe(o.loose))}>Show me the loose lights</button>`)}
      </div>`,`${o.done.filter(Boolean).length} of 3 done`,"hme-start")}
      ${this.arrange.floorCard(e,t)}
      <section class="hme-card hme-tips-card">
        <details class="hme-tips">
          <summary>Keys and tips <span aria-hidden="true">›</span></summary>
          <p class="hme-text">Click picks what is on top: a device, then a thing (a sofa, a TV, a desk), then the room under them. Drag it to move it.</p>
          <p class="hme-text dim">A dragged room lines up with the walls of the rooms round it. Drag the round handle above it to turn it, or a square handle on its box to resize it. Double-click a room to edit its walls, doors and windows.</p>
          <p class="hme-text dim">Shift, Cmd or Ctrl and a click picks several devices; Cmd or Ctrl and a click picks several things, to colour or hide them together. Drag a device from Add onto the plan to place it.</p>
          <dl class="hme-keys">
            ${Fa.map(([p,h])=>m`<dt><kbd>${p}</kbd></dt><dd>${h}</dd>`)}
            <dt><kbd>${ur()}</kbd></dt><dd>Undo</dd>
          </dl>
        </details>
      </section>`}sheet(e){let t=this.devices.lampChooser(e);return t===v?this.arrange.sheet(e):t}dragOver(e,t,o){return e.walls===void 0&&this.devices.dragOver(e,t,o)}drop(e,t,o){e.walls===void 0&&this.devices.drop(e,t,o)}startDrawing(e){this.setTool(e,"draw")}},Fa=[["V","Pick and move"],["R","Draw a room"],["W","Inner wall"],["D","Door"],["N","Window"],["M","Measure"],["F","Add furniture"],["Delete","Remove what is picked"],["Arrows","Nudge it (Shift for bigger steps)"],["Esc","Back out: a tool, a thing to its room, a room's walls"],["Space","Hold and drag to pan"],["+ \u2212","Zoom"],["0","Fit the floor"]];function ja(s){switch(s){case"pick":return m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 2.5v11.5l3.1-3 2.3 5 2-.9-2.3-4.9h4.4z" fill="currentColor"></path></svg>`;case"draw":return m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 15V3h8l4 4v8z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2.5 2"></path></svg>`;case"measure":return m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14M2 6v6M16 6v6M6 9v-2M9 9V6M12 9v-2" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`;default:return Gr(s)}}var za=[["lights","Lights"],["sensors","Sensors"],["climate","Climate"],["switches","Switches and plugs"],["media","Media"],["covers","Covers"],["locks","Locks"],["other","Other"]],fe="*",bo="",Cn=200;function Na(s){switch(or(s)){case"lights":return"lights";case"sensors":return"sensors";case"climate":return"climate";case"power":return"switches";case"media":return"media";case"covers":return"covers";case"security":return s.startsWith("lock.")?"locks":"other";default:return"other"}}function vo(s){let e=s.selection,t=ce(e)??s.walls;if(t!==void 0)return s.floor.rooms.find(n=>M(n.id,t));if(e?.kind!=="pin")return;let o=s.floor.pins.find(n=>M(n.id,e.pinId));return o===void 0?void 0:de(s.floor,o)}function Xr(s){return ke(s.view,[s.stage.width/2,s.stage.height/2])}function Ka(s){return vo(s)??B(s.floor,Xr(s))}function Wa(s,e){let t=Xr(s);return le(e.outline,t)?t:U(e)??q(e)}function Ba(s,e){return e.trim()===""?s.filter(t=>t.category===void 0&&Qi.has(t.domain)):tr(s,e,1/0)}function Ga(s,e){return e===fe?!0:e===bo?s.areaId===void 0:s.areaId===e}function Ua(s,e,t,o){let n=new Map,i=new Map(s.areas.map(h=>[h.id,h.name])),r=0;for(let h of e){if(h.areaId===void 0){r+=1;continue}n.set(h.areaId,(n.get(h.areaId)??0)+1),i.has(h.areaId)||i.set(h.areaId,h.areaName??h.areaId)}let a=[],d=(h,u=!1)=>{h===void 0||h===""||a.includes(h)||!u&&(n.get(h)??0)===0||a.push(h)};d(t,!0);for(let h of s.floor.rooms)d(h.areaId);let l=[...n.keys()].sort((h,u)=>(i.get(h)??h).localeCompare(i.get(u)??u));for(let h of l)d(h);o!==fe&&d(o,!0);let p=a.map(h=>({id:h,name:i.get(h)??h,count:n.get(h)??0}));return(r>0||o===bo)&&p.push({id:bo,name:"No area",count:r}),p.push({id:fe,name:"All areas",count:e.length}),p}function Vr(s,e){let t=new Map;for(let o of s){if(!Ga(o,e))continue;let n=Na(o.entityId),i=t.get(n);i===void 0&&t.set(n,i=[]),i.push(o)}return za.filter(([o])=>t.has(o)).map(([o,n])=>({kind:o,label:n,devices:t.get(o)}))}function Va(s,e){if(e.startsWith("light.")){let t=Xt(s,e).length;return t===0?void 0:`${t} on map`}return _e(s,e)===void 0?void 0:"on map"}function Xa(s){let e=s;e?.focus!==void 0&&setTimeout(()=>e.focus?.(),0)}function qa(s){let e=s;e?.showModal!==void 0&&queueMicrotask(()=>{e.isConnected&&e.open!==!0&&e.showModal?.()})}var wo=class{constructor(e,t){this.devices=e;this.picture=t;this.tab="devices";this.query="";this.area=fe;this.areaChosen=!1;this.pieceQuery="";this.pieceGroup="";this.focus=!1}open(e,t="devices",o){this.choice=o,this.tab=o===void 0?t:"devices",this.query="",this.pieceQuery="",this.pieceGroup="",this.roomId=void 0,this.area=o===void 0?vo(e)?.areaId??fe:fe,this.areaChosen=!1,this.focus=!0}setTab(e,t){this.tab!==t&&(this.tab=t,this.focus=!0,e.redraw())}furnitureRoom(e){let t=Ka(e);if(t!==void 0)return t;let o=this.roomId;return o===void 0?void 0:e.floor.rooms.find(n=>M(n.id,o))}addDevice(e,t,o){let n=this.choice;if(n!==void 0){o(),n.pick(t.entityId);return}let i=vo(e),r=i===void 0?void 0:U(i)??q(i);o(),t.entityId.startsWith("light.")?this.devices.addLight(e,t.entityId,r,t.areaId):this.devices.place(e,t.entityId,r,t.areaId)}addPiece(e,t,o){let n=this.furnitureRoom(e);if(n===void 0)return;let i=n.id,r=n.objects.length,a=Wa(e,n);o(),e.apply(d=>wi(d,i,t,a),{select:{kind:"object",roomId:i,object:r}})||e.note("warn","That piece could not be added: a room holds at most 256 things.")}render(e,t){let o=vo(e),n=this.choice,i=n?.title??`Add to ${o===void 0?z(e.floor):T(o)}`,r=this.focus;this.focus=!1;let a=Ae(l=>{r&&Xa(l)}),d=(l,p)=>m`<button type="button" role="tab" id=${`hma-tab-${l}`} class=${this.tab===l?"on":""}
      aria-selected=${this.tab===l?"true":"false"} aria-controls="hma-panel" @click=${()=>this.setTab(e,l)}>${p}</button>`;return m`<dialog class="hma" aria-labelledby="hma-title" ${Ae(qa)}
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
          ${this.tab==="devices"?this.devicesTab(e,o,t,a):this.furnitureTab(e,t,a)}
        </div>
      </div>
    </dialog>`}devicesTab(e,t,o,n){let i=e.hass?.states,r=this.choice,a=er(e.hass),d=r===void 0?a:a.filter(w=>(!r.lightsOnly||w.domain==="light")&&w.entityId!==r.now),l=Ba(d,this.query);!this.areaChosen&&this.area!==fe&&Vr(l,this.area).every(w=>w.devices.length===0)&&(this.area=fe);let p=Ua(e,l,t?.areaId,this.area),h=Vr(l,this.area),u=h.reduce((w,H)=>w+H.devices.length,0),f=Cn,g=h.map(w=>{let H=w.devices.slice(0,Math.max(f,0));return f-=H.length,{...w,devices:H}}).filter(w=>w.devices.length>0),c=this.area===fe?"in any area":this.area===bo?"with no area":`in ${p.find(w=>w.id===this.area)?.name??"this area"}`,b=this.query.trim()!=="",y=r?.lightsOnly===!0?"light":"device";return m`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find a ${y}" aria-label="Find a ${y}" autofocus .value=${G(this.query)} ${n}
          @input=${w=>{this.query=w.target.value,e.redraw()}} /></label>
      <div class="hme-chips hma-chips" role="group" aria-label="Areas">
        ${p.map(w=>{let H=w.id===this.area;return m`<button type="button" class="hme-chip sel ${H?"on":""}" aria-pressed=${H?"true":"false"}
            @click=${()=>{this.area=w.id,this.areaChosen=!0,e.redraw()}}>${w.name}<span class="hma-n">${w.count}</span></button>`})}
      </div>
      <div class="hma-list">
        ${u===0?m`<p class="hma-empty">${b?`Nothing by that name ${c}.`:`No ${y}s ${c}.`}</p>`:v}
        ${g.map(w=>m`<section class="hma-sec">
          <div class="hme-h">${w.label}<span class="hme-h-end">${w.devices.length}</span></div>
          ${w.devices.map(H=>this.deviceRow(e,H,i,o))}
        </section>`)}
        ${u>Cn?m`<p class="hma-empty">Showing ${Cn} of ${u}. Type to narrow the list.</p>`:v}
      </div>
      <div class="hma-foot">
        <span class="hma-count">${S(u,y)}</span>
      </div>`}deviceRow(e,t,o,n){let i=t.entityId.startsWith("light."),r=Va(e.doc,t.entityId),a=this.choice,d=a!==void 0?a.rowTitle(t.name):i?"Add it in a lamp. A light can be on the map many times.":r===void 0?"Put it on the map":"On the map: click to pick it",l=me(t.entityId,t.deviceClass,t.name);return m`<button type="button" class="hma-row ${a===void 0&&!i&&r!==void 0?"placed":""}" title=${d}
      @click=${()=>this.addDevice(e,t,n)}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${Q(l,"currentColor",24,2)}</svg></span>
      <span class="hma-nm"><span>${t.name}</span><small class="mono">${t.entityId}</small></span>
      <span class="hma-state">${ee(t.entityId,o)}</span>
      ${r===void 0?v:m`<span class="hma-tag">${r}</span>`}
    </button>`}furnitureTab(e,t,o){let n=this.furnitureRoom(e),i=xn(this.pieceQuery,this.pieceGroup).filter(d=>d.pieces.length>0),r=["",...De.groups],a=d=>De.pieces.filter(l=>d===""||l.group===d).length;return m`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find a piece: sofa, lamp, desk" aria-label="Find a piece" autofocus .value=${G(this.pieceQuery)} ${o}
          @input=${d=>{this.pieceQuery=d.target.value,e.redraw()}} /></label>
      <div class="hme-chips hma-chips" role="group" aria-label="Groups">
        ${r.map(d=>{let l=d===this.pieceGroup;return m`<button type="button" class="hme-chip sel ${l?"on":""}" aria-pressed=${l?"true":"false"}
            @click=${()=>{this.pieceGroup=d,e.redraw()}}>${d===""?"All":d}<span class="hma-n">${a(d)}</span></button>`})}
      </div>
      ${n===void 0?this.askRoom(e):m`<p class="hma-where">Into <b>${T(n)}</b>: each piece stands against the nearest free wall, facing into the room. Drag it into place after.</p>`}
      <div class="hma-list">
        ${i.length===0?m`<p class="hma-empty">No piece by that name${this.pieceGroup===""?"":` in ${this.pieceGroup}`}.</p>`:v}
        ${i.map(d=>m`<section class="hma-sec">
          <div class="hme-h">${d.title}<span class="hme-h-end">${S(d.pieces.length,"piece")}</span></div>
          <div class="hma-grid">${d.pieces.map(l=>m`<button type="button" class="hme-fcard" ?disabled=${n===void 0}
            title=${`Add ${l.name}, ${We(l)}`} @click=${()=>this.addPiece(e,l,t)}>
            ${this.picture(e,l,"hme-fcard-pic")}
            <span class="hme-fcard-name">${l.name}</span>
            <span class="hme-fcard-size mono">${We(l)}</span>
          </button>`)}</div>
        </section>`)}
      </div>`}askRoom(e){return e.floor.rooms.length===0?m`<p class="hma-where warn">Draw or scan a room first, then add its furniture.</p>`:m`<div class="hma-ask">
      <p class="hma-where warn">Which room is it for? Pick one, or pick a room on the plan first.</p>
      <div class="hme-chips hma-chips" role="group" aria-label="Rooms">
        ${e.floor.rooms.map(t=>m`<button type="button" class="hme-chip sel" aria-pressed="false"
          @click=${()=>{this.roomId=t.id,e.redraw()}}>${T(t)}</button>`)}
      </div>
    </div>`}},qr=xt`
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
`;function Zr(s){return{get:()=>Ht(s),save:(e,t)=>Rn(s,e,t)}}var Jr="The map had changed on another device. Your change was saved on top of it.",Ya="The map changed on another device, and your change no longer fits it. It now shows the map as saved there.",Za="The map changed again while saving, so your change was not saved. Try it once more.";function Ja(s){return{doc:Pt(s?.doc)??null,rev:typeof s?.rev=="number"?s.rev:0}}function Yr(s,e){let t=typeof e=="function"?e(s):zn(s,e);if(t===void 0)return;let o=nt(t);return o.ok?{doc:o.doc}:{text:`Not saved. ${o.message}.`}}async function Qr(s,e,t){if(e.doc===null)return{ok:!1,text:"There is no map to change yet."};let o=Yr(e.doc,t);if(o===void 0)return{ok:!1,text:"That is no longer on the map."};if("text"in o)return{ok:!1,text:o.text};try{let r=await s.save(o.doc,e.rev);return{ok:!0,read:{doc:o.doc,rev:r.rev},merged:!1}}catch(r){let{code:a,message:d}=Ne(r);if(a!=="conflict")return{ok:!1,text:`Not saved. ${d}`}}let n;try{n=Ja(await s.get())}catch(r){return{ok:!1,text:`Not saved. The map changed on another device and could not be read again: ${Ne(r).message}`}}let i=n.doc===null?void 0:Yr(n.doc,t);if(i===void 0)return{ok:!1,text:Ya,read:n};if("text"in i)return{ok:!1,text:i.text,read:n};try{let r=await s.save(i.doc,n.rev);return{ok:!0,read:{doc:i.doc,rev:r.rev},merged:!0}}catch(r){let{code:a,message:d}=Ne(r);return{ok:!1,text:a==="conflict"?Za:`Not saved. ${d}`,read:n}}}function yo(s){return Array.isArray(s)?`[${s.map(yo).join(",")}]`:typeof s=="object"&&s!==null?`{${Object.entries(s).filter(([,t])=>t!==void 0).sort(([t],[o])=>t<o?-1:t>o?1:0).map(([t,o])=>`${JSON.stringify(t)}:${yo(o)}`).join(",")}}`:JSON.stringify(s)}function Qa(s,e){return s===e?!0:s==null||e==null?!1:yo(s)===yo(e)}function ea(s,e){return t=>Qa(t,s)?e:void 0}var Mo=class{constructor(e,t,o=()=>{},n=()=>{},i){this.api=e;this.changed=o;this.saved=n;this.state={kind:"saved"};this.queue=[];this.confirmed=t,this.doc=t.doc,this.history=new Ui(i)}get busy(){return this.queue.length>0||this.running!==void 0}get canUndo(){return this.doc!==null&&this.history.canUndo}get canRedo(){return this.doc!==null&&this.history.canRedo}load(e){return this.busy?!1:(this.confirmed=e,this.doc=e.doc,this.history.clear(),this.changed(),!0)}apply(e){let t=this.doc;if(t===null)return!1;let o=e(t);if(o===void 0)return!1;let n=nt(o);return n.ok?(this.history.push(t),this.doc=n.doc,this.enqueue(e),!0):(this.note={kind:"err",text:`That cannot be saved. ${n.message}.`},this.changed(),!1)}undo(){let e=this.doc;if(e===null)return!1;let t=this.history.undo(e);return t===void 0?!1:(this.doc=t,this.enqueue(ea(e,t)),!0)}redo(){let e=this.doc;if(e===null)return!1;let t=this.history.redo(e);return t===void 0?!1:(this.doc=t,this.enqueue(ea(e,t)),!0)}async idle(){for(;this.running!==void 0;)await this.running}dismissNote(){this.note=void 0,this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed()}enqueue(e){this.queue.push(e),this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed(),this.kick()}kick(){this.running===void 0&&(this.running=this.run().finally(()=>{this.running=void 0,this.queue.length>0?this.kick():this.changed()}))}async run(){for(;this.queue.length>0;){let e=this.queue.splice(0),t=e.length===1?e[0]:n=>e.reduce((i,r)=>i===void 0?void 0:r(i),n);this.state={kind:"saving"},this.changed();let o=await Qr(this.api,this.confirmed,t);if(o.ok){this.confirmed=o.read,this.saved(o.read),o.merged?(this.note={kind:"warn",text:Jr},this.history.clear(),this.doc=this.rebased()):this.queue.length===0&&(this.doc=o.read.doc);continue}this.queue=[],this.history.clear(),o.read!==void 0&&(this.confirmed=o.read,this.saved(o.read)),this.doc=this.confirmed.doc,this.note={kind:"err",text:o.text},this.state={kind:"error",text:o.text},this.changed();return}this.state={kind:"saved"}}rebased(){let e=this.confirmed.doc;if(e===null)return null;let t=[];for(let o of this.queue){let n=o(e);if(n===void 0)continue;let i=nt(n);i.ok&&(e=i.doc,t.push(o))}return this.queue=t,e}};var ta=xt`
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
`;var $t={plan:{title:"Plan",hint:"The floor from above, with real floors, walls and pools of light."},night:{title:"Night",hint:"A small model at night. Lit rooms glow warm."},warm:{title:"Warm",hint:"Wood floors and cream walls, like a doll house."},lines:{title:"Lines",hint:"Only the lines. Calm and clean."},clay:{title:"Clay",hint:"A soft light model, for light pages."},blueprint:{title:"Blueprint",hint:"White lines on blue paper."},dots:{title:"Dots",hint:"A quiet plan with a dot for each light."}};function es(s,e){if(!Yt(s))return"Home style";let t=qo(s,e),o=i=>Object.hasOwn(s,Wi[i]),n=[];return o("look")&&n.push($t[t.look].title),o("turn")&&n.push(`turned ${t.turn}\xB0`),o("names")&&n.push(t.names?"room names":"no room names"),o("devices")&&n.push(t.devices==="all"?"every device":t.devices==="none"?"no devices":"lights only"),o("furniture")&&n.push(t.furniture?"furniture":"no furniture"),o("glow")&&n.push(t.glow?"glow":"no glow"),`Own look: ${n.join(", ")}`}var oa=(s,e)=>typeof s=="number"&&Number.isFinite(s)?s:e;function ts(s,e){let t=Vn(s);return Un(s).flatMap(o=>{if(To(Dt(o))!=="home_map")return[];let n=o,i=Xn(Dt(o)),r=e?.floors.find(u=>M(u.id,i)),a=typeof n.homeMapRoomId=="string"?n.homeMapRoomId:void 0,d=a===void 0?void 0:r?.rooms.find(u=>M(u.id,a)),l=`${oa(o.colSpan,1)}\xD7${oa(o.rowSpan,1)}`,h=(typeof o.customLabel=="string"&&o.customLabel.trim()!==""?o.customLabel.trim():void 0)??(d?.name?.trim()?`${d.name.trim()} only`:r===void 0||(e?.floors.length??0)<=1?"Home map":z(r));return[{pageId:t,pageName:Rt(s),tileId:typeof o.id=="string"?o.id:"",what:h,size:l,own:Yt(n),words:es(n,e),look:qo(n,e).look}]})}function na(s,e){return Object.values(s?.pages??{}).map(o=>o?.item).filter(o=>It(o)).sort((o,n)=>Rt(o).localeCompare(Rt(n))).flatMap(o=>ts(o,e))}function ia(s){let e=!1;if(!Array.isArray(s.pages))return;let t=s.pages.map(o=>{if(!It(o)||!Array.isArray(o.items))return o;let n=o.items.map(i=>!It(i)||To(Dt(i))!=="home_map"||!Yt(i)?i:(e=!0,Gi(i)));return{...o,items:n}});return e?{...s,pages:t}:void 0}var ko={width:112,height:68},os={width:94,height:94,radius:34},ns={width:188,height:94,radius:22},is=.9,$o=class{constructor(){this.usesState="idle";this.busy=!1}style(e){let t=ye(e.doc);return this.turnLive===void 0?t:{...t,turn:this.turnLive}}set(e,t){e.apply(o=>Bi(o,t))}panel(e,t){let o=this.style(e),n=e.hass?.states,i=ct.includes(o.look),r=(a,d,l)=>m`<button type="button" class="hme-chip sel ${d?"on":""}" aria-pressed=${d?"true":"false"} @click=${l}>${a}</button>`;return m`<div class="hme-style-scrim" @pointerdown=${a=>{a.target===a.currentTarget&&t()}}></div>
      <div class="hme-style-pop" role="dialog" aria-label="Home style">
        <header class="hme-style-head">
          <strong>Home style</strong>
          <span>How every map tile looks, unless a tile picks its own</span>
          <button type="button" class="hme-x hme-style-close" aria-label="Close" title="Close (Esc)" @click=${t}>✕</button>
        </header>

        ${E("Look",m`<div class="hme-looks four">
          ${An.map(a=>{let d=a===o.look,l=Je({floor:e.floor,states:n,...o,look:a,names:!1,width:ko.width,height:ko.height});return m`<button type="button" class="hme-look ${d?"on":""}" aria-pressed=${d?"true":"false"} title=${$t[a].hint}
              @click=${()=>this.set(e,{look:a})}>
              <svg viewBox=${`0 0 ${ko.width} ${ko.height}`} style=${`background:${Me(a,.5)}`} aria-hidden="true">${l}</svg>
              <span>${$t[a].title}</span></button>`})}
        </div>
        <p class="hme-foot">Plan and Dots draw the floor from above. The other five draw it as a small model you can turn.</p>`)}

        <div class="hme-style-row">
          ${E("Show",m`
            <div class="hme-r"><span class="hme-l">Room names</span>${r(o.names?"Shown":"Hidden",o.names,()=>this.set(e,{names:!o.names}))}</div>
            <div class="hme-r"><span class="hme-l">Devices</span><div class="hme-chips">
              ${r("Lights",o.devices==="lights",()=>this.set(e,{devices:"lights"}))}
              ${r("All",o.devices==="all",()=>this.set(e,{devices:"all"}))}
              ${r("None",o.devices==="none",()=>this.set(e,{devices:"none"}))}</div></div>
            <div class="hme-r"><span class="hme-l">Furniture</span>${r(o.furniture?"Shown":"Hidden",o.furniture,()=>this.set(e,{furniture:!o.furniture}))}</div>
            <div class="hme-r"><span class="hme-l">Light glow</span>${r(o.glow?"On":"Off",o.glow,()=>this.set(e,{glow:!o.glow}))}</div>
            <div class="hme-r"><span class="hme-l">Turn</span>
              <input class="hme-range" type="range" min="-180" max="180" step="1" .value=${G(String(o.turn))} ?disabled=${!i} aria-label="Turn the model"
                style=${Ke(o.turn,-180,180)}
                @input=${a=>{this.turnLive=Number(a.target.value),e.redraw()}}
                @change=${a=>{this.turnLive=void 0,this.set(e,{turn:Number(a.target.value)})}} />
              <span class="hme-val mono hme-w48">${i?`${o.turn}\xB0`:"flat"}</span></div>`,void 0,"hme-grow-card")}
          ${E("Preview",m`<div class="hme-style-tiles">
            ${this.face(e,o,os,"Watch tile 2 \xD7 2")}
            ${this.face(e,o,ns,"iPhone tile 4 \xD7 2")}
          </div>`,$t[o.look].title,"hme-grow-card")}
        </div>

        ${this.usesCard(e)}
      </div>`}face(e,t,o,n){let i=is,r=e.hass?.states,a=Ji(o.width,o.height),d=Je({floor:e.floor,states:r,...t,width:a.width,height:a.height,tileHeight:o.height,icons:e.icons}),l=Tt(e.floor,r),p=6*i;return m`<figure class="hme-fr">
      <div class="hme-face" style=${`width:${o.width*i}px;height:${o.height*i}px;border-radius:${o.radius*i}px;background:${Me(t.look,i)}`}>
        <svg viewBox=${`0 0 ${a.width} ${a.height}`} aria-hidden="true"
          style=${`left:${a.x*i}px;top:${a.y*i}px;width:${a.width*i}px;height:${a.height*i}px`}>${d}</svg>
        ${o.height>90?m`<span class="hme-face-title" style=${`left:${p}px;top:${p}px;font-size:${11*i}px;color:${Yi(t.look)}`}>${rs(e.floor)}</span>`:v}
        <span class="hme-face-words" style=${`left:${p}px;bottom:${p}px;font-size:${10*i}px;color:${Zi(t.look,l>0)}`}>${Ct(l)}</span>
      </div>
      <figcaption>${n}</figcaption>
    </figure>`}leave(){this.turnLive=void 0,this.usesState="idle",this.message=void 0}look(e){return ye(e.doc).look}loadUses(e){let t=e.hass;this.usesState!=="idle"||t===void 0||(this.usesState="loading",St(t).then(o=>{this.summary=o,this.usesState="done",e.redraw()},()=>{this.usesState="error",e.redraw()}))}usesCard(e){if(this.loadUses(e),this.usesState!=="done")return E("Used on",m`<p class="hme-text dim">${this.usesState==="error"?"Could not read your pages.":"Reading your pages\u2026"}</p>`);let t=na(this.summary,e.doc),o=t.filter(n=>n.own);return E(`Used on ${S(t.length,"tile")}`,m`
      ${t.length===0?m`<p class="hme-text dim">No page has a Home map tile yet. Add one from a page's Add tile.</p>`:v}
      ${t.map(n=>this.useRow(e,n))}
      ${o.length===0?v:m`<button type="button" class="hme-tb hme-wide" ?disabled=${this.busy}
        @click=${()=>{this.useHomeStyleOnAll(e,o)}}>${this.busy?"Saving\u2026":`Use the home style on all ${o.length}`}</button>`}
      ${this.message===void 0?v:m`<p class="hme-text dim" role="status">${this.message}</p>`}`)}useRow(e,t){return m`<div class="hme-use">
      <i style=${`background:${Me(t.look,.2)}`}></i>
      <div><span>${t.pageName} · ${t.what} ${t.size}</span><small>${t.words}</small></div>
      ${e.openPage===void 0?v:m`<button type="button" class="hme-tb" @click=${()=>e.openPage?.(t.pageId)}>Edit</button>`}
    </div>`}async useHomeStyleOnAll(e,t){let o=e.hass;if(o===void 0||this.busy)return;let n=[...new Set(t.map(a=>a.pageId))];if(!await e.confirm({title:`Use the home style on ${S(t.length,"tile")}?`,text:`Their own looks come off, so each draws the home style. ${n.length===1?"The page is":`The ${n.length} pages are`} saved for every watch and iPhone that shows ${n.length===1?"it":"them"}.`,ok:"Use the home style"}))return;this.busy=!0,this.message=void 0,e.redraw();let r=0;for(let a of n)try{let d=await Bn(o,"pages",a),l=ia(d.document);l!==void 0&&await Gn(o,"pages",a,d.revision,l)}catch{r+=1}this.busy=!1,this.message=r===0?"Done: those tiles follow the home style now.":`${S(r,"page")} could not be saved. Try again, or open ${r===1?"it":"them"} to see why.`,this.usesState="idle",e.redraw()}};function rs(s){return s.name.trim()===""?"Home map":s.name.trim()}var as="Update the Wrist Assistant integration to see the home map here.",ss="No home map yet. Scan your rooms with the Wrist Assistant app on an iPhone or iPad with LiDAR (the Pro models). The map shows here once it is saved.",ds=4,ls=140;function ps(s){return s.kind==="saving"?"Saving\u2026":s.kind==="error"?"Not saved":"Saved"}var ra={night:"Night",warm:"Warm",lines:"Lines",clay:"Clay",blueprint:"Blueprint"},C=class extends In{constructor(){super(...arguments);this.narrow=!1;this.icons=void 0;this.iconsTick=0;this.capable=!1;this.bundleUrl=void 0;this.onHome=void 0;this.onOpenPage=void 0;this.unsupported=!1;this.loading=!1;this.styleOpen=!1;this.viewKind="both";this.artScale=0;this.stageSize={width:0,height:0};this.toggles={snap:!0,square:!0,grid:!1,measure:!1,live:!0,scan:!1};this.measure={};this.floorMenu=!1;this.model3d=!0;this.daylight=!1;this.spaceHeld=!1;this.tick=0;this.page=new go;this.stylePanel=new $o;this.addDialog=new wo(this.page.devices,(t,o,n)=>this.page.arrange.piecePic(t,o,n));this.loadSeq=0;this.askedOnce=!1;this.needFit=!0;this.userMoved=!1;this.touches=new Map;this.artKey="";this.artHeld=v;this.loading3d=!1;this.failed3d=!1;this.onKey=t=>{if(this.dialog!==void 0||this.addOpen!==void 0||this.session===void 0||this.renderRoot?.querySelector?.(".hme-sheet")!=null)return;let o=(typeof t.composedPath=="function"?t.composedPath()[0]:void 0)??t.target;if(sn(o))return;let n=te(t,!1);if(n==="undo"||n==="redo"){t.preventDefault?.(),n==="undo"?this.undo():this.redo();return}if(this.styleOpen){t.key==="Escape"&&this.closeStyle();return}if(cr(o))return;if(this.dockMenu!==void 0&&t.key==="Escape"){this.dockMenu=void 0;return}if(t.key===" "&&!t.repeat){this.spaceHeld=!0,t.preventDefault?.();return}if(typeof n=="object"&&"letter"in n&&n.letter==="a"&&!this.page.devices.choosing){t.preventDefault?.(),this.openAdd();return}let i=this.context();if(i!==void 0&&this.viewKind!=="model"&&this.page.keyDown?.(i,t)===!0){t.preventDefault?.();return}switch(n){case"cancel":this.floorMenu?this.floorMenu=!1:this.toggles.measure?this.setToggle("measure",!1):this.walls!==void 0?this.editWalls(void 0):this.selection=void 0;return;case"zoomIn":this.zoomBy(ut);return;case"zoomOut":this.zoomBy(1/ut);return;case"fit":this.fit();return}};this.onKeyUp=t=>{t.key===" "&&(this.spaceHeld=!1)}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKey),window.addEventListener("keyup",this.onKeyUp),this.askedOnce&&this.load(!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKey),window.removeEventListener("keyup",this.onKeyUp),this.endDrag?.(),this.observer?.disconnect(),this.observed=void 0,this.zoomTimer!==void 0&&clearTimeout(this.zoomTimer),this.loadSeq++,this.drop3d()}willUpdate(t){this.hass&&this.capable&&!this.askedOnce&&(this.askedOnce=!0,this.load(),this.loadPages());let o=this.baseFloor();this.needFit&&o!==void 0&&this.stageSize.width>0&&this.fit()}updated(){let t=this.renderRoot.querySelector?.(".hme-dialog");t instanceof Element&&t!==this.focusedDialog?(this.focusedDialog=t,(t.querySelector("input")??t.querySelector(".primary"))?.focus?.(),t.querySelector("input")?.select?.()):t===null&&(this.focusedDialog=void 0);let o=this.renderRoot.querySelector?.(".hme-stage");o instanceof Element&&o!==this.observed&&typeof ResizeObserver<"u"&&(this.observer??=new ResizeObserver(n=>{let i=n[n.length-1]?.contentRect;i!==void 0&&this.resizeStage(i.width,i.height)}),this.observed!==void 0&&this.observer.unobserve(this.observed),this.observer.observe(o),this.observed=o),this.view!==void 0&&this.view.scale!==this.artScale&&this.zoomTimer===void 0&&(this.zoomTimer=setTimeout(()=>{this.zoomTimer=void 0,this.view!==void 0&&(this.artScale=this.view.scale)},ls)),this.sync3d()}input3d(){let t=this.shownFloor();if(t===void 0)return;let o=this.selection,n=ue(o),i=ce(o),r=n.length>0?{things:n}:i===void 0?void 0:{roomId:i};return{floor:t,states:this.toggles.live?this.hass?.states:void 0,mark:r,daylight:this.daylight}}sync3d(){let t=this.renderRoot.querySelector?.(".hme-3d-host"),o=this.input3d();if(!(t instanceof HTMLElement)||o===void 0||this.bundleUrl===void 0){this.drop3d();return}if(this.scene3d!==void 0){this.scene3d.attach(t),this.scene3d.update(o,this.modelTurnNow()),this.scene3d.setHover(this.hoverFor3d());return}if(this.loading3d||this.failed3d)return;this.loading3d=!0;let n=Mn(this.bundleUrl);so().then(i=>{if(this.loading3d=!1,!!this.isConnected){try{this.scene3d??=new i.HomeMapScene3D(n),this.scene3d.onPick=(r,a)=>this.pick3d(r,a),this.scene3d.onHover=r=>this.hover3d(r)}catch{this.failed3d=!0}this.tick++}},()=>{this.loading3d=!1,this.failed3d=!0,this.tick++})}pick3d(t,o={add:!1}){if(this.dialog!==void 0)return;this.floorMenu=!1;let n=this.baseFloor(),i=t?.kind==="pin"&&n!==void 0?Z(n,t.pinId):void 0,r=i===void 0?t:{kind:"object",roomId:i.roomId,object:i.object};if(this.walls!==void 0){(r===void 0||r.kind==="pin"||!M(r.roomId,this.walls))&&this.editWalls(void 0);return}if(o.add){r?.kind==="object"?this.select(je(this.selection,{roomId:r.roomId,object:r.object})):r?.kind==="pin"&&this.select(Le(this.selection,r.pinId));return}this.select(r===void 0?void 0:r.kind==="pin"?{kind:"pin",pinId:r.pinId}:r.kind==="object"?{kind:"object",roomId:r.roomId,object:r.object}:{kind:"room",roomId:r.roomId})}drop3d(){this.scene3d?.dispose(),this.scene3d=void 0}setHover(t){ao(t,this.hover)||(this.hover=t)}hover3d(t){if(this.dialog!==void 0||this.walls!==void 0){this.setHover(void 0);return}this.setHover(t===void 0?void 0:t.kind==="pin"?ro(this.baseFloor(),{kind:"pin",pinId:t.pinId}):t.kind==="object"?{kind:"object",roomId:t.roomId,object:t.object}:{kind:"room",roomId:t.roomId})}hoverFor3d(){let t=wn(this.hover,this.selection);if(t!==void 0)return t.kind==="pin"?{kind:"pin",pinId:t.pinId}:t.kind==="object"?{kind:"object",roomId:t.roomId,object:t.object}:t.kind==="room"?{kind:"room",roomId:t.roomId}:void 0}planHoverAt(t,o,n){if(o.pointerType==="touch"||this.spaceHeld||this.dialog!==void 0||this.walls!==void 0||this.page.tool(t)!=="pick"||this.page.devices.choosing)return;let i=o.target;if(!(typeof i?.closest=="function"&&i.closest("[data-hme=turn], [data-hme=resize]")!==null))return Er(t.floor,t.toScreen,n)}turnBack(){this.modelTurn=void 0,this.scene3d?.frameFloor(ye(this.doc).turn??Jo)}async load(t=!1){let o=this.hass;if(!o||!this.capable)return;let n=++this.loadSeq;t||(this.loading=this.session===void 0,this.loadError=void 0);try{let i=await Ht(o);if(n!==this.loadSeq)return;this.unsupported=!1,this.loadError=void 0,this.show({doc:Pt(i?.doc)??null,rev:typeof i?.rev=="number"?i.rev:0}),this.loadScans()}catch(i){if(n!==this.loadSeq)return;let{code:r,message:a}=Ne(i);r==="unknown_command"?this.unsupported=!0:(!t||this.session===void 0)&&(this.loadError=a)}this.loading=!1}async loadScans(){let t=this.hass;if(t)try{this.scans=await Kn(t)}catch{}}async loadPages(){let t=this.hass;if(t)try{let o=qn(await St(t));this.pages=Yn(o,"pages").map(n=>({id:n.id,name:n.name}))}catch{this.pages=[]}}show(t){let o=this.hass;if(o&&Eo(o,t),this.session===void 0)this.session=new Mo(Zr(this.hassOrThrow()),t,()=>this.afterChange(),n=>{this.hass&&Eo(this.hass,n)}),this.needFit=!0;else if(!this.session.load(t))return;this.afterChange()}hassOrThrow(){let t=this.hass;if(t===void 0)throw new Error("no hass");return t}afterChange(){let t=this.session?.doc?.floors??[];t.some(n=>M(n.id,this.floorId))||(this.floorId=t[0]?.id,this.needFit=!0);let o=this.walls;o!==void 0&&!(this.baseFloor()?.rooms??[]).some(n=>M(n.id,o))&&(this.walls=void 0),fn(this.baseFloor(),this.selection)||(this.selection=void 0),fn(this.baseFloor(),this.hover)||(this.hover=void 0),this.tick++}get doc(){return this.session?.doc??null}baseFloor(){let t=this.doc?.floors??[];return t.find(o=>M(o.id,this.floorId))??t[0]}shownFloor(){let t=this.baseFloor();return t===void 0||this.previewDoc===void 0?t:this.previewDoc.floors.find(o=>M(o.id,t.id))??t}apply(t,o={}){let n=this.session;return n===void 0?!1:(this.previewDoc=void 0,n.apply(t)?(o.floorId!==void 0&&(this.floorId=o.floorId),o.select!==void 0&&(this.selection=ro(this.baseFloor(),o.select??void 0)),this.afterChange(),!0):(this.tick++,!1))}preview(t){let o=this.doc;this.previewDoc=t===void 0||o===null?void 0:t(o)??this.previewDoc,this.tick++}undo(){this.previewDoc=void 0,this.session?.undo()===!0&&this.afterChange()}redo(){this.previewDoc=void 0,this.session?.redo()===!0&&this.afterChange()}select(t){this.selection=ro(this.baseFloor(),t)}editWalls(t,o){let n=this.walls,i=t===void 0?void 0:this.baseFloor()?.rooms.find(d=>M(d.id,t));if(t!==void 0&&i===void 0)return;let r=this.context();r!==void 0&&!(t===void 0?n===void 0:M(t,n))&&this.page.leave?.(r),this.walls=i?.id,this.styleOpen=!1;let a=i?.id??n;this.selection=o??(a===void 0?this.selection:{kind:"room",roomId:a})}setFloor(t){let o=this.context();o!==void 0&&this.page.leave?.(o),this.floorId=t,this.walls=void 0,this.selection=void 0,this.floorMenu=!1,this.measure={},this.needFit=!0,this.userMoved=!1}setToggle(t,o){this.toggles={...this.toggles,[t]:o},t==="measure"&&(this.measure={}),t==="scan"&&o&&this.loadScans()}confirm(t){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(o=>{this.dialog={kind:"confirm",...t,done:n=>{this.dialog=void 0,o(n)}}})}ask(t){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(o=>{this.dialog={kind:"ask",...t,done:n=>{this.dialog=void 0,o(n)}}})}resizeStage(t,o){let n=this.stageSize.width===0;this.stageSize={width:t,height:o},(n||!this.userMoved)&&(this.needFit=!0)}fit(){let{width:t,height:o}=this.stageSize;t<=0||(this.view=rn(this.baseFloor(),t,o),this.artScale=this.view.scale,this.needFit=!1,this.userMoved=!1)}zoomBy(t,o){this.view!==void 0&&(this.view=an(this.view,t,o??[this.stageSize.width/2,this.stageSize.height/2]),this.userMoved=!0)}context(){let t=this.doc,o=this.shownFloor();if(t===null||o===void 0)return;let n=this.view??{scale:40,ox:0,oy:0},i=this.session;return{hass:this.hass,icons:this.icons,doc:t,floor:o,selection:this.selection,walls:this.walls,view:n,stage:this.stageSize,toggles:this.toggles,pages:this.pages??[],areas:Nn(this.hass),scans:this.scans,furnitureBase:this.bundleUrl===void 0?void 0:Mn(this.bundleUrl),canUndo:i?.canUndo??!1,canRedo:i?.canRedo??!1,toScreen:r=>lr(n,r),px:r=>r*n.scale,toPlan:(r,a)=>this.toPlan(r,a),apply:(r,a)=>this.apply(r,a),preview:r=>this.preview(r),select:r=>this.select(r),editWalls:(r,a)=>this.editWalls(r,a),setFloor:r=>this.setFloor(r),setToggle:(r,a)=>this.setToggle(r,a),drag:(r,a)=>this.drag(r,a),undo:()=>this.undo(),redo:()=>this.redo(),confirm:r=>this.confirm(r),ask:r=>this.ask(r),newId:()=>Co(),note:(r,a)=>{this.session!==void 0&&(this.session.note={kind:r,text:a}),this.tick++},redraw:()=>{this.tick++},hover:this.hover,setHover:r=>this.setHover(r),openAdd:(r,a)=>this.openAdd(r,a),openPage:this.onOpenPage}}openAdd(t="devices",o){let n=this.context();n!==void 0&&(this.floorMenu=!1,this.styleOpen&&this.closeStyle(),this.addDialog.open(n,t,o),this.addOpen=t)}closeAdd(){this.addOpen!==void 0&&(this.addOpen=void 0,this.updateComplete.then(()=>{this.renderRoot?.querySelector?.(".hme-add-btn")?.focus?.()}))}toPlan(t,o){let n=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return ke(this.view??{scale:40,ox:0,oy:0},[t-n.left,o-n.top])}stagePoint(t){let o=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return[t.clientX-o.left,t.clientY-o.top]}drag(t,o){let n=this.stageEl;if(n===void 0)return;this.endDrag?.();let i=t.clientX,r=t.clientY,a=!1,d,l=0,p=typeof requestAnimationFrame=="function"?requestAnimationFrame:void 0,h=()=>{l=0,d!==void 0&&o.move(this.toPlan(d.clientX,d.clientY),d)};try{n.setPointerCapture?.(t.pointerId)}catch{}let u=b=>{let y=b;y.pointerId===t.pointerId&&(!a&&Math.hypot(y.clientX-i,y.clientY-r)<ds||(a=!0,d=y,p===void 0?h():l===0&&(l=p(h))))},f=b=>{let y=b;y.pointerId===t.pointerId&&(g(),l!==0&&(cancelAnimationFrame(l),h()),o.end(this.toPlan(y.clientX,y.clientY),y,a))},g=()=>{n.removeEventListener("pointermove",u),n.removeEventListener("pointerup",f),n.removeEventListener("pointercancel",f);try{n.releasePointerCapture?.(t.pointerId)}catch{}this.endDrag===c&&(this.endDrag=void 0)},c=()=>{g(),l!==0&&(cancelAnimationFrame(l),l=0),o.cancel?.()};n.addEventListener("pointermove",u),n.addEventListener("pointerup",f),n.addEventListener("pointercancel",f),this.endDrag=c}onStageDown(t){if(this.stageEl=t.currentTarget,this.floorMenu=!1,this.dockMenu=void 0,this.setHover(void 0),this.dialog!==void 0)return;if(t.pointerType==="touch"&&(this.touches.set(t.pointerId,[t.clientX,t.clientY]),this.touches.size===2)){this.endDrag?.(),this.preview(void 0),this.pinch();return}if(this.viewKind==="model"){this.turnModel(t);return}if(t.button===1||this.spaceHeld){t.preventDefault?.(),this.pan(t,!1);return}if(t.button!==0)return;let o=this.context();if(o===void 0)return;if(this.toggles.measure){let i=this.toPlan(t.clientX,t.clientY),r=this.measure;this.measure=r.a===void 0||r.b!==void 0?{a:i}:{a:r.a,b:i};return}let n=this.toPlan(t.clientX,t.clientY);if(this.page.pointerDown?.(o,t,n)===!0){t.preventDefault?.();return}this.pan(t,!0)}onStageDblClick(t){if(this.stageEl=t.currentTarget,this.dialog!==void 0||this.viewKind==="model"||this.toggles.measure||this.spaceHeld||t.button!==0)return;let o=this.context();o!==void 0&&this.page.doubleClick?.(o,t,this.toPlan(t.clientX,t.clientY))}onStageMove(t){if(this.stageEl=t.currentTarget,this.touches.has(t.pointerId)&&this.touches.set(t.pointerId,[t.clientX,t.clientY]),t.buttons!==0||this.viewKind==="model"){this.setHover(void 0);return}let o=this.toPlan(t.clientX,t.clientY);this.toggles.measure&&this.measure.a!==void 0&&this.measure.b===void 0&&(this.measure={...this.measure,hover:o});let n=this.context();n!==void 0&&(this.page.hover?.(n,o),this.setHover(this.planHoverAt(n,t,o)))}onStageLeave(){this.setHover(void 0);let t=this.context();t!==void 0&&this.page.hover?.(t,void 0)}onStageUp(t){this.touches.delete(t.pointerId)}onStageDrag(t){this.stageEl=t.currentTarget;let o=this.context();o===void 0||this.viewKind==="model"||this.dialog!==void 0||this.page.dragOver?.(o,this.toPlan(t.clientX,t.clientY),t)===!0&&(t.preventDefault?.(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"))}onStageDragLeave(t){let o=t.relatedTarget,n=t.currentTarget;if(o!==null&&n!==null&&typeof n.contains=="function"&&n.contains(o))return;let i=this.context();i!==void 0&&this.page.dragOver?.(i,void 0,t)}onStageDrop(t){this.stageEl=t.currentTarget;let o=this.context();o===void 0||this.viewKind==="model"||(t.preventDefault?.(),this.page.drop?.(o,this.toPlan(t.clientX,t.clientY),t))}pan(t,o){let n=this.view;if(n===void 0)return;let i=t.clientX,r=t.clientY;this.drag(t,{move:(a,d)=>{this.view={...n,ox:n.ox+d.clientX-i,oy:n.oy+d.clientY-r},this.userMoved=!0},end:(a,d,l)=>{!l&&o&&(this.selection=void 0)}})}pinch(){let t=this.stageEl,o=this.view,n=[...this.touches.keys()];if(t===void 0||o===void 0||n.length<2)return;let i=()=>n.map(f=>this.touches.get(f)),[r,a]=i(),d=Math.max(Math.hypot(a[0]-r[0],a[1]-r[1]),1),l=t.getBoundingClientRect(),p=[(r[0]+a[0])/2-l.left,(r[1]+a[1])/2-l.top],h=f=>{let g=f;if(!this.touches.has(g.pointerId))return;this.touches.set(g.pointerId,[g.clientX,g.clientY]);let[c,b]=i(),y=Math.max(Math.hypot(b[0]-c[0],b[1]-c[1]),1),w=[(c[0]+b[0])/2-l.left,(c[1]+b[1])/2-l.top],H=an(o,y/d,p);this.view={...H,ox:H.ox+w[0]-p[0],oy:H.oy+w[1]-p[1]},this.userMoved=!0},u=f=>{this.touches.delete(f.pointerId),t.removeEventListener("pointermove",h),t.removeEventListener("pointerup",u),t.removeEventListener("pointercancel",u)};t.addEventListener("pointermove",h),t.addEventListener("pointerup",u),t.addEventListener("pointercancel",u)}turnModel(t){let o=this.modelTurnNow(),n=t.clientX;this.drag(t,{move:(i,r)=>{let a=o+(r.clientX-n)*.5;a=((a+180)%360+360)%360-180,this.modelTurn=Math.round(a)},end:()=>{}})}modelTurnNow(){return this.modelTurn??ye(this.doc).turn??Jo}modelLookNow(){if(this.modelLook!==void 0)return this.modelLook;let t=ye(this.doc).look;return ct.includes(t)?t:"night"}onWheel(t){if(this.viewKind==="model"||this.view===void 0)return;this.stageEl=t.currentTarget,t.preventDefault?.();let o=t.deltaMode===1?16:t.deltaMode===2?400:1;if(t.ctrlKey||t.metaKey){this.zoomBy(Math.exp(-t.deltaY*o*.0025),this.stagePoint(t));return}this.view={...this.view,ox:this.view.ox-t.deltaX*o,oy:this.view.oy-t.deltaY*o},this.userMoved=!0}toggleStyle(){if(this.styleOpen){this.closeStyle();return}this.floorMenu=!1,this.styleOpen=!0}closeStyle(){this.styleOpen=!1,this.stylePanel.leave()}render(){if(this.tick,!this.capable||this.unsupported)return this.calm(m`<b>${as}</b>`);if(this.loadError!==void 0)return this.calm(m`<span>Could not read the home map: ${this.loadError}</span>
        <button class="hme-tb" @click=${()=>{this.load()}}>Try again</button>`);if(this.loading||this.session===void 0)return this.calm(m`Loading…`);let t=this.doc;if(t===null||t.floors.length===0)return this.calm(m`<b>${ss}</b>`);let o=this.context(),n=this.session.note;return m`<div class="hme">
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
    </div>`}calm(t){return m`<div class="hme-calm"><div class="hme-empty">${t}</div></div>`}renderBar(t,o){let n=this.baseFloor(),i=this.session?.state??{kind:"saved"},r=dn(),a=this.walls===void 0?void 0:n.rooms.find(l=>M(l.id,this.walls)),d=ye(t).look;return m`<header class="hme-bar">
      ${this.onHome===void 0?v:m`<button type="button" class="hme-back" @click=${()=>this.onHome?.()}>‹ Home</button><span class="hme-vsep"></span>`}
      <strong class="hme-title">Home map</strong><span class="hme-beta">BETA</span>
      ${a===void 0?v:m`<span class="hme-crumb-sep" aria-hidden="true">›</span>
        <strong class="hme-title hme-crumb">${T(a)} walls</strong>`}
      <div class="hme-floor-wrap">
        <button type="button" class="hme-tb hme-floor-btn" aria-label="Switch floor" aria-haspopup="menu" aria-expanded=${this.floorMenu?"true":"false"}
          @click=${()=>{this.floorMenu=!this.floorMenu}}>
          ${cn(n)}
          <span class="hme-floor-t"><span>${z(n)}</span><small>${S(n.rooms.length,"room")} · ${S(n.pins.length,"device")}</small></span>
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
      <button type="button" class="hme-tb hme-icon" aria-label="Undo" title=${`Undo (${r?"\u2318Z":"Ctrl+Z"})`} ?disabled=${!o.canUndo} @click=${()=>this.undo()}>↶</button>
      <button type="button" class="hme-tb hme-icon" aria-label="Redo" title=${`Redo (${r?"\u21E7\u2318Z":"Ctrl+Shift+Z"})`} ?disabled=${!o.canRedo} @click=${()=>this.redo()}>↷</button>
      <span class="hme-status ${i.kind}" role="status" title=${i.kind==="error"?i.text:v}><span class="hme-status-dot"></span>${ps(i)}</span>
    </header>`}renderStyleButton(t){return m`<button type="button" class="hme-tb hme-style-btn ${this.styleOpen?"on":""}" aria-haspopup="dialog" aria-expanded=${this.styleOpen?"true":"false"}
      title="How every map tile looks, unless a tile picks its own" @click=${()=>this.toggleStyle()}>
      <span class="hme-style-sw" style=${`background:${Me(t,.2)}`} aria-hidden="true"></span>Home style</button>`}renderFloorMenu(t,o){return m`<div class="hme-pop" role="menu" aria-label="Floors">
      ${t.floors.map(n=>m`<div class="hme-pop-row ${M(n.id,o.id)?"on":""}">
        <button type="button" role="menuitem" class="hme-pop-main" @click=${()=>this.setFloor(n.id)}>
          ${cn(n)}<span class="hme-floor-t"><span>${z(n)}</span><small>${S(n.rooms.length,"room")} · ${S(n.pins.length,"device")}</small></span></button>
        <button type="button" class="hme-pop-act" title="Rename" aria-label=${`Rename ${z(n)}`} @click=${()=>{this.renameFloorAsk(n)}}>Rename</button>
        <button type="button" class="hme-pop-act danger" title=${t.floors.length===1?"The map keeps at least one floor":"Delete"} aria-label=${`Delete ${z(n)}`}
          ?disabled=${t.floors.length===1} @click=${()=>{this.deleteFloorAsk(n)}}>Delete</button>
      </div>`)}
      <button type="button" class="hme-pop-add" @click=${()=>{this.addFloorAsk()}}>＋ Add a floor</button>
    </div>`}async addFloorAsk(){this.floorMenu=!1;let t=this.doc;if(t===null)return;let o=Math.max(...t.floors.map(r=>r.story))+1,n=await this.ask({title:"Add a floor",label:"Name",value:o===1?"Upstairs":`Floor ${o+1}`,ok:"Add floor"});if(n===void 0)return;let i=Co();this.apply(r=>li(r,{id:i,name:n,story:o}),{floorId:i,select:null})&&(this.needFit=!0)}async renameFloorAsk(t){this.floorMenu=!1;let o=await this.ask({title:"Rename floor",label:"Name",value:t.name||z(t),ok:"Rename"});o!==void 0&&this.apply(n=>Lt(n,t.id,o))}async deleteFloorAsk(t){this.floorMenu=!1,await this.confirm({title:`Delete ${z(t)}?`,text:`Its ${S(t.rooms.length,"room")} and ${S(t.pins.length,"device")} come off the map. Undo brings them back while this page is open.`,ok:"Delete floor",danger:!0})&&this.apply(n=>pi(n,t.id),{select:null})}renderStage(t){let o=this.page,{width:n,height:i}=this.stageSize,r=this.viewKind==="model",a=this.viewKind==="both",d=r?v:o.pill?.(t)??v,l=r?v:o.banner?.(t)??v,p=this.spaceHeld?"grab":r?"ew-resize":this.toggles.measure?"crosshair":o.cursor?.(t)??"default",h=t.floor.rooms.length===0,u=this.model3d&&this.bundleUrl!==void 0,f=a?u?m`<div class="hme-stage model hme-split-r hme-3d">
      ${this.render3d(t)}
      ${this.renderModelDock(!1)}
    </div>`:m`<div class="hme-stage model hme-split-r" style=${`background:${Me(this.modelLookNow())}`}>
      <svg class="hme-svg" width="100%" height="100%" viewBox=${`0 0 ${Math.max(n,1)} ${Math.max(i,1)}`} style="cursor:ew-resize"
        role="img" aria-label=${`Model of ${z(t.floor)}`}
        @pointerdown=${c=>this.onModelDown(c)}>
        ${this.renderModel(t,n,i)}
      </svg>
      ${this.renderModelDock(!1)}
    </div>`:v;if(r&&u)return m`<div class="hme-stage model hme-3d">
        ${this.render3d(t)}
        ${this.renderAddButton()}
        ${this.renderDock(t)}
      </div>`;let g=this.walls!==void 0&&!r;return m`<div class="hme-stage ${r?"model":""} ${a?"hme-split-l":""} ${g?"walls":""}" style=${r?`background:${Me(this.modelLookNow())}`:""}>
      <svg class="hme-svg" width="100%" height="100%" viewBox=${`0 0 ${Math.max(n,1)} ${Math.max(i,1)}`} style=${`cursor:${p}`}
        role="img" aria-label=${`Plan of ${z(t.floor)}`}
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
        ${r?this.renderModel(t,n,i):this.renderPlan(t,n,i)}
      </svg>
      ${l===v?v:m`<div class="hme-banner">${l}</div>`}
      ${d===v?v:m`<div class="hme-pill ${l===v?"":"under"}">${d}</div>`}
      ${r?v:o.stageExtra?.(t)??v}
      ${h&&!r&&!o.arrange.draw.active?m`<div class="hme-stage-empty"><b>No rooms on this floor yet.</b>
        <span>Draw one by hand, or scan this floor with the iPhone.</span>
        <button type="button" class="hme-tb" @click=${()=>{let c=this.context();c&&o.startDrawing(c)}}>＋ Draw a room by hand</button></div>`:v}
      ${g?v:this.renderAddButton()}
      ${this.renderDock(t)}
    </div>${f}`}renderAddButton(){return m`<button type="button" class="hme-add-btn" aria-haspopup="dialog" aria-expanded=${this.addOpen===void 0?"false":"true"}
      title="Add a device or a piece of furniture (A)" @click=${()=>this.openAdd()}>
      <span aria-hidden="true">＋</span>Add device or furniture</button>`}onModelDown(t){this.dialog!==void 0||t.button!==0||(this.stageEl=t.currentTarget,this.floorMenu=!1,this.dockMenu=void 0,this.turnModel(t))}renderPlan(t,o,n){let i=this.view;if(i===void 0||o<=0)return v;let r=this.planArt(t.floor,o,n,this.page.drawsPins?.(t)===!0?"none":"all"),a=i.scale/(this.artScale||i.scale);return k`${this.background(i,o,n)}
      <g class="hme-art" transform=${`translate(${i.ox.toFixed(2)} ${i.oy.toFixed(2)}) scale(${a.toFixed(5)})`} pointer-events="none">${r}</g>
      ${t.walls===void 0?Tr(t.floor,this.hover,this.selection,t.toScreen):v}
      <g class="hme-labels" pointer-events="none">${this.labels(t)}</g>
      <g class="hme-overlay">${this.page.overlay(t)}</g>
      ${this.toggles.measure?this.measureMarks(t):v}`}planArt(t,o,n,i){let r=this.toggles.live?this.hass?.states:void 0,a=this.artScale||this.view.scale,d=`${ms(t)}|${Sn(r)}|${a}|${o}|${n}|${this.iconsTick}|${Sn(this.icons)}|${i}`;return d!==this.artKey&&(this.artKey=d,this.artHeld=Je({floor:t,states:r,look:"plan",names:!1,devices:i,furniture:!0,furnitureLook:Vi,glow:!0,width:o,height:n,icons:this.icons,frame:{scale:a,ox:0,oy:0}})),this.artHeld}background(t,o,n){let i=this.walls!==void 0?He:xe,r=20;if(this.toggles.grid)for(r=i*t.scale;r<8;)r*=10;let a=(t.ox%r+r)%r,d=(t.oy%r+r)%r;return k`<defs><pattern id="hme-bg" width=${r} height=${r} patternUnits="userSpaceOnUse" patternTransform=${`translate(${a.toFixed(1)} ${d.toFixed(1)})`}>
        ${this.toggles.grid?k`<path d=${`M${r} 0V${r}H0`} fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1" />`:k`<circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.09)" />`}
      </pattern></defs>
      <rect class="hme-bg" width=${o} height=${n} fill="url(#hme-bg)" />`}labels(t){return t.floor.rooms.map(o=>{let n=U(o),i=Te(o.outline);if(n===void 0||i===void 0)return v;let r=T(o),a=oo(o),d=(i.maxX-i.minX)*t.view.scale,l=(i.maxY-i.minY)*t.view.scale,p=r.length*7.4+22;if(p>d*.95||l<26)return v;let h=Math.max(p,a.length*5.8+22)<=d*.95&&l>=48,u=h?Math.max(p,a.length*5.8+22):p,f=h?36:22,[g,c]=t.toScreen(n);return k`<g class="hme-label"><rect x=${(g-u/2).toFixed(1)} y=${(c-f/2).toFixed(1)} width=${u.toFixed(1)} height=${f} rx=${h?9:7} fill="rgba(0,0,0,0.6)" />
        <text x=${g.toFixed(1)} y=${(c+(h?-3:4.5)).toFixed(1)} fill="#fff" font-size=${h?13:12} font-weight="600" text-anchor="middle">${r}</text>
        ${h?k`<text x=${g.toFixed(1)} y=${(c+11).toFixed(1)} fill="#aeaeb2" font-size="10" text-anchor="middle">${a}</text>`:v}</g>`})}measureMarks(t){let o=this.measure;if(o.a===void 0)return k`<g class="hme-measure"></g>`;let n=o.b??o.hover,i=t.toScreen(o.a);if(n===void 0)return k`<g class="hme-measure" pointer-events="none"><circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" /></g>`;let r=t.toScreen(n),a=Math.hypot(n[0]-o.a[0],n[1]-o.a[1]),d=[(i[0]+r[0])/2,(i[1]+r[1])/2];return k`<g class="hme-measure" pointer-events="none">
      <line x1=${i[0]} y1=${i[1]} x2=${r[0]} y2=${r[1]} stroke="#ff9f0a" stroke-width="2" stroke-dasharray=${o.b===void 0?"6 4":"none"} />
      <circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" /><circle cx=${r[0]} cy=${r[1]} r="5" fill="#ff9f0a" />
      <g class="hme-tag"><rect x=${(d[0]-32).toFixed(1)} y=${(d[1]-22).toFixed(1)} width="64" height="20" rx="10" fill="#ff9f0a" />
      <text x=${d[0].toFixed(1)} y=${(d[1]-8).toFixed(1)} fill="#2a1a00" text-anchor="middle">${a.toFixed(2)} m</text></g></g>`}renderModel(t,o,n){if(o<=0)return v;let i=this.selection,r=ce(i),a=r===void 0?void 0:t.floor.rooms.find(p=>M(p.id,r)),d=ue(i).flatMap(p=>t.floor.rooms.find(h=>M(h.id,p.roomId))?.objects[p.object]??[]),l=d.length>0?{boxes:d}:a!==void 0?{outline:a.outline}:void 0;return Je({mark:l,floor:t.floor,states:this.toggles.live?this.hass?.states:void 0,look:this.modelLookNow(),turn:this.modelTurnNow(),names:!0,devices:"lights",furniture:!0,glow:!0,width:o,height:n})}render3d(t){let o=this.failed3d?"The 3D view needs WebGL, which this browser has turned off.":this.scene3d===void 0?"Loading the 3D view\u2026":void 0;return m`<div class="hme-3d-host" role="img" aria-label=${`3D model of ${z(t.floor)}. Drag to turn it, scroll to zoom, click a thing to pick it.`}></div>
      ${o===void 0?v:m`<div class="hme-3d-note">${o}</div>`}`}renderModelDock(t,o){let n=this.model3d&&this.bundleUrl!==void 0,i=n?void 0:this.modelLookNow(),r=d=>d?"true":"false",a=ct.map(d=>({label:ra[d]??d,on:d===i,pick:()=>{this.modelLook=d,this.model3d=!1,this.dockMenu=void 0}}));return this.bundleUrl!==void 0&&a.push({label:"3D",on:n,title:"The floor in real 3D, with its furniture and each light lit as it is now",pick:()=>{this.model3d=!0,this.dockMenu=void 0}}),m`<div class="hme-dock">
      ${n?m`<button type="button" class="hme-tb ${this.daylight?"":"on"}" aria-pressed=${r(!this.daylight)} title="Night: only the lights that are on light the rooms"
          @click=${()=>{this.daylight=!1}}>Lights</button>
        <button type="button" class="hme-tb ${this.daylight?"on":""}" aria-pressed=${r(this.daylight)} title="Day: the sun comes in through the windows"
          @click=${()=>{this.daylight=!0}}>Daylight</button>
        <span class="hme-vsep"></span>`:v}
      ${this.dockMenuButton("look",`Look: ${n?"3D":ra[i??"night"]??i}`,"How the model is drawn: the tiles' looks, or real 3D")}
      <button type="button" class="hme-tb" title=${n?"Show the whole floor from the home style's turn":"Back to the home style's turn"} @click=${()=>this.turnBack()}>⟲ Turn back</button>
      ${t&&o!==void 0?m`<span class="hme-vsep"></span>${o}`:v}
    </div>${this.dockMenuList("look","Look",a,"menuitemradio")}`}renderDock(t){let o="Draw what Home Assistant's devices are doing now",n=()=>this.setToggle("live",!this.toggles.live);if(this.viewKind==="model")return this.renderModelDock(!0,m`<button type="button" class="hme-tb ${this.toggles.live?"on":""}" aria-pressed=${this.toggles.live?"true":"false"}
        title=${o} @click=${n}><span class="hme-live-dot"></span>Live states</button>`);let i=this.stageSize.width>0?rn(this.baseFloor(),this.stageSize.width,this.stageSize.height):void 0,r=this.view===void 0||i===void 0?100:pr(this.view,i),a=[...(this.page.viewItems?.(t)??[]).map(d=>({label:d.label,on:d.on,title:d.title,pick:()=>d.flip()})),{label:"Live states",on:this.toggles.live,title:o,pick:n}];return m`<div class="hme-dock">
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom out" @click=${()=>this.zoomBy(1/ut)}>−</button>
      <span class="hme-zoom mono">${r}%</span>
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom in" @click=${()=>this.zoomBy(ut)}>＋</button>
      <button type="button" class="hme-tb" @click=${()=>this.fit()}>Fit</button>
      <span class="hme-vsep"></span>
      ${this.page.dock?.(t)??v}
      ${this.dockMenuButton("view","View","What the plan shows: the grid, names, live states and more")}
    </div>${this.dockMenuList("view","View",a,"menuitemcheckbox")}`}dockMenuButton(t,o,n){let i=this.dockMenu===t;return m`<button type="button" class="hme-tb ${i?"on":""}" aria-haspopup="menu" aria-expanded=${i?"true":"false"} title=${n}
      @click=${()=>{this.dockMenu=i?void 0:t}}>${o} <span class="hme-caret" aria-hidden="true">▾</span></button>`}dockMenuList(t,o,n,i){return this.dockMenu!==t?v:m`<div class="hme-dock-pop" role="menu" aria-label=${o}>
      ${n.map(r=>m`<button type="button" role=${i} aria-checked=${r.on?"true":"false"} class="hme-dock-item ${r.on?"on":""}"
        title=${r.title??r.label} @click=${()=>r.pick()}><span class="hme-check" aria-hidden="true">${r.on?"\u2713":""}</span>${r.label}</button>`)}
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
    </div>`}static{this.styles=[Wn,Dn,ta,qr]}};R([se({attribute:!1})],C.prototype,"hass",2),R([se({type:Boolean,reflect:!0})],C.prototype,"narrow",2),R([se({attribute:!1})],C.prototype,"icons",2),R([se({attribute:!1})],C.prototype,"iconsTick",2),R([se({attribute:!1})],C.prototype,"capable",2),R([se({attribute:!1})],C.prototype,"bundleUrl",2),R([se({attribute:!1})],C.prototype,"onHome",2),R([se({attribute:!1})],C.prototype,"onOpenPage",2),R([L()],C.prototype,"unsupported",2),R([L()],C.prototype,"loading",2),R([L()],C.prototype,"loadError",2),R([L()],C.prototype,"floorId",2),R([L()],C.prototype,"selection",2),R([L()],C.prototype,"walls",2),R([L()],C.prototype,"styleOpen",2),R([L()],C.prototype,"viewKind",2),R([L()],C.prototype,"view",2),R([L()],C.prototype,"artScale",2),R([L()],C.prototype,"stageSize",2),R([L()],C.prototype,"toggles",2),R([L()],C.prototype,"scans",2),R([L()],C.prototype,"measure",2),R([L()],C.prototype,"floorMenu",2),R([L()],C.prototype,"dockMenu",2),R([L()],C.prototype,"dialog",2),R([L()],C.prototype,"modelLook",2),R([L()],C.prototype,"model3d",2),R([L()],C.prototype,"daylight",2),R([L()],C.prototype,"modelTurn",2),R([L()],C.prototype,"pages",2),R([L()],C.prototype,"spaceHeld",2),R([L()],C.prototype,"tick",2),R([L()],C.prototype,"hover",2),R([L()],C.prototype,"addOpen",2);var aa=new WeakMap,hs=1;function Sn(s){if(s===void 0)return 0;let e=aa.get(s);return e===void 0&&aa.set(s,e=hs++),e}var ms=s=>Sn(s);customElements.get("wa-home-map-editor")||customElements.define("wa-home-map-editor",C);export{ds as HOME_MAP_DRAG_SLOP,ss as HOME_MAP_EMPTY_TEXT,as as HOME_MAP_UPDATE_TEXT,C as WaHomeMapEditor,ps as homeMapSaveWords};
