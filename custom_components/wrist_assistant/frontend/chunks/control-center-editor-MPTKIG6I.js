import{A as Xt,B as Qt,o as Bt,p as ye,q,r as xe,s as ke,w as Jt,x as Wt,y as Zt,z as Gt}from"./chunk-YCS7SQYH.js";import{b as yt,c as me,d as xt,e as ge,f as kt,h as _,i as Yt}from"./chunk-7JMKOI2L.js";import{a as we,b as It,c as At,d as Ht,e as Lt,f as Pt,g as Mt,h as Ft,i as jt}from"./chunk-F4UHUOUZ.js";import{m as wt,q as Nt}from"./chunk-GHLPG73B.js";import{Q as qt,a as zt,b as Ut,d as Kt,m as Vt,n as S}from"./chunk-ZIEG52KN.js";import{$f as _t,$g as en,Ac as lt,Bc as ut,Cc as pt,Ce as $t,Dc as ht,Ec as ft,Fc as mt,Fd as Ct,Hb as ie,Jb as fe,Kb as ot,Lb as it,Mb as rt,Nb as st,Qc as O,Uf as St,Zc as gt,a as g,ag as Tt,ah as tn,bg as Et,bh as nn,c as oe,d,de as ve,eg as Ce,fd as vt,g as v,gd as re,i as tt,ie as be,ig as Ot,j as T,jc as at,k as y,ld as bt,pg as Rt,rg as Dt,sc as V,tc as k,ub as nt,xc as ct,zc as dt}from"./chunk-6T2WMNG2.js";var on={toggleDomains:["light","switch","fan","input_boolean","lock","cover"],actionDomains:["scene","script","automation"],defaultIcons:{light:"lightbulb",switch:"switch.2",fan:"fan",lock:"lock",cover:"blinds.horizontal.closed",scene:"play",script:"scroll",automation:"gearshape.2",input_boolean:"togglepower"},fallbackIcon:"circle",requiredKeys:["entityId","displayName","iconName","domain"],optionalKeys:["customIconName","customDisplayName","tintColorHex","isHidden","schemaVersion"]};var F=on,rn="#0A84FF";function E(e){return F.toggleDomains.includes(e)?"toggle":F.actionDomains.includes(e)?"action":"none"}function B(){return[...F.toggleDomains,...F.actionDomains]}function sn(e){let o=F.defaultIcons;return Object.hasOwn(o,e)?o[e]:F.fallbackIcon}function an(e,o){if(E(e)!=="toggle"||o===void 0)return;let t=o.toLowerCase();return e==="lock"?t==="unlocked":e==="cover"?t==="open":t==="on"}var $e=["customIconName","customDisplayName","tintColorHex"];var $="entities",Qn=1,cn=Vt;function Se(e){return S(e)?e:void 0}function dn(){return{schemaVersion:Qn,[$]:[]}}function _e(e){let o=qt(e),t=o/cn;return{size:o,limit:cn,share:t,near:t>.8}}function W(e){let o=Object.hasOwn(e,$)?e[$]:void 0;return Array.isArray(o)?o:[]}function A(e){return e===void 0?[]:W(e).filter(S)}function I(e){return typeof e=="string"?e:void 0}function R(e){let o={entityId:I(e.entityId)??"",displayName:I(e.displayName)??"",iconName:I(e.iconName)??"",domain:I(e.domain)??"",isHidden:e.isHidden===!0},t=I(e.customIconName),n=I(e.customDisplayName),i=I(e.tintColorHex);return t!==void 0&&(o.customIconName=t),n!==void 0&&(o.customDisplayName=n),i!==void 0&&(o.tintColorHex=i),o}function Y(e){return e.customDisplayName??e.displayName}function se(e){return e.customIconName??e.iconName}function Z(e){return E(e.domain)!=="none"}function ln(e){return $e.some(o=>Object.hasOwn(e,o)&&e[o]!==null)}function Te(e,o){return A(e).find(t=>t.entityId===o)}function Ee(e,o){return Te(e,o)!==void 0}function J(e,o,t){o==="__proto__"?Object.defineProperty(e,o,{value:t,enumerable:!0,writable:!0,configurable:!0}):e[o]=t}function Oe(e,o,t){if(Object.hasOwn(e,o)){if(_(e[o],t)&&typeof e[o]==typeof t)return e;let r={};for(let s of Object.keys(e))J(r,s,s===o?t:e[s]);return r}let n={},i=!1;for(let r of Object.keys(e))!i&&r>o&&(J(n,o,t),i=!0),J(n,r,e[r]);return i||J(n,o,t),n}function Re(e,o){if(!Object.hasOwn(e,o))return e;let t={};for(let n of Object.keys(e))n!==o&&J(t,n,e[n]);return t}function ae(e,o){return Oe(e,$,o)}function De(e,o,t){let n=W(e),i=n.findIndex(c=>S(c)&&c.entityId===o);if(i<0)return e;let r=n[i],s=t(r);if(s===r)return e;let a=n.slice();return a[i]=s,ae(e,a)}function Ne(e){let o=e.indexOf(".");return o<0?"":e.slice(0,o)}function j(e,o){let n=(e===void 0||!Object.hasOwn(e,o)?void 0:e[o])?.attributes?.friendly_name;return typeof n=="string"&&n.trim()!==""?n:o}var eo=1;function to(e,o){let t=Ne(e);return{displayName:j(o,e),domain:t,entityId:e,iconName:sn(t),schemaVersion:eo}}function un(e,o,t){let n=new Set(A(e).map(a=>I(a.entityId)??"")),i=[],r=[],s=[];for(let a of o){let c=a.trim();if(c===""||n.has(c)){r.push(a);continue}n.add(c),i.push(c),s.push(to(c,t))}return s.length===0?{document:e,added:i,refused:r}:{document:ae(e,[...W(e),...s]),added:i,refused:r}}function Ie(e,o){let t=W(e),n=t.filter(i=>!(S(i)&&i.entityId===o));return n.length===t.length?e:ae(e,n)}function Ae(e,o,t){let n=W(e),i=n.findIndex(c=>S(c)&&c.entityId===o);if(i<0)return e;let r=Math.max(0,Math.min(t,n.length-1));if(i===r)return e;let s=n.slice(),[a]=s.splice(i,1);return s.splice(r,0,a),ae(e,s)}function He(e,o,t,n){return De(e,o,i=>n===void 0||n===""?Re(i,t):Oe(i,t,n))}function pn(e,o,t){return He(e,o,"customDisplayName",t)}function hn(e,o,t){return He(e,o,"customIconName",t.trim())}function Le(e,o,t){return t!==void 0&&!/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(t)?e:He(e,o,"tintColorHex",t===void 0?void 0:t.toUpperCase())}function Pe(e,o,t){return De(e,o,n=>t?Oe(n,"isHidden",!0):Re(n,"isHidden"))}function fn(e,o){return De(e,o,t=>{let n=t;for(let i of $e)n=Re(n,i);return n})}function mn(e){if(!S(e))return["The Control Center list is not an object."];let o=Object.hasOwn(e,$)?e[$]:void 0;if(!Array.isArray(o))return["The Control Center list is missing."];let t=[],n=new Set;return o.forEach((i,r)=>{if(!S(i)){t.push(`Entry ${r+1} is not an object.`);return}let s=i.entityId,a=typeof s=="string"&&s!==""?s:`Entry ${r+1}`;typeof s!="string"||s===""?t.push(`${a} has no entity.`):(n.has(s)&&t.push(`${a} is on the list twice.`),n.add(s));for(let c of["displayName","iconName","domain"])typeof i[c]!="string"&&t.push(`${a} has no ${c}.`)}),t}function gn(e){let o=A(Se(e)).map(R),t=o.filter(i=>i.isHidden).length,n=o.length;return`${n} ${n===1?"entity":"entities"}${t>0?`, ${t} hidden`:""}.`}var vn="No Control Center list from this watch yet.",bn="Start with an empty list here, or open the iPhone app and turn on Edit pages in Home Assistant under Settings, Pages in Home Assistant.",Me="Start with an empty list",Cn="Pair this watch first.",wn="Update the integration to edit the Control Center list here.";function yn(e){let o=O(e).code;return o==="invalid"||o==="unknown_command"}function H(e,o){return e!=null&&Object.hasOwn(e,o)?e[o]:void 0}function G(e){if(!Array.isArray(e))return;let o=new Set,t=[];for(let n of e){if(!S(n)||typeof n.entityId!="string"||n.entityId===""||o.has(n.entityId))return;o.add(n.entityId),t.push([n.entityId,n])}return t}function no(e,o){let t=G(e),n=G(o);if(t===void 0||n===void 0)return e;let i=new Set(n.map(([r])=>r));return t.filter(([r])=>i.has(r)).map(([,r])=>r)}function xn(e){if(e===void 0)return"";let o=e.customDisplayName;return typeof o=="string"&&o!==""?o:typeof e.displayName=="string"?e.displayName:""}function kn(e,o,t){let n=e===null?void 0:e,i=o===null?void 0:o,r=t===null?void 0:t,s=n===void 0?[]:G(n),a=i===void 0?void 0:G(i),c=r===void 0?void 0:G(r);if(s===void 0||a===void 0||c===void 0)return{entities:_(i,n)?r:i,clashes:[]};let u=new Map(s),l=new Map(a),b=new Map(c),p=[],h=(f,w)=>{let x=u.get(f);return x===void 0||!_(w,x)},C=(f,w,x)=>h(f,w)?(h(f,x)&&!_(w,x)&&p.push({entityId:f,name:xn(w)||xn(x)}),w):x,D=(f,w)=>u.has(f)&&!h(f,w)?void 0:w,Xe=a.map(([f])=>f).filter(f=>u.has(f)),Qe=s.map(([f])=>f).filter(f=>l.has(f)),Gn=Xe.length!==Qe.length||Xe.some((f,w)=>f!==Qe[w]),N=[];if(Gn){for(let[f,w]of a){let x=b.get(f);if(x!==void 0)N.push(C(f,w,x));else{let K=D(f,w);K!==void 0&&N.push(K)}}for(let[f,w]of c){if(l.has(f))continue;let x=D(f,w);x!==void 0&&N.push(x)}}else{for(let[f,w]of c){let x=l.get(f);if(x!==void 0)N.push(C(f,x,w));else{let K=D(f,w);K!==void 0&&N.push(K)}}for(let[f,w]of a){if(b.has(f))continue;let x=D(f,w);x!==void 0&&N.push(x)}}let et=f=>Array.isArray(f)&&f.length===N.length&&N.every((w,x)=>w===f[x]);return et(r)?{entities:r,clashes:p}:et(i)?{entities:i,clashes:p}:{entities:N,clashes:p}}function $n(e,o,t){return e==null?no(H(t,$),H(o,$)):H(e,$)}function Sn(e,o,t){return kn($n(e,o,t),H(o,$),H(t,$)).clashes}function _n(e,o,t){let n=Yt(e,o,t),i=kn($n(e,o,t),H(o,$),H(t,$)).entities,r=H(n,$);if(i===r)return n;if(i===void 0){if(!Object.hasOwn(n,$))return n;let{[$]:s,...a}=n;return a}return n===t||n===o?{...n,[$]:i}:(n[$]=i,n)}var Tn=100,oo=3,Fe=class{constructor(o,t){this._undo=[];this._redo=[];this._kept=[];this._base=o,this._revision=t,this._document=o}get base(){return this._base}get revision(){return this._revision}get document(){return this._document}get canUndo(){return this._undo.length>0}get canRedo(){return this._redo.length>0}get kept(){return this._kept}get dirty(){let o=this._dirty;if(o!==void 0&&o.document===this._document&&o.base===this._base)return o.value;let t=this._document!==this._base&&!_(this._document,this._base);return this._dirty={document:this._document,base:this._base,value:t},t}apply(o,t){if(o===this._document||_(o,this._document))return(t===void 0||t!==this._coalesceKey)&&(this._coalesceKey=void 0),!1;if(t!==void 0&&t===this._coalesceKey&&this._undo.length>0){let n=this._undo[this._undo.length-1];return _(o,n)?(this._undo.pop(),this._document=n,this._coalesceKey=void 0):this._document=o,this._redo=[],!0}return this.pushUndo(this._document),this._redo=[],this._document=o,this._coalesceKey=t,!0}endCoalesce(){this._coalesceKey=void 0}undo(){this._coalesceKey=void 0;let o=this._undo.pop();return o===void 0?!1:(this._redo.push(this._document),this._document=o,!0)}redo(){this._coalesceKey=void 0;let o=this._redo.pop();return o===void 0?!1:(this.pushUndo(this._document),this._document=o,!0)}discard(){return this._coalesceKey=void 0,this.apply(this._base)}rebase(o,t){return t<this._revision?(this._kept=[],!1):this.mergeOnto(o,t)}restart(o,t){return this.mergeOnto(o,t)}mergeOnto(o,t){this._coalesceKey=void 0;let n=this._base;this._kept=this._document===n?[]:Sn(n,this._document,o);let i=new Map,r=b=>{let p=i.get(b);if(p!==void 0)return p;let h=b===n?o:_n(n,b,o);return h!==o&&_(h,o)&&(h=o),i.set(b,h),h},s=this._document,a=[...this._undo,this._document,...this._redo.slice().reverse()].map(r),c=this._undo.length,u=[],l=0;return a.forEach((b,p)=>{let h=u[u.length-1];h!==void 0&&(h===b||_(h,b))?p===c&&(u[u.length-1]=b):u.push(b),p===c&&(l=u.length-1)}),this._undo=u.slice(0,l),this._document=u[l],this._redo=u.slice(l+1).reverse(),this._base=o,this._revision=t,this._document!==s&&!_(this._document,s)}saved(o,t){t<this._revision||(this._coalesceKey=void 0,this._base=o,this._revision=t)}get saving(){return X.has(this)}get saveDone(){return X.get(this)}pushUndo(o){this._undo.push(o),this._undo.length>Tn&&this._undo.splice(0,this._undo.length-Tn)}},X=new WeakMap;function En(e,o){if(X.has(e))return Promise.resolve({ok:!1,revision:e.revision,merged:!1,code:"busy",message:"This Control Center list is being saved already."});let t=io(e,o).finally(()=>X.delete(e));return X.set(e,t),t}async function io(e,o){let t=!1,n=new Map,i=()=>n.size===0?{}:{kept:[...n.values()]},r=(s,a,c)=>({ok:!1,revision:e.revision,merged:t,code:s,message:a,...i(),...c===void 0?{}:{problems:c}});for(let s=1;;s++){let a=e.document,c=mn(a);if(c.length>0)return r("invalid",c.join(" "),c);let u;try{({revision:u}=await o.save(e.revision,a))}catch(l){let{code:b="unknown",message:p}=O(l);if(b!=="conflict"||s>=oo)return r(b,p);let h;try{h=await o.fetch()}catch(C){let D=O(C);return r(D.code??"unknown",D.message)}if(!S(h)||!(h.revision>0)||!S(h.document))return r("no_record","Home Assistant holds no Control Center list for this watch.");h.revision<e.revision?e.restart(h.document,h.revision):e.rebase(h.document,h.revision);for(let C of e.kept)n.set(C.entityId,C);if(t=!0,!e.dirty)return{ok:!0,revision:e.revision,merged:t,alreadySaved:!0,...i()};continue}return e.saved(a,u),{ok:!0,revision:e.revision,merged:t,...i()}}}async function On(e,o){try{let{revision:t}=await o(0,e);return{ok:!0,revision:t}}catch(t){let{code:n,message:i}=O(t);return n==="no_record"||n==="conflict"?{ok:!1,code:n,message:i}:n==="unknown_command"||n==="invalid"?{ok:!1,code:"unsupported",message:i}:{ok:!1,code:"error",message:i}}}var z=new Map;function U(e){return z.get(e)}function Rn(e,o,t){let n=z.get(e);if(n!==void 0&&t<=0)return{draft:n,mergedIntoEdits:!1,kept:[]};if(n===void 0||t<n.revision&&!n.dirty){let s=new Fe(o,t);return z.set(e,s),{draft:s,mergedIntoEdits:!1,kept:[]}}if(t===n.revision)return{draft:n,mergedIntoEdits:!1,kept:[]};let i=n.dirty,r=t<n.revision?n.restart(o,t):n.rebase(o,t);return{draft:n,mergedIntoEdits:i&&r,kept:i?n.kept:[]}}function ce(e){z.delete(e)}function je(){for(let e of z.values())if(e.dirty)return!0;return!1}function Dn(){z.clear()}function ro(e){return`"${e.name.trim()===""?e.entityId:e.name}"`}function de(e){if(e.length===0)return"";let o=e.map(ro);return`The iPhone also changed ${o.length===1?o[0]:`${o.slice(0,-1).join(", ")} and ${o[o.length-1]}`}. ${o.length===1?"Your version was kept.":"Your versions were kept."}`}function Nn(e){if(e.ok){let t=e.kept??[];if(e.alreadySaved===!0){let n=t.length>0?` ${de(t)}`:"";return{kind:t.length>0?"warn":"ok",text:`Nothing left to save. The iPhone saved the same changes, as revision ${e.revision}.${n}`}}return t.length>0?{kind:"warn",text:`Saved. ${de(t)}`}:e.merged?{kind:"ok",text:"Saved. Changes from the iPhone were merged in."}:void 0}let o=(e.message??"").trim();switch(e.code){case"conflict":return{kind:"warn",text:"Not saved. The Control Center list kept changing on the iPhone while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds a Control Center list for this watch. Start with an empty list again, or let the iPhone send its list."};case"invalid":{let t=e.problems??[];return t.length>0?{kind:"err",text:`Not saved. Something in the Control Center list is not right: ${t.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the Control Center list${o===""?".":`: ${o}`}`}}case"busy":return{kind:"warn",text:"Already saving this Control Center list. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the Control Center list just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${o===""?".":`: ${o}`}`}}}var M="control-center",ee="cc:entry",L="cc:add",le="cc:added",Q="cc:drag",so=["#4A9EF5","#5BC4F0","#34D399","#FBBF24","#F97316","#EF4444","#EC4899","#A855F7","#6366F1","#8B5CF6","#CCD8E6","#FFFFFF"],Hn="wrist-assistant-panel.control-center.zoom.v1";function Ln(e=me()){try{let o=e?.getItem(Hn),t=o==null||o===""?NaN:Number(o);return Bt.includes(t)?t:void 0}catch{return}}function Pn(e,o=me()){try{o?.setItem(Hn,e===void 0?"":String(e))}catch{}}var Mn="The entities the watch's Toggle and Action controls offer. Add a control from the watch's Control Center, then pick one of these. A save reaches the watch the next time it checks, or through the iPhone.",Fn="Drawn from Home Assistant's states now. Each button is a control you can add to the watch's Control Center. Hidden entries and other domains are left out. Tap a button to edit it.",jn="Not shown on the watch";function pe(e,o,t){return`${e} ${e===1?o:t}`}function te(e){return e.states}function In(e){let o=E(e.domain),t=o==="toggle"?"Toggle":o==="action"?"Action":jn;return`${e.entityId} \xB7 ${t}`}function ne(e){let o=e.uiState.get(ee);return typeof o=="string"?Te(e.document,o):void 0}function Ke(e,o){o===void 0?e.uiState.delete(ee):e.uiState.set(ee,o),e.uiState.delete(L),e.requestUpdate()}function Ve(e){return ne(e)===void 0&&!e.uiState.has(L)?!1:(e.uiState.delete(ee),e.uiState.delete(L),e.requestUpdate(),!0)}function he(e){let o=e.uiState.get(L);return typeof o=="object"&&o!==null?o:void 0}function P(e,o){o===void 0?e.uiState.delete(L):(e.uiState.set(L,o),e.uiState.delete(ee)),e.requestUpdate()}function Ue(e,o="entity"){e.uiState.delete(le),P(e,{mode:o,picked:[]})}function ze(e,o){let t=[],n=[];e.edit(s=>{let a=un(s,o,te(e.hass));return t=a.added,n=a.refused,a.document});let i=s=>j(te(e.hass),s),r=[];return t.length===1?r.push(`Added ${i(t[0])}.`):t.length>1&&r.push(`Added ${t.length} entities.`),n.length===1?r.push(`${i(n[0])} is on the list already.`):n.length>1&&r.push(`${n.length} are on the list already.`),r.length>0&&e.uiState.set(le,r.join(" ")),e.requestUpdate(),t}function ao(e){let{areas:o,entities:t}=e;if(!(o===void 0||t===void 0))return Object.entries(o).map(([n,i])=>({id:n,name:typeof i?.name=="string"&&i.name.trim()!==""?i.name.trim():n})).sort((n,i)=>n.name.localeCompare(i.name)||(n.id<i.id?-1:n.id>i.id?1:0))}function co(e,o){let{entities:t,devices:n}=e;if(t===void 0)return[];let i=B(),r=[];for(let a of Object.keys(e.states)){if(!i.includes(Ne(a))||!Object.hasOwn(t,a))continue;let c=t[a];if(c?.hidden||c?.entity_category)continue;(c?.area_id||(c?.device_id?n?.[c.device_id]?.area_id:void 0))===o&&r.push(a)}let s=a=>j(te(e),a);return r.sort((a,c)=>s(a).localeCompare(s(c))||(a<c?-1:a>c?1:0))}function qe(e){return e.tintColorHex??rn}function zn(e,o,t,n){return e.icons.render(o,t,n)??d`<span class="cc-glyph-dot" style=${`background:${n};width:${Math.max(4,t*.6)}px;height:${Math.max(4,t*.6)}px`}></span>`}function lo(e,o){let t=qe(o);return d`<span class="thumb cc-thumb" style=${`--c:${t}`} aria-hidden="true"><span class="cc-thumb-glyph">${zn(e,se(o),14,t)}</span></span>`}function uo(e,o,t){return{start:n=>{e.uiState.set(Q,o),n.dataTransfer?.setData("text/plain",o),n.dataTransfer&&(n.dataTransfer.effectAllowed="move")},over:n=>{typeof e.uiState.get(Q)=="string"&&(n.preventDefault(),n.dataTransfer&&(n.dataTransfer.dropEffect="move"))},drop:n=>{let i=e.uiState.get(Q);e.uiState.delete(Q),!(typeof i!="string"||i===o)&&(n.preventDefault(),e.edit(r=>Ae(r,i,t)))},end:()=>{e.uiState.delete(Q)}}}function po(e,o,t,n,i){let r=R(o),s=r.entityId,a=i===s,c=r.isHidden,u=Z(r),l=Y(r)||s,b=C=>e.edit(D=>Ae(D,s,C)),p=uo(e,s,t),h=()=>Ke(e,s);return d`<div class="layer cc-entry-row ${a?"hl":""} ${c||!u?"dim":""}" data-entity=${s} role="listitem" tabindex="0"
    draggable=${e.busy?"false":"true"} aria-current=${a?"true":"false"} aria-label=${l}
    title=${`${l} \xB7 ${In(r)}${c?", hidden":""}`}
    @dragstart=${p.start} @dragover=${p.over} @drop=${p.drop} @dragend=${p.end}
    @click=${C=>{C.target instanceof Element&&C.target.closest("button")||h()}}
    @keydown=${C=>{C.target!==C.currentTarget||C.key!=="Enter"&&C.key!==" "||(C.preventDefault(),h())}}>
    <span class="grip" aria-hidden="true"></span>
    ${lo(e,r)}
    <span class="name"><b><span class="nm-t">${l}</span></b><small>${In(r)}</small></span>
    <span class="right">
      <span class="badges">
        ${c?d`<span class="badge">hidden</span>`:v}
        ${u?v:d`<span class="badge cc-off" title=${`The watch's controls cover ${B().join(", ")}.`}>not shown</span>`}
      </span>
      <span class="acts">
        <button type="button" class="icon" ?disabled=${e.busy} title=${c?"Show":"Hide"} aria-label=${`${c?"Show":"Hide"} ${l}`}
          @click=${()=>e.edit(C=>Pe(C,s,!c))}>${k(c?"show":"hide")}</button>
        <button type="button" class="icon" ?disabled=${e.busy||t===0} title="Move up" aria-label=${`Move ${l} up`}
          @click=${()=>b(t-1)}>${k("up")}</button>
        <button type="button" class="icon" ?disabled=${e.busy||t===n-1} title="Move down" aria-label=${`Move ${l} down`}
          @click=${()=>b(t+1)}>${k("down")}</button>
        <button type="button" class="icon danger" ?disabled=${e.busy} title="Remove" aria-label=${`Remove ${l}`}
          @click=${()=>e.edit(C=>Ie(C,s))}>${k("delete")}</button>
      </span>
    </span>
  </div>`}function Un(e){let o=A(e.document),t=ne(e),n=t===void 0?void 0:R(t).entityId,i=he(e)!==void 0;return d`<section class="card lc cc-entries-card" aria-label="Control Center" style="--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: 44px; --thumb-h: 22px">
    <div class="lc-head">
      <span class="swatch">${k("grid")}</span><span class="lc-title">Control Center</span>
      <span class="lc-sub" title=${Mn}>${pe(o.length,"entity","entities")}</span>
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri cc-add ${i?"on":""}" aria-label="Add entities" ?disabled=${e.busy}
        title="Add an entity, or the entities of an area" @click=${()=>Ue(e)}>${k("plus")}<span>Add</span></button>
    </div>
    ${o.length===0?d`<div class="lc-note">No entities yet. Add lights, switches, scenes and more for the watch's Control Center.</div>`:d`<div class="layers cc-entry-list" role="list">${o.map((r,s)=>po(e,r,s,o.length,n))}</div>
        <div class="lc-note cc-drag-note">Drag an entity, or use its arrows, to reorder.</div>`}
  </section>`}function ho(e,o,t){let n=e.scale,i=qe(o),r=an(o.domain,e.hass.states[o.entityId]?.state),s=E(o.domain),a=r===!0?i:"rgba(255,255,255,.17)",c=r===!0?"#FFFFFF":s==="action"?i:r===!1?"#FFFFFF":"rgba(255,255,255,.55)",u=44*n,l=Y(o)||o.entityId,b=r===void 0?s==="toggle"?"no state":"action":r?"on":"off";return d`<button type="button" class="cc-w-btn ${t?"on":""}" title=${`${l} \xB7 ${b}`} aria-label=${`${l}, ${b}`}
    style=${`gap:${4*n}px;width:${u+8*n}px`} @click=${()=>Ke(e,o.entityId)}>
    <span class="cc-w-circle" style=${`width:${u}px;height:${u}px;background:${a}`}>${zn(e,se(o),Math.round(20*n),c)}</span>
    <span class="cc-w-name" style=${`font-size:${9*n}px`}>${l}</span>
  </button>`}function An(e,o,t,n){if(t.length===0)return v;let i=e.scale;return d`<div class="cc-w-head" style=${`font-size:${10*i}px;margin:${2*i}px ${4*i}px`}>${o}</div>
    <div class="cc-w-grid" style=${`gap:${8*i}px ${4*i}px`}>${t.map(r=>ho(e,r,r.entityId===n))}</div>`}function Kn(e){let{width:o,height:t}=e.screen,n=e.scale,i=A(e.document).map(R),r=i.filter(p=>!p.isHidden&&Z(p)),s=r.filter(p=>E(p.domain)==="toggle"),a=r.filter(p=>E(p.domain)==="action"),c=ne(e),u=c===void 0?void 0:R(c).entityId,l=r.length===0?d`<p class="cc-w-empty" style=${`font-size:${11*n}px`}>${i.length===0?"Add entities":"Nothing the watch shows"}</p>`:d`<div class="cc-w-scroll" style=${`padding:${26*n}px ${8*n}px ${14*n}px;gap:${6*n}px`}>
      ${An(e,"Toggle",s,u)}
      ${An(e,"Action",a,u)}
    </div>`,b=d`<div class="cc-screen" role="group" aria-label="Control Center on the watch"
    style=${`width:${Math.round(o*n)}px;min-height:${Math.round(t*n)}px`}>${l}</div>`;return Jt({width:o,height:t},n,b,"Control Center on the watch")}function Vn(e){let o=A(e.document).map(R),t=o.filter(r=>r.isHidden).length,n=o.filter(r=>!Z(r)).length,i=[pe(o.length,"entity","entities")];return t>0&&i.push(`${t} hidden`),n>0&&i.push(`${n} not shown`),[i.join(", ")]}function qn(e,o){return Zt(e.uiState,M,o)}function fo(e,o){Gt(e.uiState,M,o,!qn(e,o)),e.requestUpdate()}var mo={entry:{color:V.content,icon:"content"},look:{color:V.look,icon:"look"},add:{color:V.content,icon:"plus"},list:{color:V.place,icon:"grid"}};function ue(e,o,t,n,i,r={}){let s=qn(e,t),a=mo[o];return mt({color:a.color,icon:k(a.icon),title:n,open:s,onToggle:()=>fo(e,t),...r.summary===void 0||r.summary===""?{}:{summary:r.summary},dot:r.dot===!0,id:`${M}:${t}`},s?i:d``)}function go(e){return he(e)!==void 0?[{module:M,section:"add"}]:ne(e)!==void 0?[{module:M,section:"entry"},{module:M,section:"look"}]:[{module:M,section:"list"}]}function vo(e,o){let t=R(o),n=t.entityId,i=Z(t),r=E(t.domain),s=e.hass.states[n],a=ln(o),c=s===void 0?"Not in Home Assistant now.":`${j(te(e.hass),n)} is ${s.state}.`,u=ue(e,"entry","entry","Entity",d`<fieldset class="cc-body" ?disabled=${e.busy} aria-label="Entity">
    ${Ce("Visibility",t.isHidden?"hidden":"visible",[["visible","Visible"],["hidden","Hidden"]],p=>e.edit(h=>Pe(h,n,p==="hidden")))}
    <div class="hint cc-under">Hidden entries stay on the list and out of the watch's pickers.</div>
    ${Et("Name",t.customDisplayName??"",p=>e.edit(h=>pn(h,n,p),`entry:${n}:name`),{placeholder:t.displayName||n})}
    <div class="hint cc-under">Empty shows the entity's own name, ${t.displayName===""?"none":`"${t.displayName}"`}.</div>
    <div class="cc-facts">
      <span><b>Entity</b><code>${n}</code></span>
      <span><b>Control</b>${r==="toggle"?"Toggle":r==="action"?"Action":d`<span class="cc-warn">${jn}</span>`}</span>
      <span><b>Now</b>${c}</span>
    </div>
    ${i?v:d`<p class="cc-warn cc-under-full">The watch's controls cover ${B().join(", ")}. This entry is kept on the list but never shown.</p>`}
  </fieldset>`,{summary:Y(t)||n}),l=t.tintColorHex,b=ue(e,"look","look","Icon and color",d`<fieldset class="cc-body" ?disabled=${e.busy} aria-label="Icon and color">
    <div class="cc-stack">${Dt({icons:e.icons,symbols:e.symbols},se(t),p=>e.edit(h=>hn(h,n,p===t.iconName?"":p),`entry:${n}:icon`),`cc:icon:${n}`,void 0,"Icon",!1)}</div>
    ${Ot("Color",l,p=>e.edit(h=>Le(h,n,p),`entry:${n}:tint`),!0,null)}
    <div class="cc-swatches" role="group" aria-label="The iPhone's colors">
      ${so.map(p=>{let h=l!==void 0&&l.toUpperCase()===p;return d`<button type="button" class="cc-swatch ${h?"on":""}" style=${`--sw:${p}`} title=${p} aria-label=${`Color ${p}`}
          aria-pressed=${h?"true":"false"} ?disabled=${e.busy} @click=${()=>e.edit(C=>Le(C,n,p))}></button>`})}
    </div>
    <div class="hint cc-under">No color draws the control in the watch's blue.</div>
    <div class="cc-acts">
      <button type="button" class="pe-btn" ?disabled=${e.busy||!a} title="Back to the entity's own name and icon, with no color"
        @click=${()=>e.edit(p=>fn(p,n))}>${k("reset")}<span>Reset to defaults</span></button>
    </div>
  </fieldset>`,{summary:a?"Changed":"Defaults",dot:a});return d`${u}${b}
    <div class="cc-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${e.busy} title="Remove this entity from the list"
        @click=${()=>e.edit(p=>Ie(p,n))}>${k("delete")}<span>Remove</span></button>
    </div>`}function bo(e,o,t){let n=new Set(o.picked);return d`<div class="cc-pick-list" role="group" aria-label="Entities in the area">
    ${t.map(i=>{let r=Ee(e.document,i);return d`<label class="cc-pick-row ${r?"held":""}">
        <input type="checkbox" .checked=${r||n.has(i)} ?disabled=${e.busy||r}
          @change=${s=>{let a=he(e)??o,c=a.picked.filter(u=>u!==i);P(e,{...a,picked:s.target.checked?[...c,i]:c})}} />
        <span class="cc-pick-name">${j(te(e.hass),i)}${r?d` <span class="hint">on the list</span>`:v}</span><code>${i}</code>
      </label>`})}
  </div>`}function Co(e,o){let t=e.uiState.get(le),n=Ce("Add",o.mode,[["entity","Entity"],["area","From an area"]],r=>{e.uiState.delete(le),P(e,{mode:r,picked:[]})}),i;if(o.mode==="entity"){let r=Number(e.uiState.get(`${L}:n`)??0)||0;i=d`<div class="cc-stack">${Rt({hass:e.hass},"Entity",{entityId:"",displayName:"",domain:""},s=>{let a=s.entityId.trim();a!==""&&(e.uiState.set(`${L}:n`,r+1),ze(e,[a]))},`cc:add:entity:${r}`,{clearable:!1,domain:B()})}</div>
      <div class="hint">Lights, switches, fans, input booleans, locks and covers are toggles; scenes, scripts and automations are actions. Pick another to add it too.</div>`}else{let r=ao(e.hass);if(r===void 0)i=d`<p class="hint">This Home Assistant does not share its areas with the panel. Add entities one by one instead.</p>`;else if(r.length===0)i=d`<p class="hint">No areas in Home Assistant yet.</p>`;else{let s=o.area!==void 0&&r.some(l=>l.id===o.area)?o.area:void 0,a=s===void 0?[]:co(e.hass,s),c=a.filter(l=>!Ee(e.document,l)),u=o.picked.filter(l=>c.includes(l));i=d`<label class="field cc-area"><span>Area</span>
          <select @change=${l=>P(e,{...o,area:l.target.value||void 0,picked:[]})}>
            <option value="" ?selected=${s===void 0}>Choose an area</option>
            ${r.map(l=>d`<option value=${l.id} ?selected=${l.id===s}>${l.name}</option>`)}
          </select></label>
        ${s===void 0?v:a.length===0?d`<p class="hint">No light, switch, fan, lock, cover, input boolean, scene, script or automation in this area.</p>`:d`${bo(e,o,a)}
            <div class="cc-acts">
              <button type="button" class="pe-btn pe-primary" ?disabled=${e.busy||u.length===0}
                @click=${()=>{ze(e,u),P(e,{...o,area:s,picked:[]})}}>
                ${k("plus")}<span>${u.length===0?"Add":`Add ${pe(u.length,"entity","entities")}`}</span></button>
              <button type="button" class="pe-btn" ?disabled=${e.busy||c.length===0}
                @click=${()=>{ze(e,c),P(e,{...o,area:s,picked:[]})}}>
                <span>${c.length===0?"All on the list":`Add all ${c.length}`}</span></button>
            </div>`}`}}return d`${ue(e,"add","add","Add entities",d`<fieldset class="cc-body" ?disabled=${e.busy} aria-label="Add entities">
    ${n}${i}
    ${typeof t=="string"?d`<div class="hint cc-added" role="status">${t}</div>`:v}
  </fieldset>`)}
    <div class="cc-acts">
      <button type="button" class="pe-btn" @click=${()=>P(e,void 0)}>Done</button>
    </div>`}function wo(e){let o=A(e.document).map(R),t=o.filter(s=>E(s.domain)==="toggle").length,n=o.filter(s=>E(s.domain)==="action").length,i=o.filter(s=>s.isHidden).length,r=o.length-t-n;return ue(e,"list","list","Control Center list",d`<div class="cc-body">
    <p class="hint">${Mn}</p>
    <div class="cc-facts">
      <span><b>Toggles</b>${t}</span>
      <span><b>Actions</b>${n}</span>
      ${i>0?d`<span><b>Hidden</b>${i}</span>`:v}
      ${r>0?d`<span><b>Not shown</b>${r}</span>`:v}
    </div>
    <div class="cc-acts">
      <button type="button" class="pe-btn pe-primary" ?disabled=${e.busy} @click=${()=>Ue(e)}>${k("plus")}<span>Add entities</span></button>
      <button type="button" class="pe-btn" ?disabled=${e.busy} @click=${()=>Ue(e,"area")}><span>Add from an area</span></button>
    </div>
  </div>`,{summary:pe(o.length,"entity","entities")})}function Bn(e){let o=ne(e),t=he(e),n=go(e),i=Xt(e.uiState,n),r,s;if(t!==void 0)r=d`<div class="crumbs"><button class="root" title="The list" @click=${()=>Ve(e)}>Control Center</button><span class="sep">›</span><span class="nm">Add entities</span></div>`,s=Co(e,t);else if(o!==void 0){let a=R(o),c=Y(a)||a.entityId,u=E(a.domain);r=d`<div class="crumbs"><button class="root" title="The list" @click=${()=>Ke(e,void 0)}>Control Center</button><span class="sep">›</span><span class="kchip" style=${`--k:${qe(a)}`}>${u==="toggle"?"Toggle":u==="action"?"Action":"Not shown"}</span><span class="nm" title=${c}>${c}</span></div>`,s=vo(e,o)}else r=d`<div class="crumbs"><span class="kchip" style="--k:#5B8FD4">List</span><span class="nm">Control Center</span></div>`,s=d`${wo(e)}<p class="cc-note">Select an entity to edit it, or add one.</p>`;return d`<div class="insp-head">
      ${r}
      <button class="expand" @click=${()=>{Qt(e.uiState,n,!i),e.requestUpdate()}}>${i?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${s}</div>`}var Jn=oe`
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
`;nn({dirty:je,drop:Dn});typeof window<"u"&&window.addEventListener("beforeunload",e=>{je()&&(e.preventDefault(),e.returnValue="")});var yo=15e3,Zn=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),Be=Zn?"\u2318":"Ctrl+",Je={min:200,max:720,middleMin:320},We={left:280,right:340},Ye="wrist-assistant-panel.control-center.columns.v1",xo=24,Wn=820;function Ze(e){return O(e).message}function Ge(e){return O(e).code}function Yn(e){let{code:o,message:t}=O(e);return Object.assign(new Error(t),o===void 0?{}:{code:o})}function ko(e){return e<1e3?`${e} bytes`:`${Number((e/1e3).toFixed(1))} KB`}function $o(e){let o=e?Date.parse(e):NaN;return Number.isNaN(o)?"":at(Math.max(0,(Date.now()-o)/1e3))}function So(e){return e==="panel"?"Saved here":"From the watch"}function _o(e){return e instanceof HTMLElement?Ut(e.tagName,e instanceof HTMLInputElement?e.type:void 0,e.isContentEditable):!1}function To(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e===null||e===document.body||e===document.documentElement}var m=class extends tt{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=v;this.shellOwnsWatch=!1;this.unsupported=!1;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.starting=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.zoom=Ln();this.columns={...We};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new At(this);this.symbols=new $t(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.historySeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let t=this.watchId;!this.isConnected||t===void 0||this.load(t,!0)};this.onScrubStart=t=>{t.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=t=>{t.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=t=>{if(t.defaultPrevented)return;let n=t.composedPath();if(!n.includes(this)&&!To()||this.renderRoot.querySelector("dialog[open]"))return;let i=t.metaKey||t.ctrlKey,r=t.key.toLowerCase();if(i&&!t.altKey&&r==="s"){t.preventDefault(),this.save();return}if(t.key==="Escape"&&this.topMenuOpen){t.preventDefault(),this.topMenuOpen=!1;return}if(t.key==="Escape"&&this.watchMenuOpen){t.preventDefault(),this.watchMenuOpen=!1;return}if(!_o(n[0])){if(i&&!t.altKey&&r==="z"){t.preventDefault(),t.shiftKey?this.redo():this.undo();return}if(t.ctrlKey&&!t.metaKey&&!t.altKey&&r==="y"){t.preventDefault(),this.redo();return}if(t.key==="Escape"&&!i&&!t.altKey){let s=this.viewHost();s!==void 0&&Ve(s)&&t.preventDefault()}}};this.onWindowPointerDown=t=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let n=t.composedPath(),i=r=>n.some(s=>s instanceof HTMLElement&&s.classList.contains(r));this.topMenuOpen&&!i("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!i("cc-watch-picker")&&(this.watchMenuOpen=!1)};this.addEventListener(_t,this.onScrubStart),this.addEventListener(Tt,this.onScrubEnd),this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get watches(){return vt(this.owners.length>0?this.owners:this.ownList??[])}get draft(){if(!(this.watchId===void 0||this.record===void 0||this.record.revision<=0))return U(this.watchId)}get saving(){return this.draft?.saving??!1}get dirty(){return this.draft?.dirty??!1}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=xt(Ye,We,Je),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.historySeq++}willUpdate(t){if(this.hass){t.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,nt(this.hass).then(r=>{this.ownList=r.owners},()=>{this.ownList=[]}));let i=Ct(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||t.has("ownerId"));i!==void 0&&this.openWatch(i)}this.followSave();let n=this.restoreAsk;n!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(i=>i.revision===n.entry.revision)&&this.closeAsk()}updated(){let t=this.renderRoot.querySelector("dialog.pe-ask")??void 0;t!==this.shownDialog&&(this.shownDialog=t,t&&!t.open&&t.showModal()),Mt(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(t=>{for(let n of t){if(n.target!==this){this.measureTop(n.target);continue}let i=n.contentRect;Math.abs(i.width-this.hostWidth)>=1&&(this.hostWidth=i.width),Math.abs(i.height-this.hostHeight)>=1&&(this.hostHeight=i.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let t=this.sizeObserver;if(t===void 0)return;let n=this.renderRoot?.querySelector(".pe-top")??void 0;n!==this.observedTop&&(this.observedTop!==void 0&&t.unobserve(this.observedTop),this.observedTop=n,n!==void 0&&t.observe(n))}measureTop(t){let n=t.offsetHeight;n!==this.topHeight&&(this.topHeight=n,this.style.setProperty("--pe-top-h",`${n}px`))}listenForReconnect(){let t=this.hass?.connection;t!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof t?.addEventListener!="function")&&(t.addEventListener("ready",this.onReconnect),this.readyConnection=t))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let t=this.watchId;if(t===void 0)return;let n=U(t)?.saveDone;if(n===void 0||n===this.followedSave)return;this.followedSave=n;let i=()=>this.saveEnded(t);n.then(i,i)}saveEnded(t){this.requestUpdate(),this.isConnected&&(t===this.watchId?(this.reloadPending=!1,this.load(t,!0)):this.flushPending())}openWatch(t,n=!1){t!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=t,this.note=void 0,this.unsupported=!1,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),n=!1),this.startSubscription(t),this.load(t,n)}async load(t,n=!1){let i=this.hass;if(!i)return;if(n&&this.holdReload){this.reloadPending=!0;return}let r=++this.loadSeq;this.stopPolling(),n||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let s=await ie(i,t,"control_center");if(r!==this.loadSeq)return;if(n&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(s),this.loadError=void 0}catch(s){if(r!==this.loadSeq)return;yn(s)?(this.unsupported=!0,this.loadError=void 0):n||(this.loadError=Ze(s)),this.restartDraft?.watchId===t&&(this.restartDraft=void 0)}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(t))}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(t){let n=this.watchId;this.record=t;let i=t.revision>0?Se(t.document):void 0;if(n===void 0||i===void 0)return;let r=this.restartDraft;r!==void 0&&r.watchId===n&&t.revision>=r.revision&&(this.restartDraft=void 0,(U(n)?.dirty??!1)||ce(n));let s=Rn(n,i,t.revision);s.kept.length>0?this.note={kind:"warn",text:de(s.kept)}:s.mergedIntoEdits&&(this.note={kind:"warn",text:"The Control Center list changed on the iPhone. Your edits are kept."}),this.requestUpdate()}async loadHistory(t){let n=this.hass;if(!n||this.historyState==="unsupported")return;let i=++this.historySeq;try{let r=await ot(n,t,"control_center");if(i!==this.historySeq||t!==this.watchId)return;this.history=Array.isArray(r?.entries)?r.entries:[],this.historyState="ready"}catch(r){if(i!==this.historySeq||t!==this.watchId)return;this.historyState=Ge(r)==="unknown_command"?"unsupported":"error"}}startSubscription(t){let n=this.hass;if(this.endSubscription(),!n)return;let i=++this.subscribeSeq;st(n,t,r=>{i===this.subscribeSeq&&r.kind==="control_center"&&r.revision!==(this.record?.revision??0)&&this.load(t,!0)}).then(r=>{i===this.subscribeSeq?this.unsubscribe=r:r().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let t=this.unsubscribe;this.unsubscribe=void 0,t?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||gt(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},yo))}async poll(){this.pollTimer=void 0;let t=this.hass,n=this.watchId,i=this.record;if(!(!t||n===void 0||i===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let r=await ie(t,n,"control_center");if(n!==this.watchId||this.record!==i)return;r.revision===i.revision?this.record={...i,delivered_revision:r.delivered_revision,delivered_at:r.delivered_at,rejected_revision:r.rejected_revision,rejected_at:r.rejected_at}:this.holdReload?this.reloadPending=!0:(this.show(r),this.loadHistory(n))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(t,n){let i=this.draft;if(!i||this.saving)return!1;let r=i.apply(t(i.document),this.scrubKey??n);return this.requestUpdate(),r}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let t=this.icons??zt,n=this.iconMemo;if(n!==void 0&&n.provider===t&&n.tick===this.iconsTick)return n.icons;let i=Kt(t);return this.iconMemo={provider:t,tick:this.iconsTick,icons:i},i}screen(){let t=this.watches.find(n=>n.owner_watch_id===this.watchId);return(be(t?.screen_size)??ve).screen}viewHost(){let t=this.draft,n=this.hass;if(t===void 0||n===void 0)return;let i=this;return{hass:n,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.stageScale,get document(){return t.document},get busy(){return i.saving},edit:(r,s)=>this.draft===t&&this.edit(r,s),endCoalesce:()=>t.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let t=this.hass,n=this.watchId;this.endScrub();let i=this.draft;if(!t||n===void 0||!i||this.saving||!i.dirty)return;this.note=void 0;let r=En(i,{save:(a,c)=>fe(t,n,"control_center",a,c).catch(u=>{throw Yn(u)}),fetch:async()=>{let a=await ie(t,n,"control_center").catch(c=>{throw Yn(c)});return{revision:a.revision,document:a.document}}});this.followedSave=i.saveDone,this.requestUpdate();let s=await r.catch(a=>({ok:!1,revision:i.revision,merged:!1,code:Ge(a)??"unknown",message:Ze(a)}));this.saveEnded(n),n===this.watchId&&(this.note=Nn(s))}async start(){let t=this.hass,n=this.watchId;if(!t||n===void 0||this.starting)return;this.starting=!0,this.note=void 0;let i=await On(dn(),(r,s)=>fe(t,n,"control_center",r,s));if(this.starting=!1,n===this.watchId){if(i.ok)this.note={kind:"ok",text:"Started with an empty list. Add entities, then save; the watch picks them up the next time it checks."};else if(i.code==="no_record"){this.note={kind:"warn",text:`${Cn} Watch settings has Pair a watch.`};return}else if(i.code==="conflict")this.note={kind:"warn",text:"The iPhone sent its Control Center list meanwhile, so that is shown."};else if(i.code==="unsupported"){this.unsupported=!0;return}else{this.note={kind:"err",text:`Could not start: ${i.message}`};return}this.load(n,!0)}}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(t){let n=this.hass,i=this.watchId,r=this.record;if(!n||i===void 0||r===void 0||this.draft?.dirty)return;let s={entry:t,baseRevision:r.revision};this.restoreAsk=s,it(n,i,"control_center",t.revision).then(a=>{this.restoreAsk===s&&(this.restoreAsk={...s,summary:gn(a.document)})},()=>{})}async restore(){let t=this.hass,n=this.watchId,i=this.restoreAsk;if(!t||n===void 0||i===void 0||this.restoring)return;this.restoring=!0;let r;try{let s=await rt(t,n,"control_center",i.entry.revision,i.baseRevision);r={kind:"ok",text:`Revision ${i.entry.revision} is back.`},n===this.watchId?this.restartDraft={watchId:n,revision:s.revision}:(U(n)?.dirty??!1)||ce(n)}catch(s){let a=Ge(s);a==="conflict"?r={kind:"warn",text:"Not restored. The Control Center list changed somewhere else, so the newest copy is shown."}:a==="no_record"?r={kind:"warn",text:"Not restored. Home Assistant no longer holds a Control Center list for this watch."}:a==="not_found"?r={kind:"warn",text:"Not restored. That save is no longer kept."}:a==="unknown_command"?(this.historyState="unsupported",r={kind:"warn",text:"This version of the integration cannot restore the Control Center list. Update it to restore an earlier save."}):r={kind:"err",text:`Could not restore: ${Ze(s)}`}}finally{this.restoring=!1,this.restoreAsk===i&&this.closeAsk()}n===this.watchId&&(this.note=r,this.load(n,!0))}render(){let t=this.watches,n=this.draft;return d`
      <div class="pe-top">
        ${this.renderTopBar(n,t)}
        ${this.note?d`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:v}
      </div>
      ${this.renderBody(t)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):v}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=Wn}renderTopBar(t,n){let i=t!==void 0&&!this.unsupported,r=i&&this.dirty;return d`<div class="wa-bar ${this.stacked?"stacked":""}" role="toolbar" aria-label="Watch Control Center list">
      ${this.haMenu?d`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${k("menu")}</button>`:v}
      ${this.shellOwnsWatch?v:d`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():en(void 0,!1)}>${k("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${this.shellOwnsWatch?v:this.renderWatchPicker(n)}
      ${this.renderSyncPill(i?t:void 0)}
      ${this.renderTopMenu(i?t:void 0)}
      ${i?d`<button class="primary save ${r?"dirty":""}" ?disabled=${!r||this.saving}
          title=${r?`Save (${Be}S). A save reaches the watch the next time it checks, or through the iPhone.`:`Nothing to save (${Be}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        <span class="tb-saved" title=${r?"Unsaved changes":""}>${It(this.record)}</span>`:v}
      ${this.barActions}
      <button class="help" title="Help: Control Center" aria-label="Help"
        @click=${()=>window.open(tn,"_blank","noopener")}>?</button>
    </div>`}renderSyncPill(t){let n=this.record;if(n===void 0||n.revision<=0||this.unsupported)return v;let i=t===void 0?{size:0,limit:1}:_e(t.document),r=we({record:n,size:i.size,limit:i.limit,noun:"Control Center list",historyState:this.historyState});return d`<span class="tb-sync ${r.tone==="ok"?"ok":"warn"}" title=${`${r.state}. ${r.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${r.state}</span>
    </span>`}canStart(){let t=this.record;return this.watchId!==void 0&&t!==void 0&&t.revision<=0&&!this.unsupported}renderTopMenu(t){let n=this.canStart();if(t===void 0&&!n)return v;let i=this.topMenuOpen,r=s=>()=>{this.topMenuOpen=!1,s()};return d`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${i?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!i}}>···</button>
      ${i?d`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${t?d`<button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title="Go back to the copy Home Assistant holds. Undo brings the edits back."
          @click=${r(()=>this.discard())}>Discard edits</button>`:v}
        ${n?d`<button class="row" role="menuitem" ?disabled=${this.starting}
          @click=${r(()=>{this.start()})}>${Me}</button>`:v}
      </div>`:v}
    </span>`}personColor(t){let n=Nt(this.owners.length>0?this.owners:this.ownList??[]);return wt(n.findIndex(i=>i.owners.some(r=>r.owner_watch_id===t)))}renderWatchPicker(t){if(t.length<2)return v;let n=t.find(s=>s.owner_watch_id===this.watchId),i=this.watchMenuOpen,r=s=>{let a=s===void 0?void 0:this.personColor(s);return d`<span class="pe-chip-glyph" style=${a?`--pe-person: ${a}`:v} aria-hidden="true">${k("watch")}</span>`};return d`<span class="picker cc-watch-picker">
      <button type="button" class="tb-browse cc-watch-btn" aria-haspopup="menu" aria-expanded=${i?"true":"false"}
        title="Choose the watch whose Control Center list is shown" @click=${()=>{this.watchMenuOpen=!i}}>
        ${r(n?.owner_watch_id)}<span class="tb-browse-l">${n?re(n,t):"Choose a watch"}</span>
        <span class="cc-caret" aria-hidden="true">${k("chevron")}</span>
      </button>
      ${i?d`<div class="pop-menu cc-watch-menu" role="menu" aria-label="Watches">
        ${t.map(s=>{let a=s.owner_watch_id===this.watchId;return d`<button type="button" class="row cc-watch-row" role="menuitemradio" aria-checked=${a?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,a||this.openWatch(s.owner_watch_id)}}>
            ${r(s.owner_watch_id)}<span class="cc-watch-name">${re(s,t)}</span>
            <span class="cc-watch-check" aria-hidden="true">${a?k("check"):v}</span>
          </button>`})}
      </div>`:v}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=Wn?this.columns:yt(this.hostWidth-xo,this.columns,Je)}renderGutter(t){return d`<div class="gutter ${t}" role="separator" aria-orientation="vertical"
      aria-label=${t==="left"?"Resize the list column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${n=>{let i=this.fittedColumns();kt(n,{side:t,base:t==="left"?i.left:i.right,limits:Je,onWidth:r=>{this.columns={...this.columns,[t]:r}},onEnd:()=>ge(Ye,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[t]:We[t]},ge(Ye,this.columns)}}></div>`}get stageScale(){return this.zoom??ye(this.narrow||this.stacked)}setZoom(t){this.zoom=t,Pn(t)}renderStage(t,n){let i=n.find(p=>p.owner_watch_id===this.watchId),s=be(i?.screen_size)??ve,a=[...Vn(t),s.label],c="Control Center",u=this.draft,l=this.stageScale,b=ye(this.narrow||this.stacked);return d`<div class="card canvas-card cc-canvas" aria-label="Control Center">
      <div class="cv-head">
        <span class="cv-title" title=${c}>${c}</span>
        ${i!==void 0?d`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${re(i,n)}</span></span>`:v}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${a.join(" \xB7 ")}><span class="fam">${a.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!u?.canUndo} title=${`Undo (${Be}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${k("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!u?.canRedo} title=${Zn?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${k("redo")}</button>
        </span>
      </div>
      <div class="stage-area cc-stage-area">
        <div class="stage-tools" role="toolbar" aria-label="Stage tools">
          <button class="tb cc-case" aria-disabled="true" tabindex="-1" title=${`This watch's screen, ${s.label}.`}>
            ${k("watch")}<span class="word keep">${s.label}</span></button>
          <span class="tb-sep" aria-hidden="true"></span>
          <span class="tb-zoom" role="group" aria-label="Zoom">
            <button class="tb icon" ?disabled=${l<=ke(l)} aria-label="Zoom out" title="Zoom out"
              @click=${()=>this.setZoom(ke(l))}>−</button>
            <button class="tb pct" aria-label=${`Zoom ${q(l)}. Back to fit`}
              title=${`The watch at ${q(l)} of its own points. Click to fit it again (${q(b)}).`}
              @click=${()=>this.setZoom(void 0)}>${q(l)}</button>
            <button class="tb icon" ?disabled=${l>=xe(l)} aria-label="Zoom in" title="Zoom in"
              @click=${()=>this.setZoom(xe(l))}>+</button>
          </span>
        </div>
        <div class="cc-stage-body">${Kn(t)}</div>
        <div class="under"><span class="tail">${Fn}</span></div>
      </div>
    </div>`}renderBody(t){if(t.length===0){let c=this.owners.length===0&&this.ownList===void 0;return d`<div class="pe-empty">${c?"Loading\u2026":"No watch has connected to this Home Assistant yet."}</div>`}if(this.unsupported)return d`<div class="pe-empty"><b>${wn}</b></div>`;if(this.loading)return d`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let c=this.watchId;return d`<div class="pe-empty">
        <span>Could not read this watch's Control Center list: ${this.loadError}</span>
        ${c===void 0?v:d`<button class="pe-btn" @click=${()=>{this.load(c)}}>Try again</button>`}
      </div>`}let n=this.record;if(n===void 0)return d`<div class="pe-empty">Loading…</div>`;let i=this.draft,r=this.viewHost();if(n.revision<=0||i===void 0||r===void 0){let c=this.watchId===void 0?void 0:U(this.watchId),u=this.watchId;return d`<div class="pe-empty"><b>${vn}</b><span>${bn}</span>
        <span class="cc-start">
          <button class="pe-btn pe-primary" ?disabled=${this.starting} @click=${()=>{this.start()}}>${this.starting?"Starting\u2026":Me}</button>
        </span>
        <span class="pe-muted">${bt}</span>
        ${c?.dirty&&u!==void 0?d`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when the Control Center list is here again.</span>
          <button class="pe-btn" @click=${()=>{ce(u),this.requestUpdate()}}>Discard the kept edits</button>`:v}
      </div>`}let s=this.fittedColumns(),a=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"";return d`<div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${s.left}px;--wa-right:${s.right}px;${a}`}>
      <div class="column left">
        ${Un(r)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(r,t)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${Bn(r)}
      </div>
    </div>
    ${this.renderFoot(n,i.document,i.dirty)}`}renderFoot(t,n,i){let r=_e(n),s=we({record:t,size:r.size,limit:r.limit,noun:"Control Center list",historyState:this.historyState}),a=this.watchId;return d`${Ht({status:s,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?Lt({noun:"Control Center list",record:t,entries:this.history,historyState:this.historyState,dirty:i,restoring:this.restoring,onRetry:()=>{a!==void 0&&(this.historyState="loading",this.loadHistory(a))},onRestore:c=>{this.historyOpen=!1,this.askRestore(c)},onClosed:()=>{this.historyOpen=!1}}):v}
    ${this.rawOpen?Pt({noun:"Control Center list",document:n,revision:t.revision,dirty:i,copied:this.rawCopied,onCopy:c=>{Ft(c).then(u=>{this.rawCopied=u})},onClosed:()=>{this.rawOpen=!1}}):v}`}renderRestoreAsk(t){let n=this.record,i=$o(t.entry.updated_at);return d`<dialog class="pe-ask" aria-labelledby="cc-ask-title"
      @cancel=${r=>{this.restoring&&r.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="cc-ask-title">Restore revision ${t.entry.revision}?</h3>
      <p>${So(t.entry.updated_by)}${i?` ${i}`:""}, ${ko(t.entry.size)}.</p>
      ${t.summary?d`<p class="pe-muted">${t.summary}</p>`:v}
      <p>It is saved again as a new revision${n?`, after revision ${n.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[St,ct,dt,lt,ut,pt,ht,ft,Wt,oe`
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
      .pe-layout > .column { grid-column: auto; position: static; max-height: none; overflow: visible; }
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
  `,Jn,jt]}};g([T({attribute:!1})],m.prototype,"hass",2),g([T({attribute:!1})],m.prototype,"owners",2),g([T({attribute:!1})],m.prototype,"ownerId",2),g([T({type:Boolean,reflect:!0})],m.prototype,"narrow",2),g([T({attribute:!1})],m.prototype,"icons",2),g([T({attribute:!1})],m.prototype,"iconsTick",2),g([T({attribute:!1})],m.prototype,"haMenu",2),g([T({attribute:!1})],m.prototype,"onHaMenu",2),g([T({attribute:!1})],m.prototype,"onBack",2),g([T({attribute:!1})],m.prototype,"barActions",2),g([T({attribute:!1})],m.prototype,"shellOwnsWatch",2),g([y()],m.prototype,"watchId",2),g([y()],m.prototype,"record",2),g([y()],m.prototype,"unsupported",2),g([y()],m.prototype,"loading",2),g([y()],m.prototype,"loadError",2),g([y()],m.prototype,"history",2),g([y()],m.prototype,"historyState",2),g([y()],m.prototype,"note",2),g([y()],m.prototype,"restoreAsk",2),g([y()],m.prototype,"restoring",2),g([y()],m.prototype,"starting",2),g([y()],m.prototype,"historyOpen",2),g([y()],m.prototype,"rawOpen",2),g([y()],m.prototype,"rawCopied",2),g([y()],m.prototype,"ownList",2),g([y()],m.prototype,"topMenuOpen",2),g([y()],m.prototype,"watchMenuOpen",2),g([y()],m.prototype,"zoom",2),g([y()],m.prototype,"columns",2),g([y()],m.prototype,"hostWidth",2),g([y()],m.prototype,"hostHeight",2);customElements.get("wa-control-center-editor")||customElements.define("wa-control-center-editor",m);export{Ye as CC_COLUMNS_KEY,m as WaControlCenterEditor};
