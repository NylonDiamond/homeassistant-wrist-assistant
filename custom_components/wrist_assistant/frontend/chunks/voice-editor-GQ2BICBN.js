import{A as ee,B as Nn,C as Fn,D as Un,E as qn,F as zn,G as jn,H as fe,I as Bn,J as Kn,K as Jn,L as Ue,M as Yn,N as Gn,a as ue,b as Re,c as Ae,d as E,e as Q,f as We,g as He,h as Le,i as N,j as Pn,k as Dn,l as Cn,m as On,n as En,o as Me,p as Rn,q as An,r as Wn,s as Ne,t as R,u as F,v as Hn,w as pe,x as Ln,y as Mn,z as Fe}from"./chunk-LE35MVHV.js";import{A as Ce,a as cn,b as Ie,c as dn,d as ln,x as Pe,y as X,z as De}from"./chunk-XKHHYV2T.js";import{b as Nt,e as Ft,f as $e,g as Ut}from"./chunk-C6K36PU4.js";import{a as Ot,b as Et,c as G,d as Rt,i as At}from"./chunk-OVXNK2D3.js";import{a as Oe,b as hn,c as un,d as pn,e as Ee,f as fn,g as vn,h as gn,i as mn,j as wn,k as bn,l as yn,m as xn,n as $n,o as Sn,p as Vn,q as Tn,r as _n,s as In}from"./chunk-6YREU7FJ.js";import{d as kn}from"./chunk-BOF3NRZW.js";import{c as vt}from"./chunk-K2Z4YFL6.js";import{Bb as rn,sc as _e,tc as an,vc as he}from"./chunk-KDF3BH6P.js";import{a as tn,b as nn}from"./chunk-YXICIVY5.js";import{d as sn,e as on}from"./chunk-FUHON6NJ.js";import"./chunk-DNRTVSPA.js";import{c as zt,d as jt,f as Bt}from"./chunk-Q366457P.js";import{Ab as Xt,E as Ve,Ea as Kt,Hb as Qt,Jb as en,b as qt,qb as Jt,rb as Yt,sb as de,ub as le,wb as Gt,xb as Zt,z as Se,zb as Te}from"./chunk-NM77EPB4.js";import{T as Zn,V as Xn,Y as Qn}from"./chunk-PB62W7AV.js";import{j as Z}from"./chunk-UCO5DASE.js";import"./chunk-3WGQT6J2.js";import"./chunk-FJIHFDLG.js";import{a as Ht,b as Lt,c as Mt}from"./chunk-GKLASXDP.js";import"./chunk-ZKXA3G3T.js";import{i as Ct}from"./chunk-Y3MKANRL.js";import{Bh as gt,Dh as mt,Eh as wt,Fh as bt,Gh as yt,Hh as kt,Ih as xt,Jg as j,Jh as $t,Lg as be,Mg as at,Ng as ct,Og as dt,Pg as lt,Qg as ht,Rg as ut,Zg as pt,b as z,d,g as p,j as ot,l as _,lg as rt,lh as ft,m as w,wh as B,xh as y}from"./chunk-G7AAB2LI.js";import"./chunk-65FYUJAA.js";import{X as V,Y as Wt,i as C}from"./chunk-NL2JPLO4.js";import{O as St,ba as Vt,fa as re,hb as Pt,ia as Tt,ja as _t,jb as Dt,ka as ae,kb as D,la as ye,lb as ke,ma as ce,na as It,nb as xe}from"./chunk-4T3N2GVV.js";import{a as g}from"./chunk-LO2NM3CE.js";var zi="On means the page is on that device. An edit on one device shows on all of them. Each device keeps its own order and Hidden.";function ei(t){let{name:i,places:e,blocked:n,busy:s,note:o}=t;return d`<div class="pk-dup-menu pe-dev-menu ${t.className??""}" role="group" aria-label=${`Devices for ${i}`}>
    <div class="pk-dup-head">${t.head??"This page is on"}</div>
    ${n===void 0?p:d`<div class="pe-dev-note warn">${n}</div>`}
    ${e.map(r=>ji({place:r,name:i,title:r.stuck??n??t.titleOf?.(r)??(r.on?`Take it off ${r.device.name}. Its own order and Hidden go with it.`:`Put it on ${r.device.name}. An edit on one device then shows on both.`),off:r.stuck!==void 0||n!==void 0||s,...t.colorOf===void 0?{}:{colorOf:t.colorOf},onToggle:t.onToggle}))}
    ${s?d`<div class="pe-dev-note">Saving…</div>`:p}
    ${o===void 0?p:d`<div class="pe-dev-note ${o.kind}" role="status">${o.text}</div>`}
    <div class="pk-dup-note">${t.foot??zi}</div>
    <button type="button" class="pk-dup-done" @click=${()=>t.onDone()}>Done</button>
  </div>`}function ji(t){let{place:i,off:e}=t,n=i.device.name,s=t.colorOf?.(i.device.ownerId);return d`<div class="pk-dup-row check ${e?"off":""} ${s===void 0?"":"tinted"}"
    style=${s===void 0?p:`--dc:${s}`}>
    <label class="pk-dup-pick" title=${t.title}>
      <input type="checkbox" role="switch" .checked=${Z(i.on)} ?disabled=${e}
        aria-label=${`${t.name} on ${n}`}
        @change=${o=>{o.currentTarget.checked=i.on,t.onToggle(i)}}>
      ${y(i.device.kind==="iphone"?"phone":"watch")}
      <span class="pk-dup-name">${n}</span>
      ${i.here?d`<span class="pk-dup-full">this ${Et(i.device.kind)}</span>`:i.tag===void 0?p:d`<span class="pk-dup-full">${i.tag}</span>`}
    </label>
  </div>`}var ti=z`
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
`;var I="phrases";function A(t,i){return t!=null&&Object.hasOwn(t,i)?t[i]:void 0}function K(t){if(!Array.isArray(t))return;let i=new Set,e=[];for(let n of t){if(!C(n)||typeof n.id!="string"||n.id==="")return;let s=n.id.toUpperCase();if(i.has(s))return;i.add(s),e.push([s,n])}return e}function Bi(t,i,e){let n=t===null?void 0:t,s=i===null?void 0:i,o=e===null?void 0:e,r=n===void 0?[]:K(n),a=s===void 0?void 0:K(s),l=o===void 0?void 0:K(o);if(r===void 0||a===void 0||l===void 0)return V(s,n)?o:s;let c=new Map(r),h=new Map(a),u=new Map(l),k=(b,$)=>{let T=c.get(b);return T===void 0||!V($,T)},m=(b,$,T)=>k(b,$)?$:T,S=(b,$)=>c.has(b)&&!k(b,$)?void 0:$,x=a.map(([b])=>b).filter(b=>c.has(b)),W=r.map(([b])=>b).filter(b=>h.has(b)),P=x.length!==W.length||x.some((b,$)=>b!==W[$]),we=P?a:l,f=P?l:a,M=P,O=[];for(let[b,$]of we){let T=(M?u:h).get(b);if(T!==void 0)O.push(M?m(b,$,T):m(b,T,$));else{let st=S(b,$);st!==void 0&&O.push(st)}}for(let[b,$]of f){if((M?h:u).has(b))continue;let T=S(b,$);T!==void 0&&O.push(T)}let oe=b=>Array.isArray(b)&&b.length===O.length&&O.every(($,T)=>$===b[T]);return oe(o)?o:oe(s)?s:O}function ni(t,i,e){let n=Wt(t,i,e),s=Bi(t==null?e[I]:A(t,I),A(i,I),A(e,I)),o=A(n,I);if(s===o)return n;if(s===void 0){if(!Object.hasOwn(n,I))return n;let{[I]:r,...a}=n;return a}return n===e||n===i?{...n,[I]:s}:(n[I]=s,n)}function ii(t,i,e){let n=new Set([...Object.keys(i),...Object.keys(e)]),s=[];for(let o of n){if(o===I){let h=new Map(K(A(t,I))??[]),u=K(A(i,I)),k=new Map(K(A(e,I))??[]);if(u===void 0)continue;u.some(([S,x])=>{let W=k.get(S),P=h.get(S);return W!==void 0&&!V(x,W)&&(P===void 0||!V(x,P)&&!V(W,P))})&&s.push(o);continue}let r=A(t,o),a=A(i,o),l=A(e,o),c=h=>t==null||!V(h,r);c(a)&&c(l)&&!V(a,l)&&s.push(o)}return s.sort()}var si=100,Ki=3,ve=class{constructor(i,e){this._undo=[];this._redo=[];this._replaced=[];this._base=i,this._revision=e,this._document=i}get base(){return this._base}get revision(){return this._revision}get document(){return this._document}get canUndo(){return this._undo.length>0}get canRedo(){return this._redo.length>0}get replaced(){return this._replaced}get dirty(){let i=this._dirty;if(i!==void 0&&i.document===this._document&&i.base===this._base)return i.value;let e=this._document!==this._base&&!V(this._document,this._base);return this._dirty={document:this._document,base:this._base,value:e},e}apply(i,e){if(i===this._document||V(i,this._document))return(e===void 0||e!==this._coalesceKey)&&(this._coalesceKey=void 0),!1;if(e!==void 0&&e===this._coalesceKey&&this._undo.length>0){let n=this._undo[this._undo.length-1];return V(i,n)?(this._undo.pop(),this._document=n,this._coalesceKey=void 0):this._document=i,this._redo=[],!0}return this.pushUndo(this._document),this._redo=[],this._document=i,this._coalesceKey=e,!0}endCoalesce(){this._coalesceKey=void 0}undo(){this._coalesceKey=void 0;let i=this._undo.pop();return i===void 0?!1:(this._redo.push(this._document),this._document=i,!0)}redo(){this._coalesceKey=void 0;let i=this._redo.pop();return i===void 0?!1:(this.pushUndo(this._document),this._document=i,!0)}discard(){return this._coalesceKey=void 0,this.apply(this._base)}rebase(i,e){return e<this._revision?(this._replaced=[],!1):this.mergeOnto(i,e)}restart(i,e){return this.mergeOnto(i,e)}mergeOnto(i,e){this._coalesceKey=void 0;let n=this._base;this._replaced=this._document===n?[]:ii(n,this._document,i);let s=new Map,o=u=>{let k=s.get(u);if(k!==void 0)return k;let m=u===n?i:ni(n,u,i);return m!==i&&V(m,i)&&(m=i),s.set(u,m),m},r=this._document,a=[...this._undo,this._document,...this._redo.slice().reverse()].map(o),l=this._undo.length,c=[],h=0;return a.forEach((u,k)=>{let m=c[c.length-1];m!==void 0&&(m===u||V(m,u))?k===l&&(c[c.length-1]=u):c.push(u),k===l&&(h=c.length-1)}),this._undo=c.slice(0,h),this._document=c[h],this._redo=c.slice(h+1).reverse(),this._base=i,this._revision=e,this._document!==r&&!V(this._document,r)}saved(i,e){e<this._revision||(this._coalesceKey=void 0,this._base=i,this._revision=e)}get saving(){return te.has(this)}get saveDone(){return te.get(this)}pushUndo(i){this._undo.push(i),this._undo.length>si&&this._undo.splice(0,this._undo.length-si)}},te=new WeakMap;function oi(t,i){if(te.has(t))return Promise.resolve({ok:!1,revision:t.revision,merged:!1,code:"busy",message:"These voice settings are being saved already."});let e=Ji(t,i).finally(()=>te.delete(t));return te.set(t,e),e}async function Ji(t,i){let e=!1,n=new Set,s=()=>n.size===0?{}:{replaced:[...n].sort()},o=(r,a,l)=>({ok:!1,revision:t.revision,merged:e,code:r,message:a,...l===void 0?{}:{problems:l}});for(let r=1;;r++){let a=t.document,l=Kn(a);if(l.length>0)return o("invalid",l.join(" "),l);let c;try{({revision:c}=await i.save(t.revision,a))}catch(h){let{code:u="unknown",message:k}=D(h);if(u!=="conflict"||r>=Ki)return o(u,k);let m;try{m=await i.fetch()}catch(S){let x=D(S);return o(x.code??"unknown",x.message)}if(!C(m)||!(m.revision>0)||!C(m.document))return o("no_record","Home Assistant holds no voice settings for this watch.");m.revision<t.revision?t.restart(m.document,m.revision):t.rebase(m.document,m.revision);for(let S of t.replaced)n.add(S);if(e=!0,!t.dirty)return{ok:!0,revision:t.revision,merged:e,alreadySaved:!0};continue}return t.saved(a,c),{ok:!0,revision:t.revision,merged:e,...s()}}}var H=new Map;function U(t){return H.get(t)}function qe(t,i,e){let n=H.get(t);if(n!==void 0&&e<=0)return{draft:n,mergedIntoEdits:!1,replaced:[]};if(n===void 0||e<n.revision&&!n.dirty){let r=new ve(i,e);return H.set(t,r),{draft:r,mergedIntoEdits:!1,replaced:[]}}if(e===n.revision)return{draft:n,mergedIntoEdits:!1,replaced:[]};let s=n.dirty,o=e<n.revision?n.restart(i,e):n.rebase(i,e);return{draft:n,mergedIntoEdits:s&&o,replaced:s?n.replaced:[]}}function ze(t){let i=H.get(t);if(i===void 0){let e=new ve(Q(),0);return H.set(t,e),e}return i.revision>0&&!i.saving&&i.restart(Q(),0),i}function ge(t){H.delete(t)}function je(){for(let t of H.values())if(t.dirty)return!0;return!1}function ri(){H.clear()}var me="linkIds",ne="phrases",Yi=["defaultAssistAgentId","defaultSpeakers","defaultTTSEngine","phrases"];var ai="Phrases and defaults";function L(t){let i=t?.[me],e=C(i)?i[ne]:void 0;return typeof e=="string"&&e!==""?e:void 0}function ci(t){let i=C(t)?t.voice:void 0;if(!C(i))return;let e={};for(let[n,s]of Object.entries(i))!C(s)||typeof s.unit!="string"||!Array.isArray(s.owners)||(e[n]={unit:s.unit,owners:s.owners.filter(o=>typeof o=="string")});return e}function Be(t,i,e){let n=L(t),s=n===void 0?[]:e?.[n]?.owners??[];return[i,...s.filter(o=>o!==i)]}var Gi="These are this watch's phrases. Switch off another watch to unlink it.",Ks=di(void 0);function di(t){return`${ae(t)} Phrases can go on this watch after that.`}var Zi="waiting for iPhone",li="Phrases and defaults are on",hi="On means the watch has these phrases and defaults. An edit on one watch shows on all of them. Each watch keeps its own watch voice and Silent Mode setting.";function ui(t){let i=t.device.name;return t.on?`Unlink ${i}. It keeps a copy of the phrases as they are now.`:`Put them on ${i}. An edit on one watch then shows on both.`}function pi(t,i,e,n,s=new Set){let o=new Set(Be(i,e,n));return t.filter(r=>r.kind==="watch").map(r=>{let a=r.ownerId===e,l=o.has(r.ownerId);return a?{device:r,on:!0,here:!0,stuck:Gi}:!l&&s.has(r.ownerId)?{device:r,on:l,here:!1,stuck:di(r.appVersion),tag:Zi}:{device:r,on:l,here:!1}})}function fi(t,i,e){let n=t.filter(s=>s!==i);if(n.length!==0){if(n.length===1){let s=e.find(o=>o.ownerId===n[0])?.name;return s===void 0?"On 2 watches":`Also on ${s}`}return`On ${t.length} watches`}}function vi(t,i,e){let n=t.filter(o=>o!==i);if(n.length===0)return;let s=n.map(o=>e.find(r=>r.ownerId===o)?.name??"another watch");return`Also on ${G(s)}. An edit here shows there too.`}function gi(t,i){if(t===void 0)return!1;let e=L(t);return e!==void 0&&e===i?!1:e!==void 0||R(t).length>0}function mi(t){return`Replace the phrases on ${t}? Its own are lost.`}var Ke="Its watch voice and Silent Mode setting stay as they were.";function wi(t,i){let e=[];for(let n of t){let s=n.now===void 0?[]:n.holders(n.now),o=n.restored===void 0?[]:n.holders(n.restored);if(n.now!==void 0&&n.restored===n.now){s.length>0&&e.push(`Also changes the ${n.name} on ${G(s)}.`);continue}if(s.length>0){let r=s.length===1?"which keeps its copy as it is":"which keep their copies as they are";e.push(`Unlinks the ${n.name} on this ${i} from ${G(s)}, ${r}.`)}o.length>0&&e.push(`Also changes the ${n.name} on ${G(o)}, which it was shared with in that save.`)}return e}function bi(t){let{code:i,message:e}=D(t);switch(i){case"unknown_device":return"That watch is not paired with this Home Assistant any more.";case"not_found":return"This watch's voice settings are not saved yet. Save first, then try again.";case"unit_taken":return"That watch has phrases of its own.";case"not_for_iphone":return"An iPhone keeps no phrases.";case"awaiting_move":return`${_t} Try again after that.`;case"unknown_command":return"This version of the integration cannot share phrases between watches. Update it first.";default:return e}}function yi(t){let i=t[me];if(!C(i)||!Object.hasOwn(i,ne))return t;let{[ne]:e,...n}=i;return Object.keys(n).length===0?Le(t,me):He(t,me,n)}function Je(t,i=!1){let e=Q(),n=t;for(let s of Yi)n=Object.hasOwn(e,s)?He(n,s,e[s]):Le(n,s);return i?yi(n):n}function ki(t){return Je(t)===t}function xi(t){if(!(t.length<2))return{question:`These phrases and defaults are on ${t.length} watches.`,here:"Here only",all:`On all ${t.length} watches`,count:t.length}}var Xi=3;async function $i(t,i){for(let e=1;;e++){let n;try{n=await t.read(i)}catch(r){let{code:a="unknown",message:l}=D(r);return{ok:!1,code:a,message:l}}let s=n.revision>0?E(n.document):void 0;if(s===void 0)return{ok:!0,unlinked:!1};let o=yi(s);if(o===s)return{ok:!0,unlinked:!1};try{return await t.save(i,n.revision,o),{ok:!0,unlinked:!0}}catch(r){let{code:a="unknown",message:l}=D(r);if(a!=="conflict"||e>=Xi)return{ok:!1,code:a,message:l}}}}var Qi={defaultAssistAgentId:"the conversation agent",defaultTTSEngine:"the text to speech engine",defaultSpeakers:"the speakers",phrases:"the phrases",watchSpeakReplyInSilentMode:"Speak even in Silent Mode",watchSpeechVoiceIdentifier:"the watch voice"};function es(t){return Qi[t]??"a setting this panel does not show"}function Ye(t){if(t.length===0)return"";let i=[...new Set(t.map(es))];return`Another save also changed ${i.length===1?i[0]:`${i.slice(0,-1).join(", ")} and ${i[i.length-1]}`}. ${i.length===1?"Your version replaced it.":"Your versions replaced them."}`}function Si(t){if(t.ok){if(t.alreadySaved===!0)return{kind:"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${t.revision}.`};let e=t.replaced??[];return e.length>0?{kind:"warn",text:`Saved. ${Ye(e)}`}:t.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let i=(t.message??"").trim();switch(t.code){case"conflict":return{kind:"warn",text:"Not saved. The voice settings kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds voice settings for this watch. Your edits are kept, so save again."};case"invalid":{let e=t.problems??[];return e.length>0?{kind:"err",text:`Not saved. ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the voice settings${i===""?".":`: ${i}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${Dt}`};case"busy":return{kind:"warn",text:"Already saving these voice settings. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the voice settings just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${i===""?".":`: ${i}`}`}}}var Vi=[["defaults","Defaults"],["watch","On the watch"]],Ti={defaults:"What Assist and Speak use when a tile, a slot or a phrase picks nothing of its own.",watch:"How the watch itself speaks a reply."},ts="The voice defaults, the phrase library and the watch's own speech. A save reaches the watch the next time it checks.",_i="Pick from List shows these phrases on the watch. Tap one to edit it.",ns={defaults:{color:B.content,icon:"content"},watch:{color:B.content,icon:"watch"},phrase:{color:B.content,icon:"text"},look:{color:B.look,icon:"look"},speech:{color:B.content,icon:"content"}},is="#ab47bc",se="voice-editor",Ii=44,Pi=22;function q(t,i){let e=t.states[i]?.attributes?.friendly_name;return typeof e=="string"&&e.trim()!==""?e:i}function ss(t,i){let e=i.indexOf(".");return{entityId:i,displayName:i===""?"":q(t,i),domain:e>0?i.slice(0,e):""}}function Di(t,i,e,n){return t.icons.render(i,e,n)??d`<span class="vo-glyph-dot" style=${`background:${n}`}></span>`}function Ge(t){if(typeof t!="string"||t==="")return{fill:"#D88CC4",ink:"#D88CC4"};if(t.toUpperCase()==="#RAINBOW")return{fill:"conic-gradient(#FF3B30, #FF9500, #FFCC00, #34C759, #007AFF, #AF52DE, #FF3B30)",ink:"#FF9500"};if(t.toUpperCase().startsWith("GRADIENT|")){let i=t.split("|").slice(1).filter(e=>/^#[0-9a-fA-F]{6}$/.test(e));if(i.length>=2)return{fill:`linear-gradient(135deg, ${i.join(", ")})`,ink:i[0]};if(i.length===1)return{fill:i[0],ink:i[0]}}return{fill:t,ink:t}}function Ci(t,i){return cn(t.uiState,se,i)}function os(t,i){Ie(t.uiState,se,i,!Ci(t,i)),t.requestUpdate()}function ie(t,i,e,n,s={}){let o=Ci(t,i),r=ns[i];return $t({color:r.color,icon:y(r.icon),title:e,open:o,onToggle:()=>os(t,i),...s.summary===void 0||s.summary===""?{}:{summary:s.summary},dot:s.dot===!0,id:`${se}:${i}`},o?n:d``)}var Ze="vo:pick";function J(t){let i=t.uiState.get(Ze);if(typeof i=="string"&&i.startsWith("phrase:")){let e=Hn(t.document,i.slice(7));if(e!==void 0)return{phrase:e}}return{section:i==="watch"?"watch":"defaults"}}function Xe(t,i){t.uiState.set(Ze,i),t.requestUpdate()}function Qe(t,i){t.uiState.set(Ze,`phrase:${i}`),t.requestUpdate()}function Oi(t){return"phrase"in J(t)?(Xe(t,"defaults"),!0):!1}function rs(t){let i;t.edit(e=>{let n=Mn(e);return i=n.id,n.document}),i!==void 0&&(Ie(t.uiState,se,"phrase",!0),Qe(t,i))}function as(t,i){if(i==="defaults"){let s=N(t.document);return s.speakers.length===0?"No speakers":s.speakers.map(r=>q(t.hass,r)).join(", ")}let e=Me(t.document),n=e===void 0?void 0:t.voices.find(s=>s.id===e);return e===void 0?"System voice":n!==void 0?Ne(n):e}function Ei(t){let i=J(t),e="section"in i?i.section:void 0;return d`<section class="card lc vo-voice-card" aria-label="Voice"
    style=${`--c: var(--wa-lc-pages, #26a69a); --thumb-w: ${Ii}px; --thumb-h: ${Pi}px`}>
    <div class="lc-head">
      <span class="swatch">${Qn()}</span><span class="lc-title">Voice</span>
      <span class="lc-sub" title=${ts}>for the watch</span>
    </div>
    <div class="layers vo-section-list" role="list">
      ${Vi.map(([n,s])=>{let o=n===e,r=()=>Xe(t,n);return d`<div class="layer vo-section-row ${o?"hl":""}" data-section=${n} role="listitem" tabindex="0"
          aria-current=${o?"true":"false"} aria-label=${s} title=${Ti[n]}
          @click=${r}
          @keydown=${a=>{a.target!==a.currentTarget||a.key!=="Enter"&&a.key!==" "||(a.preventDefault(),r())}}>
          <span class="grip" aria-hidden="true"></span>
          <span class="thumb vo-thumb" aria-hidden="true">${y(n==="watch"?"watch":"content")}</span>
          <span class="name"><b><span class="nm-t">${s}</span></b><small>${as(t,n)}</small></span>
          <span class="right"></span>
        </div>`})}
    </div>
  </section>`}function cs(t,i){let e=Ge(i.color),n=typeof i.icon=="string"&&i.icon!==""?i.icon:"speaker.wave.2";return d`<span class="thumb vo-thumb" style=${`--c:${e.ink}`} aria-hidden="true"><span class="vo-thumb-glyph">${Di(t,n,14,e.ink)}</span></span>`}function ds(t){let i=fe(t);return i.length>0?`Needs a ${i.join(" and a ")}`:typeof t.message=="string"?t.message:""}function ls(t,i,e,n,s){let o=F(i),r=s!==void 0&&F(s).toUpperCase()===o.toUpperCase(),a=pe(i),l=ds(i),c=fe(i).length>0,h=()=>Qe(t,o);return d`<div class="layer vo-phrase-row ${r?"hl":""}" data-phrase=${o} role="listitem" tabindex="0"
    aria-current=${r?"true":"false"} aria-label=${a} title=${`${a} \xB7 ${l}`}
    @click=${u=>{u.target instanceof Element&&u.target.closest("button")||h()}}
    @keydown=${u=>{u.target!==u.currentTarget||u.key!=="Enter"&&u.key!==" "||(u.preventDefault(),h())}}>
    <span class="grip" aria-hidden="true"></span>
    ${cs(t,i)}
    <span class="name"><b><span class="nm-t">${a}</span></b><small class=${c?"vo-needs":""}>${l}</small></span>
    <span class="right">
      <span class="acts">
        <button type="button" class="icon" ?disabled=${t.busy||e===0} title="Move up" aria-label=${`Move ${a} up`}
          @click=${()=>t.edit(u=>ee(u,o,e-1))}>${y("up")}</button>
        <button type="button" class="icon" ?disabled=${t.busy||e===n-1} title="Move down" aria-label=${`Move ${a} down`}
          @click=${()=>t.edit(u=>ee(u,o,e+1))}>${y("down")}</button>
        <button type="button" class="icon danger" ?disabled=${t.busy} title="Remove" aria-label=${`Remove ${a}`}
          @click=${()=>t.edit(u=>Fe(u,o))}>${y("delete")}</button>
      </span>
    </span>
  </div>`}function Ri(t,i){let e=R(t.document),n=J(t),s="phrase"in n?n.phrase:void 0,o=Ln(t.document);return d`<section class="card lc vo-phrases-card" aria-label="Phrases"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${Ii}px; --thumb-h: ${Pi}px`}>
    <div class="lc-head">
      <span class="swatch">${y("list")}</span><span class="lc-title">Phrases</span>
      <span class="lc-sub">${e.length} of ${Re}</span>
      ${i?.badge===void 0?p:d`<span class="badge vo-linked" title=${i.badgeTitle??i.badge}>${i.badge}</span>`}
      <span class="spacer"></span>
      ${i===void 0?p:d`<button type="button" class="lc-btn vo-dev-open ${i.open?"on":""}" aria-expanded=${i.open?"true":"false"}
        title="Pick the watches these phrases and defaults are on" @click=${()=>i.onDevices()}>${y("watch")}<span>Devices</span></button>`}
      <button type="button" class="lc-btn pri vo-add-phrase" aria-label="Add phrase" ?disabled=${t.busy||o}
        title=${o?`The watch takes ${Re} phrases at most.`:"Add a phrase at the end"}
        @click=${()=>rs(t)}>${y("plus")}<span>Add</span></button>
    </div>
    ${i?.open===!0?i.menu:p}
    ${e.length===0?d`<div class="lc-note">No phrases yet. A phrase is a message Pick from List and Speak Phrase can say on your speakers.</div>`:d`<div class="layers vo-phrase-list" role="list">${e.map((r,a)=>ls(t,r,a,e.length,s))}</div>`}
  </section>`}function Ai(t){let{width:i,height:e}=t.screen,n=t.scale,s=R(t.document),o=J(t),r="phrase"in o?F(o.phrase).toUpperCase():void 0,a=s.map(c=>{let h=F(c),u=Ge(c.color),k=r!==void 0&&h.toUpperCase()===r,m=pe(c),S=typeof c.icon=="string"&&c.icon!==""?c.icon:"speaker.wave.2",x=c.displayMode==="text";return d`<button type="button" class="vo-say ${x?"vo-words":"vo-glyph"} ${k?"on":""}" style=${`--fill:${u.fill};--ink:${u.ink}`}
      title=${m} aria-label=${m} aria-pressed=${k?"true":"false"} @click=${()=>Qe(t,h)}>
      ${x?d`<span class="vo-say-text">${m}</span>`:d`<span class="vo-say-well">${Di(t,S,Math.round(16*n),"#fff")}</span>
        <span class="vo-say-label">${m}</span>`}
    </button>`}),l=d`<div class="vo-screen" role="group" aria-label="Pick from List on the watch"
    style=${`width:${Math.round(i*n)}px;height:${Math.round(e*n)}px;--vo-s:${n}`}>
    <div class="vo-screen-title">Phrases</div>
    ${s.length===0?d`<p class="vo-screen-note">No phrases yet.</p>`:d`<div class="vo-say-list">${a}</div>`}
  </div>`;return sn({width:i,height:e},n,l,"Pick from List on the watch")}function Wi(t){let i=R(t.document).length;return[`${i} ${i===1?"phrase":"phrases"}`]}function hs(t){let i=J(t);return("phrase"in i?["phrase","look","speech"]:[i.section]).map(n=>({module:se,section:n}))}function Hi(t){let i=J(t),e=hs(t),n=dn(t.uiState,e),s,o;if("phrase"in i){let r=pe(i.phrase);s=d`<div class="crumbs"><button class="root" title="The voice defaults" @click=${()=>Xe(t,"defaults")}>Voice</button><span class="sep">›</span><span class="kchip" style=${`--k:${Ge(i.phrase.color).ink}`}>Phrase</span><span class="nm" title=${r}>${r}</span></div>`,o=ms(t,i.phrase)}else{let r=Vi.find(([a])=>a===i.section)?.[1]??"";s=d`<div class="crumbs"><span class="kchip" style=${`--k:${is}`}>Voice</span><span class="nm" title=${r}>${r}</span></div>`,o=d`<p class="vo-note">${Ti[i.section]}</p>
      ${i.section==="defaults"?us(t):fs(t)}
      <p class="vo-note vo-pick-note">Pick a phrase to edit it, or add one.</p>`}return d`<div class="insp-head">
      ${s}
      <button class="expand" @click=${()=>{ln(t.uiState,e,!n),t.requestUpdate()}}>${n?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${o}</div>`}function Li(t,i,e,n){let s=an(t.hass.states),o=he(s,e),r=h=>h.missing?`${h.entityId} (not found)`:h.name,a=h=>Te(r(h),e.includes(h.entityId),u=>n(h.entityId,u)),l=s.filter(h=>h.announces),c=o.filter(h=>!l.some(u=>u.entityId===h.entityId));return d`<div class="vo-sub-h"><span>${i}</span></div>
    <div class="vo-list" role="group" aria-label=${i}>
      ${o.length===0?d`<div class="hint">No media players in Home Assistant.</div>`:p}
      ${l.length>0?d`<div class="vo-group">Speakers</div>${l.map(a)}`:p}
      ${c.length>0?d`${l.length>0?d`<div class="vo-group">Other media players</div>`:p}${c.map(a)}`:p}
    </div>`}function us(t){let i=N(t.document),e=vs(t,i.engine),n=i.engine===void 0?"No engine":e.find(([r])=>r===i.engine)?.[1]??q(t.hass,i.engine),s=[i.agent===void 0?"Default agent":q(t.hass,i.agent),n].join(" \xB7 "),o=d`<fieldset class="vo-body" ?disabled=${t.busy} aria-label="Defaults">
    <div class="vo-stack">${Qt({hass:t.hass},"Conversation agent",ss(t.hass,i.agent??""),r=>t.edit(a=>Pn(a,r.entityId)),"vo:agent",{domain:"conversation",clearable:!0})}</div>
    <div class="hint">${i.agent===void 0?"None picked: Home Assistant's own default agent answers.":"Assist uses this agent unless a tile or a slot picks its own."}</div>
    <div class="vo-stack">${le("Text to speech engine",i.engine??"",e,r=>t.edit(a=>Dn(a,r)),{snapBack:!0})}</div>
    <div class="hint ${i.engine===void 0?"warn":""}">${i.engine===void 0?"Not set. Speaking on speakers needs an engine.":"Speakers say messages and replies with this engine unless a tile, a slot or a phrase picks its own."}</div>
    ${Li(t,"Speakers",i.speakers,(r,a)=>t.edit(l=>Cn(l,r,a)))}
    <div class="hint">${i.speakers.length===0?"None picked. A slot or a phrase set to speakers with none of its own then plays nowhere.":"Assist, Speak and phrases play here unless they pick their own."}</div>
  </fieldset>`;return ie(t,"defaults","Defaults",o,{summary:s,dot:i.agent!==void 0||i.engine!==void 0||i.speakers.length>0})}function ps(t,i){let e=[{value:"",label:"System voice"}];i!==void 0&&!t.some(n=>n.id===i)&&e.push({value:i,label:`${i} (not on this watch)`});for(let n of Wn(t))for(let s of n.voices)e.push({value:s.id,label:Ne(s),group:n.language});return e}function fs(t){let i=On(t.document),e=Me(t.document),n=ps(t.voices,e),s=[];for(let c of n){let h=s[s.length-1];h!==void 0&&h.group!==void 0&&h.group===c.group?h.options.push(c):s.push({group:c.group,options:[c]})}let o=c=>d`<option value=${c.value} .selected=${Z(c.value===(e??""))}>${c.label}</option>`,r=t.voicesState==="unsupported"?"Update the integration to list this watch's voices.":t.voicesState==="error"?"Could not read this watch's voices.":t.voicesState==="ready"&&t.voices.length===0?Yn:void 0,a=d`<fieldset class="vo-body" ?disabled=${t.busy} aria-label="On the watch">
    ${Te("Speak even in Silent Mode",i,c=>t.edit(h=>En(h,c)),!0)}
    <div class="hint">The watch speaks a reply on its own speaker even while it is in Silent Mode.</div>
    <label class="field"><span>Watch voice</span>
      <select .value=${Z(e??"")} @change=${c=>{let h=c.target.value;t.edit(u=>Rn(u,h===""?void 0:h))||t.requestUpdate()}}>
        ${s.map(c=>c.group===void 0?c.options.map(o):d`<optgroup label=${c.group}>${c.options.map(o)}</optgroup>`)}
      </select></label>
    ${r===void 0?d`<div class="hint">The voice the watch speaks a reply in. System voice follows the watch's language.</div>`:d`<div class="hint ${t.voicesState==="ready"?"":"warn"}">${r}</div>`}
  </fieldset>`,l=e===void 0?"System voice":t.voices.find(c=>c.id===e)?.name??e;return ie(t,"watch","On the watch",a,{summary:l,dot:!i||e!==void 0})}function vs(t,i){let e=Object.keys(t.hass.services?.tts??{}),n=he(_e(t.hass.states,e,t.cloudTTS),i===void 0?[]:[i]);return[["","Not set"],...n.map(s=>[s.entityId,s.missing?`${s.entityId} (not found)`:s.name])]}function gs(t,i){let e=N(t.document),n=Object.keys(t.hass.services?.tts??{}),s=he(_e(t.hass.states,n,t.cloudTTS),i===void 0?[]:[i]);return[["",e.engine===void 0?"Default (Not set)":`Default (${s.find(r=>r.entityId===e.engine&&!r.missing)?.name??q(t.hass,e.engine)})`],...s.map(r=>[r.entityId,r.missing?`${r.entityId} (not found)`:r.name])]}function ms(t,i){let e=F(i),n=(f,M,O=!1)=>t.edit(oe=>zn(oe,e,f,M),O?`phrase:${e}:${f}`:void 0),s=fe(i),o=f=>typeof i[f]=="string"?i[f]:"",r=d`<fieldset class="vo-body" ?disabled=${t.busy} aria-label="Phrase">
    ${de("Message",o("message"),f=>n("message",f,!0),{placeholder:"What the speakers say"})}
    ${de("Label",o("label"),f=>n("label",f,!0),{placeholder:"Its name on the watch"})}
    ${s.length>0?d`<div class="hint warn">The phrase needs a ${s.join(" and a ")} before it can be saved.</div>`:p}
    ${Gt("Display mode",String(i.displayMode??"icon"),Ae("TTSPhraseDisplayMode"),f=>n("displayMode",f),{def:ue.newPhrase.displayMode})}
    <div class="hint">How Pick from List shows it: its icon, or its label.</div>
  </fieldset>`,a=i.color,l=Fn(a),c=d`<fieldset class="vo-body" ?disabled=${t.busy} aria-label="Look">
    <div class="vo-stack">${en({icons:t.icons,symbols:t.symbols},typeof i.icon=="string"?i.icon:"",f=>n("icon",f,!0),`vo:icon:${e}`,{tint:a})}</div>
    <div class="vo-no-alpha">${Xt("Color",Nn(a)?a:void 0,f=>{f!==void 0&&n("color",f,!0)},!1,ue.newPhrase.color)}</div>
    ${l===void 0?p:d`<div class="hint">${l}, which the panel does not offer. Picking a color here replaces it.</div>`}
  </fieldset>`,h=Array.isArray(i.targetSpeakers)?i.targetSpeakers.filter(f=>typeof f=="string"):[],u=N(t.document),k=typeof i.ttsEngine=="string"&&i.ttsEngine.trim()!==""?i.ttsEngine.trim():void 0,m=Un(i),S=qn(i),x=ue.volume,W=d`<fieldset class="vo-body" ?disabled=${t.busy} aria-label="Speech">
    ${Li(t,"Speakers",h,(f,M)=>t.edit(O=>jn(O,e,f,M)))}
    <div class="hint">${h.length>0?"This phrase plays only on these.":u.speakers.length>0?`None picked: the default speakers play (${u.speakers.map(f=>q(t.hass,f)).join(", ")}).`:"None picked, and no default speakers: set some in Defaults."}</div>
    ${le("Voice engine",k??"",gs(t,k),f=>n("ttsEngine",f===""?void 0:f),{snapBack:!0})}
    ${de("Language",typeof i.language=="string"?i.language:"",f=>n("language",f,!0),{placeholder:"The engine's own"})}
    <div class="hint">A language code such as en or de, for an engine that speaks more than one.</div>
    ${le("Speech volume",m,Ae("TTSPhraseSpeechVolumeMode"),f=>n("speechVolumeMode",f),{snapBack:!0,def:"keepCurrent"})}
    ${m==="keepCurrent"?p:d`${Zt("Target volume",S,f=>n("speechVolumePercent",f,!0),{min:x.min,max:x.max,step:x.step,def:x.default,format:f=>`${Math.round(f)}${x.unit}`})}
      <div class="vo-chips">${x.presets.map(f=>d`<button type="button" class="pe-chip ${S===f.value?"on":""}"
        aria-pressed=${S===f.value?"true":"false"} @click=${()=>n("speechVolumePercent",f.value)}>${f.label} ${f.value}%</button>`)}</div>`}
  </fieldset>`,P=R(t.document).findIndex(f=>F(f).toUpperCase()===e.toUpperCase()),we=R(t.document).length;return d`${ie(t,"phrase","Phrase",r,{summary:o("message"),dot:s.length>0})}
    ${ie(t,"look","Look",c,{summary:typeof i.icon=="string"?i.icon:"",dot:!1})}
    ${ie(t,"speech","Speech",W,{summary:k===void 0?"Defaults":q(t.hass,k),dot:Bn(i)})}
    <div class="vo-acts">
      <button type="button" class="pe-btn" ?disabled=${t.busy||P<=0} @click=${()=>t.edit(f=>ee(f,e,P-1))}>${y("up")}<span>Move up</span></button>
      <button type="button" class="pe-btn" ?disabled=${t.busy||P>=we-1} @click=${()=>t.edit(f=>ee(f,e,P+1))}>${y("down")}<span>Move down</span></button>
      <button type="button" class="pe-btn pe-danger" ?disabled=${t.busy} title="Remove this phrase from the library"
        @click=${()=>t.edit(f=>Fe(f,e))}>${y("delete")}<span>Remove</span></button>
    </div>
    <p class="vo-note">A menu slot that speaks this phrase keeps pointing at it after an edit. Removing it leaves such a slot with nothing to say.</p>`}var Mi=z`
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
`;Xn({dirty:je,drop:ri});typeof window<"u"&&window.addEventListener("beforeunload",t=>{je()&&(t.preventDefault(),t.returnValue="")});var ws=15e3,qi=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),et=qi?"\u2318":"Ctrl+",tt={min:200,max:720,middleMin:320},nt={left:280,right:340},it="wrist-assistant-panel.voice.columns.v1",bs=24,Ni=820,ys="Saving. The phrases can go on another watch once the save is done.",ks="Save or discard your edits first. The phrases go on another watch as they are saved here.";function Fi(t){return D(t).message}function Y(t){return D(t).code}function Ui(t){let{code:i,message:e}=D(t);return Object.assign(new Error(e),i===void 0?{}:{code:i})}function xs(t){return t<1e3?`${t} bytes`:`${Number((t/1e3).toFixed(1))} KB`}function $s(t){let i=t?Date.parse(t):NaN;return Number.isNaN(i)?"":vt(Math.max(0,(Date.now()-i)/1e3))}function Ss(t){return t==="panel"?"Saved here":"From the watch"}function Vs(t){return t instanceof HTMLElement?jt(t.tagName,t instanceof HTMLInputElement?t.type:void 0,t.isContentEditable):!1}function Ts(){let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t===null||t===document.body||t===document.documentElement}function _s(t){let i=E(t)??{},e=R(i).length,n=N(i).speakers.length;return`${e} ${e===1?"phrase":"phrases"}. ${n===0?"No default speakers.":`${n} default ${n===1?"speaker":"speakers"}.`}`}var v=class extends ot{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=p;this.shellOwnsWatch=!1;this.barHost=void 0;this.headBar=new Ht(this);this.unsupported=!1;this.voices=[];this.voicesState="loading";this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.otherVoice=new Map;this.devicesOpen=!1;this.linking=!1;this.linksSeq=0;this.columns={...nt};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new fn(this);this.symbols=new qt(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.voicesSeq=0;this.historySeq=0;this.subscribeSeq=0;this.cloudSeq=0;this.onReconnect=()=>{let e=this.watchId;!this.isConnected||e===void 0||(this.load(e,!0),this.loadVoices(e),this.loadCloud())};this.onScrubStart=e=>{e.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=e=>{e.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=e=>{if(e.defaultPrevented)return;let n=e.composedPath();if(!n.includes(this)&&!this.headBar.holds(n)&&!Ts()||this.renderRoot.querySelector("dialog[open]"))return;let s=e.metaKey||e.ctrlKey,o=e.key.toLowerCase();if(s&&!e.altKey&&o==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1;return}if(e.key==="Escape"&&this.watchMenuOpen){e.preventDefault(),this.watchMenuOpen=!1;return}if(e.key==="Escape"&&this.devicesOpen){e.preventDefault(),this.closeDevices();return}if(!Vs(n[0])){if(s&&!e.altKey&&o==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}if(e.ctrlKey&&!e.metaKey&&!e.altKey&&o==="y"){e.preventDefault(),this.redo();return}if(e.key==="Escape"&&!s&&!e.altKey){let r=this.viewHost();r!==void 0&&Oi(r)&&e.preventDefault()}}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen&&!this.watchMenuOpen&&!this.devicesOpen)return;let n=e.composedPath(),s=o=>n.some(r=>r instanceof HTMLElement&&r.classList.contains(o));this.topMenuOpen&&!s("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!s("ve-watch-picker")&&(this.watchMenuOpen=!1),this.devicesOpen&&!s("pe-dev-menu")&&!s("vo-dev-open")&&!s("pe-top-menu")&&!s("pe-ask")&&this.closeDevices()};this.addEventListener(Jt,this.onScrubStart),this.addEventListener(Yt,this.onScrubEnd),this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get watches(){return Vt(this.owners.length>0?this.owners:this.ownList??[])}get draft(){let e=this.watchId,n=this.record;if(!(e===void 0||n===void 0)){if(n.revision>0){let s=U(e);if(s!==void 0)return s;let o=E(n.document);return o===void 0?void 0:qe(e,o,n.revision).draft}if(!(this.unsupported||!this.opensReady()))return U(e)??ze(e)}}get newWatch(){let e=this.record;return e!==void 0&&e.revision<=0&&!this.unsupported}get saving(){return this.draft?.saving??!1}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Ft(it,nt,tt),this.watchSize(),this.listenForReconnect(),this.loadCloud(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.voicesSeq++,this.historySeq++,this.cloudSeq++,this.linksSeq++}willUpdate(e){if(this.hass){e.has("hass")&&(this.listenForReconnect(),this.cloudTTS===void 0&&e.get("hass")===void 0&&this.loadCloud()),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,rt(this.hass).then(o=>{this.ownList=o.owners},()=>{this.ownList=[]}));let s=Pt(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||e.has("ownerId"));s!==void 0&&this.openWatch(s)}this.followSave();let n=this.restoreAsk;n!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(s=>s.revision===n.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),wn(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let n of e){if(n.target!==this){this.measureTop(n.target);continue}let s=n.contentRect;Math.abs(s.width-this.hostWidth)>=1&&(this.hostWidth=s.width),Math.abs(s.height-this.hostHeight)>=1&&(this.hostHeight=s.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let n=this.renderRoot?.querySelector(".pe-top")??void 0;n!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=n,n!==void 0&&e.observe(n))}measureTop(e){let n=e.offsetHeight;n!==this.topHeight&&(this.topHeight=n,this.style.setProperty("--pe-top-h",`${n}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let e=this.watchId;if(e===void 0)return;let n=U(e)?.saveDone;if(n===void 0||n===this.followedSave)return;this.followedSave=n;let s=()=>this.saveEnded(e);n.then(s,s)}saveEnded(e){this.requestUpdate(),this.isConnected&&(e===this.watchId?(this.reloadPending=!1,this.load(e,!0)):this.flushPending())}openWatch(e,n=!1){e!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=e,this.note=void 0,this.unsupported=!1,this.voices=[],this.voicesState="loading",this.voicesSeq++,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),this.devicesOpen=!1,this.devicesNote=void 0,this.replaceAsk=void 0,this.freshAsk=void 0,this.otherVoice=new Map,this.linksFor=void 0,n=!1),this.startSubscription(e),this.load(e,n),this.loadVoices(e),this.loadLinks(e)}loadCloud(){let e=this.hass;if(!e)return;let n=++this.cloudSeq;ft(e).then(s=>{n===this.cloudSeq&&(this.cloudTTS=rn(s))},()=>{n===this.cloudSeq&&(this.cloudTTS=!1)})}async loadVoices(e){let n=this.hass;if(!n)return;let s=++this.voicesSeq;try{let o=await pt(n,e);if(s!==this.voicesSeq||e!==this.watchId)return;this.voices=An(o),this.voicesState="ready"}catch(o){if(s!==this.voicesSeq||e!==this.watchId)return;this.voicesState=Y(o)==="unknown_command"?"unsupported":"error"}}async load(e,n=!1){let s=this.hass;if(!s)return;if(n&&this.holdReload){this.reloadPending=!0;return}let o=++this.loadSeq;this.stopPolling(),n||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let r=await j(s,e,"voice");if(o!==this.loadSeq)return;if(n&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(r),this.loadError=void 0}catch(r){if(o!==this.loadSeq)return;Gn(r)?(this.unsupported=!0,this.loadError=void 0):n||(this.loadError=Fi(r)),this.restartDraft?.watchId===e&&(this.restartDraft=void 0)}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(e))}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(e){let n=this.watchId;this.record=e,n!==void 0&&e.revision<=0&&ze(n);let s=e.revision>0?E(e.document):void 0;if(n===void 0||s===void 0)return;let o=this.restartDraft;o!==void 0&&o.watchId===n&&e.revision>=o.revision&&(this.restartDraft=void 0,(U(n)?.dirty??!1)||ge(n));let r=qe(n,s,e.revision);r.replaced.length>0?this.note={kind:"warn",text:Ye(r.replaced)}:r.mergedIntoEdits&&(this.note={kind:"warn",text:"The voice settings changed somewhere else. Your edits are kept."}),L(s)!==this.linksFor&&this.loadLinks(n),this.requestUpdate()}async loadHistory(e){let n=this.hass;if(!n||this.historyState==="unsupported")return;let s=++this.historySeq;try{let o=await dt(n,e,"voice");if(s!==this.historySeq||e!==this.watchId)return;this.history=Array.isArray(o?.entries)?o.entries:[],this.historyState="ready"}catch(o){if(s!==this.historySeq||e!==this.watchId)return;this.historyState=Y(o)==="unknown_command"?"unsupported":"error"}}startSubscription(e){let n=this.hass;if(this.endSubscription(),!n)return;let s=++this.subscribeSeq;ut(n,e,o=>{s===this.subscribeSeq&&o.kind==="voice"&&o.revision!==(this.record?.revision??0)&&this.load(e,!0)}).then(o=>{s===this.subscribeSeq?this.unsubscribe=o:o().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let e=this.unsubscribe;this.unsubscribe=void 0,e?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||St(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},ws))}async poll(){this.pollTimer=void 0;let e=this.hass,n=this.watchId,s=this.record;if(!(!e||n===void 0||s===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let o=await j(e,n,"voice");if(n!==this.watchId||this.record!==s)return;o.revision===s.revision?this.record={...s,delivered_revision:o.delivered_revision,delivered_at:o.delivered_at,rejected_revision:o.rejected_revision,rejected_at:o.rejected_at,rejected_reason:o.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(o),this.loadHistory(n))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,n){let s=this.draft;if(!s||this.saving)return!1;let o=s.apply(e(s.document),this.scrubKey??n);return this.requestUpdate(),o}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let e=this.icons??zt,n=this.iconMemo;if(n!==void 0&&n.provider===e&&n.tick===this.iconsTick)return n.icons;let s=Bt(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:s},s}screen(){let e=this.watches.find(n=>n.owner_watch_id===this.watchId);return(Ve(e?.screen_size)??Se).screen}viewHost(){let e=this.draft,n=this.hass;if(e===void 0||n===void 0)return;let s=this;return{hass:n,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.stageScale,voices:this.voices,voicesState:this.voicesState,cloudTTS:this.cloudTTS,get document(){return e.document},get busy(){return s.saving},edit:(o,r)=>this.draft===e&&this.edit(o,r),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,n=this.watchId;this.endScrub();let s=this.draft;if(!e||n===void 0||!s||this.saving||!s.dirty)return;this.note=void 0;let o=s.revision<=0,r=[],a=oi(s,{save:(c,h)=>be(e,n,"voice",c,h).then(u=>(r=ke(u),u),u=>{throw Ui(u)}),fetch:async()=>{let c=await j(e,n,"voice").catch(h=>{throw Ui(h)});return{revision:c.revision,document:c.document}}});this.followedSave=s.saveDone,this.requestUpdate();let l=await a.catch(c=>({ok:!1,revision:s.revision,merged:!1,code:Y(c)??"unknown",message:Fi(c)}));if(this.saveEnded(n),n===this.watchId){let c=Vn(o,l.code,Si(l));this.note=l.ok?xe(c,r,"phrases"):c,l.ok&&this.loadLinks(n)}}startFresh(){let e=this.watchId;e===void 0||!ce(this.shownWatch())||!It(this.noRecordState())||(xn("voice",e),this.note=void 0,this.requestUpdate())}get linkDevices(){return Ot(this.owners.length>0?this.owners:this.ownList??[],!1)}deviceName(e){return this.linkDevices.find(n=>n.ownerId===e)?.name??"the other watch"}phraseHolders(){let e=this.watchId;return e===void 0?[]:Be(this.draft?.document,e,this.voicePlaces)}get linksOn(){return this.voicePlaces!==void 0&&(this.record?.revision??0)>0&&this.linkDevices.length>1}async loadLinks(e){let n=this.hass;if(!n)return;let s=++this.linksSeq,o=this.record!==void 0&&this.record.revision>0?E(this.record.document):void 0;this.linksFor=L(o);let r;try{r=await ct(n)}catch(c){s===this.linksSeq&&Y(c)==="unknown_command"&&(this.voicePlaces=void 0);return}if(s!==this.linksSeq||e!==this.watchId||(this.voicePlaces=ci(r),this.voicePlaces===void 0))return;let a=this.linkDevices.filter(c=>c.ownerId!==e),l=await Promise.all(a.map(async c=>{try{let h=await j(n,c.ownerId,"voice"),u=h.revision>0?E(h.document):void 0;return[c.ownerId,{facts:Rt(h),...u===void 0?{}:{document:u}}]}catch{return}}));s!==this.linksSeq||e!==this.watchId||(this.otherVoice=new Map(l.filter(c=>c!==void 0)))}waitingWatches(){let e=new Map([...this.otherVoice].map(([n,s])=>[n,s.facts]));return At(this.owners.length>0?this.owners:this.ownList??[],e)}openDevices(){this.topMenuOpen=!1,this.devicesNote=void 0,this.devicesOpen=!0,this.watchId!==void 0&&this.loadLinks(this.watchId),this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".vo-phrases-card .pe-dev-menu")?.scrollIntoView({block:"nearest"})})}closeDevices(){this.devicesOpen=!1,this.devicesNote=void 0}devicesBlocked(){if(this.saving)return ys;if(this.draft?.dirty??!1)return ks}async linkTo(e,n=!1){let s=this.hass,o=this.watchId;if(!s||o===void 0||e===o||this.linking||this.devicesBlocked()!==void 0)return;let r=this.deviceName(e);if(!n&&gi(this.otherVoice.get(e)?.document,L(this.draft?.document))){this.replaceAsk={watchId:o,target:e,name:r};return}this.linking=!0,this.devicesNote=void 0;try{if(await at(s,"voice",o,[ne],[e],n),o!==this.watchId)return;this.devicesNote={kind:"ok",text:[`Now on ${r} too.`,n?Ke:void 0].filter(a=>a!==void 0).join(" ")},this.load(o,!0),this.loadLinks(o)}catch(a){if(o!==this.watchId)return;!n&&Y(a)==="unit_taken"?this.replaceAsk={watchId:o,target:e,name:r}:this.devicesNote={kind:"err",text:`Not added. ${bi(a)}`}}finally{this.linking=!1}}async unlinkFrom(e){let n=this.hass,s=this.watchId;if(!n||s===void 0||e===s||this.linking||this.devicesBlocked()!==void 0)return;this.linking=!0,this.devicesNote=void 0;let o=await $i({read:a=>j(n,a,"voice"),save:(a,l,c)=>be(n,a,"voice",l,c)},e);if(this.linking=!1,s!==this.watchId)return;let r=this.deviceName(e);this.devicesNote=o.ok?{kind:"ok",text:`Unlinked ${r}. It keeps its copy of the phrases.`}:{kind:"err",text:`Not unlinked from ${r}: ${o.message}`},this.load(s,!0),this.loadLinks(s)}closeReplaceAsk(){this.renderRoot?.querySelector("dialog.ve-replace-ask")?.close(),this.replaceAsk=void 0}confirmReplace(){let e=this.replaceAsk;this.closeReplaceAsk(),e!==void 0&&e.watchId===this.watchId&&this.linkTo(e.target,!0)}startFreshPhrases(){let e=this.watchId,n=this.draft;if(e===void 0||n===void 0||this.saving)return;let s=xi(this.phraseHolders());if(s===void 0){this.applyFresh(!1);return}this.freshAsk={watchId:e,question:s.question,here:s.here,all:s.all}}applyFresh(e){this.edit(n=>Je(n,e))&&(this.note={kind:"ok",text:e?"Started fresh on this watch. Save to unlink it from the others. Undo brings the phrases back.":"Started fresh. Save to clear the phrases everywhere they are. Undo brings them back."})}closeFreshAsk(){this.renderRoot?.querySelector("dialog.ve-fresh-ask")?.close(),this.freshAsk=void 0}answerFresh(e){let n=this.freshAsk;this.closeFreshAsk(),n!==void 0&&n.watchId===this.watchId&&this.applyFresh(e)}phrasesLinks(){let e=this.watchId;if(e===void 0||!this.linksOn)return;let n=this.phraseHolders(),s=this.linkDevices,o=fi(n,e,s),r=vi(n,e,s),a=this.devicesBlocked();return{...o===void 0?{}:{badge:o},...r===void 0?{}:{badgeTitle:r},open:this.devicesOpen,onDevices:()=>this.devicesOpen?this.closeDevices():this.openDevices(),menu:this.devicesOpen?ei({name:ai,head:li,foot:hi,places:pi(s,this.draft?.document,e,this.voicePlaces,this.waitingWatches()),...a===void 0?{}:{blocked:a},busy:this.linking,...this.devicesNote===void 0?{}:{note:this.devicesNote},className:"at-card",colorOf:l=>this.colorOf(l),titleOf:ui,onToggle:l=>{l.on?this.unlinkFrom(l.device.ownerId):this.linkTo(l.device.ownerId)},onDone:()=>this.closeDevices()}):p}}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(e){let n=this.hass,s=this.watchId,o=this.record;if(!n||s===void 0||o===void 0||this.draft?.dirty)return;let r={entry:e,baseRevision:o.revision};this.restoreAsk=r,lt(n,s,"voice",e.revision).then(a=>{this.restoreAsk===r&&(this.restoreAsk={...r,summary:_s(a.document),links:this.restoreLinks(o.document,a.document)})},()=>{})}restoreLinks(e,n){let s=this.watchId;if(s===void 0)return[];let o=L(E(e)),r=L(E(n));return wi([{name:"phrases and defaults",holders:a=>(this.voicePlaces?.[a]?.owners??[]).filter(l=>l!==s).map(l=>this.deviceName(l)),...o===void 0?{}:{now:o},...r===void 0?{}:{restored:r}}],"watch")}async restore(){let e=this.hass,n=this.watchId,s=this.restoreAsk;if(!e||n===void 0||s===void 0||this.restoring)return;this.restoring=!0;let o;try{let r=await ht(e,n,"voice",s.entry.revision,s.baseRevision);o=xe({kind:"ok",text:kn(s.entry.updated_at)},ke(r),"phrases"),n===this.watchId?this.restartDraft={watchId:n,revision:r.revision}:(U(n)?.dirty??!1)||ge(n)}catch(r){let a=Y(r);a==="conflict"?o={kind:"warn",text:"Not restored. The voice settings changed somewhere else, so the newest copy is shown."}:a==="no_record"?o={kind:"warn",text:"Not restored. Home Assistant no longer holds voice settings for this watch."}:a==="not_found"?o={kind:"warn",text:"Not restored. That save is no longer kept."}:a==="unknown_command"?(this.historyState="unsupported",o={kind:"warn",text:"This version of the integration cannot restore voice settings. Update it to restore an earlier save."}):o={kind:"err",text:`Could not restore: ${Kt(r)}`}}finally{this.restoring=!1,this.restoreAsk===s&&this.closeAsk()}n===this.watchId&&(this.note=o,this.load(n,!0))}render(){let e=this.watches,n=this.draft;return d`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(n,e):p}
        ${this.note?d`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:p}
      </div>
      ${this.renderBody(e)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):this.replaceAsk?this.renderReplaceAsk(this.replaceAsk):this.freshAsk?this.renderFreshAsk(this.freshAsk):p}
    `}renderReplaceAsk(e){return d`<dialog class="pe-ask ve-replace-ask" aria-labelledby="ve-replace-title"
      @close=${()=>{this.replaceAsk=void 0}}>
      <h3 id="ve-replace-title">${mi(e.name)}</h3>
      <p class="pe-muted">Its phrases and defaults become these, linked: an edit on one watch then shows on both. ${Ke}</p>
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
    </dialog>`}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=Ni}renderTopBar(e,n){let s=e!==void 0&&!this.unsupported,o=s&&e.dirty;return d`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch voice">
      ${this.haMenu?d`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${y("menu")}</button>`:p}
      ${this.shellOwnsWatch?p:d`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():Zn(void 0,!1)}>${y("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${this.shellOwnsWatch?p:this.renderWatchPicker(n)}
      ${this.barHost!==void 0&&s?Lt({newWatch:this.newWatch,dirty:o,saved:Ee(this.record)}):p}
      ${this.renderSyncPill(s?e:void 0)}
      ${this.renderTopMenu(s?e:void 0)}
      ${s?d`<button class="primary save ${o?"dirty":""}" ?disabled=${!o||this.saving}
          title=${o?`Save (${et}S). A save reaches the watch the next time it checks.`:`Nothing to save (${et}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?p:d`<span class="tb-saved" title=${o?"Unsaved changes":""}>${Ee(this.record)}</span>
        ${_n(Sn({newWatch:this.newWatch,dirty:o,saving:this.saving}))}`}`:p}
      ${this.barActions}
    </div>`}renderSyncPill(e){let n=this.record;if(n===void 0||n.revision<=0||this.unsupported)return p;let s=e===void 0?{size:0,limit:1}:We(e.document),o=Oe({record:n,size:s.size,limit:s.limit,noun:"voice settings",historyState:this.historyState});return hn(o,e?.dirty??!1)}noRecordState(e=this.watches){return Tt(this.shownWatch(e))}shownWatch(e=this.watches){return e.find(n=>n.owner_watch_id===this.watchId)}opensReady(e=this.watches){return $n(this.noRecordState(e),"voice",this.watchId)}canStartFresh(){return this.watchId!==void 0&&this.newWatch&&!this.opensReady()&&ce(this.shownWatch())}renderTopMenu(e){let n=this.canStartFresh();if(e===void 0&&!n)return p;let s=this.topMenuOpen,o=a=>()=>{this.topMenuOpen=!1,a()},r=e!==void 0&&!this.newWatch;return d`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${s?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!s}}>···</button>
      ${s?d`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${e?d`<button class="row" role="menuitem" ?disabled=${!e.dirty||this.saving}
          title=${this.newWatch?"Go back to the defaults. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${o(()=>this.discard())}>Discard edits</button>`:p}
        ${r&&this.linksOn?d`<button class="row ve-dev-item" role="menuitem"
          title="Pick the watches these phrases and defaults are on"
          @click=${o(()=>this.openDevices())}>Devices…</button>`:p}
        ${r?d`<button class="row" role="menuitem" ?disabled=${this.saving||ki(e.document)}
          title="No phrases and the app's defaults again. The watch voice and Silent Mode setting stay. Undo brings the phrases back."
          @click=${o(()=>this.startFreshPhrases())}>Start fresh</button>`:p}
        ${e&&(this.record?.revision??0)>0?un(o(()=>{this.rawCopied=!1,this.rawOpen=!0})):p}
        ${n?d`<button class="row" role="menuitem"
          @click=${o(()=>this.startFresh())}>${ye}</button>`:p}
      </div>`:p}
    </span>`}colorOf(e){return nn(tn(this.owners.length>0?this.owners:this.ownList??[]),e)}renderWatchPicker(e){if(e.length<2)return p;let n=e.find(r=>r.owner_watch_id===this.watchId),s=this.watchMenuOpen,o=r=>{let a=r===void 0?void 0:this.colorOf(r);return d`<span class="pe-chip-glyph" style=${a?`--pe-person: ${a}`:p} aria-hidden="true">${y("watch")}</span>`};return d`<span class="picker ve-watch-picker">
      <button type="button" class="tb-browse ve-watch-btn" aria-haspopup="menu" aria-expanded=${s?"true":"false"}
        title="Choose the watch whose voice settings are shown" @click=${()=>{this.watchMenuOpen=!s}}>
        ${o(n?.owner_watch_id)}<span class="tb-browse-l">${n?re(n,e):"Choose a watch"}</span>
        <span class="ve-caret" aria-hidden="true">${y("chevron")}</span>
      </button>
      ${s?d`<div class="pop-menu ve-watch-menu" role="menu" aria-label="Watches">
        ${e.map(r=>{let a=r.owner_watch_id===this.watchId;return d`<button type="button" class="row ve-watch-row" role="menuitemradio" aria-checked=${a?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,a||this.openWatch(r.owner_watch_id)}}>
            ${o(r.owner_watch_id)}<span class="ve-watch-name">${re(r,e)}</span>
            <span class="ve-watch-check" aria-hidden="true">${a?y("check"):p}</span>
          </button>`})}
      </div>`:p}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=Ni?this.columns:Nt(this.hostWidth-bs,this.columns,tt)}renderGutter(e){return d`<div class="gutter ${e}" role="separator" aria-orientation="vertical"
      aria-label=${e==="left"?"Resize the voice and phrases column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${n=>{let s=this.fittedColumns();Ut(n,{side:e,base:e==="left"?s.left:s.right,limits:tt,onWidth:o=>{this.columns={...this.columns,[e]:o}},onEnd:()=>$e(it,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[e]:nt[e]},$e(it,this.columns)}}></div>`}get stageScale(){return this.zoom??Pe(this.narrow||this.stacked)}renderStage(e,n){let s=n.find(u=>u.owner_watch_id===this.watchId),r=Ve(s?.screen_size)??Se,a=[...Wi(e),r.label],l=this.draft,c=this.stageScale,h=Pe(this.narrow||this.stacked);return d`<div class="card canvas-card lit ve-canvas" aria-label="Pick from List">
      <div class="cv-head">
        <span class="cv-title">Pick from List</span>
        ${s!==void 0?d`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${re(s,n)}</span></span>`:p}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${a.join(" \xB7 ")}><span class="fam">${a.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!l?.canUndo} title=${`Undo (${et}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${y("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!l?.canRedo} title=${qi?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${y("redo")}</button>
        </span>
      </div>
      <div class="stage-area ve-stage-area">
        <div class="stage-tools" role="toolbar" aria-label="Stage tools">
          <span class="tb-zoom" role="group" aria-label="Zoom">
            <button class="tb icon" ?disabled=${c<=Ce(c)} aria-label="Zoom out" title="Zoom out"
              @click=${()=>{this.zoom=Ce(c)}}>−</button>
            <button class="tb pct" aria-label=${`Zoom ${X(c)}. Back to fit`}
              title=${`The watch at ${X(c)} of its own points. Click to fit it again (${X(h)}).`}
              @click=${()=>{this.zoom=void 0}}>${X(c)}</button>
            <button class="tb icon" ?disabled=${c>=De(c)} aria-label="Zoom in" title="Zoom in"
              @click=${()=>{this.zoom=De(c)}}>+</button>
          </span>
        </div>
        <div class="ve-stage-body">${Ai(e)}</div>
        <div class="under"><span class="tail">${_i}</span></div>
      </div>
    </div>`}renderBody(e){if(e.length===0){let c=this.owners.length===0&&this.ownList===void 0;return d`<div class="pe-empty">${c?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Devices tab."}</div>`}if(this.unsupported)return d`<div class="pe-empty"><b>${Ue}</b></div>`;if(this.loading)return d`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let c=this.watchId;return d`<div class="pe-empty">
        <span>Could not read this watch's voice settings: ${this.loadError}</span>
        ${c===void 0?p:d`<button class="pe-btn" @click=${()=>{this.load(c)}}>Try again</button>`}
      </div>`}let n=this.record;if(n===void 0)return d`<div class="pe-empty">Loading…</div>`;let s=this.draft;if(s===void 0&&n.revision>0)return d`<div class="pe-empty"><b>${Ue}</b></div>`;if(s===void 0){let c=this.watchId===void 0?void 0:U(this.watchId),h=this.watchId,u=this.shownWatch();return d`<div class="pe-empty"><b>${Jn}</b><span>${ae(u?.app_version)}</span>
        ${ce(u)?d`<button class="link start-fresh" @click=${()=>this.startFresh()}>${ye}</button>`:p}
        ${c?.dirty&&h!==void 0?d`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when voice settings are here again.</span>
          <button class="pe-btn" @click=${()=>{ge(h),this.requestUpdate()}}>Discard the kept edits</button>`:p}
      </div>`}let o=this.viewHost();if(o===void 0)return d`<div class="pe-empty">Loading…</div>`;let r=this.fittedColumns(),a=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"",l=n.revision<=0;return d`${l&&this.barHost===void 0?Tn():p}
    <div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${r.left}px;--wa-right:${r.right}px;${a}`}>
      <div class="column left">
        ${Ei(o)}
        ${Ri(o,this.phrasesLinks())}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(o,e)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${Hi(o)}
      </div>
    </div>
    ${l?p:this.renderFoot(n,s.document,s.dirty)}`}renderFoot(e,n,s){let o=We(n),r=Oe({record:e,size:o.size,limit:o.limit,noun:"voice settings",historyState:this.historyState}),a=this.watchId;return d`${vn({status:r,historyState:this.historyState,historyOpen:this.historyOpen,onHistory:()=>{this.historyOpen=!0}})}
    ${this.historyOpen?gn({noun:"voice settings",record:e,entries:this.history,historyState:this.historyState,dirty:s,restoring:this.restoring,onRetry:()=>{a!==void 0&&(this.historyState="loading",this.loadHistory(a))},onRestore:l=>{this.historyOpen=!1,this.askRestore(l)},onClosed:()=>{this.historyOpen=!1}}):p}
    ${this.rawOpen?mn({noun:"voice settings",document:n,revision:e.revision,dirty:s,copied:this.rawCopied,onCopy:l=>{bn(l).then(c=>{this.rawCopied=c})},onClosed:()=>{this.rawOpen=!1}}):p}`}renderRestoreAsk(e){let n=this.record,s=$s(e.entry.updated_at);return d`<dialog class="pe-ask" aria-labelledby="ve-ask-title"
      @cancel=${o=>{this.restoring&&o.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="ve-ask-title" title=${`Revision ${e.entry.revision}`}>${pn(e.entry)}</h3>
      <p>${Ss(e.entry.updated_by)}${s?` ${s}`:""}, ${xs(e.entry.size)}.</p>
      ${e.summary?d`<p class="pe-muted">${e.summary}</p>`:p}
      <p>It is saved again as the newest save. The copy shown now stays in the earlier saves.</p>
      ${(e.links??[]).map(o=>d`<p>${o}</p>`)}
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[Ct,gt,mt,wt,bt,yt,kt,xt,on,In,z`
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
  `,Mi,ti,yn,Mt]}};g([_({attribute:!1})],v.prototype,"hass",2),g([_({attribute:!1})],v.prototype,"owners",2),g([_({attribute:!1})],v.prototype,"ownerId",2),g([_({type:Boolean,reflect:!0})],v.prototype,"narrow",2),g([_({attribute:!1})],v.prototype,"icons",2),g([_({attribute:!1})],v.prototype,"iconsTick",2),g([_({attribute:!1})],v.prototype,"haMenu",2),g([_({attribute:!1})],v.prototype,"onHaMenu",2),g([_({attribute:!1})],v.prototype,"onBack",2),g([_({attribute:!1})],v.prototype,"barActions",2),g([_({attribute:!1})],v.prototype,"shellOwnsWatch",2),g([_({attribute:!1})],v.prototype,"barHost",2),g([w()],v.prototype,"watchId",2),g([w()],v.prototype,"record",2),g([w()],v.prototype,"unsupported",2),g([w()],v.prototype,"voices",2),g([w()],v.prototype,"voicesState",2),g([w()],v.prototype,"cloudTTS",2),g([w()],v.prototype,"loading",2),g([w()],v.prototype,"loadError",2),g([w()],v.prototype,"history",2),g([w()],v.prototype,"historyState",2),g([w()],v.prototype,"note",2),g([w()],v.prototype,"restoreAsk",2),g([w()],v.prototype,"restoring",2),g([w()],v.prototype,"historyOpen",2),g([w()],v.prototype,"rawOpen",2),g([w()],v.prototype,"rawCopied",2),g([w()],v.prototype,"ownList",2),g([w()],v.prototype,"topMenuOpen",2),g([w()],v.prototype,"watchMenuOpen",2),g([w()],v.prototype,"voicePlaces",2),g([w()],v.prototype,"otherVoice",2),g([w()],v.prototype,"devicesOpen",2),g([w()],v.prototype,"linking",2),g([w()],v.prototype,"devicesNote",2),g([w()],v.prototype,"replaceAsk",2),g([w()],v.prototype,"freshAsk",2),g([w()],v.prototype,"zoom",2),g([w()],v.prototype,"columns",2),g([w()],v.prototype,"hostWidth",2),g([w()],v.prototype,"hostHeight",2);customElements.get("wa-voice-editor")||customElements.define("wa-voice-editor",v);export{it as VE_COLUMNS_KEY,v as WaVoiceEditor,_s as watchVoiceSummary};
