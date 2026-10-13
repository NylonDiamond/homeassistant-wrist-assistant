import{A as B,B as ln,C as hn,D as pn,E as un,F as fn,G as vn,H as ae,I as mn,J as gn,K as wn,L as Ie,M as bn,N as yn,a as ie,b as Se,c as Ve,d as se,e as _e,f as Te,i as M,j as Xt,k as Qt,l as en,m as tn,n as nn,o as Ce,p as sn,q as on,r as an,s as Re,t as D,u as A,v as rn,w as oe,x as cn,y as dn,z as Oe}from"./chunk-XPSN7LOJ.js";import{Jb as $e,Kb as Gt,Mb as ne,Ua as Zt}from"./chunk-TL253X3M.js";import{A as Jt,B as Yt,p as be,q as j,r as ye,s as ke,w as zt,x as jt,y as Kt,z as xe}from"./chunk-AEUMAFLU.js";import{b as bt,d as yt,e as pe,f as kt}from"./chunk-ZOJGMATP.js";import"./chunk-BV5ZBOP6.js";import{b as V,c as Bt}from"./chunk-3EX6GCIN.js";import{a as kn,b as xn,c as $n,d as Sn,e as Vn,f as _n,g as Tn}from"./chunk-5FJDQKX4.js";import{a as ge,b as we,c as Dt,d as Et,e as Ht,f as Wt,g as Mt,h as At,i as Lt}from"./chunk-ODVWNQHP.js";import{b as It,p as Pt,w as qt}from"./chunk-N74JFC2B.js";import{a as Nt,b as Ut,d as Ft}from"./chunk-QUOL6HJ4.js";import{$b as Ot,Jb as St,Kb as Vt,Lb as ee,Nb as te,Nd as Cn,Ob as _t,Od as Rn,Pb as Tt,Pd as On,Q as fe,Rb as me,Sb as Ct,Sd as In,V as ve,Xa as $t,Zb as Rt,h as et,na as xt,s as ue}from"./chunk-FDJGF2BA.js";import{Ag as Ke,Bg as Je,Cg as Ye,Dg as Ze,Eg as Ge,Lg as Xe,Ug as Qe,_h as lt,b as G,c as d,cg as Be,dh as U,eh as k,f as m,hj as vt,i as je,ih as tt,ii as ht,j as T,ji as Q,jj as mt,k as b,kh as nt,kj as gt,lh as it,lj as wt,mh as st,mi as pt,nh as ot,ni as ut,oh as at,oi as he,ph as rt,pi as ft,qh as ct,yg as X,zh as dt}from"./chunk-H6UHY2CG.js";import{j as z}from"./chunk-E4KBCUIT.js";import{a as W}from"./chunk-KXSD4G27.js";import{a as v}from"./chunk-LO2NM3CE.js";var C="phrases";function I(t,i){return t!=null&&Object.hasOwn(t,i)?t[i]:void 0}function F(t){if(!Array.isArray(t))return;let i=new Set,e=[];for(let n of t){if(!z(n)||typeof n.id!="string"||n.id==="")return;let s=n.id.toUpperCase();if(i.has(s))return;i.add(s),e.push([s,n])}return e}function ii(t,i,e){let n=t===null?void 0:t,s=i===null?void 0:i,o=e===null?void 0:e,a=n===void 0?[]:F(n),c=s===void 0?void 0:F(s),l=o===void 0?void 0:F(o);if(a===void 0||c===void 0||l===void 0)return V(s,n)?o:s;let r=new Map(a),h=new Map(c),u=new Map(l),y=(w,$)=>{let _=r.get(w);return _===void 0||!V($,_)},g=(w,$,_)=>y(w,$)?$:_,S=(w,$)=>r.has(w)&&!y(w,$)?void 0:$,x=c.map(([w])=>w).filter(w=>r.has(w)),P=a.map(([w])=>w).filter(w=>h.has(w)),R=x.length!==P.length||x.some((w,$)=>w!==P[$]),le=R?c:l,p=R?l:c,H=R,O=[];for(let[w,$]of le){let _=(H?u:h).get(w);if(_!==void 0)O.push(H?g(w,$,_):g(w,_,$));else{let ze=S(w,$);ze!==void 0&&O.push(ze)}}for(let[w,$]of p){if((H?h:u).has(w))continue;let _=S(w,$);_!==void 0&&O.push(_)}let Z=w=>Array.isArray(w)&&w.length===O.length&&O.every(($,_)=>$===w[_]);return Z(o)?o:Z(s)?s:O}function Pn(t,i,e){let n=Bt(t,i,e),s=ii(t==null?e[C]:I(t,C),I(i,C),I(e,C)),o=I(n,C);if(s===o)return n;if(s===void 0){if(!Object.hasOwn(n,C))return n;let{[C]:a,...c}=n;return c}return n===e||n===i?{...n,[C]:s}:(n[C]=s,n)}function Dn(t,i,e){let n=new Set([...Object.keys(i),...Object.keys(e)]),s=[];for(let o of n){if(o===C){let h=new Map(F(I(t,C))??[]),u=F(I(i,C)),y=new Map(F(I(e,C))??[]);if(u===void 0)continue;u.some(([S,x])=>{let P=y.get(S),R=h.get(S);return P!==void 0&&!V(x,P)&&(R===void 0||!V(x,R)&&!V(P,R))})&&s.push(o);continue}let a=I(t,o),c=I(i,o),l=I(e,o),r=h=>t==null||!V(h,a);r(c)&&r(l)&&!V(c,l)&&s.push(o)}return s.sort()}var En=100,si=3,re=class{constructor(i,e){this._undo=[];this._redo=[];this._replaced=[];this._base=i,this._revision=e,this._document=i}get base(){return this._base}get revision(){return this._revision}get document(){return this._document}get canUndo(){return this._undo.length>0}get canRedo(){return this._redo.length>0}get replaced(){return this._replaced}get dirty(){let i=this._dirty;if(i!==void 0&&i.document===this._document&&i.base===this._base)return i.value;let e=this._document!==this._base&&!V(this._document,this._base);return this._dirty={document:this._document,base:this._base,value:e},e}apply(i,e){if(i===this._document||V(i,this._document))return(e===void 0||e!==this._coalesceKey)&&(this._coalesceKey=void 0),!1;if(e!==void 0&&e===this._coalesceKey&&this._undo.length>0){let n=this._undo[this._undo.length-1];return V(i,n)?(this._undo.pop(),this._document=n,this._coalesceKey=void 0):this._document=i,this._redo=[],!0}return this.pushUndo(this._document),this._redo=[],this._document=i,this._coalesceKey=e,!0}endCoalesce(){this._coalesceKey=void 0}undo(){this._coalesceKey=void 0;let i=this._undo.pop();return i===void 0?!1:(this._redo.push(this._document),this._document=i,!0)}redo(){this._coalesceKey=void 0;let i=this._redo.pop();return i===void 0?!1:(this.pushUndo(this._document),this._document=i,!0)}discard(){return this._coalesceKey=void 0,this.apply(this._base)}rebase(i,e){return e<this._revision?(this._replaced=[],!1):this.mergeOnto(i,e)}restart(i,e){return this.mergeOnto(i,e)}mergeOnto(i,e){this._coalesceKey=void 0;let n=this._base;this._replaced=this._document===n?[]:Dn(n,this._document,i);let s=new Map,o=u=>{let y=s.get(u);if(y!==void 0)return y;let g=u===n?i:Pn(n,u,i);return g!==i&&V(g,i)&&(g=i),s.set(u,g),g},a=this._document,c=[...this._undo,this._document,...this._redo.slice().reverse()].map(o),l=this._undo.length,r=[],h=0;return c.forEach((u,y)=>{let g=r[r.length-1];g!==void 0&&(g===u||V(g,u))?y===l&&(r[r.length-1]=u):r.push(u),y===l&&(h=r.length-1)}),this._undo=r.slice(0,h),this._document=r[h],this._redo=r.slice(h+1).reverse(),this._base=i,this._revision=e,this._document!==a&&!V(this._document,a)}saved(i,e){e<this._revision||(this._coalesceKey=void 0,this._base=i,this._revision=e)}get saving(){return K.has(this)}get saveDone(){return K.get(this)}pushUndo(i){this._undo.push(i),this._undo.length>En&&this._undo.splice(0,this._undo.length-En)}},K=new WeakMap;function Hn(t,i){if(K.has(t))return Promise.resolve({ok:!1,revision:t.revision,merged:!1,code:"busy",message:"These voice settings are being saved already."});let e=oi(t,i).finally(()=>K.delete(t));return K.set(t,e),e}async function oi(t,i){let e=!1,n=new Set,s=()=>n.size===0?{}:{replaced:[...n].sort()},o=(a,c,l)=>({ok:!1,revision:t.revision,merged:e,code:a,message:c,...l===void 0?{}:{problems:l}});for(let a=1;;a++){let c=t.document,l=gn(c);if(l.length>0)return o("invalid",l.join(" "),l);let r;try{({revision:r}=await i.save(t.revision,c))}catch(h){let{code:u="unknown",message:y}=W(h);if(u!=="conflict"||a>=si)return o(u,y);let g;try{g=await i.fetch()}catch(S){let x=W(S);return o(x.code??"unknown",x.message)}if(!z(g)||!(g.revision>0)||!z(g.document))return o("no_record","Home Assistant holds no voice settings for this watch.");g.revision<t.revision?t.restart(g.document,g.revision):t.rebase(g.document,g.revision);for(let S of t.replaced)n.add(S);if(e=!0,!t.dirty)return{ok:!0,revision:t.revision,merged:e,alreadySaved:!0};continue}return t.saved(c,r),{ok:!0,revision:t.revision,merged:e,...s()}}}var E=new Map;function L(t){return E.get(t)}function Pe(t,i,e){let n=E.get(t);if(n!==void 0&&e<=0)return{draft:n,mergedIntoEdits:!1,replaced:[]};if(n===void 0||e<n.revision&&!n.dirty){let a=new re(i,e);return E.set(t,a),{draft:a,mergedIntoEdits:!1,replaced:[]}}if(e===n.revision)return{draft:n,mergedIntoEdits:!1,replaced:[]};let s=n.dirty,o=e<n.revision?n.restart(i,e):n.rebase(i,e);return{draft:n,mergedIntoEdits:s&&o,replaced:s?n.replaced:[]}}function De(t){let i=E.get(t);if(i===void 0){let e=new re(_e(),0);return E.set(t,e),e}return i.revision>0&&!i.saving&&i.restart(_e(),0),i}function ce(t){E.delete(t)}function Ee(){for(let t of E.values())if(t.dirty)return!0;return!1}function Wn(){E.clear()}var ai={defaultAssistAgentId:"the conversation agent",defaultTTSEngine:"the text to speech engine",defaultSpeakers:"the speakers",phrases:"the phrases",watchSpeakReplyInSilentMode:"Speak even in Silent Mode",watchSpeechVoiceIdentifier:"the watch voice"};function ri(t){return ai[t]??"a setting this panel does not show"}function He(t){if(t.length===0)return"";let i=[...new Set(t.map(ri))];return`Another save also changed ${i.length===1?i[0]:`${i.slice(0,-1).join(", ")} and ${i[i.length-1]}`}. ${i.length===1?"Your version replaced it.":"Your versions replaced them."}`}function Mn(t){if(t.ok){if(t.alreadySaved===!0)return{kind:"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${t.revision}.`};let e=t.replaced??[];return e.length>0?{kind:"warn",text:`Saved. ${He(e)}`}:t.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let i=(t.message??"").trim();switch(t.code){case"conflict":return{kind:"warn",text:"Not saved. The voice settings kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds voice settings for this watch. Your edits are kept, so save again."};case"invalid":{let e=t.problems??[];return e.length>0?{kind:"err",text:`Not saved. ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the voice settings${i===""?".":`: ${i}`}`}}case"busy":return{kind:"warn",text:"Already saving these voice settings. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the voice settings just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${i===""?".":`: ${i}`}`}}}var An=[["defaults","Defaults"],["watch","On the watch"]],Ln={defaults:"What Assist and Speak use when a tile, a slot or a phrase picks nothing of its own.",watch:"How the watch itself speaks a reply."},ci="The voice defaults, the phrase library and the watch's own speech. A save reaches the watch the next time it checks.",Nn="Pick from List shows these phrases on the watch. Tap one to edit it.",di={defaults:{color:U.content,icon:"content"},watch:{color:U.content,icon:"watch"},phrase:{color:U.content,icon:"text"},look:{color:U.look,icon:"look"},speech:{color:U.content,icon:"content"}},li="#ab47bc",Y="voice-editor",Un=44,Fn=22;function N(t,i){let e=t.states[i]?.attributes?.friendly_name;return typeof e=="string"&&e.trim()!==""?e:i}function hi(t,i){let e=i.indexOf(".");return{entityId:i,displayName:i===""?"":N(t,i),domain:e>0?i.slice(0,e):""}}function qn(t,i,e,n){return t.icons.render(i,e,n)??d`<span class="vo-glyph-dot" style=${`background:${n}`}></span>`}function We(t){if(typeof t!="string"||t==="")return{fill:"#D88CC4",ink:"#D88CC4"};if(t.toUpperCase()==="#RAINBOW")return{fill:"conic-gradient(#FF3B30, #FF9500, #FFCC00, #34C759, #007AFF, #AF52DE, #FF3B30)",ink:"#FF9500"};if(t.toUpperCase().startsWith("GRADIENT|")){let i=t.split("|").slice(1).filter(e=>/^#[0-9a-fA-F]{6}$/.test(e));if(i.length>=2)return{fill:`linear-gradient(135deg, ${i.join(", ")})`,ink:i[0]};if(i.length===1)return{fill:i[0],ink:i[0]}}return{fill:t,ink:t}}function zn(t,i){return Kt(t.uiState,Y,i)}function pi(t,i){xe(t.uiState,Y,i,!zn(t,i)),t.requestUpdate()}function J(t,i,e,n,s={}){let o=zn(t,i),a=di[i];return ct({color:a.color,icon:k(a.icon),title:e,open:o,onToggle:()=>pi(t,i),...s.summary===void 0||s.summary===""?{}:{summary:s.summary},dot:s.dot===!0,id:`${Y}:${i}`},o?n:d``)}var Me="vo:pick";function q(t){let i=t.uiState.get(Me);if(typeof i=="string"&&i.startsWith("phrase:")){let e=rn(t.document,i.slice(7));if(e!==void 0)return{phrase:e}}return{section:i==="watch"?"watch":"defaults"}}function Ae(t,i){t.uiState.set(Me,i),t.requestUpdate()}function Le(t,i){t.uiState.set(Me,`phrase:${i}`),t.requestUpdate()}function jn(t){return"phrase"in q(t)?(Ae(t,"defaults"),!0):!1}function ui(t){let i;t.edit(e=>{let n=dn(e);return i=n.id,n.document}),i!==void 0&&(xe(t.uiState,Y,"phrase",!0),Le(t,i))}function fi(t,i){if(i==="defaults"){let s=M(t.document);return s.speakers.length===0?"No speakers":s.speakers.map(a=>N(t.hass,a)).join(", ")}let e=Ce(t.document),n=e===void 0?void 0:t.voices.find(s=>s.id===e);return e===void 0?"System voice":n!==void 0?Re(n):e}function Bn(t){let i=q(t),e="section"in i?i.section:void 0;return d`<section class="card lc vo-voice-card" aria-label="Voice"
    style=${`--c: var(--wa-lc-pages, #26a69a); --thumb-w: ${Un}px; --thumb-h: ${Fn}px`}>
    <div class="lc-head">
      <span class="swatch">${In()}</span><span class="lc-title">Voice</span>
      <span class="lc-sub" title=${ci}>for the watch</span>
    </div>
    <div class="layers vo-section-list" role="list">
      ${An.map(([n,s])=>{let o=n===e,a=()=>Ae(t,n);return d`<div class="layer vo-section-row ${o?"hl":""}" data-section=${n} role="listitem" tabindex="0"
          aria-current=${o?"true":"false"} aria-label=${s} title=${Ln[n]}
          @click=${a}
          @keydown=${c=>{c.target!==c.currentTarget||c.key!=="Enter"&&c.key!==" "||(c.preventDefault(),a())}}>
          <span class="grip" aria-hidden="true"></span>
          <span class="thumb vo-thumb" aria-hidden="true">${k(n==="watch"?"watch":"content")}</span>
          <span class="name"><b><span class="nm-t">${s}</span></b><small>${fi(t,n)}</small></span>
          <span class="right"></span>
        </div>`})}
    </div>
  </section>`}function vi(t,i){let e=We(i.color),n=typeof i.icon=="string"&&i.icon!==""?i.icon:"speaker.wave.2";return d`<span class="thumb vo-thumb" style=${`--c:${e.ink}`} aria-hidden="true"><span class="vo-thumb-glyph">${qn(t,n,14,e.ink)}</span></span>`}function mi(t){let i=ae(t);return i.length>0?`Needs a ${i.join(" and a ")}`:typeof t.message=="string"?t.message:""}function gi(t,i,e,n,s){let o=A(i),a=s!==void 0&&A(s).toUpperCase()===o.toUpperCase(),c=oe(i),l=mi(i),r=ae(i).length>0,h=()=>Le(t,o);return d`<div class="layer vo-phrase-row ${a?"hl":""}" data-phrase=${o} role="listitem" tabindex="0"
    aria-current=${a?"true":"false"} aria-label=${c} title=${`${c} \xB7 ${l}`}
    @click=${u=>{u.target instanceof Element&&u.target.closest("button")||h()}}
    @keydown=${u=>{u.target!==u.currentTarget||u.key!=="Enter"&&u.key!==" "||(u.preventDefault(),h())}}>
    <span class="grip" aria-hidden="true"></span>
    ${vi(t,i)}
    <span class="name"><b><span class="nm-t">${c}</span></b><small class=${r?"vo-needs":""}>${l}</small></span>
    <span class="right">
      <span class="acts">
        <button type="button" class="icon" ?disabled=${t.busy||e===0} title="Move up" aria-label=${`Move ${c} up`}
          @click=${()=>t.edit(u=>B(u,o,e-1))}>${k("up")}</button>
        <button type="button" class="icon" ?disabled=${t.busy||e===n-1} title="Move down" aria-label=${`Move ${c} down`}
          @click=${()=>t.edit(u=>B(u,o,e+1))}>${k("down")}</button>
        <button type="button" class="icon danger" ?disabled=${t.busy} title="Remove" aria-label=${`Remove ${c}`}
          @click=${()=>t.edit(u=>Oe(u,o))}>${k("delete")}</button>
      </span>
    </span>
  </div>`}function Kn(t){let i=D(t.document),e=q(t),n="phrase"in e?e.phrase:void 0,s=cn(t.document);return d`<section class="card lc vo-phrases-card" aria-label="Phrases"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${Un}px; --thumb-h: ${Fn}px`}>
    <div class="lc-head">
      <span class="swatch">${k("list")}</span><span class="lc-title">Phrases</span>
      <span class="lc-sub">${i.length} of ${Se}</span>
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri vo-add-phrase" aria-label="Add phrase" ?disabled=${t.busy||s}
        title=${s?`The watch takes ${Se} phrases at most.`:"Add a phrase at the end"}
        @click=${()=>ui(t)}>${k("plus")}<span>Add</span></button>
    </div>
    ${i.length===0?d`<div class="lc-note">No phrases yet. A phrase is a message Pick from List and Speak Phrase can say on your speakers.</div>`:d`<div class="layers vo-phrase-list" role="list">${i.map((o,a)=>gi(t,o,a,i.length,n))}</div>`}
  </section>`}function Jn(t){let{width:i,height:e}=t.screen,n=t.scale,s=D(t.document),o=q(t),a="phrase"in o?A(o.phrase).toUpperCase():void 0,c=s.map(r=>{let h=A(r),u=We(r.color),y=a!==void 0&&h.toUpperCase()===a,g=oe(r),S=typeof r.icon=="string"&&r.icon!==""?r.icon:"speaker.wave.2",x=r.displayMode==="text";return d`<button type="button" class="vo-say ${x?"vo-words":"vo-glyph"} ${y?"on":""}" style=${`--fill:${u.fill};--ink:${u.ink}`}
      title=${g} aria-label=${g} aria-pressed=${y?"true":"false"} @click=${()=>Le(t,h)}>
      ${x?d`<span class="vo-say-text">${g}</span>`:d`<span class="vo-say-well">${qn(t,S,Math.round(16*n),"#fff")}</span>
        <span class="vo-say-label">${g}</span>`}
    </button>`}),l=d`<div class="vo-screen" role="group" aria-label="Pick from List on the watch"
    style=${`width:${Math.round(i*n)}px;height:${Math.round(e*n)}px;--vo-s:${n}`}>
    <div class="vo-screen-title">Phrases</div>
    ${s.length===0?d`<p class="vo-screen-note">No phrases yet.</p>`:d`<div class="vo-say-list">${c}</div>`}
  </div>`;return zt({width:i,height:e},n,l,"Pick from List on the watch")}function Yn(t){let i=D(t.document).length;return[`${i} ${i===1?"phrase":"phrases"}`]}function wi(t){let i=q(t);return("phrase"in i?["phrase","look","speech"]:[i.section]).map(n=>({module:Y,section:n}))}function Zn(t){let i=q(t),e=wi(t),n=Jt(t.uiState,e),s,o;if("phrase"in i){let a=oe(i.phrase);s=d`<div class="crumbs"><button class="root" title="The voice defaults" @click=${()=>Ae(t,"defaults")}>Voice</button><span class="sep">›</span><span class="kchip" style=${`--k:${We(i.phrase.color).ink}`}>Phrase</span><span class="nm" title=${a}>${a}</span></div>`,o=Si(t,i.phrase)}else{let a=An.find(([c])=>c===i.section)?.[1]??"";s=d`<div class="crumbs"><span class="kchip" style=${`--k:${li}`}>Voice</span><span class="nm" title=${a}>${a}</span></div>`,o=d`<p class="vo-note">${Ln[i.section]}</p>
      ${i.section==="defaults"?bi(t):ki(t)}
      <p class="vo-note vo-pick-note">Pick a phrase to edit it, or add one.</p>`}return d`<div class="insp-head">
      ${s}
      <button class="expand" @click=${()=>{Yt(t.uiState,e,!n),t.requestUpdate()}}>${n?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${o}</div>`}function Gn(t,i,e,n){let s=Gt(t.hass.states),o=ne(s,e),a=h=>h.missing?`${h.entityId} (not found)`:h.name,c=h=>me(a(h),e.includes(h.entityId),u=>n(h.entityId,u)),l=s.filter(h=>h.announces),r=o.filter(h=>!l.some(u=>u.entityId===h.entityId));return d`<div class="vo-sub-h"><span>${i}</span></div>
    <div class="vo-list" role="group" aria-label=${i}>
      ${o.length===0?d`<div class="hint">No media players in Home Assistant.</div>`:m}
      ${l.length>0?d`<div class="vo-group">Speakers</div>${l.map(c)}`:m}
      ${r.length>0?d`${l.length>0?d`<div class="vo-group">Other media players</div>`:m}${r.map(c)}`:m}
    </div>`}function bi(t){let i=M(t.document),e=xi(t,i.engine),n=i.engine===void 0?"No engine":e.find(([a])=>a===i.engine)?.[1]??N(t.hass,i.engine),s=[i.agent===void 0?"Default agent":N(t.hass,i.agent),n].join(" \xB7 "),o=d`<fieldset class="vo-body" ?disabled=${t.busy} aria-label="Defaults">
    <div class="vo-stack">${Rt({hass:t.hass},"Conversation agent",hi(t.hass,i.agent??""),a=>t.edit(c=>Xt(c,a.entityId)),"vo:agent",{domain:"conversation",clearable:!0})}</div>
    <div class="hint">${i.agent===void 0?"None picked: Home Assistant's own default agent answers.":"Assist uses this agent unless a tile or a slot picks its own."}</div>
    <div class="vo-stack">${te("Text to speech engine",i.engine??"",e,a=>t.edit(c=>Qt(c,a)),{snapBack:!0})}</div>
    <div class="hint ${i.engine===void 0?"warn":""}">${i.engine===void 0?"Not set. Speaking on speakers needs an engine.":"Speakers say messages and replies with this engine unless a tile, a slot or a phrase picks its own."}</div>
    ${Gn(t,"Speakers",i.speakers,(a,c)=>t.edit(l=>en(l,a,c)))}
    <div class="hint">${i.speakers.length===0?"None picked. A slot or a phrase set to speakers with none of its own then plays nowhere.":"Assist, Speak and phrases play here unless they pick their own."}</div>
  </fieldset>`;return J(t,"defaults","Defaults",o,{summary:s,dot:i.agent!==void 0||i.engine!==void 0||i.speakers.length>0})}function yi(t,i){let e=[{value:"",label:"System voice"}];i!==void 0&&!t.some(n=>n.id===i)&&e.push({value:i,label:`${i} (not on this watch)`});for(let n of an(t))for(let s of n.voices)e.push({value:s.id,label:Re(s),group:n.language});return e}function ki(t){let i=tn(t.document),e=Ce(t.document),n=yi(t.voices,e),s=[];for(let r of n){let h=s[s.length-1];h!==void 0&&h.group!==void 0&&h.group===r.group?h.options.push(r):s.push({group:r.group,options:[r]})}let o=r=>d`<option value=${r.value} .selected=${ue(r.value===(e??""))}>${r.label}</option>`,a=t.voicesState==="unsupported"?"Update the integration to list this watch's voices.":t.voicesState==="error"?"Could not read this watch's voices.":t.voicesState==="ready"&&t.voices.length===0?bn:void 0,c=d`<fieldset class="vo-body" ?disabled=${t.busy} aria-label="On the watch">
    ${me("Speak even in Silent Mode",i,r=>t.edit(h=>nn(h,r)),!0)}
    <div class="hint">The watch speaks a reply on its own speaker even while it is in Silent Mode.</div>
    <label class="field"><span>Watch voice</span>
      <select .value=${ue(e??"")} @change=${r=>{let h=r.target.value;t.edit(u=>sn(u,h===""?void 0:h))||t.requestUpdate()}}>
        ${s.map(r=>r.group===void 0?r.options.map(o):d`<optgroup label=${r.group}>${r.options.map(o)}</optgroup>`)}
      </select></label>
    ${a===void 0?d`<div class="hint">The voice the watch speaks a reply in. System voice follows the watch's language.</div>`:d`<div class="hint ${t.voicesState==="ready"?"":"warn"}">${a}</div>`}
  </fieldset>`,l=e===void 0?"System voice":t.voices.find(r=>r.id===e)?.name??e;return J(t,"watch","On the watch",c,{summary:l,dot:!i||e!==void 0})}function xi(t,i){let e=Object.keys(t.hass.services?.tts??{}),n=ne($e(t.hass.states,e,t.cloudTTS),i===void 0?[]:[i]);return[["","Not set"],...n.map(s=>[s.entityId,s.missing?`${s.entityId} (not found)`:s.name])]}function $i(t,i){let e=M(t.document),n=Object.keys(t.hass.services?.tts??{}),s=ne($e(t.hass.states,n,t.cloudTTS),i===void 0?[]:[i]);return[["",e.engine===void 0?"Default (Not set)":`Default (${s.find(a=>a.entityId===e.engine&&!a.missing)?.name??N(t.hass,e.engine)})`],...s.map(a=>[a.entityId,a.missing?`${a.entityId} (not found)`:a.name])]}function Si(t,i){let e=A(i),n=(p,H,O=!1)=>t.edit(Z=>fn(Z,e,p,H),O?`phrase:${e}:${p}`:void 0),s=ae(i),o=p=>typeof i[p]=="string"?i[p]:"",a=d`<fieldset class="vo-body" ?disabled=${t.busy} aria-label="Phrase">
    ${ee("Message",o("message"),p=>n("message",p,!0),{placeholder:"What the speakers say"})}
    ${ee("Label",o("label"),p=>n("label",p,!0),{placeholder:"Its name on the watch"})}
    ${s.length>0?d`<div class="hint warn">The phrase needs a ${s.join(" and a ")} before it can be saved.</div>`:m}
    ${_t("Display mode",String(i.displayMode??"icon"),Ve("TTSPhraseDisplayMode"),p=>n("displayMode",p),{def:ie.newPhrase.displayMode})}
    <div class="hint">How Pick from List shows it: its icon, or its label.</div>
  </fieldset>`,c=i.color,l=hn(c),r=d`<fieldset class="vo-body" ?disabled=${t.busy} aria-label="Look">
    <div class="vo-stack">${Ot({icons:t.icons,symbols:t.symbols},typeof i.icon=="string"?i.icon:"",p=>n("icon",p,!0),`vo:icon:${e}`,{tint:c})}</div>
    <div class="vo-no-alpha">${Ct("Color",ln(c)?c:void 0,p=>{p!==void 0&&n("color",p,!0)},!1,ie.newPhrase.color)}</div>
    ${l===void 0?m:d`<div class="hint">${l}, which the panel does not offer. Picking a color here replaces it.</div>`}
  </fieldset>`,h=Array.isArray(i.targetSpeakers)?i.targetSpeakers.filter(p=>typeof p=="string"):[],u=M(t.document),y=typeof i.ttsEngine=="string"&&i.ttsEngine.trim()!==""?i.ttsEngine.trim():void 0,g=pn(i),S=un(i),x=ie.volume,P=d`<fieldset class="vo-body" ?disabled=${t.busy} aria-label="Speech">
    ${Gn(t,"Speakers",h,(p,H)=>t.edit(O=>vn(O,e,p,H)))}
    <div class="hint">${h.length>0?"This phrase plays only on these.":u.speakers.length>0?`None picked: the default speakers play (${u.speakers.map(p=>N(t.hass,p)).join(", ")}).`:"None picked, and no default speakers: set some in Defaults."}</div>
    ${te("Voice engine",y??"",$i(t,y),p=>n("ttsEngine",p===""?void 0:p),{snapBack:!0})}
    ${ee("Language",typeof i.language=="string"?i.language:"",p=>n("language",p,!0),{placeholder:"The engine's own"})}
    <div class="hint">A language code such as en or de, for an engine that speaks more than one.</div>
    ${te("Speech volume",g,Ve("TTSPhraseSpeechVolumeMode"),p=>n("speechVolumeMode",p),{snapBack:!0,def:"keepCurrent"})}
    ${g==="keepCurrent"?m:d`${Tt("Target volume",S,p=>n("speechVolumePercent",p,!0),{min:x.min,max:x.max,step:x.step,def:x.default,format:p=>`${Math.round(p)}${x.unit}`})}
      <div class="vo-chips">${x.presets.map(p=>d`<button type="button" class="pe-chip ${S===p.value?"on":""}"
        aria-pressed=${S===p.value?"true":"false"} @click=${()=>n("speechVolumePercent",p.value)}>${p.label} ${p.value}%</button>`)}</div>`}
  </fieldset>`,R=D(t.document).findIndex(p=>A(p).toUpperCase()===e.toUpperCase()),le=D(t.document).length;return d`${J(t,"phrase","Phrase",a,{summary:o("message"),dot:s.length>0})}
    ${J(t,"look","Look",r,{summary:typeof i.icon=="string"?i.icon:"",dot:!1})}
    ${J(t,"speech","Speech",P,{summary:y===void 0?"Defaults":N(t.hass,y),dot:mn(i)})}
    <div class="vo-acts">
      <button type="button" class="pe-btn" ?disabled=${t.busy||R<=0} @click=${()=>t.edit(p=>B(p,e,R-1))}>${k("up")}<span>Move up</span></button>
      <button type="button" class="pe-btn" ?disabled=${t.busy||R>=le-1} @click=${()=>t.edit(p=>B(p,e,R+1))}>${k("down")}<span>Move down</span></button>
      <button type="button" class="pe-btn pe-danger" ?disabled=${t.busy} title="Remove this phrase from the library"
        @click=${()=>t.edit(p=>Oe(p,e))}>${k("delete")}<span>Remove</span></button>
    </div>
    <p class="vo-note">A menu slot that speaks this phrase keeps pointing at it after an edit. Removing it leaves such a slot with nothing to say.</p>`}var Xn=G`
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
`;On({dirty:Ee,drop:Wn});typeof window<"u"&&window.addEventListener("beforeunload",t=>{Ee()&&(t.preventDefault(),t.returnValue="")});var Vi=15e3,ni=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),Ne=ni?"\u2318":"Ctrl+",Ue={min:200,max:720,middleMin:320},Fe={left:280,right:340},qe="wrist-assistant-panel.voice.columns.v1",_i=24,Qn=820;function ei(t){return W(t).message}function de(t){return W(t).code}function ti(t){let{code:i,message:e}=W(t);return Object.assign(new Error(e),i===void 0?{}:{code:i})}function Ti(t){return t<1e3?`${t} bytes`:`${Number((t/1e3).toFixed(1))} KB`}function Ci(t){let i=t?Date.parse(t):NaN;return Number.isNaN(i)?"":et(Math.max(0,(Date.now()-i)/1e3))}function Ri(t){return t==="panel"?"Saved here":"From the watch"}function Oi(t){return t instanceof HTMLElement?Ut(t.tagName,t instanceof HTMLInputElement?t.type:void 0,t.isContentEditable):!1}function Ii(){let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t===null||t===document.body||t===document.documentElement}function Pi(t){let i=se(t)??{},e=D(i).length,n=M(i).speakers.length;return`${e} ${e===1?"phrase":"phrases"}. ${n===0?"No default speakers.":`${n} default ${n===1?"speaker":"speakers"}.`}`}var f=class extends je{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=m;this.shellOwnsWatch=!1;this.barHost=void 0;this.headBar=new mt(this);this.unsupported=!1;this.voices=[];this.voicesState="loading";this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.columns={...Fe};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new Dt(this);this.symbols=new xt(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.voicesSeq=0;this.historySeq=0;this.subscribeSeq=0;this.cloudSeq=0;this.onReconnect=()=>{let e=this.watchId;!this.isConnected||e===void 0||(this.load(e,!0),this.loadVoices(e),this.loadCloud())};this.onScrubStart=e=>{e.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=e=>{e.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=e=>{if(e.defaultPrevented)return;let n=e.composedPath();if(!n.includes(this)&&!this.headBar.holds(n)&&!Ii()||this.renderRoot.querySelector("dialog[open]"))return;let s=e.metaKey||e.ctrlKey,o=e.key.toLowerCase();if(s&&!e.altKey&&o==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1;return}if(e.key==="Escape"&&this.watchMenuOpen){e.preventDefault(),this.watchMenuOpen=!1;return}if(!Oi(n[0])){if(s&&!e.altKey&&o==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}if(e.ctrlKey&&!e.metaKey&&!e.altKey&&o==="y"){e.preventDefault(),this.redo();return}if(e.key==="Escape"&&!s&&!e.altKey){let a=this.viewHost();a!==void 0&&jn(a)&&e.preventDefault()}}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let n=e.composedPath(),s=o=>n.some(a=>a instanceof HTMLElement&&a.classList.contains(o));this.topMenuOpen&&!s("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!s("ve-watch-picker")&&(this.watchMenuOpen=!1)};this.addEventListener(St,this.onScrubStart),this.addEventListener(Vt,this.onScrubEnd),this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get watches(){return ht(this.owners.length>0?this.owners:this.ownList??[])}get draft(){let e=this.watchId,n=this.record;if(!(e===void 0||n===void 0)){if(n.revision>0){let s=L(e);if(s!==void 0)return s;let o=se(n.document);return o===void 0?void 0:Pe(e,o,n.revision).draft}if(!(this.unsupported||!this.opensReady()))return L(e)??De(e)}}get newWatch(){let e=this.record;return e!==void 0&&e.revision<=0&&!this.unsupported}get saving(){return this.draft?.saving??!1}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=yt(qe,Fe,Ue),this.watchSize(),this.listenForReconnect(),this.loadCloud(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.voicesSeq++,this.historySeq++,this.cloudSeq++}willUpdate(e){if(this.hass){e.has("hass")&&(this.listenForReconnect(),this.cloudTTS===void 0&&e.get("hass")===void 0&&this.loadCloud()),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,Be(this.hass).then(o=>{this.ownList=o.owners},()=>{this.ownList=[]}));let s=vt(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||e.has("ownerId"));s!==void 0&&this.openWatch(s)}this.followSave();let n=this.restoreAsk;n!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(s=>s.revision===n.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),Mt(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let n of e){if(n.target!==this){this.measureTop(n.target);continue}let s=n.contentRect;Math.abs(s.width-this.hostWidth)>=1&&(this.hostWidth=s.width),Math.abs(s.height-this.hostHeight)>=1&&(this.hostHeight=s.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let n=this.renderRoot?.querySelector(".pe-top")??void 0;n!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=n,n!==void 0&&e.observe(n))}measureTop(e){let n=e.offsetHeight;n!==this.topHeight&&(this.topHeight=n,this.style.setProperty("--pe-top-h",`${n}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let e=this.watchId;if(e===void 0)return;let n=L(e)?.saveDone;if(n===void 0||n===this.followedSave)return;this.followedSave=n;let s=()=>this.saveEnded(e);n.then(s,s)}saveEnded(e){this.requestUpdate(),this.isConnected&&(e===this.watchId?(this.reloadPending=!1,this.load(e,!0)):this.flushPending())}openWatch(e,n=!1){e!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=e,this.note=void 0,this.unsupported=!1,this.voices=[],this.voicesState="loading",this.voicesSeq++,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),n=!1),this.startSubscription(e),this.load(e,n),this.loadVoices(e)}loadCloud(){let e=this.hass;if(!e)return;let n=++this.cloudSeq;Qe(e).then(s=>{n===this.cloudSeq&&(this.cloudTTS=Zt(s))},()=>{n===this.cloudSeq&&(this.cloudTTS=!1)})}async loadVoices(e){let n=this.hass;if(!n)return;let s=++this.voicesSeq;try{let o=await Xe(n,e);if(s!==this.voicesSeq||e!==this.watchId)return;this.voices=on(o),this.voicesState="ready"}catch(o){if(s!==this.voicesSeq||e!==this.watchId)return;this.voicesState=de(o)==="unknown_command"?"unsupported":"error"}}async load(e,n=!1){let s=this.hass;if(!s)return;if(n&&this.holdReload){this.reloadPending=!0;return}let o=++this.loadSeq;this.stopPolling(),n||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let a=await X(s,e,"voice");if(o!==this.loadSeq)return;if(n&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(a),this.loadError=void 0}catch(a){if(o!==this.loadSeq)return;yn(a)?(this.unsupported=!0,this.loadError=void 0):n||(this.loadError=ei(a)),this.restartDraft?.watchId===e&&(this.restartDraft=void 0)}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(e))}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(e){let n=this.watchId;this.record=e,n!==void 0&&e.revision<=0&&De(n);let s=e.revision>0?se(e.document):void 0;if(n===void 0||s===void 0)return;let o=this.restartDraft;o!==void 0&&o.watchId===n&&e.revision>=o.revision&&(this.restartDraft=void 0,(L(n)?.dirty??!1)||ce(n));let a=Pe(n,s,e.revision);a.replaced.length>0?this.note={kind:"warn",text:He(a.replaced)}:a.mergedIntoEdits&&(this.note={kind:"warn",text:"The voice settings changed somewhere else. Your edits are kept."}),this.requestUpdate()}async loadHistory(e){let n=this.hass;if(!n||this.historyState==="unsupported")return;let s=++this.historySeq;try{let o=await Je(n,e,"voice");if(s!==this.historySeq||e!==this.watchId)return;this.history=Array.isArray(o?.entries)?o.entries:[],this.historyState="ready"}catch(o){if(s!==this.historySeq||e!==this.watchId)return;this.historyState=de(o)==="unknown_command"?"unsupported":"error"}}startSubscription(e){let n=this.hass;if(this.endSubscription(),!n)return;let s=++this.subscribeSeq;Ge(n,e,o=>{s===this.subscribeSeq&&o.kind==="voice"&&o.revision!==(this.record?.revision??0)&&this.load(e,!0)}).then(o=>{s===this.subscribeSeq?this.unsubscribe=o:o().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let e=this.unsubscribe;this.unsubscribe=void 0,e?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||lt(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},Vi))}async poll(){this.pollTimer=void 0;let e=this.hass,n=this.watchId,s=this.record;if(!(!e||n===void 0||s===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let o=await X(e,n,"voice");if(n!==this.watchId||this.record!==s)return;o.revision===s.revision?this.record={...s,delivered_revision:o.delivered_revision,delivered_at:o.delivered_at,rejected_revision:o.rejected_revision,rejected_at:o.rejected_at,rejected_reason:o.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(o),this.loadHistory(n))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,n){let s=this.draft;if(!s||this.saving)return!1;let o=s.apply(e(s.document),this.scrubKey??n);return this.requestUpdate(),o}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let e=this.icons??Nt,n=this.iconMemo;if(n!==void 0&&n.provider===e&&n.tick===this.iconsTick)return n.icons;let s=Ft(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:s},s}screen(){let e=this.watches.find(n=>n.owner_watch_id===this.watchId);return(ve(e?.screen_size)??fe).screen}viewHost(){let e=this.draft,n=this.hass;if(e===void 0||n===void 0)return;let s=this;return{hass:n,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.stageScale,voices:this.voices,voicesState:this.voicesState,cloudTTS:this.cloudTTS,get document(){return e.document},get busy(){return s.saving},edit:(o,a)=>this.draft===e&&this.edit(o,a),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,n=this.watchId;this.endScrub();let s=this.draft;if(!e||n===void 0||!s||this.saving||!s.dirty)return;this.note=void 0;let o=s.revision<=0,a=Hn(s,{save:(l,r)=>Ke(e,n,"voice",l,r).catch(h=>{throw ti(h)}),fetch:async()=>{let l=await X(e,n,"voice").catch(r=>{throw ti(r)});return{revision:l.revision,document:l.document}}});this.followedSave=s.saveDone,this.requestUpdate();let c=await a.catch(l=>({ok:!1,revision:s.revision,merged:!1,code:de(l)??"unknown",message:ei(l)}));this.saveEnded(n),n===this.watchId&&(this.note=Sn(o,c.code,Mn(c)))}startFresh(){let e=this.watchId;e===void 0||!ft(this.noRecordState())||(kn("voice",e),this.note=void 0,this.requestUpdate())}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(e){let n=this.hass,s=this.watchId,o=this.record;if(!n||s===void 0||o===void 0||this.draft?.dirty)return;let a={entry:e,baseRevision:o.revision};this.restoreAsk=a,Ye(n,s,"voice",e.revision).then(c=>{this.restoreAsk===a&&(this.restoreAsk={...a,summary:Pi(c.document)})},()=>{})}async restore(){let e=this.hass,n=this.watchId,s=this.restoreAsk;if(!e||n===void 0||s===void 0||this.restoring)return;this.restoring=!0;let o;try{let a=await Ze(e,n,"voice",s.entry.revision,s.baseRevision);o={kind:"ok",text:qt(s.entry.updated_at)},n===this.watchId?this.restartDraft={watchId:n,revision:a.revision}:(L(n)?.dirty??!1)||ce(n)}catch(a){let c=de(a);c==="conflict"?o={kind:"warn",text:"Not restored. The voice settings changed somewhere else, so the newest copy is shown."}:c==="no_record"?o={kind:"warn",text:"Not restored. Home Assistant no longer holds voice settings for this watch."}:c==="not_found"?o={kind:"warn",text:"Not restored. That save is no longer kept."}:c==="unknown_command"?(this.historyState="unsupported",o={kind:"warn",text:"This version of the integration cannot restore voice settings. Update it to restore an earlier save."}):o={kind:"err",text:`Could not restore: ${$t(a)}`}}finally{this.restoring=!1,this.restoreAsk===s&&this.closeAsk()}n===this.watchId&&(this.note=o,this.load(n,!0))}render(){let e=this.watches,n=this.draft;return d`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(n,e):m}
        ${this.note?d`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:m}
      </div>
      ${this.renderBody(e)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):m}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=Qn}renderTopBar(e,n){let s=e!==void 0&&!this.unsupported,o=s&&e.dirty;return d`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch voice">
      ${this.haMenu?d`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${k("menu")}</button>`:m}
      ${this.shellOwnsWatch?m:d`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():Cn(void 0,!1)}>${k("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${this.shellOwnsWatch?m:this.renderWatchPicker(n)}
      ${this.barHost!==void 0&&s?gt({newWatch:this.newWatch,dirty:o,saved:we(this.record)}):m}
      ${this.renderSyncPill(s?e:void 0)}
      ${this.renderTopMenu(s?e:void 0)}
      ${s?d`<button class="primary save ${o?"dirty":""}" ?disabled=${!o||this.saving}
          title=${o?`Save (${Ne}S). A save reaches the watch the next time it checks.`:`Nothing to save (${Ne}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?m:d`<span class="tb-saved" title=${o?"Unsaved changes":""}>${we(this.record)}</span>
        ${_n($n({newWatch:this.newWatch,dirty:o,saving:this.saving}))}`}`:m}
      ${this.barActions}
      <button class="help" title="Help: voice" aria-label="Help"
        @click=${()=>window.open(Rn,"_blank","noopener")}>?</button>
    </div>`}renderSyncPill(e){let n=this.record;if(n===void 0||n.revision<=0||this.unsupported)return m;let s=e===void 0?{size:0,limit:1}:Te(e.document),o=ge({record:n,size:s.size,limit:s.limit,noun:"voice settings",historyState:this.historyState});return d`<span class="tb-sync ${o.tone==="ok"?"ok":"warn"}" title=${`${o.state}. ${o.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${o.state}</span>
    </span>`}noRecordState(e=this.watches){return pt(e.find(n=>n.owner_watch_id===this.watchId))}opensReady(e=this.watches){return xn(this.noRecordState(e),"voice",this.watchId)}canStartFresh(){return this.watchId!==void 0&&this.newWatch&&!this.opensReady()}renderTopMenu(e){let n=this.canStartFresh();if(e===void 0&&!n)return m;let s=this.topMenuOpen,o=a=>()=>{this.topMenuOpen=!1,a()};return d`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${s?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!s}}>···</button>
      ${s?d`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${e?d`<button class="row" role="menuitem" ?disabled=${!e.dirty||this.saving}
          title=${this.newWatch?"Go back to the defaults. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${o(()=>this.discard())}>Discard edits</button>`:m}
        ${n?d`<button class="row" role="menuitem"
          @click=${o(()=>this.startFresh())}>${he}</button>`:m}
      </div>`:m}
    </span>`}personColor(e){let n=It(this.owners.length>0?this.owners:this.ownList??[]);return Pt(n.findIndex(s=>s.owners.some(o=>o.owner_watch_id===e)))}renderWatchPicker(e){if(e.length<2)return m;let n=e.find(a=>a.owner_watch_id===this.watchId),s=this.watchMenuOpen,o=a=>{let c=a===void 0?void 0:this.personColor(a);return d`<span class="pe-chip-glyph" style=${c?`--pe-person: ${c}`:m} aria-hidden="true">${k("watch")}</span>`};return d`<span class="picker ve-watch-picker">
      <button type="button" class="tb-browse ve-watch-btn" aria-haspopup="menu" aria-expanded=${s?"true":"false"}
        title="Choose the watch whose voice settings are shown" @click=${()=>{this.watchMenuOpen=!s}}>
        ${o(n?.owner_watch_id)}<span class="tb-browse-l">${n?Q(n,e):"Choose a watch"}</span>
        <span class="ve-caret" aria-hidden="true">${k("chevron")}</span>
      </button>
      ${s?d`<div class="pop-menu ve-watch-menu" role="menu" aria-label="Watches">
        ${e.map(a=>{let c=a.owner_watch_id===this.watchId;return d`<button type="button" class="row ve-watch-row" role="menuitemradio" aria-checked=${c?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,c||this.openWatch(a.owner_watch_id)}}>
            ${o(a.owner_watch_id)}<span class="ve-watch-name">${Q(a,e)}</span>
            <span class="ve-watch-check" aria-hidden="true">${c?k("check"):m}</span>
          </button>`})}
      </div>`:m}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=Qn?this.columns:bt(this.hostWidth-_i,this.columns,Ue)}renderGutter(e){return d`<div class="gutter ${e}" role="separator" aria-orientation="vertical"
      aria-label=${e==="left"?"Resize the voice and phrases column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${n=>{let s=this.fittedColumns();kt(n,{side:e,base:e==="left"?s.left:s.right,limits:Ue,onWidth:o=>{this.columns={...this.columns,[e]:o}},onEnd:()=>pe(qe,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[e]:Fe[e]},pe(qe,this.columns)}}></div>`}get stageScale(){return this.zoom??be(this.narrow||this.stacked)}renderStage(e,n){let s=n.find(u=>u.owner_watch_id===this.watchId),a=ve(s?.screen_size)??fe,c=[...Yn(e),a.label],l=this.draft,r=this.stageScale,h=be(this.narrow||this.stacked);return d`<div class="card canvas-card ve-canvas" aria-label="Pick from List">
      <div class="cv-head">
        <span class="cv-title">Pick from List</span>
        ${s!==void 0?d`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${Q(s,n)}</span></span>`:m}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${c.join(" \xB7 ")}><span class="fam">${c.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!l?.canUndo} title=${`Undo (${Ne}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${k("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!l?.canRedo} title=${ni?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${k("redo")}</button>
        </span>
      </div>
      <div class="stage-area ve-stage-area">
        <div class="stage-tools" role="toolbar" aria-label="Stage tools">
          <span class="tb-zoom" role="group" aria-label="Zoom">
            <button class="tb icon" ?disabled=${r<=ke(r)} aria-label="Zoom out" title="Zoom out"
              @click=${()=>{this.zoom=ke(r)}}>−</button>
            <button class="tb pct" aria-label=${`Zoom ${j(r)}. Back to fit`}
              title=${`The watch at ${j(r)} of its own points. Click to fit it again (${j(h)}).`}
              @click=${()=>{this.zoom=void 0}}>${j(r)}</button>
            <button class="tb icon" ?disabled=${r>=ye(r)} aria-label="Zoom in" title="Zoom in"
              @click=${()=>{this.zoom=ye(r)}}>+</button>
          </span>
        </div>
        <div class="ve-stage-body">${Jn(e)}</div>
        <div class="under"><span class="tail">${Nn}</span></div>
      </div>
    </div>`}renderBody(e){if(e.length===0){let r=this.owners.length===0&&this.ownList===void 0;return d`<div class="pe-empty">${r?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}if(this.unsupported)return d`<div class="pe-empty"><b>${Ie}</b></div>`;if(this.loading)return d`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let r=this.watchId;return d`<div class="pe-empty">
        <span>Could not read this watch's voice settings: ${this.loadError}</span>
        ${r===void 0?m:d`<button class="pe-btn" @click=${()=>{this.load(r)}}>Try again</button>`}
      </div>`}let n=this.record;if(n===void 0)return d`<div class="pe-empty">Loading…</div>`;let s=this.draft;if(s===void 0&&n.revision>0)return d`<div class="pe-empty"><b>${Ie}</b></div>`;if(s===void 0){let r=this.watchId===void 0?void 0:L(this.watchId),h=this.watchId;return d`<div class="pe-empty"><b>${wn}</b><span>${ut}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${he}</button>
        ${r?.dirty&&h!==void 0?d`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when voice settings are here again.</span>
          <button class="pe-btn" @click=${()=>{ce(h),this.requestUpdate()}}>Discard the kept edits</button>`:m}
      </div>`}let o=this.viewHost();if(o===void 0)return d`<div class="pe-empty">Loading…</div>`;let a=this.fittedColumns(),c=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"",l=n.revision<=0;return d`${l&&this.barHost===void 0?Vn():m}
    <div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${a.left}px;--wa-right:${a.right}px;${c}`}>
      <div class="column left">
        ${Bn(o)}
        ${Kn(o)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(o,e)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${Zn(o)}
      </div>
    </div>
    ${l?m:this.renderFoot(n,s.document,s.dirty)}`}renderFoot(e,n,s){let o=Te(n),a=ge({record:e,size:o.size,limit:o.limit,noun:"voice settings",historyState:this.historyState}),c=this.watchId;return d`${Et({status:a,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?Ht({noun:"voice settings",record:e,entries:this.history,historyState:this.historyState,dirty:s,restoring:this.restoring,onRetry:()=>{c!==void 0&&(this.historyState="loading",this.loadHistory(c))},onRestore:l=>{this.historyOpen=!1,this.askRestore(l)},onClosed:()=>{this.historyOpen=!1}}):m}
    ${this.rawOpen?Wt({noun:"voice settings",document:n,revision:e.revision,dirty:s,copied:this.rawCopied,onCopy:l=>{At(l).then(r=>{this.rawCopied=r})},onClosed:()=>{this.rawOpen=!1}}):m}`}renderRestoreAsk(e){let n=this.record,s=Ci(e.entry.updated_at);return d`<dialog class="pe-ask" aria-labelledby="ve-ask-title"
      @cancel=${o=>{this.restoring&&o.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="ve-ask-title">Restore revision ${e.entry.revision}?</h3>
      <p>${Ri(e.entry.updated_by)}${s?` ${s}`:""}, ${Ti(e.entry.size)}.</p>
      ${e.summary?d`<p class="pe-muted">${e.summary}</p>`:m}
      <p>It is saved again as a new revision${n?`, after revision ${n.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[dt,tt,nt,it,st,ot,at,rt,jt,Tn,G`
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
      .pe-layout > .column { grid-column: auto; position: static; max-height: none; overflow: visible; }
      .pe-layout > .column.canvas { order: 1; }
      .pe-layout > .column.inspector { order: 2; }
      .pe-layout > .column.left { order: 3; }
    }
    .column.canvas > .card.canvas-card.ve-canvas { min-height: 0; flex: none; }
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
  `,Xn,Lt,wt]}};v([T({attribute:!1})],f.prototype,"hass",2),v([T({attribute:!1})],f.prototype,"owners",2),v([T({attribute:!1})],f.prototype,"ownerId",2),v([T({type:Boolean,reflect:!0})],f.prototype,"narrow",2),v([T({attribute:!1})],f.prototype,"icons",2),v([T({attribute:!1})],f.prototype,"iconsTick",2),v([T({attribute:!1})],f.prototype,"haMenu",2),v([T({attribute:!1})],f.prototype,"onHaMenu",2),v([T({attribute:!1})],f.prototype,"onBack",2),v([T({attribute:!1})],f.prototype,"barActions",2),v([T({attribute:!1})],f.prototype,"shellOwnsWatch",2),v([T({attribute:!1})],f.prototype,"barHost",2),v([b()],f.prototype,"watchId",2),v([b()],f.prototype,"record",2),v([b()],f.prototype,"unsupported",2),v([b()],f.prototype,"voices",2),v([b()],f.prototype,"voicesState",2),v([b()],f.prototype,"cloudTTS",2),v([b()],f.prototype,"loading",2),v([b()],f.prototype,"loadError",2),v([b()],f.prototype,"history",2),v([b()],f.prototype,"historyState",2),v([b()],f.prototype,"note",2),v([b()],f.prototype,"restoreAsk",2),v([b()],f.prototype,"restoring",2),v([b()],f.prototype,"historyOpen",2),v([b()],f.prototype,"rawOpen",2),v([b()],f.prototype,"rawCopied",2),v([b()],f.prototype,"ownList",2),v([b()],f.prototype,"topMenuOpen",2),v([b()],f.prototype,"watchMenuOpen",2),v([b()],f.prototype,"zoom",2),v([b()],f.prototype,"columns",2),v([b()],f.prototype,"hostWidth",2),v([b()],f.prototype,"hostHeight",2);customElements.get("wa-voice-editor")||customElements.define("wa-voice-editor",f);export{qe as VE_COLUMNS_KEY,f as WaVoiceEditor,Pi as watchVoiceSummary};
