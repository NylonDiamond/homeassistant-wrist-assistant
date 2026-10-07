import{A as K,B as sn,C as on,D as an,E as rn,F as cn,G as dn,H as ie,I as ln,J as hn,K as pn,L as un,M as Re,N as fn,O as vn,P as mn,Q as gn,a as te,b as $e,c as Se,d as Ve,e as jt,f as _e,i as H,j as Kt,k as Bt,l as Jt,m as Yt,n as Zt,o as Te,p as Gt,q as Xt,r as Qt,s as Ce,t as E,u as M,v as en,w as ne,x as tn,y as nn,z as Pe}from"./chunk-VFPB4UR3.js";import{Fb as qt,Gb as Ft,Ib as xe,Qa as zt}from"./chunk-236DUSUF.js";import"./chunk-2IJSECRV.js";import{A as Nt,B as Ut,p as we,q as j,r as be,s as ye,w as Ht,x as Mt,y as Lt,z as ke}from"./chunk-JUDRW34K.js";import{b as ut,d as ft,e as le,f as vt,h as V,i as At}from"./chunk-ULP77QG2.js";import{a as ge,b as Vt,c as _t,d as Tt,e as Ct,f as Pt,g as Rt,h as It,i as Ot}from"./chunk-L2VF33K2.js";import{m as pt,q as St}from"./chunk-UUNJX3DY.js";import{a as Dt,b as Et,d as Wt,n as F}from"./chunk-ZPJR7QBR.js";import{$b as Ge,Cc as Qe,Ec as et,Fc as tt,Fg as me,Gc as nt,Hc as it,Hg as $t,Ib as X,Ic as st,Jc as ot,Kb as re,Kc as at,Lb as Ke,Mb as Be,Nb as Je,Ob as Ye,Sb as Ze,Se as mt,Vc as D,Vd as ht,Xd as he,a as v,c as G,cd as rt,d as c,g,i as Fe,ig as gt,j as P,k as b,kd as ct,ld as Q,oc as Xe,od as dt,pg as wt,qd as ce,qg as bt,rd as lt,rg as ee,sd as de,te as pe,tg as fe,ti as wn,ub as je,ug as yt,ui as bn,vg as kt,vi as yn,xc as L,xg as ve,yc as k,ye as ue,yg as xt,yi as kn}from"./chunk-RWL35LDP.js";var T="phrases";function I(t,i){return t!=null&&Object.hasOwn(t,i)?t[i]:void 0}function N(t){if(!Array.isArray(t))return;let i=new Set,e=[];for(let n of t){if(!F(n)||typeof n.id!="string"||n.id==="")return;let s=n.id.toUpperCase();if(i.has(s))return;i.add(s),e.push([s,n])}return e}function Yn(t,i,e){let n=t===null?void 0:t,s=i===null?void 0:i,o=e===null?void 0:e,a=n===void 0?[]:N(n),r=s===void 0?void 0:N(s),h=o===void 0?void 0:N(o);if(a===void 0||r===void 0||h===void 0)return V(s,n)?o:s;let d=new Map(a),l=new Map(r),u=new Map(h),y=(w,$)=>{let _=d.get(w);return _===void 0||!V($,_)},m=(w,$,_)=>y(w,$)?$:_,S=(w,$)=>d.has(w)&&!y(w,$)?void 0:$,x=r.map(([w])=>w).filter(w=>d.has(w)),O=a.map(([w])=>w).filter(w=>l.has(w)),C=x.length!==O.length||x.some((w,$)=>w!==O[$]),ae=C?r:h,p=C?h:r,W=C,R=[];for(let[w,$]of ae){let _=(W?u:l).get(w);if(_!==void 0)R.push(W?m(w,$,_):m(w,_,$));else{let qe=S(w,$);qe!==void 0&&R.push(qe)}}for(let[w,$]of p){if((W?l:u).has(w))continue;let _=S(w,$);_!==void 0&&R.push(_)}let Z=w=>Array.isArray(w)&&w.length===R.length&&R.every(($,_)=>$===w[_]);return Z(o)?o:Z(s)?s:R}function xn(t,i,e){let n=At(t,i,e),s=Yn(t==null?e[T]:I(t,T),I(i,T),I(e,T)),o=I(n,T);if(s===o)return n;if(s===void 0){if(!Object.hasOwn(n,T))return n;let{[T]:a,...r}=n;return r}return n===e||n===i?{...n,[T]:s}:(n[T]=s,n)}function $n(t,i,e){let n=new Set([...Object.keys(i),...Object.keys(e)]),s=[];for(let o of n){if(o===T){let l=new Map(N(I(t,T))??[]),u=N(I(i,T)),y=new Map(N(I(e,T))??[]);if(u===void 0)continue;u.some(([S,x])=>{let O=y.get(S),C=l.get(S);return O!==void 0&&!V(x,O)&&(C===void 0||!V(x,C)&&!V(O,C))})&&s.push(o);continue}let a=I(t,o),r=I(i,o),h=I(e,o),d=l=>t==null||!V(l,a);d(r)&&d(h)&&!V(r,h)&&s.push(o)}return s.sort()}var Sn=100,Zn=3,Ie=class{constructor(i,e){this._undo=[];this._redo=[];this._replaced=[];this._base=i,this._revision=e,this._document=i}get base(){return this._base}get revision(){return this._revision}get document(){return this._document}get canUndo(){return this._undo.length>0}get canRedo(){return this._redo.length>0}get replaced(){return this._replaced}get dirty(){let i=this._dirty;if(i!==void 0&&i.document===this._document&&i.base===this._base)return i.value;let e=this._document!==this._base&&!V(this._document,this._base);return this._dirty={document:this._document,base:this._base,value:e},e}apply(i,e){if(i===this._document||V(i,this._document))return(e===void 0||e!==this._coalesceKey)&&(this._coalesceKey=void 0),!1;if(e!==void 0&&e===this._coalesceKey&&this._undo.length>0){let n=this._undo[this._undo.length-1];return V(i,n)?(this._undo.pop(),this._document=n,this._coalesceKey=void 0):this._document=i,this._redo=[],!0}return this.pushUndo(this._document),this._redo=[],this._document=i,this._coalesceKey=e,!0}endCoalesce(){this._coalesceKey=void 0}undo(){this._coalesceKey=void 0;let i=this._undo.pop();return i===void 0?!1:(this._redo.push(this._document),this._document=i,!0)}redo(){this._coalesceKey=void 0;let i=this._redo.pop();return i===void 0?!1:(this.pushUndo(this._document),this._document=i,!0)}discard(){return this._coalesceKey=void 0,this.apply(this._base)}rebase(i,e){return e<this._revision?(this._replaced=[],!1):this.mergeOnto(i,e)}restart(i,e){return this.mergeOnto(i,e)}mergeOnto(i,e){this._coalesceKey=void 0;let n=this._base;this._replaced=this._document===n?[]:$n(n,this._document,i);let s=new Map,o=u=>{let y=s.get(u);if(y!==void 0)return y;let m=u===n?i:xn(n,u,i);return m!==i&&V(m,i)&&(m=i),s.set(u,m),m},a=this._document,r=[...this._undo,this._document,...this._redo.slice().reverse()].map(o),h=this._undo.length,d=[],l=0;return r.forEach((u,y)=>{let m=d[d.length-1];m!==void 0&&(m===u||V(m,u))?y===h&&(d[d.length-1]=u):d.push(u),y===h&&(l=d.length-1)}),this._undo=d.slice(0,l),this._document=d[l],this._redo=d.slice(l+1).reverse(),this._base=i,this._revision=e,this._document!==a&&!V(this._document,a)}saved(i,e){e<this._revision||(this._coalesceKey=void 0,this._base=i,this._revision=e)}get saving(){return B.has(this)}get saveDone(){return B.get(this)}pushUndo(i){this._undo.push(i),this._undo.length>Sn&&this._undo.splice(0,this._undo.length-Sn)}},B=new WeakMap;function Vn(t,i){if(B.has(t))return Promise.resolve({ok:!1,revision:t.revision,merged:!1,code:"busy",message:"These voice settings are being saved already."});let e=Gn(t,i).finally(()=>B.delete(t));return B.set(t,e),e}async function Gn(t,i){let e=!1,n=new Set,s=()=>n.size===0?{}:{replaced:[...n].sort()},o=(a,r,h)=>({ok:!1,revision:t.revision,merged:e,code:a,message:r,...h===void 0?{}:{problems:h}});for(let a=1;;a++){let r=t.document,h=hn(r);if(h.length>0)return o("invalid",h.join(" "),h);let d;try{({revision:d}=await i.save(t.revision,r))}catch(l){let{code:u="unknown",message:y}=D(l);if(u!=="conflict"||a>=Zn)return o(u,y);let m;try{m=await i.fetch()}catch(S){let x=D(S);return o(x.code??"unknown",x.message)}if(!F(m)||!(m.revision>0)||!F(m.document))return o("no_record","Home Assistant holds no voice settings for this watch.");m.revision<t.revision?t.restart(m.document,m.revision):t.rebase(m.document,m.revision);for(let S of t.replaced)n.add(S);if(e=!0,!t.dirty)return{ok:!0,revision:t.revision,merged:e,alreadySaved:!0};continue}return t.saved(r,d),{ok:!0,revision:t.revision,merged:e,...s()}}}async function _n(t){try{let{revision:i}=await t(0,jt());return{ok:!0,revision:i}}catch(i){let{code:e,message:n}=D(i);return e==="no_record"||e==="conflict"?{ok:!1,code:e,message:n}:e==="unknown_command"?{ok:!1,code:"unsupported",message:n}:{ok:!1,code:"error",message:n}}}var U=new Map;function z(t){return U.get(t)}function Tn(t,i,e){let n=U.get(t);if(n!==void 0&&e<=0)return{draft:n,mergedIntoEdits:!1,replaced:[]};if(n===void 0||e<n.revision&&!n.dirty){let a=new Ie(i,e);return U.set(t,a),{draft:a,mergedIntoEdits:!1,replaced:[]}}if(e===n.revision)return{draft:n,mergedIntoEdits:!1,replaced:[]};let s=n.dirty,o=e<n.revision?n.restart(i,e):n.rebase(i,e);return{draft:n,mergedIntoEdits:s&&o,replaced:s?n.replaced:[]}}function se(t){U.delete(t)}function Oe(){for(let t of U.values())if(t.dirty)return!0;return!1}function Cn(){U.clear()}var Xn={defaultAssistAgentId:"the conversation agent",defaultTTSEngine:"the text to speech engine",defaultSpeakers:"the speakers",phrases:"the phrases",watchSpeakReplyInSilentMode:"Speak even in Silent Mode",watchSpeechVoiceIdentifier:"the watch voice"};function Qn(t){return Xn[t]??"a setting this panel does not show"}function De(t){if(t.length===0)return"";let i=[...new Set(t.map(Qn))];return`The iPhone also changed ${i.length===1?i[0]:`${i.slice(0,-1).join(", ")} and ${i[i.length-1]}`}. ${i.length===1?"Your version replaced it.":"Your versions replaced them."}`}function Pn(t){if(t.ok){if(t.alreadySaved===!0)return{kind:"ok",text:`Nothing left to save. The iPhone saved the same changes, as revision ${t.revision}.`};let e=t.replaced??[];return e.length>0?{kind:"warn",text:`Saved. ${De(e)}`}:t.merged?{kind:"ok",text:"Saved. Changes from the iPhone were merged in."}:void 0}let i=(t.message??"").trim();switch(t.code){case"conflict":return{kind:"warn",text:"Not saved. The voice settings kept changing on the iPhone while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds voice settings for this watch. Start with the defaults again, or let the iPhone send its own."};case"invalid":{let e=t.problems??[];return e.length>0?{kind:"err",text:`Not saved. ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the voice settings${i===""?".":`: ${i}`}`}}case"busy":return{kind:"warn",text:"Already saving these voice settings. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the voice settings just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${i===""?".":`: ${i}`}`}}}var In=[["defaults","Defaults"],["watch","On the watch"]],On={defaults:"What Assist and Speak use when a tile, a slot or a phrase picks nothing of its own.",watch:"How the watch itself speaks a reply."},ei="The voice defaults, the phrase library and the watch's own speech. A save reaches the watch the next time it checks, or through the iPhone.",Dn="Pick from List shows these phrases on the watch. Tap one to edit it.",ti={defaults:{color:L.content,icon:"content"},watch:{color:L.content,icon:"watch"},phrase:{color:L.content,icon:"text"},look:{color:L.look,icon:"look"},speech:{color:L.content,icon:"content"}},ni="#ab47bc",Y="voice-editor",En=44,Wn=22;function A(t,i){let e=t.states[i]?.attributes?.friendly_name;return typeof e=="string"&&e.trim()!==""?e:i}function Rn(t,i){let e=i.indexOf(".");return{entityId:i,displayName:i===""?"":A(t,i),domain:e>0?i.slice(0,e):""}}function Hn(t,i,e,n){return t.icons.render(i,e,n)??c`<span class="vo-glyph-dot" style=${`background:${n}`}></span>`}function Ee(t){if(typeof t!="string"||t==="")return{fill:"#D88CC4",ink:"#D88CC4"};if(t.toUpperCase()==="#RAINBOW")return{fill:"conic-gradient(#FF3B30, #FF9500, #FFCC00, #34C759, #007AFF, #AF52DE, #FF3B30)",ink:"#FF9500"};if(t.toUpperCase().startsWith("GRADIENT|")){let i=t.split("|").slice(1).filter(e=>/^#[0-9a-fA-F]{6}$/.test(e));if(i.length>=2)return{fill:`linear-gradient(135deg, ${i.join(", ")})`,ink:i[0]};if(i.length===1)return{fill:i[0],ink:i[0]}}return{fill:t,ink:t}}function Mn(t,i){return Lt(t.uiState,Y,i)}function ii(t,i){ke(t.uiState,Y,i,!Mn(t,i)),t.requestUpdate()}function J(t,i,e,n,s={}){let o=Mn(t,i),a=ti[i];return at({color:a.color,icon:k(a.icon),title:e,open:o,onToggle:()=>ii(t,i),...s.summary===void 0||s.summary===""?{}:{summary:s.summary},dot:s.dot===!0,id:`${Y}:${i}`},o?n:c``)}var We="vo:pick";function q(t){let i=t.uiState.get(We);if(typeof i=="string"&&i.startsWith("phrase:")){let e=en(t.document,i.slice(7));if(e!==void 0)return{phrase:e}}return{section:i==="watch"?"watch":"defaults"}}function He(t,i){t.uiState.set(We,i),t.requestUpdate()}function Me(t,i){t.uiState.set(We,`phrase:${i}`),t.requestUpdate()}function An(t){return"phrase"in q(t)?(He(t,"defaults"),!0):!1}function si(t){let i;t.edit(e=>{let n=nn(e);return i=n.id,n.document}),i!==void 0&&(ke(t.uiState,Y,"phrase",!0),Me(t,i))}function oi(t,i){if(i==="defaults"){let s=H(t.document);return s.speakers.length===0?"No speakers":s.speakers.map(a=>A(t.hass,a)).join(", ")}let e=Te(t.document),n=e===void 0?void 0:t.voices.find(s=>s.id===e);return e===void 0?"System voice":n!==void 0?Ce(n):e}function Ln(t){let i=q(t),e="section"in i?i.section:void 0;return c`<section class="card lc vo-voice-card" aria-label="Voice"
    style=${`--c: var(--wa-lc-pages, #26a69a); --thumb-w: ${En}px; --thumb-h: ${Wn}px`}>
    <div class="lc-head">
      <span class="swatch">${kn()}</span><span class="lc-title">Voice</span>
      <span class="lc-sub" title=${ei}>for the watch</span>
    </div>
    <div class="layers vo-section-list" role="list">
      ${In.map(([n,s])=>{let o=n===e,a=()=>He(t,n);return c`<div class="layer vo-section-row ${o?"hl":""}" data-section=${n} role="listitem" tabindex="0"
          aria-current=${o?"true":"false"} aria-label=${s} title=${On[n]}
          @click=${a}
          @keydown=${r=>{r.target!==r.currentTarget||r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),a())}}>
          <span class="grip" aria-hidden="true"></span>
          <span class="thumb vo-thumb" aria-hidden="true">${k(n==="watch"?"watch":"content")}</span>
          <span class="name"><b><span class="nm-t">${s}</span></b><small>${oi(t,n)}</small></span>
          <span class="right"></span>
        </div>`})}
    </div>
  </section>`}function ai(t,i){let e=Ee(i.color),n=typeof i.icon=="string"&&i.icon!==""?i.icon:"speaker.wave.2";return c`<span class="thumb vo-thumb" style=${`--c:${e.ink}`} aria-hidden="true"><span class="vo-thumb-glyph">${Hn(t,n,14,e.ink)}</span></span>`}function ri(t){let i=ie(t);return i.length>0?`Needs a ${i.join(" and a ")}`:typeof t.message=="string"?t.message:""}function ci(t,i,e,n,s){let o=M(i),a=s!==void 0&&M(s).toUpperCase()===o.toUpperCase(),r=ne(i),h=ri(i),d=ie(i).length>0,l=()=>Me(t,o);return c`<div class="layer vo-phrase-row ${a?"hl":""}" data-phrase=${o} role="listitem" tabindex="0"
    aria-current=${a?"true":"false"} aria-label=${r} title=${`${r} \xB7 ${h}`}
    @click=${u=>{u.target instanceof Element&&u.target.closest("button")||l()}}
    @keydown=${u=>{u.target!==u.currentTarget||u.key!=="Enter"&&u.key!==" "||(u.preventDefault(),l())}}>
    <span class="grip" aria-hidden="true"></span>
    ${ai(t,i)}
    <span class="name"><b><span class="nm-t">${r}</span></b><small class=${d?"vo-needs":""}>${h}</small></span>
    <span class="right">
      <span class="acts">
        <button type="button" class="icon" ?disabled=${t.busy||e===0} title="Move up" aria-label=${`Move ${r} up`}
          @click=${()=>t.edit(u=>K(u,o,e-1))}>${k("up")}</button>
        <button type="button" class="icon" ?disabled=${t.busy||e===n-1} title="Move down" aria-label=${`Move ${r} down`}
          @click=${()=>t.edit(u=>K(u,o,e+1))}>${k("down")}</button>
        <button type="button" class="icon danger" ?disabled=${t.busy} title="Remove" aria-label=${`Remove ${r}`}
          @click=${()=>t.edit(u=>Pe(u,o))}>${k("delete")}</button>
      </span>
    </span>
  </div>`}function Nn(t){let i=E(t.document),e=q(t),n="phrase"in e?e.phrase:void 0,s=tn(t.document);return c`<section class="card lc vo-phrases-card" aria-label="Phrases"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${En}px; --thumb-h: ${Wn}px`}>
    <div class="lc-head">
      <span class="swatch">${k("list")}</span><span class="lc-title">Phrases</span>
      <span class="lc-sub">${i.length} of ${$e}</span>
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri vo-add-phrase" aria-label="Add phrase" ?disabled=${t.busy||s}
        title=${s?`The watch takes ${$e} phrases at most.`:"Add a phrase at the end"}
        @click=${()=>si(t)}>${k("plus")}<span>Add</span></button>
    </div>
    ${i.length===0?c`<div class="lc-note">No phrases yet. A phrase is a message Pick from List and Speak Phrase can say on your speakers.</div>`:c`<div class="layers vo-phrase-list" role="list">${i.map((o,a)=>ci(t,o,a,i.length,n))}</div>`}
  </section>`}function Un(t){let{width:i,height:e}=t.screen,n=t.scale,s=E(t.document),o=q(t),a="phrase"in o?M(o.phrase).toUpperCase():void 0,r=s.map(d=>{let l=M(d),u=Ee(d.color),y=a!==void 0&&l.toUpperCase()===a,m=ne(d),S=typeof d.icon=="string"&&d.icon!==""?d.icon:"speaker.wave.2",x=d.displayMode==="text";return c`<button type="button" class="vo-say ${x?"vo-words":"vo-glyph"} ${y?"on":""}" style=${`--fill:${u.fill};--ink:${u.ink}`}
      title=${m} aria-label=${m} aria-pressed=${y?"true":"false"} @click=${()=>Me(t,l)}>
      ${x?c`<span class="vo-say-text">${m}</span>`:c`<span class="vo-say-well">${Hn(t,S,Math.round(16*n),"#fff")}</span>
        <span class="vo-say-label">${m}</span>`}
    </button>`}),h=c`<div class="vo-screen" role="group" aria-label="Pick from List on the watch"
    style=${`width:${Math.round(i*n)}px;height:${Math.round(e*n)}px;--vo-s:${n}`}>
    <div class="vo-screen-title">Phrases</div>
    ${s.length===0?c`<p class="vo-screen-note">No phrases yet.</p>`:c`<div class="vo-say-list">${r}</div>`}
  </div>`;return Ht({width:i,height:e},n,h,"Pick from List on the watch")}function zn(t){let i=E(t.document).length;return[`${i} ${i===1?"phrase":"phrases"}`]}function di(t){let i=q(t);return("phrase"in i?["phrase","look","speech"]:[i.section]).map(n=>({module:Y,section:n}))}function qn(t){let i=q(t),e=di(t),n=Nt(t.uiState,e),s,o;if("phrase"in i){let a=ne(i.phrase);s=c`<div class="crumbs"><button class="root" title="The voice defaults" @click=${()=>He(t,"defaults")}>Voice</button><span class="sep">›</span><span class="kchip" style=${`--k:${Ee(i.phrase.color).ink}`}>Phrase</span><span class="nm" title=${a}>${a}</span></div>`,o=fi(t,i.phrase)}else{let a=In.find(([r])=>r===i.section)?.[1]??"";s=c`<div class="crumbs"><span class="kchip" style=${`--k:${ni}`}>Voice</span><span class="nm" title=${a}>${a}</span></div>`,o=c`<p class="vo-note">${On[i.section]}</p>
      ${i.section==="defaults"?li(t):pi(t)}
      <p class="vo-note vo-pick-note">Pick a phrase to edit it, or add one.</p>`}return c`<div class="insp-head">
      ${s}
      <button class="expand" @click=${()=>{Ut(t.uiState,e,!n),t.requestUpdate()}}>${n?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${o}</div>`}function Fn(t,i,e,n){let s=Ft(t.hass.states),o=xe(s,e),a=l=>l.missing?`${l.entityId} (not found)`:l.name,r=l=>ve(a(l),e.includes(l.entityId),u=>n(l.entityId,u)),h=s.filter(l=>l.announces),d=o.filter(l=>!h.some(u=>u.entityId===l.entityId));return c`<div class="vo-sub-h"><span>${i}</span></div>
    <div class="vo-list" role="group" aria-label=${i}>
      ${o.length===0?c`<div class="hint">No media players in Home Assistant.</div>`:g}
      ${h.length>0?c`<div class="vo-group">Speakers</div>${h.map(r)}`:g}
      ${d.length>0?c`${h.length>0?c`<div class="vo-group">Other media players</div>`:g}${d.map(r)}`:g}
    </div>`}function li(t){let i=H(t.document),e=[i.agent===void 0?"Default agent":A(t.hass,i.agent),i.engine===void 0?"No engine":A(t.hass,i.engine)].join(" \xB7 "),n=c`<fieldset class="vo-body" ?disabled=${t.busy} aria-label="Defaults">
    <div class="vo-stack">${me({hass:t.hass},"Conversation agent",Rn(t.hass,i.agent??""),s=>t.edit(o=>Kt(o,s.entityId)),"vo:agent",{domain:"conversation",clearable:!0})}</div>
    <div class="hint">${i.agent===void 0?"None picked: Home Assistant's own default agent answers.":"Assist uses this agent unless a tile or a slot picks its own."}</div>
    <div class="vo-stack">${me({hass:t.hass},"Text to speech engine",Rn(t.hass,i.engine??""),s=>t.edit(o=>Bt(o,s.entityId)),"vo:engine",{domain:"tts",clearable:!0})}</div>
    <div class="hint ${i.engine===void 0?"warn":""}">${i.engine===void 0?"Not set. Speaking on speakers needs an engine.":"Speakers say messages and replies with this engine unless a tile, a slot or a phrase picks its own."}</div>
    ${Fn(t,"Speakers",i.speakers,(s,o)=>t.edit(a=>Jt(a,s,o)))}
    <div class="hint">${i.speakers.length===0?"None picked. A slot or a phrase set to speakers with none of its own then plays nowhere.":"Assist, Speak and phrases play here unless they pick their own."}</div>
  </fieldset>`;return J(t,"defaults","Defaults",n,{summary:e,dot:i.agent!==void 0||i.engine!==void 0||i.speakers.length>0})}function hi(t,i){let e=[{value:"",label:"System voice"}];i!==void 0&&!t.some(n=>n.id===i)&&e.push({value:i,label:`${i} (not on this watch)`});for(let n of Qt(t))for(let s of n.voices)e.push({value:s.id,label:Ce(s),group:n.language});return e}function pi(t){let i=Yt(t.document),e=Te(t.document),n=hi(t.voices,e),s=[];for(let d of n){let l=s[s.length-1];l!==void 0&&l.group!==void 0&&l.group===d.group?l.options.push(d):s.push({group:d.group,options:[d]})}let o=d=>c`<option value=${d.value} .selected=${he(d.value===(e??""))}>${d.label}</option>`,a=t.voicesState==="unsupported"?"Update the integration to list this watch's voices.":t.voicesState==="error"?"Could not read this watch's voices.":t.voicesState==="ready"&&t.voices.length===0?mn:void 0,r=c`<fieldset class="vo-body" ?disabled=${t.busy} aria-label="On the watch">
    ${ve("Speak even in Silent Mode",i,d=>t.edit(l=>Zt(l,d)),!0)}
    <div class="hint">The watch speaks a reply on its own speaker even while it is in Silent Mode.</div>
    <label class="field"><span>Watch voice</span>
      <select .value=${he(e??"")} @change=${d=>{let l=d.target.value;t.edit(u=>Gt(u,l===""?void 0:l))||t.requestUpdate()}}>
        ${s.map(d=>d.group===void 0?d.options.map(o):c`<optgroup label=${d.group}>${d.options.map(o)}</optgroup>`)}
      </select></label>
    ${a===void 0?c`<div class="hint">The voice the watch speaks a reply in. System voice follows the watch's language.</div>`:c`<div class="hint ${t.voicesState==="ready"?"":"warn"}">${a}</div>`}
  </fieldset>`,h=e===void 0?"System voice":t.voices.find(d=>d.id===e)?.name??e;return J(t,"watch","On the watch",r,{summary:h,dot:!i||e!==void 0})}function ui(t,i){let e=H(t.document),n=Object.keys(t.hass.services?.tts??{}),s=xe(qt(t.hass.states,n,t.cloudTTS),i===void 0?[]:[i]);return[["",e.engine===void 0?"Default (Not set)":`Default (${s.find(a=>a.entityId===e.engine&&!a.missing)?.name??A(t.hass,e.engine)})`],...s.map(a=>[a.entityId,a.missing?`${a.entityId} (not found)`:a.name])]}function fi(t,i){let e=M(i),n=(p,W,R=!1)=>t.edit(Z=>cn(Z,e,p,W),R?`phrase:${e}:${p}`:void 0),s=ie(i),o=p=>typeof i[p]=="string"?i[p]:"",a=c`<fieldset class="vo-body" ?disabled=${t.busy} aria-label="Phrase">
    ${ee("Message",o("message"),p=>n("message",p,!0),{placeholder:"What the speakers say"})}
    ${ee("Label",o("label"),p=>n("label",p,!0),{placeholder:"Its name on the watch"})}
    ${s.length>0?c`<div class="hint warn">The phrase needs a ${s.join(" and a ")} before it can be saved.</div>`:g}
    ${yt("Display mode",String(i.displayMode??"icon"),Se("TTSPhraseDisplayMode"),p=>n("displayMode",p),{def:te.newPhrase.displayMode})}
    <div class="hint">How Pick from List shows it: its icon, or its label.</div>
  </fieldset>`,r=i.color,h=on(r),d=c`<fieldset class="vo-body" ?disabled=${t.busy} aria-label="Look">
    <div class="vo-stack">${$t({icons:t.icons,symbols:t.symbols},typeof i.icon=="string"?i.icon:"",p=>n("icon",p,!0),`vo:icon:${e}`,void 0,"Icon",!1)}</div>
    <div class="vo-no-alpha">${xt("Color",sn(r)?r:void 0,p=>{p!==void 0&&n("color",p,!0)},!1,te.newPhrase.color)}</div>
    ${h===void 0?g:c`<div class="hint">${h}, set on the iPhone. Picking a color here replaces it.</div>`}
  </fieldset>`,l=Array.isArray(i.targetSpeakers)?i.targetSpeakers.filter(p=>typeof p=="string"):[],u=H(t.document),y=typeof i.ttsEngine=="string"&&i.ttsEngine.trim()!==""?i.ttsEngine.trim():void 0,m=an(i),S=rn(i),x=te.volume,O=c`<fieldset class="vo-body" ?disabled=${t.busy} aria-label="Speech">
    ${Fn(t,"Speakers",l,(p,W)=>t.edit(R=>dn(R,e,p,W)))}
    <div class="hint">${l.length>0?"This phrase plays only on these.":u.speakers.length>0?`None picked: the default speakers play (${u.speakers.map(p=>A(t.hass,p)).join(", ")}).`:"None picked, and no default speakers: set some in Defaults."}</div>
    ${fe("Voice engine",y??"",ui(t,y),p=>n("ttsEngine",p===""?void 0:p),{snapBack:!0})}
    ${ee("Language",typeof i.language=="string"?i.language:"",p=>n("language",p,!0),{placeholder:"The engine's own"})}
    <div class="hint">A language code such as en or de, for an engine that speaks more than one.</div>
    ${fe("Speech volume",m,Se("TTSPhraseSpeechVolumeMode"),p=>n("speechVolumeMode",p),{snapBack:!0,def:"keepCurrent"})}
    ${m==="keepCurrent"?g:c`${kt("Target volume",S,p=>n("speechVolumePercent",p,!0),{min:x.min,max:x.max,step:x.step,def:x.default,format:p=>`${Math.round(p)}${x.unit}`})}
      <div class="vo-chips">${x.presets.map(p=>c`<button type="button" class="pe-chip ${S===p.value?"on":""}"
        aria-pressed=${S===p.value?"true":"false"} @click=${()=>n("speechVolumePercent",p.value)}>${p.label} ${p.value}%</button>`)}</div>`}
  </fieldset>`,C=E(t.document).findIndex(p=>M(p).toUpperCase()===e.toUpperCase()),ae=E(t.document).length;return c`${J(t,"phrase","Phrase",a,{summary:o("message"),dot:s.length>0})}
    ${J(t,"look","Look",d,{summary:typeof i.icon=="string"?i.icon:"",dot:!1})}
    ${J(t,"speech","Speech",O,{summary:y===void 0?"Defaults":A(t.hass,y),dot:ln(i)})}
    <div class="vo-acts">
      <button type="button" class="pe-btn" ?disabled=${t.busy||C<=0} @click=${()=>t.edit(p=>K(p,e,C-1))}>${k("up")}<span>Move up</span></button>
      <button type="button" class="pe-btn" ?disabled=${t.busy||C>=ae-1} @click=${()=>t.edit(p=>K(p,e,C+1))}>${k("down")}<span>Move down</span></button>
      <button type="button" class="pe-btn pe-danger" ?disabled=${t.busy} title="Remove this phrase from the library"
        @click=${()=>t.edit(p=>Pe(p,e))}>${k("delete")}<span>Remove</span></button>
    </div>
    <p class="vo-note">A menu slot that speaks this phrase keeps pointing at it after an edit. Removing it leaves such a slot with nothing to say.</p>`}var jn=G`
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
`;yn({dirty:Oe,drop:Cn});typeof window<"u"&&window.addEventListener("beforeunload",t=>{Oe()&&(t.preventDefault(),t.returnValue="")});var vi=15e3,Jn=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),Ae=Jn?"\u2318":"Ctrl+",Le={min:200,max:720,middleMin:320},Ne={left:280,right:340},Ue="wrist-assistant-panel.voice.columns.v1",mi=24,Kn=820;function ze(t){return D(t).message}function oe(t){return D(t).code}function Bn(t){let{code:i,message:e}=D(t);return Object.assign(new Error(e),i===void 0?{}:{code:i})}function gi(t){return t<1e3?`${t} bytes`:`${Number((t/1e3).toFixed(1))} KB`}function wi(t){let i=t?Date.parse(t):NaN;return Number.isNaN(i)?"":Xe(Math.max(0,(Date.now()-i)/1e3))}function bi(t){return t==="panel"?"Saved here":"From the watch"}function yi(t){return t instanceof HTMLElement?Et(t.tagName,t instanceof HTMLInputElement?t.type:void 0,t.isContentEditable):!1}function ki(){let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t===null||t===document.body||t===document.documentElement}function xi(t){let i=Ve(t)??{},e=E(i).length,n=H(i).speakers.length;return`${e} ${e===1?"phrase":"phrases"}. ${n===0?"No default speakers.":`${n} default ${n===1?"speaker":"speakers"}.`}`}var f=class extends Fe{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=g;this.shellOwnsWatch=!1;this.unsupported=!1;this.voices=[];this.voicesState="loading";this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.starting=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.columns={...Ne};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new _t(this);this.symbols=new mt(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.voicesSeq=0;this.historySeq=0;this.subscribeSeq=0;this.cloudSeq=0;this.onReconnect=()=>{let e=this.watchId;!this.isConnected||e===void 0||(this.load(e,!0),this.loadVoices(e),this.loadCloud())};this.onScrubStart=e=>{e.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=e=>{e.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=e=>{if(e.defaultPrevented)return;let n=e.composedPath();if(!n.includes(this)&&!ki()||this.renderRoot.querySelector("dialog[open]"))return;let s=e.metaKey||e.ctrlKey,o=e.key.toLowerCase();if(s&&!e.altKey&&o==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1;return}if(e.key==="Escape"&&this.watchMenuOpen){e.preventDefault(),this.watchMenuOpen=!1;return}if(!yi(n[0])){if(s&&!e.altKey&&o==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}if(e.ctrlKey&&!e.metaKey&&!e.altKey&&o==="y"){e.preventDefault(),this.redo();return}if(e.key==="Escape"&&!s&&!e.altKey){let a=this.viewHost();a!==void 0&&An(a)&&e.preventDefault()}}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let n=e.composedPath(),s=o=>n.some(a=>a instanceof HTMLElement&&a.classList.contains(o));this.topMenuOpen&&!s("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!s("ve-watch-picker")&&(this.watchMenuOpen=!1)};this.addEventListener(wt,this.onScrubStart),this.addEventListener(bt,this.onScrubEnd),this.addEventListener("focusout",()=>this.draft?.endCoalesce())}get watches(){return ct(this.owners.length>0?this.owners:this.ownList??[])}get draft(){if(!(this.watchId===void 0||this.record===void 0||this.record.revision<=0))return z(this.watchId)}get saving(){return this.draft?.saving??!1}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=ft(Ue,Ne,Le),this.watchSize(),this.listenForReconnect(),this.loadCloud(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.voicesSeq++,this.historySeq++,this.cloudSeq++}willUpdate(e){if(this.hass){e.has("hass")&&(this.listenForReconnect(),this.cloudTTS===void 0&&e.get("hass")===void 0&&this.loadCloud()),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,je(this.hass).then(o=>{this.ownList=o.owners},()=>{this.ownList=[]}));let s=ht(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||e.has("ownerId"));s!==void 0&&this.openWatch(s)}this.followSave();let n=this.restoreAsk;n!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(s=>s.revision===n.entry.revision)&&this.closeAsk()}updated(){let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),Rt(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let n of e){if(n.target!==this){this.measureTop(n.target);continue}let s=n.contentRect;Math.abs(s.width-this.hostWidth)>=1&&(this.hostWidth=s.width),Math.abs(s.height-this.hostHeight)>=1&&(this.hostHeight=s.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let n=this.renderRoot?.querySelector(".pe-top")??void 0;n!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=n,n!==void 0&&e.observe(n))}measureTop(e){let n=e.offsetHeight;n!==this.topHeight&&(this.topHeight=n,this.style.setProperty("--pe-top-h",`${n}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let e=this.watchId;if(e===void 0)return;let n=z(e)?.saveDone;if(n===void 0||n===this.followedSave)return;this.followedSave=n;let s=()=>this.saveEnded(e);n.then(s,s)}saveEnded(e){this.requestUpdate(),this.isConnected&&(e===this.watchId?(this.reloadPending=!1,this.load(e,!0)):this.flushPending())}openWatch(e,n=!1){e!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=e,this.note=void 0,this.unsupported=!1,this.voices=[],this.voicesState="loading",this.voicesSeq++,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),n=!1),this.startSubscription(e),this.load(e,n),this.loadVoices(e)}loadCloud(){let e=this.hass;if(!e)return;let n=++this.cloudSeq;Ge(e).then(s=>{n===this.cloudSeq&&(this.cloudTTS=zt(s))},()=>{n===this.cloudSeq&&(this.cloudTTS=!1)})}async loadVoices(e){let n=this.hass;if(!n)return;let s=++this.voicesSeq;try{let o=await Ze(n,e);if(s!==this.voicesSeq||e!==this.watchId)return;this.voices=Xt(o),this.voicesState="ready"}catch(o){if(s!==this.voicesSeq||e!==this.watchId)return;this.voicesState=oe(o)==="unknown_command"?"unsupported":"error"}}async load(e,n=!1){let s=this.hass;if(!s)return;if(n&&this.holdReload){this.reloadPending=!0;return}let o=++this.loadSeq;this.stopPolling(),n||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let a=await X(s,e,"voice");if(o!==this.loadSeq)return;if(n&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(a),this.loadError=void 0}catch(a){if(o!==this.loadSeq)return;gn(a)?(this.unsupported=!0,this.loadError=void 0):n||(this.loadError=ze(a)),this.restartDraft?.watchId===e&&(this.restartDraft=void 0)}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(e))}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(e){let n=this.watchId;this.record=e;let s=e.revision>0?Ve(e.document):void 0;if(n===void 0||s===void 0)return;let o=this.restartDraft;o!==void 0&&o.watchId===n&&e.revision>=o.revision&&(this.restartDraft=void 0,(z(n)?.dirty??!1)||se(n));let a=Tn(n,s,e.revision);a.replaced.length>0?this.note={kind:"warn",text:De(a.replaced)}:a.mergedIntoEdits&&(this.note={kind:"warn",text:"The voice settings changed on the iPhone. Your edits are kept."}),this.requestUpdate()}async loadHistory(e){let n=this.hass;if(!n||this.historyState==="unsupported")return;let s=++this.historySeq;try{let o=await Ke(n,e,"voice");if(s!==this.historySeq||e!==this.watchId)return;this.history=Array.isArray(o?.entries)?o.entries:[],this.historyState="ready"}catch(o){if(s!==this.historySeq||e!==this.watchId)return;this.historyState=oe(o)==="unknown_command"?"unsupported":"error"}}startSubscription(e){let n=this.hass;if(this.endSubscription(),!n)return;let s=++this.subscribeSeq;Ye(n,e,o=>{s===this.subscribeSeq&&o.kind==="voice"&&o.revision!==(this.record?.revision??0)&&this.load(e,!0)}).then(o=>{s===this.subscribeSeq?this.unsubscribe=o:o().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let e=this.unsubscribe;this.unsubscribe=void 0,e?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||rt(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},vi))}async poll(){this.pollTimer=void 0;let e=this.hass,n=this.watchId,s=this.record;if(!(!e||n===void 0||s===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let o=await X(e,n,"voice");if(n!==this.watchId||this.record!==s)return;o.revision===s.revision?this.record={...s,delivered_revision:o.delivered_revision,delivered_at:o.delivered_at,rejected_revision:o.rejected_revision,rejected_at:o.rejected_at}:this.holdReload?this.reloadPending=!0:(this.show(o),this.loadHistory(n))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,n){let s=this.draft;if(!s||this.saving)return!1;let o=s.apply(e(s.document),this.scrubKey??n);return this.requestUpdate(),o}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let e=this.icons??Dt,n=this.iconMemo;if(n!==void 0&&n.provider===e&&n.tick===this.iconsTick)return n.icons;let s=Wt(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:s},s}screen(){let e=this.watches.find(n=>n.owner_watch_id===this.watchId);return(ue(e?.screen_size)??pe).screen}viewHost(){let e=this.draft,n=this.hass;if(e===void 0||n===void 0)return;let s=this;return{hass:n,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.stageScale,voices:this.voices,voicesState:this.voicesState,cloudTTS:this.cloudTTS,get document(){return e.document},get busy(){return s.saving},edit:(o,a)=>this.draft===e&&this.edit(o,a),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.draft?.undo()&&this.requestUpdate()}redo(){this.draft?.redo()&&this.requestUpdate()}discard(){this.saving||this.draft?.discard()&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,n=this.watchId;this.endScrub();let s=this.draft;if(!e||n===void 0||!s||this.saving||!s.dirty)return;this.note=void 0;let o=Vn(s,{save:(r,h)=>re(e,n,"voice",r,h).catch(d=>{throw Bn(d)}),fetch:async()=>{let r=await X(e,n,"voice").catch(h=>{throw Bn(h)});return{revision:r.revision,document:r.document}}});this.followedSave=s.saveDone,this.requestUpdate();let a=await o.catch(r=>({ok:!1,revision:s.revision,merged:!1,code:oe(r)??"unknown",message:ze(r)}));this.saveEnded(n),n===this.watchId&&(this.note=Pn(a))}async startWithDefaults(){let e=this.hass,n=this.watchId;if(!e||n===void 0||this.starting)return;this.starting=!0,this.note=void 0;let s=await _n((o,a)=>re(e,n,"voice",o,a));if(this.starting=!1,n===this.watchId){if(s.ok)this.note={kind:"ok",text:"Started with the defaults. The watch picks them up the next time it checks."};else if(s.code==="no_record"){this.note={kind:"warn",text:`${fn} Watch settings has Pair a watch.`};return}else if(s.code==="conflict")this.note={kind:"warn",text:"The iPhone sent its voice settings meanwhile, so those are shown."};else if(s.code==="unsupported"){this.unsupported=!0;return}else{this.note={kind:"err",text:`Could not start: ${s.message}`};return}this.load(n,!0)}}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(e){let n=this.hass,s=this.watchId,o=this.record;if(!n||s===void 0||o===void 0||this.draft?.dirty)return;let a={entry:e,baseRevision:o.revision};this.restoreAsk=a,Be(n,s,"voice",e.revision).then(r=>{this.restoreAsk===a&&(this.restoreAsk={...a,summary:xi(r.document)})},()=>{})}async restore(){let e=this.hass,n=this.watchId,s=this.restoreAsk;if(!e||n===void 0||s===void 0||this.restoring)return;this.restoring=!0;let o;try{let a=await Je(e,n,"voice",s.entry.revision,s.baseRevision);o={kind:"ok",text:`Revision ${s.entry.revision} is back.`},n===this.watchId?this.restartDraft={watchId:n,revision:a.revision}:(z(n)?.dirty??!1)||se(n)}catch(a){let r=oe(a);r==="conflict"?o={kind:"warn",text:"Not restored. The voice settings changed somewhere else, so the newest copy is shown."}:r==="no_record"?o={kind:"warn",text:"Not restored. Home Assistant no longer holds voice settings for this watch."}:r==="not_found"?o={kind:"warn",text:"Not restored. That save is no longer kept."}:r==="unknown_command"?(this.historyState="unsupported",o={kind:"warn",text:"This version of the integration cannot restore voice settings. Update it to restore an earlier save."}):o={kind:"err",text:`Could not restore: ${ze(a)}`}}finally{this.restoring=!1,this.restoreAsk===s&&this.closeAsk()}n===this.watchId&&(this.note=o,this.load(n,!0))}render(){let e=this.watches,n=this.draft;return c`
      <div class="pe-top">
        ${this.renderTopBar(n,e)}
        ${this.note?c`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:g}
      </div>
      ${this.renderBody(e)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):g}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=Kn}renderTopBar(e,n){let s=e!==void 0&&!this.unsupported,o=s&&e.dirty;return c`<div class="wa-bar ${this.stacked?"stacked":""}" role="toolbar" aria-label="Watch voice">
      ${this.haMenu?c`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${k("menu")}</button>`:g}
      ${this.shellOwnsWatch?g:c`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():wn(void 0,!1)}>${k("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${this.shellOwnsWatch?g:this.renderWatchPicker(n)}
      ${this.renderSyncPill(s?e:void 0)}
      ${this.renderTopMenu(s?e:void 0)}
      ${s?c`<button class="primary save ${o?"dirty":""}" ?disabled=${!o||this.saving}
          title=${o?`Save (${Ae}S). A save reaches the watch the next time it checks, or through the iPhone.`:`Nothing to save (${Ae}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        <span class="tb-saved" title=${o?"Unsaved changes":""}>${Vt(this.record)}</span>`:g}
      ${this.barActions}
      <button class="help" title="Help: voice" aria-label="Help"
        @click=${()=>window.open(bn,"_blank","noopener")}>?</button>
    </div>`}renderSyncPill(e){let n=this.record;if(n===void 0||n.revision<=0||this.unsupported)return g;let s=e===void 0?{size:0,limit:1}:_e(e.document),o=ge({record:n,size:s.size,limit:s.limit,noun:"voice settings",historyState:this.historyState});return c`<span class="tb-sync ${o.tone==="ok"?"ok":"warn"}" title=${`${o.state}. ${o.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${o.state}</span>
    </span>`}noRecordState(e=this.watches){return dt(e.find(n=>n.owner_watch_id===this.watchId))}canStart(){let e=this.record;return this.watchId!==void 0&&e!==void 0&&e.revision<=0&&!this.unsupported}renderTopMenu(e){let n=this.canStart();if(e===void 0&&!n)return g;let s=this.topMenuOpen,o=a=>()=>{this.topMenuOpen=!1,a()};return c`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${s?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!s}}>···</button>
      ${s?c`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${e?c`<button class="row" role="menuitem" ?disabled=${!e.dirty||this.saving}
          title="Go back to the copy Home Assistant holds. Undo brings the edits back."
          @click=${o(()=>this.discard())}>Discard edits</button>`:g}
        ${n?c`<button class="row" role="menuitem" ?disabled=${this.starting}
          @click=${o(()=>{de(this.noRecordState())&&this.startWithDefaults()})}>${this.noRecordState()==="wait"?ce:Re}</button>`:g}
      </div>`:g}
    </span>`}personColor(e){let n=St(this.owners.length>0?this.owners:this.ownList??[]);return pt(n.findIndex(s=>s.owners.some(o=>o.owner_watch_id===e)))}renderWatchPicker(e){if(e.length<2)return g;let n=e.find(a=>a.owner_watch_id===this.watchId),s=this.watchMenuOpen,o=a=>{let r=a===void 0?void 0:this.personColor(a);return c`<span class="pe-chip-glyph" style=${r?`--pe-person: ${r}`:g} aria-hidden="true">${k("watch")}</span>`};return c`<span class="picker ve-watch-picker">
      <button type="button" class="tb-browse ve-watch-btn" aria-haspopup="menu" aria-expanded=${s?"true":"false"}
        title="Choose the watch whose voice settings are shown" @click=${()=>{this.watchMenuOpen=!s}}>
        ${o(n?.owner_watch_id)}<span class="tb-browse-l">${n?Q(n,e):"Choose a watch"}</span>
        <span class="ve-caret" aria-hidden="true">${k("chevron")}</span>
      </button>
      ${s?c`<div class="pop-menu ve-watch-menu" role="menu" aria-label="Watches">
        ${e.map(a=>{let r=a.owner_watch_id===this.watchId;return c`<button type="button" class="row ve-watch-row" role="menuitemradio" aria-checked=${r?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,r||this.openWatch(a.owner_watch_id)}}>
            ${o(a.owner_watch_id)}<span class="ve-watch-name">${Q(a,e)}</span>
            <span class="ve-watch-check" aria-hidden="true">${r?k("check"):g}</span>
          </button>`})}
      </div>`:g}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=Kn?this.columns:ut(this.hostWidth-mi,this.columns,Le)}renderGutter(e){return c`<div class="gutter ${e}" role="separator" aria-orientation="vertical"
      aria-label=${e==="left"?"Resize the voice and phrases column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${n=>{let s=this.fittedColumns();vt(n,{side:e,base:e==="left"?s.left:s.right,limits:Le,onWidth:o=>{this.columns={...this.columns,[e]:o}},onEnd:()=>le(Ue,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[e]:Ne[e]},le(Ue,this.columns)}}></div>`}get stageScale(){return this.zoom??we(this.narrow||this.stacked)}renderStage(e,n){let s=n.find(u=>u.owner_watch_id===this.watchId),a=ue(s?.screen_size)??pe,r=[...zn(e),a.label],h=this.draft,d=this.stageScale,l=we(this.narrow||this.stacked);return c`<div class="card canvas-card ve-canvas" aria-label="Pick from List">
      <div class="cv-head">
        <span class="cv-title">Pick from List</span>
        ${s!==void 0?c`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${Q(s,n)}</span></span>`:g}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${r.join(" \xB7 ")}><span class="fam">${r.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!h?.canUndo} title=${`Undo (${Ae}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${k("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!h?.canRedo} title=${Jn?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${k("redo")}</button>
        </span>
      </div>
      <div class="stage-area ve-stage-area">
        <div class="stage-tools" role="toolbar" aria-label="Stage tools">
          <span class="tb-zoom" role="group" aria-label="Zoom">
            <button class="tb icon" ?disabled=${d<=ye(d)} aria-label="Zoom out" title="Zoom out"
              @click=${()=>{this.zoom=ye(d)}}>−</button>
            <button class="tb pct" aria-label=${`Zoom ${j(d)}. Back to fit`}
              title=${`The watch at ${j(d)} of its own points. Click to fit it again (${j(l)}).`}
              @click=${()=>{this.zoom=void 0}}>${j(d)}</button>
            <button class="tb icon" ?disabled=${d>=be(d)} aria-label="Zoom in" title="Zoom in"
              @click=${()=>{this.zoom=be(d)}}>+</button>
          </span>
        </div>
        <div class="ve-stage-body">${Un(e)}</div>
        <div class="under"><span class="tail">${Dn}</span></div>
      </div>
    </div>`}renderBody(e){if(e.length===0){let h=this.owners.length===0&&this.ownList===void 0;return c`<div class="pe-empty">${h?"Loading\u2026":"No watch has connected to this Home Assistant yet."}</div>`}if(this.unsupported)return c`<div class="pe-empty"><b>${vn}</b></div>`;if(this.loading)return c`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let h=this.watchId;return c`<div class="pe-empty">
        <span>Could not read this watch's voice settings: ${this.loadError}</span>
        ${h===void 0?g:c`<button class="pe-btn" @click=${()=>{this.load(h)}}>Try again</button>`}
      </div>`}let n=this.record;if(n===void 0)return c`<div class="pe-empty">Loading…</div>`;let s=this.draft,o=this.viewHost();if(n.revision<=0||s===void 0||o===void 0){let h=this.watchId===void 0?void 0:z(this.watchId),d=this.watchId,l=this.noRecordState(e);return c`<div class="pe-empty"><b>${pn}</b><span>${lt(l,un)}</span>
        ${l==="wait"?c`<button class="link start-fresh" ?disabled=${this.starting} @click=${()=>{de(l)&&this.startWithDefaults()}}>${this.starting?"Starting\u2026":ce}</button>`:c`<button class="pe-btn pe-primary" ?disabled=${this.starting} @click=${()=>{this.startWithDefaults()}}>${this.starting?"Starting\u2026":Re}</button>`}
        ${h?.dirty&&d!==void 0?c`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when voice settings are here again.</span>
          <button class="pe-btn" @click=${()=>{se(d),this.requestUpdate()}}>Discard the kept edits</button>`:g}
      </div>`}let a=this.fittedColumns(),r=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"";return c`<div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${a.left}px;--wa-right:${a.right}px;${r}`}>
      <div class="column left">
        ${Ln(o)}
        ${Nn(o)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(o,e)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${qn(o)}
      </div>
    </div>
    ${this.renderFoot(n,s.document,s.dirty)}`}renderFoot(e,n,s){let o=_e(n),a=ge({record:e,size:o.size,limit:o.limit,noun:"voice settings",historyState:this.historyState}),r=this.watchId;return c`${Tt({status:a,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?Ct({noun:"voice settings",record:e,entries:this.history,historyState:this.historyState,dirty:s,restoring:this.restoring,onRetry:()=>{r!==void 0&&(this.historyState="loading",this.loadHistory(r))},onRestore:h=>{this.historyOpen=!1,this.askRestore(h)},onClosed:()=>{this.historyOpen=!1}}):g}
    ${this.rawOpen?Pt({noun:"voice settings",document:n,revision:e.revision,dirty:s,copied:this.rawCopied,onCopy:h=>{It(h).then(d=>{this.rawCopied=d})},onClosed:()=>{this.rawOpen=!1}}):g}`}renderRestoreAsk(e){let n=this.record,s=wi(e.entry.updated_at);return c`<dialog class="pe-ask" aria-labelledby="ve-ask-title"
      @cancel=${o=>{this.restoring&&o.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="ve-ask-title">Restore revision ${e.entry.revision}?</h3>
      <p>${bi(e.entry.updated_by)}${s?` ${s}`:""}, ${gi(e.entry.size)}.</p>
      ${e.summary?c`<p class="pe-muted">${e.summary}</p>`:g}
      <p>It is saved again as a new revision${n?`, after revision ${n.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[gt,Qe,et,tt,nt,it,st,ot,Mt,G`
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
  `,jn,Ot]}};v([P({attribute:!1})],f.prototype,"hass",2),v([P({attribute:!1})],f.prototype,"owners",2),v([P({attribute:!1})],f.prototype,"ownerId",2),v([P({type:Boolean,reflect:!0})],f.prototype,"narrow",2),v([P({attribute:!1})],f.prototype,"icons",2),v([P({attribute:!1})],f.prototype,"iconsTick",2),v([P({attribute:!1})],f.prototype,"haMenu",2),v([P({attribute:!1})],f.prototype,"onHaMenu",2),v([P({attribute:!1})],f.prototype,"onBack",2),v([P({attribute:!1})],f.prototype,"barActions",2),v([P({attribute:!1})],f.prototype,"shellOwnsWatch",2),v([b()],f.prototype,"watchId",2),v([b()],f.prototype,"record",2),v([b()],f.prototype,"unsupported",2),v([b()],f.prototype,"voices",2),v([b()],f.prototype,"voicesState",2),v([b()],f.prototype,"cloudTTS",2),v([b()],f.prototype,"loading",2),v([b()],f.prototype,"loadError",2),v([b()],f.prototype,"history",2),v([b()],f.prototype,"historyState",2),v([b()],f.prototype,"note",2),v([b()],f.prototype,"restoreAsk",2),v([b()],f.prototype,"restoring",2),v([b()],f.prototype,"starting",2),v([b()],f.prototype,"historyOpen",2),v([b()],f.prototype,"rawOpen",2),v([b()],f.prototype,"rawCopied",2),v([b()],f.prototype,"ownList",2),v([b()],f.prototype,"topMenuOpen",2),v([b()],f.prototype,"watchMenuOpen",2),v([b()],f.prototype,"zoom",2),v([b()],f.prototype,"columns",2),v([b()],f.prototype,"hostWidth",2),v([b()],f.prototype,"hostHeight",2);customElements.get("wa-voice-editor")||customElements.define("wa-voice-editor",f);export{Ue as VE_COLUMNS_KEY,f as WaVoiceEditor,xi as watchVoiceSummary};
