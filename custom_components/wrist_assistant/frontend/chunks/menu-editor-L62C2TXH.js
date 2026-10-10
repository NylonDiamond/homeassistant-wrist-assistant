import{a as Te,g as Pe,h as Tt}from"./chunk-WWYNONKG.js";import{$a as ye,$c as Bs,Ac as Ds,Bc as Es,Cc as Hs,Cf as ai,Db as Ms,Dc as ke,Df as ci,Ec as Os,Ef as di,Fc as xe,Gc as Is,Hc as H,Ic as P,Jc as $e,Kc as Me,Lc as z,Mc as ut,Na as ms,Nc as As,Oa as st,Oc as Ws,Pa as gs,Pc as lt,Qa as ws,Qc as Ls,Ra as vs,Rc as Ns,Sa as ys,Sc as Vs,Tc as ht,Uc as Us,Vc as qs,Wc as pt,Xc as ft,Yc as js,Zc as Fs,_c as Ks,ab as bs,ad as mt,b as ds,bb as Ss,bd as gt,c as us,cd as zs,cg as pi,d as ls,db as it,dd as wt,dg as fi,ed as Js,eg as Mt,fd as vt,fg as mi,gb as ks,gd as Ys,hd as de,ib as xs,id as Zs,j as hs,jb as $s,jc as ot,jd as Gs,kc as Ts,kd as yt,lc as be,ld as bt,m as ps,mc as rt,md as St,nc as at,nd as kt,o as nt,od as Xs,p as fs,pc as ct,pd as Qs,qc as Ps,qd as ei,rc as K,rd as ti,sc as B,sd as ni,tc as Rs,td as si,uc as k,ud as xt,vc as ce,vd as ii,wc as Cs,wd as oi,xc as Se,xd as ri,yc as _s,zc as dt}from"./chunk-NSZKA5YF.js";import{Ib as ui,Jb as li,Kb as hi,Mb as $t,sa as cs}from"./chunk-SPTWL6XW.js";import{f as tt}from"./chunk-RZRTGY27.js";import{A as os,B as rs,o as Qn,p as Xe,q as ae,r as Qe,s as et,w as es,x as ts,y as ss,z as is}from"./chunk-VHJ4NLHF.js";import{b as Tn,c as qe,d as Pn,e as je,f as Rn,h as T,i as ns}from"./chunk-QVYMVUW6.js";import{b as as}from"./chunk-RZ3T5CX4.js";import{a as Je,b as Nn,c as Vn,d as Un,e as qn,f as jn,g as Fn,h as Kn,i as Bn}from"./chunk-MQ3V6EGH.js";import{b as Wn,p as Ln}from"./chunk-ZXZUTH4S.js";import{a as zn,b as Jn,d as Yn,o as E,q as Ye,r as Zn,s as ve,t as Ze,u as Gn,v as Ge,w as Xn}from"./chunk-43HRUTRJ.js";import{$ as $n,$a as Mn,De as gi,Eb as Be,Ed as ze,Ee as wi,Fe as vi,Gd as we,Ge as yi,I as Sn,Nf as bi,S as kn,V as me,Y as xn,Yb as Cn,_ as Ve,aa as Ue,bb as Fe,fd as _n,gd as Dn,h as dn,hd as En,od as Hn,pd as On,qd as In,rd as An,sd as I,td as F,ud as ge,wd as C,xd as re,zb as Ke}from"./chunk-4KCC7LGW.js";import{Ag as fe,Ah as yn,Bg as sn,Bh as L,Cg as on,Ch as bn,Dg as rn,Eg as an,Fg as cn,b as pe,c,cg as nn,d as en,dh as W,eh as S,f as p,i as tn,ih as un,j as M,k as b,kh as ln,lh as hn,mh as pn,nh as fn,oh as mn,ph as gn,qh as wn,yg as D,zh as vn}from"./chunk-CQXHQEN6.js";import{a as v}from"./chunk-LO2NM3CE.js";function Pt(t,n){return t!=null&&Object.hasOwn(t,n)?t[n]:void 0}function Si(t,n,e){return be.filter(s=>{let i=Pt(t,s),o=Pt(n,s),r=Pt(e,s),a=d=>t==null||!T(d,i);return a(o)&&a(r)&&!T(o,r)})}function ki(t,n,e){return ns(t,n,e)}var xi=100,Do=3,Rt=class{constructor(n,e){this._undo=[];this._redo=[];this._replaced=[];this._base=n,this._revision=e,this._document=n}get base(){return this._base}get revision(){return this._revision}get document(){return this._document}get canUndo(){return this._undo.length>0}get canRedo(){return this._redo.length>0}get replaced(){return this._replaced}get dirty(){let n=this._dirty;if(n!==void 0&&n.document===this._document&&n.base===this._base)return n.value;let e=this._document!==this._base&&!T(this._document,this._base);return this._dirty={document:this._document,base:this._base,value:e},e}apply(n,e){if(n===this._document||T(n,this._document))return(e===void 0||e!==this._coalesceKey)&&(this._coalesceKey=void 0),!1;if(e!==void 0&&e===this._coalesceKey&&this._undo.length>0){let s=this._undo[this._undo.length-1];return T(n,s)?(this._undo.pop(),this._document=s,this._coalesceKey=void 0):this._document=n,this._redo=[],!0}return this.pushUndo(this._document),this._redo=[],this._document=n,this._coalesceKey=e,!0}amend(n){return this._coalesceKey=void 0,n===this._document||T(n,this._document)?!1:(this._document=n,!0)}endCoalesce(){this._coalesceKey=void 0}undo(){this._coalesceKey=void 0;let n=this._undo.pop();return n===void 0?!1:(this._redo.push(this._document),this._document=n,!0)}redo(){this._coalesceKey=void 0;let n=this._redo.pop();return n===void 0?!1:(this.pushUndo(this._document),this._document=n,!0)}discard(){return this._coalesceKey=void 0,this.apply(this._base)}rebase(n,e){return e<this._revision?(this._replaced=[],!1):this.mergeOnto(n,e)}restart(n,e){return this.mergeOnto(n,e)}mergeOnto(n,e){this._coalesceKey=void 0;let s=this._base;this._replaced=this._document===s?[]:Si(s,this._document,n);let i=new Map,o=h=>{let f=i.get(h);if(f!==void 0)return f;let y=h===s?n:ki(s,h,n);return y!==n&&T(y,n)&&(y=n),i.set(h,y),y},r=this._document,a=[...this._undo,this._document,...this._redo.slice().reverse()].map(o),d=this._undo.length,u=[],l=0;return a.forEach((h,f)=>{let y=u[u.length-1];y!==void 0&&(y===h||T(y,h))?f===d&&(u[u.length-1]=h):u.push(h),f===d&&(l=u.length-1)}),this._undo=u.slice(0,l),this._document=u[l],this._redo=u.slice(l+1).reverse(),this._base=n,this._revision=e,this._document!==r&&!T(this._document,r)}saved(n,e){e<this._revision||(this._coalesceKey=void 0,this._base=n,this._revision=e)}get saving(){return ue.has(this)}get saveDone(){return ue.get(this)}pushUndo(n){this._undo.push(n),this._undo.length>xi&&this._undo.splice(0,this._undo.length-xi)}},ue=new WeakMap;function $i(t,n){if(ue.has(t))return Promise.resolve({ok:!1,revision:t.revision,merged:!1,code:"busy",message:"These menus are being saved already."});let e=Eo(t,n).finally(()=>ue.delete(t));return ue.set(t,e),e}async function Eo(t,n){let e=!1,s=new Set,i=()=>{let r=be.filter(a=>s.has(a));return r.length===0?{}:{replaced:r}},o=(r,a,d)=>({ok:!1,revision:t.revision,merged:e,code:r,message:a,...d===void 0?{}:{problems:d}});for(let r=1;;r++){let a=n.prepare?.(t.document);a!==void 0&&a!==t.document&&t.amend(a);let d=t.document,u=ti(d);if(u.length>0)return o("invalid",u.join(" "),u);let l;try{({revision:l}=await n.save(t.revision,d))}catch(h){let{code:f="unknown",message:y}=L(h);if(f!=="conflict"||r>=Do)return o(f,y);let m;try{m=await n.fetch()}catch(w){let x=L(w);return o(x.code??"unknown",x.message)}if(!E(m)||!(m.revision>0)||!E(m.document))return o("no_record","Home Assistant holds no menus for this watch.");m.revision<t.revision?t.restart(m.document,m.revision):t.rebase(m.document,m.revision);for(let w of t.replaced)s.add(w);if(e=!0,!t.dirty)return{ok:!0,revision:t.revision,merged:e,alreadySaved:!0};continue}return t.saved(d,l),{ok:!0,revision:t.revision,merged:e,...i()}}}async function Mi(t){try{let{revision:n}=await t(0,Ts());return{ok:!0,revision:n}}catch(n){let{code:e,message:s}=L(n);return e==="no_record"||e==="conflict"?{ok:!1,code:e,message:s}:e==="unknown_command"?{ok:!1,code:"unsupported",message:s}:{ok:!1,code:"error",message:s}}}var Q=new Map;function J(t){return Q.get(t)}function Ti(t,n,e){let s=Q.get(t);if(s!==void 0&&e<=0)return{draft:s,mergedIntoEdits:!1,replaced:[]};if(s===void 0||e<s.revision&&!s.dirty){let r=new Rt(n,e);return Q.set(t,r),{draft:r,mergedIntoEdits:!1,replaced:[]}}if(e===s.revision)return{draft:s,mergedIntoEdits:!1,replaced:[]};let i=s.dirty,o=e<s.revision?s.restart(n,e):s.rebase(n,e);return{draft:s,mergedIntoEdits:i&&o,replaced:i?s.replaced:[]}}function Re(t){Q.delete(t)}function Pi(){for(let t of Q.values())if(t.dirty)return!0;return!1}function Ri(){Q.clear()}var Dt="In the page switcher",Ho=["switcherIcon","switcherColor","switcherText","switcherDisplayMode","hideFromSwitcher"],Et="switcher-settings",Ci=`${Et}:resetDot`;function _i(t){return bs(t,Ho,n=>{let e=ye(n);return[e.switcherIcon,e.switcherColor,e.switcherText,e.switcherDisplayMode??"text",e.hideFromSwitcher]})}function Di(t){let n=ye(t);return n.hideFromSwitcher?"Hidden":n.switcherText??(n.switcherDisplayMode==="icon"?"Icon":"Shown")}function Ht(t,n){return`${Et}:typed:${t.pageId.toUpperCase()}:${n}`}function Ct(t,n){let e=t.uiState.get(Ht(t,n));return typeof e=="string"?e:void 0}function Oo(){if(typeof document>"u")return null;let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t}function Io(t){let n=Oo(),e=typeof HTMLElement<"u"&&n instanceof HTMLElement?n.closest("[data-sw-field]")?.dataset.swField:void 0;for(let s of[...t.uiState.keys()])s.startsWith(`${Et}:typed:`)&&(e===void 0||s!==Ht(t,e))&&t.uiState.delete(s)}function ee(t,n,e=!1){let s=t.uiState.delete(Ci);t.busy||t.edit(n,e&&!s?{typing:!0}:void 0)}function _t(t,n,e){let s=Ht(t,n),i=a=>typeof HTMLInputElement<"u"&&a instanceof HTMLInputElement&&a.type==="text"&&!a.closest(".alpha");return c`<div class="ts-typing" data-sw-field=${n}
    @input=${{capture:!0,handleEvent:a=>{i(a.target)&&t.uiState.set(s,a.target.value)}}}
    @click=${{capture:!0,handleEvent:a=>{!(a.target instanceof Element)||a.target.closest(".reset-dot")===null||(t.endCoalesce(),t.uiState.set(Ci,!0))}}}
    @change=${a=>{let d=a.target;typeof HTMLInputElement>"u"||!(d instanceof HTMLInputElement)||(d.type==="color"&&t.endCoalesce(),d.type==="checkbox"&&(t.uiState.delete(s),t.endCoalesce(),t.requestUpdate()))}}
    @focusout=${a=>{!i(a.target)||a.relatedTarget instanceof Node&&a.currentTarget.contains(a.relatedTarget)||(t.uiState.delete(s),t.endCoalesce(),t.requestUpdate())}}>${e}</div>`}function Ei(t){Io(t);let n=t.page,e=ye(n),s=e.switcherDisplayMode??"text",i=ms.map(d=>[d,d==="icon"?"Icon":"Name"]),o=typeof n.name=="string"?n.name:"",r=d=>ee(t,u=>st(u,t.pageId,d),!0),a=d=>ee(t,u=>gs(u,t.pageId,d),!0);return c`
    ${C("Hidden",e.hideFromSwitcher,d=>ee(t,u=>ys(u,t.pageId,d)),!1)}
    ${e.hideFromSwitcher?c`<div class="hint ts-under">The page stays on the watch. Only the switcher leaves it out.</div>`:p}
    ${F("Show as",i.some(([d])=>d===s)?s:"text",i,d=>ee(t,u=>vs(u,t.pageId,d)))}
    ${_t(t,"switcherText",In("Name",Ct(t,"switcherText")??e.switcherText??"",d=>ee(t,u=>ws(u,t.pageId,d),!0),{placeholder:o}))}
    <div class="ts-chips" role="group" aria-label="Switcher icon">
      <button type="button" class="pe-chip ${e.switcherIcon===void 0?"on":""}" aria-pressed=${e.switcherIcon===void 0?"true":"false"}
        title="The watch picks one from the page's first tile" @click=${()=>ee(t,d=>st(d,t.pageId,""))}>Automatic icon</button>
    </div>
    ${_t(t,"switcherIcon",we({icons:t.icons,symbols:t.symbols},Ct(t,"switcherIcon")??e.switcherIcon??"",r,"sw:switcher-icon",void 0,"Icon",!1))}
    ${_t(t,"switcherColor",c`<div class="ts-no-alpha">${re("Color",Ct(t,"switcherColor")??e.switcherColor,a,!0,null,{switchOn:e.switcherColor!==void 0})}</div>`)}
    <div class="hint ts-under">Left empty, the watch shows the page's name and picks the icon and color itself.</div>`}var N=Te.routing;function Ot(t){return N.actions.find(n=>n.action===t)}function V(t){return Ot(t)?.keys??[]}function O(t){return Object.hasOwn(N.keys,t)?N.keys[t]:void 0}function ne(t){return E(t.voiceConfig)?t.voiceConfig:{}}function Ao(t,n){let e=N.legacy[`${t}.${n}`];return e===void 0?n:/reads as (\w+)/.exec(e)?.[1]??n}function U(t,n){let e=O(n);if(e===void 0)return;let s=Object.hasOwn(t,n)?t[n]:void 0;switch(e.type){case"enum":{let i=N.enums[e.enum??""]??[];return typeof s=="string"&&i.includes(s)?Ao(n,s):e.default}case"bool":return typeof s=="boolean"?s:e.default;case"int":{if(typeof s!="number"||!Number.isFinite(s))return e.default;let[i,o]=e.clamp??[-1/0,1/0];return Math.min(o,Math.max(i,Math.round(s)))}case"entity":return typeof s=="string"?s.trim():e.default;case"array":return Array.isArray(s)?s.filter(i=>typeof i=="string"):e.default}}function Oi(t,n){let e=O(n)?.shownWhen;if(e===void 0)return!0;let s=/^(\w+) is (not )?(.+)$/.exec(e.trim());if(s===null)return!0;let i=U(t,s[1]),o=s[3].split(/\s+or\s+/).map(a=>a.trim()),r=typeof i=="string"&&o.includes(i);return s[2]===void 0?r:!r}function Ce(t,n){let e=O(n);if(e?.type!=="enum")return[];let s=N.labels[e.enum??""]??{},i=N.offered[n]??N.enums[e.enum??""]??[],o=U(t,n);return(typeof o=="string"&&!i.includes(o)?[o,...i]:i).map(a=>[a,s[a]??a])}function Ii(t){return O(t)?.label??Wo[t]??t}var Wo={assistAutoSendOnPause:"Send When I Pause",broadcastImmediateListen:"Start Listening Immediately"};function It(t,n,e){let s=O(n);if(s===void 0)return t;let i;switch(s.type){case"enum":if(typeof e!="string"||!Ce(t,n).some(([r])=>r===e))return t;i=e;break;case"bool":if(typeof e!="boolean")return t;i=e;break;case"int":{if(typeof e!="number"||!Number.isFinite(e))return t;let[r,a]=s.clamp??[-1/0,1/0];i=Math.min(a,Math.max(r,Math.round(e)));break}case"entity":{if(e!==void 0&&typeof e!="string")return t;let r=(e??"").trim();if(r==="")return Tt(t,n);i=r;break}case"array":{if(!Array.isArray(e)||!e.every(a=>typeof a=="string"))return t;let r=[...new Set(e.map(a=>a.trim()).filter(a=>a!==""))];if(r.length===0)return Tt(t,n);i=r;break}}return(Object.hasOwn(t,n)?T(t[n],i):T(U(t,n),i))?t:Pe(t,n,i)}function Ai(t,n,e,s){let i=U(t,n),o=Array.isArray(i)?i:[];return s===o.includes(e)?t:It(t,n,s?[...o,e]:o.filter(r=>r!==e))}function Lo(t,n){switch(t.fallsBackTo){case"defaultAssistAgentId":return n?.agent;case"defaultTTSEngine":return n?.engine;case"defaultSpeakers":return n?.speakers;default:return}}function No(t,n){let e=O(n);if(e?.fallsBackTo===void 0)return!1;let s=e.fallsBackWhen;if(s===void 0)return!0;let i=n.startsWith("assist")?"assistReplyOutputMode":n.startsWith("speakMessage")?"speakMessageOutputMode":"broadcastTargetMode",o=U(t,i);return typeof o=="string"&&s.includes(o)}function At(t,n,e,s){let i=O(n);if(i===void 0)return"None";if(!No(t,n))return i.type==="array"?"None":"Not set";if(e===void 0)return"Default";let o=Lo(i,e);return typeof o=="string"&&o.trim()!==""?`Default (${s(o.trim())})`:Array.isArray(o)&&o.length>0?`Default (${o.map(s).join(", ")})`:i.fallsBackTo==="defaultAssistAgentId"?"Default (Home Assistant default)":"Default (Not set)"}function Hi(t){return Array.isArray(t)?t.filter(n=>typeof n=="string"):[]}function te(t,n){let e=n.toUpperCase();return t.some(s=>s.toUpperCase()===e)}function _e(t,n,e){let s=Hi(n),i=Hi(e);return t.filter(o=>!te(s,o)&&(i.length===0||te(i,o)))}function Vo(t,n){return{hiddenPhraseIds:t.filter(e=>!te(n,e)),knownPhraseIds:t.slice()}}function Wi(t,n,e,s){if(!te(n,e))return t;let i=_e(n,t.hiddenPhraseIds,t.knownPhraseIds);if(te(i,e)===s)return t;let o=s?n.filter(a=>te(i,a)||a.toUpperCase()===e.toUpperCase()):i.filter(a=>a.toUpperCase()!==e.toUpperCase()),r=Vo(n,o);return Pe(Pe(t,"hiddenPhraseIds",r.hiddenPhraseIds),"knownPhraseIds",r.knownPhraseIds)}function Li(t){if(t!==void 0)return{agent:t.defaultAssistAgentId,engine:t.defaultTTSEngine,speakers:t.defaultSpeakers??[]}}function Uo(t,n,e,s,i){return $e(t,n,e,o=>{if(!V(k(o)).includes(s))return o;let r=ne(o),a=It(r,s,i);return a===r?o:ct(o,"voiceConfig",a)})}function qo(t,n,e,s,i,o){return $e(t,n,e,r=>{if(!V(k(r)).includes(s))return r;let a=ne(r),d=Ai(a,s,i,o);return d===a?r:ct(r,"voiceConfig",d)})}function jo(t,n,e,s,i,o){return $e(t,n,e,r=>k(r)==="ttsMenu"?Wi(r,s,i,o):r)}function Ni(t){return Object.keys(ne(t)).some(n=>V(k(t)).includes(n))}function Vi(t){let n=k(t);return V(n).length>0||n==="ttsMenu"}function Ui(t,n){let e=t.states[n]?.attributes?.friendly_name;return typeof e=="string"&&e.trim()!==""?e:n}function Fo(t,n,e,s){let i=hi(t.hass.states),o=$t(i,e),r=a=>C(a.missing?`${a.entityId} (not found)`:a.name,e.includes(a.entityId),d=>s(a.entityId,d));return c`<div class="me-sub-h">${n}</div>
    <div class="me-voice-list" role="group" aria-label=${n}>
      ${o.length===0?c`<div class="hint">No media players in Home Assistant.</div>`:o.map(r)}
    </div>`}function Ko(t,n,e,s){let i=O(e),o=Li(t.voice?.defaults),r=i?.domain==="conversation"?ui(t.hass.states):li(t.hass.states,Object.keys(t.hass.services?.tts??{}),void 0),a=$t(r,s===""?[]:[s]);return[["",At(n,e,o,u=>a.find(l=>l.entityId===u&&!l.missing)?.name??Ui(t.hass,u))],...a.map(u=>[u.entityId,u.missing?`${u.entityId} (not found)`:u.name])]}function Bo(t,n,e,s,i){let o=O(i);if(o===void 0||!Oi(s,i))return p;let r=Ii(i),a=U(s,i),d=(u,l)=>t.edit(h=>Uo(h,n,e,i,u),l);switch(o.type){case"enum":return I(r,String(a),Ce(s,i),u=>d(u),{snapBack:!0,def:String(o.default)});case"bool":return C(r,a===!0,u=>d(u),o.default);case"int":{let u=typeof a=="number"?a:Number(o.default),l=Te.volume,[h,f]=o.clamp??[l.min,l.max];return c`${ge(r,u,y=>d(y,`slot:${e}:${i}`),{min:h,max:f,step:l.step,def:Number(o.default),format:y=>`${Math.round(y)}${l.unit}`})}
        <div class="ts-after">${l.presets.map(y=>c`<button type="button" class="pe-chip ${y.value===u?"on":""}"
          aria-pressed=${y.value===u?"true":"false"} @click=${()=>d(y.value)}>${y.label} ${y.value}%</button>`)}</div>`}case"entity":{let u=typeof a=="string"?a:"";return I(r,u,Ko(t,s,i,u),l=>d(l===""?void 0:l),{snapBack:!0})}case"array":{let u=Array.isArray(a)?a:[],l=Li(t.voice?.defaults),h=o.whenBlank!==void 0?`None picked: ${o.whenBlank}.`:o.fallsBackTo!==void 0?`None picked: ${At(s,i,l,f=>Ui(t.hass,f))}.`:"None picked.";return c`${Fo(t,r,u,(f,y)=>t.edit(m=>qo(m,n,e,i,f,y)))}
        <div class="hint ${u.length===0&&o.fallsBackTo===void 0&&o.whenBlank===void 0?"warn":""}">${u.length===0?h:`${u.length} picked.`}</div>`}}}function zo(t,n,e){let s=typeof e.id=="string"?e.id:"",i=ne(e),o=V(k(e));return c`${t.voice?.defaults===void 0?c`<div class="hint">${mi}.</div>`:p}
    ${o.map(r=>Bo(t,n,s,i,r))}`}function Jo(t,n,e){let s=typeof e.id=="string"?e.id:"",i=t.voice?.phrases;if(i===void 0)return c`<div class="hint">No voice settings from this watch yet. Start them in Voice to pick the phrases this slot shows.</div>`;if(i.length===0)return c`<div class="hint">No phrases yet. Add them in Voice.</div>`;let o=i.map(l=>l.id),r=_e(o,e.hiddenPhraseIds,e.knownPhraseIds),a=Array.isArray(e.knownPhraseIds)?e.knownPhraseIds.filter(l=>typeof l=="string"):[],d=a.length>0&&o.some(l=>!a.some(h=>h.toUpperCase()===l.toUpperCase())),u=l=>r.some(h=>h.toUpperCase()===l.toUpperCase());return c`<div class="me-sub-h">${Ot("ttsMenu")?.slotLabel??"Phrase List"}</div>
    <div class="me-voice-list" role="group" aria-label="Phrases this slot shows">
      ${i.map(l=>C(l.name,u(l.id),h=>t.edit(f=>jo(f,n,s,o,l.id,h))))}
    </div>
    <div class="hint">${r.length===0?"No phrase shows: the list on the watch is empty.":`${r.length} of ${i.length} show on the watch.`}</div>
    ${d?c`<div class="hint">A phrase added after this slot's list was set stays hidden here until it is ticked.</div>`:p}`}function qi(t,n,e){let s=k(e);if(s==="ttsMenu")return Jo(t,n,e);if(V(s).length>0)return zo(t,n,e)}function ji(t,n){let e=k(n);if(e==="ttsMenu"){let r=t.voice?.phrases;return r===void 0?"":`${_e(r.map(d=>d.id),n.hiddenPhraseIds,n.knownPhraseIds).length} of ${r.length} phrases`}let s=ne(n),i=V(e)[0];if(i===void 0)return"";let o=U(s,i);return Ce(s,i).find(([r])=>r===o)?.[1]??""}var Ji=[["anywhere","Anywhere menu"],["entity","Entity quick menu"],["switcher","Page switcher"]],Yi="Each page's icon, color and name are set here: pick a page in the Pages card.",Yo="Pick a page in the Pages card to set how it shows here.",Zi={anywhere:"Opens on any screen. Each place around the ring holds one slot.",entity:"Opens over a tile. Each type of entity has its own menu, and an entity can have a menu of its own.",switcher:Yi},Zo="The Anywhere menu, the Entity quick menu and the page switcher. A save reaches the watch the next time it checks.",Go="Tap a slot on the watch or in the list to edit it.",He=.36,Oe=44,Ie=22;function Xo(t,n){let e=Math.min(t.width,t.height),s=i=>Math.round(i*1e4)/1e4;return{x:s(.5+(n.x-.5)*e/t.width),y:s(.5+(n.y-.5)*e/t.height)}}function Gi(t,n,e=He){let s=(270-t*360/Math.max(1,n))*Math.PI/180,i=o=>Math.round(o*1e4)/1e4;return{x:i(.5+e*Math.cos(s)),y:i(.5+e*Math.sin(s))}}var Xi="wrist-assistant-panel.menus.zoom.v1";function Qi(t=qe()){try{let n=t?.getItem(Xi);if(n==null||n==="")return;let e=Number(n);return Qn.includes(e)?e:void 0}catch{return}}function eo(t,n=qe()){try{n?.setItem(Xi,t===void 0?"":String(t))}catch{}}var to={name:{color:W.place,icon:"text"},slot:{color:W.content,icon:"content"},look:{color:W.look,icon:"look"},menu:{color:W.content,icon:"content"},style:{color:W.look,icon:"look"},switcherPage:{color:W.content,icon:"watch"}},Qo="#26a69a",er=W.complication,q="menu-editor";function ie(t,n,e){return`${t} ${t===1?n:e}`}function j(t,n){let e=t.states[n]?.attributes?.friendly_name;return typeof e=="string"&&e.trim()!==""?e:n}function no(t,n){return{entityId:n,displayName:n===""?"":j(t,n),domain:Se(n)}}function De(t,n,e,s){return t.icons.render(n,e,s)??c`<span class="me-glyph-dot" style=${`background:${s}`}></span>`}function Z(t){return K(k(t))===void 0?{icon:ot.unknownActionIcon,color:ot.unknownActionColor}:{icon:typeof t.icon=="string"&&t.icon!==""?t.icon:"circle",color:typeof t.color=="string"?t.color:"#FFFFFF"}}function so(t){let n=k(t);if(n==="triggerEntity"){let s=ce(t).entityId;return Ds(Se(typeof s=="string"?s:""))}let e=K(n);return e===void 0?void 0:{icon:e.icon,color:e.color}}function $(t,n){return t.toUpperCase()===n.toUpperCase()}function tr(t,n){return t.toUpperCase()===n.toUpperCase()}function nr(t,n){let e=k(n),s=ce(n),i=K(e);for(let o of i?.payload??[]){let r=s[o.key];if(!(typeof r!="string"||r==="")){if(o.type==="entity")return j(t.hass,r);if(o.target==="page")return t.targets.pages.find(a=>$(a.id,r))?.name??"A page not in the pages";if(o.target==="statusPage")return t.targets.statusPages.find(a=>$(a.id,r))?.name??"A status page";if(o.target==="httpAction")return t.targets.httpActions.find(a=>$(a.id,r))?.name??"An HTTP action";if(o.target==="ttsPhrase"){let a=t.targets.phrases;return a?.find(d=>$(d.id,r))?.name??(a===void 0?"A phrase":"A phrase that is gone")}}}}function Vt(t,n){return nr(t,n)??B(k(n))}function io(t){return`${z(typeof t.position=="string"?t.position:"")} \xB7 ${B(k(t))}`}function sr(t){let n=Me(),e=s=>{let i=n.indexOf(typeof s.position=="string"?s.position:"");return i<0?n.length:i};return t.slice().sort((s,i)=>e(s)-e(i))}function Y(t){return ke(t)?.label??t}var oo="me:menu",ro="me:er:mode",ao="me:er:domain",Lt="me:er:entity",Wt="me:er:add";function _(t){let n=t.uiState.get(oo);return n==="entity"||n==="switcher"?n:"anywhere"}function ir(t,n){n!==_(t)&&t.uiState.delete(Ee),t.uiState.set(oo,n),t.requestUpdate()}var Ee="me:sw:page";function co(t){return t.switcherRows??t.switcherPages.map(n=>({...n,hidden:!1}))}function G(t){if(_(t)!=="switcher")return;let n=t.uiState.get(Ee);if(typeof n=="string")return co(t).find(e=>$(e.id,n))}function Ut(t,n){n===void 0?t.uiState.delete(Ee):t.uiState.set(Ee,n),t.requestUpdate()}function uo(t){let n=G(t);return n===void 0?void 0:t.switcherSettings?.(n.id)}function qt(t){return Ji.find(([n])=>n===t)?.[1]??t}function jt(t){return t.uiState.get(ro)==="entity"?"entity":"domain"}function Ft(t){let n=t.uiState.get(ao);return typeof n=="string"&&ke(n)!==void 0?n:"light"}function Kt(t){let n=de(t.document),e=t.uiState.get(Lt);return typeof e=="string"&&n.includes(e)?e:n[0]}function X(t){switch(_(t)){case"anywhere":return xe;case"entity":return lo(t);case"switcher":return}}function lo(t){if(jt(t)==="domain")return{list:"domain",domain:Ft(t)};let n=Kt(t);return n===void 0?void 0:{list:"entity",entityId:n}}function or(t,n){return n.list==="anywhere"?"Anywhere menu":n.list==="domain"?`${Y(n.domain)} menu`:`${j(t.hass,n.entityId)} menu`}function ho(t){return`me:sel:${Is(t)}`}function le(t,n){let e=t.uiState.get(ho(n));if(typeof e=="string")return H(t.document,n).find(s=>$(P(s),e))}function he(t,n,e){t.uiState.set(ho(n),e),t.requestUpdate()}function Bt(t){if(G(t)!==void 0)return Ut(t,void 0),!0;let n=X(t);return n===void 0||le(t,n)===void 0?!1:(he(t,n,void 0),!0)}function po(t,n,e){let s;t.edit(i=>{let o=Vs(i,n,{...e===void 0?{}:{position:e},targets:t.targets});return s=o.id,o.document}),s!==void 0&&he(t,n,s)}function Fi(t){let e=(s,i)=>Math.round((i+(s-.5)/He*8)*100)/100;return c`<span class="thumb me-ring-thumb" aria-hidden="true"><svg viewBox=${`0 0 ${Oe} ${Ie}`}>
    <circle cx="22" cy="11" r=${8} class="me-thumb-track"></circle>
    ${t.map(s=>en`<circle cx=${e(s.x,22)} cy=${e(s.y,11)} r="2.2" fill=${s.color}></circle>`)}
  </svg></span>`}function rr(t,n){return n===void 0?[]:H(t.document,n).flatMap(e=>{if(e.isVisible===!1)return[];let s=ut(typeof e.position=="string"?e.position:"");return s===void 0?[]:[{...s,color:Z(e).color}]})}function ar(t,n){if(n==="anywhere")return ie(H(t.document,xe).length,"slot","slots");if(n==="switcher")return ie(t.switcherPages.length,"page","pages");if(jt(t)==="domain")return`By type \xB7 ${Y(Ft(t))}`;let e=Kt(t);return`By entity \xB7 ${e===void 0?"none yet":j(t.hass,e)}`}function cr(t,n){if(n==="switcher"){let e=t.switcherPages;return Fi(e.map((s,i)=>({...Gi(i,e.length),color:s.color})))}return Fi(rr(t,n==="anywhere"?xe:lo(t)))}function fo(t){let n=_(t);return c`<section class="card lc me-menus-card" aria-label="Menus"
    style=${`--c: var(--wa-lc-pages, #26a69a); --thumb-w: ${Oe}px; --thumb-h: ${Ie}px`}>
    <div class="lc-head">
      <span class="swatch">${S("radial")}</span><span class="lc-title">Menus</span>
      <span class="lc-sub" title=${Zo}>on the watch</span>
    </div>
    <div class="layers me-menu-list" role="list">
      ${Ji.map(([e,s])=>{let i=e===n,o=()=>{i||ir(t,e)};return c`<div class="layer me-menu-row ${i?"hl":""}" data-menu=${e} role="listitem" tabindex="0"
          aria-current=${i?"true":"false"} aria-label=${s} title=${Zi[e]}
          @click=${o}
          @keydown=${r=>{r.target!==r.currentTarget||r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),o())}}>
          <span class="grip" aria-hidden="true"></span>
          ${cr(t,e)}
          <span class="name"><b><span class="nm-t">${s}</span></b><small>${ar(t,e)}</small></span>
          <span class="right"></span>
        </div>`})}
    </div>
  </section>`}function mo(t,n,e){return c`<span class="thumb me-thumb" style=${`--c:${e}`} aria-hidden="true"><span class="me-thumb-glyph">${De(t,n,14,e)}</span></span>`}function dr(t,n,e,s){let i=P(e),o=Z(e),r=s!==void 0&&$(i,P(s)),a=e.isVisible===!1,d=Vt(t,e),u=io(e),l=()=>he(t,n,i);return c`<div class="layer me-slot-row ${r?"hl":""} ${a?"dim":""}" data-slot=${i} style=${`--k:${o.color}`}
    role="listitem" tabindex="0" aria-current=${r?"true":"false"} aria-label=${d}
    title=${`${d} \xB7 ${u}${a?", hidden":""}`}
    @click=${h=>{h.target instanceof Element&&h.target.closest("button")||l()}}
    @keydown=${h=>{h.target!==h.currentTarget||h.key!=="Enter"&&h.key!==" "||(h.preventDefault(),l())}}>
    <span class="grip" aria-hidden="true"></span>
    ${mo(t,o.icon,o.color)}
    <span class="name"><b><span class="nm-t">${d}</span></b><small>${u}</small></span>
    <span class="right">
      <span class="badges">${a?c`<span class="badge">hidden</span>`:p}</span>
      <span class="acts">
        <button type="button" class="icon danger" ?disabled=${t.busy} title="Remove" aria-label=${`Remove ${d}`}
          @click=${()=>t.edit(h=>ht(h,n,i))}>${S("delete")}</button>
      </span>
    </span>
  </div>`}function ur(t,n,e){let s=n===void 0||n.list==="anywhere"?"By entity: none has a menu of its own yet.":n.list==="domain"?`${Y(n.domain)} menu, by type`:`${j(t.hass,n.entityId)}'s own menu`;return c`<div class="lc-filter me-filter"><span class="lc-sub">${s}</span>
    ${e===void 0?p:c`<button type="button" class="lc-ghost sm" title="Pick the type or the entity in the menu's settings"
      @click=${()=>Bt(t)}>Change</button>`}
  </div>`}function lr(t){return t.hidden?"Not in the switcher":t.text===void 0?"Shown as its icon":t.text===t.name?"Shown by name":`Shown as ${t.text}`}function hr(t,n,e){let s=e!==void 0&&$(e.id,n.id),i=lr(n),o=()=>Ut(t,n.id);return c`<div class="layer me-page-row ${s?"hl":""} ${n.hidden?"dim":""}" data-page=${n.id} style=${`--k:${n.color}`}
    role="listitem" tabindex="0" aria-current=${s?"true":"false"} aria-label=${n.name}
    title=${`${n.name} \xB7 ${i}`}
    @click=${r=>{r.target instanceof Element&&r.target.closest("button")||o()}}
    @keydown=${r=>{r.target!==r.currentTarget||r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),o())}}>
    <span class="grip" aria-hidden="true"></span>
    ${mo(t,n.icon,n.color)}
    <span class="name"><b><span class="nm-t">${n.name}</span></b><small>${i}</small></span>
    <span class="right"><span class="badges">${n.hidden?c`<span class="badge">hidden</span>`:p}</span></span>
  </div>`}function pr(t){let n=co(t),e=G(t),s=n.filter(i=>i.hidden).length;return c`<section class="card lc me-slots-card" aria-label="Pages"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${Oe}px; --thumb-h: ${Ie}px`}>
    <div class="lc-head">
      <span class="swatch">${S("pages")}</span><span class="lc-title">Pages</span>
      <span class="lc-sub">${ie(n.length,"page","pages")}${s===0?"":`, ${s} hidden`}</span>
    </div>
    ${n.length===0?c`<div class="lc-note">No page shows in the switcher.</div>`:c`<div class="layers me-page-list" role="list">${n.map(i=>hr(t,i,e))}</div>`}
  </section>`}function go(t){let n=_(t);if(n==="switcher")return pr(t);let e=X(t),s=e===void 0?[]:sr(H(t.document,e)),i=e===void 0?void 0:le(t,e),o=e===void 0?[]:lt(t.document,e),r=e===void 0?"Add an entity first, in the menu's settings.":o.length===0?"Every place around the ring is taken.":"Add a slot at the first free place",a;return e===void 0?a=c`<div class="lc-note">Add an entity to edit its menu.</div>`:s.length===0?a=c`<div class="lc-note">No slots yet.</div>`:a=c`<div class="layers me-slot-list" role="list">${s.map(d=>dr(t,e,d,i))}</div>`,c`<section class="card lc me-slots-card" aria-label="Slots"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${Oe}px; --thumb-h: ${Ie}px`}>
    <div class="lc-head">
      <span class="swatch">${S("layers")}</span><span class="lc-title">Slots</span>
      ${e===void 0?p:c`<span class="lc-sub">${ie(s.length,"slot","slots")}</span>`}
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri me-add-slot" aria-label="Add slot" ?disabled=${t.busy||e===void 0||o.length===0}
        title=${r} @click=${()=>{e!==void 0&&po(t,e)}}>${S("plus")}<span>Add</span></button>
    </div>
    ${n==="entity"?ur(t,e,i):p}
    ${a}
  </section>`}function wo(t,n){let e=Xo(t,n);return`left:${e.x*100}%;top:${e.y*100}%`}function Ki(t,n,e){let s=ut(n,e??He);return s===void 0?void 0:wo(t,s)}function zt(t,n,e){let{width:s,height:i}=t.screen,o=t.scale,r=Math.min(s,i),a=c`<div class="me-screen" role="group" aria-label=${n}
    style=${`width:${Math.round(s*o)}px;height:${Math.round(i*o)}px;--me-s:${o}`}>
    <svg class="me-screen-bg" viewBox=${`0 0 ${s} ${i}`} aria-hidden="true">
      <circle cx=${s/2} cy=${i/2} r=${r*He} class="me-track"></circle>
      <circle cx=${s/2} cy=${i/2} r=${r*.05} class="me-center"></circle>
    </svg>
    ${e}
  </div>`;return es({width:s,height:i},o,a,n)}function Nt(t,n){return Math.round(n*t.scale)}function fr(t,n,e,s){let i=t.screen,o=H(t.document,n),r=Ws(t.document,n),a=new Set(lt(t.document,n)),d=e===void 0?void 0:P(e),u=(l,h,f,y,m)=>{let w=Z(l),x=P(l),A=d!==void 0&&$(x,d),oe=`${z(h)}: ${B(k(l))}${l.isVisible===!1?", hidden":""}`;return c`<button type="button" class="me-dot ${y} ${A?"on":""} ${l.isVisible===!1?"off":""}" style=${`${f};--c:${w.color}`}
      title=${oe} aria-label=${oe} aria-pressed=${A?"true":"false"} @click=${()=>he(t,n,x)}>
      ${De(t,w.icon,Nt(t,y===""?15:11),w.color)}${m>1?c`<span class="me-count" aria-hidden="true">${m}</span>`:p}</button>`};return zt(t,`${s} on the watch`,Me().map(l=>{let h=Ki(i,l);if(h===void 0)return p;let f=o.filter(R=>R.position===l),y=f.find(R=>R.isVisible!==!1),m=y===void 0?r.find(R=>R.position===l&&R.isVisible!==!1):void 0,w=y??(m===void 0?f[0]:void 0),x=f.find(R=>R!==w),A;if(w!==void 0)A=u(w,l,h,"",f.length);else if(m!==void 0){let R=Z(m);A=c`<span class="me-dot inh" style=${`${h};--c:${R.color}`} title=${`${z(l)}: ${B(k(m))}, from All`}>
          ${De(t,R.icon,Nt(t,13),R.color)}</span>`}else a.has(l)?A=c`<button type="button" class="me-dot free" style=${h} ?disabled=${t.busy}
          title=${`Add a slot at ${z(l)}`} aria-label=${`Add a slot at ${z(l)}`}
          @click=${()=>po(t,n,l)}>${S("plus")}</button>`:A=p;let oe=x===void 0?void 0:Ki(i,l,.2);return c`${A}${x===void 0||oe===void 0?p:u(x,l,oe,"two",0)}`}))}function mr(t){let n=t.switcherPages,e=t.screen,s=G(t),i=n.length===0?c`<p class="me-screen-note">No pages in the switcher yet.</p>`:n.map((o,r)=>{let a=`${wo(e,Gi(r,n.length))};--c:${o.color}`,d=s!==void 0&&$(s.id,o.id)?"on":"";return o.text===void 0?c`<span class="me-dot me-page-dot ${d}" style=${a} title=${o.name}>${De(t,o.icon,Nt(t,14),o.color)}</span>`:c`<span class="me-page ${d}" style=${a} title=${o.name}>${o.text}</span>`});return zt(t,"Page switcher on the watch",i)}function vo(t){if(_(t)==="switcher")return mr(t);let n=X(t);return n===void 0?zt(t,"Entity quick menu on the watch",c`<p class="me-screen-note">Add an entity to edit its menu.</p>`):fr(t,n,le(t,n),or(t,n))}function yo(t){if(_(t)==="switcher")return[ie(t.switcherPages.length,"page","pages")];let n=X(t);if(n===void 0)return["No entity yet"];let e=ie(H(t.document,n).length,"slot","slots");return n.list==="anywhere"?[e]:[n.list==="domain"?Y(n.domain):j(t.hass,n.entityId),e]}function bo(t){return _(t)==="switcher"?Yi:X(t)===void 0?"Add an entity in the menu's settings to give it a menu of its own.":Go}function So(t,n){return ss(t.uiState,q,n)}function gr(t,n){is(t.uiState,q,n,!So(t,n)),t.requestUpdate()}function wr(t){if(uo(t)!==void 0)return[{module:q,section:"switcher-page"}];let n=X(t),e=n===void 0?void 0:le(t,n);if(e!==void 0)return[{module:q,section:"slot"},...Vi(e)?[{module:q,section:"voice"}]:[],{module:q,section:"look"}];let s=_(t);return[{module:q,section:s==="entity"?"menu":`style-${s}`}]}function se(t,n,e,s,i,o={}){let r=So(t,e),a=to[n];return wn({color:a.color,icon:S(a.icon),title:s,open:r,onToggle:()=>gr(t,e),...o.summary===void 0||o.summary===""?{}:{summary:o.summary},dot:o.dot===!0,id:`${q}:${e}`},r?i:c``)}function ko(t){let n=_(t),e=qt(n),s=X(t),i=s===void 0?void 0:le(t,s),o=wr(t),r=os(t.uiState,o),a=G(t),d=uo(t),u,l;if(a!==void 0&&d!==void 0)u=c`<div class="crumbs"><button class="root" title="The switcher's own style" @click=${()=>Ut(t,void 0)}>${e}</button><span class="sep">›</span><span class="kchip" style=${`--k:${er}`}>Page</span><span class="nm" title=${a.name}>${a.name}</span></div>`,l=vr(t,d);else if(i===void 0||s===void 0)u=c`<div class="crumbs"><span class="kchip" style=${`--k:${Qo}`}>Menu</span><span class="nm" title=${e}>${e}</span></div>`,l=Ir(t,n);else{let h=Vt(t,i);u=c`<div class="crumbs"><button class="root" title="Edit the menu" @click=${()=>he(t,s,void 0)}>${e}</button><span class="sep">›</span><span class="kchip" style=${`--k:${Z(i).color}`}>Slot</span><span class="nm" title=${h}>${h}</span></div>`,l=_r(t,s,i)}return c`<div class="insp-head">
      ${u}
      <button class="expand" @click=${()=>{rs(t.uiState,o,!r),t.requestUpdate()}}>${r?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${l}</div>`}function vr(t,n){let e=n.page;return se(t,"switcherPage","switcher-page",Dt,c`<fieldset class="ts-body me-body" ?disabled=${t.busy} aria-label=${Dt}>${Ei(n)}</fieldset>`,{summary:Di(e),dot:_i(e)})}var yr={triggerMode:"Mode",confirmOnRelease:"Confirm on release",showBanner:"Show banner",bannerSeconds:"Banner seconds",openOnRelease:"Open on release",instanceSwitchBehavior:"Behavior",phraseId:"Phrase"};function xo(t,n){return n.key==="entityId"?n.target==="httpAction"?"HTTP action":t==="runScene"?"Scene":t==="runScript"?"Script":"Entity":n.key==="pageId"?n.target==="statusPage"?"Status page":"Page":yr[n.key]??n.key}function br(t,n,e){let s=P(e),i=k(e),o=Ls(n),r=new Set(o.flatMap(u=>u.actions)),a=u=>{let l=K(u),h=u===i?void 0:Cs(u,t.targets),f=`${l?.label??B(u)}${l?.requiresPremium?" (Pro)":""}${h===void 0?"":` (${h})`}`;return c`<option value=${u} ?selected=${u===i} ?disabled=${h!==void 0}>${f}</option>`},d=u=>t.edit(l=>Bs(l,n,s,u,t.targets));return c`<label class="field"><span>Action</span>
    <select .value=${Fe(i)} @change=${u=>d(u.target.value)}>
      ${r.has(i)?p:c`<optgroup label="Now"><option value=${i} selected>${B(i)}</option></optgroup>`}
      ${o.map(u=>c`<optgroup label=${Rs(u.category)}>${u.actions.map(a)}</optgroup>`)}
    </select></label>`}function Sr(t){return t.needsSetup===!0?`${t.name} (${t.source==="home"?"needs setup":"needs setup on the iPhone"})`:t.source==="iphone"?`${t.name} (on the iPhone)`:t.name}function Bi(){return c`<button type="button" class="link" @click=${bi}>Open HTTP actions</button>`}function kr(t,n,e){let s=n.find(i=>$(i.id,e));return s?.source==="home"&&s.needsSetup===!0?c`<div class="hint warn ts-under">Needs setup. ${Bi()}</div>`:t.httpLibrary!==void 0&&n.length===0?c`<div class="hint ts-under">${ps} ${Bi()}</div>`:!t.catalogKnown&&t.httpLibrary!=="held"?c`<div class="hint ts-under">Open the iPhone app to list its HTTP actions here.</div>`:p}function xr(t,n,e,s,i){let o=P(e),r=ce(e)[i.key],a=typeof r=="string"?r:"",d=i.target==="page"?t.targets.pages:i.target==="statusPage"?t.targets.statusPages:i.target==="ttsPhrase"?t.targets.phrases??[]:t.targets.httpActions,u=a===""||d.some(w=>$(w.id,a)),l=w=>t.edit(x=>mt(x,n,o,i.key,w===""?void 0:w)),h=i.target==="statusPage"&&t.statusPagesKnown===!0,f=i.target==="httpAction"&&t.httpLibrary==="held"&&!t.catalogKnown,y=i.target==="page"?"A page that is gone":i.target==="ttsPhrase"?t.targets.phrases===void 0?"A phrase not listed here":"A phrase that is gone":h?"Not in this watch's status pages":f?hs:ds,m=w=>i.target==="httpAction"?Sr(w):w.name;return c`<label class="field"><span>${xo(s,i)}</span>
    <select .value=${Fe(d.find(w=>$(w.id,a))?.id??a)} @change=${w=>l(w.target.value)}>
      ${i.required===!0?p:c`<option value="" ?selected=${a===""}>None</option>`}
      ${u?p:c`<option value=${a} selected>${y}</option>`}
      ${d.map(w=>c`<option value=${w.id} ?selected=${$(w.id,a)}>${m(w)}</option>`)}
    </select></label>
    ${i.target==="ttsPhrase"?t.voice?.phrases===void 0?c`<div class="hint ts-under">No voice settings from this watch yet. Add phrases in Voice.</div>`:p:i.target==="statusPage"?h||t.catalogKnown?p:c`<div class="hint ts-under">No status pages from this watch yet. Add them in Status pages.</div>`:i.target==="httpAction"?kr(t,t.targets.httpActions,a):p}`}function $r(t,n,e,s,i){let o=P(e),r=ce(e),a=(l,h)=>t.edit(f=>mt(f,n,o,i.key,l),h),d=xo(s,i),u=gt(e,i);switch(i.type){case"entity":{let l=typeof r[i.key]=="string"?r[i.key]:"",h=s==="runScene"?"scene":s==="runScript"?"script":Es();return c`<div class="ts-stack">${ze({hass:t.hass},d,no(t.hass,l),f=>a(f.entityId),`me:entity:${o}`,{domain:h,clearable:!1,needed:l===""})}</div>
        ${l===""?c`<div class="hint keep">Pick what it runs. A slot left without one is dropped when you save.</div>`:p}`}case"uuid":return xr(t,n,e,s,i);case"enum":{if(i.key==="triggerMode"){let f=Se(typeof r.entityId=="string"?r.entityId:""),y=_s(f),m=typeof u=="string"?u:y[0]??"",w=y.map(x=>[x,dt(x)]);return y.includes(m)||w.unshift([m,dt(m)]),I(d,m,w,x=>a(x),{snapBack:!0})}let l=kt(i.enum),h=typeof u=="string"?u:String(i.default??"");return l.length<=4?F(d,h,l,f=>a(f)):I(d,h,l,f=>a(f),{snapBack:!0})}case"bool":return C(d,u===!0,l=>a(l),i.default);case"number":{if(i.key==="bannerSeconds"&&gt(e,{key:"showBanner",type:"bool",default:!0})===!1)return p;let l=typeof r[i.key]=="number"?r[i.key]:void 0;return An(d,l,h=>a(h,`slot:${o}:${i.key}`),{...i.min===void 0?{}:{min:i.min},...i.max===void 0?{}:{max:i.max},step:1,optional:!0,clampOnCommit:!0,placeholder:typeof i.absentMeans=="number"?String(i.absentMeans):"",unit:"s",def:null})}}}function Mr(t,n,e){if(!pt(n,e))return p;let s=P(e);return c`<div class="ts-stack">${F("Skip conditions",ci(ft(e)),ai,i=>t.edit(o=>js(o,n,s,di(i))))}</div>
    <div class="hint ts-under">Whether running the automation from this menu skips its conditions. Default follows the tile, then "Skip conditions by default" in the watch's Settings.</div>`}function Tr(t,n){let e=P(n),s=vt(n),i=s===void 0,o=u=>t.edit(l=>Js(l,e,u)),r=zs(),a=(s??[]).filter(u=>!wt(u)),d=i?"Every screen":s.length===0?"No entity under the finger":s.map(Y).join(", ");return c`<details class="me-show-for">
    <summary><span>Show for</span><b>${d}</b></summary>
    ${C("Every screen",i,u=>o(u?void 0:r.slice(0,1)),!0)}
    ${i?p:c`<div class="me-chips" role="group" aria-label="Entity types">
      ${[...r,...a].map(u=>{let l=s.includes(u),h=!wt(u);return c`<button type="button" class="pe-chip ${l?"on":""} ${h?"odd":""}" aria-pressed=${l?"true":"false"}
          title=${h?"Not reported by the watch":p}
          @click=${()=>o(l?s.filter(f=>f!==u):[...s,u])}>${Y(u)}</button>`})}
    </div>
    ${a.length===0?p:c`<div class="hint warn">${a.map(Y).join(", ")}: Not reported by the watch.</div>`}
    <div class="hint">The slot shows only while the finger is over an entity of these types. With none picked, it shows only where no entity is under the finger.</div>`}
  </details>`}function Pr(t,n){return t.isVisible===!1||n.list==="anywhere"&&vt(t)!==void 0||pt(n,t)&&ft(t)!==null}function Rr(t){let n=so(t);if(n===void 0)return!1;let e=Z(t);return e.icon!==n.icon||!tr(e.color,n.color)}function Cr(t,n){let e=to.name,s=K(k(n));return c`<section class="sec name-sec" data-open="true" style=${`--c:${e.color}`}>
    <div class="sec-h pinned">
      <span class="swatch">${S(e.icon)}</span>
      <h4>Name</h4>
      <span class="me-name" title="A slot is named by what it runs, else by its action">${Vt(t,n)}</span>
      ${s?.requiresPremium?c`<span class="pe-badge" title="Needs Wrist Assistant Pro on the watch">Pro</span>`:p}
    </div>
  </section>`}function _r(t,n,e){let s=P(e),i=k(e),o=K(i),r=Z(e),a=so(e),d=typeof e.position=="string"?e.position:"",u=H(t.document,n).filter(m=>!$(P(m),s)),l=Me().map(m=>{let w=z(m);return u.some(x=>x.position===m)?[m,m===d?`${w} (shared)`:`${w} (swap)`]:[m,w]}),h=c`<fieldset class="me-body" ?disabled=${t.busy} aria-label="Slot">
    ${o===void 0?c`<div class="hint warn">A newer app wrote this action. A watch with an older app shows Sync Needed for it until the app is updated. Pick another action to replace it.</div>`:p}
    ${I("Place",d,l,m=>t.edit(w=>Us(w,n,s,m)),{snapBack:!0})}
    ${C("Shown",e.isVisible!==!1,m=>t.edit(w=>qs(w,n,s,m)),!0)}
    ${br(t,n,e)}
    ${o?.description?c`<div class="hint ts-under">${o.description}</div>`:p}
    ${Ns(i)?c`<div class="hint ts-under keep">Only for a watch with more than one Home Assistant.</div>`:p}
    ${(o?.payload??[]).map(m=>$r(t,n,e,i,m))}
    ${Mr(t,n,e)}
    ${n.list==="anywhere"?Tr(t,e):p}
  </fieldset>`,f=c`<fieldset class="me-body" ?disabled=${t.busy} aria-label="Look">
    <div class="ts-stack">${we({icons:t.icons,symbols:t.symbols},typeof e.icon=="string"?e.icon:"",m=>t.edit(w=>Fs(w,n,s,m),`slot:${s}:icon`),`me:icon:${s}`,void 0,"Icon",!1)}</div>
    <div class="ts-no-alpha">${re("Color",typeof e.color=="string"?e.color:void 0,m=>{m!==void 0&&t.edit(w=>Ks(w,n,s,m),`slot:${s}:color`)},!1,a?.color)}</div>
  </fieldset>`,y=qi(t,n,e);return c`${Cr(t,e)}
    ${se(t,"slot","slot","Slot",h,{summary:io(e),dot:Pr(e,n)})}
    ${y===void 0?p:se(t,"slot","voice","Voice",c`<fieldset class="me-body me-voice" ?disabled=${t.busy} aria-label="Voice">${y}</fieldset>`,{summary:ji(t,e),dot:Ni(e)})}
    ${se(t,"look","look","Look",f,{summary:r.icon,dot:Rr(e)})}
    <div class="me-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${t.busy} title="Remove this slot from the menu"
        @click=${()=>t.edit(m=>ht(m,n,s))}>${S("delete")}<span>Remove</span></button>
    </div>`}function Dr(t,n,e){if(!St(t.document,n,e))return p;let s=bt(t.document,n,e),i=`style:${n}:${e.key}`,o=(r,a=!1)=>t.edit(d=>Xs(d,n,e.key,r),a?i:void 0);switch(e.type){case"bool":return C(e.label,s===!0,r=>o(r),e.default);case"enum":{let r=kt(e.enum),a=String(s);return r.length<=4?F(e.label,a,r,d=>o(d),{def:String(e.default)}):I(e.label,a,r,d=>o(d),{def:String(e.default),snapBack:!0})}case"number":{let r=typeof s=="number"?s:Number(e.default);return c`${ge(e.label,r,a=>o(a,!0),{min:e.min??0,max:e.max??1,step:e.step??.01,def:Number(e.default)})}
      ${e.presets===void 0?p:c`<div class="ts-after">${e.presets.map(a=>c`<button type="button"
        class="pe-chip ${a.value===r?"on":""}" aria-pressed=${a.value===r?"true":"false"} @click=${()=>o(a.value)}>${a.label}</button>`)}</div>`}`}case"color":{let r=typeof s=="string"?s:String(e.default);return c`<div class="ts-no-alpha">${re(e.label,r,a=>{a!==void 0&&o(a,!0)},!1,String(e.default))}</div>
        ${e.swatches===void 0?p:c`<div class="ts-swatch-row"><div class="ts-swatches" role="group" aria-label=${e.label}>
          ${e.swatches.map(a=>{let d=a.toUpperCase()===r.toUpperCase();return c`<button type="button" class="ts-swatch ${d?"on":""}" aria-pressed=${d?"true":"false"} title=${a} aria-label=${a}
              style=${`--sw:${a}`} @click=${()=>o(a)}></button>`})}</div></div>`}`}}}function Er(t,n){return typeof t=="number"&&typeof n=="number"?Math.abs(t-n)<1e-9:typeof t=="string"&&typeof n=="string"?t.toUpperCase()===n.toUpperCase():t===n}function Hr(t,n){return yt(n).some(e=>St(t,n,e)&&!Er(bt(t,n,e),e.default))}function zi(t,n,e){let s=Hr(t.document,n);return se(t,"style",e,"Style",c`<fieldset class="me-body me-style" ?disabled=${t.busy} aria-label="Style">
    ${yt(n).map(i=>Dr(t,n,i))}
  </fieldset>`,{summary:s?"Changed":"Defaults",dot:s})}function Or(t){let n=jt(t),e=a=>{t.uiState.set(ro,a),t.requestUpdate()},s=F("Edit",n,[["domain","By type"],["entity","By entity"]],a=>e(a)),i,o,r=!1;if(n==="domain"){let a=Ft(t),d=ke(a),u=Os(a),l=Hs().map(f=>[f.domain,f.label]),h=d?.inheritKey?As(t.document,a):!1;r=h,o=`By type \xB7 ${d?.label??a}`,i=c`${I("Type",a,l,f=>{t.uiState.set(ao,f),t.requestUpdate()})}
      ${u.length>0?c`<div class="hint ts-under keep">The same menu as ${u.map(f=>f.label).join(", ")}.</div>`:p}
      ${d?.inheritKey?c`${C("Add the All slots",h,f=>t.edit(y=>Ys(y,a,f)),!1)}
        <div class="hint ts-under">The All menu's slots fill the places this menu leaves free.</div>`:p}`}else{let a=de(t.document),d=Kt(t);o=`By entity \xB7 ${d===void 0?"none yet":j(t.hass,d)}`;let u=l=>{let h=l.entityId.trim();h!==""&&(t.edit(f=>Zs(f,h)),t.uiState.set(Lt,h),t.uiState.set(Wt,(Number(t.uiState.get(Wt)??0)||0)+1),t.requestUpdate())};i=c`<div class="me-entities">
      ${a.length===0?c`<p class="hint keep">No entity has a menu of its own. Add one below: it starts as a copy of its type's menu.</p>`:p}
      ${a.map(l=>{let h=l===d;return c`<div class="me-entity ${h?"on":""}">
          <button type="button" class="me-entity-pick" aria-pressed=${h?"true":"false"}
            @click=${()=>{t.uiState.set(Lt,l),t.requestUpdate()}}>
            <b>${j(t.hass,l)}</b><code>${l}</code></button>
          <button type="button" class="pe-btn pe-danger" title="Remove this entity's own menu. It follows its type's menu again."
            @click=${()=>t.edit(f=>Gs(f,l))}>Remove</button>
        </div>`})}
      <div class="ts-stack">
        ${ze({hass:t.hass},"Add an entity",no(t.hass,""),u,`me:er:add:${String(t.uiState.get(Wt)??0)}`,{clearable:!1})}
      </div>
    </div>`}return se(t,"menu","menu","Menu",c`<fieldset class="me-body me-pick" ?disabled=${t.busy} aria-label="Menu">
    ${s}${i}
  </fieldset>`,{summary:o,dot:r})}function Ir(t,n){let e=n==="anywhere"?zi(t,"quickAction","style-anywhere"):n==="switcher"?zi(t,"pageSwitcher","style-switcher"):Or(t);return c`<p class="me-menu-note">${Zi[n]}</p>${e}
    <p class="me-menu-note me-pick-note">${n==="switcher"?Yo:"Select a slot to edit it, or add one."}</p>`}var $o=pe`
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
`;function Jt(t){if(t.length===0)return"";let n=t.map(s=>ei(s));return`Another save also changed ${n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`}. ${n.length===1?"Your version replaced it.":"Your versions replaced them."}`}function Mo(t){if(t.ok){if(t.alreadySaved===!0)return{kind:"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${t.revision}.`};let e=t.replaced??[];return e.length>0?{kind:"warn",text:`Saved. ${Jt(e)}`}:t.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let n=(t.message??"").trim();switch(t.code){case"conflict":return{kind:"warn",text:"Not saved. The menus kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds menus for this watch. Start with the defaults again."};case"invalid":{let e=t.problems??[];return e.length>0?{kind:"err",text:`Not saved. Something in the menus is not right: ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the menus${n===""?".":`: ${n}`}`}}case"not_for_iphone":return{kind:"err",text:`Not saved. ${yn}`};case"busy":return{kind:"warn",text:"Already saving these menus. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the menus just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}function Co(){return Pi()||xs()}yi({dirty:Co,drop:()=>{Ri(),$s()}});typeof window<"u"&&window.addEventListener("beforeunload",t=>{Co()&&(t.preventDefault(),t.returnValue="")});var Ar=15e3,_o=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),Yt=_o?"\u2318":"Ctrl+",Zt={min:200,max:720,middleMin:320},Gt={left:280,right:320},Xt="wrist-assistant-panel.menus.columns.v1",Wr=24,To=820;function Ae(t){return L(t).message}function We(t){return L(t).code}function Le(t){let{code:n,message:e}=L(t);return Object.assign(new Error(e),n===void 0?{}:{code:n})}function Lr(t){return t<1e3?`${t} bytes`:`${Number((t/1e3).toFixed(1))} KB`}function Nr(t){let n=t?Date.parse(t):NaN;return Number.isNaN(n)?"":dn(Math.max(0,(Date.now()-n)/1e3))}function Vr(t){return t==="panel"?"Saved here":"From the watch"}function Ur(t){return t instanceof HTMLElement?Jn(t.tagName,t instanceof HTMLInputElement?t.type:void 0,t.isContentEditable):!1}function qr(){let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t===null||t===document.body||t===document.documentElement}function jr(t){return E(t)?Ye(t).filter(n=>!Ge(n)&&Ps(ve(n))).map(n=>({id:ve(n),name:Ze(n)})):[]}var Po=["#8FA8C4","#9CB6A6","#C8AE8E","#A5B7CF","#D8A3A0","#A8BED5","#CCD8E6","#D8A3A0"];function Ne(t){return typeof t=="string"&&t.trim()!==""?t:void 0}var Fr="#8E8E93";function Qt(t){if(!E(t))return[];let n=0;return Ye(t).filter(e=>!Gn(e)&&!Ge(e)).map(e=>{let s=e.hideFromSwitcher===!0,i=Ze(e),o=Ne(e.switcherIcon)??Ne(Zn(e)[0]?.icon)??(Xn(e)?"bolt.fill":"square.grid.2x2.fill"),r=s?Fr:Po[n++%Po.length],a=Ne(e.switcherColor)??r,d=e.switcherDisplayMode==="icon"?void 0:Ne(e.switcherText)??i;return{id:ve(e),name:i,icon:o,color:a,...d===void 0?{}:{text:d},hidden:s}})}function vc(t){return Qt(t).filter(n=>!n.hidden).map(({hidden:n,...e})=>e)}var Ro={ok:0,warn:1,err:2};function Kr(t,n){return t===void 0?n:n===void 0?t:{kind:Ro[n.kind]>Ro[t.kind]?n.kind:t.kind,text:t.text===n.text?t.text:`${t.text} ${n.text}`}}function Br(t){let n=rt(t)??{},e=H(n,{list:"anywhere"}).length,s=de(n).length;return`Anywhere menu: ${(o=>`${o} ${o===1?"slot":"slots"}`)(e)}. ${s===0?"No entity has its own menu.":`${s} ${s===1?"entity has":"entities have"} its own menu.`}`}var g=class extends tn{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=p;this.shellOwnsWatch=!1;this.phones=!1;this.unsupported=!1;this.httpLibrarySeq=0;this.voiceSeq=0;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.starting=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.zoom=Qi();this.columns={...Gt};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new Vn(this);this.symbols=new Cn(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.catalogSeq=0;this.statusPagesSeq=0;this.pagesSeq=0;this.behaviorSeq=0;this.historySeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let e=this.watchId;!this.isConnected||e===void 0||(this.load(e,!0),this.loadCatalog(e),this.loadHttpLibrary(),this.loadStatusPages(e),this.loadPages(e),this.loadBehavior(e),this.loadVoice(e))};this.onScrubStart=e=>{e.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=e=>{e.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=e=>{if(e.defaultPrevented)return;let s=e.composedPath();if(!s.includes(this)&&!qr()||this.renderRoot.querySelector("dialog[open]"))return;let i=e.metaKey||e.ctrlKey,o=e.key.toLowerCase();if(i&&!e.altKey&&o==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1,this.updateComplete.then(()=>this.renderRoot.querySelector(".wa-bar .tb-more")?.focus());return}if(e.key==="Escape"&&this.watchMenuOpen){e.preventDefault(),this.watchMenuOpen=!1,this.updateComplete.then(()=>this.renderRoot.querySelector(".wa-bar .me-watch-btn")?.focus());return}if(!Ur(s[0])){if(i&&!e.altKey&&o==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}if(e.ctrlKey&&!e.metaKey&&!e.altKey&&o==="y"){e.preventDefault(),this.redo();return}if(e.key==="Escape"&&!i&&!e.altKey){let r=this.viewHost();r!==void 0&&Bt(r)&&e.preventDefault()}}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let s=e.composedPath(),i=o=>s.some(r=>r instanceof HTMLElement&&r.classList.contains(o));this.topMenuOpen&&!i("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!i("me-watch-picker")&&(this.watchMenuOpen=!1)};this.addEventListener(Hn,this.onScrubStart),this.addEventListener(On,this.onScrubEnd),this.addEventListener("focusout",()=>{this.draft?.endCoalesce(),this.pagesDraft?.endCoalesce()})}get watches(){return kn(this.owners.length>0?this.owners:this.ownList??[],this.phones)}get device(){return as(this.watches,this.watchId)?"iphone":"watch"}get draft(){if(!(this.watchId===void 0||this.record===void 0||this.record.revision<=0))return J(this.watchId)}get pagesDraft(){if(!(this.watchId===void 0||this.pagesRecord!==void 0&&this.pagesRecord.revision<=0))return it(this.watchId)}get pagesDocument(){let e=this.pagesRecord;return this.pagesDraft?.document??(e!==void 0&&e.revision>0?e.document:void 0)}get pages(){return jr(this.pagesDocument)}get saving(){return this.watchId===void 0?!1:(J(this.watchId)?.saving??!1)||(this.pagesDraft?.saving??!1)}get dirty(){return(this.draft?.dirty??!1)||(this.pagesDraft?.dirty??!1)}get undoDraft(){let e=this.pagesDraft;return e!==void 0&&this.pickedSwitcherPage()!==void 0?e:this.draft}pickedSwitcherPage(){return G({uiState:this.uiState,switcherPages:[],switcherRows:Qt(this.pagesDocument)})}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Pn(Xt,Gt,Zt),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.catalogSeq++,this.statusPagesSeq++,this.httpLibrarySeq++,this.pagesSeq++,this.behaviorSeq++,this.voiceSeq++,this.historySeq++}willUpdate(e){if(this.hass){e.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,nn(this.hass).then(o=>{this.ownList=o.owners},()=>{this.ownList=[]}));let i=Mn(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||e.has("ownerId"));i!==void 0&&this.openWatch(i)}this.followSave();let s=this.restoreAsk;s!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(i=>i.revision===s.entry.revision)&&this.closeAsk()}updated(){let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),Fn(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let s of e){if(s.target!==this){this.measureTop(s.target);continue}let i=s.contentRect;Math.abs(i.width-this.hostWidth)>=1&&(this.hostWidth=i.width),Math.abs(i.height-this.hostHeight)>=1&&(this.hostHeight=i.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let s=this.renderRoot?.querySelector(".pe-top")??void 0;s!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=s,s!==void 0&&e.observe(s))}measureTop(e){let s=e.offsetHeight;s!==this.topHeight&&(this.topHeight=s,this.style.setProperty("--pe-top-h",`${s}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let e=this.watchId;if(e===void 0)return;let s=this.pagesDraft?.saveDone;if(s!==void 0&&s!==this.followedPagesSave){this.followedPagesSave=s;let r=()=>this.pagesSaveEnded(e);s.then(r,r)}let i=J(e)?.saveDone;if(i===void 0||i===this.followedSave)return;this.followedSave=i;let o=()=>this.saveEnded(e);i.then(o,o)}pagesSaveEnded(e){this.requestUpdate(),!(!this.isConnected||e!==this.watchId)&&(this.loadPages(e),this.flushPending())}saveEnded(e){this.requestUpdate(),this.isConnected&&(e===this.watchId?(this.reloadPending=!1,this.load(e,!0)):this.flushPending())}openWatch(e,s=!1){e!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=e,this.note=void 0,this.unsupported=!1,this.catalog=void 0,this.catalogSeq++,this.statusPages=void 0,this.statusPagesSeq++,this.pagesRecord=void 0,this.pagesSeq++,this.behavior=void 0,this.behaviorSeq++,this.voiceDocument=void 0,this.voiceSeq++,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),s=!1),this.startSubscription(e),this.load(e,s),this.loadCatalog(e),this.loadHttpLibrary(),this.loadStatusPages(e),this.loadPages(e),this.loadBehavior(e),this.loadVoice(e)}async loadVoice(e){let s=this.hass;if(!s)return;let i=++this.voiceSeq;try{let o=await D(s,e,"voice");if(i!==this.voiceSeq||e!==this.watchId)return;this.voiceDocument=pi(o)}catch{if(i!==this.voiceSeq||e!==this.watchId)return;this.voiceDocument=void 0}}voiceContext(){let e=this.voiceDocument;return{phrases:e===void 0?void 0:Mt(e),defaults:fi(e,this.catalog)}}async loadCatalog(e){let s=this.hass;if(!s)return;let i=++this.catalogSeq;try{let o=await D(s,e,"catalog");if(i!==this.catalogSeq||e!==this.watchId)return;this.catalog=us(o)}catch(o){if(i!==this.catalogSeq||e!==this.watchId)return;nt(o)&&(this.catalog=void 0)}}async loadHttpLibrary(){let e=this.hass;if(!e)return;let s=++this.httpLibrarySeq;try{let i=await cn(e);if(s!==this.httpLibrarySeq)return;this.httpLibrary=_n(i)}catch(i){if(s!==this.httpLibrarySeq)return;Dn(i)&&(this.httpLibrary=void 0)}}async loadStatusPages(e){let s=this.hass;if(!s)return;let i=++this.statusPagesSeq;try{let o=await D(s,e,"status_pages");if(i!==this.statusPagesSeq||e!==this.watchId)return;this.statusPages=ls(o)}catch(o){if(i!==this.statusPagesSeq||e!==this.watchId)return;nt(o)&&(this.statusPages=void 0)}}async loadPages(e){let s=this.hass;if(!s)return;let i=++this.pagesSeq;try{let o=await D(s,e,"pages");if(i!==this.pagesSeq||e!==this.watchId)return;this.pagesRecord={revision:o.revision,document:o.document},o.revision>0&&E(o.document)&&!(it(e)?.saving??!1)&&ks(e,o.document,o.revision).mergedIntoEdits&&(this.note={kind:"warn",text:"The pages changed elsewhere. Your edits are kept."})}catch{}}async loadBehavior(e){let s=this.hass;if(!s)return;let i=++this.behaviorSeq;try{let o=await D(s,e,"behavior");if(i!==this.behaviorSeq||e!==this.watchId)return;this.behavior=o.revision>0&&E(o.document)?o.document:void 0}catch{if(i!==this.behaviorSeq||e!==this.watchId)return;this.behavior=void 0}}async load(e,s=!1){let i=this.hass;if(!i)return;if(s&&this.holdReload){this.reloadPending=!0;return}let o=++this.loadSeq;this.stopPolling(),s||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let r=await D(i,e,"menus");if(o!==this.loadSeq)return;if(s&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(r),this.loadError=void 0}catch(r){if(o!==this.loadSeq)return;ri(r)?(this.unsupported=!0,this.loadError=void 0):s||(this.loadError=Ae(r)),this.restartDraft?.watchId===e&&(this.restartDraft=void 0)}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(e))}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(e){let s=this.watchId;this.record=e;let i=e.revision>0?rt(e.document):void 0;if(s===void 0||i===void 0)return;let o=this.restartDraft;o!==void 0&&o.watchId===s&&e.revision>=o.revision&&(this.restartDraft=void 0,(J(s)?.dirty??!1)||Re(s));let r=Ti(s,i,e.revision);r.replaced.length>0?this.note={kind:"warn",text:Jt(r.replaced)}:r.mergedIntoEdits&&(this.note={kind:"warn",text:"The menus changed somewhere else. Your edits are kept."}),this.requestUpdate()}async loadHistory(e){let s=this.hass;if(!s||this.historyState==="unsupported")return;let i=++this.historySeq;try{let o=await sn(s,e,"menus");if(i!==this.historySeq||e!==this.watchId)return;this.history=Array.isArray(o?.entries)?o.entries:[],this.historyState="ready"}catch(o){if(i!==this.historySeq||e!==this.watchId)return;this.historyState=We(o)==="unknown_command"?"unsupported":"error"}}startSubscription(e){let s=this.hass;if(this.endSubscription(),!s)return;let i=++this.subscribeSeq;an(s,e,o=>{i===this.subscribeSeq&&(o.kind==="catalog"?fs(o,this.catalog)&&this.loadCatalog(e):o.kind==="status_pages"?this.loadStatusPages(e):o.kind==="pages"?this.loadPages(e):o.kind==="behavior"?this.loadBehavior(e):o.kind==="voice"?this.loadVoice(e):o.kind==="menus"&&o.revision!==(this.record?.revision??0)&&this.load(e,!0))}).then(o=>{i===this.subscribeSeq?this.unsubscribe=o:o().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let e=this.unsubscribe;this.unsubscribe=void 0,e?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||Sn(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},Ar))}async poll(){this.pollTimer=void 0;let e=this.hass,s=this.watchId,i=this.record;if(!(!e||s===void 0||i===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let o=await D(e,s,"menus");if(s!==this.watchId||this.record!==i)return;o.revision===i.revision?this.record={...i,delivered_revision:o.delivered_revision,delivered_at:o.delivered_at,rejected_revision:o.rejected_revision,rejected_at:o.rejected_at,rejected_reason:o.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(o),this.loadHistory(s))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,s){let i=this.draft;if(!i||this.saving)return!1;let o=i.apply(e(i.document),this.scrubKey??s);return this.requestUpdate(),o}editPages(e,s){let i=this.pagesDraft;if(!i||this.saving)return!1;let o=this.scrubKey??s,r=i.apply(e(i.document),o===void 0?void 0:{coalesce:o});return this.requestUpdate(),r}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let e=this.icons??zn,s=this.iconMemo;if(s!==void 0&&s.provider===e&&s.tick===this.iconsTick)return s.icons;let i=Yn(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:i},i}targets(){return{pages:this.pages,statusPages:this.statusPages??this.catalog?.statusPages??[],httpActions:En(this.catalog,this.httpLibrary)?.httpActions??[],phrases:this.voiceDocument===void 0?void 0:Mt(this.voiceDocument)}}screen(){let e=this.watches.find(s=>s.owner_watch_id===this.watchId);return(Be(e?.screen_size)??Ke).screen}viewHost(){let e=this.draft,s=this.hass;if(e===void 0||s===void 0)return;let i=this,o=Qt(this.pagesDocument);return{hass:s,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.stageScale,switcherPages:o.filter(r=>!r.hidden).map(({hidden:r,...a})=>a),switcherRows:o,switcherSettings:r=>this.switcherSettingsHost(r),get document(){return e.document},get targets(){return i.targets()},get catalogKnown(){return i.catalog!==void 0},get httpLibrary(){return i.httpLibrary===void 0?void 0:i.httpLibrary.revision>0?"held":"empty"},get statusPagesKnown(){return i.statusPages!==void 0},get voice(){return i.voiceContext()},get busy(){return i.saving},edit:(r,a)=>this.draft===e&&this.edit(r,a),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}switcherSettingsHost(e){let s=this.pagesDraft;if(s===void 0||tt(s.document,e)===void 0)return;let i=this,o=this.memoIcons();return{pageId:e,icons:o,symbols:this.symbols,uiState:this.uiState,get page(){return tt(s.document,e)??{}},get busy(){return i.saving},edit:(r,a)=>{this.pagesDraft===s&&this.editPages(r,a?.typing===!0?`switcher:${e.toUpperCase()}`:void 0)},endCoalesce:()=>s.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.undoDraft?.undo()&&this.requestUpdate()}redo(){this.undoDraft?.redo()&&this.requestUpdate()}discard(){if(this.saving)return;let e=this.draft?.discard()??!1,s=this.pagesDraft?.discard()??!1;(e||s)&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,s=this.watchId;this.endScrub();let i=this.draft,o=this.pagesDraft;if(!e||s===void 0||!i||this.saving)return;let r=i.dirty,a=o?.dirty??!1;if(!r&&!a)return;this.note=void 0;let d=r?await this.saveMenus(e,s,i):void 0,u=a&&o!==void 0&&this.pagesDraft===o?await this.savePages(e,s,o):void 0;s===this.watchId&&(this.note=Kr(d,u))}async saveMenus(e,s,i){let o=$i(i,{prepare:Qs,save:(a,d)=>fe(e,s,"menus",a,d).catch(u=>{throw Le(u)}),fetch:async()=>{let a=await D(e,s,"menus").catch(d=>{throw Le(d)});return{revision:a.revision,document:a.document}}});this.followedSave=i.saveDone,this.requestUpdate();let r=await o.catch(a=>({ok:!1,revision:i.revision,merged:!1,code:We(a)??"unknown",message:Ae(a)}));return this.saveEnded(s),Mo(r)}async savePages(e,s,i){let o=Ss(i,{prepare:a=>Ms(cs(a),i.base,this.hass?.states),save:(a,d)=>fe(e,s,"pages",a,d).catch(u=>{throw Le(u)}),fetch:async()=>{let a=await D(e,s,"pages").catch(d=>{throw Le(d)});return{revision:a.revision,document:a.document}}});this.followedPagesSave=i.saveDone,this.requestUpdate();let r=await o.catch(a=>({ok:!1,revision:i.revision,merged:!1,code:We(a)??"unknown",message:Ae(a)}));return this.pagesSaveEnded(s),bn(r)}async startWithDefaults(){let e=this.hass,s=this.watchId;if(!e||s===void 0||this.starting)return;this.starting=!0,this.note=void 0;let i=await Mi((o,r)=>fe(e,s,"menus",o,r));if(this.starting=!1,s===this.watchId){if(i.ok)this.note={kind:"ok",text:"Started with the defaults. The watch picks them up the next time it checks."};else if(i.code==="no_record"){this.note={kind:"warn",text:`${ii} Go to Watch app, Settings, Pair a device.`};return}else if(i.code==="conflict")this.note={kind:"warn",text:"Menus arrived meanwhile, so those are shown."};else if(i.code==="unsupported"){this.unsupported=!0;return}else{this.note={kind:"err",text:`Could not start: ${i.message}`};return}this.load(s,!0)}}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(e){let s=this.hass,i=this.watchId,o=this.record;if(!s||i===void 0||o===void 0||this.draft?.dirty)return;let r={entry:e,baseRevision:o.revision};this.restoreAsk=r,on(s,i,"menus",e.revision).then(a=>{this.restoreAsk===r&&(this.restoreAsk={...r,summary:Br(a.document)})},()=>{})}async restore(){let e=this.hass,s=this.watchId,i=this.restoreAsk;if(!e||s===void 0||i===void 0||this.restoring)return;this.restoring=!0;let o;try{let r=await rn(e,s,"menus",i.entry.revision,i.baseRevision);o={kind:"ok",text:`Revision ${i.entry.revision} is back.`},s===this.watchId?this.restartDraft={watchId:s,revision:r.revision}:(J(s)?.dirty??!1)||Re(s)}catch(r){let a=We(r);a==="conflict"?o={kind:"warn",text:"Not restored. The menus changed somewhere else, so the newest copy is shown."}:a==="no_record"?o={kind:"warn",text:"Not restored. Home Assistant no longer holds menus for this watch."}:a==="not_found"?o={kind:"warn",text:"Not restored. That save is no longer kept."}:a==="unknown_command"?(this.historyState="unsupported",o={kind:"warn",text:"This version of the integration cannot restore menus. Update it to restore an earlier save."}):o={kind:"err",text:`Could not restore: ${Ae(r)}`}}finally{this.restoring=!1,this.restoreAsk===i&&this.closeAsk()}s===this.watchId&&(this.note=o,this.load(s,!0))}render(){let e=this.watches,s=this.draft;return c`
      <div class="pe-top">
        ${this.renderTopBar(s,e)}
        ${this.note?c`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:p}
      </div>
      ${this.renderBody(e)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):p}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=To}renderTopBar(e,s){let i=e!==void 0&&!this.unsupported,o=i&&this.dirty,r=this.shellOwnsWatch;return c`<div class="wa-bar ${this.stacked?"stacked":""}" role="toolbar" aria-label="Watch menus">
      ${this.haMenu?c`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${S("menu")}</button>`:p}
      ${r?p:c`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():gi(void 0,!1)}>${S("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${r?p:this.renderWatchPicker(s)}
      ${this.renderSyncPill(i?e:void 0)}
      ${this.renderTopMenu(i?e:void 0)}
      ${i?c`<button class="primary save ${o?"dirty":""}" ?disabled=${!o||this.saving}
          title=${o?`Save (${Yt}S). A save reaches the watch the next time it checks.`:`Nothing to save (${Yt}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        <span class="tb-saved" title=${o?"Unsaved changes":""}>${Nn(this.record)}</span>`:p}
      ${r?p:c`<button class="tb-btn tb-pages" title="The watch's pages, as Home Assistant keeps them"
        @click=${()=>this.onPages?this.onPages():vi(void 0)}>${S("pages")}<span>Pages</span></button>`}
      ${this.barActions}
      <button class="help" title="Help: the quick menu editor" aria-label="Help"
        @click=${()=>window.open(wi,"_blank","noopener")}>?</button>
    </div>`}renderSyncPill(e){let s=this.record;if(s===void 0||s.revision<=0||this.unsupported)return p;let i=e===void 0?{size:0,limit:1}:at(e.document),o=Je({record:s,size:i.size,limit:i.limit,noun:"menus",historyState:this.historyState,device:this.device});return c`<span class="tb-sync ${o.tone==="ok"?"ok":"warn"}" title=${`${o.state}. ${o.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${o.state}</span>
    </span>`}noRecordState(e=this.watches){return xn(e.find(s=>s.owner_watch_id===this.watchId))}canStart(){let e=this.record;return this.watchId!==void 0&&e!==void 0&&e.revision<=0&&!this.unsupported}renderTopMenu(e){let s=this.canStart();if(e===void 0&&!s)return p;let i=this.topMenuOpen,o=r=>()=>{this.topMenuOpen=!1,r()};return c`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${i?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!i}}>···</button>
      ${i?c`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${e?c`<button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title="Go back to the copy Home Assistant holds. Undo brings the edits back."
          @click=${o(()=>this.discard())}>Discard edits</button>`:p}
        ${s?c`<button class="row" role="menuitem" ?disabled=${this.starting}
          @click=${o(()=>{Ue(this.noRecordState())&&this.startWithDefaults()})}>${this.noRecordState()==="wait"?Ve:xt}</button>`:p}
      </div>`:p}
    </span>`}personColor(e){let s=Wn(this.owners.length>0?this.owners:this.ownList??[]);return Ln(s.findIndex(i=>i.owners.some(o=>o.owner_watch_id===e)))}renderWatchPicker(e){if(e.length<2)return p;let s=e.find(r=>r.owner_watch_id===this.watchId),i=this.watchMenuOpen,o=r=>{let a=r===void 0?void 0:this.personColor(r);return c`<span class="pe-chip-glyph" style=${a?`--pe-person: ${a}`:p} aria-hidden="true">${S("watch")}</span>`};return c`<span class="picker me-watch-picker">
      <button type="button" class="tb-browse me-watch-btn" aria-haspopup="menu" aria-expanded=${i?"true":"false"}
        title="Choose the watch whose menus are shown" @click=${()=>{this.watchMenuOpen=!i}}>
        ${o(s?.owner_watch_id)}<span class="tb-browse-l">${s?me(s,e):"Choose a watch"}</span>
        <span class="me-caret" aria-hidden="true">${S("chevron")}</span>
      </button>
      ${i?c`<div class="pop-menu me-watch-menu" role="menu" aria-label="Watches">
        ${e.map(r=>{let a=r.owner_watch_id===this.watchId;return c`<button type="button" class="row me-watch-row" role="menuitemradio" aria-checked=${a?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,a||this.openWatch(r.owner_watch_id)}}>
            ${o(r.owner_watch_id)}<span class="me-watch-name">${me(r,e)}</span>
            <span class="me-watch-check" aria-hidden="true">${a?S("check"):p}</span>
          </button>`})}
      </div>`:p}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=To?this.columns:Tn(this.hostWidth-Wr,this.columns,Zt)}renderGutter(e){return c`<div class="gutter ${e}" role="separator" aria-orientation="vertical"
      aria-label=${e==="left"?"Resize the menus and slots column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${s=>{let i=this.fittedColumns();Rn(s,{side:e,base:e==="left"?i.left:i.right,limits:Zt,onWidth:o=>{this.columns={...this.columns,[e]:o}},onEnd:()=>je(Xt,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[e]:Gt[e]},je(Xt,this.columns)}}></div>`}get stageScale(){return this.zoom??Xe(this.narrow||this.stacked)}setZoom(e){this.zoom=e,eo(e)}renderStage(e,s){let i=s.find(l=>l.owner_watch_id===this.watchId),o=Be(i?.screen_size),r=o??Ke,a=[...yo(e),r.label],d=this.undoDraft,u=qt(_(e));return c`<div class="card canvas-card me-canvas" aria-label="Menu">
      <div class="cv-head">
        <span class="cv-title" title=${u}>${u}</span>
        ${i!==void 0?c`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${me(i,s)}</span></span>`:p}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${o===void 0?`${r.label}, this watch's size is not known`:a.join(" \xB7 ")}><span class="fam">${a.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!d?.canUndo} title=${`Undo (${Yt}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${S("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!d?.canRedo} title=${_o?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${S("redo")}</button>
        </span>
      </div>
      <div class="stage-area me-stage-area">
        ${this.renderStageTools(r.label)}
        <div class="me-stage-body">${vo(e)}</div>
        <div class="under"><span class="tail">${bo(e)}</span></div>
      </div>
    </div>`}renderStageTools(e){let s=this.stageScale,i=Xe(this.narrow||this.stacked);return c`<div class="stage-tools" role="toolbar" aria-label="Stage tools">
      <button class="tb me-case" aria-disabled="true" tabindex="-1" title=${`This watch's screen, ${e}.`}>
        ${S("watch")}<span class="word keep">${e}</span></button>
      <span class="tb-sep" aria-hidden="true"></span>
      <span class="tb-zoom" role="group" aria-label="Zoom">
        <button class="tb icon me-zoom-out" ?disabled=${s<=et(s)} aria-label="Zoom out" title="Zoom out"
          @click=${()=>this.setZoom(et(s))}>−</button>
        <button class="tb pct" aria-label=${`Zoom ${ae(s)}. Back to fit`}
          title=${`The watch at ${ae(s)} of its own points. Click to fit it again (${ae(i)}).`}
          @click=${()=>this.setZoom(void 0)}>${ae(s)}</button>
        <button class="tb icon me-zoom-in" ?disabled=${s>=Qe(s)} aria-label="Zoom in" title="Zoom in"
          @click=${()=>this.setZoom(Qe(s))}>+</button>
      </span>
    </div>`}renderBody(e){if(e.length===0){let d=this.owners.length===0&&this.ownList===void 0;return c`<div class="pe-empty">${d?"Loading\u2026":"No watch has connected to this Home Assistant yet."}</div>`}if(this.unsupported)return c`<div class="pe-empty"><b>${oi}</b></div>`;if(this.loading)return c`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let d=this.watchId;return c`<div class="pe-empty">
        <span>Could not read this watch's menus: ${this.loadError}</span>
        ${d===void 0?p:c`<button class="pe-btn" @click=${()=>{this.load(d)}}>Try again</button>`}
      </div>`}let s=this.record;if(s===void 0)return c`<div class="pe-empty">Loading…</div>`;let i=this.draft,o=this.viewHost();if(s.revision<=0||i===void 0||o===void 0){let d=this.watchId===void 0?void 0:J(this.watchId),u=this.watchId,l=this.noRecordState(e);return c`<div class="pe-empty"><b>${ni}</b><span>${$n(l,si)}</span>
        ${l==="wait"?c`<button class="link start-fresh" ?disabled=${this.starting} @click=${()=>{Ue(l)&&this.startWithDefaults()}}>${this.starting?"Starting\u2026":Ve}</button>`:c`<button class="pe-btn pe-primary" ?disabled=${this.starting} @click=${()=>{this.startWithDefaults()}}>${this.starting?"Starting\u2026":xt}</button>`}
        ${d?.dirty&&u!==void 0?c`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when menus are here again.</span>
          <button class="pe-btn" @click=${()=>{Re(u),this.requestUpdate()}}>Discard the kept edits</button>`:p}
      </div>`}let r=this.fittedColumns(),a=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"";return c`<div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${r.left}px;--wa-right:${r.right}px;${a}`}>
      <div class="column left">
        ${fo(o)}
        ${go(o)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(o,e)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${ko(o)}
      </div>
    </div>
    ${this.renderFoot(s,i.document,i.dirty)}`}renderFoot(e,s,i){let o=at(s),r=Je({record:e,size:o.size,limit:o.limit,noun:"menus",historyState:this.historyState,device:this.device}),a=this.watchId;return c`${Un({status:r,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?qn({noun:"menus",record:e,entries:this.history,historyState:this.historyState,dirty:i,restoring:this.restoring,onRetry:()=>{a!==void 0&&(this.historyState="loading",this.loadHistory(a))},onRestore:d=>{this.historyOpen=!1,this.askRestore(d)},onClosed:()=>{this.historyOpen=!1}}):p}
    ${this.rawOpen?jn({noun:"menus",document:s,revision:e.revision,dirty:i,copied:this.rawCopied,onCopy:d=>{Kn(d).then(u=>{this.rawCopied=u})},onClosed:()=>{this.rawOpen=!1}}):p}`}renderRestoreAsk(e){let s=this.record,i=Nr(e.entry.updated_at);return c`<dialog class="pe-ask" aria-labelledby="me-ask-title"
      @cancel=${o=>{this.restoring&&o.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="me-ask-title">Restore revision ${e.entry.revision}?</h3>
      <p>${Vr(e.entry.updated_by)}${i?` ${i}`:""}, ${Lr(e.entry.size)}.</p>
      ${e.summary?c`<p class="pe-muted">${e.summary}</p>`:p}
      <p>It is saved again as a new revision${s?`, after revision ${s.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[vn,un,ln,hn,pn,fn,mn,gn,ts,pe`
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
  `,$o,Bn]}};v([M({attribute:!1})],g.prototype,"hass",2),v([M({attribute:!1})],g.prototype,"owners",2),v([M({attribute:!1})],g.prototype,"ownerId",2),v([M({type:Boolean,reflect:!0})],g.prototype,"narrow",2),v([M({attribute:!1})],g.prototype,"icons",2),v([M({attribute:!1})],g.prototype,"iconsTick",2),v([M({attribute:!1})],g.prototype,"haMenu",2),v([M({attribute:!1})],g.prototype,"onHaMenu",2),v([M({attribute:!1})],g.prototype,"onBack",2),v([M({attribute:!1})],g.prototype,"onPages",2),v([M({attribute:!1})],g.prototype,"barActions",2),v([M({attribute:!1})],g.prototype,"shellOwnsWatch",2),v([M({attribute:!1})],g.prototype,"phones",2),v([b()],g.prototype,"watchId",2),v([b()],g.prototype,"record",2),v([b()],g.prototype,"unsupported",2),v([b()],g.prototype,"catalog",2),v([b()],g.prototype,"statusPages",2),v([b()],g.prototype,"httpLibrary",2),v([b()],g.prototype,"pagesRecord",2),v([b()],g.prototype,"behavior",2),v([b()],g.prototype,"voiceDocument",2),v([b()],g.prototype,"loading",2),v([b()],g.prototype,"loadError",2),v([b()],g.prototype,"history",2),v([b()],g.prototype,"historyState",2),v([b()],g.prototype,"note",2),v([b()],g.prototype,"restoreAsk",2),v([b()],g.prototype,"restoring",2),v([b()],g.prototype,"starting",2),v([b()],g.prototype,"historyOpen",2),v([b()],g.prototype,"rawOpen",2),v([b()],g.prototype,"rawCopied",2),v([b()],g.prototype,"ownList",2),v([b()],g.prototype,"topMenuOpen",2),v([b()],g.prototype,"watchMenuOpen",2),v([b()],g.prototype,"zoom",2),v([b()],g.prototype,"columns",2),v([b()],g.prototype,"hostWidth",2),v([b()],g.prototype,"hostHeight",2);customElements.get("wa-menu-editor")||customElements.define("wa-menu-editor",g);export{Xt as ME_COLUMNS_KEY,Po as WATCH_SWITCHER_COLORS,Fr as WATCH_SWITCHER_LEFT_OUT_COLOR,g as WaMenuEditor,Kr as joinSaveNotes,jr as watchMenuPageTargets,Br as watchMenusSummary,vc as watchSwitcherPages,Qt as watchSwitcherRows};
