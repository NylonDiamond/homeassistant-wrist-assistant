import{A as Z,B as Cn,C as Dn,D as On,E as En,F as Rn,G as An,H as he,I as Hn,J as Ln,K as Wn,L as Ne,M as Mn,N as Nn,a as de,b as Oe,c as Ee,d as E,e as X,f as Re,g as Ae,h as He,i as N,j as bn,k as yn,l as kn,m as xn,n as $n,o as Le,p as Sn,q as Vn,r as Tn,s as We,t as R,u as F,v as _n,w as le,x as In,y as Pn,z as Me}from"./chunk-GWWN5AK2.js";import{T as De,U as wn,W as ce,c as gn}from"./chunk-QKO2AN2A.js";import{B as vn,D as mn,b as ln,i as hn,l as un,u as pn,w as fn}from"./chunk-ZZWBYO74.js";import{p as _e,q as G,r as Ie,s as Pe,w as an,x as Ce,y as cn,z as dn}from"./chunk-PEI2F5V4.js";import{b as Ot,d as Et,e as ye,f as Rt}from"./chunk-ZOJGMATP.js";import{a as Fn,b as Un,c as qn,d as jn,e as zn,f as Bn,g as Kn}from"./chunk-UJNCYNEK.js";import"./chunk-4NI3O7TX.js";import{a as Ve,b as Te,c as Bt,d as Kt,e as Jt,f as Yt,g as Gt,h as Xt,i as Zt}from"./chunk-LFGPE6IC.js";import{d as nn}from"./chunk-AMGXZUWS.js";import{a as jt,b as zt,d as sn,e as on}from"./chunk-K4UWPMSJ.js";import{c as Qt,d as en,f as tn}from"./chunk-UYXASAN6.js";import{c as pt}from"./chunk-ZKYND2IQ.js";import{Od as Jn,Qb as Lt,Qd as Yn,Rb as Wt,Sb as re,Td as Gn,Ub as ae,Vb as Mt,Wb as Nt,X as xe,Yb as Se,Zb as Ft,aa as $e,cb as Ht,ec as Ut,gc as qt,ua as At,z as ke}from"./chunk-TXM3PI3S.js";import{a as It,b as Pt,c as Ct}from"./chunk-OYAL4D6G.js";import{Ah as bt,Bh as yt,Ch as kt,Eg as j,Gg as me,Jg as ot,Lg as rt,Lh as xt,Mg as at,Ng as ct,Og as dt,Pg as lt,Xg as ht,b as se,d,eh as ut,g as m,ig as st,j as it,k as _,l as w,ph as z,qh as k,uh as ft,wh as vt,xh as mt,yh as gt,zh as wt}from"./chunk-KWDEJLUK.js";import"./chunk-UPANJPAF.js";import{Q as V,R as rn,j as D}from"./chunk-ESIOP3D4.js";import{B as $t,Q as St,Sa as _t,U as oe,Ua as Dt,Va as C,Wa as we,X as Vt,Xa as be,Y,Z as ge,_ as Tt}from"./chunk-2ZMALKUC.js";import{a as v}from"./chunk-LO2NM3CE.js";var I="phrases";function A(n,i){return n!=null&&Object.hasOwn(n,i)?n[i]:void 0}function B(n){if(!Array.isArray(n))return;let i=new Set,e=[];for(let t of n){if(!D(t)||typeof t.id!="string"||t.id==="")return;let s=t.id.toUpperCase();if(i.has(s))return;i.add(s),e.push([s,t])}return e}function Li(n,i,e){let t=n===null?void 0:n,s=i===null?void 0:i,o=e===null?void 0:e,r=t===void 0?[]:B(t),a=s===void 0?void 0:B(s),l=o===void 0?void 0:B(o);if(r===void 0||a===void 0||l===void 0)return V(s,t)?o:s;let c=new Map(r),h=new Map(a),u=new Map(l),y=(b,$)=>{let T=c.get(b);return T===void 0||!V($,T)},g=(b,$,T)=>y(b,$)?$:T,S=(b,$)=>c.has(b)&&!y(b,$)?void 0:$,x=a.map(([b])=>b).filter(b=>c.has(b)),H=r.map(([b])=>b).filter(b=>h.has(b)),P=x.length!==H.length||x.some((b,$)=>b!==H[$]),ve=P?a:l,p=P?l:a,M=P,O=[];for(let[b,$]of ve){let T=(M?u:h).get(b);if(T!==void 0)O.push(M?g(b,$,T):g(b,T,$));else{let nt=S(b,$);nt!==void 0&&O.push(nt)}}for(let[b,$]of p){if((M?h:u).has(b))continue;let T=S(b,$);T!==void 0&&O.push(T)}let ie=b=>Array.isArray(b)&&b.length===O.length&&O.every(($,T)=>$===b[T]);return ie(o)?o:ie(s)?s:O}function Xn(n,i,e){let t=rn(n,i,e),s=Li(n==null?e[I]:A(n,I),A(i,I),A(e,I)),o=A(t,I);if(s===o)return t;if(s===void 0){if(!Object.hasOwn(t,I))return t;let{[I]:r,...a}=t;return a}return t===e||t===i?{...t,[I]:s}:(t[I]=s,t)}function Zn(n,i,e){let t=new Set([...Object.keys(i),...Object.keys(e)]),s=[];for(let o of t){if(o===I){let h=new Map(B(A(n,I))??[]),u=B(A(i,I)),y=new Map(B(A(e,I))??[]);if(u===void 0)continue;u.some(([S,x])=>{let H=y.get(S),P=h.get(S);return H!==void 0&&!V(x,H)&&(P===void 0||!V(x,P)&&!V(H,P))})&&s.push(o);continue}let r=A(n,o),a=A(i,o),l=A(e,o),c=h=>n==null||!V(h,r);c(a)&&c(l)&&!V(a,l)&&s.push(o)}return s.sort()}var Qn=100,Wi=3,ue=class{constructor(i,e){this._undo=[];this._redo=[];this._replaced=[];this._base=i,this._revision=e,this._document=i}get base(){return this._base}get revision(){return this._revision}get document(){return this._document}get canUndo(){return this._undo.length>0}get canRedo(){return this._redo.length>0}get replaced(){return this._replaced}get dirty(){let i=this._dirty;if(i!==void 0&&i.document===this._document&&i.base===this._base)return i.value;let e=this._document!==this._base&&!V(this._document,this._base);return this._dirty={document:this._document,base:this._base,value:e},e}apply(i,e){if(i===this._document||V(i,this._document))return(e===void 0||e!==this._coalesceKey)&&(this._coalesceKey=void 0),!1;if(e!==void 0&&e===this._coalesceKey&&this._undo.length>0){let t=this._undo[this._undo.length-1];return V(i,t)?(this._undo.pop(),this._document=t,this._coalesceKey=void 0):this._document=i,this._redo=[],!0}return this.pushUndo(this._document),this._redo=[],this._document=i,this._coalesceKey=e,!0}endCoalesce(){this._coalesceKey=void 0}undo(){this._coalesceKey=void 0;let i=this._undo.pop();return i===void 0?!1:(this._redo.push(this._document),this._document=i,!0)}redo(){this._coalesceKey=void 0;let i=this._redo.pop();return i===void 0?!1:(this.pushUndo(this._document),this._document=i,!0)}discard(){return this._coalesceKey=void 0,this.apply(this._base)}rebase(i,e){return e<this._revision?(this._replaced=[],!1):this.mergeOnto(i,e)}restart(i,e){return this.mergeOnto(i,e)}mergeOnto(i,e){this._coalesceKey=void 0;let t=this._base;this._replaced=this._document===t?[]:Zn(t,this._document,i);let s=new Map,o=u=>{let y=s.get(u);if(y!==void 0)return y;let g=u===t?i:Xn(t,u,i);return g!==i&&V(g,i)&&(g=i),s.set(u,g),g},r=this._document,a=[...this._undo,this._document,...this._redo.slice().reverse()].map(o),l=this._undo.length,c=[],h=0;return a.forEach((u,y)=>{let g=c[c.length-1];g!==void 0&&(g===u||V(g,u))?y===l&&(c[c.length-1]=u):c.push(u),y===l&&(h=c.length-1)}),this._undo=c.slice(0,h),this._document=c[h],this._redo=c.slice(h+1).reverse(),this._base=i,this._revision=e,this._document!==r&&!V(this._document,r)}saved(i,e){e<this._revision||(this._coalesceKey=void 0,this._base=i,this._revision=e)}get saving(){return Q.has(this)}get saveDone(){return Q.get(this)}pushUndo(i){this._undo.push(i),this._undo.length>Qn&&this._undo.splice(0,this._undo.length-Qn)}},Q=new WeakMap;function ei(n,i){if(Q.has(n))return Promise.resolve({ok:!1,revision:n.revision,merged:!1,code:"busy",message:"These voice settings are being saved already."});let e=Mi(n,i).finally(()=>Q.delete(n));return Q.set(n,e),e}async function Mi(n,i){let e=!1,t=new Set,s=()=>t.size===0?{}:{replaced:[...t].sort()},o=(r,a,l)=>({ok:!1,revision:n.revision,merged:e,code:r,message:a,...l===void 0?{}:{problems:l}});for(let r=1;;r++){let a=n.document,l=Ln(a);if(l.length>0)return o("invalid",l.join(" "),l);let c;try{({revision:c}=await i.save(n.revision,a))}catch(h){let{code:u="unknown",message:y}=C(h);if(u!=="conflict"||r>=Wi)return o(u,y);let g;try{g=await i.fetch()}catch(S){let x=C(S);return o(x.code??"unknown",x.message)}if(!D(g)||!(g.revision>0)||!D(g.document))return o("no_record","Home Assistant holds no voice settings for this watch.");g.revision<n.revision?n.restart(g.document,g.revision):n.rebase(g.document,g.revision);for(let S of n.replaced)t.add(S);if(e=!0,!n.dirty)return{ok:!0,revision:n.revision,merged:e,alreadySaved:!0};continue}return n.saved(a,c),{ok:!0,revision:n.revision,merged:e,...s()}}}var L=new Map;function U(n){return L.get(n)}function Fe(n,i,e){let t=L.get(n);if(t!==void 0&&e<=0)return{draft:t,mergedIntoEdits:!1,replaced:[]};if(t===void 0||e<t.revision&&!t.dirty){let r=new ue(i,e);return L.set(n,r),{draft:r,mergedIntoEdits:!1,replaced:[]}}if(e===t.revision)return{draft:t,mergedIntoEdits:!1,replaced:[]};let s=t.dirty,o=e<t.revision?t.restart(i,e):t.rebase(i,e);return{draft:t,mergedIntoEdits:s&&o,replaced:s?t.replaced:[]}}function Ue(n){let i=L.get(n);if(i===void 0){let e=new ue(X(),0);return L.set(n,e),e}return i.revision>0&&!i.saving&&i.restart(X(),0),i}function pe(n){L.delete(n)}function qe(){for(let n of L.values())if(n.dirty)return!0;return!1}function ti(){L.clear()}var fe="linkIds",ee="phrases",Ni=["defaultAssistAgentId","defaultSpeakers","defaultTTSEngine","phrases"];var ni="Phrases and defaults";function W(n){let i=n?.[fe],e=D(i)?i[ee]:void 0;return typeof e=="string"&&e!==""?e:void 0}function ii(n){let i=D(n)?n.voice:void 0;if(!D(i))return;let e={};for(let[t,s]of Object.entries(i))!D(s)||typeof s.unit!="string"||!Array.isArray(s.owners)||(e[t]={unit:s.unit,owners:s.owners.filter(o=>typeof o=="string")});return e}function je(n,i,e){let t=W(n),s=t===void 0?[]:e?.[t]?.owners??[];return[i,...s.filter(o=>o!==i)]}var Fi="These are this watch's phrases. Switch off another watch to unlink it.",Ui=`${Y} Phrases can go on this watch after that.`,qi="waiting for iPhone",si="Phrases and defaults are on",oi="On means the watch has these phrases and defaults. An edit on one watch shows on all of them. Each watch keeps its own watch voice and Silent Mode setting.";function ri(n){let i=n.device.name;return n.on?`Unlink ${i}. It keeps a copy of the phrases as they are now.`:`Put them on ${i}. An edit on one watch then shows on both.`}function ai(n,i,e,t,s=new Set){let o=new Set(je(i,e,t));return n.filter(r=>r.kind==="watch").map(r=>{let a=r.ownerId===e,l=o.has(r.ownerId);return a?{device:r,on:!0,here:!0,stuck:Fi}:!l&&s.has(r.ownerId)?{device:r,on:l,here:!1,stuck:Ui,tag:qi}:{device:r,on:l,here:!1}})}function ci(n,i,e){let t=n.filter(s=>s!==i);if(t.length!==0){if(t.length===1){let s=e.find(o=>o.ownerId===t[0])?.name;return s===void 0?"On 2 watches":`Also on ${s}`}return`On ${n.length} watches`}}function di(n,i,e){let t=n.filter(o=>o!==i);if(t.length===0)return;let s=t.map(o=>e.find(r=>r.ownerId===o)?.name??"another watch");return`Also on ${pn(s)}. An edit here shows there too.`}function li(n,i){if(n===void 0)return!1;let e=W(n);return e!==void 0&&e===i?!1:e!==void 0||R(n).length>0}function hi(n){return`Replace the phrases on ${n}? Its own are lost.`}var ze="Its watch voice and Silent Mode setting stay as they were.";function ui(n){let{code:i,message:e}=C(n);switch(i){case"unknown_device":return"That watch is not paired with this Home Assistant any more.";case"not_found":return"This watch's voice settings are not saved yet. Save first, then try again.";case"unit_taken":return"That watch has phrases of its own.";case"not_for_iphone":return"An iPhone keeps no phrases.";case"awaiting_move":return`${Y} Try again after that.`;case"unknown_command":return"This version of the integration cannot share phrases between watches. Update it first.";default:return e}}function pi(n){let i=n[fe];if(!D(i)||!Object.hasOwn(i,ee))return n;let{[ee]:e,...t}=i;return Object.keys(t).length===0?He(n,fe):Ae(n,fe,t)}function Be(n,i=!1){let e=X(),t=n;for(let s of Ni)t=Object.hasOwn(e,s)?Ae(t,s,e[s]):He(t,s);return i?pi(t):t}function fi(n){return Be(n)===n}function vi(n){if(!(n.length<2))return{question:`These phrases and defaults are on ${n.length} watches.`,here:"Here only",all:`On all ${n.length} watches`,count:n.length}}var ji=3;async function mi(n,i){for(let e=1;;e++){let t;try{t=await n.read(i)}catch(r){let{code:a="unknown",message:l}=C(r);return{ok:!1,code:a,message:l}}let s=t.revision>0?E(t.document):void 0;if(s===void 0)return{ok:!0,unlinked:!1};let o=pi(s);if(o===s)return{ok:!0,unlinked:!1};try{return await n.save(i,t.revision,o),{ok:!0,unlinked:!0}}catch(r){let{code:a="unknown",message:l}=C(r);if(a!=="conflict"||e>=ji)return{ok:!1,code:a,message:l}}}}var zi={defaultAssistAgentId:"the conversation agent",defaultTTSEngine:"the text to speech engine",defaultSpeakers:"the speakers",phrases:"the phrases",watchSpeakReplyInSilentMode:"Speak even in Silent Mode",watchSpeechVoiceIdentifier:"the watch voice"};function Bi(n){return zi[n]??"a setting this panel does not show"}function Ke(n){if(n.length===0)return"";let i=[...new Set(n.map(Bi))];return`Another save also changed ${i.length===1?i[0]:`${i.slice(0,-1).join(", ")} and ${i[i.length-1]}`}. ${i.length===1?"Your version replaced it.":"Your versions replaced them."}`}function gi(n){if(n.ok){if(n.alreadySaved===!0)return{kind:"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${n.revision}.`};let e=n.replaced??[];return e.length>0?{kind:"warn",text:`Saved. ${Ke(e)}`}:n.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let i=(n.message??"").trim();switch(n.code){case"conflict":return{kind:"warn",text:"Not saved. The voice settings kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds voice settings for this watch. Your edits are kept, so save again."};case"invalid":{let e=n.problems??[];return e.length>0?{kind:"err",text:`Not saved. ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the voice settings${i===""?".":`: ${i}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${Dt}`};case"busy":return{kind:"warn",text:"Already saving these voice settings. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the voice settings just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${i===""?".":`: ${i}`}`}}}var wi=[["defaults","Defaults"],["watch","On the watch"]],bi={defaults:"What Assist and Speak use when a tile, a slot or a phrase picks nothing of its own.",watch:"How the watch itself speaks a reply."},Ki="The voice defaults, the phrase library and the watch's own speech. A save reaches the watch the next time it checks.",yi="Pick from List shows these phrases on the watch. Tap one to edit it.",Ji={defaults:{color:z.content,icon:"content"},watch:{color:z.content,icon:"watch"},phrase:{color:z.content,icon:"text"},look:{color:z.look,icon:"look"},speech:{color:z.content,icon:"content"}},Yi="#ab47bc",ne="voice-editor",ki=44,xi=22;function q(n,i){let e=n.states[i]?.attributes?.friendly_name;return typeof e=="string"&&e.trim()!==""?e:i}function Gi(n,i){let e=i.indexOf(".");return{entityId:i,displayName:i===""?"":q(n,i),domain:e>0?i.slice(0,e):""}}function $i(n,i,e,t){return n.icons.render(i,e,t)??d`<span class="vo-glyph-dot" style=${`background:${t}`}></span>`}function Je(n){if(typeof n!="string"||n==="")return{fill:"#D88CC4",ink:"#D88CC4"};if(n.toUpperCase()==="#RAINBOW")return{fill:"conic-gradient(#FF3B30, #FF9500, #FFCC00, #34C759, #007AFF, #AF52DE, #FF3B30)",ink:"#FF9500"};if(n.toUpperCase().startsWith("GRADIENT|")){let i=n.split("|").slice(1).filter(e=>/^#[0-9a-fA-F]{6}$/.test(e));if(i.length>=2)return{fill:`linear-gradient(135deg, ${i.join(", ")})`,ink:i[0]};if(i.length===1)return{fill:i[0],ink:i[0]}}return{fill:n,ink:n}}function Si(n,i){return an(n.uiState,ne,i)}function Xi(n,i){Ce(n.uiState,ne,i,!Si(n,i)),n.requestUpdate()}function te(n,i,e,t,s={}){let o=Si(n,i),r=Ji[i];return kt({color:r.color,icon:k(r.icon),title:e,open:o,onToggle:()=>Xi(n,i),...s.summary===void 0||s.summary===""?{}:{summary:s.summary},dot:s.dot===!0,id:`${ne}:${i}`},o?t:d``)}var Ye="vo:pick";function K(n){let i=n.uiState.get(Ye);if(typeof i=="string"&&i.startsWith("phrase:")){let e=_n(n.document,i.slice(7));if(e!==void 0)return{phrase:e}}return{section:i==="watch"?"watch":"defaults"}}function Ge(n,i){n.uiState.set(Ye,i),n.requestUpdate()}function Xe(n,i){n.uiState.set(Ye,`phrase:${i}`),n.requestUpdate()}function Vi(n){return"phrase"in K(n)?(Ge(n,"defaults"),!0):!1}function Zi(n){let i;n.edit(e=>{let t=Pn(e);return i=t.id,t.document}),i!==void 0&&(Ce(n.uiState,ne,"phrase",!0),Xe(n,i))}function Qi(n,i){if(i==="defaults"){let s=N(n.document);return s.speakers.length===0?"No speakers":s.speakers.map(r=>q(n.hass,r)).join(", ")}let e=Le(n.document),t=e===void 0?void 0:n.voices.find(s=>s.id===e);return e===void 0?"System voice":t!==void 0?We(t):e}function Ti(n){let i=K(n),e="section"in i?i.section:void 0;return d`<section class="card lc vo-voice-card" aria-label="Voice"
    style=${`--c: var(--wa-lc-pages, #26a69a); --thumb-w: ${ki}px; --thumb-h: ${xi}px`}>
    <div class="lc-head">
      <span class="swatch">${Gn()}</span><span class="lc-title">Voice</span>
      <span class="lc-sub" title=${Ki}>for the watch</span>
    </div>
    <div class="layers vo-section-list" role="list">
      ${wi.map(([t,s])=>{let o=t===e,r=()=>Ge(n,t);return d`<div class="layer vo-section-row ${o?"hl":""}" data-section=${t} role="listitem" tabindex="0"
          aria-current=${o?"true":"false"} aria-label=${s} title=${bi[t]}
          @click=${r}
          @keydown=${a=>{a.target!==a.currentTarget||a.key!=="Enter"&&a.key!==" "||(a.preventDefault(),r())}}>
          <span class="grip" aria-hidden="true"></span>
          <span class="thumb vo-thumb" aria-hidden="true">${k(t==="watch"?"watch":"content")}</span>
          <span class="name"><b><span class="nm-t">${s}</span></b><small>${Qi(n,t)}</small></span>
          <span class="right"></span>
        </div>`})}
    </div>
  </section>`}function es(n,i){let e=Je(i.color),t=typeof i.icon=="string"&&i.icon!==""?i.icon:"speaker.wave.2";return d`<span class="thumb vo-thumb" style=${`--c:${e.ink}`} aria-hidden="true"><span class="vo-thumb-glyph">${$i(n,t,14,e.ink)}</span></span>`}function ts(n){let i=he(n);return i.length>0?`Needs a ${i.join(" and a ")}`:typeof n.message=="string"?n.message:""}function ns(n,i,e,t,s){let o=F(i),r=s!==void 0&&F(s).toUpperCase()===o.toUpperCase(),a=le(i),l=ts(i),c=he(i).length>0,h=()=>Xe(n,o);return d`<div class="layer vo-phrase-row ${r?"hl":""}" data-phrase=${o} role="listitem" tabindex="0"
    aria-current=${r?"true":"false"} aria-label=${a} title=${`${a} \xB7 ${l}`}
    @click=${u=>{u.target instanceof Element&&u.target.closest("button")||h()}}
    @keydown=${u=>{u.target!==u.currentTarget||u.key!=="Enter"&&u.key!==" "||(u.preventDefault(),h())}}>
    <span class="grip" aria-hidden="true"></span>
    ${es(n,i)}
    <span class="name"><b><span class="nm-t">${a}</span></b><small class=${c?"vo-needs":""}>${l}</small></span>
    <span class="right">
      <span class="acts">
        <button type="button" class="icon" ?disabled=${n.busy||e===0} title="Move up" aria-label=${`Move ${a} up`}
          @click=${()=>n.edit(u=>Z(u,o,e-1))}>${k("up")}</button>
        <button type="button" class="icon" ?disabled=${n.busy||e===t-1} title="Move down" aria-label=${`Move ${a} down`}
          @click=${()=>n.edit(u=>Z(u,o,e+1))}>${k("down")}</button>
        <button type="button" class="icon danger" ?disabled=${n.busy} title="Remove" aria-label=${`Remove ${a}`}
          @click=${()=>n.edit(u=>Me(u,o))}>${k("delete")}</button>
      </span>
    </span>
  </div>`}function _i(n,i){let e=R(n.document),t=K(n),s="phrase"in t?t.phrase:void 0,o=In(n.document);return d`<section class="card lc vo-phrases-card" aria-label="Phrases"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${ki}px; --thumb-h: ${xi}px`}>
    <div class="lc-head">
      <span class="swatch">${k("list")}</span><span class="lc-title">Phrases</span>
      <span class="lc-sub">${e.length} of ${Oe}</span>
      ${i?.badge===void 0?m:d`<span class="badge vo-linked" title=${i.badgeTitle??i.badge}>${i.badge}</span>`}
      <span class="spacer"></span>
      ${i===void 0?m:d`<button type="button" class="lc-btn vo-dev-open ${i.open?"on":""}" aria-expanded=${i.open?"true":"false"}
        title="Pick the watches these phrases and defaults are on" @click=${()=>i.onDevices()}>${k("watch")}<span>Devices</span></button>`}
      <button type="button" class="lc-btn pri vo-add-phrase" aria-label="Add phrase" ?disabled=${n.busy||o}
        title=${o?`The watch takes ${Oe} phrases at most.`:"Add a phrase at the end"}
        @click=${()=>Zi(n)}>${k("plus")}<span>Add</span></button>
    </div>
    ${i?.open===!0?i.menu:m}
    ${e.length===0?d`<div class="lc-note">No phrases yet. A phrase is a message Pick from List and Speak Phrase can say on your speakers.</div>`:d`<div class="layers vo-phrase-list" role="list">${e.map((r,a)=>ns(n,r,a,e.length,s))}</div>`}
  </section>`}function Ii(n){let{width:i,height:e}=n.screen,t=n.scale,s=R(n.document),o=K(n),r="phrase"in o?F(o.phrase).toUpperCase():void 0,a=s.map(c=>{let h=F(c),u=Je(c.color),y=r!==void 0&&h.toUpperCase()===r,g=le(c),S=typeof c.icon=="string"&&c.icon!==""?c.icon:"speaker.wave.2",x=c.displayMode==="text";return d`<button type="button" class="vo-say ${x?"vo-words":"vo-glyph"} ${y?"on":""}" style=${`--fill:${u.fill};--ink:${u.ink}`}
      title=${g} aria-label=${g} aria-pressed=${y?"true":"false"} @click=${()=>Xe(n,h)}>
      ${x?d`<span class="vo-say-text">${g}</span>`:d`<span class="vo-say-well">${$i(n,S,Math.round(16*t),"#fff")}</span>
        <span class="vo-say-label">${g}</span>`}
    </button>`}),l=d`<div class="vo-screen" role="group" aria-label="Pick from List on the watch"
    style=${`width:${Math.round(i*t)}px;height:${Math.round(e*t)}px;--vo-s:${t}`}>
    <div class="vo-screen-title">Phrases</div>
    ${s.length===0?d`<p class="vo-screen-note">No phrases yet.</p>`:d`<div class="vo-say-list">${a}</div>`}
  </div>`;return sn({width:i,height:e},t,l,"Pick from List on the watch")}function Pi(n){let i=R(n.document).length;return[`${i} ${i===1?"phrase":"phrases"}`]}function is(n){let i=K(n);return("phrase"in i?["phrase","look","speech"]:[i.section]).map(t=>({module:ne,section:t}))}function Ci(n){let i=K(n),e=is(n),t=cn(n.uiState,e),s,o;if("phrase"in i){let r=le(i.phrase);s=d`<div class="crumbs"><button class="root" title="The voice defaults" @click=${()=>Ge(n,"defaults")}>Voice</button><span class="sep">›</span><span class="kchip" style=${`--k:${Je(i.phrase.color).ink}`}>Phrase</span><span class="nm" title=${r}>${r}</span></div>`,o=ds(n,i.phrase)}else{let r=wi.find(([a])=>a===i.section)?.[1]??"";s=d`<div class="crumbs"><span class="kchip" style=${`--k:${Yi}`}>Voice</span><span class="nm" title=${r}>${r}</span></div>`,o=d`<p class="vo-note">${bi[i.section]}</p>
      ${i.section==="defaults"?ss(n):rs(n)}
      <p class="vo-note vo-pick-note">Pick a phrase to edit it, or add one.</p>`}return d`<div class="insp-head">
      ${s}
      <button class="expand" @click=${()=>{dn(n.uiState,e,!t),n.requestUpdate()}}>${t?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${o}</div>`}function Di(n,i,e,t){let s=wn(n.hass.states),o=ce(s,e),r=h=>h.missing?`${h.entityId} (not found)`:h.name,a=h=>Se(r(h),e.includes(h.entityId),u=>t(h.entityId,u)),l=s.filter(h=>h.announces),c=o.filter(h=>!l.some(u=>u.entityId===h.entityId));return d`<div class="vo-sub-h"><span>${i}</span></div>
    <div class="vo-list" role="group" aria-label=${i}>
      ${o.length===0?d`<div class="hint">No media players in Home Assistant.</div>`:m}
      ${l.length>0?d`<div class="vo-group">Speakers</div>${l.map(a)}`:m}
      ${c.length>0?d`${l.length>0?d`<div class="vo-group">Other media players</div>`:m}${c.map(a)}`:m}
    </div>`}function ss(n){let i=N(n.document),e=as(n,i.engine),t=i.engine===void 0?"No engine":e.find(([r])=>r===i.engine)?.[1]??q(n.hass,i.engine),s=[i.agent===void 0?"Default agent":q(n.hass,i.agent),t].join(" \xB7 "),o=d`<fieldset class="vo-body" ?disabled=${n.busy} aria-label="Defaults">
    <div class="vo-stack">${Ut({hass:n.hass},"Conversation agent",Gi(n.hass,i.agent??""),r=>n.edit(a=>bn(a,r.entityId)),"vo:agent",{domain:"conversation",clearable:!0})}</div>
    <div class="hint">${i.agent===void 0?"None picked: Home Assistant's own default agent answers.":"Assist uses this agent unless a tile or a slot picks its own."}</div>
    <div class="vo-stack">${ae("Text to speech engine",i.engine??"",e,r=>n.edit(a=>yn(a,r)),{snapBack:!0})}</div>
    <div class="hint ${i.engine===void 0?"warn":""}">${i.engine===void 0?"Not set. Speaking on speakers needs an engine.":"Speakers say messages and replies with this engine unless a tile, a slot or a phrase picks its own."}</div>
    ${Di(n,"Speakers",i.speakers,(r,a)=>n.edit(l=>kn(l,r,a)))}
    <div class="hint">${i.speakers.length===0?"None picked. A slot or a phrase set to speakers with none of its own then plays nowhere.":"Assist, Speak and phrases play here unless they pick their own."}</div>
  </fieldset>`;return te(n,"defaults","Defaults",o,{summary:s,dot:i.agent!==void 0||i.engine!==void 0||i.speakers.length>0})}function os(n,i){let e=[{value:"",label:"System voice"}];i!==void 0&&!n.some(t=>t.id===i)&&e.push({value:i,label:`${i} (not on this watch)`});for(let t of Tn(n))for(let s of t.voices)e.push({value:s.id,label:We(s),group:t.language});return e}function rs(n){let i=xn(n.document),e=Le(n.document),t=os(n.voices,e),s=[];for(let c of t){let h=s[s.length-1];h!==void 0&&h.group!==void 0&&h.group===c.group?h.options.push(c):s.push({group:c.group,options:[c]})}let o=c=>d`<option value=${c.value} .selected=${ke(c.value===(e??""))}>${c.label}</option>`,r=n.voicesState==="unsupported"?"Update the integration to list this watch's voices.":n.voicesState==="error"?"Could not read this watch's voices.":n.voicesState==="ready"&&n.voices.length===0?Mn:void 0,a=d`<fieldset class="vo-body" ?disabled=${n.busy} aria-label="On the watch">
    ${Se("Speak even in Silent Mode",i,c=>n.edit(h=>$n(h,c)),!0)}
    <div class="hint">The watch speaks a reply on its own speaker even while it is in Silent Mode.</div>
    <label class="field"><span>Watch voice</span>
      <select .value=${ke(e??"")} @change=${c=>{let h=c.target.value;n.edit(u=>Sn(u,h===""?void 0:h))||n.requestUpdate()}}>
        ${s.map(c=>c.group===void 0?c.options.map(o):d`<optgroup label=${c.group}>${c.options.map(o)}</optgroup>`)}
      </select></label>
    ${r===void 0?d`<div class="hint">The voice the watch speaks a reply in. System voice follows the watch's language.</div>`:d`<div class="hint ${n.voicesState==="ready"?"":"warn"}">${r}</div>`}
  </fieldset>`,l=e===void 0?"System voice":n.voices.find(c=>c.id===e)?.name??e;return te(n,"watch","On the watch",a,{summary:l,dot:!i||e!==void 0})}function as(n,i){let e=Object.keys(n.hass.services?.tts??{}),t=ce(De(n.hass.states,e,n.cloudTTS),i===void 0?[]:[i]);return[["","Not set"],...t.map(s=>[s.entityId,s.missing?`${s.entityId} (not found)`:s.name])]}function cs(n,i){let e=N(n.document),t=Object.keys(n.hass.services?.tts??{}),s=ce(De(n.hass.states,t,n.cloudTTS),i===void 0?[]:[i]);return[["",e.engine===void 0?"Default (Not set)":`Default (${s.find(r=>r.entityId===e.engine&&!r.missing)?.name??q(n.hass,e.engine)})`],...s.map(r=>[r.entityId,r.missing?`${r.entityId} (not found)`:r.name])]}function ds(n,i){let e=F(i),t=(p,M,O=!1)=>n.edit(ie=>Rn(ie,e,p,M),O?`phrase:${e}:${p}`:void 0),s=he(i),o=p=>typeof i[p]=="string"?i[p]:"",r=d`<fieldset class="vo-body" ?disabled=${n.busy} aria-label="Phrase">
    ${re("Message",o("message"),p=>t("message",p,!0),{placeholder:"What the speakers say"})}
    ${re("Label",o("label"),p=>t("label",p,!0),{placeholder:"Its name on the watch"})}
    ${s.length>0?d`<div class="hint warn">The phrase needs a ${s.join(" and a ")} before it can be saved.</div>`:m}
    ${Mt("Display mode",String(i.displayMode??"icon"),Ee("TTSPhraseDisplayMode"),p=>t("displayMode",p),{def:de.newPhrase.displayMode})}
    <div class="hint">How Pick from List shows it: its icon, or its label.</div>
  </fieldset>`,a=i.color,l=Dn(a),c=d`<fieldset class="vo-body" ?disabled=${n.busy} aria-label="Look">
    <div class="vo-stack">${qt({icons:n.icons,symbols:n.symbols},typeof i.icon=="string"?i.icon:"",p=>t("icon",p,!0),`vo:icon:${e}`,{tint:a})}</div>
    <div class="vo-no-alpha">${Ft("Color",Cn(a)?a:void 0,p=>{p!==void 0&&t("color",p,!0)},!1,de.newPhrase.color)}</div>
    ${l===void 0?m:d`<div class="hint">${l}, which the panel does not offer. Picking a color here replaces it.</div>`}
  </fieldset>`,h=Array.isArray(i.targetSpeakers)?i.targetSpeakers.filter(p=>typeof p=="string"):[],u=N(n.document),y=typeof i.ttsEngine=="string"&&i.ttsEngine.trim()!==""?i.ttsEngine.trim():void 0,g=On(i),S=En(i),x=de.volume,H=d`<fieldset class="vo-body" ?disabled=${n.busy} aria-label="Speech">
    ${Di(n,"Speakers",h,(p,M)=>n.edit(O=>An(O,e,p,M)))}
    <div class="hint">${h.length>0?"This phrase plays only on these.":u.speakers.length>0?`None picked: the default speakers play (${u.speakers.map(p=>q(n.hass,p)).join(", ")}).`:"None picked, and no default speakers: set some in Defaults."}</div>
    ${ae("Voice engine",y??"",cs(n,y),p=>t("ttsEngine",p===""?void 0:p),{snapBack:!0})}
    ${re("Language",typeof i.language=="string"?i.language:"",p=>t("language",p,!0),{placeholder:"The engine's own"})}
    <div class="hint">A language code such as en or de, for an engine that speaks more than one.</div>
    ${ae("Speech volume",g,Ee("TTSPhraseSpeechVolumeMode"),p=>t("speechVolumeMode",p),{snapBack:!0,def:"keepCurrent"})}
    ${g==="keepCurrent"?m:d`${Nt("Target volume",S,p=>t("speechVolumePercent",p,!0),{min:x.min,max:x.max,step:x.step,def:x.default,format:p=>`${Math.round(p)}${x.unit}`})}
      <div class="vo-chips">${x.presets.map(p=>d`<button type="button" class="pe-chip ${S===p.value?"on":""}"
        aria-pressed=${S===p.value?"true":"false"} @click=${()=>t("speechVolumePercent",p.value)}>${p.label} ${p.value}%</button>`)}</div>`}
  </fieldset>`,P=R(n.document).findIndex(p=>F(p).toUpperCase()===e.toUpperCase()),ve=R(n.document).length;return d`${te(n,"phrase","Phrase",r,{summary:o("message"),dot:s.length>0})}
    ${te(n,"look","Look",c,{summary:typeof i.icon=="string"?i.icon:"",dot:!1})}
    ${te(n,"speech","Speech",H,{summary:y===void 0?"Defaults":q(n.hass,y),dot:Hn(i)})}
    <div class="vo-acts">
      <button type="button" class="pe-btn" ?disabled=${n.busy||P<=0} @click=${()=>n.edit(p=>Z(p,e,P-1))}>${k("up")}<span>Move up</span></button>
      <button type="button" class="pe-btn" ?disabled=${n.busy||P>=ve-1} @click=${()=>n.edit(p=>Z(p,e,P+1))}>${k("down")}<span>Move down</span></button>
      <button type="button" class="pe-btn pe-danger" ?disabled=${n.busy} title="Remove this phrase from the library"
        @click=${()=>n.edit(p=>Me(p,e))}>${k("delete")}<span>Remove</span></button>
    </div>
    <p class="vo-note">A menu slot that speaks this phrase keeps pointing at it after an edit. Removing it leaves such a slot with nothing to say.</p>`}var Oi=se`
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
`;Yn({dirty:qe,drop:ti});typeof window<"u"&&window.addEventListener("beforeunload",n=>{qe()&&(n.preventDefault(),n.returnValue="")});var ls=15e3,Hi=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),Ze=Hi?"\u2318":"Ctrl+",Qe={min:200,max:720,middleMin:320},et={left:280,right:340},tt="wrist-assistant-panel.voice.columns.v1",hs=24,Ei=820,us="Saving. The phrases can go on another watch once the save is done.",ps="Save or discard your edits first. The phrases go on another watch as they are saved here.";function Ri(n){return C(n).message}function J(n){return C(n).code}function Ai(n){let{code:i,message:e}=C(n);return Object.assign(new Error(e),i===void 0?{}:{code:i})}function fs(n){return n<1e3?`${n} bytes`:`${Number((n/1e3).toFixed(1))} KB`}function vs(n){let i=n?Date.parse(n):NaN;return Number.isNaN(i)?"":pt(Math.max(0,(Date.now()-i)/1e3))}function ms(n){return n==="panel"?"Saved here":"From the watch"}function gs(n){return n instanceof HTMLElement?en(n.tagName,n instanceof HTMLInputElement?n.type:void 0,n.isContentEditable):!1}function ws(){let n=document.activeElement;for(;n?.shadowRoot?.activeElement;)n=n.shadowRoot.activeElement;return n===null||n===document.body||n===document.documentElement}function bs(n){let i=E(n)??{},e=R(i).length,t=N(i).speakers.length;return`${e} ${e===1?"phrase":"phrases"}. ${t===0?"No default speakers.":`${t} default ${t===1?"speaker":"speakers"}.`}`}var f=class extends it{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=m;this.shellOwnsWatch=!1;this.barHost=void 0;this.headBar=new It(this);this.unsupported=!1;this.voices=[];this.voicesState="loading";this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.otherVoice=new Map;this.devicesOpen=!1;this.linking=!1;this.linksSeq=0;this.columns={...et};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new Bt(this);this.symbols=new At(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.voicesSeq=0;this.historySeq=0;this.subscribeSeq=0;this.cloudSeq=0;this.onReconnect=()=>{let e=this.watchId;!this.isConnected||e===void 0||(this.load(e,!0),this.loadVoices(e),this.loadCloud())};this.onScrubStart=e=>{e.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=e=>{e.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=e=>{if(e.defaultPrevented)return;let t=e.composedPath();if(!t.includes(this)&&!this.headBar.holds(t)&&!ws()||this.renderRoot.querySelector("dialog[open]"))return;let s=e.metaKey||e.ctrlKey,o=e.key.toLowerCase();if(s&&!e.altKey&&o==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1;return}if(e.key==="Escape"&&this.watchMenuOpen){e.preventDefault(),this.watchMenuOpen=!1;return}if(e.key==="Escape"&&this.devicesOpen){e.preventDefault(),this.closeDevices();return}if(!gs(t[0])){if(s&&!e.altKey&&o==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}if(e.ctrlKey&&!e.metaKey&&!e.altKey&&o==="y"){e.preventDefault(),this.redo();return}if(e.key==="Escape"&&!s&&!e.altKey){let r=this.viewHost();r!==void 0&&Vi(r)&&e.preventDefault()}}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen&&!this.watchMenuOpen&&!this.devicesOpen)return;let t=e.composedPath(),s=o=>t.some(r=>r instanceof HTMLElement&&r.classList.contains(o));this.topMenuOpen&&!s("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!s("ve-watch-picker")&&(this.watchMenuOpen=!1),this.devicesOpen&&!s("pe-dev-menu")&&!s("vo-dev-open")&&!s("pe-top-menu")&&!s("pe-ask")&&this.closeDevices()};this.addEventListener(Lt,this.onScrubStart),this.addEventListener(Wt,this.onScrubEnd),this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get watches(){return St(this.owners.length>0?this.owners:this.ownList??[])}get draft(){let e=this.watchId,t=this.record;if(!(e===void 0||t===void 0)){if(t.revision>0){let s=U(e);if(s!==void 0)return s;let o=E(t.document);return o===void 0?void 0:Fe(e,o,t.revision).draft}if(!(this.unsupported||!this.opensReady()))return U(e)??Ue(e)}}get newWatch(){let e=this.record;return e!==void 0&&e.revision<=0&&!this.unsupported}get saving(){return this.draft?.saving??!1}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Et(tt,et,Qe),this.watchSize(),this.listenForReconnect(),this.loadCloud(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.voicesSeq++,this.historySeq++,this.cloudSeq++,this.linksSeq++}willUpdate(e){if(this.hass){e.has("hass")&&(this.listenForReconnect(),this.cloudTTS===void 0&&e.get("hass")===void 0&&this.loadCloud()),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,st(this.hass).then(o=>{this.ownList=o.owners},()=>{this.ownList=[]}));let s=_t(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||e.has("ownerId"));s!==void 0&&this.openWatch(s)}this.followSave();let t=this.restoreAsk;t!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(s=>s.revision===t.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),Gt(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let t of e){if(t.target!==this){this.measureTop(t.target);continue}let s=t.contentRect;Math.abs(s.width-this.hostWidth)>=1&&(this.hostWidth=s.width),Math.abs(s.height-this.hostHeight)>=1&&(this.hostHeight=s.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let t=this.renderRoot?.querySelector(".pe-top")??void 0;t!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=t,t!==void 0&&e.observe(t))}measureTop(e){let t=e.offsetHeight;t!==this.topHeight&&(this.topHeight=t,this.style.setProperty("--pe-top-h",`${t}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let e=this.watchId;if(e===void 0)return;let t=U(e)?.saveDone;if(t===void 0||t===this.followedSave)return;this.followedSave=t;let s=()=>this.saveEnded(e);t.then(s,s)}saveEnded(e){this.requestUpdate(),this.isConnected&&(e===this.watchId?(this.reloadPending=!1,this.load(e,!0)):this.flushPending())}openWatch(e,t=!1){e!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=e,this.note=void 0,this.unsupported=!1,this.voices=[],this.voicesState="loading",this.voicesSeq++,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),this.devicesOpen=!1,this.devicesNote=void 0,this.replaceAsk=void 0,this.freshAsk=void 0,this.otherVoice=new Map,this.linksFor=void 0,t=!1),this.startSubscription(e),this.load(e,t),this.loadVoices(e),this.loadLinks(e)}loadCloud(){let e=this.hass;if(!e)return;let t=++this.cloudSeq;ut(e).then(s=>{t===this.cloudSeq&&(this.cloudTTS=gn(s))},()=>{t===this.cloudSeq&&(this.cloudTTS=!1)})}async loadVoices(e){let t=this.hass;if(!t)return;let s=++this.voicesSeq;try{let o=await ht(t,e);if(s!==this.voicesSeq||e!==this.watchId)return;this.voices=Vn(o),this.voicesState="ready"}catch(o){if(s!==this.voicesSeq||e!==this.watchId)return;this.voicesState=J(o)==="unknown_command"?"unsupported":"error"}}async load(e,t=!1){let s=this.hass;if(!s)return;if(t&&this.holdReload){this.reloadPending=!0;return}let o=++this.loadSeq;this.stopPolling(),t||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let r=await j(s,e,"voice");if(o!==this.loadSeq)return;if(t&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(r),this.loadError=void 0}catch(r){if(o!==this.loadSeq)return;Nn(r)?(this.unsupported=!0,this.loadError=void 0):t||(this.loadError=Ri(r)),this.restartDraft?.watchId===e&&(this.restartDraft=void 0)}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(e))}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(e){let t=this.watchId;this.record=e,t!==void 0&&e.revision<=0&&Ue(t);let s=e.revision>0?E(e.document):void 0;if(t===void 0||s===void 0)return;let o=this.restartDraft;o!==void 0&&o.watchId===t&&e.revision>=o.revision&&(this.restartDraft=void 0,(U(t)?.dirty??!1)||pe(t));let r=Fe(t,s,e.revision);r.replaced.length>0?this.note={kind:"warn",text:Ke(r.replaced)}:r.mergedIntoEdits&&(this.note={kind:"warn",text:"The voice settings changed somewhere else. Your edits are kept."}),W(s)!==this.linksFor&&this.loadLinks(t),this.requestUpdate()}async loadHistory(e){let t=this.hass;if(!t||this.historyState==="unsupported")return;let s=++this.historySeq;try{let o=await at(t,e,"voice");if(s!==this.historySeq||e!==this.watchId)return;this.history=Array.isArray(o?.entries)?o.entries:[],this.historyState="ready"}catch(o){if(s!==this.historySeq||e!==this.watchId)return;this.historyState=J(o)==="unknown_command"?"unsupported":"error"}}startSubscription(e){let t=this.hass;if(this.endSubscription(),!t)return;let s=++this.subscribeSeq;lt(t,e,o=>{s===this.subscribeSeq&&o.kind==="voice"&&o.revision!==(this.record?.revision??0)&&this.load(e,!0)}).then(o=>{s===this.subscribeSeq?this.unsubscribe=o:o().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let e=this.unsubscribe;this.unsubscribe=void 0,e?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||$t(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},ls))}async poll(){this.pollTimer=void 0;let e=this.hass,t=this.watchId,s=this.record;if(!(!e||t===void 0||s===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let o=await j(e,t,"voice");if(t!==this.watchId||this.record!==s)return;o.revision===s.revision?this.record={...s,delivered_revision:o.delivered_revision,delivered_at:o.delivered_at,rejected_revision:o.rejected_revision,rejected_at:o.rejected_at,rejected_reason:o.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(o),this.loadHistory(t))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,t){let s=this.draft;if(!s||this.saving)return!1;let o=s.apply(e(s.document),this.scrubKey??t);return this.requestUpdate(),o}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let e=this.icons??Qt,t=this.iconMemo;if(t!==void 0&&t.provider===e&&t.tick===this.iconsTick)return t.icons;let s=tn(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:s},s}screen(){let e=this.watches.find(t=>t.owner_watch_id===this.watchId);return($e(e?.screen_size)??xe).screen}viewHost(){let e=this.draft,t=this.hass;if(e===void 0||t===void 0)return;let s=this;return{hass:t,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.stageScale,voices:this.voices,voicesState:this.voicesState,cloudTTS:this.cloudTTS,get document(){return e.document},get busy(){return s.saving},edit:(o,r)=>this.draft===e&&this.edit(o,r),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,t=this.watchId;this.endScrub();let s=this.draft;if(!e||t===void 0||!s||this.saving||!s.dirty)return;this.note=void 0;let o=s.revision<=0,r=[],a=ei(s,{save:(c,h)=>me(e,t,"voice",c,h).then(u=>(r=we(u),u),u=>{throw Ai(u)}),fetch:async()=>{let c=await j(e,t,"voice").catch(h=>{throw Ai(h)});return{revision:c.revision,document:c.document}}});this.followedSave=s.saveDone,this.requestUpdate();let l=await a.catch(c=>({ok:!1,revision:s.revision,merged:!1,code:J(c)??"unknown",message:Ri(c)}));if(this.saveEnded(t),t===this.watchId){let c=jn(o,l.code,gi(l));this.note=l.ok?be(c,r,"phrases"):c,l.ok&&this.loadLinks(t)}}startFresh(){let e=this.watchId;e===void 0||!Tt(this.noRecordState())||(Fn("voice",e),this.note=void 0,this.requestUpdate())}get linkDevices(){return ln(this.owners.length>0?this.owners:this.ownList??[],!1)}deviceName(e){return this.linkDevices.find(t=>t.ownerId===e)?.name??"the other watch"}phraseHolders(){let e=this.watchId;return e===void 0?[]:je(this.draft?.document,e,this.voicePlaces)}get linksOn(){return this.voicePlaces!==void 0&&(this.record?.revision??0)>0&&this.linkDevices.length>1}async loadLinks(e){let t=this.hass;if(!t)return;let s=++this.linksSeq,o=this.record!==void 0&&this.record.revision>0?E(this.record.document):void 0;this.linksFor=W(o);let r;try{r=await rt(t)}catch(c){s===this.linksSeq&&J(c)==="unknown_command"&&(this.voicePlaces=void 0);return}if(s!==this.linksSeq||e!==this.watchId||(this.voicePlaces=ii(r),this.voicePlaces===void 0))return;let a=this.linkDevices.filter(c=>c.ownerId!==e),l=await Promise.all(a.map(async c=>{try{let h=await j(t,c.ownerId,"voice"),u=h.revision>0?E(h.document):void 0;return[c.ownerId,{facts:hn(h),...u===void 0?{}:{document:u}}]}catch{return}}));s!==this.linksSeq||e!==this.watchId||(this.otherVoice=new Map(l.filter(c=>c!==void 0)))}waitingWatches(){let e=new Map([...this.otherVoice].map(([t,s])=>[t,s.facts]));return un(this.owners.length>0?this.owners:this.ownList??[],e)}openDevices(){this.topMenuOpen=!1,this.devicesNote=void 0,this.devicesOpen=!0,this.watchId!==void 0&&this.loadLinks(this.watchId),this.updateComplete.then(()=>{this.renderRoot.querySelector?.(".vo-phrases-card .pe-dev-menu")?.scrollIntoView({block:"nearest"})})}closeDevices(){this.devicesOpen=!1,this.devicesNote=void 0}devicesBlocked(){if(this.saving)return us;if(this.draft?.dirty??!1)return ps}async linkTo(e,t=!1){let s=this.hass,o=this.watchId;if(!s||o===void 0||e===o||this.linking||this.devicesBlocked()!==void 0)return;let r=this.deviceName(e);if(!t&&li(this.otherVoice.get(e)?.document,W(this.draft?.document))){this.replaceAsk={watchId:o,target:e,name:r};return}this.linking=!0,this.devicesNote=void 0;try{if(await ot(s,"voice",o,[ee],[e],t),o!==this.watchId)return;this.devicesNote={kind:"ok",text:[`Now on ${r} too.`,t?ze:void 0].filter(a=>a!==void 0).join(" ")},this.load(o,!0),this.loadLinks(o)}catch(a){if(o!==this.watchId)return;!t&&J(a)==="unit_taken"?this.replaceAsk={watchId:o,target:e,name:r}:this.devicesNote={kind:"err",text:`Not added. ${ui(a)}`}}finally{this.linking=!1}}async unlinkFrom(e){let t=this.hass,s=this.watchId;if(!t||s===void 0||e===s||this.linking||this.devicesBlocked()!==void 0)return;this.linking=!0,this.devicesNote=void 0;let o=await mi({read:a=>j(t,a,"voice"),save:(a,l,c)=>me(t,a,"voice",l,c)},e);if(this.linking=!1,s!==this.watchId)return;let r=this.deviceName(e);this.devicesNote=o.ok?{kind:"ok",text:`Unlinked ${r}. It keeps its copy of the phrases.`}:{kind:"err",text:`Not unlinked from ${r}: ${o.message}`},this.load(s,!0),this.loadLinks(s)}closeReplaceAsk(){this.renderRoot?.querySelector("dialog.ve-replace-ask")?.close(),this.replaceAsk=void 0}confirmReplace(){let e=this.replaceAsk;this.closeReplaceAsk(),e!==void 0&&e.watchId===this.watchId&&this.linkTo(e.target,!0)}startFreshPhrases(){let e=this.watchId,t=this.draft;if(e===void 0||t===void 0||this.saving)return;let s=vi(this.phraseHolders());if(s===void 0){this.applyFresh(!1);return}this.freshAsk={watchId:e,question:s.question,here:s.here,all:s.all}}applyFresh(e){this.edit(t=>Be(t,e))&&(this.note={kind:"ok",text:e?"Started fresh on this watch. Save to unlink it from the others. Undo brings the phrases back.":"Started fresh. Save to clear the phrases everywhere they are. Undo brings them back."})}closeFreshAsk(){this.renderRoot?.querySelector("dialog.ve-fresh-ask")?.close(),this.freshAsk=void 0}answerFresh(e){let t=this.freshAsk;this.closeFreshAsk(),t!==void 0&&t.watchId===this.watchId&&this.applyFresh(e)}phrasesLinks(){let e=this.watchId;if(e===void 0||!this.linksOn)return;let t=this.phraseHolders(),s=this.linkDevices,o=ci(t,e,s),r=di(t,e,s),a=this.devicesBlocked();return{...o===void 0?{}:{badge:o},...r===void 0?{}:{badgeTitle:r},open:this.devicesOpen,onDevices:()=>this.devicesOpen?this.closeDevices():this.openDevices(),menu:this.devicesOpen?vn({name:ni,head:si,foot:oi,places:ai(s,this.draft?.document,e,this.voicePlaces,this.waitingWatches()),...a===void 0?{}:{blocked:a},busy:this.linking,...this.devicesNote===void 0?{}:{note:this.devicesNote},className:"at-card",colorOf:l=>this.colorOf(l),titleOf:ri,onToggle:l=>{l.on?this.unlinkFrom(l.device.ownerId):this.linkTo(l.device.ownerId)},onDone:()=>this.closeDevices()}):m}}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(e){let t=this.hass,s=this.watchId,o=this.record;if(!t||s===void 0||o===void 0||this.draft?.dirty)return;let r={entry:e,baseRevision:o.revision};this.restoreAsk=r,ct(t,s,"voice",e.revision).then(a=>{this.restoreAsk===r&&(this.restoreAsk={...r,summary:bs(a.document),links:this.restoreLinks(o.document,a.document)})},()=>{})}restoreLinks(e,t){let s=this.watchId;if(s===void 0)return[];let o=W(E(e)),r=W(E(t));return fn([{name:"phrases and defaults",holders:a=>(this.voicePlaces?.[a]?.owners??[]).filter(l=>l!==s).map(l=>this.deviceName(l)),...o===void 0?{}:{now:o},...r===void 0?{}:{restored:r}}],"watch")}async restore(){let e=this.hass,t=this.watchId,s=this.restoreAsk;if(!e||t===void 0||s===void 0||this.restoring)return;this.restoring=!0;let o;try{let r=await dt(e,t,"voice",s.entry.revision,s.baseRevision);o=be({kind:"ok",text:nn(s.entry.updated_at)},we(r),"phrases"),t===this.watchId?this.restartDraft={watchId:t,revision:r.revision}:(U(t)?.dirty??!1)||pe(t)}catch(r){let a=J(r);a==="conflict"?o={kind:"warn",text:"Not restored. The voice settings changed somewhere else, so the newest copy is shown."}:a==="no_record"?o={kind:"warn",text:"Not restored. Home Assistant no longer holds voice settings for this watch."}:a==="not_found"?o={kind:"warn",text:"Not restored. That save is no longer kept."}:a==="unknown_command"?(this.historyState="unsupported",o={kind:"warn",text:"This version of the integration cannot restore voice settings. Update it to restore an earlier save."}):o={kind:"err",text:`Could not restore: ${Ht(r)}`}}finally{this.restoring=!1,this.restoreAsk===s&&this.closeAsk()}t===this.watchId&&(this.note=o,this.load(t,!0))}render(){let e=this.watches,t=this.draft;return d`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(t,e):m}
        ${this.note?d`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:m}
      </div>
      ${this.renderBody(e)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):this.replaceAsk?this.renderReplaceAsk(this.replaceAsk):this.freshAsk?this.renderFreshAsk(this.freshAsk):m}
    `}renderReplaceAsk(e){return d`<dialog class="pe-ask ve-replace-ask" aria-labelledby="ve-replace-title"
      @close=${()=>{this.replaceAsk=void 0}}>
      <h3 id="ve-replace-title">${hi(e.name)}</h3>
      <p class="pe-muted">Its phrases and defaults become these, linked: an edit on one watch then shows on both. ${ze}</p>
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
    </dialog>`}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=Ei}renderTopBar(e,t){let s=e!==void 0&&!this.unsupported,o=s&&e.dirty;return d`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch voice">
      ${this.haMenu?d`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${k("menu")}</button>`:m}
      ${this.shellOwnsWatch?m:d`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():Jn(void 0,!1)}>${k("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${this.shellOwnsWatch?m:this.renderWatchPicker(t)}
      ${this.barHost!==void 0&&s?Pt({newWatch:this.newWatch,dirty:o,saved:Te(this.record)}):m}
      ${this.renderSyncPill(s?e:void 0)}
      ${this.renderTopMenu(s?e:void 0)}
      ${s?d`<button class="primary save ${o?"dirty":""}" ?disabled=${!o||this.saving}
          title=${o?`Save (${Ze}S). A save reaches the watch the next time it checks.`:`Nothing to save (${Ze}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?m:d`<span class="tb-saved" title=${o?"Unsaved changes":""}>${Te(this.record)}</span>
        ${Bn(qn({newWatch:this.newWatch,dirty:o,saving:this.saving}))}`}`:m}
      ${this.barActions}
    </div>`}renderSyncPill(e){let t=this.record;if(t===void 0||t.revision<=0||this.unsupported)return m;let s=e===void 0?{size:0,limit:1}:Re(e.document),o=Ve({record:t,size:s.size,limit:s.limit,noun:"voice settings",historyState:this.historyState});return d`<span class="tb-sync ${o.tone==="ok"?"ok":"warn"}" title=${`${o.state}. ${o.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${o.state}</span>
    </span>`}noRecordState(e=this.watches){return Vt(e.find(t=>t.owner_watch_id===this.watchId))}opensReady(e=this.watches){return Un(this.noRecordState(e),"voice",this.watchId)}canStartFresh(){return this.watchId!==void 0&&this.newWatch&&!this.opensReady()}renderTopMenu(e){let t=this.canStartFresh();if(e===void 0&&!t)return m;let s=this.topMenuOpen,o=a=>()=>{this.topMenuOpen=!1,a()},r=e!==void 0&&!this.newWatch;return d`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${s?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!s}}>···</button>
      ${s?d`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${e?d`<button class="row" role="menuitem" ?disabled=${!e.dirty||this.saving}
          title=${this.newWatch?"Go back to the defaults. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${o(()=>this.discard())}>Discard edits</button>`:m}
        ${r&&this.linksOn?d`<button class="row ve-dev-item" role="menuitem"
          title="Pick the watches these phrases and defaults are on"
          @click=${o(()=>this.openDevices())}>Devices…</button>`:m}
        ${r?d`<button class="row" role="menuitem" ?disabled=${this.saving||fi(e.document)}
          title="No phrases and the app's defaults again. The watch voice and Silent Mode setting stay. Undo brings the phrases back."
          @click=${o(()=>this.startFreshPhrases())}>Start fresh</button>`:m}
        ${t?d`<button class="row" role="menuitem"
          @click=${o(()=>this.startFresh())}>${ge}</button>`:m}
      </div>`:m}
    </span>`}colorOf(e){return zt(jt(this.owners.length>0?this.owners:this.ownList??[]),e)}renderWatchPicker(e){if(e.length<2)return m;let t=e.find(r=>r.owner_watch_id===this.watchId),s=this.watchMenuOpen,o=r=>{let a=r===void 0?void 0:this.colorOf(r);return d`<span class="pe-chip-glyph" style=${a?`--pe-person: ${a}`:m} aria-hidden="true">${k("watch")}</span>`};return d`<span class="picker ve-watch-picker">
      <button type="button" class="tb-browse ve-watch-btn" aria-haspopup="menu" aria-expanded=${s?"true":"false"}
        title="Choose the watch whose voice settings are shown" @click=${()=>{this.watchMenuOpen=!s}}>
        ${o(t?.owner_watch_id)}<span class="tb-browse-l">${t?oe(t,e):"Choose a watch"}</span>
        <span class="ve-caret" aria-hidden="true">${k("chevron")}</span>
      </button>
      ${s?d`<div class="pop-menu ve-watch-menu" role="menu" aria-label="Watches">
        ${e.map(r=>{let a=r.owner_watch_id===this.watchId;return d`<button type="button" class="row ve-watch-row" role="menuitemradio" aria-checked=${a?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,a||this.openWatch(r.owner_watch_id)}}>
            ${o(r.owner_watch_id)}<span class="ve-watch-name">${oe(r,e)}</span>
            <span class="ve-watch-check" aria-hidden="true">${a?k("check"):m}</span>
          </button>`})}
      </div>`:m}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=Ei?this.columns:Ot(this.hostWidth-hs,this.columns,Qe)}renderGutter(e){return d`<div class="gutter ${e}" role="separator" aria-orientation="vertical"
      aria-label=${e==="left"?"Resize the voice and phrases column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${t=>{let s=this.fittedColumns();Rt(t,{side:e,base:e==="left"?s.left:s.right,limits:Qe,onWidth:o=>{this.columns={...this.columns,[e]:o}},onEnd:()=>ye(tt,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[e]:et[e]},ye(tt,this.columns)}}></div>`}get stageScale(){return this.zoom??_e(this.narrow||this.stacked)}renderStage(e,t){let s=t.find(u=>u.owner_watch_id===this.watchId),r=$e(s?.screen_size)??xe,a=[...Pi(e),r.label],l=this.draft,c=this.stageScale,h=_e(this.narrow||this.stacked);return d`<div class="card canvas-card lit ve-canvas" aria-label="Pick from List">
      <div class="cv-head">
        <span class="cv-title">Pick from List</span>
        ${s!==void 0?d`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${oe(s,t)}</span></span>`:m}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${a.join(" \xB7 ")}><span class="fam">${a.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!l?.canUndo} title=${`Undo (${Ze}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${k("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!l?.canRedo} title=${Hi?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${k("redo")}</button>
        </span>
      </div>
      <div class="stage-area ve-stage-area">
        <div class="stage-tools" role="toolbar" aria-label="Stage tools">
          <span class="tb-zoom" role="group" aria-label="Zoom">
            <button class="tb icon" ?disabled=${c<=Pe(c)} aria-label="Zoom out" title="Zoom out"
              @click=${()=>{this.zoom=Pe(c)}}>−</button>
            <button class="tb pct" aria-label=${`Zoom ${G(c)}. Back to fit`}
              title=${`The watch at ${G(c)} of its own points. Click to fit it again (${G(h)}).`}
              @click=${()=>{this.zoom=void 0}}>${G(c)}</button>
            <button class="tb icon" ?disabled=${c>=Ie(c)} aria-label="Zoom in" title="Zoom in"
              @click=${()=>{this.zoom=Ie(c)}}>+</button>
          </span>
        </div>
        <div class="ve-stage-body">${Ii(e)}</div>
        <div class="under"><span class="tail">${yi}</span></div>
      </div>
    </div>`}renderBody(e){if(e.length===0){let c=this.owners.length===0&&this.ownList===void 0;return d`<div class="pe-empty">${c?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}if(this.unsupported)return d`<div class="pe-empty"><b>${Ne}</b></div>`;if(this.loading)return d`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let c=this.watchId;return d`<div class="pe-empty">
        <span>Could not read this watch's voice settings: ${this.loadError}</span>
        ${c===void 0?m:d`<button class="pe-btn" @click=${()=>{this.load(c)}}>Try again</button>`}
      </div>`}let t=this.record;if(t===void 0)return d`<div class="pe-empty">Loading…</div>`;let s=this.draft;if(s===void 0&&t.revision>0)return d`<div class="pe-empty"><b>${Ne}</b></div>`;if(s===void 0){let c=this.watchId===void 0?void 0:U(this.watchId),h=this.watchId;return d`<div class="pe-empty"><b>${Wn}</b><span>${Y}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${ge}</button>
        ${c?.dirty&&h!==void 0?d`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when voice settings are here again.</span>
          <button class="pe-btn" @click=${()=>{pe(h),this.requestUpdate()}}>Discard the kept edits</button>`:m}
      </div>`}let o=this.viewHost();if(o===void 0)return d`<div class="pe-empty">Loading…</div>`;let r=this.fittedColumns(),a=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"",l=t.revision<=0;return d`${l&&this.barHost===void 0?zn():m}
    <div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${r.left}px;--wa-right:${r.right}px;${a}`}>
      <div class="column left">
        ${Ti(o)}
        ${_i(o,this.phrasesLinks())}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(o,e)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${Ci(o)}
      </div>
    </div>
    ${l?m:this.renderFoot(t,s.document,s.dirty)}`}renderFoot(e,t,s){let o=Re(t),r=Ve({record:e,size:o.size,limit:o.limit,noun:"voice settings",historyState:this.historyState}),a=this.watchId;return d`${Kt({status:r,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?Jt({noun:"voice settings",record:e,entries:this.history,historyState:this.historyState,dirty:s,restoring:this.restoring,onRetry:()=>{a!==void 0&&(this.historyState="loading",this.loadHistory(a))},onRestore:l=>{this.historyOpen=!1,this.askRestore(l)},onClosed:()=>{this.historyOpen=!1}}):m}
    ${this.rawOpen?Yt({noun:"voice settings",document:t,revision:e.revision,dirty:s,copied:this.rawCopied,onCopy:l=>{Xt(l).then(c=>{this.rawCopied=c})},onClosed:()=>{this.rawOpen=!1}}):m}`}renderRestoreAsk(e){let t=this.record,s=vs(e.entry.updated_at);return d`<dialog class="pe-ask" aria-labelledby="ve-ask-title"
      @cancel=${o=>{this.restoring&&o.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="ve-ask-title">Restore revision ${e.entry.revision}?</h3>
      <p>${ms(e.entry.updated_by)}${s?` ${s}`:""}, ${fs(e.entry.size)}.</p>
      ${e.summary?d`<p class="pe-muted">${e.summary}</p>`:m}
      <p>It is saved again as a new revision${t?`, after revision ${t.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      ${(e.links??[]).map(o=>d`<p>${o}</p>`)}
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[xt,ft,vt,mt,gt,wt,bt,yt,on,Kn,se`
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
  `,Oi,mn,Zt,Ct]}};v([_({attribute:!1})],f.prototype,"hass",2),v([_({attribute:!1})],f.prototype,"owners",2),v([_({attribute:!1})],f.prototype,"ownerId",2),v([_({type:Boolean,reflect:!0})],f.prototype,"narrow",2),v([_({attribute:!1})],f.prototype,"icons",2),v([_({attribute:!1})],f.prototype,"iconsTick",2),v([_({attribute:!1})],f.prototype,"haMenu",2),v([_({attribute:!1})],f.prototype,"onHaMenu",2),v([_({attribute:!1})],f.prototype,"onBack",2),v([_({attribute:!1})],f.prototype,"barActions",2),v([_({attribute:!1})],f.prototype,"shellOwnsWatch",2),v([_({attribute:!1})],f.prototype,"barHost",2),v([w()],f.prototype,"watchId",2),v([w()],f.prototype,"record",2),v([w()],f.prototype,"unsupported",2),v([w()],f.prototype,"voices",2),v([w()],f.prototype,"voicesState",2),v([w()],f.prototype,"cloudTTS",2),v([w()],f.prototype,"loading",2),v([w()],f.prototype,"loadError",2),v([w()],f.prototype,"history",2),v([w()],f.prototype,"historyState",2),v([w()],f.prototype,"note",2),v([w()],f.prototype,"restoreAsk",2),v([w()],f.prototype,"restoring",2),v([w()],f.prototype,"historyOpen",2),v([w()],f.prototype,"rawOpen",2),v([w()],f.prototype,"rawCopied",2),v([w()],f.prototype,"ownList",2),v([w()],f.prototype,"topMenuOpen",2),v([w()],f.prototype,"watchMenuOpen",2),v([w()],f.prototype,"voicePlaces",2),v([w()],f.prototype,"otherVoice",2),v([w()],f.prototype,"devicesOpen",2),v([w()],f.prototype,"linking",2),v([w()],f.prototype,"devicesNote",2),v([w()],f.prototype,"replaceAsk",2),v([w()],f.prototype,"freshAsk",2),v([w()],f.prototype,"zoom",2),v([w()],f.prototype,"columns",2),v([w()],f.prototype,"hostWidth",2),v([w()],f.prototype,"hostHeight",2);customElements.get("wa-voice-editor")||customElements.define("wa-voice-editor",f);export{tt as VE_COLUMNS_KEY,f as WaVoiceEditor,bs as watchVoiceSummary};
