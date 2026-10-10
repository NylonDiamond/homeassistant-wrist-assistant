import{$ as Ii,$f as Rt,A as xe,B as Me,C as z,D as ct,E as Si,Eb as Zi,F as $i,Fb as kt,G as dt,Gb as Gi,H as ki,Hb as Xi,I as xi,Ib as Qi,J as Mi,Jb as es,K as ut,L as Ti,M as Pi,N as lt,O as ht,P as Ri,Q as _i,R as Ci,S as Di,Sb as Te,T as pt,Tb as ts,U as ft,V as Ei,Vb as ns,Vf as ws,W as mt,Wb as is,Wf as vs,X as Hi,Xb as ss,Xf as Pt,Y as gt,Yf as ys,Z as Oi,Zf as bs,_ as de,a as it,aa as Ai,b as li,ba as wt,bc as os,c as be,ca as vt,cg as Ss,d as st,da as yt,e as ot,ea as bt,ec as rs,eg as $s,fa as Wi,fg as ks,g as rt,ga as Li,gc as xt,h as hi,ha as Ni,hc as as,i as K,ia as Vi,j as B,ja as Ui,k as pi,ka as St,l as $,la as qi,m as ce,ma as ji,me as ps,n as fi,na as Fi,o as Se,oa as Ki,p as mi,q as at,r as gi,s as wi,t as vi,tf as fs,u as $e,uf as ms,v as yi,vf as gs,w as ke,x as bi,y as H,z as P}from"./chunk-43ZZGXQV.js";import{a as cs,b as ds,c as us,d as Mt,e as Tt,g as ls,h as hs}from"./chunk-XJOARIJJ.js";import{h as xs}from"./chunk-SI6HAEKT.js";import{a as Pe,g as Re,h as _t}from"./chunk-WWYNONKG.js";import{Ib as zi,Jb as Ji,Kb as Yi,Mb as $t,sa as Bi}from"./chunk-SPTWL6XW.js";import{f as nt}from"./chunk-RZRTGY27.js";import{A as di,B as ui,o as ii,p as Qe,q as si,r as et,s as tt,x as oi,y as ai,z as ci}from"./chunk-W6ZIVQ24.js";import{b as Cn,c as je,d as Dn,e as Fe,f as En,h as T,i as ri}from"./chunk-QVYMVUW6.js";import{a as Ye,b as jn,c as Fn,d as Kn,e as Bn,f as zn,g as Jn,h as Yn,i as Zn}from"./chunk-XYN2AXMK.js";import{b as Un,p as qn}from"./chunk-QV3AE5A5.js";import{a as Gn,b as Xn,d as Qn,o as E,q as Ze,r as ei,s as ye,t as Ge,u as ti,v as Xe,w as ni}from"./chunk-43HRUTRJ.js";import{Bb as Be,Gb as ze,Gd as Je,I as xn,Id as ve,L as Mn,P as me,Pf as _s,Q,U as Tn,X as ge,_ as Pn,_b as Hn,aa as Ue,ba as Rn,bb as _n,ca as qe,db as Ke,h as hn,hd as On,id as In,jd as An,qd as Wn,qf as Ms,rd as Ln,rf as Ts,sd as Nn,sf as Ps,td as Vn,tf as Rs,ud as I,vd as F,wd as we,yd as _,zd as ae}from"./chunk-RSNV3KLA.js";import{Ag as fe,Ah as $n,Bg as an,Bh as L,Cg as cn,Ch as kn,Dg as dn,Eg as un,Fg as ln,b as pe,c,cg as rn,d as sn,dh as W,eh as S,f as p,i as on,ih as pn,j as M,k as b,kh as fn,lh as mn,mh as gn,nh as wn,oh as vn,ph as yn,qh as bn,yg as D,zh as Sn}from"./chunk-CQXHQEN6.js";import{a as v}from"./chunk-LO2NM3CE.js";function Ct(t,n){return t!=null&&Object.hasOwn(t,n)?t[n]:void 0}function Cs(t,n,e){return be.filter(i=>{let s=Ct(t,i),o=Ct(n,i),r=Ct(e,i),a=d=>t==null||!T(d,s);return a(o)&&a(r)&&!T(o,r)})}function Ds(t,n,e){return ri(t,n,e)}var Es=100,Vo=3,Dt=class{constructor(n,e){this._undo=[];this._redo=[];this._replaced=[];this._base=n,this._revision=e,this._document=n}get base(){return this._base}get revision(){return this._revision}get document(){return this._document}get canUndo(){return this._undo.length>0}get canRedo(){return this._redo.length>0}get replaced(){return this._replaced}get dirty(){let n=this._dirty;if(n!==void 0&&n.document===this._document&&n.base===this._base)return n.value;let e=this._document!==this._base&&!T(this._document,this._base);return this._dirty={document:this._document,base:this._base,value:e},e}apply(n,e){if(n===this._document||T(n,this._document))return(e===void 0||e!==this._coalesceKey)&&(this._coalesceKey=void 0),!1;if(e!==void 0&&e===this._coalesceKey&&this._undo.length>0){let i=this._undo[this._undo.length-1];return T(n,i)?(this._undo.pop(),this._document=i,this._coalesceKey=void 0):this._document=n,this._redo=[],!0}return this.pushUndo(this._document),this._redo=[],this._document=n,this._coalesceKey=e,!0}amend(n){return this._coalesceKey=void 0,n===this._document||T(n,this._document)?!1:(this._document=n,!0)}endCoalesce(){this._coalesceKey=void 0}undo(){this._coalesceKey=void 0;let n=this._undo.pop();return n===void 0?!1:(this._redo.push(this._document),this._document=n,!0)}redo(){this._coalesceKey=void 0;let n=this._redo.pop();return n===void 0?!1:(this.pushUndo(this._document),this._document=n,!0)}discard(){return this._coalesceKey=void 0,this.apply(this._base)}rebase(n,e){return e<this._revision?(this._replaced=[],!1):this.mergeOnto(n,e)}restart(n,e){return this.mergeOnto(n,e)}mergeOnto(n,e){this._coalesceKey=void 0;let i=this._base;this._replaced=this._document===i?[]:Cs(i,this._document,n);let s=new Map,o=h=>{let f=s.get(h);if(f!==void 0)return f;let y=h===i?n:Ds(i,h,n);return y!==n&&T(y,n)&&(y=n),s.set(h,y),y},r=this._document,a=[...this._undo,this._document,...this._redo.slice().reverse()].map(o),d=this._undo.length,u=[],l=0;return a.forEach((h,f)=>{let y=u[u.length-1];y!==void 0&&(y===h||T(y,h))?f===d&&(u[u.length-1]=h):u.push(h),f===d&&(l=u.length-1)}),this._undo=u.slice(0,l),this._document=u[l],this._redo=u.slice(l+1).reverse(),this._base=n,this._revision=e,this._document!==r&&!T(this._document,r)}saved(n,e){e<this._revision||(this._coalesceKey=void 0,this._base=n,this._revision=e)}get saving(){return ue.has(this)}get saveDone(){return ue.get(this)}pushUndo(n){this._undo.push(n),this._undo.length>Es&&this._undo.splice(0,this._undo.length-Es)}},ue=new WeakMap;function Hs(t,n){if(ue.has(t))return Promise.resolve({ok:!1,revision:t.revision,merged:!1,code:"busy",message:"These menus are being saved already."});let e=Uo(t,n).finally(()=>ue.delete(t));return ue.set(t,e),e}async function Uo(t,n){let e=!1,i=new Set,s=()=>{let r=be.filter(a=>i.has(a));return r.length===0?{}:{replaced:r}},o=(r,a,d)=>({ok:!1,revision:t.revision,merged:e,code:r,message:a,...d===void 0?{}:{problems:d}});for(let r=1;;r++){let a=n.prepare?.(t.document);a!==void 0&&a!==t.document&&t.amend(a);let d=t.document,u=Vi(d);if(u.length>0)return o("invalid",u.join(" "),u);let l;try{({revision:l}=await n.save(t.revision,d))}catch(h){let{code:f="unknown",message:y}=L(h);if(f!=="conflict"||r>=Vo)return o(f,y);let m;try{m=await n.fetch()}catch(w){let k=L(w);return o(k.code??"unknown",k.message)}if(!E(m)||!(m.revision>0)||!E(m.document))return o("no_record","Home Assistant holds no menus for this watch.");m.revision<t.revision?t.restart(m.document,m.revision):t.rebase(m.document,m.revision);for(let w of t.replaced)i.add(w);if(e=!0,!t.dirty)return{ok:!0,revision:t.revision,merged:e,alreadySaved:!0};continue}return t.saved(d,l),{ok:!0,revision:t.revision,merged:e,...s()}}}async function Os(t){try{let{revision:n}=await t(0,li());return{ok:!0,revision:n}}catch(n){let{code:e,message:i}=L(n);return e==="no_record"||e==="conflict"?{ok:!1,code:e,message:i}:e==="unknown_command"?{ok:!1,code:"unsupported",message:i}:{ok:!1,code:"error",message:i}}}var ee=new Map;function J(t){return ee.get(t)}function Is(t,n,e){let i=ee.get(t);if(i!==void 0&&e<=0)return{draft:i,mergedIntoEdits:!1,replaced:[]};if(i===void 0||e<i.revision&&!i.dirty){let r=new Dt(n,e);return ee.set(t,r),{draft:r,mergedIntoEdits:!1,replaced:[]}}if(e===i.revision)return{draft:i,mergedIntoEdits:!1,replaced:[]};let s=i.dirty,o=e<i.revision?i.restart(n,e):i.rebase(n,e);return{draft:i,mergedIntoEdits:s&&o,replaced:s?i.replaced:[]}}function _e(t){ee.delete(t)}function As(){for(let t of ee.values())if(t.dirty)return!0;return!1}function Ws(){ee.clear()}var Ot="In the page switcher",qo=["switcherIcon","switcherColor","switcherText","switcherDisplayMode","hideFromSwitcher"],It="switcher-settings",Ls=`${It}:resetDot`;function Ns(t){return ts(t,qo,n=>{let e=Te(n);return[e.switcherIcon,e.switcherColor,e.switcherText,e.switcherDisplayMode??"text",e.hideFromSwitcher]})}function Vs(t){let n=Te(t);return n.hideFromSwitcher?"Hidden":n.switcherText??(n.switcherDisplayMode==="icon"?"Icon":"Shown")}function At(t,n){return`${It}:typed:${t.pageId.toUpperCase()}:${n}`}function Et(t,n){let e=t.uiState.get(At(t,n));return typeof e=="string"?e:void 0}function jo(){if(typeof document>"u")return null;let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t}function Fo(t){let n=jo(),e=typeof HTMLElement<"u"&&n instanceof HTMLElement?n.closest("[data-sw-field]")?.dataset.swField:void 0;for(let i of[...t.uiState.keys()])i.startsWith(`${It}:typed:`)&&(e===void 0||i!==At(t,e))&&t.uiState.delete(i)}function te(t,n,e=!1){let i=t.uiState.delete(Ls);t.busy||t.edit(n,e&&!i?{typing:!0}:void 0)}function Ht(t,n,e){let i=At(t,n),s=a=>typeof HTMLInputElement<"u"&&a instanceof HTMLInputElement&&a.type==="text"&&!a.closest(".alpha");return c`<div class="ts-typing" data-sw-field=${n}
    @input=${{capture:!0,handleEvent:a=>{s(a.target)&&t.uiState.set(i,a.target.value)}}}
    @click=${{capture:!0,handleEvent:a=>{!(a.target instanceof Element)||a.target.closest(".reset-dot")===null||(t.endCoalesce(),t.uiState.set(Ls,!0))}}}
    @change=${a=>{let d=a.target;typeof HTMLInputElement>"u"||!(d instanceof HTMLInputElement)||(d.type==="color"&&t.endCoalesce(),d.type==="checkbox"&&(t.uiState.delete(i),t.endCoalesce(),t.requestUpdate()))}}
    @focusout=${a=>{!s(a.target)||a.relatedTarget instanceof Node&&a.currentTarget.contains(a.relatedTarget)||(t.uiState.delete(i),t.endCoalesce(),t.requestUpdate())}}>${e}</div>`}function Us(t){Fo(t);let n=t.page,e=Te(n),i=e.switcherDisplayMode??"text",s=Zi.map(d=>[d,d==="icon"?"Icon":"Name"]),o=typeof n.name=="string"?n.name:"",r=d=>te(t,u=>kt(u,t.pageId,d),!0),a=d=>te(t,u=>Gi(u,t.pageId,d),!0);return c`
    ${_("Hidden",e.hideFromSwitcher,d=>te(t,u=>es(u,t.pageId,d)),!1)}
    ${e.hideFromSwitcher?c`<div class="hint ts-under">The page stays on the watch. Only the switcher leaves it out.</div>`:p}
    ${F("Show as",s.some(([d])=>d===i)?i:"text",s,d=>te(t,u=>Qi(u,t.pageId,d)))}
    ${Ht(t,"switcherText",Nn("Name",Et(t,"switcherText")??e.switcherText??"",d=>te(t,u=>Xi(u,t.pageId,d),!0),{placeholder:o}))}
    <div class="ts-chips" role="group" aria-label="Switcher icon">
      <button type="button" class="pe-chip ${e.switcherIcon===void 0?"on":""}" aria-pressed=${e.switcherIcon===void 0?"true":"false"}
        title="The watch picks one from the page's first tile" @click=${()=>te(t,d=>kt(d,t.pageId,""))}>Automatic icon</button>
    </div>
    ${Ht(t,"switcherIcon",ve({icons:t.icons,symbols:t.symbols},Et(t,"switcherIcon")??e.switcherIcon??"",r,"sw:switcher-icon",void 0,"Icon",!1))}
    ${Ht(t,"switcherColor",c`<div class="ts-no-alpha">${ae("Color",Et(t,"switcherColor")??e.switcherColor,a,!0,null,{switchOn:e.switcherColor!==void 0})}</div>`)}
    <div class="hint ts-under">Left empty, the watch shows the page's name and picks the icon and color itself.</div>`}var N=Pe.routing;function Wt(t){return N.actions.find(n=>n.action===t)}function V(t){return Wt(t)?.keys??[]}function O(t){return Object.hasOwn(N.keys,t)?N.keys[t]:void 0}function ie(t){return E(t.voiceConfig)?t.voiceConfig:{}}function Ko(t,n){let e=N.legacy[`${t}.${n}`];return e===void 0?n:/reads as (\w+)/.exec(e)?.[1]??n}function U(t,n){let e=O(n);if(e===void 0)return;let i=Object.hasOwn(t,n)?t[n]:void 0;switch(e.type){case"enum":{let s=N.enums[e.enum??""]??[];return typeof i=="string"&&s.includes(i)?Ko(n,i):e.default}case"bool":return typeof i=="boolean"?i:e.default;case"int":{if(typeof i!="number"||!Number.isFinite(i))return e.default;let[s,o]=e.clamp??[-1/0,1/0];return Math.min(o,Math.max(s,Math.round(i)))}case"entity":return typeof i=="string"?i.trim():e.default;case"array":return Array.isArray(i)?i.filter(s=>typeof s=="string"):e.default}}function js(t,n){let e=O(n)?.shownWhen;if(e===void 0)return!0;let i=/^(\w+) is (not )?(.+)$/.exec(e.trim());if(i===null)return!0;let s=U(t,i[1]),o=i[3].split(/\s+or\s+/).map(a=>a.trim()),r=typeof s=="string"&&o.includes(s);return i[2]===void 0?r:!r}function Ce(t,n){let e=O(n);if(e?.type!=="enum")return[];let i=N.labels[e.enum??""]??{},s=N.offered[n]??N.enums[e.enum??""]??[],o=U(t,n);return(typeof o=="string"&&!s.includes(o)?[o,...s]:s).map(a=>[a,i[a]??a])}function Fs(t){return O(t)?.label??Bo[t]??t}var Bo={assistAutoSendOnPause:"Send When I Pause",broadcastImmediateListen:"Start Listening Immediately"};function Lt(t,n,e){let i=O(n);if(i===void 0)return t;let s;switch(i.type){case"enum":if(typeof e!="string"||!Ce(t,n).some(([r])=>r===e))return t;s=e;break;case"bool":if(typeof e!="boolean")return t;s=e;break;case"int":{if(typeof e!="number"||!Number.isFinite(e))return t;let[r,a]=i.clamp??[-1/0,1/0];s=Math.min(a,Math.max(r,Math.round(e)));break}case"entity":{if(e!==void 0&&typeof e!="string")return t;let r=(e??"").trim();if(r==="")return _t(t,n);s=r;break}case"array":{if(!Array.isArray(e)||!e.every(a=>typeof a=="string"))return t;let r=[...new Set(e.map(a=>a.trim()).filter(a=>a!==""))];if(r.length===0)return _t(t,n);s=r;break}}return(Object.hasOwn(t,n)?T(t[n],s):T(U(t,n),s))?t:Re(t,n,s)}function Ks(t,n,e,i){let s=U(t,n),o=Array.isArray(s)?s:[];return i===o.includes(e)?t:Lt(t,n,i?[...o,e]:o.filter(r=>r!==e))}function zo(t,n){switch(t.fallsBackTo){case"defaultAssistAgentId":return n?.agent;case"defaultTTSEngine":return n?.engine;case"defaultSpeakers":return n?.speakers;default:return}}function Jo(t,n){let e=O(n);if(e?.fallsBackTo===void 0)return!1;let i=e.fallsBackWhen;if(i===void 0)return!0;let s=n.startsWith("assist")?"assistReplyOutputMode":n.startsWith("speakMessage")?"speakMessageOutputMode":"broadcastTargetMode",o=U(t,s);return typeof o=="string"&&i.includes(o)}function Nt(t,n,e,i){let s=O(n);if(s===void 0)return"None";if(!Jo(t,n))return s.type==="array"?"None":"Not set";if(e===void 0)return"Default";let o=zo(s,e);return typeof o=="string"&&o.trim()!==""?`Default (${i(o.trim())})`:Array.isArray(o)&&o.length>0?`Default (${o.map(i).join(", ")})`:s.fallsBackTo==="defaultAssistAgentId"?"Default (Home Assistant default)":"Default (Not set)"}function qs(t){return Array.isArray(t)?t.filter(n=>typeof n=="string"):[]}function ne(t,n){let e=n.toUpperCase();return t.some(i=>i.toUpperCase()===e)}function De(t,n,e){let i=qs(n),s=qs(e);return t.filter(o=>!ne(i,o)&&(s.length===0||ne(s,o)))}function Yo(t,n){return{hiddenPhraseIds:t.filter(e=>!ne(n,e)),knownPhraseIds:t.slice()}}function Bs(t,n,e,i){if(!ne(n,e))return t;let s=De(n,t.hiddenPhraseIds,t.knownPhraseIds);if(ne(s,e)===i)return t;let o=i?n.filter(a=>ne(s,a)||a.toUpperCase()===e.toUpperCase()):s.filter(a=>a.toUpperCase()!==e.toUpperCase()),r=Yo(n,o);return Re(Re(t,"hiddenPhraseIds",r.hiddenPhraseIds),"knownPhraseIds",r.knownPhraseIds)}function zs(t){if(t!==void 0)return{agent:t.defaultAssistAgentId,engine:t.defaultTTSEngine,speakers:t.defaultSpeakers??[]}}function Zo(t,n,e,i,s){return xe(t,n,e,o=>{if(!V($(o)).includes(i))return o;let r=ie(o),a=Lt(r,i,s);return a===r?o:rt(o,"voiceConfig",a)})}function Go(t,n,e,i,s,o){return xe(t,n,e,r=>{if(!V($(r)).includes(i))return r;let a=ie(r),d=Ks(a,i,s,o);return d===a?r:rt(r,"voiceConfig",d)})}function Xo(t,n,e,i,s,o){return xe(t,n,e,r=>$(r)==="ttsMenu"?Bs(r,i,s,o):r)}function Js(t){return Object.keys(ie(t)).some(n=>V($(t)).includes(n))}function Ys(t){let n=$(t);return V(n).length>0||n==="ttsMenu"}function Zs(t,n){let e=t.states[n]?.attributes?.friendly_name;return typeof e=="string"&&e.trim()!==""?e:n}function Qo(t,n,e,i){let s=Yi(t.hass.states),o=$t(s,e),r=a=>_(a.missing?`${a.entityId} (not found)`:a.name,e.includes(a.entityId),d=>i(a.entityId,d));return c`<div class="me-sub-h">${n}</div>
    <div class="me-voice-list" role="group" aria-label=${n}>
      ${o.length===0?c`<div class="hint">No media players in Home Assistant.</div>`:o.map(r)}
    </div>`}function er(t,n,e,i){let s=O(e),o=zs(t.voice?.defaults),r=s?.domain==="conversation"?zi(t.hass.states):Ji(t.hass.states,Object.keys(t.hass.services?.tts??{}),void 0),a=$t(r,i===""?[]:[i]);return[["",Nt(n,e,o,u=>a.find(l=>l.entityId===u&&!l.missing)?.name??Zs(t.hass,u))],...a.map(u=>[u.entityId,u.missing?`${u.entityId} (not found)`:u.name])]}function tr(t,n,e,i,s){let o=O(s);if(o===void 0||!js(i,s))return p;let r=Fs(s),a=U(i,s),d=(u,l)=>t.edit(h=>Zo(h,n,e,s,u),l);switch(o.type){case"enum":return I(r,String(a),Ce(i,s),u=>d(u),{snapBack:!0,def:String(o.default)});case"bool":return _(r,a===!0,u=>d(u),o.default);case"int":{let u=typeof a=="number"?a:Number(o.default),l=Pe.volume,[h,f]=o.clamp??[l.min,l.max];return c`${we(r,u,y=>d(y,`slot:${e}:${s}`),{min:h,max:f,step:l.step,def:Number(o.default),format:y=>`${Math.round(y)}${l.unit}`})}
        <div class="ts-after">${l.presets.map(y=>c`<button type="button" class="pe-chip ${y.value===u?"on":""}"
          aria-pressed=${y.value===u?"true":"false"} @click=${()=>d(y.value)}>${y.label} ${y.value}%</button>`)}</div>`}case"entity":{let u=typeof a=="string"?a:"";return I(r,u,er(t,i,s,u),l=>d(l===""?void 0:l),{snapBack:!0})}case"array":{let u=Array.isArray(a)?a:[],l=zs(t.voice?.defaults),h=o.whenBlank!==void 0?`None picked: ${o.whenBlank}.`:o.fallsBackTo!==void 0?`None picked: ${Nt(i,s,l,f=>Zs(t.hass,f))}.`:"None picked.";return c`${Qo(t,r,u,(f,y)=>t.edit(m=>Go(m,n,e,s,f,y)))}
        <div class="hint ${u.length===0&&o.fallsBackTo===void 0&&o.whenBlank===void 0?"warn":""}">${u.length===0?h:`${u.length} picked.`}</div>`}}}function nr(t,n,e){let i=typeof e.id=="string"?e.id:"",s=ie(e),o=V($(e));return c`${t.voice?.defaults===void 0?c`<div class="hint">${ys}.</div>`:p}
    ${o.map(r=>tr(t,n,i,s,r))}`}function ir(t,n,e){let i=typeof e.id=="string"?e.id:"",s=t.voice?.phrases;if(s===void 0)return c`<div class="hint">No voice settings from this watch yet. Start them in Voice to pick the phrases this slot shows.</div>`;if(s.length===0)return c`<div class="hint">No phrases yet. Add them in Voice.</div>`;let o=s.map(l=>l.id),r=De(o,e.hiddenPhraseIds,e.knownPhraseIds),a=Array.isArray(e.knownPhraseIds)?e.knownPhraseIds.filter(l=>typeof l=="string"):[],d=a.length>0&&o.some(l=>!a.some(h=>h.toUpperCase()===l.toUpperCase())),u=l=>r.some(h=>h.toUpperCase()===l.toUpperCase());return c`<div class="me-sub-h">${Wt("ttsMenu")?.slotLabel??"Phrase List"}</div>
    <div class="me-voice-list" role="group" aria-label="Phrases this slot shows">
      ${s.map(l=>_(l.name,u(l.id),h=>t.edit(f=>Xo(f,n,i,o,l.id,h))))}
    </div>
    <div class="hint">${r.length===0?"No phrase shows: the list on the watch is empty.":`${r.length} of ${s.length} show on the watch.`}</div>
    ${d?c`<div class="hint">A phrase added after this slot's list was set stays hidden here until it is ticked.</div>`:p}`}function Gs(t,n,e){let i=$(e);if(i==="ttsMenu")return ir(t,n,e);if(V(i).length>0)return nr(t,n,e)}function Xs(t,n){let e=$(n);if(e==="ttsMenu"){let r=t.voice?.phrases;return r===void 0?"":`${De(r.map(d=>d.id),n.hiddenPhraseIds,n.knownPhraseIds).length} of ${r.length} phrases`}let i=ie(n),s=V(e)[0];if(s===void 0)return"";let o=U(i,s);return Ce(i,s).find(([r])=>r===o)?.[1]??""}var io=[["anywhere","Anywhere menu"],["entity","Entity quick menu"],["switcher","Page switcher"]],so="Each page's icon, color and name are set here: pick a page in the Pages card.",sr="Pick a page in the Pages card to set how it shows here.",oo={anywhere:"Opens on any screen. Each place around the ring holds one slot.",entity:"Opens over a tile. Each type of entity has its own menu, and an entity can have a menu of its own.",switcher:so},or="The Anywhere menu, the Entity quick menu and the page switcher. A save reaches the watch the next time it checks.",rr="Tap a slot on the watch or in the list to edit it.",Oe=.36,Ie=44,Ae=22;function ar(t,n){let e=Math.min(t.width,t.height),i=s=>Math.round(s*1e4)/1e4;return{x:i(.5+(n.x-.5)*e/t.width),y:i(.5+(n.y-.5)*e/t.height)}}function ro(t,n,e=Oe){let i=(270-t*360/Math.max(1,n))*Math.PI/180,s=o=>Math.round(o*1e4)/1e4;return{x:s(.5+e*Math.cos(i)),y:s(.5+e*Math.sin(i))}}var ao="wrist-assistant-panel.menus.zoom.v1";function co(t=je()){try{let n=t?.getItem(ao);if(n==null||n==="")return;let e=Number(n);return ii.includes(e)?e:void 0}catch{return}}function uo(t,n=je()){try{n?.setItem(ao,t===void 0?"":String(t))}catch{}}var lo={name:{color:W.place,icon:"text"},slot:{color:W.content,icon:"content"},look:{color:W.look,icon:"look"},menu:{color:W.content,icon:"content"},style:{color:W.look,icon:"look"},switcherPage:{color:W.content,icon:"watch"}},cr="#26a69a",dr=W.complication,q="menu-editor";function oe(t,n,e){return`${t} ${t===1?n:e}`}function j(t,n){let e=t.states[n]?.attributes?.friendly_name;return typeof e=="string"&&e.trim()!==""?e:n}function ho(t,n){return{entityId:n,displayName:n===""?"":j(t,n),domain:Se(n)}}function Ee(t,n,e,i){return t.icons.render(n,e,i)??c`<span class="me-glyph-dot" style=${`background:${i}`}></span>`}function Z(t){return K($(t))===void 0?{icon:it.unknownActionIcon,color:it.unknownActionColor}:{icon:typeof t.icon=="string"&&t.icon!==""?t.icon:"circle",color:typeof t.color=="string"?t.color:"#FFFFFF"}}function po(t){let n=$(t);if(n==="triggerEntity"){let i=ce(t).entityId;return gi(Se(typeof i=="string"?i:""))}let e=K(n);return e===void 0?void 0:{icon:e.icon,color:e.color}}function x(t,n){return t.toUpperCase()===n.toUpperCase()}function ur(t,n){return t.toUpperCase()===n.toUpperCase()}function lr(t,n){let e=$(n),i=ce(n),s=K(e);for(let o of s?.payload??[]){let r=i[o.key];if(!(typeof r!="string"||r==="")){if(o.type==="entity")return j(t.hass,r);if(o.target==="page")return t.targets.pages.find(a=>x(a.id,r))?.name??"A page not in the pages";if(o.target==="statusPage")return t.targets.statusPages.find(a=>x(a.id,r))?.name??"A status page";if(o.target==="httpAction")return t.targets.httpActions.find(a=>x(a.id,r))?.name??"An HTTP action";if(o.target==="ttsPhrase"){let a=t.targets.phrases;return a?.find(d=>x(d.id,r))?.name??(a===void 0?"A phrase":"A phrase that is gone")}}}}function jt(t,n){return lr(t,n)??B($(n))}function fo(t){return`${z(typeof t.position=="string"?t.position:"")} \xB7 ${B($(t))}`}function hr(t){let n=Me(),e=i=>{let s=n.indexOf(typeof i.position=="string"?i.position:"");return s<0?n.length:s};return t.slice().sort((i,s)=>e(i)-e(s))}function Y(t){return $e(t)?.label??t}var mo="me:menu",go="me:er:mode",wo="me:er:domain",Ut="me:er:entity",Vt="me:er:add";function C(t){let n=t.uiState.get(mo);return n==="entity"||n==="switcher"?n:"anywhere"}function pr(t,n){n!==C(t)&&t.uiState.delete(He),t.uiState.set(mo,n),t.requestUpdate()}var He="me:sw:page";function vo(t){return t.switcherRows??t.switcherPages.map(n=>({...n,hidden:!1}))}function G(t){if(C(t)!=="switcher")return;let n=t.uiState.get(He);if(typeof n=="string")return vo(t).find(e=>x(e.id,n))}function Ft(t,n){n===void 0?t.uiState.delete(He):t.uiState.set(He,n),t.requestUpdate()}function yo(t){let n=G(t);return n===void 0?void 0:t.switcherSettings?.(n.id)}function Kt(t){return io.find(([n])=>n===t)?.[1]??t}function Bt(t){return t.uiState.get(go)==="entity"?"entity":"domain"}function zt(t){let n=t.uiState.get(wo);return typeof n=="string"&&$e(n)!==void 0?n:"light"}function Jt(t){let n=de(t.document),e=t.uiState.get(Ut);return typeof e=="string"&&n.includes(e)?e:n[0]}function X(t){switch(C(t)){case"anywhere":return ke;case"entity":return bo(t);case"switcher":return}}function bo(t){if(Bt(t)==="domain")return{list:"domain",domain:zt(t)};let n=Jt(t);return n===void 0?void 0:{list:"entity",entityId:n}}function fr(t,n){return n.list==="anywhere"?"Anywhere menu":n.list==="domain"?`${Y(n.domain)} menu`:`${j(t.hass,n.entityId)} menu`}function So(t){return`me:sel:${bi(t)}`}function le(t,n){let e=t.uiState.get(So(n));if(typeof e=="string")return H(t.document,n).find(i=>x(P(i),e))}function he(t,n,e){t.uiState.set(So(n),e),t.requestUpdate()}function Yt(t){if(G(t)!==void 0)return Ft(t,void 0),!0;let n=X(t);return n===void 0||le(t,n)===void 0?!1:(he(t,n,void 0),!0)}function $o(t,n,e){let i;t.edit(s=>{let o=Mi(s,n,{...e===void 0?{}:{position:e},targets:t.targets});return i=o.id,o.document}),i!==void 0&&he(t,n,i)}function Qs(t){let e=(i,s)=>Math.round((s+(i-.5)/Oe*8)*100)/100;return c`<span class="thumb me-ring-thumb" aria-hidden="true"><svg viewBox=${`0 0 ${Ie} ${Ae}`}>
    <circle cx="22" cy="11" r=${8} class="me-thumb-track"></circle>
    ${t.map(i=>sn`<circle cx=${e(i.x,22)} cy=${e(i.y,11)} r="2.2" fill=${i.color}></circle>`)}
  </svg></span>`}function mr(t,n){return n===void 0?[]:H(t.document,n).flatMap(e=>{if(e.isVisible===!1)return[];let i=ct(typeof e.position=="string"?e.position:"");return i===void 0?[]:[{...i,color:Z(e).color}]})}function gr(t,n){if(n==="anywhere")return oe(H(t.document,ke).length,"slot","slots");if(n==="switcher")return oe(t.switcherPages.length,"page","pages");if(Bt(t)==="domain")return`By type \xB7 ${Y(zt(t))}`;let e=Jt(t);return`By entity \xB7 ${e===void 0?"none yet":j(t.hass,e)}`}function wr(t,n){if(n==="switcher"){let e=t.switcherPages;return Qs(e.map((i,s)=>({...ro(s,e.length),color:i.color})))}return Qs(mr(t,n==="anywhere"?ke:bo(t)))}function ko(t){let n=C(t);return c`<section class="card lc me-menus-card" aria-label="Menus"
    style=${`--c: var(--wa-lc-pages, #26a69a); --thumb-w: ${Ie}px; --thumb-h: ${Ae}px`}>
    <div class="lc-head">
      <span class="swatch">${S("radial")}</span><span class="lc-title">Menus</span>
      <span class="lc-sub" title=${or}>on the watch</span>
    </div>
    <div class="layers me-menu-list" role="list">
      ${io.map(([e,i])=>{let s=e===n,o=()=>{s||pr(t,e)};return c`<div class="layer me-menu-row ${s?"hl":""}" data-menu=${e} role="listitem" tabindex="0"
          aria-current=${s?"true":"false"} aria-label=${i} title=${oo[e]}
          @click=${o}
          @keydown=${r=>{r.target!==r.currentTarget||r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),o())}}>
          <span class="grip" aria-hidden="true"></span>
          ${wr(t,e)}
          <span class="name"><b><span class="nm-t">${i}</span></b><small>${gr(t,e)}</small></span>
          <span class="right"></span>
        </div>`})}
    </div>
  </section>`}function xo(t,n,e){return c`<span class="thumb me-thumb" style=${`--c:${e}`} aria-hidden="true"><span class="me-thumb-glyph">${Ee(t,n,14,e)}</span></span>`}function vr(t,n,e,i){let s=P(e),o=Z(e),r=i!==void 0&&x(s,P(i)),a=e.isVisible===!1,d=jt(t,e),u=fo(e),l=()=>he(t,n,s);return c`<div class="layer me-slot-row ${r?"hl":""} ${a?"dim":""}" data-slot=${s} style=${`--k:${o.color}`}
    role="listitem" tabindex="0" aria-current=${r?"true":"false"} aria-label=${d}
    title=${`${d} \xB7 ${u}${a?", hidden":""}`}
    @click=${h=>{h.target instanceof Element&&h.target.closest("button")||l()}}
    @keydown=${h=>{h.target!==h.currentTarget||h.key!=="Enter"&&h.key!==" "||(h.preventDefault(),l())}}>
    <span class="grip" aria-hidden="true"></span>
    ${xo(t,o.icon,o.color)}
    <span class="name"><b><span class="nm-t">${d}</span></b><small>${u}</small></span>
    <span class="right">
      <span class="badges">${a?c`<span class="badge">hidden</span>`:p}</span>
      <span class="acts">
        <button type="button" class="icon danger" ?disabled=${t.busy} title="Remove" aria-label=${`Remove ${d}`}
          @click=${()=>t.edit(h=>ut(h,n,s))}>${S("delete")}</button>
      </span>
    </span>
  </div>`}function yr(t,n,e){let i=n===void 0||n.list==="anywhere"?"By entity: none has a menu of its own yet.":n.list==="domain"?`${Y(n.domain)} menu, by type`:`${j(t.hass,n.entityId)}'s own menu`;return c`<div class="lc-filter me-filter"><span class="lc-sub">${i}</span>
    ${e===void 0?p:c`<button type="button" class="lc-ghost sm" title="Pick the type or the entity in the menu's settings"
      @click=${()=>Yt(t)}>Change</button>`}
  </div>`}function br(t){return t.hidden?"Not in the switcher":t.text===void 0?"Shown as its icon":t.text===t.name?"Shown by name":`Shown as ${t.text}`}function Sr(t,n,e){let i=e!==void 0&&x(e.id,n.id),s=br(n),o=()=>Ft(t,n.id);return c`<div class="layer me-page-row ${i?"hl":""} ${n.hidden?"dim":""}" data-page=${n.id} style=${`--k:${n.color}`}
    role="listitem" tabindex="0" aria-current=${i?"true":"false"} aria-label=${n.name}
    title=${`${n.name} \xB7 ${s}`}
    @click=${r=>{r.target instanceof Element&&r.target.closest("button")||o()}}
    @keydown=${r=>{r.target!==r.currentTarget||r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),o())}}>
    <span class="grip" aria-hidden="true"></span>
    ${xo(t,n.icon,n.color)}
    <span class="name"><b><span class="nm-t">${n.name}</span></b><small>${s}</small></span>
    <span class="right"><span class="badges">${n.hidden?c`<span class="badge">hidden</span>`:p}</span></span>
  </div>`}function $r(t){let n=vo(t),e=G(t),i=n.filter(s=>s.hidden).length;return c`<section class="card lc me-slots-card" aria-label="Pages"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${Ie}px; --thumb-h: ${Ae}px`}>
    <div class="lc-head">
      <span class="swatch">${S("pages")}</span><span class="lc-title">Pages</span>
      <span class="lc-sub">${oe(n.length,"page","pages")}${i===0?"":`, ${i} hidden`}</span>
    </div>
    ${n.length===0?c`<div class="lc-note">No page shows in the switcher.</div>`:c`<div class="layers me-page-list" role="list">${n.map(s=>Sr(t,s,e))}</div>`}
  </section>`}function Mo(t){let n=C(t);if(n==="switcher")return $r(t);let e=X(t),i=e===void 0?[]:hr(H(t.document,e)),s=e===void 0?void 0:le(t,e),o=e===void 0?[]:dt(t.document,e),r=e===void 0?"Add an entity first, in the menu's settings.":o.length===0?"Every place around the ring is taken.":"Add a slot at the first free place",a;return e===void 0?a=c`<div class="lc-note">Add an entity to edit its menu.</div>`:i.length===0?a=c`<div class="lc-note">No slots yet.</div>`:a=c`<div class="layers me-slot-list" role="list">${i.map(d=>vr(t,e,d,s))}</div>`,c`<section class="card lc me-slots-card" aria-label="Slots"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${Ie}px; --thumb-h: ${Ae}px`}>
    <div class="lc-head">
      <span class="swatch">${S("layers")}</span><span class="lc-title">Slots</span>
      ${e===void 0?p:c`<span class="lc-sub">${oe(i.length,"slot","slots")}</span>`}
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri me-add-slot" aria-label="Add slot" ?disabled=${t.busy||e===void 0||o.length===0}
        title=${r} @click=${()=>{e!==void 0&&$o(t,e)}}>${S("plus")}<span>Add</span></button>
    </div>
    ${n==="entity"?yr(t,e,s):p}
    ${a}
  </section>`}function To(t,n){let e=ar(t,n);return`left:${e.x*100}%;top:${e.y*100}%`}function eo(t,n,e){let i=ct(n,e??Oe);return i===void 0?void 0:To(t,i)}function Zt(t,n,e){let{width:i,height:s}=t.screen,o=t.scale,r=Math.min(i,s),a=c`<div class="me-screen" role="group" aria-label=${n}
    style=${`width:${Math.round(i*o)}px;height:${Math.round(s*o)}px;--me-s:${o}`}>
    <svg class="me-screen-bg" viewBox=${`0 0 ${i} ${s}`} aria-hidden="true">
      <circle cx=${i/2} cy=${s/2} r=${r*Oe} class="me-track"></circle>
      <circle cx=${i/2} cy=${s/2} r=${r*.05} class="me-center"></circle>
    </svg>
    ${e}
  </div>`;return ls(t.phone,{width:i,height:s},o,a,n,t.icons)}function qt(t,n){return Math.round(n*t.scale)}function kr(t,n,e,i){let s=t.screen,o=H(t.document,n),r=$i(t.document,n),a=new Set(dt(t.document,n)),d=e===void 0?void 0:P(e),u=(l,h,f,y,m)=>{let w=Z(l),k=P(l),A=d!==void 0&&x(k,d),re=`${z(h)}: ${B($(l))}${l.isVisible===!1?", hidden":""}`;return c`<button type="button" class="me-dot ${y} ${A?"on":""} ${l.isVisible===!1?"off":""}" style=${`${f};--c:${w.color}`}
      title=${re} aria-label=${re} aria-pressed=${A?"true":"false"} @click=${()=>he(t,n,k)}>
      ${Ee(t,w.icon,qt(t,y===""?15:11),w.color)}${m>1?c`<span class="me-count" aria-hidden="true">${m}</span>`:p}</button>`};return Zt(t,`${i} on the watch`,Me().map(l=>{let h=eo(s,l);if(h===void 0)return p;let f=o.filter(R=>R.position===l),y=f.find(R=>R.isVisible!==!1),m=y===void 0?r.find(R=>R.position===l&&R.isVisible!==!1):void 0,w=y??(m===void 0?f[0]:void 0),k=f.find(R=>R!==w),A;if(w!==void 0)A=u(w,l,h,"",f.length);else if(m!==void 0){let R=Z(m);A=c`<span class="me-dot inh" style=${`${h};--c:${R.color}`} title=${`${z(l)}: ${B($(m))}, from All`}>
          ${Ee(t,R.icon,qt(t,13),R.color)}</span>`}else a.has(l)?A=c`<button type="button" class="me-dot free" style=${h} ?disabled=${t.busy}
          title=${`Add a slot at ${z(l)}`} aria-label=${`Add a slot at ${z(l)}`}
          @click=${()=>$o(t,n,l)}>${S("plus")}</button>`:A=p;let re=k===void 0?void 0:eo(s,l,.2);return c`${A}${k===void 0||re===void 0?p:u(k,l,re,"two",0)}`}))}function xr(t){let n=t.switcherPages,e=t.screen,i=G(t),s=n.length===0?c`<p class="me-screen-note">No pages in the switcher yet.</p>`:n.map((o,r)=>{let a=`${To(e,ro(r,n.length))};--c:${o.color}`,d=i!==void 0&&x(i.id,o.id)?"on":"";return o.text===void 0?c`<span class="me-dot me-page-dot ${d}" style=${a} title=${o.name}>${Ee(t,o.icon,qt(t,14),o.color)}</span>`:c`<span class="me-page ${d}" style=${a} title=${o.name}>${o.text}</span>`});return Zt(t,"Page switcher on the watch",s)}function Po(t){if(C(t)==="switcher")return xr(t);let n=X(t);return n===void 0?Zt(t,"Entity quick menu on the watch",c`<p class="me-screen-note">Add an entity to edit its menu.</p>`):kr(t,n,le(t,n),fr(t,n))}function Ro(t){if(C(t)==="switcher")return[oe(t.switcherPages.length,"page","pages")];let n=X(t);if(n===void 0)return["No entity yet"];let e=oe(H(t.document,n).length,"slot","slots");return n.list==="anywhere"?[e]:[n.list==="domain"?Y(n.domain):j(t.hass,n.entityId),e]}function _o(t){return C(t)==="switcher"?so:X(t)===void 0?"Add an entity in the menu's settings to give it a menu of its own.":rr}function Co(t,n){return ai(t.uiState,q,n)}function Mr(t,n){ci(t.uiState,q,n,!Co(t,n)),t.requestUpdate()}function Tr(t){if(yo(t)!==void 0)return[{module:q,section:"switcher-page"}];let n=X(t),e=n===void 0?void 0:le(t,n);if(e!==void 0)return[{module:q,section:"slot"},...Ys(e)?[{module:q,section:"voice"}]:[],{module:q,section:"look"}];let i=C(t);return[{module:q,section:i==="entity"?"menu":`style-${i}`}]}function se(t,n,e,i,s,o={}){let r=Co(t,e),a=lo[n];return bn({color:a.color,icon:S(a.icon),title:i,open:r,onToggle:()=>Mr(t,e),...o.summary===void 0||o.summary===""?{}:{summary:o.summary},dot:o.dot===!0,id:`${q}:${e}`},r?s:c``)}function Do(t){let n=C(t),e=Kt(n),i=X(t),s=i===void 0?void 0:le(t,i),o=Tr(t),r=di(t.uiState,o),a=G(t),d=yo(t),u,l;if(a!==void 0&&d!==void 0)u=c`<div class="crumbs"><button class="root" title="The switcher's own style" @click=${()=>Ft(t,void 0)}>${e}</button><span class="sep">›</span><span class="kchip" style=${`--k:${dr}`}>Page</span><span class="nm" title=${a.name}>${a.name}</span></div>`,l=Pr(t,d);else if(s===void 0||i===void 0)u=c`<div class="crumbs"><span class="kchip" style=${`--k:${cr}`}>Menu</span><span class="nm" title=${e}>${e}</span></div>`,l=Fr(t,n);else{let h=jt(t,s);u=c`<div class="crumbs"><button class="root" title="Edit the menu" @click=${()=>he(t,i,void 0)}>${e}</button><span class="sep">›</span><span class="kchip" style=${`--k:${Z(s).color}`}>Slot</span><span class="nm" title=${h}>${h}</span></div>`,l=Nr(t,i,s)}return c`<div class="insp-head">
      ${u}
      <button class="expand" @click=${()=>{ui(t.uiState,o,!r),t.requestUpdate()}}>${r?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${l}</div>`}function Pr(t,n){let e=n.page;return se(t,"switcherPage","switcher-page",Ot,c`<fieldset class="ts-body me-body" ?disabled=${t.busy} aria-label=${Ot}>${Us(n)}</fieldset>`,{summary:Vs(e),dot:Ns(e)})}var Rr={triggerMode:"Mode",confirmOnRelease:"Confirm on release",showBanner:"Show banner",bannerSeconds:"Banner seconds",openOnRelease:"Open on release",instanceSwitchBehavior:"Behavior",phraseId:"Phrase"};function Eo(t,n){return n.key==="entityId"?n.target==="httpAction"?"HTTP action":t==="runScene"?"Scene":t==="runScript"?"Script":"Entity":n.key==="pageId"?n.target==="statusPage"?"Status page":"Page":Rr[n.key]??n.key}function _r(t,n,e){let i=P(e),s=$(e),o=ki(n),r=new Set(o.flatMap(u=>u.actions)),a=u=>{let l=K(u),h=u===s?void 0:fi(u,t.targets),f=`${l?.label??B(u)}${l?.requiresPremium?" (Pro)":""}${h===void 0?"":` (${h})`}`;return c`<option value=${u} ?selected=${u===s} ?disabled=${h!==void 0}>${f}</option>`},d=u=>t.edit(l=>Di(l,n,i,u,t.targets));return c`<label class="field"><span>Action</span>
    <select .value=${Ke(s)} @change=${u=>d(u.target.value)}>
      ${r.has(s)?p:c`<optgroup label="Now"><option value=${s} selected>${B(s)}</option></optgroup>`}
      ${o.map(u=>c`<optgroup label=${pi(u.category)}>${u.actions.map(a)}</optgroup>`)}
    </select></label>`}function Cr(t){return t.needsSetup===!0?`${t.name} (${t.source==="home"?"needs setup":"needs setup on the iPhone"})`:t.source==="iphone"?`${t.name} (on the iPhone)`:t.name}function to(){return c`<button type="button" class="link" @click=${_s}>Open HTTP actions</button>`}function Dr(t,n,e){let i=n.find(s=>x(s.id,e));return i?.source==="home"&&i.needsSetup===!0?c`<div class="hint warn ts-under">Needs setup. ${to()}</div>`:t.httpLibrary!==void 0&&n.length===0?c`<div class="hint ts-under">${rs} ${to()}</div>`:!t.catalogKnown&&t.httpLibrary!=="held"?c`<div class="hint ts-under">Open the iPhone app to list its HTTP actions here.</div>`:p}function Er(t,n,e,i,s){let o=P(e),r=ce(e)[s.key],a=typeof r=="string"?r:"",d=s.target==="page"?t.targets.pages:s.target==="statusPage"?t.targets.statusPages:s.target==="ttsPhrase"?t.targets.phrases??[]:t.targets.httpActions,u=a===""||d.some(w=>x(w.id,a)),l=w=>t.edit(k=>pt(k,n,o,s.key,w===""?void 0:w)),h=s.target==="statusPage"&&t.statusPagesKnown===!0,f=s.target==="httpAction"&&t.httpLibrary==="held"&&!t.catalogKnown,y=s.target==="page"?"A page that is gone":s.target==="ttsPhrase"?t.targets.phrases===void 0?"A phrase not listed here":"A phrase that is gone":h?`Not in this ${Q(t.device??"watch")}'s status pages`:f?os:ns,m=w=>s.target==="httpAction"?Cr(w):w.name;return c`<label class="field"><span>${Eo(i,s)}</span>
    <select .value=${Ke(d.find(w=>x(w.id,a))?.id??a)} @change=${w=>l(w.target.value)}>
      ${s.required===!0?p:c`<option value="" ?selected=${a===""}>None</option>`}
      ${u?p:c`<option value=${a} selected>${y}</option>`}
      ${d.map(w=>c`<option value=${w.id} ?selected=${x(w.id,a)}>${m(w)}</option>`)}
    </select></label>
    ${s.target==="ttsPhrase"?t.device==="iphone"?c`<div class="hint ts-under">${qi}</div>`:t.voice?.phrases===void 0?c`<div class="hint ts-under">No voice settings from this watch yet. Add phrases in Voice.</div>`:p:s.target==="statusPage"?h||t.catalogKnown?p:c`<div class="hint ts-under">${me("status pages",t.device??"watch")} Add them in Status pages.</div>`:s.target==="httpAction"?Dr(t,t.targets.httpActions,a):p}`}function Hr(t,n,e,i,s){let o=P(e),r=ce(e),a=(l,h)=>t.edit(f=>pt(f,n,o,s.key,l),h),d=Eo(i,s),u=ft(e,s);switch(s.type){case"entity":{let l=typeof r[s.key]=="string"?r[s.key]:"",h=i==="runScene"?"scene":i==="runScript"?"script":wi();return c`<div class="ts-stack">${Je({hass:t.hass},d,ho(t.hass,l),f=>a(f.entityId),`me:entity:${o}`,{domain:h,clearable:!1,needed:l===""})}</div>
        ${l===""?c`<div class="hint keep">Pick what it runs. A slot left without one is dropped when you save.</div>`:p}`}case"uuid":return Er(t,n,e,i,s);case"enum":{if(s.key==="triggerMode"){let f=Se(typeof r.entityId=="string"?r.entityId:""),y=mi(f),m=typeof u=="string"?u:y[0]??"",w=y.map(k=>[k,at(k)]);return y.includes(m)||w.unshift([m,at(m)]),I(d,m,w,k=>a(k),{snapBack:!0})}let l=bt(s.enum),h=typeof u=="string"?u:String(s.default??"");return l.length<=4?F(d,h,l,f=>a(f)):I(d,h,l,f=>a(f),{snapBack:!0})}case"bool":return _(d,u===!0,l=>a(l),s.default);case"number":{if(s.key==="bannerSeconds"&&ft(e,{key:"showBanner",type:"bool",default:!0})===!1)return p;let l=typeof r[s.key]=="number"?r[s.key]:void 0;return Vn(d,l,h=>a(h,`slot:${o}:${s.key}`),{...s.min===void 0?{}:{min:s.min},...s.max===void 0?{}:{max:s.max},step:1,optional:!0,clampOnCommit:!0,placeholder:typeof s.absentMeans=="number"?String(s.absentMeans):"",unit:"s",def:null})}}}function Or(t,n,e){if(!lt(n,e))return p;let i=P(e);return c`<div class="ts-stack">${F("Skip conditions",ms(ht(e)),fs,s=>t.edit(o=>Ri(o,n,i,gs(s))))}</div>
    <div class="hint ts-under">Whether running the automation from this menu skips its conditions. Default follows the tile, then "Skip conditions by default" in the watch's Settings.</div>`}function Ir(t,n){let e=P(n),i=gt(n),s=i===void 0,o=u=>t.edit(l=>Hi(l,e,u)),r=Ei(),a=(i??[]).filter(u=>!mt(u)),d=s?"Every screen":i.length===0?"No entity under the finger":i.map(Y).join(", ");return c`<details class="me-show-for">
    <summary><span>Show for</span><b>${d}</b></summary>
    ${_("Every screen",s,u=>o(u?void 0:r.slice(0,1)),!0)}
    ${s?p:c`<div class="me-chips" role="group" aria-label="Entity types">
      ${[...r,...a].map(u=>{let l=i.includes(u),h=!mt(u);return c`<button type="button" class="pe-chip ${l?"on":""} ${h?"odd":""}" aria-pressed=${l?"true":"false"}
          title=${h?"Not reported by the watch":p}
          @click=${()=>o(l?i.filter(f=>f!==u):[...i,u])}>${Y(u)}</button>`})}
    </div>
    ${a.length===0?p:c`<div class="hint warn">${a.map(Y).join(", ")}: Not reported by the watch.</div>`}
    <div class="hint">The slot shows only while the finger is over an entity of these types. With none picked, it shows only where no entity is under the finger.</div>`}
  </details>`}function Ar(t,n){return t.isVisible===!1||n.list==="anywhere"&&gt(t)!==void 0||lt(n,t)&&ht(t)!==null}function Wr(t){let n=po(t);if(n===void 0)return!1;let e=Z(t);return e.icon!==n.icon||!ur(e.color,n.color)}function Lr(t,n){let e=lo.name,i=K($(n));return c`<section class="sec name-sec" data-open="true" style=${`--c:${e.color}`}>
    <div class="sec-h pinned">
      <span class="swatch">${S(e.icon)}</span>
      <h4>Name</h4>
      <span class="me-name" title="A slot is named by what it runs, else by its action">${jt(t,n)}</span>
      ${i?.requiresPremium?c`<span class="pe-badge" title="Needs Wrist Assistant Pro on the watch">Pro</span>`:p}
    </div>
  </section>`}function Nr(t,n,e){let i=P(e),s=$(e),o=K(s),r=Z(e),a=po(e),d=typeof e.position=="string"?e.position:"",u=H(t.document,n).filter(m=>!x(P(m),i)),l=Me().map(m=>{let w=z(m);return u.some(k=>k.position===m)?[m,m===d?`${w} (shared)`:`${w} (swap)`]:[m,w]}),h=c`<fieldset class="me-body" ?disabled=${t.busy} aria-label="Slot">
    ${o===void 0?c`<div class="hint warn">A newer app wrote this action. A watch with an older app shows Sync Needed for it until the app is updated. Pick another action to replace it.</div>`:p}
    ${I("Place",d,l,m=>t.edit(w=>Ti(w,n,i,m)),{snapBack:!0})}
    ${_("Shown",e.isVisible!==!1,m=>t.edit(w=>Pi(w,n,i,m)),!0)}
    ${_r(t,n,e)}
    ${o?.description?c`<div class="hint ts-under">${o.description}</div>`:p}
    ${xi(s)?c`<div class="hint ts-under keep">Only for a watch with more than one Home Assistant.</div>`:p}
    ${(o?.payload??[]).map(m=>Hr(t,n,e,s,m))}
    ${Or(t,n,e)}
    ${n.list==="anywhere"?Ir(t,e):p}
  </fieldset>`,f=c`<fieldset class="me-body" ?disabled=${t.busy} aria-label="Look">
    <div class="ts-stack">${ve({icons:t.icons,symbols:t.symbols},typeof e.icon=="string"?e.icon:"",m=>t.edit(w=>_i(w,n,i,m),`slot:${i}:icon`),`me:icon:${i}`,void 0,"Icon",!1)}</div>
    <div class="ts-no-alpha">${ae("Color",typeof e.color=="string"?e.color:void 0,m=>{m!==void 0&&t.edit(w=>Ci(w,n,i,m),`slot:${i}:color`)},!1,a?.color)}</div>
  </fieldset>`,y=Gs(t,n,e);return c`${Lr(t,e)}
    ${se(t,"slot","slot","Slot",h,{summary:fo(e),dot:Ar(e,n)})}
    ${y===void 0?p:se(t,"slot","voice","Voice",c`<fieldset class="me-body me-voice" ?disabled=${t.busy} aria-label="Voice">${y}</fieldset>`,{summary:Xs(t,e),dot:Js(e)})}
    ${se(t,"look","look","Look",f,{summary:r.icon,dot:Wr(e)})}
    <div class="me-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${t.busy} title="Remove this slot from the menu"
        @click=${()=>t.edit(m=>ut(m,n,i))}>${S("delete")}<span>Remove</span></button>
    </div>`}function Vr(t,n,e){if(!yt(t.document,n,e))return p;let i=vt(t.document,n,e),s=`style:${n}:${e.key}`,o=(r,a=!1)=>t.edit(d=>Wi(d,n,e.key,r),a?s:void 0);switch(e.type){case"bool":return _(e.label,i===!0,r=>o(r),e.default);case"enum":{let r=bt(e.enum),a=String(i);return r.length<=4?F(e.label,a,r,d=>o(d),{def:String(e.default)}):I(e.label,a,r,d=>o(d),{def:String(e.default),snapBack:!0})}case"number":{let r=typeof i=="number"?i:Number(e.default);return c`${we(e.label,r,a=>o(a,!0),{min:e.min??0,max:e.max??1,step:e.step??.01,def:Number(e.default)})}
      ${e.presets===void 0?p:c`<div class="ts-after">${e.presets.map(a=>c`<button type="button"
        class="pe-chip ${a.value===r?"on":""}" aria-pressed=${a.value===r?"true":"false"} @click=${()=>o(a.value)}>${a.label}</button>`)}</div>`}`}case"color":{let r=typeof i=="string"?i:String(e.default);return c`<div class="ts-no-alpha">${ae(e.label,r,a=>{a!==void 0&&o(a,!0)},!1,String(e.default))}</div>
        ${e.swatches===void 0?p:c`<div class="ts-swatch-row"><div class="ts-swatches" role="group" aria-label=${e.label}>
          ${e.swatches.map(a=>{let d=a.toUpperCase()===r.toUpperCase();return c`<button type="button" class="ts-swatch ${d?"on":""}" aria-pressed=${d?"true":"false"} title=${a} aria-label=${a}
              style=${`--sw:${a}`} @click=${()=>o(a)}></button>`})}</div></div>`}`}}}function Ur(t,n){return typeof t=="number"&&typeof n=="number"?Math.abs(t-n)<1e-9:typeof t=="string"&&typeof n=="string"?t.toUpperCase()===n.toUpperCase():t===n}function qr(t,n){return wt(n).some(e=>yt(t,n,e)&&!Ur(vt(t,n,e),e.default))}function no(t,n,e){let i=qr(t.document,n);return se(t,"style",e,"Style",c`<fieldset class="me-body me-style" ?disabled=${t.busy} aria-label="Style">
    ${wt(n).map(s=>Vr(t,n,s))}
  </fieldset>`,{summary:i?"Changed":"Defaults",dot:i})}function jr(t){let n=Bt(t),e=a=>{t.uiState.set(go,a),t.requestUpdate()},i=F("Edit",n,[["domain","By type"],["entity","By entity"]],a=>e(a)),s,o,r=!1;if(n==="domain"){let a=zt(t),d=$e(a),u=yi(a),l=vi().map(f=>[f.domain,f.label]),h=d?.inheritKey?Si(t.document,a):!1;r=h,o=`By type \xB7 ${d?.label??a}`,s=c`${I("Type",a,l,f=>{t.uiState.set(wo,f),t.requestUpdate()})}
      ${u.length>0?c`<div class="hint ts-under keep">The same menu as ${u.map(f=>f.label).join(", ")}.</div>`:p}
      ${d?.inheritKey?c`${_("Add the All slots",h,f=>t.edit(y=>Oi(y,a,f)),!1)}
        <div class="hint ts-under">The All menu's slots fill the places this menu leaves free.</div>`:p}`}else{let a=de(t.document),d=Jt(t);o=`By entity \xB7 ${d===void 0?"none yet":j(t.hass,d)}`;let u=l=>{let h=l.entityId.trim();h!==""&&(t.edit(f=>Ii(f,h)),t.uiState.set(Ut,h),t.uiState.set(Vt,(Number(t.uiState.get(Vt)??0)||0)+1),t.requestUpdate())};s=c`<div class="me-entities">
      ${a.length===0?c`<p class="hint keep">No entity has a menu of its own. Add one below: it starts as a copy of its type's menu.</p>`:p}
      ${a.map(l=>{let h=l===d;return c`<div class="me-entity ${h?"on":""}">
          <button type="button" class="me-entity-pick" aria-pressed=${h?"true":"false"}
            @click=${()=>{t.uiState.set(Ut,l),t.requestUpdate()}}>
            <b>${j(t.hass,l)}</b><code>${l}</code></button>
          <button type="button" class="pe-btn pe-danger" title="Remove this entity's own menu. It follows its type's menu again."
            @click=${()=>t.edit(f=>Ai(f,l))}>Remove</button>
        </div>`})}
      <div class="ts-stack">
        ${Je({hass:t.hass},"Add an entity",ho(t.hass,""),u,`me:er:add:${String(t.uiState.get(Vt)??0)}`,{clearable:!1})}
      </div>
    </div>`}return se(t,"menu","menu","Menu",c`<fieldset class="me-body me-pick" ?disabled=${t.busy} aria-label="Menu">
    ${i}${s}
  </fieldset>`,{summary:o,dot:r})}function Fr(t,n){let e=n==="anywhere"?no(t,"quickAction","style-anywhere"):n==="switcher"?no(t,"pageSwitcher","style-switcher"):jr(t);return c`<p class="me-menu-note">${oo[n]}</p>${e}
    <p class="me-menu-note me-pick-note">${n==="switcher"?sr:"Select a slot to edit it, or add one."}</p>`}var Ho=pe`
  /* The Menus and Slots cards: the page editor's Pages and Tiles cards. */
  .me-menus-card > .layers, .me-slots-card > .layers { padding: 6px 8px 8px; overflow: visible; }
  .me-menus-card > .lc-note, .me-slots-card > .lc-note { margin: 8px 12px; color: var(--wa-muted); }
  .me-slots-card > .lc-filter { border-bottom: 0; }
  .layer .acts button.icon { display: inline-grid; place-items: center; padding: 0; }
  .layer .acts button.icon:disabled { opacity: .35; cursor: default; }
  /* A slot's or a page's icon in its color, on the black well. */
  .layer .thumb.me-thumb {
    display: grid; place-items: center;
    background: color-mix(in srgb, var(--c, #888) 22%, #000);
  }
  .layer .thumb .me-thumb-glyph { display: grid; place-items: center; width: 16px; height: 16px; }
  .layer .thumb .me-thumb-glyph svg { width: 14px; height: 14px; display: block; }
  .me-thumb-track { fill: none; stroke: rgba(255, 255, 255, .22); stroke-width: 1; stroke-dasharray: 2 2; }

  /* The watch screen on the stage. */
  .me-screen { position: relative; flex: none; background: #000; }
  .me-screen-bg { position: absolute; inset: 0; width: 100%; height: 100%; }
  .me-track { fill: none; stroke: rgba(255, 255, 255, .14); stroke-width: 1; stroke-dasharray: 3 3; }
  .me-center { fill: rgba(255, 255, 255, .35); }
  .me-screen-note {
    position: absolute; left: 14px; right: 14px; top: 62%; margin: 0;
    color: rgba(255, 255, 255, .6); font-size: 12px; line-height: 1.3; text-align: center;
  }
  /* Sizes on the screen are points times the stage's scale, --me-s. */
  .me-page {
    position: absolute; transform: translate(-50%, -50%); max-width: calc(68px * var(--me-s, 1));
    padding: calc(2px * var(--me-s, 1)) calc(6px * var(--me-s, 1));
    border: 1px solid var(--c, rgba(255, 255, 255, .3)); border-radius: 999px;
    background: color-mix(in srgb, var(--c, #888) 22%, #000); color: #fff;
    font-size: calc(9.5px * var(--me-s, 1)); font-weight: 600; line-height: 1.35;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .me-dot.me-page-dot { width: calc(28px * var(--me-s, 1)); height: calc(28px * var(--me-s, 1)); cursor: default; }
  .me-dot {
    position: absolute; width: calc(36px * var(--me-s, 1)); height: calc(36px * var(--me-s, 1));
    margin: 0; padding: 0; transform: translate(-50%, -50%);
    display: grid; place-items: center; border-radius: 50%; border: 1.5px solid var(--c, rgba(255, 255, 255, .3));
    background: color-mix(in srgb, var(--c, #888) 22%, #000); color: #fff; cursor: pointer;
  }
  .me-dot svg { display: block; }
  /* The marks on the black screen are a light form of the accent, as the
     page editor's are: the light skin's own accent is too dark there. */
  .me-screen { --me-mark: color-mix(in srgb, var(--wa-accent) 55%, #fff); }
  .me-dot.on, .me-page.on { box-shadow: 0 0 0 2px #000, 0 0 0 4px var(--me-mark); }
  .me-dot:focus-visible { outline: none; box-shadow: 0 0 0 2px #000, 0 0 0 4px var(--me-mark), var(--wa-ring); }
  .me-dot.off { opacity: .4; }
  .me-dot.two { width: calc(23px * var(--me-s, 1)); height: calc(23px * var(--me-s, 1)); border-width: 1px; z-index: 1; }
  .me-count {
    position: absolute; top: -5px; right: -5px; min-width: 16px; height: 16px; padding: 0 4px; border-radius: 999px;
    background: var(--wa-accent); color: #000; font-size: 10px; font-weight: 700; line-height: 16px; text-align: center;
  }
  .me-dot.inh { opacity: .45; border-style: dashed; cursor: default; width: calc(28px * var(--me-s, 1)); height: calc(28px * var(--me-s, 1)); }
  .me-dot.free {
    border: 1.5px dashed rgba(255, 255, 255, .28); background: transparent; color: rgba(255, 255, 255, .55);
    width: calc(28px * var(--me-s, 1)); height: calc(28px * var(--me-s, 1));
  }
  .me-dot.free:hover:not(:disabled) { color: #fff; border-color: rgba(255, 255, 255, .6); }
  .me-dot.free svg.ui-icon { width: calc(13px * var(--me-s, 1)); height: calc(13px * var(--me-s, 1)); }
  .me-glyph-dot { width: 10px; height: 10px; border-radius: 50%; }

  /* The inspector's cards. A fieldset only to switch every control off at
     once while a save is out; it draws nothing of its own. */
  fieldset.me-body { margin: 0; padding: 2px 0 0; border: 0; min-width: 0; display: flex; flex-direction: column; gap: 2px; --wa-lab: 96px; }
  .me-body .hint { margin: 0 0 4px; }
  .me-menu-note { margin: 6px 2px 2px; font-size: 12px; line-height: 1.4; color: var(--wa-muted); }
  .me-menu-note.me-pick-note { margin-top: 10px; }
  .name-sec .sec-h > .me-name {
    flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    font-size: 12.5px; font-weight: 600; color: var(--wa-ink);
  }
  .me-acts { display: flex; flex-wrap: wrap; gap: 6px; padding: 12px 0 0; }
  .me-readonly { font-size: 12px; color: var(--wa-muted); }
  .me-sub-h { margin: 8px 0 2px; font-size: 12px; font-weight: 600; color: var(--wa-muted); }
  .me-voice-list { display: flex; flex-direction: column; margin-bottom: 2px; }
  .me-body .hint.warn { color: var(--wa-amber); }
  .me-show-for { margin-top: 6px; border-top: 1px solid var(--wa-line); padding-top: 6px; }
  .me-show-for > summary { display: flex; gap: 8px; align-items: baseline; cursor: pointer; font-size: 12px; color: var(--wa-muted); padding: 4px 0; }
  .me-show-for > summary b { color: var(--wa-ink); font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .me-chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 4px 0; }
  .me-entities { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
  .me-entity { display: flex; align-items: center; gap: 8px; padding: 4px 6px; border: 1px solid transparent; border-radius: var(--wa-r-sm, 8px); }
  .me-entity.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); }
  .me-entity-pick { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; flex: 1; min-width: 0; border: 0; background: none; color: var(--wa-ink); font: inherit; text-align: left; cursor: pointer; padding: 2px; }
  .me-entity-pick:focus-visible { outline: none; box-shadow: var(--wa-ring); border-radius: 6px; }
  .me-entity-pick code { color: var(--wa-muted); }
  .pe-chip {
    padding: 3px 10px; border: 1px solid var(--wa-line); border-radius: 999px; background: var(--wa-card); color: var(--wa-ink);
    font: inherit; font-size: 12px; cursor: pointer;
  }
  .pe-chip.on { background: var(--wa-sel-bg); border-color: var(--wa-sel-ring); font-weight: 600; }
  .pe-chip.odd { border-style: dashed; color: var(--wa-amber); }
  .pe-chip:focus-visible { outline: none; box-shadow: var(--wa-ring); }
  .hint.ts-under { padding-left: calc(var(--wa-lab) + 8px); margin-top: -2px; }
  .ts-after { display: flex; flex-wrap: wrap; gap: 6px; padding: 2px 0 6px calc(var(--wa-lab) + 8px); }
  /* A picked page's Automatic icon chip, as the page editor drew it. */
  .ts-chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 2px 0 6px; }
  .ts-swatch-row { padding: 2px 0 4px calc(var(--wa-lab) + 8px); }
  .ts-swatches { display: flex; flex-wrap: wrap; gap: 6px; }
  .ts-swatch {
    width: 20px; height: 20px; padding: 0; border: 0; border-radius: 50%; cursor: pointer;
    background: var(--sw); box-shadow: inset 0 0 0 1px rgba(128, 128, 128, .45);
  }
  .ts-swatch.on { box-shadow: 0 0 0 2px var(--wa-card), 0 0 0 4px var(--wa-accent); }
  .ts-swatch:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--wa-card), 0 0 0 4px var(--wa-accent), var(--wa-ring); }
  .ts-no-alpha .color-box .alpha { display: none; }
  .ts-no-alpha .color-box { padding-right: 6px; }
  .ts-stack .field { grid-template-columns: minmax(0, 1fr); gap: 4px; padding: 2px 0; }
  .ts-stack .field.entity-field > :not(:first-child) { grid-column: 1; }
`;function Gt(t){if(t.length===0)return"";let n=t.map(i=>Ni(i));return`Another save also changed ${n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`}. ${n.length===1?"Your version replaced it.":"Your versions replaced them."}`}function Oo(t){if(t.ok){if(t.alreadySaved===!0)return{kind:"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${t.revision}.`};let e=t.replaced??[];return e.length>0?{kind:"warn",text:`Saved. ${Gt(e)}`}:t.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let n=(t.message??"").trim();switch(t.code){case"conflict":return{kind:"warn",text:"Not saved. The menus kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds menus for this watch. Start with the defaults again."};case"invalid":{let e=t.problems??[];return e.length>0?{kind:"err",text:`Not saved. Something in the menus is not right: ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the menus${n===""?".":`: ${n}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${$n}`};case"busy":return{kind:"warn",text:"Already saving these menus. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the menus just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}function Lo(){return As()||$s()}Rs({dirty:Lo,drop:()=>{Ws(),ks()}});typeof window<"u"&&window.addEventListener("beforeunload",t=>{Lo()&&(t.preventDefault(),t.returnValue="")});var Kr=15e3,No=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),Xt=No?"\u2318":"Ctrl+",Qt={min:200,max:720,middleMin:320},en={left:280,right:320},tn="wrist-assistant-panel.menus.columns.v1",Br=24,Io=820;function We(t){return L(t).message}function Le(t){return L(t).code}function Ne(t){let{code:n,message:e}=L(t);return Object.assign(new Error(e),n===void 0?{}:{code:n})}function zr(t){return t<1e3?`${t} bytes`:`${Number((t/1e3).toFixed(1))} KB`}function Jr(t){let n=t?Date.parse(t):NaN;return Number.isNaN(n)?"":hn(Math.max(0,(Date.now()-n)/1e3))}function Yr(t){return t instanceof HTMLElement?Xn(t.tagName,t instanceof HTMLInputElement?t.type:void 0,t.isContentEditable):!1}function Zr(){let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t===null||t===document.body||t===document.documentElement}function Gr(t){return E(t)?Ze(t).filter(n=>!Xe(n)&&hi(ye(n))).map(n=>({id:ye(n),name:Ge(n)})):[]}var Ao=["#8FA8C4","#9CB6A6","#C8AE8E","#A5B7CF","#D8A3A0","#A8BED5","#CCD8E6","#D8A3A0"];function Ve(t){return typeof t=="string"&&t.trim()!==""?t:void 0}var Xr="#8E8E93";function nn(t){if(!E(t))return[];let n=0;return Ze(t).filter(e=>!ti(e)&&!Xe(e)).map(e=>{let i=e.hideFromSwitcher===!0,s=Ge(e),o=Ve(e.switcherIcon)??Ve(ei(e)[0]?.icon)??(ni(e)?"bolt.fill":"square.grid.2x2.fill"),r=i?Xr:Ao[n++%Ao.length],a=Ve(e.switcherColor)??r,d=e.switcherDisplayMode==="icon"?void 0:Ve(e.switcherText)??s;return{id:ye(e),name:s,icon:o,color:a,...d===void 0?{}:{text:d},hidden:i}})}function Rc(t){return nn(t).filter(n=>!n.hidden).map(({hidden:n,...e})=>e)}var Wo={ok:0,warn:1,err:2};function Qr(t,n){return t===void 0?n:n===void 0?t:{kind:Wo[n.kind]>Wo[t.kind]?n.kind:t.kind,text:t.text===n.text?t.text:`${t.text} ${n.text}`}}function ea(t){let n=st(t)??{},e=H(n,{list:"anywhere"}).length,i=de(n).length;return`Anywhere menu: ${(o=>`${o} ${o===1?"slot":"slots"}`)(e)}. ${i===0?"No entity has its own menu.":`${i} ${i===1?"entity has":"entities have"} its own menu.`}`}var g=class extends on{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=p;this.shellOwnsWatch=!1;this.phones=!1;this.unsupported=!1;this.httpLibrarySeq=0;this.voiceSeq=0;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.starting=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.zoom=co();this.columns={...en};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new Fn(this);this.symbols=new Hn(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.catalogSeq=0;this.statusPagesSeq=0;this.pagesSeq=0;this.behaviorSeq=0;this.historySeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let e=this.watchId;!this.isConnected||e===void 0||(this.load(e,!0),this.loadCatalog(e),this.loadHttpLibrary(),this.loadStatusPages(e),this.loadPages(e),this.loadBehavior(e),this.loadVoice(e))};this.onScrubStart=e=>{e.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=e=>{e.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=e=>{if(e.defaultPrevented)return;let i=e.composedPath();if(!i.includes(this)&&!Zr()||this.renderRoot.querySelector("dialog[open]"))return;let s=e.metaKey||e.ctrlKey,o=e.key.toLowerCase();if(s&&!e.altKey&&o==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1,this.updateComplete.then(()=>this.renderRoot.querySelector(".wa-bar .tb-more")?.focus());return}if(e.key==="Escape"&&this.watchMenuOpen){e.preventDefault(),this.watchMenuOpen=!1,this.updateComplete.then(()=>this.renderRoot.querySelector(".wa-bar .me-watch-btn")?.focus());return}if(!Yr(i[0])){if(s&&!e.altKey&&o==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}if(e.ctrlKey&&!e.metaKey&&!e.altKey&&o==="y"){e.preventDefault(),this.redo();return}if(e.key==="Escape"&&!s&&!e.altKey){let r=this.viewHost();r!==void 0&&Yt(r)&&e.preventDefault()}}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let i=e.composedPath(),s=o=>i.some(r=>r instanceof HTMLElement&&r.classList.contains(o));this.topMenuOpen&&!s("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!s("me-watch-picker")&&(this.watchMenuOpen=!1)};this.addEventListener(Wn,this.onScrubStart),this.addEventListener(Ln,this.onScrubEnd),this.addEventListener("focusout",()=>{this.draft?.endCoalesce(),this.pagesDraft?.endCoalesce()})}get watches(){return Tn(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get device(){return xs(this.watches,this.watchId)?"iphone":"watch"}get draft(){if(!(this.watchId===void 0||this.record===void 0||this.record.revision<=0))return J(this.watchId)}get pagesDraft(){if(!(this.watchId===void 0||this.pagesRecord!==void 0&&this.pagesRecord.revision<=0))return Rt(this.watchId)}get pagesDocument(){let e=this.pagesRecord;return this.pagesDraft?.document??(e!==void 0&&e.revision>0?e.document:void 0)}get pages(){return Gr(this.pagesDocument)}get saving(){return this.watchId===void 0?!1:(J(this.watchId)?.saving??!1)||(this.pagesDraft?.saving??!1)}get dirty(){return(this.draft?.dirty??!1)||(this.pagesDraft?.dirty??!1)}get undoDraft(){let e=this.pagesDraft;return e!==void 0&&this.pickedSwitcherPage()!==void 0?e:this.draft}pickedSwitcherPage(){return G({uiState:this.uiState,switcherPages:[],switcherRows:nn(this.pagesDocument)})}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Dn(tn,en,Qt),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.catalogSeq++,this.statusPagesSeq++,this.httpLibrarySeq++,this.pagesSeq++,this.behaviorSeq++,this.voiceSeq++,this.historySeq++}willUpdate(e){if(this.hass){e.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,rn(this.hass).then(o=>{this.ownList=o.owners},()=>{this.ownList=[]}));let s=_n(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||e.has("ownerId"));s!==void 0&&this.openWatch(s)}this.followSave();let i=this.restoreAsk;i!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(s=>s.revision===i.entry.revision)&&this.closeAsk()}updated(){let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),Jn(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let i of e){if(i.target!==this){this.measureTop(i.target);continue}let s=i.contentRect;Math.abs(s.width-this.hostWidth)>=1&&(this.hostWidth=s.width),Math.abs(s.height-this.hostHeight)>=1&&(this.hostHeight=s.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let i=this.renderRoot?.querySelector(".pe-top")??void 0;i!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=i,i!==void 0&&e.observe(i))}measureTop(e){let i=e.offsetHeight;i!==this.topHeight&&(this.topHeight=i,this.style.setProperty("--pe-top-h",`${i}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let e=this.watchId;if(e===void 0)return;let i=this.pagesDraft?.saveDone;if(i!==void 0&&i!==this.followedPagesSave){this.followedPagesSave=i;let r=()=>this.pagesSaveEnded(e);i.then(r,r)}let s=J(e)?.saveDone;if(s===void 0||s===this.followedSave)return;this.followedSave=s;let o=()=>this.saveEnded(e);s.then(o,o)}pagesSaveEnded(e){this.requestUpdate(),!(!this.isConnected||e!==this.watchId)&&(this.loadPages(e),this.flushPending())}saveEnded(e){this.requestUpdate(),this.isConnected&&(e===this.watchId?(this.reloadPending=!1,this.load(e,!0)):this.flushPending())}openWatch(e,i=!1){e!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=e,this.note=void 0,this.unsupported=!1,this.catalog=void 0,this.catalogSeq++,this.statusPages=void 0,this.statusPagesSeq++,this.pagesRecord=void 0,this.pagesSeq++,this.behavior=void 0,this.behaviorSeq++,this.voiceDocument=void 0,this.voiceSeq++,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),i=!1),this.startSubscription(e),this.load(e,i),this.loadCatalog(e),this.loadHttpLibrary(),this.loadStatusPages(e),this.loadPages(e),this.loadBehavior(e),this.loadVoice(e)}async loadVoice(e){let i=this.hass;if(!i)return;let s=++this.voiceSeq;try{let o=await D(i,e,"voice");if(s!==this.voiceSeq||e!==this.watchId)return;this.voiceDocument=ws(o)}catch{if(s!==this.voiceSeq||e!==this.watchId)return;this.voiceDocument=void 0}}voiceContext(){let e=this.voiceDocument;return{phrases:e===void 0?void 0:Pt(e),defaults:vs(e,this.catalog)}}async loadCatalog(e){let i=this.hass;if(!i)return;let s=++this.catalogSeq;try{let o=await D(i,e,"catalog");if(s!==this.catalogSeq||e!==this.watchId)return;this.catalog=is(o)}catch(o){if(s!==this.catalogSeq||e!==this.watchId)return;xt(o)&&(this.catalog=void 0)}}async loadHttpLibrary(){let e=this.hass;if(!e)return;let i=++this.httpLibrarySeq;try{let s=await ln(e);if(i!==this.httpLibrarySeq)return;this.httpLibrary=On(s)}catch(s){if(i!==this.httpLibrarySeq)return;In(s)&&(this.httpLibrary=void 0)}}async loadStatusPages(e){let i=this.hass;if(!i)return;let s=++this.statusPagesSeq;try{let o=await D(i,e,"status_pages");if(s!==this.statusPagesSeq||e!==this.watchId)return;this.statusPages=ss(o)}catch(o){if(s!==this.statusPagesSeq||e!==this.watchId)return;xt(o)&&(this.statusPages=void 0)}}async loadPages(e){let i=this.hass;if(!i)return;let s=++this.pagesSeq;try{let o=await D(i,e,"pages");if(s!==this.pagesSeq||e!==this.watchId)return;this.pagesRecord={revision:o.revision,document:o.document},o.revision>0&&E(o.document)&&!(Rt(e)?.saving??!1)&&Ss(e,o.document,o.revision).mergedIntoEdits&&(this.note={kind:"warn",text:"The pages changed elsewhere. Your edits are kept."})}catch{}}async loadBehavior(e){let i=this.hass;if(!i)return;let s=++this.behaviorSeq;try{let o=await D(i,e,"behavior");if(s!==this.behaviorSeq||e!==this.watchId)return;this.behavior=o.revision>0&&E(o.document)?o.document:void 0}catch{if(s!==this.behaviorSeq||e!==this.watchId)return;this.behavior=void 0}}async load(e,i=!1){let s=this.hass;if(!s)return;if(i&&this.holdReload){this.reloadPending=!0;return}let o=++this.loadSeq;this.stopPolling(),i||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let r=await D(s,e,"menus");if(o!==this.loadSeq)return;if(i&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(r),this.loadError=void 0}catch(r){if(o!==this.loadSeq)return;Ki(r)?(this.unsupported=!0,this.loadError=void 0):i||(this.loadError=We(r)),this.restartDraft?.watchId===e&&(this.restartDraft=void 0)}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(e))}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(e){let i=this.watchId;this.record=e;let s=e.revision>0?st(e.document):void 0;if(i===void 0||s===void 0)return;let o=this.restartDraft;o!==void 0&&o.watchId===i&&e.revision>=o.revision&&(this.restartDraft=void 0,(J(i)?.dirty??!1)||_e(i));let r=Is(i,s,e.revision);r.replaced.length>0?this.note={kind:"warn",text:Gt(r.replaced)}:r.mergedIntoEdits&&(this.note={kind:"warn",text:"The menus changed somewhere else. Your edits are kept."}),this.requestUpdate()}async loadHistory(e){let i=this.hass;if(!i||this.historyState==="unsupported")return;let s=++this.historySeq;try{let o=await an(i,e,"menus");if(s!==this.historySeq||e!==this.watchId)return;this.history=Array.isArray(o?.entries)?o.entries:[],this.historyState="ready"}catch(o){if(s!==this.historySeq||e!==this.watchId)return;this.historyState=Le(o)==="unknown_command"?"unsupported":"error"}}startSubscription(e){let i=this.hass;if(this.endSubscription(),!i)return;let s=++this.subscribeSeq;un(i,e,o=>{s===this.subscribeSeq&&(o.kind==="catalog"?as(o,this.catalog)&&this.loadCatalog(e):o.kind==="status_pages"?this.loadStatusPages(e):o.kind==="pages"?this.loadPages(e):o.kind==="behavior"?this.loadBehavior(e):o.kind==="voice"?this.loadVoice(e):o.kind==="menus"&&o.revision!==(this.record?.revision??0)&&this.load(e,!0))}).then(o=>{s===this.subscribeSeq?this.unsubscribe=o:o().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let e=this.unsubscribe;this.unsubscribe=void 0,e?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||xn(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},Kr))}async poll(){this.pollTimer=void 0;let e=this.hass,i=this.watchId,s=this.record;if(!(!e||i===void 0||s===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let o=await D(e,i,"menus");if(i!==this.watchId||this.record!==s)return;o.revision===s.revision?this.record={...s,delivered_revision:o.delivered_revision,delivered_at:o.delivered_at,rejected_revision:o.rejected_revision,rejected_at:o.rejected_at,rejected_reason:o.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(o),this.loadHistory(i))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,i){let s=this.draft;if(!s||this.saving)return!1;let o=s.apply(e(s.document),this.scrubKey??i);return this.requestUpdate(),o}editPages(e,i){let s=this.pagesDraft;if(!s||this.saving)return!1;let o=this.scrubKey??i,r=s.apply(e(s.document),o===void 0?void 0:{coalesce:o});return this.requestUpdate(),r}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let e=this.icons??Gn,i=this.iconMemo;if(i!==void 0&&i.provider===e&&i.tick===this.iconsTick)return i.icons;let s=Qn(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:s},s}targets(){return{pages:this.pages,statusPages:this.statusPages??this.catalog?.statusPages??[],httpActions:An(this.catalog,this.httpLibrary)?.httpActions??[],phrases:this.voiceDocument===void 0?void 0:Pt(this.voiceDocument)}}screen(){let e=this.phoneLayout();if(e!==void 0)return us(e);let i=this.watches.find(s=>s.owner_watch_id===this.watchId);return(ze(i?.screen_size)??Be).screen}phoneLayout(){if(this.device!=="iphone")return;let e=this.watches.find(i=>i.owner_watch_id===this.watchId);return ds(cs(e?.screen_size))}viewHost(){let e=this.draft,i=this.hass;if(e===void 0||i===void 0)return;let s=this,o=nn(this.pagesDocument);return{hass:i,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.phoneLayout()===void 0?this.stageScale:this.stageScale*Tt,...this.phoneLayout()===void 0?{}:{phone:this.phoneLayout()},switcherPages:o.filter(r=>!r.hidden).map(({hidden:r,...a})=>a),switcherRows:o,switcherSettings:r=>this.switcherSettingsHost(r),get document(){return e.document},get targets(){return s.targets()},get catalogKnown(){return s.catalog!==void 0},get httpLibrary(){return s.httpLibrary===void 0?void 0:s.httpLibrary.revision>0?"held":"empty"},get statusPagesKnown(){return s.statusPages!==void 0},get voice(){return s.voiceContext()},get device(){return s.device},get busy(){return s.saving},edit:(r,a)=>this.draft===e&&this.edit(r,a),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}switcherSettingsHost(e){let i=this.pagesDraft;if(i===void 0||nt(i.document,e)===void 0)return;let s=this,o=this.memoIcons();return{pageId:e,icons:o,symbols:this.symbols,uiState:this.uiState,get page(){return nt(i.document,e)??{}},get busy(){return s.saving},edit:(r,a)=>{this.pagesDraft===i&&this.editPages(r,a?.typing===!0?`switcher:${e.toUpperCase()}`:void 0)},endCoalesce:()=>i.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.undoDraft?.undo()&&this.requestUpdate()}redo(){this.undoDraft?.redo()&&this.requestUpdate()}discard(){if(this.saving)return;let e=this.draft?.discard()??!1,i=this.pagesDraft?.discard()??!1;(e||i)&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,i=this.watchId;this.endScrub();let s=this.draft,o=this.pagesDraft;if(!e||i===void 0||!s||this.saving)return;let r=s.dirty,a=o?.dirty??!1;if(!r&&!a)return;this.note=void 0;let d=r?await this.saveMenus(e,i,s):void 0,u=a&&o!==void 0&&this.pagesDraft===o?await this.savePages(e,i,o):void 0;i===this.watchId&&(this.note=Qr(d,u))}async saveMenus(e,i,s){let o=Hs(s,{prepare:Li,save:(a,d)=>fe(e,i,"menus",a,d).catch(u=>{throw Ne(u)}),fetch:async()=>{let a=await D(e,i,"menus").catch(d=>{throw Ne(d)});return{revision:a.revision,document:a.document}}});this.followedSave=s.saveDone,this.requestUpdate();let r=await o.catch(a=>({ok:!1,revision:s.revision,merged:!1,code:Le(a)??"unknown",message:We(a)}));return this.saveEnded(i),Oo(r)}async savePages(e,i,s){let o=bs(s,{prepare:a=>ps(Bi(a),s.base,this.hass?.states),save:(a,d)=>fe(e,i,"pages",a,d).catch(u=>{throw Ne(u)}),fetch:async()=>{let a=await D(e,i,"pages").catch(d=>{throw Ne(d)});return{revision:a.revision,document:a.document}}});this.followedPagesSave=s.saveDone,this.requestUpdate();let r=await o.catch(a=>({ok:!1,revision:s.revision,merged:!1,code:Le(a)??"unknown",message:We(a)}));return this.pagesSaveEnded(i),kn(r)}async startWithDefaults(){let e=this.hass,i=this.watchId;if(!e||i===void 0||this.starting)return;this.starting=!0,this.note=void 0;let s=await Os((o,r)=>fe(e,i,"menus",o,r));if(this.starting=!1,i===this.watchId){if(s.ok)this.note={kind:"ok",text:"Started with the defaults. The watch picks them up the next time it checks."};else if(s.code==="no_record"){this.note={kind:"warn",text:`${ji} Go to Watch app, Settings, Pair a device.`};return}else if(s.code==="conflict")this.note={kind:"warn",text:"Menus arrived meanwhile, so those are shown."};else if(s.code==="unsupported"){this.unsupported=!0;return}else{this.note={kind:"err",text:`Could not start: ${s.message}`};return}this.load(i,!0)}}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(e){let i=this.hass,s=this.watchId,o=this.record;if(!i||s===void 0||o===void 0||this.draft?.dirty)return;let r={entry:e,baseRevision:o.revision};this.restoreAsk=r,cn(i,s,"menus",e.revision).then(a=>{this.restoreAsk===r&&(this.restoreAsk={...r,summary:ea(a.document)})},()=>{})}async restore(){let e=this.hass,i=this.watchId,s=this.restoreAsk;if(!e||i===void 0||s===void 0||this.restoring)return;this.restoring=!0;let o;try{let r=await dn(e,i,"menus",s.entry.revision,s.baseRevision);o={kind:"ok",text:`Revision ${s.entry.revision} is back.`},i===this.watchId?this.restartDraft={watchId:i,revision:r.revision}:(J(i)?.dirty??!1)||_e(i)}catch(r){let a=Le(r);a==="conflict"?o={kind:"warn",text:"Not restored. The menus changed somewhere else, so the newest copy is shown."}:a==="no_record"?o={kind:"warn",text:`Not restored. Home Assistant no longer holds menus for this ${Q(this.device)}.`}:a==="not_found"?o={kind:"warn",text:"Not restored. That save is no longer kept."}:a==="unknown_command"?(this.historyState="unsupported",o={kind:"warn",text:"This version of the integration cannot restore menus. Update it to restore an earlier save."}):o={kind:"err",text:`Could not restore: ${We(r)}`}}finally{this.restoring=!1,this.restoreAsk===s&&this.closeAsk()}i===this.watchId&&(this.note=o,this.load(i,!0))}render(){let e=this.watches,i=this.draft;return c`
      <div class="pe-top">
        ${this.renderTopBar(i,e)}
        ${this.note?c`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:p}
      </div>
      ${this.renderBody(e)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):p}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=Io}renderTopBar(e,i){let s=e!==void 0&&!this.unsupported,o=s&&this.dirty,r=this.shellOwnsWatch;return c`<div class="wa-bar ${this.stacked?"stacked":""}" role="toolbar" aria-label="Watch menus">
      ${this.haMenu?c`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${S("menu")}</button>`:p}
      ${r?p:c`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():Ms(void 0,!1)}>${S("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${r?p:this.renderWatchPicker(i)}
      ${this.renderSyncPill(s?e:void 0)}
      ${this.renderTopMenu(s?e:void 0)}
      ${s?c`<button class="primary save ${o?"dirty":""}" ?disabled=${!o||this.saving}
          title=${o?`Save (${Xt}S). A save reaches the ${Q(this.device)} the next time it checks.`:`Nothing to save (${Xt}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        <span class="tb-saved" title=${o?"Unsaved changes":""}>${jn(this.record,void 0,this.device)}</span>`:p}
      ${r?p:c`<button class="tb-btn tb-pages" title="The watch's pages, as Home Assistant keeps them"
        @click=${()=>this.onPages?this.onPages():Ps(void 0)}>${S("pages")}<span>Pages</span></button>`}
      ${this.barActions}
      <button class="help" title="Help: the quick menu editor" aria-label="Help"
        @click=${()=>window.open(Ts,"_blank","noopener")}>?</button>
    </div>`}renderSyncPill(e){let i=this.record;if(i===void 0||i.revision<=0||this.unsupported)return p;let s=e===void 0?{size:0,limit:1}:ot(e.document),o=Ye({record:i,size:s.size,limit:s.limit,noun:"menus",historyState:this.historyState,device:this.device});return c`<span class="tb-sync ${o.tone==="ok"?"ok":"warn"}" title=${`${o.state}. ${o.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${o.state}</span>
    </span>`}noRecordState(e=this.watches){return Pn(e.find(i=>i.owner_watch_id===this.watchId))}canStart(){let e=this.record;return this.watchId!==void 0&&e!==void 0&&e.revision<=0&&!this.unsupported}renderTopMenu(e){let i=this.canStart();if(e===void 0&&!i)return p;let s=this.topMenuOpen,o=r=>()=>{this.topMenuOpen=!1,r()};return c`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${s?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!s}}>···</button>
      ${s?c`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${e?c`<button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title="Go back to the copy Home Assistant holds. Undo brings the edits back."
          @click=${o(()=>this.discard())}>Discard edits</button>`:p}
        ${i?c`<button class="row" role="menuitem" ?disabled=${this.starting}
          @click=${o(()=>{qe(this.noRecordState())&&this.startWithDefaults()})}>${this.noRecordState()==="wait"?Ue:St}</button>`:p}
      </div>`:p}
    </span>`}personColor(e){let i=Un(this.owners.length>0?this.owners:this.ownList??[]);return qn(i.findIndex(s=>s.owners.some(o=>o.owner_watch_id===e)))}renderWatchPicker(e){if(e.length<2)return p;let i=e.find(r=>r.owner_watch_id===this.watchId),s=this.watchMenuOpen,o=r=>{let a=r===void 0?void 0:this.personColor(r);return c`<span class="pe-chip-glyph" style=${a?`--pe-person: ${a}`:p} aria-hidden="true">${S("watch")}</span>`};return c`<span class="picker me-watch-picker">
      <button type="button" class="tb-browse me-watch-btn" aria-haspopup="menu" aria-expanded=${s?"true":"false"}
        title="Choose the watch whose menus are shown" @click=${()=>{this.watchMenuOpen=!s}}>
        ${o(i?.owner_watch_id)}<span class="tb-browse-l">${i?ge(i,e):"Choose a watch"}</span>
        <span class="me-caret" aria-hidden="true">${S("chevron")}</span>
      </button>
      ${s?c`<div class="pop-menu me-watch-menu" role="menu" aria-label="Watches">
        ${e.map(r=>{let a=r.owner_watch_id===this.watchId;return c`<button type="button" class="row me-watch-row" role="menuitemradio" aria-checked=${a?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,a||this.openWatch(r.owner_watch_id)}}>
            ${o(r.owner_watch_id)}<span class="me-watch-name">${ge(r,e)}</span>
            <span class="me-watch-check" aria-hidden="true">${a?S("check"):p}</span>
          </button>`})}
      </div>`:p}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=Io?this.columns:Cn(this.hostWidth-Br,this.columns,Qt)}renderGutter(e){return c`<div class="gutter ${e}" role="separator" aria-orientation="vertical"
      aria-label=${e==="left"?"Resize the menus and slots column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>{let s=this.fittedColumns();En(i,{side:e,base:e==="left"?s.left:s.right,limits:Qt,onWidth:o=>{this.columns={...this.columns,[e]:o}},onEnd:()=>Fe(tn,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[e]:en[e]},Fe(tn,this.columns)}}></div>`}get stageScale(){return this.zoom??Qe(this.narrow||this.stacked)}setZoom(e){this.zoom=e,uo(e)}renderStage(e,i){let s=i.find(h=>h.owner_watch_id===this.watchId),o=ze(s?.screen_size),r=o??Be,a=e.phone===void 0?r.label:e.phone.model.label,d=[...Ro(e),a],u=this.undoDraft,l=Kt(C(e));return c`<div class="card canvas-card me-canvas" aria-label="Menu">
      <div class="cv-head">
        <span class="cv-title" title=${l}>${l}</span>
        ${s!==void 0?c`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${ge(s,i)}</span></span>`:p}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${e.phone!==void 0?Mt:o===void 0?`${r.label}, this watch's size is not known`:d.join(" \xB7 ")}><span class="fam">${d.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!u?.canUndo} title=${`Undo (${Xt}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${S("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!u?.canRedo} title=${No?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${S("redo")}</button>
        </span>
      </div>
      <div class="stage-area me-stage-area">
        ${this.renderStageTools(a,e.phone!==void 0)}
        <div class="me-stage-body">${Po(e)}</div>
        <div class="under"><span class="tail">${_o(e)}</span></div>
      </div>
    </div>`}renderStageTools(e,i=!1){let s=this.stageScale,o=Qe(this.narrow||this.stacked),r=a=>si(i?a*Tt:a);return c`<div class="stage-tools" role="toolbar" aria-label="Stage tools">
      <button class="tb me-case" aria-disabled="true" tabindex="-1" title=${i?Mt:`This watch's screen, ${e}.`}>
        ${S(i?"phone":"watch")}<span class="word keep">${e}</span></button>
      <span class="tb-sep" aria-hidden="true"></span>
      <span class="tb-zoom" role="group" aria-label="Zoom">
        <button class="tb icon me-zoom-out" ?disabled=${s<=tt(s)} aria-label="Zoom out" title="Zoom out"
          @click=${()=>this.setZoom(tt(s))}>−</button>
        <button class="tb pct" aria-label=${`Zoom ${r(s)}. Back to fit`}
          title=${`The ${i?"iPhone":"watch"} at ${r(s)} of its own points. Click to fit it again (${r(o)}).`}
          @click=${()=>this.setZoom(void 0)}>${r(s)}</button>
        <button class="tb icon me-zoom-in" ?disabled=${s>=et(s)} aria-label="Zoom in" title="Zoom in"
          @click=${()=>this.setZoom(et(s))}>+</button>
      </span>
    </div>`}renderBody(e){if(e.length===0){let d=this.owners.length===0&&this.ownList===void 0;return c`<div class="pe-empty">${d?"Loading\u2026":"No watch has connected to this Home Assistant yet."}</div>`}if(this.unsupported)return c`<div class="pe-empty"><b>${Fi}</b></div>`;if(this.loading)return c`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let d=this.watchId;return c`<div class="pe-empty">
        <span>Could not read this ${Q(this.device)}'s menus: ${this.loadError}</span>
        ${d===void 0?p:c`<button class="pe-btn" @click=${()=>{this.load(d)}}>Try again</button>`}
      </div>`}let i=this.record;if(i===void 0)return c`<div class="pe-empty">Loading…</div>`;let s=this.draft,o=this.viewHost();if(i.revision<=0||s===void 0||o===void 0){let d=this.watchId===void 0?void 0:J(this.watchId),u=this.watchId,l=this.noRecordState(e);return c`<div class="pe-empty"><b>${me("menus",this.device)}</b><span>${Rn(l,Ui)}</span>
        ${l==="wait"?c`<button class="link start-fresh" ?disabled=${this.starting} @click=${()=>{qe(l)&&this.startWithDefaults()}}>${this.starting?"Starting\u2026":Ue}</button>`:c`<button class="pe-btn pe-primary" ?disabled=${this.starting} @click=${()=>{this.startWithDefaults()}}>${this.starting?"Starting\u2026":St}</button>`}
        ${d?.dirty&&u!==void 0?c`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when menus are here again.</span>
          <button class="pe-btn" @click=${()=>{_e(u),this.requestUpdate()}}>Discard the kept edits</button>`:p}
      </div>`}let r=this.fittedColumns(),a=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"";return c`<div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${r.left}px;--wa-right:${r.right}px;${a}`}>
      <div class="column left">
        ${ko(o)}
        ${Mo(o)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(o,e)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${Do(o)}
      </div>
    </div>
    ${this.renderFoot(i,s.document,s.dirty)}`}renderFoot(e,i,s){let o=ot(i),r=Ye({record:e,size:o.size,limit:o.limit,noun:"menus",historyState:this.historyState,device:this.device}),a=this.watchId;return c`${Kn({status:r,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?Bn({noun:"menus",device:this.device,record:e,entries:this.history,historyState:this.historyState,dirty:s,restoring:this.restoring,onRetry:()=>{a!==void 0&&(this.historyState="loading",this.loadHistory(a))},onRestore:d=>{this.historyOpen=!1,this.askRestore(d)},onClosed:()=>{this.historyOpen=!1}}):p}
    ${this.rawOpen?zn({noun:"menus",document:i,revision:e.revision,dirty:s,copied:this.rawCopied,onCopy:d=>{Yn(d).then(u=>{this.rawCopied=u})},onClosed:()=>{this.rawOpen=!1}}):p}`}renderRestoreAsk(e){let i=this.record,s=Jr(e.entry.updated_at);return c`<dialog class="pe-ask" aria-labelledby="me-ask-title"
      @cancel=${o=>{this.restoring&&o.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="me-ask-title">Restore revision ${e.entry.revision}?</h3>
      <p>${Mn(e.entry.updated_by,this.device)}${s?` ${s}`:""}, ${zr(e.entry.size)}.</p>
      ${e.summary?c`<p class="pe-muted">${e.summary}</p>`:p}
      <p>It is saved again as a new revision${i?`, after revision ${i.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[Sn,pn,fn,mn,gn,wn,vn,yn,oi,hs,pe`
    /* A column, so the foot bar (config-foot.ts) can take the space left
       at the foot of a short editor; --cf-pad is the padding it reaches
       through to sit edge to edge. */
    :host {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      container-type: inline-size;
      --cf-pad: 16px;
      padding: var(--cf-pad);
      /* A field brought into view lands under the sticky top. */
      scroll-padding-top: var(--pe-top-h, 0px);
      color: var(--wa-ink);
      background: var(--wa-bg);
      font-size: 14px;
    }
    * { box-sizing: border-box; }
    svg.ui-icon { width: 14px; height: 14px; display: block; flex: none; }
    h2, h3, h4, p { margin: 0; }

    /* The top bar, and a note under it while there is one, stay at the top
       of the editor, as in the page editor: one block, sticky to the host's
       top edge and edge to edge as the foot bar is at the bottom, on the
       host's own background so the editor scrolls under it. Above the cards
       and their menus; the dialogs are modal, in the top layer, above it.
       Its measured height is --pe-top-h on the host (measureTop), which the
       sticky side columns stand under. */
    .pe-top {
      flex: none; display: flex; flex-direction: column;
      position: sticky; top: calc(-1 * var(--cf-pad, 16px)); z-index: 7;
      margin: calc(-1 * var(--cf-pad, 16px)) calc(-1 * var(--cf-pad, 16px)) 0;
      padding: 0 0 10px;
      background: var(--wa-bg);
    }
    h3 { font-size: 13px; font-weight: 650; text-transform: uppercase; letter-spacing: .04em; color: var(--wa-muted); }
    /* The browser's own monospace, not the shared sheet's family. */
    code { font-family: monospace; font-size: 12px; overflow-wrap: anywhere; }
    .pe-muted { color: var(--wa-muted); font-size: 13px; }
    .pe-warn { color: var(--wa-amber); font-size: 13px; font-weight: 600; }

    /* The bar's buttons with a glyph and words (the way back, Pages, the
       panel's Watch settings) on one line, as the panel's own bar draws them. */
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

    /* The complication editor's three columns (editor-chrome.ts), laid out
       as the page editor lays them: the editor scrolls as a whole, the stage
       with it, and the side widths come in as custom properties already
       fitted to the measured host width (fitColumnWidths). */
    .layout.pe-layout {
      flex: none; min-height: auto; overflow: visible; align-items: start; padding: 0;
      /* The room above the foot bar. */
      margin-bottom: 14px;
    }
    /* The Menus and Slots cards and the inspector stay in view while the
       editor scrolls: each sticks just under the sticky top block (the
       host's scroll box, inside its padding, starts --cf-pad down; the block
       reaches --pe-top-h down from the edge) and, when taller than the room
       left, scrolls on its own. --pe-view-h is the host's measured content
       height, less what the top block covers past the padding, what the foot
       bar covers and a little air. */
    .pe-layout > .column.left, .pe-layout > .column.inspector {
      --pe-under-top: max(0px, calc(var(--pe-top-h, 0px) - var(--cf-pad, 16px)));
      position: sticky; top: var(--pe-under-top);
      max-height: calc(var(--pe-view-h, calc(100dvh - 120px)) - 30px - var(--pe-under-top));
      overflow-y: auto; overflow-x: hidden;
    }
    .pe-layout > .column.left { display: flex; flex-direction: column; gap: 8px; scrollbar-gutter: auto; }
    .pe-layout > .column.left > .card { flex: none; }
    .pe-layout > .column.canvas { overflow: visible; min-height: auto; }
    /* One column under 820px, the complication editor's order: the menu on
       the watch, the settings, then the lists. */
    @container (max-width: 820px) {
      .layout.pe-layout { grid-template-columns: minmax(0, 1fr); }
      .pe-layout > .gutter { display: none; }
      .pe-layout > .column { grid-column: auto; position: static; max-height: none; overflow: visible; }
      .pe-layout > .column.canvas { order: 1; }
      .pe-layout > .column.inspector { order: 2; }
      .pe-layout > .column.left { order: 3; }
    }

    /* The canvas card: the head, the dotted stage and its tool strip. The
       stage is the watch at a set scale, not a fitted box: it grows with
       the zoom and the editor scrolls. */
    .column.canvas > .card.canvas-card.me-canvas { min-height: 0; flex: none; }
    /* The shown menu's name: read, not typed. */
    .cv-head .cv-title { flex: 0 1 auto; min-width: 0; font-size: 14px; font-weight: 600; letter-spacing: -.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    /* The shown watch's name in the head: a fact; the picker is in the bar. */
    .cv-head .cv-watch { min-width: 0; font-size: 12.5px; font-weight: 500; color: var(--wa-ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    /* The watch picker, the complication editor's Browse picker: its glyph
       in the watch's person color, the name, a caret; the menu lists every
       watch with a check on the shown one. */
    .pe-chip-glyph { display: inline-flex; flex: none; color: var(--pe-person, var(--wa-muted)); }
    .pe-chip-glyph svg.ui-icon { width: 13px; height: 13px; }
    .picker > button.me-watch-btn { max-width: 260px; }
    .me-watch-btn .tb-browse-l { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .me-watch-btn .me-caret { display: inline-flex; flex: none; color: var(--wa-muted); }
    .picker > button.me-watch-btn .me-caret svg { width: 11px; height: 11px; }
    .pop-menu.me-watch-menu { left: 0; right: auto; min-width: 220px; }
    .me-watch-menu .row.me-watch-row { display: flex; align-items: center; gap: 8px; }
    .me-watch-row .me-watch-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
    .me-watch-row[aria-checked="true"] { font-weight: 700; }
    .me-watch-check { display: inline-flex; flex: none; width: 14px; color: var(--wa-accent); }
    .me-watch-check svg.ui-icon { width: 14px; height: 14px; }
    .me-stage-area { position: relative; padding: 64px 12px 12px; gap: 10px; }
    @container (max-width: 460px) {
      .me-stage-area { padding-top: 92px; }
    }
    /* The picture keeps its size and the stage scrolls sideways under it on
       a screen narrower than the watch drawn at this scale. */
    .me-stage-body { display: flex; justify-content: center; padding: 0 4px 4px; overflow-x: auto; overflow-y: hidden; }
    .me-stage-area > .under {
      display: flex; flex-direction: column; gap: 4px; align-self: center; max-width: 460px; text-align: center;
      font-size: 11.5px; font-weight: 400; line-height: 15px; color: var(--wa-hint, var(--wa-muted));
    }
    /* The watch's size is a fact, not a menu. */
    .stage-tools button.tb.me-case { cursor: default; }
    .stage-tools button.tb.me-case:hover { background: transparent; }
    .stage-tools button.tb.me-case > svg.ui-icon { width: 14px; height: 14px; }

    .pe-badge {
      display: inline-block; padding: 1px 7px; border-radius: 999px; font-size: 11px; font-weight: 600;
      color: var(--wa-muted); background: var(--wa-field); white-space: nowrap;
    }

    /* The earlier saves, in the foot bar's History dialog. */
    .pe-history { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
    .pe-history > li { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-top: 1px solid var(--wa-line); }
    .pe-history > li:first-child { border-top: 0; }
    .pe-history > li.offer .pe-h-text > b { color: var(--wa-accent); }
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
    /* Not "primary" and "danger": the shared sheet's button.primary and
       button.danger outrank .pe-btn and would restyle these. */
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
  `,Ho,Zn]}};v([M({attribute:!1})],g.prototype,"hass",2),v([M({attribute:!1})],g.prototype,"owners",2),v([M({attribute:!1})],g.prototype,"ownerId",2),v([M({type:Boolean,reflect:!0})],g.prototype,"narrow",2),v([M({attribute:!1})],g.prototype,"icons",2),v([M({attribute:!1})],g.prototype,"iconsTick",2),v([M({attribute:!1})],g.prototype,"haMenu",2),v([M({attribute:!1})],g.prototype,"onHaMenu",2),v([M({attribute:!1})],g.prototype,"onBack",2),v([M({attribute:!1})],g.prototype,"onPages",2),v([M({attribute:!1})],g.prototype,"barActions",2),v([M({attribute:!1})],g.prototype,"shellOwnsWatch",2),v([M({attribute:!1})],g.prototype,"phones",2),v([b()],g.prototype,"watchId",2),v([b()],g.prototype,"record",2),v([b()],g.prototype,"unsupported",2),v([b()],g.prototype,"catalog",2),v([b()],g.prototype,"statusPages",2),v([b()],g.prototype,"httpLibrary",2),v([b()],g.prototype,"pagesRecord",2),v([b()],g.prototype,"behavior",2),v([b()],g.prototype,"voiceDocument",2),v([b()],g.prototype,"loading",2),v([b()],g.prototype,"loadError",2),v([b()],g.prototype,"history",2),v([b()],g.prototype,"historyState",2),v([b()],g.prototype,"note",2),v([b()],g.prototype,"restoreAsk",2),v([b()],g.prototype,"restoring",2),v([b()],g.prototype,"starting",2),v([b()],g.prototype,"historyOpen",2),v([b()],g.prototype,"rawOpen",2),v([b()],g.prototype,"rawCopied",2),v([b()],g.prototype,"ownList",2),v([b()],g.prototype,"topMenuOpen",2),v([b()],g.prototype,"watchMenuOpen",2),v([b()],g.prototype,"zoom",2),v([b()],g.prototype,"columns",2),v([b()],g.prototype,"hostWidth",2),v([b()],g.prototype,"hostHeight",2);customElements.get("wa-menu-editor")||customElements.define("wa-menu-editor",g);export{tn as ME_COLUMNS_KEY,Ao as WATCH_SWITCHER_COLORS,Xr as WATCH_SWITCHER_LEFT_OUT_COLOR,g as WaMenuEditor,Qr as joinSaveNotes,Gr as watchMenuPageTargets,ea as watchMenusSummary,Rc as watchSwitcherPages,nn as watchSwitcherRows};
