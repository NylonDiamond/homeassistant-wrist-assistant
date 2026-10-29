import{a as Gt}from"./chunk-PHLRY3PT.js";import{a as Ko,b as Bo,c as Bt,d as st,e as Wt,f as Li}from"./chunk-5GVS5TI5.js";import"./chunk-Q7EURQ6S.js";import{a as Ut,b as re,c as Be,d as dt,e as We,f as _i,g as lt,h as Wo,i as ue,j as Fi,k as zi,l as ji,m as Ge}from"./chunk-NJZ2Z4AD.js";import"./chunk-7T6IEW6M.js";import{$ as It,$a as he,A as $o,Aa as at,Ba as Te,Ca as Io,D as Ct,Da as ci,E as Bn,Ea as ui,F as Wn,Fa as je,G as Pe,Ga as Ne,H as ko,Ha as fi,I as St,Ia as gi,J as Gn,Ja as Ro,K as Un,Ka as pe,La as At,M as xo,Ma as Lt,N as Qe,Na as bi,O as G,Oa as Do,P as _e,Pa as vi,Q as Ee,Qa as _t,R as Vn,Ra as Oo,S as Xn,Sa as rt,T as qn,Ta as Ft,U as Yn,Ua as wi,V as et,Va as yi,W as tt,Wa as Ao,X as Zn,Xa as Lo,Y as ot,Ya as Mi,Z as Jn,Za as $i,_ as Qn,_a as _o,a as le,aa as ei,ab as Ke,ba as Ho,bb as ki,ca as ti,cb as xi,d as yo,da as oi,db as Fo,ea as ni,eb as Ce,fa as ii,fb as zt,ga as Po,gb as jt,ha as Eo,hb as Hi,ia as nt,ja as ai,jb as me,ka as ri,kb as Nt,la as si,lb as Pi,m as Mo,ma as Fe,mb as Ei,n as $e,na as To,nb as zo,o as ke,oa as Rt,ob as Ti,p as V,pa as di,pb as jo,q as W,qa as li,qb as Ci,r as xe,ra as Co,rb as Si,s as He,sa as it,sb as Ii,t as Nn,ta as So,tb as Ri,ua as Dt,ub as Di,v as Le,va as pi,vb as ce,w as Kn,wa as hi,wb as No,xa as ze,xb as Kt,ya as Ot,yb as Oi,za as mi,zb as Ai}from"./chunk-XWOS3BVO.js";import{c as Ht,j as On,k as An,na as zn,oa as jn}from"./chunk-5H6OWAXC.js";import"./chunk-J2WKPEGJ.js";import{b as wo}from"./chunk-S3NOJWAC.js";import{j as Rn,p as bo,q as N}from"./chunk-YBPREKYL.js";import{i as Pt,l as Ln,m as _n,n as Et,r as Tt,s as vo,t as Fn}from"./chunk-CPEKF3CW.js";import{B as z,C as T,D as $t,E as J,F as Q,H as Tn,J as ee,K as Cn,L as kt,M as xt,S as Sn,T as In,U as B,b as xn,d as Hn,e as Pn,h as Ze,i as En,u as Je,v as Mt,x as go,y as M}from"./chunk-PRH7USGO.js";import{$g as yt,Fh as Ae,Nh as Dn,ah as $n,b as yn,d as m,e as $,g as b,hg as fo,j as Mn,k as ae,l as L,wh as kn}from"./chunk-7M7K7CM3.js";import{db as Oe}from"./chunk-OM34V22N.js";import{a as R}from"./chunk-LO2NM3CE.js";var Vt="application/x-wa-home-map-entity",Go="application/x-wa-home-map-light",Ka=new Set(["light","switch","fan","climate","humidifier","water_heater","sensor","binary_sensor","media_player","lock","cover","valve","camera","vacuum","alarm_control_panel","siren","input_boolean","remote"]);function Uo(s,e){let t=s?.entities?.[e];if(t===void 0)return;if(typeof t.area_id=="string"&&t.area_id!=="")return t.area_id;let o=t.device_id?s?.devices?.[t.device_id]:void 0;return typeof o?.area_id=="string"&&o.area_id!==""?o.area_id:void 0}function Xt(s){let e=[];for(let[t,o]of Object.entries(s?.states??{})){let n=s?.entities?.[t];if(n?.hidden===!0)continue;let i=o?.attributes?.friendly_name,a=Uo(s,t),r=a===void 0?void 0:s?.areas?.[a]?.name?.trim()||a,d=o?.attributes?.device_class;e.push({entityId:t,name:typeof i=="string"&&i.trim()!==""?i.trim():t,domain:t.slice(0,t.indexOf(".")),areaId:a,areaName:r,deviceClass:typeof d=="string"?d:void 0,category:typeof n?.entity_category=="string"?n.entity_category:void 0})}return e.sort((t,o)=>t.name.localeCompare(o.name)||t.entityId.localeCompare(o.entityId))}function Ba(s){return new Set(s.floors.flatMap(e=>e.pins.map(t=>t.entityId)))}function Ni(s,e,t){let o=Ba(s),n=new Map;for(let a of t){if(o.has(a.entityId)||a.areaId===void 0||a.category!==void 0||!Ka.has(a.domain))continue;let r=n.get(a.areaId);r===void 0&&n.set(a.areaId,r={areaId:a.areaId,name:a.areaName??a.areaId,here:!1,devices:[]}),r.devices.push(a)}let i=e.rooms.map(a=>a.areaId).filter(a=>a!==void 0);for(let a of n.values())a.here=i.includes(a.areaId);return[...n.values()].sort((a,r)=>{let d=i.indexOf(a.areaId),l=i.indexOf(r.areaId);return d>=0||l>=0?(d<0?1/0:d)-(l<0?1/0:l):a.name.localeCompare(r.name)})}function Ki(s,e){let t=new Set(s.rooms.map(o=>o.areaId).filter(o=>o!==void 0));return e.filter(o=>t.has(o.areaId)).reduce((o,n)=>o+n.devices.length,0)}function qt(s,e,t=40){let o=e.toLowerCase().split(/\s+/).filter(r=>r!=="");if(o.length===0)return[];let n=r=>`${r.name} ${r.entityId} ${r.areaName??""}`.toLowerCase(),i=s.filter(r=>o.every(d=>n(r).includes(d))),a=e.trim().toLowerCase();return i.sort((r,d)=>+!r.name.toLowerCase().startsWith(a)-+!d.name.toLowerCase().startsWith(a)).slice(0,t)}var Wa=[["lights","Lights"],["climate","Climate"],["sensors","Sensors"],["power","Power"],["media","Media"],["security","Security"],["covers","Covers"],["other","Other"]];function Vo(s){switch(s.slice(0,s.indexOf("."))){case"light":return"lights";case"climate":case"fan":case"humidifier":case"water_heater":return"climate";case"sensor":case"binary_sensor":return"sensors";case"switch":case"input_boolean":return"power";case"media_player":case"remote":return"media";case"lock":case"camera":case"alarm_control_panel":case"siren":return"security";case"cover":case"valve":return"covers";default:return"other"}}function Bi(s){let e=new Map;for(let t of s.pins){let o=Vo(t.entityId);e.set(o,(e.get(o)??0)+1)}return Wa.filter(([t])=>e.has(t)).map(([t,o])=>({kind:t,label:o,count:e.get(t)}))}function Wi(s){return s.replace(/_/g," ")}function te(s,e){let t=e?.[s];if(t===void 0)return"gone";let o=String(t.state??""),n=s.slice(0,s.indexOf(".")),i=t.attributes??{};if(n==="light"&&o==="on"&&typeof i.brightness=="number")return`on \xB7 ${Math.round(i.brightness/255*100)}%`;if(n==="climate"&&typeof i.current_temperature=="number")return`${o} \xB7 ${i.current_temperature}\xB0`;let a=typeof i.unit_of_measurement=="string"?i.unit_of_measurement:"";return a!==""&&o!==""&&Number.isFinite(Number(o))?`${o} ${a}`.replace(" \xB0","\xB0").replace(" %","%"):o.replace(/_/g," ")}function Yt(s){return["light","switch","fan","input_boolean","media_player","cover","humidifier","siren"].includes(s.slice(0,s.indexOf(".")))}function Zt(s,e){let t=String(e?.[s]?.state??"");return s.startsWith("cover.")?t==="open"||t==="opening"?"Close":"Open":t==="on"||t==="playing"||t==="paused"||t==="idle"?"Turn off":"Turn on"}var Xo=[["Floor",.3],["Table",.8],["Wall",1.6],["Ceiling",2.5]],qo=[[void 0,"As the tile does"],["toggle","Turn on or off"],["details","Show details"],["page","Open a page"],["none","Nothing"]];function Yo(s,e){for(let t of s.floors){let o=t.pins.find(n=>n.entityId===e);if(o!==void 0)return{floorId:t.id,pinId:o.id}}}function Zo(s,e){return e===void 0?void 0:s.rooms.find(t=>t.areaId!==void 0&&t.areaId===e)}function se(s){return s?.kind==="pin"?[s.pinId]:s?.kind==="pins"?s.pinIds.slice():[]}function pt(s){let e=[];for(let t of s)e.some(o=>M(o,t))||e.push(t);if(e.length!==0)return e.length===1?{kind:"pin",pinId:e[0]}:{kind:"pins",pinIds:e}}function Se(s,e){let t=se(s);return t.some(o=>M(o,e))?pt(t.filter(o=>!M(o,e))):pt([...t,e])}function Gi(s,e){return pt([...se(s),...e])}function Ui(s,e,t){let[o,n]=[Math.min(e[0],t[0]),Math.max(e[0],t[0])],[i,a]=[Math.min(e[1],t[1]),Math.max(e[1],t[1])];return s.filter(r=>r.at[0]>=o&&r.at[0]<=n&&r.at[1]>=i&&r.at[1]<=a).map(r=>r.id)}function oe(s){if(s.length===0)return{mixed:!0};let e=JSON.stringify(s[0])??"undefined";return s.every(t=>(JSON.stringify(t)??"undefined")===e)?{mixed:!1,value:s[0]}:{mixed:!0}}function Vi(s,e){if(s.length===0||!s.every(Yt))return;let t=s.every(n=>n.startsWith("cover.")),o=s.some(n=>{let i=Zt(n,e);return i==="Turn off"||i==="Close"});return t?o?{words:"Close",service:"turn_off"}:{words:"Open",service:"turn_on"}:o?{words:"Turn off",service:"turn_off"}:{words:"Turn on",service:"turn_on"}}function fe(s){return s===void 0||s.kind==="pin"||s.kind==="pins"||s.kind==="objects"?void 0:s.roomId}function Ie(s){return s?.kind==="object"?[{roomId:s.roomId,object:s.object}]:s?.kind==="objects"?s.items.map(e=>({roomId:e.roomId,object:e.object})):[]}var Jt=(s,e)=>M(s.roomId,e.roomId)&&s.object===e.object;function Xi(s){let e=[];for(let t of s)e.some(o=>Jt(o,t))||e.push({roomId:t.roomId,object:t.object});if(e.length!==0)return e.length===1?{kind:"object",roomId:e[0].roomId,object:e[0].object}:{kind:"objects",items:e}}function ge(s,e){let t=Ie(s);return t.some(o=>Jt(o,e))?Xi(t.filter(o=>!Jt(o,e))):Xi([...t,e])}function Jo(s,e){if(e?.kind!=="pin"||s===void 0)return e;let t=me(s,e.pinId);return t===void 0?e:{kind:"object",roomId:t.roomId,object:t.object}}function qi(s,e,t){return Ie(s).some(o=>Jt(o,{roomId:e,object:t}))}function Yi(s,e){if(e===void 0)return!0;if(s===void 0)return!1;if(e.kind==="pin")return s.pins.some(o=>M(o.id,e.pinId));if(e.kind==="pins")return e.pinIds.every(o=>s.pins.some(n=>M(n.id,o)));if(e.kind==="objects")return e.items.every(o=>s.rooms.find(n=>M(n.id,o.roomId))?.objects[o.object]!==void 0);let t=s.rooms.find(o=>M(o.id,e.roomId));if(t===void 0)return!1;switch(e.kind){case"room":return!0;case"wall":return G(t)[e.wall]!==void 0;case"corner":return t.outline[e.corner]!==void 0;case"opening":return t.openings[e.opening]!==void 0;case"object":return t.objects[e.object]!==void 0}}var Zi=4,Ji=2400;function Qi(s,e){return[s.ox+e[0]*s.scale,s.oy+e[1]*s.scale]}function Re(s,e){return[(e[0]-s.ox)/s.scale,(e[1]-s.oy)/s.scale]}function Qo(s,e,t,o=72,n=96){let a=s===void 0||s.rooms.length===0&&s.pins.length===0?{minX:-5,minY:-5,maxX:5,maxY:5}:$t(s),r=Math.max(a.maxX-a.minX,1),d=Math.max(a.maxY-a.minY,1),l=aa(Math.min(Math.max(e-o*2,40)/r,Math.max(t-n*2,40)/d),Zi,Ji);return{scale:l,ox:e/2-(a.minX+a.maxX)/2*l,oy:t/2-(a.minY+a.maxY)/2*l}}function en(s,e,t){let o=aa(s.scale*e,Zi,Ji),n=o/s.scale;return{scale:o,ox:t[0]-(t[0]-s.ox)*n,oy:t[1]-(t[1]-s.oy)*n}}function ea(s,e){return Math.round(s.scale/e.scale*100)}var ht=1.25;function ta(s){if(typeof s!="object"||s===null)return;let e=s;return{tag:typeof e.tagName=="string"?e.tagName.toUpperCase():"",type:typeof e.type=="string"?e.type.toLowerCase():"text",editable:e.isContentEditable===!0}}var oa=["button","submit","reset","image"],Ga=["checkbox","radio","range","color","file"];function tn(s){let e=ta(s);return e===void 0?!1:e.editable||e.tag==="TEXTAREA"?!0:e.tag==="INPUT"&&!oa.includes(e.type)&&!Ga.includes(e.type)}function na(s){let e=ta(s);return e===void 0?!1:tn(s)||e.tag==="SELECT"?!0:e.tag==="INPUT"&&!oa.includes(e.type)}function Z(s,e){if(e)return;let t=s.metaKey===!0||s.ctrlKey===!0,o=s.key.length===1?s.key.toLowerCase():s.key;if(t)return o==="z"?s.shiftKey===!0?"redo":"undo":o==="y"?"redo":void 0;if(s.altKey===!0)return;switch(o){case"Escape":return"cancel";case"Delete":case"Backspace":return"delete";case"Enter":return"enter";case"+":case"=":return"zoomIn";case"-":return"zoomOut";case"0":return"fit"}let n=s.shiftKey===!0?.1:.01;if(o==="ArrowLeft")return{nudge:[-n,0]};if(o==="ArrowRight")return{nudge:[n,0]};if(o==="ArrowUp")return{nudge:[0,-n]};if(o==="ArrowDown")return{nudge:[0,n]};if(/^[a-z]$/.test(o)&&s.shiftKey!==!0)return{letter:o}}function on(){let s=globalThis.navigator,e=`${typeof s?.platform=="string"?s.platform:""} ${typeof s?.userAgent=="string"?s.userAgent:""}`;return/Mac|iPhone|iPad/.test(e)}function ia(){return on()?"\u2318Z":"Ctrl+Z"}var aa=(s,e,t)=>Math.min(Math.max(s,e),t);function mt(s,e=2){return`${(Math.round(s*10**e)/10**e).toFixed(e)} m`}function ct(s,e=2){let t=(Math.round(s*10**e)/10**e).toFixed(e);return/^-0(\.0*)?$/.test(t)?t.slice(1):t}function nn(s){let e=s.trim().replace(",",".").replace(/\s*(m|cm|°|deg)$/i,"");if(e===""||!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(e))return;let t=Number(e);if(Number.isFinite(t))return/cm$/i.test(s.trim())?t/100:t}function Qt(s){if(s.outline.length<3)return{width:0,depth:0,area:0};let{a0:e,a1:t,c0:o,c1:n}=$o(s,Mo(s));return{width:t-e,depth:n-o,area:Math.abs(Ct(s.outline))}}function Ue(s){let{width:e,depth:t}=Qt(s);return`${e.toFixed(1)} \xD7 ${t.toFixed(1)} m`}function ra(s){if(s.outline.length<3)return s.outline.slice();let{a0:e,a1:t,c0:o,c1:n,point:i}=$o(s,Mo(s));return[i(e,o),i(t,o),i(t,n),i(e,n)]}function sa(s,e){let t=G(s)[e];if(t===void 0)return"inner";let o=Math.max(Math.hypot(t.b[0]-t.a[0],t.b[1]-t.a[1]),1e-9),n=-(t.b[1]-t.a[1])/o,i=(t.b[0]-t.a[0])/o,a=[(t.a[0]+t.b[0])/2,(t.a[1]+t.b[1])/2],r=Math.max(t.t,.1)+.1,d=ke(s.outline,[a[0]+n*r,a[1]+i*r]),l=ke(s.outline,[a[0]-n*r,a[1]-i*r]);if(d&&l)return"inner";if(d)n=-n,i=-i;else if(!l){let p=V(s);p!==void 0&&(p[0]-a[0])*n+(p[1]-a[1])*i>0&&(n=-n,i=-i)}return Math.abs(n)>Math.abs(i)?n>0?"right":"left":i>0?"bottom":"top"}function an(s,e,t){let o=sa(s,e);return`${t}, ${o} wall`}function da(s){let e=G(s).map((o,n)=>sa(s,n)),t=new Map;return e.map((o,n)=>{let i=(t.get(o)??0)+1;t.set(o,i);let a=`${o.charAt(0).toUpperCase()}${o.slice(1)} wall`;return i===1&&e.indexOf(o,n+1)<0?a:`${a} ${i}`})}function be(s){return s.kind==="opening"?"Way through":s.kind==="window"?s.style==="sliding"?"Sliding window":"Window":s.style==="double"?"Double door":s.style==="sliding"?"Sliding door":"Door"}var Ua={sofa:"Sofa",table:"Table",chair:"Chair",bed:"Bed",storage:"Storage",television:"TV",bathtub:"Bath",sink:"Basin",toilet:"Toilet",stove:"Hob",oven:"Oven",refrigerator:"Fridge",dishwasher:"Dishwasher",washerDryer:"Washer dryer",fireplace:"Fireplace",stairs:"Stairs"};function ut(s){let e=Ua[s];if(e!==void 0)return e;let t=s.replace(/([a-z0-9])([A-Z])/g,"$1 $2").toLowerCase();return t.charAt(0).toUpperCase()+t.slice(1)}function I(s,e,t=`${e}s`){return`${s} ${s===1?e:t}`}function P(s,e,t,o=""){return m`<section class="hme-card ${o}">
    <div class="hme-h">${s}${t===void 0?b:m`<span class="hme-h-end">${t}</span>`}</div>
    ${e}
  </section>`}function D(s,...e){return m`<div class="hme-r"><span class="hme-l">${s}</span>${e}</div>`}function K(s){return m`<p class="hme-hint">${s}</p>`}var la=3;function Va(s,e){return s==="\xB0"?1:10**-e}function O(s){let e=s.digits??2,t=s.step??Va(s.unit,e),o=s.value===void 0?"":ct(s.value,e),n=d=>Math.min(Math.max(d,s.min??-1/0),s.max??1/0),i=d=>ct(d,e)===o,a=d=>{let l=nn(d.value);if(l===void 0||s.min!==void 0&&l<s.min||s.max!==void 0&&l>s.max||i(l)){d.value=o;return}s.set(l)},r=d=>{let l=d.currentTarget,p=l.querySelector("input");if(p===null||s.disabled===!0||d.button!==0||p.matches(":focus"))return;d.preventDefault();let h=s.value,u=d.clientX,f=!1,g=h;try{l.setPointerCapture(d.pointerId)}catch{}let c=v=>{if(h===void 0)return;let y=v.clientX-u;if(!f&&Math.abs(y)<la)return;f||l.classList.add("scrubbing"),f=!0;let E=v.shiftKey?10:v.altKey?.1:1;g=n(Number((h+(y-Math.sign(y)*la)*t*E).toFixed(e+(v.altKey?1:0)))),p.value=ct(g,e),s.preview?.(g)},w=v=>{if(l.removeEventListener("pointermove",c),l.removeEventListener("pointerup",w),l.removeEventListener("pointercancel",w),l.classList.remove("scrubbing"),!f){p.focus(),p.select();return}s.preview?.(void 0),v.type!=="pointercancel"&&g!==void 0&&!i(g)?s.set(g):p.value=o};l.addEventListener("pointermove",c),l.addEventListener("pointerup",w),l.addEventListener("pointercancel",w)};return m`<span class="hme-in hme-num ${s.disabled===!0?"off":""}" style=${s.width===void 0?b:`flex:0 0 ${s.width}`}
    title=${s.disabled===!0?b:"Drag sideways to change it, click to type"} @pointerdown=${r}>
    ${s.tag===void 0?b:m`<span class="hme-ntag" aria-hidden="true">${s.tag}</span>`}
    <input type="text" inputmode="decimal" aria-label=${s.label} .value=${N(o)} ?disabled=${s.disabled===!0}
      placeholder=${s.value===void 0?"Mixed":""}
      @change=${d=>a(d.target)}
      @keydown=${d=>{let l=d.target;if(d.key==="Enter"&&l.blur(),d.key==="Escape"&&(l.value=o,l.blur()),(d.key==="ArrowUp"||d.key==="ArrowDown")&&s.value!==void 0){d.preventDefault();let p=nn(l.value)??s.value,h=n(Number((p+(d.key==="ArrowUp"?1:-1)*t*(d.shiftKey?10:1)).toFixed(e)));l.value=ct(h,e),i(h)||s.set(h)}}} />${s.unit===void 0?b:m`<span class="hme-unit">${s.unit}</span>`}</span>`}var Ve=new WeakMap,pa=new WeakMap;function ft(s){let e=s.value.toLowerCase(),t=o=>{let n=Ve.get(o);n!==void 0&&(Ve.delete(o),s.preview(void 0),o.value.toLowerCase()!==n&&(pa.set(o,o.value.toLowerCase()),s.set(o.value)))};return m`<input type="color" .value=${N(e)} aria-label=${s.label}
    @input=${o=>{let n=o.target;Ve.has(n)||Ve.set(n,e);let i=n.value.toLowerCase();s.preview(i===Ve.get(n)?void 0:i)}}
    @change=${o=>{let n=o.target,i=n.value.toLowerCase();Ve.has(n)?t(n):i!==e&&i!==pa.get(n)&&s.set(n.value)}}
    @blur=${o=>t(o.target)} />`}function gt(...s){return m`<div class="hme-fields" style=${`--n:${s.length}`}>${s}</div>`}function bt(s,...e){return m`<div class="hme-group"><div class="hme-gl">${s}</div>${e}</div>`}function Xe(s){return m`<span class="hme-in"><input type="text" aria-label=${s.label} maxlength=${s.max??100} placeholder=${s.placeholder??""}
    .value=${N(s.value)}
    @change=${e=>{let t=e.target.value;t.trim()!==s.value.trim()&&s.set(t)}}
    @keydown=${e=>{e.key==="Enter"&&e.target.blur()}} /></span>`}function De(s){return m`<span class="hme-in hme-sel ${s.cls??""}"><select aria-label=${s.label} @change=${e=>s.set(e.target.value)}>
    ${s.options.map(e=>m`<option value=${e.value} ?disabled=${e.disabled===!0} .selected=${N(e.value===s.value)}>${e.label}</option>`)}
  </select></span>`}function rn(s){return m`<span class="hme-menu ${s.cls??""}"><select aria-label=${s.label} @change=${e=>{let t=e.target,o=t.value;t.value="",o!==""&&s.pick(o)}}>
    <option value="" .selected=${N(!0)}>${s.label}</option>
    ${s.options.map(e=>m`<option value=${e.value} ?disabled=${e.disabled===!0}>${e.label}</option>`)}
  </select><span class="hme-menu-caret" aria-hidden="true">▾</span></span>`}function X(s){return m`<button type="button" class="hme-pic ${s.on?"on":""}" aria-pressed=${s.on?"true":"false"} title=${s.title??s.label}
    @click=${s.click}>${s.picture}<span>${s.label}</span></button>`}function qe(s){return m`<button type="button" class="hme-chip ${s.on?"":"off"}" aria-pressed=${s.on?"true":"false"} aria-label=${s.label}
    @click=${s.click}>${s.on?s.onText:s.offText}</button>`}var Xa={wood:"repeating-linear-gradient(0deg,#b38a61 0 9px,#8e6845 9px 10px)",tile:"linear-gradient(#a9a7a1 1px,transparent 1px) 0 0/10px 10px, linear-gradient(90deg,#a9a7a1 1px,transparent 1px) 0 0/10px 10px, #cbc9c2",stone:"#bcc1c6 linear-gradient(#9da2a6 1px,transparent 1px) 0 0/18px 12px",carpet:"#99928a",plain:"#a8a6a1"},sn={wood:"#a17a55",tile:"#bdbbb4",stone:"#b0b5ba",carpet:"#8f8880",plain:"#9c9a95"};function dn(s){return m`<span class="hme-sw" style=${`background:${Xa[s]}`}></span>`}var ha=s=>s.map(([e,t])=>`${Math.round(e*10)/10},${Math.round(t*10)/10}`).join(" ");function ln(s,e=34,t=24){let o=s?.rooms??[];if(o.length===0)return m`<svg class="hme-thumb" width=${e} height=${t} viewBox=${`0 0 ${e} ${t}`} aria-hidden="true">
      <rect x="1" y="1" width=${e-2} height=${t-2} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" stroke-dasharray="3 2" /></svg>`;let n=$t(s),i=4,a=Math.min((e-i*2)/Math.max(n.maxX-n.minX,.5),(t-i*2)/Math.max(n.maxY-n.minY,.5)),r=e/2-(n.minX+n.maxX)/2*a,d=t/2-(n.minY+n.maxY)/2*a;return m`<svg class="hme-thumb" width=${e} height=${t} viewBox=${`0 0 ${e} ${t}`} aria-hidden="true">
    <rect x="0.5" y="0.5" width=${e-1} height=${t-1} rx="4" fill="var(--hme-thumb-bg)" stroke="var(--wa-line-strong)" />
    ${o.map(l=>$`<polygon points=${ha(l.outline.map(([p,h])=>[r+p*a,d+h*a]))} fill="none" stroke="var(--wa-muted)" stroke-width="1.1" />`)}
  </svg>`}function ma(s,e,t=76,o=54){let n=s.outline.map(c=>c[0]),i=s.outline.map(c=>c[1]),a=Math.min(...n),r=Math.max(...n),d=Math.min(...i),l=Math.max(...i),p=8,h=Math.min((t-p*2)/Math.max(r-a,.5),(o-p*2)/Math.max(l-d,.5)),u=t/2-(a+r)/2*h,f=o/2-(d+l)/2*h,g=ha(s.outline.map(([c,w])=>[u+c*h,f+w*h]));return m`<svg class="hme-room-thumb" width=${t} height=${o} viewBox=${`0 0 ${t} ${o}`} aria-hidden="true">
    <rect width=${t} height=${o} rx="8" fill="#121010" />
    <polygon points=${g} fill=${sn[Le(s)]} stroke="#ece6da" stroke-width="2.5" stroke-linejoin="round" />
    ${e?$`<circle cx=${t*.58} cy=${o*.42} r=${Math.min(t,o)*.22} fill="#ffb648" opacity="0.35" />`:b}
  </svg>`}function pn(s,e,t,o={}){let n=(o.reach??10)/t,i,a=n;for(let l of[...s.rooms.flatMap(p=>p.outline),...o.corners??[]]){let p=Math.hypot(l[0]-e[0],l[1]-e[1]);p<=a&&(i=l,a=p)}if(i!==void 0)return[i[0],i[1]];let[r,d]=e;if(o.grid!==void 0&&o.grid>0&&(r=Math.round(r/o.grid)*o.grid,d=Math.round(d/o.grid)*o.grid),o.from!==void 0){let l=8/t;Math.abs(e[0]-o.from[0])<=l&&(r=o.from[0]),Math.abs(e[1]-o.from[1])<=l&&(d=o.from[1])}return[Math.round(r*100)/100,Math.round(d*100)/100]}var ve=.1,we=.05,eo=class{constructor(e){this.grid=e;this.active=!1;this.points=[]}start(e){this.active=!0,this.points=[],this.hoverAt=void 0,e.select(void 0),e.redraw()}stop(e){this.active=!1,this.points=[],this.hoverAt=void 0,e?.redraw()}snap(e,t){return pn(e.floor,t,e.view.scale,{...this.points.length>0?{from:this.points[this.points.length-1]}:{},...e.toggles.grid?{grid:this.grid}:{},corners:this.points})}closes(e,t){let o=this.points[0];return o!==void 0&&this.points.length>=3&&Math.hypot(t[0]-o[0],t[1]-o[1])*e.view.scale<=10}pointerDown(e,t,o){if(!this.active||t.button!==0)return!1;let n=this.snap(e,o);if(this.closes(e,n))return this.finish(e),!0;let i=this.points[this.points.length-1];return(i===void 0||Math.hypot(n[0]-i[0],n[1]-i[1])>=.05)&&this.points.push(n),e.redraw(),!0}hover(e,t){this.active&&(this.hoverAt=t===void 0?void 0:this.snap(e,t),e.redraw())}keyDown(e,t){return this.active?t.key==="Escape"?(this.stop(e),!0):t.key==="Enter"?(this.points.length>=3&&this.finish(e),!0):t.key==="Backspace"||t.key==="Delete"?(this.points.pop(),e.redraw(),!0):!1:!1}async finish(e){let t=this.points.slice();if(this.stop(e),t.length<3)return;let o=await e.ask({title:"Name the room",label:"Name",value:"Room",ok:"Add room"});if(o===void 0)return;let n=e.newId(),i=e.floor.id;e.apply(a=>ui(a,i,n,t,o),{select:{kind:"room",roomId:n}})||e.note("err","That room could not be added. Draw at least three corners round some floor.")}overlay(e){if(!this.active)return b;let t=this.points.map(d=>e.toScreen(d)),o=this.hoverAt===void 0?void 0:e.toScreen(this.hoverAt),n=this.hoverAt!==void 0&&this.closes(e,this.hoverAt),i=[...t,...o!==void 0?[o]:[]].map(([d,l])=>`${d.toFixed(1)},${l.toFixed(1)}`).join(" "),a=this.points[this.points.length-1],r=a!==void 0&&this.hoverAt!==void 0?Math.hypot(this.hoverAt[0]-a[0],this.hoverAt[1]-a[1]):0;return $`<g class="hme-draw">
      ${t.length>=3?$`<polygon points=${t.map(([d,l])=>`${d},${l}`).join(" ")} fill="rgba(91,141,239,0.14)" stroke="none" />`:b}
      <polyline points=${i} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />
      ${t.map(([d,l],p)=>$`<circle cx=${d} cy=${l} r=${p===0&&n?8:5} fill=${p===0&&n?"#5b8def":"#fff"} stroke="#5b8def" stroke-width="2" />`)}
      ${o!==void 0&&!n?$`<circle cx=${o[0]} cy=${o[1]} r="4" fill="#5b8def" />`:b}
      ${o!==void 0&&r>.05?$`<g class="hme-tag"><rect x=${o[0]+10} y=${o[1]-26} width="58" height="18" rx="9" fill="#5b8def" />
        <text x=${o[0]+39} y=${o[1]-13} fill="#fff" text-anchor="middle">${r.toFixed(2)} m</text></g>`:b}
    </g>`}hint(){return this.points.length===0?"Click to put down the first corner":this.points.length<3?"Click to add corners":"Click the first corner or press Enter to close the room"}};var hn;function to(){return hn??=import("./scene3d-Y2JQEBS2.js").catch(s=>{throw hn=void 0,s}),hn}function mn(s){return new URL("furniture/",s).href}var ca={wood:"Wood",tile:"Tile",stone:"Stone",carpet:"Carpet",plain:"Plain"},qa={wood:[{name:"Light oak",hex:"#D9B88A"},{name:"Oak",hex:"#B98B5A"},{name:"Walnut",hex:"#6B4A32"},{name:"Grey wash",hex:"#9A948C"}],tile:[{name:"White",hex:"#E9E7E2"},{name:"Grey",hex:"#8E8E8A"},{name:"Black",hex:"#2E2E30"},{name:"Terracotta",hex:"#B4664A"}],stone:[{name:"Light",hex:"#C9C3B8"},{name:"Sand",hex:"#B8A98E"},{name:"Slate",hex:"#5E6468"}],carpet:[{name:"Grey",hex:"#8E8E93"},{name:"Beige",hex:"#CBB9A0"},{name:"Navy",hex:"#2E4A7D"},{name:"Green",hex:"#4F6B4A"}],plain:[{name:"White",hex:"#E9E7E2"},{name:"Grey",hex:"#8E8E8A"},{name:"Black",hex:"#2E2E30"}]},Ya=[{name:"White",hex:"#F2F0EB"},{name:"Warm white",hex:"#EDE6D8"},{name:"Greige",hex:"#CFC6B8"},{name:"Sage",hex:"#A3B09A"},{name:"Blue grey",hex:"#8C9AA6"},{name:"Charcoal",hex:"#3E4044"}];function cn(s){let e=s.mixed===!0,t=e?void 0:s.now?.toUpperCase(),o=t!==void 0&&!s.presets.some(n=>n.hex===t);return m`<div class="hme-r top"><span class="hme-l">${s.word}</span>
    <div class="hme-chips hme-colours" role="group" aria-label=${`${s.word} colour`}>
      <button type="button" class="hme-chip sel ${t===void 0&&!e?"on":""}" aria-pressed=${t===void 0&&!e?"true":"false"}
        title=${s.defaultTitle} @click=${()=>s.set(void 0)}>Default</button>
      ${s.presets.map(n=>m`<button type="button" class="hme-colour ${t===n.hex?"on":""}" style=${`--c:${n.hex}`}
        title=${n.name} aria-label=${`${s.word}: ${n.name}`} aria-pressed=${t===n.hex?"true":"false"} @click=${()=>s.set(n.hex)}></button>`)}
      <label class="hme-chip sel hme-pick ${o?"on":""}" title=${s.customTitle}>${o?m`<span class="hme-swatch" style=${`background:${t}`}></span>`:b}Custom
        ${ft({value:t??s.presets[0].hex,label:s.customLabel,preview:s.preview,set:s.set})}</label>
    </div></div>
    ${e?K(`Mixed: their ${s.word.toLowerCase()} colours differ. Pick one to set them all.`):b}`}var oo=15,Za=[{a:0,c:0},{c:0},{a:1,c:0},{a:1},{a:1,c:1},{c:1},{a:0,c:1},{a:0}];function Ja(s,e){let t=(Math.atan2(e,s)*180/Math.PI+180)%180;return["ew-resize","nwse-resize","ns-resize","nesw-resize"][Math.round(t/45)%4]}function Qa(s,e){let t=e===0?"":` Its ${I(e,"device")} come${e===1?"s":""} off the map too.`;return`${T(s)} comes off the map.${t} A scanned room comes back only by scanning it again on the iPhone. Undo brings it back while this page is open.`}function q(s){return st(s.model)?.name??ut(s.kind)}function ua(s){let e=s.map(t=>q(t.object));return e.length<=1?e.join(""):`${e.slice(0,-1).join(", ")} and ${e[e.length-1]}`}function fa(s){let e=s[0]?.room.id;return e!==void 0&&s.every(t=>M(t.room.id,e))?{kind:"room",roomId:e}:void 0}var er=["fabric","wood"],vt=s=>s.map(e=>({roomId:e.room.id,object:e.index}));function un(s){return Un(Wt(s))}function ga(s){let e=fe(s.selection),t=e===void 0?void 0:s.floor.rooms.find(a=>M(a.id,e));if(t!==void 0)return t;let o=Re(s.view,[s.stage.width/2,s.stage.height/2]),n=W(s.floor,o);if(n!==void 0)return n;let i;for(let a of s.floor.rooms){let r=J(a),d=Math.hypot(r[0]-o[0],r[1]-o[1]);(i===void 0||d<i.d)&&(i={room:a,d})}return i?.room}function tr(s,e,t){let o=Li(s,t).filter(a=>e===""||a.group===e);if(s.trim()!==""||e!=="")return[{title:e===""?"Found":e,pieces:o}];let n=[],i=t===void 0?[]:o.filter(a=>a.kind===t);i.length>0&&n.push({title:`${ut(t)} pieces`,pieces:i});for(let a of Bt.groups){let r=o.filter(d=>d.group===a&&!i.includes(d));r.length>0&&n.push({title:a,pieces:r})}return n}function or(s){return Math.round(Bn(s.turn)*10)/10}var j=s=>s.toFixed(1),ne=s=>`${s[0].toFixed(1)},${s[1].toFixed(1)}`,no=class{constructor(){this.draw=new eo(ve);this.guides=[];this.dragging=!1;this.resizing=!1;this.pickerQuery="";this.pickerGroup="";this.pickerFocus=!1;this.thumbs=new Map;this.askedThumbs=new Set;this.thumbFrame=0}openPicker(e,t,o){this.picker=o===void 0?{roomId:t.id}:{roomId:t.id,index:o},this.pickerQuery="",this.pickerGroup="",this.pickerFocus=!0,e.redraw()}closePicker(e){this.picker=void 0,e.redraw()}get pickerOpen(){return this.picker!==void 0}thumb(e,t){let o=this.thumbs.get(t),n=e.furnitureBase;if(o!==void 0||n===void 0||this.askedThumbs.has(t))return o;this.askedThumbs.add(t),to().then(i=>i.homeMapPieceThumb(n,t)).then(i=>{if(i===void 0||(this.thumbs.set(t,i),this.thumbFrame!==0))return;let a=typeof requestAnimationFrame=="function"?requestAnimationFrame:r=>setTimeout(r,16);this.thumbFrame=a(()=>{this.thumbFrame=0,e.redraw()})},()=>{})}piecePic(e,t,o){let n=t===void 0?void 0:this.thumb(e,t.id);return m`<span class="${o} ${n===void 0?"wait":""}">${n===void 0?b:m`<img src=${n} alt="" draggable="false" />`}</span>`}pickPiece(e,t){let o=this.picker,n=o===void 0?void 0:e.floor.rooms.find(d=>M(d.id,o.roomId));if(this.picker=void 0,o===void 0||n===void 0){e.redraw();return}let i=n.id;if(o.index!==void 0){let d=o.index;e.apply(l=>li(l,i,d,t),{select:{kind:"object",roomId:i,object:d}})||e.redraw();return}let a=V(n)??J(n),r=n.objects.length;e.apply(d=>di(d,i,t,a),{select:{kind:"object",roomId:i,object:r}})||e.redraw()}sheet(e){let t=this.picker;if(t===void 0)return b;let o=e.floor.rooms.find(u=>M(u.id,t.roomId)),n=t.index===void 0?void 0:o?.objects[t.index];if(o===void 0||t.index!==void 0&&n===void 0)return this.picker=void 0,b;let i=n===void 0?void 0:Wt(n),a=tr(this.pickerQuery,this.pickerGroup,n?.kind),r=n===void 0?"Add furniture":"Change model",d=n===void 0?`To ${T(o)}, in its middle. Drag it into place once it is in.`:`${q(n)} in ${T(o)} keeps its place, size and turn.`,l=u=>Bt.pieces.filter(f=>u===""||f.group===u).length,p=["",...Bt.groups],h=this.pickerFocus;return this.pickerFocus=!1,m`<div class="hme-scrim hme-sheet"
      @pointerdown=${u=>{u.target===u.currentTarget&&this.closePicker(e)}}
      @keydown=${u=>{u.stopPropagation(),u.key==="Escape"&&this.closePicker(e)}}>
      <div class="hme-fpick" role="dialog" aria-modal="true" aria-label=${r}>
        <header class="hme-fpick-head">
          <div class="hme-fpick-t"><strong>${r}</strong><span>${d}</span></div>
          <label class="hme-find hme-fpick-find"><span aria-hidden="true">⌕</span>
            <input type="search" placeholder="Find a piece: sofa, lamp, desk" aria-label="Find a piece" .value=${N(this.pickerQuery)}
              ${Gt(u=>{h&&u instanceof HTMLInputElement&&setTimeout(()=>u.focus(),0)})}
              @input=${u=>{this.pickerQuery=u.target.value,e.redraw()}} /></label>
          <button type="button" class="hme-x hme-fpick-close" aria-label="Close" title="Close (Esc)" @click=${()=>this.closePicker(e)}>×</button>
        </header>
        <div class="hme-fpick-main">
          <nav class="hme-fpick-groups" aria-label="Groups">
            ${p.map(u=>m`<button type="button" class="hme-tool ${u===this.pickerGroup?"on":""}" aria-pressed=${u===this.pickerGroup?"true":"false"}
              @click=${()=>{this.pickerGroup=u,e.redraw()}}>${u===""?"All":u}<span class="n">${l(u)}</span></button>`)}
          </nav>
          <div class="hme-fpick-body">
            ${a.every(u=>u.pieces.length===0)?m`<p class="hme-empty-line">No piece by that name${this.pickerGroup===""?"":` in ${this.pickerGroup}`}.</p>`:b}
            ${a.filter(u=>u.pieces.length>0).map(u=>m`<section class="hme-fpick-sec">
              <div class="hme-h">${u.title}<span class="hme-h-end">${I(u.pieces.length,"piece")}</span></div>
              <div class="hme-fgrid">${u.pieces.map(f=>{let g=i?.id===f.id;return m`<button type="button" class="hme-fcard ${g?"on":""}" aria-pressed=${g?"true":"false"}
                  title=${`${n===void 0?"Add":"Use"} ${f.name}, ${xo(f)}`} @click=${()=>this.pickPiece(e,f)}>
                  ${this.piecePic(e,f,"hme-fcard-pic")}
                  <span class="hme-fcard-name">${f.name}</span>
                  <span class="hme-fcard-size mono">${xo(f)}</span>
                </button>`})}</div>
            </section>`)}
          </div>
        </div>
      </div>
    </div>`}stopDrag(e){this.guides=[],this.dragging=!1,this.resizing=!1,e.preview(void 0)}focus(e){let t=fe(e.selection);return t===void 0?void 0:e.floor.rooms.find(o=>M(o.id,t))}pickedMany(e){if(e.selection?.kind==="objects")return Ie(e.selection).flatMap(t=>{let o=e.floor.rooms.find(i=>M(i.id,t.roomId)),n=o?.objects[t.object];return o===void 0||n===void 0?[]:[{room:o,index:t.object,object:n}]})}picked(e){let t=e.selection;if(t?.kind!=="object")return;let o=this.focus(e),n=o?.objects[t.object];return o===void 0||n===void 0?void 0:{room:o,index:t.object,object:n}}thingUnder(e,t,o){let n;for(let i of o===void 0?e.floor.rooms:[o])i.objects.forEach((a,r)=>{if(a.hidden===!0)return;let d=He(xe(a));if(!ke(d,t))return;let l=Math.abs(Ct(d));(n===void 0||l<n.area)&&(n={thing:{room:i,index:r,object:a},area:l})});return n?.thing}pickThing(e,t,o){e.select({kind:"object",roomId:t.id,object:o})}addFurnitureButton(e,t,o){return m`<button type="button" class=${o} ?disabled=${t===void 0}
      title=${t===void 0?"Draw or scan a room first":`Pick a sofa, a bed, a lamp or more from the furniture catalog for ${T(t)}`}
      @click=${()=>{t!==void 0&&this.openPicker(e,t)}}>＋ Add furniture</button>`}overlay(e){if(this.draw.active)return this.draw.overlay(e);let t=this.focus(e),o=this.picked(e),n=this.pickedMany(e),i=[];for(let a of this.guides)i.push(this.guide(e,a));if(n!==void 0)for(let a of n){let r=He(xe(a.object)).map(d=>ne(e.toScreen(d))).join(" ");i.push($`<polygon class="hme-box" points=${r} fill="rgba(91,141,239,0.1)" stroke="#5b8def" stroke-width="2"
          stroke-dasharray=${a.object.hidden===!0?"5 4":"none"} pointer-events="none" />`)}else if(o!==void 0){let a=o.room.outline.map(d=>ne(e.toScreen(d))).join(" ");i.push($`<polygon points=${a} fill="none" stroke="#5b8def" stroke-width="1" stroke-dasharray="4 4" opacity="0.5" pointer-events="none" />`);let r=o.object;i.push(this.box(e,He(xe(r)),{width:r.size[0],depth:r.size[1]},"thing",r.hidden===!0))}else t!==void 0&&t.outline.length>=3&&i.push(this.box(e,ra(t),Qt(t),"room",!1));return i.length===0?b:$`${i}`}box(e,t,o,n,i){let a=t.map(v=>e.toScreen(v)),r=a.reduce((v,y)=>[v[0]+y[0]/4,v[1]+y[1]/4],[0,0]),d=v=>[(a[v][0]+a[(v+1)%4][0])/2,(a[v][1]+a[(v+1)%4][1])/2],l=v=>{let y=Math.max(Math.hypot(v[0]-r[0],v[1]-r[1]),1e-6);return[(v[0]-r[0])/y,(v[1]-r[1])/y]},p=[0,1,2,3].flatMap(v=>[a[v],d(v)]),h=[0,1,2,3].reduce((v,y)=>d(y)[1]<d(v)[1]?y:v,0),u=d(h),f=l(u),g=[u[0]+f[0]*44,u[1]+f[1]*44],c=[];for(let v of[[0,2],[1,3]]){let[y,E]=v,C=Math.abs(a[(y+1)%4][0]-a[y][0])>=Math.abs(a[(y+1)%4][1]-a[y][1])?l(d(y))[1]<=l(d(E))[1]?y:E:l(d(y))[0]<=l(d(E))[0]?y:E,F=a[C],A=a[(C+1)%4],U=l(d(C)),_=[F[0]+U[0]*20,F[1]+U[1]*20],Y=[A[0]+U[0]*20,A[1]+U[1]*20],ie=[(_[0]+Y[0])/2,(_[1]+Y[1])/2],Na=C%2===0?o.width:o.depth,de=[U[0]*5,U[1]*5];c.push($`<path d=${`M${ne(_)}L${ne(Y)}M${ne([_[0]-de[0],_[1]-de[1]])}L${ne([_[0]+de[0],_[1]+de[1]])}M${ne([Y[0]-de[0],Y[1]-de[1]])}L${ne([Y[0]+de[0],Y[1]+de[1]])}`}
        stroke="#5b8def" stroke-width="1.2" fill="none" />
        <g class="hme-tag"><rect x=${j(ie[0]-26)} y=${j(ie[1]-9)} width="52" height="18" rx="9" fill="#5b8def" />
        <text x=${j(ie[0])} y=${j(ie[1]+4)} fill="#fff" text-anchor="middle">${Na.toFixed(2)} m</text></g>`)}let w=n==="room"?"Drag to resize the room. Shift keeps its proportions, Alt resizes it about its middle, Cmd or Ctrl stops it snapping.":"Drag to resize it. Shift keeps its proportions, Alt resizes it about its middle.";return $`<g class="hme-box">
      <polygon points=${a.map(ne).join(" ")} fill="none" stroke="#5b8def" stroke-width="2" stroke-dasharray=${i?"5 4":"none"} />
      ${this.resizing||!this.dragging?c:b}
      ${this.dragging?b:$`
        <line x1=${j(u[0])} y1=${j(u[1])} x2=${j(g[0])} y2=${j(g[1])} stroke="#5b8def" stroke-width="1.6" />
        ${p.map((v,y)=>$`<rect data-hme="resize" data-handle=${y} x=${j(v[0]-5)} y=${j(v[1]-5)} width="10" height="10"
          fill="#fff" stroke="#5b8def" stroke-width="1.6" style=${`cursor:${Ja(v[0]-r[0],v[1]-r[1])}`}>
          <title>${w}</title></rect>`)}
        <g data-hme="turn" style="cursor:grab" transform=${`translate(${ne(g)})`}>
          <title>${n==="room"?"Drag to turn the room. Hold Alt to turn it freely.":"Drag to turn it. Hold Alt to turn it freely."}</title>
          <circle r="9" fill="#5b8def" />
          <path d="M-4 0a4 4 0 1 0 1.5-3.1M-4-4.5v2.5h2.5" fill="none" stroke="#fff" stroke-width="1.3" />
        </g>`}
    </g>`}guide(e,t){let o=e.toScreen(t.a),n=e.toScreen(t.b),i=Math.max(Math.hypot(n[0]-o[0],n[1]-o[1]),1e-6),a=[(n[0]-o[0])/i,(n[1]-o[1])/i],r=[o[0]-a[0]*40,o[1]-a[1]*40],d=[n[0]+a[0]*40,n[1]+a[1]*40],l=e.floor.rooms.find(u=>M(u.id,t.roomId)),p=`Lined up with ${l===void 0?"a":T(l)} wall`,h=p.length*6.2+20;return $`<g class="hme-guide" pointer-events="none">
      <line x1=${j(r[0])} y1=${j(r[1])} x2=${j(d[0])} y2=${j(d[1])} stroke="#ff4fa3" stroke-width="1.2" stroke-dasharray="6 4" />
      <g class="hme-tag"><rect x=${j(d[0]+6)} y=${j(d[1]-10)} width=${j(h)} height="20" rx="10" fill="#ff4fa3" />
      <text x=${j(d[0]+6+h/2)} y=${j(d[1]+4)} fill="#fff" text-anchor="middle">${p}</text></g>
    </g>`}pointerDown(e,t,o){return this.draw.active?this.draw.pointerDown(e,t,o):t.button!==0?!1:this.pressHandle(e,t,o)||this.pressBody(e,t,o)}pressHandle(e,t,o){let n=t.target?.closest?.("[data-hme]"),i=n?.getAttribute("data-hme");if(i!=="turn"&&i!=="resize")return!1;let a=Za[Number(n?.getAttribute("data-handle"))],r=this.picked(e),d=this.focus(e);if(r!==void 0){if(i==="turn")this.thingTurnDrag(e,t,r,o);else if(a!==void 0)this.thingResizeDrag(e,t,r,a,o);else return!1;return!0}if(d===void 0)return!1;if(i==="turn")this.turnDrag(e,t,d,o);else if(a!==void 0)this.resizeDrag(e,t,d,a,o);else return!1;return!0}pressThing(e,t,o,n){let i=e.floor.rooms.find(r=>M(r.id,o.roomId)),a=i?.objects[o.object];return i===void 0||a===void 0?!1:t.shiftKey||t.metaKey||t.ctrlKey?(e.select(ge(e.selection,{roomId:i.id,object:o.object})),!0):(this.pickThing(e,i,o.object),this.thingMoveDrag(e,t,{room:i,index:o.object,object:a},n),!0)}pressBody(e,t,o){let n=this.thingUnder(e,o,void 0);if(t.metaKey||t.ctrlKey)return n!==void 0&&e.select(ge(e.selection,{roomId:n.room.id,object:n.index})),n!==void 0||W(e.floor,o)!==void 0;if(n!==void 0)return this.pickThing(e,n.room,n.index),this.thingMoveDrag(e,t,n,o),!0;let i=W(e.floor,o);return i===void 0?!1:(e.select({kind:"room",roomId:i.id}),this.moveDrag(e,t,i,o),!0)}moveDrag(e,t,o,n){let i=e.doc,a=o.id,r=$e(o.outline),d=[0,0];e.drag(t,{move:(l,p)=>{let h=l[0]-n[0],u=l[1]-n[1];if(e.toggles.grid&&r!==void 0){let f=ve;h=Math.round((r.minX+h)/f)*f-r.minX,u=Math.round((r.minY+u)/f)*f-r.minY}if(this.guides=[],e.toggles.snap&&!p.altKey){let f=qn(i,a,h,u);f!==void 0&&(h=f.dx,u=f.dy,this.guides=f.guides)}this.dragging=!0,d=[h,u],e.preview(f=>_e(f,a,h,u))},end:(l,p,h)=>{this.stopDrag(e);let[u,f]=d;h&&(Math.abs(u)>=.005||Math.abs(f)>=.005)&&e.apply(g=>_e(g,a,u,f),{select:{kind:"room",roomId:a}})},cancel:()=>this.stopDrag(e)})}resizeDrag(e,t,o,n,i){let a=Zn(o);if(a===void 0)return;let r=e.doc,d=o.id,l=a.a1-a.a0,p=a.c1-a.c0;if(l<=1e-6||p<=1e-6)return;let h=c=>c[0]*a.u[0]+c[1]*a.u[1],u=c=>c[0]*a.v[0]+c[1]*a.v[1],f=c=>Math.min(Math.max(c,et),tt),g;e.drag(t,{move:(c,w)=>{let v=w.altKey?2:1,y=l,E=p;if(n.a!==void 0&&(y=l+(h(c)-h(i))*(n.a===1?1:-1)*v),n.c!==void 0&&(E=p+(u(c)-u(i))*(n.c===1?1:-1)*v),e.toggles.grid){let A=ve;n.a!==void 0&&(y=Math.round(y/A)*A),n.c!==void 0&&(E=Math.round(E/A)*A)}if(y=f(y),E=f(E),w.shiftKey){let A=y/l,U=E/p,_=n.a===void 0?U:n.c===void 0||Math.abs(Math.log(A))>=Math.abs(Math.log(U))?A:U;_=Math.min(Math.max(_,et/Math.min(l,p)),tt/Math.max(l,p)),y=l*_,E=p*_}let x=[w.altKey||n.a===void 0?.5:1-n.a,w.altKey||n.c===void 0?.5:1-n.c],C={width:y,depth:E,anchor:x};if(this.guides=[],e.toggles.snap&&!w.altKey&&!w.ctrlKey&&!w.metaKey){let A=Jn(r,d,C,n,{proportional:w.shiftKey});A!==void 0&&(C=A.resize,this.guides=A.guides)}this.dragging=!0,this.resizing=!0,g=C;let F=C;e.preview(A=>ot(A,d,F))},end:(c,w,v)=>{this.stopDrag(e);let y=g;!v||y===void 0||Math.abs((y.width??l)-l)<.005&&Math.abs((y.depth??p)-p)<.005||e.apply(E=>ot(E,d,y),{select:{kind:"room",roomId:d}})},cancel:()=>this.stopDrag(e)})}turnDrag(e,t,o,n){let i=o.id,a=J(o),r=Math.atan2(n[1]-a[1],n[0]-a[0]),d=0;e.drag(t,{move:(l,p)=>{let h=(Math.atan2(l[1]-a[1],l[0]-a[0])-r)*180/Math.PI;h=(h+540)%360-180,p.altKey||(h=Math.round(h/oo)*oo),this.dragging=!0,d=h,e.preview(u=>Ee(u,i,h,a))},end:(l,p,h)=>{this.stopDrag(e),h&&Math.abs(d)>.01&&e.apply(u=>Ee(u,i,d,a),{select:{kind:"room",roomId:i}})},cancel:()=>this.stopDrag(e)})}thingMoveDrag(e,t,o,n){let{room:i,index:a,object:r}=o,d=i.id,l=r.c,p=l;e.drag(t,{move:(h,u)=>{let f=[l[0]+h[0]-n[0],l[1]+h[1]-n[1]];if(e.toggles.grid){let c=ve;f=[Math.round(f[0]/c)*c,Math.round(f[1]/c)*c]}if(this.guides=[],e.toggles.snap&&!u.altKey){let c=ci(i,r,f);f=c.c,this.guides=c.guides}this.dragging=!0,p=f;let g=f;e.preview(c=>Fe(c,d,a,g))},end:(h,u,f)=>{if(this.stopDrag(e),f&&Math.hypot(p[0]-l[0],p[1]-l[1])>=.005){let g=p;e.apply(c=>Fe(c,d,a,g),{select:{kind:"object",roomId:d,object:a}})}},cancel:()=>this.stopDrag(e)})}thingResizeDrag(e,t,o,n,i){let{room:a,index:r,object:d}=o,l=a.id,{u:p,v:h}=mi(d),u=Math.max(d.size[0],ze),f=Math.max(d.size[1],ze),g=y=>y[0]*p[0]+y[1]*p[1],c=y=>y[0]*h[0]+y[1]*h[1],w=y=>Math.min(Math.max(y,ze),Ot),v;e.drag(t,{move:(y,E)=>{let x=E.altKey?2:1,C=u,F=f;if(n.a!==void 0&&(C=u+(g(y)-g(i))*(n.a===1?1:-1)*x),n.c!==void 0&&(F=f+(c(y)-c(i))*(n.c===1?1:-1)*x),e.toggles.grid){let _=ve;n.a!==void 0&&(C=Math.round(C/_)*_),n.c!==void 0&&(F=Math.round(F/_)*_)}if(C=w(C),F=w(F),E.shiftKey){let _=C/u,Y=F/f,ie=n.a===void 0?Y:n.c===void 0||Math.abs(Math.log(_))>=Math.abs(Math.log(Y))?_:Y;ie=Math.min(Math.max(ie,ze/Math.min(u,f)),Ot/Math.max(u,f)),C=u*ie,F=f*ie}let A=[E.altKey||n.a===void 0?.5:1-n.a,E.altKey||n.c===void 0?.5:1-n.c];this.dragging=!0,this.resizing=!0;let U={width:C,depth:F,anchor:A};v=U,e.preview(_=>at(_,l,r,U))},end:(y,E,x)=>{this.stopDrag(e);let C=v;!x||C===void 0||Math.abs((C.width??u)-d.size[0])<.005&&Math.abs((C.depth??f)-d.size[1])<.005||e.apply(F=>at(F,l,r,C),{select:{kind:"object",roomId:l,object:r}})},cancel:()=>this.stopDrag(e)})}thingTurnDrag(e,t,o,n){let{room:i,index:a,object:r}=o,d=i.id,l=r.c,p=Math.atan2(n[1]-l[1],n[0]-l[0]),h=0;e.drag(t,{move:(u,f)=>{let g=(Math.atan2(u[1]-l[1],u[0]-l[0])-p)*180/Math.PI;g=(g+540)%360-180,f.altKey||(g=Math.round(g/oo)*oo),this.dragging=!0,h=-g;let c=h;e.preview(w=>Te(w,d,a,c))},end:(u,f,g)=>{this.stopDrag(e);let c=h;g&&Math.abs(c)>.01&&e.apply(w=>Te(w,d,a,c),{select:{kind:"object",roomId:d,object:a}})},cancel:()=>this.stopDrag(e)})}hover(e,t){this.draw.hover(e,t)}keyDown(e,t){if(this.draw.active)return this.draw.keyDown(e,t);let o=this.pickedMany(e);if(o!==void 0)return this.manyKeyDown(e,t,o);let n=this.focus(e);if(n===void 0)return!1;let i=Z(t,!1),a=this.picked(e);if(a!==void 0){let{index:r,object:d}=a,l={kind:"room",roomId:n.id};if(i==="delete")return e.apply(p=>it(p,n.id,r),{select:l}),!0;if(i==="cancel")return e.select(l),!0;if(typeof i=="object"&&"nudge"in i){let[p,h]=i.nudge;return e.apply(u=>Fe(u,n.id,r,[d.c[0]+p,d.c[1]+h])),!0}return!1}if(i==="delete")return this.askDelete(e,n),!0;if(typeof i=="object"&&"nudge"in i){let[r,d]=i.nudge;return e.apply(l=>_e(l,n.id,r,d)),!0}return!1}manyKeyDown(e,t,o){let n=Z(t,!1),i=vt(o);if(n==="delete")return this.askDeleteThings(e,o),!0;if(n==="cancel")return e.select(fa(o)),!0;if(typeof n=="object"&&"nudge"in n){let[a,r]=n.nudge;return e.apply(d=>pi(d,i,a,r)),!0}return!1}async askDeleteThings(e,t){let o=vt(t);await e.confirm({title:`Delete ${I(t.length,"thing")}?`,text:`${ua(t)} come off the map. Undo brings them back while this page is open.`,ok:"Delete",danger:!0})&&e.apply(i=>hi(i,o),{select:fa(t)??null})}cursor(){return this.draw.active?"crosshair":void 0}leave(e){this.draw.stop(e),this.picker=void 0,this.guides=[],this.dragging=!1,this.resizing=!1}dock(e){return m`<button type="button" class="hme-tb ${e.toggles.snap?"on":""}" aria-pressed=${e.toggles.snap?"true":"false"}
        title="A dragged room lines up with the walls round it. Hold Alt to move it freely." @click=${()=>e.setToggle("snap",!e.toggles.snap)}>Snap to walls</button>
      <button type="button" class="hme-tb ${e.toggles.grid?"on":""}" aria-pressed=${e.toggles.grid?"true":"false"}
        @click=${()=>e.setToggle("grid",!e.toggles.grid)}>Grid 10 cm</button>`}pill(e){if(this.draw.active)return m`<span class="hme-pill-name">${this.draw.hint()}</span>
        ${this.draw.points.length>=3?m`<button type="button" class="hme-tb" @click=${()=>{this.draw.finish(e)}}>Close the room</button>`:b}
        <button type="button" class="hme-tb" @click=${()=>this.draw.stop(e)}>Cancel</button>`;let t=this.pickedMany(e);if(t!==void 0){let a=vt(t),r=t.some(d=>d.object.hidden!==!0);return m`<span class="hme-pill-name">${I(t.length,"thing")}</span>
        <button type="button" class="hme-tb" title=${r?"Hide every picked thing":"Show every picked thing"}
          @click=${()=>e.apply(d=>Dt(d,a,r))}>${r?"Hide":"Show"}</button>
        <button type="button" class="hme-tb danger" @click=${()=>{this.askDeleteThings(e,t)}}>Delete</button>`}let o=this.focus(e);if(o===void 0||this.dragging)return b;let n=o.id,i=this.picked(e);if(i!==void 0){let{index:a,object:r}=i;return m`<span class="hme-pill-name">${q(r)}</span>
        <button type="button" class="hme-tb" @click=${()=>e.apply(d=>Te(d,n,a,90))}>⟲ Turn 90°</button>
        <button type="button" class="hme-tb" title="Turn it square with the room's walls" @click=${()=>e.apply(d=>Io(d,n,a))}>Line up</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(d=>Rt(d,n,a,r.hidden!==!0))}>${r.hidden===!0?"Show":"Hide"}</button>
        <button type="button" class="hme-tb" @click=${()=>e.select({kind:"room",roomId:n})}>${T(o)} ›</button>
        <button type="button" class="hme-tb danger" @click=${()=>e.apply(d=>it(d,n,a),{select:{kind:"room",roomId:n}})}>Remove</button>`}return m`<span class="hme-pill-name">${T(o)}</span>
      <button type="button" class="hme-tb" @click=${()=>e.apply(a=>Ee(a,n,90))}>⟲ Turn 90°</button>
      <button type="button" class="hme-tb" @click=${()=>e.apply(a=>pe(a,n))}>Square the corners</button>
      <button type="button" class="hme-tb" title="Turn it to the floor's walls and slide it onto the nearest wall line, as the iPhone does"
        @click=${()=>e.apply(a=>Yn(a,n))}>Snap to walls</button>
      ${this.floorMenu(e,o,"Move to floor","hme-tb")}
      <button type="button" class="hme-tb danger" @click=${()=>{this.askDelete(e,o)}}>Delete</button>`}floorMenu(e,t,o,n){let i=e.doc.floors.filter(a=>!M(a.id,e.floor.id));return rn({label:o,cls:n,options:[...i.map(a=>({value:a.id,label:z(a)})),{value:"new",label:"New floor\u2026"}],pick:a=>{this.moveToFloor(e,t,a)}})}async moveToFloor(e,t,o){let n=t.id,i={kind:"room",roomId:n};if(o!=="new"){e.apply(l=>Ho(l,n,{floorId:o}),{select:i,floorId:o});return}let a=Math.max(...e.doc.floors.map(l=>l.story))+1,r=await e.ask({title:"A new floor",label:"Name",value:a===1?"Upstairs":`Floor ${a+1}`,ok:"Move the room there"});if(r===void 0)return;let d=e.newId();e.apply(l=>Ho(l,n,{newFloor:{id:d,name:r,story:a}}),{select:i,floorId:d})}async askDelete(e,t){let o=Qe(e.floor,t.id).length;await e.confirm({title:`Delete ${T(t)}?`,text:Qa(t,o),ok:"Delete room",danger:!0})&&e.apply(i=>ti(i,t.id),{select:null})}inspector(e){let t=this.pickedMany(e);if(t!==void 0)return this.manyInspector(e,t);let o=this.focus(e);if(o===void 0)return this.floorCard(e,e.floor);let n=this.picked(e);if(n!==void 0)return this.thingInspector(e,n);let i=o.id,a=Qt(o),r=Cn(e.floor,e.toggles.live?e.hass?.states:void 0).has(o.id),d=Qe(e.floor,i),l=$e(o.outline)??{minX:0,minY:0,maxX:0,maxY:0},p=Math.round(-Vn(o)*10)/10,h=o.areaId===void 0||e.areas.some(c=>c.id===o.areaId),u=o.pageId===void 0||e.pages.some(c=>M(c.id,o.pageId)),f=Kn(o),g=this.edits(e);return m`
      <section class="hme-card hme-head">
        ${ma(o,r)}
        <div class="hme-head-t">
          <strong>${T(o)}</strong>
          <span>${z(e.floor)} · ${Ue(o)} · ${a.area.toFixed(1)} m²</span>
        </div>
      </section>

      ${P("Room",m`
        ${D("Name",Xe({value:o.name??"",label:"Name",placeholder:"Room",set:c=>e.apply(w=>oi(w,i,c))}))}
        ${D("Area",De({label:"Area",value:o.areaId??"",options:[{value:"",label:"None"},...h?[]:[{value:o.areaId,label:`Not in Home Assistant (${o.areaId})`,disabled:!0}],...e.areas.map(c=>({value:c.id,label:c.name}))],set:c=>e.apply(w=>ni(w,i,c===""?void 0:c))}))}
        ${K("The Home Assistant area. Its devices show first in Not on the map, and Place all by area puts them here.")}
        ${D("Tap opens",De({label:"Tap opens",value:o.pageId??"",options:[{value:"",label:"Nothing"},...u?[]:[{value:o.pageId,label:"A page not in your library",disabled:!0}],...e.pages.map(c=>({value:c.id,label:`Page: ${c.name}`}))],set:c=>e.apply(w=>ii(w,i,c===""?void 0:c))}))}
        ${K("What a tap on this room does on the map tiles and the watch.")}`)}

      ${P("Size",m`
        ${gt(O({tag:"W",label:"Width",value:a.width,unit:"m",min:et,max:tt,...g((c,w)=>ot(c,i,{width:w}))}),O({tag:"D",label:"Depth",value:a.depth,unit:"m",min:et,max:tt,...g((c,w)=>ot(c,i,{depth:w}))}),O({tag:"H",label:"Wall height",value:o.height,unit:"m",min:.5,max:20,...g((c,w)=>nt(c,i,w))}))}
        <p class="hme-foot-hint">Along its own walls, about its middle; its doors, things and devices move with it.</p>`)}

      ${P("Place",m`
        ${bt("Corner",gt(O({tag:"X",label:"Left",value:l.minX,unit:"m",...g((c,w)=>_e(c,i,w-l.minX,0))}),O({tag:"Y",label:"Top",value:l.minY,unit:"m",...g((c,w)=>_e(c,i,0,w-l.minY))})))}
        ${bt("Turn",m`<div class="hme-turn">
          ${O({label:"Turn",value:p,unit:"\xB0",digits:1,min:-180,max:180,...g((c,w)=>Ee(c,i,w-p))})}
          <button type="button" class="hme-tb" @click=${()=>e.apply(c=>Ee(c,i,-90))}>−90°</button>
          <button type="button" class="hme-tb" @click=${()=>e.apply(c=>Ee(c,i,90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it so its longest wall runs straight across or down" @click=${()=>e.apply(c=>Xn(c,i))}>Level</button>
        </div>`)}
        <p class="hme-foot-hint">Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the room to move it, a square handle to resize it, the round one to turn it.</p>
        ${D("Floor",De({label:"Floor",value:e.floor.id,options:[...e.doc.floors.map(c=>({value:c.id,label:z(c)})),{value:"new",label:"New floor\u2026"}],set:c=>{this.moveToFloor(e,o,c)}}))}`)}

      ${P("Floor finish",m`<div class="hme-pics">
        ${X({label:`Auto: ${ca[f]}`,picture:dn(f),on:o.finish===void 0,title:"Picked from the room's name and furniture",click:()=>e.apply(c=>Po(c,i,void 0))})}
        ${Hn.map(c=>X({label:ca[c],picture:dn(c),on:o.finish===c,click:()=>e.apply(w=>Po(w,i,c))}))}
      </div>
        ${this.roomColourRow(e,o,"floorColor")}
        ${this.roomColourRow(e,o,"wallColor")}
        <p class="hme-foot-hint">On the plan, the night, warm and clay looks and in 3D, here, on the iPhone and on the watch. The line looks keep their own colour.</p>`)}

      ${P("In this room",m`
        ${o.objects.length===0?m`<p class="hme-empty-line">No things. Add a sofa, a bed or stairs so the map reads.</p>`:b}
        ${o.objects.map((c,w)=>m`<div class="hme-r tight"><span class="hme-grow ${c.hidden===!0?"dim":""}">
            <button type="button" class="hme-link" title="Pick it to move, resize or turn it" @click=${()=>this.pickThing(e,o,w)}>${q(c)}</button></span>
          ${qe({on:c.hidden!==!0,onText:"Shown",offText:"Hidden",label:`${q(c)} shown`,click:()=>e.apply(v=>Rt(v,i,w,c.hidden!==!0))})}
          <button type="button" class="hme-x" aria-label=${`Remove ${q(c)}`} title="Remove" @click=${()=>e.apply(v=>it(v,i,w))}>×</button></div>`)}
        <div class="hme-r tight"><span class="hme-grow">${o.openings.length===0?"No doors or windows":[...new Set(o.openings.map(be))].join(", ")}</span>
          <button type="button" class="hme-link" title="Edit this room's corners, walls, doors and windows (or double-click the room)"
            @click=${()=>e.editWalls(i)}>Edit walls ›</button></div>
        ${d.length===0?m`<div class="hme-r tight"><span class="hme-grow dim">No devices. Drag one from Not on the map.</span></div>`:b}
        ${d.map(c=>m`<div class="hme-r tight"><span class="hme-grow">
          <button type="button" class="hme-link" title="Pick it to set its height, glow and tap" @click=${()=>e.select({kind:"pin",pinId:c.id})}>${B(c,e.hass)}</button></span>
          <span class="hme-val">${te(c.entityId,e.toggles.live?e.hass?.states:void 0)}</span></div>`)}
        <div class="hme-row-end">
          ${rn({label:"\uFF0B Add a thing",cls:"hme-tb",options:ai.map(c=>({value:c,label:ut(c)})),pick:c=>{let w=V(o)??J(o);e.apply(v=>ri(v,i,c,w))}})}
          ${this.addFurnitureButton(e,o,"hme-tb")}
          <button type="button" class="hme-tb danger push" @click=${()=>{this.askDelete(e,o)}}>Delete room</button>
        </div>`)}`}edits(e){return t=>({set:o=>e.apply(n=>t(n,o)),preview:o=>e.preview(o===void 0?void 0:n=>t(n,o))})}thingInspector(e,t){let{room:o,index:n,object:i}=t,a=o.id,r=q(i),[d,l,p]=i.size,h=or(i),u=this.edits(e),f={kind:"room",roomId:a},g={unit:"m",min:ze,max:Ot};return m`
      <section class="hme-card hme-head">
        <div class="hme-head-t">
          <strong>${r}</strong>
          <span>In ${T(o)} · ${d.toFixed(2)} × ${l.toFixed(2)} × ${p.toFixed(2)} m${(i.lift??0)>0?` \xB7 ${(i.lift??0).toFixed(2)} m up`:""}${i.hidden===!0?" \xB7 Hidden":""}</span>
        </div>
      </section>

      ${this.modelCard(e,t)}

      ${this.coloursCard(e,t)}

      ${P("Size",m`
        ${gt(O({tag:"W",label:"Width",value:d,...g,...u((c,w)=>at(c,a,n,{width:w}))}),O({tag:"D",label:"Depth",value:l,...g,...u((c,w)=>at(c,a,n,{depth:w}))}),O({tag:"H",label:"Height",value:p,...g,min:.01,...u((c,w)=>To(c,a,n,{size:[d,l,w]}))}))}`)}

      ${P("Place",m`
        ${bt("Middle, and up off the floor",gt(O({tag:"X",label:"Middle across",value:i.c[0],unit:"m",...u((c,w)=>Fe(c,a,n,[w,i.c[1]]))}),O({tag:"Y",label:"Middle down",value:i.c[1],unit:"m",...u((c,w)=>Fe(c,a,n,[i.c[0],w]))}),O({tag:"Z",label:"Up off the floor",value:i.lift??0,unit:"m",min:0,max:100,...u((c,w)=>To(c,a,n,{lift:w}))})))}
        ${bt("Turn",m`<div class="hme-turn">
          ${O({label:"Turn",value:h,unit:"\xB0",digits:1,min:-180,max:180,...u((c,w)=>Te(c,a,n,w-h))})}
          <button type="button" class="hme-tb" title="Turn it a quarter one way" @click=${()=>e.apply(c=>Te(c,a,n,-90))}>−90°</button>
          <button type="button" class="hme-tb" title="Turn it a quarter the other way" @click=${()=>e.apply(c=>Te(c,a,n,90))}>+90°</button>
          <button type="button" class="hme-tb" title="Turn it square with the room's walls" @click=${()=>e.apply(c=>Io(c,a,n))}>Line up</button>
        </div>`)}
        <p class="hme-foot-hint">Drag a number sideways to change it (Shift for big steps, Alt for fine ones), or click it to type. On the plan, drag the thing to move it, a square handle to resize it, the round one to turn it.</p>`)}

      ${P("Show",m`
        <div class="hme-r tight"><span class="hme-grow">On the map, the tiles and the watch</span>
          ${qe({on:i.hidden!==!0,onText:"Shown",offText:"Hidden",label:`${r} shown`,click:()=>e.apply(c=>Rt(c,a,n,i.hidden!==!0))})}</div>
        <p class="hme-foot-hint">Scan Again on the iPhone puts the room's things back where the scan finds them. A hidden thing stays hidden.</p>
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${()=>e.select(f)}>‹ ${T(o)}</button>
          <button type="button" class="hme-tb danger push" @click=${()=>e.apply(c=>it(c,a,n),{select:f})}>Remove</button>
        </div>`)}`}manyInspector(e,t){let o=vt(t),n=[...new Set(t.map(r=>T(r.room)))],i=oe(t.map(r=>r.object.hidden===!0)),a=er.filter(r=>t.some(d=>un(d.object).includes(r)));return m`
      <section class="hme-card hme-head">
        <div class="hme-head-t">
          <strong>${I(t.length,"thing")}</strong>
          <span>${ua(t)} · in ${n.join(", ")}</span>
        </div>
      </section>

      ${P("Picked",m`${t.map(r=>m`<div class="hme-list-row hme-pick-row">
          <button type="button" class="hme-grow hme-link ${r.object.hidden===!0?"dim":""}" title="Pick this one alone"
            @click=${()=>this.pickThing(e,r.room,r.index)}>${q(r.object)}</button>
          <span class="hme-val">${T(r.room)}</span>
          <button type="button" class="hme-x" aria-label=${`Leave ${q(r.object)} out of the pick`} title="Leave it out of the pick"
            @click=${()=>e.select(ge(e.selection,{roomId:r.room.id,object:r.index}))}>×</button></div>`)}
        <p class="hme-foot-hint">Cmd or Ctrl and a click on the plan or in 3D adds a thing or takes one away. The arrow keys move them all.</p>`,String(t.length))}

      ${a.length===0?b:P("Colours",m`
        ${a.map(r=>this.manyColourRow(e,t,r))}
        <p class="hme-foot-hint">Set on every picked thing whose piece has that part. In the 3D view and on the iPhone.</p>`)}

      ${P("Show",m`
        <div class="hme-r tight"><span class="hme-grow">On the map, the tiles and the watch</span>
          ${i.mixed?m`<button type="button" class="hme-chip off" aria-pressed="mixed" aria-label="Shown" title="Some are hidden: show them all"
                @click=${()=>e.apply(r=>Dt(r,o,!1))}>Mixed</button>`:qe({on:!i.value,onText:"Shown",offText:"Hidden",label:"Shown",click:()=>e.apply(r=>Dt(r,o,!i.value))})}</div>
        <div class="hme-row-end">
          <button type="button" class="hme-tb danger push" @click=${()=>{this.askDeleteThings(e,t)}}>Delete ${I(t.length,"thing")}</button>
        </div>`)}`}manyColourRow(e,t,o){let n=t.filter(r=>un(r.object).includes(o)),i=vt(n),a=oe(n.map(r=>r.object[o]?.toUpperCase()));return cn({word:o==="fabric"?"Fabric":"Wood",presets:o==="fabric"?Ko:Bo,now:a.mixed?void 0:a.value,mixed:a.mixed,defaultTitle:"Each model's own colour",customTitle:`Any ${o} colour`,customLabel:`Pick a ${o} colour for every picked thing`,set:r=>e.apply(d=>So(d,i,o,r)),preview:r=>e.preview(r===void 0?void 0:d=>So(d,i,o,r)??d)})}modelCard(e,t){let{room:o,index:n,object:i}=t,a=Wt(i),r=st(i.model),d=r!==void 0?`${r.group}, picked from the catalog`:i.model!==void 0?a===void 0?"A piece this panel does not know yet":`A piece this panel does not know yet, drawn as the ${a.name.toLowerCase()} meanwhile`:a!==void 0?`Picked by its kind: ${ut(i.kind)}`:"A plain box, as the scan found it";return P("Model",m`<div class="hme-model">
        ${this.piecePic(e,a,"hme-model-pic")}
        <div class="hme-model-t"><strong>${a?.name??"Plain box"}</strong><span>${d}</span></div>
        <button type="button" class="hme-tb push" title="Pick another piece from the furniture catalog; it keeps its place, size and turn"
          @click=${()=>this.openPicker(e,o,n)}>Change…</button>
      </div>
      <p class="hme-foot-hint">What it looks like in the 3D view and on the iPhone. The flat plan and the tiles draw it as before.</p>`)}coloursCard(e,t){let o=un(t.object);return o.length===0?b:P("Colours",m`
      ${o.map(n=>this.colourRow(e,t,n))}
      <p class="hme-foot-hint">In the 3D view and on the iPhone. The flat plan, the tiles and the furniture picker keep the model's own colours.</p>`)}colourRow(e,t,o){let{room:n,index:i,object:a}=t,r=n.id;return cn({word:o==="fabric"?"Fabric":"Wood",presets:o==="fabric"?Ko:Bo,now:a[o],defaultTitle:"The model's own colour",customTitle:`Any ${o} colour`,customLabel:`Pick a ${o} colour`,set:l=>e.apply(p=>Co(p,r,i,o,l)),preview:l=>e.preview(l===void 0?void 0:p=>Co(p,r,i,o,l)??p)})}roomColourRow(e,t,o){let n=t.id,i=o==="floorColor";return cn({word:i?"Floor":"Walls",presets:i?qa[Le(t)]:Ya,now:t[o],defaultTitle:i?"The finish's own colour":"The look's own wall colour",customTitle:i?"Any floor colour":"Any wall colour",customLabel:i?"Pick a floor colour":"Pick a wall colour",set:a=>e.apply(r=>Eo(r,n,o,a)),preview:a=>e.preview(a===void 0?void 0:r=>Eo(r,n,o,a)??r)})}floorCard(e,t){let o=kt(t,e.toggles.live?e.hass?.states:void 0);return m`${P("Floor",m`
        ${D("Name",Xe({value:t.name,label:"Floor name",placeholder:z(t),set:n=>e.apply(i=>It(i,t.id,n))}))}
        ${D("On it",m`<span class="hme-val">${I(t.rooms.length,"room")} · ${I(t.pins.length,"device")} · ${xt(o)}</span>`)}`)}
      ${P("Edit",m`<p class="hme-text">Click picks what is on top: a device, then a thing (a sofa, a TV, a desk), then the room under them. Drag it to move it.</p>
        <p class="hme-text dim">A dragged room lines up with the walls of the rooms round it. Drag the round handle above it to turn it, or a square handle on its box to resize it. Undo with ${ia()}.</p>
        <p class="hme-text dim">Double-click a room to edit its walls, doors and windows. Drag a device from Not on the map onto the plan to place it; Shift, Cmd or Ctrl and a click picks several. Cmd or Ctrl and a click picks several things too, to colour or hide them together.</p>`)}`}};var nr=15,io=Math.PI/4,fn=8,ye="#ffbf55",H=s=>s.toFixed(1);function ir(s,e){return`${Wi(s.domain)} \xB7 ${te(s.entityId,e)}`}function ar(s,e){let t=Q(s,e);if(t===void 0)return"Not in a room";let o=W(s,e.at);return o!==void 0&&M(o.id,t.id)?`${T(t)} (found by place)`:T(t)}function rr(s,e,t){return s.icon!==void 0?Ut[s.icon]:`Auto (${Ut[Be(s.entityId,e,t)].toLowerCase()})`}var ba={ceiling:"Ceiling",floor:"Floor",table:"Table",wall:"Wall",bulb:"Just a bulb"},Ma="wa-home-map-lamp-choice";function $a(){try{return globalThis.localStorage??void 0}catch{return}}function sr(){try{let s=$a()?.getItem(Ma);return St.includes(s)?s:void 0}catch{return}}function dr(s){try{$a()?.setItem(Ma,s)}catch{}}var ao=s=>s.startsWith("light."),lr=16,va=8,ro=class{constructor(e){this.picture=e;this.side=!0;this.names=!1;this.moving=!1;this.iconsOpen=!1;this.pickPage=!1;this.chooserFocus=!1}states(e){return e.toggles.live?e.hass?.states:void 0}picked(e){let t=e.selection;return t?.kind==="pin"?e.floor.pins.find(o=>M(o.id,t.pinId)):void 0}picks(e){return se(e.selection).flatMap(t=>e.floor.pins.filter(o=>M(o.id,t)))}deviceClass(e,t){let o=e.hass?.states?.[t]?.attributes?.device_class;return typeof o=="string"?o:void 0}friendly(e,t){let o=e.hass?.states?.[t]?.attributes?.friendly_name;return typeof o=="string"&&o.trim()!==""?o.trim():void 0}place(e,t,o,n){let i=Yo(e.doc,t);if(i!==void 0)return M(i.floorId,e.floor.id)||e.setFloor(i.floorId),e.select({kind:"pin",pinId:i.pinId}),!1;let a=Zo(e.floor,n),r=o??(a===void 0?Re(e.view,[e.stage.width/2,e.stage.height/2]):V(a)??J(a)),d=e.newId().toUpperCase(),l=e.floor.id,p=this.friendly(e,t),h=e.apply(u=>$i(u,l,{id:d,entityId:t,at:[r[0],r[1]],...p===void 0?{}:{name:p}}),{select:{kind:"pin",pinId:d}});return h||e.note("warn","That device could not be put on the map: the map holds at most 400 devices."),h}placeAll(e,t){let o=t.map(i=>({entityId:i.entityId,areaId:i.areaId,name:i.name,deviceClass:i.deviceClass})),n=e.floor.id;e.apply(i=>Ii(i,n,o,()=>e.newId())?.doc,{select:null})}kindChips(e){let t=Bi(e.floor);return t.length===0?b:m`<div class="hme-chips">${t.map(o=>m`<button type="button" class="hme-chip sel ${this.filter===o.kind?"on":""}"
      aria-pressed=${this.filter===o.kind?"true":"false"} title="Dim the other kinds of device on the plan"
      @click=${()=>{this.filter=this.filter===o.kind?void 0:o.kind,e.redraw()}}>${o.label} ${o.count}</button>`)}</div>`}deviceRow(e,t,o){let n=ao(t.entityId),i=n?void 0:Yo(e.doc,t.entityId),a=n?Pi(e.doc,t.entityId).length:0,r=Be(t.entityId,t.deviceClass,t.name),d=()=>n?this.addLight(e,t.entityId,void 0,t.areaId):this.place(e,t.entityId,void 0,t.areaId),l=n?"Drag onto the plan or onto a lamp, or click to add it in its area's room. A light can be on the map many times.":i===void 0?"Drag onto the plan, or click to put it in its area's room":"On the map: click to pick it";return m`<div class="hme-dv ${this.dragging===t.entityId?"dragging":""} ${i===void 0?"":"placed"}" role="button" tabindex="0"
      draggable=${i===void 0?"true":"false"} title=${l}
      @dragstart=${p=>{p.dataTransfer?.setData(Vt,t.entityId),n&&p.dataTransfer?.setData(Go,t.entityId),p.dataTransfer?.setData("text/plain",t.entityId),p.dataTransfer&&(p.dataTransfer.effectAllowed="copy"),this.dragging=t.entityId,e.redraw()}}
      @dragend=${()=>{this.dragging=void 0,this.dropAt=void 0,this.lampOver=void 0,e.redraw()}}
      @click=${d}
      @keydown=${p=>{p.target===p.currentTarget&&(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),d())}}>
      <span class="hme-dv-ic"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">${re(r,"currentColor",24,2)}</svg></span>
      <span class="hme-dv-nm">${t.name}<small>${i===void 0?ir(t,o):"on the map"}</small></span>
      ${a===0?b:m`<button type="button" class="hme-dv-count" title="Pick the next one on the map"
        @click=${p=>{p.stopPropagation(),this.pickNext(e,t.entityId)}}
        @keydown=${p=>p.stopPropagation()}>${a} on map</button>`}
      <span class="hme-dv-grip" aria-hidden="true">${i===void 0?"\u22EE\u22EE":"\u203A"}</span>
    </div>`}pickNext(e,t){let o=e.doc.floors.flatMap(l=>l.pins.filter(p=>p.entityId===t).map(p=>({floor:l,pin:p})));if(o.length===0)return;let n=e.selection,i=n?.kind==="pin"?n.pinId:n?.kind==="object"?Nt(e.floor,n.roomId,n.object)?.id:void 0,a=i===void 0?-1:o.findIndex(l=>M(l.pin.id,i)),r=o[(a+1)%o.length];M(r.floor.id,e.floor.id)||e.setFloor(r.floor.id);let d=me(r.floor,r.pin.id);e.select(d===void 0?{kind:"pin",pinId:r.pin.id}:{kind:"object",roomId:d.roomId,object:d.object})}addLight(e,t,o,n){let i=o===void 0?Zo(e.floor,n??Uo(e.hass,t)):void 0,a=o??(i===void 0?Re(e.view,[e.stage.width/2,e.stage.height/2]):V(i)??J(i)),r=W(e.floor,a)??i,d=sr();this.chooser={entityId:t,at:[a[0],a[1]],roomId:r?.id,choice:r===void 0?"bulb":d??"ceiling"},this.chooserFocus=!0,e.redraw()}get choosing(){return this.chooser!==void 0}cancelChooser(e){this.chooser=void 0,e.redraw()}canChoose(e){return e==="bulb"||this.chooser?.roomId!==void 0}takeChoice(e,t){let o=this.chooser;if(o===void 0)return;let n=t??o.choice;if(!this.canChoose(n))return;this.chooser=void 0,dr(n);let i=e.newId().toUpperCase(),a=e.floor.id,r=o.roomId===void 0?void 0:e.doc.floors.find(h=>M(h.id,a))?.rooms.find(h=>M(h.id,o.roomId)),d=this.friendly(e,o.entityId),l=n!=="bulb"&&r!==void 0?{kind:"object",roomId:r.id,object:r.objects.length}:{kind:"pin",pinId:i};e.apply(h=>Ei(h,a,o.roomId,o.entityId,n,o.at,i,d)?.doc,{select:l})||e.note("warn","That light could not be put on the map: the map holds at most 400 devices, and a room at most 256 things.")}chooserKey(e,t){let o=this.chooser;if(o===void 0)return!1;switch(t.key){case"Enter":return this.takeChoice(e),!0;case"Escape":return this.cancelChooser(e),!0;case"ArrowLeft":case"ArrowUp":case"ArrowRight":case"ArrowDown":{let n=St.filter(a=>this.canChoose(a)),i=t.key==="ArrowLeft"||t.key==="ArrowUp"?-1:1;return o.choice=n[(n.indexOf(o.choice)+i+n.length)%n.length]??o.choice,this.chooserFocus=!0,e.redraw(),!0}case"Delete":case"Backspace":return!0;default:return!1}}lampChooser(e){let t=this.chooser;if(t===void 0)return b;let o=e.toScreen(t.at),n=e.toScreen(e.toPlan(0,0)),i=o[0]-n[0],a=o[1]-n[1],r=344,d=globalThis.innerWidth??1/0,l=i+22+r>d?Math.max(8,i-22-r):i+22,p=t.roomId===void 0?void 0:e.floor.rooms.find(f=>M(f.id,t.roomId)),h=this.chooserFocus;this.chooserFocus=!1;let u=this.friendly(e,t.entityId)??t.entityId;return m`<div class="hme-scrim hme-lamp-scrim" @pointerdown=${f=>{f.target===f.currentTarget&&this.cancelChooser(e)}}>
      <div class="hme-lampc" role="dialog" aria-label="Which lamp is it in?" style=${`left:${Math.round(l)}px;top:${Math.round(Math.max(8,a-64))}px;width:${r}px`}
        @keydown=${f=>{this.chooserKey(e,f)&&(f.preventDefault(),f.stopPropagation())}}>
        <div class="hme-lampc-t"><strong>${u}</strong>
          <span>${p===void 0?"In no room, so just a bulb.":`In ${T(p)}. Which lamp is it in?`}</span></div>
        <div class="hme-lampc-row" role="group" aria-label="Lamp">
          ${St.map(f=>{let g=f===t.choice,c=this.canChoose(f),w=Gn[f];return m`<button type="button" class="hme-lampc-b ${g?"on":""}" aria-pressed=${g?"true":"false"} ?disabled=${!c}
              title=${c?ba[f]:"A lamp goes in a room"}
              ${Gt(v=>{h&&g&&v!==void 0&&setTimeout(()=>v.focus?.(),0)})}
              @click=${()=>this.takeChoice(e,f)}>
              ${w===void 0||this.picture===void 0?m`<span class="hme-lampc-pic bulb"><svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">${re("bulb","currentColor",24,1.8)}</svg></span>`:this.picture(e,w,"hme-lampc-pic")}
              <span>${ba[f]}</span></button>`})}
        </div>
        <p class="hme-lampc-hint">Enter takes the ringed one · Esc cancels</p>
      </div>
    </div>`}emptyLampAt(e,t,o=e.floor){let n=e.toScreen(t),i;for(let a of o.rooms)a.objects.forEach((r,d)=>{if(r.hidden===!0||ko(r.model)===void 0||Nt(o,a.id,d)!==void 0)return;let l=e.toScreen(r.c),p=Math.hypot(l[0]-n[0],l[1]-n[1]);p>lr&&!ke(He(xe(r)),t)||(i===void 0||p<i.d)&&(i={ref:{roomId:a.id,object:d},d:p})});return i?.ref}heldLampAt(e,t){let o=this.pinAt(e,e.toScreen(t));return o===void 0?void 0:me(e.floor,o.id)}lampMark(e,t){let o=e.floor.rooms.find(l=>M(l.id,t.roomId))?.objects[t.object];if(o===void 0)return b;let n=He(xe(o)).map(l=>e.toScreen(l).map(H).join(",")).join(" "),[i,a]=e.toScreen(o.c),r="Put it in this lamp",d=r.length*6.4+20;return $`<g class="hme-lamp-over" pointer-events="none">
      <circle cx=${H(i)} cy=${H(a)} r="22" fill="rgba(255,191,85,0.22)" stroke=${ye} stroke-width="2" stroke-dasharray="4 3" />
      <polygon points=${n} fill="rgba(255,191,85,0.3)" stroke=${ye} stroke-width="2" />
      <g class="hme-tag"><rect x=${H(i-d/2)} y=${H(a+28)} width=${H(d)} height="18" rx="9" fill=${ye} />
        <text x=${H(i)} y=${H(a+41)} fill="#3a2600" text-anchor="middle">${r}</text></g>
    </g>`}dragOver(e,t,o){let n=[...o.dataTransfer?.types??[]],i=this.dragging!==void 0||n.includes(Vt),a=this.dragging!==void 0?ao(this.dragging):n.includes(Go),r=this.dropAt,d=this.lampOver;return this.dropAt=i?t:void 0,this.lampOver=i&&a&&t!==void 0?this.emptyLampAt(e,t):void 0,(r!==this.dropAt||JSON.stringify(d)!==JSON.stringify(this.lampOver))&&e.redraw(),i&&t!==void 0}drop(e,t,o){let n=this.dragging??o.dataTransfer?.getData(Vt)??"";if(this.dragging=void 0,this.dropAt=void 0,this.lampOver=void 0,n===""){e.redraw();return}if(!ao(n)){this.place(e,n,t);return}let i=this.emptyLampAt(e,t);if(i===void 0){this.addLight(e,n,t);return}let a=e.newId().toUpperCase(),r=e.floor.id;e.apply(d=>jo(d,r,i.roomId,i.object,n,a),{select:{kind:"object",...i}})||e.note("warn","That light could not be put in the lamp: the map holds at most 400 devices.")}overlay(e){let t=this.states(e),o=this.picked(e),n=se(e.selection),i=[],a=this.lampOver===void 0?b:this.lampMark(e,this.lampOver);a!==b?i.push(a):this.dropAt!==void 0&&i.push(this.dropMark(e,this.dropAt));let r=o===void 0?void 0:ee(o.entityId,t);o!==void 0&&r?.kind==="light"&&i.push(this.glowRing(e,o,r.on?r.brightness:void 0));for(let d of e.floor.pins){let l=n.some(h=>M(d.id,h)),p=this.filter!==void 0&&Vo(d.entityId)!==this.filter;i.push(this.pinMark(e,d,l,p,t))}return this.box!==void 0&&i.push(this.boxMark(e,this.box)),$`${i}`}boxMark(e,t){let[o,n]=e.toScreen(t.a),[i,a]=e.toScreen(t.b);return $`<rect class="hme-box" x=${H(Math.min(o,i))} y=${H(Math.min(n,a))} width=${H(Math.abs(i-o))} height=${H(Math.abs(a-n))}
      fill="rgba(91,141,239,0.12)" stroke="#5b8def" stroke-width="1.2" stroke-dasharray="4 3" pointer-events="none" />`}pinMark(e,t,o,n,i){let[a,r]=e.toScreen(t.at),d=ee(t.entityId,i),l=d.kind==="light"&&d.on,p=l?We(t)??ye:"rgba(36,36,40,0.92)",h=l?"#fff3d6":d.kind==="gone"?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.4)",u=l?"#3a2600":d.kind==="lock"?d.locked?"#30d158":"#ff9f0a":d.kind==="other"&&d.on?"#ffffff":d.kind==="gone"?"#8e8e93":"#d1d1d6",f=t.icon??Be(t.entityId,this.deviceClass(e,t.entityId),this.friendly(e,t.entityId)),g=o?13:12,c=o||this.names?B(t,e.hass):_i(t,i),w=c===void 0?0:c.length*5.9+14;return $`<g class="hme-pin" data-hme="pin" data-pin=${t.id} transform=${`translate(${H(a)} ${H(r)})`} opacity=${n?.25:1} style="cursor:grab">
      ${o?$`<circle r="20" fill="none" stroke="#5b8def" stroke-width="2.5" />`:b}
      ${l?$`<circle r=${g+7} fill=${p} opacity="0.22" />`:b}
      <circle r=${g} fill=${p} stroke=${h} stroke-width="1.2" />
      <g transform="translate(-7 -7)">${re(f,u,14,1.5)}</g>
      ${c===void 0||c===""?b:$`<g pointer-events="none"><rect x=${H(-w/2)} y=${g+4} width=${H(w)} height="16" rx="8" fill=${o?"#5b8def":"rgba(0,0,0,0.7)"} />
        <text y=${g+15.5} fill="#fff" font-size="10" font-weight="600" text-anchor="middle">${c}</text></g>`}
    </g>`}glowRing(e,t,o){let[n,i]=e.toScreen(t.at),a=dt(t,o),r=e.px(a),d=[n+r*Math.cos(io),i+r*Math.sin(io)],l=`Glow ${a.toFixed(1)} m`,p=l.length*6.2+18,h=t.glowSpill===!0?void 0:Q(e.floor,t),u=h!==void 0&&h.outline.length>=3?h.outline.map(g=>e.toScreen(g).map(H).join(",")).join(" "):void 0,f=g=>$`<circle cx=${H(n)} cy=${H(i)} r=${H(r)} fill="none" stroke=${We(t)??"#5b8def"} stroke-width="1.4"
      stroke-dasharray="5 5" opacity=${g} pointer-events="none" />`;return $`<g class="hme-glow-ring">
      ${u===void 0?f(1):$`<clipPath id="hme-glow-walls"><polygon points=${u} /></clipPath>
        ${f(.28)}<g clip-path="url(#hme-glow-walls)">${f(1)}</g>`}
      <circle data-hme="glow" cx=${H(d[0])} cy=${H(d[1])} r="7" fill="#fff" stroke="#5b8def" stroke-width="2" style="cursor:nwse-resize">
        <title>Drag to set how far this light's glow reaches</title></circle>
      <g class="hme-tag" pointer-events="none"><rect x=${H(d[0]-p/2)} y=${H(d[1]+12)} width=${H(p)} height="18" rx="9" fill="#5b8def" />
        <text x=${H(d[0])} y=${H(d[1]+25)} fill="#fff" text-anchor="middle">${l}</text></g>
    </g>`}dropMark(e,t){let o=W(e.floor,t),[n,i]=e.toScreen(t),a=o===void 0?"Drop here, in no room":`Drop in ${T(o)}`,r=a.length*6.4+20;return $`<g class="hme-drop" pointer-events="none">
      ${o===void 0?b:$`<polygon points=${o.outline.map(d=>e.toScreen(d).map(H).join(",")).join(" ")}
        fill="rgba(91,141,239,0.18)" stroke="#5b8def" stroke-width="2" stroke-dasharray="6 4" />`}
      <circle cx=${H(n)} cy=${H(i)} r="13" fill="rgba(91,141,239,0.35)" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 2" />
      <g class="hme-tag"><rect x=${H(n-r/2)} y=${H(i+20)} width=${H(r)} height="18" rx="9" fill="#5b8def" />
        <text x=${H(n)} y=${H(i+33)} fill="#fff" text-anchor="middle">${a}</text></g>
    </g>`}pinAt(e,t){let o,n=nr;for(let i of e.floor.pins){let a=e.toScreen(i.at),r=Math.hypot(a[0]-t[0],a[1]-t[1]);r<=n&&(o=i,n=r)}return o}pointerDown(e,t,o){return t.button!==0?!1:this.pressHandle(e,t,o)||this.pressPin(e,t,o)||this.pressBox(e,t,o)}pressHandle(e,t,o){let n=this.picked(e);if(n===void 0||t.shiftKey||t.metaKey||t.ctrlKey)return!1;let i=ee(n.entityId,this.states(e));if(i.kind!=="light")return!1;let a=e.toScreen(o),[r,d]=e.toScreen(n.at),l=e.px(dt(n,i.on?i.brightness:void 0));return Math.hypot(a[0]-(r+l*Math.cos(io)),a[1]-(d+l*Math.sin(io)))>10?!1:(this.glowDrag(e,t,n),!0)}onPin(e,t){return this.pinAt(e,e.toScreen(t))!==void 0}pressBox(e,t,o){return t.shiftKey?(this.boxDrag(e,t,o),!0):!1}pressPin(e,t,o){let n=t.shiftKey||t.metaKey||t.ctrlKey,i=this.pinAt(e,e.toScreen(o));if(i===void 0)return!1;if(this.pickPage=!1,this.iconsOpen=!1,n)return e.select(Se(e.selection,i.id)),!0;let a=se(e.selection);return a.length>1&&a.some(r=>M(r,i.id))?(this.groupDrag(e,t,a,i.id,o),!0):(e.select({kind:"pin",pinId:i.id}),this.moveDrag(e,t,i,o),!0)}groupDrag(e,t,o,n,i){let a=[0,0],r=pt(o);e.drag(t,{move:d=>{this.moving=!0,a=[d[0]-i[0],d[1]-i[1]];let[l,p]=a;e.preview(h=>zt(h,o,l,p))},end:(d,l,p)=>{this.moving=!1,e.preview(void 0);let[h,u]=a;p?Math.hypot(h,u)>=.005&&e.apply(f=>zt(f,o,h,u),r===void 0?{}:{select:r}):e.select({kind:"pin",pinId:n})},cancel:()=>this.stopDrag(e)})}stopDrag(e){this.moving=!1,this.box=void 0,this.lampOver=void 0,e.preview(void 0)}boxDrag(e,t,o){let n=e.floor.pins,i=e.selection;e.drag(t,{move:a=>{this.box={a:o,b:a},e.redraw()},end:(a,r,d)=>{this.box=void 0,d?e.select(Gi(i,Ui(n,o,a))):e.redraw()},cancel:()=>this.stopDrag(e)})}async removePicks(e,t){t.length!==0&&(t.length>1&&!await e.confirm({title:`Remove ${I(t.length,"device")} from the map?`,text:"They go back to Not on the map. Undo puts them back where they were.",ok:"Remove",danger:!0})||e.apply(o=>Hi(o,t),{select:null}))}moveDrag(e,t,o,n){let i=o.id,a=e.floor,r=a.id,d=[o.at[0],o.at[1]],l=ao(o.entityId)&&me(a,i)===void 0,p=d;e.drag(t,{move:h=>{this.moving=!0,p=[d[0]+h[0]-n[0],d[1]+h[1]-n[1]];let u=l?this.emptyLampAt(e,p,a):void 0;this.lampOver=u,e.preview(u===void 0?f=>_o(f,i,p):f=>zo(f,r,u.roomId,u.object,i))},end:(h,u,f)=>{let g=this.lampOver;this.moving=!1,this.lampOver=void 0,e.preview(void 0),f&&g!==void 0?e.apply(c=>zo(c,r,g.roomId,g.object,i),{select:{kind:"object",...g}}):f&&Math.hypot(p[0]-d[0],p[1]-d[1])>=.005&&e.apply(c=>_o(c,i,p),{select:{kind:"pin",pinId:i}})},cancel:()=>this.stopDrag(e)})}glowDrag(e,t,o){let n=o.id,i;e.drag(t,{move:a=>{this.moving=!0;let r=Math.hypot(a[0]-o.at[0],a[1]-o.at[1]);i=Math.min(Math.max(Math.round(r/.05)*.05,Ze),En);let d=i;e.preview(l=>Ce(l,n,{glow:d}))},end:()=>{this.moving=!1,e.preview(void 0);let a=i;a!==void 0&&e.apply(r=>Ce(r,n,{glow:a}))},cancel:()=>this.stopDrag(e)})}keyDown(e,t){let o=this.picks(e).map(i=>i.id);if(o.length===0)return!1;let n=Z(t,!1);if(n==="delete")return this.removePicks(e,o),!0;if(typeof n=="object"&&"nudge"in n){let[i,a]=n.nudge;return e.apply(r=>zt(r,o,i,a)),!0}return!1}leave(){this.dragging=void 0,this.dropAt=void 0,this.box=void 0,this.moving=!1,this.iconsOpen=!1,this.pickPage=!1,this.chooser=void 0,this.lampOver=void 0,this.lightFind=void 0}dock(e){let t=(o,n,i,a)=>m`<button type="button" class="hme-tb ${n?"on":""}"
      aria-pressed=${n?"true":"false"} title=${a} @click=${()=>{i(),e.redraw()}}>${o}</button>`;return m`${t("Side view",this.side,()=>{this.side=!this.side},"The picked device's room from the side, to set its height")}
      ${t("Names",this.names,()=>{this.names=!this.names},"Every device's name under its pin")}`}stageExtra(e){let t=this.picked(e);if(!this.side||t===void 0)return b;let o=Q(e.floor,t),n=o?.height??2.5,i=$e(o?.outline??e.floor.rooms.flatMap(x=>x.outline))??{minX:t.at[0]-1,maxX:t.at[0]+1,minY:0,maxY:0},a=18,r=118,d=(r-a)/Math.max(n,.5),l=30,p=262,h=(p-l)/Math.max(i.maxX-i.minX,.5),u=x=>l+(Math.min(Math.max(x,i.minX),i.maxX)-i.minX)*h,f=t.at[2],g=r-Math.min(Math.max(f,0),n)*d,c=u(t.at[0]),w=(()=>{let x=ee(t.entityId,this.states(e));return x.kind==="light"&&x.on})(),v=[];for(let x=0;x<=n+1e-9;x+=1)v.push(x);let y=o===void 0?[]:Tn(o),E=o===void 0?"No room":T(o);return m`<div class="hme-side">
      <div class="hme-h">${E} from the side</div>
      <svg viewBox="0 0 270 130" role="img" aria-label=${`Side view: ${B(t,e.hass)} at ${f.toFixed(2)} m, the wall ${n.toFixed(1)} m tall`}
        @pointerdown=${x=>this.heightDrag(e,x,t,n,r,d)}>
        <path d=${`M${l} ${H(a)}H${p}M${l} ${r}H${p}`} stroke="#ece6da" stroke-width="3" />
        <path d=${`M${l} ${H(a)}V${r}M${p} ${H(a)}V${r}`} stroke="#ece6da" stroke-width="1.5" opacity="0.4" />
        <g font-size="9" fill="#8e8e93" text-anchor="end" class="mono">
          ${v.map(x=>$`<text x=${l-6} y=${H(r-x*d+3)}>${x===0?"0":`${x} m`}</text>
            <path d=${`M${l-4} ${H(r-x*d)}H${l}`} stroke="#8e8e93" />`)}
        </g>
        ${y.map(x=>{let C=u(x.c[0]-x.size[0]/2),F=u(x.c[0]+x.size[0]/2),A=Math.min(x.size[2],n)*d;return $`<rect x=${H(C)} y=${H(r-A)} width=${H(Math.max(F-C,2))} height=${H(A)} rx="3" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" />`})}
        <path d=${`M${H(c)} ${r}V${H(g)}`} stroke="#5b8def" stroke-width="1.2" stroke-dasharray="3 3" />
        ${w?$`<circle cx=${H(c)} cy=${H(g)} r="20" fill="#ffb648" opacity="0.22" />`:b}
        <circle cx=${H(c)} cy=${H(g)} r="9" fill=${w?ye:"#3a3a3c"} stroke="#5b8def" stroke-width="2.5" style="cursor:ns-resize" />
        <g class="hme-tag"><rect x=${H(Math.min(c+14,222))} y=${H(g-8)} width="44" height="16" rx="8" fill="#5b8def" />
          <text x=${H(Math.min(c+14,222)+22)} y=${H(g+3.5)} fill="#fff" font-size="10" text-anchor="middle">${f.toFixed(2)} m</text></g>
      </svg>
      <span class="hme-side-hint">Drag the pin up or down here.</span>
    </div>`}heightDrag(e,t,o,n,i,a){if(t.button!==0)return;let r=t.currentTarget,d=o.id,l=f=>{let g=r.getBoundingClientRect(),c=(f.clientY-g.top)*130/Math.max(g.height,1);return Math.min(Math.max(Math.round((i-c)/a/.05)*.05,0),n)},p=l(t);try{r.setPointerCapture(t.pointerId)}catch{}this.moving=!0,e.preview(f=>he(f,d,p));let h=f=>{p=l(f);let g=p;e.preview(c=>he(c,d,g))},u=()=>{r.removeEventListener("pointermove",h),r.removeEventListener("pointerup",u),r.removeEventListener("pointercancel",u),this.moving=!1,e.preview(void 0);let f=p;Math.abs(f-o.at[2])>=.005&&e.apply(g=>he(g,d,f))};r.addEventListener("pointermove",h),r.addEventListener("pointerup",u),r.addEventListener("pointercancel",u)}pill(e){let t=this.picks(e);if(t.length>1&&!this.moving)return this.groupPill(e,t);let o=this.picked(e);if(o===void 0||this.moving)return b;let n=o.id,i=o.entityId.startsWith("light."),a=Q(e.floor,o)!==void 0;return m`<span class="hme-pill-name">${B(o,e.hass)}</span>
      ${Yt(o.entityId)&&e.hass!==void 0?m`<button type="button" class="hme-tb" @click=${()=>this.toggle(e,o.entityId)}>${Zt(o.entityId,e.hass.states)}</button>`:b}
      ${i?m`<button type="button" class="hme-tb" title="Every light on this floor at this light's height" @click=${()=>e.apply(r=>ki(r,n))}>Same height for all lights</button>`:b}
      ${a?m`<button type="button" class="hme-tb" @click=${()=>e.apply(r=>xi(r,n))}>Center in room</button>`:b}
      <button type="button" class="hme-tb danger" @click=${()=>e.apply(r=>Fo(r,n),{select:null})}>Remove</button>`}groupPill(e,t){let o=t.map(d=>d.id),n=t[0],i=n.at[2],a=t.every(d=>Math.abs(d.at[2]-i)<.005),r=e.hass===void 0?void 0:Vi(t.map(d=>d.entityId),e.hass.states);return m`<span class="hme-pill-name">${I(t.length,"device")}</span>
      ${r===void 0?b:m`<button type="button" class="hme-tb" @click=${()=>this.turn(e,t.map(d=>d.entityId),r.service)}>${r.words}</button>`}
      <button type="button" class="hme-tb" ?disabled=${a} title=${a?"They are all at one height":`Every picked device at ${B(n,e.hass)}'s height, ${i.toFixed(2)} m`}
        @click=${()=>e.apply(d=>Ke(d,o,i))}>Same height</button>
      <button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(e,o)}}>Remove</button>`}toggle(e,t){let o=e.hass;o!==void 0&&fo(o,"homeassistant","toggle",{entity_id:t}).catch(n=>{e.note("err",`Could not turn it on or off: ${n instanceof Error?n.message:String(n)}`)})}turn(e,t,o){let n=e.hass;n!==void 0&&fo(n,"homeassistant",o,{entity_id:[...t]}).catch(i=>{e.note("err",`Could not turn them ${o==="turn_on"?"on":"off"}: ${i instanceof Error?i.message:String(i)}`)})}inspector(e){let t=this.picks(e);if(t.length>1)return this.groupInspector(e,t);let o=this.picked(e);if(o===void 0)return b;let n=e.hass?.states,i=o.id,a=ee(o.entityId,n),r=a.kind==="light"&&a.on,d=this.friendly(e,o.entityId),l=this.deviceClass(e,o.entityId),p=Be(o.entityId,l,d),h=o.icon??p,f=Q(e.floor,o)?.height??2.5,g=v=>e.apply(y=>Ce(y,i,v,d)),w=We(o)??ye;return m`
      <section class="hme-card hme-head">
        <span class="hme-pin-big ${r?"lit":""}" style=${r?`background:${w};box-shadow:0 0 24px ${w}80`:""}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${re(h,r?"#3a2600":"#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${B(o,e.hass)}</strong>
          <span class="mono">${o.entityId}</span>
        </div>
        <span class="hme-state ${r?"lit":""}">${te(o.entityId,n)}</span>
      </section>

      ${P("On the map",m`
        ${D("Name",Xe({value:o.name??"",label:"Name on the map",placeholder:d??o.entityId,set:v=>g({name:v.trim()===""?null:v})}))}
        ${D("Icon",m`<button type="button" class="hme-in hme-icon-btn" aria-haspopup="true" aria-expanded=${this.iconsOpen?"true":"false"}
          @click=${()=>{this.iconsOpen=!this.iconsOpen,e.redraw()}}>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">${re(h,"currentColor",24,2)}</svg>
          <span class="hme-grow">${rr(o,l,d)}</span><span class="hme-caret" aria-hidden="true">▾</span></button>`)}
        ${this.iconsOpen?this.iconMenu(e,o,p,g):b}
        ${D("Room",m`<span class="hme-in hme-ro">${ar(e.floor,o)}</span>`)}
        <div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
          ${X({label:"None",picture:Ye("none",w),on:o.reading==="none",click:()=>g({reading:"none"})})}
          ${X({label:"Pill",picture:Ye("pill",w),on:o.reading===void 0,title:"Its reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>g({reading:null})})}
          ${X({label:"Name",picture:Ye("name",w),on:o.reading==="name",click:()=>g({reading:"name"})})}
        </div></div>`)}

      ${P("Height",m`
        <div class="hme-r">
          <input class="hme-range" type="range" min="0" max=${f} step="0.05" .value=${N(String(o.at[2]))} aria-label="Height" style=${Ae(o.at[2],0,f)}
            @input=${v=>{let y=Number(v.target.value);e.preview(E=>he(E,i,y))}}
            @change=${v=>{let y=Number(v.target.value);e.apply(E=>he(E,i,y))}} />
          ${O({label:"Height",value:o.at[2],unit:"m",min:0,max:100,width:"92px",set:v=>e.apply(y=>he(y,i,v))})}
        </div>
        <div class="hme-chips">${Xo.map(([v,y])=>m`<button type="button" class="hme-chip sel ${Math.abs(o.at[2]-y)<.005?"on":""}"
          @click=${()=>e.apply(E=>he(E,i,y))}>${v} ${y}</button>`)}</div>
        <p class="hme-text dim">The model looks stand the pin at this height.</p>`)}

      ${o.entityId.startsWith("light.")?this.lightCard(e,o,a.kind==="light"&&a.on?a.brightness:void 0,g):b}

      ${this.tapCard(e,o,g)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>e.apply(v=>Fo(v,i),{select:null})}>Remove from the map</button></div>`}iconMenu(e,t,o,n){let i=r=>{this.iconsOpen=!1,n({icon:r}),e.redraw()},a=(r,d,l,p)=>m`<button type="button" class="hme-icon-cell ${l?"on":""}"
      title=${d} aria-label=${d} aria-pressed=${l?"true":"false"} @click=${()=>i(p)}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">${re(r,"currentColor",24,1.9)}</svg><span>${d}</span></button>`;return m`<div class="hme-icons" role="group" aria-label="Icon">
      ${a(o,"Auto",t.icon===void 0,null)}
      ${Pn.map(r=>a(r,Ut[r],t.icon===r,r))}
    </div>`}lightCard(e,t,o,n){return P("Light",this.glowRows(e,t,o,n))}glowRows(e,t,o,n){let i=t.id,a=dt(t,o),r=We(t),d=(l,p,h)=>m`<button type="button" class="hme-chip sel ${p?"on":""}" aria-pressed=${p?"true":"false"} @click=${h}>${l}</button>`;return m`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        <input class="hme-range" type="range" min=${Ze} max=${Math.max(fn,a)} step="0.05" .value=${N(String(a))} aria-label="Glow size"
          style=${Ae(a,Ze,Math.max(fn,a))}
          @input=${l=>{let p=Number(l.target.value);e.preview(h=>Ce(h,i,{glow:p}))}}
          @change=${l=>n({glow:Number(l.target.value)})} />
        <span class="hme-val mono hme-w48">${a.toFixed(1)} m</span></div>
      <div class="hme-row-end indent">${d("By its brightness",t.glow===void 0,()=>n({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${d("Follow the light",t.glowColor===void 0,()=>n({glowColor:null}))}
        ${d("Warm",t.glowColor==="warm",()=>n({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${r!==void 0?"on":""}">${r===void 0?b:m`<span class="hme-swatch" style=${`background:${r}`}></span>`}Pick
          ${ft({value:r??"#ffb648",label:"Pick the glow's color",preview:l=>e.preview(l===void 0?void 0:p=>Ce(p,i,{glowColor:l})??p),set:l=>n({glowColor:l})})}</label>
      </div></div>
      ${wa(t.glowSpill===!0?"off":"on",l=>n({glowSpill:l?null:!0}))}
      ${K("The pool of light round this light on the plan and the tiles. Warm is the lamplight every light has without a color of its own.")}`}lampCards(e,t,o){let n=e.floor.rooms.find(x=>M(x.id,t)),i=n?.objects[o];if(n===void 0||i===void 0||ko(i.model)===void 0)return b;let a=e.floor.id,r=`${n.id}/${o}`.toUpperCase(),d=Nt(e.floor,n.id,o);if(d===void 0){let x=this.lightFind?.key===r?this.lightFind.query:"";return P("Light",m`
        ${D("Light",m`<span class="hme-in hme-ro dim">None</span>`)}
        ${this.lightSearch(e,n,r,x,void 0,C=>{let F=e.newId().toUpperCase();this.lightFind=void 0,e.apply(A=>jo(A,a,n.id,o,C,F),{select:{kind:"object",roomId:n.id,object:o}})||e.note("warn","That light could not be put in the lamp: the map holds at most 400 devices.")})}
        ${K("Pick the light this lamp holds, or drag one from the rail onto it.")}`)}let l=e.hass?.states,p=d.id,h=ee(d.entityId,l),u=h.kind==="light"&&h.on,f=this.friendly(e,d.entityId),g=x=>e.apply(C=>Ce(C,p,x,f)),c=d.icon??Be(d.entityId,this.deviceClass(e,d.entityId),f),w=We(d)??ye,v=this.lightFind?.key===r,y=e.doc.floors.find(x=>M(x.id,a))?.rooms.find(x=>M(x.id,n.id)),E=()=>{let x=e.newId().toUpperCase(),C=y===void 0?null:{kind:"object",roomId:n.id,object:y.objects.length};e.apply(F=>Ci(F,a,n.id,o,x)?.doc,{select:C})||e.note("warn","Another lamp could not be added: the map holds at most 400 devices, and a room at most 256 things.")};return m`${P("Light",m`
        <div class="hme-lamp-light">
          <span class="hme-pin-big ${u?"lit":""}" style=${u?`background:${w};box-shadow:0 0 24px ${w}80`:""}>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${re(c,u?"#3a2600":"#d1d1d6",24,2)}</svg></span>
          <div class="hme-head-t hme-grow">
            <strong>${B(d,e.hass)}</strong>
            <span class="mono">${d.entityId}</span>
          </div>
          <span class="hme-state ${u?"lit":""}">${te(d.entityId,l)}</span>
        </div>
        ${D("Name",Xe({value:d.name??"",label:"Name on the map",placeholder:f??d.entityId,set:x=>g({name:x.trim()===""?null:x})}))}
        ${D("Light",m`<span class="hme-in hme-ro mono">${d.entityId}</span>`,m`<button type="button" class="hme-tb" aria-expanded=${v?"true":"false"} title="Show another of the home's lights in this lamp"
            @click=${()=>{this.lightFind=v?void 0:{key:r,query:""},e.redraw()}}>${v?"Cancel":"Change\u2026"}</button>`)}
        ${v?this.lightSearch(e,n,r,this.lightFind.query,d.entityId,x=>{this.lightFind=void 0,e.apply(C=>Si(C,p,x))||e.redraw()}):b}
        ${this.glowRows(e,d,u?h.brightness:void 0,g)}
        <div class="hme-row-end">
          ${Yt(d.entityId)&&e.hass!==void 0?m`<button type="button" class="hme-tb" @click=${()=>this.toggle(e,d.entityId)}>${Zt(d.entityId,l)}</button>`:b}
          <button type="button" class="hme-tb" title="Another of this lamp beside it, holding the same light: a light group in many lamps" @click=${E}>Add another</button>
          <button type="button" class="hme-tb push" title="The lamp lets go of the light; both stay where they are" @click=${()=>e.apply(x=>Ti(x,a,n.id,o))}>Unlink</button>
        </div>
        <p class="hme-foot-hint">The light sits in the lamp: move, lift or turn the lamp and the light goes with it.</p>`)}
      ${this.tapCard(e,d,g)}`}lightSearch(e,t,o,n,i,a){let r=Xt(e.hass).filter(p=>p.domain==="light"&&p.entityId!==i),d=n.trim()===""?[...r.filter(p=>t.areaId!==void 0&&p.areaId===t.areaId),...r.filter(p=>t.areaId===void 0||p.areaId!==t.areaId)].slice(0,va):qt(r,n,va),l=e.hass?.states;return m`<div class="hme-light-find">
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find a light" aria-label="Find a light" .value=${N(n)}
          @input=${p=>{this.lightFind={key:o,query:p.target.value},e.redraw()}} /></label>
      ${d.length===0?m`<p class="hme-empty-line">${r.length===0?"Home Assistant has no lights.":"No light by that name."}</p>`:d.map(p=>m`<button type="button" class="hme-list-row hme-light-row" title=${`Put ${p.name} in this lamp`} @click=${()=>a(p.entityId)}>
          <span class="hme-grow">${p.name}<small class="mono">${p.entityId}</small></span>
          <span class="hme-val">${te(p.entityId,l)}</span></button>`)}
    </div>`}groupInspector(e,t){let o=e.hass?.states,n=t.map(h=>h.id),i=h=>{e.apply(u=>jt(u,n,h))||e.note("warn","That could not be set on every picked device.")},a=Math.max(2.5,...t.map(h=>Q(e.floor,h)?.height??2.5)),r=oe(t.map(h=>h.at[2])),d=oe(t.map(h=>h.reading)),l=t.every(h=>h.entityId.startsWith("light.")),p=ye;return m`
      <section class="hme-card hme-head">
        <span class="hme-pin-big"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">${re("bulb","#d1d1d6",24,2)}</svg></span>
        <div class="hme-head-t hme-grow">
          <strong>${I(t.length,"device")}</strong>
          <span>Shift, Cmd or Ctrl and a click adds or takes one away</span>
        </div>
      </section>

      ${P("Picked",m`${t.map(h=>m`<div class="hme-list-row hme-pick-row">
          <button type="button" class="hme-grow hme-link" title="Pick this one alone" @click=${()=>e.select({kind:"pin",pinId:h.id})}>${B(h,e.hass)}</button>
          <span class="hme-val">${te(h.entityId,o)}</span>
          <button type="button" class="hme-x" aria-label=${`Leave ${B(h,e.hass)} out of the pick`} title="Leave it out of the pick"
            @click=${()=>e.select(Se(e.selection,h.id))}>×</button></div>`)}`,String(t.length))}

      ${P("On the map",m`
        <div class="hme-r top"><span class="hme-l">Reading</span><div class="hme-pics">
          ${X({label:"None",picture:Ye("none",p),on:!d.mixed&&d.value==="none",click:()=>i({reading:"none"})})}
          ${X({label:"Pill",picture:Ye("pill",p),on:!d.mixed&&d.value===void 0,title:"Each one's reading, as 21.5\xB0, 52% or 627 W, when it has one",click:()=>i({reading:null})})}
          ${X({label:"Name",picture:Ye("name",p),on:!d.mixed&&d.value==="name",click:()=>i({reading:"name"})})}
        </div></div>
        ${d.mixed?K("Mixed: they show different things. Pick one to set them all."):b}`)}

      ${P("Height",m`
        <div class="hme-r">
          ${ya({label:"Height",value:r.mixed?void 0:r.value,min:0,max:a,step:.05,preview:h=>e.preview(u=>Ke(u,n,h)),set:h=>e.apply(u=>Ke(u,n,h))})}
          ${O({label:"Height",value:r.mixed?void 0:r.value,unit:"m",min:0,max:100,width:"92px",set:h=>e.apply(u=>Ke(u,n,h))})}
        </div>
        <div class="hme-chips">${Xo.map(([h,u])=>m`<button type="button" class="hme-chip sel ${t.every(f=>Math.abs(f.at[2]-u)<.005)?"on":""}"
          @click=${()=>e.apply(f=>Ke(f,n,u))}>${h} ${u}</button>`)}</div>
        <p class="hme-text dim">Every picked device at this height.</p>`)}

      ${l?this.groupLightCard(e,t,i):b}

      ${this.groupTapCard(e,t,i)}

      <div class="hme-row-end"><button type="button" class="hme-tb danger" @click=${()=>{this.removePicks(e,n)}}>Remove ${I(t.length,"device")} from the map</button></div>`}groupLightCard(e,t,o){let n=t.map(g=>g.id),i=this.states(e),a=t.map(g=>{let c=ee(g.entityId,i);return Math.round(dt(g,c.kind==="light"&&c.on?c.brightness:void 0)*20)/20}),r=oe(a),d=Math.max(fn,...a),l=t.every(g=>g.glow===void 0),p=oe(t.map(g=>g.glowColor?.toLowerCase())),h=oe(t.map(g=>g.glowSpill===!0)),u=p.mixed||p.value===void 0||p.value==="warm"?void 0:p.value,f=(g,c,w)=>m`<button type="button" class="hme-chip sel ${c?"on":""}" aria-pressed=${c?"true":"false"} @click=${w}>${g}</button>`;return P("Light",m`
      <div class="hme-r"><span class="hme-l">Glow size</span>
        ${ya({label:"Glow size",value:r.mixed?void 0:r.value,min:Ze,max:d,step:.05,preview:g=>e.preview(c=>jt(c,n,{glow:g})),set:g=>o({glow:g})})}
        <span class="hme-val mono hme-w48">${r.mixed?"Mixed":`${r.value.toFixed(1)} m`}</span></div>
      <div class="hme-row-end indent">${f("By its brightness",l,()=>o({glow:null}))}</div>
      <div class="hme-r"><span class="hme-l">Glow color</span><div class="hme-chips">
        ${f("Follow the light",!p.mixed&&p.value===void 0,()=>o({glowColor:null}))}
        ${f("Warm",!p.mixed&&p.value==="warm",()=>o({glowColor:"warm"}))}
        <label class="hme-chip sel hme-pick ${u!==void 0?"on":""}">${u===void 0?b:m`<span class="hme-swatch" style=${`background:${u}`}></span>`}Pick
          ${ft({value:u??"#ffb648",label:"Pick the glow's color for every picked light",preview:g=>e.preview(g===void 0?void 0:c=>jt(c,n,{glowColor:g})??c),set:g=>o({glowColor:g})})}</label>
      </div></div>
      ${p.mixed?K("Mixed: their colors differ. Pick one to set them all."):b}
      ${wa(h.mixed?"mixed":h.value?"off":"on",g=>o({glowSpill:g?null:!0}))}`)}groupTapCard(e,t,o){let n=oe(t.map(l=>[l.tap,l.tap==="page"?l.pageId?.toLowerCase():void 0])),i=n.mixed?void 0:n.value,a=i?.[0]==="page"||this.pickPage,r=i?.[0]==="page"?t[0].pageId:void 0,d=l=>{if(l==="page"){e.pages.length===1?o({tap:"page",pageId:e.pages[0].id}):(this.pickPage=!0,e.redraw());return}this.pickPage=!1,o({tap:l??null})};return P("Tap on the map",m`
      <div class="hme-chips">${qo.map(([l,p])=>{let h=l==="page"?a:!this.pickPage&&i!==void 0&&i[0]===l;return m`<button type="button" class="hme-chip sel ${h?"on":""}" aria-pressed=${h?"true":"false"}
          ?disabled=${l==="page"&&e.pages.length===0} title=${l==="page"&&e.pages.length===0?"Your library has no pages":""}
          @click=${()=>d(l)}>${p}</button>`})}</div>
      ${a?D("Page",De({label:"Page",value:r??"",options:[...r===void 0?[{value:"",label:"Pick a page\u2026",disabled:!0}]:[],...r===void 0||e.pages.some(l=>M(l.id,r))?[]:[{value:r,label:"A page not in your library",disabled:!0}],...e.pages.map(l=>({value:l.id,label:l.name}))],set:l=>{this.pickPage=!1,l!==""&&o({tap:"page",pageId:l})}})):b}
      <p class="hme-text dim">${n.mixed&&!this.pickPage?"Mixed: a tap does different things on them. Pick one to set them all.":"Set on every picked device."}</p>`)}tapCard(e,t,o){let n=t.tap==="page"||this.pickPage,i=t.pageId===void 0||e.pages.some(r=>M(r.id,t.pageId)),a=r=>{if(r==="page"){if(t.tap==="page")return;e.pages.length===1?o({tap:"page",pageId:e.pages[0].id}):(this.pickPage=!0,e.redraw());return}this.pickPage=!1,o({tap:r??null})};return P("Tap on the map",m`
      <div class="hme-chips">${qo.map(([r,d])=>{let l=r==="page"?n:!this.pickPage&&t.tap===r;return m`<button type="button" class="hme-chip sel ${l?"on":""}" aria-pressed=${l?"true":"false"}
          ?disabled=${r==="page"&&e.pages.length===0} title=${r==="page"&&e.pages.length===0?"Your library has no pages":""}
          @click=${()=>a(r)}>${d}</button>`})}</div>
      ${n?D("Page",De({label:"Page",value:t.tap==="page"?t.pageId??"":"",options:[...t.tap==="page"?[]:[{value:"",label:"Pick a page\u2026",disabled:!0}],...i?[]:[{value:t.pageId,label:"A page not in your library",disabled:!0}],...e.pages.map(r=>({value:r.id,label:r.name}))],set:r=>{this.pickPage=!1,r!==""&&o({tap:"page",pageId:r})}})):b}
      <p class="hme-text dim">${t.tap===void 0&&!this.pickPage?"As the tile does: a light toggles, anything else opens its control.":"Hold on the watch or iPhone: its controls."}</p>`)}};function wa(s,e){let t=s==="on"?"walls stop the glow":s==="off"?"the glow spreads past the walls":"some stay in, some spread";return m`<div class="hme-r"><span class="hme-l">Stay in room</span>
    ${s==="mixed"?m`<button type="button" class="hme-chip off" aria-pressed="mixed" aria-label="Stay in room" @click=${()=>e(!0)}>Mixed</button>`:qe({on:s==="on",onText:"On",offText:"Off",label:"Stay in room",click:()=>e(s!=="on")})}
    <span class="hme-text dim">${t}</span></div>`}function ya(s){let e=s.value??(s.min+s.max)/2;return m`<input class="hme-range ${s.value===void 0?"mixed":""}" type="range" min=${s.min} max=${s.max} step=${s.step} .value=${N(String(e))}
    aria-label=${s.label} aria-valuetext=${s.value===void 0?"Mixed":b} style=${s.value===void 0?"--p:0%":Ae(s.value,s.min,s.max)}
    @input=${t=>{let o=t.target;o.classList.remove("mixed"),s.preview(Number(o.value))}}
    @change=${t=>s.set(Number(t.target.value))} />`}function Ye(s,e){return m`<svg width="62" height="44" viewBox="0 0 62 44" aria-hidden="true">
    <circle cx="31" cy=${s==="none"?20:16} r="9" fill=${e} />
    ${s==="pill"?$`<rect x="17" y="29" width="28" height="11" rx="5.5" fill="rgba(0,0,0,0.7)" stroke="#3a3a3c" /><text x="31" y="37.5" font-size="8" fill="#fff" text-anchor="middle">21.5°</text>`:b}
    ${s==="name"?$`<text x="31" y="38" font-size="8" fill="#fff" text-anchor="middle">Name</text>`:b}
  </svg>`}var vn=[{id:"select",label:"Corners and walls",key:"v"},{id:"split",label:"Split the room",key:"s"},{id:"inner",label:"Inner wall",key:"w"},{id:"door",label:"Door",key:"d"},{id:"window",label:"Window",key:"n"},{id:"opening",label:"Way through (no door)",key:"o"},{id:"stairs",label:"Stairs",key:"t"}];function Ta(s){return fr[s]}function pr(s){return vn.find(e=>e.key===s.toLowerCase())?.id}var hr=[{label:"Door",kind:"door"},{label:"Double door",kind:"door",style:"double"},{label:"Sliding door",kind:"door",style:"sliding"},{label:"Window",kind:"window"},{label:"Sliding window",kind:"window",style:"sliding"},{label:"Way through",kind:"opening"}],mr=["zero","one","two","three","four","five","six","seven","eight","nine","ten"];function cr(s){return s===2?"Fix both":`Fix all ${mr[s]??s}`}var ur=9,ka=18,gn="#4fd6c2",xa="Draw each room faint and dashed as the iPhone scanned it, or as first seen for a room scanned before scans were kept. A room drawn here has none.",Ha="Put this room's walls, doors, windows and furniture back as the iPhone scanned it. Its devices stay where they are.",k=s=>s.toFixed(1),Me=s=>`${s[0].toFixed(1)},${s[1].toFixed(1)}`,Pa=new WeakMap;function so(s){let e=Pa.get(s);return e===void 0&&Pa.set(s,e=wi(s)),e}function bn(s,e,t,o){if(s.walls!==void 0&&o===void 0)return;let n=t/s.view.scale,i=r=>{let d;for(let l of r)for(let[p,h]of G(l).entries()){let u=Nn(e,h);u<=n&&(d===void 0||u<d.d)&&(d={room:l,wall:p,seg:h,d:u})}return d},a=o===void 0?void 0:i([o]);return s.walls!==void 0?a:a??i(s.floor.rooms)}function Ea(s,e){let t=Math.max(le(e),1e-9),o=[-(e.b[1]-e.a[1])/t,(e.b[0]-e.a[0])/t],n=[(e.a[0]+e.b[0])/2,(e.a[1]+e.b[1])/2],i=V(s)??J(s);return(i[0]-n[0])*o[0]+(i[1]-n[1])*o[1]>0&&(o=[-o[0],-o[1]]),o}var lo=class{constructor(){this.tool="select";this.dragging=!1}setTool(e,t){this.first=void 0,this.tool=t,e.redraw()}get armed(){return this.tool!=="select"}focus(e){let t=e.walls??fe(e.selection);return t===void 0?void 0:e.floor.rooms.find(o=>M(o.id,t))}roomAt(e,t){let o=W(e.floor,t);return e.walls===void 0||o!==void 0&&M(o.id,e.walls)?o:void 0}placed(e,t,o){this.setTool(e,"select"),e.editWalls(t,o)}pickedWall(e,t){let o=e.selection;if(!(t===void 0||o===void 0)){if(o.kind==="wall")return o.wall;if(o.kind==="opening"){let n=t.openings[o.opening],i=n===void 0?-1:je(t,n);return i>=0?i:void 0}}}rail(e){let t=this.focus(e);return m`${t===void 0?b:this.wallsCard(e,t)}
      ${this.checkCard(e)}
      ${t===void 0?b:this.scanCard(e,t)}`}wallsCard(e,t){let o=G(t),n=e.selection,i=t.id,a=da(t),r=t.openings.map((l,p)=>({o:l,i:p})).filter(({o:l})=>je(t,l)<0),d=({o:l,i:p})=>{let h=n?.kind==="opening"&&n.opening===p;return m`<button type="button" class="hme-lay sub ${h?"on":""}" aria-pressed=${h?"true":"false"}
        @click=${()=>e.select({kind:"opening",roomId:i,opening:p})}>${be(l)}<span class="n">${mt(Math.hypot(l.b[0]-l.a[0],l.b[1]-l.a[1]))}</span></button>`};return m`<section class="hme-card hme-layers">
      <div class="hme-h">${T(t)}<span class="hme-h-end">${I(o.length,"wall")}</span></div>
      ${o.map((l,p)=>{let h=n?.kind==="wall"&&n.wall===p;return m`<button type="button" class="hme-lay ${h?"on":""}" aria-pressed=${h?"true":"false"}
            @click=${()=>e.select({kind:"wall",roomId:i,wall:p})}>${a[p]}<span class="n">${mt(le(l))}</span></button>
          ${t.openings.map((u,f)=>({o:u,i:f})).filter(({o:u})=>je(t,u)===p).map(d)}`})}
      ${r.length===0?b:m`<div class="hme-lay dim">In no wall</div>${r.map(d)}`}
    </section>`}scanCard(e,t){if(e.scans===void 0)return b;let o=t.id,n=go(e.scans,o),i=n!==void 0&&Ao(t,n)?n:void 0;return P("Show scan as it was",m`<div class="hme-row-end">
      <button type="button" class="hme-tb ${e.toggles.scan?"on":""}" aria-pressed=${e.toggles.scan?"true":"false"} title=${xa}
        @click=${()=>e.setToggle("scan",!e.toggles.scan)}>${e.toggles.scan?"On":"Off"}</button>
      <button type="button" class="hme-tb" ?disabled=${i===void 0} title=${i===void 0?"This room is as the iPhone scanned it, or was drawn here":Ha}
        @click=${()=>{i!==void 0&&e.apply(a=>Lo(a,o,i))}}>Back to the scan</button>
    </div>`)}checkCard(e){let t=so(e.floor),o=e.floor.id;return m`
      ${P("Scan check",m`
        ${t.length===0?m`<p class="hme-text dim">Nothing to fix. The walls meet and every room has a way in.</p>`:b}
        ${t.map(n=>m`<div class="hme-fix">
          <span class="hme-fix-dot ${n.kind==="missingDoor"?"gray":""}"></span>
          <p @click=${()=>e.select({kind:"room",roomId:n.roomIds[0]})}><b>${n.title}</b> ${n.detail}</p>
          <button type="button" class="hme-tb" @click=${()=>e.apply(i=>n.fix(i))}>${n.fixLabel}</button></div>`)}
        ${t.length>1?m`<button type="button" class="hme-tb hme-wide" @click=${()=>e.apply(n=>yi(n,o))}>${cr(t.length)}</button>`:b}`,t.length===0?void 0:m`<span class="hme-amber">${t.length} to fix</span>`)}`}overlay(e){let t=this.focus(e),o=[];if(t!==void 0&&t.outline.length>=3){let n=t.outline.map(i=>Me(e.toScreen(i))).join("L");o.push($`<path d=${`M0 0H${e.stage.width}V${e.stage.height}H0ZM${n}Z`} fill="rgba(0,0,0,0.45)" fill-rule="evenodd" pointer-events="none" />`)}return e.toggles.scan&&o.push(...this.scanMarks(e)),o.push(...this.issueMarks(e)),t!==void 0&&o.push(this.roomHandles(e,t)),o.push(...this.ghost(e)),$`${o}`}scanMarks(e){return Mi(e.floor,e.scans).map(t=>{let o=t.outline.map(i=>Me(e.toScreen(i))).join("L"),n=t.walls.map(i=>`M${Me(e.toScreen(i.a))}L${Me(e.toScreen(i.b))}`).join("");return $`<g class="hme-scan" data-room=${t.roomId} pointer-events="none">
        <path d=${`M${o}Z`} fill=${gn} fill-opacity="0.06" stroke="none" />
        <path d=${n} fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="3.5" stroke-dasharray="7 5" />
        <path d=${n} fill="none" stroke=${gn} stroke-width="1.6" stroke-dasharray="7 5" stroke-opacity="0.9" />
        ${t.openings.map(i=>{let a=e.toScreen(i.a),r=e.toScreen(i.b);return $`<line x1=${k(a[0])} y1=${k(a[1])} x2=${k(r[0])} y2=${k(r[1])} stroke=${gn} stroke-width="4" stroke-opacity="0.85"
            stroke-dasharray=${i.kind==="window"?"2 3":"none"} />`})}
      </g>`})}issueMarks(e){return so(e.floor).map(t=>{let[o,n]=e.toScreen(t.where);if(t.kind==="offSquare"){let l=/(\d+)°/.exec(t.title)?.[1]??"";return $`<g class="hme-issue" data-hme=${`issue:${t.id}`} style="cursor:pointer"><title>${t.title} Click to square it.</title>
          <circle cx=${k(o)} cy=${k(n)} r="9" fill="#ffb340" stroke="#fff" stroke-width="2" />
          <g class="hme-tag"><rect x=${k(o+12)} y=${k(n+6)} width="44" height="20" rx="10" fill="#ffb340" />
          <text x=${k(o+34)} y=${k(n+20)} fill="#2a1a00" text-anchor="middle">${l}°</text></g></g>`}let i=`${Math.round(t.amount*100)} cm`,a=t.kind==="overlap"?`Overlap ${i} \xB7 ${t.fixLabel}`:t.kind==="gap"?`Gap ${i} \xB7 ${t.fixLabel}`:`No door \xB7 ${t.fixLabel}`,r=a.length*6.2+18,d=t.kind==="missingDoor";return $`<g class="hme-issue" data-hme=${`issue:${t.id}`} style="cursor:pointer"><title>${t.title} ${t.detail}</title>
        <circle cx=${k(o)} cy=${k(n)} r="4" fill=${d?"#8e8e93":"#ffb340"} />
        <g class="hme-tag"><rect x=${k(o-r/2)} y=${k(n+8)} width=${k(r)} height="20" rx="10" fill=${d?"#8e8e93":"#ffb340"} />
        <text x=${k(o)} y=${k(n+22)} fill=${d?"#fff":"#2a1a00"} text-anchor="middle">${a}</text></g></g>`})}roomHandles(e,t){let o=G(t),n=e.selection,i=this.pickedWall(e,t),a=[];if(i!==void 0&&o[i]!==void 0){let d=o[i],l=e.toScreen(d.a),p=e.toScreen(d.b),h=Ea(t,d);if(a.push($`<line x1=${k(l[0])} y1=${k(l[1])} x2=${k(p[0])} y2=${k(p[1])} stroke="#5b8def" stroke-width="9" stroke-linecap="round" pointer-events="none" />`),n?.kind==="wall"&&!this.dragging){let u=[(l[0]+p[0])/2+h[0]*22,(l[1]+p[1])/2+h[1]*22];a.push($`<g class="hme-tag" pointer-events="none"><rect x=${k(u[0]-27)} y=${k(u[1]-9)} width="54" height="18" rx="9" fill="#5b8def" />
          <text x=${k(u[0])} y=${k(u[1]+4)} fill="#fff" text-anchor="middle">${le(d).toFixed(2)} m</text></g>`)}}for(let[d,l]of t.openings.entries()){let p=e.toScreen(l.a),h=e.toScreen(l.b),u=n?.kind==="opening"&&n.opening===d,f=l.kind==="window"?"#8bb8f0":l.kind==="door"?"#ece6da":"#98989d";a.push($`<g data-hme=${`opening:${d}`} style="cursor:ew-resize">
        <line x1=${k(p[0])} y1=${k(p[1])} x2=${k(h[0])} y2=${k(h[1])} stroke=${u?"#5b8def":"rgba(14,14,16,0.9)"} stroke-width="12" stroke-linecap="round" />
        <line x1=${k(p[0])} y1=${k(p[1])} x2=${k(h[0])} y2=${k(h[1])} stroke=${f} stroke-width="3" />
        ${u?$`<circle cx=${k(p[0])} cy=${k(p[1])} r="5" fill="#fff" stroke="#5b8def" stroke-width="2" /><circle cx=${k(h[0])} cy=${k(h[1])} r="5" fill="#fff" stroke="#5b8def" stroke-width="2" />`:b}
      </g>`)}let r=this.sliding!==void 0&&M(this.sliding.roomId,t.id)?this.sliding.index:n?.kind==="opening"?n.opening:void 0;if(r!==void 0&&t.openings[r]!==void 0&&a.push(this.distances(e,t,t.openings[r])),!this.dragging||this.sliding===void 0){if(this.tool==="select")for(let[d,l]of o.entries()){if(le(l)*e.view.scale<40)continue;let p=e.toScreen([(l.a[0]+l.b[0])/2,(l.a[1]+l.b[1])/2]);a.push($`<circle data-hme=${`mid:${d}`} cx=${k(p[0])} cy=${k(p[1])} r="5" fill="#0e0e10" stroke="#5b8def" stroke-width="1.5" style="cursor:copy"><title>Drag to add a corner</title></circle>`)}for(let[d,l]of t.outline.entries()){let[p,h]=e.toScreen(l),u=n?.kind==="corner"&&n.corner===d;a.push($`<circle data-hme=${`corner:${d}`} cx=${k(p)} cy=${k(h)} r="7" fill=${u?"#5b8def":"#fff"} stroke=${u?"#fff":"#5b8def"} stroke-width="2" style="cursor:move" />`)}}return $`<g class="hme-handles">${a}</g>`}distances(e,t,o){let n=je(t,o),i=n>=0?G(t)[n]:void 0;if(i===void 0)return $``;let a=le(i),r=Pe(o.a,i.a,i.b).along,d=Pe(o.b,i.a,i.b).along,l=Math.max(0,Math.min(r,d)),p=Math.min(a,Math.max(r,d)),h=Ea(t,i),u=[(i.b[0]-i.a[0])/a,(i.b[1]-i.a[1])/a],f=v=>{let y=e.toScreen([i.a[0]+u[0]*v,i.a[1]+u[1]*v]);return[y[0]+h[0]*26,y[1]+h[1]*26]},g=[0,l,p,a],c=v=>`M${Me([v[0]-h[0]*5,v[1]-h[1]*5])}L${Me([v[0]+h[0]*5,v[1]+h[1]*5])}`,w=[[0,l,!1],[l,p,!0],[p,a,!1]];return $`<g class="hme-dist" pointer-events="none">
      <path d=${`M${Me(f(0))}L${Me(f(a))}${g.map(v=>c(f(v))).join("")}`} stroke="#98989d" stroke-width="1" fill="none" />
      ${w.filter(([v,y])=>y-v>.02).map(([v,y,E])=>{let x=f((v+y)/2);return $`<g class="hme-tag"><rect x=${k(x[0]-25)} y=${k(x[1]-9)} width="50" height="18" rx="9" fill=${E?"#5b8def":"#2c2c2e"} />
          <text x=${k(x[0])} y=${k(x[1]+4)} fill="#fff" text-anchor="middle">${(y-v).toFixed(2)} m</text></g>`})}
    </g>`}ghost(e){let t=this.hoverAt;if(t===void 0)return[];let o=[];if(this.tool==="door"||this.tool==="window"||this.tool==="opening"){let n=bn(e,t,ka,this.focus(e));if(n!==void 0){let i=this.tool==="window"?1.2:.9,a=le(n.seg),r=Math.min(i,a),d=Math.min(Math.max(Pe(t,n.seg.a,n.seg.b).along,r/2),a-r/2),l=[(n.seg.b[0]-n.seg.a[0])/a,(n.seg.b[1]-n.seg.a[1])/a],p=e.toScreen([n.seg.a[0]+l[0]*(d-r/2),n.seg.a[1]+l[1]*(d-r/2)]),h=e.toScreen([n.seg.a[0]+l[0]*(d+r/2),n.seg.a[1]+l[1]*(d+r/2)]);o.push($`<line x1=${k(p[0])} y1=${k(p[1])} x2=${k(h[0])} y2=${k(h[1])} stroke="#5b8def" stroke-width="10" stroke-opacity="0.6" stroke-linecap="round" pointer-events="none" />`)}}if(this.tool==="stairs"&&this.roomAt(e,t)!==void 0){let[n,i]=e.toScreen(t),a=e.px(1),r=e.px(2.6);o.push($`<g pointer-events="none" opacity="0.7"><rect x=${k(n-a/2)} y=${k(i-r/2)} width=${k(a)} height=${k(r)} fill="none" stroke="#5b8def" stroke-width="1.5" stroke-dasharray="4 3" />
        ${[1,2,3,4,5,6,7].map(d=>$`<line x1=${k(n-a/2)} x2=${k(n+a/2)} y1=${k(i-r/2+r*d/8)} y2=${k(i-r/2+r*d/8)} stroke="#5b8def" stroke-width="1" />`)}</g>`)}if((this.tool==="split"||this.tool==="inner")&&this.first!==void 0){let n=e.toScreen(this.first.a),i=e.toScreen(this.snap(e,t,this.first.a));if(this.tool==="split"){let a=Math.max(Math.hypot(i[0]-n[0],i[1]-n[1]),1e-6),r=[(i[0]-n[0])/a,(i[1]-n[1])/a],d=Math.hypot(e.stage.width,e.stage.height);o.push($`<line x1=${k(n[0]-r[0]*d)} y1=${k(n[1]-r[1]*d)} x2=${k(n[0]+r[0]*d)} y2=${k(n[1]+r[1]*d)} stroke="#5b8def" stroke-width="1.5" stroke-dasharray="6 4" pointer-events="none" />`)}else o.push($`<line x1=${k(n[0])} y1=${k(n[1])} x2=${k(i[0])} y2=${k(i[1])} stroke="#ece6da" stroke-width=${k(Math.max(e.px(.1),3))} stroke-opacity="0.8" pointer-events="none" />`);o.push($`<circle cx=${k(n[0])} cy=${k(n[1])} r="5" fill="#5b8def" pointer-events="none" />`)}return o}snap(e,t,o){return pn(e.floor,t,e.view.scale,{...o===void 0?{}:{from:o},...e.toggles.grid?{grid:we}:{}})}pointerDown(e,t,o){if(t.button!==0)return!1;switch(this.tool){case"door":case"window":case"opening":{let n=bn(e,o,ka,this.focus(e));if(n===void 0)return!1;let i=this.tool,a=n.room.id,r={kind:"opening",roomId:a,opening:n.room.openings.length},d=n.wall;return e.apply(l=>_t(l,a,d,{kind:i,at:o}),{select:r})&&this.placed(e,a,r),!0}case"stairs":{let n=this.roomAt(e,o);if(n===void 0)return!1;let i=n.id,a={kind:"room",roomId:i};return e.apply(r=>si(r,i,o),{select:a})&&this.placed(e,i,a),!0}case"split":case"inner":return this.twoPoints(e,o);default:return this.pick(e,t,o)}}twoPoints(e,t){if(this.first===void 0){let a=(e.walls===void 0?W(e.floor,t):void 0)??this.focus(e);return a===void 0?!1:(this.first={roomId:a.id,a:this.snap(e,t)},e.walls===void 0?e.select({kind:"room",roomId:a.id}):e.redraw(),!0)}let{roomId:o,a:n}=this.first,i=this.snap(e,t,n);if(this.first=void 0,Math.hypot(i[0]-n[0],i[1]-n[1])<.1)return e.redraw(),!0;if(this.tool==="inner"){let a=e.doc.floors.flatMap(d=>d.rooms).find(d=>M(d.id,o)),r={kind:"wall",roomId:o,wall:a===void 0?0:yo(a).length};return e.apply(d=>bi(d,o,n,i),{select:r})?this.placed(e,o,r):e.note("err","An inner wall needs to be at least 10 cm long."),!0}return this.split(e,o,n,i),!0}async split(e,t,o,n){let i=e.floor.rooms.find(l=>M(l.id,t)),a=await e.ask({title:"Name the new room",label:"Name",value:i===void 0?"Room":`${T(i)} 2`,ok:"Split the room"});if(a===void 0)return;let r=e.newId(),d={kind:"room",roomId:r};e.apply(l=>vi(l,t,o,n,r,a),{select:d})?(this.setTool(e,"select"),e.editWalls(void 0,d)):e.note("err","That line does not cut the room in two. Draw it right across the room.")}pick(e,t,o){let n=this.focus(e),i=t.target?.closest?.("[data-hme]")?.getAttribute("data-hme")??"",[a,r]=i.split(/:(.*)/s);if(a==="issue"){let h=so(e.floor).find(u=>u.id===r);return h!==void 0&&e.apply(u=>h.fix(u)),!0}let d=Number(r);if(n!==void 0&&a==="corner"&&Number.isInteger(d))return this.cornerDrag(e,t,n,d),!0;if(n!==void 0&&a==="mid"&&Number.isInteger(d))return this.midDrag(e,t,n,d),!0;if(n!==void 0&&a==="opening"&&Number.isInteger(d))return this.openingDrag(e,t,n,d),!0;let l=bn(e,o,ur,n);if(l!==void 0)return this.wallAt=Pe(o,l.seg.a,l.seg.b).point,e.select({kind:"wall",roomId:l.room.id,wall:l.wall}),!0;let p=W(e.floor,o);return e.walls!==void 0&&(p===void 0||!M(p.id,e.walls))?(e.editWalls(void 0),!0):p===void 0?!1:(e.select({kind:"room",roomId:p.id}),!0)}cornerTo(e,t,o,n){let i=e.floor.rooms.filter(d=>!M(d.id,t.id)).flatMap(d=>d.outline),a=10/e.view.scale;for(let d of i)if(Math.hypot(d[0]-n[0],d[1]-n[1])<=a)return[d[0],d[1]];let r=n;if(e.toggles.grid&&(r=[Math.round(r[0]/we)*we,Math.round(r[1]/we)*we]),e.toggles.square){let d=Wn(e.floor.rooms.flatMap(w=>yo(w))),l=Math.cos(d),p=Math.sin(d),h=w=>[w[0]*l+w[1]*p,-w[0]*p+w[1]*l],[u,f]=h(r),g=t.outline.length,c=8/e.view.scale;for(let w of[(o+g-1)%g,(o+1)%g]){let[v,y]=h(t.outline[w]);Math.abs(u-v)<=c&&(u=v),Math.abs(f-y)<=c&&(f=y)}r=[u*l-f*p,u*p+f*l]}return r}cornerDrag(e,t,o,n){let i=o.id,a;e.drag(t,{move:r=>{this.dragging=!0;let d=this.cornerTo(e,o,n,r);a=d,e.preview(l=>Ne(l,i,n,d))},end:(r,d,l)=>{this.dragging=!1,e.preview(void 0);let p=a,h={kind:"corner",roomId:i,corner:n};l&&p!==void 0?e.apply(u=>Ne(u,i,n,p),{select:h}):e.select(h)},cancel:()=>this.stopDrag(e)})}midDrag(e,t,o,n){let i=o.id,a=G(o)[n],r=At(e.doc,i,n),d=r?.floors.flatMap(f=>f.rooms).find(f=>M(f.id,i));if(a===void 0||r===void 0||d===void 0)return;let l=[(a.a[0]+a.b[0])/2,(a.a[1]+a.b[1])/2],p=d.outline.reduce((f,g,c)=>Math.hypot(g[0]-l[0],g[1]-l[1])<Math.hypot(d.outline[f][0]-l[0],d.outline[f][1]-l[1])?c:f,0),h=f=>g=>{let c=At(g,i,n);return c===void 0||f===void 0?c:Ne(c,i,p,f)},u;e.drag(t,{move:f=>{this.dragging=!0,u=this.cornerTo(e,d,p,f),e.preview(h(u))},end:(f,g,c)=>{this.dragging=!1,e.preview(void 0),e.apply(h(c?u:void 0),{select:{kind:"corner",roomId:i,corner:p}})},cancel:()=>this.stopDrag(e)})}openingDrag(e,t,o,n){let i=o.id,a=o.openings[n];if(a===void 0)return;let r={kind:"opening",roomId:i,opening:n},d=[(a.a[0]+a.b[0])/2,(a.a[1]+a.b[1])/2],l,p;e.select(r),e.drag(t,{move:h=>{l??=h,this.dragging=!0,this.sliding={roomId:i,index:n};let u=[d[0]+h[0]-l[0],d[1]+h[1]-l[1]];p=u,e.preview(f=>Oo(f,i,n,u))},end:(h,u,f)=>{this.dragging=!1,this.sliding=void 0,e.preview(void 0);let g=p;f&&g!==void 0&&e.apply(c=>Oo(c,i,n,g),{select:r})},cancel:()=>this.stopDrag(e)})}stopDrag(e){this.dragging=!1,this.sliding=void 0,e.preview(void 0)}hover(e,t){this.tool!=="select"&&(this.hoverAt=t,e.redraw())}keyDown(e,t){let o=Z(t,!1);if(typeof o=="object"&&"letter"in o){let n=pr(o.letter);return n===void 0?!1:(this.setTool(e,n),!0)}if(o==="cancel"&&(this.tool!=="select"||this.first!==void 0))return this.setTool(e,"select"),!0;if(o==="delete"){let n=e.selection;if(n?.kind==="corner")e.apply(i=>Lt(i,n.roomId,n.corner),{select:{kind:"room",roomId:n.roomId}});else if(n?.kind==="opening")e.apply(i=>Ft(i,n.roomId,n.opening),{select:{kind:"room",roomId:n.roomId}});else if(n?.kind==="wall")e.apply(i=>Do(i,n.roomId,n.wall),{select:{kind:"room",roomId:n.roomId}});else return!1;return!0}return!1}cursor(){return this.tool==="select"?void 0:"crosshair"}leave(e){this.first=void 0,this.hoverAt=void 0,this.dragging=!1,this.sliding=void 0,this.tool="select",e.redraw()}dock(e){return m`<button type="button" class="hme-tb ${e.toggles.square?"on":""}" aria-pressed=${e.toggles.square?"true":"false"}
        title="A dragged corner lines up with the corners beside it" @click=${()=>e.setToggle("square",!e.toggles.square)}>Snap to 90°</button>
      <button type="button" class="hme-tb ${e.toggles.grid?"on":""}" aria-pressed=${e.toggles.grid?"true":"false"}
        @click=${()=>e.setToggle("grid",!e.toggles.grid)}>Grid 5 cm</button>
      ${e.scans===void 0?b:m`<button type="button" class="hme-tb ${e.toggles.scan?"on":""}" aria-pressed=${e.toggles.scan?"true":"false"}
        title=${xa} @click=${()=>e.setToggle("scan",!e.toggles.scan)}>Show scan as it was</button>`}`}pill(e){if(this.tool!=="select"){let a={split:this.first===void 0?"Click where the cut starts":"Click where it ends, across the room",inner:this.first===void 0?"Click where the wall starts":"Click where it ends",door:"Click a wall to put a door in it",window:"Click a wall to put a window in it",opening:"Click a wall to open a way through it",stairs:"Click in the room to put stairs there"};return m`<span class="hme-pill-name">${a[this.tool]}</span>
        <button type="button" class="hme-tb" @click=${()=>this.setTool(e,"select")}>Cancel</button>`}let t=this.focus(e),o=e.selection;if(t===void 0||o===void 0||this.dragging)return b;let n=t.id,i=T(t);if(o.kind==="wall"){let a=o.wall,r=this.wallAt,d=an(t,a,i).replace(", "," \xB7 ");return m`<span class="hme-pill-name">${d}</span>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(e,t,a,"window",r)}>＋ Window here</button>
        <button type="button" class="hme-tb" @click=${()=>this.addHere(e,t,a,"door",r)}>＋ Door here</button>
        <button type="button" class="hme-tb" @click=${()=>this.cornerHere(e,t,a,r)}>Add a corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(l=>Ro(l,n,a))}>Straighten</button>`}if(o.kind==="corner")return m`<span class="hme-pill-name">${i} · corner</span>
        <button type="button" class="hme-tb" ?disabled=${t.outline.length<=3} @click=${()=>e.apply(a=>Lt(a,n,o.corner),{select:{kind:"room",roomId:n}})}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(a=>pe(a,n))}>Square the corners</button>`;if(o.kind==="opening"){let a=t.openings[o.opening];return a===void 0?b:m`<span class="hme-pill-name">${be(a)}</span>
        <button type="button" class="hme-tb danger" @click=${()=>e.apply(r=>Ft(r,n,o.opening),{select:{kind:"room",roomId:n}})}>Remove</button>`}return m`<span class="hme-pill-name">${i}</span>
      <button type="button" class="hme-tb" @click=${()=>e.apply(a=>pe(a,n))}>Square the corners</button>`}addHere(e,t,o,n,i){let a=t.id,r=t.openings.length;e.apply(d=>_t(d,a,o,{kind:n,...i===void 0?{}:{at:i}}),{select:{kind:"opening",roomId:a,opening:r}})}cornerHere(e,t,o,n){let i=t.id,a=h=>At(h,i,o,n),r=a(e.doc)?.floors.flatMap(h=>h.rooms).find(h=>M(h.id,i)),d=G(t)[o],l=n??(d===void 0?void 0:[(d.a[0]+d.b[0])/2,(d.a[1]+d.b[1])/2]),p=r===void 0||l===void 0?-1:r.outline.reduce((h,u,f)=>Math.hypot(u[0]-l[0],u[1]-l[1])<Math.hypot(r.outline[h][0]-l[0],r.outline[h][1]-l[1])?f:h,0);e.apply(a,{select:p<0?{kind:"room",roomId:i}:{kind:"corner",roomId:i,corner:p}})}inspector(e){let t=this.focus(e),o=e.selection;if(t===void 0||o===void 0){let h=so(e.floor);return P("Shape",m`<p class="hme-text">Pick a room, then a wall or a corner. Drag a corner to move it; a corner two rooms share moves for both.</p>
        <p class="hme-text dim">${h.length===0?"The scan check found nothing to fix on this floor.":`The scan check found ${I(h.length,"thing")} to fix. They are marked in amber.`}</p>`)}let n=t.id;if(o.kind==="corner")return this.cornerCard(e,t,o.corner);let i=this.pickedWall(e,t);if(i===void 0){let h=go(e.scans,n),u=h!==void 0&&Ao(t,h)?h:void 0;return P(T(t),m`
        ${D("Corners",m`<span class="hme-val">${t.outline.length}</span>`)}
        ${D("Walls",m`<span class="hme-val">${G(t).length}</span>`)}
        ${D("Wall height",O({label:"Wall height",value:t.height,unit:"m",min:.5,max:20,set:f=>e.apply(g=>nt(g,n,f))}))}
        ${K("Click a wall to change it or put a door or window in it. Drag a corner to move it, or the dot in a wall's middle to add a corner.")}
        ${u===void 0?b:K("Its shape has changed since the iPhone scanned it.")}
        <div class="hme-row-end">
          ${u===void 0?b:m`<button type="button" class="hme-tb" title=${Ha} @click=${()=>e.apply(f=>Lo(f,n,u))}>Back to the scan</button>`}
          <button type="button" class="hme-tb" @click=${()=>e.apply(f=>pe(f,n))}>Square the corners</button>
        </div>`)}let a=G(t)[i],r=t.openings.map((h,u)=>({o:h,i:u})).filter(({o:h})=>je(t,h)===i),d=o.kind==="opening"?t.openings[o.opening]:void 0,l=le(a),p=h=>{let u=t.openings.length;e.apply(f=>_t(f,n,i,{kind:h}),{select:{kind:"opening",roomId:n,opening:u}})};return m`
      ${P("Wall",m`
        ${D("Room",m`<span class="hme-val strong">${an(t,i,T(t))}</span>`)}
        ${D("Length",O({label:"Length",value:l,unit:"m",min:.1,max:200,set:h=>e.apply(u=>fi(u,n,i,h))}))}
        ${D("Thickness",O({label:"Thickness",value:a.t,unit:"m",min:.01,max:1,set:h=>e.apply(u=>gi(u,n,i,h))}))}
        ${D("Height",O({label:"Wall height",value:t.height,unit:"m",min:.5,max:20,set:h=>e.apply(u=>nt(u,n,h))}))}
        ${K("Type a length to move the far corner. Rooms that share the corner move with it.")}
        <div class="hme-row-end indent">
          <button type="button" class="hme-tb" @click=${()=>e.apply(h=>Ro(h,n,i))}>Straighten</button>
          <button type="button" class="hme-tb" @click=${()=>e.apply(h=>pe(h,n))}>Square the corners</button>
          <button type="button" class="hme-tb" @click=${()=>this.cornerHere(e,t,i,void 0)}>Split wall</button>
          <button type="button" class="hme-tb danger" title="Take this wall away" @click=${()=>e.apply(h=>Do(h,n,i),{select:{kind:"room",roomId:n}})}>Remove</button>
        </div>`)}
      ${P("On this wall",m`
        ${r.map(({o:h,i:u})=>{let f=Pe(h.a,a.a,a.b).along,g=Pe(h.b,a.a,a.b).along,c=o.kind==="opening"&&o.opening===u;return m`<button type="button" class="hme-list-row ${c?"on":""}" @click=${()=>e.select({kind:"opening",roomId:n,opening:u})}>
            <span class="hme-grow">${be(h)}</span><span class="mono dim">${mt(Math.abs(g-f))} · ${mt(Math.max(0,Math.min(f,g)))} in</span></button>`})}
        ${r.length===0?m`<p class="hme-empty-line">Nothing on this wall.</p>`:b}
        <div class="hme-row-end">
          <button type="button" class="hme-tb" @click=${()=>p("door")}>＋ Door</button>
          <button type="button" class="hme-tb" @click=${()=>p("window")}>＋ Window</button>
          <button type="button" class="hme-tb" @click=${()=>p("opening")}>＋ Way through</button>
        </div>`)}
      ${d===void 0||o.kind!=="opening"?b:this.openingCard(e,t,o.opening,d)}`}openingCard(e,t,o,n){let i=t.id,a=Math.hypot(n.b[0]-n.a[0],n.b[1]-n.a[1]),r=n.z1-n.z0;return P(be(n),m`
      <div class="hme-pics">${hr.map(d=>X({label:d.label,picture:gr[d.label],on:n.kind===d.kind&&n.style===d.style,click:()=>e.apply(l=>rt(l,i,o,{kind:d.kind,style:d.style??null}))}))}</div>
      ${D("Width",O({label:"Width",value:a,unit:"m",min:.1,max:20,set:d=>e.apply(l=>rt(l,i,o,{width:d}))}))}
      ${D("From floor",O({label:"From floor",value:n.z0,unit:"m",min:0,max:20,set:d=>e.apply(l=>rt(l,i,o,{z0:d,z1:d+r}))}),m`<span class="hme-l short">Tall</span>`,O({label:"Tall",value:r,unit:"m",min:.05,max:20,set:d=>e.apply(l=>rt(l,i,o,{z1:n.z0+d}))}))}
      ${K("Drag it along the wall. The plan shows the space to each corner.")}
      <div class="hme-row-end indent"><button type="button" class="hme-tb danger" @click=${()=>e.apply(d=>Ft(d,i,o),{select:{kind:"room",roomId:i}})}>Remove ${be(n).toLowerCase()}</button></div>`)}cornerCard(e,t,o){let n=t.id,i=t.outline[o];if(i===void 0)return m``;let a=e.floor.rooms.filter(r=>!M(r.id,n)&&r.outline.some(d=>Math.hypot(d[0]-i[0],d[1]-i[1])<=.02));return P("Corner",m`
      ${D("Room",m`<span class="hme-val strong">${T(t)}</span>`)}
      ${D("Left, top",O({label:"Corner left",value:i[0],unit:"m",set:r=>e.apply(d=>Ne(d,n,o,[r,i[1]]))}),O({label:"Corner top",value:i[1],unit:"m",set:r=>e.apply(d=>Ne(d,n,o,[i[0],r]))}))}
      ${K(a.length===0?"Drag it on the plan. Drop it on another room's corner and the two move together after.":`Shared with ${a.map(T).join(", ")}, which move${a.length===1?"s":""} with it.`)}
      <div class="hme-row-end indent">
        <button type="button" class="hme-tb" ?disabled=${t.outline.length<=3} @click=${()=>e.apply(r=>Lt(r,n,o),{select:{kind:"room",roomId:n}})}>Remove corner</button>
        <button type="button" class="hme-tb" @click=${()=>e.apply(r=>pe(r,n))}>Square the corners</button>
      </div>`)}},fr={select:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3z" fill="none" stroke="currentColor" stroke-width="1.4"></path><circle cx="3" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="3" r="2" fill="currentColor"></circle><circle cx="15" cy="15" r="2" fill="currentColor"></circle><circle cx="3" cy="15" r="2" fill="currentColor"></circle></svg>`,split:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 3h14v12H2z" fill="none" stroke="currentColor" stroke-width="1.4"></path><path d="M9 1v16" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2 2"></path></svg>`,inner:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="2.4"></path></svg>`,door:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 15h4M12 15h4M6 15V5M6 5a10 10 0 0 1 10 10" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`,window:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14" stroke="currentColor" stroke-width="1.4"></path><path d="M5 7h8M5 11h8" stroke="#8bb8f0" stroke-width="1.4"></path></svg>`,opening:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h4M12 9h4" stroke="currentColor" stroke-width="2.4"></path></svg>`,stairs:m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 3h12v12H3zM3 6h12M3 9h12M3 12h12" fill="none" stroke="currentColor" stroke-width="1.2"></path></svg>`},gr={Door:m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V4M14 4a17 17 0 0 1 17 17" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Double door":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 21h34" stroke="#1f1f21" stroke-width="6"></path><path d="M14 21V7M48 21V7M14 7a14 14 0 0 1 14 14M48 7a14 14 0 0 0-14 14" fill="none" stroke="#ece6da" stroke-width="1.2"></path></svg>`,"Sliding door":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18.5h20M28 23.5h20" stroke="#ece6da" stroke-width="2.4"></path></svg>`,Window:m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M14 18h34M14 24h34" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Sliding window":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h54" stroke="#ece6da" stroke-width="4"></path><path d="M12 21h38" stroke="#1f1f21" stroke-width="6"></path><path d="M14 18h20M28 24h20" stroke="#8bb8f0" stroke-width="2"></path></svg>`,"Way through":m`<svg width="62" height="42" viewBox="0 0 62 42" aria-hidden="true"><path d="M4 21h10M48 21h10" stroke="#ece6da" stroke-width="4"></path><path d="M14 27h34" stroke="#98989d" stroke-width="1" stroke-dasharray="3 3"></path></svg>`};var Sa=[{id:"pick",label:"Pick and move",key:"v"},{id:"draw",label:"Draw a room",key:"r"},{id:"inner",label:"Inner wall",key:"w"},{id:"door",label:"Door",key:"d"},{id:"window",label:"Window",key:"n"},{id:"furniture",label:"Add furniture",key:"f"},{id:"measure",label:"Measure",key:"m"}];function br(s){return Sa.find(e=>e.key===s.toLowerCase())?.id}var Ca=4,vr=s=>`${s[0].toFixed(1)} \xD7 ${s[1].toFixed(1)}`;function wr(s){let e=s.openings.filter(o=>o.kind==="window").length,t=s.openings.length-e;return`${I(t,"door")} \xB7 ${I(e,"window")}`}function yr(s,e){let t=ee(s.entityId,e);return(t.kind==="light"||t.kind==="other")&&t.on}var po=class{constructor(){this.arrange=new no;this.devices=new ro((e,t,o)=>this.arrange.piecePic(e,st(t),o));this.shape=new lo;this.query="";this.trayOpen=!1}tool(e){if(e.toggles.measure)return"measure";if(e.walls!==void 0)return this.shape.tool;if(this.arrange.draw.active)return"draw";let t=this.shape.tool;return t==="inner"||t==="door"||t==="window"?t:"pick"}setTool(e,t){if(t==="furniture"){let o=ga(e);o===void 0?e.note("warn","Draw or scan a room first, then add its furniture."):this.arrange.openPicker(e,o);return}if(t==="measure"){this.arrange.draw.stop(),this.shape.setTool(e,"select"),e.setToggle("measure",!e.toggles.measure),e.redraw();return}if(e.toggles.measure&&e.setToggle("measure",!1),t==="draw"){this.shape.setTool(e,"select"),this.arrange.draw.active||this.arrange.draw.start(e);return}this.arrange.draw.stop(e),this.shape.setTool(e,t==="pick"?"select":t)}openRooms(e){let t=e.selection;if(t===void 0||t.kind==="pins")return[];if(t.kind==="pin"){let o=e.floor.pins.find(i=>M(i.id,t.pinId)),n=o===void 0?void 0:Q(e.floor,o)?.id;return n===void 0?[]:[n]}return t.kind==="objects"?t.items.map(o=>o.roomId):[t.roomId]}picksPins(e){return se(e.selection).length>0}rail(e){if(e.walls!==void 0)return this.shape.rail(e);let t=e.hass?.states,o=Xt(e.hass),n=this.query.trim().toLowerCase(),i=n===""?[]:qt(o,this.query).filter(a=>a.domain==="light"||!e.floor.pins.some(r=>r.entityId===a.entityId));return m`
      <label class="hme-find"><span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Find a room, thing or device" aria-label="Find a room, thing or device" .value=${N(this.query)}
          @input=${a=>{this.query=a.target.value,e.redraw()}} /></label>
      ${this.layers(e,n)}
      ${n===""||i.length===0?b:P("Devices found",m`
        ${i.map(a=>this.devices.deviceRow(e,a,t))}`,i.length>=40?"40+":String(i.length),"hme-tray")}
      ${this.trayCard(e,o,t)}`}layers(e,t){let o=e.floor,n=e.toggles.live?e.hass?.states:void 0,i=h=>h.toLowerCase().includes(t),a=h=>i(B(h,e.hass))||h.entityId.includes(t),r=this.openRooms(e),d=o.rooms.map(h=>{let u=h.objects.map((v,y)=>({object:v,index:y})),f=Qe(o,h.id);if(t==="")return{room:h,things:u,pins:f,open:r.some(v=>M(h.id,v))};let g=i(T(h)),c=u.filter(({object:v})=>i(q(v))),w=f.filter(a);if(!(!g&&c.length===0&&w.length===0))return{room:h,things:g?u:c,pins:g?f:w,open:!0}}).filter(h=>h!==void 0),l=o.pins.filter(h=>Q(o,h)===void 0&&(t===""||a(h))),p=e.doc.floors.filter(h=>!M(h.id,o.id));return m`<section class="hme-card hme-layers">
      <div class="hme-h">${z(o)}<span class="hme-h-end">${I(o.rooms.length,"room")}</span></div>
      ${d.map(h=>this.layer(e,h.room,h.open,h.things,h.pins,n))}
      ${d.length===0?m`<p class="hme-empty-line">${t===""?"No rooms on this floor yet. Draw one with R.":"Nothing by that name."}</p>`:b}
      ${l.length===0?b:m`<div class="hme-lay dim">Not in a room<span class="n">${l.length}</span></div>
        ${l.map(h=>this.pinLayer(e,h,n))}`}
      ${t!==""?b:m`<div class="hme-sep"></div>${this.devices.kindChips(e)}`}
      ${p.length>0?m`<div class="hme-sep"></div>${p.map(h=>m`<button type="button" class="hme-lay dim"
          @click=${()=>e.setFloor(h.id)}>▸ ${z(h)}<span class="n">${I(h.rooms.length,"room")}</span></button>`)}`:b}
    </section>`}layer(e,t,o,n,i,a){let r=e.selection,d=r?.kind==="room"&&M(r.roomId,t.id),l=m`<button type="button" class="hme-lay ${d?"on":""}" aria-pressed=${d?"true":"false"} aria-expanded=${o?"true":"false"}
      title="Click to pick it, double-click to edit its walls"
      @click=${()=>e.select({kind:"room",roomId:t.id})}
      @dblclick=${()=>e.editWalls(t.id)}>
      <span class="hme-caret" aria-hidden="true">${o?"\u25BE":"\u25B8"}</span>
      <span class="hme-dot" style=${`background:${sn[Le(t)]}`}></span>${T(t)}<span class="n">${Ue(t)}</span></button>`;return o?m`${l}
      ${n.map(({object:p,index:h})=>{let u=qi(r,t.id,h),f={roomId:t.id,object:h};return m`<button type="button" class="hme-lay sub ${u?"on":""} ${p.hidden===!0?"dim":""}" aria-pressed=${u?"true":"false"}
          title="Pick it to move, resize or turn it. Cmd or Ctrl and a click picks several."
          @click=${g=>e.select(g.metaKey||g.ctrlKey?ge(e.selection,f):{kind:"object",...f})}>
          <span class="hme-thing-ic ${u?"on":""}" aria-hidden="true"></span>${q(p)}<span class="n">${p.hidden===!0?"hidden":vr(p.size)}</span></button>`})}
      ${i.map(p=>this.pinLayer(e,p,a))}
      <button type="button" class="hme-lay sub dim" title="Edit this room's walls, doors and windows" @click=${()=>e.editWalls(t.id)}>${wr(t)}<span class="n">Walls ›</span></button>`:l}pinLayer(e,t,o){let n=se(e.selection).some(a=>M(a,t.id)),i=yr(t,o);return m`<button type="button" class="hme-lay sub ${n?"on":""}" aria-pressed=${n?"true":"false"} title="Shift, Cmd or Ctrl and a click picks several"
      @click=${a=>e.select(a.shiftKey||a.metaKey||a.ctrlKey?Se(e.selection,t.id):{kind:"pin",pinId:t.id})}>
      <span class="hme-dot dev ${i?"":"off"}"></span>${B(t,e.hass)}<span class="n">${te(t.entityId,o)}</span></button>`}trayCard(e,t,o){let n=Ni(e.doc,e.floor,t),i=n.reduce((p,h)=>p+h.devices.length,0),a=Ki(e.floor,n),r=i-Ca,l=this.trayOpen||r<=0?n.map(p=>m`<div class="hme-ar ${p.here?"":"dim"}">${p.name}<span>${p.devices.length}</span></div>
          ${p.devices.map(h=>this.devices.deviceRow(e,h,o))}`):n.flatMap(p=>p.devices).slice(0,Ca).map(p=>this.devices.deviceRow(e,p,o));return P("Not on the map",m`
      ${i===0?m`<p class="hme-empty-line">Every device with an area is on the map. Find any other above.</p>`:l}
      ${i===0?b:m`<div class="hme-row-end">
          <button type="button" class="hme-tb hme-grow-btn" ?disabled=${a===0}
            title=${a===0?"Link this floor's rooms to Home Assistant areas first (a room's Area, in its card)":"Each goes into the room linked to its area, at a good height for its kind"}
            @click=${()=>this.devices.placeAll(e,n.flatMap(p=>p.devices))}>Place all ${a} by area</button>
          ${r<=0?b:m`<button type="button" class="hme-tb" aria-expanded=${this.trayOpen?"true":"false"}
            @click=${()=>{this.trayOpen=!this.trayOpen,e.redraw()}}>${this.trayOpen?"Fewer":`${r} more`}</button>`}
        </div>
        <p class="hme-foot">Drag a device onto the plan to place it, or click it to put it in its area's room.</p>`}`,String(i),"hme-tray")}overlay(e){return e.walls!==void 0?this.shape.overlay(e):$`${this.arrange.overlay(e)}${this.shape.armed?this.shape.ghost(e):b}${this.devices.overlay(e)}`}drawsPins(e){return e.walls===void 0}pointerDown(e,t,o){if(this.devices.choosing)return this.devices.cancelChooser(e),!0;if(e.walls!==void 0)return this.shape.pointerDown(e,t,o);if(this.arrange.draw.active)return this.arrange.draw.pointerDown(e,t,o);if(this.shape.armed)return this.shape.pointerDown(e,t,o);if(t.button!==0)return!1;if(this.arrange.pressHandle(e,t,o)||this.devices.pressHandle(e,t,o))return!0;let n=this.devices.heldLampAt(e,o);return n!==void 0&&this.arrange.pressThing(e,t,n,o)?!0:this.devices.pressPin(e,t,o)||this.devices.pressBox(e,t,o)||this.arrange.pressBody(e,t,o)}doubleClick(e,t,o){if(this.arrange.draw.active||this.shape.armed||e.walls===void 0&&this.devices.onPin(e,o))return;let n=W(e.floor,o);n===void 0||M(n.id,e.walls)||e.editWalls(n.id)}hover(e,t){e.walls===void 0&&this.arrange.hover(e,t),this.shape.hover(e,t)}keyDown(e,t){if(this.devices.chooserKey(e,t))return!0;let o=Z(t,!1),n=typeof o=="object"&&"letter"in o?o.letter:void 0;if(n==="m")return this.setTool(e,"measure"),!0;if(e.walls!==void 0)return this.shape.keyDown(e,t)?!0:o==="cancel"?(e.editWalls(void 0),!0):!1;if(this.arrange.draw.active&&this.arrange.draw.keyDown(e,t))return!0;let i=n===void 0?void 0:br(n);return i!==void 0?(this.setTool(e,i),!0):o==="cancel"&&this.shape.armed?(this.setTool(e,"pick"),!0):this.picksPins(e)?this.devices.keyDown(e,t):this.arrange.keyDown(e,t)}cursor(e){return e.walls!==void 0?this.shape.cursor():this.arrange.draw.active||this.shape.armed?"crosshair":void 0}leave(e){this.arrange.leave(e),this.devices.leave(),this.shape.leave(e)}dock(e){return e.walls!==void 0?this.shape.dock(e):m`${this.arrange.dock(e)}<span class="hme-vsep"></span>${this.devices.dock(e)}`}pill(e){return e.walls!==void 0||this.shape.armed?this.shape.pill(e):this.arrange.draw.active?this.arrange.pill(e):this.picksPins(e)?this.devices.pill(e):this.arrange.pill(e)}banner(e){let t=this.wallsRoom(e);return t===void 0?b:m`<span class="hme-banner-t">Editing the walls of <b>${T(t)}</b></span>
      <button type="button" class="hme-tb hme-blue" title="Back to moving things (Esc)" @click=${()=>e.editWalls(void 0)}>Done <kbd>Esc</kbd></button>`}wallsRoom(e){return e.walls===void 0?void 0:e.floor.rooms.find(t=>M(t.id,e.walls))}stageExtra(e){let t=e.walls===void 0?this.devices.stageExtra(e):b,o=e.walls!==void 0?"Drag a corner \xB7 drag a wall's middle to add a corner \xB7 Esc when done":"Click picks what is on top \xB7 Double-click a room to edit its walls";return m`${this.toolRail(e)}${t}
      ${t===b&&e.stage.width>=900?m`<div class="hme-stage-hint">${o}</div>`:b}`}toolRail(e){let t=this.tool(e),o=e.walls!==void 0,n=o?[...vn,{id:"measure",label:"Measure",key:"m"}]:[...Sa],i=new Set(o?[0]:[0,4]);return m`<div class="hme-toolrail" role="toolbar" aria-label=${o?"Wall tools":"Tools"} aria-orientation="vertical">
      ${n.map((a,r)=>m`<button type="button" class="hme-rtool ${t===a.id?"on":""}" aria-pressed=${t===a.id?"true":"false"}
          aria-label=${a.label} title=${`${a.label} (${a.key.toUpperCase()})`} @click=${()=>this.setTool(e,a.id)}>
          ${Mr(a.id)}<kbd>${a.key.toUpperCase()}</kbd></button>
        ${i.has(r)?m`<span class="hme-rtool-sep" aria-hidden="true"></span>`:b}`)}
    </div>`}inspector(e){if(e.walls!==void 0)return m`${this.shape.inspector(e)}
        ${P("Leave this",m`<p class="hme-text dim">Press Esc, click Done, or click outside the room to go back to moving things. Double-click any room to edit its walls.</p>`)}`;if(this.picksPins(e))return this.devices.inspector(e);let t=e.selection,o=t?.kind==="object"?this.devices.lampCards(e,t.roomId,t.object):b;return o===b?this.arrange.inspector(e):m`${o}${this.arrange.inspector(e)}`}sheet(e){let t=this.devices.lampChooser(e);return t===b?this.arrange.sheet(e):t}dragOver(e,t,o){return e.walls===void 0&&this.devices.dragOver(e,t,o)}drop(e,t,o){e.walls===void 0&&this.devices.drop(e,t,o)}startDrawing(e){this.setTool(e,"draw")}};function Mr(s){switch(s){case"pick":return m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M4 2.5v11.5l3.1-3 2.3 5 2-.9-2.3-4.9h4.4z" fill="currentColor"></path></svg>`;case"draw":return m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 15V3h8l4 4v8z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="2.5 2"></path></svg>`;case"furniture":return m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 8h14v6H2zM4 4h10v4H4zM3 14v2M15 14v2" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`;case"measure":return m`<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 9h14M2 6v6M16 6v6M6 9v-2M9 9V6M12 9v-2" fill="none" stroke="currentColor" stroke-width="1.4"></path></svg>`;default:return Ta(s)}}function Ra(s){return{get:()=>yt(s),save:(e,t)=>$n(s,e,t)}}var Da="The map had changed on another device. Your change was saved on top of it.",$r="The map changed on another device, and your change no longer fits it. It now shows the map as saved there.",kr="The map changed again while saving, so your change was not saved. Try it once more.";function xr(s){return{doc:Mt(s?.doc)??null,rev:typeof s?.rev=="number"?s.rev:0}}function Ia(s,e){let t=typeof e=="function"?e(s):Sn(s,e);if(t===void 0)return;let o=Je(t);return o.ok?{doc:o.doc}:{text:`Not saved. ${o.message}.`}}async function Oa(s,e,t){if(e.doc===null)return{ok:!1,text:"There is no map to change yet."};let o=Ia(e.doc,t);if(o===void 0)return{ok:!1,text:"That is no longer on the map."};if("text"in o)return{ok:!1,text:o.text};try{let a=await s.save(o.doc,e.rev);return{ok:!0,read:{doc:o.doc,rev:a.rev},merged:!1}}catch(a){let{code:r,message:d}=Oe(a);if(r!=="conflict")return{ok:!1,text:`Not saved. ${d}`}}let n;try{n=xr(await s.get())}catch(a){return{ok:!1,text:`Not saved. The map changed on another device and could not be read again: ${Oe(a).message}`}}let i=n.doc===null?void 0:Ia(n.doc,t);if(i===void 0)return{ok:!1,text:$r,read:n};if("text"in i)return{ok:!1,text:i.text,read:n};try{let a=await s.save(i.doc,n.rev);return{ok:!0,read:{doc:i.doc,rev:a.rev},merged:!0}}catch(a){let{code:r,message:d}=Oe(a);return{ok:!1,text:r==="conflict"?kr:`Not saved. ${d}`,read:n}}}function ho(s){return Array.isArray(s)?`[${s.map(ho).join(",")}]`:typeof s=="object"&&s!==null?`{${Object.entries(s).filter(([,t])=>t!==void 0).sort(([t],[o])=>t<o?-1:t>o?1:0).map(([t,o])=>`${JSON.stringify(t)}:${ho(o)}`).join(",")}}`:JSON.stringify(s)}function Hr(s,e){return s===e?!0:s==null||e==null?!1:ho(s)===ho(e)}function Aa(s,e){return t=>Hr(t,s)?e:void 0}var mo=class{constructor(e,t,o=()=>{},n=()=>{},i){this.api=e;this.changed=o;this.saved=n;this.state={kind:"saved"};this.queue=[];this.confirmed=t,this.doc=t.doc,this.history=new Ai(i)}get busy(){return this.queue.length>0||this.running!==void 0}get canUndo(){return this.doc!==null&&this.history.canUndo}get canRedo(){return this.doc!==null&&this.history.canRedo}load(e){return this.busy?!1:(this.confirmed=e,this.doc=e.doc,this.history.clear(),this.changed(),!0)}apply(e){let t=this.doc;if(t===null)return!1;let o=e(t);if(o===void 0)return!1;let n=Je(o);return n.ok?(this.history.push(t),this.doc=n.doc,this.enqueue(e),!0):(this.note={kind:"err",text:`That cannot be saved. ${n.message}.`},this.changed(),!1)}undo(){let e=this.doc;if(e===null)return!1;let t=this.history.undo(e);return t===void 0?!1:(this.doc=t,this.enqueue(Aa(e,t)),!0)}redo(){let e=this.doc;if(e===null)return!1;let t=this.history.redo(e);return t===void 0?!1:(this.doc=t,this.enqueue(Aa(e,t)),!0)}async idle(){for(;this.running!==void 0;)await this.running}dismissNote(){this.note=void 0,this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed()}enqueue(e){this.queue.push(e),this.state.kind==="error"&&(this.state={kind:"saved"}),this.changed(),this.kick()}kick(){this.running===void 0&&(this.running=this.run().finally(()=>{this.running=void 0,this.queue.length>0?this.kick():this.changed()}))}async run(){for(;this.queue.length>0;){let e=this.queue.splice(0),t=e.length===1?e[0]:n=>e.reduce((i,a)=>i===void 0?void 0:a(i),n);this.state={kind:"saving"},this.changed();let o=await Oa(this.api,this.confirmed,t);if(o.ok){this.confirmed=o.read,this.saved(o.read),o.merged?(this.note={kind:"warn",text:Da},this.history.clear(),this.doc=this.rebased()):this.queue.length===0&&(this.doc=o.read.doc);continue}this.queue=[],this.history.clear(),o.read!==void 0&&(this.confirmed=o.read,this.saved(o.read)),this.doc=this.confirmed.doc,this.note={kind:"err",text:o.text},this.state={kind:"error",text:o.text},this.changed();return}this.state={kind:"saved"}}rebased(){let e=this.confirmed.doc;if(e===null)return null;let t=[];for(let o of this.queue){let n=o(e);if(n===void 0)continue;let i=Je(n);i.ok&&(e=i.doc,t.push(o))}return this.queue=t,e}};var La=yn`
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
  /* A light's "2 on map": a click picks the next one in turn. */
  .hme-dv-count {
    flex: none; height: 22px; padding: 0 8px; border-radius: 11px; border: 1px solid var(--wa-line-strong); background: var(--wa-raise);
    color: var(--wa-soft); font: inherit; font-size: 11px; font-weight: 600; cursor: pointer; white-space: nowrap;
  }
  .hme-dv-count:hover { color: var(--wa-ink); border-color: var(--hme-sel); }
  /* A lamp's light: its head, and the search of the home's lights. */
  .hme-lamp-light { display: flex; align-items: center; gap: 12px; }
  .hme-light-find { display: flex; flex-direction: column; gap: 4px; }
  .hme-light-row {
    display: flex; align-items: center; gap: 8px; width: 100%; padding: 5px 8px; border-radius: 8px; border: 1px solid transparent;
    background: none; color: var(--wa-ink); font: inherit; font-size: 13px; text-align: left; cursor: pointer;
  }
  .hme-light-row:hover { background: var(--wa-hover); border-color: var(--wa-line); }
  .hme-light-row .hme-grow { display: flex; flex-direction: column; min-width: 0; line-height: 1.25; }
  .hme-light-row small { color: var(--wa-faint); font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
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
`;var wt={plan:{title:"Plan",hint:"The floor from above, with real floors, walls and pools of light."},night:{title:"Night",hint:"A small model at night. Lit rooms glow warm."},warm:{title:"Warm",hint:"Wood floors and cream walls, like a doll house."},lines:{title:"Lines",hint:"Only the lines. Calm and clean."},clay:{title:"Clay",hint:"A soft light model, for light pages."},blueprint:{title:"Blueprint",hint:"White lines on blue paper."},dots:{title:"Dots",hint:"A quiet plan with a dot for each light."}};function Pr(s,e){if(!Kt(s))return"Home style";let t=No(s,e),o=i=>Object.hasOwn(s,Ri[i]),n=[];return o("look")&&n.push(wt[t.look].title),o("turn")&&n.push(`turned ${t.turn}\xB0`),o("names")&&n.push(t.names?"room names":"no room names"),o("devices")&&n.push(t.devices==="all"?"every device":t.devices==="none"?"no devices":"lights only"),o("furniture")&&n.push(t.furniture?"furniture":"no furniture"),o("glow")&&n.push(t.glow?"glow":"no glow"),`Own look: ${n.join(", ")}`}var _a=(s,e)=>typeof s=="number"&&Number.isFinite(s)?s:e;function Er(s,e){let t=_n(s);return Ln(s).flatMap(o=>{if(vo(Tt(o))!=="home_map")return[];let n=o,i=Fn(Tt(o)),a=e?.floors.find(u=>M(u.id,i)),r=typeof n.homeMapRoomId=="string"?n.homeMapRoomId:void 0,d=r===void 0?void 0:a?.rooms.find(u=>M(u.id,r)),l=`${_a(o.colSpan,1)}\xD7${_a(o.rowSpan,1)}`,h=(typeof o.customLabel=="string"&&o.customLabel.trim()!==""?o.customLabel.trim():void 0)??(d?.name?.trim()?`${d.name.trim()} only`:a===void 0||(e?.floors.length??0)<=1?"Home map":z(a));return[{pageId:t,pageName:Et(s),tileId:typeof o.id=="string"?o.id:"",what:h,size:l,own:Kt(n),words:Pr(n,e),look:No(n,e).look}]})}function Fa(s,e){return Object.values(s?.pages??{}).map(o=>o?.item).filter(o=>Pt(o)).sort((o,n)=>Et(o).localeCompare(Et(n))).flatMap(o=>Er(o,e))}function za(s){let e=!1;if(!Array.isArray(s.pages))return;let t=s.pages.map(o=>{if(!Pt(o)||!Array.isArray(o.items))return o;let n=o.items.map(i=>!Pt(i)||vo(Tt(i))!=="home_map"||!Kt(i)?i:(e=!0,Oi(i)));return{...o,items:n}});return e?{...s,pages:t}:void 0}var co={width:112,height:68},Tr={width:94,height:94,radius:34},Cr={width:188,height:94,radius:22},Sr=.9,uo=class{constructor(){this.usesState="idle";this.busy=!1}style(e){let t=ce(e.doc);return this.turnLive===void 0?t:{...t,turn:this.turnLive}}set(e,t){e.apply(o=>Di(o,t))}panel(e,t){let o=this.style(e),n=e.hass?.states,i=lt.includes(o.look),a=(r,d,l)=>m`<button type="button" class="hme-chip sel ${d?"on":""}" aria-pressed=${d?"true":"false"} @click=${l}>${r}</button>`;return m`<div class="hme-style-scrim" @pointerdown=${r=>{r.target===r.currentTarget&&t()}}></div>
      <div class="hme-style-pop" role="dialog" aria-label="Home style">
        <header class="hme-style-head">
          <strong>Home style</strong>
          <span>How every map tile looks, unless a tile picks its own</span>
          <button type="button" class="hme-x hme-style-close" aria-label="Close" title="Close (Esc)" @click=${t}>✕</button>
        </header>

        ${P("Look",m`<div class="hme-looks four">
          ${xn.map(r=>{let d=r===o.look,l=Ge({floor:e.floor,states:n,...o,look:r,names:!1,width:co.width,height:co.height});return m`<button type="button" class="hme-look ${d?"on":""}" aria-pressed=${d?"true":"false"} title=${wt[r].hint}
              @click=${()=>this.set(e,{look:r})}>
              <svg viewBox=${`0 0 ${co.width} ${co.height}`} style=${`background:${ue(r,.5)}`} aria-hidden="true">${l}</svg>
              <span>${wt[r].title}</span></button>`})}
        </div>
        <p class="hme-foot">Plan and Dots draw the floor from above. The other five draw it as a small model you can turn.</p>`)}

        <div class="hme-style-row">
          ${P("Show",m`
            <div class="hme-r"><span class="hme-l">Room names</span>${a(o.names?"Shown":"Hidden",o.names,()=>this.set(e,{names:!o.names}))}</div>
            <div class="hme-r"><span class="hme-l">Devices</span><div class="hme-chips">
              ${a("Lights",o.devices==="lights",()=>this.set(e,{devices:"lights"}))}
              ${a("All",o.devices==="all",()=>this.set(e,{devices:"all"}))}
              ${a("None",o.devices==="none",()=>this.set(e,{devices:"none"}))}</div></div>
            <div class="hme-r"><span class="hme-l">Furniture</span>${a(o.furniture?"Shown":"Hidden",o.furniture,()=>this.set(e,{furniture:!o.furniture}))}</div>
            <div class="hme-r"><span class="hme-l">Light glow</span>${a(o.glow?"On":"Off",o.glow,()=>this.set(e,{glow:!o.glow}))}</div>
            <div class="hme-r"><span class="hme-l">Turn</span>
              <input class="hme-range" type="range" min="-180" max="180" step="1" .value=${N(String(o.turn))} ?disabled=${!i} aria-label="Turn the model"
                style=${Ae(o.turn,-180,180)}
                @input=${r=>{this.turnLive=Number(r.target.value),e.redraw()}}
                @change=${r=>{this.turnLive=void 0,this.set(e,{turn:Number(r.target.value)})}} />
              <span class="hme-val mono hme-w48">${i?`${o.turn}\xB0`:"flat"}</span></div>`,void 0,"hme-grow-card")}
          ${P("Preview",m`<div class="hme-style-tiles">
            ${this.face(e,o,Tr,"Watch tile 2 \xD7 2")}
            ${this.face(e,o,Cr,"iPhone tile 4 \xD7 2")}
          </div>`,wt[o.look].title,"hme-grow-card")}
        </div>

        ${this.usesCard(e)}
      </div>`}face(e,t,o,n){let i=Sr,a=e.hass?.states,r=ji(o.width,o.height),d=Ge({floor:e.floor,states:a,...t,width:r.width,height:r.height,tileHeight:o.height,icons:e.icons}),l=kt(e.floor,a),p=6*i;return m`<figure class="hme-fr">
      <div class="hme-face" style=${`width:${o.width*i}px;height:${o.height*i}px;border-radius:${o.radius*i}px;background:${ue(t.look,i)}`}>
        <svg viewBox=${`0 0 ${r.width} ${r.height}`} aria-hidden="true"
          style=${`left:${r.x*i}px;top:${r.y*i}px;width:${r.width*i}px;height:${r.height*i}px`}>${d}</svg>
        ${o.height>90?m`<span class="hme-face-title" style=${`left:${p}px;top:${p}px;font-size:${11*i}px;color:${Fi(t.look)}`}>${Ir(e.floor)}</span>`:b}
        <span class="hme-face-words" style=${`left:${p}px;bottom:${p}px;font-size:${10*i}px;color:${zi(t.look,l>0)}`}>${xt(l)}</span>
      </div>
      <figcaption>${n}</figcaption>
    </figure>`}leave(){this.turnLive=void 0,this.usesState="idle",this.message=void 0}look(e){return ce(e.doc).look}loadUses(e){let t=e.hass;this.usesState!=="idle"||t===void 0||(this.usesState="loading",Ht(t).then(o=>{this.summary=o,this.usesState="done",e.redraw()},()=>{this.usesState="error",e.redraw()}))}usesCard(e){if(this.loadUses(e),this.usesState!=="done")return P("Used on",m`<p class="hme-text dim">${this.usesState==="error"?"Could not read your pages.":"Reading your pages\u2026"}</p>`);let t=Fa(this.summary,e.doc),o=t.filter(n=>n.own);return P(`Used on ${I(t.length,"tile")}`,m`
      ${t.length===0?m`<p class="hme-text dim">No page has a Home map tile yet. Add one from a page's Add tile.</p>`:b}
      ${t.map(n=>this.useRow(e,n))}
      ${o.length===0?b:m`<button type="button" class="hme-tb hme-wide" ?disabled=${this.busy}
        @click=${()=>{this.useHomeStyleOnAll(e,o)}}>${this.busy?"Saving\u2026":`Use the home style on all ${o.length}`}</button>`}
      ${this.message===void 0?b:m`<p class="hme-text dim" role="status">${this.message}</p>`}`)}useRow(e,t){return m`<div class="hme-use">
      <i style=${`background:${ue(t.look,.2)}`}></i>
      <div><span>${t.pageName} · ${t.what} ${t.size}</span><small>${t.words}</small></div>
      ${e.openPage===void 0?b:m`<button type="button" class="hme-tb" @click=${()=>e.openPage?.(t.pageId)}>Edit</button>`}
    </div>`}async useHomeStyleOnAll(e,t){let o=e.hass;if(o===void 0||this.busy)return;let n=[...new Set(t.map(r=>r.pageId))];if(!await e.confirm({title:`Use the home style on ${I(t.length,"tile")}?`,text:`Their own looks come off, so each draws the home style. ${n.length===1?"The page is":`The ${n.length} pages are`} saved for every watch and iPhone that shows ${n.length===1?"it":"them"}.`,ok:"Use the home style"}))return;this.busy=!0,this.message=void 0,e.redraw();let a=0;for(let r of n)try{let d=await On(o,"pages",r),l=za(d.document);l!==void 0&&await An(o,"pages",r,d.revision,l)}catch{a+=1}this.busy=!1,this.message=a===0?"Done: those tiles follow the home style now.":`${I(a,"page")} could not be saved. Try again, or open ${a===1?"it":"them"} to see why.`,this.usesState="idle",e.redraw()}};function Ir(s){return s.name.trim()===""?"Home map":s.name.trim()}var Rr="Update the Wrist Assistant integration to see the home map here.",Dr="No home map yet. Scan your rooms with the Wrist Assistant app on an iPhone or iPad with LiDAR (the Pro models). The map shows here once it is saved.",Or=4,Ar=140;function Lr(s){return s.kind==="saving"?"Saving\u2026":s.kind==="error"?"Not saved":"Saved"}var _r={night:"Night",warm:"Warm",lines:"Lines",clay:"Clay",blueprint:"Blueprint"},S=class extends Mn{constructor(){super(...arguments);this.narrow=!1;this.icons=void 0;this.iconsTick=0;this.capable=!1;this.bundleUrl=void 0;this.onHome=void 0;this.onOpenPage=void 0;this.unsupported=!1;this.loading=!1;this.styleOpen=!1;this.viewKind="both";this.artScale=0;this.stageSize={width:0,height:0};this.toggles={snap:!0,square:!0,grid:!1,measure:!1,live:!0,scan:!1};this.measure={};this.floorMenu=!1;this.model3d=!0;this.daylight=!1;this.spaceHeld=!1;this.tick=0;this.page=new po;this.stylePanel=new uo;this.loadSeq=0;this.askedOnce=!1;this.needFit=!0;this.userMoved=!1;this.touches=new Map;this.artKey="";this.artHeld=b;this.loading3d=!1;this.failed3d=!1;this.onKey=t=>{if(this.dialog!==void 0||this.session===void 0||this.renderRoot?.querySelector?.(".hme-sheet")!=null)return;let o=(typeof t.composedPath=="function"?t.composedPath()[0]:void 0)??t.target;if(tn(o))return;let n=Z(t,!1);if(n==="undo"||n==="redo"){t.preventDefault?.(),n==="undo"?this.undo():this.redo();return}if(this.styleOpen){t.key==="Escape"&&this.closeStyle();return}if(na(o))return;if(t.key===" "&&!t.repeat){this.spaceHeld=!0,t.preventDefault?.();return}let i=this.context();if(i!==void 0&&this.viewKind!=="model"&&this.page.keyDown?.(i,t)===!0){t.preventDefault?.();return}switch(n){case"cancel":this.floorMenu?this.floorMenu=!1:this.toggles.measure?this.setToggle("measure",!1):this.walls!==void 0?this.editWalls(void 0):this.selection=void 0;return;case"zoomIn":this.zoomBy(ht);return;case"zoomOut":this.zoomBy(1/ht);return;case"fit":this.fit();return}};this.onKeyUp=t=>{t.key===" "&&(this.spaceHeld=!1)}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKey),window.addEventListener("keyup",this.onKeyUp),this.askedOnce&&this.load(!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKey),window.removeEventListener("keyup",this.onKeyUp),this.endDrag?.(),this.observer?.disconnect(),this.observed=void 0,this.zoomTimer!==void 0&&clearTimeout(this.zoomTimer),this.loadSeq++,this.drop3d()}willUpdate(t){this.hass&&this.capable&&!this.askedOnce&&(this.askedOnce=!0,this.load(),this.loadPages());let o=this.baseFloor();this.needFit&&o!==void 0&&this.stageSize.width>0&&this.fit()}updated(){let t=this.renderRoot.querySelector?.(".hme-dialog");t instanceof Element&&t!==this.focusedDialog?(this.focusedDialog=t,(t.querySelector("input")??t.querySelector(".primary"))?.focus?.(),t.querySelector("input")?.select?.()):t===null&&(this.focusedDialog=void 0);let o=this.renderRoot.querySelector?.(".hme-stage");o instanceof Element&&o!==this.observed&&typeof ResizeObserver<"u"&&(this.observer??=new ResizeObserver(n=>{let i=n[n.length-1]?.contentRect;i!==void 0&&this.resizeStage(i.width,i.height)}),this.observed!==void 0&&this.observer.unobserve(this.observed),this.observer.observe(o),this.observed=o),this.view!==void 0&&this.view.scale!==this.artScale&&this.zoomTimer===void 0&&(this.zoomTimer=setTimeout(()=>{this.zoomTimer=void 0,this.view!==void 0&&(this.artScale=this.view.scale)},Ar)),this.sync3d()}input3d(){let t=this.shownFloor();if(t===void 0)return;let o=this.selection,n=Ie(o),i=fe(o),a=n.length>0?{things:n}:i===void 0?void 0:{roomId:i};return{floor:t,states:this.toggles.live?this.hass?.states:void 0,mark:a,daylight:this.daylight}}sync3d(){let t=this.renderRoot.querySelector?.(".hme-3d-host"),o=this.input3d();if(!(t instanceof HTMLElement)||o===void 0||this.bundleUrl===void 0){this.drop3d();return}if(this.scene3d!==void 0){this.scene3d.attach(t),this.scene3d.update(o,this.modelTurnNow());return}if(this.loading3d||this.failed3d)return;this.loading3d=!0;let n=mn(this.bundleUrl);to().then(i=>{if(this.loading3d=!1,!!this.isConnected){try{this.scene3d??=new i.HomeMapScene3D(n),this.scene3d.onPick=(a,r)=>this.pick3d(a,r)}catch{this.failed3d=!0}this.tick++}},()=>{this.loading3d=!1,this.failed3d=!0,this.tick++})}pick3d(t,o={add:!1}){if(this.dialog!==void 0)return;this.floorMenu=!1;let n=this.baseFloor(),i=t?.kind==="pin"&&n!==void 0?me(n,t.pinId):void 0,a=i===void 0?t:{kind:"object",roomId:i.roomId,object:i.object};if(this.walls!==void 0){(a===void 0||a.kind==="pin"||!M(a.roomId,this.walls))&&this.editWalls(void 0);return}if(o.add){a?.kind==="object"?this.select(ge(this.selection,{roomId:a.roomId,object:a.object})):a?.kind==="pin"&&this.select(Se(this.selection,a.pinId));return}this.select(a===void 0?void 0:a.kind==="pin"?{kind:"pin",pinId:a.pinId}:a.kind==="object"?{kind:"object",roomId:a.roomId,object:a.object}:{kind:"room",roomId:a.roomId})}drop3d(){this.scene3d?.dispose(),this.scene3d=void 0}turnBack(){this.modelTurn=void 0,this.scene3d?.frameFloor(ce(this.doc).turn??Wo)}async load(t=!1){let o=this.hass;if(!o||!this.capable)return;let n=++this.loadSeq;t||(this.loading=this.session===void 0,this.loadError=void 0);try{let i=await yt(o);if(n!==this.loadSeq)return;this.unsupported=!1,this.loadError=void 0,this.show({doc:Mt(i?.doc)??null,rev:typeof i?.rev=="number"?i.rev:0}),this.loadScans()}catch(i){if(n!==this.loadSeq)return;let{code:a,message:r}=Oe(i);a==="unknown_command"?this.unsupported=!0:(!t||this.session===void 0)&&(this.loadError=r)}this.loading=!1}async loadScans(){let t=this.hass;if(t)try{this.scans=await Rn(t)}catch{}}async loadPages(){let t=this.hass;if(t)try{let o=zn(await Ht(t));this.pages=jn(o,"pages").map(n=>({id:n.id,name:n.name}))}catch{this.pages=[]}}show(t){let o=this.hass;if(o&&bo(o,t),this.session===void 0)this.session=new mo(Ra(this.hassOrThrow()),t,()=>this.afterChange(),n=>{this.hass&&bo(this.hass,n)}),this.needFit=!0;else if(!this.session.load(t))return;this.afterChange()}hassOrThrow(){let t=this.hass;if(t===void 0)throw new Error("no hass");return t}afterChange(){let t=this.session?.doc?.floors??[];t.some(n=>M(n.id,this.floorId))||(this.floorId=t[0]?.id,this.needFit=!0);let o=this.walls;o!==void 0&&!(this.baseFloor()?.rooms??[]).some(n=>M(n.id,o))&&(this.walls=void 0),Yi(this.baseFloor(),this.selection)||(this.selection=void 0),this.tick++}get doc(){return this.session?.doc??null}baseFloor(){let t=this.doc?.floors??[];return t.find(o=>M(o.id,this.floorId))??t[0]}shownFloor(){let t=this.baseFloor();return t===void 0||this.previewDoc===void 0?t:this.previewDoc.floors.find(o=>M(o.id,t.id))??t}apply(t,o={}){let n=this.session;return n===void 0?!1:(this.previewDoc=void 0,n.apply(t)?(o.floorId!==void 0&&(this.floorId=o.floorId),o.select!==void 0&&(this.selection=Jo(this.baseFloor(),o.select??void 0)),this.afterChange(),!0):(this.tick++,!1))}preview(t){let o=this.doc;this.previewDoc=t===void 0||o===null?void 0:t(o)??this.previewDoc,this.tick++}undo(){this.previewDoc=void 0,this.session?.undo()===!0&&this.afterChange()}redo(){this.previewDoc=void 0,this.session?.redo()===!0&&this.afterChange()}select(t){this.selection=Jo(this.baseFloor(),t)}editWalls(t,o){let n=this.walls,i=t===void 0?void 0:this.baseFloor()?.rooms.find(d=>M(d.id,t));if(t!==void 0&&i===void 0)return;let a=this.context();a!==void 0&&!(t===void 0?n===void 0:M(t,n))&&this.page.leave?.(a),this.walls=i?.id,this.styleOpen=!1;let r=i?.id??n;this.selection=o??(r===void 0?this.selection:{kind:"room",roomId:r})}setFloor(t){let o=this.context();o!==void 0&&this.page.leave?.(o),this.floorId=t,this.walls=void 0,this.selection=void 0,this.floorMenu=!1,this.measure={},this.needFit=!0,this.userMoved=!1}setToggle(t,o){this.toggles={...this.toggles,[t]:o},t==="measure"&&(this.measure={}),t==="scan"&&o&&this.loadScans()}confirm(t){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(o=>{this.dialog={kind:"confirm",...t,done:n=>{this.dialog=void 0,o(n)}}})}ask(t){return this.dialog?.kind==="confirm"?this.dialog.done(!1):this.dialog?.done(void 0),new Promise(o=>{this.dialog={kind:"ask",...t,done:n=>{this.dialog=void 0,o(n)}}})}resizeStage(t,o){let n=this.stageSize.width===0;this.stageSize={width:t,height:o},(n||!this.userMoved)&&(this.needFit=!0)}fit(){let{width:t,height:o}=this.stageSize;t<=0||(this.view=Qo(this.baseFloor(),t,o),this.artScale=this.view.scale,this.needFit=!1,this.userMoved=!1)}zoomBy(t,o){this.view!==void 0&&(this.view=en(this.view,t,o??[this.stageSize.width/2,this.stageSize.height/2]),this.userMoved=!0)}context(){let t=this.doc,o=this.shownFloor();if(t===null||o===void 0)return;let n=this.view??{scale:40,ox:0,oy:0},i=this.session;return{hass:this.hass,icons:this.icons,doc:t,floor:o,selection:this.selection,walls:this.walls,view:n,stage:this.stageSize,toggles:this.toggles,pages:this.pages??[],areas:In(this.hass),scans:this.scans,furnitureBase:this.bundleUrl===void 0?void 0:mn(this.bundleUrl),canUndo:i?.canUndo??!1,canRedo:i?.canRedo??!1,toScreen:a=>Qi(n,a),px:a=>a*n.scale,toPlan:(a,r)=>this.toPlan(a,r),apply:(a,r)=>this.apply(a,r),preview:a=>this.preview(a),select:a=>this.select(a),editWalls:(a,r)=>this.editWalls(a,r),setFloor:a=>this.setFloor(a),setToggle:(a,r)=>this.setToggle(a,r),drag:(a,r)=>this.drag(a,r),undo:()=>this.undo(),redo:()=>this.redo(),confirm:a=>this.confirm(a),ask:a=>this.ask(a),newId:()=>wo(),note:(a,r)=>{this.session!==void 0&&(this.session.note={kind:a,text:r}),this.tick++},redraw:()=>{this.tick++},openPage:this.onOpenPage}}toPlan(t,o){let n=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return Re(this.view??{scale:40,ox:0,oy:0},[t-n.left,o-n.top])}stagePoint(t){let o=this.stageEl?.getBoundingClientRect()??{left:0,top:0};return[t.clientX-o.left,t.clientY-o.top]}drag(t,o){let n=this.stageEl;if(n===void 0)return;this.endDrag?.();let i=t.clientX,a=t.clientY,r=!1,d,l=0,p=typeof requestAnimationFrame=="function"?requestAnimationFrame:void 0,h=()=>{l=0,d!==void 0&&o.move(this.toPlan(d.clientX,d.clientY),d)};try{n.setPointerCapture?.(t.pointerId)}catch{}let u=w=>{let v=w;v.pointerId===t.pointerId&&(!r&&Math.hypot(v.clientX-i,v.clientY-a)<Or||(r=!0,d=v,p===void 0?h():l===0&&(l=p(h))))},f=w=>{let v=w;v.pointerId===t.pointerId&&(g(),l!==0&&(cancelAnimationFrame(l),h()),o.end(this.toPlan(v.clientX,v.clientY),v,r))},g=()=>{n.removeEventListener("pointermove",u),n.removeEventListener("pointerup",f),n.removeEventListener("pointercancel",f);try{n.releasePointerCapture?.(t.pointerId)}catch{}this.endDrag===c&&(this.endDrag=void 0)},c=()=>{g(),l!==0&&(cancelAnimationFrame(l),l=0),o.cancel?.()};n.addEventListener("pointermove",u),n.addEventListener("pointerup",f),n.addEventListener("pointercancel",f),this.endDrag=c}onStageDown(t){if(this.stageEl=t.currentTarget,this.floorMenu=!1,this.dialog!==void 0)return;if(t.pointerType==="touch"&&(this.touches.set(t.pointerId,[t.clientX,t.clientY]),this.touches.size===2)){this.endDrag?.(),this.preview(void 0),this.pinch();return}if(this.viewKind==="model"){this.turnModel(t);return}if(t.button===1||this.spaceHeld){t.preventDefault?.(),this.pan(t,!1);return}if(t.button!==0)return;let o=this.context();if(o===void 0)return;if(this.toggles.measure){let i=this.toPlan(t.clientX,t.clientY),a=this.measure;this.measure=a.a===void 0||a.b!==void 0?{a:i}:{a:a.a,b:i};return}let n=this.toPlan(t.clientX,t.clientY);if(this.page.pointerDown?.(o,t,n)===!0){t.preventDefault?.();return}this.pan(t,!0)}onStageDblClick(t){if(this.stageEl=t.currentTarget,this.dialog!==void 0||this.viewKind==="model"||this.toggles.measure||this.spaceHeld||t.button!==0)return;let o=this.context();o!==void 0&&this.page.doubleClick?.(o,t,this.toPlan(t.clientX,t.clientY))}onStageMove(t){if(this.stageEl=t.currentTarget,this.touches.has(t.pointerId)&&this.touches.set(t.pointerId,[t.clientX,t.clientY]),t.buttons!==0||this.viewKind==="model")return;let o=this.toPlan(t.clientX,t.clientY);this.toggles.measure&&this.measure.a!==void 0&&this.measure.b===void 0&&(this.measure={...this.measure,hover:o});let n=this.context();n!==void 0&&this.page.hover?.(n,o)}onStageLeave(){let t=this.context();t!==void 0&&this.page.hover?.(t,void 0)}onStageUp(t){this.touches.delete(t.pointerId)}onStageDrag(t){this.stageEl=t.currentTarget;let o=this.context();o===void 0||this.viewKind==="model"||this.dialog!==void 0||this.page.dragOver?.(o,this.toPlan(t.clientX,t.clientY),t)===!0&&(t.preventDefault?.(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"))}onStageDragLeave(t){let o=t.relatedTarget,n=t.currentTarget;if(o!==null&&n!==null&&typeof n.contains=="function"&&n.contains(o))return;let i=this.context();i!==void 0&&this.page.dragOver?.(i,void 0,t)}onStageDrop(t){this.stageEl=t.currentTarget;let o=this.context();o===void 0||this.viewKind==="model"||(t.preventDefault?.(),this.page.drop?.(o,this.toPlan(t.clientX,t.clientY),t))}pan(t,o){let n=this.view;if(n===void 0)return;let i=t.clientX,a=t.clientY;this.drag(t,{move:(r,d)=>{this.view={...n,ox:n.ox+d.clientX-i,oy:n.oy+d.clientY-a},this.userMoved=!0},end:(r,d,l)=>{!l&&o&&(this.selection=void 0)}})}pinch(){let t=this.stageEl,o=this.view,n=[...this.touches.keys()];if(t===void 0||o===void 0||n.length<2)return;let i=()=>n.map(f=>this.touches.get(f)),[a,r]=i(),d=Math.max(Math.hypot(r[0]-a[0],r[1]-a[1]),1),l=t.getBoundingClientRect(),p=[(a[0]+r[0])/2-l.left,(a[1]+r[1])/2-l.top],h=f=>{let g=f;if(!this.touches.has(g.pointerId))return;this.touches.set(g.pointerId,[g.clientX,g.clientY]);let[c,w]=i(),v=Math.max(Math.hypot(w[0]-c[0],w[1]-c[1]),1),y=[(c[0]+w[0])/2-l.left,(c[1]+w[1])/2-l.top],E=en(o,v/d,p);this.view={...E,ox:E.ox+y[0]-p[0],oy:E.oy+y[1]-p[1]},this.userMoved=!0},u=f=>{this.touches.delete(f.pointerId),t.removeEventListener("pointermove",h),t.removeEventListener("pointerup",u),t.removeEventListener("pointercancel",u)};t.addEventListener("pointermove",h),t.addEventListener("pointerup",u),t.addEventListener("pointercancel",u)}turnModel(t){let o=this.modelTurnNow(),n=t.clientX;this.drag(t,{move:(i,a)=>{let r=o+(a.clientX-n)*.5;r=((r+180)%360+360)%360-180,this.modelTurn=Math.round(r)},end:()=>{}})}modelTurnNow(){return this.modelTurn??ce(this.doc).turn??Wo}modelLookNow(){if(this.modelLook!==void 0)return this.modelLook;let t=ce(this.doc).look;return lt.includes(t)?t:"night"}onWheel(t){if(this.viewKind==="model"||this.view===void 0)return;this.stageEl=t.currentTarget,t.preventDefault?.();let o=t.deltaMode===1?16:t.deltaMode===2?400:1;if(t.ctrlKey||t.metaKey){this.zoomBy(Math.exp(-t.deltaY*o*.0025),this.stagePoint(t));return}this.view={...this.view,ox:this.view.ox-t.deltaX*o,oy:this.view.oy-t.deltaY*o},this.userMoved=!0}toggleStyle(){if(this.styleOpen){this.closeStyle();return}this.floorMenu=!1,this.styleOpen=!0}closeStyle(){this.styleOpen=!1,this.stylePanel.leave()}render(){if(this.tick,!this.capable||this.unsupported)return this.calm(m`<b>${Rr}</b>`);if(this.loadError!==void 0)return this.calm(m`<span>Could not read the home map: ${this.loadError}</span>
        <button class="hme-tb" @click=${()=>{this.load()}}>Try again</button>`);if(this.loading||this.session===void 0)return this.calm(m`Loading…`);let t=this.doc;if(t===null||t.floors.length===0)return this.calm(m`<b>${Dr}</b>`);let o=this.context(),n=this.session.note;return m`<div class="hme">
      ${this.renderBar(t,o)}
      ${n===void 0?b:m`<div class="hme-note ${n.kind}" role="status"><span>${n.text}</span>
        <button class="hme-link" @click=${()=>this.session?.dismissNote()}>Dismiss</button></div>`}
      <div class="hme-body">
        <aside class="hme-rail" aria-label=${this.walls===void 0?"Layers":"Walls"}>${this.page.rail(o)}</aside>
        <section class="hme-stage-wrap">${this.renderStage(o)}</section>
        <aside class="hme-insp" aria-label="Inspector">${this.page.inspector(o)}</aside>
      </div>
      ${this.page.sheet?.(o)??b}
      ${this.renderDialog()}
    </div>`}calm(t){return m`<div class="hme-calm"><div class="hme-empty">${t}</div></div>`}renderBar(t,o){let n=this.baseFloor(),i=this.session?.state??{kind:"saved"},a=on(),r=this.walls===void 0?void 0:n.rooms.find(l=>M(l.id,this.walls)),d=ce(t).look;return m`<header class="hme-bar">
      ${this.onHome===void 0?b:m`<button type="button" class="hme-back" @click=${()=>this.onHome?.()}>‹ Home</button><span class="hme-vsep"></span>`}
      <strong class="hme-title">Home map</strong><span class="hme-beta">BETA</span>
      ${r===void 0?b:m`<span class="hme-crumb-sep" aria-hidden="true">›</span>
        <strong class="hme-title hme-crumb">${T(r)} walls</strong>`}
      <div class="hme-floor-wrap">
        <button type="button" class="hme-tb hme-floor-btn" aria-label="Switch floor" aria-haspopup="menu" aria-expanded=${this.floorMenu?"true":"false"}
          @click=${()=>{this.floorMenu=!this.floorMenu}}>
          ${ln(n)}
          <span class="hme-floor-t"><span>${z(n)}</span><small>${I(n.rooms.length,"room")} · ${I(n.pins.length,"device")}</small></span>
          <span class="hme-caret" aria-hidden="true">▾</span>
        </button>
        ${this.floorMenu?this.renderFloorMenu(t,n):b}
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
        ${this.styleOpen?this.stylePanel.panel(o,()=>this.closeStyle()):b}
      </div>
      <button type="button" class="hme-tb hme-icon" aria-label="Undo" title=${`Undo (${a?"\u2318Z":"Ctrl+Z"})`} ?disabled=${!o.canUndo} @click=${()=>this.undo()}>↶</button>
      <button type="button" class="hme-tb hme-icon" aria-label="Redo" title=${`Redo (${a?"\u21E7\u2318Z":"Ctrl+Shift+Z"})`} ?disabled=${!o.canRedo} @click=${()=>this.redo()}>↷</button>
      <span class="hme-status ${i.kind}" role="status" title=${i.kind==="error"?i.text:b}><span class="hme-status-dot"></span>${Lr(i)}</span>
    </header>`}renderStyleButton(t){return m`<button type="button" class="hme-tb hme-style-btn ${this.styleOpen?"on":""}" aria-haspopup="dialog" aria-expanded=${this.styleOpen?"true":"false"}
      title="How every map tile looks, unless a tile picks its own" @click=${()=>this.toggleStyle()}>
      <span class="hme-style-sw" style=${`background:${ue(t,.2)}`} aria-hidden="true"></span>Home style</button>`}renderFloorMenu(t,o){return m`<div class="hme-pop" role="menu" aria-label="Floors">
      ${t.floors.map(n=>m`<div class="hme-pop-row ${M(n.id,o.id)?"on":""}">
        <button type="button" role="menuitem" class="hme-pop-main" @click=${()=>this.setFloor(n.id)}>
          ${ln(n)}<span class="hme-floor-t"><span>${z(n)}</span><small>${I(n.rooms.length,"room")} · ${I(n.pins.length,"device")}</small></span></button>
        <button type="button" class="hme-pop-act" title="Rename" aria-label=${`Rename ${z(n)}`} @click=${()=>{this.renameFloorAsk(n)}}>Rename</button>
        <button type="button" class="hme-pop-act danger" title=${t.floors.length===1?"The map keeps at least one floor":"Delete"} aria-label=${`Delete ${z(n)}`}
          ?disabled=${t.floors.length===1} @click=${()=>{this.deleteFloorAsk(n)}}>Delete</button>
      </div>`)}
      <button type="button" class="hme-pop-add" @click=${()=>{this.addFloorAsk()}}>＋ Add a floor</button>
    </div>`}async addFloorAsk(){this.floorMenu=!1;let t=this.doc;if(t===null)return;let o=Math.max(...t.floors.map(a=>a.story))+1,n=await this.ask({title:"Add a floor",label:"Name",value:o===1?"Upstairs":`Floor ${o+1}`,ok:"Add floor"});if(n===void 0)return;let i=wo();this.apply(a=>Qn(a,{id:i,name:n,story:o}),{floorId:i,select:null})&&(this.needFit=!0)}async renameFloorAsk(t){this.floorMenu=!1;let o=await this.ask({title:"Rename floor",label:"Name",value:t.name||z(t),ok:"Rename"});o!==void 0&&this.apply(n=>It(n,t.id,o))}async deleteFloorAsk(t){this.floorMenu=!1,await this.confirm({title:`Delete ${z(t)}?`,text:`Its ${I(t.rooms.length,"room")} and ${I(t.pins.length,"device")} come off the map. Undo brings them back while this page is open.`,ok:"Delete floor",danger:!0})&&this.apply(n=>ei(n,t.id),{select:null})}renderStage(t){let o=this.page,{width:n,height:i}=this.stageSize,a=this.viewKind==="model",r=this.viewKind==="both",d=a?b:o.pill?.(t)??b,l=a?b:o.banner?.(t)??b,p=this.spaceHeld?"grab":a?"ew-resize":this.toggles.measure?"crosshair":o.cursor?.(t)??"default",h=t.floor.rooms.length===0,u=this.model3d&&this.bundleUrl!==void 0,f=r?u?m`<div class="hme-stage model hme-split-r hme-3d">
      ${this.render3d(t)}
      ${this.renderModelDock(!1)}
    </div>`:m`<div class="hme-stage model hme-split-r" style=${`background:${ue(this.modelLookNow())}`}>
      <svg class="hme-svg" width="100%" height="100%" viewBox=${`0 0 ${Math.max(n,1)} ${Math.max(i,1)}`} style="cursor:ew-resize"
        role="img" aria-label=${`Model of ${z(t.floor)}`}
        @pointerdown=${c=>this.onModelDown(c)}>
        ${this.renderModel(t,n,i)}
      </svg>
      ${this.renderModelDock(!1)}
    </div>`:b;if(a&&u)return m`<div class="hme-stage model hme-3d">
        ${this.render3d(t)}
        ${this.renderDock(t)}
      </div>`;let g=this.walls!==void 0&&!a;return m`<div class="hme-stage ${a?"model":""} ${r?"hme-split-l":""} ${g?"walls":""}" style=${a?`background:${ue(this.modelLookNow())}`:""}>
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
        ${a?this.renderModel(t,n,i):this.renderPlan(t,n,i)}
      </svg>
      ${l===b?b:m`<div class="hme-banner">${l}</div>`}
      ${d===b?b:m`<div class="hme-pill ${l===b?"":"under"}">${d}</div>`}
      ${a?b:o.stageExtra?.(t)??b}
      ${h&&!a&&!o.arrange.draw.active?m`<div class="hme-stage-empty"><b>No rooms on this floor yet.</b>
        <span>Draw one by hand, or scan this floor with the iPhone.</span>
        <button type="button" class="hme-tb" @click=${()=>{let c=this.context();c&&o.startDrawing(c)}}>＋ Draw a room by hand</button></div>`:b}
      ${this.renderDock(t)}
    </div>${f}`}onModelDown(t){this.dialog!==void 0||t.button!==0||(this.stageEl=t.currentTarget,this.floorMenu=!1,this.turnModel(t))}renderPlan(t,o,n){let i=this.view;if(i===void 0||o<=0)return b;let a=this.planArt(t.floor,o,n,this.page.drawsPins?.(t)===!0?"none":"all"),r=i.scale/(this.artScale||i.scale);return $`${this.background(i,o,n)}
      <g class="hme-art" transform=${`translate(${i.ox.toFixed(2)} ${i.oy.toFixed(2)}) scale(${r.toFixed(5)})`} pointer-events="none">${a}</g>
      <g class="hme-labels" pointer-events="none">${this.labels(t)}</g>
      <g class="hme-overlay">${this.page.overlay(t)}</g>
      ${this.toggles.measure?this.measureMarks(t):b}`}planArt(t,o,n,i){let a=this.toggles.live?this.hass?.states:void 0,r=this.artScale||this.view.scale,d=`${zr(t)}|${wn(a)}|${r}|${o}|${n}|${this.iconsTick}|${wn(this.icons)}|${i}`;return d!==this.artKey&&(this.artKey=d,this.artHeld=Ge({floor:t,states:a,look:"plan",names:!1,devices:i,furniture:!0,glow:!0,width:o,height:n,icons:this.icons,frame:{scale:r,ox:0,oy:0}})),this.artHeld}background(t,o,n){let i=this.walls!==void 0?we:ve,a=20;if(this.toggles.grid)for(a=i*t.scale;a<8;)a*=10;let r=(t.ox%a+a)%a,d=(t.oy%a+a)%a;return $`<defs><pattern id="hme-bg" width=${a} height=${a} patternUnits="userSpaceOnUse" patternTransform=${`translate(${r.toFixed(1)} ${d.toFixed(1)})`}>
        ${this.toggles.grid?$`<path d=${`M${a} 0V${a}H0`} fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1" />`:$`<circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.09)" />`}
      </pattern></defs>
      <rect class="hme-bg" width=${o} height=${n} fill="url(#hme-bg)" />`}labels(t){return t.floor.rooms.map(o=>{let n=V(o),i=$e(o.outline);if(n===void 0||i===void 0)return b;let a=T(o),r=Ue(o),d=(i.maxX-i.minX)*t.view.scale,l=(i.maxY-i.minY)*t.view.scale,p=a.length*7.4+22;if(p>d*.95||l<26)return b;let h=Math.max(p,r.length*5.8+22)<=d*.95&&l>=48,u=h?Math.max(p,r.length*5.8+22):p,f=h?36:22,[g,c]=t.toScreen(n);return $`<g class="hme-label"><rect x=${(g-u/2).toFixed(1)} y=${(c-f/2).toFixed(1)} width=${u.toFixed(1)} height=${f} rx=${h?9:7} fill="rgba(0,0,0,0.6)" />
        <text x=${g.toFixed(1)} y=${(c+(h?-3:4.5)).toFixed(1)} fill="#fff" font-size=${h?13:12} font-weight="600" text-anchor="middle">${a}</text>
        ${h?$`<text x=${g.toFixed(1)} y=${(c+11).toFixed(1)} fill="#aeaeb2" font-size="10" text-anchor="middle">${r}</text>`:b}</g>`})}measureMarks(t){let o=this.measure;if(o.a===void 0)return $`<g class="hme-measure"></g>`;let n=o.b??o.hover,i=t.toScreen(o.a);if(n===void 0)return $`<g class="hme-measure" pointer-events="none"><circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" /></g>`;let a=t.toScreen(n),r=Math.hypot(n[0]-o.a[0],n[1]-o.a[1]),d=[(i[0]+a[0])/2,(i[1]+a[1])/2];return $`<g class="hme-measure" pointer-events="none">
      <line x1=${i[0]} y1=${i[1]} x2=${a[0]} y2=${a[1]} stroke="#ff9f0a" stroke-width="2" stroke-dasharray=${o.b===void 0?"6 4":"none"} />
      <circle cx=${i[0]} cy=${i[1]} r="5" fill="#ff9f0a" /><circle cx=${a[0]} cy=${a[1]} r="5" fill="#ff9f0a" />
      <g class="hme-tag"><rect x=${(d[0]-32).toFixed(1)} y=${(d[1]-22).toFixed(1)} width="64" height="20" rx="10" fill="#ff9f0a" />
      <text x=${d[0].toFixed(1)} y=${(d[1]-8).toFixed(1)} fill="#2a1a00" text-anchor="middle">${r.toFixed(2)} m</text></g></g>`}renderModel(t,o,n){if(o<=0)return b;let i=this.selection,a=fe(i),r=a===void 0?void 0:t.floor.rooms.find(p=>M(p.id,a)),d=Ie(i).flatMap(p=>t.floor.rooms.find(h=>M(h.id,p.roomId))?.objects[p.object]??[]),l=d.length>0?{boxes:d}:r!==void 0?{outline:r.outline}:void 0;return Ge({mark:l,floor:t.floor,states:this.toggles.live?this.hass?.states:void 0,look:this.modelLookNow(),turn:this.modelTurnNow(),names:!0,devices:"lights",furniture:!0,glow:!0,width:o,height:n})}render3d(t){let o=this.failed3d?"The 3D view needs WebGL, which this browser has turned off.":this.scene3d===void 0?"Loading the 3D view\u2026":void 0;return m`<div class="hme-3d-host" role="img" aria-label=${`3D model of ${z(t.floor)}. Drag to turn it, scroll to zoom, click a thing to pick it.`}></div>
      ${o===void 0?b:m`<div class="hme-3d-note">${o}</div>`}`}renderModelDock(t,o){let n=this.model3d&&this.bundleUrl!==void 0,i=n?void 0:this.modelLookNow(),a=r=>r?"true":"false";return m`<div class="hme-dock">
      ${lt.map(r=>m`<button type="button" class="hme-tb ${r===i?"on":""}" aria-pressed=${a(r===i)} @click=${()=>{this.modelLook=r,this.model3d=!1}}>${_r[r]}</button>`)}
      ${this.bundleUrl===void 0?b:m`<button type="button" class="hme-tb ${n?"on":""}" aria-pressed=${a(n)}
        title="The floor in real 3D, with its furniture and each light lit as it is now" @click=${()=>{this.model3d=!0}}>3D</button>`}
      ${n?m`<span class="hme-vsep"></span>
        <button type="button" class="hme-tb ${this.daylight?"":"on"}" aria-pressed=${a(!this.daylight)} title="Night: only the lights that are on light the rooms"
          @click=${()=>{this.daylight=!1}}>Lights</button>
        <button type="button" class="hme-tb ${this.daylight?"on":""}" aria-pressed=${a(this.daylight)} title="Day: the sun comes in through the windows"
          @click=${()=>{this.daylight=!0}}>Daylight</button>`:b}
      <span class="hme-vsep"></span>
      <button type="button" class="hme-tb" title=${n?"Show the whole floor from the home style's turn":"Back to the home style's turn"} @click=${()=>this.turnBack()}>⟲ Turn back</button>
      ${t&&o!==void 0?m`<span class="hme-vsep"></span>${o}`:b}
    </div>`}renderDock(t){let o=m`<button type="button" class="hme-tb ${this.toggles.live?"on":""}" aria-pressed=${this.toggles.live?"true":"false"}
      title="Draw what Home Assistant's devices are doing now" @click=${()=>this.setToggle("live",!this.toggles.live)}><span class="hme-live-dot"></span>Live states</button>`;if(this.viewKind==="model")return this.renderModelDock(!0,o);let n=this.stageSize.width>0?Qo(this.baseFloor(),this.stageSize.width,this.stageSize.height):void 0,i=this.view===void 0||n===void 0?100:ea(this.view,n);return m`<div class="hme-dock">
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom out" @click=${()=>this.zoomBy(1/ht)}>−</button>
      <span class="hme-zoom mono">${i}%</span>
      <button type="button" class="hme-tb hme-icon" aria-label="Zoom in" @click=${()=>this.zoomBy(ht)}>＋</button>
      <button type="button" class="hme-tb" @click=${()=>this.fit()}>Fit</button>
      <span class="hme-vsep"></span>
      ${this.page.dock?.(t)??b}
      <span class="hme-vsep"></span>${o}
    </div>`}renderDialog(){let t=this.dialog;if(t===void 0)return b;let o=()=>t.kind==="confirm"?t.done(!1):t.done(void 0),n=i=>{t.kind==="confirm"?t.done(!0):t.done((i?.querySelector("input")?.value??t.value).trim()||t.value)};return m`<div class="hme-scrim" @pointerdown=${i=>{i.target===i.currentTarget&&o()}}>
      <div class="hme-dialog" role="dialog" aria-modal="true" aria-label=${t.title}
        @keydown=${i=>{i.key==="Escape"&&(i.stopPropagation(),o()),i.key==="Enter"&&(i.preventDefault(),n(i.currentTarget))}}>
        <h3>${t.title}</h3>
        ${t.kind==="confirm"?t.text===void 0?b:m`<p>${t.text}</p>`:m`<label class="hme-dialog-field"><span>${t.label}</span><input type="text" maxlength="100" .value=${t.value} autofocus /></label>`}
        <div class="hme-dialog-row">
          <button type="button" class="hme-tb" @click=${o}>Cancel</button>
          <button type="button" class="hme-tb primary ${t.kind==="confirm"&&t.danger===!0?"danger-fill":""}"
            @click=${i=>n(i.currentTarget.closest(".hme-dialog"))}>${t.ok}</button>
        </div>
      </div>
    </div>`}static{this.styles=[Dn,kn,La]}};R([ae({attribute:!1})],S.prototype,"hass",2),R([ae({type:Boolean,reflect:!0})],S.prototype,"narrow",2),R([ae({attribute:!1})],S.prototype,"icons",2),R([ae({attribute:!1})],S.prototype,"iconsTick",2),R([ae({attribute:!1})],S.prototype,"capable",2),R([ae({attribute:!1})],S.prototype,"bundleUrl",2),R([ae({attribute:!1})],S.prototype,"onHome",2),R([ae({attribute:!1})],S.prototype,"onOpenPage",2),R([L()],S.prototype,"unsupported",2),R([L()],S.prototype,"loading",2),R([L()],S.prototype,"loadError",2),R([L()],S.prototype,"floorId",2),R([L()],S.prototype,"selection",2),R([L()],S.prototype,"walls",2),R([L()],S.prototype,"styleOpen",2),R([L()],S.prototype,"viewKind",2),R([L()],S.prototype,"view",2),R([L()],S.prototype,"artScale",2),R([L()],S.prototype,"stageSize",2),R([L()],S.prototype,"toggles",2),R([L()],S.prototype,"scans",2),R([L()],S.prototype,"measure",2),R([L()],S.prototype,"floorMenu",2),R([L()],S.prototype,"dialog",2),R([L()],S.prototype,"modelLook",2),R([L()],S.prototype,"model3d",2),R([L()],S.prototype,"daylight",2),R([L()],S.prototype,"modelTurn",2),R([L()],S.prototype,"pages",2),R([L()],S.prototype,"spaceHeld",2),R([L()],S.prototype,"tick",2);var ja=new WeakMap,Fr=1;function wn(s){if(s===void 0)return 0;let e=ja.get(s);return e===void 0&&ja.set(s,e=Fr++),e}var zr=s=>wn(s);customElements.get("wa-home-map-editor")||customElements.define("wa-home-map-editor",S);export{Or as HOME_MAP_DRAG_SLOP,Dr as HOME_MAP_EMPTY_TEXT,Rr as HOME_MAP_UPDATE_TEXT,S as WaHomeMapEditor,Lr as homeMapSaveWords};
