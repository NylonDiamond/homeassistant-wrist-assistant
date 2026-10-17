import{A as Z,B as Hn,C as Wn,D as Ln,E as Mn,F as Nn,G as Fn,H as he,I as Un,J as qn,K as jn,L as Le,M as zn,N as Bn,a as de,b as Ce,c as De,d as H,e as X,f as Oe,g as Ee,h as Re,i as M,j as Vn,k as Tn,l as _n,m as In,n as Pn,o as Ae,p as Cn,q as Dn,r as On,s as He,t as E,u as N,v as En,w as le,x as Rn,y as An,z as We}from"./chunk-L4CHD3B7.js";import{A as fn,C as vn,b as ln,i as hn,l as un,u as pn}from"./chunk-Z7YTC7Z2.js";import{p as Ve,q as G,r as Te,s as _e,w as an,x as Ie,y as cn,z as dn}from"./chunk-PEI2F5V4.js";import{b as Ot,d as Et,e as we,f as Rt}from"./chunk-ZOJGMATP.js";import{a as wn,b as bn,c as yn,d as kn,e as xn,f as $n,g as Sn}from"./chunk-6ETDLFV5.js";import{T as Pe,U as gn,W as ce,c as mn}from"./chunk-QKO2AN2A.js";import{a as $e,b as Se,c as Bt,d as Kt,e as Jt,f as Yt,g as Gt,h as Xt,i as Zt}from"./chunk-5KH3AD3A.js";import{d as nn}from"./chunk-AMGXZUWS.js";import{a as jt,b as zt,d as sn,e as on}from"./chunk-4C3X4OMP.js";import{c as Qt,d as en,f as tn}from"./chunk-QUDR47OK.js";import{Hd as Kn,Jd as Jn,Md as Yn,Qb as Wt,Rb as Lt,Sb as re,Ub as ae,Vb as Mt,Wb as Nt,X as ye,Yb as xe,Zb as Ft,aa as ke,cb as Ht,ec as Ut,gc as qt,ua as At,z as be}from"./chunk-B2GPRRUP.js";import{a as Tt,b as _t,c as It}from"./chunk-7E7TQLFM.js";import{d as j,h as ut,j as pt,k as ft,l as vt,m as mt,n as gt,o as wt,p as bt,y as yt}from"./chunk-WDZJ6RME.js";import"./chunk-4NI3O7TX.js";import"./chunk-UPANJPAF.js";import{Q as V,R as rn,j as D}from"./chunk-ESIOP3D4.js";import{a as Pt,b as C,c as Ct,d as Dt}from"./chunk-NKLOQSX6.js";import{c as ht}from"./chunk-ZKYND2IQ.js";import{Eg as q,Gg as me,Jg as it,Lg as st,Mg as ot,Ng as rt,Og as at,Pg as ct,Xg as dt,b as se,d,eh as lt,g as m,ig as nt,j as tt,k as _,l as w,mh as k}from"./chunk-VWIMYR2L.js";import{B as kt,Q as xt,Sa as Vt,U as oe,X as $t,Y,Z as ge,_ as St}from"./chunk-Q6MTLD6E.js";import{a as v}from"./chunk-LO2NM3CE.js";var I="phrases";function R(t,i){return t!=null&&Object.hasOwn(t,i)?t[i]:void 0}function z(t){if(!Array.isArray(t))return;let i=new Set,e=[];for(let n of t){if(!D(n)||typeof n.id!="string"||n.id==="")return;let s=n.id.toUpperCase();if(i.has(s))return;i.add(s),e.push([s,n])}return e}function Hi(t,i,e){let n=t===null?void 0:t,s=i===null?void 0:i,o=e===null?void 0:e,r=n===void 0?[]:z(n),a=s===void 0?void 0:z(s),l=o===void 0?void 0:z(o);if(r===void 0||a===void 0||l===void 0)return V(s,n)?o:s;let c=new Map(r),h=new Map(a),u=new Map(l),y=(b,$)=>{let T=c.get(b);return T===void 0||!V($,T)},g=(b,$,T)=>y(b,$)?$:T,S=(b,$)=>c.has(b)&&!y(b,$)?void 0:$,x=a.map(([b])=>b).filter(b=>c.has(b)),A=r.map(([b])=>b).filter(b=>h.has(b)),P=x.length!==A.length||x.some((b,$)=>b!==A[$]),ve=P?a:l,p=P?l:a,L=P,O=[];for(let[b,$]of ve){let T=(L?u:h).get(b);if(T!==void 0)O.push(L?g(b,$,T):g(b,T,$));else{let et=S(b,$);et!==void 0&&O.push(et)}}for(let[b,$]of p){if((L?h:u).has(b))continue;let T=S(b,$);T!==void 0&&O.push(T)}let ie=b=>Array.isArray(b)&&b.length===O.length&&O.every(($,T)=>$===b[T]);return ie(o)?o:ie(s)?s:O}function Gn(t,i,e){let n=rn(t,i,e),s=Hi(t==null?e[I]:R(t,I),R(i,I),R(e,I)),o=R(n,I);if(s===o)return n;if(s===void 0){if(!Object.hasOwn(n,I))return n;let{[I]:r,...a}=n;return a}return n===e||n===i?{...n,[I]:s}:(n[I]=s,n)}function Xn(t,i,e){let n=new Set([...Object.keys(i),...Object.keys(e)]),s=[];for(let o of n){if(o===I){let h=new Map(z(R(t,I))??[]),u=z(R(i,I)),y=new Map(z(R(e,I))??[]);if(u===void 0)continue;u.some(([S,x])=>{let A=y.get(S),P=h.get(S);return A!==void 0&&!V(x,A)&&(P===void 0||!V(x,P)&&!V(A,P))})&&s.push(o);continue}let r=R(t,o),a=R(i,o),l=R(e,o),c=h=>t==null||!V(h,r);c(a)&&c(l)&&!V(a,l)&&s.push(o)}return s.sort()}var Zn=100,Wi=3,ue=class{constructor(i,e){this._undo=[];this._redo=[];this._replaced=[];this._base=i,this._revision=e,this._document=i}get base(){return this._base}get revision(){return this._revision}get document(){return this._document}get canUndo(){return this._undo.length>0}get canRedo(){return this._redo.length>0}get replaced(){return this._replaced}get dirty(){let i=this._dirty;if(i!==void 0&&i.document===this._document&&i.base===this._base)return i.value;let e=this._document!==this._base&&!V(this._document,this._base);return this._dirty={document:this._document,base:this._base,value:e},e}apply(i,e){if(i===this._document||V(i,this._document))return(e===void 0||e!==this._coalesceKey)&&(this._coalesceKey=void 0),!1;if(e!==void 0&&e===this._coalesceKey&&this._undo.length>0){let n=this._undo[this._undo.length-1];return V(i,n)?(this._undo.pop(),this._document=n,this._coalesceKey=void 0):this._document=i,this._redo=[],!0}return this.pushUndo(this._document),this._redo=[],this._document=i,this._coalesceKey=e,!0}endCoalesce(){this._coalesceKey=void 0}undo(){this._coalesceKey=void 0;let i=this._undo.pop();return i===void 0?!1:(this._redo.push(this._document),this._document=i,!0)}redo(){this._coalesceKey=void 0;let i=this._redo.pop();return i===void 0?!1:(this.pushUndo(this._document),this._document=i,!0)}discard(){return this._coalesceKey=void 0,this.apply(this._base)}rebase(i,e){return e<this._revision?(this._replaced=[],!1):this.mergeOnto(i,e)}restart(i,e){return this.mergeOnto(i,e)}mergeOnto(i,e){this._coalesceKey=void 0;let n=this._base;this._replaced=this._document===n?[]:Xn(n,this._document,i);let s=new Map,o=u=>{let y=s.get(u);if(y!==void 0)return y;let g=u===n?i:Gn(n,u,i);return g!==i&&V(g,i)&&(g=i),s.set(u,g),g},r=this._document,a=[...this._undo,this._document,...this._redo.slice().reverse()].map(o),l=this._undo.length,c=[],h=0;return a.forEach((u,y)=>{let g=c[c.length-1];g!==void 0&&(g===u||V(g,u))?y===l&&(c[c.length-1]=u):c.push(u),y===l&&(h=c.length-1)}),this._undo=c.slice(0,h),this._document=c[h],this._redo=c.slice(h+1).reverse(),this._base=i,this._revision=e,this._document!==r&&!V(this._document,r)}saved(i,e){e<this._revision||(this._coalesceKey=void 0,this._base=i,this._revision=e)}get saving(){return Q.has(this)}get saveDone(){return Q.get(this)}pushUndo(i){this._undo.push(i),this._undo.length>Zn&&this._undo.splice(0,this._undo.length-Zn)}},Q=new WeakMap;function Qn(t,i){if(Q.has(t))return Promise.resolve({ok:!1,revision:t.revision,merged:!1,code:"busy",message:"These voice settings are being saved already."});let e=Li(t,i).finally(()=>Q.delete(t));return Q.set(t,e),e}async function Li(t,i){let e=!1,n=new Set,s=()=>n.size===0?{}:{replaced:[...n].sort()},o=(r,a,l)=>({ok:!1,revision:t.revision,merged:e,code:r,message:a,...l===void 0?{}:{problems:l}});for(let r=1;;r++){let a=t.document,l=qn(a);if(l.length>0)return o("invalid",l.join(" "),l);let c;try{({revision:c}=await i.save(t.revision,a))}catch(h){let{code:u="unknown",message:y}=C(h);if(u!=="conflict"||r>=Wi)return o(u,y);let g;try{g=await i.fetch()}catch(S){let x=C(S);return o(x.code??"unknown",x.message)}if(!D(g)||!(g.revision>0)||!D(g.document))return o("no_record","Home Assistant holds no voice settings for this watch.");g.revision<t.revision?t.restart(g.document,g.revision):t.rebase(g.document,g.revision);for(let S of t.replaced)n.add(S);if(e=!0,!t.dirty)return{ok:!0,revision:t.revision,merged:e,alreadySaved:!0};continue}return t.saved(a,c),{ok:!0,revision:t.revision,merged:e,...s()}}}var W=new Map;function F(t){return W.get(t)}function Me(t,i,e){let n=W.get(t);if(n!==void 0&&e<=0)return{draft:n,mergedIntoEdits:!1,replaced:[]};if(n===void 0||e<n.revision&&!n.dirty){let r=new ue(i,e);return W.set(t,r),{draft:r,mergedIntoEdits:!1,replaced:[]}}if(e===n.revision)return{draft:n,mergedIntoEdits:!1,replaced:[]};let s=n.dirty,o=e<n.revision?n.restart(i,e):n.rebase(i,e);return{draft:n,mergedIntoEdits:s&&o,replaced:s?n.replaced:[]}}function Ne(t){let i=W.get(t);if(i===void 0){let e=new ue(X(),0);return W.set(t,e),e}return i.revision>0&&!i.saving&&i.restart(X(),0),i}function pe(t){W.delete(t)}function Fe(){for(let t of W.values())if(t.dirty)return!0;return!1}function ei(){W.clear()}var fe="linkIds",ee="phrases",Mi=["defaultAssistAgentId","defaultSpeakers","defaultTTSEngine","phrases"];var ti="Phrases and defaults";function B(t){let i=t?.[fe],e=D(i)?i[ee]:void 0;return typeof e=="string"&&e!==""?e:void 0}function ni(t){let i=D(t)?t.voice:void 0;if(!D(i))return;let e={};for(let[n,s]of Object.entries(i))!D(s)||typeof s.unit!="string"||!Array.isArray(s.owners)||(e[n]={unit:s.unit,owners:s.owners.filter(o=>typeof o=="string")});return e}function Ue(t,i,e){let n=B(t),s=n===void 0?[]:e?.[n]?.owners??[];return[i,...s.filter(o=>o!==i)]}var Ni="These are this watch's phrases. Switch off another watch to unlink it.",Fi=`${Y} Phrases can go on this watch after that.`,Ui="waiting for iPhone",ii="Phrases and defaults are on",si="On means the watch has these phrases and defaults. An edit on one watch shows on all of them. Each watch keeps its own watch voice and Silent Mode setting.";function oi(t){let i=t.device.name;return t.on?`Unlink ${i}. It keeps a copy of the phrases as they are now.`:`Put them on ${i}. An edit on one watch then shows on both.`}function ri(t,i,e,n,s=new Set){let o=new Set(Ue(i,e,n));return t.filter(r=>r.kind==="watch").map(r=>{let a=r.ownerId===e,l=o.has(r.ownerId);return a?{device:r,on:!0,here:!0,stuck:Ni}:!l&&s.has(r.ownerId)?{device:r,on:l,here:!1,stuck:Fi,tag:Ui}:{device:r,on:l,here:!1}})}function ai(t,i,e){let n=t.filter(s=>s!==i);if(n.length!==0){if(n.length===1){let s=e.find(o=>o.ownerId===n[0])?.name;return s===void 0?"On 2 watches":`Also on ${s}`}return`On ${t.length} watches`}}function ci(t,i,e){let n=t.filter(o=>o!==i);if(n.length===0)return;let s=n.map(o=>e.find(r=>r.ownerId===o)?.name??"another watch");return`Also on ${pn(s)}. An edit here shows there too.`}function di(t,i){if(t===void 0)return!1;let e=B(t);return e!==void 0&&e===i?!1:e!==void 0||E(t).length>0}function li(t){return`Replace the phrases on ${t}? Its own are lost.`}var qe="Its watch voice and Silent Mode setting stay as they were.";function hi(t){let{code:i,message:e}=C(t);switch(i){case"unknown_device":return"That watch is not paired with this Home Assistant any more.";case"not_found":return"This watch's voice settings are not saved yet. Save first, then try again.";case"unit_taken":return"That watch has phrases of its own.";case"not_for_iphone":return"An iPhone keeps no phrases.";case"awaiting_move":return`${Y} Try again after that.`;case"unknown_command":return"This version of the integration cannot share phrases between watches. Update it first.";default:return e}}function ui(t){let i=t[fe];if(!D(i)||!Object.hasOwn(i,ee))return t;let{[ee]:e,...n}=i;return Object.keys(n).length===0?Re(t,fe):Ee(t,fe,n)}function je(t,i=!1){let e=X(),n=t;for(let s of Mi)n=Object.hasOwn(e,s)?Ee(n,s,e[s]):Re(n,s);return i?ui(n):n}function pi(t){return je(t)===t}function fi(t){if(!(t.length<2))return{question:`These phrases and defaults are on ${t.length} watches.`,here:"Here only",all:`On all ${t.length} watches`,count:t.length}}var qi=3;async function vi(t,i){for(let e=1;;e++){let n;try{n=await t.read(i)}catch(r){let{code:a="unknown",message:l}=C(r);return{ok:!1,code:a,message:l}}let s=n.revision>0?H(n.document):void 0;if(s===void 0)return{ok:!0,unlinked:!1};let o=ui(s);if(o===s)return{ok:!0,unlinked:!1};try{return await t.save(i,n.revision,o),{ok:!0,unlinked:!0}}catch(r){let{code:a="unknown",message:l}=C(r);if(a!=="conflict"||e>=qi)return{ok:!1,code:a,message:l}}}}var ji={defaultAssistAgentId:"the conversation agent",defaultTTSEngine:"the text to speech engine",defaultSpeakers:"the speakers",phrases:"the phrases",watchSpeakReplyInSilentMode:"Speak even in Silent Mode",watchSpeechVoiceIdentifier:"the watch voice"};function zi(t){return ji[t]??"a setting this panel does not show"}function ze(t){if(t.length===0)return"";let i=[...new Set(t.map(zi))];return`Another save also changed ${i.length===1?i[0]:`${i.slice(0,-1).join(", ")} and ${i[i.length-1]}`}. ${i.length===1?"Your version replaced it.":"Your versions replaced them."}`}function mi(t){if(t.ok){if(t.alreadySaved===!0)return{kind:"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${t.revision}.`};let e=t.replaced??[];return e.length>0?{kind:"warn",text:`Saved. ${ze(e)}`}:t.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let i=(t.message??"").trim();switch(t.code){case"conflict":return{kind:"warn",text:"Not saved. The voice settings kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds voice settings for this watch. Your edits are kept, so save again."};case"invalid":{let e=t.problems??[];return e.length>0?{kind:"err",text:`Not saved. ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the voice settings${i===""?".":`: ${i}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${Pt}`};case"busy":return{kind:"warn",text:"Already saving these voice settings. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the voice settings just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${i===""?".":`: ${i}`}`}}}var gi=[["defaults","Defaults"],["watch","On the watch"]],wi={defaults:"What Assist and Speak use when a tile, a slot or a phrase picks nothing of its own.",watch:"How the watch itself speaks a reply."},Bi="The voice defaults, the phrase library and the watch's own speech. A save reaches the watch the next time it checks.",bi="Pick from List shows these phrases on the watch. Tap one to edit it.",Ki={defaults:{color:j.content,icon:"content"},watch:{color:j.content,icon:"watch"},phrase:{color:j.content,icon:"text"},look:{color:j.look,icon:"look"},speech:{color:j.content,icon:"content"}},Ji="#ab47bc",ne="voice-editor",yi=44,ki=22;function U(t,i){let e=t.states[i]?.attributes?.friendly_name;return typeof e=="string"&&e.trim()!==""?e:i}function Yi(t,i){let e=i.indexOf(".");return{entityId:i,displayName:i===""?"":U(t,i),domain:e>0?i.slice(0,e):""}}function xi(t,i,e,n){return t.icons.render(i,e,n)??d`<span class="vo-glyph-dot" style=${`background:${n}`}></span>`}function Be(t){if(typeof t!="string"||t==="")return{fill:"#D88CC4",ink:"#D88CC4"};if(t.toUpperCase()==="#RAINBOW")return{fill:"conic-gradient(#FF3B30, #FF9500, #FFCC00, #34C759, #007AFF, #AF52DE, #FF3B30)",ink:"#FF9500"};if(t.toUpperCase().startsWith("GRADIENT|")){let i=t.split("|").slice(1).filter(e=>/^#[0-9a-fA-F]{6}$/.test(e));if(i.length>=2)return{fill:`linear-gradient(135deg, ${i.join(", ")})`,ink:i[0]};if(i.length===1)return{fill:i[0],ink:i[0]}}return{fill:t,ink:t}}function $i(t,i){return an(t.uiState,ne,i)}function Gi(t,i){Ie(t.uiState,ne,i,!$i(t,i)),t.requestUpdate()}function te(t,i,e,n,s={}){let o=$i(t,i),r=Ki[i];return bt({color:r.color,icon:k(r.icon),title:e,open:o,onToggle:()=>Gi(t,i),...s.summary===void 0||s.summary===""?{}:{summary:s.summary},dot:s.dot===!0,id:`${ne}:${i}`},o?n:d``)}var Ke="vo:pick";function K(t){let i=t.uiState.get(Ke);if(typeof i=="string"&&i.startsWith("phrase:")){let e=En(t.document,i.slice(7));if(e!==void 0)return{phrase:e}}return{section:i==="watch"?"watch":"defaults"}}function Je(t,i){t.uiState.set(Ke,i),t.requestUpdate()}function Ye(t,i){t.uiState.set(Ke,`phrase:${i}`),t.requestUpdate()}function Si(t){return"phrase"in K(t)?(Je(t,"defaults"),!0):!1}function Xi(t){let i;t.edit(e=>{let n=An(e);return i=n.id,n.document}),i!==void 0&&(Ie(t.uiState,ne,"phrase",!0),Ye(t,i))}function Zi(t,i){if(i==="defaults"){let s=M(t.document);return s.speakers.length===0?"No speakers":s.speakers.map(r=>U(t.hass,r)).join(", ")}let e=Ae(t.document),n=e===void 0?void 0:t.voices.find(s=>s.id===e);return e===void 0?"System voice":n!==void 0?He(n):e}function Vi(t){let i=K(t),e="section"in i?i.section:void 0;return d`<section class="card lc vo-voice-card" aria-label="Voice"
    style=${`--c: var(--wa-lc-pages, #26a69a); --thumb-w: ${yi}px; --thumb-h: ${ki}px`}>
    <div class="lc-head">
      <span class="swatch">${Yn()}</span><span class="lc-title">Voice</span>
      <span class="lc-sub" title=${Bi}>for the watch</span>
    </div>
    <div class="layers vo-section-list" role="list">
      ${gi.map(([n,s])=>{let o=n===e,r=()=>Je(t,n);return d`<div class="layer vo-section-row ${o?"hl":""}" data-section=${n} role="listitem" tabindex="0"
          aria-current=${o?"true":"false"} aria-label=${s} title=${wi[n]}
          @click=${r}
          @keydown=${a=>{a.target!==a.currentTarget||a.key!=="Enter"&&a.key!==" "||(a.preventDefault(),r())}}>
          <span class="grip" aria-hidden="true"></span>
          <span class="thumb vo-thumb" aria-hidden="true">${k(n==="watch"?"watch":"content")}</span>
          <span class="name"><b><span class="nm-t">${s}</span></b><small>${Zi(t,n)}</small></span>
          <span class="right"></span>
        </div>`})}
    </div>
  </section>`}function Qi(t,i){let e=Be(i.color),n=typeof i.icon=="string"&&i.icon!==""?i.icon:"speaker.wave.2";return d`<span class="thumb vo-thumb" style=${`--c:${e.ink}`} aria-hidden="true"><span class="vo-thumb-glyph">${xi(t,n,14,e.ink)}</span></span>`}function es(t){let i=he(t);return i.length>0?`Needs a ${i.join(" and a ")}`:typeof t.message=="string"?t.message:""}function ts(t,i,e,n,s){let o=N(i),r=s!==void 0&&N(s).toUpperCase()===o.toUpperCase(),a=le(i),l=es(i),c=he(i).length>0,h=()=>Ye(t,o);return d`<div class="layer vo-phrase-row ${r?"hl":""}" data-phrase=${o} role="listitem" tabindex="0"
    aria-current=${r?"true":"false"} aria-label=${a} title=${`${a} \xB7 ${l}`}
    @click=${u=>{u.target instanceof Element&&u.target.closest("button")||h()}}
    @keydown=${u=>{u.target!==u.currentTarget||u.key!=="Enter"&&u.key!==" "||(u.preventDefault(),h())}}>
    <span class="grip" aria-hidden="true"></span>
    ${Qi(t,i)}
    <span class="name"><b><span class="nm-t">${a}</span></b><small class=${c?"vo-needs":""}>${l}</small></span>
    <span class="right">
      <span class="acts">
        <button type="button" class="icon" ?disabled=${t.busy||e===0} title="Move up" aria-label=${`Move ${a} up`}
          @click=${()=>t.edit(u=>Z(u,o,e-1))}>${k("up")}</button>
        <button type="button" class="icon" ?disabled=${t.busy||e===n-1} title="Move down" aria-label=${`Move ${a} down`}
          @click=${()=>t.edit(u=>Z(u,o,e+1))}>${k("down")}</button>
        <button type="button" class="icon danger" ?disabled=${t.busy} title="Remove" aria-label=${`Remove ${a}`}
          @click=${()=>t.edit(u=>We(u,o))}>${k("delete")}</button>
      </span>
    </span>
  </div>`}function Ti(t,i){let e=E(t.document),n=K(t),s="phrase"in n?n.phrase:void 0,o=Rn(t.document);return d`<section class="card lc vo-phrases-card" aria-label="Phrases"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${yi}px; --thumb-h: ${ki}px`}>
    <div class="lc-head">
      <span class="swatch">${k("list")}</span><span class="lc-title">Phrases</span>
      <span class="lc-sub">${e.length} of ${Ce}</span>
      ${i?.badge===void 0?m:d`<span class="badge vo-linked" title=${i.badgeTitle??i.badge}>${i.badge}</span>`}
      <span class="spacer"></span>
      ${i===void 0?m:d`<button type="button" class="lc-btn vo-dev-open ${i.open?"on":""}" aria-expanded=${i.open?"true":"false"}
        title="Pick the watches these phrases and defaults are on" @click=${()=>i.onDevices()}>${k("watch")}<span>Devices</span></button>`}
      <button type="button" class="lc-btn pri vo-add-phrase" aria-label="Add phrase" ?disabled=${t.busy||o}
        title=${o?`The watch takes ${Ce} phrases at most.`:"Add a phrase at the end"}
        @click=${()=>Xi(t)}>${k("plus")}<span>Add</span></button>
    </div>
    ${i?.open===!0?i.menu:m}
    ${e.length===0?d`<div class="lc-note">No phrases yet. A phrase is a message Pick from List and Speak Phrase can say on your speakers.</div>`:d`<div class="layers vo-phrase-list" role="list">${e.map((r,a)=>ts(t,r,a,e.length,s))}</div>`}
  </section>`}function _i(t){let{width:i,height:e}=t.screen,n=t.scale,s=E(t.document),o=K(t),r="phrase"in o?N(o.phrase).toUpperCase():void 0,a=s.map(c=>{let h=N(c),u=Be(c.color),y=r!==void 0&&h.toUpperCase()===r,g=le(c),S=typeof c.icon=="string"&&c.icon!==""?c.icon:"speaker.wave.2",x=c.displayMode==="text";return d`<button type="button" class="vo-say ${x?"vo-words":"vo-glyph"} ${y?"on":""}" style=${`--fill:${u.fill};--ink:${u.ink}`}
      title=${g} aria-label=${g} aria-pressed=${y?"true":"false"} @click=${()=>Ye(t,h)}>
      ${x?d`<span class="vo-say-text">${g}</span>`:d`<span class="vo-say-well">${xi(t,S,Math.round(16*n),"#fff")}</span>
        <span class="vo-say-label">${g}</span>`}
    </button>`}),l=d`<div class="vo-screen" role="group" aria-label="Pick from List on the watch"
    style=${`width:${Math.round(i*n)}px;height:${Math.round(e*n)}px;--vo-s:${n}`}>
    <div class="vo-screen-title">Phrases</div>
    ${s.length===0?d`<p class="vo-screen-note">No phrases yet.</p>`:d`<div class="vo-say-list">${a}</div>`}
  </div>`;return sn({width:i,height:e},n,l,"Pick from List on the watch")}function Ii(t){let i=E(t.document).length;return[`${i} ${i===1?"phrase":"phrases"}`]}function ns(t){let i=K(t);return("phrase"in i?["phrase","look","speech"]:[i.section]).map(n=>({module:ne,section:n}))}function Pi(t){let i=K(t),e=ns(t),n=cn(t.uiState,e),s,o;if("phrase"in i){let r=le(i.phrase);s=d`<div class="crumbs"><button class="root" title="The voice defaults" @click=${()=>Je(t,"defaults")}>Voice</button><span class="sep">›</span><span class="kchip" style=${`--k:${Be(i.phrase.color).ink}`}>Phrase</span><span class="nm" title=${r}>${r}</span></div>`,o=cs(t,i.phrase)}else{let r=gi.find(([a])=>a===i.section)?.[1]??"";s=d`<div class="crumbs"><span class="kchip" style=${`--k:${Ji}`}>Voice</span><span class="nm" title=${r}>${r}</span></div>`,o=d`<p class="vo-note">${wi[i.section]}</p>
      ${i.section==="defaults"?is(t):os(t)}
      <p class="vo-note vo-pick-note">Pick a phrase to edit it, or add one.</p>`}return d`<div class="insp-head">
      ${s}
      <button class="expand" @click=${()=>{dn(t.uiState,e,!n),t.requestUpdate()}}>${n?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${o}</div>`}function Ci(t,i,e,n){let s=gn(t.hass.states),o=ce(s,e),r=h=>h.missing?`${h.entityId} (not found)`:h.name,a=h=>xe(r(h),e.includes(h.entityId),u=>n(h.entityId,u)),l=s.filter(h=>h.announces),c=o.filter(h=>!l.some(u=>u.entityId===h.entityId));return d`<div class="vo-sub-h"><span>${i}</span></div>
    <div class="vo-list" role="group" aria-label=${i}>
      ${o.length===0?d`<div class="hint">No media players in Home Assistant.</div>`:m}
      ${l.length>0?d`<div class="vo-group">Speakers</div>${l.map(a)}`:m}
      ${c.length>0?d`${l.length>0?d`<div class="vo-group">Other media players</div>`:m}${c.map(a)}`:m}
    </div>`}function is(t){let i=M(t.document),e=rs(t,i.engine),n=i.engine===void 0?"No engine":e.find(([r])=>r===i.engine)?.[1]??U(t.hass,i.engine),s=[i.agent===void 0?"Default agent":U(t.hass,i.agent),n].join(" \xB7 "),o=d`<fieldset class="vo-body" ?disabled=${t.busy} aria-label="Defaults">
    <div class="vo-stack">${Ut({hass:t.hass},"Conversation agent",Yi(t.hass,i.agent??""),r=>t.edit(a=>Vn(a,r.entityId)),"vo:agent",{domain:"conversation",clearable:!0})}</div>
    <div class="hint">${i.agent===void 0?"None picked: Home Assistant's own default agent answers.":"Assist uses this agent unless a tile or a slot picks its own."}</div>
    <div class="vo-stack">${ae("Text to speech engine",i.engine??"",e,r=>t.edit(a=>Tn(a,r)),{snapBack:!0})}</div>
    <div class="hint ${i.engine===void 0?"warn":""}">${i.engine===void 0?"Not set. Speaking on speakers needs an engine.":"Speakers say messages and replies with this engine unless a tile, a slot or a phrase picks its own."}</div>
    ${Ci(t,"Speakers",i.speakers,(r,a)=>t.edit(l=>_n(l,r,a)))}
    <div class="hint">${i.speakers.length===0?"None picked. A slot or a phrase set to speakers with none of its own then plays nowhere.":"Assist, Speak and phrases play here unless they pick their own."}</div>
  </fieldset>`;return te(t,"defaults","Defaults",o,{summary:s,dot:i.agent!==void 0||i.engine!==void 0||i.speakers.length>0})}function ss(t,i){let e=[{value:"",label:"System voice"}];i!==void 0&&!t.some(n=>n.id===i)&&e.push({value:i,label:`${i} (not on this watch)`});for(let n of On(t))for(let s of n.voices)e.push({value:s.id,label:He(s),group:n.language});return e}function os(t){let i=In(t.document),e=Ae(t.document),n=ss(t.voices,e),s=[];for(let c of n){let h=s[s.length-1];h!==void 0&&h.group!==void 0&&h.group===c.group?h.options.push(c):s.push({group:c.group,options:[c]})}let o=c=>d`<option value=${c.value} .selected=${be(c.value===(e??""))}>${c.label}</option>`,r=t.voicesState==="unsupported"?"Update the integration to list this watch's voices.":t.voicesState==="error"?"Could not read this watch's voices.":t.voicesState==="ready"&&t.voices.length===0?zn:void 0,a=d`<fieldset class="vo-body" ?disabled=${t.busy} aria-label="On the watch">
    ${xe("Speak even in Silent Mode",i,c=>t.edit(h=>Pn(h,c)),!0)}
    <div class="hint">The watch speaks a reply on its own speaker even while it is in Silent Mode.</div>
    <label class="field"><span>Watch voice</span>
      <select .value=${be(e??"")} @change=${c=>{let h=c.target.value;t.edit(u=>Cn(u,h===""?void 0:h))||t.requestUpdate()}}>
        ${s.map(c=>c.group===void 0?c.options.map(o):d`<optgroup label=${c.group}>${c.options.map(o)}</optgroup>`)}
      </select></label>
    ${r===void 0?d`<div class="hint">The voice the watch speaks a reply in. System voice follows the watch's language.</div>`:d`<div class="hint ${t.voicesState==="ready"?"":"warn"}">${r}</div>`}
  </fieldset>`,l=e===void 0?"System voice":t.voices.find(c=>c.id===e)?.name??e;return te(t,"watch","On the watch",a,{summary:l,dot:!i||e!==void 0})}function rs(t,i){let e=Object.keys(t.hass.services?.tts??{}),n=ce(Pe(t.hass.states,e,t.cloudTTS),i===void 0?[]:[i]);return[["","Not set"],...n.map(s=>[s.entityId,s.missing?`${s.entityId} (not found)`:s.name])]}function as(t,i){let e=M(t.document),n=Object.keys(t.hass.services?.tts??{}),s=ce(Pe(t.hass.states,n,t.cloudTTS),i===void 0?[]:[i]);return[["",e.engine===void 0?"Default (Not set)":`Default (${s.find(r=>r.entityId===e.engine&&!r.missing)?.name??U(t.hass,e.engine)})`],...s.map(r=>[r.entityId,r.missing?`${r.entityId} (not found)`:r.name])]}function cs(t,i){let e=N(i),n=(p,L,O=!1)=>t.edit(ie=>Nn(ie,e,p,L),O?`phrase:${e}:${p}`:void 0),s=he(i),o=p=>typeof i[p]=="string"?i[p]:"",r=d`<fieldset class="vo-body" ?disabled=${t.busy} aria-label="Phrase">
    ${re("Message",o("message"),p=>n("message",p,!0),{placeholder:"What the speakers say"})}
    ${re("Label",o("label"),p=>n("label",p,!0),{placeholder:"Its name on the watch"})}
    ${s.length>0?d`<div class="hint warn">The phrase needs a ${s.join(" and a ")} before it can be saved.</div>`:m}
    ${Mt("Display mode",String(i.displayMode??"icon"),De("TTSPhraseDisplayMode"),p=>n("displayMode",p),{def:de.newPhrase.displayMode})}
    <div class="hint">How Pick from List shows it: its icon, or its label.</div>
  </fieldset>`,a=i.color,l=Wn(a),c=d`<fieldset class="vo-body" ?disabled=${t.busy} aria-label="Look">
    <div class="vo-stack">${qt({icons:t.icons,symbols:t.symbols},typeof i.icon=="string"?i.icon:"",p=>n("icon",p,!0),`vo:icon:${e}`,{tint:a})}</div>
    <div class="vo-no-alpha">${Ft("Color",Hn(a)?a:void 0,p=>{p!==void 0&&n("color",p,!0)},!1,de.newPhrase.color)}</div>
    ${l===void 0?m:d`<div class="hint">${l}, which the panel does not offer. Picking a color here replaces it.</div>`}
  </fieldset>`,h=Array.isArray(i.targetSpeakers)?i.targetSpeakers.filter(p=>typeof p=="string"):[],u=M(t.document),y=typeof i.ttsEngine=="string"&&i.ttsEngine.trim()!==""?i.ttsEngine.trim():void 0,g=Ln(i),S=Mn(i),x=de.volume,A=d`<fieldset class="vo-body" ?disabled=${t.busy} aria-label="Speech">
    ${Ci(t,"Speakers",h,(p,L)=>t.edit(O=>Fn(O,e,p,L)))}
    <div class="hint">${h.length>0?"This phrase plays only on these.":u.speakers.length>0?`None picked: the default speakers play (${u.speakers.map(p=>U(t.hass,p)).join(", ")}).`:"None picked, and no default speakers: set some in Defaults."}</div>
    ${ae("Voice engine",y??"",as(t,y),p=>n("ttsEngine",p===""?void 0:p),{snapBack:!0})}
    ${re("Language",typeof i.language=="string"?i.language:"",p=>n("language",p,!0),{placeholder:"The engine's own"})}
    <div class="hint">A language code such as en or de, for an engine that speaks more than one.</div>
    ${ae("Speech volume",g,De("TTSPhraseSpeechVolumeMode"),p=>n("speechVolumeMode",p),{snapBack:!0,def:"keepCurrent"})}
    ${g==="keepCurrent"?m:d`${Nt("Target volume",S,p=>n("speechVolumePercent",p,!0),{min:x.min,max:x.max,step:x.step,def:x.default,format:p=>`${Math.round(p)}${x.unit}`})}
      <div class="vo-chips">${x.presets.map(p=>d`<button type="button" class="pe-chip ${S===p.value?"on":""}"
        aria-pressed=${S===p.value?"true":"false"} @click=${()=>n("speechVolumePercent",p.value)}>${p.label} ${p.value}%</button>`)}</div>`}
  </fieldset>`,P=E(t.document).findIndex(p=>N(p).toUpperCase()===e.toUpperCase()),ve=E(t.document).length;return d`${te(t,"phrase","Phrase",r,{summary:o("message"),dot:s.length>0})}
    ${te(t,"look","Look",c,{summary:typeof i.icon=="string"?i.icon:"",dot:!1})}
    ${te(t,"speech","Speech",A,{summary:y===void 0?"Defaults":U(t.hass,y),dot:Un(i)})}
    <div class="vo-acts">
      <button type="button" class="pe-btn" ?disabled=${t.busy||P<=0} @click=${()=>t.edit(p=>Z(p,e,P-1))}>${k("up")}<span>Move up</span></button>
      <button type="button" class="pe-btn" ?disabled=${t.busy||P>=ve-1} @click=${()=>t.edit(p=>Z(p,e,P+1))}>${k("down")}<span>Move down</span></button>
      <button type="button" class="pe-btn pe-danger" ?disabled=${t.busy} title="Remove this phrase from the library"
        @click=${()=>t.edit(p=>We(p,e))}>${k("delete")}<span>Remove</span></button>
    </div>
    <p class="vo-note">A menu slot that speaks this phrase keeps pointing at it after an edit. Removing it leaves such a slot with nothing to say.</p>`}var Di=se`
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
`;Jn({dirty:Fe,drop:ei});typeof window<"u"&&window.addEventListener("beforeunload",t=>{Fe()&&(t.preventDefault(),t.returnValue="")});var ds=15e3,Ai=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),Ge=Ai?"\u2318":"Ctrl+",Xe={min:200,max:720,middleMin:320},Ze={left:280,right:340},Qe="wrist-assistant-panel.voice.columns.v1",ls=24,Oi=820,hs="Saving. The phrases can go on another watch once the save is done.",us="Save or discard your edits first. The phrases go on another watch as they are saved here.";function Ei(t){return C(t).message}function J(t){return C(t).code}function Ri(t){let{code:i,message:e}=C(t);return Object.assign(new Error(e),i===void 0?{}:{code:i})}function ps(t){return t<1e3?`${t} bytes`:`${Number((t/1e3).toFixed(1))} KB`}function fs(t){let i=t?Date.parse(t):NaN;return Number.isNaN(i)?"":ht(Math.max(0,(Date.now()-i)/1e3))}function vs(t){return t==="panel"?"Saved here":"From the watch"}function ms(t){return t instanceof HTMLElement?en(t.tagName,t instanceof HTMLInputElement?t.type:void 0,t.isContentEditable):!1}function gs(){let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t===null||t===document.body||t===document.documentElement}function ws(t){let i=H(t)??{},e=E(i).length,n=M(i).speakers.length;return`${e} ${e===1?"phrase":"phrases"}. ${n===0?"No default speakers.":`${n} default ${n===1?"speaker":"speakers"}.`}`}var f=class extends tt{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=m;this.shellOwnsWatch=!1;this.barHost=void 0;this.headBar=new Tt(this);this.unsupported=!1;this.voices=[];this.voicesState="loading";this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.otherVoice=new Map;this.devicesOpen=!1;this.linking=!1;this.linksSeq=0;this.columns={...Ze};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new Bt(this);this.symbols=new At(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.voicesSeq=0;this.historySeq=0;this.subscribeSeq=0;this.cloudSeq=0;this.onReconnect=()=>{let e=this.watchId;!this.isConnected||e===void 0||(this.load(e,!0),this.loadVoices(e),this.loadCloud())};this.onScrubStart=e=>{e.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=e=>{e.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=e=>{if(e.defaultPrevented)return;let n=e.composedPath();if(!n.includes(this)&&!this.headBar.holds(n)&&!gs()||this.renderRoot.querySelector("dialog[open]"))return;let s=e.metaKey||e.ctrlKey,o=e.key.toLowerCase();if(s&&!e.altKey&&o==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1;return}if(e.key==="Escape"&&this.watchMenuOpen){e.preventDefault(),this.watchMenuOpen=!1;return}if(e.key==="Escape"&&this.devicesOpen){e.preventDefault(),this.closeDevices();return}if(!ms(n[0])){if(s&&!e.altKey&&o==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}if(e.ctrlKey&&!e.metaKey&&!e.altKey&&o==="y"){e.preventDefault(),this.redo();return}if(e.key==="Escape"&&!s&&!e.altKey){let r=this.viewHost();r!==void 0&&Si(r)&&e.preventDefault()}}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen&&!this.watchMenuOpen&&!this.devicesOpen)return;let n=e.composedPath(),s=o=>n.some(r=>r instanceof HTMLElement&&r.classList.contains(o));this.topMenuOpen&&!s("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!s("ve-watch-picker")&&(this.watchMenuOpen=!1),this.devicesOpen&&!s("pe-dev-menu")&&!s("vo-dev-open")&&!s("pe-top-menu")&&!s("pe-ask")&&this.closeDevices()};this.addEventListener(Wt,this.onScrubStart),this.addEventListener(Lt,this.onScrubEnd),this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get watches(){return xt(this.owners.length>0?this.owners:this.ownList??[])}get draft(){let e=this.watchId,n=this.record;if(!(e===void 0||n===void 0)){if(n.revision>0){let s=F(e);if(s!==void 0)return s;let o=H(n.document);return o===void 0?void 0:Me(e,o,n.revision).draft}if(!(this.unsupported||!this.opensReady()))return F(e)??Ne(e)}}get newWatch(){let e=this.record;return e!==void 0&&e.revision<=0&&!this.unsupported}get saving(){return this.draft?.saving??!1}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Et(Qe,Ze,Xe),this.watchSize(),this.listenForReconnect(),this.loadCloud(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.voicesSeq++,this.historySeq++,this.cloudSeq++,this.linksSeq++}willUpdate(e){if(this.hass){e.has("hass")&&(this.listenForReconnect(),this.cloudTTS===void 0&&e.get("hass")===void 0&&this.loadCloud()),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,nt(this.hass).then(o=>{this.ownList=o.owners},()=>{this.ownList=[]}));let s=Vt(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||e.has("ownerId"));s!==void 0&&this.openWatch(s)}this.followSave();let n=this.restoreAsk;n!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(s=>s.revision===n.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),Gt(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let n of e){if(n.target!==this){this.measureTop(n.target);continue}let s=n.contentRect;Math.abs(s.width-this.hostWidth)>=1&&(this.hostWidth=s.width),Math.abs(s.height-this.hostHeight)>=1&&(this.hostHeight=s.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let n=this.renderRoot?.querySelector(".pe-top")??void 0;n!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=n,n!==void 0&&e.observe(n))}measureTop(e){let n=e.offsetHeight;n!==this.topHeight&&(this.topHeight=n,this.style.setProperty("--pe-top-h",`${n}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let e=this.watchId;if(e===void 0)return;let n=F(e)?.saveDone;if(n===void 0||n===this.followedSave)return;this.followedSave=n;let s=()=>this.saveEnded(e);n.then(s,s)}saveEnded(e){this.requestUpdate(),this.isConnected&&(e===this.watchId?(this.reloadPending=!1,this.load(e,!0)):this.flushPending())}openWatch(e,n=!1){e!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=e,this.note=void 0,this.unsupported=!1,this.voices=[],this.voicesState="loading",this.voicesSeq++,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),this.devicesOpen=!1,this.devicesNote=void 0,this.replaceAsk=void 0,this.freshAsk=void 0,this.otherVoice=new Map,this.linksFor=void 0,n=!1),this.startSubscription(e),this.load(e,n),this.loadVoices(e),this.loadLinks(e)}loadCloud(){let e=this.hass;if(!e)return;let n=++this.cloudSeq;lt(e).then(s=>{n===this.cloudSeq&&(this.cloudTTS=mn(s))},()=>{n===this.cloudSeq&&(this.cloudTTS=!1)})}async loadVoices(e){let n=this.hass;if(!n)return;let s=++this.voicesSeq;try{let o=await dt(n,e);if(s!==this.voicesSeq||e!==this.watchId)return;this.voices=Dn(o),this.voicesState="ready"}catch(o){if(s!==this.voicesSeq||e!==this.watchId)return;this.voicesState=J(o)==="unknown_command"?"unsupported":"error"}}async load(e,n=!1){let s=this.hass;if(!s)return;if(n&&this.holdReload){this.reloadPending=!0;return}let o=++this.loadSeq;this.stopPolling(),n||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let r=await q(s,e,"voice");if(o!==this.loadSeq)return;if(n&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(r),this.loadError=void 0}catch(r){if(o!==this.loadSeq)return;Bn(r)?(this.unsupported=!0,this.loadError=void 0):n||(this.loadError=Ei(r)),this.restartDraft?.watchId===e&&(this.restartDraft=void 0)}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(e))}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(e){let n=this.watchId;this.record=e,n!==void 0&&e.revision<=0&&Ne(n);let s=e.revision>0?H(e.document):void 0;if(n===void 0||s===void 0)return;let o=this.restartDraft;o!==void 0&&o.watchId===n&&e.revision>=o.revision&&(this.restartDraft=void 0,(F(n)?.dirty??!1)||pe(n));let r=Me(n,s,e.revision);r.replaced.length>0?this.note={kind:"warn",text:ze(r.replaced)}:r.mergedIntoEdits&&(this.note={kind:"warn",text:"The voice settings changed somewhere else. Your edits are kept."}),B(s)!==this.linksFor&&this.loadLinks(n),this.requestUpdate()}async loadHistory(e){let n=this.hass;if(!n||this.historyState==="unsupported")return;let s=++this.historySeq;try{let o=await ot(n,e,"voice");if(s!==this.historySeq||e!==this.watchId)return;this.history=Array.isArray(o?.entries)?o.entries:[],this.historyState="ready"}catch(o){if(s!==this.historySeq||e!==this.watchId)return;this.historyState=J(o)==="unknown_command"?"unsupported":"error"}}startSubscription(e){let n=this.hass;if(this.endSubscription(),!n)return;let s=++this.subscribeSeq;ct(n,e,o=>{s===this.subscribeSeq&&o.kind==="voice"&&o.revision!==(this.record?.revision??0)&&this.load(e,!0)}).then(o=>{s===this.subscribeSeq?this.unsubscribe=o:o().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let e=this.unsubscribe;this.unsubscribe=void 0,e?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||kt(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},ds))}async poll(){this.pollTimer=void 0;let e=this.hass,n=this.watchId,s=this.record;if(!(!e||n===void 0||s===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let o=await q(e,n,"voice");if(n!==this.watchId||this.record!==s)return;o.revision===s.revision?this.record={...s,delivered_revision:o.delivered_revision,delivered_at:o.delivered_at,rejected_revision:o.rejected_revision,rejected_at:o.rejected_at,rejected_reason:o.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(o),this.loadHistory(n))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,n){let s=this.draft;if(!s||this.saving)return!1;let o=s.apply(e(s.document),this.scrubKey??n);return this.requestUpdate(),o}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let e=this.icons??Qt,n=this.iconMemo;if(n!==void 0&&n.provider===e&&n.tick===this.iconsTick)return n.icons;let s=tn(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:s},s}screen(){let e=this.watches.find(n=>n.owner_watch_id===this.watchId);return(ke(e?.screen_size)??ye).screen}viewHost(){let e=this.draft,n=this.hass;if(e===void 0||n===void 0)return;let s=this;return{hass:n,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.stageScale,voices:this.voices,voicesState:this.voicesState,cloudTTS:this.cloudTTS,get document(){return e.document},get busy(){return s.saving},edit:(o,r)=>this.draft===e&&this.edit(o,r),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,n=this.watchId;this.endScrub();let s=this.draft;if(!e||n===void 0||!s||this.saving||!s.dirty)return;this.note=void 0;let o=s.revision<=0,r=[],a=Qn(s,{save:(c,h)=>me(e,n,"voice",c,h).then(u=>(r=Ct(u),u),u=>{throw Ri(u)}),fetch:async()=>{let c=await q(e,n,"voice").catch(h=>{throw Ri(h)});return{revision:c.revision,document:c.document}}});this.followedSave=s.saveDone,this.requestUpdate();let l=await a.catch(c=>({ok:!1,revision:s.revision,merged:!1,code:J(c)??"unknown",message:Ei(c)}));if(this.saveEnded(n),n===this.watchId){let c=kn(o,l.code,mi(l));this.note=l.ok?Dt(c,r,"phrases"):c,l.ok&&this.loadLinks(n)}}startFresh(){let e=this.watchId;e===void 0||!St(this.noRecordState())||(wn("voice",e),this.note=void 0,this.requestUpdate())}get linkDevices(){return ln(this.owners.length>0?this.owners:this.ownList??[],!1)}deviceName(e){return this.linkDevices.find(n=>n.ownerId===e)?.name??"the other watch"}phraseHolders(){let e=this.watchId;return e===void 0?[]:Ue(this.draft?.document,e,this.voicePlaces)}get linksOn(){return this.voicePlaces!==void 0&&(this.record?.revision??0)>0&&this.linkDevices.length>1}async loadLinks(e){let n=this.hass;if(!n)return;let s=++this.linksSeq,o=this.record!==void 0&&this.record.revision>0?H(this.record.document):void 0;this.linksFor=B(o);let r;try{r=await st(n)}catch(c){s===this.linksSeq&&J(c)==="unknown_command"&&(this.voicePlaces=void 0);return}if(s!==this.linksSeq||e!==this.watchId||(this.voicePlaces=ni(r),this.voicePlaces===void 0))return;let a=this.linkDevices.filter(c=>c.ownerId!==e),l=await Promise.all(a.map(async c=>{try{let h=await q(n,c.ownerId,"voice"),u=h.revision>0?H(h.document):void 0;return[c.ownerId,{facts:hn(h),...u===void 0?{}:{document:u}}]}catch{return}}));s!==this.linksSeq||e!==this.watchId||(this.otherVoice=new Map(l.filter(c=>c!==void 0)))}waitingWatches(){let e=new Map([...this.otherVoice].map(([n,s])=>[n,s.facts]));return un(this.owners.length>0?this.owners:this.ownList??[],e)}openDevices(){this.topMenuOpen=!1,this.devicesNote=void 0,this.devicesOpen=!0,this.watchId!==void 0&&this.loadLinks(this.watchId),this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".vo-phrases-card .pe-dev-menu")?.scrollIntoView({block:"nearest"})})}closeDevices(){this.devicesOpen=!1,this.devicesNote=void 0}devicesBlocked(){if(this.saving)return hs;if(this.draft?.dirty??!1)return us}async linkTo(e,n=!1){let s=this.hass,o=this.watchId;if(!s||o===void 0||e===o||this.linking||this.devicesBlocked()!==void 0)return;let r=this.deviceName(e);if(!n&&di(this.otherVoice.get(e)?.document,B(this.draft?.document))){this.replaceAsk={watchId:o,target:e,name:r};return}this.linking=!0,this.devicesNote=void 0;try{if(await it(s,"voice",o,[ee],[e],n),o!==this.watchId)return;this.devicesNote={kind:"ok",text:[`Now on ${r} too.`,n?qe:void 0].filter(a=>a!==void 0).join(" ")},this.load(o,!0),this.loadLinks(o)}catch(a){if(o!==this.watchId)return;!n&&J(a)==="unit_taken"?this.replaceAsk={watchId:o,target:e,name:r}:this.devicesNote={kind:"err",text:`Not added. ${hi(a)}`}}finally{this.linking=!1}}async unlinkFrom(e){let n=this.hass,s=this.watchId;if(!n||s===void 0||e===s||this.linking||this.devicesBlocked()!==void 0)return;this.linking=!0,this.devicesNote=void 0;let o=await vi({read:a=>q(n,a,"voice"),save:(a,l,c)=>me(n,a,"voice",l,c)},e);if(this.linking=!1,s!==this.watchId)return;let r=this.deviceName(e);this.devicesNote=o.ok?{kind:"ok",text:`Unlinked ${r}. It keeps its copy of the phrases.`}:{kind:"err",text:`Not unlinked from ${r}: ${o.message}`},this.load(s,!0),this.loadLinks(s)}closeReplaceAsk(){this.renderRoot?.querySelector("dialog.ve-replace-ask")?.close(),this.replaceAsk=void 0}confirmReplace(){let e=this.replaceAsk;this.closeReplaceAsk(),e!==void 0&&e.watchId===this.watchId&&this.linkTo(e.target,!0)}startFreshPhrases(){let e=this.watchId,n=this.draft;if(e===void 0||n===void 0||this.saving)return;let s=fi(this.phraseHolders());if(s===void 0){this.applyFresh(!1);return}this.freshAsk={watchId:e,question:s.question,here:s.here,all:s.all}}applyFresh(e){this.edit(n=>je(n,e))&&(this.note={kind:"ok",text:e?"Started fresh on this watch. Save to unlink it from the others. Undo brings the phrases back.":"Started fresh. Save to clear the phrases everywhere they are. Undo brings them back."})}closeFreshAsk(){this.renderRoot?.querySelector("dialog.ve-fresh-ask")?.close(),this.freshAsk=void 0}answerFresh(e){let n=this.freshAsk;this.closeFreshAsk(),n!==void 0&&n.watchId===this.watchId&&this.applyFresh(e)}phrasesLinks(){let e=this.watchId;if(e===void 0||!this.linksOn)return;let n=this.phraseHolders(),s=this.linkDevices,o=ai(n,e,s),r=ci(n,e,s),a=this.devicesBlocked();return{...o===void 0?{}:{badge:o},...r===void 0?{}:{badgeTitle:r},open:this.devicesOpen,onDevices:()=>this.devicesOpen?this.closeDevices():this.openDevices(),menu:this.devicesOpen?fn({name:ti,head:ii,foot:si,places:ri(s,this.draft?.document,e,this.voicePlaces,this.waitingWatches()),...a===void 0?{}:{blocked:a},busy:this.linking,...this.devicesNote===void 0?{}:{note:this.devicesNote},className:"at-card",colorOf:l=>this.colorOf(l),titleOf:oi,onToggle:l=>{l.on?this.unlinkFrom(l.device.ownerId):this.linkTo(l.device.ownerId)},onDone:()=>this.closeDevices()}):m}}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(e){let n=this.hass,s=this.watchId,o=this.record;if(!n||s===void 0||o===void 0||this.draft?.dirty)return;let r={entry:e,baseRevision:o.revision};this.restoreAsk=r,rt(n,s,"voice",e.revision).then(a=>{this.restoreAsk===r&&(this.restoreAsk={...r,summary:ws(a.document)})},()=>{})}async restore(){let e=this.hass,n=this.watchId,s=this.restoreAsk;if(!e||n===void 0||s===void 0||this.restoring)return;this.restoring=!0;let o;try{let r=await at(e,n,"voice",s.entry.revision,s.baseRevision);o={kind:"ok",text:nn(s.entry.updated_at)},n===this.watchId?this.restartDraft={watchId:n,revision:r.revision}:(F(n)?.dirty??!1)||pe(n)}catch(r){let a=J(r);a==="conflict"?o={kind:"warn",text:"Not restored. The voice settings changed somewhere else, so the newest copy is shown."}:a==="no_record"?o={kind:"warn",text:"Not restored. Home Assistant no longer holds voice settings for this watch."}:a==="not_found"?o={kind:"warn",text:"Not restored. That save is no longer kept."}:a==="unknown_command"?(this.historyState="unsupported",o={kind:"warn",text:"This version of the integration cannot restore voice settings. Update it to restore an earlier save."}):o={kind:"err",text:`Could not restore: ${Ht(r)}`}}finally{this.restoring=!1,this.restoreAsk===s&&this.closeAsk()}n===this.watchId&&(this.note=o,this.load(n,!0))}render(){let e=this.watches,n=this.draft;return d`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(n,e):m}
        ${this.note?d`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:m}
      </div>
      ${this.renderBody(e)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):this.replaceAsk?this.renderReplaceAsk(this.replaceAsk):this.freshAsk?this.renderFreshAsk(this.freshAsk):m}
    `}renderReplaceAsk(e){return d`<dialog class="pe-ask ve-replace-ask" aria-labelledby="ve-replace-title"
      @close=${()=>{this.replaceAsk=void 0}}>
      <h3 id="ve-replace-title">${li(e.name)}</h3>
      <p class="pe-muted">Its phrases and defaults become these, linked: an edit on one watch then shows on both. ${qe}</p>
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
    </dialog>`}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=Oi}renderTopBar(e,n){let s=e!==void 0&&!this.unsupported,o=s&&e.dirty;return d`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch voice">
      ${this.haMenu?d`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${k("menu")}</button>`:m}
      ${this.shellOwnsWatch?m:d`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():Kn(void 0,!1)}>${k("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${this.shellOwnsWatch?m:this.renderWatchPicker(n)}
      ${this.barHost!==void 0&&s?_t({newWatch:this.newWatch,dirty:o,saved:Se(this.record)}):m}
      ${this.renderSyncPill(s?e:void 0)}
      ${this.renderTopMenu(s?e:void 0)}
      ${s?d`<button class="primary save ${o?"dirty":""}" ?disabled=${!o||this.saving}
          title=${o?`Save (${Ge}S). A save reaches the watch the next time it checks.`:`Nothing to save (${Ge}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?m:d`<span class="tb-saved" title=${o?"Unsaved changes":""}>${Se(this.record)}</span>
        ${$n(yn({newWatch:this.newWatch,dirty:o,saving:this.saving}))}`}`:m}
      ${this.barActions}
    </div>`}renderSyncPill(e){let n=this.record;if(n===void 0||n.revision<=0||this.unsupported)return m;let s=e===void 0?{size:0,limit:1}:Oe(e.document),o=$e({record:n,size:s.size,limit:s.limit,noun:"voice settings",historyState:this.historyState});return d`<span class="tb-sync ${o.tone==="ok"?"ok":"warn"}" title=${`${o.state}. ${o.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${o.state}</span>
    </span>`}noRecordState(e=this.watches){return $t(e.find(n=>n.owner_watch_id===this.watchId))}opensReady(e=this.watches){return bn(this.noRecordState(e),"voice",this.watchId)}canStartFresh(){return this.watchId!==void 0&&this.newWatch&&!this.opensReady()}renderTopMenu(e){let n=this.canStartFresh();if(e===void 0&&!n)return m;let s=this.topMenuOpen,o=a=>()=>{this.topMenuOpen=!1,a()},r=e!==void 0&&!this.newWatch;return d`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${s?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!s}}>···</button>
      ${s?d`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${e?d`<button class="row" role="menuitem" ?disabled=${!e.dirty||this.saving}
          title=${this.newWatch?"Go back to the defaults. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${o(()=>this.discard())}>Discard edits</button>`:m}
        ${r&&this.linksOn?d`<button class="row ve-dev-item" role="menuitem"
          title="Pick the watches these phrases and defaults are on"
          @click=${o(()=>this.openDevices())}>Devices…</button>`:m}
        ${r?d`<button class="row" role="menuitem" ?disabled=${this.saving||pi(e.document)}
          title="No phrases and the app's defaults again. The watch voice and Silent Mode setting stay. Undo brings the phrases back."
          @click=${o(()=>this.startFreshPhrases())}>Start fresh</button>`:m}
        ${n?d`<button class="row" role="menuitem"
          @click=${o(()=>this.startFresh())}>${ge}</button>`:m}
      </div>`:m}
    </span>`}colorOf(e){return zt(jt(this.owners.length>0?this.owners:this.ownList??[]),e)}renderWatchPicker(e){if(e.length<2)return m;let n=e.find(r=>r.owner_watch_id===this.watchId),s=this.watchMenuOpen,o=r=>{let a=r===void 0?void 0:this.colorOf(r);return d`<span class="pe-chip-glyph" style=${a?`--pe-person: ${a}`:m} aria-hidden="true">${k("watch")}</span>`};return d`<span class="picker ve-watch-picker">
      <button type="button" class="tb-browse ve-watch-btn" aria-haspopup="menu" aria-expanded=${s?"true":"false"}
        title="Choose the watch whose voice settings are shown" @click=${()=>{this.watchMenuOpen=!s}}>
        ${o(n?.owner_watch_id)}<span class="tb-browse-l">${n?oe(n,e):"Choose a watch"}</span>
        <span class="ve-caret" aria-hidden="true">${k("chevron")}</span>
      </button>
      ${s?d`<div class="pop-menu ve-watch-menu" role="menu" aria-label="Watches">
        ${e.map(r=>{let a=r.owner_watch_id===this.watchId;return d`<button type="button" class="row ve-watch-row" role="menuitemradio" aria-checked=${a?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,a||this.openWatch(r.owner_watch_id)}}>
            ${o(r.owner_watch_id)}<span class="ve-watch-name">${oe(r,e)}</span>
            <span class="ve-watch-check" aria-hidden="true">${a?k("check"):m}</span>
          </button>`})}
      </div>`:m}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=Oi?this.columns:Ot(this.hostWidth-ls,this.columns,Xe)}renderGutter(e){return d`<div class="gutter ${e}" role="separator" aria-orientation="vertical"
      aria-label=${e==="left"?"Resize the voice and phrases column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${n=>{let s=this.fittedColumns();Rt(n,{side:e,base:e==="left"?s.left:s.right,limits:Xe,onWidth:o=>{this.columns={...this.columns,[e]:o}},onEnd:()=>we(Qe,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[e]:Ze[e]},we(Qe,this.columns)}}></div>`}get stageScale(){return this.zoom??Ve(this.narrow||this.stacked)}renderStage(e,n){let s=n.find(u=>u.owner_watch_id===this.watchId),r=ke(s?.screen_size)??ye,a=[...Ii(e),r.label],l=this.draft,c=this.stageScale,h=Ve(this.narrow||this.stacked);return d`<div class="card canvas-card lit ve-canvas" aria-label="Pick from List">
      <div class="cv-head">
        <span class="cv-title">Pick from List</span>
        ${s!==void 0?d`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${oe(s,n)}</span></span>`:m}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${a.join(" \xB7 ")}><span class="fam">${a.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!l?.canUndo} title=${`Undo (${Ge}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${k("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!l?.canRedo} title=${Ai?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${k("redo")}</button>
        </span>
      </div>
      <div class="stage-area ve-stage-area">
        <div class="stage-tools" role="toolbar" aria-label="Stage tools">
          <span class="tb-zoom" role="group" aria-label="Zoom">
            <button class="tb icon" ?disabled=${c<=_e(c)} aria-label="Zoom out" title="Zoom out"
              @click=${()=>{this.zoom=_e(c)}}>−</button>
            <button class="tb pct" aria-label=${`Zoom ${G(c)}. Back to fit`}
              title=${`The watch at ${G(c)} of its own points. Click to fit it again (${G(h)}).`}
              @click=${()=>{this.zoom=void 0}}>${G(c)}</button>
            <button class="tb icon" ?disabled=${c>=Te(c)} aria-label="Zoom in" title="Zoom in"
              @click=${()=>{this.zoom=Te(c)}}>+</button>
          </span>
        </div>
        <div class="ve-stage-body">${_i(e)}</div>
        <div class="under"><span class="tail">${bi}</span></div>
      </div>
    </div>`}renderBody(e){if(e.length===0){let c=this.owners.length===0&&this.ownList===void 0;return d`<div class="pe-empty">${c?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}if(this.unsupported)return d`<div class="pe-empty"><b>${Le}</b></div>`;if(this.loading)return d`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let c=this.watchId;return d`<div class="pe-empty">
        <span>Could not read this watch's voice settings: ${this.loadError}</span>
        ${c===void 0?m:d`<button class="pe-btn" @click=${()=>{this.load(c)}}>Try again</button>`}
      </div>`}let n=this.record;if(n===void 0)return d`<div class="pe-empty">Loading…</div>`;let s=this.draft;if(s===void 0&&n.revision>0)return d`<div class="pe-empty"><b>${Le}</b></div>`;if(s===void 0){let c=this.watchId===void 0?void 0:F(this.watchId),h=this.watchId;return d`<div class="pe-empty"><b>${jn}</b><span>${Y}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${ge}</button>
        ${c?.dirty&&h!==void 0?d`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when voice settings are here again.</span>
          <button class="pe-btn" @click=${()=>{pe(h),this.requestUpdate()}}>Discard the kept edits</button>`:m}
      </div>`}let o=this.viewHost();if(o===void 0)return d`<div class="pe-empty">Loading…</div>`;let r=this.fittedColumns(),a=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"",l=n.revision<=0;return d`${l&&this.barHost===void 0?xn():m}
    <div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${r.left}px;--wa-right:${r.right}px;${a}`}>
      <div class="column left">
        ${Vi(o)}
        ${Ti(o,this.phrasesLinks())}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(o,e)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${Pi(o)}
      </div>
    </div>
    ${l?m:this.renderFoot(n,s.document,s.dirty)}`}renderFoot(e,n,s){let o=Oe(n),r=$e({record:e,size:o.size,limit:o.limit,noun:"voice settings",historyState:this.historyState}),a=this.watchId;return d`${Kt({status:r,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?Jt({noun:"voice settings",record:e,entries:this.history,historyState:this.historyState,dirty:s,restoring:this.restoring,onRetry:()=>{a!==void 0&&(this.historyState="loading",this.loadHistory(a))},onRestore:l=>{this.historyOpen=!1,this.askRestore(l)},onClosed:()=>{this.historyOpen=!1}}):m}
    ${this.rawOpen?Yt({noun:"voice settings",document:n,revision:e.revision,dirty:s,copied:this.rawCopied,onCopy:l=>{Xt(l).then(c=>{this.rawCopied=c})},onClosed:()=>{this.rawOpen=!1}}):m}`}renderRestoreAsk(e){let n=this.record,s=fs(e.entry.updated_at);return d`<dialog class="pe-ask" aria-labelledby="ve-ask-title"
      @cancel=${o=>{this.restoring&&o.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="ve-ask-title">Restore revision ${e.entry.revision}?</h3>
      <p>${vs(e.entry.updated_by)}${s?` ${s}`:""}, ${ps(e.entry.size)}.</p>
      ${e.summary?d`<p class="pe-muted">${e.summary}</p>`:m}
      <p>It is saved again as a new revision${n?`, after revision ${n.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[yt,ut,pt,ft,vt,mt,gt,wt,on,Sn,se`
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
  `,Di,vn,Zt,It]}};v([_({attribute:!1})],f.prototype,"hass",2),v([_({attribute:!1})],f.prototype,"owners",2),v([_({attribute:!1})],f.prototype,"ownerId",2),v([_({type:Boolean,reflect:!0})],f.prototype,"narrow",2),v([_({attribute:!1})],f.prototype,"icons",2),v([_({attribute:!1})],f.prototype,"iconsTick",2),v([_({attribute:!1})],f.prototype,"haMenu",2),v([_({attribute:!1})],f.prototype,"onHaMenu",2),v([_({attribute:!1})],f.prototype,"onBack",2),v([_({attribute:!1})],f.prototype,"barActions",2),v([_({attribute:!1})],f.prototype,"shellOwnsWatch",2),v([_({attribute:!1})],f.prototype,"barHost",2),v([w()],f.prototype,"watchId",2),v([w()],f.prototype,"record",2),v([w()],f.prototype,"unsupported",2),v([w()],f.prototype,"voices",2),v([w()],f.prototype,"voicesState",2),v([w()],f.prototype,"cloudTTS",2),v([w()],f.prototype,"loading",2),v([w()],f.prototype,"loadError",2),v([w()],f.prototype,"history",2),v([w()],f.prototype,"historyState",2),v([w()],f.prototype,"note",2),v([w()],f.prototype,"restoreAsk",2),v([w()],f.prototype,"restoring",2),v([w()],f.prototype,"historyOpen",2),v([w()],f.prototype,"rawOpen",2),v([w()],f.prototype,"rawCopied",2),v([w()],f.prototype,"ownList",2),v([w()],f.prototype,"topMenuOpen",2),v([w()],f.prototype,"watchMenuOpen",2),v([w()],f.prototype,"voicePlaces",2),v([w()],f.prototype,"otherVoice",2),v([w()],f.prototype,"devicesOpen",2),v([w()],f.prototype,"linking",2),v([w()],f.prototype,"devicesNote",2),v([w()],f.prototype,"replaceAsk",2),v([w()],f.prototype,"freshAsk",2),v([w()],f.prototype,"zoom",2),v([w()],f.prototype,"columns",2),v([w()],f.prototype,"hostWidth",2),v([w()],f.prototype,"hostHeight",2);customElements.get("wa-voice-editor")||customElements.define("wa-voice-editor",f);export{Qe as VE_COLUMNS_KEY,f as WaVoiceEditor,ws as watchVoiceSummary};
