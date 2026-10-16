import{o as nn,p as $e,q,r as Se,s as _e,w as an,x as cn,y as dn,z as ln}from"./chunk-PEI2F5V4.js";import{b as Dt,c as ge,d as Nt,e as ve,f as It}from"./chunk-ZOJGMATP.js";import{a as xe,b as ke,c as Kt,d as Bt,e as qt,f as Vt,g as Jt,h as Wt,i as Yt}from"./chunk-TTDCUFFY.js";import{d as Qt}from"./chunk-X4R246ZI.js";import{a as zt,b as Ut,f as on,g as rn}from"./chunk-N7K2FYKB.js";import{c as Zt,d as Gt,f as Xt}from"./chunk-SVP5CX7B.js";import{Bb as Ft,Db as jt,R as Ht,c as lt,lb as At,lc as se,mb as Lt,mc as un,nb as Mt,nc as pn,qb as ye,ub as Pt,za as we}from"./chunk-4WNGCTEO.js";import{P as be,U as Ce}from"./chunk-C5WTPD4K.js";import{O as tn,Q as T,R as sn,i as en,j as _}from"./chunk-ESIOP3D4.js";import{A as Et,B as Ot,d as B,h as ut,j as pt,k as ht,l as ft,m as mt,n as gt,o as vt,p as bt,y as Ct,z as Tt}from"./chunk-LKYM7RHJ.js";import{Eg as ie,Gg as me,Kg as st,Lg as at,Mg as ct,Ng as dt,b as oe,d,g,ig as it,j as ot,jg as rt,k as S,kh as k,l as y}from"./chunk-IHFAZWMC.js";import{A as wt,P as yt,Ra as _t,T as re,Ta as Rt,Ua as O,W as xt,Y as kt,Z as $t,da as St}from"./chunk-RXIM2BXJ.js";import{a as v}from"./chunk-LO2NM3CE.js";var hn={toggleDomains:["light","switch","fan","input_boolean","lock","cover"],actionDomains:["scene","script","automation"],defaultIcons:{light:"lightbulb",switch:"switch.2",fan:"fan",lock:"lock",cover:"blinds.horizontal.closed",scene:"play",script:"scroll",automation:"gearshape.2",input_boolean:"togglepower"},fallbackIcon:"circle",requiredKeys:["entityId","displayName","iconName","domain"],optionalKeys:["customIconName","customDisplayName","tintColorHex","isHidden","schemaVersion"]};var F=hn,fn="#0A84FF";function E(e){return F.toggleDomains.includes(e)?"toggle":F.actionDomains.includes(e)?"action":"none"}function V(){return[...F.toggleDomains,...F.actionDomains]}function mn(e){let o=F.defaultIcons;return Object.hasOwn(o,e)?o[e]:F.fallbackIcon}function gn(e,o){if(E(e)!=="toggle"||o===void 0)return;let t=o.toLowerCase();return e==="lock"?t==="unlocked":e==="cover"?t==="open":t==="on"}var Te=["customIconName","customDisplayName","tintColorHex"];var $="entities",co=1,vn=en;function Ee(e){return _(e)?e:void 0}function bn(){return{schemaVersion:co,[$]:[]}}function Oe(e){let o=tn(e),t=o/vn;return{size:o,limit:vn,share:t,near:t>.8}}function W(e){let o=Object.hasOwn(e,$)?e[$]:void 0;return Array.isArray(o)?o:[]}function H(e){return e===void 0?[]:W(e).filter(_)}function I(e){return typeof e=="string"?e:void 0}function R(e){let o={entityId:I(e.entityId)??"",displayName:I(e.displayName)??"",iconName:I(e.iconName)??"",domain:I(e.domain)??"",isHidden:e.isHidden===!0},t=I(e.customIconName),n=I(e.customDisplayName),i=I(e.tintColorHex);return t!==void 0&&(o.customIconName=t),n!==void 0&&(o.customDisplayName=n),i!==void 0&&(o.tintColorHex=i),o}function Y(e){return e.customDisplayName??e.displayName}function ae(e){return e.customIconName??e.iconName}function Z(e){return E(e.domain)!=="none"}function Cn(e){return Te.some(o=>Object.hasOwn(e,o)&&e[o]!==null)}function Re(e,o){return H(e).find(t=>t.entityId===o)}function De(e,o){return Re(e,o)!==void 0}function J(e,o,t){o==="__proto__"?Object.defineProperty(e,o,{value:t,enumerable:!0,writable:!0,configurable:!0}):e[o]=t}function Ne(e,o,t){if(Object.hasOwn(e,o)){if(T(e[o],t)&&typeof e[o]==typeof t)return e;let r={};for(let s of Object.keys(e))J(r,s,s===o?t:e[s]);return r}let n={},i=!1;for(let r of Object.keys(e))!i&&r>o&&(J(n,o,t),i=!0),J(n,r,e[r]);return i||J(n,o,t),n}function Ie(e,o){if(!Object.hasOwn(e,o))return e;let t={};for(let n of Object.keys(e))n!==o&&J(t,n,e[n]);return t}function ce(e,o){return Ne(e,$,o)}function He(e,o,t){let n=W(e),i=n.findIndex(c=>_(c)&&c.entityId===o);if(i<0)return e;let r=n[i],s=t(r);if(s===r)return e;let a=n.slice();return a[i]=s,ce(e,a)}function Ae(e){let o=e.indexOf(".");return o<0?"":e.slice(0,o)}function j(e,o){let n=(e===void 0||!Object.hasOwn(e,o)?void 0:e[o])?.attributes?.friendly_name;return typeof n=="string"&&n.trim()!==""?n:o}var lo=1;function uo(e,o){let t=Ae(e);return{displayName:j(o,e),domain:t,entityId:e,iconName:mn(t),schemaVersion:lo}}function wn(e,o,t){let n=new Set(H(e).map(a=>I(a.entityId)??"")),i=[],r=[],s=[];for(let a of o){let c=a.trim();if(c===""||n.has(c)){r.push(a);continue}n.add(c),i.push(c),s.push(uo(c,t))}return s.length===0?{document:e,added:i,refused:r}:{document:ce(e,[...W(e),...s]),added:i,refused:r}}function Le(e,o){let t=W(e),n=t.filter(i=>!(_(i)&&i.entityId===o));return n.length===t.length?e:ce(e,n)}function Me(e,o,t){let n=W(e),i=n.findIndex(c=>_(c)&&c.entityId===o);if(i<0)return e;let r=Math.max(0,Math.min(t,n.length-1));if(i===r)return e;let s=n.slice(),[a]=s.splice(i,1);return s.splice(r,0,a),ce(e,s)}function Pe(e,o,t,n){return He(e,o,i=>n===void 0||n===""?Ie(i,t):Ne(i,t,n))}function yn(e,o,t){return Pe(e,o,"customDisplayName",t)}function xn(e,o,t){return Pe(e,o,"customIconName",t.trim())}function Fe(e,o,t){return t!==void 0&&!/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(t)?e:Pe(e,o,"tintColorHex",t===void 0?void 0:t.toUpperCase())}function je(e,o,t){return He(e,o,n=>t?Ne(n,"isHidden",!0):Ie(n,"isHidden"))}function kn(e,o){return He(e,o,t=>{let n=t;for(let i of Te)n=Ie(n,i);return n})}function $n(e){if(!_(e))return["The Control Center list is not an object."];let o=Object.hasOwn(e,$)?e[$]:void 0;if(!Array.isArray(o))return["The Control Center list is missing."];let t=[],n=new Set;return o.forEach((i,r)=>{if(!_(i)){t.push(`Entry ${r+1} is not an object.`);return}let s=i.entityId,a=typeof s=="string"&&s!==""?s:`Entry ${r+1}`;typeof s!="string"||s===""?t.push(`${a} has no entity.`):(n.has(s)&&t.push(`${a} is on the list twice.`),n.add(s));for(let c of["displayName","iconName","domain"])typeof i[c]!="string"&&t.push(`${a} has no ${c}.`)}),t}function Sn(e){let o=H(Ee(e)).map(R),t=o.filter(i=>i.isHidden).length,n=o.length;return`${n} ${n===1?"entity":"entities"}${t>0?`, ${t} hidden`:""}.`}var _n="Start with an empty list",Tn="Update the integration to edit the Control Center list here.";function En(e){let o=O(e).code;return o==="invalid"||o==="unknown_command"}function A(e,o){return e!=null&&Object.hasOwn(e,o)?e[o]:void 0}function G(e){if(!Array.isArray(e))return;let o=new Set,t=[];for(let n of e){if(!_(n)||typeof n.entityId!="string"||n.entityId===""||o.has(n.entityId))return;o.add(n.entityId),t.push([n.entityId,n])}return t}function po(e,o){let t=G(e),n=G(o);if(t===void 0||n===void 0)return e;let i=new Set(n.map(([r])=>r));return t.filter(([r])=>i.has(r)).map(([,r])=>r)}function On(e){if(e===void 0)return"";let o=e.customDisplayName;return typeof o=="string"&&o!==""?o:typeof e.displayName=="string"?e.displayName:""}function Rn(e,o,t){let n=e===null?void 0:e,i=o===null?void 0:o,r=t===null?void 0:t,s=n===void 0?[]:G(n),a=i===void 0?void 0:G(i),c=r===void 0?void 0:G(r);if(s===void 0||a===void 0||c===void 0)return{entities:T(i,n)?r:i,clashes:[]};let u=new Map(s),l=new Map(a),b=new Map(c),p=[],h=(m,w)=>{let x=u.get(m);return x===void 0||!T(w,x)},C=(m,w,x)=>h(m,w)?(h(m,x)&&!T(w,x)&&p.push({entityId:m,name:On(w)||On(x)}),w):x,D=(m,w)=>u.has(m)&&!h(m,w)?void 0:w,et=a.map(([m])=>m).filter(m=>u.has(m)),tt=s.map(([m])=>m).filter(m=>l.has(m)),so=et.length!==tt.length||et.some((m,w)=>m!==tt[w]),N=[];if(so){for(let[m,w]of a){let x=b.get(m);if(x!==void 0)N.push(C(m,w,x));else{let K=D(m,w);K!==void 0&&N.push(K)}}for(let[m,w]of c){if(l.has(m))continue;let x=D(m,w);x!==void 0&&N.push(x)}}else{for(let[m,w]of c){let x=l.get(m);if(x!==void 0)N.push(C(m,x,w));else{let K=D(m,w);K!==void 0&&N.push(K)}}for(let[m,w]of a){if(b.has(m))continue;let x=D(m,w);x!==void 0&&N.push(x)}}let nt=m=>Array.isArray(m)&&m.length===N.length&&N.every((w,x)=>w===m[x]);return nt(r)?{entities:r,clashes:p}:nt(i)?{entities:i,clashes:p}:{entities:N,clashes:p}}function Dn(e,o,t){return e==null?po(A(t,$),A(o,$)):A(e,$)}function Nn(e,o,t){return Rn(Dn(e,o,t),A(o,$),A(t,$)).clashes}function In(e,o,t){let n=sn(e,o,t),i=Rn(Dn(e,o,t),A(o,$),A(t,$)).entities,r=A(n,$);if(i===r)return n;if(i===void 0){if(!Object.hasOwn(n,$))return n;let{[$]:s,...a}=n;return a}return n===t||n===o?{...n,[$]:i}:(n[$]=i,n)}var Hn=100,ho=3,ze=class{constructor(o,t){this._undo=[];this._redo=[];this._kept=[];this._base=o,this._revision=t,this._document=o}get base(){return this._base}get revision(){return this._revision}get document(){return this._document}get canUndo(){return this._undo.length>0}get canRedo(){return this._redo.length>0}get kept(){return this._kept}get dirty(){let o=this._dirty;if(o!==void 0&&o.document===this._document&&o.base===this._base)return o.value;let t=this._document!==this._base&&!T(this._document,this._base);return this._dirty={document:this._document,base:this._base,value:t},t}apply(o,t){if(o===this._document||T(o,this._document))return(t===void 0||t!==this._coalesceKey)&&(this._coalesceKey=void 0),!1;if(t!==void 0&&t===this._coalesceKey&&this._undo.length>0){let n=this._undo[this._undo.length-1];return T(o,n)?(this._undo.pop(),this._document=n,this._coalesceKey=void 0):this._document=o,this._redo=[],!0}return this.pushUndo(this._document),this._redo=[],this._document=o,this._coalesceKey=t,!0}endCoalesce(){this._coalesceKey=void 0}undo(){this._coalesceKey=void 0;let o=this._undo.pop();return o===void 0?!1:(this._redo.push(this._document),this._document=o,!0)}redo(){this._coalesceKey=void 0;let o=this._redo.pop();return o===void 0?!1:(this.pushUndo(this._document),this._document=o,!0)}discard(){return this._coalesceKey=void 0,this.apply(this._base)}rebase(o,t){return t<this._revision?(this._kept=[],!1):this.mergeOnto(o,t)}restart(o,t){return this.mergeOnto(o,t)}mergeOnto(o,t){this._coalesceKey=void 0;let n=this._base;this._kept=this._document===n?[]:Nn(n,this._document,o);let i=new Map,r=b=>{let p=i.get(b);if(p!==void 0)return p;let h=b===n?o:In(n,b,o);return h!==o&&T(h,o)&&(h=o),i.set(b,h),h},s=this._document,a=[...this._undo,this._document,...this._redo.slice().reverse()].map(r),c=this._undo.length,u=[],l=0;return a.forEach((b,p)=>{let h=u[u.length-1];h!==void 0&&(h===b||T(h,b))?p===c&&(u[u.length-1]=b):u.push(b),p===c&&(l=u.length-1)}),this._undo=u.slice(0,l),this._document=u[l],this._redo=u.slice(l+1).reverse(),this._base=o,this._revision=t,this._document!==s&&!T(this._document,s)}saved(o,t){t<this._revision||(this._coalesceKey=void 0,this._base=o,this._revision=t)}get saving(){return X.has(this)}get saveDone(){return X.get(this)}pushUndo(o){this._undo.push(o),this._undo.length>Hn&&this._undo.splice(0,this._undo.length-Hn)}},X=new WeakMap;function An(e,o){if(X.has(e))return Promise.resolve({ok:!1,revision:e.revision,merged:!1,code:"busy",message:"This Control Center list is being saved already."});let t=fo(e,o).finally(()=>X.delete(e));return X.set(e,t),t}async function fo(e,o){let t=!1,n=new Map,i=()=>n.size===0?{}:{kept:[...n.values()]},r=(s,a,c)=>({ok:!1,revision:e.revision,merged:t,code:s,message:a,...i(),...c===void 0?{}:{problems:c}});for(let s=1;;s++){let a=e.document,c=$n(a);if(c.length>0)return r("invalid",c.join(" "),c);let u;try{({revision:u}=await o.save(e.revision,a))}catch(l){let{code:b="unknown",message:p}=O(l);if(b!=="conflict"||s>=ho)return r(b,p);let h;try{h=await o.fetch()}catch(C){let D=O(C);return r(D.code??"unknown",D.message)}if(!_(h)||!(h.revision>0)||!_(h.document))return r("no_record","Home Assistant holds no Control Center list for this watch.");h.revision<e.revision?e.restart(h.document,h.revision):e.rebase(h.document,h.revision);for(let C of e.kept)n.set(C.entityId,C);if(t=!0,!e.dirty)return{ok:!0,revision:e.revision,merged:t,alreadySaved:!0,...i()};continue}return e.saved(a,u),{ok:!0,revision:e.revision,merged:t,...i()}}}async function Ln(e,o){try{let{revision:t}=await o(0,e);return{ok:!0,revision:t}}catch(t){let{code:n,message:i}=O(t);return n==="no_record"||n==="conflict"?{ok:!1,code:n,message:i}:n==="unknown_command"||n==="invalid"?{ok:!1,code:"unsupported",message:i}:{ok:!1,code:"error",message:i}}}var z=new Map;function U(e){return z.get(e)}function Mn(e,o,t){let n=z.get(e);if(n!==void 0&&t<=0)return{draft:n,mergedIntoEdits:!1,kept:[]};if(n===void 0||t<n.revision&&!n.dirty){let s=new ze(o,t);return z.set(e,s),{draft:s,mergedIntoEdits:!1,kept:[]}}if(t===n.revision)return{draft:n,mergedIntoEdits:!1,kept:[]};let i=n.dirty,r=t<n.revision?n.restart(o,t):n.rebase(o,t);return{draft:n,mergedIntoEdits:i&&r,kept:i?n.kept:[]}}function de(e){z.delete(e)}function Ue(){for(let e of z.values())if(e.dirty)return!0;return!1}function Pn(){z.clear()}function mo(e){return`"${e.name.trim()===""?e.entityId:e.name}"`}function le(e){if(e.length===0)return"";let o=e.map(mo);return`Another save also changed ${o.length===1?o[0]:`${o.slice(0,-1).join(", ")} and ${o[o.length-1]}`}. ${o.length===1?"Your version was kept.":"Your versions were kept."}`}function Fn(e){if(e.ok){let t=e.kept??[];if(e.alreadySaved===!0){let n=t.length>0?` ${le(t)}`:"";return{kind:t.length>0?"warn":"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${e.revision}.${n}`}}return t.length>0?{kind:"warn",text:`Saved. ${le(t)}`}:e.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let o=(e.message??"").trim();switch(e.code){case"conflict":return{kind:"warn",text:"Not saved. The Control Center list kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds a Control Center list for this watch. Start with an empty list again."};case"invalid":{let t=e.problems??[];return t.length>0?{kind:"err",text:`Not saved. Something in the Control Center list is not right: ${t.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the Control Center list${o===""?".":`: ${o}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${Rt}`};case"busy":return{kind:"warn",text:"Already saving this Control Center list. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the Control Center list just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${o===""?".":`: ${o}`}`}}}var P="control-center",ee="cc:entry",L="cc:add",ue="cc:added",Q="cc:drag",go=["#4A9EF5","#5BC4F0","#34D399","#FBBF24","#F97316","#EF4444","#EC4899","#A855F7","#6366F1","#8B5CF6","#CCD8E6","#FFFFFF"],Un="wrist-assistant-panel.control-center.zoom.v1";function Kn(e=ge()){try{let o=e?.getItem(Un),t=o==null||o===""?NaN:Number(o);return nn.includes(t)?t:void 0}catch{return}}function Bn(e,o=ge()){try{o?.setItem(Un,e===void 0?"":String(e))}catch{}}var qn="The entities the watch's Toggle and Action controls offer. Add a control from the watch's Control Center, then pick one of these. A save reaches the watch the next time it checks.",Vn="Drawn from Home Assistant's states now. Each button is a control you can add to the watch's Control Center. Hidden entries and other domains are left out. Tap a button to edit it.",Jn="Not shown on the watch",vo="These tiles now live under Complications",bo="Each tile on this watch's Control Center is a complication control now. Change its name, symbol and color there. Tiles you already placed keep working.",Co="Open Complications";function Wn(e){return e.some(o=>{if(o.deleted||o.document===null)return!1;let t=o.document.legacyControlEntityId;return typeof t=="string"&&t!==""})}function qe(e){return d`<div class="pe-empty cc-moved">
    <b>${vo}</b>
    <span>${bo}</span>
    <button class="pe-btn pe-primary cc-moved-open" @click=${e}>${Co}</button>
  </div>`}function he(e,o,t){return`${e} ${e===1?o:t}`}function te(e){return e.states}function jn(e){let o=E(e.domain),t=o==="toggle"?"Toggle":o==="action"?"Action":Jn;return`${e.entityId} \xB7 ${t}`}function ne(e){let o=e.uiState.get(ee);return typeof o=="string"?Re(e.document,o):void 0}function Ve(e,o){o===void 0?e.uiState.delete(ee):e.uiState.set(ee,o),e.uiState.delete(L),e.requestUpdate()}function Je(e){return ne(e)===void 0&&!e.uiState.has(L)?!1:(e.uiState.delete(ee),e.uiState.delete(L),e.requestUpdate(),!0)}function fe(e){let o=e.uiState.get(L);return typeof o=="object"&&o!==null?o:void 0}function M(e,o){o===void 0?e.uiState.delete(L):(e.uiState.set(L,o),e.uiState.delete(ee)),e.requestUpdate()}function Be(e,o="entity"){e.uiState.delete(ue),M(e,{mode:o,picked:[]})}function Ke(e,o){let t=[],n=[];e.edit(s=>{let a=wn(s,o,te(e.hass));return t=a.added,n=a.refused,a.document});let i=s=>j(te(e.hass),s),r=[];return t.length===1?r.push(`Added ${i(t[0])}.`):t.length>1&&r.push(`Added ${t.length} entities.`),n.length===1?r.push(`${i(n[0])} is on the list already.`):n.length>1&&r.push(`${n.length} are on the list already.`),r.length>0&&e.uiState.set(ue,r.join(" ")),e.requestUpdate(),t}function wo(e){let{areas:o,entities:t}=e;if(!(o===void 0||t===void 0))return Object.entries(o).map(([n,i])=>({id:n,name:typeof i?.name=="string"&&i.name.trim()!==""?i.name.trim():n})).sort((n,i)=>n.name.localeCompare(i.name)||(n.id<i.id?-1:n.id>i.id?1:0))}function yo(e,o){let{entities:t,devices:n}=e;if(t===void 0)return[];let i=V(),r=[];for(let a of Object.keys(e.states)){if(!i.includes(Ae(a))||!Object.hasOwn(t,a))continue;let c=t[a];if(c?.hidden||c?.entity_category)continue;(c?.area_id||(c?.device_id?n?.[c.device_id]?.area_id:void 0))===o&&r.push(a)}let s=a=>j(te(e),a);return r.sort((a,c)=>s(a).localeCompare(s(c))||(a<c?-1:a>c?1:0))}function We(e){return e.tintColorHex??fn}function Yn(e,o,t,n){return e.icons.render(o,t,n)??d`<span class="cc-glyph-dot" style=${`background:${n};width:${Math.max(4,t*.6)}px;height:${Math.max(4,t*.6)}px`}></span>`}function xo(e,o){let t=We(o);return d`<span class="thumb cc-thumb" style=${`--c:${t}`} aria-hidden="true"><span class="cc-thumb-glyph">${Yn(e,ae(o),14,t)}</span></span>`}function ko(e,o,t){return{start:n=>{e.uiState.set(Q,o),n.dataTransfer?.setData("text/plain",o),n.dataTransfer&&(n.dataTransfer.effectAllowed="move")},over:n=>{typeof e.uiState.get(Q)=="string"&&(n.preventDefault(),n.dataTransfer&&(n.dataTransfer.dropEffect="move"))},drop:n=>{let i=e.uiState.get(Q);e.uiState.delete(Q),!(typeof i!="string"||i===o)&&(n.preventDefault(),e.edit(r=>Me(r,i,t)))},end:()=>{e.uiState.delete(Q)}}}function $o(e,o,t,n,i){let r=R(o),s=r.entityId,a=i===s,c=r.isHidden,u=Z(r),l=Y(r)||s,b=C=>e.edit(D=>Me(D,s,C)),p=ko(e,s,t),h=()=>Ve(e,s);return d`<div class="layer cc-entry-row ${a?"hl":""} ${c||!u?"dim":""}" data-entity=${s} role="listitem" tabindex="0"
    draggable=${e.busy?"false":"true"} aria-current=${a?"true":"false"} aria-label=${l}
    title=${`${l} \xB7 ${jn(r)}${c?", hidden":""}`}
    @dragstart=${p.start} @dragover=${p.over} @drop=${p.drop} @dragend=${p.end}
    @click=${C=>{C.target instanceof Element&&C.target.closest("button")||h()}}
    @keydown=${C=>{C.target!==C.currentTarget||C.key!=="Enter"&&C.key!==" "||(C.preventDefault(),h())}}>
    <span class="grip" aria-hidden="true"></span>
    ${xo(e,r)}
    <span class="name"><b><span class="nm-t">${l}</span></b><small>${jn(r)}</small></span>
    <span class="right">
      <span class="badges">
        ${c?d`<span class="badge">hidden</span>`:g}
        ${u?g:d`<span class="badge cc-off" title=${`The watch's controls cover ${V().join(", ")}.`}>not shown</span>`}
      </span>
      <span class="acts">
        <button type="button" class="icon" ?disabled=${e.busy} title=${c?"Show":"Hide"} aria-label=${`${c?"Show":"Hide"} ${l}`}
          @click=${()=>e.edit(C=>je(C,s,!c))}>${k(c?"show":"hide")}</button>
        <button type="button" class="icon" ?disabled=${e.busy||t===0} title="Move up" aria-label=${`Move ${l} up`}
          @click=${()=>b(t-1)}>${k("up")}</button>
        <button type="button" class="icon" ?disabled=${e.busy||t===n-1} title="Move down" aria-label=${`Move ${l} down`}
          @click=${()=>b(t+1)}>${k("down")}</button>
        <button type="button" class="icon danger" ?disabled=${e.busy} title="Remove" aria-label=${`Remove ${l}`}
          @click=${()=>e.edit(C=>Le(C,s))}>${k("delete")}</button>
      </span>
    </span>
  </div>`}function Zn(e){let o=H(e.document),t=ne(e),n=t===void 0?void 0:R(t).entityId,i=fe(e)!==void 0;return d`<section class="card lc cc-entries-card" aria-label="Control Center" style="--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: 44px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${k("grid")}</span><span class="lc-title">Control Center</span>
      <span class="lc-sub" title=${qn}>${he(o.length,"entity","entities")}</span>
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri cc-add ${i?"on":""}" aria-label="Add entities" ?disabled=${e.busy}
        title="Add an entity, or the entities of an area" @click=${()=>Be(e)}>${k("plus")}<span>Add</span></button>
    </div>
    ${o.length===0?d`<div class="lc-note">No entities yet. Add lights, switches, scenes and more for the watch's Control Center.</div>`:d`<div class="layers cc-entry-list" role="list">${o.map((r,s)=>$o(e,r,s,o.length,n))}</div>
        <div class="lc-note cc-drag-note">Drag an entity, or use its arrows, to reorder.</div>`}
  </section>`}function So(e,o,t){let n=e.scale,i=We(o),r=gn(o.domain,e.hass.states[o.entityId]?.state),s=E(o.domain),a=r===!0?i:"rgba(255,255,255,.17)",c=r===!0?"#FFFFFF":s==="action"?i:r===!1?"#FFFFFF":"rgba(255,255,255,.55)",u=44*n,l=Y(o)||o.entityId,b=r===void 0?s==="toggle"?"no state":"action":r?"on":"off";return d`<button type="button" class="cc-w-btn ${t?"on":""}" title=${`${l} \xB7 ${b}`} aria-label=${`${l}, ${b}`}
    style=${`gap:${4*n}px;width:${u+8*n}px`} @click=${()=>Ve(e,o.entityId)}>
    <span class="cc-w-circle" style=${`width:${u}px;height:${u}px;background:${a}`}>${Yn(e,ae(o),Math.round(20*n),c)}</span>
    <span class="cc-w-name" style=${`font-size:${9*n}px`}>${l}</span>
  </button>`}function zn(e,o,t,n){if(t.length===0)return g;let i=e.scale;return d`<div class="cc-w-head" style=${`font-size:${10*i}px;margin:${2*i}px ${4*i}px`}>${o}</div>
    <div class="cc-w-grid" style=${`gap:${8*i}px ${4*i}px`}>${t.map(r=>So(e,r,r.entityId===n))}</div>`}function Gn(e){let{width:o,height:t}=e.screen,n=e.scale,i=H(e.document).map(R),r=i.filter(p=>!p.isHidden&&Z(p)),s=r.filter(p=>E(p.domain)==="toggle"),a=r.filter(p=>E(p.domain)==="action"),c=ne(e),u=c===void 0?void 0:R(c).entityId,l=r.length===0?d`<p class="cc-w-empty" style=${`font-size:${11*n}px`}>${i.length===0?"Add entities":"Nothing the watch shows"}</p>`:d`<div class="cc-w-scroll" style=${`padding:${26*n}px ${8*n}px ${14*n}px;gap:${6*n}px`}>
      ${zn(e,"Toggle",s,u)}
      ${zn(e,"Action",a,u)}
    </div>`,b=d`<div class="cc-screen" role="group" aria-label="Control Center on the watch"
    style=${`width:${Math.round(o*n)}px;min-height:${Math.round(t*n)}px`}>${l}</div>`;return on({width:o,height:t},n,b,"Control Center on the watch")}function Xn(e){let o=H(e.document).map(R),t=o.filter(r=>r.isHidden).length,n=o.filter(r=>!Z(r)).length,i=[he(o.length,"entity","entities")];return t>0&&i.push(`${t} hidden`),n>0&&i.push(`${n} not shown`),[i.join(", ")]}function Qn(e,o){return an(e.uiState,P,o)}function _o(e,o){cn(e.uiState,P,o,!Qn(e,o)),e.requestUpdate()}var To={entry:{color:B.content,icon:"content"},look:{color:B.look,icon:"look"},add:{color:B.content,icon:"plus"},list:{color:B.place,icon:"grid"}};function pe(e,o,t,n,i,r={}){let s=Qn(e,t),a=To[o];return bt({color:a.color,icon:k(a.icon),title:n,open:s,onToggle:()=>_o(e,t),...r.summary===void 0||r.summary===""?{}:{summary:r.summary},dot:r.dot===!0,id:`${P}:${t}`},s?i:d``)}function Eo(e){return fe(e)!==void 0?[{module:P,section:"add"}]:ne(e)!==void 0?[{module:P,section:"entry"},{module:P,section:"look"}]:[{module:P,section:"list"}]}function Oo(e,o){let t=R(o),n=t.entityId,i=Z(t),r=E(t.domain),s=e.hass.states[n],a=Cn(o),c=s===void 0?"Not in Home Assistant now.":`${j(te(e.hass),n)} is ${s.state}.`,u=pe(e,"entry","entry","Entity",d`<fieldset class="cc-body" ?disabled=${e.busy} aria-label="Entity">
    ${ye("Visibility",t.isHidden?"hidden":"visible",[["visible","Visible"],["hidden","Hidden"]],p=>e.edit(h=>je(h,n,p==="hidden")))}
    <div class="hint cc-under">Hidden entries stay on the list and out of the watch's pickers.</div>
    ${Mt("Name",t.customDisplayName??"",p=>e.edit(h=>yn(h,n,p),`entry:${n}:name`),{placeholder:t.displayName||n})}
    <div class="hint cc-under">Empty shows the entity's own name, ${t.displayName===""?"none":`"${t.displayName}"`}.</div>
    <div class="cc-facts">
      <span><b>Entity</b><code>${n}</code></span>
      <span><b>Control</b>${r==="toggle"?"Toggle":r==="action"?"Action":d`<span class="cc-warn">${Jn}</span>`}</span>
      <span><b>Now</b>${c}</span>
    </div>
    ${i?g:d`<p class="cc-warn cc-under-full">The watch's controls cover ${V().join(", ")}. This entry is kept on the list but never shown.</p>`}
  </fieldset>`,{summary:Y(t)||n}),l=t.tintColorHex,b=pe(e,"look","look","Icon and color",d`<fieldset class="cc-body" ?disabled=${e.busy} aria-label="Icon and color">
    <div class="cc-stack">${jt({icons:e.icons,symbols:e.symbols},ae(t),p=>e.edit(h=>xn(h,n,p===t.iconName?"":p),`entry:${n}:icon`),`cc:icon:${n}`,{clearable:t.customIconName!==void 0,tint:l})}</div>
    ${Pt("Color",l,p=>e.edit(h=>Fe(h,n,p),`entry:${n}:tint`),!0,null)}
    <div class="cc-swatches" role="group" aria-label="Suggested colors">
      ${go.map(p=>{let h=l!==void 0&&l.toUpperCase()===p;return d`<button type="button" class="cc-swatch ${h?"on":""}" style=${`--sw:${p}`} title=${p} aria-label=${`Color ${p}`}
          aria-pressed=${h?"true":"false"} ?disabled=${e.busy} @click=${()=>e.edit(C=>Fe(C,n,p))}></button>`})}
    </div>
    <div class="hint cc-under">No color draws the control in the watch's blue.</div>
    <div class="cc-acts">
      <button type="button" class="pe-btn" ?disabled=${e.busy||!a} title="Back to the entity's own name and icon, with no color"
        @click=${()=>e.edit(p=>kn(p,n))}>${k("reset")}<span>Reset to defaults</span></button>
    </div>
  </fieldset>`,{summary:a?"Changed":"Defaults",dot:a});return d`${u}${b}
    <div class="cc-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Remove this entity from the list"
        @click=${()=>e.edit(p=>Le(p,n))}>${k("delete")}<span>Remove</span></button>
    </div>`}function Ro(e,o,t){let n=new Set(o.picked);return d`<div class="cc-pick-list" role="group" aria-label="Entities in the area">
    ${t.map(i=>{let r=De(e.document,i);return d`<label class="cc-pick-row ${r?"held":""}">
        <input type="checkbox" .checked=${r||n.has(i)} ?disabled=${e.busy||r}
          @change=${s=>{let a=fe(e)??o,c=a.picked.filter(u=>u!==i);M(e,{...a,picked:s.target.checked?[...c,i]:c})}} />
        <span class="cc-pick-name">${j(te(e.hass),i)}${r?d` <span class="hint">on the list</span>`:g}</span><code>${i}</code>
      </label>`})}
  </div>`}function Do(e,o){let t=e.uiState.get(ue),n=ye("Add",o.mode,[["entity","Entity"],["area","From an area"]],r=>{e.uiState.delete(ue),M(e,{mode:r,picked:[]})}),i;if(o.mode==="entity"){let r=Number(e.uiState.get(`${L}:n`)??0)||0;i=d`<div class="cc-stack">${Ft({hass:e.hass},"Entity",{entityId:"",displayName:"",domain:""},s=>{let a=s.entityId.trim();a!==""&&(e.uiState.set(`${L}:n`,r+1),Ke(e,[a]))},`cc:add:entity:${r}`,{clearable:!1,domain:V()})}</div>
      <div class="hint">Lights, switches, fans, input booleans, locks and covers are toggles; scenes, scripts and automations are actions. Pick another to add it too.</div>`}else{let r=wo(e.hass);if(r===void 0)i=d`<p class="hint">This Home Assistant does not share its areas with the panel. Add entities one by one instead.</p>`;else if(r.length===0)i=d`<p class="hint">No areas in Home Assistant yet.</p>`;else{let s=o.area!==void 0&&r.some(l=>l.id===o.area)?o.area:void 0,a=s===void 0?[]:yo(e.hass,s),c=a.filter(l=>!De(e.document,l)),u=o.picked.filter(l=>c.includes(l));i=d`<label class="field cc-area"><span>Area</span>
          <select @change=${l=>M(e,{...o,area:l.target.value||void 0,picked:[]})}>
            <option value="" ?selected=${s===void 0}>Choose an area</option>
            ${r.map(l=>d`<option value=${l.id} ?selected=${l.id===s}>${l.name}</option>`)}
          </select></label>
        ${s===void 0?g:a.length===0?d`<p class="hint">No light, switch, fan, lock, cover, input boolean, scene, script or automation in this area.</p>`:d`${Ro(e,o,a)}
            <div class="cc-acts">
              <button type="button" class="pe-btn pe-primary" ?disabled=${e.busy||u.length===0}
                @click=${()=>{Ke(e,u),M(e,{...o,area:s,picked:[]})}}>
                ${k("plus")}<span>${u.length===0?"Add":`Add ${he(u.length,"entity","entities")}`}</span></button>
              <button type="button" class="pe-btn" ?disabled=${e.busy||c.length===0}
                @click=${()=>{Ke(e,c),M(e,{...o,area:s,picked:[]})}}>
                <span>${c.length===0?"All on the list":`Add all ${c.length}`}</span></button>
            </div>`}`}}return d`${pe(e,"add","add","Add entities",d`<fieldset class="cc-body" ?disabled=${e.busy} aria-label="Add entities">
    ${n}${i}
    ${typeof t=="string"?d`<div class="hint cc-added" role="status">${t}</div>`:g}
  </fieldset>`)}
    <div class="cc-acts">
      <button type="button" class="pe-btn" @click=${()=>M(e,void 0)}>Done</button>
    </div>`}function No(e){let o=H(e.document).map(R),t=o.filter(s=>E(s.domain)==="toggle").length,n=o.filter(s=>E(s.domain)==="action").length,i=o.filter(s=>s.isHidden).length,r=o.length-t-n;return pe(e,"list","list","Control Center list",d`<div class="cc-body">
    <p class="hint">${qn}</p>
    <div class="cc-facts">
      <span><b>Toggles</b>${t}</span>
      <span><b>Actions</b>${n}</span>
      ${i>0?d`<span><b>Hidden</b>${i}</span>`:g}
      ${r>0?d`<span><b>Not shown</b>${r}</span>`:g}
    </div>
    <div class="cc-acts">
      <button type="button" class="pe-btn pe-primary" ?disabled=${e.busy} @click=${()=>Be(e)}>${k("plus")}<span>Add entities</span></button>
      <button type="button" class="pe-btn" ?disabled=${e.busy} @click=${()=>Be(e,"area")}><span>Add from an area</span></button>
    </div>
  </div>`,{summary:he(o.length,"entity","entities")})}function eo(e){let o=ne(e),t=fe(e),n=Eo(e),i=dn(e.uiState,n),r,s;if(t!==void 0)r=d`<div class="crumbs"><button class="root" title="The list" @click=${()=>Je(e)}>Control Center</button><span class="sep">›</span><span class="nm">Add entities</span></div>`,s=Do(e,t);else if(o!==void 0){let a=R(o),c=Y(a)||a.entityId,u=E(a.domain);r=d`<div class="crumbs"><button class="root" title="The list" @click=${()=>Ve(e,void 0)}>Control Center</button><span class="sep">›</span><span class="kchip" style=${`--k:${We(a)}`}>${u==="toggle"?"Toggle":u==="action"?"Action":"Not shown"}</span><span class="nm" title=${c}>${c}</span></div>`,s=Oo(e,o)}else r=d`<div class="crumbs"><span class="kchip" style="--k:#5B8FD4">List</span><span class="nm">Control Center</span></div>`,s=d`${No(e)}<p class="cc-note">Select an entity to edit it, or add one.</p>`;return d`<div class="insp-head">
      ${r}
      <button class="expand" @click=${()=>{ln(e.uiState,n,!i),e.requestUpdate()}}>${i?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${s}</div>`}var to=oe`
  .cc-entries-card > .layers { padding: 6px 8px 8px; overflow: visible; }
  .cc-entries-card > .lc-note { margin: 8px 12px; color: var(--wa-muted); }
  .cc-entries-card > .lc-note.cc-drag-note { margin-top: 0; font-size: 11.5px; }
  .lc-btn.on { box-shadow: var(--wa-ring); }
  .layer .acts button.icon { display: inline-grid; place-items: center; padding: 0; }
  .layer .acts button.icon:disabled { opacity: .35; cursor: default; }
  .layer .thumb.cc-thumb { display: grid; place-items: center; background: color-mix(in srgb, var(--c, #888) 22%, #000); }
  .layer .thumb .cc-thumb-glyph { display: grid; place-items: center; width: 16px; height: 16px; }
  .layer .thumb .cc-thumb-glyph svg { width: 14px; height: 14px; display: block; }
  .badge.cc-off { border-color: var(--wa-amber-line); color: var(--wa-amber); }
  .cc-glyph-dot { display: inline-block; border-radius: 50%; }

  /* The watch screen on the stage: black, as tall as the list needs. */
  .cc-screen { position: relative; flex: none; background: #000; color: #fff; overflow: hidden; }
  .cc-w-scroll { display: flex; flex-direction: column; }
  .cc-w-head { font-weight: 600; color: rgba(235, 235, 245, .6); letter-spacing: .02em; }
  .cc-w-grid { display: flex; flex-wrap: wrap; justify-content: center; }
  .cc-w-btn {
    display: flex; flex-direction: column; align-items: center; min-width: 0; padding: 0; border: 0;
    background: none; color: #fff; font: inherit; cursor: pointer;
  }
  .cc-w-circle { display: grid; place-items: center; border-radius: 50%; }
  .cc-w-circle svg { display: block; }
  .cc-w-name { max-width: 100%; color: rgba(255, 255, 255, .8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2; }
  .cc-w-empty { margin: 40% 12px 0; text-align: center; color: rgba(255, 255, 255, .6); }
  .cc-screen { --cc-mark: color-mix(in srgb, var(--wa-accent) 55%, #fff); }
  .cc-w-btn.on .cc-w-circle { outline: 1.5px solid var(--cc-mark); outline-offset: 2px; }
  .cc-w-btn:focus-visible { outline: none; }
  .cc-w-btn:focus-visible .cc-w-circle { box-shadow: var(--wa-ring); }

  /* The inspector's cards. A fieldset only to switch every control off at
     once while a save is out; it draws nothing of its own. */
  fieldset.cc-body, div.cc-body { margin: 0; padding: 2px 0 0; border: 0; min-width: 0; display: flex; flex-direction: column; gap: 2px; --wa-lab: 104px; }
  .cc-body .hint { margin: 0 0 4px; }
  .cc-note { margin: 10px 2px 2px; font-size: 12px; line-height: 1.4; color: var(--wa-muted); }
  .cc-acts { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 0 2px; }
  .cc-added { color: var(--wa-green, inherit); }
  .cc-warn { color: var(--wa-amber); font-weight: 600; }
  p.cc-warn { margin: 4px 0; font-size: 12.5px; line-height: 1.4; }
  .hint.cc-under { padding-left: calc(var(--wa-lab) + 8px); margin-top: -2px; }
  .cc-stack .field { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 2px 0; }
  .cc-stack .field.entity-field > :not(:first-child) { grid-column: 1; }
  .cc-facts { display: flex; flex-direction: column; gap: 4px; margin: 6px 0; font-size: 12.5px; }
  .cc-facts > span { display: grid; grid-template-columns: var(--wa-lab, 104px) minmax(0, 1fr); gap: 8px; align-items: baseline; }
  .cc-facts b { font-weight: 500; color: var(--wa-muted); }
  .cc-facts code { font-family: monospace; font-size: 12px; overflow-wrap: anywhere; }
  .cc-swatches { display: flex; flex-wrap: wrap; gap: 6px; padding: 4px 0; }
  .cc-swatch {
    width: 20px; height: 20px; padding: 0; border-radius: 50%; border: 1px solid var(--wa-line-strong);
    background: var(--sw); cursor: pointer;
  }
  .cc-swatch.on { box-shadow: 0 0 0 2px var(--wa-bg), 0 0 0 3.5px var(--wa-sel-ring, var(--wa-ink)); }
  .cc-swatch:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .cc-area { display: grid; grid-template-columns: var(--wa-lab, 104px) minmax(0, 1fr); gap: 8px; align-items: center; padding: 4px 0; }
  .cc-area select {
    min-height: 30px; padding: 0 8px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
    background: var(--wa-field); color: var(--wa-ink); font: inherit; font-size: 13px;
  }
  .cc-pick-list { display: flex; flex-direction: column; max-height: 300px; overflow: auto; margin: 4px 0; border: 1px solid var(--wa-line); border-radius: var(--wa-r-sm, 8px); }
  .cc-pick-row { display: grid; grid-template-columns: auto minmax(0, 1fr); column-gap: 8px; align-items: center; padding: 5px 8px; border-top: 1px solid var(--wa-line); cursor: pointer; }
  .cc-pick-row:first-child { border-top: 0; }
  .cc-pick-row.held { cursor: default; opacity: .7; }
  .cc-pick-row > code { grid-column: 2; color: var(--wa-muted); font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .cc-pick-name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; }
`;pn({dirty:Ue,drop:Pn});typeof window<"u"&&window.addEventListener("beforeunload",e=>{Ue()&&(e.preventDefault(),e.returnValue="")});var Io=15e3,ro=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),Ye=ro?"\u2318":"Ctrl+",Ze={min:200,max:720,middleMin:320},Ge={left:280,right:340},Xe="wrist-assistant-panel.control-center.columns.v1",Ho=24,no=820;function oo(e){return O(e).message}function Qe(e){return O(e).code}function io(e){let{code:o,message:t}=O(e);return Object.assign(new Error(t),o===void 0?{}:{code:o})}function Ao(e){return e<1e3?`${e} bytes`:`${Number((e/1e3).toFixed(1))} KB`}function Lo(e){let o=e?Date.parse(e):NaN;return Number.isNaN(o)?"":lt(Math.max(0,(Date.now()-o)/1e3))}function Mo(e){return e==="panel"?"Saved here":"From the watch"}function Po(e){return e instanceof HTMLElement?Gt(e.tagName,e instanceof HTMLInputElement?e.type:void 0,e.isContentEditable):!1}function Fo(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e===null||e===document.body||e===document.documentElement}var f=class extends ot{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=g;this.shellOwnsWatch=!1;this.barHost=void 0;this.headBar=new Tt(this);this.unsupported=!1;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.starting=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.zoom=Kn();this.columns={...Ge};this.hostWidth=0;this.hostHeight=0;this.movedSeq=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new Kt(this);this.symbols=new Ht(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.historySeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let t=this.watchId;!this.isConnected||t===void 0||this.load(t,!0)};this.onScrubStart=t=>{t.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=t=>{t.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=t=>{if(t.defaultPrevented)return;let n=t.composedPath();if(!n.includes(this)&&!this.headBar.holds(n)&&!Fo()||this.renderRoot.querySelector("dialog[open]"))return;let i=t.metaKey||t.ctrlKey,r=t.key.toLowerCase();if(i&&!t.altKey&&r==="s"){t.preventDefault(),this.save();return}if(t.key==="Escape"&&this.topMenuOpen){t.preventDefault(),this.topMenuOpen=!1;return}if(t.key==="Escape"&&this.watchMenuOpen){t.preventDefault(),this.watchMenuOpen=!1;return}if(!Po(n[0])){if(i&&!t.altKey&&r==="z"){t.preventDefault(),t.shiftKey?this.redo():this.undo();return}if(t.ctrlKey&&!t.metaKey&&!t.altKey&&r==="y"){t.preventDefault(),this.redo();return}if(t.key==="Escape"&&!i&&!t.altKey){let s=this.viewHost();s!==void 0&&Je(s)&&t.preventDefault()}}};this.onWindowPointerDown=t=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let n=t.composedPath(),i=r=>n.some(s=>s instanceof HTMLElement&&s.classList.contains(r));this.topMenuOpen&&!i("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!i("cc-watch-picker")&&(this.watchMenuOpen=!1)};this.addEventListener(At,this.onScrubStart),this.addEventListener(Lt,this.onScrubEnd),this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get watches(){return yt(this.owners.length>0?this.owners:this.ownList??[])}get moved(){let t=this.movedCheck;return t!==void 0&&t.watchId===this.watchId&&t.moved}get draft(){if(!this.moved&&!(this.watchId===void 0||this.record===void 0||this.record.revision<=0))return U(this.watchId)}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Nt(Xe,Ge,Ze),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.historySeq++}willUpdate(t){if(this.hass){t.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,it(this.hass).then(r=>{this.ownList=r.owners},()=>{this.ownList=[]}));let i=_t(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||t.has("ownerId"));i!==void 0&&this.openWatch(i)}this.followSave();let n=this.restoreAsk;n!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(i=>i.revision===n.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let t=this.renderRoot.querySelector("dialog.pe-ask")??void 0;t!==this.shownDialog&&(this.shownDialog=t,t&&!t.open&&t.showModal()),Jt(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(t=>{for(let n of t){if(n.target!==this){this.measureTop(n.target);continue}let i=n.contentRect;Math.abs(i.width-this.hostWidth)>=1&&(this.hostWidth=i.width),Math.abs(i.height-this.hostHeight)>=1&&(this.hostHeight=i.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let t=this.sizeObserver;if(t===void 0)return;let n=this.renderRoot?.querySelector(".pe-top")??void 0;n!==this.observedTop&&(this.observedTop!==void 0&&t.unobserve(this.observedTop),this.observedTop=n,n!==void 0&&t.observe(n))}measureTop(t){let n=t.offsetHeight;n!==this.topHeight&&(this.topHeight=n,this.style.setProperty("--pe-top-h",`${n}px`))}listenForReconnect(){let t=this.hass?.connection;t!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof t?.addEventListener!="function")&&(t.addEventListener("ready",this.onReconnect),this.readyConnection=t))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let t=this.watchId;if(t===void 0)return;let n=U(t)?.saveDone;if(n===void 0||n===this.followedSave)return;this.followedSave=n;let i=()=>this.saveEnded(t);n.then(i,i)}saveEnded(t){this.requestUpdate(),this.isConnected&&(t===this.watchId?(this.reloadPending=!1,this.load(t,!0)):this.flushPending())}openWatch(t,n=!1){t!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=t,this.note=void 0,this.unsupported=!1,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),n=!1),this.startSubscription(t),this.load(t,n)}async load(t,n=!1){let i=this.hass;if(!i)return;if(n&&this.holdReload){this.reloadPending=!0;return}let r=++this.loadSeq;this.stopPolling();let s;n||(this.record=void 0,this.loading=!0,this.loadError=void 0,s=this.checkMoved(t));try{let a=await ie(i,t,"control_center");if(r!==this.loadSeq)return;if(n&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(a),this.loadError=void 0}catch(a){if(r!==this.loadSeq)return;En(a)?(this.unsupported=!0,this.loadError=void 0):n||(this.loadError=oo(a)),this.restartDraft?.watchId===t&&(this.restartDraft=void 0)}s!==void 0&&(await s,r!==this.loadSeq)||(this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(t)))}async checkMoved(t){let n=this.hass;if(!n)return;let i=++this.movedSeq,r=!1;try{let s=await rt(n,t);r=Wn(Array.isArray(s?.records)?s.records:[])}catch{r=!1}i===this.movedSeq&&(this.movedCheck={watchId:t,moved:r})}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(t){let n=this.watchId;this.record=t;let i=t.revision>0?Ee(t.document):void 0;if(n===void 0||i===void 0)return;let r=this.restartDraft;r!==void 0&&r.watchId===n&&t.revision>=r.revision&&(this.restartDraft=void 0,(U(n)?.dirty??!1)||de(n));let s=Mn(n,i,t.revision);s.kept.length>0?this.note={kind:"warn",text:le(s.kept)}:s.mergedIntoEdits&&(this.note={kind:"warn",text:"The Control Center list changed somewhere else. Your edits are kept."}),this.requestUpdate()}async loadHistory(t){let n=this.hass;if(!n||this.historyState==="unsupported")return;let i=++this.historySeq;try{let r=await st(n,t,"control_center");if(i!==this.historySeq||t!==this.watchId)return;this.history=Array.isArray(r?.entries)?r.entries:[],this.historyState="ready"}catch(r){if(i!==this.historySeq||t!==this.watchId)return;this.historyState=Qe(r)==="unknown_command"?"unsupported":"error"}}startSubscription(t){let n=this.hass;if(this.endSubscription(),!n)return;let i=++this.subscribeSeq;dt(n,t,r=>{i===this.subscribeSeq&&r.kind==="control_center"&&r.revision!==(this.record?.revision??0)&&this.load(t,!0)}).then(r=>{i===this.subscribeSeq?this.unsubscribe=r:r().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let t=this.unsubscribe;this.unsubscribe=void 0,t?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||wt(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},Io))}async poll(){this.pollTimer=void 0;let t=this.hass,n=this.watchId,i=this.record;if(!(!t||n===void 0||i===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let r=await ie(t,n,"control_center");if(n!==this.watchId||this.record!==i)return;r.revision===i.revision?this.record={...i,delivered_revision:r.delivered_revision,delivered_at:r.delivered_at,rejected_revision:r.rejected_revision,rejected_at:r.rejected_at,rejected_reason:r.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(r),this.loadHistory(n))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(t,n){let i=this.draft;if(!i||this.saving)return!1;let r=i.apply(t(i.document),this.scrubKey??n);return this.requestUpdate(),r}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let t=this.icons??Zt,n=this.iconMemo;if(n!==void 0&&n.provider===t&&n.tick===this.iconsTick)return n.icons;let i=Xt(t);return this.iconMemo={provider:t,tick:this.iconsTick,icons:i},i}screen(){let t=this.watches.find(n=>n.owner_watch_id===this.watchId);return(Ce(t?.screen_size)??be).screen}viewHost(){let t=this.draft,n=this.hass;if(t===void 0||n===void 0)return;let i=this;return{hass:n,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.stageScale,get document(){return t.document},get busy(){return i.saving},edit:(r,s)=>this.draft===t&&this.edit(r,s),endCoalesce:()=>t.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let t=this.hass,n=this.watchId;this.endScrub();let i=this.draft;if(!t||n===void 0||!i||this.saving||!i.dirty)return;this.note=void 0;let r=An(i,{save:(a,c)=>me(t,n,"control_center",a,c).catch(u=>{throw io(u)}),fetch:async()=>{let a=await ie(t,n,"control_center").catch(c=>{throw io(c)});return{revision:a.revision,document:a.document}}});this.followedSave=i.saveDone,this.requestUpdate();let s=await r.catch(a=>({ok:!1,revision:i.revision,merged:!1,code:Qe(a)??"unknown",message:oo(a)}));this.saveEnded(n),n===this.watchId&&(this.note=Fn(s))}async start(){let t=this.hass,n=this.watchId;if(!t||n===void 0||this.starting)return;this.starting=!0,this.note=void 0;let i=await Ln(bn(),(r,s)=>me(t,n,"control_center",r,s));if(this.starting=!1,n===this.watchId){if(i.ok)this.note={kind:"ok",text:"Started with an empty list. Add entities, then save; the watch picks them up the next time it checks."};else if(i.code==="no_record"){this.note={kind:"warn",text:St};return}else if(i.code==="conflict")this.note={kind:"warn",text:"A Control Center list arrived meanwhile, so that is shown."};else if(i.code==="unsupported"){this.unsupported=!0;return}else{this.note={kind:"err",text:`Could not start: ${we(i)}`};return}this.load(n,!0)}}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(t){let n=this.hass,i=this.watchId,r=this.record;if(!n||i===void 0||r===void 0||this.draft?.dirty)return;let s={entry:t,baseRevision:r.revision};this.restoreAsk=s,at(n,i,"control_center",t.revision).then(a=>{this.restoreAsk===s&&(this.restoreAsk={...s,summary:Sn(a.document)})},()=>{})}async restore(){let t=this.hass,n=this.watchId,i=this.restoreAsk;if(!t||n===void 0||i===void 0||this.restoring)return;this.restoring=!0;let r;try{let s=await ct(t,n,"control_center",i.entry.revision,i.baseRevision);r={kind:"ok",text:Qt(i.entry.updated_at)},n===this.watchId?this.restartDraft={watchId:n,revision:s.revision}:(U(n)?.dirty??!1)||de(n)}catch(s){let a=Qe(s);a==="conflict"?r={kind:"warn",text:"Not restored. The Control Center list changed somewhere else, so the newest copy is shown."}:a==="no_record"?r={kind:"warn",text:"Not restored. Home Assistant no longer holds a Control Center list for this watch."}:a==="not_found"?r={kind:"warn",text:"Not restored. That save is no longer kept."}:a==="unknown_command"?(this.historyState="unsupported",r={kind:"warn",text:"This version of the integration cannot restore the Control Center list. Update it to restore an earlier save."}):r={kind:"err",text:`Could not restore: ${we(s)}`}}finally{this.restoring=!1,this.restoreAsk===i&&this.closeAsk()}n===this.watchId&&(this.note=r,this.load(n,!0))}render(){let t=this.watches,n=this.draft;return d`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(n,t):g}
        ${this.note?d`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:g}
      </div>
      ${this.renderBody(t)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):g}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=no}renderTopBar(t,n){let i=t!==void 0&&!this.unsupported,r=i&&this.dirty;return d`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch Control Center list">
      ${this.haMenu?d`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${k("menu")}</button>`:g}
      ${this.shellOwnsWatch?g:d`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():se(void 0,!1)}>${k("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${this.shellOwnsWatch?g:this.renderWatchPicker(n)}
      ${this.barHost!==void 0&&i?Et({newWatch:!1,dirty:r,saved:ke(this.record)}):g}
      ${this.renderSyncPill(i?t:void 0)}
      ${this.renderTopMenu(i?t:void 0)}
      ${i?d`<button class="primary save ${r?"dirty":""}" ?disabled=${!r||this.saving}
          title=${r?`Save (${Ye}S). A save reaches the watch the next time it checks.`:`Nothing to save (${Ye}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?g:d`<span class="tb-saved" title=${r?"Unsaved changes":""}>${ke(this.record)}</span>`}`:g}
      ${this.barActions}
      <button class="help" title="Help with Control Center" aria-label="Help with Control Center"
        @click=${()=>window.open(un,"_blank","noopener")}>?</button>
    </div>`}renderSyncPill(t){let n=this.record;if(n===void 0||n.revision<=0||this.unsupported||this.moved)return g;let i=t===void 0?{size:0,limit:1}:Oe(t.document),r=xe({record:n,size:i.size,limit:i.limit,noun:"Control Center list",historyState:this.historyState});return d`<span class="tb-sync ${r.tone==="ok"?"ok":"warn"}" title=${`${r.state}. ${r.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${r.state}</span>
    </span>`}noRecordState(t=this.watches){return xt(t.find(n=>n.owner_watch_id===this.watchId))}canStart(){return!1}renderTopMenu(t){let n=this.canStart();if(t===void 0&&!n)return g;let i=this.topMenuOpen,r=s=>()=>{this.topMenuOpen=!1,s()};return d`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${i?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!i}}>···</button>
      ${i?d`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${t?d`<button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title="Go back to the copy Home Assistant holds. Undo brings the edits back."
          @click=${r(()=>this.discard())}>Discard edits</button>`:g}
        ${n?d`<button class="row" role="menuitem" ?disabled=${this.starting}
          @click=${r(()=>{$t(this.noRecordState())&&this.start()})}>${this.noRecordState()==="wait"?kt:_n}</button>`:g}
      </div>`:g}
    </span>`}colorOf(t){return Ut(zt(this.owners.length>0?this.owners:this.ownList??[]),t)}renderWatchPicker(t){if(t.length<2)return g;let n=t.find(s=>s.owner_watch_id===this.watchId),i=this.watchMenuOpen,r=s=>{let a=s===void 0?void 0:this.colorOf(s);return d`<span class="pe-chip-glyph" style=${a?`--pe-person: ${a}`:g} aria-hidden="true">${k("watch")}</span>`};return d`<span class="picker cc-watch-picker">
      <button type="button" class="tb-browse cc-watch-btn" aria-haspopup="menu" aria-expanded=${i?"true":"false"}
        title="Choose the watch whose Control Center list is shown" @click=${()=>{this.watchMenuOpen=!i}}>
        ${r(n?.owner_watch_id)}<span class="tb-browse-l">${n?re(n,t):"Choose a watch"}</span>
        <span class="cc-caret" aria-hidden="true">${k("chevron")}</span>
      </button>
      ${i?d`<div class="pop-menu cc-watch-menu" role="menu" aria-label="Watches">
        ${t.map(s=>{let a=s.owner_watch_id===this.watchId;return d`<button type="button" class="row cc-watch-row" role="menuitemradio" aria-checked=${a?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,a||this.openWatch(s.owner_watch_id)}}>
            ${r(s.owner_watch_id)}<span class="cc-watch-name">${re(s,t)}</span>
            <span class="cc-watch-check" aria-hidden="true">${a?k("check"):g}</span>
          </button>`})}
      </div>`:g}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=no?this.columns:Dt(this.hostWidth-Ho,this.columns,Ze)}renderGutter(t){return d`<div class="gutter ${t}" role="separator" aria-orientation="vertical"
      aria-label=${t==="left"?"Resize the list column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${n=>{let i=this.fittedColumns();It(n,{side:t,base:t==="left"?i.left:i.right,limits:Ze,onWidth:r=>{this.columns={...this.columns,[t]:r}},onEnd:()=>ve(Xe,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[t]:Ge[t]},ve(Xe,this.columns)}}></div>`}get stageScale(){return this.zoom??$e(this.narrow||this.stacked)}setZoom(t){this.zoom=t,Bn(t)}renderStage(t,n){let i=n.find(p=>p.owner_watch_id===this.watchId),s=Ce(i?.screen_size)??be,a=[...Xn(t),s.label],c="Control Center",u=this.draft,l=this.stageScale,b=$e(this.narrow||this.stacked);return d`<div class="card canvas-card cc-canvas" aria-label="Control Center">
      <div class="cv-head">
        <span class="cv-title" title=${c}>${c}</span>
        ${i!==void 0?d`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${re(i,n)}</span></span>`:g}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${a.join(" \xB7 ")}><span class="fam">${a.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!u?.canUndo} title=${`Undo (${Ye}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${k("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!u?.canRedo} title=${ro?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${k("redo")}</button>
        </span>
      </div>
      <div class="stage-area cc-stage-area">
        <div class="stage-tools" role="toolbar" aria-label="Stage tools">
          <button class="tb cc-case" aria-disabled="true" tabindex="-1" title=${`This watch's screen, ${s.label}.`}>
            ${k("watch")}<span class="word keep">${s.label}</span></button>
          <span class="tb-sep" aria-hidden="true"></span>
          <span class="tb-zoom" role="group" aria-label="Zoom">
            <button class="tb icon" ?disabled=${l<=_e(l)} aria-label="Zoom out" title="Zoom out"
              @click=${()=>this.setZoom(_e(l))}>−</button>
            <button class="tb pct" aria-label=${`Zoom ${q(l)}. Back to fit`}
              title=${`The watch at ${q(l)} of its own points. Click to fit it again (${q(b)}).`}
              @click=${()=>this.setZoom(void 0)}>${q(l)}</button>
            <button class="tb icon" ?disabled=${l>=Se(l)} aria-label="Zoom in" title="Zoom in"
              @click=${()=>this.setZoom(Se(l))}>+</button>
          </span>
        </div>
        <div class="cc-stage-body">${Gn(t)}</div>
        <div class="under"><span class="tail">${Vn}</span></div>
      </div>
    </div>`}renderBody(t){if(t.length===0){let c=this.owners.length===0&&this.ownList===void 0;return d`<div class="pe-empty">${c?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}if(this.moved)return qe(()=>this.onBack?this.onBack():se(void 0,!1));if(this.unsupported)return d`<div class="pe-empty"><b>${Tn}</b></div>`;if(this.loading)return d`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let c=this.watchId;return d`<div class="pe-empty">
        <span>Could not read this watch's Control Center list: ${this.loadError}</span>
        ${c===void 0?g:d`<button class="pe-btn" @click=${()=>{this.load(c)}}>Try again</button>`}
      </div>`}let n=this.record;if(n===void 0)return d`<div class="pe-empty">Loading…</div>`;let i=this.draft,r=this.viewHost();if(n.revision<=0){let c=this.watchId===void 0?void 0:U(this.watchId),u=this.watchId;return d`${qe(()=>this.onBack?this.onBack():se(void 0,!1))}
        ${c?.dirty&&u!==void 0?d`<div class="pe-empty"><span class="pe-warn">Your unsaved edits from before are kept.</span>
          <button class="pe-btn" @click=${()=>{de(u),this.requestUpdate()}}>Discard the kept edits</button></div>`:g}`}if(i===void 0||r===void 0)return d`<div class="pe-empty">Loading…</div>`;let s=this.fittedColumns(),a=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"";return d`<div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${s.left}px;--wa-right:${s.right}px;${a}`}>
      <div class="column left">
        ${Zn(r)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(r,t)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${eo(r)}
      </div>
    </div>
    ${this.renderFoot(n,i.document,i.dirty)}`}renderFoot(t,n,i){let r=Oe(n),s=xe({record:t,size:r.size,limit:r.limit,noun:"Control Center list",historyState:this.historyState}),a=this.watchId;return d`${Bt({status:s,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?qt({noun:"Control Center list",record:t,entries:this.history,historyState:this.historyState,dirty:i,restoring:this.restoring,onRetry:()=>{a!==void 0&&(this.historyState="loading",this.loadHistory(a))},onRestore:c=>{this.historyOpen=!1,this.askRestore(c)},onClosed:()=>{this.historyOpen=!1}}):g}
    ${this.rawOpen?Vt({noun:"Control Center list",document:n,revision:t.revision,dirty:i,copied:this.rawCopied,onCopy:c=>{Wt(c).then(u=>{this.rawCopied=u})},onClosed:()=>{this.rawOpen=!1}}):g}`}renderRestoreAsk(t){let n=this.record,i=Lo(t.entry.updated_at);return d`<dialog class="pe-ask" aria-labelledby="cc-ask-title"
      @cancel=${r=>{this.restoring&&r.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="cc-ask-title">Restore revision ${t.entry.revision}?</h3>
      <p>${Mo(t.entry.updated_by)}${i?` ${i}`:""}, ${Ao(t.entry.size)}.</p>
      ${t.summary?d`<p class="pe-muted">${t.summary}</p>`:g}
      <p>It is saved again as a new revision${n?`, after revision ${n.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[Ct,ut,pt,ht,ft,mt,gt,vt,rn,oe`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      container-type: inline-size;
      --cf-pad: 16px;
      padding: var(--cf-pad);
      scroll-padding-top: var(--pe-top-h, 0px);
      color: var(--wa-ink);
      background: var(--wa-bg);
      font-size: 14px;
    }
    * { box-sizing: border-box; }
    svg.ui-icon { width: 14px; height: 14px; display: block; flex: none; }
    h2, h3, h4, p { margin: 0; }
    .pe-top {
      flex: none; display: flex; flex-direction: column;
      position: sticky; top: calc(-1 * var(--cf-pad, 16px)); z-index: 7;
      margin: calc(-1 * var(--cf-pad, 16px)) calc(-1 * var(--cf-pad, 16px)) 0;
      padding: 0 0 10px;
      background: var(--wa-bg);
    }
    h3 { font-size: 13px; font-weight: 650; text-transform: uppercase; letter-spacing: .04em; color: var(--wa-muted); }
    code { font-family: monospace; font-size: 12px; overflow-wrap: anywhere; }
    .pe-muted { color: var(--wa-muted); font-size: 13px; }
    .pe-warn { color: var(--wa-amber); font-size: 13px; font-weight: 600; }
    .wa-bar button.tb-btn:has(> svg.ui-icon) { display: inline-flex; align-items: center; gap: 6px; padding: 0 11px 0 9px; }
    .wa-bar button.tb-btn svg.ui-icon { width: 14px; height: 14px; }
    .wa-bar button.tb-btn:disabled, .wa-bar button.primary.save:disabled { opacity: .45; cursor: default; }
    .wa-bar .tb-saved .cf-saved { margin: 0; font-size: inherit; color: inherit; }
    .wa-bar .pop-menu .row:disabled { opacity: .5; cursor: default; }
    .wa-bar .pop-menu .row:disabled:hover { background: transparent; }
    .pe-top > .pe-note { margin: 10px var(--cf-pad, 16px) 0; }
    .pe-note {
      display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding: 10px 12px;
      border-radius: var(--wa-r-md, 12px); border: 1px solid var(--wa-line); background: var(--wa-card); font-size: 13px;
    }
    .pe-note > span { flex: 1; min-width: 0; }
    .pe-note.ok { border-color: color-mix(in srgb, var(--wa-green) 40%, transparent); }
    .pe-note.warn { border-color: var(--wa-amber-line); background: var(--wa-amber-bg); }
    .pe-note.err { border-color: color-mix(in srgb, var(--wa-need) 45%, transparent); }
    .pe-link { border: 0; background: none; padding: 0; color: var(--wa-accent); font: inherit; font-size: 13px; cursor: pointer; }
    .pe-link:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 4px; }
    .pe-empty {
      display: flex; flex-direction: column; align-items: flex-start; gap: 8px; max-width: 560px;
      padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px); background: var(--wa-card);
    }
    .cc-start { display: flex; flex-wrap: wrap; gap: 8px; }
    .layout.pe-layout { flex: none; min-height: auto; overflow: visible; align-items: start; padding: 0; margin-bottom: 14px; }
    .pe-layout > .column.left, .pe-layout > .column.inspector {
      --pe-under-top: max(0px, calc(var(--pe-top-h, 0px) - var(--cf-pad, 16px)));
      position: sticky; top: var(--pe-under-top);
      max-height: calc(var(--pe-view-h, calc(100dvh - 120px)) - 30px - var(--pe-under-top));
      overflow-y: auto; overflow-x: hidden;
    }
    .pe-layout > .column.left { display: flex; flex-direction: column; gap: 8px; scrollbar-gutter: auto; }
    .pe-layout > .column.left > .card { flex: none; }
    .pe-layout > .column.canvas { overflow: visible; min-height: auto; }
    @container (max-width: 820px) {
      .layout.pe-layout { grid-template-columns: minmax(0, 1fr); }
      .pe-layout > .gutter { display: none; }
      /* As strong as the sticky rule, so a stacked list or inspector stops
         sliding over the cards above it (the page editor's fix). */
      .pe-layout > .column.left, .pe-layout > .column.canvas, .pe-layout > .column.inspector { grid-column: auto; position: static; max-height: none; overflow: visible; }
      .pe-layout > .column.canvas { order: 1; }
      .pe-layout > .column.inspector { order: 2; }
      .pe-layout > .column.left { order: 3; }
    }
    .column.canvas > .card.canvas-card.cc-canvas { min-height: 0; flex: none; }
    .cv-head .cv-title { flex: 0 1 auto; min-width: 0; font-size: 14px; font-weight: 600; letter-spacing: -.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .cv-head .cv-watch { min-width: 0; font-size: 12.5px; font-weight: 500; color: var(--wa-ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pe-chip-glyph { display: inline-flex; flex: none; color: var(--pe-person, var(--wa-muted)); }
    .pe-chip-glyph svg.ui-icon { width: 13px; height: 13px; }
    .picker > button.cc-watch-btn { max-width: 260px; }
    .cc-watch-btn .tb-browse-l { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .cc-watch-btn .cc-caret { display: inline-flex; flex: none; color: var(--wa-muted); }
    .picker > button.cc-watch-btn .cc-caret svg { width: 11px; height: 11px; }
    .pop-menu.cc-watch-menu { left: 0; right: auto; min-width: 220px; }
    .cc-watch-menu .row.cc-watch-row { display: flex; align-items: center; gap: 8px; }
    .cc-watch-row .cc-watch-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .cc-watch-row[aria-checked="true"] { font-weight: 700; }
    .cc-watch-check { display: inline-flex; flex: none; width: 14px; color: var(--wa-accent); }
    .cc-watch-check svg.ui-icon { width: 14px; height: 14px; }
    .cc-stage-area { position: relative; padding: 64px 12px 12px; gap: 10px; }
    @container (max-width: 460px) {
      .cc-stage-area { padding-top: 92px; }
    }
    .cc-stage-body { display: flex; justify-content: center; padding: 0 4px 4px; overflow-x: auto; overflow-y: hidden; }
    .cc-stage-area > .under {
      display: flex; flex-direction: column; gap: 4px; align-self: center; max-width: 460px; text-align: center;
      font-size: 11.5px; font-weight: 400; line-height: 15px; color: var(--wa-hint, var(--wa-muted));
    }
    .stage-tools button.tb.cc-case { cursor: default; }
    .stage-tools button.tb.cc-case:hover { background: transparent; }
    .stage-tools button.tb.cc-case > svg.ui-icon { width: 14px; height: 14px; }
    .pe-history { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
    .pe-history > li { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-top: 1px solid var(--wa-line); }
    .pe-history > li:first-child { border-top: 0; }
    .pe-h-text { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
    .pe-h-text > .pe-muted { font-size: 12px; }
    .pe-btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      flex: none; min-height: 32px; padding: 0 12px; border: 1px solid var(--wa-line-strong); border-radius: var(--wa-r-sm, 8px);
      background: var(--wa-card); color: var(--wa-ink); font: inherit; font-size: 13px; cursor: pointer;
    }
    .pe-btn:hover:not(:disabled) { background: var(--wa-panel); }
    .pe-btn:focus-visible { outline: none; box-shadow: var(--wa-ring); }
    .pe-btn:disabled { opacity: .55; cursor: default; }
    .pe-btn.pe-primary { border-color: transparent; background: var(--wa-primary-bg); color: var(--wa-primary-ink); }
    .pe-btn.pe-primary:hover:not(:disabled) { background: var(--wa-primary-bg); filter: brightness(1.1); }
    .pe-btn.pe-danger { color: var(--wa-need); align-self: flex-start; }
    dialog.pe-ask {
      width: min(460px, calc(100vw - 32px)); padding: 20px; border: 1px solid var(--wa-line); border-radius: var(--wa-r-lg, 16px);
      background: var(--wa-card); color: var(--wa-ink); box-shadow: var(--wa-shadow-pop);
    }
    dialog.pe-ask::backdrop { background: rgba(0, 0, 0, .45); }
    dialog.pe-ask > * + * { margin-top: 10px; }
    dialog.pe-ask h3 { font-size: 17px; text-transform: none; letter-spacing: 0; color: var(--wa-ink); overflow-wrap: anywhere; }
    dialog.pe-ask p { font-size: 14px; line-height: 1.4; }
    dialog.pe-ask p.pe-muted { font-size: 13px; }
    .pe-ask-foot { display: flex; justify-content: flex-end; gap: 8px; padding-top: 6px; }
    :host([narrow]) { --cf-pad: 12px; }
  `,to,Yt,Ot]}};v([S({attribute:!1})],f.prototype,"hass",2),v([S({attribute:!1})],f.prototype,"owners",2),v([S({attribute:!1})],f.prototype,"ownerId",2),v([S({type:Boolean,reflect:!0})],f.prototype,"narrow",2),v([S({attribute:!1})],f.prototype,"icons",2),v([S({attribute:!1})],f.prototype,"iconsTick",2),v([S({attribute:!1})],f.prototype,"haMenu",2),v([S({attribute:!1})],f.prototype,"onHaMenu",2),v([S({attribute:!1})],f.prototype,"onBack",2),v([S({attribute:!1})],f.prototype,"barActions",2),v([S({attribute:!1})],f.prototype,"shellOwnsWatch",2),v([S({attribute:!1})],f.prototype,"barHost",2),v([y()],f.prototype,"watchId",2),v([y()],f.prototype,"record",2),v([y()],f.prototype,"unsupported",2),v([y()],f.prototype,"loading",2),v([y()],f.prototype,"loadError",2),v([y()],f.prototype,"history",2),v([y()],f.prototype,"historyState",2),v([y()],f.prototype,"note",2),v([y()],f.prototype,"restoreAsk",2),v([y()],f.prototype,"restoring",2),v([y()],f.prototype,"starting",2),v([y()],f.prototype,"historyOpen",2),v([y()],f.prototype,"rawOpen",2),v([y()],f.prototype,"rawCopied",2),v([y()],f.prototype,"ownList",2),v([y()],f.prototype,"topMenuOpen",2),v([y()],f.prototype,"watchMenuOpen",2),v([y()],f.prototype,"zoom",2),v([y()],f.prototype,"columns",2),v([y()],f.prototype,"hostWidth",2),v([y()],f.prototype,"hostHeight",2),v([y()],f.prototype,"movedCheck",2);customElements.get("wa-control-center-editor")||customElements.define("wa-control-center-editor",f);export{Xe as CC_COLUMNS_KEY,f as WaControlCenterEditor};
