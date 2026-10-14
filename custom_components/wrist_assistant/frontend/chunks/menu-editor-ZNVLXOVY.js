import{a as xe,g as ke,h as kt}from"./chunk-RUZTQMS7.js";import{d as ts,e as L,f as bt,g as St,h as $e,i as ns,j as is}from"./chunk-OJPD6WGR.js";import{L as ss,M as rs,N as os,a as bi,b as tt,e as Si,i as $i,j as xi,la as ls,ma as us,na as xt,oa as hs}from"./chunk-IOJIKNHC.js";import{o as ei,p as Je,q as se,r as Ye,s as Ze,w as ii,x as si,y as ri,z as oi}from"./chunk-YBXTPCVB.js";import{b as Tn,c as We,d as Pn,e as Ve,f as Rn}from"./chunk-ZOJGMATP.js";import{$ as Ji,A as be,B as Se,C as K,D as ot,E as Ai,F as Di,G as at,H as Li,I as Wi,J as Vi,K as ct,L as _i,M as Ni,N as dt,O as lt,P as qi,Q as Ui,R as Fi,S as ji,T as ut,U as ht,V as Bi,W as pt,X as Ki,Y as ft,Z as zi,_ as oe,a as nt,aa as Yi,ba as mt,ca as gt,d as ge,da as wt,e as it,ea as vt,fa as Zi,g as st,ga as Gi,h as Mi,ha as Xi,i as j,j as B,ja as Qi,k as Ti,ka as yt,l as $,la as es,m as re,n as Pi,o as we,p as Ri,q as rt,r as Ci,s as Hi,t as Ei,u as ve,v as Oi,w as ye,x as Ii,y as E,z as T}from"./chunk-HYAF3BAP.js";import{a as ps,b as fs,c as ms,d as gs,e as ws,f as vs,g as ys}from"./chunk-FMEYBIGP.js";import{Pa as fi,Qa as et,Ra as mi,Sa as gi,Ta as wi,Ua as vi,b as ci,c as di,cb as me,d as li,db as yi,j as ui,m as hi,o as Qe,p as pi,xb as ki}from"./chunk-XDMMZFSQ.js";import{Ib as as,Jb as cs,Kb as ds,Mb as $t,sa as ai}from"./chunk-UDRG2OIJ.js";import{a as Fe,b as je,c as Nn,d as qn,e as Un,f as Fn,g as jn,h as Bn,i as Kn,j as ti,k as ni}from"./chunk-WGYFGRT6.js";import{b as Vn,p as _n,w as Zn}from"./chunk-LSDFWCUQ.js";import{a as zn,b as Jn,d as Yn}from"./chunk-QUOL6HJ4.js";import{$b as pe,$c as xs,Ab as En,Bb as On,Cb as In,Jb as An,Kb as Dn,Lb as Ln,Mb as Wn,Nb as I,Ob as U,Pb as he,Q as Ne,Rb as R,Sb as ie,V as qe,Xa as Hn,Yc as bs,Zb as Ue,Zc as Ss,_c as $s,fe as ks,h as on,na as Cn,s as _e}from"./chunk-ASOFVLTH.js";import{Ag as De,Bg as en,Cg as tn,Dg as nn,Eg as sn,Fg as rn,_h as gn,b as de,c,cg as Qt,d as Gt,dh as D,eh as S,f as h,hj as Sn,i as Xt,ih as an,ii as wn,j as M,ji as le,jj as $n,k as b,kh as cn,kj as xn,lh as dn,lj as kn,mh as ln,mi as vn,nh as un,ni as yn,oh as hn,oi as Le,ph as pn,pi as bn,qh as fn,yg as H,zh as mn}from"./chunk-RYLMRUWW.js";import{f as Xe}from"./chunk-WIDK423N.js";import{Q as Ge,j as F,l as Be,m as Gn,n as fe,o as Ke,p as Xn,q as ze,r as Qn}from"./chunk-Y5WD6GQY.js";import{a as ue,b as Mn}from"./chunk-KXSD4G27.js";import{a as g}from"./chunk-LO2NM3CE.js";var Pt="In the page switcher",Tr=["switcherIcon","switcherColor","switcherText","switcherDisplayMode","hideFromSwitcher"],Rt="switcher-settings",Ms=`${Rt}:resetDot`;function Ts(t){return yi(t,Tr,n=>{let e=me(n);return[e.switcherIcon,e.switcherColor,e.switcherText,e.switcherDisplayMode??"text",e.hideFromSwitcher]})}function Ps(t){let n=me(t);return n.hideFromSwitcher?"Hidden":n.switcherText??(n.switcherDisplayMode==="icon"?"Icon":"Shown")}function Ct(t,n){return`${Rt}:typed:${t.pageId.toUpperCase()}:${n}`}function Mt(t,n){let e=t.uiState.get(Ct(t,n));return typeof e=="string"?e:void 0}function Pr(){if(typeof document>"u")return null;let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t}function Rr(t){let n=Pr(),e=typeof HTMLElement<"u"&&n instanceof HTMLElement?n.closest("[data-sw-field]")?.dataset.swField:void 0;for(let i of[...t.uiState.keys()])i.startsWith(`${Rt}:typed:`)&&(e===void 0||i!==Ct(t,e))&&t.uiState.delete(i)}function G(t,n,e=!1){let i=t.uiState.delete(Ms);t.busy||t.edit(n,e&&!i?{typing:!0}:void 0)}function Tt(t,n,e){let i=Ct(t,n),s=a=>typeof HTMLInputElement<"u"&&a instanceof HTMLInputElement&&a.type==="text"&&!a.closest(".alpha");return c`<div class="ts-typing" data-sw-field=${n}
    @input=${{capture:!0,handleEvent:a=>{s(a.target)&&t.uiState.set(i,a.target.value)}}}
    @click=${{capture:!0,handleEvent:a=>{!(a.target instanceof Element)||a.target.closest(".reset-dot")===null||(t.endCoalesce(),t.uiState.set(Ms,!0))}}}
    @change=${a=>{let d=a.target;typeof HTMLInputElement>"u"||!(d instanceof HTMLInputElement)||(d.type==="color"&&t.endCoalesce(),d.type==="checkbox"&&(t.uiState.delete(i),t.endCoalesce(),t.requestUpdate()))}}
    @focusout=${a=>{!s(a.target)||a.relatedTarget instanceof Node&&a.currentTarget.contains(a.relatedTarget)||(t.uiState.delete(i),t.endCoalesce(),t.requestUpdate())}}>${e}</div>`}function Rs(t){Rr(t);let n=t.page,e=me(n),i=e.switcherDisplayMode??"text",s=fi.map(d=>[d,d==="icon"?"Icon":"Name"]),r=typeof n.name=="string"?n.name:"",o=d=>G(t,l=>et(l,t.pageId,d)),a=d=>G(t,l=>mi(l,t.pageId,d),!0);return c`
    ${R("Hidden",e.hideFromSwitcher,d=>G(t,l=>vi(l,t.pageId,d)),!1)}
    ${e.hideFromSwitcher?c`<div class="hint ts-under">The page stays on the watch. Only the switcher leaves it out.</div>`:h}
    ${U("Show as",s.some(([d])=>d===i)?i:"text",s,d=>G(t,l=>wi(l,t.pageId,d)))}
    ${Tt(t,"switcherText",Ln("Name",Mt(t,"switcherText")??e.switcherText??"",d=>G(t,l=>gi(l,t.pageId,d),!0),{placeholder:r}))}
    <div class="ts-chips" role="group" aria-label="Switcher icon">
      <button type="button" class="pe-chip ${e.switcherIcon===void 0?"on":""}" aria-pressed=${e.switcherIcon===void 0?"true":"false"}
        title="The watch picks one from the page's first tile" @click=${()=>G(t,d=>et(d,t.pageId,""))}>Automatic icon</button>
    </div>
    ${Tt(t,"switcherIcon",pe({icons:t.icons,symbols:t.symbols},Mt(t,"switcherIcon")??e.switcherIcon??"",o,"sw:switcher-icon",{emptyText:"Picked by the watch",tint:e.switcherColor}))}
    ${Tt(t,"switcherColor",c`<div class="ts-no-alpha">${ie("Color",Mt(t,"switcherColor")??e.switcherColor,a,!0,null,{switchOn:e.switcherColor!==void 0})}</div>`)}
    <div class="hint ts-under">Left empty, the watch shows the page's name and picks the icon and color itself.</div>`}var W=xe.routing;function Ht(t){return W.actions.find(n=>n.action===t)}function V(t){return Ht(t)?.keys??[]}function O(t){return Object.hasOwn(W.keys,t)?W.keys[t]:void 0}function Q(t){return F(t.voiceConfig)?t.voiceConfig:{}}function Cr(t,n){let e=W.legacy[`${t}.${n}`];return e===void 0?n:/reads as (\w+)/.exec(e)?.[1]??n}function _(t,n){let e=O(n);if(e===void 0)return;let i=Object.hasOwn(t,n)?t[n]:void 0;switch(e.type){case"enum":{let s=W.enums[e.enum??""]??[];return typeof i=="string"&&s.includes(i)?Cr(n,i):e.default}case"bool":return typeof i=="boolean"?i:e.default;case"int":{if(typeof i!="number"||!Number.isFinite(i))return e.default;let[s,r]=e.clamp??[-1/0,1/0];return Math.min(r,Math.max(s,Math.round(i)))}case"entity":return typeof i=="string"?i.trim():e.default;case"array":return Array.isArray(i)?i.filter(s=>typeof s=="string"):e.default}}function Hs(t,n){let e=O(n)?.shownWhen;if(e===void 0)return!0;let i=/^(\w+) is (not )?(.+)$/.exec(e.trim());if(i===null)return!0;let s=_(t,i[1]),r=i[3].split(/\s+or\s+/).map(a=>a.trim()),o=typeof s=="string"&&r.includes(s);return i[2]===void 0?o:!o}function Me(t,n){let e=O(n);if(e?.type!=="enum")return[];let i=W.labels[e.enum??""]??{},s=W.offered[n]??W.enums[e.enum??""]??[],r=_(t,n);return(typeof r=="string"&&!s.includes(r)?[r,...s]:s).map(a=>[a,i[a]??a])}function Es(t){return O(t)?.label??Hr[t]??t}var Hr={assistAutoSendOnPause:"Send When I Pause",broadcastImmediateListen:"Start Listening Immediately"};function Et(t,n,e){let i=O(n);if(i===void 0)return t;let s;switch(i.type){case"enum":if(typeof e!="string"||!Me(t,n).some(([o])=>o===e))return t;s=e;break;case"bool":if(typeof e!="boolean")return t;s=e;break;case"int":{if(typeof e!="number"||!Number.isFinite(e))return t;let[o,a]=i.clamp??[-1/0,1/0];s=Math.min(a,Math.max(o,Math.round(e)));break}case"entity":{if(e!==void 0&&typeof e!="string")return t;let o=(e??"").trim();if(o==="")return kt(t,n);s=o;break}case"array":{if(!Array.isArray(e)||!e.every(a=>typeof a=="string"))return t;let o=[...new Set(e.map(a=>a.trim()).filter(a=>a!==""))];if(o.length===0)return kt(t,n);s=o;break}}return(Object.hasOwn(t,n)?Ge(t[n],s):Ge(_(t,n),s))?t:ke(t,n,s)}function Os(t,n,e,i){let s=_(t,n),r=Array.isArray(s)?s:[];return i===r.includes(e)?t:Et(t,n,i?[...r,e]:r.filter(o=>o!==e))}function Er(t,n){switch(t.fallsBackTo){case"defaultAssistAgentId":return n?.agent;case"defaultTTSEngine":return n?.engine;case"defaultSpeakers":return n?.speakers;default:return}}function Or(t,n){let e=O(n);if(e?.fallsBackTo===void 0)return!1;let i=e.fallsBackWhen;if(i===void 0)return!0;let s=n.startsWith("assist")?"assistReplyOutputMode":n.startsWith("speakMessage")?"speakMessageOutputMode":"broadcastTargetMode",r=_(t,s);return typeof r=="string"&&i.includes(r)}function Ot(t,n,e,i){let s=O(n);if(s===void 0)return"None";if(!Or(t,n))return s.type==="array"?"None":"Not set";if(e===void 0)return"Default";let r=Er(s,e);return typeof r=="string"&&r.trim()!==""?`Default (${i(r.trim())})`:Array.isArray(r)&&r.length>0?`Default (${r.map(i).join(", ")})`:s.fallsBackTo==="defaultAssistAgentId"?"Default (Home Assistant default)":"Default (Not set)"}function Cs(t){return Array.isArray(t)?t.filter(n=>typeof n=="string"):[]}function X(t,n){let e=n.toUpperCase();return t.some(i=>i.toUpperCase()===e)}function Te(t,n,e){let i=Cs(n),s=Cs(e);return t.filter(r=>!X(i,r)&&(s.length===0||X(s,r)))}function Ir(t,n){return{hiddenPhraseIds:t.filter(e=>!X(n,e)),knownPhraseIds:t.slice()}}function Is(t,n,e,i){if(!X(n,e))return t;let s=Te(n,t.hiddenPhraseIds,t.knownPhraseIds);if(X(s,e)===i)return t;let r=i?n.filter(a=>X(s,a)||a.toUpperCase()===e.toUpperCase()):s.filter(a=>a.toUpperCase()!==e.toUpperCase()),o=Ir(n,r);return ke(ke(t,"hiddenPhraseIds",o.hiddenPhraseIds),"knownPhraseIds",o.knownPhraseIds)}function As(t){if(t!==void 0)return{agent:t.defaultAssistAgentId,engine:t.defaultTTSEngine,speakers:t.defaultSpeakers??[]}}function Ar(t,n,e,i,s){return be(t,n,e,r=>{if(!V($(r)).includes(i))return r;let o=Q(r),a=Et(o,i,s);return a===o?r:st(r,"voiceConfig",a)})}function Dr(t,n,e,i,s,r){return be(t,n,e,o=>{if(!V($(o)).includes(i))return o;let a=Q(o),d=Os(a,i,s,r);return d===a?o:st(o,"voiceConfig",d)})}function Lr(t,n,e,i,s,r){return be(t,n,e,o=>$(o)==="ttsMenu"?Is(o,i,s,r):o)}function Ds(t){return Object.keys(Q(t)).some(n=>V($(t)).includes(n))}function Ls(t){let n=$(t);return V(n).length>0||n==="ttsMenu"}function Ws(t,n){let e=t.states[n]?.attributes?.friendly_name;return typeof e=="string"&&e.trim()!==""?e:n}function Wr(t,n,e,i){let s=ds(t.hass.states),r=$t(s,e),o=a=>R(a.missing?`${a.entityId} (not found)`:a.name,e.includes(a.entityId),d=>i(a.entityId,d));return c`<div class="me-sub-h">${n}</div>
    <div class="me-voice-list" role="group" aria-label=${n}>
      ${r.length===0?c`<div class="hint">No media players in Home Assistant.</div>`:r.map(o)}
    </div>`}function Vr(t,n,e,i){let s=O(e),r=As(t.voice?.defaults),o=s?.domain==="conversation"?as(t.hass.states):cs(t.hass.states,Object.keys(t.hass.services?.tts??{}),void 0),a=$t(o,i===""?[]:[i]);return[["",Ot(n,e,r,l=>a.find(u=>u.entityId===l&&!u.missing)?.name??Ws(t.hass,l))],...a.map(l=>[l.entityId,l.missing?`${l.entityId} (not found)`:l.name])]}function _r(t,n,e,i,s){let r=O(s);if(r===void 0||!Hs(i,s))return h;let o=Es(s),a=_(i,s),d=(l,u)=>t.edit(p=>Ar(p,n,e,s,l),u);switch(r.type){case"enum":return I(o,String(a),Me(i,s),l=>d(l),{snapBack:!0,def:String(r.default)});case"bool":return R(o,a===!0,l=>d(l),r.default);case"int":{let l=typeof a=="number"?a:Number(r.default),u=xe.volume,[p,f]=r.clamp??[u.min,u.max];return c`${he(o,l,y=>d(y,`slot:${e}:${s}`),{min:p,max:f,step:u.step,def:Number(r.default),format:y=>`${Math.round(y)}${u.unit}`})}
        <div class="ts-after">${u.presets.map(y=>c`<button type="button" class="pe-chip ${y.value===l?"on":""}"
          aria-pressed=${y.value===l?"true":"false"} @click=${()=>d(y.value)}>${y.label} ${y.value}%</button>`)}</div>`}case"entity":{let l=typeof a=="string"?a:"";return I(o,l,Vr(t,i,s,l),u=>d(u===""?void 0:u),{snapBack:!0})}case"array":{let l=Array.isArray(a)?a:[],u=As(t.voice?.defaults),p=r.whenBlank!==void 0?`None picked: ${r.whenBlank}.`:r.fallsBackTo!==void 0?`None picked: ${Ot(i,s,u,f=>Ws(t.hass,f))}.`:"None picked.";return c`${Wr(t,o,l,(f,y)=>t.edit(v=>Dr(v,n,e,s,f,y)))}
        <div class="hint ${l.length===0&&r.fallsBackTo===void 0&&r.whenBlank===void 0?"warn":""}">${l.length===0?p:`${l.length} picked.`}</div>`}}}function Nr(t,n,e){let i=typeof e.id=="string"?e.id:"",s=Q(e),r=V($(e));return c`${t.voice?.defaults===void 0?c`<div class="hint">${hs}.</div>`:h}
    ${r.map(o=>_r(t,n,i,s,o))}`}function qr(t,n,e){let i=typeof e.id=="string"?e.id:"",s=t.voice?.phrases;if(s===void 0)return c`<div class="hint">No voice settings saved for this watch yet. Save them once in Voice to pick the phrases this slot shows.</div>`;if(s.length===0)return c`<div class="hint">No phrases yet. Add them in Voice.</div>`;let r=s.map(u=>u.id),o=Te(r,e.hiddenPhraseIds,e.knownPhraseIds),a=Array.isArray(e.knownPhraseIds)?e.knownPhraseIds.filter(u=>typeof u=="string"):[],d=a.length>0&&r.some(u=>!a.some(p=>p.toUpperCase()===u.toUpperCase())),l=u=>o.some(p=>p.toUpperCase()===u.toUpperCase());return c`<div class="me-sub-h">${Ht("ttsMenu")?.slotLabel??"Phrase List"}</div>
    <div class="me-voice-list" role="group" aria-label="Phrases this slot shows">
      ${s.map(u=>R(u.name,l(u.id),p=>t.edit(f=>Lr(f,n,i,r,u.id,p))))}
    </div>
    <div class="hint">${o.length===0?"No phrase shows: the list on the watch is empty.":`${o.length} of ${s.length} show on the watch.`}</div>
    ${d?c`<div class="hint">A phrase added after this slot's list was set stays hidden here until it is ticked.</div>`:h}`}function Vs(t,n,e){let i=$(e);if(i==="ttsMenu")return qr(t,n,e);if(V(i).length>0)return Nr(t,n,e)}function _s(t,n){let e=$(n);if(e==="ttsMenu"){let o=t.voice?.phrases;return o===void 0?"":`${Te(o.map(d=>d.id),n.hiddenPhraseIds,n.knownPhraseIds).length} of ${o.length} phrases`}let i=Q(n),s=V(e)[0];if(s===void 0)return"";let r=_(i,s);return Me(i,s).find(([o])=>o===r)?.[1]??""}var js=[["anywhere","Anywhere menu"],["entity","Entity quick menu"],["switcher","Page switcher"]],Bs="Each page's icon, color and name are set here: pick a page in the Pages card.",Ur="Pick a page in the Pages card to set how it shows here.",Ks={anywhere:"Opens on any screen. Each place around the ring holds one slot.",entity:"Opens over a tile. Each type of entity has its own menu, and an entity can have a menu of its own.",switcher:Bs},Fr="The Anywhere menu, the Entity quick menu and the page switcher. A save reaches the watch the next time it checks.",jr="Tap a slot on the watch or in the list to edit it.",Ce=.36,He=44,Ee=22;function Br(t,n){let e=Math.min(t.width,t.height),i=s=>Math.round(s*1e4)/1e4;return{x:i(.5+(n.x-.5)*e/t.width),y:i(.5+(n.y-.5)*e/t.height)}}function zs(t,n,e=Ce){let i=(270-t*360/Math.max(1,n))*Math.PI/180,s=r=>Math.round(r*1e4)/1e4;return{x:s(.5+e*Math.cos(i)),y:s(.5+e*Math.sin(i))}}var Js="wrist-assistant-panel.menus.zoom.v1";function Ys(t=We()){try{let n=t?.getItem(Js);if(n==null||n==="")return;let e=Number(n);return ei.includes(e)?e:void 0}catch{return}}function Zs(t,n=We()){try{n?.setItem(Js,t===void 0?"":String(t))}catch{}}var Gs={name:{color:D.place,icon:"text"},slot:{color:D.content,icon:"content"},look:{color:D.look,icon:"look"},menu:{color:D.content,icon:"content"},style:{color:D.look,icon:"look"},switcherPage:{color:D.content,icon:"watch"}},Kr="#26a69a",zr=D.complication,N="menu-editor";function te(t,n,e){return`${t} ${t===1?n:e}`}function q(t,n){let e=t.states[n]?.attributes?.friendly_name;return typeof e=="string"&&e.trim()!==""?e:n}function Xs(t,n){return{entityId:n,displayName:n===""?"":q(t,n),domain:we(n)}}function Pe(t,n,e,i){return t.icons.render(n,e,i)??c`<span class="me-glyph-dot" style=${`background:${i}`}></span>`}function J(t){return j($(t))===void 0?{icon:nt.unknownActionIcon,color:nt.unknownActionColor}:{icon:typeof t.icon=="string"&&t.icon!==""?t.icon:"circle",color:typeof t.color=="string"?t.color:"#FFFFFF"}}function Qs(t){let n=$(t);if(n==="triggerEntity"){let i=re(t).entityId;return Ci(we(typeof i=="string"?i:""))}let e=j(n);return e===void 0?void 0:{icon:e.icon,color:e.color}}function k(t,n){return t.toUpperCase()===n.toUpperCase()}function Jr(t,n){return t.toUpperCase()===n.toUpperCase()}function Yr(t,n){let e=$(n),i=re(n),s=j(e);for(let r of s?.payload??[]){let o=i[r.key];if(!(typeof o!="string"||o==="")){if(r.type==="entity")return q(t.hass,o);if(r.target==="page")return t.targets.pages.find(a=>k(a.id,o))?.name??"A page not in the pages";if(r.target==="statusPage")return t.targets.statusPages.find(a=>k(a.id,o))?.name??"A status page";if(r.target==="httpAction")return t.targets.httpActions.find(a=>k(a.id,o))?.name??"An HTTP action";if(r.target==="ttsPhrase"){let a=t.targets.phrases;return a?.find(d=>k(d.id,o))?.name??(a===void 0?"A phrase":"A phrase that is gone")}}}}function Lt(t,n){return Yr(t,n)??B($(n))}function er(t){return`${K(typeof t.position=="string"?t.position:"")} \xB7 ${B($(t))}`}function Zr(t){let n=Se(),e=i=>{let s=n.indexOf(typeof i.position=="string"?i.position:"");return s<0?n.length:s};return t.slice().sort((i,s)=>e(i)-e(s))}function z(t){return ve(t)?.label??t}var tr="me:menu",nr="me:er:mode",ir="me:er:domain",At="me:er:entity",It="me:er:add";function C(t){let n=t.uiState.get(tr);return n==="entity"||n==="switcher"?n:"anywhere"}function Gr(t,n){n!==C(t)&&t.uiState.delete(Re),t.uiState.set(tr,n),t.requestUpdate()}var Re="me:sw:page";function sr(t){return t.switcherRows??t.switcherPages.map(n=>({...n,hidden:!1}))}function Y(t){if(C(t)!=="switcher")return;let n=t.uiState.get(Re);if(typeof n=="string")return sr(t).find(e=>k(e.id,n))}function Wt(t,n){n===void 0?t.uiState.delete(Re):t.uiState.set(Re,n),t.requestUpdate()}function rr(t){let n=Y(t);return n===void 0?void 0:t.switcherSettings?.(n.id)}function Vt(t){return js.find(([n])=>n===t)?.[1]??t}function _t(t){return t.uiState.get(nr)==="entity"?"entity":"domain"}function Nt(t){let n=t.uiState.get(ir);return typeof n=="string"&&ve(n)!==void 0?n:"light"}function qt(t){let n=oe(t.document),e=t.uiState.get(At);return typeof e=="string"&&n.includes(e)?e:n[0]}function Z(t){switch(C(t)){case"anywhere":return ye;case"entity":return or(t);case"switcher":return}}function or(t){if(_t(t)==="domain")return{list:"domain",domain:Nt(t)};let n=qt(t);return n===void 0?void 0:{list:"entity",entityId:n}}function Xr(t,n){return n.list==="anywhere"?"Anywhere menu":n.list==="domain"?`${z(n.domain)} menu`:`${q(t.hass,n.entityId)} menu`}function ar(t){return`me:sel:${Ii(t)}`}function ae(t,n){let e=t.uiState.get(ar(n));if(typeof e=="string")return E(t.document,n).find(i=>k(T(i),e))}function ce(t,n,e){t.uiState.set(ar(n),e),t.requestUpdate()}function Ut(t){if(Y(t)!==void 0)return Wt(t,void 0),!0;let n=Z(t);return n===void 0||ae(t,n)===void 0?!1:(ce(t,n,void 0),!0)}function cr(t,n,e){let i;t.edit(s=>{let r=Vi(s,n,{...e===void 0?{}:{position:e},targets:t.targets});return i=r.id,r.document}),i!==void 0&&ce(t,n,i)}function Ns(t){let e=(i,s)=>Math.round((s+(i-.5)/Ce*8)*100)/100;return c`<span class="thumb me-ring-thumb" aria-hidden="true"><svg viewBox=${`0 0 ${He} ${Ee}`}>
    <circle cx="22" cy="11" r=${8} class="me-thumb-track"></circle>
    ${t.map(i=>Gt`<circle cx=${e(i.x,22)} cy=${e(i.y,11)} r="2.2" fill=${i.color}></circle>`)}
  </svg></span>`}function Qr(t,n){return n===void 0?[]:E(t.document,n).flatMap(e=>{if(e.isVisible===!1)return[];let i=ot(typeof e.position=="string"?e.position:"");return i===void 0?[]:[{...i,color:J(e).color}]})}function eo(t,n){if(n==="anywhere")return te(E(t.document,ye).length,"slot","slots");if(n==="switcher")return te(t.switcherPages.length,"page","pages");if(_t(t)==="domain")return`By type \xB7 ${z(Nt(t))}`;let e=qt(t);return`By entity \xB7 ${e===void 0?"none yet":q(t.hass,e)}`}function to(t,n){if(n==="switcher"){let e=t.switcherPages;return Ns(e.map((i,s)=>({...zs(s,e.length),color:i.color})))}return Ns(Qr(t,n==="anywhere"?ye:or(t)))}function dr(t){let n=C(t);return c`<section class="card lc me-menus-card" aria-label="Menus"
    style=${`--c: var(--wa-lc-pages, #26a69a); --thumb-w: ${He}px; --thumb-h: ${Ee}px`}>
    <div class="lc-head">
      <span class="swatch">${S("radial")}</span><span class="lc-title">Menus</span>
      <span class="lc-sub" title=${Fr}>on the watch</span>
    </div>
    <div class="layers me-menu-list" role="list">
      ${js.map(([e,i])=>{let s=e===n,r=()=>{s||Gr(t,e)};return c`<div class="layer me-menu-row ${s?"hl":""}" data-menu=${e} role="listitem" tabindex="0"
          aria-current=${s?"true":"false"} aria-label=${i} title=${Ks[e]}
          @click=${r}
          @keydown=${o=>{o.target!==o.currentTarget||o.key!=="Enter"&&o.key!==" "||(o.preventDefault(),r())}}>
          <span class="grip" aria-hidden="true"></span>
          ${to(t,e)}
          <span class="name"><b><span class="nm-t">${i}</span></b><small>${eo(t,e)}</small></span>
          <span class="right"></span>
        </div>`})}
    </div>
  </section>`}function lr(t,n,e){return c`<span class="thumb me-thumb" style=${`--c:${e}`} aria-hidden="true"><span class="me-thumb-glyph">${Pe(t,n,14,e)}</span></span>`}function no(t,n,e,i){let s=T(e),r=J(e),o=i!==void 0&&k(s,T(i)),a=e.isVisible===!1,d=Lt(t,e),l=er(e),u=()=>ce(t,n,s);return c`<div class="layer me-slot-row ${o?"hl":""} ${a?"dim":""}" data-slot=${s} style=${`--k:${r.color}`}
    role="listitem" tabindex="0" aria-current=${o?"true":"false"} aria-label=${d}
    title=${`${d} \xB7 ${l}${a?", hidden":""}`}
    @click=${p=>{p.target instanceof Element&&p.target.closest("button")||u()}}
    @keydown=${p=>{p.target!==p.currentTarget||p.key!=="Enter"&&p.key!==" "||(p.preventDefault(),u())}}>
    <span class="grip" aria-hidden="true"></span>
    ${lr(t,r.icon,r.color)}
    <span class="name"><b><span class="nm-t">${d}</span></b><small>${l}</small></span>
    <span class="right">
      <span class="badges">${a?c`<span class="badge">hidden</span>`:h}</span>
      <span class="acts">
        <button type="button" class="icon danger" ?disabled=${t.busy} title="Remove" aria-label=${`Remove ${d}`}
          @click=${()=>t.edit(p=>ct(p,n,s))}>${S("delete")}</button>
      </span>
    </span>
  </div>`}function io(t,n,e){let i=n===void 0||n.list==="anywhere"?"By entity: none has a menu of its own yet.":n.list==="domain"?`${z(n.domain)} menu, by type`:`${q(t.hass,n.entityId)}'s own menu`;return c`<div class="lc-filter me-filter"><span class="lc-sub">${i}</span>
    ${e===void 0?h:c`<button type="button" class="lc-ghost sm" title="Pick the type or the entity in the menu's settings"
      @click=${()=>Ut(t)}>Change</button>`}
  </div>`}function so(t){return t.hidden?"Not in the switcher":t.text===void 0?"Shown as its icon":t.text===t.name?"Shown by name":`Shown as ${t.text}`}function ro(t,n,e){let i=e!==void 0&&k(e.id,n.id),s=so(n),r=()=>Wt(t,n.id);return c`<div class="layer me-page-row ${i?"hl":""} ${n.hidden?"dim":""}" data-page=${n.id} style=${`--k:${n.color}`}
    role="listitem" tabindex="0" aria-current=${i?"true":"false"} aria-label=${n.name}
    title=${`${n.name} \xB7 ${s}`}
    @click=${o=>{o.target instanceof Element&&o.target.closest("button")||r()}}
    @keydown=${o=>{o.target!==o.currentTarget||o.key!=="Enter"&&o.key!==" "||(o.preventDefault(),r())}}>
    <span class="grip" aria-hidden="true"></span>
    ${lr(t,n.icon,n.color)}
    <span class="name"><b><span class="nm-t">${n.name}</span></b><small>${s}</small></span>
    <span class="right"><span class="badges">${n.hidden?c`<span class="badge">hidden</span>`:h}</span></span>
  </div>`}function oo(t){let n=sr(t),e=Y(t),i=n.filter(s=>s.hidden).length;return c`<section class="card lc me-slots-card" aria-label="Pages"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${He}px; --thumb-h: ${Ee}px`}>
    <div class="lc-head">
      <span class="swatch">${S("pages")}</span><span class="lc-title">Pages</span>
      <span class="lc-sub">${te(n.length,"page","pages")}${i===0?"":`, ${i} hidden`}</span>
    </div>
    ${n.length===0?c`<div class="lc-note">No page shows in the switcher.</div>`:c`<div class="layers me-page-list" role="list">${n.map(s=>ro(t,s,e))}</div>`}
  </section>`}function ur(t){let n=C(t);if(n==="switcher")return oo(t);let e=Z(t),i=e===void 0?[]:Zr(E(t.document,e)),s=e===void 0?void 0:ae(t,e),r=e===void 0?[]:at(t.document,e),o=e===void 0?"Add an entity first, in the menu's settings.":r.length===0?"Every place around the ring is taken.":"Add a slot at the first free place",a;return e===void 0?a=c`<div class="lc-note">Add an entity to edit its menu.</div>`:i.length===0?a=c`<div class="lc-note">No slots yet.</div>`:a=c`<div class="layers me-slot-list" role="list">${i.map(d=>no(t,e,d,s))}</div>`,c`<section class="card lc me-slots-card" aria-label="Slots"
    style=${`--c: var(--wa-lc-layers, #4a7fe8); --thumb-w: ${He}px; --thumb-h: ${Ee}px`}>
    <div class="lc-head">
      <span class="swatch">${S("layers")}</span><span class="lc-title">Slots</span>
      ${e===void 0?h:c`<span class="lc-sub">${te(i.length,"slot","slots")}</span>`}
      <span class="spacer"></span>
      <button type="button" class="lc-btn pri me-add-slot" aria-label="Add slot" ?disabled=${t.busy||e===void 0||r.length===0}
        title=${o} @click=${()=>{e!==void 0&&cr(t,e)}}>${S("plus")}<span>Add</span></button>
    </div>
    ${n==="entity"?io(t,e,s):h}
    ${a}
  </section>`}function hr(t,n){let e=Br(t,n);return`left:${e.x*100}%;top:${e.y*100}%`}function qs(t,n,e){let i=ot(n,e??Ce);return i===void 0?void 0:hr(t,i)}function Ft(t,n,e){let{width:i,height:s}=t.screen,r=t.scale,o=Math.min(i,s),a=c`<div class="me-screen" role="group" aria-label=${n}
    style=${`width:${Math.round(i*r)}px;height:${Math.round(s*r)}px;--me-s:${r}`}>
    <svg class="me-screen-bg" viewBox=${`0 0 ${i} ${s}`} aria-hidden="true">
      <circle cx=${i/2} cy=${s/2} r=${o*Ce} class="me-track"></circle>
      <circle cx=${i/2} cy=${s/2} r=${o*.05} class="me-center"></circle>
    </svg>
    ${e}
  </div>`;return ti({width:i,height:s},r,a,n)}function Dt(t,n){return Math.round(n*t.scale)}function ao(t,n,e,i){let s=t.screen,r=E(t.document,n),o=Di(t.document,n),a=new Set(at(t.document,n)),d=e===void 0?void 0:T(e),l=(u,p,f,y,v)=>{let w=J(u),x=T(u),A=d!==void 0&&k(x,d),ne=`${K(p)}: ${B($(u))}${u.isVisible===!1?", hidden":""}`;return c`<button type="button" class="me-dot ${y} ${A?"on":""} ${u.isVisible===!1?"off":""}" style=${`${f};--c:${w.color}`}
      title=${ne} aria-label=${ne} aria-pressed=${A?"true":"false"} @click=${()=>ce(t,n,x)}>
      ${Pe(t,w.icon,Dt(t,y===""?15:11),w.color)}${v>1?c`<span class="me-count" aria-hidden="true">${v}</span>`:h}</button>`};return Ft(t,`${i} on the watch`,Se().map(u=>{let p=qs(s,u);if(p===void 0)return h;let f=r.filter(P=>P.position===u),y=f.find(P=>P.isVisible!==!1),v=y===void 0?o.find(P=>P.position===u&&P.isVisible!==!1):void 0,w=y??(v===void 0?f[0]:void 0),x=f.find(P=>P!==w),A;if(w!==void 0)A=l(w,u,p,"",f.length);else if(v!==void 0){let P=J(v);A=c`<span class="me-dot inh" style=${`${p};--c:${P.color}`} title=${`${K(u)}: ${B($(v))}, from All`}>
          ${Pe(t,P.icon,Dt(t,13),P.color)}</span>`}else a.has(u)?A=c`<button type="button" class="me-dot free" style=${p} ?disabled=${t.busy}
          title=${`Add a slot at ${K(u)}`} aria-label=${`Add a slot at ${K(u)}`}
          @click=${()=>cr(t,n,u)}>${S("plus")}</button>`:A=h;let ne=x===void 0?void 0:qs(s,u,.2);return c`${A}${x===void 0||ne===void 0?h:l(x,u,ne,"two",0)}`}))}function co(t){let n=t.switcherPages,e=t.screen,i=Y(t),s=n.length===0?c`<p class="me-screen-note">No pages in the switcher yet.</p>`:n.map((r,o)=>{let a=`${hr(e,zs(o,n.length))};--c:${r.color}`,d=i!==void 0&&k(i.id,r.id)?"on":"";return r.text===void 0?c`<span class="me-dot me-page-dot ${d}" style=${a} title=${r.name}>${Pe(t,r.icon,Dt(t,14),r.color)}</span>`:c`<span class="me-page ${d}" style=${a} title=${r.name}>${r.text}</span>`});return Ft(t,"Page switcher on the watch",s)}function pr(t){if(C(t)==="switcher")return co(t);let n=Z(t);return n===void 0?Ft(t,"Entity quick menu on the watch",c`<p class="me-screen-note">Add an entity to edit its menu.</p>`):ao(t,n,ae(t,n),Xr(t,n))}function fr(t){if(C(t)==="switcher")return[te(t.switcherPages.length,"page","pages")];let n=Z(t);if(n===void 0)return["No entity yet"];let e=te(E(t.document,n).length,"slot","slots");return n.list==="anywhere"?[e]:[n.list==="domain"?z(n.domain):q(t.hass,n.entityId),e]}function mr(t){return C(t)==="switcher"?Bs:Z(t)===void 0?"Add an entity in the menu's settings to give it a menu of its own.":jr}function gr(t,n){return ii(t.uiState,N,n)}function lo(t,n){si(t.uiState,N,n,!gr(t,n)),t.requestUpdate()}function uo(t){if(rr(t)!==void 0)return[{module:N,section:"switcher-page"}];let n=Z(t),e=n===void 0?void 0:ae(t,n);if(e!==void 0)return[{module:N,section:"slot"},...Ls(e)?[{module:N,section:"voice"}]:[],{module:N,section:"look"}];let i=C(t);return[{module:N,section:i==="entity"?"menu":`style-${i}`}]}function ee(t,n,e,i,s,r={}){let o=gr(t,e),a=Gs[n];return fn({color:a.color,icon:S(a.icon),title:i,open:o,onToggle:()=>lo(t,e),...r.summary===void 0||r.summary===""?{}:{summary:r.summary},dot:r.dot===!0,id:`${N}:${e}`},o?s:c``)}function wr(t){let n=C(t),e=Vt(n),i=Z(t),s=i===void 0?void 0:ae(t,i),r=uo(t),o=ri(t.uiState,r),a=Y(t),d=rr(t),l,u;if(a!==void 0&&d!==void 0)l=c`<div class="crumbs"><button class="root" title="The switcher's own style" @click=${()=>Wt(t,void 0)}>${e}</button><span class="sep">›</span><span class="kchip" style=${`--k:${zr}`}>Page</span><span class="nm" title=${a.name}>${a.name}</span></div>`,u=ho(t,d);else if(s===void 0||i===void 0)l=c`<div class="crumbs"><span class="kchip" style=${`--k:${Kr}`}>Menu</span><span class="nm" title=${e}>${e}</span></div>`,u=Co(t,n);else{let p=Lt(t,s);l=c`<div class="crumbs"><button class="root" title="Edit the menu" @click=${()=>ce(t,i,void 0)}>${e}</button><span class="sep">›</span><span class="kchip" style=${`--k:${J(s).color}`}>Slot</span><span class="nm" title=${p}>${p}</span></div>`,u=ko(t,i,s)}return c`<div class="insp-head">
      ${l}
      <button class="expand" @click=${()=>{oi(t.uiState,r,!o),t.requestUpdate()}}>${o?"Collapse all":"Expand all"}</button>
    </div>
    <div class="insp-body">${u}</div>`}function ho(t,n){let e=n.page;return ee(t,"switcherPage","switcher-page",Pt,c`<fieldset class="ts-body me-body" ?disabled=${t.busy} aria-label=${Pt}>${Rs(n)}</fieldset>`,{summary:Ps(e),dot:Ts(e)})}var po={triggerMode:"Mode",confirmOnRelease:"Confirm on release",showBanner:"Show banner",bannerSeconds:"Banner seconds",openOnRelease:"Open on release",instanceSwitchBehavior:"Behavior",phraseId:"Phrase"};function vr(t,n){return n.key==="entityId"?n.target==="httpAction"?"HTTP action":t==="runScene"?"Scene":t==="runScript"?"Script":"Entity":n.key==="pageId"?n.target==="statusPage"?"Status page":"Page":po[n.key]??n.key}function fo(t,n,e){let i=T(e),s=$(e),r=Li(n),o=new Set(r.flatMap(l=>l.actions)),a=l=>{let u=j(l),p=l===s?void 0:Pi(l,t.targets),f=`${u?.label??B(l)}${u?.requiresPremium?" (Pro)":""}${p===void 0?"":` (${p})`}`;return c`<option value=${l} ?selected=${l===s} ?disabled=${p!==void 0}>${f}</option>`},d=l=>t.edit(u=>ji(u,n,i,l,t.targets));return c`<label class="field"><span>Action</span>
    <select .value=${_e(s)} @change=${l=>d(l.target.value)}>
      ${o.has(s)?h:c`<optgroup label="Now"><option value=${s} selected>${B(s)}</option></optgroup>`}
      ${r.map(l=>c`<optgroup label=${Ti(l.category)}>${l.actions.map(a)}</optgroup>`)}
    </select></label>`}function mo(t){return t.needsSetup===!0?`${t.name} (${t.source==="home"?"needs setup":"needs setup on the iPhone"})`:t.source==="iphone"?`${t.name} (on the iPhone)`:t.name}function Us(){return c`<button type="button" class="link" @click=${ks}>Open HTTP actions</button>`}function go(t,n,e){let i=n.find(s=>k(s.id,e));return i?.source==="home"&&i.needsSetup===!0?c`<div class="hint warn ts-under">Needs setup. ${Us()}</div>`:t.httpLibrary!==void 0&&n.length===0?c`<div class="hint ts-under">${hi} ${Us()}</div>`:!t.catalogKnown&&t.httpLibrary!=="held"?c`<div class="hint ts-under">Open the iPhone app to list its HTTP actions here.</div>`:h}function wo(t,n,e,i,s){let r=T(e),o=re(e)[s.key],a=typeof o=="string"?o:"",d=s.target==="page"?t.targets.pages:s.target==="statusPage"?t.targets.statusPages:s.target==="ttsPhrase"?t.targets.phrases??[]:t.targets.httpActions,l=a===""||d.some(w=>k(w.id,a)),u=w=>t.edit(x=>ut(x,n,r,s.key,w===""?void 0:w)),p=s.target==="statusPage"&&t.statusPagesKnown===!0,f=s.target==="httpAction"&&t.httpLibrary==="held"&&!t.catalogKnown,y=s.target==="page"?"A page that is gone":s.target==="ttsPhrase"?t.targets.phrases===void 0?"A phrase not listed here":"A phrase that is gone":p?"Not in this watch's status pages":f?ui:ci,v=w=>s.target==="httpAction"?mo(w):w.name;return c`<label class="field"><span>${vr(i,s)}</span>
    <select .value=${_e(d.find(w=>k(w.id,a))?.id??a)} @change=${w=>u(w.target.value)}>
      ${s.required===!0?h:c`<option value="" ?selected=${a===""}>None</option>`}
      ${l?h:c`<option value=${a} selected>${y}</option>`}
      ${d.map(w=>c`<option value=${w.id} ?selected=${k(w.id,a)}>${v(w)}</option>`)}
    </select></label>
    ${s.target==="ttsPhrase"?t.voice?.phrases===void 0?c`<div class="hint ts-under">No voice settings from this watch yet. Add phrases in Voice.</div>`:h:s.target==="statusPage"?p||t.catalogKnown?h:c`<div class="hint ts-under">No status pages from this watch yet. Add them in Status pages.</div>`:s.target==="httpAction"?go(t,t.targets.httpActions,a):h}`}function vo(t,n,e,i,s){let r=T(e),o=re(e),a=(u,p)=>t.edit(f=>ut(f,n,r,s.key,u),p),d=vr(i,s),l=ht(e,s);switch(s.type){case"entity":{let u=typeof o[s.key]=="string"?o[s.key]:"",p=i==="runScene"?"scene":i==="runScript"?"script":Hi();return c`<div class="ts-stack">${Ue({hass:t.hass},d,Xs(t.hass,u),f=>a(f.entityId),`me:entity:${r}`,{domain:p,clearable:!1,needed:u===""})}</div>
        ${u===""?c`<div class="hint keep">Pick what it runs. A slot left without one is dropped when you save.</div>`:h}`}case"uuid":return wo(t,n,e,i,s);case"enum":{if(s.key==="triggerMode"){let f=we(typeof o.entityId=="string"?o.entityId:""),y=Ri(f),v=typeof l=="string"?l:y[0]??"",w=y.map(x=>[x,rt(x)]);return y.includes(v)||w.unshift([v,rt(v)]),I(d,v,w,x=>a(x),{snapBack:!0})}let u=vt(s.enum),p=typeof l=="string"?l:String(s.default??"");return u.length<=4?U(d,p,u,f=>a(f)):I(d,p,u,f=>a(f),{snapBack:!0})}case"bool":return R(d,l===!0,u=>a(u),s.default);case"number":{if(s.key==="bannerSeconds"&&ht(e,{key:"showBanner",type:"bool",default:!0})===!1)return h;let u=typeof o[s.key]=="number"?o[s.key]:void 0;return Wn(d,u,p=>a(p,`slot:${r}:${s.key}`),{...s.min===void 0?{}:{min:s.min},...s.max===void 0?{}:{max:s.max},step:1,optional:!0,placeholder:typeof s.absentMeans=="number"?String(s.absentMeans):"",unit:"s",def:null})}}}function yo(t,n,e){if(!dt(n,e))return h;let i=T(e);return c`<div class="ts-stack">${U("Skip conditions",rs(lt(e)),ss,s=>t.edit(r=>qi(r,n,i,os(s))))}</div>
    <div class="hint ts-under">Whether running the automation from this menu skips its conditions. Default follows the tile, then "Skip conditions by default" in the watch's Settings.</div>`}function bo(t,n){let e=T(n),i=ft(n),s=i===void 0,r=l=>t.edit(u=>Ki(u,e,l)),o=Bi(),a=(i??[]).filter(l=>!pt(l)),d=s?"Every screen":i.length===0?"No entity under the finger":i.map(z).join(", ");return c`<details class="me-show-for">
    <summary><span>Show for</span><b>${d}</b></summary>
    ${R("Every screen",s,l=>r(l?void 0:o.slice(0,1)),!0)}
    ${s?h:c`<div class="me-chips" role="group" aria-label="Entity types">
      ${[...o,...a].map(l=>{let u=i.includes(l),p=!pt(l);return c`<button type="button" class="pe-chip ${u?"on":""} ${p?"odd":""}" aria-pressed=${u?"true":"false"}
          title=${p?"Not reported by the watch":h}
          @click=${()=>r(u?i.filter(f=>f!==l):[...i,l])}>${z(l)}</button>`})}
    </div>
    ${a.length===0?h:c`<div class="hint warn">${a.map(z).join(", ")}: Not reported by the watch.</div>`}
    <div class="hint">The slot shows only while the finger is over an entity of these types. With none picked, it shows only where no entity is under the finger.</div>`}
  </details>`}function So(t,n){return t.isVisible===!1||n.list==="anywhere"&&ft(t)!==void 0||dt(n,t)&&lt(t)!==null}function $o(t){let n=Qs(t);if(n===void 0)return!1;let e=J(t);return e.icon!==n.icon||!Jr(e.color,n.color)}function xo(t,n){let e=Gs.name,i=j($(n));return c`<section class="sec name-sec" data-open="true" style=${`--c:${e.color}`}>
    <div class="sec-h pinned">
      <span class="swatch">${S(e.icon)}</span>
      <h4>Name</h4>
      <span class="me-name" title="A slot is named by what it runs, else by its action">${Lt(t,n)}</span>
      ${i?.requiresPremium?c`<span class="pe-badge" title="Needs Wrist Assistant Pro on the watch">Pro</span>`:h}
    </div>
  </section>`}function ko(t,n,e){let i=T(e),s=$(e),r=j(s),o=J(e),a=Qs(e),d=typeof e.position=="string"?e.position:"",l=E(t.document,n).filter(v=>!k(T(v),i)),u=Se().map(v=>{let w=K(v);return l.some(x=>x.position===v)?[v,v===d?`${w} (shared)`:`${w} (swap)`]:[v,w]}),p=c`<fieldset class="me-body" ?disabled=${t.busy} aria-label="Slot">
    ${r===void 0?c`<div class="hint warn">A newer app wrote this action. A watch with an older app shows Sync Needed for it until the app is updated. Pick another action to replace it.</div>`:h}
    ${I("Place",d,u,v=>t.edit(w=>_i(w,n,i,v)),{snapBack:!0})}
    ${R("Shown",e.isVisible!==!1,v=>t.edit(w=>Ni(w,n,i,v)),!0)}
    ${fo(t,n,e)}
    ${r?.description?c`<div class="hint ts-under">${r.description}</div>`:h}
    ${Wi(s)?c`<div class="hint ts-under keep">Only for a watch with more than one Home Assistant.</div>`:h}
    ${(r?.payload??[]).map(v=>vo(t,n,e,s,v))}
    ${yo(t,n,e)}
    ${n.list==="anywhere"?bo(t,e):h}
  </fieldset>`,f=c`<fieldset class="me-body" ?disabled=${t.busy} aria-label="Look">
    <div class="ts-stack">${pe({icons:t.icons,symbols:t.symbols},typeof e.icon=="string"?e.icon:"",v=>t.edit(w=>Ui(w,n,i,v),`slot:${i}:icon`),`me:icon:${i}`,{tint:typeof e.color=="string"?e.color:a?.color})}</div>
    <div class="ts-no-alpha">${ie("Color",typeof e.color=="string"?e.color:void 0,v=>{v!==void 0&&t.edit(w=>Fi(w,n,i,v),`slot:${i}:color`)},!1,a?.color)}</div>
  </fieldset>`,y=Vs(t,n,e);return c`${xo(t,e)}
    ${ee(t,"slot","slot","Slot",p,{summary:er(e),dot:So(e,n)})}
    ${y===void 0?h:ee(t,"slot","voice","Voice",c`<fieldset class="me-body me-voice" ?disabled=${t.busy} aria-label="Voice">${y}</fieldset>`,{summary:_s(t,e),dot:Ds(e)})}
    ${ee(t,"look","look","Look",f,{summary:o.icon,dot:$o(e)})}
    <div class="me-acts">
      <button type="button" class="pe-btn pe-danger" ?disabled=${t.busy} title="Remove this slot from the menu"
        @click=${()=>t.edit(v=>ct(v,n,i))}>${S("delete")}<span>Remove</span></button>
    </div>`}function Mo(t,n,e){if(!wt(t.document,n,e))return h;let i=gt(t.document,n,e),s=`style:${n}:${e.key}`,r=(o,a=!1)=>t.edit(d=>Zi(d,n,e.key,o),a?s:void 0);switch(e.type){case"bool":return R(e.label,i===!0,o=>r(o),e.default);case"enum":{let o=vt(e.enum),a=String(i);return o.length<=4?U(e.label,a,o,d=>r(d),{def:String(e.default)}):I(e.label,a,o,d=>r(d),{def:String(e.default),snapBack:!0})}case"number":{let o=typeof i=="number"?i:Number(e.default);return c`${he(e.label,o,a=>r(a,!0),{min:e.min??0,max:e.max??1,step:e.step??.01,def:Number(e.default)})}
      ${e.presets===void 0?h:c`<div class="ts-after">${e.presets.map(a=>c`<button type="button"
        class="pe-chip ${a.value===o?"on":""}" aria-pressed=${a.value===o?"true":"false"} @click=${()=>r(a.value)}>${a.label}</button>`)}</div>`}`}case"color":{let o=typeof i=="string"?i:String(e.default);return c`<div class="ts-no-alpha">${ie(e.label,o,a=>{a!==void 0&&r(a,!0)},!1,String(e.default))}</div>
        ${e.swatches===void 0?h:c`<div class="ts-swatch-row"><div class="ts-swatches" role="group" aria-label=${e.label}>
          ${e.swatches.map(a=>{let d=a.toUpperCase()===o.toUpperCase();return c`<button type="button" class="ts-swatch ${d?"on":""}" aria-pressed=${d?"true":"false"} title=${a} aria-label=${a}
              style=${`--sw:${a}`} @click=${()=>r(a)}></button>`})}</div></div>`}`}}}function To(t,n){return typeof t=="number"&&typeof n=="number"?Math.abs(t-n)<1e-9:typeof t=="string"&&typeof n=="string"?t.toUpperCase()===n.toUpperCase():t===n}function Po(t,n){return mt(n).some(e=>wt(t,n,e)&&!To(gt(t,n,e),e.default))}function Fs(t,n,e){let i=Po(t.document,n);return ee(t,"style",e,"Style",c`<fieldset class="me-body me-style" ?disabled=${t.busy} aria-label="Style">
    ${mt(n).map(s=>Mo(t,n,s))}
  </fieldset>`,{summary:i?"Changed":"Defaults",dot:i})}function Ro(t){let n=_t(t),e=a=>{t.uiState.set(nr,a),t.requestUpdate()},i=U("Edit",n,[["domain","By type"],["entity","By entity"]],a=>e(a)),s,r,o=!1;if(n==="domain"){let a=Nt(t),d=ve(a),l=Oi(a),u=Ei().map(f=>[f.domain,f.label]),p=d?.inheritKey?Ai(t.document,a):!1;o=p,r=`By type \xB7 ${d?.label??a}`,s=c`${I("Type",a,u,f=>{t.uiState.set(ir,f),t.requestUpdate()})}
      ${l.length>0?c`<div class="hint ts-under keep">The same menu as ${l.map(f=>f.label).join(", ")}.</div>`:h}
      ${d?.inheritKey?c`${R("Add the All slots",p,f=>t.edit(y=>zi(y,a,f)),!1)}
        <div class="hint ts-under">The All menu's slots fill the places this menu leaves free.</div>`:h}`}else{let a=oe(t.document),d=qt(t);r=`By entity \xB7 ${d===void 0?"none yet":q(t.hass,d)}`;let l=u=>{let p=u.entityId.trim();p!==""&&(t.edit(f=>Ji(f,p)),t.uiState.set(At,p),t.uiState.set(It,(Number(t.uiState.get(It)??0)||0)+1),t.requestUpdate())};s=c`<div class="me-entities">
      ${a.length===0?c`<p class="hint keep">No entity has a menu of its own. Add one below: it starts as a copy of its type's menu.</p>`:h}
      ${a.map(u=>{let p=u===d;return c`<div class="me-entity ${p?"on":""}">
          <button type="button" class="me-entity-pick" aria-pressed=${p?"true":"false"}
            @click=${()=>{t.uiState.set(At,u),t.requestUpdate()}}>
            <b>${q(t.hass,u)}</b><code>${u}</code></button>
          <button type="button" class="pe-btn pe-danger" title="Remove this entity's own menu. It follows its type's menu again."
            @click=${()=>t.edit(f=>Yi(f,u))}>Remove</button>
        </div>`})}
      <div class="ts-stack">
        ${Ue({hass:t.hass},"Add an entity",Xs(t.hass,""),l,`me:er:add:${String(t.uiState.get(It)??0)}`,{clearable:!1})}
      </div>
    </div>`}return ee(t,"menu","menu","Menu",c`<fieldset class="me-body me-pick" ?disabled=${t.busy} aria-label="Menu">
    ${i}${s}
  </fieldset>`,{summary:r,dot:o})}function Co(t,n){let e=n==="anywhere"?Fs(t,"quickAction","style-anywhere"):n==="switcher"?Fs(t,"pageSwitcher","style-switcher"):Ro(t);return c`<p class="me-menu-note">${Ks[n]}</p>${e}
    <p class="me-menu-note me-pick-note">${n==="switcher"?Ur:"Select a slot to edit it, or add one."}</p>`}var yr=de`
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
`;function jt(t){if(t.length===0)return"";let n=t.map(i=>Xi(i));return`Another save also changed ${n.length===1?n[0]:`${n.slice(0,-1).join(", ")} and ${n[n.length-1]}`}. ${n.length===1?"Your version replaced it.":"Your versions replaced them."}`}function br(t){if(t.ok){if(t.alreadySaved===!0)return{kind:"ok",text:`Nothing left to save. The same changes were saved somewhere else, as revision ${t.revision}.`};let e=t.replaced??[];return e.length>0?{kind:"warn",text:`Saved. ${jt(e)}`}:t.merged?{kind:"ok",text:"Saved. Changes made somewhere else were merged in."}:void 0}let n=(t.message??"").trim();switch(t.code){case"conflict":return{kind:"warn",text:"Not saved. The menus kept changing somewhere else while saving. Your edits are kept, so try Save again in a moment."};case"no_record":return{kind:"warn",text:"Not saved. Home Assistant no longer holds menus for this watch. Your edits are kept, so save again."};case"invalid":{let e=t.problems??[];return e.length>0?{kind:"err",text:`Not saved. Something in the menus is not right: ${e.join(" ")}`}:{kind:"err",text:`Not saved. Home Assistant refused the menus${n===""?".":`: ${n}`}`}}case"busy":return{kind:"warn",text:"Already saving these menus. Wait a moment for that save to finish."};case"unavailable":return{kind:"warn",text:"Not saved. Home Assistant could not store the menus just now. Your edits are kept, so try again in a moment."};default:return{kind:"err",text:`Not saved${n===""?".":`: ${n}`}`}}}function kr(){return ns()||$i()}xs({dirty:kr,drop:()=>{is(),xi()}});typeof window<"u"&&window.addEventListener("beforeunload",t=>{kr()&&(t.preventDefault(),t.returnValue="")});var Ho=15e3,Mr=typeof navigator<"u"&&/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent),Bt=Mr?"\u2318":"Ctrl+",Kt={min:200,max:720,middleMin:320},zt={left:280,right:320},Jt="wrist-assistant-panel.menus.columns.v1",Eo=24,Sr=820;function Yt(t){return ue(t).message}function Oe(t){return ue(t).code}function Ie(t){let{code:n,message:e}=ue(t);return Object.assign(new Error(e),n===void 0?{}:{code:n})}function Oo(t){return t<1e3?`${t} bytes`:`${Number((t/1e3).toFixed(1))} KB`}function Io(t){let n=t?Date.parse(t):NaN;return Number.isNaN(n)?"":on(Math.max(0,(Date.now()-n)/1e3))}function Ao(t){return t==="panel"?"Saved here":"From the watch"}function Do(t){return t instanceof HTMLElement?Jn(t.tagName,t instanceof HTMLInputElement?t.type:void 0,t.isContentEditable):!1}function Lo(){let t=document.activeElement;for(;t?.shadowRoot?.activeElement;)t=t.shadowRoot.activeElement;return t===null||t===document.body||t===document.documentElement}function Wo(t){return F(t)?Be(t).filter(n=>!ze(n)&&Mi(fe(n))).map(n=>({id:fe(n),name:Ke(n)})):[]}var $r=["#8FA8C4","#9CB6A6","#C8AE8E","#A5B7CF","#D8A3A0","#A8BED5","#CCD8E6","#D8A3A0"];function Ae(t){return typeof t=="string"&&t.trim()!==""?t:void 0}var Vo="#8E8E93";function Zt(t){if(!F(t))return[];let n=0;return Be(t).filter(e=>!Xn(e)&&!ze(e)).map(e=>{let i=e.hideFromSwitcher===!0,s=Ke(e),r=Ae(e.switcherIcon)??Ae(Gn(e)[0]?.icon)??(Qn(e)?"bolt.fill":"square.grid.2x2.fill"),o=i?Vo:$r[n++%$r.length],a=Ae(e.switcherColor)??o,d=e.switcherDisplayMode==="icon"?void 0:Ae(e.switcherText)??s;return{id:fe(e),name:s,icon:r,color:a,...d===void 0?{}:{text:d},hidden:i}})}function rc(t){return Zt(t).filter(n=>!n.hidden).map(({hidden:n,...e})=>e)}var xr={ok:0,warn:1,err:2};function _o(t,n){return t===void 0?n:n===void 0?t:{kind:xr[n.kind]>xr[t.kind]?n.kind:t.kind,text:t.text===n.text?t.text:`${t.text} ${n.text}`}}function No(t){let n=ge(t)??{},e=E(n,{list:"anywhere"}).length,i=oe(n).length;return`Anywhere menu: ${(r=>`${r} ${r===1?"slot":"slots"}`)(e)}. ${i===0?"No entity has its own menu.":`${i} ${i===1?"entity has":"entities have"} its own menu.`}`}var m=class extends Xt{constructor(){super();this.owners=[];this.narrow=!1;this.iconsTick=0;this.haMenu=!1;this.barActions=h;this.shellOwnsWatch=!1;this.barHost=void 0;this.headBar=new $n(this);this.unsupported=!1;this.httpLibrarySeq=0;this.voiceSeq=0;this.loading=!1;this.history=[];this.historyState="loading";this.restoring=!1;this.historyOpen=!1;this.rawOpen=!1;this.rawCopied=!1;this.shownFootDialogs=new WeakSet;this.topMenuOpen=!1;this.watchMenuOpen=!1;this.zoom=Ys();this.columns={...zt};this.hostWidth=0;this.hostHeight=0;this.ownListAsked=!1;this.topHeight=0;this.savedTicker=new Nn(this);this.symbols=new Cn(()=>this.requestUpdate());this.uiState=new Map;this.scrubSeq=0;this.reloadPending=!1;this.loadSeq=0;this.catalogSeq=0;this.statusPagesSeq=0;this.pagesSeq=0;this.behaviorSeq=0;this.historySeq=0;this.subscribeSeq=0;this.onReconnect=()=>{let e=this.watchId;!this.isConnected||e===void 0||(this.load(e,!0),this.loadCatalog(e),this.loadHttpLibrary(),this.loadStatusPages(e),this.loadPages(e),this.loadBehavior(e),this.loadVoice(e))};this.onScrubStart=e=>{e.stopPropagation(),this.endScrub(),this.draft?.endCoalesce(),this.scrubKey=`scrub:${++this.scrubSeq}`,window.addEventListener("pointerup",this.onScrubPointerUp,!0),window.addEventListener("pointercancel",this.onScrubPointerUp,!0)};this.onScrubEnd=e=>{e.stopPropagation(),this.endScrub()};this.onScrubPointerUp=()=>{this.endScrub()};this.onKeyDown=e=>{if(e.defaultPrevented)return;let i=e.composedPath();if(!i.includes(this)&&!this.headBar.holds(i)&&!Lo()||this.renderRoot.querySelector("dialog[open]"))return;let s=e.metaKey||e.ctrlKey,r=e.key.toLowerCase();if(s&&!e.altKey&&r==="s"){e.preventDefault(),this.save();return}if(e.key==="Escape"&&this.topMenuOpen){e.preventDefault(),this.topMenuOpen=!1,this.updateComplete.then(()=>this.headBar.query(this.renderRoot,".wa-bar .tb-more")?.focus());return}if(e.key==="Escape"&&this.watchMenuOpen){e.preventDefault(),this.watchMenuOpen=!1,this.updateComplete.then(()=>this.renderRoot.querySelector(".wa-bar .me-watch-btn")?.focus());return}if(!Do(i[0])){if(s&&!e.altKey&&r==="z"){e.preventDefault(),e.shiftKey?this.redo():this.undo();return}if(e.ctrlKey&&!e.metaKey&&!e.altKey&&r==="y"){e.preventDefault(),this.redo();return}if(e.key==="Escape"&&!s&&!e.altKey){let o=this.viewHost();o!==void 0&&Ut(o)&&e.preventDefault()}}};this.onWindowPointerDown=e=>{if(!this.topMenuOpen&&!this.watchMenuOpen)return;let i=e.composedPath(),s=r=>i.some(o=>o instanceof HTMLElement&&o.classList.contains(r));this.topMenuOpen&&!s("pe-top-menu")&&(this.topMenuOpen=!1),this.watchMenuOpen&&!s("me-watch-picker")&&(this.watchMenuOpen=!1)};this.addEventListener(An,this.onScrubStart),this.addEventListener(Dn,this.onScrubEnd),this.addEventListener("focusout",()=>{this.draft?.endCoalesce(),this.pagesDraft?.endCoalesce()})}get watches(){return wn(this.owners.length>0?this.owners:this.ownList??[])}get draft(){let e=this.watchId,i=this.record;if(!(e===void 0||i===void 0)){if(i.revision>0){let s=L(e);if(s!==void 0)return s;let r=ge(i.document);return r===void 0?void 0:bt(e,r,i.revision).draft}if(!(this.unsupported||!this.opensReady()))return L(e)??St(e)}}get newWatch(){let e=this.record;return e!==void 0&&e.revision<=0&&!this.unsupported}get pagesDraft(){if(!(this.watchId===void 0||this.pagesRecord!==void 0&&this.pagesRecord.revision<=0))return tt(this.watchId)}get pagesDocument(){let e=this.pagesRecord;return this.pagesDraft?.document??(e!==void 0&&e.revision>0?e.document:void 0)}get pages(){return Wo(this.pagesDocument)}get saving(){return this.watchId===void 0?!1:(L(this.watchId)?.saving??!1)||(this.pagesDraft?.saving??!1)}get dirty(){return(this.draft?.dirty??!1)||(this.pagesDraft?.dirty??!1)}get undoDraft(){let e=this.pagesDraft;return e!==void 0&&this.pickedSwitcherPage()!==void 0?e:this.draft}pickedSwitcherPage(){return Y({uiState:this.uiState,switcherPages:[],switcherRows:Zt(this.pagesDocument)})}get holdReload(){return this.saving||this.scrubKey!==void 0}connectedCallback(){super.connectedCallback(),this.barHost!==void 0&&this.requestUpdate(),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("pointerdown",this.onWindowPointerDown,!0),this.columns=Pn(Jt,zt,Kt),this.watchSize(),this.listenForReconnect(),this.watchId!==void 0&&this.openWatch(this.watchId,!0)}disconnectedCallback(){super.disconnectedCallback(),this.headBar.clear(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("pointerdown",this.onWindowPointerDown,!0),this.sizeObserver?.disconnect(),this.observedTop=void 0,this.stopListeningForReconnect(),this.reloadPending=!1,this.endScrub(),this.endSubscription(),this.stopPolling(),this.loadSeq++,this.catalogSeq++,this.statusPagesSeq++,this.httpLibrarySeq++,this.pagesSeq++,this.behaviorSeq++,this.voiceSeq++,this.historySeq++}willUpdate(e){if(this.hass){e.has("hass")&&this.listenForReconnect(),this.owners.length===0&&!this.ownListAsked&&(this.ownListAsked=!0,Qt(this.hass).then(r=>{this.ownList=r.owners},()=>{this.ownList=[]}));let s=Sn(this.watches,this.watchId,this.ownerId,this.shellOwnsWatch||e.has("ownerId"));s!==void 0&&this.openWatch(s)}this.followSave();let i=this.restoreAsk;i!==void 0&&!this.restoring&&this.historyState==="ready"&&!this.history.some(s=>s.revision===i.entry.revision)&&this.closeAsk()}updated(){this.headBar.draw(this.barHost,()=>this.renderTopBar(this.draft,this.watches));let e=this.renderRoot.querySelector("dialog.pe-ask")??void 0;e!==this.shownDialog&&(this.shownDialog=e,e&&!e.open&&e.showModal()),jn(this.renderRoot,this.shownFootDialogs),this.observeTop(),this.savedTicker.show(this.headBar.query(this.renderRoot,".cf-saved")!==null||this.renderRoot.querySelector(".cf-saved")!==null)}watchSize(){typeof ResizeObserver>"u"||(this.sizeObserver??=new ResizeObserver(e=>{for(let i of e){if(i.target!==this){this.measureTop(i.target);continue}let s=i.contentRect;Math.abs(s.width-this.hostWidth)>=1&&(this.hostWidth=s.width),Math.abs(s.height-this.hostHeight)>=1&&(this.hostHeight=s.height)}}),this.sizeObserver.observe(this),this.observeTop())}observeTop(){let e=this.sizeObserver;if(e===void 0)return;let i=this.renderRoot?.querySelector(".pe-top")??void 0;i!==this.observedTop&&(this.observedTop!==void 0&&e.unobserve(this.observedTop),this.observedTop=i,i!==void 0&&e.observe(i))}measureTop(e){let i=e.offsetHeight;i!==this.topHeight&&(this.topHeight=i,this.style.setProperty("--pe-top-h",`${i}px`))}listenForReconnect(){let e=this.hass?.connection;e!==this.readyConnection&&(this.stopListeningForReconnect(),!(!this.isConnected||typeof e?.addEventListener!="function")&&(e.addEventListener("ready",this.onReconnect),this.readyConnection=e))}stopListeningForReconnect(){this.readyConnection?.removeEventListener?.("ready",this.onReconnect),this.readyConnection=void 0}followSave(){let e=this.watchId;if(e===void 0)return;let i=this.pagesDraft?.saveDone;if(i!==void 0&&i!==this.followedPagesSave){this.followedPagesSave=i;let o=()=>this.pagesSaveEnded(e);i.then(o,o)}let s=L(e)?.saveDone;if(s===void 0||s===this.followedSave)return;this.followedSave=s;let r=()=>this.saveEnded(e);s.then(r,r)}pagesSaveEnded(e){this.requestUpdate(),!(!this.isConnected||e!==this.watchId)&&(this.loadPages(e),this.flushPending())}saveEnded(e){this.requestUpdate(),this.isConnected&&(e===this.watchId?(this.reloadPending=!1,this.load(e,!0)):this.flushPending())}openWatch(e,i=!1){e!==this.watchId&&(this.reloadPending=!1,this.restartDraft=void 0,this.watchId=e,this.note=void 0,this.unsupported=!1,this.catalog=void 0,this.catalogSeq++,this.statusPages=void 0,this.statusPagesSeq++,this.pagesRecord=void 0,this.pagesSeq++,this.behavior=void 0,this.behaviorSeq++,this.voiceDocument=void 0,this.voiceSeq++,this.history=[],this.historyState!=="unsupported"&&(this.historyState="loading"),this.closeAsk(),this.endScrub(),this.uiState.clear(),i=!1),this.startSubscription(e),this.load(e,i),this.loadCatalog(e),this.loadHttpLibrary(),this.loadStatusPages(e),this.loadPages(e),this.loadBehavior(e),this.loadVoice(e)}async loadVoice(e){let i=this.hass;if(!i)return;let s=++this.voiceSeq;try{let r=await H(i,e,"voice");if(s!==this.voiceSeq||e!==this.watchId)return;this.voiceDocument=ls(r)}catch{if(s!==this.voiceSeq||e!==this.watchId)return;this.voiceDocument=void 0}}voiceContext(){let e=this.voiceDocument;return{phrases:e===void 0?void 0:xt(e),defaults:us(e,this.catalog)}}async loadCatalog(e){let i=this.hass;if(!i)return;let s=++this.catalogSeq;try{let r=await H(i,e,"catalog");if(s!==this.catalogSeq||e!==this.watchId)return;this.catalog=di(r)}catch(r){if(s!==this.catalogSeq||e!==this.watchId)return;Qe(r)&&(this.catalog=void 0)}}async loadHttpLibrary(){let e=this.hass;if(!e)return;let i=++this.httpLibrarySeq;try{let s=await rn(e);if(i!==this.httpLibrarySeq)return;this.httpLibrary=En(s)}catch(s){if(i!==this.httpLibrarySeq)return;On(s)&&(this.httpLibrary=void 0)}}async loadStatusPages(e){let i=this.hass;if(!i)return;let s=++this.statusPagesSeq;try{let r=await H(i,e,"status_pages");if(s!==this.statusPagesSeq||e!==this.watchId)return;this.statusPages=li(r)}catch(r){if(s!==this.statusPagesSeq||e!==this.watchId)return;Qe(r)&&(this.statusPages=void 0)}}async loadPages(e){let i=this.hass;if(!i)return;let s=++this.pagesSeq;try{let r=await H(i,e,"pages");if(s!==this.pagesSeq||e!==this.watchId)return;this.pagesRecord={revision:r.revision,document:r.document},r.revision>0&&F(r.document)&&!(tt(e)?.saving??!1)&&Si(e,r.document,r.revision).mergedIntoEdits&&(this.note={kind:"warn",text:"The pages changed elsewhere. Your edits are kept."})}catch{}}async loadBehavior(e){let i=this.hass;if(!i)return;let s=++this.behaviorSeq;try{let r=await H(i,e,"behavior");if(s!==this.behaviorSeq||e!==this.watchId)return;this.behavior=r.revision>0&&F(r.document)?r.document:void 0}catch{if(s!==this.behaviorSeq||e!==this.watchId)return;this.behavior=void 0}}async load(e,i=!1){let s=this.hass;if(!s)return;if(i&&this.holdReload){this.reloadPending=!0;return}let r=++this.loadSeq;this.stopPolling(),i||(this.record=void 0,this.loading=!0,this.loadError=void 0);try{let o=await H(s,e,"menus");if(r!==this.loadSeq)return;if(i&&this.holdReload){this.reloadPending=!0;return}this.unsupported=!1,this.show(o),this.loadError=void 0}catch(o){if(r!==this.loadSeq)return;es(o)?(this.unsupported=!0,this.loadError=void 0):i||(this.loadError=Yt(o)),this.restartDraft?.watchId===e&&(this.restartDraft=void 0)}this.loading=!1,!this.unsupported&&(this.pollIfWaiting(),this.loadHistory(e))}flushPending(){!this.reloadPending||this.holdReload||this.watchId===void 0||(this.reloadPending=!1,this.load(this.watchId,!0))}show(e){let i=this.watchId;this.record=e,i!==void 0&&e.revision<=0&&St(i);let s=e.revision>0?ge(e.document):void 0;if(i===void 0||s===void 0)return;let r=this.restartDraft;r!==void 0&&r.watchId===i&&e.revision>=r.revision&&(this.restartDraft=void 0,(L(i)?.dirty??!1)||$e(i));let o=bt(i,s,e.revision);o.replaced.length>0?this.note={kind:"warn",text:jt(o.replaced)}:o.mergedIntoEdits&&(this.note={kind:"warn",text:"The menus changed somewhere else. Your edits are kept."}),this.requestUpdate()}async loadHistory(e){let i=this.hass;if(!i||this.historyState==="unsupported")return;let s=++this.historySeq;try{let r=await en(i,e,"menus");if(s!==this.historySeq||e!==this.watchId)return;this.history=Array.isArray(r?.entries)?r.entries:[],this.historyState="ready"}catch(r){if(s!==this.historySeq||e!==this.watchId)return;this.historyState=Oe(r)==="unknown_command"?"unsupported":"error"}}startSubscription(e){let i=this.hass;if(this.endSubscription(),!i)return;let s=++this.subscribeSeq;sn(i,e,r=>{s===this.subscribeSeq&&(r.kind==="catalog"?pi(r,this.catalog)&&this.loadCatalog(e):r.kind==="status_pages"?this.loadStatusPages(e):r.kind==="pages"?this.loadPages(e):r.kind==="behavior"?this.loadBehavior(e):r.kind==="voice"?this.loadVoice(e):r.kind==="menus"&&r.revision!==(this.record?.revision??0)&&this.load(e,!0))}).then(r=>{s===this.subscribeSeq?this.unsubscribe=r:r().catch(()=>{})},()=>{})}endSubscription(){this.subscribeSeq++;let e=this.unsubscribe;this.unsubscribe=void 0,e?.().catch(()=>{})}pollIfWaiting(){this.stopPolling(),!(!this.isConnected||gn(this.record)!=="waiting")&&(this.pollTimer=window.setTimeout(()=>{this.poll()},Ho))}async poll(){this.pollTimer=void 0;let e=this.hass,i=this.watchId,s=this.record;if(!(!e||i===void 0||s===void 0)){if(this.holdReload){this.pollIfWaiting();return}try{let r=await H(e,i,"menus");if(i!==this.watchId||this.record!==s)return;r.revision===s.revision?this.record={...s,delivered_revision:r.delivered_revision,delivered_at:r.delivered_at,rejected_revision:r.rejected_revision,rejected_at:r.rejected_at,rejected_reason:r.rejected_reason}:this.holdReload?this.reloadPending=!0:(this.show(r),this.loadHistory(i))}catch{}this.pollIfWaiting()}}stopPolling(){this.pollTimer!==void 0&&window.clearTimeout(this.pollTimer),this.pollTimer=void 0}edit(e,i){let s=this.draft;if(!s||this.saving)return!1;let r=s.apply(e(s.document),this.scrubKey??i);return this.requestUpdate(),r}editPages(e,i){let s=this.pagesDraft;if(!s||this.saving)return!1;let r=this.scrubKey??i,o=s.apply(e(s.document),r===void 0?void 0:{coalesce:r});return this.requestUpdate(),o}endScrub(){window.removeEventListener("pointerup",this.onScrubPointerUp,!0),window.removeEventListener("pointercancel",this.onScrubPointerUp,!0),this.scrubKey!==void 0&&(this.scrubKey=void 0,this.draft?.endCoalesce(),this.flushPending())}memoIcons(){let e=this.icons??zn,i=this.iconMemo;if(i!==void 0&&i.provider===e&&i.tick===this.iconsTick)return i.icons;let s=Yn(e);return this.iconMemo={provider:e,tick:this.iconsTick,icons:s},s}targets(){return{pages:this.pages,statusPages:this.statusPages??this.catalog?.statusPages??[],httpActions:In(this.catalog,this.httpLibrary)?.httpActions??[],phrases:this.voiceDocument===void 0?void 0:xt(this.voiceDocument)}}screen(){let e=this.watches.find(i=>i.owner_watch_id===this.watchId);return(qe(e?.screen_size)??Ne).screen}viewHost(){let e=this.draft,i=this.hass;if(e===void 0||i===void 0)return;let s=this,r=Zt(this.pagesDocument);return{hass:i,icons:this.memoIcons(),symbols:this.symbols,uiState:this.uiState,screen:this.screen(),scale:this.stageScale,switcherPages:r.filter(o=>!o.hidden).map(({hidden:o,...a})=>a),switcherRows:r,switcherSettings:o=>this.switcherSettingsHost(o),get document(){return e.document},get targets(){return s.targets()},get catalogKnown(){return s.catalog!==void 0},get httpLibrary(){return s.httpLibrary===void 0?void 0:s.httpLibrary.revision>0?"held":"empty"},get statusPagesKnown(){return s.statusPages!==void 0},get voice(){return s.voiceContext()},get busy(){return s.saving},edit:(o,a)=>this.draft===e&&this.edit(o,a),endCoalesce:()=>e.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}switcherSettingsHost(e){let i=this.pagesDraft;if(i===void 0||Xe(i.document,e)===void 0)return;let s=this,r=this.memoIcons();return{pageId:e,icons:r,symbols:this.symbols,uiState:this.uiState,get page(){return Xe(i.document,e)??{}},get busy(){return s.saving},edit:(o,a)=>{this.pagesDraft===i&&this.editPages(o,a?.typing===!0?`switcher:${e.toUpperCase()}`:void 0)},endCoalesce:()=>i.endCoalesce(),requestUpdate:()=>this.requestUpdate()}}undo(){this.undoDraft?.undo()&&this.requestUpdate()}redo(){this.undoDraft?.redo()&&this.requestUpdate()}discard(){if(this.saving)return;let e=this.draft?.discard()??!1,i=this.pagesDraft?.discard()??!1;(e||i)&&(this.note={kind:"ok",text:"Edits discarded. Undo brings them back."},this.requestUpdate())}async save(){let e=this.hass,i=this.watchId;this.endScrub();let s=this.draft,r=this.pagesDraft;if(!e||i===void 0||!s||this.saving)return;let o=s.dirty,a=r?.dirty??!1;if(!o&&!a)return;this.note=void 0;let d=o?await this.saveMenus(e,i,s,s.revision<=0):void 0,l=a&&r!==void 0&&this.pagesDraft===r?await this.savePages(e,i,r):void 0;i===this.watchId&&(this.note=_o(d,l))}async saveMenus(e,i,s,r=!1){let o=ts(s,{prepare:Gi,save:(d,l)=>De(e,i,"menus",d,l).catch(u=>{throw Ie(u)}),fetch:async()=>{let d=await H(e,i,"menus").catch(l=>{throw Ie(l)});return{revision:d.revision,document:d.document}}});this.followedSave=s.saveDone,this.requestUpdate();let a=await o.catch(d=>({ok:!1,revision:s.revision,merged:!1,code:Oe(d)??"unknown",message:Yt(d)}));return this.saveEnded(i),gs(r,a.code,br(a))}async savePages(e,i,s){let r=bi(s,{prepare:a=>ki(ai(a),s.base,this.hass?.states),save:(a,d)=>De(e,i,"pages",a,d).catch(l=>{throw Ie(l)}),fetch:async()=>{let a=await H(e,i,"pages").catch(d=>{throw Ie(d)});return{revision:a.revision,document:a.document}}});this.followedPagesSave=s.saveDone,this.requestUpdate();let o=await r.catch(a=>({ok:!1,revision:s.revision,merged:!1,code:Oe(a)??"unknown",message:Yt(a)}));return this.pagesSaveEnded(i),Mn(o)}startFresh(){let e=this.watchId;e===void 0||!bn(this.noRecordState())||(ps("menus",e),this.note=void 0,this.requestUpdate())}closeAsk(){this.renderRoot?.querySelector("dialog.pe-ask")?.close(),this.restoreAsk=void 0}askRestore(e){let i=this.hass,s=this.watchId,r=this.record;if(!i||s===void 0||r===void 0||this.draft?.dirty)return;let o={entry:e,baseRevision:r.revision};this.restoreAsk=o,tn(i,s,"menus",e.revision).then(a=>{this.restoreAsk===o&&(this.restoreAsk={...o,summary:No(a.document)})},()=>{})}async restore(){let e=this.hass,i=this.watchId,s=this.restoreAsk;if(!e||i===void 0||s===void 0||this.restoring)return;this.restoring=!0;let r;try{let o=await nn(e,i,"menus",s.entry.revision,s.baseRevision);r={kind:"ok",text:Zn(s.entry.updated_at)},i===this.watchId?this.restartDraft={watchId:i,revision:o.revision}:(L(i)?.dirty??!1)||$e(i)}catch(o){let a=Oe(o);a==="conflict"?r={kind:"warn",text:"Not restored. The menus changed somewhere else, so the newest copy is shown."}:a==="no_record"?r={kind:"warn",text:"Not restored. Home Assistant no longer holds menus for this watch."}:a==="not_found"?r={kind:"warn",text:"Not restored. That save is no longer kept."}:a==="unknown_command"?(this.historyState="unsupported",r={kind:"warn",text:"This version of the integration cannot restore menus. Update it to restore an earlier save."}):r={kind:"err",text:`Could not restore: ${Hn(o)}`}}finally{this.restoring=!1,this.restoreAsk===s&&this.closeAsk()}i===this.watchId&&(this.note=r,this.load(i,!0))}render(){let e=this.watches,i=this.draft;return c`
      <div class="pe-top">
        ${this.barHost===void 0?this.renderTopBar(i,e):h}
        ${this.note?c`<div class="pe-note ${this.note.kind}" role="status"><span>${this.note.text}</span>
          <button class="pe-link" @click=${()=>{this.note=void 0}}>Dismiss</button></div>`:h}
      </div>
      ${this.renderBody(e)}
      ${this.restoreAsk?this.renderRestoreAsk(this.restoreAsk):h}
    `}get stacked(){return this.narrow||this.hostWidth>0&&this.hostWidth<=Sr}renderTopBar(e,i){let s=e!==void 0&&!this.unsupported,r=s&&this.dirty,o=this.shellOwnsWatch;return c`<div class="wa-bar ${this.barHost!==void 0?"in-head":this.stacked?"stacked":""}" role="toolbar" aria-label="Watch menus">
      ${this.haMenu?c`<button class="icon tb-icon tb-menu" title="Home Assistant menu" aria-label="Home Assistant menu"
        @click=${()=>this.onHaMenu?.()}>${S("menu")}</button>`:h}
      ${o?h:c`<button class="tb-btn tb-back" title="Back to complications"
        @click=${()=>this.onBack?this.onBack():bs(void 0,!1)}>${S("left")}<span>Complications</span></button>`}
      <span class="spacer"></span>
      ${o?h:this.renderWatchPicker(i)}
      ${this.barHost!==void 0&&s?xn({newWatch:this.newWatch,dirty:r,saved:je(this.record)}):h}
      ${this.renderSyncPill(s?e:void 0)}
      ${this.renderTopMenu(s?e:void 0)}
      ${s?c`<button class="primary save ${r?"dirty":""}" ?disabled=${!r||this.saving}
          title=${r?`Save (${Bt}S). A save reaches the watch the next time it checks.`:`Nothing to save (${Bt}S)`}
          @click=${()=>{this.save()}}>${this.saving?"Saving\u2026":"Save"}</button>
        ${this.barHost!==void 0?h:c`<span class="tb-saved" title=${r?"Unsaved changes":""}>${je(this.record)}</span>
        ${vs(ms({newWatch:this.newWatch,dirty:r,saving:this.saving}))}`}`:h}
      ${o?h:c`<button class="tb-btn tb-pages" title="The watch's pages, as Home Assistant keeps them"
        @click=${()=>this.onPages?this.onPages():$s(void 0)}>${S("pages")}<span>Pages</span></button>`}
      ${this.barActions}
      <button class="help" title="Help: the quick menu editor" aria-label="Help"
        @click=${()=>window.open(Ss,"_blank","noopener")}>?</button>
    </div>`}renderSyncPill(e){let i=this.record;if(i===void 0||i.revision<=0||this.unsupported)return h;let s=e===void 0?{size:0,limit:1}:it(e.document),r=Fe({record:i,size:s.size,limit:s.limit,noun:"menus",historyState:this.historyState});return c`<span class="tb-sync ${r.tone==="ok"?"ok":"warn"}" title=${`${r.state}. ${r.help}`}>
      <i class="tb-dot" aria-hidden="true"></i><span class="tb-sync-l">${r.state}</span>
    </span>`}noRecordState(e=this.watches){return vn(e.find(i=>i.owner_watch_id===this.watchId))}opensReady(e=this.watches){return fs(this.noRecordState(e),"menus",this.watchId)}canStartFresh(){return this.watchId!==void 0&&this.newWatch&&!this.opensReady()}renderTopMenu(e){let i=this.canStartFresh();if(e===void 0&&!i)return h;let s=this.topMenuOpen,r=o=>()=>{this.topMenuOpen=!1,o()};return c`<span class="side-menu pe-top-menu">
      <button class="tb-btn tb-more" aria-haspopup="menu" aria-expanded=${s?"true":"false"} aria-label="More actions" title="More"
        @click=${()=>{this.topMenuOpen=!s}}>···</button>
      ${s?c`<div class="pop-menu side-pop" role="menu" aria-label="More actions">
        ${e?c`<button class="row" role="menuitem" ?disabled=${!this.dirty||this.saving}
          title=${this.newWatch?"Go back to the defaults. Undo brings the edits back.":"Go back to the copy Home Assistant holds. Undo brings the edits back."}
          @click=${r(()=>this.discard())}>Discard edits</button>`:h}
        ${i?c`<button class="row" role="menuitem"
          @click=${r(()=>this.startFresh())}>${Le}</button>`:h}
      </div>`:h}
    </span>`}personColor(e){let i=Vn(this.owners.length>0?this.owners:this.ownList??[]);return _n(i.findIndex(s=>s.owners.some(r=>r.owner_watch_id===e)))}renderWatchPicker(e){if(e.length<2)return h;let i=e.find(o=>o.owner_watch_id===this.watchId),s=this.watchMenuOpen,r=o=>{let a=o===void 0?void 0:this.personColor(o);return c`<span class="pe-chip-glyph" style=${a?`--pe-person: ${a}`:h} aria-hidden="true">${S("watch")}</span>`};return c`<span class="picker me-watch-picker">
      <button type="button" class="tb-browse me-watch-btn" aria-haspopup="menu" aria-expanded=${s?"true":"false"}
        title="Choose the watch whose menus are shown" @click=${()=>{this.watchMenuOpen=!s}}>
        ${r(i?.owner_watch_id)}<span class="tb-browse-l">${i?le(i,e):"Choose a watch"}</span>
        <span class="me-caret" aria-hidden="true">${S("chevron")}</span>
      </button>
      ${s?c`<div class="pop-menu me-watch-menu" role="menu" aria-label="Watches">
        ${e.map(o=>{let a=o.owner_watch_id===this.watchId;return c`<button type="button" class="row me-watch-row" role="menuitemradio" aria-checked=${a?"true":"false"}
            @click=${()=>{this.watchMenuOpen=!1,a||this.openWatch(o.owner_watch_id)}}>
            ${r(o.owner_watch_id)}<span class="me-watch-name">${le(o,e)}</span>
            <span class="me-watch-check" aria-hidden="true">${a?S("check"):h}</span>
          </button>`})}
      </div>`:h}
    </span>`}fittedColumns(){return this.hostWidth>0&&this.hostWidth<=Sr?this.columns:Tn(this.hostWidth-Eo,this.columns,Kt)}renderGutter(e){return c`<div class="gutter ${e}" role="separator" aria-orientation="vertical"
      aria-label=${e==="left"?"Resize the menus and slots column":"Resize the settings column"}
      title="Drag to resize. Double-click to reset."
      @pointerdown=${i=>{let s=this.fittedColumns();Rn(i,{side:e,base:e==="left"?s.left:s.right,limits:Kt,onWidth:r=>{this.columns={...this.columns,[e]:r}},onEnd:()=>Ve(Jt,this.columns)})}}
      @dblclick=${()=>{this.columns={...this.columns,[e]:zt[e]},Ve(Jt,this.columns)}}></div>`}get stageScale(){return this.zoom??Je(this.narrow||this.stacked)}setZoom(e){this.zoom=e,Zs(e)}renderStage(e,i){let s=i.find(u=>u.owner_watch_id===this.watchId),r=qe(s?.screen_size),o=r??Ne,a=[...fr(e),o.label],d=this.undoDraft,l=Vt(C(e));return c`<div class="card canvas-card lit me-canvas" aria-label="Menu">
      <div class="cv-head">
        <span class="cv-title" title=${l}>${l}</span>
        ${s!==void 0?c`<span class="cv-part cv-where"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-watch">${le(s,i)}</span></span>`:h}
        <span class="cv-part cv-what"><span class="cv-slash" aria-hidden="true">/</span>
          <span class="cv-shape" title=${r===void 0?`${o.label}, this watch's size is not known`:a.join(" \xB7 ")}><span class="fam">${a.join(" \xB7 ")}</span></span></span>
        <span class="cv-acts">
          <button class="cv-act icon undo" ?disabled=${!d?.canUndo} title=${`Undo (${Bt}Z)`} aria-label="Undo"
            @click=${()=>this.undo()}>${S("undo")}</button>
          <button class="cv-act icon undo" ?disabled=${!d?.canRedo} title=${Mr?"Redo (\u21E7\u2318Z)":"Redo (Ctrl+Y)"} aria-label="Redo"
            @click=${()=>this.redo()}>${S("redo")}</button>
        </span>
      </div>
      <div class="stage-area me-stage-area">
        ${this.renderStageTools(o.label)}
        <div class="me-stage-body">${pr(e)}</div>
        <div class="under"><span class="tail">${mr(e)}</span></div>
      </div>
    </div>`}renderStageTools(e){let i=this.stageScale,s=Je(this.narrow||this.stacked);return c`<div class="stage-tools" role="toolbar" aria-label="Stage tools">
      <button class="tb me-case" aria-disabled="true" tabindex="-1" title=${`This watch's screen, ${e}.`}>
        ${S("watch")}<span class="word keep">${e}</span></button>
      <span class="tb-sep" aria-hidden="true"></span>
      <span class="tb-zoom" role="group" aria-label="Zoom">
        <button class="tb icon me-zoom-out" ?disabled=${i<=Ze(i)} aria-label="Zoom out" title="Zoom out"
          @click=${()=>this.setZoom(Ze(i))}>−</button>
        <button class="tb pct" aria-label=${`Zoom ${se(i)}. Back to fit`}
          title=${`The watch at ${se(i)} of its own points. Click to fit it again (${se(s)}).`}
          @click=${()=>this.setZoom(void 0)}>${se(i)}</button>
        <button class="tb icon me-zoom-in" ?disabled=${i>=Ye(i)} aria-label="Zoom in" title="Zoom in"
          @click=${()=>this.setZoom(Ye(i))}>+</button>
      </span>
    </div>`}renderBody(e){if(e.length===0){let l=this.owners.length===0&&this.ownList===void 0;return c`<div class="pe-empty">${l?"Loading\u2026":"No watch has connected to this Home Assistant yet. Pair one on the Home tab."}</div>`}if(this.unsupported)return c`<div class="pe-empty"><b>${yt}</b></div>`;if(this.loading)return c`<div class="pe-empty">Loading…</div>`;if(this.loadError!==void 0){let l=this.watchId;return c`<div class="pe-empty">
        <span>Could not read this watch's menus: ${this.loadError}</span>
        ${l===void 0?h:c`<button class="pe-btn" @click=${()=>{this.load(l)}}>Try again</button>`}
      </div>`}let i=this.record;if(i===void 0)return c`<div class="pe-empty">Loading…</div>`;let s=this.draft;if(s===void 0&&i.revision>0)return c`<div class="pe-empty"><b>${yt}</b></div>`;if(s===void 0){let l=this.watchId===void 0?void 0:L(this.watchId),u=this.watchId;return c`<div class="pe-empty"><b>${Qi}</b><span>${yn}</span>
        <button class="link start-fresh" @click=${()=>this.startFresh()}>${Le}</button>
        ${l?.dirty&&u!==void 0?c`<span class="pe-warn">Your unsaved edits from before are kept. They come back, merged in, when menus are here again.</span>
          <button class="pe-btn" @click=${()=>{$e(u),this.requestUpdate()}}>Discard the kept edits</button>`:h}
      </div>`}let r=this.viewHost();if(r===void 0)return c`<div class="pe-empty">Loading…</div>`;let o=this.fittedColumns(),a=this.hostHeight>0?`--pe-view-h:${this.hostHeight}px;`:"",d=i.revision<=0;return c`${d&&this.barHost===void 0?ws():h}
    <div class="layout pe-layout ${this.stacked?"cols-1":"cols-3"}" style=${`--wa-left:${o.left}px;--wa-right:${o.right}px;${a}`}>
      <div class="column left">
        ${dr(r)}
        ${ur(r)}
      </div>
      ${this.renderGutter("left")}
      <div class="column canvas">
        ${this.renderStage(r,e)}
      </div>
      ${this.renderGutter("right")}
      <div class="column inspector card">
        ${wr(r)}
      </div>
    </div>
    ${d?h:this.renderFoot(i,s.document,s.dirty)}`}renderFoot(e,i,s){let r=it(i),o=Fe({record:e,size:r.size,limit:r.limit,noun:"menus",historyState:this.historyState}),a=this.watchId;return c`${qn({status:o,historyState:this.historyState,historyOpen:this.historyOpen,rawOpen:this.rawOpen,onHistory:()=>{this.historyOpen=!0},onRaw:()=>{this.rawCopied=!1,this.rawOpen=!0}})}
    ${this.historyOpen?Un({noun:"menus",record:e,entries:this.history,historyState:this.historyState,dirty:s,restoring:this.restoring,onRetry:()=>{a!==void 0&&(this.historyState="loading",this.loadHistory(a))},onRestore:d=>{this.historyOpen=!1,this.askRestore(d)},onClosed:()=>{this.historyOpen=!1}}):h}
    ${this.rawOpen?Fn({noun:"menus",document:i,revision:e.revision,dirty:s,copied:this.rawCopied,onCopy:d=>{Bn(d).then(l=>{this.rawCopied=l})},onClosed:()=>{this.rawOpen=!1}}):h}`}renderRestoreAsk(e){let i=this.record,s=Io(e.entry.updated_at);return c`<dialog class="pe-ask" aria-labelledby="me-ask-title"
      @cancel=${r=>{this.restoring&&r.preventDefault()}}
      @close=${()=>{this.restoreAsk=void 0}}>
      <h3 id="me-ask-title">Restore revision ${e.entry.revision}?</h3>
      <p>${Ao(e.entry.updated_by)}${s?` ${s}`:""}, ${Oo(e.entry.size)}.</p>
      ${e.summary?c`<p class="pe-muted">${e.summary}</p>`:h}
      <p>It is saved again as a new revision${i?`, after revision ${i.revision}`:""}. The copy shown now stays in the earlier saves.</p>
      <div class="pe-ask-foot">
        <button class="pe-btn" ?disabled=${this.restoring} @click=${()=>this.closeAsk()}>Cancel</button>
        <button class="pe-btn pe-primary" ?disabled=${this.restoring} @click=${()=>{this.restore()}}>${this.restoring?"Restoring\u2026":"Restore"}</button>
      </div>
    </dialog>`}static{this.styles=[mn,an,cn,dn,ln,un,hn,pn,ni,ys,de`
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
    /* The lit stage's edge in Menus' hue, Home's Menus door. */
    .canvas-card.me-canvas { --wa-stage-hue: var(--wa-hue-orange); }
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
  `,yr,Kn,kn]}};g([M({attribute:!1})],m.prototype,"hass",2),g([M({attribute:!1})],m.prototype,"owners",2),g([M({attribute:!1})],m.prototype,"ownerId",2),g([M({type:Boolean,reflect:!0})],m.prototype,"narrow",2),g([M({attribute:!1})],m.prototype,"icons",2),g([M({attribute:!1})],m.prototype,"iconsTick",2),g([M({attribute:!1})],m.prototype,"haMenu",2),g([M({attribute:!1})],m.prototype,"onHaMenu",2),g([M({attribute:!1})],m.prototype,"onBack",2),g([M({attribute:!1})],m.prototype,"onPages",2),g([M({attribute:!1})],m.prototype,"barActions",2),g([M({attribute:!1})],m.prototype,"shellOwnsWatch",2),g([M({attribute:!1})],m.prototype,"barHost",2),g([b()],m.prototype,"watchId",2),g([b()],m.prototype,"record",2),g([b()],m.prototype,"unsupported",2),g([b()],m.prototype,"catalog",2),g([b()],m.prototype,"statusPages",2),g([b()],m.prototype,"httpLibrary",2),g([b()],m.prototype,"pagesRecord",2),g([b()],m.prototype,"behavior",2),g([b()],m.prototype,"voiceDocument",2),g([b()],m.prototype,"loading",2),g([b()],m.prototype,"loadError",2),g([b()],m.prototype,"history",2),g([b()],m.prototype,"historyState",2),g([b()],m.prototype,"note",2),g([b()],m.prototype,"restoreAsk",2),g([b()],m.prototype,"restoring",2),g([b()],m.prototype,"historyOpen",2),g([b()],m.prototype,"rawOpen",2),g([b()],m.prototype,"rawCopied",2),g([b()],m.prototype,"ownList",2),g([b()],m.prototype,"topMenuOpen",2),g([b()],m.prototype,"watchMenuOpen",2),g([b()],m.prototype,"zoom",2),g([b()],m.prototype,"columns",2),g([b()],m.prototype,"hostWidth",2),g([b()],m.prototype,"hostHeight",2);customElements.get("wa-menu-editor")||customElements.define("wa-menu-editor",m);export{Jt as ME_COLUMNS_KEY,$r as WATCH_SWITCHER_COLORS,Vo as WATCH_SWITCHER_LEFT_OUT_COLOR,m as WaMenuEditor,_o as joinSaveNotes,Wo as watchMenuPageTargets,No as watchMenusSummary,rc as watchSwitcherPages,Zt as watchSwitcherRows};
