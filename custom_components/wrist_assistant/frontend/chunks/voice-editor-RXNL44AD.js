import{A as te,B as Wn,C as Mn,D as Nn,E as Fn,F as Un,G as qn,H as pe,I as zn,J as jn,K as Bn,L as Fe,M as Kn,N as Jn,a as he,b as Ee,c as Re,d as E,e as ee,f as Ae,g as He,h as Le,i as N,j as _n,k as In,l as Pn,m as Dn,n as Cn,o as We,p as On,q as En,r as Rn,s as Me,t as R,u as F,v as An,w as ue,x as Hn,y as Ln,z as Ne}from"./chunk-K2FMQMDM.js";import{a as Ce,b as dn,c as ln,d as hn,e as Oe,f as un,g as pn,h as fn,i as vn,j as gn,k as mn,l as wn,m as yn,n as kn,o as xn,p as $n,q as Sn,r as Vn,s as Tn}from"./chunk-DGQOVYZT.js";import{d as bn}from"./chunk-7O325OCR.js";import{c as ft}from"./chunk-HYO6YZS2.js";import{qc as Te,rc as on,tc as le,zb as sn}from"./chunk-2HIDQW6P.js";import"./chunk-PHH55XEF.js";import{a as zt,b as jt,c as Bt}from"./chunk-5VZTOSMN.js";import{A as De,a as rn,b as _e,c as an,d as cn,x as Ie,y as Q,z as Pe}from"./chunk-Z5GAWQYW.js";import{a as Mt,b as Nt,c as Z,d as Ft,h as Ut}from"./chunk-U6Q7O7OZ.js";import{b as Kt,d as Jt,e as Ve,f as Yt}from"./chunk-ZOJGMATP.js";import{a as Qt,b as en}from"./chunk-ICV5TW4O.js";import{d as tn,e as nn}from"./chunk-HRVQPLBG.js";import"./chunk-SIZDPFO7.js";import{c as Gt,d as Xt,f as Zt}from"./chunk-HHO45WAO.js";import{$b as It,Aa as $t,F as G,Id as Yn,Kd as Gn,Nd as Xn,Wb as Tt,Xb as _t,Yb as ae,_b as ce,ac as Pt,ba as be,cc as ke,dc as Dt,ga as ye,ib as St,kc as Ct,mc as Ot}from"./chunk-CW2MFPI6.js";import{U as V,V as qt,i as C}from"./chunk-JFV4YI4N.js";import{Ah as bt,Bh as yt,Ch as kt,Dh as xt,Gg as j,Ig as we,Jg as rt,Kg as at,Lg as ct,Mg as dt,Mh as Vt,Ng as lt,Og as ht,Wg as ut,b as z,d,fh as pt,g as f,ig as ot,j as st,k as _,l as w,qh as B,rh as y,vh as vt,xh as gt,yh as mt,zh as wt}from"./chunk-RA6AEJS2.js";import{J as Et,Y as Rt,aa as de,ab as Lt,cb as Wt,da as At,db as D,ea as X,eb as $e,fa as xe,ga as Ht,gb as Se}from"./chunk-RCA6FBW6.js";import{a as g}from"./chunk-LO2NM3CE.js";var Fi="On means the page is on that device. An edit on one device shows on all of them. Each device keeps its own order and Hidden.";function Zn(n){let{name:i,places:e,blocked:t,busy:s,note:o}=n;return d`<div class="pk-dup-menu pe-dev-menu ${n.className??""}" role="group" aria-label=${`Devices for ${i}`}>
    <div class="pk-dup-head">${n.head??"This page is on"}</div>
    ${t===void 0?f:d`<div class="pe-dev-note warn">${t}</div>`}
    ${e.map(r=>Ui({place:r,name:i,title:r.stuck??t??n.titleOf?.(r)??(r.on?`Take it off ${r.device.name}. Its own order and Hidden go with it.`:`Put it on ${r.device.name}. An edit on one device then shows on both.`),off:r.stuck!==void 0||t!==void 0||s,...n.colorOf===void 0?{}:{colorOf:n.colorOf},onToggle:n.onToggle}))}
    ${s?d`<div class="pe-dev-note">Saving…</div>`:f}
    ${o===void 0?f:d`<div class="pe-dev-note ${o.kind}" role="status">${o.text}</div>`}
    <div class="pk-dup-note">${n.foot??Fi}</div>
    <button type="button" class="pk-dup-done" @click=${()=>n.onDone()}>Done</button>
  </div>`}function Ui(n){let{place:i,off:e}=n,t=i.device.name,s=n.colorOf?.(i.device.ownerId);return d`<div class="pk-dup-row check ${e?"off":""} ${s===void 0?"":"tinted"}"
    style=${s===void 0?f:`--dc:${s}`}>
    <label class="pk-dup-pick" title=${n.title}>
      <input type="checkbox" role="switch" .checked=${G(i.on)} ?disabled=${e}
        aria-label=${`${n.name} on ${t}`}
        @change=${o=>{o.currentTarget.checked=i.on,n.onToggle(i)}}>
      ${y(i.device.kind==="iphone"?"phone":"watch")}
      <span class="pk-dup-name">${t}</span>
      ${i.here?d`<span class="pk-dup-full">this ${Nt(i.device.kind)}</span>`:i.tag===void 0?f:d`<span class="pk-dup-full">${i.tag}</span>`}
    </label>
  </div>`}var Qn=z`
  .pk-dup-menu {
    display: flex; flex-direction: column; gap: 4px; padding: 8px; cursor: default;
    border: 1px solid var(--wa-line-strong); border-radius: 10px;
    background: var(--wa-card); box-shadow: var(--wa-shadow-pop); text-align: left;
  }
  .pk-dup-row {
    display: flex; align-items: center; gap: 7px; width: 100%; text-align: left; cursor: pointer;
    font: inherit; font-size: 12px; color: var(--wa-ink);
    padding: 5px 7px; border: 1px solid var(--wa-line); border-radius: 7px; background: var(--wa-card);
  }
  .pk-dup-row svg { flex: none; width: 14px; height: 14px; }
  .pk-dup-row.check { padding: 0; gap: 0; cursor: default; }
  .pk-dup-pick { flex: 1; min-width: 0; display: flex; align-items: center; gap: 7px; padding: 5px 7px; cursor: pointer; }
  .pk-dup-pick svg { flex: none; width: 14px; height: 14px; }
  .pk-dup-row.check input { margin: 0; cursor: inherit; }
  .pk-dup-row.check.off .pk-dup-pick { opacity: .5; cursor: default; }
  .pk-dup-row.tinted { box-shadow: inset 3px 0 0 var(--dc); }
  .pk-dup-row.tinted .pk-dup-pick svg { color: var(--dc); }
  .pk-dup-row.check:hover:not(.off) { border-color: var(--wa-line-strong); }
  .pk-dup-head { font-size: 11.5px; font-weight: 700; color: var(--wa-muted); margin: 2px 0; }
  .pk-dup-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pk-dup-full { flex: none; font-size: 10px; color: var(--wa-muted); }
  .pk-dup-note { font-size: 10px; line-height: 1.4; color: var(--wa-muted); border-top: 1px solid var(--wa-line); padding-top: 6px; }
  .pk-dup-done {
    align-self: flex-end; margin-top: 2px; font: inherit; font-size: 11px; font-weight: 600;
    padding: 4px 12px; border-radius: 7px; cursor: pointer;
    border: 1px solid var(--wa-accent); background: var(--wa-sel-bg); color: var(--wa-accent);
  }
  .pk-dup-done:hover { filter: brightness(1.1); }
  .pk-dup-done:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .pe-dev-note { font-size: 11px; line-height: 1.4; color: var(--wa-muted); overflow-wrap: anywhere; }
  .pe-dev-note.ok { color: var(--wa-ok, var(--wa-ink)); }
  .pe-dev-note.warn, .pe-dev-note.err { color: var(--wa-need); }
`;var I="phrases";function A(n,i){return n!=null&&Object.hasOwn(n,i)?n[i]:void 0}function K(n){if(!Array.isArray(n))return;let i=new Set,e=[];for(let t of n){if(!C(t)||typeof t.id!="string"||t.id==="")return;let s=t.id.toUpperCase();if(i.has(s))return;i.add(s),e.push([s,t])}return e}function qi(n,i,e){let t=n===null?void 0:n,s=i===null?void 0:i,o=e===null?void 0:e,r=t===void 0?[]:K(t),a=s===void 0?void 0:K(s),l=o===void 0?void 0:K(o);if(r===void 0||a===void 0||l===void 0)return V(s,t)?o:s;let c=new Map(r),h=new Map(a),u=new Map(l),k=(b,$)=>{let T=c.get(b);return T===void 0||!V($,T)},m=(b,$,T)=>k(b,$)?$:T,S=(b,$)=>c.has(b)&&!k(b,$)?void 0:$,x=a.map(([b])=>b).filter(b=>c.has(b)),H=r.map(([b])=>b).filter(b=>h.has(b)),P=x.length!==H.length||x.some((b,$)=>b!==H[$]),me=P?a:l,p=P?l:a,M=P,O=[];for(let[b,$]of me){let T=(M?u:h).get(b);if(T!==void 0)O.push(M?m(b,$,T):m(b,T,$));else{let it=S(b,$);it!==void 0&&O.push(it)}}for(let[b,$]of p){if((M?h:u).has(b))continue;let T=S(b,$);T!==void 0&&O.push(T)}let re=b=>Array.isArray(b)&&b.length===O.length&&O.every(($,T)=>$===b[T]);return re(o)?o:re(s)?s:O}function ei(n,i,e){let t=qt(n,i,e),s=qi(n==null?e[I]:A(n,I),A(i,I),A(e,I)),o=A(t,I);if(s===o)return t;if(s===void 0){if(!Object.hasOwn(t,I))return t;let{[I]:r,...a}=t;return a}return t===e||t===i?{...t,[I]:s}:(t[I]=s,t)}function ti(n,i,e){let t=new Set([...Object.keys(i),...Object.keys(e)]),s=[];for(let o of t){if(o===I){let h=new Map(K(A(n,I))??[]),u=K(A(i,I)),k=new Map(K(A(e,I))??[]);if(u===void 0)continue;u.some(([S,x])=>{let H=k.get(S),P=h.get(S);return H!==void 0&&!V(x,H)&&(P===void 0||!V(x,P)&&!V(H,P))})&&s.push(o);continue}let r=A(n,o),a=A(i,o),l=A(e,o),c=h=>n==null||!V(h,r);c(a)&&c(l)&&!V(a,l)&&s.push(o)}return s.sort()}var ni=100,zi=3,fe=class{constructor(i,e){this._undo=[];this._redo=[];this._replaced=[];this._base=i,this._revision=e,this._document=i}get base(){return this._base}get revision(){return this._revision}get document(){return this._document}get canUndo(){return this._undo.length>0}get canRedo(){return this._redo.length>0}get replaced(){return this._replaced}get dirty(){let i=this._dirty;if(i!==void 0&&i.document===this._document&&i.base===this._base)return i.value;let e=this._document!==this._base&&!V(this._document,this._base);return this._dirty={document:this._document,base:this._base,value:e},e}apply(i,e){if(i===this._document||V(i,this._document))return(e===void 0||e!==this._coalesceKey)&&(this._coalesceKey=void 0),!1;if(e!==void 0&&e===this._coalesceKey&&this._undo.length>0){let t=this._undo[this._undo.length-1];return V(i,t)?(this._undo.pop(),this._document=t,this._coalesceKey=void 0):this._document=i,this._redo=[],!0}return this.pushUndo(this._document),this._redo=[],this._document=i,this._coalesceKey=e,!0}endCoalesce(){this._coalesceKey=void 0}undo(){this._coalesceKey=void 0;let i=this._undo.pop();return i===void 0?!1:(this._redo.push(this._document),this._document=i,!0)}redo(){this._coalesceKey=void 0;let i=this._redo.pop();return i===void 0?!1:(this.pushUndo(this._document),this._document=i,!0)}discard(){return this._coalesceKey=void 0,this.apply(this._base)}rebase(i,e){return e<this._revision?(this._replaced=[],!1):this.mergeOnto(i,e)}restart(i,e){return this.mergeOnto(i,e)}mergeOnto(i,e){this._coalesceKey=void 0;let t=this._base;this._replaced=this._document===t?[]:ti(t,this._document,i);let s=new Map,o=u=>{let k=s.get(u);if(k!==void 0)return k;let m=u===t?i:ei(t,u,i);return m!==i&&V(m,i)&&(m=i),s.set(u,m),m},r=this._document,a=[...this._undo,this._document,...this._redo.slice().reverse()].map(o),l=this._undo.length,c=[],h=0;return a.forEach((u,k)=>{let m=c[c.length-1];m!==void 0&&(m===u||V(m,u))?k===l&&(c[c.length-1]=u):c.push(u),k===l&&(h=c.length-1)}),this._undo=c.slice(0,h),this._document=c[h],this._redo=c.slice(h+1).reverse(),this._base=i,this._revision=e,this._document!==r&&!V(this._document,r)}saved(i,e){e<this._revision||(this._coalesceKey=void 0,this._base=i,this._revision=e)}get saving(){return ne.has(this)}get saveDone(){return ne.get(this)}pushUndo(i){this._undo.push(i),this._undo.length>ni&&this._undo.splice(0,this._undo.length-ni)}},ne=new WeakMap;function ii(n,i){if(ne.has(n))return Promise.resolve({ok:!1,revision:n.revision,merged:!1,code:"busy",message:"These voice settings are being saved already."});let e=ji(n,i).finally(()=>ne.delete(n));return ne.set(n,e),e}async function ji(n,i){let e=!1,t=new Set,s=()=>t.size===0?{}:{replaced:[...t].sort()},o=(r,a,l)=>({ok:!1,revision:n.revision,merged:e,code:r,message:a,...l===void 0?{}:{problems:l}});for(let r=1;;r++){let a=n.document,l=jn(a);if(l.length>0)return o("invalid",l.join(" "),l);let c;try{({revision:c}=await i.save(n.revision,a))}catch(h){let{code:u="unknown",message:k}=D(h);if(u!=="conflict"||r>=zi)return o(u,k);let m;try{m=await i.fetch()}catch(S){let x=D(S);return o(x.code??"unknown",x.message)}if(!C(m)||!(m.revision>0)||!C(m.document))return o("no_record","Home Assistant holds no voice settings for this watch.");m.revision<n.revision?n.restart(m.document,m.revision):n.rebase(m.document,m.revision);for(let S of n.replaced)t.add(S);if(e=!0,!n.dirty)return{ok:!0,revision:n.revision,merged:e,alreadySaved:!0};continue}return n.saved(a,c),{ok:!0,revision:n.revision,merged:e,...s()}}}var L=new Map;function U(n){return L.get(n)}function Ue(n,i,e){let t=L.get(n);if(t!==void 0&&e<=0)return{draft:t,mergedIntoEdits:!1,replaced:[]};if(t===void 0||e<t.revision&&!t.dirty){let r=new fe(i,e);return L.set(n,r),{draft:r,mergedIntoEdits:!1,replaced:[]}}if(e===t.revision)return{draft:t,mergedIntoEdits:!1,replaced:[]};let s=t.dirty,o=e<t.revision?t.restart(i,e):t.rebase(i,e);return{draft:t,mergedIntoEdits:s&&o,replaced:s?t.replaced:[]}}function qe(n){let i=L.get(n);if(i===void 0){let e=new fe(ee(),0);return L.set(n,e),e}return i.revision>0&&!i.saving&&i.restart(ee(),0),i}function ve(n){L.delete(n)}function ze(){for(let n of L.values())if(n.dirty)return!0;return!1}function si(){L.clear()}var ge="linkIds",ie="phrases",Bi=["defaultAssistAgentId","defaultSpeakers","defaultTTSEngine","phrases"];var oi="Phrases and defaults";function W(n){let i=n?.[ge],e=C(i)?i[ie]:void 0;return typeof e=="string"&&e!==""?e:void 0}function ri(n){let i=C(n)?n.voice:void 0;if(!C(i))return;let e={};for(let[t,s]of Object.entries(i))!C(s)||typeof s.unit!="string"||!Array.isArray(s.owners)||(e[t]={unit:s.unit,owners:s.owners.filter(o=>typeof o=="string")});return e}function je(n,i,e){let t=W(n),s=t===void 0?[]:e?.[t]?.owners??[];return[i,...s.filter(o=>o!==i)]}var Ki="These are this watch's phrases. Switch off another watch to unlink it.",Ji=`${X} Phrases can go on this watch after that.`,Yi="waiting for iPhone",ai="Phrases and defaults are on",ci="On means the watch has these phrases and defaults. An edit on one watch shows on all of them. Each watch keeps its own watch voice and Silent Mode setting.";function di(n){let i=n.device.name;return n.on?`Unlink ${i}. It keeps a copy of the phrases as they are now.`:`Put them on ${i}. An edit on one watch then shows on both.`}function li(n,i,e,t,s=new Set){let o=new Set(je(i,e,t));return n.filter(r=>r.kind==="watch").map(r=>{let a=r.ownerId===e,l=o.has(r.ownerId);return a?{device:r,on:!0,here:!0,stuck:Ki}:!l&&s.has(r.ownerId)?{device:r,on:l,here:!1,stuck:Ji,tag:Yi}:{device:r,on:l,here:!1}})}function hi(n,i,e){let t=n.filter(s=>s!==i);if(t.length!==0){if(t.length===1){let s=e.find(o=>o.ownerId===t[0])?.name;return s===void 0?"On 2 watches":`Also on ${s}`}return`On ${n.length} watches`}}function ui(n,i,e){let t=n.filter(o=>o!==i);if(t.length===0)return;let s=t.map(o=>e.find(r=>r.ownerId===o)?.name??"another watch");return`Also on ${Z(s)}. An edit here shows there too.`}function pi(n,i){if(n===void 0)return!1;let e=W(n);return e!==void 0&&e===i?!1:e!==void 0||R(n).length>0}function fi(n){return`Replace the phrases on ${n}? Its own are lost.`}var Be="Its watch voice and Silent Mode setting stay as they were.";function vi(n,i){let e=[];for(let t of n){let s=t.now===void 0?[]:t.holders(t.now),o=t.restored===void 0?[]:t.holders(t.restored);if(t.now!==void 0&&t.restored===t.now){s.length>0&&e.push(`Also changes the ${t.name} on ${Z(s)}.`);continue}if(s.length>0){let r=s.length===1?"which keeps its copy as it is":"which keep their copies as they are";e.push(`Unlinks the ${t.name} on this ${i} from ${Z(s)}, ${r}.`)}o.length>0&&e.push(`Also changes the ${t.name} on ${Z(o)}, which it was shared with in that save.`)}return e}function gi(n){let{code:i,message:e}=D(n);switch(i){case"unknown_device":return"That watch is not paired with this Home Assistant any more.";case"not_found":return"This watch's voice settings are not saved yet. Save first, then try again.";case"unit_taken":return"That watch has phrases of its own.";case"not_for_iphone":return"An iPhone keeps no phrases.";case"awaiting_move":return`${X} Try again after that.`;case"unknown_command":return"This version of the integration cannot share phrases between watches. Update it first.";default:return e}}function mi(n){let i=n[ge];if(!C(i)||!Object.hasOwn(i,ie))return n;let{[ie]:e,...t}=i;return Object.keys(t).length===0?Le(n,ge):He(n,ge,t)}function Ke(n,i=!1){let e=ee(),t=n;for(let s of Bi)t=Object.hasOwn(e,s)?He(t,s,e[s]):Le(t,s);return i?mi(t):t}function wi(n){return Ke(n)===n}function bi(n){if(!(n.length<2))return{question:`These phrases and defaults are on ${n.length} watches.`,here:"Here only",all:`On all ${n.length} watches`,count:n.length}}var Gi=3;async function yi(n,i){for(let e=1;;e++){let t;try{t=await n.read(i)}catch(r){let{code:a="unknown",message:l}=D(r);return{ok:!1,code:a,message:l}}let s=t.revision>0?E(t.document):void 0;if(s===void 0)return{ok:!0,unlinked:!1};let o=mi(s);if(o===s)return{ok:!0,unlinked:!1};try{return await n.save(i,t.revision,o),{ok:!0,unlinked:!0}}catch(r){let{code:a="unknown",message:l}=D(r);if(a!=="conflict"||e>=Gi)return{ok:!1,code:a,message:l}}}}var Xi={defaultAssistAgentId:"the conversation agent",defaultTTSEngine:"the text to speech engine",defaultSpeakers:"the speakers",phrases:"the phrases",watchSpeakReplyInSilentMode:"Speak even in Silent Mode",watchSpeechVoiceIdentifier:"the watch voice"};function Zi(n){return Xi[n]??"a setting this panel does not show"}function Je(n){if(n.length===0)return"";let i=[...new Set(n.map(Zi))];return`Another save also changed ${i.length===1?i[0]:`${i.slice(0,-1).join(", ")} and ${i[i.length-1]}`}. ${i.length===1?"Your version replaced it.":"Your versions replaced them."}`}function ki(n){if(n.ok){if(n.alreadySaved===!0)return{kind:"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${n.revision}.`};let e=n.replaced??[];return e.length>0?{kind:"warn",text:`Saved. ${Je(e)}`}:n.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let i=(n.message??"").trim();switch(n.code){case"conflict":return{kind:"warn",text:"Not saved. The voice settings kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds voice settings for this watch. Your edits are kept, so save again."};case"invalid":{let e=n.problems??[];return e.length>0?{kind:"err",text:`Not saved. ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the voice settings${i===""?".":`: ${i}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${Wt}`};case"busy":return{kind:"warn",text:"Already saving these voice settings. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the voice settings just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${i===""?".":`: ${i}`}`}}}var xi=[["defaults","Defaults"],["watch","On the watch"]],$i={defaults:"What Assist and Speak use when a tile, a slot or a phrase picks nothing of its own.",watch:"How the watch itself speaks a reply."},Qi="The voice defaults, the phrase library and the watch's own speech. A save reaches the watch the next time it checks.",Si="Pick from List shows these phrases on the watch. Tap one to edit it.",es={defaults:{color:B.content,icon:"content"},watch:{color:B.content,icon:"watch"},phrase:{color:B.content,icon:"text"},look:{color:B.look,icon:"look"},speech:{color:B.content,icon:"content"}},ts="#ab47bc",oe="voice-editor",Vi=44,Ti=22;function q(n,i){let e=n.states[i]?.attributes?.friendly_name;return typeof e=="string"&&e.trim()!==""?e:i}function ns(n,i){let e=i.indexOf(".");return{entityId:i,displayName:i===""?"":q(n,i),domain:e>0?i.slice(0,e):""}}function _i(n,i,e,t){return n.icons.render(i,e,t)??d`<span class="vo-glyph-dot" style=${`background:${t}`}></span>`}function Ye(n){if(typeof n!="string"||n==="")return{fill:"#D88CC4",ink:"#D88CC4"};if(n.toUpperCase()==="#RAINBOW")return{fill:"conic-gradient(#FF3B30, #FF9500, #FFCC00, #34C759, #007AFF, #AF52DE, #FF3B30)",ink:"#FF9500"};if(n.toUpperCase().startsWith("GRADIENT|")){let i=n.split("|").slice(1).filter(e=>/^#[0-9a-fA-F]{6}$/.test(e));if(i.length>=2)return{fill:`linear-gradient(135deg, ${i.join(", ")})`,ink:i[0]};if(i.length===1)return{fill:i[0],ink:i[0]}}return{fill:n,ink:n}}function Ii(n,i){return rn(n.uiState,oe,i)}function is(n,i){_e(n.uiState,oe,i,!Ii(n,i)),n.requestUpdate()}function se(n,i,e,t,s={}){let o=Ii(n,i),r=es[i];return xt({color:r.color,icon:y(r.icon),title:e,open:o,onToggle:()=>is(n,i),...s.summary===void 0||s.summary===""?{}:{summary:s.summary},dot:s.dot===!0,id:`${oe}:${i}`},o?t:d``)}var Ge="vo:pick";function J(n){let i=n.uiState.get(Ge);if(typeof i=="string"&&i.startsWith("phrase:")){let e=An(n.document,i.slice(7));if(e!==void 0)return{phrase:e}}return{section:i==="watch"?"watch":"defaults"}}function Xe(n,i){n.uiState.set(Ge,i),n.requestUpdate()}function Ze(n,i){n.uiState.set(Ge,`phrase:${i}`),n.requestUpdate()}function Pi(n){return"phrase"in J(n)?(Xe(n,"defaults"),!0):!1}function ss(n){let i;n.edit(e=>{let t=Ln(e);return i=t.id,t.document}),i!==void 0&&(_e(n.uiState,oe,"phrase",!0),Ze(n,i))}function os(n,i){if(i==="defaults"){let s=N(n.document);return s.speakers.length===0?"No speakers":s.speakers.map(r=>q(n.hass,r)).join(", ")}let e=We(n.document),t=e===void 0?void 0:n.voices.find(s=>s.id===e);return e===void 0?"System voice":t!==void 0?Me(t):e}function Di(n){let i=J(n),e="section"in i?i.section:void 0;return d`<section class="card lc vo-voice-card" aria-label="Voice"
    style=${`--c: var(--wa-lc-pages, #26a69a); --thumb-w: ${Vi}px; --thumb-h: ${Ti}px`}>
    <div class="lc-head">
      <span class="swatch">${Xn()}</span><span class="lc-title">Voice</span>
      <span class="lc-sub" title=${Qi}>for the watch</span>
    </div>
    <div class="layers vo-section-list" role="list">
      ${xi.map(([t,s])=>{let o=t===e,r=()=>Xe(n,t);return d`<div class="layer vo-section-row ${o?"hl":""}" data-section=${t} role="listitem" tabindex="0"
          aria-current=${o?"true":"false"} aria-label=${s} title=${$i[t]}
          @click=${r}
          @keydown=${a=>{a.target!==a.currentTarget||a.key!=="Enter"&&a.key!==" "||(a.preventDefault(),r())}}>
          <span class="grip" aria-hidden="true"></span>
          <span class="thumb vo-thumb" aria-hidden="true">${y(t==="watch"?"watch":"content")}</span>
          <span class="name"><b><span class="nm-t">${s}</span></b><small>${os(n,t)}</small></span>
          <span class="right"></span>
        </div>`})}
    </div>
  </section>`}function rs(n,i){let e=Ye(i.color),t=typeof i.icon=="string"&&i.icon!==""?i.icon:"speaker.wave.2";return d`<span class="thumb vo-thumb" style=${`--c:${e.ink}`} aria-hidden="true"><span class="vo-thumb-glyph">${_i(n,t,14,e.ink)}</span></span>`}function as(n){let i=pe(n);return i.length>0?`Needs a ${i.join(" and a ")}`:typeof n.message=="string"?n.message:""}function cs(n,i,e,t,s){let o=F(i),r=s!==void 0&&F(s).toUpperCase()===o.toUpperCase(),a=ue(i),l=as(i),c=pe(i).length>0,h=()=>Ze(n,o);return d`<div class="layer vo-phrase-row ${r?"hl":""}" data-phrase=${o} role="listitem" tabindex="0"
    aria-current=${r?"true":"false"} aria-label=${a} title=${`${a} \xB7 ${l}`}
    @click=${u=>{u.target instanceof Element&&u.target.closest("button")||h()}}
    @keydown=${u=>{u.target!==u.currentTarget||u.key!=="Enter"&&u.key!==" "||(u.preventDefault(),h())}}>
    <span class="grip" aria-hidden="true"></span>
    ${rs(n,i)}
    <span class="name"><b><span class="nm-t">${a}</span></b><small class=${c?"vo-needs":""}>${l}</small></span>
    <span class="right">
      <span class="acts">
        <button type="button" class="icon" ?disabled=${n.busy||e===0} title="Move up" aria-label=${`Move ${a} up`}
          @click=${()=>n.edit(u=>te(u,o,e-1))}>${y("up")}</button>
        <button type="button" class="icon" ?disabled=${n.busy||e===t-1} title="Move down" aria-label=${`Move ${a} down`}
          @click=${()=>n.edit(u=>te(u,o,e+1))}>${y("down")}</button>
        <button type="button" class="icon danger" ?disabled=${n.busy} title="Remove" aria-label=${`Remove ${a}`}
          @click=${()=>n.edit(u=>Ne(u,o))}>${y("delete")}</button>
      </span>
    </span>
  </div>`}function Ci(n,i){let e=R(n.document),t=J(n),s="phrase"in t?t.phrase:void 0,o=Hn(n.document);return d`<section class="card lc vo-phrases-card" aria-label="Phrases"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${Vi}px; --thumb-h: ${Ti}px`}>
    <div class="lc-head">
      <span class="swatch">${y("list")}</span><span class="lc-title">Phrases</span>
      <span class="lc-sub">${e.length} of ${Ee}</span>
      ${i?.badge===void 0?f:d`<span class="badge vo-linked" title=${i.badgeTitle??i.badge}>${i.badge}</span>`}
      <span class="spacer"></span>
      ${i===void 0?f:d`<button type="button" class="lc-btn vo-dev-open ${i.open?"on":""}" aria-expanded=${i.open?"true":"false"}
        title="Pick the watches these phrases and defaults are on" @click=${()=>i.onDevices()}>${y("watch")}<span>Devices</span></button>`}
      <button type="button" class="lc-btn pri vo-add-phrase" aria-label="Add phrase" ?disabled=${n.busy||o}
        title=${o?`The watch takes ${Ee} phrases at most.`:"Add a phrase at the end"}
        @click=${()=>ss(n)}>${y("plus")}<span>Add</span></button>
    </div>
    ${i?.open===!0?i.menu:f}
    ${e.length===0?d`<div class="lc-note">No phrases yet. A phrase is a message Pick from List and Speak Phrase can say on your speakers.</div>`:d`<div class="layers vo-phrase-list" role="list">${e.map((r,a)=>cs(n,r,a,e.length,s))}</div>`}
  </section>`}function Oi(n){let{width:i,height:e}=n.screen,t=n.scale,s=R(n.document),o=J(n),r="phrase"in o?F(o.phrase).toUpperCase():void 0,a=s.map(c=>{let h=F(c),u=Ye(c.color),k=r!==void 0&&h.toUpperCase()===r,m=ue(c),S=typeof c.icon=="string"&&c.icon!==""?c.icon:"speaker.wave.2",x=c.displayMode==="text";return d`<button type="button" class="vo-say ${x?"vo-words":"vo-glyph"} ${k?"on":""}" style=${`--fill:${u.fill};--ink:${u.ink}`}
      title=${m} aria-label=${m} aria-pressed=${k?"true":"false"} @click=${()=>Ze(n,h)}>
      ${x?d`<span class="vo-say-text">${m}</span>`:d`<span class="vo-say-well">${_i(n,S,Math.round(16*t),"#fff")}</span>
        <span class="vo-say-label">${m}</span>`}
    </button>`}),l=d`<div class="vo-screen" role="group" aria-label="Pick from List on the watch"
    style=${`width:${Math.round(i*t)}px;height:${Math.round(e*t)}px;--vo-s:${t}`}>
    <div class="vo-screen-title">Phrases</div>
    ${s.length===0?d`<p class="vo-screen-note">No phrases yet.</p>`:d`<div class="vo-say-list">${a}</div>`}
  </div>`;return tn({width:i,height:e},t,l,"Pick from List on the watch")}function Ei(n){let i=R(n.document).length;return[`${i} ${i===1?"phrase":"phrases"}`]}function ds(n){let i=J(n);return("phrase"in i?["phrase","look","speech"]:[i.section]).map(t=>({module:oe,section:t}))}function Ri(n){let i=J(n),e=ds(n),t=an(n.uiState,e),s,o;if("phrase"in i){let r=ue(i.phrase);s=d`<div class="crumbs"><button class="root" title="The voice defaults" @click=${()=>Xe(n,"defaults")}>Voice</button><span class="sep">›</span><span class="kchip" style=${`--k:${Ye(i.phrase.color).ink}`}>Phrase</span><span class="nm" title=${r}>${r}</span></div>`,o=vs(n,i.phrase)}else{let r=xi.find(([a])=>a===i.section)?.[1]??"";s=d`<div class="crumbs"><span class="kchip" style=${`--k:${ts}`}>Voice</span><span class="nm" title=${r}>${r}</span></div>`,o=d`<p class="vo-note">${$i[i.section]}</p>
      ${i.section==="defaults"?ls(n):us(n)}
      <p class="vo-note vo-pick-note">Pick a phrase to edit it, or add one.</p>`}return d`<div class="insp-head">
      ${s}
      <button class="expand" @click=${()=>{cn(n.uiState,e,!t),n.requestUpdate()}}>${t?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${o}</div>`}function Ai(n,i,e,t){let s=on(n.hass.states),o=le(s,e),r=h=>h.missing?`${h.entityId} (not found)`:h.name,a=h=>ke(r(h),e.includes(h.entityId),u=>t(h.entityId,u)),l=s.filter(h=>h.announces),c=o.filter(h=>!l.some(u=>u.entityId===h.entityId));return d`<div class="vo-sub-h"><span>${i}</span></div>
    <div class="vo-list" role="group" aria-label=${i}>
      ${o.length===0?d`<div class="hint">No media players in Home Assistant.</div>`:f}
      ${l.length>0?d`<div class="vo-group">Speakers</div>${l.map(a)}`:f}
      ${c.length>0?d`${l.length>0?d`<div class="vo-group">Other media players</div>`:f}${c.map(a)}`:f}
    </div>`}function ls(n){let i=N(n.document),e=ps(n,i.engine),t=i.engine===void 0?"No engine":e.find(([r])=>r===i.engine)?.[1]??q(n.hass,i.engine),s=[i.agent===void 0?"Default agent":q(n.hass,i.agent),t].join(" \xB7 "),o=d`<fieldset class="vo-body" ?disabled=${n.busy} aria-label="Defaults">
    <div class="vo-stack">${Ct({hass:n.hass},"Conversation agent",ns(n.hass,i.agent??""),r=>n.edit(a=>_n(a,r.entityId)),"vo:agent",{domain:"conversation",clearable:!0})}</div>
    <div class="hint">${i.agent===void 0?"None picked: Home Assistant's own default agent answers.":"Assist uses this agent unless a tile or a slot picks its own."}</div>
    <div class="vo-stack">${ce("Text to speech engine",i.engine??"",e,r=>n.edit(a=>In(a,r)),{snapBack:!0})}</div>
    <div class="hint ${i.engine===void 0?"warn":""}">${i.engine===void 0?"Not set. Speaking on speakers needs an engine.":"Speakers say messages and replies with this engine unless a tile, a slot or a phrase picks its own."}</div>
    ${Ai(n,"Speakers",i.speakers,(r,a)=>n.edit(l=>Pn(l,r,a)))}
    <div class="hint">${i.speakers.length===0?"None picked. A slot or a phrase set to speakers with none of its own then plays nowhere.":"Assist, Speak and phrases play here unless they pick their own."}</div>
  </fieldset>`;return se(n,"defaults","Defaults",o,{summary:s,dot:i.agent!==void 0||i.engine!==void 0||i.speakers.length>0})}function hs(n,i){let e=[{value:"",label:"System voice"}];i!==void 0&&!n.some(t=>t.id===i)&&e.push({value:i,label:`${i} (not on this watch)`});for(let t of Rn(n))for(let s of t.voices)e.push({value:s.id,label:Me(s),group:t.language});return e}function us(n){let i=Dn(n.document),e=We(n.document),t=hs(n.voices,e),s=[];for(let c of t){let h=s[s.length-1];h!==void 0&&h.group!==void 0&&h.group===c.group?h.options.push(c):s.push({group:c.group,options:[c]})}let o=c=>d`<option value=${c.value} .selected=${G(c.value===(e??""))}>${c.label}</option>`,r=n.voicesState==="unsupported"?"Update the integration to list this watch's voices.":n.voicesState==="error"?"Could not read this watch's voices.":n.voicesState==="ready"&&n.voices.length===0?Kn:void 0,a=d`<fieldset class="vo-body" ?disabled=${n.busy} aria-label="On the watch">
    ${ke("Speak even in Silent Mode",i,c=>n.edit(h=>Cn(h,c)),!0)}
    <div class="hint">The watch speaks a reply on its own speaker even while it is in Silent Mode.</div>
    <label class="field"><span>Watch voice</span>
      <select .value=${G(e??"")} @change=${c=>{let h=c.target.value;n.edit(u=>On(u,h===""?void 0:h))||n.requestUpdate()}}>
        ${s.map(c=>c.group===void 0?c.options.map(o):d`<optgroup label=${c.group}>${c.options.map(o)}</optgroup>`)}
      </select></label>
    ${r===void 0?d`<div class="hint">The voice the watch speaks a reply in. System voice follows the watch's language.</div>`:d`<div class="hint ${n.voicesState==="ready"?"":"warn"}">${r}</div>`}
  </fieldset>`,l=e===void 0?"System voice":n.voices.find(c=>c.id===e)?.name??e;return se(n,"watch","On the watch",a,{summary:l,dot:!i||e!==void 0})}function ps(n,i){let e=Object.keys(n.hass.services?.tts??{}),t=le(Te(n.hass.states,e,n.cloudTTS),i===void 0?[]:[i]);return[["","Not set"],...t.map(s=>[s.entityId,s.missing?`${s.entityId} (not found)`:s.name])]}function fs(n,i){let e=N(n.document),t=Object.keys(n.hass.services?.tts??{}),s=le(Te(n.hass.states,t,n.cloudTTS),i===void 0?[]:[i]);return[["",e.engine===void 0?"Default (Not set)":`Default (${s.find(r=>r.entityId===e.engine&&!r.missing)?.name??q(n.hass,e.engine)})`],...s.map(r=>[r.entityId,r.missing?`${r.entityId} (not found)`:r.name])]}function vs(n,i){let e=F(i),t=(p,M,O=!1)=>n.edit(re=>Un(re,e,p,M),O?`phrase:${e}:${p}`:void 0),s=pe(i),o=p=>typeof i[p]=="string"?i[p]:"",r=d`<fieldset class="vo-body" ?disabled=${n.busy} aria-label="Phrase">
    ${ae("Message",o("message"),p=>t("message",p,!0),{placeholder:"What the speakers say"})}
    ${ae("Label",o("label"),p=>t("label",p,!0),{placeholder:"Its name on the watch"})}
    ${s.length>0?d`<div class="hint warn">The phrase needs a ${s.join(" and a ")} before it can be saved.</div>`:f}
    ${It("Display mode",String(i.displayMode??"icon"),Re("TTSPhraseDisplayMode"),p=>t("displayMode",p),{def:he.newPhrase.displayMode})}
    <div class="hint">How Pick from List shows it: its icon, or its label.</div>
  </fieldset>`,a=i.color,l=Mn(a),c=d`<fieldset class="vo-body" ?disabled=${n.busy} aria-label="Look">
    <div class="vo-stack">${Ot({icons:n.icons,symbols:n.symbols},typeof i.icon=="string"?i.icon:"",p=>t("icon",p,!0),`vo:icon:${e}`,{tint:a})}</div>
    <div class="vo-no-alpha">${Dt("Color",Wn(a)?a:void 0,p=>{p!==void 0&&t("color",p,!0)},!1,he.newPhrase.color)}</div>
    ${l===void 0?f:d`<div class="hint">${l}, which the panel does not offer. Picking a color here replaces it.</div>`}
  </fieldset>`,h=Array.isArray(i.targetSpeakers)?i.targetSpeakers.filter(p=>typeof p=="string"):[],u=N(n.document),k=typeof i.ttsEngine=="string"&&i.ttsEngine.trim()!==""?i.ttsEngine.trim():void 0,m=Nn(i),S=Fn(i),x=he.volume,H=d`<fieldset class="vo-body" ?disabled=${n.busy} aria-label="Speech">
    ${Ai(n,"Speakers",h,(p,M)=>n.edit(O=>qn(O,e,p,M)))}
    <div class="hint">${h.length>0?"This phrase plays only on these.":u.speakers.length>0?`None picked: the default speakers play (${u.speakers.map(p=>q(n.hass,p)).join(", ")}).`:"None picked, and no default speakers: set some in Defaults."}</div>
    ${ce("Voice engine",k??"",fs(n,k),p=>t("ttsEngine",p===""?void 0:p),{snapBack:!0})}
    ${ae("Language",typeof i.language=="string"?i.language:"",p=>t("language",p,!0),{placeholder:"The engine's own"})}
    <div class="hint">A language code such as en or de, for an engine that speaks more than one.</div>
    ${ce("Speech volume",m,Re("TTSPhraseSpeechVolumeMode"),p=>t("speechVolumeMode",p),{snapBack:!0,def:"keepCurrent"})}
    ${m==="keepCurrent"?f:d`${Pt("Target volume",S,p=>t("speechVolumePercent",p,!0),{min:x.min,max:x.max,step:x.step,def:x.default,format:p=>`${Math.round(p)}${x.unit}`})}
      <div class="vo-chips">${x.presets.map(p=>d`<button type="button" class="pe-chip ${S===p.value?"on":""}"
        aria-pressed=${S===p.value?"true":"false"} @click=${()=>t("speechVolumePercent",p.value)}>${p.label} ${p.value}%</button>`)}</div>`}
  </fieldset>`,P=R(n.document).findIndex(p=>F(p).toUpperCase()===e.toUpperCase()),me=R(n.document).length;return d`${se(n,"phrase","Phrase",r,{summary:o("message"),dot:s.length>0})}
    ${se(n,"look","Look",c,{summary:typeof i.icon=="string"?i.icon:"",dot:!1})}
    ${se(n,"speech","Speech",H,{summary:k===void 0?"Defaults":q(n.hass,k),dot:zn(i)})}
    <div class="vo-acts">
      <button type="button" class="pe-btn" ?disabled=${n.busy||P<=0} @click=${()=>n.edit(p=>te(p,e,P-1))}>${y("up")}<span>Move up</span></button>
      <button type="button" class="pe-btn" ?disabled=${n.busy||P>=me-1} @click=${()=>n.edit(p=>te(p,e,P+1))}>${y("down")}<span>Move down</span></button>
      <button type="button" class="pe-btn pe-danger" ?disabled=${n.busy} title="Remove this phrase from the library"
        @click=${()=>n.edit(p=>Ne(p,e))}>${y("delete")}<span>Remove</span></button>
    </div>
    <p class="vo-note">A menu slot that speaks this phrase keeps pointing at it after an edit. Removing it leaves such a slot with nothing to say.</p>`}var Hi=z`
  .vo-voice-card > .layers, .vo-phrases-card > .layers { padding: 6px 8px 8px; overflow: visible; }
  .vo-voice-card > .lc-note, .vo-phrases-card > .lc-note { margin: 8px 12px; color: var(--wa-muted); font-size: 12px; line-height: 1.4; }
  .lc-head .swatch svg.ui-icon { width: 14px; height: 14px; }
  .layer .acts button.icon { display: inline-grid; place-items: center; padding: 0; }
  .layer .acts button.icon:disabled { opacity: .35; cursor: default; }
  .layer .thumb.vo-thumb {
    display: grid; place-items: center; color: var(--wa-muted);
    background: color-mix(in srgb, var(--c, #888) 22%, #000);
  }
  .layer .thumb.vo-thumb svg.ui-icon { width: 14px; height: 14px; color: #fff; }
  .layer .thumb .vo-thumb-glyph { display: grid; place-items: center; width: 16px; height: 16px; }
  .layer .thumb .vo-thumb-glyph svg { width: 14px; height: 14px; display: block; }
  .layer .name small.vo-needs { color: var(--wa-amber); }
  .vo-glyph-dot { width: 10px; height: 10px; border-radius: 50%; }
  /* The phrases' other watches: a badge in the card's head, as a linked
     page's row has, and the Devices menu under the head, in the flow. */
  .lc-head .badge.vo-linked {
    min-width: 0; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; line-height: 20px;
    color: var(--wa-accent); background: color-mix(in srgb, var(--wa-accent) 12%, transparent);
  }
  button.lc-btn.vo-dev-open.on { border-color: var(--wa-accent); background: var(--wa-sel-bg); color: var(--wa-accent); }
  .vo-phrases-card > .pe-dev-menu { margin: 4px 8px 8px; box-shadow: none; }

  /* The watch screen on the stage: Pick from List's phrases. */
  .vo-screen {
    position: relative; flex: none; background: #000; overflow: hidden;
    display: flex; flex-direction: column; gap: calc(6px * var(--vo-s, 1));
    padding: calc(28px * var(--vo-s, 1)) calc(8px * var(--vo-s, 1)) calc(8px * var(--vo-s, 1));
  }
  .vo-screen-title { color: #fff; font-size: calc(13px * var(--vo-s, 1)); font-weight: 700; padding: 0 calc(4px * var(--vo-s, 1)); }
  .vo-screen-note { margin: auto 0; color: rgba(255, 255, 255, .6); font-size: 12px; text-align: center; }
  .vo-say-list { display: grid; grid-template-columns: 1fr 1fr; gap: calc(6px * var(--vo-s, 1)); overflow: hidden; }
  .vo-say {
    margin: 0; padding: calc(6px * var(--vo-s, 1)); border: 0; border-radius: calc(12px * var(--vo-s, 1));
    background: color-mix(in srgb, var(--ink, #888) 20%, #111); color: #fff; cursor: pointer;
    display: flex; flex-direction: column; align-items: center; gap: calc(4px * var(--vo-s, 1)); min-width: 0;
  }
  .vo-say.vo-words { grid-column: span 2; justify-content: center; background: var(--fill, #444); min-height: calc(30px * var(--vo-s, 1)); }
  .vo-say-well { display: grid; place-items: center; width: calc(30px * var(--vo-s, 1)); height: calc(30px * var(--vo-s, 1)); border-radius: 50%; background: var(--fill, #444); }
  .vo-say-well svg { display: block; }
  .vo-say-label, .vo-say-text {
    max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    font-size: calc(10.5px * var(--vo-s, 1)); font-weight: 600; line-height: 1.3;
  }
  .vo-say-text { text-shadow: 0 1px 2px rgba(0, 0, 0, .45); }
  .vo-screen { --vo-mark: color-mix(in srgb, var(--wa-accent) 55%, #fff); }
  .vo-say.on { box-shadow: 0 0 0 2px #000, 0 0 0 4px var(--vo-mark); }
  .vo-say:focus-visible { outline: none; box-shadow: 0 0 0 2px #000, 0 0 0 4px var(--vo-mark), var(--wa-ring); }

  /* The inspector's cards. */
  fieldset.vo-body { margin: 0; padding: 2px 0 0; border: 0; min-width: 0; display: flex; flex-direction: column; gap: 2px; --wa-lab: 112px; }
  .vo-body .hint { margin: 0 0 6px; }
  .vo-body .hint.warn { color: var(--wa-amber); }
  .vo-note { margin: 6px 2px 2px; font-size: 12px; line-height: 1.4; color: var(--wa-muted); }
  .vo-note.vo-pick-note { margin-top: 10px; }
  .vo-sub-h { margin: 8px 0 2px; font-size: 12px; font-weight: 600; color: var(--wa-muted); }
  .vo-list { display: flex; flex-direction: column; gap: 0; margin-bottom: 4px; }
  .vo-group { margin: 6px 0 2px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; color: var(--wa-muted); }
  .vo-chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 2px 0 6px calc(var(--wa-lab) + 8px); }
  .vo-acts { display: flex; flex-wrap: wrap; gap: 6px; padding: 12px 0 0; }
  .vo-acts .pe-btn svg.ui-icon { width: 14px; height: 14px; }
  .pe-chip {
    padding: 3px 10px; border: 1px solid var(--wa-line); border-radius: 999px; background: var(--wa-card); color: var(--wa-ink);
    font: inherit; font-size: 12px; cursor: pointer;
  }
  .pe-chip.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); font-weight: 600; }
  .pe-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .vo-no-alpha .color-box .alpha { display: none; }
  .vo-no-alpha .color-box { padding-right: 6px; }
  .vo-stack .field { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 2px 0; }
  .vo-stack .field.entity-field > :not(:first-child) { grid-column: 1; }
`;Gn({dirty:ze,drop:si});typeof window<"u"&&window.addEventListener("beforeunload",n=>{ze()&&(n.preventDefault(),n.returnValue="")});var gs=15e3,Ni=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),Qe=Ni?"\u2318":"Ctrl+",et={min:200,max:720,middleMin:320},tt={left:280,right:340},nt="wrist-assistant-panel.voice.columns.v1",ms=24,Li=820,ws="Saving. The phrases can go on another watch once the save is done.",bs="Save or discard your edits first. The phrases go on another watch as they are saved here.";function Wi(n){return D(n).message}function Y(n){return D(n).code}function Mi(n){let{code:i,message:e}=D(n);return Object.assign(new Error(e),i===void 0?{}:{code:i})}function ys(n){return n<1e3?`${n} bytes`:`${Number((n/1e3).toFixed(1))} KB`}function ks(n){let i=n?Date.parse(n):NaN;return Number.isNaN(i)?"":ft(Math.max(0,(Date.now()-i)/1e3))}function xs(n){return n==="panel"?"Saved here":"From the watch"}function $s(n){return n instanceof HTMLElement?Xt(n.tagName,n instanceof HTMLInputElement?n.type:void 0,n.isContentEditable):!1}function Ss(){let n=document.activeElement;for(;n?.shadowRoot?.activeElement;)n=n.shadowRoot.activeElement;return n===null||n===document.body||n===document.documentElement}function Vs(n){let i=E(n)??{},e=R(i).length,t=N(i).speakers.length;return`${e} ${e===1?"phrase":"phrases"}. ${t===0?"No default speakers.":`${t} default ${t===1?"speaker":"speakers"}.`}`}var v=class extends st{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=f;this.shellOwnsWatch=!1;this.barHost=void 0;this.headBar=new zt(this);this.unsupported=!1;this.voices=[];this.voicesState="loading";this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.otherVoice=new Map;this.devicesOpen=!1;this.linking=!1;this.linksSeq=0;this.columns={...tt};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new un(this);this.symbols=new $t(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.voicesSeq=0;this.historySeq=0;this.subscribeSeq=0;this.cloudSeq=0;this.onReconnect=()=>{let e=this.watchId;!this.isConnected||e===void 0||(this.load(e,!0),this.loadVoices(e),this.loadCloud())};this.onScrubStart=e=>{e.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=e=>{e.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=e=>{if(e.defaultPrevented)return;let t=e.composedPath();if(!t.includes(this)&&!this.headBar.holds(t)&&!Ss()||this.renderRoot.querySelector("dialog[open]"))return;let s=e.metaKey||e.ctrlKey,o=e.key.toLowerCase();if(s&&!e.altKey&&o==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1;return}if(e.key==="Escape"&&this.watchMenuOpen){e.preventDefault(),this.watchMenuOpen=!1;return}if(e.key==="Escape"&&this.devicesOpen){e.preventDefault(),this.closeDevices();return}if(!$s(t[0])){if(s&&!e.altKey&&o==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}if(e.ctrlKey&&!e.metaKey&&!e.altKey&&o==="y"){e.preventDefault(),this.redo();return}if(e.key==="Escape"&&!s&&!e.altKey){let r=this.viewHost();r!==void 0&&Pi(r)&&e.preventDefault()}}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen&&!this.watchMenuOpen&&!this.devicesOpen)return;let t=e.composedPath(),s=o=>t.some(r=>r instanceof HTMLElement&&r.classList.contains(o));this.topMenuOpen&&!s("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!s("ve-watch-picker")&&(this.watchMenuOpen=!1),this.devicesOpen&&!s("pe-dev-menu")&&!s("vo-dev-open")&&!s("pe-top-menu")&&!s("pe-ask")&&this.closeDevices()};this.addEventListener(Tt,this.onScrubStart),this.addEventListener(_t,this.onScrubEnd),this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get watches(){return Rt(this.owners.length>0?this.owners:this.ownList??[])}get draft(){let e=this.watchId,t=this.record;if(!(e===void 0||t===void 0)){if(t.revision>0){let s=U(e);if(s!==void 0)return s;let o=E(t.document);return o===void 0?void 0:Ue(e,o,t.revision).draft}if(!(this.unsupported||!this.opensReady()))return U(e)??qe(e)}}get newWatch(){let e=this.record;return e!==void 0&&e.revision<=0&&!this.unsupported}get saving(){return this.draft?.saving??!1}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Jt(nt,tt,et),this.watchSize(),this.listenForReconnect(),this.loadCloud(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.voicesSeq++,this.historySeq++,this.cloudSeq++,this.linksSeq++}willUpdate(e){if(this.hass){e.has("hass")&&(this.listenForReconnect(),this.cloudTTS===void 0&&e.get("hass")===void 0&&this.loadCloud()),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,ot(this.hass).then(o=>{this.ownList=o.owners},()=>{this.ownList=[]}));let s=Lt(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||e.has("ownerId"));s!==void 0&&this.openWatch(s)}this.followSave();let t=this.restoreAsk;t!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(s=>s.revision===t.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),gn(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let t of e){if(t.target!==this){this.measureTop(t.target);continue}let s=t.contentRect;Math.abs(s.width-this.hostWidth)>=1&&(this.hostWidth=s.width),Math.abs(s.height-this.hostHeight)>=1&&(this.hostHeight=s.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let t=this.renderRoot?.querySelector(".pe-top")??void 0;t!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=t,t!==void 0&&e.observe(t))}measureTop(e){let t=e.offsetHeight;t!==this.topHeight&&(this.topHeight=t,this.style.setProperty("--pe-top-h",`${t}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let e=this.watchId;if(e===void 0)return;let t=U(e)?.saveDone;if(t===void 0||t===this.followedSave)return;this.followedSave=t;let s=()=>this.saveEnded(e);t.then(s,s)}saveEnded(e){this.requestUpdate(),this.isConnected&&(e===this.watchId?(this.reloadPending=!1,this.load(e,!0)):this.flushPending())}openWatch(e,t=!1){e!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=e,this.note=void 0,this.unsupported=!1,this.voices=[],this.voicesState="loading",this.voicesSeq++,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),this.devicesOpen=!1,this.devicesNote=void 0,this.replaceAsk=void 0,this.freshAsk=void 0,this.otherVoice=new Map,this.linksFor=void 0,t=!1),this.startSubscription(e),this.load(e,t),this.loadVoices(e),this.loadLinks(e)}loadCloud(){let e=this.hass;if(!e)return;let t=++this.cloudSeq;pt(e).then(s=>{t===this.cloudSeq&&(this.cloudTTS=sn(s))},()=>{t===this.cloudSeq&&(this.cloudTTS=!1)})}async loadVoices(e){let t=this.hass;if(!t)return;let s=++this.voicesSeq;try{let o=await ut(t,e);if(s!==this.voicesSeq||e!==this.watchId)return;this.voices=En(o),this.voicesState="ready"}catch(o){if(s!==this.voicesSeq||e!==this.watchId)return;this.voicesState=Y(o)==="unknown_command"?"unsupported":"error"}}async load(e,t=!1){let s=this.hass;if(!s)return;if(t&&this.holdReload){this.reloadPending=!0;return}let o=++this.loadSeq;this.stopPolling(),t||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let r=await j(s,e,"voice");if(o!==this.loadSeq)return;if(t&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(r),this.loadError=void 0}catch(r){if(o!==this.loadSeq)return;Jn(r)?(this.unsupported=!0,this.loadError=void 0):t||(this.loadError=Wi(r)),this.restartDraft?.watchId===e&&(this.restartDraft=void 0)}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(e))}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(e){let t=this.watchId;this.record=e,t!==void 0&&e.revision<=0&&qe(t);let s=e.revision>0?E(e.document):void 0;if(t===void 0||s===void 0)return;let o=this.restartDraft;o!==void 0&&o.watchId===t&&e.revision>=o.revision&&(this.restartDraft=void 0,(U(t)?.dirty??!1)||ve(t));let r=Ue(t,s,e.revision);r.replaced.length>0?this.note={kind:"warn",text:Je(r.replaced)}:r.mergedIntoEdits&&(this.note={kind:"warn",text:"The voice settings changed somewhere else. Your edits are kept."}),W(s)!==this.linksFor&&this.loadLinks(t),this.requestUpdate()}async loadHistory(e){let t=this.hass;if(!t||this.historyState==="unsupported")return;let s=++this.historySeq;try{let o=await ct(t,e,"voice");if(s!==this.historySeq||e!==this.watchId)return;this.history=Array.isArray(o?.entries)?o.entries:[],this.historyState="ready"}catch(o){if(s!==this.historySeq||e!==this.watchId)return;this.historyState=Y(o)==="unknown_command"?"unsupported":"error"}}startSubscription(e){let t=this.hass;if(this.endSubscription(),!t)return;let s=++this.subscribeSeq;ht(t,e,o=>{s===this.subscribeSeq&&o.kind==="voice"&&o.revision!==(this.record?.revision??0)&&this.load(e,!0)}).then(o=>{s===this.subscribeSeq?this.unsubscribe=o:o().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let e=this.unsubscribe;this.unsubscribe=void 0,e?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||Et(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},gs))}async poll(){this.pollTimer=void 0;let e=this.hass,t=this.watchId,s=this.record;if(!(!e||t===void 0||s===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let o=await j(e,t,"voice");if(t!==this.watchId||this.record!==s)return;o.revision===s.revision?this.record={...s,delivered_revision:o.delivered_revision,delivered_at:o.delivered_at,rejected_revision:o.rejected_revision,rejected_at:o.rejected_at,rejected_reason:o.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(o),this.loadHistory(t))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,t){let s=this.draft;if(!s||this.saving)return!1;let o=s.apply(e(s.document),this.scrubKey??t);return this.requestUpdate(),o}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let e=this.icons??Gt,t=this.iconMemo;if(t!==void 0&&t.provider===e&&t.tick===this.iconsTick)return t.icons;let s=Zt(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:s},s}screen(){let e=this.watches.find(t=>t.owner_watch_id===this.watchId);return(ye(e?.screen_size)??be).screen}viewHost(){let e=this.draft,t=this.hass;if(e===void 0||t===void 0)return;let s=this;return{hass:t,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.stageScale,voices:this.voices,voicesState:this.voicesState,cloudTTS:this.cloudTTS,get document(){return e.document},get busy(){return s.saving},edit:(o,r)=>this.draft===e&&this.edit(o,r),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,t=this.watchId;this.endScrub();let s=this.draft;if(!e||t===void 0||!s||this.saving||!s.dirty)return;this.note=void 0;let o=s.revision<=0,r=[],a=ii(s,{save:(c,h)=>we(e,t,"voice",c,h).then(u=>(r=$e(u),u),u=>{throw Mi(u)}),fetch:async()=>{let c=await j(e,t,"voice").catch(h=>{throw Mi(h)});return{revision:c.revision,document:c.document}}});this.followedSave=s.saveDone,this.requestUpdate();let l=await a.catch(c=>({ok:!1,revision:s.revision,merged:!1,code:Y(c)??"unknown",message:Wi(c)}));if(this.saveEnded(t),t===this.watchId){let c=$n(o,l.code,ki(l));this.note=l.ok?Se(c,r,"phrases"):c,l.ok&&this.loadLinks(t)}}startFresh(){let e=this.watchId;e===void 0||!Ht(this.noRecordState())||(yn("voice",e),this.note=void 0,this.requestUpdate())}get linkDevices(){return Mt(this.owners.length>0?this.owners:this.ownList??[],!1)}deviceName(e){return this.linkDevices.find(t=>t.ownerId===e)?.name??"the other watch"}phraseHolders(){let e=this.watchId;return e===void 0?[]:je(this.draft?.document,e,this.voicePlaces)}get linksOn(){return this.voicePlaces!==void 0&&(this.record?.revision??0)>0&&this.linkDevices.length>1}async loadLinks(e){let t=this.hass;if(!t)return;let s=++this.linksSeq,o=this.record!==void 0&&this.record.revision>0?E(this.record.document):void 0;this.linksFor=W(o);let r;try{r=await at(t)}catch(c){s===this.linksSeq&&Y(c)==="unknown_command"&&(this.voicePlaces=void 0);return}if(s!==this.linksSeq||e!==this.watchId||(this.voicePlaces=ri(r),this.voicePlaces===void 0))return;let a=this.linkDevices.filter(c=>c.ownerId!==e),l=await Promise.all(a.map(async c=>{try{let h=await j(t,c.ownerId,"voice"),u=h.revision>0?E(h.document):void 0;return[c.ownerId,{facts:Ft(h),...u===void 0?{}:{document:u}}]}catch{return}}));s!==this.linksSeq||e!==this.watchId||(this.otherVoice=new Map(l.filter(c=>c!==void 0)))}waitingWatches(){let e=new Map([...this.otherVoice].map(([t,s])=>[t,s.facts]));return Ut(this.owners.length>0?this.owners:this.ownList??[],e)}openDevices(){this.topMenuOpen=!1,this.devicesNote=void 0,this.devicesOpen=!0,this.watchId!==void 0&&this.loadLinks(this.watchId),this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".vo-phrases-card .pe-dev-menu")?.scrollIntoView({block:"nearest"})})}closeDevices(){this.devicesOpen=!1,this.devicesNote=void 0}devicesBlocked(){if(this.saving)return ws;if(this.draft?.dirty??!1)return bs}async linkTo(e,t=!1){let s=this.hass,o=this.watchId;if(!s||o===void 0||e===o||this.linking||this.devicesBlocked()!==void 0)return;let r=this.deviceName(e);if(!t&&pi(this.otherVoice.get(e)?.document,W(this.draft?.document))){this.replaceAsk={watchId:o,target:e,name:r};return}this.linking=!0,this.devicesNote=void 0;try{if(await rt(s,"voice",o,[ie],[e],t),o!==this.watchId)return;this.devicesNote={kind:"ok",text:[`Now on ${r} too.`,t?Be:void 0].filter(a=>a!==void 0).join(" ")},this.load(o,!0),this.loadLinks(o)}catch(a){if(o!==this.watchId)return;!t&&Y(a)==="unit_taken"?this.replaceAsk={watchId:o,target:e,name:r}:this.devicesNote={kind:"err",text:`Not added. ${gi(a)}`}}finally{this.linking=!1}}async unlinkFrom(e){let t=this.hass,s=this.watchId;if(!t||s===void 0||e===s||this.linking||this.devicesBlocked()!==void 0)return;this.linking=!0,this.devicesNote=void 0;let o=await yi({read:a=>j(t,a,"voice"),save:(a,l,c)=>we(t,a,"voice",l,c)},e);if(this.linking=!1,s!==this.watchId)return;let r=this.deviceName(e);this.devicesNote=o.ok?{kind:"ok",text:`Unlinked ${r}. It keeps its copy of the phrases.`}:{kind:"err",text:`Not unlinked from ${r}: ${o.message}`},this.load(s,!0),this.loadLinks(s)}closeReplaceAsk(){this.renderRoot?.querySelector("dialog.ve-replace-ask")?.close(),this.replaceAsk=void 0}confirmReplace(){let e=this.replaceAsk;this.closeReplaceAsk(),e!==void 0&&e.watchId===this.watchId&&this.linkTo(e.target,!0)}startFreshPhrases(){let e=this.watchId,t=this.draft;if(e===void 0||t===void 0||this.saving)return;let s=bi(this.phraseHolders());if(s===void 0){this.applyFresh(!1);return}this.freshAsk={watchId:e,question:s.question,here:s.here,all:s.all}}applyFresh(e){this.edit(t=>Ke(t,e))&&(this.note={kind:"ok",text:e?"Started fresh on this watch. Save to unlink it from the others. Undo brings the phrases back.":"Started fresh. Save to clear the phrases everywhere they are. Undo brings them back."})}closeFreshAsk(){this.renderRoot?.querySelector("dialog.ve-fresh-ask")?.close(),this.freshAsk=void 0}answerFresh(e){let t=this.freshAsk;this.closeFreshAsk(),t!==void 0&&t.watchId===this.watchId&&this.applyFresh(e)}phrasesLinks(){let e=this.watchId;if(e===void 0||!this.linksOn)return;let t=this.phraseHolders(),s=this.linkDevices,o=hi(t,e,s),r=ui(t,e,s),a=this.devicesBlocked();return{...o===void 0?{}:{badge:o},...r===void 0?{}:{badgeTitle:r},open:this.devicesOpen,onDevices:()=>this.devicesOpen?this.closeDevices():this.openDevices(),menu:this.devicesOpen?Zn({name:oi,head:ai,foot:ci,places:li(s,this.draft?.document,e,this.voicePlaces,this.waitingWatches()),...a===void 0?{}:{blocked:a},busy:this.linking,...this.devicesNote===void 0?{}:{note:this.devicesNote},className:"at-card",colorOf:l=>this.colorOf(l),titleOf:di,onToggle:l=>{l.on?this.unlinkFrom(l.device.ownerId):this.linkTo(l.device.ownerId)},onDone:()=>this.closeDevices()}):f}}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(e){let t=this.hass,s=this.watchId,o=this.record;if(!t||s===void 0||o===void 0||this.draft?.dirty)return;let r={entry:e,baseRevision:o.revision};this.restoreAsk=r,dt(t,s,"voice",e.revision).then(a=>{this.restoreAsk===r&&(this.restoreAsk={...r,summary:Vs(a.document),links:this.restoreLinks(o.document,a.document)})},()=>{})}restoreLinks(e,t){let s=this.watchId;if(s===void 0)return[];let o=W(E(e)),r=W(E(t));return vi([{name:"phrases and defaults",holders:a=>(this.voicePlaces?.[a]?.owners??[]).filter(l=>l!==s).map(l=>this.deviceName(l)),...o===void 0?{}:{now:o},...r===void 0?{}:{restored:r}}],"watch")}async restore(){let e=this.hass,t=this.watchId,s=this.restoreAsk;if(!e||t===void 0||s===void 0||this.restoring)return;this.restoring=!0;let o;try{let r=await lt(e,t,"voice",s.entry.revision,s.baseRevision);o=Se({kind:"ok",text:bn(s.entry.updated_at)},$e(r),"phrases"),t===this.watchId?this.restartDraft={watchId:t,revision:r.revision}:(U(t)?.dirty??!1)||ve(t)}catch(r){let a=Y(r);a==="conflict"?o={kind:"warn",text:"Not restored. The voice settings changed somewhere else, so the newest copy is shown."}:a==="no_record"?o={kind:"warn",text:"Not restored. Home Assistant no longer holds voice settings for this watch."}:a==="not_found"?o={kind:"warn",text:"Not restored. That save is no longer kept."}:a==="unknown_command"?(this.historyState="unsupported",o={kind:"warn",text:"This version of the integration cannot restore voice settings. Update it to restore an earlier save."}):o={kind:"err",text:`Could not restore: ${St(r)}`}}finally{this.restoring=!1,this.restoreAsk===s&&this.closeAsk()}t===this.watchId&&(this.note=o,this.load(t,!0))}render(){let e=this.watches,t=this.draft;return d`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(t,e):f}
        ${this.note?d`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:f}
      </div>
      ${this.renderBody(e)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):this.replaceAsk?this.renderReplaceAsk(this.replaceAsk):this.freshAsk?this.renderFreshAsk(this.freshAsk):f}
    `}renderReplaceAsk(e){return d`<dialog class="pe-ask ve-replace-ask" aria-labelledby="ve-replace-title"
      @close=${()=>{this.replaceAsk=void 0}}>
      <h3 id="ve-replace-title">${fi(e.name)}</h3>
      <p class="pe-muted">Its phrases and defaults become these, linked: an edit on one watch then shows on both. ${Be}</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" @click=${()=>this.closeReplaceAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" @click=${()=>this.confirmReplace()}>Replace</button>
      </div>
    </dialog>`}renderFreshAsk(e){return d`<dialog class="pe-ask ve-fresh-ask" aria-labelledby="ve-fresh-title"
      @close=${()=>{this.freshAsk=void 0}}>
      <h3 id="ve-fresh-title">Start fresh?</h3>
      <p>${e.question} Here only unlinks this watch and leaves the others as they are.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" @click=${()=>this.closeFreshAsk()}>Cancel</button>
        <button class="pe-btn" @click=${()=>this.answerFresh(!0)}>${e.here}</button>
        <button class="pe-btn pe-primary" @click=${()=>this.answerFresh(!1)}>${e.all}</button>
      </div>
    </dialog>`}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=Li}renderTopBar(e,t){let s=e!==void 0&&!this.unsupported,o=s&&e.dirty;return d`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch voice">
      ${this.haMenu?d`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${y("menu")}</button>`:f}
      ${this.shellOwnsWatch?f:d`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():Yn(void 0,!1)}>${y("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${this.shellOwnsWatch?f:this.renderWatchPicker(t)}
      ${this.barHost!==void 0&&s?jt({newWatch:this.newWatch,dirty:o,saved:Oe(this.record)}):f}
      ${this.renderSyncPill(s?e:void 0)}
      ${this.renderTopMenu(s?e:void 0)}
      ${s?d`<button class="primary save ${o?"dirty":""}" ?disabled=${!o||this.saving}
          title=${o?`Save (${Qe}S). A save reaches the watch the next time it checks.`:`Nothing to save (${Qe}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?f:d`<span class="tb-saved" title=${o?"Unsaved changes":""}>${Oe(this.record)}</span>
        ${Vn(xn({newWatch:this.newWatch,dirty:o,saving:this.saving}))}`}`:f}
      ${this.barActions}
    </div>`}renderSyncPill(e){let t=this.record;if(t===void 0||t.revision<=0||this.unsupported)return f;let s=e===void 0?{size:0,limit:1}:Ae(e.document),o=Ce({record:t,size:s.size,limit:s.limit,noun:"voice settings",historyState:this.historyState});return dn(o,e?.dirty??!1)}noRecordState(e=this.watches){return At(e.find(t=>t.owner_watch_id===this.watchId))}opensReady(e=this.watches){return kn(this.noRecordState(e),"voice",this.watchId)}canStartFresh(){return this.watchId!==void 0&&this.newWatch&&!this.opensReady()}renderTopMenu(e){let t=this.canStartFresh();if(e===void 0&&!t)return f;let s=this.topMenuOpen,o=a=>()=>{this.topMenuOpen=!1,a()},r=e!==void 0&&!this.newWatch;return d`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${s?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!s}}>···</button>
      ${s?d`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${e?d`<button class="row" role="menuitem" ?disabled=${!e.dirty||this.saving}
          title=${this.newWatch?"Go back to the defaults. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${o(()=>this.discard())}>Discard edits</button>`:f}
        ${r&&this.linksOn?d`<button class="row ve-dev-item" role="menuitem"
          title="Pick the watches these phrases and defaults are on"
          @click=${o(()=>this.openDevices())}>Devices…</button>`:f}
        ${r?d`<button class="row" role="menuitem" ?disabled=${this.saving||wi(e.document)}
          title="No phrases and the app's defaults again. The watch voice and Silent Mode setting stay. Undo brings the phrases back."
          @click=${o(()=>this.startFreshPhrases())}>Start fresh</button>`:f}
        ${e&&(this.record?.revision??0)>0?ln(o(()=>{this.rawCopied=!1,this.rawOpen=!0})):f}
        ${t?d`<button class="row" role="menuitem"
          @click=${o(()=>this.startFresh())}>${xe}</button>`:f}
      </div>`:f}
    </span>`}colorOf(e){return en(Qt(this.owners.length>0?this.owners:this.ownList??[]),e)}renderWatchPicker(e){if(e.length<2)return f;let t=e.find(r=>r.owner_watch_id===this.watchId),s=this.watchMenuOpen,o=r=>{let a=r===void 0?void 0:this.colorOf(r);return d`<span class="pe-chip-glyph" style=${a?`--pe-person: ${a}`:f} aria-hidden="true">${y("watch")}</span>`};return d`<span class="picker ve-watch-picker">
      <button type="button" class="tb-browse ve-watch-btn" aria-haspopup="menu" aria-expanded=${s?"true":"false"}
        title="Choose the watch whose voice settings are shown" @click=${()=>{this.watchMenuOpen=!s}}>
        ${o(t?.owner_watch_id)}<span class="tb-browse-l">${t?de(t,e):"Choose a watch"}</span>
        <span class="ve-caret" aria-hidden="true">${y("chevron")}</span>
      </button>
      ${s?d`<div class="pop-menu ve-watch-menu" role="menu" aria-label="Watches">
        ${e.map(r=>{let a=r.owner_watch_id===this.watchId;return d`<button type="button" class="row ve-watch-row" role="menuitemradio" aria-checked=${a?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,a||this.openWatch(r.owner_watch_id)}}>
            ${o(r.owner_watch_id)}<span class="ve-watch-name">${de(r,e)}</span>
            <span class="ve-watch-check" aria-hidden="true">${a?y("check"):f}</span>
          </button>`})}
      </div>`:f}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=Li?this.columns:Kt(this.hostWidth-ms,this.columns,et)}renderGutter(e){return d`<div class="gutter ${e}" role="separator" aria-orientation="vertical"
      aria-label=${e==="left"?"Resize the voice and phrases column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${t=>{let s=this.fittedColumns();Yt(t,{side:e,base:e==="left"?s.left:s.right,limits:et,onWidth:o=>{this.columns={...this.columns,[e]:o}},onEnd:()=>Ve(nt,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[e]:tt[e]},Ve(nt,this.columns)}}></div>`}get stageScale(){return this.zoom??Ie(this.narrow||this.stacked)}renderStage(e,t){let s=t.find(u=>u.owner_watch_id===this.watchId),r=ye(s?.screen_size)??be,a=[...Ei(e),r.label],l=this.draft,c=this.stageScale,h=Ie(this.narrow||this.stacked);return d`<div class="card canvas-card lit ve-canvas" aria-label="Pick from List">
      <div class="cv-head">
        <span class="cv-title">Pick from List</span>
        ${s!==void 0?d`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${de(s,t)}</span></span>`:f}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${a.join(" \xB7 ")}><span class="fam">${a.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!l?.canUndo} title=${`Undo (${Qe}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${y("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!l?.canRedo} title=${Ni?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${y("redo")}</button>
        </span>
      </div>
      <div class="stage-area ve-stage-area">
        <div class="stage-tools" role="toolbar" aria-label="Stage tools">
          <span class="tb-zoom" role="group" aria-label="Zoom">
            <button class="tb icon" ?disabled=${c<=De(c)} aria-label="Zoom out" title="Zoom out"
              @click=${()=>{this.zoom=De(c)}}>−</button>
            <button class="tb pct" aria-label=${`Zoom ${Q(c)}. Back to fit`}
              title=${`The watch at ${Q(c)} of its own points. Click to fit it again (${Q(h)}).`}
              @click=${()=>{this.zoom=void 0}}>${Q(c)}</button>
            <button class="tb icon" ?disabled=${c>=Pe(c)} aria-label="Zoom in" title="Zoom in"
              @click=${()=>{this.zoom=Pe(c)}}>+</button>
          </span>
        </div>
        <div class="ve-stage-body">${Oi(e)}</div>
        <div class="under"><span class="tail">${Si}</span></div>
      </div>
    </div>`}renderBody(e){if(e.length===0){let c=this.owners.length===0&&this.ownList===void 0;return d`<div class="pe-empty">${c?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}if(this.unsupported)return d`<div class="pe-empty"><b>${Fe}</b></div>`;if(this.loading)return d`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let c=this.watchId;return d`<div class="pe-empty">
        <span>Could not read this watch's voice settings: ${this.loadError}</span>
        ${c===void 0?f:d`<button class="pe-btn" @click=${()=>{this.load(c)}}>Try again</button>`}
      </div>`}let t=this.record;if(t===void 0)return d`<div class="pe-empty">Loading…</div>`;let s=this.draft;if(s===void 0&&t.revision>0)return d`<div class="pe-empty"><b>${Fe}</b></div>`;if(s===void 0){let c=this.watchId===void 0?void 0:U(this.watchId),h=this.watchId;return d`<div class="pe-empty"><b>${Bn}</b><span>${X}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${xe}</button>
        ${c?.dirty&&h!==void 0?d`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when voice settings are here again.</span>
          <button class="pe-btn" @click=${()=>{ve(h),this.requestUpdate()}}>Discard the kept edits</button>`:f}
      </div>`}let o=this.viewHost();if(o===void 0)return d`<div class="pe-empty">Loading…</div>`;let r=this.fittedColumns(),a=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"",l=t.revision<=0;return d`${l&&this.barHost===void 0?Sn():f}
    <div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${r.left}px;--wa-right:${r.right}px;${a}`}>
      <div class="column left">
        ${Di(o)}
        ${Ci(o,this.phrasesLinks())}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(o,e)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${Ri(o)}
      </div>
    </div>
    ${l?f:this.renderFoot(t,s.document,s.dirty)}`}renderFoot(e,t,s){let o=Ae(t),r=Ce({record:e,size:o.size,limit:o.limit,noun:"voice settings",historyState:this.historyState}),a=this.watchId;return d`${pn({status:r,historyState:this.historyState,historyOpen:this.historyOpen,onHistory:()=>{this.historyOpen=!0}})}
    ${this.historyOpen?fn({noun:"voice settings",record:e,entries:this.history,historyState:this.historyState,dirty:s,restoring:this.restoring,onRetry:()=>{a!==void 0&&(this.historyState="loading",this.loadHistory(a))},onRestore:l=>{this.historyOpen=!1,this.askRestore(l)},onClosed:()=>{this.historyOpen=!1}}):f}
    ${this.rawOpen?vn({noun:"voice settings",document:t,revision:e.revision,dirty:s,copied:this.rawCopied,onCopy:l=>{mn(l).then(c=>{this.rawCopied=c})},onClosed:()=>{this.rawOpen=!1}}):f}`}renderRestoreAsk(e){let t=this.record,s=ks(e.entry.updated_at);return d`<dialog class="pe-ask" aria-labelledby="ve-ask-title"
      @cancel=${o=>{this.restoring&&o.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="ve-ask-title" title=${`Revision ${e.entry.revision}`}>${hn(e.entry)}</h3>
      <p>${xs(e.entry.updated_by)}${s?` ${s}`:""}, ${ys(e.entry.size)}.</p>
      ${e.summary?d`<p class="pe-muted">${e.summary}</p>`:f}
      <p>It is saved again as the newest save. The copy shown now stays in the earlier saves.</p>
      ${(e.links??[]).map(o=>d`<p>${o}</p>`)}
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[Vt,vt,gt,mt,wt,bt,yt,kt,nn,Tn,z`
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
    .column.canvas > .card.canvas-card.ve-canvas { min-height: 0; flex: none; }
    /* The lit stage's edge in Voice's hue, Home's Voice door. */
    .canvas-card.ve-canvas { --wa-stage-hue: var(--wa-hue-red); }
    .cv-head .cv-title { flex: 0 1 auto; min-width: 0; font-size: 14px; font-weight: 600; letter-spacing: -.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .cv-head .cv-watch { min-width: 0; font-size: 12.5px; font-weight: 500; color: var(--wa-ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pe-chip-glyph { display: inline-flex; flex: none; color: var(--pe-person, var(--wa-muted)); }
    .pe-chip-glyph svg.ui-icon { width: 13px; height: 13px; }
    .picker > button.ve-watch-btn { max-width: 260px; }
    .ve-watch-btn .tb-browse-l { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ve-watch-btn .ve-caret { display: inline-flex; flex: none; color: var(--wa-muted); }
    .picker > button.ve-watch-btn .ve-caret svg { width: 11px; height: 11px; }
    .pop-menu.ve-watch-menu { left: 0; right: auto; min-width: 220px; }
    .ve-watch-menu .row.ve-watch-row { display: flex; align-items: center; gap: 8px; }
    .ve-watch-row .ve-watch-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .ve-watch-row[aria-checked="true"] { font-weight: 700; }
    .ve-watch-check { display: inline-flex; flex: none; width: 14px; color: var(--wa-accent); }
    .ve-watch-check svg.ui-icon { width: 14px; height: 14px; }
    .ve-stage-area { position: relative; padding: 64px 12px 12px; gap: 10px; }
    .ve-stage-body { display: flex; justify-content: center; padding: 0 4px 4px; overflow-x: auto; overflow-y: hidden; }
    .ve-stage-area > .under {
      display: flex; flex-direction: column; gap: 4px; align-self: center; max-width: 460px; text-align: center;
      font-size: 11.5px; font-weight: 400; line-height: 15px; color: var(--wa-hint, var(--wa-muted));
    }
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
    .pe-btn.pe-danger { color: var(--wa-need); }
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
  `,Hi,Qn,wn,Bt]}};g([_({attribute:!1})],v.prototype,"hass",2),g([_({attribute:!1})],v.prototype,"owners",2),g([_({attribute:!1})],v.prototype,"ownerId",2),g([_({type:Boolean,reflect:!0})],v.prototype,"narrow",2),g([_({attribute:!1})],v.prototype,"icons",2),g([_({attribute:!1})],v.prototype,"iconsTick",2),g([_({attribute:!1})],v.prototype,"haMenu",2),g([_({attribute:!1})],v.prototype,"onHaMenu",2),g([_({attribute:!1})],v.prototype,"onBack",2),g([_({attribute:!1})],v.prototype,"barActions",2),g([_({attribute:!1})],v.prototype,"shellOwnsWatch",2),g([_({attribute:!1})],v.prototype,"barHost",2),g([w()],v.prototype,"watchId",2),g([w()],v.prototype,"record",2),g([w()],v.prototype,"unsupported",2),g([w()],v.prototype,"voices",2),g([w()],v.prototype,"voicesState",2),g([w()],v.prototype,"cloudTTS",2),g([w()],v.prototype,"loading",2),g([w()],v.prototype,"loadError",2),g([w()],v.prototype,"history",2),g([w()],v.prototype,"historyState",2),g([w()],v.prototype,"note",2),g([w()],v.prototype,"restoreAsk",2),g([w()],v.prototype,"restoring",2),g([w()],v.prototype,"historyOpen",2),g([w()],v.prototype,"rawOpen",2),g([w()],v.prototype,"rawCopied",2),g([w()],v.prototype,"ownList",2),g([w()],v.prototype,"topMenuOpen",2),g([w()],v.prototype,"watchMenuOpen",2),g([w()],v.prototype,"voicePlaces",2),g([w()],v.prototype,"otherVoice",2),g([w()],v.prototype,"devicesOpen",2),g([w()],v.prototype,"linking",2),g([w()],v.prototype,"devicesNote",2),g([w()],v.prototype,"replaceAsk",2),g([w()],v.prototype,"freshAsk",2),g([w()],v.prototype,"zoom",2),g([w()],v.prototype,"columns",2),g([w()],v.prototype,"hostWidth",2),g([w()],v.prototype,"hostHeight",2);customElements.get("wa-voice-editor")||customElements.define("wa-voice-editor",v);export{nt as VE_COLUMNS_KEY,v as WaVoiceEditor,Vs as watchVoiceSummary};
