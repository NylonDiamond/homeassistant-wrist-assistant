import{a as gi}from"./chunk-INKHCD7L.js";import{a as So,b as Co,c as Ft,d as Ro,e as zt,f as vi}from"./chunk-HEBXYR6X.js";import"./chunk-UXWV3SSO.js";import{$ as It,A as Un,Aa as pe,B as Re,Ba as To,C as vo,Ca as Lt,D as Tt,Da as ci,E as Vn,Ea as fi,F as Xn,Fa as Nt,G as bo,Ga as $e,H as Ze,Ha as et,I as wo,Ia as tt,J as St,Ja as ot,K as qn,Ka as bi,L as Yn,La as nt,M as Ie,Ma as Io,N as Ct,Na as he,O as Zn,Oa as wi,P as Je,Pa as yi,Q as Me,Qa as Mi,R as yo,Ra as Le,S as Jn,T as Qn,U as De,V as Oe,W as ei,X as ti,Y as Mo,Z as de,_ as Rt,a as Ue,aa as oi,b as K,ba as $o,c as Ce,ca as ni,d as ye,da as Dt,e as In,ea as ko,f as Dn,fa as Qe,g as On,ga as Ot,h as An,ha as ii,i as Ve,ia as ri,j as Xe,ja as xo,k as _n,ka as Ho,l as qe,la as ai,m as Ln,ma as si,n as Fn,na as Po,o as Et,oa as le,p as zn,pa as Ae,q as co,qa as di,r as Nn,ra as li,s as jn,sa as Eo,t as Kn,ta as _e,u as Bn,ua as At,v as fo,va as _t,w as go,wa as pi,x as Ye,xa as hi,y as Wn,ya as mi,z as Gn,za as ui}from"./chunk-NUX7ADFB.js";import"./chunk-7T6IEW6M.js";import{B as mo,E as Pt,G as Sn,I as Cn,J as we,O as Rn,R as uo,a as se,e as po,n as ho,o as be,p as Ge,q as Y,r as U,s as xt,t as Ht,u as En,w as Se,x as Tn}from"./chunk-WMCAKTHO.js";import{c as yt,j as yn,k as Mn,na as Hn,oa as Pn}from"./chunk-5H6OWAXC.js";import"./chunk-J2WKPEGJ.js";import{b as lo}from"./chunk-S3NOJWAC.js";import{j as bn,p as ao,q as j}from"./chunk-X3ZLOB52.js";import{i as Mt,l as $n,m as kn,n as $t,r as kt,s as so,t as xn}from"./chunk-CPEKF3CW.js";import{B as F,C as T,D as vt,E as ne,F as J,H as cn,J as ie,K as fn,L as bt,M as wt,S as gn,T as vn,U as G,b as pn,d as hn,e as mn,h as Be,i as un,u as We,v as gt,x as ro,y as k}from"./chunk-EA53JFDQ.js";import{$g as ft,Fh as Te,Nh as wn,ah as dn,b as an,d as m,e as M,g as v,hg as io,j as sn,k as oe,l as A,wh as ln}from"./chunk-7M7K7CM3.js";import{db as Ee}from"./chunk-OM34V22N.js";import{a as R}from"./chunk-LO2NM3CE.js";var jt="application/x-wa-home-map-entity",$r=new Set(["light","switch","fan","climate","humidifier","water_heater","sensor","binary_sensor","media_player","lock","cover","valve","camera","vacuum","alarm_control_panel","siren","input_boolean","remote"]);function kr(s,e){let t=s?.entities?.[e];if(t===void 0)return;if(typeof t.area_id=="string"&&t.area_id!=="")return t.area_id;let o=t.device_id?s?.devices?.[t.device_id]:void 0;return typeof o?.area_id=="string"&&o.area_id!==""?o.area_id:void 0}function $i(s){let e=[];for(let[t,o]of Object.entries(s?.states??{})){let n=s?.entities?.[t];if(n?.hidden===!0)continue;let i=o?.attributes?.friendly_name,r=kr(s,t),a=r===void 0?void 0:s?.areas?.[r]?.name?.trim()||r,d=o?.attributes?.device_class;e.push({entityId:t,name:typeof i=="string"&&i.trim()!==""?i.trim():t,domain:t.slice(0,t.indexOf(".")),areaId:r,areaName:a,deviceClass:typeof d=="string"?d:void 0,category:typeof n?.entity_category=="string"?n.entity_category:void 0})}return e.sort((t,o)=>t.name.localeCompare(o.name)||t.entityId.localeCompare(o.entityId))}function xr(s){return new Set(s.floors.flatMap(e=>e.pins.map(t=>t.entityId)))}function ki(s,e,t){let o=xr(s),n=new Map;for(let r of t){if(o.has(r.entityId)||r.areaId===void 0||r.category!==void 0||!$r.has(r.domain))continue;let a=n.get(r.areaId);a===void 0&&n.set(r.areaId,a={areaId:r.areaId,name:r.areaName??r.areaId,here:!1,devices:[]}),a.devices.push(r)}let i=e.rooms.map(r=>r.areaId).filter(r=>r!==void 0);for(let r of n.values())r.here=i.includes(r.areaId);return[...n.values()].sort((r,a)=>{let d=i.indexOf(r.areaId),l=i.indexOf(a.areaId);return d>=0||l>=0?(d<0?1/0:d)-(l<0?1/0:l):r.name.localeCompare(a.name)})}function xi(s,e){let t=new Set(s.rooms.map(o=>o.areaId).filter(o=>o!==void 0));return e.filter(o=>t.has(o.areaId)).reduce((o,n)=>o+n.devices.length,0)}function Hi(s,e,t=40){let o=e.toLowerCase().split(/\s+/).filter(a=>a!=="");if(o.length===0)return[];let n=a=>`${a.name} ${a.entityId} ${a.areaName??""}`.toLowerCase(),i=s.filter(a=>o.every(d=>n(a).includes(d))),r=e.trim().toLowerCase();return i.sort((a,d)=>+!a.name.toLowerCase().startsWith(r)-+!d.name.toLowerCase().startsWith(r)).slice(0,t)}var Hr=[["lights","Lights"],["climate","Climate"],["sensors","Sensors"],["power","Power"],["media","Media"],["security","Security"],["covers","Covers"],["other","Other"]];function Do(s){switch(s.slice(0,s.indexOf("."))){case"light":return"lights";case"climate":case"fan":case"humidifier":case"water_heater":return"climate";case"sensor":case"binary_sensor":return"sensors";case"switch":case"input_boolean":return"power";case"media_player":case"remote":return"media";case"lock":case"camera":case"alarm_control_panel":case"siren":return"security";case"cover":case"valve":return"covers";default:return"other"}}function Pi(s){let e=new Map;for(let t of s.pins){let o=Do(t.entityId);e.set(o,(e.get(o)??0)+1)}return Hr.filter(([t])=>e.has(t)).map(([t,o])=>({kind:t,label:o,count:e.get(t)}))}function Ei(s){return s.replace(/_/g," ")}function me(s,e){let t=e?.[s];if(t===void 0)return"gone";let o=String(t.state??""),n=s.slice(0,s.indexOf(".")),i=t.attributes??{};if(n==="light"&&o==="on"&&typeof i.brightness=="number")return`on \xB7 ${Math.round(i.brightness/255*100)}%`;if(n==="climate"&&typeof i.current_temperature=="number")return`${o} \xB7 ${i.current_temperature}\xB0`;let r=typeof i.unit_of_measurement=="string"?i.unit_of_measurement:"";return r!==""&&o!==""&&Number.isFinite(Number(o))?`${o} ${r}`.replace(" \xB0","\xB0").replace(" %","%"):o.replace(/_/g," ")}function Oo(s){return["light","switch","fan","input_boolean","media_player","cover","humidifier","siren"].includes(s.slice(0,s.indexOf(".")))}function Ao(s,e){let t=String(e?.[s]?.state??"");return s.startsWith("cover.")?t==="open"||t==="opening"?"Close":"Open":t==="on"||t==="playing"||t==="paused"||t==="idle"?"Turn off":"Turn on"}var _o=[["Floor",.3],["Table",.8],["Wall",1.6],["Ceiling",2.5]],Lo=[[void 0,"As the tile does"],["toggle","Turn on or off"],["details","Show details"],["page","Open a page"],["none","Nothing"]];function Fo(s,e){for(let t of s.floors){let o=t.pins.find(n=>n.entityId===e);if(o!==void 0)return{floorId:t.id,pinId:o.id}}}function Ti(s,e){return e===void 0?void 0:s.rooms.find(t=>t.areaId!==void 0&&t.areaId===e)}function re(s){return s?.kind==="pin"?[s.pinId]:s?.kind==="pins"?s.pinIds.slice():[]}function it(s){let e=[];for(let t of s)e.some(o=>k(o,t))||e.push(t);if(e.length!==0)return e.length===1?{kind:"pin",pinId:e[0]}:{kind:"pins",pinIds:e}}function ke(s,e){let t=re(s);return t.some(o=>k(o,e))?it(t.filter(o=>!k(o,e))):it([...t,e])}function Si(s,e){return it([...re(s),...e])}function Ci(s,e,t){let[o,n]=[Math.min(e[0],t[0]),Math.max(e[0],t[0])],[i,r]=[Math.min(e[1],t[1]),Math.max(e[1],t[1])];return s.filter(a=>a.at[0]>=o&&a.at[0]<=n&&a.at[1]>=i&&a.at[1]<=r).map(a=>a.id)}function Q(s){if(s.length===0)return{mixed:!0};let e=JSON.stringify(s[0])??"undefined";return s.every(t=>(JSON.stringify(t)??"undefined")===e)?{mixed:!1,value:s[0]}:{mixed:!0}}function Ri(s,e){if(s.length===0||!s.every(Oo))return;let t=s.every(n=>n.startsWith("cover.")),o=s.some(n=>{let i=Ao(n,e);return i==="Turn off"||i==="Close"});return t?o?{words:"Close",service:"turn_off"}:{words:"Open",service:"turn_on"}:o?{words:"Turn off",service:"turn_off"}:{words:"Turn on",service:"turn_on"}}function ue(s){return s===void 0||s.kind==="pin"||s.kind==="pins"||s.kind==="objects"?void 0:s.roomId}function xe(s){return s?.kind==="object"?[{roomId:s.roomId,object:s.object}]:s?.kind==="objects"?s.items.map(e=>({roomId:e.roomId,object:e.object})):[]}var Kt=(s,e)=>k(s.roomId,e.roomId)&&s.object===e.object;function Ii(s){let e=[];for(let t of s)e.some(o=>Kt(o,t))||e.push({roomId:t.roomId,object:t.object});if(e.length!==0)return e.length===1?{kind:"object",roomId:e[0].roomId,object:e[0].object}:{kind:"objects",items:e}}function He(s,e){let t=xe(s);return t.some(o=>Kt(o,e))?Ii(t.filter(o=>!Kt(o,e))):Ii([...t,e])}function Di(s,e,t){return xe(s).some(o=>Kt(o,{roomId:e,object:t}))}function Oi(s,e){if(e===void 0)return!0;if(s===void 0)return!1;if(e.kind==="pin")return s.pins.some(o=>k(o.id,e.pinId));if(e.kind==="pins")return e.pinIds.every(o=>s.pins.some(n=>k(n.id,o)));if(e.kind==="objects")return e.items.every(o=>s.rooms.find(n=>k(n.id,o.roomId))?.objects[o.object]!==void 0);let t=s.rooms.find(o=>k(o.id,e.roomId));if(t===void 0)return!1;switch(e.kind){case"room":return!0;case"wall":return K(t)[e.wall]!==void 0;case"corner":return t.outline[e.corner]!==void 0;case"opening":return t.openings[e.opening]!==void 0;case"object":return t.objects[e.object]!==void 0}}var Ai=4,_i=2400;function Li(s,e){return[s.ox+e[0]*s.scale,s.oy+e[1]*s.scale]}function Fe(s,e){return[(e[0]-s.ox)/s.scale,(e[1]-s.oy)/s.scale]}function zo(s,e,t,o=72,n=96){let r=s===void 0||s.rooms.length===0&&s.pins.length===0?{minX:-5,minY:-5,maxX:5,maxY:5}:vt(s),a=Math.max(r.maxX-r.minX,1),d=Math.max(r.maxY-r.minY,1),l=Bi(Math.min(Math.max(e-o*2,40)/a,Math.max(t-n*2,40)/d),Ai,_i);return{scale:l,ox:e/2-(r.minX+r.maxX)/2*l,oy:t/2-(r.minY+r.maxY)/2*l}}function No(s,e,t){let o=Bi(s.scale*e,Ai,_i),n=o/s.scale;return{scale:o,ox:t[0]-(t[0]-s.ox)*n,oy:t[1]-(t[1]-s.oy)*n}}function Fi(s,e){return Math.round(s.scale/e.scale*100)}var rt=1.25;function zi(s){if(typeof s!="object"||s===null)return;let e=s;return{tag:typeof e.tagName=="string"?e.tagName.toUpperCase():"",type:typeof e.type=="string"?e.type.toLowerCase():"text",editable:e.isContentEditable===!0}}var Ni=["button","submit","reset","image"],Pr=["checkbox","radio","range","color","file"];function jo(s){let e=zi(s);return e===void 0?!1:e.editable||e.tag==="TEXTAREA"?!0:e.tag==="INPUT"&&!Ni.includes(e.type)&&!Pr.includes(e.type)}function ji(s){let e=zi(s);return e===void 0?!1:jo(s)||e.tag==="SELECT"?!0:e.tag==="INPUT"&&!Ni.includes(e.type)}function Z(s,e){if(e)return;let t=s.metaKey===!0||s.ctrlKey===!0,o=s.key.length===1?s.key.toLowerCase():s.key;if(t)return o==="z"?s.shiftKey===!0?"redo":"undo":o==="y"?"redo":void 0;if(s.altKey===!0)return;switch(o){case"Escape":return"cancel";case"Delete":case"Backspace":return"delete";case"Enter":return"enter";case"+":case"=":return"zoomIn";case"-":return"zoomOut";case"0":return"fit"}let n=s.shiftKey===!0?.1:.01;if(o==="ArrowLeft")return{nudge:[-n,0]};if(o==="ArrowRight")return{nudge:[n,0]};if(o==="ArrowUp")return{nudge:[0,-n]};if(o==="ArrowDown")return{nudge:[0,n]};if(/^[a-z]$/.test(o)&&s.shiftKey!==!0)return{letter:o}}function Ko(){let s=globalThis.navigator,e=`${typeof s?.platform=="string"?s.platform:""} ${typeof s?.userAgent=="string"?s.userAgent:""}`;return/Mac|iPhone|iPad/.test(e)}function Ki(){return Ko()?"\u2318Z":"Ctrl+Z"}var Bi=(s,e,t)=>Math.min(Math.max(s,e),t);function at(s,e=2){return`${(Math.round(s*10**e)/10**e).toFixed(e)} m`}function st(s,e=2){let t=(Math.round(s*10**e)/10**e).toFixed(e);return/^-0(\.0*)?$/.test(t)?t.slice(1):t}function Bo(s){let e=s.trim().replace(",",".").replace(/\s*(m|cm|°|deg)$/i,"");if(e===""||!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(e))return;let t=Number(e);if(Number.isFinite(t))return/cm$/i.test(s.trim())?t/100:t}function Bt(s){if(s.outline.length<3)return{width:0,depth:0,area:0};let{a0:e,a1:t,c0:o,c1:n}=mo(s,ho(s));return{width:t-e,depth:n-o,area:Math.abs(Pt(s.outline))}}function ze(s){let{width:e,depth:t}=Bt(s);return`${e.toFixed(1)} \xD7 ${t.toFixed(1)} m`}function Wi(s){if(s.outline.length<3)return s.outline.slice();let{a0:e,a1:t,c0:o,c1:n,point:i}=mo(s,ho(s));return[i(e,o),i(t,o),i(t,n),i(e,n)]}function Gi(s,e){let t=K(s)[e];if(t===void 0)return"inner";let o=Math.max(Math.hypot(t.b[0]-t.a[0],t.b[1]-t.a[1]),1e-9),n=-(t.b[1]-t.a[1])/o,i=(t.b[0]-t.a[0])/o,r=[(t.a[0]+t.b[0])/2,(t.a[1]+t.b[1])/2],a=Math.max(t.t,.1)+.1,d=Ge(s.outline,[r[0]+n*a,r[1]+i*a]),l=Ge(s.outline,[r[0]-n*a,r[1]-i*a]);if(d&&l)return"inner";if(d)n=-n,i=-i;else if(!l){let h=Y(s);h!==void 0&&(h[0]-r[0])*n+(h[1]-r[1])*i>0&&(n=-n,i=-i)}return Math.abs(n)>Math.abs(i)?n>0?"right":"left":i>0?"bottom":"top"}function Wo(s,e,t){let o=Gi(s,e);return`${t}, ${o} wall`}function Ui(s){let e=K(s).map((o,n)=>Gi(s,n)),t=new Map;return e.map((o,n)=>{let i=(t.get(o)??0)+1;t.set(o,i);let r=`${o.charAt(0).toUpperCase()}${o.slice(1)} wall`;return i===1&&e.indexOf(o,n+1)<0?r:`${r} ${i}`})}function ce(s){return s.kind==="opening"?"Way through":s.kind==="window"?s.style==="sliding"?"Sliding window":"Window":s.style==="double"?"Double door":s.style==="sliding"?"Sliding door":"Door"}var Er={sofa:"Sofa",table:"Table",chair:"Chair",bed:"Bed",storage:"Storage",television:"TV",bathtub:"Bath",sink:"Basin",toilet:"Toilet",stove:"Hob",oven:"Oven",refrigerator:"Fridge",dishwasher:"Dishwasher",washerDryer:"Washer dryer",fireplace:"Fireplace",stairs:"Stairs"};function dt(s){let e=Er[s];if(e!==void 0)return e;let t=s.replace(/([a-z0-9])([A-Z])/g,"$1 $2").toLowerCase();return t.charAt(0).toUpperCase()+t.slice(1)}function C(s,e,t=`${e}s`){return`${s} ${s===1?e:t}`}function H(s,e,t,o=""){return m`<section class="hme-card ${o}">
    <div class="hme-h">${s}${t===void 0?v:m`<span class="hme-h-end">${t}</span>`}</div>
    ${e}
  </section>`}function O(s,...e){return m`<div class="hme-r"><span class="hme-l">${s}</span>${e}</div>`}function B(s){return m`<p class="hme-hint">${s}</p>`}var Vi=3;function Tr(s,e){return s==="\xB0"?1:10**-e}function I(s){let e=s.digits??2,t=s.step??Tr(s.unit,e),o=s.value===void 0?"":st(s.value,e),n=d=>Math.min(Math.max(d,s.min??-1/0),s.max??1/0),i=d=>st(d,e)===o,r=d=>{let l=Bo(d.value);if(l===void 0||s.min!==void 0&&l<s.min||s.max!==void 0&&l>s.max||i(l)){d.value=o;return}s.set(l)},a=d=>{let l=d.currentTarget,h=l.querySelector("input");if(h===null||s.disabled===!0||d.button!==0||h.matches(":focus"))return;d.preventDefault();let p=s.value,c=d.clientX,f=!1,g=p;try{l.setPointerCapture(d.pointerId)}catch{}let u=w=>{if(p===void 0)return;let y=w.clientX-c;if(!f&&Math.abs(y)<Vi)return;f||l.classList.add("scrubbing"),f=!0;let P=w.shiftKey?10:w.altKey?.1:1;g=n(Number((p+(y-Math.sign(y)*Vi)*t*P).toFixed(e+(w.altKey?1:0)))),h.value=st(g,e),s.preview?.(g)},b=w=>{if(l.removeEventListener("pointermove",u),l.removeEventListener("pointerup",b),l.removeEventListener("pointercancel",b),l.classList.remove("scrubbing"),!f){h.focus(),h.select();return}s.preview?.(void 0),w.type!=="pointercancel"&&g!==void 0&&!i(g)?s.set(g):h.value=o};l.addEventListener("pointermove",u),l.addEventListener("pointerup",b),l.addEventListener("pointercancel",b)};return m`<span class="hme-in hme-num ${s.disabled===!0?"off":""}" style=${s.width===void 0?v:`flex:0 0 ${s.width}`}
    title=${s.disabled===!0?v:"Drag sideways to change it, click to type"} @pointerdown=${a}>
    ${s.tag===void 0?v:m`<span class="hme-ntag" aria-hidden="true">${s.tag}</span>`}
    <input type="text" inputmode="decimal" aria-label=${s.label} .value=${j(o)} ?disabled=${s.disabled===!0}
      placeholder=${s.value===void 0?"Mixed":""}
      @change=${d=>r(d.target)}
      @keydown=${d=>{let l=d.target;if(d.key==="Enter"&&l.blur(),d.key==="Escape"&&(l.value=o,l.blur()),(d.key==="ArrowUp"||d.key==="ArrowDown")&&s.value!==void 0){d.preventDefault();let h=Bo(l.value)??s.value,p=n(Number((h+(d.key==="ArrowUp"?1:-1)*t*(d.shiftKey?10:1)).toFixed(e)));l.value=st(p,e),i(p)||s.set(p)}}} />${s.unit===void 0?v:m`<span class="hme-unit">${s.unit}</span>`}</span>`}var Ne=new WeakMap,Xi=new WeakMap;function lt(s){let e=s.value.toLowerCase(),t=o=>{let n=Ne.get(o);n!==void 0&&(Ne.delete(o),s.preview(void 0),o.value.toLowerCase()!==n&&(Xi.set(o,o.value.toLowerCase()),s.set(o.value)))};return m`<input type="color" .value=${j(e)} aria-label=${s.label}
    @input=${o=>{let n=o.target;Ne.has(n)||Ne.set(n,e);let i=n.value.toLowerCase();s.preview(i===Ne.get(n)?void 0:i)}}
    @change=${o=>{let n=o.target,i=n.value.toLowerCase();Ne.has(n)?t(n):i!==e&&i!==Xi.get(n)&&s.set(n.value)}}
    @blur=${o=>t(o.target)} />`}function pt(...s){return m`<div class="hme-fields" style=${`--n:${s.length}`}>${s}</div>`}function ht(s,...e){return m`<div class="hme-group"><div class="hme-gl">${s}</div>${e}</div>`}function mt(s){return m`<span class="hme-in"><input type="text" aria-label=${s.label} maxlength=${s.max??100} placeholder=${s.placeholder??""}
    .value=${j(s.value)}
    @change=${e=>{let t=e.target.value;t.trim()!==s.value.trim()&&s.set(t)}}
    @keydown=${e=>{e.key==="Enter"&&e.target.blur()}} /></span>`}function Pe(s){return m`<span class="hme-in hme-sel ${s.cls??""}"><select aria-label=${s.label} @change=${e=>s.set(e.target.value)}>
    ${s.options.map(e=>m`<option value=${e.value} ?disabled=${e.disabled===!0} .selected=${j(e.value===s.value)}>${e.label}</option>`)}
  </select></span>`}function Go(s){return m`<span class="hme-menu ${s.cls??""}"><select aria-label=${s.label} @change=${e=>{let t=e.target,o=t.value;t.value="",o!==""&&s.pick(o)}}>
    <option value="" .selected=${j(!0)}>${s.label}</option>
    ${s.options.map(e=>m`<option value=${e.value} ?disabled=${e.disabled===!0}>${e.label}</option>`)}
  </select><span class="hme-menu-caret" aria-hidden="true">▾</span></span>`}function V(s){return m`<button type="button" class="hme-pic ${s.on?"on":""}" aria-pressed=${s.on?"true":"false"} title=${s.title??s.label}
    @click=${s.click}>${s.picture}<span>${s.label}</span></button>`}function je(s){return m`<button type="button" class="hme-chip ${s.on?"":"off"}" aria-pressed=${s.on?"true":"false"} aria-label=${s.label}
    @click=${s.click}>${s.on?s.onText:s.offText}</button>`}var Sr={wood:"repeating-linear-gradient(0deg,#b38a61 0 9px,#8e6845 9px 10px)",tile:"linear-gradient(#a9a7a1 1px,transparent 1px) 0 0/10px 10px, linear-gradient(90deg,#a9a7a1 1px,transparent 1px) 0 0/10px 10px, #cbc9c2",stone:"#bcc1c6 linear-gradient(#9da2a6 1px,transparent 1px) 0 0/18px 12px",carpet:"#99928a",plain:"#a8a6a1"},Uo={wood:"#a17a55",tile:"#bdbbb4",stone:"#b0b5ba",carpet:"#8f8880",plain:"#9c9a95"};function Vo(s){return m`<span class="hme-sw" style=${`background:${Sr[s]}`}></span>`}var qi=s=>s.map(([e,t])=>`${Math.round(e*10)/10},${Math.round(t*10)/10}`).join(" ");function Xo(s,e=34,t=24){let o=s?.rooms??[];if(o.length===0)return m`<svg class="hme-thumb" width=${e} height=${t} viewBox=${`0 0 ${e} ${t}`} aria-hidden="true">
      <rect x="1" y="1" width=${e-2} height=${t-2} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" stroke-dasharray="3 2" /></svg>`;let n=vt(s),i=4,r=Math.min((e-i*2)/Math.max(n.maxX-n.minX,.5),(t-i*2)/Math.max(n.maxY-n.minY,.5)),a=e/2-(n.minX+n.maxX)/2*r,d=t/2-(n.minY+n.maxY)/2*r;return m`<svg class="hme-thumb" width=${e} height=${t} viewBox=${`0 0 ${e} ${t}`} aria-hidden="true">
    <rect x="0.5" y="0.5" width=${e-1} height=${t-1} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" />
    ${o.map(l=>M`<polygon points=${qi(l.outline.map(([h,p])=>[a+h*r,d+p*r]))} fill="none" stroke="var(--wa-muted)" stroke-width="1.1" />`)}
  </svg>`}function Yi(s,e,t=76,o=54){let n=s.outline.map(u=>u[0]),i=s.outline.map(u=>u[1]),r=Math.min(...n),a=Math.max(...n),d=Math.min(...i),l=Math.max(...i),h=8,p=Math.min((t-h*2)/Math.max(a-r,.5),(o-h*2)/Math.max(l-d,.5)),c=t/2-(r+a)/2*p,f=o/2-(d+l)/2*p,g=qi(s.outline.map(([u,b])=>[c+u*p,f+b*p]));return m`<svg class="hme-room-thumb" width=${t} height=${o} viewBox=${`0 0 ${t} ${o}`} aria-hidden="true">
    <rect width=${t} height=${o} rx="8" fill="#121010" />
    <polygon points=${g} fill=${Uo[Se(s)]} stroke="#ece6da" stroke-width="2.5" stroke-linejoin="round" />
    ${e?M`<circle cx=${t*.58} cy=${o*.42} r=${Math.min(t,o)*.22} fill="#ffb648" opacity="0.35" />`:v}
  </svg>`}function qo(s,e,t,o={}){let n=(o.reach??10)/t,i,r=n;for(let l of[...s.rooms.flatMap(h=>h.outline),...o.corners??[]]){let h=Math.hypot(l[0]-e[0],l[1]-e[1]);h<=r&&(i=l,r=h)}if(i!==void 0)return[i[0],i[1]];let[a,d]=e;if(o.grid!==void 0&&o.grid>0&&(a=Math.round(a/o.grid)*o.grid,d=Math.round(d/o.grid)*o.grid),o.from!==void 0){let l=8/t;Math.abs(e[0]-o.from[0])<=l&&(a=o.from[0]),Math.abs(e[1]-o.from[1])<=l&&(d=o.from[1])}return[Math.round(a*100)/100,Math.round(d*100)/100]}var fe=.1,ge=.05,Wt=class{constructor(e){this.grid=e;this.active=!1;this.points=[]}start(e){this.active=!0,this.points=[],this.hoverAt=void 0,e.select(void 0),e.redraw()}stop(e){this.active=!1,this.points=[],this.hoverAt=void 0,e?.redraw()}snap(e,t){return qo(e.floor,t,e.view.scale,{...this.points.length>0?{from:this.points[this.points.length-1]}:{},...e.toggles.grid?{grid:this.grid}:{},corners:this.points})}closes(e,t){let o=this.points[0];return o!==void 0&&this.points.length>=3&&Math.hypot(t[0]-o[0],t[1]-o[1])*e.view.scale<=10}pointerDown(e,t,o){if(!this.active||t.button!==0)return!1;let n=this.snap(e,o);if(this.closes(e,n))return this.finish(e),!0;let i=this.points[this.points.length-1];return(i===void 0||Math.hypot(n[0]-i[0],n[1]-i[1])>=.05)&&this.points.push(n),e.redraw(),!0}hover(e,t){this.active&&(this.hoverAt=t===void 0?void 0:this.snap(e,t),e.redraw())}keyDown(e,t){return this.active?t.key==="Escape"?(this.stop(e),!0):t.key==="Enter"?(this.points.length>=3&&this.finish(e),!0):t.key==="Backspace"||t.key==="Delete"?(this.points.pop(),e.redraw(),!0):!1:!1}async finish(e){let t=this.points.slice();if(this.stop(e),t.length<3)return;let o=await e.ask({title:"Name the room",label:"Name",value:"Room",ok:"Add room"});if(o===void 0)return;let n=e.newId(),i=e.floor.id;e.apply(r=>Qn(r,i,n,t,o),{select:{kind:"room",roomId:n}})||e.note("err","That room could not be added. Draw at least three corners round some floor.")}overlay(e){if(!this.active)return v;let t=this.points.map(d=>e.toScreen(d)),o=this.hoverAt===void 0?void 0:e.toScreen(this.hoverAt),n=this.hoverAt!==void 0&&this.closes(e,this.hoverAt),i=[...t,...o!==void 0?[o]:[]].map(([d,l])=>`${d.toFixed(1)},${l.toFixed(1)}`).join(" "),r=this.points[this.points.length-1],a=r!==void 0&&this.hoverAt!==void 0?Math.hypot(this.hoverAt[0]-r[0],this.hoverAt[1]-r[1]):0;return M`<g class="hme-draw">
      ${t.length>=3?M`<polygon points=${t.map(([d,l])=>`${d},${l}`).join(" ")} fill="rgba(91,141,239,0.14)" stroke="none" />`:v}
      <polyline points=${i} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />
      ${t.map(([d,l],h)=>M`<circle cx=${d} cy=${l} r=${h===0&&n?8:5} fill=${h===0&&n?"#5b8def":"#fff"} stroke="#5b8def" stroke-width="2" />`)}
      ${o!==void 0&&!n?M`<circle cx=${o[0]} cy=${o[1]} r="4" fill="#5b8def" />`:v}
      ${o!==void 0&&a>.05?M`<g class="hme-tag"><rect x=${o[0]+10} y=${o[1]-26} width="58" height="18" rx="9" fill="#5b8def" />
        <text x=${o[0]+39} y=${o[1]-13} fill="#fff" text-anchor="middle">${a.toFixed(2)} m</text></g>`:v}
    </g>`}hint(){return this.points.length===0?"Click to put down the first corner":this.points.length<3?"Click to add corners":"Click the first corner or press Enter to close the room"}};var Yo;function Gt(){return Yo??=import("./scene3d-UF7HHY7L.js").catch(s=>{throw Yo=void 0,s}),Yo}function Zo(s){return new URL("furniture/",s).href}var Zi={wood:"Wood",tile:"Tile",stone:"Stone",carpet:"Carpet",plain:"Plain"},Cr={wood:[{name:"Light oak",hex:"#D9B88A"},{name:"Oak",hex:"#B98B5A"},{name:"Walnut",hex:"#6B4A32"},{name:"Grey wash",hex:"#9A948C"}],tile:[{name:"White",hex:"#E9E7E2"},{name:"Grey",hex:"#8E8E8A"},{name:"Black",hex:"#2E2E30"},{name:"Terracotta",hex:"#B4664A"}],stone:[{name:"Light",hex:"#C9C3B8"},{name:"Sand",hex:"#B8A98E"},{name:"Slate",hex:"#5E6468"}],carpet:[{name:"Grey",hex:"#8E8E93"},{name:"Beige",hex:"#CBB9A0"},{name:"Navy",hex:"#2E4A7D"},{name:"Green",hex:"#4F6B4A"}],plain:[{name:"White",hex:"#E9E7E2"},{name:"Grey",hex:"#8E8E8A"},{name:"Black",hex:"#2E2E30"}]},Rr=[{name:"White",hex:"#F2F0EB"},{name:"Warm white",hex:"#EDE6D8"},{name:"Greige",hex:"#CFC6B8"},{name:"Sage",hex:"#A3B09A"},{name:"Blue grey",hex:"#8C9AA6"},{name:"Charcoal",hex:"#3E4044"}];function Jo(s){let e=s.mixed===!0,t=e?void 0:s.now?.toUpperCase(),o=t!==void 0&&!s.presets.some(n=>n.hex===t);return m`<div class="hme-r top"><span class="hme-l">${s.word}</span>
    <div class="hme-chips hme-colours" role="group" aria-label=${`${s.word} colour`}>
      <button type="button" class="hme-chip sel ${t===void 0&&!e?"on":""}" aria-pressed=${t===void 0&&!e?"true":"false"}
        title=${s.defaultTitle} @click=${()=>s.set(void 0)}>Default</button>
      ${s.presets.map(n=>m`<button type="button" class="hme-colour ${t===n.hex?"on":""}" style=${`--c:${n.hex}`}
        title=${n.name} aria-label=${`${s.word}: ${n.name}`} aria-pressed=${t===n.hex?"true":"false"} @click=${()=>s.set(n.hex)}></button>`)}
      <label class="hme-chip sel hme-pick ${o?"on":""}" title=${s.customTitle}>${o?m`<span class="hme-swatch" style=${`background:${t}`}></span>`:v}Custom
        ${lt({value:t??s.presets[0].hex,label:s.customLabel,preview:s.preview,set:s.set})}</label>
    </div></div>
    ${e?B(`Mixed: their ${s.word.toLowerCase()} colours differ. Pick one to set them all.`):v}`}var Ut=15,Ir=[{a:0,c:0},{c:0},{a:1,c:0},{a:1},{a:1,c:1},{c:1},{a:0,c:1},{a:0}];function Dr(s,e){let t=(Math.atan2(e,s)*180/Math.PI+180)%180;return["ew-resize","nwse-resize","ns-resize","nesw-resize"][Math.round(t/45)%4]}function Or(s,e){let t=e===0?"":` Its ${C(e,"device")} come${e===1?"s":""} off the map too.`;return`${T(s)} comes off the map.${t} A scanned room comes back only by scanning it again on the iPhone. Undo brings it back while this page is open.`}function X(s){return Ro(s.model)?.name??dt(s.kind)}function Ji(s){let e=s.map(t=>X(t.object));return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function Qi(s){let e=s[0]?.room.id;return e!==void 0&&s.every(t=>k(t.room.id,e))?{kind:"room",roomId:e}:void 0}var Ar=["fabric","wood"],ut=s=>s.map(e=>({roomId:e.room.id,object:e.index}));function Qo(s){return Rn(zt(s))}function er(s){let e=ue(s.selection),t=e===void 0?void 0:s.floor.rooms.find(r=>k(r.id,e));if(t!==void 0)return t;let o=Fe(s.view,[s.stage.width/2,s.stage.height/2]),n=U(s.floor,o);if(n!==void 0)return n;let i;for(let r of s.floor.rooms){let a=ne(r),d=Math.hypot(a[0]-o[0],a[1]-o[1]);(i===void 0||d<i.d)&&(i={room:r,d})}return i?.room}function _r(s,e,t){let o=vi(s,t).filter(r=>e===""||r.group===e);if(s.trim()!==""||e!=="")return[{title:e===""?"Found":e,pieces:o}];let n=[],i=t===void 0?[]:o.filter(r=>r.kind===t);i.length>0&&n.push({title:`${dt(t)} pieces`,pieces:i});for(let r of Ft.groups){let a=o.filter(d=>d.group===r&&!i.includes(d));a.length>0&&n.push({title:r,pieces:a})}return n}function Lr(s){return Math.round(Sn(s.turn)*10)/10}var z=s=>s.toFixed(1),ee=s=>`${s[0].toFixed(1)},${s[1].toFixed(1)}`,Vt=class{constructor(){this.draw=new Wt(fe);this.guides=[];this.dragging=!1;this.resizing=!1;this.pickerQuery="";this.pickerGroup="";this.pickerFocus=!1;this.thumbs=new Map;this.askedThumbs=new Set;this.thumbFrame=0}openPicker(e,t,o){this.picker=o===void 0?{roomId:t.id}:{roomId:t.id,index:o},this.pickerQuery="",this.pickerGroup="",this.pickerFocus=!0,e.redraw()}closePicker(e){this.picker=void 0,e.redraw()}get pickerOpen(){return this.picker!==void 0}thumb(e,t){let o=this.thumbs.get(t),n=e.furnitureBase;if(o!==void 0||n===void 0||this.askedThumbs.has(t))return o;this.askedThumbs.add(t),Gt().then(i=>i.homeMapPieceThumb(n,t)).then(i=>{if(i===void 0||(this.thumbs.set(t,i),this.thumbFrame!==0))return;let r=typeof requestAnimationFrame=="function"?requestAnimationFrame:a=>setTimeout(a,16);this.thumbFrame=r(()=>{this.thumbFrame=0,e.redraw()})},()=>{})}piecePic(e,t,o){let n=t===void 0?void 0:this.thumb(e,t.id);return m`<span class="${o} ${n===void 0?"wait":""}">${n===void 0?v:m`<img src=${n} alt="" draggable="false" />`}</span>`}pickPiece(e,t){let o=this.picker,n=o===void 0?void 0:e.floor.rooms.find(d=>k(d.id,o.roomId));if(this.picker=void 0,o===void 0||n===void 0){e.redraw();return}let i=n.id;if(o.index!==void 0){let d=o.index;e.apply(l=>Xn(l,i,d,t),{select:{kind:"object",roomId:i,object:d}})||e.redraw();return}let r=Y(n)??ne(n),a=n.objects.length;e.apply(d=>Vn(d,i,t,r),{select:{kind:"object",roomId:i,object:a}})||e.redraw()}sheet(e){let t=this.picker;if(t===void 0)return v;let o=e.floor.rooms.find(c=>k(c.id,t.roomId)),n=t.index===void 0?void 0:o?.objects[t.index];if(o===void 0||t.index!==void 0&&n===void 0)return this.picker=void 0,v;let i=n===void 0?void 0:zt(n),r=_r(this.pickerQuery,this.pickerGroup,n?.kind),a=n===void 0?"Add furniture":"Change model",d=n===void 0?`To ${T(o)}, in its middle. Drag it into place once it is in.`:`${X(n)} in ${T(o)} keeps its place, size and turn.`,l=c=>Ft.pieces.filter(f=>c===""||f.group===c).length,h=["",...Ft.groups],p=this.pickerFocus;return this.pickerFocus=!1,m`<div class="hme-scrim hme-sheet"
      @pointerdown=${c=>{c.target===c.currentTarget&&this.closePicker(e)}}
      @keydown=${c=>{c.stopPropagation(),c.key==="Escape"&&this.closePicker(e)}}>
      <div class="hme-fpick" role="dialog" aria-modal="true" aria-label=${a}>
        <header class="hme-fpick-head">
          <div class="hme-fpick-t"><strong>${a}</strong><span>${d}</span></div>
          <label class="hme-find hme-fpick-find"><span aria-hidden="true">⌕</span>
            <input type="search" placeholder="Find a piece: sofa, lamp, desk" aria-label="Find a piece" .value=${j(this.pickerQuery)}
              ${gi(c=>{p&&c instanceof HTMLInputElement&&setTimeout(()=>c.focus(),0)})}
              @input=${c=>{this.pickerQuery=c.target.value,e.redraw()}} /></label>
          <button type="button" class="hme-x hme-fpick-close" aria-label="Close" title="Close (Esc)" @click=${()=>this.closePicker(e)}>×</button>
        </header>
        <div class="hme-fpick-main">
          <nav class="hme-fpick-groups" aria-label="Groups">
            ${h.map(c=>m`<button type="button" class="hme-tool ${c===this.pickerGroup?"on":""}" aria-pressed=${c===this.pickerGroup?"true":"false"}
              @click=${()=>{this.pickerGroup=c,e.redraw()}}>${c===""?"All":c}<span class="n">${l(c)}</span></button>`)}
          </nav>
          <div class="hme-fpick-body">
            ${r.every(c=>c.pieces.length===0)?m`<p class="hme-empty-line">No piece by that name${this.pickerGroup===""?"":` in ${this.pickerGroup}`}.</p>`:v}
            ${r.filter(c=>c.pieces.length>0).map(c=>m`<section class="hme-fpick-sec">
              <div class="hme-h">${c.title}<span class="hme-h-end">${C(c.pieces.length,"piece")}</span></div>
              <div class="hme-fgrid">${c.pieces.map(f=>{let g=i?.id===f.id;return m`<button type="button" class="hme-fcard ${g?"on":""}" aria-pressed=${g?"true":"false"}
                  title=${`${n===void 0?"Add":"Use"} ${f.name}, ${uo(f)}`} @click=${()=>this.pickPiece(e,f)}>
                  ${this.piecePic(e,f,"hme-fcard-pic")}
                  <span class="hme-fcard-name">${f.name}</span>
                  <span class="hme-fcard-size mono">${uo(f)}</span>
                </button>`})}</div>
            </section>`)}
          </div>
        </div>
      </div>
    </div>`}stopDrag(e){this.guides=[],this.dragging=!1,this.resizing=!1,e.preview(void 0)}focus(e){let t=ue(e.selection);return t===void 0?void 0:e.floor.rooms.find(o=>k(o.id,t))}pickedMany(e){if(e.selection?.kind==="objects")return xe(e.selection).flatMap(t=>{let o=e.floor.rooms.find(i=>k(i.id,t.roomId)),n=o?.objects[t.object];return o===void 0||n===void 0?[]:[{room:o,index:t.object,object:n}]})}picked(e){let t=e.selection;if(t?.kind!=="object")return;let o=this.focus(e),n=o?.objects[t.object];return o===void 0||n===void 0?void 0:{room:o,index:t.object,object:n}}thingUnder(e,t,o){let n;for(let i of o===void 0?e.floor.rooms:[o])i.objects.forEach((r,a)=>{if(r.hidden===!0)return;let d=Ht(xt(r));if(!Ge(d,t))return;let l=Math.abs(Pt(d));(n===void 0||l<n.area)&&(n={thing:{room:i,index:a,object:r},area:l})});return n?.thing}pickThing(e,t,o){e.select({kind:"object",roomId:t.id,object:o})}addFurnitureButton(e,t,o){return m`<button type="button" class=${o} ?disabled=${t===void 0}
      title=${t===void 0?"Draw or scan a room first":`Pick a sofa, a bed, a lamp or more from the furniture catalog for ${T(t)}`}
      @click=${()=>{t!==void 0&&this.openPicker(e,t)}}>＋ Add furniture</button>`}overlay(e){if(this.draw.active)return this.draw.overlay(e);let t=this.focus(e),o=this.picked(e),n=this.pickedMany(e),i=[];for(let r of this.guides)i.push(this.guide(e,r));if(n!==void 0)for(let r of n){let a=Ht(xt(r.object)).map(d=>ee(e.toScreen(d))).join(" ");i.push(M`<polygon class="hme-box" points=${a} fill="rgba(91,141,239,0.1)" stroke="#5b8def" stroke-width="2"
          stroke-dasharray=${r.object.hidden===!0?"5 4":"none"} pointer-events="none" />`)}else if(o!==void 0){let r=o.room.outline.map(d=>ee(e.toScreen(d))).join(" ");i.push(M`<polygon points=${r} fill="none" stroke="#5b8def" stroke-width="1" stroke-dasharray="4 4" opacity="0.5" pointer-events="none" />`);let a=o.object;i.push(this.box(e,Ht(xt(a)),{width:a.size[0],depth:a.size[1]},"thing",a.hidden===!0))}else t!==void 0&&t.outline.length>=3&&i.push(this.box(e,Wi(t),Bt(t),"room",!1));return i.length===0?v:M`${i}`}box(e,t,o,n,i){let r=t.map(w=>e.toScreen(w)),a=r.reduce((w,y)=>[w[0]+y[0]/4,w[1]+y[1]/4],[0,0]),d=w=>[(r[w][0]+r[(w+1)%4][0])/2,(r[w][1]+r[(w+1)%4][1])/2],l=w=>{let y=Math.max(Math.hypot(w[0]-a[0],w[1]-a[1]),1e-6);return[(w[0]-a[0])/y,(w[1]-a[1])/y]},h=[0,1,2,3].flatMap(w=>[r[w],d(w)]),p=[0,1,2,3].reduce((w,y)=>d(y)[1]<d(w)[1]?y:w,0),c=d(p),f=l(c),g=[c[0]+f[0]*44,c[1]+f[1]*44],u=[];for(let w of[[0,2],[1,3]]){let[y,P]=w,D=Math.abs(r[(y+1)%4][0]-r[y][0])>=Math.abs(r[(y+1)%4][1]-r[y][1])?l(d(y))[1]<=l(d(P))[1]?y:P:l(d(y))[0]<=l(d(P))[0]?y:P,N=r[D],L=r[(D+1)%4],W=l(d(D)),_=[N[0]+W[0]*20,N[1]+W[1]*20],q=[L[0]+W[0]*20,L[1]+W[1]*20],te=[(_[0]+q[0])/2,(_[1]+q[1])/2],Mr=D%2===0?o.width:o.depth,ae=[W[0]*5,W[1]*5];u.push(M`<path d=${`M${ee(_)}L${ee(q)}M${ee([_[0]-ae[0],_[1]-ae[1]])}L${ee([_[0]+ae[0],_[1]+ae[1]])}M${ee([q[0]-ae[0],q[1]-ae[1]])}L${ee([q[0]+ae[0],q[1]+ae[1]])}`}
        stroke="#5b8def" stroke-width="1.2" fill="none" />
        <g class="hme-tag"><rect x=${z(te[0]-26)} y=${z(te[1]-9)} width="52" height="18" rx="9" fill="#5b8def" />
        <text x=${z(te[0])} y=${z(te[1]+4)} fill="#fff" text-anchor="middle">${Mr.toFixed(2)} m</text></g>`)}let b=n==="room"?"Drag to resize the room. Shift keeps its proportions, Alt resizes it about its middle, Cmd or Ctrl stops it snapping.":"Drag to resize it. Shift keeps its proportions, Alt resizes it about its middle.";return M`<g class="hme-box">
      <polygon points=${r.map(ee).join(" ")} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray=${i?"5 4":"none"} />
      ${this.resizing||!this.dragging?u:v}
      ${this.dragging?v:M`
        <line x1=${z(c[0])} y1=${z(c[1])} x2=${z(g[0])} y2=${z(g[1])} stroke="#5b8def" stroke-width="1.6" />
        ${h.map((w,y)=>M`<rect data-hme="resize" data-handle=${y} x=${z(w[0]-5)} y=${z(w[1]-5)} width="10" height="10"
          fill="#fff" stroke="#5b8def" stroke-width="1.6" style=${`cursor:${Dr(w[0]-a[0],w[1]-a[1])}`}>
          <title>${b}</title></rect>`)}
        <g data-hme="turn" style="cursor:grab" transform=${`translate(${ee(g)})`}>
          <title>${n==="room"?"Drag to turn the room. Hold Alt to turn it freely.":"Drag to turn it. Hold Alt to turn it freely."}</title>
          <circle r="9" fill="#5b8def" />
          <path d="M-4 0a4 4 0 1 0 1.5-3.1M-4-4.5v2.5h2.5" fill="none" stroke="#fff" stroke-width="1.3" />
        </g>`}
    </g>`}guide(e,t){let o=e.toScreen(t.a),n=e.toScreen(t.b),i=Math.max(Math.hypot(n[0]-o[0],n[1]-o[1]),1e-6),r=[(n[0]-o[0])/i,(n[1]-o[1])/i],a=[o[0]-r[0]*40,o[1]-r[1]*40],d=[n[0]+r[0]*40,n[1]+r[1]*40],l=e.floor.rooms.find(c=>k(c.id,t.roomId)),h=`Lined up with ${l===void 0?"a":T(l)} wall`,p=h.length*6.2+20;return M`<g class="hme-guide" pointer-events="none">
      <line x1=${z(a[0])} y1=${z(a[1])} x2=${z(d[0])} y2=${z(d[1])} stroke="#ff4fa3" stroke-width="1.2" stroke-dasharray="6 4" />
      <g class="hme-tag"><rect x=${z(d[0]+6)} y=${z(d[1]-10)} width=${z(p)} height="20" rx="10" fill="#ff4fa3" />
      <text x=${z(d[0]+6+p/2)} y=${z(d[1]+4)} fill="#fff" text-anchor="middle">${h}</text></g>
    </g>`}pointerDown(e,t,o){return this.draw.active?this.draw.pointerDown(e,t,o):t.button!==0?!1:this.pressHandle(e,t,o)||this.pressBody(e,t,o)}pressHandle(e,t,o){let n=t.target?.closest?.("[data-hme]"),i=n?.getAttribute("data-hme");if(i!=="turn"&&i!=="resize")return!1;let r=Ir[Number(n?.getAttribute("data-handle"))],a=this.picked(e),d=this.focus(e);if(a!==void 0){if(i==="turn")this.thingTurnDrag(e,t,a,o);else if(r!==void 0)this.thingResizeDrag(e,t,a,r,o);else return!1;return!0}if(d===void 0)return!1;if(i==="turn")this.turnDrag(e,t,d,o);else if(r!==void 0)this.resizeDrag(e,t,d,r,o);else return!1;return!0}pressBody(e,t,o){let n=this.thingUnder(e,o,void 0);if(t.metaKey||t.ctrlKey)return n!==void 0&&e.select(He(e.selection,{roomId:n.room.id,object:n.index})),n!==void 0||U(e.floor,o)!==void 0;if(n!==void 0)return this.pickThing(e,n.room,n.index),this.thingMoveDrag(e,t,n,o),!0;let i=U(e.floor,o);return i===void 0?!1:(e.select({kind:"room",roomId:i.id}),this.moveDrag(e,t,i,o),!0)}moveDrag(e,t,o,n){let i=e.doc,r=o.id,a=be(o.outline),d=[0,0];e.drag(t,{move:(l,h)=>{let p=l[0]-n[0],c=l[1]-n[1];if(e.toggles.grid&&a!==void 0){let f=fe;p=Math.round((a.minX+p)/f)*f-a.minX,c=Math.round((a.minY+c)/f)*f-a.minY}if(this.guides=[],e.toggles.snap&&!h.altKey){let f=On(i,r,p,c);f!==void 0&&(p=f.dx,c=f.dy,this.guides=f.guides)}this.dragging=!0,d=[p,c],e.preview(f=>Ce(f,r,p,c))},end:(l,h,p)=>{this.stopDrag(e);let[c,f]=d;p&&(Math.abs(c)>=.005||Math.abs(f)>=.005)&&e.apply(g=>Ce(g,r,c,f),{select:{kind:"room",roomId:r}})},cancel:()=>this.stopDrag(e)})}resizeDrag(e,t,o,n,i){let r=_n(o);if(r===void 0)return;let a=e.doc,d=o.id,l=r.a1-r.a0,h=r.c1-r.c0;if(l<=1e-6||h<=1e-6)return;let p=u=>u[0]*r.u[0]+u[1]*r.u[1],c=u=>u[0]*r.v[0]+u[1]*r.v[1],f=u=>Math.min(Math.max(u,Ve),Xe),g;e.drag(t,{move:(u,b)=>{let w=b.altKey?2:1,y=l,P=h;if(n.a!==void 0&&(y=l+(p(u)-p(i))*(n.a===1?1:-1)*w),n.c!==void 0&&(P=h+(c(u)-c(i))*(n.c===1?1:-1)*w),e.toggles.grid){let L=fe;n.a!==void 0&&(y=Math.round(y/L)*L),n.c!==void 0&&(P=Math.round(P/L)*L)}if(y=f(y),P=f(P),b.shiftKey){let L=y/l,W=P/h,_=n.a===void 0?W:n.c===void 0||Math.abs(Math.log(L))>=Math.abs(Math.log(W))?L:W;_=Math.min(Math.max(_,Ve/Math.min(l,h)),Xe/Math.max(l,h)),y=l*_,P=h*_}let E=[b.altKey||n.a===void 0?.5:1-n.a,b.altKey||n.c===void 0?.5:1-n.c],D={width:y,depth:P,anchor:E};if(this.guides=[],e.toggles.snap&&!b.altKey&&!b.ctrlKey&&!b.metaKey){let L=Ln(a,d,D,n,{proportional:b.shiftKey});L!==void 0&&(D=L.resize,this.guides=L.guides)}this.dragging=!0,this.resizing=!0,g=D;let N=D;e.preview(L=>qe(L,d,N))},end:(u,b,w)=>{this.stopDrag(e);let y=g;!w||y===void 0||Math.abs((y.width??l)-l)<.005&&Math.abs((y.depth??h)-h)<.005||e.apply(P=>qe(P,d,y),{select:{kind:"room",roomId:d}})},cancel:()=>this.stopDrag(e)})}turnDrag(e,t,o,n){let i=o.id,r=ne(o),a=Math.atan2(n[1]-r[1],n[0]-r[0]),d=0;e.drag(t,{move:(l,h)=>{let p=(Math.atan2(l[1]-r[1],l[0]-r[0])-a)*180/Math.PI;p=(p+540)%360-180,h.altKey||(p=Math.round(p/Ut)*Ut),this.dragging=!0,d=p,e.preview(c=>ye(c,i,p,r))},end:(l,h,p)=>{this.stopDrag(e),p&&Math.abs(d)>.01&&e.apply(c=>ye(c,i,d,r),{select:{kind:"room",roomId:i}})},cancel:()=>this.stopDrag(e)})}thingMoveDrag(e,t,o,n){let{room:i,index:r,object:a}=o,d=i.id,l=a.c,h=l;e.drag(t,{move:(p,c)=>{let f=[l[0]+p[0]-n[0],l[1]+p[1]-n[1]];if(e.toggles.grid){let u=fe;f=[Math.round(f[0]/u)*u,Math.round(f[1]/u)*u]}if(this.guides=[],e.toggles.snap&&!c.altKey){let u=Jn(i,a,f);f=u.c,this.guides=u.guides}this.dragging=!0,h=f;let g=f;e.preview(u=>Re(u,d,r,g))},end:(p,c,f)=>{if(this.stopDrag(e),f&&Math.hypot(h[0]-l[0],h[1]-l[1])>=.005){let g=h;e.apply(u=>Re(u,d,r,g),{select:{kind:"object",roomId:d,object:r}})}},cancel:()=>this.stopDrag(e)})}thingResizeDrag(e,t,o,n,i){let{room:r,index:a,object:d}=o,l=r.id,{u:h,v:p}=Zn(d),c=Math.max(d.size[0],Ie),f=Math.max(d.size[1],Ie),g=y=>y[0]*h[0]+y[1]*h[1],u=y=>y[0]*p[0]+y[1]*p[1],b=y=>Math.min(Math.max(y,Ie),Ct),w;e.drag(t,{move:(y,P)=>{let E=P.altKey?2:1,D=c,N=f;if(n.a!==void 0&&(D=c+(g(y)-g(i))*(n.a===1?1:-1)*E),n.c!==void 0&&(N=f+(u(y)-u(i))*(n.c===1?1:-1)*E),e.toggles.grid){let _=fe;n.a!==void 0&&(D=Math.round(D/_)*_),n.c!==void 0&&(N=Math.round(N/_)*_)}if(D=b(D),N=b(N),P.shiftKey){let _=D/c,q=N/f,te=n.a===void 0?q:n.c===void 0||Math.abs(Math.log(_))>=Math.abs(Math.log(q))?_:q;te=Math.min(Math.max(te,Ie/Math.min(c,f)),Ct/Math.max(c,f)),D=c*te,N=f*te}let L=[P.altKey||n.a===void 0?.5:1-n.a,P.altKey||n.c===void 0?.5:1-n.c];this.dragging=!0,this.resizing=!0;let W={width:D,depth:N,anchor:L};w=W,e.preview(_=>Je(_,l,a,W))},end:(y,P,E)=>{this.stopDrag(e);let D=w;!E||D===void 0||Math.abs((D.width??c)-d.size[0])<.005&&Math.abs((D.depth??f)-d.size[1])<.005||e.apply(N=>Je(N,l,a,D),{select:{kind:"object",roomId:l,object:a}})},cancel:()=>this.stopDrag(e)})}thingTurnDrag(e,t,o,n){let{room:i,index:r,object:a}=o,d=i.id,l=a.c,h=Math.atan2(n[1]-l[1],n[0]-l[0]),p=0;e.drag(t,{move:(c,f)=>{let g=(Math.atan2(c[1]-l[1],c[0]-l[0])-h)*180/Math.PI;g=(g+540)%360-180,f.altKey||(g=Math.round(g/Ut)*Ut),this.dragging=!0,p=-g;let u=p;e.preview(b=>Me(b,d,r,u))},end:(c,f,g)=>{this.stopDrag(e);let u=p;g&&Math.abs(u)>.01&&e.apply(b=>Me(b,d,r,u),{select:{kind:"object",roomId:d,object:r}})},cancel:()=>this.stopDrag(e)})}hover(e,t){this.draw.hover(e,t)}keyDown(e,t){if(this.draw.active)return this.draw.keyDown(e,t);let o=this.pickedMany(e);if(o!==void 0)return this.manyKeyDown(e,t,o);let n=this.focus(e);if(n===void 0)return!1;let i=Z(t,!1),r=this.picked(e);if(r!==void 0){let{index:a,object:d}=r,l={kind:"room",roomId:n.id};if(i==="delete")return e.apply(h=>Ze(h,n.id,a),{select:l}),!0;if(i==="cancel")return e.select(l),!0;if(typeof i=="object"&&"nudge"in i){let[h,p]=i.nudge;return e.apply(c=>Re(c,n.id,a,[d.c[0]+h,d.c[1]+p])),!0}return!1}if(i==="delete")return this.askDelete(e,n),!0;if(typeof i=="object"&&"nudge"in i){let[a,d]=i.nudge;return e.apply(l=>Ce(l,n.id,a,d)),!0}return!1}manyKeyDown(e,t,o){let n=Z(t,!1),i=ut(o);if(n==="delete")return this.askDeleteThings(e,o),!0;if(n==="cancel")return e.select(Qi(o)),!0;if(typeof n=="object"&&"nudge"in n){let[r,a]=n.nudge;return e.apply(d=>qn(d,i,r,a)),!0}return!1}async askDeleteThings(e,t){let o=ut(t);await e.confirm({title:`Delete ${C(t.length,"thing")}?`,text:`${Ji(t)} come off the map. Undo brings them back while this page is open.`,ok:"Delete",danger:!0})&&e.apply(i=>Yn(i,o),{select:Qi(t)??null})}cursor(){return this.draw.active?"crosshair":void 0}leave(e){this.draw.stop(e),this.picker=void 0,this.guides=[],this.dragging=!1,this.resizing=!1}dock(e){return m`<button type="button" class="hme-tb ${e.toggles.snap?"on":""}" aria-pressed=${e.toggles.snap?"true":"false"}
        title="A dragged room lines up with the walls round it. Hold Alt to move it freely." @click=${()=>e.setToggle("snap",!e.toggles.snap)}>Snap to walls</button>
      <button type="button" class="hme-tb ${e.toggles.grid?"on":""}" aria-pressed=${e.toggles.grid?"true":"false"}
        @click=${()=>e.setToggle("grid",!e.toggles.grid)}>Grid 10 cm</button>`}pill(e){if(this.draw.active)return m`<span class="hme-pill-name">${this.draw.hint()}</span>
        ${this.draw.points.length>=3?m`<button type="button" class="hme-tb" @click=${()=>{this.draw.finish(e)}}>Close the room</button>`:v}
        <button type="button" class="hme-tb" @click=${()=>this.draw.stop(e)}>Cancel</button>`;let t=this.pickedMany(e);if(t!==void 0){let r=ut(t),a=t.some(d=>d.object.hidden!==!0);return m`<span class="hme-pill-name">${C(t.length,"thing")}</span>
        <button type="button" class="hme-tb" title=${a?"Hide every picked thing":"Show every picked thing"}
          @click=${()=>e.apply(d=>St(d,r,a))}>${a?"Hide":"Show"}</button>
        <button type="button" class="hme-tb danger" @click=${()=>{this.askDeleteThings(e,t)}}>Delete</button>`}let o=this.focus(e);if(o===void 0||this.dragging)return v;let n=o.id,i=this.picked(e);if(i!==void 0){let{index:r,object:a}=i;return m`<span class="hme-pill-name">${X(a)}</span>
        <button type="button" class="hme-tb" @click=${()=>e.apply(d=>Me(d,n,r,90))}>⟲ Turn 90°</button>
        <button type="button" class="hme-tb" title="Turn it square with the room's walls" @click=${()=>e.apply(d=>yo(d,n,r))}>Line up</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(d=>Tt(d,n,r,a.hidden!==!0))}>${a.hidden===!0?"Show":"Hide"}</button>
        <button type="button" class="hme-tb" @click=${()=>e.select({kind:"room",roomId:n})}>${T(o)} ›</button>
        <button type="button" class="hme-tb danger" @click=${()=>e.apply(d=>Ze(d,n,r),{select:{kind:"room",roomId:n}})}>Remove</button>`}return m`<span class="hme-pill-name">${T(o)}</span>
      <button type="button" class="hme-tb" @click=${()=>e.apply(r=>ye(r,n,90))}>⟲ Turn 90°</button>
      <button type="button" class="hme-tb" @click=${()=>e.apply(r=>de(r,n))}>Square the corners</button>
      <button type="button" class="hme-tb" title="Turn it to the floor's walls and slide it onto the nearest wall line, as the iPhone does"
        @click=${()=>e.apply(r=>An(r,n))}>Snap to walls</button>
      ${this.floorMenu(e,o,"Move to floor","hme-tb")}
      <button type="button" class="hme-tb danger" @click=${()=>{this.askDelete(e,o)}}>Delete</button>`}floorMenu(e,t,o,n){let i=e.doc.floors.filter(r=>!k(r.id,e.floor.id));return Go({label:o,cls:n,options:[...i.map(r=>({value:r.id,label:F(r)})),{value:"new",label:"New floor\u2026"}],pick:r=>{this.moveToFloor(e,t,r)}})}async moveToFloor(e,t,o){let n=t.id,i={kind:"room",roomId:n};if(o!=="new"){e.apply(l=>co(l,n,{floorId:o}),{select:i,floorId:o});return}let r=Math.max(...e.doc.floors.map(l=>l.story))+1,a=await e.ask({title:"A new floor",label:"Name",value:r===1?"Upstairs":`Floor ${r+1}`,ok:"Move the room there"});if(a===void 0)return;let d=e.newId();e.apply(l=>co(l,n,{newFloor:{id:d,name:a,story:r}}),{select:i,floorId:d})}async askDelete(e,t){let o=Ue(e.floor,t.id).length;await e.confirm({title:`Delete ${T(t)}?`,text:Or(t,o),ok:"Delete room",danger:!0})&&e.apply(i=>Nn(i,t.id),{select:null})}inspector(e){let t=this.pickedMany(e);if(t!==void 0)return this.manyInspector(e,t);let o=this.focus(e);if(o===void 0)return this.floorCard(e,e.floor);let n=this.picked(e);if(n!==void 0)return this.thingInspector(e,n);let i=o.id,r=Bt(o),a=fn(e.floor,e.toggles.live?e.hass?.states:void 0).has(o.id),d=Ue(e.floor,i),l=be(o.outline)??{minX:0,minY:0,maxX:0,maxY:0},h=Math.round(-In(o)*10)/10,p=o.areaId===void 0||e.areas.some(u=>u.id===o.areaId),c=o.pageId===void 0||e.pages.some(u=>k(u.id,o.pageId)),f=Tn(o),g=this.edits(e);return m`
      <section class="hme-card hme-head">
        ${Yi(o,a)}
        <div class="hme-head-t">
          <strong>${T(o)}</strong>
          <span>${F(e.floor)} · ${ze(o)} · ${r.area.toFixed(1)} m²</span>
        </div>
      </section>

      ${H("Room",m`
        ${O("Name",mt({value:o.name??"",label:"Name",placeholder:"Room",set:u=>e.apply(b=>jn(b,i,u))}))}
        ${O("Area",Pe({label:"Area",value:o.areaId??"",options:[{value:"",label:"None"},...p?[]:[{value:o.areaId,label:`Not in Home Assistant (${o.areaId})`,disabled:!0}],...e.areas.map(u=>({value:u.id,label:u.name}))],set:u=>e.apply(b=>Kn(b,i,u===""?void 0:u))}))}
        ${B("The Home Assistant area. Its devices show first in Not on the map, and Place all by area puts them here.")}
        ${O("Tap opens",Pe({label:"Tap opens",value:o.pageId??"",options:[{value:"",label:"Nothing"},...c?[]:[{value:o.pageId,label:"A page not in your library",disabled:!0}],...e.pages.map(u=>({value:u.id,label:`Page: ${u.name}`}))],set:u=>e.apply(b=>Bn(b,i,u===""?void 0:u))}))}
        ${B("What a tap on this room does on the map tiles and the watch.")}`)}

      ${H("Size",m`
        ${pt(I({tag:"W",label:"Width",value:r.width,unit:"m",min:Ve,max:Xe,...g((u,b)=>qe(u,i,{width:b}))}),I({tag:"D",label:"Depth",value:r.depth,unit:"m",min:Ve,max:Xe,...g((u,b)=>qe(u,i,{depth:b}))}),I({tag:"H",label:"Wall height",value:o.height,unit:"m",min:.5,max:20,...g((u,b)=>Ye(u,i,b))}))}
        <p class="hme-foot-hint">Along its own walls, about its middle; its doors, things and devices move with it.</p>`)}

      ${H("Place",m`
        ${ht("Corner",pt(I({tag:"X",label:"Left",value:l.minX,unit:"m",...g((u,b)=>Ce(u,i,b-l.minX,0))}),I({tag:"Y",label:"Top",value:l.minY,unit:"m",...g((u,b)=>Ce(u,i,0,b-l.minY))})))}
        ${ht("Turn",m`<div class="hme-turn">
          ${I({label:"Turn",value:h,unit:"\xB0",digits:1,min:-180,max:180,...g((u,b)=>ye(u,i,b-h))})}
          <button type="button" class="hme-tb" @click=${()=>e.apply(u=>ye(u,i,-90))}>−90°</button>
          <button type="button" class="hme-tb" @click=${()=>e.apply(u=>ye(u,i,90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it so its longest wall runs straight across or down" @click=${()=>e.apply(u=>Dn(u,i))}>Level</button>
        </div>`)}
        <p class="hme-foot-hint">Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the room to move it, a square handle to resize it, the round one to turn it.</p>
        ${O("Floor",Pe({label:"Floor",value:e.floor.id,options:[...e.doc.floors.map(u=>({value:u.id,label:F(u)})),{value:"new",label:"New floor\u2026"}],set:u=>{this.moveToFloor(e,o,u)}}))}`)}

      ${H("Floor finish",m`<div class="hme-pics">
        ${V({label:`Auto: ${Zi[f]}`,picture:Vo(f),on:o.finish===void 0,title:"Picked from the room's name and furniture",click:()=>e.apply(u=>fo(u,i,void 0))})}
        ${hn.map(u=>V({label:Zi[u],picture:Vo(u),on:o.finish===u,click:()=>e.apply(b=>fo(b,i,u))}))}
      </div>
        ${this.roomColourRow(e,o,"floorColor")}
        ${this.roomColourRow(e,o,"wallColor")}
        <p class="hme-foot-hint">On the plan, the night, warm and clay looks and in 3D, here, on the iPhone and on the watch. The line looks keep their own colour.</p>`)}

      ${H("In this room",m`
        ${o.objects.length===0?m`<p class="hme-empty-line">No things. Add a sofa, a bed or stairs so the map reads.</p>`:v}
        ${o.objects.map((u,b)=>m`<div class="hme-r tight"><span class="hme-grow ${u.hidden===!0?"dim":""}">
            <button type="button" class="hme-link" title="Pick it to move, resize or turn it" @click=${()=>this.pickThing(e,o,b)}>${X(u)}</button></span>
          ${je({on:u.hidden!==!0,onText:"Shown",offText:"Hidden",label:`${X(u)} shown`,click:()=>e.apply(w=>Tt(w,i,b,u.hidden!==!0))})}
          <button type="button" class="hme-x" aria-label=${`Remove ${X(u)}`} title="Remove" @click=${()=>e.apply(w=>Ze(w,i,b))}>×</button></div>`)}
        <div class="hme-r tight"><span class="hme-grow">${o.openings.length===0?"No doors or windows":[...new Set(o.openings.map(ce))].join(", ")}</span>
          <button type="button" class="hme-link" title="Edit this room's corners, walls, doors and windows (or double-click the room)"
            @click=${()=>e.editWalls(i)}>Edit walls ›</button></div>
        ${d.length===0?m`<div class="hme-r tight"><span class="hme-grow dim">No devices. Drag one from Not on the map.</span></div>`:v}
        ${d.map(u=>m`<div class="hme-r tight"><span class="hme-grow">
          <button type="button" class="hme-link" title="Pick it to set its height, glow and tap" @click=${()=>e.select({kind:"pin",pinId:u.id})}>${G(u,e.hass)}</button></span>
          <span class="hme-val">${me(u.entityId,e.toggles.live?e.hass?.states:void 0)}</span></div>`)}
        <div class="hme-row-end">
          ${Go({label:"\uFF0B Add a thing",cls:"hme-tb",options:Wn.map(u=>({value:u,label:dt(u)})),pick:u=>{let b=Y(o)??ne(o);e.apply(w=>Gn(w,i,u,b))}})}
          ${this.addFurnitureButton(e,o,"hme-tb")}
          <button type="button" class="hme-tb danger push" @click=${()=>{this.askDelete(e,o)}}>Delete room</button>
        </div>`)}`}edits(e){return t=>({set:o=>e.apply(n=>t(n,o)),preview:o=>e.preview(o===void 0?void 0:n=>t(n,o))})}thingInspector(e,t){let{room:o,index:n,object:i}=t,r=o.id,a=X(i),[d,l,h]=i.size,p=Lr(i),c=this.edits(e),f={kind:"room",roomId:r},g={unit:"m",min:Ie,max:Ct};return m`
      <section class="hme-card hme-head">
        <div class="hme-head-t">
          <strong>${a}</strong>
          <span>In ${T(o)} · ${d.toFixed(2)} × ${l.toFixed(2)} × ${h.toFixed(2)} m${(i.lift??0)>0?` \xB7 ${(i.lift??0).toFixed(2)} m up`:""}${i.hidden===!0?" \xB7 Hidden":""}</span>
        </div>
      </section>

      ${this.modelCard(e,t)}

      ${this.coloursCard(e,t)}

      ${H("Size",m`
        ${pt(I({tag:"W",label:"Width",value:d,...g,...c((u,b)=>Je(u,r,n,{width:b}))}),I({tag:"D",label:"Depth",value:l,...g,...c((u,b)=>Je(u,r,n,{depth:b}))}),I({tag:"H",label:"Height",value:h,...g,min:.01,...c((u,b)=>vo(u,r,n,{size:[d,l,b]}))}))}`)}

      ${H("Place",m`
        ${ht("Middle, and up off the floor",pt(I({tag:"X",label:"Middle across",value:i.c[0],unit:"m",...c((u,b)=>Re(u,r,n,[b,i.c[1]]))}),I({tag:"Y",label:"Middle down",value:i.c[1],unit:"m",...c((u,b)=>Re(u,r,n,[i.c[0],b]))}),I({tag:"Z",label:"Up off the floor",value:i.lift??0,unit:"m",min:0,max:100,...c((u,b)=>vo(u,r,n,{lift:b}))})))}
        ${ht("Turn",m`<div class="hme-turn">
          ${I({label:"Turn",value:p,unit:"\xB0",digits:1,min:-180,max:180,...c((u,b)=>Me(u,r,n,b-p))})}
          <button type="button" class="hme-tb" title="Turn it a quarter one way" @click=${()=>e.apply(u=>Me(u,r,n,-90))}>−90°</button>
          <button type="button" class="hme-tb" title="Turn it a quarter the other way" @click=${()=>e.apply(u=>Me(u,r,n,90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it square with the room's walls" @click=${()=>e.apply(u=>yo(u,r,n))}>Line up</button>
        </div>`)}
        <p class="hme-foot-hint">Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the thing to move it, a square handle to resize it, the round one to turn it.</p>`)}

      ${H("Show",m`
        <div class="hme-r tight"><span class="hme-grow">On the map, the tiles and the watch</span>
          ${je({on:i.hidden!==!0,onText:"Shown",offText:"Hidden",label:`${a} shown`,click:()=>e.apply(u=>Tt(u,r,n,i.hidden!==!0))})}</div>
        <p class="hme-foot-hint">Scan Again on the iPhone puts the room's things back where the scan finds them. A hidden thing stays hidden.</p>
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${()=>e.select(f)}>‹ ${T(o)}</button>
          <button type="button" class="hme-tb danger push" @click=${()=>e.apply(u=>Ze(u,r,n),{select:f})}>Remove</button>
        </div>`)}`}manyInspector(e,t){let o=ut(t),n=[...new Set(t.map(a=>T(a.room)))],i=Q(t.map(a=>a.object.hidden===!0)),r=Ar.filter(a=>t.some(d=>Qo(d.object).includes(a)));return m`
      <section class="hme-card hme-head">
        <div class="hme-head-t">
          <strong>${C(t.length,"thing")}</strong>
          <span>${Ji(t)} · in ${n.join(", ")}</span>
        </div>
      </section>

      ${H("Picked",m`${t.map(a=>m`<div class="hme-list-row hme-pick-row">
          <button type="button" class="hme-grow hme-link ${a.object.hidden===!0?"dim":""}" title="Pick this one alone"
            @click=${()=>this.pickThing(e,a.room,a.index)}>${X(a.object)}</button>
          <span class="hme-val">${T(a.room)}</span>
          <button type="button" class="hme-x" aria-label=${`Leave ${X(a.object)} out of the pick`} title="Leave it out of the pick"
            @click=${()=>e.select(He(e.selection,{roomId:a.room.id,object:a.index}))}>×</button></div>`)}
        <p class="hme-foot-hint">Cmd or Ctrl and a click on the plan or in 3D adds a thing or takes one away. The arrow keys move them all.</p>`,String(t.length))}

      ${r.length===0?v:H("Colours",m`
        ${r.map(a=>this.manyColourRow(e,t,a))}
        <p class="hme-foot-hint">Set on every picked thing whose piece has that part. In the 3D view and on the iPhone.</p>`)}

      ${H("Show",m`
        <div class="hme-r tight"><span class="hme-grow">On the map, the tiles and the watch</span>
          ${i.mixed?m`<button type="button" class="hme-chip off" aria-pressed="mixed" aria-label="Shown" title="Some are hidden: show them all"
                @click=${()=>e.apply(a=>St(a,o,!1))}>Mixed</button>`:je({on:!i.value,onText:"Shown",offText:"Hidden",label:"Shown",click:()=>e.apply(a=>St(a,o,!i.value))})}</div>
        <div class="hme-row-end">
          <button type="button" class="hme-tb danger push" @click=${()=>{this.askDeleteThings(e,t)}}>Delete ${C(t.length,"thing")}</button>
        </div>`)}`}manyColourRow(e,t,o){let n=t.filter(a=>Qo(a.object).includes(o)),i=ut(n),r=Q(n.map(a=>a.object[o]?.toUpperCase()));return Jo({word:o==="fabric"?"Fabric":"Wood",presets:o==="fabric"?So:Co,now:r.mixed?void 0:r.value,mixed:r.mixed,defaultTitle:"Each model's own colour",customTitle:`Any ${o} colour`,customLabel:`Pick a ${o} colour for every picked thing`,set:a=>e.apply(d=>wo(d,i,o,a)),preview:a=>e.preview(a===void 0?void 0:d=>wo(d,i,o,a)??d)})}modelCard(e,t){let{room:o,index:n,object:i}=t,r=zt(i),a=Ro(i.model),d=a!==void 0?`${a.group}, picked from the catalog`:i.model!==void 0?r===void 0?"A piece this panel does not know yet":`A piece this panel does not know yet, drawn as the ${r.name.toLowerCase()} meanwhile`:r!==void 0?`Picked by its kind: ${dt(i.kind)}`:"A plain box, as the scan found it";return H("Model",m`<div class="hme-model">
        ${this.piecePic(e,r,"hme-model-pic")}
        <div class="hme-model-t"><strong>${r?.name??"Plain box"}</strong><span>${d}</span></div>
        <button type="button" class="hme-tb push" title="Pick another piece from the furniture catalog; it keeps its place, size and turn"
          @click=${()=>this.openPicker(e,o,n)}>Change…</button>
      </div>
      <p class="hme-foot-hint">What it looks like in the 3D view and on the iPhone. The flat plan and the tiles draw it as before.</p>`)}coloursCard(e,t){let o=Qo(t.object);return o.length===0?v:H("Colours",m`
      ${o.map(n=>this.colourRow(e,t,n))}
      <p class="hme-foot-hint">In the 3D view and on the iPhone. The flat plan, the tiles and the furniture picker keep the model's own colours.</p>`)}colourRow(e,t,o){let{room:n,index:i,object:r}=t,a=n.id;return Jo({word:o==="fabric"?"Fabric":"Wood",presets:o==="fabric"?So:Co,now:r[o],defaultTitle:"The model's own colour",customTitle:`Any ${o} colour`,customLabel:`Pick a ${o} colour`,set:l=>e.apply(h=>bo(h,a,i,o,l)),preview:l=>e.preview(l===void 0?void 0:h=>bo(h,a,i,o,l)??h)})}roomColourRow(e,t,o){let n=t.id,i=o==="floorColor";return Jo({word:i?"Floor":"Walls",presets:i?Cr[Se(t)]:Rr,now:t[o],defaultTitle:i?"The finish's own colour":"The look's own wall colour",customTitle:i?"Any floor colour":"Any wall colour",customLabel:i?"Pick a floor colour":"Pick a wall colour",set:r=>e.apply(a=>go(a,n,o,r)),preview:r=>e.preview(r===void 0?void 0:a=>go(a,n,o,r)??a)})}floorCard(e,t){let o=bt(t,e.toggles.live?e.hass?.states:void 0);return m`${H("Floor",m`
        ${O("Name",mt({value:t.name,label:"Floor name",placeholder:F(t),set:n=>e.apply(i=>Et(i,t.id,n))}))}
        ${O("On it",m`<span class="hme-val">${C(t.rooms.length,"room")} · ${C(t.pins.length,"device")} · ${wt(o)}</span>`)}`)}
      ${H("Edit",m`<p class="hme-text">Click picks what is on top: a device, then a thing (a sofa, a TV, a desk), then the room under them. Drag it to move it.</p>
        <p class="hme-text dim">A dragged room lines up with the walls of the rooms round it. Drag the round handle above it to turn it, or a square handle on its box to resize it. Undo with ${Ki()}.</p>
        <p class="hme-text dim">Double-click a room to edit its walls, doors and windows. Drag a device from Not on the map onto the plan to place it; Shift, Cmd or Ctrl and a click picks several. Cmd or Ctrl and a click picks several things too, to colour or hide them together.</p>`)}`}};var Fr=15,Xt=Math.PI/4,en=8,qt="#ffbf55",x=s=>s.toFixed(1);function zr(s,e){return`${Ei(s.domain)} \xB7 ${me(s.entityId,e)}`}function Nr(s,e){let t=J(s,e);if(t===void 0)return"Not in a room";let o=U(s,e.at);return o!==void 0&&k(o.id,t.id)?`${T(t)} (found by place)`:T(t)}function jr(s,e,t){return s.icon!==void 0?Nt[s.icon]:`Auto (${Nt[et(s.entityId,e,t)].toLowerCase()})`}var Yt=class{constructor(){this.side=!0;this.names=!1;this.moving=!1;this.iconsOpen=!1;this.pickPage=!1}states(e){return e.toggles.live?e.hass?.states:void 0}picked(e){let t=e.selection;return t?.kind==="pin"?e.floor.pins.find(o=>k(o.id,t.pinId)):void 0}picks(e){return re(e.selection).flatMap(t=>e.floor.pins.filter(o=>k(o.id,t)))}deviceClass(e,t){let o=e.hass?.states?.[t]?.attributes?.device_class;return typeof o=="string"?o:void 0}friendly(e,t){let o=e.hass?.states?.[t]?.attributes?.friendly_name;return typeof o=="string"&&o.trim()!==""?o.trim():void 0}place(e,t,o,n){let i=Fo(e.doc,t);if(i!==void 0)return k(i.floorId,e.floor.id)||e.setFloor(i.floorId),e.select({kind:"pin",pinId:i.pinId}),!1;let r=Ti(e.floor,n),a=o??(r===void 0?Fe(e.view,[e.stage.width/2,e.stage.height/2]):Y(r)??ne(r)),d=e.newId().toUpperCase(),l=e.floor.id,h=this.friendly(e,t),p=e.apply(c=>si(c,l,{id:d,entityId:t,at:[a[0],a[1]],...h===void 0?{}:{name:h}}),{select:{kind:"pin",pinId:d}});return p||e.note("warn","That device could not be put on the map: the map holds at most 400 devices."),p}placeAll(e,t){let o=t.map(i=>({entityId:i.entityId,areaId:i.areaId,name:i.name,deviceClass:i.deviceClass})),n=e.floor.id;e.apply(i=>hi(i,n,o,()=>e.newId())?.doc,{select:null})}kindChips(e){let t=Pi(e.floor);return t.length===0?v:m`<div class="hme-chips">${t.map(o=>m`<button type="button" class="hme-chip sel ${this.filter===o.kind?"on":""}"
      aria-pressed=${this.filter===o.kind?"true":"false"} title="Dim the other kinds of device on the plan"
      @click=${()=>{this.filter=this.filter===o.kind?void 0:o.kind,e.redraw()}}>${o.label} ${o.count}</button>`)}</div>`}deviceRow(e,t,o){let n=Fo(e.doc,t.entityId),i=et(t.entityId,t.deviceClass,t.name);return m`<div class="hme-dv ${this.dragging===t.entityId?"dragging":""} ${n===void 0?"":"placed"}" role="button" tabindex="0"
      draggable=${n===void 0?"true":"false"} title=${n===void 0?"Drag onto the plan, or click to put it in its area's room":"On the map: click to pick it"}
      @dragstart=${r=>{r.dataTransfer?.setData(jt,t.entityId),r.dataTransfer?.setData("text/plain",t.entityId),r.dataTransfer&&(r.dataTransfer.effectAllowed="copy"),this.dragging=t.entityId,e.redraw()}}
      @dragend=${()=>{this.dragging=void 0,this.dropAt=void 0,e.redraw()}}
      @click=${()=>this.place(e,t.entityId,void 0,t.areaId)}
      @keydown=${r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),this.place(e,t.entityId,void 0,t.areaId))}}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${$e(i,"currentColor",24,2)}</svg></span>
      <span class="hme-dv-nm">${t.name}<small>${n===void 0?zr(t,o):"on the map"}</small></span>
      <span class="hme-dv-grip" aria-hidden="true">${n===void 0?"\u22EE\u22EE":"\u203A"}</span>
    </div>`}dragOver(e,t,o){let n=this.dragging!==void 0||[...o.dataTransfer?.types??[]].includes(jt),i=this.dropAt;return this.dropAt=n?t:void 0,i!==this.dropAt&&e.redraw(),n&&t!==void 0}drop(e,t,o){let n=this.dragging??o.dataTransfer?.getData(jt)??"";this.dragging=void 0,this.dropAt=void 0,n!==""?this.place(e,n,t):e.redraw()}overlay(e){let t=this.states(e),o=this.picked(e),n=re(e.selection),i=[];this.dropAt!==void 0&&i.push(this.dropMark(e,this.dropAt));let r=o===void 0?void 0:ie(o.entityId,t);o!==void 0&&r?.kind==="light"&&i.push(this.glowRing(e,o,r.on?r.brightness:void 0));for(let a of e.floor.pins){let d=n.some(h=>k(a.id,h)),l=this.filter!==void 0&&Do(a.entityId)!==this.filter;i.push(this.pinMark(e,a,d,l,t))}return this.box!==void 0&&i.push(this.boxMark(e,this.box)),M`${i}`}boxMark(e,t){let[o,n]=e.toScreen(t.a),[i,r]=e.toScreen(t.b);return M`<rect class="hme-box" x=${x(Math.min(o,i))} y=${x(Math.min(n,r))} width=${x(Math.abs(i-o))} height=${x(Math.abs(r-n))}
      fill="rgba(91,141,239,0.12)" stroke="#5b8def" stroke-width="1.2" stroke-dasharray="4 3" pointer-events="none" />`}pinMark(e,t,o,n,i){let[r,a]=e.toScreen(t.at),d=ie(t.entityId,i),l=d.kind==="light"&&d.on,h=l?ot(t)??qt:"rgba(36,36,40,0.92)",p=l?"#fff3d6":d.kind==="gone"?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.4)",c=l?"#3a2600":d.kind==="lock"?d.locked?"#30d158":"#ff9f0a":d.kind==="other"&&d.on?"#ffffff":d.kind==="gone"?"#8e8e93":"#d1d1d6",f=t.icon??et(t.entityId,this.deviceClass(e,t.entityId),this.friendly(e,t.entityId)),g=o?13:12,u=o||this.names?G(t,e.hass):bi(t,i),b=u===void 0?0:u.length*5.9+14;return M`<g class="hme-pin" data-hme="pin" data-pin=${t.id} transform=${`translate(${x(r)} ${x(a)})`} opacity=${n?.25:1} style="cursor:grab">
      ${o?M`<circle r="20" fill="none" stroke="#5b8def" stroke-width="2.5" />`:v}
      ${l?M`<circle r=${g+7} fill=${h} opacity="0.22" />`:v}
      <circle r=${g} fill=${h} stroke=${p} stroke-width="1.2" />
      <g transform="translate(-7 -7)">${$e(f,c,14,1.5)}</g>
      ${u===void 0||u===""?v:M`<g pointer-events="none"><rect x=${x(-b/2)} y=${g+4} width=${x(b)} height="16" rx="8" fill=${o?"#5b8def":"rgba(0,0,0,0.7)"} />
        <text y=${g+15.5} fill="#fff" font-size="10" font-weight="600" text-anchor="middle">${u}</text></g>`}
    </g>`}glowRing(e,t,o){let[n,i]=e.toScreen(t.at),r=tt(t,o),a=e.px(r),d=[n+a*Math.cos(Xt),i+a*Math.sin(Xt)],l=`Glow ${r.toFixed(1)} m`,h=l.length*6.2+18,p=t.glowSpill===!0?void 0:J(e.floor,t),c=p!==void 0&&p.outline.length>=3?p.outline.map(g=>e.toScreen(g).map(x).join(",")).join(" "):void 0,f=g=>M`<circle cx=${x(n)} cy=${x(i)} r=${x(a)} fill="none" stroke=${ot(t)??"#5b8def"} stroke-width="1.4"
      stroke-dasharray="5 5" opacity=${g} pointer-events="none" />`;return M`<g class="hme-glow-ring">
      ${c===void 0?f(1):M`<clipPath id="hme-glow-walls"><polygon points=${c} /></clipPath>
        ${f(.28)}<g clip-path="url(#hme-glow-walls)">${f(1)}</g>`}
      <circle data-hme="glow" cx=${x(d[0])} cy=${x(d[1])} r="7" fill="#fff" stroke="#5b8def" stroke-width="2" style="cursor:nwse-resize">
        <title>Drag to set how far this light's glow reaches</title></circle>
      <g class="hme-tag" pointer-events="none"><rect x=${x(d[0]-h/2)} y=${x(d[1]+12)} width=${x(h)} height="18" rx="9" fill="#5b8def" />
        <text x=${x(d[0])} y=${x(d[1]+25)} fill="#fff" text-anchor="middle">${l}</text></g>
    </g>`}dropMark(e,t){let o=U(e.floor,t),[n,i]=e.toScreen(t),r=o===void 0?"Drop here, in no room":`Drop in ${T(o)}`,a=r.length*6.4+20;return M`<g class="hme-drop" pointer-events="none">
      ${o===void 0?v:M`<polygon points=${o.outline.map(d=>e.toScreen(d).map(x).join(",")).join(" ")}
        fill="rgba(91,141,239,0.18)" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />`}
      <circle cx=${x(n)} cy=${x(i)} r="13" fill="rgba(91,141,239,0.35)" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 2" />
      <g class="hme-tag"><rect x=${x(n-a/2)} y=${x(i+20)} width=${x(a)} height="18" rx="9" fill="#5b8def" />
        <text x=${x(n)} y=${x(i+33)} fill="#fff" text-anchor="middle">${r}</text></g>
    </g>`}pinAt(e,t){let o,n=Fr;for(let i of e.floor.pins){let r=e.toScreen(i.at),a=Math.hypot(r[0]-t[0],r[1]-t[1]);a<=n&&(o=i,n=a)}return o}pointerDown(e,t,o){return t.button!==0?!1:this.pressHandle(e,t,o)||this.pressPin(e,t,o)||this.pressBox(e,t,o)}pressHandle(e,t,o){let n=this.picked(e);if(n===void 0||t.shiftKey||t.metaKey||t.ctrlKey)return!1;let i=ie(n.entityId,this.states(e));if(i.kind!=="light")return!1;let r=e.toScreen(o),[a,d]=e.toScreen(n.at),l=e.px(tt(n,i.on?i.brightness:void 0));return Math.hypot(r[0]-(a+l*Math.cos(Xt)),r[1]-(d+l*Math.sin(Xt)))>10?!1:(this.glowDrag(e,t,n),!0)}onPin(e,t){return this.pinAt(e,e.toScreen(t))!==void 0}pressBox(e,t,o){return t.shiftKey?(this.boxDrag(e,t,o),!0):!1}pressPin(e,t,o){let n=t.shiftKey||t.metaKey||t.ctrlKey,i=this.pinAt(e,e.toScreen(o));if(i===void 0)return!1;if(this.pickPage=!1,this.iconsOpen=!1,n)return e.select(ke(e.selection,i.id)),!0;let r=re(e.selection);return r.length>1&&r.some(a=>k(a,i.id))?(this.groupDrag(e,t,r,i.id,o),!0):(e.select({kind:"pin",pinId:i.id}),this.moveDrag(e,t,i,o),!0)}groupDrag(e,t,o,n,i){let r=[0,0],a=it(o);e.drag(t,{move:d=>{this.moving=!0,r=[d[0]-i[0],d[1]-i[1]];let[l,h]=r;e.preview(p=>At(p,o,l,h))},end:(d,l,h)=>{this.moving=!1,e.preview(void 0);let[p,c]=r;h?Math.hypot(p,c)>=.005&&e.apply(f=>At(f,o,p,c),a===void 0?{}:{select:a}):e.select({kind:"pin",pinId:n})},cancel:()=>this.stopDrag(e)})}stopDrag(e){this.moving=!1,this.box=void 0,e.preview(void 0)}boxDrag(e,t,o){let n=e.floor.pins,i=e.selection;e.drag(t,{move:r=>{this.box={a:o,b:r},e.redraw()},end:(r,a,d)=>{this.box=void 0,d?e.select(Si(i,Ci(n,o,r))):e.redraw()},cancel:()=>this.stopDrag(e)})}async removePicks(e,t){t.length!==0&&(t.length>1&&!await e.confirm({title:`Remove ${C(t.length,"device")} from the map?`,text:"They go back to Not on the map. Undo puts them back where they were.",ok:"Remove",danger:!0})||e.apply(o=>pi(o,t),{select:null}))}moveDrag(e,t,o,n){let i=o.id,r=[o.at[0],o.at[1]],a=r;e.drag(t,{move:d=>{this.moving=!0,a=[r[0]+d[0]-n[0],r[1]+d[1]-n[1]],e.preview(l=>Po(l,i,a))},end:(d,l,h)=>{this.moving=!1,e.preview(void 0),h&&Math.hypot(a[0]-r[0],a[1]-r[1])>=.005&&e.apply(p=>Po(p,i,a),{select:{kind:"pin",pinId:i}})},cancel:()=>this.stopDrag(e)})}glowDrag(e,t,o){let n=o.id,i;e.drag(t,{move:r=>{this.moving=!0;let a=Math.hypot(r[0]-o.at[0],r[1]-o.at[1]);i=Math.min(Math.max(Math.round(a/.05)*.05,Be),un);let d=i;e.preview(l=>_e(l,n,{glow:d}))},end:()=>{this.moving=!1,e.preview(void 0);let r=i;r!==void 0&&e.apply(a=>_e(a,n,{glow:r}))},cancel:()=>this.stopDrag(e)})}keyDown(e,t){let o=this.picks(e).map(i=>i.id);if(o.length===0)return!1;let n=Z(t,!1);if(n==="delete")return this.removePicks(e,o),!0;if(typeof n=="object"&&"nudge"in n){let[i,r]=n.nudge;return e.apply(a=>At(a,o,i,r)),!0}return!1}leave(){this.dragging=void 0,this.dropAt=void 0,this.box=void 0,this.moving=!1,this.iconsOpen=!1,this.pickPage=!1}dock(e){let t=(o,n,i,r)=>m`<button type="button" class="hme-tb ${n?"on":""}"
      aria-pressed=${n?"true":"false"} title=${r} @click=${()=>{i(),e.redraw()}}>${o}</button>`;return m`${t("Side view",this.side,()=>{this.side=!this.side},"The picked device's room from the side, to set its height")}
      ${t("Names",this.names,()=>{this.names=!this.names},"Every device's name under its pin")}`}stageExtra(e){let t=this.picked(e);if(!this.side||t===void 0)return v;let o=J(e.floor,t),n=o?.height??2.5,i=be(o?.outline??e.floor.rooms.flatMap(E=>E.outline))??{minX:t.at[0]-1,maxX:t.at[0]+1,minY:0,maxY:0},r=18,a=118,d=(a-r)/Math.max(n,.5),l=30,h=262,p=(h-l)/Math.max(i.maxX-i.minX,.5),c=E=>l+(Math.min(Math.max(E,i.minX),i.maxX)-i.minX)*p,f=t.at[2],g=a-Math.min(Math.max(f,0),n)*d,u=c(t.at[0]),b=(()=>{let E=ie(t.entityId,this.states(e));return E.kind==="light"&&E.on})(),w=[];for(let E=0;E<=n+1e-9;E+=1)w.push(E);let y=o===void 0?[]:cn(o),P=o===void 0?"No room":T(o);return m`<div class="hme-side">
      <div class="hme-h">${P} from the side</div>
      <svg viewBox="0 0 270 130" role="img" aria-label=${`Side view: ${G(t,e.hass)} at ${f.toFixed(2)} m, the wall ${n.toFixed(1)} m tall`}
        @pointerdown=${E=>this.heightDrag(e,E,t,n,a,d)}>
        <path d=${`M${l} ${x(r)}H${h}M${l} ${a}H${h}`} stroke="#ece6da" stroke-width="3" />
        <path d=${`M${l} ${x(r)}V${a}M${h} ${x(r)}V${a}`} stroke="#ece6da" stroke-width="1.5" opacity="0.4" />
        <g font-size="9" fill="#8e8e93" text-anchor="end" class="mono">
          ${w.map(E=>M`<text x=${l-6} y=${x(a-E*d+3)}>${E===0?"0":`${E} m`}</text>
            <path d=${`M${l-4} ${x(a-E*d)}H${l}`} stroke="#8e8e93" />`)}
        </g>
        ${y.map(E=>{let D=c(E.c[0]-E.size[0]/2),N=c(E.c[0]+E.size[0]/2),L=Math.min(E.size[2],n)*d;return M`<rect x=${x(D)} y=${x(a-L)} width=${x(Math.max(N-D,2))} height=${x(L)} rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" />`})}
        <path d=${`M${x(u)} ${a}V${x(g)}`} stroke="#5b8def" stroke-width="1.2" stroke-dasharray="3 3" />
        ${b?M`<circle cx=${x(u)} cy=${x(g)} r="20" fill="#ffb648" opacity="0.22" />`:v}
        <circle cx=${x(u)} cy=${x(g)} r="9" fill=${b?qt:"#3a3a3c"} stroke="#5b8def" stroke-width="2.5" style="cursor:ns-resize" />
        <g class="hme-tag"><rect x=${x(Math.min(u+14,222))} y=${x(g-8)} width="44" height="16" rx="8" fill="#5b8def" />
          <text x=${x(Math.min(u+14,222)+22)} y=${x(g+3.5)} fill="#fff" font-size="10" text-anchor="middle">${f.toFixed(2)} m</text></g>
      </svg>
      <span class="hme-side-hint">Drag the pin up or down here.</span>
    </div>`}heightDrag(e,t,o,n,i,r){if(t.button!==0)return;let a=t.currentTarget,d=o.id,l=f=>{let g=a.getBoundingClientRect(),u=(f.clientY-g.top)*130/Math.max(g.height,1);return Math.min(Math.max(Math.round((i-u)/r/.05)*.05,0),n)},h=l(t);try{a.setPointerCapture(t.pointerId)}catch{}this.moving=!0,e.preview(f=>le(f,d,h));let p=f=>{h=l(f);let g=h;e.preview(u=>le(u,d,g))},c=()=>{a.removeEventListener("pointermove",p),a.removeEventListener("pointerup",c),a.removeEventListener("pointercancel",c),this.moving=!1,e.preview(void 0);let f=h;Math.abs(f-o.at[2])>=.005&&e.apply(g=>le(g,d,f))};a.addEventListener("pointermove",p),a.addEventListener("pointerup",c),a.addEventListener("pointercancel",c)}pill(e){let t=this.picks(e);if(t.length>1&&!this.moving)return this.groupPill(e,t);let o=this.picked(e);if(o===void 0||this.moving)return v;let n=o.id,i=o.entityId.startsWith("light."),r=J(e.floor,o)!==void 0;return m`<span class="hme-pill-name">${G(o,e.hass)}</span>
      ${Oo(o.entityId)&&e.hass!==void 0?m`<button type="button" class="hme-tb" @click=${()=>this.toggle(e,o.entityId)}>${Ao(o.entityId,e.hass.states)}</button>`:v}
      ${i?m`<button type="button" class="hme-tb" title="Every light on this floor at this light's height" @click=${()=>e.apply(a=>di(a,n))}>Same height for all lights</button>`:v}
      ${r?m`<button type="button" class="hme-tb" @click=${()=>e.apply(a=>li(a,n))}>Center in room</button>`:v}
      <button type="button" class="hme-tb danger" @click=${()=>e.apply(a=>Eo(a,n),{select:null})}>Remove</button>`}groupPill(e,t){let o=t.map(d=>d.id),n=t[0],i=n.at[2],r=t.every(d=>Math.abs(d.at[2]-i)<.005),a=e.hass===void 0?void 0:Ri(t.map(d=>d.entityId),e.hass.states);return m`<span class="hme-pill-name">${C(t.length,"device")}</span>
      ${a===void 0?v:m`<button type="button" class="hme-tb" @click=${()=>this.turn(e,t.map(d=>d.entityId),a.service)}>${a.words}</button>`}
      <button type="button" class="hme-tb" ?disabled=${r} title=${r?"They are all at one height":`Every picked device at ${G(n,e.hass)}'s height, ${i.toFixed(2)} m`}
        @click=${()=>e.apply(d=>Ae(d,o,i))}>Same height</button>
      <button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(e,o)}}>Remove</button>`}toggle(e,t){let o=e.hass;o!==void 0&&io(o,"homeassistant","toggle",{entity_id:t}).catch(n=>{e.note("err",`Could not turn it on or off: ${n instanceof Error?n.message:String(n)}`)})}turn(e,t,o){let n=e.hass;n!==void 0&&io(n,"homeassistant",o,{entity_id:[...t]}).catch(i=>{e.note("err",`Could not turn them ${o==="turn_on"?"on":"off"}: ${i instanceof Error?i.message:String(i)}`)})}inspector(e){let t=this.picks(e);if(t.length>1)return this.groupInspector(e,t);let o=this.picked(e);if(o===void 0)return v;let n=e.hass?.states,i=o.id,r=ie(o.entityId,n),a=r.kind==="light"&&r.on,d=this.friendly(e,o.entityId),l=this.deviceClass(e,o.entityId),h=et(o.entityId,l,d),p=o.icon??h,f=J(e.floor,o)?.height??2.5,g=w=>e.apply(y=>_e(y,i,w,d)),b=ot(o)??qt;return m`
      <section class="hme-card hme-head">
        <span class="hme-pin-big ${a?"lit":""}" style=${a?`background:${b};box-shadow:0 0 24px ${b}80`:""}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${$e(p,a?"#3a2600":"#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${G(o,e.hass)}</strong>
          <span class="mono">${o.entityId}</span>
        </div>
        <span class="hme-state ${a?"lit":""}">${me(o.entityId,n)}</span>
      </section>

      ${H("On the map",m`
        ${O("Name",mt({value:o.name??"",label:"Name on the map",placeholder:d??o.entityId,set:w=>g({name:w.trim()===""?null:w})}))}
        ${O("Icon",m`<button type="button" class="hme-in hme-icon-btn" aria-haspopup="true" aria-expanded=${this.iconsOpen?"true":"false"}
          @click=${()=>{this.iconsOpen=!this.iconsOpen,e.redraw()}}>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">${$e(p,"currentColor",24,2)}</svg>
          <span class="hme-grow">${jr(o,l,d)}</span><span class="hme-caret" aria-hidden="true">▾</span></button>`)}
        ${this.iconsOpen?this.iconMenu(e,o,h,g):v}
        ${O("Room",m`<span class="hme-in hme-ro">${Nr(e.floor,o)}</span>`)}
        <div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
          ${V({label:"None",picture:Ke("none",b),on:o.reading==="none",click:()=>g({reading:"none"})})}
          ${V({label:"Pill",picture:Ke("pill",b),on:o.reading===void 0,title:"Its reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>g({reading:null})})}
          ${V({label:"Name",picture:Ke("name",b),on:o.reading==="name",click:()=>g({reading:"name"})})}
        </div></div>`)}

      ${H("Height",m`
        <div class="hme-r">
          <input class="hme-range" type="range" min="0" max=${f} step="0.05" .value=${j(String(o.at[2]))} aria-label="Height" style=${Te(o.at[2],0,f)}
            @input=${w=>{let y=Number(w.target.value);e.preview(P=>le(P,i,y))}}
            @change=${w=>{let y=Number(w.target.value);e.apply(P=>le(P,i,y))}} />
          ${I({label:"Height",value:o.at[2],unit:"m",min:0,max:100,width:"92px",set:w=>e.apply(y=>le(y,i,w))})}
        </div>
        <div class="hme-chips">${_o.map(([w,y])=>m`<button type="button" class="hme-chip sel ${Math.abs(o.at[2]-y)<.005?"on":""}"
          @click=${()=>e.apply(P=>le(P,i,y))}>${w} ${y}</button>`)}</div>
        <p class="hme-text dim">The model looks stand the pin at this height.</p>`)}

      ${o.entityId.startsWith("light.")?this.lightCard(e,o,r.kind==="light"&&r.on?r.brightness:void 0,g):v}

      ${this.tapCard(e,o,g)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>e.apply(w=>Eo(w,i),{select:null})}>Remove from the map</button></div>`}iconMenu(e,t,o,n){let i=a=>{this.iconsOpen=!1,n({icon:a}),e.redraw()},r=(a,d,l,h)=>m`<button type="button" class="hme-icon-cell ${l?"on":""}"
      title=${d} aria-label=${d} aria-pressed=${l?"true":"false"} @click=${()=>i(h)}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">${$e(a,"currentColor",24,1.9)}</svg><span>${d}</span></button>`;return m`<div class="hme-icons" role="group" aria-label="Icon">
      ${r(o,"Auto",t.icon===void 0,null)}
      ${mn.map(a=>r(a,Nt[a],t.icon===a,a))}
    </div>`}lightCard(e,t,o,n){let i=t.id,r=tt(t,o),a=ot(t),d=(l,h,p)=>m`<button type="button" class="hme-chip sel ${h?"on":""}" aria-pressed=${h?"true":"false"} @click=${p}>${l}</button>`;return H("Light",m`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        <input class="hme-range" type="range" min=${Be} max=${Math.max(en,r)} step="0.05" .value=${j(String(r))} aria-label="Glow size"
          style=${Te(r,Be,Math.max(en,r))}
          @input=${l=>{let h=Number(l.target.value);e.preview(p=>_e(p,i,{glow:h}))}}
          @change=${l=>n({glow:Number(l.target.value)})} />
        <span class="hme-val mono hme-w48">${r.toFixed(1)} m</span></div>
      <div class="hme-row-end indent">${d("By its brightness",t.glow===void 0,()=>n({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${d("Follow the light",t.glowColor===void 0,()=>n({glowColor:null}))}
        ${d("Warm",t.glowColor==="warm",()=>n({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${a!==void 0?"on":""}">${a===void 0?v:m`<span class="hme-swatch" style=${`background:${a}`}></span>`}Pick
          ${lt({value:a??"#ffb648",label:"Pick the glow's color",preview:l=>e.preview(l===void 0?void 0:h=>_e(h,i,{glowColor:l})??h),set:l=>n({glowColor:l})})}</label>
      </div></div>
      ${tr(t.glowSpill===!0?"off":"on",l=>n({glowSpill:l?null:!0}))}
      ${B("The pool of light round this light on the plan and the tiles. Warm is the lamplight every light has without a color of its own.")}`)}groupInspector(e,t){let o=e.hass?.states,n=t.map(p=>p.id),i=p=>{e.apply(c=>_t(c,n,p))||e.note("warn","That could not be set on every picked device.")},r=Math.max(2.5,...t.map(p=>J(e.floor,p)?.height??2.5)),a=Q(t.map(p=>p.at[2])),d=Q(t.map(p=>p.reading)),l=t.every(p=>p.entityId.startsWith("light.")),h=qt;return m`
      <section class="hme-card hme-head">
        <span class="hme-pin-big"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${$e("bulb","#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${C(t.length,"device")}</strong>
          <span>Shift, Cmd or Ctrl and a click adds or takes one away</span>
        </div>
      </section>

      ${H("Picked",m`${t.map(p=>m`<div class="hme-list-row hme-pick-row">
          <button type="button" class="hme-grow hme-link" title="Pick this one alone" @click=${()=>e.select({kind:"pin",pinId:p.id})}>${G(p,e.hass)}</button>
          <span class="hme-val">${me(p.entityId,o)}</span>
          <button type="button" class="hme-x" aria-label=${`Leave ${G(p,e.hass)} out of the pick`} title="Leave it out of the pick"
            @click=${()=>e.select(ke(e.selection,p.id))}>×</button></div>`)}`,String(t.length))}

      ${H("On the map",m`
        <div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
          ${V({label:"None",picture:Ke("none",h),on:!d.mixed&&d.value==="none",click:()=>i({reading:"none"})})}
          ${V({label:"Pill",picture:Ke("pill",h),on:!d.mixed&&d.value===void 0,title:"Each one's reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>i({reading:null})})}
          ${V({label:"Name",picture:Ke("name",h),on:!d.mixed&&d.value==="name",click:()=>i({reading:"name"})})}
        </div></div>
        ${d.mixed?B("Mixed: they show different things. Pick one to set them all."):v}`)}

      ${H("Height",m`
        <div class="hme-r">
          ${or({label:"Height",value:a.mixed?void 0:a.value,min:0,max:r,step:.05,preview:p=>e.preview(c=>Ae(c,n,p)),set:p=>e.apply(c=>Ae(c,n,p))})}
          ${I({label:"Height",value:a.mixed?void 0:a.value,unit:"m",min:0,max:100,width:"92px",set:p=>e.apply(c=>Ae(c,n,p))})}
        </div>
        <div class="hme-chips">${_o.map(([p,c])=>m`<button type="button" class="hme-chip sel ${t.every(f=>Math.abs(f.at[2]-c)<.005)?"on":""}"
          @click=${()=>e.apply(f=>Ae(f,n,c))}>${p} ${c}</button>`)}</div>
        <p class="hme-text dim">Every picked device at this height.</p>`)}

      ${l?this.groupLightCard(e,t,i):v}

      ${this.groupTapCard(e,t,i)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(e,n)}}>Remove ${C(t.length,"device")} from the map</button></div>`}groupLightCard(e,t,o){let n=t.map(g=>g.id),i=this.states(e),r=t.map(g=>{let u=ie(g.entityId,i);return Math.round(tt(g,u.kind==="light"&&u.on?u.brightness:void 0)*20)/20}),a=Q(r),d=Math.max(en,...r),l=t.every(g=>g.glow===void 0),h=Q(t.map(g=>g.glowColor?.toLowerCase())),p=Q(t.map(g=>g.glowSpill===!0)),c=h.mixed||h.value===void 0||h.value==="warm"?void 0:h.value,f=(g,u,b)=>m`<button type="button" class="hme-chip sel ${u?"on":""}" aria-pressed=${u?"true":"false"} @click=${b}>${g}</button>`;return H("Light",m`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        ${or({label:"Glow size",value:a.mixed?void 0:a.value,min:Be,max:d,step:.05,preview:g=>e.preview(u=>_t(u,n,{glow:g})),set:g=>o({glow:g})})}
        <span class="hme-val mono hme-w48">${a.mixed?"Mixed":`${a.value.toFixed(1)} m`}</span></div>
      <div class="hme-row-end indent">${f("By its brightness",l,()=>o({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${f("Follow the light",!h.mixed&&h.value===void 0,()=>o({glowColor:null}))}
        ${f("Warm",!h.mixed&&h.value==="warm",()=>o({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${c!==void 0?"on":""}">${c===void 0?v:m`<span class="hme-swatch" style=${`background:${c}`}></span>`}Pick
          ${lt({value:c??"#ffb648",label:"Pick the glow's color for every picked light",preview:g=>e.preview(g===void 0?void 0:u=>_t(u,n,{glowColor:g})??u),set:g=>o({glowColor:g})})}</label>
      </div></div>
      ${h.mixed?B("Mixed: their colors differ. Pick one to set them all."):v}
      ${tr(p.mixed?"mixed":p.value?"off":"on",g=>o({glowSpill:g?null:!0}))}`)}groupTapCard(e,t,o){let n=Q(t.map(l=>[l.tap,l.tap==="page"?l.pageId?.toLowerCase():void 0])),i=n.mixed?void 0:n.value,r=i?.[0]==="page"||this.pickPage,a=i?.[0]==="page"?t[0].pageId:void 0,d=l=>{if(l==="page"){e.pages.length===1?o({tap:"page",pageId:e.pages[0].id}):(this.pickPage=!0,e.redraw());return}this.pickPage=!1,o({tap:l??null})};return H("Tap on the map",m`
      <div class="hme-chips">${Lo.map(([l,h])=>{let p=l==="page"?r:!this.pickPage&&i!==void 0&&i[0]===l;return m`<button type="button" class="hme-chip sel ${p?"on":""}" aria-pressed=${p?"true":"false"}
          ?disabled=${l==="page"&&e.pages.length===0} title=${l==="page"&&e.pages.length===0?"Your library has no pages":""}
          @click=${()=>d(l)}>${h}</button>`})}</div>
      ${r?O("Page",Pe({label:"Page",value:a??"",options:[...a===void 0?[{value:"",label:"Pick a page\u2026",disabled:!0}]:[],...a===void 0||e.pages.some(l=>k(l.id,a))?[]:[{value:a,label:"A page not in your library",disabled:!0}],...e.pages.map(l=>({value:l.id,label:l.name}))],set:l=>{this.pickPage=!1,l!==""&&o({tap:"page",pageId:l})}})):v}
      <p class="hme-text dim">${n.mixed&&!this.pickPage?"Mixed: a tap does different things on them. Pick one to set them all.":"Set on every picked device."}</p>`)}tapCard(e,t,o){let n=t.tap==="page"||this.pickPage,i=t.pageId===void 0||e.pages.some(a=>k(a.id,t.pageId)),r=a=>{if(a==="page"){if(t.tap==="page")return;e.pages.length===1?o({tap:"page",pageId:e.pages[0].id}):(this.pickPage=!0,e.redraw());return}this.pickPage=!1,o({tap:a??null})};return H("Tap on the map",m`
      <div class="hme-chips">${Lo.map(([a,d])=>{let l=a==="page"?n:!this.pickPage&&t.tap===a;return m`<button type="button" class="hme-chip sel ${l?"on":""}" aria-pressed=${l?"true":"false"}
          ?disabled=${a==="page"&&e.pages.length===0} title=${a==="page"&&e.pages.length===0?"Your library has no pages":""}
          @click=${()=>r(a)}>${d}</button>`})}</div>
      ${n?O("Page",Pe({label:"Page",value:t.tap==="page"?t.pageId??"":"",options:[...t.tap==="page"?[]:[{value:"",label:"Pick a page\u2026",disabled:!0}],...i?[]:[{value:t.pageId,label:"A page not in your library",disabled:!0}],...e.pages.map(a=>({value:a.id,label:a.name}))],set:a=>{this.pickPage=!1,a!==""&&o({tap:"page",pageId:a})}})):v}
      <p class="hme-text dim">${t.tap===void 0&&!this.pickPage?"As the tile does: a light toggles, anything else opens its control.":"Hold on the watch or iPhone: its controls."}</p>`)}};function tr(s,e){let t=s==="on"?"walls stop the glow":s==="off"?"the glow spreads past the walls":"some stay in, some spread";return m`<div class="hme-r"><span class="hme-l">Stay in room</span>
    ${s==="mixed"?m`<button type="button" class="hme-chip off" aria-pressed="mixed" aria-label="Stay in room" @click=${()=>e(!0)}>Mixed</button>`:je({on:s==="on",onText:"On",offText:"Off",label:"Stay in room",click:()=>e(s!=="on")})}
    <span class="hme-text dim">${t}</span></div>`}function or(s){let e=s.value??(s.min+s.max)/2;return m`<input class="hme-range ${s.value===void 0?"mixed":""}" type="range" min=${s.min} max=${s.max} step=${s.step} .value=${j(String(e))}
    aria-label=${s.label} aria-valuetext=${s.value===void 0?"Mixed":v} style=${s.value===void 0?"--p:0%":Te(s.value,s.min,s.max)}
    @input=${t=>{let o=t.target;o.classList.remove("mixed"),s.preview(Number(o.value))}}
    @change=${t=>s.set(Number(t.target.value))} />`}function Ke(s,e){return m`<svg width="62" height="44" viewBox="0 0 62 44" aria-hidden="true">
    <circle cx="31" cy=${s==="none"?20:16} r="9" fill=${e} />
    ${s==="pill"?M`<rect x="17" y="29" width="28" height="11" rx="5.5" fill="rgba(0,0,0,0.7)" stroke="#3a3a3c" /><text x="31" y="37.5" font-size="8" fill="#fff" text-anchor="middle">21.5°</text>`:v}
    ${s==="name"?M`<text x="31" y="38" font-size="8" fill="#fff" text-anchor="middle">Name</text>`:v}
  </svg>`}var nn=[{id:"select",label:"Corners and walls",key:"v"},{id:"split",label:"Split the room",key:"s"},{id:"inner",label:"Inner wall",key:"w"},{id:"door",label:"Door",key:"d"},{id:"window",label:"Window",key:"n"},{id:"opening",label:"Way through (no door)",key:"o"},{id:"stairs",label:"Stairs",key:"t"}];function dr(s){return Vr[s]}function Kr(s){return nn.find(e=>e.key===s.toLowerCase())?.id}var Br=[{label:"Door",kind:"door"},{label:"Double door",kind:"door",style:"double"},{label:"Sliding door",kind:"door",style:"sliding"},{label:"Window",kind:"window"},{label:"Sliding window",kind:"window",style:"sliding"},{label:"Way through",kind:"opening"}],Wr=["zero","one","two","three","four","five","six","seven","eight","nine","ten"];function Gr(s){return s===2?"Fix both":`Fix all ${Wr[s]??s}`}var Ur=9,nr=18,tn="#4fd6c2",ir="Draw each room faint and dashed as the iPhone scanned it, or as first seen for a room scanned before scans were kept. A room drawn here has none.",rr="Put this room's walls, doors, windows and furniture back as the iPhone scanned it. Its devices stay where they are.",$=s=>s.toFixed(1),ve=s=>`${s[0].toFixed(1)},${s[1].toFixed(1)}`,ar=new WeakMap;function Zt(s){let e=ar.get(s);return e===void 0&&ar.set(s,e=ii(s)),e}function on(s,e,t,o){if(s.walls!==void 0&&o===void 0)return;let n=t/s.view.scale,i=a=>{let d;for(let l of a)for(let[h,p]of K(l).entries()){let c=En(e,p);c<=n&&(d===void 0||c<d.d)&&(d={room:l,wall:h,seg:p,d:c})}return d},r=o===void 0?void 0:i([o]);return s.walls!==void 0?r:r??i(s.floor.rooms)}function sr(s,e){let t=Math.max(se(e),1e-9),o=[-(e.b[1]-e.a[1])/t,(e.b[0]-e.a[0])/t],n=[(e.a[0]+e.b[0])/2,(e.a[1]+e.b[1])/2],i=Y(s)??ne(s);return(i[0]-n[0])*o[0]+(i[1]-n[1])*o[1]>0&&(o=[-o[0],-o[1]]),o}var Jt=class{constructor(){this.tool="select";this.dragging=!1}setTool(e,t){this.first=void 0,this.tool=t,e.redraw()}get armed(){return this.tool!=="select"}focus(e){let t=e.walls??ue(e.selection);return t===void 0?void 0:e.floor.rooms.find(o=>k(o.id,t))}roomAt(e,t){let o=U(e.floor,t);return e.walls===void 0||o!==void 0&&k(o.id,e.walls)?o:void 0}placed(e,t,o){this.setTool(e,"select"),e.editWalls(t,o)}pickedWall(e,t){let o=e.selection;if(!(t===void 0||o===void 0)){if(o.kind==="wall")return o.wall;if(o.kind==="opening"){let n=t.openings[o.opening],i=n===void 0?-1:De(t,n);return i>=0?i:void 0}}}rail(e){let t=this.focus(e);return m`${t===void 0?v:this.wallsCard(e,t)}
      ${this.checkCard(e)}
      ${t===void 0?v:this.scanCard(e,t)}`}wallsCard(e,t){let o=K(t),n=e.selection,i=t.id,r=Ui(t),a=t.openings.map((l,h)=>({o:l,i:h})).filter(({o:l})=>De(t,l)<0),d=({o:l,i:h})=>{let p=n?.kind==="opening"&&n.opening===h;return m`<button type="button" class="hme-lay sub ${p?"on":""}" aria-pressed=${p?"true":"false"}
        @click=${()=>e.select({kind:"opening",roomId:i,opening:h})}>${ce(l)}<span class="n">${at(Math.hypot(l.b[0]-l.a[0],l.b[1]-l.a[1]))}</span></button>`};return m`<section class="hme-card hme-layers">
      <div class="hme-h">${T(t)}<span class="hme-h-end">${C(o.length,"wall")}</span></div>
      ${o.map((l,h)=>{let p=n?.kind==="wall"&&n.wall===h;return m`<button type="button" class="hme-lay ${p?"on":""}" aria-pressed=${p?"true":"false"}
            @click=${()=>e.select({kind:"wall",roomId:i,wall:h})}>${r[h]}<span class="n">${at(se(l))}</span></button>
          ${t.openings.map((c,f)=>({o:c,i:f})).filter(({o:c})=>De(t,c)===h).map(d)}`})}
      ${a.length===0?v:m`<div class="hme-lay dim">In no wall</div>${a.map(d)}`}
    </section>`}scanCard(e,t){if(e.scans===void 0)return v;let o=t.id,n=ro(e.scans,o),i=n!==void 0&&xo(t,n)?n:void 0;return H("Show scan as it was",m`<div class="hme-row-end">
      <button type="button" class="hme-tb ${e.toggles.scan?"on":""}" aria-pressed=${e.toggles.scan?"true":"false"} title=${ir}
        @click=${()=>e.setToggle("scan",!e.toggles.scan)}>${e.toggles.scan?"On":"Off"}</button>
      <button type="button" class="hme-tb" ?disabled=${i===void 0} title=${i===void 0?"This room is as the iPhone scanned it, or was drawn here":rr}
        @click=${()=>{i!==void 0&&e.apply(r=>Ho(r,o,i))}}>Back to the scan</button>
    </div>`)}checkCard(e){let t=Zt(e.floor),o=e.floor.id;return m`
      ${H("Scan check",m`
        ${t.length===0?m`<p class="hme-text dim">Nothing to fix. The walls meet and every room has a way in.</p>`:v}
        ${t.map(n=>m`<div class="hme-fix">
          <span class="hme-fix-dot ${n.kind==="missingDoor"?"gray":""}"></span>
          <p @click=${()=>e.select({kind:"room",roomId:n.roomIds[0]})}><b>${n.title}</b> ${n.detail}</p>
          <button type="button" class="hme-tb" @click=${()=>e.apply(i=>n.fix(i))}>${n.fixLabel}</button></div>`)}
        ${t.length>1?m`<button type="button" class="hme-tb hme-wide" @click=${()=>e.apply(n=>ri(n,o))}>${Gr(t.length)}</button>`:v}`,t.length===0?void 0:m`<span class="hme-amber">${t.length} to fix</span>`)}`}overlay(e){let t=this.focus(e),o=[];if(t!==void 0&&t.outline.length>=3){let n=t.outline.map(i=>ve(e.toScreen(i))).join("L");o.push(M`<path d=${`M0 0H${e.stage.width}V${e.stage.height}H0ZM${n}Z`} fill="rgba(0,0,0,0.45)" fill-rule="evenodd" pointer-events="none" />`)}return e.toggles.scan&&o.push(...this.scanMarks(e)),o.push(...this.issueMarks(e)),t!==void 0&&o.push(this.roomHandles(e,t)),o.push(...this.ghost(e)),M`${o}`}scanMarks(e){return ai(e.floor,e.scans).map(t=>{let o=t.outline.map(i=>ve(e.toScreen(i))).join("L"),n=t.walls.map(i=>`M${ve(e.toScreen(i.a))}L${ve(e.toScreen(i.b))}`).join("");return M`<g class="hme-scan" data-room=${t.roomId} pointer-events="none">
        <path d=${`M${o}Z`} fill=${tn} fill-opacity="0.06" stroke="none" />
        <path d=${n} fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="3.5" stroke-dasharray="7 5" />
        <path d=${n} fill="none" stroke=${tn} stroke-width="1.6" stroke-dasharray="7 5" stroke-opacity="0.9" />
        ${t.openings.map(i=>{let r=e.toScreen(i.a),a=e.toScreen(i.b);return M`<line x1=${$(r[0])} y1=${$(r[1])} x2=${$(a[0])} y2=${$(a[1])} stroke=${tn} stroke-width="4" stroke-opacity="0.85"
            stroke-dasharray=${i.kind==="window"?"2 3":"none"} />`})}
      </g>`})}issueMarks(e){return Zt(e.floor).map(t=>{let[o,n]=e.toScreen(t.where);if(t.kind==="offSquare"){let l=/(\d+)°/.exec(t.title)?.[1]??"";return M`<g class="hme-issue" data-hme=${`issue:${t.id}`} style="cursor:pointer"><title>${t.title} Click to square it.</title>
          <circle cx=${$(o)} cy=${$(n)} r="9" fill="#ffb340" stroke="#fff" stroke-width="2" />
          <g class="hme-tag"><rect x=${$(o+12)} y=${$(n+6)} width="44" height="20" rx="10" fill="#ffb340" />
          <text x=${$(o+34)} y=${$(n+20)} fill="#2a1a00" text-anchor="middle">${l}°</text></g></g>`}let i=`${Math.round(t.amount*100)} cm`,r=t.kind==="overlap"?`Overlap ${i} \xB7 ${t.fixLabel}`:t.kind==="gap"?`Gap ${i} \xB7 ${t.fixLabel}`:`No door \xB7 ${t.fixLabel}`,a=r.length*6.2+18,d=t.kind==="missingDoor";return M`<g class="hme-issue" data-hme=${`issue:${t.id}`} style="cursor:pointer"><title>${t.title} ${t.detail}</title>
        <circle cx=${$(o)} cy=${$(n)} r="4" fill=${d?"#8e8e93":"#ffb340"} />
        <g class="hme-tag"><rect x=${$(o-a/2)} y=${$(n+8)} width=${$(a)} height="20" rx="10" fill=${d?"#8e8e93":"#ffb340"} />
        <text x=${$(o)} y=${$(n+22)} fill=${d?"#fff":"#2a1a00"} text-anchor="middle">${r}</text></g></g>`})}roomHandles(e,t){let o=K(t),n=e.selection,i=this.pickedWall(e,t),r=[];if(i!==void 0&&o[i]!==void 0){let d=o[i],l=e.toScreen(d.a),h=e.toScreen(d.b),p=sr(t,d);if(r.push(M`<line x1=${$(l[0])} y1=${$(l[1])} x2=${$(h[0])} y2=${$(h[1])} stroke="#5b8def" stroke-width="9" stroke-linecap="round" pointer-events="none" />`),n?.kind==="wall"&&!this.dragging){let c=[(l[0]+h[0])/2+p[0]*22,(l[1]+h[1])/2+p[1]*22];r.push(M`<g class="hme-tag" pointer-events="none"><rect x=${$(c[0]-27)} y=${$(c[1]-9)} width="54" height="18" rx="9" fill="#5b8def" />
          <text x=${$(c[0])} y=${$(c[1]+4)} fill="#fff" text-anchor="middle">${se(d).toFixed(2)} m</text></g>`)}}for(let[d,l]of t.openings.entries()){let h=e.toScreen(l.a),p=e.toScreen(l.b),c=n?.kind==="opening"&&n.opening===d,f=l.kind==="window"?"#8bb8f0":l.kind==="door"?"#ece6da":"#98989d";r.push(M`<g data-hme=${`opening:${d}`} style="cursor:ew-resize">
        <line x1=${$(h[0])} y1=${$(h[1])} x2=${$(p[0])} y2=${$(p[1])} stroke=${c?"#5b8def":"rgba(14,14,16,0.9)"} stroke-width="12" stroke-linecap="round" />
        <line x1=${$(h[0])} y1=${$(h[1])} x2=${$(p[0])} y2=${$(p[1])} stroke=${f} stroke-width="3" />
        ${c?M`<circle cx=${$(h[0])} cy=${$(h[1])} r="5" fill="#fff" stroke="#5b8def" stroke-width="2" /><circle cx=${$(p[0])} cy=${$(p[1])} r="5" fill="#fff" stroke="#5b8def" stroke-width="2" />`:v}
      </g>`)}let a=this.sliding!==void 0&&k(this.sliding.roomId,t.id)?this.sliding.index:n?.kind==="opening"?n.opening:void 0;if(a!==void 0&&t.openings[a]!==void 0&&r.push(this.distances(e,t,t.openings[a])),!this.dragging||this.sliding===void 0){if(this.tool==="select")for(let[d,l]of o.entries()){if(se(l)*e.view.scale<40)continue;let h=e.toScreen([(l.a[0]+l.b[0])/2,(l.a[1]+l.b[1])/2]);r.push(M`<circle data-hme=${`mid:${d}`} cx=${$(h[0])} cy=${$(h[1])} r="5" fill="#0e0e10" stroke="#5b8def" stroke-width="1.5" style="cursor:copy"><title>Drag to add a corner</title></circle>`)}for(let[d,l]of t.outline.entries()){let[h,p]=e.toScreen(l),c=n?.kind==="corner"&&n.corner===d;r.push(M`<circle data-hme=${`corner:${d}`} cx=${$(h)} cy=${$(p)} r="7" fill=${c?"#5b8def":"#fff"} stroke=${c?"#fff":"#5b8def"} stroke-width="2" style="cursor:move" />`)}}return M`<g class="hme-handles">${r}</g>`}distances(e,t,o){let n=De(t,o),i=n>=0?K(t)[n]:void 0;if(i===void 0)return M``;let r=se(i),a=we(o.a,i.a,i.b).along,d=we(o.b,i.a,i.b).along,l=Math.max(0,Math.min(a,d)),h=Math.min(r,Math.max(a,d)),p=sr(t,i),c=[(i.b[0]-i.a[0])/r,(i.b[1]-i.a[1])/r],f=w=>{let y=e.toScreen([i.a[0]+c[0]*w,i.a[1]+c[1]*w]);return[y[0]+p[0]*26,y[1]+p[1]*26]},g=[0,l,h,r],u=w=>`M${ve([w[0]-p[0]*5,w[1]-p[1]*5])}L${ve([w[0]+p[0]*5,w[1]+p[1]*5])}`,b=[[0,l,!1],[l,h,!0],[h,r,!1]];return M`<g class="hme-dist" pointer-events="none">
      <path d=${`M${ve(f(0))}L${ve(f(r))}${g.map(w=>u(f(w))).join("")}`} stroke="#98989d" stroke-width="1" fill="none" />
      ${b.filter(([w,y])=>y-w>.02).map(([w,y,P])=>{let E=f((w+y)/2);return M`<g class="hme-tag"><rect x=${$(E[0]-25)} y=${$(E[1]-9)} width="50" height="18" rx="9" fill=${P?"#5b8def":"#2c2c2e"} />
          <text x=${$(E[0])} y=${$(E[1]+4)} fill="#fff" text-anchor="middle">${(y-w).toFixed(2)} m</text></g>`})}
    </g>`}ghost(e){let t=this.hoverAt;if(t===void 0)return[];let o=[];if(this.tool==="door"||this.tool==="window"||this.tool==="opening"){let n=on(e,t,nr,this.focus(e));if(n!==void 0){let i=this.tool==="window"?1.2:.9,r=se(n.seg),a=Math.min(i,r),d=Math.min(Math.max(we(t,n.seg.a,n.seg.b).along,a/2),r-a/2),l=[(n.seg.b[0]-n.seg.a[0])/r,(n.seg.b[1]-n.seg.a[1])/r],h=e.toScreen([n.seg.a[0]+l[0]*(d-a/2),n.seg.a[1]+l[1]*(d-a/2)]),p=e.toScreen([n.seg.a[0]+l[0]*(d+a/2),n.seg.a[1]+l[1]*(d+a/2)]);o.push(M`<line x1=${$(h[0])} y1=${$(h[1])} x2=${$(p[0])} y2=${$(p[1])} stroke="#5b8def" stroke-width="10" stroke-opacity="0.6" stroke-linecap="round" pointer-events="none" />`)}}if(this.tool==="stairs"&&this.roomAt(e,t)!==void 0){let[n,i]=e.toScreen(t),r=e.px(1),a=e.px(2.6);o.push(M`<g pointer-events="none" opacity="0.7"><rect x=${$(n-r/2)} y=${$(i-a/2)} width=${$(r)} height=${$(a)} fill="none" stroke="#5b8def" stroke-width="1.5" stroke-dasharray="4 3" />
        ${[1,2,3,4,5,6,7].map(d=>M`<line x1=${$(n-r/2)} x2=${$(n+r/2)} y1=${$(i-a/2+a*d/8)} y2=${$(i-a/2+a*d/8)} stroke="#5b8def" stroke-width="1" />`)}</g>`)}if((this.tool==="split"||this.tool==="inner")&&this.first!==void 0){let n=e.toScreen(this.first.a),i=e.toScreen(this.snap(e,t,this.first.a));if(this.tool==="split"){let r=Math.max(Math.hypot(i[0]-n[0],i[1]-n[1]),1e-6),a=[(i[0]-n[0])/r,(i[1]-n[1])/r],d=Math.hypot(e.stage.width,e.stage.height);o.push(M`<line x1=${$(n[0]-a[0]*d)} y1=${$(n[1]-a[1]*d)} x2=${$(n[0]+a[0]*d)} y2=${$(n[1]+a[1]*d)} stroke="#5b8def" stroke-width="1.5" stroke-dasharray="6 4" pointer-events="none" />`)}else o.push(M`<line x1=${$(n[0])} y1=${$(n[1])} x2=${$(i[0])} y2=${$(i[1])} stroke="#ece6da" stroke-width=${$(Math.max(e.px(.1),3))} stroke-opacity="0.8" pointer-events="none" />`);o.push(M`<circle cx=${$(n[0])} cy=${$(n[1])} r="5" fill="#5b8def" pointer-events="none" />`)}return o}snap(e,t,o){return qo(e.floor,t,e.view.scale,{...o===void 0?{}:{from:o},...e.toggles.grid?{grid:ge}:{}})}pointerDown(e,t,o){if(t.button!==0)return!1;switch(this.tool){case"door":case"window":case"opening":{let n=on(e,o,nr,this.focus(e));if(n===void 0)return!1;let i=this.tool,r=n.room.id,a={kind:"opening",roomId:r,opening:n.room.openings.length},d=n.wall;return e.apply(l=>Dt(l,r,d,{kind:i,at:o}),{select:a})&&this.placed(e,r,a),!0}case"stairs":{let n=this.roomAt(e,o);if(n===void 0)return!1;let i=n.id,r={kind:"room",roomId:i};return e.apply(a=>Un(a,i,o),{select:r})&&this.placed(e,i,r),!0}case"split":case"inner":return this.twoPoints(e,o);default:return this.pick(e,t,o)}}twoPoints(e,t){if(this.first===void 0){let r=(e.walls===void 0?U(e.floor,t):void 0)??this.focus(e);return r===void 0?!1:(this.first={roomId:r.id,a:this.snap(e,t)},e.walls===void 0?e.select({kind:"room",roomId:r.id}):e.redraw(),!0)}let{roomId:o,a:n}=this.first,i=this.snap(e,t,n);if(this.first=void 0,Math.hypot(i[0]-n[0],i[1]-n[1])<.1)return e.redraw(),!0;if(this.tool==="inner"){let r=e.doc.floors.flatMap(d=>d.rooms).find(d=>k(d.id,o)),a={kind:"wall",roomId:o,wall:r===void 0?0:po(r).length};return e.apply(d=>oi(d,o,n,i),{select:a})?this.placed(e,o,a):e.note("err","An inner wall needs to be at least 10 cm long."),!0}return this.split(e,o,n,i),!0}async split(e,t,o,n){let i=e.floor.rooms.find(l=>k(l.id,t)),r=await e.ask({title:"Name the new room",label:"Name",value:i===void 0?"Room":`${T(i)} 2`,ok:"Split the room"});if(r===void 0)return;let a=e.newId(),d={kind:"room",roomId:a};e.apply(l=>ni(l,t,o,n,a,r),{select:d})?(this.setTool(e,"select"),e.editWalls(void 0,d)):e.note("err","That line does not cut the room in two. Draw it right across the room.")}pick(e,t,o){let n=this.focus(e),i=t.target?.closest?.("[data-hme]")?.getAttribute("data-hme")??"",[r,a]=i.split(/:(.*)/s);if(r==="issue"){let p=Zt(e.floor).find(c=>c.id===a);return p!==void 0&&e.apply(c=>p.fix(c)),!0}let d=Number(a);if(n!==void 0&&r==="corner"&&Number.isInteger(d))return this.cornerDrag(e,t,n,d),!0;if(n!==void 0&&r==="mid"&&Number.isInteger(d))return this.midDrag(e,t,n,d),!0;if(n!==void 0&&r==="opening"&&Number.isInteger(d))return this.openingDrag(e,t,n,d),!0;let l=on(e,o,Ur,n);if(l!==void 0)return this.wallAt=we(o,l.seg.a,l.seg.b).point,e.select({kind:"wall",roomId:l.room.id,wall:l.wall}),!0;let h=U(e.floor,o);return e.walls!==void 0&&(h===void 0||!k(h.id,e.walls))?(e.editWalls(void 0),!0):h===void 0?!1:(e.select({kind:"room",roomId:h.id}),!0)}cornerTo(e,t,o,n){let i=e.floor.rooms.filter(d=>!k(d.id,t.id)).flatMap(d=>d.outline),r=10/e.view.scale;for(let d of i)if(Math.hypot(d[0]-n[0],d[1]-n[1])<=r)return[d[0],d[1]];let a=n;if(e.toggles.grid&&(a=[Math.round(a[0]/ge)*ge,Math.round(a[1]/ge)*ge]),e.toggles.square){let d=Cn(e.floor.rooms.flatMap(b=>po(b))),l=Math.cos(d),h=Math.sin(d),p=b=>[b[0]*l+b[1]*h,-b[0]*h+b[1]*l],[c,f]=p(a),g=t.outline.length,u=8/e.view.scale;for(let b of[(o+g-1)%g,(o+1)%g]){let[w,y]=p(t.outline[b]);Math.abs(c-w)<=u&&(c=w),Math.abs(f-y)<=u&&(f=y)}a=[c*l-f*h,c*h+f*l]}return a}cornerDrag(e,t,o,n){let i=o.id,r;e.drag(t,{move:a=>{this.dragging=!0;let d=this.cornerTo(e,o,n,a);r=d,e.preview(l=>Oe(l,i,n,d))},end:(a,d,l)=>{this.dragging=!1,e.preview(void 0);let h=r,p={kind:"corner",roomId:i,corner:n};l&&h!==void 0?e.apply(c=>Oe(c,i,n,h),{select:p}):e.select(p)},cancel:()=>this.stopDrag(e)})}midDrag(e,t,o,n){let i=o.id,r=K(o)[n],a=Rt(e.doc,i,n),d=a?.floors.flatMap(f=>f.rooms).find(f=>k(f.id,i));if(r===void 0||a===void 0||d===void 0)return;let l=[(r.a[0]+r.b[0])/2,(r.a[1]+r.b[1])/2],h=d.outline.reduce((f,g,u)=>Math.hypot(g[0]-l[0],g[1]-l[1])<Math.hypot(d.outline[f][0]-l[0],d.outline[f][1]-l[1])?u:f,0),p=f=>g=>{let u=Rt(g,i,n);return u===void 0||f===void 0?u:Oe(u,i,h,f)},c;e.drag(t,{move:f=>{this.dragging=!0,c=this.cornerTo(e,d,h,f),e.preview(p(c))},end:(f,g,u)=>{this.dragging=!1,e.preview(void 0),e.apply(p(u?c:void 0),{select:{kind:"corner",roomId:i,corner:h}})},cancel:()=>this.stopDrag(e)})}openingDrag(e,t,o,n){let i=o.id,r=o.openings[n];if(r===void 0)return;let a={kind:"opening",roomId:i,opening:n},d=[(r.a[0]+r.b[0])/2,(r.a[1]+r.b[1])/2],l,h;e.select(a),e.drag(t,{move:p=>{l??=p,this.dragging=!0,this.sliding={roomId:i,index:n};let c=[d[0]+p[0]-l[0],d[1]+p[1]-l[1]];h=c,e.preview(f=>ko(f,i,n,c))},end:(p,c,f)=>{this.dragging=!1,this.sliding=void 0,e.preview(void 0);let g=h;f&&g!==void 0&&e.apply(u=>ko(u,i,n,g),{select:a})},cancel:()=>this.stopDrag(e)})}stopDrag(e){this.dragging=!1,this.sliding=void 0,e.preview(void 0)}hover(e,t){this.tool!=="select"&&(this.hoverAt=t,e.redraw())}keyDown(e,t){let o=Z(t,!1);if(typeof o=="object"&&"letter"in o){let n=Kr(o.letter);return n===void 0?!1:(this.setTool(e,n),!0)}if(o==="cancel"&&(this.tool!=="select"||this.first!==void 0))return this.setTool(e,"select"),!0;if(o==="delete"){let n=e.selection;if(n?.kind==="corner")e.apply(i=>It(i,n.roomId,n.corner),{select:{kind:"room",roomId:n.roomId}});else if(n?.kind==="opening")e.apply(i=>Ot(i,n.roomId,n.opening),{select:{kind:"room",roomId:n.roomId}});else if(n?.kind==="wall")e.apply(i=>$o(i,n.roomId,n.wall),{select:{kind:"room",roomId:n.roomId}});else return!1;return!0}return!1}cursor(){return this.tool==="select"?void 0:"crosshair"}leave(e){this.first=void 0,this.hoverAt=void 0,this.dragging=!1,this.sliding=void 0,this.tool="select",e.redraw()}dock(e){return m`<button type="button" class="hme-tb ${e.toggles.square?"on":""}" aria-pressed=${e.toggles.square?"true":"false"}
        title="A dragged corner lines up with the corners beside it" @click=${()=>e.setToggle("square",!e.toggles.square)}>Snap to 90°</button>
      <button type="button" class="hme-tb ${e.toggles.grid?"on":""}" aria-pressed=${e.toggles.grid?"true":"false"}
        @click=${()=>e.setToggle("grid",!e.toggles.grid)}>Grid 5 cm</button>
      ${e.scans===void 0?v:m`<button type="button" class="hme-tb ${e.toggles.scan?"on":""}" aria-pressed=${e.toggles.scan?"true":"false"}
        title=${ir} @click=${()=>e.setToggle("scan",!e.toggles.scan)}>Show scan as it was</button>`}`}pill(e){if(this.tool!=="select"){let r={split:this.first===void 0?"Click where the cut starts":"Click where it ends, across the room",inner:this.first===void 0?"Click where the wall starts":"Click where it ends",door:"Click a wall to put a door in it",window:"Click a wall to put a window in it",opening:"Click a wall to open a way through it",stairs:"Click in the room to put stairs there"};return m`<span class="hme-pill-name">${r[this.tool]}</span>
        <button type="button" class="hme-tb" @click=${()=>this.setTool(e,"select")}>Cancel</button>`}let t=this.focus(e),o=e.selection;if(t===void 0||o===void 0||this.dragging)return v;let n=t.id,i=T(t);if(o.kind==="wall"){let r=o.wall,a=this.wallAt,d=Wo(t,r,i).replace(", "," \xB7 ");return m`<span class="hme-pill-name">${d}</span>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(e,t,r,"window",a)}>＋ Window here</button>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(e,t,r,"door",a)}>＋ Door here</button>
        <button type="button" class="hme-tb" @click=${()=>this.cornerHere(e,t,r,a)}>Add a corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(l=>Mo(l,n,r))}>Straighten</button>`}if(o.kind==="corner")return m`<span class="hme-pill-name">${i} · corner</span>
        <button type="button" class="hme-tb" ?disabled=${t.outline.length<=3} @click=${()=>e.apply(r=>It(r,n,o.corner),{select:{kind:"room",roomId:n}})}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(r=>de(r,n))}>Square the corners</button>`;if(o.kind==="opening"){let r=t.openings[o.opening];return r===void 0?v:m`<span class="hme-pill-name">${ce(r)}</span>
        <button type="button" class="hme-tb danger" @click=${()=>e.apply(a=>Ot(a,n,o.opening),{select:{kind:"room",roomId:n}})}>Remove</button>`}return m`<span class="hme-pill-name">${i}</span>
      <button type="button" class="hme-tb" @click=${()=>e.apply(r=>de(r,n))}>Square the corners</button>`}addHere(e,t,o,n,i){let r=t.id,a=t.openings.length;e.apply(d=>Dt(d,r,o,{kind:n,...i===void 0?{}:{at:i}}),{select:{kind:"opening",roomId:r,opening:a}})}cornerHere(e,t,o,n){let i=t.id,r=p=>Rt(p,i,o,n),a=r(e.doc)?.floors.flatMap(p=>p.rooms).find(p=>k(p.id,i)),d=K(t)[o],l=n??(d===void 0?void 0:[(d.a[0]+d.b[0])/2,(d.a[1]+d.b[1])/2]),h=a===void 0||l===void 0?-1:a.outline.reduce((p,c,f)=>Math.hypot(c[0]-l[0],c[1]-l[1])<Math.hypot(a.outline[p][0]-l[0],a.outline[p][1]-l[1])?f:p,0);e.apply(r,{select:h<0?{kind:"room",roomId:i}:{kind:"corner",roomId:i,corner:h}})}inspector(e){let t=this.focus(e),o=e.selection;if(t===void 0||o===void 0){let p=Zt(e.floor);return H("Shape",m`<p class="hme-text">Pick a room, then a wall or a corner. Drag a corner to move it; a corner two rooms share moves for both.</p>
        <p class="hme-text dim">${p.length===0?"The scan check found nothing to fix on this floor.":`The scan check found ${C(p.length,"thing")} to fix. They are marked in amber.`}</p>`)}let n=t.id;if(o.kind==="corner")return this.cornerCard(e,t,o.corner);let i=this.pickedWall(e,t);if(i===void 0){let p=ro(e.scans,n),c=p!==void 0&&xo(t,p)?p:void 0;return H(T(t),m`
        ${O("Corners",m`<span class="hme-val">${t.outline.length}</span>`)}
        ${O("Walls",m`<span class="hme-val">${K(t).length}</span>`)}
        ${O("Wall height",I({label:"Wall height",value:t.height,unit:"m",min:.5,max:20,set:f=>e.apply(g=>Ye(g,n,f))}))}
        ${B("Click a wall to change it or put a door or window in it. Drag a corner to move it, or the dot in a wall's middle to add a corner.")}
        ${c===void 0?v:B("Its shape has changed since the iPhone scanned it.")}
        <div class="hme-row-end">
          ${c===void 0?v:m`<button type="button" class="hme-tb" title=${rr} @click=${()=>e.apply(f=>Ho(f,n,c))}>Back to the scan</button>`}
          <button type="button" class="hme-tb" @click=${()=>e.apply(f=>de(f,n))}>Square the corners</button>
        </div>`)}let r=K(t)[i],a=t.openings.map((p,c)=>({o:p,i:c})).filter(({o:p})=>De(t,p)===i),d=o.kind==="opening"?t.openings[o.opening]:void 0,l=se(r),h=p=>{let c=t.openings.length;e.apply(f=>Dt(f,n,i,{kind:p}),{select:{kind:"opening",roomId:n,opening:c}})};return m`
      ${H("Wall",m`
        ${O("Room",m`<span class="hme-val strong">${Wo(t,i,T(t))}</span>`)}
        ${O("Length",I({label:"Length",value:l,unit:"m",min:.1,max:200,set:p=>e.apply(c=>ei(c,n,i,p))}))}
        ${O("Thickness",I({label:"Thickness",value:r.t,unit:"m",min:.01,max:1,set:p=>e.apply(c=>ti(c,n,i,p))}))}
        ${O("Height",I({label:"Wall height",value:t.height,unit:"m",min:.5,max:20,set:p=>e.apply(c=>Ye(c,n,p))}))}
        ${B("Type a length to move the far corner. Rooms that share the corner move with it.")}
        <div class="hme-row-end indent">
          <button type="button" class="hme-tb" @click=${()=>e.apply(p=>Mo(p,n,i))}>Straighten</button>
          <button type="button" class="hme-tb" @click=${()=>e.apply(p=>de(p,n))}>Square the corners</button>
          <button type="button" class="hme-tb" @click=${()=>this.cornerHere(e,t,i,void 0)}>Split wall</button>
          <button type="button" class="hme-tb danger" title="Take this wall away" @click=${()=>e.apply(p=>$o(p,n,i),{select:{kind:"room",roomId:n}})}>Remove</button>
        </div>`)}
      ${H("On this wall",m`
        ${a.map(({o:p,i:c})=>{let f=we(p.a,r.a,r.b).along,g=we(p.b,r.a,r.b).along,u=o.kind==="opening"&&o.opening===c;return m`<button type="button" class="hme-list-row ${u?"on":""}" @click=${()=>e.select({kind:"opening",roomId:n,opening:c})}>
            <span class="hme-grow">${ce(p)}</span><span class="mono dim">${at(Math.abs(g-f))} · ${at(Math.max(0,Math.min(f,g)))} in</span></button>`})}
        ${a.length===0?m`<p class="hme-empty-line">Nothing on this wall.</p>`:v}
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${()=>h("door")}>＋ Door</button>
          <button type="button" class="hme-tb" @click=${()=>h("window")}>＋ Window</button>
          <button type="button" class="hme-tb" @click=${()=>h("opening")}>＋ Way through</button>
        </div>`)}
      ${d===void 0||o.kind!=="opening"?v:this.openingCard(e,t,o.opening,d)}`}openingCard(e,t,o,n){let i=t.id,r=Math.hypot(n.b[0]-n.a[0],n.b[1]-n.a[1]),a=n.z1-n.z0;return H(ce(n),m`
      <div class="hme-pics">${Br.map(d=>V({label:d.label,picture:Xr[d.label],on:n.kind===d.kind&&n.style===d.style,click:()=>e.apply(l=>Qe(l,i,o,{kind:d.kind,style:d.style??null}))}))}</div>
      ${O("Width",I({label:"Width",value:r,unit:"m",min:.1,max:20,set:d=>e.apply(l=>Qe(l,i,o,{width:d}))}))}
      ${O("From floor",I({label:"From floor",value:n.z0,unit:"m",min:0,max:20,set:d=>e.apply(l=>Qe(l,i,o,{z0:d,z1:d+a}))}),m`<span class="hme-l short">Tall</span>`,I({label:"Tall",value:a,unit:"m",min:.05,max:20,set:d=>e.apply(l=>Qe(l,i,o,{z1:n.z0+d}))}))}
      ${B("Drag it along the wall. The plan shows the space to each corner.")}
      <div class="hme-row-end indent"><button type="button" class="hme-tb danger" @click=${()=>e.apply(d=>Ot(d,i,o),{select:{kind:"room",roomId:i}})}>Remove ${ce(n).toLowerCase()}</button></div>`)}cornerCard(e,t,o){let n=t.id,i=t.outline[o];if(i===void 0)return m``;let r=e.floor.rooms.filter(a=>!k(a.id,n)&&a.outline.some(d=>Math.hypot(d[0]-i[0],d[1]-i[1])<=.02));return H("Corner",m`
      ${O("Room",m`<span class="hme-val strong">${T(t)}</span>`)}
      ${O("Left, top",I({label:"Corner left",value:i[0],unit:"m",set:a=>e.apply(d=>Oe(d,n,o,[a,i[1]]))}),I({label:"Corner top",value:i[1],unit:"m",set:a=>e.apply(d=>Oe(d,n,o,[i[0],a]))}))}
      ${B(r.length===0?"Drag it on the plan. Drop it on another room's corner and the two move together after.":`Shared with ${r.map(T).join(", ")}, which move${r.length===1?"s":""} with it.`)}
      <div class="hme-row-end indent">
        <button type="button" class="hme-tb" ?disabled=${t.outline.length<=3} @click=${()=>e.apply(a=>It(a,n,o),{select:{kind:"room",roomId:n}})}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(a=>de(a,n))}>Square the corners</button>
      </div>`)}},Vr={select:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3z" fill="none" stroke="currentColor" stroke-width="1.4"></path><circle cx="3" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="15" r="2" fill="currentColor"></circle><circle cx="3" cy="15" r="2" fill="currentColor"></circle></svg>`,split:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 3h14v12H2z" fill="none" stroke="currentColor" stroke-width="1.4"></path><path d="M9 1v16" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 2"></path></svg>`,inner:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="2.4"></path></svg>`,door:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 15h4M12 15h4M6 15V5M6 5a10 10 0 0 1 10 10" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`,window:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="1.4"></path><path d="M5 7h8M5 11h8" stroke="#8bb8f0" stroke-width="1.4"></path></svg>`,opening:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h4M12 9h4" stroke="currentColor" stroke-width="2.4"></path></svg>`,stairs:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3zM3 6h12M3 9h12M3 12h12" fill="none" stroke="currentColor" stroke-width="1.2"></path></svg>`},Xr={Door:m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V4M14 4a17 17 0 0 1 17 17" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Double door":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V7M48 21V7M14 7a14 14 0 0 1 14 14M48 7a14 14 0 0 0-14 14" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Sliding door":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18.5h20M28 23.5h20" stroke="#ece6da" stroke-width="2.4"></path></svg>`,Window:m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 18h34M14 24h34" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Sliding window":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18h20M28 24h20" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Way through":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h10M48 21h10" stroke="#ece6da" stroke-width="4"></path><path d="M14 27h34" stroke="#98989d" stroke-width="1" stroke-dasharray="3 3"></path></svg>`};var pr=[{id:"pick",label:"Pick and move",key:"v"},{id:"draw",label:"Draw a room",key:"r"},{id:"inner",label:"Inner wall",key:"w"},{id:"door",label:"Door",key:"d"},{id:"window",label:"Window",key:"n"},{id:"furniture",label:"Add furniture",key:"f"},{id:"measure",label:"Measure",key:"m"}];function qr(s){return pr.find(e=>e.key===s.toLowerCase())?.id}var lr=4,Yr=s=>`${s[0].toFixed(1)} \xD7 ${s[1].toFixed(1)}`;function Zr(s){let e=s.openings.filter(o=>o.kind==="window").length,t=s.openings.length-e;return`${C(t,"door")} \xB7 ${C(e,"window")}`}function Jr(s,e){let t=ie(s.entityId,e);return(t.kind==="light"||t.kind==="other")&&t.on}var Qt=class{constructor(){this.arrange=new Vt;this.devices=new Yt;this.shape=new Jt;this.query="";this.trayOpen=!1}tool(e){if(e.toggles.measure)return"measure";if(e.walls!==void 0)return this.shape.tool;if(this.arrange.draw.active)return"draw";let t=this.shape.tool;return t==="inner"||t==="door"||t==="window"?t:"pick"}setTool(e,t){if(t==="furniture"){let o=er(e);o===void 0?e.note("warn","Draw or scan a room first, then add its furniture."):this.arrange.openPicker(e,o);return}if(t==="measure"){this.arrange.draw.stop(),this.shape.setTool(e,"select"),e.setToggle("measure",!e.toggles.measure),e.redraw();return}if(e.toggles.measure&&e.setToggle("measure",!1),t==="draw"){this.shape.setTool(e,"select"),this.arrange.draw.active||this.arrange.draw.start(e);return}this.arrange.draw.stop(e),this.shape.setTool(e,t==="pick"?"select":t)}openRooms(e){let t=e.selection;if(t===void 0||t.kind==="pins")return[];if(t.kind==="pin"){let o=e.floor.pins.find(i=>k(i.id,t.pinId)),n=o===void 0?void 0:J(e.floor,o)?.id;return n===void 0?[]:[n]}return t.kind==="objects"?t.items.map(o=>o.roomId):[t.roomId]}picksPins(e){return re(e.selection).length>0}rail(e){if(e.walls!==void 0)return this.shape.rail(e);let t=e.hass?.states,o=$i(e.hass),n=this.query.trim().toLowerCase(),i=n===""?[]:Hi(o,this.query).filter(r=>!e.floor.pins.some(a=>a.entityId===r.entityId));return m`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find a room, thing or device" aria-label="Find a room, thing or device" .value=${j(this.query)}
          @input=${r=>{this.query=r.target.value,e.redraw()}} /></label>
      ${this.layers(e,n)}
      ${n===""||i.length===0?v:H("Not on the map, found",m`
        ${i.map(r=>this.devices.deviceRow(e,r,t))}`,i.length>=40?"40+":String(i.length),"hme-tray")}
      ${this.trayCard(e,o,t)}`}layers(e,t){let o=e.floor,n=e.toggles.live?e.hass?.states:void 0,i=p=>p.toLowerCase().includes(t),r=p=>i(G(p,e.hass))||p.entityId.includes(t),a=this.openRooms(e),d=o.rooms.map(p=>{let c=p.objects.map((w,y)=>({object:w,index:y})),f=Ue(o,p.id);if(t==="")return{room:p,things:c,pins:f,open:a.some(w=>k(p.id,w))};let g=i(T(p)),u=c.filter(({object:w})=>i(X(w))),b=f.filter(r);if(!(!g&&u.length===0&&b.length===0))return{room:p,things:g?c:u,pins:g?f:b,open:!0}}).filter(p=>p!==void 0),l=o.pins.filter(p=>J(o,p)===void 0&&(t===""||r(p))),h=e.doc.floors.filter(p=>!k(p.id,o.id));return m`<section class="hme-card hme-layers">
      <div class="hme-h">${F(o)}<span class="hme-h-end">${C(o.rooms.length,"room")}</span></div>
      ${d.map(p=>this.layer(e,p.room,p.open,p.things,p.pins,n))}
      ${d.length===0?m`<p class="hme-empty-line">${t===""?"No rooms on this floor yet. Draw one with R.":"Nothing by that name."}</p>`:v}
      ${l.length===0?v:m`<div class="hme-lay dim">Not in a room<span class="n">${l.length}</span></div>
        ${l.map(p=>this.pinLayer(e,p,n))}`}
      ${t!==""?v:m`<div class="hme-sep"></div>${this.devices.kindChips(e)}`}
      ${h.length>0?m`<div class="hme-sep"></div>${h.map(p=>m`<button type="button" class="hme-lay dim"
          @click=${()=>e.setFloor(p.id)}>▸ ${F(p)}<span class="n">${C(p.rooms.length,"room")}</span></button>`)}`:v}
    </section>`}layer(e,t,o,n,i,r){let a=e.selection,d=a?.kind==="room"&&k(a.roomId,t.id),l=m`<button type="button" class="hme-lay ${d?"on":""}" aria-pressed=${d?"true":"false"} aria-expanded=${o?"true":"false"}
      title="Click to pick it, double-click to edit its walls"
      @click=${()=>e.select({kind:"room",roomId:t.id})}
      @dblclick=${()=>e.editWalls(t.id)}>
      <span class="hme-caret" aria-hidden="true">${o?"\u25BE":"\u25B8"}</span>
      <span class="hme-dot" style=${`background:${Uo[Se(t)]}`}></span>${T(t)}<span class="n">${ze(t)}</span></button>`;return o?m`${l}
      ${n.map(({object:h,index:p})=>{let c=Di(a,t.id,p),f={roomId:t.id,object:p};return m`<button type="button" class="hme-lay sub ${c?"on":""} ${h.hidden===!0?"dim":""}" aria-pressed=${c?"true":"false"}
          title="Pick it to move, resize or turn it. Cmd or Ctrl and a click picks several."
          @click=${g=>e.select(g.metaKey||g.ctrlKey?He(e.selection,f):{kind:"object",...f})}>
          <span class="hme-thing-ic ${c?"on":""}" aria-hidden="true"></span>${X(h)}<span class="n">${h.hidden===!0?"hidden":Yr(h.size)}</span></button>`})}
      ${i.map(h=>this.pinLayer(e,h,r))}
      <button type="button" class="hme-lay sub dim" title="Edit this room's walls, doors and windows" @click=${()=>e.editWalls(t.id)}>${Zr(t)}<span class="n">Walls ›</span></button>`:l}pinLayer(e,t,o){let n=re(e.selection).some(r=>k(r,t.id)),i=Jr(t,o);return m`<button type="button" class="hme-lay sub ${n?"on":""}" aria-pressed=${n?"true":"false"} title="Shift, Cmd or Ctrl and a click picks several"
      @click=${r=>e.select(r.shiftKey||r.metaKey||r.ctrlKey?ke(e.selection,t.id):{kind:"pin",pinId:t.id})}>
      <span class="hme-dot dev ${i?"":"off"}"></span>${G(t,e.hass)}<span class="n">${me(t.entityId,o)}</span></button>`}trayCard(e,t,o){let n=ki(e.doc,e.floor,t),i=n.reduce((h,p)=>h+p.devices.length,0),r=xi(e.floor,n),a=i-lr,l=this.trayOpen||a<=0?n.map(h=>m`<div class="hme-ar ${h.here?"":"dim"}">${h.name}<span>${h.devices.length}</span></div>
          ${h.devices.map(p=>this.devices.deviceRow(e,p,o))}`):n.flatMap(h=>h.devices).slice(0,lr).map(h=>this.devices.deviceRow(e,h,o));return H("Not on the map",m`
      ${i===0?m`<p class="hme-empty-line">Every device with an area is on the map. Find any other above.</p>`:l}
      ${i===0?v:m`<div class="hme-row-end">
          <button type="button" class="hme-tb hme-grow-btn" ?disabled=${r===0}
            title=${r===0?"Link this floor's rooms to Home Assistant areas first (a room's Area, in its card)":"Each goes into the room linked to its area, at a good height for its kind"}
            @click=${()=>this.devices.placeAll(e,n.flatMap(h=>h.devices))}>Place all ${r} by area</button>
          ${a<=0?v:m`<button type="button" class="hme-tb" aria-expanded=${this.trayOpen?"true":"false"}
            @click=${()=>{this.trayOpen=!this.trayOpen,e.redraw()}}>${this.trayOpen?"Fewer":`${a} more`}</button>`}
        </div>
        <p class="hme-foot">Drag a device onto the plan to place it, or click it to put it in its area's room.</p>`}`,String(i),"hme-tray")}overlay(e){return e.walls!==void 0?this.shape.overlay(e):M`${this.arrange.overlay(e)}${this.shape.armed?this.shape.ghost(e):v}${this.devices.overlay(e)}`}drawsPins(e){return e.walls===void 0}pointerDown(e,t,o){return e.walls!==void 0?this.shape.pointerDown(e,t,o):this.arrange.draw.active?this.arrange.draw.pointerDown(e,t,o):this.shape.armed?this.shape.pointerDown(e,t,o):t.button!==0?!1:this.arrange.pressHandle(e,t,o)||this.devices.pressHandle(e,t,o)||this.devices.pressPin(e,t,o)||this.devices.pressBox(e,t,o)||this.arrange.pressBody(e,t,o)}doubleClick(e,t,o){if(this.arrange.draw.active||this.shape.armed||e.walls===void 0&&this.devices.onPin(e,o))return;let n=U(e.floor,o);n===void 0||k(n.id,e.walls)||e.editWalls(n.id)}hover(e,t){e.walls===void 0&&this.arrange.hover(e,t),this.shape.hover(e,t)}keyDown(e,t){let o=Z(t,!1),n=typeof o=="object"&&"letter"in o?o.letter:void 0;if(n==="m")return this.setTool(e,"measure"),!0;if(e.walls!==void 0)return this.shape.keyDown(e,t)?!0:o==="cancel"?(e.editWalls(void 0),!0):!1;if(this.arrange.draw.active&&this.arrange.draw.keyDown(e,t))return!0;let i=n===void 0?void 0:qr(n);return i!==void 0?(this.setTool(e,i),!0):o==="cancel"&&this.shape.armed?(this.setTool(e,"pick"),!0):this.picksPins(e)?this.devices.keyDown(e,t):this.arrange.keyDown(e,t)}cursor(e){return e.walls!==void 0?this.shape.cursor():this.arrange.draw.active||this.shape.armed?"crosshair":void 0}leave(e){this.arrange.leave(e),this.devices.leave(),this.shape.leave(e)}dock(e){return e.walls!==void 0?this.shape.dock(e):m`${this.arrange.dock(e)}<span class="hme-vsep"></span>${this.devices.dock(e)}`}pill(e){return e.walls!==void 0||this.shape.armed?this.shape.pill(e):this.arrange.draw.active?this.arrange.pill(e):this.picksPins(e)?this.devices.pill(e):this.arrange.pill(e)}banner(e){let t=this.wallsRoom(e);return t===void 0?v:m`<span class="hme-banner-t">Editing the walls of <b>${T(t)}</b></span>
      <button type="button" class="hme-tb hme-blue" title="Back to moving things (Esc)" @click=${()=>e.editWalls(void 0)}>Done <kbd>Esc</kbd></button>`}wallsRoom(e){return e.walls===void 0?void 0:e.floor.rooms.find(t=>k(t.id,e.walls))}stageExtra(e){let t=e.walls===void 0?this.devices.stageExtra(e):v,o=e.walls!==void 0?"Drag a corner \xB7 drag a wall's middle to add a corner \xB7 Esc when done":"Click picks what is on top \xB7 Double-click a room to edit its walls";return m`${this.toolRail(e)}${t}
      ${t===v&&e.stage.width>=900?m`<div class="hme-stage-hint">${o}</div>`:v}`}toolRail(e){let t=this.tool(e),o=e.walls!==void 0,n=o?[...nn,{id:"measure",label:"Measure",key:"m"}]:[...pr],i=new Set(o?[0]:[0,4]);return m`<div class="hme-toolrail" role="toolbar" aria-label=${o?"Wall tools":"Tools"} aria-orientation="vertical">
      ${n.map((r,a)=>m`<button type="button" class="hme-rtool ${t===r.id?"on":""}" aria-pressed=${t===r.id?"true":"false"}
          aria-label=${r.label} title=${`${r.label} (${r.key.toUpperCase()})`} @click=${()=>this.setTool(e,r.id)}>
          ${Qr(r.id)}<kbd>${r.key.toUpperCase()}</kbd></button>
        ${i.has(a)?m`<span class="hme-rtool-sep" aria-hidden="true"></span>`:v}`)}
    </div>`}inspector(e){return e.walls!==void 0?m`${this.shape.inspector(e)}
        ${H("Leave this",m`<p class="hme-text dim">Press Esc, click Done, or click outside the room to go back to moving things. Double-click any room to edit its walls.</p>`)}`:this.picksPins(e)?this.devices.inspector(e):this.arrange.inspector(e)}sheet(e){return this.arrange.sheet(e)}dragOver(e,t,o){return e.walls===void 0&&this.devices.dragOver(e,t,o)}drop(e,t,o){e.walls===void 0&&this.devices.drop(e,t,o)}startDrawing(e){this.setTool(e,"draw")}};function Qr(s){switch(s){case"pick":return m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 2.5v11.5l3.1-3 2.3 5 2-.9-2.3-4.9h4.4z" fill="currentColor"></path></svg>`;case"draw":return m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 15V3h8l4 4v8z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2.5 2"></path></svg>`;case"furniture":return m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 8h14v6H2zM4 4h10v4H4zM3 14v2M15 14v2" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`;case"measure":return m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14M2 6v6M16 6v6M6 9v-2M9 9V6M12 9v-2" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`;default:return dr(s)}}function mr(s){return{get:()=>ft(s),save:(e,t)=>dn(s,e,t)}}var ur="The map had changed on another device. Your change was saved on top of it.",ea="The map changed on another device, and your change no longer fits it. It now shows the map as saved there.",ta="The map changed again while saving, so your change was not saved. Try it once more.";function oa(s){return{doc:gt(s?.doc)??null,rev:typeof s?.rev=="number"?s.rev:0}}function hr(s,e){let t=typeof e=="function"?e(s):gn(s,e);if(t===void 0)return;let o=We(t);return o.ok?{doc:o.doc}:{text:`Not saved. ${o.message}.`}}async function cr(s,e,t){if(e.doc===null)return{ok:!1,text:"There is no map to change yet."};let o=hr(e.doc,t);if(o===void 0)return{ok:!1,text:"That is no longer on the map."};if("text"in o)return{ok:!1,text:o.text};try{let r=await s.save(o.doc,e.rev);return{ok:!0,read:{doc:o.doc,rev:r.rev},merged:!1}}catch(r){let{code:a,message:d}=Ee(r);if(a!=="conflict")return{ok:!1,text:`Not saved. ${d}`}}let n;try{n=oa(await s.get())}catch(r){return{ok:!1,text:`Not saved. The map changed on another device and could not be read again: ${Ee(r).message}`}}let i=n.doc===null?void 0:hr(n.doc,t);if(i===void 0)return{ok:!1,text:ea,read:n};if("text"in i)return{ok:!1,text:i.text,read:n};try{let r=await s.save(i.doc,n.rev);return{ok:!0,read:{doc:i.doc,rev:r.rev},merged:!0}}catch(r){let{code:a,message:d}=Ee(r);return{ok:!1,text:a==="conflict"?ta:`Not saved. ${d}`,read:n}}}function eo(s){return Array.isArray(s)?`[${s.map(eo).join(",")}]`:typeof s=="object"&&s!==null?`{${Object.entries(s).filter(([,t])=>t!==void 0).sort(([t],[o])=>t<o?-1:t>o?1:0).map(([t,o])=>`${JSON.stringify(t)}:${eo(o)}`).join(",")}}`:JSON.stringify(s)}function na(s,e){return s===e?!0:s==null||e==null?!1:eo(s)===eo(e)}function fr(s,e){return t=>na(t,s)?e:void 0}var to=class{constructor(e,t,o=()=>{},n=()=>{},i){this.api=e;this.changed=o;this.saved=n;this.state={kind:"saved"};this.queue=[];this.confirmed=t,this.doc=t.doc,this.history=new fi(i)}get busy(){return this.queue.length>0||this.running!==void 0}get canUndo(){return this.doc!==null&&this.history.canUndo}get canRedo(){return this.doc!==null&&this.history.canRedo}load(e){return this.busy?!1:(this.confirmed=e,this.doc=e.doc,this.history.clear(),this.changed(),!0)}apply(e){let t=this.doc;if(t===null)return!1;let o=e(t);if(o===void 0)return!1;let n=We(o);return n.ok?(this.history.push(t),this.doc=n.doc,this.enqueue(e),!0):(this.note={kind:"err",text:`That cannot be saved. ${n.message}.`},this.changed(),!1)}undo(){let e=this.doc;if(e===null)return!1;let t=this.history.undo(e);return t===void 0?!1:(this.doc=t,this.enqueue(fr(e,t)),!0)}redo(){let e=this.doc;if(e===null)return!1;let t=this.history.redo(e);return t===void 0?!1:(this.doc=t,this.enqueue(fr(e,t)),!0)}async idle(){for(;this.running!==void 0;)await this.running}dismissNote(){this.note=void 0,this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed()}enqueue(e){this.queue.push(e),this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed(),this.kick()}kick(){this.running===void 0&&(this.running=this.run().finally(()=>{this.running=void 0,this.queue.length>0?this.kick():this.changed()}))}async run(){for(;this.queue.length>0;){let e=this.queue.splice(0),t=e.length===1?e[0]:n=>e.reduce((i,r)=>i===void 0?void 0:r(i),n);this.state={kind:"saving"},this.changed();let o=await cr(this.api,this.confirmed,t);if(o.ok){this.confirmed=o.read,this.saved(o.read),o.merged?(this.note={kind:"warn",text:ur},this.history.clear(),this.doc=this.rebased()):this.queue.length===0&&(this.doc=o.read.doc);continue}this.queue=[],this.history.clear(),o.read!==void 0&&(this.confirmed=o.read,this.saved(o.read)),this.doc=this.confirmed.doc,this.note={kind:"err",text:o.text},this.state={kind:"error",text:o.text},this.changed();return}this.state={kind:"saved"}}rebased(){let e=this.confirmed.doc;if(e===null)return null;let t=[];for(let o of this.queue){let n=o(e);if(n===void 0)continue;let i=We(n);i.ok&&(e=i.doc,t.push(o))}return this.queue=t,e}};var gr=an`
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
`;var ct={plan:{title:"Plan",hint:"The floor from above, with real floors, walls and pools of light."},night:{title:"Night",hint:"A small model at night. Lit rooms glow warm."},warm:{title:"Warm",hint:"Wood floors and cream walls, like a doll house."},lines:{title:"Lines",hint:"Only the lines. Calm and clean."},clay:{title:"Clay",hint:"A soft light model, for light pages."},blueprint:{title:"Blueprint",hint:"White lines on blue paper."},dots:{title:"Dots",hint:"A quiet plan with a dot for each light."}};function ia(s,e){if(!Lt(s))return"Home style";let t=To(s,e),o=i=>Object.hasOwn(s,mi[i]),n=[];return o("look")&&n.push(ct[t.look].title),o("turn")&&n.push(`turned ${t.turn}\xB0`),o("names")&&n.push(t.names?"room names":"no room names"),o("devices")&&n.push(t.devices==="all"?"every device":t.devices==="none"?"no devices":"lights only"),o("furniture")&&n.push(t.furniture?"furniture":"no furniture"),o("glow")&&n.push(t.glow?"glow":"no glow"),`Own look: ${n.join(", ")}`}var vr=(s,e)=>typeof s=="number"&&Number.isFinite(s)?s:e;function ra(s,e){let t=kn(s);return $n(s).flatMap(o=>{if(so(kt(o))!=="home_map")return[];let n=o,i=xn(kt(o)),r=e?.floors.find(c=>k(c.id,i)),a=typeof n.homeMapRoomId=="string"?n.homeMapRoomId:void 0,d=a===void 0?void 0:r?.rooms.find(c=>k(c.id,a)),l=`${vr(o.colSpan,1)}\xD7${vr(o.rowSpan,1)}`,p=(typeof o.customLabel=="string"&&o.customLabel.trim()!==""?o.customLabel.trim():void 0)??(d?.name?.trim()?`${d.name.trim()} only`:r===void 0||(e?.floors.length??0)<=1?"Home map":F(r));return[{pageId:t,pageName:$t(s),tileId:typeof o.id=="string"?o.id:"",what:p,size:l,own:Lt(n),words:ia(n,e),look:To(n,e).look}]})}function br(s,e){return Object.values(s?.pages??{}).map(o=>o?.item).filter(o=>Mt(o)).sort((o,n)=>$t(o).localeCompare($t(n))).flatMap(o=>ra(o,e))}function wr(s){let e=!1;if(!Array.isArray(s.pages))return;let t=s.pages.map(o=>{if(!Mt(o)||!Array.isArray(o.items))return o;let n=o.items.map(i=>!Mt(i)||so(kt(i))!=="home_map"||!Lt(i)?i:(e=!0,ci(i)));return{...o,items:n}});return e?{...s,pages:t}:void 0}var oo={width:112,height:68},aa={width:94,height:94,radius:34},sa={width:188,height:94,radius:22},da=.9,no=class{constructor(){this.usesState="idle";this.busy=!1}style(e){let t=pe(e.doc);return this.turnLive===void 0?t:{...t,turn:this.turnLive}}set(e,t){e.apply(o=>ui(o,t))}panel(e,t){let o=this.style(e),n=e.hass?.states,i=nt.includes(o.look),r=(a,d,l)=>m`<button type="button" class="hme-chip sel ${d?"on":""}" aria-pressed=${d?"true":"false"} @click=${l}>${a}</button>`;return m`<div class="hme-style-scrim" @pointerdown=${a=>{a.target===a.currentTarget&&t()}}></div>
      <div class="hme-style-pop" role="dialog" aria-label="Home style">
        <header class="hme-style-head">
          <strong>Home style</strong>
          <span>How every map tile looks, unless a tile picks its own</span>
          <button type="button" class="hme-x hme-style-close" aria-label="Close" title="Close (Esc)" @click=${t}>✕</button>
        </header>

        ${H("Look",m`<div class="hme-looks four">
          ${pn.map(a=>{let d=a===o.look,l=Le({floor:e.floor,states:n,...o,look:a,names:!1,width:oo.width,height:oo.height});return m`<button type="button" class="hme-look ${d?"on":""}" aria-pressed=${d?"true":"false"} title=${ct[a].hint}
              @click=${()=>this.set(e,{look:a})}>
              <svg viewBox=${`0 0 ${oo.width} ${oo.height}`} style=${`background:${he(a,.5)}`} aria-hidden="true">${l}</svg>
              <span>${ct[a].title}</span></button>`})}
        </div>
        <p class="hme-foot">Plan and Dots draw the floor from above. The other five draw it as a small model you can turn.</p>`)}

        <div class="hme-style-row">
          ${H("Show",m`
            <div class="hme-r"><span class="hme-l">Room names</span>${r(o.names?"Shown":"Hidden",o.names,()=>this.set(e,{names:!o.names}))}</div>
            <div class="hme-r"><span class="hme-l">Devices</span><div class="hme-chips">
              ${r("Lights",o.devices==="lights",()=>this.set(e,{devices:"lights"}))}
              ${r("All",o.devices==="all",()=>this.set(e,{devices:"all"}))}
              ${r("None",o.devices==="none",()=>this.set(e,{devices:"none"}))}</div></div>
            <div class="hme-r"><span class="hme-l">Furniture</span>${r(o.furniture?"Shown":"Hidden",o.furniture,()=>this.set(e,{furniture:!o.furniture}))}</div>
            <div class="hme-r"><span class="hme-l">Light glow</span>${r(o.glow?"On":"Off",o.glow,()=>this.set(e,{glow:!o.glow}))}</div>
            <div class="hme-r"><span class="hme-l">Turn</span>
              <input class="hme-range" type="range" min="-180" max="180" step="1" .value=${j(String(o.turn))} ?disabled=${!i} aria-label="Turn the model"
                style=${Te(o.turn,-180,180)}
                @input=${a=>{this.turnLive=Number(a.target.value),e.redraw()}}
                @change=${a=>{this.turnLive=void 0,this.set(e,{turn:Number(a.target.value)})}} />
              <span class="hme-val mono hme-w48">${i?`${o.turn}\xB0`:"flat"}</span></div>`,void 0,"hme-grow-card")}
          ${H("Preview",m`<div class="hme-style-tiles">
            ${this.face(e,o,aa,"Watch tile 2 \xD7 2")}
            ${this.face(e,o,sa,"iPhone tile 4 \xD7 2")}
          </div>`,ct[o.look].title,"hme-grow-card")}
        </div>

        ${this.usesCard(e)}
      </div>`}face(e,t,o,n){let i=da,r=e.hass?.states,a=Mi(o.width,o.height),d=Le({floor:e.floor,states:r,...t,width:a.width,height:a.height,tileHeight:o.height,icons:e.icons}),l=bt(e.floor,r),h=6*i;return m`<figure class="hme-fr">
      <div class="hme-face" style=${`width:${o.width*i}px;height:${o.height*i}px;border-radius:${o.radius*i}px;background:${he(t.look,i)}`}>
        <svg viewBox=${`0 0 ${a.width} ${a.height}`} aria-hidden="true"
          style=${`left:${a.x*i}px;top:${a.y*i}px;width:${a.width*i}px;height:${a.height*i}px`}>${d}</svg>
        ${o.height>90?m`<span class="hme-face-title" style=${`left:${h}px;top:${h}px;font-size:${11*i}px;color:${wi(t.look)}`}>${la(e.floor)}</span>`:v}
        <span class="hme-face-words" style=${`left:${h}px;bottom:${h}px;font-size:${10*i}px;color:${yi(t.look,l>0)}`}>${wt(l)}</span>
      </div>
      <figcaption>${n}</figcaption>
    </figure>`}leave(){this.turnLive=void 0,this.usesState="idle",this.message=void 0}look(e){return pe(e.doc).look}loadUses(e){let t=e.hass;this.usesState!=="idle"||t===void 0||(this.usesState="loading",yt(t).then(o=>{this.summary=o,this.usesState="done",e.redraw()},()=>{this.usesState="error",e.redraw()}))}usesCard(e){if(this.loadUses(e),this.usesState!=="done")return H("Used on",m`<p class="hme-text dim">${this.usesState==="error"?"Could not read your pages.":"Reading your pages\u2026"}</p>`);let t=br(this.summary,e.doc),o=t.filter(n=>n.own);return H(`Used on ${C(t.length,"tile")}`,m`
      ${t.length===0?m`<p class="hme-text dim">No page has a Home map tile yet. Add one from a page's Add tile.</p>`:v}
      ${t.map(n=>this.useRow(e,n))}
      ${o.length===0?v:m`<button type="button" class="hme-tb hme-wide" ?disabled=${this.busy}
        @click=${()=>{this.useHomeStyleOnAll(e,o)}}>${this.busy?"Saving\u2026":`Use the home style on all ${o.length}`}</button>`}
      ${this.message===void 0?v:m`<p class="hme-text dim" role="status">${this.message}</p>`}`)}useRow(e,t){return m`<div class="hme-use">
      <i style=${`background:${he(t.look,.2)}`}></i>
      <div><span>${t.pageName} · ${t.what} ${t.size}</span><small>${t.words}</small></div>
      ${e.openPage===void 0?v:m`<button type="button" class="hme-tb" @click=${()=>e.openPage?.(t.pageId)}>Edit</button>`}
    </div>`}async useHomeStyleOnAll(e,t){let o=e.hass;if(o===void 0||this.busy)return;let n=[...new Set(t.map(a=>a.pageId))];if(!await e.confirm({title:`Use the home style on ${C(t.length,"tile")}?`,text:`Their own looks come off, so each draws the home style. ${n.length===1?"The page is":`The ${n.length} pages are`} saved for every watch and iPhone that shows ${n.length===1?"it":"them"}.`,ok:"Use the home style"}))return;this.busy=!0,this.message=void 0,e.redraw();let r=0;for(let a of n)try{let d=await yn(o,"pages",a),l=wr(d.document);l!==void 0&&await Mn(o,"pages",a,d.revision,l)}catch{r+=1}this.busy=!1,this.message=r===0?"Done: those tiles follow the home style now.":`${C(r,"page")} could not be saved. Try again, or open ${r===1?"it":"them"} to see why.`,this.usesState="idle",e.redraw()}};function la(s){return s.name.trim()===""?"Home map":s.name.trim()}var pa="Update the Wrist Assistant integration to see the home map here.",ha="No home map yet. Scan your rooms with the Wrist Assistant app on an iPhone or iPad with LiDAR (the Pro models). The map shows here once it is saved.",ma=4,ua=140;function ca(s){return s.kind==="saving"?"Saving\u2026":s.kind==="error"?"Not saved":"Saved"}var fa={night:"Night",warm:"Warm",lines:"Lines",clay:"Clay",blueprint:"Blueprint"},S=class extends sn{constructor(){super(...arguments);this.narrow=!1;this.icons=void 0;this.iconsTick=0;this.capable=!1;this.bundleUrl=void 0;this.onHome=void 0;this.onOpenPage=void 0;this.unsupported=!1;this.loading=!1;this.styleOpen=!1;this.viewKind="both";this.artScale=0;this.stageSize={width:0,height:0};this.toggles={snap:!0,square:!0,grid:!1,measure:!1,live:!0,scan:!1};this.measure={};this.floorMenu=!1;this.model3d=!0;this.daylight=!1;this.spaceHeld=!1;this.tick=0;this.page=new Qt;this.stylePanel=new no;this.loadSeq=0;this.askedOnce=!1;this.needFit=!0;this.userMoved=!1;this.touches=new Map;this.artKey="";this.artHeld=v;this.loading3d=!1;this.failed3d=!1;this.onKey=t=>{if(this.dialog!==void 0||this.session===void 0||this.renderRoot?.querySelector?.(".hme-sheet")!=null)return;let o=(typeof t.composedPath=="function"?t.composedPath()[0]:void 0)??t.target;if(jo(o))return;let n=Z(t,!1);if(n==="undo"||n==="redo"){t.preventDefault?.(),n==="undo"?this.undo():this.redo();return}if(this.styleOpen){t.key==="Escape"&&this.closeStyle();return}if(ji(o))return;if(t.key===" "&&!t.repeat){this.spaceHeld=!0,t.preventDefault?.();return}let i=this.context();if(i!==void 0&&this.viewKind!=="model"&&this.page.keyDown?.(i,t)===!0){t.preventDefault?.();return}switch(n){case"cancel":this.floorMenu?this.floorMenu=!1:this.toggles.measure?this.setToggle("measure",!1):this.walls!==void 0?this.editWalls(void 0):this.selection=void 0;return;case"zoomIn":this.zoomBy(rt);return;case"zoomOut":this.zoomBy(1/rt);return;case"fit":this.fit();return}};this.onKeyUp=t=>{t.key===" "&&(this.spaceHeld=!1)}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKey),window.addEventListener("keyup",this.onKeyUp),this.askedOnce&&this.load(!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKey),window.removeEventListener("keyup",this.onKeyUp),this.endDrag?.(),this.observer?.disconnect(),this.observed=void 0,this.zoomTimer!==void 0&&clearTimeout(this.zoomTimer),this.loadSeq++,this.drop3d()}willUpdate(t){this.hass&&this.capable&&!this.askedOnce&&(this.askedOnce=!0,this.load(),this.loadPages());let o=this.baseFloor();this.needFit&&o!==void 0&&this.stageSize.width>0&&this.fit()}updated(){let t=this.renderRoot.querySelector?.(".hme-dialog");t instanceof Element&&t!==this.focusedDialog?(this.focusedDialog=t,(t.querySelector("input")??t.querySelector(".primary"))?.focus?.(),t.querySelector("input")?.select?.()):t===null&&(this.focusedDialog=void 0);let o=this.renderRoot.querySelector?.(".hme-stage");o instanceof Element&&o!==this.observed&&typeof ResizeObserver<"u"&&(this.observer??=new ResizeObserver(n=>{let i=n[n.length-1]?.contentRect;i!==void 0&&this.resizeStage(i.width,i.height)}),this.observed!==void 0&&this.observer.unobserve(this.observed),this.observer.observe(o),this.observed=o),this.view!==void 0&&this.view.scale!==this.artScale&&this.zoomTimer===void 0&&(this.zoomTimer=setTimeout(()=>{this.zoomTimer=void 0,this.view!==void 0&&(this.artScale=this.view.scale)},ua)),this.sync3d()}input3d(){let t=this.shownFloor();if(t===void 0)return;let o=this.selection,n=xe(o),i=ue(o),r=n.length>0?{things:n}:i===void 0?void 0:{roomId:i};return{floor:t,states:this.toggles.live?this.hass?.states:void 0,mark:r,daylight:this.daylight}}sync3d(){let t=this.renderRoot.querySelector?.(".hme-3d-host"),o=this.input3d();if(!(t instanceof HTMLElement)||o===void 0||this.bundleUrl===void 0){this.drop3d();return}if(this.scene3d!==void 0){this.scene3d.attach(t),this.scene3d.update(o,this.modelTurnNow());return}if(this.loading3d||this.failed3d)return;this.loading3d=!0;let n=Zo(this.bundleUrl);Gt().then(i=>{if(this.loading3d=!1,!!this.isConnected){try{this.scene3d??=new i.HomeMapScene3D(n),this.scene3d.onPick=(r,a)=>this.pick3d(r,a)}catch{this.failed3d=!0}this.tick++}},()=>{this.loading3d=!1,this.failed3d=!0,this.tick++})}pick3d(t,o={add:!1}){if(this.dialog===void 0){if(this.floorMenu=!1,this.walls!==void 0){(t===void 0||t.kind==="pin"||!k(t.roomId,this.walls))&&this.editWalls(void 0);return}if(o.add){t?.kind==="object"?this.select(He(this.selection,{roomId:t.roomId,object:t.object})):t?.kind==="pin"&&this.select(ke(this.selection,t.pinId));return}this.select(t===void 0?void 0:t.kind==="pin"?{kind:"pin",pinId:t.pinId}:t.kind==="object"?{kind:"object",roomId:t.roomId,object:t.object}:{kind:"room",roomId:t.roomId})}}drop3d(){this.scene3d?.dispose(),this.scene3d=void 0}turnBack(){this.modelTurn=void 0,this.scene3d?.frameFloor(pe(this.doc).turn??Io)}async load(t=!1){let o=this.hass;if(!o||!this.capable)return;let n=++this.loadSeq;t||(this.loading=this.session===void 0,this.loadError=void 0);try{let i=await ft(o);if(n!==this.loadSeq)return;this.unsupported=!1,this.loadError=void 0,this.show({doc:gt(i?.doc)??null,rev:typeof i?.rev=="number"?i.rev:0}),this.loadScans()}catch(i){if(n!==this.loadSeq)return;let{code:r,message:a}=Ee(i);r==="unknown_command"?this.unsupported=!0:(!t||this.session===void 0)&&(this.loadError=a)}this.loading=!1}async loadScans(){let t=this.hass;if(t)try{this.scans=await bn(t)}catch{}}async loadPages(){let t=this.hass;if(t)try{let o=Hn(await yt(t));this.pages=Pn(o,"pages").map(n=>({id:n.id,name:n.name}))}catch{this.pages=[]}}show(t){let o=this.hass;if(o&&ao(o,t),this.session===void 0)this.session=new to(mr(this.hassOrThrow()),t,()=>this.afterChange(),n=>{this.hass&&ao(this.hass,n)}),this.needFit=!0;else if(!this.session.load(t))return;this.afterChange()}hassOrThrow(){let t=this.hass;if(t===void 0)throw new Error("no hass");return t}afterChange(){let t=this.session?.doc?.floors??[];t.some(n=>k(n.id,this.floorId))||(this.floorId=t[0]?.id,this.needFit=!0);let o=this.walls;o!==void 0&&!(this.baseFloor()?.rooms??[]).some(n=>k(n.id,o))&&(this.walls=void 0),Oi(this.baseFloor(),this.selection)||(this.selection=void 0),this.tick++}get doc(){return this.session?.doc??null}baseFloor(){let t=this.doc?.floors??[];return t.find(o=>k(o.id,this.floorId))??t[0]}shownFloor(){let t=this.baseFloor();return t===void 0||this.previewDoc===void 0?t:this.previewDoc.floors.find(o=>k(o.id,t.id))??t}apply(t,o={}){let n=this.session;return n===void 0?!1:(this.previewDoc=void 0,n.apply(t)?(o.floorId!==void 0&&(this.floorId=o.floorId),o.select!==void 0&&(this.selection=o.select??void 0),this.afterChange(),!0):(this.tick++,!1))}preview(t){let o=this.doc;this.previewDoc=t===void 0||o===null?void 0:t(o)??this.previewDoc,this.tick++}undo(){this.previewDoc=void 0,this.session?.undo()===!0&&this.afterChange()}redo(){this.previewDoc=void 0,this.session?.redo()===!0&&this.afterChange()}select(t){this.selection=t}editWalls(t,o){let n=this.walls,i=t===void 0?void 0:this.baseFloor()?.rooms.find(d=>k(d.id,t));if(t!==void 0&&i===void 0)return;let r=this.context();r!==void 0&&!(t===void 0?n===void 0:k(t,n))&&this.page.leave?.(r),this.walls=i?.id,this.styleOpen=!1;let a=i?.id??n;this.selection=o??(a===void 0?this.selection:{kind:"room",roomId:a})}setFloor(t){let o=this.context();o!==void 0&&this.page.leave?.(o),this.floorId=t,this.walls=void 0,this.selection=void 0,this.floorMenu=!1,this.measure={},this.needFit=!0,this.userMoved=!1}setToggle(t,o){this.toggles={...this.toggles,[t]:o},t==="measure"&&(this.measure={}),t==="scan"&&o&&this.loadScans()}confirm(t){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(o=>{this.dialog={kind:"confirm",...t,done:n=>{this.dialog=void 0,o(n)}}})}ask(t){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(o=>{this.dialog={kind:"ask",...t,done:n=>{this.dialog=void 0,o(n)}}})}resizeStage(t,o){let n=this.stageSize.width===0;this.stageSize={width:t,height:o},(n||!this.userMoved)&&(this.needFit=!0)}fit(){let{width:t,height:o}=this.stageSize;t<=0||(this.view=zo(this.baseFloor(),t,o),this.artScale=this.view.scale,this.needFit=!1,this.userMoved=!1)}zoomBy(t,o){this.view!==void 0&&(this.view=No(this.view,t,o??[this.stageSize.width/2,this.stageSize.height/2]),this.userMoved=!0)}context(){let t=this.doc,o=this.shownFloor();if(t===null||o===void 0)return;let n=this.view??{scale:40,ox:0,oy:0},i=this.session;return{hass:this.hass,icons:this.icons,doc:t,floor:o,selection:this.selection,walls:this.walls,view:n,stage:this.stageSize,toggles:this.toggles,pages:this.pages??[],areas:vn(this.hass),scans:this.scans,furnitureBase:this.bundleUrl===void 0?void 0:Zo(this.bundleUrl),canUndo:i?.canUndo??!1,canRedo:i?.canRedo??!1,toScreen:r=>Li(n,r),px:r=>r*n.scale,toPlan:(r,a)=>this.toPlan(r,a),apply:(r,a)=>this.apply(r,a),preview:r=>this.preview(r),select:r=>this.select(r),editWalls:(r,a)=>this.editWalls(r,a),setFloor:r=>this.setFloor(r),setToggle:(r,a)=>this.setToggle(r,a),drag:(r,a)=>this.drag(r,a),undo:()=>this.undo(),redo:()=>this.redo(),confirm:r=>this.confirm(r),ask:r=>this.ask(r),newId:()=>lo(),note:(r,a)=>{this.session!==void 0&&(this.session.note={kind:r,text:a}),this.tick++},redraw:()=>{this.tick++},openPage:this.onOpenPage}}toPlan(t,o){let n=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return Fe(this.view??{scale:40,ox:0,oy:0},[t-n.left,o-n.top])}stagePoint(t){let o=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return[t.clientX-o.left,t.clientY-o.top]}drag(t,o){let n=this.stageEl;if(n===void 0)return;this.endDrag?.();let i=t.clientX,r=t.clientY,a=!1,d,l=0,h=typeof requestAnimationFrame=="function"?requestAnimationFrame:void 0,p=()=>{l=0,d!==void 0&&o.move(this.toPlan(d.clientX,d.clientY),d)};try{n.setPointerCapture?.(t.pointerId)}catch{}let c=b=>{let w=b;w.pointerId===t.pointerId&&(!a&&Math.hypot(w.clientX-i,w.clientY-r)<ma||(a=!0,d=w,h===void 0?p():l===0&&(l=h(p))))},f=b=>{let w=b;w.pointerId===t.pointerId&&(g(),l!==0&&(cancelAnimationFrame(l),p()),o.end(this.toPlan(w.clientX,w.clientY),w,a))},g=()=>{n.removeEventListener("pointermove",c),n.removeEventListener("pointerup",f),n.removeEventListener("pointercancel",f);try{n.releasePointerCapture?.(t.pointerId)}catch{}this.endDrag===u&&(this.endDrag=void 0)},u=()=>{g(),l!==0&&(cancelAnimationFrame(l),l=0),o.cancel?.()};n.addEventListener("pointermove",c),n.addEventListener("pointerup",f),n.addEventListener("pointercancel",f),this.endDrag=u}onStageDown(t){if(this.stageEl=t.currentTarget,this.floorMenu=!1,this.dialog!==void 0)return;if(t.pointerType==="touch"&&(this.touches.set(t.pointerId,[t.clientX,t.clientY]),this.touches.size===2)){this.endDrag?.(),this.preview(void 0),this.pinch();return}if(this.viewKind==="model"){this.turnModel(t);return}if(t.button===1||this.spaceHeld){t.preventDefault?.(),this.pan(t,!1);return}if(t.button!==0)return;let o=this.context();if(o===void 0)return;if(this.toggles.measure){let i=this.toPlan(t.clientX,t.clientY),r=this.measure;this.measure=r.a===void 0||r.b!==void 0?{a:i}:{a:r.a,b:i};return}let n=this.toPlan(t.clientX,t.clientY);if(this.page.pointerDown?.(o,t,n)===!0){t.preventDefault?.();return}this.pan(t,!0)}onStageDblClick(t){if(this.stageEl=t.currentTarget,this.dialog!==void 0||this.viewKind==="model"||this.toggles.measure||this.spaceHeld||t.button!==0)return;let o=this.context();o!==void 0&&this.page.doubleClick?.(o,t,this.toPlan(t.clientX,t.clientY))}onStageMove(t){if(this.stageEl=t.currentTarget,this.touches.has(t.pointerId)&&this.touches.set(t.pointerId,[t.clientX,t.clientY]),t.buttons!==0||this.viewKind==="model")return;let o=this.toPlan(t.clientX,t.clientY);this.toggles.measure&&this.measure.a!==void 0&&this.measure.b===void 0&&(this.measure={...this.measure,hover:o});let n=this.context();n!==void 0&&this.page.hover?.(n,o)}onStageLeave(){let t=this.context();t!==void 0&&this.page.hover?.(t,void 0)}onStageUp(t){this.touches.delete(t.pointerId)}onStageDrag(t){this.stageEl=t.currentTarget;let o=this.context();o===void 0||this.viewKind==="model"||this.dialog!==void 0||this.page.dragOver?.(o,this.toPlan(t.clientX,t.clientY),t)===!0&&(t.preventDefault?.(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"))}onStageDragLeave(t){let o=t.relatedTarget,n=t.currentTarget;if(o!==null&&n!==null&&typeof n.contains=="function"&&n.contains(o))return;let i=this.context();i!==void 0&&this.page.dragOver?.(i,void 0,t)}onStageDrop(t){this.stageEl=t.currentTarget;let o=this.context();o===void 0||this.viewKind==="model"||(t.preventDefault?.(),this.page.drop?.(o,this.toPlan(t.clientX,t.clientY),t))}pan(t,o){let n=this.view;if(n===void 0)return;let i=t.clientX,r=t.clientY;this.drag(t,{move:(a,d)=>{this.view={...n,ox:n.ox+d.clientX-i,oy:n.oy+d.clientY-r},this.userMoved=!0},end:(a,d,l)=>{!l&&o&&(this.selection=void 0)}})}pinch(){let t=this.stageEl,o=this.view,n=[...this.touches.keys()];if(t===void 0||o===void 0||n.length<2)return;let i=()=>n.map(f=>this.touches.get(f)),[r,a]=i(),d=Math.max(Math.hypot(a[0]-r[0],a[1]-r[1]),1),l=t.getBoundingClientRect(),h=[(r[0]+a[0])/2-l.left,(r[1]+a[1])/2-l.top],p=f=>{let g=f;if(!this.touches.has(g.pointerId))return;this.touches.set(g.pointerId,[g.clientX,g.clientY]);let[u,b]=i(),w=Math.max(Math.hypot(b[0]-u[0],b[1]-u[1]),1),y=[(u[0]+b[0])/2-l.left,(u[1]+b[1])/2-l.top],P=No(o,w/d,h);this.view={...P,ox:P.ox+y[0]-h[0],oy:P.oy+y[1]-h[1]},this.userMoved=!0},c=f=>{this.touches.delete(f.pointerId),t.removeEventListener("pointermove",p),t.removeEventListener("pointerup",c),t.removeEventListener("pointercancel",c)};t.addEventListener("pointermove",p),t.addEventListener("pointerup",c),t.addEventListener("pointercancel",c)}turnModel(t){let o=this.modelTurnNow(),n=t.clientX;this.drag(t,{move:(i,r)=>{let a=o+(r.clientX-n)*.5;a=((a+180)%360+360)%360-180,this.modelTurn=Math.round(a)},end:()=>{}})}modelTurnNow(){return this.modelTurn??pe(this.doc).turn??Io}modelLookNow(){if(this.modelLook!==void 0)return this.modelLook;let t=pe(this.doc).look;return nt.includes(t)?t:"night"}onWheel(t){if(this.viewKind==="model"||this.view===void 0)return;this.stageEl=t.currentTarget,t.preventDefault?.();let o=t.deltaMode===1?16:t.deltaMode===2?400:1;if(t.ctrlKey||t.metaKey){this.zoomBy(Math.exp(-t.deltaY*o*.0025),this.stagePoint(t));return}this.view={...this.view,ox:this.view.ox-t.deltaX*o,oy:this.view.oy-t.deltaY*o},this.userMoved=!0}toggleStyle(){if(this.styleOpen){this.closeStyle();return}this.floorMenu=!1,this.styleOpen=!0}closeStyle(){this.styleOpen=!1,this.stylePanel.leave()}render(){if(this.tick,!this.capable||this.unsupported)return this.calm(m`<b>${pa}</b>`);if(this.loadError!==void 0)return this.calm(m`<span>Could not read the home map: ${this.loadError}</span>
        <button class="hme-tb" @click=${()=>{this.load()}}>Try again</button>`);if(this.loading||this.session===void 0)return this.calm(m`Loading…`);let t=this.doc;if(t===null||t.floors.length===0)return this.calm(m`<b>${ha}</b>`);let o=this.context(),n=this.session.note;return m`<div class="hme">
      ${this.renderBar(t,o)}
      ${n===void 0?v:m`<div class="hme-note ${n.kind}" role="status"><span>${n.text}</span>
        <button class="hme-link" @click=${()=>this.session?.dismissNote()}>Dismiss</button></div>`}
      <div class="hme-body">
        <aside class="hme-rail" aria-label=${this.walls===void 0?"Layers":"Walls"}>${this.page.rail(o)}</aside>
        <section class="hme-stage-wrap">${this.renderStage(o)}</section>
        <aside class="hme-insp" aria-label="Inspector">${this.page.inspector(o)}</aside>
      </div>
      ${this.page.sheet?.(o)??v}
      ${this.renderDialog()}
    </div>`}calm(t){return m`<div class="hme-calm"><div class="hme-empty">${t}</div></div>`}renderBar(t,o){let n=this.baseFloor(),i=this.session?.state??{kind:"saved"},r=Ko(),a=this.walls===void 0?void 0:n.rooms.find(l=>k(l.id,this.walls)),d=pe(t).look;return m`<header class="hme-bar">
      ${this.onHome===void 0?v:m`<button type="button" class="hme-back" @click=${()=>this.onHome?.()}>‹ Home</button><span class="hme-vsep"></span>`}
      <strong class="hme-title">Home map</strong><span class="hme-beta">BETA</span>
      ${a===void 0?v:m`<span class="hme-crumb-sep" aria-hidden="true">›</span>
        <strong class="hme-title hme-crumb">${T(a)} walls</strong>`}
      <div class="hme-floor-wrap">
        <button type="button" class="hme-tb hme-floor-btn" aria-label="Switch floor" aria-haspopup="menu" aria-expanded=${this.floorMenu?"true":"false"}
          @click=${()=>{this.floorMenu=!this.floorMenu}}>
          ${Xo(n)}
          <span class="hme-floor-t"><span>${F(n)}</span><small>${C(n.rooms.length,"room")} · ${C(n.pins.length,"device")}</small></span>
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
      <span class="hme-status ${i.kind}" role="status" title=${i.kind==="error"?i.text:v}><span class="hme-status-dot"></span>${ca(i)}</span>
    </header>`}renderStyleButton(t){return m`<button type="button" class="hme-tb hme-style-btn ${this.styleOpen?"on":""}" aria-haspopup="dialog" aria-expanded=${this.styleOpen?"true":"false"}
      title="How every map tile looks, unless a tile picks its own" @click=${()=>this.toggleStyle()}>
      <span class="hme-style-sw" style=${`background:${he(t,.2)}`} aria-hidden="true"></span>Home style</button>`}renderFloorMenu(t,o){return m`<div class="hme-pop" role="menu" aria-label="Floors">
      ${t.floors.map(n=>m`<div class="hme-pop-row ${k(n.id,o.id)?"on":""}">
        <button type="button" role="menuitem" class="hme-pop-main" @click=${()=>this.setFloor(n.id)}>
          ${Xo(n)}<span class="hme-floor-t"><span>${F(n)}</span><small>${C(n.rooms.length,"room")} · ${C(n.pins.length,"device")}</small></span></button>
        <button type="button" class="hme-pop-act" title="Rename" aria-label=${`Rename ${F(n)}`} @click=${()=>{this.renameFloorAsk(n)}}>Rename</button>
        <button type="button" class="hme-pop-act danger" title=${t.floors.length===1?"The map keeps at least one floor":"Delete"} aria-label=${`Delete ${F(n)}`}
          ?disabled=${t.floors.length===1} @click=${()=>{this.deleteFloorAsk(n)}}>Delete</button>
      </div>`)}
      <button type="button" class="hme-pop-add" @click=${()=>{this.addFloorAsk()}}>＋ Add a floor</button>
    </div>`}async addFloorAsk(){this.floorMenu=!1;let t=this.doc;if(t===null)return;let o=Math.max(...t.floors.map(r=>r.story))+1,n=await this.ask({title:"Add a floor",label:"Name",value:o===1?"Upstairs":`Floor ${o+1}`,ok:"Add floor"});if(n===void 0)return;let i=lo();this.apply(r=>Fn(r,{id:i,name:n,story:o}),{floorId:i,select:null})&&(this.needFit=!0)}async renameFloorAsk(t){this.floorMenu=!1;let o=await this.ask({title:"Rename floor",label:"Name",value:t.name||F(t),ok:"Rename"});o!==void 0&&this.apply(n=>Et(n,t.id,o))}async deleteFloorAsk(t){this.floorMenu=!1,await this.confirm({title:`Delete ${F(t)}?`,text:`Its ${C(t.rooms.length,"room")} and ${C(t.pins.length,"device")} come off the map. Undo brings them back while this page is open.`,ok:"Delete floor",danger:!0})&&this.apply(n=>zn(n,t.id),{select:null})}renderStage(t){let o=this.page,{width:n,height:i}=this.stageSize,r=this.viewKind==="model",a=this.viewKind==="both",d=r?v:o.pill?.(t)??v,l=r?v:o.banner?.(t)??v,h=this.spaceHeld?"grab":r?"ew-resize":this.toggles.measure?"crosshair":o.cursor?.(t)??"default",p=t.floor.rooms.length===0,c=this.model3d&&this.bundleUrl!==void 0,f=a?c?m`<div class="hme-stage model hme-split-r hme-3d">
      ${this.render3d(t)}
      ${this.renderModelDock(!1)}
    </div>`:m`<div class="hme-stage model hme-split-r" style=${`background:${he(this.modelLookNow())}`}>
      <svg class="hme-svg" width="100%" height="100%" viewBox=${`0 0 ${Math.max(n,1)} ${Math.max(i,1)}`} style="cursor:ew-resize"
        role="img" aria-label=${`Model of ${F(t.floor)}`}
        @pointerdown=${u=>this.onModelDown(u)}>
        ${this.renderModel(t,n,i)}
      </svg>
      ${this.renderModelDock(!1)}
    </div>`:v;if(r&&c)return m`<div class="hme-stage model hme-3d">
        ${this.render3d(t)}
        ${this.renderDock(t)}
      </div>`;let g=this.walls!==void 0&&!r;return m`<div class="hme-stage ${r?"model":""} ${a?"hme-split-l":""} ${g?"walls":""}" style=${r?`background:${he(this.modelLookNow())}`:""}>
      <svg class="hme-svg" width="100%" height="100%" viewBox=${`0 0 ${Math.max(n,1)} ${Math.max(i,1)}`} style=${`cursor:${h}`}
        role="img" aria-label=${`Plan of ${F(t.floor)}`}
        @pointerdown=${u=>this.onStageDown(u)}
        @contextmenu=${u=>{u.ctrlKey&&u.preventDefault()}}
        @dblclick=${u=>this.onStageDblClick(u)}
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
      ${l===v?v:m`<div class="hme-banner">${l}</div>`}
      ${d===v?v:m`<div class="hme-pill ${l===v?"":"under"}">${d}</div>`}
      ${r?v:o.stageExtra?.(t)??v}
      ${p&&!r&&!o.arrange.draw.active?m`<div class="hme-stage-empty"><b>No rooms on this floor yet.</b>
        <span>Draw one by hand, or scan this floor with the iPhone.</span>
        <button type="button" class="hme-tb" @click=${()=>{let u=this.context();u&&o.startDrawing(u)}}>＋ Draw a room by hand</button></div>`:v}
      ${this.renderDock(t)}
    </div>${f}`}onModelDown(t){this.dialog!==void 0||t.button!==0||(this.stageEl=t.currentTarget,this.floorMenu=!1,this.turnModel(t))}renderPlan(t,o,n){let i=this.view;if(i===void 0||o<=0)return v;let r=this.planArt(t.floor,o,n,this.page.drawsPins?.(t)===!0?"none":"all"),a=i.scale/(this.artScale||i.scale);return M`${this.background(i,o,n)}
      <g class="hme-art" transform=${`translate(${i.ox.toFixed(2)} ${i.oy.toFixed(2)}) scale(${a.toFixed(5)})`} pointer-events="none">${r}</g>
      <g class="hme-labels" pointer-events="none">${this.labels(t)}</g>
      <g class="hme-overlay">${this.page.overlay(t)}</g>
      ${this.toggles.measure?this.measureMarks(t):v}`}planArt(t,o,n,i){let r=this.toggles.live?this.hass?.states:void 0,a=this.artScale||this.view.scale,d=`${va(t)}|${rn(r)}|${a}|${o}|${n}|${this.iconsTick}|${rn(this.icons)}|${i}`;return d!==this.artKey&&(this.artKey=d,this.artHeld=Le({floor:t,states:r,look:"plan",names:!1,devices:i,furniture:!0,glow:!0,width:o,height:n,icons:this.icons,frame:{scale:a,ox:0,oy:0}})),this.artHeld}background(t,o,n){let i=this.walls!==void 0?ge:fe,r=20;if(this.toggles.grid)for(r=i*t.scale;r<8;)r*=10;let a=(t.ox%r+r)%r,d=(t.oy%r+r)%r;return M`<defs><pattern id="hme-bg" width=${r} height=${r} patternUnits="userSpaceOnUse" patternTransform=${`translate(${a.toFixed(1)} ${d.toFixed(1)})`}>
        ${this.toggles.grid?M`<path d=${`M${r} 0V${r}H0`} fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1" />`:M`<circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.09)" />`}
      </pattern></defs>
      <rect class="hme-bg" width=${o} height=${n} fill="url(#hme-bg)" />`}labels(t){return t.floor.rooms.map(o=>{let n=Y(o),i=be(o.outline);if(n===void 0||i===void 0)return v;let r=T(o),a=ze(o),d=(i.maxX-i.minX)*t.view.scale,l=(i.maxY-i.minY)*t.view.scale,h=r.length*7.4+22;if(h>d*.95||l<26)return v;let p=Math.max(h,a.length*5.8+22)<=d*.95&&l>=48,c=p?Math.max(h,a.length*5.8+22):h,f=p?36:22,[g,u]=t.toScreen(n);return M`<g class="hme-label"><rect x=${(g-c/2).toFixed(1)} y=${(u-f/2).toFixed(1)} width=${c.toFixed(1)} height=${f} rx=${p?9:7} fill="rgba(0,0,0,0.6)" />
        <text x=${g.toFixed(1)} y=${(u+(p?-3:4.5)).toFixed(1)} fill="#fff" font-size=${p?13:12} font-weight="600" text-anchor="middle">${r}</text>
        ${p?M`<text x=${g.toFixed(1)} y=${(u+11).toFixed(1)} fill="#aeaeb2" font-size="10" text-anchor="middle">${a}</text>`:v}</g>`})}measureMarks(t){let o=this.measure;if(o.a===void 0)return M`<g class="hme-measure"></g>`;let n=o.b??o.hover,i=t.toScreen(o.a);if(n===void 0)return M`<g class="hme-measure" pointer-events="none"><circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" /></g>`;let r=t.toScreen(n),a=Math.hypot(n[0]-o.a[0],n[1]-o.a[1]),d=[(i[0]+r[0])/2,(i[1]+r[1])/2];return M`<g class="hme-measure" pointer-events="none">
      <line x1=${i[0]} y1=${i[1]} x2=${r[0]} y2=${r[1]} stroke="#ff9f0a" stroke-width="2" stroke-dasharray=${o.b===void 0?"6 4":"none"} />
      <circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" /><circle cx=${r[0]} cy=${r[1]} r="5" fill="#ff9f0a" />
      <g class="hme-tag"><rect x=${(d[0]-32).toFixed(1)} y=${(d[1]-22).toFixed(1)} width="64" height="20" rx="10" fill="#ff9f0a" />
      <text x=${d[0].toFixed(1)} y=${(d[1]-8).toFixed(1)} fill="#2a1a00" text-anchor="middle">${a.toFixed(2)} m</text></g></g>`}renderModel(t,o,n){if(o<=0)return v;let i=this.selection,r=ue(i),a=r===void 0?void 0:t.floor.rooms.find(h=>k(h.id,r)),d=xe(i).flatMap(h=>t.floor.rooms.find(p=>k(p.id,h.roomId))?.objects[h.object]??[]),l=d.length>0?{boxes:d}:a!==void 0?{outline:a.outline}:void 0;return Le({mark:l,floor:t.floor,states:this.toggles.live?this.hass?.states:void 0,look:this.modelLookNow(),turn:this.modelTurnNow(),names:!0,devices:"lights",furniture:!0,glow:!0,width:o,height:n})}render3d(t){let o=this.failed3d?"The 3D view needs WebGL, which this browser has turned off.":this.scene3d===void 0?"Loading the 3D view\u2026":void 0;return m`<div class="hme-3d-host" role="img" aria-label=${`3D model of ${F(t.floor)}. Drag to turn it, scroll to zoom, click a thing to pick it.`}></div>
      ${o===void 0?v:m`<div class="hme-3d-note">${o}</div>`}`}renderModelDock(t,o){let n=this.model3d&&this.bundleUrl!==void 0,i=n?void 0:this.modelLookNow(),r=a=>a?"true":"false";return m`<div class="hme-dock">
      ${nt.map(a=>m`<button type="button" class="hme-tb ${a===i?"on":""}" aria-pressed=${r(a===i)} @click=${()=>{this.modelLook=a,this.model3d=!1}}>${fa[a]}</button>`)}
      ${this.bundleUrl===void 0?v:m`<button type="button" class="hme-tb ${n?"on":""}" aria-pressed=${r(n)}
        title="The floor in real 3D, with its furniture and each light lit as it is now" @click=${()=>{this.model3d=!0}}>3D</button>`}
      ${n?m`<span class="hme-vsep"></span>
        <button type="button" class="hme-tb ${this.daylight?"":"on"}" aria-pressed=${r(!this.daylight)} title="Night: only the lights that are on light the rooms"
          @click=${()=>{this.daylight=!1}}>Lights</button>
        <button type="button" class="hme-tb ${this.daylight?"on":""}" aria-pressed=${r(this.daylight)} title="Day: the sun comes in through the windows"
          @click=${()=>{this.daylight=!0}}>Daylight</button>`:v}
      <span class="hme-vsep"></span>
      <button type="button" class="hme-tb" title=${n?"Show the whole floor from the home style's turn":"Back to the home style's turn"} @click=${()=>this.turnBack()}>⟲ Turn back</button>
      ${t&&o!==void 0?m`<span class="hme-vsep"></span>${o}`:v}
    </div>`}renderDock(t){let o=m`<button type="button" class="hme-tb ${this.toggles.live?"on":""}" aria-pressed=${this.toggles.live?"true":"false"}
      title="Draw what Home Assistant's devices are doing now" @click=${()=>this.setToggle("live",!this.toggles.live)}><span class="hme-live-dot"></span>Live states</button>`;if(this.viewKind==="model")return this.renderModelDock(!0,o);let n=this.stageSize.width>0?zo(this.baseFloor(),this.stageSize.width,this.stageSize.height):void 0,i=this.view===void 0||n===void 0?100:Fi(this.view,n);return m`<div class="hme-dock">
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom out" @click=${()=>this.zoomBy(1/rt)}>−</button>
      <span class="hme-zoom mono">${i}%</span>
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom in" @click=${()=>this.zoomBy(rt)}>＋</button>
      <button type="button" class="hme-tb" @click=${()=>this.fit()}>Fit</button>
      <span class="hme-vsep"></span>
      ${this.page.dock?.(t)??v}
      <span class="hme-vsep"></span>${o}
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
    </div>`}static{this.styles=[wn,ln,gr]}};R([oe({attribute:!1})],S.prototype,"hass",2),R([oe({type:Boolean,reflect:!0})],S.prototype,"narrow",2),R([oe({attribute:!1})],S.prototype,"icons",2),R([oe({attribute:!1})],S.prototype,"iconsTick",2),R([oe({attribute:!1})],S.prototype,"capable",2),R([oe({attribute:!1})],S.prototype,"bundleUrl",2),R([oe({attribute:!1})],S.prototype,"onHome",2),R([oe({attribute:!1})],S.prototype,"onOpenPage",2),R([A()],S.prototype,"unsupported",2),R([A()],S.prototype,"loading",2),R([A()],S.prototype,"loadError",2),R([A()],S.prototype,"floorId",2),R([A()],S.prototype,"selection",2),R([A()],S.prototype,"walls",2),R([A()],S.prototype,"styleOpen",2),R([A()],S.prototype,"viewKind",2),R([A()],S.prototype,"view",2),R([A()],S.prototype,"artScale",2),R([A()],S.prototype,"stageSize",2),R([A()],S.prototype,"toggles",2),R([A()],S.prototype,"scans",2),R([A()],S.prototype,"measure",2),R([A()],S.prototype,"floorMenu",2),R([A()],S.prototype,"dialog",2),R([A()],S.prototype,"modelLook",2),R([A()],S.prototype,"model3d",2),R([A()],S.prototype,"daylight",2),R([A()],S.prototype,"modelTurn",2),R([A()],S.prototype,"pages",2),R([A()],S.prototype,"spaceHeld",2),R([A()],S.prototype,"tick",2);var yr=new WeakMap,ga=1;function rn(s){if(s===void 0)return 0;let e=yr.get(s);return e===void 0&&yr.set(s,e=ga++),e}var va=s=>rn(s);customElements.get("wa-home-map-editor")||customElements.define("wa-home-map-editor",S);export{ma as HOME_MAP_DRAG_SLOP,ha as HOME_MAP_EMPTY_TEXT,pa as HOME_MAP_UPDATE_TEXT,S as WaHomeMapEditor,ca as homeMapSaveWords};
