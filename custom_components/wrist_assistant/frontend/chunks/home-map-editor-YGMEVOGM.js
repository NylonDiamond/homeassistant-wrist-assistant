import{a as ti}from"./chunk-3PEHJC6R.js";import{a as ni,b as oi,c as St,d as wn,e as Ct,f as ii}from"./chunk-PSPFB2LN.js";import"./chunk-O33VZRJD.js";import{$ as mn,A as Pe,Aa as Rt,B as dn,Ba as ye,C as $t,Ca as Ve,D as Do,Da as Xe,E as Oo,Ea as qe,F as Ao,Fa as ai,G as We,Ga as Ye,H as Ee,Ha as yn,I as Mt,Ia as pe,J as _o,Ja as ri,K as Be,Ka as si,L as we,La as di,M as ln,Ma as Re,N as Fo,O as Lo,P as Te,Q as Se,R as zo,S as No,T as pn,U as se,V as kt,W as xt,X as jo,Y as hn,Z as Ko,_ as Ht,a as Le,aa as Ge,b as K,ba as Pt,c as He,ca as Wo,d as be,da as Bo,e as bo,ea as un,f as wo,fa as cn,g as yo,ga as Go,h as $o,ha as Uo,i as ze,ia as fn,j as Ne,ja as de,k as Mo,ka as Ce,l as je,la as Vo,m as ko,ma as Xo,n as xo,na as gn,o as yt,oa as Ue,p as Ho,pa as Et,q as rn,qa as vn,r as Po,ra as qo,s as Eo,sa as Yo,t as To,ta as Zo,u as So,ua as Jo,v as sn,va as le,w as Ke,wa as bn,x as Co,xa as Tt,y as Ro,ya as Qo,z as Io,za as ei}from"./chunk-N73BCIP6.js";import"./chunk-7T6IEW6M.js";import{A as on,D as wt,F as fo,H as go,I as ve,N as vo,Q as an,a as re,e as Qt,m as en,n as ge,o as Fe,p as q,q as U,r as tn,s as nn,t as uo,v as bt,w as co}from"./chunk-UBDEQT54.js";import{c as ct,j as ao,k as ro,na as ho,oa as mo}from"./chunk-5H6OWAXC.js";import"./chunk-J2WKPEGJ.js";import{b as Jt}from"./chunk-S3NOJWAC.js";import{j as oo,p as Yt,q as N}from"./chunk-JTGB6FQQ.js";import{i as ft,l as so,m as lo,n as gt,r as vt,s as Zt,t as po}from"./chunk-CPEKF3CW.js";import{B as L,C,D as ht,E as ee,F as Y,H as Qn,J as te,K as eo,L as mt,M as ut,S as to,T as no,U as B,b as qn,d as Yn,e as Zn,h as Ae,i as Jn,u as _e,v as pt,x as qt,y as k}from"./chunk-JOVM4SJB.js";import{$g as lt,Fh as xe,Nh as io,ah as Vn,b as Gn,d as m,e as $,g as v,hg as Xt,j as Un,k as Q,l as A,wh as Xn}from"./chunk-7M7K7CM3.js";import{db as ke}from"./chunk-OM34V22N.js";import{a as S}from"./chunk-LO2NM3CE.js";var It="application/x-wa-home-map-entity",ia=new Set(["light","switch","fan","climate","humidifier","water_heater","sensor","binary_sensor","media_player","lock","cover","valve","camera","vacuum","alarm_control_panel","siren","input_boolean","remote"]);function aa(s,e){let t=s?.entities?.[e];if(t===void 0)return;if(typeof t.area_id=="string"&&t.area_id!=="")return t.area_id;let n=t.device_id?s?.devices?.[t.device_id]:void 0;return typeof n?.area_id=="string"&&n.area_id!==""?n.area_id:void 0}function li(s){let e=[];for(let[t,n]of Object.entries(s?.states??{})){let o=s?.entities?.[t];if(o?.hidden===!0)continue;let i=n?.attributes?.friendly_name,a=aa(s,t),r=a===void 0?void 0:s?.areas?.[a]?.name?.trim()||a,d=n?.attributes?.device_class;e.push({entityId:t,name:typeof i=="string"&&i.trim()!==""?i.trim():t,domain:t.slice(0,t.indexOf(".")),areaId:a,areaName:r,deviceClass:typeof d=="string"?d:void 0,category:typeof o?.entity_category=="string"?o.entity_category:void 0})}return e.sort((t,n)=>t.name.localeCompare(n.name)||t.entityId.localeCompare(n.entityId))}function ra(s){return new Set(s.floors.flatMap(e=>e.pins.map(t=>t.entityId)))}function pi(s,e,t){let n=ra(s),o=new Map;for(let a of t){if(n.has(a.entityId)||a.areaId===void 0||a.category!==void 0||!ia.has(a.domain))continue;let r=o.get(a.areaId);r===void 0&&o.set(a.areaId,r={areaId:a.areaId,name:a.areaName??a.areaId,here:!1,devices:[]}),r.devices.push(a)}let i=e.rooms.map(a=>a.areaId).filter(a=>a!==void 0);for(let a of o.values())a.here=i.includes(a.areaId);return[...o.values()].sort((a,r)=>{let d=i.indexOf(a.areaId),l=i.indexOf(r.areaId);return d>=0||l>=0?(d<0?1/0:d)-(l<0?1/0:l):a.name.localeCompare(r.name)})}function hi(s,e){let t=new Set(s.rooms.map(n=>n.areaId).filter(n=>n!==void 0));return e.filter(n=>t.has(n.areaId)).reduce((n,o)=>n+o.devices.length,0)}function mi(s,e,t=40){let n=e.toLowerCase().split(/\s+/).filter(r=>r!=="");if(n.length===0)return[];let o=r=>`${r.name} ${r.entityId} ${r.areaName??""}`.toLowerCase(),i=s.filter(r=>n.every(d=>o(r).includes(d))),a=e.trim().toLowerCase();return i.sort((r,d)=>+!r.name.toLowerCase().startsWith(a)-+!d.name.toLowerCase().startsWith(a)).slice(0,t)}var sa=[["lights","Lights"],["climate","Climate"],["sensors","Sensors"],["power","Power"],["media","Media"],["security","Security"],["covers","Covers"],["other","Other"]];function $n(s){switch(s.slice(0,s.indexOf("."))){case"light":return"lights";case"climate":case"fan":case"humidifier":case"water_heater":return"climate";case"sensor":case"binary_sensor":return"sensors";case"switch":case"input_boolean":return"power";case"media_player":case"remote":return"media";case"lock":case"camera":case"alarm_control_panel":case"siren":return"security";case"cover":case"valve":return"covers";default:return"other"}}function ui(s){let e=new Map;for(let t of s.pins){let n=$n(t.entityId);e.set(n,(e.get(n)??0)+1)}return sa.filter(([t])=>e.has(t)).map(([t,n])=>({kind:t,label:n,count:e.get(t)}))}function ci(s){return s.replace(/_/g," ")}function he(s,e){let t=e?.[s];if(t===void 0)return"gone";let n=String(t.state??""),o=s.slice(0,s.indexOf(".")),i=t.attributes??{};if(o==="light"&&n==="on"&&typeof i.brightness=="number")return`on \xB7 ${Math.round(i.brightness/255*100)}%`;if(o==="climate"&&typeof i.current_temperature=="number")return`${n} \xB7 ${i.current_temperature}\xB0`;let a=typeof i.unit_of_measurement=="string"?i.unit_of_measurement:"";return a!==""&&n!==""&&Number.isFinite(Number(n))?`${n} ${a}`.replace(" \xB0","\xB0").replace(" %","%"):n.replace(/_/g," ")}function Mn(s){return["light","switch","fan","input_boolean","media_player","cover","humidifier","siren"].includes(s.slice(0,s.indexOf(".")))}function kn(s,e){let t=String(e?.[s]?.state??"");return s.startsWith("cover.")?t==="open"||t==="opening"?"Close":"Open":t==="on"||t==="playing"||t==="paused"||t==="idle"?"Turn off":"Turn on"}var xn=[["Floor",.3],["Table",.8],["Wall",1.6],["Ceiling",2.5]],Hn=[[void 0,"As the tile does"],["toggle","Turn on or off"],["details","Show details"],["page","Open a page"],["none","Nothing"]];function Pn(s,e){for(let t of s.floors){let n=t.pins.find(o=>o.entityId===e);if(n!==void 0)return{floorId:t.id,pinId:n.id}}}function fi(s,e){return e===void 0?void 0:s.rooms.find(t=>t.areaId!==void 0&&t.areaId===e)}function ne(s){return s?.kind==="pin"?[s.pinId]:s?.kind==="pins"?s.pinIds.slice():[]}function Ze(s){let e=[];for(let t of s)e.some(n=>k(n,t))||e.push(t);if(e.length!==0)return e.length===1?{kind:"pin",pinId:e[0]}:{kind:"pins",pinIds:e}}function Je(s,e){let t=ne(s);return t.some(n=>k(n,e))?Ze(t.filter(n=>!k(n,e))):Ze([...t,e])}function gi(s,e){return Ze([...ne(s),...e])}function vi(s,e,t){let[n,o]=[Math.min(e[0],t[0]),Math.max(e[0],t[0])],[i,a]=[Math.min(e[1],t[1]),Math.max(e[1],t[1])];return s.filter(r=>r.at[0]>=n&&r.at[0]<=o&&r.at[1]>=i&&r.at[1]<=a).map(r=>r.id)}function $e(s){if(s.length===0)return{mixed:!0};let e=JSON.stringify(s[0])??"undefined";return s.every(t=>(JSON.stringify(t)??"undefined")===e)?{mixed:!1,value:s[0]}:{mixed:!0}}function bi(s,e){if(s.length===0||!s.every(Mn))return;let t=s.every(o=>o.startsWith("cover.")),n=s.some(o=>{let i=kn(o,e);return i==="Turn off"||i==="Close"});return t?n?{words:"Close",service:"turn_off"}:{words:"Open",service:"turn_on"}:n?{words:"Turn off",service:"turn_off"}:{words:"Turn on",service:"turn_on"}}var wi=4,yi=2400;function $i(s,e){return[s.ox+e[0]*s.scale,s.oy+e[1]*s.scale]}function Ie(s,e){return[(e[0]-s.ox)/s.scale,(e[1]-s.oy)/s.scale]}function En(s,e,t,n=72,o=96){let a=s===void 0||s.rooms.length===0&&s.pins.length===0?{minX:-5,minY:-5,maxX:5,maxY:5}:ht(s),r=Math.max(a.maxX-a.minX,1),d=Math.max(a.maxY-a.minY,1),l=Ei(Math.min(Math.max(e-n*2,40)/r,Math.max(t-o*2,40)/d),wi,yi);return{scale:l,ox:e/2-(a.minX+a.maxX)/2*l,oy:t/2-(a.minY+a.maxY)/2*l}}function Tn(s,e,t){let n=Ei(s.scale*e,wi,yi),o=n/s.scale;return{scale:n,ox:t[0]-(t[0]-s.ox)*o,oy:t[1]-(t[1]-s.oy)*o}}function Mi(s,e){return Math.round(s.scale/e.scale*100)}var Qe=1.25;function ki(s){if(typeof s!="object"||s===null)return;let e=s;return{tag:typeof e.tagName=="string"?e.tagName.toUpperCase():"",type:typeof e.type=="string"?e.type.toLowerCase():"text",editable:e.isContentEditable===!0}}var xi=["button","submit","reset","image"],da=["checkbox","radio","range","color","file"];function Sn(s){let e=ki(s);return e===void 0?!1:e.editable||e.tag==="TEXTAREA"?!0:e.tag==="INPUT"&&!xi.includes(e.type)&&!da.includes(e.type)}function Hi(s){let e=ki(s);return e===void 0?!1:Sn(s)||e.tag==="SELECT"?!0:e.tag==="INPUT"&&!xi.includes(e.type)}function Z(s,e){if(e)return;let t=s.metaKey===!0||s.ctrlKey===!0,n=s.key.length===1?s.key.toLowerCase():s.key;if(t)return n==="z"?s.shiftKey===!0?"redo":"undo":n==="y"?"redo":void 0;if(s.altKey===!0)return;switch(n){case"Escape":return"cancel";case"Delete":case"Backspace":return"delete";case"Enter":return"enter";case"+":case"=":return"zoomIn";case"-":return"zoomOut";case"0":return"fit"}let o=s.shiftKey===!0?.1:.01;if(n==="ArrowLeft")return{nudge:[-o,0]};if(n==="ArrowRight")return{nudge:[o,0]};if(n==="ArrowUp")return{nudge:[0,-o]};if(n==="ArrowDown")return{nudge:[0,o]};if(/^[a-z]$/.test(n)&&s.shiftKey!==!0)return{letter:n}}function Cn(){let s=globalThis.navigator,e=`${typeof s?.platform=="string"?s.platform:""} ${typeof s?.userAgent=="string"?s.userAgent:""}`;return/Mac|iPhone|iPad/.test(e)}function Pi(){return Cn()?"\u2318Z":"Ctrl+Z"}var Ei=(s,e,t)=>Math.min(Math.max(s,e),t);function et(s,e=2){return`${(Math.round(s*10**e)/10**e).toFixed(e)} m`}function tt(s,e=2){let t=(Math.round(s*10**e)/10**e).toFixed(e);return/^-0(\.0*)?$/.test(t)?t.slice(1):t}function Rn(s){let e=s.trim().replace(",",".").replace(/\s*(m|cm|°|deg)$/i,"");if(e===""||!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(e))return;let t=Number(e);if(Number.isFinite(t))return/cm$/i.test(s.trim())?t/100:t}function Dt(s){if(s.outline.length<3)return{width:0,depth:0,area:0};let{a0:e,a1:t,c0:n,c1:o}=on(s,en(s));return{width:t-e,depth:o-n,area:Math.abs(wt(s.outline))}}function De(s){let{width:e,depth:t}=Dt(s);return`${e.toFixed(1)} \xD7 ${t.toFixed(1)} m`}function Ti(s){if(s.outline.length<3)return s.outline.slice();let{a0:e,a1:t,c0:n,c1:o,point:i}=on(s,en(s));return[i(e,n),i(t,n),i(t,o),i(e,o)]}function Si(s,e){let t=K(s)[e];if(t===void 0)return"inner";let n=Math.max(Math.hypot(t.b[0]-t.a[0],t.b[1]-t.a[1]),1e-9),o=-(t.b[1]-t.a[1])/n,i=(t.b[0]-t.a[0])/n,a=[(t.a[0]+t.b[0])/2,(t.a[1]+t.b[1])/2],r=Math.max(t.t,.1)+.1,d=Fe(s.outline,[a[0]+o*r,a[1]+i*r]),l=Fe(s.outline,[a[0]-o*r,a[1]-i*r]);if(d&&l)return"inner";if(d)o=-o,i=-i;else if(!l){let h=q(s);h!==void 0&&(h[0]-a[0])*o+(h[1]-a[1])*i>0&&(o=-o,i=-i)}return Math.abs(o)>Math.abs(i)?o>0?"right":"left":i>0?"bottom":"top"}function In(s,e,t){let n=Si(s,e);return`${t}, ${n} wall`}function Ci(s){let e=K(s).map((n,o)=>Si(s,o)),t=new Map;return e.map((n,o)=>{let i=(t.get(n)??0)+1;t.set(n,i);let a=`${n.charAt(0).toUpperCase()}${n.slice(1)} wall`;return i===1&&e.indexOf(n,o+1)<0?a:`${a} ${i}`})}function me(s){return s.kind==="opening"?"Way through":s.kind==="window"?s.style==="sliding"?"Sliding window":"Window":s.style==="double"?"Double door":s.style==="sliding"?"Sliding door":"Door"}var la={sofa:"Sofa",table:"Table",chair:"Chair",bed:"Bed",storage:"Storage",television:"TV",bathtub:"Bath",sink:"Basin",toilet:"Toilet",stove:"Hob",oven:"Oven",refrigerator:"Fridge",dishwasher:"Dishwasher",washerDryer:"Washer dryer",fireplace:"Fireplace",stairs:"Stairs"};function nt(s){let e=la[s];if(e!==void 0)return e;let t=s.replace(/([a-z0-9])([A-Z])/g,"$1 $2").toLowerCase();return t.charAt(0).toUpperCase()+t.slice(1)}function R(s,e,t=`${e}s`){return`${s} ${s===1?e:t}`}function H(s,e,t,n=""){return m`<section class="hme-card ${n}">
    <div class="hme-h">${s}${t===void 0?v:m`<span class="hme-h-end">${t}</span>`}</div>
    ${e}
  </section>`}function O(s,...e){return m`<div class="hme-r"><span class="hme-l">${s}</span>${e}</div>`}function G(s){return m`<p class="hme-hint">${s}</p>`}var Ri=3;function pa(s,e){return s==="\xB0"?1:10**-e}function I(s){let e=s.digits??2,t=s.step??pa(s.unit,e),n=s.value===void 0?"":tt(s.value,e),o=d=>Math.min(Math.max(d,s.min??-1/0),s.max??1/0),i=d=>tt(d,e)===n,a=d=>{let l=Rn(d.value);if(l===void 0||s.min!==void 0&&l<s.min||s.max!==void 0&&l>s.max||i(l)){d.value=n;return}s.set(l)},r=d=>{let l=d.currentTarget,h=l.querySelector("input");if(h===null||s.disabled===!0||d.button!==0||h.matches(":focus"))return;d.preventDefault();let p=s.value,u=d.clientX,f=!1,c=p;try{l.setPointerCapture(d.pointerId)}catch{}let g=b=>{if(p===void 0)return;let y=b.clientX-u;if(!f&&Math.abs(y)<Ri)return;f||l.classList.add("scrubbing"),f=!0;let P=b.shiftKey?10:b.altKey?.1:1;c=o(Number((p+(y-Math.sign(y)*Ri)*t*P).toFixed(e+(b.altKey?1:0)))),h.value=tt(c,e),s.preview?.(c)},w=b=>{if(l.removeEventListener("pointermove",g),l.removeEventListener("pointerup",w),l.removeEventListener("pointercancel",w),l.classList.remove("scrubbing"),!f){h.focus(),h.select();return}s.preview?.(void 0),b.type!=="pointercancel"&&c!==void 0&&!i(c)?s.set(c):h.value=n};l.addEventListener("pointermove",g),l.addEventListener("pointerup",w),l.addEventListener("pointercancel",w)};return m`<span class="hme-in hme-num ${s.disabled===!0?"off":""}" style=${s.width===void 0?v:`flex:0 0 ${s.width}`}
    title=${s.disabled===!0?v:"Drag sideways to change it, click to type"} @pointerdown=${r}>
    ${s.tag===void 0?v:m`<span class="hme-ntag" aria-hidden="true">${s.tag}</span>`}
    <input type="text" inputmode="decimal" aria-label=${s.label} .value=${N(n)} ?disabled=${s.disabled===!0}
      placeholder=${s.value===void 0?"Mixed":""}
      @change=${d=>a(d.target)}
      @keydown=${d=>{let l=d.target;if(d.key==="Enter"&&l.blur(),d.key==="Escape"&&(l.value=n,l.blur()),(d.key==="ArrowUp"||d.key==="ArrowDown")&&s.value!==void 0){d.preventDefault();let h=Rn(l.value)??s.value,p=o(Number((h+(d.key==="ArrowUp"?1:-1)*t*(d.shiftKey?10:1)).toFixed(e)));l.value=tt(p,e),i(p)||s.set(p)}}} />${s.unit===void 0?v:m`<span class="hme-unit">${s.unit}</span>`}</span>`}function ot(...s){return m`<div class="hme-fields" style=${`--n:${s.length}`}>${s}</div>`}function it(s,...e){return m`<div class="hme-group"><div class="hme-gl">${s}</div>${e}</div>`}function at(s){return m`<span class="hme-in"><input type="text" aria-label=${s.label} maxlength=${s.max??100} placeholder=${s.placeholder??""}
    .value=${N(s.value)}
    @change=${e=>{let t=e.target.value;t.trim()!==s.value.trim()&&s.set(t)}}
    @keydown=${e=>{e.key==="Enter"&&e.target.blur()}} /></span>`}function Me(s){return m`<span class="hme-in hme-sel ${s.cls??""}"><select aria-label=${s.label} @change=${e=>s.set(e.target.value)}>
    ${s.options.map(e=>m`<option value=${e.value} ?disabled=${e.disabled===!0} .selected=${N(e.value===s.value)}>${e.label}</option>`)}
  </select></span>`}function Dn(s){return m`<span class="hme-menu ${s.cls??""}"><select aria-label=${s.label} @change=${e=>{let t=e.target,n=t.value;t.value="",n!==""&&s.pick(n)}}>
    <option value="" .selected=${N(!0)}>${s.label}</option>
    ${s.options.map(e=>m`<option value=${e.value} ?disabled=${e.disabled===!0}>${e.label}</option>`)}
  </select><span class="hme-menu-caret" aria-hidden="true">▾</span></span>`}function V(s){return m`<button type="button" class="hme-pic ${s.on?"on":""}" aria-pressed=${s.on?"true":"false"} title=${s.title??s.label}
    @click=${s.click}>${s.picture}<span>${s.label}</span></button>`}function rt(s){return m`<button type="button" class="hme-chip ${s.on?"":"off"}" aria-pressed=${s.on?"true":"false"} aria-label=${s.label}
    @click=${s.click}>${s.on?s.onText:s.offText}</button>`}var ha={wood:"repeating-linear-gradient(0deg,#b38a61 0 9px,#8e6845 9px 10px)",tile:"linear-gradient(#a9a7a1 1px,transparent 1px) 0 0/10px 10px, linear-gradient(90deg,#a9a7a1 1px,transparent 1px) 0 0/10px 10px, #cbc9c2",stone:"#bcc1c6 linear-gradient(#9da2a6 1px,transparent 1px) 0 0/18px 12px",carpet:"#99928a",plain:"#a8a6a1"},On={wood:"#a17a55",tile:"#bdbbb4",stone:"#b0b5ba",carpet:"#8f8880",plain:"#9c9a95"};function An(s){return m`<span class="hme-sw" style=${`background:${ha[s]}`}></span>`}var Ii=s=>s.map(([e,t])=>`${Math.round(e*10)/10},${Math.round(t*10)/10}`).join(" ");function _n(s,e=34,t=24){let n=s?.rooms??[];if(n.length===0)return m`<svg class="hme-thumb" width=${e} height=${t} viewBox=${`0 0 ${e} ${t}`} aria-hidden="true">
      <rect x="1" y="1" width=${e-2} height=${t-2} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" stroke-dasharray="3 2" /></svg>`;let o=ht(s),i=4,a=Math.min((e-i*2)/Math.max(o.maxX-o.minX,.5),(t-i*2)/Math.max(o.maxY-o.minY,.5)),r=e/2-(o.minX+o.maxX)/2*a,d=t/2-(o.minY+o.maxY)/2*a;return m`<svg class="hme-thumb" width=${e} height=${t} viewBox=${`0 0 ${e} ${t}`} aria-hidden="true">
    <rect x="0.5" y="0.5" width=${e-1} height=${t-1} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" />
    ${n.map(l=>$`<polygon points=${Ii(l.outline.map(([h,p])=>[r+h*a,d+p*a]))} fill="none" stroke="var(--wa-muted)" stroke-width="1.1" />`)}
  </svg>`}function Di(s,e,t=76,n=54){let o=s.outline.map(g=>g[0]),i=s.outline.map(g=>g[1]),a=Math.min(...o),r=Math.max(...o),d=Math.min(...i),l=Math.max(...i),h=8,p=Math.min((t-h*2)/Math.max(r-a,.5),(n-h*2)/Math.max(l-d,.5)),u=t/2-(a+r)/2*p,f=n/2-(d+l)/2*p,c=Ii(s.outline.map(([g,w])=>[u+g*p,f+w*p]));return m`<svg class="hme-room-thumb" width=${t} height=${n} viewBox=${`0 0 ${t} ${n}`} aria-hidden="true">
    <rect width=${t} height=${n} rx="8" fill="#121010" />
    <polygon points=${c} fill=${On[bt(s)]} stroke="#ece6da" stroke-width="2.5" stroke-linejoin="round" />
    ${e?$`<circle cx=${t*.58} cy=${n*.42} r=${Math.min(t,n)*.22} fill="#ffb648" opacity="0.35" />`:v}
  </svg>`}function Fn(s,e,t,n={}){let o=(n.reach??10)/t,i,a=o;for(let l of[...s.rooms.flatMap(h=>h.outline),...n.corners??[]]){let h=Math.hypot(l[0]-e[0],l[1]-e[1]);h<=a&&(i=l,a=h)}if(i!==void 0)return[i[0],i[1]];let[r,d]=e;if(n.grid!==void 0&&n.grid>0&&(r=Math.round(r/n.grid)*n.grid,d=Math.round(d/n.grid)*n.grid),n.from!==void 0){let l=8/t;Math.abs(e[0]-n.from[0])<=l&&(r=n.from[0]),Math.abs(e[1]-n.from[1])<=l&&(d=n.from[1])}return[Math.round(r*100)/100,Math.round(d*100)/100]}var ue=.1,ce=.05,Ot=class{constructor(e){this.grid=e;this.active=!1;this.points=[]}start(e){this.active=!0,this.points=[],this.hoverAt=void 0,e.select(void 0),e.redraw()}stop(e){this.active=!1,this.points=[],this.hoverAt=void 0,e?.redraw()}snap(e,t){return Fn(e.floor,t,e.view.scale,{...this.points.length>0?{from:this.points[this.points.length-1]}:{},...e.toggles.grid?{grid:this.grid}:{},corners:this.points})}closes(e,t){let n=this.points[0];return n!==void 0&&this.points.length>=3&&Math.hypot(t[0]-n[0],t[1]-n[1])*e.view.scale<=10}pointerDown(e,t,n){if(!this.active||t.button!==0)return!1;let o=this.snap(e,n);if(this.closes(e,o))return this.finish(e),!0;let i=this.points[this.points.length-1];return(i===void 0||Math.hypot(o[0]-i[0],o[1]-i[1])>=.05)&&this.points.push(o),e.redraw(),!0}hover(e,t){this.active&&(this.hoverAt=t===void 0?void 0:this.snap(e,t),e.redraw())}keyDown(e,t){return this.active?t.key==="Escape"?(this.stop(e),!0):t.key==="Enter"?(this.points.length>=3&&this.finish(e),!0):t.key==="Backspace"||t.key==="Delete"?(this.points.pop(),e.redraw(),!0):!1:!1}async finish(e){let t=this.points.slice();if(this.stop(e),t.length<3)return;let n=await e.ask({title:"Name the room",label:"Name",value:"Room",ok:"Add room"});if(n===void 0)return;let o=e.newId(),i=e.floor.id;e.apply(a=>Lo(a,i,o,t,n),{select:{kind:"room",roomId:o}})||e.note("err","That room could not be added. Draw at least three corners round some floor.")}overlay(e){if(!this.active)return v;let t=this.points.map(d=>e.toScreen(d)),n=this.hoverAt===void 0?void 0:e.toScreen(this.hoverAt),o=this.hoverAt!==void 0&&this.closes(e,this.hoverAt),i=[...t,...n!==void 0?[n]:[]].map(([d,l])=>`${d.toFixed(1)},${l.toFixed(1)}`).join(" "),a=this.points[this.points.length-1],r=a!==void 0&&this.hoverAt!==void 0?Math.hypot(this.hoverAt[0]-a[0],this.hoverAt[1]-a[1]):0;return $`<g class="hme-draw">
      ${t.length>=3?$`<polygon points=${t.map(([d,l])=>`${d},${l}`).join(" ")} fill="rgba(91,141,239,0.14)" stroke="none" />`:v}
      <polyline points=${i} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />
      ${t.map(([d,l],h)=>$`<circle cx=${d} cy=${l} r=${h===0&&o?8:5} fill=${h===0&&o?"#5b8def":"#fff"} stroke="#5b8def" stroke-width="2" />`)}
      ${n!==void 0&&!o?$`<circle cx=${n[0]} cy=${n[1]} r="4" fill="#5b8def" />`:v}
      ${n!==void 0&&r>.05?$`<g class="hme-tag"><rect x=${n[0]+10} y=${n[1]-26} width="58" height="18" rx="9" fill="#5b8def" />
        <text x=${n[0]+39} y=${n[1]-13} fill="#fff" text-anchor="middle">${r.toFixed(2)} m</text></g>`:v}
    </g>`}hint(){return this.points.length===0?"Click to put down the first corner":this.points.length<3?"Click to add corners":"Click the first corner or press Enter to close the room"}};function st(s){return s===void 0||s.kind==="pin"||s.kind==="pins"?void 0:s.roomId}function Oi(s,e){if(e===void 0)return!0;if(s===void 0)return!1;if(e.kind==="pin")return s.pins.some(n=>k(n.id,e.pinId));if(e.kind==="pins")return e.pinIds.every(n=>s.pins.some(o=>k(o.id,n)));let t=s.rooms.find(n=>k(n.id,e.roomId));if(t===void 0)return!1;switch(e.kind){case"room":return!0;case"wall":return K(t)[e.wall]!==void 0;case"corner":return t.outline[e.corner]!==void 0;case"opening":return t.openings[e.opening]!==void 0;case"object":return t.objects[e.object]!==void 0}}var Ln;function At(){return Ln??=import("./scene3d-5J6KCAHB.js").catch(s=>{throw Ln=void 0,s}),Ln}function zn(s){return new URL("furniture/",s).href}var Ai={wood:"Wood",tile:"Tile",stone:"Stone",carpet:"Carpet",plain:"Plain"},_t=15,ma=[{a:0,c:0},{c:0},{a:1,c:0},{a:1},{a:1,c:1},{c:1},{a:0,c:1},{a:0}];function ua(s,e){let t=(Math.atan2(e,s)*180/Math.PI+180)%180;return["ew-resize","nwse-resize","ns-resize","nesw-resize"][Math.round(t/45)%4]}function ca(s,e){let t=e===0?"":` Its ${R(e,"device")} come${e===1?"s":""} off the map too.`;return`${C(s)} comes off the map.${t} A scanned room comes back only by scanning it again on the iPhone. Undo brings it back while this page is open.`}function ie(s){return wn(s.model)?.name??nt(s.kind)}function fa(s){return vo(Ct(s))}function _i(s){let e=st(s.selection),t=e===void 0?void 0:s.floor.rooms.find(a=>k(a.id,e));if(t!==void 0)return t;let n=Ie(s.view,[s.stage.width/2,s.stage.height/2]),o=U(s.floor,n);if(o!==void 0)return o;let i;for(let a of s.floor.rooms){let r=ee(a),d=Math.hypot(r[0]-n[0],r[1]-n[1]);(i===void 0||d<i.d)&&(i={room:a,d})}return i?.room}function ga(s,e,t){let n=ii(s,t).filter(a=>e===""||a.group===e);if(s.trim()!==""||e!=="")return[{title:e===""?"Found":e,pieces:n}];let o=[],i=t===void 0?[]:n.filter(a=>a.kind===t);i.length>0&&o.push({title:`${nt(t)} pieces`,pieces:i});for(let a of St.groups){let r=n.filter(d=>d.group===a&&!i.includes(d));r.length>0&&o.push({title:a,pieces:r})}return o}function va(s){return Math.round(fo(s.turn)*10)/10}var z=s=>s.toFixed(1),oe=s=>`${s[0].toFixed(1)},${s[1].toFixed(1)}`,Ft=class{constructor(){this.draw=new Ot(ue);this.guides=[];this.dragging=!1;this.resizing=!1;this.pickerQuery="";this.pickerGroup="";this.pickerFocus=!1;this.thumbs=new Map;this.askedThumbs=new Set;this.thumbFrame=0}openPicker(e,t,n){this.picker=n===void 0?{roomId:t.id}:{roomId:t.id,index:n},this.pickerQuery="",this.pickerGroup="",this.pickerFocus=!0,e.redraw()}closePicker(e){this.picker=void 0,e.redraw()}get pickerOpen(){return this.picker!==void 0}thumb(e,t){let n=this.thumbs.get(t),o=e.furnitureBase;if(n!==void 0||o===void 0||this.askedThumbs.has(t))return n;this.askedThumbs.add(t),At().then(i=>i.homeMapPieceThumb(o,t)).then(i=>{if(i===void 0||(this.thumbs.set(t,i),this.thumbFrame!==0))return;let a=typeof requestAnimationFrame=="function"?requestAnimationFrame:r=>setTimeout(r,16);this.thumbFrame=a(()=>{this.thumbFrame=0,e.redraw()})},()=>{})}piecePic(e,t,n){let o=t===void 0?void 0:this.thumb(e,t.id);return m`<span class="${n} ${o===void 0?"wait":""}">${o===void 0?v:m`<img src=${o} alt="" draggable="false" />`}</span>`}pickPiece(e,t){let n=this.picker,o=n===void 0?void 0:e.floor.rooms.find(d=>k(d.id,n.roomId));if(this.picker=void 0,n===void 0||o===void 0){e.redraw();return}let i=o.id;if(n.index!==void 0){let d=n.index;e.apply(l=>Oo(l,i,d,t),{select:{kind:"object",roomId:i,object:d}})||e.redraw();return}let a=q(o)??ee(o),r=o.objects.length;e.apply(d=>Do(d,i,t,a),{select:{kind:"object",roomId:i,object:r}})||e.redraw()}sheet(e){let t=this.picker;if(t===void 0)return v;let n=e.floor.rooms.find(u=>k(u.id,t.roomId)),o=t.index===void 0?void 0:n?.objects[t.index];if(n===void 0||t.index!==void 0&&o===void 0)return this.picker=void 0,v;let i=o===void 0?void 0:Ct(o),a=ga(this.pickerQuery,this.pickerGroup,o?.kind),r=o===void 0?"Add furniture":"Change model",d=o===void 0?`To ${C(n)}, in its middle. Drag it into place once it is in.`:`${ie(o)} in ${C(n)} keeps its place, size and turn.`,l=u=>St.pieces.filter(f=>u===""||f.group===u).length,h=["",...St.groups],p=this.pickerFocus;return this.pickerFocus=!1,m`<div class="hme-scrim hme-sheet"
      @pointerdown=${u=>{u.target===u.currentTarget&&this.closePicker(e)}}
      @keydown=${u=>{u.stopPropagation(),u.key==="Escape"&&this.closePicker(e)}}>
      <div class="hme-fpick" role="dialog" aria-modal="true" aria-label=${r}>
        <header class="hme-fpick-head">
          <div class="hme-fpick-t"><strong>${r}</strong><span>${d}</span></div>
          <label class="hme-find hme-fpick-find"><span aria-hidden="true">⌕</span>
            <input type="search" placeholder="Find a piece: sofa, lamp, desk" aria-label="Find a piece" .value=${N(this.pickerQuery)}
              ${ti(u=>{p&&u instanceof HTMLInputElement&&setTimeout(()=>u.focus(),0)})}
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
              <div class="hme-fgrid">${u.pieces.map(f=>{let c=i?.id===f.id;return m`<button type="button" class="hme-fcard ${c?"on":""}" aria-pressed=${c?"true":"false"}
                  title=${`${o===void 0?"Add":"Use"} ${f.name}, ${an(f)}`} @click=${()=>this.pickPiece(e,f)}>
                  ${this.piecePic(e,f,"hme-fcard-pic")}
                  <span class="hme-fcard-name">${f.name}</span>
                  <span class="hme-fcard-size mono">${an(f)}</span>
                </button>`})}</div>
            </section>`)}
          </div>
        </div>
      </div>
    </div>`}stopDrag(e){this.guides=[],this.dragging=!1,this.resizing=!1,e.preview(void 0)}focus(e){let t=st(e.selection);return t===void 0?void 0:e.floor.rooms.find(n=>k(n.id,t))}picked(e){let t=e.selection;if(t?.kind!=="object")return;let n=this.focus(e),o=n?.objects[t.object];return n===void 0||o===void 0?void 0:{room:n,index:t.object,object:o}}thingUnder(e,t,n){let o;for(let i of n===void 0?e.floor.rooms:[n])i.objects.forEach((a,r)=>{if(a.hidden===!0)return;let d=nn(tn(a));if(!Fe(d,t))return;let l=Math.abs(wt(d));(o===void 0||l<o.area)&&(o={thing:{room:i,index:r,object:a},area:l})});return o?.thing}pickThing(e,t,n){e.select({kind:"object",roomId:t.id,object:n})}addFurnitureButton(e,t,n){return m`<button type="button" class=${n} ?disabled=${t===void 0}
      title=${t===void 0?"Draw or scan a room first":`Pick a sofa, a bed, a lamp or more from the furniture catalog for ${C(t)}`}
      @click=${()=>{t!==void 0&&this.openPicker(e,t)}}>＋ Add furniture</button>`}overlay(e){if(this.draw.active)return this.draw.overlay(e);let t=this.focus(e),n=this.picked(e),o=[];for(let i of this.guides)o.push(this.guide(e,i));if(n!==void 0){let i=n.room.outline.map(r=>oe(e.toScreen(r))).join(" ");o.push($`<polygon points=${i} fill="none" stroke="#5b8def" stroke-width="1" stroke-dasharray="4 4" opacity="0.5" pointer-events="none" />`);let a=n.object;o.push(this.box(e,nn(tn(a)),{width:a.size[0],depth:a.size[1]},"thing",a.hidden===!0))}else t!==void 0&&t.outline.length>=3&&o.push(this.box(e,Ti(t),Dt(t),"room",!1));return o.length===0?v:$`${o}`}box(e,t,n,o,i){let a=t.map(b=>e.toScreen(b)),r=a.reduce((b,y)=>[b[0]+y[0]/4,b[1]+y[1]/4],[0,0]),d=b=>[(a[b][0]+a[(b+1)%4][0])/2,(a[b][1]+a[(b+1)%4][1])/2],l=b=>{let y=Math.max(Math.hypot(b[0]-r[0],b[1]-r[1]),1e-6);return[(b[0]-r[0])/y,(b[1]-r[1])/y]},h=[0,1,2,3].flatMap(b=>[a[b],d(b)]),p=[0,1,2,3].reduce((b,y)=>d(y)[1]<d(b)[1]?y:b,0),u=d(p),f=l(u),c=[u[0]+f[0]*44,u[1]+f[1]*44],g=[];for(let b of[[0,2],[1,3]]){let[y,P]=b,D=Math.abs(a[(y+1)%4][0]-a[y][0])>=Math.abs(a[(y+1)%4][1]-a[y][1])?l(d(y))[1]<=l(d(P))[1]?y:P:l(d(y))[0]<=l(d(P))[0]?y:P,j=a[D],F=a[(D+1)%4],W=l(d(D)),_=[j[0]+W[0]*20,j[1]+W[1]*20],X=[F[0]+W[0]*20,F[1]+W[1]*20],J=[(_[0]+X[0])/2,(_[1]+X[1])/2],oa=D%2===0?n.width:n.depth,ae=[W[0]*5,W[1]*5];g.push($`<path d=${`M${oe(_)}L${oe(X)}M${oe([_[0]-ae[0],_[1]-ae[1]])}L${oe([_[0]+ae[0],_[1]+ae[1]])}M${oe([X[0]-ae[0],X[1]-ae[1]])}L${oe([X[0]+ae[0],X[1]+ae[1]])}`}
        stroke="#5b8def" stroke-width="1.2" fill="none" />
        <g class="hme-tag"><rect x=${z(J[0]-26)} y=${z(J[1]-9)} width="52" height="18" rx="9" fill="#5b8def" />
        <text x=${z(J[0])} y=${z(J[1]+4)} fill="#fff" text-anchor="middle">${oa.toFixed(2)} m</text></g>`)}let w=o==="room"?"Drag to resize the room. Shift keeps its proportions, Alt resizes it about its middle, Cmd or Ctrl stops it snapping.":"Drag to resize it. Shift keeps its proportions, Alt resizes it about its middle.";return $`<g class="hme-box">
      <polygon points=${a.map(oe).join(" ")} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray=${i?"5 4":"none"} />
      ${this.resizing||!this.dragging?g:v}
      ${this.dragging?v:$`
        <line x1=${z(u[0])} y1=${z(u[1])} x2=${z(c[0])} y2=${z(c[1])} stroke="#5b8def" stroke-width="1.6" />
        ${h.map((b,y)=>$`<rect data-hme="resize" data-handle=${y} x=${z(b[0]-5)} y=${z(b[1]-5)} width="10" height="10"
          fill="#fff" stroke="#5b8def" stroke-width="1.6" style=${`cursor:${ua(b[0]-r[0],b[1]-r[1])}`}>
          <title>${w}</title></rect>`)}
        <g data-hme="turn" style="cursor:grab" transform=${`translate(${oe(c)})`}>
          <title>${o==="room"?"Drag to turn the room. Hold Alt to turn it freely.":"Drag to turn it. Hold Alt to turn it freely."}</title>
          <circle r="9" fill="#5b8def" />
          <path d="M-4 0a4 4 0 1 0 1.5-3.1M-4-4.5v2.5h2.5" fill="none" stroke="#fff" stroke-width="1.3" />
        </g>`}
    </g>`}guide(e,t){let n=e.toScreen(t.a),o=e.toScreen(t.b),i=Math.max(Math.hypot(o[0]-n[0],o[1]-n[1]),1e-6),a=[(o[0]-n[0])/i,(o[1]-n[1])/i],r=[n[0]-a[0]*40,n[1]-a[1]*40],d=[o[0]+a[0]*40,o[1]+a[1]*40],l=e.floor.rooms.find(u=>k(u.id,t.roomId)),h=`Lined up with ${l===void 0?"a":C(l)} wall`,p=h.length*6.2+20;return $`<g class="hme-guide" pointer-events="none">
      <line x1=${z(r[0])} y1=${z(r[1])} x2=${z(d[0])} y2=${z(d[1])} stroke="#ff4fa3" stroke-width="1.2" stroke-dasharray="6 4" />
      <g class="hme-tag"><rect x=${z(d[0]+6)} y=${z(d[1]-10)} width=${z(p)} height="20" rx="10" fill="#ff4fa3" />
      <text x=${z(d[0]+6+p/2)} y=${z(d[1]+4)} fill="#fff" text-anchor="middle">${h}</text></g>
    </g>`}pointerDown(e,t,n){return this.draw.active?this.draw.pointerDown(e,t,n):t.button!==0?!1:this.pressHandle(e,t,n)||this.pressBody(e,t,n)}pressHandle(e,t,n){let o=t.target?.closest?.("[data-hme]"),i=o?.getAttribute("data-hme");if(i!=="turn"&&i!=="resize")return!1;let a=ma[Number(o?.getAttribute("data-handle"))],r=this.picked(e),d=this.focus(e);if(r!==void 0){if(i==="turn")this.thingTurnDrag(e,t,r,n);else if(a!==void 0)this.thingResizeDrag(e,t,r,a,n);else return!1;return!0}if(d===void 0)return!1;if(i==="turn")this.turnDrag(e,t,d,n);else if(a!==void 0)this.resizeDrag(e,t,d,a,n);else return!1;return!0}pressBody(e,t,n){let o=this.thingUnder(e,n,void 0);if(o!==void 0)return this.pickThing(e,o.room,o.index),this.thingMoveDrag(e,t,o,n),!0;let i=U(e.floor,n);return i===void 0?!1:(e.select({kind:"room",roomId:i.id}),this.moveDrag(e,t,i,n),!0)}moveDrag(e,t,n,o){let i=e.doc,a=n.id,r=ge(n.outline),d=[0,0];e.drag(t,{move:(l,h)=>{let p=l[0]-o[0],u=l[1]-o[1];if(e.toggles.grid&&r!==void 0){let f=ue;p=Math.round((r.minX+p)/f)*f-r.minX,u=Math.round((r.minY+u)/f)*f-r.minY}if(this.guides=[],e.toggles.snap&&!h.altKey){let f=yo(i,a,p,u);f!==void 0&&(p=f.dx,u=f.dy,this.guides=f.guides)}this.dragging=!0,d=[p,u],e.preview(f=>He(f,a,p,u))},end:(l,h,p)=>{this.stopDrag(e);let[u,f]=d;p&&(Math.abs(u)>=.005||Math.abs(f)>=.005)&&e.apply(c=>He(c,a,u,f),{select:{kind:"room",roomId:a}})},cancel:()=>this.stopDrag(e)})}resizeDrag(e,t,n,o,i){let a=Mo(n);if(a===void 0)return;let r=e.doc,d=n.id,l=a.a1-a.a0,h=a.c1-a.c0;if(l<=1e-6||h<=1e-6)return;let p=g=>g[0]*a.u[0]+g[1]*a.u[1],u=g=>g[0]*a.v[0]+g[1]*a.v[1],f=g=>Math.min(Math.max(g,ze),Ne),c;e.drag(t,{move:(g,w)=>{let b=w.altKey?2:1,y=l,P=h;if(o.a!==void 0&&(y=l+(p(g)-p(i))*(o.a===1?1:-1)*b),o.c!==void 0&&(P=h+(u(g)-u(i))*(o.c===1?1:-1)*b),e.toggles.grid){let F=ue;o.a!==void 0&&(y=Math.round(y/F)*F),o.c!==void 0&&(P=Math.round(P/F)*F)}if(y=f(y),P=f(P),w.shiftKey){let F=y/l,W=P/h,_=o.a===void 0?W:o.c===void 0||Math.abs(Math.log(F))>=Math.abs(Math.log(W))?F:W;_=Math.min(Math.max(_,ze/Math.min(l,h)),Ne/Math.max(l,h)),y=l*_,P=h*_}let E=[w.altKey||o.a===void 0?.5:1-o.a,w.altKey||o.c===void 0?.5:1-o.c],D={width:y,depth:P,anchor:E};if(this.guides=[],e.toggles.snap&&!w.altKey&&!w.ctrlKey&&!w.metaKey){let F=ko(r,d,D,o,{proportional:w.shiftKey});F!==void 0&&(D=F.resize,this.guides=F.guides)}this.dragging=!0,this.resizing=!0,c=D;let j=D;e.preview(F=>je(F,d,j))},end:(g,w,b)=>{this.stopDrag(e);let y=c;!b||y===void 0||Math.abs((y.width??l)-l)<.005&&Math.abs((y.depth??h)-h)<.005||e.apply(P=>je(P,d,y),{select:{kind:"room",roomId:d}})},cancel:()=>this.stopDrag(e)})}turnDrag(e,t,n,o){let i=n.id,a=ee(n),r=Math.atan2(o[1]-a[1],o[0]-a[0]),d=0;e.drag(t,{move:(l,h)=>{let p=(Math.atan2(l[1]-a[1],l[0]-a[0])-r)*180/Math.PI;p=(p+540)%360-180,h.altKey||(p=Math.round(p/_t)*_t),this.dragging=!0,d=p,e.preview(u=>be(u,i,p,a))},end:(l,h,p)=>{this.stopDrag(e),p&&Math.abs(d)>.01&&e.apply(u=>be(u,i,d,a),{select:{kind:"room",roomId:i}})},cancel:()=>this.stopDrag(e)})}thingMoveDrag(e,t,n,o){let{room:i,index:a,object:r}=n,d=i.id,l=r.c,h=l;e.drag(t,{move:(p,u)=>{let f=[l[0]+p[0]-o[0],l[1]+p[1]-o[1]];if(e.toggles.grid){let g=ue;f=[Math.round(f[0]/g)*g,Math.round(f[1]/g)*g]}if(this.guides=[],e.toggles.snap&&!u.altKey){let g=Fo(i,r,f);f=g.c,this.guides=g.guides}this.dragging=!0,h=f;let c=f;e.preview(g=>Pe(g,d,a,c))},end:(p,u,f)=>{if(this.stopDrag(e),f&&Math.hypot(h[0]-l[0],h[1]-l[1])>=.005){let c=h;e.apply(g=>Pe(g,d,a,c),{select:{kind:"object",roomId:d,object:a}})}},cancel:()=>this.stopDrag(e)})}thingResizeDrag(e,t,n,o,i){let{room:a,index:r,object:d}=n,l=a.id,{u:h,v:p}=_o(d),u=Math.max(d.size[0],Ee),f=Math.max(d.size[1],Ee),c=y=>y[0]*h[0]+y[1]*h[1],g=y=>y[0]*p[0]+y[1]*p[1],w=y=>Math.min(Math.max(y,Ee),Mt),b;e.drag(t,{move:(y,P)=>{let E=P.altKey?2:1,D=u,j=f;if(o.a!==void 0&&(D=u+(c(y)-c(i))*(o.a===1?1:-1)*E),o.c!==void 0&&(j=f+(g(y)-g(i))*(o.c===1?1:-1)*E),e.toggles.grid){let _=ue;o.a!==void 0&&(D=Math.round(D/_)*_),o.c!==void 0&&(j=Math.round(j/_)*_)}if(D=w(D),j=w(j),P.shiftKey){let _=D/u,X=j/f,J=o.a===void 0?X:o.c===void 0||Math.abs(Math.log(_))>=Math.abs(Math.log(X))?_:X;J=Math.min(Math.max(J,Ee/Math.min(u,f)),Mt/Math.max(u,f)),D=u*J,j=f*J}let F=[P.altKey||o.a===void 0?.5:1-o.a,P.altKey||o.c===void 0?.5:1-o.c];this.dragging=!0,this.resizing=!0;let W={width:D,depth:j,anchor:F};b=W,e.preview(_=>Be(_,l,r,W))},end:(y,P,E)=>{this.stopDrag(e);let D=b;!E||D===void 0||Math.abs((D.width??u)-d.size[0])<.005&&Math.abs((D.depth??f)-d.size[1])<.005||e.apply(j=>Be(j,l,r,D),{select:{kind:"object",roomId:l,object:r}})},cancel:()=>this.stopDrag(e)})}thingTurnDrag(e,t,n,o){let{room:i,index:a,object:r}=n,d=i.id,l=r.c,h=Math.atan2(o[1]-l[1],o[0]-l[0]),p=0;e.drag(t,{move:(u,f)=>{let c=(Math.atan2(u[1]-l[1],u[0]-l[0])-h)*180/Math.PI;c=(c+540)%360-180,f.altKey||(c=Math.round(c/_t)*_t),this.dragging=!0,p=-c;let g=p;e.preview(w=>we(w,d,a,g))},end:(u,f,c)=>{this.stopDrag(e);let g=p;c&&Math.abs(g)>.01&&e.apply(w=>we(w,d,a,g),{select:{kind:"object",roomId:d,object:a}})},cancel:()=>this.stopDrag(e)})}hover(e,t){this.draw.hover(e,t)}keyDown(e,t){if(this.draw.active)return this.draw.keyDown(e,t);let n=this.focus(e);if(n===void 0)return!1;let o=Z(t,!1),i=this.picked(e);if(i!==void 0){let{index:a,object:r}=i,d={kind:"room",roomId:n.id};if(o==="delete")return e.apply(l=>We(l,n.id,a),{select:d}),!0;if(o==="cancel")return e.select(d),!0;if(typeof o=="object"&&"nudge"in o){let[l,h]=o.nudge;return e.apply(p=>Pe(p,n.id,a,[r.c[0]+l,r.c[1]+h])),!0}return!1}if(o==="delete")return this.askDelete(e,n),!0;if(typeof o=="object"&&"nudge"in o){let[a,r]=o.nudge;return e.apply(d=>He(d,n.id,a,r)),!0}return!1}cursor(){return this.draw.active?"crosshair":void 0}leave(e){this.draw.stop(e),this.picker=void 0,this.guides=[],this.dragging=!1,this.resizing=!1}dock(e){return m`<button type="button" class="hme-tb ${e.toggles.snap?"on":""}" aria-pressed=${e.toggles.snap?"true":"false"}
        title="A dragged room lines up with the walls round it. Hold Alt to move it freely." @click=${()=>e.setToggle("snap",!e.toggles.snap)}>Snap to walls</button>
      <button type="button" class="hme-tb ${e.toggles.grid?"on":""}" aria-pressed=${e.toggles.grid?"true":"false"}
        @click=${()=>e.setToggle("grid",!e.toggles.grid)}>Grid 10 cm</button>`}pill(e){if(this.draw.active)return m`<span class="hme-pill-name">${this.draw.hint()}</span>
        ${this.draw.points.length>=3?m`<button type="button" class="hme-tb" @click=${()=>{this.draw.finish(e)}}>Close the room</button>`:v}
        <button type="button" class="hme-tb" @click=${()=>this.draw.stop(e)}>Cancel</button>`;let t=this.focus(e);if(t===void 0||this.dragging)return v;let n=t.id,o=this.picked(e);if(o!==void 0){let{index:i,object:a}=o;return m`<span class="hme-pill-name">${ie(a)}</span>
        <button type="button" class="hme-tb" @click=${()=>e.apply(r=>we(r,n,i,90))}>⟲ Turn 90°</button>
        <button type="button" class="hme-tb" title="Turn it square with the room's walls" @click=${()=>e.apply(r=>ln(r,n,i))}>Line up</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(r=>$t(r,n,i,a.hidden!==!0))}>${a.hidden===!0?"Show":"Hide"}</button>
        <button type="button" class="hme-tb" @click=${()=>e.select({kind:"room",roomId:n})}>${C(t)} ›</button>
        <button type="button" class="hme-tb danger" @click=${()=>e.apply(r=>We(r,n,i),{select:{kind:"room",roomId:n}})}>Remove</button>`}return m`<span class="hme-pill-name">${C(t)}</span>
      <button type="button" class="hme-tb" @click=${()=>e.apply(i=>be(i,n,90))}>⟲ Turn 90°</button>
      <button type="button" class="hme-tb" @click=${()=>e.apply(i=>se(i,n))}>Square the corners</button>
      <button type="button" class="hme-tb" title="Turn it to the floor's walls and slide it onto the nearest wall line, as the iPhone does"
        @click=${()=>e.apply(i=>$o(i,n))}>Snap to walls</button>
      ${this.floorMenu(e,t,"Move to floor","hme-tb")}
      <button type="button" class="hme-tb danger" @click=${()=>{this.askDelete(e,t)}}>Delete</button>`}floorMenu(e,t,n,o){let i=e.doc.floors.filter(a=>!k(a.id,e.floor.id));return Dn({label:n,cls:o,options:[...i.map(a=>({value:a.id,label:L(a)})),{value:"new",label:"New floor\u2026"}],pick:a=>{this.moveToFloor(e,t,a)}})}async moveToFloor(e,t,n){let o=t.id,i={kind:"room",roomId:o};if(n!=="new"){e.apply(l=>rn(l,o,{floorId:n}),{select:i,floorId:n});return}let a=Math.max(...e.doc.floors.map(l=>l.story))+1,r=await e.ask({title:"A new floor",label:"Name",value:a===1?"Upstairs":`Floor ${a+1}`,ok:"Move the room there"});if(r===void 0)return;let d=e.newId();e.apply(l=>rn(l,o,{newFloor:{id:d,name:r,story:a}}),{select:i,floorId:d})}async askDelete(e,t){let n=Le(e.floor,t.id).length;await e.confirm({title:`Delete ${C(t)}?`,text:ca(t,n),ok:"Delete room",danger:!0})&&e.apply(i=>Po(i,t.id),{select:null})}inspector(e){let t=this.focus(e);if(t===void 0)return this.floorCard(e,e.floor);let n=this.picked(e);if(n!==void 0)return this.thingInspector(e,n);let o=t.id,i=Dt(t),a=eo(e.floor,e.toggles.live?e.hass?.states:void 0).has(t.id),r=Le(e.floor,o),d=ge(t.outline)??{minX:0,minY:0,maxX:0,maxY:0},l=Math.round(-bo(t)*10)/10,h=t.areaId===void 0||e.areas.some(c=>c.id===t.areaId),p=t.pageId===void 0||e.pages.some(c=>k(c.id,t.pageId)),u=co(t),f=this.edits(e);return m`
      <section class="hme-card hme-head">
        ${Di(t,a)}
        <div class="hme-head-t">
          <strong>${C(t)}</strong>
          <span>${L(e.floor)} · ${De(t)} · ${i.area.toFixed(1)} m²</span>
        </div>
      </section>

      ${H("Room",m`
        ${O("Name",at({value:t.name??"",label:"Name",placeholder:"Room",set:c=>e.apply(g=>Eo(g,o,c))}))}
        ${O("Area",Me({label:"Area",value:t.areaId??"",options:[{value:"",label:"None"},...h?[]:[{value:t.areaId,label:`Not in Home Assistant (${t.areaId})`,disabled:!0}],...e.areas.map(c=>({value:c.id,label:c.name}))],set:c=>e.apply(g=>To(g,o,c===""?void 0:c))}))}
        ${G("The Home Assistant area. Its devices show first in Not on the map, and Place all by area puts them here.")}
        ${O("Tap opens",Me({label:"Tap opens",value:t.pageId??"",options:[{value:"",label:"Nothing"},...p?[]:[{value:t.pageId,label:"A page not in your library",disabled:!0}],...e.pages.map(c=>({value:c.id,label:`Page: ${c.name}`}))],set:c=>e.apply(g=>So(g,o,c===""?void 0:c))}))}
        ${G("What a tap on this room does on the map tiles and the watch.")}`)}

      ${H("Size",m`
        ${ot(I({tag:"W",label:"Width",value:i.width,unit:"m",min:ze,max:Ne,...f((c,g)=>je(c,o,{width:g}))}),I({tag:"D",label:"Depth",value:i.depth,unit:"m",min:ze,max:Ne,...f((c,g)=>je(c,o,{depth:g}))}),I({tag:"H",label:"Wall height",value:t.height,unit:"m",min:.5,max:20,...f((c,g)=>Ke(c,o,g))}))}
        <p class="hme-foot-hint">Along its own walls, about its middle; its doors, things and devices move with it.</p>`)}

      ${H("Place",m`
        ${it("Corner",ot(I({tag:"X",label:"Left",value:d.minX,unit:"m",...f((c,g)=>He(c,o,g-d.minX,0))}),I({tag:"Y",label:"Top",value:d.minY,unit:"m",...f((c,g)=>He(c,o,0,g-d.minY))})))}
        ${it("Turn",m`<div class="hme-turn">
          ${I({label:"Turn",value:l,unit:"\xB0",digits:1,min:-180,max:180,...f((c,g)=>be(c,o,g-l))})}
          <button type="button" class="hme-tb" @click=${()=>e.apply(c=>be(c,o,-90))}>−90°</button>
          <button type="button" class="hme-tb" @click=${()=>e.apply(c=>be(c,o,90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it so its longest wall runs straight across or down" @click=${()=>e.apply(c=>wo(c,o))}>Level</button>
        </div>`)}
        <p class="hme-foot-hint">Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the room to move it, a square handle to resize it, the round one to turn it.</p>
        ${O("Floor",Me({label:"Floor",value:e.floor.id,options:[...e.doc.floors.map(c=>({value:c.id,label:L(c)})),{value:"new",label:"New floor\u2026"}],set:c=>{this.moveToFloor(e,t,c)}}))}`)}

      ${H("Floor finish",m`<div class="hme-pics">
        ${V({label:`Auto: ${Ai[u]}`,picture:An(u),on:t.finish===void 0,title:"Picked from the room's name and furniture",click:()=>e.apply(c=>sn(c,o,void 0))})}
        ${Yn.map(c=>V({label:Ai[c],picture:An(c),on:t.finish===c,click:()=>e.apply(g=>sn(g,o,c))}))}
      </div>`)}

      ${H("In this room",m`
        ${t.objects.length===0?m`<p class="hme-empty-line">No things. Add a sofa, a bed or stairs so the map reads.</p>`:v}
        ${t.objects.map((c,g)=>m`<div class="hme-r tight"><span class="hme-grow ${c.hidden===!0?"dim":""}">
            <button type="button" class="hme-link" title="Pick it to move, resize or turn it" @click=${()=>this.pickThing(e,t,g)}>${ie(c)}</button></span>
          ${rt({on:c.hidden!==!0,onText:"Shown",offText:"Hidden",label:`${ie(c)} shown`,click:()=>e.apply(w=>$t(w,o,g,c.hidden!==!0))})}
          <button type="button" class="hme-x" aria-label=${`Remove ${ie(c)}`} title="Remove" @click=${()=>e.apply(w=>We(w,o,g))}>×</button></div>`)}
        <div class="hme-r tight"><span class="hme-grow">${t.openings.length===0?"No doors or windows":[...new Set(t.openings.map(me))].join(", ")}</span>
          <button type="button" class="hme-link" title="Edit this room's corners, walls, doors and windows (or double-click the room)"
            @click=${()=>e.editWalls(o)}>Edit walls ›</button></div>
        ${r.length===0?m`<div class="hme-r tight"><span class="hme-grow dim">No devices. Drag one from Not on the map.</span></div>`:v}
        ${r.map(c=>m`<div class="hme-r tight"><span class="hme-grow">
          <button type="button" class="hme-link" title="Pick it to set its height, glow and tap" @click=${()=>e.select({kind:"pin",pinId:c.id})}>${B(c,e.hass)}</button></span>
          <span class="hme-val">${he(c.entityId,e.toggles.live?e.hass?.states:void 0)}</span></div>`)}
        <div class="hme-row-end">
          ${Dn({label:"\uFF0B Add a thing",cls:"hme-tb",options:Co.map(c=>({value:c,label:nt(c)})),pick:c=>{let g=q(t)??ee(t);e.apply(w=>Ro(w,o,c,g))}})}
          ${this.addFurnitureButton(e,t,"hme-tb")}
          <button type="button" class="hme-tb danger push" @click=${()=>{this.askDelete(e,t)}}>Delete room</button>
        </div>`)}`}edits(e){return t=>({set:n=>e.apply(o=>t(o,n)),preview:n=>e.preview(n===void 0?void 0:o=>t(o,n))})}thingInspector(e,t){let{room:n,index:o,object:i}=t,a=n.id,r=ie(i),[d,l,h]=i.size,p=va(i),u=this.edits(e),f={kind:"room",roomId:a},c={unit:"m",min:Ee,max:Mt};return m`
      <section class="hme-card hme-head">
        <div class="hme-head-t">
          <strong>${r}</strong>
          <span>In ${C(n)} · ${d.toFixed(2)} × ${l.toFixed(2)} × ${h.toFixed(2)} m${(i.lift??0)>0?` \xB7 ${(i.lift??0).toFixed(2)} m up`:""}${i.hidden===!0?" \xB7 Hidden":""}</span>
        </div>
      </section>

      ${this.modelCard(e,t)}

      ${this.coloursCard(e,t)}

      ${H("Size",m`
        ${ot(I({tag:"W",label:"Width",value:d,...c,...u((g,w)=>Be(g,a,o,{width:w}))}),I({tag:"D",label:"Depth",value:l,...c,...u((g,w)=>Be(g,a,o,{depth:w}))}),I({tag:"H",label:"Height",value:h,...c,min:.01,...u((g,w)=>dn(g,a,o,{size:[d,l,w]}))}))}`)}

      ${H("Place",m`
        ${it("Middle, and up off the floor",ot(I({tag:"X",label:"Middle across",value:i.c[0],unit:"m",...u((g,w)=>Pe(g,a,o,[w,i.c[1]]))}),I({tag:"Y",label:"Middle down",value:i.c[1],unit:"m",...u((g,w)=>Pe(g,a,o,[i.c[0],w]))}),I({tag:"Z",label:"Up off the floor",value:i.lift??0,unit:"m",min:0,max:100,...u((g,w)=>dn(g,a,o,{lift:w}))})))}
        ${it("Turn",m`<div class="hme-turn">
          ${I({label:"Turn",value:p,unit:"\xB0",digits:1,min:-180,max:180,...u((g,w)=>we(g,a,o,w-p))})}
          <button type="button" class="hme-tb" title="Turn it a quarter one way" @click=${()=>e.apply(g=>we(g,a,o,-90))}>−90°</button>
          <button type="button" class="hme-tb" title="Turn it a quarter the other way" @click=${()=>e.apply(g=>we(g,a,o,90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it square with the room's walls" @click=${()=>e.apply(g=>ln(g,a,o))}>Line up</button>
        </div>`)}
        <p class="hme-foot-hint">Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the thing to move it, a square handle to resize it, the round one to turn it.</p>`)}

      ${H("Show",m`
        <div class="hme-r tight"><span class="hme-grow">On the map, the tiles and the watch</span>
          ${rt({on:i.hidden!==!0,onText:"Shown",offText:"Hidden",label:`${r} shown`,click:()=>e.apply(g=>$t(g,a,o,i.hidden!==!0))})}</div>
        <p class="hme-foot-hint">Scan Again on the iPhone puts the room's things back where the scan finds them. A hidden thing stays hidden.</p>
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${()=>e.select(f)}>‹ ${C(n)}</button>
          <button type="button" class="hme-tb danger push" @click=${()=>e.apply(g=>We(g,a,o),{select:f})}>Remove</button>
        </div>`)}`}modelCard(e,t){let{room:n,index:o,object:i}=t,a=Ct(i),r=wn(i.model),d=r!==void 0?`${r.group}, picked from the catalog`:i.model!==void 0?a===void 0?"A piece this panel does not know yet":`A piece this panel does not know yet, drawn as the ${a.name.toLowerCase()} meanwhile`:a!==void 0?`Picked by its kind: ${nt(i.kind)}`:"A plain box, as the scan found it";return H("Model",m`<div class="hme-model">
        ${this.piecePic(e,a,"hme-model-pic")}
        <div class="hme-model-t"><strong>${a?.name??"Plain box"}</strong><span>${d}</span></div>
        <button type="button" class="hme-tb push" title="Pick another piece from the furniture catalog; it keeps its place, size and turn"
          @click=${()=>this.openPicker(e,n,o)}>Change…</button>
      </div>
      <p class="hme-foot-hint">What it looks like in the 3D view and on the iPhone. The flat plan and the tiles draw it as before.</p>`)}coloursCard(e,t){let n=fa(t.object);return n.length===0?v:H("Colours",m`
      ${n.map(o=>this.colourRow(e,t,o))}
      <p class="hme-foot-hint">In the 3D view and on the iPhone. The flat plan, the tiles and the furniture picker keep the model's own colours.</p>`)}colourRow(e,t,n){let{room:o,index:i,object:a}=t,r=o.id,d=n==="fabric"?"Fabric":"Wood",l=n==="fabric"?ni:oi,h=a[n]?.toUpperCase(),p=h!==void 0&&!l.some(f=>f.hex===h),u=f=>e.apply(c=>Ao(c,r,i,n,f));return m`<div class="hme-r top"><span class="hme-l">${d}</span>
      <div class="hme-chips hme-colours" role="group" aria-label=${`${d} colour`}>
        <button type="button" class="hme-chip sel ${h===void 0?"on":""}" aria-pressed=${h===void 0?"true":"false"}
          title="The model's own colour" @click=${()=>u(void 0)}>Default</button>
        ${l.map(f=>m`<button type="button" class="hme-colour ${h===f.hex?"on":""}" style=${`--c:${f.hex}`}
          title=${f.name} aria-label=${`${d}: ${f.name}`} aria-pressed=${h===f.hex?"true":"false"} @click=${()=>u(f.hex)}></button>`)}
        <label class="hme-chip sel hme-pick ${p?"on":""}" title=${`Any ${n} colour`}>${p?m`<span class="hme-swatch" style=${`background:${h}`}></span>`:v}Custom
          <input type="color" .value=${N((h??l[0].hex).toLowerCase())} aria-label=${`Pick a ${n} colour`}
            @change=${f=>u(f.target.value)} /></label>
      </div></div>`}floorCard(e,t){let n=mt(t,e.toggles.live?e.hass?.states:void 0);return m`${H("Floor",m`
        ${O("Name",at({value:t.name,label:"Floor name",placeholder:L(t),set:o=>e.apply(i=>yt(i,t.id,o))}))}
        ${O("On it",m`<span class="hme-val">${R(t.rooms.length,"room")} · ${R(t.pins.length,"device")} · ${ut(n)}</span>`)}`)}
      ${H("Edit",m`<p class="hme-text">Click picks what is on top: a device, then a thing (a sofa, a TV, a desk), then the room under them. Drag it to move it.</p>
        <p class="hme-text dim">A dragged room lines up with the walls of the rooms round it. Drag the round handle above it to turn it, or a square handle on its box to resize it. Undo with ${Pi()}.</p>
        <p class="hme-text dim">Double-click a room to edit its walls, doors and windows. Drag a device from Not on the map onto the plan to place it; Shift, Cmd or Ctrl and a click picks several.</p>`)}`}};var ba=15,Lt=Math.PI/4,Nn=8,zt="#ffbf55",x=s=>s.toFixed(1);function wa(s,e){return`${ci(s.domain)} \xB7 ${he(s.entityId,e)}`}function ya(s,e){let t=Y(s,e);if(t===void 0)return"Not in a room";let n=U(s,e.at);return n!==void 0&&k(n.id,t.id)?`${C(t)} (found by place)`:C(t)}function $a(s,e,t){return s.icon!==void 0?Rt[s.icon]:`Auto (${Rt[Ve(s.entityId,e,t)].toLowerCase()})`}var Nt=class{constructor(){this.side=!0;this.names=!1;this.moving=!1;this.iconsOpen=!1;this.pickPage=!1}states(e){return e.toggles.live?e.hass?.states:void 0}picked(e){let t=e.selection;return t?.kind==="pin"?e.floor.pins.find(n=>k(n.id,t.pinId)):void 0}picks(e){return ne(e.selection).flatMap(t=>e.floor.pins.filter(n=>k(n.id,t)))}deviceClass(e,t){let n=e.hass?.states?.[t]?.attributes?.device_class;return typeof n=="string"?n:void 0}friendly(e,t){let n=e.hass?.states?.[t]?.attributes?.friendly_name;return typeof n=="string"&&n.trim()!==""?n.trim():void 0}place(e,t,n,o){let i=Pn(e.doc,t);if(i!==void 0)return k(i.floorId,e.floor.id)||e.setFloor(i.floorId),e.select({kind:"pin",pinId:i.pinId}),!1;let a=fi(e.floor,o),r=n??(a===void 0?Ie(e.view,[e.stage.width/2,e.stage.height/2]):q(a)??ee(a)),d=e.newId().toUpperCase(),l=e.floor.id,h=this.friendly(e,t),p=e.apply(u=>Uo(u,l,{id:d,entityId:t,at:[r[0],r[1]],...h===void 0?{}:{name:h}}),{select:{kind:"pin",pinId:d}});return p||e.note("warn","That device could not be put on the map: the map holds at most 400 devices."),p}placeAll(e,t){let n=t.map(i=>({entityId:i.entityId,areaId:i.areaId,name:i.name,deviceClass:i.deviceClass})),o=e.floor.id;e.apply(i=>Yo(i,o,n,()=>e.newId())?.doc,{select:null})}kindChips(e){let t=ui(e.floor);return t.length===0?v:m`<div class="hme-chips">${t.map(n=>m`<button type="button" class="hme-chip sel ${this.filter===n.kind?"on":""}"
      aria-pressed=${this.filter===n.kind?"true":"false"} title="Dim the other kinds of device on the plan"
      @click=${()=>{this.filter=this.filter===n.kind?void 0:n.kind,e.redraw()}}>${n.label} ${n.count}</button>`)}</div>`}deviceRow(e,t,n){let o=Pn(e.doc,t.entityId),i=Ve(t.entityId,t.deviceClass,t.name);return m`<div class="hme-dv ${this.dragging===t.entityId?"dragging":""} ${o===void 0?"":"placed"}" role="button" tabindex="0"
      draggable=${o===void 0?"true":"false"} title=${o===void 0?"Drag onto the plan, or click to put it in its area's room":"On the map: click to pick it"}
      @dragstart=${a=>{a.dataTransfer?.setData(It,t.entityId),a.dataTransfer?.setData("text/plain",t.entityId),a.dataTransfer&&(a.dataTransfer.effectAllowed="copy"),this.dragging=t.entityId,e.redraw()}}
      @dragend=${()=>{this.dragging=void 0,this.dropAt=void 0,e.redraw()}}
      @click=${()=>this.place(e,t.entityId,void 0,t.areaId)}
      @keydown=${a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),this.place(e,t.entityId,void 0,t.areaId))}}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${ye(i,"currentColor",24,2)}</svg></span>
      <span class="hme-dv-nm">${t.name}<small>${o===void 0?wa(t,n):"on the map"}</small></span>
      <span class="hme-dv-grip" aria-hidden="true">${o===void 0?"\u22EE\u22EE":"\u203A"}</span>
    </div>`}dragOver(e,t,n){let o=this.dragging!==void 0||[...n.dataTransfer?.types??[]].includes(It),i=this.dropAt;return this.dropAt=o?t:void 0,i!==this.dropAt&&e.redraw(),o&&t!==void 0}drop(e,t,n){let o=this.dragging??n.dataTransfer?.getData(It)??"";this.dragging=void 0,this.dropAt=void 0,o!==""?this.place(e,o,t):e.redraw()}overlay(e){let t=this.states(e),n=this.picked(e),o=ne(e.selection),i=[];this.dropAt!==void 0&&i.push(this.dropMark(e,this.dropAt));let a=n===void 0?void 0:te(n.entityId,t);n!==void 0&&a?.kind==="light"&&i.push(this.glowRing(e,n,a.on?a.brightness:void 0));for(let r of e.floor.pins){let d=o.some(h=>k(r.id,h)),l=this.filter!==void 0&&$n(r.entityId)!==this.filter;i.push(this.pinMark(e,r,d,l,t))}return this.box!==void 0&&i.push(this.boxMark(e,this.box)),$`${i}`}boxMark(e,t){let[n,o]=e.toScreen(t.a),[i,a]=e.toScreen(t.b);return $`<rect class="hme-box" x=${x(Math.min(n,i))} y=${x(Math.min(o,a))} width=${x(Math.abs(i-n))} height=${x(Math.abs(a-o))}
      fill="rgba(91,141,239,0.12)" stroke="#5b8def" stroke-width="1.2" stroke-dasharray="4 3" pointer-events="none" />`}pinMark(e,t,n,o,i){let[a,r]=e.toScreen(t.at),d=te(t.entityId,i),l=d.kind==="light"&&d.on,h=l?qe(t)??zt:"rgba(36,36,40,0.92)",p=l?"#fff3d6":d.kind==="gone"?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.4)",u=l?"#3a2600":d.kind==="lock"?d.locked?"#30d158":"#ff9f0a":d.kind==="other"&&d.on?"#ffffff":d.kind==="gone"?"#8e8e93":"#d1d1d6",f=t.icon??Ve(t.entityId,this.deviceClass(e,t.entityId),this.friendly(e,t.entityId)),c=n?13:12,g=n||this.names?B(t,e.hass):ai(t,i),w=g===void 0?0:g.length*5.9+14;return $`<g class="hme-pin" data-hme="pin" data-pin=${t.id} transform=${`translate(${x(a)} ${x(r)})`} opacity=${o?.25:1} style="cursor:grab">
      ${n?$`<circle r="20" fill="none" stroke="#5b8def" stroke-width="2.5" />`:v}
      ${l?$`<circle r=${c+7} fill=${h} opacity="0.22" />`:v}
      <circle r=${c} fill=${h} stroke=${p} stroke-width="1.2" />
      <g transform="translate(-7 -7)">${ye(f,u,14,1.5)}</g>
      ${g===void 0||g===""?v:$`<g pointer-events="none"><rect x=${x(-w/2)} y=${c+4} width=${x(w)} height="16" rx="8" fill=${n?"#5b8def":"rgba(0,0,0,0.7)"} />
        <text y=${c+15.5} fill="#fff" font-size="10" font-weight="600" text-anchor="middle">${g}</text></g>`}
    </g>`}glowRing(e,t,n){let[o,i]=e.toScreen(t.at),a=Xe(t,n),r=e.px(a),d=[o+r*Math.cos(Lt),i+r*Math.sin(Lt)],l=`Glow ${a.toFixed(1)} m`,h=l.length*6.2+18,p=t.glowSpill===!0?void 0:Y(e.floor,t),u=p!==void 0&&p.outline.length>=3?p.outline.map(c=>e.toScreen(c).map(x).join(",")).join(" "):void 0,f=c=>$`<circle cx=${x(o)} cy=${x(i)} r=${x(r)} fill="none" stroke=${qe(t)??"#5b8def"} stroke-width="1.4"
      stroke-dasharray="5 5" opacity=${c} pointer-events="none" />`;return $`<g class="hme-glow-ring">
      ${u===void 0?f(1):$`<clipPath id="hme-glow-walls"><polygon points=${u} /></clipPath>
        ${f(.28)}<g clip-path="url(#hme-glow-walls)">${f(1)}</g>`}
      <circle data-hme="glow" cx=${x(d[0])} cy=${x(d[1])} r="7" fill="#fff" stroke="#5b8def" stroke-width="2" style="cursor:nwse-resize">
        <title>Drag to set how far this light's glow reaches</title></circle>
      <g class="hme-tag" pointer-events="none"><rect x=${x(d[0]-h/2)} y=${x(d[1]+12)} width=${x(h)} height="18" rx="9" fill="#5b8def" />
        <text x=${x(d[0])} y=${x(d[1]+25)} fill="#fff" text-anchor="middle">${l}</text></g>
    </g>`}dropMark(e,t){let n=U(e.floor,t),[o,i]=e.toScreen(t),a=n===void 0?"Drop here, in no room":`Drop in ${C(n)}`,r=a.length*6.4+20;return $`<g class="hme-drop" pointer-events="none">
      ${n===void 0?v:$`<polygon points=${n.outline.map(d=>e.toScreen(d).map(x).join(",")).join(" ")}
        fill="rgba(91,141,239,0.18)" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />`}
      <circle cx=${x(o)} cy=${x(i)} r="13" fill="rgba(91,141,239,0.35)" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 2" />
      <g class="hme-tag"><rect x=${x(o-r/2)} y=${x(i+20)} width=${x(r)} height="18" rx="9" fill="#5b8def" />
        <text x=${x(o)} y=${x(i+33)} fill="#fff" text-anchor="middle">${a}</text></g>
    </g>`}pinAt(e,t){let n,o=ba;for(let i of e.floor.pins){let a=e.toScreen(i.at),r=Math.hypot(a[0]-t[0],a[1]-t[1]);r<=o&&(n=i,o=r)}return n}pointerDown(e,t,n){return t.button!==0?!1:this.pressHandle(e,t,n)||this.pressPin(e,t,n)||this.pressBox(e,t,n)}pressHandle(e,t,n){let o=this.picked(e);if(o===void 0||t.shiftKey||t.metaKey||t.ctrlKey)return!1;let i=te(o.entityId,this.states(e));if(i.kind!=="light")return!1;let a=e.toScreen(n),[r,d]=e.toScreen(o.at),l=e.px(Xe(o,i.on?i.brightness:void 0));return Math.hypot(a[0]-(r+l*Math.cos(Lt)),a[1]-(d+l*Math.sin(Lt)))>10?!1:(this.glowDrag(e,t,o),!0)}onPin(e,t){return this.pinAt(e,e.toScreen(t))!==void 0}pressBox(e,t,n){return t.shiftKey?(this.boxDrag(e,t,n),!0):!1}pressPin(e,t,n){let o=t.shiftKey||t.metaKey||t.ctrlKey,i=this.pinAt(e,e.toScreen(n));if(i===void 0)return!1;if(this.pickPage=!1,this.iconsOpen=!1,o)return e.select(Je(e.selection,i.id)),!0;let a=ne(e.selection);return a.length>1&&a.some(r=>k(r,i.id))?(this.groupDrag(e,t,a,i.id,n),!0):(e.select({kind:"pin",pinId:i.id}),this.moveDrag(e,t,i,n),!0)}groupDrag(e,t,n,o,i){let a=[0,0],r=Ze(n);e.drag(t,{move:d=>{this.moving=!0,a=[d[0]-i[0],d[1]-i[1]];let[l,h]=a;e.preview(p=>Et(p,n,l,h))},end:(d,l,h)=>{this.moving=!1,e.preview(void 0);let[p,u]=a;h?Math.hypot(p,u)>=.005&&e.apply(f=>Et(f,n,p,u),r===void 0?{}:{select:r}):e.select({kind:"pin",pinId:o})},cancel:()=>this.stopDrag(e)})}stopDrag(e){this.moving=!1,this.box=void 0,e.preview(void 0)}boxDrag(e,t,n){let o=e.floor.pins,i=e.selection;e.drag(t,{move:a=>{this.box={a:n,b:a},e.redraw()},end:(a,r,d)=>{this.box=void 0,d?e.select(gi(i,vi(o,n,a))):e.redraw()},cancel:()=>this.stopDrag(e)})}async removePicks(e,t){t.length!==0&&(t.length>1&&!await e.confirm({title:`Remove ${R(t.length,"device")} from the map?`,text:"They go back to Not on the map. Undo puts them back where they were.",ok:"Remove",danger:!0})||e.apply(n=>qo(n,t),{select:null}))}moveDrag(e,t,n,o){let i=n.id,a=[n.at[0],n.at[1]],r=a;e.drag(t,{move:d=>{this.moving=!0,r=[a[0]+d[0]-o[0],a[1]+d[1]-o[1]],e.preview(l=>fn(l,i,r))},end:(d,l,h)=>{this.moving=!1,e.preview(void 0),h&&Math.hypot(r[0]-a[0],r[1]-a[1])>=.005&&e.apply(p=>fn(p,i,r),{select:{kind:"pin",pinId:i}})},cancel:()=>this.stopDrag(e)})}glowDrag(e,t,n){let o=n.id,i;e.drag(t,{move:a=>{this.moving=!0;let r=Math.hypot(a[0]-n.at[0],a[1]-n.at[1]);i=Math.min(Math.max(Math.round(r/.05)*.05,Ae),Jn);let d=i;e.preview(l=>Ue(l,o,{glow:d}))},end:()=>{this.moving=!1,e.preview(void 0);let a=i;a!==void 0&&e.apply(r=>Ue(r,o,{glow:a}))},cancel:()=>this.stopDrag(e)})}keyDown(e,t){let n=this.picks(e).map(i=>i.id);if(n.length===0)return!1;let o=Z(t,!1);if(o==="delete")return this.removePicks(e,n),!0;if(typeof o=="object"&&"nudge"in o){let[i,a]=o.nudge;return e.apply(r=>Et(r,n,i,a)),!0}return!1}leave(){this.dragging=void 0,this.dropAt=void 0,this.box=void 0,this.moving=!1,this.iconsOpen=!1,this.pickPage=!1}dock(e){let t=(n,o,i,a)=>m`<button type="button" class="hme-tb ${o?"on":""}"
      aria-pressed=${o?"true":"false"} title=${a} @click=${()=>{i(),e.redraw()}}>${n}</button>`;return m`${t("Side view",this.side,()=>{this.side=!this.side},"The picked device's room from the side, to set its height")}
      ${t("Names",this.names,()=>{this.names=!this.names},"Every device's name under its pin")}`}stageExtra(e){let t=this.picked(e);if(!this.side||t===void 0)return v;let n=Y(e.floor,t),o=n?.height??2.5,i=ge(n?.outline??e.floor.rooms.flatMap(E=>E.outline))??{minX:t.at[0]-1,maxX:t.at[0]+1,minY:0,maxY:0},a=18,r=118,d=(r-a)/Math.max(o,.5),l=30,h=262,p=(h-l)/Math.max(i.maxX-i.minX,.5),u=E=>l+(Math.min(Math.max(E,i.minX),i.maxX)-i.minX)*p,f=t.at[2],c=r-Math.min(Math.max(f,0),o)*d,g=u(t.at[0]),w=(()=>{let E=te(t.entityId,this.states(e));return E.kind==="light"&&E.on})(),b=[];for(let E=0;E<=o+1e-9;E+=1)b.push(E);let y=n===void 0?[]:Qn(n),P=n===void 0?"No room":C(n);return m`<div class="hme-side">
      <div class="hme-h">${P} from the side</div>
      <svg viewBox="0 0 270 130" role="img" aria-label=${`Side view: ${B(t,e.hass)} at ${f.toFixed(2)} m, the wall ${o.toFixed(1)} m tall`}
        @pointerdown=${E=>this.heightDrag(e,E,t,o,r,d)}>
        <path d=${`M${l} ${x(a)}H${h}M${l} ${r}H${h}`} stroke="#ece6da" stroke-width="3" />
        <path d=${`M${l} ${x(a)}V${r}M${h} ${x(a)}V${r}`} stroke="#ece6da" stroke-width="1.5" opacity="0.4" />
        <g font-size="9" fill="#8e8e93" text-anchor="end" class="mono">
          ${b.map(E=>$`<text x=${l-6} y=${x(r-E*d+3)}>${E===0?"0":`${E} m`}</text>
            <path d=${`M${l-4} ${x(r-E*d)}H${l}`} stroke="#8e8e93" />`)}
        </g>
        ${y.map(E=>{let D=u(E.c[0]-E.size[0]/2),j=u(E.c[0]+E.size[0]/2),F=Math.min(E.size[2],o)*d;return $`<rect x=${x(D)} y=${x(r-F)} width=${x(Math.max(j-D,2))} height=${x(F)} rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" />`})}
        <path d=${`M${x(g)} ${r}V${x(c)}`} stroke="#5b8def" stroke-width="1.2" stroke-dasharray="3 3" />
        ${w?$`<circle cx=${x(g)} cy=${x(c)} r="20" fill="#ffb648" opacity="0.22" />`:v}
        <circle cx=${x(g)} cy=${x(c)} r="9" fill=${w?zt:"#3a3a3c"} stroke="#5b8def" stroke-width="2.5" style="cursor:ns-resize" />
        <g class="hme-tag"><rect x=${x(Math.min(g+14,222))} y=${x(c-8)} width="44" height="16" rx="8" fill="#5b8def" />
          <text x=${x(Math.min(g+14,222)+22)} y=${x(c+3.5)} fill="#fff" font-size="10" text-anchor="middle">${f.toFixed(2)} m</text></g>
      </svg>
      <span class="hme-side-hint">Drag the pin up or down here.</span>
    </div>`}heightDrag(e,t,n,o,i,a){if(t.button!==0)return;let r=t.currentTarget,d=n.id,l=f=>{let c=r.getBoundingClientRect(),g=(f.clientY-c.top)*130/Math.max(c.height,1);return Math.min(Math.max(Math.round((i-g)/a/.05)*.05,0),o)},h=l(t);try{r.setPointerCapture(t.pointerId)}catch{}this.moving=!0,e.preview(f=>de(f,d,h));let p=f=>{h=l(f);let c=h;e.preview(g=>de(g,d,c))},u=()=>{r.removeEventListener("pointermove",p),r.removeEventListener("pointerup",u),r.removeEventListener("pointercancel",u),this.moving=!1,e.preview(void 0);let f=h;Math.abs(f-n.at[2])>=.005&&e.apply(c=>de(c,d,f))};r.addEventListener("pointermove",p),r.addEventListener("pointerup",u),r.addEventListener("pointercancel",u)}pill(e){let t=this.picks(e);if(t.length>1&&!this.moving)return this.groupPill(e,t);let n=this.picked(e);if(n===void 0||this.moving)return v;let o=n.id,i=n.entityId.startsWith("light."),a=Y(e.floor,n)!==void 0;return m`<span class="hme-pill-name">${B(n,e.hass)}</span>
      ${Mn(n.entityId)&&e.hass!==void 0?m`<button type="button" class="hme-tb" @click=${()=>this.toggle(e,n.entityId)}>${kn(n.entityId,e.hass.states)}</button>`:v}
      ${i?m`<button type="button" class="hme-tb" title="Every light on this floor at this light's height" @click=${()=>e.apply(r=>Vo(r,o))}>Same height for all lights</button>`:v}
      ${a?m`<button type="button" class="hme-tb" @click=${()=>e.apply(r=>Xo(r,o))}>Center in room</button>`:v}
      <button type="button" class="hme-tb danger" @click=${()=>e.apply(r=>gn(r,o),{select:null})}>Remove</button>`}groupPill(e,t){let n=t.map(d=>d.id),o=t[0],i=o.at[2],a=t.every(d=>Math.abs(d.at[2]-i)<.005),r=e.hass===void 0?void 0:bi(t.map(d=>d.entityId),e.hass.states);return m`<span class="hme-pill-name">${R(t.length,"device")}</span>
      ${r===void 0?v:m`<button type="button" class="hme-tb" @click=${()=>this.turn(e,t.map(d=>d.entityId),r.service)}>${r.words}</button>`}
      <button type="button" class="hme-tb" ?disabled=${a} title=${a?"They are all at one height":`Every picked device at ${B(o,e.hass)}'s height, ${i.toFixed(2)} m`}
        @click=${()=>e.apply(d=>Ce(d,n,i))}>Same height</button>
      <button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(e,n)}}>Remove</button>`}toggle(e,t){let n=e.hass;n!==void 0&&Xt(n,"homeassistant","toggle",{entity_id:t}).catch(o=>{e.note("err",`Could not turn it on or off: ${o instanceof Error?o.message:String(o)}`)})}turn(e,t,n){let o=e.hass;o!==void 0&&Xt(o,"homeassistant",n,{entity_id:[...t]}).catch(i=>{e.note("err",`Could not turn them ${n==="turn_on"?"on":"off"}: ${i instanceof Error?i.message:String(i)}`)})}inspector(e){let t=this.picks(e);if(t.length>1)return this.groupInspector(e,t);let n=this.picked(e);if(n===void 0)return v;let o=e.hass?.states,i=n.id,a=te(n.entityId,o),r=a.kind==="light"&&a.on,d=this.friendly(e,n.entityId),l=this.deviceClass(e,n.entityId),h=Ve(n.entityId,l,d),p=n.icon??h,f=Y(e.floor,n)?.height??2.5,c=b=>e.apply(y=>Ue(y,i,b,d)),w=qe(n)??zt;return m`
      <section class="hme-card hme-head">
        <span class="hme-pin-big ${r?"lit":""}" style=${r?`background:${w};box-shadow:0 0 24px ${w}80`:""}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${ye(p,r?"#3a2600":"#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${B(n,e.hass)}</strong>
          <span class="mono">${n.entityId}</span>
        </div>
        <span class="hme-state ${r?"lit":""}">${he(n.entityId,o)}</span>
      </section>

      ${H("On the map",m`
        ${O("Name",at({value:n.name??"",label:"Name on the map",placeholder:d??n.entityId,set:b=>c({name:b.trim()===""?null:b})}))}
        ${O("Icon",m`<button type="button" class="hme-in hme-icon-btn" aria-haspopup="true" aria-expanded=${this.iconsOpen?"true":"false"}
          @click=${()=>{this.iconsOpen=!this.iconsOpen,e.redraw()}}>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">${ye(p,"currentColor",24,2)}</svg>
          <span class="hme-grow">${$a(n,l,d)}</span><span class="hme-caret" aria-hidden="true">▾</span></button>`)}
        ${this.iconsOpen?this.iconMenu(e,n,h,c):v}
        ${O("Room",m`<span class="hme-in hme-ro">${ya(e.floor,n)}</span>`)}
        <div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
          ${V({label:"None",picture:Oe("none",w),on:n.reading==="none",click:()=>c({reading:"none"})})}
          ${V({label:"Pill",picture:Oe("pill",w),on:n.reading===void 0,title:"Its reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>c({reading:null})})}
          ${V({label:"Name",picture:Oe("name",w),on:n.reading==="name",click:()=>c({reading:"name"})})}
        </div></div>`)}

      ${H("Height",m`
        <div class="hme-r">
          <input class="hme-range" type="range" min="0" max=${f} step="0.05" .value=${N(String(n.at[2]))} aria-label="Height" style=${xe(n.at[2],0,f)}
            @input=${b=>{let y=Number(b.target.value);e.preview(P=>de(P,i,y))}}
            @change=${b=>{let y=Number(b.target.value);e.apply(P=>de(P,i,y))}} />
          ${I({label:"Height",value:n.at[2],unit:"m",min:0,max:100,width:"92px",set:b=>e.apply(y=>de(y,i,b))})}
        </div>
        <div class="hme-chips">${xn.map(([b,y])=>m`<button type="button" class="hme-chip sel ${Math.abs(n.at[2]-y)<.005?"on":""}"
          @click=${()=>e.apply(P=>de(P,i,y))}>${b} ${y}</button>`)}</div>
        <p class="hme-text dim">The model looks stand the pin at this height.</p>`)}

      ${n.entityId.startsWith("light.")?this.lightCard(e,n,a.kind==="light"&&a.on?a.brightness:void 0,c):v}

      ${this.tapCard(e,n,c)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>e.apply(b=>gn(b,i),{select:null})}>Remove from the map</button></div>`}iconMenu(e,t,n,o){let i=r=>{this.iconsOpen=!1,o({icon:r}),e.redraw()},a=(r,d,l,h)=>m`<button type="button" class="hme-icon-cell ${l?"on":""}"
      title=${d} aria-label=${d} aria-pressed=${l?"true":"false"} @click=${()=>i(h)}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">${ye(r,"currentColor",24,1.9)}</svg><span>${d}</span></button>`;return m`<div class="hme-icons" role="group" aria-label="Icon">
      ${a(n,"Auto",t.icon===void 0,null)}
      ${Zn.map(r=>a(r,Rt[r],t.icon===r,r))}
    </div>`}lightCard(e,t,n,o){let i=t.id,a=Xe(t,n),r=qe(t),d=(l,h,p)=>m`<button type="button" class="hme-chip sel ${h?"on":""}" aria-pressed=${h?"true":"false"} @click=${p}>${l}</button>`;return H("Light",m`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        <input class="hme-range" type="range" min=${Ae} max=${Math.max(Nn,a)} step="0.05" .value=${N(String(a))} aria-label="Glow size"
          style=${xe(a,Ae,Math.max(Nn,a))}
          @input=${l=>{let h=Number(l.target.value);e.preview(p=>Ue(p,i,{glow:h}))}}
          @change=${l=>o({glow:Number(l.target.value)})} />
        <span class="hme-val mono hme-w48">${a.toFixed(1)} m</span></div>
      <div class="hme-row-end indent">${d("By its brightness",t.glow===void 0,()=>o({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${d("Follow the light",t.glowColor===void 0,()=>o({glowColor:null}))}
        ${d("Warm",t.glowColor==="warm",()=>o({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${r!==void 0?"on":""}">${r===void 0?v:m`<span class="hme-swatch" style=${`background:${r}`}></span>`}Pick
          <input type="color" .value=${N(r??"#ffb648")} aria-label="Pick the glow's color"
            @change=${l=>o({glowColor:l.target.value})} /></label>
      </div></div>
      ${Fi(t.glowSpill===!0?"off":"on",l=>o({glowSpill:l?null:!0}))}
      ${G("The pool of light round this light on the plan and the tiles. Warm is the lamplight every light has without a color of its own.")}`)}groupInspector(e,t){let n=e.hass?.states,o=t.map(p=>p.id),i=p=>{e.apply(u=>vn(u,o,p))||e.note("warn","That could not be set on every picked device.")},a=Math.max(2.5,...t.map(p=>Y(e.floor,p)?.height??2.5)),r=$e(t.map(p=>p.at[2])),d=$e(t.map(p=>p.reading)),l=t.every(p=>p.entityId.startsWith("light.")),h=zt;return m`
      <section class="hme-card hme-head">
        <span class="hme-pin-big"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${ye("bulb","#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${R(t.length,"device")}</strong>
          <span>Shift, Cmd or Ctrl and a click adds or takes one away</span>
        </div>
      </section>

      ${H("Picked",m`${t.map(p=>m`<div class="hme-list-row hme-pick-row">
          <button type="button" class="hme-grow hme-link" title="Pick this one alone" @click=${()=>e.select({kind:"pin",pinId:p.id})}>${B(p,e.hass)}</button>
          <span class="hme-val">${he(p.entityId,n)}</span>
          <button type="button" class="hme-x" aria-label=${`Leave ${B(p,e.hass)} out of the pick`} title="Leave it out of the pick"
            @click=${()=>e.select(Je(e.selection,p.id))}>×</button></div>`)}`,String(t.length))}

      ${H("On the map",m`
        <div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
          ${V({label:"None",picture:Oe("none",h),on:!d.mixed&&d.value==="none",click:()=>i({reading:"none"})})}
          ${V({label:"Pill",picture:Oe("pill",h),on:!d.mixed&&d.value===void 0,title:"Each one's reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>i({reading:null})})}
          ${V({label:"Name",picture:Oe("name",h),on:!d.mixed&&d.value==="name",click:()=>i({reading:"name"})})}
        </div></div>
        ${d.mixed?G("Mixed: they show different things. Pick one to set them all."):v}`)}

      ${H("Height",m`
        <div class="hme-r">
          ${Li({label:"Height",value:r.mixed?void 0:r.value,min:0,max:a,step:.05,preview:p=>e.preview(u=>Ce(u,o,p)),set:p=>e.apply(u=>Ce(u,o,p))})}
          ${I({label:"Height",value:r.mixed?void 0:r.value,unit:"m",min:0,max:100,width:"92px",set:p=>e.apply(u=>Ce(u,o,p))})}
        </div>
        <div class="hme-chips">${xn.map(([p,u])=>m`<button type="button" class="hme-chip sel ${t.every(f=>Math.abs(f.at[2]-u)<.005)?"on":""}"
          @click=${()=>e.apply(f=>Ce(f,o,u))}>${p} ${u}</button>`)}</div>
        <p class="hme-text dim">Every picked device at this height.</p>`)}

      ${l?this.groupLightCard(e,t,i):v}

      ${this.groupTapCard(e,t,i)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(e,o)}}>Remove ${R(t.length,"device")} from the map</button></div>`}groupLightCard(e,t,n){let o=t.map(c=>c.id),i=this.states(e),a=t.map(c=>{let g=te(c.entityId,i);return Math.round(Xe(c,g.kind==="light"&&g.on?g.brightness:void 0)*20)/20}),r=$e(a),d=Math.max(Nn,...a),l=t.every(c=>c.glow===void 0),h=$e(t.map(c=>c.glowColor?.toLowerCase())),p=$e(t.map(c=>c.glowSpill===!0)),u=h.mixed||h.value===void 0||h.value==="warm"?void 0:h.value,f=(c,g,w)=>m`<button type="button" class="hme-chip sel ${g?"on":""}" aria-pressed=${g?"true":"false"} @click=${w}>${c}</button>`;return H("Light",m`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        ${Li({label:"Glow size",value:r.mixed?void 0:r.value,min:Ae,max:d,step:.05,preview:c=>e.preview(g=>vn(g,o,{glow:c})),set:c=>n({glow:c})})}
        <span class="hme-val mono hme-w48">${r.mixed?"Mixed":`${r.value.toFixed(1)} m`}</span></div>
      <div class="hme-row-end indent">${f("By its brightness",l,()=>n({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${f("Follow the light",!h.mixed&&h.value===void 0,()=>n({glowColor:null}))}
        ${f("Warm",!h.mixed&&h.value==="warm",()=>n({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${u!==void 0?"on":""}">${u===void 0?v:m`<span class="hme-swatch" style=${`background:${u}`}></span>`}Pick
          <input type="color" .value=${N(u??"#ffb648")} aria-label="Pick the glow's color for every picked light"
            @change=${c=>n({glowColor:c.target.value})} /></label>
      </div></div>
      ${h.mixed?G("Mixed: their colors differ. Pick one to set them all."):v}
      ${Fi(p.mixed?"mixed":p.value?"off":"on",c=>n({glowSpill:c?null:!0}))}`)}groupTapCard(e,t,n){let o=$e(t.map(l=>[l.tap,l.tap==="page"?l.pageId?.toLowerCase():void 0])),i=o.mixed?void 0:o.value,a=i?.[0]==="page"||this.pickPage,r=i?.[0]==="page"?t[0].pageId:void 0,d=l=>{if(l==="page"){e.pages.length===1?n({tap:"page",pageId:e.pages[0].id}):(this.pickPage=!0,e.redraw());return}this.pickPage=!1,n({tap:l??null})};return H("Tap on the map",m`
      <div class="hme-chips">${Hn.map(([l,h])=>{let p=l==="page"?a:!this.pickPage&&i!==void 0&&i[0]===l;return m`<button type="button" class="hme-chip sel ${p?"on":""}" aria-pressed=${p?"true":"false"}
          ?disabled=${l==="page"&&e.pages.length===0} title=${l==="page"&&e.pages.length===0?"Your library has no pages":""}
          @click=${()=>d(l)}>${h}</button>`})}</div>
      ${a?O("Page",Me({label:"Page",value:r??"",options:[...r===void 0?[{value:"",label:"Pick a page\u2026",disabled:!0}]:[],...r===void 0||e.pages.some(l=>k(l.id,r))?[]:[{value:r,label:"A page not in your library",disabled:!0}],...e.pages.map(l=>({value:l.id,label:l.name}))],set:l=>{this.pickPage=!1,l!==""&&n({tap:"page",pageId:l})}})):v}
      <p class="hme-text dim">${o.mixed&&!this.pickPage?"Mixed: a tap does different things on them. Pick one to set them all.":"Set on every picked device."}</p>`)}tapCard(e,t,n){let o=t.tap==="page"||this.pickPage,i=t.pageId===void 0||e.pages.some(r=>k(r.id,t.pageId)),a=r=>{if(r==="page"){if(t.tap==="page")return;e.pages.length===1?n({tap:"page",pageId:e.pages[0].id}):(this.pickPage=!0,e.redraw());return}this.pickPage=!1,n({tap:r??null})};return H("Tap on the map",m`
      <div class="hme-chips">${Hn.map(([r,d])=>{let l=r==="page"?o:!this.pickPage&&t.tap===r;return m`<button type="button" class="hme-chip sel ${l?"on":""}" aria-pressed=${l?"true":"false"}
          ?disabled=${r==="page"&&e.pages.length===0} title=${r==="page"&&e.pages.length===0?"Your library has no pages":""}
          @click=${()=>a(r)}>${d}</button>`})}</div>
      ${o?O("Page",Me({label:"Page",value:t.tap==="page"?t.pageId??"":"",options:[...t.tap==="page"?[]:[{value:"",label:"Pick a page\u2026",disabled:!0}],...i?[]:[{value:t.pageId,label:"A page not in your library",disabled:!0}],...e.pages.map(r=>({value:r.id,label:r.name}))],set:r=>{this.pickPage=!1,r!==""&&n({tap:"page",pageId:r})}})):v}
      <p class="hme-text dim">${t.tap===void 0&&!this.pickPage?"As the tile does: a light toggles, anything else opens its control.":"Hold on the watch or iPhone: its controls."}</p>`)}};function Fi(s,e){let t=s==="on"?"walls stop the glow":s==="off"?"the glow spreads past the walls":"some stay in, some spread";return m`<div class="hme-r"><span class="hme-l">Stay in room</span>
    ${s==="mixed"?m`<button type="button" class="hme-chip off" aria-pressed="mixed" aria-label="Stay in room" @click=${()=>e(!0)}>Mixed</button>`:rt({on:s==="on",onText:"On",offText:"Off",label:"Stay in room",click:()=>e(s!=="on")})}
    <span class="hme-text dim">${t}</span></div>`}function Li(s){let e=s.value??(s.min+s.max)/2;return m`<input class="hme-range ${s.value===void 0?"mixed":""}" type="range" min=${s.min} max=${s.max} step=${s.step} .value=${N(String(e))}
    aria-label=${s.label} aria-valuetext=${s.value===void 0?"Mixed":v} style=${s.value===void 0?"--p:0%":xe(s.value,s.min,s.max)}
    @input=${t=>{let n=t.target;n.classList.remove("mixed"),s.preview(Number(n.value))}}
    @change=${t=>s.set(Number(t.target.value))} />`}function Oe(s,e){return m`<svg width="62" height="44" viewBox="0 0 62 44" aria-hidden="true">
    <circle cx="31" cy=${s==="none"?20:16} r="9" fill=${e} />
    ${s==="pill"?$`<rect x="17" y="29" width="28" height="11" rx="5.5" fill="rgba(0,0,0,0.7)" stroke="#3a3a3c" /><text x="31" y="37.5" font-size="8" fill="#fff" text-anchor="middle">21.5°</text>`:v}
    ${s==="name"?$`<text x="31" y="38" font-size="8" fill="#fff" text-anchor="middle">Name</text>`:v}
  </svg>`}var Wn=[{id:"select",label:"Corners and walls",key:"v"},{id:"split",label:"Split the room",key:"s"},{id:"inner",label:"Inner wall",key:"w"},{id:"door",label:"Door",key:"d"},{id:"window",label:"Window",key:"n"},{id:"opening",label:"Way through (no door)",key:"o"},{id:"stairs",label:"Stairs",key:"t"}];function Bi(s){return Ea[s]}function Ma(s){return Wn.find(e=>e.key===s.toLowerCase())?.id}var ka=[{label:"Door",kind:"door"},{label:"Double door",kind:"door",style:"double"},{label:"Sliding door",kind:"door",style:"sliding"},{label:"Window",kind:"window"},{label:"Sliding window",kind:"window",style:"sliding"},{label:"Way through",kind:"opening"}],xa=["zero","one","two","three","four","five","six","seven","eight","nine","ten"];function Ha(s){return s===2?"Fix both":`Fix all ${xa[s]??s}`}var Pa=9,zi=18,jn="#4fd6c2",Ni="Draw each room faint and dashed as the iPhone scanned it, or as first seen for a room scanned before scans were kept. A room drawn here has none.",ji="Put this room's walls, doors, windows and furniture back as the iPhone scanned it. Its devices stay where they are.",M=s=>s.toFixed(1),fe=s=>`${s[0].toFixed(1)},${s[1].toFixed(1)}`,Ki=new WeakMap;function jt(s){let e=Ki.get(s);return e===void 0&&Ki.set(s,e=Wo(s)),e}function Kn(s,e,t,n){if(s.walls!==void 0&&n===void 0)return;let o=t/s.view.scale,i=r=>{let d;for(let l of r)for(let[h,p]of K(l).entries()){let u=uo(e,p);u<=o&&(d===void 0||u<d.d)&&(d={room:l,wall:h,seg:p,d:u})}return d},a=n===void 0?void 0:i([n]);return s.walls!==void 0?a:a??i(s.floor.rooms)}function Wi(s,e){let t=Math.max(re(e),1e-9),n=[-(e.b[1]-e.a[1])/t,(e.b[0]-e.a[0])/t],o=[(e.a[0]+e.b[0])/2,(e.a[1]+e.b[1])/2],i=q(s)??ee(s);return(i[0]-o[0])*n[0]+(i[1]-o[1])*n[1]>0&&(n=[-n[0],-n[1]]),n}var Kt=class{constructor(){this.tool="select";this.dragging=!1}setTool(e,t){this.first=void 0,this.tool=t,e.redraw()}get armed(){return this.tool!=="select"}focus(e){let t=e.walls??st(e.selection);return t===void 0?void 0:e.floor.rooms.find(n=>k(n.id,t))}roomAt(e,t){let n=U(e.floor,t);return e.walls===void 0||n!==void 0&&k(n.id,e.walls)?n:void 0}placed(e,t,n){this.setTool(e,"select"),e.editWalls(t,n)}pickedWall(e,t){let n=e.selection;if(!(t===void 0||n===void 0)){if(n.kind==="wall")return n.wall;if(n.kind==="opening"){let o=t.openings[n.opening],i=o===void 0?-1:Te(t,o);return i>=0?i:void 0}}}rail(e){let t=this.focus(e);return m`${t===void 0?v:this.wallsCard(e,t)}
      ${this.checkCard(e)}
      ${t===void 0?v:this.scanCard(e,t)}`}wallsCard(e,t){let n=K(t),o=e.selection,i=t.id,a=Ci(t),r=t.openings.map((l,h)=>({o:l,i:h})).filter(({o:l})=>Te(t,l)<0),d=({o:l,i:h})=>{let p=o?.kind==="opening"&&o.opening===h;return m`<button type="button" class="hme-lay sub ${p?"on":""}" aria-pressed=${p?"true":"false"}
        @click=${()=>e.select({kind:"opening",roomId:i,opening:h})}>${me(l)}<span class="n">${et(Math.hypot(l.b[0]-l.a[0],l.b[1]-l.a[1]))}</span></button>`};return m`<section class="hme-card hme-layers">
      <div class="hme-h">${C(t)}<span class="hme-h-end">${R(n.length,"wall")}</span></div>
      ${n.map((l,h)=>{let p=o?.kind==="wall"&&o.wall===h;return m`<button type="button" class="hme-lay ${p?"on":""}" aria-pressed=${p?"true":"false"}
            @click=${()=>e.select({kind:"wall",roomId:i,wall:h})}>${a[h]}<span class="n">${et(re(l))}</span></button>
          ${t.openings.map((u,f)=>({o:u,i:f})).filter(({o:u})=>Te(t,u)===h).map(d)}`})}
      ${r.length===0?v:m`<div class="hme-lay dim">In no wall</div>${r.map(d)}`}
    </section>`}scanCard(e,t){if(e.scans===void 0)return v;let n=t.id,o=qt(e.scans,n),i=o!==void 0&&un(t,o)?o:void 0;return H("Show scan as it was",m`<div class="hme-row-end">
      <button type="button" class="hme-tb ${e.toggles.scan?"on":""}" aria-pressed=${e.toggles.scan?"true":"false"} title=${Ni}
        @click=${()=>e.setToggle("scan",!e.toggles.scan)}>${e.toggles.scan?"On":"Off"}</button>
      <button type="button" class="hme-tb" ?disabled=${i===void 0} title=${i===void 0?"This room is as the iPhone scanned it, or was drawn here":ji}
        @click=${()=>{i!==void 0&&e.apply(a=>cn(a,n,i))}}>Back to the scan</button>
    </div>`)}checkCard(e){let t=jt(e.floor),n=e.floor.id;return m`
      ${H("Scan check",m`
        ${t.length===0?m`<p class="hme-text dim">Nothing to fix. The walls meet and every room has a way in.</p>`:v}
        ${t.map(o=>m`<div class="hme-fix">
          <span class="hme-fix-dot ${o.kind==="missingDoor"?"gray":""}"></span>
          <p @click=${()=>e.select({kind:"room",roomId:o.roomIds[0]})}><b>${o.title}</b> ${o.detail}</p>
          <button type="button" class="hme-tb" @click=${()=>e.apply(i=>o.fix(i))}>${o.fixLabel}</button></div>`)}
        ${t.length>1?m`<button type="button" class="hme-tb hme-wide" @click=${()=>e.apply(o=>Bo(o,n))}>${Ha(t.length)}</button>`:v}`,t.length===0?void 0:m`<span class="hme-amber">${t.length} to fix</span>`)}`}overlay(e){let t=this.focus(e),n=[];if(t!==void 0&&t.outline.length>=3){let o=t.outline.map(i=>fe(e.toScreen(i))).join("L");n.push($`<path d=${`M0 0H${e.stage.width}V${e.stage.height}H0ZM${o}Z`} fill="rgba(0,0,0,0.45)" fill-rule="evenodd" pointer-events="none" />`)}return e.toggles.scan&&n.push(...this.scanMarks(e)),n.push(...this.issueMarks(e)),t!==void 0&&n.push(this.roomHandles(e,t)),n.push(...this.ghost(e)),$`${n}`}scanMarks(e){return Go(e.floor,e.scans).map(t=>{let n=t.outline.map(i=>fe(e.toScreen(i))).join("L"),o=t.walls.map(i=>`M${fe(e.toScreen(i.a))}L${fe(e.toScreen(i.b))}`).join("");return $`<g class="hme-scan" data-room=${t.roomId} pointer-events="none">
        <path d=${`M${n}Z`} fill=${jn} fill-opacity="0.06" stroke="none" />
        <path d=${o} fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="3.5" stroke-dasharray="7 5" />
        <path d=${o} fill="none" stroke=${jn} stroke-width="1.6" stroke-dasharray="7 5" stroke-opacity="0.9" />
        ${t.openings.map(i=>{let a=e.toScreen(i.a),r=e.toScreen(i.b);return $`<line x1=${M(a[0])} y1=${M(a[1])} x2=${M(r[0])} y2=${M(r[1])} stroke=${jn} stroke-width="4" stroke-opacity="0.85"
            stroke-dasharray=${i.kind==="window"?"2 3":"none"} />`})}
      </g>`})}issueMarks(e){return jt(e.floor).map(t=>{let[n,o]=e.toScreen(t.where);if(t.kind==="offSquare"){let l=/(\d+)°/.exec(t.title)?.[1]??"";return $`<g class="hme-issue" data-hme=${`issue:${t.id}`} style="cursor:pointer"><title>${t.title} Click to square it.</title>
          <circle cx=${M(n)} cy=${M(o)} r="9" fill="#ffb340" stroke="#fff" stroke-width="2" />
          <g class="hme-tag"><rect x=${M(n+12)} y=${M(o+6)} width="44" height="20" rx="10" fill="#ffb340" />
          <text x=${M(n+34)} y=${M(o+20)} fill="#2a1a00" text-anchor="middle">${l}°</text></g></g>`}let i=`${Math.round(t.amount*100)} cm`,a=t.kind==="overlap"?`Overlap ${i} \xB7 ${t.fixLabel}`:t.kind==="gap"?`Gap ${i} \xB7 ${t.fixLabel}`:`No door \xB7 ${t.fixLabel}`,r=a.length*6.2+18,d=t.kind==="missingDoor";return $`<g class="hme-issue" data-hme=${`issue:${t.id}`} style="cursor:pointer"><title>${t.title} ${t.detail}</title>
        <circle cx=${M(n)} cy=${M(o)} r="4" fill=${d?"#8e8e93":"#ffb340"} />
        <g class="hme-tag"><rect x=${M(n-r/2)} y=${M(o+8)} width=${M(r)} height="20" rx="10" fill=${d?"#8e8e93":"#ffb340"} />
        <text x=${M(n)} y=${M(o+22)} fill=${d?"#fff":"#2a1a00"} text-anchor="middle">${a}</text></g></g>`})}roomHandles(e,t){let n=K(t),o=e.selection,i=this.pickedWall(e,t),a=[];if(i!==void 0&&n[i]!==void 0){let d=n[i],l=e.toScreen(d.a),h=e.toScreen(d.b),p=Wi(t,d);if(a.push($`<line x1=${M(l[0])} y1=${M(l[1])} x2=${M(h[0])} y2=${M(h[1])} stroke="#5b8def" stroke-width="9" stroke-linecap="round" pointer-events="none" />`),o?.kind==="wall"&&!this.dragging){let u=[(l[0]+h[0])/2+p[0]*22,(l[1]+h[1])/2+p[1]*22];a.push($`<g class="hme-tag" pointer-events="none"><rect x=${M(u[0]-27)} y=${M(u[1]-9)} width="54" height="18" rx="9" fill="#5b8def" />
          <text x=${M(u[0])} y=${M(u[1]+4)} fill="#fff" text-anchor="middle">${re(d).toFixed(2)} m</text></g>`)}}for(let[d,l]of t.openings.entries()){let h=e.toScreen(l.a),p=e.toScreen(l.b),u=o?.kind==="opening"&&o.opening===d,f=l.kind==="window"?"#8bb8f0":l.kind==="door"?"#ece6da":"#98989d";a.push($`<g data-hme=${`opening:${d}`} style="cursor:ew-resize">
        <line x1=${M(h[0])} y1=${M(h[1])} x2=${M(p[0])} y2=${M(p[1])} stroke=${u?"#5b8def":"rgba(14,14,16,0.9)"} stroke-width="12" stroke-linecap="round" />
        <line x1=${M(h[0])} y1=${M(h[1])} x2=${M(p[0])} y2=${M(p[1])} stroke=${f} stroke-width="3" />
        ${u?$`<circle cx=${M(h[0])} cy=${M(h[1])} r="5" fill="#fff" stroke="#5b8def" stroke-width="2" /><circle cx=${M(p[0])} cy=${M(p[1])} r="5" fill="#fff" stroke="#5b8def" stroke-width="2" />`:v}
      </g>`)}let r=this.sliding!==void 0&&k(this.sliding.roomId,t.id)?this.sliding.index:o?.kind==="opening"?o.opening:void 0;if(r!==void 0&&t.openings[r]!==void 0&&a.push(this.distances(e,t,t.openings[r])),!this.dragging||this.sliding===void 0){if(this.tool==="select")for(let[d,l]of n.entries()){if(re(l)*e.view.scale<40)continue;let h=e.toScreen([(l.a[0]+l.b[0])/2,(l.a[1]+l.b[1])/2]);a.push($`<circle data-hme=${`mid:${d}`} cx=${M(h[0])} cy=${M(h[1])} r="5" fill="#0e0e10" stroke="#5b8def" stroke-width="1.5" style="cursor:copy"><title>Drag to add a corner</title></circle>`)}for(let[d,l]of t.outline.entries()){let[h,p]=e.toScreen(l),u=o?.kind==="corner"&&o.corner===d;a.push($`<circle data-hme=${`corner:${d}`} cx=${M(h)} cy=${M(p)} r="7" fill=${u?"#5b8def":"#fff"} stroke=${u?"#fff":"#5b8def"} stroke-width="2" style="cursor:move" />`)}}return $`<g class="hme-handles">${a}</g>`}distances(e,t,n){let o=Te(t,n),i=o>=0?K(t)[o]:void 0;if(i===void 0)return $``;let a=re(i),r=ve(n.a,i.a,i.b).along,d=ve(n.b,i.a,i.b).along,l=Math.max(0,Math.min(r,d)),h=Math.min(a,Math.max(r,d)),p=Wi(t,i),u=[(i.b[0]-i.a[0])/a,(i.b[1]-i.a[1])/a],f=b=>{let y=e.toScreen([i.a[0]+u[0]*b,i.a[1]+u[1]*b]);return[y[0]+p[0]*26,y[1]+p[1]*26]},c=[0,l,h,a],g=b=>`M${fe([b[0]-p[0]*5,b[1]-p[1]*5])}L${fe([b[0]+p[0]*5,b[1]+p[1]*5])}`,w=[[0,l,!1],[l,h,!0],[h,a,!1]];return $`<g class="hme-dist" pointer-events="none">
      <path d=${`M${fe(f(0))}L${fe(f(a))}${c.map(b=>g(f(b))).join("")}`} stroke="#98989d" stroke-width="1" fill="none" />
      ${w.filter(([b,y])=>y-b>.02).map(([b,y,P])=>{let E=f((b+y)/2);return $`<g class="hme-tag"><rect x=${M(E[0]-25)} y=${M(E[1]-9)} width="50" height="18" rx="9" fill=${P?"#5b8def":"#2c2c2e"} />
          <text x=${M(E[0])} y=${M(E[1]+4)} fill="#fff" text-anchor="middle">${(y-b).toFixed(2)} m</text></g>`})}
    </g>`}ghost(e){let t=this.hoverAt;if(t===void 0)return[];let n=[];if(this.tool==="door"||this.tool==="window"||this.tool==="opening"){let o=Kn(e,t,zi,this.focus(e));if(o!==void 0){let i=this.tool==="window"?1.2:.9,a=re(o.seg),r=Math.min(i,a),d=Math.min(Math.max(ve(t,o.seg.a,o.seg.b).along,r/2),a-r/2),l=[(o.seg.b[0]-o.seg.a[0])/a,(o.seg.b[1]-o.seg.a[1])/a],h=e.toScreen([o.seg.a[0]+l[0]*(d-r/2),o.seg.a[1]+l[1]*(d-r/2)]),p=e.toScreen([o.seg.a[0]+l[0]*(d+r/2),o.seg.a[1]+l[1]*(d+r/2)]);n.push($`<line x1=${M(h[0])} y1=${M(h[1])} x2=${M(p[0])} y2=${M(p[1])} stroke="#5b8def" stroke-width="10" stroke-opacity="0.6" stroke-linecap="round" pointer-events="none" />`)}}if(this.tool==="stairs"&&this.roomAt(e,t)!==void 0){let[o,i]=e.toScreen(t),a=e.px(1),r=e.px(2.6);n.push($`<g pointer-events="none" opacity="0.7"><rect x=${M(o-a/2)} y=${M(i-r/2)} width=${M(a)} height=${M(r)} fill="none" stroke="#5b8def" stroke-width="1.5" stroke-dasharray="4 3" />
        ${[1,2,3,4,5,6,7].map(d=>$`<line x1=${M(o-a/2)} x2=${M(o+a/2)} y1=${M(i-r/2+r*d/8)} y2=${M(i-r/2+r*d/8)} stroke="#5b8def" stroke-width="1" />`)}</g>`)}if((this.tool==="split"||this.tool==="inner")&&this.first!==void 0){let o=e.toScreen(this.first.a),i=e.toScreen(this.snap(e,t,this.first.a));if(this.tool==="split"){let a=Math.max(Math.hypot(i[0]-o[0],i[1]-o[1]),1e-6),r=[(i[0]-o[0])/a,(i[1]-o[1])/a],d=Math.hypot(e.stage.width,e.stage.height);n.push($`<line x1=${M(o[0]-r[0]*d)} y1=${M(o[1]-r[1]*d)} x2=${M(o[0]+r[0]*d)} y2=${M(o[1]+r[1]*d)} stroke="#5b8def" stroke-width="1.5" stroke-dasharray="6 4" pointer-events="none" />`)}else n.push($`<line x1=${M(o[0])} y1=${M(o[1])} x2=${M(i[0])} y2=${M(i[1])} stroke="#ece6da" stroke-width=${M(Math.max(e.px(.1),3))} stroke-opacity="0.8" pointer-events="none" />`);n.push($`<circle cx=${M(o[0])} cy=${M(o[1])} r="5" fill="#5b8def" pointer-events="none" />`)}return n}snap(e,t,n){return Fn(e.floor,t,e.view.scale,{...n===void 0?{}:{from:n},...e.toggles.grid?{grid:ce}:{}})}pointerDown(e,t,n){if(t.button!==0)return!1;switch(this.tool){case"door":case"window":case"opening":{let o=Kn(e,n,zi,this.focus(e));if(o===void 0)return!1;let i=this.tool,a=o.room.id,r={kind:"opening",roomId:a,opening:o.room.openings.length},d=o.wall;return e.apply(l=>Ht(l,a,d,{kind:i,at:n}),{select:r})&&this.placed(e,a,r),!0}case"stairs":{let o=this.roomAt(e,n);if(o===void 0)return!1;let i=o.id,a={kind:"room",roomId:i};return e.apply(r=>Io(r,i,n),{select:a})&&this.placed(e,i,a),!0}case"split":case"inner":return this.twoPoints(e,n);default:return this.pick(e,t,n)}}twoPoints(e,t){if(this.first===void 0){let a=(e.walls===void 0?U(e.floor,t):void 0)??this.focus(e);return a===void 0?!1:(this.first={roomId:a.id,a:this.snap(e,t)},e.walls===void 0?e.select({kind:"room",roomId:a.id}):e.redraw(),!0)}let{roomId:n,a:o}=this.first,i=this.snap(e,t,o);if(this.first=void 0,Math.hypot(i[0]-o[0],i[1]-o[1])<.1)return e.redraw(),!0;if(this.tool==="inner"){let a=e.doc.floors.flatMap(d=>d.rooms).find(d=>k(d.id,n)),r={kind:"wall",roomId:n,wall:a===void 0?0:Qt(a).length};return e.apply(d=>jo(d,n,o,i),{select:r})?this.placed(e,n,r):e.note("err","An inner wall needs to be at least 10 cm long."),!0}return this.split(e,n,o,i),!0}async split(e,t,n,o){let i=e.floor.rooms.find(l=>k(l.id,t)),a=await e.ask({title:"Name the new room",label:"Name",value:i===void 0?"Room":`${C(i)} 2`,ok:"Split the room"});if(a===void 0)return;let r=e.newId(),d={kind:"room",roomId:r};e.apply(l=>Ko(l,t,n,o,r,a),{select:d})?(this.setTool(e,"select"),e.editWalls(void 0,d)):e.note("err","That line does not cut the room in two. Draw it right across the room.")}pick(e,t,n){let o=this.focus(e),i=t.target?.closest?.("[data-hme]")?.getAttribute("data-hme")??"",[a,r]=i.split(/:(.*)/s);if(a==="issue"){let p=jt(e.floor).find(u=>u.id===r);return p!==void 0&&e.apply(u=>p.fix(u)),!0}let d=Number(r);if(o!==void 0&&a==="corner"&&Number.isInteger(d))return this.cornerDrag(e,t,o,d),!0;if(o!==void 0&&a==="mid"&&Number.isInteger(d))return this.midDrag(e,t,o,d),!0;if(o!==void 0&&a==="opening"&&Number.isInteger(d))return this.openingDrag(e,t,o,d),!0;let l=Kn(e,n,Pa,o);if(l!==void 0)return this.wallAt=ve(n,l.seg.a,l.seg.b).point,e.select({kind:"wall",roomId:l.room.id,wall:l.wall}),!0;let h=U(e.floor,n);return e.walls!==void 0&&(h===void 0||!k(h.id,e.walls))?(e.editWalls(void 0),!0):h===void 0?!1:(e.select({kind:"room",roomId:h.id}),!0)}cornerTo(e,t,n,o){let i=e.floor.rooms.filter(d=>!k(d.id,t.id)).flatMap(d=>d.outline),a=10/e.view.scale;for(let d of i)if(Math.hypot(d[0]-o[0],d[1]-o[1])<=a)return[d[0],d[1]];let r=o;if(e.toggles.grid&&(r=[Math.round(r[0]/ce)*ce,Math.round(r[1]/ce)*ce]),e.toggles.square){let d=go(e.floor.rooms.flatMap(w=>Qt(w))),l=Math.cos(d),h=Math.sin(d),p=w=>[w[0]*l+w[1]*h,-w[0]*h+w[1]*l],[u,f]=p(r),c=t.outline.length,g=8/e.view.scale;for(let w of[(n+c-1)%c,(n+1)%c]){let[b,y]=p(t.outline[w]);Math.abs(u-b)<=g&&(u=b),Math.abs(f-y)<=g&&(f=y)}r=[u*l-f*h,u*h+f*l]}return r}cornerDrag(e,t,n,o){let i=n.id,a;e.drag(t,{move:r=>{this.dragging=!0;let d=this.cornerTo(e,n,o,r);a=d,e.preview(l=>Se(l,i,o,d))},end:(r,d,l)=>{this.dragging=!1,e.preview(void 0);let h=a,p={kind:"corner",roomId:i,corner:o};l&&h!==void 0?e.apply(u=>Se(u,i,o,h),{select:p}):e.select(p)},cancel:()=>this.stopDrag(e)})}midDrag(e,t,n,o){let i=n.id,a=K(n)[o],r=kt(e.doc,i,o),d=r?.floors.flatMap(f=>f.rooms).find(f=>k(f.id,i));if(a===void 0||r===void 0||d===void 0)return;let l=[(a.a[0]+a.b[0])/2,(a.a[1]+a.b[1])/2],h=d.outline.reduce((f,c,g)=>Math.hypot(c[0]-l[0],c[1]-l[1])<Math.hypot(d.outline[f][0]-l[0],d.outline[f][1]-l[1])?g:f,0),p=f=>c=>{let g=kt(c,i,o);return g===void 0||f===void 0?g:Se(g,i,h,f)},u;e.drag(t,{move:f=>{this.dragging=!0,u=this.cornerTo(e,d,h,f),e.preview(p(u))},end:(f,c,g)=>{this.dragging=!1,e.preview(void 0),e.apply(p(g?u:void 0),{select:{kind:"corner",roomId:i,corner:h}})},cancel:()=>this.stopDrag(e)})}openingDrag(e,t,n,o){let i=n.id,a=n.openings[o];if(a===void 0)return;let r={kind:"opening",roomId:i,opening:o},d=[(a.a[0]+a.b[0])/2,(a.a[1]+a.b[1])/2],l,h;e.select(r),e.drag(t,{move:p=>{l??=p,this.dragging=!0,this.sliding={roomId:i,index:o};let u=[d[0]+p[0]-l[0],d[1]+p[1]-l[1]];h=u,e.preview(f=>mn(f,i,o,u))},end:(p,u,f)=>{this.dragging=!1,this.sliding=void 0,e.preview(void 0);let c=h;f&&c!==void 0&&e.apply(g=>mn(g,i,o,c),{select:r})},cancel:()=>this.stopDrag(e)})}stopDrag(e){this.dragging=!1,this.sliding=void 0,e.preview(void 0)}hover(e,t){this.tool!=="select"&&(this.hoverAt=t,e.redraw())}keyDown(e,t){let n=Z(t,!1);if(typeof n=="object"&&"letter"in n){let o=Ma(n.letter);return o===void 0?!1:(this.setTool(e,o),!0)}if(n==="cancel"&&(this.tool!=="select"||this.first!==void 0))return this.setTool(e,"select"),!0;if(n==="delete"){let o=e.selection;if(o?.kind==="corner")e.apply(i=>xt(i,o.roomId,o.corner),{select:{kind:"room",roomId:o.roomId}});else if(o?.kind==="opening")e.apply(i=>Pt(i,o.roomId,o.opening),{select:{kind:"room",roomId:o.roomId}});else if(o?.kind==="wall")e.apply(i=>hn(i,o.roomId,o.wall),{select:{kind:"room",roomId:o.roomId}});else return!1;return!0}return!1}cursor(){return this.tool==="select"?void 0:"crosshair"}leave(e){this.first=void 0,this.hoverAt=void 0,this.dragging=!1,this.sliding=void 0,this.tool="select",e.redraw()}dock(e){return m`<button type="button" class="hme-tb ${e.toggles.square?"on":""}" aria-pressed=${e.toggles.square?"true":"false"}
        title="A dragged corner lines up with the corners beside it" @click=${()=>e.setToggle("square",!e.toggles.square)}>Snap to 90°</button>
      <button type="button" class="hme-tb ${e.toggles.grid?"on":""}" aria-pressed=${e.toggles.grid?"true":"false"}
        @click=${()=>e.setToggle("grid",!e.toggles.grid)}>Grid 5 cm</button>
      ${e.scans===void 0?v:m`<button type="button" class="hme-tb ${e.toggles.scan?"on":""}" aria-pressed=${e.toggles.scan?"true":"false"}
        title=${Ni} @click=${()=>e.setToggle("scan",!e.toggles.scan)}>Show scan as it was</button>`}`}pill(e){if(this.tool!=="select"){let a={split:this.first===void 0?"Click where the cut starts":"Click where it ends, across the room",inner:this.first===void 0?"Click where the wall starts":"Click where it ends",door:"Click a wall to put a door in it",window:"Click a wall to put a window in it",opening:"Click a wall to open a way through it",stairs:"Click in the room to put stairs there"};return m`<span class="hme-pill-name">${a[this.tool]}</span>
        <button type="button" class="hme-tb" @click=${()=>this.setTool(e,"select")}>Cancel</button>`}let t=this.focus(e),n=e.selection;if(t===void 0||n===void 0||this.dragging)return v;let o=t.id,i=C(t);if(n.kind==="wall"){let a=n.wall,r=this.wallAt,d=In(t,a,i).replace(", "," \xB7 ");return m`<span class="hme-pill-name">${d}</span>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(e,t,a,"window",r)}>＋ Window here</button>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(e,t,a,"door",r)}>＋ Door here</button>
        <button type="button" class="hme-tb" @click=${()=>this.cornerHere(e,t,a,r)}>Add a corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(l=>pn(l,o,a))}>Straighten</button>`}if(n.kind==="corner")return m`<span class="hme-pill-name">${i} · corner</span>
        <button type="button" class="hme-tb" ?disabled=${t.outline.length<=3} @click=${()=>e.apply(a=>xt(a,o,n.corner),{select:{kind:"room",roomId:o}})}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(a=>se(a,o))}>Square the corners</button>`;if(n.kind==="opening"){let a=t.openings[n.opening];return a===void 0?v:m`<span class="hme-pill-name">${me(a)}</span>
        <button type="button" class="hme-tb danger" @click=${()=>e.apply(r=>Pt(r,o,n.opening),{select:{kind:"room",roomId:o}})}>Remove</button>`}return m`<span class="hme-pill-name">${i}</span>
      <button type="button" class="hme-tb" @click=${()=>e.apply(a=>se(a,o))}>Square the corners</button>`}addHere(e,t,n,o,i){let a=t.id,r=t.openings.length;e.apply(d=>Ht(d,a,n,{kind:o,...i===void 0?{}:{at:i}}),{select:{kind:"opening",roomId:a,opening:r}})}cornerHere(e,t,n,o){let i=t.id,a=p=>kt(p,i,n,o),r=a(e.doc)?.floors.flatMap(p=>p.rooms).find(p=>k(p.id,i)),d=K(t)[n],l=o??(d===void 0?void 0:[(d.a[0]+d.b[0])/2,(d.a[1]+d.b[1])/2]),h=r===void 0||l===void 0?-1:r.outline.reduce((p,u,f)=>Math.hypot(u[0]-l[0],u[1]-l[1])<Math.hypot(r.outline[p][0]-l[0],r.outline[p][1]-l[1])?f:p,0);e.apply(a,{select:h<0?{kind:"room",roomId:i}:{kind:"corner",roomId:i,corner:h}})}inspector(e){let t=this.focus(e),n=e.selection;if(t===void 0||n===void 0){let p=jt(e.floor);return H("Shape",m`<p class="hme-text">Pick a room, then a wall or a corner. Drag a corner to move it; a corner two rooms share moves for both.</p>
        <p class="hme-text dim">${p.length===0?"The scan check found nothing to fix on this floor.":`The scan check found ${R(p.length,"thing")} to fix. They are marked in amber.`}</p>`)}let o=t.id;if(n.kind==="corner")return this.cornerCard(e,t,n.corner);let i=this.pickedWall(e,t);if(i===void 0){let p=qt(e.scans,o),u=p!==void 0&&un(t,p)?p:void 0;return H(C(t),m`
        ${O("Corners",m`<span class="hme-val">${t.outline.length}</span>`)}
        ${O("Walls",m`<span class="hme-val">${K(t).length}</span>`)}
        ${O("Wall height",I({label:"Wall height",value:t.height,unit:"m",min:.5,max:20,set:f=>e.apply(c=>Ke(c,o,f))}))}
        ${G("Click a wall to change it or put a door or window in it. Drag a corner to move it, or the dot in a wall's middle to add a corner.")}
        ${u===void 0?v:G("Its shape has changed since the iPhone scanned it.")}
        <div class="hme-row-end">
          ${u===void 0?v:m`<button type="button" class="hme-tb" title=${ji} @click=${()=>e.apply(f=>cn(f,o,u))}>Back to the scan</button>`}
          <button type="button" class="hme-tb" @click=${()=>e.apply(f=>se(f,o))}>Square the corners</button>
        </div>`)}let a=K(t)[i],r=t.openings.map((p,u)=>({o:p,i:u})).filter(({o:p})=>Te(t,p)===i),d=n.kind==="opening"?t.openings[n.opening]:void 0,l=re(a),h=p=>{let u=t.openings.length;e.apply(f=>Ht(f,o,i,{kind:p}),{select:{kind:"opening",roomId:o,opening:u}})};return m`
      ${H("Wall",m`
        ${O("Room",m`<span class="hme-val strong">${In(t,i,C(t))}</span>`)}
        ${O("Length",I({label:"Length",value:l,unit:"m",min:.1,max:200,set:p=>e.apply(u=>zo(u,o,i,p))}))}
        ${O("Thickness",I({label:"Thickness",value:a.t,unit:"m",min:.01,max:1,set:p=>e.apply(u=>No(u,o,i,p))}))}
        ${O("Height",I({label:"Wall height",value:t.height,unit:"m",min:.5,max:20,set:p=>e.apply(u=>Ke(u,o,p))}))}
        ${G("Type a length to move the far corner. Rooms that share the corner move with it.")}
        <div class="hme-row-end indent">
          <button type="button" class="hme-tb" @click=${()=>e.apply(p=>pn(p,o,i))}>Straighten</button>
          <button type="button" class="hme-tb" @click=${()=>e.apply(p=>se(p,o))}>Square the corners</button>
          <button type="button" class="hme-tb" @click=${()=>this.cornerHere(e,t,i,void 0)}>Split wall</button>
          <button type="button" class="hme-tb danger" title="Take this wall away" @click=${()=>e.apply(p=>hn(p,o,i),{select:{kind:"room",roomId:o}})}>Remove</button>
        </div>`)}
      ${H("On this wall",m`
        ${r.map(({o:p,i:u})=>{let f=ve(p.a,a.a,a.b).along,c=ve(p.b,a.a,a.b).along,g=n.kind==="opening"&&n.opening===u;return m`<button type="button" class="hme-list-row ${g?"on":""}" @click=${()=>e.select({kind:"opening",roomId:o,opening:u})}>
            <span class="hme-grow">${me(p)}</span><span class="mono dim">${et(Math.abs(c-f))} · ${et(Math.max(0,Math.min(f,c)))} in</span></button>`})}
        ${r.length===0?m`<p class="hme-empty-line">Nothing on this wall.</p>`:v}
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${()=>h("door")}>＋ Door</button>
          <button type="button" class="hme-tb" @click=${()=>h("window")}>＋ Window</button>
          <button type="button" class="hme-tb" @click=${()=>h("opening")}>＋ Way through</button>
        </div>`)}
      ${d===void 0||n.kind!=="opening"?v:this.openingCard(e,t,n.opening,d)}`}openingCard(e,t,n,o){let i=t.id,a=Math.hypot(o.b[0]-o.a[0],o.b[1]-o.a[1]),r=o.z1-o.z0;return H(me(o),m`
      <div class="hme-pics">${ka.map(d=>V({label:d.label,picture:Ta[d.label],on:o.kind===d.kind&&o.style===d.style,click:()=>e.apply(l=>Ge(l,i,n,{kind:d.kind,style:d.style??null}))}))}</div>
      ${O("Width",I({label:"Width",value:a,unit:"m",min:.1,max:20,set:d=>e.apply(l=>Ge(l,i,n,{width:d}))}))}
      ${O("From floor",I({label:"From floor",value:o.z0,unit:"m",min:0,max:20,set:d=>e.apply(l=>Ge(l,i,n,{z0:d,z1:d+r}))}),m`<span class="hme-l short">Tall</span>`,I({label:"Tall",value:r,unit:"m",min:.05,max:20,set:d=>e.apply(l=>Ge(l,i,n,{z1:o.z0+d}))}))}
      ${G("Drag it along the wall. The plan shows the space to each corner.")}
      <div class="hme-row-end indent"><button type="button" class="hme-tb danger" @click=${()=>e.apply(d=>Pt(d,i,n),{select:{kind:"room",roomId:i}})}>Remove ${me(o).toLowerCase()}</button></div>`)}cornerCard(e,t,n){let o=t.id,i=t.outline[n];if(i===void 0)return m``;let a=e.floor.rooms.filter(r=>!k(r.id,o)&&r.outline.some(d=>Math.hypot(d[0]-i[0],d[1]-i[1])<=.02));return H("Corner",m`
      ${O("Room",m`<span class="hme-val strong">${C(t)}</span>`)}
      ${O("Left, top",I({label:"Corner left",value:i[0],unit:"m",set:r=>e.apply(d=>Se(d,o,n,[r,i[1]]))}),I({label:"Corner top",value:i[1],unit:"m",set:r=>e.apply(d=>Se(d,o,n,[i[0],r]))}))}
      ${G(a.length===0?"Drag it on the plan. Drop it on another room's corner and the two move together after.":`Shared with ${a.map(C).join(", ")}, which move${a.length===1?"s":""} with it.`)}
      <div class="hme-row-end indent">
        <button type="button" class="hme-tb" ?disabled=${t.outline.length<=3} @click=${()=>e.apply(r=>xt(r,o,n),{select:{kind:"room",roomId:o}})}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(r=>se(r,o))}>Square the corners</button>
      </div>`)}},Ea={select:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3z" fill="none" stroke="currentColor" stroke-width="1.4"></path><circle cx="3" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="15" r="2" fill="currentColor"></circle><circle cx="3" cy="15" r="2" fill="currentColor"></circle></svg>`,split:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 3h14v12H2z" fill="none" stroke="currentColor" stroke-width="1.4"></path><path d="M9 1v16" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 2"></path></svg>`,inner:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="2.4"></path></svg>`,door:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 15h4M12 15h4M6 15V5M6 5a10 10 0 0 1 10 10" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`,window:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="1.4"></path><path d="M5 7h8M5 11h8" stroke="#8bb8f0" stroke-width="1.4"></path></svg>`,opening:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h4M12 9h4" stroke="currentColor" stroke-width="2.4"></path></svg>`,stairs:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3zM3 6h12M3 9h12M3 12h12" fill="none" stroke="currentColor" stroke-width="1.2"></path></svg>`},Ta={Door:m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V4M14 4a17 17 0 0 1 17 17" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Double door":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V7M48 21V7M14 7a14 14 0 0 1 14 14M48 7a14 14 0 0 0-14 14" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Sliding door":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18.5h20M28 23.5h20" stroke="#ece6da" stroke-width="2.4"></path></svg>`,Window:m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 18h34M14 24h34" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Sliding window":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18h20M28 24h20" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Way through":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h10M48 21h10" stroke="#ece6da" stroke-width="4"></path><path d="M14 27h34" stroke="#98989d" stroke-width="1" stroke-dasharray="3 3"></path></svg>`};var Ui=[{id:"pick",label:"Pick and move",key:"v"},{id:"draw",label:"Draw a room",key:"r"},{id:"inner",label:"Inner wall",key:"w"},{id:"door",label:"Door",key:"d"},{id:"window",label:"Window",key:"n"},{id:"furniture",label:"Add furniture",key:"f"},{id:"measure",label:"Measure",key:"m"}];function Sa(s){return Ui.find(e=>e.key===s.toLowerCase())?.id}var Gi=4,Ca=s=>`${s[0].toFixed(1)} \xD7 ${s[1].toFixed(1)}`;function Ra(s){let e=s.openings.filter(n=>n.kind==="window").length,t=s.openings.length-e;return`${R(t,"door")} \xB7 ${R(e,"window")}`}function Ia(s,e){let t=te(s.entityId,e);return(t.kind==="light"||t.kind==="other")&&t.on}var Wt=class{constructor(){this.arrange=new Ft;this.devices=new Nt;this.shape=new Kt;this.query="";this.trayOpen=!1}tool(e){if(e.toggles.measure)return"measure";if(e.walls!==void 0)return this.shape.tool;if(this.arrange.draw.active)return"draw";let t=this.shape.tool;return t==="inner"||t==="door"||t==="window"?t:"pick"}setTool(e,t){if(t==="furniture"){let n=_i(e);n===void 0?e.note("warn","Draw or scan a room first, then add its furniture."):this.arrange.openPicker(e,n);return}if(t==="measure"){this.arrange.draw.stop(),this.shape.setTool(e,"select"),e.setToggle("measure",!e.toggles.measure),e.redraw();return}if(e.toggles.measure&&e.setToggle("measure",!1),t==="draw"){this.shape.setTool(e,"select"),this.arrange.draw.active||this.arrange.draw.start(e);return}this.arrange.draw.stop(e),this.shape.setTool(e,t==="pick"?"select":t)}openRoom(e){let t=e.selection;if(t!==void 0){if(t.kind==="pin"){let n=e.floor.pins.find(o=>k(o.id,t.pinId));return n===void 0?void 0:Y(e.floor,n)?.id}return t.kind==="pins"?void 0:t.roomId}}picksPins(e){return ne(e.selection).length>0}rail(e){if(e.walls!==void 0)return this.shape.rail(e);let t=e.hass?.states,n=li(e.hass),o=this.query.trim().toLowerCase(),i=o===""?[]:mi(n,this.query).filter(a=>!e.floor.pins.some(r=>r.entityId===a.entityId));return m`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find a room, thing or device" aria-label="Find a room, thing or device" .value=${N(this.query)}
          @input=${a=>{this.query=a.target.value,e.redraw()}} /></label>
      ${this.layers(e,o)}
      ${o===""||i.length===0?v:H("Not on the map, found",m`
        ${i.map(a=>this.devices.deviceRow(e,a,t))}`,i.length>=40?"40+":String(i.length),"hme-tray")}
      ${this.trayCard(e,n,t)}`}layers(e,t){let n=e.floor,o=e.toggles.live?e.hass?.states:void 0,i=p=>p.toLowerCase().includes(t),a=p=>i(B(p,e.hass))||p.entityId.includes(t),r=this.openRoom(e),d=n.rooms.map(p=>{let u=p.objects.map((b,y)=>({object:b,index:y})),f=Le(n,p.id);if(t==="")return{room:p,things:u,pins:f,open:k(p.id,r)};let c=i(C(p)),g=u.filter(({object:b})=>i(ie(b))),w=f.filter(a);if(!(!c&&g.length===0&&w.length===0))return{room:p,things:c?u:g,pins:c?f:w,open:!0}}).filter(p=>p!==void 0),l=n.pins.filter(p=>Y(n,p)===void 0&&(t===""||a(p))),h=e.doc.floors.filter(p=>!k(p.id,n.id));return m`<section class="hme-card hme-layers">
      <div class="hme-h">${L(n)}<span class="hme-h-end">${R(n.rooms.length,"room")}</span></div>
      ${d.map(p=>this.layer(e,p.room,p.open,p.things,p.pins,o))}
      ${d.length===0?m`<p class="hme-empty-line">${t===""?"No rooms on this floor yet. Draw one with R.":"Nothing by that name."}</p>`:v}
      ${l.length===0?v:m`<div class="hme-lay dim">Not in a room<span class="n">${l.length}</span></div>
        ${l.map(p=>this.pinLayer(e,p,o))}`}
      ${t!==""?v:m`<div class="hme-sep"></div>${this.devices.kindChips(e)}`}
      ${h.length>0?m`<div class="hme-sep"></div>${h.map(p=>m`<button type="button" class="hme-lay dim"
          @click=${()=>e.setFloor(p.id)}>▸ ${L(p)}<span class="n">${R(p.rooms.length,"room")}</span></button>`)}`:v}
    </section>`}layer(e,t,n,o,i,a){let r=e.selection,d=r?.kind==="room"&&k(r.roomId,t.id),l=m`<button type="button" class="hme-lay ${d?"on":""}" aria-pressed=${d?"true":"false"} aria-expanded=${n?"true":"false"}
      title="Click to pick it, double-click to edit its walls"
      @click=${()=>e.select({kind:"room",roomId:t.id})}
      @dblclick=${()=>e.editWalls(t.id)}>
      <span class="hme-caret" aria-hidden="true">${n?"\u25BE":"\u25B8"}</span>
      <span class="hme-dot" style=${`background:${On[bt(t)]}`}></span>${C(t)}<span class="n">${De(t)}</span></button>`;return n?m`${l}
      ${o.map(({object:h,index:p})=>{let u=r?.kind==="object"&&k(r.roomId,t.id)&&r.object===p;return m`<button type="button" class="hme-lay sub ${u?"on":""} ${h.hidden===!0?"dim":""}" aria-pressed=${u?"true":"false"}
          title="Pick it to move, resize or turn it" @click=${()=>e.select({kind:"object",roomId:t.id,object:p})}>
          <span class="hme-thing-ic ${u?"on":""}" aria-hidden="true"></span>${ie(h)}<span class="n">${h.hidden===!0?"hidden":Ca(h.size)}</span></button>`})}
      ${i.map(h=>this.pinLayer(e,h,a))}
      <button type="button" class="hme-lay sub dim" title="Edit this room's walls, doors and windows" @click=${()=>e.editWalls(t.id)}>${Ra(t)}<span class="n">Walls ›</span></button>`:l}pinLayer(e,t,n){let o=ne(e.selection).some(a=>k(a,t.id)),i=Ia(t,n);return m`<button type="button" class="hme-lay sub ${o?"on":""}" aria-pressed=${o?"true":"false"} title="Shift, Cmd or Ctrl and a click picks several"
      @click=${a=>e.select(a.shiftKey||a.metaKey||a.ctrlKey?Je(e.selection,t.id):{kind:"pin",pinId:t.id})}>
      <span class="hme-dot dev ${i?"":"off"}"></span>${B(t,e.hass)}<span class="n">${he(t.entityId,n)}</span></button>`}trayCard(e,t,n){let o=pi(e.doc,e.floor,t),i=o.reduce((h,p)=>h+p.devices.length,0),a=hi(e.floor,o),r=i-Gi,l=this.trayOpen||r<=0?o.map(h=>m`<div class="hme-ar ${h.here?"":"dim"}">${h.name}<span>${h.devices.length}</span></div>
          ${h.devices.map(p=>this.devices.deviceRow(e,p,n))}`):o.flatMap(h=>h.devices).slice(0,Gi).map(h=>this.devices.deviceRow(e,h,n));return H("Not on the map",m`
      ${i===0?m`<p class="hme-empty-line">Every device with an area is on the map. Find any other above.</p>`:l}
      ${i===0?v:m`<div class="hme-row-end">
          <button type="button" class="hme-tb hme-grow-btn" ?disabled=${a===0}
            title=${a===0?"Link this floor's rooms to Home Assistant areas first (a room's Area, in its card)":"Each goes into the room linked to its area, at a good height for its kind"}
            @click=${()=>this.devices.placeAll(e,o.flatMap(h=>h.devices))}>Place all ${a} by area</button>
          ${r<=0?v:m`<button type="button" class="hme-tb" aria-expanded=${this.trayOpen?"true":"false"}
            @click=${()=>{this.trayOpen=!this.trayOpen,e.redraw()}}>${this.trayOpen?"Fewer":`${r} more`}</button>`}
        </div>
        <p class="hme-foot">Drag a device onto the plan to place it, or click it to put it in its area's room.</p>`}`,String(i),"hme-tray")}overlay(e){return e.walls!==void 0?this.shape.overlay(e):$`${this.arrange.overlay(e)}${this.shape.armed?this.shape.ghost(e):v}${this.devices.overlay(e)}`}drawsPins(e){return e.walls===void 0}pointerDown(e,t,n){return e.walls!==void 0?this.shape.pointerDown(e,t,n):this.arrange.draw.active?this.arrange.draw.pointerDown(e,t,n):this.shape.armed?this.shape.pointerDown(e,t,n):t.button!==0?!1:this.arrange.pressHandle(e,t,n)||this.devices.pressHandle(e,t,n)||this.devices.pressPin(e,t,n)||this.devices.pressBox(e,t,n)||this.arrange.pressBody(e,t,n)}doubleClick(e,t,n){if(this.arrange.draw.active||this.shape.armed||e.walls===void 0&&this.devices.onPin(e,n))return;let o=U(e.floor,n);o===void 0||k(o.id,e.walls)||e.editWalls(o.id)}hover(e,t){e.walls===void 0&&this.arrange.hover(e,t),this.shape.hover(e,t)}keyDown(e,t){let n=Z(t,!1),o=typeof n=="object"&&"letter"in n?n.letter:void 0;if(o==="m")return this.setTool(e,"measure"),!0;if(e.walls!==void 0)return this.shape.keyDown(e,t)?!0:n==="cancel"?(e.editWalls(void 0),!0):!1;if(this.arrange.draw.active&&this.arrange.draw.keyDown(e,t))return!0;let i=o===void 0?void 0:Sa(o);return i!==void 0?(this.setTool(e,i),!0):n==="cancel"&&this.shape.armed?(this.setTool(e,"pick"),!0):this.picksPins(e)?this.devices.keyDown(e,t):this.arrange.keyDown(e,t)}cursor(e){return e.walls!==void 0?this.shape.cursor():this.arrange.draw.active||this.shape.armed?"crosshair":void 0}leave(e){this.arrange.leave(e),this.devices.leave(),this.shape.leave(e)}dock(e){return e.walls!==void 0?this.shape.dock(e):m`${this.arrange.dock(e)}<span class="hme-vsep"></span>${this.devices.dock(e)}`}pill(e){return e.walls!==void 0||this.shape.armed?this.shape.pill(e):this.arrange.draw.active?this.arrange.pill(e):this.picksPins(e)?this.devices.pill(e):this.arrange.pill(e)}banner(e){let t=this.wallsRoom(e);return t===void 0?v:m`<span class="hme-banner-t">Editing the walls of <b>${C(t)}</b></span>
      <button type="button" class="hme-tb hme-blue" title="Back to moving things (Esc)" @click=${()=>e.editWalls(void 0)}>Done <kbd>Esc</kbd></button>`}wallsRoom(e){return e.walls===void 0?void 0:e.floor.rooms.find(t=>k(t.id,e.walls))}stageExtra(e){let t=e.walls===void 0?this.devices.stageExtra(e):v,n=e.walls!==void 0?"Drag a corner \xB7 drag a wall's middle to add a corner \xB7 Esc when done":"Click picks what is on top \xB7 Double-click a room to edit its walls";return m`${this.toolRail(e)}${t}
      ${t===v&&e.stage.width>=900?m`<div class="hme-stage-hint">${n}</div>`:v}`}toolRail(e){let t=this.tool(e),n=e.walls!==void 0,o=n?[...Wn,{id:"measure",label:"Measure",key:"m"}]:[...Ui],i=new Set(n?[0]:[0,4]);return m`<div class="hme-toolrail" role="toolbar" aria-label=${n?"Wall tools":"Tools"} aria-orientation="vertical">
      ${o.map((a,r)=>m`<button type="button" class="hme-rtool ${t===a.id?"on":""}" aria-pressed=${t===a.id?"true":"false"}
          aria-label=${a.label} title=${`${a.label} (${a.key.toUpperCase()})`} @click=${()=>this.setTool(e,a.id)}>
          ${Da(a.id)}<kbd>${a.key.toUpperCase()}</kbd></button>
        ${i.has(r)?m`<span class="hme-rtool-sep" aria-hidden="true"></span>`:v}`)}
    </div>`}inspector(e){return e.walls!==void 0?m`${this.shape.inspector(e)}
        ${H("Leave this",m`<p class="hme-text dim">Press Esc, click Done, or click outside the room to go back to moving things. Double-click any room to edit its walls.</p>`)}`:this.picksPins(e)?this.devices.inspector(e):this.arrange.inspector(e)}sheet(e){return this.arrange.sheet(e)}dragOver(e,t,n){return e.walls===void 0&&this.devices.dragOver(e,t,n)}drop(e,t,n){e.walls===void 0&&this.devices.drop(e,t,n)}startDrawing(e){this.setTool(e,"draw")}};function Da(s){switch(s){case"pick":return m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 2.5v11.5l3.1-3 2.3 5 2-.9-2.3-4.9h4.4z" fill="currentColor"></path></svg>`;case"draw":return m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 15V3h8l4 4v8z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2.5 2"></path></svg>`;case"furniture":return m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 8h14v6H2zM4 4h10v4H4zM3 14v2M15 14v2" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`;case"measure":return m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14M2 6v6M16 6v6M6 9v-2M9 9V6M12 9v-2" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`;default:return Bi(s)}}function Xi(s){return{get:()=>lt(s),save:(e,t)=>Vn(s,e,t)}}var qi="The map had changed on another device. Your change was saved on top of it.",Oa="The map changed on another device, and your change no longer fits it. It now shows the map as saved there.",Aa="The map changed again while saving, so your change was not saved. Try it once more.";function _a(s){return{doc:pt(s?.doc)??null,rev:typeof s?.rev=="number"?s.rev:0}}function Vi(s,e){let t=typeof e=="function"?e(s):to(s,e);if(t===void 0)return;let n=_e(t);return n.ok?{doc:n.doc}:{text:`Not saved. ${n.message}.`}}async function Yi(s,e,t){if(e.doc===null)return{ok:!1,text:"There is no map to change yet."};let n=Vi(e.doc,t);if(n===void 0)return{ok:!1,text:"That is no longer on the map."};if("text"in n)return{ok:!1,text:n.text};try{let a=await s.save(n.doc,e.rev);return{ok:!0,read:{doc:n.doc,rev:a.rev},merged:!1}}catch(a){let{code:r,message:d}=ke(a);if(r!=="conflict")return{ok:!1,text:`Not saved. ${d}`}}let o;try{o=_a(await s.get())}catch(a){return{ok:!1,text:`Not saved. The map changed on another device and could not be read again: ${ke(a).message}`}}let i=o.doc===null?void 0:Vi(o.doc,t);if(i===void 0)return{ok:!1,text:Oa,read:o};if("text"in i)return{ok:!1,text:i.text,read:o};try{let a=await s.save(i.doc,o.rev);return{ok:!0,read:{doc:i.doc,rev:a.rev},merged:!0}}catch(a){let{code:r,message:d}=ke(a);return{ok:!1,text:r==="conflict"?Aa:`Not saved. ${d}`,read:o}}}function Bt(s){return Array.isArray(s)?`[${s.map(Bt).join(",")}]`:typeof s=="object"&&s!==null?`{${Object.entries(s).filter(([,t])=>t!==void 0).sort(([t],[n])=>t<n?-1:t>n?1:0).map(([t,n])=>`${JSON.stringify(t)}:${Bt(n)}`).join(",")}}`:JSON.stringify(s)}function Fa(s,e){return s===e?!0:s==null||e==null?!1:Bt(s)===Bt(e)}function Zi(s,e){return t=>Fa(t,s)?e:void 0}var Gt=class{constructor(e,t,n=()=>{},o=()=>{},i){this.api=e;this.changed=n;this.saved=o;this.state={kind:"saved"};this.queue=[];this.confirmed=t,this.doc=t.doc,this.history=new ei(i)}get busy(){return this.queue.length>0||this.running!==void 0}get canUndo(){return this.doc!==null&&this.history.canUndo}get canRedo(){return this.doc!==null&&this.history.canRedo}load(e){return this.busy?!1:(this.confirmed=e,this.doc=e.doc,this.history.clear(),this.changed(),!0)}apply(e){let t=this.doc;if(t===null)return!1;let n=e(t);if(n===void 0)return!1;let o=_e(n);return o.ok?(this.history.push(t),this.doc=o.doc,this.enqueue(e),!0):(this.note={kind:"err",text:`That cannot be saved. ${o.message}.`},this.changed(),!1)}undo(){let e=this.doc;if(e===null)return!1;let t=this.history.undo(e);return t===void 0?!1:(this.doc=t,this.enqueue(Zi(e,t)),!0)}redo(){let e=this.doc;if(e===null)return!1;let t=this.history.redo(e);return t===void 0?!1:(this.doc=t,this.enqueue(Zi(e,t)),!0)}async idle(){for(;this.running!==void 0;)await this.running}dismissNote(){this.note=void 0,this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed()}enqueue(e){this.queue.push(e),this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed(),this.kick()}kick(){this.running===void 0&&(this.running=this.run().finally(()=>{this.running=void 0,this.queue.length>0?this.kick():this.changed()}))}async run(){for(;this.queue.length>0;){let e=this.queue.splice(0),t=e.length===1?e[0]:o=>e.reduce((i,a)=>i===void 0?void 0:a(i),o);this.state={kind:"saving"},this.changed();let n=await Yi(this.api,this.confirmed,t);if(n.ok){this.confirmed=n.read,this.saved(n.read),n.merged?(this.note={kind:"warn",text:qi},this.history.clear(),this.doc=this.rebased()):this.queue.length===0&&(this.doc=n.read.doc);continue}this.queue=[],this.history.clear(),n.read!==void 0&&(this.confirmed=n.read,this.saved(n.read)),this.doc=this.confirmed.doc,this.note={kind:"err",text:n.text},this.state={kind:"error",text:n.text},this.changed();return}this.state={kind:"saved"}}rebased(){let e=this.confirmed.doc;if(e===null)return null;let t=[];for(let n of this.queue){let o=n(e);if(o===void 0)continue;let i=_e(o);i.ok&&(e=i.doc,t.push(n))}return this.queue=t,e}};var Ji=Gn`
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
    grid-template-columns: minmax(220px, 264px) minmax(0, 1fr) minmax(300px, 440px);
    grid-template-rows: minmax(0, 1fr);
    grid-template-areas: "rail stage insp";
    gap: 12px;
    padding: 12px;
  }
  .hme-rail { grid-area: rail; }
  .hme-insp { grid-area: insp; }
  .hme-stage-wrap { grid-area: stage; position: relative; min-width: 0; min-height: 520px; }
  .hme-rail, .hme-insp { display: flex; flex-direction: column; gap: 10px; min-width: 0; min-height: 0; overflow: auto; }

  @container (max-width: 1180px) {
    .hme-body {
      grid-template-columns: minmax(0, 1fr) minmax(280px, 380px);
      grid-template-rows: minmax(520px, 1fr) auto;
      grid-template-areas: "stage insp" "rail insp";
    }
    .hme-rail { overflow: visible; }
  }
  @container (max-width: 760px) {
    .hme-body { display: flex; flex-direction: column; min-height: 0; }
    .hme-stage-wrap { flex: none; height: max(420px, 64vh); }
    .hme-rail, .hme-insp { overflow: visible; }
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

  /* ── the rail ─────────────────────────────────────────────────────── */
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
    width: 40px; height: 40px; flex: none; border-radius: 10px; border: 0; background: transparent; color: #c7c7cc; cursor: pointer;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; padding: 0;
  }
  .hme-rtool:hover { background: #2c2c2e; color: #fff; }
  .hme-rtool.on { background: #3a3a3c; color: #fff; }
  .hme-rtool:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--hme-sel); }
  .hme-rtool kbd { font: 500 9px var(--hme-mono); color: #8e8e93; line-height: 1; }
  .hme-rtool-sep { height: 1px; background: #3a3a3c; margin: 2px 6px; flex: none; }
  .hme-stage-hint { position: absolute; left: 70px; bottom: 22px; z-index: 1; color: #8e8e93; font-size: 11px; pointer-events: none; }
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
`;var dt={plan:{title:"Plan",hint:"The floor from above, with real floors, walls and pools of light."},night:{title:"Night",hint:"A small model at night. Lit rooms glow warm."},warm:{title:"Warm",hint:"Wood floors and cream walls, like a doll house."},lines:{title:"Lines",hint:"Only the lines. Calm and clean."},clay:{title:"Clay",hint:"A soft light model, for light pages."},blueprint:{title:"Blueprint",hint:"White lines on blue paper."},dots:{title:"Dots",hint:"A quiet plan with a dot for each light."}};function La(s,e){if(!Tt(s))return"Home style";let t=bn(s,e),n=i=>Object.hasOwn(s,Zo[i]),o=[];return n("look")&&o.push(dt[t.look].title),n("turn")&&o.push(`turned ${t.turn}\xB0`),n("names")&&o.push(t.names?"room names":"no room names"),n("devices")&&o.push(t.devices==="all"?"every device":t.devices==="none"?"no devices":"lights only"),n("furniture")&&o.push(t.furniture?"furniture":"no furniture"),n("glow")&&o.push(t.glow?"glow":"no glow"),`Own look: ${o.join(", ")}`}var Qi=(s,e)=>typeof s=="number"&&Number.isFinite(s)?s:e;function za(s,e){let t=lo(s);return so(s).flatMap(n=>{if(Zt(vt(n))!=="home_map")return[];let o=n,i=po(vt(n)),a=e?.floors.find(u=>k(u.id,i)),r=typeof o.homeMapRoomId=="string"?o.homeMapRoomId:void 0,d=r===void 0?void 0:a?.rooms.find(u=>k(u.id,r)),l=`${Qi(n.colSpan,1)}\xD7${Qi(n.rowSpan,1)}`,p=(typeof n.customLabel=="string"&&n.customLabel.trim()!==""?n.customLabel.trim():void 0)??(d?.name?.trim()?`${d.name.trim()} only`:a===void 0||(e?.floors.length??0)<=1?"Home map":L(a));return[{pageId:t,pageName:gt(s),tileId:typeof n.id=="string"?n.id:"",what:p,size:l,own:Tt(o),words:La(o,e),look:bn(o,e).look}]})}function ea(s,e){return Object.values(s?.pages??{}).map(n=>n?.item).filter(n=>ft(n)).sort((n,o)=>gt(n).localeCompare(gt(o))).flatMap(n=>za(n,e))}function ta(s){let e=!1;if(!Array.isArray(s.pages))return;let t=s.pages.map(n=>{if(!ft(n)||!Array.isArray(n.items))return n;let o=n.items.map(i=>!ft(i)||Zt(vt(i))!=="home_map"||!Tt(i)?i:(e=!0,Qo(i)));return{...n,items:o}});return e?{...s,pages:t}:void 0}var Ut={width:112,height:68},Na={width:94,height:94,radius:34},ja={width:188,height:94,radius:22},Ka=.9,Vt=class{constructor(){this.usesState="idle";this.busy=!1}style(e){let t=le(e.doc);return this.turnLive===void 0?t:{...t,turn:this.turnLive}}set(e,t){e.apply(n=>Jo(n,t))}panel(e,t){let n=this.style(e),o=e.hass?.states,i=Ye.includes(n.look),a=(r,d,l)=>m`<button type="button" class="hme-chip sel ${d?"on":""}" aria-pressed=${d?"true":"false"} @click=${l}>${r}</button>`;return m`<div class="hme-style-scrim" @pointerdown=${r=>{r.target===r.currentTarget&&t()}}></div>
      <div class="hme-style-pop" role="dialog" aria-label="Home style">
        <header class="hme-style-head">
          <strong>Home style</strong>
          <span>How every map tile looks, unless a tile picks its own</span>
          <button type="button" class="hme-x hme-style-close" aria-label="Close" title="Close (Esc)" @click=${t}>✕</button>
        </header>

        ${H("Look",m`<div class="hme-looks four">
          ${qn.map(r=>{let d=r===n.look,l=Re({floor:e.floor,states:o,...n,look:r,names:!1,width:Ut.width,height:Ut.height});return m`<button type="button" class="hme-look ${d?"on":""}" aria-pressed=${d?"true":"false"} title=${dt[r].hint}
              @click=${()=>this.set(e,{look:r})}>
              <svg viewBox=${`0 0 ${Ut.width} ${Ut.height}`} style=${`background:${pe(r,.5)}`} aria-hidden="true">${l}</svg>
              <span>${dt[r].title}</span></button>`})}
        </div>
        <p class="hme-foot">Plan and Dots draw the floor from above. The other five draw it as a small model you can turn.</p>`)}

        <div class="hme-style-row">
          ${H("Show",m`
            <div class="hme-r"><span class="hme-l">Room names</span>${a(n.names?"Shown":"Hidden",n.names,()=>this.set(e,{names:!n.names}))}</div>
            <div class="hme-r"><span class="hme-l">Devices</span><div class="hme-chips">
              ${a("Lights",n.devices==="lights",()=>this.set(e,{devices:"lights"}))}
              ${a("All",n.devices==="all",()=>this.set(e,{devices:"all"}))}
              ${a("None",n.devices==="none",()=>this.set(e,{devices:"none"}))}</div></div>
            <div class="hme-r"><span class="hme-l">Furniture</span>${a(n.furniture?"Shown":"Hidden",n.furniture,()=>this.set(e,{furniture:!n.furniture}))}</div>
            <div class="hme-r"><span class="hme-l">Light glow</span>${a(n.glow?"On":"Off",n.glow,()=>this.set(e,{glow:!n.glow}))}</div>
            <div class="hme-r"><span class="hme-l">Turn</span>
              <input class="hme-range" type="range" min="-180" max="180" step="1" .value=${N(String(n.turn))} ?disabled=${!i} aria-label="Turn the model"
                style=${xe(n.turn,-180,180)}
                @input=${r=>{this.turnLive=Number(r.target.value),e.redraw()}}
                @change=${r=>{this.turnLive=void 0,this.set(e,{turn:Number(r.target.value)})}} />
              <span class="hme-val mono hme-w48">${i?`${n.turn}\xB0`:"flat"}</span></div>`,void 0,"hme-grow-card")}
          ${H("Preview",m`<div class="hme-style-tiles">
            ${this.face(e,n,Na,"Watch tile 2 \xD7 2")}
            ${this.face(e,n,ja,"iPhone tile 4 \xD7 2")}
          </div>`,dt[n.look].title,"hme-grow-card")}
        </div>

        ${this.usesCard(e)}
      </div>`}face(e,t,n,o){let i=Ka,a=e.hass?.states,r=di(n.width,n.height),d=Re({floor:e.floor,states:a,...t,width:r.width,height:r.height,tileHeight:n.height,icons:e.icons}),l=mt(e.floor,a),h=6*i;return m`<figure class="hme-fr">
      <div class="hme-face" style=${`width:${n.width*i}px;height:${n.height*i}px;border-radius:${n.radius*i}px;background:${pe(t.look,i)}`}>
        <svg viewBox=${`0 0 ${r.width} ${r.height}`} aria-hidden="true"
          style=${`left:${r.x*i}px;top:${r.y*i}px;width:${r.width*i}px;height:${r.height*i}px`}>${d}</svg>
        ${n.height>90?m`<span class="hme-face-title" style=${`left:${h}px;top:${h}px;font-size:${11*i}px;color:${ri(t.look)}`}>${Wa(e.floor)}</span>`:v}
        <span class="hme-face-words" style=${`left:${h}px;bottom:${h}px;font-size:${10*i}px;color:${si(t.look,l>0)}`}>${ut(l)}</span>
      </div>
      <figcaption>${o}</figcaption>
    </figure>`}leave(){this.turnLive=void 0,this.usesState="idle",this.message=void 0}look(e){return le(e.doc).look}loadUses(e){let t=e.hass;this.usesState!=="idle"||t===void 0||(this.usesState="loading",ct(t).then(n=>{this.summary=n,this.usesState="done",e.redraw()},()=>{this.usesState="error",e.redraw()}))}usesCard(e){if(this.loadUses(e),this.usesState!=="done")return H("Used on",m`<p class="hme-text dim">${this.usesState==="error"?"Could not read your pages.":"Reading your pages\u2026"}</p>`);let t=ea(this.summary,e.doc),n=t.filter(o=>o.own);return H(`Used on ${R(t.length,"tile")}`,m`
      ${t.length===0?m`<p class="hme-text dim">No page has a Home map tile yet. Add one from a page's Add tile.</p>`:v}
      ${t.map(o=>this.useRow(e,o))}
      ${n.length===0?v:m`<button type="button" class="hme-tb hme-wide" ?disabled=${this.busy}
        @click=${()=>{this.useHomeStyleOnAll(e,n)}}>${this.busy?"Saving\u2026":`Use the home style on all ${n.length}`}</button>`}
      ${this.message===void 0?v:m`<p class="hme-text dim" role="status">${this.message}</p>`}`)}useRow(e,t){return m`<div class="hme-use">
      <i style=${`background:${pe(t.look,.2)}`}></i>
      <div><span>${t.pageName} · ${t.what} ${t.size}</span><small>${t.words}</small></div>
      ${e.openPage===void 0?v:m`<button type="button" class="hme-tb" @click=${()=>e.openPage?.(t.pageId)}>Edit</button>`}
    </div>`}async useHomeStyleOnAll(e,t){let n=e.hass;if(n===void 0||this.busy)return;let o=[...new Set(t.map(r=>r.pageId))];if(!await e.confirm({title:`Use the home style on ${R(t.length,"tile")}?`,text:`Their own looks come off, so each draws the home style. ${o.length===1?"The page is":`The ${o.length} pages are`} saved for every watch and iPhone that shows ${o.length===1?"it":"them"}.`,ok:"Use the home style"}))return;this.busy=!0,this.message=void 0,e.redraw();let a=0;for(let r of o)try{let d=await ao(n,"pages",r),l=ta(d.document);l!==void 0&&await ro(n,"pages",r,d.revision,l)}catch{a+=1}this.busy=!1,this.message=a===0?"Done: those tiles follow the home style now.":`${R(a,"page")} could not be saved. Try again, or open ${a===1?"it":"them"} to see why.`,this.usesState="idle",e.redraw()}};function Wa(s){return s.name.trim()===""?"Home map":s.name.trim()}var Ba="Update the Wrist Assistant integration to see the home map here.",Ga="No home map yet. Scan your rooms with the Wrist Assistant app on an iPhone or iPad with LiDAR (the Pro models). The map shows here once it is saved.",Ua=4,Va=140;function Xa(s){return s.kind==="saving"?"Saving\u2026":s.kind==="error"?"Not saved":"Saved"}var qa={night:"Night",warm:"Warm",lines:"Lines",clay:"Clay",blueprint:"Blueprint"},T=class extends Un{constructor(){super(...arguments);this.narrow=!1;this.icons=void 0;this.iconsTick=0;this.capable=!1;this.bundleUrl=void 0;this.onHome=void 0;this.onOpenPage=void 0;this.unsupported=!1;this.loading=!1;this.styleOpen=!1;this.viewKind="both";this.artScale=0;this.stageSize={width:0,height:0};this.toggles={snap:!0,square:!0,grid:!1,measure:!1,live:!0,scan:!1};this.measure={};this.floorMenu=!1;this.model3d=!0;this.daylight=!1;this.spaceHeld=!1;this.tick=0;this.page=new Wt;this.stylePanel=new Vt;this.loadSeq=0;this.askedOnce=!1;this.needFit=!0;this.userMoved=!1;this.touches=new Map;this.artKey="";this.artHeld=v;this.loading3d=!1;this.failed3d=!1;this.onKey=t=>{if(this.dialog!==void 0||this.session===void 0||this.renderRoot?.querySelector?.(".hme-sheet")!=null)return;let n=(typeof t.composedPath=="function"?t.composedPath()[0]:void 0)??t.target;if(Sn(n))return;let o=Z(t,!1);if(o==="undo"||o==="redo"){t.preventDefault?.(),o==="undo"?this.undo():this.redo();return}if(this.styleOpen){t.key==="Escape"&&this.closeStyle();return}if(Hi(n))return;if(t.key===" "&&!t.repeat){this.spaceHeld=!0,t.preventDefault?.();return}let i=this.context();if(i!==void 0&&this.viewKind!=="model"&&this.page.keyDown?.(i,t)===!0){t.preventDefault?.();return}switch(o){case"cancel":this.floorMenu?this.floorMenu=!1:this.toggles.measure?this.setToggle("measure",!1):this.walls!==void 0?this.editWalls(void 0):this.selection=void 0;return;case"zoomIn":this.zoomBy(Qe);return;case"zoomOut":this.zoomBy(1/Qe);return;case"fit":this.fit();return}};this.onKeyUp=t=>{t.key===" "&&(this.spaceHeld=!1)}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKey),window.addEventListener("keyup",this.onKeyUp),this.askedOnce&&this.load(!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKey),window.removeEventListener("keyup",this.onKeyUp),this.endDrag?.(),this.observer?.disconnect(),this.observed=void 0,this.zoomTimer!==void 0&&clearTimeout(this.zoomTimer),this.loadSeq++,this.drop3d()}willUpdate(t){this.hass&&this.capable&&!this.askedOnce&&(this.askedOnce=!0,this.load(),this.loadPages());let n=this.baseFloor();this.needFit&&n!==void 0&&this.stageSize.width>0&&this.fit()}updated(){let t=this.renderRoot.querySelector?.(".hme-dialog");t instanceof Element&&t!==this.focusedDialog?(this.focusedDialog=t,(t.querySelector("input")??t.querySelector(".primary"))?.focus?.(),t.querySelector("input")?.select?.()):t===null&&(this.focusedDialog=void 0);let n=this.renderRoot.querySelector?.(".hme-stage");n instanceof Element&&n!==this.observed&&typeof ResizeObserver<"u"&&(this.observer??=new ResizeObserver(o=>{let i=o[o.length-1]?.contentRect;i!==void 0&&this.resizeStage(i.width,i.height)}),this.observed!==void 0&&this.observer.unobserve(this.observed),this.observer.observe(n),this.observed=n),this.view!==void 0&&this.view.scale!==this.artScale&&this.zoomTimer===void 0&&(this.zoomTimer=setTimeout(()=>{this.zoomTimer=void 0,this.view!==void 0&&(this.artScale=this.view.scale)},Va)),this.sync3d()}input3d(){let t=this.shownFloor();if(t===void 0)return;let n=this.selection,o=n===void 0||n.kind==="pin"||n.kind==="pins"?void 0:n.kind==="object"?{roomId:n.roomId,object:n.object}:{roomId:n.roomId};return{floor:t,states:this.toggles.live?this.hass?.states:void 0,mark:o,daylight:this.daylight}}sync3d(){let t=this.renderRoot.querySelector?.(".hme-3d-host"),n=this.input3d();if(!(t instanceof HTMLElement)||n===void 0||this.bundleUrl===void 0){this.drop3d();return}if(this.scene3d!==void 0){this.scene3d.attach(t),this.scene3d.update(n,this.modelTurnNow());return}if(this.loading3d||this.failed3d)return;this.loading3d=!0;let o=zn(this.bundleUrl);At().then(i=>{if(this.loading3d=!1,!!this.isConnected){try{this.scene3d??=new i.HomeMapScene3D(o),this.scene3d.onPick=a=>this.pick3d(a)}catch{this.failed3d=!0}this.tick++}},()=>{this.loading3d=!1,this.failed3d=!0,this.tick++})}pick3d(t){if(this.dialog===void 0){if(this.floorMenu=!1,this.walls!==void 0){(t===void 0||t.kind==="pin"||!k(t.roomId,this.walls))&&this.editWalls(void 0);return}this.select(t===void 0?void 0:t.kind==="pin"?{kind:"pin",pinId:t.pinId}:t.kind==="object"?{kind:"object",roomId:t.roomId,object:t.object}:{kind:"room",roomId:t.roomId})}}drop3d(){this.scene3d?.dispose(),this.scene3d=void 0}turnBack(){this.modelTurn=void 0,this.scene3d?.frameFloor(le(this.doc).turn??yn)}async load(t=!1){let n=this.hass;if(!n||!this.capable)return;let o=++this.loadSeq;t||(this.loading=this.session===void 0,this.loadError=void 0);try{let i=await lt(n);if(o!==this.loadSeq)return;this.unsupported=!1,this.loadError=void 0,this.show({doc:pt(i?.doc)??null,rev:typeof i?.rev=="number"?i.rev:0}),this.loadScans()}catch(i){if(o!==this.loadSeq)return;let{code:a,message:r}=ke(i);a==="unknown_command"?this.unsupported=!0:(!t||this.session===void 0)&&(this.loadError=r)}this.loading=!1}async loadScans(){let t=this.hass;if(t)try{this.scans=await oo(t)}catch{}}async loadPages(){let t=this.hass;if(t)try{let n=ho(await ct(t));this.pages=mo(n,"pages").map(o=>({id:o.id,name:o.name}))}catch{this.pages=[]}}show(t){let n=this.hass;if(n&&Yt(n,t),this.session===void 0)this.session=new Gt(Xi(this.hassOrThrow()),t,()=>this.afterChange(),o=>{this.hass&&Yt(this.hass,o)}),this.needFit=!0;else if(!this.session.load(t))return;this.afterChange()}hassOrThrow(){let t=this.hass;if(t===void 0)throw new Error("no hass");return t}afterChange(){let t=this.session?.doc?.floors??[];t.some(o=>k(o.id,this.floorId))||(this.floorId=t[0]?.id,this.needFit=!0);let n=this.walls;n!==void 0&&!(this.baseFloor()?.rooms??[]).some(o=>k(o.id,n))&&(this.walls=void 0),Oi(this.baseFloor(),this.selection)||(this.selection=void 0),this.tick++}get doc(){return this.session?.doc??null}baseFloor(){let t=this.doc?.floors??[];return t.find(n=>k(n.id,this.floorId))??t[0]}shownFloor(){let t=this.baseFloor();return t===void 0||this.previewDoc===void 0?t:this.previewDoc.floors.find(n=>k(n.id,t.id))??t}apply(t,n={}){let o=this.session;return o===void 0?!1:(this.previewDoc=void 0,o.apply(t)?(n.floorId!==void 0&&(this.floorId=n.floorId),n.select!==void 0&&(this.selection=n.select??void 0),this.afterChange(),!0):(this.tick++,!1))}preview(t){let n=this.doc;this.previewDoc=t===void 0||n===null?void 0:t(n)??this.previewDoc,this.tick++}undo(){this.previewDoc=void 0,this.session?.undo()===!0&&this.afterChange()}redo(){this.previewDoc=void 0,this.session?.redo()===!0&&this.afterChange()}select(t){this.selection=t}editWalls(t,n){let o=this.walls,i=t===void 0?void 0:this.baseFloor()?.rooms.find(d=>k(d.id,t));if(t!==void 0&&i===void 0)return;let a=this.context();a!==void 0&&!(t===void 0?o===void 0:k(t,o))&&this.page.leave?.(a),this.walls=i?.id,this.styleOpen=!1;let r=i?.id??o;this.selection=n??(r===void 0?this.selection:{kind:"room",roomId:r})}setFloor(t){let n=this.context();n!==void 0&&this.page.leave?.(n),this.floorId=t,this.walls=void 0,this.selection=void 0,this.floorMenu=!1,this.measure={},this.needFit=!0,this.userMoved=!1}setToggle(t,n){this.toggles={...this.toggles,[t]:n},t==="measure"&&(this.measure={}),t==="scan"&&n&&this.loadScans()}confirm(t){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(n=>{this.dialog={kind:"confirm",...t,done:o=>{this.dialog=void 0,n(o)}}})}ask(t){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(n=>{this.dialog={kind:"ask",...t,done:o=>{this.dialog=void 0,n(o)}}})}resizeStage(t,n){let o=this.stageSize.width===0;this.stageSize={width:t,height:n},(o||!this.userMoved)&&(this.needFit=!0)}fit(){let{width:t,height:n}=this.stageSize;t<=0||(this.view=En(this.baseFloor(),t,n),this.artScale=this.view.scale,this.needFit=!1,this.userMoved=!1)}zoomBy(t,n){this.view!==void 0&&(this.view=Tn(this.view,t,n??[this.stageSize.width/2,this.stageSize.height/2]),this.userMoved=!0)}context(){let t=this.doc,n=this.shownFloor();if(t===null||n===void 0)return;let o=this.view??{scale:40,ox:0,oy:0},i=this.session;return{hass:this.hass,icons:this.icons,doc:t,floor:n,selection:this.selection,walls:this.walls,view:o,stage:this.stageSize,toggles:this.toggles,pages:this.pages??[],areas:no(this.hass),scans:this.scans,furnitureBase:this.bundleUrl===void 0?void 0:zn(this.bundleUrl),canUndo:i?.canUndo??!1,canRedo:i?.canRedo??!1,toScreen:a=>$i(o,a),px:a=>a*o.scale,toPlan:(a,r)=>this.toPlan(a,r),apply:(a,r)=>this.apply(a,r),preview:a=>this.preview(a),select:a=>this.select(a),editWalls:(a,r)=>this.editWalls(a,r),setFloor:a=>this.setFloor(a),setToggle:(a,r)=>this.setToggle(a,r),drag:(a,r)=>this.drag(a,r),undo:()=>this.undo(),redo:()=>this.redo(),confirm:a=>this.confirm(a),ask:a=>this.ask(a),newId:()=>Jt(),note:(a,r)=>{this.session!==void 0&&(this.session.note={kind:a,text:r}),this.tick++},redraw:()=>{this.tick++},openPage:this.onOpenPage}}toPlan(t,n){let o=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return Ie(this.view??{scale:40,ox:0,oy:0},[t-o.left,n-o.top])}stagePoint(t){let n=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return[t.clientX-n.left,t.clientY-n.top]}drag(t,n){let o=this.stageEl;if(o===void 0)return;this.endDrag?.();let i=t.clientX,a=t.clientY,r=!1,d,l=0,h=typeof requestAnimationFrame=="function"?requestAnimationFrame:void 0,p=()=>{l=0,d!==void 0&&n.move(this.toPlan(d.clientX,d.clientY),d)};try{o.setPointerCapture?.(t.pointerId)}catch{}let u=w=>{let b=w;b.pointerId===t.pointerId&&(!r&&Math.hypot(b.clientX-i,b.clientY-a)<Ua||(r=!0,d=b,h===void 0?p():l===0&&(l=h(p))))},f=w=>{let b=w;b.pointerId===t.pointerId&&(c(),l!==0&&(cancelAnimationFrame(l),p()),n.end(this.toPlan(b.clientX,b.clientY),b,r))},c=()=>{o.removeEventListener("pointermove",u),o.removeEventListener("pointerup",f),o.removeEventListener("pointercancel",f);try{o.releasePointerCapture?.(t.pointerId)}catch{}this.endDrag===g&&(this.endDrag=void 0)},g=()=>{c(),l!==0&&(cancelAnimationFrame(l),l=0),n.cancel?.()};o.addEventListener("pointermove",u),o.addEventListener("pointerup",f),o.addEventListener("pointercancel",f),this.endDrag=g}onStageDown(t){if(this.stageEl=t.currentTarget,this.floorMenu=!1,this.dialog!==void 0)return;if(t.pointerType==="touch"&&(this.touches.set(t.pointerId,[t.clientX,t.clientY]),this.touches.size===2)){this.endDrag?.(),this.preview(void 0),this.pinch();return}if(this.viewKind==="model"){this.turnModel(t);return}if(t.button===1||this.spaceHeld){t.preventDefault?.(),this.pan(t,!1);return}if(t.button!==0)return;let n=this.context();if(n===void 0)return;if(this.toggles.measure){let i=this.toPlan(t.clientX,t.clientY),a=this.measure;this.measure=a.a===void 0||a.b!==void 0?{a:i}:{a:a.a,b:i};return}let o=this.toPlan(t.clientX,t.clientY);if(this.page.pointerDown?.(n,t,o)===!0){t.preventDefault?.();return}this.pan(t,!0)}onStageDblClick(t){if(this.stageEl=t.currentTarget,this.dialog!==void 0||this.viewKind==="model"||this.toggles.measure||this.spaceHeld||t.button!==0)return;let n=this.context();n!==void 0&&this.page.doubleClick?.(n,t,this.toPlan(t.clientX,t.clientY))}onStageMove(t){if(this.stageEl=t.currentTarget,this.touches.has(t.pointerId)&&this.touches.set(t.pointerId,[t.clientX,t.clientY]),t.buttons!==0||this.viewKind==="model")return;let n=this.toPlan(t.clientX,t.clientY);this.toggles.measure&&this.measure.a!==void 0&&this.measure.b===void 0&&(this.measure={...this.measure,hover:n});let o=this.context();o!==void 0&&this.page.hover?.(o,n)}onStageLeave(){let t=this.context();t!==void 0&&this.page.hover?.(t,void 0)}onStageUp(t){this.touches.delete(t.pointerId)}onStageDrag(t){this.stageEl=t.currentTarget;let n=this.context();n===void 0||this.viewKind==="model"||this.dialog!==void 0||this.page.dragOver?.(n,this.toPlan(t.clientX,t.clientY),t)===!0&&(t.preventDefault?.(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"))}onStageDragLeave(t){let n=t.relatedTarget,o=t.currentTarget;if(n!==null&&o!==null&&typeof o.contains=="function"&&o.contains(n))return;let i=this.context();i!==void 0&&this.page.dragOver?.(i,void 0,t)}onStageDrop(t){this.stageEl=t.currentTarget;let n=this.context();n===void 0||this.viewKind==="model"||(t.preventDefault?.(),this.page.drop?.(n,this.toPlan(t.clientX,t.clientY),t))}pan(t,n){let o=this.view;if(o===void 0)return;let i=t.clientX,a=t.clientY;this.drag(t,{move:(r,d)=>{this.view={...o,ox:o.ox+d.clientX-i,oy:o.oy+d.clientY-a},this.userMoved=!0},end:(r,d,l)=>{!l&&n&&(this.selection=void 0)}})}pinch(){let t=this.stageEl,n=this.view,o=[...this.touches.keys()];if(t===void 0||n===void 0||o.length<2)return;let i=()=>o.map(f=>this.touches.get(f)),[a,r]=i(),d=Math.max(Math.hypot(r[0]-a[0],r[1]-a[1]),1),l=t.getBoundingClientRect(),h=[(a[0]+r[0])/2-l.left,(a[1]+r[1])/2-l.top],p=f=>{let c=f;if(!this.touches.has(c.pointerId))return;this.touches.set(c.pointerId,[c.clientX,c.clientY]);let[g,w]=i(),b=Math.max(Math.hypot(w[0]-g[0],w[1]-g[1]),1),y=[(g[0]+w[0])/2-l.left,(g[1]+w[1])/2-l.top],P=Tn(n,b/d,h);this.view={...P,ox:P.ox+y[0]-h[0],oy:P.oy+y[1]-h[1]},this.userMoved=!0},u=f=>{this.touches.delete(f.pointerId),t.removeEventListener("pointermove",p),t.removeEventListener("pointerup",u),t.removeEventListener("pointercancel",u)};t.addEventListener("pointermove",p),t.addEventListener("pointerup",u),t.addEventListener("pointercancel",u)}turnModel(t){let n=this.modelTurnNow(),o=t.clientX;this.drag(t,{move:(i,a)=>{let r=n+(a.clientX-o)*.5;r=((r+180)%360+360)%360-180,this.modelTurn=Math.round(r)},end:()=>{}})}modelTurnNow(){return this.modelTurn??le(this.doc).turn??yn}modelLookNow(){if(this.modelLook!==void 0)return this.modelLook;let t=le(this.doc).look;return Ye.includes(t)?t:"night"}onWheel(t){if(this.viewKind==="model"||this.view===void 0)return;this.stageEl=t.currentTarget,t.preventDefault?.();let n=t.deltaMode===1?16:t.deltaMode===2?400:1;if(t.ctrlKey||t.metaKey){this.zoomBy(Math.exp(-t.deltaY*n*.0025),this.stagePoint(t));return}this.view={...this.view,ox:this.view.ox-t.deltaX*n,oy:this.view.oy-t.deltaY*n},this.userMoved=!0}toggleStyle(){if(this.styleOpen){this.closeStyle();return}this.floorMenu=!1,this.styleOpen=!0}closeStyle(){this.styleOpen=!1,this.stylePanel.leave()}render(){if(this.tick,!this.capable||this.unsupported)return this.calm(m`<b>${Ba}</b>`);if(this.loadError!==void 0)return this.calm(m`<span>Could not read the home map: ${this.loadError}</span>
        <button class="hme-tb" @click=${()=>{this.load()}}>Try again</button>`);if(this.loading||this.session===void 0)return this.calm(m`Loading…`);let t=this.doc;if(t===null||t.floors.length===0)return this.calm(m`<b>${Ga}</b>`);let n=this.context(),o=this.session.note;return m`<div class="hme">
      ${this.renderBar(t,n)}
      ${o===void 0?v:m`<div class="hme-note ${o.kind}" role="status"><span>${o.text}</span>
        <button class="hme-link" @click=${()=>this.session?.dismissNote()}>Dismiss</button></div>`}
      <div class="hme-body">
        <aside class="hme-rail" aria-label=${this.walls===void 0?"Layers":"Walls"}>${this.page.rail(n)}</aside>
        <section class="hme-stage-wrap">${this.renderStage(n)}</section>
        <aside class="hme-insp" aria-label="Inspector">${this.page.inspector(n)}</aside>
      </div>
      ${this.page.sheet?.(n)??v}
      ${this.renderDialog()}
    </div>`}calm(t){return m`<div class="hme-calm"><div class="hme-empty">${t}</div></div>`}renderBar(t,n){let o=this.baseFloor(),i=this.session?.state??{kind:"saved"},a=Cn(),r=this.walls===void 0?void 0:o.rooms.find(l=>k(l.id,this.walls)),d=le(t).look;return m`<header class="hme-bar">
      ${this.onHome===void 0?v:m`<button type="button" class="hme-back" @click=${()=>this.onHome?.()}>‹ Home</button><span class="hme-vsep"></span>`}
      <strong class="hme-title">Home map</strong><span class="hme-beta">BETA</span>
      ${r===void 0?v:m`<span class="hme-crumb-sep" aria-hidden="true">›</span>
        <strong class="hme-title hme-crumb">${C(r)} walls</strong>`}
      <div class="hme-floor-wrap">
        <button type="button" class="hme-tb hme-floor-btn" aria-label="Switch floor" aria-haspopup="menu" aria-expanded=${this.floorMenu?"true":"false"}
          @click=${()=>{this.floorMenu=!this.floorMenu}}>
          ${_n(o)}
          <span class="hme-floor-t"><span>${L(o)}</span><small>${R(o.rooms.length,"room")} · ${R(o.pins.length,"device")}</small></span>
          <span class="hme-caret" aria-hidden="true">▾</span>
        </button>
        ${this.floorMenu?this.renderFloorMenu(t,o):v}
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
        ${this.styleOpen?this.stylePanel.panel(n,()=>this.closeStyle()):v}
      </div>
      <button type="button" class="hme-tb hme-icon" aria-label="Undo" title=${`Undo (${a?"\u2318Z":"Ctrl+Z"})`} ?disabled=${!n.canUndo} @click=${()=>this.undo()}>↶</button>
      <button type="button" class="hme-tb hme-icon" aria-label="Redo" title=${`Redo (${a?"\u21E7\u2318Z":"Ctrl+Shift+Z"})`} ?disabled=${!n.canRedo} @click=${()=>this.redo()}>↷</button>
      <span class="hme-status ${i.kind}" role="status" title=${i.kind==="error"?i.text:v}><span class="hme-status-dot"></span>${Xa(i)}</span>
    </header>`}renderStyleButton(t){return m`<button type="button" class="hme-tb hme-style-btn ${this.styleOpen?"on":""}" aria-haspopup="dialog" aria-expanded=${this.styleOpen?"true":"false"}
      title="How every map tile looks, unless a tile picks its own" @click=${()=>this.toggleStyle()}>
      <span class="hme-style-sw" style=${`background:${pe(t,.2)}`} aria-hidden="true"></span>Home style</button>`}renderFloorMenu(t,n){return m`<div class="hme-pop" role="menu" aria-label="Floors">
      ${t.floors.map(o=>m`<div class="hme-pop-row ${k(o.id,n.id)?"on":""}">
        <button type="button" role="menuitem" class="hme-pop-main" @click=${()=>this.setFloor(o.id)}>
          ${_n(o)}<span class="hme-floor-t"><span>${L(o)}</span><small>${R(o.rooms.length,"room")} · ${R(o.pins.length,"device")}</small></span></button>
        <button type="button" class="hme-pop-act" title="Rename" aria-label=${`Rename ${L(o)}`} @click=${()=>{this.renameFloorAsk(o)}}>Rename</button>
        <button type="button" class="hme-pop-act danger" title=${t.floors.length===1?"The map keeps at least one floor":"Delete"} aria-label=${`Delete ${L(o)}`}
          ?disabled=${t.floors.length===1} @click=${()=>{this.deleteFloorAsk(o)}}>Delete</button>
      </div>`)}
      <button type="button" class="hme-pop-add" @click=${()=>{this.addFloorAsk()}}>＋ Add a floor</button>
    </div>`}async addFloorAsk(){this.floorMenu=!1;let t=this.doc;if(t===null)return;let n=Math.max(...t.floors.map(a=>a.story))+1,o=await this.ask({title:"Add a floor",label:"Name",value:n===1?"Upstairs":`Floor ${n+1}`,ok:"Add floor"});if(o===void 0)return;let i=Jt();this.apply(a=>xo(a,{id:i,name:o,story:n}),{floorId:i,select:null})&&(this.needFit=!0)}async renameFloorAsk(t){this.floorMenu=!1;let n=await this.ask({title:"Rename floor",label:"Name",value:t.name||L(t),ok:"Rename"});n!==void 0&&this.apply(o=>yt(o,t.id,n))}async deleteFloorAsk(t){this.floorMenu=!1,await this.confirm({title:`Delete ${L(t)}?`,text:`Its ${R(t.rooms.length,"room")} and ${R(t.pins.length,"device")} come off the map. Undo brings them back while this page is open.`,ok:"Delete floor",danger:!0})&&this.apply(o=>Ho(o,t.id),{select:null})}renderStage(t){let n=this.page,{width:o,height:i}=this.stageSize,a=this.viewKind==="model",r=this.viewKind==="both",d=a?v:n.pill?.(t)??v,l=a?v:n.banner?.(t)??v,h=this.spaceHeld?"grab":a?"ew-resize":this.toggles.measure?"crosshair":n.cursor?.(t)??"default",p=t.floor.rooms.length===0,u=this.model3d&&this.bundleUrl!==void 0,f=r?u?m`<div class="hme-stage model hme-split-r hme-3d">
      ${this.render3d(t)}
      ${this.renderModelDock(!1)}
    </div>`:m`<div class="hme-stage model hme-split-r" style=${`background:${pe(this.modelLookNow())}`}>
      <svg class="hme-svg" width="100%" height="100%" viewBox=${`0 0 ${Math.max(o,1)} ${Math.max(i,1)}`} style="cursor:ew-resize"
        role="img" aria-label=${`Model of ${L(t.floor)}`}
        @pointerdown=${g=>this.onModelDown(g)}>
        ${this.renderModel(t,o,i)}
      </svg>
      ${this.renderModelDock(!1)}
    </div>`:v;if(a&&u)return m`<div class="hme-stage model hme-3d">
        ${this.render3d(t)}
        ${this.renderDock(t)}
      </div>`;let c=this.walls!==void 0&&!a;return m`<div class="hme-stage ${a?"model":""} ${r?"hme-split-l":""} ${c?"walls":""}" style=${a?`background:${pe(this.modelLookNow())}`:""}>
      <svg class="hme-svg" width="100%" height="100%" viewBox=${`0 0 ${Math.max(o,1)} ${Math.max(i,1)}`} style=${`cursor:${h}`}
        role="img" aria-label=${`Plan of ${L(t.floor)}`}
        @pointerdown=${g=>this.onStageDown(g)}
        @dblclick=${g=>this.onStageDblClick(g)}
        @pointermove=${g=>this.onStageMove(g)}
        @pointerup=${g=>this.onStageUp(g)}
        @pointercancel=${g=>this.onStageUp(g)}
        @pointerleave=${()=>this.onStageLeave()}
        @wheel=${g=>this.onWheel(g)}
        @dragover=${g=>this.onStageDrag(g)}
        @dragleave=${g=>this.onStageDragLeave(g)}
        @drop=${g=>this.onStageDrop(g)}>
        ${a?this.renderModel(t,o,i):this.renderPlan(t,o,i)}
      </svg>
      ${l===v?v:m`<div class="hme-banner">${l}</div>`}
      ${d===v?v:m`<div class="hme-pill ${l===v?"":"under"}">${d}</div>`}
      ${a?v:n.stageExtra?.(t)??v}
      ${p&&!a&&!n.arrange.draw.active?m`<div class="hme-stage-empty"><b>No rooms on this floor yet.</b>
        <span>Draw one by hand, or scan this floor with the iPhone.</span>
        <button type="button" class="hme-tb" @click=${()=>{let g=this.context();g&&n.startDrawing(g)}}>＋ Draw a room by hand</button></div>`:v}
      ${this.renderDock(t)}
    </div>${f}`}onModelDown(t){this.dialog!==void 0||t.button!==0||(this.stageEl=t.currentTarget,this.floorMenu=!1,this.turnModel(t))}renderPlan(t,n,o){let i=this.view;if(i===void 0||n<=0)return v;let a=this.planArt(t.floor,n,o,this.page.drawsPins?.(t)===!0?"none":"all"),r=i.scale/(this.artScale||i.scale);return $`${this.background(i,n,o)}
      <g class="hme-art" transform=${`translate(${i.ox.toFixed(2)} ${i.oy.toFixed(2)}) scale(${r.toFixed(5)})`} pointer-events="none">${a}</g>
      <g class="hme-labels" pointer-events="none">${this.labels(t)}</g>
      <g class="hme-overlay">${this.page.overlay(t)}</g>
      ${this.toggles.measure?this.measureMarks(t):v}`}planArt(t,n,o,i){let a=this.toggles.live?this.hass?.states:void 0,r=this.artScale||this.view.scale,d=`${Za(t)}|${Bn(a)}|${r}|${n}|${o}|${this.iconsTick}|${Bn(this.icons)}|${i}`;return d!==this.artKey&&(this.artKey=d,this.artHeld=Re({floor:t,states:a,look:"plan",names:!1,devices:i,furniture:!0,glow:!0,width:n,height:o,icons:this.icons,frame:{scale:r,ox:0,oy:0}})),this.artHeld}background(t,n,o){let i=this.walls!==void 0?ce:ue,a=20;if(this.toggles.grid)for(a=i*t.scale;a<8;)a*=10;let r=(t.ox%a+a)%a,d=(t.oy%a+a)%a;return $`<defs><pattern id="hme-bg" width=${a} height=${a} patternUnits="userSpaceOnUse" patternTransform=${`translate(${r.toFixed(1)} ${d.toFixed(1)})`}>
        ${this.toggles.grid?$`<path d=${`M${a} 0V${a}H0`} fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1" />`:$`<circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.09)" />`}
      </pattern></defs>
      <rect class="hme-bg" width=${n} height=${o} fill="url(#hme-bg)" />`}labels(t){return t.floor.rooms.map(n=>{let o=q(n),i=ge(n.outline);if(o===void 0||i===void 0)return v;let a=C(n),r=De(n),d=(i.maxX-i.minX)*t.view.scale,l=(i.maxY-i.minY)*t.view.scale,h=a.length*7.4+22;if(h>d*.95||l<26)return v;let p=Math.max(h,r.length*5.8+22)<=d*.95&&l>=48,u=p?Math.max(h,r.length*5.8+22):h,f=p?36:22,[c,g]=t.toScreen(o);return $`<g class="hme-label"><rect x=${(c-u/2).toFixed(1)} y=${(g-f/2).toFixed(1)} width=${u.toFixed(1)} height=${f} rx=${p?9:7} fill="rgba(0,0,0,0.6)" />
        <text x=${c.toFixed(1)} y=${(g+(p?-3:4.5)).toFixed(1)} fill="#fff" font-size=${p?13:12} font-weight="600" text-anchor="middle">${a}</text>
        ${p?$`<text x=${c.toFixed(1)} y=${(g+11).toFixed(1)} fill="#aeaeb2" font-size="10" text-anchor="middle">${r}</text>`:v}</g>`})}measureMarks(t){let n=this.measure;if(n.a===void 0)return $`<g class="hme-measure"></g>`;let o=n.b??n.hover,i=t.toScreen(n.a);if(o===void 0)return $`<g class="hme-measure" pointer-events="none"><circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" /></g>`;let a=t.toScreen(o),r=Math.hypot(o[0]-n.a[0],o[1]-n.a[1]),d=[(i[0]+a[0])/2,(i[1]+a[1])/2];return $`<g class="hme-measure" pointer-events="none">
      <line x1=${i[0]} y1=${i[1]} x2=${a[0]} y2=${a[1]} stroke="#ff9f0a" stroke-width="2" stroke-dasharray=${n.b===void 0?"6 4":"none"} />
      <circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" /><circle cx=${a[0]} cy=${a[1]} r="5" fill="#ff9f0a" />
      <g class="hme-tag"><rect x=${(d[0]-32).toFixed(1)} y=${(d[1]-22).toFixed(1)} width="64" height="20" rx="10" fill="#ff9f0a" />
      <text x=${d[0].toFixed(1)} y=${(d[1]-8).toFixed(1)} fill="#2a1a00" text-anchor="middle">${r.toFixed(2)} m</text></g></g>`}renderModel(t,n,o){if(n<=0)return v;let i=this.selection,a=i===void 0||i.kind==="pin"||i.kind==="pins"?void 0:t.floor.rooms.find(l=>k(l.id,i.roomId)),r=i?.kind==="object"?a?.objects[i.object]:void 0,d=r!==void 0?{box:r}:a!==void 0?{outline:a.outline}:void 0;return Re({mark:d,floor:t.floor,states:this.toggles.live?this.hass?.states:void 0,look:this.modelLookNow(),turn:this.modelTurnNow(),names:!0,devices:"lights",furniture:!0,glow:!0,width:n,height:o})}render3d(t){let n=this.failed3d?"The 3D view needs WebGL, which this browser has turned off.":this.scene3d===void 0?"Loading the 3D view\u2026":void 0;return m`<div class="hme-3d-host" role="img" aria-label=${`3D model of ${L(t.floor)}. Drag to turn it, scroll to zoom, click a thing to pick it.`}></div>
      ${n===void 0?v:m`<div class="hme-3d-note">${n}</div>`}`}renderModelDock(t,n){let o=this.model3d&&this.bundleUrl!==void 0,i=o?void 0:this.modelLookNow(),a=r=>r?"true":"false";return m`<div class="hme-dock">
      ${Ye.map(r=>m`<button type="button" class="hme-tb ${r===i?"on":""}" aria-pressed=${a(r===i)} @click=${()=>{this.modelLook=r,this.model3d=!1}}>${qa[r]}</button>`)}
      ${this.bundleUrl===void 0?v:m`<button type="button" class="hme-tb ${o?"on":""}" aria-pressed=${a(o)}
        title="The floor in real 3D, with its furniture and each light lit as it is now" @click=${()=>{this.model3d=!0}}>3D</button>`}
      ${o?m`<span class="hme-vsep"></span>
        <button type="button" class="hme-tb ${this.daylight?"":"on"}" aria-pressed=${a(!this.daylight)} title="Night: only the lights that are on light the rooms"
          @click=${()=>{this.daylight=!1}}>Lights</button>
        <button type="button" class="hme-tb ${this.daylight?"on":""}" aria-pressed=${a(this.daylight)} title="Day: the sun comes in through the windows"
          @click=${()=>{this.daylight=!0}}>Daylight</button>`:v}
      <span class="hme-vsep"></span>
      <button type="button" class="hme-tb" title=${o?"Show the whole floor from the home style's turn":"Back to the home style's turn"} @click=${()=>this.turnBack()}>⟲ Turn back</button>
      ${t&&n!==void 0?m`<span class="hme-vsep"></span>${n}`:v}
    </div>`}renderDock(t){let n=m`<button type="button" class="hme-tb ${this.toggles.live?"on":""}" aria-pressed=${this.toggles.live?"true":"false"}
      title="Draw what Home Assistant's devices are doing now" @click=${()=>this.setToggle("live",!this.toggles.live)}><span class="hme-live-dot"></span>Live states</button>`;if(this.viewKind==="model")return this.renderModelDock(!0,n);let o=this.stageSize.width>0?En(this.baseFloor(),this.stageSize.width,this.stageSize.height):void 0,i=this.view===void 0||o===void 0?100:Mi(this.view,o);return m`<div class="hme-dock">
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom out" @click=${()=>this.zoomBy(1/Qe)}>−</button>
      <span class="hme-zoom mono">${i}%</span>
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom in" @click=${()=>this.zoomBy(Qe)}>＋</button>
      <button type="button" class="hme-tb" @click=${()=>this.fit()}>Fit</button>
      <span class="hme-vsep"></span>
      ${this.page.dock?.(t)??v}
      <span class="hme-vsep"></span>${n}
    </div>`}renderDialog(){let t=this.dialog;if(t===void 0)return v;let n=()=>t.kind==="confirm"?t.done(!1):t.done(void 0),o=i=>{t.kind==="confirm"?t.done(!0):t.done((i?.querySelector("input")?.value??t.value).trim()||t.value)};return m`<div class="hme-scrim" @pointerdown=${i=>{i.target===i.currentTarget&&n()}}>
      <div class="hme-dialog" role="dialog" aria-modal="true" aria-label=${t.title}
        @keydown=${i=>{i.key==="Escape"&&(i.stopPropagation(),n()),i.key==="Enter"&&(i.preventDefault(),o(i.currentTarget))}}>
        <h3>${t.title}</h3>
        ${t.kind==="confirm"?t.text===void 0?v:m`<p>${t.text}</p>`:m`<label class="hme-dialog-field"><span>${t.label}</span><input type="text" maxlength="100" .value=${t.value} autofocus /></label>`}
        <div class="hme-dialog-row">
          <button type="button" class="hme-tb" @click=${n}>Cancel</button>
          <button type="button" class="hme-tb primary ${t.kind==="confirm"&&t.danger===!0?"danger-fill":""}"
            @click=${i=>o(i.currentTarget.closest(".hme-dialog"))}>${t.ok}</button>
        </div>
      </div>
    </div>`}static{this.styles=[io,Xn,Ji]}};S([Q({attribute:!1})],T.prototype,"hass",2),S([Q({type:Boolean,reflect:!0})],T.prototype,"narrow",2),S([Q({attribute:!1})],T.prototype,"icons",2),S([Q({attribute:!1})],T.prototype,"iconsTick",2),S([Q({attribute:!1})],T.prototype,"capable",2),S([Q({attribute:!1})],T.prototype,"bundleUrl",2),S([Q({attribute:!1})],T.prototype,"onHome",2),S([Q({attribute:!1})],T.prototype,"onOpenPage",2),S([A()],T.prototype,"unsupported",2),S([A()],T.prototype,"loading",2),S([A()],T.prototype,"loadError",2),S([A()],T.prototype,"floorId",2),S([A()],T.prototype,"selection",2),S([A()],T.prototype,"walls",2),S([A()],T.prototype,"styleOpen",2),S([A()],T.prototype,"viewKind",2),S([A()],T.prototype,"view",2),S([A()],T.prototype,"artScale",2),S([A()],T.prototype,"stageSize",2),S([A()],T.prototype,"toggles",2),S([A()],T.prototype,"scans",2),S([A()],T.prototype,"measure",2),S([A()],T.prototype,"floorMenu",2),S([A()],T.prototype,"dialog",2),S([A()],T.prototype,"modelLook",2),S([A()],T.prototype,"model3d",2),S([A()],T.prototype,"daylight",2),S([A()],T.prototype,"modelTurn",2),S([A()],T.prototype,"pages",2),S([A()],T.prototype,"spaceHeld",2),S([A()],T.prototype,"tick",2);var na=new WeakMap,Ya=1;function Bn(s){if(s===void 0)return 0;let e=na.get(s);return e===void 0&&na.set(s,e=Ya++),e}var Za=s=>Bn(s);customElements.get("wa-home-map-editor")||customElements.define("wa-home-map-editor",T);export{Ua as HOME_MAP_DRAG_SLOP,Ga as HOME_MAP_EMPTY_TEXT,Ba as HOME_MAP_UPDATE_TEXT,T as WaHomeMapEditor,Xa as homeMapSaveWords};
